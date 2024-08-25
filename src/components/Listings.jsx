import { useState, useEffect } from "react";
import { subjects } from "../data";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";

const Listings = () => {
  const [subject, setSubject] = useState(subjects[0].label);
  const [loading, setLoading] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const listingsFromStore = useSelector((state) => state.listings);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const response = await fetch("http://localhost:3001/notes"); // Fetch notes from your server endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch notes. Please try again.");
        }
        const data = await response.json();

        // Optionally, update your Redux state with the fetched data
        dispatch(setListings(data)); // Uncomment and implement if using Redux action

        // Filter notes based on selected subject
        const filteredNotes = data.data.filter(
          (listing) => listing.subject === subject
        );
        setFilteredNotes(filteredNotes);
      } catch (error) {
        setError(error.message); // Set error state if there is an issue with fetching
      } finally {
        setLoading(false); // Stop loading regardless of the outcome
      }
    };

    fetchNotes();
  }, [subject]);

  return (
    <>
      <div className="category-list">
        {subjects?.map((subjectItem, index) => (
          <div
            className={`category ${
              subjectItem.label === subject ? "selected" : ""
            }`}
            key={index}
            onClick={() => setSubject(subjectItem.label)}
          >
            <div className="category_icon">{subjectItem.icon}</div>
            <h3>{subjectItem.label}</h3>
          </div>
        ))}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredNotes.length === 0 ? (
        <div>No Notes Found</div>
      ) : (
        <div className="listings">
          {filteredNotes.map(
            (
              {
                _id,
                creator,
                title,
                description,
                listingDocUrl,
                subject,
                semester,
                noteType,
              },
              index
            ) => (
              <ListingCard
                key={index}
                listingId={_id}
                creator={creator._id}
                listingDocUrl={listingDocUrl}
                subject={subject}
                title={title}
                description={description}
                semester={semester}
                noteType={noteType}
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default Listings;
