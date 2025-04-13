import mongoose from "mongoose";
//DO NOT USE THIS SCHEMA.... EVERYTHING HAS BEEN MOVED TO REPORTSCHEMA
const TestSchema = new mongoose.Schema({

  createdAt: { type: Date, default: Date.now }
});

const Test = mongoose.model("Test", TestSchema);
export default Test;