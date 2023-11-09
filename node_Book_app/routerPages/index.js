const express = require('express');
const router = express.Router();
const userControllers = require('../Controllers/UserControllers')
const { check, param, body } = require('express-validator');

router.post('/api/books/CreateOrBooksDetails', [
    // Add validation rules here
    check('title').notEmpty().withMessage('Title is required'),
    check('author').notEmpty().withMessage('Author is required'),
    check('summary').notEmpty().withMessage('Summary is required'),
], userControllers.CreateOrBooksDetails);

router.get('/api/books/ListOfBooks', userControllers.ListOfBooks);

router.get('/api/books/specificBooks/:id', [
    // Add validation rules for parameters
    param('id').isMongoId().withMessage('Invalid book ID'), // Ensure it's a valid MongoDB ObjectId
], userControllers.specificBooks);

router.put('/api/books/UpdateSpecificBooks/:id', [
    // Add validation rules for parameters
    param('id').isMongoId().withMessage('Invalid book ID'),
    // Add validation rules for request body
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('summary').notEmpty().withMessage('Summary is required'),
], userControllers.UpdateSpecificBooks);

router.delete('/api/books/DeleteSpecificBooks/:id', [
    // Add validation rules for parameters
    param('id').isMongoId().withMessage('Invalid book ID'),
], userControllers.DeleteSpecificBooks);

module.exports = router;