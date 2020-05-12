import Fetch from '../../src';
import 'nprogress/nprogress.css';
import nprogress from 'nprogress';
import * as qs from 'qs';

const instance = Fetch.create();

setupProgress();

function setupProgress() {
  setupStartProgress();
  setupUpdateProgress();
  setupEndProgress();

  function setupStartProgress() {
    instance.interceptors.request.use(
      config => {
        nprogress.start();
        return config;
      },
      error => {
        nprogress.done();
        return error;
      }
    );
  }

  function setupUpdateProgress() {
    function update(e: ProgressEvent) {
      nprogress.inc(e.loaded / e.total);
    }

    instance.defaults.onDownloadProgress = update;
    instance.defaults.onUploadProgress = update;
  }

  function setupEndProgress() {
    instance.interceptors.response.use(
      response => {
        nprogress.done();
        return response;
      },
      error => {
        nprogress.done();
        return error;
      }
    );
  }
}

const uploadBtn = document.getElementById('upload');
uploadBtn!.addEventListener('click', e => {
  const fileUploader = document.getElementById('uploader') as HTMLInputElement;
  if (fileUploader && fileUploader!.files!.length) {
    const file = fileUploader!.files![0];
    const data = new FormData();
    data.append('file', file);
    instance.post('/upload', data);
  }
});

const downloadBtn = document.getElementById('download');
downloadBtn!.addEventListener('click', () => {
  instance.get('/get', {
    auth: {
      username: 'admin',
      password: '1234567'
    }
  });
});

Fetch.get('/hello', {
  params: {
    a: '1',
    b: [1,2,3]
  }
});

Fetch.get('/hello', {
  baseURL: 'http://www.baodu.com/fsdf/sd/f/sd',
  params: {
    a: '1',
    b: [1,2,3]
  }
});

Fetch.get('hello', {
  baseURL: 'http://www.baodu.com/fsdf/sd/f/sd///',
  params: {
    a: '1',
    b: [1,2,3]
  }
});


// let cancel: any;
// const cancelToken = new CancelToken(c => cancel = c);
// const source = CancelToken.source();

// setTimeout(() => {
//   source.cancel('User canel request');
// }, 2000);

// instance.get('/timeout', {
//   cancelToken: source.token
// }).then(res => {
//   console.log(res);
// }).catch(err => {
//   console.log(Fetch.isCancel);
//   if (Fetch.isCancel(err)) {
//     console.log('Request is cancelled by user');
//     console.log(err);
//   }

//   instance.get('/timeout', {
//     cancelToken: source.token
//   }).then(res => {
//     console.log('requ2', res);
//   }).catch(err => {
//     console.log(err);
//     console.log('cancel token is used');
//   });
// });

// instance.interceptors.request.use(
//   (config) => {
//     config.headers.a += '1';
//     return config;
//   }
// );

// instance.interceptors.request.use(
//   (config) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         config.headers.a += '2';
//         resolve(config);
//       }, 1000);
//     });
//   }
// );

// instance.interceptors.request.use(
//   (config) => {
//     config.headers.a += '3';
//     return config;
//   }
// );

// instance.interceptors.response.use(
//   response => {
//     response.data.a += '1';
//     return response;
//   }
// )


// instance.interceptors.response.use(
//   response => {
//     response.data.a += '2';
//     return response;
//   }
// )


// instance.interceptors.response.use(
//   response => {
//     response.data.a += '3';
//     return response;
//   }
// )

// instance.defaults.headers['fnsjf'] = 'fsdjkfnsjkdnjfk';

// instance.post('/post', {
//   a: 1
// }, {
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   transformRequest:[
//     function(data: any) {
//       data.a += 1;
//       return data;
//     },
//     ...instance.defaults.transformRequest as Transformer[]
//   ],
//   transformResponse: 
//     function(data: any) {
//       data.qq = '123';
//       return data;
//     }
// }).then(res => {
//   console.log(res);
// });

// interface ReponseData<T=any> {
//   code: number;
//   message: string;
//   data: T;
// };

// interface User {
//   name: string;
//   age: number;
// }

// function getUser() {
//   return Fetch.get<ReponseData<User>>('/user').then(res => res.data);
// }

// async function test() {
//   try {
//     const user = await getUser();
//     console.log(user);
//   } catch(err) {
//     console.log(err);
//   }
// }

// test();

// Fetch({
//   url: '/get',
//   method: 'get',
//   params: {
//     hello: 'get'
//   }
// });

// Fetch('/get', {
//   params: {
//     hello: 'gettt'
//   }
// });

// Fetch.request({
//   url: '/get',
//   method: 'get',
//   params: {
//     hello: 'get'
//   }
// });

// Fetch.get('/get', {
//   params: {
//     hello: 'get'
//   }
// });

// Fetch.post('/post', {
//   hello: 'post'
// });

// Fetch.put('/put', {
//   hello: 'put'
// });

// Fetch.head('/head', {
//   data: {
//     hello: 'head'
//   }
// });

// Fetch.options('/options', {
//   data: {
//     hello: 'options'
//   }
// });

// Fetch.delete('/delete', {
//   data: {
//     hello: 'delete'
//   }
// });

// const inst = Fetch.create({
//   method: 'post',
//   headers: {
//     'inst1': 'fsdamfsdjkfs'
//   }
// });

// inst.get('/get');
// inst.post('/post');

// const inst2 = inst.create();

// inst2('/post');