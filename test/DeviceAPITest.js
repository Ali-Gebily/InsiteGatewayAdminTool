/**
 * The test cases for device REST operations.
 */
'use strict';

let request = require('supertest');
const app = require('../src/app');
const expect = require('chai').expect;
const Device = require('../src/models').Device;
const DeviceIngressPath = require('../src/models').DeviceIngressPath;
const Site = require('../src/models').Site;
const Tag = require('../src/models').Tag;
const co = require('co');

request = request(app);

describe('Device API Tests', () => {
  let site1;
  let path1;
  let device1;
  let tag1;
  beforeEach((done) => {
    co(function*() {
      yield Site.remove();
      yield Device.remove();
      yield DeviceIngressPath.remove();
      site1 = yield Site.create({ name: 'Customer X' });
      path1 = yield DeviceIngressPath.create({ ingressPath: 'Device' });
      tag1 = yield Tag.create({ text: 'tag1' });
      device1 = yield Device.create({
        name: 'device1',
        ingressPathId: path1._id,
        deviceId: '1234-5678-9012-1111',
        activationCode: 'code1',
        connectionString: 'http://xx.yy.zz',
        model: 'model',
        firmware: 'firmware',
        createdAt: new Date(),
        createdBy: 'system',
        lastDataPoint: new Date(),
        siteId: site1._id,
        tagIds: [tag1],
      });
    }).then(() => done()).catch(done);
  });

  after((done) => {
    co(function*() {
      yield Site.remove();
      yield Device.remove();
      yield DeviceIngressPath.remove();
    }).then(() => done()).catch(done);
  });

  it('get devices by site id', (done) => {
    request.get(`/api/v1/devices/site/${site1._id}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).to.equal(1);
        expect(res.body[0].name).to.equal('device1');
        expect(res.body[0].ingressPathId).to.equal(String(path1._id));
        expect(res.body[0].deviceId).to.equal('1234-5678-9012-1111');
        expect(res.body[0].activationCode).to.equal('code1');
        expect(res.body[0].connectionString).to.equal('http://xx.yy.zz');
        expect(res.body[0].model).to.equal('model');
        expect(res.body[0].firmware).to.equal('firmware');
        expect(new Date(res.body[0].createdAt).getTime()).to.equal(device1.createdAt.getTime());
        expect(res.body[0].createdBy).to.equal('system');
        expect(new Date(res.body[0].lastDataPoint).getTime()).to.equal(device1.lastDataPoint.getTime());
        done();
      });
  });

  it('get device by id', (done) => {
    request.get(`/api/v1/device/${device1._id}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.exist; // eslint-disable-line
        expect(res.body.name).to.equal('device1');
        expect(res.body.ingressPathId).to.equal(String(path1._id));
        expect(res.body.deviceId).to.equal('1234-5678-9012-1111');
        expect(res.body.activationCode).to.equal('code1');
        expect(res.body.connectionString).to.equal('http://xx.yy.zz');
        expect(res.body.model).to.equal('model');
        expect(res.body.firmware).to.equal('firmware');
        expect(new Date(res.body.createdAt).getTime()).to.equal(device1.createdAt.getTime());
        expect(res.body.createdBy).to.equal('system');
        expect(new Date(res.body.lastDataPoint).getTime()).to.equal(device1.lastDataPoint.getTime());
        done();
      });
  });

  it('create device', (done) => {
    const lastDataPoint = new Date();
    request.post('/api/v1/device')
      .send({
        name: 'device2',
        ingressPathId: path1._id,
        activationCode: 'code2',
        connectionString: 'http://xx.yy.zz',
        model: 'model',
        firmware: 'firmware',
        createdBy: 'system',
        lastDataPoint,
        siteId: site1._id,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.exist; // eslint-disable-line
        expect(res.body.name).to.equal('device2');
        expect(res.body.ingressPathId).to.equal(String(path1._id));
        expect(res.body.deviceId).to.exist; // eslint-disable-line
        expect(res.body.activationCode).to.equal('code2');
        expect(res.body.connectionString).to.equal('http://xx.yy.zz');
        expect(res.body.model).to.equal('model');
        expect(res.body.firmware).to.equal('firmware');
        expect(res.body.createdAt).to.exist; // eslint-disable-line
        expect(res.body.createdBy).to.equal('system');
        expect(new Date(res.body.lastDataPoint).getTime()).to.equal(lastDataPoint.getTime());
        done();
      });
  });

  it('update device', (done) => {
    const lastDataPoint = new Date();
    request.put(`/api/v1/device/${device1._id}`)
      .send({
        name: 'device2',
        ingressPathId: path1._id,
        deviceId: '1234-5678-9012-2222',
        activationCode: 'code2',
        connectionString: 'http://xx.yy.zz',
        model: 'model',
        firmware: 'firmware',
        updatedBy: 'user',
        lastDataPoint,
        siteId: site1._id,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.exist; // eslint-disable-line
        expect(res.body.name).to.equal('device2');
        expect(res.body.ingressPathId).to.equal(String(path1._id));
        expect(res.body.deviceId).to.equal('1234-5678-9012-2222');
        expect(res.body.activationCode).to.equal('code2');
        expect(res.body.connectionString).to.equal('http://xx.yy.zz');
        expect(res.body.model).to.equal('model');
        expect(res.body.firmware).to.equal('firmware');
        expect(new Date(res.body.createdAt).getTime()).to.equal(device1.createdAt.getTime());
        expect(res.body.createdBy).to.equal('system');
        expect(res.body.updatedAt).to.exist; // eslint-disable-line
        expect(res.body.updatedBy).to.equal('user');
        expect(new Date(res.body.lastDataPoint).getTime()).to.equal(lastDataPoint.getTime());
        done();
      });
  });

  it('get all device ingress paths', (done) => {
    request.get('/api/v1/deviceingresspaths')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).to.equal(1);
        expect(res.body[0].id).to.exist; // eslint-disable-line
        expect(res.body[0].ingressPath).to.equal('Device');
        done();
      });
  });
  it('get devices by tags', (done) => {
    request.get(`/api/v1/devices/tags/["${tag1._id}"]`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).to.equal(1);
        expect(res.body[0].name).to.equal('device1');
        expect(res.body[0].ingressPathId).to.equal(String(path1._id));
        expect(res.body[0].deviceId).to.equal('1234-5678-9012-1111');
        expect(res.body[0].activationCode).to.equal('code1');
        expect(res.body[0].connectionString).to.equal('http://xx.yy.zz');
        expect(res.body[0].model).to.equal('model');
        expect(res.body[0].firmware).to.equal('firmware');
        expect(res.body[0].tagIds[0]).to.equal(tag1._id.toString());
        expect(new Date(res.body[0].createdAt).getTime()).to.equal(device1.createdAt.getTime());
        expect(res.body[0].createdBy).to.equal('system');
        expect(new Date(res.body[0].lastDataPoint).getTime()).to.equal(device1.lastDataPoint.getTime());
        done();
      });
  });
});
