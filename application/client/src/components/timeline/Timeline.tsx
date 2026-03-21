import { startTransition, useEffect, useState } from "react";

import { TimelineItem } from "@web-speed-hackathon-2026/client/src/components/timeline/TimelineItem";

interface Props {
  timeline: Models.Post[];
}

const INITIAL_VISIBLE_POST_COUNT = 6;

export const Timeline = ({ timeline }: Props) => {
  const [visiblePostCount, setVisiblePostCount] = useState(() =>
    Math.min(timeline.length, INITIAL_VISIBLE_POST_COUNT),
  );

  useEffect(() => {
    if (timeline.length <= INITIAL_VISIBLE_POST_COUNT) {
      setVisiblePostCount(timeline.length);
      return;
    }

    setVisiblePostCount((current) => Math.min(current, timeline.length));

    const animationFrameId = window.requestAnimationFrame(() => {
      startTransition(() => {
        setVisiblePostCount(timeline.length);
      });
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [timeline.length]);

  const visibleTimeline = timeline.slice(0, visiblePostCount);

  return (
    <section className="timeline-list">
      {visibleTimeline.map((post, idx) => {
        return <TimelineItem key={post.id} post={post} prioritizeMedia={idx < 2} />;
      })}
    </section>
  );
};
