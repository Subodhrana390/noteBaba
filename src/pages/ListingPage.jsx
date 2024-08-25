import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "../styles/ListingPage.scss";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const ListingPage = () => {
  const { listingId } = useParams();
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isPdfVisible, setIsPdfVisible] = useState(false);
  const listings = useSelector((state) => state.listings);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const filterNotes = listings.data.filter((listing) => {
      return listing._id === listingId;
    });
    setFilteredNotes(filterNotes);
  }, [listingId, listings.data]);

  const [featuredNote, ...otherNotes] = filteredNotes;

  const togglePdfView = () => {
    setIsPdfVisible((prevState) => !prevState); // Toggle PDF visibility
  };

  return (
    <div className="container">
      <div className="product">
        <h2>{featuredNote?.title}</h2>
        <div className="product-details">
          <p>
            <strong>Subject:</strong> {featuredNote?.subject}
          </p>
          <p>
            <strong>Semester:</strong> {featuredNote?.semester}
          </p>
          <p>
            <strong>Description:</strong> {featuredNote?.description}
          </p>
          <p>
            <strong>Note Type:</strong> {featuredNote?.noteType}
          </p>

          {featuredNote?.listingDocUrl.length == 1 ? (
            <div>
              {/* View Button to toggle PDF visibility */}
              <button onClick={togglePdfView} className="view-button">
                {isPdfVisible ? "Hide PDF" : "View PDF"}
              </button>

              {/* Download Button for PDF */}
              <a
                href={featuredNote.listingDocUrl[0].url}
                download
                className="download-button"
              >
                Download PDF
              </a>

              {/* Conditional rendering of PDF Viewer */}
              {isPdfVisible && (
                <div className="pdf-viewer">
                  <Worker
                    workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                  >
                    <Viewer
                      fileUrl={featuredNote.listingDocUrl[0].url}
                      plugins={[defaultLayoutPluginInstance]}
                      defaultScale={SpecialZoomLevel.PageFit}
                    />
                  </Worker>
                </div>
              )}
            </div>
          ) : (
            <>
              {featuredNote?.listingDocUrl.length > 1 &&
                featuredNote?.listingDocUrl.map((doc) => (
                  <div>
                    {/* View Button to toggle PDF visibility */}
                    <button onClick={togglePdfView} className="view-button">
                      {isPdfVisible ? "Hide PDF" : "View PDF"}
                    </button>

                    {/* Download Button for PDF */}
                    <a href={doc.url} download className="download-button">
                      Download PDF
                    </a>

                    {/* Conditional rendering of PDF Viewer */}
                    {isPdfVisible && (
                      <div className="pdf-viewer">
                        <Worker
                          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                        >
                          <Viewer
                            fileUrl={doc.url}
                            plugins={[defaultLayoutPluginInstance]}
                            defaultScale={SpecialZoomLevel.PageFit}
                          />
                        </Worker>
                      </div>
                    )}
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
