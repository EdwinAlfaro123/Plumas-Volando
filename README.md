<p align="center">
  <img src="./docs/plumas-volando-banner.png" alt="Plumas Volando" width="100%" />
</p>

# Plumas Volando

**Plumas Volando** es una plataforma web para una empresa avícola salvadoreña dedicada a la venta y distribución de huevos, gallinas, pollo e insumos.

El sistema está dividido en tres partes: una **web pública** para los clientes, un **panel administrativo** para la gestión interna y un **backend** encargado de la API, base de datos, autenticación, correos e imágenes.

## Equipo de desarrollo

* Joshua Daniel Gonzalez Perez
* Daniel Alejandro Alvarado Tobar
* Edwin Geovanny Alfaro Alfaro
* Diego Josue Rodriguez Alvarado

## Tecnologías utilizadas

* React
* Vite
* Node.js
* Express
* MongoDB
* Mongoose
* Cloudinary
* Nodemailer
* JWT
* CSS

## Estructura del proyecto

```bash
Plumas-Volando/
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   │   ├── BillController.js
│   │   │   ├── ChickensController.js
│   │   │   ├── CustomerController.js
│   │   │   ├── EggsController.js
│   │   │   ├── EmployeesController.js
│   │   │   ├── LoginCustomerController.js
│   │   │   ├── LoginEmployeeController.js
│   │   │   ├── LogoutController.js
│   │   │   ├── OrdersController.js
│   │   │   ├── ProductsController.js
│   │   │   ├── RecoveryCustomerPasswordController.js
│   │   │   ├── RecoveryPasswordEmployeeController.js
│   │   │   ├── RegisterCustomerController.js
│   │   │   ├── RegisterEmployeeController.js
│   │   │   └── SalesHistoryController.js
│   │   │
│   │   ├── model/
│   │   │   ├── Bill.js
│   │   │   ├── Chickens.js
│   │   │   ├── Customer.js
│   │   │   ├── Eggs.js
│   │   │   ├── Employees.js
│   │   │   ├── Orders.js
│   │   │   ├── Products.js
│   │   │   └── SalesHistory.js
│   │   │
│   │   ├── routes/
│   │   │   ├── BillRoutes.js
│   │   │   ├── ChickensRoutes.js
│   │   │   ├── CustomerRoutes.js
│   │   │   ├── EggsRoutes.js
│   │   │   ├── EmployeesRoutes.js
│   │   │   ├── LoginCustomerRoutes.js
│   │   │   ├── LoginEmployeeRoutes.js
│   │   │   ├── OrderRoutes.js
│   │   │   ├── ProductsRoutes.js
│   │   │   ├── RecoveryPasswordCustomer.js
│   │   │   ├── RecoveryPasswordEmployeeRoutes.js
│   │   │   ├── RegisterCustomerRoutes.js
│   │   │   ├── RegisterEmployeeRoutes.js
│   │   │   └── SalesHistoryRoutes.js
│   │   │
│   │   └── utils/
│   │       ├── cloudinaryConfig.js
│   │       ├── sendMailRecovery.js
│   │       └── sentMailVerificationCode.js
│   │
│   ├── app.js
│   ├── config.js
│   ├── database.js
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── PlumasVolandoAdmin/
│   │   ├── public/
│   │   │   ├── favicon.svg
│   │   │   └── icons.svg
│   │   │
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   │   ├── hero.png
│   │   │   │   ├── react.svg
│   │   │   │   └── vite.svg
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── AuthLayout.jsx
│   │   │   │   ├── Buttons.jsx
│   │   │   │   ├── CustomAlert.jsx
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── DateFilter.jsx
│   │   │   │   ├── FormField.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── NeumorphisCard.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   └── Table.jsx
│   │   │   │
│   │   │   ├── img/
│   │   │   │   ├── Plumas.png
│   │   │   │   ├── PlumasVolandoLogo.png
│   │   │   │   └── loginimage.png
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── BillPage.jsx
│   │   │   │   ├── ChickenPage.jsx
│   │   │   │   ├── CustomerPage.jsx
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── EmployeePage.jsx
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── OrdersPage.jsx
│   │   │   │   ├── ProductsPage.jsx
│   │   │   │   ├── RecordsPage.jsx
│   │   │   │   ├── RecoverEmailCodePage.jsx
│   │   │   │   ├── RecoverEmailPasswordPage.jsx
│   │   │   │   ├── RecoverNewPasswordPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── api.js
│   │   │   │
│   │   │   ├── styles/
│   │   │   │   ├── Bill.css
│   │   │   │   ├── Chicken.css
│   │   │   │   ├── CustomAlert.css
│   │   │   │   ├── Customer.css
│   │   │   │   ├── Dashboard.css
│   │   │   │   ├── DateFilter.css
│   │   │   │   ├── Employee.css
│   │   │   │   ├── Global.css
│   │   │   │   ├── Login.css
│   │   │   │   ├── Navbar.css
│   │   │   │   ├── NeumorphicCard.css
│   │   │   │   ├── Orders.css
│   │   │   │   ├── Products.css
│   │   │   │   ├── Records.css
│   │   │   │   ├── RecoverEmailCode.css
│   │   │   │   ├── RecoverEmailPassword.css
│   │   │   │   ├── RecoverNewPassword.css
│   │   │   │   ├── Register.css
│   │   │   │   ├── SearchBar.css
│   │   │   │   ├── SideBar.css
│   │   │   │   ├── StatCard.css
│   │   │   │   └── Table.css
│   │   │   │
│   │   │   ├── App.css
│   │   │   ├── App.jsx
│   │   │   ├── index.css
│   │   │   └── main.jsx
│   │   │
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── PlumasVolandoPublic/
│       ├── public/
│       │   ├── favicon.svg
│       │   └── icons.svg
│       │
│       ├── src/
│       │   ├── assets/
│       │   │   ├── Gallina1.jpg
│       │   │   ├── Gallina2.webp
│       │   │   ├── Huevos1.jpg
│       │   │   ├── Huevos2.jpg
│       │   │   ├── Insumo1.webp
│       │   │   ├── Insumo2.jpg
│       │   │   ├── banner-inicio.png
│       │   │   ├── logo-plumas.png
│       │   │   ├── news/
│       │   │   └── recipes/
│       │   │
│       │   ├── components/
│       │   │   ├── AboutHero.jsx
│       │   │   ├── BenefitsSection.jsx
│       │   │   ├── CartItem.jsx
│       │   │   ├── CartSummary.jsx
│       │   │   ├── ContactForm.jsx
│       │   │   ├── DifficultyBadge.jsx
│       │   │   ├── FAQSection.jsx
│       │   │   ├── FeatureCard.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── FrequentPoint.jsx
│       │   │   ├── Header.jsx
│       │   │   ├── Hero.jsx
│       │   │   ├── MapContainer.jsx
│       │   │   ├── NewsCard.jsx
│       │   │   ├── NewsGrid.jsx
│       │   │   ├── NewsModal.jsx
│       │   │   ├── PointCard.jsx
│       │   │   ├── ProductCard.jsx
│       │   │   ├── ProductFilters.jsx
│       │   │   ├── ProductGrid.jsx
│       │   │   ├── ProductSearchBar.jsx
│       │   │   ├── RecipeCard.jsx
│       │   │   ├── RecipeGrid.jsx
│       │   │   ├── RecipeModal.jsx
│       │   │   ├── RecipesSection.jsx
│       │   │   ├── ServicesCard.jsx
│       │   │   └── Testimonials.jsx
│       │   │
│       │   ├── data/
│       │   │   ├── faqData.js
│       │   │   ├── newsData.js
│       │   │   ├── pointsData.js
│       │   │   ├── productsData.js
│       │   │   └── recipesData.js
│       │   │
│       │   ├── pages/
│       │   │   ├── AboutUsPage.jsx
│       │   │   ├── ContactoPage.jsx
│       │   │   ├── InicioPage.jsx
│       │   │   ├── NewsPage.jsx
│       │   │   ├── PointsOfSalePage.jsx
│       │   │   ├── ProductsPage.jsx
│       │   │   ├── RecipesPage.jsx
│       │   │   └── ShoppingCarPage.jsx
│       │   │
│       │   ├── styles/
│       │   │   ├── AboutUs.css
│       │   │   ├── Contacto.css
│       │   │   ├── Inicio.css
│       │   │   ├── News.css
│       │   │   ├── PointsOfSale.css
│       │   │   ├── Products.css
│       │   │   ├── Recipes.css
│       │   │   └── ShoppingCar.css
│       │   │
│       │   ├── utils/
│       │   │   └── cartStorage.js
│       │   │
│       │   ├── App.css
│       │   ├── App.jsx
│       │   ├── index.css
│       │   └── main.jsx
│       │
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
│
├── docs/
│   └── plumas-volando-banner.png
│
└── README.md
```

## Requisitos previos

* Node.js
* npm
* MongoDB Atlas
* Cuenta de Cloudinary
* Correo para recuperación y verificación

## Instalación del backend

Entrar a la carpeta del backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Dependencias usadas en el backend:

```bash
bcryptjs
cloudinary
cookie-parser
cors
crypto
dotenv
express
jsonwebtoken
mongoose
multer
multer-storage-cloudinary
nodemailer
nodemon
```

Crear archivo `.env` dentro de `backend/`:

```env
JWT_Secret_Ket=tu_clave_jwt
USER_EMAIL=tu_correo
USER_PASSWORD=tu_clave_de_aplicacion
MONGO_URI=tu_conexion_mongodb

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Ejecutar backend:

```bash
npm run dev
```

Servidor local:

```bash
http://localhost:4000
```

## Instalación del frontend administrativo

Entrar a la carpeta del frontend administrativo:

```bash
cd frontend/PlumasVolandoAdmin
```

Instalar dependencias:

```bash
npm install
```

Dependencias usadas en el frontend administrativo:

```bash
axios
lucide-react
react
react-dom
react-router-dom
vite
```

Ejecutar panel administrativo:

```bash
npm run dev
```

URL local:

```bash
http://localhost:5173
```

## Instalación del frontend público

Entrar a la carpeta del frontend público:

```bash
cd frontend/PlumasVolandoPublic
```

Instalar dependencias:

```bash
npm install
```

Dependencias usadas en el frontend público:

```bash
@emailjs/browser
leaflet
lucide-react
react
react-dom
react-leaflet
react-router
vite
```

Ejecutar web pública:

```bash
npm run dev
```

URL local:

```bash
http://localhost:5174
```

## Rutas principales del backend

```bash
/api/registerEmployee
/api/loginEmployee
/api/recoveryPasswordEmployee
/api/employee

/api/registerCustomer
/api/loginCustomer
/api/recoveryPasswordCustomer
/api/customer

/api/products
/api/egg
/api/chicken
/api/orders
/api/bill
/api/salesHistory
```

## Funcionalidades principales

### Panel administrativo

* Gestión de empleados
* Gestión de clientes
* Gestión de productos
* Gestión de huevos
* Gestión de gallinas
* Gestión de pedidos
* Facturación
* Historial de ventas
* Inicio de sesión y recuperación de contraseña

### Web pública

* Página principal de la empresa
* Información del negocio
* Catálogo visual de productos
* Recetas
* Noticias
* Puntos de venta
* Carrito de compras
* Formulario de contacto
* Ubicación mediante mapa
