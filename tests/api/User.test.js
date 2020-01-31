const chai = require('chai');
const request = require('supertest');
const app = require('../../app');
const bookshelf = require('../../config/database/Bookshelf');
chai.should();

describe("Auth API", () => {

    before(async () => {
        const knex = bookshelf.knex;
        await knex('users').del();
        await knex('user_likes').del();
    });

    it('SignUp should sign up user', (done) => {
        request(app)
            .post('/signup')
            .send({
                username: "username",
                password: "password"
            })
            .expect((res) => {
                res.status.should.equal(200);
                this.token = res.body.data.token;
                (res.body.error).should.equal(false);
            })
            .end(done);
    });

    it('SignUp with same username should return error status and message', (done) => {
        request(app)
            .post('/signup')
            .send({
                username: "username",
                password: "password"
            })
            .expect((res) => {
                res.status.should.equal(400);
                (res.body.error).should.equal(true);
                (res.body).should.have.property('message');
            })
            .end(done);
    });

    it('Login should login a user', (done) => {
        request(app)
            .post('/login')
            .send({
                username: "username",
                password: "password"
            })
            .expect((res) => {
                res.status.should.equal(200);
                (res.body.error).should.equal(false);
                (res.body.data).should.have.property('token');
            })
            .end(done);
    });

    it('Login with unknown username should return error ocde 404', (done) => {
        request(app)
            .post('/login')
            .send({
                username: "giberish",
                password: "password"
            })
            .expect((res) => {
                res.status.should.equal(404);
                (res.body.error).should.equal(true);
                (res.body).should.have.property('message');
            })
            .end(done);
    });
});
describe("Update password API", () => {
    before(async (done) => {
        request(app)
            .post('/login')
            .send({
                username: "username",
                password: "password"
            })
            .expect((res) => {
                token = res.body.data.token
            })
            .end(done);
    });
    it('Should not allow you to change the password if it is the same as the old one', (done) => {
        /*request(app)
            .put('/me/update-password')
            .set('authorization', `Bearer ${token}`)
            .send({
                oldPassword: "password",
                newPassword: "password"
            })
            .expect((res) => {
                console.log(res.body);
                res.status.should.equal(400);
                (res.body.error).should.equal(true);
                (res.body).should.have.property('message').to.be('New password can\'t be the same as the old password');
            })
            .end(done);*/
    });
});
