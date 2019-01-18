var intervalID;
var controls = {
  break: {
    value: 5,
    valueDOM: document.getElementById("breakDisp"),
    update: function(sgn){
      if(sgn === -1){
        this.value = (this.value === 0) ? 0 : this.value - 1;
      }
      else{
        this.value = this.value + 1;
      }
      this.valueDOM.innerHTML = this.value;
    }
    
  },
  session: {
    value: 20,
    valueDOM: document.getElementById("sesDisp"),
    update: function(sgn){
      if(sgn === -1){
        this.value = (this.value === 0) ? 0 : this.value - 1;
      }
      else{
        this.value = this.value + 1;
      }
      this.valueDOM.innerHTML = this.value;
      
      if(!(timer.running)){
        timer.clock.timeId.innerHTML = secToMin(this.value*60);
        timer.secondsLeft = this.value*60;
        timer.startSeconds = this.value*60;
      }
    }
  }
}
var timer = {
  clock: {
    circleId: document.getElementsByTagName("circle")[0],
    circum: 145*2*Math.PI,
    timeId: document.getElementById("timeLeft"),
    typeLabelId: document.getElementById("typeLabel")
  },
  alarm: document.getElementById("alarmSound"),
  running: false,
  onBreak: false,
  startSeconds: 1200,
  secondsLeft: 1200,
  update: function(){
    this.clock.timeId.innerHTML = secToMin(this.secondsLeft);
    this.clock.circleId.style.strokeDashoffset = ( this.secondsLeft/(this.startSeconds))*this.clock.circum;
  },
  start: function(){
    if(!(timer.running)){
      timer.running = true;
      intervalID = setInterval(function(){
        if(timer.secondsLeft === 0 && timer.onBreak){
          timer.startSeconds = controls.session.value * 60;
          timer.secondsLeft = timer.startSeconds;
          timer.onBreak = false;
          timer.clock.circleId.style.stroke = "green";
          timer.clock.typeLabelId.innerHTML = "Session";
          timer.alarm.play();
        }
        if(timer.secondsLeft === 0 && !(timer.onBreak)){
          timer.startSeconds = controls.break.value * 60;
          timer.secondsLeft = timer.startSeconds;
          timer.onBreak = true;
          timer.clock.circleId.style.stroke = "blue";
          timer.clock.typeLabelId.innerHTML = "Break";
          timer.alarm.play();
        }
        timer.secondsLeft--;
        timer.update();
      },1000);
    }
    
  }
}

function secToMin(seconds){
  var minutes = Math.floor(seconds/60);
  var mins = (minutes >= 10) ? minutes : "0" + minutes
  var secondsLeft = seconds % 60
  var secs = (secondsLeft >= 10) ? secondsLeft : "0" + secondsLeft;
  return mins + ":" + secs;
}
function test(){
  controls.session.update(1);
  timer.update();
}
document.getElementsByTagName("svg")[0].addEventListener("click",function(){
  if(timer.running){
    clearInterval(intervalID);
    timer.running = false;
  }
  else{
    timer.start();
  }
  
})