// Import Fastify instead of Express
import Fastify from 'fastify';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import fetchRouter from './src/routes/fetchRouter.js';
import RenarrationRouter from './src/routes/RenarrationRouter.js';
import cors from '@fastify/cors';
import { FleekSdk, PersonalAccessTokenService } from '@fleekxyz/sdk';
// Initialize dotenv
dotenv.config();
// Create a Fastify instance
const fastify = Fastify();

await fastify.register(cors, {
  // put your options here
});
fastify.register(import('@fastify/multipart'));
// Connect to the database
connectDB();




const patService = new PersonalAccessTokenService({
  personalAccessToken: process.env.PERSONAL_ACCESS_TOKEN,
  projectId: process.env.PROJECT_ID
})


const fleekSdk = new FleekSdk({ accessTokenService: patService })

// fleekSdk is an authenticated instance of FleekSDK
// with a selected projectId



// Fastify uses the `content type parser` to parse the body. By default, it can handle JSON.
// No explicit express.json() middleware equivalent is required.

// Define routes
fastify.get('/', async (request, reply) => {
  return 'Welcome to the Renarration API';
});
fastify.post('/upload', async (request, reply) => {
  const data = await request.file();
  if (!data.file) {
    return reply.code(400).send('No file uploaded.');
  }

  try {
    const fileData = await data.toBuffer();
    const fileName = data.filename;
    const result = await fleekSdk.ipfs().add({  // Added await here
      path: fileName,
      content: fileData
    });
    reply.send(`https://${result.cid.toString()}.ipfs.w3s.link/`);
  } catch (error) {
    console.error('Error uploading file:', error);
    reply.code(500).send('Error uploading file', error.message);
  }
});

// Register your routes or route files. Note that route registration syntax is different in Fastify.
// You might need to adapt your routers to be compatible with Fastify's structure.
// This often involves exporting functions that take a Fastify instance as an argument and then calling the `.route` or `.get/post/etc.` methods on it.
// For example:
fastify.register(RenarrationRouter, { prefix: '/sweets' });
fastify.register(fetchRouter, { prefix: '/download' });





// Listen to the server on the specified port
const startServer = async () => {


  const options = {
    host: '0.0.0.0',
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
