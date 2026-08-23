import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management - Admin",
  alternates: {
    canonical: "/admin/users",
  },
};

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
