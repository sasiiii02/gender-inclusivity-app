import axiosInstance from "../api/axiosInstance";

/**
 * Fetch all report categories.
 */
export const getAllCategories = () => axiosInstance.get("/reports/categories");

/**
 * Create a new report category.
 */
export const createCategory = (name) => axiosInstance.post("/reports/categories", { name });

/**
 * Delete a report category.
 */
export const deleteCategory = (id) => axiosInstance.delete(`/reports/categories/${id}`);
