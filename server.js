const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./users.js');
require('dotenv/config');



// This is the connection string for MongoDB. It provides the login credentails and the information necessary to access the database over the internet.
const dbURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0.vwtu7.mongodb.net/?retryWrites=true&w=majority`;

// Connecting to the database using Mongoose. Also starting the server and listening on port 11000.
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb://localhost/pagination');
// This creates a new MongoDB database?
const db = mongoose.connection;
// This method runs only once to setup the MongoDB databse.
db.once('open', async () => {
    if (User.countDocuments().exec() > 0) { return };

    Promise.all([
        User.create({ name: 'User 1' }),
        User.create({ name: 'User 2' }),
        User.create({ name: 'User 3' }),
        User.create({ name: 'User 4' }),
        User.create({ name: 'User 5' }),
        User.create({ name: 'User 6' }),
        User.create({ name: 'User 7' }),
        User.create({ name: 'User 8' }),
        User.create({ name: 'User 9' }),
        User.create({ name: 'User 10' }),
        User.create({ name: 'User 11' }),
        User.create({ name: 'User 12' }),
        User.create({ name: 'User 13' }),
        User.create({ name: 'User 14' }),
        User.create({ name: 'User 15' }),
        User.create({ name: 'User 16' }),
        User.create({ name: 'User 17' }),
        User.create({ name: 'User 18' }),
        User.create({ name: 'User 19' }),
        User.create({ name: 'User 20' }),
        User.create({ name: 'User 21' }),
    ]).then(() => console.log('Added Users'));
});

/**
 * The paginatedResults() method, defined below in this class, is passed to .get().
 * It then returns a function that acts as middleware that in turn returns the
 * list of paginated results.
 */
app.get('/users', paginatedResults(User), (req, res) => {
    res.json(res.paginatedResults);
});

/**
 * Returns a fucntion that acts as middleware and returns a paginated list of data
 * from the list of data (model) passed into this method.
 * @param {*} model A list of data to be paginated.
 * @returns A paginated list of data from 'model'.
 */
function paginatedResults(model) {
    return async (req, res, next) => {
            // These variables are used to capture the values specified in the request "GET http://localhost:3000/users?page=1&limit=5"
        const page = parseInt(req.query.page); // This gets the "page" variable from the request.
        const limit = parseInt(req.query.limit); // This gets the "limit" variable from the request.

        // These two variables are the range of pages that our data set has.
        const startIndex = (page - 1) * limit; // Subtract 1 to start index at zero b/c of zero indexing.
        const endIndex = page * limit;

        // By returning an object containing the results, we are able to add information to the response.
        const results = {};

        /* These two objects contain information about which page is before and
        * after the one the user (client) is currently on. This makes it easy
        * for the client to know which data to request when the "next" and
        * "previous" bttons are clicked.
        * The "if" checks on both of these will prevent a next or previous page
        * from being sent if there isn't one.
        * Checking the .countDocuments() on the model returns the number of 
        * elements in the data set.
        */
        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page -1,
                limit: limit
            };
        }

        try {
            // This returns all of the elements within the specified range from the array.
            // exec() is the "execute" function. It executes the database query.
            /* This query is pulling all of the elements in the database with .find(), then
             * starting at the element specified by startIndex in .skip(), and finally,
             * .exec() executes the query.
             */
            results.results = await model.find().limit(limit).skip(startIndex).exec();
            res.paginatedResults = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    };
};

app.listen(3000);
console.log('Server listening on port 3000');