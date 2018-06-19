# markstache

NOTE: `templates/fragments` folder is temporary and will be removed once all fragments have been designed and uploaded on their respective hosts.

## Run demo:

To run the demo simply run:
```
npm run cli
```
Which is equivalent to running:
```
 node ./bin/cli.js ./demo ./demo/README_hash.json
```

If then try and edit the contents of `./demo/README_template.md`.
And  then run `npm run cli` again, you can see your changes reflected in the `./demo/README.md` file.

## How to use: 

1. Clone markstache: `git clone <repo_url>`
2. _[For reoccurring usage]_ Run `npm link`, this will make `markstach` a globally recognized command. 
    1. Run markstache: `markstache <path/to/target/folder> <path/to/hash.json>`
3. _[For single use]_ Run markstache `node ./bin/cli.js <path/to/target/folder> <path/to/hash.json>`

## How to update template: 

1. `template.mustache` must exist in `templates` folder.
    1. This file is a combined markdown + mustache file. Think of it as markdown++. Links to mustache docs can be found at the top of the file.
2. `template.manifest.json` must exist in `templates` folder.

```js
// template.manifest.json
{
    fragment1: {
        url: 'https://raw.githubusercontent.com/path/to/remote/fragment.mustache' 
        // [Recommended] URL is used for remote fragments 
    },
    fragment2: {
        uri: 'path/to/local/fragment.mustache'
        // URI is used for local fragments
        // Path must be relative to the templates folder
        // Will be used if it exists, even if a URL is defined.
    }
}
```