import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/foresebluelogo.png';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('volunteers');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [hrs, setHRs] = useState([]);
  const [newEntry, setNewEntry] = useState({
    name: '',
    username: '',
    password: '',
    company: '' // for HR only
  });
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [selectedHR, setSelectedHR] = useState('');
  const [showAllocationModal, setShowAllocationModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [volunteersRes, hrsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/volunteers'),
        axios.get('http://localhost:5000/api/admin/hrs')
      ]);
      setVolunteers(volunteersRes.data);
      console.log('HRs data:', hrsRes.data);
      setHRs(hrsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddEntry = async () => {
    try {
      const endpoint = activeTab === 'volunteers' 
        ? 'http://localhost:5000/api/admin/add-volunteer'
        : 'http://localhost:5000/api/admin/add-hr';
      
      await axios.post(endpoint, newEntry);
      setShowAddModal(false);
      setNewEntry({ name: '', username: '', password: '', company: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding entry:', error);
      alert(error.response?.data?.message || 'Error adding entry');
    }
  };

  const handleAllocate = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/allocate', {
        volunteerId: selectedVolunteer,
        hrId: selectedHR
      });
      setShowAllocationModal(false);
      fetchData();
    } catch (error) {
      console.error('Error allocating:', error);
      alert(error.response?.data?.message || 'Error allocating');
    }
  };

  const handleDelete = async (id, name) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${activeTab === 'volunteers' ? 'volunteer' : 'HR'} "${name}"? This action cannot be undone.`
    );

    if (isConfirmed) {
      try {
        const endpoint = activeTab === 'volunteers' 
          ? `http://localhost:5000/api/admin/delete-volunteer/${id}`
          : `http://localhost:5000/api/admin/delete-hr/${id}`;
        
        await axios.delete(endpoint);
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
        alert(error.response?.data?.message || 'Error deleting entry');
      }
    }
  };

  const handleDeallocate = async (hrId, volunteerId, volunteerName, hrName) => {
    if (!volunteerId) {
      console.error('No volunteer ID provided');
      alert('Error: Volunteer ID is missing');
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to deallocate volunteer "${volunteerName}" from HR "${hrName}"?`
    );

    if (isConfirmed) {
      try {
        console.log('Sending deallocate request:', { hrId, volunteerId }); // Debug log
        const response = await axios.post('http://localhost:5000/api/admin/deallocate', {
          hrId,
          volunteerId
        });
        
        console.log('Deallocate response:', response.data); // Debug log
        fetchData(); // Refresh the data
      } catch (error) {
        console.error('Error deallocating:', error);
        alert(error.response?.data?.message || 'Error deallocating volunteer');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <img src={logo} alt="Logo" className="h-12" />
          <div className="relative">
            <button
              onClick={() => setShowLogout(!showLogout)}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              <span>Admin</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showLogout && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Tab Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`px-6 py-3 rounded-xl transition-all duration-200 ${
              activeTab === 'volunteers'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Volunteers
          </button>
          <button
            onClick={() => setActiveTab('hrs')}
            className={`px-6 py-3 rounded-xl transition-all duration-200 ${
              activeTab === 'hrs'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            HRs
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Add {activeTab === 'volunteers' ? 'Volunteer' : 'HR'}
          </button>
          <button
            onClick={() => setShowAllocationModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Allocate Volunteer to HR
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-500 to-purple-600">
              <tr>
                {activeTab === 'volunteers' ? (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Username</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Company</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Allocated Volunteers</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTab === 'volunteers' ? (
                volunteers.map((volunteer) => (
                  <tr key={volunteer._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{volunteer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{volunteer.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(volunteer._id, volunteer.name)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors duration-150"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                hrs.map((hr) => (
                  <tr key={hr._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hr.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hr.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {hr.allocatedVolunteers && hr.allocatedVolunteers.length > 0 ? (
                        <div className="space-y-2">
                          {hr.allocatedVolunteers.map((volunteer) => (
                            <div key={volunteer._id} 
                                 className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                              <span>{volunteer.name} ({volunteer.username})</span>
                              <button
                                onClick={() => {
                                  console.log('Volunteer data:', volunteer); // Debug log
                                  handleDeallocate(
                                    hr._id,
                                    volunteer._id || volunteer, // If volunteer is just an ID, use it directly
                                    volunteer.name,
                                    hr.name
                                  );
                                }}
                                className="text-orange-600 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded-md text-xs transition-colors duration-150"
                              >
                                Deallocate
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No volunteers allocated</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(hr._id, hr.name)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors duration-150"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-96 transform transition-all duration-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Add {activeTab === 'volunteers' ? 'Volunteer' : 'HR'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newEntry.name}
                  onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Enter ${activeTab === 'volunteers' ? 'volunteer' : 'HR'} name`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={newEntry.username}
                  onChange={(e) => setNewEntry({ ...newEntry, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Enter ${activeTab === 'volunteers' ? 'volunteer' : 'HR'} username`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newEntry.password}
                  onChange={(e) => setNewEntry({ ...newEntry, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter password"
                />
              </div>
              {activeTab === 'hrs' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={newEntry.company}
                    onChange={(e) => setNewEntry({ ...newEntry, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter company name"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewEntry({ name: '', username: '', password: '', company: '' });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEntry}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add {activeTab === 'volunteers' ? 'Volunteer' : 'HR'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Allocation Modal */}
      {showAllocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-96">
            <h3 className="text-xl font-semibold mb-6">Allocate Volunteer to HR</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Volunteer</label>
                <select
                  value={selectedVolunteer}
                  onChange={(e) => setSelectedVolunteer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose a volunteer</option>
                  {volunteers.map((volunteer) => (
                    <option key={volunteer._id} value={volunteer._id}>
                      {volunteer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select HR</label>
                <select
                  value={selectedHR}
                  onChange={(e) => setSelectedHR(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose an HR</option>
                  {hrs.map((hr) => (
                    <option key={hr._id} value={hr._id}>
                      {hr.name} - {hr.company}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAllocationModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAllocate}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Allocate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
