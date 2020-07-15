const express = require('express');
const router = express.Router();
const db = require('../data/db.js');


// Creates a post using the information sent inside the request body.
// {
//  title: "The post title", // String, required
//  contents: "The post contents", // String, required
// }
router.post('/', (req, res) => {
    const newPost = req.body;

    if (!newPost.title || !newPost.contents) {
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        db.insert(newPost)
            .then(response => {
                res.status(201).json(newPost)
            })
            .catch(error => {
                res.status(500).json({ error: "There was an error while saving the post to the database" });
            })
    }
})

// Creates a comment for the post with the specified id
// using information sent inside of the request body.
router.post('/:id/comments', (req, res) => {
    const { id } = req.params;
    const newComment = req.body;

    db.findById(id)
        .then(response => {
            if (newComment === '') {
                res.status(400).json({ errorMessage: "Please provide text for the comment." })
            } else {
                db.insertComment(newComment)
                    .then(comment => {
                        res.status(201).json(newComment)
                    })
                    .catch(commentError => {
                        res.status(500).json({ error: "There was an error while saving the comment to the database" })
                    })
            }
        })
        .catch(error => {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        })
});

// Returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
    db.find()
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json({ message: "Error retrieving posts " });
        })
});

// Returns the post object with the specified id.
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.findById(id)
        .then(response => {
            if (!response[0]) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                res.status(200).json(response);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The comments information could not be retrieved." });
        })
});

// Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (req, res) => {
    const { id } = req.params;

    db.findPostComments(id)
        .then(response => {
            if (!response[0]) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                res.status(200).json(response);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The comments information could not be retrieved." });
        })
});

// Removes the post with the specified id and returns the deleted post object. 
// You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.findById(id)
        .then(response => {
            if (!response[0]) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                db.remove(id)
                    .then(removed => {
                        res.status(200).json(response)
                    })
            }
        })
        .catch(error => res.status(500).json({ error: "The post could not be removed" }));

});

// 	Updates the post with the specified id using data from the request body.
//  Returns the modified document, NOT the original.
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updatedPost = req.body;

    db.findById(id)
        .then(response => {
            if (!response[0]) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                if (!updatedPost.title || !updatedPost.contents) {
                    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
                } else {
                    db.update(id, updatedPost)
                        .then(updated => {
                            res.status(200).json(updatedPost);
                        })
                }
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The post information could not be modified." });
        })
})

module.exports = router;