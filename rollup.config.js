var babel = require('rollup-plugin-babel');

var config = {
    entry: './source/script/index.jsx',
    dest: 'build.js',
    format: 'iife',
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'tFlux': 'tFlux',
      'tFluxReact': 'tFluxReact'
    },
    plugins: [
      babel()
    ]
};

module.exports = config;
