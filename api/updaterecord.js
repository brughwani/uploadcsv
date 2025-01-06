const Airtable = require('airtable');

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

async function getCurrentRecordDetails(recordId) {
  try {
    const record = await base('admin').find(recordId);
    return {
      currentStatus: record.fields.Status || null,
      currentAllotment: record.fields['alloted to'] || null
    };
  } catch (error) {
    console.error('Error fetching record details:', error);
    throw error;
  }
}
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const fieldName = 'Status';
    const newValue = 'Open';

  
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
      const { recordId } = req.query;
      if (!recordId) {
          return res.status(400).json({ error: 'Record ID is required' });
      }

      try {
          const record = await base('admin').find(recordId);
          return res.status(200).json({
              currentStatus: record.fields.Status || "",
              currentAllotment: record.fields['alloted to'] || "",
              recordId: record.id
          });
      } catch (error) {
          console.error('Error fetching record:', error);
          return res.status(500).json({ error: error.message });
      }
  }
  
    if (req.method !== 'PATCH') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const updates = req.body;
        const recordsToUpdate = [updates];

        // Validate status if it's being updated
        if (updates.fields && updates.fields.Status) {
            const allowedStatuses = ['Open', 'In Progress', 'Resolved'];
            if (!allowedStatuses.includes(updates.fields.Status)) {
                return res.status(400).json({ error: 'Invalid status value' });
            }
        }

        // If this is an allotment update, redirect to the allotment endpoint
        if (recordsToUpdate.some(record => record.fields && record.fields['alloted to'])) {

          await base('admin').update([{id:recordsToUpdate[0]['id'],fields:{[fieldName]:newValue}}])


            // const response = await fetch(`/api/updaterecord/${updates.id}/allot`, {
            //     method: 'PATCH',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(updates)
            // });
            // const data = await response.json();

          //  return res.status(200).json(data);
        }

        // Handle regular updates (including status updates)
        const updatedRecords = await base('admin').update(recordsToUpdate);
        res.status(200).json({
            message: 'Records updated successfully!',
            updatedRecords,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}






