import { Conversation } from "@elevenlabs/client";

const callButton = document.getElementById("callButton");
const callTitle = document.getElementById("callTitle");
const callSubtitle = document.getElementById("callSubtitle");

let conversation = null;
let isStarting = false;

async function startConversation() {
  if (conversation || isStarting) {
    return;
  }

  isStarting = true;
  callButton.disabled = true;
  callTitle.textContent = "Forbinder...";
  callSubtitle.textContent = "Tillad adgang til mikrofonen";

  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });

    conversation = await Conversation.startSession({
      agentId: "agent_1001knrswgqxfj39x0tdzh7dtq89",

      onConnect: () => {
        callButton.disabled = false;
        callButton.classList.add("active-call");
        callTitle.textContent = "Afslut samtalen";
        callSubtitle.textContent = "Samtalen er i gang";
      },

      onDisconnect: () => {
        resetButton();
      },

      onError: (error) => {
        console.error("ElevenLabs-fejl:", error);
        resetButton();
        alert("Samtalen kunne ikke startes. Prøv igen.");
      },

      onModeChange: ({ mode }) => {
        if (!conversation) return;

        callSubtitle.textContent =
          mode === "speaking" ? "Agenten taler" : "Agenten lytter";
      }
    });
  } catch (error) {
    console.error("Kunne ikke starte samtalen:", error);
    resetButton();

    if (error?.name === "NotAllowedError") {
      alert("Du skal give adgang til mikrofonen for at bruge agenten.");
    } else {
      alert("Samtalen kunne ikke startes. Prøv igen.");
    }
  } finally {
    isStarting = false;
  }
}

async function stopConversation() {
  if (!conversation) return;

  callButton.disabled = true;
  callTitle.textContent = "Afslutter...";

  try {
    await conversation.endSession();
  } catch (error) {
    console.error("Kunne ikke afslutte samtalen:", error);
  } finally {
    resetButton();
  }
}

function resetButton() {
  conversation = null;
  isStarting = false;
  callButton.disabled = false;
  callButton.classList.remove("active-call");
  callTitle.textContent = "Start samtale med agenten";
  callSubtitle.textContent = "Tryk for at begynde";
}

callButton.addEventListener("click", () => {
  if (conversation) {
    stopConversation();
  } else {
    startConversation();
  }
});
