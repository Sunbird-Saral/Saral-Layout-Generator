import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DownloadPDF = ({ boxes,blackdots,setBlackdots }) => {



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

      const pdf = new jsPDF('l', 'pt', [pdfWidth, pdfHeight]);

      pdf.addImage(imgData, 'PNG', posX, posY, captureWidth, captureHeight);
      pdf.save('report.pdf');
    });

    setBlackdots([]);
  };

  return (
    <div>
      <button onClick={()=>start()} className="download-button" type="button">
        Export PDF
      </button>
    </div>
  );
};

export default DownloadPDF;
