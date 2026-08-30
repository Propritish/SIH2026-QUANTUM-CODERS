import React from "react";

// Shared illustration: a stylised Odissi dancer in Tribhangi (three-bend)
// pose, gold temple-relief silhouette. Odissi originated in Odisha's
// temples -- Konark's own Nata Mandir (dance hall) is carved with
// dancers in this exact stance -- so this is a direct visual link to
// the app's subject. Used by WelcomeSplash and the LoginPage hero panel.
export default function OdissiDancer({ className, color = "#E8A33D" }) {
  return (
    <svg className={className} viewBox="0 0 200 320" aria-hidden="true">
      <g fill={color}>
        <ellipse cx="92" cy="298" rx="30" ry="6" opacity="0.18" />

        <path d="M 106 192 C 122 198 136 206 140 220 C 142 227 138 232 132 230
                 C 128 229 128 224 124 220 C 116 234 108 238 100 236
                 C 104 226 110 218 108 208 C 107 202 104 196 96 194 Z" />

        <path d="M 82 190 C 79 206 77 222 78 238 C 78 258 76 276 74 294
                 L 84 294 C 87 276 90 258 91 238 C 92 222 93 206 92 190 Z" />

        <path d="M 78 132 C 60 154 49 178 46 200 C 78 212 116 212 146 199
                 C 142 178 129 155 114 134 C 103 143 89 143 78 132 Z" />
        <g stroke="#8A6A2A" strokeWidth="1.1" opacity="0.45">
          <line x1="84" y1="137" x2="62" y2="199" />
          <line x1="92" y1="141" x2="78" y2="204" />
          <line x1="101" y1="142" x2="96" y2="206" />
          <line x1="109" y1="140" x2="114" y2="205" />
          <line x1="116" y1="136" x2="130" y2="200" />
        </g>

        <path d="M 76 68 C 70 84 72 100 78 132 C 89 142 103 142 114 134
                 C 120 100 122 84 116 66 C 104 76 88 76 76 68 Z" />

        <path d="M 78 72 C 60 82 48 98 44 118 C 43 124 48 127 52 123
                 C 56 108 66 94 82 84 Z" />
        <path d="M 44 116 C 40 118 37 123 39 128 C 41 132 47 132 50 128
                 C 52 124 50 119 44 116 Z" />

        <path d="M 114 66 C 130 54 142 38 146 22 C 147 17 152 16 154 21
                 C 151 40 138 58 120 72 Z" />
        <path d="M 144 18 C 142 13 145 8 150 8 C 155 8 158 13 155 18
                 C 152 22 147 22 144 18 Z" />

        <path d="M 90 58 C 90 64 91 68 93 72 L 103 72 C 105 68 106 64 106 58 Z" />
        <circle cx="94" cy="42" r="17" />

        <path d="M 82 28 C 87 18 101 18 106 28 C 100 24 88 24 82 28 Z" />
        <circle cx="79" cy="33" r="2.4" />
        <circle cx="109" cy="33" r="2.4" />
      </g>
    </svg>
  );
}
