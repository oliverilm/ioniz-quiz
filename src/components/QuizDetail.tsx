import React, {useEffect, useState} from "react"
import { settingsOutline} from "ionicons/icons"
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonTabButton } from '@ionic/react';
import api from "../api";


interface RouteInfo { match: {params: {id: string} }}

interface Quiz {
    name: string,
    show: boolean,
    id: number,
    questions: []
}

interface Question {
    id: number,
    answers: Answer[]
    quiz: number
    question_value: string
}

interface Props {
    questions: Question[]
}

const QuizDetail: React.FC<RouteInfo> = ({match}) => {
    const [quiz, setQuiz] = useState<Quiz>()
    const { id } = match.params;
    const [quizStarted, setQuizStarted] = useState<boolean>(false)
    
    useEffect(() => {
        api.getQuiz(id).then(res => {
            console.log(res.data)
            setQuiz(res.data)
        })
    }, [id, setQuiz])

    const endQuiz = () => {
        setQuizStarted(!quizStarted)
    }

    return (
        <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <div>
                        {quiz?.name}
                    </div>
                    {quizStarted ? (
                        <div>
                        <IonButton expand="block" fill="solid" onClick={() => {setQuizStarted(!quizStarted)}} >End quiz</IonButton>
                    </div>
                    ) : (
                        <div>
                            <IonTabButton href={`/settings/${id}`}>
                                <IonIcon icon={settingsOutline} />
                            </IonTabButton>
                        </div>
                    )}
                    
                </div>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            {quiz ? (
                <>
                    {!quizStarted ? (
                        <>
                            <IonHeader collapse="condense">
                                <IonToolbar>
                                <IonTitle size="large">{id}</IonTitle>
                                </IonToolbar>
                            </IonHeader>

                            <IonButton expand="block" fill="solid" onClick={() => {setQuizStarted(!quizStarted)}} >Start quiz</IonButton>
                            <QuestionsPreview  questions={quiz?.questions || []}/> 
                        </>
                    ) : (
                        <Game 
                            quiz={quiz} 
                            endQuiz={endQuiz}/>
                    )}
                </>
            ) : <></>}
          
        </IonContent>
      </IonPage>
    );

}

interface GameProps {
    quiz: Quiz,
    endQuiz: Function
}

interface Answer {
    id: number,
    value: string,
    correct: true,
    question: number
}

function shuffle(array: Question[]) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

const Game: React.FC<GameProps> = ({ quiz, endQuiz }) => {
    const [answered, setAnswered] = useState<Answer[]>([])
    const [shuffeledQuestions, setShuffeledQuestions] = useState<Question[]>(shuffle(quiz.questions))
    const [currentQuestion, setCurrentQuestion] = useState<Question>(shuffeledQuestions[0]);

    const getCorrect = () => answered.filter(ans => ans.correct)
    const getFalse = () => answered.filter(ans => !ans.correct)

    const getNextQuestion = () => {
        return shuffeledQuestions[answered.length]
    }

    const answerQuestion = (ans: Answer) => {
        setAnswered([...answered, ans])
    }

    const renderQueston = () => {
        const question = getNextQuestion()
        try {
            return (
                <div onClick={() => {
                    answerQuestion(question.answers[0])
                }}>
                    {question.question_value}
                </div>
            ) 
        } catch (err) {
            endQuiz()
        }

    }

    return (
        <div>
            {renderQueston()}
        </div>
    )
}



const QuestionsPreview: React.FC<Props> = ({ questions }) => {

    const renderQuestionsPreview = () => {
        if (questions.length > 0) {
            return questions.map((question, index) => {
                return (
                <div key={question.id}>
                    <p><b>{index + 1}.</b> <i>{question.question_value}</i></p>
                </div>
                )
            })
        } else {
            return <div style={{width: "100%", textAlign: "center", marginTop: "50px"}}>No questions added</div>
        }
        
    }

    return (
        <div style={{margin: "10px"}}>
            {renderQuestionsPreview()}
        </div>
    )
}

export default QuizDetail