export const postData = async (url: string, data: unknown) => {
    console.log(`Mock POST request to ${url}`, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: 'Operation successful' });
        }, 1000);
    });
};