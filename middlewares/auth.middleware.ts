import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  if(req.headers.authorization) {// vì trg Authorization: Bearer <token>
    const token = req.headers.authorization.split(" ")[1]; // để tách ra lấy token
    
    const user = await User.findOne({
      token: token,
      deleted: false
    }).select("-password");

    if(user) {
      req["tokenVerify"] = user.token;
    }
    console.log("chạy vào request Authen")
  }
  
  next();
}