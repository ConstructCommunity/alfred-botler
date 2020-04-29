import fs from 'fs';

const whitelist = ['index.js', 'Template.js'];
const files = fs.readdirSync(__dirname);

const modules = {};
for (let i = 0; i < files.length; i += 1) {
  const filename = files[i];
  if (filename.substr(-3) === '.js' && !whitelist.includes(filename)) {
    // eslint-disable-next-line
    modules[filename.slice(0, -3)] = require(`./${filename}`);
  }
}

console.log('modules', modules);

export default modules;
