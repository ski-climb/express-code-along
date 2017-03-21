const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Secret Box'
app.locals.secrets = {
  wow: "I am a cat",
  horse: "Ommi"
}
app.use(bodyParser.json())

// As another example of how we might use bodyParser:
app.use(bodyParser.urlencoded({extended: true}))
// This would parse data sent TO the app via html forms

// ROOT
app.get('/', (request, response) => {
  response.send(app.locals.title)
})

// SHOW (read)
app.get('/api/secrets/:id', (request, response) => {
  const id = request.params.id
  const message = app.locals.secrets[id]

  if (!message) { return response.sendStatus(404)  }

  response.json({
    id, message
  })
}) // end SHOW

// INDEX
app.get('/api/secrets', (request, response) => {
  response.send(app.locals.secrets)
})

// CREATE
app.post('/api/secrets', (request, response) => {
  const id = Date.now()
  const message = request.body.message
  if (!message) {
    return response.status(422).send({
      error: "No message property provided."
    })
  }
  app.locals.secrets[id] = message
  response.status(201).json({
    id, message
  })
}) // end CREATE

// The !module.parent line is checking if the server was launched from
// the command line vs. started from a test.  The below case is what to
// do when the server is launched from the command line. Test setup will 
// be separate.  Rails does something similar.
if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
