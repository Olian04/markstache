const path = require('path');
const fs = require('mem-fs-editor').create(require('mem-fs').create());
const GenerateReadme = require(path.join(__dirname, '../lib/mustache'));

const target = process.argv[2];
if (target === undefined) throw new Error('Missing argument: README path');

let hash = {};
if (process.argv[3] && fs.exists(process.argv[3])) {
    console.log(process.argv[3])
    hash = fs.readJSON( process.argv[3] );
}
for (let i = 3; i < process.argv.length; i++) {
    if (process.argv[i].indexOf('=') < 0) {
        throw new Error(
            `Unexpected argument: ${process.argv[i]}
            Arguments should follow syntax "key=value".`
        );
    }
    const [ key, value ] = process.argv[i].split('=');
    hash[key] = value;
}

GenerateReadme(target, hash);