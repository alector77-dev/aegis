import { useEffect, useRef } from "react";
import "./LPWheel.css";

type LPWheelProps = {
  lp: number;
  displayedLP: number;
  setDisplayedLP: React.Dispatch<React.SetStateAction<number>>;
  onPress: () => void;
  onLPCommit: (action: {
    type: "set" | "adjust";
    value: number;
    mergeWithPrevious?: boolean;
  }) => void;
  borderColour: string;
  side: "left" | "right";
};

const TOTAL_SEGMENTS = 40;
const LP_PER_SEGMENT = 200;
const MAX_LP = 8000;
const GAUGE_ARC = 330;

const colors = [
  "#FFD000",
  "#FFC000",
  "#FFB000",
  "#FFA000",
  "#FF9000",
  "#FF8000",
  "#FF7000",
  "#FF6000",
  "#FF5000",
  "#FF4000",
  "#FF3000",
  "#FF2200",
];

export default function LPWheel({
  lp,
  displayedLP,
  setDisplayedLP,
  onPress,
  onLPCommit,
  borderColour,
  side,
}: LPWheelProps) {
  const lastSegment = useRef<number | null>(null);
  const dragStartLP = useRef(lp);
  const dragging = useRef(false);

  const activeSegments = Math.min(
    Math.ceil((displayedLP / MAX_LP) * TOTAL_SEGMENTS),
    TOTAL_SEGMENTS,
  );

  useEffect(() => {
    setDisplayedLP(lp);
  }, [lp, setDisplayedLP]);

  function getSegmentFromTouch(x: number, y: number) {
    const centerX = 130;
    const centerY = 130;

    const dx = x - centerX;
    const dy = y - centerY;

    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    angle += 180;

    if (angle < 0) {
      angle += 360;
    }

    const segment = Math.round((angle / 360) * TOTAL_SEGMENTS);

    return Math.max(1, Math.min(TOTAL_SEGMENTS, segment));
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const segment = getSegmentFromTouch(x, y);

    lastSegment.current = segment;

    dragStartLP.current = lp;

    setDisplayedLP(lp);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const currentSegment = getSegmentFromTouch(x, y);

    if (lastSegment.current === null) {
      return;
    }

    let delta = currentSegment - lastSegment.current;

    if (delta > 20) {
      delta -= 40;
    }

    if (delta < -20) {
      delta += 40;
    }

    setDisplayedLP((prev) => {
      const base = prev ?? lp;

      return Math.max(0, base + delta * LP_PER_SEGMENT);
    });

    lastSegment.current = currentSegment;
  }

  function handlePointerUp() {
    if (!dragging.current) {
      return;
    }

    dragging.current = false;

    onLPCommit({
      type: "set",
      value: displayedLP,
    });
  }

  return (
    <div
      className="lp-wheel"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        
      }}
    >
      {/* -100 BUTTON */}

      <button
        type="button"
        className={`adjust-button minus ${side}`}
        onClick={() => {
          onLPCommit({
            type: "adjust",
            value: -100,
            mergeWithPrevious: true,
          });
        }}
      >
        <svg width="90" height="90" viewBox="0 0 90 90">
          <polygon
            points="
              45,12
              67.5,22
              67.5,68
              45,78
              22.5,68
              22.5,22
            "
            fill="#2A2A2A"
            stroke={borderColour}
            strokeWidth="3"
          />
        </svg>

        <span className="adjust-text">-100</span>
      </button>

      {/* +100 BUTTON */}

      <button
        type="button"
        className={`adjust-button plus ${side}`}
        onClick={() => {
          onLPCommit({
            type: "adjust",
            value: 100,
            mergeWithPrevious: true,
          });
        }}
      >
        <svg width="90" height="90" viewBox="0 0 90 90">
          <polygon
            points="
              45,12
              67.5,22
              67.5,68
              45,78
              22.5,68
              22.5,22
            "
            fill="#2A2A2A"
            stroke={borderColour}
            strokeWidth="3"
          />
        </svg>

        <span className="adjust-text">+100</span>
      </button>

      {/* MAIN SVG */}

      <svg width="260" height="260" viewBox="0 0 260 260">
        {/* OUTER RING */}

        <circle
          cx="130"
          cy="130"
          r="116"
          stroke={borderColour}
          strokeWidth="10"
          fill="none"
        />

        {/* INNER DISC */}

        <circle cx="130" cy="130" r="115" fill="#050505" />

        {/* DONUT RINGS */}

        <circle
          cx="130"
          cy="130"
          r="100"
          stroke="#58627A"
          strokeWidth="5"
          fill="none"
        />

        <circle
          cx="130"
          cy="130"
          r="76"
          stroke="#58627A"
          strokeWidth="5"
          fill="none"
        />

        {/* GAP */}

        <polygon
          points="
            29,113
            55,120
            55,141
            29,146
          "
          fill="#000000"
          stroke="#000000"
          strokeWidth="5"
        />

        <rect
          x="22"
          y="114.5"
          width="5"
          height="29"
          rx="2"
          fill="#58627A"
          transform="rotate(-76 25 110)"
        />

        <rect
          x="-15"
          y="105.5"
          width="5"
          height="29"
          rx="2"
          fill="#58627A"
          transform="rotate(-103 25 110)"
        />

        {/* SEGMENTS */}

        <g transform="translate(130 130)">
          {Array.from({ length: TOTAL_SEGMENTS }).map((_, index) => {
            const angle =
              (GAUGE_ARC / (TOTAL_SEGMENTS - 1)) * index + 285;

            const visible = index < activeSegments;

            const color =
              colors[
                Math.floor((index / TOTAL_SEGMENTS) * colors.length)
              ];

            const overhealed = displayedLP > MAX_LP;

            return (
              <g key={index} transform={`rotate(${angle})`}>
                <rect
                  x="-5"
                  y="-97"
                  width="10"
                  height="18"
                  rx="3"
                  fill={
                    visible
                      ? overhealed
                        ? "#FF2200"
                        : color
                      : "#1A1F2B"
                  }
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* CENTER BUTTON */}

      <button
        type="button"
        className="center-circle"
        onClick={onPress}
      >
        <span className="lp-text">{displayedLP}</span>
      </button>
    </div>
  );
}