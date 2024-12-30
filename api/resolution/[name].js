const Airtable = require('airtable');

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {
    // ...existing code...

    const { name } = req.query; // karigar's name instead of ID

    // ...existing code...

    try {
        // Fetch records where alloted to matches karigar's name
        const records = await base('admin').select({
            filterByFormula: `{alloted to} = '${name}'`, // changed from id to name
            sort: [{field: "Created"}]
        }).all();

        // ...existing code...
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
