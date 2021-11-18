/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
  watch: true,
  server: false,
  proxy: "http://localhost:8888/ecosys/",
  files: [
    "assets/build/css/*.css",
    "assets/dev/js/*.js",
  ]
};
