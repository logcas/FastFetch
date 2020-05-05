import { fetch } from "../../../src/fastfetch";

export default function runData() {
  fetch({
    url: '/hello',
    method: 'post',
    data: {
      foo: 'foo2312',
      bar: 'dasjkn'
    }
  }).then(res => {
    console.log(`f1:`, res);
  });

  fetch({
    url: '/hello',
    method: 'post',
    data: new URLSearchParams('q=fsfsdfsdf.fsmjkf&p=fsajkfnsjkd')
  }).then(res => {
    console.log(`f2:`, res);
  });

  fetch({
    url: '/hello',
    method: 'post',
    data: {
      foo: 'foo2312',
      bar: 'dasjkn'
    },
    responseType: 'text'
  }).then(res => {
    console.log(`f3:`, res);
  });
}