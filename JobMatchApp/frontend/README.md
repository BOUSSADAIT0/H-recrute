# JobMatchApp - Frontend

This is the mobile frontend for JobMatchApp, a platform designed to match job seekers with employers efficiently.

## Features

- User authentication and authorization (Job Seekers, Employers)
- Profile management for job seekers and employers
- Job posting and application management
- Advanced matching algorithm based on skills and preferences
- Resume/CV upload and management
- Messaging system between job seekers and employers
- Real-time notifications
- Location-based job search

## Tech Stack

- React Native
- Redux for state management
- React Navigation for routing
- Axios for API requests
- Formik & Yup for form validation
- React Native Paper for UI components
- React Native Maps for location features

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native CLI
- Android Studio or Xcode (for emulators)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/jobmatchapp.git
cd jobmatchapp/frontend
```

2. Install dependencies
```
npm install
# or
yarn install
```

3. Configure environment variables
```
cp .env.example .env
```
Then edit the `.env` file with your configuration

4. Start the development server
```
npm start
# or
yarn start
```

5. Run on Android or iOS
```
npm run android
# or
npm run ios
```

## Project Structure

```
frontend/
├── src/                    # Source files
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable components
│   ├── config/             # App configuration
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── navigation/         # Navigation setup
│   ├── screens/            # App screens
│   ├── services/           # API services
│   ├── store/              # Redux store
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   └── App.js              # Root component
├── .env                    # Environment variables
├── app.json                # App configuration
└── package.json            # Dependencies
```

## Development Workflow

- Create a new branch for each feature/bugfix
- Follow the established coding style and conventions
- Write tests for your code
- Submit a pull request for review

## Testing

Run tests with:
```
npm test
```

## Building for Production

### Android

```
npm run android -- --variant=release
```

### iOS

```
npm run ios -- --configuration Release
```

## License

This project is licensed under the MIT License - see the LICENSE file for details