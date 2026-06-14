import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updateData: any = {};

    if (name) {
      updateData.name = name;
    }

    // Handle password change
    if (currentPassword && newPassword) {
      if (!user.password) {
        return new NextResponse(
          "User does not have a password (signed in via provider)",
          { status: 400 },
        );
      }

      const isPasswordValid = await compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return new NextResponse("Invalid current password", { status: 400 });
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return new NextResponse(
          "New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
          { status: 400 },
        );
      }

      updateData.password = await hash(newPassword, 12);
    }

    if (Object.keys(updateData).length === 0) {
      return new NextResponse("No data to update", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error("USER_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
