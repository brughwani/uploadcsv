// Import the required modules
const Airtable = require('airtable');

// Configure the Airtable base with your API key and base ID
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Define the Vercel function to handle the API request
module.exports = async (req, res) => {

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
    // Perform the select query to get all employee names
    const records = await base('karigar').select({
      fields: ['First Name'],  // Only fetch the 'name' field
      view: "Grid view"
    }).all();  // Use `.all()` to fetch all records

    // Process the retrieved records to get only names
    const employeeNames = records.map(record => record.get('First Name'));

    // Check if any records are found
    if (employeeNames.length > 0) {
      res.status(200).json(employeeNames);  // Send the names as a JSON response
    } else {
      res.status(404).json({ message: 'No employee records found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching employee names from Airtable');
  }
};