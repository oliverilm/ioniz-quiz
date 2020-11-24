import React from "react"
import { IonCheckbox, IonIcon, IonInput} from '@ionic/react';
import {closeOutline} from "ionicons/icons"

interface Answer {
    id: number,
    value: string,
    correct: boolean,
    question?: number
}

interface Props {
    currentAnswers: Answer[],
    setPending: Function,
    setShowAlert: Function,
    onCheck: Function,
    onAnswerChange: Function
}
const CreateAnswersList: React.FC<Props> = ({currentAnswers, setPending, setShowAlert, onCheck, onAnswerChange}) => {

    const renderAnswers = () => {
        return currentAnswers.map((answer, i) => {
          return (
            <div key={i} style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                <IonInput 
                  value={answer.value} 
                  placeholder="Answer option"
                  type="text"
                  onIonChange={e => {onAnswerChange(answer.id, e.detail.value || "")}}></IonInput>
                <IonCheckbox 
                  slot="end" 
                  color="primary" 
                  checked={answer.correct}
                  onIonChange={(e) => {
                    onCheck(answer.id)
                  }}/>
                <IonIcon 
                  icon={closeOutline} 
                  style={{ fontSize: "2em", marginLeft: ".7em"}}
                  onClick={() => {
                    setPending(answer.id)
                    setShowAlert(true)
                  }} />
    
                  
            </div>
          )
        })
      }

      return (
          <>
          {renderAnswers()}
          </>
      )
}

export default CreateAnswersList;