import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HealthMateBot from './HealthMateBot';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [username, setUsername] = useState("");
  const [fullname, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profile, setProfile] = useState("");
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleImageChanges = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        setProfile(base64); // Set base64 string directly
        toast.success('Image updated!');
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Only JPEG files are allowed!");
      e.target.value = "";
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleEditProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated");
      return;
    }

    try {
      const response = await fetch("http://3.110.213.189:8080/api/user/profile", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch profile details');
        return;
      }

      const data = await response.json();
      setFullName(data.fullname);
      setPhone(data.phone);
      setUsername(data.username);
      setProfile(data.profileImage); // base64 string
      setShowEditProfile(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const saveEditProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not authenticated");
      return;
    }
  
    if (!password || !confirmPassword) {
      toast.error('Please enter and confirm your password.');
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('phone', phone);
      formData.append('password', password);
      if (profile) {
        // convert base64 to Blob before appending to FormData
        const byteString = atob(profile);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([intArray], { type: 'image/jpeg' });
        formData.append('profileImage', blob, 'profile.jpeg');
      }
  
      const response = await fetch("http://3.110.213.189:8080/api/user/profile-update", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // NOTE: Do NOT set 'Content-Type' manually when using FormData
        },
        body: formData,
      });
  
      if (response.ok) {
        toast.success("Profile updated successfully!");
        setShowEditProfile(false);
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error("An error occurred");
    }
  };
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must log in first!");
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
    } catch (e) {
      console.error("JWT decode failed:", e);
    }

    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://3.110.213.189:8080/api/Dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFullName(data.fullname);
          setPhone(data.phone);
          setUsername(data.username);
          setProfile(data.profileImage);
          setDashboardData(data);
        } else if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        console.warn("Error connecting to dashboard API. Ignoring...");
      }
    };

    fetchDashboard();
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-purple-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-10">DASHBOARDS</h1>
        <nav className="space-y-4">
          <a href="#" className="block hover:underline">Patient Outcomes</a>
          <a href="#" className="block hover:underline">Infection Control</a>
          <a href="#" className="block font-bold bg-purple-700 p-2 rounded">Hospital Operations</a>
          <a href="#" className="block hover:underline">Revenue Cycle Management</a>
          <a href="#" className="block hover:underline">Cost of Care</a>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-50">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Hospital Operations</h2>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-full"
            >
              <img
                src={profile ? `data:image/jpeg;base64,${profile}` : "/profile-pic-placeholder.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden md:block">Profile</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                <button onClick={handleEditProfile} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Edit Profile</button>
                <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Sign Out</button>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <KPI title="Average Length of Stay" value={dashboardData?.averageStay || "5.5 days"} />
          <KPI title="Bed Occupancy Rate" value={dashboardData?.occupancyRate || "85%"} />
          <KPI title="Avg Discharge Time" value={dashboardData?.dischargeTime || "2 hours"} />
          <KPI title="Surgery Cancellation Rate" value={dashboardData?.surgeryCancellationRate || "17%"} />
          <KPI title="Open Positions" value={dashboardData?.openPositions || "25"} />
          <KPI title="Number of Doctors" value={dashboardData?.numberOfDoctors || "125"} />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-4">Patient Turnover</h3>
          <div className="text-gray-400 text-center py-20">📈 Graph will be displayed here (Chart.js coming soon)</div>

          {showEditProfile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-8 relative">
                <button onClick={() => setShowEditProfile(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg">✕</button>
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

                <div className="flex items-center mb-6">
                  <img src={profile ? `data:image/jpeg;base64,${profile}` : "/profile-pic-placeholder.png"} alt="Profile" className="w-16 h-16 rounded-full mr-4" />
                  <span className="text-lg font-semibold">User Profile</span>
                  <button type="button" onClick={() => fileInputRef.current.click()} className="ml-auto bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Upload New Picture</button>
                </div>

                <form className="space-y-4" onSubmit={saveEditProfile}>
                  <div className="flex gap-4">
                    <input type="text" value={fullname} onChange={(e) => setFullName(e.target.value)} className="w-1/2 border p-2 rounded" />
                    <input type="text" value={username} disabled className="w-1/2 border p-2 bg-gray-100 rounded" />
                  </div>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded" />

                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="Enter New Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded" />
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-sm text-blue-600 cursor-pointer">{showPassword ? "Hide" : "Show"}</span>
                  </div>

                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border p-2 rounded" />
                    <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2 text-sm text-blue-600 cursor-pointer">{showConfirmPassword ? "Hide" : "Show"}</span>
                  </div>

                  <input type="file" accept=".jpeg" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChanges} />

                  <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => setShowEditProfile(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Save changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <HealthMateBot />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnHover theme="colored" />
    </div>
  );
}

const KPI = ({ title, value }) => (
  <div className="bg-white p-6 rounded shadow">
    <p className="text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Dashboard;
