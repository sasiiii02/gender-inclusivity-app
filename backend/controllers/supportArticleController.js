import {
  createArticleService,
  getAllArticlesService,
  getSingleArticleService,
  updateArticleService,
  deleteArticleService,
} from "../services/supportArticleService.js";

export const createArticle = async (req, res) => {
  try {
    const article = await createArticleService(req.body, req.user._id);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const articles = await getAllArticlesService(req.query);
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleArticle = async (req, res) => {
  try {
    const article = await getSingleArticleService(req.params.id);
    res.status(200).json(article);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const article = await updateArticleService(req.params.id, req.body);
    res.status(200).json(article);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    await deleteArticleService(req.params.id);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};