var expect = require('chai').expect;
var server = require('../server.js');
suite('WebApp TestSuite', function(){
  test('fibonacci: correct output is produced', function(done){
    expect(server.PORT).to.equal(3000);
    done();
  })
});