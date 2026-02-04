const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const demosPath = path.join(__dirname, 'demos');
  const clients = fs.readdirSync(demosPath)
    .filter(f => fs.statSync(path.join(demosPath, f)).isDirectory());

  res.send(`
    <!DOCTYPE html>
    <html lang="no">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chatbot Demos</title>
      <style>
        body {
          font-family: system-ui, sans-serif;
          background-color: #f5f5f5;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          text-align: center;
        }
        h1 { color: #333; }
        ul { list-style: none; padding: 0; }
        li { margin: 10px 0; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div>
        <h1>Chatbot Demos</h1>
        <ul>
          ${clients.map(c => `<li><a href="/${c}">${c}</a></li>`).join('')}
        </ul>
      </div>
    </body>
    </html>
  `);
});

app.get('/:client', (req, res) => {
  const clientPath = path.join(__dirname, 'demos', req.params.client, 'index.html');

  if (fs.existsSync(clientPath)) {
    res.sendFile(clientPath);
  } else {
    res.status(404).send(`
      <!DOCTYPE html>
      <html lang="no">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Ikke funnet</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            text-align: center;
          }
          h1 { color: #333; }
          p { color: #666; }
        </style>
      </head>
      <body>
        <div>
          <h1>404</h1>
          <p>Kunden "${req.params.client}" ble ikke funnet.</p>
        </div>
      </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
