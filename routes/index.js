import express from "express";
const router = express.Router();


router.get('/', (req, res) => {
  // res.send('Hello muh Bitches');
  res.render('index');
});

export default router;
