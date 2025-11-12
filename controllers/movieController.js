const { connection } = require("../database/configuration")

function index(req, res) {
    const sql = `SELECT  movies.*, AVG(reviews.vote) AS 'avg_rating' FROM movies
                JOIN reviews ON movies.id = reviews.movie_id
                GROUP BY reviews.movie_id`
    connection.query(sql, (err, result) => {
        if (err) return res.status(400).json({
            success: false,
            message: 'impossible to fetch table',
            err
        })
        res.status(200).json(result)
    })
}


function show(req, res) {
    const { id } = req.params
    
    const sql = `SELECT  movies.*, AVG(reviews.vote) AS 'avg_rating' FROM movies
                JOIN reviews ON movies.id = reviews.movie_id
                WHERE movies.id = ?
                GROUP BY reviews.movie_id`

    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(400).json({
            success: false,
            message: 'impossible to fetch movies table',
            err
        })

        if (result.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }


        const reviews_sql = 'SELECT * FROM reviews WHERE movie_id = ?'
        connection.query(reviews_sql, [id], (rev_err, rev_res) => {
            if (rev_err) return res.status(400).json({
                success: false,
                message: 'impossible to fetch reviews table', 
                err 
            }) 

            const thisMovie = {...result[0], reviews: rev_res} 
            res.status(200).json(thisMovie) 
        }) 
        
    })

}

function storeReview(req, res) {

    const { name, text, vote } = req.body
    const movie_id = req.params.id

    //Error Handling
    if (!name || !vote) return res.status(400).json({message: 'BAD REQUEST: field "name" or "vote" are empty'})
    if (name.length <= 2 || parseInt(vote) === 0) return res.status(400).json({
        message: 'name must be longer than three characters and vote greater than zero'})
    
    //Query
    const sql = 'INSERT INTO reviews (movie_id, name, text, vote) VALUES (?, ?, ?, ?)'   
    connection.query(sql, [movie_id, name, text, vote], (err, result) => {
        if (err) return res.status(400).json({
            success: false,
            message: 'impossible to add review to', 
            err 
        })
        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            id: result.insertId
        })
    }) 


    

}

module.exports = { 
    index,
    show, 
    storeReview }