import React, {useEffect, useState} from "react"
import { settingsOutline, createOutline,barChartOutline, share, trash, close } from "ionicons/icons"
import api from "../api";
import {  IonInput, IonModal, IonContent, IonHeader,IonActionSheet, IonPage, IonTitle, IonToolbar,IonTabButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonButton } from '@ionic/react';
import {Question, Quiz, Answer, GameProps, colorMap} from "../utils/interface"



interface RouteInfo { match: {params: {id: string} }}
interface Props { questions: Question[] }
interface EditProps { 
    quiz: Quiz;
    open: boolean;
    onClose: Function;
}


export const EditModal: React.FC<EditProps> = ({quiz, open, onClose }) => {
    const [text, setText] = useState<string>(quiz.name)
    const [color, setColor] = useState<string>(quiz.color)
    
    return (
      <IonContent>
        <IonModal isOpen={open} cssClass='my-custom-class'>
            <div style={{width: "100%", height: "100%"}}>
                <div style={{ color: "#888888", display: "flex", justifyContent: "space-between", margin: "0px 20px"}}>
                    <h5 onClick={() => onClose(false)}>Save {quiz.name} </h5>
                    <h5 onClick={() => onClose(false)}>Close</h5>
                </div>
                <div className={"content"} style={{margin: "1em"}} >
                
                <IonInput 
                    value={text} 
                    placeholder="Enter Input"
                    style={{
                        border: "1px solid #cccccc",
                        fontSize: 20,
                        borderRadius: "6px"
                    }} 
                    onIonChange={e => setText(e.detail.value!)}></IonInput>

                </div>
          </div>
        </IonModal>
      </IonContent>
    );
  };


const QuizDetail: React.FC<RouteInfo> = ({match}) => {
    const [quiz, setQuiz] = useState<Quiz>()
    const { id } = match.params;
    const [quizStarted, setQuizStarted] = useState<boolean>(false)
    const [answered, setAnswered] = useState<Answer[]>([])
    const [hasEnded, setHasEnded] = useState<boolean>(false)
    const [showActionSheet, setShowActionSheet] = useState<boolean>(false)
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        api.getQuiz(id).then(res => {
            setQuiz(res.data)
        })
    }, [id, setQuiz])

    const endQuiz = (answers: Answer[]) => {
        // send data to the backend to create a session and stats
        api.addStatistics(quiz?.id, answers).then(res => console.log(res))
        setQuizStarted(!quizStarted)
        setHasEnded(true)
    }

    return (
        <IonPage>
        <IonHeader>
          <IonToolbar color={quiz ? colorMap[quiz.color] : ""}>
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
                            <IonTabButton>
                                <IonIcon icon={settingsOutline} onClick={() => {setShowActionSheet(true)}} />
                            </IonTabButton>
                            <IonActionSheet
                                isOpen={showActionSheet}
                                onDidDismiss={() => setShowActionSheet(false)}
                                cssClass='my-custom-class'
                                buttons={[{
                                        text: 'Delete',
                                        role: 'destructive',
                                        icon: trash,
                                        handler: () => {
                                            console.log('Delete clicked');
                                        }
                                    }, {
                                        text: 'Share',
                                        icon: share,
                                        handler: () => {
                                            console.log('Share clicked');
                                        }
                                    }, {
                                        text: 'Statistics',
                                        icon: barChartOutline,
                                        handler: () => {
                                            setShowModal(true)
                                        }
                                    }, {
                                        text: 'Edit',
                                        icon: createOutline,
                                        handler: () => {
                                            setShowModal(true)
                                        }
                                    }, {
                                        text: 'Cancel',
                                        icon: close,
                                        role: 'cancel',
                                        handler: () => {
                                            
                                        }
                                    }
                                ]}
                            >
                            </IonActionSheet>
                        </div>
                    )}
                    
                </div>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            {hasEnded ? (
                <>
                    quiz ended
                </>
            ) : (
                <>
                {quiz ? (
                <>
                
                    {!quizStarted ? (
                        <>
                            {quiz.questions.length > 0 ? (
                                <>
                                    <IonHeader collapse="condense">
                                        <IonToolbar>
                                        <IonTitle size="large">{id}</IonTitle>
                                        </IonToolbar>
                                    </IonHeader>

                                    <IonButton expand="block" fill="solid" onClick={() => {setQuizStarted(!quizStarted)}} >Start quiz</IonButton>
                                </>    
                            ) : <></>}
                            <QuestionsPreview  questions={quiz?.questions || []}/> 
                            <EditModal quiz={quiz} onClose={() => setShowModal(false)} open={showModal} />

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
                </>
            )}
            
          
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
    const shuffeledQuestions: Question[] = shuffle(quiz.questions)

    const getNextQuestion = () => {
        if (shuffeledQuestions[answered.length]) {
            return shuffeledQuestions[answered.length]
        } 
    }

    const answerQuestion = (ans: Answer) => {
        onAnswer(ans)
        setAnswered([...answered, ans])      
    }

    const renderQueston = () => {
        const question = getNextQuestion()
        if (question !== undefined) {
            return <GameQuestion question={question} onAnswer={answerQuestion} />
        }
        endQuiz(answered)
    }

    return (
        <div>
            {renderQueston()}
            <GameStats questions={quiz.questions} answers={answered} />
        </div>
    )
}

interface StatProps {
    answers: Answer[]
    questions: Question[]
}

const GameStats: React.FC<StatProps> = ({answers}) => {

    const correct =  answers.filter(ans => ans.correct).length
    const incorrect = answers.filter(ans => !ans.correct).length
   
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
                        <td style={{padding: ".5em", textAlign: "center", color: "#4caf50"}}>{correct}</td>
                        <td style={{padding: ".5em", textAlign: "center", color: "#f44336"}}>{incorrect}</td>
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