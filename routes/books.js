import express from 'express';
import Book, { coverImageBasePath } from '../models/book.js';
import Author from '../models/author.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // file system. wow. where have you been all my life...

const router = express.Router();

// for uploading files. so complicated.
const uploadPath = path.join('public', coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

// get all books
router.get('/', async (req, res) => {
  // create a query obj that we and build a real query from
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
router.post('/', upload.single('cover'), async (req, res) => {
  // upload adds file var to req obj
  const fileName = req.file != null ? req.file.filename : null;

  // construct book object
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description,
  });

  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`books`);
  } catch {
    // remove book cover on error, if it was created
    if (book.coverImageName != null) removeBookCover(book.coverImageName);
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
      // need to remove the book cover we created in the /public dir
    }

    // const book = new Book();
    res.render('books/new', params);
  } catch {
    res.redirect('/books');
  }
}

function removeBookCover(fileName) {
  console.log('remove file: ', fileName);
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}
export default router;
