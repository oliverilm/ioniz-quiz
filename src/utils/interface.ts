
export interface Quiz {
    name: string,
    show: boolean,
    id: number,
    questions: []
}

export interface Question {
    id: number,
    answers: Answer[]
    quiz: number
    question_value: string
}

export interface GameProps {
    quiz: Quiz,
    endQuiz: Function
}

export interface Answer {
    id: number,
    value: string,
    correct: boolean,
    question?: number
}