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

    // Check for both PDF file and job description
    if (!req.files || !req.files.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" });
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

    const prompt = `Kindly improve and tailor the following resume for a specific job opportunity. 
    Job Description:
    ${jobDescription}
    
    Original Resume:
    ${resumeText}
    
    Perform the following:
    1. Enhance and rewrite the resume while maintaining accurate core information and experience
    2. Tailor the content to match the job description's requirements and keywords
    3. Make it ATS-friendly and professional
    4. Highlight relevant skills and experiences that match the job description
    5. Format the response in clean markdown
    6. Ensure the most relevant experience for this role is prominently featured
    7. Include a brief professional summary that aligns with the job requirements
    8. Use industry-specific keywords from the job description where applicable and authentic

    You must provide the improved resume in markdown format.`;

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

module.exports = {
  genAIResume,
};
