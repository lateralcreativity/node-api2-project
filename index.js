const express = require('express');
const postsRouter = require('./posts/posts-router.js');

const server = express();
server.use(express.json());
const PORT = 8000;

server.get('/', (req, res) => {
    res.send(`Testing API Connection`)
});

server.use('/api/posts', postsRouter);

server.listen(PORT, () => console.log(`Server Running At localhost:${PORT}`));