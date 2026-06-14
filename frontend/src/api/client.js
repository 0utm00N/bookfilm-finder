import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const librosApi = {
  getAll: () => client.get('/libros'),
  getById: (id) => client.get(`/libros/${id}`),
  search: (titulo) => client.get('/libros/search', { params: { titulo } }),
  create: (libro) => client.post('/libros', libro),
  delete: (id) => client.delete(`/libros/${id}`),
};

export const peliculasApi = {
  getAll: () => client.get('/peliculas'),
  getById: (id) => client.get(`/peliculas/${id}`),
  search: (titulo) => client.get('/peliculas/search', { params: { titulo } }),
  create: (pelicula) => client.post('/peliculas', pelicula),
  delete: (id) => client.delete(`/peliculas/${id}`),
};

export const adaptacionesApi = {
  getByLibro: (libroId) => client.get(`/adaptaciones/libro/${libroId}`),
  getByPelicula: (peliculaId) => client.get(`/adaptaciones/pelicula/${peliculaId}`),
  create: (libroId, peliculaId, datos) =>
    client.post('/adaptaciones', { libroId, peliculaId, ...datos }),
};