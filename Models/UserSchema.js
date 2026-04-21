import mongoose from 'mongoose'

const UserModel = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
 },
  email: { 
    type: String, 
    required: true, 
    unique: true 
},
  password: { 
    type: String, 
    required: true 
},
  // roles: user, provider, provider_admin, admin
  role: { 
    type: String, 
    enum: ['user', 'provider', 'provider_admin', 'admin'], 
    default: 'user' 
},
  plan: { 
    type: String, 
    enum: ['free', 'paid'], 
    default: 'free' 
},
  isSubscribed: { 
    type: Boolean, 
    default: false 
},
  freeRequestsCreated: { 
    type: Number, 
    default: 0 
},
  // If provider belongs to a manager (provider_admin or admin), store reference
  manager: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
}
}, { timestamps: true });

const UserSchema =  mongoose.model.UserModel || mongoose.model('user', UserModel);
export default UserSchema;