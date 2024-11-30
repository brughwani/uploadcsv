// Import the required modules
const Airtable = require('airtable');

// Configure the Airtable base with your API key and base ID
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Define the Vercel function to handle the API request
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');


  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  
    // Define the specific fields you want to retrieve, e.g., 5 or 10 fields
   // const selectedFields = ['First Name', 'Last Name', 'empcode', 'Phone', 'salary', 'address', 'personal phone number', 'Role'];  // Add up to 10 fields here
   let selectedFields = req.query['fields[]']; // 'fields[]' is the key used in the query

   if (!selectedFields || selectedFields.length === 0) {
    return res.status(400).json({ message: 'No fields selected' });
  }
//  const fieldsArray = Array.isArray(selectedFields) ? selectedFields : [selectedFields];

  // if (typeof selectedFields === 'array') {
  //   // Convert a single field or a stringified array into an array
   
  //     selectedFields = JSON.parse(selectedFields);
  //   } else {
  //     // Single field
  //     selectedFields = [selectedFields];
  //   }
  console.log(selectedFields);
  // console.log(typeof selectedFields);
  // if (typeof selectedFields === 'string') {
  //   // Attempt to parse JSON if it looks like an array
  //   if (selectedFields.startsWith('[') && selectedFields.endsWith(']')) {
  //    // selectedFields = JSON.parse(selectedFields);
  //    selectedFields = selectedFields.slice(1, -1).split(',').map(field => field.trim());

  //   } else {
  //     // Treat as a single field
  //     selectedFields = [selectedFields];
  //   }
  // }
  console.log(typeof selectedFields);
  if (typeof selectedFields === 'string') {
    try {
      // Attempt to parse JSON
      selectedFields = JSON.parse(selectedFields);

    } catch (error) {
      // If parsing fails, check if the string starts and ends with square brackets
      if (selectedFields.startsWith('[') && selectedFields.endsWith(']')) {
        // Remove the square brackets and split the string into an array
        selectedFields = selectedFields.slice(1, -1).split(',').map(field => field.trim());
        
      } else {
        // Treat as a single field
        selectedFields = [selectedFields];
      }
    }
  }
  console.log(selectedFields);

    // Perform the select query with the specified fields
    const records = await base('Employee').select({
      fields: selectedFields,  // Fetch only the selected fields
      view: "Grid view"
    }).all();  // Use `.all()` to fetch all records


try
{
    // Process and return the response
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
      res.status(200).json(employeesWithSelectedFields);
    } else {
      res.status(404).json({ message: 'No employee records found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching employee records from Airtable');
  }

    // Process the retrieved records to include only the selected fields
//     const employeesWithSelectedFields = records.map(record => {
//       const selectedData = {};
//       fieldsArray.forEach(field => {
//         selectedData[field] = record.get(field);
//       });
//       return {
//         id: record.id,
//         ...selectedData
//       };
//     });

//     // Check if any records are found
//     if (employeesWithSelectedFields.length > 0) {
//       res.status(200).json(employeesWithSelectedFields);  // Send the selected employee data as JSON response
//     } else {
//       res.status(404).json({ message: 'No employee records found' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error fetching employee records from Airtable');
//   }
// };
}