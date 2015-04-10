/*
 * grunt-img-find-and-copy
 *
 * Copyright (c) 2015 newbreedofgeek
 * Licensed under the MIT license.
 */


'use strict';

module.exports = function (grunt) {
  var path = require('path');
  var fs = require('fs');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('img_find_and_copy', 'A Grunt plugin to find image reference in your dev resources and copy them to your build location.', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    var finalImgRscList = [];
    var httpRegex = new RegExp('(http|https):', 'ig');
    var urlRegex = new RegExp('url\\([\'|"]?([^\)|^\'|^"]+)[\'|"]?\\)', 'ig');
    var filepathRegex = new RegExp('["\']?([\\w\\d\\s!:./\\-\\_]*\\.[\\w?#]+)["\']?', 'ig');
    var imgSrcRegex = new RegExp('<img.*?src=[\'|"](.*?)[\'|"]', 'ig');
    var copyToDestination = '';

    var locateImgs = function(fromFiles, toDest) {
      fromFiles.forEach(function(file) {

        grunt.verbose.writeln('');
        var rawData = grunt.file.read(file);
        var allImgRefs = [];
        var imgRefs = rawData.match(urlRegex);
        var imgSrcRefs = rawData.match(imgSrcRegex);

        if (imgRefs) {
          if (imgSrcRefs) {
            allImgRefs =  imgRefs.concat(imgSrcRefs);
          }
          else {
            allImgRefs = imgRefs;
          }
        }
        else {
          if (imgSrcRefs) {
            allImgRefs =  imgSrcRefs;
          }
        }

        // If references are found
        if (allImgRefs.length > 0) {
          grunt.verbose.ok('Potential css url or img tag based based img refs in ' + file + ' = ', allImgRefs);
          grunt.verbose.writeln('>> Lets filter these img refs to find the ones we need.');

          allImgRefs.forEach(function(ref) {

            // external link filtering
            if (httpRegex.test(ref)) {
              grunt.verbose.warn(ref + ' has been skipped as it\'s an external resource (tested using RegEx)!');

              return false;
            }
            else {
              // Sometime the httpRegex regex does not work so lets do some custom JS test //TODO: work out why!
              if (ref.toString().toLowerCase().indexOf('http://') > -1 ||
                  ref.toString().toLowerCase().indexOf('https://') > -1) {

                grunt.verbose.warn(ref + ' has been skipped as it\'s an external resource (tested using JS)!');

                return false;
              }
            }

            // imported css file filtering
            if (ref.toString().toLowerCase().indexOf('.css') > -1) {
              grunt.verbose.warn(ref + ' has been skipped as it\'s a css file of some sort (possibly an imported file)!');

              return false;
            }

            var imagePath = ref.match(filepathRegex)[0].replace(/['"]/g, '');

            grunt.verbose.writeln('>> Fix the img ref path from : ', ref, ' to be ', imagePath);

            // create a collection to work with later in a single batch
            finalImgRscList.push({
              filePath: file,
              imgPath: imagePath
            });
          });
        }
        else {
          grunt.verbose.ok('No img refs found in ' + file + ' so moving to next file.');
        }
      });
    };

    var copyImgs = function(imgs) {
      grunt.verbose.writeln('');
      grunt.verbose.writeln('-- Final image list in this block for processing is = ', imgs);
      grunt.verbose.writeln('');
      grunt.verbose.writeln('>> Lets process and copy these to target.');
      grunt.verbose.writeln('');

      var resolvedImgPath = '';
      var resolvedDestTargetPath = '';
      var resolvedDest = path.resolve(copyToDestination);

      if (!grunt.file.exists(resolvedDest)) {
        grunt.verbose.error('Cannot proceed as you target directory does not exist, please create this directory first : ' + resolvedDest);

        return;
      }

      var pathToDest = resolvedDest.substring(0, resolvedDest.lastIndexOf(copyToDestination));

      imgs.forEach(function(rscRef) {
        resolvedImgPath = path.resolve(rscRef.filePath.substring(0, rscRef.filePath.lastIndexOf("/")), rscRef.imgPath);
        resolvedDestTargetPath = pathToDest + "/" + copyToDestination + "/" + resolvedImgPath.replace(pathToDest, "");

        // the target paths slashed need to be swapped, and lets normalise as well
        resolvedImgPath = path.normalize(resolvedImgPath);
        resolvedDestTargetPath = path.normalize(resolvedDestTargetPath);
        resolvedDestTargetPath = resolvedDestTargetPath.replace(/\\/g, "/");

        grunt.verbose.writeln('>> We need to move this file = ' + resolvedImgPath);
        grunt.verbose.writeln('>> To this location = ' + resolvedDestTargetPath);

        if (grunt.file.exists(resolvedImgPath)) {
          grunt.file.copy(resolvedImgPath, resolvedDestTargetPath);

          grunt.verbose.ok('File has been copied!');
          grunt.log.ok(rscRef.imgPath + ' copied.');
        }
        else {
          grunt.verbose.warn('The following File DOES NOT exist, so not copying it : ' + resolvedImgPath);
        }
      });
    };

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {

      grunt.verbose.writeln('-- src file block to evaluate = ' + file.src);
      grunt.verbose.writeln('-- dest for the evaluated files in this block = ' + file.dest);

      copyToDestination = file.dest;

      locateImgs(file.src, file.dest);
      copyImgs(finalImgRscList);

    });

  });

};
