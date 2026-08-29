import {
  CalendarDays,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  createUserAction,
  deleteUserAction,
  resetPasswordAction,
  updateUserAction,
} from "./actions";

export const dynamic = "force-dynamic";

type AdminUsersPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-AE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getUserName(userMetadata: Record<string, unknown>) {
  const name = userMetadata?.name;

  return typeof name === "string" && name.trim()
    ? name.trim()
    : "Unnamed User";
}

function getUserRole(appMetadata: Record<string, unknown>) {
  const role = appMetadata?.role;

  if (
    role === "admin" ||
    role === "manager" ||
    role === "staff"
  ) {
    return role;
  }

  return "staff";
}

function getUserStatus(
  userMetadata: Record<string, unknown>,
  bannedUntil?: string
) {
  const status = userMetadata?.status;

  if (status === "inactive") {
    return "inactive";
  }

  if (
    bannedUntil &&
    new Date(bannedUntil).getTime() > Date.now()
  ) {
    return "inactive";
  }

  return "active";
}

function roleLabel(role: string) {
  if (role === "admin") {
    return "Admin";
  }

  if (role === "manager") {
    return "Manager";
  }

  return "Staff";
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const params = await searchParams;

  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const supabaseAdmin = createAdminClient();

  const {
    data: usersResult,
    error,
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  const usersList = usersResult?.users || [];

  const activeUsers = usersList.filter((user) => {
    return (
      getUserStatus(
        user.user_metadata,
        user.banned_until
      ) === "active"
    );
  }).length;

  const adminUsers = usersList.filter((user) => {
    return getUserRole(user.app_metadata) === "admin";
  }).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
          Users
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Manage Users
        </h1>

        <p className="mt-2 text-slate-500">
          Create and manage BloomPath admin, manager and staff
          accounts.
        </p>
      </div>

      {params.success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
          <CheckCircle2 className="mt-0.5 shrink-0" size={20} />

          <p className="font-semibold">{params.success}</p>
        </div>
      )}

      {params.error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-800">
          <XCircle className="mt-0.5 shrink-0" size={20} />

          <p className="font-semibold">{params.error}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Total Users
            </p>

            <Users className="text-slate-400" size={22} />
          </div>

          <p className="mt-3 text-3xl font-black text-slate-950">
            {usersList.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Active Users
            </p>

            <CheckCircle2
              className="text-emerald-500"
              size={22}
            />
          </div>

          <p className="mt-3 text-3xl font-black text-slate-950">
            {activeUsers}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Administrators
            </p>

            <ShieldCheck
              className="text-emerald-500"
              size={22}
            />
          </div>

          <p className="mt-3 text-3xl font-black text-slate-950">
            {adminUsers}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <UserPlus size={22} />
          </span>

          <div>
            <h2 className="text-xl font-black text-slate-950">
              Add New User
            </h2>

            <p className="text-sm text-slate-500">
              Create a new dashboard login account.
            </p>
          </div>
        </div>

        <form
          noValidate
          action={createUserAction}
          className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="User name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="user@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Role
            </label>

            <select
              id="role"
              name="role"
              defaultValue="staff"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue="active"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2 xl:col-span-5">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
            >
              <UserPlus size={18} />
              Create User
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-black text-slate-950">
            User Accounts
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update account information, permissions and access.
          </p>
        </div>

        {error ? (
          <div className="p-8 text-center">
            <XCircle
              className="mx-auto text-red-500"
              size={36}
            />

            <h3 className="mt-4 text-lg font-black text-slate-950">
              Users could not be loaded
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {error.message}
            </p>
          </div>
        ) : usersList.length === 0 ? (
          <div className="p-10 text-center">
            <Users
              className="mx-auto text-slate-300"
              size={42}
            />

            <h3 className="mt-4 text-lg font-black text-slate-950">
              No users found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create your first user using the form above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {usersList.map((user) => {
              const name = getUserName(user.user_metadata);
              const role = getUserRole(user.app_metadata);
              const status = getUserStatus(
                user.user_metadata,
                user.banned_until
              );
              const isCurrentUser =
                currentUser?.id === user.id;

              return (
                <article
                  key={user.id}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black text-slate-950">
                          {name}
                        </h3>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">
                          {roleLabel(role)}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                            status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {status}
                        </span>

                        {isCurrentUser && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            Current Account
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:gap-5">
                        <span className="flex items-center gap-2">
                          <Mail size={16} />
                          {user.email || "No email"}
                        </span>

                        <span className="flex items-center gap-2">
                          <CalendarDays size={16} />
                          Created {formatDate(user.created_at)}
                        </span>

                        <span className="flex items-center gap-2">
                          <KeyRound size={16} />
                          Last login{" "}
                          {formatDate(user.last_sign_in_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <details className="relative">
                        <summary className="cursor-pointer list-none rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700">
                          Edit User
                        </summary>

                        <div className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:absolute xl:right-0 xl:z-20 xl:w-[520px] xl:shadow-xl">
                          <form
                            noValidate
                            action={updateUserAction}
                            className="grid gap-4 sm:grid-cols-3"
                          >
                            <input
                              type="hidden"
                              name="user_id"
                              value={user.id}
                            />

                            <div>
                              <label
                                htmlFor={`name-${user.id}`}
                                className="mb-2 block text-xs font-bold text-slate-600"
                              >
                                Full Name
                              </label>

                              <input
                                id={`name-${user.id}`}
                                name="name"
                                type="text"
                                required
                                defaultValue={name}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`role-${user.id}`}
                                className="mb-2 block text-xs font-bold text-slate-600"
                              >
                                Role
                              </label>

                              <select
                                id={`role-${user.id}`}
                                name="role"
                                defaultValue={role}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                              >
                                <option value="admin">
                                  Admin
                                </option>
                                <option value="manager">
                                  Manager
                                </option>
                                <option value="staff">
                                  Staff
                                </option>
                              </select>
                            </div>

                            <div>
                              <label
                                htmlFor={`status-${user.id}`}
                                className="mb-2 block text-xs font-bold text-slate-600"
                              >
                                Status
                              </label>

                              <select
                                id={`status-${user.id}`}
                                name="status"
                                defaultValue={status}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                              >
                                <option value="active">
                                  Active
                                </option>
                                <option value="inactive">
                                  Inactive
                                </option>
                              </select>
                            </div>

                            <div className="sm:col-span-3">
                              <button
                                type="submit"
                                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500"
                              >
                                Save Changes
                              </button>
                            </div>
                          </form>
                        </div>
                      </details>

                      <details className="relative">
                        <summary className="cursor-pointer list-none rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700">
                          Reset Password
                        </summary>

                        <div className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:absolute xl:right-0 xl:z-20 xl:w-80 xl:shadow-xl">
                          <form
                            noValidate
                            action={resetPasswordAction}
                            className="space-y-4"
                          >
                            <input
                              type="hidden"
                              name="user_id"
                              value={user.id}
                            />

                            <div>
                              <label
                                htmlFor={`password-${user.id}`}
                                className="mb-2 block text-xs font-bold text-slate-600"
                              >
                                New Password
                              </label>

                              <input
                                id={`password-${user.id}`}
                                name="password"
                                type="password"
                                minLength={8}
                                required
                                placeholder="Minimum 8 characters"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                              />
                            </div>

                            <button
                              type="submit"
                              className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                            >
                              Update Password
                            </button>
                          </form>
                        </div>
                      </details>

                      <form noValidate action={deleteUserAction}>
                        <input
                          type="hidden"
                          name="user_id"
                          value={user.id}
                        />

                        <button
                          type="submit"
                          disabled={isCurrentUser}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
