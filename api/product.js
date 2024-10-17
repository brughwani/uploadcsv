const Airtable = require('airtable');

module.exports = async (req, res) => {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

  // Get category from query parameters
  let category = req.query.category || null;

  // Create filter formula based on whether category is provided
  let filterFormula = category ? `{Category} = "${category}"` : '';

  try {
    const records = [];
    base('Products')
      .select({
        filterByFormula: filterFormula, // Apply filter only if category exists
        view: "Grid view",
      })
      .eachPage(
        function page(recordBatch, fetchNextPage) {
          recordBatch.forEach(record => {
            records.push({
              id: record.id,
              productName: record.get('Product Name'),
              category: record.get('Category'), // Get category for each product
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