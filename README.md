# AmarJyoti - Full-Stack Dual-Channel E-Commerce Platform

A comprehensive, full-stack e-commerce web application built from scratch to serve as a digital storefront for a traditional business. AmarJyoti is designed to handle two distinct sales channels: a Direct-to-Consumer (D2C) interface for individual customers and a Business-to-Business (B2B) portal for wholesalers, featuring role-based dynamic pricing.


---

## ✨ Key Features

* **Dual User Roles:** Separate registration and login flows for **Consumers (D2C)** and **Wholesalers (B2B)**.
* **Role-Based Dynamic Pricing:** The product catalog automatically displays different prices based on the logged-in user's role.
* **Secure Authentication:** End-to-end authentication and authorization system using JSON Web Tokens (JWT) and `argon2` for secure password hashing.
* **Complete Shopping Cart:** Persistent cart functionality allowing users to add, update quantities, and remove items. The cart state is saved in `localStorage`.
* **Order Placement & History:** Users can place orders, which are saved to the database. A dedicated page allows users to view their complete order history with all item details.
* **User Profile Management:** Users can view and edit their profile information (name, address, phone), with changes reflected instantly across the application.
* **Comprehensive Admin Dashboard:**
    * **Protected Routes:** Only users with an 'admin' role can access the dashboard.
    * **Product Management (CRUD):** Admins can add new products to the catalog via a UI form.
    * **Centralized Order Viewing:** Admins can view a table of all orders placed by all users.
    * **Order Filtering:** The orders table can be dynamically filtered by customer role (consumer/wholesaler).

---

## 🛠️ Tech Stack

| Category      | Technology                                    |
|---------------|-----------------------------------------------|
| **Frontend** | React.js, React Router, React Context API, Axios |
| **Backend** | Node.js, Express.js                           |
| **Database** | PostgreSQL (hosted on Neon.tech)              |
| **Authentication** | JSON Web Tokens (JWT), Argon2 (for hashing)   |
| **Styling** | CSS3 (Flexbox & Grid)                         |


---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v16 or later)
* npm
* A free PostgreSQL database from [Neon.tech](https://neon.tech) or any other provider.

### Installation & Setup

1.  **Clone the repository**
    ```sh
    git clone [your-repository-url]
    cd amarjyoti
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
    ```

3.  **Database Setup**
    * Connect to your PostgreSQL database.
    * Run the SQL script located in `server/models/db.sql` to create all the necessary tables (`users`, `admins`, `products`, `orders`, `order_items`).

4.  **Frontend Setup**
    ```sh
    cd ../client
    npm install
    ```

5.  **Running the Application**
    You will need to run two terminals simultaneously.
    * In the first terminal, start the backend server:
        ```sh
        cd server
        npm run dev
        ```
    * In the second terminal, start the React frontend:
        ```sh
        cd client
        npm start
        ```
    The application will be available at `http://localhost:3000`.

---

## 🔮 Future Improvements

* Integrate a payment gateway like Stripe for real transactions.
* Add order status management (e.g., Shipped, Delivered) for the admin.
* Implement a product search and advanced filtering on the shop page.
* Add "Forgot Password" functionality using Nodemailer.

---
