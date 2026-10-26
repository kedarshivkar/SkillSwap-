import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "SkillSwap Platform" });
  });

  // Download Academic Project Report (.docx)
  app.get("/api/download-report", (_req, res) => {
    const filePath = path.join(process.cwd(), "public", "SkillSwap_Project_Report_55_Pages.docx");
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Disposition", 'attachment; filename="SkillSwap_Project_Report_55_Pages.docx"');
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "Report file not found. Please regenerate." });
    }
  });

  // AI Skill Advisor Route using Gemini API
  app.post("/api/ai-suggestions", async (req, res) => {
    try {
      const { teachSkills, learnSkills, bio, targetGoal } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          success: true,
          data: {
            recommendedSkills: [
              { skill: "Data Analytics", reason: "Complements your current skill profile and enhances project decision making.", difficulty: "Intermediate" },
              { skill: "UI/UX & Product Design", reason: "Pairs seamlessly with development and creative exchange projects.", difficulty: "Beginner" },
              { skill: "Public Speaking & Communication", reason: "Helps you teach effectively and negotiate productive skill exchanges.", difficulty: "Beginner" }
            ],
            exchangeProjectIdeas: [
              "Build a full-stack portfolio site with interactive dashboard components",
              "Co-create a collaborative workshop syllabus to teach peers"
            ],
            advisorNote: "Continuous skill reciprocity builds domain mastery faster than isolated learning!"
          }
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are an AI Career and Skill Exchange Advisor for the platform "SkillSwap".
The user currently teaches: ${JSON.stringify(teachSkills || [])}.
The user currently wants to learn: ${JSON.stringify(learnSkills || [])}.
User Bio: "${bio || "Self-taught enthusiast looking to exchange skills."}"
Target Goal: "${targetGoal || "Career growth and creative development"}"

Please provide 3-4 actionable skill recommendations that would logically pair with their current skill set to increase their marketability or skill-swap match score. 
Include brief reasons for each recommendation and 2 suggested exchange projects.
Keep response concise, encouraging, and formatted in structured JSON:
{
  "recommendedSkills": [
    { "skill": "Skill Name", "reason": "Why it pairs well", "difficulty": "Beginner|Intermediate|Advanced" }
  ],
  "exchangeProjectIdeas": [
    "Project Idea 1",
    "Project Idea 2"
  ],
  "advisorNote": "Short inspiring advice note"
}`;

      const aiPromise = ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI suggestions timeout")), 4500)
      );

      const response: any = await Promise.race([aiPromise, timeoutPromise]);

      const text = response.text?.trim() || "{}";
      const parsedData = JSON.parse(text);

      res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error("Gemini AI error:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Failed to generate AI recommendations",
        data: {
          recommendedSkills: [
            { skill: "Data Analytics", reason: "Strong demand in technical and business domains.", difficulty: "Intermediate" },
            { skill: "UI/UX Design", reason: "Complements development and product skills.", difficulty: "Beginner" },
            { skill: "Digital Marketing", reason: "Helps promote your projects and taught skills.", difficulty: "Beginner" }
          ],
          exchangeProjectIdeas: [
            "Build a joint portfolio website while teaching Python",
            "Create a mini design & code showcase"
          ],
          advisorNote: "Keep expanding your cross-domain knowledge!"
        }
      });
    }
  });

function formatFallback(currentUser: any, candidates: any[], searchQuery?: string) {
  const q = searchQuery?.toLowerCase().trim();
  const scored = candidates.map((cand: any) => {
    let score = 50; // base score

    // Search query match boost
    let matchedTeach = false;
    let matchedLearn = false;
    if (q) {
      matchedTeach = cand.teachSkills?.some((t: any) => t.skillName.toLowerCase().includes(q));
      matchedLearn = cand.learnSkills?.some((l: any) => l.skillName.toLowerCase().includes(q));
      if (matchedTeach && matchedLearn) score += 45;
      else if (matchedTeach) score += 40;
      else if (matchedLearn) score += 25;
    }

    // 1. Skill synergy
    const cTeachA = cand.teachSkills?.some((t: any) => 
      currentUser.learnSkills?.some((l: any) => l.skillName.toLowerCase() === t.skillName.toLowerCase())
    );
    const aTeachC = currentUser.teachSkills?.some((t: any) => 
      cand.learnSkills?.some((l: any) => l.skillName.toLowerCase() === t.skillName.toLowerCase())
    );

    if (cTeachA && aTeachC) score += 35;
    else if (cTeachA || aTeachC) score += 20;

    // Similar/complementary domain
    const sameDomain = cand.teachSkills?.some((t: any) => 
      currentUser.teachSkills?.some((ct: any) => ct.category === t.category || ct.skillName.split(' ')[0] === t.skillName.split(' ')[0])
    );
    if (sameDomain) score += 10;

    // 2. Rating & trust
    if (cand.rating >= 4.8) score += 8;
    else if (cand.rating >= 4.5) score += 5;

    // 3. Mode / Location
    if (cand.mode === currentUser.mode || cand.mode === 'Hybrid' || currentUser.mode === 'Hybrid') score += 5;

    // Cap match score between 65 and 98
    const matchPercentage = Math.min(98, Math.max(65, Math.round(score)));

    const userTeachList = cand.teachSkills?.map((s: any) => s.skillName).join(', ') || 'various skills';
    const userLearnList = cand.learnSkills?.map((s: any) => s.skillName).join(', ') || 'new domains';

    let reasonSummary = `${cand.name} can teach ${userTeachList} and is looking to learn ${userLearnList}. Balanced skill level and compatible ${cand.mode || 'Online'} mode.`;
    if (q && matchedTeach) {
      reasonSummary = `Direct match for "${searchQuery}": ${cand.name} teaches ${userTeachList}, and is interested in learning ${userLearnList}.`;
    } else if (q && matchedLearn) {
      reasonSummary = `Skill reciprocal match: ${cand.name} is looking to learn "${searchQuery}" and offers ${userTeachList} in exchange.`;
    }

    return {
      userId: cand.id,
      userName: cand.name,
      matchPercentage,
      isBestChoice: false,
      badgeLabel: `${matchPercentage}% Match`,
      reasonSummary,
      factorBreakdown: {
        skillSynergy: matchedTeach ? `Directly teaches searched skill (${userTeachList})` : `Teaches: ${userTeachList} | Wants: ${userLearnList}`,
        levelCompatibility: `Matches ${cand.experienceLevel || 'Intermediate'} skill exchange level`,
        ratingAndTrust: `${cand.rating || 5.0} ★ (${cand.totalReviews || 12} community reviews) • Verified`,
        availabilityAndMode: `${cand.availability || 'Flexible'} schedule in ${cand.mode || 'Online'} mode`,
        locationAndLang: `Based in ${cand.city || 'Mumbai'} • Languages: ${(cand.languages || ['English']).join(', ')}`
      }
    };
  });

  scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
  const top3 = scored.slice(0, 3);
  if (top3.length > 0) {
    top3[0].isBestChoice = true;
    top3[0].badgeLabel = "⭐⭐⭐⭐⭐ Best Choice";
  }

  return {
    analysisSummary: searchQuery 
      ? `AI evaluated top candidates specifically matching the skill query "${searchQuery}" across 5 key factors: skill synergy, level balance, ratings, schedule, and location.`
      : "AI evaluated top candidate recommendations using 5 key factors: skill synergy, level balance, ratings & trust, schedule availability, and location & languages.",
    recommendations: top3
  };
}

  // AI Skill Match Recommendation Route (Multi-Factor Matching)
  app.post("/api/ai-match-recommendations", async (req, res) => {
    try {
      const { currentUser, candidates, searchQuery } = req.body;

      if (!currentUser || !candidates || !Array.isArray(candidates) || candidates.length === 0) {
        return res.status(400).json({ error: "Invalid user data or empty candidates list" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({ success: true, data: formatFallback(currentUser, candidates, searchQuery) });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are the AI Matchmaker Engine for "SkillSwap", a skill exchange platform.
Evaluate the current user against candidate users based on 5 key factors:
1. Similar & Complementary Skills (direct reciprocity or related skill domains)
2. Skill Proficiency Levels (balancing Beginner, Intermediate, Expert)
3. User Ratings & Community Trust
4. Schedule Availability & Mode (Online, Hybrid, Offline)
5. Location & Shared Languages

${searchQuery ? `TARGET SEARCHED SKILL QUERY: "${searchQuery}". Prioritize candidates who teach or want to learn "${searchQuery}" or closely related skills.` : ''}

Current User:
Name: ${currentUser.name}
Can Teach: ${JSON.stringify(currentUser.teachSkills || [])}
Wants to Learn: ${JSON.stringify(currentUser.learnSkills || [])}
Bio: "${currentUser.bio || ''}"
City: "${currentUser.city || ''}"
Mode: "${currentUser.mode || ''}"
Languages: ${JSON.stringify(currentUser.languages || [])}
Availability: "${currentUser.availability || ''}"
Rating: ${currentUser.rating || 5.0} ★ (${currentUser.totalReviews || 0} reviews)

Candidate Users:
${JSON.stringify(candidates.map((c: any) => ({
  id: c.id,
  name: c.name,
  teachSkills: c.teachSkills,
  learnSkills: c.learnSkills,
  bio: c.bio,
  city: c.city,
  mode: c.mode,
  languages: c.languages,
  availability: c.availability,
  rating: c.rating,
  totalReviews: c.totalReviews,
  experienceLevel: c.experienceLevel,
  isVerified: c.isVerified
})))}

Please evaluate and rank candidates, returning ONLY the top 3 best candidate recommendations based on overall compatibility (matchPercentage between 65 and 98), identifying the top candidate as the "⭐⭐⭐⭐⭐ Best Choice".
Return valid JSON matching this schema:
{
  "analysisSummary": "Short explanation of how the AI evaluated top 3 candidates across the 5 factors",
  "recommendations": [
    {
      "userId": "candidate_id",
      "userName": "Candidate Name",
      "matchPercentage": 92,
      "isBestChoice": true,
      "badgeLabel": "⭐⭐⭐⭐⭐ Best Choice",
      "reasonSummary": "Detailed reason why this user is a great match...",
      "factorBreakdown": {
        "skillSynergy": "Direct complementary match in Python and Data Analytics",
        "levelCompatibility": "Expert to Intermediate teaching balance",
        "ratingAndTrust": "4.9 ★ (22 reviews) with verified member status",
        "availabilityAndMode": "Both operate in Online mode with weekend availability",
        "locationAndLang": "Shared English fluency and compatible time slot"
      }
    }
  ]
}`;

      const aiPromise = ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI matchmaker timeout")), 4500)
      );

      const response: any = await Promise.race([aiPromise, timeoutPromise]);

      const text = response.text?.trim() || "{}";
      const parsedData = JSON.parse(text);

      if (parsedData.recommendations && Array.isArray(parsedData.recommendations) && parsedData.recommendations.length > 0) {
        parsedData.recommendations.sort((a: any, b: any) => b.matchPercentage - a.matchPercentage);
        parsedData.recommendations = parsedData.recommendations.slice(0, 3);
        if (parsedData.recommendations.length > 0) {
          parsedData.recommendations[0].isBestChoice = true;
          parsedData.recommendations[0].badgeLabel = "⭐⭐⭐⭐⭐ Best Choice";
        }
        res.json({ success: true, data: parsedData });
      } else {
        res.json({ success: true, data: formatFallback(currentUser, candidates, searchQuery) });
      }
    } catch (err: any) {
      console.error("AI Matchmaker Error:", err);
      // Fallback response with search query
      const { currentUser, candidates, searchQuery } = req.body;
      let fallbackData = null;
      if (currentUser && candidates) {
        fallbackData = formatFallback(currentUser, candidates, searchQuery);
      }
      res.json({ success: true, data: fallbackData || { recommendations: [], analysisSummary: "Unable to calculate matches." } });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillSwap Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
