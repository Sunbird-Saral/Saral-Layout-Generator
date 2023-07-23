import React, { useState, useEffect } from 'react';
import './StudentQuestionTable.css';
import DownloadPDF from './DownloadPDF';
import EditableTableCell from './EditableTableCell';

const StudentQuestionTable = () => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(4);
  const [rolls, setRolls] = useState(5);
  const [tableData, setTableData] = useState([
    ['', ...Array(cols - 1).fill('')],
    ['', ...Array(cols - 1).fill('')],
  ]);
  const [message, setMessage] = useState('');

  // Database initialization
  const [database, setDatabase] = useState(null);
  const databaseName = 'studentQuestionDB';
  const tableName = 'templates';

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = () => {
    const request = window.indexedDB.open(databaseName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore(tableName, { keyPath: 'uniqueId' });
      objectStore.createIndex('messageIndex', 'message', { unique: false });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      setDatabase(db);
    };

    request.onerror = (event) => {
      console.error('Failed to open IndexedDB:', event.target.error);
    };
  };

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

  const handleIDChange = (event) => {
    setRolls(event.target.value);
  };

  const handleSaveTemplate = () => {
    if (!database) {
      console.error('IndexedDB not initialized');
      return;
    }
  
    const transaction = database.transaction(tableName, 'readwrite');
    const objectStore = transaction.objectStore(tableName);
  
    const timestamp = Date.now();
    const uniqueId = Math.floor(Math.random() * 1000000);
    const template = {
      timestamp,
      uniqueId,
      tableData: JSON.stringify(tableData),
      message,
    };
  
    const request = objectStore.add(template);
  
    request.onsuccess = () => {
      console.log('Template saved:', template);
      alert('Template saved successfully!');
    };
  
    request.onerror = (event) => {
      console.error('Failed to save template:', event.target.error);
    };
  };
  
  

  const handleOpenTemplate = () => {
    if (!database) {
      console.error('IndexedDB not initialized');
      return;
    }
  
    const transaction = database.transaction(tableName, 'readonly');
    const objectStore = transaction.objectStore(tableName);
    const index = objectStore.index('messageIndex');
    const request = index.get(message);
  
    request.onsuccess = (event) => {
      const savedTemplate = event.target.result;
      if (savedTemplate) {
        const parsedTableData = JSON.parse(savedTemplate.tableData);
        setRows(parsedTableData.length);
        setCols(parsedTableData[0].length);
        setTableData(parsedTableData);
        // console.log(tableData[0][0]);
        console.log('Template opened:', savedTemplate);
        alert('Template opened successfully!');
      } else {
        alert('No template found with the given commit text.');
      }
    };
  
    request.onerror = (event) => {
      console.error('Failed to open template:', event.target.error);
    };
  };
  
  
  

  const generateTable = () => {
    console.log('Table Data:', tableData);
  console.log('Rows:', rows);
  console.log('Cols:', cols);
    const table = [];

    // Table header
    const headerRow = [];
    headerRow.push(<th key={0}>
      <EditableTableCell className="cells" initialValue={tableData[0][0]===""?"Sr":tableData[0][0]} onSave={(value) => handleCellChange(0,0,value) }/>
</th>);
    headerRow.push(<th key={0}>
              <EditableTableCell className="cells" initialValue={tableData[0][1]===""?"Name":tableData[0][1]} onSave={(value) => handleCellChange(0,1,value) }/>
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
      <table id="tablee">
        <tbody>{generateTable()}</tbody>
      </table>
      <div className="button-container">
        <button className="button" onClick={handleAddRow}>
          Add Row
        </button>
        <button className="button" onClick={handleRemoveRow}>
          Remove Row
        </button>
        <button className="button" onClick={handleAddColumn}>
          Add Column
        </button>
        <button className="button" onClick={handleRemoveColumn}>
          Remove Column
        </button>
        <input
          type="range"
          min={2}
          max={10}
          value={rolls}
          onChange={handleIDChange}
        />
        <button className="button" onClick={handleSaveTemplate}>
          Save Template
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter commit text"
        />
        <button className="button" onClick={handleOpenTemplate}>
          Open Template
        </button>
        <DownloadPDF />
      </div>
    </div>
  );
};

export default StudentQuestionTable;
