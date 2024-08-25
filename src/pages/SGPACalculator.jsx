import React, { useState } from "react";
import "./sgpa.css";
import { SemesterData } from "../data/semsterData.js";

const SGPACalculator = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjectData, setSubjectData] = useState([]);
  const [marksObtained, setMarksObtained] = useState([]);
  const [sgpa, setSGPA] = useState(null);

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
    setSelectedSemester("");
    setSubjectData([]);
    setMarksObtained([]);
    setSGPA(null);
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
    const branchData = SemesterData.find(
      (branch) => branch.Branch === selectedBranch
    );
    const semesterData = branchData.Semster.find(
      (semester) => semester.name === event.target.value
    );
    setSubjectData(semesterData.subject);
    setMarksObtained(
      semesterData.subject.map(() => ({
        internal: 0,
        external: 0,
        total: 0,
        grade: "",
      }))
    );
    setSGPA(null);
  };

  const handleMarksChange = (index, type, value) => {
    const newMarksObtained = [...marksObtained];
    newMarksObtained[index][type] = parseInt(value);
    newMarksObtained[index].total =
      newMarksObtained[index].internal + newMarksObtained[index].external;
    setMarksObtained(newMarksObtained);
  };

  const calculateGrade = (total, type) => {
    if (type === "practical") {
      if (total >= 45) return "O";
      if (total >= 40) return "A+";
      if (total >= 35) return "A";
      if (total >= 30) return "B+";
      if (total >= 25) return "B";
      if (total >= 20) return "C";
      return "F";
    } else {
      if (total >= 90) return "O";
      if (total >= 80) return "A+";
      if (total >= 70) return "A";
      if (total >= 60) return "B+";
      if (total >= 50) return "B";
      if (total >= 40) return "C";
      return "F";
    }
  };

  const calculateSGPA = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    const updatedMarks = marksObtained.map((mark, index) => {
      const subjectType = subjectData[index].type.toLowerCase();
      const grade = calculateGrade(mark.total, subjectType);
      const gradePoint = gradeToPoint(grade);
      totalGradePoints += gradePoint * subjectData[index].credit;
      totalCredits += subjectData[index].credit;

      console.log(totalCredits, totalGradePoints);
      return { ...mark, grade };
    });

    setMarksObtained(updatedMarks);

    const sgpa = totalGradePoints / totalCredits;
    setSGPA(sgpa.toFixed(2));
  };

  const gradeToPoint = (grade) => {
    switch (grade) {
      case "O":
        return 10;
      case "A+":
        return 9;
      case "A":
        return 8;
      case "B+":
        return 7;
      case "B":
        return 6;
      case "C":
        return 5;
      default:
        return 0;
    }
  };
  console.log(subjectData);

  return (
    <div>
      <label htmlFor="branch">Select Branch:</label>
      <select id="branch" value={selectedBranch} onChange={handleBranchChange}>
        <option value="">Select Branch</option>
        {SemesterData.map((branch) => (
          <option key={branch.Branch} value={branch.Branch}>
            {branch.Branch}
          </option>
        ))}
      </select>

      {selectedBranch && (
        <>
          <label htmlFor="semester">Select Semester:</label>
          <select
            id="semester"
            value={selectedSemester}
            onChange={handleSemesterChange}
          >
            <option value="">Select Semester</option>
            {SemesterData.find(
              (branch) => branch.Branch === selectedBranch
            ).Semster.map((semester) => (
              <option key={semester.name} value={semester.name}>
                {semester.name}
              </option>
            ))}
          </select>

          <div>
            <h2>Subject Data</h2>
            <div className="container">
              <table>
                <thead>
                  <tr>
                    <th>Subject Name</th>
                    <th>Subject Type</th>
                    <th>Internal Scored</th>
                    <th>Total Internal</th>
                    <th>External Scored</th>
                    <th>Total External</th>
                    <th>Marks Obtained</th>
                    <th>Grade</th>
                    <th>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectData.map((subject, index) => (
                    <tr key={index}>
                      <td>{subject.title}</td>
                      <td>{subject.type}</td>
                      <td>
                        <input
                          type="number"
                          value={marksObtained[index]?.internal || ""}
                          onChange={(e) =>
                            handleMarksChange(index, "internal", e.target.value)
                          }
                          min="0"
                          max="40"
                          maxLength="2"
                          required
                        />
                      </td>
                      <td>{subject.int_mark}</td>
                      <td>
                        <input
                          type="number"
                          value={marksObtained[index]?.external || ""}
                          onChange={(e) =>
                            handleMarksChange(index, "external", e.target.value)
                          }
                          min={0}
                          max={60}
                          maxLength={2}
                          required
                        />
                      </td>
                      <td>{subject.ext_mark}</td>
                      <td>{marksObtained[index]?.total || 0}</td>
                      <td>{marksObtained[index]?.grade || "-"}</td>
                      <td>{subject.credit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      <button type="button" onClick={calculateSGPA}>
        Calculate SGPA
      </button>

      <div>{sgpa}</div>
    </div>
  );
};

export default SGPACalculator;
