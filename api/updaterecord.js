const Airtable = require('airtable');

// Configure the Airtable base with your API key and base ID
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);



module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const fieldName = 'Status'; // Change to your desired field name
    const newValue = 'Pending';
  
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    if (req.method !== 'PATCH') {
      res.status(405).send('Method Not Allowed');
      return;
    }

  
      if (req.method === 'PATCH') {
        var updates  = req.body;

      //  console.log('Updates:', updates);
    
        try {
          // const recordsToUpdate = updates.map(update => ({
          //   id: update.id,
          //   fields: update.fields,
          // }));
          // console.log('Request body:', req.body);
  // if (!Array.isArray(updates)) {
  //     return res.status(400).json({ error: 'Invalid input. Expected an array of updates.' });
  //   }
  const recordsToUpdate = [updates];
  //console.log(recordsToUpdate[0]['fields']['alloted to']);
  if(recordsToUpdate.some(
    (record) => record.fields && record.fields['alloted to']
  ))
  {
    base('admin').update([{id:recordsToUpdate[0]['id'],fields:{[fieldName]:newValue}}])
  }


    const updatedRecords = await base('admin').update(recordsToUpdate);

    res.status(200).json({
      message: 'Records updated successfully!',
      updatedRecords,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
          // console.log('Records to update:', recordsToUpdate);
    
        //   base('admin').update(updates, (err, update) => {
        //     if (err) {
        //       console.error(err);
        //       return res.status(500).json({ error: err.message });
        //     }
    
        //     res.status(200).json({ message: 'Records updated successfully!', update });
        //   });
        // } catch (error) {
        //   res.status(500).json({ error: error.message });
        // }
      } 
    }
    // const records = updates.map(({ recordId, fieldName, newValue }) => ({
    //     id: recordId,
    //     fields: { [fieldName]: newValue },
    //   }));
    
    //   try {
    //     const response = await fetch(url, {
    //       method: 'PATCH',
    //       headers: {
    //         Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ records }),
    //     });
    
    //     if (!response.ok) {
    //       const error = await response.json();
    //       return res.status(response.status).json({ error });
    //     }
    
    //     const updatedRecords = await response.json();
    //     res.status(200).json({ success: true, records: updatedRecords });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    //   }






