const Airtable = require('airtable');

module.exports = async (req, res) => {
  
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appoTE4TCM6nEPxJI');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');


  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  try {
    const categories = new Set(); // Using a Set to store unique categories

    base('Dealer')
      .select({
        view: "Grid view", // You can use other views if needed
      })
      .eachPage(
        function page(recordBatch, fetchNextPage) {
          recordBatch.forEach(record => {
            const location = record.get('locality');
            if (location) {
              locations.add(location); // Add category to Set to ensure uniqueness
            }
          });

          fetchNextPage(); // Fetch the next page of records
        },
        function done(err) {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch data' });
          } else {
            // Convert Set to Array and return unique categories
            res.status(200).json(Array.from(locations));
          }
        }
      );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};