import express from 'express';
import Book from '../models/book.js';
import Author from '../models/author.js';
// import path from 'path';
// import fs from 'fs'; // file system. wow. where have you been all my life...

const router = express.Router();

// for uploading files. so complicated.
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// get all books
router.get('/', async (req, res) => {
  // create a query obj that we build a real query from
  let query = Book.find();

  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    // pubDate <= pubBefore
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    // pubDate >= pubAfter
    query = query.gte('publishDate', req.query.publishedAfter)
  }

  try {
    // set up search options
    let searchOptions = {};
    if (req.query.title != null && req.query.title !== '') {
      searchOptions.name = new RegExp(req.query.name, 'i');
    }

    // first, get all books from db
    // const books = await Book.find({});
    const books = await query.exec();
    res.render('books/index', {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    // go home page on error
    res.redirect('/');
  }
});

// get new books
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book());
});

// create books
// using filepond, we are getting a string instead of a file so do not
// need the upload bit
// router.post('/', upload.single('cover'), async (req, res) => {
router.post('/', async (req, res) => {

  // construct book object
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });
  // added for filepond
  saveCover(book, req.body.cover);

  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`books`);
  } catch {
    renderNewPage(res, book, true);
  }
});

// move new book page render out of the route because it needs to be accessed from
// more than one place.
async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    // deal with an error situation
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) {
      params.errorMessage = 'Error Creating Book';
    }

    // const book = new Book();
    res.render('books/new', params);
  } catch {
    res.redirect('/books');
  }
}

function saveCover(book, coverEncoded) {
  // check for valid cover then save
  if (coverEncoded == null) return;

  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
}

// show book info. cover, author, date, count, desc. then edit, delete buttons and 
// author link button. Receives book.id
router.get('/:id', async (req, res) =>{
  try {
    // const author = await Author.findById(req.params.id);
    const book = await Book.findById(req.params.id);
    // if (book.length < 1) console.log('no book found');
    const authorName = await Author.findById(book.author);
    res.render('books/show', 
        { book: book, 
          authorName: authorName,
        });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
});

// delete some book. I copied and mod'd from author
router.delete('/:id', async (req, res) =>{
  let book;

  try {
    // both of these methods work. er, no. Need remove to hit the pre condition.
    // await Book.findByIdAndDelete(req.params.id);
    book = await Book.findById(req.params.id);
    await book.remove();
    res.redirect('/books');
  } catch {
    // unable to find an book with that id
    if (book == null) {
      res.redirect('/')
    } else {
      // res.redirect(`/books/${book.id}`);
      res.redirect('/books');
    }
  }
});

export default router;
