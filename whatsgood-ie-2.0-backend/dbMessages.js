import mongoose from "mongoose";

const whatsgoodSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
});


export default mongoose.model('messagecontents', whatsgoodSchema)
