export const mockFetch = (type, data) =>
  new Promise((resp, reject) => {
    const config = { type, data };
    console.log(config);
    setTimeout(() => {
      resp(config);
    }, 1000);
  });
