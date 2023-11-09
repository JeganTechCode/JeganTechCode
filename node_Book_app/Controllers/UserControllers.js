const BooksDetailsSchema = require('../Modals/BookDetailsSchema');

const { validationResult } = require('express-validator');

const CreateOrBooksDetails = async (req, res) => {
    // Validate parameters and request body
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, summary } = req.body;

    // Check for empty spaces in title, author, and summary
    if (title.trim() === '' || author.trim() === '' || summary.trim() === '') {
        return res.status(400).json({ message: 'Title, author, and summary cannot be empty or contain only spaces' });
    }

    try {
        const book = new BooksDetailsSchema({ title, author, summary });
        const bookData = await book.save();
        if (bookData) {
            res.json({ message: 'Book created successfully', Data: bookData });
        } else {
            res.json({ message: 'Failed to add book' });
        }
    } catch (err) {
        res.status(500).json({ message: "Unable to add book", error: err.message });
    }
}


const ListOfBooks = async (req, res) => {
    try {
        const booksList = await BooksDetailsSchema.find({});
        if (booksList) {
            res.json({ message: 'List Of Books', Data: booksList });
        } else {
            res.json({ message: 'Empty...!' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const specificBooks = async (req, res) => {
    // Validate parameters
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const bookId = req.params.id;

    try {
        const SpecificBookID = await BooksDetailsSchema.findById(bookId);

        if (SpecificBookID) {
            res.json(SpecificBookID);
        } else {
            res.json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const UpdateSpecificBooks = async (req, res) => {
    // Validate parameters and request body
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const bookId = req.params.id;
    const { title, author, summary } = req.body;

    // Check for empty spaces in title, author, and summary
    if (title.trim() === '' || author.trim() === '' || summary.trim() === '') {
        return res.status(400).json({ message: 'Title, author, and summary cannot be empty or contain only spaces' });
    }

    try {
        const booksUpdate = {
            title: title.trim(),
            author: author.trim(),
            summary: summary.trim()
        }

        const filter = { _id: bookId };

        const updateBooksDetails = await BooksDetailsSchema.findOneAndUpdate(
            filter,
            booksUpdate,
            { new: true },
        );

        if (updateBooksDetails) {
            res.json({ Message: 'Book Details Updated', Data: updateBooksDetails });
        } else {
            res.json({ message: 'Book not updated' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const DeleteSpecificBooks = async (req, res) => {
    // Validate parameters
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const bookId = req.params.id;
    const filter = { _id: bookId };

    try {
        const deleteBooksDetails = await BooksDetailsSchema.findOneAndDelete(filter);
        if (deleteBooksDetails) {
            res.json({ message: 'Book deleted successfully', Data: deleteBooksDetails });
        } else {
            res.json({ message: 'Book not deleted' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { CreateOrBooksDetails, ListOfBooks, specificBooks, UpdateSpecificBooks, DeleteSpecificBooks };
