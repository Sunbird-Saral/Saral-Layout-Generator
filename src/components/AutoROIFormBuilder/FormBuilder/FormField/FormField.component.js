import React, { useState } from "react";
import "./FormField.component.css";

const FormField = ({ isOpen, onClose, setFormJson, fieldOrder, type }) => {
  const [fieldStyle, setFieldStyle] = useState({
    extractionMethod: {},
    cellIndex: fieldOrder,
  });
  const [errors, setErrors] = useState({});

  const handleFieldStyle = (value, type, isCountValue = null, isChecked=null) => {
    let obj = {};
    if (type == "formate") {
      obj["fieldName"] = value.toUpperCase();
    }
    if (isCountValue != null && isCountValue !=0 && isChecked) {
      let nobj = {};
      nobj[value] = parseInt(isCountValue);
      let count = 0;
      obj[type] = { ...fieldStyle[type], ...nobj };
      for (let i in obj[type]) {
        count = count + obj[type][i];
      }
      obj["count"] = count;
    } else if(isChecked === false || isCountValue == 0) {
      fieldStyle.count = fieldStyle.count - fieldStyle[type][value];
      delete fieldStyle[type][value];
    } else {
      obj[type] = value;
    }
    setFieldStyle({ ...fieldStyle, ...obj });
  };

  const validateForm = () => {
    const errors = {};
    if (!fieldStyle["formate"] || fieldStyle["formate"] == " ") {
      errors["formate"] = "Field Name is required";
    }
    if (
      !fieldStyle["extractionMethod"] ||
      Object.keys(fieldStyle["extractionMethod"]).length == 0
    ) {
      errors["extractionMethod"] = "Field Type is required or Field Length cannot be 0";
    }
    if (!fieldStyle["cellIndex"] || fieldStyle["cellIndex"] == 0) {
      errors["cellIndex"] = "Field Order is required";
    }

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    setErrors(errors);
    if (Object.keys(errors).length == 0) {
      onClose();
      let config = {};
      let { fieldName, ...robj } = fieldStyle;
      config[fieldName] = robj;
      setFormJson(config);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="weight-popup">
          <label>
            Field Name:
            <input
              type="text"
              value={fieldStyle["formate"]}
              onChange={(e) => handleFieldStyle(e.target.value, "formate")}
            />
            {errors.formate && (
              <span className="error-msg">{errors.formate}</span>
            )}
          </label>
          <label>
            Field Type:
            <ol>
              {type == "TEXT" && (
                <li>
                  <label>
                    Alphabets Only:
                    <input
                      type="checkbox"
                      value="BLOCK_LETTER_CLASSIFICATION"
                      checked={
                        fieldStyle["extractionMethod"][
                          "BLOCK_LETTER_CLASSIFICATION"
                        ]
                      }
                      onChange={(e) =>
                        handleFieldStyle(
                          "BLOCK_LETTER_CLASSIFICATION",
                          "extractionMethod",
                          1,
                          e.target.checked
                        )
                      }
                    />
                  </label>
                  <label>
                    Field Length:
                    <input
                      className="checkboxOption"
                      type="number"
                      min="0"
                      value={
                        fieldStyle["extractionMethod"][
                          "BLOCK_LETTER_CLASSIFICATION"
                        ] || 0
                      }
                      onChange={(e) =>
                        handleFieldStyle(
                          "BLOCK_LETTER_CLASSIFICATION",
                          "extractionMethod",
                          e.target.value,
                          true
                        )
                      }
                    />
                  </label>
                </li>
              )}
              {type == "TEXT" && (
                <li>
                  <label>
                    Numeric Only:
                    <input
                      type="checkbox"
                      value="NUMERIC_CLASSIFICATION"
                      checked={
                        fieldStyle["extractionMethod"]["NUMERIC_CLASSIFICATION"]
                      }
                      onChange={(e) =>
                        handleFieldStyle(
                          "NUMERIC_CLASSIFICATION",
                          "extractionMethod",
                          1,
                          e.target.checked
                        )
                      }
                    />
                    <label>
                      Field Length:
                      <input
                        className="checkboxOption"
                        type="number"
                        min="0"
                        value={
                          fieldStyle["extractionMethod"][
                            "NUMERIC_CLASSIFICATION"
                          ] || 0
                        }
                        onChange={(e) =>
                          handleFieldStyle(
                            "NUMERIC_CLASSIFICATION",
                            "extractionMethod",
                            e.target.value,
                            true
                          )
                        }
                      />
                    </label>
                  </label>
                </li>
              )}
              {type == "TEXT" && (
                <li>
                  <label>
                    Alpha-Numeric:
                    <input
                      type="checkbox"
                      value="BLOCK_ALPHANUMERIC_CLASSIFICATION"
                      checked={
                        fieldStyle["extractionMethod"][
                          "BLOCK_ALPHANUMERIC_CLASSIFICATION"
                        ]
                      }
                      onChange={(e) =>
                        handleFieldStyle(
                          "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                          "extractionMethod",
                          1,
                          e.target.checked
                        )
                      }
                    />
                    <label>
                      Field Length:
                      <input
                        className="checkboxOption"
                        type="number"
                        min="0"
                        value={
                          fieldStyle["extractionMethod"][
                            "BLOCK_ALPHANUMERIC_CLASSIFICATION"
                          ] || 0
                        }
                        onChange={(e) =>
                          handleFieldStyle(
                            "BLOCK_ALPHANUMERIC_CLASSIFICATION",
                            "extractionMethod",
                            e.target.value,
                            true
                          )
                        }
                      />
                    </label>
                    {errors.extractionMethod && (
                      <span className="error-msg">
                        {errors.extractionMethod}
                      </span>
                    )}
                  </label>
                </li>
              )}
              {type == "OMR" && (
                <li>
                  <label>
                    OMR Only:
                    <input
                      type="checkbox"
                      value="CELL_OMR"
                      checked="true"
                      onChange={(e) =>
                        handleFieldStyle("CELL_OMR", "extractionMethod", 1,
                        e.target.checked)
                      }
                    />
                    <label>
                      Field Length:
                      <input
                        className="checkboxOption"
                        type="number"
                        min="0"
                        value={fieldStyle["extractionMethod"]["CELL_OMR"] || 0}
                        onChange={(e) =>
                          handleFieldStyle(
                            "CELL_OMR",
                            "extractionMethod",
                            e.target.value,
                            true
                          )
                        }
                      />
                    </label>
                    {errors.extractionMethod && (
              <span className="error-msg">{errors.extractionMethod}</span>
              )}
                  </label>
                </li>
              )}
            </ol>
          </label>
          <label>
            Field Order:
            <input
              type="number"
              value={fieldStyle["cellIndex"] || fieldOrder}
              onChange={(e) => handleFieldStyle(e.target.value, "cellIndex")}
            />
            {errors.cellIndex && (
              <span className="error-msg">{errors.cellIndex}</span>
            )}
          </label>
          <button onClick={handleSubmit}>Apply</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    )
  );
};

export default FormField;
