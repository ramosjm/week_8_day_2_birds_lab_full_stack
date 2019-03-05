const express = require('express');
const ObjectID = require('mongodb').ObjectID;

const createRouter = function (collection) {

  const router = express.Router();

  router.get('/', (req, res) => {
    collection
      .find()
      .toArray()
      .then((docs) => res.json(docs))
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  router.get('/:id', (req, res) => {
    const id = req.params.id;
    collection
      .findOne({ _id: ObjectID(id) })
      .then((doc) => res.json(doc))
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

// created post route -
  router.post('/',(req,res)=>{
    const newData = req.body; //req.body requires parser in server.js
    collection
      .insertOne(newData)
      .then(()=> collection.find().toArray())
      .then((docs)=>res.json(docs))
  });

//created put route -
  router.put('/:id',(req,res)=>{
    const id = req.params.id;
    const updatedData = req.body;
    collection
      // updateOne takes two arguments - the second argument requires $set:
      .updateOne({_id: ObjectID(id)} , {$set: updatedData}) //ObjectID is required to create a special MongoDB Id.
      .then(()=> collection.find().toArray())
      .then((docs)=>res.json(docs))
  });

  router.delete('/:id', (req, res) => {
    const id = req.params.id;
    collection
      .deleteOne({ _id: ObjectID(id) })
      .then(() => collection.find().toArray())
      .then((docs) => res.json(docs))
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  return router;

};

module.exports = createRouter;
