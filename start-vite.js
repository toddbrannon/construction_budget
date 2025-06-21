#!/usr/bin/env node

const { createServer } = require('vite')

async function startServer() {
  try {
    const server = await createServer({
      server: {
        host: '0.0.0.0',
        port: 5000
      }
    })
    
    await server.listen()
    console.log('Vite dev server running at http://localhost:5000')
  } catch (error) {
    console.error('Error starting Vite server:', error)
    process.exit(1)
  }
}

startServer()