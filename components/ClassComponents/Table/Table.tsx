import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface RoleData {
  roleName: string;
  description: string;
}

interface RoleTableProps {
  roles: RoleData[];
  onRoleUpdate: (updatedRole: RoleData) => void;
  onRoleDelete: (roleName: string) => void;
}

export default function RoleTable({
  roles,
  onRoleUpdate,
  onRoleDelete,
}: RoleTableProps) {
  const [editRole, setEditRole] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState<string>("");

  const handleEdit = (role: RoleData) => {
    setEditRole(role.roleName);
    setEditedDescription(role.description);
  };

  const handleSave = (role: RoleData) => {
    onRoleUpdate({ ...role, description: editedDescription });
    setEditRole(null);
    setEditedDescription("");
  };

  const handleDelete = (roleName: any) => {
    onRoleDelete(roleName);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="roles table">
        <TableHead>
          <TableRow>
            <TableCell>Role Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow >
              <TableCell style={{width:'100%', textAlign:'center'}}>No roles found</TableCell>
            </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.roleName}>
                  <TableCell>{role.roleName}</TableCell>
                  <TableCell>
                  { 
                    editRole === role.roleName 
                    ? ( <TextField value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} size="small" variant="outlined" />) 
                    : ( role.description )
                  }
                  </TableCell>
                  <TableCell align="center">
                    {
                      editRole === role.roleName 
                      ? (<Button variant="contained" color="primary" size="small" onClick={() => handleSave(role)} >Save</Button>) 
                      : ( <Button variant="contained" color="primary" size="small" onClick={() => handleEdit(role)}>Edit</Button>)
                    }
                    <Button variant="contained" color="secondary" size="small" style={{ marginLeft: '8px' }} onClick={() => handleDelete(role)} > Delete </Button>
                  </TableCell>
                </TableRow>
              ))
            )
          }
        </TableBody>

        {/* <TableBody>
        {
          roles.length === 0 
          ? <div style={{width:'100%', textAlign:'center'}}>No roles found</div>
          : 
        }
        </TableBody> */}
      </Table>
    </TableContainer>
  );
}
