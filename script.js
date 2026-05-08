// JavaScript - Lógica do Site de RPG Solo

// ====================
// VARIÁVEIS GLOBAIS
// ====================

const GOOGLE_API_KEY = 'AIzaSyBSvtBBqUFYOo7fEyD3DCFv1fUBiA6ojjc';
const GOOGLE_CLIENT_ID = '522909916248-gj093l0ljk9p0mi378jnlgv9jnpkbhic.apps.googleusercontent.com';
const DRIVE_FOLDER_NAME = 'OrdemParanormalSolo';
let oauthAccessToken = null;

let config = {
    apiKey: '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',
    model: 'minimax/minimax-m2.5',
    driveConnected: false,
    fileId: null
};

let gameState = {
    personagem: {
        nome: '',
        origem: '',
        classe: '',
        atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 1 }
    },
    estado: {
        pv: 20, pvMax: 20,
        pe: 6, peMax: 6,
        san: 20, sanMax: 20,
        nex: 5
    },
    missoes: [],
    historico: [] // mensagens da conversa
};

// ====================
// INICIALIZAÇÃO
// ====================

window.onload = function() {
    loadData();
    loadConfig();
    renderCharacter();
    renderMissions();
    // Restore OAuth token if exists
    const savedToken = localStorage.getItem('oauthToken');
    if (savedToken) {
        oauthAccessToken = savedToken;
        config.driveConnected = true;
    }
};

// ====================
// NAVEGAÇÃO (TABS)
// ====================

function showTab(tabId) {
    // Esconde todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    // Remove active de todos os botões
    document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
    });
    // Mostra a aba clicada
    document.getElementById(tabId).classList.add('active');
    // Marca o botão como active
    event.target.classList.add('active');
}

// ====================
// PERSONAGEM
// ====================

function saveCharacter() {
    gameState.personagem = {
        nome: document.getElementById('charName').value,
        origem: document.getElementById('charOrigin').value,
        classe: document.getElementById('charClass').value,
        atributos: {
            agi: parseInt(document.getElementById('attrAgi').value),
            for: parseInt(document.getElementById('attrFor').value),
            int: parseInt(document.getElementById('attrInt').value),
            pre: parseInt(document.getElementById('attrPre').value),
            vig: parseInt(document.getElementById('attrVig').value)
        }
    };
    
    gameState.estado = {
        pv: parseInt(document.getElementById('pvAtual').value),
        pvMax: parseInt(document.getElementById('pvMax').value),
        pe: parseInt(document.getElementById('peAtual').value),
        peMax: parseInt(document.getElementById('peMax').value),
        san: parseInt(document.getElementById('sanAtual').value),
        sanMax: parseInt(document.getElementById('sanMax').value),
        nex: parseInt(document.getElementById('nex').value)
    };
    
    saveData();
    alert('Personagem salvo!');
}

function renderCharacter() {
    document.getElementById('charName').value = gameState.personagem.nome || '';
    document.getElementById('charOrigin').value = gameState.personagem.origem || '';
    document.getElementById('charClass').value = gameState.personagem.classe || '';
    document.getElementById('attrAgi').value = gameState.personagem.atributos.agi || 1;
    document.getElementById('attrFor').value = gameState.personagem.atributos.for || 1;
    document.getElementById('attrInt').value = gameState.personagem.atributos.int || 1;
    document.getElementById('attrPre').value = gameState.personagem.atributos.pre || 1;
    document.getElementById('attrVig').value = gameState.personagem.atributos.vig || 1;
    document.getElementById('pvAtual').value = gameState.estado.pv || 20;
    document.getElementById('pvMax').value = gameState.estado.pvMax || 20;
    document.getElementById('peAtual').value = gameState.estado.pe || 6;
    document.getElementById('peMax').value = gameState.estado.peMax || 6;
    document.getElementById('sanAtual').value = gameState.estado.san || 20;
    document.getElementById('sanMax').value = gameState.estado.sanMax || 20;
    document.getElementById('nex').value = gameState.estado.nex || 5;
}

// ====================
// DADOS (ROLL)
// ====================

function rollDice(sides) {
    const result = Math.floor(Math.random() * sides) + 1;
    let message = '';
    
    // Descrição do resultado
    if (result === 1) {
        message = '❌ FALHA CRÍTICA!';
    } else if (result === sides) {
        message = '⭐ SUCESSO CRÍTICO!';
    } else if (sides === 20 && result >= 18) {
        message = '🔥 Excelente!';
    } else if (sides === 20 && result >= 10) {
        message = '✓ Sucesso';
    } else if (sides === 20 && result < 10) {
        message = '✗ Falha';
    } else {
        message = `Resultado: ${result}`;
    }
    
    const diceMessage = `🎲 d${sides}: ${result} - ${message}`;
    addMessage('dice', diceMessage);
    saveData();
}

function rollTest() {
    const attr = document.getElementById('testAttr').value;
    const difficulty = parseInt(document.getElementById('testDificulty').value) || 15;
    const attrValue = gameState.personagem.atributos[attr];
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + attrValue;
    
    let result;
    if (roll === 20) result = '⭐ CRÍTICO - SUCESSO!';
    else if (roll === 1) result = '❌ CRÍTICO - FALHA!';
    else if (total >= difficulty) result = '✓ SUCESSO!';
    else result = '✗ FALHA!';
    
    const attrName = {
        agi: 'Agilidade',
        for: 'Força',
        int: 'Intelecto',
        pre: 'Presença',
        vig: 'Vigor'
    };
    
    const message = `🎯 Teste de ${attrName[attr]} (${attrValue}): d20(${roll}) + ${attrValue} = ${total} vs DT ${difficulty} - ${result}`;
    addMessage('dice', message);
    saveData();
}

function rollAttack() {
    const weapon = document.getElementById('weaponName').value || 'Arma';
    const damage = document.getElementById('weaponDamage').value || '1d6';
    
    // Simula rolar o dano
    let diceMatch = damage.match(/(\d+)d(\d+)([+-]\d+)?/);
    let totalDamage = 0;
    let rolls = [];
    
    if (diceMatch) {
        const numDice = parseInt(diceMatch[1]);
        const numSides = parseInt(diceMatch[2]);
        const modifier = diceMatch[3] ? parseInt(diceMatch[3]) : 0;
        
        for (let i = 0; i < numDice; i++) {
            let roll = Math.floor(Math.random() * numSides) + 1;
            rolls.push(roll);
            totalDamage += roll;
        }
        totalDamage += modifier;
    } else {
        totalDamage = damage;
    }
    
    const hitRoll = Math.floor(Math.random() * 20) + 1;
    const attack = hitRoll + gameState.personagem.atributos.for;
    
    let result;
    if (hitRoll === 20) result = '⭐ CRÍTICO! Dano dobrado!';
    else if (hitRoll === 1) result = '❌ FALHA CRÍTICA!';
    else if (attack >= 15) result = '✓ ACERTO!';
    else result = '✗ ERROU!';
    
    const message = `⚔️ ${weapon}: Ataque d20(${hitRoll}) + ${gameState.personagem.atributos.for} = ${attack} - ${result}\nDano: ${damage} = ${totalDamage}`;
    addMessage('dice', message);
    saveData();
}

// ====================
// CRIAÇÃO DE PERSONAGEM
// ====================

function startCharacterCreation() {
    showTab('chat');
    const creationPrompt = `Você é um Mestre de RPG de Ordem Paranormal. Ajude o jogador a criar um personagem. Faça PERGUNTAS uma de cada vez para descobrir:
1. Qual o nome do personagem?
2. Qual a origem? (Acadêmico, Agente de Saúde, Atleta, Combatente, Criminal, Desgarrado, Estudante, Investigador, Médico, Militar, Ocultista, Policial, Religioso, Veterano)
3. Qual a classe? (Combatente, Especialista, Ocultista)
4. Quais são os atributos? (Distribua 15 pontos entre AGI, FOR, INT, PRE, VIG - começando com 1 em cada)
5. Quais são as perícias?
6. Quais são os equipamentos iniciais?
7. Qual a história do personagem?

Espere a resposta do jogador antes de fazer a próxima pergunta. Seja entusiasmado e criativo!`;
    
    addMessage('system', '🤖 Vamos criar seu personagem! Responda às perguntas do Oráculo.');
    
    // Envia o prompt de criação
    if (!config.apiKey) {
        addMessage('system', '⚠️ Configure sua API Key na aba Config primeiro!');
        return;
    }
    
    const loadingMsg = addMessage('system', '🤔 O Oráculo está preparando as perguntas...');
    
    fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
            'HTTP-Referer': 'https://ordemparanormal-solo.netlify.app',
            'X-Title': 'Ordem Paranormal Solo'
        },
        body: JSON.stringify({
            model: config.model,
            messages: [
                { role: 'system', content: creationPrompt },
                { role: 'user', content: 'Quero criar um personagem!' }
            ],
            max_tokens: 800,
            temperature: 0.8
        })
    })
    .then(res => res.json())
    .then(data => {
        loadingMsg.remove();
        if (data.error) {
            addMessage('system', '❌ Erro: ' + data.error.message);
        } else {
            addMessage('system', data.choices[0].message.content);
        }
    })
    .catch(err => {
        loadingMsg.remove();
        addMessage('system', '❌ Erro: ' + err.message);
    });
}

// ====================
// MISSÕES
// ====================

function addMission() {
    const nome = prompt('Nome da missão:');
    if (nome) {
        gameState.missoes.push({
            nome: nome,
            resumo: 'Em andamento...',
            data: new Date().toLocaleDateString()
        });
        renderMissions();
        saveData();
    }
}

function renderMissions() {
    const container = document.getElementById('missionsList');
    if (gameState.missoes.length === 0) {
        container.innerHTML = '<p style="color: #888;">Nenhuma missão ainda. Clique em "Nova Missão" para começar!</p>';
    } else {
        container.innerHTML = gameState.missoes.map((m, i) => `
            <div class="mission-item">
                <h4>${i + 1}. ${m.nome}</h4>
                <p>${m.resumo}</p>
                <small style="color: #666;">${m.data}</small>
            </div>
        `).join('');
    }
}

// ====================
// CHAT COM IA
// ====================

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('userMessage');
    const message = input.value.trim();
    if (!message) return;
    
    // Adiciona mensagem do usuário
    addMessage('user', message);
    input.value = '';
    
    // Verifica se tem API key
    if (!config.apiKey) {
        addMessage('system', '⚠️ Configure sua API Key na aba Config primeiro!');
        return;
    }
    
    // Adiciona mensagem de "escrevendo..."
    const loadingMsg = addMessage('system', '🤔 O Oráculo está pensando...');
    
    try {
        // Prepara o contexto para a IA
        const context = buildContext();
        
        // Envia para a API
        const response = await sendToAI(context, message);
        
        // Remove mensagem de loading
        loadingMsg.remove();
        
        // Adiciona resposta da IA
        addMessage('system', response);
        
        // Atualiza contexto
        gameState.historico.push({ role: 'user', content: message });
        gameState.historico.push({ role: 'assistant', content: response });
        
        // Mantém apenas últimas 20 mensagens
        if (gameState.historico.length > 40) {
            gameState.historico = gameState.historico.slice(-40);
        }
        
        saveData();
        
    } catch (error) {
        loadingMsg.remove();
        addMessage('system', '❌ Erro ao comunicar com o Oráculo: ' + error.message);
    }
}

function buildContext() {
    const p = gameState.personagem;
    const e = gameState.estado;
    
    let context = `Você é o Oráculo, o Mestre de RPG de Ordem Paranormal. Você narrará histórias, interpretará personagens e controlará criaturas.\n\n`;
    
    context += `=== PERSONAGEM ===\n`;
    context += `Nome: ${p.nome || 'Não criado'}\n`;
    context += `Origem: ${p.origem || 'Não definida'}\n`;
    context += `Classe: ${p.classe || 'Não definida'}\n`;
    context += `Atributos: AGI ${p.atributos.agi}, FOR ${p.atributos.for}, INT ${p.atributos.int}, PRE ${p.atributos.pre}, VIG ${p.atributos.vig}\n\n`;
    
    context += `=== ESTADO ===\n`;
    context += `PV: ${e.pv}/${e.pvMax} | PE: ${e.pe}/${e.peMax} | SAN: ${e.san}/${e.sanMax} | NEX: ${e.nex}%\n\n`;
    
    if (gameState.missoes.length > 0) {
        context += `=== MISSÕES ===\n`;
        gameState.missoes.forEach(m => {
            context += `- ${m.nome}: ${m.resumo}\n`;
        });
        context += '\n';
    }
    
    context += `=== ÚLTIMAS CONVERSAS ===\n`;
    // Pegar últimas 10 mensagens do histórico
    const recentMessages = gameState.historico.slice(-10);
    recentMessages.forEach(msg => {
        const prefix = msg.role === 'user' ? 'Jogador' : 'Oráculo';
        context += `${prefix}: ${msg.content.substring(0, 200)}\n`;
    });
    
    context += '\nAgora responda ao jogador em português, sendo imersivo e mantendo o clima de horror!\n';
    
    return context;
}

async function sendToAI(context, userMessage) {
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    
    const messages = [
        { role: 'system', content: context },
        { role: 'user', content: userMessage }
    ];
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
            'HTTP-Referer': 'https://ordemparanormal-solo.netlify.app',
            'X-Title': 'Ordem Paranormal Solo'
        },
        body: JSON.stringify({
            model: config.model,
            messages: messages,
            max_tokens: 1000,
            temperature: 0.8
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro na API');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

function addMessage(type, content) {
    const messagesDiv = document.getElementById('messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.innerHTML = content;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return msgDiv;
}

// ====================
// CONFIG
// ====================

function saveConfig() {
    config.apiKey = document.getElementById('apiKey').value;
    config.model = document.getElementById('modelSelect').value;
    
    localStorage.setItem('op_rpg_config', JSON.stringify(config));
    alert('Configurações salvas!');
}

function loadConfig() {
    const saved = localStorage.getItem('op_rpg_config');
    if (saved) {
        config = JSON.parse(saved);
    }
    document.getElementById('apiKey').value = config.apiKey || '';
    document.getElementById('modelSelect').value = config.model || 'minimax/minimax-m2.5';
    updateDriveStatus();
}

// ====================
// GOOGLE DRIVE
// ====================

function updateDriveStatus() {
    const statusEl = document.getElementById('driveStatus');
    if (config.driveConnected) {
        statusEl.textContent = '✅ Conectado ao Google Drive';
        statusEl.style.color = '#4caf50';
    } else {
        statusEl.textContent = '❌ Não conectado';
        statusEl.style.color = '#888';
    }
}

async function initDrive() {
    // Use Google's official OAuth client
    if (!window.google || !window.google.accounts) {
        await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }
    
    // Configure and initiate OAuth
    const redirectUri = window.location.origin + '/';
    
    window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (response) => {
            if (response.access_token) {
                oauthAccessToken = response.access_token;
                localStorage.setItem('oauthToken', oauthAccessToken);
                config.driveConnected = true;
                saveConfig();
                updateDriveStatus();
                alert('✅ Conectado ao Google Drive!');
            }
        },
        error_callback: (error) => {
            alert('Erro ao conectar: ' + error.message);
        }
    }).requestAccessToken({ prompt: 'consent' });
}

async function saveToDrive() {
    if (!oauthAccessToken) {
        await initDrive();
        if (!oauthAccessToken) {
            alert('❌ Não conectado ao Google Drive');
            return;
        }
    }
    
    const data = JSON.stringify(gameState);
    const blob = new Blob([data], { type: 'application/json' });
    const fileName = `ordemparanormal_${new Date().toISOString().split('T')[0]}.json`;
    
    // Upload to root of Drive (simpler)
    const metadata = {
        name: fileName,
        mimeType: 'application/json'
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);
    
    try {
        const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${oauthAccessToken}`
            },
            body: form
        });
        
        if (response.ok) {
            const result = await response.json();
            config.fileId = result.id;
            saveConfig();
            alert('✅ Salvo no Google Drive! (ID: ' + result.id + ')');
        } else {
            const error = await response.text();
            alert('❌ Erro ao salvar: ' + error);
        }
} catch (err) {
        alert('❌ Erro: ' + err.message);
    }
}

async function getOrCreateFolder() {
    try {
        // Search for folder
        const searchResponse = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${DRIVE_FOLDER_NAME}'%20and%20mimeType='application/vnd.google-apps.folder'`, {
            headers: {
                'Authorization': `Bearer ${oauthAccessToken}`
            }
        });
        
        const searchData = await searchResponse.json();
        
        if (searchData.files && searchData.files.length > 0) {
            return searchData.files[0].id;
        }
        
        // Create folder
        const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${oauthAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: DRIVE_FOLDER_NAME,
                mimeType: 'application/vnd.google-apps.folder'
            })
        });
        
        const createData = await createResponse.json();
        return createData.id;
    } catch (err) {
        console.log('Folder error:', err);
        return null;
    }
}

// Cloud save using localStorage only (no external API)
let cloudSaveId = localStorage.getItem('cloudSaveId');

function saveToCloud() {
    const saveData = {
        game: gameState,
        timestamp: Date.now()
    };
    
    const saveString = btoa(JSON.stringify(saveData));
    cloudSaveId = 'op_' + Date.now();
    localStorage.setItem('cloudSaveId', cloudSaveId);
    localStorage.setItem('cloudSaveData', saveString);
    
    alert('✅ Salvo!\n\nEste save fica neste navegador.\nPara jogar em outro dispositivo, use Export/Import.');
}

function loadFromCloud() {
    const savedData = localStorage.getItem('cloudSaveData');
    if (savedData) {
        try {
            const decoded = JSON.parse(atob(savedData));
            gameState = decoded.game;
            saveData();
            renderCharacter();
            renderMissions();
            addMessage('system', '📥 Jogo carregado!');
            alert('✅ Jogo carregado!');
        } catch (e) {
            alert('Erro ao carregar. Use Importar.');
        }
    } else {
        alert('Nenhum save encontrado. Use Importar.');
    }
}

async function loadFromDrive() {
    if (!oauthAccessToken) {
        await initDrive();
        if (!oauthAccessToken) {
            alert('❌ Não conectado ao Google Drive');
            return;
        }
    }
    
    try {
        // Search for ordemparanormal files in root
        const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name%20contains%20'ordemparanormal'%20and%20mimeType%20=%20'application/json'%20and%20trashed%20=%20false&orderBy=modifiedTime desc`, {
            headers: {
                'Authorization': `Bearer ${oauthAccessToken}`
            }
        });
        
        const data = await response.json();
        alert('Debug: arquivos encontrados: ' + JSON.stringify(data).substring(0, 200));
        
        if (data.files && data.files.length > 0) {
            // Get most recent file
            const fileId = data.files[0].id;
            
            const fileResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                headers: {
'Authorization': `Bearer ${oauthAccessToken}`
                }
            });
            
            const gameData = await fileResponse.json();
            gameState = gameData;
            saveData();
            renderCharacter();
            renderMissions();
            
            // Refresh chat
            const chat = document.getElementById('chat');
            showTab('chat');
            addMessage('system', '📥 Jogo carregado do Google Drive!');
            alert('✅ Jogo carregado do Drive!');
        } else {
            alert('Nenhum arquivo encontrado no Drive.');
        }
    } catch (err) {
        alert('❌ Erro ao carregar: ' + err.message + '\n\nNota: A API key precisa ter acesso ao Drive API.');
    }
}

// ====================
// SALVAR/CARREGAR
// ====================

function saveData() {
    localStorage.setItem('op_rpg_game', JSON.stringify(gameState));
}

function loadData() {
    const saved = localStorage.getItem('op_rpg_game');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

function exportData() {
    const dataStr = JSON.stringify(gameState, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordemparanormal_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            gameState = data;
            saveData();
            renderCharacter();
            renderMissions();
            alert('Jogo importado com sucesso!');
        } catch (err) {
            alert('Erro ao importar arquivo!');
        }
    };
    reader.readAsText(file);
}

function copySave() {
    const saveData = JSON.stringify(gameState);
    navigator.clipboard.writeText(saveData).then(() => {
        alert('✅ Jogo copiado!\n\nAgora cole (envie) pelo WhatsApp/Telegram para outro dispositivo.');
    }).catch(() => {
        alert('Erro ao copiar. Use Exportar para baixar o arquivo.');
    });
}

function pasteSave() {
    const saveStr = prompt('Cole aqui o código do jogo que você copiou:');
    if (saveStr) {
        try {
            const data = JSON.parse(saveStr);
            gameState = data;
            saveData();
            renderCharacter();
            renderMissions();
            alert('✅ Jogo carregado!');
        } catch (err) {
            alert('Código inválido. Tente usar Importar com arquivo.');
        }
    }
}

function newGame() {
    if (confirm('Tem certeza? Isso vai apagar todo o progresso!')) {
        gameState = {
            personagem: { nome: '', origem: '', classe: '', atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 1 } },
            estado: { pv: 20, pvMax: 20, pe: 6, peMax: 6, san: 20, sanMax: 20, nex: 5 },
            missoes: [],
            historico: []
        };
        document.getElementById('messages').innerHTML = `
            <div class="message system">
                <strong>Oráculo:</strong> Um novo jogo começa! Me conta, você já tem um personagem criado ou quer criar um agora?
            </div>
        `;
        saveData();
        renderCharacter();
        renderMissions();
    }
}