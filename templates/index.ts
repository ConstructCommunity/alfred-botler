import fs from 'fs';

const isDev = process.env.NODE_ENV === 'development';
const extension = isDev ? '.ts' : '.js';

const whitelist = ['index' + extension, 'Template' + extension];
const files = fs.readdirSync(__dirname);

const modules = {};
for (let i = 0; i < files.length; i += 1) {
	const filename = files[i];
	if (filename.substr(-3) === extension && !whitelist.includes(filename)) {
		// eslint-disable-next-line
		modules[filename.slice(0, -3)] = require(`./${filename}`);
	}
}

export default modules;
