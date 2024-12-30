const Airtable = require('airtable');

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
  
    if (req.method !== 'PATCH') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const updates = req.body;
        const recordsToUpdate = [updates];

        // If this is an allotment update, redirect to the allotment endpoint
        if (recordsToUpdate.some(record => record.fields && record.fields['alloted to'])) {
            const response = await fetch(`/api/updaterecord/${updates.id}/allot`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });
            const data = await response.json();
            return res.status(200).json(data);
        }

        // Handle regular updates
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






