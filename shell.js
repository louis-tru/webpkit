#!/usr/bin/env node
/**
 * @copyright © 2018 Copyright dphone.com
 * @date 2018-11-05
 */

var argument = require('somes/arguments');
var fs = require('somes/fs');
var path = require('path');
var {exec} = require('somes/syscall');

const args = process.argv.slice(2);
const cmd = args.shift() || 'dev';
const cfg = args.shift() || '';
const opts = argument.options;
const help_info = argument.helpInfo;
const def_opts = argument.defOpts;

def_opts(['help', 'h'],       0,   '--help, -h         print help info');

function cp_cfg(cfg) {
	if (fs.existsSync(process.cwd() + '/.config.js')) {
		fs.writeFileSync(process.cwd() + '/config.js', fs.readFileSync(process.cwd() + '/.config.js'));
	} else if (fs.existsSync(process.cwd() + `/.cfg_${cfg}.js`)) {
		fs.writeFileSync(process.cwd() + '/config.js', fs.readFileSync(process.cwd() + `/.cfg_${cfg}.js`));
	}
}

async function exec_cmd(cmd) {
	// process.stdin.setRawMode(true);
	process.stdin.resume();
	await exec(cmd, {
		stdout: process.stdout,
		stderr: process.stderr, stdin: process.stdin,
	});
	process.exit();
}

function install() {
	console.log('install depes ...');
	// fs.copySync(__dirname + '/node_modules', process.cwd() + '/node_modules');
	exec_cmd(`npm install`);
}

function print_help() {
	process.stdout.write('Usage:\n');
	process.stdout.write('     \n  webpkit init [default|mobile|cms|dpk]\n');
	process.stdout.write('     \n  webpkit dev [cfg]\n');
	process.stdout.write('     \n  webpkit build [cfg]\n');
	process.stdout.write('     \n  webpkit install\n');
	process.stdout.write('Options:');
	process.stdout.write('\n  ' + help_info.join('\n  ') + '\n\n');
	process.exit();
}

function main() {

	if (opts.help) {
		print_help();
	}

	if (cmd == 'init') {
		console.log('init ...');
		fs.copySync(__dirname + '/examples/' + (cfg || 'default'), process.cwd());
		var name = path.basename(process.cwd());
		var json = fs.readFileSync(process.cwd() + '/package.json', 'utf8').replace('"examples"', `"${name}"`);
		fs.writeFileSync(process.cwd() + '/package.json', json);
		install();
	} else if (cmd == 'install') { // build
		install();
	} else if (cmd == 'build') { // build
		cp_cfg(cfg || 'prod');
		exec_cmd(`npm run build`);
	} else { // dev
		// cp_cfg(cfg || 'dev');
		// exec_cmd(`npm run dev`);
		print_help();
	}
}

main();
