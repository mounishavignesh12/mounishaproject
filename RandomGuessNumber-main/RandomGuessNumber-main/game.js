var randeomNumber =Math.round(Math.random()*100);
var submitButton = document.getElementById("submit");
var message = document.getElementById("message");
var lives = document.getElementById("lives");
var msg;
var livesTime = 10;
submitButton.onclick = () => {
    let inputNumber = document.getElementById("number-input").value;
    livesTime--;
    if(inputNumber == randeomNumber){
        location.href = "win.html";
    }
    else if(inputNumber > randeomNumber) {
        msg = "Oops! Your guess is overFlowen"

    }
    else if(inputNumber < randeomNumber){
        msg= "Oops your guess underFlowed"
    }

    if(livesTime == 0){
        location.href="loose.html"
    }    
    message.style.display = "inherit";
    message.innerHTML = msg;
    lives.innerHTML = livesTime;
}

const forwardButton = document.getElementById("button-forward");

// forwardButton.onclick = () => {
//     location.href = "index.html";
// }