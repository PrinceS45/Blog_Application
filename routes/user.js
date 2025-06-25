import {Router} from 'express' ; 
import User from './../Models/user.js';


const router = Router() ; 

router.get('/signin' , (req ,res) => {
    return res.render("signin") ; 

})
router.get('/signup' , (req ,res) => {
    return res.render("signup") ; 

})

router.post('/signin' , async(req , res) =>{
     try {
        const {email , password} = req.body ; 
 
     const token = await User.matchPasswordAndGenerateToken(email , password) ; 
     
     return res.cookie("token" , token ) .redirect("/") ; 
     }
     catch (error) {
        return res.render("signin" , {
            error :"Invalid email or password" ,
        })
    }
    

})
 router.get("/logout" , (req , res) => {
         res.clearCookie('token').redirect("/") ; 
    })


router.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const newUser = await User.create({
            fullname,
            email,
            password
        });

        console.log("User created:", newUser); // Proper console logging

        return res.redirect("/"); // Redirect after successful creation
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


export default router ;