import axios from "axios";

export const key = 'f02735fde6f1e5bdddaf342fc1cc8f5c';

const API_FILMES = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

export default API_FILMES;
