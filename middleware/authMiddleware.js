const jwt = require("jsonwebtoken");
const authMiddleware = (req,res,next)=> {
const authHeader = req.headers.authorization;
if(!authHeader || !authHeader.startsWith("Bearer"))
{
    console.log("No token found or malformed");
    return res.status(401).json({ message: "No token, authorization denied"});
}
const token = authHeader.split(" ")[1];
console.log("Token extracted:", token);
try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    console.log("Decoded token:",decoded);
    req.userId = decoded.userId;
    next();
}
catch(err)
{
    console.log("JWT verify error:",err.message);
    return res.status(401).json({ message:"Token is not valid"});
}
};
module.exports = authMiddleware;
