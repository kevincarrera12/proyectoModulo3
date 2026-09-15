
## Versiones

Angular declara Node ^22.22.3 || ^24.15.0 || >=26.0.0.

    npm install -g nativescript@9.1.1
    ns doctor

Android requiere Android Studio/SDK, JDK configurado y dispositivo o emulador. Configuración nativa del proyecto: compile/target SDK **35**, Build Tools **35**, mínimo Android API **24**. 

## URL del servidor

En src/config/environment.ts usar solo el dominio y puerto, sin /pedidos ni ?codigoTienda=1. Si se usa ngrok, colocar el dominio del túnel activo; el dominio de desarrollo incluido puede dejar de estar disponible.
