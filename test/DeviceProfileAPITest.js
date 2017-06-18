/**
 * The test cases for device profile REST operations.
 */
'use strict';

let request = require('supertest');
const app = require('../src/app');
const expect = require('chai').expect;
const DeviceProfile = require('../src/models').DeviceProfile;
const MCLChannel = require('../src/models').MCLChannel;
const co = require('co');

request = request(app);

describe('Device Profile API Tests', () => {
  let profile;
  beforeEach((done) => {
    co(function*() {
      yield DeviceProfile.remove();
      yield MCLChannel.remove();
      profile = yield DeviceProfile.create({
        name: 'name',
        version: 'version',
        vendor: 'vendor',
        family: 'family',
        role: 'role',
        model: 'model',
        model_lname: 'model long name',
        model_sname: 'model short name',
        hardware: 'hardware',
        software: 'software',
        channelIds: [],
        createdAt: new Date(),
        createdBy: 'system',
      });

      for (let i = 1; i <= 3; i++) {
        yield MCLChannel.create({
          tag: `tag${i}`,
          mclname: `name${i}`,
          lname: `long name ${i}`,
          sname: `short name ${i}`,
          unit: `unit${i}`,
          lunit: `long unit ${i}`,
          sunit: `short unit ${i}`,
          desc: `desc${i}`,
          vtype: `vtype${i}`,
          array_size: 10,
          enums: [{ s: 'sss1', v: 'vvv1' }, { s: 'sss2', v: 'vvv2' }],
          category: `category${i}`,
          lcategory: `long category ${i}`,
          scategory: `short category ${i}`,
          writable: true,
          default: `default${i}`,
          min: `min${i}`,
          max: `max${i}`,
          dynamic_minmaxdefault: false,
        });
      }
    }).then(() => done()).catch(done);
  });

  after((done) => {
    co(function*() {
      yield DeviceProfile.remove();
      yield MCLChannel.remove();
    }).then(() => done()).catch(done);
  });

  it('get all channels', (done) => {
    request.get('/api/v1/mclchannels')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).to.equal(3);
        done();
      });
  });

  it('search device profiles', (done) => {
    request.get('/api/v1/deviceprofiles')
      .query({ keyword: 'NAM' })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.length).to.equal(1);
        expect(res.body[0].id).to.equal(profile._id.toString());
        expect(res.body[0].name).to.equal(profile.name);
        expect(res.body[0].version).to.equal(profile.version);
        expect(res.body[0].vendor).to.equal(profile.vendor);
        expect(res.body[0].family).to.equal(profile.family);
        expect(res.body[0].role).to.equal(profile.role);
        expect(res.body[0].model).to.equal(profile.model);
        expect(res.body[0].model_lname).to.equal(profile.model_lname);
        expect(res.body[0].model_sname).to.equal(profile.model_sname);
        expect(res.body[0].hardware).to.equal(profile.hardware);
        expect(res.body[0].software).to.equal(profile.software);
        expect(res.body[0].channelIds.length).to.equal(0);
        expect(res.body[0].createdBy).to.equal(profile.createdBy);
        done();
      });
  });

  it('get device profile by id', (done) => {
    request.get(`/api/v1/deviceprofile/${profile._id}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.equal(profile._id.toString());
        expect(res.body.name).to.equal(profile.name);
        expect(res.body.version).to.equal(profile.version);
        expect(res.body.vendor).to.equal(profile.vendor);
        expect(res.body.family).to.equal(profile.family);
        expect(res.body.role).to.equal(profile.role);
        expect(res.body.model).to.equal(profile.model);
        expect(res.body.model_lname).to.equal(profile.model_lname);
        expect(res.body.model_sname).to.equal(profile.model_sname);
        expect(res.body.hardware).to.equal(profile.hardware);
        expect(res.body.software).to.equal(profile.software);
        expect(res.body.channelIds.length).to.equal(0);
        expect(res.body.createdBy).to.equal(profile.createdBy);
        done();
      });
  });

  it('create device profile', (done) => {
    request.post('/api/v1/deviceprofile')
      .send({
        name: 'nnn',
        version: '1.1',
        vendor: 'vendor',
        model: 'model',
        createdBy: 'system',
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.exist; // eslint-disable-line
        expect(res.body.name).to.equal('nnn');
        expect(res.body.version).to.equal('1.1');
        expect(res.body.vendor).to.equal('vendor');
        expect(res.body.model).to.equal('model');
        expect(res.body.createdAt).to.exist; // eslint-disable-line
        expect(res.body.createdBy).to.equal('system');
        done();
      });
  });

  it('update device profile', (done) => {
    request.put(`/api/v1/deviceprofile/${profile._id}`)
      .send({
        name: 'some name',
        version: '1.1.1',
        vendor: 'vendor2',
        model: 'model2',
        updatedBy: 'user',
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.id).to.equal(profile._id.toString());
        expect(res.body.name).to.equal('some name');
        expect(res.body.version).to.equal('1.1.1');
        expect(res.body.vendor).to.equal('vendor2');
        expect(res.body.model).to.equal('model2');
        expect(res.body.createdAt).to.exist; // eslint-disable-line
        expect(res.body.createdBy).to.equal('system');
        expect(res.body.updatedAt).to.exist; // eslint-disable-line
        expect(res.body.updatedBy).to.equal('user');
        done();
      });
  });

  it('download device profile', (done) => {
    request.get(`/api/v1/deviceprofile/${profile._id}/download`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body._id).to.equal(profile._id.toString());
        expect(res.body.name).to.equal(profile.name);
        expect(res.body.version).to.equal(profile.version);
        expect(res.body.device.vendor).to.equal(profile.vendor);
        expect(res.body.device.family).to.equal(profile.family);
        expect(res.body.device.role).to.equal(profile.role);
        expect(res.body.device.model).to.equal(profile.model);
        expect(res.body.device.model_lname).to.equal(profile.model_lname);
        expect(res.body.device.model_sname).to.equal(profile.model_sname);
        expect(res.body.device.hardware).to.equal(profile.hardware);
        expect(res.body.device.software).to.equal(profile.software);
        expect(res.body.channels.length).to.equal(0);
        done();
      });
  });
});
