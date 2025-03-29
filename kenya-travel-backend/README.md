# Kenya Travel Backend

## Overview
The Kenya Travel Backend is a fully functional RESTful API built with Express.js and MongoDB, designed to support a travel website focused on Kenya. It provides features such as user authentication, destination management, bookings, payments, and a content management system (CMS).

## Features
- User Authentication with JWT
- Role-Based Access Control (User, Admin)
- Destination Management (CRUD operations)
- Booking Management (Create, Retrieve, Cancel)
- Payment Processing via M-Pesa and Stripe
- Content Management System for blogs and announcements
- User Reviews and Ratings for destinations
- Admin Dashboard for user and booking management
- Email Notifications for booking confirmations

## Tech Stack
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT & bcrypt
- **Payments**: M-Pesa Daraja API & Stripe
- **File Uploads**: Multer
- **Email Notifications**: Nodemailer
- **API Documentation**: Swagger/OpenAPI
- **Logging & Monitoring**: Morgan, Winston
- **Deployment**: Docker, PM2, Nginx, DigitalOcean/AWS

## Project Structure
```
kenya-travel-backend
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── app.js
├── server.js
├── .env.example
├── .gitignore
├── package.json
├── docker-compose.yml
├── Dockerfile
└── swagger.json
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd kenya-travel-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

4. Start the application:
   ```
   npm start
   ```

## API Documentation
API endpoints are documented using Swagger/OpenAPI. You can access the documentation at `/swagger.json`.

## Deployment
The application can be containerized using Docker. Follow the instructions in the `Dockerfile` and `docker-compose.yml` for deployment.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.