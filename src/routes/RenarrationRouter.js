import { createRenarration, getAllRenarrations, getRenarrationById, getRenarrationsByUrl, verifySharing } from "../controllers/Renarration.js";


  
  export default function (fastify, options, done) {
    fastify.post('/create', createRenarration);
    fastify.get('/', getAllRenarrations);
    fastify.post('/verify-sharing/:sharingId', verifySharing);
    fastify.get('/:id', getRenarrationById);
    fastify.post('/by-url', getRenarrationsByUrl);
    done();
  }
  