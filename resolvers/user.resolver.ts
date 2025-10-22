import md5 from "md5";
import User from "../models/user.model";
import { generateRandomString } from "../helpers/generate.helper";

export const resolversUser = {
  Query: {
    getUser: async (_, args, context) => {
      
      if(context.tokenVerify) {
        const infoUser = await User.findOne({
          token: context.tokenVerify,
          deleted: false
        });
  
        if(!infoUser) {
          return {
            code: 400,
            message: "User không tồn tại!"
          }
        } else {
          return {
            code: 200,
            message: "Thành công!",
            id: infoUser.id,
            fullName: infoUser.fullName,
            email: infoUser.email,
            token: infoUser.token,
          };
        }
      } else {
        return {
          code: 403,
          message: "Không có quyền truy cập!"
        }
      }
    }
  },

  Mutation: {
    registerUser: async (_, args) => {
      const { user } = args;

      const emailExist = await User.findOne({
        email: user.email,
        deleted: false
      });

      if(emailExist) {
        return {
          code: 400,
          message: "Email đã tồn tại!"
        }
      } else {
        user.password = md5(user.password);
        user.token = generateRandomString(30);

        const newUser = new User(user);
        await newUser.save();

        return {
          code: 200,
          message: "Thành công!",
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          token: newUser.token,
        };
      }
    },
    loginUser: async (_, args) => {
      const { user } = args;

      const infoUser = await User.findOne({
        email: user.email,
        deleted: false
      });

      if(!infoUser) {
        return {
          code: 400,
          message: "Email không tồn tại!"
        }
      }

      if(md5(user.password) !== infoUser.password) {
        return {
          code: 400,
          message: "Sai mật khẩu!"
        }
      }

      return {
        code: 200,
        message: "Thành công!",
        id: infoUser.id,
        fullName: infoUser.fullName,
        email: infoUser.email,
        token: infoUser.token,
      };
    }
  }
}