const importer = require('../utils/importer');

function run() {
  return importer.parseCSV(
    '/data/maires.csv',
    (data) => {
      const dateParts = data['Date de naissance'].split('/');
      var result = {
        inseeCode: data['Code du département (Maire)'].padStart(2, '0') + data['Code Insee de la commune'].padStart(3, '0'),
        politics: {
          mayor: {
            name: data['Prénom de l\'élu'] + ' ' + data['Nom de l\'élu'],
            birthdate: new Date(dateParts[2], dateParts[1], dateParts[0]),
            job: data['Libellé de la profession'],
          },
        },
      };

      return result;
    },
    {skipLines: 2}
  );
}

module.exports = {
  run
};
