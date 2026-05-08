// JavaScript - ESTILO C.R.I.S.

// ====================
// VARIÁVEIS GLOBAIS
// ====================

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

// Perícias
const pericias = [
    { nome: 'Acrobacia', attr: 'agi', carga: true, treino: 0, outros: 0 },
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

// ====================
// INICIALIZAÇÃO
// ====================

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

// ====================
// RENDERIZAÇÃO COMPLETA
// ====================

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

// ====================
// NAVEGAÇÃO
// ====================

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

function switchView(view) {
    document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    // Mobile view switching - can be expanded
}

// ====================
// PERSONAGEM
// ====================

function renderCharacter() {
    document.getElementById('charName').value = gameState.personagem.nome || '';
    document.getElementById('charOrigin').value = gameState.personagem.origem || '';
    document.getElementById('charClass').value = gameState.personagem.classe || '';
    document.getElementById('proficiencias').value = gameState.personagem.proficiencias || '';
}

function renderDescricao() {
    document.getElementById('desc-aparencia').value = gameState.descricao.aparencia || '';
    document.getElementById('desc-personalidade').value = gameState.descricao.personalidade || '';
    document.getElementById('desc-historia').value = gameState.descricao.historia || '';
    document.getElementById('desc-anotacoes').value = gameState.descricao.anotacoes || '';
}

// Auto-save on input change
document.addEventListener('input', function(e) {
    if (e.target.id === 'charName') gameState.personagem.nome = e.target.value;
    if (e.target.id === 'charOrigin') gameState.personagem.origem = e.target.value;
    if (e.target.id === 'charClass') gameState.personagem.classe = e.target.value;
    if (e.target.id === 'proficiencias') gameState.personagem.proficiencias = e.target.value;
    if (e.target.id === 'desc-aparencia') gameState.descricao.aparencia = e.target.value;
    if (e.target.id === 'desc-personalidade') gameState.descricao.personalidade = e.target.value;
    if (e.target.id === 'desc-historia') gameState.descricao.historia = e.target.value;
    if (e.target.id === 'desc-anotacoes') gameState.descricao.anotacoes = e.target.value;
    if (e.target.id === 'nex') gameState.estado.nex = parseInt(e.target.value) || 0;
    if (e.target.id === 'def-equip') gameState.estado.defesaEquip = parseInt(e.target.value) || 0;
    
    renderDefense();
    saveData();
});

// ====================
// ATRIBUTOS
// ====================

function renderAttributes() {
    const a = gameState.personagem.atributos;
    document.getElementById('attr-for').textContent = a.for;
    document.getElementById('attr-agi').textContent = a.agi;
    document.getElementById('attr-int').textContent = a.int;
    document.getElementById('attr-pre').textContent = a.pre;
    document.getElementById('attr-vig').textContent = a.vig;
    renderDefense();
    renderSkills();
}

function editAttr(attr) {
    const current = gameState.personagem.atributos[attr];
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

// ====================
// RECURSOS
// ====================

function renderResources() {
    const e = gameState.estado;
    
    // Inputs
    document.getElementById('pv-atual').value = e.pv;
    document.getElementById('pv-max').value = e.pvMax;
    document.getElementById('san-atual').value = e.san;
    document.getElementById('san-max').value = e.sanMax;
    document.getElementById('pe-atual').value = e.pe;
    document.getElementById('pe-max').value = e.peMax;
    document.getElementById('pe-turno').value = e.peMax;
    
    // Barras
    document.getElementById('pv-fill').style.width = (e.pv / e.pvMax * 100) + '%';
    document.getElementById('san-fill').style.width = (e.san / e.sanMax * 100) + '%';
    document.getElementById('pe-fill').style.width = (e.pe / e.peMax * 100) + '%';
    
    // Mobile
    document.getElementById('mobile-pv').textContent = `${e.pv}/${e.pvMax}`;
    document.getElementById('mobile-san').textContent = `${e.san}/${e.sanMax}`;
    document.getElementById('mobile-pe').textContent = `${e.pe}/${e.peMax}`;
}

function changeResource(type, amount) {
    const e = gameState.estado;
    const maxKey = type + 'Max';
    
    if (type === 'pv') e.pv = Math.max(0, Math.min(e.pv + amount, e.pvMax));
    if (type === 'san') e.san = Math.max(0, Math.min(e.san + amount, e.sanMax));
    if (type === 'pe') e.pe = Math.max(0, Math.min(e.pe + amount, e.peMax));
    
    renderResources();
    saveData();
}

// Resource input changes
document.getElementById('pv-atual').addEventListener('change', function() {
    gameState.estado.pv = parseInt(this.value) || 0;
    renderResources();
    saveData();
});
document.getElementById('pv-max').addEventListener('change', function() {
    gameState.estado.pvMax = parseInt(this.value) || 1;
    renderResources();
    saveData();
});
document.getElementById('san-atual').addEventListener('change', function() {
    gameState.estado.san = parseInt(this.value) || 0;
    renderResources();
    saveData();
});
document.getElementById('san-max').addEventListener('change', function() {
    gameState.estado.sanMax = parseInt(this.value) || 1;
    renderResources();
    saveData();
});
document.getElementById('pe-atual').addEventListener('change', function() {
    gameState.estado.pe = parseInt(this.value) || 0;
    renderResources();
    saveData();
});
document.getElementById('pe-max').addEventListener('change', function() {
    gameState.estado.peMax = parseInt(this.value) || 1;
    document.getElementById('pe-turno').value = gameState.estado.peMax;
    renderResources();
    saveData();
});

// ====================
// DEFESA
// ====================

function renderDefense() {
    const a = gameState.personagem.atributos;
    const eq = gameState.estado.defesaEquip;
    
    const defesa = 10 + a.agi + eq;
    const esquiva = 10 + a.agi;
    
    document.getElementById('defesa-total').textContent = defesa;
    document.getElementById('def-agi-val').textContent = a.agi;
    document.getElementById('def-equip').value = eq;
    document.getElementById('esquiva').textContent = esquiva;
}

// ====================
// PERÍCIAS
// ====================

function renderSkills() {
    const tbody = document.getElementById('pericias-body');
    const a = gameState.personagem.atributos;
    
    tbody.innerHTML = pericias.map(p => {
        const attrVal = a[p.attr];
        const treino = p.treino || 0;
        const outros = p.outros || 0;
        const total = attrVal + treino + outros;
        
        let sufixo = '';
        if (p.carga) sufixo += '+';
        if (p.treinado) sufixo += '*';
        
        const treinada = treino > 0;
        const rowClass = treinada ? 'style="color: var(--accent-green-bright)"' : '';
        const bonusClass = treinada ? 'class="pericia-bonus"' : '';
        
        return `
            <tr ${rowClass}>
                <td><span class="pericia-name ${treinada ? 'treinada' : ''}">${p.nome}</span><span class="pericia-suffix">${sufixo}</span></td>
                <td class="pericia-attr">(${p.attr.toUpperCase()})</td>
                <td ${bonusClass}>(${total})</td>
                <td><input type="number" min="0" max="5" value="${treino}" onchange="updateSkill(${pericias.indexOf(p)}, 'treino', this.value)"></td>
                <td><input type="number" min="0" value="${outros}" onchange="updateSkill(${pericias.indexOf(p)}, 'outros', this.value)"></td>
            </tr>
        `;
    }).join('');
}

function updateSkill(index, tipo, valor) {
    pericias[index][tipo] = parseInt(valor) || 0;
    renderSkills();
    saveData();
}

// ====================
// ATAQUES
// ====================

function renderAttacks() {
    const container = document.getElementById('ataques-lista');
    
    if (gameState.attacks.length === 0) {
        container.innerHTML = '<p class="hint">Nenhum ataque cadastrado</p>';
        return;
    }
    
    container.innerHTML = gameState.attacks.map((a, i) => `
        <div class="ataque-card">
            <div class="ataque-header" onclick="toggleAtaque(${i})">
                <span class="ataque-nome">${a.nome}</span>
                <span class="ataque-dano">Dano: <span>${a.dano}</span> | Crítico: <span>${a.critico}</span></span>
            </div>
        </div>
    `).join('');
}

function toggleAtaque(index) {
    // Simple toggle - could expand to show details
    alert(`${gameState.attacks[index].nome}: Bônus ${gameState.attacks[index].bonus}`);
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

function rollTest() {
    const attr = prompt('Atributo (for/agi/int/pre/vig):', 'for').toLowerCase();
    const attrs = gameState.personagem.atributos;
    const val = attrs[attr] || 1;
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + val;
    
    let result = '';
    if (roll === 20) result = '⭐ CRÍTICO - SUCESSO!';
    else if (roll === 1) result = '❌ CRÍTICO - FALHA!';
    else if (total >= 15) result = '✓ SUCESSO!';
    else result = '✗ FALHA!';
    
    const nomes = { for: 'Força', agi: 'Agilidade', int: 'Intelecto', pre: 'Presença', vig: 'Vigor' };
    
    addMessage('dice', `🎯 ${nomes[attr]}: d20(${roll}) + ${val} = ${total} | ${result}`);
    saveData();
}

// ====================
// MISSÕES
// ====================

function renderMissions() {
    const container = document.getElementById('missao-lista');
    if (gameState.missoes.length === 0) {
        container.innerHTML = '<p class="hint">Nenhuma missão</p>';
        return;
    }
    container.innerHTML = gameState.missoes.map(m => `
        <div class="missao-item">
            <div class="missao-nome">${m.nome}</div>
            <div class="missao-status">${m.resumo}</div>
        </div>
    `).join('');
}

function addMission() {
    const nome = prompt('Nome da missão:');
    if (nome) {
        gameState.missoes.push({ nome, resumo: 'Em andamento...' });
        renderMissions();
        saveData();
    }
}

// ====================
// INVENTÁRIO
// ====================

function renderInventory() {
    const container = document.getElementById('inventario-lista');
    const peso = gameState.inventario.reduce((acc, item) => acc + (item.peso * item.qtd), 0);
    const capacidade = gameState.personagem.atributos.for * 5;
    
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
            <span class="item-peso">${(item.peso * item.qtd).toFixed(1)} kg</span>
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

// ====================
// CHAT
// ====================

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
Atributos: FOR ${p.atributos.for}, AGI ${p.atributos.agi}, INT ${p.atributos.int}, PRE ${p.atributos.pre}, VIG ${p.atributos.vig}

=== ESTADO ===
PV: ${e.pv}/${e.pvMax} | SAN: ${e.san}/${e.sanMax} | PE: ${e.pe}/${e.peMax} | NEX: ${e.nex}%

Responda ao jogador agora!`;
}

async function sendToAI(context, msg) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: config.model,
            messages: [
                { role: 'system', content: context },
                { role: 'user', content: msg }
            ],
            max_tokens: 1000
        })
    });
    const data = await res.json();
    return data.choices[0].message.content;
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

// ====================
// GOOGLE DRIVE
// ====================

function updateDriveStatus() {
    const el = document.getElementById('drive-status');
    if (oauthAccessToken) {
        el.textContent = '✅ Conectado';
        el.style.color = 'var(--accent-green)';
    } else {
        el.textContent = 'Drive desconectado';
        el.style.color = 'var(--text-muted)';
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

// ====================
// SAVE/LOAD
// ====================

function saveData() {
    localStorage.setItem('op_rpg_game', JSON.stringify(gameState));
    localStorage.setItem('op_pericias', JSON.stringify(pericias));
}

function loadData() {
    const saved = localStorage.getItem('op_rpg_game');
    if (saved) gameState = JSON.parse(saved);
    
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