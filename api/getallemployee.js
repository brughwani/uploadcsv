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
    // Define the specific fields you want to retrieve, e.g., 5 or 10 fields
   // const selectedFields = ['First Name', 'Last Name', 'empcode', 'Phone', 'salary', 'address', 'personal phone number', 'Role'];  // Add up to 10 fields here
   const selectedFields = req.query['fields[]']; // 'fields[]' is the key used in the query

   if (!selectedFields || selectedFields.length === 0) {
    return res.status(400).json({ message: 'No fields selected' });
  }
  const fieldsArray = Array.isArray(selectedFields) ? selectedFields : [selectedFields];

  if (typeof selectedFields === 'string') {
    // Convert a single field or a stringified array into an array
    if (selectedFields.startsWith('[') && selectedFields.endsWith(']')) {
      // Stringified array, e.g., "[Address, Salary]"
      selectedFields = JSON.parse(selectedFields);
    } else {
      // Single field
      selectedFields = [selectedFields];
    }
  }



    // Perform the select query with the specified fields
    const records = await base('Employee').select({
      fields: selectedFields,  // Fetch only the selected fields
      view: "Grid view"
    }).all();  // Use `.all()` to fetch all records



    // Process the retrieved records to include only the selected fields
    const employeesWithSelectedFields = records.map(record => {
      const selectedData = {};
      fieldsArray.forEach(field => {
        selectedData[field] = record.get(field);
      });
      return {
        id: record.id,
        ...selectedData
      };
    });

    // Check if any records are found
    if (employeesWithSelectedFields.length > 0) {
      res.status(200).json(employeesWithSelectedFields);  // Send the selected employee data as JSON response
    } else {
      res.status(404).json({ message: 'No employee records found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching employee records from Airtable');
  }
};