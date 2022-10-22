const pathlib = require('path');

let path = {
    'MAKE_CONFIG':pathlib.join('gen','config','make.json'),
    'MAKE_FILE':pathlib.join('Makefile'),
    'GEN_DIR':'gen',
    'CONFIG_DIR':pathlib.join('gen','config'),
    'TEMP_DIR':pathlib.join('gen','tmp'),
    'BUILD_DIR':pathlib.join('gen','build'),
}

module.exports = {path}