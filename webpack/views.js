
const config = require('./cfg');
const fs = require('fs');
const path = require('path');

const views = ['.', 'views', 'app'].map(inputDir=>{
	if (fs.existsSync(`${config.source}/${inputDir}`) && fs.statSync(`${config.source}/${inputDir}`).isDirectory()) {

		var r = fs.readdirSync(inputDir)
		.filter(e=>['.jsx','.tsx','.ts','.js'].indexOf(path.extname(e))!=-1)
		.filter(e=>fs.statSync(path.join(inputDir, e)).isFile())
		.map(e=>{
			var ext = path.extname(e);
			var name = e.substr(0, e.length - ext.length);
			var path_ = './' + path.join(inputDir, name);
			return { name, path: path_, html: path_ + '.html' };
		})
		.filter(e=>fs.existsSync(e.html)&&fs.statSync(e.html).isFile());

		if (r.length)
			return r;
	}
}).find(e=>e);

module.exports = views;