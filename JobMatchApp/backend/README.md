# JobMatchApp Backend

This is the backend API for JobMatchApp, a platform designed to match job seekers with employers efficiently.

## Features

- User authentication and authorization (Job Seekers, Employers, Admins)
- Profile management for job seekers and employers
- Job posting and application management
- Advanced matching algorithm based on skills and preferences
- Resume/CV storage and processing
- Messaging system between job seekers and employers
- Analytics and reporting

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Express Validator for input validation
- Multer for file uploads
- Nodemailer for email notifications

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/jobmatchapp.git
cd jobmatchapp/backend
```

2. Install dependencies
```
npm install
```

3. Configure environment variables
```
cp .env.example .env
```
Then edit the `.env` file with your configuration

4. Start the development server
```
npm run dev
```

### API Documentation

API documentation is available at `/api/docs` when the server is running in development mode.

## Project Structure

```
backend/
├── src/                   # Source files
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middlewares
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── validations/       # Input validation schemas
│   ├── app.js             # Express app setup
│   └── server.js          # Server entry point
├── tests/                 # Test files
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Package configuration
└── README.md              # This file
```

## Testing

Run tests with:
```
npm test
```

## Deployment

For production deployment:
```
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.