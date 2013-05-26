/**
 * @desc ECD COMBO TOOL POPUP
 * @author jiguang
 * @mail jiguang1984#gmail.com
 * @date 2013-05-24
 */

$(function(){

    var background = chrome.extension.getBackgroundPage();

    background.getCurrentComboFile(function(data){

        var combofile;

        try{
            combofile = JSON.parse(data.combofile);
        }catch(e){}

        // 生成待更新文件列表
        function generateUpdateList(){
            var template = '<li>{{path}}</li>';
            var tempNode;
            var $updateList = $('#updateList');

            if(combofile.fileName && combofile.comboLinks.length > 0){
                $updateList.empty();

                for(var i = 0, j = combofile.comboLinks.length; i<j; i++){
                    tempNode = template.replace('{{path}}', combofile.comboLinks[i]);
                    $updateList.append($(tempNode));
                }
            }
        }

        // 获取待更新文件列表
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

        // 生成待更新的文件列表
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

});



