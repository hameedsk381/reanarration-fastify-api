
import { Renarration } from "../models/Renarration.js";
import { v4 as uuidv4 } from 'uuid';
import { Sweet } from "../models/Sweet.js";
export const createRenarration = async (request, reply) => {
    try {
        const formData = request.body;
       
        await Renarration.create(formData);

        // Status code and JSON response are combined in Fastify
        reply.code(201).send({
            message: "Renarration created successfully"
        });
    } catch (error) {
        console.error('Error creating Renarration:', error);
        reply.code(500).send('Error creating Renarration');
    }
};
export const getAllRenarrations = async (request, reply) => {
    try {
        const renarrations = await Renarration.find().sort({ _id: -1 }).select('-sharingId -sweets');
        
        reply.send(renarrations); // Array of all URLs with their renarration renarrationCount
    } catch (error) {
        console.error('Error fetching renarrations:', error);
        reply.code(500).send('Error fetching renarrations');
    }
};
export const getRenarrationById = async (request, reply) => {
    const { id } = request.params;
    try {
        const renarration = await Renarration.findById(id).populate('annotations');
        if (!renarration) {
            reply.code(404).send('Renarration not found');
            return;
        }
        reply.send(renarration);
    } catch (error) {
        console.error('Error fetching renarration by ID with annotations:', error);
        reply.code(500).send('Error fetching renarration by ID with annotations');
    }
};


export const getRenarrationsByUrl = async (request, reply) => {
    const { url } = request.body;
    try {
        const renarrations = await Renarration.find({ renarrationUrl: url }).sort({ _id: -1 });
        if (renarrations.length === 0) {
            reply.code(404).send('No renarrations found for the specified URL');
            return;
        }
        reply.send(renarrations);
    } catch (error) {
        console.error('Error fetching renarrations by URL:', error);
        reply.code(500).send('Error fetching renarrations by URL');
    }
};

export const verifySharing = async (request, reply) => {
    const { sharingId } = request.params;

    try {
        const Renarration = await Renarration.findOne({ sharingId }).populate('sweets');
        if (!Renarration) {
            reply.code(404).send('Renarration with the provided sharing ID not found');
            return;
        }
        reply.send(Renarration);
    } catch (error) {
        console.error('Error fetching Renarration:', error);
        reply.code(500).send('Error fetching Renarration');
    }
};