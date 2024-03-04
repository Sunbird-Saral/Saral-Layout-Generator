import React, {  } from 'react';
const BlackDotComponent = ({blackdots , updateblackdots}) =>{




    const omrRefs = React.useRef({});





      const scaleFactor = 0.1;

      const handleWheelOmr = (event, input) => {
        event.preventDefault();
    
        const newInputs = blackdots.map((prevInput) => {
          if (prevInput.id === input.id) {
            const newSize = event.deltaY < 0 ? prevInput.size * (1 + scaleFactor) : prevInput.size * (1 - scaleFactor);
    
            return { ...prevInput, size:newSize };
          } else {
            return prevInput;
          }
        });
    
        updateblackdots(newInputs);
      };

      const handleDoubleClickOmr =(input) =>{

        const newInputs = blackdots.map((prevInput) => {
          if (prevInput.id === input.id) {
            let col="white";
            if(input.color==="white")col="black";
    
    
            return { ...prevInput, color:col };
          } else {
            return prevInput;
          }
        });
    
        updateblackdots(newInputs);
        
      }



      return (
<>
{blackdots.map((omr) => (
          <div
            key={omr.id}
            ref={(element) => (omrRefs.current[omr.id] = element)}
            style={{ position: 'absolute', left: omr.left, top: omr.top }}

          >

              <div onDoubleClick={()=>handleDoubleClickOmr(omr)} 
              onWheel={(event)=> handleWheelOmr(event,omr)} >
              <div className='circle' style={{width:omr.size,height:omr.size,backgroundColor:omr.color}} ></div>
              </div>






          </div>
        ))}


</>


        
      );




}

export default BlackDotComponent;