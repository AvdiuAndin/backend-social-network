require('module-alias/register');

const request = require('supertest');
const app = require(`@app`);
const randonStringGenerator = require('randomstring');
let chai = require("chai");
chai.use(require("chai-things"))
let expect = chai.expect;
chai.should();


describe("Update password", () => {
    let token = '';

    before((done) => {
        request(app)
            .post('/login')
            .send({
                username: "username",
                password: "password"
            })
            .expect(200)
            .end(function(err, res){
                if (err) done(err);
                token = res.body.data.token;
                done();
            });
    });

    it('Should not change password if it is the same as the old one', (done) => {
        request(app)
            .put('/me/update-password')
            .set('authorization', `Bearer ${token}`)
            .send({
                oldPassword: "password",
                newPassword: "password"
            })
            .expect(400)
            .expect((res) => {
                (res.body.error).should.equal(true);
                (res.body.message).should.equal('New password can\'t be the same as the old password');
            })
            .end(done);
    });

    it('Old password is not correct', (done) => {
        request(app)
            .put('/me/update-password')
            .set('authorization', `Bearer ${token}`)
            .send({
                oldPassword: "password123",
                newPassword: "password"
            })
            .expect(400)
            .expect((res) => {
                (res.body.error).should.equal(true);
                (res.body.message).should.equal('Old password is incorrect');
            })
            .end(done);
        });
});

describe('Like methods:', () => {
    let userOne = {
        token: '',
        id: ''
    };
    let userTwo = {
        token: '',
        id:''
    };

    before(() => 
        Promise.all(
            [
                request(app).post('/signup').send({ username: randonStringGenerator.generate(7), password: randonStringGenerator.generate(7)}),
                request(app).post('/signup').send({ username: randonStringGenerator.generate(7), password: randonStringGenerator.generate(7)})
            ]
        ).then((responses) => {
            userOne.token = responses[0].body.data.token;
            userOne.id  = responses[0].body.data.id;
    
            userTwo.token = responses[1].body.data.token;
            userTwo.id  = responses[1].body.data.id;
        })
    );

    it('user one should like user two',(done) => {
        request(app)
            .post(`/user/${userTwo.id}/like`)
            .set('authorization', `Bearer ${userOne.token}`)
            .send()
            .expect(200)
            .end(done);
    });

    it('user one should not like itself',(done) => {
        request(app)
            .post(`/user/${userOne.id}/like`)
            .set('authorization', `Bearer ${userOne.token}`)
            .send()
            .expect(400)
            .expect((response) => {
                response.body.error.should.be.true;
                response.body.message.should.equal("You can't like your self");
            }).end(done);
    });

    it('user one should not like another user twice',(done) => {
        request(app)
            .post(`/user/${userTwo.id}/like`)
            .set('authorization', `Bearer ${userOne.token}`)
            .send()
            .expect(400)
            .expect((response) => {
                response.body.error.should.be.true;
                response.body.message.should.equal('You have already liked this person');
            }).end(done);
    });

    it('user one should see if the user is liked',(done) => {
        request(app)
            .get(`/me`)
            .set('authorization', `Bearer ${userOne.token}`)
            .send()
            .expect(200)
            .expect((res) => {
                let likesUsersList = res.body.data.likesUsersList;
                expect(likesUsersList).to.be.an('array');

                let userTwoFound = likesUsersList.find((e) => e.id === userTwo.id );
                expect(userTwoFound).not.undefined;
            })
            .end(done);
    });

    it('user two should see if the user one has liked her/him',(done) => {
        request(app)
            .get(`/me`)
            .set('authorization', `Bearer ${userTwo.token}`)
            .send()
            .expect(200)
            .expect((res) => {
                let likedByUserList = res.body.data.likedByUserList;
                expect(likedByUserList).to.be.an('array');

                let userOneFound = likedByUserList.find((e) => e.id === userOne.id );
                expect(userOneFound).not.undefined;
            })
            .end(done);
    });

    it('user one should unlike userTwo',(done) => {
        request(app)    
            .put(`/user/${userTwo.id}/unlike`)
            .set('authorization', `Bearer ${userOne.token}`)
            .send()
            .expect(200)
            .end(done);
    });

    it('user one should see if the user is unliked',(done) => {
        request(app)
            .get(`/me`)
            .set('authorization', `Bearer ${userOne.token}`)
            .send()
            .expect(200)
            .expect((res) => {
                let likesUsersList = res.body.data.likesUsersList;
                expect(likesUsersList).to.be.an('array');

                let userTwoFound = likesUsersList.find((e) => e.id === userTwo.id );
                expect(userTwoFound).to.be.undefined;
            })
            .end(done);
    });

    it('user two should see if the user one has unliked her/him',(done) => {
        request(app)
            .get(`/me`)
            .set('authorization', `Bearer ${userTwo.token}`)
            .send()
            .expect(200)
            .expect((res) => {
                let likedByUserList = res.body.data.likedByUserList;
                expect(likedByUserList).to.be.an('array');

                let userOneFound = likedByUserList.find((e) => e.id === userOne.id );
                expect(userOneFound).to.be.undefined;
            })
            .end(done);
    });

}); 


describe('User information', () => {
    let listOfUsers = [];
    let numberOfUsers = 3;

    before((done) => {
             // create 6 users
             let promises = [];
             for(let i=0; i < numberOfUsers; i++){
                promises.push(request(app).post('/signup').send({ username: randonStringGenerator.generate(7), password: randonStringGenerator.generate(7)}));
             }
     
             Promise.all(promises).then((responses) => {
                 for(let response of responses){
                     listOfUsers.push(response.body.data);
                 }

                 // firstUser like other users
                 firstUser = null;
                 likePromises = [];
                 for(let user of listOfUsers){
                     if(firstUser == null) { firstUser = user; continue; }
                     likePromises.push(request(app).post(`/user/${user.id}/like`).set('authorization', `Bearer ${firstUser.token}`).send())
                 }
         
                 // everyone Like firstUser
                 for(let user of listOfUsers){
                     if(user.id == firstUser.id){ continue; }
                     likePromises.push(request(app).post(`/user/${firstUser.id}/like`).set('authorization', `Bearer ${user.token}`).send())
                 }        
                Promise.all(likePromises).then(()=>{
                    done();
                }).catch(done);
             });
        }); 

    it('should see username and number of likes that the user has done', (done) => {
        request(app)
            .get(`/user/${listOfUsers[0].id}`)
            .send()
            .expect(200)
            .expect(response => {
                let userfetched = response.body.data;
                let userOne = listOfUsers[0];
                expect(userfetched.username).equal(userOne.username);
                expect(+userfetched.likes).equal(listOfUsers.length - 1);
            }).end(done);
    })

    it('most-liked should see the most liked users desc', (done) => {
        request(app)
            .get(`/most-liked`)
            .expect(200)
            .expect(response => {
                let users = response.body.data.users;
                users.should.be.an("array");
                let firstUser = users[0];
                firstUser.should.have.property('username');
                firstUser.should.have.property('numberOfLikes');

                let userOne = listOfUsers[0];
                expect(firstUser.username).equal(userOne.username);
            })
            .end(done);
    });

});