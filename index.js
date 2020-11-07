const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

// Enable the JSON middleware to automatically parse JSON requests
app.use(express.json())

// Enable CORS middleware for XHR
app.use(cors())

// Use Morgan for logging requests and define a custom token to allow logging of the request body
morgan.token('req-body', (req, res) =>
    JSON.stringify(req.body)
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-643122"
    }
]

app.get('/info', (request, response) => {
    const phonebook_length = `<p>Phonebook has info for ${persons.length} people</p>`
    const now = `<p>${Date()}</p>`
    response.send(phonebook_length + now)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
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

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: `${body.name} already exists in phonebook`
        })
    }
    const person = {
        id: Math.floor(Math.random() * Math.floor(32768)),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    return response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})