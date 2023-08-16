import React, { useState, useEffect } from 'react';
import './StudentQuestionTable.css';
import DownloadPDF from './DownloadPDF';
import EditableTableCell from './EditableTableCell';

const StudentQuestionTable = () => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(1);
  const [rolls, setRolls] = useState(5);
  const [tableData, setTableData] = useState([
    ['', ...Array(cols - 1).fill('')],
    ['', ...Array(cols - 1).fill('')],
  ]);
  const [message, setMessage] = useState('');
  const [coltypes , setColtypes] = useState([1]);
  const [idColumnLengths, setIdColumnLengths] = useState([rolls]);
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

  const handleAddOmrColumn = () => {
    setCols(cols + 1);
    let ar = coltypes;
    ar.push(1);
    setColtypes(ar);
    const updatedTableData = tableData.map((row) => [...row, '']);
    setTableData(updatedTableData);
  };

  const handleAddIdColumn = () => {
    setCols(cols + 1);
    let ar = coltypes;
    ar.push(2);
    setColtypes(ar);

    // Add the initial length for the new ID column
    setIdColumnLengths(prevLengths => [...prevLengths, rolls]);
    
    const updatedTableData = tableData.map((row) => [...row, '']);
    setTableData(updatedTableData);
  };

  const handleAddIdColumnLength = (colIndex) => {
    setIdColumnLengths((prevLengths) => {
      const newLengths = [...prevLengths];
      newLengths[colIndex] += 1;
      return newLengths;
    });
  };

  const handleRemoveIdColumnLength = (colIndex) => {
    setIdColumnLengths((prevLengths) => {
      const newLengths = [...prevLengths];
      newLengths[colIndex] = Math.max(newLengths[colIndex] - 1, 1);
      return newLengths;
    });
  };

  const handleRemoveColumn = () => {
    if (cols > 2) {
      setCols(cols - 1);
      setColtypes(coltypes.slice(0,-1));

      // Remove the length for the removed ID column
      setIdColumnLengths((prevLengths) => prevLengths.slice(0, -1));

      const updatedTableData = tableData.map((row) => row.slice(0, -1));
      setTableData(updatedTableData);
    }
  };

  // ... handleCellChange, handleAddOmrColumn, and other functions ...

  const IdColumn = ({ length, colIndex }) => {
    const [showButtons, setShowButtons] = useState(false);

    return (
      <td
        key={`idColumn_${colIndex}`}
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <table className="roll">
          <tr>
            {Array.from({ length }, (_, index) => (
              <td key={index}></td>
            ))}
          </tr>
        </table>
        {/* {showButtons && (
          <div className="length-buttons">
            <button onClick={() => handleRemoveIdColumnLength(colIndex)}>-</button>
            <span>{length}</span>
            <button onClick={() => handleAddIdColumnLength(colIndex)}>+</button>
          </div>
        )} */}
      </td>
    );
  };

  const handleAddTextColumn = () => {
    setCols(cols + 1);
    let ar = coltypes;
    ar.push(3);
    setColtypes(ar);
    const updatedTableData = tableData.map((row) => [...row, '']);
    setTableData(updatedTableData);
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
      columnType: JSON.stringify(coltypes),
      message,
    };
  
    const index = objectStore.index('messageIndex');
    const request = index.get(message);
  
    request.onsuccess = (event) => {
      const existingTemplate = event.target.result;
      if (existingTemplate) {
        // If a template with the same commit text exists, ask the user for confirmation
        const shouldOverwrite = window.confirm(
          'A template with the same commit text already exists. Do you want to overwrite it?'
        );
  
        if (shouldOverwrite) {
          // If the user confirms overwrite, remove the old entry
          const deleteRequest = objectStore.delete(existingTemplate.uniqueId);
  
          deleteRequest.onsuccess = () => {
            console.log('Old template removed:', existingTemplate);
            // Now add the new template with updated data
            addNewTemplate(objectStore, template);
          };
  
          deleteRequest.onerror = (event) => {
            console.error('Failed to remove old template:', event.target.error);
          };
        } else {
          // If the user cancels overwrite, do not make any changes
          console.log('Template not overwritten.');
        }
      } else {
        // If no template with the same commit text exists, add the new template directly
        addNewTemplate(objectStore, template);
      }
    };
  
    request.onerror = (event) => {
      console.error('Failed to check for existing templates:', event.target.error);
    };
  };
  
  const addNewTemplate = (objectStore, template) => {
    const addRequest = objectStore.add(template);
  
    addRequest.onsuccess = () => {
      console.log('Template saved:', template);
      alert('Template saved successfully!');
    };
  
    addRequest.onerror = (event) => {
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
        setColtypes(JSON.parse(savedTemplate.columnType));
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
    for(let i=0;i<cols;i++){
      headerRow.push(<th key={'0 '+i}>
        <EditableTableCell className="cells" initialValue={tableData[0][i]===""?"Edit Here":tableData[0][i]} onSave={(value) => handleCellChange(0,i,value)} />
      </th>

      );
    }
    table.push(<tr>{headerRow}</tr>)

    for(let i=1;i<rows;i++){
      const row=[];
      row.push(
        <td key={i+' 0'}>
        <EditableTableCell className="cells" initialValue={i} onSave={(value) => handleCellChange(i,0,value) }/>
        </td>
      );

      for(let j=1;j<cols;j++){
        if(coltypes[j]===1){
          row.push(
            <td key={i+" "+j}>
              <div className='circle'></div>
            </td>
          )
        }
        else if(coltypes[j]===2){
          row.push(
            <IdColumn
              key={`idColumn_${j}`}
              length={5}
              colIndex={j}
            />
          );
        }
        else{
          row.push(
            <td key={i+" "+j}>
              <EditableTableCell className="cells" initialValue={""} onSave={(value) => handleCellChange(i,j,value) }/>
            </td>
          )
        }
      }
      table.push(<tr>{row}</tr>)
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
        <button className="button" onClick={handleAddOmrColumn}>
          Add OMR-Column
        </button>
        <button className="button" onClick={handleAddIdColumn}>
          Add ID-Column
        </button>
        <button className="button" onClick={handleAddTextColumn}>
          Add Text-Column
        </button>
        <button className="button" onClick={handleRemoveColumn}>
          Remove Column
        </button>
        {/* <input
          type="range"
          min={2}
          max={10}
          value={rolls}
          onChange={handleIDChange}
        /> */}
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
