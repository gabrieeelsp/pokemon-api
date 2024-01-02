# Pokemon-Explorer

Pokemon explorer permite explorar una gran lista de pokemones, también permite crearlos, editarlos y eliminar los pokemones creados.
Para esto hace uso de la api https://pokeapi.co de uso libre y gratuito.
Además utiliza un backend para almacenar los pokemones creados.
Este proyecto se desarrollo como como proyecto individual en el cursado de la carrera de desarrollador Fullstack, en la academia https://SoyHenry.com.
Este proyecto representa el api que se puede ejuctar tanto con node como con docker, haciendo uso del archivo docker-compose.yml.

## Demo
- Puedes acceder a la api de pokemon en el siguiente enlace https://pokemon.backhub.net.ar
- O pueder acceder al proyecto completo desde https://pokemon.gabrieeelsp.dev

## Tecnologías Utilizadas
- JavaScript
- node
- sql
- Sequelize

## Instalación
1. Clona este repositorio.
    - $ git clone git@github.com:gabrieeelsp/pokemon-api.git

2. Ejecuta `npm install` para instalar las dependencias.

## Configuración
- Copiar el archivo .env.example en .env, luego comentar y descomentar las opciones conforme se ejecute en node o en docker.
    - $ cp .env.example .env
    - $ nano .env 

## Ejecutar Localmente
- Ejecuta `npm start`.

## Ejecutar con docker
- Ejecuta `docker compose up -d`.

<!-- ## Uso y Funcionalidades
Descripción detallada sobre cómo interactuar con el frontend y sus principales características.

## Capturas de Pantalla
![Captura de Pantalla 1](ruta/a/imagen.png)
![Captura de Pantalla 2](ruta/a/otra-imagen.png) -->

## Contribución
Si deseas contribuir al proyecto, sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una rama con tu funcionalidad: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y haz commit: `git commit -am 'Agrega una nueva funcionalidad'`
4. Sube tus cambios a tu repositorio: `git push origin feature/nueva-funcionalidad`
5. Crea un Pull Request.

<!-- ## Licencia
Añade detalles sobre la licencia del proyecto si lo deseas. -->
