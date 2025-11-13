const { MongoClient } = require('mongodb');

async function resetLikes() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://swadeshsandesh:2t9Z4PmygBU41RYV@clusterssn.rasxlii.mongodb.net/?retryWrites=true&w=majority&appName=ClusterSSN';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('test'); // Replace with your database name
    const collection = database.collection('news');

    // Reset all likes to 0
    const result = await collection.updateMany(
      {}, // Match all documents
      { $set: { likes: 0 } } // Set likes to 0
    );

    console.log(`Updated ${result.modifiedCount} documents`);
    console.log('All likes have been reset to 0');

    // Verify one document
    const sample = await collection.findOne({}, { projection: { likes: 1, title: 1 } });
    console.log('Sample document after reset:', sample);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

resetLikes();