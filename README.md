# React Express Mongo App

This project is a full-stack application built with React.js for the frontend and Express.js for the backend, integrated with MongoDB for data storage.

## Project Structure

```
react-express-mongo-app
├── client                # React frontend
│   ├── public            # Public assets
│   ├── src               # Source files for React
│   ├── package.json      # Client dependencies and scripts
│   └── README.md         # Client documentation
├── server                # Express backend
│   ├── src               # Source files for Express
│   ├── package.json      # Server dependencies and scripts
│   └── README.md         # Server documentation
└── README.md             # Overall project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd react-express-mongo-app
   ```

2. Install dependencies for the client:

   ```
   cd client
   npm install
   ```

3. Install dependencies for the server:

   ```
   cd ../server
   npm install
   ```

### Running the Application

1. Start the MongoDB server (if using a local instance).

2. Start the Express server:

   ```
   cd server
   npm start
   ```

3. Start the React application:

   ```
   cd client
   npm start
   ```

The React application will be available at `http://localhost:3000` and the Express server will be running on `http://localhost:5000`.

## Usage

- The React frontend communicates with the Express backend through API calls defined in the `client/src/services/api.js` file.
- You can modify the backend logic in the `server/src/controllers/exampleController.js` file and the data model in `server/src/models/exampleModel.js`.

## Contributing

Feel free to submit issues or pull requests for any improvements or features you would like to see in this project.


To run project simply export two var as below 
 export MONGODB_URL=<<MONGOURL>>
 export REACT_APP_API_URL='http://localhost:8080' 

 and open two terminal one in server and one client, 
 run command in server : node index.js
 and run commmand in client : npm run start