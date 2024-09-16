// popup.js

const userInputField = document.getElementById("user-input")
const wordInputField = document.getElementById("word-input")
const toggleButton = document.getElementById("toggle");
let running

browser.storage.local.get('running').then(result => {

    let running = result.running !== false;

    if (running) {
        toggleButton.textContent = "On";
    } else {
        toggleButton.textContent = "Off";
    }
}).catch(error => {
    console.error("Error", error);
});

userInputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addUser(userInputField.value)
    }
});

wordInputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addWord(wordInputField.value)
    }
});

const settingsButton = document.getElementById('open-page');
settingsButton.addEventListener('click', () => {
    browser.tabs.create({ url: browser.runtime.getURL('settings.html') });
});

const addUserButton = document.getElementById('add-user');
 addUserButton.addEventListener('click', () => {
    addUser(userInputField.value)
    
    
 });

 const addWordButton = document.getElementById('add-word');
 addWordButton.addEventListener('click', () => {
    addWord(wordInputField.value)
 });

 
 toggleButton.addEventListener('click', () => { 
    toggle()
 });

function addUser(username) {
    browser.storage.local.get('blockedUsers', (result) => {
        newBlockedUsers = result.blockedUsers || []
        if (newBlockedUsers.includes(username) || username == "already blocked!"){
            userInputField.value = "already blocked!"
        }else{
            newBlockedUsers.push(username)
            browser.storage.local.set({blockedUsers : newBlockedUsers})
            window.close()
        }
        
    })
}

function addWord(word) {
    browser.storage.local.get(['blockedWords','blockedPatterns'], (data) => {
        
        
        let currentWords = data.blockedWords || []
        let currentPatterns = data.blockedPatterns || []  
        
        if(word !== "already blocked!"){
            if(word.startsWith("[EXACT]")){
                let pattern = word.split("[EXACT]")[1]
                if(currentPatterns.includes(pattern)){
                    wordInputField.value = "already blocked!"
                }else if(pattern !== "" && pattern !== " " && word !== null){
                    currentPatterns.push(pattern)
                    browser.storage.local.set({blockedPatterns : currentPatterns})               
                    window.close()
                }
                
            }else if(currentWords.includes(word)){
                wordInputField.value = "already blocked!"
            } else if(word !== "" && word !== " "){
                currentWords.push(word)
                browser.storage.local.set({blockedWords : currentWords})
                window.close()
            }
        }

        
        
    })
}

function toggle(){
    browser.storage.local.get('running').then(result => {
        running = result.running !== false;
    
        if (running) {
            running = false
            browser.storage.local.set({running:false})
            toggleButton.textContent = "Off";     
        } else {
            running = true
            browser.storage.local.set({running:true})
            toggleButton.textContent = "On";
        }
    }).catch(error => {
        console.error("Error", error);
    });
}