import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import Challenge from '../../challenge/model/challenge.model.js'
import Workout from "../../workout/model/workout.model.js";


const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, select: false, required: function() { return !this.googleId; } },
        googleId: { type: String },
        profilePic: { type: String, default: null },
        age: { type: Number, min: 0 },
        height: { type: Number, min: 0 }, 
        weight: { type: Number, min: 0 },
        fitnessGoal: {
            type: String,
            enum: ["lose weight", "build muscle", "maintain fitness"],
          },
        activityLevel: {
            type: String,
            enum: ["sedentary", "active", "highly active"],
          },
        points: {type: Number, min: 0, default:0 },
        achievements: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
          ],
       
        workoutHistory: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Workout" },
          ],
    },

    {
        timestamp:true
    }
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword){    
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;