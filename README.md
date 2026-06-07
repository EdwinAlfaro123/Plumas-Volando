<p align="center">
  <img src="./README-banner.png" alt="Plumas Volando banner" width="100%" />
</p>

# Plumas Volando

**Plumas Volando** es una plataforma web desarrollada como proyecto formativo para apoyar la gestión de una empresa avícola salvadoreña. El sistema reúne una **web pública**, un **panel administrativo** y un **backend** para facilitar la venta y administración de productos como huevos, gallinas, pollo e insumos.

Su propósito es ayudar a la empresa a llevar un mejor control de productos, pedidos, clientes, empleados, facturación y ventas, además de ofrecer una experiencia más clara para el público.

## Integrantes

- Joshua Daniel Gonzalez Perez
- Daniel Alejandro Alvarado Tobar
- Edwin Geovanny Alfaro Alfaro
- Diego Josue Rodriguez Alvarado

## ¿Qué incluye este repositorio?

- **Frontend público**: sitio orientado a clientes y visitantes.
- **Frontend admin**: panel para la gestión interna del negocio.
- **Backend**: API REST y conexión con la base de datos.

## Tecnologías utilizadas

### Frontend Admin
- React
- Vite
- React Router DOM
- Axios
- Lucide React
- CSS

### Frontend Público
- React
- Vite
- React Router
- EmailJS
- Leaflet / React Leaflet
- Lucide React
- CSS

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- Bcryptjs
- Cookie Parser
- CORS
- Nodemailer
- Cloudinary
- Multer
- Dotenv
- Nodemon

## Estructura general

```bash
Plumas-Volando/
├── backend/
├── frontend/
│   ├── PlumasVolandoAdmin/
│   └── PlumasVolandoPublic/
└── README.md
```

## Requisitos previos

Antes de ejecutar el proyecto, asegurate de tener instalado:

- **Node.js**
- **npm**
- Acceso a **MongoDB Atlas** o una base MongoDB

## Cómo ejecutar el proyecto

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Por defecto corre en:

```bash
http://localhost:4000
```

### Variables de entorno del backend

Crear un archivo `.env` dentro de `backend/` con valores similares a estos:

```env
JWT_Secret_Ket=tu_clave_jwt
USER_EMAIL=tu_correo
USER_PASSWORD=tu_clave_de_aplicacion
MONGO_URI=tu_conexion_mongodb
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 2) Frontend Admin

```bash
cd frontend/PlumasVolandoAdmin
npm install
npm run dev
```

Generalmente corre en:

```bash
http://localhost:5173
```

### 3) Frontend Público

```bash
cd frontend/PlumasVolandoPublic
npm install
npm run dev
```

Si ya hay otra app Vite abierta, normalmente correrá en:

```bash
http://localhost:5174
```

## Funcionalidades principales

### Panel administrativo
- Gestión de empleados
- Gestión de clientes
- Gestión de productos
- Gestión de huevos y gallinas
- Gestión de pedidos
- Facturación e historial de ventas
- Recuperación de contraseña y autenticación

### Sitio público
- Navegación pública de la empresa
- Visualización de productos
- Contacto
- Información general del negocio
- Interfaz orientada al cliente

## Endpoints principales del backend

- `/api/registerEmployee`
- `/api/loginEmployee`
- `/api/employee`
- `/api/registerCustomer`
- `/api/loginCustomer`
- `/api/customer`
- `/api/products`
- `/api/egg`
- `/api/chicken`
- `/api/orders`
- `/api/bill`
- `/api/salesHistory`

## Estado del proyecto

El proyecto se encuentra **en desarrollo**. Ya cuenta con estructura funcional de frontend y backend, aunque todavía puede seguir mejorando en integración, validaciones y despliegue.

## Nota de mantenimiento

Para mantener el proyecto ordenado se recomienda:

- separar cambios por ramas
- documentar nuevas rutas o módulos
- mantener actualizadas las dependencias
- no subir credenciales reales al repositorio

---

Si querés, en el siguiente mensaje también te lo puedo dejar en una **versión todavía más corta**, como si fuera la versión final exacta para pegar directamente en GitHub sin moverle nada.
