import React, { useState } from "react";
import "./PublishROI.component.css";

const PublishROI = ({isDisabled, roiJson, className='none'}) => {
  const [url, setUrl] = useState('')

  const handleROIPublish = () => {
    console.log('url is ', url, roiJson)
  }
  return (
    <div className={isDisabled ? `disabled-input ${className}`: className}>
        <label>
            <strong>Post to backend:</strong>
        </label>
        <input
              className="publishRoi"
              type="text"
              value={url}
              placeholder="API URL"
              onChange={(e) => setUrl(e.target.value)}
        />
        <button className="publishRoi" onClick={handleROIPublish}>Publish</button>
    </div>
  );
};

export default PublishROI;
