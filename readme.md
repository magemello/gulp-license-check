# gulp-license-check [![Build Status](https://travis-ci.org/magemello/gulp-license-check.svg?branch=master)](https://travis-ci.org/magemello/gulp-license-check)

> gulp-license-check is a Gulp extension to check the presence of a specific header in your files.


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

**path**: {string} . Path of your header file.
**blocking**: {boolean} default true. If set to true in case of missing header will block the build
**log**: {boolean} default true. If set to false will disavble the log in console. 


## License

MIT © [Mario Romano](http://magemello.github.io/)
