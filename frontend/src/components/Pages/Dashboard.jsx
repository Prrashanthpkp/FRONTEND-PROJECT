import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { getUser } from '../../utils/auth';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const [recent, setRecent] = useState([]);
  const user = getUser();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/tasks/');
        const tasks = res.data;
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        setStats({ total, completed });
        setRecent(tasks.slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <>
      <h2>Welcome, {user?.username}</h2>
      <div className="row my-3">
        <div className="col-sm-6 col-lg-3">
          <div className="card p-3"><h5>Total Tasks</h5><h3>{stats.total}</h3></div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card p-3"><h5>Completed</h5><h3>{stats.completed}</h3></div>
        </div>
        <div className="col-12 mt-3">
          <div className="card p-3">
            <h5>Recent Tasks</h5>
            {recent.length === 0 ? <p>No tasks yet. <Link to="/tasks">Create one</Link></p> :
              <ul className="list-group">
                {recent.map(t => <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{t.title}</strong>
                    <div className="small text-muted">{t.description}</div>
                  </div>
                  <span className={`badge ${t.completed ? 'bg-success' : 'bg-secondary'}`}>{t.completed ? 'Done' : 'Pending'}</span>
                </li>)}
              </ul>
            }
          </div>
        </div>
      </div>
    </>
  );
}
