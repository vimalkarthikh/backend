import express from 'express';
import mongoose from 'mongoose';

export function databaseConnection(){
    const params={
        useNewUrlParser:true,useUnifiedTopology:true,
    }

    try {
        mongoose.connect(process.env.DBUrl,params);
        console.log("DB Connected Success");
    } catch (error) {
        console.log('Failed Connect ',error);
    }
}