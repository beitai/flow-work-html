/**
 * 流程模型控制器
 *
 * @author wengwenhui
 * @date 2018年4月9日
 */
(function() {
  'use strict';
  // ,$validatorProvider
  angular.module('adminApp').controller('ModelerFlowController', function($scope,$window,$stateParams) {
    $scope.modelService = $scope.FlowService($scope.restUrl.flowModels);
    $scope.detailId = parseInt($stateParams.id || 0);
    $scope.queryParams = $scope.detailId===0 ? $scope.getCacheParams():{};
    $scope.queryParams.latestVersion = true;
    $scope.queryResult = {};
    $scope.selectedItem = null;
    $scope.lastVersion = false;
    $scope.versionNum = 0;
    
    $scope.categoryService = $scope.IdmService($scope.restUrl.idmTypes);
    $scope.category = null;

    $scope.queryDetail = function(id){
      $scope.modelService.get({
        urlPath : '/' + id
      }, function(response) {
        $scope.selectedItem = response;
        $scope.lastVersion = true;
        $scope.versionNum = response.version;
      });
    };

    // 做首字母中文的正则判断 
    // $validatorProvider.register('number', {
    //   invoke: 'watch',
    //   validator: /^[-+]?[0-9]*[\.]?[0-9]*$/,
    //   error: '字段必须是数字.'
    // });
    // ^[\u4e00-\u9fa5_a-zA-Z]+$  0-9

    // 查询流程图下的所有。
    $scope.queryModel = function() {
      $scope.modelService.get({
        params : $scope.queryParams
      }, function(response) {
        $scope.queryResult = response; 
      });

      // 查询出了流程图下的所有分类
      $scope.categoryService.get({ 
        urlPath : '/parentId/1'
      }, function(response) {
        $scope.category = response;  
      });
    };
    

    $scope.importModel = function() {
      $scope.editConfirmModal({
        formUrl: 'flow-model-import.html',
        title: '导入模型',
        hideFooter: true,
        property:{
          fileOptions:{
            fileuploaded : function(){$scope.queryModel();},
            uploadUrl: $scope.modelService.url+'/import?token='+$scope.loginUser.token,
            allowedFileExtensions:['bpmn','bpmn20.xml']
          }
        }
      });
    };
    
    $scope.deleteModel = function(id){
      $scope.confirmModal({
        title:'确认删除模型',
        confirm:function(){
          $scope.modelService.delete({
            urlPath : '/' + id
          }, function() {
            $scope.showSuccessMsg('删除模型成功');
            $scope.gotoList();
          });
        }
      });
    };

    $scope.deployModel = function(id){
      $scope.confirmModal({
        title:'确认部署模型',
        confirm:function(){
          $scope.modelService.post({
            urlPath : '/' + id +'/deploy'
          }, function() {
            $scope.showSuccessMsg('部署模型成功');
          });
        }
      });
    };
    
    $scope.exportModel = function(item){
      $scope.modelService.get({
        urlPath : '/' + item.id +'/xml'
      }, function(response) {
        $scope.windowExportFile(response,item.name+'-v'+item.version+'.bpmn20.xml');
      });
    };
    
    // 用来做分类的修改或添加
    $scope.editModel = function(id) { 
      $scope.editModal({
        id : id,
        formUrl: 'flow-model-edit.html',
        title : '模型',
        key : 'category',
        service : $scope.modelService,
        complete : function(){
          if(angular.isDefined(id)){
            $scope.queryDetail(id);
          }else{
            $scope.queryModel();
          }
        }
      });
    };
    
    $scope.copyModel = function(item) {
      $scope.editConfirmModal({
        formUrl: 'flow-model-edit.html',
        formData: item,
        title: '复制模型',
        confirm: function (formData,modalInstance) {
          if(formData.key === item.key){
            $scope.showErrorMsg('模型标识必须变更');
          }else{
            $scope.modelService.post({
              urlPath : '/'+item.id+'/copy',
              data: formData
            }, function () {
              $scope.showSuccessMsg('复制模型成功');
              modalInstance.close();
            });
          }
        }
      });
    };
    
    $scope.newestModel = function(item){
      $scope.confirmModal({
        title:'确认提升模型为最新版',
        confirm:function(){
          $scope.modelService.post({
            urlPath : '/'+item.id+'/newest'
          }, function(response) {
            $scope.showSuccessMsg('提升模型最新版成功');
            $scope.selectedItem = response;
            $scope.lastVersion = true;
            $scope.versionNum = response.version;
          });
        }
      });
    };
    
    $scope.queryHistory = function(key,version){
      $scope.modelService.get({
        urlPath : '/' + key + '/' +version
      }, function(response) {
        $scope.selectedItem = response;
        if($scope.versionNum === response.version){
          $scope.lastVersion = true;
        }else{
          $scope.lastVersion = false;
        }
      });
    };
    
    $scope.designModel = function(id){
      $window.open($scope.restUrl.flowDesign(id,$scope.loginUser.token));
    };

    $scope.getImageUrl = function(id){
      if(angular.isDefined(id)){
        return $scope.modelService.url +'/'+id+'/image.png?token='+$scope.loginUser.token;
      }
      return null;
    };
    
    $scope.versionArray = function(){
      var numArray = [];
      for(var i=$scope.versionNum; i>0 ;i--){
        numArray.push(i);
      }
      return numArray;
    };
    
    if($scope.detailId !== 0){
      $scope.queryDetail($scope.detailId);
    }else{
      $scope.queryModel();
    }

  });
  
})();
