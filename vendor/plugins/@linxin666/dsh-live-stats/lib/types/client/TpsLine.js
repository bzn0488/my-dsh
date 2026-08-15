import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
/** Format throughput with one decimal below 100 tok/s. */
export function formatTokensPerSecond(value) {
    return String(value < 100 ? Math.round(value * 10) / 10 : Math.round(value));
}
const STYLE = {
    boxSizing: 'border-box',
    color: 'var(--dsw-alias-label-tertiary)',
    fontSize: '12px',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: '20px',
    margin: '0 auto',
    maxWidth: 'var(--dsh-chat-content-width)',
    overflow: 'hidden',
    padding: '0 var(--dsh-composer-side-clearance)',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
};
/** Second composer-status line for active or latest response throughput. */
export const TpsLine = memo(function TpsLine({ useProjection }) {
    const rate = useProjection('liveTokenUsage')?.tokensPerSecond;
    if (rate === undefined)
        return null;
    return _jsxs("div", { style: STYLE, children: ["TPS ", formatTokensPerSecond(rate), " tok/s"] });
});
/**
 * Composer-dock entry: adapts the session-scoped `conversation.composer.dock`
 * runtime share to the TPS line. The dock is the shipped stats-line seat, and
 * its standard kit supplies `useProjection` (the fifth framework hook seat),
 * which reads the host's `liveTokenUsage` projection. Registering here makes
 * the live TPS row actually mount — previously the TpsLine was only exported
 * and never mounted on rc.6 (issue #56).
 */
export const TpsLineDockEntry = memo(function TpsLineDockEntry(props) {
    return _jsx(TpsLine, { useProjection: props.useProjection });
});
