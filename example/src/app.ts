import Fetch, { Transformer } from '../../src';
import CancelToken from '../../src/cancel';

const instance = Fetch.create();
// let cancel: any;
// const cancelToken = new CancelToken(c => cancel = c);
const source = CancelToken.source();

setTimeout(() => {
  source.cancel('User canel request');
}, 2000);

instance.get('/timeout', {
  cancelToken: source.token
}).then(res => {
  console.log(res);
}).catch(err => {
  console.log(Fetch.isCancel);
  if (Fetch.isCancel(err)) {
    console.log('Request is cancelled by user');
    console.log(err);
  }

  instance.get('/timeout', {
    cancelToken: source.token
  }).then(res => {
    console.log('requ2', res);
  }).catch(err => {
    console.log(err);
    console.log('cancel token is used');
  });
});

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