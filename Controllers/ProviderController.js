
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import UserSchema from "../Models/UserSchema.js"
import RequestSchema from "../Models/RequestSchema.js";

const ProviderSignUp = async (req, res)=>{
    try{
        const { email, password, name, role } = req.body;
        if(!email || !password || !name || !role){
            return res.status(400).json({ success: false, message: "Please provide email, password, name and role" });
        }

        const allowedRoles = ["user", "provider", "provider_admin", "admin"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        // Check if user already exists
        const exist = await UserSchema.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: 'User already exists, plase login' });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const Provider = new UserSchema({
            name,
            email,
            password: hashedPassword,
            role,
        });
        const savedProvider = await Provider.save();
        return res.json({
             success: true,
             message: 'User created successfully',
              id: savedProvider._id,
              Email: savedProvider.email,
              Name: savedProvider.name,
              role: savedProvider.role });
        
    }catch(err){
        console.log(err);
        return res.json({ success: false, message: 'Error occurred' });
    }
} 

const getAvailableRequests = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.body;

    console.log("BODY:", req.body);

    if (!lat || !lng) {
      const requests = await RequestSchema.find({ status: "pending" });
      return res.json({ success: true, data: requests });
    }

 const requests = await RequestSchema.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
      },
      distanceField: "distance",
      maxDistance: parseFloat(radius) * 1000,
      spherical: true,
      query: { status: "pending" } // ✅ BEST PLACE
    }
  }
]);

    return res.json({
      success: true,
      count: requests.length,
      data: requests
    });

  } catch (err) {
    console.log("ERROR:", err.message);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};


const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    // ✅ provider comes from auth middleware
    const {providerId, status} = req.body;
    if(!providerId || !status){
      return res.status(400).json({
        success: false,
        message: "Provider ID and status are required"
      })
    }

    const request = await RequestSchema.findOne({_id: requestId});

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    // ❌ already taken
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already accepted or completed"
      });
    }

    // ✅ update request
    const updatedRequest = await RequestSchema.findByIdAndUpdate(
      requestId,
      {
        provider: providerId,
        status: "accepted"
      }
    );

    return res.json({
      success: true,
      message: "Request accepted successfully",
      data: updatedRequest
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


const ProviderAssignedRequest = async (req, res) => {
  try {
    
    const {providerId} = req.params.id;

   const assignRequest = await RequestSchema.find({
  provider: providerId
});

    if (!assignRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    return res.json({
      success: true,
      data: assignRequest
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export {
    ProviderSignUp,
    getAvailableRequests,
    acceptRequest,
    ProviderAssignedRequest,
}