# CineFlex Node.js API

A Node.js RESTful API for user authentication, movie management, and password reset functionality, using MongoDB, Mongoose, JWT, bcrypt, and Nodemailer.

---

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- Password reset via email (Mailtrap or SMTP)
- User roles (user/admin)
- Soft delete for users
- Movie CRUD operations
- Query filtering, sorting, and pagination

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas)
- [Mailtrap](https://mailtrap.io/) account for email testing

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/DurgeshMore1/CineFlex_movie.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` or `config.env` file in the root directory with the following content:

   ```
   PORT=8090
   NODE_ENVIRONMENT=development
   CLOUD_CONNECTION=<your-mongodb-atlas-uri>
   LOCAL_CNNECTION=mongodb://localhost:27017/cineFlex
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   DEBUG=true
   SECRETE_STRING=your_jwt_secret
   EXPIRE_TIME=86400

   HOST=sandbox.smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=<your-mailtrap-username>
   EMAIL_PASS=<your-mailtrap-password>
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   or (if you use nodemon)
   ```bash
   npm run dev
   ```

---

## API Endpoints

### Auth

- `POST /user/signup` — Register a new user
- `POST /user/login` — Login and get JWT token
- `POST /user/forgatePassword` — Request password reset
- `PATCH /user/resetPassword/:token` — Reset password

### Movies

- `GET /movies` — List all movies (with filtering, sorting, pagination)
- `POST /movies` — Create a new movie
- `GET /movies/:id` — Get a movie by ID
- `PATCH /movies/:id` — Update a movie
- `DELETE /movies/:id` — Delete a movie

---

## Project Structure

```
Node_JS/
├── Models/
│   └── authModel.js
├── controller/
│   ├── authController.js
│   └── moviesController.js
├── utilities/
│   ├── ApiFeature.js
│   └── email.js
├── config.env
├── app.js / server.js
└── ...
```

---

## Notes

- Passwords are hashed using bcrypt and never stored in plain text.
- Password reset tokens are securely generated and hashed.
- Only active users are returned in queries (soft delete).
- Email sending uses Mailtrap for safe testing.

---

## License

MIT
