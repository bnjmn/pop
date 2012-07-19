var assert = require('assert')
  , path = require('path')
  , os = require('os')
  , log = require(__dirname + '/../lib/log')
  , fs = require(__dirname + '/../lib/graceful')
  , pop = require(__dirname + '/../lib/pop')
  , existsSync = require(__dirname + '/../lib/utils').existsSync
  , cliTools = pop.cliTools
  , config;

// Be quiet when testing
log.enabled = false;

config = {
  permalink: '/:year/:month/:day/:title'
, root: path.join(os.tmpDir(), '/pop-tests')
};

if (!existsSync(config.root))
  fs.mkdirSync(config.root, 0777);

exports['test datePad'] = function() {
  assert.equal('01', cliTools.datePad(1));
  assert.equal('10', cliTools.datePad(10));
};

exports['test getPostFileName'] = function() {
  var date = new Date(2011, 10, 1, 10, 10);
  assert.equal('_posts/2011-11-01-awesome-post.md', cliTools.getPostFileName('/:year/:month/:day/:title', date, 'Awesome Post', 'md'));
  assert.equal('_posts/2011-11-01-awesome-p%C3%A9st.md', cliTools.getPostFileName('/:year/:month/:day/:title', date, 'Awesome Pést', 'md'));
};

exports['test makePost'] = function() {
  var date = new Date()
    , title = 'Awesome Post'
    , fileName = path.join(config.root, cliTools.getPostFileName('/:year/:month/:day/:title', date, title, 'md'));

  fs.mkdir_p(path.join(config.root, '_posts'), 0777, function() { 
    cliTools.makePost(config, title, function() {
      assert.ok(existsSync(fileName));
      fs.unlinkSync(fileName);
    });
  });
};

exports['test makeSite'] = function() {
  var fileName = config.root + 'make-site-' + (new Date).getTime().toString();

  cliTools.makeSite(fileName, function() {
    assert.ok(existsSync(fileName));
    assert.ok(existsSync(fileName + '/_config.json'));
    assert.ok(existsSync(fileName + '/index.jade'));
    assert.ok(existsSync(fileName + '/robots.txt'));
    assert.ok(existsSync(fileName + '/_layouts/default.jade'));
  });
};

exports['test renderFile'] = function() {
  var c = {
    root: __dirname + '/fixtures/test_site/'
  };
  cliTools.renderFile(pop, c, 'md');
}
