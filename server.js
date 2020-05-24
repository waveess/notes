//express module
const express = require('express');
const fs = require('fs');
const path = require('path');

//router; 3001 or other
const PORT = process.env.PORT || 3001;

//instantiating the server

const app = express();

//parse incoming strng or array data

