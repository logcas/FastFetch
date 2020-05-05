import { CancelExecutor, CancelTokenFunc, CancelTokenSource } from "../types";
import { Cancel } from './cancel';

interface PromiseResolver {
  (reason: Cancel): void
};

export default class CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;

  static source(): CancelTokenSource {
    let cancel!: CancelTokenFunc;
    let token = new CancelToken(c => {
      cancel = c;
    });
    return {
      cancel,
      token
    }
  }

  constructor(executor: CancelExecutor) {
    let resolvePromise: PromiseResolver;
    this.promise = new Promise((resolve: PromiseResolver) => {
      resolvePromise = resolve;
    });

    executor((reason: string) => {
      if (this.reason) {
        return;
      }
      this.reason = new Cancel(reason);
      resolvePromise(this.reason);
    });
  }

  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason;
    }
  }
}