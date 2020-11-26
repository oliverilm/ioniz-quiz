import React , {useState} from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonInput, IonItem, IonLabel, IonButton } from '@ionic/react';
import api from '../api';
import { IonAlert, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonPopover} from '@ionic/react';
import CreateAnswersList from '../components/CreateAnswersList';
import { CirclePicker } from 'react-color';
import {Quiz, Answer, colorMap} from "../utils/interface"


interface ColorProps {
  onChange: Function,
  style?: Object
}


const ColorPicker: React.FC<ColorProps> = ({onChange, style}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [color, setColor] = useState<string>("#3880ff")
  
  return (
    <div style={style}>
      <IonPopover
        isOpen={showPopover}
        cssClass={"popover"}
        onDidDismiss={e => setShowPopover(false)}
      >
        <div style={{paddingBottom: "20px",width: "100%", height: "100%", display: "flex",flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
          <h3>Choose a color</h3>
          <div>
          <CirclePicker 
            width="220px"
            onChangeComplete={e => {setColor(e.hex); setShowPopover(false); onChange(e.hex)}}
            colors={[...Object.keys(colorMap)]}  />
          </div>
        </div>
      </IonPopover>
      <div
        style={{
          minWidth: "30px",
          minHeight: "30px",
          borderRadius: "50%",
          backgroundColor: color
        }} 
        onClick={() => setShowPopover(true)}>

      </div>
    </div>
  );

}

const Tab3: React.FC = () => {
  const [disabled, setDisabled] = useState<boolean>(false)
  const [name, setName] = useState("")
  const [createdQuiz, setCreatedQuiz] = useState<Quiz>()
  const [color, setColor] = useState<string>("#3880ff")

  const submit = () => {
    api.createQuiz(name, color).then(res => {
      setCreatedQuiz(res.data)
      setDisabled(true)
    })
  }

  const getColor = () => {
    return colorMap[color] || "primary"
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={getColor()}>
          <IonTitle>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <div>Create a new quiz</div>
              <div>
                {createdQuiz ? (
                <IonButton
                  size="small"
                  color="warning"
                  href={`/tab1/${createdQuiz.id}`}>
                  Finish  
                </IonButton>
                ) : <></>}
              </div>
            </div>


          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{margin: 10}}>
        <IonItem>
            <IonLabel position="stacked">Quiz name</IonLabel>
            <IonInput 
              disabled={disabled} 
              value={name}
              placeholder="Quiz Name" 
              onIonInput={(e) => {setName((e.target as HTMLTextAreaElement).value)}} />
              <ColorPicker style={{
                position: "absolute",
                right: "0",
                top: "20px"
              }} onChange={setColor}/>
          </IonItem>
          {name.length > 0 && !disabled ? (

              <IonButton 
                expand="block" 
                fill="solid" 
                onClick={submit}>
                  Create
              </IonButton>

            ) : <></>}

            {createdQuiz ? (
              <div><QuizQuestionForm quiz={createdQuiz}/></div>
            ) : <></>}
          </div>
      </IonContent>
    </IonPage>
  );
};

interface Props { quiz: Quiz }

const QuizQuestionForm: React.FC<Props> = ({quiz}) => {
  const [counter, setCounter] = useState<number>(0)
  const [currentAnswers, setCurrentAnswers] = useState<Answer[]>([
    {id: counter, value: "", correct: false}
  ])
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [question, setQuestion] = useState<string>()
  const [pending ,setPending ] = useState<number>(0)
  const [showSubmitAlert, setShowSubmitAlert] = useState<boolean>(false)

  const changeAnswerValue = (index: number, value?: string) => {
    const result: Answer[] = []
    const ans = currentAnswers.find(answer => answer.id === index)
    if (ans) {
      if (value) {
        console.log(value)
        ans.value = value || ""
        result.push(ans)
      }
    }

    const current = currentAnswers.map(obj => result.find(o => o.id === obj.id) || obj);
    setCurrentAnswers(current)
  }

  const changeCheckedValue = (index: number) => {
    const result: Answer[] = []
    const ans = currentAnswers.find(answer => answer.id === index)
    if (ans) {
      ans.correct = !ans.correct
      result.push(ans)
    }

    const current = currentAnswers.map(obj => result.find(o => o.id === obj.id) || obj);
    setCurrentAnswers(current)
  }

  const addAnswer = () => {
    const nextNumber = counter + 1
    setCounter(nextNumber)
    setCurrentAnswers(current => [...current, {id: nextNumber, value: "", correct: false}])
  }

  const deleteAnswer = () => {
    setCurrentAnswers(current => current.filter(r => r.id !== pending))
  }

  const getErrors = () => {
    const errors = []
    const hasCorrect = currentAnswers.filter(ans => ans.correct).length > 0
    const hasAnswers = currentAnswers.length > 0
    // const noEmptyValues = currentAnswers.filter(ans => ans.value !== "").length === 0

    if (!hasCorrect) {
      errors.push("No 'correct' answere marked!")
    }
    if (!hasAnswers) {
      errors.push("You must include atleast one answer!")
    }
    // if (!noEmptyValues) {
    //   errors.push("All answers must contain content!")
    // }
    return errors
  }

  const submit = async () => {
    const errors = getErrors()
    if (errors.length === 0) {
      api.createQuestion(quiz.id, question, currentAnswers).then(res => {
        // clear all fields
        const nextNumber = counter + 1
        setCounter(nextNumber)
        setCurrentAnswers([])
        setShowAlert(false)
        setQuestion("")
        setPending(0)
        setShowSubmitAlert(false)
      })
    } else {
      // display errors
      console.log(errors)
    }
  }

  return (
    <IonCard>

          <IonCardHeader>
            <IonCardSubtitle>Question</IonCardSubtitle>
            <IonInput 
              value={question} 
              placeholder="Question" 
              onIonInput={(e) => {setQuestion((e.target as HTMLTextAreaElement).value)}}
              style={{ fontSize: "20px", fontWeight: "bolder"}}
              />         
          </IonCardHeader>

          <IonCardContent>
            
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
              <IonButton 
                color="secondary"
                expand="full"
                style={{marginBottom: "1em", width: "50%"}}
                onClick={() => {
                  setShowSubmitAlert(true)
                }}>Submit</IonButton>

              <IonButton 
                color="primary"
                expand="full"
                style={{marginBottom: "1em"}}
                onClick={addAnswer}>Add a new answer</IonButton>
            </div>

              <CreateAnswersList 
                currentAnswers={currentAnswers}
                setPending={setPending}
                setShowAlert={setShowAlert}
                onCheck={changeCheckedValue}
                onAnswerChange={changeAnswerValue}
              />

            <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              cssClass='my-custom-class'
              header={'Confirm!'}
              message={`Do you delete this answer? `}
              buttons={[
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {}
                },
                {
                  text: 'Okay',
                  handler: deleteAnswer
                  
                }
              ]}
            />

            <IonAlert
              isOpen={showSubmitAlert}
              onDidDismiss={() => setShowSubmitAlert(false)}
              cssClass='my-custom-class'
              header={'Add question!'}
              message={`Do you want add this question with these answers`}
              buttons={[
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {}
                },
                {
                  text: 'Okay',
                  handler: submit
                }
              ]}
            />
          </IonCardContent>
        </IonCard>
  )
}

export default Tab3;
