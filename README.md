
# Peluditos: Plataforma Full-Stack de Adopción y E-commerce

**Peluditos** es una aplicación web full-stack completa, diseñada como una solución moderna para la gestión de un refugio de animales o una tienda de mascotas. Combina un sitio público con un catálogo de adopción y una tienda e-commerce, junto con un panel administrativo seguro y rico en funcionalidades para gestionar todos los aspectos de la operación.

Este proyecto fue construido desde cero para demostrar un amplio rango de tecnologías y buenas prácticas del desarrollo web moderno, incluyendo seguridad de tipos de extremo a extremo (end-to-end type safety), gestión de datos del lado del servidor y procesamiento de pagos seguro.

Es importante destacar que **este proyecto es una demostración técnica con fines de portafolio y no está afiliado a ninguna fundación real**.

<div>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/NextAuth.js-000?style=for-the-badge&logo=nextauth.js&logoColor=white" alt="NextAuth.js"/>
  <img src="https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white" alt="tRPC"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Zod-3E67B7?style=for-the-badge&logo=zod&logoColor=white" alt="Zod"/>
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui"/>
  <img src="https://img.shields.io/badge/Recharts-8884d8?style=for-the-badge" alt="Recharts"/>
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=tanstack&logoColor=white" alt="TanStack Query"/>
  <img src="https://img.shields.io/badge/Zustand-553a1a?style=for-the-badge" alt="Zustand"/>
  <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form"/>
  <img src="https://img.shields.io/badge/UploadThing-CC3443?style=for-the-badge" alt="UploadThing"/>
  <img src="https://img.shields.io/badge/React_Email-000000?style=for-the-badge&logo=reactemail&logoColor=white" alt="React Email"/>
</div>

<br/>

<img width="1360" height="768" alt="{99D24C82-3D52-49B8-A086-C3DE1922B9B7}" src="https://github.com/user-attachments/assets/a75a0f33-de69-4361-be0a-e8c93fc78ae8" />
<img width="1360" height="768" alt="{C4D1600A-42B5-4AB0-8974-65C603224B28}" src="https://github.com/user-attachments/assets/b9c1636b-1b3d-4f3e-94c3-53dc17b108db" />
<img width="1360" height="768" alt="{F1B8E773-8348-47A2-B554-BB6FD3175D6D}" src="https://github.com/user-attachments/assets/7ee91961-e28d-4e18-a7f3-fcaf1907b382" />

---

## ✨ Demo en Vivo

**[Ver la aplicación en vivo](https://peluditos-ashen.vercel.app)**

Las credenciales para el panel de administración se pueden proporcionar bajo petición para una demostración privada.

## 📎 Original Project

[Ver la idea original desarrollada en vue!](https://github.com/DiegoxK/G23_ProyectoG7_Ciclo3)

---

## 🚀 Características Principales

### Sitio Público para Visitantes
*   **Catálogo de Adopción de Mascotas:** Una galería dinámica y con capacidad de búsqueda de las mascotas disponibles para adopción.
*   **Filtrado y Ordenamiento Avanzado:** Los usuarios pueden filtrar mascotas por especie, rangos de edad, tamaño, sexo y ordenar por fecha de ingreso o edad.
*   **Tienda E-commerce:** Una tienda completa para productos de mascotas.
*   **Filtro de Productos:** Filtra productos por categoría y ordena por precio, popularidad o fecha de lanzamiento.
*   **Páginas de Detalle Atractivas:** Páginas optimizadas para SEO para cada mascota y producto individual.
*   **Carrito de Compras Persistente:** Un carrito de compras que recuerda los artículos del usuario incluso después de cerrar el navegador, implementado con Zustand.
*   **Flujo de Compra Seguro:** Un formulario de varios pasos para recopilar la información del cliente antes del pago.
*   **Integración con Pasarela de Pagos (ePayco):** Una integración completa y segura con la pasarela de pagos ePayco para procesar transacciones de prueba.
*   **Página de Respuesta Dinámica:** Una página amigable que confirma el estado (Aprobado, Pendiente, Fallido) de una transacción después del intento de pago.

### Panel de Administración
*   **Autenticación:** Control de acceso gestionado por NextAuth.js.
*   **Tablas de Datos Avanzadas:** Todas las tablas de gestión están construidas con TanStack Table y cuentan con:
    *   Paginación del lado del servidor.
    *   Ordenamiento del lado del servidor.
    *   Filtrado del lado del servidor (búsqueda global y por columna).
    *   Actualizaciones optimistas de la interfaz para una experiencia de usuario rápida y fluida.
*   **Gestión de Órdenes:** Visualiza todas las órdenes entrantes, actualiza su estado (de "Procesando" a "Enviado") y consulta los detalles de la transacción.
*   **Gestión de Mascotas (CRUD):** Capacidades completas para crear, leer, actualizar y eliminar perfiles de mascotas, incluyendo subida de imágenes.
*   **Gestión de Productos (CRUD):** Control total sobre el inventario de la tienda e-commerce.
*   **Gestión de Usuarios:** Los administradores pueden invitar nuevos usuarios al panel, asignarles roles y gestionar las cuentas existentes.

---

## 🛠️ Tecnologías y Arquitectura

Este proyecto está construido con un enfoque moderno y type-safe, utilizando Next.js en el App Router.

*   **Framework:** **Next.js 15** (App Router)
*   **Lenguaje:** **TypeScript**
*   **Capa de API:** **tRPC** para rutas de API con seguridad de tipos de extremo a extremo.
*   **Base de Datos:** **MongoDB** con el Driver oficial.
*   **Autenticación:** **NextAuth.js**
*   **Estilos:** **Tailwind CSS** con **shadcn/ui** para componentes primitivos.
*   **Gestión de Estado:** **Zustand** (con middleware `persist`) para el carrito de compras.
*   **Formularios:** **React Hook Form** con **Zod** para validación robusta.
*   **Pasarela de Pagos:** **ePayco** (integrado a través de **[epayco-checkout-community-sdk](https://github.com/DiegoxK/epayco-checkout-sdk)**).
*   **Subida de Archivos:** **UploadThing** para la gestión de imágenes.
*   **Despliegue:** **Vercel**

### Puntos Destacados de la Arquitectura

*   **Seguridad de Tipos de Extremo a Extremo (Type-Safety):** Gracias a tRPC, el frontend y el backend comparten una única fuente de verdad para los tipos, eliminando una clase entera de errores y agilizando el desarrollo.
*   **React Server Components (RSC):** La aplicación utiliza estratégicamente Server Components para cargas iniciales rápidas y un excelente SEO, reservando los Client Components para la interactividad.
*   **Separación de Responsabilidades en Esquemas:** Existe una clara distinción entre los esquemas de la base de datos (`DbSchema`) y los esquemas de la API de cara al cliente (`Schema`) para controlar qué datos se exponen y para crear una capa de traducción (ej. para los roles de usuario).
*   **Lógica de Backend Segura:** Todas las operaciones críticas, como el cálculo de precios y la confirmación de pagos, se manejan de forma segura en el servidor para prevenir la manipulación de datos. El webhook de confirmación de ePayco incluye validación de firma y de lógica de negocio.
*   **Diseño responsivo:** Una interfaz de usuario responsiva y compatible con dispositivos móviles creada con Tailwind CSS y Shadcn/UI.
---

## 📦 Instalación y Puesta en Marcha

### Prerrequisitos
*   Node.js (v20.12.2 o superior)
*   pnpm (o el gestor de paquetes de tu elección)
*   Una cuenta de MongoDB Atlas (o una instancia local de MongoDB)

### Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/DiegoxK/Peluditos.git
    cd Peluditos
    ```

2.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```

3.  **Configurar las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto, copiando el archivo de ejemplo:
    ```bash
    cp .env.example .env
    ```    Abre el archivo `.env` y rellena todos los valores requeridos (conexión a MongoDB, secretos de NextAuth, claves de proveedores, y todas las claves de la API de ePayco).

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    pnpm run dev
    ```

La aplicación estará disponible en `http://localhost:3000`.

---

## 🔑 Variables de Entorno

Para ejecutar este proyecto, necesitas configurar las siguientes variables en tu archivo `.env`:

```env
# Next Auth
# Puedes generar un nuevo secreto con: npx auth secret
AUTH_SECRET=""

# Proveedor de Email para Next Auth
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT=""
EMAIL_FROM=""

# Roles de Autenticación - Asegúrate de generar hashes aleatorios por rol
ADMIN_ROLE=""
EDITOR_ROLE=""
READONLY=""

# Mongo
MONGODB_URI=""
MONGODB_DATABASE_NAME="Peluditos"

# UploadThing
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""

# Epayco
EPAYCO_PUBLIC_KEY=""
EPAYCO_PRIVATE_KEY=""
EPAYCO_P_CUST_ID_CLIENTE=""
EPAYCO_P_KEY=""
TESTING_PUBLIC_IP="" # Solo necesario para desarrollo local, debe ser una ip publica valida
APP_URL='" # Url despliegue de vercel
```

---

## 📬 Autor

**Diego Suarez** - [SynthCode](https://www.synthcode.net/en/about)

*   **Portafolio:** [https://www.synthcode.net/en/about](https://www.synthcode.net/en/about)
*   **Email:** [diego.synthcode@gmail.com](mailto:diego.synthcode@gmail.com)
*   **Repositorio del Proyecto:** [https://github.com/DiegoxK/Peluditos](https://github.com/DiegoxK/Peluditos)
