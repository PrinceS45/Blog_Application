import { Router } from "express";
import multer from "multer";
import path from "path";
import Blog from "../Models/blog.js"; 
import Comment from "../Models/comment.js";

const router = Router() ; 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`)); 
  },
 filename: function (req, file, cb) {
  const fileName = `${Date.now()}-${file.originalname}`; 
  cb(null, fileName);
}
});
const upload = multer({ storage: storage });



router.get('/add-new' , (req , res)=> {
     return res.render('addBlog' , {
        user : req.user ,
     })
}) 
 router.get('/:id' , async(req , res) => {
  const blog =await Blog.findById(req.params.id).populate('createdBy') ; 
   const comments = await Comment.find({blogId : req.params.id}).populate("createdBy") ; 
    
   return res.render('blog' , {
     user : req.user , 
     blog ,
     comments , 
   })
 })

 router.post('/' ,upload.single('coverImage') , async (req, res) =>{
      const {title , body} = req.body ;
    try{
       const blog = await Blog.create({
            body , 
            title , 
            createdBy : req.user._id , 
            coverImageUrl :`/uploads/${req.file.filename}`

      })
       return res.redirect(`/blog/${blog._id}`) ;
    }
    catch(error) {
      return res.render("badRequest" )
    }
 })

 router.post("/comment/:blogId" , async(req , res ) => {
    try {
      await Comment.create({
      content : req.body.content , 
      blogId : req.params.blogId , 
      createdBy : req.user._id , 
        
     }) ; 
    }
     catch (error) {
        console.error("Error creating comment:", error);
    }
      

     return res.redirect(`/blog/${req.params.blogId}`) ;
 })
 

 router.post('/:id/like', async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
  res.redirect(`/blog/${req.params.id}`);
});



export default router ;