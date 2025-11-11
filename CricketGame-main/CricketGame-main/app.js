let cskScores = ["_","_","_","_","_","_"];
let miScores = ["_","_","_","_","_","_"];

let cskTotal = 0;
let miTotal = 0;
let ballCount = 0;

function strikeBall(){
    ballCount++;
    let run = Math.floor(Math.random()*5)*2;

    if(run == 8){
        run = 'W';
    }

    //csk
    if(ballCount <= 6) {
        if(run != 'W'){
            cskTotal = cskTotal + run;
            document.getElementById("cskscore").textContent = cskTotal;
        }
        cskScores[ballCount-1] = run;
            document.getElementById("cskruns").textContent = cskScores;
    }
    else if(ballCount <= 12 && ballCount > 6){
        if(run != 'W'){
            miTotal = miTotal + run;
            document.getElementById("miscore").textContent = miTotal;
        }
        miScores[ballCount-7] = run;
            document.getElementById("miruns").textContent = miScores;

       if(miTotal > cskTotal) {
                ballCount = 12;
            }
    }

    if(ballCount >= 12) {
        document.getElementById("bat").disabled = true;
        let maxScore = Math.max(cskTotal,miTotal)

        if(cskTotal == maxScore) {
        document.getElementById("CSK").classList.add('winner');
        }
        else if(miTotal == maxScore) {
        document.getElementById("MI").classList.add('winner');
    }

    }
}
