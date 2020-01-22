"use-strict"

let last_known_scroll_position = 0;
let ticking = false;
let skillSection = document.getElementById('skills');
let skillList = skillSection.getElementsByTagName('li');

initSkillBars();
window.addEventListener('scroll', getScrollY, { passive: true });

function initSkillBars() {
    for(let i = 0; i < skillList.length; i++) {
        let bar = skillList[i].children[1].children[0];
        let num = skillList[i].children[1].children[1].innerHTML;
        bar.style = `left: 0%;`;
    }
}

function getScrollY() {
    last_known_scroll_position = window.scrollY;
    if(last_known_scroll_position > skillSection.offsetTop){
        for(let i = 0; i < skillList.length; i++) {
            let bar = skillList[i].children[1].children[0];
            let num = skillList[i].children[1].children[1].innerHTML;
            bar.style = `transition-duration: 2400ms; transition-delay: ${i*3}00ms; left: ${num};`;
        }
        window.removeEventListener('scroll', getScrollY, { passive: true });
    }
}