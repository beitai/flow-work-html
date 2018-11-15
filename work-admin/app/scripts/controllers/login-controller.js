/**
 * 登录窗口控制器
 *
 * @author wengwenhui
 * @date 2018年4月2日
 */
(function() {
  'use strict';

  angular.module('adminApp').controller('LoginController', [ '$scope','$window','$http', function($scope,$window,$http) {
    $scope.user = {};
    $scope.user.account='btz';
    $scope.user.password='111111'; 
    $scope.authService = $scope.IdmService($scope.restUrl.idmAuths); 
    
    // if(angular.isDefined($window.localStorage.token)){  
    //   // $scope.$state.go('main.home');
    //   $scope.$state.go('login');
    // }
    
    $scope.login = function() {   
      $scope.authService.post({
        urlPath : '/login',
        data : $scope.user
      }, function(response) {
        $window.localStorage.token = 'Bearer ' + response.token;
        $window.localStorage.userId = response.id;
        $window.localStorage.userName = response.name;
        $window.localStorage.userAvatar = response.avatar;
        $window.localStorage.access_token = response.access_token;
        $scope.$state.go('main.home');
      });
    }; 
  }]); 
})();
