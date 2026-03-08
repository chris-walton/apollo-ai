import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  GOOGLE_API_KEY: string
  AI: any
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
    const response = await c.env.AI.run(
      '@cf/leonardo/phoenix-1.0',
      {
        prompt: prompt,
      },
      {
        gateway: {
          id: 'lola-image-generator',
          accountId: 'ce9999d7d59fce98a0bc0e7911cb6e1f'
        }
      }
    )

    console.log('AI Response Type:', typeof response);

    let base64Image = '';

    if (response instanceof ReadableStream) {
      console.log('Response is ReadableStream');
      const arrayBuffer = await new Response(response).arrayBuffer()
      base64Image = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      )
    } else if (response && typeof response === 'object' && 'image' in response) {
      console.log('Response is Object with image property');
      base64Image = (response as any).image;
    } else {
      console.log('Response is unknown Object:', JSON.stringify(response));
      // Attempt to treat as direct buffer/blob if possible, or fail gracefully
      const arrayBuffer = await new Response(response as any).arrayBuffer();
      base64Image = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      )
    }

    return c.json({
      success: true,
      message: 'Image generated successfully',
      image: `data:image/jpeg;base64,${base64Image}`
    })

  } catch (error) {
    console.error('AI Generation Error:', error)
    return c.json({ success: false, error: 'Failed to generate image' }, 500)
  }
})

export default app
