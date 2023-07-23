import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DownloadPDF = () => {
  const generatePDF = () => {
    const reportElement = document.getElementById('tablee');
  
    const pdfWidth = 841.89; // A4 width in points (landscape mode)
    const pdfHeight = 595.28; // A4 height in points (landscape mode)
  
    const spaceWidth = 50; // Desired space width on both sides in points
  
    html2canvas(reportElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const aspectRatio = canvas.width / canvas.height;
  
      const imgWidth = pdfWidth - 2 * spaceWidth;
      const imgHeight = imgWidth / aspectRatio;
  
      const pdf = new jsPDF('l', 'pt', [pdfWidth, pdfHeight]);
  
      // Calculate the left position with space on both sides
      const posX = (pdfWidth - imgWidth) / 2;
      const posY = (pdfHeight - imgHeight) / 2;
  
      pdf.addImage(imgData, 'PNG', posX, posY, imgWidth, imgHeight, '', 'FAST');
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
