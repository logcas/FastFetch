const express = require('express');
const app = express();
const port = 3000;
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const compiler = webpack(webpackConfig);
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');
const router = express.Router();
const cookieParser = require('cookie-parser');

app.use(cookieParser());

router.get('/interceptor', (req, res) => res.json({
  a: 'hello'
}));

router.get('/get', (req, res) => res.json(req.cookies));
router.post('/post', (req, res) => res.json({
  a: 'dsadsa'
}));
router.put('/put', (req, res) => res.send(req.body));
router.delete('/delete', (req, res) => res.send(req.body));
router.options('/options', (req, res) => res.send(req.body));
router.head('/head', (req, res) => res.send(req.body));
router.patch('/patch', (req, res) => res.send(req.body));

router.post('/hello', (req, res) => res.json(req.body));

router.get('/user', (req, res) => res.json({
  code: 0,
  message: 'ok',
  data: {
    name: 'fsdafdsa',
    age: 16
  }
}));

router.get('/error', (req, res) => {
    res.status(500);
    res.end();
  }
)

router.get('/timeout', (req, res) => {
  setTimeout(() => {
    res.json({
      a: 'hello,world'
    });
  }, 3000);
})

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/'
  })
);

app.use(
  webpackHotMiddleware(compiler)
);

app.use(router);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname)));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
