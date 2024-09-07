import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import "../styles/CategoryPage.scss";
import Loader from "../components/Loader";

const CategoryBySemester = () => {
  const { category } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/notes?noteType=${category}`
        );
        setNotes(response.data.data.notes || []);
      } catch (err) {
        setError("Failed to fetch notes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="Category_Page">
      {loading && <Loader />}
      {error && <p>{error}</p>}

      <div className="category_title">{category}</div>
      {!loading && !error && notes.length > 0 && (
        <div id="semester">
          <ul>
            {notes.map((note, index) => (
              <li key={index} className="card">
                <div onClick={() => navigate(`/note/${note._id}`)}>
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && notes.length === 0 && (
        <div className="Not_found">
          <WarningIcon className="Warning" />
          <p>No notes available for this semester.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryBySemester;
