import express from 'express';
const router = express.Router();
import { getNewsByDate, updateNews } from './newsController';

router.get('/', async (req, res) => {
  const { date } = req.query;
  try {
    const news = await getNewsByDate(date);
    res.json(news);
  } catch (error) {
    res.status(500).send('Error fetching news');
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    await updateNews(id, updatedData);
    res.send('News updated successfully');
  } catch (error) {
    res.status(500).send('Error updating news');
  }
});

export default router;
