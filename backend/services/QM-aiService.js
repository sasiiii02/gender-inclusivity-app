import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model
const getModel = () => {
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: parseFloat(process.env.GEMINI_TEMPERATURE || "0.7"),
      maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS || "500"),
    },
  });
};

export const generateAnswerExplanation = async ({
  questionText,
  studentAnswer,
  correctAnswer,
  options,
  questionType,
  isCorrect,
}) => {
  try {
    const model = getModel();

    console.log("🤖 Attempting to generate AI explanation...");

    const prompt = constructExplanationPrompt({
      questionText,
      studentAnswer,
      correctAnswer,
      optionsText: options.map((opt) => opt.text).join("\n"),
      questionType,
      isCorrect,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    // Check if explanation looks like AI-generated (not a simple template)
    const isAIGenerated =
      explanation.length > 50 &&
      !explanation.includes("Take a moment to review") &&
      !explanation.includes("Keep up the good work");

    console.log(
      `✅ AI ${isAIGenerated ? "SUCCESS" : "FALLBACK"}:`,
      explanation.substring(0, 100) + "...",
    );

    return {
      success: true,
      explanation,
      source: isAIGenerated ? "ai" : "fallback",
      model: process.env.GEMINI_MODEL,
    };
  } catch (error) {
    console.error("❌ AI API error:", error.message);

    const fallback = getFallbackExplanation(
      isCorrect,
      correctAnswer,
      studentAnswer,
    );
    console.log("⚠️ Using fallback explanation");

    return {
      success: false,
      explanation: fallback,
      source: "fallback",
      error: error.message,
    };
  }
};

/**
 * Generate explanations for ALL questions at once (batch)
 * FIXED VERSION with proper parsing
 */
export const generateBulkExplanations = async (questionsWithAnswers) => {
  try {
    const model = getModel();

    // Create a more structured prompt that asks for JSON format
    const prompt = `
You are a helpful tutor. Please provide brief educational explanations for each of the following ${questionsWithAnswers.length} quiz questions.

Return your response as a valid JSON array where each element is an object with a single field "explanation" containing the explanation for that question.

Example format:
[
  {"explanation": "Explanation for question 1..."},
  {"explanation": "Explanation for question 2..."}
]

Here are the questions:

${questionsWithAnswers
  .map(
    (q, index) => `
Question ${index + 1}: ${q.questionText}
Student's Answer: ${q.studentAnswer}
Correct Answer: ${q.correctAnswer}
Result: ${q.isCorrect ? "CORRECT" : "INCORRECT"}
---`,
  )
  .join("\n")}

Provide helpful, concise explanations (2-3 sentences each). Focus on teaching the concept.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const explanations = JSON.parse(jsonMatch[0]);
      return explanations.map((e) => e.explanation);
    }

    // Fallback: If JSON parsing fails, return a generic explanation
    console.log("Failed to parse AI response as JSON, using fallback");
    return questionsWithAnswers.map((q) =>
      q.isCorrect
        ? `Great job! You correctly answered "${q.correctAnswer}". You've understood this concept well!`
        : `The correct answer is "${q.correctAnswer}". Take a moment to review why this is right.`,
    );
  } catch (error) {
    console.error("Bulk generation error:", error);
    // Return fallback explanations
    return questionsWithAnswers.map((q) =>
      q.isCorrect
        ? `Correct! "${q.correctAnswer}" is right. Keep up the good work!`
        : `The correct answer is "${q.correctAnswer}". Review this concept and try again.`,
    );
  }
};

/**
 * Construct the prompt for the AI
 */
const constructExplanationPrompt = ({
  questionText,
  studentAnswer,
  correctAnswer,
  optionsText,
  questionType,
  isCorrect,
}) => {
  if (isCorrect) {
    return `
You are a helpful tutor. The student answered correctly. Provide encouragement and reinforce why their answer is correct.

**Question**: ${questionText}
**Question Type**: ${questionType}

**All Options**:
${optionsText}

**Student's Answer**: ${studentAnswer} ✓
**Correct Answer**: ${correctAnswer}

Please provide:
1. A brief explanation of why this answer is correct (1-2 sentences)
2. One key concept to remember about this topic

Keep your response friendly, educational, and concise.`;
  } else {
    return `
You are a helpful tutor. The student answered incorrectly. Be kind and explain why they were wrong.

**Question**: ${questionText}
**Question Type**: ${questionType}

**All Options**:
${optionsText}

**Student's Answer**: ${studentAnswer} ✗
**Correct Answer**: ${correctAnswer}

Please provide:
1. Why the student's answer is incorrect (1 sentence)
2. What the correct answer is and why (1-2 sentences)
3. A simple tip to remember this for next time

Keep your response friendly, educational, and concise. Don't discourage the student - focus on learning.`;
  }
};

/**
 * Fallback explanation when API fails
 */
const getFallbackExplanation = (isCorrect, correctAnswer, studentAnswer) => {
  if (isCorrect) {
    return `Great job! "${studentAnswer}" is correct. You've mastered this concept! Keep up the good work.`;
  } else {
    return `The correct answer is "${correctAnswer}". Take a moment to review this concept and understand why this is the right choice. You'll get it next time!`;
  }
};
