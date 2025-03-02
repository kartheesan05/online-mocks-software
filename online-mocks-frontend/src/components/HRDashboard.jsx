import { useState, useEffect } from "react";
import api from "../axios/axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/foresebluelogo.png";

function HRDashboard() {
  const [hr, setHR] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reviewData, setReviewData] = useState({
    professionalAppearanceAndAttitude: "",
    managerialAptitude: "",
    generalIntelligenceAndAwareness: "",
    technicalKnowledge: "",
    communicationSkills: "",
    achievementsAndAmbition: "",
    selfConfidence: "",
    overallScore: "",
    strengths: "",
    pointsToImproveOn: "",
    comments: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch HR details
        const hrName = localStorage.getItem("hrName");
        const hrCompany = localStorage.getItem("hrCompany");
        const hrId = localStorage.getItem("hrId");
        setHR({ name: hrName, company: hrCompany, id: hrId });

        // Fetch allocated students
        const studentsResponse = await api.get("/api/hr/getStudents");
        setStudents(studentsResponse.data);
        console.log(studentsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleReviewStudent = (student) => {
    setSelectedStudent(student);

    // Check if the HR has already reviewed this student
    const hrId = localStorage.getItem("hrId");
    const existingReview = student.personalReport?.find(
      (report) => {
        console.log("report", report);
        console.log("hrId", hrId);
        console.log("report.hrId", report.hrId);
        return report.hrId === hrId;
      }
    );

    if (existingReview) {
      // If there's an existing review, load it for editing
      setIsEditMode(true);
      setReviewData({
        professionalAppearanceAndAttitude:
          existingReview.professionalAppearanceAndAttitude || "",
        managerialAptitude: existingReview.managerialAptitude || "",
        generalIntelligenceAndAwareness:
          existingReview.generalIntelligenceAndAwareness || "",
        technicalKnowledge: existingReview.technicalKnowledge || "",
        communicationSkills: existingReview.communicationSkills || "",
        achievementsAndAmbition: existingReview.achievementsAndAmbition || "",
        selfConfidence: existingReview.selfConfidence || "",
        overallScore: existingReview.overallScore || "",
        strengths: existingReview.strengths || "",
        pointsToImproveOn: existingReview.pointsToImproveOn || "",
        comments: existingReview.comments || "",
      });
    } else {
      // If there's no existing review, reset the form
      setIsEditMode(false);
      setReviewData({
        professionalAppearanceAndAttitude: "",
        managerialAptitude: "",
        generalIntelligenceAndAwareness: "",
        technicalKnowledge: "",
        communicationSkills: "",
        achievementsAndAmbition: "",
        selfConfidence: "",
        overallScore: "",
        strengths: "",
        pointsToImproveOn: "",
        comments: "",
      });
    }

    setShowReviewModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData({
      ...reviewData,
      [name]:
        name.includes("Score") ||
        name === "professionalAppearanceAndAttitude" ||
        name === "managerialAptitude" ||
        name === "generalIntelligenceAndAwareness" ||
        name === "technicalKnowledge" ||
        name === "communicationSkills" ||
        name === "achievementsAndAmbition" ||
        name === "selfConfidence" ||
        name === "overallScore"
          ? Number(value)
          : value,
    });
  };

  const handleSubmitReview = async () => {
    try {
      setSubmitting(true);
      await api.post("/api/hr/personalReport", {
        registerNumber: selectedStudent.registerNumber,
        report: reviewData,
        isEdit: isEditMode,
      });
      setShowReviewModal(false);
      setSubmitting(false);
      // Refresh student data
      const studentsResponse = await api.get("/api/hr/getStudents");
      setStudents(studentsResponse.data);
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to submit review"
      );
      setShowErrorModal(true);
      setSubmitting(false);
    }
  };

  // Function to check if the HR has already reviewed a student
  const hasReviewedStudent = (student) => {
    const hrId = localStorage.getItem("hrId");
    return student.personalReport?.some((report) => report.hrId === hrId);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/hr-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header with Gradient */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto transform hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowLogout(!showLogout)}
              className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-full hover:shadow-md transition-all duration-200"
            >
              <span className="font-medium">
                {hr?.name || "Loading..."} - {hr?.company || ""}
              </span>
              <svg
                className="w-5 h-5 transition-transform duration-200 transform"
                style={{
                  transform: showLogout ? "rotate(180deg)" : "rotate(0deg)",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showLogout && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 transform transition-all duration-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="container mx-auto px-6 pt-28 pb-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Allocated Students
          </h2>

          {/* Enhanced Students Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Register Number
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aptitude Score (out of 50)
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    GD Score (out of 50)
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <tr
                      key={student._id}
                      className="hover:bg-gray-50 transition-colors duration-150 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {student.registerNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {student.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {student.aptitudeScore} / 50
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {student.gdScore} / 50
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <button
                          onClick={() => handleReviewStudent(student)}
                          className={`${
                            hasReviewedStudent(student)
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          } text-white px-4 py-1.5 rounded-lg transform hover:-translate-y-0.5 transition-all duration-200`}
                        >
                          {hasReviewedStudent(student)
                            ? "Edit Review"
                            : "Review"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No students allocated yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Review Student Modal */}
      {showReviewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[800px] max-h-[90vh] overflow-y-auto transform transition-all duration-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {isEditMode ? "Edit Review: " : "Review Student: "}
              {selectedStudent.name}
            </h3>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Register Number
                  </p>
                  <p className="text-base text-gray-800">
                    {selectedStudent.registerNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Department
                  </p>
                  <p className="text-base text-gray-800">
                    {selectedStudent.department}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Aptitude Score
                  </p>
                  <p className="text-base text-gray-800">
                    {selectedStudent.aptitudeScore} / 50
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">GD Score</p>
                  <p className="text-base text-gray-800">
                    {selectedStudent.gdScore} / 50
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">
                  Personal Interview Assessment
                </h4>

                {/* Rating Fields */}
                <div className="space-y-6">
                  {/* Professional Appearance */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Professional Appearance & Attitude
                      </label>
                    </div>
                    <select
                      name="professionalAppearanceAndAttitude"
                      value={reviewData.professionalAppearanceAndAttitude}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Rating --</option>
                      <option value={10}>10 - Outstanding</option>
                      <option value={9}>9 - Outstanding</option>
                      <option value={8}>8 - Above Average</option>
                      <option value={7}>7 - Above Average</option>
                      <option value={6}>6 - Above Average</option>
                      <option value={5}>5 - Average</option>
                      <option value={4}>4 - All Others</option>
                      <option value={3}>3 - All Others</option>
                      <option value={2}>2 - All Others</option>
                      <option value={1}>1 - All Others</option>
                    </select>
                  </div>

                  {/* Managerial Aptitude */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Managerial Aptitude
                      </label>
                    </div>
                    <select
                      name="managerialAptitude"
                      value={reviewData.managerialAptitude}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Rating --</option>
                      <option value={10}>10 - Outstanding</option>
                      <option value={9}>9 - Outstanding</option>
                      <option value={8}>8 - Above Average</option>
                      <option value={7}>7 - Above Average</option>
                      <option value={6}>6 - Above Average</option>
                      <option value={5}>5 - Average</option>
                      <option value={4}>4 - Below Average</option>
                      <option value={3}>3 - Below Average</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={1}>1 - Below Average</option>
                    </select>
                  </div>

                  {/* General Intelligence */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        General Intelligence & Awareness
                      </label>
                    </div>
                    <select
                      name="generalIntelligenceAndAwareness"
                      value={reviewData.generalIntelligenceAndAwareness}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Rating --</option>
                      <option value={10}>10 - Outstanding</option>
                      <option value={9}>9 - Outstanding</option>
                      <option value={8}>8 - Above Average</option>
                      <option value={7}>7 - Above Average</option>
                      <option value={6}>6 - Above Average</option>
                      <option value={5}>5 - Average</option>
                      <option value={4}>4 - Below Average</option>
                      <option value={3}>3 - Below Average</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={1}>1 - Below Average</option>
                    </select>
                  </div>

                  {/* Technical Knowledge */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Technical Knowledge
                      </label>
                    </div>
                    <select
                      name="technicalKnowledge"
                      value={reviewData.technicalKnowledge}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Rating --</option>
                      <option value={10}>10 - Outstanding</option>
                      <option value={9}>9 - Outstanding</option>
                      <option value={8}>8 - Above Average</option>
                      <option value={7}>7 - Above Average</option>
                      <option value={6}>6 - Above Average</option>
                      <option value={5}>5 - Average</option>
                      <option value={4}>4 - Below Average</option>
                      <option value={3}>3 - Below Average</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={1}>1 - Below Average</option>
                    </select>
                  </div>

                  {/* Communication Skills */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Communication Skills
                      </label>
                    </div>
                    <select
                      name="communicationSkills"
                      value={reviewData.communicationSkills}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Rating --</option>
                      <option value={10}>10 - Outstanding</option>
                      <option value={9}>9 - Outstanding</option>
                      <option value={8}>8 - Above Average</option>
                      <option value={7}>7 - Above Average</option>
                      <option value={6}>6 - Above Average</option>
                      <option value={5}>5 - Average</option>
                      <option value={4}>4 - Below Average</option>
                      <option value={3}>3 - Below Average</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={1}>1 - Below Average</option>
                    </select>
                  </div>

                  {/* Achievements & Ambition */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Achievements & Ambition
                      </label>
                    </div>
                    <select
                      name="achievementsAndAmbition"
                      value={reviewData.achievementsAndAmbition}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Rating --</option>
                      <option value={10}>10 - Outstanding</option>
                      <option value={9}>9 - Outstanding</option>
                      <option value={8}>8 - Above Average</option>
                      <option value={7}>7 - Above Average</option>
                      <option value={6}>6 - Above Average</option>
                      <option value={5}>5 - Average</option>
                      <option value={4}>4 - Below Average</option>
                      <option value={3}>3 - Below Average</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={1}>1 - Below Average</option>
                    </select>
                  </div>

                  {/* Self Confidence */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Self Confidence
                      </label>
                    </div>
                    <select
                      name="selfConfidence"
                      value={reviewData.selfConfidence}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Rating --</option>
                      <option value={10}>10 - Outstanding</option>
                      <option value={9}>9 - Outstanding</option>
                      <option value={8}>8 - Above Average</option>
                      <option value={7}>7 - Above Average</option>
                      <option value={6}>6 - Above Average</option>
                      <option value={5}>5 - Average</option>
                      <option value={4}>4 - Below Average</option>
                      <option value={3}>3 - Below Average</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={1}>1 - Below Average</option>
                    </select>
                  </div>

                  {/* Overall Score */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Overall Score
                      </label>
                    </div>
                    <select
                      name="overallScore"
                      value={reviewData.overallScore}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Rating --</option>
                      <option value={10}>10 - Outstanding</option>
                      <option value={9}>9 - Outstanding</option>
                      <option value={8}>8 - Above Average</option>
                      <option value={7}>7 - Above Average</option>
                      <option value={6}>6 - Above Average</option>
                      <option value={5}>5 - Average</option>
                      <option value={4}>4 - Below Average</option>
                      <option value={3}>3 - Below Average</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={1}>1 - Below Average</option>
                    </select>
                  </div>

                  {/* Text Fields */}
                  <div className="space-y-4 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Strengths
                      </label>
                      <textarea
                        name="strengths"
                        value={reviewData.strengths}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Student's strengths..."
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points to Improve On
                      </label>
                      <textarea
                        name="pointsToImproveOn"
                        value={reviewData.pointsToImproveOn}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Areas for improvement..."
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Comments
                      </label>
                      <textarea
                        name="comments"
                        value={reviewData.comments}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Any additional comments..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 flex items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-96 transform transition-all duration-200">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              Error
            </h3>
            <p className="text-gray-600 text-center mb-6">{errorMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HRDashboard;
