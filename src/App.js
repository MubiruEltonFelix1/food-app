/*
RandomUsersComponent.jsx
Beginner-friendly single-file React component that fetches 5 users from randomuser.me,
shows loading & error states, supports Refresh, and a simple user-details modal.

Setup (quick):
1) Create a new Vite React app (recommended):
   npm create vite@latest my-app -- --template react
   cd my-app
2) Install dependencies (optional: Tailwind for styling shown here):
   npm install
   # Tailwind (optional but recommended for the same look):
   npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p
   # then add Tailwind directives to ./src/index.css per Tailwind docs
3) Save this file as src/RandomUsersComponent.jsx and import it in src/App.jsx
   e.g. `import RandomUsers from './RandomUsersComponent';` and use <RandomUsers /> in App.
4) Run the app:
   npm run dev

Note: This file uses basic Tailwind classes for quick nice-looking UI. If you don't
use Tailwind, the component will still work but styles will be plain.
*/

import React, { useEffect, useState } from 'react';

export default function RandomUsers() {
  // state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultsCount, setResultsCount] = useState(5); // how many users to fetch
  const [selectedUser, setSelectedUser] = useState(null); // for simple modal/details

  // fetch function
  const fetchUsers = async (count = resultsCount) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsers(data.results || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users. Check your connection or API status.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helpers
  const refresh = () => fetchUsers();

  const changeCountAndFetch = (n) => {
    setResultsCount(n);
    fetchUsers(n);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Random Users</h1>

        <div className="flex items-center gap-3">
          <label className="text-sm">Count:</label>
          <select
            value={resultsCount}
            onChange={(e) => changeCountAndFetch(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
          </select>

          <button
            onClick={refresh}
            className="ml-2 px-3 py-1 rounded shadow bg-blue-600 text-white hover:opacity-95"
          >
            Refresh
          </button>
        </div>
      </header>

      {/* Loading state */}
      {loading && (
        <div className="space-y-2">
          {/* simple skeletons */}
          <div className="animate-pulse flex gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-300" />
            <div className="flex-1 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
          <div className="animate-pulse flex gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-300" />
            <div className="flex-1 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Users grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.length === 0 && (
            <p className="text-gray-600">No users yet. Click Refresh to try again.</p>
          )}

          {users.map((u, i) => (
            <article
              key={i}
              tabIndex={0}
              onClick={() => setSelectedUser(u)}
              className="cursor-pointer p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <img
                src={u.picture.medium}
                alt={`${u.name.first} ${u.name.last}`}
                className="w-16 h-16 rounded-full object-cover"
              />

              <div>
                <h2 className="font-semibold">
                  {u.name.first} {u.name.last}
                </h2>
                <p className="text-sm text-gray-500">{u.location.country}</p>
                <p className="text-xs text-gray-400 mt-1">{u.email}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Simple modal for selected user */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedUser(null)}
          />

          <div className="bg-white rounded-lg p-6 z-10 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedUser.picture.large}
                alt="selected"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">{selectedUser.name.first} {selectedUser.name.last}</h3>
                <p className="text-sm text-gray-500">{selectedUser.location.country}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>City:</strong> {selectedUser.location.city}</p>
              <p><strong>Street:</strong> {selectedUser.location.street.number} {selectedUser.location.street.name}</p>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-6 text-xs text-gray-500">Data from randomuser.me • Click a card for details</footer>
    </div>
  );
}
