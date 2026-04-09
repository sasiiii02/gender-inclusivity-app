import axiosInstance from "../api/axiosInstance";

/**
 * Fetch all support articles.
 */
export const getAllArticles = (params = {}) => axiosInstance.get("/support", { params });

/**
 * Fetch a single support article by ID.
 */
export const getArticleById = (id) => axiosInstance.get(`/support/${id}`);

/**
 * Create a new support article. Handles both JSON and FormData (for PDF).
 */
export const createArticle = (data) => {
    const isFormData = data instanceof FormData;
    return axiosInstance.post("/support", data, {
        headers: {
            "Content-Type": isFormData ? "multipart/form-data" : "application/json"
        }
    });
};

/**
 * Update an existing support article. Handles both JSON and FormData.
 */
export const updateArticle = (id, data) => {
    const isFormData = data instanceof FormData;
    return axiosInstance.put(`/support/${id}`, data, {
        headers: {
            "Content-Type": isFormData ? "multipart/form-data" : "application/json"
        }
    });
};

/**
 * Delete a support article.
 */
export const deleteArticle = (id) => axiosInstance.delete(`/support/${id}`);
