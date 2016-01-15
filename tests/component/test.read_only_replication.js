'use strict';

var PouchDB = require('../../lib');

var express = require('express');
var app = express();

function reject(req, res, next) {
  res.status(402).send({error: true, message: 'Unauthorised'});
}

app.post('*', reject);
app.delete('*', reject);
app.put('*', reject);
app.use(require('pouchdb-express-router')(PouchDB));

var should = require("chai").should();

describe('test.read_only_replication.js', function () {

  var server;

  before(function () {
    server = app.listen(3000);
  });

  after(function () {
    return server.close();
  });

  it('Test checkpointer handles error codes', function () {

    var db = new PouchDB('test');

    // These are the same db, but one goes over HTTP so has access control
    var remote = new PouchDB('remote');
    var remoteHTTP = new PouchDB('http://127.0.0.1:3000/remote');

    return remote.bulkDocs([{_id: 'foo'}, {_id: 'bar'}]).then(function() {
      return db.replicate.from(remoteHTTP);
    }).then(function(result) {
      return remote.destroy();
    }).then(function() {
      return db.destroy();
    });

  });

});
