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

        const 
        {
          'Customer Name':name,
          'Phone Number':phone,
          'Complaint':complaint,
          'City':city,
          'pincode':pincode,
          'purchase date':purchasedate,
          'warranty expiry date':warrantyexpirydate,
          'product name':productname,
          'category':category,
          'address':address

        }= req.body.fields;

        const data={
            fields:{
                name,
                phone,
                complaint,
                city,
                pincode,
                purchasedate,
                warrantyexpirydate,
                productname,
                category,
                address
            }
        }

          console.log('Data to be inserted:', data);

    // Insert the data into the 'Employee' table
    const record = await base('Service').create(data, {typecast: true});

    // If successful, send the ID of the created record as the response
    res.status(200).json({ id: record.getId() });
  } catch (error) {
    
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
