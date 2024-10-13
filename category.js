const axios = require('axios');

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://api.airtable.com/v0/appoTE4TCM6nEPxJI/Products', {
      headers: {
        'Authorization': `Bearer YOUR_API_KEY`, // Replace with your Airtable API key
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    res.status(500).json({ error: 'Error fetching data from Airtable' });
  }
}