import { Request, Response } from "express";
import {
  getUserByEmail,
  createUser,
  getUserByPhoneNumber,
  getUserByUsername,
} from "./user.model";
import { authentication, random } from "../../helpers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "himeshRashmiya"; // Use your secret key for JWT

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    }
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.status(400).json({
        message: "User with this email does not exist",
      });
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (expectedHash !== user.authentication.password) {
      return res.status(403).json({
        message: "Invalid password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" } // Set token expiration as needed
    );
    res.cookie("VERTICAL-AUTH", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true only in production
      sameSite: "lax", // Can use 'strict' or 'lax', depending on your requirements
    });

    // Send token to client
    res.status(200).json({
      message: "Login successful",
      token, // Send the token to the client
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, fullName, password } = req.body;

    // Validate required fields
    if (!username || !email || !fullName || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const existingUserEmail = await getUserByEmail(email);
    if (existingUserEmail) {
      return res
        .status(400)
        .json({
          message: "email already exists",
        })
        .end();
    }

    const existingUserUsername = await getUserByUsername(username);
    if (existingUserUsername) {
      return res
        .status(400)
        .json({
          message: "username  already exists",
        })
        .end();
    }

    // const existingUserPhoneNumber = await getUserByPhoneNumber(phoneNumber);
    // if (existingUserPhoneNumber) {
    //   return res
    //     .status(400)
    //     .json({
    //       message: "phone number  already exists",
    //     })
    //     .end();
    // }

    // Create salt and hash password
    const salt = random();
    // Create new user
    const newUser = await createUser({
      username,
      email,
      fullName,
      authentication: {
        password: authentication(salt, password),
        salt: salt,
      },
    });
    return res.status(200).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (Error) {
    console.log(Error);
  }
};
