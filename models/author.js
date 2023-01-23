import mongoose from "mongoose";
import Book from './book.js'; 

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// set up constraints so that we cannot delete an author if there are books in 
// the db associated with the author. yay. video #5 @18:10
authorSchema.pre('remove', function(next) {
  console.log(this.id);
  
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0 ) {
      next(new Error('This author has books in the db.'));
    } else {
      // if no err and no associated books, continue with the remove/delete
      next();
    }
  })
})

// module.exports = mongoose.model('Author', authorSchema);
const authorModel = mongoose.model('Author', authorSchema);

export default authorModel;