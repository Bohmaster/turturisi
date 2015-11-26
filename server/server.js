var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');

var app = module.exports = loopback();

// storage
var ds = loopback.createDataSource({
  connector: require('loopback-component-storage'),
  provider: 'filesystem',
  root: path.join(__dirname, 'storage')
});
var Container = ds.createModel('container');
app.model(Container);

// static
app.use(loopback.static(path.resolve(__dirname)));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
