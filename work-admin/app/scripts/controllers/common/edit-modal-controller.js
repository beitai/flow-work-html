/**
 * 弹出框默认的增加和修改操作
 *
 * @author wengwenhui
 * @date 2018年4月11日
 */
(function() {
  'use strict';
  //  默认为修改的模态框哇。 
  angular.module('adminApp').controller('EditModalController', function($scope, $uibModalInstance) {
    //  用来做类型的接口
    $scope.categoryService = $scope.IdmService($scope.restUrl.idmTypes);
    $scope.category = 0;
    $scope.formData = $scope.formData || {};
    
    $scope.querycategory = function(){  
      $scope.categoryService.get({ 
        urlPath : '/parentId/1'
      }, function(response) {
        $scope.category = response;
        // 要对其进行判断。  后期加上。
        // console.log(response);
      });
    }


    if ($scope.id) {
      $scope.modalTitle = "修改" + $scope.title;

      $scope.service.get({
        urlPath : '/' + $scope.id
      }, function(data) {
        $scope.formData = angular.extend($scope.formData, data);
      });

      $scope.ok = function() {
        $scope.service.put({
          urlPath : '/' + $scope.id,
          data : $scope.formData
        }, function() {
          $uibModalInstance.close();
          $scope.showSuccessMsg($scope.modalTitle + '成功');
          $scope.complete();
        });
      };

    } else {
      $scope.modalTitle = '添加' + $scope.title;
      $scope.ok = function() {
        $scope.service.post({
          data : $scope.formData
        }, function() {
          $uibModalInstance.close();
          $scope.showSuccessMsg($scope.modalTitle + '成功');
          $scope.complete();
        });
      };
    }

    if($scope.key == 'log'){
      console.log("日记输出")
      $scope.modalTitle = $scope.title;
      $scope.service.get({
        urlPath : '/' + $scope.id
      }, function(data) {
        // $scope.formData = angular.extend($scope.formData, data);
        $scope.log = data;
        $scope.name = $scope.username 
      });
    }


    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    
    $scope.querycategory();
  });
})();
