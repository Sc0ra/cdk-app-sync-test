export const asBase64EncodedJson = (value: unknown): string =>
  window.btoa(JSON.stringify(value));
