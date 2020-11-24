import React, {useEffect, useState} from "react"
import { settingsOutline, createOutline, trashBinOutline, shareOutline, share} from "ionicons/icons"
import api from "../api";
import { IonList, IonItem, IonLabel, IonContent, IonHeader, IonPopover, IonPage, IonTitle, IonToolbar,IonTabButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonButton } from '@ionic/react';


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


interface GameProps {
    quiz: Quiz,
    endQuiz: Function,
    onAnswer: Function,
}

interface Answer {
    id: number,
    value: string,
    correct: true,
    question: number
}
interface Props {
    questions: Question[]
}

const QuizSettings: React.FC = () => {
    const [showPopover, setShowPopover] = useState(false);

    return (
        <>
        <IonTabButton>
            <IonIcon icon={settingsOutline} onClick={() => {setShowPopover(true)}} />
        </IonTabButton>

        <IonPopover
            isOpen={showPopover}
            cssClass='my-custom-class'
            animated={true}
            onDidDismiss={e => setShowPopover(false)}>
            <IonList>
                <IonItem>
                    <IonIcon style={{marginRight: ".5em"}} icon={createOutline}/>
                    <IonLabel>Edit quiz</IonLabel>
                </IonItem>
                <IonItem>
                    <IonIcon style={{marginRight: ".5em"}} icon={shareOutline}/>
                    <IonLabel>Share</IonLabel>
                </IonItem>
                <IonItem>
                    <IonIcon style={{marginRight: ".5em"}} icon={trashBinOutline}/>
                    <IonLabel>Delete this quiz</IonLabel>
                </IonItem>
            </IonList>
        </IonPopover>
        </>
    )
}

const QuizDetail: React.FC<RouteInfo> = ({match}) => {
    const [quiz, setQuiz] = useState<Quiz>()
    const { id } = match.params;
    const [quizStarted, setQuizStarted] = useState<boolean>(false)
    const [answered, setAnswered] = useState<Answer[]>([])

    useEffect(() => {
        api.getQuiz(id).then(res => {
            setQuiz(res.data)
        })
    }, [id, setQuiz])

    const endQuiz = (answers: Answer[]) => {
        // send data to the backend to create a session and stats
        api.addStatistics(quiz?.id, answers).then(res => console.log(res))
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
                        <IonButton expand="block" fill="solid" onClick={() => {endQuiz(answered)}} >End quiz</IonButton>
                    </div>
                    ) : (
                        <div>
                            <QuizSettings />
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
                            endQuiz={endQuiz}
                            onAnswer={(answer: Answer)=>{
                                setAnswered(a => [...a, answer])
                            }}/>
                            
                    )}
                </>
            ) : <></>}
          
        </IonContent>
      </IonPage>
    );

}


function shuffle(array: any[]) {
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

const Game: React.FC<GameProps> = ({ quiz, endQuiz, onAnswer }) => {
    const [answered, setAnswered] = useState<Answer[]>([])
    const [shuffeledQuestions, setShuffeledQuestions] = useState<Question[]>(shuffle(quiz.questions))

    const getCorrect = () => answered.filter(ans => ans.correct)
    const getFalse = () => answered.filter(ans => !ans.correct)

    const getNextQuestion = () => {
        return shuffeledQuestions[answered.length]
    }

    const answerQuestion = (ans: Answer) => {
        onAnswer(ans)
        setAnswered([...answered, ans])
    }

    const renderQueston = () => {
        const question = getNextQuestion()
        if (question) {
            return <GameQuestion question={question} onAnswer={answerQuestion} />
        }
        else {
            endQuiz(answered)
        }

    }

    return (
        <div>
            {renderQueston()}
            <GameStats questions={quiz.questions} correct={getCorrect()} incorrect={getFalse()} />
        </div>
    )
}

interface StatProps {
    correct: Answer[]
    incorrect: Answer[]
    questions: Question[]
}

const GameStats: React.FC<StatProps> = ({correct, incorrect, questions}) => {
   
    return (
        <div style={{width: "100%", display: "flex", justifyContent: "center", position: "absolute", bottom: "4em"}}>
            <table>
                <thead>
                    <tr>
                        <th style={{padding: ".5em"}}>Correct</th>
                        <th style={{padding: ".5em"}}>Incorrect</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{padding: ".5em", textAlign: "center", color: "#4caf50"}}>{correct.length}</td>
                        <td style={{padding: ".5em", textAlign: "center", color: "#f44336"}}>{incorrect.length}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )

}
interface QuestionProps {
    question: Question
    onAnswer: Function
}

const GameQuestion: React.FC<QuestionProps> = ({question, onAnswer}) => {

    const [answered, setAnswered] = useState<boolean>(false)

    const renderAnswers = () => {
        return question.answers.map(ans => 
            <IonCard 
                key={ans.id}
                style={{
                    color: "black", 
                    backgroundColor: answered ? ans.correct ? "#4caf50" : "#f44336" : "#e0e0e0", 
                    pointerEvents: answered ? "none" : ""
                }}
                onClick={() => {
                    setTimeout(() => {
                        onAnswer(ans)
                        setAnswered(false)
                    }, 1000)
                    setAnswered(true)
                }}>
                <IonCardContent>
                    {ans.value}
                </IonCardContent>
            </IonCard>
        )
    }

    return (
        <div>
            <IonCard>
            <IonCardHeader>
                <IonCardTitle>{question.question_value}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                <div style={{margin: "1em"}}>
                    {renderAnswers()}
                </div> 
            </IonCardContent>
            </IonCard>
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