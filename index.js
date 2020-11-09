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

// Routes
// Info route to display the number of persons in the phonebook
app.get('/info', (request, response, next) => {
    Person.find({})
        .then(persons => {
            const phonebook_length = `<p>Phonebook has info for ${persons.length} people</p>`
            const now = `<p>${Date()}</p>`
            response.send(phonebook_length + now)
        })
        .catch(error => next(error))
})

// Return a list of all persons objects in the phonebook
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

// Return a specfic person object from the phonebook
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Remove a specific person object from the phonebook
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// Add a new person object to the phonebook
app.post('/api/persons', (request, response, next) => {
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
    person.save()
        .then(savedPerson => {
            return response.json(savedPerson)
        })
        .catch(error => next(error))
})

// Update an existing person in the phonebook
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

// Catch all route for endpoints not matching any above
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

// A generic error handler
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    console.log('error name', error.name)

    // MongoDB CastError
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' })
    }

    next(error)
}
app.use(errorHandler)

// Start the node server
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})