import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/CategoryBySemester.scss";
import WarningIcon from "@mui/icons-material/Warning";
import { semesters } from "../data.js";
import Loader from "./Loader";

const CategoryBySemester = () => {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/notes?semester=${selectedSemester}`
        );
        setNotes(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch notes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedSemester]);

  return (
    <div className="Category_By_Semester">
      <h1>Select a Semester</h1>
      <div className="Select_Semester">
        {semesters.map((semester, index) => (
          <button
            key={index}
            onClick={() =>
              handleSemesterSelect(parseInt(semester.label.substring(9)))
            }
            style={{
              margin: "5px",
              padding: "10px",
              backgroundColor:
                selectedSemester === parseInt(semester.label.substring(9))
                  ? "#468847"
                  : "#f0f0f0",
              color:
                selectedSemester === parseInt(semester.label.substring(9))
                  ? "#fff"
                  : "#000",
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
      {error && <p>{error}</p>}

      {!loading && !error && selectedSemester && notes.length > 0 && (
        <div id="semester">
          <ul>
            {notes.length > 0 &&
              notes.map((note, index) => (
                <li key={index} className="card">
                  <a href={`${process.env.REACT_APP_BASE_URL}/${note._id}`} target="_blank">
                    <div className="card_img" style={{ marginBottom: "10px" }}>
                      <img
                        src="https://www.elegantthemes.com/blog/wp-content/uploads/2018/12/top11.png"
                        alt={note.title}
                        style={{ maxWidth: "100%" }}
                        loading="lazy"
                      />
                    </div>
                    <div className="card_content">
                      <h3 className="card_title">{note.title}</h3>
                      <p className="card_description">{note.description}</p>
                    </div>
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}

      {!loading && !error && selectedSemester && notes.length === 0 && (
        <div className="Not_found">
          <WarningIcon className="Warning" />
          <p>No notes available for this semester.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryBySemester;
