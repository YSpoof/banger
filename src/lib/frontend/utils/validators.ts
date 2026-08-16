export const validateUrl = (url: string): boolean => {
  if (!url.includes("{{ placeholder }}")) return false;

  try {
    new URL(url.replace("{{ placeholder }}", "test"));
    return true;
  } catch {
    return false;
  }
};
