
const path = require('path');
const utils = require('./utils');
const fs = require('fs');
const config = require('./cfg');

// https://www.cnblogs.com/champyin/p/12198515.html

class ManifestPlugin {

	apply(compiler) {

		var options = {};
		options.assets = false;
		options.version = false;
		options.timings = false;
		options.chunks = true;
		options.chunkModules = true;
		options.cached = false;
		options.source = false;
		options.errorDetails = false;
		options.chunkOrigins = false;
		options.chunkNames = false;

		/*
		{
			id: 0,
			rendered: true,
			initial: false,
			entry: false,
			recorded: undefined,
			reason: 'split chunk (cache group: common) (name: common)',
			size: 164812,
			names: [ 'common' ],
			files: [ 'dphoto-core/js/common.chunk.js?96dbde9ed6151fd920a0' ],
			hash: '96dbde9ed6151fd920a0',
			siblings: [
					1,  6,  7,  8,  9,
				10, 11, 12, 13, 14
			],
			parents: [
				0, 1, 3, 4,
				5, 6, 8
			],
			children: [
					0,  1,  2,  7,  9,
				11, 12, 13, 14, 15
			],
			childrenByOrder: [Object: null prototype] {},
			modules: [
				{
					id: 'zGoB',
					identifier: '/Users/louis/Project/hc/webpkit/node_modules/url-loader/dist/cjs.js??ref--6!/Users/louis/Project/hc/dphoto-core/assets/icon/netrepaire-success.png',
					name: './assets/icon/netrepaire-success.png',
					index: 470,
					index2: 465,
					size: 2361,
					cacheable: true,
					built: true,
					optional: false,
					prefetched: false,
					chunks: [ 0 ],
					issuer: '/Users/louis/Project/hc/webpkit/node_modules/babel-loader/lib/index.js??ref--5-0!/Users/louis/Project/hc/webpkit/node_modules/ts-loader/index.js??ref--5-1!/Users/louis/Project/hc/dphoto-core/src/activity/repair_wifi.tsx',
					issuerId: 'rlun',
					issuerName: './src/activity/repair_wifi.tsx',
					issuerPath: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
					profile: undefined,
					failed: false,
					errors: 0,
					warnings: 0,
					assets: [],
					reasons: [ [Object], [Object], [Object] ],
					usedExports: true,
					providedExports: null,
					optimizationBailout: [
						'ModuleConcatenation bailout: Module is not an ECMAScript module',
						'ModuleConcatenation bailout: Module is not an ECMAScript module'
					],
					depth: 6
				}
			],
			filteredModules: 0
		}
		*/

		// console.log(compiler.hooks);

		compiler.hooks.done.tap('ManifestPlugin', (stats) => {
			var data = stats.toJson(options);
			// console.log('-- ManifestPlugin --', data.modules.filter(e=>e.name&&['.ts','.tsx'].indexOf(path.extname(e.name))!=-1 ) );
			// console.log('-- ManifestPlugin --', data.chunks );
			// console.log('--- ManifestPlugin ---', path.resolve(config.output, utils.assetsPath('chunks.json')));
			// var s = path.resolve(config.output, utils.assetsPath('chunks.json'));

			// fs.writeFileSync(path.resolve(config.output, utils.assetsPath('js/chunks.json')), JSON.stringify(data.chunks, null, 2));
			fs.writeFileSync(path.resolve(config.output, utils.assetsPath('js/chunks.json')), JSON.stringify(data.chunks.map(e=>{
				return {
					entry: e.entry,
					id: e.id,
					initial: e.initial,
					names: e.names,
					files: e.files,
					hash: e.hash,
					parents: e.parents,
					modules: e.modules.map(e=>e.id),
				};
			}), null, 2));
		});
	}
}

exports.ManifestPlugin = ManifestPlugin;