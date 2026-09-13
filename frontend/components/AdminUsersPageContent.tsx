"use client";

import { FormEvent, useEffect, useState } from "react";

import { createUser, deleteUser, getUsers } from "@/lib/api";
import { AppUser, AppUserInput } from "@/types/auth";

type FormStatus = "idle" | "saving" | "success" | "error";

export function AdminUsersPageContent() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  async function loadUsers() {
    try {
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
      setFormStatus("saving");

      await createUser(userInput);
      await loadUsers();

      form.reset();
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  }

  async function handleDeleteUser(userId: number) {
    const confirmed = window.confirm("Delete this user?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUserId(userId);
      await deleteUser(userId);
      await loadUsers();
    } finally {
      setDeletingUserId(null);
    }
  }

  return (
    <section className="px-8 py-10">
      <div>
        <h1 className="text-3xl font-bold">Admin Users</h1>
        <p className="mt-2 text-sm text-gray-400">
          Create accounts for people who can access your streaming library.
        </p>
      </div>

      <form
        onSubmit={handleCreateUser}
        className="mt-8 grid gap-4 rounded border border-gray-800 bg-zinc-950 p-6"
      >
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_160px]">
          <div className="grid gap-2">
            <label htmlFor="username" className="text-sm text-zinc-300">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="role" className="text-sm text-zinc-300">
              Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue="USER"
              required
              className="rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={formStatus === "saving"}
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-zinc-700"
          >
            {formStatus === "saving" ? "Creating..." : "Create user"}
          </button>

          {formStatus === "success" && (
            <span className="text-sm text-green-400">User created.</span>
          )}

          {formStatus === "error" && (
            <span className="text-sm text-red-400">Could not create user.</span>
          )}
        </div>
      </form>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Existing Users</h2>

        {isLoading && (
          <p className="mt-4 text-sm text-zinc-500">Loading users...</p>
        )}

        {hasError && (
          <p className="mt-4 text-sm text-red-400">Could not load users.</p>
        )}

        {!isLoading && !hasError && users.length === 0 && (
          <p className="mt-4 text-sm text-zinc-500">No users created yet.</p>
        )}

        {!isLoading && !hasError && users.length > 0 && (
          <div className="mt-4 overflow-hidden rounded border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950 text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="bg-black">
                    <td className="px-4 py-3 font-medium text-white">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {user.role === "ADMIN" ? "Admin" : "User"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deletingUserId === user.id}
                        className="text-sm font-medium text-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:text-zinc-500"
                      >
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
    </section>
  );
}
