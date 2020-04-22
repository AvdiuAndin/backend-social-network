# Backend application
This application has the following endpoints:

Sign up to the system (username, password)

**/signup**

Logs in an existing user with a password  

**/login**

Get the currently logged in user information  

**/me**

Update the current users password

**/me/update-password**

List username & number of likes of a user

**/user/:id/**

Like a user  

**/user/:id/like**

Un-Like a user  

**/user/:id/unlike**   

List users in a most liked to least liked 

**/most-liked**  

Each user can like another only once, and they can unlike each other.  



## Instructions
if you want to run this code you will need to have postgres installed - see database informtion in config dir

Each endpoint is tested using mocha and supertest and for you to run the test you have to run `npm test`
