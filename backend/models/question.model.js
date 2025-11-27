const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  patientId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  aiClassification: {
    type: String,
    default: "Unclassified",
  },
  answer: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
