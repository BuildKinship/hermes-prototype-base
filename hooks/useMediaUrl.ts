"use client";
// needed for useState/useEffect
// Hook: resolves an S3 key → fresh presigned URL via /api/media-url
// Never stores presigned URLs in Firestore; always fetches on-demand.

import { useState, useEffect } from "react";

type MediaUrlState =
  | { status: "loading"; url: null }
  | { status: "ready"; url: string }
  | { status: "error"; url: null; message: string };

/**
 * Given an S3 key (e.g. "gallery/baby-businessman-animated/video.mp4"),
 * returns a fresh 1-hour presigned URL. Returns null while loading.
 *
 * If `keyOrUrl` is already a full https:// URL (legacy stored presigned URL
 * or a direct CDN link), it is returned as-is without an API call.
 */
export function useMediaUrl(keyOrUrl: string | null | undefined): MediaUrlState {
  const [state, setState] = useState<MediaUrlState>({ status: "loading", url: null });

  useEffect(() => {
    if (!keyOrUrl) {
      setState({ status: "error", url: null, message: "No key provided" });
      return;
    }

    // If it's already a full URL (starts with http), use it directly.
    // This handles any legacy docs that still have a URL stored instead of a key.
    if (keyOrUrl.startsWith("http")) {
      setState({ status: "ready", url: keyOrUrl });
      return;
    }

    let cancelled = false;
    setState({ status: "loading", url: null });

    fetch(`/api/media-url?key=${encodeURIComponent(keyOrUrl)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.url) {
          setState({ status: "ready", url: data.url });
        } else {
          setState({ status: "error", url: null, message: data.error ?? "Unknown error" });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ status: "error", url: null, message: err.message });
      });

    return () => { cancelled = true; };
  }, [keyOrUrl]);

  return state;
}

/**
 * Resolves multiple S3 keys to presigned URLs in one batched set of requests.
 * Returns an array of URLs in the same order (null while pending).
 */
export function useMediaUrls(keysOrUrls: (string | null | undefined)[]): (string | null)[] {
  const [urls, setUrls] = useState<(string | null)[]>(() => keysOrUrls.map(() => null));

  useEffect(() => {
    if (!keysOrUrls.length) return;

    let cancelled = false;
    setUrls(keysOrUrls.map(() => null));

    Promise.all(
      keysOrUrls.map((k) => {
        if (!k) return Promise.resolve(null);
        if (k.startsWith("http")) return Promise.resolve(k);
        return fetch(`/api/media-url?key=${encodeURIComponent(k)}`)
          .then((r) => r.json())
          .then((d) => d.url ?? null)
          .catch(() => null);
      })
    ).then((resolved) => {
      if (!cancelled) setUrls(resolved);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keysOrUrls.join(",")]);

  return urls;
}
