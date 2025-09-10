type IslandRole = "member" | "admin" | "owner" | "coowner"

const IslandRoleHierarchy: Record<IslandRole, number> = {
    member: 0,
    admin: 1,
    coowner: 2,
    owner: 3,
};

export { IslandRole, IslandRoleHierarchy }