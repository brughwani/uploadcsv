const Airtable = require('airtable');
const category = require('./category');

// Configure Airtable base
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

function isDateInRange(dateToCheck, startDate, endDate) {
    const date = new Date(dateToCheck);
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log(date)
    console.log(start)
    console.log(end)

    date.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    console.log(date >= start && date <= end)
  
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
        //  const allotmentMap = adminRecords.reduce((map, record) => {
        //      map[record.fields['Service ID']] = record.fields['allotted To'] || null; // Map Service ID to Allotted To
        //      return map;
        //  }, {});
         let filteredRecords = [];
console.log(adminRecords)

        adminRecords.forEach(record => {
          //  console.log(record.get('date of complain'))

            let matches = false;
          

// console.log(record.get('Customer name'))
// console.log(data['Customer name'])
// console.log(matches)
            if (record.get('Customer name').toLowerCase().includes(data['Customer name']))
            {
                console.log(1)
                matches = true;
            }
  
    // if (data['productname']=="Select a product")
    // {
    //     console.log(data['productname'])
    //     console.log(2.5)
    //     matches = true;
    // }
    // console.log(record.get('product name'))
    // console.log(data['productname'])
    // console.log(matches)
 
    if (record.get('City') === data['Location']) 
    {
        console.log(3)
        matches = true;
    }   
    console.log(record.get('category'))
    console.log(matches)
    if (record.get('category') === data['productcategory'])
    {
        console.log(4)
        matches = true;
        if (data['productname']==="Select a product")
            {
                console.log(data['productname'])
                console.log(2.5)
                matches = true;
            }
            else  if (record.get('product name') === data['productname'] ) 
                {
                    console.log(5)
                    matches = true;
                }
                else
                {
                    console.log(6)
                    matches = false;
                }

    }
   
        

    // if(isDateInRange(record.get('date of complain'),data['fromdate'],data['todate']))
    //     {
    //         console.log("0")
    //         matches = true;
    //     }

if (matches && isDateInRange(record.get('date of complain'),data['fromdate'],data['todate'])) {
        filteredRecords.push([record.get('Customer name'), 
                               record.get('Phone Number'), 
                               record.get('product name'), 
                               record.get('City'), 
                               record.get('category'),
                               record.get('date of complain')
                            ]);
        console.log(1.9)
    }
    // else if(matches && data['productname']==="Select a product")
    // {
    //     filteredRecords.push([record.get('Customer name'), 
    //         record.get('Phone Number'), 
    //         record.get('product name'), 
    //         record.get('City'), 
    //         record.get('category'),
    //         record.get('date of complain')
    //      ]);

    // }
    
})
  
            
  console.log(filteredRecords);
  
      res.status(200).json(filteredRecords);
   
    
}
catch (err) {
        console.error(err);
        res.status(500).send('Error fetching records from Airtable');
    }

}


  