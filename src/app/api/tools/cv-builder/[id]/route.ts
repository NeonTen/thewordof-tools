import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const resume = await prisma.savedResume.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!resume) return new NextResponse("Resume not found", { status: 404 });

    return NextResponse.json({ success: true, resume });
  } catch (e: any) {
    return new NextResponse(e.message || "Internal Server Error", {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const existing = await prisma.savedResume.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) return new NextResponse("Resume not found", { status: 404 });

    await prisma.savedResume.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return new NextResponse(e.message || "Internal Server Error", {
      status: 500,
    });
  }
}
