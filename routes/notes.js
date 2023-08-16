const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchUser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


//Get all the notes using GET : "api/notes/getuser" , Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {

        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured")
    }
})


//Add notes using POST : "api/notes/addnotes" , Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 1 }),
    body('description', 'Description must be atleast three characteres').isLength({ min: 3 }),
], async (req, res) => {
    try {

        const { title, description, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();

        res.json(savedNote)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured")
    }
})

//Update an existing note using PUT : "api/notes/updatenote/:id"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        //create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            res.status(401).send("Unauthorized access not allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured")
    }
})


//Delete an existing note using DELETE : "api/notes/deletenote/:id"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        //Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            res.status(401).send("Unauthorized access not allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "success": "Note has been deleted" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured")
    }
})

module.exports = router