import React, {useState, useEffect} from "react"
import { IonContent, IonItem, IonLabel } from '@ionic/react';
import { IonAvatar } from '@ionic/react';
import { IonProgressBar } from '@ionic/react';


import api from '../api/index';
interface Quiz {
    name: string
    id: number
    color: string
}

type Props = {
    bg: string,
    color: string,
    value: string
}
const Avatar: React.FC<Props> = ({bg, color, value}) => {
    return (
        <IonAvatar style={{display:"flex", justifyContent: "center", alignItems: "center", background: bg, color: color, borderRadius: "50%", marginRight: "1em"}}>
            {value.substr(0,2).toUpperCase()}
        </IonAvatar>
    )
}

export const QuizList: React.FC = () => {
    const [quizes, setQuizes] = useState<Quiz[]>([])
    
    useEffect(() => {
        api.getQuizes().then(res => {
            setQuizes(res.data)
        })
    }, [setQuizes])

    

    const renderQuizes = () => {
        return quizes.map(quiz => {
            return (
            <IonItem key={quiz.id} href={`/tab1/${quiz.id}`} className="ion-activated" >
                <Avatar bg={quiz.color} color={"#fff"} value={quiz.name}/>
                <IonLabel>{quiz.name}</IonLabel>
            </IonItem>
            )
        })
    }

    return (
        <IonContent>
            {quizes.length > 0 ? renderQuizes() :     <IonProgressBar type="indeterminate"></IonProgressBar>}
        </IonContent>
        )
}

