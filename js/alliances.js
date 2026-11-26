/**
 * js/alliances.js - Модуль военно-политических и экономических альянсов Global Lens (Сезон 31)
 * Поддерживает точную привязку Discord Role ID, отслеживание глав и авто-преемственность (Succession)
 */
import { esc, fmtNum, normName } from './utils.js';
import { renderFlag } from './season.js';
import { playerMeta, getPlayers } from './auth.js';

export const ALLIANCES_MASTER = [
  {
    tag: 'ODTO',
    name: 'ОДТО',
    fullName: 'Организация Договора Тихоокеанской Обороны',
    type: 'Военно-политический',
    color: '#06b6d4',
    pillClass: 'cyan',
    icon: '🛡️',
    leader: 'Индия',
    leaderFlag: '🇮🇳',
    leaderRoleId: '1572735446398799957',
    allianceRoleId: '1572735445324927089',
    canonicalLeader: 'bludebaff',
    defaultMembers: ['Индия', 'Южная Корея', 'Тайвань', 'Япония', 'Австралия'],
    description: 'Ключевой тихоокеанский пакт коллективной обороны и безопасности, сформированный под эгидой Индии для защиты стратегических морских путей и сдерживания эскалации в Азиатско-Тихоокеанском регионе.'
  },
  {
    tag: 'PEC',
    name: 'ТЭС',
    fullName: 'Тихоокеанское экономическое сообщество (PEC)',
    type: 'Экономический',
    color: '#10b981',
    pillClass: 'emerald',
    icon: '🌐',
    leader: 'Индия',
    leaderFlag: '🇮🇳',
    leaderRoleId: '1572961335753445487',
    canonicalLeader: 'bludebaff',
    defaultMembers: ['Индия', 'Украина', 'Япония', 'США', 'Израиль', 'Южная Корея'],
    description: 'Экономический союз The Fire Rises, учреждённый Индией как финансовое дополнение к ОДТО. Включает Инвестиционный банк развития ($20 млрд капитал), беспошлинный технопояс «Китай + 1» (0% налог на 10 лет) и прямую мультивалютную клиринговую систему PEC-Clear.'
  },
  {
    tag: 'NATO',
    name: 'НАТО',
    fullName: 'Североатлантический альянс (NATO)',
    type: 'Военно-политический',
    color: '#3b82f6',
    pillClass: 'blue',
    icon: '⚔️',
    leader: 'США',
    leaderFlag: '🇺🇸',
    leaderRoleId: '1571547700959248475',
    canonicalLeader: 'joskipisk0trias',
    defaultMembers: ['США'],
    description: 'Трансатлантический военно-политический союз коллективной безопасности, объединяющий ведущие державы западного полушария.'
  },
  {
    tag: 'EU',
    name: 'ЕС',
    fullName: 'Европейский союз',
    type: 'Экономический и политический',
    color: '#eab308',
    pillClass: 'yellow',
    icon: '⭐',
    leader: 'Германия',
    leaderFlag: '🇩🇪',
    leaderRoleId: '1571934400600342661',
    canonicalLeader: 'coolman20047',
    defaultMembers: ['Германия', 'Великобритания', 'Ирландия', 'Испания', 'Турция'],
    description: 'Наднациональное экономическое и политическое объединение европейских государств с общим внутренним рынком, едиными таможенными правилами и координацией внешней политики.'
  },
  {
    tag: 'SCO',
    name: 'ШОС',
    fullName: 'Шанхайская организация сотрудничества',
    type: 'Военно-политический',
    color: '#ef4444',
    pillClass: 'red',
    icon: '🤝',
    leader: 'КНР',
    leaderFlag: '🇨🇳',
    leaderRoleId: '1571560118955278529',
    canonicalLeader: 'naebni_govna_olyx',
    defaultMembers: ['КНР', 'Индия', 'Иран', 'Сирия', 'Азербайджан'],
    description: 'Евразийский политический, экономический альянс и блок безопасности, нацеленный на противодействие терроризму, обеспечение стабильности и координацию ресурсных коридоров.'
  },
  {
    tag: 'BRICS',
    name: 'БРИКС',
    fullName: 'Межгосударственное объединение БРИКС',
    type: 'Экономический',
    color: '#f59e0b',
    pillClass: 'amber',
    icon: '🏛️',
    leader: 'КНР',
    leaderFlag: '🇨🇳',
    leaderRoleId: '1571565460728586261',
    canonicalLeader: 'naebni_govna_olyx',
    defaultMembers: ['КНР', 'Россия'],
    description: 'Межгосударственное объединение крупнейших развивающихся экономик, нацеленное на дедолларизацию расчётов, финансирование инфраструктуры через пул резервов и многополярную модель.'
  },
  {
    tag: 'AXIS',
    name: 'Ось Сопротивления',
    fullName: 'Ось Сопротивления',
    type: 'Военно-политический',
    color: '#f97316',
    pillClass: 'orange',
    icon: '🔥',
    leader: 'Иран',
    leaderFlag: '🇮🇷',
    leaderRoleId: '1572719769562390669',
    canonicalLeader: 'sparkling_seahorse_33427',
    defaultMembers: ['Иран', 'Сирия'],
    description: 'Региональная коалиция Ближнего Востока антизападной и антиимпериалистической направленности, ведущая асимметричную координацию и взаимную военную поддержку.'
  },
  {
    tag: 'CSTO',
    name: 'ОДКБ',
    fullName: 'Организация Договора о коллективной безопасности',
    type: 'Военный',
    color: '#e11d48',
    pillClass: 'ruby',
    icon: '🛡️',
    leader: 'Россия',
    leaderFlag: '🇷🇺',
    leaderRoleId: '1571558596871848156',
    canonicalLeader: '_ashkoo139',
    defaultMembers: ['Россия', 'Сирия', 'Беларусь'],
    description: 'Региональная военно-политическая организация коллективной безопасности на постсоветском пространстве с взаимными гарантиями защиты суверенитета.'
  },
  {
    tag: 'CIS',
    name: 'СНГ',
    fullName: 'Содружество Независимых Государств',
    type: 'Региональный и экономический',
    color: '#8b5cf6',
    pillClass: 'purple',
    icon: '🌐',
    leader: 'Россия',
    leaderFlag: '🇷🇺',
    leaderRoleId: '1571559787580096623',
    canonicalLeader: '_ashkoo139',
    defaultMembers: ['Россия', 'Беларусь', 'Азербайджан'],
    description: 'Региональная межгосударственная организация, содействующая всестороннему сотрудничеству, таможенно-логистическим коридорам и поддержанию геополитической стабильности на постсоветском пространстве.'
  }
];

export const ALLIANCE_ALIASES = {
  'снг': 'CIS',
  'cis': 'CIS',
  'одкб': 'CSTO',
  'csto': 'CSTO',
  'odkb': 'CSTO',
  'одто': 'ODTO',
  'odto': 'ODTO',
  'тэс': 'PEC',
  'pec': 'PEC',
  'нато': 'NATO',
  'nato': 'NATO',
  'ес': 'EU',
  'eu': 'EU',
  'шос': 'SCO',
  'sco': 'SCO',
  'брикс': 'BRICS',
  'brics': 'BRICS',
  'ось': 'AXIS',
  'axis': 'AXIS',
  'осьсопротивления': 'AXIS',
  'осьсопротивление': 'AXIS'
};

export const ALLIANCE_LOOKUP = {};
for (const a of ALLIANCES_MASTER) {
  ALLIANCE_LOOKUP[a.name.toLowerCase()] = a;
  ALLIANCE_LOOKUP[a.tag.toLowerCase()] = a;
}

/**
 * Подсчёт агрегированных показателей альянсов на основе активных стран сезона
 * С динамической преемственностью при уходе главы (Succession)
 */
export function computeAlliancesData(seasonEntities = {}, countriesData = {}) {
  const result = [];
  const entitiesList = Object.entries(seasonEntities).map(([id, e]) => ({ ...(e || {}), id: e?.id || id }));
  const playersMap = getPlayers() || {};
  const allPlayersList = Object.values(playersMap);

  for (const master of ALLIANCES_MASTER) {
    const item = { ...master };
    const membersMap = new Map();

    // 1. Дефолтные участники из конфигурации альянса
    for (const mName of master.defaultMembers) {
      const cNorm = normName(mName);
      membersMap.set(cNorm, {
        name: mName,
        flag: countriesData[mName]?.flag || '🏳️',
        gdp: countriesData[mName]?.gdp || 0,
        population: countriesData[mName]?.population || 0,
        player: null,
        nickname: null,
        playerId: null,
        avatar: null,
        isLeader: false,
        hasLeaderRole: false
      });
    }

    // 2. Обогащаем данными активных игроков из entitiesList
    for (const ent of entitiesList) {
      const cName = ent.country;
      if (!cName) continue;
      const cNorm = normName(cName);
      const roles = (ent.roles || []).map(r => (typeof r === 'string' ? r : (r && r.name) || '')).filter(Boolean);
      const roleIds = (ent.roles || []).map(r => (typeof r === 'object' && r ? String(r.id || '') : '')).filter(Boolean);

      let belongs = membersMap.has(cNorm);
      let isLeaderOfThis = false;

      // Проверка роли лидера по точному Discord Role ID
      if (master.leaderRoleId && roleIds.includes(String(master.leaderRoleId))) {
        belongs = true;
        isLeaderOfThis = true;
      }

      for (const r of roles) {
        if (r.startsWith('Лидер: ')) {
          const lTarget = r.replace('Лидер: ', '').trim();
          if (normName(lTarget) === normName(master.name) || normName(lTarget) === normName(master.tag)) {
            belongs = true;
            isLeaderOfThis = true;
          }
        } else if (normName(r) === normName(master.name) || normName(r) === normName(master.tag)) {
          belongs = true;
        }
      }

      // Номинальный учредитель
      if (cNorm === normName(master.leader)) {
        belongs = true;
      }

      if (belongs) {
        const flag = countriesData[cName]?.flag || ent.flag || '🏳️';
        const pId = ent.playerId || ent.player_id || ent.id;
        const pMeta = pId ? playerMeta(String(pId)) : null;

        const existing = membersMap.get(cNorm);
        if (!existing || isLeaderOfThis || !existing.player) {
          membersMap.set(cNorm, {
            name: cName,
            flag: flag,
            gdp: ent.gdp || countriesData[cName]?.gdp || existing?.gdp || 0,
            population: ent.population || countriesData[cName]?.population || existing?.population || 0,
            player: ent.player || (pMeta && pMeta.name) || ent.ruler,
            nickname: ent.nickname || (pMeta && pMeta.name),
            playerId: pId,
            avatar: (pMeta && pMeta.avatar) || (pId && playersMap[String(pId)]?.avatar_url) || null,
            isLeader: isLeaderOfThis,
            hasLeaderRole: isLeaderOfThis
          });
        }
      }
    }

    // 3. Дополнительно сканируем всех игроков из playersMap на наличие точного leaderRoleId
    if (master.leaderRoleId) {
      for (const pl of allPlayersList) {
        if (!pl || !pl.roles) continue;
        const plRoleIds = pl.roles.map(r => String(r.id || ''));
        if (plRoleIds.includes(String(master.leaderRoleId))) {
          const plCountry = pl.country || (pl.countries && pl.countries[0]);
          if (plCountry) {
            const plNorm = normName(plCountry);
            const pMeta = playerMeta(String(pl.id));
            const existing = membersMap.get(plNorm);
            membersMap.set(plNorm, {
              name: plCountry,
              flag: countriesData[plCountry]?.flag || existing?.flag || '🏳️',
              gdp: pl.gdp || countriesData[plCountry]?.gdp || existing?.gdp || 0,
              population: pl.population || countriesData[plCountry]?.population || existing?.population || 0,
              player: pl.username || (pMeta && pMeta.name),
              nickname: pl.nickname || pl.display_name || (pMeta && pMeta.name),
              playerId: pl.id,
              avatar: pl.avatar_url || (pMeta && pMeta.avatar) || null,
              isLeader: true,
              hasLeaderRole: true
            });
          }
        }
      }
    }

    const members = Array.from(membersMap.values());
    const totalGdp = members.reduce((sum, m) => sum + (Number(m.gdp) || 0), 0);
    const totalPop = members.reduce((sum, m) => sum + (Number(m.population) || 0), 0);

    // 4. ОПРЕДЕЛЕНИЕ ПРЕЕМСТВЕННОСТИ И ДЕЙСТВУЮЩЕГО РУКОВОДИТЕЛЯ
    let leaderObj = null;
    let succession = {
      status: 'active', // 'active' | 'acting' | 'vacant'
      founderCountry: master.leader,
      founderFlag: master.leaderFlag,
      canonicalLeader: master.canonicalLeader || null,
      roleId: master.leaderRoleId || null,
      roleName: `Лидер: ${master.name}`,
      actingReason: null
    };

    // А) Прямой обладатель официальной Discord-роли лидера (напр. 1572735446398799957)
    const roleLeader = members.find(m => m.hasLeaderRole && (m.player || m.nickname));
    if (roleLeader) {
      leaderObj = roleLeader;
      succession.status = 'active';
    } else {
      // Б) Номинальный основатель блока (например, Индия)
      const founderObj = members.find(m => normName(m.name) === normName(master.leader));
      if (founderObj && (founderObj.player || founderObj.nickname)) {
        leaderObj = founderObj;
        succession.status = 'active';
      } else {
        // В) Преемственность: основатель свободен / ушёл! Полномочия переходят к активному союзнику
        const activeMembers = members.filter(m => m.player || m.nickname);
        if (activeMembers.length > 0) {
          // Выбираем сильнейшую активную державу блока по ВВП
          activeMembers.sort((a, b) => (Number(b.gdp) || 0) - (Number(a.gdp) || 0));
          leaderObj = activeMembers[0];
          succession.status = 'acting';
          succession.actingReason = `Полномочия председателя перешли к ${leaderObj.name} в связи с вакантным постом главы ${master.leader}`;
        } else {
          // Г) Все страны блока свободны
          leaderObj = founderObj || members[0] || null;
          succession.status = 'vacant';
          succession.actingReason = 'Пост председателя вакантен (роль не назначена в Discord)';
        }
      }
    }

    if (leaderObj) {
      members.forEach(m => {
        m.isLeader = (normName(m.name) === normName(leaderObj.name));
      });
    }

    // Сортировка участников: председатель на первом месте
    members.sort((a, b) => (b.isLeader ? 1 : 0) - (a.isLeader ? 1 : 0));

    item.members = members;
    item.totalGdp = totalGdp;
    item.totalPop = totalPop;
    item.leaderCountry = leaderObj ? leaderObj.name : master.leader;
    item.leaderPlayer = leaderObj ? (leaderObj.player || leaderObj.nickname) : null;
    item.leaderFlag = leaderObj ? leaderObj.flag : master.leaderFlag;
    item.leaderAvatar = leaderObj ? leaderObj.avatar : null;
    item.succession = succession;

    result.push(item);
  }

  return result;
}

/**
 * Рендер карточек альянсов для страницы сезона
 */
export function renderSeasonAlliancesCards(alliancesList) {
  if (!alliancesList || !alliancesList.length) return '';

  return alliancesList.map(al => {
    const succ = al.succession || {};
    const leaderAvaHtml = al.leaderAvatar
      ? `<img src="${al.leaderAvatar}" class="al-leader-ava" alt="${esc(al.leaderPlayer || al.leaderCountry)}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">`
      : '';

    let leaderHtml = '';
    let leaderLabel = 'Лидер блока:';

    if (succ.status === 'acting') {
      leaderLabel = '👑 И.о. главы:';
      leaderHtml = `
        <span class="al-leader-badge al-acting" title="И.о. председателя (полномочия перешли от ${esc(succ.founderCountry)} в связи со сменой лидера)">
          ${renderFlag(al.leaderFlag, al.leaderCountry)}
          ${leaderAvaHtml}
          <span class="al-leader-name">${esc(al.leaderCountry)}</span>
          ${al.leaderPlayer ? ` <span class="al-player">(@${esc(al.leaderPlayer)})</span>` : ''}
          <span class="al-acting-pill" title="Полномочия председателя перешли по старшинству державы">ПРЕЕМНИК</span>
        </span>
      `;
    } else if (succ.status === 'vacant') {
      leaderLabel = 'Лидер блока:';
      leaderHtml = `
        <span class="al-leader-badge al-vacant" title="Пост председателя вакантен в Discord">
          ${renderFlag(al.leaderFlag, al.leaderCountry)}
          <span class="al-leader-name">${esc(al.leaderCountry)}</span>
          <span class="al-vacant-pill">ВАКАНТНО</span>
        </span>
      `;
    } else {
      leaderLabel = 'Лидер блока:';
      leaderHtml = `
        <span class="al-leader-badge" title="Лидер альянса: ${esc(al.leaderCountry)}">
          ${renderFlag(al.leaderFlag, al.leaderCountry)}
          ${leaderAvaHtml}
          <span class="al-leader-name">${esc(al.leaderCountry)}</span>
          ${al.leaderPlayer ? ` <span class="al-player">(@${esc(al.leaderPlayer)})</span>` : ''}
        </span>
      `;
    }

    const membersFlagsHtml = al.members.map(m => {
      const memberAvaHtml = m.avatar
        ? `<img src="${m.avatar}" class="al-member-ava" alt="${esc(m.player || m.name)}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">`
        : '';
      const playerSpan = m.player
        ? `<span class="al-member-player">@${esc(m.player)}</span>`
        : '';

      const crownBadge = (m.isLeader && succ.status === 'acting')
        ? '<span class="al-chip-crown" title="Действующее председательство (преемник)">👑</span>'
        : '';

      return `
        <span class="al-member-chip ${m.player ? 'is-occupied' : 'is-vacant'}" title="${esc(m.name)}${m.player ? ' · @' + esc(m.player) : ''}" onclick="event.stopPropagation(); window.openCountryModal('${esc(m.name)}')">
          ${renderFlag(m.flag, m.name)}
          ${memberAvaHtml}
          <span class="al-member-name">${esc(m.name)}</span>
          ${playerSpan}
          ${crownBadge}
        </span>
      `;
    }).join('');

    const gdpStr = al.totalGdp > 0 ? ('$' + fmtNum(al.totalGdp)) : '—';
    const popStr = al.totalPop > 0 ? fmtNum(al.totalPop) : '—';

    return `
      <div class="c-card alliance-card" style="--al-color:${al.color}" onclick="window.openAllianceModal('${esc(al.name)}')">
        <div class="al-card-head">
          <div class="al-head-top">
            <div class="al-head-left">
              <span class="al-icon">${al.icon}</span>
              <div class="al-title-box">
                <span class="al-title">${esc(al.name)}</span>
                <span class="al-tag">(${esc(al.tag)})</span>
              </div>
            </div>
            <span class="al-type-badge al-type-${al.pillClass}" title="${esc(al.type)}">${esc(al.type)}</span>
          </div>
          <div class="al-full-name" title="${esc(al.fullName)}">${esc(al.fullName)}</div>
        </div>

        <div class="al-leader-row">
          <span class="al-label">${leaderLabel}</span>
          ${leaderHtml}
        </div>

        <div class="al-stats-row">
          <div class="al-stat">
            <span>ВВП блока</span>
            <b>${gdpStr}</b>
          </div>
          <div class="al-stat">
            <span>Население</span>
            <b>${popStr}</b>
          </div>
          <div class="al-stat">
            <span>Держав</span>
            <b>${al.members.length}</b>
          </div>
        </div>

        <div class="al-members-preview">
          <span class="al-label">Состав союза:</span>
          <div class="al-members-wrap">${membersFlagsHtml}</div>
        </div>

        <div class="al-card-footer">
          <button class="al-btn-dossier" onclick="event.stopPropagation(); window.openAllianceModal('${esc(al.name)}')">
            <span>Досье блока</span>
          </button>
          <button class="al-btn-globe" onclick="event.stopPropagation(); window.showAllianceOnGlobe('${esc(al.name)}')">
            <span>На глобус</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

let cachedAlliancesData = null;

export function setCachedAlliancesData(data) {
  cachedAlliancesData = data;
}

export function openAllianceModal(allianceName) {
  const rawNorm = normName(allianceName);
  const tagAlias = ALLIANCE_ALIASES[rawNorm] ? normName(ALLIANCE_ALIASES[rawNorm]) : null;
  const match = (a) => {
    if (!a) return false;
    const an = normName(a.name);
    const at = normName(a.tag);
    return an === rawNorm || at === rawNorm || (tagAlias && (an === tagAlias || at === tagAlias));
  };

  let al = null;
  if (cachedAlliancesData) {
    al = cachedAlliancesData.find(match);
  }
  if (!al) {
    al = ALLIANCES_MASTER.find(match);
  }
  if (!al) return;

  const modal = document.getElementById('allianceModal');
  if (!modal) return;

  const iconEl = document.getElementById('amIcon');
  const nameEl = document.getElementById('amName');
  const subEl = document.getElementById('amSub');
  const statusEl = document.getElementById('amStatusBar');
  const statsBox = document.getElementById('amStatsGrid');
  const detailsBox = document.getElementById('amDetailsList');

  if (iconEl) {
    iconEl.textContent = al.icon || '🛡️';
    iconEl.style.color = al.color;
    iconEl.style.borderColor = al.color;
  }
  if (nameEl) nameEl.textContent = al.name + ' · ' + al.fullName;
  if (subEl) subEl.textContent = `${al.type} альянс · Сезон 31`;

  const succ = al.succession || {};
  const leaderAvaHtml = al.leaderAvatar
    ? `<img src="${al.leaderAvatar}" class="al-leader-ava" style="width:20px;height:20px;border-radius:50%;object-fit:cover;" alt="">`
    : '';

  if (statusEl) {
    let statusLabel = 'ПРЕДСЕДАТЕЛЬСТВО';
    if (succ.status === 'acting') statusLabel = 'И.О. ПРЕДСЕДАТЕЛЯ (ПРЕЕМНИК)';
    else if (succ.status === 'vacant') statusLabel = 'ПОСТ ВАКАНТЕН';

    statusEl.innerHTML = `
      <div class="al-modal-leader-chip">
        <span class="crown-badge">${statusLabel}</span>
        ${renderFlag(al.leaderFlag, al.leaderCountry)}
        ${leaderAvaHtml}
        <b>${esc(al.leaderCountry)}</b>
        ${al.leaderPlayer ? `<span class="player-sub">(@${esc(al.leaderPlayer)})</span>` : ''}
      </div>
    `;
  }

  if (statsBox) {
    const gdpStr = al.totalGdp > 0 ? ('$' + fmtNum(al.totalGdp)) : '—';
    const popStr = al.totalPop > 0 ? fmtNum(al.totalPop) : '—';
    statsBox.innerHTML = `
      <div class="cm-stat"><span>Совокупный ВВП</span><b>${gdpStr}</b></div>
      <div class="cm-stat"><span>Население блока</span><b>${popStr}</b></div>
      <div class="cm-stat"><span>Число государств</span><b>${(al.members || []).length}</b></div>
      <div class="cm-stat"><span>Статус пакта</span><b style="color:${al.color}">АКТИВЕН</b></div>
    `;
  }

  let detailsHtml = '';
  const addRow = (k, v) => {
    if (v) detailsHtml += `<div class="kv"><span>${k}</span><b>${v}</b></div>`;
  };

  addRow('Официальное название', esc(al.fullName));
  addRow('Классификация союза', esc(al.type));

  // Секция статуса роли и преемственности власти
  let roleStatusBadge = '';
  if (succ.status === 'active') {
    roleStatusBadge = `<span class="badge-role-active">✓ Роль активна (@${esc(al.leaderPlayer || 'Правитель')})</span>`;
  } else if (succ.status === 'acting') {
    roleStatusBadge = `<span class="badge-role-acting">⚡ Преемственность: мандат у @${esc(al.leaderPlayer)}</span>`;
  } else {
    roleStatusBadge = `<span class="badge-role-vacant">⚠️ Роль вакантна</span>`;
  }

  detailsHtml += `
    <div class="kv-block al-succession-box">
      <div class="al-succ-head">
        <span class="kv-block-title">👑 Руководство и статус роли</span>
        ${roleStatusBadge}
      </div>
      <div class="al-succ-body">
        <div class="al-succ-row">
          <span class="al-succ-label">Discord-роль главы:</span>
          <code class="al-role-code" title="Идентификатор роли в Discord">${esc(succ.roleName || 'Лидер альянса')} [ID: ${esc(succ.roleId || '—')}]</code>
        </div>
        <div class="al-succ-row">
          <span class="al-succ-label">Страна-основатель:</span>
          <b>${renderFlag(succ.founderFlag, succ.founderCountry)} ${esc(succ.founderCountry)}</b>
          ${succ.canonicalLeader ? `<span class="al-canon-sub">(основатель / экс-глава: @${esc(succ.canonicalLeader)})</span>` : ''}
        </div>
        <div class="al-succ-row">
          <span class="al-succ-label">Текущий председатель:</span>
          <b>${renderFlag(al.leaderFlag, al.leaderCountry)} ${esc(al.leaderCountry)} ${al.leaderPlayer ? `(@${esc(al.leaderPlayer)})` : ''}</b>
          ${succ.status === 'acting' ? '<span class="al-tag-acting">Действующий преемник</span>' : ''}
        </div>
        ${succ.actingReason ? `<div class="al-succ-note">ℹ️ ${esc(succ.actingReason)}. При передаче роли новому правителю в Discord статус будет автоматически синхронизирован на сайте.</div>` : ''}
      </div>
    </div>
  `;

  // Участники
  if (al.members && al.members.length) {
    const membersListHtml = al.members.map(m => {
      const avaHtml = m.avatar ? `<img src="${m.avatar}" class="al-member-ava" style="width:18px;height:18px;border-radius:50%;object-fit:cover;vertical-align:middle;margin:0 4px;" alt="">` : '';
      const crownMark = m.isLeader
        ? (succ.status === 'acting' ? '<span class="crown-mark" style="background:#f59e0b;color:#000;">и.о. главы</span>' : '<span class="crown-mark">лидер</span>')
        : '';
      const playerText = m.player ? `<span class="al-member-player">(@${esc(m.player)})</span>` : '';

      return `
        <span class="al-modal-member-pill" onclick="closeAllianceModal(); window.openCountryModal('${esc(m.name)}')">
          ${renderFlag(m.flag, m.name)}
          ${avaHtml}
          <span>${esc(m.name)}</span>
          ${playerText}
          ${crownMark}
        </span>
      `;
    }).join('');
    detailsHtml += `
      <div class="kv-block" style="margin-top:14px">
        <span class="kv-block-title">Государства-участники (${al.members.length}):</span>
        <div class="al-modal-members-grid">${membersListHtml}</div>
      </div>
    `;
  }

  // Описание / Доктрина блока
  if (al.description) {
    detailsHtml += `
      <div class="kv-block" style="margin-top:14px">
        <span class="kv-block-title">Доктрина и институты союза:</span>
        <p class="al-modal-doctrine-text">${esc(al.description)}</p>
      </div>
    `;
  }

  // Кнопка перехода на 3D карту
  detailsHtml += `
    <div style="margin-top:18px;text-align:center">
      <button class="country-dossier-btn al-globe-jump-btn" onclick="window.showAllianceOnGlobe('${esc(al.name)}')">
        <span>Показать блок ${esc(al.name)} на 3D глобусе</span>
      </button>
    </div>
  `;

  if (detailsBox) {
    detailsBox.innerHTML = detailsHtml;
  }

  modal.classList.add('active');
  modal.style.display = 'grid';
  document.body.style.overflow = 'hidden';
}

export function closeAllianceModal() {
  const modal = document.getElementById('allianceModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 200);
    document.body.style.overflow = '';
  }
}

/**
 * Переход на глобус и включение подсветки альянса
 */
export function showAllianceOnGlobe(allianceName) {
  closeAllianceModal();
  if (typeof window.go === 'function') {
    window.go('about');
  }
  setTimeout(() => {
    if (typeof window.toggleFactionFilter === 'function') {
      window.toggleFactionFilter(allianceName);
    }
  }, 250);
}

// Экспорт глобально для HTML onclick
window.openAllianceModal = openAllianceModal;
window.closeAllianceModal = closeAllianceModal;
window.showAllianceOnGlobe = showAllianceOnGlobe;
