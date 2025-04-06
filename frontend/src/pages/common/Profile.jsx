import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";

const ProfileDashboard = () => {
  const { role } = useParams();
  const [userData, setUserData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockData = {
          name: "John Doe",
          email: "john@example.com",
          employee_id: "220101008",
          phone: "123-456-7890",
          department: "xyz",
          specialization: "cardiology",
          profile_pic: "",
        };

        setUserData(mockData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchUserData();
  }, [role]);

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setPreviewImage(previewURL);

    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const fakeUploadURL = previewURL;

      setUserData((prevData) => ({ ...prevData, profile_pic: fakeUploadURL }));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg">
          <h1 className="text-xl font-semibold">{role.charAt(0).toUpperCase() + role.slice(1)}'s Profile</h1>
        </div>

        {/* Profile section */}
        <div className="mt-10 flex flex-col md:flex-row items-start gap-10">
          {/* Profile Photo */}
          <div className="relative w-48 h-64 border border-gray-500 flex items-center justify-center bg-white shadow-md overflow-hidden rounded-lg">
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
            ) : userData?.profile_pic ? (
              <img src={userData.profile_pic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-semibold">Profile Photo</span>
            )}
            <button
              onClick={handleEditClick}
              className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700"
            >
              <Pencil size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </div>

          {/* Profile Fields */}
          <div className="flex-1 w-full space-y-4">
          {userData &&
            Object.entries(userData).map(([key, value]) =>
              key !== "profile_pic" ? (
      <div key={key} className="flex items-center gap-4">
        {/* Label */}
        <div className="bg-gray-300 w-1/4 p-3 rounded text-right font-semibold capitalize text-gray-700 flex items-center justify-end h-14">
          {key.replace("_", " ")}:
        </div>

        {/* Value */}
        <div className="bg-gray-300 flex-1 p-3 rounded text-lg text-gray-800 flex items-center h-14">
          {Array.isArray(value) ? value.join(", ") : value}
        </div>
      </div>
    ) : null
  )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;


// fetching from the database

// const ProfileDashboard = () => {
//   const { role } = useParams();
//   const [userData, setUserData] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/${role}/profile`);
//         const data = await response.json();
//         setUserData(data);
//       } catch (error) {
//         console.error("Error fetching profile data:", error);
//       }
//     };

//     fetchUserData();
//   }, [role]);

//   // Handle Profile Picture Change
//   const handleProfilePicChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Show preview before uploading
//     const previewURL = URL.createObjectURL(file);
//     setPreviewImage(previewURL);

//     const formData = new FormData();
//     formData.append("profile_pic", file);

//     try {
//       const response = await fetch(`http://localhost:5000/api/${role}/upload-profile-pic`, {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();
//       if (response.ok) {
//         setUserData((prevData) => ({ ...prevData, profile_pic: result.profile_pic }));
//       } else {
//         console.error("Failed to update profile picture:", result.error);
//       }
//     } catch (error) {
//       console.error("Error uploading profile picture:", error);
//     }
//   };

//   // Trigger file input when edit icon is clicked
//   const handleEditClick = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <div className="flex-1 p-6 md:p-10">
//         <div className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg">
//           <h1 className="text-xl">{role.charAt(0).toUpperCase() + role.slice(1)}'s Profile</h1>
//         </div>
//         <div className="mt-10 flex flex-col md:flex-row items-start">
//           <div className="relative w-40 h-52 border border-gray-500 flex items-center justify-center bg-white shadow-md overflow-hidden">
//             {/* Show preview if available, otherwise show existing profile pic */}
//             {previewImage ? (
//               <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
//             ) : userData?.profile_pic ? (
//               <img src={userData.profile_pic} alt="Profile" className="w-full h-full object-cover" />
//             ) : (
//               <span className="text-lg font-semibold">Profile Photo</span>
//             )}
//             {/* Edit Icon */}
//             <button
//               onClick={handleEditClick}
//               className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded shadow-md hover:bg-gray-700"
//             >
//               <Pencil size={18} />
//             </button>
//             {/* Hidden File Input */}
//             <input
//               type="file"
//               ref={fileInputRef}
//               accept="image/*"
//               className="hidden"
//               onChange={handleProfilePicChange}
//             />
//           </div>
//           <div className="ml-0 md:ml-10 mt-5 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
//             {userData &&
//               Object.entries(userData).map(([key, value]) =>
//                 key !== "profile_pic" ? (
//                   <div key={key} className="bg-gray-300 p-2 rounded capitalize">
//                     {key.replace("_", " ")}: {Array.isArray(value) ? value.join(", ") : value}
//                   </div>
//                 ) : null
//               )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileDashboard;

