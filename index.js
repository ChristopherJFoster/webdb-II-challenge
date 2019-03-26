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

// zoos endpoints:

server.post('/api/zoos', (req, res) => {
  const { name } = req.body;
  if (!name) {
    res
      .status(400)
      .json({ error: 'You must provide a name for the new zoo record.' });
  } else {
    db('zoos')
      .insert({ name })
      .then(ids => {
        const id = ids[0];
        db('zoos')
          .where({ id })
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
  }
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

server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'Zoo data successfully deleted.' });
      } else {
        res.status(404).json({ error: 'There is no zoo with that ID.' });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: `There was an error deleting the zoo data. ${err}` })
    );
});

server.put('/api/zoos/:id', (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      error: 'Please provide the changes you intend to make to the zoo record.'
    });
  } else {
    db('zoos')
      .where({ id: req.params.id })
      .update(req.body)
      .then(count => {
        if (count > 0) {
          res.status(200).json({ message: 'Zoo data successfully updated.' });
        } else {
          res.status(404).json({ error: 'There is no zoo with that ID.' });
        }
      })
      .catch(err =>
        res
          .status(500)
          .json({ error: `There was an error updating the zoo data. ${err}` })
      );
  }
});

// bears endpoints:

server.post('/api/bears', (req, res) => {
  const { name } = req.body;
  if (!name) {
    res
      .status(400)
      .json({ error: 'You must provide a name for the new bear record.' });
  } else {
    db('bears')
      .insert({ name })
      .then(ids => {
        const id = ids[0];
        db('bears')
          .where({ id })
          .first()
          .then(bear => {
            res.status(200).json(bear);
          });
      })
      .catch(err =>
        res.status(500).json({
          error: `There was an error adding the bear data, or an error retrieving the added bear data. ${err}`
        })
      );
  }
});

server.get('/api/bears', (req, res) => {
  db('bears')
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(err =>
      res.status(500).json({
        error: `There was an error retrieving the bears data. ${err}`
      })
    );
});

server.get('/api/bears/:id', (req, res) => {
  db('bears')
    .where('id', req.params.id)
    .first()
    .then(bear => {
      if (bear) {
        res.status(200).json(bear);
      } else {
        res.status(404).json({ error: 'There is no bear with that ID.' });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: `There was an error retrieving the bear data. ${err}` })
    );
});

server.delete('/api/bears/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'Bear data successfully deleted.' });
      } else {
        res.status(404).json({ error: 'There is no bear with that ID.' });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: `There was an error deleting the bear data. ${err}` })
    );
});

server.put('/api/bears/:id', (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      error: 'Please provide the changes you intend to make to the bear record.'
    });
  } else {
    db('bears')
      .where({ id: req.params.id })
      .update(req.body)
      .then(count => {
        if (count > 0) {
          res.status(200).json({ message: 'Bear data successfully updated.' });
        } else {
          res.status(404).json({ error: 'There is no bear with that ID.' });
        }
      })
      .catch(err =>
        res
          .status(500)
          .json({ error: `There was an error updating the bear data. ${err}` })
      );
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
