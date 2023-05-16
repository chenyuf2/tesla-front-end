export const importAll = (context) => {
  return context.keys().map(context);
};

export const parseImageName = (url) => url.split("/")[3].substring(0, 14);
