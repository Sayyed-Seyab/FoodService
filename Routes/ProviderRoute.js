 import express from "express";
import { acceptRequest, getAvailableRequests, ProviderAssignedRequest, ProviderSignUp } from "../Controllers/ProviderController.js";






 const ProviderRoute = express.Router();

 ProviderRoute.post("/signup", ProviderSignUp);
 ProviderRoute.post("/available-requests", getAvailableRequests);
 ProviderRoute.post("/accept-request/:id", acceptRequest)
 ProviderRoute.get("/assigned-requests/:id", ProviderAssignedRequest);
 export default ProviderRoute;