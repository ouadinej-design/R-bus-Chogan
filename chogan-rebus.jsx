import { useState, useEffect, useRef } from "react";

const CHOGAN_COLORS = {
  darkGreen: "#0d3826",
  medGreen: "#1a5c3a",
  lightGreen: "#2a7a50",
  gold: "#c9a84c",
  goldLight: "#e8c97a",
  cream: "#f5ecd7",
  white: "#ffffff",
  overlay: "rgba(13,56,38,0.85)",
};

const defaultQuestions = [
  { id: 1, label: "Concentration 30% - Essence de Parfum", points: 10, answer: "Essence de Parfum", hint: "Concentration entre EDP et Parfum", image: null },
  { id: 2, label: "Extrait de Parfum", points: 15, answer: "Extrait de Parfum", hint: "La concentration la plus haute", image: null },
  { id: 3, label: "Huile de Pur Arbre à Thé (Tea Tree)", points: 10, answer: "Huile Tea Tree", hint: "Produit naturel aux vertus purifiantes", image: null },
  { id: 4, label: "Huile de Monoï Tahitien", points: 20, answer: "Huile Monoï", hint: "Originaire de Polynésie", image: null },
  { id: 5, label: "Extrait de Parfum 35ml", points: 25, answer: "Extrait 35ml", hint: "Format collector exclusif", image: null },
];

const defaultConsultants = [
  { id: 1, name: "Marie", score: 0, color: "#e8c97a" },
  { id: 2, name: "Sophie", score: 0, color: "#7ecba1" },
  { id: 3, name: "Léa", score: 0, color: "#e87a7a" },
];

/* ─── small helpers ─── */
const Star = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={CHOGAN_COLORS.gold}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const ChoganLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: 40, height: 40,
      background: `linear-gradient(135deg, ${CHOGAN_COLORS.gold}, ${CHOGAN_COLORS.goldLight})`,
      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 18, fontWeight: 900, color: CHOGAN_COLORS.darkGreen, fontFamily: "serif",
      boxShadow: `0 0 12px ${CHOGAN_COLORS.gold}66`
    }}>✿</div>
    <span style={{
      fontFamily: "'Playfair Display', serif", fontSize: 22,
      fontWeight: 700, letterSpacing: 4, color: CHOGAN_COLORS.gold,
      textShadow: `0 0 20px ${CHOGAN_COLORS.gold}44`
    }}>CHOGAN</span>
  </div>
);

/* ─── SETUP SCREEN ─── */
function SetupScreen({ onStart }) {
  const [consultants, setConsultants] = useState(defaultConsultants);
  const [questions, setQuestions] = useState(defaultQuestions);
  const [newName, setNewName] = useState("");
  const [tab, setTab] = useState("consultants");
  const [editQ, setEditQ] = useState(null);
  const colors = ["#e8c97a", "#7ecba1", "#e87a7a", "#87c8e8", "#c87ae8"];

  const addConsultant = () => {
    if (!newName.trim() || consultants.length >= 5) return;
    setConsultants(c => [...c, { id: Date.now(), name: newName.trim(), score: 0, color: colors[c.length % colors.length] }]);
    setNewName("");
  };

  const removeConsultant = (id) => setConsultants(c => c.filter(x => x.id !== id));

  const updateQuestion = (id, field, value) => {
    setQuestions(q => q.map(x => x.id === id ? { ...x, [field]: field === "points" ? parseInt(value) || 0 : value } : x));
  };

  const addQuestion = () => {
    setQuestions(q => [...q, { id: Date.now(), label: "Nouvelle question", points: 10, answer: "", hint: "", image: null }]);
  };

  const removeQuestion = (id) => setQuestions(q => q.filter(x => x.id !== id));

  const inputStyle = {
    background: "rgba(255,255,255,0.08)", border: `1px solid ${CHOGAN_COLORS.gold}44`,
    borderRadius: 8, padding: "8px 12px", color: CHOGAN_COLORS.cream,
    fontFamily: "inherit", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box"
  };

  const btnStyle = (active) => ({
    padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer",
    fontFamily: "inherit", fontSize: 14, fontWeight: 600,
    background: active ? `linear-gradient(135deg, ${CHOGAN_COLORS.gold}, ${CHOGAN_COLORS.goldLight})` : "rgba(255,255,255,0.08)",
    color: active ? CHOGAN_COLORS.darkGreen : CHOGAN_COLORS.cream,
    transition: "all 0.2s"
  });

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(160deg, ${CHOGAN_COLORS.darkGreen} 0%, #0a2a1c 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Lato', sans-serif", padding: 24
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(245,236,215,0.4); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${CHOGAN_COLORS.gold}44; border-radius: 4px; }
      `}</style>

      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <ChoganLogo />
        <h1 style={{ color: CHOGAN_COLORS.cream, fontFamily: "'Playfair Display', serif", fontSize: 36, margin: "12px 0 4px", letterSpacing: 6 }}>RÉBUS</h1>
        <p style={{ color: `${CHOGAN_COLORS.gold}aa`, fontSize: 13, letterSpacing: 2 }}>CONFIGURATION DU JEU</p>
      </div>

      <div style={{ width: "100%", maxWidth: 680, background: "rgba(255,255,255,0.04)", borderRadius: 16, border: `1px solid ${CHOGAN_COLORS.gold}22`, overflow: "hidden" }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${CHOGAN_COLORS.gold}22` }}>
          {["consultants", "questions"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "16px", border: "none", cursor: "pointer", fontFamily: "inherit",
              fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
              background: tab === t ? `${CHOGAN_COLORS.gold}18` : "transparent",
              color: tab === t ? CHOGAN_COLORS.gold : `${CHOGAN_COLORS.cream}66`,
              borderBottom: tab === t ? `2px solid ${CHOGAN_COLORS.gold}` : "2px solid transparent",
              transition: "all 0.2s"
            }}>
              {t === "consultants" ? `👥 Consultantes (${consultants.length})` : `📋 Questions (${questions.length})`}
            </button>
          ))}
        </div>

        <div style={{ padding: 24, maxHeight: 420, overflowY: "auto" }}>
          {tab === "consultants" && (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addConsultant()}
                  placeholder="Nom de la consultante..." style={inputStyle} />
                <button onClick={addConsultant} style={{ ...btnStyle(true), whiteSpace: "nowrap", padding: "8px 16px" }}>+ Ajouter</button>
              </div>
              {consultants.map((c, i) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, marginBottom: 8, border: `1px solid ${c.color}22` }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 700, fontSize: 14 }}>{c.name[0]}</div>
                  <input value={c.name} onChange={e => setConsultants(prev => prev.map(x => x.id === c.id ? { ...x, name: e.target.value } : x))}
                    style={{ ...inputStyle, width: "auto", flex: 1 }} />
                  <button onClick={() => removeConsultant(c.id)} style={{ background: "rgba(255,80,80,0.15)", border: "none", color: "#e87a7a", cursor: "pointer", borderRadius: 6, padding: "6px 10px", fontFamily: "inherit" }}>✕</button>
                </div>
              ))}
              {consultants.length === 0 && <p style={{ color: `${CHOGAN_COLORS.cream}44`, textAlign: "center", fontSize: 13 }}>Aucune consultante ajoutée</p>}
            </div>
          )}

          {tab === "questions" && (
            <div>
              {questions.map((q, i) => (
                <div key={q.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 14, marginBottom: 12, border: `1px solid ${CHOGAN_COLORS.gold}22` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ color: CHOGAN_COLORS.gold, fontWeight: 700, fontSize: 13 }}>QUESTION {i + 1}</span>
                    <button onClick={() => removeQuestion(q.id)} style={{ background: "rgba(255,80,80,0.15)", border: "none", color: "#e87a7a", cursor: "pointer", borderRadius: 6, padding: "4px 8px", fontFamily: "inherit", fontSize: 12 }}>Supprimer</button>
                  </div>
                  <div style={{ display: "grid", gap: 8 }}>
                    <input value={q.label} onChange={e => updateQuestion(q.id, "label", e.target.value)} placeholder="Intitulé de la question..." style={inputStyle} />
                    <input value={q.answer} onChange={e => updateQuestion(q.id, "answer", e.target.value)} placeholder="Réponse attendue..." style={inputStyle} />
                    <input value={q.hint} onChange={e => updateQuestion(q.id, "hint", e.target.value)} placeholder="Indice (optionnel)..." style={inputStyle} />
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: CHOGAN_COLORS.cream, fontSize: 13, opacity: 0.7 }}>Points :</span>
                      <input type="number" value={q.points} onChange={e => updateQuestion(q.id, "points", e.target.value)} style={{ ...inputStyle, width: 80 }} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addQuestion} style={{ ...btnStyle(false), width: "100%", marginTop: 4 }}>+ Ajouter une question</button>
            </div>
          )}
        </div>

        <div style={{ padding: "20px 24px", borderTop: `1px solid ${CHOGAN_COLORS.gold}22`, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => onStart(consultants, questions)}
            disabled={consultants.length === 0 || questions.length === 0}
            style={{
              padding: "14px 40px", borderRadius: 10, border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: 15, fontWeight: 700, letterSpacing: 3,
              background: `linear-gradient(135deg, ${CHOGAN_COLORS.gold}, ${CHOGAN_COLORS.goldLight})`,
              color: CHOGAN_COLORS.darkGreen, boxShadow: `0 4px 20px ${CHOGAN_COLORS.gold}44`,
              opacity: consultants.length === 0 || questions.length === 0 ? 0.5 : 1,
              textTransform: "uppercase"
            }}>
            🎮 LANCER LE JEU
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── GAME SCREEN ─── */
function GameScreen({ consultants: initConsultants, questions, onReset }) {
  const [consultants, setConsultants] = useState(initConsultants.map(c => ({ ...c, score: 0 })));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState([]);
  const [phase, setPhase] = useState("question"); // question | validate | done
  const [pendingAnswer, setPendingAnswer] = useState("");
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const [showFinal, setShowFinal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef();

  const currentQ = questions[currentIdx];
  const isLastQ = currentIdx === questions.length - 1;

  const awardPoints = (consultantId, points) => {
    setConsultants(prev => prev.map(c => c.id === consultantId ? { ...c, score: c.score + points } : c));
    setFlashId(consultantId);
    setTimeout(() => setFlashId(null), 1000);
    const key = `${currentIdx}`;
    setAnswers(prev => ({ ...prev, [key]: { consultantId, correct: true, points } }));
    setRevealed(prev => [...prev, currentIdx]);
    setPhase("validate");
  };

  const skipQuestion = () => {
    setRevealed(prev => [...prev, currentIdx]);
    setPhase("validate");
  };

  const nextQuestion = () => {
    if (isLastQ) { setShowFinal(true); return; }
    setCurrentIdx(i => i + 1);
    setPendingAnswer("");
    setSelectedConsultant(null);
    setPhase("question");
    setImagePreview(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const sortedConsultants = [...consultants].sort((a, b) => b.score - a.score);
  const winner = sortedConsultants[0];

  const inputStyle = {
    background: "rgba(255,255,255,0.08)", border: `1px solid ${CHOGAN_COLORS.gold}44`,
    borderRadius: 8, padding: "10px 14px", color: CHOGAN_COLORS.cream,
    fontFamily: "inherit", fontSize: 15, outline: "none", flex: 1,
  };

  if (showFinal) return <FinalScreen consultants={sortedConsultants} onReset={onReset} />;

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(160deg, ${CHOGAN_COLORS.darkGreen} 0%, #0a2a1c 100%)`,
      fontFamily: "'Lato', sans-serif", display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;700&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes flash { 0%,100% { transform:scale(1); } 50% { transform:scale(1.08); background: ${CHOGAN_COLORS.gold}44; } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 ${CHOGAN_COLORS.gold}44; } 50% { box-shadow: 0 0 0 10px ${CHOGAN_COLORS.gold}00; } }
        @keyframes glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        input::placeholder { color: rgba(245,236,215,0.35); }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: `1px solid ${CHOGAN_COLORS.gold}22`,
        background: "rgba(0,0,0,0.2)"
      }}>
        <ChoganLogo />
        <h1 style={{ color: CHOGAN_COLORS.gold, fontFamily: "'Playfair Display', serif", fontSize: 32, margin: 0, letterSpacing: 8, textShadow: `0 0 30px ${CHOGAN_COLORS.gold}55` }}>RÉBUS</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onReset} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${CHOGAN_COLORS.gold}33`, color: CHOGAN_COLORS.cream, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>⚙ Config</button>
          <button onClick={() => setShowFinal(true)} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${CHOGAN_COLORS.gold}33`, color: CHOGAN_COLORS.cream, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>🏆 Scores finaux</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "300px 1fr 260px", gap: 0, overflow: "hidden" }}>

        {/* LEFT — Question list */}
        <div style={{ padding: "24px 16px 24px 24px", borderRight: `1px solid ${CHOGAN_COLORS.gold}18`, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {questions.map((q, i) => {
            const done = revealed.includes(i);
            const active = i === currentIdx;
            const winner_c = done && answers[`${i}`] ? consultants.find(c => c.id === answers[`${i}`]?.consultantId) : null;
            return (
              <div key={q.id} onClick={() => { setCurrentIdx(i); setPhase(done ? "validate" : "question"); setImagePreview(null); }}
                style={{
                  padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                  background: active ? `linear-gradient(135deg, ${CHOGAN_COLORS.gold}22, ${CHOGAN_COLORS.gold}08)` : done ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${active ? CHOGAN_COLORS.gold + "66" : done ? CHOGAN_COLORS.gold + "18" : "transparent"}`,
                  animation: active ? "fadeIn 0.3s ease" : "none",
                  transition: "all 0.2s", opacity: done && !active ? 0.65 : 1,
                }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: active ? `linear-gradient(135deg, ${CHOGAN_COLORS.gold}, ${CHOGAN_COLORS.goldLight})` : done ? `${CHOGAN_COLORS.gold}33` : "rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: active ? CHOGAN_COLORS.darkGreen : done ? CHOGAN_COLORS.gold : CHOGAN_COLORS.cream,
                    fontWeight: 900, fontSize: 13
                  }}>{done ? "✓" : i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: active ? CHOGAN_COLORS.gold : done ? `${CHOGAN_COLORS.cream}88` : CHOGAN_COLORS.cream, fontSize: 12, fontWeight: 700, lineHeight: 1.3, marginBottom: 3 }}>
                      {done ? q.label : `Question ${i + 1}`}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: `${CHOGAN_COLORS.gold}aa` }}>{q.points} pts</span>
                      {winner_c && <span style={{ fontSize: 10, color: winner_c.color, fontWeight: 700 }}>✓ {winner_c.name}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER — Current question */}
        <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Question header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: `${CHOGAN_COLORS.gold}99`, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
                Question {currentIdx + 1} / {questions.length}
              </div>
              <h2 style={{ color: CHOGAN_COLORS.cream, fontFamily: "'Playfair Display', serif", fontSize: 22, margin: 0 }}>
                {phase === "question" ? "🔍 Devinez le produit !" : currentQ.label}
              </h2>
            </div>
            <div style={{
              background: `linear-gradient(135deg, ${CHOGAN_COLORS.gold}22, ${CHOGAN_COLORS.gold}44)`,
              border: `1px solid ${CHOGAN_COLORS.gold}55`, borderRadius: 10,
              padding: "10px 20px", textAlign: "center"
            }}>
              <div style={{ color: CHOGAN_COLORS.gold, fontSize: 24, fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>{currentQ.points}</div>
              <div style={{ color: `${CHOGAN_COLORS.gold}88`, fontSize: 10, letterSpacing: 2 }}>POINTS</div>
            </div>
          </div>

          {/* Product image area */}
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 16,
            border: `1px solid ${CHOGAN_COLORS.gold}18`, display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden", minHeight: 220, maxHeight: 300,
          }}>
            {imagePreview ? (
              <img src={imagePreview} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", filter: phase === "question" ? "blur(14px) brightness(0.7)" : "none", transition: "filter 0.8s ease" }} alt="produit" />
            ) : (
              <div style={{ textAlign: "center", padding: 32 }}>
                <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>🧴</div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                <button onClick={() => fileRef.current.click()} style={{
                  background: `${CHOGAN_COLORS.gold}18`, border: `1px dashed ${CHOGAN_COLORS.gold}44`,
                  color: `${CHOGAN_COLORS.gold}aa`, cursor: "pointer", borderRadius: 8, padding: "10px 20px",
                  fontFamily: "inherit", fontSize: 13
                }}>📷 Ajouter une image produit</button>
              </div>
            )}
            {imagePreview && phase === "question" && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ background: "rgba(13,56,38,0.6)", backdropFilter: "blur(2px)", borderRadius: 12, padding: "12px 24px", border: `1px solid ${CHOGAN_COLORS.gold}33` }}>
                  <p style={{ color: CHOGAN_COLORS.gold, margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>IMAGE MASQUÉE</p>
                </div>
              </div>
            )}
            {imagePreview && (
              <button onClick={() => fileRef.current.click()} style={{
                position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.4)", border: `1px solid ${CHOGAN_COLORS.gold}33`,
                color: CHOGAN_COLORS.cream, cursor: "pointer", borderRadius: 6, padding: "4px 10px", fontFamily: "inherit", fontSize: 11
              }}>🔄</button>
            )}
          </div>

          {/* Hint */}
          {currentQ.hint && (
            <div style={{
              padding: "10px 16px", borderRadius: 8, background: `${CHOGAN_COLORS.gold}0d`,
              border: `1px solid ${CHOGAN_COLORS.gold}22`, display: "flex", gap: 10, alignItems: "center"
            }}>
              <span style={{ color: CHOGAN_COLORS.gold, fontSize: 16 }}>💡</span>
              <span style={{ color: `${CHOGAN_COLORS.cream}aa`, fontSize: 13 }}><strong style={{ color: CHOGAN_COLORS.gold }}>Indice :</strong> {currentQ.hint}</span>
            </div>
          )}

          {/* Answer section */}
          {phase === "question" && (
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 20, border: `1px solid ${CHOGAN_COLORS.gold}22` }}>
              <p style={{ color: `${CHOGAN_COLORS.gold}cc`, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, marginTop: 0 }}>
                ✏ Valider une réponse correcte
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                {consultants.map(c => (
                  <button key={c.id} onClick={() => setSelectedConsultant(c.id === selectedConsultant ? null : c.id)}
                    style={{
                      padding: "8px 16px", borderRadius: 20, border: `2px solid ${c.id === selectedConsultant ? c.color : c.color + "44"}`,
                      background: c.id === selectedConsultant ? c.color + "22" : "transparent",
                      color: c.id === selectedConsultant ? c.color : `${c.color}99`,
                      cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, transition: "all 0.15s"
                    }}>{c.name}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input value={pendingAnswer} onChange={e => setPendingAnswer(e.target.value)}
                  placeholder={`Réponse attendue : « ${currentQ.answer} »`}
                  style={inputStyle}
                  onKeyDown={e => e.key === "Enter" && selectedConsultant && awardPoints(selectedConsultant, currentQ.points)}
                />
                <button onClick={() => selectedConsultant && awardPoints(selectedConsultant, currentQ.points)}
                  disabled={!selectedConsultant}
                  style={{
                    padding: "10px 20px", borderRadius: 8, border: "none", cursor: selectedConsultant ? "pointer" : "not-allowed",
                    background: selectedConsultant ? `linear-gradient(135deg, ${CHOGAN_COLORS.gold}, ${CHOGAN_COLORS.goldLight})` : "rgba(255,255,255,0.08)",
                    color: selectedConsultant ? CHOGAN_COLORS.darkGreen : `${CHOGAN_COLORS.cream}44`,
                    fontFamily: "inherit", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap",
                    boxShadow: selectedConsultant ? `0 4px 16px ${CHOGAN_COLORS.gold}44` : "none", transition: "all 0.2s"
                  }}>✓ Valider</button>
                <button onClick={skipQuestion} style={{
                  padding: "10px 16px", borderRadius: 8, border: `1px solid rgba(255,80,80,0.3)`,
                  background: "rgba(255,80,80,0.08)", color: "#e87a7a", cursor: "pointer", fontFamily: "inherit", fontSize: 13, whiteSpace: "nowrap"
                }}>Passer ✗</button>
              </div>
            </div>
          )}

          {phase === "validate" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <div style={{
                padding: "14px 28px", borderRadius: 10, background: `${CHOGAN_COLORS.gold}15`,
                border: `1px solid ${CHOGAN_COLORS.gold}44`, textAlign: "center"
              }}>
                {answers[`${currentIdx}`] ? (
                  <>
                    <span style={{ fontSize: 20 }}>🎉</span>
                    <span style={{ color: CHOGAN_COLORS.gold, fontWeight: 700, fontSize: 15, marginLeft: 8 }}>
                      Réponse : <em>{currentQ.label}</em>
                    </span>
                    <span style={{ color: `${CHOGAN_COLORS.cream}99`, fontSize: 13, display: "block", marginTop: 4 }}>
                      +{currentQ.points} pts → {consultants.find(c => c.id === answers[`${currentIdx}`]?.consultantId)?.name}
                    </span>
                  </>
                ) : (
                  <span style={{ color: `${CHOGAN_COLORS.cream}88`, fontSize: 14 }}>❌ Question passée — Réponse : <strong style={{ color: CHOGAN_COLORS.cream }}>{currentQ.answer}</strong></span>
                )}
              </div>
              <button onClick={nextQuestion} style={{
                padding: "14px 40px", borderRadius: 10, border: "none", cursor: "pointer",
                background: `linear-gradient(135deg, ${CHOGAN_COLORS.gold}, ${CHOGAN_COLORS.goldLight})`,
                color: CHOGAN_COLORS.darkGreen, fontFamily: "inherit", fontWeight: 700, fontSize: 15,
                letterSpacing: 2, textTransform: "uppercase", boxShadow: `0 6px 20px ${CHOGAN_COLORS.gold}44`
              }}>
                {isLastQ ? "🏆 Résultats finaux" : "Question suivante →"}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — Scoreboard */}
        <div style={{ padding: "24px 24px 24px 16px", borderLeft: `1px solid ${CHOGAN_COLORS.gold}18`, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <p style={{ color: `${CHOGAN_COLORS.gold}99`, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 12px" }}>SCORES CONSULTANTES</p>
          </div>

          {[...consultants].sort((a, b) => b.score - a.score).map((c, i) => (
            <div key={c.id} style={{
              padding: "14px 16px", borderRadius: 12,
              background: flashId === c.id ? `${c.color}22` : "rgba(255,255,255,0.04)",
              border: `1px solid ${i === 0 && c.score > 0 ? c.color + "44" : CHOGAN_COLORS.gold + "15"}`,
              animation: flashId === c.id ? "flash 0.8s ease" : "none",
              transition: "background 0.3s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 16 }}>{i === 0 && c.score > 0 ? "👑" : i === 1 ? "🥈" : "🥉"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: c.color, fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    {Array.from({ length: Math.min(5, Math.floor(c.score / 10)) }).map((_, j) => <Star key={j} />)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: CHOGAN_COLORS.gold, fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{c.score}</div>
                  <div style={{ color: `${CHOGAN_COLORS.gold}66`, fontSize: 10 }}>pts</div>
                </div>
              </div>
              {/* Score bar */}
              <div style={{ marginTop: 10, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  width: `${Math.max(4, (c.score / Math.max(1, Math.max(...consultants.map(x => x.score)))) * 100)}%`,
                  background: c.color, transition: "width 0.5s ease"
                }} />
              </div>
            </div>
          ))}

          {/* Progress */}
          <div style={{ marginTop: "auto", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: `1px solid ${CHOGAN_COLORS.gold}15` }}>
            <p style={{ color: `${CHOGAN_COLORS.gold}88`, fontSize: 11, letterSpacing: 2, margin: "0 0 10px" }}>PROGRESSION</p>
            <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
              <div style={{
                height: "100%", borderRadius: 4,
                width: `${((revealed.length) / questions.length) * 100}%`,
                background: `linear-gradient(90deg, ${CHOGAN_COLORS.gold}, ${CHOGAN_COLORS.goldLight})`,
                transition: "width 0.4s ease"
              }} />
            </div>
            <p style={{ color: `${CHOGAN_COLORS.cream}66`, fontSize: 12, margin: "8px 0 0", textAlign: "right" }}>
              {revealed.length} / {questions.length} questions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── FINAL SCREEN ─── */
function FinalScreen({ consultants, onReset }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);
  const winner = consultants[0];

  return (
    <div style={{
      minHeight: "100vh", background: `radial-gradient(ellipse at center, #1a5c3a 0%, ${CHOGAN_COLORS.darkGreen} 60%, #050f08 100%)`,
      fontFamily: "'Lato', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:0.8} 50%{opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeUp 0.8s ease" }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🏆</div>
        <h1 style={{ color: CHOGAN_COLORS.gold, fontFamily: "'Playfair Display', serif", fontSize: 48, margin: "0 0 8px", textShadow: `0 0 40px ${CHOGAN_COLORS.gold}88` }}>
          FIN DU JEU
        </h1>
        <p style={{ color: `${CHOGAN_COLORS.cream}88`, fontSize: 16, letterSpacing: 4, textTransform: "uppercase" }}>
          Rébus Chogan — Résultats finaux
        </p>
      </div>

      {winner && winner.score > 0 && (
        <div style={{ textAlign: "center", marginBottom: 40, animation: "fadeUp 0.8s ease 0.2s both" }}>
          <div style={{
            display: "inline-block", padding: "24px 48px", borderRadius: 20,
            background: `linear-gradient(135deg, ${CHOGAN_COLORS.gold}22, ${CHOGAN_COLORS.gold}08)`,
            border: `2px solid ${CHOGAN_COLORS.gold}55`, boxShadow: `0 0 60px ${CHOGAN_COLORS.gold}22`
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>👑</div>
            <div style={{ color: CHOGAN_COLORS.gold, fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900 }}>{winner.name}</div>
            <div style={{ color: `${CHOGAN_COLORS.cream}88`, fontSize: 14, marginTop: 4 }}>GAGNANTE — {winner.score} points</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
        {consultants.map((c, i) => (
          <div key={c.id} style={{
            padding: "20px 28px", borderRadius: 16,
            background: i === 0 ? `${c.color}18` : "rgba(255,255,255,0.04)",
            border: `1px solid ${i === 0 ? c.color + "55" : CHOGAN_COLORS.gold + "18"}`,
            textAlign: "center", minWidth: 140,
            animation: `fadeUp 0.6s ease ${0.4 + i * 0.1}s both`
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
            <div style={{ color: c.color, fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{c.name}</div>
            <div style={{ color: CHOGAN_COLORS.gold, fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900 }}>{c.score}</div>
            <div style={{ color: `${CHOGAN_COLORS.cream}55`, fontSize: 12 }}>points</div>
          </div>
        ))}
      </div>

      <button onClick={onReset} style={{
        padding: "16px 48px", borderRadius: 12, border: "none", cursor: "pointer",
        background: `linear-gradient(135deg, ${CHOGAN_COLORS.gold}, ${CHOGAN_COLORS.goldLight})`,
        color: CHOGAN_COLORS.darkGreen, fontFamily: "inherit", fontSize: 16, fontWeight: 700,
        letterSpacing: 3, textTransform: "uppercase", boxShadow: `0 8px 24px ${CHOGAN_COLORS.gold}44`,
        animation: "fadeUp 0.6s ease 0.8s both"
      }}>
        🔄 NOUVELLE PARTIE
      </button>
    </div>
  );
}

/* ─── ROOT ─── */
export default function App() {
  const [phase, setPhase] = useState("setup");
  const [gameData, setGameData] = useState(null);

  const handleStart = (consultants, questions) => {
    setGameData({ consultants, questions });
    setPhase("game");
  };

  const handleReset = () => { setGameData(null); setPhase("setup"); };

  if (phase === "setup") return <SetupScreen onStart={handleStart} />;
  return <GameScreen consultants={gameData.consultants} questions={gameData.questions} onReset={handleReset} />;
}
