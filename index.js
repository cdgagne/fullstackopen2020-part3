require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// Enable the static middleware to serve a React front-end
app.use(express.static('build'))

// Enable the JSON middleware to automatically parse JSON requests
app.use(express.json())

// Enable CORS middleware for XHR
app.use(cors())

// Use Morgan for logging requests and define a custom token to allow logging of the request body
morgan.token('req-body', (req, res) =>
    JSON.stringify(req.body)
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.get('/info', (request, response) => {
    Person.find({})
        .then(persons => {
            const phonebook_length = `<p>Phonebook has info for ${persons.length} people</p>`
            const now = `<p>${Date()}</p>`
            response.send(phonebook_length + now)
        })
})

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    Person.findById(id)
        .then(person => {
            response.json(person)
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'Key Missing: name'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'Key Missing: number'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        return response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})