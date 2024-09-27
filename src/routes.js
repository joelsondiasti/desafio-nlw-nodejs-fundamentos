import { Database } from './database.js';
import { createId } from './utils/buildIdentityTask.js';
import { buildRoutePath } from './utils/buildRoutePath.js';

const database = new Database();
export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;
      database.insert('tasks', {
        id: createId(),
        title,
        description,
        completed_at: null,
        created_at: Date.now(),
        updated_at: null,
      });
      return res.writeHead(201).end();
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks');
      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const taskFound = database.select('tasks', id ? { id: id } : null);

      if (taskFound) {
        database.update('tasks', id, {
          ...taskFound[0],
          title,
          description,
          updated_at: Date.now(),
        });
      } else {
        return res.writeHead(400).end('Tarefa não encontrada');
      }
      return res.writeHead(201).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const taskFound = database.select('tasks', id ? { id: id } : null);

      if (taskFound[0]?.id) {
        database.delete('tasks', taskFound[0].id);
      } else {
        return res.writeHead(400).end('Tarefa não encontrada');
      }

      return res.writeHead(201).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      const result = database.select('tasks', id ? { id: id } : null);
      const taskFound = result?.[0];

      if (taskFound) {
        if (taskFound.completed_at) {
          database.update('tasks', id, {
            ...taskFound,
            completed_at: null,
            updated_at: null,
          });
        } else {
          database.update('tasks', id, {
            ...taskFound,
            completed_at: Date.now(),
            updated_at: null,
          });
        }
      } else {
        return res.writeHead(400).end('Tarefa não existe');
      }

      return res.writeHead(201).end();
    },
  },
];
