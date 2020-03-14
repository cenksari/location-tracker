/**
 * Local storage helper functions.
 */
const storageTool = {
    setItem: async function (key, value) {
        null;
        return localStorage.setItem(key, value);
    },
    getItem: async function (key) {
        null;
        return localStorage.getItem(key);
    },
    removeItem: async function (key) {
        null;
        return localStorage.removeItem(key);
    }
};
