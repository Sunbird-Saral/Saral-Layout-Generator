import React, { useEffect, useState, useRef } from 'react';
import cv from "@techstark/opencv-js";

const ROIMarker = ({srcImage, imgData}) => {
  const canvasRef = useRef(null);
  const [img, setImage] = useState('');
  const [isImgLoaded, setImgLoaded] = useState(false);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageData, setImageData] = useState(null);
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
      console.log('width', width, height, currentX, currentY)
      setRoiDim([width+5, height+5]);
      setIsDragging(false);
      if(mode == 'DELETE') {
        for(let [i,roi] of roiList.entries()) {
          console.log('deleted-----', currentX, currentY, roiList, currentX - roi.x, currentY - roi.y, roi)
          if ((0 <= currentX - roi.x) && (currentX - roi.x <=10) && (0 <= currentY - roi.y) && (currentY - roi.y <=10)) {
            console.log('deleted')
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
    let img = srcImage
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
      console.log('inside read', contours)
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
      let min_width = roiDim[0] - 10;
      let min_height = roiDim[1] - 10;
      console.log('mins before', rect, min_height, min_width)
        if ((min_width <= rect.width && rect.width <= roiDim[0]) && (min_height <= rect.height && rect.height <= roiDim[1])){
          console.log('mins', min_height, min_width, rect)
          console.log('----------------------')
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
    console.log('rois', roiList)
    setMode('DELETE')
  }

  const editROI = () => {
    console.log('edit rois', roiList)
    setMode('EDIT')
  }

  return (
    <div>
    <div className='roi-edit-button'>
    <button onClick={detectContours}>Mark ROI</button>
    <button onClick={deleteROI}>Delte ROIs</button>
    <button onClick={editROI}>Add ROIs</button>
    </div>
    <div className='roi-container'>
      <canvas ref={canvasRef} id="srcImgCanvas" width="500" height="500" onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}></canvas>
    </div>
    </div>
  );
};

export default ROIMarker;
