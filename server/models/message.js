import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message: String,
    from: String
},
{
    timestamps: true
})

export default mongoose.model("Message", MessageSchema);