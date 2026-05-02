import { useEffect, useState } from "react";
import { Log } from "./logger";
import { getTopNotifications } from "./notifications";

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      Log("frontend", "info", "api", "Fetching users started");

      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: User[] = await res.json();
        setUsers(data);

        Log("frontend", "info", "api", "Users fetched successfully");
      } catch (err: any) {
        setError(err.message);
        Log("frontend", "error", "api", "Error fetching users");
      } finally {
        setLoading(false);
      }
    }

    Log("frontend", "info", "component", "App mounted");
    fetchUsers();
    void getTopNotifications();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>User List</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> — {user.email}
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          Log("frontend", "debug", "component", "Button clicked");
          alert("Button clicked");
        }}
      >
        Click Me
      </button>
    </div>
  );
}

export default App;
