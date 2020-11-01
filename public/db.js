const { request } = require("express");

//Dependencies and variables
let db;

//Create a new db request for a "budget" database
request.onupgradeneeded = function(event) {
    //Create object store called "pending" and set autoincrement to true
    const db = event.target.result;
    db.createObjectStore("pending", { autoincrement: true });
};