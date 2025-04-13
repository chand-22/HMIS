import React, { useState } from 'react';

const AddBills = () => {
  const [formData, setFormData] = useState({
    patient_id: '',
    generation_date: new Date().toISOString().split('T')[0],
    total_amount: '',
    payment_status: 'pending',
    services: []
  });

  const [currentService, setCurrentService] = useState({
    item_type: 'consultation',
    item_description: '',
    consult_id: '',
    report_id: '',
    prescription_id: '',
    room_id: '',
    price: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setCurrentService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addService = () => {
    if (!currentService.item_description || !currentService.price) {
      alert('Please enter service description and price');
      return;
    }

    // Calculate running total
    const servicePrice = parseFloat(currentService.price) || 0;
    const newTotal = (parseFloat(formData.total_amount) || 0) + servicePrice;

    setFormData(prev => ({
      ...prev,
      services: [...prev.services, currentService],
      total_amount: newTotal.toFixed(2)
    }));

    // Reset service form for next entry
    setCurrentService({
      item_type: 'consultation',
      item_description: '',
      consult_id: '',
      report_id: '',
      prescription_id: '',
      room_id: '',
      price: ''
    });
  };

  const removeService = (index) => {
    const removedPrice = parseFloat(formData.services[index].price) || 0;
    const newTotal = (parseFloat(formData.total_amount) || 0) - removedPrice;

    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
      total_amount: newTotal.toFixed(2)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    // Reset form or show success message
    alert('Bill added successfully!');
  };

  // Show relevant fields based on item type
  const renderDynamicFields = () => {
    switch(currentService.item_type) {
      case 'consultation':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Consultation ID:</label>
            <input
              type="text"
              name="consult_id"
              value={currentService.consult_id}
              onChange={handleServiceChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        );
      case 'medication':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Prescription ID:</label>
            <input
              type="text"
              name="prescription_id"
              value={currentService.prescription_id}
              onChange={handleServiceChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        );
      case 'test':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Report ID:</label>
            <input
              type="text"
              name="report_id"
              value={currentService.report_id}
              onChange={handleServiceChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        );
      case 'room_charge':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Room ID:</label>
            <input
              type="text"
              name="room_id"
              value={currentService.room_id}
              onChange={handleServiceChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white w-full h-full">
      <h2 className="text-xl font-semibold mb-6">Add Bills</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Patient ID:</label>
            <input
              type="text"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Generation Date:</label>
            <input
              type="date"
              name="generation_date"
              value={formData.generation_date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total Amount:</label>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Status:</label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Add Services</h3>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Item Type:</label>
                <select
                  name="item_type"
                  value={currentService.item_type}
                  onChange={handleServiceChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="consultation">Consultation</option>
                  <option value="medication">Medication</option>
                  <option value="procedure">Procedure</option>
                  <option value="room_charge">Room Charge</option>
                  <option value="test">Test</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price:</label>
                <input
                  type="number"
                  name="price"
                  value={currentService.price}
                  onChange={handleServiceChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  step="0.01"
                />
              </div>
            </div>

            {renderDynamicFields()}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Item Description:</label>
              <textarea
                name="item_description"
                value={currentService.item_description}
                onChange={handleServiceChange}
                className="w-full p-2 border border-gray-300 rounded h-24"
                placeholder="Enter service details here..."
              />
            </div>

            <div className="flex justify-end">
              <button 
                type="button"
                onClick={addService}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Service
              </button>
            </div>
          </div>

          {/* Display added services */}
          {formData.services.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium mb-2">Added Services:</h4>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.services.map((service, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{service.item_type}</td>
                        <td className="p-2">{service.item_description}</td>
                        <td className="p-2 text-right">${parseFloat(service.price).toFixed(2)}</td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center md:justify-start">
          <button 
            type="submit" 
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded transition duration-200"
          >
            Save Bill
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBills;
