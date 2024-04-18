const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
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
  //Write your code here
 const result = new Promise((resolve, reject) =>{
    resolve(books);
 }) 
 result.then((booklist) =>{
    console.log("resolved");
    return res.status(200).json(booklist);
 })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //if book with isbn in stock, return the book, else status 204 with no content
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else return res.status(204).json({ message: "no book with isbn: " + isbn + " found.\n" });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const vals = Object.values(books);
  const author = req.params.author;
  let res_books = [];
  for(let i = 0; i < vals.length;i++){
    if(vals[i]['author'] === author){
        res_books.push(vals[i]);
    }
  }
  if(res_books.length>0){
    return res.status(200).json(res_books);
  } else return res.status(204).json({message: "no book authored by: " + author + " found.\n"});
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const vals = Object.values(books);
  let res_books = [];
  for(let i = 0; i < vals.length;i++){
    if(vals[i]['title'] === title){
        res_books.push(vals[i]);
    }
  }
  if(res_books.length>0){
    return res.status(200).json(res_books);
  } else return res.status(204).json({message: "no book with title: " + title + " found.\n"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(200).json(books[isbn]['reviews'])
  }
  return res.status(204).json({ message: "no book with isbn: " + isbn + " found.\n" });
});

module.exports.general = public_users;

