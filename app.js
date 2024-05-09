// Import Fastify instead of Express
import Fastify from 'fastify';
import connectDB from './src/config/db.js';
import fetchRouter from './src/routes/fetchRouter.js';
import cors from '@fastify/cors';
import uploadRouter from './src/routes/uploadRouter.js';

// Initialize dotenv
import dotenv from 'dotenv';
import SweetRouter from './src/routes/SweetRouter.js';
import RenarrationRouter from './src/routes/RenarrationRouter.js';
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

fastify.register(SweetRouter, { prefix: '/sweets' });
fastify.register(RenarrationRouter, { prefix: '/renarrations' });
fastify.register(fetchRouter, { prefix: '/download' });
fastify.register(uploadRouter, { prefix: '/upload' });





// Listen to the server on the specified port
const startServer = async () => {
  const options = {
    port: process.env.PORT || 4000,
    host: '0.0.0.0',
    backlog: 511
  };

  try {
     fastify.listen(options);
    console.log(`Server is now listening on ${options.host}:${options.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
