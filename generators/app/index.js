import Generator from 'yeoman-generator';
import Logger from '../../lib/logger';


module.exports = class extends Generator {
    logger = new Logger(this);
    constructor(args, opts) {
        super(args, opts);

        this.argument('path', {
            type: String,
            optional: true,
            default: './README.md'
        });

        this.option('noTransclude', {
            type: Boolean,
            default: false
        });

        this.option('logLevel', {
            type: Number,
            alias: 'L',
            default: 1,
            description: '0 = Nothing, 1 = Errors, 2 = Warnings, 3 = Info, 4 = Debug'
        });
        this.logger.setMaxLogLevel(this.options.logLevel);
    }
};