import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  GOOGLE_API_KEY: string
  STABILITY_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

app.get('/', (c) => {
  return c.text('Hello Google Nanobanana!')
})

app.post('/api/generate', async (c) => {
  const { item1, item2, background } = await c.req.json()

  if (!item1 || !item2 || !background) {
    return c.json({ error: 'Item 1, Item 2, and Background are required' }, 400)
  }

  const prompt = `Create a kid friendly image of ${item1} ${item2} ${background}`
  console.log(`Generating image for prompt: ${prompt}`)

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${c.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API Error:', response.status, errorText)
      return c.json({ success: false, error: 'Failed to generate image' }, 500)
    }

    const data = await response.json() as any
    const parts = data?.candidates?.[0]?.content?.parts
    const imagePart = parts?.find((p: any) => p.inlineData)

    if (!imagePart) {
      return c.json({ success: false, error: 'No image returned from Gemini' }, 500)
    }

    const { mimeType, data: base64Image } = imagePart.inlineData

    return c.json({
      success: true,
      message: 'Image generated successfully',
      image: `data:${mimeType};base64,${base64Image}`
    })

  } catch (error) {
    console.error('AI Generation Error:', error)
    return c.json({ success: false, error: 'Failed to generate image' }, 500)
  }
})

export default app
