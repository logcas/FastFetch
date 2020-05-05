import { fetch } from "../../../src/fastfetch";

export default function run() {
  fetch({
    url: '/hello',
    method: 'get',
    params: {
      foo: ['bar1', 'bar2']
    }
  });

  fetch({
    url: '/hello',
    method: 'get',
    params: {
      foo: {
        bar: 'baz'
      }
    }
  });

  fetch({
    url: '/hello',
    method: 'get',
    params: {
      foo: new Date()
    }
  });

  fetch({
    url: '/hello',
    method: 'get',
    params: {
      foo: '@:$, '
    }
  });

  fetch({
    url: '/hello',
    method: 'get',
    params: {
      foo: 'bar',
      baz: null
    }
  });

  fetch({
    url: '/hello#hashshsh',
    method: 'get',
    params: {
      foo: 'bar'
    }
  });

  fetch({
    url: '/hello?baz=aaa',
    method: 'get',
    params: {
      foo: 'bar'
    }
  });

}