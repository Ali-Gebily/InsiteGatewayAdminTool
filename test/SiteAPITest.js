/**
 * The test cases for site REST operations.
 */
'use strict';

let request = require('supertest');
const app = require('../src/app');
const expect = require('chai').expect;
const Site = require('../src/models').Site;

request = request(app);


describe('Site API Tests', () => {
  before((done) => {
    Site.remove(done);
  });

  afterEach((done) => {
    Site.remove(done);
  });

  it('get all sites 1', (done) => {
    request.get('/api/v1/sites')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).to.equal(0);
        done();
      });
  });

  it('get all sites 2', (done) => {
    Site.create({ name: 'site' }, (err) => {
      if (err) {
        return done(err);
      }
      request.get('/api/v1/sites')
        .expect(200)
        .end((e, res) => {
          if (e) {
            return done(e);
          }
          expect(res.body.length).to.equal(1);
          expect(res.body[0].name).to.equal('site');
          done();
        });
    });
  });
});
