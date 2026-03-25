import Resume from "../models/Resume.models.js";
import { ApiError } from "../utils/api_errors.js";
import { ApiResponse } from "../utils/api_response.js";
import ai from "../configs/ai.js";


//controller for enhancing a resume's professional summary
//POST: /api/ai/enhance-pro-sum

export const enhanceProfessionalSummary = async (req,res) => {
    try {

        const { userContent } = req.body;

        if (!userContent || !userContent.trim()) {
            throw new ApiError(400, "User content missing!");
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert resume writer. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly and only return text no options or anything else."
                },
                {
                    role: "user",
                    content: userContent
                }
            ],
        });

        const enhancedContent = response.choices[0].message.content;

        return res.status(200).json({ enhancedContent });

    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
}

//controller for enhancing a resume's job description
//POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req,res) => {
    try {

        const { userContent } = req.body;

        if(!userContent){
            throw new ApiError(409, "Missing required fields")
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {   role: "system",
                    content: `You are an expert resume writer.
                    Rewrite the user's job description to make it strong and ATS optimized.
                    Rules:
                    - Return ONLY the improved job description
                    - Do NOT give multiple options
                    - Do NOT explain anything
                    - Do NOT say "Here are a few ways"
                    - Start each line with an action verb
                    - Use bullet-style statements
                    - Focus on achievements and impact
                    - Keep it concise and professional`
                },
                {
                    role: "user",
                    content: userContent
                }
            ],
            temperature: 0.4
        })

        const enhancedContent = response.choices[0].message.content.trim();
        return res
            .status(200)
            .json({enhancedContent}) 

        
    } catch (error) {
        console.error("AI ERROR:", error);
        return res.status(500).json({
            message: error.message || "AI generation failed"
        });
    }
}

//controller for uploading a resume to database
//POST: /api/ai/upload-resume

export const uploadResume = async (req,res) => {
    try {

        const {resumeText, title} = req.body;
        const userId = req.userId;

        if(!resumeText){
            throw new ApiError(409, "Missing required fields");
        }

        const systemPrompt ="You are an expert AI Agent to extract data from resume.";

        const userPrompt = `Extract data from this resume: ${resumeText}
        Provide data in the following JSON format with no additional text before or after:
        {
            professional_summary:{type: String, default:''},
            skills: [{type:String}],
            personal_info:{
                image:{type: String, default:''},
                full_name:{type: String, default:''},
                profession:{type: String, default:''},
                email:{type: String, default:''},
                phone:{type: String, default:''},
                location:{type: String, default:''},
                linkedin:{type: String, default:''},
                website:{type: String, default:''},
            },
            experience:[
                {
                    company :{type: String},
                    position :{type: String},
                    start_date :{type: String},
                    end_date :{type: String},
                    description :{type: String},
                    is_current :{type: Boolean},
                }
            ],
            project:[
                {
                    name :{type: String},
                    type :{type: String},
                    description :{type: String},
                }
            ],
            education:[
                {
                    institution :{type: String},
                    degree :{type: String},
                    field :{type: String},
                    graduation_date :{type: String},
                    gpa :{type: String}
                }
            ]
        }`;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages:[
                {
                    role:"system",
                    content: systemPrompt
                },
                {
                    role:"user",
                    content: userPrompt
                }
            ],
            response_format: {type: 'json_object'}
        })

        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData);
        const newResume = await Resume.create({userId, title, ...parsedData})

        res.json({resumeId: newResume._id});
        
    } catch (error) {
        console.error(error);
        return res.status(401).json({message: error.message});
    }
}