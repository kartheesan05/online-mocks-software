import axios from 'axios';

function AddStudentModal({ onClose, onAdd, registerNumber, setRegisterNumber, selectedHR }) {
  const handleSubmit = async () => {
    if (!selectedHR) {
      alert('Please select an HR first');
      return;
    }
    if (!registerNumber) {
      alert('Please enter a register number');
      return;
    }
    onAdd();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-medium mb-4">Add Student</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Register Number
          </label>
          <input
            type="text"
            value={registerNumber}
            onChange={(e) => setRegisterNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter register number"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddStudentModal;
