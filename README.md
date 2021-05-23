# Foodgram - Backend
## An application to store and see recipies

## Motivation
This is the backend for the Foodgram application. It was built using ExpressJs, Typescript and Mongoose ODM to connect to MongoDB. It was built in order to learn how to use Typescript with an Express app and to learn how to use Mongoose.

## Features
- Register/Login/Logout/Reset Password from user account
- Create/Read/Update/Delete operations on recipies
- Add recipies to favorites
- Rate recipies

## Installation

This application requires [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) to run.

Download or clone the project on your machine, install the dependencies and start the server.

```sh
cd project_folder
npm install
```

## Usage
In order to use this api you need to create in the root of the project a .env file with the following configuration.

```sh
DB_URI=MONGODB_URI
PORT=3001
TOKEN_SECRET=awjgrftw82c..r,ck2otwefh
TOKEN_EXPIRATION=1d
EMAIL_SERVICE=SendGrid
EMAIL_USERNAME=SENDGRID_USERNAME
EMAIL_PASSWORD=SENDGRID_PASSWORD
EMAIL_FROM=SENDGRID_EMAIL
```

You will also need to create two folders in the root of the project.
```sh
cd project_folder
mkdir uploads
cd uploads
mkdir images
```

### Development

```sh
cd project_folder
npm start
```

By default the application will run on [http://localhost:3001](http://localhost:3001).
