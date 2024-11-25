import React, { useEffect, useRef, useState } from "react";
import "../styles/Home.css";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const Home = () => {
    const scholarshipsContainerRef = useRef(null);
    const overlayRef = useRef(null);
    const currentMonthMessage = useRef(null);
    const [showCurrentMonthMessage, setShowCurrentMonthMessage] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [scholarships, setScholarships] = useState([]);
    const [filteredScholarships, setFilteredScholarships] = useState([]);
    const [popupData, setPopupData] = useState(null); // For popup data

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCsVNh41ZgBVUMeoK01gaBkd0AxT57F9mo",
        authDomain: "balochscholarshipnetwork-99fd9.firebaseapp.com",
        projectId: "balochscholarshipnetwork-99fd9",
        storageBucket: "balochscholarshipnetwork-99fd9.appspot.com",
        messagingSenderId: "543212144164",
        appId: "1:543212144164:web:642a05a4b2f8ff03affab1",
        measurementId: "G-FQC5BR7H23",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Fetch scholarships from Firestore
    const loadScholarships = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "scholarships"));
            const loadedScholarships = querySnapshot.docs.map((doc) => doc.data());
            setScholarships(loadedScholarships);
        } catch (e) {
            console.error("Error retrieving scholarships: ", e.message);
        }
    };

    const getCurrentMonth = () => {
        const currentDate = new Date();
        return currentDate.getMonth() + 1; // Returns the current month (1-12)
    };

    // Filter scholarships based on search query or current month
    const filterScholarships = () => {
        const currentMonth = getCurrentMonth();
        if (searchQuery.trim() === "") {
            const filtered = scholarships.filter((scholarship) => {
                const [startDay, startMonth] = (scholarship.StartDate || "").split("/").map(Number);
                const [endDay, endMonth] = (scholarship.EndDate || "").split("/").map(Number);
                return startMonth <= currentMonth && endMonth >= currentMonth;
            });
            setShowCurrentMonthMessage(true);
            setFilteredScholarships(filtered);
        } else {
            const searchResult = searchQuery.trim().toLowerCase();
            setShowCurrentMonthMessage(false);
            setFilteredScholarships(
                scholarships.filter((scholarship) =>
                    (scholarship.Country || "").toLowerCase().includes(searchResult)
                )
            );
        }
    };

    // Show scholarship popup
    const showPopup = (scholarship) => {
        setPopupData(scholarship);
        overlayRef.current.style.display = "flex";
    };

    // Close popup
    const closePopup = () => {
        setPopupData(null);
        overlayRef.current.style.display = "none";
    };

    useEffect(() => {
        loadScholarships();
    }, []);

    // Filter scholarships when search query or scholarships data changes
    useEffect(() => {
        if (scholarships.length > 0) {
            filterScholarships();
        }
    }, [scholarships, searchQuery]);

    return (
        <div>
            <main>
                <div id="searchbox">
                    <input
                        type="text"
                        id="searchbar"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Country"
                    />
                </div>
                {showCurrentMonthMessage && (
                    <h2 ref={currentMonthMessage} className="OngoingScholarships">
                        Ongoing Scholarships
                    </h2>
                )}

                <div className="scholarship_cont" ref={scholarshipsContainerRef}>
                    {filteredScholarships.map((scholarship, index) => (
                        <div
                            key={index}
                            className="scholarship-card"
                            onClick={() => showPopup(scholarship)}
                        >
                            <div className="name">{scholarship.Name}</div>
                            <div className="country">
                                <strong>Country:</strong> {scholarship.Country}
                            </div>
                            <div className="class">
                                <strong>Class:</strong> {scholarship.Levels}
                            </div>
                            <div className="startDate">
                                <strong>Start Date:</strong> {scholarship.StartDate}
                            </div>
                            <div className="endDate">
                                <strong>End Date:</strong> {scholarship.EndDate}
                            </div>
                        </div>
                    ))}
                </div>

                {popupData && (
                    <div className="popup">
                        <div className="popup-content">
                            <button className="close-popup" onClick={closePopup}>
                                &times;
                            </button>
                            <h2>{popupData.Name}</h2>
                            <p>
                                <strong>Country:</strong> {popupData.Country}
                            </p>
                            <p>
                                <strong>Levels:</strong> {popupData.Levels}
                            </p>
                            <p>
                                <strong>Start Date:</strong> {popupData.StartDate}
                            </p>
                            <p>
                                <strong>End Date:</strong> {popupData.EndDate}
                            </p>
                            <p>
                                <strong>Fields:</strong> {popupData.Fields}
                            </p>
                            <p>
                                <strong>Description:</strong> {popupData.Description}
                            </p>
                            <a href={popupData.Link} target="_blank" rel="noopener noreferrer">
                                Apply Here
                            </a>
                        </div>
                    </div>
                )}
                <div className="MoneyEarningSect">
        <h3>
          Streamline your university application process with my expert assistance. Pay this fee, and I’ll take care of everything.
        </h3>
        <p>
          Ready to get started? Reach out to me at 0444444964.
        </p>
      </div>

                <div className="overlay" ref={overlayRef}></div>
            </main>
        </div>
    );
};

export default Home;
