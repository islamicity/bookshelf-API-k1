/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable import/no-unresolved */
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  server.route(routes);
  await server.start();
};

init();