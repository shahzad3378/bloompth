import "server-only";

import { redirect } from "next/navigation";

import { isAdminRole } from "@/lib/auth-roles";
import { createClient } from "@/lib/supabase/server";

export type AccountProfile = {
  id: string;
  email: string | null;
  role: string | null;
  status: string | null;
};

export type CurrentAccount = {
  userId: string;
  profile: AccountProfile;
};

export async function getCurrentAccount(): Promise<CurrentAccount | null> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims.sub;

  if (claimsError || !userId) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, role, status")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  return {
    userId,
    profile: profile as AccountProfile,
  };
}

export function isActiveAdmin(account: CurrentAccount | null) {
  return Boolean(
    account &&
      account.profile.status === "active" &&
      isAdminRole(account.profile.role)
  );
}

export function isSeller(account: CurrentAccount | null) {
  return Boolean(account && account.profile.role === "seller");
}

export async function requireAdmin() {
  const account = await getCurrentAccount();

  if (!isActiveAdmin(account)) {
    throw new Error("You are not authorized to perform this admin action.");
  }

  return account as CurrentAccount;
}

export async function requireAdminPage() {
  const account = await getCurrentAccount();

  if (!account) {
    redirect("/login");
  }

  if (!isActiveAdmin(account)) {
    redirect(isSeller(account) ? "/seller" : "/login?error=unauthorized");
  }

  return account as CurrentAccount;
}

export async function requireActiveSellerPage() {
  const account = await getCurrentAccount();

  if (!account) {
    redirect("/seller/login");
  }

  if (isActiveAdmin(account)) {
    redirect("/admin");
  }

  if (!isSeller(account)) {
    redirect("/seller/login?error=unauthorized");
  }

  if (account.profile.status !== "active") {
    redirect("/seller");
  }

  return account as CurrentAccount;
}
