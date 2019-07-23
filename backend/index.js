const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const cities = require('./db/cities');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to NeoVedene backend API.'
  });
});

app.get('/cities', (req, res) => {
  new Promise((resolve) => {
    let result = [];
    if (req.query.q.length < 3) {
      result.push({
        key: req.query.q,
        value: "You have to input 3 characters or more.",
      });
      resolve(result);
    }
    else {
      cities.searchByName(req.query.q)
        .then((data) => {
          if (data.length === 0) {
            result.push({
              key: req.query.q,
              value: `No result for "${req.query.q}"`,
            });
          }
          else {
            const max = req.query.full ? data.length : 5;
            for (let index = 0; index < Math.min(data.length, max); index++) {
              let value = data[index];
              if (!req.query.full) {
                value = data[index].name + " (" + data[index].inseeCode.substr(0, 2) + ")";
              }
              result.push({
                key: data[index].inseeCode,
                value: value,
              });
            }
            if (data.length > max) {
              result.push({
                key: req.query.q,
                value: (data.length - max) + " more...",
              });
            }
          }
          resolve(result);
        });
    }
  })
    .then((result) => {
      res.json(result);
    });
});

app.get('/city/:insee', (req, res) => {
  cities.getByInseeCode(req.params.insee).then((city) => {
    res.json(city);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
