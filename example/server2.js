const express = require('express');
const app = express();
const port = 3038;
const router = express.Router();
const cookieParser = require('cookie-parser');
const cors = require('express-cors');

app.use(cookieParser());
app.use(cors({
  allowedOrigins: [
      'localhost:3000'
  ],
  headers: [
    'X-XSRF-TOKEN',
    'X-Requested-With',
    'Content-Type'
  ]
}));

router.get('/hello', (req, res) => {
  res.json(req.cookies);
});

app.use(router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
