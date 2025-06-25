import JWT from "jsonwebtoken" ; 

const secret = "superMan@123" ; 

function createToken(user) {
    const payload = {
        _id : user.id , 
        email : user.email , 
        profileImageUrl : user.profileImageUrl , 
        role : user.role , 

    }; 

    const token = JWT.sign(payload , secret) ; 
    return token ; 
}

function validateToken(token) {
    const payload = JWT.verify(token , secret) ; 

    return payload  ; 

}

export {
    validateToken , 
    createToken ,
}

