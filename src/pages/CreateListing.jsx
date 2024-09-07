import Navbar from "../components/Navbar";
import "../styles/CreateListing.scss";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { subjects, semesters, noteTypes } from "../data";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosDocument } from "react-icons/io";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [noteType, setNoteType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* DOCUMENT UPLOAD */
  const [documents, setDocuments] = useState([]);
  const [docImg, setDocImg] = useState(null);

  const handleUploadDocuments = (e) => {
    const newDocuments = e.target.files;
    let isValid = true;

    for (let i = 0; i < newDocuments.length; i++) {
      if (newDocuments[i].size > 10 * 1024 * 1024) {
        isValid = false;
        setError("File size exceeds 10MB limit");
        break;
      }
    }

    if (isValid) {
      setDocuments((prevDocuments) => [...prevDocuments, ...newDocuments]);
      setError(null);
    }
  };
  const handleDragDocument = (result) => {
    if (!result.destination) return;

    const items = Array.from(documents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDocuments(items);
  };

  const handleRemoveDocument = (indexToRemove) => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((_, index) => index !== indexToRemove)
    );
  };

  /* DESCRIPTION */
  const [formDescription, setFormDescription] = useState({
    title: "",
    description: "",
    topics: "",
  });

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription({
      ...formDescription,
      [name]: value,
    });
  };
  const token = useSelector((state) => state.token);

  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      /* Create a new FormData object to handle file uploads */
      const noteForm = new FormData();
      noteForm.append("subject", subject);
      noteForm.append("semester", semester.slice(8));
      noteForm.append("noteType", noteType);
      noteForm.append("title", formDescription.title);
      noteForm.append("description", formDescription.description);
      noteForm.append("topics", formDescription.topics);
      noteForm.append("docImg", docImg);

      /* Append each selected document to the FormData object */
      documents.forEach((document) => {
        noteForm.append("noteFiles", document);
      });

      /* Send a POST request to the server */
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/notes/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: noteForm,
        }
      );

      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      console.log("Publish Note failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="create-note">
        <h1>Upload Your Notes</h1>
        <form onSubmit={handlePost}>
          <div className="create-note_step1">
            <h2>Step 1: Provide Basic Information</h2>
            <hr />
            <h3>Select the subject of your notes:</h3>
            <div className="subject-list">
              {subjects?.map((item, index) => (
                <div
                  className={`subject ${
                    subject === item.label ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => setSubject(item.label)}
                >
                  <div className="subject_icon">{item.icon}</div>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>

            <h3>Select the semester:</h3>
            <div className="semester-list">
              {semesters?.map((item, index) => (
                <div
                  className={`semester ${
                    semester === item.label ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => setSemester(item.label)}
                >
                  <div className="semester_icon">{item.icon}</div>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>

            <h3>Choose the type of note:</h3>
            <div className="type-list">
              {noteTypes?.map((item, index) => (
                <div
                  className={`type ${noteType === item.label ? "selected" : ""}`}
                  key={index}
                  onClick={() => setNoteType(item.label)}
                >
                  <div className="type_text">
                    <h4>{item.label}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="type_icon">{item.icon}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="create-note_step2">
            <h2>Step 2: Upload Your Notes</h2>
            <hr />
            <h3>Provide a brief description of your notes:</h3>
            <div className="description">
              <p>Doc Img</p>
              <input
                type="file"
                placeholder="Title"
                name="docImg"
                onChange={(e) => setDocImg(e.target.files[0])}
                required
              />
              <p>Title</p>
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={formDescription.title}
                onChange={handleChangeDescription}
                required
              />
              <p>Description</p>
              <textarea
                type="text"
                placeholder="Description"
                name="description"
                value={formDescription.description}
                onChange={handleChangeDescription}
                required
              />
              <p>Topics Covered</p>
              <input
                type="text"
                placeholder="Key topics covered"
                name="topics"
                value={formDescription.topics}
                onChange={handleChangeDescription}
                required
              />
            </div>
            <h3>Add documents:</h3>
            <DragDropContext onDragEnd={handleDragDocument}>
              <Droppable droppableId="documents" direction="horizontal">
                {(provided) => (
                  <div
                    className="documents"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {documents.length < 1 && (
                      <>
                        {error && <div style={{ color: "red" }}>{error}</div>}
                        <input
                          id="document"
                          type="file"
                          style={{ display: "none" }}
                          accept=".pdf,.docx,.pptx"
                          onChange={handleUploadDocuments}
                          multiple
                        />
                        <label htmlFor="document" className="alone">
                          <div className="icon">
                            <IoIosDocument />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}

                    {documents.length >= 1 && (
                      <>
                        {documents.map((document, index) => {
                          return (
                            <Draggable
                              key={index}
                              draggableId={index.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className="document"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  console.log(document)
                                  <p>{document.name}</p>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDocument(index)}
                                  >
                                    <BiTrash />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        <input
                          id="document"
                          type="file"
                          style={{ display: "none" }}
                          accept=".pdf,.docx,.pptx"
                          onChange={handleUploadDocuments}
                          multiple
                        />
                        <label htmlFor="document" className="together">
                          <div className="icon">
                            <IoIosDocument />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <span>The file size should not exceed 10 megabytes.</span>
          </div>

          <button
            className="submit_btn"
            type="submit"
            disabled={loading || error}
          >
            {loading ? "UPLOADING..." : "UPLOAD NOTES"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateListing;
