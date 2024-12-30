const Airtable = require('airtable');

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { id } = req.query; // Get the record ID from the URL
    const fieldName = 'Status';
    const newValue = 'Open';

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'PATCH') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const { fields } = req.body;
        
        // Update the status
        await base('admin').update([{
            id,
            fields: {
                [fieldName]: newValue,
                ...fields
            }
        }]);

        res.status(200).json({
            message: 'Complaint allotted successfully!'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
