const importer = require('../utils/importer');

function run() {
  return new Promise((resolve) => {
    runEurope().then(() => {
      runPresidentT1().then(() => {
        runPresidentT2().then(() => {
          resolve();
        });
      });
    });
  });
}

function compareVoices(objectA, objectB) {
  if (objectA.voices > objectB.voices) {
    return -1;
  }
  else if (objectA.voices < objectB.voices) {
    return 1;
  }
  return 0;
}

function parseFrenchFloat(value) {
  return parseFloat(value.replace(',', '.'));
}

function buildHeaders(nbCandidates, additionalHeaders) {
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
  for (let i = 1 ; i < (nbCandidates + 1) ; i++) {
    for (let j = 0, n = additionalHeaders.length; j < n; j++) {
      headers.push(additionalHeaders[j] + ' ' + i);
    }
  }
  return headers;
}

function runEurope() {
  const nbCandidates = 34;
  const headers = buildHeaders(nbCandidates, [
    'N°Liste',
    'Libellé Abrégé Liste',
    'Libellé Etendu Liste',
    'Nom Tête de Liste',
    'Voix Liste',
    '% Voix/Ins Liste',
    '% Voix/Exp Liste',
  ]);

  return importer.parseCSV(
    '/data/elections-europeennes-2019.csv',
    (data) => {
      let details = [];
      for (let i = 1 ; i < (nbCandidates + 1) ; i++) {
        details.push({
          candidate: data['Nom Tête de Liste ' + i],
          party: data['Libellé Abrégé Liste ' + i],
          voices: parseInt(data['Voix Liste ' + i], 10),
          percentage_exp: parseFrenchFloat(data['% Voix/Exp Liste ' + i]),
          percentage_ins: parseFrenchFloat(data['% Voix/Ins Liste ' + i]),
        });
      }
      details.sort(compareVoices);

      return {
        inseeCode: data['Code du département'].padStart(2, '0') + data['Code de la commune'].padStart(3, '0'),
        politics: {
          europe_2019: {
            registered: parseInt(data['Inscrits'], 10),
            missing: parseFrenchFloat(data['% Abs/Ins']),
            white: parseFrenchFloat(data['% Blancs/Ins']),
            nulls: parseFrenchFloat(data['% Nuls/Ins']),
            details: details,
          },
        },
      };
    },
    {
      skipLines: 1,
      headers: headers,
    }
  );
}

function runPresidentT1() {
  const nbCandidates = 11;
  const headers = buildHeaders(nbCandidates, [
    'N°Panneau',
    'Sexe',
    'Nom',
    'Prénom',
    'Voix',
    '% Voix/Ins',
    '% Voix/Exp',
  ]);

  return importer.parseCSV(
    '/data/elections-presidentielles-2017-T1.csv',
    (data) => {
      let details = [];
      for (let i = 1 ; i < (nbCandidates + 1) ; i++) {
        details.push({
          candidate: data['Prénom ' + i] + ' ' + data['Nom ' + i],
          voices: parseInt(data['Voix ' + i], 10),
          percentage_exp: parseFrenchFloat(data['% Voix/Exp ' + i]),
          percentage_ins: parseFrenchFloat(data['% Voix/Ins ' + i]),
        });
      }
      details.sort(compareVoices);

      return {
        inseeCode: data['Code du département'].padStart(2, '0') + data['Code de la commune'].padStart(3, '0'),
        politics: {
          president_2017_t1: {
            registered: parseInt(data['Inscrits'], 10),
            missing: parseFrenchFloat(data['% Abs/Ins']),
            white: parseFrenchFloat(data['% Blancs/Ins']),
            nulls: parseFrenchFloat(data['% Nuls/Ins']),
            details: details,
          },
        },
      };
    },
    {
      skipLines: 4,
      headers: headers,
    }
  );
}

function runPresidentT2() {
  const nbCandidates = 2;
  const headers = buildHeaders(nbCandidates, [
    'N°Panneau',
    'Sexe',
    'Nom',
    'Prénom',
    'Voix',
    '% Voix/Ins',
    '% Voix/Exp',
  ]);

  return importer.parseCSV(
    '/data/elections-presidentielles-2017-T2.csv',
    (data) => {
      let details = [];
      for (let i = 1 ; i < (nbCandidates + 1) ; i++) {
        details.push({
          candidate: data['Prénom ' + i] + ' ' + data['Nom ' + i],
          voices: parseInt(data['Voix ' + i], 10),
          percentage_exp: parseFrenchFloat(data['% Voix/Exp ' + i]),
          percentage_ins: parseFrenchFloat(data['% Voix/Ins ' + i]),
        });
      }
      details.sort(compareVoices);

      return {
        inseeCode: data['Code du département'].padStart(2, '0') + data['Code de la commune'].padStart(3, '0'),
        politics: {
          president_2017_t2: {
            registered: parseInt(data['Inscrits'], 10),
            missing: parseFrenchFloat(data['% Abs/Ins']),
            white: parseFrenchFloat(data['% Blancs/Ins']),
            nulls: parseFrenchFloat(data['% Nuls/Ins']),
            details: details,
          },
        },
      };
    },
    {
      skipLines: 4,
      headers: headers,
    }
  );
}

module.exports = {
  run
};
