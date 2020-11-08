const mongoose = require('mongoose')

// Print usage
const usage = () => {
    console.log('Invalid arguments. Usage:')
    console.log('List phonebook entries:')
    console.log(`node mongo.js <password>`)
    console.log('Add phonebook entry:')
    console.log(`node mongo.js <password> <name> <number>`)
}

// A mongo person schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// A mongo person model
const Person = mongoose.model('Person', personSchema)

// List all entries in the phonebook
const listPhonebook = () => {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

// Add an entry (name and number) to the phonebook
const addToPhonebook = (name, number) => {
    const person = new Person({
        name: name,
        number: number 
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

// Main
if (process.argv.length < 3) {
    usage()
    process.exit(1)
}

const password = process.argv[2]
const dbname = 'persons'
const url = `mongodb+srv://mongodb:${password}@cluster0.vq02r.mongodb.net/${dbname}?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex: true })

if (process.argv.length === 3) {
    listPhonebook()

} else if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    addToPhonebook(name, number)

} else {
    usage()
    process.exit(1)
}