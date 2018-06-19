const common = {
    port: 8080
};
module.exports = {
    title: 'Test',
    description: '',
    "userChanges?": {
        markdown: '' // Empty string is considered Falsy.
    },
    fragments: {
        api_reference: {
            port: common.port
        },
        code_example: {},
        contributions: {},
        installation: {},
        license: {},
        motivation: {},
        synopsis: {},
        tests: {}
    }
};