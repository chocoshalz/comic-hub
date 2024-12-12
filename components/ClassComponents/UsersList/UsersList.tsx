import React, { Component } from 'react';
import DataTable from 'react-data-table-component';
import styles from './UsersList.module.scss';  // Import styles as CSS module

import { getSession } from 'next-auth/react';
import UserClient from '@/services/client/common/ClientServices/UserClient';
import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
interface props {
  users: any;
}

class UsersList extends Component<props> {
  userServ!:UserClient
  state = {
    users: [] as any[],
    roles: [
      { roleName:"User" },
      { roleName:"Admin" }
    ],
    searchTerm: '',  // Added search term to state
    editIndex: -1,   // To track which row is being edited
    originalUser: {} as any, // To store original data for cancellation
  };

  constructor(props: props) {
    super(props);
    this.userServ =  new UserClient()

  }

  

  componentDidMount(): void {

    subjectService.setHeading({heading:"Users"})
    //get all users list
    this.userServ.getAllUsers().subscribe({
      next: (response) => {
        console.log('User data received:', response);
        if(response.status == 200)
        {
          if (Array.isArray(response.users)) {
            this.setState({
              users: response.users,
              isLoading: false,
            });
          } else {
            this.setState({
              error: 'Invalid data format received.',
              isLoading: false,
            });
          }
        }
        
      },
      error: (err) => {
        console.log('Error fetching users:', err);
        this.setState({
          error: 'Failed to fetch users',
          isLoading: false,
        });
      },
      complete: () => {
        console.log('User fetching completed.');
      }
    });

  }

  // Function to handle edit (toggle between edit mode and view mode)
  handleEdit = (index: any) => {
    this.setState({ 
      editIndex: this.state.editIndex === index ? -1 : index,
      originalUser: this.state.users[index],  // Store the original user data for cancellation
    });
  };

  // Function to handle saving changes
  handleSave = (index: any) => {
    const updatedUsers = [...this.state.users];
    const updatedUser = updatedUsers[index];
    console.log("updatedUser => ",updatedUser)
    let payload:any = { username: updatedUser.username, email: updatedUser.email, accountStatus:updatedUser.accountStatus}
    this.userServ.patchUser(updatedUser.id, payload).subscribe((res:any)=>{
      console.log("status update => ", res)
    })
    // Update the user data in state
    updatedUsers[index] = updatedUser;

    this.setState({ users: updatedUsers, editIndex: -1 });
  };

  // Function to handle input field change (for editing)
  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, row: any, field: string) => {
    const updatedUsers = [...this.state.users];
    const updatedUser = { ...row, [field]: e.target.value };
    const index = updatedUsers.findIndex((user) => user === row);
    updatedUsers[index] = updatedUser;
    this.setState({ users: updatedUsers });
  };

  // Function to handle cancel (reset to original user data)
  handleCancel = () => {
    const { originalUser, users, editIndex } = this.state;
    const updatedUsers = [...users];
    
    // Revert changes to the original user data
    updatedUsers[editIndex] = originalUser;

    this.setState({
      users: updatedUsers,
      editIndex: -1, // Reset edit index to exit edit mode
    });
  };

  // Function to handle search input change
  handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    this.setState({ searchTerm });
  };

  // Filter users based on search term
  getFilteredUsers = () => {
    const { users, searchTerm } = this.state;
    return users.filter((user: any) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) 
      // user.accountStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // user.roleName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  render() {
    const columns: any = [
      {
        name: 'Username',
        selector: (row: { username: any; }, index: any) => {
          return this.state.editIndex === index ? (
            <input
              type="text"
              value={row.username}
              onChange={(e) => this.handleInputChange(e, row, 'username')}
            />
          ) : (
            row.username
          );
        },
        // Removed sortable: true to disable sorting
      },
      {
        name: 'Email',
        selector: (row: { email: any; }, index: any) => {
          return this.state.editIndex === index ? (
            <input
              type="text"
              value={row.email}
              onChange={(e) => this.handleInputChange(e, row, 'email')}
            />
          ) : (
            row.email
          );
        },
        // Removed sortable: true to disable sorting
      },
      {
        name: 'Password',
        selector: (row: { password: any; }, index: any) => {
          return this.state.editIndex === index ? (
            <input
              type="text"
              value={row.password}
              onChange={(e) => this.handleInputChange(e, row, 'password')}
            />
          ) : (
            "*********"
          );
        },
        // Removed sortable: true to disable sorting
      },
      {
        name: 'Account Status',
        selector: (row: { accountStatus: any; }, index: any) => {
          return this.state.editIndex === index ? (
            <select
              value={row.accountStatus}
              onChange={(e) => this.handleInputChange(e, row, 'accountStatus')}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          ) : (
            row.accountStatus
          );
        },
        // Removed sortable: true to disable sorting
      },
      {
        name: 'Role Name',
        selector: (row: { roleName: any; }, index: any) => {
          return this.state.editIndex === index ? (
            <select
              value={row.roleName}
              onChange={(e) => this.handleInputChange(e, row, 'roleName')}
            >
              {/* <option value="regular user">regular user</option> */}
              {
                this.state.roles.map((role:any,roleI:number)=>(
                  <option value={role.roleName} key={role.roleName}>{role.roleName}</option>
                ))
              }
              {/* <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="regular user">Regular User</option> */}
            </select>
          ) : (
            !!row.roleName ? row.roleName : "regular user"
          );
        },
        // Removed sortable: true to disable sorting
      },
      {
        name: 'Actions',
        cell: (row: any, index: any) => (
          <div>
            {this.state.editIndex === index ? (
              <>
                <button className={styles.saveButton} onClick={() => this.handleSave(index)}>
                  Save
                </button>
                <button className={styles.cancelButton} onClick={this.handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <button className={styles.editButton} onClick={() => this.handleEdit(index)}>
                Edit
              </button>
            )}
          </div>
        ),
      },
    ];

    return (
      <div className={styles.usersList}>
        {/* <h1>Users List</h1> */}
        {/* Search Input */}
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search Users..."
          value={this.state.searchTerm}
          onChange={this.handleSearch}
        />
        <DataTable
          columns={columns}
          data={this.getFilteredUsers()}  // Pass filtered users
          pagination
          highlightOnHover
          striped
        />
      </div>
    );
  }
}

export default UsersList;
