require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('request-body', (req) => JSON.stringify(req.body))
morgan.token('id', (req) => req.body.id)

const app = express()
app.use(cors())
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :request-body'
  )
)
app.use(express.json())
app.use(express.static('dist'))

app.get('/', (request, response) =>
  response.send('<h1>Hello these are people</h1>')
)

app.get('/info', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      return response.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
      `)
    })
    .catch(next)
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      return response.json(persons)
    })
    .catch(next)
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(next)
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number)
    return response.status(400).json({ error: 'name or number missing' })

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(() => {
      console.log(`Added ${body.name} number ${body.number} to phonebook`)
      return response.json(person)
    })
    .catch(next)
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  if (!body.name || !body.number)
    return response.status(400).json({ error: 'name or number missing' })

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch(next)
})

const errorHandler = (error, request, response, next) => {
  console.error('ERror message is:', error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  if (error.name === 'AxiosError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
