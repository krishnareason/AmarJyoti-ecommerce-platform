# AmarJyoti - Full-Stack E-Commerce & Analytics Platform

A comprehensive, full-stack e-commerce web application built from scratch to serve as a digital storefront for a traditional business. AmarJyoti is designed to handle two distinct sales channels: a Direct-to-Consumer (D2C) interface for individual customers and a Business-to-Business (B2B) portal for wholesalers, featuring role-based dynamic pricing and a complete admin analytics dashboard.

![AmarJyoti Admin Analytics Dashboard](https://i.imgur.com/32c218.png)

---

## ✨ Key Features

* **Stripe Payment Gateway:** Fully integrated, secure payment processing using Stripe Elements for a seamless checkout experience in a developer test environment.

* **Dual User Roles (B2B & D2C):** Separate registration, login, and pricing tiers for both **Consumers** and **Wholesalers**.

* **Secure Authentication & Authorization:** End-to-end user authentication system using JSON Web Tokens (JWT) and the modern `argon2` library for secure password hashing.

* **Complete Shopping Cart:** Persistent cart functionality allowing users to add, update quantities, and remove items. The cart state is saved in `localStorage` for a seamless experience across sessions.

* **Comprehensive Admin Dashboard:** A secure, role-based dashboard for business management, featuring:
    * **Data-Driven Analytics:** Displays key metrics (Total Revenue, Orders, Customers) and visual charts for "Sales Over Time" and "Revenue by Customer Type".
    * **Full Product CRUD:** Admins can Create, Read, Update, and "Soft Delete" (archive) products through the UI.
    * **Centralized Order Management:** Admins can view and filter all customer orders and update their fulfillment status (e.g., Pending, Shipped, Delivered).

* **Full Order Lifecycle:** Customers can place orders, view their complete order history with live status updates, and manage their personal profile information.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React.js, React Router, React Context API, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (hosted on Neon.tech) |
| **Payments** | Stripe (React Stripe.js, Stripe Node.js) |
| **Data Visualization** | Chart.js (with react-chartjs-2) |
| **Authentication** | JSON Web Tokens (JWT), Argon2 (for hashing) |
| **Styling** | CSS3 (Flexbox & Grid) |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v16 or later)
* npm
* A free PostgreSQL database (e.g., from [Neon.tech](https://neon.tech))
* A free Stripe developer account for API keys.

### Installation & Setup

1.  **Clone the repository**
    ```sh
    git clone [https://github.com/krishnareason/AmarJyoti-ecommerce-platform.git](https://github.com/krishnareason/AmarJyoti-ecommerce-platform.git)
    cd AmarJyoti-ecommerce-platform
    ```

2.  **Backend Setup**
    ```sh
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory and add your environment variables:
    ```
    DB_CONNECTION_STRING="your_postgresql_connection_string"
    JWT_SECRET="choose_a_strong_secret_key"
    STRIPE_PUBLISHABLE_KEY="pk_test_..."
    STRIPE_SECRET_KEY="sk_test_..."
    ```

3.  **Database Setup**
    * Connect to your PostgreSQL database.
    * Run the complete SQL script located in the project root to create all tables and seed the database with sample users, products, and orders. This will make the analytics dashboard look populated immediately.

4.  **Frontend Setup**
    ```sh
    cd ../client
    npm install
    ```
    Open `client/src/pages/CartPage.js` and replace the placeholder with your Stripe Publishable Key.

5.  **Running the Application**
    You will need to run two terminals simultaneously.
    * **Terminal 1 (Backend):**
        ```sh
        cd server
        npm run dev
        ```
    * **Terminal 2 (Frontend):**
        ```sh
        cd client
        npm start
        ```
    The application will be available at `http://localhost:3000`.

---

## 🔮 Future Improvements

* Implement a product search bar on the shop page.
* Add "Forgot Password" functionality using an email service like Nodemailer.
* Allow admins to upload product images directly instead of using URLs.
* Implement customer reviews and a star rating system for products.