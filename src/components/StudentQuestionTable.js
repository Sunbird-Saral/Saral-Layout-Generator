import React, { useState } from 'react';
import './StudentQuestionTable.css';
import DownloadPDF from './DownloadPDF';
import EditableTableCell from './EditableTableCell';
const StudentQuestionTable = () => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(4);
  const [rolls, setrolls] = useState(5);
  const [tableData, setTableData] = useState([
    ['', ...Array(cols - 1).fill('')],
    ['', ...Array(cols - 1).fill('')],
  ]);

  console.log(rows);
  console.log(cols);
  console.log(tableData);


  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][colIndex] = value;
    setTableData(updatedTableData);
  };

  const handleAddRow = () => {
    setRows(rows + 1);
    const newRow = Array(cols).fill('');
    setTableData([...tableData, newRow]);
  };

  const handleIDchange = (event)=> {
    setrolls(event.target.value);

  }

  const handleRemoveRow = () => {
    if (rows > 2) {
      setRows(rows - 1);
      const updatedTableData = tableData.slice(0, -1);
      setTableData(updatedTableData);
    }
  };

  const handleAddColumn = () => {
    setCols(cols + 1);
    const updatedTableData = tableData.map((row) => [...row, '']);
    setTableData(updatedTableData);
  };

  const handleRemoveColumn = () => {
    if (cols > 2) {
      setCols(cols - 1);
      const updatedTableData = tableData.map((row) => row.slice(0, -1));
      setTableData(updatedTableData);
    }
  };

  const generateTable = () => {
    const table = [];

    // Table header
    const headerRow = [];
    headerRow.push(<th key={0}>
      <EditableTableCell className="cells" initialValue={"Sr No"} onSave={(value) => handleCellChange(0,0,value) }/>
</th>);
    headerRow.push(<th key={0}>
              <EditableTableCell className="cells" initialValue={"Names"} onSave={(value) => handleCellChange(0,1,value) }/>
    </th>);
    headerRow.push(<th key={1}>

            <EditableTableCell initialValue={"Roll NO"} onSave={(value) => handleCellChange(0,2,value) }/>
    </th>);
    for (let j = 2; j < cols; j++) {
      headerRow.push(<th key={j}>

              <EditableTableCell className="cells" initialValue={"Q"+(j-1)} onSave={(value) => handleCellChange(0,j,value) }/>
        
        
        </th>);
    }
    table.push(<tr key={-1}>{headerRow}</tr>);
    
    // Table body
    for (let i = 1; i < rows; i++) {
      const row = [];
      row.push(
        <td key={i}>
        <EditableTableCell className="cells" initialValue={i} onSave={(value) => handleCellChange(i,0,value) }/>
        </td>
      );
      for (let j = 0; j < cols; j++) {
        if (j === 0) {
          // Student name and roll number columns
          row.push(
            <td key={j}>

            <EditableTableCell className="cells" initialValue={tableData[i][j]===""?"":tableData[i][j]} onSave={(value) => handleCellChange(i,j,value) }/>

            </td>
          );
        }
        
        else if(j===1){
          const ids=[];
          for(let r=0;r<rolls;r++){
            ids.push(
              <td></td>
            )
          }
          row.push(
            <td key={j}>

              <table className='roll'>
                <tr>
                  {ids}
                </tr>
              </table>
            </td>
          );

        }
        else {
          // Question number tickbox columns
          row.push(
            <td key={j}>

              <div className='circle'></div>
            </td>
          );
        }
      }
      table.push(<tr key={i}>{row}</tr>);
    }

    return table;
  };

  return (
    <div className="table-container">
      <table id='tablee'>
        <tbody>{generateTable()}</tbody>
      </table>
      <div className="button-container">
        <button onClick={handleAddRow}>Add Row</button>
        <button onClick={handleRemoveRow}>Remove Row</button>
        <button onClick={handleAddColumn}>Add Column</button>
        <button onClick={handleRemoveColumn}>Remove Column</button>
        <input
        type="range"
        min={2}
        max={10}
        value={rolls}
        onChange={handleIDchange}
      />
        <DownloadPDF/>
      </div>
    </div>
  );
};

export default StudentQuestionTable;
