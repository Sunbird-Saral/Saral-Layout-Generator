import React, { useState } from 'react';
import './RectangleDiv.css';

const RectangleDiv = () => {
  const [boxes, setBoxes] = useState([{ key:Date.now(), x: 0, y: 220, width: 60, height: 30 }]);

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

  const [initialPos,   setInitialPos] = React.useState(null);
  const [initialSize, setInitialSize] = React.useState(null);

  const initial = (e,box) => {
      
      let resizable = document.getElementsByClassName('box '+box.key)[0];

      setInitialPos(e.clientX);
      setInitialSize(resizable.offsetWidth);
      
  }
  
  const resize = (e,box) => {
      // console.log(box);
      let resizable = document.getElementsByClassName('box '+box.key)[0];
      let newval = parseInt(initialSize) + parseInt(e.clientX - initialPos);
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
    // console.log(box);
    let resizable = document.getElementsByClassName('box '+box.key)[0];
    let newval = parseInt(initialSize) + parseInt(e.clientX - initialPos);
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
    <div className='area'>
      {boxes.map((box) => (
        <div id="Resizable" key={box.key} className={'box ' + box.key} style={{ width:box.width,height:box.height,top: box.x, left: box.y }}>
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
          <button onClick={() => addbox(box,"right")} className='add-button right'>+</button>
          <button onClick={() => addbox(box,"bottom")} className='add-button bottom'>+</button>
        </div>
      ))}
    </div>
  );
};

export default RectangleDiv;
