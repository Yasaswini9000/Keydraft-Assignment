import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, Download, Upload } from 'lucide-react';

interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const initialBranchData: Branch[] = [
  { id: 1, name: 'Branch 1', address: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345' },
  { id: 2, name: 'Branch 2', address: '456 Elm St', city: 'Othertown', state: 'NY', zip: '67890' },
  // Add more initial data as needed
];

const BranchManagement = () => {
  const [branches, setBranches] = useState<Branch[]>(initialBranchData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [newBranch, setNewBranch] = useState<Branch>({ id: 0, name: '', address: '', city: '', state: '', zip: '' });
  const [editedBranch, setEditedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    const sortedBranches = branches.sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortColumn as keyof Branch].localeCompare(b[sortColumn as keyof Branch]);
      } else {
        return b[sortColumn as keyof Branch].localeCompare(a[sortColumn as keyof Branch]);
      }
    });
    setBranches(sortedBranches);
  }, [sortColumn, sortDirection]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleCreateBranch = () => {
    setBranches([...branches, newBranch]);
    setNewBranch({ id: 0, name: '', address: '', city: '', state: '', zip: '' });
  };

  const handleEditBranch = (branch: Branch) => {
    setEditedBranch(branch);
  };

  const handleUpdateBranch = () => {
    if (editedBranch) {
      const updatedBranches = branches.map((branch) => (branch.id === editedBranch.id ? editedBranch : branch));
      setBranches(updatedBranches);
      setEditedBranch(null);
    }
  };

  const handleDeleteBranch = (branch: Branch) => {
    const filteredBranches = branches.filter((b) => b.id !== branch.id);
    setBranches(filteredBranches);
  };

  const filteredBranches = branches.filter((branch) => {
    const query = searchQuery.toLowerCase();
    return (
      branch.name.toLowerCase().includes(query) ||
      branch.address.toLowerCase().includes(query) ||
      branch.city.toLowerCase().includes(query) ||
      branch.state.toLowerCase().includes(query) ||
      branch.zip.toLowerCase().includes(query)
    );
  });

  const paginatedBranches = filteredBranches.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className={`h-screen ${isFullScreen ? 'max-w-full' : 'max-w-6xl'} mx-auto p-4`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Branch Management</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCreateBranch}
        >
          <Plus className="mr-2" />
          Create Branch
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="search"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search branches"
          className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 pl-10 text-sm text-gray-700"
        />
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={handleFullScreenToggle}
        >
          {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ${
            viewMode === 'list' ? 'bg-blue-500 text-white' : ''
          }`}
          onClick={() => handleViewModeChange('list')}
        >
          List View
        </button>
        <button
          className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ${
            viewMode === 'grid' ? 'bg-blue-500 text-white' : ''
          }`}
          onClick={() => handleViewModeChange('grid')}
        >
          Grid View
        </button>
      </div>
      {viewMode === 'list' ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th
                className={`px-4 py-2 text-left ${sortColumn === 'name' ? (sortDirection === 'asc' ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white') : ''}`}
                onClick={() => handleSort('name')}
              >
                Name
              </th>
              <th
                className={`px-4 py-2 text-left ${sortColumn === 'address' ? (sortDirection === 'asc' ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white') : ''}`}
                onClick={() => handleSort('address')}
              >
                Address
              </th>
              <th
                className={`px-4 py-2 text-left ${sortColumn === 'city' ? (sortDirection === 'asc' ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white') : ''}`}
                onClick={() => handleSort('city')}
              >
                City
              </th>
              <th
                className={`px-4 py-2 text-left ${sortColumn === 'state' ? (sortDirection === 'asc' ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white') : ''}`}
                onClick={() => handleSort('state')}
              >
                State
              </th>
              <th
                className={`px-4 py-2 text-left ${sortColumn === 'zip' ? (sortDirection === 'asc' ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white') : ''}`}
                onClick={() => handleSort('zip')}
              >
                Zip
              </th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBranches.map((branch) => (
              <tr key={branch.id}>
                <td className="px-4 py-2 text-left">{branch.name}</td>
                <td className="px-4 py-2 text-left">{branch.address}</td>
                <td className="px-4 py-2 text-left">{branch.city}</td>
                <td className="px-4 py-2 text-left">{branch.state}</td>
                <td className="px-4 py-2 text-left">{branch.zip}</td>
                <td className="px-4 py-2 text-left">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    onClick={() => handleEditBranch(branch)}
                  >
                    <Edit className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDeleteBranch(branch)}
                  >
                    <Trash className="mr-2" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedBranches.map((branch) => (
            <div key={branch.id} className="bg-white rounded shadow-md p-4">
              <h2 className="text-lg font-bold">{branch.name}</h2>
              <p className="text-sm text-gray-700">{branch.address}</p>
              <p className="text-sm text-gray-700">{branch.city}, {branch.state} {branch.zip}</p>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => handleEditBranch(branch)}
              >
                <Edit className="mr-2" />
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDeleteBranch(branch)}
              >
                <Trash className="mr-2" />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {Math.ceil(filteredBranches.length / 10)}
        </span>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredBranches.length / 10)}
        >
          Next
        </button>
      </div>
      {editedBranch && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded shadow-md p-4">
            <h2 className="text-lg font-bold">Edit Branch</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Name</label>
                <input
                  type="text"
                  value={editedBranch.name}
                  onChange={(e) => setEditedBranch({ ...editedBranch, name: e.target.value })}
                  className="w-full p-2 pl-10 text-sm text-gray-700"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Address</label>
                <input
                  type="text"
                  value={editedBranch.address}
                  onChange={(e) => setEditedBranch({ ...editedBranch, address: e.target.value })}
                  className="w-full p-2 pl-10 text-sm text-gray-700"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">City</label>
                <input
                  type="text"
                  value={editedBranch.city}
                  onChange={(e) => setEditedBranch({ ...editedBranch, city: e.target.value })}
                  className="w-full p-2 pl-10 text-sm text-gray-700"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">State</label>
                <input
                  type="text"
                  value={editedBranch.state}
                  onChange={(e) => setEditedBranch({ ...editedBranch, state: e.target.value })}
                  className="w-full p-2 pl-10 text-sm text-gray-700"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Zip</label>
                <input
                  type="text"
                  value={editedBranch.zip}
                  onChange={(e) => setEditedBranch({ ...editedBranch, zip: e.target.value })}
                  className="w-full p-2 pl-10 text-sm text-gray-700"
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleUpdateBranch}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={() => console.log('Import clicked')}
        >
          <Upload className="mr-2" />
          Import
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={() => console.log('Export clicked')}
        >
          <Download className="mr-2" />
          Export
        </button>
      </div>
    </div>
  );
};

export default BranchManagement;
