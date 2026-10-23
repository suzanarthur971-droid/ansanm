import { TAILLES, TYPES, hash, resumeContribution, tailleDe, teinteDe } from './paves.js'

// Image « story » (1080 × 1920) du pavé qu'on vient de poser, dessinée dans le navigateur.
const L = 1080, H = 1920
const C = { olive: '#4E5C4B', nuit: '#3D4A3B', chemin: '#5C6B59', beige: '#E8DCC4', sauge: '#A8BFA1', papier: '#F5F0E6' }
const POLICE = '"Bricolage Grotesque", -apple-system, sans-serif'
const S = Object.fromEntries(TAILLES.map((t) => [t.key, t.s]))

function dims(taille) {
  const s = S[taille]
  if (taille === 'galet') return { w: s * 1.24, h: s * 0.88 }
  if (taille === 'pave') return { w: s, h: s * 0.92 }
  if (taille === 'grand') return { w: s * 1.22, h: s * 0.96 }
  return { w: s * 1.38, h: s * 1.02 }
}

function pave(ctx, x, y, taille, couleur, echelle, angle, ombre = false) {
  const { w, h } = dims(taille)
  const W = w * echelle, Hh = h * echelle
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  if (ombre) {
    ctx.shadowColor = 'rgba(0,0,0,0.35)'
    ctx.shadowBlur = 40
    ctx.shadowOffsetY = 16
  }
  ctx.fillStyle = couleur
  ctx.beginPath()
  if (taille === 'galet') ctx.ellipse(0, 0, W / 2, Hh / 2, 0, 0, Math.PI * 2)
  else ctx.roundRect(-W / 2, -Hh / 2, W, Hh, (taille === 'pave' ? 4 : 5.5) * echelle)
  ctx.fill()
  ctx.restore()
}

// Découpe un texte en lignes qui tiennent dans la largeur
function lignes(ctx, texte, largeur) {
  const mots = texte.split(' ')
  const res = []
  let ligne = ''
  for (const m of mots) {
    const essai = ligne ? ligne + ' ' + m : m
    if (ctx.measureText(essai).width > largeur && ligne) {
      res.push(ligne)
      ligne = m
    } else ligne = essai
  }
  if (ligne) res.push(ligne)
  return res
}

function chargerImage(src) {
  return new Promise((ok, ko) => {
    const img = new Image()
    img.onload = () => ok(img)
    img.onerror = ko
    img.src = src
  })
}

export async function creerStory({ projet, pave: lePave, paves, adresse }) {
  await Promise.all([
    document.fonts.load(`760 100px ${POLICE}`),
    document.fonts.load(`600 40px ${POLICE}`),
  ]).catch(() => {})
  const logo = await chargerImage('/logo-ansanm.png').catch(() => null)

  const canvas = document.createElement('canvas')
  canvas.width = L
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const variation = (opsz, wdth) => { try { ctx.fontStretch = wdth < 90 ? 'semi-condensed' : 'normal' } catch { /* navigateur ancien */ } }

  // Fond olive, bandeau beige avec le logo
  ctx.fillStyle = C.olive
  ctx.fillRect(0, 0, L, H)
  ctx.fillStyle = C.beige
  ctx.fillRect(0, 0, L, 190)
  if (logo) {
    const lh = 120, lw = (logo.width / logo.height) * lh
    ctx.drawImage(logo, (L - lw) / 2, 35, lw, lh)
  }

  // Le sentier, en diagonale, avec les pavés déjà posés sur ce projet
  const yDe = (x) => 1420 - x * 0.55 + 40 * Math.sin(x / 120)
  ctx.strokeStyle = C.chemin
  ctx.lineWidth = 170
  ctx.lineCap = 'round'
  ctx.beginPath()
  for (let x = -100; x <= L + 100; x += 8) (x === -100 ? ctx.moveTo(x, yDe(x)) : ctx.lineTo(x, yDe(x)))
  ctx.stroke()

  const autres = paves.filter((c) => c.id !== lePave.id).slice(-24)
  const longueurs = [30, 70]
  autres.forEach((c, i) => {
    const voie = i % 2
    const taille = tailleDe(c).key
    const w = dims(taille).w * 1.9
    const x = longueurs[voie] + w / 2
    if (x > 640) return
    longueurs[voie] += w + 14
    const pente = Math.atan2(yDe(x + 1) - yDe(x - 1), 2)
    const decal = voie ? 34 : -34
    const coul = c.type === 'competences' ? C.beige : teinteDe(c)
    pave(ctx, x - Math.sin(pente) * decal, yDe(x) + Math.cos(pente) * decal, taille, coul, 1.9, pente + (hash(c.id) - 0.5) * 0.35)
  })

  // Le nouveau pavé, en grand, avec un halo
  const taille = tailleDe(lePave).key
  const px = Math.min(Math.max(...longueurs) + 130, 860), py = yDe(px)
  ctx.fillStyle = 'rgba(245, 240, 230, 0.14)'
  ctx.beginPath()
  ctx.arc(px, py, 190, 0, Math.PI * 2)
  ctx.fill()
  const echelle = 150 / dims(taille).w
  pave(ctx, px, py, taille, lePave.type === 'competences' ? C.beige : teinteDe(lePave), echelle, -0.35, true)

  // Les textes
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = C.beige
  variation(96, 82)
  ctx.font = `760 104px ${POLICE}`
  ctx.fillText("J'ai posé", 80, 360)
  ctx.fillText('mon pavé', 80, 465)
  ctx.fillStyle = C.sauge
  variation(48, 90)
  ctx.font = `600 52px ${POLICE}`
  ctx.fillText('sur la trace', 80, 560)
  ctx.fillStyle = C.papier
  variation(96, 82)
  ctx.font = `760 120px ${POLICE}`
  let y = 680
  for (const l of lignes(ctx, projet.titre, L - 160).slice(0, 2)) {
    ctx.fillText(l, 80, y)
    y += 118
  }

  // Ce qui a été apporté
  variation(16, 100)
  ctx.fillStyle = C.beige
  ctx.font = `600 44px ${POLICE}`
  const t = TAILLES.find((x) => x.key === taille)
  const article = taille === 'dalle' ? 'Une' : 'Un'
  const apport = lePave.type === 'argent'
    ? `${article} ${t.label.toLowerCase()} de ${resumeContribution(lePave)}`
    : `${article} ${t.label.toLowerCase()} de ${TYPES[lePave.type].label.toLowerCase()} : ${resumeContribution(lePave)}`
  y += 10
  for (const l of lignes(ctx, apport, L - 160).slice(0, 2)) {
    ctx.fillText(l, 80, y)
    y += 58
  }

  // La motivation, sous le sentier
  let ym = 1535
  if (lePave.motivation) {
    ctx.fillStyle = C.papier
    ctx.font = `600 46px ${POLICE}`
    for (const l of lignes(ctx, `«\u00a0${lePave.motivation}\u00a0»`, L - 160).slice(0, 3)) {
      ctx.fillText(l, 80, ym)
      ym += 60
    }
  }

  // L'invitation, en bas
  ctx.fillStyle = C.nuit
  ctx.fillRect(0, H - 230, L, 230)
  ctx.fillStyle = C.sauge
  ctx.font = `600 50px ${POLICE}`
  ctx.fillText('Et toi, tu poses quoi ?', 80, H - 135)
  ctx.fillStyle = C.beige
  ctx.font = `600 40px ${POLICE}`
  ctx.fillText(adresse, 80, H - 72)

  return new Promise((ok) => canvas.toBlob(ok, 'image/png'))
}
