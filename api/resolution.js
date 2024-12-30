const Airtable = require('airtable');

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // GET /api/resolution?karigar=name - fetch complaints for karigar
    if (req.method === 'GET') {
        const { karigar } = req.query;
        try {
            const records = await base('admin').select({
                filterByFormula: `{alloted to} = '${karigar}'`,
                view: 'Grid view'
            }).all();

            const allottedComplaints = records.map(record => ({
                id: record.id,
                complaintNo: record.get('Complaint no'),
                status: record.get('Status'),
                description: record.get('Description'),
                createdAt: record.get('Created'),
                customerName: record.get('Customer Name'),
                contactNo: record.get('Contact no'),
                address: record.get('Address')
            }));

            return res.status(200).json({ success: true, complaints: allottedComplaints });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // PATCH /api/resolution - update resolution status
    if (req.method === 'PATCH') {
        const { id, status, resolution_notes } = req.body;
        try {
            const updatedRecord = await base('admin').update([{
                id,
                fields: {
                    'Status': status,
                    'Resolution Notes': resolution_notes,
                    'Resolution Date': new Date().toISOString()
                }
            }]);

            return res.status(200).json({
                success: true,
                message: 'Resolution updated successfully',
                record: updatedRecord
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
