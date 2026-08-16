export const redirect = (url: string) => {
  globalThis.location.replace(url);
};

export const openNewTab = (url: string) => {
  globalThis.open(url, "_blank");
};
