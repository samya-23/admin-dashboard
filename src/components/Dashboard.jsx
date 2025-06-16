import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";

const Dashboard = () => {
  const navigate = useNavigate();
  const [visitorData, setVisitorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionExpired, setSessionExpired] = useState(false);
  const rowsPerPage = 5;

  const dummyVisitors = [
    {
      name: "Riya Kapoor",
      email: "riya@example.com",
      phone: "9876543210",
      timestamp: new Date("2025-06-16T10:30:00").toISOString(),
    },
    {
      name: "Arjun Mehta",
      email: "arjun@example.com",
      phone: "9123456789",
      timestamp: new Date("2025-06-16T14:45:00").toISOString(),
    },
    {
      name: "Sneha Sharma",
      email: "sneha@example.com",
      phone: "9988776655",
      timestamp: new Date("2025-06-15T09:15:00").toISOString(),
    },
    {
      name: "Karan Patel",
      email: "karan@example.com",
      phone: "9012345678",
      timestamp: new Date("2025-06-15T11:00:00").toISOString(),
    },
    {
      name: "Divya Singh",
      email: "divya@example.com",
      phone: "8901234567",
      timestamp: new Date("2025-06-15T18:20:00").toISOString(),
    },
    {
      name: "Aditya Rao",
      email: "aditya@example.com",
      phone: "8790123456",
      timestamp: new Date("2025-06-14T13:10:00").toISOString(),
    },
  ];

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn !== "true") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const expiryTime = localStorage.getItem("sessionExpiry");

    if (loggedIn === "true" && expiryTime) {
      const interval = setInterval(() => {
        if (new Date().getTime() > Number(expiryTime)) {
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("sessionExpiry");
          setSessionExpired(true);

          // ⏳ Redirect to login after 30s
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 30000);

          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/visitors");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setVisitorData(data);
          setFilteredData(data);
          setError("");
        } else {
          throw new Error("Empty or invalid data from backend");
        }
      } catch (err) {
        console.warn("⚠️ Backend unreachable. Using dummy data.", err);
        setVisitorData(dummyVisitors);
        setFilteredData(dummyVisitors);
        setError("⚠️ Backend not connected. Showing dummy data.");
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("sessionExpiry");
    navigate("/login", { replace: true });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    const filtered = visitorData.filter(
      (v) =>
        v.name.toLowerCase().includes(value) ||
        v.email.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "visitor_data.csv");
    link.click();
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const chartData = filteredData.reduce((acc, curr) => {
    const date = new Date(curr.timestamp).toLocaleDateString();
    const existing = acc.find((item) => item.date === date);
    if (existing) existing.count += 1;
    else acc.push({ date, count: 1 });
    return acc;
  }, []);

  const handleModalClose = () => {
    setSessionExpired(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>📊 Visitor Submissions</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="table-wrapper">
        <div className="dashboard-tools">
          <div className="stats-box">👥 Total Visitors: {filteredData.length}</div>
          <input
            type="text"
            placeholder="Search by Name or Email"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button onClick={downloadCSV}>Export CSV</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {error && <p className="error">{error}</p>}
            {filteredData.length === 0 ? (
              <p>No matching visitors found.</p>
            ) : (
              <>
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
                    {paginatedData.map((visitor, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                        <td>{visitor.name}</td>
                        <td>{visitor.email}</td>
                        <td>{visitor.phone}</td>
                        <td>{new Date(visitor.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      className={currentPage === i + 1 ? "active" : ""}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#007BFF" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {sessionExpired && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Session Expired</h3>
            <p>Your session has expired. Please login again.</p>
            <button className="modal-btn" onClick={handleModalClose}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
