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
           $('#editWin_applyForAllBtn').off();
           $('#markPrazdnBox button').off();
           $('#editWin_descrBox').off().show();
           $('#editWin_descrInput').off().hide();
           delete rec.prePrazdn;
       }
   });
   $('#sluAddBtn').on('click', function(event){
      editWin_addSlu(rec);
   });
   $('#editWin_applyBtn').on('click', function(event){
      editWin_applyChanges(rec);
   });
   $('#editWin_applyForAllBtn').html('Сохранить для всех "'+rec.weekDay+'" периода');
   $('#editWin_applyForAllBtn').on('click', function(event){
      editWin_applyChanges(rec,true);
   });
   $('#sluTime').w2field('list', { items: slu_times });
   $('#sluName').w2field('list', { items: slu_names });
   $('#editWin_descrBox').html(rec.dsc);
   if (rec.prazdn){
       $('#editWin_descrBox').addClass('prazdn');
       $('#sluPrazdnChk').prop('checked',true);
   }
   $('#editWin_descrBox').dblclick(function(){
        $('#editWin_descrInput').show();
        $('#editWin_descrInput').val(rec.dsc);
        $(this).hide();
   });
   $('#editWin_descrInput').focusout(function(){
        $('#editWin_descrBox').html($(this).val());
        $('#editWin_descrBox').show();
        $(this).hide();
   });
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

function editWin_applyChanges(rec, forAll){
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
   rec.dsc = $('#editWin_descrBox').html();
   elo.bsData[rec.recid].dsc = rec.dsc;

   g().refreshRow(rec.recid);
   markRecPrazdn(rec);
   w2popup.close();
   if (forAll) _editWin_copySluChanges(rec);
}

function _editWin_copySluChanges(recOrigin){

   for (var i in elo.bsData){
       var dd = elo.bsData[i];
       if (dd.weekDay != recOrigin.weekDay) continue;
       if (dd.slu && dd.slu.length) continue;
       var rec = g().records[dd.recid];
       dd.slu = Array.from(recOrigin.slu);
       rec.slu = Array.from(recOrigin.slu);
       //dd.dsc = rec.dsc = recOrigin.dsc;
       //dd.prazdn = rec.prazdn = recOrigin.prazdn;
       g().refreshRow(rec.recid);
   }
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