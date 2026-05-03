'use strict'

module.exports = function validate(req, res, next) {
  const { message } = req.body
  if (typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      error: 'INVALID_INPUT',
      detail: 'message must be a non-empty string',
    })
  }
  next()
}
