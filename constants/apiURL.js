// eslint-disable-next-line import/no-mutable-exports
let baseURL = 'http://localhost:3000'

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://iabhishek.dev'
}

export default baseURL
