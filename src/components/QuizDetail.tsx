import React, {useEffect, useState} from "react"
import { settingsOutline, createOutline,barChartOutline, share, trash, close } from "ionicons/icons"
import api from "../api";
import {  IonInput, IonItem, IonContent, IonHeader,IonActionSheet, IonPage, IonTitle, IonToolbar,IonTabButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonButton, IonLabel, IonTextarea, IonCheckbox } from '@ionic/react';
import {Question, Quiz, Answer, GameProps, colorMap} from "../utils/interface"
import Popup from "./Popup"
import ColorPicker from "./ColorPicker";
import {closeOutline} from "ionicons/icons"




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
    const [question, setQuestion] = useState<Question>()
    // const [editedQuestions, setEditedQuestions] = useState<Question[]>()
    
    const save = () => {
        console.log("save data")
    }

    const renderQuestionSquares = () => {
        return quiz.questions.map((q, i) => {
            return (
                <div 
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: "14vw",
                        minHeight: "14vw",
                        border: question === q ? `1px solid ${color}` : "1px solid #ccc",
                        backgroundColor: question === q ? `${color}99` : "#fff",
                        borderRadius: "4px",
                        margin: "5px"
                    }}
                    onClick={() => {
                        setQuestion(q)
                    }}>
                    { i + 1 }
                </div>
            )
        })
    }

    const renderQuestionAnswers = () => {
        return question?.answers.map(ans => {
            return (
                <IonItem style={{ display: "flex", flexDirection: "row"}}>
                    <IonInput value={ans.value} />
                    <IonCheckbox checked={ans.correct} />
                    <IonIcon icon={closeOutline}/>
                </IonItem>
            )
        })
    }

    const Label: React.FC<{name: string}> = ({name}) => <IonLabel style={{color: "#ccc"}} position="fixed">{name}</IonLabel>

    return (
        <>
        {open ? (
        <Popup isOpen={open} onClose={onClose} saveText={`Save ${quiz.name}`} onSave={save}>
            
            <IonItem>
                <Label name={"Quiz Name"}/>
                <IonInput value={text} onIonChange={e => setText(e.detail.value || "")}></IonInput>
            </IonItem>

            <IonItem>
                <Label name={"Color"}/>
                <ColorPicker 
                    currentColor={color}
                    style={{
                        position: "absolute",
                        right: "0",
                        top: "10px"
                    }} 
                    onChange={setColor}/>
            </IonItem>
                
            <div style={{
                display: "flex",
                flexDirection: "row",
                // flexWrap: "wrap",
                overflow: "scroll",
                marginTop: "2em"
            }}>
                {renderQuestionSquares()}
            </div>

            {question ? (
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle style={{fontSize: 16}} contentEditable={true} spellCheck={false}>
                            <Label name={"Question"} />
                            <IonTextarea style={{ width: "auto"}} value={question?.question_value}></IonTextarea>
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        {renderQuestionAnswers()}
                    </IonCardContent>
                </IonCard>
            ) : (<></>)}


        </Popup>
        ): <></>}
        </>
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
                    <EditModal quiz={quiz} onClose={() => setShowModal(false)} open={showModal} />
                    

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