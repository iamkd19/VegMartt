const mongoose=require('mongoose');
const config=require('config');
const db=config.get('mongoURI');

const connectDB=async()=>{
    try{
        mongoose.set('strictQuery',true);
        await mongoose.connect(db,{useNewUrlParser:true, useUnifiedTopology: true,});
        console.log("MongoDB is connected...");
    }
    catch(err){
        console.error(err.message);
        process.exit(1);
    }
};
module.exports=connectDB;

    // {
    //     "mongoURI":
    //     "mongodb+srv://admin_knt:cjAEpUjA5fYrWqiK@vegmart.7mwnczb.mongodb.net/?retryWrites=true&w=majority"
    // }

    // {
    //     "mongoURI": "mongodb://admin:admin@0.0.0.0:27017/vegmart"
    //   }