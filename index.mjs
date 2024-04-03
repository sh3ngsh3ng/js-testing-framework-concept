

// Part 1: Getting all the files

// 1.1 The Slow Way
// However, this is a slow process. Thus, use the jest-haste-map lib instead
// import * as glob from 'glob';
// const testFiles = glob.sync('**/*.test.js');
// console.log(testFiles)

// 1.2 The Jest Way
// jest-haste-map is faster because it keeps a cache of the files. Just running
// test on those files that changed

import JestHasteMap from 'jest-haste-map';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { cpus } from 'os';

const root = dirname(fileURLToPath(import.meta.url))
const hasteMapOptions = {
    rootDir: root,
    roots: [root], // sub dir to watch
    maxWorkers: cpus().length,
    platforms: [],
    extensions: ['js'],
    name: 'Simple-Test'
}
const hasteMap = new JestHasteMap.default(hasteMapOptions)
await hasteMap.setupCachePath(hasteMapOptions);

const { hasteFS } = await hasteMap.build();

// console.log("exists?", hasteFS.exists('tests/01.test.js'))

// const testFiles = hasteFS.getAllFiles();
const testFiles = hasteFS.matchFilesWithGlob(['**/*.test.js']);
console.log(testFiles)




// Part 2: Reading the test files
import { runTest } from './worker.js';
import { Worker } from 'jest-worker';
import chalk from 'chalk';

const worker = new Worker(join(root, 'worker.js'));

let hasFailed = false;
for await (const testFile of testFiles) {
    // const code = await fs.promises.readFile(testFile, 'utf-8');
    // console.log(testFile + '\n' + code)

    // console.log(await runTest(testFile))
    const { success, errorMessage } = await worker.runTest(testFile)
    const status = success ? chalk.green.inverse(' PASS ') : chalk.red.inverse(' FAIL ');
    console.log(status + ' ' + chalk.dim(relative(root, testFile)))
    if (!success) {
        hasFailed = true
        console.log(' ' + errorMessage)
    }
}

worker.end()

if (hasFailed) {
    console.log(chalk.red.bold("Te test run fails. Please fix failing test"));
    // process.exitCode = 1
}