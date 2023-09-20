# Meal Time

Meal Time is a web application built using React. This application helps in managing breakfast and lunch orders for a company or organization. It provides an interface for users to place their orders, and administrators can track and manage those orders.

## Objectives
* Saving time from manually updating the breakfast and lunch schedules in working days.
* Ensuring consistency in food management system of employees.

## Getting Started
This `README.md` file aims to assist you in beginning work on a MERN stack application with a solid file structure as a foundation.All the dependencies have been defined in the `package.json` file.

Since this project will hold both the client application and the server application there will be node modules in two different places. 

## File Structure
#### `client` - Holds the client application
- #### `public` - This holds all of our static files
- #### `src`
    - #### `assets` - This folder holds assets such as images, icons, and fonts
    - #### `components` - This folder holds all of the different components that will make up our views / UI Layer
    - #### `routes` - This folder contains the private routing logic for maintaining login states and redirection to diferent URLs.
    - #### `styles` - This folder contains designed styles for the component files
    - #### `pages` - This folder specifies the existing pages which includes the componen files of the client application that will be viewed in UI Layer
    - #### `App.js` - This is what renders all of our available browser routes and different views
    - #### `index.js` - This is what renders the react app by rendering App.js, should not change
- #### `package.json` - Defines npm behaviors and packages for the client application


## Configuration
To configure and run the application, follow the steps below:

## Prerequisites
`Node.js` (version 16 or above) and `npm` (Node Package Manager) must be installed on your system.

### 1. Clone the repository

Run the folllowing command to clone the remote repository on your local

```bash
git clone <repository-url>
cd client
``` 
### 2. Install dependencies
```bash
npm i
```

### 3. Start the application
```bash 
npm start
```
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
This command will start the development server and launch the application in your default browser. If the browser doesn't open automatically, you can access the application by navigating to http://localhost:3000 in your browser.

## Additional Notes
* If you want to build the application for production, you can use the command  npm run build. The optimized and minified version of the application will be created in the build directory, ready to be deployed to a web server.

* For detailed information about the application's components, structure, and implementation details, refer to the project's documentation and source code.

## License
This project is licensed under the MIT License.