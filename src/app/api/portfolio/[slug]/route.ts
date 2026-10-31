import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const portfolioItem = await prisma.portfolioItem.findFirst({
      where: {
        slug,
        isPublic: true,
      },
      include: {
        simulation: {
          include: {
            company: true,
            team: true,
            role: {
              include: {
                profession: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
      },
    });

    if (!portfolioItem) {
      return apiError("Verified portfolio credential not found or is set to private", 404, "NOT_FOUND");
    }

    return apiSuccess({ portfolioItem });
  } catch (err) {
    return handleApiError(err);
  }
}
