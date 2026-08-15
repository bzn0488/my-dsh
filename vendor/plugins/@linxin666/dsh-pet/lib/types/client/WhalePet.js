import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Whale-girl companion component — the browser half's centerpiece. Renders a
 * fixed-position floating sprite (React portal onto document.body), plays
 * the spritesheet track matching the host animation snapshot, and exposes
 * the interaction surface: click to pet, hover panel with feed/hide, drag to
 * reposition (persisted via setConfig).
 * @module @linxin666/dsh-pet/client/WhalePet
 */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { framePosition, FRAME_WIDTH, FRAME_HEIGHT, FRAME_COLUMNS, TRACKS, rowOfTrack, trimTrack, detectFrameCounts } from "./spritesheet.js";
import styles from './pet.module.css';
/** Browser URL of the whale-girl atlas (served by the host half's own route). */
export const PET_SPRITESHEET_URL = '/pet/whale/spritesheet.webp';
/** Browser URL of the whale-girl manifest (authoritative per-row frame counts). */
export const PET_MANIFEST_URL = '/pet/whale/pet.json';
/** Clamp a drag offset inside the viewport with a margin. */
function clampOffset(value, max) {
    return Math.max(0, Math.min(max, value));
}
/**
 * The floating pet. The spritesheet frame advances on requestAnimationFrame
 * with per-frame durations from TRACKS; the atlas image is loaded once and
 * the background position is written straight to the sprite element (no
 * per-frame React state).
 */
export function WhalePet(props) {
    const { snapshot, display, feedback } = props;
    const spriteRef = useRef(null);
    const floatRef = useRef(null);
    const [imageReady, setImageReady] = useState(false);
    const [frameCounts, setFrameCounts] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [nameDraft, setNameDraft] = useState('');
    const [dragPos, setDragPos] = useState(null);
    const dragRef = useRef(null);
    const hideTimerRef = useRef(null);
    const frameRef = useRef({
        track: null,
        index: 0,
        elapsed: 0,
    });
    // Load the atlas once; then resolve per-row frame counts so tracks never
    // play the transparent trailing cells of a short row. One decoded Image
    // feeds both the sprite render and the frame-count detection. The counts
    // prefer the authoritatively recorded `frames` field on the pet.json
    // manifest route and only fall back to the getImageData atlas scan when
    // that field is absent (older manifests).
    useEffect(() => {
        let cancelled = false;
        const img = new Image();
        img.onload = () => {
            if (cancelled)
                return;
            setImageReady(true);
            fetch(PET_MANIFEST_URL)
                .then((res) => (res.ok ? res.json() : Promise.resolve({})))
                .then((manifest) => {
                if (cancelled)
                    return;
                const frames = manifest.frames;
                if (Array.isArray(frames) && frames.length === 9 && frames.every((n) => typeof n === 'number')) {
                    setFrameCounts(frames);
                }
                else {
                    setFrameCounts(detectFrameCounts(img));
                }
            })
                .catch(() => {
                if (!cancelled)
                    setFrameCounts(detectFrameCounts(img));
            });
        };
        img.src = PET_SPRITESHEET_URL;
        return () => {
            cancelled = true;
            img.onload = null;
        };
    }, []);
    // Frame loop: advance the current track and write background-position.
    // Offsets must be in SCALED coordinates (background-position applies to the
    // scaled background image), so the current sprite scale rides a ref that
    // the loop reads every tick. Under prefers-reduced-motion the sprite holds
    // its track's first frame instead of animating (presentation-only; the
    // animation state machine is untouched).
    const spriteScale = display.size / FRAME_HEIGHT;
    const animation = snapshot?.animation ?? 'idle';
    const scaleRef = useRef(spriteScale);
    scaleRef.current = spriteScale;
    useEffect(() => {
        const reduceMotion = typeof window !== 'undefined'
            && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
        // Paint one static sprite frame up front either way, so the pet is never
        // blank while the loop heat-up runs.
        const row = rowOfTrack(animation);
        const track = frameCounts === null
            ? TRACKS[animation]
            : trimTrack(TRACKS[animation], frameCounts[row] ?? TRACKS[animation].frames.length);
        const leadCol = track.frames[0];
        const lead = framePosition(row, leadCol, scaleRef.current);
        if (spriteRef.current !== null) {
            spriteRef.current.style.backgroundPosition = `${lead.x}px ${lead.y}px`;
        }
        if (reduceMotion)
            return;
        let raf = 0;
        let last = performance.now();
        const tick = (ts) => {
            const delta = ts - last;
            last = ts;
            // Trim the track to the row's real frame count (transparent cells
            // would render as a vanishing pet).
            const row = rowOfTrack(animation);
            const track = frameCounts === null
                ? TRACKS[animation]
                : trimTrack(TRACKS[animation], frameCounts[row] ?? TRACKS[animation].frames.length);
            const st = frameRef.current;
            if (st.track !== animation) {
                st.track = animation;
                st.index = 0;
                st.elapsed = 0;
            }
            st.elapsed += delta;
            const maxIndex = track.frames.length - 1;
            while (st.elapsed >= (track.durations[st.index] ?? 0) && st.index < maxIndex) {
                st.elapsed -= track.durations[st.index] ?? 0;
                st.index += 1;
            }
            if (st.elapsed >= (track.durations[st.index] ?? 0)) {
                if (track.loop) {
                    st.elapsed = 0;
                    st.index = 0;
                }
                else {
                    st.index = maxIndex; // hold the final frame; the host switches tracks
                }
            }
            const col = track.frames[st.index];
            const { x, y } = framePosition(row, col, scaleRef.current);
            if (spriteRef.current !== null) {
                spriteRef.current.style.backgroundPosition = `${x}px ${y}px`;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [animation, frameCounts]);
    // Auto-clear the feedback bubble after its CSS animation. The callback
    // rides a ref so re-renders never reset the timer: the 800ms poll rebuilds
    // `props` every tick, and depending on it would starve the timeout.
    const feedbackDoneRef = useRef(props.onFeedbackDone);
    feedbackDoneRef.current = props.onFeedbackDone;
    useEffect(() => {
        if (feedback === null)
            return;
        const timer = window.setTimeout(() => feedbackDoneRef.current(), 2600);
        return () => window.clearTimeout(timer);
    }, [feedback]);
    // Dragging: pointer events on the sprite; position is right/bottom based.
    // `draggedRef` records whether the pointer actually moved, so the browser's
    // trailing click (fired after pointerup) does not pet the whale.
    const draggedRef = useRef(false);
    const clearHideTimer = () => {
        if (hideTimerRef.current !== null) {
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    };
    const onPointerDown = (e) => {
        e.preventDefault();
        e.target.setPointerCapture?.(e.pointerId);
        const current = dragPos ?? { right: display.right, bottom: display.bottom };
        dragRef.current = { startX: e.clientX, startY: e.clientY, ...current };
        draggedRef.current = false;
        setHovered(false);
    };
    const onPointerMove = (e) => {
        const drag = dragRef.current;
        if (drag === null)
            return;
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4)
            draggedRef.current = true;
        const right = clampOffset(drag.right - dx, window.innerWidth - 40);
        const bottom = clampOffset(drag.bottom - dy, window.innerHeight - 40);
        setDragPos({ right, bottom });
    };
    const onPointerUp = () => {
        if (dragRef.current === null)
            return;
        dragRef.current = null;
        if (dragPos !== null)
            props.onDragEnd(dragPos.right, dragPos.bottom);
    };
    const pos = dragPos ?? { right: display.right, bottom: display.bottom };
    const spriteWidth = Math.round(FRAME_WIDTH * spriteScale);
    const spriteHeight = Math.round(FRAME_HEIGHT * spriteScale);
    const float = (_jsxs("div", { ref: floatRef, className: styles.float, style: { right: pos.right, bottom: pos.bottom, zIndex: 2147483000 }, onPointerEnter: () => {
            clearHideTimer();
            setHovered(true);
        }, onPointerLeave: (e) => {
            // The panel and bubble render OUTSIDE the container's box (absolute,
            // above the sprite), so moving onto them fires pointerleave on the
            // container. Treat a target still inside the container's DOM (the
            // overflowed panel) as "still hovering"; otherwise give the pointer a
            // short grace period to reach the panel across the gap above it. The
            // bridge (`.panel::after`) keeps the pointer inside the hit area, and
            // the grace period covers a slow mouse crossing the remaining sliver.
            const next = e.relatedTarget;
            if (next instanceof Node && floatRef.current?.contains(next))
                return;
            clearHideTimer();
            hideTimerRef.current = window.setTimeout(() => setHovered(false), 300);
        }, children: [_jsx("div", { ref: spriteRef, className: styles.sprite, style: {
                    width: spriteWidth,
                    height: spriteHeight,
                    backgroundImage: imageReady ? `url(${PET_SPRITESHEET_URL})` : undefined,
                    backgroundSize: `${FRAME_WIDTH * FRAME_COLUMNS * spriteScale}px ${FRAME_HEIGHT * 9 * spriteScale}px`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '0 0',
                    cursor: dragRef.current === null ? 'grab' : 'grabbing',
                }, onPointerDown: onPointerDown, onPointerMove: onPointerMove, onPointerUp: onPointerUp, onClick: () => {
                    // A pointer sequence that moved (dragged) still fires a trailing
                    // click; skip the pet when that happened.
                    if (draggedRef.current)
                        return;
                    props.onPet();
                }, role: "button", "aria-label": "whale girl" }), feedback !== null && (_jsx("div", { className: `${styles.bubble} ${feedback.kind === 'feed' ? styles.bubbleFeed : styles.bubblePet}`, children: feedback.text }, feedback.at)), hovered && dragRef.current === null && (_jsx("div", { className: styles.panel, onPointerEnter: () => {
                    // Reaching the panel (or its bridge) must cancel any hide timer
                    // the container's pointerleave may have armed while the pointer
                    // crossed the sliver between the sprite and the panel.
                    clearHideTimer();
                }, children: renaming ? (_jsxs("div", { className: styles.renameRow, children: [_jsx("input", { className: styles.nameInput, value: nameDraft, maxLength: 20, placeholder: props.t('pet.namePlaceholder'), autoFocus: true, onChange: (e) => setNameDraft(e.target.value), onKeyDown: (e) => {
                                if (e.key === 'Enter') {
                                    const trimmed = nameDraft.trim();
                                    if (trimmed !== '') {
                                        props.onRename(trimmed);
                                        setRenaming(false);
                                    }
                                }
                                else if (e.key === 'Escape') {
                                    setRenaming(false);
                                }
                            } }), _jsx("button", { type: "button", className: styles.action, onClick: () => {
                                const trimmed = nameDraft.trim();
                                if (trimmed !== '') {
                                    props.onRename(trimmed);
                                    setRenaming(false);
                                }
                            }, children: props.t('pet.confirm') })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.rankRow, children: [_jsx("span", { className: styles.nameCell, children: snapshot?.name ?? '鲸鱼娘' }), _jsx("span", { children: props.t('pet.rank', { rank: snapshot?.affinity.rank ?? '?' }) })] }), _jsxs("div", { className: styles.rankRow, children: [_jsx("span", { children: props.t('pet.treats', { n: snapshot?.treats.stocked ?? 0 }) }), _jsx("span", { children: props.t('pet.points', { points: snapshot?.affinity.points ?? 0 }) })] }), _jsxs("div", { className: styles.actions, children: [_jsx("button", { type: "button", className: styles.action, onClick: props.onFeed, children: props.t('pet.feed') }), _jsx("button", { type: "button", className: styles.action, onClick: () => {
                                        setNameDraft(snapshot?.name ?? '');
                                        setRenaming(true);
                                    }, children: props.t('pet.rename') }), _jsx("button", { type: "button", className: styles.action, onClick: props.onHide, children: props.t('pet.hide') })] })] })) }))] }));
    return createPortal(float, document.body);
}
