'use strict'

const { spawn } = require('child_process')
const path = require('path')
const { randomUUID } = require('crypto')

const _pythonBin = process.env.PYTHON_BIN || 'python3'
const PYTHON_BIN = _pythonBin.startsWith('.') ? path.resolve(__dirname, _pythonBin) : _pythonBin
const _modelDir = process.env.MODEL_DIR || path.join(__dirname, '..', '..', 'ml')
const MODEL_DIR = _modelDir.startsWith('.') ? path.resolve(__dirname, _modelDir) : _modelDir
const PREDICT_SCRIPT = path.join(__dirname, 'predict.py')
const CALL_TIMEOUT_MS = 10_000
const RESTART_DELAY_MS = 2_000

let child = null
let ready = false
let stdoutBuffer = ''
const pendingMap = new Map()
const queue = []
let readyListeners = []

class PredictionError extends Error {
  constructor(message) {
    super(message)
    this.name = 'PredictionError'
  }
}

function spawnPython() {
  child = spawn(PYTHON_BIN, [PREDICT_SCRIPT, MODEL_DIR])

  child.stdout.on('data', (chunk) => {
    stdoutBuffer += chunk.toString()
    let newline
    while ((newline = stdoutBuffer.indexOf('\n')) !== -1) {
      const line = stdoutBuffer.slice(0, newline).trim()
      stdoutBuffer = stdoutBuffer.slice(newline + 1)
      if (!line) continue
      handleLine(line)
    }
  })

  child.stderr.on('data', (data) => {
    process.stderr.write(`[predict.py] ${data}`)
  })

  child.on('exit', (code) => {
    console.error(`[bridge] Python process exited with code ${code}`)
    ready = false
    stdoutBuffer = ''

    for (const [, entry] of pendingMap) {
      clearTimeout(entry.timer)
      entry.reject(new PredictionError('Python process exited unexpectedly'))
    }
    pendingMap.clear()

    const listeners = readyListeners.splice(0)
    for (const reject of listeners) reject(new Error('Python process exited before ready'))

    console.error(`[bridge] Restarting Python process in ${RESTART_DELAY_MS} ms...`)
    setTimeout(spawnPython, RESTART_DELAY_MS)
  })
}

function handleLine(line) {
  let msg
  try {
    msg = JSON.parse(line)
  } catch {
    console.error('[bridge] Unparseable line from Python:', line)
    return
  }

  if (msg.status === 'ready') {
    ready = true
    const listeners = readyListeners.splice(0)
    for (const resolve of listeners) resolve()
    flushQueue()
    return
  }

  const entry = pendingMap.get(msg.id)
  if (!entry) return

  clearTimeout(entry.timer)
  pendingMap.delete(msg.id)

  if (msg.error) {
    entry.reject(new PredictionError(msg.error))
  } else {
    entry.resolve({ prediction: msg.prediction, confidence: msg.confidence })
  }
}

function flushQueue() {
  while (queue.length > 0) {
    const item = queue.shift()
    dispatch(item)
  }
}

function dispatch({ id, text, resolve, reject }) {
  const timer = setTimeout(() => {
    pendingMap.delete(id)
    reject(new PredictionError(`Prediction timed out after ${CALL_TIMEOUT_MS / 1000}s`))
  }, CALL_TIMEOUT_MS)

  pendingMap.set(id, { resolve, reject, timer })
  child.stdin.write(JSON.stringify({ id, text }) + '\n')
}

function predict(text) {
  return new Promise((resolve, reject) => {
    const id = randomUUID()
    if (ready) {
      dispatch({ id, text, resolve, reject })
    } else {
      queue.push({ id, text, resolve, reject })
    }
  })
}

function waitForReady(timeoutMs = 30_000) {
  if (ready) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const idx = readyListeners.indexOf(resolve)
      if (idx !== -1) readyListeners.splice(idx, 1)
      reject(new Error('Python bridge did not become ready in time'))
    }, timeoutMs)

    readyListeners.push((...args) => {
      clearTimeout(timer)
      resolve(...args)
    })
  })
}

spawnPython()

module.exports = { predict, waitForReady, PredictionError }
