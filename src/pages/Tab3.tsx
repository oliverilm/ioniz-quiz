import React , {useState} from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonInput, IonItem, IonLabel, IonButton } from '@ionic/react';
import './Tab3.css';
import api from '../api';

interface Quiz {
  id: number,
  name: string,
  show: boolean
}

const Tab3: React.FC = () => {

  const [disabled, setDisabled] = useState<boolean>(false)
  const [name, setName] = useState("")
  const [createdQuiz, setCreatedQuiz] = useState<Quiz>()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create a new quiz</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{margin: 10}}>
        <IonItem>
            <IonLabel position="stacked">Quiz name</IonLabel>
            <IonInput disabled={disabled} value={name} placeholder="Quiz Name" onIonInput={(e) => {setName((e.target as HTMLTextAreaElement).value)}}> </IonInput>
          </IonItem>
          {name.length > 0 && !disabled ? (
              <IonButton expand="block" fill="solid" onClick={() => {
                api.createQuiz(name).then(res => {
                  setCreatedQuiz(res.data)
                  setDisabled(true)
                })
              }}>Create</IonButton>
            ) : <></>}

            {createdQuiz ? (
              <div>{JSON.stringify(createdQuiz)}</div>
            ) : <></>}
          </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
