const Airtable = require('airtable');

// Configure the Airtable base with your API key and base ID
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

// Define the Vercel function to handle the API request
module.exports = async (req, res) => {
    const { name,phone,address,purchasedate,warrantyexpirydate,productcategory,productname,pincode,city,complain,servicetype}=req.body

    const data = {
        "Customer Name": name,
        "Phone": phone,
        "Address": address,
        "Purchasedate": purchasedate,
        "Warrantyexpirydate": warrantyexpirydate,
        "Productcategory": productcategory,
        "Productname": productname,
        "Pincode": pincode,
        "City": city,
        "Complain": complain,
        "Servicetype": servicetype
    }
    base('Service').create(data, {typecast: true}, function(err, record) {
        if (err) {
          console.error(err);
          res.status(500).send('Error creating record in Airtable');
          return;
        }
    
        // If successful, send the ID of the created record as the response
        res.status(200).json({ id: record.getId() });
      });
    };
  // Extract the fields from the request body

