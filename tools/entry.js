
const config = require('./cfg');
const views = require('./views');

var devClient = [];

if (!config.isProd && config.dev.inline === false) {
	devClient.push('webpkit/tools/dev-client');
	if (config.dev.hotOnly) {
		devClient.push('webpack/hot/only-dev-server');
	} else if (config.dev.hot) {
		devClient.push('webpack/hot/dev-server');
	}
}

views.forEach(({name,path})=>{
	exports[name] = ['webpkit/tools/low', ...devClient, path ];
});