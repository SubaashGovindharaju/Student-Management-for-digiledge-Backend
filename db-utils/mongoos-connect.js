import mongoose from "mongoose";

import dotenv from 'dotenv';
dotenv.config();

const username = process.env.DB_USERNAME || '';
const password = process.env.DB_PASSWORD || '';
const clusterName=process.env.DB_CLUSTER || '';
const dbName=process.env.DB_NAME || '';
const cloudMongoUrl=`mongodb+srv://${username}:${password}@${clusterName}/${dbName}?retryWrites=true&w=majority`;

const localMongoUrl='mongodb://localhost:27017/student-Nodejs'
const connectToDb = async () => {
    try {
        await mongoose.connect(localMongoUrl);
        console.log("db Connecter successfully");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
export default connectToDb;