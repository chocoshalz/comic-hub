import React, { useState, useEffect } from "react";
import "./YearPicker.scss";
import { Button } from "@mui/material";

interface YearPickerProps {
  onYearSelect: (year: number) => void;
  setYearV?: string;
}

const YearPicker: React.FC<YearPickerProps> = ({ onYearSelect, setYearV }) => {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState<number>(currentYear - 6);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredYears, setFilteredYears] = useState<number[]>([]);
  const [selectedYear, setYear] = useState<string | undefined>(setYearV);

  // Sync `selectedYear` with `setYearV` from parent
  useEffect(() => {
    if (setYearV !== undefined) {
      setYear(setYearV);
    }
  }, [setYearV]);

  // Update filtered years based on search query or year range
  useEffect(() => {
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);
    if (searchQuery) {
      const searchResult = years.filter((year) =>
        year.toString().includes(searchQuery)
      );
      setFilteredYears(searchResult);
    } else {
      setFilteredYears(years);
    }
  }, [startYear, searchQuery]);

  const toggleModal = () => setShowModal((prev) => !prev);

  const handlePrevious = () => setStartYear((prev) => prev - 12);
  const handleNext = () => setStartYear((prev) => prev + 12);

  const handleYearClick = (year: number) => {
    onYearSelect(year); // Notify parent about year selection
    setYear(year.toString()); // Update local selectedYear state
    setShowModal(false); // Close modal after selection
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
const resetPublicationYear = () => {
  onYearSelect(0); // Notify parent about year selection
    setYear(""); // Update local selectedYear state
    setShowModal(false); // Close modal after selection
}
  return (
    <div className="year-picker">
      <div className="publication-year">
        <div>
          <div className="py-text">Publication Year:</div>
          <div className="input-reset">
            <div>
            <input
              type="text"
              placeholder="Select year..."
              value={selectedYear || ""}
              onClick={toggleModal}
              onChange={handleSearchChange}
              className="search-bar select-year"
            />
            </div>
            <div>
              {/* <div className="reset-btn">reset</div> */}
            <Button variant="contained" style={{width:'60px'}} color="secondary" onClick={()=> resetPublicationYear()}>
            reset
          </Button>
            </div>
            
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Select Year</h3>
              <button onClick={toggleModal} className="close-button">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="popover-header">
                <button onClick={handlePrevious} className="nav-button">
                  &lt; Previous
                </button>
                <button onClick={handleNext} className="nav-button">
                  Next &gt;
                </button>
              </div>
              <div className="popover-grid">
                {filteredYears.map((year: any) => (
                  <div
                    key={year}
                    className={`year-picker-cell ${
                      year === selectedYear ? "selected" : ""
                    }`}
                    onClick={() => handleYearClick(year)}
                  >
                    {year}
                    {/* {year.toString() +" <= " +" => "+ selectedYear} */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YearPicker;
