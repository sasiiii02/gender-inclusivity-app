import axiosInstance from "../api/axiosInstance";

export const getAllArticles = async () => {
    const response = await axiosInstance.get("/support/articles");
    return response.data;
};

export const getArticleById = async (id) => {
    const response = await axiosInstance.get(`/support/articles/${id}`);
    return response.data;
};

export const sendChatRequest = async (message) => {
    const response = await axiosInstance.post("/support/chat", { message });
    return response.data;
};
