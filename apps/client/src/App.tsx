import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    item1: '',
    item2: '',
    background: ''
  })
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setImageUrl('')

    try {
      const response = await fetch('http://localhost:8787/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      console.log('Success:', data)
      if (data.image) {
        setImageUrl(data.image)
      }
    } catch (error) {
      console.error('Error:', error)
      // Handle error (optional for now as per instructions)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="main-content">
      <div className="form-section container">
        <h1>Generate Image</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="item1">Item 1</label>
            <input
              type="text"
              id="item1"
              name="item1"
              value={formData.item1}
              onChange={handleChange}
              placeholder="e.g., A cute cat wearing sunglasses"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="item2">Item 2</label>
            <input
              type="text"
              id="item2"
              name="item2"
              value={formData.item2}
              onChange={handleChange}
              placeholder="e.g., A capybara floating on a donut"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="background">Background</label>
            <input
              type="text"
              id="background"
              name="background"
              value={formData.background}
              onChange={handleChange}
              placeholder="e.g., At the beach"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      </div>

      <div className="result-section container">
        {loading ? (
          <div className="loading-state">
            <div className="loading">Building your image...</div>
          </div>
        ) : imageUrl ? (
          <div className="image-result">
            <img src={imageUrl} alt="Generated result" />
          </div>
        ) : (
          <div className="placeholder-state">
            <p>Your generated image will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
