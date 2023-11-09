const BooksDetailsSchema = require('../Modals/BookDetailsSchema');

const CreateBooksDetails = async (req, res) => {
    const { title, author, summary } = req.body;
    const book = new BooksDetailsSchema({ title, author, summary });

    try {
        const bookData = await book.save();
        if (bookData) {
            res.json({ message: 'Book created successfully', Data: bookData });
        } else {
            res.json({ message: 'Failed to add book'});
        }
      
    } catch (err) {
        res.status(500).json({ message: "Unable to added book", error: err.message });
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
    const bookId = req.params.id;
    const { title, author, summary } = req.body;
    try {
        const booksUpdate = {
            title: title,
            author: author,
            summary: summary
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
            res.json({ message: 'Book not update' });
        }
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
   
}

const DeleteSpecificBooks = async (req, res) => {
    const bookId = req.params.id;
    const filter = { _id: bookId };
    try {
        const deleteBooksDetails = await BooksDetailsSchema.findOneAndDelete(
            filter,
        );
        if (deleteBooksDetails) {
            res.json({ message: 'Book deleted successfully', Data: deleteBooksDetails });
        } else {
            res.json({message: 'Book not delete'})
        }
    } catch (error) {
        res.status(500).json({ error: err.message });
        
    }
   
}
module.exports = { CreateBooksDetails, ListOfBooks, specificBooks, UpdateSpecificBooks, DeleteSpecificBooks };
