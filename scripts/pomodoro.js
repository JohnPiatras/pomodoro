"use strict"

// use setInterval(function(){ alert("Hello"); }, 3000); to run timer
//Pomodoro implements a pomodoro timer object which can be stopped, startedand reset
//Use the setUpdateCallback method to set a function which will be called on each tick while mthe clock is running.
//Use this call back to draw your clock to the page.
function Pomodoro() {
    this.workDuration = 1500; // 25 minutes
    this.breakDuration = 300; //5 minutes
    this.currentTime = this.workDuration;
    this.activity = "work";   //can be 'work' or 'break'
    this.intervalID = null;
    this.tickInterval = 1000; //1 sec

    this.reset = function(){
        this.pause();
        this.currentTime = this.workDuration;
        this.activity = "work";
    };
    this.pause = function(){
        if(this.intervalID){
            clearInterval(this.intervalID);
            this.intervalID = null;
        }
    };
    this.start = function(){
        if(!this.intervalID){
            this.intervalID = setInterval(this.tick.bind(this), this.tickInterval);
        }
    };
    this.tick = function(){
        if(this.currentTime == 0){
          
            switch(this.activity){
                case "work":
                    this.activity = "break";
                    this.currentTime = this.breakDuration;
                    break;
                case "break":
                    this.activity = "work";
                    this.currentTime = this.workDuration;
                    break;
            }               
        }else{
            this.currentTime -= 1;   
            
        }
        if(this.updateCallback)this.updateCallback(this);                             
        
    };
    this.setUpdateCallback = function(callback){
        this.updateCallback = callback;
    };
    this.setWorkDuration = function(t){
        this.workDuration = t;
    };
    this.getWorkDuration = function(){
        return this.workDuration;
    };
    this.setBreakDuration = function(t){
        this.breakDuration = t;
    };
    this.getBreakDuration = function(){
        return this.breakDuration;
    };
    this.getTime = function(){
        return this.currentTime;
    };
    this.getActivity = function(){
        return this.activity;
    };
    this.getTimeFraction = function(){
        switch(this.activity){
            case "work":
                return this.currentTime / this.workDuration;
                break;
            case "break":
                return this.currentTime / this.breakDuration;
                break;
        }
    };

};

function PomodoroDrawer(canvas, textEl){
    this.canvas = canvas;
    this.textEl = textEl;
    this.ctx = this.canvas.getContext('2d');
   // this.clear = true;

    this.clear = function(color){
        let ctx = this.ctx;
        let r = this.canvas.height / 2;
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height); 
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.moveTo(r,r);
        ctx.arc(r, r, r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.globalAlpha = 1;              
    };

    this.draw = function(pomo_obj){
        let color = null;
        if(pomo_obj.getActivity() == "work"){
            color = 'red';
        }else{
            color = 'green';
        }

        //check and fix canvas size if needed
        if(this.canvas.width !== this.canvas.clientWidth){
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;      
            this.clear(color);      
        }

        let r = this.canvas.height / 2;
        let ctx = this.ctx;
        let t = 1 - pomo_obj.getTimeFraction();
        let t_sec = pomo_obj.getTime();
        
        let start_angle = 1.5 * Math.PI;
        let end_angle = 0;

        if(t == 0){                         
            this.clear(color);
                          
        }else{
            if(t == 1){
                start_angle = 0;
                end_angle = 2 * Math.PI;
            }else{
                end_angle = (t * 2 * Math.PI) - 0.5 * Math.PI;
            }
            ctx.beginPath();
            ctx.moveTo(r,r);
            ctx.lineTo(r , 0);

            ctx.arc(r, r, r, start_angle, end_angle);
            ctx.lineTo(r, r);
            ctx.fillStyle = color;
            ctx.fill();
        }

        let t_min = Math.floor(t_sec / 60);
        let t_sec_remainder = t_sec - t_min * 60;

        textEl.textContent = ((t_min < 10) ? "0":"") + t_min + ":" + ((t_sec_remainder < 10) ? "0":"") + t_sec_remainder;       
    };
};

let canvas = document.getElementById("clock-canvas");
let textEl = document.getElementById("clock-text");
let pomo = new Pomodoro();
let pomoDrawer = new PomodoroDrawer(canvas, textEl);

let printUpdate = function(pomo_obj){
    console.log(`${pomo_obj.getActivity()} time left: ${pomo_obj.getTime()} (${pomo_obj.getTimeFraction() * 100.0}%)`);
};


pomo.setUpdateCallback(pomoDrawer.draw.bind(pomoDrawer));
pomo.reset();
pomoDrawer.draw(pomo);

let bttn_start = document.getElementById("bttn-start");
let bttn_reset = document.getElementById("bttn-reset");
let bttn_ok = document.getElementById("bttn-ok");
let settings_dialog = document.getElementById("settings-dialog");
let work_time_input = document.getElementById("work-time-input");
let break_time_input = document.getElementById("break-time-input");

bttn_start.onclick = function(){
    if(bttn_start.innerHTML == "<span>Start</span>"){
        //pomoDrawer.clear = true;
        pomo.start();
        bttn_start.innerHTML = "<span>Stop</span>";
        bttn_reset.innerHTML = "<span>Reset</span>";
    }else{
        pomo.pause();
        bttn_start.innerHTML = "<span>Start</span>";
        bttn_reset.innerHTML = "<span>Set</span>";
    }
}


bttn_reset.onclick = function(){ 
    if(bttn_reset.innerHTML == "<span>Reset</span>"){
        pomo.reset();
        pomoDrawer.draw(pomo);    
        bttn_start.innerHTML = "<span>Start</span>";
        bttn_reset.innerHTML = "<span>Set</span>";
    }else{
        pomo.pause();
        work_time_input.value = pomo.getWorkDuration() / 60;
        break_time_input.value = pomo.getBreakDuration() / 60;
        settings_dialog.style.visibility="visible";
    }
    
}

bttn_ok.onclick = function(){
    pomo.setWorkDuration(work_time_input.value * 60);
    pomo.setBreakDuration(break_time_input.value * 60);
    pomo.reset();
    pomoDrawer.draw(pomo);
    settings_dialog.style.visibility = "hidden";

}
//pomo.start();




