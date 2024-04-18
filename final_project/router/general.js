const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  const username_valid = isValid(username);
  if(username_valid){
    users.push({"username":username, "password":password});
    return res.status(200).json({message:"User successfully registered."})
  } else return res.status(404).json({message: "User already exists!"});  
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
 const result = new Promise((resolve, reject) =>{
   resolve(res.status(200).send(JSON.stringify({books}, null, 4)));
 }) 
 result.then(() => console.log('Task 10 completed'));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
      const result = new Promise((resolve, reject) =>{
        const isbn = req.params.isbn;
        const book = books[isbn];
//if the book with isbn exists, reslove; otherwise reject with error msg
        if(book){
            resolve(res.status(200).send(book));
        }else reject(res.status(304).send({message:"No book with isbn: " + isbn + " found."})) 
      }) 

  result.then(() => console.log('Task 11 completed')).catch((err) =>{
    console.log(err)
  })
 });
  

// Get book details based on author
public_users.get('/author/:author', function (req, res) {  
    const result = new Promise((resolve, reject) =>{
        const author = req.params.author;
        const vals = Object.values(books);
        //get the books authored by "author"
        let res_books = [];
        for(let i = 0; i < vals.length;i++){
            if(vals[i]['author'] === author){
                res_books.push(vals[i]);
            }
  }
//if the book authored by author exists, reslove; otherwise reject with error msg
        if(res_books.length > 0){
            resolve(res.status(200).send(res_books));
        }else reject(res.status(204).json({message:"No book authored by : " + author + " found."})) 
      }) 

      result.then(() => console.log('Task 12 completed')).catch((err)=>
      console.log(err));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const result = new Promise((resolve, reject) =>{
        const title = req.params.title;
        const vals = Object.values(books);
        //get the books with title "title"
        let res_books = [];
        for(let i = 0; i < vals.length;i++){
          if(vals[i]['title'] === title){
              res_books.push(vals[i]);
          }
        }
//if the book with title exsits, resolve, otherwise reject        
        if(res_books.length>0){
            resolve(res.status(200).json(res_books));
        } else reject(res.status(204).json({message: "No book with title: " + title + " found."}));
    })
    result.then(() => console.log('Task 13 completed')).catch((err) => 
    console.log(err))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(200).json(books[isbn]['reviews'])
  }
  return res.status(204).json({ message: "no book with isbn: " + isbn + " found.\n" });
});

module.exports.general = public_users;

