var path    = require('path');
var postcss = require('postcss');
var expect  = require('chai').expect;
var fs      = require('fs');

var plugin = require('../');

function testFixture(name, opts, done) {
	var fixtureDir = './test/fixtures/';
	var inputPath  = path.resolve(fixtureDir + name + '.css');
	var actualPath = path.resolve(fixtureDir + name + '.actual.css');
	var expectPath = path.resolve(fixtureDir + name + '.expect.css');

	var inputCSS  = fs.readFileSync(inputPath, 'utf8');
	var expectCSS = fs.readFileSync(expectPath, 'utf8');

	postcss([plugin(opts)]).process(inputCSS, {
		from: inputPath
	}).then(function (result) {
		var actualCSS = result.css;

		fs.writeFileSync(actualPath, actualCSS);

		expect(actualCSS).to.eql(expectCSS);
		expect(result.warnings()).to.be.empty;

		done();
	}).catch(function (error) {
		done(error);
	});
}

function testString(inputCSS, expectCSS, opts, done) {
	postcss([plugin(opts)]).process(inputCSS).then(function (result) {
		var actualCSS = result.css;

		expect(actualCSS).to.eql(expectCSS);
		expect(result.warnings()).to.be.empty;

		done();
	}).catch(function (error) {
		done(error);
	});
}

describe('postcss-partial-import', function () {
	this.timeout(10000);

	it('imports up and down a tree', function (done) {
		testFixture('basic', {}, done);
	});

	it('ignores bad imports', function (done) {
		testFixture('broken', {}, done);
	});

	it('handles string input', function (done) {
		testString('@import "test/fixtures/level1/qux";', '.level-1-qux {\n    background-color: black\n}', {}, done);
	});

	it('handles url imports', function (done) {
		testFixture('web', {}, done);
	});
});
