#Backend application
This application has the following endpoints:

**/signup**
Sign up to the system (username, password)

**/login**
Logs in an existing user with a password  

**/me**
Get the currently logged in user information  

**/me/update-password**
Update the current users password

**/user/:id/**
List username & number of likes of a user
  
**/user/:id/like**
Like a user  

**/user/:id/unlike**   
Un-Like a user  

**/most-liked**  
List users in a most liked to least liked 

Each user can like another only once, and they can unlike each other.  



## Instructions
if you want to run this code you will need to have postgres installed - see database informtion in config dir

Each endpoint is tested using mocha and supertest and for you to run the test you have to run `npm test`
