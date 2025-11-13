const mongoose = require('mongoose');

// Connect to MongoDB (same as server)
async function resetLikes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://swadeshsandesh:2t9Z4PmygBU41RYV@clusterssn.rasxlii.mongodb.net/?retryWrites=true&w=majority&appName=ClusterSSN');
    const News = require('./server/models/News');

    console.log('Resetting all likes to 0...');

    // Reset all likes to 0
    const result = await News.updateMany({}, { $set: { likes: 0 } });

    console.log(`Updated ${result.modifiedCount} documents`);
    console.log('All likes have been reset to 0');

    // Verify the changes
    const sample = await News.findOne({}, { likes: 1, title: 1 });
    console.log('Sample document after reset:', JSON.stringify(sample.likes));

    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    mongoose.disconnect();
  }
}

resetLikes();

checkLikes();