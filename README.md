# RTC — Road to Challenger | LoL AI Performance Analyzer

Plataforma de análisis táctico y evaluación algorítmica para partidas de League of Legends construida bajo principios de **Clean Architecture** y buenas prácticas de ingeniería de software.

El sistema procesa los datos del endpoint `Match-v5 Timeline` de Riot Games, normaliza las coordenadas espaciales de la Grieta del Invocador, detecta fallos de posicionamiento en ventanas críticas de objetivos neutrales y emite un informe estructurado de rendimiento.

---

## Características de Ingeniería

* **Clean Architecture & SOLID:** Desacoplamiento total entre las capas de Dominio, Casos de Uso, Infraestructura y Presentación.
* **Auto-documentación (Clean Code):** Código libre de comentarios basado en nombres con intención clara, funciones puras y tipado estricto en TypeScript.
* **Normalización Espacial:** Transformación del espacio de coordenadas de Riot Games $(0, 0 \rightarrow 15000, 15000)$ a un sistema porcentual $(0\% - 100\%)$ con inversión de eje vertical para renderizado web en Canvas/SVG.
* **Detección de Ventanas Tácticas:** Algoritmo que correlaciona muertes de jugadores con apariciones o disputas de monstruos épicos (Dragón, Heraldo, Barón) en un umbral de 45 segundos.
* **Zero-Friction Demo Mode:** Incluye datos sintetizados (*fixtures*) para permitir pruebas inmediatas sin depender de credenciales activas de Riot API.

---

## Arquitectura del Sistema

```text
src/
├── core/                         # Capa de Dominio y Casos de Uso
│   ├── domain/
│   │   ├── entities/             # Entidades del negocio (Match, Timeline, Evaluation)
│   │   └── services/             # Lógica pura (CoordinateNormalizer)
│   ├── ports/                    # Interfaces y contratos (RiotRepository, AiAnalyzer)
│   └── use-cases/                # Casos de uso desacoplados (ProcessMatchTimeline)
├── infrastructure/               # Adaptadores externos y configuración
│   ├── api/                      # Clientes HTTP (RiotApiClient, AiAnalyzerClient)
│   ├── config/                   # Validación de entorno con Zod
│   └── fixtures/                 # Datos de prueba para modo demo
└── presentation/                 # Capa de Interfaz de Usuario
    ├── components/
    │   ├── map/                  # Renderizado del minimapa 2D de la Grieta
    │   └── score/                # Tarjetas de calificación y métricas
    └── app/                      # Rutas y controladores de Next.js (App Router)

Stack Tecnológico
Framework: Next.js 15+ (App Router)

Lenguaje: TypeScript (Strict Mode)

Estilos: Tailwind CSS

Validación de Schemas: Zod

Iconografía: Lucide React

Cliente HTTP: Axios

Instalación y Puesta en Marcha
1. Clonar el repositorio
git clone [https://github.com/TU_USUARIO/TU_REPOSITORIO.git](https://github.com/TU_USUARIO/TU_REPOSITORIO.git)
cd TU_REPOSITORIO

2. Instalar dependencias
npm install

3. Configurar variables de entorno
Copia el archivo de ejemplo:
cp .env.example .env.local
Opcionalmente, puedes añadir una clave de desarrollador de Riot Developer Portal:
RIOT_API_KEY=RGAPI-tu-clave-aqui
(Si no se especifica una clave, el sistema operará utilizando las partidas de muestra en modo demo).

4. Ejecutar el servidor de desarrollo
npm run dev

Abre http://localhost:3000 en el navegador y pulsa Cargar Partida Demo.

Licencia
Distribuido bajo la Licencia MIT.