const Airtable = require('airtable');

// Configure the Airtable base with your API key and base ID
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {

    let name = req.query.name || null;
    let phone= req.query.phone || null;
    let dealer=req.query.dealer || null;
    let location=req.query.location || null;
    let fromdate=req.query.fromdate;
    let todate=req.query.todate;
    let status=req.query.status;
    let productcategory=req.query.productcategory;
    let productname=req.query.productname;
    let allotment=req.query.allotment;
    let servicetype=req.query.servicetype;
    let sourceby=req.query.sourceby;


    let filterFormula = `AND(
      ${fromdate ? `IS_AFTER({date and time of complain}, "${fromdate}")` : `TRUE()`}, 
      ${todate ? `IS_BEFORE({date and time of complain}, "${todate}")` : `TRUE()`}, 
      OR(
        ${name ? `SEARCH("${name}", {Name}) > 0` : `FALSE()`},
        ${phone ? `SEARCH("${phone}", {Phone Number}) > 0` : `FALSE()`},
        ${location ? `SEARCH("${location}", {Location}) > 0` : `FALSE()`},
        ${dealer && dealer !== 'Select an option'  ? `SEARCH("${dealer}", {Dealer}) > 0` : `FALSE()`},
        ${status ? `SEARCH("${status}", {Status}) > 0` : `FALSE()`},
        ${productcategory ? `SEARCH("${productcategory}", {product category}) > 0` : `FALSE()`},
        ${productname ? `SEARCH("${productname}", {product name}) > 0` : `FALSE()`},
        ${allotment ? `SEARCH("${allotment}", {Allotted to}) > 0` : `FALSE()`},
        ${servicetype ? `SEARCH("${servicetype}", {Service type}) > 0` : `FALSE()`},
        ${sourceby  && sourceby !== 'Select an option' ? `SEARCH("${sourceby}", {Source by}) > 0` : `FALSE()}`}
      )
    )`;
    // Create filter formula based on whether category is provided
  //   let filterFormula = `AND(IS_AFTER({date and time of complain}, "${fromdate}"), 
  // IS_BEFORE({date and time of complain}, "${todate}"), 
  // OR(
    
  //   SEARCH("${name}", {Name}) > 0,
  //   SEARCH("${phone}", {Phone Number}) > 0,
  //   SEARCH("${location}", {Location}) > 0, 
  //   SEARCH("${dealer}", {Dealer}) > 0,
  //   SEARCH("${status}", {Status}) > 0,
  //   SEARCH("${productcategory}", {product category}) > 0,
  //   SEARCH("${productname}", {product name}) > 0,
  //   SEARCH("${allotment}", {Allotted to}) > 0,
  //   SEARCH("${servicetype}", {Service type}) > 0
  // ))` 
  try {
    // Perform the select query with dynamic field filtering using the Airtable API
    const records = await base('admin').select({
      filterByFormula: filterFormula,
      maxRecords: 3,
      view: "Grid view"
    }).all();  // Use `.all()` to fetch all records based on the filter

    // Process the retrieved records
    if (records.length > 0) {
      const retrievedRecords = records.map(record => {
        return {
          id: record.get('Complain Number'),
          compcode: record.get('Complain Number'), // Change 'empcode' to the desired fields
          Phone: record.get('Phone Number'),
          Name: record.get('Customer Name'),
          Dealer: record.get('Dealer'),
          Location: record.get('Location'),
          Status: record.get('Status'),
          "complain type":record.get("complain type"),
          "Date and time of complain": record.get('date and time of complain'),
          "Product category": record.get('product category'),
          "Product name": record.get('product name'),
          "Allotted to": record.get('Allotted to'),
          "Service type": record.get('Request type'),
        };
      });

      res.status(200).json(retrievedRecords);  // Send the fetched records as JSON response
    } else {
      res.status(404).json({ message: 'No records found for that filter' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching records from Airtable');
  }
}