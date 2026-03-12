# Schedio

## Índice

1. [Introducción](#1-introducción)
2. [Ficha técnica](#2-ficha-técnica)
   - [2.1 Núcleo tecnológico](#21-núcleo-tecnológico)
   - [2.2 Stack de desarrollo y dependencias](#22-stack-de-desarrollo-y-dependencias)
     - [2.2.1 Backend (Servidor API)](#221-backend-servidor-api)
     - [2.2.2 Frontend (Cliente Web)](#222-frontend-cliente-web)
3. [Guía de instalación](#3-guía-de-instalación)
4. [Diagramas asociados](#4-diagramas-asociados)
   - [4.1 Diagrama entidad relación de la base de datos](#41-diagrama-entidad-relación-de-la-base-de-datos)
   - [4.2 Diagrama de componentes](#42-diagrama-de-componentes)
   - [4.3 Diagrama de despliegue](#43-diagrama-de-despliegue)
   - [4.4 Diagramas de flujo de datos](#44-diagramas-de-flujo-de-datos)
     - [4.4.1 Módulo de calificaciones](#441-módulo-de-calificaciones)
     - [4.4.2 Agenda personal](#442-agenda-personal)
5. [Flujo de trabajo](#5-flujo-de-trabajo)
6. [Prototipo de alta fidelidad](#6-prototipo-de-alta-fidelidad)
7. [Pruebas](#7-pruebas)
   - [7.1 End to End](#71-end-to-end)
   - [7.2 API](#72-api)
   - [7.3 Rendimiento](#73-rendimiento)
    

---

## 1. Introducción

El presente proyecto representa un aplicativo web realizado para la asignatura de Aplicaciones con la Tecnología Internet II de la Escuela de Computación de la Universidad Central de Venezuela. El proyecto consiste en un planificador personal para que los estudiantes puedan llevar registro de sus actividades académicas, así como gestionar sus responsabilidades.

La aplicación cuenta con una agenda que permita gestionar horarios, eventos (como entregas de asignaciones), una lista de cosas por hacer, y establecer recordatorios.

El objetivo es contar con una plataforma centralizada en la que los usuarios puedan consultar sus responsabilidades, con la posibilidad de establecer módulos adicionales para adaptarse a las necesidades de los usuarios.

Esta propuesta por módulos tiene por objetivo mantener la cualidad de escalabilidad para el proyecto. Entre algunos de los posibles módulos a implementar contamos con:

- Rastreador de hábitos: Los usuarios serán capaces de registrar buenos hábitos de los cuales podrán configurar contadores de rachas y cada cuantos días se deben renovar o realizar para mantener el hábito.

- Cursos: Destinado para estudiantes, permite establecer cursos, asignaciones, calificaciones y consultar el estado y progreso en la asignatura.

- Calendarios compartidos: Se establecen calendarios grupales entre 2 o más usuarios, donde las personas pertenecientes al grupo podrán ver los eventos de otros y establecer eventos compartidos.

Algunas aplicaciones similares a esta propuesta son:

- Todoist: Plataforma rápida para listas de pendientes.
- Habitica: Aplicación de hábitos y productividad personal que implementa gamificación.

---

## 2. Ficha técnica

El ecosistema de Schedio está desarrollado bajo un stack de tecnologías modernas enfocadas en el rendimiento y la escalabilidad, utilizando una arquitectura desacoplada de Frontend y Backend.

### 2.1 Núcleo tecnológico

| Componente | Tecnología | Versión | Rol |
| :--- | :--- | :--- | :--- |
| Frontend | Angular | `21.1.0` | Framework para la interfaz de usuario (SPA/SSR) |
| Backend** | Express | `5.2.1` | Framework de servidor web y API REST |
| Base de Datos**| MongoDB | `9.1.6` | (Mongoose) Modelado de datos y persistencia |
| Entorno | Node.js | `20.17.x` | Entorno de ejecución (basado en `@types/node`) |
| Paquetes | NPM | `10.9.3` | Gestor de dependencias oficial del proyecto |

---

### 2.2 Stack de desarrollo y dependencias

#### 2.2.1 Backend (Servidor API)
* Seguridad: `bcryptjs ^3.0.0` (Hasing de credenciales).
* Migraciones de DB: `migrate-mongo ^14.0.7` (Control de versiones de esquema).
* Gestión de Entornos: `cross-env` y `dotenv` para perfiles de `dev`, `qa` y `prod`.
* Testing: * `Jest ^30.2.0` (Motor de pruebas).
  * `Supertest ^7.2.2` (Pruebas de integración HTTP).
  * `mongodb-memory-server` para bases de datos efímeras en tests.

#### 2.2.2 Frontend (Cliente Web)
* **Renderizado:** Soporte nativo para **SSR** (Server Side Rendering) mediante `@angular/ssr`.
* **Lenguaje:** `TypeScript ~5.9.2`.
* **Estado y Reactividad:** `RxJS ~7.8.0`.
* **Testing Unitario:** `Vitest ^4.0.8` con entorno `jsdom`.
* **Formateo de Código:** `Prettier` (configurado para Angular).

## 3. Guía de instalación

Este proyecto puede ser ejecutado utilizando el comando docker compose up --build en la carpeta raíz del proyecto. Sin embargo, y si se desea, tambien puede ser levantado de manera local haciendo la siguiente secuencia de pasos:

- En la carpeta del frontend o del backend:
  -  Hacer npm install.
  -  Ejecutar el comando npm run start:dev, npm run start:qa o npm run start:prod en función del ambiente que se quiera levantar y su respectiva base de datos.

Tras levantar la aplicación con Docker, el frontend será accesible a través del puerto 4200 de nuestro computador mientras el backend se encuentra disponible en el puerto 3000. 

## 4. Diagramas asociados

### 4.1 Diagrama entidad relación de la base de datos

<img width="1653" height="814" alt="Diagrama entidad relación" src="https://github.com/user-attachments/assets/bc542f88-1de6-495b-b5a8-37b034c17b82" />

### 4.2 Diagrama de componentes

<img width="539" height="277" alt="Diagrama de componentes" src="https://github.com/user-attachments/assets/c671c0b0-83c6-4890-8bb4-9731fb8eb431" />

### 4.3 Diagrama de despliegue

<img width="881" height="471" alt="Diagrama de despliegue Schedio" src="https://github.com/user-attachments/assets/96cb0dc6-9ab9-4c68-ab5f-00284a541054" />

### 4.4 Diagramas de flujo de datos

#### 4.4.1 Módulo de calificaciones

<img width="811" height="481" alt="Diagrama de flujo de datos en módulo de calificaciones" src="https://github.com/user-attachments/assets/8bf9c650-a15d-4cb2-8779-3c4a2daffc6d" />

#### 4.4.2 Agenda personal

<img width="501" height="411" alt="Diagrama de flujo de datos en módulo de agenda personal" src="https://github.com/user-attachments/assets/d82591de-84ab-4a8d-b265-7437c0409683" />

---

## 5. Flujo de trabajo.

A modo de organizar y conocer mejor en qué está trabajando cada miembro del equipo, el repositorio posee una integración con la herramienta Jira de manera que el status de las tareas se modifique de manera automática de acuerdo a la interacción de los desarrolladores con Git. Para ello, los desarrolladores deben seguir convenciones a la hora de crear sus ramas siguiendo la siguiente convención para el nombre: 

{feature,hotfix,bugfix,tests}/SCH-[0-9][0-9]-((A-z)-?)*

Cuando esta rama sea publicada en el repositorio remoto, la tarea de jira se moverá automáticamente a "En curso". Luego, cuando se genere el PR a develop y los cambios se aprueben y pasen a dicha rama, la tarea pasará de estar "En curso" a "Finalizada".

## 6. Prototipo de alta fidelidad.

<img width="1920" height="1024" alt="Wireframe  US-1_ Crear Tarea" src="https://github.com/user-attachments/assets/56189507-d6cd-4ece-b2b1-ff240e305303" />

<img width="1920" height="1024" alt="Wireframe US-2_ Ver Calendario (consulta de tareas)" src="https://github.com/user-attachments/assets/b844c836-964e-4775-83b3-bfd95390e920" />

<img width="1920" height="1024" alt="Wireframe US-3_ Registrar Hábitos" src="https://github.com/user-attachments/assets/26a83d17-7983-4215-8b15-7bfe39b21124" />

<img width="1920" height="1024" alt="Wireframe US-4 V-2_ Ver Rachas de Habitos" src="https://github.com/user-attachments/assets/ca5f520f-d14b-457b-8fa4-c2d68ad3a3b8" />

<img width="1920" height="1024" alt="Wireframe US-4_ Ver Rachas de Habitos" src="https://github.com/user-attachments/assets/b6fa7538-1538-42aa-9c64-c9a86c74f650" />

<img width="1920" height="1024" alt="Wireframe US-30 V-2_ Ver progreso tareas" src="https://github.com/user-attachments/assets/dbe4a039-509d-470f-9bce-237cbe2bdded" />

<img width="1920" height="1024" alt="Wireframe US-30 2_ Ver Progreso Cursos" src="https://github.com/user-attachments/assets/e65006bc-0662-47c2-acd6-67e6d93b71a7" />

<img width="1920" height="1024" alt="Wireframe US-30_ Ver progreso tareas" src="https://github.com/user-attachments/assets/4c2fbc64-f20d-4357-b41e-401da5f6a78f" />

## 7. Pruebas.

Para ejecutar las pruebas es necesario ejecutar los siguientes comandos desde la raíz del proyecto:

### 7.1 End to End.
docker build -f tests/e2e/Dockerfile.e2e -t schedio-e2e-tests tests/e2e
docker run --network="schedio_default" schedio-e2e-tests

<img width="872" height="620" alt="image" src="https://github.com/user-attachments/assets/1a748027-3791-41aa-b5aa-527464e0c5fe" />
<img width="885" height="629" alt="image" src="https://github.com/user-attachments/assets/356e2534-dea2-4326-80bc-8e43fe362f30" />
<img width="735" height="166" alt="image" src="https://github.com/user-attachments/assets/549c0170-b080-4af2-9d01-cfca9817ea70" />


### 7.2 API
docker build -t schedio-api-tests -f tests/api/Dockerfile.test tests/api/
docker run --network="schedio_default" schedio-api-tests

<img width="801" height="797" alt="image" src="https://github.com/user-attachments/assets/61c40d6c-883d-4ff1-8b9c-8949a22a4642" />
<img width="821" height="747" alt="image" src="https://github.com/user-attachments/assets/c20e4845-3863-4487-95dd-456a58bc1c01" />

### 7.3 Rendimiento.

<img width="1557" height="679" alt="image" src="https://github.com/user-attachments/assets/eea7ccf7-f94e-4b61-a6f3-08b25444ddec" />
<img width="1600" height="840" alt="image" src="https://github.com/user-attachments/assets/32d83605-37ae-45b3-b82a-2a917377a605" />


