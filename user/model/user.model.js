import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    passwordChangedAt: { type: Date },
    resetCode: { type: String },
    resetCodeExpiry: { type: Date },
    googleId: { type: String },
    profilePic: { type: String, default: null },
    age: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    fitnessGoal: {
      type: String,
      enum: ["lose weight", "build muscle", "maintain fitness", ""],
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "active", "highly active", ""],
    },
    gender: {
      type: String,
      enum: ["male","female"]
    },
    points: { type: Number, min: 0, default: 0 },

    role: { type: String, enum: ["user", "admin"], default: "user" },
     // Add these new fields for sharing functionality
     sharedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }],
    
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }],

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  
  { timestamps: true } 
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
