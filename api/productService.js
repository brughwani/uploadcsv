const Airtable = require('airtable');

module.exports = async (req, res) => {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { category, getCategories, getAllProducts } = req.query;

    // Get all categories
    if (getCategories === 'true') {
      const categories = new Set();
      
      await base('Products')
        .select({
          view: "Grid view"
        })
        .eachPage((records, fetchNextPage) => {
          records.forEach(record => {
            const category = record.get('Category');
            if (category) {
              categories.add(category);
            }
          });
          fetchNextPage();
        });

      return res.status(200).json(Array.from(categories));
    }

    // Get all products grouped by category
    if (getAllProducts === 'true') {
        const productsByBrand = {};
      
      //const productsByCategory = {};
      
      await base('Products')
        .select({
          view: "Grid view"
        })
        .eachPage((records, fetchNextPage) => {
          records.forEach(record => {

            const brand=record.get('Brand name')
            const productName= record.get('Product Name')
            const category=record.get('Category')

            if (!productsByBrand[brand]) {
                productsByBrand[brand] = {};
              }
              if (!productsByBrand[brandName][category]) {
                productsByBrand[brandName][category] = [];
              }
              productsByBrand[brandName][category].push({
                id: record.id,
                name: productName
            });
            
            // const productInfo = {
            //   id: record.id,
             
            // };
            
            // if (!productsByBrand[brand]) {
            //     productsByBrand[brand] = {};
            //   }
              
            //   // Initialize category array within brand if it doesn't exist
            //   if (!productsByBrand[brand][category]) {
            //     productsByBrand[brand][category] = [];
            //   }
              
            //   // Add product to appropriate brand and category
            //   productsByBrand[brand][category].push(productInfo);
        
            
          });
          fetchNextPage();
          switch(level) {
            case 'brands':
              response = Object.keys(productsByBrand);
              break;
            case 'categories':
              response = brand ? Object.keys(productsByBrand[brand] || {}) : [];
              break;
            case 'products':
              response = brand && category ? productsByBrand[brand]?.[category] || [] : [];
              break;
            default:
              response = productsByBrand;
          }

      return res.status(200).json(response);
    })
    }
    // // Get products by specific category
    // if (category) {
    //   const records = [];
    //   await new Promise((resolve, reject) => {
    //     base('Products')
    //       .select({
    //         filterByFormula: `{Category} = "${category}"`,
    //         view: "Grid view"
    //       })
    //       .eachPage(
    //         function page(recordBatch, fetchNextPage) {
    //           recordBatch.forEach(record => {
    //             records.push({
    //               id: record.id,
    //               productName: record.get('Product Name'),
    //               category: record.get('Category')
    //             });
    //           });
    //           fetchNextPage();
    //         },
    //         function done(err) {
    //           if (err) reject(err);
    //           else resolve();
    //         }
    //       );
    //   });

    //   return res.status(200).json(records);
    // }

    // If no parameters provided, return error
   // res.status(400).json({ error: 'Missing required query parameters' });
    }
   catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: 'Server error' });
  }
  }
