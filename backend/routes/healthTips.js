const router = require("express").Router();
let HealthTip = require("../models/healthTip.model");

// Get all tips
router.route("/all").get((req, res) => {
  HealthTip.find()
    .sort({ date: -1 })
    .then((tips) => res.json(tips))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Add a new tip
router.route("/add").post((req, res) => {
  const { title, content, doctorId, doctorName } = req.body;

  const newHealthTip = new HealthTip({
    title,
    content,
    doctorId,
    doctorName,
  });

  newHealthTip
    .save()
    .then(() => res.json("Health Tip added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
