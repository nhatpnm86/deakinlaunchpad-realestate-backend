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
    var status = 'New';
    data.status = status;
    data.history = [{timestamp: now, status: status}];

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

/* POST to updaterequeststatus. */
router.post('/updaterequeststatus/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('requests');
  var userToApprove = req.params.id;
  var newStatus = req.body.newStatus;
  var now = Date.now();

  collection.findOneAndUpdate({ '_id' : userToApprove }, {
    $set: {
    status: newStatus,
    updatedTime: now
  },
    $push: {
      history: {
        $each: [{timestamp: now, status: newStatus}]
      }
    }}, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

module.exports = router;