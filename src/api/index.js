import axios from "axios"

const apiUrl = "http://localhost:8000/api/"

const getRequest = (path) => {
    return axios.get(`${apiUrl}${path}`)
}


const postRequest = (path, content) => {
    return axios.post(`${apiUrl}${path}`, content)
}


export default {
    getQuizes: () => getRequest("quiz-list-create"),
    createQuiz: (name, color) => postRequest("quiz-list-create", { name, color }),
    deleteQuiz: (id) => postRequest("delete-quiz", { id }),

    getStats: () => getRequest("get-stats"),
    getQuiz: (pk) => getRequest(`quiz-detail/${pk}`),
    createQuestion: (id, question, answers) => postRequest(`add-answer`, { quizId: id, value: question, answers }),
    addStatistics: (quizId, answers) => postRequest("add-stat", {quizId, answers})
}