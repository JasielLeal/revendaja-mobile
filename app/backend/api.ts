import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-development-revendaja.onrender.com/api", // coloque sua URL aqui
  timeout: 10000, // opcional: tempo máximo de resposta
});
