

function loadUI(){
 newCalendar($("#startDtSpan"),"startDt");
 newCalendar($("#endDtSpan"),"endDt");
}

var MONTHS = {
    0:'января',
    1:'февраля',
    2:'марта',
    3:'апреля',
    4:'мая',
    5:'июня',
    6:'июля',
    7:'августа',
    8:'сентября',
    9:'октября',
    10:'ноября',
    11:'декабря',
};

function newCalendar(parent,id){
    var clD = $("<select id='clD-"+id+"' class='clDay'></select>");
    var clM = $("<select id='clM-"+id+"' class='clMonth'></select>");
    var clY = $("<select id='clY-"+id+"' class='clYear'></select>");
    var curDt = new Date();
    var startY = 1900+curDt.getYear()-1;
    var startDt = curDt;//new Date(2019,8,1,0,0,0,0);
    var days = 30;
    var msDay = 1000*60*60*24;
    var day = startDt.getDay();
    for (var i=0;i<days;i++){
        clD.append($("<option value='"+day+"'>"+day+"</option>"));
        day++;
    }
    for (var i=0;i<11;i++){
           clM.append($("<option value='"+i+"'>"+MONTHS[i]+"</option>"));
    }

    for (var i=startY;i<=startY+1;i++){
       clY.append($("<option value='"+i+"'>"+i+"</option>"));
    }

    parent.append(clD);
    parent.append(clM);
    parent.append(clY);
}