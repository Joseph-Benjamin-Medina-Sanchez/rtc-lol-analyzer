import {
  MatchSummary,
  MatchTimeline,
  TimelineEvent,
} from "../domain/entities/riot-entities";
import {
  PlayerMatchMetrics,
  PlayerDeathIncident,
  MetricFrame,
  EventSeverity,
} from "../domain/entities/analysis-entities";
import { CoordinateNormalizer } from "../domain/services/coordinate-normalizer";

export class ProcessMatchTimelineUseCase {
  execute(
    summary: MatchSummary,
    timeline: MatchTimeline,
    targetPuuid: string
  ): PlayerMatchMetrics {
    const targetParticipant = summary.participants.find(
      (p) => p.puuid === targetPuuid
    );

    if (!targetParticipant) {
      throw new Error(`Participant with PUUID ${targetPuuid} not found`);
    }

    const participantId = targetParticipant.participantId;
    const deathIncidents = this.extractDeathIncidents(timeline, participantId);
    const progressionFrames = this.extractProgressionFrames(
      timeline,
      participantId
    );

    const kills = targetParticipant.kills;
    const deaths = targetParticipant.deaths;
    const assists = targetParticipant.assists;
    const ratio = deaths === 0 ? kills + assists : Number(((kills + assists) / deaths).toFixed(2));

    const criticalMistakesCount = deathIncidents.filter(
      (incident) => incident.severity === "high" || incident.severity === "critical"
    ).length;

    return {
      participantId,
      puuid: targetPuuid,
      championName: targetParticipant.championName,
      role: targetParticipant.role,
      lane: targetParticipant.lane,
      win: targetParticipant.win,
      kda: {
        kills,
        deaths,
        assists,
        ratio,
      },
      deathIncidents,
      progressionFrames,
      criticalMistakesCount,
    };
  }

  private extractDeathIncidents(
    timeline: MatchTimeline,
    participantId: number
  ): PlayerDeathIncident[] {
    const incidents: PlayerDeathIncident[] = [];
    const allEvents = timeline.frames.flatMap((f) => f.events);

    const objectiveEvents = allEvents.filter(
      (e) => e.type === "ELITE_MONSTER_KILL"
    );

    const deathEvents = allEvents.filter(
      (e) => e.type === "CHAMPION_KILL" && e.victimId === participantId
    );

    for (const death of deathEvents) {
      const nearObjective = this.checkObjectiveWindow(death.timestamp, objectiveEvents);
      const isIsolated = death.assistingParticipantIds ? death.assistingParticipantIds.length >= 2 : false;

      let severity: EventSeverity = "low";
      if (nearObjective.isNear && isIsolated) {
        severity = "critical";
      } else if (nearObjective.isNear || isIsolated) {
        severity = "high";
      } else if (death.timestamp > 1200000) {
        severity = "medium";
      }

      incidents.push({
        timestamp: death.timestamp,
        gameMinute: Math.floor(death.timestamp / 60000),
        killerId: death.killerId ?? 0,
        assistingParticipantIds: death.assistingParticipantIds ?? [],
        position: CoordinateNormalizer.toPercentages(death.position),
        isIsolated,
        nearObjectiveWindow: nearObjective.isNear,
        objectiveTypeNear: nearObjective.type,
        severity,
      });
    }

    return incidents;
  }

  private checkObjectiveWindow(
    deathTimestamp: number,
    objectiveEvents: TimelineEvent[]
  ): { isNear: boolean; type?: string } {
    const windowMs = 45000;

    for (const objective of objectiveEvents) {
      const delta = objective.timestamp - deathTimestamp;
      if (delta >= 0 && delta <= windowMs) {
        return { isNear: true, type: objective.monsterType };
      }
    }

    return { isNear: false };
  }

  private extractProgressionFrames(
    timeline: MatchTimeline,
    participantId: number
  ): MetricFrame[] {
    return timeline.frames.map((frame) => {
      const pFrame = frame.participantFrames[String(participantId)];

      return {
        minute: Math.floor(frame.timestamp / 60000),
        currentGold: pFrame?.currentGold ?? 0,
        totalGold: pFrame?.totalGold ?? 0,
        xp: pFrame?.xp ?? 0,
        cs: (pFrame?.minionsKilled ?? 0) + (pFrame?.jungleMinionsKilled ?? 0),
        level: pFrame?.level ?? 1,
        position: CoordinateNormalizer.toPercentages(pFrame?.position),
      };
    });
  }
}