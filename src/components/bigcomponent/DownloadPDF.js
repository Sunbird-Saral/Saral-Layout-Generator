import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useRef, useState } from 'react';
import cv from "@techstark/opencv-js";

const DownloadPDF = ({ boxes,blackdots,setBlackdots, handleDesignComplete, orientationOfForm}) => {
  const addOmr = (t,l) => {
    setBlackdots((prevomrs) => [
      ...prevomrs,
      { id: Date.now(), top: t, left: l,name: `omrs ${prevomrs.length + 1}`,size:50,color:"black"},
    ]);


  };


  const start = () => {
    


    let captureHeight=0;
    let captureWidth=0;
    for(let i=0;i<boxes.length;i++){

      if(boxes[i].x+boxes[i].height > captureHeight){
        captureHeight=boxes[i].x+boxes[i].height;
      }
    
      if(boxes[i].y+boxes[i].width > captureWidth){
        captureWidth= boxes[i].y+boxes[i].width;
      }
      
    }
    
     addOmr(0,0);
     addOmr(0,captureWidth);
     addOmr(captureHeight,0);
     addOmr(captureHeight,captureWidth);
     captureHeight+=60;
     captureWidth+=60;
    setTimeout(() => {
      generatePDF(captureHeight,captureWidth); // Generate PDF after adding OMR
    }, 1000);
    
  };


  const generatePDF = (captureHeight,captureWidth) => {
  



    const reportElement = document.getElementById('print-this');

    const pdfWidth = 1300; // A4 width in points (landscape mode)
    const pdfHeight = 800; // A4 height in points (landscape mode)
    // const spaceWidth = 50; // Desired space width on both sides in points

    const posX = (pdfWidth - captureWidth) / 2; // Center the image horizontally
    const posY = (pdfHeight - captureHeight) / 2; // Center the image vertically

    // Capture only the specific rectangle using the html2canvas options
    html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      width: captureWidth,
      height: captureHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      console.log('imgData', imgData)
      let image = new Image()
      image.src = imgData
      image.onload = () => {
        processImage(image, imgData)
      };

      const pdf = new jsPDF('l', 'pt', [pdfWidth, pdfHeight]);

      pdf.addImage(imgData, 'PNG', posX, posY, captureWidth, captureHeight);
      pdf.save('report.pdf');
    });

    setBlackdots([]);
  };

  const processImage = (image, imgData) => {
    // Load the image
    const src = cv.imread(image);
    console.log('imageSrc', src)
    //const dst = new cv.Mat.zeros(src.rows, src.cols, cv.CV_8U);
    const circles = new cv.Mat();
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_BGR2GRAY);
    cv.medianBlur(gray, gray, 5);

    // Detect circles
    cv.HoughCircles(gray, circles, cv.HOUGH_GRADIENT,
        1.5,50, 50, 30.0, 40, 50);

    console.log("circles", circles.cols)

    // Find circles that correspond to corners (for simplicity, assuming there are 4 circles)
    let cornerCircles = [];
    for (let i = 0; i < circles.cols; ++i) {
        let x = circles.data32F[i * 3];
        let y = circles.data32F[i * 3 + 1];
        let radius = circles.data32F[i * 3 + 2];
        // Check if circle is near the corners
        //if (x < radius || y < radius || x > src.cols - radius || y > src.rows - radius) {
            cornerCircles.push({ x, y, radius });
        //}
    }
    //setcornerCircles(cornerCircles);
    mark(cornerCircles, src, imgData);
    
    // Clean up
    
  };

  const mark = (cornerCircle, dst, imgData) => {
    let circles = cornerCircle;

    // Assuming circles is an array containing objects with properties x, y, and radius

  // Sort circles based on their x-coordinate to find the leftmost and rightmost circles
  circles.sort((a, b) => a.x - b.x);

  // Sort the first two circles based on their y-coordinate to find the top left and bottom left circles
  const topLeftCircle = circles[0].y < circles[1].y ? circles[0] : circles[1];

  // Sort the last two circles based on their y-coordinate to find the top right and bottom right circles
  const bottomRightCircle = circles[2].y < circles[3].y ? circles[3] : circles[2];

  // Calculate the top-left and bottom-right points of the rectangle
  const topLeft = new cv.Point(topLeftCircle.x, topLeftCircle.y);
  const bottomRight = new cv.Point(bottomRightCircle.x, bottomRightCircle.y);


  const width = bottomRight.x - topLeft.x;
  const height = bottomRight.y - topLeft.y;

  // Create a region of interest (ROI) object
  const roi = new cv.Rect(topLeft.x, topLeft.y, width, height);

  // Extract the rectangular region from the source image
  const croppedImage = dst.roi(roi);

  let fdst = new cv.Mat();
  let dsize = new cv.Size(640, 480);
  if(orientationOfForm == 'Potrait') {
    dsize = new cv.Size(480, 640);
  }
  // You can try more different parameters
  cv.resize(croppedImage, fdst, dsize, 0, 0, cv.INTER_AREA);

  // Draw the rectangle
  cv.rectangle(dst, topLeft, bottomRight, [255, 0, 0, 255]); // Change [255, 0, 0, 255] to the desired color
  handleDesignComplete(fdst, imgData)
}

  return (
    <div>
      <button onClick={()=>start()} className="download-button" type="button">
        Export PDF
      </button>
      </div>
  );
};

export default DownloadPDF;
