import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initDb } from './db.js'
import api from './routes.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const isProd = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000

await initDb()
const app = express()
app.use(express.json({ limit: '100kb' }))
app.get('/healthz', (req, res) => res.send('ok'))
app.use('/api', api)
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }))

if (isProd) {
  app.use(express.static(path.join(root, 'dist')))
  app.use((req, res) => res.sendFile(path.join(root, 'dist', 'index.html')))
} else {
  // Dev: run Vite inside this same server, so there is still one process and one port.
  const { createServer } = await import('vite')
  const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'spa' })
  app.use(vite.middlewares)
}

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})
app.listen(port, () => console.log(`ShopEase running on http://localhost:${port} (${isProd ? 'production' : 'dev'})`))
