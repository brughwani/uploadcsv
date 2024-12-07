const Airtable = require('airtable');

// Configure the Airtable base with your API key and base ID
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {
    // Extract query parameters
    const {
        name = null,
        phone = null,
        dealer = null,
        location = null,
        fromdate = null,
        todate = null,
        status = null,
        productcategory = null,
        productname = null,
        allotment = null,
        servicetype = null,
        sourceby = null
    } = req.query;

    // Build filter formula dynamically based on provided parameters
    let filterFormulaParts = [];

    if (fromdate) {
        filterFormulaParts.push(`IS_AFTER({date and time of complain}, "${fromdate}")`);
    }
    if (todate) {
        filterFormulaParts.push(`IS_BEFORE({date and time of complain}, "${todate}")`);
    }
    if (name) {
        filterFormulaParts.push(`SEARCH("${name}", {Name}) > 0`);
    }
    if (phone) {
        filterFormulaParts.push(`SEARCH("${phone}", {Phone Number}) > 0`);
    }
    if (location && location !== 'Select a location') {
        filterFormulaParts.push(`SEARCH("${location}", {Location}) > 0`);
    }
    if (dealer && dealer !== 'Select a dealer') {
        filterFormulaParts.push(`SEARCH("${dealer}", {Dealer}) > 0`);
    }
    if (status) {
        filterFormulaParts.push(`SEARCH("${status}", {Status}) > 0`);
    }
    if (productcategory && productcategory !== 'Select a category') {
        filterFormulaParts.push(`SEARCH("${productcategory}", {category}) > 0`);
    }
    if (productname && productname !== 'Select a product') {
        filterFormulaParts.push(`SEARCH("${productname}", {product name}) > 0`);
    }
    if (allotment && allotment !== 'Select an employee') {
        filterFormulaParts.push(`SEARCH("${allotment}", {Allotted to}) > 0`);
    }
    if (servicetype) {
        filterFormulaParts.push(`SEARCH("${servicetype}", {Service type}) > 0`);
    }
    if (sourceby && sourceby !== 'Select an option') {
        filterFormulaParts.push(`SEARCH("${sourceby}", {Source by}) > 0`);
    }

    // Combine all parts into a single formula
    const filterFormula = `AND(${filterFormulaParts.join(', ')})`;

    try {
        const records = await base('admin').select({
            filterByFormula: filterFormula,
            maxRecords: 3,
            view: "Grid view"
        }).all();

        // Process retrieved records
        if (records.length > 0) {
            const retrievedRecords = records.map(record => ({
                id: record.get('Complain Number'),
                compcode: record.get('Complain Number'),
                Phone: record.get('Phone Number'),
                Name: record.get('Customer Name'),
                Dealer: record.get('Dealer'),
                Location: record.get('Location'),
                Status: record.get('Status'),
                "complain type": record.get("complain type"),
                "date and time of complain": record.get('date and time of complain'),
                "category": record.get('category'),
                "product name": record.get('product name'),
                "allotted to": record.get('allotted to'),
                "Service type": record.get('Request type'),
            }));

            res.status(200).json(retrievedRecords);
        } else {
            res.status(404).json({ message: 'No records found for that filter' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching records from Airtable');
    }
}