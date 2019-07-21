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
    let result = {};
    if (req.query.test.length < 3) {
      result[req.query.test] = "You have to input 3 characters or more.";
      resolve(result);
    }
    else {
      cities.searchByName(req.query.test)
        .then((data) => {
          for (let index = 0; index < Math.min(data.length, 10); index++) {
            result[data[index].inseeCode] = data[index].name + " (" + data[index].postalCode.join(", ") + ")";
          }
          if (data.length > 10) {
            result[req.query.test] = (data.length - 10) + " more...";
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
