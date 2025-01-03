const Airtable = require('airtable');

// Configure the Airtable base with your API key and base ID
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

  
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

       
        const currentDate = new Date()
        const data={
          "Customer name": req.body.fields['Customer name'],
      "Phone Number":req.body.fields['Phone Number'],
      "address": req.body.fields['address'],
      "pincode": req.body.fields['pincode'],
      "City": req.body.fields['City'],
      "Brand": req.body.fields['Brand'],
      "category": req.body.fields['category'],
      "product name": req.body.fields['product name'],
     "Purchase Date": req.body.fields['Purchase Date'],
      "warranty expiry date": req.body.fields['warranty expiry date'],
      "Complain/Remark": req.body.fields['Complain/Remark'],
      "Request Type": req.body.fields['Request Type'],
      "date of complain":currentDate.toLocaleDateString()
        }


          console.log('Data to be inserted:', data);

    
    // const record = await base('Service').create(data, {typecast: true});
    // const adminrecord=await base('admin').create(data, {typecast: true});

    let serviceRecord = null;
    try {
      serviceRecord = await base('Service').create(data, { typecast: true });
      console.log('Service record created:', serviceRecord.getId());
    } catch (serviceError) {
      console.error('Service table error:', serviceError);
      throw new Error(`Service creation failed: ${serviceError.message}`);
    }

    let adminRecord = null;
    try {
      adminRecord = await base('admin').create(data, { typecast: true });
      console.log('Admin record created:', adminRecord.getId());
    } catch (adminError) {
      console.error('Admin table error:', adminError);
      
      // Rollback service record if admin record fails
      if (serviceRecord) {
        try {
          await base('Service').destroy(serviceRecord.getId());
          console.log('Rolled back service record due to admin record failure');
        } catch (rollbackError) {
          console.error('Rollback failed:', rollbackError);
        }
      }
      throw new Error(`Admin creation failed: ${adminError.message}`);
    }

    // If successful, send the ID of the created record as the response
    res.status(200).json({serviceRecord: record.getId(),adminRecord:adminrecord.getId() });
  } catch (error) {
    res.status(500).json({ 
      error: error.message || 'Internal Server Error'
    });
  }
};
