import { useEffect, useState } from "react";
import API from "../../api/axios";




function AdminUsers() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Users</h1>

      {users.map((user) => (
        <div key={user._id} className="bg-[#1e293b] p-4 mb-4 rounded">
          <h2>{user.name}</h2>
          <p className="text-gray-400 text-sm">{user.email}</p>
          <p className="text-xs">{user.role}</p>
        </div>
      ))}
    </div>
  );

}

export default AdminUsers;
