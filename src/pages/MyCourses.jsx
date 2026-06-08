// // import React, { useState, useEffect } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import {
// //   FaClock,
// //   FaRupeeSign,
// //   FaCalendarAlt,
// //   FaCheckCircle,
// //   FaSpinner,
// //   FaBookOpen,
// //   FaRedo,
// //   FaArrowRight,
// //   FaStar
// // } from "react-icons/fa";
// // import api from "../services/api";
// // import toast from "react-hot-toast";

// // const MyCourses = () => {
// //   const navigate = useNavigate();
// //   const [courses, setCourses] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [lastUpdated, setLastUpdated] = useState(null);
// //   const [stats, setStats] = useState({
// //     total: 0,
// //     totalSpent: 0,
// //   });

// //   const fetchMyCourses = async (silent = false) => {
// //     if (!silent) {
// //       setLoading(true);
// //     } else {
// //       setRefreshing(true);
// //     }

// //     try {
// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         toast.error("Please login to view your courses");
// //         navigate("/login");
// //         return;
// //       }

// //       const config = { headers: { Authorization: `Bearer ${token}` } };

// //       // First get user profile to get course IDs
// //       const profileResponse = await api.get("/user/profile", config);
// //       console.log("User profile response:", profileResponse.data);
      
// //       if (profileResponse.data.success && profileResponse.data.user) {
// //         const userCourseIds = profileResponse.data.user.course_ids || [];
// //         console.log("User course IDs from profile:", userCourseIds);
        
// //         if (userCourseIds.length === 0) {
// //           setCourses([]);
// //           setStats({ total: 0, totalSpent: 0 });
// //           setLastUpdated(new Date());
// //           if (!silent) {
// //             toast.info("You haven't enrolled in any courses yet");
// //           }
// //           setLoading(false);
// //           setRefreshing(false);
// //           return;
// //         }
        
// //         // Fetch details for each course
// //         const coursePromises = userCourseIds.map(async (courseId) => {
// //           try {
// //             const courseResponse = await api.get(`/courses/${courseId}`, config);
// //             return courseResponse.data;
// //           } catch (err) {
// //             console.error(`Failed to fetch course ${courseId}:`, err);
// //             return null;
// //           }
// //         });
        
// //         const courseResults = await Promise.all(coursePromises);
// //         const validCourses = courseResults.filter(course => course !== null);
        
// //         console.log("Fetched courses:", validCourses);
// //         setCourses(validCourses);
        
// //         // Calculate stats
// //         const totalSpent = validCourses.reduce((sum, course) => sum + (course.price || 0), 0);
        
// //         setStats({
// //           total: validCourses.length,
// //           totalSpent: totalSpent,
// //         });
        
// //         setLastUpdated(new Date());
        
// //         if (!silent && validCourses.length > 0) {
// //           toast.success(`Loaded ${validCourses.length} courses`);
// //         } else if (!silent && validCourses.length === 0) {
// //           toast.info("You haven't enrolled in any courses yet");
// //         }
// //       } else {
// //         setCourses([]);
// //         setStats({ total: 0, totalSpent: 0 });
// //       }
// //     } catch (error) {
// //       console.error("Failed to fetch my courses:", error);
// //       if (!silent) {
// //         if (error.response?.status === 401) {
// //           toast.error("Session expired. Please login again.");
// //           navigate("/login");
// //         } else {
// //           toast.error("Failed to load your courses");
// //         }
// //       }
// //       setCourses([]);
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   };

// //   const handleRefresh = () => {
// //     fetchMyCourses(false);
// //   };

// //   // Listen for payment approval events
// //   useEffect(() => {
// //     const handlePaymentApproved = (event) => {
// //       console.log("Payment approved, refreshing courses...", event.detail);
// //       // Wait a moment for backend to process
// //       setTimeout(() => {
// //         fetchMyCourses(false);
// //       }, 1000);
// //     };

// //     window.addEventListener("paymentApproved", handlePaymentApproved);
// //     return () => window.removeEventListener("paymentApproved", handlePaymentApproved);
// //   }, []);

// //   // Listen for course updates from admin panel
// //   useEffect(() => {
// //     const handleCoursesUpdated = () => {
// //       console.log("Courses updated event received");
// //       fetchMyCourses(true);
// //     };
    
// //     window.addEventListener("coursesUpdated", handleCoursesUpdated);
// //     return () => window.removeEventListener("coursesUpdated", handleCoursesUpdated);
// //   }, []);

// //   // Initial fetch
// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     const userType = localStorage.getItem("userType");

// //     if (!token || userType !== "student") {
// //       navigate("/login");
// //       return;
// //     }

// //     fetchMyCourses();

// //     // Auto-refresh every 30 seconds
// //     const interval = setInterval(() => {
// //       fetchMyCourses(true);
// //     }, 30000);

// //     return () => {
// //       clearInterval(interval);
// //     };
// //   }, [navigate]);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <FaSpinner className="animate-spin text-4xl text-primary-600" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-16">
// //       <div className="container mx-auto px-4">
// //         <div className="max-w-6xl mx-auto">
// //           {/* Header with Refresh Button */}
// //           <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
// //             <div>
// //               <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
// //               <p className="text-gray-600 mt-1">
// //                 View all your enrolled courses
// //               </p>
// //               {lastUpdated && (
// //                 <p className="text-xs text-gray-400 mt-1">
// //                   Last updated: {lastUpdated.toLocaleTimeString()}
// //                 </p>
// //               )}
// //             </div>
// //             <button
// //               onClick={handleRefresh}
// //               disabled={refreshing}
// //               className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
// //             >
// //               <FaRedo className={refreshing ? "animate-spin" : ""} />
// //               {refreshing ? "Refreshing..." : "Refresh Courses"}
// //             </button>
// //           </div>

// //           {/* Stats Cards */}
// //           {stats.total > 0 && (
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
// //               <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-gray-500 text-sm">Total Courses</p>
// //                     <p className="text-3xl font-bold text-gray-800">
// //                       {stats.total}
// //                     </p>
// //                   </div>
// //                   <FaBookOpen className="text-3xl text-primary-600" />
// //                 </div>
// //               </div>
// //               <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-gray-500 text-sm">Total Investment</p>
// //                     <p className="text-3xl font-bold text-primary-600">
// //                       ₹{stats.totalSpent.toLocaleString()}
// //                     </p>
// //                   </div>
// //                   <FaRupeeSign className="text-3xl text-primary-600" />
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Courses List */}
// //           {courses.length === 0 ? (
// //             <div className="bg-white rounded-xl shadow-md p-12 text-center">
// //               <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
// //               <h3 className="text-xl font-semibold text-gray-800 mb-2">
// //                 No Courses Enrolled Yet
// //               </h3>
// //               <p className="text-gray-600 mb-6">
// //                 You haven't enrolled in any courses yet. Browse our courses and start learning!
// //               </p>
// //               <Link to="/courses">
// //                 <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
// //                   Browse Courses →
// //                 </button>
// //               </Link>
// //             </div>
// //           ) : (
// //             <>
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                 {courses.map((course) => (
// //                   <div
// //                     key={course.id}
// //                     className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
// //                   >
// //                     <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 text-white">
// //                       <h3 className="text-xl font-bold">{course.name}</h3>
// //                       <p className="text-sm opacity-90">{course.duration || 'Self-paced'}</p>
// //                     </div>
// //                     <div className="p-4">
// //                       <p className="text-gray-600 text-sm mb-3 line-clamp-2">
// //                         {course.description ||
// //                           "Comprehensive course to master the subject with practical knowledge."}
// //                       </p>
// //                       <div className="flex items-center justify-between mt-3">
// //                         <div>
// //                           <span className="text-xs text-gray-500">Price</span>
// //                           <p className="text-lg font-bold text-primary-600">
// //                             ₹{course.price?.toLocaleString()}
// //                           </p>
// //                         </div>
// //                         <div className="flex items-center gap-2">
// //                           <div className="flex items-center gap-1">
// //                             <FaStar className="text-yellow-400 text-sm" />
// //                             <span className="text-sm text-gray-600">{course.rating || 4.5}</span>
// //                           </div>
// //                           <Link to={`/course/${course.id}`}>
// //                             <button className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
// //                               Continue <FaArrowRight size={12} />
// //                             </button>
// //                           </Link>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Course Value Summary */}
// //               {stats.total > 0 && (
// //                 <div className="mt-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6">
// //                   <h3 className="text-lg font-semibold text-gray-800 mb-2">
// //                     Course Investment Summary
// //                   </h3>
// //                   <p className="text-gray-600">
// //                     You have invested a total of{" "}
// //                     <strong className="text-primary-600">
// //                       ₹{stats.totalSpent.toLocaleString()}
// //                     </strong>{" "}
// //                     in your education. The skills you've gained have an estimated
// //                     value of{" "}
// //                     <strong className="text-green-600">
// //                       ₹{(stats.totalSpent * 3).toLocaleString()}+
// //                     </strong>{" "}
// //                     in the job market!
// //                   </p>
// //                 </div>
// //               )}
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MyCourses;


// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaClock,
//   FaRupeeSign,
//   FaCalendarAlt,
//   FaCheckCircle,
//   FaSpinner,
//   FaBookOpen,
//   FaRedo,
//   FaArrowRight,
//   FaStar
// } from "react-icons/fa";
// import api from "../services/api";
// import toast from "react-hot-toast";

// const MyCourses = () => {
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [stats, setStats] = useState({
//     total: 0,
//     totalSpent: 0,
//   });

//   const fetchMyCourses = async (silent = false) => {
//     if (!silent) {
//       setLoading(true);
//     } else {
//       setRefreshing(true);
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please login to view your courses");
//         navigate("/login");
//         return;
//       }

//       const config = { headers: { Authorization: `Bearer ${token}` } };

//       // ✅ Use the enrolled-courses endpoint instead of profile
//       let enrolledCourses = [];
      
//       try {
//         // First try the dedicated enrolled-courses endpoint
//         const enrolledResponse = await api.get("/user/enrolled-courses", config);
//         console.log("Enrolled courses response:", enrolledResponse.data);
        
//         if (enrolledResponse.data.success && enrolledResponse.data.courses) {
//           enrolledCourses = enrolledResponse.data.courses;
//           console.log("Enrolled courses from API:", enrolledCourses);
//         }
//       } catch (enrolledError) {
//         console.log("Enrolled courses endpoint failed, trying alternative...");
        
//         // Fallback: Get from profile
//         const profileResponse = await api.get("/user/profile", config);
//         console.log("User profile response:", profileResponse.data);
        
//         if (profileResponse.data.success && profileResponse.data.user) {
//           const userCourseIds = profileResponse.data.user.course_ids || [];
//           console.log("User course IDs from profile:", userCourseIds);
          
//           if (userCourseIds.length > 0) {
//             // Fetch details for each course
//             const coursePromises = userCourseIds.map(async (courseId) => {
//               try {
//                 const courseResponse = await api.get(`/courses/${courseId}`, config);
//                 return courseResponse.data;
//               } catch (err) {
//                 console.error(`Failed to fetch course ${courseId}:`, err);
//                 return null;
//               }
//             });
            
//             const courseResults = await Promise.all(coursePromises);
//             enrolledCourses = courseResults.filter(course => course !== null);
//           }
//         }
//       }
      
//       if (enrolledCourses.length === 0) {
//         setCourses([]);
//         setStats({ total: 0, totalSpent: 0 });
//         setLastUpdated(new Date());
//         if (!silent) {
//           toast.success("You haven't enrolled in any courses yet");
//         }
//         setLoading(false);
//         setRefreshing(false);
//         return;
//       }
      
//       console.log("Final courses:", enrolledCourses);
//       setCourses(enrolledCourses);
      
//       // Calculate stats
//       const totalSpent = enrolledCourses.reduce((sum, course) => sum + (course.price || 0), 0);
      
//       setStats({
//         total: enrolledCourses.length,
//         totalSpent: totalSpent,
//       });
      
//       setLastUpdated(new Date());
      
//       if (!silent && enrolledCourses.length > 0) {
//         toast.success(`Loaded ${enrolledCourses.length} courses`);
//       }
//     } catch (error) {
//       console.error("Failed to fetch my courses:", error);
//       if (!silent) {
//         if (error.response?.status === 401) {
//           toast.error("Session expired. Please login again.");
//           navigate("/login");
//         } else {
//           toast.error("Failed to load your courses");
//         }
//       }
//       setCourses([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     fetchMyCourses(false);
//   };

//   // Listen for payment approval events
//   useEffect(() => {
//     const handlePaymentApproved = (event) => {
//       console.log("Payment approved, refreshing courses...", event.detail);
//       setTimeout(() => {
//         fetchMyCourses(false);
//       }, 2000); // Increased delay to ensure backend processing
//     };

//     window.addEventListener("paymentApproved", handlePaymentApproved);
//     return () => window.removeEventListener("paymentApproved", handlePaymentApproved);
//   }, []);

//   // Listen for course updates from admin panel
//   useEffect(() => {
//     const handleCoursesUpdated = () => {
//       console.log("Courses updated event received");
//       fetchMyCourses(true);
//     };
    
//     window.addEventListener("coursesUpdated", handleCoursesUpdated);
//     return () => window.removeEventListener("coursesUpdated", handleCoursesUpdated);
//   }, []);

//   // Initial fetch
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userType = localStorage.getItem("userType");

//     if (!token || userType !== "student") {
//       navigate("/login");
//       return;
//     }

//     fetchMyCourses();

//     // Auto-refresh every 30 seconds
//     const interval = setInterval(() => {
//       fetchMyCourses(true);
//     }, 30000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <FaSpinner className="animate-spin text-4xl text-primary-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-16">
//       <div className="container mx-auto px-4">
//         <div className="max-w-6xl mx-auto">
//           {/* Header with Refresh Button */}
//           <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
//               <p className="text-gray-600 mt-1">
//                 View all your enrolled courses
//               </p>
//               {lastUpdated && (
//                 <p className="text-xs text-gray-400 mt-1">
//                   Last updated: {lastUpdated.toLocaleTimeString()}
//                 </p>
//               )}
//             </div>
//             <button
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
//             >
//               <FaRedo className={refreshing ? "animate-spin" : ""} />
//               {refreshing ? "Refreshing..." : "Refresh Courses"}
//             </button>
//           </div>

//           {/* Stats Cards */}
//           {stats.total > 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//               <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm">Total Courses</p>
//                     <p className="text-3xl font-bold text-gray-800">
//                       {stats.total}
//                     </p>
//                   </div>
//                   <FaBookOpen className="text-3xl text-primary-600" />
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm">Total Investment</p>
//                     <p className="text-3xl font-bold text-primary-600">
//                       ₹{stats.totalSpent.toLocaleString()}
//                     </p>
//                   </div>
//                   <FaRupeeSign className="text-3xl text-primary-600" />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Courses List */}
//           {courses.length === 0 ? (
//             <div className="bg-white rounded-xl shadow-md p-12 text-center">
//               <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                 No Courses Enrolled Yet
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 You haven't enrolled in any courses yet. Browse our courses and start learning!
//               </p>
//               <Link to="/courses">
//                 <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
//                   Browse Courses →
//                 </button>
//               </Link>
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {courses.map((course) => (
//                   <div
//                     key={course.id}
//                     className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
//                   >
//                     <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 text-white">
//                       <h3 className="text-xl font-bold">{course.name || course.title}</h3>
//                       <p className="text-sm opacity-90">{course.duration || 'Self-paced'}</p>
//                     </div>
//                     <div className="p-4">
//                       <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                         {course.description ||
//                           "Comprehensive course to master the subject with practical knowledge."}
//                       </p>
//                       <div className="flex items-center justify-between mt-3">
//                         <div>
//                           <span className="text-xs text-gray-500">Price</span>
//                           <p className="text-lg font-bold text-primary-600">
//                             ₹{course.price?.toLocaleString()}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div className="flex items-center gap-1">
//                             <FaStar className="text-yellow-400 text-sm" />
//                             <span className="text-sm text-gray-600">{course.rating || 4.5}</span>
//                           </div>
//                           <Link to={`/course/${course.id}`}>
//                             <button className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
//                               Continue <FaArrowRight size={12} />
//                             </button>
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Course Value Summary */}
//               {stats.total > 0 && (
//                 <div className="mt-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                     Course Investment Summary
//                   </h3>
//                   <p className="text-gray-600">
//                     You have invested a total of{" "}
//                     <strong className="text-primary-600">
//                       ₹{stats.totalSpent.toLocaleString()}
//                     </strong>{" "}
//                     in your education. The skills you've gained have an estimated
//                     value of{" "}
//                     <strong className="text-green-600">
//                       ₹{(stats.totalSpent * 3).toLocaleString()}+
//                     </strong>{" "}
//                     in the job market!
//                   </p>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyCourses;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaClock,
  FaRupeeSign,
  FaCalendarAlt,
  FaCheckCircle,
  FaSpinner,
  FaBookOpen,
  FaRedo,
  FaArrowRight,
  FaStar
} from "react-icons/fa";
import api from "../services/api";
import toast from "react-hot-toast";

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    totalSpent: 0,
  });

  const fetchMyCourses = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view your courses");
        navigate("/login");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      let enrolledCourses = [];
      
      // ✅ Try multiple endpoints to get enrolled courses
      const endpoints = [
        "/user/enrolled-courses",
        "/cart/my-courses", 
        "/my-courses",
        "/user/profile"
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint, config);
          console.log(`Response from ${endpoint}:`, response.data);
          
          if (response.data.success) {
            // Handle different response formats
            if (response.data.courses) {
              enrolledCourses = response.data.courses;
              break;
            } else if (response.data.user && response.data.user.course_ids) {
              // Fetch course details from course_ids
              const courseIds = response.data.user.course_ids;
              if (courseIds && courseIds.length > 0) {
                const coursePromises = courseIds.map(async (courseId) => {
                  try {
                    const courseRes = await api.get(`/courses/${courseId}`, config);
                    return courseRes.data;
                  } catch (err) {
                    return null;
                  }
                });
                const courseResults = await Promise.all(coursePromises);
                enrolledCourses = courseResults.filter(c => c !== null);
                break;
              }
            }
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.message);
        }
      }
      
      if (enrolledCourses.length === 0) {
        setCourses([]);
        setStats({ total: 0, totalSpent: 0 });
        setLastUpdated(new Date());
        if (!silent) {
          toast.success("You haven't enrolled in any courses yet");
        }
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      console.log("Final enrolled courses:", enrolledCourses);
      setCourses(enrolledCourses);
      
      // Calculate stats
      const totalSpent = enrolledCourses.reduce((sum, course) => sum + (course.price || 0), 0);
      
      setStats({
        total: enrolledCourses.length,
        totalSpent: totalSpent,
      });
      
      setLastUpdated(new Date());
      
      if (!silent && enrolledCourses.length > 0) {
        toast.success(`Loaded ${enrolledCourses.length} courses`);
      }
    } catch (error) {
      console.error("Failed to fetch my courses:", error);
      if (!silent) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        } else {
          toast.error("Failed to load your courses");
        }
      }
      setCourses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchMyCourses(false);
  };

  // Listen for payment approval events
  useEffect(() => {
    const handlePaymentApproved = (event) => {
      console.log("Payment approved, refreshing courses...", event.detail);
      // Immediate refresh and then again after 2 seconds
      fetchMyCourses(false);
      setTimeout(() => {
        fetchMyCourses(false);
      }, 3000);
    };

    window.addEventListener("paymentApproved", handlePaymentApproved);
    return () => window.removeEventListener("paymentApproved", handlePaymentApproved);
  }, []);

  // Listen for course updates from admin panel
  useEffect(() => {
    const handleCoursesUpdated = () => {
      console.log("Courses updated event received");
      fetchMyCourses(true);
    };
    
    window.addEventListener("coursesUpdated", handleCoursesUpdated);
    return () => window.removeEventListener("coursesUpdated", handleCoursesUpdated);
  }, []);

  // Initial fetch
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token || userType !== "student") {
      navigate("/login");
      return;
    }

    fetchMyCourses();

    // Auto-refresh every 15 seconds for real-time updates
    const interval = setInterval(() => {
      fetchMyCourses(true);
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with Refresh Button */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
              <p className="text-gray-600 mt-1">
                View all your enrolled courses
              </p>
              {lastUpdated && (
                <p className="text-xs text-gray-400 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <FaRedo className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh Courses"}
            </button>
          </div>

          {/* Stats Cards */}
          {stats.total > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Courses</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {stats.total}
                    </p>
                  </div>
                  <FaBookOpen className="text-3xl text-primary-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Investment</p>
                    <p className="text-3xl font-bold text-primary-600">
                      ₹{stats.totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <FaRupeeSign className="text-3xl text-primary-600" />
                </div>
              </div>
            </div>
          )}

          {/* Courses List */}
          {courses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Courses Enrolled Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't enrolled in any courses yet. Browse our courses and start learning!
              </p>
              <Link to="/courses">
                <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                  Browse Courses →
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 text-white">
                      <h3 className="text-xl font-bold">{course.name || course.title}</h3>
                      <p className="text-sm opacity-90">{course.duration || 'Self-paced'}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {course.description ||
                          "Comprehensive course to master the subject with practical knowledge."}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-xs text-gray-500">Price</span>
                          <p className="text-lg font-bold text-primary-600">
                            ₹{course.price?.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-sm" />
                            <span className="text-sm text-gray-600">{course.rating || 4.5}</span>
                          </div>
                          <Link to={`/course/${course.id}`}>
                            <button className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
                              Continue <FaArrowRight size={12} />
                            </button>
                          </Link>
                        </div>
                      </div>
                      {course.enrolled_at && (
                        <p className="text-xs text-gray-400 mt-2">
                          Enrolled: {new Date(course.enrolled_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Course Value Summary */}
              {stats.total > 0 && (
                <div className="mt-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Course Investment Summary
                  </h3>
                  <p className="text-gray-600">
                    You have invested a total of{" "}
                    <strong className="text-primary-600">
                      ₹{stats.totalSpent.toLocaleString()}
                    </strong>{" "}
                    in your education. The skills you've gained have an estimated
                    value of{" "}
                    <strong className="text-green-600">
                      ₹{(stats.totalSpent * 3).toLocaleString()}+
                    </strong>{" "}
                    in the job market!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;