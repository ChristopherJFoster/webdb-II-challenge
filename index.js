const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true
  // debug: true
};

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

server.post('/api/zoos', (req, res) => {
  db('zoos')
    .insert({ name: req.body.name })
    .then(ids => {
      const id = ids[0];
      db('zoos')
        .where({ id: id })
        .first()
        .then(zoo => {
          res.status(200).json(zoo);
        });
    })
    .catch(err =>
      res.status(500).json({
        // I tried adding another catch after the .then() where the added record is retrieved, but when I intentionally caused an error in the retrieval (after successully adding the record), it displayed this error message anyway (so I rewrote this message to acknowledge both possible causes).
        error: `There was an error adding the zoo data, or an error retrieving the added zoo data. ${err}`
      })
    );
});

server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err =>
      res.status(500).json({
        error: `There was an error retrieving the zoos data. ${err}`
      })
    );
});

server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where('id', req.params.id)
    .first()
    .then(zoo => {
      if (zoo) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ error: 'There is no zoo with that ID.' });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: `There was an error retrieving the zoo data. ${err}` })
    );
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
