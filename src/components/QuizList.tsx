import React, {useState, useEffect} from "react"
import { IonContent, IonItem, IonLabel } from '@ionic/react';
import { IonAvatar } from '@ionic/react';
import { IonProgressBar } from '@ionic/react';


import api from '../api/index';
interface Quiz {
    name: string
    id: number
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

    const getRandomColor = () => {
        const colors = [
            {bg: "#f44336", color: "#fff"},
            {bg: "#e91e63", color: "#fff"},
            {bg: "#9c27b0", color: "#fff"},
            {bg: "#673ab7", color: "#fff"},
            {bg: "#3f51b5", color: "#fff"},
            {bg: "#2196f3", color: "#fff"},
            {bg: "#009688", color: "#fff"},
            {bg: "#ff5722", color: "#fff"},
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    const renderQuizes = () => {
        return quizes.map(quiz => {
            const {bg, color} = getRandomColor()
            return (
            <IonItem key={quiz.id} href={`/tab1/${quiz.id}`} className="ion-activated" >
                <Avatar bg={bg} color={color} value={quiz.name}/>
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

