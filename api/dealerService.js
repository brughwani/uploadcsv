const Airtable = require('airtable');

module.exports = async (req, res) => {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { locality, getLocations, getAllDealers } = req.query;

    // If getAllDealers is true, return all dealers grouped by locality
    if (getAllDealers === 'true') {
      const dealersByLocation = {};
      
      await base('Dealer')
        .select({
          view: "Grid view",
          pageSize: 100
        })
        .eachPage((records, fetchNextPage) => {
          records.forEach(record => {
            const location = record.get('locality');
            const dealerInfo = {
              id: record.id,
              dealerName: record.get('Dealer name'),
              location: location
            };
            
            if (location) {
              if (!dealersByLocation[location]) {
                dealersByLocation[location] = [];
              }
              dealersByLocation[location].push(dealerInfo);
            }
          });
          fetchNextPage();
        });

      return res.status(200).json(dealersByLocation);
    }

    // If getLocations is true, return all unique locations
    if (getLocations === 'true') {
      const locations = new Set();
      
      await base('Dealer')
        .select({
          view: "Grid view",
          pageSize: 100
        })
        .eachPage((records, fetchNextPage) => {
          records.forEach(record => {
            const location = record.get('locality');
            if (location) {
              locations.add(location);
            }
          });
          fetchNextPage();
        });

      return res.status(200).json(Array.from(locations));
    }

    // If locality is provided, filter dealers by location
    if (locality) {
      const records = [];
      await new Promise((resolve, reject) => {
        base('Dealer')
          .select({
            filterByFormula: `{locality} = "${locality}"`,
            view: "Grid view"
          })
          .eachPage(
            function page(recordBatch, fetchNextPage) {
              recordBatch.forEach(record => {
                records.push({
                  id: record.id,
                  dealerName: record.get('Dealer name'),
                  location: record.get('locality')
                });
              });
              fetchNextPage();
            },
            function done(err) {
              if (err) reject(err);
              else resolve();
            }
          );
      });

      return res.status(200).json(records);
    }

    // If no parameters provided, return error
    res.status(400).json({ error: 'Missing required query parameters' });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: 'Server error' });
  }
};
