const Airtable = require('airtable');

module.exports = async (req, res) => {
  
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appoTE4TCM6nEPxJI');
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
  try {
    const locations = new Set(); // Using a Set to store unique categories
    let offset = 50;

const getRecords = async () => {
    

   const response = await base('Dealer')
      .select({
        view: "Grid view", // You can use other views if needed
        pageSize:100,
        offset:offset
      }).firstPage();

      response.forEach(record => {
            const location = record.get('locality');
            if (location) {
              locations.add(location); // Add locations to Set to ensure uniqueness
            }
          });

          offset = response.offset; // Update offset for the next page if it exists
          if (offset) {
            await getRecords(); // Recursively fetch the next page
          }
          getRecords(); // Fetch the next page of records
        };
        await getRecords();

        // Convert Set to Array and send the response
        res.status(200).json(Array.from(locations));
      } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: 'Server error' });
      }
    };
       
 
  
