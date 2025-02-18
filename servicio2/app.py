from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import openai
import pymongo
import re
from pdfminer.high_level import extract_text
from bson import ObjectId
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuración de la API de OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Carpeta temporal para archivos subidos (para procesar archivos enviados en la petición)
UPLOAD_FOLDER = '/tmp/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Conexión a MongoDB: Se usa la base de datos "servicio1" para candidatos y análisis
mongo_client = pymongo.MongoClient("mongodb://mongo:27017/")
db = mongo_client["servicio1"]
applications_collection = db["applications"]
analysis_collection = db["analysis_results"]

def normalize_file_path(file_name):
    """
    Dado el nombre del archivo (guardado en la DB), genera la ruta absoluta
    usando la ruta estática: /servicio1/backend/uploads.
    """
    # Reemplazar barras invertidas por barras normales
    file_name = file_name.replace("\\", "/")
    base_name = os.path.basename(file_name)
    static_path = "/servicio1/backend/uploads"
    normalized = os.path.join(static_path, base_name)
    print(f"[LOG] Normalized file path: {normalized}")
    # Listar contenido de la carpeta estática para depuración
    if os.path.exists(static_path):
        print(f"[LOG] Contenido de {static_path}: {os.listdir(static_path)}")
    else:
        print(f"[ERROR] La carpeta estática {static_path} no existe.")
    return normalized

def extract_pdf_text(file_name, max_length=10000):
    """
    Lee el archivo a partir de su nombre (usando la ruta estática) y extrae el texto usando pdfminer.
    """
    file_path = normalize_file_path(file_name)
    if not os.path.exists(file_path):
        print(f"[ERROR] El archivo no existe en la ruta: {file_path}")
        return ""
    try:
        text = extract_text(file_path)
        if text:
            if len(text) > max_length:
                text = text[:max_length] + "\n... [truncado]"
            return text.strip()
        else:
            print(f"[ERROR] No se pudo extraer texto del PDF: {file_path}")
            return ""
    except Exception as e:
        print(f"[ERROR] Error al extraer texto del PDF ({file_path}): {e}")
        return ""

def extract_score(analysis_text):
    """
    Extrae el puntaje del análisis usando una expresión regular.
    Se espera un formato: "Puntaje: <número>"
    """
    match = re.search(r'Puntaje:\s*(\d+)', analysis_text, re.IGNORECASE)
    if match:
        score = int(match.group(1))
        return score
    else:
        print("[LOG] No se encontró puntaje en el análisis.")
        return 0

def analyze_candidate(candidate, pdf_text=""):
    prompt = (
        "Analiza la siguiente información del candidato y responde en el siguiente formato:\n"
        "Puntaje: <puntaje numérico>\n"
        "Análisis completo: <tu análisis aquí>\n\n"
    )
    prompt += f"Nombres: {candidate.get('nombres')}\n"
    prompt += f"Teléfono: {candidate.get('telefono')}\n"
    prompt += f"Experiencia Laboral: {candidate.get('experienciaLaboral')}\n"
    prompt += f"Estudios: {candidate.get('estudios')}\n"
    
    if pdf_text:
        prompt += f"\nContenido del CV (extraído del PDF):\n{pdf_text}\n"
    else:
        prompt += "\nNo se adjuntó archivo PDF o no se pudo extraer el texto del PDF.\n"
    
    prompt += "\nPor favor, analiza la información y proporciona el puntaje y el análisis completo."
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",  # Verifica que este modelo esté disponible para tu cuenta
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7
        )
        result = response.choices[0].message.content.strip()
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("[ERROR] Error al llamar a la API de OpenAI:", e)
        return "No se pudo realizar el análisis debido a un error en la API de OpenAI."

@app.route('/analysis/<candidate_id>', methods=['GET'])
def get_analysis(candidate_id):
    try:
        record = analysis_collection.find_one({"candidate_id": candidate_id})
        if record:
            print(f"[LOG] Se encontró análisis para el candidato {candidate_id}")
            return jsonify({
                "exists": True,
                "analysis": record.get("analysis"),
                "score": record.get("score", 0)
            })
        else:
            print(f"[LOG] No se encontró análisis para el candidato {candidate_id}")
            return jsonify({"exists": False})
    except Exception as e:
        print("[ERROR] Error al obtener análisis:", e)
        return jsonify({"error": "Error al obtener el análisis"}), 500

@app.route('/analyze/<candidate_id>', methods=['POST'])
def analyze(candidate_id):
    try:
        candidate = applications_collection.find_one({"_id": ObjectId(candidate_id)})
    except Exception as e:
        return jsonify({"error": "ID inválido"}), 400

    if not candidate:
        return jsonify({"error": "Candidato no encontrado"}), 404

    pdf_text = ""
    if 'cv' in request.files:
        file = request.files['cv']
        if file.filename != "":
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            # Extraer el texto del PDF usando el nombre (se normaliza la ruta interna)
            pdf_text = extract_pdf_text(filename)
            os.remove(file_path)
    else:
        cv_name = candidate.get("cvPath")
        if cv_name:
            pdf_text = extract_pdf_text(cv_name)
    
    analysis_result = analyze_candidate(candidate, pdf_text)
    score = extract_score(analysis_result)
    analysis_record = {
        "candidate_id": candidate_id,
        "analysis": analysis_result,
        "score": score
    }
    existing = analysis_collection.find_one({"candidate_id": candidate_id})
    if existing:
        analysis_collection.update_one({"candidate_id": candidate_id}, {"$set": analysis_record})
    else:
        analysis_collection.insert_one(analysis_record)

    return jsonify({
        "message": "Análisis completado",
        "analysis": analysis_result,
        "score": score
    })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
