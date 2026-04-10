import {
  createArticleService,
  getAllArticlesService,
  getSingleArticleService,
  updateArticleService,
  deleteArticleService,
} from "../services/supportArticleService.js";

// Controller for managing support articles in the help center

// Admin - create a new support article
export const createArticle = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.pdfUrl = `/uploads/pdf/${req.file.filename}`;
    }
    const article = await createArticleService(data, req.user._id);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Admin - get all support articles 
export const getAllArticles = async (req, res) => {
  try {
    const articles = await getAllArticlesService(req.query);
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Admin - get a single support article by ID
export const getSingleArticle = async (req, res) => {
  try {
    const article = await getSingleArticleService(req.params.id);
    res.status(200).json(article);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
// Admin - update a support article by ID
export const updateArticle = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.pdfUrl = `/uploads/pdf/${req.file.filename}`;
    }
    const article = await updateArticleService(req.params.id, data);
    res.status(200).json(article);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
// Admin - delete a support article by ID
export const deleteArticle = async (req, res) => {
  try {
    await deleteArticleService(req.params.id);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};