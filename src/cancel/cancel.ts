export class Cancel {
  reason?: string;

  constructor(reason?: string) {
    this.reason = reason;
  }
}

export function isCancel(cancel: any): boolean {
  return cancel instanceof Cancel;
}