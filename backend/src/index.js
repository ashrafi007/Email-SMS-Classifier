'use strict'

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { predict, waitForReady } = require('./bridge')
const validate = require('./middleware/validate')
const errorHandler = require('./middleware/errorHandler')

const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

const app = express()

app.use(cors({ origin: FRONTEND_URL, methods: ['GET', 'POST'] }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', model: 'loaded' })
})

app.post('/predict', validate, async (req, res, next) => {
  try {
    const result = await predict(req.body.message.trim())
    res.json(result)
  } catch (err) {
    next(err)
  }
})

app.use(errorHandler)

async function start() {
  try {
    console.log('[server] Waiting for Python bridge to be ready...')
    await waitForReady(30_000)
    app.listen(PORT, () => {
      console.log(`[server] Ready on :${PORT}`)
    })
  } catch (err) {
    console.error('[server] Failed to start:', err.message)
    process.exit(1)
  }
}

start()
