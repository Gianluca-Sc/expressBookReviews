const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!(username || password))
    res.status(400).json({ error: "Username or password missing" });

  const userAlreadyExists = users.find((user) => user.username === username);
  if (userAlreadyExists)
    return res.status(400).json({ error: "user already exists" });

  users.push({ username, password });
  res.status(200).send(`user ${username} created`);
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const promise = new Promise((resolve, reject) => {
    resolve(books);
  });

  promise.then((result) => res.send(JSON.stringify(books, null, 4)));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const { isbn } = req.params;
  const promise = new Promise((resolve, reject) => {
    resolve(books[+isbn]);
  });

  const book = await promise;

  if (!book) return res.status(404).json({ error: "Book not found" });

  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const { author } = req.params;

  const promise = new Promise((resolve, reject) => {
    resolve(Object.values(books).filter((b) => b.author === author));
  });

  const booksByAuthor = await promise;

  if (!booksByAuthor)
    return res.status(404).json({ error: "Author not found" });

  return res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const { title } = req.params;

  const promise = new Promise((resolve, reject) => {
    resolve(Object.values(books).filter((b) => b.title === title));
  });

  const booksByTitle = await promise;

  if (!booksByTitle) return res.status(404).json({ error: "Title not found" });

  return res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  const reviews = books[+isbn].reviews;

  if (!reviews) return res.status(404).json({ error: "Not found" });

  return res.status(200).json(reviews);
});

module.exports.general = public_users;
