const { connection } = require("../database/configuration")

function index(req, res) {
    const sql = 'SELECT * FROM movies'
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
    
    const sql = `SELECT movies.* FROM movies WHERE id = ?`

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

module.exports = { index, show }