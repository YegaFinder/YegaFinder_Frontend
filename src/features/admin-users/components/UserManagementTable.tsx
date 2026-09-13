"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/form-feedback";
import { useAuthStore } from "@/store/auth-store";
import { useAdminUsersQueue } from "../hooks/useAdminUsersQueue";
import type { User } from "../types/admin-user.types";

const ROLES: User["role"][] = ["Customer", "Merchant", "Moderator", "Admin"];

export function UserManagementTable() {
  const currentUser = useAuthStore((s) => s.user);
  const {
    users, meta, role, setRole, isActive, setIsActive,
    page, setPage, isLoading, isError, toggleActive, togglingId,
  } = useAdminUsersQueue();

  // Matches the proposed contract's @Roles(Admin) - narrower than the
  // listing queue, which also allows Moderator.
  if (currentUser?.role !== "Admin") {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Only Admins can manage user accounts.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-yegna-navy">User management</h1>
        <p className="text-xs text-muted-foreground italic">
          Mock data - backend contract proposed, not yet implemented.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={role === undefined ? "default" : "outline"} onClick={() => setRole(undefined)}>
          All roles
        </Button>
        {ROLES.map((r) => (
          <Button key={r} size="sm" variant={role === r ? "default" : "outline"} onClick={() => setRole(r)}>
            {r}
          </Button>
        ))}
        <span className="mx-2 w-px bg-yegna-border" />
        <Button size="sm" variant={isActive === undefined ? "default" : "outline"} onClick={() => setIsActive(undefined)}>
          All statuses
        </Button>
        <Button size="sm" variant={isActive === true ? "default" : "outline"} onClick={() => setIsActive(true)}>
          Active
        </Button>
        <Button size="sm" variant={isActive === false ? "default" : "outline"} onClick={() => setIsActive(false)}>
          Inactive
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Spinner className="size-5" /> Loading users...
        </div>
      ) : isError ? (
        <p className="py-16 text-center text-sm text-destructive">We couldn&apos;t load users.</p>
      ) : users.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-yegna-border py-16 text-center text-sm text-muted-foreground">
          No users match these filters.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[20px] border border-yegna-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-yegna-border">
                  <td className="px-4 py-3 font-medium text-yegna-navy">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.role}</td>
                  <td className="px-4 py-3">
                    <span className={u.isActive ? "text-green-600" : "text-destructive"}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={togglingId === u.id}
                      onClick={() => toggleActive({ id: u.id, isActive: !u.isActive })}
                    >
                      {togglingId === u.id ? "Updating..." : u.isActive ? "Deactivate" : "Reactivate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2 text-sm">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-muted-foreground">Page {meta.page} of {meta.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}