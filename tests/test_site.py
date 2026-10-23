"""Test complet du site Ansanm (Supabase débranché) : pages, liens, débordements, formulaires."""
import json, os, re, sys
from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE', 'http://localhost:5174')
OUT = os.path.dirname(os.path.abspath(__file__)) + '/captures'
os.makedirs(OUT, exist_ok=True)

PAGES = ['/', '/trace', '/projets/jardin-nourricier', '/projets/cuisine-collective', '/projets/atelier-upcycling', '/projets/media-collectif',
         '/contribuer', '/annuaire', '/besoins-pros', '/besoins-pros/publier', '/adherer', '/proposer',
         '/rendez-vous', '/regles', '/t-shirts', '/idees', '/page-inconnue']

resultats = []
def ok(nom, cond, detail=''):
    resultats.append({'test': nom, 'ok': bool(cond), 'detail': detail})

def nouvelle_page(browser, mobile):
    ctx = browser.new_context(**({'viewport': {'width': 375, 'height': 812}, 'is_mobile': True, 'has_touch': True, 'device_scale_factor': 2}
                                if mobile else {'viewport': {'width': 1280, 'height': 800}}))
    page = ctx.new_page()
    erreurs = []
    page.on('pageerror', lambda e: erreurs.append(str(e)))
    page.on('console', lambda m: erreurs.append(m.text) if m.type == 'error' and 'fonts.g' not in m.text else None)
    return ctx, page, erreurs

def aller(page, chemin):
    page.goto(BASE + chemin)
    page.wait_for_load_state('networkidle')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. Chaque page, sur mobile et ordinateur
    liens = set()
    for mobile in (True, False):
        appareil = 'mobile' if mobile else 'ordi'
        ctx, page, erreurs = nouvelle_page(browser, mobile)
        for chemin in PAGES:
            erreurs.clear()
            aller(page, chemin)
            page.wait_for_timeout(300)
            h1 = page.locator('h1').first.inner_text() if page.locator('h1').count() else ''
            deborde = page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
            ok(f'[{appareil}] {chemin} : titre', h1, h1[:60])
            ok(f'[{appareil}] {chemin} : pas de défilement horizontal', deborde <= 1, f'{deborde}px de trop')
            ok(f'[{appareil}] {chemin} : pas d’erreur JS', not erreurs, ' | '.join(erreurs)[:300])
            nom = re.sub(r'[^a-z0-9]+', '-', chemin.strip('/')) or 'accueil'
            page.screenshot(path=f'{OUT}/{appareil}-{nom}.png', full_page=True)
            for a in page.locator('a[href^="/"]').all():
                liens.add(a.get_attribute('href'))
        ctx.close()

    # 2. Tous les liens internes mènent à une vraie page
    ctx, page, _ = nouvelle_page(browser, False)
    for lien in sorted(liens):
        aller(page, lien)
        h1 = page.locator('h1').first.inner_text() if page.locator('h1').count() else ''
        ok(f'Lien {lien}', 'nulle part' not in h1, h1[:60])
    ctx.close()

    # 3. Formulaires (ordinateur, données dans le navigateur)
    ctx, page, erreurs = nouvelle_page(browser, False)

    # Poser un pavé : erreur si nom vide, puis succès
    aller(page, '/contribuer?projet=cuisine-collective')
    page.get_by_role('button', name=re.compile('^Poser mon pavé')).last.click()
    ok('Contribuer : erreur si nom vide', page.get_by_role('alert').count() > 0, page.get_by_role('alert').first.inner_text() if page.get_by_role('alert').count() else '')
    page.get_by_role('button', name='50 €').click()
    page.get_by_label('Nom affiché').fill('Test Playwright')
    page.locator('#motivation').fill('Pour tester la démo.')
    page.get_by_role('button', name=re.compile('^Poser mon pavé')).last.click()
    page.wait_for_url(re.compile(r'/projets/cuisine-collective\?nouveau='))
    page.wait_for_timeout(500)
    ok('Contribuer : redirection vers la trace', 'nouveau=' in page.url, page.url)
    ok('Contribuer : message « Ta pierre est posée »', page.get_by_text('Ta pierre est posée').count() > 0)
    pid = page.url.split('nouveau=')[1]
    ok('Contribuer : pavé présent sur la Trace', page.locator(f'#pave-{pid}').count() == 1)
    page.screenshot(path=f'{OUT}/form-pave-pose.png')
    page.get_by_role('button', name='Partager en story').click()
    page.get_by_role('dialog', name='Ta story').locator('img').wait_for(timeout=10000)
    ok('Story : l’image est créée', page.get_by_role('dialog', name='Ta story').locator('img').get_attribute('src').startswith('blob:'))
    ok('Story : bouton pour enregistrer l’image', page.get_by_role('link', name="Enregistrer l'image").count() == 1)
    page.get_by_role('dialog', name='Ta story').get_by_role('button', name='Fermer').click()

    # Contribution en matériel
    aller(page, '/contribuer?projet=atelier-upcycling')
    page.get_by_label('Matériel').check()
    page.locator('#description').fill('Trois palettes')
    page.get_by_label('Nom affiché').fill('Test matériel')
    page.get_by_role('button', name=re.compile('^Poser mon pavé')).last.click()
    page.wait_for_url(re.compile(r'nouveau='))
    ok('Contribuer en matériel', 'atelier-upcycling' in page.url, page.url)

    # Fiche d'un pavé
    aller(page, '/trace')
    page.locator('.pave[role=button]').first.click()
    ok('Trace : fiche d’un pavé s’ouvre', page.get_by_role('dialog').count() == 1 and 'a posé' in page.get_by_role('dialog').inner_text())
    page.keyboard.press('Escape')
    ok('Trace : la fiche se ferme avec Échap', page.get_by_role('dialog').count() == 0)

    # Recrutement
    aller(page, '/projets/jardin-nourricier')
    page.get_by_role('button', name='Je suis intéressé·e').click()
    page.locator('#r-nom').fill('Test')
    page.locator('#r-contact').fill('test@exemple.fr')
    page.get_by_role('button', name='Envoyer').click()
    ok('Recrutement : confirmation', page.get_by_text('On revient vers toi').count() > 0)

    # Adhérer
    aller(page, '/adherer')
    page.get_by_role('button', name='Je rejoins Ansanm').click()
    ok('Adhérer : erreur si vide', page.get_by_role('alert').count() > 0)
    page.locator('#nom').fill('Test Adhérent')
    page.locator('#email').fill('test@exemple.fr')
    page.get_by_role('button', name='Je rejoins Ansanm').click()
    ok('Adhérer : confirmation', page.get_by_text('Bienvenue dans la famille').count() > 0)

    # Proposer un projet
    aller(page, '/proposer')
    bouton = page.get_by_role('button', name='Envoyer ma proposition')
    ok('Proposer : bouton désactivé au départ', bouton.is_disabled())
    page.locator('#titre').fill('Test projet')
    page.locator('#description').fill('Description de test')
    page.locator('#contact').fill('test@exemple.fr')
    ok('Proposer : bouton activé une fois rempli', bouton.is_enabled())
    bouton.click()
    ok('Proposer : confirmation', page.get_by_text('Merci.').count() > 0)

    # Idées en germe : l'idée proposée apparaît, on vote, on rapproche
    aller(page, '/idees')
    premiere = page.locator('main ul > li').first
    avant = premiere.locator('strong').first.inner_text()
    premiere.get_by_role('button', name='Je le rechercherais').click()
    ok('Idées : vote compté', int(premiere.locator('strong').first.inner_text()) == int(avant) + 1, f'{avant} → {premiere.locator("strong").first.inner_text()}')
    ok('Idées : bouton passé à « Tu le recherches aussi »', premiere.get_by_role('button', name='Tu le recherches aussi').count() == 1)
    premiere.get_by_role('button', name='Ça irait avec un projet existant ?').click()
    premiere.locator('textarea').fill('Test de rapprochement')
    premiere.get_by_role('button', name='Proposer ce rapprochement').click()
    ok('Idées : rapprochement ajouté', premiere.get_by_text('Test de rapprochement').count() > 0)
    ok('Idées : l’idée proposée plus haut est visible', page.get_by_text('Test projet', exact=True).count() > 0)

    # T-shirts
    aller(page, '/t-shirts')
    page.locator('#slogan').fill('Test slogan')
    page.get_by_role('button', name='Proposer mon slogan').click()
    ok('T-shirts : accord obligatoire', page.get_by_text('Coche la case').count() > 0)
    page.get_by_label("J'accepte que ma proposition soit utilisée par l'association Ansanm.").check()
    page.get_by_role('button', name='Proposer mon slogan').click()
    ok('T-shirts : slogan ajouté au classement', page.get_by_text('Test slogan', exact=True).count() > 0)
    page.get_by_role('button', name=re.compile('^Voter pour')).first.click()
    ok('T-shirts : vote enregistré', page.get_by_role('button', name='Voté').count() >= 1)

    # Besoins des pros
    aller(page, '/besoins-pros')
    total = page.locator('main ul > li').count()
    page.get_by_role('button', name='Coup de pouce', exact=True).click()
    filtres = page.locator('main ul > li').count()
    ok('Entre pros : filtre Coup de pouce', 0 < filtres < total, f'{filtres} sur {total}')
    page.get_by_role('button', name='Tous', exact=True).click()
    page.get_by_role('button', name='Je donne un coup de pouce').first.click()
    carte = page.locator('main ul > li').first
    carte.get_by_label('Votre nom ou votre structure').fill('Test')
    carte.get_by_label('E-mail ou téléphone').fill('test@exemple.fr')
    carte.get_by_label('Votre message').fill('Une idée')
    carte.get_by_role('button', name='Envoyer').click()
    ok('Entre pros : règle du coup de pouce obligatoire', carte.get_by_role('alert').count() > 0)
    carte.get_by_label("J'ai lu la règle du coup de pouce").check()
    carte.get_by_role('button', name='Envoyer').click()
    ok('Entre pros : réponse transmise', page.get_by_text('Votre réponse a été transmise').count() > 0)
    page.get_by_role('button', name='Demander un diagnostic de visibilité').click()
    page.locator('#d-structure').fill('Test structure')
    page.locator('#d-contact').fill('test@exemple.fr')
    page.get_by_role('button', name='Envoyer ma demande').click()
    ok('Entre pros : demande de diagnostic', page.get_by_text('Demande envoyée').count() > 0)

    # Publier un besoin, puis le retrouver
    aller(page, '/besoins-pros/publier?structure=m-garage')
    page.locator('#p-besoin').fill('Test : un besoin publié par Playwright')
    page.locator('#p-contact').fill('test@exemple.fr')
    page.get_by_role('button', name='Publier mon besoin').click()
    ok('Publier un besoin : confirmation', page.get_by_text('Votre besoin est en ligne').count() > 0)
    page.get_by_role('link', name='Voir les besoins des pros').click()
    page.wait_for_load_state('networkidle')
    ok('Publier un besoin : visible dans la liste', page.get_by_text('Test : un besoin publié par Playwright').count() > 0)

    # Donner mon avis
    aller(page, '/trace')
    page.get_by_role('button', name='Donner mon avis').last.click()
    dialogue = page.get_by_role('dialog', name='Donner mon avis')
    dialogue.get_by_role('button', name='Envoyer mon avis').click()
    ok('Avis : au moins une réponse demandée', dialogue.get_by_role('alert').count() > 0)
    dialogue.get_by_label('Peut-être').check()
    dialogue.locator('#avis-manque').fill('Test : un avis')
    dialogue.get_by_role('button', name='Envoyer mon avis').click()
    ok('Avis : confirmation', dialogue.get_by_text('Merci ! Ton avis').count() > 0)
    dialogue.get_by_role('button', name='Revenir au site').click()
    ok('Avis : la fenêtre se ferme', page.get_by_role('dialog', name='Donner mon avis').count() == 0)

    # Média collectif : on peut y poser un pavé
    aller(page, '/contribuer?projet=media-collectif')
    page.get_by_label('Nom affiché').fill('Test média')
    page.get_by_role('button', name=re.compile('^Poser mon pavé')).last.click()
    page.wait_for_url(re.compile(r'/projets/media-collectif\?nouveau='))
    ok('Média collectif : pavé posé', 'media-collectif' in page.url)

    # Annuaire : fiche dépliée avec besoins et badge
    aller(page, '/annuaire')
    page.get_by_role('button', name=re.compile('Madras & Co')).click()
    fiche = page.locator('main li', has_text='Madras & Co').first.inner_text()
    ok('Annuaire : coup de pouce affiché', 'coup de pouce' in fiche.lower(), '')
    ok('Annuaire : besoins de la structure', 'Ce dont nous avons besoin' in fiche)
    ok('Erreurs JS pendant les formulaires', not erreurs, ' | '.join(erreurs)[:300])
    ctx.close()

    # 4. Barre d'onglets mobile et menu
    ctx, page, _ = nouvelle_page(browser, True)
    aller(page, '/trace')
    barre = page.get_by_role('navigation', name='Navigation mobile')
    ok('Mobile : barre d’onglets visible', barre.is_visible())
    barre.get_by_role('link', name='Annuaire').click()
    page.wait_for_url(re.compile('/annuaire'))
    ok('Mobile : onglet Annuaire', page.url.endswith('/annuaire'))
    barre.get_by_role('button', name='Menu').click()
    ok('Mobile : menu ouvert', page.get_by_role('dialog', name='Menu').is_visible())
    page.get_by_role('dialog', name='Menu').get_by_role('link', name='Accueil').click()
    page.wait_for_load_state('networkidle')
    ok('Mobile : retour à l’accueil par le menu', page.url.rstrip('/') == BASE)
    page.get_by_role('link', name='Accueil').first.click()
    ok('Mobile : logo vers l’accueil', page.url.rstrip('/') == BASE)
    ctx.close()

    browser.close()

echecs = [r for r in resultats if not r['ok']]
print(f'{len(resultats) - len(echecs)} / {len(resultats)} tests réussis')
for r in echecs:
    print('ÉCHEC', r['test'], '→', r['detail'])
json.dump(resultats, open(OUT + '/../resultats.json', 'w'), ensure_ascii=False, indent=1)
