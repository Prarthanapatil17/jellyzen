interface JellyfishSVGProps {
  size?: number;
  className?: string;
}

export default function JellyfishSVG({
  size = 320,
  className = "",
}: JellyfishSVGProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.45)}
      viewBox="0 0 220 320"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-labelledby="jellyfish-title"
    >
      <title id="jellyfish-title">Aura the jellyfish</title>
      <defs>
        <radialGradient id="bellGrad" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#B47CFF" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#6D5BFF" stopOpacity="0.80" />
          <stop offset="100%" stopColor="#4B8BFF" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id="innerGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#54D8FF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#54D8FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B47CFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#B47CFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="spotGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#54D8FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#54D8FF" stopOpacity="0" />
        </radialGradient>
        <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="110" cy="95" rx="105" ry="90" fill="url(#outerGlow)" />
      <path
        d="M25 108 Q22 40 110 22 Q198 40 195 108 Q175 135 110 140 Q45 135 25 108 Z"
        fill="url(#bellGrad)"
        filter="url(#glowFilter)"
      />
      <ellipse
        cx="95"
        cy="72"
        rx="45"
        ry="38"
        fill="url(#innerGlow)"
        opacity="0.7"
      />
      <ellipse cx="80" cy="55" rx="18" ry="14" fill="white" opacity="0.12" />
      <circle cx="75" cy="90" r="5" fill="url(#spotGrad)" opacity="0.8" />
      <circle cx="110" cy="95" r="7" fill="url(#spotGrad)" opacity="0.6" />
      <circle cx="145" cy="88" r="4" fill="url(#spotGrad)" opacity="0.8" />
      <circle cx="90" cy="70" r="3" fill="#B47CFF" opacity="0.7" />
      <circle cx="130" cy="72" r="3" fill="#B47CFF" opacity="0.7" />
      <path
        d="M40 128 Q55 148 70 130"
        stroke="#B47CFF"
        strokeWidth="2.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M70 136 Q85 155 100 137"
        stroke="#54D8FF"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M100 138 Q115 157 130 138"
        stroke="#B47CFF"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M130 135 Q145 153 160 133"
        stroke="#54D8FF"
        strokeWidth="2.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M160 126 Q175 145 188 122"
        stroke="#B47CFF"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M55 138 Q42 165 52 192 Q62 219 48 248"
        stroke="#B47CFF"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M78 141 Q70 170 76 198 Q82 226 72 255"
        stroke="#54D8FF"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.70"
      />
      <path
        d="M100 143 Q96 173 100 202 Q104 231 97 260"
        stroke="#B47CFF"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.80"
      />
      <path
        d="M122 143 Q126 172 122 200 Q118 228 126 256"
        stroke="#54D8FF"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.70"
      />
      <path
        d="M144 141 Q152 168 146 195 Q140 222 150 250"
        stroke="#B47CFF"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M165 137 Q176 163 168 190 Q160 217 170 244"
        stroke="#54D8FF"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M88 140 Q83 158 88 175"
        stroke="#FF7AD9"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M110 142 Q107 160 112 177"
        stroke="#FF7AD9"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M132 140 Q137 158 132 175"
        stroke="#FF7AD9"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
