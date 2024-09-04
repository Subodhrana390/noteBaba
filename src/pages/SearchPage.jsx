import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/SearchPage.scss";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [counts, setCounts] = useState(0);
  const [notes, setNotes] = useState([]);
  const [cancelToken, setCancelToken] = useState(null);

  const handleChange = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    if (cancelToken) {
      cancelToken.cancel();
    }

    const newCancelToken = axios.CancelToken.source();
    setCancelToken(newCancelToken);

    const timeoutId = setTimeout(() => {
      axios({
        method: "get",
        url: `http://localhost:3001/notes/search/${search}`,
        cancelToken: newCancelToken.token,
      })
        .then((response) => {
          setNotes(response.data.listings);
          setCounts(response.data.counts);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("Request canceled");
          } else {
            console.error(err);
          }
        });
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (cancelToken) {
        cancelToken.cancel();
      }
    };
  }, [search]);

  return (
    <div className="Search_bar" id="Search">
      <div className="Search_input_box">
        <label htmlFor="search_input">📚</label>
        <input
          type="text"
          name="search_input"
          placeholder="Search..."
          value={search}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      <div className="Search_filter_result">
        <div className="filter_section"></div>
        <div className="Search_result">
          <h3>{counts} Search Results</h3>
          <ul className="Results">
            {notes.map((note, index) => (
              <li key={index} className="card">
                <a href={`/${note._id}`} target="_blank">
                  <div className="card_img" style={{ marginBottom: "10px" }}>
                    <img
                      src="https://www.elegantthemes.com/blog/wp-content/uploads/2018/12/top11.png"
                      alt={note.title}
                      style={{ maxWidth: "100%" }}
                      loading="lazy"
                    />
                  </div>
                  <div className="card_content">
                    <h4 className="card_title">{note.title}</h4>
                    <p className="card_description">{note.description}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
