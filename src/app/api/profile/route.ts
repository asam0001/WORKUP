import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateProfileInputSchema } from "@/types";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return apiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        profile: true,
        portfolio: {
          include: {
            simulation: {
              select: {
                title: true,
                slug: true,
                company: { select: { name: true } },
              },
            },
          },
        },
        workspaces: {
          include: {
            simulation: {
              select: {
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return apiError("User not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ user });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return apiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const validated = UpdateProfileInputSchema.parse(body);

    const updatedUser = await prisma.$transaction(async (tx) => {
      if (validated.name) {
        await tx.user.update({
          where: { id: session.userId },
          data: { name: validated.name },
        });
      }

      const profile = await tx.profile.upsert({
        where: { userId: session.userId },
        create: {
          userId: session.userId,
          headline: validated.headline,
          bio: validated.bio,
          experienceLevel: validated.experienceLevel || "beginner",
          githubUsername: validated.githubUsername,
          linkedinUrl: validated.linkedinUrl,
          portfolioWebsite: validated.portfolioWebsite,
        },
        update: {
          headline: validated.headline,
          bio: validated.bio,
          experienceLevel: validated.experienceLevel,
          githubUsername: validated.githubUsername,
          linkedinUrl: validated.linkedinUrl,
          portfolioWebsite: validated.portfolioWebsite,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: "PROFILE_UPDATED",
          entityType: "Profile",
          entityId: profile.id,
        },
      });

      return profile;
    });

    logger.info("User profile updated", { userId: session.userId });
    return apiSuccess({ profile: updatedUser });
  } catch (err) {
    return handleApiError(err);
  }
}
