/**
 * The test cases for tag REST operations.
 */
'use strict';

let request = require('supertest');
const app = require('../src/app');
const expect = require('chai').expect;
const Tag = require('../src/models').Tag;

request = request(app);


describe('Tag API Tests', () => {
  before((done) => {
    Tag.remove(done);
  });

  afterEach((done) => {
    Tag.remove(done);
  });

  it('get all tags', (done) => {
    request.get('/api/v1/tags')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).to.equal(0);
        done();
      });
  });


  it('get all tags with result', (done) => {
    Tag.create({ text: 'tag1' }, (err) => {
      if (err) {
        return done(err);
      }
      request.get('/api/v1/tags')
        .expect(200)
        .end((e, res) => {
          if (e) {
            return done(e);
          }
          expect(res.body.length).to.equal(1);
          expect(res.body[0].text).to.equal('tag1');
          done();
        });
    });
  });
});
