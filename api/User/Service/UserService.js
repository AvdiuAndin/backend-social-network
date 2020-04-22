'use strict';
require('module-alias/register');
let bookshelf = require('@bookshelf');
const knex = bookshelf.knex;


const UserService = {

    updatePassword: async(id, password) => {
        return knex('users').update({ password: password }).where({id: id});
    },


    readById: async(id) => {
        return knex('users').where({id: id}).first();
    },


    readByUsername: async (username) => {
        return knex('users').where({"username": username}).first();
    },


    create: async(user) => {
        let result = await knex("users").insert(user).returning("id");
        return result[0];
    },

    checkIfUsernameExists: async(username) => {
        let result = await knex.raw(`SELECT EXISTS(select 1 from users where username=\'${username}\')`);
        return result.rows[0].exists;
    },


    countLikesOfUser: async(userId) =>{
        let result = await knex('user_likes').count().where('user_id', userId).first();
        return result.count;
    },


    // gets the information of users that liked the requesting user
    getLikedInfo: async (userId) =>{
        let subQuery = knex("user_likes").select('user_id').where("liked_user_id", userId);
        return knex('users').select("id","username").whereIn("id", subQuery);

        // return await knex("user_likes likedUser")
        //     .innerJoin("users as userThatLiked", 'userThatLiked.id', '=', 'likedUser.user_id')
        //     .select("userThatLiked.username", "userThatLiked.id")
        //     .where('likedUser.liked_user_id', userId);
    },


    checkIfUsersLikeExists: async (requestingUserId, likedUserId) => {
        let result = await knex.raw(`SELECT EXISTS(select 1 from user_likes where user_id=${requestingUserId} and liked_user_id=${likedUserId} )`);
        return result.rows[0].exists;
    },



    // gets the like information of the users that the requesting user has done
    getLikesOfUser: async(userId) =>{

        let subQuery = knex("user_likes").select('liked_user_id').where("user_id", userId);
        return knex('users').select("id","username").whereIn("id", subQuery);

        // return await knex("user_likes likedUser")
        //     .innerJoin("users as userThatLiked", 'userThatLiked.id', '=', 'likedUser.user_id')
        //     .select("userThatLiked.username", "userThatLiked.id")
        //     .where('likedUser.user_id', userId);
    },


    likeUser: async (userId, likedUserId) => {
        let result = await knex('user_likes').insert({ user_id: userId, liked_user_id: likedUserId}).returning('id');
        return result[0];
    },


    unLikeAUser: async(userId, likedUserId) => {
        return knex('user_likes').where({user_id: userId, liked_user_id: likedUserId }).del();
    },


    getMostLikedUsers: async() =>{
        return knex("user_likes").groupBy('user.id',"username").count("*", {as: 'numberOfLikes'})
            .innerJoin('users as user', 'user_likes.liked_user_id','=','user.id')
            .select("user.id", "username").orderBy('numberOfLikes','desc');
    }
};

module.exports = UserService;
