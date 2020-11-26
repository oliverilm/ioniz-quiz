
export interface Quiz {
    name: string,
    show: boolean,
    id: number,
    color: string
    questions: []
}

export interface Question {
    id: number,
    answers: Answer[]
    quiz: number
    question_value: string
}

export interface Answer {
    id: number,
    value: string,
    correct: boolean,
    question?: number,
    answer_correct?: boolean
}

export interface GameProps {
    quiz: Quiz,
    endQuiz: Function,
    onAnswer: Function,
}

export const colorMap:{ [key:string] : string } = {
    "#3880ff": "primary",
    "#3dc2ff": "secondary",
    "#5260ff": "tertiary",
    "#2dd36f": "success",
    "#ffc409": "warning",
    "#eb445a": "danger",
    "#222428": "dark",
    "#92949c": "medium",
    "#f4f5f8": "light",
  }
