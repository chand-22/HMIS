import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

const PatientInfo = () => {
  // getting the role for which the patient info shown
  const location = useLocation();
  const role = location.pathname.split('/')[1];

  // console.log(role);

  // for saving the context of the fetched data
  const [inputValue, setInputValue] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientDetails, setPatientDetails] = useState(null);
  const [tests, setTests] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrescribedTests = async (patientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockDB = {
          "123": {
            patient: {
              name: "Alice",
              patient_info: {
                age: 28,
                bloodgroup: "A+"
              },
              phone_number: "9876543210"
            },
            tests: [
              { title: "MRI", status: "Pending" },
              { title: "Blood Test", status: "Done" }
            ]
          },
          "456": {
            patient: {
              name: "Bob",
              patient_info: {
                age: 40,
                bloodgroup: "O-"
              },
              phone_number: "9123456780"
            },
            tests: [
              { title: "X-Ray", status: "Done" }
            ]
          }
        };

        resolve(mockDB[patientId] || { patient: null, tests: [] });
      }, 500);
    });
  };

  const fetchPrescribedMedicines = async (patientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockMedicineDB = {
          "123": {
            patient: {
              name: "Alice",
              patient_info: {
                age: 28,
                bloodgroup: "A+"
              },
              phone_number: "9876543210"
            },
            prescribed_medicines: [
                {
                  medicine_name: "Paracetamol",
                  dosage_form: "Tablet",
                  manufacturer: "ABC Pharma",
                  dosage: "500mg",
                  frequency: "Twice a day",
                  duration: "5 days",
                  quantity: 10,
                  dispensed_qty: 10,
                  prescription_status: "dispensed"
                },
                {
                  medicine_name: "Cough Syrup",
                  dosage_form: "Syrup",
                  manufacturer: "XYZ Meds",
                  dosage: "10ml",
                  frequency: "Thrice a day",
                  duration: "3 days",
                  quantity: 1,
                  dispensed_qty: 0,
                  prescription_status: "pending"
                }
              ]
            },
            "456": {
              patient: {
                name: "Bob",
                patient_info: {
                  age: 40,
                  bloodgroup: "O-"
                },
                phone_number: "9123456780"
              },
              prescribed_medicines: [
                {
                  medicine_name: "Amoxicillin",
                  dosage_form: "Capsule",
                  manufacturer: "MediCure",
                  dosage: "250mg",
                  frequency: "Once a day",
                  duration: "7 days",
                  quantity: 7,
                  dispensed_qty: 3,
                  prescription_status: "partially_dispensed"
                }
              ]
            }
          };

          resolve(mockMedicineDB[patientId] || { patient: null, prescribed_medicines: [] });
        }, 500);
      });
  };

  useEffect(() => {
    const getPatientData = async () => {
      if (!patientId) return;

      setLoading(true);
      try {
        if (role === 'pathologist') {
          const data = await fetchPrescribedTests(patientId);
          setPatientDetails(data.patient);
          setTests(data.tests || []);
        } else if (role === 'pharmacist') {
          const data = await fetchPrescribedMedicines(patientId);
          setPatientDetails(data.patient);
          setMedicines(data.prescribed_medicines || []);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    getPatientData();
  }, [patientId, role]);


  return (
    <div className='p-5 pt-10 flex flex-col justify-center items-center space-y-6'>
      <div className='flex items-center'>
        <p className='mr-2 font-bold'>Enter the Patient Id:</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          className='border-2 border-black p-2 rounded w-80 mr-2'
        />
        <button
          onClick={() => {
            const trimmedId = inputValue.trim();
            if (trimmedId) {
              setPatientId(inputValue);
              // console.log(inputValue);
              // setInputValue('');
            }
          }}
          // disabled={loading}
          className={`ml-2 px-4 py-2 bg-[#4C7E75] text-white font-bold rounded ${
              loading ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer'
            }`}
        >
          ENTER</button>
      </div>
      {/* to show loading state while data being fetched */}
      {loading && <p className="text-blue-600 font-semibold">Loading patient data...</p>}
      <div className='border-t border-gray-300 w-full pt-4'>
        <p className='font-bold pb-3'>Patient Details</p>
        {patientDetails ?
          (
            <div className="space-y-2 text-black">
              <p><span className="font-medium text-black">Name:</span> {patientDetails.name}</p>
              <p><span className="font-medium text-black">Age:</span> {patientDetails.patient_info.age}</p>
              <p><span className="font-medium text-black">Blood Group:</span> {patientDetails.patient_info.bloodgroup}</p>
              <p><span className="font-medium text-black">Phone Number:</span> {patientDetails.phone_number}</p>
            </div>
          ) : (
            <p className="">No patient selected.</p>
          )}
      </div>
      {role === 'pathologist' && (
        <div className='border-t border-gray-300 w-full pt-4'>
          <p className='font-bold pb-3'>Prescribed Tests</p>
          {tests.length > 0 ?
            (
              <div>
                <table className='table-auto w-full border border-gray-700'>
                  <thead>
                    <tr className='bg-gray-100'>
                      <th className='px-4 py-2 border border-gray-700 text-center'>Test Name</th>
                      <th className='px-4 py-2 border border-gray-700 text-center'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    { tests.map((test, index) => (
                      <tr key={index}>
                        <td className='px-4 py-2 border border-gray-700 text-center'> { test.title } </td>
                        <td className={`px-4 py-2 border border-gray-700 text-center font-semibold ${
                          test.status === 'Pending' ? 'text-red-500' : 'text-black'
                        }`}
                        > {test.status}
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="">No test there.</p>
            )}
        </div>
      )}
      {role === 'pharmacist' && (
        <div className='border-t border-gray-300 w-full pt-4'>
          <p className='font-bold pb-3'>Prescribed Medicines</p>
          {medicines.length > 0 ? (
            <div>
              <table className='table-auto w-full border border-gray-700'>
                <thead>
                  <tr className='bg-gray-100'>
                    <th className='px-4 py-2 border border-gray-700 text-center'>Medicine Name</th>
                    <th className='px-4 py-2 border border-gray-700 text-center'>Dosage</th>
                    <th className='px-4 py-2 border border-gray-700 text-center'>Frequency</th>
                    <th className='px-4 py-2 border border-gray-700 text-center'>Quantity</th>
                    <th className='px-4 py-2 border border-gray-700 text-center'>Dispensed</th>
                    <th className='px-4 py-2 border border-gray-700 text-center'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((med, index) => (
                    <tr key={index}>
                      <td className='px-4 py-2 border border-gray-700 text-center'>{med.medicine_name}</td>
                      <td className='px-4 py-2 border border-gray-700 text-center'>{med.dosage}</td>
                      <td className='px-4 py-2 border border-gray-700 text-center'>{med.frequency}</td>
                      <td className='px-4 py-2 border border-gray-700 text-center'>{med.quantity}</td>
                      <td className='px-4 py-2 border border-gray-700 text-center'>{med.dispensed_qty}</td>
                      <td className={`px-4 py-2 border border-gray-700 text-center font-semibold ${
                        med.prescription_status === 'dispensed' ? 'text-green-600' :
                        med.prescription_status === 'partially_dispensed' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {med.prescription_status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No medicine data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientInfo;
