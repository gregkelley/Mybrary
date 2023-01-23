import express from 'express';
import Author from '../models/author.js';
import Book from '../models/book.js';  // why in the flying rat fuck this needs .js..?

const router = express.Router();

// get all authors
router.get('/', async (req, res) => {
  // set up search options
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    // find({where conditions here}) see mongoose docs
    const authors = await Author.find(searchOptions); // get all
    res.render('authors/index', { 
      authors: authors, 
      searchOptions: req.query 
    });
  } catch {
    res.redirect('/');
  }
});

// get new authors
// this route must be before the get(/:id) route or it will never get called.
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() });
});

// create authors
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });

  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`)
    // res.redirect(`authors`);
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating author',
    });
  }
  // author.save((err, newAuthor) => {
  //   if(err) {
  //     res.render('authors/new', {
  //       author: author,
  //       errorMessage: 'Error creating author'
  //     })
  //   } else {
  //     // redirect to the author's page
  //     // res.redirect(`authors/${newAuthor.id}`)
  //     res.redirect(`authors`);
  //   }

  // })

  // res.send(req.body.name);
});

// show a author and all books associated
router.get('/:id', async (req, res) =>{
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({author: author.id}).limit(6).exec();
    res.render('authors/show', 
        { author: author,
          booksByAuthor: books,
     });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
});

// edit page
router.get('/:id/edit', async (req, res) =>{
  // res.send('Edit Author ' + req.params.id);
  try {
    const author = await Author.findById(req.params.id);
    res.render('authors/edit', { author: author });
  } catch {
    res.redirect('/authors');
  }
});

// update author (edit)
router.put('/:id', async (req, res) =>{
  let author;

  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch {
    // unable to find an author with that id
    if (author == null) {
      res.redirect('/')
    } else {
      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error eating author. try, try again',
      });
    }
  }
});

// delete some author
router.delete('/:id', async (req, res) =>{
  let author;

  try {
    // both of these methods work. er, no. Need remove to hit the pre condition.
    // await Author.findByIdAndDelete(req.params.id);
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect('/authors');
  } catch {
    // unable to find an author with that id
    if (author == null) {
      res.redirect('/')
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});


export default router;
