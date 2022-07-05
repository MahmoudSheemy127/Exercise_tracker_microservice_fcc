require('dotenv').config();

const mongoose = require('mongoose')


mongoose.connect(process.env.MONGO_URI)

//create user schema
const userSchema = new mongoose.Schema({
    username:String
})

//create exercise schema
const exerciseSchema = new mongoose.Schema({
    userid: String,
    description: String,
    duration: Number,
    date: Date
})

//create user model
const User = mongoose.model('user',userSchema)

//create exercise model
const Exercise = mongoose.model('exercise',exerciseSchema)


//add a User document
const addUser = (data,done) => {
    const user = new User(data)
    user.save((err,data) => {
        if(err)
        {
            console.log(err)
            done(err)
        }
        else{
            console.log(data)
            done(null,data)
        }
    })
}

//add an Exercise document
const addExercise = (data,done) => {
    console.log(data)
    if(data.date == "")
    {
        data.date = new Date().toDateString()
    }
    const exercise = new Exercise(data)
    exercise.save((err,data) => {
        if(err)
        {
            console.log(err)
            done(err)
        }
        else{
            console.log(data)
            done(null,data)
        }
    })
}


//fetch a user document by it's id
const findUserById = (data,done) => {
    User.findById(data,(err,data) => {
        if(err)
        {
            console.log(err)
            done(err)
        }
        else{
            console.log(data)
            done(null,data)
        }
    })
}

//fetch all users from database
const findUsers = (done) => {
    User.find({},(err,data) => {
        if(err)
        {
            done(err)
        }
        else
        {
            done(null,data)
        }
    })
}

//fetch all exercises of a specific user from database
const findExerciseByUserId = (query,done) => {
    console.log(query)
    if(query.from)
    {
        console.log("Waaw")
    }
    Exercise.find({
        userid:query.id,
        date:{
            $gte:(query.from || new Date(-8640000000000000)),
            $lte:(query.to || new Date(8640000000000000))
        }
    }).limit(query.limit).select('-userid').select('-_id').select('-__v').exec((err,data) => {
        if(err)
        {
            console.log(err)
            done(err)
        }
        else
        {
            console.log("FRom here ",data)
            done(null,data)
        }
    })
}


module.exports = {
    addUser,
    findUserById,
    addExercise,
    findExerciseByUserId,
    findUsers
}