export const roles = {
  superadmin: {
    can: [
      "user:create", "user:read", "user:update", "user:delete",
      "task:create", "task:read", "task:update", "task:delete",
      "event:create", "event:read", "event:update", "event:delete",
      "invitation:create", "invitation:read", "invitation:update", "invitation:delete",
      "role:assign", "role:update"
    ]
  },
  admin: {
    can: [
      "user:create", "user:read", "user:update",
      "task:create", "task:read", "task:update", "task:delete",
      "event:create", "event:read", "event:update", "event:delete",
      "invitation:create", "invitation:read", "invitation:update", "invitation:delete"
    ]
  },
  player: {
    can: [
      "task:create", "task:read",
      "event:read"
    ]
  },
  guest: {
    can: ["task:read", "event:read"]
  }
};
