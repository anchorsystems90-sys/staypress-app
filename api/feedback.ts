const MIN_MESSAGE = 12
const MAX_MESSAGE = 4000

type Kind = 'bug' | 'feature'

type VercelRequest = {
  method?: string
  body?: unknown
}

type VercelResponse = {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
  end: () => void
  setHeader: (name: string, value: string) => void
}

function parseBody(body: unknown): Record<string, unknown> {
  if (body == null) return {}
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  if (typeof body === 'object') return body as Record<string, unknown>
  return {}
}

function asKind(value: unknown): Kind | null {
  return value === 'bug' || value === 'feature' ? value : null
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.FEEDBACK_TO_EMAIL
  const from =
    process.env.FEEDBACK_FROM_EMAIL || 'Staypress <onboarding@resend.dev>'

  if (!apiKey || !to) {
    res.status(503).json({ error: 'Feedback is not configured yet.' })
    return
  }

  const data = parseBody(req.body)
  // Honeypot — bots fill this; pretend success.
  if (String(data.website ?? '').trim()) {
    res.status(200).json({ ok: true })
    return
  }

  const kind = asKind(data.kind)
  const message = String(data.message ?? '').trim()

  if (!kind) {
    res.status(400).json({ error: 'Choose bug or feature request.' })
    return
  }
  if (message.length < MIN_MESSAGE) {
    res.status(400).json({ error: 'Please add a bit more detail.' })
    return
  }
  if (message.length > MAX_MESSAGE) {
    res.status(400).json({ error: 'Message is too long.' })
    return
  }

  const label = kind === 'bug' ? 'Bug report' : 'Feature request'
  const subject = `[Staypress] ${label}`
  const text = `${label}\n\n${message}\n`
  const html = `<p><strong>${label}</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
      }),
    })

    if (!emailRes.ok) {
      const detail = await emailRes.text()
      console.error('Resend error', emailRes.status, detail)
      res.status(502).json({ error: 'Could not send feedback. Try again later.' })
      return
    }

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Feedback send failed', err)
    res.status(502).json({ error: 'Could not send feedback. Try again later.' })
  }
}
