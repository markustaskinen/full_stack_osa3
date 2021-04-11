require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Contact = require('./models/contact')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('content', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(function (tokens, req, res) {
//  const test = req.body.name
//  console.log(`test: ${test}`)
  if (req.body.name) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.content(req, res)
  ].join(' ')
  } 

  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
  ].join(' ')
  })
)

let persons = [
    {
      "id": 1,    
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
  ]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
})

app.get('/api/info', (req, res) => {
  const personAmount = persons.length
  const date = new Date()
  res.send(
    `<p>Phonebook has info for ${personAmount} people.</p>
    <p>${date}</p>`
    )
})

/*
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

const generateRandomId = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}
*/

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'content missing' })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact.save().then(savedContact => {
    res.json(savedContact)
  })
})

/*pre MongoDB
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  } else if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: `${body.name} is already in Phonebook`
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateRandomId(1000),
  }

  persons = persons.concat(person)

  response.json(person)
})
*/

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(404).end()
      }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})