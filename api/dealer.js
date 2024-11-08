const Airtable = require('airtable');

module.exports = async (req, res) => {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

  // Get category from query parameters
  let category = req.query.category || null;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Create filter formula based on whether locality is provided
  let filterFormula = `loc ? '{locality} = "${loc}"' : ''`;

  try {
    const records = [];
    base('Dealer')
      .select({
        filterByFormula: filterFormula, // Apply filter only if locality exists
        view: "Grid view",
      })
      .eachPage(
        function page(recordBatch, fetchNextPage) {
          recordBatch.forEach(record => {
            records.push({
              id: record.id,
              dealerName: record.get('Dealer Name'),
              location: record.get('locality'), // Get locality for each dealer
            });
          });
          fetchNextPage(); // Fetch the next page of records
        },
        function done(err) {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch data' });
          } else {
            res.status(200).json(records); // Return the array of product records
          }
        }
      );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};