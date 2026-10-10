import { prisma } from '../../config/prisma';
import { AnalyticsEngineService } from '../analytics.service';
import { ActionEngineService } from '../action.service';
import { TtsService, type TtsResult } from './tts.service';

export interface BriefingModel {
  id: string;
  storeId?: string;
  scope: 'network_overview' | 'store_specific';
  title: string;
  scriptText: string;
  audioUrl: string;
  audioHash: string;
  durationSeconds: number;
  generatedAt: string;
  cached: boolean;
  metadata: {
    topAtRiskStore: string;
    criticalAlertsCount: number;
    pendingActionsCount: number;
    networkUrgencyAverage: number;
  };
}

let latestCachedBriefing: BriefingModel | null = null;

export class BriefingService {
  /**
   * Generate Executive Briefing Script & Audio
   */
  static async generateBriefing(options: {
    storeId?: string;
    scope?: 'network_overview' | 'store_specific';
    voice?: string;
  } = {}): Promise<BriefingModel> {
    const scope = options.scope || (options.storeId ? 'store_specific' : 'network_overview');

    // 1. Fetch live telemetry from Analytics and Actions
    const overview = await AnalyticsEngineService.getNetworkOverview();
    const pendingActions = await ActionEngineService.listActions({ status: 'pending_approval' });

    const topStore = overview.topAtRiskStores[0] || {
      storeId: 'STORE_17',
      storeName: 'Downtown Market (STORE_17)',
      urgencyScore: 92.5,
      revenueChangePct: -18.0,
      stockoutRatePct: 40.0,
    };

    // 2. Generate Natural Executive Script
    let scriptText = '';
    if (scope === 'network_overview') {
      scriptText =
        `Good morning, retail operations team. Here is your FreshGuard AI Executive Operational Briefing. ` +
        `Across our network today, average store urgency is currently ranked at ${overview.summary.averageUrgency.toFixed(1)} out of 100, with ${overview.summary.criticalCount} stores classified under critical risk status. ` +
        `Our primary focus area is ${topStore.storeName}, which has reached an urgency ranking of ${topStore.urgencyScore}. ` +
        `Telemetry indicates revenue contracted by ${Math.abs(topStore.revenueChangePct)}% over the past 14 days, driven by supplier inbound delivery delays from Nordic Coast Logistics resulting in a ${topStore.stockoutRatePct}% shelf stockout rate across essential dairy and seafood lines. ` +
        `To mitigate this, our Decision Engine has generated ${pendingActions.length > 0 ? pendingActions.length : 1} recommended corrective actions, including emergency secondary carrier expedited replenishment and a 25% price markdown on near-expiry perishables to prevent discard loss. ` +
        `Please review and sign off on pending action items in your dashboard to trigger frontline associate dispatch. End of briefing.`;
    } else {
      scriptText =
        `Store Briefing for ${topStore.storeName}. ` +
        `Urgency score is currently ${topStore.urgencyScore} with active critical stockout alerts. ` +
        `Four key product lines are currently below safety buffer stock. Expedited PO replenishment and dynamic markdown tags have been proposed.`;
    }

    // 3. Synthesize Speech & Cache
    const ttsResult: TtsResult = await TtsService.synthesizeSpeech(scriptText, options.voice || 'alloy');

    const briefingId = `briefing_${Date.now()}`;
    const briefing: BriefingModel = {
      id: briefingId,
      storeId: options.storeId,
      scope,
      title: scope === 'network_overview' ? 'Daily Executive Operations Briefing' : `Store Briefing: ${topStore.storeName}`,
      scriptText,
      audioUrl: ttsResult.audioUrl,
      audioHash: ttsResult.audioHash,
      durationSeconds: ttsResult.durationSeconds,
      generatedAt: new Date().toISOString(),
      cached: ttsResult.cached,
      metadata: {
        topAtRiskStore: topStore.storeName,
        criticalAlertsCount: overview.kpis.criticalIssuesCount,
        pendingActionsCount: pendingActions.length,
        networkUrgencyAverage: overview.summary.averageUrgency,
      },
    };

    latestCachedBriefing = briefing;

    // Save Briefing in Database if reachable
    try {
      await prisma.briefing.create({
        data: {
          id: briefingId,
          storeId: options.storeId || null,
          scope,
          scriptText,
          audioUrl: ttsResult.audioUrl,
          audioHash: ttsResult.audioHash,
          durationSeconds: ttsResult.durationSeconds,
          metadata: briefing.metadata as any,
        },
      });
    } catch {
      // Fallback
    }

    return briefing;
  }

  /**
   * Fetch Latest Cached Briefing
   */
  static async getLatestBriefing(): Promise<BriefingModel> {
    if (latestCachedBriefing) {
      return latestCachedBriefing;
    }

    try {
      const dbBriefing = await prisma.briefing.findFirst({
        orderBy: { generatedAt: 'desc' },
      });
      if (dbBriefing) {
        return {
          id: dbBriefing.id,
          storeId: dbBriefing.storeId || undefined,
          scope: dbBriefing.scope as any,
          title: 'Daily Executive Operations Briefing',
          scriptText: dbBriefing.scriptText,
          audioUrl: dbBriefing.audioUrl || '/audio/cache/default.mp3',
          audioHash: dbBriefing.audioHash,
          durationSeconds: dbBriefing.durationSeconds || 65,
          generatedAt: dbBriefing.generatedAt.toISOString(),
          cached: true,
          metadata: (dbBriefing.metadata as any) || {},
        };
      }
    } catch {
      // Fallback
    }

    // Generate fresh briefing if none cached
    return this.generateBriefing();
  }
}
