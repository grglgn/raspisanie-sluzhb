function loadUI(){
 $("#startDtSpan").append(newCalendar("startDt"));
 $("#endDtSpan").append(newCalendar("endDt"));
}

function newCalendar(id){
    var cl  = $("<select id='clD-"+id+"' class='clDay'></select><select id='clM-"+id+"' class='clMont'></select><select id='clY-"+id+"' class='clYear'></select>");
    return cl;
}