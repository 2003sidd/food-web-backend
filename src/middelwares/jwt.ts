import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import IUser from "../interface/UserInterface";


// Middleware to check if the user has the required role(s)
const authorize = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    console.log("token os",token)
    if (!token) {
      return res.status(401).send({ message: "Authentication required" });
    }

    console.log("is valid user")
    try {
      // Verify the token and extract the payload
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      // Check if the user has one of the required roles
    //   if (!roles.includes(decoded.role)) {
    //     return res.status(403).send({ message: "Access forbidden: Insufficient rights" });
    //   }

      // Attach user info to the request object (optional)
      req.user = decoded;
      next(); // Allow access to the route
    } catch (error) {
      return res.status(401).send({ message: "Invalid or expired token" });
    }
  };
};


const generateToken = (userData: IUser) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, 'Sidd', { expiresIn: 120 });
}

const generateRefreshToken = (userData: IUser) => {
    // Generate a new JWT token using user data
    console.log("user", userData)
    return jwt.sign(userData, "Sidd");
}


export { authorize, generateToken, generateRefreshToken }