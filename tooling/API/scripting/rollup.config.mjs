import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const config = {
    input: 'index.mjs',
    output: {
      file: 'dist/bundle5.js',
      format: 'cjs',
      name: 'MyModuleName',
    },
    plugins: [resolve(),  commonjs({
      include: /node_modules/,
      requireReturnsDefault: 'auto',
    })],
  };
  
  export default config;