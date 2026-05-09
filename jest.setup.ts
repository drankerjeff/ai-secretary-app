import '@testing-library/jest-dom'

// jsdom emits a console.error for navigation events (e.g. clicking <a> tags).
// This is expected in a test environment and not a real failure.
const originalError = console.error.bind(console)
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'object' &&
    args[0] !== null &&
    (args[0] as { type?: string }).type === 'not implemented'
  ) {
    return
  }
  originalError(...args)
}
