blockedUsers = []
blockedWords = []
blockedPatterns = []

browser.storage.local.get('running').then(result => { 
    
    let running = result.running !== undefined ? result.running : true;
    
    if(running === true){ 
        browser.storage.local.get(['blockedUsers','blockedWords','blockedPatterns'], (result) => {
            blockedUsers = result.blockedUsers || []
            blockedWords = result.blockedWords || []
            blockedPatterns = result.blockedPatterns || []
            
        })
        
        
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) =>{
                mutation.addedNodes.forEach((node) =>{
                    if (node.nodeType === 1 && node.tagName === 'DIV'){
        
                        if (node.classList.contains('ModRecord')){
                            
                            const imgElement = node.querySelector('img[class = "AvatarImage"]');
                            
                            if (imgElement && blockedUsers.includes(imgElement.alt.split(" avatar")[0])){  
                                node.remove()
                            }
                            
                            const nameElement = node.querySelector('a[class = "Name"] span')
        
                            if (nameElement && verifyText(nameElement.textContent)){
                                node.remove()
                            }
                            
                            
                        }               
                    }
                })
            })
         })
        
        const interval = setInterval(() => {
            const flowDiv = document.querySelector(".RecordsGrid")
            if (flowDiv){
                mutationObserver.observe(flowDiv,{childList: true})
                clearInterval(interval)      
            }
        })
            
           
        function verifyText(text){
        
            for (let word of blockedWords){
                if (text.toLowerCase().includes(word)){
                    return true
                }
            }
            for (let pattern of blockedPatterns){
                const regex = new RegExp(`\\b${pattern}\\b`, 'g');
                if (regex.test(text.toLowerCase())) {
                    return true
                }
            }
            return false
        }
    }
    
}).catch(error => {
    console.log("Error", error);
});


