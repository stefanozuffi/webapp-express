const axios = require('axios');

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'gemma3:1b';

async function chat(req, res) {
    const { message, conversationHistory = [] } = req.body;

    const movies = await axios.get()

    if (!message || message.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Message is required'
        });
    }

    try {
        // Build context from conversation history
        let prompt = `You are a helpful AI assistant specialized in movies and cinema. You help users discover movies, provide recommendations, and answer questions about films, directors, actors, and movie-related topics. You must provide short answers and always .

User: ${message}
Assistant:`;

        // Add conversation history for context (last 5 messages)
        if (conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-5);
            const historyText = recentHistory
                .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
                .join('\n');
            
            prompt = `You are a helpful AI assistant specialized in movies and cinema. Previous conversation:
${historyText}

User: ${message}
Assistant:`;
        }

        // Call Ollama API
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL,
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                max_tokens: 500
            }
        });

        const aiReply = response.data.response;

        res.json({
            success: true,
            reply: aiReply,
            model: MODEL
        });

    } catch (error) {
        console.error('Ollama API Error:', error.message);
        
        res.status(500).json({
            success: false,
            error: 'Failed to get response from AI',
            details: error.message
        });
    }
}

module.exports = { chat };