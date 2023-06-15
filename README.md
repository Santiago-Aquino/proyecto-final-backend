# Proyecto Final - Programacion Backend

Este proyecto es un ecommerce en el cual vas a poder:

- registrarte
- iniciar sesion con tu cuenta
- ver productos
- agregar productos al carrito
- comprar carrito, el cual genera un ticket y se te envia por mail
- acceso a un chat

> y otras funcionalidades en las cuales se te explican abajo.

## Para iniciar la aplicacion

- Debera descargar los paquetes del package.json poniendo en la consola "npm install"
- Debera ejecutar el comando en la consola "npm run start"
- Podra ingresar a la vista de registro en "http://localhost:8080/register" para empezar navegar por el ecommerce

## Informacion de las APIS

El proyecto cuenta con varias APIS, que son:

- session
- products
- carts
- users
- tickets
- messages

> Para acceder a ellas debera ingresar la URL /api/nombreDeLaApi/accion

## Documentacion de las APIS principales

Otra informacion aparte es que ingresando a "http://localhost:8080/apidocs/" podremos ver todos los endpoints importantes para cada API y poder probarlos alli mismo.

## Persistencia

El proyecto esta construido para poder trabajar tanto con la persistencia de la DB MongoDB y tanto con la persistencia de FileSystem (con archivos). De todas maneras esta por defecto para que trabaje con MongoDB ya que es mejor que trabaje con una base de datos.

## Vistas

La aplicacion cuenta con unas vistas para que el usuario pueda ingresar en ellas:

- Vista de registro de un usuario
- Vista de logeo de un usuario
- Vista de los productos
- Vista de tu carrito (si es que lo creaste)
- Vista de un chat para poder hablar con los demas usuarios
- Vista para reestablecer la password
- Vista para ver los usuarios (esta solo tiene acceso el admin el cual estare proporcionando los datos abajo)

## Administrador del Ecommerce

El usuario administrador tiene como email "adminCoder@coder.com" y como password "admincoder2321", de todas formas ya lo cree por vos, solo tenes que logearte con estos datos en la vista de login.

## Test

Los test deben ejecutarse de la siguiente forma:

- Como se explico al principio, debera ingresar en la consola "npm run start" para iniciar la aplicacion.
- En otra consola debe ejecutar "npm run test", ya que el servidor necesita estar escuchando desde la "primer consola" como lo dice en el punto anterior.

### Rutas adicionales

- La ruta /mockingproducts da como respuesta 100 productos al azar gracias a una libreria llamada "faker", como si fueran desde MongoDB pero esta no hace ninguna modificacion en el programa.
- La ruta /loggerTest arroja todos los loggers en la aplicacion.
- La ruta /api/users pero con el metodo DELETE, lo que hara es eliminar a todos los usuarios que no tuvieron conexion al ecommerce en los ultimos dos dias y mandarles un mail por aviso (si es que los hay).

### Cosas a tener en cuenta

- en el archivo config.js de la carpeta config (en src) la aplicacion se esta ejecutando en el entorno productivo, para cambiarlo solo tenes que cambiar en la linea 5 "PRODUCTION" por "DEVELOPMENT"
- al estar en el entorno productivo cuando hagamos un GET al endpoint "/loggerTest" se mostraran por consola los loggers a partir del nivel info, si queremos ver todos los loggers hay que cambiar al entorno desarrollo como esta explicado en el item anterior
