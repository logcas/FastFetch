import { Transformer } from "../types";

export default function transform(data: any, headers: any, fns: Transformer | Transformer[]) {
  if (!data) {
    return data;
  }

  if (!Array.isArray(fns)) {
    fns = [fns];
  }

  fns.forEach(fn => {
    data = fn(data, headers);
  });

  return data;
}