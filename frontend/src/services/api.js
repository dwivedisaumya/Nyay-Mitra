import axios from 'axios';

const API_URL = "http://localhost:8000/api/v1/documents";

export const processDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/process`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};