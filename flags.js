// Flat geometric SVG flag renderer
// Each flag is defined by a simple shape descriptor + colour palette

const FLAG_DEFS = {
  ARG: { s:'h',  c:['#74ACDF','#FFF','#74ACDF'] },
  BRA: { s:'d',  c:['#009C3B','#FFDF00'] },
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
  KOR: { s:'circ',c:['#FFF','#CD2E3A'] },
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
