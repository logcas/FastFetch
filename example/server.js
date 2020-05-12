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
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
  uploadDir: path.resolve(__dirname, 'files')
});

app.use(multipartMiddleware);

app.use(cookieParser());

router.get('/interceptor', (req, res) => res.json({
  a: 'hello'
}));

router.get('/get', (req, res) => {
  const auth = req.headers.authorization;
  const [type, credentials] = auth.split(' ');
  const [username, password] = Buffer.from(credentials || '', 'base64').toString().split(':');
  console.log(Buffer.from(credentials || '', 'base64').toString());
  if (type === 'Basic' && username === 'admin' && password === '1234567') {
    res.send('验证成功');
  } else {
    res.status(401);
    res.send('Unauthorized!');
  }
});
router.post('/post', (req, res) => res.json({
  a: 'dsadsa'
}));
router.put('/put', (req, res) => res.send(req.body));
router.delete('/delete', (req, res) => res.send(req.body));
router.options('/options', (req, res) => res.send(req.body));
router.head('/head', (req, res) => res.send(req.body));
router.patch('/patch', (req, res) => res.send(req.body));

router.get('/hello', (req, res) => res.json({}));

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

router.post('/upload', (req, res) => {
  res.send('upload success');
});

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

app.use(express.static(path.resolve(__dirname), {
  setHeaders: function(res) {
    res.cookie('XSRF-TOKEN', '123456abcde')
  }
}));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
