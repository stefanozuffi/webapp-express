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
    
    const sql = 'SELECT * FROM movies WHERE id = ?'

    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(400).json({
            success: false,
            message: 'impossible to fetch table',
            err
        })
        res.status(200).json(result[0]) 
    })

}

module.exports = { index, show }