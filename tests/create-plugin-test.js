var path = require('path');
var fs = require('fs-extra');
var assert = require('assert');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

describe('create-plugin', function() {
  var existingPluginPath = path.resolve('../already-exists');
  var testPluginPath = path.resolve('../my-special-plugin');

  beforeEach(function() {
    fs.mkdirpSync(existingPluginPath);
  });

  afterEach(function() {
    fs.removeSync(existingPluginPath);
    fs.removeSync(testPluginPath);
  });

  it('throws an error if a name is not specified', function() {
    assert.throws(function() {
      execSync('node ./bin/create-plugin.js', { stdio: 'pipe' });
    }, /You must specify a name for the plugin you're creating\. Try using `node \.\/bin\/create-plugin.js pluginName`\./);
  });

  it('throws an error if the destination directory already exists', function() {
    assert.throws(function() {
      execSync('node ./bin/create-plugin.js already-exists', { stdio: 'pipe' });
    }, /The path "\/Users\/twillis\/github\/already-exists" already exists\. Try using a different plugin name\./);
  });

  it('copies the blueprint to the destination path with the proper name replacements', function() {
    this.timeout(10000);

    execSync('node ./bin/create-plugin.js my-special-plugin', { stdio: 'pipe' });

    var index = fs.readFileSync(path.join(testPluginPath, 'src/index.js'), 'utf-8');
    assert.equal(index.indexOf('your-broccoli-plugin'), -1);
    assert.equal(index.indexOf('YourPlugin'), -1);
    assert.notEqual(index.indexOf('my-special-plugin'), -1);
    assert.notEqual(index.indexOf('MySpecialPlugin'), -1);

    var testIndex = fs.readFileSync(path.join(testPluginPath, 'tests/index.js'), 'utf-8');
    assert.equal(testIndex.indexOf('your-broccoli-plugin'), -1);
    assert.equal(testIndex.indexOf('YourPlugin'), -1);
    assert.notEqual(testIndex.indexOf('MySpecialPlugin'), -1);

    var packageJson = fs.readFileSync(path.join(testPluginPath, 'package.json'), 'utf-8');
    assert.equal(packageJson.indexOf('your-broccoli-plugin'), -1);
    assert.equal(packageJson.indexOf('YourPlugin'), -1);
    assert.notEqual(packageJson.indexOf('my-special-plugin'), -1);

    var readme = fs.readFileSync(path.join(testPluginPath, 'README.md'), 'utf-8');
    assert.equal(readme.indexOf('your-broccoli-plugin'), -1);
    assert.equal(readme.indexOf('YourPlugin'), -1);
    assert.notEqual(readme.indexOf('my-special-plugin'), -1);
    assert.notEqual(readme.indexOf('MySpecialPlugin'), -1);
  });
});
