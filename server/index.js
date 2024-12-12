const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');

class Server {
  constructor() {
    this.dev = process.env.NODE_ENV !== 'production';
    this.app = next({ dev: this.dev });
    this.handle = this.app.getRequestHandler();
  }

  async start() {
    try {
      await this.app.prepare();
      const server = express();
      
      // Middleware to parse JSON and URL-encoded data
      server.use(bodyParser.json());
      server.use(bodyParser.urlencoded({ extended: true }));

      // Example GET route to fetch the todo list
      server.get('/api/todolist', (req, res) => {
        return res.send({ list: [], test: 'deepu' });
      });

      // Add the POST route for user creation
    //   const userRoutes = new UserRoutes();

      server.post('/api/usersd', async (req, res) => {
        try {
          const userData = req.body; // Assuming the body contains user data
          
          return res.status(201).json({"hello":"world"});  // Return created user with status 201
        } catch (error) {
          console.error('Error creating user:', error);
          return res.status(500).json({ error: 'Failed to create user' });
        }
      });

      // Handle all other requests through Next.js
      server.get('*', (req, res) => {
        return this.handle(req, res);
      });

      // Start the server
      server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
      });
    } catch (ex) {
      console.error(ex.stack);
      process.exit(1);
    }
  }
}

const server = new Server();
server.start();
