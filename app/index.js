// global console

'use strict';
var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    yosay = require('yosay');


module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the polished ' + chalk.red('generator-ucf-email-boilerplate') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'browserSyncEnable',
      message: 'Would you like to enable BrowserSync?',
      default: false
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    console.log('Copying boilerplate source files...');

    // Create gulp-config.json
    this.fs.copyTpl(
      this.templatePath('gulp-config.tpl'),
      this.destinationPath('gulp-config.json'),
      {
        browser_sync_enable: this.props.browserSyncEnable,
      }
    );

    // Copy boilerplate files to new destination
    this.fs.copy(
      this.sourceRoot(),
      this.destinationRoot()
    );

    // Nuke .tpl files
    this.fs.delete(this.destinationPath('gulp-config.tpl'));
  },

  install: function () {
    console.log('Installing components...');

    this.installDependencies({
      bower: false,
      npm: true,
      skipInstall: false,
      callback: function() {
        console.log('Running `gulp default`...');
        this.spawnCommand('gulp', ['default']);
      }.bind(this)
    });
  }
});
