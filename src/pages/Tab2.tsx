import React, {useState, useEffect} from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Answer } from '../utils/interface';
import api from '../api';
import Chart from "react-google-charts";


interface Stats {
  id: number
  questions_answered: Answer[]
  quiz_name: string
  datetime: Date
  quiz: number
  total_questions:number
}

const Tab2: React.FC = () => {

  const [stats, setStats] = useState<Stats[]>([]);
  useEffect(() => {
    let mounted = true
    if (mounted) {
      api.getStats().then(res => {
        setStats(res.data)
      })
    }
    return () => {
      mounted = false
    }
  }, [setStats])

  const getStatsByQuizId = () => {
    const result: {[key: number]: Stats[]} = {}
    stats.forEach(stat => {
      if (stat.questions_answered.length > 0) {
        if (result.hasOwnProperty(stat.quiz)) {
          result[stat.quiz].push(stat)
        } else {
          result[stat.quiz] = [stat]
        }
      }
    })

    return result
  }

  const renderCharts = () => {
    const res = getStatsByQuizId()
    return Object.values(res).map(quizData => {
      
      return (
        <Chart 
          key={quizData[0].quiz}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={[
            ['Time', 'Correct', 'Incorrect', { role: 'style' }],
            ...quizData.map(session => {
            const correct = session.questions_answered
                .filter(ans => ans.answer_correct).length
            
            return [
              new Date(session.datetime).toDateString(),
              correct,
              session.total_questions - correct,
              'color: #e5e4e2'
            ]
          })]}
          options={{
            legend: { position: 'none' },
            bar: { groupWidth: '50%' },
            title: quizData[0].quiz_name,
            chartArea: { width: '70%' },
            isStacked: "percent",
          }}
        />
      )
    })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Statistics</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Statistics</IonTitle>
          </IonToolbar>
        </IonHeader>
        {renderCharts()}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
