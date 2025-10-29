import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!form.username || !form.password || !form.password2) {
      setErr('Please fill required fields.');
      return;
    }
    if (form.password !== form.password2) {
      setErr('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setErr('Password should be >= 6 chars.');
      return;
    }

    try {
      await api.post('/auth/register/', {
        username: form.username,
        email: form.email,
        password: form.password,
        password2: form.password2
      });
      setSuccess('Registration successful. You can login now.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (e) {
      setErr('Registration failed. Try different username/email.');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6">
        <h3>Register</h3>
        <form onSubmit={submit} className="card p-4">
          {err && <div className="alert alert-danger">{err}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="mb-3"><label className="form-label">Username</label><input name="username" value={form.username} onChange={onChange} className="form-control" /></div>
          <div className="mb-3"><label className="form-label">Email</label><input name="email" value={form.email} onChange={onChange} className="form-control" /></div>
          <div className="mb-3"><label className="form-label">Password</label><input type="password" name="password" value={form.password} onChange={onChange} className="form-control" /></div>
          <div className="mb-3"><label className="form-label">Confirm Password</label><input type="password" name="password2" value={form.password2} onChange={onChange} className="form-control" /></div>

          <button className="btn btn-success w-100" type="submit">Register</button>
          <div className="mt-3 text-center"><small>Have an account? <Link to="/login">Login</Link></small></div>
        </form>
      </div>
    </div>
  );
}
