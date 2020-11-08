const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex: true })
    .then(result => {
        console.log('connected to mongodb')
    })
    .catch((error) => {
        console.log('error connecting to mongodb: ', error.message)
    })

// A mongo person schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// Rename _id to id and remove __v from the mongo model
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Export the mongo Person model
module.exports = mongoose.model('Person', personSchema)