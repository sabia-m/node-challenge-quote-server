// server.js
// This is where your node app starts

//load the 'express' module which makes writing webservers easy
const express = require("express");
const mongodb = require("mongodb")
const app = express();

const uri = process.env.DATABASE_URI
//load the quotes JSON
//const quotes = require("./quotes.json");

// Now register handlers for some routes:
//   /                  - Return some helpful welcome info (text)
//   /quotes            - Should return all quotes (json)
//   /quotes/random     - Should return ONE quote (json)
app.get("/", function(request, response) {
  response.send("Search for /quotes/random, or /quotes. To explore specific quotes, try /quotes/search !");
});

//START OF YOUR CODE...

// app.get("/quotes", function (request, response) {
//   response.json({quotes})
// });

app.get("/quotes", (request, response) => {
  const client = mongodb.MongoClient(uri)
  
    client.connect(function(){
    const db = client.db("quotes")
    const collection = db.collection("quotes")
    
    collection.find().toArray(function (error, quotes) {
      response.send(error || quotes)
      })
  })
})

// app.get("/quotes/random", function (request, response) {
//   response.json(pickFromArray(quotes))
// });

app.get("/quotes/random", (request, response) => {
  const client = mongodb.MongoClient(uri);
  
  client.connect(function() {
    const db = client.db("quotes");
    const collection = db.collection("quotes");

    collection.find().toArray((error, quotes) => {
      response.send(error || pickFromArray(quotes));
      client.close();
    });
  });
});

// app.get("/quotes/search", function (request, response) {
//   const term = request.query.term
//   response.json(quotes.filter(e => e.quote.includes(term)))
// })

app.get("/quotes/search", (request, response) => {
   const client = new mongodb.MongoClient(uri);
  
  client.connect(function(){
    const db = client.db("quotes")
    const collection = db.collection("quotes")
    
    let searchObject = {}
    
    if (request.query.quote){
      searchObject["quote"] = request.query.quote
    }
    
    collection.find(searchObject).toArray(function (error, quote) {
      response.send(error || quote)
      })
  })
})

//...END OF YOUR CODE

//You can use this function to pick one element at random from a given array
//example: pickFromArray([1,2,3,4]), or
//example: pickFromArray(myContactsArray)
//
function pickFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

//Start our server so that it listens for HTTP requests!
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
