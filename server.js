const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

//include mongoose methods
const {addUser, findUserById, addExercise, findExerciseByUserId, findUsers} = require('./myApp.js')


//add middlewares
app.use(express.static('public'))
app.use(express.static('static'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cors())

//handle get requests

//load webpage
app.get('/',(req,res) => {
    res.sendFile(__dirname + "/public/index")
})

//get activity log of users
app.get('/api/users/:id/logs',(req,res) => {
    query = {}
    query["id"] = req.params.id
    query["from"] = req.query.from
    query["to"] = req.query.to
    query["limit"] = req.query.limit
    const userLog = {}
    findUserById(req.params.id,(err,data) => {
        if(err)
        {
            console.log("no logs found")
        }
        else
        {
            console.log(data)
            userLog["_id"] = data._id
            userLog["username"] = data.username
            findExerciseByUserId(query,(err,data) => {
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    userLog["count"] = data.length
                    userLog["log"] = data
                    console.log(data)
                }
                res.json(userLog)
            })
        }
    })

})

//fetch all users
app.get('/api/users',(req,res) => {
    findUsers((err,data) => {
        if(err)
        {
            console.log("no users")
        }
        else
        {
            res.json(data)
        }
    })
})


//handle post requests

//post request to upload user data
app.post('/api/users',(req,res) => {
    console.log(req.body)
    //Post user to MongoDB

    //we use callback fns when dealing with authentication errors
    addUser(req.body, (err,data) => {
        if(err)
        {
            res.send("Invalid operation")
        }
        else
        {
            res.json(data)
        }
    })

})


//post request to upload exercise data
app.post('/api/users/:id/exercises',(req,res) => {
    console.log(req.body)
    //Get user
    findUserById(req.body.userid,(err,data) => {
        if(err)
        {
            res.send("invalid")
        }
        else
        {
            
            addExercise(req.body, (err,exercise_data) => {
                if(err)
                {
                    console.log("Exercise not posted")
                    res.send("Invalid")
                }
                else
                {
                    console.log("Exercise posted")
                    res.json({
                        _id:data._id,
                        username:data.username,
                        date: exercise_data.date,
                        duration: exercise_data.duration,
                        description: exercise_data.description
                    })
                }
            })
        }
    })

})


app.listen(3000,() => {
    console.log("Server is running at 3000")
})