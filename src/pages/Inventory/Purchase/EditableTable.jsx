import React, { useState } from 'react';
import { Table, Input, Button } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

const { Column, HeaderCell, Cell } = Table;
const EditableTable = () => {
    const [data, setData] = useState([
      { id: 1, name: 'John Doe', age: 28 },
      { id: 2, name: 'Jane Smith', age: 34 }
    ]);
    const [editingKey, setEditingKey] = useState(null);
  
    const handleEdit = (rowKey) => {
      setEditingKey(rowKey);
    };
  
    const handleSave = (rowKey) => {
      setEditingKey(null);
    };
  
    const handleChange = (value, rowKey, dataKey) => {
      const newData = data.map((item) =>
        item.id === rowKey ? { ...item, [dataKey]: value } : item
      );
      setData(newData);
    };
  
    const EditableCell = ({ rowData, dataKey, ...props }) => {
      const isEditing = editingKey === rowData.id;
      return (
        <Cell {...props}>
          {isEditing ? (
            <Input
              defaultValue={rowData[dataKey]}
              onChange={(value) => handleChange(value, rowData.id, dataKey)}
            />
          ) : (
            rowData[dataKey]
          )}
        </Cell>
      );
    };
  
    return (
      <Table height={400} data={data}>
        <Column width={100} align="center" fixed>
          <HeaderCell>ID</HeaderCell>
          <Cell dataKey="id" />
        </Column>
  
        <Column width={200}>
          <HeaderCell>Name</HeaderCell>
          <EditableCell dataKey="name" />
        </Column>
  
        <Column width={100}>
          <HeaderCell>Age</HeaderCell>
          <EditableCell dataKey="age" />
        </Column>
  
        <Column width={120} fixed="right">
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowData) => {
              const isEditing = editingKey === rowData.id;
              return isEditing ? (
                <Button appearance="link" onClick={() => handleSave(rowData.id)}>
                  Save
                </Button>
              ) : (
                <Button appearance="link" onClick={() => handleEdit(rowData.id)}>
                  Edit
                </Button>
              );
            }}
          </Cell>
        </Column>
      </Table>
    );
  };
  
  export default EditableTable;
  