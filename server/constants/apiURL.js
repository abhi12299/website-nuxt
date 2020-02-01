const baseURL = 'http://localhost:3000'

if (process.env.NODE_ENV === 'production') {
  // baseURL = 'https://iabhishek.dev';
}

module.exports = baseURL
