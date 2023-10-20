import express from 'express';
import dotenv from 'dotenv';    
import cors from 'cors';    
import { databaseConnection } from './db.js';
import { userRouter } from './routers/userroute.js';
import { resetroute } from './routers/fr.js';

dotenv.config();
const app=express();
const PORT=process.env.PORT;

//middleware
app.use(express.json());
app.use(cors());

//dbconnect
databaseConnection();

//routes
app.use('/',userRouter);
app.use('/rp', resetroute)

//listen port
app.listen(PORT,()=>{console.log('Server running in port',PORT);})