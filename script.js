// JavaScript - NOVO ESTILO C.R.I.S.

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
        nome: '',
        origem: '',
        classe: '',
        atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 1 },
        proficiencias: ''
    },
    estado: {
        pv: 20, pvMax: 20,
        pe: 6, peMax: 6,
        san: 20, sanMax: 20,
        nex: 5,
        defesaEquip: 0
    },
    attacks: [],
    habilidades: [],
    rituais: [],
    inventario: [],
    descricao: {
        aparencia: '',
        personalidade: '',
        historia: '',
        anotacoes: ''
    },
    missoes: [],
    historico: []
};

// Perícias do sistema
const pericias = [
    { nome: 'Acrobacia', attr: 'agi', carga: true },
    { nome: 'Adestramento', attr: 'pre', treinado: true },
    { nome: 'Artes', attr: 'pre', treinado: true },
    { nome: 'Atletismo', attr: 'for' },
    { nome: 'Atualidades', attr: 'int' },
    { nome: 'Ciências', attr: 'int', treinado: true },
    { nome: 'Crime', attr: 'agi', carga: true, treinado: true },
    { nome: 'Diplomacia', attr: 'pre' },
    { nome: 'Enganação', attr: 'pre' },
    { nome: 'Fortitude', attr: 'vig' },
    { nome: 'Furtividade', attr: 'agi', carga: true },
    { nome: 'Iniciativa', attr: 'agi' },
    { nome: 'Intimidação', attr: 'pre' },
    { nome: 'Intuição', attr: 'pre' },
    { nome: 'Investigação', attr: 'int' },
    { nome: 'Luta', attr: 'for' },
    { nome: 'Medicina', attr: 'int' },
    { nome: 'Ocultismo', attr: 'int', treinado: true },
    { nome: 'Percepção', attr: 'pre' },
    { nome: 'Pilotagem', attr: 'agi', treinado: true },
    { nome: 'Pontaria', attr: 'agi' },
    { nome: 'Profissão', attr: 'int', treinado: true },
    { nome: 'Reflexos', attr: 'agi' },
    { nome: 'Religião', attr: 'int', treinado: true },
    { nome: 'Sobrevivência', attr: 'vig' },
    { nome: 'Tática', attr: 'int', treinado: true },
    { nome: 'Tecnologia', attr: 'int', treinado: true },
    { nome: 'Vontade', attr: 'vig' }
];

// ====================
// INICIALIZAÇÃO
// ====================

window.onload = function() {
    loadData();
    loadConfig();
    renderAll();
    
    // OAuth token persistence
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
}

// ====================
// PERSONAGEM
// ====================

function renderCharacter() {
    document.getElementById('charName').value = gameState.personagem.nome || '';
    document.getElementById('charOrigin').value = gameState.personagem.origem || '';
    document.getElementById('charClass').value = gameState.personagem.classe || '';
    document.getElementById('proficiencias').value = gameState.personagem.proficiencias || '';
    
    // Descrição
    document.getElementById('descricao-aparencia').value = gameState.descricao.aparencia || '';
    document.getElementById('descricao-personalidade').value = gameState.descricao.personalidade || '';
    document.getElementById('descricao-historia').value = gameState.descricao.historia || '';
    document.getElementById('descricao-anotacoes').value = gameState.descricao.anotacoes || '';
}

function saveCharacter() {
    gameState.personagem.nome = document.getElementById('charName').value;
    gameState.personagem.origem = document.getElementById('charOrigin').value;
    gameState.personagem.classe = document.getElementById('charClass').value;
    gameState.personagem.proficiencias = document.getElementById('proficiencias').value;
    
    gameState.descricao.aparencia = document.getElementById('descricao-aparencia').value;
    gameState.descricao.personalidade = document.getElementById('descricao-personalidade').value;
    gameState.descricao.historia = document.getElementById('descricao-historia').value;
    gameState.descricao.anotacoes = document.getElementById('descricao-anotacoes').value;
    
    saveData();
}

// ====================
// ATRIBUTOS
// ====================

function renderAttributes() {
    const attrs = gameState.personagem.atributos;
    document.getElementById('attr-for').textContent = attrs.for;
    document.getElementById('attr-agi').textContent = attrs.agi;
    document.getElementById('attr-int').textContent = attrs.int;
    document.getElementById('attr-pre').textContent = attrs.pre;
    document.getElementById('attr-vig').textContent = attrs.vig;
    
    renderDefense();
}

function editAttr(attr) {
    const current = gameState.personagem.atributos[attr];
    const newVal = prompt(`Valor de ${attr.toUpperCase()} (1-5):`, current);
    if (newVal !== null) {
        const val = parseInt(newVal);
        if (val >= 1 && val <= 5) {
            gameState.personagem.atributos[attr] = val;
            renderAttributes();
            renderSkills();
            saveData();
        }
    }
}

// ====================
// RECURSOS
// ====================

function renderResources() {
    const e = gameState.estado;
    
    document.getElementById('pvAtual').value = e.pv;
    document.getElementById('pvMax').value = e.pvMax;
    document.getElementById('sanAtual').value = e.san;
    document.getElementById('sanMax').value = e.sanMax;
    document.getElementById('peAtual').value = e.pe;
    document.getElementById('peMax').value = e.peMax;
    document.getElementById('peMax2').value = e.peMax;
    document.getElementById('nex').value = e.nex;
    
    // Barras
    const pvPct = (e.pv / e.pvMax) * 100;
    const sanPct = (e.san / e.sanMax) * 100;
    const pePct = (e.pe / e.peMax) * 100;
    
    document.getElementById('pv-barra').style.width = pvPct + '%';
    document.getElementById('san-barra').style.width = sanPct + '%';
    document.getElementById('pe-barra').style.width = pePct + '%';
    
    // Mobile
    document.getElementById('mobile-pv').textContent = `${e.pv}/${e.pvMax}`;
    document.getElementById('mobile-san').textContent = `${e.san}/${e.sanMax}`;
    document.getElementById('mobile-pe').textContent = `${e.pe}/${e.peMax}`;
}

function changeResource(type, amount) {
    const e = gameState.estado;
    const maxKey = type + 'Max';
    
    if (type === 'pv') {
        e.pv = Math.max(0, Math.min(e.pv + amount, e.pvMax));
    } else if (type === 'san') {
        e.san = Math.max(0, Math.min(e.san + amount, e.sanMax));
    } else if (type === 'pe') {
        e.pe = Math.max(0, Math.min(e.pe + amount, e.peMax));
    }
    
    renderResources();
    saveData();
}

// ====================
// DEFESA
// ====================

function renderDefense() {
    const attrs = gameState.personagem.atributos;
    const equip = gameState.estado.defesaEquip;
    
    const defesa = 10 + attrs.agi + equip;
    const esquiva = 10 + attrs.agi;
    
    document.getElementById('defesa-total').textContent = defesa;
    document.getElementById('defesa-equip').value = equip;
    document.getElementById('def-agi').textContent = attrs.agi;
    document.getElementById('esquiva').textContent = esquiva;
    document.getElementById('bloqueio').textContent = '0';
}

document.getElementById('defesa-equip').addEventListener('change', function() {
    gameState.estado.defesaEquip = parseInt(this.value) || 0;
    renderDefense();
    saveData();
});

// ====================
// PERÍCIAS
// ====================

function renderSkills() {
    const tbody = document.getElementById('pericias-body');
    const attrs = gameState.personagem.atributos;
    
    tbody.innerHTML = pericias.map(p => {
        const attrValue = attrs[p.attr];
        const treino = p.treino || 0;
        const outros = p.outros || 0;
        const total = attrValue + treino + outros;
        
        let sufixo = '';
        if (p.carga) sufixo = '+';
        if (p.treinado) sufixo += '*';
        
        const isTreinada = treino > 0;
        const rowClass = isTreinada ? 'pericia-treinada' : '';
        
        return `
            <tr class="${rowClass}">
                <td>${p.nome} <small style="color: var(--text-muted)">${sufixo}</small></td>
                <td>(${p.attr.toUpperCase()})</td>
                <td>(${total})</td>
                <td><input type="number" min="0" max="5" value="${treino}" onchange="updateSkill('${p.nome}', 'treino', this.value)"></td>
                <td><input type="number" min="0" value="${outros}" onchange="updateSkill('${p.nome}', 'outros', this.value)"></td>
            </tr>
        `;
    }).join('');
}

function updateSkill(periciaNome, tipo, valor) {
    const pericia = pericias.find(p => p.nome === periciaNome);
    if (pericia) {
        pericia[tipo] = parseInt(valor) || 0;
        renderSkills();
        saveData();
    }
}

// ====================
// ATAQUES
// ====================

function renderAttacks() {
    const container = document.getElementById('ataques-lista');
    
    if (gameState.attacks.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Nenhum ataque cadastrado</p>';
        return;
    }
    
    container.innerHTML = gameState.attacks.map((a, i) => `
        <div class="ataque-card">
            <div class="ataque-header" onclick="toggleAtaque(${i})">
                <span class="ataque-nome">${a.nome}</span>
                <span class="ataque-dano">Dano: ${a.dano} | Crítico: ${a.critico}</span>
            </div>
            <div class="ataque-detalhes" id="ataque-${i}">
                <p><strong>Bônus de Ataque:</strong> ${a.bonus}</p>
                <p><strong>Tipo:</strong> ${a.tipo}</p>
                <p><strong>Alcance:</strong> ${a.alcance}</p>
                <p><strong>Propriedades:</strong> ${a.propriedades || 'Nenhuma'}</p>
                <button onclick="rollAttack('${a.nome}', '${a.dano}', ${a.bonus})" class="btn-add">🎲 Rolar Ataque</button>
            </div>
        </div>
    `).join('');
}

function toggleAtaque(index) {
    const el = document.getElementById(`ataque-${index}`);
    el.classList.toggle('show');
}

function addAtaque() {
    const nome = prompt('Nome do ataque:');
    if (!nome) return;
    
    const dano = prompt('Dano (ex: 2d6):', '1d6') || '1d6';
    const critico = prompt('Crítico (ex: x2):', 'x2') || 'x2';
    const bonus = parseInt(prompt('Bônus de Ataque:', '0')) || 0;
    const tipo = prompt('Tipo de dano:', 'Corte') || 'Corte';
    const alcance = prompt('Alcance:', 'Contato') || 'Contato';
    const propriedades = prompt('Propriedades:', '') || '';
    
    gameState.attacks.push({
        nome, dano, critico, bonus, tipo, alcance, propriedades
    });
    
    renderAttacks();
    saveData();
}

function rollAttack(nome, dano, bonus) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + bonus;
    
    // Parse dano
    const dadoMatch = dano.match(/(\d+)d(\d+)([+-]\d+)?/);
    let danoTotal = 0;
    if (dadoMatch) {
        const num = parseInt(dadoMatch[1]);
        const faces = parseInt(dadoMatch[2]);
        const mod = dadoMatch[3] ? parseInt(dadoMatch[3]) : 0;
        for (let i = 0; i < num; i++) {
            danoTotal += Math.floor(Math.random() * faces) + 1;
        }
        danoTotal += mod;
    }
    
    let resultado = '';
    if (roll === 20) {
        resultado = `⭐ CRÍTICO! Dano dobrado!`;
        danoTotal *= 2;
    } else if (roll === 1) {
        resultado = '❌ FALHA CRÍTICA!';
    } else if (total >= 15) {
        resultado = '✓ ACERTO!';
    } else {
        resultado = '✗ ERROU';
    }
    
    const msg = `⚔️ ${nome}: d20(${roll}) + ${bonus} = ${total} | Dano: ${dano} = ${danoTotal} | ${resultado}`;
    addMessage('dice', msg);
    saveData();
}

// ====================
// MISSÕES
// ====================

function renderMissions() {
    const container = document.getElementById('missions-list');
    if (gameState.missoes.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.8rem;">Nenhuma missão</p>';
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
        gameState.missoes.push({
            nome: nome,
            resumo: 'Em andamento...'
        });
        renderMissions();
        saveData();
    }
}

// ====================
// INVENTÁRIO
// ====================

function renderInventory() {
    const container = document.getElementById('inventario-lista');
    const pesoTotal = gameState.inventario.reduce((acc, item) => acc + (item.peso * item.qtd), 0);
    const capacidade = gameState.personagem.atributos.for * 5;
    
    document.getElementById('peso-total').textContent = pesoTotal;
    document.getElementById('capacidade').textContent = capacidade;
    
    if (gameState.inventario.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Inventário vazio</p>';
        return;
    }
    
    container.innerHTML = gameState.inventario.map((item, i) => `
        <div class="item-inventario">
            <span class="item-nome">${item.nome}</span>
            <input type="number" class="item-qtd" value="${item.qtd}" min="0" onchange="updateItem(${i}, 'qtd', this.value)">
            <span class="item-peso">${(item.peso * item.qtd).toFixed(1)} kg</span>
        </div>
    `).join('');
}

function addItem() {
    const nome = prompt('Nome do item:');
    if (!nome) return;
    
    const peso = parseFloat(prompt('Peso unitário (kg):', '0.5')) || 0;
    const qtd = parseInt(prompt('Quantidade:', '1')) || 1;
    
    gameState.inventario.push({ nome, peso, qtd });
    renderInventory();
    saveData();
}

function updateItem(index, campo, valor) {
    if (campo === 'qtd') {
        gameState.inventario[index].qtd = parseInt(valor) || 0;
        if (gameState.inventario[index].qtd === 0) {
            gameState.inventario.splice(index, 1);
        }
    }
    renderInventory();
    saveData();
}

// ====================
// NAVEGAÇÃO
// ====================

function showRightTab(tabId) {
    document.querySelectorAll('.tab-right').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content-right').forEach(t => t.classList.remove('active'));
    
    document.querySelector(`.tab-right[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

function switchMobileView(view) {
    // Em mobile, mostra apenas a view selecionada
    document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.mobile-nav-btn[data-view="${view}"]`).classList.add('active');
    
    // Aqui você pode implementar a lógica de mostrar/esconder colunas
    alert(`Navegando para: ${view}`);
}

// ====================
// CHAT
// ====================

function handleKeyPress(event) {
    if (event.key === 'Enter') sendMessage();
}

async function sendMessage() {
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
    
    try {
        const response = await sendToAI(buildContext(), msg);
        loading.remove();
        addMessage('system', response);
        
        gameState.historico.push({ role: 'user', content: msg });
        gameState.historico.push({ role: 'assistant', content: response });
        
        if (gameState.historico.length > 40) gameState.historico = gameState.historico.slice(-40);
        
        saveData();
    } catch (err) {
        loading.remove();
        addMessage('system', '❌ Erro: ' + err.message);
    }
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
// DADOS
// ====================

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
    const attr = prompt('Qual atributo? (for, agi, int, pre, vig)', 'for').toLowerCase();
    const attrs = gameState.personagem.atributos;
    const attrVal = attrs[attr] || 1;
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + attrVal;
    
    const nomes = { for: 'Força', agi: 'Agilidade', int: 'Intelecto', pre: 'Presença', vig: 'Vigor' };
    
    let result = '';
    if (roll === 20) result = '⭐ CRÍTICO - SUCESSO!';
    else if (roll === 1) result = '❌ CRÍTICO - FALHA!';
    else if (total >= 15) result = '✓ SUCESSO!';
    else result = '✗ FALHA!';
    
    addMessage('dice', `🎯 Teste de ${nomes[attr]}: d20(${roll}) + ${attrVal} = ${total} | ${result}`);
    saveData();
}

// ====================
// GOOGLE DRIVE
// ====================

function updateDriveStatus() {
    const el = document.getElementById('driveStatus');
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
    if (!oauthAccessToken) {
        await initDrive();
        await new Promise(r => setTimeout(r, 2000));
    }
    
    if (!oauthAccessToken) {
        alert('❌ Não conectado!');
        return;
    }
    
    const data = {
        gameState: gameState,
        timestamp: Date.now()
    };
    
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
    } catch (e) {
        alert('❌ Erro: ' + e.message);
    }
}

async function loadAllFromDrive() {
    if (!oauthAccessToken) {
        await initDrive();
        await new Promise(r => setTimeout(r, 2000));
    }
    
    if (!oauthAccessToken) {
        alert('❌ Não conectado!');
        return;
    }
    
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
                saveData();
                renderAll();
                alert('✅ Jogo carregado!');
            }
        } else {
            alert('Nenhum save encontrado');
        }
    } catch (e) {
        alert('❌ Erro: ' + e.message);
    }
}

function newGame() {
    if (confirm('Novo jogo? Todo progresso será perdido!')) {
        gameState = {
            personagem: { nome: '', origem: '', classe: '', atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 1 }, proficiencias: '' },
            estado: { pv: 20, pvMax: 20, pe: 6, peMax: 6, san: 20, sanMax: 20, nex: 5, defesaEquip: 0 },
            attacks: [],
            habilidades: [],
            rituais: [],
            inventario: [],
            descricao: { aparencia: '', personalidade: '', historia: '', anotacoes: '' },
            missoes: [],
            historico: []
        };
        
        // Reset pericias
        pericias.forEach(p => {
            p.treino = 0;
            p.outros = 0;
        });
        
        renderAll();
        document.getElementById('messages').innerHTML = '<div class="message system"><strong>Oráculo:</strong> Um novo jogo começa! Me conta, você já tem um personagem criado?</div>';
        saveData();
    }
}

function saveData() {
    localStorage.setItem('op_rpg_game', JSON.stringify(gameState));
}

function loadData() {
    const saved = localStorage.getItem('op_rpg_game');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

function loadConfig() {
    const saved = localStorage.getItem('op_rpg_config');
    if (saved) {
        config = JSON.parse(saved);
    }
    document.getElementById('modelSelect').value = config.model || 'minimax/minimax-m2.5';
}