const express = require('express');
const Promotion = require('../models/promotion');

const promotionRouter = express.Router();

promotionRouter.route('/:promotionId/comments')
    .get((req, res, next) => {
        Promotion.findById(req.params.promotionId)
            .then(promotion => {
                if (promotion) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promotion.comments);
                } else {
                    err = new Error(`Promotion ${req.params.promotionId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        Promotion.findById(req.params.promotionId)
            .then(promotion => {
                if (promotion) {
                    promotion.comments.push(req.body);
                    promotion.save()
                        .then(promotion => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(promotion);
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error(`Promotion ${req.params.promotionId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /promotions/${req.params.promotionId}/comments`);
    })
    .delete((req, res, next) => {
        Promotion.findById(req.params.promotionId)
            .then(promotion => {
                if (promotion) {
                    for (let i = (promotion.comments.length - 1); i >= 0; i--) {
                        promotion.comments.id(promotion.comments[i]._id).remove();
                    }
                    promotion.save()
                        .then(promotion => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(promotion);
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error(`Promotion ${req.params.promotionId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    });

module.exports = promotionRouter;