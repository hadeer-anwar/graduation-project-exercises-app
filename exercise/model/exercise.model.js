import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
      trim: true,
    },

    description: {
      type: String,
      required: true, 
      trim: true,
    },

    targetMuscles:[ {
      type: String,
      required: true,
      minlength: 3
    }],
    secondaryMuscles:[ {
      type: String,
      required: true,
      minlength: 3
    }],

    equipment: {
      type: String,
      default: "bodyweight",
    },

    difficulty: {
      type: String,
      default: "beginner",
    },
   
    videoUrl: [{type: String}],
    
    imageUrl: 
      [{type: String}],

    workoutName: {
      type: String,
      required : true
    }  
    
  },
  {
    timestamps: true, 
  }
);

exerciseSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  await mongoose.model("Challenge").deleteMany({ exercise: this._id });
  next();
});


const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
