// const Airtable = require('airtable');

// // Configure the Airtable base with your API key and base ID
// const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

// module.exports = async (req, res) => {
//     // Extract query parameters
//     const {
//         name = null,
//         phone = null,
//         dealer = null,
//         location = null,
//         fromdate = null,
//         todate = null,
//         status = null,
//         productcategory = null,
//         productname = null,
//         allotment = null,
//         servicetype = null,
//         sourceby = null
//     } = req.query;

//     // Build filter formula dynamically based on provided parameters
//     let filterFormulaParts = [];

//     if (fromdate) {
//         filterFormulaParts.push(`IS_AFTER({date and time of complain}, "${fromdate}")`);
//     }
//     if (todate) {
//         filterFormulaParts.push(`IS_BEFORE({date and time of complain}, "${todate}")`);
//     }
//     if (name) {
//         filterFormulaParts.push(`SEARCH("${name}", {Name}) > 0`);
//     }
//     if (phone) {
//         filterFormulaParts.push(`SEARCH("${phone}", {Phone Number}) > 0`);
//     }
//     if (location && location !== 'Select a location') {
//         filterFormulaParts.push(`SEARCH("${location}", {Location}) > 0`);
//     }
//     if (dealer && dealer !== 'Select a dealer') {
//         filterFormulaParts.push(`SEARCH("${dealer}", {Dealer}) > 0`);
//     }
//     if (status) {
//         filterFormulaParts.push(`SEARCH("${status}", {Status}) > 0`);
//     }
//     if (productcategory && productcategory !== 'Select a category') {
//         filterFormulaParts.push(`SEARCH("${productcategory}", {category}) > 0`);
//     }
//     if (productname && productname !== 'Select a product') {
//         filterFormulaParts.push(`SEARCH("${productname}", {product name}) > 0`);
//     }
//     if (allotment && allotment !== 'Select an employee') {
//         filterFormulaParts.push(`SEARCH("${allotment}", {Allotted to}) > 0`);
//     }
//     if (servicetype) {
//         filterFormulaParts.push(`SEARCH("${servicetype}", {Service type}) > 0`);
//     }
//     if (sourceby && sourceby !== 'Select an option') {
//         filterFormulaParts.push(`SEARCH("${sourceby}", {Source by}) > 0`);
//     }

//     // Combine all parts into a single formula
//     const filterFormula = `AND(${filterFormulaParts.join(', ')})`;

//     try {
//         const records = await base('Service').select({
//             filterByFormula: filterFormula,
//             maxRecords: 3,
//             view: "Grid view"
//         }).all();

//         // Process retrieved records
//         if (records.length > 0) {
//             const retrievedRecords = records.map(record => ({
//                 id: record.get('Complain Number'),
//                 compcode: record.get('Complain Number'),
//                 Phone: record.get('Phone Number'),
//                 Name: record.get('Customer Name'),
//                 Dealer: record.get('Dealer'),
//                 Location: record.get('Location'),
//                 Status: record.get('Status'),
//                 //"complain type": record.get("complain type"),
//                 "date and time of complain": record.get('date and time of complain'),
//                 productcategory: record.get('category'),
//                 productname: record.get('product name'),
//                // allotment: record.get('allotted to'),
//                 servicetype: record.get('Request type'),
//             }));

//             res.status(200).json(retrievedRecords);
//         } else {
//             res.status(404).json({ message: 'No records found for that filter' });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error fetching records from Airtable');
//     }
// }

const Airtable = require('airtable');

// Configure the Airtable base with your API key and base ID
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }
    // Extract query parameters
    const {
        name,
        phone = null,
        dealer = null,
        location,
        fromdate = null,
        todate = null,
        status = null,
        productcategory = null,
        productname = null,
        allotment = null,
        servicetype = null,
        sourceby = null,
    } = req.query;

    // Build filter formula dynamically for Service table
    let serviceFilterParts = [];
    if (fromdate) {
        serviceFilterParts.push(`IS_AFTER({date and time of complain}, "${fromdate}")`);
    }
    if (todate) {
        serviceFilterParts.push(`IS_BEFORE({date and time of complain}, "${todate}")`);
    }
    if (name) {
        serviceFilterParts.push(`SEARCH("${name}", {Customer name}) > 0`);
    }
    if (phone) {
        serviceFilterParts.push(`SEARCH("${phone}", {Phone Number}) > 0`);
    }
    // if (location && location !== 'Select a location') {
    //     serviceFilterParts.push(`SEARCH("${location}", {City}) > 0`);
    // }
    // if (dealer && dealer !== 'Select a dealer') {
    //     serviceFilterParts.push(`SEARCH("${dealer}", {Dealer}) > 0`);
    // }
    // if (status) {
    //     serviceFilterParts.push(`SEARCH("${status}", {Status}) > 0`);
    // }
    // if (productcategory && productcategory !== 'Select a category') {
    //     serviceFilterParts.push(`SEARCH("${productcategory}", {category}) > 0`);
    // }
    // if (productname && productname !== 'Select a product') {
    //     serviceFilterParts.push(`SEARCH("${productname}", {product name}) > 0`);
    // }
    // if (servicetype) {
    //     serviceFilterParts.push(`SEARCH("${servicetype}", {Service type}) > 0`);
    // }
    // if (sourceby && sourceby !== 'Select an option') {
    //     serviceFilterParts.push(`SEARCH("${sourceby}", {Source by}) > 0`);
    // }

    // // Build filter formula dynamically for Admin table
    // let adminFilterParts = [];
    // if (allotment && allotment !== 'Select an employee') {
    //     adminFilterParts.push(`SEARCH("${allotment}", {Allotted to}) > 0`);
    // }

    // const serviceFilterFormula = `AND(${serviceFilterParts.join(', ')})`;
    // const adminFilterFormula = `AND(${adminFilterParts.join(', ')})`;

    if (location && location !== 'Select a location') {
        serviceFilterParts.push(`{City} = "${location}"`);
      }
      if (dealer && dealer !== 'Select a dealer') {
        serviceFilterParts.push(`{Dealer} = "${dealer}"`);
      }
      if (status) {
        serviceFilterParts.push(`{Status} = "${status}"`);
      }
      if (productcategory && productcategory !== 'Select a category') {
        serviceFilterParts.push(`{category} = "${productcategory}"`);
      }
      if (productname && productname !== 'Select a product') {
        serviceFilterParts.push(`{product name} = "${productname}"`);
      }
      if (servicetype) {
        serviceFilterParts.push(`{Service type} = "${servicetype}"`);
      }
      if (sourceby && sourceby !== 'Select an option') {
        serviceFilterParts.push(`{Source by} = "${sourceby}"`);
      }
      
      // Build filter formula dynamically for Admin table
      let adminFilterParts = [];
      if (allotment && allotment !== 'Select an employee') {
        adminFilterParts.push(`{allotted to} = "${allotment}"`);
      }
      
      // Use OR operator to combine filter parts
      const serviceFilterFormula = serviceFilterParts.length > 0 ? `AND(${serviceFilterParts.join(', ')})` : '';
      const adminFilterFormula = adminFilterParts.length > 0 ? `AND(${adminFilterParts.join(', ')})` : '';
      

    try {
        // Fetch records from the Service table
        const serviceRecords = await base('Service').select({
            filterByFormula: serviceFilterFormula,
            view: "Grid view",
        }).all();

        // Fetch records from the Admin table
        const adminRecords = await base('Admin').select({
            filterByFormula: adminFilterFormula,
            maxRecords: 3,
            view: "Grid view",
        }).all();

        // Combine data from both tables
        const retrievedServiceRecords = serviceRecords.map(record => ({
            id: record.get('Service Request ID'),
            Phone: record.get('Phone Number'),
            Name: record.get('Customer Name'),
            Dealer: record.get('Dealer'),
           Location: record.get('Location'),
            Status: record.get('Status'),
            "date and time of complain": record.get('date and time of complain'),
            productcategory: record.get('category'),
            productname: record.get('product name'),
            servicetype: record.get('Request type'),
            "complain":record.get("Complain/Remark")
        }));

        const retrievedAdminRecords = adminRecords.map(record => ({
            id: record.get('Service Request ID'),
            allotment: record.get('allotted to'),
        }));

    //     // Combine both records into a single response
    //     const combinedRecords = {
    //         serviceRecords: retrievedServiceRecords,
    //         adminRecords: retrievedAdminRecords,
    //     };

    //     res.status(200).json(combinedRecords);
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).send('Error fetching records from Airtable');
    // }
    const matchedRecords = retrievedServiceRecords.map(service => {
        const adminRecord = retrievedAdminRecords.find(admin => admin.serviceid === service.serviceid);
        if (adminRecord) {
            return {
                serviceid: service.serviceid,
                Phone: service.Phone,
                Name: service.Name,
                Dealer: service.Dealer,
                Location: service.Location,
                Status: service.Status,
                "date and time of complain": service["date and time of complain"],
                productcategory: service.productcategory,
                servicetype: service.servicetype,
                productname: service.productname,
                allotment: adminRecord.allotment, // Extract 'Allotted to' from Admin table
            };
        }
        return null;
    }).filter(record => record !== null); // Remove null values (non-matching records)

    if (matchedRecords.length > 0) {
        res.status(200).json({
            message: 'Matched records based on serviceid',
            matchedRecords,
        });
    } else {
        res.status(404).json({ message: 'No matching serviceid found between tables' });
    }
} catch (err) {
    console.error(err);
    res.status(500).send('Error fetching records from Airtable');
}
};