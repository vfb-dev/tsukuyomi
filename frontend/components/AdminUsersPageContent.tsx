"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";

import { createUser, deleteUser, getUsers } from "@/lib/api";
import { AppUser, AppUserInput } from "@/types/auth";

type FormStatus = "idle" | "saving" | "success" | "error";

export function AdminUsersPageContent() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [createError, setCreateError] = useState("");
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  async function loadUsers() {
    try {
      setIsLoading(true);
      setHasError(false);
      const loadedUsers = await getUsers();
      setUsers(loadedUsers);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialUsers() {
      try {
        const loadedUsers = await getUsers();
        setUsers(loadedUsers);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialUsers();
  }, []);

  useEffect(() => {
    if (!isCreateOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCreateOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isCreateOpen]);

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const userInput: AppUserInput = {
      username: String(formData.get("username")),
      password: String(formData.get("password")),
      role: String(formData.get("role")) as AppUserInput["role"],
    };

    try {
      setCreateError("");
      setFormStatus("saving");

      await createUser(userInput);
      await loadUsers();

      form.reset();
      setFormStatus("success");
      setIsCreateOpen(false);
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Could not create user.",
      );
      setFormStatus("error");
    }
  }

  async function handleDeleteUser(userId: number) {
    const confirmed = window.confirm("Delete this user?");

    if (!confirmed) {
      return;
    }

    try {
      setDeleteError("");
      setDeletingUserId(userId);
      await deleteUser(userId);
      await loadUsers();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Could not delete user.",
      );
    } finally {
      setDeletingUserId(null);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-5 border-b border-zinc-900 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Admin users
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Manage the people who can access your library.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormStatus("idle");
            setCreateError("");
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 self-start rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 sm:self-auto"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add user
        </button>
      </header>

      <section className="mt-8 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">Users</h2>
              {!isLoading && !hasError && (
                <span className="text-xs text-zinc-600">
                  {users.length} {users.length === 1 ? "user" : "users"}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => void loadUsers()}
              disabled={isLoading}
              aria-label="Refresh users"
              title="Refresh users"
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-zinc-800 text-zinc-500 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                aria-hidden="true"
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {deleteError && (
            <p className="mt-5 border-y border-zinc-900 py-3 text-sm text-red-400">
              {deleteError}
            </p>
          )}

          {hasError && (
            <div className="mt-5 border-y border-zinc-900 py-8">
              <p className="text-sm text-red-400">Could not load users.</p>
              <button
                type="button"
                onClick={() => void loadUsers()}
                className="mt-3 text-xs font-semibold text-zinc-400 underline underline-offset-4 transition hover:text-white"
              >
                Try again
              </button>
            </div>
          )}

          {isLoading && (
            <div className="mt-5 overflow-hidden border-y border-zinc-900">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-zinc-900 py-4 last:border-b-0"
                >
                  <div className="h-9 w-9 animate-pulse rounded-full bg-zinc-900" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-900" />
                    <div className="h-3 w-1/5 animate-pulse rounded bg-zinc-900" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !hasError && users.length === 0 && (
            <div className="mt-5 border-y border-zinc-900 py-12 text-center">
              <UsersRound aria-hidden="true" className="mx-auto h-7 w-7 text-zinc-700" />
              <p className="mt-3 text-sm text-zinc-500">No users yet.</p>
            </div>
          )}

          {!isLoading && !hasError && users.length > 0 && (
            <div className="mt-5 overflow-x-auto border-y border-zinc-900">
              <table className="min-w-[560px] w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-zinc-600">
                  <tr>
                    <th className="px-2 py-3 font-semibold">Username</th>
                    <th className="px-2 py-3 font-semibold">Role</th>
                    <th className="px-2 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-900">
                  {users.map((user) => (
                    <tr key={user.id} className="transition hover:bg-zinc-950">
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-300 uppercase">
                            {user.username.slice(0, 1)}
                          </span>
                          <span className="font-medium text-white">
                            {user.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                          {user.role === "ADMIN" && (
                            <ShieldCheck
                              aria-hidden="true"
                              className="h-3.5 w-3.5 text-red-400"
                            />
                          )}
                          {user.role === "ADMIN" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-2 py-4">
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deletingUserId === user.id}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:text-zinc-500"
                        >
                          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                          {deletingUserId === user.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </section>

      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-user-heading"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-t border border-zinc-800 bg-black shadow-2xl sm:rounded"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-4 sm:px-6">
              <div>
                <h2 id="create-user-heading" className="text-lg font-semibold text-white">
                  Add user
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Create an account with library access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                aria-label="Close add user dialog"
                title="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="grid gap-4 p-5 sm:p-6">
              <div className="grid gap-2">
                <label htmlFor="modal-username" className="text-sm text-zinc-300">
                  Username
                </label>
                <input
                  id="modal-username"
                  name="username"
                  type="text"
                  required
                  autoFocus
                  className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none transition focus:border-red-600"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="modal-password" className="text-sm text-zinc-300">
                  Password
                </label>
                <input
                  id="modal-password"
                  name="password"
                  type="password"
                  required
                  className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none transition focus:border-red-600"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="modal-role" className="text-sm text-zinc-300">
                  Role
                </label>
                <select
                  id="modal-role"
                  name="role"
                  defaultValue="USER"
                  required
                  className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none transition focus:border-red-600"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-zinc-900 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded px-3 py-2 text-sm font-semibold text-zinc-400 transition hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formStatus === "saving"}
                  className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-zinc-700"
                >
                  <UserPlus aria-hidden="true" className="h-4 w-4" />
                  {formStatus === "saving" ? "Creating..." : "Create user"}
                </button>
              </div>

              {formStatus === "error" && (
                <p className="text-sm text-red-400">{createError}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
