# Como correr el api en local con docker

## crear imagen del aplicativo

para poder crear la imagen del aplicativo boquea sol backend tiene que ir al directorio backend y luego ejecutar el comando

```bash
docker build -t bloquea-sol:0.1 .
```

Este comando lo que realizara sera una imagen del aplicativo, la cual podras revisar si existe con el siguiente comando que te lista las imagenes que tengas

```build
docker images
```

## crear contenedor

Cuando ya tengas tu imagen creada se debe de ejecutar este comando para ejecutar el contenedor

```bash
docker run -p 10000:10000 bloquea-sol:0.1
```

esto ejecuta la aplicacion en el puerto 10000 de tu localhost 


## endpoints

POST http://localhost:10000/login

POST http://localhost:10000/medicion

get GET http://localhost:10000/api/v1/mediciones/last

### urls remotas

https://bloqueasol.onrender.com --> api

https://bloqueasol-2.onrender.com/index.html --> pagina web 


https://dashboard.render.com/static/srv-d1gsd3ngi27c73c2rqvg/deploys/dep-d1gsd3vgi27c73c2rr70

---> pagina de administracion de pagina