// Partage natif du téléphone (Instagram, WhatsApp…), sinon copie du lien.
export async function partager({ titre, texte, url }) {
  if (navigator.share) {
    try {
      await navigator.share({ title: titre, text: texte, url })
      return 'partage'
    } catch (e) {
      if (e.name === 'AbortError') return 'annule'
    }
  }
  try {
    await navigator.clipboard.writeText(`${texte} ${url}`)
    return 'copie'
  } catch {
    return 'echec'
  }
}
