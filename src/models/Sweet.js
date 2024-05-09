import mongoose from 'mongoose';


const Annotationschema = new mongoose.Schema({
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
        title:{
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        img:{
            type:String,
            
        },
        aud:{
            type:String
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
    tags:{
         type : Array,
         required: true
    },
    annotationStatus: {
        type: Boolean,
        required: true
},createdAt: {
    type: Date,
    default: Date.now
},
updatedAt: {
    type: Date,
    default: Date.now
}
},{ timestamps: true });


// Define Block model
export const Annotation = mongoose.model('Annotation', Annotationschema);

// Define Sweet schema
const Sweetschema = new mongoose.Schema({
    renarrationTitle: {
        type: String,
    },
    annotations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Annotation' }],
    sharingId: {
        type: String,
        required: true
    },
    
});

// Define Sweet model
export const Sweet = mongoose.model('Sweet', Sweetschema);


