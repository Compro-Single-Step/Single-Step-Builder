const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const db = require('./config/db');
const config = require('./config/config');

// Get our API routes
const api = require('./routes/api');
const assignment = require('./routes/assignment');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, '/../dist/client')));

// Set our api routes
app.use('/api', api);
app.use('/assignment', assignment);

// Catch all other routes and return the index file
app.get('*', (req, res, next) => {
  
  console.log(req.url);
  if(req.url == '/favicon.ico') {
    res.sendFile(path.join(__dirname, '/../dist/client/index.html'));
  }
  else if(req.user === undefined) {
    res.redirect('/login');
  }
  else if(req.user && req.url == '/login') {
    res.redirect('/dashboard');
  }
  else {
    next();
  }
});

app.get('/login', (req, res) => {
  res.redirect('/login');
});


app.get('/dashboard', (req, res) => {
  res.redirect('/dashboard');
});

/**
 * Get port from environment and store in Express.
 */
const port = config.port;
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));