<p align="center">
  <img src="https://res.cloudinary.com/dvbpyufp2/image/upload/v1780870654/banner-plumas-volando.png_k40nfy.png" alt="Plumas Volando" width="100%" />
</p>


# Plumas Volando

Plumas Volando es una plataforma web creada para apoyar la operación de una empresa avícola salvadoreña dedicada a la venta de huevos frescos, pollo, gallinas e insumos para el sector agropecuario.

El proyecto nace de una propuesta de negocio real combinada con el desarrollo de una aplicación web completa. Su propósito es modernizar la forma en que la empresa presenta sus productos, administra pedidos y organiza información clave del negocio, manteniendo una experiencia clara, funcional y profesional para clientes y administradores.

---

## Equipo

* Daniel Alejandro Alvarado Tobar       20210133
* Joshua Daniel Gonzalez Perez          20220432
* Edwin Geovanny Alfaro Alfaro          20210300
* Diego Josue Rodriguez Alvarado        20210032
---

## Tecnologías

| Área             | Tecnologías                                                                        |
| ---------------- | ---------------------------------------------------------------------------------- |
| Frontend Admin   | React, Vite, React Router DOM, Axios, Lucide React, CSS                            |
| Frontend Público | React, Vite, React Router, EmailJS, Leaflet, React Leaflet, Lucide React, CSS      |
| Backend          | Node.js, Express, MongoDB, Mongoose, JWT, Bcryptjs, Nodemailer, Cloudinary, Multer |

---

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
│
└── README.md
```

---

## Instalación

### Backend

```bash
cd backend
npm install
npm run dev
```

Dependencias principales:

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

### Frontend administrativo

```bash
cd frontend/PlumasVolandoAdmin
npm install
npm run dev
```

Dependencias principales:

```bash
axios
lucide-react
react
react-dom
react-router-dom
vite
```

### Frontend público

```bash
cd frontend/PlumasVolandoPublic
npm install
npm run dev
```

Dependencias principales:

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

---

## Variables de entorno

Dentro de la carpeta `backend/` se debe crear un archivo `.env` con la siguiente estructura:

```env
JWT_Secret_Ket=tu_clave_jwt
USER_EMAIL=tu_correo
USER_PASSWORD=tu_clave_de_aplicacion
MONGO_URI=tu_conexion_mongodb

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

---

## Rutas principales del backend

| Ruta                            | Descripción                             |
| ------------------------------- | --------------------------------------- |
| `/api/registerEmployee`         | Registro de empleados                   |
| `/api/loginEmployee`            | Inicio de sesión de empleados           |
| `/api/recoveryPasswordEmployee` | Recuperación de contraseña de empleados |
| `/api/employee`                 | Gestión de empleados                    |
| `/api/registerCustomer`         | Registro de clientes                    |
| `/api/loginCustomer`            | Inicio de sesión de clientes            |
| `/api/recoveryPasswordCustomer` | Recuperación de contraseña de clientes  |
| `/api/customer`                 | Gestión de clientes                     |
| `/api/products`                 | Gestión de productos                    |
| `/api/egg`                      | Gestión de huevos                       |
| `/api/chicken`                  | Gestión de gallinas                     |
| `/api/orders`                   | Gestión de pedidos                      |
| `/api/bill`                     | Gestión de facturación                  |
| `/api/salesHistory`             | Historial de ventas                     |

---

## Funcionalidades principales

### Panel administrativo

* Inicio de sesión y recuperación de contraseña.
* Gestión de empleados y clientes.
* Gestión de productos, huevos y gallinas.
* Gestión de pedidos.
* Facturación e historial de ventas.

### Web pública

* Página principal de la empresa.
* Información del negocio.
* Catálogo visual de productos.
* Recetas y noticias.
* Puntos de venta.
* Carrito de compras.
* Formulario de contacto.
* Ubicación mediante mapa.
