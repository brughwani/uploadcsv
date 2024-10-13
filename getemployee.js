// Import the required modules
const Airtable = require('airtable');

// Configure the Airtable base with your API key and base ID
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Define the Vercel function to handle the API request
module.exports = async (req, res) => {
  // Extract the field and corresponding value from the request query or body
  const filteringField = req.query.filterField || req.body.filterField;  // The dynamic field to filter by
  const filteringValue = req.query.filterValue || req.body.filterValue;  // The value of the field to filter

  // Validate the presence of the required filtering criteria
  if (!filteringField || !filteringValue) {
    res.status(400).json({ error: 'Please provide both filterField and filterValue' });
    return;
  }

  // Sanitize the filtering field to prevent any potential injection issues
  const validFields = ['Phone', 'empcode', 'name']; // Add other valid fields here
  if (!validFields.includes(filteringField)) {
    res.status(400).json({ error: 'Invalid filtering field. Allowed fields are: ' + validFields.join(', ') });
    return;
  }

  // Define the filter formula
  const filterFormula = `{${filteringField}} = '${filteringValue}'`;

  try {
    // Perform the select query with dynamic field filtering using the Airtable API
    const records = await base('Employee').select({
      filterByFormula: filterFormula,
      maxRecords: 3,
      view: "Grid view"
    }).all();  // Use `.all()` to fetch all records based on the filter

    // Process the retrieved records
    if (records.length > 0) {
      const retrievedRecords = records.map(record => {
        return {
          id: record.id,
          empcode: record.get('empcode'), // Change 'empcode' to the desired fields
          Phone: record.get('Phone'), // Assuming you want to fetch the Phone field too
          // Add any other fields you wish to return
        };
      });

      res.status(200).json(retrievedRecords);  // Send the fetched records as JSON response
    } else {
      res.status(404).json({ message: 'No records found for that filter' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching records from Airtable');
  }
};
