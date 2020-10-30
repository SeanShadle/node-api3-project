const express = require('express');
const Post = require("./postDb");
const router = express.Router();

router.get('/', (req, res) => {
  Post.get(req.query)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'The post information cannot be retrieved'
      })
    });
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
  Post.remove(req.post.id)
    .then(post => {
      res.status(200).json({message: "Post successfully deleted"});
    })
    .catch(err => {
      res.status(500).json({message: err.message});
    })
});

router.put('/:id', validatePostId, (req, res) => {
  Post.update(req.params.id, req.body)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message: err.message})
    })
});

// custom middleware

async function validatePostId(req, res, next) {
  const {id} = req.params;
  try{
    const post = await Post.getById(id);
    if(post){
      req.post = post;
      next();
    } else {
      next({code: 400, message: "invalid user id"});
    }
  } catch (error){
    next({code: 500, message: error.message});
  }
}

module.exports = router;
