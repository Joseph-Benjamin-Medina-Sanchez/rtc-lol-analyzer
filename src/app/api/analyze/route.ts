import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { RiotApiClient } from "@/infrastructure/api/riot-client";
import { ProcessMatchTimelineUseCase } from "@/core/use-cases/process-match-timeline.use-case";
import { AiAnalyzerClient } from "@/infrastructure/api/ai-client";
import {
  sampleMatchSummary,
  sampleMatchTimeline,
} from "@/infrastructure/fixtures/sample-match.fixture";
import { env } from "@/infrastructure/config/env";

const querySchema = z.object({
  gameName: z.string().optional(),
  tagLine: z.string().optional(),
  mock: z.enum(["true", "false"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validatedQuery = querySchema.safeParse(searchParams);

    if (!validatedQuery.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: validatedQuery.error.format() },
        { status: 400 }
      );
    }

    const isMock = validatedQuery.data.mock === "true" || env.USE_MOCK_DATA;
    const processor = new ProcessMatchTimelineUseCase();
    const aiAnalyzer = new AiAnalyzerClient();

    if (isMock) {
      const metrics = processor.execute(
        sampleMatchSummary,
        sampleMatchTimeline,
        "sample-player-puuid"
      );
      const evaluation = await aiAnalyzer.evaluateMatch(metrics);

      return NextResponse.json({
        source: "mock",
        matchId: sampleMatchSummary.matchId,
        metrics,
        evaluation,
      });
    }

    const { gameName, tagLine } = validatedQuery.data;

    if (!gameName || !tagLine) {
      return NextResponse.json(
        { error: "gameName and tagLine are required when not in mock mode" },
        { status: 400 }
      );
    }

    const riotClient = new RiotApiClient();
    const account = await riotClient.getAccountByRiotId(gameName, tagLine);
    const matchIds = await riotClient.getRecentMatchIdsByPuuid(account.puuid, 1);

    if (matchIds.length === 0) {
      return NextResponse.json(
        { error: "No recent matches found for this account" },
        { status: 404 }
      );
    }

    const targetMatchId = matchIds[0];
    const matchSummary = await riotClient.getMatchById(targetMatchId);
    const matchTimeline = await riotClient.getMatchTimelineById(targetMatchId);

    const metrics = processor.execute(
      matchSummary,
      matchTimeline,
      account.puuid
    );
    const evaluation = await aiAnalyzer.evaluateMatch(metrics);

    return NextResponse.json({
      source: "riot-api",
      matchId: targetMatchId,
      account: {
        gameName: account.gameName,
        tagLine: account.tagLine,
      },
      metrics,
      evaluation,
    });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.status?.message || error.message || "Internal server error";

    return NextResponse.json(
      { error: "Failed to analyze match", details: message },
      { status }
    );
  }
}