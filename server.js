//require modules
const express = require('express');
const fs = require('fs');
const path = require('path'); 

//represents PORT to any route or directly to 3001
const PORT = process.env.PORT || 3009; 

//instantiate the server
const app = express(); 

// parse incoming string or array data
app.use(express.urlencoded ( { extended: true }));
// parse incoming JSON data
app.use(express.json());
// middleware for public files
app.use(express.static('public')); 


// request data 
const { notes } = require('./db/db.json');


//function to create a new Note
function createNewNote (body, notesArray) {
    const note = body; 
    notesArray.push(note); 

    // path to write file 
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes : notesArray }, null, 2)
    );
    // return finished code to post route for response
    return note; 
};


//function to validate the note inputs to be strings
function validateNote (note) {
    if (!note.title || typeof note.title !== 'string') {
        return false; 
    }
    if (!note.text || typeof note.text !== "string") {
        return false;
    }
    return true;   
};





//get request to get all the notes and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    res.json(notes); 
});




//post request to send back all the notes
app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be 
    req.body.id = notes.length.toString(); 

    // if any data in req.body is incorrect, send error
    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.'); 
    
    } else {
        // add note to json file and animals array in this function 
        const note = createNewNote(req.body, notes); 

        res.json(note);
    }
});




//route to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
}); 


//call to delete the notes from the list of notes and update the JSON file
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    // let selectedItem;

    notes.map((selectedItem, index) => {
      if (selectedItem.id === id){
        // selectedItem = item
        notes.splice(index, 1)
        return res.json(selectedItem);
      } 
    
    })

    // path to write file 
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes : notes }, null, 2)
        // JSON.stringify(notes)
    );
});





//route to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/notes.html'));
}); 



//listener method to our servers 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});