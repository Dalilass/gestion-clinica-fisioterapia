# Gestión Clínica Fisioterapia

Aplicación web full stack para la gestión básica de una clínica de fisioterapia.

El proyecto permite gestionar pacientes, citas y bonos de sesiones desde una interfaz sencilla y clara. Está desarrollado como una aplicación cliente-servidor: el backend expone una API REST con Spring Boot y persistencia JPA, mientras que el frontend consume esos datos desde una interfaz creada con React y TypeScript.


## Tecnologías utilizadas

### Backend

* Java 17
* Spring Boot
* Spring Data JPA
* Hibernate
* H2 Database
* Maven
* API REST

### Frontend

* React
* TypeScript
* Vite
* CSS
* Fetch API

## Funcionalidades

### Dashboard

* Resumen general de la clínica.
* Total de pacientes.
* Citas pendientes.
* Citas realizadas.
* Ingresos estimados.
* Listado de próximas citas.

### Gestión de pacientes

* Listado de pacientes.
* Búsqueda por nombre o apellidos.
* Creación de nuevos pacientes.
* Edición de datos.
* Eliminación de pacientes.

### Gestión de citas

* Listado de citas.
* Creación de nuevas citas asociadas a pacientes.
* Cambio de estado de una cita:

  * Pendiente
  * Realizada
  * Cancelada
* Eliminación de citas.
* Visualización de fecha, hora, motivo y precio.

### Gestión de bonos

* Listado de bonos de sesiones.
* Visualización de sesiones usadas y sesiones disponibles.
* Barra de progreso.
* Estado del bono:

  * Activo
  * Agotado
* Uso de sesiones desde la interfaz.

## Datos iniciales

La aplicación carga datos ficticios al arrancar para poder probarla sin configuración adicional.

Incluye ejemplos de:

* pacientes
* citas
* bonos de sesiones


## Estructura del proyecto

```text
gestion-clinica-fisioterapia/
├── backend/
│   ├── src/
│   └── pom.xml
├── frontend/
│   ├── src/
│   └── package.json
├── docs/
│   ├── dashboard.png
│   ├── pacientes.png
│   ├── citas.png
│   └── bonos.png
├── README.md
└── .gitignore
```

## Cómo ejecutar el proyecto

Para ejecutar la aplicación es necesario arrancar primero el backend y después el frontend.

### Backend

Requisitos:

* Java 17
* Maven

Desde la carpeta del proyecto:

```bash
cd backend
mvn spring-boot:run
```

El backend se ejecuta en:

```text
http://localhost:8080
```

### Frontend

Requisitos:

* Node.js
* npm

Desde la carpeta del proyecto:

```bash
cd frontend
npm install
npm run dev
```

El frontend se ejecuta en:

```text
http://localhost:5173
```

