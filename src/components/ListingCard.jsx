import "../styles/ListingCard.scss";

const ListingCard = ({
  listingId,
  creator,
  title,
  description,
  listingDocUrl,
  subject,
  semester,
  noteType,
}) => {
  return (
    <div class="listing-container">
      <a href={`notes/${listingId}`} style={{ textDecoration: "none" }}>
        <div class="listing-card">
          <h2 class="listing-title">{title}</h2>
          <p class="listing-subject">Subject: {subject}</p>
          <p class="listing-semester">Semester: {semester}</p>
          <p class="listing-note-type">Note Type: {noteType}</p>
          <p class="listing-description">{description}</p>
          <div class="listing-documents">
            <h3>Documents:</h3>
            <ul>
              {listingDocUrl.map((Doc, index) => (
                <li key={index}>
                  <a href={Doc.url} target="_blank">
                    {Doc._id}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ListingCard;
