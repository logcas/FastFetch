export function isPlainObject(o: any): o is Object {
  return Object.prototype.toString.call(o) === '[object Object]';
};

export function isDate(o: any): o is Date {
  return Object.prototype.toString.call(o) === '[object Date]';
};

export function extend<T, U>(to: T, from: U): T & U {
  for(const key in from) {
    (to as T & U)[key] = from[key] as any;
  }
  return to as T & U;
};

export function deepMerge(...obj: any[]): any {
  const result = Object.create(null);

  obj.forEach(o => {
    if (o) {
      Object.keys(o).forEach(name => {
        if (isPlainObject(o[name])) {
          if (result[name]) {
            result[name] = deepMerge(result[name], o[name])
          } else {
            result[name] = deepMerge(o[name]);
          }
        } else {
          result[name] = o[name];
        }
      });
    }
  });

  return result;

}