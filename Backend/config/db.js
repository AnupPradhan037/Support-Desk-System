// const { underline } = require('colors');
// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI);

//         console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
//     } catch (error) {
//         console.error(error);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;



const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MONGO_URI:', process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log('MongoDB connection failed!');
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;