import dotenv from 'dotenv';
dotenv.config() ; 
import express from 'express';
import path from 'path';
import UserRoute from "./routes/user.js"
import blogRoute from './routes/blog.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser' ; 
import { checkForAuthenticationCookie } from './middlewares/authentication.js';

import Blog from './Models/blog.js';

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL).then(()=> {
    console.log("MongoDb Connected Successfully") ; 

}
).catch((err) => {
    console.log("MongoDb Connection Failed") ;
    console.log(err) ;
}
) ; 



app.set('view engine' , 'ejs') ; 
app.set('views' , path.resolve("./view")) ;  
app.use(express.urlencoded({extended : true})) ; 
app.use(cookieParser()) ; 
app.use(express.static(path.resolve("./public")))  
app.use(checkForAuthenticationCookie("token")) ; 



app.get('/' ,async  (req , res) => {
    const allBlogs = await Blog.find({}) ; 
    res.render('home' , {
        user : req.user , 
        blogs : allBlogs
    });
});

app.use("/user" , UserRoute) ; 
app.use("/blog" , blogRoute) ; 

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})