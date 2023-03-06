#!/usr/bin/env node

import yargs from 'yargs';
import fs from 'fs/promises';

import { extractTranslationsFromFiles, generatePoFromTranslations, traverseDir } from './util';

const argv = yargs
    .option('dir', {
        alias: 'd',
        description: 'Directory where the files containing translations will be searched for',
        type: 'string'
    })
    .option('filter', {
        alias: 'f',
        description: 'List of file names/extensions that will be matched, separated with \',\', i.e. \'.ts,.tsx\'',
        type: 'string'
    })
    .option('name', {
        alias: 'n',
        description: 'Function/tagged template name to search for.',
        type: 'string'
    })
    .option('out', {
        alias: 'o',
        description: 'Output file',
        type: 'string'
    })
    .option('annotation', {
        alias: 'a',
        description: 'Annotation prefix',
        type: 'string',
        default: 'TRANSLATORS'
    })
    .help()
    .alias('help', 'h')
    .demandOption([ 'dir', 'filter', 'name' ]).parseSync();

(async () => {
    const files = await traverseDir(argv.dir, argv.filter.split(','));
    const translations = await extractTranslationsFromFiles(files, argv.annotation);
    const poFile = generatePoFromTranslations(translations);

    if (argv.out) {
        await fs.writeFile(argv.out, poFile);
    } else {
        console.log(Buffer.from(poFile).toString('utf-8'));
    }
})();
