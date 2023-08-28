import React, { useState } from 'react';
import './RectangleDiv.css';
import Draggable from 'react-draggable';
import DownloadPDF from './DownloadPDF';
import EditableTableCell from './EditableTableCell';
const RectangleDiv = () => {
  const [boxes, setBoxes] = useState([{ key:Date.now(), x: 20, y: 20, width: 60, height: 30 }]);

  const [inputs,setinputs]= useState([
    {id:Date.now()+4 ,top:250,left:250,name:'input1',size:5 , width:20,height:20},
    {id:Date.now()+5 ,top:300,left:300,name:'input2',size:5, width:20,height:20}
    
    ]);
    
    
    const [omrs,setOmrs]= useState([
      {id:Date.now()+6 ,top:400,left:250,name:'omrs1'},
      
      ]);

      const boundaryRef = React.useRef(null);
      const inputRefs = React.useRef({});
      const omrRefs = React.useRef({});

      const addBoxes = () => {
        setinputs((previnputs) => [
          ...previnputs,
          { id: Date.now(), top: 300, left: 300,name: `input ${previnputs.length + 1}`, size: 5 },
        ]);
      };
    
      const addOmr = () => {
        setOmrs((prevomrs) => [
          ...prevomrs,
          { id: Date.now(), top: 300, left: 300,name: `omrs ${prevomrs.length + 1}`},
        ]);
      };


      const removeField = (setFields,fieldId) => {
        setFields((prevFields) => prevFields.filter((field) => field.id !== fieldId));
      };
    
      const removeOmr = (setOmrs,fieldId) => {
        setOmrs((prevomrs) => prevomrs.filter((field) => field.id !== fieldId));
      };

      const handleInputDrag = (inputId, e, data) => {

        const boundaryRect = boundaryRef.current.getBoundingClientRect();
        const boundaryX = boundaryRect.left;
        const boundaryY = boundaryRect.top;
        const fieldRect = inputRefs.current[inputId].getBoundingClientRect();
        const fieldX = fieldRect.left;
        const fieldY = fieldRect.top;
        let newX = data.x + fieldX - boundaryX;
        let newY = data.y + fieldY - boundaryY;
    
        setinputs((prevFields) =>
          prevFields.map((inputs) => (inputs.id === inputId ? { ...inputs, top: newY, left: newX } : inputs))
        );
      };
    
      const handleOmrDrag = (inputId, e, data) => {

        const boundaryRect = boundaryRef.current.getBoundingClientRect();
        const boundaryX = boundaryRect.left;
        const boundaryY = boundaryRect.top;
        const fieldRect = omrRefs.current[inputId].getBoundingClientRect();
        const fieldX = fieldRect.left;
        const fieldY = fieldRect.top;
        let newX = data.x + fieldX - boundaryX;
        let newY = data.y + fieldY - boundaryY;

        setOmrs((prevFields) =>
          prevFields.map((inputs) => (inputs.id === inputId ? { ...inputs, top: newY, left: newX } : inputs))
        );
      };
      const generate = (size,box)=>{
        const inx=[];
    
        for(let x=0;x<size;x++){
          inx.push(<td  style={{width:box.width , height:box.height ,transition: 'width 0.3s, height 0.3s'}}  ></td>)
        }
        return inx;
      }
      const addcells = (setinputs,inputId)=>{
        setinputs((prevFields) =>
        prevFields.map((input) => {
          if (input.id === inputId) {
            if (input.size + 1 > 10) {
              alert("max value of input box size is 10!");
              return { ...input, size: 10 };
            } else {
              return { ...input, size: input.size + 1 };
            }
          } else {
            return input;
          }
        })
      );
      }
    
      const removecells = (setinputs,inputId)=>{
        setinputs((prevFields) =>
        prevFields.map((input) => {
          if (input.id === inputId) {
            if (input.size - 2 <0) {
              alert("min value of input box size is 1!");
              return { ...input, size: 1 };
            } else {
              return { ...input, size: input.size - 1 };
            }
          } else {
            return input;
          }
        })
      );
      }


  const scaleFactor = 0.1;
  const handleWheel = (event, input) => {
    event.preventDefault();

    const newInputs = inputs.map((prevInput) => {
      if (prevInput.id === input.id) {
        const newWidth = event.deltaY < 0 ? prevInput.width * (1 + scaleFactor) : prevInput.width * (1 - scaleFactor);
        const newHeight = event.deltaY < 0 ? prevInput.height * (1 + scaleFactor) : prevInput.height * (1 - scaleFactor);

        return { ...prevInput, width: newWidth, height: newHeight };
      } else {
        return prevInput;
      }
    });

    setinputs(newInputs);
  };



  













// main table

  const addbox = (oldbox,where) => {
    console.log(oldbox);
    const newbox = {key:Date.now(), x:oldbox.x,y:oldbox.y,width:oldbox.width,height:oldbox.height};
    if(where==="right"){
      newbox.y +=oldbox.width;
    }
    if(where==="bottom"){
      newbox.x +=oldbox.height;
    }
    
    setBoxes((prevBoxes) => [
      ...prevBoxes,
      newbox 
    ]);
  };
  const removeDiv = (currentbox) => {
    let newlist=[];
    for(let i=0;i<boxes.length;i++){
      if(currentbox.key===boxes[i].key)continue;
      newlist.push(boxes[i]);
    }
    console.log(newlist);
    setBoxes(newlist);
  };

  const [initialPos,   setInitialPos] = React.useState(null);
  const [initialSize, setInitialSize] = React.useState(null);

  const initial = (e,box) => {
      
      let resizable = document.getElementsByClassName('box '+box.key)[0];

      setInitialPos(e.clientX);
      setInitialSize(resizable.offsetWidth);
      
  }
  
  const resize = (e,box) => {
      let resizable = document.getElementsByClassName('box '+box.key)[0];
      resizable.style.width = `${parseInt(initialSize) + parseInt(e.clientX - initialPos)}px`;
      let ne = parseInt(resizable.style.width);
      ne = Math.floor(ne/10);
      ne = ne*10;
      console.log(ne);
      resizable.style.width =  `${ne}px`;
      // let curr;
      for(let i=0;i<boxes.length;i++){
        if(boxes[i]===box){console.log(boxes);boxes[i].width = ne}
      }
      setBoxes(boxes);
    
  }

  const initialdown = (e,box) => {
      
    let resizable = document.getElementsByClassName('box '+box.key)[0];

    setInitialPos(e.clientY);
    setInitialSize(resizable.offsetHeight);
    
}

const resizedown = (e,box) => {
    let resizable = document.getElementsByClassName('box '+box.key)[0];
    resizable.style.height = `${parseInt(initialSize) + parseInt(e.clientY - initialPos)}px`;
    let ne = parseInt(resizable.style.height);
    ne = Math.floor(ne/10);
    ne = ne*10;
    console.log(ne);
    resizable.style.height =  `${ne}px`;
    // let curr;
    for(let i=0;i<boxes.length;i++){
      if(boxes[i]===box){console.log(boxes);boxes[i].height = ne}
    }
    setBoxes(boxes);
  
}

  return (
    <div className='form-container'>
      <div ref={boundaryRef} id="print-this" className='area'>
      {boxes.map((box) => (
        <div id="Resizable" key={box.key} className={'box ' + box.key} style={{ width:box.width,height:box.height,top: box.x, left: box.y }}>
                <EditableTableCell initialValue={"a"}/>
                
                
                <div id = 'Draggable'
                draggable   = 'true'
                onDragStart = {(event)=> initial(event,box)} 
                onDrag      = {(event)=> resize(event,box)}
            />

                <div id = 'Draggable2'
                draggable   = 'true'
                onDragStart = {(event)=> initialdown(event,box)} 
                onDrag      = {(event)=> resizedown(event,box)}
            />
            <div
              className="remove-btn"
              onClick={() => removeDiv(box)}
              title="Remove Field"
            >
              &#10005;
            </div>
          <button onClick={() => addbox(box,"right")} className='add-button right'>+</button>
          <button onClick={() => addbox(box,"bottom")} className='add-button bottom'>+</button>
        </div>
      ))}

{inputs.map((inputs) => (
          <div
            key={inputs.id}
            ref={(element) => (inputRefs.current[inputs.id] = element)}
            style={{ position: 'absolute', left: inputs.left, top: inputs.top }}
            className="field-container"
          >
            <Draggable
              position={{ x: 0, y: 0 }}
              onStop={(e, data) => handleInputDrag(inputs.id, e, data)}
            >
              <div className="cell-box"  >
                <table className='roll '>
                  <tr onWheel={(event)=> handleWheel(event,inputs)}>
                    {generate(inputs.size,inputs)}
                  </tr>
                </table>
              </div>
            </Draggable>
            <div className='input-feat-buttons'>
            <div
              className="remove-btn"
              onClick={() => removeField(setinputs,inputs.id)}
              title="Remove Field"
            >
              &#10005;
            </div>

            <div
              className="add-cell-btn"
              onClick={() => addcells(setinputs,inputs.id)}
            >
              &#43;
            </div>
            <div
              className="remove-cell-btn"
              onClick={() => removecells(setinputs,inputs.id)}
            >
              &#10005;
            </div>
            </div>
            
          </div>
        ))}


{omrs.map((omr) => (
          <div
            key={omr.id}
            ref={(element) => (omrRefs.current[omr.id] = element)}
            style={{ position: 'absolute', left: omr.left, top: omr.top }}
            className="field-container"
          >
            <Draggable
              position={{ x: 0, y: 0 }}
              onStop={(e, data) => handleOmrDrag(omr.id, e, data)}
            >
              <div className="omr-box">
              <div className='circle'></div>
              </div>
            </Draggable>





            <div
              className="remove-btn"
              onClick={() => removeOmr(setOmrs,omr.id)}
              title="Remove omr"
            >
              &#10005;
            </div>
          </div>
        ))}


    </div>  
    <button onClick={addBoxes} className="add-box-btn">
        Add InputBox
      </button>
      <button onClick={addOmr} className="add-omr-btn">
        Add OMR Btn
      </button>
      <DownloadPDF onClick={()=>setBoxes(boxes)} boxes={boxes} />
    </div>
    
  );
};

export default RectangleDiv;