import React, { useState } from "react";
import { CSVLink } from "react-csv";
import Container from "./Container";

function Converter() {
  // file system
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mappers, setMappers] = useState([]);

  // controlled flag
  const [isCSVDataReady, setIsCSVDataReady] = useState(false);
  const [isMapperDataReady, setMapperDataReady] = useState(false);

  // csv format
  const [csvData, setCsvData] = useState([]);
  const [folderName, setFolderName] = useState("");

  const handleFileList = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleSubmission = () => {
    if (selectedFiles.length === 0) {
      alert("No file selected");
      return;
    }

    for (const file of selectedFiles) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = () => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(reader.result, "text/xml");
        const mapper = xmlDoc.getElementsByTagName("mapper")[0];
        const mapperItem = {
          fileName: file.name,
          xml: mapper,
        };
        setMappers((prev) => [...prev, mapperItem]);
      };
    }

    setMapperDataReady(true);
  };

  const generateData = () => {
    const ignoreTags = ["resultMap", "mapper"];
    const location = `src/main/resources/mappers/${folderName}/`;
    const data = [];
    for (var i = 0; i < mappers.length; i++) {
      const fullLocation = location + mappers[i].fileName;
      const tmpMapChildNodes = mappers[i].xml.childNodes;

      if (tmpMapChildNodes === undefined) continue;

      for (var x = 0; x < tmpMapChildNodes.length; x++) {
        const tagName = tmpMapChildNodes[x].tagName;
        const id = tmpMapChildNodes[x].id;

        if (tagName === undefined) continue;
        else if (ignoreTags.includes(tagName)) continue;

        const tmp = [];
        tmp.push(fullLocation);
        tmp.push(id);
        tmp.push(tagName.charAt(0).toUpperCase() + tagName.slice(1));
        data.push(tmp);
      }
    }
    setCsvData(data);
    setIsCSVDataReady(true);
    setMapperDataReady(false);
  };

  return (
    <>
      <Container>
        <input
          placeholder="Folder name"
          onChange={(e) => {
            setFolderName(e.currentTarget.value);
          }}
        />
      </Container>
      <Container>
        <input type="file" name="file" onChange={handleFileList} multiple />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            padding: "1.25rem 0",
          }}
        >
          <button
            disabled={
              !selectedFiles.length > 0 || isMapperDataReady || isCSVDataReady
            }
            onClick={handleSubmission}
          >
            Submit
          </button>
          <button
            onClick={() => {
              location.reload();
            }}
          >
            Reset
          </button>
        </div>
      </Container>
      <Container>
        <button disabled={!isMapperDataReady} onClick={generateData}>
          Generate data
        </button>
      </Container>
      {isCSVDataReady && (
        <CSVLink
          data={csvData}
          onClick={() => {
            location.reload();
          }}
        >
          Download me
        </CSVLink>
      )}
    </>
  );
}

export default Converter;
