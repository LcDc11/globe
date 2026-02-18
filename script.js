(function () {
  const searchInput = document.getElementById('departement-search');
  const searchResults = document.getElementById('search-results');
  const searchStatus = document.getElementById('search-status');
  const mapFrame = document.querySelector('.map-frame');
  const ardennesBoard = document.getElementById('ardennes-board');
  const ardennesForm = document.getElementById('ardennes-form');
  const departmentBoardTitle = document.getElementById('department-board-title');
  const postCityLabel = document.getElementById('post-ville-label');
  const postPseudoInput = document.getElementById('post-pseudo');
  const postCitySelect = document.getElementById('post-ville');
  const postTableBody = document.getElementById('post-table-body');
  const postitWall = document.getElementById('postit-wall');
  const postPhotoInput = document.getElementById('post-photo');
  const postThemeGroupInput = document.getElementById('post-theme-group');
  const postThemeInput = document.getElementById('post-theme');
  const postFilter = document.getElementById('post-filter');
  const postThemeFilter = document.getElementById('post-theme-filter');
  const postFilterStatus = document.getElementById('post-filter-status');
  const loadMorePostsBtn = document.getElementById('load-more-posts');
  const paginationInfo = document.getElementById('pagination-info');
  const chatSyncStatus = document.getElementById('chat-sync-status');
  const postDetailModal = document.getElementById('post-detail-modal');
  const postDetailCloseBtn = document.getElementById('post-detail-close');
  const postDetailTitle = document.getElementById('post-detail-title');
  const postDetailMeta = document.getElementById('post-detail-meta');
  const postDetailDescription = document.getElementById('post-detail-description');
  const postDetailPhoto = document.getElementById('post-detail-photo');
  const postRepliesList = document.getElementById('post-replies-list');
  const postReplyCount = document.getElementById('post-reply-count');
  const postReplyForm = document.getElementById('post-reply-form');
  const postReplyPseudoInput = document.getElementById('post-reply-pseudo');
  const postReplyMessageInput = document.getElementById('post-reply-message');
  const toggleReplyEmojisBtn = document.getElementById('toggle-reply-emojis');
  const postReplyEmojis = document.getElementById('post-reply-emojis');
  const postReplyStatus = document.getElementById('post-reply-status');
  const backToMapBtn = document.getElementById('back-to-map');
  const searchWrap = document.querySelector('.search-wrap');
  const mapRadarWrap = document.getElementById('map-radar-wrap');
  const mapRadarPseudoSearchInput = document.getElementById('map-radar-search-pseudo');
  const mapRadarCountrySearchInput = document.getElementById('map-radar-search-pays');
  const mapRadarCitySearchInput = document.getElementById('map-radar-search-ville');
  const mapRadarSortInput = document.getElementById('map-radar-sort');
  const mapRadarClearButton = document.getElementById('map-radar-clear');
  const mapRadarStatus = document.getElementById('map-radar-status');
  const mapRadarList = document.getElementById('map-radar-list');
  const mapRadarEmpty = document.getElementById('map-radar-empty');
  const footer = document.querySelector('footer');
  const countryPacks = (window.GLOBE_COUNTRY_PACKS && typeof window.GLOBE_COUNTRY_PACKS === 'object') ? window.GLOBE_COUNTRY_PACKS : {};
  const requestedCountryName = (() => {
    const params = new URLSearchParams(window.location.search || '');
    const direct = String(params.get('country') || '').trim();
    if (direct) {
      return direct;
    }

    return 'France';
  })();
  const requestedCountryCode = (() => {
    const params = new URLSearchParams(window.location.search || '');
    const direct = String(params.get('countryCode') || '').trim().toUpperCase();
    if (direct) {
      return direct;
    }

    return 'FR';
  })();
  const activeCountryPack = countryPacks[requestedCountryCode] || null;
  const isFranceContext = requestedCountryCode === 'FR';
  const countryDivisionLookup = buildCountryDivisionLookup();
  const deptStorageKeyPrefix = 'departement-postits-v1';
  const deptDemoSeedPrefix = 'departement-demo-seeded-v1';
  const deptFirebaseSeedPrefix = 'departement-firebase-seeded-v1';
  const deptCitiesCachePrefix = 'departement-cities-v1';
  const deptPresenceSessionPrefix = 'departement-presence-session-v1';
  const deptPresencePseudoPrefix = 'departement-presence-pseudo-v1';
  const globePrefThemeGroupKey = 'globe-pref-theme-group';
  const globePrefThemeKey = 'globe-pref-theme';
  const maxPhotoSizeBytes = 7 * 1024 * 1024;
  const postsPageSize = 20;
  const noteColors = ['yellow', 'pink', 'blue', 'green', 'orange'];
  const frenchCityCollator = new Intl.Collator('fr-FR', {
    usage: 'sort',
    sensitivity: 'variant',
    ignorePunctuation: true,
    numeric: true
  });
  const themeGroups = {
    'COMMUNICATION & SOCIAL': [
      'Juste quelques mots',
      'Je balance (dénoncer)',
      'Cherche covoiturage',
      'Groupe de discussion',
      'Sortie ce week-end',
      'Voisinage & entraide',
      'Cherche coloc',
      'Rencontres amicales',
      'Événements locaux',
      'Babysitting / Garde d\'enfants'
    ],
    'TRAVAIL': [
      'Offre d\'emploi',
      'Cherche emploi',
      'Services à domicile',
      'Cours particuliers',
      'Aide aux devoirs',
      'Dépannage informatique',
      'Bricolage / Réparations',
      'Jardinage',
      'Ménage / Repassage'
    ],
    'OBJETS & SERVICES': [
      'Objet perdu',
      'Service aide',
      'Vends objet',
      'Achète objet',
      'Troc / Échange',
      'Donne gratuitement',
      'Animal perdu',
      'Animal trouvé'
    ],
    'IMMOBILIER': [
      'Cherche appartement',
      'Cherche colocation',
      'Sous-location',
      'Échange de logement'
    ],
    'BONS PLANS & INFOS': [
      'Bon plan dans le coin',
      'À voir',
      'Les infos à connaître',
      'Les sites web du coin',
      'Restaurant à découvrir',
      'Bar / Café sympa',
      'Produits locaux'
    ],
    'LOISIRS & CULTURE': [
      'Sortie ciné / concert',
      'Activité sportive',
      'Club / Association',
      'Brocante / Marché',
      'Festival / Événement'
    ],
    'ALERTES & SÉCURITÉ': [
      'Alerte sécurité',
      'Vol / Cambriolage',
      'Comportement suspect',
      'Nuisances sonores',
      'Pollution / Déchets',
      'Problème voirie',
      'Voisins bruyants'
    ],
    'AMOUR & RENCONTRES': [
      'Amour - Je l\'ai croisé(e) aujourd\'hui',
      'Coup de cœur du jour'
    ],
    'ESPACE MÉMOIRE': [
      'Mur d\'Hommage',
      'Un Mot pour Toi'
    ],
    'FAMILIERS': [
      'Voisin ultra-bizarre',
      'Personne qui me suit partout',
      'Patron inexplicable',
      'J\'ai peur de'
    ],
    'ANGOISSES & ABSURDE': [
      'Cauchemar récurrent étrange',
      'Angoisse inexplicable',
      'Chaîne d\'événements absurde'
    ],
    'MYSTÈRES & PARANORMAL': [
      'J\'ai vu un OVNI 🛸',
      'Déjà-vu bizarre',
      'Maison hantée du coin',
      'Rue qui n\'existe pas sur la carte',
      'Zone de silence absolu'
    ],
    'THÉORIES & COMPLOTS': [
      'Gouvernement cache quelque chose',
      'Ondes / Radiations bizarres',
      'Théorie du complot local',
      'Club secret improbable',
      'Marché noir de [truc absurde]'
    ],
    'VIE PERSONNELLE': [
      'Ras-le-bol / Coup de gueule',
      'Bonne action / Merci',
      'Question existentielle',
      'Humour / Blague'
    ]
  };
  const smartThemes = Object.values(themeGroups).flat();
  const departmentSeedData = {
    '08': {
      cities: [
        'Charleville-Mézières',
        'Sedan',
        'Rethel',
        'Revin',
        'Givet',
        'Vouziers',
        'Bazeilles',
        'Bogny-sur-Meuse',
        'Nouzonville',
        'Villers-Semeuse',
        'Fumay',
        'Monthermé',
        'Vrigne-aux-Bois',
        'Carignan',
        'Rocroi',
        'Signy-l\'Abbaye',
        'Aiglemont',
        'Donchery'
      ],
      posts: [
        { id: 'demo-001', date: '2026-01-19T09:12:00.000Z', pseudo: 'Sk8Raven', ville: 'Charleville-Mézières', description: 'Jam de street art samedi à 16h sur le mur libre. Venez avec vos feutres !' },
        { id: 'demo-002', date: '2026-01-19T11:04:00.000Z', pseudo: 'LunaInk', ville: 'Sedan', description: 'Je cherche une équipe pour monter une expo urbaine locale.' },
        { id: 'demo-003', date: '2026-01-19T12:47:00.000Z', pseudo: 'NoTag', ville: 'Rethel', description: 'Session photo graffiti dimanche matin si météo ok.' },
        { id: 'demo-004', date: '2026-01-19T14:21:00.000Z', pseudo: 'FrostyLine', ville: 'Bazeilles', description: 'Besoin de conseils pour un premier mur, style lettrage old-school.' },
        { id: 'demo-005', date: '2026-01-19T15:02:00.000Z', pseudo: 'MokaBomb', ville: 'Revin', description: 'J’ai trouvé un spot légal super propre, MP pour l’adresse.' },
        { id: 'demo-006', date: '2026-01-19T16:43:00.000Z', pseudo: 'AeroKid', ville: 'Givet', description: 'Qui est chaud pour peindre un fond galaxie en duo ?' },
        { id: 'demo-007', date: '2026-01-19T17:18:00.000Z', pseudo: 'PixelRiot', ville: 'Vouziers', description: 'Atelier gratuit pochoir ce vendredi soir à la MJC.' },
        { id: 'demo-008', date: '2026-01-19T18:55:00.000Z', pseudo: 'JadeFlow', ville: 'Bogny-sur-Meuse', description: 'Je peux prêter des caps pour traits fins, contactez-moi.' },
        { id: 'demo-009', date: '2026-01-19T19:34:00.000Z', pseudo: 'TikoOne', ville: 'Nouzonville', description: 'Projet collectif: thème rivière et industrie ardennaise.' },
        { id: 'demo-010', date: '2026-01-20T08:16:00.000Z', pseudo: 'MiraTag', ville: 'Villers-Semeuse', description: 'Cherche beatmaker pour un event graffiti + rap local.' },
        { id: 'demo-011', date: '2026-01-20T09:40:00.000Z', pseudo: 'GhostFrame', ville: 'Fumay', description: 'Nouveau set de couleurs dispo, je revends quelques bombes neuves.' },
        { id: 'demo-012', date: '2026-01-20T10:58:00.000Z', pseudo: 'Kroma', ville: 'Monthermé', description: 'On nettoie un vieux spot avant de repeindre, main d’œuvre bienvenue.' },
        { id: 'demo-013', date: '2026-01-20T12:05:00.000Z', pseudo: 'NexTrail', ville: 'Vrigne-aux-Bois', description: 'Je veux apprendre les ombrages 3D sur lettres, des tips ?' },
        { id: 'demo-014', date: '2026-01-20T13:27:00.000Z', pseudo: 'RoxyBlue', ville: 'Carignan', description: 'Mur d’expression libre ce soir, thème: Ardennes futuristes.' },
        { id: 'demo-015', date: '2026-01-20T14:49:00.000Z', pseudo: 'ZenStroke', ville: 'Rocroi', description: 'Petit concours de sketchbook à la médiathèque samedi.' },
        { id: 'demo-016', date: '2026-01-20T16:11:00.000Z', pseudo: 'DeltaSpray', ville: 'Signy-l\'Abbaye', description: 'Si vous êtes débutant, venez, ambiance cool et entraide.' },
        { id: 'demo-017', date: '2026-01-20T17:36:00.000Z', pseudo: 'VoltInk', ville: 'Aiglemont', description: 'Cherche idées de palette neon / chrome pour une façade.' },
        { id: 'demo-018', date: '2026-01-20T18:22:00.000Z', pseudo: 'OniMark', ville: 'Donchery', description: 'Afterwork graffiti mardi, on prépare une fresque collaborative.' }
      ]
    },
    '11': {
      cities: [
        'Carcassonne',
        'Narbonne',
        'Castelnaudary',
        'Limoux',
        'Lézignan-Corbières',
        'Port-la-Nouvelle',
        'Gruissan',
        'Sigean',
        'Trèbes',
        'Coursan',
        'Quillan',
        'Leucate',
        'Rieux-Minervois',
        'Bram',
        'Capendu',
        'Conques-sur-Orbiel',
        'Villemoustaussou',
        'Armissan'
      ],
      posts: [
        { id: 'demo-001', date: '2026-01-21T09:05:00.000Z', pseudo: 'AudeFlow', ville: 'Carcassonne', description: 'Jam graffiti samedi près du canal, chacun ramène 2 teintes max.' },
        { id: 'demo-002', date: '2026-01-21T10:17:00.000Z', pseudo: 'NarboBeat', ville: 'Narbonne', description: 'Je cherche une team pour monter une fresque bord de mer.' },
        { id: 'demo-003', date: '2026-01-21T11:41:00.000Z', pseudo: 'KastelKid', ville: 'Castelnaudary', description: 'Session sketchbook ce soir au café associatif, débutants bienvenus.' },
        { id: 'demo-004', date: '2026-01-21T12:54:00.000Z', pseudo: 'LimoInk', ville: 'Limoux', description: 'Qui connaît un spot légal pour pochoir grand format ?' },
        { id: 'demo-005', date: '2026-01-21T14:08:00.000Z', pseudo: 'CorbieresOne', ville: 'Lézignan-Corbières', description: 'Je revends des caps neufs, lot complet à petit prix.' },
        { id: 'demo-006', date: '2026-01-21T15:19:00.000Z', pseudo: 'PortWave', ville: 'Port-la-Nouvelle', description: 'Projet collectif sunset + mer, dispo dimanche fin d\'aprem ?' },
        { id: 'demo-007', date: '2026-01-21T16:02:00.000Z', pseudo: 'GruissArt', ville: 'Gruissan', description: 'Atelier lettrage gratuit à la MJC, inscriptions ouvertes.' },
        { id: 'demo-008', date: '2026-01-21T17:27:00.000Z', pseudo: 'SigSketch', ville: 'Sigean', description: 'Je peux aider sur les dégradés aérosol, MP si besoin.' },
        { id: 'demo-009', date: '2026-01-21T18:13:00.000Z', pseudo: 'TrebLine', ville: 'Trèbes', description: 'Recherche beatmaker pour event street art + DJ set local.' },
        { id: 'demo-010', date: '2026-01-22T08:09:00.000Z', pseudo: 'CoursanTag', ville: 'Coursan', description: 'On nettoie un ancien mur avant repaint, coup de main apprécié.' },
        { id: 'demo-011', date: '2026-01-22T09:34:00.000Z', pseudo: 'QuillanFox', ville: 'Quillan', description: 'Je teste une palette pastel/néon, retours et conseils bienvenus.' },
        { id: 'demo-012', date: '2026-01-22T10:48:00.000Z', pseudo: 'LeucateSun', ville: 'Leucate', description: 'Petit challenge perso: mur thème vent et glisse, qui suit ?' },
        { id: 'demo-013', date: '2026-01-22T12:02:00.000Z', pseudo: 'MinervoisX', ville: 'Rieux-Minervois', description: 'Cherche spots autorisés autour du village pour une fresque duo.' },
        { id: 'demo-014', date: '2026-01-22T13:16:00.000Z', pseudo: 'BramBoy', ville: 'Bram', description: 'Concours mini-sketch samedi, thème: patrimoine revisité.' },
        { id: 'demo-015', date: '2026-01-22T14:29:00.000Z', pseudo: 'CapenduInk', ville: 'Capendu', description: 'Je prête une échelle et du matos de base pour projet collectif.' },
        { id: 'demo-016', date: '2026-01-22T15:53:00.000Z', pseudo: 'OrbielArt', ville: 'Conques-sur-Orbiel', description: 'Besoin d\'avis sur un lettering old-school / ombrage 3D.' },
        { id: 'demo-017', date: '2026-01-22T17:07:00.000Z', pseudo: 'VillemTag', ville: 'Villemoustaussou', description: 'Afterwork graffiti jeudi, ambiance chill et entraide.' },
        { id: 'demo-018', date: '2026-01-22T18:31:00.000Z', pseudo: 'ArmiGlow', ville: 'Armissan', description: 'Je prépare un mur collaboratif sur le thème du vent marin.' }
      ]
    }
  };

  if (!searchInput || !searchResults || !searchStatus) {
    return;
  }

  applyCountryContext();

  const departmentPaths = isFranceContext ? Array.from(document.querySelectorAll('path.departement')) : [];
  let departmentIndex = isFranceContext
    ? departmentPaths.map((path, index) => {
        const group = path.closest('g.region');
        const regionName = group?.getAttribute('data-nom') || 'Région inconnue';
        const depName = path.getAttribute('data-nom') || 'Département inconnu';
        const depCode = (path.getAttribute('data-numerodepartement') || '').trim();

        return {
          id: `dept-${index}`,
          path,
          regionName,
          depName,
          depCode,
          depNameNorm: normalize(depName),
          depCodeNorm: normalize(depCode),
          regionNameNorm: normalize(regionName),
          cities: []
        };
      })
    : (Array.isArray(activeCountryPack && activeCountryPack.subdivisions) ? activeCountryPack.subdivisions : []).map((division, index) => {
        const depName = String((division && division.name) || '').trim() || `Zone ${index + 1}`;
        const depCode = String((division && division.code) || '').trim() || `Z${index + 1}`;
        const countryName = requestedCountryName || (activeCountryPack && activeCountryPack.name) || 'Pays';
        const cities = Array.isArray(division && division.cities)
          ? division.cities.map((city) => String(city || '').trim()).filter(Boolean)
          : [];

        return {
          id: `country-division-${index}`,
          path: null,
          regionName: countryName,
          depName,
          depCode,
          depNameNorm: normalize(depName),
          depCodeNorm: normalize(depCode),
          regionNameNorm: normalize(countryName),
          cities
        };
      });

  let activeIndex = -1;
  let lastHighlightedPath = null;
  const departmentHoverLabel = createDepartmentHoverLabel();
  let displayedResults = [];
  let activeDepartment = null;
  let ardennesPosts = loadArdennesPosts();
  let activePostFilter = 'all';
  let activeThemeFilter = 'all';
  let visiblePostsCount = postsPageSize;
  let ardennesCities = [];
  let firestoreEnabled = false;
  let firebaseDb = null;
  let firebaseStorage = null;
  let mapRadarProfiles = [];
  let mapRadarUnsubscribe = null;
  let firebaseUnsubscribe = null;
  let presenceUnsubscribe = null;
  let presenceHeartbeatTimer = null;
  let presenceInitialized = false;
  let presenceSessionId = '';
  let presencePseudo = '';
  let onlineUsersByPseudoNorm = new Map();
  let activePostDetailId = '';
  let countryDynamicMapReady = false;

  searchStatus.textContent = isFranceContext
    ? `${departmentIndex.length} départements indexés. Recherchez par nom, numéro ou région.`
    : `${departmentIndex.length} ${getDivisionLabel().toLowerCase()}s indexé(e)s. Recherchez par nom, code ou pays.`;

  if (!isFranceContext) {
    initializeDynamicCountryMap();
  }

  function applyCountryContext() {
    const countryName = requestedCountryName || 'France';
    document.title = `Carte de ${countryName}`;

    const wallCountryTag = document.querySelector('.tag-7');
    if (wallCountryTag) {
      wallCountryTag.textContent = countryName;
    }

    const searchLabel = document.querySelector('.search-label');
    if (searchLabel && requestedCountryCode !== 'FR') {
      searchLabel.textContent = `Recherche intelligente · ${countryName}`;
    }

    if (searchInput && requestedCountryCode !== 'FR') {
      searchInput.placeholder = `Ex: régions, villes ou zones de ${countryName}...`;
    }

  }

  function getDivisionLabel() {
    return String((activeCountryPack && activeCountryPack.divisionLabel) || 'Subdivision').trim();
  }

  function buildCountryDivisionLookup() {
    const lookup = {
      byCode: new Map(),
      byName: new Map(),
      all: []
    };

    if (!activeCountryPack || !Array.isArray(activeCountryPack.subdivisions)) {
      return lookup;
    }

    activeCountryPack.subdivisions.forEach((division) => {
      const divisionRef = {
        code: String((division && division.code) || '').trim(),
        name: String((division && division.name) || '').trim(),
        cities: Array.isArray(division && division.cities) ? division.cities.slice() : []
      };

      lookup.all.push(divisionRef);

      const codeKey = normalizeDivisionCode(divisionRef.code);
      if (codeKey) {
        lookup.byCode.set(codeKey, divisionRef);
      }

      const names = [divisionRef.name].concat(getSubdivisionAliasesByCode(requestedCountryCode, divisionRef.code));
      names.forEach((name) => {
        const key = normalizeDivisionName(name);
        if (key) {
          lookup.byName.set(key, divisionRef);
        }
      });
    });

    return lookup;
  }

  async function initializeDynamicCountryMap() {
    if (isFranceContext || !mapFrame || !activeCountryPack || !activeCountryPack.geojsonUrl) {
      return;
    }

    const staticSvg = mapFrame.querySelector('svg');
    if (staticSvg) {
      staticSvg.style.display = 'none';
    }

    mapFrame.removeAttribute('hidden');

    const host = document.createElement('div');
    host.className = 'country-map-dynamic';
    host.innerHTML = '<div class="country-map-loading">Chargement de la carte administrative...</div>';
    mapFrame.appendChild(host);

    try {
      const response = await fetch(activeCountryPack.geojsonUrl);
      if (!response.ok) {
        throw new Error('country-map-fetch-failed');
      }

      const geojson = await response.json();
      const features = extractCountryMapFeatures(geojson);
      if (!features.length) {
        throw new Error('country-map-empty');
      }

      renderDynamicCountryMap(host, features);
      countryDynamicMapReady = true;
      searchStatus.textContent = `${departmentIndex.length} ${getDivisionLabel().toLowerCase()}s indexé(e)s pour ${requestedCountryName}.`;
      departmentIndex.forEach((department) => bindDepartmentPathInteractions(department));
    } catch (_error) {
      host.innerHTML = '<div class="country-map-loading">Carte visuelle en préparation pour ce pays. La recherche et les fiches restent actives.</div>';
    }
  }

  function extractCountryMapFeatures(geojson) {
    const list = Array.isArray(geojson && geojson.features) ? geojson.features : [];
    return list
      .map((feature, index) => {
        const geometry = feature && feature.geometry;
        if (!geometry || (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon')) {
          return null;
        }

        const depName = getFeatureName(feature) || `Zone ${index + 1}`;
        const depCode = getFeatureCode(feature, depName, index);
        const cities = resolveCitiesForDivision(depName, depCode);

        return {
          id: `country-division-${index}`,
          depName,
          depCode,
          regionName: requestedCountryName,
          depNameNorm: normalize(depName),
          depCodeNorm: normalize(depCode),
          regionNameNorm: normalize(requestedCountryName),
          cities,
          geometry,
          path: null
        };
      })
      .filter(Boolean);
  }

  function getFeatureName(feature) {
    const props = (feature && feature.properties) || {};
    const candidates = [props.name, props.nom, props.NAME_1, props.NAME, props.NAME_EN, props.region, props.Region, props.state];
    for (let i = 0; i < candidates.length; i += 1) {
      const value = String(candidates[i] || '').trim();
      if (value) {
        return value;
      }
    }

    return '';
  }

  function getFeatureCode(feature, depName, index) {
    const props = (feature && feature.properties) || {};
    const candidates = [props.code, props.id, props.iso_3166_2, props.hasc, props.HASC_1, props.postal, props.abbrev];
    for (let i = 0; i < candidates.length; i += 1) {
      const value = String(candidates[i] || '').trim();
      if (value) {
        return value;
      }
    }

    return `${depName}-${index + 1}`;
  }

  function resolveCitiesForDivision(depName, depCode) {
    if (!activeCountryPack || !Array.isArray(activeCountryPack.subdivisions)) {
      return [];
    }

    const depCodeNorm = normalizeDivisionCode(depCode);
    const depNameNorm = normalizeDivisionName(depName);

    const byCode = depCodeNorm ? countryDivisionLookup.byCode.get(depCodeNorm) : null;
    if (byCode && Array.isArray(byCode.cities) && byCode.cities.length) {
      return byCode.cities.slice();
    }

    const byName = depNameNorm ? countryDivisionLookup.byName.get(depNameNorm) : null;
    if (byName && Array.isArray(byName.cities) && byName.cities.length) {
      return byName.cities.slice();
    }

    const closeNameMatch = countryDivisionLookup.all.find((division) => {
      const itemNorm = normalizeDivisionName(division.name);
      return itemNorm === depNameNorm || itemNorm.includes(depNameNorm) || depNameNorm.includes(itemNorm);
    });

    if (closeNameMatch && Array.isArray(closeNameMatch.cities) && closeNameMatch.cities.length) {
      return closeNameMatch.cities.slice();
    }

    const fallbackByIndex = countryDivisionLookup.all.find((division, index) => {
      return index === Math.max(0, Math.min(countryDivisionLookup.all.length - 1, Number(String(depCodeNorm).replace(/\D/g, '')) - 1));
    });

    if (fallbackByIndex && Array.isArray(fallbackByIndex.cities) && fallbackByIndex.cities.length) {
      return fallbackByIndex.cities.slice();
    }

    return [];
  }

  function normalizeDivisionName(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, ' and ')
      .replace(/[’']/g, ' ')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\b(region|regione|comunidad|autonoma|autonome|state|land|province|provincia|de|du|des|del|della|di|la|le|el|the|and)\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getSubdivisionAliasesByCode(countryCode, subdivisionCode) {
    const aliasesByCountry = {
      DE: {
        BW: ['Baden-Württemberg', 'Baden Wurttemberg'],
        BY: ['Bayern', 'Bavaria'],
        BE: ['Berlin'],
        BB: ['Brandenburg'],
        HB: ['Bremen'],
        HH: ['Hamburg'],
        HE: ['Hessen', 'Hesse'],
        MV: ['Mecklenburg-Vorpommern', 'Mecklenburg Western Pomerania', 'Mecklenburg Vorpommern'],
        NI: ['Niedersachsen', 'Lower Saxony'],
        NW: ['Nordrhein-Westfalen', 'North Rhine-Westphalia'],
        RP: ['Rheinland-Pfalz', 'Rhineland-Palatinate'],
        SL: ['Saarland'],
        SN: ['Sachsen', 'Saxony'],
        ST: ['Sachsen-Anhalt', 'Saxony-Anhalt'],
        SH: ['Schleswig-Holstein'],
        TH: ['Thüringen', 'Thuringia', 'Thueringen']
      },
      ES: {
        AN: ['Andalucía', 'Andalusia'],
        AR: ['Aragón', 'Aragon'],
        AS: ['Asturias', 'Principado de Asturias'],
        IB: ['Islas Baleares', 'Illes Balears', 'Balearic Islands'],
        PV: ['País Vasco', 'Euskadi', 'Basque Country'],
        CN: ['Canarias', 'Canary Islands'],
        CB: ['Cantabria'],
        CL: ['Castilla y León', 'Castile and León', 'Castilla Leon'],
        CM: ['Castilla-La Mancha', 'Castile-La Mancha', 'Castilla La Mancha'],
        CT: ['Cataluña', 'Catalunya', 'Catalonia'],
        EX: ['Extremadura'],
        GA: ['Galicia'],
        MD: ['Comunidad de Madrid', 'Madrid'],
        MC: ['Región de Murcia', 'Murcia'],
        NC: ['Navarra', 'Comunidad Foral de Navarra'],
        RI: ['La Rioja'],
        VC: ['Comunitat Valenciana', 'Comunidad Valenciana', 'Valencian Community'],
        CE: ['Ceuta'],
        ML: ['Melilla']
      },
      IT: {
        ABR: ['Abruzzo'],
        BAS: ['Basilicata'],
        CAL: ['Calabria'],
        CAM: ['Campania'],
        EMR: ['Emilia-Romagna', 'Emilia Romagna'],
        FVG: ['Friuli-Venezia Giulia', 'Friuli Venezia Giulia'],
        LAZ: ['Lazio'],
        LIG: ['Liguria'],
        LOM: ['Lombardia', 'Lombardy'],
        MAR: ['Marche'],
        MOL: ['Molise'],
        PMN: ['Piemonte', 'Piedmont'],
        PUG: ['Puglia', 'Apulia'],
        SAR: ['Sardegna', 'Sardinia'],
        SIC: ['Sicilia', 'Sicily'],
        TOS: ['Toscana', 'Tuscany'],
        TAA: ['Trentino-Alto Adige', 'Trentino Alto Adige', 'Trentino-South Tyrol'],
        UMB: ['Umbria'],
        VDA: ['Valle d Aosta', 'Aosta Valley', 'Vallee d Aoste'],
        VEN: ['Veneto']
      },
      PT: {
        'PT-01': ['Aveiro'],
        'PT-02': ['Beja'],
        'PT-03': ['Braga'],
        'PT-04': ['Bragança', 'Braganca'],
        'PT-05': ['Castelo Branco'],
        'PT-06': ['Coimbra'],
        'PT-07': ['Évora', 'Evora'],
        'PT-08': ['Faro'],
        'PT-09': ['Guarda'],
        'PT-10': ['Leiria'],
        'PT-11': ['Lisboa', 'Lisbonne', 'Lisbon'],
        'PT-12': ['Portalegre'],
        'PT-13': ['Porto'],
        'PT-14': ['Santarém', 'Santarem'],
        'PT-15': ['Setúbal', 'Setubal'],
        'PT-16': ['Viana do Castelo'],
        'PT-17': ['Vila Real'],
        'PT-18': ['Viseu']
      },
      BE: {
        'BE-AAL': ['Aalst', 'Alost'],
        'BE-ANR': ['Antwerp', 'Anvers'],
        'BE-ARL': ['Arlon'],
        'BE-ATH': ['Ath'],
        'BE-BAS': ['Bastogne'],
        'BE-BRU': ['Brugge', 'Bruges'],
        'BE-DIN': ['Dinant'],
        'BE-CHA': ['Charleroi'],
        'BE-DEN': ['Dendermonde', 'Termonde'],
        'BE-DIK': ['Diksmuide', 'Dixmude'],
        'BE-EEK': ['Eeklo'],
        'BE-GEN': ['Gent', 'Gand'],
        'BE-HAV': ['Halle-Vilvoorde', 'Hal-Vilvorde'],
        'BE-HUY': ['Huy', 'Hoei'],
        'BE-HAS': ['Hasselt'],
        'BE-IEP': ['Ieper', 'Ypres'],
        'BE-KOR': ['Kortrijk', 'Courtrai'],
        'BE-LEU': ['Leuven', 'Louvain'],
        'BE-MAI': ['Maaseik'],
        'BE-MAF': ['Marche-en-Famenne'],
        'BE-MEC': ['Mechelen', 'Malines'],
        'BE-MON': ['Mons'],
        'BE-MOU': ['Mouscron'],
        'BE-NAM': ['Namur'],
        'BE-NIV': ['Nivelles'],
        'BE-OOS': ['Oostende', 'Ostende'],
        'BE-OUD': ['Oudenaarde', 'Audenarde'],
        'BE-PHI': ['Philippeville'],
        'BE-ROE': ['Roeselare', 'Roulers'],
        'BE-SIN': ['Sint-Niklaas', 'Saint-Nicolas'],
        'BE-SOI': ['Soignies'],
        'BE-THU': ['Thuin'],
        'BE-TIE': ['Tielt'],
        'BE-TON': ['Tongeren', 'Tongres'],
        'BE-TOU': ['Tournai', 'Doornik'],
        'BE-TUR': ['Turnhout'],
        'BE-VER': ['Verviers'],
        'BE-VEU': ['Veurne', 'Furnes'],
        'BE-VIR': ['Virton'],
        'BE-WAR': ['Waremme'],
        'BE-LIE': ['Liège', 'Liege', 'Luik'],
        'BE-NEU': ['Neufchâteau', 'Neufchateau'],
        'BE-BRUC': ['Bruxelles-Capitale - Brussel-Hoofdstad', 'Bruxelles-Capitale', 'Brussel-Hoofdstad', 'Brussels-Capital']
      },
      CH: {
        'CH-ZH': ['Zürich', 'Zurich'],
        'CH-BE': ['Bern', 'Berne'],
        'CH-LU': ['Luzern', 'Lucerne'],
        'CH-UR': ['Uri'],
        'CH-SZ': ['Schwyz'],
        'CH-OW': ['Obwalden'],
        'CH-NW': ['Nidwalden'],
        'CH-GL': ['Glarus', 'Glaris'],
        'CH-ZG': ['Zug', 'Zoug'],
        'CH-FR': ['Fribourg', 'Freiburg'],
        'CH-SO': ['Solothurn', 'Soleure'],
        'CH-BS': ['Basel-Stadt', 'Bâle-Ville'],
        'CH-BL': ['Basel-Landschaft', 'Bâle-Campagne'],
        'CH-SH': ['Schaffhausen', 'Schaffhouse'],
        'CH-AR': ['Appenzell Ausserrhoden', 'Appenzell Rhodes-Extérieures'],
        'CH-AI': ['Appenzell Innerrhoden', 'Appenzell Rhodes-Intérieures'],
        'CH-SG': ['St. Gallen', 'Saint-Gall'],
        'CH-GR': ['Graubünden', 'Grisons'],
        'CH-AG': ['Aargau', 'Argovie'],
        'CH-TG': ['Thurgau', 'Thurgovie'],
        'CH-TI': ['Ticino', 'Tessin'],
        'CH-VD': ['Vaud'],
        'CH-VS': ['Valais', 'Wallis'],
        'CH-NE': ['Neuchâtel', 'Neuchatel'],
        'CH-GE': ['Genève', 'Geneve', 'Geneva'],
        'CH-JU': ['Jura']
      },
      GB: {
        'UK-SW': ['South West', 'South West England'],
        'UK-LON': ['London', 'Greater London'],
        'UK-EE': ['East of England'],
        'UK-YH': ['Yorkshire and The Humber', 'Yorkshire & the Humber'],
        'UK-SE': ['South East', 'South East England'],
        'UK-WM': ['West Midlands'],
        'UK-EM': ['East Midlands'],
        'UK-NW': ['North West', 'North West England'],
        'UK-NE': ['North East', 'North East England']
      },
      NL: {
        'NL-GR': ['Groningen'],
        'NL-FR': ['Friesland', 'Fryslân'],
        'NL-GE': ['Gelderland'],
        'NL-UT': ['Utrecht'],
        'NL-ZH': ['Zuid-Holland', 'South Holland'],
        'NL-ZE': ['Zeeland'],
        'NL-NB': ['Noord-Brabant', 'North Brabant'],
        'NL-LI': ['Limburg'],
        'NL-NH': ['Noord-Holland', 'North Holland'],
        'NL-FL': ['Flevoland'],
        'NL-DR': ['Drenthe'],
        'NL-OV': ['Overijssel']
      },
      AT: {
        'AT-9': ['Wien', 'Vienna'],
        'AT-2': ['Kärnten', 'Karnten', 'Carinthia'],
        'AT-1': ['Burgenland'],
        'AT-3': ['Niederösterreich', 'Niederosterreich', 'Lower Austria'],
        'AT-6': ['Steiermark', 'Styria'],
        'AT-4': ['Oberösterreich', 'Oberosterreich', 'Upper Austria'],
        'AT-5': ['Salzburg'],
        'AT-7': ['Tirol', 'Tyrol'],
        'AT-8': ['Vorarlberg']
      },
      IE: {
        'IE-LC': ['Limerick City', 'Limerick'],
        'IE-LK': ['Limerick County', 'County Limerick'],
        'IE-TN': ['North Tipperary', 'Tipperary North'],
        'IE-TS': ['South Tipperary', 'Tipperary South'],
        'IE-WDC': ['Waterford City', 'Waterford'],
        'IE-WD': ['Waterford County', 'County Waterford'],
        'IE-GWC': ['Galway City', 'Galway'],
        'IE-GW': ['Galway County', 'County Galway'],
        'IE-LM': ['Leitrim County', 'County Leitrim'],
        'IE-MO': ['Mayo County', 'County Mayo'],
        'IE-RN': ['Roscommon County', 'County Roscommon'],
        'IE-SO': ['Sligo County', 'County Sligo'],
        'IE-CN': ['Cavan County', 'County Cavan'],
        'IE-DL': ['Donegal County', 'County Donegal'],
        'IE-MN': ['Monaghan County', 'County Monaghan'],
        'IE-CW': ['Carlow County', 'County Carlow'],
        'IE-DC': ['Dublin City', 'Dublin'],
        'IE-SD': ['South Dublin'],
        'IE-F': ['Fingal'],
        'IE-DLR': ['Dún Laoghaire-Rathdown', 'Dun Laoghaire-Rathdown'],
        'IE-KE': ['Kildare County', 'County Kildare'],
        'IE-KK': ['Kilkenny County', 'County Kilkenny'],
        'IE-LS': ['Laois County', 'County Laois'],
        'IE-LD': ['Longford County', 'County Longford'],
        'IE-LH': ['Louth County', 'County Louth'],
        'IE-MH': ['Meath County', 'County Meath'],
        'IE-OY': ['Offaly County', 'County Offaly'],
        'IE-WH': ['Westmeath County', 'County Westmeath'],
        'IE-WX': ['Wexford County', 'County Wexford'],
        'IE-WW': ['Wicklow County', 'County Wicklow'],
        'IE-CE': ['Clare County', 'County Clare'],
        'IE-CC': ['Cork City', 'Cork'],
        'IE-CO': ['Cork County', 'County Cork'],
        'IE-KY': ['Kerry County', 'County Kerry']
      },
      DK: {
        'DK-001': ['Fredensborg Kommune', 'Fredensborg'],
        'DK-037': ['Aalborg Kommune', 'Aalborg'],
        'DK-038': ['Aarhus Kommune', 'Aarhus'],
        'DK-061': ['Københavns Kommune', 'Kobenhavns Kommune', 'Copenhagen Municipality', 'Copenhagen'],
        'DK-065': ['Frederiksberg Kommune', 'Frederiksberg'],
        'DK-087': ['Svendborg Kommune', 'Svendborg'],
        'DK-095': ['Vejle Kommune', 'Vejle'],
        'DK-097': ['Viborg Kommune', 'Viborg'],
        'DK-098': ['Vordingborg Kommune', 'Vordingborg']
      },
      PL: {
        'PL-DS': ['Dolnośląskie', 'Dolnoslaskie', 'Lower Silesian'],
        'PL-KP': ['Kujawsko-Pomorskie', 'Kuyavian-Pomeranian'],
        'PL-LU': ['Lubelskie', 'Lublin'],
        'PL-LB': ['Lubuskie', 'Lubusz'],
        'PL-LD': ['Łódzkie', 'Lodzkie', 'Lodz'],
        'PL-MA': ['Małopolskie', 'Malopolskie', 'Lesser Poland'],
        'PL-MZ': ['Mazowieckie', 'Masovian'],
        'PL-OP': ['Opolskie', 'Opole'],
        'PL-PK': ['Podkarpackie', 'Subcarpathian'],
        'PL-PD': ['Podlaskie', 'Podlasie'],
        'PL-PM': ['Pomorskie', 'Pomeranian'],
        'PL-SL': ['Śląskie', 'Slaskie', 'Silesian'],
        'PL-SK': ['Świętokrzyskie', 'Swietokrzyskie', 'Holy Cross'],
        'PL-WN': ['Warmińsko-Mazurskie', 'Warminsko-Mazurskie', 'Warmian-Masurian'],
        'PL-WP': ['Wielkopolskie', 'Greater Poland'],
        'PL-ZP': ['Zachodniopomorskie', 'West Pomeranian']
      },
      SE: {
        'SE-AB': ['Stockholm County', 'Stockholms län', 'Stockholms lan'],
        'SE-C': ['Uppsala County', 'Uppsala län', 'Uppsala lan'],
        'SE-D': ['Södermanland County', 'Sodermanland County', 'Södermanlands län', 'Sodermanlands lan'],
        'SE-E': ['Östergötland County', 'Ostergotland County', 'Östergötlands län', 'Ostergotlands lan'],
        'SE-F': ['Jönköping County', 'Jonkoping County', 'Jönköpings län', 'Jonkopings lan'],
        'SE-G': ['Kronoberg County', 'Kronobergs län', 'Kronobergs lan'],
        'SE-H': ['Kalmar County', 'Kalmar län', 'Kalmar lan'],
        'SE-I': ['Gotland County', 'Gotlands län', 'Gotlands lan'],
        'SE-K': ['Blekinge County', 'Blekinge län', 'Blekinge lan'],
        'SE-M': ['Skåne County', 'Skane County', 'Skåne län', 'Skane lan'],
        'SE-N': ['Halland County', 'Hallands län', 'Hallands lan'],
        'SE-O': ['Västra Götaland County', 'Vastra Gotaland County', 'Västra Götalands län', 'Vastra Gotalands lan'],
        'SE-S': ['Värmland County', 'Varmland County', 'Värmlands län', 'Varmlands lan'],
        'SE-T': ['Örebro County', 'Orebro County', 'Örebro län', 'Orebro lan'],
        'SE-U': ['Västmanland County', 'Vastmanland County', 'Västmanlands län', 'Vastmanlands lan'],
        'SE-W': ['Dalarna County', 'Dalarnas län', 'Dalarnas lan'],
        'SE-X': ['Gävleborg County', 'Gavleborg County', 'Gävleborgs län', 'Gavleborgs lan'],
        'SE-Y': ['Västernorrland County', 'Vasternorrland County', 'Västernorrlands län', 'Vasternorrlands lan'],
        'SE-Z': ['Jämtland County', 'Jamtland County', 'Jämtlands län', 'Jamtlands lan'],
        'SE-AC': ['Västerbotten County', 'Vasterbotten County', 'Västerbottens län', 'Vasterbottens lan'],
        'SE-BD': ['Norrbotten County', 'Norrbottens län', 'Norrbottens lan']
      },
      HU: {
        'HU-BU': ['Budapest'],
        'HU-BA': ['Baranya'],
        'HU-BZ': ['Borsod-Abaúj-Zemplén', 'Borsod-Abauj-Zemplen'],
        'HU-BK': ['Bács-Kiskun', 'Bacs-Kiskun'],
        'HU-BE': ['Békés', 'Bekes'],
        'HU-CS': ['Csongrád-Csanád', 'Csongrad-Csanad'],
        'HU-FE': ['Fejér', 'Fejer'],
        'HU-GS': ['Győr-Moson-Sopron', 'Gyor-Moson-Sopron'],
        'HU-HB': ['Hajdú-Bihar', 'Hajdu-Bihar'],
        'HU-HE': ['Heves'],
        'HU-JN': ['Jász-Nagykun-Szolnok', 'Jasz-Nagykun-Szolnok'],
        'HU-KE': ['Komárom-Esztergom', 'Komarom-Esztergom'],
        'HU-NO': ['Nógrád', 'Nograd'],
        'HU-PE': ['Pest'],
        'HU-SO': ['Somogy'],
        'HU-SZ': ['Szabolcs-Szatmár-Bereg', 'Szabolcs-Szatmar-Bereg'],
        'HU-TO': ['Tolna'],
        'HU-VA': ['Vas'],
        'HU-VE': ['Veszprém', 'Veszprem'],
        'HU-ZA': ['Zala']
      },
      RO: {
        'RO-B': ['București', 'Bucuresti', 'Bucharest'],
        'RO-AB': ['Alba'],
        'RO-AR': ['Arad'],
        'RO-AG': ['Argeș', 'Arges'],
        'RO-BC': ['Bacău', 'Bacau'],
        'RO-BH': ['Bihor'],
        'RO-BN': ['Bistrița-Năsăud', 'Bistrita-Nasaud'],
        'RO-BT': ['Botoșani', 'Botosani'],
        'RO-BR': ['Brăila', 'Braila'],
        'RO-BV': ['Brașov', 'Brasov'],
        'RO-BZ': ['Buzău', 'Buzau'],
        'RO-CS': ['Caraș-Severin', 'Caras-Severin'],
        'RO-CL': ['Călărași', 'Calarasi'],
        'RO-CJ': ['Cluj'],
        'RO-CT': ['Constanța', 'Constanta'],
        'RO-CV': ['Covasna'],
        'RO-DB': ['Dâmbovița', 'Dambovita'],
        'RO-DJ': ['Dolj'],
        'RO-GL': ['Galați', 'Galati'],
        'RO-GR': ['Giurgiu'],
        'RO-GJ': ['Gorj'],
        'RO-HR': ['Harghita'],
        'RO-HD': ['Hunedoara'],
        'RO-IL': ['Ialomița', 'Ialomita'],
        'RO-IS': ['Iași', 'Iasi'],
        'RO-IF': ['Ilfov'],
        'RO-MM': ['Maramureș', 'Maramures'],
        'RO-MH': ['Mehedinți', 'Mehedinti'],
        'RO-MS': ['Mureș', 'Mures'],
        'RO-NT': ['Neamț', 'Neamt'],
        'RO-OT': ['Olt'],
        'RO-PH': ['Prahova'],
        'RO-SJ': ['Sălaj', 'Salaj'],
        'RO-SM': ['Satu Mare'],
        'RO-SB': ['Sibiu'],
        'RO-SV': ['Suceava'],
        'RO-TR': ['Teleorman'],
        'RO-TM': ['Timiș', 'Timis'],
        'RO-TL': ['Tulcea'],
        'RO-VL': ['Vâlcea', 'Valcea'],
        'RO-VS': ['Vaslui'],
        'RO-VN': ['Vrancea']
      },
      GR: {
        'GR-EMT': ['East Macedonia and Thrace'],
        'GR-CM': ['Central Macedonia'],
        'GR-TH': ['Thessaly'],
        'GR-NA': ['North Aegean'],
        'GR-SA': ['South Aegean'],
        'GR-CG': ['Central Greece'],
        'GR-WG': ['Western Greece'],
        'GR-PE': ['Peloponnese'],
        'GR-AT': ['Attica'],
        'GR-WM': ['West Macedonia'],
        'GR-EP': ['Epirus'],
        'GR-II': ['Ionian Islands'],
        'GR-CR': ['Crete']
      },
      RS: {
        'RS-ZA': ['Zaječarski okrug', 'Zajecarski okrug'],
        'RS-KO': ['Kolubarski okrug'],
        'RS-BO': ['Borski okrug'],
        'RS-ZL': ['Zlatiborski okrug'],
        'RS-SU': ['Šumadijski okrug', 'Sumadijski okrug'],
        'RS-BR': ['Braničevski okrug', 'Branicevski okrug'],
        'RS-JA': ['Jablanički okrug', 'Jablanicki okrug'],
        'RS-MO': ['Moravički okrug', 'Moravicki okrug'],
        'RS-NI': ['Nišavski okrug', 'Nisavski okrug'],
        'RS-MA': ['Mačvanski okrug', 'Macvanski okrug'],
        'RS-PI': ['Pčinjski okrug', 'Pcinjski okrug'],
        'RS-BG': ['Grad Beograd', 'Belgrade'],
        'RS-KP': ['Kosovsko-Pomoravski okrug'],
        'RS-PR': ['Prizrenski okrug'],
        'RS-PE': ['Pećki okrug', 'Pecki okrug'],
        'RS-KM': ['Kosovskomitrovički okrug', 'Kosovskomitrovicki okrug'],
        'RS-KS': ['Kosovski okrug'],
        'RS-JB': ['Južnobački okrug', 'Juznobacki okrug'],
        'RS-JBN': ['Južnobanatski okrug', 'Juznobanatski okrug'],
        'RS-SZ': ['Srednjebanatski okrug'],
        'RS-PIR': ['Pirotski okrug'],
        'RS-ZB': ['Zapadnobački okrug', 'Zapadnobacki okrug'],
        'RS-SB': ['Severnobački okrug', 'Severnobacki okrug'],
        'RS-SBN': ['Severnobanatski okrug'],
        'RS-SR': ['Sremski okrug'],
        'RS-PO': ['Pomoravski okrug'],
        'RS-RA': ['Rasinski okrug'],
        'RS-RA2': ['Raški okrug', 'Raski okrug'],
        'RS-PD': ['Podunavski okrug'],
        'RS-TO': ['Toplički okrug', 'Toplicki okrug']
      },
      CA: {
        'CA-AB': ['Alberta'],
        'CA-BC': ['British Columbia', 'Colombie-Britannique'],
        'CA-MB': ['Manitoba'],
        'CA-NB': ['New Brunswick', 'Nouveau-Brunswick'],
        'CA-NL': ['Newfoundland and Labrador', 'Terre-Neuve-et-Labrador'],
        'CA-NS': ['Nova Scotia', 'Nouvelle-Écosse', 'Nouvelle-Ecosse'],
        'CA-ON': ['Ontario'],
        'CA-PE': ['Prince Edward Island', 'Île-du-Prince-Édouard', 'Ile-du-Prince-Edouard'],
        'CA-QC': ['Quebec', 'Québec'],
        'CA-SK': ['Saskatchewan'],
        'CA-NT': ['Northwest Territories', 'Territoires du Nord-Ouest'],
        'CA-NU': ['Nunavut'],
        'CA-YT': ['Yukon']
      },
      MX: {
        'MX-CMX': ['Ciudad de México', 'Ciudad de Mexico', 'Mexico City', 'Distrito Federal'],
        'MX-AGU': ['Aguascalientes'],
        'MX-BCN': ['Baja California'],
        'MX-BCS': ['Baja California Sur'],
        'MX-CAM': ['Campeche'],
        'MX-CHP': ['Chiapas'],
        'MX-CHH': ['Chihuahua'],
        'MX-COA': ['Coahuila', 'Coahuila de Zaragoza'],
        'MX-COL': ['Colima'],
        'MX-DUR': ['Durango'],
        'MX-GUA': ['Guanajuato'],
        'MX-GRO': ['Guerrero'],
        'MX-HID': ['Hidalgo'],
        'MX-JAL': ['Jalisco'],
        'MX-MEX': ['Estado de México', 'Estado de Mexico', 'México', 'Mexico State'],
        'MX-MIC': ['Michoacán', 'Michoacan'],
        'MX-MOR': ['Morelos'],
        'MX-NAY': ['Nayarit'],
        'MX-NLE': ['Nuevo León', 'Nuevo Leon'],
        'MX-OAX': ['Oaxaca'],
        'MX-PUE': ['Puebla'],
        'MX-QUE': ['Querétaro', 'Queretaro'],
        'MX-ROO': ['Quintana Roo'],
        'MX-SLP': ['San Luis Potosí', 'San Luis Potosi'],
        'MX-SIN': ['Sinaloa'],
        'MX-SON': ['Sonora'],
        'MX-TAB': ['Tabasco'],
        'MX-TAM': ['Tamaulipas'],
        'MX-TLA': ['Tlaxcala'],
        'MX-VER': ['Veracruz', 'Veracruz de Ignacio de la Llave'],
        'MX-YUC': ['Yucatán', 'Yucatan'],
        'MX-ZAC': ['Zacatecas']
      },
      JP: {
        'JP-01': ['Hokkaido'],
        'JP-02': ['Aomori'],
        'JP-03': ['Iwate'],
        'JP-04': ['Miyagi'],
        'JP-05': ['Akita'],
        'JP-06': ['Yamagata'],
        'JP-07': ['Fukushima'],
        'JP-08': ['Ibaraki'],
        'JP-09': ['Tochigi'],
        'JP-10': ['Gunma'],
        'JP-11': ['Saitama'],
        'JP-12': ['Chiba'],
        'JP-13': ['Tokyo', 'Tokyo-to'],
        'JP-14': ['Kanagawa'],
        'JP-15': ['Niigata'],
        'JP-16': ['Toyama'],
        'JP-17': ['Ishikawa'],
        'JP-18': ['Fukui'],
        'JP-19': ['Yamanashi'],
        'JP-20': ['Nagano'],
        'JP-21': ['Gifu'],
        'JP-22': ['Shizuoka'],
        'JP-23': ['Aichi'],
        'JP-24': ['Mie'],
        'JP-25': ['Shiga'],
        'JP-26': ['Kyoto'],
        'JP-27': ['Osaka'],
        'JP-28': ['Hyogo', 'Hyōgo'],
        'JP-29': ['Nara'],
        'JP-30': ['Wakayama'],
        'JP-31': ['Tottori'],
        'JP-32': ['Shimane'],
        'JP-33': ['Okayama'],
        'JP-34': ['Hiroshima'],
        'JP-35': ['Yamaguchi'],
        'JP-36': ['Tokushima'],
        'JP-37': ['Kagawa'],
        'JP-38': ['Ehime'],
        'JP-39': ['Kochi', 'Kōchi'],
        'JP-40': ['Fukuoka'],
        'JP-41': ['Saga'],
        'JP-42': ['Nagasaki'],
        'JP-43': ['Kumamoto'],
        'JP-44': ['Oita', 'Ōita'],
        'JP-45': ['Miyazaki'],
        'JP-46': ['Kagoshima'],
        'JP-47': ['Okinawa']
      },
      IN: {
        'IN-AN': ['Andaman and Nicobar Islands'],
        'IN-AP': ['Andhra Pradesh'],
        'IN-AR': ['Arunachal Pradesh'],
        'IN-AS': ['Assam'],
        'IN-BR': ['Bihar'],
        'IN-CH': ['Chandigarh'],
        'IN-CT': ['Chhattisgarh'],
        'IN-DN': ['Dadra and Nagar Haveli and Daman and Diu', 'Dadra and Nagar Haveli', 'Daman and Diu'],
        'IN-DL': ['Delhi', 'NCT of Delhi'],
        'IN-GA': ['Goa'],
        'IN-GJ': ['Gujarat'],
        'IN-HR': ['Haryana'],
        'IN-HP': ['Himachal Pradesh'],
        'IN-JK': ['Jammu and Kashmir'],
        'IN-JH': ['Jharkhand'],
        'IN-KA': ['Karnataka'],
        'IN-KL': ['Kerala'],
        'IN-LA': ['Ladakh'],
        'IN-LD': ['Lakshadweep'],
        'IN-MP': ['Madhya Pradesh'],
        'IN-MH': ['Maharashtra'],
        'IN-MN': ['Manipur'],
        'IN-ML': ['Meghalaya'],
        'IN-MZ': ['Mizoram'],
        'IN-NL': ['Nagaland'],
        'IN-OR': ['Odisha', 'Orissa'],
        'IN-PY': ['Puducherry', 'Pondicherry'],
        'IN-PB': ['Punjab'],
        'IN-RJ': ['Rajasthan'],
        'IN-SK': ['Sikkim'],
        'IN-TN': ['Tamil Nadu'],
        'IN-TG': ['Telangana'],
        'IN-TR': ['Tripura'],
        'IN-UP': ['Uttar Pradesh'],
        'IN-UT': ['Uttarakhand', 'Uttaranchal'],
        'IN-WB': ['West Bengal']
      },
      BR: {
        'BR-AC': ['Acre'],
        'BR-AL': ['Alagoas'],
        'BR-AP': ['Amapá', 'Amapa'],
        'BR-AM': ['Amazonas'],
        'BR-BA': ['Bahia'],
        'BR-CE': ['Ceará', 'Ceara'],
        'BR-DF': ['Distrito Federal', 'Brasília', 'Brasilia'],
        'BR-ES': ['Espírito Santo', 'Espirito Santo'],
        'BR-GO': ['Goiás', 'Goias'],
        'BR-MA': ['Maranhão', 'Maranhao'],
        'BR-MT': ['Mato Grosso'],
        'BR-MS': ['Mato Grosso do Sul'],
        'BR-MG': ['Minas Gerais'],
        'BR-PA': ['Pará', 'Para'],
        'BR-PB': ['Paraíba', 'Paraiba'],
        'BR-PR': ['Paraná', 'Parana'],
        'BR-PE': ['Pernambuco'],
        'BR-PI': ['Piauí', 'Piaui'],
        'BR-RJ': ['Rio de Janeiro'],
        'BR-RN': ['Rio Grande do Norte'],
        'BR-RS': ['Rio Grande do Sul'],
        'BR-RO': ['Rondônia', 'Rondonia'],
        'BR-RR': ['Roraima'],
        'BR-SC': ['Santa Catarina'],
        'BR-SP': ['São Paulo', 'Sao Paulo'],
        'BR-SE': ['Sergipe'],
        'BR-TO': ['Tocantins']
      },
      US: {
        'US-AL': ['Alabama'],
        'US-AK': ['Alaska'],
        'US-AZ': ['Arizona'],
        'US-AR': ['Arkansas'],
        'US-CA': ['California'],
        'US-CO': ['Colorado'],
        'US-CT': ['Connecticut'],
        'US-DE': ['Delaware'],
        'US-DC': ['District of Columbia', 'Washington DC', 'Washington, D.C.'],
        'US-FL': ['Florida'],
        'US-GA': ['Georgia'],
        'US-HI': ['Hawaii'],
        'US-ID': ['Idaho'],
        'US-IL': ['Illinois'],
        'US-IN': ['Indiana'],
        'US-IA': ['Iowa'],
        'US-KS': ['Kansas'],
        'US-KY': ['Kentucky'],
        'US-LA': ['Louisiana'],
        'US-ME': ['Maine'],
        'US-MD': ['Maryland'],
        'US-MA': ['Massachusetts'],
        'US-MI': ['Michigan'],
        'US-MN': ['Minnesota'],
        'US-MS': ['Mississippi'],
        'US-MO': ['Missouri'],
        'US-MT': ['Montana'],
        'US-NE': ['Nebraska'],
        'US-NV': ['Nevada'],
        'US-NH': ['New Hampshire'],
        'US-NJ': ['New Jersey'],
        'US-NM': ['New Mexico'],
        'US-NY': ['New York'],
        'US-NC': ['North Carolina'],
        'US-ND': ['North Dakota'],
        'US-OH': ['Ohio'],
        'US-OK': ['Oklahoma'],
        'US-OR': ['Oregon'],
        'US-PA': ['Pennsylvania'],
        'US-RI': ['Rhode Island'],
        'US-SC': ['South Carolina'],
        'US-SD': ['South Dakota'],
        'US-TN': ['Tennessee'],
        'US-TX': ['Texas'],
        'US-UT': ['Utah'],
        'US-VT': ['Vermont'],
        'US-VA': ['Virginia'],
        'US-WA': ['Washington'],
        'US-WV': ['West Virginia'],
        'US-WI': ['Wisconsin'],
        'US-WY': ['Wyoming']
      },
      AR: {
        'AR-C': ['Ciudad Autónoma de Buenos Aires', 'Ciudad Autonoma de Buenos Aires', 'CABA'],
        'AR-B': ['Buenos Aires'],
        'AR-K': ['Catamarca'],
        'AR-H': ['Chaco'],
        'AR-U': ['Chubut'],
        'AR-X': ['Córdoba', 'Cordoba'],
        'AR-W': ['Corrientes'],
        'AR-E': ['Entre Ríos', 'Entre Rios'],
        'AR-P': ['Formosa'],
        'AR-Y': ['Jujuy'],
        'AR-L': ['La Pampa'],
        'AR-F': ['La Rioja'],
        'AR-M': ['Mendoza'],
        'AR-N': ['Misiones'],
        'AR-Q': ['Neuquén', 'Neuquen'],
        'AR-R': ['Río Negro', 'Rio Negro'],
        'AR-A': ['Salta'],
        'AR-J': ['San Juan'],
        'AR-D': ['San Luis'],
        'AR-Z': ['Santa Cruz'],
        'AR-S': ['Santa Fe'],
        'AR-G': ['Santiago del Estero'],
        'AR-V': ['Tierra del Fuego'],
        'AR-T': ['Tucumán', 'Tucuman']
      },
      CL: {
        'CL-AP': ['Arica y Parinacota'],
        'CL-TA': ['Tarapacá', 'Tarapaca'],
        'CL-AN': ['Antofagasta'],
        'CL-AT': ['Atacama'],
        'CL-CO': ['Coquimbo'],
        'CL-VS': ['Valparaíso', 'Valparaiso'],
        'CL-RM': ['Región Metropolitana de Santiago', 'Region Metropolitana de Santiago', 'Santiago Metropolitan'],
        'CL-LI': ['Libertador General Bernardo O’Higgins', 'Libertador General Bernardo OHiggins', 'OHiggins'],
        'CL-ML': ['Maule'],
        'CL-NB': ['Ñuble', 'Nuble'],
        'CL-BI': ['Biobío', 'Biobio'],
        'CL-AR': ['La Araucanía', 'La Araucania', 'Araucanía', 'Araucania'],
        'CL-LR': ['Los Ríos', 'Los Rios'],
        'CL-LL': ['Los Lagos'],
        'CL-AI': ['Aysén', 'Aysen'],
        'CL-MA': ['Magallanes y de la Antártica Chilena', 'Magallanes y de la Antartica Chilena']
      },
      AU: {
        'AU-ACT': ['Australian Capital Territory', 'ACT'],
        'AU-NSW': ['New South Wales', 'NSW'],
        'AU-NT': ['Northern Territory', 'NT'],
        'AU-QLD': ['Queensland', 'QLD'],
        'AU-SA': ['South Australia', 'SA'],
        'AU-TAS': ['Tasmania', 'TAS'],
        'AU-VIC': ['Victoria', 'VIC'],
        'AU-WA': ['Western Australia', 'WA']
      },
      NZ: {
        'NZ-AUK': ['Auckland'],
        'NZ-BOP': ['Bay of Plenty'],
        'NZ-CAN': ['Canterbury'],
        'NZ-GIS': ['Gisborne'],
        'NZ-HKB': ['Hawke’s Bay', 'Hawkes Bay'],
        'NZ-MBH': ['Marlborough'],
        'NZ-MWT': ['Manawatū-Whanganui', 'Manawatu-Whanganui'],
        'NZ-NSN': ['Nelson'],
        'NZ-NTL': ['Northland'],
        'NZ-OTA': ['Otago'],
        'NZ-STL': ['Southland'],
        'NZ-TAS': ['Tasman'],
        'NZ-TKI': ['Taranaki'],
        'NZ-WGN': ['Wellington'],
        'NZ-WKO': ['Waikato'],
        'NZ-WTC': ['West Coast'],
        'NZ-CIT': ['Chatham Islands Territory', 'Chatham Islands']
      },
      CN: {
        'CN-BJ': ['Beijing', 'Pékin'],
        'CN-TJ': ['Tianjin'],
        'CN-HE': ['Hebei'],
        'CN-SX': ['Shanxi'],
        'CN-NM': ['Inner Mongolia', 'Nei Mongol'],
        'CN-LN': ['Liaoning'],
        'CN-JL': ['Jilin'],
        'CN-HL': ['Heilongjiang'],
        'CN-SH': ['Shanghai'],
        'CN-JS': ['Jiangsu'],
        'CN-ZJ': ['Zhejiang'],
        'CN-AH': ['Anhui'],
        'CN-FJ': ['Fujian'],
        'CN-JX': ['Jiangxi'],
        'CN-SD': ['Shandong'],
        'CN-HA': ['Henan'],
        'CN-HB': ['Hubei'],
        'CN-HN': ['Hunan'],
        'CN-GD': ['Guangdong'],
        'CN-GX': ['Guangxi', 'Guangxi Zhuang'],
        'CN-HI': ['Hainan'],
        'CN-CQ': ['Chongqing'],
        'CN-SC': ['Sichuan'],
        'CN-GZ': ['Guizhou'],
        'CN-YN': ['Yunnan'],
        'CN-XZ': ['Tibet', 'Xizang'],
        'CN-SN': ['Shaanxi'],
        'CN-GS': ['Gansu'],
        'CN-QH': ['Qinghai'],
        'CN-NX': ['Ningxia'],
        'CN-XJ': ['Xinjiang'],
        'CN-HK': ['Hong Kong'],
        'CN-MO': ['Macao', 'Macau'],
        'CN-TW': ['Taiwan']
      },
      KR: {
        'KR-11': ['Seoul', 'Seoul-teukbyeolsi'],
        'KR-26': ['Busan'],
        'KR-27': ['Daegu'],
        'KR-28': ['Incheon'],
        'KR-29': ['Gwangju'],
        'KR-30': ['Daejeon'],
        'KR-31': ['Ulsan'],
        'KR-36': ['Sejong'],
        'KR-41': ['Gyeonggi-do', 'Gyeonggi'],
        'KR-42': ['Gangwon-do', 'Gangwon'],
        'KR-43': ['Chungcheongbuk-do', 'North Chungcheong'],
        'KR-44': ['Chungcheongnam-do', 'South Chungcheong'],
        'KR-45': ['Jeollabuk-do', 'North Jeolla'],
        'KR-46': ['Jeollanam-do', 'South Jeolla'],
        'KR-47': ['Gyeongsangbuk-do', 'North Gyeongsang'],
        'KR-48': ['Gyeongsangnam-do', 'South Gyeongsang'],
        'KR-49': ['Jeju-do', 'Jeju']
      },
      ID: {
        'ID-AC': ['Aceh'],
        'ID-SU': ['Sumatera Utara', 'North Sumatra'],
        'ID-SB': ['Sumatera Barat', 'West Sumatra'],
        'ID-RI': ['Riau'],
        'ID-JA': ['Jambi'],
        'ID-SS': ['Sumatera Selatan', 'South Sumatra'],
        'ID-BB': ['Kepulauan Bangka Belitung', 'Bangka Belitung Islands'],
        'ID-BE': ['Bengkulu'],
        'ID-LA': ['Lampung'],
        'ID-JK': ['DKI Jakarta', 'Jakarta'],
        'ID-JB': ['Jawa Barat', 'West Java'],
        'ID-JT': ['Jawa Tengah', 'Central Java'],
        'ID-YO': ['DI Yogyakarta', 'Yogyakarta'],
        'ID-JI': ['Jawa Timur', 'East Java'],
        'ID-BA': ['Bali'],
        'ID-NB': ['Nusa Tenggara Barat', 'West Nusa Tenggara'],
        'ID-NT': ['Nusa Tenggara Timur', 'East Nusa Tenggara'],
        'ID-KB': ['Kalimantan Barat', 'West Kalimantan'],
        'ID-KT': ['Kalimantan Tengah', 'Central Kalimantan'],
        'ID-KS': ['Kalimantan Selatan', 'South Kalimantan'],
        'ID-KI': ['Kalimantan Timur', 'East Kalimantan'],
        'ID-KU': ['Kalimantan Utara', 'North Kalimantan'],
        'ID-SA': ['Sulawesi Utara', 'North Sulawesi'],
        'ID-ST': ['Sulawesi Tengah', 'Central Sulawesi'],
        'ID-SG': ['Sulawesi Tenggara', 'Southeast Sulawesi'],
        'ID-SR': ['Sulawesi Barat', 'West Sulawesi'],
        'ID-SN': ['Sulawesi Selatan', 'South Sulawesi'],
        'ID-GO': ['Gorontalo'],
        'ID-MA': ['Maluku'],
        'ID-MU': ['Maluku Utara', 'North Maluku'],
        'ID-PA': ['Papua'],
        'ID-PB': ['Papua Barat', 'West Papua'],
        'ID-PS': ['Papua Selatan', 'South Papua'],
        'ID-PT': ['Papua Tengah', 'Central Papua'],
        'ID-PE': ['Papua Pegunungan', 'Highland Papua'],
        'ID-PD': ['Papua Barat Daya', 'Southwest Papua'],
        'ID-KR': ['Kepulauan Riau', 'Riau Islands']
      },
      PH: {
        'PH-NCR': ['National Capital Region', 'Metro Manila'],
        'PH-CAR': ['Cordillera Administrative Region', 'CAR'],
        'PH-R01': ['Ilocos Region', 'Region I'],
        'PH-R02': ['Cagayan Valley', 'Region II'],
        'PH-R03': ['Central Luzon', 'Region III'],
        'PH-R04A': ['CALABARZON', 'Region IV-A'],
        'PH-R04B': ['MIMAROPA', 'Region IV-B'],
        'PH-R05': ['Bicol Region', 'Region V'],
        'PH-R06': ['Western Visayas', 'Region VI'],
        'PH-R07': ['Central Visayas', 'Region VII'],
        'PH-R08': ['Eastern Visayas', 'Region VIII'],
        'PH-R09': ['Zamboanga Peninsula', 'Region IX'],
        'PH-R10': ['Northern Mindanao', 'Region X'],
        'PH-R11': ['Davao Region', 'Region XI'],
        'PH-R12': ['SOCCSKSARGEN', 'Region XII'],
        'PH-R13': ['Caraga', 'Region XIII'],
        'PH-BARMM': ['Bangsamoro Autonomous Region in Muslim Mindanao', 'BARMM']
      },
      TR: {
        'TR-01': ['Adana'],
        'TR-06': ['Ankara'],
        'TR-07': ['Antalya'],
        'TR-09': ['Aydın', 'Aydin'],
        'TR-10': ['Balıkesir', 'Balikesir'],
        'TR-16': ['Bursa'],
        'TR-20': ['Denizli'],
        'TR-21': ['Diyarbakır', 'Diyarbakir'],
        'TR-26': ['Eskişehir', 'Eskisehir'],
        'TR-27': ['Gaziantep'],
        'TR-31': ['Hatay'],
        'TR-34': ['İstanbul', 'Istanbul'],
        'TR-35': ['İzmir', 'Izmir'],
        'TR-38': ['Kayseri'],
        'TR-41': ['Kocaeli'],
        'TR-42': ['Konya'],
        'TR-45': ['Manisa'],
        'TR-54': ['Sakarya'],
        'TR-55': ['Samsun'],
        'TR-61': ['Trabzon'],
        'TR-63': ['Şanlıurfa', 'Sanliurfa'],
        'TR-64': ['Uşak', 'Usak']
      },
      SA: {
        'SA-01': ['Riyadh', 'Ar Riyāḑ', 'Ar Riyad'],
        'SA-02': ['Makkah', 'Mecca'],
        'SA-03': ['Al Madinah', 'Medina'],
        'SA-04': ['Eastern Province', 'Ash Sharqiyah'],
        'SA-05': ['Al Qassim', 'Qassim'],
        'SA-06': ['Ha’il', 'Hail'],
        'SA-07': ['Tabuk'],
        'SA-08': ['Northern Borders'],
        'SA-09': ['Jazan', 'Jizan'],
        'SA-10': ['Najran'],
        'SA-11': ['Al Bahah', 'Al Baha'],
        'SA-12': ['Al Jawf', 'Jawf'],
        'SA-14': ['Asir', 'Aseer']
      },
      EG: {
        'EG-C': ['Cairo', 'Al Qāhirah', 'Al Qahirah'],
        'EG-ALX': ['Alexandria', 'Al Iskandariyah'],
        'EG-GZ': ['Giza', 'Al Jizah'],
        'EG-QAL': ['Qalyubia', 'Al Qalyubiyah'],
        'EG-SHR': ['Sharqia', 'Ash Sharqiyah'],
        'EG-DK': ['Dakahlia', 'Ad Daqahliyah'],
        'EG-BH': ['Beheira', 'Al Buhayrah'],
        'EG-KFS': ['Kafr El Sheikh', 'Kafr ash Shaykh'],
        'EG-GH': ['Gharbia', 'Al Gharbiyah'],
        'EG-MNF': ['Monufia', 'Al Minufiyah'],
        'EG-DT': ['Damietta', 'Dumyat'],
        'EG-PTS': ['Port Said', 'Bur Sa`id'],
        'EG-IS': ['Ismailia', 'Al Isma`iliyah'],
        'EG-SUZ': ['Suez', 'As Suways'],
        'EG-FYM': ['Faiyum', 'Al Fayyum'],
        'EG-BNS': ['Beni Suef', 'Bani Suwayf'],
        'EG-MN': ['Minya', 'Al Minya'],
        'EG-ASY': ['Asyut', 'Asyūţ', 'Asyut'],
        'EG-SOH': ['Sohag', 'Suhaj'],
        'EG-KN': ['Qena', 'Qina'],
        'EG-LX': ['Luxor', 'Al Uqsur'],
        'EG-ASN': ['Aswan', 'Aswān', 'Aswan'],
        'EG-WAD': ['New Valley', 'Al Wadi al Jadid'],
        'EG-MT': ['Matrouh', 'Matruh'],
        'EG-SIN': ['North Sinai', 'Shamal Sina'],
        'EG-SS': ['South Sinai', 'Janub Sina'],
        'EG-BA': ['Red Sea', 'Al Bahr al Ahmar']
      },
      MA: {
        'MA-01': ['Tanger-Tétouan-Al Hoceïma', 'Tanger-Tetouan-Al Hoceima'],
        'MA-02': ['Oriental'],
        'MA-03': ['Fès-Meknès', 'Fes-Meknes'],
        'MA-04': ['Rabat-Salé-Kénitra', 'Rabat-Sale-Kenitra'],
        'MA-05': ['Béni Mellal-Khénifra', 'Beni Mellal-Khenifra'],
        'MA-06': ['Casablanca-Settat'],
        'MA-07': ['Marrakech-Safi'],
        'MA-08': ['Drâa-Tafilalet', 'Draa-Tafilalet'],
        'MA-09': ['Souss-Massa'],
        'MA-10': ['Guelmim-Oued Noun'],
        'MA-11': ['Laâyoune-Sakia El Hamra', 'Laayoune-Sakia El Hamra'],
        'MA-12': ['Dakhla-Oued Ed-Dahab']
      },
      NG: {
        'NG-FC': ['Federal Capital Territory', 'FCT', 'Abuja'],
        'NG-LA': ['Lagos'],
        'NG-KN': ['Kano'],
        'NG-RI': ['Rivers'],
        'NG-OY': ['Oyo'],
        'NG-KD': ['Kaduna'],
        'NG-KT': ['Katsina'],
        'NG-AN': ['Anambra'],
        'NG-EN': ['Enugu'],
        'NG-IM': ['Imo'],
        'NG-AB': ['Abia'],
        'NG-OG': ['Ogun'],
        'NG-ON': ['Ondo'],
        'NG-DE': ['Delta'],
        'NG-ED': ['Edo'],
        'NG-PL': ['Plateau'],
        'NG-BO': ['Borno'],
        'NG-BA': ['Bauchi'],
        'NG-AK': ['Akwa Ibom']
      },
      ZA: {
        'ZA-EC': ['Eastern Cape'],
        'ZA-FS': ['Free State'],
        'ZA-GP': ['Gauteng'],
        'ZA-KZN': ['KwaZulu-Natal', 'Kwazulu Natal'],
        'ZA-LP': ['Limpopo'],
        'ZA-MP': ['Mpumalanga'],
        'ZA-NC': ['Northern Cape'],
        'ZA-NW': ['North West'],
        'ZA-WC': ['Western Cape']
      },
      KE: {
        'KE-110': ['Nairobi'],
        'KE-200': ['Mombasa'],
        'KE-300': ['Kisumu'],
        'KE-400': ['Nakuru'],
        'KE-500': ['Uasin Gishu'],
        'KE-600': ['Kiambu'],
        'KE-700': ['Machakos'],
        'KE-800': ['Kajiado'],
        'KE-900': ['Meru'],
        'KE-1000': ['Nyeri'],
        'KE-1100': ['Embu'],
        'KE-1200': ['Garissa'],
        'KE-1300': ['Wajir'],
        'KE-1400': ['Mandera'],
        'KE-1500': ['Turkana'],
        'KE-1600': ['Kilifi']
      },
      ET: {
        'ET-AA': ['Addis Ababa'],
        'ET-DD': ['Dire Dawa'],
        'ET-AF': ['Afar'],
        'ET-AM': ['Amhara'],
        'ET-BE': ['Benishangul-Gumuz'],
        'ET-GA': ['Gambela'],
        'ET-HA': ['Harari'],
        'ET-OR': ['Oromia'],
        'ET-SN': ['SNNPR', 'Southern Nations, Nationalities, and Peoples Region'],
        'ET-SO': ['Somali'],
        'ET-TI': ['Tigray'],
        'ET-SW': ['South West Ethiopia Peoples Region'],
        'ET-CE': ['Central Ethiopia'],
        'ET-SE': ['South Ethiopia']
      },
      DZ: {
        'DZ-16': ['Alger', 'Algiers'],
        'DZ-31': ['Oran'],
        'DZ-25': ['Constantine'],
        'DZ-19': ['Setif', 'Sétif'],
        'DZ-15': ['Tizi Ouzou'],
        'DZ-06': ['Bejaia', 'Béjaïa'],
        'DZ-05': ['Batna'],
        'DZ-09': ['Blida'],
        'DZ-35': ['Boumerdes', 'Boumerdès'],
        'DZ-42': ['Tipaza'],
        'DZ-41': ['Souk Ahras'],
        'DZ-18': ['Jijel'],
        'DZ-23': ['Annaba'],
        'DZ-24': ['Guelma'],
        'DZ-13': ['Tlemcen'],
        'DZ-29': ['Mascara']
      },
      TN: {
        'TN-11': ['Tunis'],
        'TN-12': ['Ariana'],
        'TN-13': ['Ben Arous'],
        'TN-14': ['Manouba'],
        'TN-21': ['Nabeul'],
        'TN-22': ['Zaghouan'],
        'TN-23': ['Bizerte'],
        'TN-31': ['Beja', 'Béja'],
        'TN-32': ['Jendouba'],
        'TN-33': ['Le Kef', 'Kef'],
        'TN-34': ['Siliana'],
        'TN-41': ['Kairouan'],
        'TN-42': ['Kasserine'],
        'TN-43': ['Sidi Bouzid'],
        'TN-51': ['Sousse'],
        'TN-52': ['Monastir'],
        'TN-53': ['Mahdia'],
        'TN-61': ['Sfax'],
        'TN-71': ['Gafsa'],
        'TN-72': ['Tozeur'],
        'TN-73': ['Kebili'],
        'TN-81': ['Gabes', 'Gabès'],
        'TN-82': ['Medenine'],
        'TN-83': ['Tataouine']
      },
      CO: {
        'CO-DC': ['Bogotá D.C.', 'Bogota D.C.', 'Bogotá', 'Bogota'],
        'CO-ANT': ['Antioquia'],
        'CO-ATL': ['Atlántico', 'Atlantico'],
        'CO-BOL': ['Bolívar', 'Bolivar'],
        'CO-BOY': ['Boyacá', 'Boyaca'],
        'CO-CAL': ['Caldas'],
        'CO-CAU': ['Cauca'],
        'CO-CES': ['Cesar'],
        'CO-CUN': ['Cundinamarca'],
        'CO-COR': ['Córdoba', 'Cordoba'],
        'CO-HUI': ['Huila'],
        'CO-MAG': ['Magdalena'],
        'CO-MET': ['Meta'],
        'CO-NAR': ['Nariño', 'Narino'],
        'CO-NSA': ['Norte de Santander'],
        'CO-QUI': ['Quindío', 'Quindio'],
        'CO-RIS': ['Risaralda'],
        'CO-SAN': ['Santander'],
        'CO-SUC': ['Sucre'],
        'CO-TOL': ['Tolima'],
        'CO-VAC': ['Valle del Cauca']
      },
      PE: {
        'PE-LMA': ['Lima'],
        'PE-CAL': ['Callao'],
        'PE-ARE': ['Arequipa'],
        'PE-CUS': ['Cusco', 'Cuzco'],
        'PE-LAL': ['La Libertad'],
        'PE-LAM': ['Lambayeque'],
        'PE-PIU': ['Piura'],
        'PE-ANC': ['Áncash', 'Ancash'],
        'PE-JUN': ['Junín', 'Junin'],
        'PE-ICA': ['Ica'],
        'PE-CAJ': ['Cajamarca'],
        'PE-PUN': ['Puno'],
        'PE-AQP': ['Apurímac', 'Apurimac'],
        'PE-HUC': ['Huánuco', 'Huanuco'],
        'PE-UCA': ['Ucayali'],
        'PE-LOR': ['Loreto'],
        'PE-MDD': ['Madre de Dios'],
        'PE-AYA': ['Ayacucho'],
        'PE-TAC': ['Tacna'],
        'PE-TUM': ['Tumbes']
      },
      VE: {
        'VE-D': ['Distrito Capital', 'Caracas'],
        'VE-A': ['Distrito Capital', 'Caracas'],
        'VE-B': ['Anzoátegui', 'Anzoategui'],
        'VE-C': ['Apure'],
        'VE-D2': ['Aragua'],
        'VE-E': ['Barinas'],
        'VE-F': ['Bolívar', 'Bolivar'],
        'VE-G': ['Carabobo'],
        'VE-H': ['Cojedes'],
        'VE-I': ['Falcón', 'Falcon'],
        'VE-J': ['Guárico', 'Guarico'],
        'VE-K': ['Lara'],
        'VE-L': ['Mérida', 'Merida'],
        'VE-M': ['Miranda'],
        'VE-N': ['Monagas'],
        'VE-O': ['Nueva Esparta'],
        'VE-P': ['Portuguesa'],
        'VE-R': ['Sucre'],
        'VE-S': ['Táchira', 'Tachira'],
        'VE-T': ['Trujillo'],
        'VE-U': ['Yaracuy'],
        'VE-V': ['Zulia'],
        'VE-W': ['Dependencias Federales'],
        'VE-X': ['La Guaira', 'Vargas'],
        'VE-Y': ['Delta Amacuro'],
        'VE-Z': ['Amazonas']
      },
      EC: {
        'EC-P': ['Pichincha'],
        'EC-G': ['Guayas'],
        'EC-A': ['Azuay'],
        'EC-M': ['Manabí', 'Manabi'],
        'EC-S': ['Santo Domingo de los Tsáchilas', 'Santo Domingo de los Tsachilas'],
        'EC-R': ['Los Ríos', 'Los Rios'],
        'EC-E': ['Esmeraldas'],
        'EC-I': ['Imbabura'],
        'EC-C': ['Carchi'],
        'EC-H': ['Chimborazo'],
        'EC-X': ['Cotopaxi'],
        'EC-T': ['Tungurahua'],
        'EC-B': ['Bolívar', 'Bolivar'],
        'EC-F': ['Cañar', 'Canar'],
        'EC-Y': ['Santa Elena'],
        'EC-O': ['El Oro'],
        'EC-L': ['Loja'],
        'EC-U': ['Sucumbíos', 'Sucumbios'],
        'EC-N': ['Napo'],
        'EC-D': ['Orellana'],
        'EC-W': ['Morona Santiago'],
        'EC-Z': ['Zamora Chinchipe'],
        'EC-K': ['Pastaza'],
        'EC-GA': ['Galápagos', 'Galapagos']
      },
      UY: {
        'UY-MO': ['Montevideo'],
        'UY-CA': ['Canelones'],
        'UY-MA': ['Maldonado'],
        'UY-CO': ['Colonia'],
        'UY-SJ': ['San José', 'San Jose'],
        'UY-SO': ['Soriano'],
        'UY-RN': ['Río Negro', 'Rio Negro'],
        'UY-PA': ['Paysandú', 'Paysandu'],
        'UY-SA': ['Salto'],
        'UY-AR': ['Artigas'],
        'UY-RV': ['Rivera'],
        'UY-TA': ['Tacuarembó', 'Tacuarembo'],
        'UY-DU': ['Durazno'],
        'UY-FS': ['Flores'],
        'UY-FD': ['Florida'],
        'UY-LA': ['Lavalleja'],
        'UY-RO': ['Rocha'],
        'UY-TT': ['Treinta y Tres'],
        'UY-CL': ['Cerro Largo']
      },
      PY: {
        'PY-ASU': ['Asunción', 'Asuncion'],
        'PY-11': ['Central'],
        'PY-1': ['Concepción', 'Concepcion'],
        'PY-2': ['San Pedro'],
        'PY-3': ['Cordillera'],
        'PY-4': ['Guairá', 'Guaira'],
        'PY-5': ['Caaguazú', 'Caaguazu'],
        'PY-6': ['Caazapá', 'Caazapa'],
        'PY-7': ['Itapúa', 'Itapua'],
        'PY-8': ['Misiones'],
        'PY-9': ['Paraguarí', 'Paraguari'],
        'PY-10': ['Alto Paraná', 'Alto Parana'],
        'PY-12': ['Ñeembucú', 'Neembucu'],
        'PY-13': ['Amambay'],
        'PY-14': ['Canindeyú', 'Canindeyu'],
        'PY-15': ['Presidente Hayes'],
        'PY-16': ['Alto Paraguay'],
        'PY-17': ['Boquerón', 'Boqueron']
      },
      BO: {
        'BO-B': ['Beni'],
        'BO-C': ['Cochabamba'],
        'BO-H': ['Chuquisaca'],
        'BO-L': ['La Paz'],
        'BO-N': ['Pando'],
        'BO-O': ['Oruro'],
        'BO-P': ['Potosí', 'Potosi'],
        'BO-S': ['Santa Cruz'],
        'BO-T': ['Tarija']
      },
      GT: {
        'GT-01': ['Guatemala'],
        'GT-02': ['El Progreso'],
        'GT-03': ['Sacatepéquez', 'Sacatepequez'],
        'GT-04': ['Chimaltenango'],
        'GT-05': ['Escuintla'],
        'GT-06': ['Santa Rosa'],
        'GT-07': ['Sololá', 'Solola'],
        'GT-08': ['Totonicapán', 'Totonicapan'],
        'GT-09': ['Quetzaltenango'],
        'GT-10': ['Suchitepéquez', 'Suchitepequez'],
        'GT-11': ['Retalhuleu'],
        'GT-12': ['San Marcos'],
        'GT-13': ['Huehuetenango'],
        'GT-14': ['Quiché', 'Quiche'],
        'GT-15': ['Baja Verapaz'],
        'GT-16': ['Alta Verapaz'],
        'GT-17': ['Petén', 'Peten'],
        'GT-18': ['Izabal'],
        'GT-19': ['Zacapa'],
        'GT-20': ['Chiquimula'],
        'GT-21': ['Jalapa'],
        'GT-22': ['Jutiapa']
      },
      CR: {
        'CR-SJ': ['San José', 'San Jose'],
        'CR-A': ['Alajuela'],
        'CR-C': ['Cartago'],
        'CR-H': ['Heredia'],
        'CR-G': ['Guanacaste'],
        'CR-P': ['Puntarenas'],
        'CR-L': ['Limón', 'Limon']
      },
      PA: {
        'PA-8': ['Panamá', 'Panama'],
        'PA-1': ['Bocas del Toro'],
        'PA-2': ['Coclé', 'Cocle'],
        'PA-3': ['Colón', 'Colon'],
        'PA-4': ['Chiriquí', 'Chiriqui'],
        'PA-5': ['Darién', 'Darien'],
        'PA-6': ['Herrera'],
        'PA-7': ['Los Santos'],
        'PA-9': ['Veraguas'],
        'PA-10': ['Panamá Oeste', 'Panama Oeste'],
        'PA-EM': ['Emberá-Wounaan', 'Embera-Wounaan'],
        'PA-KY': ['Guna Yala'],
        'PA-NB': ['Ngäbe-Buglé', 'Ngabe-Bugle']
      },
      DO: {
        'DO-01': ['Distrito Nacional', 'Santo Domingo'],
        'DO-02': ['Azua'],
        'DO-03': ['Baoruco'],
        'DO-04': ['Barahona'],
        'DO-05': ['Dajabón', 'Dajabon'],
        'DO-06': ['Duarte'],
        'DO-07': ['Elías Piña', 'Elias Pina'],
        'DO-08': ['El Seibo'],
        'DO-09': ['Espaillat'],
        'DO-10': ['Independencia'],
        'DO-11': ['La Altagracia'],
        'DO-12': ['La Romana'],
        'DO-13': ['La Vega'],
        'DO-14': ['María Trinidad Sánchez', 'Maria Trinidad Sanchez'],
        'DO-15': ['Monte Cristi'],
        'DO-16': ['Pedernales'],
        'DO-17': ['Peravia'],
        'DO-18': ['Puerto Plata'],
        'DO-19': ['Hermanas Mirabal'],
        'DO-20': ['Samaná', 'Samana'],
        'DO-21': ['San Cristóbal', 'San Cristobal'],
        'DO-22': ['San Juan'],
        'DO-23': ['San Pedro de Macorís', 'San Pedro de Macoris'],
        'DO-24': ['Sánchez Ramírez', 'Sanchez Ramirez'],
        'DO-25': ['Santiago'],
        'DO-26': ['Santiago Rodríguez', 'Santiago Rodriguez'],
        'DO-27': ['Valverde'],
        'DO-28': ['Monseñor Nouel', 'Monsenor Nouel'],
        'DO-29': ['Monte Plata'],
        'DO-30': ['Hato Mayor'],
        'DO-31': ['San José de Ocoa', 'San Jose de Ocoa'],
        'DO-32': ['Santo Domingo']
      },
      CU: {
        'CU-01': ['Pinar del Río', 'Pinar del Rio'],
        'CU-02': ['Artemisa'],
        'CU-03': ['La Habana', 'Havana'],
        'CU-04': ['Mayabeque'],
        'CU-05': ['Matanzas'],
        'CU-06': ['Villa Clara'],
        'CU-07': ['Cienfuegos'],
        'CU-08': ['Sancti Spíritus', 'Sancti Spiritus'],
        'CU-09': ['Ciego de Ávila', 'Ciego de Avila'],
        'CU-10': ['Camagüey', 'Camaguey'],
        'CU-11': ['Las Tunas'],
        'CU-12': ['Granma'],
        'CU-13': ['Holguín', 'Holguin'],
        'CU-14': ['Santiago de Cuba'],
        'CU-15': ['Guantánamo', 'Guantanamo'],
        'CU-16': ['Isla de la Juventud']
      },
      HN: {
        'HN-AT': ['Atlántida', 'Atlantida'],
        'HN-CH': ['Choluteca'],
        'HN-CL': ['Colón', 'Colon'],
        'HN-CM': ['Comayagua'],
        'HN-CP': ['Copán', 'Copan'],
        'HN-CR': ['Cortés', 'Cortes'],
        'HN-EP': ['El Paraíso', 'El Paraiso'],
        'HN-FM': ['Francisco Morazán', 'Francisco Morazan'],
        'HN-GD': ['Gracias a Dios'],
        'HN-IN': ['Intibucá', 'Intibuca'],
        'HN-IB': ['Islas de la Bahía', 'Islas de la Bahia'],
        'HN-LP': ['La Paz'],
        'HN-LE': ['Lempira'],
        'HN-OC': ['Ocotepeque'],
        'HN-OL': ['Olancho'],
        'HN-SB': ['Santa Bárbara', 'Santa Barbara'],
        'HN-VA': ['Valle'],
        'HN-YO': ['Yoro']
      },
      NI: {
        'NI-BO': ['Boaco'],
        'NI-CA': ['Carazo'],
        'NI-CI': ['Chinandega'],
        'NI-CO': ['Chontales'],
        'NI-ES': ['Estelí', 'Esteli'],
        'NI-GR': ['Granada'],
        'NI-JI': ['Jinotega'],
        'NI-LE': ['León', 'Leon'],
        'NI-MD': ['Madriz'],
        'NI-MN': ['Managua'],
        'NI-MS': ['Masaya'],
        'NI-MT': ['Matagalpa'],
        'NI-NS': ['Nueva Segovia'],
        'NI-SJ': ['Río San Juan', 'Rio San Juan'],
        'NI-RI': ['Rivas'],
        'NI-AN': ['North Caribbean Coast'],
        'NI-AS': ['South Caribbean Coast']
      },
      SV: {
        'SV-AH': ['Ahuachapán', 'Ahuachapan'],
        'SV-CA': ['Cabañas', 'Cabanas'],
        'SV-CH': ['Chalatenango'],
        'SV-CU': ['Cuscatlán', 'Cuscatlan'],
        'SV-LI': ['La Libertad'],
        'SV-MO': ['Morazán', 'Morazan'],
        'SV-PA': ['La Paz'],
        'SV-SA': ['Santa Ana'],
        'SV-SM': ['San Miguel'],
        'SV-SO': ['Sonsonate'],
        'SV-SS': ['San Salvador'],
        'SV-SV': ['San Vicente'],
        'SV-UN': ['La Unión', 'La Union'],
        'SV-US': ['Usulután', 'Usulutan']
      },
      JM: {
        'JM-KIN': ['Kingston'],
        'JM-AND': ['St. Andrew', 'Saint Andrew'],
        'JM-THO': ['St. Thomas', 'Saint Thomas'],
        'JM-POR': ['Portland'],
        'JM-STM': ['St. Mary', 'Saint Mary'],
        'JM-STA': ['St. Ann', 'Saint Ann'],
        'JM-TRL': ['Trelawny'],
        'JM-STJ': ['St. James', 'Saint James'],
        'JM-HAN': ['Hanover'],
        'JM-WML': ['Westmoreland'],
        'JM-MAN': ['Manchester'],
        'JM-ELI': ['St. Elizabeth', 'Saint Elizabeth'],
        'JM-CLA': ['Clarendon'],
        'JM-STC': ['St. Catherine', 'Saint Catherine']
      },
      BS: {
        'BS-NP': ['New Providence'],
        'BS-FP': ['Freeport'],
        'BS-AB': ['Abaco'],
        'BS-AC': ['Acklins'],
        'BS-BI': ['Bimini'],
        'BS-BP': ['Black Point'],
        'BS-BY': ['Berry Islands'],
        'BS-CE': ['Central Eleuthera'],
        'BS-CI': ['Cat Island'],
        'BS-EX': ['Exuma'],
        'BS-GC': ['Grand Cay'],
        'BS-HI': ['Harbour Island'],
        'BS-HT': ['Hope Town'],
        'BS-IN': ['Inagua'],
        'BS-LI': ['Long Island'],
        'BS-MC': ['Mangrove Cay'],
        'BS-MI': ['Moore\'s Island'],
        'BS-NE': ['North Eleuthera'],
        'BS-RI': ['Ragged Island'],
        'BS-RS': ['Rock Sound'],
        'BS-SA': ['South Andros'],
        'BS-SE': ['South Eleuthera'],
        'BS-SO': ['South Abaco'],
        'BS-SS': ['San Salvador'],
        'BS-SW': ['Spanish Wells'],
        'BS-WG': ['West Grand Bahama']
      },
      TT: {
        'TT-POS': ['Port of Spain'],
        'TT-SFO': ['San Fernando'],
        'TT-ARI': ['Arima'],
        'TT-CHA': ['Chaguanas'],
        'TT-CTT': ['Couva-Tabaquite-Talparo'],
        'TT-DMN': ['Diego Martin'],
        'TT-MAY': ['Mayaro-Rio Claro'],
        'TT-PED': ['Penal-Debe'],
        'TT-PRT': ['Princes Town'],
        'TT-SGE': ['Sangre Grande'],
        'TT-SIP': ['Siparia'],
        'TT-SJL': ['San Juan-Laventille'],
        'TT-TUP': ['Tunapuna-Piarco'],
        'TT-ETO': ['Tobago East'],
        'TT-WTO': ['Tobago West']
      },
      BB: {
        'BB-01': ['Christ Church'],
        'BB-02': ['Saint Andrew', 'St Andrew'],
        'BB-03': ['Saint George', 'St George'],
        'BB-04': ['Saint James', 'St James'],
        'BB-05': ['Saint John', 'St John'],
        'BB-06': ['Saint Joseph', 'St Joseph'],
        'BB-07': ['Saint Lucy', 'St Lucy'],
        'BB-08': ['Saint Michael', 'St Michael'],
        'BB-09': ['Saint Peter', 'St Peter'],
        'BB-10': ['Saint Philip', 'St Philip'],
        'BB-11': ['Saint Thomas', 'St Thomas']
      },
      AG: {
        'AG-03': ['Saint George', 'St George'],
        'AG-04': ['Saint John', 'St John'],
        'AG-05': ['Saint Mary', 'St Mary'],
        'AG-06': ['Saint Paul', 'St Paul'],
        'AG-07': ['Saint Peter', 'St Peter'],
        'AG-08': ['Saint Philip', 'St Philip'],
        'AG-10': ['Barbuda'],
        'AG-11': ['Redonda']
      },
      GD: {
        'GD-01': ['Saint Andrew', 'St Andrew'],
        'GD-02': ['Saint David', 'St David'],
        'GD-03': ['Saint George', 'St George'],
        'GD-04': ['Saint John', 'St John'],
        'GD-05': ['Saint Mark', 'St Mark'],
        'GD-06': ['Saint Patrick', 'St Patrick'],
        'GD-10': ['Carriacou and Petite Martinique']
      },
      LC: {
        'LC-01': ['Anse la Raye'],
        'LC-02': ['Castries'],
        'LC-03': ['Choiseul'],
        'LC-04': ['Dauphin'],
        'LC-05': ['Dennery'],
        'LC-06': ['Gros Islet'],
        'LC-07': ['Laborie'],
        'LC-08': ['Micoud'],
        'LC-09': ['Praslin'],
        'LC-10': ['Soufrière', 'Soufriere'],
        'LC-11': ['Vieux Fort']
      },
      VC: {
        'VC-01': ['Charlotte'],
        'VC-02': ['Saint Andrew', 'St Andrew'],
        'VC-03': ['Saint David', 'St David'],
        'VC-04': ['Saint George', 'St George'],
        'VC-05': ['Saint Patrick', 'St Patrick'],
        'VC-06': ['Grenadines']
      },
      DM: {
        'DM-02': ['Saint Andrew', 'St Andrew'],
        'DM-03': ['Saint David', 'St David'],
        'DM-04': ['Saint George', 'St George'],
        'DM-05': ['Saint John', 'St John'],
        'DM-06': ['Saint Joseph', 'St Joseph'],
        'DM-07': ['Saint Luke', 'St Luke'],
        'DM-08': ['Saint Mark', 'St Mark'],
        'DM-09': ['Saint Patrick', 'St Patrick'],
        'DM-10': ['Saint Paul', 'St Paul'],
        'DM-11': ['Saint Peter', 'St Peter']
      },
      KN: {
        'KN-K01': ['Christ Church Nichola Town'],
        'KN-K02': ['Saint Anne Sandy Point', 'St Anne Sandy Point'],
        'KN-K03': ['Saint George Basseterre', 'St George Basseterre'],
        'KN-K04': ['Saint George Gingerland', 'St George Gingerland'],
        'KN-K05': ['Saint James Windward', 'St James Windward'],
        'KN-K06': ['Saint John Capisterre', 'St John Capisterre'],
        'KN-K07': ['Saint John Figtree', 'St John Figtree'],
        'KN-K08': ['Saint Mary Cayon', 'St Mary Cayon'],
        'KN-K09': ['Saint Paul Capisterre', 'St Paul Capisterre'],
        'KN-K10': ['Saint Paul Charlestown', 'St Paul Charlestown'],
        'KN-K11': ['Saint Peter Basseterre', 'St Peter Basseterre'],
        'KN-K12': ['Saint Thomas Lowland', 'St Thomas Lowland'],
        'KN-K13': ['Saint Thomas Middle Island', 'St Thomas Middle Island'],
        'KN-K15': ['Trinity Palmetto Point']
      },
      HT: {
        'HT-AR': ['Artibonite'],
        'HT-CE': ['Centre'],
        'HT-GA': ['Grand\'Anse', 'Grand Anse'],
        'HT-NI': ['Nippes'],
        'HT-ND': ['Nord'],
        'HT-NE': ['Nord-Est', 'Nord Est'],
        'HT-NO': ['Nord-Ouest', 'Nord Ouest'],
        'HT-OU': ['Ouest'],
        'HT-SD': ['Sud'],
        'HT-SE': ['Sud-Est', 'Sud Est']
      },
      SR: {
        'SR-BR': ['Brokopondo'],
        'SR-CM': ['Commewijne'],
        'SR-CR': ['Coronie'],
        'SR-MA': ['Marowijne'],
        'SR-NI': ['Nickerie'],
        'SR-PR': ['Para'],
        'SR-PM': ['Paramaribo'],
        'SR-SA': ['Saramacca'],
        'SR-SI': ['Sipaliwini'],
        'SR-WA': ['Wanica']
      },
      GY: {
        'GY-BA': ['Barima-Waini'],
        'GY-CU': ['Cuyuni-Mazaruni'],
        'GY-DE': ['Demerara-Mahaica'],
        'GY-EB': ['East Berbice-Corentyne'],
        'GY-ES': ['Essequibo Islands-West Demerara'],
        'GY-MA': ['Mahaica-Berbice'],
        'GY-PM': ['Pomeroon-Supenaam'],
        'GY-PT': ['Potaro-Siparuni'],
        'GY-UD': ['Upper Demerara-Berbice'],
        'GY-UT': ['Upper Takutu-Upper Essequibo']
      },
      BZ: {
        'BZ-BZ': ['Belize'],
        'BZ-CY': ['Cayo'],
        'BZ-CZL': ['Corozal'],
        'BZ-OW': ['Orange Walk'],
        'BZ-SC': ['Stann Creek'],
        'BZ-TOL': ['Toledo']
      },
      BM: {
        'BM-DEV': ['Devonshire'],
        'BM-HAM': ['Hamilton Parish'],
        'BM-PAG': ['Paget'],
        'BM-PEM': ['Pembroke'],
        'BM-SAI': ['Saint George\'s Parish', 'St George\'s Parish'],
        'BM-SAN': ['Sandys'],
        'BM-SMI': ['Smith\'s', 'Smiths'],
        'BM-SOU': ['Southampton'],
        'BM-WAR': ['Warwick'],
        'BM-HAMC': ['Hamilton'],
        'BM-SGC': ['Saint George', 'St George']
      },
      AW: {
        'AW-NW': ['Noord'],
        'AW-OR': ['Oranjestad'],
        'AW-PA': ['Paradera'],
        'AW-SN': ['San Nicolas'],
        'AW-SC': ['Santa Cruz'],
        'AW-SV': ['Savaneta']
      },
      CW: {
        'CW-BAN': ['Bandabou', 'Banda Bou'],
        'CW-BIN': ['Banda Abou'],
        'CW-BOA': ['Banda Ariba'],
        'CW-PUN': ['Punda'],
        'CW-OTR': ['Otrobanda', 'Otrabanda'],
        'CW-SCH': ['Schottegat']
      },
      SX: {
        'SX-PHI': ['Philipsburg'],
        'SX-CUL': ['Cul de Sac'],
        'SX-COB': ['Cole Bay'],
        'SX-SIM': ['Simpson Bay'],
        'SX-MAF': ['Maho'],
        'SX-LOW': ['Lower Prince\'s Quarter', 'Lower Princes Quarter']
      },
      BQ: {
        'BQ-BO': ['Bonaire'],
        'BQ-SA': ['Saba'],
        'BQ-SE': ['Sint Eustatius', 'St Eustatius']
      },
      AI: {
        'AI-BL': ['Blowing Point'],
        'AI-EA': ['East End'],
        'AI-GH': ['George Hill'],
        'AI-NH': ['North Hill'],
        'AI-SA': ['Sandy Ground'],
        'AI-SH': ['South Hill'],
        'AI-ST': ['Stoney Ground'],
        'AI-TV': ['The Valley']
      },
      MS: {
        'MS-SA': ['Saint Anthony', 'St Anthony'],
        'MS-SG': ['Saint Georges', 'St Georges'],
        'MS-SP': ['Saint Peter', 'St Peter']
      },
      VG: {
        'VG-TO': ['Tortola'],
        'VG-VG': ['Virgin Gorda'],
        'VG-AN': ['Anegada'],
        'VG-JD': ['Jost Van Dyke']
      },
      VI: {
        'VI-STT': ['Saint Thomas', 'St Thomas'],
        'VI-STJ': ['Saint John', 'St John'],
        'VI-STX': ['Saint Croix', 'St Croix']
      },
      KY: {
        'KY-GT': ['George Town'],
        'KY-WB': ['West Bay'],
        'KY-BT': ['Bodden Town'],
        'KY-NS': ['North Side'],
        'KY-EE': ['East End'],
        'KY-SI': ['Sister Islands', 'Cayman Brac', 'Little Cayman']
      },
      TC: {
        'TC-PR': ['Providenciales'],
        'TC-GT': ['Grand Turk'],
        'TC-NC': ['North Caicos'],
        'TC-MC': ['Middle Caicos'],
        'TC-SC': ['South Caicos'],
        'TC-SCAY': ['Salt Cay']
      },
      JE: {
        'JE-GRO': ['Grouville'],
        'JE-BRE': ['Saint Brelade', 'St Brelade'],
        'JE-CLE': ['Saint Clement', 'St Clement'],
        'JE-HEL': ['Saint Helier', 'St Helier'],
        'JE-JOH': ['Saint John', 'St John'],
        'JE-LAW': ['Saint Lawrence', 'St Lawrence'],
        'JE-MAR': ['Saint Martin', 'St Martin'],
        'JE-MRY': ['Saint Mary', 'St Mary'],
        'JE-OUE': ['Saint Ouen', 'St Ouen'],
        'JE-PET': ['Saint Peter', 'St Peter'],
        'JE-SAV': ['Saint Saviour', 'St Saviour'],
        'JE-TRI': ['Trinity']
      },
      GG: {
        'GG-CAS': ['Castel'],
        'GG-FOR': ['Forest'],
        'GG-AND': ['Saint Andrew', 'St Andrew'],
        'GG-MAR': ['Saint Martin', 'St Martin'],
        'GG-PPO': ['Saint Peter Port', 'St Peter Port'],
        'GG-PIB': ['Saint Pierre du Bois', 'St Pierre du Bois'],
        'GG-SAM': ['Saint Sampson', 'St Sampson'],
        'GG-SAV': ['Saint Saviour', 'St Saviour'],
        'GG-TOR': ['Torteval'],
        'GG-VAL': ['Vale']
      },
      IM: {
        'IM-AYR': ['Ayre'],
        'IM-GAR': ['Garff'],
        'IM-GLE': ['Glenfaba'],
        'IM-MIC': ['Michael'],
        'IM-RUS': ['Rushen'],
        'IM-DOU': ['Douglas']
      },
      FO: {
        'FO-STR': ['Streymoy'],
        'FO-EYS': ['Eysturoy'],
        'FO-VAG': ['Vágar', 'Vagar'],
        'FO-SAN': ['Sandoy'],
        'FO-SUD': ['Suðuroy', 'Suduroy'],
        'FO-NOR': ['Norðoyar', 'Nordoyar']
      },
      GI: {
        'GI-ALL': ['Gibraltar']
      },
      GL: {
        'GL-AVA': ['Avannaata'],
        'GL-KUJ': ['Kujalleq'],
        'GL-QEQ': ['Qeqqata'],
        'GL-QER': ['Qeqertalik'],
        'GL-SER': ['Sermersooq']
      },
      AD: {
        'AD-07': ['Andorra la Vella'],
        'AD-02': ['Canillo'],
        'AD-03': ['Encamp'],
        'AD-08': ['Escaldes-Engordany', 'Escaldes Engordany'],
        'AD-04': ['La Massana'],
        'AD-05': ['Ordino'],
        'AD-06': ['Sant Julià de Lòria', 'Sant Julia de Loria']
      },
      LI: {
        'LI-01': ['Balzers'],
        'LI-02': ['Eschen'],
        'LI-03': ['Gamprin'],
        'LI-04': ['Mauren'],
        'LI-05': ['Planken'],
        'LI-06': ['Ruggell'],
        'LI-07': ['Schaan'],
        'LI-08': ['Schellenberg'],
        'LI-09': ['Triesen'],
        'LI-10': ['Triesenberg'],
        'LI-11': ['Vaduz']
      },
      MC: {
        'MC-MON': ['Monaco-Ville', 'Monaco Ville'],
        'MC-MCO': ['Monte-Carlo', 'Monte Carlo'],
        'MC-CON': ['La Condamine'],
        'MC-FON': ['Fontvieille']
      },
      SM: {
        'SM-01': ['Acquaviva'],
        'SM-02': ['Chiesanuova'],
        'SM-03': ['Domagnano'],
        'SM-04': ['Faetano'],
        'SM-05': ['Fiorentino'],
        'SM-06': ['Borgo Maggiore'],
        'SM-07': ['Saint-Marin', 'San Marino'],
        'SM-08': ['Montegiardino'],
        'SM-09': ['Serravalle']
      },
      MT: {
        'MT-MAJ': ['Majjistral'],
        'MT-XLO': ['Xlokk'],
        'MT-GZO': ['Gozo and Comino'],
        'MT-POR': ['Port Region'],
        'MT-SUD': ['Southern Region']
      },
      LU: {
        'LU-CA': ['Capellen'],
        'LU-CL': ['Clervaux'],
        'LU-DI': ['Diekirch'],
        'LU-EC': ['Echternach'],
        'LU-ES': ['Esch-sur-Alzette', 'Esch sur Alzette'],
        'LU-GR': ['Grevenmacher'],
        'LU-LU': ['Luxembourg'],
        'LU-ME': ['Mersch'],
        'LU-RD': ['Redange'],
        'LU-RM': ['Remich'],
        'LU-VD': ['Vianden'],
        'LU-WI': ['Wiltz']
      },
      CY: {
        'CY-01': ['Nicosie', 'Nicosia'],
        'CY-02': ['Limassol'],
        'CY-03': ['Larnaca'],
        'CY-04': ['Famagouste', 'Famagusta'],
        'CY-05': ['Paphos'],
        'CY-06': ['Kyrenia', 'Keryneia']
      },
      IS: {
        'IS-1': ['Région de la capitale', 'Capital Region'],
        'IS-2': ['Péninsule du Sud', 'Southern Peninsula'],
        'IS-3': ['Ouest', 'West'],
        'IS-4': ['Westfjords'],
        'IS-5': ['Nord-Ouest', 'Northwest'],
        'IS-6': ['Nord-Est', 'Northeast'],
        'IS-7': ['Est', 'East'],
        'IS-8': ['Sud', 'South']
      },
      AL: {
        'AL-01': ['Berat'],
        'AL-02': ['Durrës', 'Durres'],
        'AL-03': ['Elbasan'],
        'AL-04': ['Fier'],
        'AL-05': ['Gjirokastër', 'Gjirokaster'],
        'AL-06': ['Korçë', 'Korce'],
        'AL-07': ['Kukës', 'Kukes'],
        'AL-08': ['Lezhë', 'Lezhe'],
        'AL-09': ['Dibër', 'Diber'],
        'AL-10': ['Shkodër', 'Shkoder'],
        'AL-11': ['Tirana'],
        'AL-12': ['Vlorë', 'Vlore']
      },
      MK: {
        'MK-VAR': ['Vardar'],
        'MK-EAS': ['Est', 'East'],
        'MK-SWE': ['Sud-Ouest', 'Southwest'],
        'MK-SEE': ['Sud-Est', 'Southeast'],
        'MK-PEL': ['Pélagonie', 'Pelagonia'],
        'MK-POL': ['Polog'],
        'MK-NOR': ['Nord-Est', 'Northeast'],
        'MK-SKO': ['Skopje']
      },
      BA: {
        'BA-BIH': ['Fédération de Bosnie-et-Herzégovine', 'Federation of Bosnia and Herzegovina'],
        'BA-SRP': ['Republika Srpska'],
        'BA-BRC': ['District de Brčko', 'Brčko District', 'Brcko District']
      },
      ME: {
        'ME-PG': ['Podgorica'],
        'ME-NK': ['Nikšić', 'Niksic'],
        'ME-BD': ['Budva'],
        'ME-BR': ['Bar'],
        'ME-HN': ['Herceg Novi'],
        'ME-CT': ['Cetinje'],
        'ME-KO': ['Kotor'],
        'ME-UL': ['Ulcinj'],
        'ME-BJ': ['Bijelo Polje'],
        'ME-PL': ['Pljevlja']
      },
      XK: {
        'XK-PR': ['Pristina', 'Prishtinë', 'Prishtine'],
        'XK-PZ': ['Prizren'],
        'XK-GJ': ['Gjakova', 'Đakovica', 'Djakovica'],
        'XK-PE': ['Peja', 'Peć', 'Pec'],
        'XK-FE': ['Ferizaj', 'Uroševac', 'Urosevac'],
        'XK-GN': ['Gjilan', 'Gnjilane'],
        'XK-MI': ['Mitrovica']
      },
      VA: {
        'VA-ALL': ['Cité du Vatican', 'Vatican City', 'Vatican']
      },
      MD: {
        'MD-CU': ['Chișinău', 'Chișinau', 'Chisinau'],
        'MD-BA': ['Bălți', 'Balti'],
        'MD-CA': ['Cahul'],
        'MD-OR': ['Orhei'],
        'MD-SO': ['Soroca'],
        'MD-UN': ['Ungheni'],
        'MD-ED': ['Edineț', 'Edinet'],
        'MD-AN': ['Anenii Noi']
      },
      BY: {
        'BY-BR': ['Brest'],
        'BY-HO': ['Gomel', 'Homyel'],
        'BY-HR': ['Grodno', 'Hrodna'],
        'BY-MA': ['Moguilev', 'Mogilev'],
        'BY-MI': ['Minsk Region', 'Minsk'],
        'BY-VI': ['Vitebsk', 'Viciebsk'],
        'BY-MN': ['Ville de Minsk', 'Minsk City']
      },
      GE: {
        'GE-AB': ['Abkhazie', 'Abkhazia'],
        'GE-AJ': ['Adjarie', 'Adjara'],
        'GE-GU': ['Gourie', 'Guria'],
        'GE-IM': ['Iméréthie', 'Imereti'],
        'GE-KA': ['Kakhétie', 'Kakheti'],
        'GE-KK': ['Kvemo Kartlie', 'Kvemo Kartli'],
        'GE-MM': ['Mtskheta-Mtianétie', 'Mtskheta-Mtianeti'],
        'GE-RL': ['Ratcha-Letchkhoumie et Kvemo Svanétie', 'Racha-Lechkhumi and Kvemo Svaneti'],
        'GE-SJ': ['Samtskhé-Djavakhétie', 'Samtskhe-Javakheti'],
        'GE-SK': ['Chida Kartlie', 'Shida Kartli'],
        'GE-SZ': ['Samegrelo-Zemo Svanétie', 'Samegrelo-Zemo Svaneti'],
        'GE-TB': ['Tbilissi', 'Tbilisi']
      },
      AM: {
        'AM-AG': ['Aragatsotn'],
        'AM-AR': ['Ararat'],
        'AM-AV': ['Armavir'],
        'AM-ER': ['Erevan', 'Yerevan'],
        'AM-GR': ['Gegharkounik', 'Gegharkunik'],
        'AM-KT': ['Kotayk'],
        'AM-LO': ['Lorri', 'Lori'],
        'AM-SH': ['Shirak'],
        'AM-SU': ['Siounik', 'Syunik'],
        'AM-TV': ['Tavush'],
        'AM-VD': ['Vayots Dzor']
      },
      AZ: {
        'AZ-BA': ['Bakou', 'Baku'],
        'AZ-GA': ['Ganja'],
        'AZ-LA': ['Lankaran'],
        'AZ-QA': ['Qabala', 'Gabala'],
        'AZ-QB': ['Quba'],
        'AZ-SA': ['Shaki', 'Şəki', 'Seki'],
        'AZ-SM': ['Sumqayıt', 'Sumqayit'],
        'AZ-NX': ['Nakhitchevan', 'Nakhchivan']
      },
      KZ: {
        'KZ-ALA': ['Almaty (ville)', 'Almaty City'],
        'KZ-AST': ['Astana (ville)', 'Astana City'],
        'KZ-SHY': ['Shymkent (ville)', 'Shymkent City'],
        'KZ-AKM': ['Aqmola', 'Akmola'],
        'KZ-AKT': ['Aqtöbe', 'Aktobe'],
        'KZ-ATY': ['Atyraou', 'Atyrau'],
        'KZ-KAR': ['Karaganda'],
        'KZ-KUS': ['Kostanaï', 'Kostanay'],
        'KZ-KZY': ['Kyzylorda'],
        'KZ-MAN': ['Mangistaou', 'Mangystau'],
        'KZ-PAV': ['Pavlodar'],
        'KZ-SEV': ['Kazakhstan-Nord', 'North Kazakhstan'],
        'KZ-TUR': ['Turkistan'],
        'KZ-UYL': ['Oulytaou', 'Ulytau'],
        'KZ-VOS': ['Kazakhstan-Est', 'East Kazakhstan'],
        'KZ-YUZ': ['Jetisu', 'Zhetysu'],
        'KZ-ZAP': ['Kazakhstan-Ouest', 'West Kazakhstan'],
        'KZ-ZHA': ['Jambyl', 'Zhambyl']
      },
      KG: {
        'KG-B': ['Batken'],
        'KG-GB': ['Bichkek', 'Bishkek'],
        'KG-C': ['Tchouï', 'Chuy'],
        'KG-J': ['Djalal-Abad', 'Jalal-Abad'],
        'KG-N': ['Naryn'],
        'KG-O': ['Och', 'Osh'],
        'KG-T': ['Talas'],
        'KG-Y': ['Yssyk-Köl', 'Issyk-Kul'],
        'KG-GO': ['Och (ville)', 'Osh City']
      },
      UZ: {
        'UZ-TK': ['Tachkent (ville)', 'Tashkent City'],
        'UZ-AN': ['Andijan'],
        'UZ-BU': ['Boukhara', 'Bukhara'],
        'UZ-FA': ['Fergana'],
        'UZ-JI': ['Djizak', 'Jizzakh'],
        'UZ-NG': ['Namangan'],
        'UZ-NW': ['Navoï', 'Navoiy'],
        'UZ-QA': ['Kachkadaria', 'Qashqadaryo'],
        'UZ-SA': ['Samarcande', 'Samarkand'],
        'UZ-SI': ['Sirdaria', 'Syrdarya'],
        'UZ-SU': ['Surkhandaria', 'Surxondaryo'],
        'UZ-TO': ['Tachkent (région)', 'Tashkent Region'],
        'UZ-XO': ['Khorezm', 'Xorazm'],
        'UZ-KR': ['Karakalpakstan']
      },
      TJ: {
        'TJ-DU': ['Douchanbé', 'Dushanbe'],
        'TJ-GB': ['Gorno-Badakhchan', 'Gorno-Badakhshan'],
        'TJ-KT': ['Khatlon'],
        'TJ-SU': ['Sughd', 'Sogd'],
        'TJ-RA': ['Districts de subordination républicaine', 'Districts of Republican Subordination']
      },
      TM: {
        'TM-A': ['Ahal'],
        'TM-B': ['Balkan'],
        'TM-D': ['Daşoguz', 'Dashoguz'],
        'TM-L': ['Lebap'],
        'TM-M': ['Mary'],
        'TM-S': ['Achgabat (ville)', 'Ashgabat City', 'Ashgabat']
      },
      AF: {
        'AF-KAB': ['Kaboul', 'Kabul'],
        'AF-HER': ['Hérat', 'Herat'],
        'AF-BAL': ['Balkh'],
        'AF-KAN': ['Kandahar'],
        'AF-NAN': ['Nangarhar'],
        'AF-KUN': ['Kunduz'],
        'AF-BAM': ['Bamiyan', 'Bamyan'],
        'AF-HEL': ['Helmand', 'Hilmand']
      },
      PK: {
        'PK-PB': ['Pendjab', 'Punjab'],
        'PK-SD': ['Sind', 'Sindh'],
        'PK-KP': ['Khyber Pakhtunkhwa'],
        'PK-BA': ['Baloutchistan', 'Balochistan'],
        'PK-IS': ['Territoire d\'Islamabad', 'Islamabad Capital Territory'],
        'PK-JK': ['Azad Cachemire', 'Azad Kashmir'],
        'PK-GB': ['Gilgit-Baltistan']
      },
      NP: {
        'NP-P1': ['Koshi'],
        'NP-P2': ['Madhesh'],
        'NP-P3': ['Bagmati'],
        'NP-P4': ['Gandaki'],
        'NP-P5': ['Lumbini'],
        'NP-P6': ['Karnali'],
        'NP-P7': ['Sudurpashchim']
      },
      BT: {
        'BT-33': ['Bumthang'],
        'BT-12': ['Chukha'],
        'BT-22': ['Dagana'],
        'BT-GA': ['Gasa'],
        'BT-13': ['Haa'],
        'BT-44': ['Lhuentse'],
        'BT-42': ['Mongar'],
        'BT-11': ['Paro'],
        'BT-23': ['Punakha'],
        'BT-45': ['Samdrup Jongkhar'],
        'BT-14': ['Samtse'],
        'BT-31': ['Sarpang'],
        'BT-15': ['Thimphou', 'Thimphu'],
        'BT-41': ['Trashigang'],
        'BT-TY': ['Trashi Yangtse'],
        'BT-32': ['Trongsa'],
        'BT-43': ['Tsirang'],
        'BT-21': ['Wangdue Phodrang'],
        'BT-24': ['Zhemgang']
      },
      BD: {
        'BD-A': ['Barisal', 'Barishal'],
        'BD-B': ['Chittagong', 'Chattogram'],
        'BD-C': ['Dhaka', 'Dacca'],
        'BD-D': ['Khulna'],
        'BD-E': ['Rajshahi'],
        'BD-F': ['Rangpur'],
        'BD-G': ['Sylhet'],
        'BD-H': ['Mymensingh']
      },
      LK: {
        'LK-1': ['Province de l\'Ouest', 'Western Province'],
        'LK-2': ['Province du Centre', 'Central Province'],
        'LK-3': ['Province du Sud', 'Southern Province'],
        'LK-4': ['Province du Nord', 'Northern Province'],
        'LK-5': ['Province de l\'Est', 'Eastern Province'],
        'LK-6': ['Province du Nord-Ouest', 'North Western Province'],
        'LK-7': ['Province du Centre-Nord', 'North Central Province'],
        'LK-8': ['Province d\'Uva', 'Uva Province'],
        'LK-9': ['Province de Sabaragamuwa', 'Sabaragamuwa Province']
      },
      MM: {
        'MM-07': ['Ayeyarwady', 'Irrawaddy'],
        'MM-02': ['Bago', 'Pegu'],
        'MM-14': ['Chin'],
        'MM-11': ['Kachin'],
        'MM-12': ['Kayah'],
        'MM-13': ['Kayin', 'Karen'],
        'MM-03': ['Magway'],
        'MM-04': ['Mandalay'],
        'MM-15': ['Mon'],
        'MM-18': ['Naypyidaw', 'Nay Pyi Taw'],
        'MM-16': ['Rakhine', 'Arakan'],
        'MM-01': ['Sagaing'],
        'MM-17': ['Shan'],
        'MM-05': ['Tanintharyi', 'Tenasserim'],
        'MM-06': ['Yangon', 'Rangoon']
      },
      LA: {
        'LA-AT': ['Attapeu', 'Attapu'],
        'LA-BK': ['Bokèo', 'Bokeo'],
        'LA-BL': ['Bolikhamxay', 'Bolikhamsai'],
        'LA-CH': ['Champassak'],
        'LA-HO': ['Houaphan', 'Houaphanh'],
        'LA-KH': ['Khammouane', 'Khammuan'],
        'LA-LM': ['Luang Namtha'],
        'LA-LP': ['Luang Prabang'],
        'LA-OU': ['Oudomxay', 'Oudomxai'],
        'LA-PH': ['Phongsaly', 'Phongsali'],
        'LA-SL': ['Salavan', 'Saravan'],
        'LA-SV': ['Savannakhet'],
        'LA-VI': ['Vientiane (préfecture)', 'Vientiane Prefecture'],
        'LA-VT': ['Vientiane (province)', 'Vientiane Province'],
        'LA-XA': ['Sainyabuli', 'Xaignabouli'],
        'LA-XE': ['Sekong'],
        'LA-XI': ['Xiangkhouang', 'Xiengkhouang'],
        'LA-XS': ['Xaisomboun']
      },
      TH: {
        'TH-10': ['Bangkok', 'Krung Thep'],
        'TH-50': ['Chiang Mai'],
        'TH-57': ['Chiang Rai'],
        'TH-40': ['Khon Kaen'],
        'TH-20': ['Chonburi', 'Chon Buri'],
        'TH-83': ['Phuket'],
        'TH-84': ['Surat Thani'],
        'TH-90': ['Songkhla'],
        'TH-13': ['Pathum Thani'],
        'TH-21': ['Rayong']
      },
      KH: {
        'KH-12': ['Phnom Penh'],
        'KH-18': ['Sihanoukville', 'Preah Sihanouk'],
        'KH-17': ['Siem Reap'],
        'KH-2': ['Battambang'],
        'KH-3': ['Kampong Cham'],
        'KH-7': ['Kampot'],
        'KH-8': ['Kandal'],
        'KH-9': ['Koh Kong'],
        'KH-10': ['Kratié', 'Kratie'],
        'KH-16': ['Preah Sihanouk', 'Sihanoukville']
      },
      VN: {
        'VN-HN': ['Hanoï', 'Hanoi'],
        'VN-SG': ['Hô Chi Minh-Ville', 'Ho Chi Minh City', 'Saigon'],
        'VN-DN': ['Đà Nẵng', 'Da Nang'],
        'VN-HP': ['Haiphong', 'Hai Phong'],
        'VN-CT': ['Cần Thơ', 'Can Tho'],
        'VN-AG': ['An Giang'],
        'VN-BD': ['Bình Dương', 'Binh Duong'],
        'VN-DT': ['Đồng Tháp', 'Dong Thap'],
        'VN-KH': ['Khánh Hòa', 'Khanh Hoa'],
        'VN-LA': ['Long An']
      },
      BN: {
        'BN-BM': ['Brunei-Muara'],
        'BN-TU': ['Tutong'],
        'BN-BE': ['Belait'],
        'BN-TE': ['Temburong']
      },
      MY: {
        'MY-01': ['Johor'],
        'MY-02': ['Kedah'],
        'MY-03': ['Kelantan'],
        'MY-04': ['Melaka', 'Malacca'],
        'MY-05': ['Negeri Sembilan'],
        'MY-06': ['Pahang'],
        'MY-07': ['Pulau Pinang', 'Penang'],
        'MY-08': ['Perak'],
        'MY-09': ['Perlis'],
        'MY-10': ['Selangor'],
        'MY-11': ['Terengganu'],
        'MY-12': ['Sabah'],
        'MY-13': ['Sarawak'],
        'MY-14': ['Kuala Lumpur'],
        'MY-15': ['Labuan'],
        'MY-16': ['Putrajaya']
      },
      TL: {
        'TL-AL': ['Aileu'],
        'TL-AN': ['Ainaro'],
        'TL-BA': ['Baucau'],
        'TL-BO': ['Bobonaro'],
        'TL-CO': ['Cova Lima'],
        'TL-DI': ['Dili'],
        'TL-ER': ['Ermera'],
        'TL-LA': ['Lautém', 'Lautem'],
        'TL-LI': ['Liquiçá', 'Liquica'],
        'TL-MF': ['Manufahi'],
        'TL-MT': ['Manatuto'],
        'TL-OE': ['Oecusse'],
        'TL-VI': ['Viqueque']
      },
      SG: {
        'SG-ALL': ['Singapour', 'Singapore']
      },
      MV: {
        'MV-MLE': ['Malé', 'Male'],
        'MV-HA': ['Haa Alif'],
        'MV-HD': ['Haa Dhaalu'],
        'MV-SH': ['Shaviyani'],
        'MV-NO': ['Noonu'],
        'MV-BA': ['Baa'],
        'MV-KA': ['Kaafu'],
        'MV-AA': ['Alif Alif'],
        'MV-AD': ['Alif Dhaalu'],
        'MV-GD': ['Gaafu Dhaalu'],
        'MV-SU': ['Seenu', 'Addu']
      },
      FJ: {
        'FJ-C': ['Central'],
        'FJ-E': ['Eastern'],
        'FJ-N': ['Northern'],
        'FJ-W': ['Western'],
        'FJ-R': ['Rotuma']
      },
      WS: {
        'WS-AA': ['A\'ana', 'Aana'],
        'WS-AL': ['Aiga-i-le-Tai'],
        'WS-AT': ['Atua'],
        'WS-FA': ['Fa\'asaleleaga', 'Faasaleleaga'],
        'WS-GE': ['Gaga\'emauga', 'Gagaemauga'],
        'WS-GI': ['Gagaifomauga'],
        'WS-PA': ['Palauli'],
        'WS-SA': ['Satupa\'itea', 'Satupaitea'],
        'WS-TU': ['Tuamasaga'],
        'WS-VF': ['Va\'a-o-Fonoti', 'Vaa-o-Fonoti'],
        'WS-VS': ['Vaisigano']
      },
      PG: {
        'PG-NCD': ['District de la capitale nationale', 'National Capital District'],
        'PG-CPM': ['Central'],
        'PG-EBR': ['East New Britain'],
        'PG-ESW': ['East Sepik'],
        'PG-EPW': ['Enga'],
        'PG-MPM': ['Madang'],
        'PG-MRL': ['Manus'],
        'PG-MBA': ['Milne Bay'],
        'PG-MPL': ['Morobe'],
        'PG-WHM': ['Western Highlands']
      },
      SB: {
        'SB-CT': ['Honiara'],
        'SB-CH': ['Choiseul'],
        'SB-GU': ['Guadalcanal'],
        'SB-IS': ['Isabel'],
        'SB-MK': ['Makira-Ulawa'],
        'SB-ML': ['Malaita'],
        'SB-RB': ['Rennell et Bellona', 'Rennell and Bellona'],
        'SB-TE': ['Temotu'],
        'SB-WE': ['Western']
      },
      TO: {
        'TO-01': ['Tongatapu'],
        'TO-02': ['Ha\'apai', 'Haapai'],
        'TO-03': ['Vava\'u', 'Vavau'],
        'TO-04': ['Eua', '\'Eua'],
        'TO-05': ['Niuas']
      },
      KI: {
        'KI-GI': ['Îles Gilbert', 'Gilbert Islands'],
        'KI-LI': ['Îles de la Ligne', 'Line Islands'],
        'KI-PH': ['Îles Phœnix', 'Phoenix Islands']
      },
      TV: {
        'TV-FUN': ['Funafuti'],
        'TV-NIT': ['Niutao'],
        'TV-NIU': ['Nui'],
        'TV-NKF': ['Nukufetau'],
        'TV-NKL': ['Nukulaelae'],
        'TV-NMA': ['Nanumea'],
        'TV-NMG': ['Nanumanga'],
        'TV-VAI': ['Vaitupu']
      },
      NR: {
        'NR-AI': ['Aiwo'],
        'NR-AN': ['Anabar'],
        'NR-AT': ['Anetan'],
        'NR-AR': ['Anibare'],
        'NR-BA': ['Baiti'],
        'NR-BO': ['Boe'],
        'NR-BU': ['Buada'],
        'NR-DE': ['Denigomodu'],
        'NR-EW': ['Ewa'],
        'NR-IJ': ['Ijuw'],
        'NR-ME': ['Meneng'],
        'NR-NI': ['Nibok'],
        'NR-UA': ['Uaboe'],
        'NR-YA': ['Yaren']
      },
      VU: {
        'VU-MAP': ['Malampa'],
        'VU-PAM': ['Pénama', 'Penama'],
        'VU-SAM': ['Sanma'],
        'VU-SEE': ['Shéfa', 'Shefa'],
        'VU-TAE': ['Taféa', 'Tafea'],
        'VU-TOB': ['Torba']
      },
      FM: {
        'FM-TRK': ['Chuuk', 'Truk'],
        'FM-KSA': ['Kosrae'],
        'FM-PNI': ['Pohnpei', 'Ponape'],
        'FM-YAP': ['Yap']
      },
      MH: {
        'MH-ALK': ['Chaîne de Ralik', 'Ralik Chain'],
        'MH-ARR': ['Chaîne de Ratak', 'Ratak Chain'],
        'MH-MAJ': ['Majuro'],
        'MH-KWA': ['Kwajalein']
      },
      PW: {
        'PW-002': ['Aimeliik'],
        'PW-004': ['Airai'],
        'PW-150': ['Koror'],
        'PW-212': ['Melekeok'],
        'PW-214': ['Ngaraard'],
        'PW-218': ['Ngarchelong'],
        'PW-222': ['Ngardmau'],
        'PW-224': ['Ngatpang'],
        'PW-226': ['Ngchesar'],
        'PW-228': ['Ngeremlengui'],
        'PW-350': ['Peleliu'],
        'PW-370': ['Sonsorol']
      },
      CK: {
        'CK-RAR': ['Rarotonga'],
        'CK-AIT': ['Aitutaki'],
        'CK-ATI': ['Atiu'],
        'CK-MAU': ['Mauke'],
        'CK-MIT': ['Mitiaro'],
        'CK-MAN': ['Manihiki'],
        'CK-PEN': ['Penrhyn'],
        'CK-PUK': ['Pukapuka']
      },
      NU: {
        'NU-AL': ['Alofi'],
        'NU-AK': ['Alofi Nord', 'Alofi North'],
        'NU-VA': ['Avatele'],
        'NU-HK': ['Hakupu'],
        'NU-HI': ['Hikutavake'],
        'NU-LA': ['Lakepa'],
        'NU-LI': ['Liku'],
        'NU-MA': ['Makefu'],
        'NU-MU': ['Mutalau'],
        'NU-TA': ['Tamakautoga'],
        'NU-TO': ['Toi'],
        'NU-TU': ['Tuapa']
      },
      GU: {
        'GU-AGA': ['Hagåtña', 'Hagatna', 'Agana'],
        'GU-DED': ['Dededo'],
        'GU-TAM': ['Tamuning'],
        'GU-MAN': ['Mangilao'],
        'GU-BAR': ['Barrigada'],
        'GU-YIG': ['Yigo'],
        'GU-INA': ['Inarajan', 'Inarahan'],
        'GU-MER': ['Merizo', 'Malesso\'']
      },
      AS: {
        'AS-E': ['Eastern'],
        'AS-W': ['Western'],
        'AS-M': ['Manu\'a', 'Manua'],
        'AS-R': ['Rose Atoll'],
        'AS-SW': ['Swains Island']
      },
      MP: {
        'MP-R': ['Rota'],
        'MP-S': ['Saipan'],
        'MP-T': ['Tinian']
      },
      NC: {
        'NC-NO': ['Province Nord', 'North Province'],
        'NC-SU': ['Province Sud', 'South Province'],
        'NC-IL': ['Province des Îles Loyauté', 'Loyalty Islands Province']
      },
      PF: {
        'PF-ISV': ['Îles du Vent', 'Windward Islands'],
        'PF-ISS': ['Îles Sous-le-Vent', 'Leeward Islands'],
        'PF-TUA': ['Tuamotu-Gambier'],
        'PF-MAR': ['Îles Marquises', 'Marquesas Islands'],
        'PF-AUS': ['Australes', 'Austral Islands']
      },
      WF: {
        'WF-UVE': ['Uvea', 'Wallis'],
        'WF-ALO': ['Alo'],
        'WF-SIG': ['Sigave']
      },
      PN: {
        'PN-PIT': ['Pitcairn'],
        'PN-HEN': ['Henderson'],
        'PN-DUC': ['Ducie'],
        'PN-OEN': ['Oeno']
      },
      TK: {
        'TK-ATA': ['Atafu'],
        'TK-FAK': ['Fakaofo'],
        'TK-NUK': ['Nukunonu']
      },
      RE: {
        'RE-SD': ['Saint-Denis', 'St Denis'],
        'RE-SP': ['Saint-Paul', 'St Paul'],
        'RE-SB': ['Saint-Benoît', 'Saint-Benoit', 'St Benoit'],
        'RE-SPI': ['Saint-Pierre', 'St Pierre']
      },
      YT: {
        'YT-BR': ['Bandraboua'],
        'YT-BA': ['Bandrélé', 'Bandrele'],
        'YT-CHI': ['Chiconi'],
        'YT-DZA': ['Dzaoudzi'],
        'YT-KAN': ['Kani-Kéli', 'Kani-Keli'],
        'YT-KOU': ['Koungou'],
        'YT-MAM': ['Mamoudzou'],
        'YT-MTS': ['Mtsamboro'],
        'YT-PAM': ['Pamandzi'],
        'YT-SAD': ['Sada']
      },
      GP: {
        'GP-BT': ['Basse-Terre'],
        'GP-PP': ['Pointe-à-Pitre', 'Pointe-a-Pitre'],
        'GP-MG': ['Marie-Galante', 'Marie Galante'],
        'GP-SM': ['Les Saintes'],
        'GP-DS': ['La Désirade', 'La Desirade']
      },
      MQ: {
        'MQ-FF': ['Fort-de-France', 'Fort de France'],
        'MQ-LT': ['La Trinité', 'La Trinite'],
        'MQ-LM': ['Le Marin'],
        'MQ-SP': ['Saint-Pierre', 'St Pierre']
      },
      GF: {
        'GF-CAY': ['Cayenne'],
        'GF-SLM': ['Saint-Laurent-du-Maroni', 'St Laurent du Maroni'],
        'GF-SRG': ['Saint-Georges', 'St Georges']
      },
      PM: {
        'PM-SP': ['Saint-Pierre', 'St Pierre'],
        'PM-ML': ['Miquelon-Langlade']
      },
      BL: {
        'BL-ALL': ['Saint-Barthélemy', 'Saint-Barthelemy', 'St Barthelemy']
      },
      MF: {
        'MF-ALL': ['Saint-Martin', 'St Martin']
      },
      SC: {
        'SC-MA': ['Mahé', 'Mahe'],
        'SC-PR': ['Praslin'],
        'SC-LD': ['La Digue'],
        'SC-IN': ['Îles Extérieures', 'Outer Islands']
      },
      MU: {
        'MU-BL': ['Black River'],
        'MU-FL': ['Flacq'],
        'MU-GP': ['Grand Port'],
        'MU-MO': ['Moka'],
        'MU-PA': ['Pamplemousses'],
        'MU-PL': ['Plaines Wilhems'],
        'MU-PW': ['Port Louis'],
        'MU-RR': ['Rivière du Rempart', 'Riviere du Rempart'],
        'MU-SA': ['Savanne'],
        'MU-RO': ['Rodrigues']
      },
      KM: {
        'KM-A': ['Anjouan'],
        'KM-G': ['Grande Comore', 'Ngazidja'],
        'KM-M': ['Mohéli', 'Moheli']
      },
      DJ: {
        'DJ-DJ': ['Djibouti'],
        'DJ-AR': ['Arta'],
        'DJ-AL': ['Ali Sabieh'],
        'DJ-DI': ['Dikhil'],
        'DJ-OB': ['Obock'],
        'DJ-TA': ['Tadjourah']
      },
      ER: {
        'ER-AN': ['Anseba'],
        'ER-DK': ['Debubawi Keyih Bahri', 'Southern Red Sea'],
        'ER-DU': ['Debub', 'Southern'],
        'ER-GB': ['Gash-Barka'],
        'ER-MA': ['Maekel', 'Central'],
        'ER-SK': ['Semenawi Keyih Bahri', 'Northern Red Sea']
      },
      SO: {
        'SO-BN': ['Banaadir', 'Banadir'],
        'SO-WO': ['Woqooyi Galbeed'],
        'SO-TO': ['Togdheer'],
        'SO-BY': ['Bay'],
        'SO-GE': ['Gedo'],
        'SO-JH': ['Jubbada Hoose', 'Lower Juba'],
        'SO-MU': ['Mudug'],
        'SO-NU': ['Nugaal', 'Nugal']
      },
      YE: {
        'YE-SN': ['Sanaa', 'Sana\'a'],
        'YE-AD': ['Aden'],
        'YE-TA': ['Taiz', 'Ta\'izz'],
        'YE-HD': ['Hadramaout', 'Hadramaut'],
        'YE-HJ': ['Hajjah'],
        'YE-HU': ['Al Hudaydah', 'Al Hodeidah'],
        'YE-IB': ['Ibb'],
        'YE-MA': ['Marib', 'Ma\'rib']
      },
      SD: {
        'SD-KH': ['Khartoum'],
        'SD-GZ': ['Al Jazirah', 'Gezira'],
        'SD-RS': ['Mer Rouge', 'Red Sea'],
        'SD-NR': ['Rivière du Nil', 'River Nile'],
        'SD-NO': ['Nord', 'Northern'],
        'SD-DN': ['Darfour-Nord', 'North Darfur'],
        'SD-DW': ['Darfour-Ouest', 'West Darfur'],
        'SD-KN': ['Kordofan-Nord', 'North Kordofan']
      },
      SS: {
        'SS-EC': ['Équatoria-Central', 'Central Equatoria'],
        'SS-EE': ['Équatoria-Oriental', 'Eastern Equatoria'],
        'SS-WE': ['Équatoria-Occidental', 'Western Equatoria'],
        'SS-BN': ['Nord Bahr el-Ghazal', 'Northern Bahr el Ghazal'],
        'SS-BW': ['Ouest Bahr el-Ghazal', 'Western Bahr el Ghazal'],
        'SS-JG': ['Jonglei'],
        'SS-LK': ['Lacs', 'Lakes'],
        'SS-NU': ['Haut-Nil', 'Upper Nile'],
        'SS-UY': ['Unité', 'Unity'],
        'SS-WR': ['Warrap']
      },
      EH: {
        'EH-ALL': ['Sahara occidental', 'Western Sahara']
      },
      GQ: {
        'GQ-AN': ['Annobón', 'Annobon'],
        'GQ-BN': ['Bioko Nord', 'Bioko Norte'],
        'GQ-BS': ['Bioko Sud', 'Bioko Sur'],
        'GQ-CS': ['Centro Sur'],
        'GQ-KN': ['Kié-Ntem', 'Kie-Ntem'],
        'GQ-LI': ['Litoral'],
        'GQ-WN': ['Wele-Nzás', 'Wele-Nzas']
      },
      ST: {
        'ST-01': ['Água Grande', 'Agua Grande'],
        'ST-02': ['Cantagalo'],
        'ST-03': ['Caué', 'Caue'],
        'ST-04': ['Lembá', 'Lemba'],
        'ST-05': ['Lobata'],
        'ST-06': ['Mé-Zóchi', 'Me-Zochi'],
        'ST-P': ['Pagué', 'Pague']
      },
      CV: {
        'CV-SV': ['São Vicente', 'Sao Vicente'],
        'CV-SA': ['Santo Antão', 'Santo Antao'],
        'CV-SN': ['Santiago Nord', 'Santiago Norte'],
        'CV-SO': ['Santiago Sud', 'Santiago Sul'],
        'CV-FO': ['Fogo'],
        'CV-SL': ['Sal'],
        'CV-BO': ['Boa Vista']
      },
      GW: {
        'GW-BS': ['Bissau'],
        'GW-BA': ['Bafatá', 'Bafata'],
        'GW-BL': ['Bolama'],
        'GW-CA': ['Cacheu'],
        'GW-GA': ['Gabú', 'Gabu'],
        'GW-OI': ['Oio'],
        'GW-QU': ['Quinara'],
        'GW-TO': ['Tombali']
      },
      SL: {
        'SL-E': ['Est', 'Eastern'],
        'SL-N': ['Nord', 'Northern'],
        'SL-NW': ['Nord-Ouest', 'North Western'],
        'SL-S': ['Sud', 'Southern'],
        'SL-W': ['Ouest', 'Western']
      },
      LR: {
        'LR-BM': ['Bomi'],
        'LR-BG': ['Bong'],
        'LR-GP': ['Gbarpolu'],
        'LR-GB': ['Grand Bassa'],
        'LR-GK': ['Grand Kru'],
        'LR-LO': ['Lofa'],
        'LR-MG': ['Margibi'],
        'LR-MY': ['Maryland'],
        'LR-MO': ['Montserrado'],
        'LR-NI': ['Nimba']
      },
      GM: {
        'GM-B': ['Banjul'],
        'GM-KM': ['Kanifing'],
        'GM-MC': ['Central River'],
        'GM-L': ['Lower River'],
        'GM-N': ['North Bank'],
        'GM-U': ['Upper River'],
        'GM-W': ['West Coast']
      },
      MR: {
        'MR-NKC': ['Nouakchott'],
        'MR-AD': ['Adrar'],
        'MR-AS': ['Assaba'],
        'MR-BR': ['Brakna'],
        'MR-DN': ['Dakhlet Nouadhibou'],
        'MR-GO': ['Gorgol'],
        'MR-GD': ['Guidimaka'],
        'MR-HO': ['Hodh Ech Chargui'],
        'MR-HG': ['Hodh El Gharbi'],
        'MR-IN': ['Inchiri']
      },
      ML: {
        'ML-BKO': ['District de Bamako', 'Bamako District'],
        'ML-KY': ['Kayes'],
        'ML-KL': ['Koulikoro'],
        'ML-SI': ['Sikasso'],
        'ML-SG': ['Ségou', 'Segou'],
        'ML-MP': ['Mopti'],
        'ML-TB': ['Tombouctou', 'Timbuktu'],
        'ML-GA': ['Gao'],
        'ML-KD': ['Kidal']
      },
      NE: {
        'NE-1': ['Agadez'],
        'NE-2': ['Diffa'],
        'NE-3': ['Dosso'],
        'NE-4': ['Maradi'],
        'NE-5': ['Tahoua'],
        'NE-6': ['Tillabéri', 'Tillaberi'],
        'NE-7': ['Zinder'],
        'NE-8': ['Niamey']
      },
      SN: {
        'SN-DK': ['Dakar'],
        'SN-DB': ['Diourbel'],
        'SN-FK': ['Fatick'],
        'SN-KA': ['Kaffrine'],
        'SN-KL': ['Kaolack'],
        'SN-KD': ['Kolda'],
        'SN-LG': ['Louga'],
        'SN-MT': ['Matam'],
        'SN-SL': ['Saint-Louis', 'St Louis'],
        'SN-TC': ['Tambacounda'],
        'SN-TH': ['Thiès', 'Thies'],
        'SN-ZG': ['Ziguinchor']
      },
      TD: {
        'TD-ND': ['N\'Djamena', 'Ndjamena'],
        'TD-BA': ['Batha'],
        'TD-BG': ['Bahr el Gazel'],
        'TD-BO': ['Borkou'],
        'TD-CH': ['Chari-Baguirmi'],
        'TD-EN': ['Ennedi-Est', 'Ennedi East'],
        'TD-LC': ['Lac'],
        'TD-LO': ['Logone-Occidental', 'Logone Occidental'],
        'TD-MA': ['Mandoul'],
        'TD-MO': ['Mayo-Kebbi-Ouest', 'Mayo-Kebbi Ouest']
      },
      TG: {
        'TG-C': ['Centrale'],
        'TG-K': ['Kara'],
        'TG-M': ['Maritime'],
        'TG-P': ['Plateaux'],
        'TG-S': ['Savanes']
      },
      BJ: {
        'BJ-AL': ['Alibori'],
        'BJ-AK': ['Atacora'],
        'BJ-AQ': ['Atlantique'],
        'BJ-BO': ['Borgou'],
        'BJ-CO': ['Collines'],
        'BJ-KO': ['Kouffo'],
        'BJ-DO': ['Donga'],
        'BJ-LI': ['Littoral'],
        'BJ-MO': ['Mono'],
        'BJ-OU': ['Ouémé', 'Oueme'],
        'BJ-PL': ['Plateau'],
        'BJ-ZO': ['Zou']
      },
      CI: {
        'CI-AB': ['Abidjan'],
        'CI-BS': ['Bas-Sassandra'],
        'CI-CM': ['Comoé', 'Comoe'],
        'CI-DN': ['Denguélé', 'Denguele'],
        'CI-GD': ['Gôh-Djiboua', 'Goh-Djiboua'],
        'CI-LC': ['Lacs'],
        'CI-LG': ['Lagunes'],
        'CI-MG': ['Montagnes'],
        'CI-SM': ['Sassandra-Marahoué', 'Sassandra-Marahoue'],
        'CI-SV': ['Savanes'],
        'CI-VB': ['Vallée du Bandama', 'Vallee du Bandama'],
        'CI-WR': ['Woroba'],
        'CI-ZZ': ['Zanzan']
      },
      BF: {
        'BF-01': ['Boucle du Mouhoun'],
        'BF-02': ['Cascades'],
        'BF-03': ['Centre'],
        'BF-04': ['Centre-Est', 'Centre Est'],
        'BF-05': ['Centre-Nord', 'Centre Nord'],
        'BF-06': ['Centre-Ouest', 'Centre Ouest'],
        'BF-07': ['Centre-Sud', 'Centre Sud'],
        'BF-08': ['Est'],
        'BF-09': ['Hauts-Bassins', 'Hauts Bassins'],
        'BF-10': ['Nord'],
        'BF-11': ['Plateau-Central', 'Plateau Central'],
        'BF-12': ['Sahel'],
        'BF-13': ['Sud-Ouest', 'Sud Ouest']
      },
      GH: {
        'GH-AA': ['Grand Accra', 'Greater Accra'],
        'GH-AH': ['Ashanti'],
        'GH-BA': ['Bono'],
        'GH-NE': ['North East'],
        'GH-NP': ['Northern'],
        'GH-OT': ['Oti'],
        'GH-UE': ['Upper East'],
        'GH-UW': ['Upper West'],
        'GH-WP': ['Western'],
        'GH-VP': ['Volta']
      },
      CM: {
        'CM-AD': ['Adamaoua', 'Adamawa'],
        'CM-CE': ['Centre'],
        'CM-ES': ['Est', 'East'],
        'CM-EN': ['Extrême-Nord', 'Extreme-Nord', 'Far North'],
        'CM-LT': ['Littoral'],
        'CM-NO': ['Nord', 'North'],
        'CM-NW': ['Nord-Ouest', 'North West'],
        'CM-OU': ['Ouest', 'West'],
        'CM-SU': ['Sud', 'South'],
        'CM-SW': ['Sud-Ouest', 'South West']
      },
      GA: {
        'GA-1': ['Estuaire'],
        'GA-2': ['Haut-Ogooué', 'Haut-Ogooue'],
        'GA-3': ['Moyen-Ogooué', 'Moyen-Ogooue'],
        'GA-4': ['Ngounié', 'Ngounie'],
        'GA-5': ['Nyanga'],
        'GA-6': ['Ogooué-Ivindo', 'Ogooue-Ivindo'],
        'GA-7': ['Ogooué-Lolo', 'Ogooue-Lolo'],
        'GA-8': ['Ogooué-Maritime', 'Ogooue-Maritime'],
        'GA-9': ['Woleu-Ntem']
      },
      CG: {
        'CG-BZV': ['Brazzaville'],
        'CG-11': ['Bouenza'],
        'CG-8': ['Cuvette'],
        'CG-15': ['Cuvette-Ouest', 'Cuvette Ouest'],
        'CG-5': ['Kouilou'],
        'CG-2': ['Lékoumou', 'Lekoumou'],
        'CG-7': ['Likouala'],
        'CG-9': ['Niari'],
        'CG-14': ['Plateaux'],
        'CG-16': ['Pointe-Noire', 'Pointe Noire'],
        'CG-12': ['Pool'],
        'CG-13': ['Sangha']
      },
      AO: {
        'AO-BGO': ['Bengo'],
        'AO-BGU': ['Benguela'],
        'AO-BIE': ['Bié', 'Bie'],
        'AO-CAB': ['Cabinda'],
        'AO-CCU': ['Cuando Cubango'],
        'AO-CNN': ['Cunene'],
        'AO-CNO': ['Cuanza-Norte', 'Cuanza Norte'],
        'AO-CUS': ['Cuanza-Sul', 'Cuanza Sul'],
        'AO-HUA': ['Huambo'],
        'AO-HUI': ['Huíla', 'Huila'],
        'AO-LNO': ['Lunda-Norte', 'Lunda Norte'],
        'AO-LSU': ['Lunda-Sul', 'Lunda Sul'],
        'AO-LUA': ['Luanda'],
        'AO-MAL': ['Malanje'],
        'AO-MOX': ['Moxico'],
        'AO-NAM': ['Namibe'],
        'AO-UIG': ['Uíge', 'Uige'],
        'AO-ZAI': ['Zaire']
      },
      CD: {
        'CD-BC': ['Kongo Central'],
        'CD-BU': ['Bas-Uele', 'Bas Uele'],
        'CD-EQ': ['Équateur', 'Equateur'],
        'CD-HK': ['Haut-Katanga', 'Haut Katanga'],
        'CD-HL': ['Haut-Lomami', 'Haut Lomami'],
        'CD-HU': ['Haut-Uele', 'Haut Uele'],
        'CD-IT': ['Ituri'],
        'CD-KC': ['Kasaï-Central', 'Kasai-Central', 'Kasai Central'],
        'CD-KE': ['Kasaï-Oriental', 'Kasai-Oriental', 'Kasai Oriental'],
        'CD-KG': ['Kwango'],
        'CD-KL': ['Kwilu'],
        'CD-KN': ['Kinshasa'],
        'CD-KS': ['Kasaï', 'Kasai'],
        'CD-LO': ['Lomami'],
        'CD-LU': ['Lualaba'],
        'CD-MA': ['Maniema'],
        'CD-MN': ['Mai-Ndombe', 'Mai Ndombe'],
        'CD-MO': ['Mongala'],
        'CD-NK': ['Nord-Kivu', 'Nord Kivu', 'North Kivu'],
        'CD-NU': ['Nord-Ubangi', 'Nord Ubangi'],
        'CD-SA': ['Sankuru'],
        'CD-SK': ['Sud-Kivu', 'Sud Kivu', 'South Kivu'],
        'CD-SU': ['Sud-Ubangi', 'Sud Ubangi'],
        'CD-TA': ['Tanganyika'],
        'CD-TO': ['Tshopo'],
        'CD-TU': ['Tshuapa']
      },
      CF: {
        'CF-BB': ['Bamingui-Bangoran', 'Bamingui Bangoran'],
        'CF-BGF': ['Bangui'],
        'CF-BK': ['Basse-Kotto', 'Basse Kotto'],
        'CF-HK': ['Haute-Kotto', 'Haute Kotto'],
        'CF-HM': ['Haut-Mbomou', 'Haut Mbomou'],
        'CF-KG': ['Kémo', 'Kemo'],
        'CF-LB': ['Lobaye'],
        'CF-HS': ['Mambéré-Kadéï', 'Mambere-Kadei', 'Mambere Kadei'],
        'CF-MB': ['Mbomou'],
        'CF-NM': ['Nana-Mambéré', 'Nana-Mambere', 'Nana Mambere'],
        'CF-MP': ['Ombella-Mpoko', 'Ombella Mpoko'],
        'CF-UK': ['Ouaka'],
        'CF-AC': ['Ouham'],
        'CF-OP': ['Ouham-Pendé', 'Ouham-Pende', 'Ouham Pende'],
        'CF-SE': ['Sangha-Mbaéré', 'Sangha-Mbaere', 'Sangha Mbaere'],
        'CF-VK': ['Vakaga']
      },
      BI: {
        'BI-BB': ['Bubanza'],
        'BI-BL': ['Bujumbura Rural'],
        'BI-BM': ['Bujumbura Mairie', 'Mairie de Bujumbura'],
        'BI-BR': ['Bururi'],
        'BI-CA': ['Cankuzo'],
        'BI-CI': ['Cibitoke'],
        'BI-GI': ['Gitega'],
        'BI-KI': ['Kirundo'],
        'BI-KR': ['Karuzi'],
        'BI-KY': ['Kayanza'],
        'BI-MA': ['Makamba'],
        'BI-MU': ['Muramvya'],
        'BI-MW': ['Mwaro'],
        'BI-MY': ['Muyinga'],
        'BI-NG': ['Ngozi'],
        'BI-RM': ['Rumonge'],
        'BI-RT': ['Rutana'],
        'BI-RY': ['Ruyigi']
      },
      RW: {
        'RW-01': ['Kigali', 'Kigali City'],
        'RW-02': ['Est', 'Eastern'],
        'RW-03': ['Nord', 'Northern'],
        'RW-04': ['Ouest', 'Western'],
        'RW-05': ['Sud', 'Southern']
      },
      UG: {
        'UG-C': ['Central'],
        'UG-E': ['Eastern', 'Est'],
        'UG-N': ['Northern', 'Nord'],
        'UG-W': ['Western', 'Ouest']
      },
      TZ: {
        'TZ-01': ['Arusha'],
        'TZ-02': ['Dar es Salaam'],
        'TZ-03': ['Dodoma'],
        'TZ-04': ['Iringa'],
        'TZ-05': ['Kagera'],
        'TZ-06': ['Pemba North'],
        'TZ-07': ['Zanzibar North'],
        'TZ-08': ['Kigoma'],
        'TZ-09': ['Kilimanjaro'],
        'TZ-10': ['Pemba South'],
        'TZ-11': ['Zanzibar South'],
        'TZ-12': ['Lindi'],
        'TZ-13': ['Mara'],
        'TZ-14': ['Mbeya'],
        'TZ-15': ['Zanzibar West'],
        'TZ-16': ['Morogoro'],
        'TZ-17': ['Mtwara'],
        'TZ-18': ['Mwanza'],
        'TZ-19': ['Coast'],
        'TZ-20': ['Rukwa'],
        'TZ-21': ['Ruvuma'],
        'TZ-22': ['Shinyanga'],
        'TZ-23': ['Singida'],
        'TZ-24': ['Tabora'],
        'TZ-25': ['Tanga'],
        'TZ-26': ['Manyara']
      },
      ZM: {
        'ZM-01': ['Western', 'Ouest'],
        'ZM-02': ['Central'],
        'ZM-03': ['Eastern', 'Est'],
        'ZM-04': ['Luapula'],
        'ZM-05': ['Northern', 'Nord'],
        'ZM-06': ['North-Western', 'North Western'],
        'ZM-07': ['Southern', 'Sud'],
        'ZM-08': ['Copperbelt'],
        'ZM-09': ['Lusaka'],
        'ZM-10': ['Muchinga']
      },
      MW: {
        'MW-C': ['Central'],
        'MW-N': ['Northern', 'Nord'],
        'MW-S': ['Southern', 'Sud']
      },
      MZ: {
        'MZ-P': ['Cabo Delgado'],
        'MZ-G': ['Gaza'],
        'MZ-I': ['Inhambane'],
        'MZ-B': ['Manica'],
        'MZ-L': ['Maputo'],
        'MZ-MPM': ['Maputo Cidade', 'Maputo City'],
        'MZ-N': ['Nampula'],
        'MZ-A': ['Niassa'],
        'MZ-S': ['Sofala'],
        'MZ-T': ['Tete'],
        'MZ-Q': ['Zambézia', 'Zambezia']
      },
      LS: {
        'LS-A': ['Maseru'],
        'LS-B': ['Butha-Buthe', 'Butha Buthe'],
        'LS-C': ['Leribe'],
        'LS-D': ['Berea'],
        'LS-E': ['Mafeteng'],
        'LS-F': ['Mohale\'s Hoek', 'Mohales Hoek'],
        'LS-G': ['Quthing'],
        'LS-H': ['Qacha\'s Nek', 'Qachas Nek'],
        'LS-J': ['Mokhotlong'],
        'LS-K': ['Thaba-Tseka', 'Thaba Tseka']
      },
      SZ: {
        'SZ-HH': ['Hhohho'],
        'SZ-LU': ['Lubombo'],
        'SZ-MA': ['Manzini'],
        'SZ-SH': ['Shiselweni']
      },
      NA: {
        'NA-CA': ['Zambezi', 'Caprivi'],
        'NA-ER': ['Erongo'],
        'NA-HA': ['Hardap'],
        'NA-KA': ['Karas', 'Kharas'],
        'NA-KE': ['Kavango East'],
        'NA-KH': ['Khomas'],
        'NA-KU': ['Kunene'],
        'NA-KW': ['Kavango West'],
        'NA-OD': ['Otjozondjupa'],
        'NA-OH': ['Omaheke'],
        'NA-ON': ['Oshana'],
        'NA-OS': ['Omusati'],
        'NA-OT': ['Oshikoto'],
        'NA-OW': ['Ohangwena']
      },
      ZW: {
        'ZW-BU': ['Bulawayo'],
        'ZW-HA': ['Harare'],
        'ZW-MA': ['Manicaland'],
        'ZW-MC': ['Mashonaland Central'],
        'ZW-ME': ['Mashonaland East'],
        'ZW-MI': ['Midlands'],
        'ZW-MN': ['Matabeleland North'],
        'ZW-MS': ['Matabeleland South'],
        'ZW-MV': ['Masvingo'],
        'ZW-MW': ['Mashonaland West']
      },
      BW: {
        'BW-CE': ['Central'],
        'BW-CH': ['Chobe'],
        'BW-GH': ['Ghanzi'],
        'BW-KG': ['Kgalagadi'],
        'BW-KL': ['Kgatleng'],
        'BW-KW': ['Kweneng'],
        'BW-NE': ['North-East', 'North East'],
        'BW-NW': ['North-West', 'North West'],
        'BW-SE': ['South-East', 'South East'],
        'BW-SO': ['Southern', 'Sud']
      },
      MG: {
        'MG-A': ['Toamasina', 'Tamatave'],
        'MG-D': ['Antsiranana', 'Diego Suarez'],
        'MG-F': ['Fianarantsoa'],
        'MG-M': ['Mahajanga', 'Majunga'],
        'MG-T': ['Antananarivo', 'Tananarive'],
        'MG-U': ['Toliara', 'Tuléar', 'Tulear']
      },
      GN: {
        'GN-B': ['Boké', 'Boke'],
        'GN-C': ['Conakry'],
        'GN-D': ['Kindia'],
        'GN-F': ['Faranah'],
        'GN-K': ['Kankan'],
        'GN-L': ['Labé', 'Labe'],
        'GN-M': ['Mamou'],
        'GN-N': ['Nzérékoré', 'Nzerekore']
      },
      LY: {
        'LY-BA': ['Banghazi', 'Benghazi'],
        'LY-BU': ['Al Butnan'],
        'LY-DR': ['Darnah', 'Derna'],
        'LY-GT': ['Ghat'],
        'LY-JA': ['Al Jabal al Akhdar'],
        'LY-JG': ['Al Jabal al Gharbi'],
        'LY-JI': ['Al Jafarah'],
        'LY-JU': ['Al Jufrah'],
        'LY-KF': ['Al Kufrah'],
        'LY-MB': ['Al Marqab'],
        'LY-MI': ['Misratah', 'Misrata'],
        'LY-MJ': ['Al Marj'],
        'LY-MQ': ['Murzuq'],
        'LY-NL': ['Nalut'],
        'LY-NQ': ['An Nuqat al Khams'],
        'LY-SB': ['Sabha'],
        'LY-SR': ['Surt', 'Sirte'],
        'LY-TB': ['Tarabulus', 'Tripoli'],
        'LY-WA': ['Al Wahat'],
        'LY-WD': ['Wadi al Hayaa'],
        'LY-WS': ['Wadi ash Shati'],
        'LY-ZA': ['Az Zawiyah', 'Zawiya']
      },
      BH: {
        'BH-13': ['Capital', 'Al Asimah'],
        'BH-14': ['Southern', 'Sud', 'Al Janubiyah'],
        'BH-15': ['Muharraq', 'Al Muharraq'],
        'BH-17': ['Northern', 'Nord', 'Ash Shamaliyah']
      },
      BG: {
        'BG-01': ['Blagoevgrad'],
        'BG-02': ['Burgas'],
        'BG-03': ['Varna'],
        'BG-04': ['Veliko Tarnovo'],
        'BG-05': ['Vidin'],
        'BG-06': ['Vratsa'],
        'BG-07': ['Gabrovo'],
        'BG-08': ['Dobrich'],
        'BG-09': ['Kardzhali'],
        'BG-10': ['Kyustendil'],
        'BG-11': ['Lovech'],
        'BG-12': ['Montana'],
        'BG-13': ['Pazardzhik'],
        'BG-14': ['Pernik'],
        'BG-15': ['Pleven'],
        'BG-16': ['Plovdiv'],
        'BG-17': ['Razgrad'],
        'BG-18': ['Ruse', 'Rousse'],
        'BG-19': ['Silistra'],
        'BG-20': ['Sliven'],
        'BG-21': ['Smolyan'],
        'BG-22': ['Sofia'],
        'BG-23': ['Sofia City', 'Sofia-Grad'],
        'BG-24': ['Stara Zagora'],
        'BG-25': ['Targovishte'],
        'BG-26': ['Haskovo'],
        'BG-27': ['Shumen'],
        'BG-28': ['Yambol']
      },
      HR: {
        'HR-01': ['Zagreb County', 'Zagrebačka županija', 'Zagrebacka zupanija'],
        'HR-02': ['Krapina-Zagorje', 'Krapinsko-zagorska županija', 'Krapinsko-zagorska zupanija'],
        'HR-03': ['Sisak-Moslavina', 'Sisačko-moslavačka županija', 'Sisacko-moslavacka zupanija'],
        'HR-04': ['Karlovac', 'Karlovačka županija', 'Karlovacka zupanija'],
        'HR-05': ['Varaždin', 'Varazdin', 'Varaždinska županija', 'Varazdinska zupanija'],
        'HR-06': ['Koprivnica-Križevci', 'Koprivničko-križevačka županija', 'Koprivnicko-krizevacka zupanija'],
        'HR-07': ['Bjelovar-Bilogora', 'Bjelovarsko-bilogorska županija', 'Bjelovarsko-bilogorska zupanija'],
        'HR-08': ['Primorje-Gorski Kotar', 'Primorsko-goranska županija', 'Primorsko-goranska zupanija'],
        'HR-09': ['Lika-Senj', 'Ličko-senjska županija', 'Licko-senjska zupanija'],
        'HR-10': ['Virovitica-Podravina', 'Virovitičko-podravska županija', 'Viroviticko-podravska zupanija'],
        'HR-11': ['Požega-Slavonia', 'Pozega-Slavonia', 'Požeško-slavonska županija', 'Pozesko-slavonska zupanija'],
        'HR-12': ['Brod-Posavina', 'Brodsko-posavska županija', 'Brodsko-posavska zupanija'],
        'HR-13': ['Zadar', 'Zadarska županija', 'Zadarska zupanija'],
        'HR-14': ['Osijek-Baranja', 'Osječko-baranjska županija', 'Osjecko-baranjska zupanija'],
        'HR-15': ['Šibenik-Knin', 'Sibenik-Knin', 'Šibensko-kninska županija', 'Sibensko-kninska zupanija'],
        'HR-16': ['Vukovar-Syrmia', 'Vukovarsko-srijemska županija', 'Vukovarsko-srijemska zupanija'],
        'HR-17': ['Split-Dalmatia', 'Splitsko-dalmatinska županija', 'Splitsko-dalmatinska zupanija'],
        'HR-18': ['Istria', 'Istarska županija', 'Istarska zupanija'],
        'HR-19': ['Dubrovnik-Neretva', 'Dubrovačko-neretvanska županija', 'Dubrovacko-neretvanska zupanija'],
        'HR-20': ['Međimurje', 'Medimurje', 'Međimurska županija', 'Medimurska zupanija'],
        'HR-21': ['City of Zagreb', 'Grad Zagreb']
      },
      CZ: {
        'CZ-10': ['Prague', 'Praha'],
        'CZ-20': ['Central Bohemian', 'Středočeský kraj', 'Stredocesky kraj'],
        'CZ-31': ['South Bohemian', 'Jihočeský kraj', 'Jihocesky kraj'],
        'CZ-32': ['Plzeň', 'Plzen', 'Plzeňský kraj', 'Plzensky kraj'],
        'CZ-41': ['Karlovy Vary', 'Karlovarský kraj', 'Karlovarsky kraj'],
        'CZ-42': ['Ústí nad Labem', 'Usti nad Labem', 'Ústecký kraj', 'Ustecky kraj'],
        'CZ-51': ['Liberec', 'Liberecký kraj', 'Liberecky kraj'],
        'CZ-52': ['Hradec Králové', 'Hradec Kralove', 'Královéhradecký kraj', 'Kralovehradecky kraj'],
        'CZ-53': ['Pardubice', 'Pardubický kraj', 'Pardubicky kraj'],
        'CZ-63': ['Vysočina', 'Vysocina', 'Kraj Vysočina', 'Kraj Vysocina'],
        'CZ-64': ['South Moravian', 'Jihomoravský kraj', 'Jihomoravsky kraj'],
        'CZ-71': ['Olomouc', 'Olomoucký kraj', 'Olomoucky kraj'],
        'CZ-72': ['Zlín', 'Zlin', 'Zlínský kraj', 'Zlinsky kraj'],
        'CZ-80': ['Moravian-Silesian', 'Moravskoslezský kraj', 'Moravskoslezsky kraj']
      },
      EE: {
        'EE-37': ['Harju', 'Harju maakond'],
        'EE-39': ['Hiiu', 'Hiiu maakond'],
        'EE-44': ['Ida-Viru', 'Ida-Viru maakond'],
        'EE-49': ['Jõgeva', 'Jogeva', 'Jõgeva maakond', 'Jogeva maakond'],
        'EE-51': ['Järva', 'Jarva', 'Järva maakond', 'Jarva maakond'],
        'EE-57': ['Lääne', 'Laane', 'Lääne maakond', 'Laane maakond'],
        'EE-59': ['Lääne-Viru', 'Laane-Viru', 'Lääne-Viru maakond', 'Laane-Viru maakond'],
        'EE-65': ['Põlva', 'Polva', 'Põlva maakond', 'Polva maakond'],
        'EE-67': ['Pärnu', 'Parnu', 'Pärnu maakond', 'Parnu maakond'],
        'EE-70': ['Rapla', 'Rapla maakond'],
        'EE-74': ['Saare', 'Saare maakond'],
        'EE-78': ['Tartu', 'Tartu maakond'],
        'EE-82': ['Valga', 'Valga maakond'],
        'EE-84': ['Viljandi', 'Viljandi maakond'],
        'EE-86': ['Võru', 'Voru', 'Võru maakond', 'Voru maakond']
      },
      FI: {
        'FI-01': ['Åland', 'Aland'],
        'FI-02': ['South Karelia', 'Etelä-Karjala', 'Etela-Karjala'],
        'FI-03': ['South Ostrobothnia', 'Etelä-Pohjanmaa', 'Etela-Pohjanmaa'],
        'FI-04': ['Southern Savonia', 'Etelä-Savo', 'Etela-Savo'],
        'FI-05': ['Kainuu'],
        'FI-06': ['Tavastia Proper', 'Kanta-Häme', 'Kanta-Hame'],
        'FI-07': ['Central Ostrobothnia', 'Keski-Pohjanmaa'],
        'FI-08': ['Central Finland', 'Keski-Suomi'],
        'FI-09': ['Kymenlaakso'],
        'FI-10': ['Lapland', 'Lappi'],
        'FI-11': ['Pirkanmaa'],
        'FI-12': ['Ostrobothnia', 'Pohjanmaa'],
        'FI-13': ['North Karelia', 'Pohjois-Karjala'],
        'FI-14': ['Northern Ostrobothnia', 'Pohjois-Pohjanmaa'],
        'FI-15': ['Northern Savonia', 'Pohjois-Savo'],
        'FI-16': ['Päijät-Häme', 'Paijat-Hame'],
        'FI-17': ['Satakunta'],
        'FI-18': ['Uusimaa'],
        'FI-19': ['Southwest Finland', 'Varsinais-Suomi']
      },
      IR: {
        'IR-00': ['Markazi'],
        'IR-01': ['Gilan'],
        'IR-02': ['Mazandaran'],
        'IR-03': ['East Azerbaijan', 'Azarbayjan-e Sharqi'],
        'IR-04': ['West Azerbaijan', 'Azarbayjan-e Gharbi'],
        'IR-05': ['Kermanshah'],
        'IR-06': ['Khuzestan', 'Khuzistan'],
        'IR-07': ['Fars'],
        'IR-08': ['Kerman'],
        'IR-10': ['Isfahan', 'Esfahan'],
        'IR-11': ['Sistan and Baluchestan', 'Sistan va Baluchestan'],
        'IR-12': ['Kurdistan', 'Kordestan'],
        'IR-13': ['Hamadan', 'Hamedan'],
        'IR-14': ['Chaharmahal and Bakhtiari'],
        'IR-15': ['Lorestan', 'Luristan'],
        'IR-16': ['Ilam'],
        'IR-17': ['Kohgiluyeh and Boyer-Ahmad'],
        'IR-18': ['Bushehr', 'Bushehri'],
        'IR-19': ['Zanjan'],
        'IR-20': ['Semnan'],
        'IR-21': ['Yazd'],
        'IR-22': ['Hormozgan'],
        'IR-23': ['Tehran', 'Teheran'],
        'IR-24': ['Ardabil', 'Ardebil'],
        'IR-25': ['Qom', 'Ghom'],
        'IR-26': ['Qazvin', 'Ghazvin'],
        'IR-27': ['Golestan'],
        'IR-28': ['North Khorasan'],
        'IR-29': ['Razavi Khorasan', 'Khorasan-e Razavi'],
        'IR-30': ['South Khorasan'],
        'IR-31': ['Alborz']
      },
      IQ: {
        'IQ-AN': ['Al Anbar', 'Anbar'],
        'IQ-AR': ['Erbil', 'Arbil'],
        'IQ-BA': ['Basra', 'Al Basrah'],
        'IQ-BB': ['Babil', 'Babilon'],
        'IQ-BG': ['Baghdad'],
        'IQ-DA': ['Duhok', 'Dahuk'],
        'IQ-DI': ['Diyala'],
        'IQ-DQ': ['Dhi Qar', 'Thi Qar'],
        'IQ-KA': ['Karbala'],
        'IQ-KI': ['Kirkuk'],
        'IQ-MA': ['Maysan', 'Maisan'],
        'IQ-MU': ['Muthanna', 'Al Muthanna'],
        'IQ-NA': ['Najaf', 'An Najaf'],
        'IQ-NI': ['Nineveh', 'Ninawa'],
        'IQ-QA': ['Al Qadisiyyah', 'Qadisiyah'],
        'IQ-SD': ['Salah ad Din', 'Salahaddin'],
        'IQ-SU': ['Sulaymaniyah', 'As Sulaymaniyah'],
        'IQ-WA': ['Wasit', 'Wassit']
      },
      IL: {
        'IL-D': ['South', 'Southern', 'Sud'],
        'IL-HA': ['Haifa'],
        'IL-JM': ['Jerusalem', 'Al Quds'],
        'IL-M': ['Center', 'Central'],
        'IL-TA': ['Tel Aviv', 'Tel-Aviv'],
        'IL-Z': ['North', 'Northern', 'Nord']
      },
      JO: {
        'JO-AJ': ['Ajloun', 'Ajlun'],
        'JO-AM': ['Amman'],
        'JO-AQ': ['Aqaba'],
        'JO-AT': ['Tafilah', 'At Tafilah'],
        'JO-AZ': ['Zarqa', 'Az Zarqa'],
        'JO-BA': ['Balqa', 'Al Balqa'],
        'JO-IR': ['Irbid'],
        'JO-JA': ['Jerash', 'Jarash'],
        'JO-KA': ['Karak', 'Al Karak'],
        'JO-MA': ['Mafraq', 'Al Mafraq'],
        'JO-MD': ['Madaba'],
        'JO-MN': ['Maan', 'Ma\'an']
      },
      KW: {
        'KW-AH': ['Al Ahmadi', 'Ahmadi'],
        'KW-FA': ['Al Farwaniyah', 'Farwaniya'],
        'KW-HA': ['Hawalli'],
        'KW-JA': ['Al Jahra', 'Jahra'],
        'KW-KU': ['Al Asimah', 'Kuwait City', 'Capital'],
        'KW-MU': ['Mubarak Al-Kabeer', 'Mubarak al Kabir']
      },
      OM: {
        'OM-BJ': ['Al Batinah South', 'Al Batinah Janub'],
        'OM-BS': ['Al Batinah North', 'Al Batinah Shamal'],
        'OM-BU': ['Al Buraimi'],
        'OM-DA': ['Ad Dakhiliyah', 'Dakhiliyah'],
        'OM-MA': ['Muscat'],
        'OM-MU': ['Musandam'],
        'OM-SJ': ['Ash Sharqiyah South', 'South Sharqiyah'],
        'OM-SS': ['Ash Sharqiyah North', 'North Sharqiyah'],
        'OM-WU': ['Al Wusta', 'Wusta'],
        'OM-ZA': ['Ad Dhahirah', 'Az Zahirah'],
        'OM-ZU': ['Dhofar', 'Zufar']
      },
      LV: {
        'LV-001': ['Aglona'],
        'LV-007': ['Alūksne', 'Aluksne'],
        'LV-011': ['Ādaži', 'Adazi'],
        'LV-022': ['Cēsis', 'Cesis'],
        'LV-033': ['Gulbene'],
        'LV-041': ['Jelgava'],
        'LV-047': ['Krāslava', 'Kraslava'],
        'LV-052': ['Ķekava', 'Kekava'],
        'LV-067': ['Ogre'],
        'LV-073': ['Preiļi', 'Preili'],
        'LV-077': ['Rēzekne', 'Rezekne'],
        'LV-080': ['Riga', 'Rīga'],
        'LV-088': ['Saldus'],
        'LV-094': ['Tukums'],
        'LV-111': ['Valmiera'],
        'LV-DGV': ['Daugavpils'],
        'LV-JEL': ['Jelgava City'],
        'LV-JUR': ['Jūrmala', 'Jurmala'],
        'LV-LPX': ['Liepāja', 'Liepaja'],
        'LV-REZ': ['Rēzekne City', 'Rezekne City'],
        'LV-VEN': ['Ventspils']
      },
      LT: {
        'LT-AL': ['Alytus'],
        'LT-KL': ['Klaipėda', 'Klaipeda'],
        'LT-KU': ['Kaunas'],
        'LT-MR': ['Marijampolė', 'Marijampole'],
        'LT-PN': ['Panevėžys', 'Panevezys'],
        'LT-SA': ['Šiauliai', 'Siauliai'],
        'LT-TA': ['Tauragė', 'Taurage'],
        'LT-TE': ['Telšiai', 'Telsiai'],
        'LT-UT': ['Utena'],
        'LT-VL': ['Vilnius']
      },
      MN: {
        'MN-035': ['Orkhon'],
        'MN-037': ['Darkhan-Uul', 'Darkhan Uul'],
        'MN-039': ['Khentii'],
        'MN-041': ['Khövsgöl', 'Khovsgol'],
        'MN-043': ['Khovd'],
        'MN-046': ['Uvs'],
        'MN-047': ['Töv', 'Tov'],
        'MN-049': ['Selenge'],
        'MN-051': ['Sükhbaatar', 'Sukhbaatar'],
        'MN-053': ['Ömnögovi', 'Omnogovi'],
        'MN-055': ['Övörkhangai', 'Ovorkhangai'],
        'MN-057': ['Dzavkhan', 'Zavkhan'],
        'MN-059': ['Dundgovi'],
        'MN-061': ['Dornod'],
        'MN-063': ['Dornogovi'],
        'MN-064': ['Govi-Sümber', 'Govi-Sumber'],
        'MN-065': ['Govi-Altai'],
        'MN-067': ['Bulgan'],
        'MN-069': ['Bayankhongor'],
        'MN-071': ['Bayan-Ölgii', 'Bayan-Olgii'],
        'MN-073': ['Arkhangai'],
        'MN-1': ['Ulaanbaatar', 'Ulan Bator']
      },
      NO: {
        'NO-03': ['Oslo'],
        'NO-11': ['Rogaland'],
        'NO-15': ['Møre og Romsdal', 'More og Romsdal'],
        'NO-18': ['Nordland'],
        'NO-31': ['Østfold', 'Ostfold'],
        'NO-32': ['Akershus'],
        'NO-33': ['Buskerud'],
        'NO-34': ['Innlandet'],
        'NO-39': ['Vestfold'],
        'NO-40': ['Telemark'],
        'NO-42': ['Agder'],
        'NO-46': ['Vestland'],
        'NO-50': ['Trøndelag', 'Trondelag'],
        'NO-55': ['Troms', 'Tromsø', 'Tromso'],
        'NO-56': ['Finnmark']
      },
      LB: {
        'LB-AK': ['Akkar'],
        'LB-AS': ['North', 'Nord'],
        'LB-BA': ['Beirut', 'Beyrouth'],
        'LB-BH': ['Baalbek-Hermel', 'Baalbek Hermel'],
        'LB-BI': ['Beqaa', 'Bekaa'],
        'LB-JA': ['South', 'Sud'],
        'LB-JL': ['Mount Lebanon', 'Mont-Liban', 'Mont Liban'],
        'LB-NA': ['Nabatieh', 'Nabatiyeh']
      },
      QA: {
        'QA-DA': ['Ad Dawhah', 'Doha'],
        'QA-KH': ['Al Khor'],
        'QA-MS': ['Madinat ash Shamal'],
        'QA-RA': ['Ar Rayyan', 'Al Rayyan'],
        'QA-SH': ['Ash Shihaniyah', 'Al-Shahaniya'],
        'QA-US': ['Umm Salal'],
        'QA-WA': ['Al Wakrah'],
        'QA-ZA': ['Az Za‘ayin', 'Az Zain']
      },
      SK: {
        'SK-BC': ['Banská Bystrica', 'Banska Bystrica'],
        'SK-BL': ['Bratislava'],
        'SK-KI': ['Košice', 'Kosice'],
        'SK-NI': ['Nitra'],
        'SK-PV': ['Prešov', 'Presov'],
        'SK-TA': ['Trnava'],
        'SK-TC': ['Trenčín', 'Trencin'],
        'SK-ZI': ['Žilina', 'Zilina']
      },
      SI: {
        'SI-001': ['Pomurska'],
        'SI-002': ['Podravska'],
        'SI-003': ['Koroška', 'Koroska'],
        'SI-004': ['Savinjska'],
        'SI-005': ['Zasavska'],
        'SI-006': ['Posavska'],
        'SI-007': ['Jugovzhodna Slovenija'],
        'SI-008': ['Osrednjeslovenska'],
        'SI-009': ['Gorenjska'],
        'SI-010': ['Primorsko-notranjska', 'Primorsko notranjska'],
        'SI-011': ['Goriška', 'Goriska'],
        'SI-012': ['Obalno-kraška', 'Obalno-kraska']
      },
      KP: {
        'KP-01': ['Pyongyang'],
        'KP-02': ['South Pyongan'],
        'KP-03': ['North Pyongan'],
        'KP-04': ['Chagang', 'Jagang'],
        'KP-05': ['South Hwanghae'],
        'KP-06': ['North Hwanghae'],
        'KP-07': ['Kangwon'],
        'KP-08': ['South Hamgyong'],
        'KP-09': ['North Hamgyong'],
        'KP-10': ['Ryanggang'],
        'KP-13': ['Rason', 'Raseon']
      },
      PS: {
        'PS-BTH': ['Bethlehem', 'Bethléem'],
        'PS-DEB': ['Deir al-Balah', 'Deir al Balah'],
        'PS-GZA': ['Gaza'],
        'PS-HBN': ['Hebron', 'Al Khalil'],
        'PS-JEM': ['Jerusalem', 'Al Quds'],
        'PS-JEN': ['Jenin'],
        'PS-JRH': ['Jericho and Al Aghwar', 'Jericho'],
        'PS-KYS': ['Khan Yunis', 'Khan Younis'],
        'PS-NBS': ['Nablus'],
        'PS-NGZ': ['North Gaza'],
        'PS-QQA': ['Qalqilya', 'Qalqiliya'],
        'PS-RBH': ['Ramallah and al-Bireh', 'Ramallah'],
        'PS-RFH': ['Rafah'],
        'PS-SLT': ['Salfit'],
        'PS-TBS': ['Tubas'],
        'PS-TKM': ['Tulkarm']
      },
      UA: {
        'UA-05': ['Vinnytsia', 'Vinnitsa'],
        'UA-07': ['Volyn'],
        'UA-09': ['Luhansk', 'Lugansk'],
        'UA-12': ['Dnipropetrovsk'],
        'UA-14': ['Donetsk'],
        'UA-18': ['Zhytomyr', 'Zhitomir'],
        'UA-21': ['Zakarpattia', 'Transcarpathia'],
        'UA-23': ['Zaporizhzhia', 'Zaporizhia'],
        'UA-26': ['Ivano-Frankivsk'],
        'UA-30': ['Kyiv City', 'Kiev City'],
        'UA-32': ['Kyiv', 'Kiev'],
        'UA-35': ['Kirovohrad', 'Kirovograd'],
        'UA-40': ['Sevastopol'],
        'UA-43': ['Crimea', 'Crimée'],
        'UA-46': ['Lviv', 'Lvov'],
        'UA-48': ['Mykolaiv', 'Nikolaev'],
        'UA-51': ['Odesa', 'Odessa'],
        'UA-53': ['Poltava'],
        'UA-56': ['Rivne', 'Rovno'],
        'UA-59': ['Sumy'],
        'UA-61': ['Ternopil'],
        'UA-63': ['Kharkiv', 'Kharkov'],
        'UA-65': ['Kherson'],
        'UA-68': ['Khmelnytskyi', 'Khmelnitskyi'],
        'UA-71': ['Cherkasy'],
        'UA-74': ['Chernihiv', 'Chernigov'],
        'UA-77': ['Chernivtsi', 'Chernovtsy']
      },
      AE: {
        'AE-AJ': ['Ajman'],
        'AE-AZ': ['Abu Dhabi', 'Abou Dabi'],
        'AE-DU': ['Dubai', 'Dubaï'],
        'AE-FU': ['Fujairah', 'Fujeirah'],
        'AE-RK': ['Ras Al Khaimah', 'Ras al-Khaimah'],
        'AE-SH': ['Sharjah'],
        'AE-UQ': ['Umm Al Quwain', 'Umm al Qaywayn']
      },
      RU: {
        'RU-MOW': ['Moscow', 'Moscou'],
        'RU-SPE': ['Saint Petersburg', 'Saint-Pétersbourg'],
        'RU-AD': ['Adygea'],
        'RU-ALT': ['Altai Krai'],
        'RU-AL': ['Altai Republic'],
        'RU-AMU': ['Amur Oblast'],
        'RU-ARK': ['Arkhangelsk Oblast'],
        'RU-AST': ['Astrakhan Oblast'],
        'RU-BA': ['Bashkortostan'],
        'RU-BEL': ['Belgorod Oblast'],
        'RU-BRY': ['Bryansk Oblast'],
        'RU-CE': ['Chechnya', 'Tchétchénie'],
        'RU-CHE': ['Chelyabinsk Oblast'],
        'RU-DA': ['Dagestan', 'Daghestan'],
        'RU-IN': ['Ingushetia'],
        'RU-IRK': ['Irkutsk Oblast'],
        'RU-KAM': ['Kamchatka Krai'],
        'RU-KDA': ['Krasnodar Krai'],
        'RU-KEM': ['Kemerovo Oblast'],
        'RU-KGD': ['Kaliningrad Oblast'],
        'RU-KHA': ['Khabarovsk Krai'],
        'RU-KYA': ['Krasnoyarsk Krai'],
        'RU-LEN': ['Leningrad Oblast'],
        'RU-MOS': ['Moscow Oblast'],
        'RU-NVS': ['Novosibirsk Oblast'],
        'RU-OMS': ['Omsk Oblast'],
        'RU-ORE': ['Orenburg Oblast'],
        'RU-PER': ['Perm Krai'],
        'RU-PRI': ['Primorsky Krai'],
        'RU-ROS': ['Rostov Oblast'],
        'RU-SAK': ['Sakhalin Oblast'],
        'RU-SAM': ['Samara Oblast'],
        'RU-SVE': ['Sverdlovsk Oblast'],
        'RU-TA': ['Tatarstan'],
        'RU-TOM': ['Tomsk Oblast'],
        'RU-TUL': ['Tula Oblast'],
        'RU-TVE': ['Tver Oblast'],
        'RU-VGG': ['Volgograd Oblast'],
        'RU-VLA': ['Vladimir Oblast'],
        'RU-VOR': ['Voronezh Oblast'],
        'RU-YAN': ['Yamalo-Nenets'],
        'RU-YAR': ['Yaroslavl Oblast']
      },
      SY: {
        'SY-DI': ['Damascus', 'Damas'],
        'SY-HL': ['Aleppo', 'Alep'],
        'SY-HM': ['Hama'],
        'SY-HI': ['Homs'],
        'SY-ID': ['Idlib'],
        'SY-LA': ['Latakia', 'Lattaquié'],
        'SY-QU': ['Quneitra', 'Kuneitra'],
        'SY-RA': ['Ar-Raqqah', 'Raqqa'],
        'SY-RD': ['Rif Dimashq', 'Rural Damascus'],
        'SY-SU': ['As-Suwayda', 'As-Suwayda'],
        'SY-TA': ['Tartus', 'Tartous'],
        'SY-DA': ['Daraa', 'Dar’a'],
        'SY-DE': ['Deir ez-Zor', 'Dayr az Zawr'],
        'SY-HA': ['Al-Hasakah', 'Al Hasakah']
      }
    };

    const byCountry = aliasesByCountry[String(countryCode || '').toUpperCase()];
    if (!byCountry) {
      return [];
    }

    return byCountry[String(subdivisionCode || '').toUpperCase()] || [];
  }

  function normalizeDivisionCode(value) {
    return String(value || '')
      .toUpperCase()
      .replace(/^([A-Z]{2})[-_]/, '')
      .replace(/[^A-Z0-9]/g, '')
      .trim();
  }

  function renderDynamicCountryMap(host, divisions) {
    const width = 980;
    const height = 620;
    const padding = 20;
    const allCoords = [];

    divisions.forEach((division) => {
      collectGeometryCoords(division.geometry, allCoords);
    });

    const minLon = Math.min.apply(null, allCoords.map((coord) => coord[0]));
    const maxLon = Math.max.apply(null, allCoords.map((coord) => coord[0]));
    const minLat = Math.min.apply(null, allCoords.map((coord) => coord[1]));
    const maxLat = Math.max.apply(null, allCoords.map((coord) => coord[1]));
    const lonSpan = Math.max(0.0001, maxLon - minLon);
    const latSpan = Math.max(0.0001, maxLat - minLat);
    const scale = Math.min((width - (padding * 2)) / lonSpan, (height - (padding * 2)) / latSpan);
    const drawWidth = lonSpan * scale;
    const drawHeight = latSpan * scale;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    const project = (lon, lat) => {
      const x = offsetX + ((lon - minLon) * scale);
      const y = height - (offsetY + ((lat - minLat) * scale));
      return [x, y];
    };

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `Carte de ${requestedCountryName}`);

    divisions.forEach((division) => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'region');
      group.setAttribute('data-nom', division.regionName);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'departement country-division');
      path.setAttribute('data-nom', division.depName);
      path.setAttribute('data-numerodepartement', division.depCode);
      path.setAttribute('d', geometryToPathData(division.geometry, project));

      group.appendChild(path);
      svg.appendChild(group);
      division.path = path;
    });

    host.innerHTML = '';
    host.appendChild(svg);
    departmentIndex = divisions;
  }

  function collectGeometryCoords(geometry, output) {
    if (!geometry || !geometry.coordinates) {
      return;
    }

    if (geometry.type === 'Polygon') {
      geometry.coordinates.forEach((ring) => {
        ring.forEach((point) => {
          output.push([Number(point[0]), Number(point[1])]);
        });
      });
      return;
    }

    if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach((polygon) => {
        polygon.forEach((ring) => {
          ring.forEach((point) => {
            output.push([Number(point[0]), Number(point[1])]);
          });
        });
      });
    }
  }

  function geometryToPathData(geometry, project) {
    if (!geometry || !geometry.coordinates) {
      return '';
    }

    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
    let pathData = '';

    polygons.forEach((polygon) => {
      polygon.forEach((ring) => {
        ring.forEach((point, index) => {
          const projected = project(Number(point[0]), Number(point[1]));
          pathData += `${index === 0 ? 'M' : 'L'}${projected[0].toFixed(2)},${projected[1].toFixed(2)}`;
        });
        pathData += 'Z';
      });
    });

    return pathData;
  }

  searchInput.addEventListener('input', onSearchInput);
  searchInput.addEventListener('keydown', onSearchKeydown);
  searchResults.addEventListener('click', onResultClick);
  document.addEventListener('click', onOutsideClick);

  setupDepartmentsZone();
  setupPostDetailModal();
  closePostDetail();
  renderArdennesPosts();
  initializeChatPersistence();
  initializeThemeSelector();
  initializeMapRadar();

  if (postPseudoInput) {
    postPseudoInput.addEventListener('input', () => {
      updatePresencePseudo(postPseudoInput.value);
    });
  }

  if (postReplyPseudoInput) {
    postReplyPseudoInput.addEventListener('input', () => {
      updatePresencePseudo(postReplyPseudoInput.value);
    });
  }

  if (postFilter) {
    postFilter.addEventListener('change', () => {
      activePostFilter = postFilter.value || 'all';
      resetPostsPagination();
      renderArdennesPosts();
    });
  }

  if (postThemeFilter) {
    postThemeFilter.addEventListener('change', () => {
      activeThemeFilter = postThemeFilter.value || 'all';
      resetPostsPagination();
      renderArdennesPosts();
    });
  }

  if (loadMorePostsBtn) {
    loadMorePostsBtn.addEventListener('click', () => {
      visiblePostsCount += postsPageSize;
      renderArdennesPosts();
    });
  }

  if (backToMapBtn) {
    backToMapBtn.addEventListener('click', showMapView);
  }

  function onSearchInput() {
    activeIndex = -1;
    const query = searchInput.value.trim();

    if (!query) {
      displayedResults = [];
      renderResults([]);
      searchStatus.textContent = `${departmentIndex.length} départements indexés. Recherchez par nom, numéro ou région.`;
      clearHighlight();
      return;
    }

    const matches = findMatches(query, 12);
    displayedResults = matches;

    if (matches.length === 0) {
      renderResults([]);
      searchStatus.textContent = `Aucun résultat pour “${query}”. Essayez un autre nom, code ou région.`;
      clearHighlight();
      return;
    }

    renderResults(matches);
    searchStatus.textContent = `${matches.length} résultat(s) pour “${query}”.`;
  }

  function onSearchKeydown(event) {
    if (!displayedResults.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeIndex = Math.min(activeIndex + 1, displayedResults.length - 1);
      updateActiveResult();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActiveResult();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const selected = displayedResults[activeIndex] || displayedResults[0];
      if (selected) {
        focusDepartment(selected);
      }
      return;
    }

    if (event.key === 'Escape') {
      renderResults([]);
      activeIndex = -1;
    }
  }

  function onResultClick(event) {
    const item = event.target.closest('.search-item');
    if (!item) return;

    const id = item.getAttribute('data-id');
    const department = displayedResults.find((entry) => entry.id === id);
    if (department) {
      focusDepartment(department);
    }
  }

  function onOutsideClick(event) {
    if (event.target === searchInput || event.target.closest('.search-results')) {
      return;
    }

    if (!event.target.closest('.search-wrap')) {
      renderResults([]);
      activeIndex = -1;
    }
  }

  function updateActiveResult() {
    const nodes = Array.from(searchResults.querySelectorAll('.search-item'));
    nodes.forEach((node, idx) => {
      node.classList.toggle('active', idx === activeIndex);
      if (idx === activeIndex) {
        node.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function renderResults(results) {
    if (!results.length) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('show');
      return;
    }

    searchResults.innerHTML = results
      .map(
        (item) => `
          <li class="search-item" role="option" data-id="${item.id}">
            <div>
              <div class="search-name">${escapeHtml(item.depName)} <span class="search-meta">(${escapeHtml(item.depCode)})</span></div>
              <div class="search-meta">${escapeHtml(item.regionName)}</div>
            </div>
          </li>
        `
      )
      .join('');

    searchResults.classList.add('show');
  }

  function focusDepartment(department) {
    clearHighlight();

    if (department.path) {
      department.path.classList.add('dept-highlight');
      lastHighlightedPath = department.path;
    }

    searchInput.value = `${department.depName} (${department.depCode})`;
    searchStatus.textContent = `Département trouvé : ${department.depName} (${department.depCode}) — ${department.regionName}`;

    renderResults([]);
    activeIndex = -1;

    const clickable = department.path ? (department.path.closest('a') || department.path) : null;
    if (clickable) {
      clickable.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }

    if (mapFrame) {
      mapFrame.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function clearHighlight() {
    if (lastHighlightedPath) {
      lastHighlightedPath.classList.remove('dept-highlight');
      lastHighlightedPath = null;
    }
  }

  function setupDepartmentsZone() {
    if (mapFrame) {
      mapFrame.addEventListener('mouseleave', hideDepartmentHoverLabel);
    }

    departmentIndex.forEach((department) => {
      bindDepartmentPathInteractions(department);
    });

    if (ardennesForm) {
      ardennesForm.addEventListener('submit', onArdennesSubmit);
    }

    if (postTableBody) {
      postTableBody.addEventListener('click', onPostTableClick);
    }
  }

  function bindDepartmentPathInteractions(department) {
    if (!department || !department.path || department.path.dataset.boundDepartmentPath === '1') {
      return;
    }

    const clickHandler = (event) => {
      event.preventDefault();
      event.stopPropagation();
      hideDepartmentHoverLabel();
      focusDepartment(department);
      openDepartmentBoard(department);
    };

    const mouseEnterHandler = (event) => {
      showDepartmentHoverLabel(department, event);
    };

    const mouseMoveHandler = (event) => {
      moveDepartmentHoverLabel(event);
    };

    department.path.addEventListener('click', clickHandler);
    department.path.addEventListener('mouseenter', mouseEnterHandler);
    department.path.addEventListener('mousemove', mouseMoveHandler);
    department.path.addEventListener('mouseleave', hideDepartmentHoverLabel);
    department.path.dataset.boundDepartmentPath = '1';
  }

  function setupPostDetailModal() {
    if (!postDetailModal) {
      return;
    }

    postDetailModal.addEventListener('click', (event) => {
      if (event.target.closest('[data-close-post-detail="1"]')) {
        closePostDetail();
      }
    });

    if (postDetailCloseBtn) {
      postDetailCloseBtn.addEventListener('click', closePostDetail);
    }

    if (postReplyForm) {
      postReplyForm.addEventListener('submit', onPostReplySubmit);
    }

    if (postReplyEmojis) {
      postReplyEmojis.addEventListener('click', onReplyEmojiClick);
    }

    if (toggleReplyEmojisBtn) {
      toggleReplyEmojisBtn.addEventListener('click', toggleReplyEmojisPanel);
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && postDetailModal && !postDetailModal.hidden) {
        closePostDetail();
      }
    });
  }

  async function initializeArdennesCities() {
    if (!activeDepartment || !activeDepartment.depCode) {
      renderArdennesCities(getCitiesFromSelectMarkup());
      return;
    }

    const cachedCities = loadCachedArdennesCities();
    const fallbackCities = cachedCities.length ? cachedCities : getDefaultCitiesForActiveDepartment();
    renderArdennesCities(fallbackCities);
    renderArdennesPosts();

    if (!isFranceContext) {
      renderArdennesCities(getDefaultCitiesForActiveDepartment());
      renderArdennesPosts();
      return;
    }

    try {
      const depCodeEncoded = encodeURIComponent(String(activeDepartment.depCode).trim());
      const response = await fetch(`https://geo.api.gouv.fr/departements/${depCodeEncoded}/communes?fields=nom&format=json`);
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data) || !data.length) {
        return;
      }

      const cities = data
        .map((entry) => String((entry && entry.nom) || '').trim())
        .filter(Boolean)
        .sort(sortCitiesFr);

      renderArdennesCities(cities);
      saveCachedArdennesCities(cities);
      renderArdennesPosts();
    } catch (_error) {
      // no-op: keep fallback list
    }
  }

  function getCitiesFromSelectMarkup() {
    if (!postCitySelect) {
      return [];
    }

    return Array.from(postCitySelect.querySelectorAll('option'))
      .map((node) => String(node.textContent || '').trim())
      .filter((city) => city && city !== 'Choisir une ville')
      .filter(Boolean);
  }

  function getDefaultCitiesForActiveDepartment() {
    if (activeDepartment && Array.isArray(activeDepartment.cities) && activeDepartment.cities.length) {
      return activeDepartment.cities.slice().sort(sortCitiesFr);
    }

    const defaultCities = getDepartmentSeedCities(getActiveDeptCode());
    if (defaultCities.length) {
      return defaultCities;
    }

    return getCitiesFromSelectMarkup();
  }

  function getDepartmentSeedCities(depCode) {
    if (!isFranceContext) {
      return [];
    }

    const code = String(depCode || '').trim();
    const data = departmentSeedData[code];
    if (!data || !Array.isArray(data.cities)) {
      return [];
    }

    return data.cities.slice();
  }

  function renderArdennesCities(cities) {
    const uniqueCities = Array.from(new Set(cities)).sort(sortCitiesFr);
    ardennesCities = uniqueCities;

    if (postCitySelect) {
      postCitySelect.innerHTML = ['<option value="">Choisir une ville</option>']
        .concat(uniqueCities.map((city) => `<option>${escapeHtml(city)}</option>`))
        .join('');
    }
  }

  function loadCachedArdennesCities() {
    try {
      const raw = localStorage.getItem(getCitiesCacheKey());
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map((city) => String(city || '').trim())
        .filter(Boolean)
        .sort(sortCitiesFr);
    } catch (_error) {
      return [];
    }
  }

  function saveCachedArdennesCities(cities) {
    try {
      localStorage.setItem(getCitiesCacheKey(), JSON.stringify(cities));
    } catch (_error) {
      // no-op
    }
  }

  function openDepartmentBoard(department) {
    if (!department) {
      return;
    }

    activeDepartment = department;
    activePostDetailId = '';
    closePostDetail();

    if (departmentBoardTitle) {
      const divisionLabel = isFranceContext ? 'Département' : getDivisionLabel();
      departmentBoardTitle.textContent = `${divisionLabel} ${department.depName} (${department.depCode})`;
    }

    if (postCityLabel) {
      postCityLabel.textContent = `Ville (${department.depName})`;
    }

    initializeDepartmentState();
    showArdennesBoard();
  }

  function showArdennesBoard() {
    if (!ardennesBoard) {
      return;
    }

    hideDepartmentHoverLabel();

    if (searchWrap) searchWrap.hidden = true;
    if (mapFrame) mapFrame.hidden = true;
    if (mapRadarWrap) mapRadarWrap.hidden = true;
    if (footer) footer.hidden = true;

    ardennesBoard.hidden = false;
    ardennesBoard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showMapView() {
    if (searchWrap) searchWrap.hidden = false;
    if (mapFrame) mapFrame.hidden = false;
    if (mapRadarWrap) mapRadarWrap.hidden = false;
    if (footer) footer.hidden = false;
    if (ardennesBoard) ardennesBoard.hidden = true;

    hideDepartmentHoverLabel();

    if (mapFrame) {
      mapFrame.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function createDepartmentHoverLabel() {
    const label = document.createElement('div');
    label.className = 'department-hover-label';
    document.body.appendChild(label);
    return label;
  }

  function showDepartmentHoverLabel(department, event) {
    if (!departmentHoverLabel || !department || !event) {
      return;
    }

    const depCode = (department.depCode || '').trim();
    departmentHoverLabel.textContent = depCode
      ? `${depCode} · ${department.depName}`
      : department.depName;
    departmentHoverLabel.classList.add('show');
    moveDepartmentHoverLabel(event);
  }

  function moveDepartmentHoverLabel(event) {
    if (!departmentHoverLabel || !event || !departmentHoverLabel.classList.contains('show')) {
      return;
    }

    const pointerOffset = 12;
    const edgeOffset = 8;
    let x = event.clientX + pointerOffset;
    let y = event.clientY + pointerOffset;
    const labelWidth = departmentHoverLabel.offsetWidth;
    const labelHeight = departmentHoverLabel.offsetHeight;
    const maxX = window.innerWidth - labelWidth - edgeOffset;
    const maxY = window.innerHeight - labelHeight - edgeOffset;

    x = Math.max(edgeOffset, Math.min(x, maxX));
    y = Math.max(edgeOffset, Math.min(y, maxY));

    departmentHoverLabel.style.left = `${x}px`;
    departmentHoverLabel.style.top = `${y}px`;
  }

  function hideDepartmentHoverLabel() {
    if (!departmentHoverLabel) {
      return;
    }

    departmentHoverLabel.classList.remove('show');
  }

  function getActiveDeptCode() {
    const code = String(activeDepartment && activeDepartment.depCode ? activeDepartment.depCode : '').trim();
    return code || 'national';
  }

  function getActiveDeptSlug() {
    return normalize(getActiveDeptCode()).replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'national';
  }

  function getPostsStorageKey() {
    return `${deptStorageKeyPrefix}-${getActiveDeptSlug()}`;
  }

  function getDemoSeedKey() {
    return `${deptDemoSeedPrefix}-${getActiveDeptSlug()}`;
  }

  function getFirebaseSeedKey() {
    return `${deptFirebaseSeedPrefix}-${getActiveDeptSlug()}`;
  }

  function getCitiesCacheKey() {
    return `${deptCitiesCachePrefix}-${getActiveDeptSlug()}`;
  }

  function getPresenceSessionStorageKey() {
    return `${deptPresenceSessionPrefix}-${getActiveDeptSlug()}`;
  }

  function getPresencePseudoStorageKey() {
    return `${deptPresencePseudoPrefix}-${getActiveDeptSlug()}`;
  }

  function initializeDepartmentState() {
    stopPresenceTracking();
    ardennesPosts = loadArdennesPosts();
    ardennesCities = [];
    activePostFilter = 'all';
    activeThemeFilter = 'all';
    resetPostsPagination();
    updateFilterOptions();
    updateThemeFilterOptions();
    presenceSessionId = getPresenceSessionId();
    presencePseudo = getInitialPresencePseudo();
    seedDemoPosts();
    renderArdennesPosts();
    initializeArdennesCities();

    if (firestoreEnabled && firebaseDb) {
      subscribeArdennesMessages();
      initializePresenceTracking();
      ensureArdennesChatDocument()
        .then(() => seedFirebaseFromDemoPosts())
        .catch(() => {});
    }
  }

  async function onArdennesSubmit(event) {
    event.preventDefault();

    if (!ardennesForm) {
      return;
    }

    if (!activeDepartment) {
      updateSyncStatus('Choisis un département sur la carte avant de publier.', true);
      return;
    }

    const formData = new FormData(ardennesForm);
    const pseudo = String(formData.get('pseudo') || '').trim();
    const ville = String(formData.get('ville') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const selectedTheme = String(formData.get('theme') || '').trim();
    const theme = selectedTheme || inferThemeFromContent(description);
    const photoFile = postPhotoInput && postPhotoInput.files ? postPhotoInput.files[0] : null;

    if (!pseudo || !ville || !description || !theme) {
      return;
    }

    updatePresencePseudo(pseudo);

    if (photoFile && (!photoFile.type || !photoFile.type.startsWith('image/'))) {
      updateSyncStatus('Image invalide: choisis un fichier photo.', true);
      return;
    }

    if (photoFile && photoFile.size > maxPhotoSizeBytes) {
      updateSyncStatus('Image trop lourde (max 7 Mo).', true);
      return;
    }

    const post = {
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
      pseudo,
      ville,
      theme,
      description,
      photoUrl: '',
      replies: []
    };

    if (firestoreEnabled && firebaseDb && firebaseStorage) {
      try {
        updateSyncStatus(`Envoi du message (${activeDepartment.depName})...`);
        if (photoFile) {
          const uploadResult = await uploadArdennesPhoto(photoFile, post.id);
          post.photoUrl = uploadResult.photoUrl;
          post.photoPath = uploadResult.photoPath;
        }

        await getArdennesMessagesCollection().doc(post.id).set({
          date: post.date,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          pseudo: post.pseudo,
          ville: post.ville,
          theme: post.theme,
          description: post.description,
          photoUrl: post.photoUrl || '',
          photoPath: post.photoPath || '',
          replies: []
        });

        ardennesForm.reset();
        resetThemeSelector();
        updateSyncStatus(`Message envoyé: tchat / dept-${getActiveDeptSlug()} / messages.`);
        return;
      } catch (_error) {
        updateSyncStatus('Erreur Firestore, sauvegarde locale utilisée.', true);
      }
    }

    ardennesPosts.unshift(post);
    saveArdennesPosts();
    renderArdennesPosts();
    ardennesForm.reset();
    resetThemeSelector();
  }

  function initializeThemeSelector() {
    if (!postThemeGroupInput || !postThemeInput) {
      return;
    }

    const groupNames = Object.keys(themeGroups);

    postThemeGroupInput.innerHTML = ['<option value="">Choisir une rubrique</option>']
      .concat(groupNames.map((groupName) => `<option value="${escapeHtml(groupName)}">${escapeHtml(groupName)}</option>`))
      .join('');

    postThemeGroupInput.addEventListener('change', () => {
      updateThemeOptionsForGroup(postThemeGroupInput.value);
    });

    resetThemeSelector();
    applyStoredThemePreference();
  }

  function updateThemeOptionsForGroup(groupName) {
    if (!postThemeInput) {
      return;
    }

    const themes = themeGroups[groupName] || [];

    if (!themes.length) {
      postThemeInput.innerHTML = '<option value="">Choisir d\'abord une rubrique</option>';
      postThemeInput.disabled = true;
      return;
    }

    postThemeInput.innerHTML = ['<option value="">Choisir un thème</option>']
      .concat(themes.map((theme) => `<option value="${escapeHtml(theme)}">${escapeHtml(theme)}</option>`))
      .join('');

    postThemeInput.disabled = false;
    postThemeInput.value = '';
  }

  function resetThemeSelector() {
    if (postThemeGroupInput) {
      postThemeGroupInput.value = '';
    }

    updateThemeOptionsForGroup('');
  }

  function applyStoredThemePreference() {
    if (!postThemeGroupInput || !postThemeInput) {
      return;
    }

    try {
      const storedGroup = String(localStorage.getItem(globePrefThemeGroupKey) || '').trim();
      const storedTheme = String(localStorage.getItem(globePrefThemeKey) || '').trim();

      if (!storedGroup || !storedTheme || !themeGroups[storedGroup]) {
        return;
      }

      const themes = themeGroups[storedGroup];
      if (!themes.includes(storedTheme)) {
        return;
      }

      postThemeGroupInput.value = storedGroup;
      updateThemeOptionsForGroup(storedGroup);
      postThemeInput.value = storedTheme;

      localStorage.removeItem(globePrefThemeGroupKey);
      localStorage.removeItem(globePrefThemeKey);
    } catch (_error) {
      // no-op
    }
  }

  async function onPostTableClick(event) {
    const openBtn = event.target.closest('.post-pseudo-btn');
    if (openBtn) {
      const postIdToOpen = openBtn.getAttribute('data-id');
      if (postIdToOpen) {
        openPostDetail(postIdToOpen);
      }
      return;
    }

    const btn = event.target.closest('.post-action-btn');
    if (!btn) return;

    const postId = btn.getAttribute('data-id');
    if (!postId) return;

    if (firestoreEnabled && firebaseDb) {
      try {
        const postToDelete = ardennesPosts.find((post) => post.id === postId);
        await getArdennesMessagesCollection().doc(postId).delete();

        if (postToDelete && postToDelete.photoPath && firebaseStorage) {
          await firebaseStorage.ref(postToDelete.photoPath).delete();
        }

        updateSyncStatus('Message supprimé de Firestore.');
        return;
      } catch (_error) {
        updateSyncStatus('Suppression Firestore impossible, suppression locale appliquée.', true);
      }
    }

    ardennesPosts = ardennesPosts.filter((post) => post.id !== postId);
    saveArdennesPosts();
    renderArdennesPosts();
  }

  function renderArdennesPosts() {
    if (!postTableBody) {
      return;
    }

    const filteredPosts = getFilteredArdennesPosts();
    const visiblePosts = filteredPosts.slice(0, visiblePostsCount);

    updateFilterOptions();
    updateThemeFilterOptions();
    updateFilterStatus(filteredPosts.length, ardennesPosts.length);
    updatePostsPagination(filteredPosts.length, visiblePosts.length);

    if (!filteredPosts.length) {
      postTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-row">Aucun post-it pour ce filtre.</td>
        </tr>
      `;
      return;
    }

    postTableBody.innerHTML = visiblePosts
      .map(
        (post) => `
          <tr>
            <td>${formatDate(post.date)}</td>
            <td><button type="button" class="post-pseudo-btn" data-id="${post.id}" aria-label="Ouvrir le post-it de ${escapeHtml(post.pseudo)}">${escapeHtml(post.pseudo)} <span class="open-post-indicator" aria-hidden="true">👈</span></button></td>
            <td>${escapeHtml(post.ville)}</td>
            <td><span class="theme-badge">${escapeHtml(resolvePostTheme(post))}</span></td>
            <td>${escapeHtml(post.description)}</td>
            <td>${post.photoUrl ? `<a href="${escapeHtml(post.photoUrl)}" target="_blank" rel="noopener noreferrer"><img class="table-photo" src="${escapeHtml(post.photoUrl)}" alt="Photo de ${escapeHtml(post.pseudo)}"></a>` : '—'}</td>
            <td><button type="button" class="post-action-btn" data-id="${post.id}">Supprimer</button></td>
          </tr>
        `
      )
      .join('');

    if (postitWall) {
      postitWall.innerHTML = '';
    }
  }

  function resetPostsPagination() {
    visiblePostsCount = postsPageSize;
  }

  function updatePostsPagination(totalFiltered, shownCount) {
    if (paginationInfo) {
      if (!totalFiltered) {
        paginationInfo.textContent = '0 résultat.';
      } else {
        paginationInfo.textContent = `${shownCount} sur ${totalFiltered} résultat(s).`;
      }
    }

    if (loadMorePostsBtn) {
      loadMorePostsBtn.hidden = shownCount >= totalFiltered || totalFiltered === 0;
    }
  }

  function openPostDetail(postId) {
    const post = ardennesPosts.find((entry) => entry.id === postId);
    if (!post || !postDetailModal) {
      return;
    }

    activePostDetailId = post.id;

    const activeTheme = resolvePostTheme(post);

    if (postDetailTitle) {
      postDetailTitle.textContent = post.pseudo;
    }

    if (postDetailMeta) {
      postDetailMeta.textContent = `${post.ville} • ${activeTheme} • ${formatDate(post.date)}`;
    }

    if (postDetailDescription) {
      postDetailDescription.textContent = post.description || '';
    }

    if (postDetailPhoto) {
      if (post.photoUrl) {
        postDetailPhoto.src = post.photoUrl;
        postDetailPhoto.hidden = false;
      } else {
        postDetailPhoto.src = '';
        postDetailPhoto.hidden = true;
      }
    }

    renderPostReplies(post);
    setPostReplyStatus('');

    if (postReplyPseudoInput && !postReplyPseudoInput.value.trim()) {
      const defaultPseudo = String(post.pseudo || '').trim();
      postReplyPseudoInput.value = defaultPseudo;
    }

    if (postReplyMessageInput) {
      postReplyMessageInput.value = '';
    }

    postDetailModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closePostDetail() {
    activePostDetailId = '';

    if (postDetailModal) {
      postDetailModal.hidden = true;
    }

    if (postReplyMessageInput) {
      postReplyMessageInput.value = '';
    }

    setReplyEmojisPanelVisible(false);
    setPostReplyStatus('');
    document.body.style.overflow = '';
  }

  async function onPostReplySubmit(event) {
    event.preventDefault();

    if (!activePostDetailId || !postReplyPseudoInput || !postReplyMessageInput) {
      return;
    }

    const pseudo = String(postReplyPseudoInput.value || '').trim();
    const message = String(postReplyMessageInput.value || '').trim();

    if (!pseudo || !message) {
      setPostReplyStatus('Ajoute un pseudo et un message pour répondre.', true);
      return;
    }

    updatePresencePseudo(pseudo);

    const reply = normalizeReply({
      id: `reply-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toISOString(),
      pseudo,
      message
    });

    if (!reply) {
      setPostReplyStatus('Message invalide.', true);
      return;
    }

    if (firestoreEnabled && firebaseDb) {
      try {
        await getArdennesMessagesCollection().doc(activePostDetailId).update({
          replies: firebase.firestore.FieldValue.arrayUnion(reply),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        addReplyToLocalPost(activePostDetailId, reply);
        if (postReplyMessageInput) {
          postReplyMessageInput.value = '';
        }
        setPostReplyStatus('Réponse envoyée.');
        return;
      } catch (_error) {
        setPostReplyStatus('Erreur Firestore, réponse sauvegardée localement.', true);
      }
    }

    addReplyToLocalPost(activePostDetailId, reply);
    if (postReplyMessageInput) {
      postReplyMessageInput.value = '';
    }
    setPostReplyStatus('Réponse ajoutée en local.');
  }

  function onReplyEmojiClick(event) {
    const emojiBtn = event.target.closest('[data-reply-emoji]');
    if (!emojiBtn || !postReplyMessageInput) {
      return;
    }

    const emoji = String(emojiBtn.getAttribute('data-reply-emoji') || '').trim();
    if (!emoji) {
      return;
    }

    insertEmojiInReplyMessage(emoji);
  }

  function insertEmojiInReplyMessage(emoji) {
    if (!postReplyMessageInput) {
      return;
    }

    const input = postReplyMessageInput;
    const maxLength = Number(input.getAttribute('maxlength') || 320);
    const currentValue = String(input.value || '');
    const start = Number.isFinite(input.selectionStart) ? input.selectionStart : currentValue.length;
    const end = Number.isFinite(input.selectionEnd) ? input.selectionEnd : currentValue.length;
    const nextValue = `${currentValue.slice(0, start)}${emoji}${currentValue.slice(end)}`;

    if (nextValue.length > maxLength) {
      return;
    }

    input.value = nextValue;
    const cursor = start + emoji.length;
    input.focus();
    input.setSelectionRange(cursor, cursor);
  }

  function toggleReplyEmojisPanel() {
    if (!postReplyEmojis) {
      return;
    }

    const willShow = postReplyEmojis.hidden;
    setReplyEmojisPanelVisible(willShow);
  }

  function setReplyEmojisPanelVisible(isVisible) {
    if (postReplyEmojis) {
      postReplyEmojis.hidden = !isVisible;
    }

    if (toggleReplyEmojisBtn) {
      toggleReplyEmojisBtn.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
      toggleReplyEmojisBtn.textContent = isVisible ? '− Moins' : '+ Emoji';
    }
  }

  function addReplyToLocalPost(postId, reply) {
    const post = ardennesPosts.find((entry) => entry.id === postId);
    if (!post || !reply) {
      return;
    }

    const replies = normalizeReplies(post.replies);
    if (replies.some((entry) => entry.id === reply.id)) {
      return;
    }

    post.replies = replies
      .concat(reply)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    saveArdennesPosts();
    renderArdennesPosts();

    if (activePostDetailId === postId) {
      renderPostReplies(post);
    }
  }

  function renderPostReplies(post) {
    if (!postRepliesList || !postReplyCount) {
      return;
    }

    const replies = normalizeReplies(post && post.replies ? post.replies : []);
    postReplyCount.textContent = `${replies.length} réponse${replies.length > 1 ? 's' : ''}`;

    const authorBubble = `
      <article class="post-reply-item author">
        <div class="post-reply-meta">
          <span class="post-reply-pseudo">${escapeHtml(String(post && post.pseudo ? post.pseudo : 'Auteur'))}${getPresenceDotMarkup(String(post && post.pseudo ? post.pseudo : ''))}<span class="post-reply-role">Auteur</span></span>
          <time class="post-reply-date">${escapeHtml(formatDate(post && post.date ? post.date : new Date().toISOString()))}</time>
        </div>
        <div class="post-reply-message">${escapeHtml(String(post && post.description ? post.description : ''))}</div>
      </article>
    `;

    const repliesMarkup = replies
      .map(
        (reply) => `
          <article class="post-reply-item answer">
            <div class="post-reply-meta">
              <span class="post-reply-pseudo">${escapeHtml(reply.pseudo)}${getPresenceDotMarkup(reply.pseudo)}</span>
              <time class="post-reply-date">${escapeHtml(formatDate(reply.date))}</time>
            </div>
            <div class="post-reply-message">${escapeHtml(reply.message)}</div>
          </article>
        `
      )
      .join('');

    const emptyHint = replies.length
      ? ''
      : '<div class="post-replies-empty">Sois la première personne à répondre sous ce message.</div>';

    postRepliesList.innerHTML = `${authorBubble}${repliesMarkup}${emptyHint}`;
  }

  function setPostReplyStatus(message, isError) {
    if (!postReplyStatus) {
      return;
    }

    postReplyStatus.textContent = message || '';
    postReplyStatus.style.color = isError
      ? 'rgba(175, 30, 30, 0.95)'
      : 'rgba(56, 45, 17, 0.75)';
  }

  function renderArdennesWall(posts) {
    if (!postitWall) {
      return;
    }

    if (!posts.length) {
      postitWall.innerHTML = '<div class="wall-empty">Aucun post-it pour le moment.</div>';
      return;
    }

    const wallWidth = Math.max(postitWall.clientWidth, 420);
    const wallHeight = Math.max(postitWall.clientHeight, 360);
    const noteWidth = 145;
    const noteHeight = 145;

    postitWall.innerHTML = posts
      .map((post, index) => {
        const x = 10 + ((index * 37) % Math.max(20, wallWidth - noteWidth - 20));
        const y = 10 + ((index * 53) % Math.max(20, wallHeight - noteHeight - 20));
        const rotation = ((index * 11) % 40) - 20;
        const color = noteColors[index % noteColors.length];

        return `
          <article class="wall-note ${color}" style="left:${x}px;top:${y}px;--r:${rotation}deg">
            <div class="note-head">${escapeHtml(post.pseudo)}</div>
            <div class="note-city">📍 ${escapeHtml(post.ville)}</div>
            <div class="note-theme"># ${escapeHtml(resolvePostTheme(post))}</div>
            <div class="note-desc">${escapeHtml(post.description)}</div>
            ${post.photoUrl ? `<img class="note-photo" src="${escapeHtml(post.photoUrl)}" alt="Photo de ${escapeHtml(post.pseudo)}">` : ''}
          </article>
        `;
      })
      .join('');
  }

  async function initializeChatPersistence() {
    const firebaseReady = initializeFirebaseClients();

    if (!firebaseReady) {
      updateSyncStatus('Mode local (Firebase non configuré).');
      return;
    }

    try {
      firestoreEnabled = true;
      updateSyncStatus('Sync Firestore active. Sélectionne un département pour ouvrir son flux.');
      subscribeMapRadarProfiles();
    } catch (_error) {
      firestoreEnabled = false;
      stopPresenceTracking();
      updateSyncStatus('Firebase non disponible, mode local actif.', true);
      applyMapRadarLocalFallback();
    }
  }

  function initializeMapRadar() {
    if (!mapRadarWrap || !mapRadarList || !mapRadarStatus || !mapRadarEmpty) {
      return;
    }

    if (mapRadarPseudoSearchInput) {
      mapRadarPseudoSearchInput.addEventListener('input', renderMapRadarProfiles);
    }
    if (mapRadarCountrySearchInput) {
      mapRadarCountrySearchInput.addEventListener('input', renderMapRadarProfiles);
    }
    if (mapRadarCitySearchInput) {
      mapRadarCitySearchInput.addEventListener('input', renderMapRadarProfiles);
    }
    if (mapRadarSortInput) {
      mapRadarSortInput.addEventListener('change', renderMapRadarProfiles);
    }
    if (mapRadarClearButton) {
      mapRadarClearButton.addEventListener('click', () => {
        if (mapRadarPseudoSearchInput) mapRadarPseudoSearchInput.value = '';
        if (mapRadarCountrySearchInput) mapRadarCountrySearchInput.value = '';
        if (mapRadarCitySearchInput) mapRadarCitySearchInput.value = '';
        if (mapRadarSortInput) mapRadarSortInput.value = 'recent';
        renderMapRadarProfiles();
      });
    }

    if (mapRadarList) {
      mapRadarList.addEventListener('click', onMapRadarListClick);
    }

    applyMapRadarLocalFallback();
  }

  function onMapRadarListClick(event) {
    const button = event.target.closest('[data-open-profile-pseudo]');
    if (!button) {
      return;
    }

    const pseudo = String(button.getAttribute('data-open-profile-pseudo') || '').trim();
    if (!pseudo) {
      return;
    }

    const target = `../fiche-internaute.html?pseudo=${encodeURIComponent(pseudo)}`;
    window.location.href = target;
  }

  function subscribeMapRadarProfiles() {
    if (!firestoreEnabled || !firebaseDb) {
      applyMapRadarLocalFallback();
      return;
    }

    if (mapRadarUnsubscribe) {
      mapRadarUnsubscribe();
      mapRadarUnsubscribe = null;
    }

    mapRadarUnsubscribe = firebaseDb
      .collection('publicProfiles')
      .limit(300)
      .onSnapshot((snapshot) => {
        mapRadarProfiles = snapshot.docs
          .map((doc) => normalizeMapRadarProfile(doc.data() || {}))
          .filter(Boolean)
          .sort((a, b) => Date.parse(b.updatedAt || '') - Date.parse(a.updatedAt || ''));

        if (!mapRadarProfiles.length) {
          applyMapRadarLocalFallback();
          return;
        }

        renderMapRadarProfiles();
      }, () => {
        applyMapRadarLocalFallback();
      });
  }

  function applyMapRadarLocalFallback() {
    mapRadarProfiles = loadMapRadarLocalProfiles();
    renderMapRadarProfiles();
  }

  function loadMapRadarLocalProfiles() {
    try {
      const raw = localStorage.getItem('gcw-public-profile-v1');
      const parsed = raw ? JSON.parse(raw) : null;
      const profile = normalizeMapRadarProfile(parsed || {});
      return profile ? [profile] : [];
    } catch (_error) {
      return [];
    }
  }

  function normalizeMapRadarProfile(profile) {
    const pseudo = String(profile.pseudo || '').trim().slice(0, 40);
    if (!pseudo) {
      return null;
    }

    return {
      pseudo,
      pays: String(profile.pays || '').trim().slice(0, 80),
      ville: String(profile.ville || '').trim().slice(0, 80),
      bio: String(profile.bio || '').trim().slice(0, 1000),
      updatedAt: String(profile.updatedAt || ''),
      pseudoNorm: normalize(pseudo),
      paysNorm: normalize(profile.pays || ''),
      villeNorm: normalize(profile.ville || ''),
      bioNorm: normalize(profile.bio || '')
    };
  }

  function renderMapRadarProfiles() {
    if (!mapRadarList || !mapRadarStatus || !mapRadarEmpty) {
      return;
    }

    const pseudoQuery = normalize(mapRadarPseudoSearchInput ? mapRadarPseudoSearchInput.value : '');
    const paysQuery = normalize(mapRadarCountrySearchInput ? mapRadarCountrySearchInput.value : '');
    const villeQuery = normalize(mapRadarCitySearchInput ? mapRadarCitySearchInput.value : '');
    const sortValue = String(mapRadarSortInput && mapRadarSortInput.value ? mapRadarSortInput.value : 'recent');

    const filtered = mapRadarProfiles
      .filter((profile) => {
        const pseudoOk = !pseudoQuery || profile.pseudoNorm.includes(pseudoQuery);
        const paysOk = !paysQuery || profile.paysNorm.includes(paysQuery);
        const villeOk = !villeQuery || profile.villeNorm.includes(villeQuery);
        return pseudoOk && paysOk && villeOk;
      })
      .slice();

    if (sortValue === 'alpha-asc') {
      filtered.sort((a, b) => a.pseudoNorm.localeCompare(b.pseudoNorm, 'fr'));
    } else if (sortValue === 'alpha-desc') {
      filtered.sort((a, b) => b.pseudoNorm.localeCompare(a.pseudoNorm, 'fr'));
    } else if (sortValue === 'oldest') {
      filtered.sort((a, b) => Date.parse(a.updatedAt || '') - Date.parse(b.updatedAt || ''));
    } else {
      filtered.sort((a, b) => Date.parse(b.updatedAt || '') - Date.parse(a.updatedAt || ''));
    }

    if (!filtered.length) {
      mapRadarList.innerHTML = '';
      mapRadarEmpty.hidden = false;
      mapRadarStatus.textContent = mapRadarProfiles.length
        ? 'Aucun résultat pour les filtres actuels.'
        : 'Mode local: aucune fiche disponible pour le moment.';
      return;
    }

    mapRadarList.innerHTML = filtered
      .map((profile) => {
        const meta = [profile.pays, profile.ville].filter(Boolean).join(' • ') || 'Pays / ville non renseignés';
        const bio = profile.bio ? profile.bio.slice(0, 150) : 'Aucune bio.';
        return `
          <article class="map-radar-item">
            <h3 class="map-radar-item-name">${escapeHtml(profile.pseudo)}</h3>
            <p class="map-radar-item-meta">${escapeHtml(meta)}</p>
            <p class="map-radar-item-bio">${escapeHtml(bio)}</p>
            <button type="button" class="map-radar-open" data-open-profile-pseudo="${escapeHtml(profile.pseudo)}">Voir la fiche complète</button>
          </article>
        `;
      })
      .join('');

    mapRadarEmpty.hidden = true;
    mapRadarStatus.textContent = `${filtered.length} fiche(s) visible(s).`;
  }

  function initializeFirebaseClients() {
    const firebaseConfig = window.FIREBASE_CONFIG;
    const hasConfig = Boolean(
      firebaseConfig &&
      firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket &&
      firebaseConfig.appId
    );

    if (!window.firebase || !hasConfig) {
      return false;
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebaseDb = firebase.firestore();
    firebaseStorage = firebase.storage();
    return true;
  }

  function getArdennesMessagesCollection() {
    const deptSlug = getActiveDeptSlug();
    return firebaseDb
      .collection('tchat')
      .doc(`dept-${deptSlug}`)
      .collection('messages');
  }

  function getArdennesPresenceCollection() {
    const deptSlug = getActiveDeptSlug();
    return firebaseDb
      .collection('tchat')
      .doc(`dept-${deptSlug}`)
      .collection('presence');
  }

  function initializePresenceTracking() {
    if (!firestoreEnabled || !firebaseDb || presenceInitialized) {
      return;
    }

    presenceInitialized = true;
    document.addEventListener('visibilitychange', onPresenceVisibilityChange);
    window.addEventListener('pagehide', markPresenceOffline);
    window.addEventListener('beforeunload', markPresenceOffline);

    startPresenceHeartbeat();
    subscribePresenceUpdates();
  }

  function stopPresenceTracking() {
    if (presenceHeartbeatTimer) {
      clearInterval(presenceHeartbeatTimer);
      presenceHeartbeatTimer = null;
    }

    if (presenceUnsubscribe) {
      presenceUnsubscribe();
      presenceUnsubscribe = null;
    }

    if (presenceInitialized) {
      document.removeEventListener('visibilitychange', onPresenceVisibilityChange);
      window.removeEventListener('pagehide', markPresenceOffline);
      window.removeEventListener('beforeunload', markPresenceOffline);
    }

    presenceInitialized = false;

    onlineUsersByPseudoNorm = new Map();
  }

  function onPresenceVisibilityChange() {
    if (document.hidden) {
      markPresenceOffline();
      if (presenceHeartbeatTimer) {
        clearInterval(presenceHeartbeatTimer);
        presenceHeartbeatTimer = null;
      }
      return;
    }

    startPresenceHeartbeat();
  }

  function startPresenceHeartbeat() {
    if (!firestoreEnabled || !firebaseDb) {
      return;
    }

    if (presenceHeartbeatTimer) {
      clearInterval(presenceHeartbeatTimer);
      presenceHeartbeatTimer = null;
    }

    writePresenceState(true);
    presenceHeartbeatTimer = setInterval(() => {
      writePresenceState(true);
    }, 25000);
  }

  function markPresenceOffline() {
    if (!firestoreEnabled || !firebaseDb) {
      return;
    }

    writePresenceState(false);
  }

  async function writePresenceState(isOnline) {
    if (!firestoreEnabled || !firebaseDb) {
      return;
    }

    const pseudo = String(presencePseudo || '').trim();
    const pseudoNorm = normalize(pseudo);
    if (!presenceSessionId || !pseudoNorm) {
      return;
    }

    try {
      await getArdennesPresenceCollection().doc(presenceSessionId).set(
        {
          sessionId: presenceSessionId,
          pseudo,
          pseudoNorm,
          online: Boolean(isOnline),
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    } catch (_error) {
      // no-op
    }
  }

  function subscribePresenceUpdates() {
    if (!firestoreEnabled || !firebaseDb) {
      return;
    }

    if (presenceUnsubscribe) {
      presenceUnsubscribe();
      presenceUnsubscribe = null;
    }

    presenceUnsubscribe = getArdennesPresenceCollection().onSnapshot((snapshot) => {
      const now = Date.now();
      const freshnessMs = 90000;
      const nextOnlineUsers = new Map();

      snapshot.docs.forEach((doc) => {
        const data = doc.data() || {};
        const pseudo = String(data.pseudo || '').trim();
        const pseudoNorm = normalize(data.pseudoNorm || pseudo);
        if (!pseudoNorm) {
          return;
        }

        const isOnline = Boolean(data.online);
        const lastSeenMs = toTimestampMs(data.lastSeen || data.updatedAt);
        const isFresh = lastSeenMs > 0 && now - lastSeenMs <= freshnessMs;

        if (isOnline && isFresh) {
          nextOnlineUsers.set(pseudoNorm, { pseudo, lastSeenMs });
        }
      });

      onlineUsersByPseudoNorm = nextOnlineUsers;

      if (activePostDetailId) {
        const activePost = ardennesPosts.find((post) => post.id === activePostDetailId);
        if (activePost) {
          renderPostReplies(activePost);
        }
      }
    });
  }

  function updatePresencePseudo(nextPseudo) {
    const safePseudo = String(nextPseudo || '').trim().slice(0, 40);
    if (!safePseudo || safePseudo === presencePseudo) {
      return;
    }

    presencePseudo = safePseudo;
    try {
      localStorage.setItem(getPresencePseudoStorageKey(), presencePseudo);
    } catch (_error) {
      // no-op
    }

    if (firestoreEnabled && firebaseDb) {
      writePresenceState(true);
    }
  }

  async function ensureArdennesChatDocument() {
    if (!activeDepartment) {
      return;
    }

    await firebaseDb
      .collection('tchat')
      .doc(`dept-${getActiveDeptSlug()}`)
      .set(
        {
          department: activeDepartment.depName,
          departmentCode: activeDepartment.depCode,
          region: activeDepartment.regionName,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );
  }

  async function seedFirebaseFromDemoPosts() {
    try {
      const demoPosts = getDemoPosts();
      if (!demoPosts.length) {
        return;
      }

      const wasSeeded = localStorage.getItem(getFirebaseSeedKey()) === '1';
      if (wasSeeded) {
        return;
      }

      const existing = await getArdennesMessagesCollection().limit(1).get();
      if (!existing.empty) {
        localStorage.setItem(getFirebaseSeedKey(), '1');
        return;
      }

      const batch = firebaseDb.batch();
      demoPosts.forEach((post) => {
        const docRef = getArdennesMessagesCollection().doc(post.id);
        batch.set(docRef, {
          date: post.date,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          pseudo: post.pseudo,
          ville: post.ville,
          theme: post.theme || resolvePostTheme(post),
          description: post.description,
          photoUrl: '',
          photoPath: '',
          replies: normalizeReplies(post.replies)
        });
      });
      await batch.commit();
      localStorage.setItem(getFirebaseSeedKey(), '1');
    } catch (_error) {
      // no-op
    }
  }

  function subscribeArdennesMessages() {
    if (firebaseUnsubscribe) {
      firebaseUnsubscribe();
      firebaseUnsubscribe = null;
    }

    firebaseUnsubscribe = getArdennesMessagesCollection()
      .orderBy('date', 'desc')
      .onSnapshot((snapshot) => {
        ardennesPosts = snapshot.docs.map((doc) => {
          const data = doc.data() || {};
          return normalizePostRecord({
            id: doc.id,
            date: data.date || new Date().toISOString(),
            pseudo: String(data.pseudo || ''),
            ville: String(data.ville || ''),
            theme: String(data.theme || inferThemeFromContent(String(data.description || ''))),
            description: String(data.description || ''),
            photoUrl: String(data.photoUrl || ''),
            photoPath: String(data.photoPath || ''),
            replies: data.replies
          });
        });

        saveArdennesPosts();
        renderArdennesPosts();

        if (activePostDetailId) {
          const activePost = ardennesPosts.find((post) => post.id === activePostDetailId);
          if (activePost) {
            renderPostReplies(activePost);
          }
        }
      });
  }

  async function uploadArdennesPhoto(file, messageId) {
    const extension = getExtensionFromFile(file);
    const photoPath = `tchat/dept-${getActiveDeptSlug()}/photos/${messageId}.${extension}`;
    const storageRef = firebaseStorage.ref(photoPath);
    await storageRef.put(file, { contentType: file.type || 'image/jpeg' });
    const photoUrl = await storageRef.getDownloadURL();
    return { photoUrl, photoPath };
  }

  function getExtensionFromFile(file) {
    const sourceName = String(file && file.name ? file.name : '').toLowerCase();
    const byName = sourceName.includes('.') ? sourceName.split('.').pop() : '';
    if (byName && /^[a-z0-9]{2,5}$/.test(byName)) {
      return byName;
    }

    const mime = String(file && file.type ? file.type : '').toLowerCase();
    if (mime === 'image/png') return 'png';
    if (mime === 'image/webp') return 'webp';
    if (mime === 'image/gif') return 'gif';
    return 'jpg';
  }

  function updateSyncStatus(message, isError) {
    if (!chatSyncStatus) {
      return;
    }

    chatSyncStatus.textContent = message;
    chatSyncStatus.style.color = isError
      ? 'rgba(255, 120, 120, 0.95)'
      : 'rgba(255, 255, 255, 0.82)';
  }

  function getFilteredArdennesPosts() {
    return ardennesPosts.filter((post) => {
      const cityOk = activePostFilter === 'all' || normalize(post.ville) === normalize(activePostFilter);
      const themeOk = activeThemeFilter === 'all' || normalize(resolvePostTheme(post)) === normalize(activeThemeFilter);
      return cityOk && themeOk;
    });
  }

  function updateFilterOptions() {
    if (!postFilter) {
      return;
    }

    const previousValue = activePostFilter;
    const citiesFromPosts = Array.from(
      new Set(
        ardennesPosts
          .map((post) => String(post.ville || '').trim())
          .filter(Boolean)
      )
    );

    const cities = Array.from(new Set(ardennesCities.concat(citiesFromPosts)))
      .sort(sortCitiesFr);

    const options = ['<option value="all">Toutes les villes</option>']
      .concat(cities.map((city) => `<option value="${escapeHtml(city)}">${escapeHtml(city)}</option>`))
      .join('');

    postFilter.innerHTML = options;

    const hasPrevious = previousValue === 'all' || cities.includes(previousValue);
    activePostFilter = hasPrevious ? previousValue : 'all';
    postFilter.value = activePostFilter;
  }

  function updateThemeFilterOptions() {
    if (!postThemeFilter) {
      return;
    }

    const previousValue = activeThemeFilter;
    const groupedOptions = ['<option value="all">Tous les thèmes</option>'];

    Object.entries(themeGroups).forEach(([groupName, themes]) => {
      const groupContent = themes
        .map((theme) => `<option value="${escapeHtml(theme)}">${escapeHtml(theme)}</option>`)
        .join('');

      groupedOptions.push(`<optgroup label="${escapeHtml(groupName)}">${groupContent}</optgroup>`);
    });

    const allSelectableThemes = smartThemes;

    const options = groupedOptions.join('');

    postThemeFilter.innerHTML = options;

    const hasPrevious = previousValue === 'all' || allSelectableThemes.includes(previousValue);
    activeThemeFilter = hasPrevious ? previousValue : 'all';
    postThemeFilter.value = activeThemeFilter;
  }

  function sortCitiesFr(a, b) {
    return frenchCityCollator.compare(a, b);
  }

  function updateFilterStatus(filteredCount, totalCount) {
    if (!postFilterStatus) {
      return;
    }

    if (activePostFilter === 'all' && activeThemeFilter === 'all') {
      postFilterStatus.textContent = `${totalCount} post-it au total.`;
      return;
    }

    postFilterStatus.textContent = `${filteredCount} affiché(s) sur ${totalCount}.`;
  }

  function seedDemoPosts() {
    try {
      const demoPosts = getDemoPosts();
      if (!demoPosts.length) {
        return;
      }

      const seeded = localStorage.getItem(getDemoSeedKey()) === '1';
      if (seeded) {
        return;
      }

      const existingSignatures = new Set(
        ardennesPosts.map((post) =>
          [normalize(post.pseudo), normalize(post.ville), normalize(resolvePostTheme(post)), normalize(post.description)].join('|')
        )
      );

      const missingDemoPosts = demoPosts.filter((post) => {
        const signature = [normalize(post.pseudo), normalize(post.ville), normalize(resolvePostTheme(post)), normalize(post.description)].join('|');
        return !existingSignatures.has(signature);
      });

      if (missingDemoPosts.length) {
        ardennesPosts = missingDemoPosts.concat(ardennesPosts);
        saveArdennesPosts();
      }

      localStorage.setItem(getDemoSeedKey(), '1');
    } catch (_error) {
      // no-op
    }
  }

  function getDemoPosts() {
    const code = getActiveDeptCode();
    const data = departmentSeedData[code];
    if (!data || !Array.isArray(data.posts)) {
      return [];
    }

    return data.posts.map((post) => ({
      ...post,
      theme: resolvePostTheme(post)
    }));
  }

  function resolvePostTheme(post) {
    const explicitTheme = String(post && post.theme ? post.theme : '').trim();
    if (explicitTheme) {
      return explicitTheme;
    }

    return inferThemeFromContent(String(post && post.description ? post.description : ''));
  }

  function inferThemeFromContent(text) {
    const value = normalize(text);

    if (/(hommage|memoire|mémoire|souvenir|repose en paix|rip)/.test(value)) {
      return 'Mur d\'Hommage';
    }

    if (/(un mot pour toi|message pour toi|a toi|à toi)/.test(value)) {
      return 'Un Mot pour Toi';
    }

    if (/(ovni|soucoupe|extraterrestre|alien|lumiere dans le ciel|lumière dans le ciel)/.test(value)) {
      return 'J\'ai vu un OVNI 🛸';
    }

    if (/(deja vu|déjà vu)/.test(value)) {
      return 'Déjà-vu bizarre';
    }

    if (/(maison hantee|maison hantée|fantome|fantôme|esprit|paranormal)/.test(value)) {
      return 'Maison hantée du coin';
    }

    if (/(gouvernement.*cache|on nous cache|mensonge d etat|mensonge d'état)/.test(value)) {
      return 'Gouvernement cache quelque chose';
    }

    if (/(ondes|radiations?|radioactiv|antenne|5g)/.test(value)) {
      return 'Ondes / Radiations bizarres';
    }

    if (/(complot|illuminati|societe secrete|société secrète)/.test(value)) {
      return 'Théorie du complot local';
    }

    if (/(voisin.*bizarre|voisin.*chelou)/.test(value)) {
      return 'Voisin ultra-bizarre';
    }

    if (/(me suit|me suivait|suivi partout|surveille|surveillé)/.test(value)) {
      return 'Personne qui me suit partout';
    }

    if (/(rue.*n existe pas|rue fantome|rue fantôme|pas sur la carte)/.test(value)) {
      return 'Rue qui n\'existe pas sur la carte';
    }

    if (/(silence absolu|zone de silence|aucun bruit)/.test(value)) {
      return 'Zone de silence absolu';
    }

    if (/(club secret|cercle secret|rituel secret)/.test(value)) {
      return 'Club secret improbable';
    }

    if (/(marche noir|marché noir)/.test(value)) {
      return 'Marché noir de [truc absurde]';
    }

    if (/(j ai peur|j'ai peur|peur de|phobie)/.test(value)) {
      return 'J\'ai peur de';
    }

    if (/(cauchemar recurrent|cauchemar récurrent|meme cauchemar|même cauchemar)/.test(value)) {
      return 'Cauchemar récurrent étrange';
    }

    if (/(angoisse|anxiete|anxiété|inexplicable|malaise sans raison|mal a l aise)/.test(value)) {
      return 'Angoisse inexplicable';
    }

    if (/(chaine d evenements|chaîne d'événements|coincidence absurde|coïncidence absurde|evenements absurdes|événements absurdes)/.test(value)) {
      return 'Chaîne d\'événements absurde';
    }

    if (/(patron.*inexplicable|chef.*inexplicable|boss.*inexplicable)/.test(value)) {
      return 'Patron inexplicable';
    }

    if (/(departement|département|numero|numéro|region|région|ou se trouve|ou est|où se trouve|où est)/.test(value)) {
      return 'Les infos à connaître';
    }

    if (/(plainte|probleme|problème|se plaindre|pas normal|bruit|sale|degrade|dégradé|danger)/.test(value)) {
      return 'Ras-le-bol / Coup de gueule';
    }

    if (/(bus|train|tram|route|circulation|embouteillage|stationnement|velo|vélo|securite|sécurité)/.test(value)) {
      return 'Alerte sécurité';
    }

    if (/(mairie|prefecture|préfecture|papier|demarche|démarche|administratif|service public|inscription)/.test(value)) {
      return 'Les infos à connaître';
    }

    if (/(aide|entraide|cherche|besoin|recherche|qui peut|qui peut m'aider|qui peut m aider)/.test(value)) {
      return 'Service aide';
    }

    if (/(idee|idée|proposer|suggestion|ameliorer|améliorer|projet)/.test(value)) {
      return 'Question existentielle';
    }

    if (/(evenement|événement|fete|fête|festival|concert|sortie|atelier|animation)/.test(value)) {
      return 'Événements locaux';
    }

    return 'Juste quelques mots';
  }

  function loadArdennesPosts() {
    try {
      const raw = localStorage.getItem(getPostsStorageKey());
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map((post) => normalizePostRecord(post));
    } catch (_error) {
      return [];
    }
  }

  function saveArdennesPosts() {
    try {
      localStorage.setItem(getPostsStorageKey(), JSON.stringify(ardennesPosts));
    } catch (_error) {
      // no-op
    }
  }

  function formatDate(isoDate) {
    try {
      return new Date(isoDate).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (_error) {
      return '';
    }
  }

  function getPresenceSessionId() {
    try {
      const stored = String(localStorage.getItem(getPresenceSessionStorageKey()) || '').trim();
      if (stored) {
        return stored;
      }

      const sessionId = `presence-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(getPresenceSessionStorageKey(), sessionId);
      return sessionId;
    } catch (_error) {
      return `presence-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }
  }

  function getInitialPresencePseudo() {
    const pseudoFromPostInput = String(postPseudoInput && postPseudoInput.value ? postPseudoInput.value : '').trim();
    if (pseudoFromPostInput) {
      return pseudoFromPostInput.slice(0, 40);
    }

    try {
      const stored = String(localStorage.getItem(getPresencePseudoStorageKey()) || '').trim();
      if (stored) {
        return stored.slice(0, 40);
      }
    } catch (_error) {
      // no-op
    }

    return `Visiteur-${Math.random().toString(36).slice(2, 6)}`;
  }

  function toTimestampMs(value) {
    if (!value) {
      return 0;
    }

    if (typeof value.toMillis === 'function') {
      return value.toMillis();
    }

    const asDate = new Date(value).getTime();
    return Number.isFinite(asDate) ? asDate : 0;
  }

  function isPseudoOnline(pseudo) {
    const pseudoNorm = normalize(pseudo);
    return Boolean(pseudoNorm && onlineUsersByPseudoNorm.has(pseudoNorm));
  }

  function getPresenceDotMarkup(pseudo) {
    const online = isPseudoOnline(pseudo);
    const stateClass = online ? 'online' : 'offline';
    const label = online ? 'en ligne' : 'hors ligne';
    return `<span class="post-reply-presence ${stateClass}" aria-label="${label}" title="${label}"></span>`;
  }

  function normalizePostRecord(post) {
    const description = String(post && post.description ? post.description : '');

    return {
      id: String(post && post.id ? post.id : `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
      date: String(post && post.date ? post.date : new Date().toISOString()),
      pseudo: String(post && post.pseudo ? post.pseudo : ''),
      ville: String(post && post.ville ? post.ville : ''),
      theme: String(post && post.theme ? post.theme : inferThemeFromContent(description)),
      description,
      photoUrl: String(post && post.photoUrl ? post.photoUrl : ''),
      photoPath: String(post && post.photoPath ? post.photoPath : ''),
      replies: normalizeReplies(post && post.replies ? post.replies : [])
    };
  }

  function normalizeReplies(replies) {
    if (!Array.isArray(replies)) {
      return [];
    }

    return replies
      .map((reply) => normalizeReply(reply))
      .filter(Boolean)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  function normalizeReply(reply) {
    const message = String(reply && reply.message ? reply.message : '').trim();
    if (!message) {
      return null;
    }

    const pseudo = String(reply && reply.pseudo ? reply.pseudo : 'Anonyme').trim().slice(0, 40) || 'Anonyme';
    const date = String(reply && reply.date ? reply.date : new Date().toISOString());
    const id = String(reply && reply.id ? reply.id : `reply-${normalize(pseudo)}-${Date.parse(date) || Date.now()}`);

    return {
      id,
      date,
      pseudo,
      message: message.slice(0, 320)
    };
  }

  function findMatches(query, limit) {
    const normalizedQuery = normalize(query);
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

    const scored = departmentIndex
      .map((item) => ({ item, score: scoreEntry(item, normalizedQuery, queryTokens) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => entry.item);

    return scored;
  }

  function scoreEntry(item, query, queryTokens) {
    let score = 0;

    if (item.depCodeNorm === query) score += 180;
    else if (item.depCodeNorm.startsWith(query)) score += 140;
    else if (item.depCodeNorm.includes(query)) score += 105;

    if (item.depNameNorm === query) score += 170;
    else if (item.depNameNorm.startsWith(query)) score += 135;
    else if (item.depNameNorm.includes(query)) score += 100;

    if (item.regionNameNorm === query) score += 95;
    else if (item.regionNameNorm.startsWith(query)) score += 75;
    else if (item.regionNameNorm.includes(query)) score += 50;

    const nameWords = item.depNameNorm.split(/\s+/);
    const regionWords = item.regionNameNorm.split(/\s+/);

    for (const token of queryTokens) {
      if (item.depCodeNorm === token) {
        score += 80;
        continue;
      }

      if (nameWords.some((word) => word.startsWith(token))) {
        score += 45;
      } else if (nameWords.some((word) => word.includes(token))) {
        score += 30;
      } else if (regionWords.some((word) => word.startsWith(token))) {
        score += 20;
      }

      const fuzzy = fuzzyTokenScore(token, item.depNameNorm, item.regionNameNorm);
      score += fuzzy;
    }

    return score;
  }

  function fuzzyTokenScore(token, depName, regionName) {
    if (token.length < 4) {
      return 0;
    }

    const depWords = depName.split(/\s+/);
    const regionWords = regionName.split(/\s+/);
    const words = depWords.concat(regionWords);

    let bestDistance = Infinity;

    for (const word of words) {
      const distance = boundedLevenshtein(token, word, 2);
      if (distance < bestDistance) {
        bestDistance = distance;
      }
      if (bestDistance === 0) break;
    }

    if (bestDistance === 1) return 22;
    if (bestDistance === 2) return 12;
    return 0;
  }

  function boundedLevenshtein(a, b, maxDistance) {
    if (Math.abs(a.length - b.length) > maxDistance) {
      return maxDistance + 1;
    }

    let prev = new Array(b.length + 1);
    let curr = new Array(b.length + 1);

    for (let j = 0; j <= b.length; j++) {
      prev[j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
      curr[0] = i;
      let rowMin = curr[0];

      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        curr[j] = Math.min(
          prev[j] + 1,
          curr[j - 1] + 1,
          prev[j - 1] + cost
        );
        if (curr[j] < rowMin) rowMin = curr[j];
      }

      if (rowMin > maxDistance) {
        return maxDistance + 1;
      }

      const tmp = prev;
      prev = curr;
      curr = tmp;
    }

    return prev[b.length];
  }

  function normalize(value) {
    return (value || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[’']/g, ' ')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
