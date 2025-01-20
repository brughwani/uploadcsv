const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIRESTORE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newlines
    clientEmail: process.env.FIRESTORE_CLIENT_EMAIL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
  const firestore = admin.firestore();

// module.exports = async (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
//     if (req.method === 'OPTIONS') {
//       res.status(200).end();
//       return;
//     }
  
//     if (req.method !== 'GET') {
//       res.status(405).send('Method Not Allowed');
//       return;
//     }
  

     // records.forEachconst { Firestore } = require('@google-cloud/firestore');
  
  // Initialize Firestore
 // const firestore = new Firestore();
  
  module.exports = async (req, res) => {
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
        
      const { level, brand, category } = req.query;
      const productsByBrand = {};
      let response = {};
  
      const records = await firestore.collection('Products').get();
      const snapshot = await firestore.collection('Products').get();
      snapshot.forEach(doc => {
        const data = doc.data();
        const brandName = data['Brand'];
        const categoryName = data['Category'];
        const productName = data['Product name'];
  
        if (!productsByBrand[brandName]) {
          productsByBrand[brandName] = {};
        }
        if (!productsByBrand[brandName][categoryName]) {
          productsByBrand[brandName][categoryName] = [];
        }
        productsByBrand[brandName][categoryName].push({
          id: doc.id,
          name: productName,
        });
      });
  
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
    } 
  

catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: 'Server error' });
  }
}