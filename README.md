# Kuali Services

Este proyecto consiste en una solución de microservicios para la gestión de postulaciones laborales y el análisis de candidatos mediante modelos de IA. La solución está compuesta por tres microservicios:

1. **Servicio 1 - Plataforma de Postulaciones:**  
   Permite a los candidatos postularse a ofertas laborales mediante un formulario (con backend y frontend). Los datos se almacenan en MongoDB y se adjunta el CV en formato PDF.

2. **Servicio 2 - Análisis de Candidatos:**  
   Procesa la información del candidato y extrae el contenido de su CV (PDF) utilizando `pdfminer.six`, para enviar esa información a la API de OpenAI y generar un análisis junto con un puntaje de adecuación.

3. **Servicio 3 - Resultados de Candidatos:**  
   Muestra un listado de candidatos ordenados por el puntaje obtenido en el análisis, integrando la información generada por los Servicios 1 y 2. Se implementa con Node.js/Express (backend) y React (frontend).

---

## Arquitectura y Tecnologías

- **Lenguajes y Frameworks:**
  - **Node.js/Express:** Para el backend del Servicio 1 y el Servicio 3, y para los frontends en React.
  - **React:** Para los frontends de los Servicios 1 y 3 (utilizando Material UI y React Router).
  - **Python/Flask:** Para el backend del Servicio 2.
  - **MongoDB:** Almacenamiento de datos (candidatos y análisis).
  - **OpenAI API:** Generación de análisis de candidatos (GPT-4).
  - **pdfminer.six:** Extracción de texto de archivos PDF en el Servicio 2.

- **Contenedores y Orquestación:**
  - **Docker y Docker Compose:** Cada microservicio está dockerizado para facilitar el despliegue y la escalabilidad.
  - **Volúmenes:** Se utilizan volúmenes para compartir datos entre servicios (por ejemplo, archivos de CV).

---
## Configuración y Despliegue

### Requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Pasos para Levantar la Solución

1. **Clonar el Repositorio:**  
   Descarga el código del proyecto desde el repositorio público de GitHub.

2. **Configurar Variables de Entorno:**  
   Asegúrate de que la variable de entorno `OPENAI_API_KEY` esté configurada con tu clave de la API de OpenAI. Esta variable se puede definir en el archivo `docker-compose.yml` o en tu entorno local.

3. **Levantar los Servicios con Docker Compose:**

   ```bash
   docker-compose up --build
   ```
