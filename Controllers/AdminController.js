import UserSchema from "./Models/UserSchema";

const adminSignUp = async (req, res)=>{
    try{
        const {email, password, name} = req.body;
        if(!email || !password || !name){
            return res.status(400).json({message: "Please provide eamil, password and name"})
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

        const Admin = new UserSchema({
            name, 
            email,
            hashedPassword,
            role: 'admin',
            // plan: 'paid',
            // isSubscribed: true
        })
        const savedAdmin = await Admin.save();
        return res.json({
             success: true,
             message: 'Admin created successfully',
              id: savedAdmin._id, 
              Email: savedAdmin.email,
              Name: savedAdmin.name,
              role: savedAdmin.role });
        
    }catch(err){
        console.log(err);
        return res.json({ success: false, message: 'Error occurred' });
    }
} 

export {
    adminSignUp,
}