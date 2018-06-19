const  Mustache = require('mustache');
const path = require('path');
const fs = require('mem-fs-editor').create(require('mem-fs').create());
const { readdirSync } = require('fs');

module.exports = function mustache(target, hash, cb = () => {}) {
    const root = path.join(__dirname, '../templates/');
    const path_template = path.join(target,  '/README_template.md');
    if (!fs.exists(path_template) ) {
        fs.copy(path.join(root, 'template.mustache'), path_template);
    }

    const template = fs.read(path_template);
    const fragments = readdirSync( path.join(root, 'fragments'))
        .reduce((res, fileName) => {
            const key = fileName.substring(0, fileName.lastIndexOf('.'));
            res[key] = fs.read(path.join(root, 'fragments', fileName));
            return res;
        }, {});
    
    const output = Mustache.render(template, hash, fragments);
    fs.write(path.join(target,  '/README.md'),  output);
    fs.commit(cb);
}
