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
    this.tickInterval = 10; //1 sec

    this.reset = function(){
        this.pause();
        this.currentTime = this.sessionDuration;
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
        }
            this.currentTime -= 1;
        
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
        this.BreakDuration = t;
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
    this.clear = true;

    this.draw = function(pomo_obj){
        //check and fix canvas size if needed
        if(this.canvas.width !== this.canvas.clientWidth){
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
        }

        let r = this.canvas.height / 2;
        let ctx = this.canvas.getContext('2d');
        let t = 1 - pomo_obj.getTimeFraction();
        let t_sec = pomo_obj.getTime();
        //console.log(t);
        if(this.clear == true) {
            ctx.clearRect(0,0, r * 2, r * 2);
            this.clear = false;
            ctx.beginPath();
            ctx.arc(r, r, r, 0, 2 * Math.PI);
            ctx.stroke();
        }
        ctx.beginPath();
        
        let start_angle = 1.5 * Math.PI;
        let end_angle = 0;

        if(t == 1){
            start_angle = 0;
            end_angle = 2 * Math.PI;
            this.clear = true;
        }else{
            ctx.moveTo(r,r);
            ctx.lineTo(r , 0);
            start_angle = 1.5 * Math.PI;
            end_angle = (t * 2 * Math.PI) - 0.5 * Math.PI;
        }
        ctx.arc(r, r, r, start_angle, end_angle);
        ctx.lineTo(r, r);
        if(pomo_obj.getActivity() == "work"){
            ctx.fillStyle = 'red';
        }else{
            ctx.fillStyle = 'green';
        }
        ctx.fill();

        let t_min = Math.floor(t_sec / 60);
        let t_sec_remainder = t_sec - t_min * 60;
        textEl.textContent = ((t_min < 10) ? "0":"") + t_min + ":" + ((t_sec_remainder < 10) ? "0":"") + t_sec_remainder;
        //ctx.stroke();
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
pomo.start();