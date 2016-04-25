# gulp-license-check [![Build Status](https://travis-ci.org/magemello/gulp-license-check.svg?branch=master)](https://travis-ci.org/magemello/gulp-license-check)

> gulp-license-check is a Gulp extension to check the presence of a specific header in all the files of a project, and give to you a log of all the files where the header is missing. Never miss again a license header in a file.

## Install

```
$ npm install --save-dev gulp-license-check
```

## Usage

```js
const license = require('gulp-license-check');

gulp.task('license', function () {
    gulp.src('./app/**/*.ts')
        .pipe(license({
            path: 'app/license_header.txt',
            blocking: false,
            log: true
        }));
});
```

#### Options

<<<<<<< HEAD
**path**: {string} . Path of your header file.<br />
**blocking**: {boolean} default true. If set to true in case of missing header will block the build.<br />
**log**: {boolean} default true. If set to false will disavble the log in console.<br />
=======
**path**: {string} . Path of your header file, this is the header that has to match in all the files of the project.<br />
**blocking**: {boolean} default true. If it's true, in case of missing header will block the build.<br />
**log**: {boolean} default true. If it's false the plugin doesn't not show the log in the console.<br />
>>>>>>> improve description and ignore

## License

MIT © [Mario Romano](http://magemello.github.io/)
