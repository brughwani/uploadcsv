// import the required modules
const Airtable = require('airtable');

// Configure the Airtable base with your API key and base ID
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);


module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    console.log('Request body:', req.body);

    if (!req.body.fields) {
      throw new Error('Missing fields object in request body');
    }

    // Extract the fields from the request body
    const {
      'First Name': firstName,
      'Last Name': lastName,
      'Role': role,
      'Phone Number': phone,
      'Password': password,
      'Address': address,
      'Personal Mobile Number': personalPhoneNumber,
      'Salary': salary
    } = req.body.fields;

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
    };

    console.log('Data to be inserted:', data);

    // Insert the data into the 'Employee' table
    const record = await base('Employee').create(data, {typecast: true});

    // If successful, send the ID of the created record as the response
    res.status(200).json({ id: record.getId() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};