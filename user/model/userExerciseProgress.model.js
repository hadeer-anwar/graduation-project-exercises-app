import mongoose from 'mongoose';

const DetailedRepSchema = new mongoose.Schema({
  rep_num: Number,
  status: String,
  issues: [String],
}, { _id: false });

const DetailedSegmentSchema = new mongoose.Schema({
  segment_num: Number,
  duration: Number,
  start_time: Number,
  end_time: Number,
  status: String,
  issues: [String],
}, { _id: false });

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
    required: function () {
      return this.calcMethod === "reps";
    },
  },
  incorrectReps: {
    type: Number,
    required: function () {
      return this.calcMethod === "reps";
    },
  },
  timeInSeconds: {
    type: Number,
    required: function () {
      return this.calcMethod === "time";
    },
    default: null,
  },

  // 🆕 Common/Metadata fields
  connectionId: String,
  sessionStartTime: Number,
  sessionEndTime: Number,
  exerciseName: String,
  exerciseMode: String,
  goalReached: {
    type: Boolean,
    default: null,
  },

  // 🆕 Reps mode
  targetReps: Number,
  totalReps: Number,
  detailedAnalysisReps: {
    type: Map,
    of: DetailedRepSchema,
  },

  // 🆕 Time mode
  targetTime: Number,
  totalTime: Number,
  totalHoldTime: Number,
  totalWrongFormTime: Number,
  detailedAnalysisTime: {
    type: Map,
    of: DetailedSegmentSchema,
  },

}, {
  timestamps: true,
});

const UserExerciseProgress = mongoose.model('UserExerciseProgress', UserExerciseProgressSchema);
export default UserExerciseProgress;