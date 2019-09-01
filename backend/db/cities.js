const Joi = require('@hapi/joi');
const db = require('./connection');

const schema = Joi.object().keys({
  created: Joi.date(),
  updated: Joi.date(),
  inseeCode: Joi.string().alphanum().required(),
  name: Joi.string(),
  wikipedia: Joi.string(),
  postalCode: Joi.array().items(Joi.number().integer().min(1000).max(99999)),
  coordinates: Joi.object({
    x: Joi.number(),
    y: Joi.number(),
  }),
  population: Joi.object({
    total: Joi.number().integer(),
    men: Joi.number().integer(),
    women: Joi.number().integer(),
    children: Joi.number().integer(),
  }),
  surface: Joi.number().integer(),
  borders: Joi.object({
    type: Joi.string(),
    coordinates: Joi.array(),
  }),
  politics: Joi.object({
    mayor: Joi.object({
      name: Joi.string(),
      birthdate: Joi.date(),
      job: Joi.string(),
    }),
    europe_2019: Joi.object(),
    president_2017_t1: Joi.object(),
    president_2017_t2: Joi.object(),
  }),
});

const cities = db.get('cities');

function reset() {
  return cities.remove()
    .then(() => {
      return cities.createIndex({
        name: "text"
      });
    })
    .then(() => {
      return cities.createIndex({
        name: 1
      });
    })
    .then(() => {
      return cities.createIndex({
        inseeCode: 1
      });
    })
    .then(() => {
      return cities.createIndex({
        postalCode: 1
      });
    });
}

function getOne(request) {
  return cities.findOne(request);
}

function getByInseeCode(value) {
  return getOne({inseeCode: value});
}

function search(request) {
  return cities.find(request);
}

function searchByName(value) {
  return search(
    {
      $or: [
        {$text: {$search: value}},
        {name: {$regex: '^' + value, $options: 'i'}}
      ]
    },
    { sort: { name: 1, inseeCode: 1 } }
  );
}

/**
 * Add needed fields in the city object before saving.
 *
 * @param city
 *   The city data object.
 */
function finalizeCity(city) {
  city.updated = new Date();

  if (!city.created) {
    city.created = city.updated;
  }

  if (!city.postalCode) {
    city.postalCode = [];
  }
  else if (!Array.isArray(city.postalCode)) {
    city.postalCode = [city.postalCode];
  }

  delete city.name_if_not_set;
}

function createOrUpdate(city) {
  let nameIfNotSet = false;
  if (city.name_if_not_set) {
    nameIfNotSet = city.name_if_not_set;
  }
  finalizeCity(city);
  const result = Joi.validate(city, schema);
  if (result.error == null) {
    return cities.findOne({inseeCode: city.inseeCode})
      .then((doc) => {
        if (null === doc) {
          return cities.insert(city);
        }
        else {
          if (nameIfNotSet && !doc.name) {
            city.name = nameIfNotSet;
          }
          if (doc.postalCode.length) {
            // Merge arrays and dedupe them.
            city.postalCode = [...new Set([...doc.postalCode, ...city.postalCode])];
          }
          if (doc.politics && city.politics) {
            city.politics = {...doc.politics, ...city.politics};
          }
          return cities.update(doc, { $set: {...doc, ...city}});
        }
      });
  } else {
    return Promise.reject(result.error);
  }
}

module.exports = {
  createOrUpdate,
  reset,
  getByInseeCode,
  searchByName
};
