// Import Fastify instead of Express
import Fastify from 'fastify';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import fetchRouter from './src/routes/fetchRouter.js';
import RenarrationRouter from './src/routes/RenarrationRouter.js';
import cors from '@fastify/cors';
import { create } from '@web3-storage/w3up-client';
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


 let client;
(async () => {
  client = await create();
  const space = await client.createSpace('hameed_storage');
  const myAccount = await client.login('hameedsk381@gmail.com');
  await myAccount.provision(space.did());
  await space.save();
  await client.setCurrentSpace(space.did());
  const recovery = await space.createRecovery(myAccount.did());
  await client.capability.access.delegate({
    space: space.did(),
    delegations: [recovery],
  });
})();



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
    // Assuming File API is available, or use an equivalent Blob/File constructor alternative
    const file = new File([fileData], fileName); 

    const fileCid = await client.uploadFile(file);
    console.log('Uploaded file CID:', fileCid);
    reply.send(`https://${fileCid}.ipfs.w3s.link/`);
  } catch (error) {
    console.error('Error uploading file:', error);
    reply.code(500).send('Error uploading file',error.message);
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


  try {
    const port = process.env.PORT || 4000;
    fastify.listen(port, '0.0.0.0', (err, address) => {
      if (err) throw err
      console.log(`Server is now listening on ${address}`)
    })

    console.log(`Server is running on port: ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
