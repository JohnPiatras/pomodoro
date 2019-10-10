"use strict"

// use setInterval(function(){ alert("Hello"); }, 3000); to run timer

function Pomodoro() {
    this.workDuration = 15; // 25 minutes
    this.breakDuration = 3; //5 minutes
    this.currentTime = 15;
    this.activity = "work";   //can be 'work' or 'break'
    this.intervalID = null;

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
            this.intervalID = setInterval(this.tick.bind(this), 1000);
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

let pomo = new Pomodoro();

let printUpdate = function(pomo_obj){
    console.log(`${pomo_obj.getActivity()} time left: ${pomo_obj.getTime()} (${pomo_obj.getTimeFraction() * 100.0}%)`);
};

pomo.setUpdateCallback(printUpdate);
pomo.start();