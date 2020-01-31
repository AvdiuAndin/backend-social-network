'use strict';
const HTTP_CODES = require('http-status-codes');
const UserValidator = require('../Validator/UserValidator');
const UserService = require('../Service/UserService');
const bcrypt = require('bcryptjs');
const JwtService = require('../../Jwt/Service/JwtService');
const Util = require('../../../util/Util');

const UserController = {

    signUp: async (req, res) =>  {
        let body = req.body;

        // Validate body
        let validate = UserValidator.userCreateValidator(body);
        if(validate.error){
            return res.status(HTTP_CODES.BAD_REQUEST).json({ error: true, message: validate.error.message });
        }

        // Check if the username exists
        let usernameExists = await UserService.checkIfUsernameExists(body.username);
        if(usernameExists){
            return res.status(HTTP_CODES.BAD_REQUEST)
                .json({
                    error: true,
                    message: "Username already exists"
                });
        }

        const hash = await Util.generatePassword(body.password);

        // Save user
        const userId = await UserService.create({
            username: body.username,
            password: hash
        });

        const token = JwtService.generateToken({ id: userId, username: body.username })

        // create and return id
        return res.status(HTTP_CODES.OK).json({
            error: false,
            data: {
                token
            }
        });
    },
    login: async (req, res) => {
        let body = req.body;
        // Validate body
        let validate = UserValidator.userCreateValidator(body);
        if(validate.error){
            return res.status(HTTP_CODES.BAD_REQUEST).json({ error: true, message: validate.error.message }).status(HTTP_CODES.BAD_REQUEST);
        }

        // fetch the user from database
        let user = await UserService.readByUsername(body.username);
        if(user == null){
            return res.status(HTTP_CODES.NOT_FOUND).json({ error: true, message: "User with username does not exist"});
        }

        // validate if the password is the correct one
        let match = await bcrypt.compare(body.password, user.password);
        if(!match){
            return res.status(HTTP_CODES.BAD_REQUEST).json({ error: true, message: "Password does not match"});
        }

        let token = JwtService.generateToken({ id: user.id, username: user.username });

        return res.json({ error: false, data: { token }});
    },
    updatePassword: async (req,res) => {
        let body = req.body;

        // Validate body
        let validate = UserValidator.updatePasswordValidator(body);
        if(validate.error){
            return res.status(HTTP_CODES.BAD_REQUEST).json({ error: true, message: validate.error.message });
        }

        // old password should not be the same as the new password
        if(body.oldPassword === body.newPassword){
            return res.status(HTTP_CODES.BAD_REQUEST).json({ error: true, message: `New password can't be the same as the old password`});
        }
        // compare the password sent
        let match = await bcrypt.compare(body.oldPassword, req.user.password);
        if(!match){
            return res.status(HTTP_CODES.BAD_REQUEST).json({ error: true, message: "Old password is incorrect"});
        }

        const hash = await Util.generatePassword(body.newPassword);
        await UserService.updatePassword(req.user.id, hash);

        return res.json({
            error: false,
            data: {
                message: "success"
            }
        });

    },
    me: async (req, res) => {

        // gets the information of users that liked the requesting user
        const likedByUserList = await UserService.getLikedInfo(req.user.id);
        // gets the information of the users that the requesting user has liked
        const likesUsersList = await UserService.getLikesOfUser(req.user.id);

        return res.json({
            error: false,
            data: {
                likedByUserList,
                likesUsersList
            }
        });
    },
    userInfoAndLikes: async (req,res) =>{
        const userId = req.params.id;

        const user = await UserService.readById(userId);
        if(user == null){
            return res.status(HTTP_CODES.NOT_FOUND).json({
                error: true,
                message: `User with id ${userId} was not found`
            });
        }

        const likesNumber = await UserService.countLikesOfUser(userId);

        return res.json({
            error: false,
            data: {
                username: user.username,
                likes: likesNumber
            }
        })
    },
    likeAUser: async (req, res) => {

        const userToLikeId = req.params.id;
        const user = req.user;

        const userToLike = await UserService.readById(userToLikeId);
        if(userToLike == null){
            return res.status(HTTP_CODES.NOT_FOUND).json({
                error: true,
                message: `User with id ${userToLikeId} does not exist`
            });
        }

        if(user.id == userToLikeId){
            return res.json({
                error: true,
                message: "You can't like your self"
            });
        }

        let likeExists = await UserService.checkIfUsersLikeExists(user.id, userToLikeId);
        if(likeExists){
            return res.status(HTTP_CODES.BAD_REQUEST).json({
                error: true,
                message: "You have already liked this person"
            });
        }

        await UserService.likeUser(user.id, userToLikeId);
        return res.status(HTTP_CODES.OK).json({
            error: false,
            data: {
                message: "success"
            }
        });
    },
    unLikeAUser: async (req, res) => {
        const userToUnLikeId = req.params.id;

        const userToLike = await UserService.readById(userToUnLikeId);
        if(userToLike == null){
            return res.status(HTTP_CODES.NOT_FOUND).json({
                error: true,
                message: `User with id ${userToUnLikeId} does not exist`
            });
        }

        await UserService.unLikeAUser(req.user.id, req.params.id);

        return res.json({error: false, message: "success" });
    },
    mostLiked: async (req, res) => {
        return res.json({
            error: false,
            data: await UserService.getMostLikedUsers()
        });
    }
};
module.exports = UserController;
