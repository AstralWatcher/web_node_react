const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');
/**
 * Options for storage in mular module
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
/**
 * Options for filter in muler module, meaning what we want to accept on server (file types)
 */
const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can only upload image files'), false)
    }
    cb(null, true)
}
const upload = multer({ storage: storage, fileFilter: imageFileFilter })

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')

    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    /**
     *  upload.single('imageFile') - imageFile name of form field which specifies the file on front-end
     *  after that middleware it is uploaded
     *  */
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
    })

    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('Get Method not allowed on /imageUpload')
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT Method not allowed on /imageUpload')
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE Method not allowed on /imageUpload')
    })


module.exports = uploadRouter;