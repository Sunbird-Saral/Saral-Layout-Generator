import React, { useEffect, useState, useRef } from 'react';
import cv from "@techstark/opencv-js";

const ROIMarker = ({srcImage, imgData, formConfigJson, notifyError}) => {
  const canvasRef = useRef(null);
  const [img, setImage] = useState('');
  const [isImgLoaded, setImgLoaded] = useState(false);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFinalRoiListReady, setIsFinalRoiListReady] = useState(false);
  const [roiDim, setRoiDim] = useState([]);
  const [roiList, setRoiList] = useState([]);
  const [mode, setMode] = useState('SELECT');

  const drawROI = (ctx, x, y, width, height) => {
    const canvas = canvasRef.current;
    const image = document.getElementById('srcImgCanvas');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cv.imshow('srcImgCanvas', srcImage)
    ctx.drawImage(image, 0, 0);

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.strokeStyle = 'red';
    ctx.stroke();
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartX(x);
    setStartY(y);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const width = currentX - startX;
      const height = currentY - startY;
      const ctx = canvasRef.current.getContext('2d');
      drawROI(ctx, startX, startY, width, height);
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const width = currentX - startX;
      const height = currentY - startY;
      const ctx = canvasRef.current.getContext('2d');
      drawROI(ctx, startX, startY, width, height);
      setRoiDim([width+2, height+2]);
      setIsDragging(false);
      if(mode == 'DELETE') {
        for(let [i,roi] of roiList.entries()) {
          if ((0 <= currentX - roi.x) && (currentX - roi.x <=10) && (0 <= currentY - roi.y) && (currentY - roi.y <=10)) {
            const point1 = new cv.Point(roi.x, roi.y);
            const point2 = new cv.Point(roi.x + roi.width, roi.y + roi.height);
            cv.rectangle(img, point1, point2, [255, 0, 0, 255], -1);
            roiList.splice(i,1);
            //setRoiList(roiList);
            cv.imshow('srcImgCanvas', img)
          }
        }
      } else if(mode == 'EDIT') {
        setRoiList([...roiList, {currentX, currentY, width, height}])
      }
    }
  }

  useEffect(() => {
    const canvas = document.getElementById('srcImgCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cv.imshow('srcImgCanvas', srcImage)
    setImgLoaded(true);
  }, [srcImage]);

  const detectContours = () => {
    let img = srcImage.clone()
    setImage(img);
      const gray = new cv.Mat();
      cv.cvtColor(img, gray, cv.COLOR_BGR2GRAY);
      const blurred = new cv.Mat();
      cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
      const thresh = new cv.Mat();
      cv.adaptiveThreshold(blurred, thresh, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2);
      
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(thresh, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_NONE);
      drawContours(contours, img);

      // Clean up
      gray.delete();
      blurred.delete();
      thresh.delete();
      hierarchy.delete();
  };

  const drawContours = (contours, dst) => {
    const canvas = document.getElementById('srcImgCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let froiList = [];
    for (let i = 0; i < contours.size(); i++) {
      const color = new cv.Scalar(0, 255, 0, 255); // Blue color
      const contour = contours.get(i);
      let rect = cv.boundingRect(contour)
      let min_width = roiDim[0] - 5;
      let min_height = roiDim[1] - 5;
        if ((min_width <= rect.width && rect.width <= roiDim[0]) && (min_height <= rect.height && rect.height <= roiDim[1])){
          const point1 = new cv.Point(rect.x, rect.y);
          const point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
          cv.rectangle(dst, point1, point2, [0, 255, 0, 255], 2);
          froiList.push(rect);
        }
    }
    setRoiList([...roiList, ...froiList])
    cv.imshow('srcImgCanvas', dst)
  };

  const deleteROI = () => {
    setMode('DELETE')
  }

  const editROI = () => {
    setMode('EDIT')
  }

  const resetROI = () => {
    const canvas = document.getElementById('srcImgCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cv.imshow('srcImgCanvas', srcImage)
    setRoiList([])
  }

  const finishROIMarking = () => {
     let finalRoiList = []
     roiList.sort((a,b)=>{
      return a['x'] - b['x']
     })
     roiList.sort((a,b)=>{
      return a['y'] - b['y']
     })

     for(let roi of roiList){
      let rectangle_coords = {
          "top": parseInt(roi.y),
          "left": parseInt(roi.x),
          "bottom": parseInt(parseInt(roi.y)+parseInt(roi.height)),
          "right": parseInt(parseInt(roi.x)+parseInt(roi.width))
      }
      finalRoiList.push(rectangle_coords)
     }

     finalRoiList.sort((a,b)=>{
      if(a['top'] !== b['top'] && !((a['top'] - b['top']) >=-5 && (a['top'] - b['top'])<=5)){
        return a['top'] - b['top']
      }
    else {
        return a['right'] - b['right']
      }
     });

     setRoiList(finalRoiList);
     console.log('finalRoiList', finalRoiList);
     setIsFinalRoiListReady(true);
  }

  const downloadJSON = (data) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roi.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateROIJson = () => {
    let mroi_list = {
      "cells":[]
    }
    let index = 0;
    let roiIndex = 0;
    for(let key in formConfigJson) {
        let val = formConfigJson[key];
        let extractionMethods = val["extractionMethod"];
        let j=0;
        let cellData = {
            "cellId": (val["cellIndex"]).toString(),
            "page": "1",
            "rois": [],
            "render": {
                "index": val["cellIndex"]
            },
            "format": {
                "name": val["formate"],
                "value": val["formate"]
            },
            "validate": {
                "regExp": ""
            }
        }
        
        let previousi = roiIndex;
        let newVal = val["count"] + roiIndex
        for(let i=0; i<roiList.length; i++){
            if(roiIndex < newVal && roiIndex >= previousi){
                j = j +1;
                let extractionMethod = Object.keys(extractionMethods)[0]
                if(j > extractionMethods[extractionMethod]) {
                  j = 0;
                  delete extractionMethods[extractionMethod]
                }
                let roiData = {
                    "annotationTags": key+"_"+i.toString(),
                    "extractionMethod": Object.keys(extractionMethods)[0],
                    "roiId": index + 1,
                    "index": i,
                    "rect": roiList[roiIndex]
                }
                cellData["rois"].push(roiData);
                roiIndex = roiIndex + 1;
                index = index + 1;
            }
        }
        mroi_list["cells"].splice(val["cellIndex"], 0, cellData)
      }

      if(roiList.length !== roiIndex) {
        notifyError('ROI marking is not correct. please reset and mark properly again')
      } else {
        finaliseRoIIndex(mroi_list)
        downloadJSON(mroi_list)
      }
  }

  function finaliseRoIIndex(mroi_list) {
  let roiindex = 0;
  for(let cells in mroi_list["cells"]){
    for(let roi in cells["rois"]){
      roiindex = roiindex + 1;
      roi["roiId"] = roiindex.toString();
    }
  }
  }

  return (
    <div className='roi-container'>
    <div className='roi-edit-button'>
    <h2>Steps for Auto ROI marking!</h2>
    <ol>
    <li>Mark Reference ROI
    <ul>
      <li>Drag mouse pointer from one corner to another to mark ROI</li>
      <li>Press<button onClick={detectContours}>Mark ROI</button>to start auto select</li>
      <li>Repeat above till all different input box ROIs are marked</li>
    </ul>
    </li>
    <li>Review selected ROIs
    <ul>
      <li>Press<button onClick={deleteROI}>Delte ROIs</button>.Click on right corner of the marked boxs to deselect ROI.</li>
      <li>Press<button onClick={editROI}>Add ROIs</button>.Drag mouse pointer from one corner to another to mark ROI</li>
      <li>Press<button onClick={resetROI}>Reset ROIs</button>. to start over</li>
    </ul>
    </li>
    <li>Finalize ROI<button onClick={finishROIMarking}>Finish ROI Marking</button> </li>
    </ol>
    <p>Generate ROI Json<button className={isFinalRoiListReady ? 'roi-gen-btn': 'roi-gen-btn-disabled'} onClick={generateROIJson} disabled={!isFinalRoiListReady}>Generate</button></p>
    </div>
    <div>
      <canvas ref={canvasRef} id="srcImgCanvas" onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}></canvas>
    </div>
    </div>
  );
};

export default ROIMarker;