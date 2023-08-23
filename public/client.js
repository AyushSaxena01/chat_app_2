const socket = io();

const usernameInput = document.getElementById("username");
const joinButton = document.getElementById("join-button");
const contactList = document.getElementById("contact-list");
const chatMessages = document.getElementById("messages");
const send = document.querySelector(".send-button");
const input = document.getElementById("input");
const ok = document.getElementById("ok");
const join = document.getElementById("join-button");

let username = "";

function emoji(input) {
  let emoji = {
    woah: "\u{1F62E}",
    hey: "\u{1F44B}",
    lol: "\u{1F602}",
    like: "\u{1F90D}",
    congratulations: "\u{1F389}",
    react: "\u{269B}",
  };

  let inputWords = input.split(" ");
  // console.log(inputWords);
  let convertedWords = inputWords.map((word) => {
    // return emoji[word.toLowerCase()] || word

    if (emoji[word.toLowerCase()]) {
      return emoji[word.toLowerCase()];
    } else {
      return word;
    }
  });
  // console.log(convertedWords);
  let text = convertedWords.join(" ");
  return text;
}

function help(Input) {
  document.getElementById("modal").style.display = "flex";
  send.disabled= true;
  input.value = "";
}

function random(Input) {
  let num = parseInt(Math.random() * 100);
  let newElement = document.createElement("li");
  newElement.textContent = "Your random number is : " + num;
  chatMessages.appendChild(newElement);
  input.value = "";
}

function clear(Input) {
  while (chatMessages.firstChild) {
    chatMessages.removeChild(chatMessages.firstChild);
  }
  input.value = "";
}

ok.addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
  send.disabled=false;
});

send.addEventListener("click", () => {

  if (usernameInput.value == "") {
    
    alert("Enter name first!");
  } else if (input.value == "") {
    
    alert("Enter text!");
  }
 
});

usernameInput.addEventListener('keydown',(e)=>{
  if(e.key === 'Enter'){
    join.click();
  }
})

joinButton.addEventListener("click", () => {
  const enteredUsername = usernameInput.value.trim();
  if (enteredUsername !== "") {
    username = enteredUsername;
    usernameInput.disabled = true;
    joinButton.disabled = true;
    socket.emit("user joined", username);
  }
});

joinButton.addEventListener("click", () => {
  if (usernameInput.value == "") {
    alert("Enter name first!");
  }
});

socket.on("user joined", (user) => {
  const li = document.createElement("li");
  li.textContent = user;
  contactList.appendChild(li);
});

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value == "/random") {
    random();
  } else if (input.value == "/help") {
    help();
  } else if (input.value == "/clear") {
    clear();
  } else if (input.value && username) {
    // socket.emit('chat message', { message: input.value });
    socket.emit("chat message", { message: emoji(input.value) });
    input.value = "";
  }
});

socket.on("chat message", (data) => {
  const li = document.createElement("li");
  if (data.username === username) {
    li.classList.add("sent-message");
  } else {
    li.classList.add("received-message");
  }
  li.textContent = `${data.username}: ${data.message}`;
  chatMessages.appendChild(li);
});
