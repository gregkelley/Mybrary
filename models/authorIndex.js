import mongoose from "mongoose";

const authorIndexSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// module.exports = mongoose.model('Author', authorIndexSchema);
const authorIndexModel = mongoose.model('Author', authorIndexSchema);

export default authorIndexModel;