#! /usr/bin/env node

const path = require('path');
const fs = require('mem-fs-editor').create(require('mem-fs').create());

const GenerateReadme = require(path.join(__dirname, '../lib/mustache'));

if (process.argv.length < 3) {
    throw new Error('Missing argument: root directory');
}
if (process.argv.length < 4) {
    throw new Error('Missing argument: hash path');
} else if (!fs.exists(process.argv[3])) {
    throw new Error('Invalid argument: hash path, file not found');
}

const target = process.argv[2];
const hash = fs.readJSON( process.argv[3] );

GenerateReadme(target, hash);