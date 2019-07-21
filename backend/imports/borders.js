const importer = require('../utils/importer');

function run() {
  return importer.parseJSON(
    '/data/communes-borders.json',
    (data) => {
      let city = {
        inseeCode: data.properties.insee,
        surface: data.properties.surf_ha,
        borders: data.geometry,
      };
      if (data.properties.wikipedia) {
        city.wikipedia = data.properties.wikipedia;
      }
      return city;
    },
    'features.*'
  );
}

module.exports = {
  run
};
