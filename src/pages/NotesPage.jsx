import React, { useState, useEffect, useCallback } from "react";
import { semesters, noteTypes, subjects } from "../data";
import useFetch from "../hooks/useFetch";
import "../styles/NotesPage.scss";
import Loader from "../components/Loader";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedNoteType, setSelectedNoteType] = useState(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const notesPerPage = 10;

  // Build the query string based on selected filters and current page
  const buildQueryString = () => {
    const semesterFilter = selectedSemester
      ? `semester=${selectedSemester.slice(9)}`
      : "";
    const subjectFilter = selectedSubject ? `subject=${selectedSubject}` : "";
    const noteTypeFilter = selectedNoteType
      ? `noteType=${selectedNoteType}`
      : "";
    const filters = [semesterFilter, subjectFilter, noteTypeFilter]
      .filter(Boolean)
      .join("&");
    return `page=${currentPage}&${filters}`;
  };

  const { data, loading, error } = useFetch(
    `${process.env.REACT_APP_BASE_URL}/notes?${buildQueryString()}`
  );

  // Update notes and totalNotes when API data is fetched
  useEffect(() => {
    if (data && Array.isArray(data.notes)) {
      setNotes((prevNotes) => [...prevNotes, ...data.notes]);
      setTotalNotes(data.total || 0);
    }
  }, [data]);

  // Handle filter selection
  const handleFilter = (type, value) => {
    if (type === "semester") {
      setSelectedSemester(selectedSemester === value ? null : value);
    } else if (type === "subject") {
      setSelectedSubject(selectedSubject === value ? null : value);
    } else if (type === "noteType") {
      setSelectedNoteType(selectedNoteType === value ? null : value);
    }
    setCurrentPage(1); // Reset page on filter change
    setNotes([]); // Clear notes when filters change
  };

  // Handle scrolling to load more notes
  const handleScroll = useCallback(() => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= scrollableHeight - 200 && !loading) {
      if (currentPage * notesPerPage < totalNotes) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  }, [loading, currentPage, totalNotes]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleShowMore = () => {
    setShowMoreFilters(!showMoreFilters);
  };

  if (loading && notes.length === 0) return <Loader />;
  if (error)
    return <div className="error">Error loading notes: {error.message}</div>;

  const combinedFilters = [
    { type: "semester", filters: semesters },
    { type: "subject", filters: subjects },
    { type: "noteType", filters: noteTypes },
  ];
  const visibleFiltersCount = 5;

  return (
    <div className="notes-page">
      <div className="filters-section">
        <h2>Filters</h2>
        {combinedFilters.map((filterGroup, groupIndex) => (
          <div key={groupIndex}>
            <h3>
              {filterGroup.type.charAt(0).toUpperCase() +
                filterGroup.type.slice(1)}
              s
            </h3>
            <ul>
              {filterGroup.filters
                .slice(
                  0,
                  showMoreFilters
                    ? filterGroup.filters.length
                    : visibleFiltersCount
                )
                .map((filter, index) => (
                  <li
                    key={index}
                    onClick={() => handleFilter(filterGroup.type, filter.label)}
                    className={
                      (filterGroup.type === "semester" &&
                        selectedSemester === filter.label) ||
                      (filterGroup.type === "subject" &&
                        selectedSubject === filter.label) ||
                      (filterGroup.type === "noteType" &&
                        selectedNoteType === filter.label)
                        ? "selected"
                        : ""
                    }
                  >
                    {filter.label}
                  </li>
                ))}
            </ul>
            <button onClick={handleShowMore}>
              {showMoreFilters ? "Show Less" : "Show More"}
            </button>
          </div>
        ))}
      </div>
      <div className="notes-list">
        <h1>Notes</h1>
        <div className="notes-grid">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div className="notes-card" key={note._id}>
                <a
                  href={`/note/${note._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={
                      note.docImg ||
                      "https://www.elegantthemes.com/blog/wp-content/uploads/2018/12/top11.png"
                    }
                    alt={note.title}
                    className="notes-card-img"
                  />
                  <h3 className="notes-card-title">{note.title}</h3>
                  <p className="notes-card-description">{note.description}</p>
                </a>
              </div>
            ))
          ) : (
            <p>No notes available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
