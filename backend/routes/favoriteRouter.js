const express = require('express');

const bodyParser = require('body-parser');
const favoriteRouter = express.Router();

const cors = require('./cors')

const Favorite = require('../models/favorite');
const Dishes = require('../models/dishes')

const authenticate = require('../authenticate');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite == null) {
                    favorite = new Favorite({ user: req.user._id, dishes: [] });
                }
                if (req.body.dishes.length == 0) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ err: "bad request, no dish ID's sent" });
                } else {
                    req.body.dishes.forEach((dish, index) => {
                        if (favorite.dishes.indexOf(dish._id) === -1) {
                            Dishes.findById(dish._id)
                                .then((foundDish) => {
                                    if (foundDish) {
                                        favorite.dishes.push(dish);
                                    }
                                    if (index == req.body.dishes.length - 1) {
                                        favorite.save()
                                        .then((favorite) => {
                                            Favorite.findById(favorite._id)
                                                .populate('user')
                                                .populate('dishes')
                                                .then((favorite) => {
                                                    res.statusCode = 200;
                                                    res.setHeader('Content-Type', 'application/json');
                                                    res.json(favorite);
                                                }, (err) => next(err));
                                        }, (err) => next(err));
                                    }
                                })
                        }

                    });
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndRemove({ user: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on');
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({user:req.user._id})
        .then((favorites) => {
            if(!favorites){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json')
                return res.json({'exists':false, favorites: favorites});
            } else {
                if(favorites.dishes.indexOf(req.params.dishId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json')
                    return res.json({'exists':false, favorites: favorites}); 
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json')
                    return res.json({'exists':true, favorites: favorites});
                }
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite == null) {
                    favorite = new Favorite({ user: req.user._id, dishes: [] });
                }
                Dishes.findById(req.params.dishId)
                    .then((dish) => {
                        if (dish) {
                            if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                                favorite.dishes.push(req.params.dishId);
                                favorite.save()
                                .then((favorite) => {
                                    Favorite.findById(favorite._id)
                                        .populate('user')
                                        .populate('dishes')
                                        .then((favorite) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(favorite);
                                        }, (err) => next(err));
                                }, (err) => next(err));
                            } else {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }
                        } else {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ err: "dish does not exist" });
                        }
                    });

            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite != null) {

                    if (favorite.dishes.indexOf(req.params.dishId) !== -1) {
                        favorite.dishes.splice(found, 1);
                        favorite.save()
                        .then((favorite) => {
                            Favorite.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                }, (err) => next(err));
                        }, (err) => next(err));
                    } else {
                        err = new Error('Dish for deletion not found on POST favorite ');
                        err.status = 403;
                        return next(err);
                    }
                } else {
                    err = new Error('Favorite dishes not found');
                    err.status = 403;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('operation PUT not supported');
    });


module.exports = favoriteRouter;


