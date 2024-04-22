import React, { useEffect, useState, useRef } from "react";
import cv from "@techstark/opencv-js";
import "./ROIGenerator.component.css";
import { Link, useLocation } from "react-router-dom";

const ROIGenerator = ({
  srcImage,
  imgData,
  formConfigJson,
  notifyError,
  selectedOption,
  publishROI,
}) => {
  const canvasRef = useRef(null);
  const [img, setImage] = useState(srcImage.clone());
  const [isROIMarkingInit, setROIMarkingInit] = useState(false);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFinalRoiListReady, setIsFinalRoiListReady] = useState(false);
  const [roiDim, setRoiDim] = useState([]);
  const [roiList, setRoiList] = useState([]);
  const [roiJson, setRoiJson] = useState({});
  const [mode, setMode] = useState("SELECT");
  const [formName, setFormName] = useState("");
  const location = useLocation();

  const drawROI = (ctx, x, y, width, height) => {
    const canvas = canvasRef.current;
    const image = document.getElementById("srcImgCanvas");
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cv.imshow("srcImgCanvas", img);
    ctx.drawImage(image, 0, 0);

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.strokeStyle = "red";
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
      const ctx = canvasRef.current.getContext("2d");
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
      const ctx = canvasRef.current.getContext("2d");
      setIsDragging(false);
      if (mode == "DELETE") {
        
        for (let [i, roi] of roiList.entries()) {
          if (
            0 <= currentX - roi.x &&
            currentX - roi.x <= 15 &&
            0 <= currentY - roi.y &&
            currentY - roi.y <= 15
          ) {
            const point1 = new cv.Point(roi.x, roi.y);
            const point2 = new cv.Point(roi.x + roi.width, roi.y + roi.height);
            cv.rectangle(img, point1, point2, [255, 0, 0, 255], -1);
            roiList.splice(i, 1);
            //setRoiList(roiList);
            cv.imshow("srcImgCanvas", img);
          }
        }
      } else if (mode == "EDIT") {
        let x = currentX - width;
        let y = currentY - height;
        setRoiList([...roiList, { x, y, width, height }]);
        const point1 = new cv.Point(currentX - width, currentY - height);
        const point2 = new cv.Point(currentX, currentY);
        cv.rectangle(img, point1, point2, [0, 255, 0, 255], 2);
      } else {
        drawROI(ctx, startX, startY, width, height);
        setRoiDim([width + 3, height + 3]);
      }
    }
  };

  useEffect(() => {
    const canvas = document.getElementById("srcImgCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cv.imshow("srcImgCanvas", srcImage);
    const searchParams = new URLSearchParams(location.search);
    const inputValueFromUrl = searchParams.get("formName");
    if (inputValueFromUrl) {
      setFormName(inputValueFromUrl);
    }
  }, [srcImage, location]);

  const detectContours = () => {
    //let imgl = srcImage.clone();
    setImage(img);
    setROIMarkingInit(true);
    const gray = new cv.Mat();
    cv.cvtColor(img, gray, cv.COLOR_BGR2GRAY);
    const blurred = new cv.Mat();
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    const thresh = new cv.Mat();
    cv.adaptiveThreshold(
      blurred,
      thresh,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY_INV,
      11,
      2
    );

    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(
      thresh,
      contours,
      hierarchy,
      cv.RETR_TREE,
      cv.CHAIN_APPROX_NONE
    );
    drawContours(contours, img);

    // Clean up
    gray.delete();
    blurred.delete();
    thresh.delete();
    hierarchy.delete();
  };

  const drawContours = (contours, dst) => {
    const canvas = document.getElementById("srcImgCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let froiList = [];
    for (let i = 0; i < contours.size(); i++) {
      const color = new cv.Scalar(0, 255, 0, 255); // Blue color
      const contour = contours.get(i);
      let rect = cv.boundingRect(contour);
      let min_width = roiDim[0] - 7;
      let min_height = roiDim[1] - 7;
      if (
        min_width <= rect.width &&
        rect.width <= roiDim[0] &&
        min_height <= rect.height &&
        rect.height <= roiDim[1]
      ) {
        let duplicate = false;
        for (let [i, roi] of froiList.entries()) {
          if (
            -5 <= (rect.x - roi.x) &&
            (rect.x - roi.x) <= 5 && 
            -5 <= (rect.y - roi.y) &&
            (rect.y - roi.y) <= 5
          ) {
            duplicate = true;
            break;
          }
        }

        if(!duplicate) {
          const point1 = new cv.Point(rect.x, rect.y);
          const point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
          cv.rectangle(dst, point1, point2, [0, 255, 0, 255], 2);
          froiList.push(rect);
        }
      }
    }
    setRoiList([...roiList, ...froiList]);
    cv.imshow("srcImgCanvas", dst);
  };

  const deleteROI = () => {
    setMode("DELETE");
  };

  const editROI = () => {
    setMode("EDIT");
  };

  const resetROI = () => {
    const canvas = document.getElementById("srcImgCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cv.imshow("srcImgCanvas", srcImage);
    setImage(srcImage.clone());
    setRoiList([]);
    setMode("SELECT");
    setROIMarkingInit(false);
    setIsFinalRoiListReady(false);
  };

  const finishROIMarking = () => {
    let finalRoiList = [];
    roiList.sort((a, b) => {
      return a["x"] - b["x"];
    });
    roiList.sort((a, b) => {
      return a["y"] - b["y"];
    });

    for (let roi of roiList) {
      let rectangle_coords = {
        top: parseInt(roi.y),
        left: parseInt(roi.x),
        bottom: parseInt(parseInt(roi.y) + parseInt(roi.height)),
        right: parseInt(parseInt(roi.x) + parseInt(roi.width)),
      };
      finalRoiList.push(rectangle_coords);
    }

    finalRoiList.sort((a, b) => {
      if (
        a["top"] !== b["top"] &&
        !(a["top"] - b["top"] >= -10 && a["top"] - b["top"] <= 10)
      ) {
        return a["top"] - b["top"];
      } else {
        return a["right"] - b["right"];
      }
    });

    setRoiList(finalRoiList);
    generateROIJson(finalRoiList);
  };

  const downloadJSON = () => {
    const json = JSON.stringify(roiJson, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateROIJson = (froiList) => {
    let mroi_list = {
      layout: {
        version: "1.0",
        name: `${formName}`,
        //pages: "1",
        threshold: {
          experimentalOMRDetection: false,
          minWidth: 0,
          minHeight: 0,
          detectionRadius: 12,
          verticalScanLayout: selectedOption == "Potrait",
        },
        cells: [],
      },
    };
    let index = 0;
    let roiIndex = 0;
    let formConfigJsonclone = JSON.parse(JSON.stringify(formConfigJson))
    for (let key in formConfigJsonclone) {
      let val = formConfigJsonclone[key];
      let extractionMethods = val["extractionMethod"];
      let j = 0;
      let cellData = {
        cellId: val["cellIndex"].toString(),
        //page: "1",
        rois: [],
        render: {
          index: val["cellIndex"],
        },
        format: {
          name: val["formate"],
          value: val["formate"],
        },
        validate: {
          regExp: "",
        },
      };

      let previousi = roiIndex;
      let newVal = val["count"] + roiIndex;
      for (let i = 0; i < froiList.length; i++) {
        if (roiIndex < newVal && roiIndex >= previousi) {
          j = j + 1;
          let extractionMethod = Object.keys(extractionMethods)[0];
          if (j > extractionMethods[extractionMethod]) {
            j = 0;
            delete extractionMethods[extractionMethod];
          }
          let roiData = {
            annotationTags: key + "_" + i.toString(),
            extractionMethod: Object.keys(extractionMethods)[0],
            roiId: index + 1,
            index: i,
            rect: froiList[roiIndex],
          };
          cellData["rois"].push(roiData);
          roiIndex = roiIndex + 1;
          index = index + 1;
        }
      }
      mroi_list["layout"]["cells"].splice(val["cellIndex"], 0, cellData);
    }

    if (froiList.length !== roiIndex || roiIndex == 0) {
      notifyError(
        "ROI marking is not correct. please mark properly again"
      );
      resetROI();
    } else {
      setROIMarkingInit(false);
      finaliseRoIIndex(mroi_list);
      setRoiJson(mroi_list);
      setIsFinalRoiListReady(true);
    }
  };

  function finaliseRoIIndex(mroi_list) {
    let roiindex = 0;
    for (let cells in mroi_list["layout"]["cells"]) {
      for (let roi in cells["rois"]) {
        roiindex = roiindex + 1;
        roi["roiId"] = roiindex.toString();
      }
    }
  }

  function handleROIPublish() {
    publishROI(roiJson);
  }

  return (
    <div className="roi-container">
      <div className="roi-edit-button">
        <h2>Steps for Auto ROI marking!</h2>
        <ol>
          <li>
            Mark Reference ROI
            <ul>
              <li>Drag mouse pointer from one corner to another to mark ROI</li>
              <li>
                Press<button onClick={detectContours}>Mark ROI</button>to start
                auto select
              </li>
              <li>Repeat above till all different input box ROIs are marked</li>
            </ul>
          </li>
          <li>
            Review selected ROIs
            <ul>
              <li>
                Press
                <button
                  className={isROIMarkingInit ? "none" : "roi-btn-disabled"}
                  onClick={deleteROI}
                  disabled={!isROIMarkingInit}
                >
                  Delete ROIs
                </button>
                .Click on left corner of the marked boxs to deselect ROI.
              </li>
              <li>
                Press
                <button
                  className={isROIMarkingInit ? "none" : "roi-btn-disabled"}
                  onClick={editROI}
                  disabled={!isROIMarkingInit}
                >
                  Add ROIs
                </button>
                .Drag mouse pointer from one corner to another to mark ROI
              </li>
              <li>
                Press
                <button
                  className={isROIMarkingInit ? "none" : "roi-btn-disabled"}
                  onClick={resetROI}
                  disabled={!isROIMarkingInit}
                >
                  Reset ROIs
                </button>
                . to start over
              </li>
            </ul>
          </li>
          <li>
            Finalize ROI
            <button
              className={isROIMarkingInit ? "none" : "roi-btn-disabled"}
              onClick={finishROIMarking}
              disabled={!isROIMarkingInit}
            >
              Finish ROI Marking
            </button>{" "}
          </li>
        </ol>
        <p>
          Generate ROI Json:
          <div className="handle-roi-json">
            <button
              className={
                isFinalRoiListReady ? "roi-gen-btn" : "roi-gen-btn-disabled"
              }
              onClick={downloadJSON}
              disabled={!isFinalRoiListReady}
            >
              Download
            </button>
            <strong className="publish-roi"> or </strong>
            <button
              className={
                isFinalRoiListReady ? "roi-gen-btn" : "roi-gen-btn-disabled"
              }
              onClick={handleROIPublish}
              disabled={!isFinalRoiListReady}
            >
              Publish to backend
            </button>
          </div>
        </p>
      </div>
      <div>
        <canvas
          ref={canvasRef}
          id="srcImgCanvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        ></canvas>
      </div>
    </div>
  );
};

export default ROIGenerator;
