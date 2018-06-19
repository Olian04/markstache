const  Mustache = require('mustache');
const path = require('path');
const fs = require('mem-fs-editor').create(require('mem-fs').create());
const { readdirSync } = require('fs');

function mustache(root, target) {
    let userChanges = '';
    if (fs.exists(target) ) {
        const startToken = '<!-- USER_CHANGES_START -->';
        const endToken = '<!-- USER_CHANGES_END -->';
        const currentTarget = fs.read(target);
        if (currentTarget.indexOf(startToken) < 0 || currentTarget.indexOf(endToken) < 0) {
            userChanges = currentTarget.trim();
        } else {
            userChanges = currentTarget.substring(
                currentTarget.indexOf(startToken) + startToken.length + 1,
                currentTarget.indexOf(endToken) - 1 // 1 = line break
            ).trim();
        }
    }

    const template = fs.read( path.join(root, 'template.mustache') );
    const hash = require( path.join(root, 'hash.js') );
    if (userChanges !== '') {
        hash['userChanges?'] = { markdown: userChanges };
    }

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
const root = path.join(__dirname, '../templates/test_mustache/');
const target = process.argv[2];
if (target === undefined) throw new Error('Missing argument: README path');

console.log(`Generating README...`)
const output = mustache(root, target);
fs.write(target,  output);
fs.commit(() => {
    console.log(`README successfully generated!\n${root}${target}`);
});
