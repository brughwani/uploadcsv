const Airtable = require('airtable');
const category = require('./category');

// Configure Airtable base
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

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

            // console.log(data['Customer name'])
            // console.log(data['productname'])
            // console.log(data['Location'])
            // console.log(data['productcategory'])

         

            let matches = true;

           
          
            if (!record.get('Customer name (from Serviceid)')[0].toLowerCase().includes(data['Customer name']))
            {
                console.log(1)
                matches = false;
            }
    if (record.get('product name (from Serviceid)')[0] !== data['productname']) 
    {
        console.log(2)
        matches = false;
    }
        
    if (record.get('City (from Serviceid)')[0] !== data['Location']) 
    {
        console.log(3)
        matches = false;
    }
        
    if (record.get('category (from Serviceid)')[0] !== data['productcategory'])
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
    //         if (name && !record.get('Customer name (from Serviceid)')?.toString().toLowerCase().includes(name.toLowerCase())) matches = false;
    //    //     if (phone && record.get('Phone Number')?.toString() !== phone) matches = false
    //         if (productname && record.get('product name (from Serviceid)')?.toString() !== productname.toLowerCase()) matches = false
    //         if(location && record.get('City (from Serviceid)')?.toString() !== location.toLowerCase()) matches= false
    //         if(productcategory && record.get('category (from Serviceid)')?.toString() !== productcategory.toLowerCase()) matches= false
    //         if(matches)
    //         {
                
                    
    //                 if (name) filteredFields['Customer name (from Serviceid)'] = record.get('Customer name (from Serviceid)');
    //                 if (productname) filteredFields['product name (from Serviceid)'] = record.get('product name (from Serviceid)');
    //                 if (location) filteredFields['City (from Serviceid)'] = record.get('City (from Serviceid)');
    //                 if (productcategory) filteredFields['category (from Serviceid)'] = record.get('category (from Serviceid)');
                    
    //                 filteredRecords.push(filteredFields); // Include all fields of the record
                
            
            
  console.log(filteredRecords);
  
      res.status(200).json(filteredRecords);
   
    
}
catch (err) {
        console.error(err);
        res.status(500).send('Error fetching records from Airtable');
    }

}


    //     const fields = record.fields;

        //     // Perform matching based on provided inputs
        //     let matches = true;

        //  //   console.log(fields);

        //     if (name && !fields.get('Customer Name')?.toString().toLowerCase().includes(name.toLowerCase())) matches = false;
        //     if (phone && fields.get('Phone Number')?.toString() !== phone) matches = false;
        //     if (dealer && fields.get('Dealer')?.toString().toLowerCase() !== dealer.toLowerCase()) matches = false;
        //     if (location && fields.get('City')?.toString().toLowerCase() !== location.toLowerCase()) matches = false;
        //     if (productcategory && fields.get('category')?.toString().toLowerCase() !== productcategory.toLowerCase()) matches = false;
        //     if (productname && fields['Product Name']?.toLowerCase() !== productname.toLowerCase()) matches = false;

        //     return matches;
        // });

        // // Format the response
        // const formattedRecords = filteredRecords.map(record => ({
        //     id: record.id, // Airtable's unique record ID
        //     ...record.fields, // Spread all fields
        // }));


  
    


