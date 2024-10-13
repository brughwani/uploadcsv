const Airtable = require('airtable');

module.exports = async (req, res) => {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appoTE4TCM6nEPxJI');

  try {
    const categories = new Set(); // Using a Set to store unique categories

    base('Products')
      .select({
        view: "Grid view", // You can use other views if needed
      })
      .eachPage(
        function page(recordBatch, fetchNextPage) {
          recordBatch.forEach(record => {
            const category = record.get('Category');
            if (category) {
              categories.add(category); // Add category to Set to ensure uniqueness
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
            res.status(200).json(Array.from(categories));
          }
        }
      );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};