import React, { useState, useEffect } from 'react';

export default function TaskForm({ initial = { title: '', description: '' }, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState(null);

  useEffect(() => setForm(initial), [initial]);

  const submit = (e) => {
    e.preventDefault();
    setErr(null);
    if (!form.title || form.title.length < 3) {
      setErr('Title must be at least 3 characters.');
      return;
    }
    onSubmit(form);
    setForm({ title: '', description: '' });
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={submit} className="card p-3 mb-3">
      {err && <div className="alert alert-danger">{err}</div>}
      <div className="mb-2">
        <label className="form-label">Title</label>
        <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="mb-2">
        <label className="form-label">Description</label>
        <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">Save</button>
        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
