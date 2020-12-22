// promotions
// promotions/:promoId

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');

const promotionRouter = express.Router();

const Promotions = require('../models/promotions');

promotionRouter.use(bodyParser.json())

const authenticate = require('../authenticate');

promotionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next)=>{
    Promotions.find(req.query).then((promos)=> {
        res.header('Content-Type','application/json');
        res.json(promos)
        res.statusCode = 200;
    }, (err)=> next(err))
    .catch((err) => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.create(req.body)
    .then((promo) => {
        res.header('Content-Type','application/json');
        res.json(promo)
        res.statusCode = 204;
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;
    res.end('Not supported');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.remove({}).then((resp)=> {
        res.statusCode = 200;
        res.json(resp);
        res.header('Content-Type','application/json');
    })
});

promotionRouter.route('/:Id')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next)=>{
    Promotions.findById(req.params.Id)
    .then((promo)=> {
        res.statusCode = 200;
        res.header('Content-Type',"application/json");
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;
    res.end('Post not supported on promotion/:promotionID Not supported');
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.Id, {
        $set: req.body
    }, {new:true})
    .then((promo) => {
        res.statusCode = 200;
        res.header('Content-Type',"application/json");
        res.json(promo);
    })
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.findByIdAndDelete(req.params.Id).then((resp) => {
        res.statusCode = 200;
        res.header('Content-Type',"application/json");
        res.json(resp);
    })
    .catch((err) => next(err));
})

module.exports = promotionRouter;