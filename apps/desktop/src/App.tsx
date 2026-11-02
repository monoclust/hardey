import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Check, Circle, Languages, Minus, Plus, RefreshCw, Sparkles, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import FloatingOrb from "./FloatingOrb";

type Task = {
  id: number; title: string; description: string; priority: string; status: string;
  domain: string; due_at: string | null; created_at: string; completed_at: string | null;
};

const API = "http://127.0.0.1:8765";
const copy = {
  en: { hello: "Hello! I'm Hardey.", subtitle: "Your personal execution companion", today: "TODAY'S FOCUS", next: "NEXT PRIORITY", tasks: "Your tasks", add: "Add a task", placeholder: "What needs to get done?", create: "Create task", empty: "Nothing on your list yet. Add your first task.", done: "Mark complete", active: "Active", completed: "Completed", offline: "Backend not connected", online: "Local system connected", language: "Language", priority: "Priority", domain: "Area" },
  hi: { hello: "नमस्ते! मैं Hardey हूँ।", subtitle: "आपकी व्यक्तिगत कार्य सहयोगी", today: "आज का फोकस", next: "अगली प्राथमिकता", tasks: "आपके कार्य", add: "नया कार्य जोड़ें", placeholder: "आज क्या पूरा करना है?", create: "कार्य बनाएँ", empty: "अभी कोई कार्य नहीं है। पहला कार्य जोड़ें।", done: "पूरा करें", active: "बाकी कार्य", completed: "पूरे हुए", offline: "बैकएंड कनेक्ट नहीं है", online: "लोकल सिस्टम कनेक्टेड है", language: "भाषा", priority: "प्राथमिकता", domain: "क्षेत्र" },
};

function WorkspaceApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [domain, setDomain] = useState("professional");
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [connected, setConnected] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const t = copy[language];

  const loadTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/tasks`);
      if (!response.ok) throw new Error("API unavailable");
      setTasks(await response.json());
      setConnected(true);
      setError("");
    } catch {
      setConnected(false);
      setError("Start the local Python backend to load and save tasks.");
    }
  }, []);

  useEffect(() => { void loadTasks(); }, [loadTasks]);

  const activeTasks = useMemo(() => tasks.filter((task) => !["completed", "cancelled"].includes(task.status)), [tasks]);
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const nextTask = [...activeTasks].sort((a, b) => {
    const rank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return (rank[a.priority] ?? 4) - (rank[b.priority] ?? 4);
  })[0];

  async function createTask(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const response = await fetch(`${API}/api/tasks`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), priority, domain }),
      });
      if (!response.ok) throw new Error("Could not save task");
      setTitle(""); setShowForm(false); await loadTasks();
    } catch { setError("Task could not be saved. Check that the backend is running."); }
  }

  async function completeTask(task: Task) {
    try {
      const response = await fetch(`${API}/api/tasks/${task.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: task.status === "completed" ? "planned" : "completed" }),
      });
      if (!response.ok) throw new Error("Update failed");
      await loadTasks();
    } catch { setError("Could not update this task."); }
  }

  return <main className="shell">
    <header className="topbar">
      <div className="brand"><span className="brand-mark"><Sparkles size={17}/></span><span>HARDEY</span><small>THE FLOATING LADY</small></div>
      <div className="top-actions">
        <span className={`connection ${connected ? "online" : "offline"}`}><i />{connected ? t.online : t.offline}</span>
        <button className="icon-button" title={t.language} onClick={() => setLanguage(language === "en" ? "hi" : "en")}><Languages size={16}/><span>{language.toUpperCase()}</span></button>
        <button className="icon-button window-button" title="Minimize window" onClick={() => void getCurrentWindow().minimize()}><Minus size={16}/></button>
      </div>
    </header>

    <section className="hero">
      <div className="avatar-wrap" aria-label="Hardey stylized avatar placeholder">
        <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
        <div className="avatar-glow"/>
        <div className="avatar"><div className="hair-back"/><div className="neck"/><div className="face"><div className="hair-top"/><div className="fringe"/><div className="eye eye-left"/><div className="eye eye-right"/><div className="blush blush-left"/><div className="blush blush-right"/><div className="nose"/><div className="mouth"/></div><div className="body"><div className="collar"/><div className="body-mark">H</div></div>
        </div>
        <span className="avatar-status"/>
      </div>
      <div className="greeting"><div className="eyebrow"><span/> PERSONAL ASSISTANT · READY</div><h1>{t.hello}</h1><p>{t.subtitle}. Let's keep your priorities moving.</p><div className="speech">“One step at a time. I'll help you stay accountable.”</div></div>
    </section>

    <section className="focus-card">
      <div className="focus-heading"><span className="section-label">{t.next}</span><span className="sparkle"><Sparkles size={14}/></span></div>
      {nextTask ? <><h2>{nextTask.title}</h2><div className="focus-meta"><span className={`priority p-${nextTask.priority}`}>{nextTask.priority}</span><span>{nextTask.domain}</span></div></> : <><h2>You're clear for now.</h2><p>Add a task and I'll help you choose what comes next.</p></>}
    </section>

    <section className="task-section">
      <div className="section-head"><div><span className="section-label">{t.today}</span><h2>{t.tasks}</h2></div><button className="add-button" onClick={() => setShowForm(!showForm)}>{showForm ? <X size={16}/> : <Plus size={16}/>} {t.add}</button></div>
      {showForm && <form className="task-form" onSubmit={createTask}><input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.placeholder} maxLength={240}/><div className="form-row"><label>{t.priority}<select value={priority} onChange={(e) => setPriority(e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></label><label>{t.domain}<select value={domain} onChange={(e) => setDomain(e.target.value)}><option value="professional">Professional</option><option value="techievo">Techievo</option><option value="tifes">TIFES</option><option value="learning">Learning</option><option value="personal">Personal</option></select></label><button className="create-button" type="submit">{t.create}</button></div></form>}
      {error && <div className="error-banner">{error}</div>}
      <div className="task-list">{tasks.length === 0 ? <div className="empty"><Circle size={22}/><p>{t.empty}</p></div> : tasks.map((task) => <article className={`task-row ${task.status === "completed" ? "is-done" : ""}`} key={task.id}><button className="check-button" aria-label={t.done} onClick={() => void completeTask(task)}>{task.status === "completed" ? <Check size={15}/> : <Circle size={17}/>}</button><div className="task-copy"><strong>{task.title}</strong><span>{task.domain} · {task.priority}</span></div><span className={`task-state ${task.status === "completed" ? "complete" : ""}`}>{task.status === "completed" ? t.completed : t.active}</span></article>)}</div>
      <div className="stats"><div><strong>{activeTasks.length}</strong><span>{t.active}</span></div><div><strong>{completedTasks.length}</strong><span>{t.completed}</span></div><button className="refresh" onClick={() => void loadTasks()} title="Refresh tasks"><RefreshCw size={15}/></button></div>
    </section>
    <footer><span>HARDEY v0.2 · SPRINT 2</span><span>LOCAL-FIRST · YOUR DATA STAYS ON THIS MAC</span></footer>
  </main>;
}


export default function App() {
  const label = getCurrentWindow().label;
  return label === "orb" ? <FloatingOrb /> : <WorkspaceApp />;
}
