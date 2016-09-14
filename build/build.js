var compressor = require('node-minify');

new compressor.minify({
  type: 'gcc',
  fileIn: '../main.js',
  fileOut: '../main.min.js',
  options: ['--compilation_level=ADVANCED_OPTIMIZATIONS'],
  callback: function(err, min){
    console.log(err);
  }
});

new compressor.minify({
  type: 'yui-css',
  fileIn: '../main.css',
  fileOut: '../main.min.css',
  callback: function(err, min){
    console.log(err);
  }
});