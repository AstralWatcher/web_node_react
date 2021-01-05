const express = require('express');

const bodyParser = require('body-parser');
const commentRouter = express.Router();
const Comments = require('../models/comments');

const cors = require('./cors')
const authenticate = require('../authenticate');

commentRouter.use(bodyParser.json());

commentRouter.route('')

commentRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Comments.find(req.query)
            .populate('author')
            .then((comments) => {
                if (comments != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comments)
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.body != null) {
            req.body.author = req.user._id;
            Comments.create(req.body)
                .then((comment) => {
                    Comments.findById(comment._id)
                        .populate('author')
                        .then((comment) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(comment)
                        });
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            err = new Error('Comment not found in request body')
            err.statusCode = 404;
            return next(err);
        }
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Post not supported on /comments Not supported');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Comments.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


commentRouter.route('/:commentId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Comments.findById(req.params.commentId)
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Post not supported on comments/commentsID Not supported');
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Comments.findById(req.params.commentId)
            .then((comment) => {
                if (comment != null) {
                    if (!comment.author.equals(req.user._id)) {
                        var err = new Error('Not allowed operation, comment not yours!');
                        err.statusCode = 403;
                        next(err);
                    } else {
                        req.body.author = req.user._id;
                        Comments.findByIdAndUpdate(req.params.commentId,{$set:req.body}, {new:true})
                        .then((comment) => {
                            Comments.findById(comment._id)
                            .populate('author')
                            .then((comment) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type','application/json');
                                res.json(comment);
                            });
                        }); 
                    }
                } else {
                    var err = new Error('Dish' + req.params.commentId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Comments.findById(req.params.commentId).then((comment) => {
            if (comment != null) {
                if(comment.author.equals(req.user._id)){
                    Comments.findByIdAndRemove()
                    .then((resp) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resp)
                    }, (err) => next(err)) 
                    .catch( (err) => next(err))
                } else {
                    var err = new Error('Not authorized for comment modification');
                    err.statusCode = 401;
                    return next(err);
                }
            } else {
                var err = new Error('Comment' + req.params.dishId + ' not found');
                err.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err))
            .catch((err) => next(err));
    });

    module.exports = commentRouter;