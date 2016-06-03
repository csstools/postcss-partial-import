var path    = require('path');
var postcss = require('postcss');
var expect  = require('chai').expect;
var fs      = require('fs-promise');

var plugin = require('../');

function testFixture(name, opts) {
	var fixtureDir = './test/fixtures/';
	var inputPath  = path.resolve(fixtureDir + name + '.css');
	var actualPath = path.resolve(fixtureDir + name + '.actual.css');
	var expectPath = path.resolve(fixtureDir + name + '.expect.css');

	var inputCSS  = fs.readFileSync(inputPath, 'utf8').replace(/\r\n/g, '\n');
	var expectCSS = fs.readFileSync(expectPath, 'utf8').replace(/\r\n/g, '\n');

	return postcss([plugin(opts)]).process(inputCSS, {
		from: inputPath
	}).then(function (result) {
		var actualCSS = result.css;

		fs.writeFileSync(actualPath, actualCSS);

		expect(actualCSS).to.eql(expectCSS);
		expect(result.warnings()).to.be.empty;
	});
}

function testString(inputCSS, expectCSS, opts) {
	return postcss([plugin(opts)]).process(inputCSS).then(function (result) {
		var actualCSS = result.css;

		expect(actualCSS).to.eql(expectCSS);
		expect(result.warnings()).to.be.empty;
	});
}

describe('postcss-partial-import', function () {
	it('imports up and down a tree', function () {
		return testFixture('basic', {});
	});

	it('fails on bad imports', function () {
		var fixtureDir = './test/fixtures/';
		var inputPath  = path.resolve(fixtureDir + 'broken.css');
		var inputCSS  = fs.readFileSync(inputPath, 'utf8');
		return postcss([plugin({})]).process(inputCSS, {
			from: inputPath
		}).then(function () { }, function (err) {
			expect(err).to.eql('Empty import detected');
		});
	});

	it('generates imports', function () {
		var fixtureDir = './test/fixtures/';
		var name       = 'generate';
		var inputPath  = path.resolve(fixtureDir + name + '.css');
		var actualPath = path.resolve(fixtureDir + name + '.actual.css');
		var expectPath = path.resolve(fixtureDir + name + '.expect.css');
		var tempPath   = path.resolve(fixtureDir + name + '-created.css');

		var inputCSS  = fs.readFileSync(inputPath, 'utf8');
		var expectCSS = fs.readFileSync(expectPath, 'utf8');

		return postcss([plugin({ generate: true })]).process(inputCSS, {
			from: inputPath
		}).then(function (result) {
			var actualCSS = result.css;

			fs.writeFileSync(actualPath, actualCSS);

			expect(actualCSS).to.eql(expectCSS);
			expect(result.warnings()).to.be.empty;

			return fs.stat(tempPath);
		}).then(function () {
			return fs.remove(tempPath);
		});
	});

	it('handles string input', function () {
		return testString('@import "test/fixtures/level1/qux";', '.level-1-qux {\n    background-color: black\n}', {});
	});

	it('ignores remote imports', function () {
		return testFixture('web', {});
	});

	it('handles media queried imports', function () {
		return testFixture('media', {});
	});

	it('caches results', function () {
		fs.removeSync('./test/cache');

		return testFixture('basic', { cachedir: path.join(__dirname, 'cache') }, function () {
			var cache = require( path.join(__dirname, 'cache', 'imports.json'));
			expect(Object.keys(cache).length).to.eql(10);
			return testFixture('basic', { cachedir: path.join(__dirname, 'cache') });
		});
	});
});
