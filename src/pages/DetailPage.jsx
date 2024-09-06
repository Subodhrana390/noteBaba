import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "../styles/DetailPage.scss";
import Loader from "../components/Loader";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const ListingPage = () => {
  let { noteId } = useParams();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListingDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/notes/${noteId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch the listing details.");
        }

        const data = await response.json();
        setListing(data.data);
      } catch (err) {
        setError("Failed to load listing details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [noteId]);

  if (loading) return <Loader />;

  if (!listing) return <div>No listing found</div>;

  return (
    <div className="container">
      <section id="Main_Section">
        <div className="left_section">
          <img
            src="https://www.elegantthemes.com/blog/wp-content/uploads/2018/12/top11.png"
            alt=""
          />
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

export default ListingPage;
