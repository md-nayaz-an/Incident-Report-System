const express = require("express");

const routes = express.Router();
const { getDb } = require('./conn');

routes.route("/incident").get(
  async(req, res) => {
    let arr;
    let query = {}
    if (typeof(req.query.status) !== 'undefined') {
      query.status = req.query.status
    }

    if (typeof(req.query.userid) !== 'undefined') {
      query.assigned = Number.parseInt(req.query.userid)
    }
    arr = await getDb()
      .collection("incidents")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "assigned",
            foreignField: "id",
            as: "userDetails"
          }
        },
        {
          $match: query
        }
      ]).toArray();
    
    res.json(arr);
  }
)

routes.route("/userdetails").get(
  async(req, res) => {
    let arr = await getDb()
      .collection('users')
      .find({})
      .toArray();
    res.json(arr);
  }
)

routes.route("/incident/add").post(
  async(req, res) => {

    await getDb()
      .collection('incidents')
      .insertOne(req.body);

    await getDb()
      .collection('counters')
      .findOneAndUpdate({
        _id: "incidents"
      },{
        $inc: {current: 1}
      },
      { returnOriginal: false }
    )
  }
)

routes.route("/login").get(
  async(req, res) => {
    let result = await getDb()
      .collection('users')
      .findOne({
        'id': Number.parseInt(req.query.userid)
      })

    if (result === null)
      result = { password: 'invalid'}
    res.json(result);
  }
)

routes.route("/sequence").get(
  async(req, res) => {
    const result = await getDb()
      .collection('counters')
      .findOne({
        _id: "incidents"
      },
      { returnOriginal: false }
    )
    res.json(result);
  }
)

routes.route("/update/status").get(
  async(req, res) => {
    
    let update = {
      status: req.query.status
    }

    if(typeof(req.query.date) !== 'undefined')
      update.resolved = req.query.date
    

    const result = await getDb()
      .collection('incidents')
      .updateOne({
        id: Number.parseInt(req.query.id)
      },
      {
        $set:update
      });
    res.json(result);
  }
)

module.exports = routes;