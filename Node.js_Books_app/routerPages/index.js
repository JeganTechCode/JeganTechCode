const express = require('express');
const router = express.Router();
const userControllers = require('../Controllers/UserControllers')


router.post('/api/books/addBooks', userControllers.CreateBooksDetails);
router.get('/api/books/ListOfBooks', userControllers.ListOfBooks);
router.get('/api/books/specificBooks/:id', userControllers.specificBooks);
router.put('/api/books/UpdateSpecificBooks/:id', userControllers.UpdateSpecificBooks);
router.delete('/api/books/DeleteSpecificBooks/:id', userControllers.DeleteSpecificBooks);

module.exports = router;