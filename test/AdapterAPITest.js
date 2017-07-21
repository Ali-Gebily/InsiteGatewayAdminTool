/**
 * The test cases for adapter REST operations.
 */
'use strict';

let request = require('supertest');
const app = require('../src/app');
const expect = require('chai').expect;
const Adapter = require('../src/models').Adapter;

request = request(app);


describe('Adapter API Tests', () => {
  before((done) => {
    Adapter.remove(done);
  });

  afterEach((done) => {
    Adapter.remove(done);
  });

  it('get all adapters 1', (done) => {
    request.get('/api/v1/adapters')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).to.equal(0);
        done();
      });
  });

  it('get all adapters 2', (done) => {
    Adapter.create({ name: 'adapter' }, (err) => {
      if (err) {
        return done(err);
      }
      request.get('/api/v1/adapters')
        .expect(200)
        .end((e, res) => {
          if (e) {
            return done(e);
          }
          expect(res.body.length).to.equal(1);
          expect(res.body[0].name).to.equal('adapter');
          done();
        });
    });
  });
});
