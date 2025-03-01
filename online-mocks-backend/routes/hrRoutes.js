const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HR = require("../models/HR");
const Feedback = require("../models/Feedback");
const { checkRole, auth } = require("../middleware/auth");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hr = await HR.findOne({ username });

    if (!hr) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, hr.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: hr._id, role: "hr" }, process.env.JWT_SECRET);

    res.json({ token, role: "hr" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add feedback route
router.post("/feedback", auth, checkRole(["hr"]), async (req, res) => {
  try {
    const {
      companyName,
      hrName,
      technicalKnowledge,
      serviceAndCoordination,
      communicationSkills,
      futureParticipation,
      punctualityAndInterest,
      suggestions,
      issuesFaced,
      improvementSuggestions,
    } = req.body;

    // Create new feedback
    const feedback = new Feedback({
      companyName,
      hrName,
      technicalKnowledge: Number(technicalKnowledge),
      serviceAndCoordination: Number(serviceAndCoordination),
      communicationSkills: Number(communicationSkills),
      futureParticipation: Number(futureParticipation),
      punctualityAndInterest: Number(punctualityAndInterest),
      suggestions,
      issuesFaced,
      improvementSuggestions,
    });

    await feedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    res.status(500).json({
      message: "Error submitting feedback",
      error: error.message,
    });
  }
});

// Get all feedback (for admin purposes)
router.get("/feedback", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ submittedAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

module.exports = router;
