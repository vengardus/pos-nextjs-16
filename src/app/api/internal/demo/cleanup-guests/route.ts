import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { updateTagsAction } from "@/server/next/actions/updateTags.action";

const parseBearerToken = (authorizationHeader: string | null): string => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return "";
  }

  return authorizationHeader.slice(7).trim();
};

export async function POST(request: NextRequest) {
  const configuredToken = process.env.DEMO_CLEANUP_TOKEN ?? "";
  const incomingToken = parseBearerToken(request.headers.get("authorization"));

  if (!configuredToken || incomingToken !== configuredToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get("dryRun") === "1";

  const policies = await prisma.demoPolicyModel.findMany({
    where: { isEnabled: true },
    select: {
      companyId: true,
      guestTtlDays: true,
    },
  });

  let totalCandidates = 0;
  let totalDeleted = 0;

  for (const policy of policies) {
    // const cutoff = new Date(Date.now() - policy.guestTtlDays * 24 * 60 * 60 * 1000);
    const cutoff = new Date(); // Test: ahora mismo (borra todo)

    const candidates = await prisma.userModel.findMany({
      where: {
        roleId: UserRole.GUEST,
        createdAt: { lt: cutoff },
        BranchUser: {
          some: {
            Branch: {
              companyId: policy.companyId,
            },
          },
        },
      },
      select: { id: true },
      take: 1000,
    });

    totalCandidates += candidates.length;

    if (!dryRun && candidates.length) {
      const deleted = await prisma.userModel.deleteMany({
        where: {
          id: {
            in: candidates.map((candidate) => candidate.id),
          },
          roleId: UserRole.GUEST,
        },
      });

      totalDeleted += deleted.count;
      console.log(`Deleted ${deleted.count} guest users for company ${policy.companyId}`);
      await updateTagsAction(["logs", "users", "pos", "dashboard", `cash-register-movements-totals-${policy.companyId}`]);
    }
  }

  return NextResponse.json({
    success: true,
    dryRun,
    totalCandidates,
    totalDeleted,
  });
}
