# img-find-and-copy

> A Grunt plugin to find only the used images in your CSS and HTML files and copy those images to your build location.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```
npm install img-find-and-copy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```
grunt.loadNpmTasks('img-find-and-copy');
```

## The "img_find_and_copy" task

### Overview
In your project's Gruntfile, add a section named `img_find_and_copy` to the data object passed into `grunt.initConfig()`. E.g:

```
grunt.initConfig({
  img_find_and_copy: {
        resources: {
          files: {
            'build': ['css/**/*.css', '*.html']
          }
        }
      }
})
```


The options are pretty simple, in the example above
`
'build': ['css/**/*.css', '*.html']
`
the `build` is the location folder where you want your images copied to, this is ideally your build folder (e.g. dist etc). The array of wildcard file definitions in `['css/**/*.css', '*.html']` are the files that will be evaluated for image references. 

You can specify CSS or HTML files, once images are found they will be copied to the `build` folder and the relative paths will be mapped and resolved so all original paths remain the same.



### Usage Examples

#### Default Options
Evaluate all my local CSS and HTML files that are used in Dev mode and copy all the referenced images to my `build` folder. So I can have 100s of reference images in Dev mode (if needed) but only have the used actually used by my app to appear in my final build.

```
grunt.initConfig({
  img_find_and_copy: {
        resources: {
          files: {
            'build': ['css/**/*.css', '*.html']
          }
        }
      }
})
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
1.0.0 - Initial version (bugs may be found so please test and raise any issues)

## License
Copyright (c) 2015 newbreedofgeek. Licensed under the MIT license.
