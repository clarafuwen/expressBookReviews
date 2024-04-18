const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const userswithsamename = users.filter((user) =>{
    return user.username === username;
})
if(userswithsamename.length > 0){
    return false;
} else return true;

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const filtered_user = users.filter((user) =>{
    return user.username === username && user.password === password;
})
if(filtered_user.length>0)
{return true;} 
else return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in!!"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  })

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const isbns = Object.keys(books);
  //if the book with isbn exists in the database, go ahead add review
  if(isbns.includes(isbn)){
      const username = req.session.authorization['username'];
      const review = req.body.review;
      books[isbn]['reviews'][username] = review;
      return res.status(200).json({message: "Review successfully added"})
  } else return res.status(304).json({message: "No book with isbn: " + isbn + " found."});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const isbns = Object.keys(books);
    //if the book with isbn exists in the database, go ahead delete the review
    if(isbns.includes(isbn)){
        const username = req.session.authorization['username'];
        const review = req.body.review;
        delete books[isbn]['reviews'][username]; 
        return res.status(200).json({message: "Review successfully deleted."})
    } else return res.status(304).json({message: "No book with isbn: " + isbn + " found."});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
