import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: String,
  tag: String,
  date: Date,
  image: String,
});

export default mongoose.model('News', newsSchema);
