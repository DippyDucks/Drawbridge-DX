# Drawbridge-DX
Simple Strategy Based Authentication System 

## Creators:

| Last Name   | First Name |
| ----------- | ---------- |
| Ho          | JC         |
| Novis       | Rebecca    |

## Current Strategies:

- Username/Password
- Google OAuth

## Getting Started: 

### Config Setup

Use setConfig to set a configuration:

```
setConfig({ 
    "Database": {
        "host": "",
        "name": ""
    }
}) 
```

Example Config (All fields below are needed):

```
{
    "AppName": "Drawbridge",
    "Database": {
        "dialect": "mysql",
        "host": "127.0.0.1",
        "name": "drawbridge",
        "port": 3306,
        "username": "root",
        "password": "root"
    },
    "JWT": {
        "SECRET": "",
        "expires_in": "6h"
    },
    "AuthenticationStrategies": {
        "Google": {
            "Client_ID": "", // needed for google login strategy
        }
    }
}
```

### Current Users Table Setup

```
const Users = orm.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  clearance: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'unverified'
  },
}, {
  tableName: 'users',
  timestamps: false
});
```