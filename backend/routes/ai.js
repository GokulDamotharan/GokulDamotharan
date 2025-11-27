const router = require("express").Router();

// Mock AI Chat Function
const getMockAIResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Greetings
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return "Hi there! I'm your AI Health Assistant. How can I help you today? Feel free to ask about healthy habits, diet, exercise, sleep, or general health questions.";
  }
  
  // Weight Management
  if (lowerMessage.includes("weight") || lowerMessage.includes("lose weight") || lowerMessage.includes("reduce weight") || lowerMessage.includes("fat")) {
    return "For healthy weight management:\n• Eat a balanced diet with plenty of vegetables and lean proteins\n• Stay hydrated (8 glasses of water daily)\n• Exercise regularly (30 mins/day)\n• Get 7-9 hours of sleep\n• Avoid processed foods and sugary drinks\n\nConsult a doctor for a personalized weight loss plan!";
  }
  
  // Pain & Symptoms
  if (lowerMessage.includes("headache") || lowerMessage.includes("pain") || lowerMessage.includes("ache")) {
    return "I'm sorry to hear you're experiencing pain. For persistent headaches or pain:\n• Stay hydrated\n• Get adequate rest\n• Avoid stress\n• Consider over-the-counter pain relief\n\nIf pain persists, please consult with a doctor. Would you like to book an appointment?";
  }
  
  // Diet & Nutrition
  if (lowerMessage.includes("diet") || lowerMessage.includes("food") || lowerMessage.includes("nutrition") || lowerMessage.includes("eat")) {
    return "A balanced diet is key to good health! Here are some tips:\n• Eat plenty of fruits and vegetables (5 servings/day)\n• Choose whole grains over refined carbs\n• Include lean proteins (fish, chicken, beans)\n• Limit sugar and processed foods\n• Stay hydrated with water\n\nWould you like specific dietary advice from our nutritionists?";
  }
  
  // Exercise & Fitness
  if (lowerMessage.includes("exercise") || lowerMessage.includes("workout") || lowerMessage.includes("fitness") || lowerMessage.includes("gym")) {
    return "Regular exercise is great for your health! Recommendations:\n• 150 minutes of moderate activity per week\n• Mix cardio and strength training\n• Start slow and gradually increase intensity\n• Warm up before and cool down after\n• Stay consistent!\n\nAlways consult your doctor before starting a new exercise routine.";
  }
  
  // Sleep
  if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia") || lowerMessage.includes("tired")) {
    return "Good sleep is essential for health! Tips for better sleep:\n• Aim for 7-9 hours per night\n• Maintain a consistent sleep schedule\n• Create a relaxing bedtime routine\n• Avoid screens 1 hour before bed\n• Keep your bedroom cool and dark\n\nIf sleep issues persist, consult a doctor.";
  }
  
  // Stress & Mental Health
  if (lowerMessage.includes("stress") || lowerMessage.includes("anxiety") || lowerMessage.includes("mental") || lowerMessage.includes("depression")) {
    return "Mental health is just as important as physical health. Here are some tips:\n• Practice deep breathing or meditation\n• Exercise regularly\n• Talk to someone you trust\n• Maintain a healthy routine\n• Seek professional help if needed\n\nWould you like to speak with one of our mental health professionals?";
  }
  
  // Appointments
  if (lowerMessage.includes("appointment") || lowerMessage.includes("book") || lowerMessage.includes("schedule") || lowerMessage.includes("doctor")) {
    return "I can help you with that! To book an appointment:\n1. Go to 'Find Doctors' in your dashboard\n2. Select a doctor and specialty\n3. Choose a date and time slot\n4. Confirm your booking\n\nWould you like me to guide you through the process?";
  }
  
  // Fever & Cold
  if (lowerMessage.includes("fever") || lowerMessage.includes("cold") || lowerMessage.includes("cough") || lowerMessage.includes("flu")) {
    return "For fever and cold symptoms:\n• Rest and stay hydrated\n• Take over-the-counter medications if needed\n• Monitor your temperature\n• Isolate to prevent spreading\n\nSee a doctor if:\n• Fever above 103°F (39.4°C)\n• Symptoms last more than 3 days\n• Difficulty breathing\n\nWould you like to consult a doctor?";
  }
  
  // Diabetes
  if (lowerMessage.includes("diabetes") || lowerMessage.includes("sugar") || lowerMessage.includes("blood sugar")) {
    return "Managing diabetes requires:\n• Regular blood sugar monitoring\n• Healthy diet (low sugar, high fiber)\n• Regular exercise\n• Medication as prescribed\n• Regular check-ups\n\nPlease consult with our endocrinologist for personalized advice.";
  }
  
  // Default fallback
  return "I'm here to help with general health questions! I can provide information about:\n• Diet & Nutrition\n• Exercise & Fitness\n• Sleep & Rest\n• Weight Management\n• Common Symptoms\n• Booking Appointments\n\nWhat would you like to know more about?";
};

router.route("/chat").post(async (req, res) => {
  const { message } = req.body;

  try {
    // Simulate a slight delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const reply = getMockAIResponse(message);
    res.json({ reply });
  } catch (error) {
    console.error("Mock AI Error:", error);
    res.status(500).json("Error processing AI request");
  }
});

module.exports = router;
