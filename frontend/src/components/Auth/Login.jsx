import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { setTokens, setUser } from '../../utils/auth';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!form.username || !form.password) {
      setErr('Please fill username and password.');
      return;
    }

    try {
      const res = await api.post('/auth/login/', {
        username: form.username,
        password: form.password
      });
      const { access, refresh } = res.data;
      setTokens({ access, refresh });

      // fetch profile (user info) from backend / using profile endpoint
      const p = await api.get('/profile/');
      const user = p.data.user || { username: form.username, email: '' };
      setUser(user);

      navigate('/dashboard');
    } catch (e) {
      setErr('Invalid credentials or server error.');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6">
        <h3>Login</h3>
        <form onSubmit={submit} className="card p-4">
          {err && <div className="alert alert-danger">{err}</div>}

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input name="username" value={form.username} onChange={onChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" value={form.password} onChange={onChange} className="form-control" />
          </div>

          <button className="btn btn-primary w-100" type="submit">Login</button>
          <div className="mt-3 text-center">
            <small>Don't have an account? <Link to="/register">Register</Link></small>
          </div>
        </form>
      </div>
    </div>
  );
}
