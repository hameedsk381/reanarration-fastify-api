import mongoose from 'mongoose';


const BlockSchema = new mongoose.Schema({
    "@context": {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    motivation: {
        type: String,
        required: true
    },
    target: {
        id: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        format: {
            type: String,
            required: true
        },
        selector: {
            type: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }
    },
    body: {
        type: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        format: {
            type: String,
            required: true
        }
        
    },
    source: {
        type: String,
        required: true
    },
    renarrationStatus: {
        type: Boolean,
        required: true
    }
});


// Define Block model
export const Block = mongoose.model('Block', BlockSchema);

// Define Renarration schema
const RenarrationSchema = new mongoose.Schema({
    renarrationTitle: {
        type: String,
    },
    blocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Block' }],
    sharingId: {
        type: String,
        required: true
    }
});

// Define Renarration model
export const Renarration = mongoose.model('Renarration', RenarrationSchema);


