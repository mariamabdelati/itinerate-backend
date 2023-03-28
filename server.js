const mongoose = require('mongoose');
const { app } = require('./index.js');


// Connect to MongoDB database
const initializeDbConnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (error) {
        console.error(error);
    }
}

// Start listening on the specified port and initialize the database connection
app.listen(process.env.PORT, () => {
    initializeDbConnection().then(() => console.log("Database connected successfully"));
    console.log(`Server is running on port ${process.env.PORT}`);
});