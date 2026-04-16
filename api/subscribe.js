import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    if (req.method !== 'POST') {
      return res.status(405).end(JSON.stringify({ error: 'Method not allowed' }))
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})
    const { name, email, source } = body
    const sourceTag = typeof source === 'string' && source.trim().length > 0
      ? source.trim().slice(0, 64)
      : 'scorecard'

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).end(JSON.stringify({ error: 'Name is required.' }))
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).end(JSON.stringify({ error: 'Email is required.' }))
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return res.status(400).end(JSON.stringify({ error: 'Please enter a valid email address.' }))
    }

    const sql = neon(process.env.DATABASE_URL)

    await sql`
      CREATE TABLE IF NOT EXISTS subscribers (
        id         SERIAL PRIMARY KEY,
        name       TEXT NOT NULL,
        email      TEXT UNIQUE NOT NULL,
        source     TEXT DEFAULT 'scorecard',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `

    await sql`
      INSERT INTO subscribers (name, email, source)
      VALUES (${name.trim()}, ${email.trim().toLowerCase()}, ${sourceTag})
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        source = CASE
          WHEN subscribers.source IS NULL OR subscribers.source = ''
            THEN EXCLUDED.source
          WHEN position(EXCLUDED.source IN subscribers.source) > 0
            THEN subscribers.source
          ELSE subscribers.source || ',' || EXCLUDED.source
        END
    `

    return res.status(200).end(JSON.stringify({ success: true }))
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).end(JSON.stringify({ error: 'Something went wrong. Please try again.' }))
  }
}
