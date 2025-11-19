const axios = require('axios');
const { connection } = require('../database/configuration');

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'gemma3:1b';

async function chat(req, res) {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Message is required'
        });
    }

    try {
        // Query SEMPLICE per ottenere i film
        const getMovies = () => {
            return new Promise((resolve, reject) => {
                const sql = `SELECT title, director, genre, release_year, 
                            AVG(reviews.vote) AS avg_rating
                            FROM movies
                            LEFT JOIN reviews ON movies.id = reviews.movie_id
                            GROUP BY movies.id`;
                
                connection.query(sql, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
        };

        // Ottieni i film
        const movies = await getMovies();
        
        // Crea un elenco SEMPLICE
        const moviesList = movies.map(m => 
            `"${m.title}" (${m.release_year}) by ${m.director}, ${m.genre}, Rating: ${m.avg_rating ? `${Math.floor(m.avg_rating)}/5` : 'N/A'}, abstract: ${m.abstract}`
        ).join('\n');

        // Build context from conversation history
        let prompt = `You are a helpful AI assistant for CinePedia movie database. 

OUR MOVIES (IMPORTANT: it must be clear which movies are here and which are not):
${moviesList}

You help users with our movie catalogue. *** IMPORTANT: Only recommend movies from the list above, after 'OUR MOVIES:'. If you don not find anything relevant in the database movie_db,
you can give other suggestions, but for EVERY SUCH MOVIE you MUST esplicitly state that the movie is not in the database.  ***. Keep answers short.

User: ${message}
Assistant:`;

        // Add conversation history for context (last 5 messages)
        if (conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-5);
            const historyText = recentHistory
                .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
                .join('\n');
            
            prompt = `You are a helpful AI assistant for CinePedia movie database.

OUR MOVIES:
${moviesList}

Previous conversation:
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