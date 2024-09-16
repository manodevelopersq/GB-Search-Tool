const userTextArea = document.getElementById("blocked-users")
const wordTextArea = document.getElementById("blocked-words")



browser.storage.local.get(['blockedUsers','blockedPatterns','blockedWords'], (result) => {
    const blockedUsers = result.blockedUsers || []
    const blockedWords = result.blockedWords || []
    const blockedPattens = result.blockedPatterns || []
    let temptext = ""
    blockedUsers.forEach(user => {
        temptext += user + "\n"
    });
    userTextArea.value = temptext
    
    temptext = ""
    blockedPattens.forEach((pattern)=>{
        temptext += "[EXACT]"+pattern+"\n"
    });
    wordTextArea.value = temptext
    
    temptext = ""
    blockedWords.forEach((word)=>{
        temptext += word + "\n"
    });
    wordTextArea.value += temptext
})

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === 's') { 
        event.preventDefault();
        save()
        return false;
    }
});

async function save() {
    const allUsers = userTextArea.value.split("\n")
    let newBlockedUsers = []
    allUsers.forEach((user)=>{
        if(user !== "" && user !== " "){
            newBlockedUsers.push(user)
        }
    })

    const allWords = wordTextArea.value.split("\n")
    let newBlockedWords = []
    let newBlockedPatterns = []
    
    allWords.forEach((word)=>{
        
        if ((word.startsWith("[EXACT]") && word !== "" && word !== " ")){
            newBlockedPatterns.push(word.toLowerCase().split("[exact]")[1])         
        }else if (word !== "" && word !== " "){
            newBlockedWords.push(word.toLowerCase())         
        }
    })  
    
    await browser.storage.local.set({blockedUsers : newBlockedUsers, blockedWords : newBlockedWords, blockedPatterns : newBlockedPatterns})
}

const saveButton = document.getElementById('save');
    saveButton.addEventListener('click', () => {
        save()
    });