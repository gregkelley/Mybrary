import express from 'express';
import Author from '../models/author.js';

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
    // res.redirect(`authors/${newAuthor.id}`)
      res.redirect(`authors`);
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
export default router;
