import mongoose from 'mongoose'
import RequestSchema from '../Models/RequestSchema.js';
const Db = async () => {
  try {
    console.log('Database is connecting...');

    await mongoose.connect("mongodb+srv://admin2:admin2@Cluster0.uaxmezr.mongodb.net/FoodService");

    console.log('Database is connected');

    // ✅ NOW it's safe to access collection
    // const indexes = await RequestSchema.collection.getIndexes();
    // console.log("INDEXES:", indexes);

  } catch (err) {
    console.log('Database connection error:', err);
  }
};

export default Db;