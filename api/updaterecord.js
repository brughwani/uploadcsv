const Airtable = require('airtable');

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

async function getCurrentRecordDetails(recordIds) {
  try {
    if (!recordIds) {
      throw new Error('recordIds is required');
    }

    const recordIdsArray = Array.isArray(recordIds) ? recordIds : recordIds.split(',');
    
   
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
   
      } catch (error) {
          console.error('Error fetching record:', error);
          return res.status(500).json({ error: error.message });
      }
  }

  if(req.method === 'PATCH') {
  
    
    try {
        const updates = req.body;
        if (!updates.id || !updates.fields) {
          return res.status(400).json({ error: 'Invalid update format' });
        }
        // const recordToUpdate = {
        //   id: updates.id,
        //   fields: updates.fields
        // };

        const batch = base('admin').batch();
        updates.forEach(update => batch.update(update.id, update.fields));
    
        const updatedRecords = await batch.run();
    
   
//    const updatedRecords = await base('admin').update(updates)

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







