const importer = require('../utils/importer');

function run() {
  return new Promise((resolve) => {
    runEurope().then(() => {
      runPresidentT1().then(() => {
        runPresidentT2().then(() => {
          runDeputyT1().then(() => {
            runDeputyT2().then(() => {
              resolve();
            });
          });
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
  const hasCirconscription = arguments[2] || false;
  const headersCommonsStart = [
    'Code du département',
    'Libellé du département',
  ];
  const headersCommonsCirconscription = (hasCirconscription ? [
    'Code de la circonscription',
    'Libellé de la circonscription',
  ] : []);
  const headersCommonsEnd = [
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
  let headers = [...headersCommonsStart, ...headersCommonsCirconscription, ...headersCommonsEnd];

  for (let i = 1 ; i < (nbCandidates + 1) ; i++) {
    for (let j = 0, n = additionalHeaders.length; j < n; j++) {
      headers.push(additionalHeaders[j] + ' ' + i);
    }
  }
  return headers;
}

function buildInseeCode(codeDpt, codeCity) {
  const dom = ['ZA', 'ZB', 'ZC', 'ZD'];
  if (dom.indexOf(codeDpt.toUpperCase()) > -1) {
    codeDpt = "97";
  }
  return codeDpt.padStart(2, '0') + codeCity.padStart(3, '0');
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
  const ranking = {
    "BARDELLA Jordan": -100,
    "LOISEAU Nathalie": -50,
    "JADOT Yannick": 50,
    "BELLAMY François-Xavier": -25,
    "DUPONT-AIGNAN Nicolas": -99,
    "GLUCKSMANN Raphaël": 50,
    "AUBRY Manon": 50,
    "LAGARDE Jean-Christophe": -25,
    "THOUY Hélène": 25,
    "BROSSAT Ian": 100,
    "HAMON Benoît": 25,
    "BIDOU Olivier": -25,
    "BOURG Dominique": 100,
    "ARTHAUD Nathalie": 90,
    "PHILIPPOT Florian": -100,
    "ASSELINEAU François": -75,
    "DIEUMEGARD Pierre": 0,
    "LALANNE Francis": 0,
    "DE PREVOISIN Robert": -50,
    "CAMUS Renaud": -100,
    "MARIE Florie": 75,
    "TRAORÉ Hamada": 50,
    "ALEXANDRE Audric": 25,
    "VAUCLIN Vincent": -100,
    "GERNIGON Yves": -50,
    "HELGEN Gilles": 0,
    "CAILLAUD Sophie": 0,
    "DELFEL Thérèse": 100,
    "TOMASINI Nathalie": 50,
    "CORBET Cathy Denise Ginette": 0,
    "SANCHEZ Antonio": 90,
    "CHALENÇON Christophe": 0,
    "PERSON Christian Luc": 25,
    "AZERGUI Nagib": 25
  };

  return importer.parseCSV(
    '/data/elections-europeennes-2019.csv',
    (data) => {
      let details = [];
      let sum_ranking = 0;
      let sum_voices = 0;
      for (let i = 1 ; i < (nbCandidates + 1) ; i++) {
        if (data['Nom Tête de Liste ' + i].length === 0) {
          continue;
        }
        sum_voices += parseInt(data['Voix Liste ' + i], 10);
        sum_ranking += ranking[data['Nom Tête de Liste ' + i]] * parseInt(data['Voix Liste ' + i], 10);
        details.push({
          candidate: data['Nom Tête de Liste ' + i],
          party: data['Libellé Abrégé Liste ' + i],
          ranking: ranking[data['Nom Tête de Liste ' + i]],
          voices: parseInt(data['Voix Liste ' + i], 10),
          percentage_exp: parseFrenchFloat(data['% Voix/Exp Liste ' + i]),
          percentage_ins: parseFrenchFloat(data['% Voix/Ins Liste ' + i]),
        });
      }
      details.sort(compareVoices);

      return {
        inseeCode: buildInseeCode(data['Code du département'], data['Code de la commune']),
        name_if_not_set: data['Libellé de la commune'],
        politics: {
          europe_2019: {
            registered: parseInt(data['Inscrits'], 10),
            missing: parseFrenchFloat(data['% Abs/Ins']),
            white: parseFrenchFloat(data['% Blancs/Ins']),
            nulls: parseFrenchFloat(data['% Nuls/Ins']),
            first_ranking: details[0].ranking,
            average_ranking: sum_ranking / sum_voices,
            sum_ranking: sum_ranking,
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
  const ranking = {
    "Marine LE PEN":  -100,
    "Emmanuel MACRON":  -90,
    "François FILLON":  -75,
    "Jean-Luc MÉLENCHON":  100,
    "Nicolas DUPONT-AIGNAN":  -100,
    "Benoît HAMON":  50,
    "François ASSELINEAU":  -75,
    "Nathalie ARTHAUD":  90,
    "Philippe POUTOU":  90,
    "Jacques CHEMINADE":  -50,
    "Jean LASSALLE": 0
  };

  return importer.parseCSV(
    '/data/elections-presidentielles-2017-T1.csv',
    (data) => {
      let details = [];
      let sum_ranking = 0;
      let sum_voices = 0;
      for (let i = 1 ; i < (nbCandidates + 1) ; i++) {
        if (data['Prénom ' + i].length === 0) {
          continue;
        }
        sum_voices += parseInt(data['Voix ' + i], 10);
        sum_ranking += ranking[data['Prénom ' + i] + ' ' + data['Nom ' + i]] * parseInt(data['Voix ' + i], 10);
        details.push({
          candidate: data['Prénom ' + i] + ' ' + data['Nom ' + i],
          ranking: ranking[data['Prénom ' + i] + ' ' + data['Nom ' + i]],
          voices: parseInt(data['Voix ' + i], 10),
          percentage_exp: parseFrenchFloat(data['% Voix/Exp ' + i]),
          percentage_ins: parseFrenchFloat(data['% Voix/Ins ' + i]),
        });
      }
      details.sort(compareVoices);

      return {
        inseeCode: buildInseeCode(data['Code du département'], data['Code de la commune']),
        name_if_not_set: data['Libellé de la commune'],
        politics: {
          president_2017_t1: {
            registered: parseInt(data['Inscrits'], 10),
            missing: parseFrenchFloat(data['% Abs/Ins']),
            white: parseFrenchFloat(data['% Blancs/Ins']),
            nulls: parseFrenchFloat(data['% Nuls/Ins']),
            first_ranking: details[0].ranking,
            average_ranking: sum_ranking / sum_voices,
            sum_ranking: sum_ranking,
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
  const ranking = {
    "Marine LE PEN":  -100,
    "Emmanuel MACRON":  -90,
  };

  return importer.parseCSV(
    '/data/elections-presidentielles-2017-T2.csv',
    (data) => {
      let details = [];
      let sum_ranking = 0;
      let sum_voices = 0;
      for (let i = 1 ; i < (nbCandidates + 1) ; i++) {
        if (data['Prénom ' + i].length === 0) {
          continue;
        }
        sum_voices += parseInt(data['Voix ' + i], 10);
        sum_ranking += ranking[data['Prénom ' + i] + ' ' + data['Nom ' + i]] * parseInt(data['Voix ' + i], 10);
        details.push({
          candidate: data['Prénom ' + i] + ' ' + data['Nom ' + i],
          ranking: ranking[data['Prénom ' + i] + ' ' + data['Nom ' + i]],
          voices: parseInt(data['Voix ' + i], 10),
          percentage_exp: parseFrenchFloat(data['% Voix/Exp ' + i]),
          percentage_ins: parseFrenchFloat(data['% Voix/Ins ' + i]),
        });
      }
      details.sort(compareVoices);

      return {
        inseeCode: buildInseeCode(data['Code du département'], data['Code de la commune']),
        name_if_not_set: data['Libellé de la commune'],
        politics: {
          president_2017_t2: {
            registered: parseInt(data['Inscrits'], 10),
            missing: parseFrenchFloat(data['% Abs/Ins']),
            white: parseFrenchFloat(data['% Blancs/Ins']),
            nulls: parseFrenchFloat(data['% Nuls/Ins']),
            first_ranking: details[0].ranking,
            average_ranking: sum_ranking / sum_voices,
            sum_ranking: sum_ranking,
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

function runDeputyT1() {
  const nbCandidates = 27;
  const headers = buildHeaders(nbCandidates, [
    'N°Panneau',
    'Sexe',
    'Nom',
    'Prénom',
    'Nuance',
    'Voix',
    '% Voix/Ins',
    '% Voix/Exp',
  ], true);
  const ranking = {
    EXG: 100,
    COM: 100,
    FI: 75,
    SOC: 50,
    ECO: 100,
    DIV: 0,
    MDM: -50,
    LR: -50,
    FN: -100,
    DLF: -100,
    DVG: 25,
    REM: -75,
    RDG: 75,
    UDI: -50,
    EXD: -100,
    DVD: -50,
    REG: 0
  };

  return importer.parseCSV(
    '/data/elections-legislatives-2017-T1.csv',
    (data) => {
      let details = [];
      let sum_ranking = 0;
      let sum_voices = 0;
      for (let i = 1 ; i < (nbCandidates + 1) ; i++) {
        if (data['Prénom ' + i].length === 0) {
          continue;
        }
        sum_voices += parseInt(data['Voix ' + i], 10);
        sum_ranking += ranking[data['Nuance ' + i]] * parseInt(data['Voix ' + i], 10);
        details.push({
          candidate: data['Prénom ' + i] + ' ' + data['Nom ' + i],
          party: data['Nuance ' + i],
          ranking: ranking[data['Nuance ' + i]],
          voices: parseInt(data['Voix ' + i], 10),
          percentage_exp: parseFrenchFloat(data['% Voix/Exp ' + i]),
          percentage_ins: parseFrenchFloat(data['% Voix/Ins ' + i]),
        });
      }
      details.sort(compareVoices);

      return {
        inseeCode: buildInseeCode(data['Code du département'], data['Code de la commune']),
        name_if_not_set: data['Libellé de la commune'],
        politics: {
          deputy_2017_t1: {
            registered: parseInt(data['Inscrits'], 10),
            missing: parseFrenchFloat(data['% Abs/Ins']),
            white: parseFrenchFloat(data['% Blancs/Ins']),
            nulls: parseFrenchFloat(data['% Nuls/Ins']),
            first_ranking: details[0].ranking,
            average_ranking: sum_ranking / sum_voices,
            sum_ranking: sum_ranking,
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

function runDeputyT2() {
  const nbCandidates = 4;
  const headers = buildHeaders(nbCandidates, [
    'N°Panneau',
    'Sexe',
    'Nom',
    'Prénom',
    'Nuance',
    'Voix',
    '% Voix/Ins',
    '% Voix/Exp',
  ], true);
  const ranking = {
    EXG: 100,
    COM: 100,
    FI: 75,
    SOC: 50,
    ECO: 100,
    DIV: 0,
    MDM: -50,
    LR: -50,
    FN: -100,
    DLF: -100,
    DVG: 25,
    REM: -75,
    RDG: 75,
    UDI: -50,
    EXD: -100,
    DVD: -50,
    REG: 0
  };

  return importer.parseCSV(
    '/data/elections-legislatives-2017-T2.csv',
    (data) => {
      let details = [];
      let sum_ranking = 0;
      let sum_voices = 0;
      for (let i = 1 ; i < (nbCandidates + 1) ; i++) {
        if (data['Prénom ' + i].length === 0) {
          continue;
        }
        sum_voices += parseInt(data['Voix ' + i], 10);
        sum_ranking += ranking[data['Nuance ' + i]] * parseInt(data['Voix ' + i], 10);
        details.push({
          candidate: data['Prénom ' + i] + ' ' + data['Nom ' + i],
          party: data['Nuance ' + i],
          ranking: ranking[data['Nuance ' + i]],
          voices: parseInt(data['Voix ' + i], 10),
          percentage_exp: parseFrenchFloat(data['% Voix/Exp ' + i]),
          percentage_ins: parseFrenchFloat(data['% Voix/Ins ' + i]),
        });
      }
      details.sort(compareVoices);

      return {
        inseeCode: buildInseeCode(data['Code du département'], data['Code de la commune']),
        name_if_not_set: data['Libellé de la commune'],
        politics: {
          deputy_2017_t1: {
            registered: parseInt(data['Inscrits'], 10),
            missing: parseFrenchFloat(data['% Abs/Ins']),
            white: parseFrenchFloat(data['% Blancs/Ins']),
            nulls: parseFrenchFloat(data['% Nuls/Ins']),
            first_ranking: details[0].ranking,
            average_ranking: sum_ranking / sum_voices,
            sum_ranking: sum_ranking,
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
