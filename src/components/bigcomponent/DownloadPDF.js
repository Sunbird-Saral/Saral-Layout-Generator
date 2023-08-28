import React,{useState} from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DownloadPDF = ({ boxes }) => {
  console.log(boxes);

  const [captureHeight,setCaptureHeight] = useState(0);
  const [captureWidth,setCaptureWidth] = useState(0);

  for(let i=0;i<boxes.length;i++){
    if(boxes[i].x+boxes[i].height > captureHeight){
      setCaptureHeight(boxes[i].x+boxes[i].height);
    }
  
    if(boxes[i].y+boxes[i].width > captureWidth){
      setCaptureWidth(boxes[i].y+boxes[i].width);
    }
    
  }
  
   console.log(captureHeight,captureWidth);

  const generatePDF = () => {
    const reportElement = document.getElementById('print-this');

    const pdfWidth = 1300; // A4 width in points (landscape mode)
    const pdfHeight = 700; // A4 height in points (landscape mode)
    const spaceWidth = 50; // Desired space width on both sides in points

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
  };

  return (
    <div>
      <button onClick={generatePDF} type="button">
        Export PDF
      </button>
    </div>
  );
};

export default DownloadPDF;
