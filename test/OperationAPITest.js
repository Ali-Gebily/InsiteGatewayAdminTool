/**
 * The test cases for operation REST operations.
 */
'use strict';

let request = require('supertest');
const app = require('../src/app');
const expect = require('chai').expect;
const Operation = require('../src/models').Operation;
const OperationApp = require('../src/models').App;
const Adapter = require('../src/models').Adapter;
const co = require('co');

request = request(app);

describe('Operation API Tests', () => {
  let adapter1;
  let app1;
  let operation1;
  beforeEach((done) => {
    co(function* () {
      yield Adapter.remove();
      yield Operation.remove();
      yield OperationApp.remove();
      adapter1 = yield Adapter.create({ name: 'Project Team X' });
      app1 = yield OperationApp.create({ name: 'Project Mobile App' });
      operation1 = yield Operation.create({
        name: 'operation1',
        appId: app1._id,
        description: 'description1',
        type: 'Standard',
        createdAt: new Date(),
        createdBy: 'system',
        adapterId: adapter1._id,
      });
    }).then(() => done()).catch(done);
  });

  after((done) => {
    co(function* () {
      yield Adapter.remove();
      yield Operation.remove();
      yield OperationApp.remove();
    }).then(() => done()).catch(done);
  });

  it('get operations by adapter id', (done) => {
    request.get(`/api/v1/operations/adapter/${adapter1._id}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).to.equal(1);
        expect(res.body[0].id).to.exist; // eslint-disable-line
        expect(res.body[0].name).to.equal('operation1');
        expect(res.body[0].appId).to.equal(String(app1._id));
        expect(res.body[0].description).to.equal('description1');
        expect(res.body[0].type).to.equal(String('Standard'));
        expect(new Date(res.body[0].createdAt).getTime()).to.equal(operation1.createdAt.getTime());
        expect(res.body[0].createdBy).to.equal('system');
        expect(res.body[0].adapterId).to.equal(String(adapter1._id));
        done();
      });
  });

  it('get operation by id', (done) => {
    request.get(`/api/v1/operations/${operation1._id}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.exist; // eslint-disable-line
        expect(res.body.name).to.equal('operation1');
        expect(res.body.appId).to.equal(String(app1._id));
        expect(res.body.description).to.equal('description1');
        expect(res.body.type).to.equal(String('Standard'));
        expect(new Date(res.body.createdAt).getTime()).to.equal(operation1.createdAt.getTime());
        expect(res.body.createdBy).to.equal('system');
        expect(res.body.adapterId).to.equal(String(adapter1._id));
        done();
      });
  });

  it('create operation', (done) => {
    request.post('/api/v1/operations')
      .send({
        name: 'operation2',
        appId: app1._id,
        description: 'description2',
        createdBy: 'system',
        adapterId: adapter1._id,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.exist; // eslint-disable-line
        expect(res.body.name).to.equal('operation2');
        expect(res.body.appId).to.equal(String(app1._id));
        expect(res.body.type).to.equal(String('custom'));
        expect(res.body.description).to.equal('description2');
        expect(res.body.createdAt).to.exist; // eslint-disable-line
        expect(res.body.createdBy).to.equal('system');
        expect(res.body.adapterId).to.equal(String(adapter1._id));
        done();
      });
  });

  it('update operation', (done) => {
    request.put(`/api/v1/operations/${operation1._id}`)
      .send({
        name: 'UpdatedOperationName2',
        appId: app1._id,
        description: 'updatedDescription2',
        updatedBy: 'user',
        adapterId: adapter1._id,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.exist; // eslint-disable-line
        expect(res.body.name).to.equal('UpdatedOperationName2');
        expect(res.body.appId).to.equal(String(app1._id));
        expect(res.body.description).to.equal('updatedDescription2');
        expect(res.body.type).to.equal(String('Standard'));
        expect(new Date(res.body.createdAt).getTime()).to.equal(operation1.createdAt.getTime());
        expect(res.body.createdBy).to.equal('system');
        expect(res.body.updatedAt).to.exist; // eslint-disable-line
        expect(res.body.updatedBy).to.equal('user');
        expect(res.body.adapterId).to.equal(String(adapter1._id));
        done();
      });
  });
});
