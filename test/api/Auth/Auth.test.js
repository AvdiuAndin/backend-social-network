require('module-alias/register');
const chai = require('chai');
const request = require('supertest');
const app = require("@app");
const bookshelf = require(`@bookshelf`);

chai.should();

describe("Auth API", () => {
    token = '';
    before(async () => {
        const knex = bookshelf.knex;
        await knex('users').del();
        await knex('user_likes').del();
    });

    it('Sign Up requires username to be more than 3 characters', (done) => {
        request(app)
            .post('/signup')
            .send({
                username: "us",
                password: "password"
            })
            .expect((res) => {
                res.status.should.equal(400);
                (res.body.error).should.equal(true);
            })
            .end(done);
    });

    it('Sign Up should register new user', (done) => {
        request(app)
            .post('/signup')
            .send({
                username: "username",
                password: "password"
            })
            .expect((res) => {
                res.status.should.equal(200);
                token = res.body.data.token;
                (res.body.error).should.equal(false);
            })
            .end(done);
    });

    it('Sign Up with same username should return error status and message', (done) => {
        request(app)
            .post('/signup')
            .send({
                username: "username",
                password: "password"
            })
            .expect((res) => {
                res.status.should.equal(400);
                (res.body.error).should.have.equal(true);
                (res.body).should.have.property('message');
                (res.body.message).should.equal('Username already exists');
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

    it('Login with unknown username should return error code 404', (done) => {
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