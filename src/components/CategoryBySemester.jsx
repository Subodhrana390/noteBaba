import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CategoryBySemester.scss";
import WarningIcon from "@mui/icons-material/Warning";
import { semesters } from "../data.js";
import Loader from "./Loader";

const CategoryBySemester = () => {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSemesterSelect = (semester) => setSelectedSemester(semester);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/notes`,
          {
            params: { semester: selectedSemester, page: 1 },
          }
        );
        setNotes(data.data.notes || []);
      } catch (err) {
        setError(
          "Unable to fetch notes at the moment. Please try again later."
        );
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedSemester]);

  const getButtonStyles = (semester) => {
    const isSelected = selectedSemester === semester;
    return {
      backgroundColor: isSelected ? "#468847" : "#f0f0f0",
      color: isSelected ? "#fff" : "#000",
    };
  };

  return (
    <div className="category-by-semester">
      <h1>Select a Semester</h1>
      <div className="select-semester">
        {semesters.map((semester, index) => (
          <button
            key={index}
            onClick={() =>
              handleSemesterSelect(parseInt(semester.label.substring(9)))
            }
            style={{
              ...getButtonStyles(parseInt(semester.label.substring(9))),
              margin: "5px",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Semester {semester.icon}
          </button>
        ))}
      </div>
      {loading && <Loader />}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && notes.length > 0 && (
        <div className="notes-list">
          <ul>
            {notes.map((note, index) => (
              <li key={index} className="notes-card">
                <a
                  onClick={() => {
                    navigate(`/note/${note._id}`);
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className="notes-card-img"
                    style={{ marginBottom: "10px" }}
                  >
                    <img
                      src={
                        note.docImg ||
                        "https://www.elegantthemes.com/blog/wp-content/uploads/2018/12/top11.png"
                      }
                      alt={note.title}
                      style={{ maxWidth: "100%" }}
                      loading="lazy"
                    />
                  </div>
                  <div className="notes-card-content">
                    <h3 className="notes-card-title">{note.title}</h3>
                    <p className="notes-card-description">{note.description}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!loading && !error && notes.length === 0 && (
        <div className="not-found">
          <WarningIcon className="warning-icon" />
          <p>No notes available for this semester.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryBySemester;
