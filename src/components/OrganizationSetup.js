import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrganizationSetup.css"; // Add appropriate styling

const OrganizationSetup = () => {
  const [orgData, setOrgData] = useState({
    name: "",
    website: "",
    description: "",
  });
  const [webpages, setWebpages] = useState([]); // Stores webpage scraping data
  const [selectedPage, setSelectedPage] = useState(null); // Selected page for viewing chunks
  const [trainingStatus, setTrainingStatus] = useState("pending"); // Status: pending, in progress, or complete

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrgData({ ...orgData, [name]: value });
  };

  // Fetch meta-description (bonus)
  const fetchMetaDescription = async () => {
    try {
      const response = await axios.post("http://localhost:5000/organization/meta", { website: orgData.website });
      setOrgData({ ...orgData, description: response.data.description });
    } catch (error) {
      console.error("Error fetching meta-description:", error);
      alert("Could not fetch meta-description. Please enter manually.");
    }
  };

  // Fetch dummy webpage data
  useEffect(() => {
    // Simulate fetching dummy data from backend
    const dummyData = [
      { id: 1, url: "https://example.com/page1", status: "scraped" },
      { id: 2, url: "https://example.com/page2", status: "pending" },
      { id: 3, url: "https://example.com/page3", status: "in progress" },
    ];
    setWebpages(dummyData);
  }, []);

  // Simulate fetching data chunks for a webpage
  const handleViewChunks = (id) => {
    const chunks = [
      { id: 1, content: "Sample chunk 1 for page " + id },
      { id: 2, content: "Sample chunk 2 for page " + id },
    ];
    setSelectedPage({ id, chunks });
  };

  // Proceed to next part
  const handleNext = () => {
    alert("Proceeding to the next part of setup...");
  };

  return (
    <div className="organization-setup">
      <h2>Setup Organization</h2>

      {/* Form Section */}
      <div className="form-container">
        <label>Company Name</label>
        <input
          type="text"
          name="name"
          value={orgData.name}
          onChange={handleChange}
          placeholder="Enter company name"
          required
        />

        <label>Website URL</label>
        <input
          type="url"
          name="website"
          value={orgData.website}
          onChange={handleChange}
          placeholder="Enter website URL"
          required
        />
        <button type="button" onClick={fetchMetaDescription}>
          Auto-Fetch Meta Description
        </button>

        <label>Company Description</label>
        <textarea
          name="description"
          value={orgData.description}
          onChange={handleChange}
          placeholder="Enter company description"
        ></textarea>
      </div>

      {/* Webpage Scraping Status */}
      <h3>Scraping Status</h3>
      <div className="webpage-list">
        {webpages.map((page) => (
          <div
            key={page.id}
            className={`webpage-item ${page.status}`}
            onClick={() => handleViewChunks(page.id)}
          >
            <p>{page.url}</p>
            <span>Status: {page.status}</span>
          </div>
        ))}
      </div>

      {/* Data Chunks for Selected Page */}
      {selectedPage && (
        <div className="data-chunks">
          <h4>Data Chunks for Page {selectedPage.id}</h4>
          <ul>
            {selectedPage.chunks.map((chunk) => (
              <li key={chunk.id}>{chunk.content}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Proceed Section */}
      <button
        type="button"
        onClick={handleNext}
        disabled={trainingStatus !== "complete"}
      >
        {trainingStatus === "complete" ? "Proceed" : "Training In Progress..."}
      </button>
    </div>
  );
};

export default OrganizationSetup;
