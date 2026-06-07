// Flat geometric SVG flag renderer
// Each flag is defined by a simple shape descriptor + colour palette

var FLAG_DEFS = {
  ARG: { s:'h',  c:['#74ACDF','#FFF','#74ACDF'] },
  BRA: { s:'bra', c:['#009C3B','#FFDF00','#002776'] },
  ENG: { s:'cross', c:['#FFF','#CF142B'] },
  FRA: { s:'v',  c:['#002395','#FFF','#ED2939'] },
  GER: { s:'h',  c:['#111','#DD0000','#FFCE00'] },
  ESP: { s:'h',  c:['#AA151B','#F1BF00','#AA151B'] },
  POR: { s:'v2', c:['#006600','#FF0000'] },
  NED: { s:'h',  c:['#AE1C28','#FFF','#21468B'] },
  MAR: { s:'sol',c:['#C1272D'], a:'#006233' },
  JPN: { s:'circ',c:['#FFF','#BC002D'] },
  USA: { s:'usa',c:['#B22234','#FFF','#3C3B6E'] },
  MEX: { s:'v',  c:['#006847','#FFF','#CE1126'] },
  CAN: { s:'v',  c:['#FF0000','#FFF','#FF0000'] },
  AUS: { s:'aus',c:['#00008B','#FF0000','#FFF'] },
  KOR: { s:'kor', c:['#FFF','#CD2E3A','#003478'] },
  SEN: { s:'v',  c:['#00853F','#FDEF42','#E31B23'] },
  NGA: { s:'v',  c:['#008751','#FFF','#008751'] },
  COL: { s:'h3', c:['#FCD116','#003087','#CE1126'] },
  URU: { s:'h',  c:['#5EB6E4','#FFF','#5EB6E4'] },
  BEL: { s:'v',  c:['#111','#FAE042','#EF3340'] },
  CRO: { s:'h',  c:['#FF0000','#FFF','#0093DD'] },
  SRB: { s:'h',  c:['#C6363C','#0C4076','#FFF'] },
  SUI: { s:'crossw', c:['#FF0000'], a:'#FFF' },
  ECU: { s:'h3', c:['#FFD100','#034EA2','#EF3340'] },
  POL: { s:'h2', c:['#FFF','#DC143C'] },
  DEN: { s:'cross', c:['#C60C30','#FFF'] },
  QAT: { s:'v2', c:['#FFF','#8D1B3D'] },
  KSA: { s:'h2', c:['#006C35','#FFF'] },
  IRN: { s:'h',  c:['#239F40','#FFF','#DA0000'] },
  GHA: { s:'h3', c:['#006B3F','#FCD116','#EE1C25'] },
  TUN: { s:'circ2', c:['#E70013','#FFF'] },
  CMR: { s:'v',  c:['#007A5E','#CE1126','#FCD116'] },
  // New teams for 2026
  RSA: { s:'h3', c:['#007A4D','#FFB81C','#DE3831'] },  // South Africa
  CZE: { s:'h2', c:['#FFF','#D7141A'], a:'#11457E' },   // Czechia (bicolour + blue triangle, simplified)
  BIH: { s:'diag',c:['#002395','#FFCD00'] },             // Bosnia (simplified)
  HAI: { s:'h2', c:['#00209F','#D21034'] },              // Haiti
  SCO: { s:'cross',c:['#003DA5','#FFF'] },               // Scotland (St Andrew's cross)
  PAR: { s:'h',  c:['#D52B1E','#FFF','#0038A8'] },       // Paraguay
  TUR: { s:'circ2',c:['#E30A17','#FFF'] },               // Turkey (crescent simplified as offset circle)
  CUW: { s:'diag',c:['#002B7F','#F9E814'] },             // Curaçao (simplified)
  CIV: { s:'v',  c:['#F77F00','#FFF','#009A44'] },       // Ivory Coast
  SWE: { s:'cross',c:['#006AA7','#FECC02'] },            // Sweden
  PAN: { s:'quad',c:['#FFF','#DA121A','#046A38','#FFF'] }, // Panama (4 quadrants simplified)
  CPV: { s:'h3cv',c:['#003893','#FFF','#CF2027'], a:'#F7D116' }, // Cape Verde (simplified)
  IRQ: { s:'h',  c:['#CE1126','#FFF','#000'] },          // Iraq
  NOR: { s:'cross',c:['#EF2B2D','#FFF'], a:'#002868' },  // Norway
  ALG: { s:'v2', c:['#FFF','#006233'], a:'#D21034' },    // Algeria (simplified)
  AUT: { s:'h',  c:['#ED2939','#FFF','#ED2939'] },       // Austria
  JOR: { s:'h3j',c:['#007A3D','#FFF','#000'], a:'#CE1126' }, // Jordan (simplified)
  COD: { s:'diag',c:['#007FFF','#F7D618'] },             // DR Congo (simplified)
  UZB: { s:'h',  c:['#1EB53A','#FFF','#CE1126'] },       // Uzbekistan
  EGY: { s:'h',  c:['#CE1126','#FFF','#000'] },          // Egypt
  NZL: { s:'defr',c:['#00247D','#CC142B','#FFF'] },      // New Zealand (dark blue + cross simplified)
  ITA: { s:'v',  c:['#009246','#FFF','#CE2B37'] },       // Italy (for history tab)
  HUN: { s:'h',  c:['#CE2939','#FFF','#477050'] },       // Hungary (for history tab)
};

function svgFlag(code, w, h) {
  const f = FLAG_DEFS[code] || { s:'solid', c:['#aaa'] };
  const { s, c, a } = f;
  const t = Math.round;
  const h3 = t(h/3), h2 = t(h/2), w3 = t(w/3), w2 = t(w/2);
  let b = '';

  switch(s) {
    case 'h':
      b = `<rect width="${w}" height="${h3}" fill="${c[0]}"/>
           <rect y="${h3}" width="${w}" height="${h3}" fill="${c[1]}"/>
           <rect y="${t(2*h/3)}" width="${w}" height="${h3}" fill="${c[2]}"/>`;
      break;
    case 'h2':
      b = `<rect width="${w}" height="${h2}" fill="${c[0]}"/>
           <rect y="${h2}" width="${w}" height="${h2}" fill="${c[1]}"/>`;
      break;
    case 'h3':
      b = `<rect width="${w}" height="${h3}" fill="${c[0]}"/>
           <rect y="${h3}" width="${w}" height="${h3}" fill="${c[1]}"/>
           <rect y="${t(2*h/3)}" width="${w}" height="${h3}" fill="${c[2]}"/>`;
      break;
    case 'v':
      b = `<rect width="${w3}" height="${h}" fill="${c[0]}"/>
           <rect x="${w3}" width="${w3}" height="${h}" fill="${c[1]}"/>
           <rect x="${t(2*w/3)}" width="${w3}" height="${h}" fill="${c[2]}"/>`;
      break;
    case 'v2':
      b = `<rect width="${t(w*.38)}" height="${h}" fill="${c[0]}"/>
           <rect x="${t(w*.38)}" width="${t(w*.62)}" height="${h}" fill="${c[1]}"/>`;
      break;
    case 'cross': {
      const bt = t(h*.22), bh = t(h*.39);
      b = `<rect width="${w}" height="${h}" fill="${c[0]}"/>
           <rect y="${bh}" width="${w}" height="${bt}" fill="${c[1]}"/>
           <rect x="${t(w*.36)}" width="${bt}" height="${h}" fill="${c[1]}"/>`;
      break;
    }
    case 'crossw': {
      const bt = t(h*.22), bh = t(h*.39);
      b = `<rect width="${w}" height="${h}" fill="${c[0]}"/>
           <rect y="${bh}" width="${w}" height="${bt}" fill="${a}"/>
           <rect x="${t(w*.4)}" width="${bt}" height="${h}" fill="${a}"/>`;
      break;
    }
    case 'circ':
      b = `<rect width="${w}" height="${h}" fill="${c[0]}"/>
           <circle cx="${w2}" cy="${h2}" r="${t(h*.28)}" fill="${c[1]}"/>`;
      break;
    case 'circ2':
      b = `<rect width="${w}" height="${h}" fill="${c[0]}"/>
           <circle cx="${t(w*.44)}" cy="${h2}" r="${t(h*.27)}" fill="${c[1]}"/>`;
      break;
    case 'd':
      b = `<rect width="${w}" height="${h}" fill="${c[0]}"/>
           <polygon points="${w2},0 ${w},${h2} ${w2},${h} 0,${h2}" fill="${c[1]}"/>`;
      break;
    case 'bra': {
      // Brazil: green base, yellow diamond, blue circle, white band
      const bx = t(w*0.1), by = t(h*0.18);
      const bw = w - bx*2, bh = h - by*2;
      b = `<rect width="${w}" height="${h}" fill="${c[0]}"/>
           <polygon points="${w2},${by} ${w-bx},${h2} ${w2},${h-by} ${bx},${h2}" fill="${c[1]}"/>
           <circle cx="${w2}" cy="${h2}" r="${t(h*0.28)}" fill="${c[2]}"/>
           <ellipse cx="${w2}" cy="${h2}" rx="${t(w*0.26)}" ry="${t(h*0.09)}" fill="none" stroke="#FFF" stroke-width="${t(h*0.06)}"/>`;
      break;
    }
    case 'kor': {
      // South Korea: white base, taeguk circle (red/blue yin-yang), 4 trigram bars
      const r = t(h*0.28), cx2 = w2, cy2 = h2;
      const rb = t(r*0.48);
      // Black trigram bars (simplified as short thick lines)
      const blen = t(r*0.9), bt = t(h*0.055), gap = t(h*0.09);
      // Top-left bars (3 lines, geon)
      const ang1 = -Math.PI*0.75;
      const tx1 = t(cx2 + Math.cos(ang1)*(r+gap+blen/2)), ty1 = t(cy2 + Math.sin(ang1)*(r+gap+blen/2));
      // Bottom-right bars (3 lines, gon)  
      const ang2 = Math.PI*0.25;
      const tx2 = t(cx2 + Math.cos(ang2)*(r+gap+blen/2)), ty2 = t(cy2 + Math.sin(ang2)*(r+gap+blen/2));
      // Top-right (2 bars, gam)
      const ang3 = -Math.PI*0.25;
      const tx3 = t(cx2 + Math.cos(ang3)*(r+gap+blen/2)), ty3 = t(cy2 + Math.sin(ang3)*(r+gap+blen/2));
      // Bottom-left (3 bars, li)
      const ang4 = Math.PI*0.75;
      const tx4 = t(cx2 + Math.cos(ang4)*(r+gap+blen/2)), ty4 = t(cy2 + Math.sin(ang4)*(r+gap+blen/2));

      b = `<rect width="${w}" height="${h}" fill="#FFFFFF"/>
           <circle cx="${cx2}" cy="${cy2}" r="${r}" fill="#CD2E3A"/>
           <path d="M${cx2},${cy2-r} a${r},${r} 0 0,1 0,${r*2} a${rb},${rb} 0 0,1 0,-${rb*2} a${rb},${rb} 0 0,0 0,-${rb*2} z" fill="#003478"/>
           <g stroke="#000" stroke-width="${bt}" stroke-linecap="round" transform="rotate(-45,${cx2},${cy2})">
             <line x1="${cx2-blen/2}" y1="${cy2-r-gap}" x2="${cx2+blen/2}" y2="${cy2-r-gap}"/>
             <line x1="${cx2-blen/2}" y1="${cy2-r-gap-bt*2}" x2="${cx2+blen/2}" y2="${cy2-r-gap-bt*2}"/>
             <line x1="${cx2-blen/2}" y1="${cy2-r-gap-bt*4}" x2="${cx2+blen/2}" y2="${cy2-r-gap-bt*4}"/>
             <line x1="${cx2-blen/2}" y1="${cy2+r+gap}" x2="${cx2+blen/2}" y2="${cy2+r+gap}"/>
             <line x1="${cx2-blen/2}" y1="${cy2+r+gap+bt*2}" x2="${cx2+blen/2}" y2="${cy2+r+gap+bt*2}"/>
             <line x1="${cx2-blen/2}" y1="${cy2+r+gap+bt*4}" x2="${cx2+blen/2}" y2="${cy2+r+gap+bt*4}"/>
           </g>
           <g stroke="#000" stroke-width="${bt}" stroke-linecap="round" transform="rotate(45,${cx2},${cy2})">
             <line x1="${cx2-blen/2}" y1="${cy2-r-gap}" x2="${cx2+blen/2}" y2="${cy2-r-gap}"/>
             <line x1="${cx2-blen/2}" y1="${cy2-r-gap-bt*2}" x2="${t(cx2)}" y2="${cy2-r-gap-bt*2}"/>
             <line x1="${cx2-blen/2}" y1="${cy2-r-gap-bt*4}" x2="${cx2+blen/2}" y2="${cy2-r-gap-bt*4}"/>
             <line x1="${cx2-blen/2}" y1="${cy2+r+gap}" x2="${cx2+blen/2}" y2="${cy2+r+gap}"/>
             <line x1="${cx2-blen/2}" y1="${cy2+r+gap+bt*2}" x2="${cx2+blen/2}" y2="${cy2+r+gap+bt*2}"/>
             <line x1="${cx2-blen/2}" y1="${cy2+r+gap+bt*4}" x2="${t(cx2+blen/4)}" y2="${cy2+r+gap+bt*4}"/>
           </g>`;
      break;
    }
    case 'usa':
      b = `<rect width="${w}" height="${h}" fill="${c[0]}"/>
           <rect y="${t(h*.13)}" width="${w}" height="${t(h*.13)}" fill="${c[1]}"/>
           <rect y="${t(h*.39)}" width="${w}" height="${t(h*.13)}" fill="${c[1]}"/>
           <rect y="${t(h*.65)}" width="${w}" height="${t(h*.13)}" fill="${c[1]}"/>
           <rect width="${t(w*.42)}" height="${t(h*.52)}" fill="${c[2]}"/>`;
      break;
    case 'aus':
      b = `<rect width="${w}" height="${h}" fill="#00008B"/>
           <line x1="0" y1="0" x2="${t(w*.48)}" y2="${t(h*.52)}" stroke="#fff" stroke-width="${t(h*.14)}"/>
           <line x1="${t(w*.48)}" y1="0" x2="0" y2="${t(h*.52)}" stroke="#fff" stroke-width="${t(h*.14)}"/>
           <line x1="0" y1="0" x2="${t(w*.48)}" y2="${t(h*.52)}" stroke="#FF0000" stroke-width="${t(h*.07)}"/>
           <line x1="${t(w*.48)}" y1="0" x2="0" y2="${t(h*.52)}" stroke="#FF0000" stroke-width="${t(h*.07)}"/>
           <rect x="${t(w*.21)}" y="0" width="${t(h*.1)}" height="${t(h*.52)}" fill="#fff"/>
           <rect x="0" y="${t(h*.22)}" width="${t(w*.48)}" height="${t(h*.1)}" fill="#fff"/>`;
      break;
    case 'diag':
      // diagonal split (bottom-left triangle c[0], top-right c[1])
      b = `<rect width="${w}" height="${h}" fill="${c[0]}"/>
           <polygon points="0,${h} ${w},0 ${w},${h}" fill="${c[1]}"/>`;
      break;
    case 'quad':
      // 4-quadrant flag (Panama style)
      b = `<rect width="${w2}" height="${h2}" fill="${c[0]}"/>
           <rect x="${w2}" width="${w2}" height="${h2}" fill="${c[1]}"/>
           <rect y="${h2}" width="${w2}" height="${h2}" fill="${c[2]}"/>
           <rect x="${w2}" y="${h2}" width="${w2}" height="${h2}" fill="${c[3]||c[0]}"/>`;
      break;
    case 'h3cv': {
      // Cape Verde: blue/white/red with yellow stripe accent
      const s1=t(h*.4),s2=t(h*.12);
      b = `<rect width="${w}" height="${h}" fill="${c[0]}"/>
           <rect y="${s1}" width="${w}" height="${s2}" fill="${c[2]}"/>
           <rect y="${t(s1+s2)}" width="${w}" height="${t(h*.06)}" fill="${a}"/>
           <rect y="${t(s1+s2+h*.06)}" width="${w}" height="${s2}" fill="${c[2]}"/>`;
      break;
    }
    case 'h3j': {
      // Jordan: tricolour with red triangle on left
      b = `<rect width="${w}" height="${h3}" fill="${c[0]}"/>
           <rect y="${h3}" width="${w}" height="${h3}" fill="${c[1]}"/>
           <rect y="${t(2*h/3)}" width="${w}" height="${h3}" fill="${c[2]}"/>
           <polygon points="0,0 ${t(w*.4)},${h2} 0,${h}" fill="${a}"/>`;
      break;
    }
    case 'defr': {
      // New Zealand: dark blue base with southern cross (simplified as small cross)
      const ct=t(h*.15),cx=t(w*.28);
      b = `<rect width="${w}" height="${h}" fill="${c[0]}"/>
           <rect x="${cx}" y="0" width="${ct}" height="${h}" fill="${c[2]}"/>
           <rect x="0" y="${t(h*.42)}" width="${t(w*.55)}" height="${ct}" fill="${c[2]}"/>
           <rect x="${t(cx+ct*.25)}" y="0" width="${t(ct*.5)}" height="${h}" fill="${c[1]}"/>
           <rect x="0" y="${t(h*.42+ct*.25)}" width="${t(w*.55)}" height="${t(ct*.5)}" fill="${c[1]}"/>`;
      break;
    }
    case 'sol':
      b = `<rect width="${w}" height="${h}" fill="${c[0]}"/>
           <polygon points="${w2},${t(h*.18)} ${t(w*.56)},${t(h*.42)} ${t(w*.79)},${t(h*.34)} ${t(w*.63)},${t(h*.54)} ${t(w*.74)},${t(h*.79)} ${w2},${t(h*.64)} ${t(w*.26)},${t(h*.79)} ${t(w*.37)},${t(h*.54)} ${t(w*.21)},${t(h*.34)} ${t(w*.44)},${t(h*.42)}" fill="${a}"/>`;
      break;
    default:
      b = `<rect width="${w}" height="${h}" fill="${c[0]}"/>`;
  }

  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="display:block;width:${w}px;height:${h}px">${b}</svg>`;
}

// Convenience wrapper: returns a div.flat-flag containing the SVG
function ff(code, w, h) {
  return `<div class="flat-flag" style="width:${w}px;height:${h}px">${svgFlag(code, w, h)}</div>`;
}
