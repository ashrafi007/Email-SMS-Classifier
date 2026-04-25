export const mockClassify = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        prediction: message.toLowerCase().includes("win") ? "spam" : "not spam",
        confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
      })
    }, 1500)
  })
}
