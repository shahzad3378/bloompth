"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

const allowedRoles = ["admin", "manager", "staff"] as const;
const allowedStatuses = ["active", "inactive"] as const;

type UserRole = (typeof allowedRoles)[number];
type UserStatus = (typeof allowedStatuses)[number];

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function redirectWithMessage(
  type: "success" | "error",
  message: string
): never {
  const query = new URLSearchParams({
    [type]: message,
  });

  redirect(`/admin/users?${query.toString()}`);
}

function isValidRole(role: string): role is UserRole {
  return allowedRoles.includes(role as UserRole);
}

function isValidStatus(status: string): status is UserStatus {
  return allowedStatuses.includes(status as UserStatus);
}

export async function createUserAction(formData: FormData) {
  await requireAdmin();

  const name = getFormValue(formData, "name");
  const email = getFormValue(formData, "email").toLowerCase();
  const password = getFormValue(formData, "password");
  const role = getFormValue(formData, "role");
  const status = getFormValue(formData, "status");

  if (!name) {
    redirectWithMessage("error", "User name is required.");
  }

  if (!email) {
    redirectWithMessage("error", "Email address is required.");
  }

  if (!email.includes("@")) {
    redirectWithMessage("error", "Enter a valid email address.");
  }

  if (password.length < 8) {
    redirectWithMessage(
      "error",
      "Password must contain at least 8 characters."
    );
  }

  if (!isValidRole(role)) {
    redirectWithMessage("error", "Invalid user role selected.");
  }

  if (!isValidStatus(status)) {
    redirectWithMessage("error", "Invalid user status selected.");
  }

  const supabaseAdmin = createAdminClient();

  const {
    data: { user: createdUser },
    error,
  } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: {
      role,
    },
    user_metadata: {
      name,
      full_name: name,
      status,
    },
  });

  if (error) {
    redirectWithMessage("error", error.message);
  }

  if (!createdUser) {
    redirectWithMessage("error", "User could not be created.");
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      full_name: name,
      email,
      role,
      status,
    })
    .eq("id", createdUser.id);

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(createdUser.id);
    redirectWithMessage("error", profileError.message);
  }

  revalidatePath("/admin/users");

  redirectWithMessage("success", "User created successfully.");
}

export async function updateUserAction(formData: FormData) {
  await requireAdmin();

  const userId = getFormValue(formData, "user_id");
  const name = getFormValue(formData, "name");
  const role = getFormValue(formData, "role");
  const status = getFormValue(formData, "status");

  if (!userId) {
    redirectWithMessage("error", "User ID is missing.");
  }

  if (!name) {
    redirectWithMessage("error", "User name is required.");
  }

  if (!isValidRole(role)) {
    redirectWithMessage("error", "Invalid user role selected.");
  }

  if (!isValidStatus(status)) {
    redirectWithMessage("error", "Invalid user status selected.");
  }

  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (userError || !user) {
    redirectWithMessage(
      "error",
      userError?.message || "User could not be found."
    );
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      app_metadata: {
        ...user.app_metadata,
        role,
      },
      user_metadata: {
        ...user.user_metadata,
        name,
        full_name: name,
        status,
      },
      ban_duration: status === "inactive" ? "876000h" : "none",
    }
  );

  if (error) {
    redirectWithMessage("error", error.message);
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      full_name: name,
      role,
      status,
    })
    .eq("id", userId);

  if (profileError) {
    redirectWithMessage("error", profileError.message);
  }

  revalidatePath("/admin/users");

  redirectWithMessage("success", "User updated successfully.");
}

export async function resetPasswordAction(formData: FormData) {
  await requireAdmin();

  const userId = getFormValue(formData, "user_id");
  const password = getFormValue(formData, "password");

  if (!userId) {
    redirectWithMessage("error", "User ID is missing.");
  }

  if (password.length < 8) {
    redirectWithMessage(
      "error",
      "New password must contain at least 8 characters."
    );
  }

  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      password,
    }
  );

  if (error) {
    redirectWithMessage("error", error.message);
  }

  revalidatePath("/admin/users");

  redirectWithMessage("success", "User password updated successfully.");
}

export async function deleteUserAction(formData: FormData) {
  const currentAccount = await requireAdmin();

  const userId = getFormValue(formData, "user_id");

  if (!userId) {
    redirectWithMessage("error", "User ID is missing.");
  }

  if (currentAccount.userId === userId) {
    redirectWithMessage(
      "error",
      "You cannot delete your currently logged-in account."
    );
  }

  const supabaseAdmin = createAdminClient();

  const { error } =
    await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    redirectWithMessage("error", error.message);
  }

  revalidatePath("/admin/users");

  redirectWithMessage("success", "User deleted successfully.");
}
