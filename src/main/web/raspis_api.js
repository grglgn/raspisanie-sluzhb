var Shedule = function(startDt, endDt){
   this.days = [];
   this.startDate = startDt;
   this.endDate = endDt;
};

function ShedDay(d, wd, m, y, prazd, descr, sluArr){
  this.data = {};
  this.data.day = d;
  this.data.month = m;
  this.data.year = y;
  this.data.weekDay = wd;
  this.data.isPrazdn=prazd;
  this.data.slu=sluArr ? sluArr : [];
  this.data.description = descr ? descr : '&nbsp;';
  this.data.loadDsc = false;
}

ShedDay.prototype.addSlu = function(t,tit,prazd){
  this.data.slu[this.data.slu.length]={time:t, title:tit, isPrazdn:prazd};
  //if (isUtr) this.hasUtr
  //if (tit.indexOf('8-'))
};

ShedDay.prototype.loadDescr = function(){
  this.data.loadDsc = (arguments.length > 0) ? arguments[0]:true;
}

function shed_day_to_html (dayObj, weekCfg){
    var ddata = dayObj.data
    var sluNum = ddata.slu.length;
    if (sluNum == 0) return '';
    var sl = ddata.slu[0];
    var b = '<tr'+(ddata.isPrazdn ? ' class="prazdn"':'')+'>\n';
    b+='<td width="5%"' +(sluNum > 1 ? ' rowspan="'+sluNum+'"':'')+'>';
    if (weekCfg){
        b+= weekCfg[ddata.weekDay];
    } else {
        b+=ddata.weekDay;
    }
    b+='</td>\n<td width="10%"' +(sluNum > 1 ? ' rowspan="'+sluNum+'"':'')+'>'+
  	      ddata.day+' '+ ddata.month+'</td>\n';
    b+='<td width="7%">'+sl.time+'</td>';
    b+='<td width="30%">'+sl.title+'</td>\n';
    var dsc = ddata.description;
    //if (ddata.loadDsc){
        //dsc = dayObj.calendarScript();
    //}
    b+='<td width="30%"' +(sluNum > 1 ? ' rowspan="'+sluNum+'"':'')+'>'+
  	      dsc+'</td>\n';
    b += '</tr>\n';

    for (var i = 1; i < sluNum; i++){
        sl = ddata.slu[i];
  	  var isPra = sl.isPrazdn;//false;//ddata.isPrazdn && sl.isPrazdn !== false;
  	  b += '<tr'+(isPra ? ' class="prazdn"':'')+'>\n';
  	  b+='<td>'+sl.time+'</td><td>'+sl.title+'</td>';
  	  b += '</tr>\n';
    }
    return b;
}

function el(eid){
   return document.getElementById(eid);
}

var TRIM_REGEXP = /^\s+|\s+$/g;
String.prototype.trim = function() {
    return this.replace(TRIM_REGEXP, '');
};

String.prototype.splitx = function(delim) {
    var ind = 0;
    var arr = [];
    while(true){
        var ind2 = this.indexOf(delim, ind);
        if (ind2 != -1) {
            var ss = this.substring(ind,ind2).trim();
            if (ss.length > 0) arr[arr.length] = ss;
        } else {
            var ss = this.substring(ind).trim();
            if (ss.length > 0) arr[arr.length] = ss;
            break;
        }
        ind = ind2+1;
    }
    return arr;
}

