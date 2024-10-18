// import the required modules
const Airtable = require('airtable');

// Configure the Airtable base with your API key and base ID
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

// Define the Vercel function to handle the API request
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Extract the fields from the request body
  const { firstName, lastName, role, phone, password, address, personalPhoneNumber, salary,} = req.body;
console.log(req.body)
  // Combine the extracted fields into the data object
  const data = {
    "First Name": firstName,
    "Last name": lastName,
    "Role": role,
    "Phone": phone,
    "password": password,
    "address": address,
    "personal phone number": personalPhoneNumber,
    "Salary": salary,
     // Add any additional fields from the request
  };
  console.log(data)

  // Insert the data into the 'Employee' table
  base('Employee').create(data, {typecast: true}, function(err, record) {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating record in Airtable');
      return;
    }

    // If successful, send the ID of the created record as the response
    res.status(200).json({ id: record.getId() });
  });
};
