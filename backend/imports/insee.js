const importer = require('../utils/importer');

function run() {
  return importer.parseCSV(
    '/data/communes-insee.csv',
    (data) => {
      return {
        inseeCode: data.CODGEO,
        name: data.LIBGEO,
        population: {
          total: data.Population,
          men: data['Nb Homme'],
          women: data['Nb Femme'],
          children: data['Nb Mineurs'],
        },
      }
    }
  );
}

module.exports = {
  run
};
