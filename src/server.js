import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

/**
 * Query Parameters: utilizado para situações onde é necessário filtrar, paginar.
 * ou modificar de alguma maneira a resposta.
 * Ex: http://localhost:3333/users?userId=1&name=Joe
 * 
 * =====
 * 
 * Route Parameters: utilizados para identificação de recursos. Comumente seu 
 * uso associa-se ao método utilizado na requisição para dar sentido ao parametro. 
 
 * Ex: GET http://localhost:3333/users/1
 * 
 * No exemplo acima indica que deseja-se recuperar dados (GET) do 
 * usuário (Rota '/users') onde o identificador é igual à 1(Route Param)
 * 
 * =====
 * Request body: Utilizado para envio de informação de formulários, normalmente
 * via HTTPS, possui maior segurança uma vez que não vai exposto na string da URL.
 * 
 * É altamente recomendado para envio de dados sensíveis como credenciais de acesso, 
 * criação de recursos e outras informações fundamentais para o uso na plataforma. 
 *  
 */

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);
    const { query, ...params } = routeParams.groups;
    req.params = params;
    req.query = query ? extractQueryParams(query) : {};
    return route.handler(req, res);
  }
  return res.writeHead(404).end();
});

server.listen(3333);
