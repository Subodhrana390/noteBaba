import { useParams } from "react-router-dom";
import "../styles/DetailPage.scss";
import Loader from "../components/Loader";
import useFetch from "../hooks/useFetch";

const DetailPage = () => {
  const { noteId } = useParams();
  const {
    data: listing,
    loading,
    error,
  } = useFetch(`${process.env.REACT_APP_BASE_URL}/notes/${noteId}`);

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!listing) return <div className="no-listing">No listing found.</div>;

  return (
    <div className="container">
      <section id="Main_Section">
        <div className="left_section">
          <img src={listing.docImg} alt="" />
        </div>

        <div className="right_section">
          <div className="notes_Details">
            <h1>{listing.title}</h1>
            <h4>{listing.subject}</h4>
            <p>
              <strong>Semester : </strong>
              {listing.semester}
            </p>
            <p>{listing.description}</p>
            <span>{listing.noteType}</span>

            <div className="doc_list">
              {listing.listingDocUrl.map((doc, index) => (
                <a key={index} href={doc.url} className="doc_url">
                  View Document
                </a>
              ))}
            </div>
            <button className="Add_to_Wishlist">Add to WishList</button>
          </div>

          <div className="Author">
            <p>
              <span>Author : </span>
              {listing.creator.firstName} {listing.creator.lastName}
            </p>
            <span className="created">
              {listing.updatedAt instanceof Date
                ? listing.updatedAt.toDateString()
                : new Date(listing.updatedAt).toDateString()}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetailPage;
