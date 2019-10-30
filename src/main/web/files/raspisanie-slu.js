$(function (){

var curDate = new Date();

$('#startDtInp').w2field('date', {format:'dd.mm.yyyy'});
$('#endDtInp').w2field('date', {format:'dd.mm.yyyy'});
$("#processBtn").hide();


$('#startDtInp').val(fmtDt_xx_xx_xxxx(curDate));

$('#endDtInp').val(fmtDt_xx_xx_xxxx(
              new Date(curDate.getTime()+(30*24*60*60*1000))));


function drawGrid(useCached){

  try {
      if (!useCached) {
          prepareBSData(); //здесь заполняется elo.bsData
      }

  } catch (e){
     elo.msg(e.message);
     return;
  }

  $("#loadJsonBtn").html(originModelBtnText);
  isModelDisplayed = false;

  if (g()) {
      g().destroy();
  }

  $('#raspGrid').w2grid({
          name: 'raspGrid',
          records: elo.bsData,
          columns: [
              { field: 'dateStr', caption: 'Д', size: '10%' , min:55},
              { field: 'weekDay', caption: 'ДH', size: '5%', min:45 },

              { field: 'sluzhbi', caption: 'Службы', size: '40%',attr: "align=left" ,
                render: function (record, index, col_index) {
                            return constrSluHtml(index);
                        }},
              { field: 'dsc', caption: 'Описание', size: '45%',attr: "align=left"}
          ],
           onDblClick:function(event){
              var record = this.get(event.recid);
              //elo.msg('event.column:'+event.column+'  '+w2utils.decodeTags(record.dsc));
              showEditWindow(record);


          },
          /*onSelect: function(event) {
              var record = this.get(event.recid);
              //$('#console').html(constrSluHtml(event.recid));
              ..w2alert(constrSluHtml(event.recid));
              return true;
          } ,*/
          onRender: function(event) {
              setTimeout(function(){
                 var da = elo.bsData;
                 for (var i in da){
                     markRecPrazdn(da[i]);
                 }
              },100);
          }
      });
      $("#processBtn").show();

}//drawGrid

//$("input[id=^'isPrazdnRecChk']").change(function(){

$("#loadBtn").on("click", function(){
     confirmLossDataAndDo(drawGrid);
});

var isModelDisplayed = false;
var originModelBtnText = $("#loadJsonBtn").html();

$("#loadJsonBtn").on("click", function(){
     //confirmLossDataAndDo(function(){});
     isModelDisplayed = !isModelDisplayed;
     if (isModelDisplayed){
       $("#raspGrid").html("<textarea></textarea>");
       $("#raspGrid textarea").val(JSON.stringify(elo.bsData));
       $("#loadJsonBtn").html('Таблица');

     } else {

       try{
         elo.confirm(
             'Вы уверены, что хотите изменить модель ? Нажмите "Нет", чтобы оставить все, как было'
             ,function(){
                 elo.bsData = JSON.parse($("#raspGrid textarea").val());
                 drawGrid(true);
             },
             function(){
                 drawGrid(true);
             });
       } catch (e){
           isModelDisplayed = true;//остаемся в режиме ручного ред. модели...
           elo.msg('Возникла ошибка при разборе модели:'+e);
       }
     }
});


function  confirmLossDataAndDo(fn){
     if (elo.bsData && elo.bsData.length){
         elo.confirm('Ваши изменения расписания будут потеряны. Продолжить?',fn);
     } else fn.apply();
}


function constrSluHtml(ind){
//    var rec = g().get(i);
    var rec = elo.bsData[ind];
    var arr = rec.slu;
    var b='<div class="slu-all-cnt';
    if (arr && arr.length){
        b+=' bordered">';
        for (var i in arr){
            var sl = arr[i];
            b+='<div class="slu-cnt';
            if (sl.isPrazdn) b+=' prazdn';
            else b+=' notprazdn';
            b+='" >';
            b+=w2utils.encodeTags(sl.time + ' ' + sl.title);
            b+='</div>';
        }

    } else {

        b+='">нет служб';
    }
    b+='</div>';
    return b;

}

//========================= generate =====================================

$("#processBtn").on("click", function(event){
    //todo
    gen_showWindow();

});

function gen_showWindow(){

var htmlTxt = '<table>\n';
var plainTxt = '';
for (var i in elo.bsData){
    var dd = elo.bsData[i];
    var rowHtml = shed_day_to_html(dd);
    if (rowHtml) {
        htmlTxt += rowHtml +'\n';
        plainTxt += shed_day_to_text(dd);
    }
}
htmlTxt += '\n</table>';
var genHtml = htmlTxt;
var genTextHtml = w2utils.encodeTags(genHtml);
var genText = plainTxt;
var genJson = w2utils.encodeTags(JSON.stringify(elo.bsData));

$('#genPopup').w2popup({
       title: 'Сгенерированное расписание',
       onClose:function(event){
           /*$("#genWin_htmlBtn").off();
           $("#genWin_codeBtn").off();
           $("#genWin_txtBtn").off();
           $("#genWin_copyBtn").off();*/
           //$('#toolbar').w2toolbar().destroy();
           w2ui['toolbar'].destroy();
       }
   });

$('#toolbar').w2toolbar({
        name: 'toolbar',
        items: [
            { type: 'radio', id: 'genWin_htmlBtn', group: '1', text: 'Просмотр',  checked: true ,
              onClick: function(event){
                  //this.elChecked = event.item.id;
                  this.elDisplayedText = genHtml;
                  $("#genWin_content").html(genHtml);
              } },
            { type: 'radio', id: 'genWin_codeBtn', group: '1', text: 'html-код для сайта',
              onClick: function(event){
                  //this.elChecked = event.item.id;
                  this.elDisplayedText = genTextHtml;
                  $("#genWin_content").html(genTextHtml);
              } },
            { type: 'radio', id: 'genWin_txtBtn', group: '1',  text: 'Текст',
              onClick: function(event){
                  //this.elChecked = event.item.id;
                  this.elDisplayedText = genText;
                  $("#genWin_content").html('<pre>'+genText+'</pre>');
              } }/*,
              { type: 'radio', id: 'genWin_jsonBtn', group: '1',  text: 'Модель',
                            onClick: function(event){
                                //this.elChecked = event.item.id;
                                this.elDisplayedText = genJson;
                                $("#genWin_content").html(genJson);
                            } }*/
            ,{ type: 'spacer' },
            { type: 'button', id: 'genWin_copyBtn', text: 'Копировать',
                onClick: function(event){
                    //alert(this.elDisplayedText);
                    elo.copyContent($("#genWin_content").get(0));
                }}
        ],
        onRender: function(){
            this.elDisplayedText = genHtml;
        }
    });

//$("#genWin_content").html(genHtml);
//$("#genWin_content").html(genHtml);
w2ui['toolbar'].click('genWin_htmlBtn');
}


function shed_day_to_html (ddata){
    var sluNum = ddata.slu.length;
    if (sluNum == 0) return '';
    var sl = ddata.slu[0];
    var b = '<tr'+(ddata.prazdn ? ' class="prazdn"':'')+'>\n';
    b+='<td width="5%"' +(sluNum > 1 ? ' rowspan="'+sluNum+'"':'')+'>';
    b+=ddata.weekDay;
    b+='</td>\n<td width="10%"' +(sluNum > 1 ? ' rowspan="'+sluNum+'"':'')+'>'+
  	      ddata.dateStr +'</td>\n';
    b+='<td width="7%">'+sl.time+'</td>';
    b+='<td width="30%">'+sl.title+'</td>\n';
    var dsc = ddata.dsc;
    b+='<td width="30%"' +(sluNum > 1 ? ' rowspan="'+sluNum+'"':'')+'>'+
  	      dsc+'</td>\n';
    b += '</tr>\n';

    for (var i = 1; i < sluNum; i++){
        sl = ddata.slu[i];
  	    b += '<tr'+(sl.isPrazdn ? ' class="prazdn"':'')+'>\n';
  	    b+='<td>'+sl.time+'</td><td>'+sl.title+'</td>';
  	    b += '</tr>\n';
    }
    return b;
}

function shed_day_to_text (ddata){
  var sluNum = ddata.slu.length;
  if (sluNum == 0) return '';
  var sl = ddata.slu[0];
  var b = '\n=======================================\n';
  b += ddata.weekDay + ', ' + ddata.dateStr+'\n';
         b+='---------------------------------------\n';
  for (var i = 0; i < sluNum; i++){
      sl = ddata.slu[i];
	  b+= sl.time+' '+sl.title+'\n';
  }
  return b;
}
//======================= Data handling ===================

var WRONG_RANGE_EX = 'Диапазон дат выбран неправильно';
var DAY_MS = 1000*60*60*24;

function prepareBSData(){
  var startDtV = $('#startDtInp').val();//datepicker("getDate");
  var endDtV = $('#endDtInp').val();//datepicker("getDate");
  if (!startDtV || !endDtV) throw new Error("Не задан интервал");
  elo.bsData = [];

  var startDtArr = elo.toNumberArr(startDtV.split('.')).reverse();
  var endDtArr = elo.toNumberArr(endDtV.split('.')).reverse();

  var startDt = new Date(startDtArr[0],startDtArr[1]-1,startDtArr[2]);
  var endDt = new Date(endDtArr[0],endDtArr[1]-1,endDtArr[2]);
  if (startDt > endDt) throw new Error(WRONG_RANGE_EX);
  var curDt = startDt;

  while (curDt <= endDt){
      var y = ''+curDt.getFullYear();
      var m =  to2d(curDt.getMonth()+1);
      var d = to2d(curDt.getDate());
      var key = y + '-' + m + '-' + d;
      var dd = buData[key];
      if (dd){
          dd['dateStr'] = d+'.'+ m;
          dd['sluzhbi'] = '';
          if (dd['prazdn'] == undefined) dd['prazdn'] = false;




          var wd = dd['weekDay'];
          if (wd && wd.indexOf('Неделя') != -1){
              dd['dsc'] = wd +'. ' + dd['dsc'];
          }
          dd['weekDay'] = WEEK_DAYS_ABBR_ARR[curDt.getDay()];//WEEK_DAYS_ABBR_MAP[dd['weekDay']];//меняем на краткое обозначения дня недели
          if (curDt.getDay() == 0) dd['prazdn'] = true;
          dd['recid'] = elo.bsData.length;
          dd['slu'] = [];
          elo.bsData.push(dd);
          //
      }
      curDt = new Date(curDt.getTime()+ DAY_MS);
  }

}
w2alert(navigator.userAgent);
});



function g(){ return w2ui['raspGrid'];}

function fmtDt_xx_xx_xxxx(dt){
   var ar = ['','',''];
   ar[2] = dt.getFullYear();
   ar[1] =  to2d(dt.getMonth()+1);
   ar[0] = to2d(dt.getDate());
   return ar.join('.');
}

function to2d(n){
   if (n<10) return '0'+n;
   else return ''+n;
}

function markRecPrazdn(rec){
   var el = $('#grid_raspGrid_rec_'+rec.recid);
   if (rec.prazdn) el.addClass('prazdn');
   else el.removeClass('prazdn');


}
