const  Mustache = require('mustache');
const path = require('path');
const fs = require('mem-fs-editor').create(require('mem-fs').create());
const { readdirSync } = require('fs');
const fetch = require('node-fetch');
const ProgressBar = require('progress');

module.exports = async function mustache(target, hash, cb = () => {}) {
    console.log('Starting up...');
    const root = path.join(__dirname, '../templates/');
    const path_template = path.join(target,  '/README_template.md');
    if (!fs.exists(path_template) ) {
        fs.copy(path.join(root, 'template.mustache'), path_template);
    }
    
    const template = fs.read(path_template);
    const fragmentManifest = require( path.join(root, 'template.manifest.json') );
    
    const progressBar = new ProgressBar('preparing fragments [:bar] :etas', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: Object.keys(fragmentManifest).length
    });

    const fragments = {};
    const requests = [];
    Object.keys(fragmentManifest).forEach(k => {
        if (fragmentManifest[k].uri) {
            fragments[k] = fs.read(path.join(root, fragmentManifest[k].uri));
            progressBar.tick();
        } else if (fragmentManifest[k].url) {
            requests.push(
                fetch(fragmentManifest[k].url)
                    .then(res => res.text())
                    .then(text => fragments[k] = text)
                    .then( () => progressBar.tick())
            );
        }
    });

    await Promise.all(requests)
        .catch(console.log);
    
    console.log('Rendering...');
    const output = Mustache.render(template, hash, fragments);
    fs.write(path.join(target,  '/README.md'),  output);
    fs.commit(cb);
    console.log('Done!');
}
