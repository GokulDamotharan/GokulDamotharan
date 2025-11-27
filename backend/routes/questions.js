const router = require("express").Router();
let Question = require("../models/question.model");

// Mock AI Classification Function
const classifyQuestion = (content) => {
  const lowerContent = content.toLowerCase();
  const spamKeywords = ["spam", "fake", "money", "win", "prize", "casino", "lottery", "click here", "buy now"];
  const medicalKeywords = ["pain", "ache", "fever", "doctor", "health", "sick", "medicine", "symptom", "treatment", "diagnosis"];

  if (spamKeywords.some(keyword => lowerContent.includes(keyword))) {
    return { status: "rejected", classification: "Spam/Inappropriate" };
  }
  
  if (medicalKeywords.some(keyword => lowerContent.includes(keyword))) {
    return { status: "pending", classification: "Medical Inquiry" };
  }
  
  // Default to pending for general questions
  return { status: "pending", classification: "General Health Question" };
};

// Ask a question
router.route("/ask").post(async (req, res) => {
  const { patientId, content } = req.body;

  // Mock AI Classification
  const { status, classification } = classifyQuestion(content);

  const newQuestion = new Question({
    patientId,
    content,
    status,
    aiClassification: classification,
  });

  newQuestion
    .save()
    .then(() => res.json({ message: "Question submitted!", classification, status }))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Get questions by patient
router.route("/patient/:id").get((req, res) => {
  Question.find({ patientId: req.params.id })
    .sort({ date: -1 })
    .then((questions) => res.json(questions))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Get all pending questions (for doctors)
router.route("/pending").get((req, res) => {
    Question.find({ status: "pending" })
      .sort({ date: 1 })
      .then((questions) => res.json(questions))
      .catch((err) => res.status(400).json("Error: " + err));
});

// Answer a question (for doctors)
router.route("/answer/:id").post((req, res) => {
    const { answer, doctorName } = req.body;

    Question.findById(req.params.id)
        .then(question => {
            question.answer = answer;
            question.status = "approved"; // Answering implies approval
            question.doctorName = doctorName; // Assuming we add this field or just track it
            
            question.save()
                .then(() => res.json("Question answered!"))
                .catch(err => res.status(400).json("Error: " + err));
        })
        .catch(err => res.status(400).json("Error: " + err));
});

// Reject a question
router.route("/reject/:id").post((req, res) => {
    Question.findById(req.params.id)
        .then(question => {
            question.status = "rejected";
            
            question.save()
                .then(() => res.json("Question rejected!"))
                .catch(err => res.status(400).json("Error: " + err));
        })
        .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
