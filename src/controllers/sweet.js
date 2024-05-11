import { Sweet, Annotation } from '../models/Sweet.js';
import { v4 as uuidv4 } from 'uuid';

export const createSweet = async (request, reply) => {
    try {
        const formData = request.body;
        const annotations = [];
        const sharingId = uuidv4();

        for (const annotation of formData.annotations) {
            const existingannotation = await Annotation.findById(annotation._id);
            if (existingannotation) {
                annotations.push(existingannotation._id);
            } else {
                const newannotation = await Annotation.create({ ...annotation });
                annotations.push(newannotation._id);
            }
        }

        formData.annotations = annotations;
        await Sweet.create({ ...formData, sharingId });

        // Status code and JSON response are combined in Fastify
        reply.code(201).send({
            message: "sweet created successfully",
            sharingId
        });
    } catch (error) {
        console.error('Error creating sweet:', error);
        reply.code(500).send('Error creating sweet');
    }
};

export const getAllSweets = async (request, reply) => {
    try {
        const sweets = await Sweet.find().sort({ _id: -1 }).select('-sharingId -annotations');
        reply.send(sweets); // Simplified JSON response
    } catch (error) {
        console.error('Error fetching sweets:', error);
        reply.code(500).send('Error fetching sweets');
    }
};

export const getSweetById = async (request, reply) => {
    const { id } = request.params;

    try {
        const sweet = await Sweet.findById(id)
            .select('-sharingId')
            .populate({
                path: 'annotations',
                match: { annotationStatus: true }
            });

        if (!sweet) {
            reply.code(404).send('sweet not found');
            return; // Make sure to return after sending a response
        }

        reply.send(sweet);
    } catch (error) {
        console.error('Error fetching sweet:', error);
        reply.code(500).send('Error fetching sweet');
    }
};
export const getSweetsByUrl = async (request, reply) => {
    const { url } = request.body;  // Extract URL from the request body

    try {
        // Step 1: Retrieve all relevant annotation IDs from the Annotation collection
        const annotations = await Annotation.find({ source: url, annotationStatus: true }).select('_id');
        const annotationIds = annotations.map(annotation => annotation._id);

        if (annotationIds.length === 0) {
            reply.code(404).send('No sweets found for the specified URL');
            return;
        }

        // Step 2: Use the retrieved IDs to find corresponding Sweets
        const sweets = await Sweet.find({ annotations: { $in: annotationIds } }).populate('annotations');

        if (sweets.length === 0) {
            reply.code(404).send('No sweets found related to the annotations from the specified URL');
            return;
        }

        reply.send(sweets);
    } catch (error) {
        console.error('Error fetching sweets by URL:', error);
        reply.code(500).send('Error fetching sweets by URL');
    }
};


export const getAnnotationsByURL = async (request, reply) => {
    const { source } = request.body;

    try {
        const annotations = await Annotation.find({source});
        // const annotationIds = annotations.map(annotation => annotation._id);
        // const sweets = await sweet.find({ annotations: { $in: annotationIds } }).select('-sharingId -annotations');
        
        if (annotations.length === 0) {
            reply.code(404).send('annotation not found');
            return; // Make sure to return after sending a response
        }

        reply.send(annotations);
    } catch (error) {
        console.error('Error fetching sweet:', error);
        reply.code(500).send('Error fetching sweet');
    }
};

export const getAnnotationsByTag = async (request, reply) => {
    const { tag } = request.body;

    try {
        const annotations = await Annotation.find({ tags: { $in: [tag] } });

        if (annotations.length === 0) {
            return reply.code(404).send('annotations not found for the tag');
        }

        return reply.send(annotations);
    } catch (error) {
        console.error('Error fetching annotations for tag:', error);
        return reply.code(500).send('Error fetching annotations for tag');
    }
};


export const updateSweetById = async (request, reply) => {
    const { id } = request.params;
    const newData = request.body;

    try {
        const newannotations = [];
        for (const annotation of newData.annotations) {
            const existingannotation = await Annotation.findById(annotation._id);
            if (existingannotation) {
               const updatedannotation =  await Annotation.findByIdAndUpdate(annotation._id, { ...annotation });
               
                newannotations.push(updatedannotation._id);
            } else {
                const newannotation = await Annotation.create({ ...annotation });
                
                newannotations.push(newannotation._id);
            }
        }
        newData.annotations = newannotations;

        // Then update the sweet
        await Sweet.findByIdAndUpdate(id, newData, { new: true });
        reply.send({ message: "sweet updated successfully" });
    } catch (error) {
        console.error('Error updating sweet:', error);
        reply.code(500).send('Error updating sweet');
    }
};

export const deletesweetById = async (request, reply) => {
    const { id } = request.params;

    try {
        const deletedsweet = await Sweet.findByIdAndDelete(id);
        if (!deletedsweet) {
            reply.code(404).send('sweet not found');
            return;
        }
        reply.send({ message: 'sweet deleted successfully' });
    } catch (error) {
        console.error('Error deleting sweet:', error);
        reply.code(500).send('Error deleting sweet');
    }
};
export const getAnnotationById = async (request, reply) => {
    const { id } = request.body;

    try {
        const annotation = await Annotation.findById(id);
            

        if (!annotation) {
            reply.code(404).send('annotation not found');
            return; // Make sure to return after sending a response
        }

        reply.send(annotation);
    } catch (error) {
        console.error('Error fetching annotation:', error);
        reply.code(500).send('Error fetching annotation');
    }
};
export const verifySharing = async (request, reply) => {
    const { sharingId } = request.body;

    try {
        const sweet = await Sweet.findOne({ sharingId }).populate('annotations');
        if (!sweet) {
            reply.code(404).send('sweet with the provided sharing ID not found');
            return;
        }
        reply.send(sweet);
    } catch (error) {
        console.error('Error fetching sweet:', error);
        reply.code(500).send('Error fetching sweet');
    }
};
