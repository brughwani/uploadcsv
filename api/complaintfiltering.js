const Airtable = require('airtable');
const category = require('./category');

// Configure Airtable base
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

function isDateInRange(dateToCheck, startDate, endDate) {
    const date = new Date(dateToCheck);
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Check if the date is within the range
    return date >= start && date <= end;
  }
  


module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 //   let filteredFields = {};

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }
    
      if (req.method !== 'GET') {
        res.status(405).send('Method Not Allowed');
        return;
      }

      const data={
        "fromdate": req.query['fromdate'],
        "todate": req.query['todate'],
        "Customer name": req.query['Customer name'],
    "Phone Number":req.query['Phone Number'],
    "Location": req.query['Location'],
    "Dealer": req.query['Dealer'],
    "productcategory": req.query['productcategory'],
    "productname": req.query['productname'],
    "allotment":req.query['allotted to'],
    "Request Type": req.query['Service Type'],
    "Source by": req.query['Source by'],
      }
      console.log(data)
      console.log(req.query) 
  

    

      try {
        // Fetch records from the "Service" table
        const serviceRecords = await base('Service').select({
            view: "Grid view" // Adjust view as necessary
        }).all();

        // Fetch records from the "Admin" table
        const adminRecords = await base('admin').select({
            view: "Grid view" // Adjust view as necessary
        }).all();

     
         // Extract Service IDs and allotment info from Admin table
         const allotmentMap = adminRecords.reduce((map, record) => {
             map[record.fields['Service ID']] = record.fields['allotted To'] || null; // Map Service ID to Allotted To
             return map;
         }, {});
         let filteredRecords = [];
console.log(adminRecords)

        adminRecords.forEach(record => {
            let matches = true;
            if(!isDateInRange(record.get('date of complain'),data['fromdate'],data['todate']))
            {
                console.log("0")
                matches = false;
            }


            if (!record.get('Customer name')[0].toLowerCase().includes(data['Customer name']))
            {
                console.log(1)
                matches = false;
            }
    if (record.get('product name')[0] !== data['productname']) 
    {
        console.log(2)
        matches = false;
    }
    else if (record.get('product name')[0]==="Select a product" || record.get('product name (from Serviceid)')[0] === undefined)
    {

        console.log(2.5)
        matches = true;
    }
    if (record.get('City')[0] !== data['Location']) 
    {
        console.log(3)
        matches = false;
    }   
    if (record.get('category')[0] !== data['productcategory'])
    {
        console.log(4)
        matches = false;
    }

if (matches) {
        filteredRecords.push([record.get('Customer name (from Serviceid)'), 
                               record.get('Phone Number (from Serviceid)'), 
                               record.get('product name (from Serviceid)'), 
                               record.get('City (from Serviceid)'), 
                               record.get('category (from Serviceid)')]);
        console.log(1)
    }
    
})
  
            
  console.log(filteredRecords);
  
      res.status(200).json(filteredRecords);
   
    
}
catch (err) {
        console.error(err);
        res.status(500).send('Error fetching records from Airtable');
    }

}


  