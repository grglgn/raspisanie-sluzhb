$(function (){
$('#startDtInp').w2field('date', {format:'dd.mm.yyyy'});
$('#endDtInp').w2field('date', {format:'dd.mm.yyyy'});
$("#processBtn").hide();

//elo.bsData = prepareBuData(buData); //NOTE! Var "buData" must be defined in one of previously included js files




function drawGrid(){


  try {
      prepareBSData(); //здесь заполняется elo.bsData
  } catch (e){
     elo.msg(e.message);
//     elo.msg(JSON.stringify(e));
     return;
  }



  if (g()) {
      g().destroy();
  }

  $('#raspGrid').w2grid({
          name: 'raspGrid',
          records: elo.bsData,
          columns: [
              { field: 'dateStr', caption: 'Д', size: '40px' , min:40},
              { field: 'weekDay', caption: 'ДH', size: '40px', min:40 },

              { field: 'sluzhbi', caption: 'Службы', size: '40%',attr: "align=left" ,
                render: function (record, index, col_index) {
                            return constrSluHtml(index);
                        }},

             /* { field: 'prazdn', caption: '', size:'20px',
                render: function (record, index, col_index) {
                            return '<input type="checkbox" id="prazdnRecChk'+record.recid+'"/>';
                        }},*/

              { field: 'dsc', caption: 'Описание', size: '45%',attr: "align=left"}
          ],
           onDblClick:function(event){
              var record = this.get(event.recid);
              //elo.msg('event.column:'+event.column+'  '+w2utils.decodeTags(record.dsc));
              showEditWindow(record);


          },
          onRender: function(event) {
              //elo.msg('ququ');
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

$("#loadBtn").on("click", drawGrid);

function markRecPrazdn(rec){
   var el = $('#grid_raspGrid_rec_'+rec.recid);
   if (rec.prazdn) el.addClass('prazdn');
   else el.removeClass('prazdn');
}

function showEditWindow(rec){
   $('#popup1').w2popup({
       title: 'Cлужбы в <strong>'+rec['weekDay']+', '+rec['dateStr']+'</strong>',
       onClose:function(event){
           $('#addedSluCnt').empty();//todo remove childs
           $('#sluTime').val("");
           $('#sluName').val("");
           $('#sluPrazdnChk').prop('checked',false);
           $('#editWin_descrBox').removeClass('prazdn');
           $('#sluAddBtn').off();
           $('#editWin_applyBtn').off();
           $('#markPrazdnBox button').off();
           delete rec.prePrazdn;
       }
   });
   $('#sluAddBtn').on('click', function(event){
      editWin_addSlu(rec);
   });
   $('#editWin_applyBtn').on('click', function(event){
      editWin_applyChanges(rec);
   });
   $('#sluTime').w2field('list', { items: slu_times });
   $('#sluName').w2field('list', { items: slu_names });
   $('#editWin_descrBox').html(rec.dsc);
   if (rec.prazdn){
       $('#editWin_descrBox').addClass('prazdn');
       $('#sluPrazdnChk').prop('checked',true);
   }
   prepareMarkPrazdnBtn(rec);
   var existedSlu = elo.bsData[rec.recid].slu;
   if (existedSlu) rec.addedSlu = [].concat(elo.bsData[rec.recid].slu);
   else rec.addedSlu = [];

   editWin_redrawSlu(rec);
}

function prepareMarkPrazdnBtn(rec){
     var btn = $('#markPrazdnBox button');
     var makePrazdnMsg = 'Сделать праздничным';
     var makeNoPrazdnMsg = 'Сделать непраздничным';
     btn.html((rec.prazdn || rec.prePrazdn)? makeNoPrazdnMsg : makePrazdnMsg);
     btn.click(function(){
         if ((rec.prazdn && rec.prePrazdn == undefined) || rec.prePrazdn){
             rec.prePrazdn = false;
             $('#editWin_descrBox').removeClass('prazdn');
             $('#sluPrazdnChk').prop('checked',false);
             btn.html(makePrazdnMsg);
         } else {
            rec.prePrazdn = true;
            $('#editWin_descrBox').addClass('prazdn');
            $('#sluPrazdnChk').prop('checked',true);
            btn.html(makeNoPrazdnMsg);
         }
     });
}

function editWin_applyChanges(rec){
   //var chAr = rec.addedSlu;
   var divArr = $('#addedSluCnt div');
   rec.slu = [];
   divArr.each(function(ind){
       //this.id
       var inputs = $(this).children('input');
       var newTime = inputs.eq(0).val();
       var newName = inputs.eq(1).val();
       var isPra = rec.addedSlu[ind].isPrazdn;
       //var isPraz =  inputs.eq(3).prop('checked');
       rec.slu.push({time:newTime, title:newName, isPrazdn:isPra ? true:false});
   });
   elo.bsData[rec.recid].slu = Array.from(rec.slu);
   if (rec.prePrazdn != undefined){
      rec.prazdn = rec.prePrazdn;
      elo.bsData[rec.recid].prazdn = rec.prePrazdn;
   }
   g().refreshRow(rec.recid);
   markRecPrazdn(rec);
   w2popup.close();

}

function editWin_sluDivId(rec,time){
   return 'adSl_'+rec.recid+'_'+time;
}

function editWin_redrawSlu(rec){

    $('#addedSluCnt').empty();
    editWinMsg('');
    for (var i in rec.addedSlu){
        var curSlu = rec.addedSlu[i];
        var divid = editWin_sluDivId(rec,curSlu.time);
        var timeInp = divid+'_t';
        var nameInp = divid+'_n';
        var removeBtn = divid+'_btn';

        $('#addedSluCnt').append(
           '<div id="'+divid+'"><input type="text" class="sluTime" id="'+timeInp+'"/>'+
             '<input type="text" id="'+nameInp+'" class="sluName"/><button id="'+removeBtn+'">Удалить</button></div>');
        if (curSlu.isPrazdn){
            $('#'+divid).addClass('prazdn');
        }
        $('#'+removeBtn).on('click', function(){
            var ind = i;
            editWin_removeSlu(rec, this);
            //$('#'+divid).remove(rec,i);
        });
        $('#'+timeInp).val(curSlu.time);
        $('#'+nameInp).val(curSlu.title);
    }
    if (rec.addedSlu.length == 0) editWinMsg('Нет служб');
    //else editWinMsg('Выбрано служб:'+)
}

function editWinMsg(s){
   $('#editWin_msgBox').html(s);
}

function editWin_addSlu(rec){
    var sluArr = rec.addedSlu;
    var timeVal = $('#sluTime').val();
    var nameVal = $('#sluName').val();
    var isPra = $('#sluPrazdnChk').prop('checked');
    if (!timeVal) {
        editWinMsg('Не выбрано время');
        return;
    }
    if (!nameVal){
        editWinMsg('Не выбрано название службы');
        return;
    }
    var inserted = false;
    var newSlu = {time:timeVal, title:nameVal, isPrazdn:isPra};


    var resMsg = editWin_insertNewSlu(sluArr, newSlu);
    if (resMsg){
        editWinMsg(resMsg);
    } else {
        editWin_redrawSlu(rec);
        $('#sluTime').val('');
        $('#sluName').val('');

        $('#sluPrazdnChk').prop('checked',rec.prazdn || rec.prePrazdn);
    }

}

function editWin_removeSlu(rec,btn){
   var divid = btn.parentElement.id;
   var t = divid.substring(divid.lastIndexOf('_')+1);
   var ar = rec.addedSlu;
   for (var i in ar){
       if (ar[i].time == t){
           ar.splice(i,1);
           break;
       }
   }
   editWin_redrawSlu(rec);
}

function editWin_insertNewSlu(sluArr, newSlu){
    for (var i in sluArr){
        var nextSluTime = parseInt(sluArr[i].time.replace('-',''));
        var newSluTime = parseInt(newSlu.time.replace('-',''));
        if (nextSluTime == newSluTime){
            //throw "";
            return 'Уже есть служба в это время';
        }
        if (nextSluTime > newSluTime){
           sluArr.splice(i,0, newSlu);
           return '';
        }
    }

    sluArr[sluArr.length] = newSlu;
    return '';

}

function g(){ return w2ui['raspGrid'];}

function getCurRecord(){
   var sel = g().getSelection();
   if (sel.length) {
       return g().get(sel[0]);
   } else {
       return null;
   }
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
            b+='">';
            b+=w2utils.encodeTags(sl.time + ' ' + sl.title);
            b+='</div>';
        }

    } else {

        b+='">нет служб';
    }
    b+='</div>';
    return b;

}

$("#processBtn").on("click", function(event){
    //todo

});

elo.editSlu = function(ind){
   var rec = g().get(ind+1);
   elo.msg('dsc:'+rec.dsc);
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

          var wd = dd['weekDay']
          if (dd['weekDay'].indexOf('Неделя') == 0){
              dd['dsc'] = wd +'. ' + dd['dsc'];
              dd['weekDay'] = 'Воcкресенье';
              dd['prazdn'] = true;
          }
          dd['weekDay'] = WEEK_DAYS_ABBR_MAP[dd['weekDay']];//меняем на краткое обозначения дня недели
          dd['recid'] = elo.bsData.length;
          elo.bsData.push(dd);
          //
      }
      curDt = new Date(curDt.getTime()+ DAY_MS);
  }

}

function to2d(n){
   if (n<10) return '0'+n;
   else return ''+n;
}


});