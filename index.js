#!/usr/bin/env node
const program = require('commander'),
	path = require('path'),
	fs = require('fs');

function generate(type, name) {
	switch (type) {
		case "module": generateModule(name);
			return;
	}
	console.log("Error: Cannot generate unknown thing");
}

function generateModule(name) {
	if (!fs.existsSync('./' + name)) {
		fs.mkdirSync('./' + name);

		let initFileContent = `from flask import Blueprint\n${name} = Blueprint('${name}', __name__, template_folder = 'templates')\nfrom app.${name} import routes`;

		let routesFileContent = `from flask import render_template, request, flash, redirect, url_for, current_app\nfrom app.${name} import ${name} as ${name}`

		fs.writeFileSync('./' + name + '/__init__.py', initFileContent);
		fs.writeFileSync('./' + name + '/routes.py', routesFileContent);
	}
}


program
	.arguments('<action> <type> <name>')
	.action((action, type, name) => {
		if (!name.match(/^[a-z0-9]+$/i)) {
			console.log("Error: Invalid characters in the name");
			return;
		}
		switch (action) {
			case "generate": generate(type, name);
				return;
		}
		console.log("Error: Invalid command");
	})
	.parse(process.argv)