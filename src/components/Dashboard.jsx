import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/visitors");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setVisitorData(data);
      } catch (err) {
        setError("Unable to load visitor data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Visitor Submissions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : visitorData.length === 0 ? (
        <p>No visitors yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="visitor-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {visitorData.map((visitor, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{visitor.name}</td>
                  <td>{visitor.email}</td>
                  <td>{visitor.phone}</td>
                  <td>{new Date(visitor.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
