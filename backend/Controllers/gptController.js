// add AI resume
const pdf = require("pdf-parse");
const markdownpdf = require("markdown-pdf");
const fs = require("fs/promises");
const path = require("path");

const genAIResume = async (req, res) => {
  try {
    const openai = req.app.locals.openai;

    if (!openai) {
      throw new Error("OpenAI client not initialized");
    }

    // Check for both PDF file and job info
    if (!req.files || !req.files.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const jobName = req.body.job_name;
    if (!jobName) {
      return res.status(400).json({ error: "No job name provided" });
    }

    const companyName = req.body.company_name;
    if (!companyName) {
      return res.status(400).json({ error: "No company name provided" });
    }

    const jobDescription = req.body.job_description;
    if (!jobDescription) {
      return res.status(400).json({ error: "No job description provided" });
    }

    const pdfFile = req.files.pdfFile;
    const pdfBuffer = pdfFile.data;

    // Extract text from PDF
    const pdfData = await pdf(pdfBuffer);
    const resumeText = pdfData.text;

    const prompt = `Kindly improve and tailor the provided original resume for a specific role, ${jobName}, at ${companyName} using the job description provided. 
    Job Description:
    ${jobDescription}
    
    Original Resume:
    ${resumeText}
    
    Perform the following:
    1. Enhance and rewrite the resume while maintaining accurate core information and experience.
    2. Assess the current formatting of the provided resume - keep the formatting consistent in the one you design.
    3. Tailor the provided resume to align with the job description's requirements and keywords.
    4. Make it ATS-friendly and professional.
    5. Highlight relevant skills and experiences that match the job description.
    6. Format the response in clean markdown.
    7. Ensure the most relevant experience for this role is prominently featured.
    8. Include a brief professional summary that aligns with the job requirements.
    9. Use industry-specific keywords from the job description where applicable and authentic, please make it sound somewhat human-like.
    10. When making the skills section, instead of using multiple bullets representing each skill, use one bullet and add each skill separated by commas.
    11. Be sure to proofread the entire syntax, making sure there are no spelling mistakes, capitalization errors, or etc.

    You must output the created resume in markdown format.`;

    // Get improved resume from ChatGPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const improvedResumeMarkdown = completion.choices[0].message.content;

    // Create temporary files for processing
    const tempDir = path.join(__dirname, "../temp");
    await fs.mkdir(tempDir, { recursive: true });

    const markdownPath = path.join(tempDir, `resume-${Date.now()}.md`);
    const pdfOutputPath = path.join(
      tempDir,
      `improved-resume-${Date.now()}.pdf`
    );

    // Custom CSS for PDF styling
    const cssPath = path.join(tempDir, `style-${Date.now()}.css`);
    const cssContent = `
     @page {
        margin: 0.5in 0.75in;  /* Top/bottom: 0.5 inch, Left/right: 0.75 inch */
      }
      body {
        font-family: "Times New Roman", Times, serif;
        font-size: 12px;
        line-height: 1.3;  /* Slightly reduced line height */
        margin: 0;         /* Remove body margins since we're using @page margins */
        padding: 0;
      }
      h1, h2, h3 {
        font-family: "Times New Roman", Times, serif;
        margin-top: 0.7em;    /* Reduced margin top for headers */
        margin-bottom: 0.3em; /* Reduced margin bottom for headers */
      }
      h1 { 
        font-size: 18px; 
        margin-top: 0;    /* No top margin for first header */
      }
      h2 { font-size: 16px; }
      h3 { font-size: 14px; }
      p {
        margin: 0.3em 0;  /* Reduced paragraph margins */
      }
      ul, ol {
        margin-top: 0.3em;
        margin-bottom: 0.3em;
        padding-left: 1.5em;  /* Reduced list indentation */
      }
      li {
        margin-bottom: 0.2em;  /* Reduced space between list items */
      }
      /* Add some space between sections */
      section {
        margin-bottom: 0.8em;
      }`;

    // Save CSS file
    await fs.writeFile(cssPath, cssContent);

    // Save markdown to temporary file
    await fs.writeFile(markdownPath, improvedResumeMarkdown);

    // PDF conversion options
    const pdfOptions = {
      cssPath: cssPath,
      paperFormat: "Letter",
      paperOrientation: "portrait",
      remarkable: {
        html: true,
        breaks: true,
        typographer: true,
      },
    };

    // Convert markdown to PDF with custom styling
    await new Promise((resolve, reject) => {
      markdownpdf(pdfOptions)
        .from(markdownPath)
        .to(pdfOutputPath, () => resolve());
    });

    // Read the generated PDF
    const improvedResumePDF = await fs.readFile(pdfOutputPath);

    // Clean up temporary files
    await Promise.all([
      fs.unlink(markdownPath),
      fs.unlink(pdfOutputPath),
      fs.unlink(cssPath),
    ]);

    // Send the improved resume PDF back to the client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=improved-resume.pdf"
    );
    return res.send(improvedResumePDF);
  } catch (error) {
    console.error("Error in genAIResume:", error);
    return res.status(500).json({
      error: "Failed to process resume",
      details: error.message,
    });
  }
};

const genAILetter = async (req, res) => {
  try {
    const openai = req.app.locals.openai;

    if (!openai) {
      throw new Error("OpenAI client not initialized");
    }

    // Check for both PDF file and job info
    if (!req.files || !req.files.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const jobName = req.body.job_name;
    if (!jobName) {
      return res.status(400).json({ error: "No job name provided" });
    }

    const companyName = req.body.company_name;
    if (!companyName) {
      return res.status(400).json({ error: "No company name provided" });
    }

    const jobDescription = req.body.job_description;
    if (!jobDescription) {
      return res.status(400).json({ error: "No job description provided" });
    }

    const pdfFile = req.files.pdfFile;
    const pdfBuffer = pdfFile.data;

    // Extract text from PDF
    const pdfData = await pdf(pdfBuffer);
    const resumeText = pdfData.text;

    const prompt = `Kindly create a tailored cover letter while taking into account the job info and the resume provided below.
    Position Title:
    ${jobName}

    Company Name:
    ${companyName}

    Job Description:
    ${jobDescription}
    
    Resume:
    ${resumeText}
    
    The format of the cover letter should be as follows:

    [Your Name]  
    [Your Address]  
    [City, State, ZIP Code]  
    [Email Address]  
    [Phone Number]  

    [Date]  

    [Employer's Name]  
    [Company Name]  
    [Company Address]  
    [City, State, ZIP Code]  

    Dear [Hiring Manager's Name],

    I am writing to express my interest in the [Position Title] role at [Company Name]. With my [X years of experience/qualifications], I am confident in my ability to contribute effectively to your team.

    [Paragraph detailing relevant skills/achievements. Remember to cater this section using info from the provided resume above]

    [Closing paragraph emphasizing enthusiasm and a call to action.]

    Sincerely,  
    [Your Name]

    You must provide the tailored cover letter in markdown format.`;

    // Get improved resume from ChatGPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const improvedResumeMarkdown = completion.choices[0].message.content;

    // Create temporary files for processing
    const tempDir = path.join(__dirname, "../temp");
    await fs.mkdir(tempDir, { recursive: true });

    const markdownPath = path.join(tempDir, `resume-${Date.now()}.md`);
    const pdfOutputPath = path.join(
      tempDir,
      `improved-resume-${Date.now()}.pdf`
    );

    // Custom CSS for PDF styling
    const cssPath = path.join(tempDir, `style-${Date.now()}.css`);
    const cssContent = `
     @page {
        margin: 0.5in 0.75in;  /* Top/bottom: 0.5 inch, Left/right: 0.75 inch */
      }
      body {
          font-family: "Times New Roman", Times, serif;
          font-size: 12pt;
          line-height: 1.5;
      }
      header, footer {
          text-align: center;
          margin-top: 20px;
      }
      .address {
          margin-bottom: 20px;
      }
      .date {
          margin-bottom: 20px;
      }
      .signature {
          margin-top: 40px;
      }`;

    // Save CSS file
    await fs.writeFile(cssPath, cssContent);

    // Save markdown to temporary file
    await fs.writeFile(markdownPath, improvedResumeMarkdown);

    // PDF conversion options
    const pdfOptions = {
      cssPath: cssPath,
      paperFormat: "Letter",
      paperOrientation: "portrait",
      remarkable: {
        html: true,
        breaks: true,
        typographer: true,
      },
    };

    // Convert markdown to PDF with custom styling
    await new Promise((resolve, reject) => {
      markdownpdf(pdfOptions)
        .from(markdownPath)
        .to(pdfOutputPath, () => resolve());
    });

    // Read the generated PDF
    const improvedResumePDF = await fs.readFile(pdfOutputPath);

    // Clean up temporary files
    await Promise.all([
      fs.unlink(markdownPath),
      fs.unlink(pdfOutputPath),
      fs.unlink(cssPath),
    ]);

    // Send the improved resume PDF back to the client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=tailored-letter.pdf"
    );
    return res.send(improvedResumePDF);
  } catch (error) {
    console.error("Error in genAILetter:", error);
    return res.status(500).json({
      error: "Failed to create tailored cover letter.",
      details: error.message,
    });
  }
};

module.exports = {
  genAIResume,
  genAILetter,
};
