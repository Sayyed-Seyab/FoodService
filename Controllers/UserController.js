
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import UserSchema from "../Models/UserSchema.js"
import RequestSchema from "../Models/RequestSchema.js";

dotenv.config();
 
// Function to create a token
const createToken = (id, name, role, email) => {
    return jwt.sign({ id, name, role, email }, process.env.JWT_SECRET);
}


const UserSignUp = async (req, res)=>{
    try{
      console.log(req.body)
        const {email, password, name, role} = req.body;
       
        if(!email || !password || !name || !role){
            return res.status(400).json({message: "Please provide eamil, password, role and name"})
        }

        // Check if user already exist
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

        const User = new UserSchema({
            name, 
            email,
             password: hashedPassword,
            role,
            // plan: 'paid',
            // isSubscribed: true
        })
        const savedUser = await User.save();
        return res.json({
             success: true,
             message: 'User created successfully',
              user: {
    id: savedUser._id,
    name: savedUser.name,
    email: savedUser.email,
    role: savedUser.role
  }
             });
        
    }catch(err){
        console.log(err);
        return res.json({ success: false, message: 'Error occurred' });
    }
} 

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // ✅ Find user
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // ✅ Create token
    const token = createToken(
      user._id,
      user.name,
      user.role,
      user.email
    );

    // ✅ Set cookie (fix for localhost)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // ❗ true only in production (HTTPS)
      sameSite: "lax",
      maxAge: 36000000
    });

    // ✅ Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



 const createRequest = async (req, res) => {
  try {
    const {title, description, lat, lng } = req.body;
    const _id = req.params.id;
    console.log(_id)
    const user = await UserSchema.findOne({_id: _id});
    const totalRequests = await RequestSchema.countDocuments({customer: _id});

    if(!user || user.role !== 'user'){
        return res.status(401).json({
            succuss: false,
            message: "Unauthorized"
        })
    }

    if(user.plan === 'free' && user.freeRequestsCreated >= 3){
        return res.status(403).json({
            success:false,
            message: "Free plan limit reached, please upgrade to create more requests"
        })
    }

    
    // validation
    if (!title || !description || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Title, description and location are required"
      });
    }

    const newRequest = await RequestSchema.create({
      title,
      description,
      customer: _id, // from JWT middleware
      freeRequestCreated: totalRequests,
       // ✅ FIXED LOCATION
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
   });

    return res.json({
      success: true,
      data: newRequest,
       message: "Request created successfully"
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error creating request"
    });
  }
};


const getUserRequests = async (req, res) => {
  try {
     const _id = req.params.id;
    const requests = await RequestSchema.find({customer:_id})
    return res.json({
      success: true,
      data: requests
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error fetching requests"
    });
  }
};





export {
    UserSignUp,
    Login,
    getUserRequests,
    createRequest,
   
}