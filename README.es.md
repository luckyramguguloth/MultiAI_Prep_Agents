# 🌐 Multi AI Job Prep Agents 🚀

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16--React%2019-black.svg)](https://nextjs.org/)
[![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-v9-blueviolet.svg)](https://docs.pmnd.rs/react-three-fiber/)
[![CrewAI](https://img.shields.io/badge/AI-CrewAI--v1.14-FF9900.svg)](https://crewai.com/)
[![Security: AES-256](https://img.shields.io/badge/Security-AES--256-red.svg)]()

*Un sistema hiperrealista de inteligencia artificial multiagente en 3D diseñado para automatizar todo el proceso de búsqueda y solicitud de empleo.*

[English](README.md) • [Español](README.es.md) • [中文](README.zh.md)

</div>

---

## 🎮 Motor del Espacio de Trabajo 3D (Visualizador Dinámico en Tiempo Real)

A continuación se muestra la simulación en vivo del **Lienzo WebGL 3D Isométrico** ejecutándose en tiempo real. ¡Observa cómo los cubos respiran, rebotan y pulsan a lo largo de la tubería neuronal!

<div align="center">
  <img src="3d_visualizer.svg" width="100%" alt="Visualizador 3D del Espacio de Trabajo" />
</div>

---

## 🏗️ Arquitectura del Sistema

Nuestra arquitectura de orquestación multiagente procesa las ofertas de empleo de manera continua, desde la detección de vacantes hasta la generación de documentos:

```mermaid
graph TD
    subgraph client_layer ["Client Layer (React 19 / R3F)"]
        UI["Next.js WebGL Dashboard"]
        WS_CLIENT["WebSocket WSS Client"]
    end

    subgraph security_layer ["Security Gateway Layer (WAF & Cryptography)"]
        API["FastAPI Gateway Router"]
        LIMIT["SlowAPI DDoS Rate Limiter"]
        CORS["CORS Guard Gate"]
        SEC["AES-256 Cryptography Envelope"]
    end

    subgraph ai_core ["AI Core Layer (CrewAI Orchestrator)"]
        ORCH["Central Telemetry Switch"]
        A1["Step 1: The Scout"]
        A2["Step 2: The Tailor"]
        A3["Step 3: The Submitter"]
        A3_1["Step 3.1: Problem Solver"]
        A4["Step 4: Prep Coach"]
        A5["Step 5: Secure Archivist"]
        A6["Step 6: Efficiency Recycler"]
    end

    subgraph ext_llm ["External LLM Interface"]
        LLM(("OpenAI GPT-4o Engine"))
    end

    subgraph secure_ledger ["Secure Ledger Output"]
        FILE[("Secure Output PDF/JSON Ledger")]
        CACHE[("Reusable Keyword Cache")]
    end

    UI <-->|WebSocket Stream| WS_CLIENT
    WS_CLIENT <-->|Full Duplex WS| API
    API --> LIMIT
    LIMIT --> CORS
    CORS --> SEC
    SEC --> ORCH
    
    ORCH --> A1
    ORCH --> A2
    ORCH --> A3
    ORCH --> A3_1
    ORCH --> A4
    ORCH --> A5
    ORCH --> A6

    A1 -->|Real-time Prompting| LLM
    A2 -->|Real-time Prompting| LLM
    A3 -->|Real-time Prompting| LLM
    A3_1 -->|Real-time Prompting| LLM
    A4 -->|Real-time Prompting| LLM

    A5 --> FILE
    A6 --> CACHE
```

---

## 🛠️ Módulos del Framework

Haz clic en las secciones a continuación para inspeccionar las capas del sistema y sus detalles:

<details>
<summary><b>🧠 1. Núcleo de IA Multiagente (CrewAI y LangChain)</b></summary>
<br>

El núcleo de la aplicación es un pipeline paralelo de 7 agentes configurado en `backend/app/agents/crew.py`. Cada agente opera con una personalidad específica:

*   **🕵️ El Explorador (Scout):** Identifica vacantes de empleo que coincidan con tus filtros.
*   **👔 El Sastre (Tailor):** Reescribe y adapta el currículum del candidato para superar la barrera del 94% en los filtros ATS.
*   **📝 El Solucionador de Problemas (Problem Solver):** Resuelve evaluaciones técnicas y preguntas complejas en los formularios.
*   **📂 El Archivista (Archivist):** Categoriza de forma segura todos los archivos en formato PDF, JSON o Word.
*   **🔄 El Reciclador (Recycler):** Genera cachés locales para acelerar aplicaciones de empleo similares en el futuro.
</details>

<details>
<summary><b>🎮 2. Capa del Lienzo WebGL Interactivo (React Three Fiber y Three.js)</b></summary>
<br>

Nuestra interfaz utiliza un lienzo 3D isométrico que traduce la telemetría en vivo del WebSocket en respuestas visuales físicas:
*   **Sombreadores de Movimiento Dinámico:** Los elementos rotan y flotan asíncronamente mediante bucles de física `useFrame` para asegurar 60 FPS estables.
*   **Controles de Órbita:** Soporte para zoom, arrastre y límites de cámara personalizados en el viewport.
*   **Superposiciones HTML Reactivas:** Tooltips dinámicos siguen a los agentes 3D en tiempo real reflejando sus estados `IDLE`, `WORKING` o `ERROR`.
</details>

<details>
<summary><b>🔒 3. Pila de Seguridad Zero-Trust (AES-256 y SlowAPI)</b></summary>
<br>

El sistema implementa estrictos controles de seguridad para proteger los datos personales del candidato:
*   **Cifrado AES-256 en Reposo:** Todos los documentos y credenciales se encriptan al escribirse usando claves simétricas en `backend/app/core/security.py`.
*   **Cortafuegos (WAF) Throttling:** La API implementa SlowAPI para limitar peticiones (100 por minuto) y prevenir ataques de denegación de servicio (DDoS).
*   **Política Estricta de CORS:** El gateway FastAPI rechaza cualquier origen que no sea el puerto frontend `3000`.
</details>

## 🔑 Guía de Configuración de Claves de API

Para habilitar análisis reales con GPT-4o y adaptaciones de documentos personalizadas, debe configurar las credenciales clave del entorno:

### 1. Obtenga sus Claves de API
*   **Clave de API de OpenAI (`OPENAI_API_KEY`):** Regístrese en su [Plataforma de Desarrolladores de OpenAI](https://platform.openai.com/), navegue a la sección de API Keys y genere un nuevo token secreto (comenzando con `sk-`).
*   **Clave de API de Serper (`SERPER_API_KEY` - Opcional):** Si desea habilitar al agente Scout para realizar búsquedas activas en tiempo real directamente a través del buscador de Google, cree una cuenta gratuita en [Serper.dev](https://serper.dev/) y copie su token de API.

### 2. Configure su archivo `.env`
Cree un archivo llamado `.env` dentro de la carpeta **`backend/`** (o edite el archivo marcador si ya existe) y asigne sus claves de API:

```env
# backend/.env
OPENAI_API_KEY="sk-tu-clave-real-aqui"
SERPER_API_KEY="tu-clave-serper-real-aqui"
```

> [!IMPORTANT]
> **Modo Fallback Activo:** Si los tokens no están configurados o se dejan como marcadores de posición predeterminados, el backend activará automáticamente su motor de extracción semántica interna para reescribir cartas y solucionar evaluaciones en tiempo real sin interrumpir el funcionamiento del sistema dashboard.

---

## 💻 Guías de Configuración para Diferentes Plataformas

### 1. Sistemas Windows (PowerShell y Símbolo del Sistema)

Para inicializar el entorno virtual y ejecutar los servicios localmente en Windows:

```powershell
# Abre una consola y navega al directorio del backend
cd backend

# Crea el entorno virtual (si no se ha creado)
python -m venv venv

# En PowerShell, habilita la ejecución de scripts
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Activa el entorno virtual
.\venv\Scripts\activate

# Sincroniza las dependencias
pip install -r requirements.txt

# Inicia el servidor FastAPI
uvicorn app.main:app --reload --port 8000
```

*Configuración del Frontend:*
```cmd
cd frontend
npm install
npm run dev
```

---

### 2. Sistemas macOS y Linux (Bash y Zsh)

Asegúrate de contar con Python 3.10+ configurado en el sistema antes de iniciar:

```bash
# Navega al directorio del backend
cd backend

# Crea el entorno virtual
python3 -m venv venv

# Activa el entorno virtual
source venv/bin/activate

# Instala dependencias
pip install --upgrade pip
pip install -r requirements.txt

# Inicia el servidor local
uvicorn app.main:app --reload --port 8000
```

*Configuración del Frontend:*
```bash
cd frontend
npm install
npm run dev
```

---

### 3. Implementaciones en Contenedores (Docker y Docker Compose)

Para ejecutar toda la pila (tanto frontend como backend) de forma unificada en cualquier sistema operativo usando Docker:

```bash
# Desde el directorio raíz (que contiene docker-compose.yml)
docker-compose up --build
```
Docker compilará automáticamente las imágenes de backend (`http://localhost:8000`) y frontend (`http://localhost:3000`) estableciendo la comunicación por WebSockets en red interna.

---

## 📂 Arquitectura de Activos Estáticos del Frontend (`frontend/public/`)

El frontend de Next.js aloja sus activos gráficos estáticos bajo la carpeta **`frontend/public/`**. Comprender esta estructura es crucial para mantener la velocidad de renderizado en 3D:

### ¿Por qué se guardan los archivos en `public/`?
*   **Enrutamiento Estático Directo:** Next.js expone el contenido de `public/` en la ruta raíz del host (por ejemplo, `frontend/public/3d_visualizer.svg` está disponible directamente en `http://localhost:3000/3d_visualizer.svg`).
*   **Cero Overhead de Compilación:** Mantener archivos vectoriales complejos o imágenes pesadas (como logos del sistema, fondos e imágenes isométricas) en la carpeta `public/` evita que los compiladores como Webpack o Turbopack los analicen dinámicamente, reservando todos los recursos de GPU para las animaciones y sombreados en el lienzo de Three.js.
*   **Aislamiento y Sincronía:** Guardar `3d_visualizer.svg` tanto en la raíz de Git como en la carpeta `public/` del frontend permite que las vistas previas de Markdown carguen el enlace relativo del repositorio mientras el navegador del cliente lo descarga directamente del servidor local.

---

## 📊 Matriz de Operaciones de Agentes

Technical breakdown of the 8 coordinated agents managed in the orchestrator:

| Identificador | Rol de Agente | Objetivo Operacional | Mensaje de Telemetría |
| :--- | :--- | :--- | :--- |
| `agent_1_scout` | El Explorador | Buscar ofertas que coincidan con filtros. | `"Scouted target vacancies matching..."` |
| `agent_2_tailor` | El Sastre | Optimizar el currículum para superar filtros ATS. | `"Tailored resume for matching keywords. ATS: 97%"` |
| `agent_3_submitter` | El Remitente | Compilar plantillas y preparar payloads de envío. | `"Prepared submission payload..."` |
| `agent_3_1_solver` | Solucionador | Resolver evaluaciones y exámenes técnicos. | `"Generated answers for technical assessments."` |
| `agent_4_coach` | Entrenador | Generar cartas de presentación y guías de entrevista. | `"Generated cover letter and custom prep links."` |
| `agent_5_archivist` | El Archivista | Organizar y guardar archivos de salida de forma segura. | `"Archived tailored resume and prep guides."` |
| `agent_6_recycler` | El Reciclador | Almacenar respuestas y palabras clave útiles. | `"Updated cache repositories with keyword patterns."` |
| `agent_7_orchestrator` | Orquestador | Sincronizar sockets en vivo y ejecutar la Crew. | `"Pipeline successfully completed."` |

---

## 🔌 Especificación de API Gateway y WebSocket

Servicios expuestos en el backend bajo control de SlowAPI. Haz clic en las pestañas para ver los detalles:

<details>
<summary><b>📡 1. POST /api/trigger-pipeline (Multipart Form Data)</b></summary>
<br>

Utilizado por la interfaz para enviar solicitudes de empleo y currículums adjuntos.

*   **Tipo de Petición:** `POST`
*   **Cabeceras:** `Content-Type: multipart/form-data`
*   **Parámetros:**
    *   `jobDescription` (string, Requerido): Descripción de la vacante.
    *   `resume` (Archivo, Opcional): El documento de currículum base.
*   **Respuesta (200 OK):**
    ```json
    {
      "message": "Pipeline triggered successfully. Watch the 3D UI!"
    }
    ```
</details>

<details>
<summary><b>📡 2. WS /ws/agents (Conexión WebSocket)</b></summary>
<br>

Transmite logs en vivo y expedientes técnicos de preparación al lienzo 3D.

*   **URL de Conexión:** `ws://localhost:8000/ws/agents`
*   **Esquema de Estado del Agente:**
    ```json
    {
      "agent_id": "agent_1_scout",
      "status": "WORKING",
      "message": "The Scout is actively processing..."
    }
    ```
*   **Esquema de Fin de Pipeline (`PIPELINE_COMPLETE`):**
    ```json
    {
      "event": "PIPELINE_COMPLETE",
      "atsMatchScore": 97,
      "jobTitle": "React 19 Frontend Lead",
      "coverLetter": "Dear Hiring Manager...",
      "technicalAnswers": [
        { "q": "Question text...", "a": "Answer text..." }
      ],
      "prepLinks": [
        { "title": "LeetCode Algorithmic Route", "url": "https://..." }
      ]
    }
    ```
</details>

---

## 🛠️ Guía de Diagnóstico y Resolución de Problemas

Si experimentas problemas durante la ejecución, despliega las secciones para ver las soluciones:

<details>
<summary><b>🔍 1. Pydantic ValidationError (Conflictos de Dependencia)</b></summary>
<br>

*   **Síntoma:** El backend falla al arrancar indicando: `pydantic_core._pydantic_core.ValidationError: 2 validation errors for Agent`.
*   **Causa:** Las librerías LangChain y CrewAI están desalineadas en tu entorno virtual local, causando un fallo de validación en la propiedad `llm` bajo Pydantic v2.
*   **Solución:** Sincroniza las dependencias en tu entorno virtual:
    ```powershell
    .\venv\Scripts\activate
    pip install --upgrade crewai langchain-core langchain-openai
    ```
</details>

<details>
<summary><b>🔍 2. Conflicto de Puerto (Address Already in Use)</b></summary>
<br>

*   **Síntoma:** El backend o frontend muestran `listen EADDRINUSE: address already in use :::8000` o `:::3000`.
*   **Causa:** Un proceso anterior de uvicorn o next dev sigue activo en segundo plano.
*   **Solución:** Termina el proceso ocupante desde Windows PowerShell:
    ```powershell
    # Liberar puerto 8000
    Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
    
    # Liberar puerto 3000
    Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
    ```
</details>

<details>
<summary><b>🔍 3. WebSocket Desconectado (WSS en estado "disconnected")</b></summary>
<br>

*   **Síntoma:** El HUD del panel muestra `WSS: disconnected` en color rojo.
*   **Causa:** El servidor de FastAPI no se está ejecutando o los puertos de CORS están bloqueados.
*   **Solución:** Comprueba que `uvicorn` se está ejecutando en `http://localhost:8000` y revisa las políticas de CORS en `backend/app/main.py`.
</details>

---

## 🤝 Soporte, Problemas y Comentarios

Si experimenta algún error, cuello de botella en las librerías o tiene sugerencias sobre la estructura de agentes de IA, los lienzos WebGL 3D o el pipeline general:
*   **Abra un Issue:** Por favor navegue a la pestaña de **Issues** en el repositorio de GitHub y haga clic en **New Issue**.
*   **Pautas:** Proporcione una descripción detallada de la anomalía, las versiones de su entorno de desarrollo local y capturas de los logs del sistema si es aplicable.
*   **Feedback:** ¡Las contribuciones y Pull Requests para enriquecer los modelos 3D o añadir nuevos agentes de IA son altamente bienvenidas!

---

## 🙋 ¡No dudes en abrir un Issue!

¿Tienes preguntas sobre el proceso de orquestación de agentes, encontraste un obstáculo en el pipeline o quieres sugerir mejoras para el framework?

¡No dudes en abrir un ticket en la pestaña **Issues** de este repositorio de GitHub! Ya sea sobre:
*   **La Orquestación Multiagente de IA:** Lógica de agentes, diseño de prompts, transmisiones de telemetría o integración con CrewAI/LangChain.
*   **El Dashboard WebGL 3D:** Configuraciones de sombras WebGL, módulos glasomórficos CSS responsivos, superposiciones de lienzo o animaciones 3D.
*   **Despliegue del Sistema y Scripts:** Configuraciones de entornos locales, entornos virtuales, imágenes Docker o consultas sobre la ejecución en CLI.

Monitoreamos activamente el tablero de seguimiento de problemas y haremos todo lo posible para guiarte a resolver cualquier obstáculo de despliegue. ¡Hagamos que este framework sea más robusto juntos! 🚀

---

## 🛡️ Descargo de Responsabilidad de Seguridad

Esta aplicación procesa datos personales altamente sensibles (currículums, información de identificación personal, claves de API). **NO** deshabilite los cifrados AES-256 de `security.py` ni los rate limiters de `slowapi` al desplegar en la nube. Use siempre HTTPS en producción.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Revise el archivo `CONTRIBUTING.md` para ver las pautas sobre cómo añadir nuevos modelos 3D o agentes de IA.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT; consulte el archivo [LICENSE](LICENSE) para obtener más detalles.
