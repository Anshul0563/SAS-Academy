import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

function AdminUsers() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      setUsers(res.data);
    };

    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Users</h1>

      {users.map((user) => (
        <div key={user._id} className="bg-[#1e293b] p-4 mb-4 rounded">
          <h2>{user.name}</h2>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      ))}
    </AdminLayout>
  );
}

export default AdminUsers;