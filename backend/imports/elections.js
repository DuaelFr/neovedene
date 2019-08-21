const importer = require('../utils/importer');

function run() {
  let headers = [
    'Code du département',
    'Libellé du département',
    'Code de la commune',
    'Libellé de la commune',
    'Inscrits',
    'Abstentions',
    '% Abs/Ins',
    'Votants',
    '% Vot/Ins',
    'Blancs',
    '% Blancs/Ins',
    '% Blancs/Vot',
    'Nuls',
    '% Nuls/Ins',
    '% Nuls/Vot',
    'Exprimés',
    '% Exp/Ins',
    '% Exp/Vot',
  ];
  for (let i = 1 ; i < 35 ; i++) {
    let tmp = [
      'N°Liste ' + i,
      'Libellé Abrégé Liste ' + i,
      'Libellé Etendu Liste ' + i,
      'Nom Tête de Liste ' + i,
      'Voix Liste ' + i,
      '% Voix/Ins Liste ' + i,
      '% Voix/Exp Liste ' + i,
    ];
    headers = [...headers, ...tmp];
  }

  return importer.parseCSV(
    '/data/elections-europeennes-2019.csv',
    (data) => {
      let details = [];
      for (let i = 1 ; i < 35 ; i++) {
        details.push({
          candidate: data['Nom Tête de Liste ' + i],
          party: data['Libellé Abrégé Liste ' + i],
          voices: data['Voix Liste ' + i],
          percentage: data['% Voix/Ins Liste ' + i],
        });
      }
      details.sort((a, b) => {
        if ( a.voices > b.voices ){
          return -1;
        }
        else if ( a.voices < b.voices ){
          return 1;
        }
        return 0;
      });

      var result = {
        inseeCode: data['Code du département'].padStart(2, '0') + data['Code de la commune'].padStart(3, '0'),
        politics: {
          elections: {
            europe_2019: {
              registered: data['Inscrits'],
              missing: data['% Abs/Ins'],
              white: data['% Blancs/Ins'],
              nulls: data['% Nuls/Ins'],
              details: details,
            }
          },
        },
      };

      return result;
    },
    {
      skipLines: 1,
      headers: headers,
    }
  );
}

module.exports = {
  run
};
