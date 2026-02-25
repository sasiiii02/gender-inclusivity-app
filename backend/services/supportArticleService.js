import SupportArticle from "../models/SupportArticle.js";

// Create article
export const createArticleService = async (data, adminId) => {
  const article = await SupportArticle.create({
    ...data,
    createdBy: adminId,
  });

  return article;
};

// Get all published articles (with filter + search)
export const getAllArticlesService = async (query) => {
  const { search, category } = query;

  let filter = { isPublished: true };

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const articles = await SupportArticle.find(filter)
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return articles;
};

// Get single article (increment views)
export const getSingleArticleService = async (id) => {
  const article = await SupportArticle.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("createdBy", "name email");

  if (!article) {
    throw new Error("Article not found");
  }

  return article;
};

// Update article
export const updateArticleService = async (id, data) => {
  const article = await SupportArticle.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );

  if (!article) {
    throw new Error("Article not found");
  }

  return article;
};

// Delete article
export const deleteArticleService = async (id) => {
  const article = await SupportArticle.findByIdAndDelete(id);

  if (!article) {
    throw new Error("Article not found");
  }

  return article;
};