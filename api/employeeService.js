const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {
  // Update CORS headers to include POST
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle POST request for adding employee
  if (req.method === 'POST') {
    try {
      if (!req.body.fields) {
        throw new Error('Missing fields object in request body');
      }

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

      const record = await base('Employee').create(data, {typecast: true});
      return res.status(200).json({ id: record.getId() });
    } catch (error) {
      console.error('Employee creation error:', error);
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  // Handle GET requests (existing functionality)
  if (req.method === 'GET') {
    try {
      const { 
        filterField, 
        filterValue, 
        getKarigars, 
        fields 
      } = req.query;

      // 1. Get all Karigars
      if (getKarigars === 'true') {
        const employees = await base('Employee').select({
          filterByFormula: `{Role} = 'Karigar'`,
          view: "Grid view",
          fields: ['First name']
        }).all();

        const result = employees.map(employee => ({
          id: employee.id,
          ...employee.fields
        }));

        return res.status(200).json(result);
      }

      // 2. Get employee by specific field filter
      if (filterField && filterValue) {
        const validFields = ['Phone', 'empcode', 'name'];
        if (!validFields.includes(filterField)) {
          return res.status(400).json({ 
            error: 'Invalid filtering field. Allowed fields are: ' + validFields.join(', ') 
          });
        }

        const records = await base('Employee').select({
          filterByFormula: `{${filterField}} = '${filterValue}'`,
     //     maxRecords: 3,
          view: "Grid view"
        }).all();

        const retrievedRecords = records.map(record => ({
          id: record.id,
          empcode: record.get('empcode'),
          Phone: record.get('Phone')
        }));

        if (retrievedRecords.length > 0) {
          return res.status(200).json(retrievedRecords);
        }
        return res.status(404).json({ message: 'No records found for that filter' });
      }

      // 3. Get all employees with selected fields
      if (fields) {
        let selectedFields = Array.isArray(fields) 
          ? fields 
          : fields.split(',').map(field => field.trim().replace(/[\[\]"']/g, ''));

        if (!selectedFields || selectedFields.length === 0) {
          return res.status(400).json({ message: 'No fields selected' });
        }

        const records = await base('Employee').select({
          fields: selectedFields,
          view: "Grid view"
        }).all();

        const employeesWithSelectedFields = records.map(record => {
          const selectedData = {};
          selectedFields.forEach(field => {
            selectedData[field] = record.get(field);
          });
          return {
            id: record.id,
            ...selectedData,
          };
        });

        if (employeesWithSelectedFields.length > 0) {
          return res.status(200).json(employeesWithSelectedFields);
        }
        return res.status(404).json({ message: 'No employee records found' });
      }

      // If no valid query parameters provided
      return res.status(400).json({ 
        error: 'Missing required query parameters. Use one of: getKarigars, filterField+filterValue, or fields' 
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // If neither GET nor POST
  return res.status(405).send('Method Not Allowed');
};
