import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isAdminRole } from "@/lib/auth-roles";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

type Profile = {
  role: string | null;
  status: string | null;
};

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, key } = getSupabasePublicConfig();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(headers).forEach(([header, value]) => {
          response.headers.set(header, value);
        });
      },
    },
  });

  // Keep this call immediately after client creation so refreshed cookies are
  // available to both this request and the browser response.
  const { data: claimsData } =
    await supabase.auth.getClaims();
  const claims = claimsData?.claims;

  const pathname = request.nextUrl.pathname;
  const isAdminLoginRoute =
    pathname === "/login" || pathname === "/admin/login";
  const isSellerLoginRoute = pathname === "/seller/login";
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isAdminRoute =
    pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isSellerRoute =
    pathname.startsWith("/seller") && !isSellerLoginRoute;
  const isActiveSellerRoute =
    pathname.startsWith("/seller/products") ||
    pathname.startsWith("/seller/orders");

  let profile: Profile | null = null;

  if (
    claims?.sub &&
    (isAdminRoute ||
      isAdminApiRoute ||
      isSellerRoute ||
      isAdminLoginRoute ||
      isSellerLoginRoute)
  ) {
    const { data } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", claims.sub)
      .maybeSingle();

    profile = data as Profile | null;
  }

  const isLoggedIn = Boolean(claims?.sub);
  const isAdmin =
    profile?.status === "active" && isAdminRole(profile.role);
  const isSeller = profile?.role === "seller";
  const isActiveSeller =
    isSeller && profile?.status === "active";

  function redirectTo(path: string) {
    const destination = request.nextUrl.clone();
    const [nextPathname, query = ""] = path.split("?", 2);

    destination.pathname = nextPathname;
    destination.search = query ? `?${query}` : "";

    const redirectResponse = NextResponse.redirect(destination);

    response.cookies.getAll().forEach(({ name, value }) => {
      redirectResponse.cookies.set(name, value);
    });

    redirectResponse.headers.set(
      "Cache-Control",
      "private, no-store"
    );

    return redirectResponse;
  }

  function unauthorizedApiResponse(status: 401 | 403) {
    const apiResponse = NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status }
    );

    response.cookies.getAll().forEach(({ name, value }) => {
      apiResponse.cookies.set(name, value);
    });

    apiResponse.headers.set("Cache-Control", "private, no-store");
    return apiResponse;
  }

  if (pathname === "/admin/login") {
    return redirectTo(isAdmin ? "/admin" : "/login");
  }

  if (isAdminApiRoute) {
    if (!isLoggedIn) {
      return unauthorizedApiResponse(401);
    }

    if (!isAdmin) {
      return unauthorizedApiResponse(403);
    }
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const redirectPath =
        pathname + request.nextUrl.search;

      return redirectTo(
        `/login?redirect=${encodeURIComponent(redirectPath)}`
      );
    }

    if (!isAdmin) {
      return redirectTo(
        isSeller ? "/seller" : "/login?error=unauthorized"
      );
    }
  }

  if (isSellerRoute) {
    if (!isLoggedIn) {
      const redirectPath =
        pathname + request.nextUrl.search;

      return redirectTo(
        `/seller/login?redirect=${encodeURIComponent(
          redirectPath
        )}`
      );
    }

    if (isAdmin) {
      return redirectTo("/admin");
    }

    if (!isSeller || profile?.status === "rejected") {
      return redirectTo(
        "/seller/login?error=unauthorized"
      );
    }

    if (isActiveSellerRoute && !isActiveSeller) {
      return redirectTo("/seller");
    }
  }

  if (isAdminLoginRoute && isLoggedIn) {
    if (isAdmin) {
      return redirectTo("/admin");
    }

    if (isSeller) {
      return redirectTo("/seller");
    }
  }

  if (isSellerLoginRoute && isLoggedIn) {
    if (isAdmin) {
      return redirectTo("/admin");
    }

    if (isSeller && profile?.status !== "rejected") {
      return redirectTo("/seller");
    }
  }

  return response;
}
