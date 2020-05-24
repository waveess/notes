//express module
const express = require('express');
const fs = require('fs');
const path = require('path');

//router; 3001 or other
const PORT = process.env.PORT || 3001;

//instantiating the server

const app = express();

//parse incoming strng or array data

app.use(express.urlencoded ( { extended: true}));

// parse incoming JSON data

app.use(express.json());

//public files

app.use (express.static('public'));

//request data

const { notes } = require('./data/db.json');

//handling data from req.body

function createNewNote (body, notesArray) {
    const note = body;
    notesArray.push(note);

    //path to write files

    fs.writeFileSync(
        path.join(__dirname, './data/db.json'),
        JSON.stringify({ notes : notesArray }, null, 2)
    );

    return note;
};

//validating data

function validataNote (note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== "string") {
        return false;
    }
    return true;
};

//route GET

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// routing to server to accept data to be used/stores serve-side

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();

    //validating data

    if(!validateNote(req.body)) {
        res.status(400).send('The note is not formatted correctly');
    } else {
        const note = createNewNote(req.body, notes);
        res.json(note);
    }
});

//deleting notes

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    let note;

    notes.map((element, index) => {
        if(element.id == id) {
            note = element
            notes.splice(index, 1)
            return res.json(note);
        }
    })
});

//routing to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//chain liste() method to our servers
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});