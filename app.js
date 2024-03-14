// Import Fastify instead of Express
import Fastify from 'fastify';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import fetchRouter from './src/routes/fetchRouter.js';
import RenarrationRouter from './src/routes/RenarrationRouter.js';
import cors from '@fastify/cors';
import uploadRouter from './src/routes/uploadRouter.js';

// Initialize dotenv
dotenv.config();
// Create a Fastify instance
const fastify = Fastify();

await fastify.register(cors);
fastify.register(import('@fastify/multipart'));
// Connect to the database
connectDB();


fastify.get('/', async (request, reply) => {
  return 'Welcome to the Renarration API';
});

fastify.register(RenarrationRouter, { prefix: '/sweets' });
fastify.register(fetchRouter, { prefix: '/download' });
fastify.register(uploadRouter, { prefix: '/upload' });





// Listen to the server on the specified port
const startServer = async () => {


  const options = {
    host: 'localhost',
    port: process.env.PORT || 4000
  };

  fastify.listen(options, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Server is now listening on ${address}`);
    console.log(`Server is running on port: ${options.port}`);
  });
};

startServer();
