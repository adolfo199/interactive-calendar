import '@testing-library/jest-dom'

// Mock para IntersectionObserver si no existe
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  } as unknown as typeof IntersectionObserver
}

// Mock para ResizeObserver si no existe
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  } as unknown as typeof ResizeObserver
}

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})
