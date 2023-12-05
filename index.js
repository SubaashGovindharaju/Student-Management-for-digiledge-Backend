import express from 'express';
import cors from 'cors';

import connectToDb from './db-utils/mongoos-connect.js';
import studentRouter from './routes/Student.js';

const app = express();
app.use(cors({ origin: '*' }));
const PORT =process.env.PORT || 8000;
await connectToDb();
app.use(express.json());
// app.use('/api/users',userRouter);
app.use('/api',studentRouter);


app.listen(PORT, () => {
    console.log('started',PORT);
});