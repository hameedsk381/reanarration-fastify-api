// src/routes/uploadRoutes.js
import uploadFileController from '../controllers/uploadController.js';

export default async function (fastify, options) {
  // Register the fastify-multipart plugin to handle multipart/form-data


  fastify.post('/', uploadFileController);
}
