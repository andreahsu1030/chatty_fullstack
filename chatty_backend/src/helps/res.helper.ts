export const createResponse = (status: 'success' | 'error', data: any, message: string) => {
  return { status, data, message };
};
