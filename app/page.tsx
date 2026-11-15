 "use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp, CalendarDays, Check, CheckCircle2, Circle, Clock3,
  LayoutDashboard, ListTodo, Plus, Search, Target, Trash2, X
} from "lucide-react";

type Status = "Not started" | "In progress" | "Completed";
type Priority = "Low" | "Medium" | "High";
type Task = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: Status;
  priority: Priority;
  progress: number;
  createdAt: number;
};

const STORAGE_KEY = "taskflow.tasks.v1";
const today = () => new Date().toISOString().slice(0, 10);
const blankTask = {
  title: "", description: "", startDate: today(), dueDate: "",
  status: "Not started" as Status, priority: "Medium" as Priority, progress: 0
};

function dateLabel(value: string) {
  if (!value) return "No due date";
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    day: "numeric", month: "short", year: "numeric"
  });
}
function isOverdue(task: Task) {
  return task.status !== "Completed" && !!task.dueDate && task.dueDate < today();
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(blankTask);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("due");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(JSON.parse(saved) as Task[]);
    } catch {
      setNotice("Could not load saved tasks from this browser.");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

  const completed = tasks.filter(t => t.status === "Completed").length;
  const active = tasks.filter(t => t.status === "In progress").length;
  const overdue = tasks.filter(isOverdue).length;
  const overall = tasks.length ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length) : 0;

  const visibleTasks = useMemo(() => {
    const result = tasks.filter(task => {
      const matchesQuery = `${task.title} ${task.description}`.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "All" || (filter === "Overdue" ? isOverdue(task) : task.status === filter);
      return matchesQuery && matchesFilter;
    });
    return result.sort((a, b) => {
      if (sort === "priority") return ({ High: 0, Medium: 1, Low: 2 }[a.priority] - ({ High: 0, Medium: 1, Low: 2 }[b.priority]));
      if (sort === "created") return b.createdAt - a.createdAt;
      return (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
    });
  }, [tasks, filter, query, sort]);

  function openNew() {
    setEditingId(null);
    setDraft(blankTask);
    setShowForm(true);
  }
  function openEdit(task: Task) {
    setEditingId(task.id);
    setDraft({
      title: task.title, description: task.description, startDate: task.startDate,
      dueDate: task.dueDate, status: task.status, priority: task.priority, progress: task.progress
    });
    setShowForm(true);
  }
  function saveTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.title.trim();
    if (!title) return;
    const progress = draft.status === "Completed" ? 100 : Math.max(0, Math.min(100, Number(draft.progress)));
    if (editingId) {
      setTasks(current => current.map(t => t.id === editingId ? { ...t, ...draft, title, progress } : t));
    } else {
      setTasks(current => [{ ...draft, title, progress, id: crypto.randomUUID(), createdAt: Date.now() }, ...current]);
    }
    setShowForm(false);
    setNotice(editingId ? "Task updated." : "Task created.");
    window.setTimeout(() => setNotice(""), 2500);
  }
  function removeTask(id: string) {
    if (window.confirm("Delete this task? This cannot be undone.")) {
      setTasks(current => current.filter(t => t.id !== id));
    }
  }
  function updateProgress(task: Task, value: number) {
    const progress = Math.max(0, Math.min(100, value));
    const status: Status = progress === 100 ? "Completed" : progress > 0 ? "In progress" : "Not started";
    setTasks(current => current.map(t => t.id === task.id ? { ...t, progress, status } : t));
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Target size={20}/></span><span>taskflow</span></div>
        <div className="side-label">WORKSPACE</div>
        <button className="nav-item selected"><LayoutDashboard size={17}/> Overview</button>
        <button className="nav-item" onClick={() => setFilter("All")}><ListTodo size={17}/> All tasks <span className="nav-count">{tasks.length}</span></button>
        <div className="side-label second">VIEWS</div>
        {["In progress", "Completed", "Overdue"].map(item => (
          <button key={item} className={`nav-item ${filter === item ? "selected" : ""}`} onClick={() => setFilter(item)}>
            {item === "Completed" ? <CheckCircle2 size={17}/> : item === "Overdue" ? <Clock3 size={17}/> : <Circle size={17}/>}
            {item}
          </button>
        ))}
        <div className="sidebar-bottom">
          <div className="tip-icon"><Target size={18}/></div>
          <strong>Make progress visible.</strong>
          <p>Small steps add up. Keep your next action clear.</p>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div><div className="eyebrow">YOUR WORKSPACE</div><div className="today-line">{new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</div></div>
          <button className="primary-button" onClick={openNew}><Plus size={17}/> New task</button>
        </header>

        <div className="content">
          <div className="welcome">
            <div><div className="eyebrow">OVERVIEW</div><h1>Good work starts<br/>with a clear plan.</h1><p>Keep your priorities in view and move forward, one task at a time.</p></div>
            <div className="welcome-art"><div className="art-circle"><Check size={34}/></div><span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✦</span></div>
          </div>

          <div className="stats-grid">
            <Stat label="Total tasks" value={tasks.length} detail="Across your workspace" icon={<ListTodo size={18}/>} />
            <Stat label="In progress" value={active} detail="Currently being worked on" icon={<Clock3 size={18}/>} />
            <Stat label="Completed" value={completed} detail="Tasks finished" icon={<CheckCircle2 size={18}/>} />
            <Stat label="Overdue" value={overdue} detail="Need your attention" icon={<CalendarDays size={18}/>} />
          </div>

          <section className="progress-card">
            <div className="progress-heading"><div><div className="eyebrow">YOUR MOMENTUM</div><h2>Overall progress</h2></div><div className="progress-number">{overall}<span>%</span></div></div>
            <div className="progress-track"><div className="progress-fill" style={{width: `${overall}%`}}/></div>
            <div className="progress-foot"><span>{completed} of {tasks.length} tasks completed</span><span>{tasks.length ? "Keep it moving" : "Add a task to get started"}</span></div>
          </section>

          <section className="tasks-section">
            <div className="section-heading"><div><div className="eyebrow">YOUR LIST</div><h2>Tasks</h2></div><button className="text-button" onClick={openNew}><Plus size={16}/> Add task</button></div>
            <div className="toolbar">
              <div className="search-box"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tasks..." /></div>
              <div className="sort-box"><ArrowDownUp size={15}/><select value={sort} onChange={e => setSort(e.target.value)}><option value="due">Due date</option><option value="priority">Priority</option><option value="created">Recently added</option></select></div>
            </div>
            <div className="filter-pills">
              {["All", "Not started", "In progress", "Completed", "Overdue"].map(item => <button key={item} onClick={() => setFilter(item)} className={filter === item ? "active" : ""}>{item}</button>)}
            </div>
            <div className="task-list">
              {!loaded ? <div className="empty-state">Loading your tasks…</div> : visibleTasks.length === 0 ? (
                <div className="empty-state"><div className="empty-icon"><CheckCircle2 size={25}/></div><strong>{tasks.length ? "No tasks match this view" : "Your task list is clear"}</strong><p>{tasks.length ? "Try another filter or search term." : "Create your first task and give your plans a place to live."}</p>{!tasks.length && <button className="primary-button" onClick={openNew}><Plus size={16}/> Create first task</button>}</div>
              ) : visibleTasks.map(task => <TaskRow key={task.id} task={task} onEdit={() => openEdit(task)} onDelete={() => removeTask(task.id)} onProgress={v => updateProgress(task, v)}/>)}
            </div>
          </section>
          {notice && <div className="toast">{notice}</div>}
          <footer>Taskflow <span>·</span> Simple plans. Steady progress.</footer>
        </div>
      </section>

      {showForm && <div className="modal-backdrop" onMouseDown={e => {if (e.target === e.currentTarget) setShowForm(false);}}>
        <form className="task-modal" onSubmit={saveTask}>
          <div className="modal-heading"><div><div className="eyebrow">{editingId ? "UPDATE TASK" : "NEW TASK"}</div><h2>{editingId ? "Edit task" : "Create a task"}</h2></div><button type="button" className="icon-button" onClick={() => setShowForm(false)} aria-label="Close"><X size={19}/></button></div>
          <label>Task name<input autoFocus required maxLength={100} placeholder="What needs to get done?" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})}/></label>
          <label>Description <span className="optional">· optional</span><textarea rows={3} placeholder="Add a few details..." value={draft.description} onChange={e => setDraft({...draft, description: e.target.value})}/></label>
          <div className="form-grid">
            <label>Start date<input type="date" value={draft.startDate} onChange={e => setDraft({...draft, startDate: e.target.value})}/></label>
            <label>Due date<input type="date" min={draft.startDate || undefined} value={draft.dueDate} onChange={e => setDraft({...draft, dueDate: e.target.value})}/></label>
            <label>Priority<select value={draft.priority} onChange={e => setDraft({...draft, priority: e.target.value as Priority})}><option>Low</option><option>Medium</option><option>High</option></select></label>
            <label>Status<select value={draft.status} onChange={e => setDraft({...draft, status: e.target.value as Status, progress: e.target.value === "Completed" ? 100 : e.target.value === "Not started" ? 0 : Math.max(1, draft.progress)})}><option>Not started</option><option>In progress</option><option>Completed</option></select></label>
          </div>
          <label className="range-label">Progress <strong>{draft.status === "Completed" ? 100 : draft.progress}%</strong><input type="range" min="0" max="100" value={draft.status === "Completed" ? 100 : draft.progress} onChange={e => setDraft({...draft, progress: Number(e.target.value), status: Number(e.target.value) === 100 ? "Completed" : Number(e.target.value) > 0 ? "In progress" : "Not started"})}/></label>
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button" type="submit">{editingId ? "Save changes" : "Create task"}</button></div>
        </form>
      </div>}
    </main>
  );
}

function Stat({label, value, detail, icon}: {label:string; value:number; detail:string; icon:React.ReactNode}) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></div>;
}
function TaskRow({task, onEdit, onDelete, onProgress}: {task:Task; onEdit:()=>void; onDelete:()=>void; onProgress:(v:number)=>void}) {
  return <article className="task-row">
    <button className={`task-check ${task.status === "Completed" ? "done" : ""}`} onClick={() => onProgress(task.status === "Completed" ? 0 : 100)} aria-label={task.status === "Completed" ? "Mark as not completed" : "Mark as completed"}>{task.status === "Completed" && <Check size={14}/>}</button>
    <div className="task-main">
      <button className={`task-title ${task.status === "Completed" ? "struck" : ""}`} onClick={onEdit}>{task.title}</button>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-meta"><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span><span><CalendarDays size={13}/> {dateLabel(task.dueDate)}</span>{task.startDate && <span className="start-date">Starts {dateLabel(task.startDate)}</span>}{isOverdue(task) && <span className="overdue-label">Overdue</span>}</div>
      <div className="row-progress"><div className="mini-track"><div style={{width:`${task.progress}%`}}/></div><span>{task.progress}%</span></div>
    </div>
    <div className="task-actions"><button className="icon-button" onClick={onEdit} aria-label="Edit task"><span className="edit-word">Edit</span></button><button className="icon-button delete" onClick={onDelete} aria-label="Delete task"><Trash2 size={16}/></button></div>
  </article>;
}
