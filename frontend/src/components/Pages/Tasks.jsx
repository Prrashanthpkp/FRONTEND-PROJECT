import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import TaskForm from './TaskForm';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [filterCompleted, setFilterCompleted] = useState('all'); // all, done, pending

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks/');
      setTasks(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createTask = async (data) => {
    await api.post('/tasks/', data);
    await load();
  };

  const updateTask = async (id, data) => {
    await api.patch(`/tasks/${id}/`, data);
    setEditing(null);
    await load();
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}/`);
    await load();
  };

  const toggleComplete = async (task) => {
    await api.patch(`/tasks/${task.id}/`, { completed: !task.completed });
    await load();
  };

  const filtered = tasks.filter(t => {
    if (filterCompleted === 'done' && !t.completed) return false;
    if (filterCompleted === 'pending' && t.completed) return false;
    if (query && !t.title.toLowerCase().includes(query.toLowerCase()) && !t.description.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Tasks</h4>
        <div>
          <select className="form-select d-inline-block me-2" value={filterCompleted} onChange={e => setFilterCompleted(e.target.value)} style={{ width: 150 }}>
            <option value="all">All</option>
            <option value="done">Done</option>
            <option value="pending">Pending</option>
          </select>
          <input className="form-control d-inline-block" placeholder="Search..." style={{ width: 200 }} value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-5">
          <TaskForm onSubmit={createTask} initial={{ title: '', description: '' }} />
        </div>
        <div className="col-md-7">
          {loading ? <div>Loading...</div> :
            <ul className="list-group">
              {filtered.map(t => (
                <li key={t.id} className="list-group-item d-flex justify-content-between align-items-start">
                  <div style={{ flex: 1 }}>
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</strong>
                        <div className="small text-muted">{t.description}</div>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setEditing(t)}>Edit</button>
                        <button className={`btn btn-sm ${t.completed ? 'btn-success' : 'btn-outline-success'} me-2`} onClick={() => toggleComplete(t)}>
                          {t.completed ? 'Undo' : 'Done'}
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteTask(t.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {filtered.length === 0 && <li className="list-group-item">No tasks found.</li>}
            </ul>
          }
        </div>
      </div>

      {editing && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">Edit Task</h5><button className="btn-close" onClick={() => setEditing(null)} /></div>
              <div className="modal-body">
                <TaskForm initial={editing} onSubmit={(data) => updateTask(editing.id, data)} onCancel={() => setEditing(null)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
