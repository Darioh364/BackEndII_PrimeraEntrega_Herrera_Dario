### 📦 Proyecto: Ecommerce Backend II

Este proyecto es un **servidor backend para un ecommerce** desarrollado con Node.js, Express y MongoDB. Incluye autenticación con Passport, manejo de roles, autorización, lógica avanzada de compra con stock, envío de correos, y arquitectura profesional con patrones como DAO y Repository.

---

## 🚀 Tecnologías utilizadas

* Node.js + Express
* MongoDB + Mongoose
* Passport (estrategias local y JWT)
* Handlebars
* WebSocket (Socket.io)
* Dotenv
* Nodemailer
* DTOs
* Arquitectura DAO + Repository

---

## 📁 Estructura del Proyecto

```bash
📦 src/
├── config/
│   └── config.js
├── controllers/
├── dao/
├── dto/
├── middleware/
├── models/
├── public/
├── repository/
├── routes/
├── services/
├── utils/
├── views/
├── app.js
└── .env
```

---

## ⚙️ Variables de Entorno (.env)

Deberas crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
JWT_SECRET=miClaveSecreta12345
MAIL_USER=juanmanuel@gmail.com
MAIL_PASS=cdid muhx eehj ebs4
MONGO_URL=mongodb+srv://usuario:clave@cluster.mongodb.net/ecommerce
```

---

## 🔑 Autenticación y Roles

* **Login y Registro** de usuarios (local).
* Uso de **JWT** para mantener la sesión.
* Roles disponibles:

  * `user`: usuario común.
  * `admin`: permisos totales (modificar productos)
---

## 🛒 Funcionalidades principales

### Carritos

* `POST /api/carts/:cid/products/:pid`: Agregar producto al carrito.
* `PUT /api/carts/:cid/product/:pid`: Actualizar cantidad.
* `DELETE /api/carts/:cid/product/:pid`: Eliminar producto.
* `POST /api/carts/:cid/purchase`: Finalizar compra (genera ticket).

### Productos

* `POST /api/products/create`: Crear producto (solo `admin`)
* `PUT /api/products/update/:pid`: Editar producto (solo admin).
* `DELETE /api/products/delete/:pid`: Eliminar producto (admin).

### Usuarios 

* `POST /api/users/register`: Registro.
* `POST /api/sessions/login`: Login.
* `GET /api/sessions/current`: Ver perfil actual (protegido por JWT).
* `POST api/users/forgot-password`: Recuperar contraseña por email. 
* `POST api/users/reset-password`: Ruta de restablecimiento de contraseña (Con token enviado por mail).

---

## 📩 Lógica de compra

* `POST api/carts/:cid/purchase`, se verifica el stock de cada producto.
* Si hay stock suficiente, se descuenta, se crea un **ticket** y se eliminan del carrito.
* Los productos sin stock permanecen en el carrito.

---

## 📨 Mailing

* Implementado con **Nodemailer**.
* Envío de correos para recuperación de contraseña.

---

