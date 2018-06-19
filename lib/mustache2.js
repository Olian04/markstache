const  Mustache = require('mustache');
const path = require('path');
const fs = require('mem-fs-editor').create(require('mem-fs').create());
const { readdirSync } = require('fs');

function mustache(root, target) {
    const path_template = path.join(target,  '/template.md');
    if (!fs.exists(path_template) ) {
        fs.copy(path.join(root, 'template.md'), path.join(target,  '/template.md'));
    }

    const template = fs.read(path_template);
    const hash = require( path.join(root, 'hash.js') );
    const fragments = readdirSync( path.join(root, 'fragments'))
        .reduce((res, fileName) => {
            const key = fileName.substring(0, fileName.lastIndexOf('.'));
            res[key] = fs.read(path.join(root, 'fragments', fileName));
            return res;
        }, {});
    
    const output = Mustache.render(template, hash, fragments);
    return output;
}

// This should be moved out to the main yeoman script later
const root = path.join(__dirname, '../templates/test_mustache_2/');
const target = process.argv[2];
if (target === undefined) throw new Error('Missing argument: README path');

console.log(`Generating README...`)
const output = mustache(root, target);
fs.write(path.join(target,  '/README.md'),  output);
fs.commit(() => {
    console.log(`README successfully generated!\n${root}${target}`);
});
