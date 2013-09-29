/**
 * @desc ECD COMBO TOOL POPUP
 * @author jiguang
 * @mail jiguang1984#gmail.com
 * @date 2013-05-24
 */

$(function(){

    var background = chrome.extension.getBackgroundPage();
    var combofile;

    // update
    background.getCurrentComboFile(function(data){

        try{
            combofile = JSON.parse(data.combofile);
        }catch(e){}

        function generateUpdateList(){
            var template = '<li>{{path}}</li>';
            var tempNode;
            var $updateList = $('#updateList');

            if(combofile && combofile.fileName && combofile.comboLinks.length > 0){
                $updateList.empty();

                for(var i = 0, j = combofile.comboLinks.length; i<j; i++){
                    tempNode = template.replace('{{path}}', combofile.comboLinks[i]);
                    $updateList.append($(tempNode));
                }
            }
        }

        function getUpdateList(){
            var $updateList = $('#updateList');
            var updateList = [];

            $updateList.find('li').each(function(){
                if($(this).hasClass('checked')){
                    updateList.push($(this).text());
                }
            });

            return updateList.join(',');
        }

        generateUpdateList();

        $('#updateList').find('li').click(function(){
            $(this).toggleClass('checked');
        });

        $('#update').click(function(){
            background.update({
                fileName: combofile.fileName,
                updateList: getUpdateList()
            });
        }) ;
    });

    // open combo tool
    $('#combo_tool').click(function(){

        background.getCurrentComboFile(function(data){

            var url = "http://ppms.paipaioa.com/combo/index.html";
            var combostring = '<link combofile="'+combofile.fileName
                +'" href="http://static.paipaiimg.com/c/='
                + combofile.comboLinks.join(',')
                +'?t=' +(+new Date)
                +'" />';

            try{
                chrome.tabs.create({
                    active: true,
                    url: url +'?str='+ encodeURIComponent(combostring)
                });
            }catch(e){}

        });
    });


});



