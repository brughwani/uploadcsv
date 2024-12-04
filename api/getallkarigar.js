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
 

    // Process the retrieved records to get only names
      // Assume roleName is passed as a query parameter

    try {
      // Fetch employees with the specified role directly from the Employee table
      const employees = await base('Employee').select({
        filterByFormula: `{Role} = 'Karigar'`,  // Filter directly on the Role field
        view: "Grid view",
        fields: ['First name']
      }).all();
  
      // Process the retrieved employee records
      const result = employees.map(employee => ({
        id: employee.id,
        ...employee.fields  // Include all employee fields, or specify fields as needed
      }));
  
      if (result.length > 0) {
        res.status(200).json(result);  // Send the filtered employee data as JSON response
      } else {
        res.status(404).json({ message: 'No employees found with the specified role' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching employee data from Airtable');
    }
  };
