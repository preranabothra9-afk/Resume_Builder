// import React, { useState } from "react";

// const ATSAnalyzer = ({ analyzeATS, result }) => {
//   const [jobDescription, setJobDescription] = useState("");

//   return (
//     <div className="bg-white p-6 rounded-lg shadow mt-6">

//       <h2 className="text-lg font-semibold mb-4">
//         ATS Score Checker
//       </h2>

//       <textarea
//         className="w-full border p-2 rounded"
//         placeholder="Paste job description here..."
//         value={jobDescription}
//         onChange={(e)=>setJobDescription(e.target.value)}
//       />

//       <button
//         onClick={() => analyzeATS(jobDescription)}
//         className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
//       >
//         Analyze Resume
//       </button>

//       {result && (
//         <div className="mt-4">

//           <p className="font-bold">
//             ATS Score: {result.score}%
//           </p>

//           <p className="mt-2">Missing Keywords:</p>

//           <ul>
//             {result.missing.map((word,i)=>(
//               <li key={i}>• {word}</li>
//             ))}
//           </ul>

//         </div>
//       )}

//     </div>
//   );
// };

// export default ATSAnalyzer;