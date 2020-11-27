import React , {useState} from 'react';
import {IonPopover} from '@ionic/react';
import { CirclePicker } from 'react-color';
import {colorMap} from "../utils/interface"

interface ColorProps {
    onChange: Function,
    style?: Object
    currentColor?: string 
  }
  
  
  const ColorPicker: React.FC<ColorProps> = ({currentColor, onChange, style}) => {
    const [showPopover, setShowPopover] = useState(false);
    const [color, setColor] = useState<string>(currentColor ? currentColor : "#3880ff")
    
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

  export default ColorPicker;
  