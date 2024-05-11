import mongoose from "mongoose";

// Define Sweet schema
const RenarrationSchema = new mongoose.Schema({
    renarrationUrl: {
        type: String,
    },
    sweetcount:{
type: Number
    },
    annotations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Annotation' }],
    sharingId: {
        type: String,
        required: true
    },
    
});

// Define Sweet model
export const Renarration = mongoose.model('Renarration', RenarrationSchema);