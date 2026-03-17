const express = require('express');
const router = express.Router();

const GEMINI_API_KEY = 'AIzaSyAFUTm_89PZ-NgFwn6qS9sKReX6Jlrzs8E';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

router.post('/analyze-recipe', async (req, res) => {
    const { ingredients, instructions } = req.body;

    if (!ingredients || !instructions) {
        return res.status(400).json({ message: 'Ingredients and instructions are required' });
    }

    const prompt = `
        Analyze the following recipe and estimate the calories per serving and the difficulty level.
        
        Ingredients:
        ${ingredients.join(', ')}
        
        Instructions:
        ${instructions.join('\n')}
        
        Return ONLY a JSON object with the following format (no markdown, no extra text):
        {
            "calories": "estimated calories as a number string",
            "difficulty": "Easy" or "Medium" or "Hard"
        }
    `;

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('Gemini API Error:', data.error);
            return res.status(500).json({ message: 'AI service error', error: data.error });
        }

        const text = data.candidates[0].content.parts[0].text;
        
        // Clean up the response to ensure it's valid JSON
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonStr);

        res.json(result);

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ message: 'Failed to analyze recipe' });
    }
});

module.exports = router;
