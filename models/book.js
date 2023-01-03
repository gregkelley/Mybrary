import mongoose from "mongoose";
import path from 'path';

// var to deal with multipart file upload stuff
// will be storing book covers at some location on the server. apparently instead
// of in the db
export const coverImageBasePath = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImageName: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author',  // what we are referencing. name must match model name
  }
});

bookSchema.virtual('coverImagePath').get(function() {
  // define how we get path. have to use function for this.
  if (this.coverImageName != null) {
    return path.join('/', coverImageBasePath, this.coverImageName);
  }
})

// module.exports = mongoose.model('Author', authorSchema);
const bookModel = mongoose.model('Book', bookSchema);

export default bookModel;