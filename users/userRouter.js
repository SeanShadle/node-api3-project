const express = require('express');
const Users = require('./userDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  const data = req.body

  Users.insert(data)
    .then(users => {
      if(users){
        res.status(201).json(users)
      } else {
        res.status(400).json({
          errorMessage: "Please provide a name for user"
        })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        error: "There was an error saving user"
      })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const {name} = req.body

    if(!req.body.name){
      return res.status(400).json({
        errorMessage: "Please provide a name for the post"
      })
    }
    Users.insert({name})
      .then(users => {
        res.status(404).json({
          message: 'The user with the specific ID does not exist'
        })
      })
});

router.get('/', (req, res) => {
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: 'The user information cannot be retrieved.'
      })
    })
});

router.get('/:id', (req, res) => {
  Users.getById(req.params.id)
    .then(users => {
      if(users){
        res.status(200).json(users)
      }else{
        res.status(404).json({
          message: 'The user with specified ID does not exist'
        })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: 'The user information could not be retrieved'
      })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(users => {
      if(users){
        res.status(200).json(users)
      }else{
        res.status(404).json({
          message: 'The user with the specified ID does not exist'
        })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        error: 'The post information could not be retrieved.'
      })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(users => {
      if(users){
        res.status(200).json({
          message: 'The user has been deleted'
        })
      }else{
        res.status(404).json({
          message: 'The user with the specified ID does not exist'
        })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        error: 'The post could not be removed'
      })
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  if(!req.body.name){
    return res.status(400).json({
      errorMessage: 'Please provide a username'
    })
  }

  Users.update(req.params.id, req.body)
    .then(users => {
      if(users){
        res.status(200).json(users)
      }else{
        res.status(404).json({
          message: 'The user with the specified ID does not exist'
        })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        error: 'The user information could not be modified'
      })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  const {id} = req.params;

  Users.getById(id)
    .then(data => {
      if(data) {
        return next()
      }else{
        return res.status(404).json({
          message: `user with id: ${id} not found`
        })
      }
    })
    .catch(error => {
      console.log(error.message)
      next({code: 500, message: 'Something went wrong'})
    })
}

function validateUser(req, res, next) {
  if(!req.body){
    return res.status(400).json({message: 'Missing user data'})
  } else if (!req.body.name){
    return res.status(400).json({message: 'Missing required name field'})
  }
  next();
};

function validatePost(req, res, next) {
  if(req.body.name){
    next();
  } else if(!req.body){
    return res.status(400).json({message: "Missing user data"})
  } else {
    return res.status(400).json({message: 'Missing required post'})
  }
}

module.exports = router;
