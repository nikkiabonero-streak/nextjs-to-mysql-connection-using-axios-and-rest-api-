'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

const initialUserState = { name: '', email: '' };

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState(initialUserState);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {

      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users. Check your API and DB connection.');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      alert("Please enter a valid email address (must contain @ and a domain, e.g., name@example.com).");
      return;
    }
    
    try {

      await axios.post('/api/users', newUser);
      setNewUser(initialUserState);
      fetchUsers();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to add user.';
      alert(`Error: ${message}`);
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {

      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Error deleting user.');
      console.error(err);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingUser.email)) {
      alert("Please enter a valid email address (must contain @ and a domain, e.g., name@example.com).");
      return;
    }

    try {

      await axios.put(`/api/users/${editingUser.id}`, {
        name: editingUser.name,
        email: editingUser.email,
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update user.';
      alert(`Error: ${message}`);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Next.js to MySQL CRUD w/ REST API and Axios Demo</h1>
      
      {/* Add user */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <h2>Input User</h2>
        <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '3px', flexGrow: 1 }}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '3px', flexGrow: 1 }}
          />
          <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            Add User
          </button>
        </form>
      </div>

      <hr style={{ margin: '20px 0' }} />

      {/* User List */}
      <h2>User List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {isLoading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>Empty List. Add one above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((user) => (
            <li key={user.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', alignItems: 'center', backgroundColor: editingUser?.id === user.id ? '#fff0b3' : 'white' }}>
              {editingUser?.id === user.id ? (
                
                <form onSubmit={handleEditUser} style={{ display: 'flex', gap: '10px', flexGrow: 1 }}>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    required
                    style={{ padding: '8px', border: '1px solid #0070f3', borderRadius: '3px', flexGrow: 1 }}
                  />
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    required
                    style={{ padding: '8px', border: '1px solid #0070f3', borderRadius: '3px', flexGrow: 1 }}
                  />
                  <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingUser(null)} style={{ padding: '8px 15px', backgroundColor: '#94a3b8', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </form>
              ) : (
                
                <>
                  <span style={{ fontWeight: 'bold' }}>
                    {user.name}
                  </span>
                  <span>
                    ({user.email})
                  </span>
                  <div>
                    <button onClick={() => setEditingUser(user)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}