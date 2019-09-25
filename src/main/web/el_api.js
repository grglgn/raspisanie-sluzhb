var elo = {};

elo.parseDate = function(str, mask){
    if (mask == "dd-mm-yyyy"){
        var maskArr = mask.split('-');

    } else {
        return new Date(str);
    }
}

elo.msg = function(str){
      w2popup.open({
          title: 'Инфо',
          body: '<div class="w2ui-centered">'+str+'</div>'
      });
};