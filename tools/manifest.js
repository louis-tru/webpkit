
const somes = require('somes').default;
const path = require('path');
const utils = require('./utils');
const fs = require('fs');
const config = require('./cfg');
const crypto = require('crypto');

// https://www.cnblogs.com/champyin/p/12198515.html

function mkdirp(dir) {
	if (dir) {
		if (!fs.existsSync(dir)) {
			mkdirp(path.dirname(dir));
			fs.mkdirSync(dir);
		}
	}
}

// console.log('config.configOsmosis', config.configOsmosis);

const hash_buf_len = 256*256;// 65536b = 64kb
const hash_buf = Buffer.from({length: hash_buf_len});

function hash_md4(filename, characteristic) {
	var fd = fs.openSync(filename.replace(/\?.*$/, ''));
	var size = 0;
	var hash = crypto.createHash('md4');

	while ( (size = fs.readSync(fd, hash_buf, 0, hash_buf_len)) > 0 ) {
		hash.update(Buffer.from(hash_buf.buffer, 0, size));
		if (size < hash_buf_len)
			break;
	}
	fs.closeSync(fd);

	if (characteristic)
		hash.update(characteristic);

	return hash.digest('base64');
}

function hash_simple(filename, characteristic) {
	return somes.hash(hash_md4(filename, characteristic));
}

function relativePath(path) {
	var ignored = 'ignored ';
	if (path.substr(0, ignored.length) == ignored) {
		path = path.substr(ignored.length);
	}
	return path.substr(config.source.length + 1);
}

class ManifestPlugin {

	apply(compiler) {
		if (config.isProd)
			this.applyManifest(compiler);
		this.applyChunkIds(compiler);
		this.applyModuleIds(compiler);
	}

	applyManifest(compiler) {

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

		compiler.hooks.done.tap('Manifest', (stats) => {
			var data = stats.toJson(options);
			var path_str = path.resolve(config.output, utils.assetsPath('chunks.json'));

			mkdirp(path.dirname(path_str));

			fs.writeFileSync(path_str, JSON.stringify(data.chunks.map(e=>{
				return {
					entry: e.entry,
					id: e.id,
					initial: e.initial,
					names: e.names,
					files: e.files,
					hash: e.hash,
					parents: e.parents,
					modules: e.modules.map(e=>e.id),
					includes: e.modules.map(e=>{
						var id = e.identifier;
						var i = id.lastIndexOf('!');
						id = i == -1 ? id: id.substr(i + 1);
						id = relativePath(id);
						if (!id)
							id = e.identifier;
						return id;
					}),
				};
			}), null, 2));
		});

	}

	applyChunkIds(compiler) {

		/*
		 * 重新指定输出文件名称,添加应用前缀
		 * 这会影响到配置 optimization.chunkIds
		 */
		var _autoId = 0;
		var _retainRaws = [
			'low', 'somes_bigint', 'runtime',
		];

		compiler.hooks.compilation.tap("ManifestChunkIds", compilation => {
			compilation.hooks.beforeChunkIds.tap("ManifestChunkIds", chunks => {
				for (const chunk of chunks) {

					if (config.productName == chunk.name) { // entry name
						chunk.id = config.productName;
					} else {
						if (_retainRaws.indexOf(chunk.name) != -1) {
							chunk.id = chunk.name; // retain raw name
						} else {
							chunk.id = config.productName + '_' + (chunk.name ? chunk.name: _autoId++);
						}
					}
				}
			});
		});

	}

	applyModuleIds(compiler) {

		/*
		 * 重新指定模块的id，取文件内容hash做为id
		 * 这会影响到配置 optimization.moduleIds
		 */

		const configPath = `${process.cwd()}/config.js`;
		var configHash = '';

		var _autoId = 0;

		compiler.hooks.compilation.tap("ManifestModuleIds", compilation => {
			const hashDigestLength = 4;
			const usedIds = new Set();
			const useMd4 = true;
			const genHashCode = useMd4 ? hash_md4: hash_simple;

			compilation.hooks.beforeModuleIds.tap("ManifestModuleIds", modules => {
				for (var module of modules) {
					var rawModule = module;
					var resource = module.resource;
					if (!resource && module.rootModule)
						module = module.rootModule;

					if (module.resource) {
						rawModule.id = genHashCode(module.resource, module.rawRequest.indexOf('!') ? '!': '');
						rawModule._resource = module.resource;
					} else {
						rawModule.id = config.productName + '_mod_' + (_autoId++);
					}
					if (!configHash && module.resource == configPath) {
						configHash = rawModule.id;
						rawModule._isConfig = true;
						module._isConfig = true;
					}
				}
			});

			function hasDependencieConfig(module, set) {
				for (var depe of module.dependencies) {
					if (depe.module) {
						var depe_module = depe.module;
						if (!set.has(depe_module)) {
							set.add(depe_module);
							if (
								module._markDependencieConfig || 
								depe_module._isConfig || 
								hasDependencieConfig(depe_module, set)
							) {
								module._markDependencieConfig = true;
								return true;
							}
						}
					}
				}
				return false;
			}

			compilation.hooks.moduleIds.tap("ManifestModuleIds", modules => {
				for (var module of modules) {
					var ids = [String(module.id)];
					if (config.configOsmosis) {
						if (hasDependencieConfig(module, new Set)) {
							ids.push(configHash); // module id 间接受/config.js内容影响（config渗透），一般情况下不需要开启
						}
					}
					var id = crypto.createHash('md4').update(ids.join('')).digest('base64');
					var len = hashDigestLength;
					while (usedIds.has(id.substr(0, len)))
						len++;
					id = id.substr(0, len);
					usedIds.add(id);

					module.id = id;
				}
			});

			// end
		});
	}

}

module.exports = ManifestPlugin;