const importer = require('./utils/importer');

const availableImports = [
  'insee', 'base', 'borders'
];

const argv = require('yargs')
  .option('reset', {
    alias: 'r',
    description: 'Reset data before running the import. Always true if not import is selected.',
    type: 'boolean',
  })
  .option('which', {
    alias: 'w',
    description: 'Which imports to run in [' + availableImports.join(', ') + ']. Separate multiple values with commas. If ommited, all imports are going to be run.',
    type: 'string',
  })
  .help()
  .alias('help', 'h')
  .argv;

async function init() {
  await importer.prepare();
}

async function runImports(list) {
  for (let index = 0; index < list.length; index++) {
    await require('./imports/' + list[index]).run();
  }
}

async function run() {
  if (!argv.which || argv.reset) {
    await init();
  }

  let toRun = !argv.which ? availableImports : argv.which.split(',');
  await runImports(toRun);
}

run()
  .then(() => {
    console.log("Terminé !");
    process.exit();
  })
  .catch(() => {
    process.exit(1);
  });
