import axios from "axios";
// NODE_ENV = 'production'
// NODE_ENV = 'development'

// if we are in production baseURL = /api/v1/restaurants
// else baseURL = 'http://localhost:3000/api/v1/restaurants'

const baseURL =
  process.env.NODE_ENV === "production"
    ? "api/v1/restaurants"
    : "http://localhost:3000/api/v1/restaurants";

export default axios.create({
  baseURL,
});
