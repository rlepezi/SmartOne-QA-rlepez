Instalación de Dependencias
Como el proyecto tiene dos entornos separados (Frontend y Backend), hay que instalar las librerías en ambos:

Frontend:

Bash
cd client
npm install
Backend (Functions):

Bash
cd functions
npm install



Configuración de Variables de Entorno (.env)
Los archivos .env fueron ignorados por Git. Debes crearlos manualmente basándote en los siguientes valores:

En /client/.env:

VITE\_API\_URL\_LOCAL=http://127.0.0.1:5001/smartone-qa/us-central1/api
VITE\_API\_PROD\_URL=https://us-central1-smartone-qa.cloudfunctions.net/api
VITE\_FIREBASE\_API\_KEY=AIzaSyDoSO2RQp6txg3hWX2VShnBq5A8wk0PWuQ
VITE\_FIREBASE\_AUTH\_DOMAIN=smartone-qa.firebaseapp.com
VITE\_FIREBASE\_PROJECT\_ID=smartone-qa
VITE\_FIREBASE\_STORAGE\_BUCKET=smartone-qa.firebasestorage.app
VITE\_FIREBASE\_MESSAGING\_SENDER\_ID=413645581018
VITE\_FIREBASE\_APP\_ID=1:413645581018:web:a2bb7c910afb396ac793e3



Ejecución del Entorno de Desarrollo
Para trabajar, se deberá abrir dos terminales:

Terminal 1 (Backend - Emuladores):
Yo uso Power Shell(Como administrador)

En la raíz del proyecto

firebase emulators:start --only functions



Terminal 2 (Frontend - Vite):
Desde Terminal de Cursor
cd client
npm run dev





//\*\*\*\*\*
Acceso al proyecto SmartOne-QA de cuenta firebase/Google
usuario: lepederer@gmail.com

He dado permisos de acceso a tu cuenta rlepez@gmail.com.
Debes ingresar a firebase desde tu cuenta rlepez y ver en los proyectos.

