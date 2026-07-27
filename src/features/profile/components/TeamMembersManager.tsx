"use client";

import { useState } from "react";
import { Trash2, UserPlus, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/shared/form-feedback";
import { useTeamMembers } from "../hooks/useTeamMembers";

export function TeamMembersManager() {
  const { staff, isLoading, addStaff, isAdding, removeStaff } = useTeamMembers();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("Staff");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!userId.trim()) return;
    try {
      await addStaff({ userId: userId.trim(), role: role.trim() || "Staff" });
      setUserId("");
      setRole("Staff");
    } catch {
      // toast already shown
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
        <span>
          This is a label, not real access — adding someone here doesn&apos;t grant them login/permissions
          on your business yet. You&apos;ll need their exact account ID; there&apos;s no email search yet.
        </span>
      </div>

      <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-[2fr_1fr_auto]">
        <div className="space-y-1.5">
          <Label htmlFor="staff-userId">User ID</Label>
          <Input
            id="staff-userId"
            placeholder="Paste their account ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="staff-role">Role label</Label>
          <Input id="staff-role" placeholder="e.g. Manager" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <Button type="submit" disabled={isAdding || !userId.trim()} className="self-end">
          {isAdding ? <Spinner /> : <UserPlus className="size-4" />}
          Add
        </Button>
      </form>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
          <Spinner className="size-4" /> Loading team...
        </div>
      ) : staff.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">No team members added yet.</p>
      ) : (
        <ul className="space-y-2">
          {staff.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between rounded-[10px] border border-yegna-border bg-background px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium">
                  {member.user?.firstName} {member.user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {member.user?.email} · {member.role}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeStaff(member.id)}
                aria-label="Remove team member"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}