const fs = require('fs');
const https = require('https');
const express = require('express');
const next = require('next');

const secure = require('express-force-https');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

const key = fs.readFileSync('localhost-key.pem', 'utf-8');
const cert = fs.readFileSync('localhost.pem', 'utf-8');

app
  .prepare()
  .then(() => {
    const server = express({});

    // redirect to SSL if needed
    // server.use(secure);

    // Use nextjs routing
    server.get('*', (req, res) => {
      return handle(req, res);
    });

    https.createServer({ key, cert }, server).listen(port, err => {
      if (err) throw err;
      console.log('🚀 Server running on https://localhost:' + port);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
