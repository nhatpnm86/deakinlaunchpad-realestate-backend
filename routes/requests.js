var express = require('express');
var router = express.Router();
const monk = require('monk');

/* GET requestlist. */
router.get('/requestlist', function(req, res) {
    var db = req.db;
    var collection = db.get('requests');
    collection.find({},{},function(e,docs){
      res.json(docs);
    });
  });

/* POST to addrequest. */
router.post('/addrequest', function(req, res) {
    var db = req.db;
    var collection = db.get('requests');
    var data = req.body;

    var now = Date.now();
    data.createdTime = now;
    data.updatedTime = now;

    data.status = 'New';

    collection.insert(data, function(err, result){
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    });
  });

/* GET getrequest. */
router.get('/getrequest/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('requests');
    collection.find({_id: monk.id(req.params.id)},{},function(e,docs){
      res.json(docs);
    });
  });

/* POST to approverequest. */
router.post('/approverequest/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('requests');
  var userToApprove = req.params.id;
  collection.findOneAndUpdate({ '_id' : userToApprove }, {$set: {status: 'Approved'}}, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

/* POST to dismissrequest. */
router.post('/dismissrequest/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('requests');
  var userToApprove = req.params.id;
  collection.findOneAndUpdate({ '_id' : userToApprove }, {$set: {status: 'Dismissed'}}, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

module.exports = router;