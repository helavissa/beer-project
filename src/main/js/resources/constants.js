export const baseUrl = 'http://localhost:8080';
export const beersUrl = '/beers/';
export const toggleUserBeerUrl = (userId) => {
    return `/user/${userId}/toggle-beer2`;
};
export const userFavoutiesUrl = (userId) => {
    return `/user/${userId}/get-favourites`;
};
export const googleClientId = '282153371776-5kv9vjrv8aa1h0e9b86g8euu95ucl5qv.apps.googleusercontent.com';