'use strict'

const { PredictionError } = require('../bridge')

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  console.error('[error]', err)

  if (err instanceof PredictionError) {
    return res.status(500).json({
      error: 'PREDICTION_FAILED',
      detail: 'Python bridge returned an error',
    })
  }

  res.status(500).json({
    error: 'INTERNAL_ERROR',
    detail: 'An unexpected error occurred',
  })
}
