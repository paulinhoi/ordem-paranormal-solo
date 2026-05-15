// JavaScript - ORDEM PARANORMAL SOLO - CORRIGIDO

const GOOGLE_CLIENT_ID = '522909916248-gj093l0ljk9p0mi378jnlgv9jnpkbhic.apps.googleusercontent.com';
let oauthAccessToken = null;

let config = {
    apiKey: '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',
    model: 'minimax/minimax-m2.5'
};

let gameState = {
    personagem: {
        nome: '', origem: '', classe: '',
        atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 1 },
        proficiencias: ''
    },
    estado: {
        pv: 20, pvMax: 20, pe: 6, peMax: 6, san: 20, sanMax: 20, nex: 5, defesaEquip: 0
    },
    attacks: [],
    inventario: [],
    descricao: { aparencia: '', personalidade: '', historia: '', anotacoes: '' },
    missoes: [],
    historico: []
};

const pericias = [
    { nome: 'Acrobacia', attr: 'agi', carga: true, treinado: false, treino: 0, outros: 0 },
    { nome: 'Adestramento', attr: 'pre', treinado: true, treino: 0, outros: 0 },
    { nome: 'Artes', attr: 'pre', treinado: true, treino: 0, outros: 0 },
    { nome: 'Atletismo', attr: 'for', treino: 0, outros: 0 },
    { nome: 'Atualidades', attr: 'int', treino: 0, outros: 0 },
    { nome: 'Ciências', attr: 'int', treinado: true, treino: 0, outros: 0 },
    { nome: 'Crime', attr: 'agi', carga: true, treinado: true, treino: 0, outros: 0 },
    { nome: 'Diplomacia', attr: 'pre', treino: 0, outros: 0 },
    { nome: 'Enganação', attr: 'pre', treino: 0, outros: 0 },
    { nome: 'Fortitude', attr: 'vig', treino: 0, outros: 0 },
    { nome: 'Furtividade', attr: 'agi', carga: true, treino: 0, outros: 0 },
    { nome: 'Iniciativa', attr: 'agi', treino: 0, outros: 0 },
    { nome: 'Intimidação', attr: 'pre', treino: 0, outros: 0 },
    { nome: 'Intuição', attr: 'pre', treino: 0, outros: 0 },
    { nome: 'Investigação', attr: 'int', treino: 0, outros: 0 },
    { nome: 'Luta', attr: 'for', treino: 0, outros: 0 },
    { nome: 'Medicina', attr: 'int', treino: 0, outros: 0 },
    { nome: 'Ocultismo', attr: 'int', treinado: true, treino: 0, outros: 0 },
    { nome: 'Percepção', attr: 'pre', treino: 0, outros: 0 },
    { nome: 'Pilotagem', attr: 'agi', treinado: true, treino: 0, outros: 0 },
    { nome: 'Pontaria', attr: 'agi', treino: 0, outros: 0 },
    { nome: 'Profissão', attr: 'int', treinado: true, treino: 0, outros: 0 },
    { nome: 'Reflexos', attr: 'agi', treino: 0, outros: 0 },
    { nome: 'Religião', attr: 'int', treinado: true, treino: 0, outros: 0 },
    { nome: 'Sobrevivência', attr: 'vig', treino: 0, outros: 0 },
    { nome: 'Tática', attr: 'int', treinado: true, treino: 0, outros: 0 },
    { nome: 'Tecnologia', attr: 'int', treinado: true, treino: 0, outros: 0 },
    { nome: 'Vontade', attr: 'vig', treino: 0, outros: 0 }
];

window.onload = function() {
    loadData();
    loadConfig();
    renderAll();
    
    const savedToken = localStorage.getItem('oauthToken');
    if (savedToken) {
        oauthAccessToken = savedToken;
        updateDriveStatus();
    }
};

function renderAll() {
    renderCharacter();
    renderAttributes();
    renderResources();
    renderDefense();
    renderSkills();
    renderAttacks();
    renderMissions();
    renderInventory();
    renderDescricao();
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

function switchView(view) {
    document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function renderCharacter() {
    document.getElementById('charName').value = gameState.personagem.nome || '';
    document.getElementById('charOrigin').value = gameState.personagem.origem || '';
    document.getElementById('charClass').value = gameState.personagem.classe || '';
    document.getElementById('proficiencias').value = gameState.personagem.proficiencias || '';
}

function renderDescricao() {
    const d = gameState.descricao;
    document.getElementById('desc-aparencia').value = d.aparencia || '';
    document.getElementById('desc-personalidade').value = d.personalidade || '';
    document.getElementById('desc-historia').value = d.historia || '';
    document.getElementById('desc-anotacoes').value = d.anotacoes || '';
}

document.addEventListener('input', function(e) {
    const id = e.target.id;
    const val = e.target.value;
    
    if (id === 'charName') gameState.personagem.nome = val;
    if (id === 'charOrigin') gameState.personagem.origem = val;
    if (id === 'charClass') gameState.personagem.classe = val;
    if (id === 'proficiencias') gameState.personagem.proficiencias = val;
    if (id === 'desc-aparencia') gameState.descricao.aparencia = val;
    if (id === 'desc-personalidade') gameState.descricao.personalidade = val;
    if (id === 'desc-historia') gameState.descricao.historia = val;
    if (id === 'desc-anotacoes') gameState.descricao.anotacoes = val;
    if (id === 'nex') gameState.estado.nex = parseInt(val) || 0;
    if (id === 'def-equip') gameState.estado.defesaEquip = parseInt(val) || 0;
    if (id === 'pe-turno') gameState.estado.peMax = parseInt(val) || 1;
    
    // Recursos: PV, SAN, PE
    if (id === 'pv-atual') gameState.estado.pv = parseInt(val) || 0;
    if (id === 'pv-max') gameState.estado.pvMax = parseInt(val) || 1;
    if (id === 'san-atual') gameState.estado.san = parseInt(val) || 0;
    if (id === 'san-max') gameState.estado.sanMax = parseInt(val) || 1;
    if (id === 'pe-atual') gameState.estado.pe = parseInt(val) || 0;
    if (id === 'pe-max') gameState.estado.peMax = parseInt(val) || 1;
    
    renderDefense();
    renderResources();
    saveData();
});

function renderAttributes() {
    const a = gameState.personagem.atributos;
    const agiVal = parseInt(a.agi) || 0;
    const forVal = parseInt(a.for) || 0;
    const intVal = parseInt(a.int) || 0;
    const preVal = parseInt(a.pre) || 0;
    const vigVal = parseInt(a.vig) || 0;
    
    document.getElementById('attr-for').textContent = forVal;
    document.getElementById('attr-agi').textContent = agiVal;
    document.getElementById('attr-int').textContent = intVal;
    document.getElementById('attr-pre').textContent = preVal;
    document.getElementById('attr-vig').textContent = vigVal;
    
    document.getElementById('deslocamento').textContent = agiVal + 9 + 'm / ' + (agiVal + 6) + 'q';
    
    renderDefense();
    renderSkills();
    saveData();
}

function editAttr(attr) {
    const current = gameState.personagem.atributos[attr] || 1;
    const newVal = prompt(`Valor de ${attr.toUpperCase()} (1-5):`, current);
    if (newVal !== null) {
        const val = parseInt(newVal);
        if (val >= 1 && val <= 5) {
            gameState.personagem.atributos[attr] = val;
            renderAttributes();
            saveData();
        }
    }
}

function renderResources() {
    const e = gameState.estado;
    
    const pv = parseInt(e.pv) || 0;
    const pvMax = Math.max(1, parseInt(e.pvMax) || 20);
    const san = parseInt(e.san) || 0;
    const sanMax = Math.max(1, parseInt(e.sanMax) || 20);
    const pe = parseInt(e.pe) || 0;
    const peMax = Math.max(1, parseInt(e.peMax) || 6);
    
    document.getElementById('pv-atual').value = pv;
    document.getElementById('pv-max').value = pvMax;
    document.getElementById('san-atual').value = san;
    document.getElementById('san-max').value = sanMax;
    document.getElementById('pe-atual').value = pe;
    document.getElementById('pe-max').value = peMax;
    document.getElementById('pe-turno').value = peMax;
    document.getElementById('nex').value = parseInt(e.nex) || 5;
    
    const pvPct = (pv / pvMax) * 100;
    const sanPct = (san / sanMax) * 100;
    const pePct = (pe / peMax) * 100;
    
    const pvFill = document.getElementById('pv-fill');
    const sanFill = document.getElementById('san-fill');
    const peFill = document.getElementById('pe-fill');
    
    pvFill.style.width = pvPct + '%';
    sanFill.style.width = sanPct + '%';
    peFill.style.width = pePct + '%';
    
    if (pvPct < 30) pvFill.classList.add('critical');
    else pvFill.classList.remove('critical');
    
    document.getElementById('mobile-pv').textContent = `${pv}/${pvMax}`;
    document.getElementById('mobile-san').textContent = `${san}/${sanMax}`;
    document.getElementById('mobile-pe').textContent = `${pe}/${peMax}`;
    
    saveData();
}

function changeResource(type, amount) {
    const e = gameState.estado;
    
    if (type === 'pv') {
        const pvMax = Math.max(1, parseInt(e.pvMax) || 20);
        const newVal = (parseInt(e.pv) || 0) + amount;
        e.pv = Math.max(0, Math.min(newVal, pvMax));
    } else if (type === 'san') {
        const sanMax = Math.max(1, parseInt(e.sanMax) || 20);
        const newVal = (parseInt(e.san) || 0) + amount;
        e.san = Math.max(0, Math.min(newVal, sanMax));
    } else if (type === 'pe') {
        const peMax = Math.max(1, parseInt(e.peMax) || 6);
        const newVal = (parseInt(e.pe) || 0) + amount;
        e.pe = Math.max(0, Math.min(newVal, peMax));
    }
    
    renderResources();
    saveData();
}

function renderDefense() {
    const a = gameState.personagem.atributos;
    const eq = parseInt(gameState.estado.defesaEquip) || 0;
    
    const agi = parseInt(a.agi) || 0;
    const defesa = 10 + agi + eq;
    const esquiva = 10 + agi;
    
    document.getElementById('defesa-total').textContent = defesa;
    document.getElementById('def-agi-val').textContent = agi;
    document.getElementById('def-equip').value = eq;
    document.getElementById('esquiva').textContent = esquiva;
    document.getElementById('bloqueio').textContent = '0';
}

function renderSkills() {
    const tbody = document.getElementById('pericias-body');
    const a = gameState.personagem.atributos;
    
    tbody.innerHTML = pericias.map((p, i) => {
        const attrVal = parseInt(a[p.attr]) || 0;
        const treino = parseInt(p.treino) || 0;
        const outros = parseInt(p.outros) || 0;
        const total = attrVal + treino + outros;
        
        let sufixo = '';
        if (p.carga) sufixo += '+';
        if (p.treinado) sufixo += '*';
        
        const treinada = treino > 0;
        let nameClass = 'pericia-name';
        if (treino == 5) nameClass += ' treino-5';
        else if (treino == 10) nameClass += ' treino-10';
        else if (treino == 15) nameClass += ' treino-15';
        const icon = treinada ? '◈' : '⬡';
        
        return `
            <tr>
                <td><span class="${nameClass}">${icon} ${p.nome}</span><span class="pericia-suffix">${sufixo}</span></td>
                <td class="pericia-attr">(${p.attr.toUpperCase()})</td>
                <td class="pericia-bonus">(${total})</td>
                <td><select onchange="updateSkill(${i}, 'treino', this.value)">
                    <option value="0" ${treino==0?'selected':''}>0</option>
                    <option value="5" ${treino==5?'selected':''}>5</option>
                    <option value="10" ${treino==10?'selected':''}>10</option>
                    <option value="15" ${treino==15?'selected':''}>15</option>
                </select></td>
                <td><input type="text" inputmode="numeric" value="${outros}" onchange="updateSkill(${i}, 'outros', this.value)"></td>
            </tr>
        `;
    }).join('');
}

function updateSkill(index, tipo, valor) {
    pericias[index][tipo] = parseInt(valor) || 0;
    renderSkills();
    saveData();
}

function renderAttacks() {
    const container = document.getElementById('ataques-lista');
    
    if (gameState.attacks.length === 0) {
        container.innerHTML = '<p class="hint">Nenhum ataque cadastrado</p>';
        return;
    }
    
    container.innerHTML = gameState.attacks.map((a, i) => `
        <div class="ataque-card" onclick="toggleAtaque(${i})">
            <div class="ataque-header">
                <span class="ataque-nome">▼ ${a.nome}</span>
                <span class="ataque-dano">Dano: <span>${a.dano}</span> | Crítico: <span>${a.critico}</span></span>
            </div>
            <div class="ataque-bonus">🎲 Bônus: ${a.bonus}</div>
        </div>
    `).join('');
}

function toggleAtaque(index) {
    const ataque = gameState.attacks[index];
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + ataque.bonus;
    
    let result = '';
    if (roll === 20) result = '⭐ CRÍTICO!';
    else if (roll === 1) result = '❌ FALHA!';
    else if (total >= 15) result = '✓ SUCESSO';
    else result = '✗ FALHA';
    
    addMessage('dice', `⚔️ ${ataque.nome}: d20(${roll}) + ${ataque.bonus} = ${total} | ${result}`);
    saveData();
}

function addAtaque() {
    const nome = prompt('Nome do ataque:');
    if (!nome) return;
    
    const dano = prompt('Dano (ex: 2d6):', '1d6') || '1d6';
    const critico = prompt('Crítico (ex: x2):', 'x2') || 'x2';
    const bonus = parseInt(prompt('Bônus de Ataque:', '0')) || 0;
    
    gameState.attacks.push({ nome, dano, critico, bonus });
    renderAttacks();
    saveData();
}

function rollDice(sides) {
    const result = Math.floor(Math.random() * sides) + 1;
    
    showDiceModal(sides, result);
    
    let msg = '';
    if (result === 1) msg = '❌ FALHA CRÍTICA!';
    else if (result === sides) msg = '⭐ SUCESSO CRÍTICO!';
    else if (sides === 20 && result >= 18) msg = '🔥 Excelente!';
    else if (sides === 20 && result >= 10) msg = '✓ Sucesso';
    else if (sides === 20) msg = '✗ Falha';
    else msg = `Resultado: ${result}`;
    
    addMessage('dice', `🎲 d${sides}: ${result} - ${msg}`);
    saveData();
}

function showDiceModal(sides, result) {
    const modal = document.createElement('div');
    modal.className = 'dice-modal';
    
    let borderColor = '#A347FF';
    let resultText = '';
    
    if (sides === 20) {
        if (result === 20) {
            borderColor = '#f0c040';
            resultText = 'CRÍTICO!';
        } else if (result === 1) {
            borderColor = '#e74c3c';
            resultText = 'FALHA CRÍTICA!';
        }
    }
    
    modal.innerHTML = `
        <div class="dice-modal-content" style="border-color: ${borderColor}">
            <div class="dice-icon">🎲</div>
            <div class="dice-sides">d${sides}</div>
            <div class="dice-result" style="color: ${borderColor}">${result}</div>
            ${resultText ? `<div class="dice-text">${resultText}</div>` : ''}
        </div>
    `;
    
    modal.onclick = () => modal.remove();
    document.body.appendChild(modal);
    
    setTimeout(() => modal.remove(), 3000);
}

function rollTest() {
    const attr = prompt('Atributo (for/agi/int/pre/vig):', 'for').toLowerCase();
    const attrs = gameState.personagem.atributos;
    const val = parseInt(attrs[attr]) || 0;
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + val;
    
    let result = '';
    if (roll === 20) result = '⭐ CRÍTICO - SUCESSO!';
    else if (roll === 1) result = '❌ CRÍTICO - FALHA!';
    else if (total >= 15) result = '✓ SUCESSO!';
    else result = '✗ FALHA!';
    
    const nomes = { for: 'Força', agi: 'Agilidade', int: 'Intelecto', pre: 'Presença', vig: 'Vigor' };
    
    addMessage('dice', `🎯 ${nomes[attr] || attr}: d20(${roll}) + ${val} = ${total} | ${result}`);
    saveData();
}

function renderMissions() {
    const container = document.getElementById('missao-lista');
    if (gameState.missoes.length === 0) {
        container.innerHTML = '<p class="hint">Nenhuma missão</p>';
        return;
    }
    container.innerHTML = gameState.missoes.map(m => `
        <div class="missao-item">
            <input type="checkbox" onchange="toggleMission(${gameState.missoes.indexOf(m)}, this.checked)">
            <span class="missao-nome">${m.nome}</span>
            <span class="missao-status">${m.resumo}</span>
        </div>
    `).join('');
}

function toggleMission(index, checked) {
    gameState.missoes[index].resumo = checked ? 'Concluída' : 'Em andamento';
    renderMissions();
    saveData();
}

function addMission() {
    const nome = prompt('Nome da missão:');
    if (nome) {
        gameState.missoes.push({ nome, resumo: 'Em andamento' });
        renderMissions();
        saveData();
    }
}

function renderInventory() {
    const container = document.getElementById('inventario-lista');
    const peso = gameState.inventario.reduce((acc, item) => acc + ((parseFloat(item.peso) || 0) * (parseInt(item.qtd) || 0)), 0);
    const forca = parseInt(gameState.personagem.atributos.for) || 1;
    const capacidade = forca * 5;
    
    document.getElementById('peso-total').textContent = peso.toFixed(1);
    document.getElementById('capacidade').textContent = capacidade;
    
    if (gameState.inventario.length === 0) {
        container.innerHTML = '<p class="hint">Inventário vazio</p>';
        return;
    }
    
    container.innerHTML = gameState.inventario.map((item, i) => `
        <div class="item-row">
            <span class="item-nome">${item.nome}</span>
            <input type="number" class="item-qtd" value="${item.qtd}" min="0" onchange="updateItem(${i}, this.value)">
            <span class="item-peso">${((parseFloat(item.peso) || 0) * (parseInt(item.qtd) || 0)).toFixed(1)} kg</span>
        </div>
    `).join('');
}

function addItem() {
    const nome = prompt('Nome do item:');
    if (!nome) return;
    const peso = parseFloat(prompt('Peso (kg):', '0.5')) || 0;
    const qtd = parseInt(prompt('Quantidade:', '1')) || 1;
    gameState.inventario.push({ nome, peso, qtd });
    renderInventory();
    saveData();
}

function updateItem(index, qtd) {
    const q = parseInt(qtd);
    if (q <= 0) {
        gameState.inventario.splice(index, 1);
    } else {
        gameState.inventario[index].qtd = q;
    }
    renderInventory();
    saveData();
}

function addRitual() {
    alert('Funcionalidade de rituais em desenvolvimento');
}

function sendMessage() {
    const input = document.getElementById('userMessage');
    const msg = input.value.trim();
    if (!msg) return;
    
    addMessage('user', msg);
    input.value = '';
    
    if (!config.apiKey) {
        addMessage('system', '⚠️ Configure a API Key!');
        return;
    }
    
    const loading = addMessage('system', '🤔 Pensando...');
    
    sendToAI(buildContext(), msg)
        .then(response => {
            loading.remove();
            addMessage('system', response);
            gameState.historico.push({ role: 'user', content: msg });
            gameState.historico.push({ role: 'assistant', content: response });
            if (gameState.historico.length > 40) gameState.historico = gameState.historico.slice(-40);
            saveData();
        })
        .catch(err => {
            loading.remove();
            addMessage('system', '❌ Erro: ' + err.message);
        });
}

function buildContext() {
    const p = gameState.personagem;
    const e = gameState.estado;
    return `Você é o Oráculo, Mestre de RPG de Ordem Paranormal. Responda em português, com clima de horror!

=== PERSONAGEM ===
Nome: ${p.nome || 'Não criado'}
Origem: ${p.origem || 'Não definida'}
Classe: ${p.classe || 'Não definida'}
Atributos: FOR ${parseInt(p.atributos.for)||0}, AGI ${parseInt(p.atributos.agi)||0}, INT ${parseInt(p.atributos.int)||0}, PRE ${parseInt(p.atributos.pre)||0}, VIG ${parseInt(p.atributos.vig)||0}

=== ESTADO ===
PV: ${parseInt(e.pv)||0}/${parseInt(e.pvMax)||20} | SAN: ${parseInt(e.san)||0}/${parseInt(e.sanMax)||20} | PE: ${parseInt(e.pe)||0}/${parseInt(e.peMax)||6} | NEX: ${parseInt(e.nex)||0}%

Responda ao jogador agora!`;
}

async function sendToAI(context, msg) {
    try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: 'minimax/minimax-m2.5',
                messages: [
                    { role: 'system', content: context },
                    { role: 'user', content: msg }
                ],
                max_tokens: 1000
            })
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error?.message || `HTTP ${res.status}`);
        }
        
        const data = await res.json();
        if (!data.choices || !data.choices[0]) {
            throw new Error('Resposta inválida da API');
        }
        return data.choices[0].message.content;
    } catch (err) {
        throw new Error('Erro: ' + err.message);
    }
}

function addMessage(type, content) {
    const div = document.getElementById('messages');
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.innerHTML = content;
    div.appendChild(msg);
    div.scrollTop = div.scrollHeight;
    return msg;
}

function updateDriveStatus() {
    const el = document.getElementById('drive-status');
    if (oauthAccessToken) {
        el.textContent = '✅ Conectado';
        el.className = 'hint connected';
    } else {
        el.textContent = 'Drive desconectado';
        el.className = 'hint disconnected';
    }
}

async function initDrive() {
    const saved = localStorage.getItem('oauthToken');
    if (saved) {
        oauthAccessToken = saved;
        updateDriveStatus();
        alert('✅ Já conectado!');
        return;
    }
    
    if (!window.google || !window.google.accounts) {
        await new Promise(r => {
            const s = document.createElement('script');
            s.src = 'https://accounts.google.com/gsi/client';
            s.onload = r;
            document.head.appendChild(s);
        });
    }
    
    window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (resp) => {
            if (resp.access_token) {
                oauthAccessToken = resp.access_token;
                localStorage.setItem('oauthToken', oauthAccessToken);
                updateDriveStatus();
                alert('✅ Conectado ao Google Drive!');
            }
        }
    }).requestAccessToken({ prompt: 'consent' });
}

async function saveAllToDrive() {
    if (!oauthAccessToken) { await initDrive(); await new Promise(r => setTimeout(r, 2000)); }
    if (!oauthAccessToken) { alert('❌ Não conectado!'); return; }
    
    const data = { gameState, pericias, timestamp: Date.now() };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify({ name: 'ordemparanormal.json', mimeType: 'application/json' })], { type: 'application/json' }));
    form.append('file', blob);
    
    try {
        const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: { Authorization: `Bearer ${oauthAccessToken}` },
            body: form
        });
        if (res.ok) alert('✅ Salvo no Drive!');
        else alert('❌ Erro ao salvar');
    } catch (e) { alert('❌ Erro: ' + e.message); }
}

async function loadAllFromDrive() {
    if (!oauthAccessToken) { await initDrive(); await new Promise(r => setTimeout(r, 2000)); }
    if (!oauthAccessToken) { alert('❌ Não conectado!'); return; }
    
    try {
        const res = await fetch('https://www.googleapis.com/drive/v3/files?q=name="ordemparanormal.json"', {
            headers: { Authorization: `Bearer ${oauthAccessToken}` }
        });
        const data = await res.json();
        
        if (data.files && data.files.length > 0) {
            const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${data.files[0].id}?alt=media`, {
                headers: { Authorization: `Bearer ${oauthAccessToken}` }
            });
            const loaded = await fileRes.json();
            
            if (loaded.gameState) {
                gameState = loaded.gameState;
                if (loaded.pericias) Object.assign(pericias, loaded.pericias);
                saveData();
                renderAll();
                alert('✅ Jogo carregado!');
            }
        } else {
            alert('Nenhum save encontrado');
        }
    } catch (e) { alert('❌ Erro: ' + e.message); }
}

function newGame() {
    if (confirm('Novo jogo? Todo progresso será perdido!')) {
        gameState = {
            personagem: { nome: '', origem: '', classe: '', atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 1 }, proficiencias: '' },
            estado: { pv: 20, pvMax: 20, pe: 6, peMax: 6, san: 20, sanMax: 20, nex: 5, defesaEquip: 0 },
            attacks: [], inventario: [], descricao: { aparencia: '', personalidade: '', historia: '', anotacoes: '' },
            missoes: [], historico: []
        };
        pericias.forEach(p => { p.treino = 0; p.outros = 0; });
        renderAll();
        document.getElementById('messages').innerHTML = '<div class="message system"><strong>Oráculo:</strong> Um novo jogo começa! Me conta, você já tem um personagem criado?</div>';
        saveData();
    }
}

function saveData() {
    localStorage.setItem('op_rpg_game', JSON.stringify(gameState));
    localStorage.setItem('op_pericias', JSON.stringify(pericias));
}

function loadData() {
    const saved = localStorage.getItem('op_rpg_game');
    if (saved) {
        gameState = JSON.parse(saved);
        if (!gameState.estado) gameState.estado = { pv: 20, pvMax: 20, pe: 6, peMax: 6, san: 20, sanMax: 20, nex: 5, defesaEquip: 0 };
        if (!gameState.personagem) gameState.personagem = { nome: '', origem: '', classe: '', atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 1 }, proficiencias: '' };
        if (!gameState.personagem.atributos) gameState.personagem.atributos = { agi: 1, for: 1, int: 1, pre: 1, vig: 1 };
    }
    
    const savedPericias = localStorage.getItem('op_pericias');
    if (savedPericias) {
        const loaded = JSON.parse(savedPericias);
        loaded.forEach((p, i) => {
            if (pericias[i]) {
                pericias[i].treino = p.treino;
                pericias[i].outros = p.outros;
            }
        });
    }
}

function loadConfig() {
    const saved = localStorage.getItem('op_rpg_config');
    if (saved) config = JSON.parse(saved);
}

// ====================
// DADOS DO JOGO
// ====================

const origens = [
    { nome: 'Acadêmico', desc: 'Formação em universidade. Bônus: Ciências +5, Investigação +5, Ocultismo +5. Você sabe investigar o paranormal academicamente.' },
    { nome: 'Agente de Saúde', desc: 'Médico, enfermeiro ou paramédico. Bônus: Medicina +5, Diplomacia +5. Você trata tanto o corpo quanto a mente.' },
    { nome: 'Artista', desc: 'Ator, músico ou artista plástico. Bônus: Artes +5, Enganação +5, Intuição +5. Você interpreta e entende emoções.' },
    { nome: 'Atleta', desc: 'Atleta profissional ou amador dedicado. Bônus: Atletismo +5, Luta +5, Iniciativa +5. Seu corpo é sua arma.' },
    { nome: 'Criminoso', desc: 'Passado no mundo do crime. Bônus: Crime +5, Furtividade +5, Intimidação +5. Você sabe como trabalhar nas sombras.' },
    { nome: 'Detetive', desc: 'Investigador particular ou policial. Bônus: Investigação +5, Percepção +5, Intuição +5. Você encontra o que outros perdem.' },
    { nome: 'Engenheiro', desc: 'Formação técnica ou arquitetura. Bônus: Tecnologia +5, Profissão +5. Você conserta e cria soluções.' },
    { nome: 'Executive', desc: 'Executivo, advogado ou político. Bônus: Diplomacia +5, Crime +5, Persuasão +5. Você comanda e influencia.' },
    { nome: 'Faz-tudo', desc: 'Mão de obra geral, mecânico. Bônus: Profissão +5, Crime +5, Tática +5. Você resolve qualquer problema prático.' },
    { nome: 'Gambiarra', desc: 'Faz tudo com improvisos criativos. Bônus: Tecnologia +5, Profissão +5, Crime +5. Soluções engenhosas para qualquer problema.' },
    { nome: 'Investigador', desc: 'Jornalista ou blogger. Bônus: Investigação +5, Atualidades +5, Intuição +5. Você pesquisa e descobre verdades.' },
    { nome: 'Lenda Urbana', desc: 'Acredita em conspirações e monstros. Bônus: Ocultismo +5, Intuição +5, Sobrevivência +5. Você já viu coisas que não deveria.' },
    { nome: 'Médium', desc: 'Sensitivo ou canalizador. Bônus: Ocultismo +5, Religião +5, Intuição +10. Você percebe o que outros não veem.' },
    { nome: 'Militar', desc: 'Ex-membro das Forças Armadas. Bônus: Tática +5, Pontaria +5, Atletismo +5. Treinado para combate e disciplina.' },
    { nome: 'Motorista', desc: 'Motorista profissional ou piloto. Bônus: Pilotagem +5, Crime +5, Atletismo +5. Você vive nas estradas.' },
    { nome: 'Religioso', desc: 'Padre, padre, monge ou devoto. Bônus: Religião +10, Ocultismo +5, Vontade +5. Sua fé é sua proteção.' },
    { nome: 'Reporter', desc: 'Jornalista investigativo. Bônus: Investigação +5, Atualidades +5, Crime +5. Você conta a verdade ao mundo.' },
    { nome: 'Tiete', desc: 'Fã obsessivo de algo específico. Bônus: Profissão +5, Crime +5, Atualidades +5. Conhecimento profundo de um tema.' },
    { nome: 'Triz', desc: 'Gêmeo com conexão especial. Bônus: Intuição +5, Ocultismo +5. Sabe quando o outro está em perigo.' },
    { nome: 'Uuid', desc: 'Sobrevivente de incidente inexplicável. Bônus: Vontade +5, Sanidade +5. "Eu estava lá quando tudo começou."' }
];

const classes = [
    { nome: 'Combatente', desc: 'Especialista em combate e combate. PV: +8 por nível. Perícias treinadas: Luta, Atletismo, Pontaria, Intimidação, Fortitude. Armaduras médias e pesadas. Armas de fogo e brancas.' },
    { nome: 'Escriba', desc: 'Especialista em conhecimento oculto. Sanidade +4 por nível. Perícias treinadas: Ocultismo, Religião, Investigação, Ciências, Intuição. Não usa armaduras. Rituais.' },
    { nome: 'Instrumentista', desc: 'Músico que canaliza energia. PE +2 por nível. Perícias treinadas: Artes, Ocultismo, Percepção, Diplomacia, Vontade. Não usa armaduras. Magias musicais.' },
    { nome: 'Ocultista', desc: 'Praticante de artes ocultas. Sanidade +6, PE +2 por nível. Perícias treinadas: Ocultismo, Religião, Crime, Enganação, Vontade. Armaduras leves. Rituais.' },
    { nome: 'Profissional', desc: 'Especialista em sua área. NEX +2% por nível. Perícias treinadas: Profissão (especialidade), Crime, Diplomacia, Investigação, Tática. Armaduras leves.' }
];

const rituais = [
    { nome: 'Abraçar a Escuridão', nivel: 1, tipo: 'Defesa', desc: 'Reduz dano de ataques de criaturas das Trevas.' },
    { nome: 'Acalentar a Mente', nivel: 1, tipo: 'Sanidade', desc: 'Recupera 1d6 de SAN do alvo.' },
    { nome: 'Ajudante do Hog', nivel: 2, tipo: 'Proteção', desc: 'Invoca ajuda invisível por uma cena.' },
    { nome: 'Amaldiçoar', nivel: 1, tipo: 'Ataque', desc: 'Causa -1d6 em testes do alvo por uma cena.' },
    { nome: 'Ancoragem', nivel: 2, tipo: 'Resistência', desc: '+2 em testes de Vontade por uma cena.' },
    { nome: 'Augúrio', nivel: 1, tipo: 'Informação', desc: 'Recebe uma visão do futuro próximo.' },
    { nome: 'Benção', nivel: 1, tipo: 'Defesa', desc: '+1d6 em testes de defesa contra criaturas das Trevas.' },
    { nome: 'Campo de Força', nivel: 3, tipo: 'Defesa', desc: 'Absorve 2d6 pontos de dano por uma cena.' },
    { nome: 'Canalizar Energia', nivel: 1, tipo: 'Ataque', desc: 'Causa 2d6 de dano em criatura das Trevas.' },
    { nome: 'Carga', nivel: 3, tipo: 'Força', desc: 'Ganha +2 em FOR por uma cena.' },
    { nome: 'Comunhão', nivel: 3, tipo: 'Informação', desc: 'Pode fazer 3 perguntas a uma entidade.' },
    { nome: 'Comunicar', nivel: 1, tipo: 'Informação', desc: 'Comunica-se com espíritos ou fantasmas.' },
    { nome: 'Consagrar', nivel: 2, tipo: 'Proteção', desc: 'Área se torna impura para criaturas das Trevas.' },
    { nome: 'Curar Ferimentos', nivel: 1, tipo: 'Cura', desc: 'Cura 2d6 de PV de um aliado.' },
    { nome: 'Curar Trauma', nivel: 2, tipo: 'Sanidade', desc: 'Recupera 2d6 de SAN do alvo.' },
    { nome: 'Detectar Amença', nivel: 1, tipo: 'Informação', desc: 'Percebe presençasHostis em 20m.' },
    { nome: 'Enfeitiçar', nivel: 2, tipo: 'Controle', desc: 'Controla ações de um humano por uma cena.' },
    { nome: 'Escudo', nivel: 1, tipo: 'Defesa', desc: '+2 na Defesa por uma cena.' },
    { nome: 'Escudo de Fé', nivel: 2, tipo: 'Defesa', desc: '+4 na Defesa contra criaturas das Trevas.' },
    { nome: 'Força do Urso', nivel: 2, tipo: 'Força', desc: '+1d6 em testes de FOR e Luta por uma cena.' },
    { nome: 'Fortuna', nivel: 2, tipo: 'Sorte', desc: 'Rola novamente um teste falho.' },
    { nome: 'Ira', nivel: 2, tipo: 'Ataque', desc: 'Causa 3d6 de dano em criaturas das Trevas.' },
    { nome: 'Intoxicação', nivel: 3, tipo: 'Ataque', desc: 'Envenena o alvo com dano progressivo.' },
    { nome: 'Inversão', nivel: 3, tipo: 'Controle', desc: 'Inverte a situação: ferido causa dano.' },
    { nome: 'Julgar', nivel: 2, tipo: 'Ataque', desc: 'Causa 1d6 de SAN em criatura das Trevas.' },
    { nome: 'Lamento', nivel: 2, tipo: 'Ataque', desc: 'Causa 1d6 de SAN em todos na área.' },
    { nome: 'Luz', nivel: 1, tipo: 'Proteção', desc: 'Cria fonte de luz que afasta criaturas das Trevas.' },
    { nome: 'Maré', nivel: 2, tipo: 'Resistência', desc: '+2d6 em testes de Vontade contra medo.' },
    { nome: 'Medida Cautelar', nivel: 3, tipo: 'Defesa', desc: 'Pode evitar um ataque automaticamente.' },
    { nome: 'Muralha', nivel: 3, tipo: 'Defesa', desc: 'Cria barreira física 360 pontos.' },
    { nome: 'Palavra da Vida', nivel: 2, tipo: 'Cura', desc: 'Cura 4d6 de PV e remove Envenenado.' },
    { nome: 'Palavra de Cura', nivel: 1, tipo: 'Cura', desc: 'Cura 2d6+PE de PV de um aliado.' },
    { nome: 'Palavra Sagrada', nivel: 2, tipo: 'Ataque', desc: 'Causa 2d6 de SAN em criatura das Trevas.' },
    { nome: 'Possessão', nivel: 3, tipo: 'Controle', desc: 'Possui um humano por uma cena.' },
    { nome: 'Presença', nivel: 2, tipo: 'Controle', desc: 'Inspiração em aliados: +2d6 em testes por uma cena.' },
    { nome: 'Profecia', nivel: 3, tipo: 'Informação', desc: 'Visão clara do futuro em uma cena específica.' },
    { nome: 'Purificação', nivel: 1, tipo: 'Cura', desc: 'Remove condição Envenenado ou Doente.' },
    { nome: 'Raio', nivel: 2, tipo: 'Ataque', desc: 'Causa 2d6 de dano em alvo a distância.' },
    { nome: 'Ritual da Alma', nivel: 3, tipo: 'Especial', desc: 'Muda a SAN máxima permanentemente.' },
    { nome: 'Sangue', nivel: 3, tipo: 'Força', desc: 'Troca PV por bônus em testes de Luta.' },
    { nome: 'Santo', nivel: 2, tipo: 'Proteção', desc: 'Imune a efeitos de medo por uma cena.' },
    { nome: 'Sentidos', nivel: 1, tipo: 'Informação', desc: 'Percebe presença de entidades.' },
    { nome: 'Símbolo da Dor', nivel: 1, tipo: 'Ataque', desc: 'Causa 1d6 de SAN em todos na área.' },
    { nome: 'Terceira Visão', nivel: 1, tipo: 'Informação', desc: 'Revela passado oculto de objeto ou pessoa.' },
    { nome: 'Toque Feérico', nivel: 2, tipo: 'Cura', desc: 'Cura 2d6 de PV e 1d6 de SAN.' },
    { nome: 'Vela', nivel: 1, tipo: 'Proteção', desc: 'Cria área segura contra criaturas das Trevas.' },
    { nome: 'Visão do Destino', nivel: 3, tipo: 'Informação', desc: 'Vê destino do alvo.' }
];

// ====================
// AJUDA DE CRIAÇÃO
// ====================

function showCharCreationHelp(tipo) {
    let html = '';
    if (tipo === 'origens') {
        html = '<strong>ESCOLHA SUA ORIGEM</strong><br><small>Clique em uma origem para selecioná-la</small><br><br>';
        origens.forEach(o => {
            html += `<div class="help-item" onclick="selectOrigem('${o.nome}')">
                <strong>${o.nome}</strong><br>
                <small>${o.desc}</small>
            </div>`;
        });
    } else if (tipo === 'classes') {
        html = '<strong>ESCOLHA SUA CLASSE</strong><br><small>Clique em uma classe para selecioná-la</small><br><br>';
        classes.forEach(c => {
            html += `<div class="help-item" onclick="selectClasse('${c.nome}')">
                <strong>${c.nome}</strong><br>
                <small>${c.desc}</small>
            </div>`;
        });
    } else if (tipo === 'rituais') {
        html = '<strong>RITUAIS DISPONÍVEIS</strong><br><small>Escolha rituais conforme seu nível de Ocultismo</small><br><br>';
        rituais.forEach(r => {
            html += `<div class="help-item">
                <strong>${r.nome}</strong> <small>(Nível ${r.nivel}, ${r.tipo})</small><br>
                <small>${r.desc}</small>
            </div>`;
        });
    }
    
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.innerHTML = `<div class="help-content">${html}<button class="btn-add" onclick="this.closest('.help-modal').remove()">Fechar</button></div>`;
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
}

function selectOrigem(nome) {
    document.getElementById('charOrigin').value = nome;
    const origem = origens.find(o => o.nome === nome);
    if (origem) {
        addMessage('system', `✅ <strong>Origem escolhida: ${nome}</strong><br>${origem.desc}`);
    }
    document.querySelector('.help-modal')?.remove();
}

function selectClasse(nome) {
    document.getElementById('charClass').value = nome;
    const classe = classes.find(c => c.nome === nome);
    if (classe) {
        addMessage('system', `✅ <strong>Classe escolhida: ${nome}</strong><br>${classe.desc}`);
    }
    document.querySelector('.help-modal')?.remove();
}

// Adicionar estilos para o modal de ajuda
const helpStyles = document.createElement('style');
helpStyles.textContent = `
.help-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    overflow-y: auto;
    padding: 20px;
}
.help-content {
    background: #161616;
    border: 1px solid #A347FF;
    border-radius: 8px;
    padding: 20px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    width: 100%;
}
.help-item {
    padding: 10px;
    margin-bottom: 8px;
    background: #1a1a1a;
    border-left: 3px solid #A347FF;
    border-radius: 4px;
    cursor: pointer;
    color: #e0e0e0;
}
.help-item:hover {
    background: #222;
    border-left-color: #f0c040;
}
.help-item strong {
    color: #f0c040;
}
.help-item small {
    color: #888;
}
`;
document.head.appendChild(helpStyles);