Plumas Volando — Sistema Web y API
Plumas Volando es una plataforma web para una empresa avícola salvadoreña dedicada a la producción, comercialización y distribución de huevos, gallinas, pollo de consumo e insumos agropecuarios. El sistema busca facilitar la venta, administración, control de inventario, gestión de pedidos, facturación y comunicación con clientes mediante una solución compuesta por backend, panel administrativo y sitio público.
El proyecto responde a la necesidad de ofrecer productos avícolas frescos, confiables y de calidad, conectando la operación de la empresa con clientes finales, comerciantes, restaurantes, granjas y pequeños productores.
---
Equipo de desarrollo
Joshua Daniel Gonzalez Perez
Daniel Alejandro Alvarado Tobar
Edwin Geovanny Alfaro Alfaro
Diego Josue Rodriguez Alvarado
---
Tabla de contenido
Descripción general
Módulos del sistema
Stack tecnológico
Estructura del proyecto
Requisitos previos
Variables de entorno
Instalación y ejecución local
Rutas del frontend
Endpoints principales del backend
Gestión de imágenes
Scripts disponibles
Estado actual del proyecto
Mantenimiento y buenas prácticas
Flujo recomendado con Gitflow
---
Descripción general
El sistema está dividido en tres partes principales:
1. Backend
API REST desarrollada con Node.js, Express y MongoDB. Se encarga de la autenticación, recuperación de contraseña, conexión con la base de datos, gestión de productos, huevos, gallinas, pedidos, clientes, empleados, facturas e historial de ventas.
2. Frontend administrativo
Panel privado para empleados o administradores. Permite visualizar métricas del negocio, administrar productos, revisar clientes, gestionar pedidos, controlar gallinas, consultar facturas e historial de ventas.
3. Frontend público
Sitio web orientado al cliente final. Presenta la marca, productos, recetas, noticias, puntos de venta, carrito de compras y formulario de contacto.
---
Módulos del sistema
Backend
Registro de empleados.
Inicio de sesión de empleados.
Recuperación de contraseña de empleados por código de verificación.
Registro de clientes.
Inicio de sesión de clientes.
Recuperación de contraseña de clientes por código de verificación.
CRUD de empleados.
CRUD de clientes.
CRUD de productos con imagen en Cloudinary.
CRUD de huevos.
CRUD de gallinas.
CRUD de pedidos.
CRUD de facturas.
CRUD de historial de ventas.
Reportes básicos para dashboard, como pedidos recientes, pedidos por estado, productos más vendidos y producción mensual.
Frontend administrativo
Login.
Registro.
Recuperación de contraseña.
Dashboard principal.
Gestión de clientes.
Gestión de empleados.
Gestión de productos.
Gestión de pedidos.
Gestión de gallinas.
Gestión de facturas.
Historial de ventas.
Componentes reutilizables: sidebar, navbar, tablas, filtros, alertas, inputs, botones y tarjetas estadísticas.
Frontend público
Página de inicio.
Sobre nosotros.
Productos.
Recetas.
Noticias.
Puntos de venta con mapa.
Carrito de compras usando localStorage.
Contacto.
Componentes reutilizables para productos, recetas, noticias, puntos frecuentes, formularios y secciones informativas.
---
Stack tecnológico
Backend
Tecnología	Uso
Node.js	Entorno de ejecución JavaScript
Express 5	Creación de API REST
MongoDB Atlas	Base de datos NoSQL en la nube
Mongoose	Modelado y consultas a MongoDB
dotenv	Manejo de variables de entorno
cors	Permitir conexión entre backend y frontends
cookie-parser	Lectura y manejo de cookies
bcryptjs	Encriptación de contraseñas
jsonwebtoken	Generación y validación de tokens JWT
nodemailer	Envío de correos de verificación y recuperación
crypto	Generación de códigos aleatorios
multer	Recepción de archivos desde formularios
cloudinary	Almacenamiento de imágenes en la nube
multer-storage-cloudinary	Integración entre Multer y Cloudinary
nodemon	Recarga automática del servidor en desarrollo
Frontend administrativo
Tecnología	Uso
React 18	Construcción de interfaz administrativa
React DOM	Renderizado de React en navegador
React Router DOM / React Router	Navegación entre páginas
Vite	Servidor de desarrollo y empaquetador
Axios	Consumo de la API REST
Lucide React	Íconos SVG
CSS tradicional	Estilos personalizados por componente/página
ESLint	Revisión estática del código
Frontend público
Tecnología	Uso
React 19	Construcción de interfaz pública
React DOM	Renderizado de React en navegador
React Router	Navegación entre páginas
Vite	Servidor de desarrollo y build
Lucide React	Íconos SVG
EmailJS Browser	Envío de formularios de contacto desde frontend
Leaflet	Mapas interactivos
React Leaflet	Integración de Leaflet con React
CSS tradicional	Estilos personalizados
ESLint	Revisión estática del código
---
Estructura del proyecto
```txt
Plumas-Volando/
├── backend/
│   ├── app.js
│   ├── index.js
│   ├── database.js
│   ├── config.js
│   ├── package.json
│   └── src/
│       ├── controller/
│       │   ├── BillController.js
│       │   ├── ChickensController.js
│       │   ├── CustomerController.js
│       │   ├── EggsController.js
│       │   ├── EmployeesController.js
│       │   ├── LoginCustomerController.js
│       │   ├── LoginEmployeeController.js
│       │   ├── OrdersController.js
│       │   ├── ProductsController.js
│       │   ├── RegisterCustomerController.js
│       │   ├── RegisterEmployeeController.js
│       │   └── SalesHistoryController.js
│       ├── model/
│       │   ├── Bill.js
│       │   ├── Chickens.js
│       │   ├── Customer.js
│       │   ├── Eggs.js
│       │   ├── Employees.js
│       │   ├── Orders.js
│       │   ├── Products.js
│       │   └── SalesHistory.js
│       ├── routes/
│       │   ├── BillRoutes.js
│       │   ├── ChickensRoutes.js
│       │   ├── CustomerRoutes.js
│       │   ├── EggsRoutes.js
│       │   ├── EmployeesRoutes.js
│       │   ├── LoginCustomerRoutes.js
│       │   ├── LoginEmployeeRoutes.js
│       │   ├── OrderRoutes.js
│       │   ├── ProductsRoutes.js
│       │   ├── RegisterCustomerRoutes.js
│       │   └── RegisterEmployeeRoutes.js
│       └── utils/
│           ├── cloudinaryConfig.js
│           ├── sendMailRecovery.js
│           └── sentMailVerificationCode.js
│
└── frontend/
    ├── PlumasVolandoAdmin/
    │   ├── package.json
    │   └── src/
    │       ├── components/
    │       ├── pages/
    │       ├── services/
    │       │   └── api.js
    │       ├── styles/
    │       ├── img/
    │       ├── App.jsx
    │       └── main.jsx
    │
    └── PlumasVolandoPublic/
        ├── package.json
        └── src/
            ├── components/
            ├── pages/
            ├── data/
            ├── utils/
            │   └── cartStorage.js
            ├── styles/
            ├── img/
            ├── App.jsx
            └── main.jsx
```
---
Requisitos previos
Antes de ejecutar el proyecto, instalar:
Node.js 20 o superior recomendado.
npm.
Cuenta de MongoDB Atlas.
Cuenta de Cloudinary para almacenamiento de imágenes.
Cuenta de correo o contraseña de aplicación para Nodemailer.
Git, si se trabajará con control de versiones.
---
Variables de entorno
Crear un archivo `.env` dentro de la carpeta `backend/`.
```env
JWT\_Secret\_Ket=tu\_clave\_secreta\_jwt
USER\_EMAIL=correo\_que\_envia\_codigos@gmail.com
USER\_PASSWORD=contraseña\_de\_aplicacion\_del\_correo
MONGO\_URI=mongodb+srv://usuario:password@cluster.mongodb.net/PlumasVolando
CLOUDINARY\_CLOUD\_NAME=tu\_cloud\_name
CLOUDINARY\_API\_KEY=tu\_api\_key
CLOUDINARY\_API\_SECRET=tu\_api\_secret
```
> Importante: no subir el archivo `.env` a GitHub. Debe mantenerse privado porque contiene credenciales de base de datos, correo, JWT y Cloudinary.
> Nota técnica: el archivo `config.js` ya lee variables de entorno para JWT, correo y Cloudinary. Para producción, la conexión de `database.js` también debe apuntar a `process.env.MONGO\_URI` para evitar dejar credenciales reales escritas en el código.
---
Instalación y ejecución local
1. Clonar el repositorio
```bash
git clone <URL\_DEL\_REPOSITORIO>
cd Plumas-Volando
```
---
2. Ejecutar backend
```bash
cd backend
npm install
npm run dev
```
El backend se ejecuta en:
```txt
http://localhost:4000
```
La API base queda disponible en:
```txt
http://localhost:4000/api
```
---
3. Ejecutar frontend administrativo
Abrir una nueva terminal:
```bash
cd frontend/PlumasVolandoAdmin
npm install
npm run dev -- --port 5173
```
URL recomendada para el panel administrativo:
```txt
http://localhost:5173
```
---
4. Ejecutar frontend público
Abrir otra terminal:
```bash
cd frontend/PlumasVolandoPublic
npm install
npm run dev -- --port 5174
```
URL recomendada para el sitio público:
```txt
http://localhost:5174
```
---
Orden recomendado para correr el sistema
Iniciar MongoDB Atlas y verificar conexión.
Levantar el backend en el puerto `4000`.
Levantar el frontend administrativo en el puerto `5173`.
Levantar el frontend público en el puerto `5174`.
Probar el consumo de API desde el panel administrativo.
---
Rutas del frontend
Frontend administrativo
Ruta	Página
`/`	Redirección a `/login`
`/login`	Inicio de sesión
`/register`	Registro de empleado
`/recoverEmail`	Solicitud de recuperación de contraseña
`/emailCode`	Verificación de código
`/newPass`	Nueva contraseña
`/dashboard`	Dashboard administrativo
`/customers`	Gestión de clientes
`/bills`	Facturas
`/employees`	Gestión de empleados
`/orders`	Gestión de pedidos
`/chickens`	Gestión de gallinas
`/records`	Historial de ventas
`/products`	Gestión de productos
Frontend público
Ruta	Página
`/`	Inicio
`/about`	Sobre nosotros
`/products`	Productos
`/recipes`	Recetas
`/news`	Noticias
`/points-of-sale`	Puntos de venta
`/cart`	Carrito de compras
`/contact`	Contacto
---
Endpoints principales del backend
La API trabaja con el prefijo base:
```txt
http://localhost:4000/api
```
Autenticación y recuperación
Método	Endpoint	Descripción
POST	`/registerEmployee`	Registrar empleado
POST	`/loginEmployee`	Iniciar sesión como empleado
POST	`/recoveryPasswordEmployee/requestCode`	Solicitar código de recuperación para empleado
POST	`/recoveryPasswordEmployee/verifyCode`	Verificar código de recuperación de empleado
POST	`/recoveryPasswordEmployee/newPassword`	Guardar nueva contraseña de empleado
POST	`/registerCustomer`	Registrar cliente
POST	`/loginCustomer`	Iniciar sesión como cliente
POST	`/recoveryPasswordCustomer/requestCode`	Solicitar código de recuperación para cliente
POST	`/recoveryPasswordCustomer/verifyCode`	Verificar código de recuperación de cliente
POST	`/recoveryPasswordCustomer/newPassword`	Guardar nueva contraseña de cliente
Empleados y clientes
Método	Endpoint	Descripción
GET	`/employee`	Listar empleados
PUT	`/employee/:id`	Actualizar empleado
DELETE	`/employee/:id`	Eliminar empleado
GET	`/customer`	Listar clientes
PUT	`/customer/:id`	Actualizar cliente
DELETE	`/customer/:id`	Eliminar cliente
Productos, huevos y gallinas
Método	Endpoint	Descripción
GET	`/products`	Listar productos
POST	`/products`	Crear producto con imagen
GET	`/products/top-selling`	Obtener productos más vendidos
PUT	`/products/:id`	Actualizar producto
DELETE	`/products/:id`	Eliminar producto
GET	`/egg`	Listar huevos
POST	`/egg`	Crear registro de huevos
GET	`/egg/monthly-production`	Obtener producción mensual
PUT	`/egg/:id`	Actualizar registro de huevos
DELETE	`/egg/:id`	Eliminar registro de huevos
GET	`/chicken`	Listar gallinas
POST	`/chicken`	Crear registro de gallina
PUT	`/chicken/:id`	Actualizar gallina
DELETE	`/chicken/:id`	Eliminar gallina
Pedidos, facturas e historial
Método	Endpoint	Descripción
GET	`/orders`	Listar pedidos
POST	`/orders`	Crear pedido
GET	`/orders/states`	Obtener pedidos agrupados por estado
GET	`/orders/recent`	Obtener pedidos recientes
PUT	`/orders/:id`	Actualizar pedido
DELETE	`/orders/:id`	Eliminar pedido
GET	`/bill`	Listar facturas
POST	`/bill`	Crear factura
PUT	`/bill/:id`	Actualizar factura
DELETE	`/bill/:id`	Eliminar factura
GET	`/salesHistory`	Listar historial de ventas
POST	`/salesHistory`	Crear historial de venta
PUT	`/salesHistory/:id`	Actualizar historial
DELETE	`/salesHistory/:id`	Eliminar historial
---
Gestión de imágenes
El backend utiliza Cloudinary para almacenar imágenes de productos.
Para crear o actualizar un producto con imagen desde Postman o desde el frontend, enviar la petición como `form-data` usando el campo:
```txt
image
```
Ejemplo de campos para un producto:
```txt
name: Cartón de huevos premium
price: 5.25
stock: 100
typeProducts: Huevos
image: archivo.png
```
El middleware `upload.single("image")` recibe el archivo, lo sube a Cloudinary y el controller guarda la URL junto con el identificador público necesario para mantenimiento o eliminación posterior.
---
Scripts disponibles
Backend
```bash
npm run dev
```
Ejecuta el servidor con Nodemon.
Frontend administrativo
```bash
npm run dev
npm run build
npm run preview
npm run lint
```
Frontend público
```bash
npm run dev
npm run build
npm run preview
npm run lint
```
---
Estado actual del proyecto
Completado
Backend con Express y MongoDB.
Conexión a MongoDB Atlas.
Registro e inicio de sesión para empleados y clientes.
Recuperación de contraseña por correo.
CRUD de productos, huevos, gallinas, empleados, clientes, pedidos, facturas e historial de ventas.
Subida de imágenes a Cloudinary para productos.
Frontend administrativo con rutas principales.
Frontend público con páginas informativas, productos, carrito, noticias, recetas, puntos de venta y contacto.
Carrito público usando localStorage.
Consumo de API desde el frontend administrativo mediante Axios.
Pendiente o recomendado
Mover la URI de MongoDB a `process.env.MONGO\_URI` en `database.js`.
Proteger rutas privadas del panel administrativo con validación real de sesión o token.
Agregar validaciones más estrictas en formularios.
Mejorar manejo global de errores en backend.
Implementar pruebas básicas de API.
Evitar subir `node\_modules` al repositorio.
Revisar el orden de rutas dinámicas y rutas especiales. Las rutas como `/products/top-selling` y `/egg/monthly-production` deben declararse antes de `/:id` para evitar que Express las interprete como un parámetro dinámico.
Conectar el carrito público con pedidos reales en backend.
Preparar despliegue en producción.
---
Mantenimiento y buenas prácticas
Mantener las credenciales únicamente en `.env`.
No subir archivos pesados o generados automáticamente como `node\_modules` y carpetas `dist`.
Usar nombres consistentes para rutas, modelos y controladores.
Centralizar las llamadas al backend desde `services/api.js` en el frontend administrativo.
Documentar cualquier endpoint nuevo en este README.
Validar datos tanto en frontend como en backend.
Usar códigos HTTP adecuados: `200`, `201`, `400`, `401`, `404`, `500`.
Al eliminar productos con imagen, eliminar también el recurso correspondiente en Cloudinary usando su `public\_id`.
Mantener ramas separadas por funcionalidad para evitar conflictos.
---
Flujo recomendado con Gitflow
Para agregar este README al repositorio usando Gitflow:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/documentacion-readme
```
Agregar el archivo:
```bash
git add README.md
git commit -m "docs: add project README documentation"
git push origin feature/documentacion-readme
```
Luego crear un Pull Request hacia `develop`.
Cuando `develop` esté probado y estable, se puede hacer merge hacia `main` según el flujo del equipo.
---
Licencia y uso académico
Este proyecto fue desarrollado con fines académicos para el Instituto Técnico Ricaldone. Su objetivo es demostrar la construcción de una aplicación web completa con frontend, backend, base de datos, autenticación, almacenamiento de imágenes y documentación técnica.
