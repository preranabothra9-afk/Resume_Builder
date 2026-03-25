//controller for creating a new resume
//POST: /api/resumes/create

import Resume from "../models/Resume.models.js";
import { ApiError } from "../utils/api_errors.js";
import imageKit from "../configs/imageKit.js";
import fs from 'fs';
import { Document, Packer, Paragraph, TextRun } from "docx";
import html_to_pdf from "html-pdf-node";
import axios from "axios";
import FormData from "form-data";

export const getAllResumes = async (req, res) => {
    try {
        const userId = req.userId;

        const resumes = await Resume.find({ userId });

        return res
            .status(200)
            .json(resumes);

    } catch (error) {
        return res
            .status(500)
            .json({ message: error.message });
    }
}


export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {title} = req.body;

        //create new resume-
        const newResume = await Resume.create({userId, title});
        //return success message

        return res
            .status(201)
            .json({message: "Resume created successfully!", resume:newResume})
    } catch (error) {
        return res
            .status(201)
            .json({message: error.message})
    }
}

//controller for deleting a resume
//POST: /api/resumes/delete

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        await Resume.findOneAndDelete({userId, _id:resumeId})

        return res
            .status(200)
            .json({message: 'Resume deleted successfully!'})
    } catch (error) {
        return res
            .status(401)
            .json({message: error.message})
    }
}

//get resume of a user by id
//GET: /api/resumes/get

export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;


        const resume = await Resume.findOne({userId, _id:resumeId})

        if(!resume){
            throw new ApiError(404, "Resume Not Found!")
        }

        resume.__v=undefined;
        resume.createdAt=undefined;
        resume.updatedAt=undefined;

        return res
            .status(200)
            .json({resume})
    } catch (error) {
        return res
        .status(401)
        .json({message: error.message})
    }
}

//get resume by id if its public
//GET: /api/resumes/public

export const getPublicResumeById = async (req,res) => {
    try {
        const {resumeId} = req.params;
        const resume = await Resume.findOne({public:true, _id:resumeId});

        if(!resume){
            throw new ApiError(404, "Resume Not Found!");
        }

        return res
            .status(200)
            .json({resume})

    } catch (error) {
        return res
            .status(401)
            .json({message: error.message})
    }
}

// controller for updating a resume
//PUT: /api/resumes/update

// export const updateResume = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { resumeId, resumeData, removeBackground } = req.body;
//     const image = req.file;

//     const shouldRemoveBg = removeBackground === "yes";

//     let resumeDataCopy =
//       typeof resumeData === "string" ? JSON.parse(resumeData) : structuredClone(resumeData);
//       let existingResume = await Resume.findById(resumeId);

//     if (image) {
//       const imageBufferData = fs.createReadStream(image.path);

//     const response = await imageKit.files.upload({
//       file: imageBufferData,
//       fileName: "resume.png",
//       folder: "user-resumes",
//       transformation: {
//         pre: "w-300,h-300,fo-face,z-0.75"
//       }
//     });

//       resumeDataCopy.personal_info.image = shouldRemoveBg ? response.url + "?tr=e-bgremove" : response.url;
//     }

//     else if (shouldRemoveBg && existingResume?.personal_info?.image) {
//       const imageUrl = existingResume.personal_info.image;
//       resumeDataCopy.personal_info.image = imageUrl + "?tr=w-300,h-300,fo-face,z-0.75,e-bgremove&v=" + Date.now();
//     }

//     const resume = await Resume.findOneAndUpdate(
//       { userId, _id: resumeId },
//       { $set: resumeDataCopy },
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Saved Successfully!",
//       resume
//     });

//   } catch (error) {
//     return res.status(401).json({ message: error.message });
//   }
// };

export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    const shouldRemoveBg = removeBackground === "yes";

    let resumeDataCopy =
      typeof resumeData === "string"
        ? JSON.parse(resumeData)
        : structuredClone(resumeData);

    // Ensure the resume belongs to the user
    let existingResume = await Resume.findOne({ _id: resumeId, userId });

    if (!existingResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // CASE 1: User uploaded a new image
    // CASE 1: User uploaded a new image
    if (image) {

      let imageBuffer = fs.readFileSync(image.path);

      if (shouldRemoveBg) {

        const formData = new FormData();
        formData.append("image_file", imageBuffer);
        formData.append("size", "auto");
        formData.append("format", "png");

        const removeBgResponse = await axios.post(
          "https://api.remove.bg/v1.0/removebg",
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              "X-Api-Key": process.env.REMOVE_BG_API
            },
            responseType: "arraybuffer"
          }
        );

        imageBuffer = Buffer.from(removeBgResponse.data);
      }

      const uploadResponse = await imageKit.files.upload({
        file: imageBuffer.toString("base64"),
        fileName: "resume.png",
        folder: "user-resumes"
      });

      resumeDataCopy.personal_info.image =
        uploadResponse.url + "?v=" + Date.now();
    }

    // CASE 2: No new image but toggle background removal
    else if (shouldRemoveBg && existingResume?.personal_info?.image) {

      const imageUrl = existingResume.personal_info.image.split("?")[0];

      // Download existing image
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer"
      });

      let imageBuffer = Buffer.from(response.data);

      // Send to remove.bg
      const formData = new FormData();
      formData.append("image_file", imageBuffer);
      formData.append("size", "auto");
      formData.append("format", "png");

      const removeBgResponse = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "X-Api-Key": process.env.REMOVE_BG_API
          },
          responseType: "arraybuffer"
        }
      );

      imageBuffer = Buffer.from(removeBgResponse.data);

      // Upload processed image to ImageKit
      const uploadResponse = await imageKit.files.upload({
        file: imageBuffer.toString("base64"),
        fileName: "resume.png",
        folder: "user-resumes"
      });

      resumeDataCopy.personal_info.image =
        uploadResponse.url + "?v=" + Date.now();
}

    // Update resume
    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      { $set: resumeDataCopy },
      { new: true }
    );

    return res.status(200).json({
      message: "Saved Successfully!",
      resume
    });

  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: error.message });
  }
};
// track views
export const trackResumeView = async (req, res) => {

  const { resumeId } = req.params

  const country = req.headers["x-vercel-ip-country"] || "Unknown"

  const resume = await Resume.findByIdAndUpdate(
    resumeId,
    {
      $inc: { views: 1 },
      $push: {
        viewHistory: {
          country,
          date: new Date()
        }
      }
    },
    { new: true }
  )

  res.json(resume)

}

//track download
export const trackDownload = async (req, res) => {
  const { resumeId } = req.params;

  await Resume.findByIdAndUpdate(resumeId, {
    $inc: { downloads: 1 }
  });

  res.json({ message: "Download tracked" });
};

export const exportResume = async (req, res) => {

  const { resumeId } = req.params;
  const { format } = req.query;

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    return res.status(404).json({ message: "Resume not found" });
  }
  if (format === "json") {
    return res.json(resume);
  }
  if (format === "html") {
    const html = `
      <html>
      <head>
        <title>${resume.title}</title>
      </head>
      <body>
        <h1>${resume.personal_info.name}</h1>
        <p>${resume.professional_summary}</p>
      </body>
      </html>
    `;
    res.setHeader("Content-Type", "text/html");
    return res.send(html);
  }

  if (format === "pdf") {

    const accent = resume.accent_color || "#3B82F6";

    const html = `
      <html>

      <head>
      <style>

      body{
      font-family: Arial;
      padding:40px;
      line-height:1.6;
      }

      .header{
      border-bottom:3px solid ${accent};
      padding-bottom:10px;
      margin-bottom:20px;
      }

      .name{
      font-size:30px;
      font-weight:bold;
      color:${accent};
      }

      .section{
      margin-top:25px;
      }

      .section-title{
      color:${accent};
      font-weight:bold;
      font-size:18px;
      margin-bottom:8px;
      }

      .item-title{
      font-weight:bold;
      }

      </style>
      </head>

      <body>

      <div class="header">
      <div class="name">${resume.personal_info?.full_name}</div>
      <div>${resume.personal_info?.profession}</div>

      <div>
      ${resume.personal_info?.email} |
      ${resume.personal_info?.phone} |
      ${resume.personal_info?.location}
      </div>
      </div>

      <div class="section">
      <div class="section-title">Professional Summary</div>
      <p>${resume.professional_summary}</p>
      </div>

      <div class="section">
      <div class="section-title">Experience</div>

      ${(resume.experience || [])
      .map(exp => `
      <div>
      <div class="item-title">
      ${exp.position} — ${exp.company}
      </div>

      <div>
      ${exp.start_date} - ${exp.is_current ? "Present" : exp.end_date}
      </div>

      <p>${exp.description}</p>
      </div>
      `)
      .join("")}

  </div>

  <div class="section">
  <div class="section-title">Education</div>

  ${(resume.education || [])
  .map(edu => `
  <div>
    <div class="item-title">${edu.degree}</div>
    <div>${edu.institution}</div>
  </div>`)
  .join("")}

  </div>

  <div class="section">
  <div class="section-title">Skills</div>
  <p>${resume.skills.join(", ")}</p>
  </div>

  </body>
  </html>
  `;

    const file = { content: html };

    const pdfBuffer = await html_to_pdf.generatePdf(file, {
    format: "A4"
    });

    res.setHeader(
    "Content-Disposition",
    "attachment; filename=resume.pdf"
    );

    res.send(pdfBuffer);

  }

  if (format === "docx") {
    const accent = resume.accent_color || "#3B82F6";

    const doc = new Document({
      sections: [
      {
      children: [

      new Paragraph({
      children:[
      new TextRun({
      text: resume.personal_info?.full_name,
      bold:true,
      size:40,
      color:accent.replace("#","")
      })
      ]
      }),

      new Paragraph(resume.personal_info?.profession),

      new Paragraph(
      `${resume.personal_info?.email} | ${resume.personal_info?.phone}`
      ),

      new Paragraph(""),

      new Paragraph({
      children:[
      new TextRun({
      text:"Professional Summary",
      bold:true,
      size:28,
      color:accent.replace("#","")
      })
      ]
      }),

      new Paragraph(resume.professional_summary),

      new Paragraph(""),

      new Paragraph({
      children:[
      new TextRun({
      text:"Experience",
      bold:true,
      size:28,
      color:accent.replace("#","")
      })
      ]
      }),

      ...(resume.experience || []).flatMap(exp => [

      new Paragraph({
      children:[
      new TextRun({
      text:`${exp.position} — ${exp.company}`,
      bold:true
      })
      ]
      }),

      new Paragraph(`${exp.start_date} - ${exp.is_current ? "Present" : exp.end_date}`),

      new Paragraph(exp.description || ""),

      new Paragraph("")
      ]),

      new Paragraph({
      children:[
      new TextRun({
      text:"Skills",
      bold:true,
      size:28,
      color:accent.replace("#","")
      })
      ]
      }),

      new Paragraph((resume.skills || []).join(", "))

      ]
      }
      ]
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader(
    "Content-Disposition",
    "attachment; filename=resume.docx"
    );

    res.send(buffer);

  }

};

// export const atsScore = async (req,res)=>{
//   const { resumeId, jobDescription } = req.body;

//   const resume = await Resume.findById(resumeId);

//   const resumeText = `
//   ${resume.professional_summary}
//   ${resume.skills.join(" ")}
//   ${resume.experience.map(e=>e.description).join(" ")}
//   `;

//   const jobWords = jobDescription
//     .toLowerCase()
//     .match(/\b[a-z]+\b/g);

//   const uniqueWords = [...new Set(jobWords)];

//   const matched = uniqueWords.filter(word =>
//     resumeText.toLowerCase().includes(word)
//   );

//   const score = Math.round(
//     (matched.length / uniqueWords.length) * 100
//   );

//   res.json({
//     score,
//     matched,
//     missing: uniqueWords.filter(w=>!matched.includes(w))
//   });
// };