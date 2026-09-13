import type { User, UsersFilter, UsersQueryMeta } from "../types/admin-user.types";

// MOCK - no real endpoint exists yet. This is written against the
// proposed GET /admin/users contract sent to backend (role/isActive
// filters, page/limit, { users, meta } envelope). Once that lands,
// swap the bodies below for real apiClient calls; the hook and
// component never need to change, only this file.

const MOCK_LATENCY_MS = 350;

let mockUsers: User[] = [
  { id: "u1", firstName: "Abebe", lastName: "Kebede", email: "abebe.k@example.com", role: "Customer", isVerified: true, isEmailVerified: true, isPhoneVerified: true, isActive: true, createdAt: "2026-01-15T08:00:00.000Z" },
  { id: "u2", firstName: "Sara", lastName: "Mengistu", email: "sara.m@example.com", role: "Merchant", isVerified: true, isEmailVerified: true, isPhoneVerified: false, isActive: true, createdAt: "2026-02-02T08:00:00.000Z" },
  { id: "u3", firstName: "Dawit", lastName: "Alemu", email: "dawit.a@example.com", role: "Customer", isVerified: false, isEmailVerified: false, isPhoneVerified: false, isActive: true, createdAt: "2026-02-20T08:00:00.000Z" },
  { id: "u4", firstName: "Hana", lastName: "Tesfaye", email: "hana.t@example.com", role: "Merchant", isVerified: true, isEmailVerified: true, isPhoneVerified: true, isActive: false, createdAt: "2026-03-05T08:00:00.000Z" },
  { id: "u5", firstName: "Yonas", lastName: "Girma", email: "yonas.g@example.com", role: "Moderator", isVerified: true, isEmailVerified: true, isPhoneVerified: true, isActive: true, createdAt: "2026-03-18T08:00:00.000Z" },
  { id: "u6", firstName: "Bethlehem", lastName: "Wolde", email: "beth.w@example.com", role: "Customer", isVerified: true, isEmailVerified: true, isPhoneVerified: true, isActive: true, createdAt: "2026-04-01T08:00:00.000Z" },
];

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

export const adminUsersApi = {
  async list(filter: UsersFilter): Promise<{ users: User[]; meta: UsersQueryMeta }> {
    let filtered = mockUsers;
    if (filter.role) filtered = filtered.filter((u) => u.role === filter.role);
    if (filter.isActive !== undefined) filtered = filtered.filter((u) => u.isActive === filter.isActive);

    const total = filtered.length;
    const start = (filter.page - 1) * filter.limit;
    const page = filtered.slice(start, start + filter.limit);

    return delay({
      users: page,
      meta: {
        page: filter.page,
        limit: filter.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / filter.limit)),
      },
    });
  },

  async setActive(id: string, isActive: boolean): Promise<User> {
    mockUsers = mockUsers.map((u) => (u.id === id ? { ...u, isActive } : u));
    const updated = mockUsers.find((u) => u.id === id);
    if (!updated) throw new Error("User not found");
    return delay(updated);
  },
};