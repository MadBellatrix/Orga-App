export const roles = {
  superadmin: {
    can: [

      "user:create",
      "user:read",
      "user:update",
      "user:delete",
      "task:create",
      "task:read",
      "task:update",
      "task:delete",
      "role:assign",
      "role:update"
    ]
  },

  admin: {
    can: [
      "user:create",
      "user:read",
      "user:update",
      "task:create",
      "task:read",
      "task:update",
      "task:delete"
    ]
  },

  player: {
    can: [
      "task:create",  
      "task:read",    
      "task:update"  
    ]
  },

  guest: {
    can: [
      "task:read"    
    ]
  }
};
