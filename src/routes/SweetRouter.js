// src/routes/renarrationRoutes.js
import {
  verifySharing,
  createSweet,
  getAllSweets,
  getSweetById,
  getAnnotationById,
  updateSweetById,
  deletesweetById,
  getAnnotationsByURL,
  getAnnotationsByTag
} from '../controllers/sweet.js';

export default function (fastify, options, done) {
  fastify.post('/create', createSweet);
  fastify.get('/', getAllSweets);
  fastify.get('/:id', getSweetById);
  fastify.post('/annotation', getAnnotationById);
  fastify.put('/:id', updateSweetById);
  fastify.delete('/:id', deletesweetById);
  fastify.post('/verify-sharing', verifySharing);
  fastify.post('/url', getAnnotationsByURL);
  fastify.post('/tag', getAnnotationsByTag);

  done();
}
