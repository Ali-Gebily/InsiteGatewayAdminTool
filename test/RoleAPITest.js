/**
 * The test cases for role REST roles.
 */
'use strict';

let request = require('supertest');
const app = require('../src/app');
const expect = require('chai').expect;
const Role = require('../src/models').Role;
const RoleApp = require('../src/models').App;
const Operation = require('../src/models').Operation;
const Adapter = require('../src/models').Adapter;
const co = require('co');

request = request(app);

describe('Role API Tests', () => {
  let adapter1;
  let app1;
  let role1;
  let operation1;
  let operation2;
  beforeEach((done) => {
    co(function* () {
      yield Adapter.remove();
      yield Role.remove();
      yield Operation.remove();
      yield RoleApp.remove();

      adapter1 = yield Adapter.create({ name: 'Project Team X' });
      app1 = yield RoleApp.create({ name: 'Project Mobile App' });
      operation1 = yield Operation.create({
        name: 'role1',
        appId: app1._id,
        description: 'description1',
        type: 'Standard',
        createdAt: new Date(),
        createdBy: 'system',
        adapterId: adapter1._id,
      });
      operation2 = yield Operation.create({
        name: 'role1',
        appId: app1._id,
        description: 'description1',
        type: 'Standard',
        createdAt: new Date(),
        createdBy: 'system',
        adapterId: adapter1._id,
      });
      role1 = yield Role.create({
        name: 'role1',
        appId: app1._id,
        description: 'description1',
        createdAt: new Date(),
        createdBy: 'system',
        adapterId: adapter1._id,
        operationIds: [operation1._id, operation2._id],
      });
    }).then(() => done()).catch(done);
  });

  after((done) => {
    co(function* () {
      yield Adapter.remove();
      yield Role.remove();
      yield Operation.remove();
      yield RoleApp.remove();
    }).then(() => done()).catch(done);
  });

  it('get roles by adapter id', (done) => {
    request.get(`/api/v1/roles/adapter/${adapter1._id}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).to.equal(1);
        expect(res.body[0].id).to.exist; // eslint-disable-line
        expect(res.body[0].name).to.equal('role1');
        expect(res.body[0].appId).to.equal(String(app1._id));
        expect(res.body[0].description).to.equal('description1');
        expect(new Date(res.body[0].createdAt).getTime()).to.equal(role1.createdAt.getTime());
        expect(res.body[0].createdBy).to.equal('system');
        expect(res.body[0].adapterId).to.equal(String(adapter1._id));
        expect(res.body[0].operationIds.length).to.equal(2);
        expect(res.body[0].operationIds[0]).to.equal(String(operation1._id));
        expect(res.body[0].operationIds[1]).to.equal(String(operation2._id));
        done();
      });
  });

  it('get role by id', (done) => {
    request.get(`/api/v1/roles/${role1._id}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.exist; // eslint-disable-line
        expect(res.body.name).to.equal('role1');
        expect(res.body.appId).to.equal(String(app1._id));
        expect(res.body.description).to.equal('description1');
        expect(new Date(res.body.createdAt).getTime()).to.equal(role1.createdAt.getTime());
        expect(res.body.createdBy).to.equal('system');
        expect(res.body.adapterId).to.equal(String(adapter1._id));
        expect(res.body.operationIds.length).to.equal(2);
        expect(res.body.operationIds[0]).to.equal(String(operation1._id));
        expect(res.body.operationIds[1]).to.equal(String(operation2._id));
        done();
      });
  });

  it('create role', (done) => {
    request.post('/api/v1/roles')
      .send({
        name: 'role2',
        appId: app1._id,
        description: 'description2',
        createdBy: 'system',
        adapterId: adapter1._id,
        operationIds: [operation2._id],
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.exist; // eslint-disable-line
        expect(res.body.name).to.equal('role2');
        expect(res.body.appId).to.equal(String(app1._id));
        expect(res.body.description).to.equal('description2');
        expect(res.body.createdAt).to.exist; // eslint-disable-line
        expect(res.body.createdBy).to.equal('system');
        expect(res.body.adapterId).to.equal(String(adapter1._id));
        expect(res.body.operationIds.length).to.equal(1);
        expect(res.body.operationIds[0]).to.equal(String(operation2._id));
        done();
      });
  });

  it('update role', (done) => {
    request.put(`/api/v1/roles/${role1._id}`)
      .send({
        name: 'UpdatedRoleName2',
        appId: app1._id,
        description: 'updatedDescription1',
        updatedBy: 'user',
        adapterId: adapter1._id,
        operationIds: [operation1._id],
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.exist; // eslint-disable-line
        expect(res.body.name).to.equal('UpdatedRoleName2');
        expect(res.body.appId).to.equal(String(app1._id), 'app id not matched');
        expect(res.body.description).to.equal('updatedDescription1');
        expect(new Date(res.body.createdAt).getTime()).to.equal(role1.createdAt.getTime());
        expect(res.body.createdBy).to.equal('system');
        expect(res.body.updatedAt).to.exist; // eslint-disable-line
        expect(res.body.updatedBy).to.equal('user');
        expect(res.body.adapterId).to.equal(String(adapter1._id), 'app id not matched');
        expect(res.body.operationIds.length).to.equal(1);
        expect(res.body.operationIds[0]).to.equal(String(operation1._id));
        done();
      });
  });
});
