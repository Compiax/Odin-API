var assert          = require('assert');
var bcrypt          = require('bcryptjs');
var debug           = require('debug')('odin-api:e2e:auth');
var request         = require('supertest');
var Token           = require('../../models/token');
var User            = require('../../models/user');

module.exports.test = function(app){
  describe('auth =>', function() {
    describe('GET /auth/check =>', function() {
      var agent = request.agent(app);

      before(function(done) {
        User.remove({'auth.username': 'testuser'}, function(err){
          var salt = bcrypt.genSaltSync(10);
          var password = bcrypt.hashSync('pass123', salt);
          var user = new User({'auth.username': 'testuser', 'auth.email': 'testuser@odin.com', 'auth.password': password});
          user.save(function(err){
            done();
          });
        });
      });

      after(function(done) {
        User.remove({'auth.username': 'testuser'}, function(err){
          done();
        });
      });

      it('should login a user and return that user in jsonapi format for check test', function(done) {
        agent
          .post('/auth/login')
          .send({
            username: 'testuser',
            password: 'pass123'
          })
          .type('form')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });

      it('should return authentication status in jsonapi format', function(done) {
        agent
          .get('/auth/check')
          .type('form')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
    })

    describe('POST /auth/register =>', function() {
      before(function(done) {
        User.remove({'auth.username': 'testuser'}, function(err){
          done();
        });
      });

      after(function(done) {
        User.remove({'auth.username': 'testuser'}, function(err){
          done();
        });
      });

      it('should register a user and return that user in jsonapi format', function(done) {
        request(app)
          .post('/auth/register')
          .send({
            username: 'testuser',
            email: 'testuser@odin.com',
            password: 'pass123'
          })
          .type('form')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('POST /auth/login =>', function() {
      before(function(done) {
        User.remove({'auth.username': 'testuser'}, function(err){
          var salt = bcrypt.genSaltSync(10);
          var password = bcrypt.hashSync('pass123', salt);
          var user = new User({'auth.username': 'testuser', 'auth.email': 'testuser@odin.com', 'auth.password': password});
          user.save(function(err){
            done();
          });
        });
      });

      after(function(done) {
        User.remove({'auth.username': 'testuser'}, function(err){
          done();
        });
      });

      it('should login a user and return that user in jsonapi format', function(done) {
        request(app)
          .post('/auth/login')
          .send({
            username: 'testuser',
            password: 'pass123'
          })
          .type('form')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('POST /auth/logout =>', function() {
      var agent = request.agent(app);

      before(function(done) {
        User.remove({'auth.username': 'testuser'}, function(err){
          var salt = bcrypt.genSaltSync(10);
          var password = bcrypt.hashSync('pass123', salt);
          var user = new User({'auth.username': 'testuser', 'auth.email': 'testuser@odin.com', 'auth.password': password});
          user.save(function(err){
            done();
          });
        });
      });

      after(function(done) {
        User.remove({'auth.username': 'testuser'}, function(err){
          done();
        });
      });

      it('should login a user and return that user in jsonapi format for logout test', function(done) {
        agent
          .post('/auth/login')
          .send({
            username: 'testuser',
            password: 'pass123'
          })
          .type('form')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });

      it('should logout a user and return that user in jsonapi format', function(done) {
        agent
          .post('/auth/logout')
          .type('form')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('POST /auth/verify =>', function() {
      //@TODO: Check actual return data for success (user should be verified)
      before(function(done) {
        User.remove({'auth.username': 'testuser'}, function(err){
          Token.remove({'token': 'testToken'}, function(err){
            var salt = bcrypt.genSaltSync(10);
            var password = bcrypt.hashSync('pass123', salt);
            var user = new User({'auth.username': 'testuser', 'auth.email': 'testuser@odin.com', 'auth.password': password});
            user.save(function(err){
              global.user = user;

              var token = new Token({'type': 'verification', 'token': 'testToken', 'user': user.id});
              token.save(function(err){
                done();
              });
            });
          });
        });
      });

      after(function(done) {
        User.remove({}, function(err){
          Token.remove({}, function(err){
            done();
          });
        });
      });

      it('should verify a user and return that user in jsonapi format', function(done) {
        request(app)
          .post('/auth/verify')
          .send({
            token: 'testToken',
            user: global.user.id
          })
          .type('form')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('POST /auth/forgot =>', function() {
      before(function(done) {
        User.remove({'auth.username': 'testuser'}, function(err){
          Token.remove({}, function(err){
            var salt = bcrypt.genSaltSync(10);
            var password = bcrypt.hashSync('pass123', salt);
            var user = new User({'auth.username': 'testuser', 'auth.email': 'testuser@odin.com', 'auth.password': password});
            user.save(function(err){
              done();
            });
          });
        });
      });

      after(function(done) {
        Token.remove({}, function(err){
            User.remove({}, function(err){
              done();
            });
        });
      });

      it('should send password recovery mail and return status message in jsonapi format', function(done) {
        request(app)
          .post('/auth/forgot')
          .send({
            email: 'testuser@odin.com',
          })
          .type('form')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('POST /auth/reset =>', function() {
      var agent = request.agent(app);

      before(function(done) {
        User.remove({'auth.username': 'testuser'}, function(err){
          Token.remove({'token': 'testToken'}, function(err){
            var salt = bcrypt.genSaltSync(10);
            var password = bcrypt.hashSync('pass123', salt);
            var user = new User({'auth.username': 'testuser', 'auth.email': 'testuser@odin.com', 'auth.password': password});
            user.save(function(err){
              var token = new Token({'type': 'reset', 'token': 'testToken', 'user': user.id});
              token.save(function(err){
                done();
              });
            });
          });
        });
      });

      after(function(done) {
        User.remove({}, function(err){
          Token.remove({}, function(err){
            done();
          });
        });
      });

      it('should reset a user\'s password and return that user in jsonapi format', function(done) {
        request(app)
          .post('/auth/reset')
          .send({
            token: 'testToken',
            password: 'newpassword'
          })
          .type('form')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });

      it('should login a user and return that user in jsonapi format for password reset test', function(done) {
        agent
          .post('/auth/login')
          .send({
            username: 'testuser',
            password: 'newpassword'
          })
          .type('form')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
    });
  });
};
