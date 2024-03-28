import mongoose from "mongoose";

// Define Renarration schema
const SaveHtmlDocSchema = new mongoose.Schema({
    htmldoc: {
        type: String,
    },
    url: {
        type: String
    }
    
});

// Define Renarration model
export const Savedoc = mongoose.model('Htmldocs', SaveHtmlDocSchema);

