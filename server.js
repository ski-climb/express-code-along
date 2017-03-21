const express = require('express')
const app = express()

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Secret Box'

app.get('/', (request, response) => {
  response.send('It\'s a secret to everyone.')
})

// The !module.parent line is checking if the server was launched from
// the command line vs. started from a test.  The below case is what to
// do when the server is launched from the command line. Test setup will 
// be separate.

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
