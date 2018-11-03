/**
 * 页面总入口，定义依赖的第三方库，定义共有方法，变量
 * 
 * @author wengwh
 */
(function() {
  'use strict';

  angular.module('adminApp',[
    'ui.router', 
    'ui.router.state.events', 
    'ui.bootstrap', 
    'cgNotify', 
    'isteven-multi-select',
    'toggle-switch',
    'localytics.directives',
    'perfect_scrollbar',
    'builder.directive',
  ]).run(function($rootScope, notify, $state, $timeout, $uibModal, RestService, contextRoot, restUrl) {
    // 根内容
    $rootScope.contextRoot = contextRoot;
    // 接口地址
    $rootScope.restUrl = restUrl;
    $rootScope.FlowService = RestService(contextRoot.flowService);
    $rootScope.FormService = RestService(contextRoot.formService);
    $rootScope.IdmService = RestService(contextRoot.identityService);
    // 登录用户(用来判断是否登录)
    $rootScope.loginUser = {};
    // 状态？
    $rootScope.$state = $state;
    // 暂时不知道是啥 用来显示和隐藏 页面进展
    $rootScope.progressNum = 0;
    // 参数的缓存
    $rootScope.cacheParams = {};
    
    $rootScope.getCacheParams = function(key){
      if(angular.isUndefined(key)){
        return $rootScope.cacheParams;
      }
      if(angular.isUndefined($rootScope.cacheParams[key])){
        $rootScope.cacheParams[key]={};
      }
      return $rootScope.cacheParams[key];
    };
    
    $rootScope.clearCacheParams = function(){
      for(var key in $rootScope.cacheParams){
        $rootScope.removeCacheParams(key);
      }
    };
    
    $rootScope.removeCacheParams = function(key){
      if(angular.isDefined($rootScope.cacheParams[key])){
        delete $rootScope.cacheParams[key];
      }
    };

    $rootScope.showProgress = function(msg) {
      $rootScope.progressNum++;
      if (msg) {
        $rootScope.showMsg(msg);
      }
    };

    $rootScope.hideProgress = function(msg, isFail) {
      $rootScope.progressNum--;
      if (msg) {
        if (isFail && isFail === true) {
          $rootScope.showErrorMsg(msg);
        } else {
          $rootScope.showMsg(msg);
        }
      }
    };
    // 消息通知框
    $rootScope.showSuccessMsg = function(msg) {
      $rootScope.showMsg(msg, 1500, 'notify-success');
    };

    $rootScope.showErrorMsg = function(msg) {
      $rootScope.showMsg(msg, 3000, 'notify-error');
    };

    // 封装的方法
    $rootScope.showMsg = function(msg, duration, classes) {
      notify({
        message : msg,
        duration : duration,
        position : 'center',
        classes : classes || 'notify-success'
      });
    };

    // 公共的模态框
    $rootScope.confirmModal = function(args) {
      $uibModal.open({
        templateUrl : 'views/common/confirm-modal.html',
        controller : function($scope, $uibModalInstance) {
          $scope.modalTitle = angular.copy(args.title);
          $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
          };
          $scope.ok = function() {
            $uibModalInstance.close();
            args.confirm();
          };
        }
      });
    };
    // 编辑
    $rootScope.editModal = function(args) {
      $uibModal.open({
        templateUrl : 'views/common/edit-modal.html',
        controller : 'EditModalController',
        scope : angular.extend($rootScope.$new(),args)
      });
    };
    // 编辑  新添加一个用来搞联级导航的。
    $rootScope.navModal = function(args) {
      $uibModal.open({
        templateUrl : 'views/common/edit-modal.html',
        // controller : 'FlowDefinitionController',
        controller : 'EditModalController',
        scope : angular.extend($rootScope.$new(),args)
      });
    };

    $rootScope.editConfirmModal = function (args) {
      $uibModal.open({
        templateUrl: 'views/common/edit-modal.html',
        controller: function ($scope, $uibModalInstance) {
          angular.extend($scope,args.property);
          
          $scope.modalTitle = angular.copy(args.title);
          $scope.formData = angular.copy(args.formData) || {};
          $scope.formUrl = angular.copy(args.formUrl);
          $scope.hideFooter = angular.copy(args.hideFooter);
          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
          $scope.ok = function () {
            args.confirm($scope.formData,$uibModalInstance);
          };
        }
      });
    };
    
    $rootScope.tableModal = function(args) {
      $uibModal.open({
        template : '<div class="modal-body"><table ng-table="tableOptions" class="table table-striped ng-table"></table></div>',
        controller : 'TableModalController',
        scope : angular.extend($rootScope.$new(),args)
      });
    };
    // 状态的还不知道干嘛用的      。。。。列表和详细信息？
    // 返回上一层
    // 用来开启流程图的。
    $rootScope.gotoDetail = function(id){
      $state.go($state.current,{id:id});
      // console.log($state.current);
      // console.log(id);
    };
    $rootScope.gotoDetail1 = function(id,status){ 
      //任务的详情，多加了一个 状态，用来判断是否有那个，status
      $state.go($state.current,{id:id,status:status});  
    };
    // 列表 
    $rootScope.gotoList = function(id){
      $state.go($state.current,{id:id});
    };

    // 选择框插件的
    $rootScope.multiSelectLang = {
        selectAll       : "全选",
        selectNone      : "全部不选",
        reset           : "重置",
        search          : "搜索",
        nothingSelected : "没有选项被选中" 
    };
    
    // 也不知道啥意思，很懵B 一秒之后执行的？  导出
    $rootScope.windowExportFile = function(data,fileName){
      $rootScope.showProgress();
      $timeout(function() {
        fileName = decodeURI(fileName);
        var url = URL.createObjectURL(new Blob([ data ]));
        var a = document.createElement('a');
        document.body.appendChild(a); 
        a.href = url;
        a.download = fileName;
        a.target = '_blank';
        a.click();
        a.remove();
        $rootScope.hideProgress();
      }, 1000);
    };
    // to_trusted 是格式化
  }).filter('to_trusted', [ '$sce', function($sce) {
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }]).config(['$qProvider', function ($qProvider) {
    if($qProvider.errorOnUnhandledRejections){
      $qProvider.errorOnUnhandledRejections(false);
    }
  }]);

})();
