import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.DEMO_CLEANUP_TOKEN}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const policies = await prisma.demoPolicyModel.findMany({ where: { isEnabled: true } });
  
  for (const policy of policies) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - policy.guestTtlDays);
    
    await prisma.userModel.deleteMany({
      where: {
        roleId: UserRole.GUEST,
        createdAt: { lt: cutoff },
        BranchUser: { some: { Branch: { companyId: policy.companyId } } }
      }
    });
  }

  return NextResponse.json({ success: true });
}
