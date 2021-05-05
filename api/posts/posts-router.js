// implement your posts router here
const express = require('express');
const router = express.Router();
const Posts = require('./posts-model');

router.get('/api/posts', (request, response) => {
    Posts.find()
        .then(posts => response.status(200).json(posts))
        .then(error => response.status(500).json({
            message: "The posts information could not be retrieved"
        }));
});

router.get('/api/posts/:id', (request, response) => {
    const { id } = request.params;
    Posts.findById(id)
        .then(post => {
            if (!post) {
                response.status(404).json({ message: "The post with the specified ID does not exist" });
            } else {
                response.status(200).json(post);
            }
        })
        .catch(error => response.status(500).json({ message: "The post information could not be retrieved" }));
});

router.post('/api/posts/', (request, response) => {
    const newPost = request.body;
    if(!newPost.title || !newPost.contents) {
        return response.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        Posts.insert(newPost)
        .then(post => {
            response.status(201).json(post)
        })
        .catch(error => response.status(500).json({ message: "There was an error while saving the post to the database" }))
    }
});

router.put('/api/posts/:id', (request, response) => {
    const { id } = request.params;
    const editedPost = request.body;

    if (!editedPost.title || !editedPost.contents) {
        response.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        Posts.findById(id)
            .then(post => {
                if (!post) {
                    response.status(404).json({ message: "The post with that specified ID does not exist" })
                } else {
                    Posts.update(id, editedPost)
                    .then(success => {
                        Posts.findById(id)
                        .then(updatedPost => response.status(200).json(updatedPost))
                    })
                    .catch(error => response.status(500).json({ message: "The post information could not be modified" }))
                }
            })
            .catch(error => response.status(500).json({ message: "Error searching for post to modify" }))
    }
});

router.delete('/api/posts/:id', (request, response) => {
    const {id} = request.params;
    Posts.findById(id)
    .then(post => {
        if(!post) {
            response.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            Posts.remove(id)
            .then(i => response.status(200).json('Post deleted'))
            .catch(error => response.status(500).json({ message: "The post could not be removed" }))
        }
    })
});

router.get('/api/posts/:id/comments', (request, response) => {
    const {id} = request.params;
    Posts.findPostComments(id)
    .then(comments => {
        if(!comments) {
            response.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            response.status(200).json(comments)
        }
    })
    .catch(error => response.status(500).json({ message: "The comments information could not be retrieved" }))
})

module.exports = router;