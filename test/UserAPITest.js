/**
 * The test cases for user REST operations.
 */
'use strict';

let request = require('supertest');
const app = require('../src/app');
const expect = require('chai').expect;
const User = require('../src/models').User;

request = request(app);


const userData = {
  email: 'aaa@aaa.com',
  password: 'pwd',
  displayName: 'aaa',
  jobTitle: 'title',
  department: 'department',
  phoneNumber: '1111',
  accountEnabled: 'true',
  createdBy: 'someone',
};

describe('User API Tests', () => {
  before((done) => {
    User.remove(done);
  });

  afterEach((done) => {
    User.remove(done);
  });

  it('search users', (done) => {
    request.get('/api/v1/users')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).to.equal(0);
        done();
      });
  });

  it('create user', (done) => {
    request.post('/api/v1/user')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.exist; // eslint-disable-line
        expect(res.body.email).to.equal('aaa@aaa.com');
        expect(res.body.displayName).to.equal('aaa');
        expect(res.body.jobTitle).to.equal('title');
        expect(res.body.department).to.equal('department');
        expect(res.body.phoneNumber).to.equal('1111');
        expect(res.body.accountEnabled).to.equal('true');
        expect(res.body.createdBy).to.equal('someone');
        expect(res.body.createdAt).to.exist; // eslint-disable-line
        done();
      });
  });

  it('create user and search user', (done) => {
    request.post('/api/v1/user')
      .send(userData)
      .expect(200)
      .end((err1) => {
        if (err1) {
          return done(err1);
        }
        request.get('/api/v1/users')
          .query({ offset: 0, size: 10, name: 'aa', email: 'aaa@aaa.com' })
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body.length).to.equal(1);
            expect(res.body[0].email).to.equal('aaa@aaa.com');
            expect(res.body[0].displayName).to.equal('aaa');
            expect(res.body[0].jobTitle).to.equal('title');
            expect(res.body[0].department).to.equal('department');
            expect(res.body[0].phoneNumber).to.equal('1111');
            expect(res.body[0].accountEnabled).to.equal('true');
            expect(res.body[0].createdBy).to.equal('someone');
            expect(res.body[0].createdAt).to.exist; // eslint-disable-line
            done();
          });
      });
  });

  it('create user and get user', (done) => {
    request.post('/api/v1/user')
      .send(userData)
      .expect(200)
      .end((err1, res1) => {
        if (err1) {
          return done(err1);
        }
        request.get(`/api/v1/user/${res1.body.id}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body.email).to.equal('aaa@aaa.com');
            expect(res.body.displayName).to.equal('aaa');
            expect(res.body.jobTitle).to.equal('title');
            expect(res.body.department).to.equal('department');
            expect(res.body.phoneNumber).to.equal('1111');
            expect(res.body.accountEnabled).to.equal('true');
            expect(res.body.createdBy).to.equal('someone');
            expect(res.body.createdAt).to.exist; // eslint-disable-line
            done();
          });
      });
  });

  it('create user and update user', (done) => {
    request.post('/api/v1/user')
      .send(userData)
      .expect(200)
      .end((err1, res1) => {
        if (err1) {
          return done(err1);
        }
        request.put(`/api/v1/user/${res1.body.id}`)
          .send({
            email: 'bbb@bbb.com',
            password: 'pwd2',
            displayName: 'bbb',
            jobTitle: 'title2',
            department: 'department2',
            phoneNumber: '222',
            accountEnabled: 'false',
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body.email).to.equal('bbb@bbb.com');
            expect(res.body.displayName).to.equal('bbb');
            expect(res.body.jobTitle).to.equal('title2');
            expect(res.body.department).to.equal('department2');
            expect(res.body.phoneNumber).to.equal('222');
            expect(res.body.accountEnabled).to.equal('false');
            expect(res.body.createdBy).to.equal('someone');
            expect(res.body.createdAt).to.exist; // eslint-disable-line
            expect(res.body.updatedAt).to.exist; // eslint-disable-line
            done();
          });
      });
  });
});
