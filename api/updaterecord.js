const Airtable = require('airtable');

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

async function getCurrentRecordDetails(recordIds) {
  try {
    if (!recordIds) {
      throw new Error('recordIds is required');
    }

    const recordIdsArray = Array.isArray(recordIds) ? recordIds : recordIds.split(',');
    
    // const records = await base('admin')
    //   .select({
    //     filterByFormula: `OR(${recordIdsArray.map(id => `RECORD_ID()='${id}'`).join(',')})`
    //   })
    //   .all();
    const records = await base('admin')
    .select({
      filterByFormula: `OR(${recordIdsArray.map(id => `RECORD_ID()='${id}'`).join(',')})`,
      fields: ['Status', 'alloted to'] // Only fetch needed fields
    })
    .all();

    if (!records || records.length === 0) {
      throw new Error('No records found');
    }

    return records.map(record => ({
      recordId: record.id,
      currentStatus: record.fields.Status || null,
      currentAllotment: record.fields['alloted to'] || null
   
      // ...(fields.includes('Status') && { currentStatus: record.fields.Status || null }),
      // ...(fields.includes('alloted to') && { currentAllotment: record.fields['alloted to'] || null })
    }));
  } catch (error) {
    console.error('Error fetching record details:', error);
    throw error;
  }
}
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // const fieldName = 'Status';
    // const newValue = 'Open';

  
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
      const { recordIds } = req.query;
      if (!recordIds) {
          return res.status(400).json({ error: 'Record IDs required' });
      }

      try {
      //  const recordIdsArray = Array.isArray(recordIds) ? recordIds : recordIds.split(',');
      const currentDetails = await getCurrentRecordDetails(recordIds);
      return res.status(200).json({success:true,currentDetails});
    // const records = await base('admin')
    //   .select({
    //     filterByFormula: `OR(${recordIdsArray.map(id => `RECORD_ID()='${id}'`).join(',')})`
    //   })
    //   .all();

    // return records.map(record => ({
    //   recordId: record.id,
    //   ...(fields.includes('Status') && { currentStatus: record.fields.Status || null }),
    //   ...(fields.includes('alloted to') && { currentAllotment: record.fields['alloted to'] || null })
    // }));
      } catch (error) {
          console.error('Error fetching record:', error);
          return res.status(500).json({ error: error.message });
      }
  }

  if(req.method === 'PATCH') {
  
    if (req.method !== 'PATCH') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const updates = req.body;
        if (!updates.id || !updates.fields) {
          return res.status(400).json({ error: 'Invalid update format' });
        }
        const recordToUpdate = {
          id: updates.id,
          fields: updates.fields
        };

     //   const recordsToUpdate = [updates];

     //   const currentDetails = await getCurrentRecordDetails(updates.id);
  

        // Validate status if it's being updated
    //     // if (updates.fields && updates.fields.Status) {
    //     //     const allowedStatuses = ['Open', 'In Progress', 'Resolved'];
    //     //     if (!allowedStatuses.includes(updates.fields.Status)) {
    //     //         return res.status(400).json({ error: 'Invalid status value' });
    //     //     }
    //     // }
    //     // // If this is an allotment update, redirect to the allotment endpoint
    //     // if (recordsToUpdate.some(record => record.fields && record.fields['alloted to'])) {
    //     //   await base('admin').update([{id:recordsToUpdate[0]['id'],fields:{[fieldName]:newValue}}])
    //     // }

    //     // Handle regular updates (including status updates)
    //     const updatedRecords = await base('admin').update(recordsToUpdate);
    //     res.status(200).json({
    //         message: 'Records updated successfully!',
    //         updatedRecords,
    //     });

   // const updates = req.body;
    // if (!Array.isArray(updates)) {
    //   return res.status(400).json({ error: 'Updates must be an array' });
    // }

    // Validate status for all updates
    const allowedStatuses = ['Open', 'In Progress', 'Resolved'];
    const invalidUpdates = updates.filter(
      update => update.fields?.Status && !allowedStatuses.includes(update.fields.Status)
    );

    if (invalidUpdates.length > 0) {
      return res.status(400).json({ error: 'Invalid status value found in updates' });
    }

    const updatedRecords = await base('admin').update(recordsToUpdate);
    
    return res.status(200).json({
      message: 'Records updated successfully',
      records: updatedRecords
    });



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
}







