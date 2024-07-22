function openChat() {
    document.getElementById("chatWindow").style.display = "flex";
  }

function closeChat() {
  document.getElementById("chatWindow").style.display = "none";
}

function selectChannel(channel) {
document.getElementById("chatHeader").innerText = `Chat - ${channel.charAt(0).toUpperCase() + channel.slice(1)}`;
document.getElementById("chatBody").innerHTML = `<!-- Conteúdo do chat para ${channel} vai aqui -->`;
}

function sendMessage() {
const message = document.getElementById("chatInput").value;
// Lógica para enviar a mensagem
document.getElementById("chatInput").value = '';
}

// Certifique-se de que a janela do chat está oculta ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("chatWindow").style.display = "none";
});

// Função para gerar botões de jogadores dinamicamente
document.getElementById("playerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const numPlayers = document.getElementById("numPlayers").value;
    const chatSidebar = document.getElementById("chatSidebar");
    chatSidebar.innerHTML = '<button onclick="selectChannel(\'general\')">General</button>';
    for (let i = 1; i <= numPlayers; i++) {
      const button = document.createElement("button");
      button.innerText = `Player ${i}`;
      button.onclick = function() { selectChannel(`player${i}`); };
      chatSidebar.appendChild(button);
    }
});

let open = false;
document.getElementById("chatButton").addEventListener("click", function() {
    if (!open) {
      openChat(); open = true;
    } else {
      closeChat(); open = false;
    }
});  
document.getElementById("closeChat").addEventListener("click", closeChat);
// document.getElementById("sendButton").addEventListener("click", sendMessage);
// document.getElementById("chatSidebar").addEventListener("click", selectChannel);