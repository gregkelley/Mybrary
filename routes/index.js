import express from "express";
import Book from '../models/book.js';
const router = express.Router();


router.get('/', async (req, res) => {
  // empty books obj that we will populate w/ db query
  let books

  try {
    // find all, descending order, limit the list to 10 books. execute the query
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    // if error, just give an empty list o books
    books = [];
  }

  res.render('index', { books: books });

});

export default router;
