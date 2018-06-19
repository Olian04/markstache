const  Mustache = require('mustache');
const path = require('path');
const fs = require('mem-fs-editor').create(require('mem-fs').create());
const fetch = require('node-fetch');

const Color = {
    RESET: '\033[0m',
    RED: '\033[1;31m',
    GREEN: '\033[1;32m',
    BLUE: '\033[1;34m',
    PURPLE: '\033[1;35m',
    WHITE: '\033[1;37m'
}
const OK = `[${Color.GREEN}OK${Color.RESET}]`;
const FAIL = `[${Color.RED}FAIL${Color.RESET}]`;
const URL = `[${Color.BLUE}URL${Color.RESET}]`;
const URI = `[${Color.PURPLE}URI${Color.RESET}]`;

module.exports = async function mustache(target, hash) {
    console.log('Starting up...');
    const root = path.join(__dirname, '../templates/');
    const path_template = path.join(target,  '/README_template.md');
    if (!fs.exists(path_template) ) {
        fs.copy(path.join(root, 'template.mustache'), path_template);
    }
    
    const template = fs.read(path_template);
    const fragmentManifest = require( path.join(root, 'template.manifest.json') );

    console.log('Preparing fragments...');
    const logs = [];
    const fragments = {};
    const requests = [];
    Object.keys(fragmentManifest).forEach(k => {
        if (fragmentManifest[k].uri) {
            if (!fs.exists(path.join(root, fragmentManifest[k].uri))) {
                console.log(`${FAIL + URI}: ${k} ${Color.WHITE}FILE NOT FOUND${Color.RESET}`)
            } else {
                fragments[k] = fs.read(path.join(root, fragmentManifest[k].uri));
                console.log(`${OK + URI}: ${k}`);
            }
        } else if (fragmentManifest[k].url) {
            requests.push(
                fetch(fragmentManifest[k].url)
                    .then(res => res.text())
                    .then(text => fragments[k] = text)
                    .then( () => { 
                        console.log(`${OK + URL}: ${k}`); 
                    })
                    .catch( e => { 
                        console.log(`${FAIL + URL}: ${k} ${Color.WHITE}${e.code}${Color.RESET}`); 
                    })
            );
        }
    });

    await Promise.all(requests)
        .catch(console.log);

    // Print accumulated logs
    console.log(logs.join('\n'));
    
    console.log('Rendering...');
    const output = Mustache.render(template, hash, fragments);
    fs.write(path.join(target,  '/README.md'),  output);
    fs.commit(() => {
        console.log('Done!');
    });
}
