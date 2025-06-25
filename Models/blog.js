import mongoose from "mongoose";
import { type } from "os";
const blogSchema =  new mongoose.Schema ({
    title : {
        type : String , 
        required : true , 
    } , 
    body : {
        type : String , 
        required : true , 
    } , 
    likes : {
        type : Number ,
        default:0 , 
    } , 
    coverImageUrl : {
        type : String , 
        required : false ,
    } , 
    createdBy : {
        type : mongoose.Schema.Types.ObjectId , 
        ref :'User' ,
    } , 
} ,     {timestamps : true} , 
)


const Blog = mongoose.model("Blog" , blogSchema) ; 

export default Blog ;