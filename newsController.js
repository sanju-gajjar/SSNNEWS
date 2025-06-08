import News from './newsModel';

export const getNewsByDate = async (date) => {
  return await News.find({ date });
};

export const updateNews = async (id, updatedData) => {
  return await News.findByIdAndUpdate(id, updatedData, { new: true });
};
