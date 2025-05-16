import mongoose from 'mongoose';

const UserExerciseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  calcMethod: {
    type: String,
    enum: ["reps", "time"],
    required: true,
  },
  correctReps: {
    type: Number,
    required: function() {
      return this.calcMethod === "reps";
    },
  },
  incorrectReps: {
    type: Number,
    required: function() {
      return this.calcMethod === "reps";
    },
  },
  timeInSeconds: {
    type: Number,
    required: function() {
      return this.calcMethod === "time";
    },
    default: null,
  },
}, {
  timestamps: true,
});

const UserExerciseProgress = mongoose.model('UserExerciseProgress', UserExerciseProgressSchema);
export default UserExerciseProgress;
