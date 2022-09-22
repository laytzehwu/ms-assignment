/**
 * Overrides the tsconfig used for the app.
 * In the test environment we need some tweaks.
 */

 const tsNode = require('ts-node');
 const testTSConfig = require('./test/tsconfig.json');
 
 tsNode.register({
   files: true,
   transpileOnly: true, // avoid checking the test code during the “compiling” phase.
   project: './test/tsconfig.json'
 });