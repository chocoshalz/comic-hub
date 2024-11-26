'use client';

import React, { Component } from 'react';
import './roles.scss';
import RoleTable from '@/components/ClassComponents/Table/Table';
import RoleClient from '@/services/client/common/ClientServices/RoleClient';
import toast from 'react-hot-toast';
import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
interface RoleFormState {
  roleName: string;
  description: string;
}

class RolesPage extends Component<RoleFormState> {

  roleServer!:RoleClient

  state = {
    roles:[
      // { roleName: 'Admin', description: 'Has full access to the system' },
      // { roleName: 'Editor', description: 'Can edit content' },
      // { roleName: 'Viewer', description: 'Can view content only' },
    ],
    roleName: '',
    description: '',
  };
  constructor(props: RoleFormState) {
    super(props);
    this.roleServer = new RoleClient();
  }

  componentDidMount(): void {
    subjectService.setHeading({heading:"Roles"})
    this.getRolesList()
  }

  getRolesList()
  {
    this.roleServer.getAllRoles().subscribe((res:any)=>{
      this.setState({roles: res.roles || []})
    })
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }) as Pick<RoleFormState, keyof RoleFormState>);
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { roleName, description } = this.state;

    if (roleName && description) {
      console.log('Role Created:', { roleName, description });
      this.createRole(roleName, description)
      this.setState({ roleName: '', description: '' });
    } else {
      alert('Please fill in all fields.');
    }
  };

  createRole(roleName:string, description:string)
  {
    this.roleServer.createRole({ roleName, description }).subscribe((res:any)=>{
      console.log("res => ", res)
      toast.success(res.message)
      this.getRolesList()
    })
  }


  handleRoleUpdate = (role: any) => {
    this.roleServer.patchRole(role.id,{description:role.description}).subscribe((res:any)=>{
      toast.success(res.message)
      this.getRolesList()
      console.log(res)
    })
   console.log("updatedRole => ", role)
  };

  handleRoleDelete = (role: any) => {
    this.roleServer.deleteRole(role.id).subscribe((res:any)=>{
      toast.success(res.message)
      this.getRolesList()
    })
    console.log("roleName => ", role) 
  }

  render() {
    const { roleName, description, roles } = this.state;

    return (
      <div className="roles-root-class">
        <div className="create-a-role">
          <div className='create-row-div'>
          <div className="create-role-container">
            <form onSubmit={this.handleSubmit} className="form-container">
              <div className="field-container">
                <label htmlFor="roleName" className="label"> Role Name </label>
                <input type="text"  id="roleName"  name="roleName"  value={roleName}  onChange={this.handleChange}  className="input" />
              </div>
              <div className="field-container">
                <label htmlFor="description" className="label">  Description </label>
                <textarea  id="description"  name="description"  value={description}  onChange={this.handleChange}  className="textarea" />
              </div>
              <button type="submit" className="button">  Create Role </button>
            </form>
          </div>
          </div>
        </div>
        <div className="role-list">
          <div>
          <RoleTable roles={roles} onRoleUpdate={(e)=> this.handleRoleUpdate(e)} onRoleDelete={(e)=> this.handleRoleDelete(e)} />
          </div>
        </div>
      </div>
    );
  }
}

export default RolesPage;
