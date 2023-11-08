const notes = require('express').Router();
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

notes.get('/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/notes', (req, res) => {
    console.log(req.body);
    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid()
        };

        readAndAppend(newNote, './db/db.json');
        res.json('Note added successfully');
    } else {
        res.errored('Error in adding note');
    }
});

notes.delete('/notes/:id', (req, res) => {
    console.log(req.params.id);
    const noteId = req.params.id;

    readFromFile('./db/db.json')
        .then((data) => {
            const notes = JSON.parse(data);
            const updatedNotes = notes.filter((note) =>  note.id !== noteId);

            writeToFile('./db/db.json', updatedNotes)
                .then(() => {
                    res.json(`Note with ID ${noteId} deleted successfully`);
                })
                .catch((err) => {
                    res.status(500).json(`Failed to delete note`);
                });
        })
        .catch((err) => {
            res.status(500).json('Failed to read file');
        });
})

module.exports = notes;
