const AdminDashboard = () => {
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>System Overview</p>
            <div className="stat-grid">
                <div className="card">
                    <h3>Total Users</h3>
                    <p className="value">--</p>
                </div>
                <div className="card">
                    <h3>Total Doctors</h3>
                    <p className="value">--</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
