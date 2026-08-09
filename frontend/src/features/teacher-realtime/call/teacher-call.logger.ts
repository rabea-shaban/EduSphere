export const logger = {
  log: (tag: string, data: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${tag}][${timestamp}]`, JSON.stringify(data, null, 2));
  },
  warn: (tag: string, data: any) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${tag}][${timestamp}]`, JSON.stringify(data, null, 2));
  },
  error: (tag: string, data: any) => {
    const timestamp = new Date().toISOString();
    console.error(`[${tag}][${timestamp}]`, JSON.stringify(data, null, 2));
  },
};
