 import express from "express";
import { createRequest, Login, UserSignUp, getUserRequests } from "../Controllers/UserController.js";





 const UserRouter = express.Router();

 UserRouter.post("/signup", UserSignUp);
 UserRouter.post("/login",Login);
  UserRouter.post("/request/:id",createRequest);
UserRouter.get("/user-requests/:id", getUserRequests)
 export default UserRouter;