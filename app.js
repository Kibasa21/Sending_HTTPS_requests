// fs: Imports the file system module with promise support for reading and writing files asynchronously. This is used to interact with the file system, such as reading and writing JSON files.
// body-parser: Middleware for parsing incoming request bodies in a middleware before your handlers, available under the req.body property. It's used here to parse JSON bodies.
// express: A fast, unopinionated, minimalist web framework for Node.js, which simplifies the process of building server-side applications.

import fs from 'node:fs/promises';

import bodyParser from 'body-parser';
import express from 'express';

// Creates an Express application.
// app.use(express.static('images')): Serves static files. In this case, it's used to serve images from the images directory.
// app.use(bodyParser.json()): Uses the body-parser middleware to parse JSON request bodies. This allows you to access req.body within your routes.

const app = express();

app.use(express.static('images'));
app.use(bodyParser.json());

// CORS
// Sets up middleware for Cross-Origin Resource Sharing (CORS) headers. This allows the server to respond to requests from different origins (domains) and specifies which HTTP methods and headers are allowed. The next() call passes control to the next middleware function.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

// Defines a route to handle GET requests to /places. It reads places.json, parses the content into JSON, and sends it back in the response with a 200 status code.

app.get('/places', async (req, res) => {
  const fileContent = await fs.readFile('./data/places.json');

  const placesData = JSON.parse(fileContent);

  res.status(200).json({ places: placesData });
});

// Similar to the previous route, but for fetching user-specific places from user-places.json.

app.get('/user-places', async (req, res) => {
  const fileContent = await fs.readFile('./data/user-places.json');

  const places = JSON.parse(fileContent);

  res.status(200).json({ places });
});

// Handles PUT requests to /user-places to update the user places. It takes the updated places data from the request body and writes it to user-places.json, then responds with a success message.

app.put('/user-places', async (req, res) => {
  const places = req.body.places; //ele pega o objeto request, pega o body e pega o objeto places do body, mas cada valor de uma propriedade do request deve ser uma string. A propriedade places da propriedade body deve virar um JSON, como se pode ver no http.js

  await fs.writeFile('./data/user-places.json', JSON.stringify(places));

  res.status(200).json({ message: 'User places updated!' });
});

// 404

//A catch-all middleware for handling 404 Not Found errors. If no other route matches the request, this middleware sends a 404 response. It also handles preflight OPTIONS requests by passing them through to the next middleware without changing the response.

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

//Starts the server and listens for connections on port 3000.

app.listen(3000);
