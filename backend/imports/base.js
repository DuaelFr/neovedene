const importer = require('../utils/importer');

function run() {
  return importer.parseCSV(
    '/data/communes-base.csv',
    (data) => {
      var result = {
        inseeCode: data.Code_commune_INSEE,
        postalCode: data.Code_postal,
      };

      const coords = data.coordonnees_gps.split(', ');
      if (coords.length === 2) {
        result.coordinates = {
          x: coords[1],
          y: coords[0],
        };
      }

      return result;
    },
    {separator: ';'}
  );
}

module.exports = {
  run
};
