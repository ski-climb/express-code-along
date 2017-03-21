// You could use 'expect' in place of 'assert' here (and below)
const assert = require('chai').assert
const app = require('../server')
const request = require('request')

describe('Server', () => {
  before((done) => {
    this.port = 9876;
    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err) }
      done()
    })

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876'
    })
  })

  after(() => {
    this.server.close()
  })

  it('should exist', () => {
    assert(app)
  })

  // SHOW (read)
  describe('GET api/secrets/:id', () => {
    beforeEach(() => {
      app.locals.secrets = {
        horse: "Penelope"
      }
    })

    it('returns 404 when resource not found', (done) => {
      this.request.get('/api/secrets/not-there', (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 404)
        done()
      })
    })

    it('returns the correct data when a valid id is requested', (done) => {
      this.request.get('/api/secrets/horse', (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 200)
        assert.include(response.body, "Penelope")
        done()
      })
    })
  })
  // end of SHOW

  // INDEX (read)
  describe('GET /api/secrets', () => {
    beforeEach(() => {
      app.locals.secrets = {
        horse: "Ommi",
        dog: "Roxi",
        cat: "Reilly"
      }
    })

    it('returns a list of all the secrets', (done) => {
      this.request.get('api/secrets', (error, response) => {
        if (error) { done(error) }
        assert.include(response.body, "Ommi")
        assert.include(response.body, "Roxi")
        assert.include(response.body, "Reilly")
        done()
      })
    })
  }) // end of INDEX

  // CREATE
  describe('POST /api/secrets', () => {
    beforeEach(() => {
      app.locals.secrets = {}
    })

    it('should not return a 404', (done) => {
      this.request.post('/api/secrets', (error, response) => {
        if (error) { done(error) }
        assert.notEqual(response.statusCode, 404)
        done()
      })
    })

    it('should receive and store data', (done) => {
      const message = { message: "Horses are pretty" }
      this.request.post('/api/secrets', { form: message }, (error, response) => {
        if (error) { done(error) }
        const secretCount = Object.keys(app.locals.secrets).length
        assert.equal(secretCount, 1)
        done()
      })
    })
  }) // end of CREATE

  // ROOT
  describe('GET /', () => {
    it('should return a 200 status code', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('returns the app title', (done) => {
      this.request.get('/', (error, response) => {
        const title = app.locals.title
        if (error) { done(error) }
        assert.equal(response.body, title)
        done()
      })
    })
  }) // end of ROOT
})

