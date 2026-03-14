import { useState, useEffect } from "react";
import { PLATFORMS, TONES, ANALYSIS_PROMPT, REPURPOSE_PROMPT } from "./config/constants.js";
import { S } from "./styles/theme.js";
import { CircularProgress, PlatformBar, EntityTag, KeywordPill, MetricCard } from "./components/ui.jsx";

export default function ContentRepurposerPro() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("twitter");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [copied, setCopied] = useState("");
  const [activeView, setActiveView] = useState("input");
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => { setAnimateIn(true); }, []);

  const callAI = async (systemPrompt, userMessage) => {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
        "anthropic-dangerously-allow-browser": "true"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.content?.map((i) => (i.type === "text" ? i.text : "")).join("") || "";
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  };

  const handleGenerate = async () => {
    if (!input.trim() || input.trim().length < 100) {
      setError(input.trim().length < 100 ? "Paste at least a paragraph for good results." : "Paste your content first!");
      return;
    }
    setLoading(true);
    setError("");
    setAnalysis(null);
    setResults(null);

    try {
      setLoadingPhase("Running NLP analysis...");
      const analysisResult = await callAI(ANALYSIS_PROMPT,
        `Analyze this content deeply. Return ONLY JSON:\n\n${input.slice(0, 6000)}`);
      setAnalysis(analysisResult);
      setActiveView("analysis");

      setLoadingPhase("Repurposing in " + TONES.find(t => t.id === selectedTone)?.label + " tone...");
      const tone = TONES.find(t => t.id === selectedTone);
      const repurposeResult = await callAI(REPURPOSE_PROMPT,
        `Tone: ${tone.label} (${tone.emoji}). Repurpose this content into all 6 formats using this tone. Return ONLY JSON:\n\n${input.slice(0, 6000)}`);
      setResults(repurposeResult);
      setActiveTab("twitter");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please check your API configuration or try again.");
    } finally {
      setLoading(false);
      setLoadingPhase("");
    }
  };

  const handleCopy = (id) => {
    if (results?.[id]) {
      navigator.clipboard.writeText(results[id]);
      setCopied(id);
      setTimeout(() => setCopied(""), 2000);
    }
  };

  const handleCopyAll = () => {
    if (!results) return;
    const all = PLATFORMS.map(p => `=== ${p.label.toUpperCase()} ===\n\n${results[p.id] || ""}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(all);
    setCopied("all");
    setTimeout(() => setCopied(""), 2000);
  };

  const loadExample = () => {
    const ex = `The Future of Remote Work in 2026\n\nRemote work has fundamentally transformed how we think about productivity, collaboration, and work-life balance. After years of experimentation, companies are finally finding the sweet spot between flexibility and structure.\n\nThe data is clear: 73% of remote workers report higher productivity compared to office settings. But it's not just about where you work — it's about how you work. The most successful remote teams have adopted async-first communication, replacing endless meetings with thoughtful documentation and recorded video updates.\n\nThree key trends are shaping remote work this year. First, AI-powered tools are eliminating the busywork that used to eat up 30% of the workday. Second, companies are investing in "connection budgets" — dedicated funds for team retreats and co-working experiences. Third, the four-day workweek is gaining serious traction, with 40% of remote-first companies now offering it.\n\nThe biggest challenge remains loneliness. Despite all the tools and processes, 45% of remote workers still report feeling isolated. The solution isn't forcing people back to offices — it's designing intentional social experiences that feel natural, not forced.\n\nFor managers, the shift requires a fundamental mindset change: measure outcomes, not hours. Trust your team. Document everything. And remember that the best remote culture is one where people feel empowered to do their best work, wherever they are.`;
    setInput(ex);
  };

  const sentimentColor = (label) => {
    const m = { positive: "#059669", negative: "#DC2626", neutral: "#6B7280", mixed: "#D97706" };
    return m[label] || "#6B7280";
  };

  const platformColorMap = { twitter: "#000", linkedin: "#0A66C2", instagram: "#E1306C", youtube: "#FF0000", newsletter: "#D44638", podcast: "#8B5CF6" };

  return (
    <div style={S.container}>
      <div style={S.bgOrb1} /><div style={S.bgOrb2} /><div style={S.bgOrb3} />

      <div style={{ ...S.wrapper, opacity: animateIn ? 1 : 0, transform: animateIn ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}>

        <div style={S.header}>
          <div style={S.badge}>NLP + LLM + CONTENT AI</div>
          <h1 style={S.title}>Content <span style={S.titleAccent}>Repurposer</span></h1>
          <p style={S.subtitle}>AI-powered analysis, tone transformation & multi-platform repurposing</p>
        </div>

        <div style={S.card}>
          <div style={S.cardHeader}>
            <label style={S.cardLabel}>Paste Your Content</label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{input.length.toLocaleString()} chars</span>
              <button onClick={loadExample} style={S.ghostBtn}>Load Example</button>
            </div>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your blog post, article, or long-form content here..." style={S.textarea} rows={7} />

          <div style={{ marginTop: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", display: "block", marginBottom: "10px" }}>
              🎨 AI Tone Transformation
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {TONES.map(tone => (
                <button key={tone.id} onClick={() => setSelectedTone(tone.id)} style={{
                  ...S.toneBtn,
                  background: selectedTone === tone.id ? "#1a1a2e" : "#F9FAFB",
                  color: selectedTone === tone.id ? "#FBBF24" : "#374151",
                  border: selectedTone === tone.id ? "1.5px solid #1a1a2e" : "1.5px solid #E5E7EB",
                }}>
                  {tone.emoji} {tone.label}
                </button>
              ))}
            </div>
          </div>

          {error && <div style={S.error}>{error}</div>}

          <button onClick={handleGenerate} disabled={loading} style={{ ...S.generateBtn, opacity: loading ? 0.8 : 1 }}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <span style={S.spinner} />{loadingPhase}
              </span>
            ) : "Analyze & Repurpose → 6 Formats"}
          </button>
        </div>

        {(analysis || results) && (
          <div style={{ display: "flex", gap: "4px", marginTop: "32px", marginBottom: "20px", background: "#F3F4F6", borderRadius: "12px", padding: "4px" }}>
            {[
              { id: "analysis", label: "🧠 AI Analysis" },
              { id: "seo", label: "🔍 SEO Insights" },
              { id: "repurposed", label: "📝 Repurposed Content" },
            ].map(v => (
              <button key={v.id} onClick={() => setActiveView(v.id)} style={{
                flex: 1, padding: "10px 16px", border: "none", borderRadius: "10px",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                background: activeView === v.id ? "#FFFFFF" : "transparent",
                color: activeView === v.id ? "#1a1a2e" : "#6B7280",
                boxShadow: activeView === v.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s",
              }}>{v.label}</button>
            ))}
          </div>
        )}

        {analysis && activeView === "analysis" && (
          <div style={{ animation: "fadeSlideUp 0.5s ease-out" }}>
            <div style={{ ...S.card, marginBottom: "16px", background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)", border: "none" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#FBBF24", letterSpacing: "1.5px", marginBottom: "8px" }}>AI SUMMARY</div>
              <p style={{ fontSize: "16px", color: "#F9FAFB", lineHeight: 1.7, fontWeight: 400 }}>{analysis.summary}</p>
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
              <div style={{ ...S.card, flex: 1, minWidth: "200px", display: "flex", alignItems: "center", gap: "20px" }}>
                <CircularProgress value={analysis.readability?.score || 0} color="#10B981" label="Readability" sublabel={analysis.readability?.gradeLevel} />
                <CircularProgress value={(analysis.sentiment?.score || 0) * 100} color={sentimentColor(analysis.sentiment?.label)} label="Sentiment" sublabel={analysis.sentiment?.label} />
                <CircularProgress value={(analysis.tone?.confidence || 0) * 100} color="#6366F1" label="Tone Confidence" sublabel={analysis.tone?.primary} />
                <CircularProgress value={(analysis.emotionalTone?.intensity || 0) * 100} color="#F59E0B" label="Emotion" sublabel={analysis.emotionalTone?.dominant} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
              <MetricCard icon="📊" label="Info Density" value={analysis.contentMetrics?.informationDensity || "—"} />
              <MetricCard icon="🎯" label="Actionability" value={analysis.contentMetrics?.actionability || "—"} />
              <MetricCard icon="✨" label="Originality" value={analysis.contentMetrics?.originalitySignal || "—"} />
              <MetricCard icon="📁" label="Topic" value={analysis.topicClassification?.primary || "—"} detail={analysis.topicClassification?.secondary} />
            </div>

            <div style={{ ...S.card, marginBottom: "16px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", marginBottom: "12px" }}>🔑 Extracted Keywords</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(analysis.keywords || []).map((kw, i) => <KeywordPill key={i} word={kw} />)}
              </div>
            </div>

            {analysis.namedEntities?.length > 0 && (
              <div style={{ ...S.card, marginBottom: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", marginBottom: "12px" }}>🏷️ Named Entity Recognition (NER)</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {analysis.namedEntities.map((ent, i) => <EntityTag key={i} text={ent.text} type={ent.type} />)}
                </div>
              </div>
            )}

            {analysis.platformPrediction && (
              <div style={S.card}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", marginBottom: "6px" }}>📈 Platform Performance Prediction</div>
                <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "16px", lineHeight: 1.5 }}>{analysis.platformPrediction.reasoning}</p>
                {Object.entries(analysis.platformPrediction.scores || {}).sort(([,a],[,b]) => b - a).map(([platform, score]) => (
                  <PlatformBar key={platform} platform={platform} score={score}
                    color={platformColorMap[platform] || "#6B7280"}
                    isBest={platform === analysis.platformPrediction.bestPlatform} />
                ))}
              </div>
            )}
          </div>
        )}

        {analysis?.seo && activeView === "seo" && (
          <div style={{ animation: "fadeSlideUp 0.5s ease-out" }}>
            <div style={S.card}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#FBBF24", letterSpacing: "1.5px", marginBottom: "20px", background: "#1a1a2e", display: "inline-block", padding: "4px 12px", borderRadius: "6px" }}>SEO OPTIMIZATION</div>

              {[
                { label: "Suggested Title", value: analysis.seo.suggestedTitle, limit: "60 chars", len: analysis.seo.suggestedTitle?.length },
                { label: "Meta Description", value: analysis.seo.metaDescription, limit: "155 chars", len: analysis.seo.metaDescription?.length },
                { label: "URL Slug", value: `/${analysis.seo.slug}` },
                { label: "Primary Keyword", value: analysis.seo.primaryKeyword },
                { label: "Search Volume Est.", value: analysis.seo.estimatedSearchVolume },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</span>
                    {item.limit && <span style={{ fontSize: "10px", color: "#9CA3AF" }}>{item.len}/{item.limit}</span>}
                  </div>
                  <div style={{
                    padding: "12px 16px", background: "#F9FAFB", borderRadius: "10px",
                    border: "1px solid #E5E7EB", fontSize: "14px", color: "#1a1a2e",
                    fontWeight: item.label === "URL Slug" ? 500 : 400,
                    fontFamily: item.label === "URL Slug" ? "monospace" : "'DM Sans', sans-serif",
                  }}>{item.value}</div>
                </div>
              ))}

              <div style={{ marginTop: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>Secondary Keywords</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                  {(analysis.seo.secondaryKeywords || []).map((kw, i) => <KeywordPill key={i} word={kw} />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {results && activeView === "repurposed" && (
          <div style={{ animation: "fadeSlideUp 0.5s ease-out" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "24px", color: "#1a1a2e" }}>
                {TONES.find(t => t.id === selectedTone)?.emoji} {TONES.find(t => t.id === selectedTone)?.label} Tone
              </h2>
              <button onClick={handleCopyAll} style={S.ghostBtn}>
                {copied === "all" ? "✓ Copied All!" : "Copy All Formats"}
              </button>
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setActiveTab(p.id)} style={{
                  ...S.toneBtn,
                  background: activeTab === p.id ? p.bg : "transparent",
                  border: `1.5px solid ${activeTab === p.id ? p.color : "transparent"}`,
                  color: activeTab === p.id ? p.color : "#6B7280",
                  fontWeight: activeTab === p.id ? 700 : 500,
                }}>
                  {p.icon} {p.label}
                  {analysis?.platformPrediction?.bestPlatform === p.id && " 🏆"}
                </button>
              ))}
            </div>

            {PLATFORMS.map(p => activeTab === p.id && (
              <div key={p.id} style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ padding: "4px 12px", background: p.color, color: "#FFF", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>
                      {p.icon} {p.label}
                    </span>
                    {analysis?.platformPrediction?.scores?.[p.id] != null && (
                      <span style={{ fontSize: "11px", color: "#6B7280" }}>
                        Score: {analysis.platformPrediction.scores[p.id]}/100
                      </span>
                    )}
                  </div>
                  <button onClick={() => handleCopy(p.id)} style={S.ghostBtn}>
                    {copied === p.id ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
                <pre style={S.pre}>{results[p.id] || "Not generated."}</pre>
                <div style={{ display: "flex", gap: "16px", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #F3F4F6" }}>
                  <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{(results[p.id] || "").split(/\s+/).length} words</span>
                  <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{(results[p.id] || "").length} chars</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #E5E7EB" }}>
          <p style={{ fontSize: "13px", color: "#9CA3AF" }}>Built by <strong style={{ color: "#374151" }}>Aneeket Kumar</strong> — NLP · LLM · Content AI</p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-20px) scale(1.05); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-20px,15px) scale(0.95); } }
        textarea:focus { outline: none; border-color: #1a1a2e !important; box-shadow: 0 0 0 3px rgba(26,26,46,0.08) !important; }
        button:hover { filter: brightness(0.95); }
        pre::-webkit-scrollbar { width: 6px; } pre::-webkit-scrollbar-track { background: transparent; } pre::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
      `}</style>
    </div>
  );
}