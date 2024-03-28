// src/routes/renarrationRoutes.js
import {
  createRenarration,
  getAllRenarrations,
  getRenarrationById,
  updateRenarrationById,
  deleteRenarrationById,
  verifySharing,
  getRenarrationsByURL,
  getBlockById
} from '../controllers/renarrationController.js';

export default function (fastify, options, done) {
  // Define child routes
  fastify.post('/create-renarration', createRenarration);
  fastify.get('/renarrations', getAllRenarrations);
  fastify.get('/renarrations/:id', getRenarrationById);
  fastify.get('/:id', getBlockById);
  fastify.put('/renarrations/:id', updateRenarrationById);
  fastify.delete('/renarrations/:id', deleteRenarrationById);
  fastify.post('/verify-sharing', verifySharing);
  fastify.post('/url', getRenarrationsByURL);

  done();
}
