import type { UseProjection } from '@deepseek-ai/dsh-client-runtime/client';
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** Props supplied by the session-scoped composer dock. */
export interface TpsLineProps {
    useProjection: UseProjection;
}
/** Format throughput with one decimal below 100 tok/s. */
export declare function formatTokensPerSecond(value: number): string;
/** Second composer-status line for active or latest response throughput. */
export declare const TpsLine: import("react").NamedExoticComponent<TpsLineProps>;
/**
 * Composer-dock entry: adapts the session-scoped `conversation.composer.dock`
 * runtime share to the TPS line. The dock is the shipped stats-line seat, and
 * its standard kit supplies `useProjection` (the fifth framework hook seat),
 * which reads the host's `liveTokenUsage` projection. Registering here makes
 * the live TPS row actually mount — previously the TpsLine was only exported
 * and never mounted on rc.6 (issue #56).
 */
export declare const TpsLineDockEntry: import("react").NamedExoticComponent<PropsRuntime<"conversation.composer.dock">>;
//# sourceMappingURL=TpsLine.d.ts.map