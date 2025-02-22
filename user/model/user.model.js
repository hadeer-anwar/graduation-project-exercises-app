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
    points: { type: Number, min: 0, default: 0 },

    achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],

    workingChallenges: [
      {
        challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }, // Fix typo
        streakDays: { type: Number, min: 0, default: 0 }, 
        completedDays: { type: Number, min: 0, default: 0 }, 
        pointsEarned: { type: Number, min: 0, default: 0 }, 
        isCompleted: { type: Boolean, default: false }, 
        lastUpdated: { type: Date }
      },
    ],

    workoutHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workout" }],

    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true } // ✅ Fix `timestamp` typo to `timestamps`
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
