import mongoose from "mongoose";

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
  // coverImageName: {  removed along with multer when filepond added
  coverImage: {
    type: Buffer,  // buffer of the data representing our image
    required: true
  },
  // added for filepond
  coverImageType: {
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
  if (this.coverImage != null && this.coverImageType != null) {
    // 15:30 in video #4
    // will return the proper string for our image source. have no idea how this works
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

// module.exports = mongoose.model('Author', authorSchema);
const bookModel = mongoose.model('Book', bookSchema);

export default bookModel;