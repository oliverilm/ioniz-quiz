import React, {ReactNode} from "react"
import { IonModal, IonContent } from '@ionic/react';


interface PopupProps { 
    children?: ReactNode
    onClose: Function
    onSave?: Function
    saveText?: string
    closeText?: string
    isOpen: boolean
}


export const Popup: React.FC<PopupProps> = ({isOpen, children, onClose, onSave = () => {}, saveText, closeText = "Close"}) => {
    
    return (
      <IonContent>

        <IonModal isOpen={isOpen} cssClass='my-custom-class'>
            <div style={{width: "100%", height: "100%"}}>
                <div style={{ color: "#888888", display: "flex", justifyContent: "space-between", margin: "0px 20px"}}>
                    <h5 style={{cursor: "pointer"}} onClick={() => {onSave(); onClose(false)}}>{saveText}</h5>
                    <h5 style={{cursor: "pointer"}} onClick={() => onClose(false)}>{closeText}</h5>
                </div>

                <div className={"content"} style={{margin: "1em"}} >
                    {children}
                </div>
          </div>
        </IonModal>
      </IonContent>
    );
  };

export default Popup;