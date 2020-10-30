const express = require('express');
const User = require('./userDb');
const Post = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  User.insert(req.body)
    .then(user => {
      console.log(user);
      res.status(201).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message: err.message})
    })
});

router.post('/:id/posts', validateUser, validatePost, (req, res) => {
  Post.insert({...req.body, user_id: req.params.id})
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message: err.message})
    })
});

router.get('/', (req, res, next) => {
    User.get(req.query)
      .then(users => {
        res.status(200).json(users)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: 'The user information cannot be retrieved'
        })
      });
  });

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', (req, res) => {
  User.getUserPosts(req.user.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err.message);
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  User.remove(req.user.id)
    .then(user => {
      if(user){
        res.status(200).json({message: `User was deleted successfully`})
      }else if(!user){
        res.status(500).json({message: `User does not exist`})
      } else {
        res.status(400).json({message: 'Something went wrong'})
      }
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  User.update(req.user.id, req.body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message: err.message})
    })
});

//custom middleware

async function validateUserId(req, res, next) {
  const {id} = req.params
  try{
    const user = await User.getById(id);
    if(user){
      req.user = user;
      next();
    } else {
      next({code: 400, message: "invalid user id"});
    }
  }catch(error){
    next({code: 500, message: error.message});
  }
}

function validateUser(req, res, next) {
  if(!req.body){
    return res.status(400).json({message: 'Missing user data'})
  }else if(!req.body.name){
    return res.status(400).json({message: `Missing required text field`})
  }
  next();
}

function validatePost(req, res, next) {
  if(!req.body){
    next({code: 400, message: "Missing post data"})
  } else if(!req.body.text || typeof req.body.text !== "string"){
    next({code: 400, message: "Missing required text field"})
  } else {
    next();
  }
}

router.use((err, req, res, next) => {
  res.status(err.code).json({message: err.message});
}); 

module.exports = router;
  

