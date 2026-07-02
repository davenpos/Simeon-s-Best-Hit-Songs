'use client';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AlertBanner from './AlertBanner';
import Form from './Form';
import Modal from './Modal';
import { useAlert } from '@/hooks/useAlert';
import { AdminSong, AdminSongListProps } from '@/types/interfaces';

type ListItem =
  | { type: 'insert'; rank: number; key: string }
  | { type: 'song'; song: AdminSong; key: string };

type FormState = { mode: 'add'; rank: number } | { mode: 'edit'; song: AdminSong };

function buildListItems(songs: AdminSong[]): ListItem[] {
  if (songs.length === 0) return [{ type: 'insert', rank: 1, key: 'insert-1' }];

  const items: ListItem[] = [];

  for (const song of songs) {
    items.push({ type: 'insert', rank: song.rank, key: `insert-${song.rank}` });
    items.push({ type: 'song', song, key: `song-${song.id}` });
  }

  items.push({
    type: 'insert',
    rank: songs[songs.length - 1].rank + 1,
    key: 'insert-end',
  });

  return items;
}

function getItemHeight(item: ListItem) {
  return item.type === 'insert' ? 32 : 48;
}

function findStartIndex(offsets: number[], heights: number[], scrollTop: number) {
  let low = 0;
  let high = offsets.length - 1;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (offsets[mid] + heights[mid] <= scrollTop) low = mid + 1;
    else high = mid;
  }

  return low;
}

export default function AdminSongList({ initialSongs }: AdminSongListProps) {
  const router = useRouter();
  const { visible, message, severity, showAlert } = useAlert();
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);
  const pendingSongRef = useRef<AdminSong | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const dragRowRef = useRef<HTMLElement | null>(null);
  const draggingSongRef = useRef<AdminSong | null>(null);

  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(600);
  const [formState, setFormState] = useState<FormState | null>(null);
  const [isFormClosing, setIsFormClosing] = useState(false);
  const [draggingSong, setDraggingSong] = useState<AdminSong | null>(null);
  const [dragOverRank, setDragOverRank] = useState<number | null>(null);

  const songs = initialSongs;
  const isModalActive = formState !== null;
  const isDragging = draggingSong !== null;
  const interactionsBlocked = isModalActive || isDragging;

  useEffect(() => {
    draggingSongRef.current = draggingSong;
  }, [draggingSong]);

  const items = useMemo(() => buildListItems(songs), [songs]);

  const { offsets, heights, totalHeight } = useMemo(() => {
    const heights = items.map(getItemHeight);
    let offset = 0;
    const offsets = items.map((_, index) => {
      const start = offset;
      offset += heights[index];
      return start;
    });

    return { offsets, heights, totalHeight: offset };
  }, [items]);

  const visibleRange = useMemo(() => {
    if (items.length === 0) return { start: 0, end: 0 };

    const start = Math.max(0, findStartIndex(offsets, heights, scrollTop) - 8);
    const end = Math.min(
      items.length,
      findStartIndex(offsets, heights, scrollTop + viewportHeight) + 9,
    );

    return { start, end };
  }, [items.length, offsets, heights, scrollTop, viewportHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateViewport = () => setViewportHeight(container.clientHeight);
    updateViewport();

    const observer = new ResizeObserver(updateViewport);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);

  const closeFormModal = useCallback(() => {
    if (!formState || isFormClosing) return;

    setIsFormClosing(true);

    closeTimeoutRef.current = window.setTimeout(() => {
      setFormState(null);
      setIsFormClosing(false);
      closeTimeoutRef.current = null;
    }, 200);
  }, [formState, isFormClosing]);

  const handleFormSuccess = useCallback(() => {
    window.setTimeout(() => {
      closeFormModal();
      router.refresh();
    }, 600);
  }, [closeFormModal, router]);

  const handleReorder = useCallback(
    async (song: AdminSong, toRank: number) => {
      const maxRank = songs[songs.length - 1]?.rank ?? 0;
      const effectiveToRank = toRank === maxRank + 1 ? maxRank : toRank;

      if (song.rank === effectiveToRank || song.rank === effectiveToRank - 1) return;

      const response = await fetch('/api/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songId: song.id,
          fromRank: song.rank,
          toRank: effectiveToRank,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert(data.message ?? 'Song reordered successfully!', 'success');
        router.refresh();
      } else {
        showAlert(data.message ?? 'Failed to reorder song', 'error');
      }
    },
    [router, showAlert, songs],
  );

  useEffect(() => {
    if (!isDragging) return;

    document.body.classList.add('select-none');

    return () => {
      document.body.classList.remove('select-none');
    };
  }, [isDragging]);

  function clearLongPressTimer() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  const finishPointerInteraction = useCallback((event: PointerEvent) => {
    clearLongPressTimer();
    dragRowRef.current?.releasePointerCapture?.(event.pointerId);

    pendingSongRef.current = null;
    activePointerIdRef.current = null;
    dragRowRef.current = null;
    pointerStartRef.current = null;
  }, []);

  const updateDragOverRank = useCallback((event: PointerEvent) => {
    const zone = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest('[data-insert-rank]');

    if (zone) setDragOverRank(parseInt(zone.getAttribute('data-insert-rank')!, 10));
    else setDragOverRank(null);
  }, []);

  useEffect(() => {
    function onDocumentPointerMove(event: PointerEvent) {
      if (activePointerIdRef.current !== event.pointerId) return;

      if (draggingSongRef.current) {
        event.preventDefault();
        updateDragOverRank(event);
      }
    }

    function onDocumentPointerUp(event: PointerEvent) {
      if (activePointerIdRef.current !== event.pointerId) return;

      const draggedSong = draggingSongRef.current;

      if (draggedSong) {
        event.preventDefault();
        const zone = document
          .elementFromPoint(event.clientX, event.clientY)
          ?.closest('[data-insert-rank]');

        if (zone) {
          const toRank = parseInt(zone.getAttribute('data-insert-rank')!, 10);
          void handleReorder(draggedSong, toRank);
        }

        suppressClickRef.current = true;
        setDraggingSong(null);
        setDragOverRank(null);
        finishPointerInteraction(event);
        return;
      }

      const pendingSong = pendingSongRef.current;

      finishPointerInteraction(event);

      if (pendingSong && !suppressClickRef.current && formState === null) {
        setFormState({ mode: 'edit', song: pendingSong });
        setIsFormClosing(false);
        return;
      }

      suppressClickRef.current = false;
    }

    function onDocumentPointerCancel(event: PointerEvent) {
      if (activePointerIdRef.current !== event.pointerId) return;

      setDraggingSong(null);
      setDragOverRank(null);
      finishPointerInteraction(event);
      suppressClickRef.current = false;
    }

    document.addEventListener('pointermove', onDocumentPointerMove);
    document.addEventListener('pointerup', onDocumentPointerUp);
    document.addEventListener('pointercancel', onDocumentPointerCancel);

    return () => {
      document.removeEventListener('pointermove', onDocumentPointerMove);
      document.removeEventListener('pointerup', onDocumentPointerUp);
      document.removeEventListener('pointercancel', onDocumentPointerCancel);
    };
  }, [finishPointerInteraction, formState, handleReorder, updateDragOverRank]);

  function openAddModal(rank: number) {
    if (interactionsBlocked) return;
    setFormState({ mode: 'add', rank });
    setIsFormClosing(false);
  }

  function handleSongPointerDown(event: React.PointerEvent, song: AdminSong) {
    if (isModalActive || isDragging) return;

    event.preventDefault();

    pendingSongRef.current = song;
    activePointerIdRef.current = event.pointerId;
    dragRowRef.current = event.currentTarget as HTMLElement;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    suppressClickRef.current = false;
    clearLongPressTimer();

    dragRowRef.current.setPointerCapture(event.pointerId);

    longPressTimerRef.current = window.setTimeout(() => {
      longPressTimerRef.current = null;
      pendingSongRef.current = song;
      setDraggingSong(song);
      document.body.classList.add('select-none');
    }, 400);
  }

  return (
    <>
      <AlertBanner visible={visible} message={message} severity={severity} />

      <div
        ref={containerRef}
        className="h-[calc(100vh-10rem)] overflow-y-auto rounded-2xl border border-white/20 bg-white/10 shadow-xl shadow-lime-900/20 backdrop-blur-sm select-none"
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <div className="relative" style={{ height: totalHeight }}>
          {items.slice(visibleRange.start, visibleRange.end).map((item, sliceIndex) => {
            const index = visibleRange.start + sliceIndex;
            const top = offsets[index];
            const height = heights[index];

            if (item.type === 'insert') {
              return (
                <div
                  key={item.key}
                  style={{ top, height }}
                  className="absolute inset-x-0"
                  data-insert-rank={item.rank}
                  onClick={() => openAddModal(item.rank)}
                >
                  <div
                    className={`group flex h-full items-center justify-center transition-colors ${
                      dragOverRank === item.rank
                        ? 'bg-lime-200/50'
                        : isDragging
                          ? 'bg-white/10'
                          : 'hover:bg-white/10'
                    } ${isModalActive ? 'pointer-events-none' : isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-lime-500 text-white shadow-sm transition-opacity ${
                        isDragging || dragOverRank === item.rank
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <AddIcon sx={{ fontSize: 18 }} />
                    </span>
                  </div>
                </div>
              );
            }

            const isDraggingRow = draggingSong?.id === item.song.id;

            return (
              <div
                key={item.key}
                style={{ top, height }}
                className={`absolute inset-x-0 flex touch-none items-center gap-3 border-b border-white/10 px-4 transition-opacity ${
                  isDraggingRow ? 'opacity-40 ring-2 ring-lime-200/60' : ''
                } ${
                  isModalActive
                    ? 'pointer-events-none'
                    : isDragging && !isDraggingRow
                      ? 'pointer-events-none'
                      : 'cursor-grab active:cursor-grabbing'
                }`}
                onPointerDown={(event) => handleSongPointerDown(event, item.song)}
              >
                <span className="inline-flex min-w-9 shrink-0 items-center justify-center rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold tabular-nums sm:text-sm">
                  #{item.song.rank}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-white">
                  {item.song.title}
                </span>
                <span className="min-w-0 flex-1 truncate text-lime-50/85">{item.song.artist}</span>
              </div>
            );
          })}
        </div>
      </div>

      {formState && (
        <Modal
          isClosing={isFormClosing}
          onClose={closeFormModal}
          titleId="admin-song-form-title"
          sizeClass="max-w-2xl"
        >
          <h2 id="admin-song-form-title" className="mb-4 pr-8 text-xl font-bold">
            {formState.mode === 'add' ? 'Add song' : 'Edit song'}
          </h2>
          <Form
            key={formState.mode === 'edit' ? formState.song.id : `add-${formState.rank}`}
            mode={formState.mode}
            rank={formState.mode === 'add' ? formState.rank : undefined}
            initialSong={formState.mode === 'edit' ? formState.song : undefined}
            onSuccess={handleFormSuccess}
            onNotify={showAlert}
          />
        </Modal>
      )}
    </>
  );
}
