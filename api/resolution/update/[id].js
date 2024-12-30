const Airtable = require('airtable');

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { id } = req.query; // complaint ID

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'PATCH') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const { status, resolution_notes } = req.body;

        const updatedRecord = await base('admin').update([{
            id,
            fields: {
                'Status': status,
                'Resolution Notes': resolution_notes,
                'Resolution Date': new Date().toISOString()
            }
        }]);

        res.status(200).json({
            success: true,
            message: 'Resolution updated successfully',
            record: updatedRecord
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
