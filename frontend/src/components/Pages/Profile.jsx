import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { getUser, setUser } from '../../utils/auth';

export default function Profile() {
  const [profile, setProfile] = useState({ bio: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const user = getUser();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/profile/');
        setProfile({ bio: res.data.bio || '', location: res.data.location || '' });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch('/profile/', profile);
      setMsg('Profile updated.');
      // update cached user info if backend returns user
      if (res.data.user) setUser(res.data.user);
    } catch (e) {
      setMsg('Update failed.');
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div className="card p-4">
      <h4>Profile</h4>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className="form-control" value={user?.username || ''} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea className="form-control" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input className="form-control" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} />
        </div>
        <button className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}
