import mongoose from "mongoose";// nhung module của mongoose vào


export const connect=(): void =>{
    mongoose.connect(process.env.MONGO_URL) // liên kết với cơ sở dữ liệu MongooseDBcompass
    .then(()=> console.log("connected with database!"));  // test xem connect chưa
    // .then(() => console.log(mongoose.Schema));
};///