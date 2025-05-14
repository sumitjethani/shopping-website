# Shopping Website

This is a shopping website project built with Node.js, Express, MongoDB, and HTML/CSS/JavaScript for the frontend. The website allows users to browse products, add them to a cart, and proceed to checkout with payment and delivery details.

## Features

- **Product Categories**: 
  - Men's Collection
  - Women's Collection
  - Best Selling Products
- **Cart Functionality**:
  - Add products to the cart.
  - View selected products in the cart dropdown in the navigation bar.
  - Remove products from the cart.
  - Proceed to checkout.
- **Checkout**:
  - Collect user details (name, address, email, and contact info) for order placement.
  - Store orders in MongoDB.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tortugo

   Install dependencies:
   npm install

   Set up the environment variables:

Update the .env file with your configuration:

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password>
SUPPORT_EMAIL=<your-support-email>
PORT=3000
MONGO_URI=mongodb://localhost:27017


Start the MongoDB server:

mongod


Start the application:

npm start


Open the website in your browser:

http://localhost:3000


Project Structure

tortugo/
├── public/
│   ├── css/
│   │   └── style.css         # Styles for the website
│   ├── js/
│   │   └── script.js         # Frontend JavaScript
│   ├── images/               # Product images
│   └── checkout.html         # Checkout page
├── routes/
│   └── productRoutes.js      # API routes for products and orders
├── controllers/
│   └── productController.js  # Logic for handling products and orders
├── models/
│   └── orderModel.js         # Mongoose schema for orders
├── .env                      # Environment variables
├── [app.js](http://_vscodecontentref_/0)                    # Main application file
├── [package.json](http://_vscodecontentref_/1)              # Project dependencies
└── README.md                 # Project documentation


API Endpoints
Products
GET /api/products/men - Fetch men's products.
GET /api/products/women - Fetch women's products.
GET /api/products/best-selling - Fetch best-selling products.
Orders
POST /api/products/order - Place an order.
Request Body:
Technologies Used
Backend: Node.js, Express.js
Database: MongoDB
Frontend: HTML, CSS, JavaScript
Email Service: Nodemailer
How to Use
Browse products by category (Men, Women, Best Selling).
Add products to the cart.
View the cart by clicking the cart icon in the navigation bar.
Proceed to checkout and provide your details.
Orders will be stored in the MongoDB database.

Troubleshooting
Port Already in Use: If port 3000 is in use, stop the process or change the port in the .env file.
MongoDB Connection Issues: Ensure MongoDB is running and the MONGO_URI in the .env file is correct.

