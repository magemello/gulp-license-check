'use strict';
/* global describe, it */

var fs = require('fs'),
	assert = require('assert'),
	es = require('event-stream'),
	should = require('should'),
	File = require('gulp-util').File,
	gutil = require('gulp-util'),
	gulp = require('gulp'),
	license = require('../'),
	path = require('path');

require('mocha');

describe('gulp-license-check', function () {

	var HEADER_NOT_PRESENT = 'Header not present';
	var HEADER_PRESENT = 'Header present';

	describe('in buffer mode', function () {

		it('file should pass through', function (done) {

			var fileCount = 0;
			var stream = license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: false,
				logError: false
			});

			stream.on('data', function (file) {
				assert(!file.isStream());
				should.exist(file);
				should.exist(file.contents);
				++fileCount;
			});

			stream.once('end', function () {
				gutil.log('end');
				fileCount.should.equal(1);
				done();
			});

			stream.write(new File({
				path: './test/fixture/ok.js',
				contents: fs.readFileSync('./test/fixture/ok.js')
			}));
			stream.end();
		});
	});

	describe('in streaming mode', function () {

		it('file should pass through', function (done) {

			var fileCount = 0;
			var stream = license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: false,
				logError: false
			});

			stream.once('data', function (file) {
				assert(file.isStream());
				should.exist(file);
				should.exist(file.contents);
				++fileCount;
			});

			stream.once('end', function () {
				fileCount.should.equal(1);
				done();
			});

			stream.write(new File({
				path: './test/fixture/ok.js',
				contents: es.merge([
					fs.createReadStream('./test/fixture/ok.js')
				])
			}));
			stream.end();
		});
	});

	describe('setting tests', function () {

		it('if {logInfo: false, logError: false } should not log in console and event', function (done) {
			var logs = [];
			var stream = gulp.src('./test/fixture/*.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: false,
				logError: false
			}));

			stream.on('log', function (log) {
				logs.push(log);
			});

			stream.on('data', function () {
			});

			stream.on('end', function () {
				logs.length.should.equal(0);
				done();
			});
		});

		it('if {logError: true } should log errors in console and event channel', function (done) {
			var logs = [];
			var stream = gulp.src('./test/fixture/ko.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: false,
				logError: true
			}));

			stream.on('log', function (log) {
				logs.push(log);
			});

			stream.on('data', function () {
			});

			stream.on('end', function () {
				logs.length.should.equal(1);
				done();
			});
		});

		it('if {logError: true } should not log errors in console and event channel', function (done) {
			var logs = [];
			var stream = gulp.src('./test/fixture/ko.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: false,
				logError: false
			}));

			stream.on('log', function (log) {
				logs.push(log);
			});

			stream.on('data', function () {
			});

			stream.on('end', function () {
				logs.length.should.equal(0);
				done();
			});
		});

		it('if {logInfo: true } should log info in console and event channel', function (done) {
			var logs = [];
			var stream = gulp.src('./test/fixture/ok.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: true,
				logError: false
			}));

			stream.on('log', function (log) {
				logs.push(log);
			});

			stream.on('data', function () {
			});

			stream.on('end', function () {
				logs.length.should.equal(1);
				done();
			});
		});

		it('if {logInfo: false } should not log info in console and event channel', function (done) {
			var logs = [];
			var stream = gulp.src('./test/fixture/ok.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: false,
				logError: false
			}));

			stream.on('log', function (log) {
				logs.push(log);
			});

			stream.on('data', function () {
			});

			stream.on('end', function () {
				logs.length.should.equal(0);
				done();
			});
		});

		it('if header file do not exist throw an error', function (done) {

			gulp.src('./test/fixture/ok.js').pipe(license({
				path: './test/fixture/header_no_exist.txt',
				blocking: false,
				logInfo: false,
				logError: false
			}).on('error', function (error) {
				should.exist(error.message);
				error.message.should.equal('The license header file doesn`t exist ./test/fixture/header_no_exist.txt');
				done();
			}));
		});

		it('if license not present in a file and {blocking: true} should throw an error', function (done) {

			var stream = gulp.src('./test/fixture/ko.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: true,
				logInfo: false,
				logError: false
			}));

			stream.once('error', function (error) {
				should.exist(error.message);
				error.message.should.containEql('The following file doesn`t contain the license header');
				done();
			});
		});

		it('if license not present in a file and {blocking: false} should not throw an error', function (done) {

			var files = [];
			var errors = [];

			var stream = gulp.src('./test/fixture/*.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: false,
				logError: false
			}));

			stream.on('error', function (error) {
				errors.push(error);
				done();
			});

			stream.on('data', function (file) {
				files.push(file);
			});

			stream.on('end', function () {
				files.length.should.equal(5);
				errors.length.should.equal(0);
				done();
			});
		});
	});

	describe('behaviour tests', function () {

		it('allows trailing newlines', function (done) {

			var files = [];
			var errors = [];

			var stream = gulp.src('./test/fixture/trailing-ok.js').pipe(license({
				path: './test/fixture/trailing-header.txt',
				blocking: false,
				logInfo: false,
				logError: false
			}));

			stream.on('error', function (error) {
				errors.push(error);
			});

			stream.on('data', function (file) {
				files.push(file);
			});

			stream.on('end', function () {
				files.length.should.equal(1);
				errors.length.should.equal(0);
				done();
			});
		});

		it('multiple files should pass through', function (done) {

			var files = [];
			var stream = gulp.src('./test/fixture/*.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: false,
				logError: false
			}));

			stream.on('error', done);

			stream.on('data', function (file) {
				files.push(file);
			});

			stream.on('end', function () {
				files.length.should.equal(5);
				done();
			});
		});

		it('no files are acceptable', function (done) {

			var files = [];
			var stream = gulp.src('./test/fixture/*.donotexist').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: false,
				logError: false
			}));

			stream.on('error', done);

			stream.on('data', function (file) {
				files.push(file);
			});

			stream.on('end', function () {
				files.length.should.equal(0);
				done();
			});

			stream.end();
		});

		it('if license present in a file and {blocking: true} should not throw an error', function (done) {

			var files = [];
			var errors = [];

			var stream = gulp.src('./test/fixture/ok.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: false,
				logError: false
			}));

			stream.on('error', function (error) {
				errors.push(error);
			});

			stream.on('data', function (file) {
				files.push(file);
			});

			stream.on('end', function () {
				files.length.should.equal(1);
				errors.length.should.equal(0);
				done();
			});
		});

		it('if license present in a file should be logged as header present', function (done) {

			var stream = gulp.src('./test/fixture/ok.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: true,
				logError: false
			}));

			stream.on('log', function (log) {
				log.msg.should.equal(HEADER_PRESENT);
				log.path.should.containEql(path.normalize('/test/fixture/ok.js'));
				done();
			});
		});

		it('if license present in a file and contain strict should be logged as header present', function (done) {

			var stream = gulp.src('./test/fixture/strict.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: true,
				logError: false
			}));

			stream.on('log', function (log) {
				log.msg.should.equal(HEADER_PRESENT);
				log.path.should.containEql(path.normalize('/test/fixture/strict.js'));
				done();
			});
		});

		it('if license not present in a file should be logged as header not present', function (done) {

			var stream = gulp.src('./test/fixture/ko.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: false,
				logError: true
			}));

			stream.on('log', function (log) {
				log.msg.should.equal(HEADER_NOT_PRESENT);
				log.path.should.containEql(path.normalize('/test/fixture/ko.js'));
				done();
			});

		});

		it('should not check empty files', function (done) {

			var files = [];
			var headerNotPresent = [];

			var stream = gulp.src('./test/fixture/empty.js').pipe(license({
				path: './test/fixture/header.txt',
				blocking: false,
				logInfo: true,
				logError: true
			}));

			stream.on('log', function (log) {
				if (log.msg === HEADER_NOT_PRESENT) {
					headerNotPresent.push(log);
				}
			});

			stream.on('data', function (file) {
				files.push(file);
			});

			stream.on('end', function () {
				files.length.should.equal(1);
				headerNotPresent.length.should.equal(0);
				done();
			});
		});
	});
});
