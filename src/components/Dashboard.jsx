import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  // Sample dummy data
  const visitorData = [
    { id: 1, name: "Samya Soni", email: "samya@example.com", phone: "9876543210" },
    { id: 2, name: "Aman Gupta", email: "aman@example.com", phone: "9123456789" },
  ];

  return (
    <div className="dashboard-container">
      <h2>Visitor Submissions</h2>
      <div className="table-wrapper">
        <table className="visitor-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {visitorData.map((visitor, index) => (
              <tr key={visitor.id}>
                <td>{index + 1}</td>
                <td>{visitor.name}</td>
                <td>{visitor.email}</td>
                <td>{visitor.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
