import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Header from "../components/common/Header";
import UsersTable from "../components/users/UsersTable";
import AddUserModal from "../components/users/AddUserModal";
import { User } from "../components/users/type";
import { API_URL } from "../App";
import UpdateUserModal from "../components/users/UpdateUserModal";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const token = Cookies.get("session");

  const fetchUsers = async () => {
	try {
	  const res = await axios.get(`${API_URL}/getalluser`, {
		headers: { Authorization: `Bearer ${token}` },
	  });
  
	  const users: User[] = res.data.map((user: any) => ({
		id: user.ID,
		username: user.Username,
		email: user.Email ?? "",
		createdAt: user.CreatedAt,
		// updatedAt: user.UpdatedAt, // Uncomment if you add this to User type
	  }));
  
	  setUsers(users);
	} catch (err) {
	  console.error("Error fetching users", err);
	}
  };

  const addUser = async (user: Partial<User>) => {
    try {
      const res = await axios.post(
		`${API_URL}/addnewuser`,
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
	  if (res.status !== 200) {
		throw new Error("Failed to add user");
	  }
      fetchUsers();
    } catch (err) {
      console.error("Error adding user", err);
    }
  };

  const updateUser = async (user: User) => {
    setSelectedUser(user);
	setShowUpdateModal(true);
  };
  const submitUpdateUser = async (user: Partial<User>) => {
    try {
	  const res = await axios.post(
		`${API_URL}/updateuser`,
		user,
		{ headers: { Authorization: `Bearer ${token}` } }
	  );	
	  if (res.status !== 200) {
		throw new Error("Failed to update user");
	  }

      fetchUsers();
    } catch (err) {
      console.error("Error updating user", err);
    }
  };


  const deleteUser = async (userId: string) => {
    try {
      const res = await axios.post(
		`${API_URL}/removeusers`,
		 [userId] ,
		{ headers: { Authorization: `Bearer ${token}` } }
	  );
	  if (res.status !== 200) {
		throw new Error("Failed to delete user");
	  }
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Panel de Administrador de Usuarios' />

	  {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSave={addUser}
        />
      )}
	  {showUpdateModal && (
		<UpdateUserModal
		  user={selectedUser!}
		  onClose={() => {setShowUpdateModal(false) ; setSelectedUser(null);}}
		  onUpdate={submitUpdateUser}
		/>
	  )}



      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <div className='flex justify-end mb-4'>
          <button
            onClick={() => setShowAddModal(true)}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-500'
          >
            Añadir Usuario
          </button>
        </div>
        <UsersTable
          users={users}
          onDelete={deleteUser}
          onUpdate={updateUser}
        />
      </main>


    </div>
  );
};

export default UsersPage;
