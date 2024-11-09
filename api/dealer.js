const Airtable = require('airtable');

module.exports = async (req, res) => {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

  // Get locality from query parameters
  let loc = req.query.locality || null;

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
 // let filterFormula = loc ? `{locality} = "${loc}"` : '';

 
  try {
    const records = [];
    console.log('Filtering for locality:', loc);
    
    // Create filter formula - note the LOWER() function for case-insensitive comparison
    let filterFormula =`{locality} = "${loc}"`;
    
  
    // Convert the Airtable query to a Promise
    await new Promise((resolve, reject) => {
      base('Dealer')
        .select({
          filterByFormula: filterFormula,
          view: "Grid view",
        })
        .eachPage(
          function page(recordBatch, fetchNextPage) {
            recordBatch.forEach(record => {
              records.push({
                id: record.id,
                dealerName: record.get('Dealer name'),
                location: record.get('locality'),
              });
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
    });

    // Now we can safely return the records
    console.log(records);
    res.status(200).json(records);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};