const http = require('http');
const kuromoji = require('kuromoji');

const tokenizeText = (text, onTokenizeComplete) => {
    kuromoji.builder({dicPath:'node_modules/kuromoji/dict/'}).build((err,tokenizer) => {
        const tokens = tokenizer.tokenize(text).map(token => token.surface_form);
        onTokenizeComplete(tokens);
    })
};

const server = http.createServer((req, res) => {

    if (req.method === 'POST' && req.url === '/api/tokenize') {
      
      
      let body = '';
      req.on('data', chunk => (body += chunk));

      req.on('end', () => {
        try {
          const { text } = JSON.parse(body); // Parse the JSON body
          tokenizeText(text, (tokens) => {
            res.writeHead(200, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            });
            res.end(JSON.stringify({ words: tokens }));
          });
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end("Invalid JSON");
        }
      
      });

      
      
    } else if (req.method === 'OPTIONS') {
      // Handle preflight requests
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });
  

server.listen(8080, () => {
    console.log('Server is running on http://127.0.0.1:8080');
});