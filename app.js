require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const morgan = require('morgan');

const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("ecommerce app");
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

port = process.env.PORT || 5000;
const starter = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("Database connected!!!");
        app.listen(port, () => {
            console.log(`server is running on port ${port}`);
        });
    } catch (error) {
        console.error(error.message);
    };
};

starter();