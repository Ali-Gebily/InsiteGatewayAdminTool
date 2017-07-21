/**
 * The test cases for app REST operations.
 */
'use strict';

let request = require('supertest');
const app = require('../src/app');
const expect = require('chai').expect;
const App = require('../src/models').App;

request = request(app);


describe('App API Tests', () => {
  before((done) => {
    App.remove(done);
  });

  afterEach((done) => {
    App.remove(done);
  });

  it('get all apps 1', (done) => {
    request.get('/api/v1/apps')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).to.equal(0);
        done();
      });
  });

  it('get all apps 2', (done) => {
    App.create({ name: 'app' }, (err) => {
      if (err) {
        return done(err);
      }
      request.get('/api/v1/apps')
        .expect(200)
        .end((e, res) => {
          if (e) {
            return done(e);
          }
          expect(res.body.length).to.equal(1);
          expect(res.body[0].name).to.equal('app');
          done();
        });
    });
  });
});
