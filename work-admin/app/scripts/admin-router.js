/**
 * 系统路由配置
 *
 * @author wengwenhui
 * @date 2018年4月20日 
 * 
 *    用到ui-route插件
 */
(function () {
  'use strict';
  
  angular.module('adminApp').config(
    function ($stateProvider, $urlRouterProvider) {
      //嵌套路由 
      $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller : 'LoginController'
      }).state('main', {
        url: '',
        templateUrl : 'views/main.html',
        controller : 'MainController',
        abstract : true
      }).state('main.blank', {
        url: '/blank',
        template: '<h1 class="text-center"> 页面不存在 </h1>'
      }).state('main.home', {
        url: '/home',
        template: '<h1 class="text-center"> 页面不存在 </h1>'
      }).state('main.modeler', {
        url: '/modeler',
        abstract: true,
        template: '<div ui-view></div>'
      }).state('main.modeler.form', {
        url: '/form?:id',
        controller: 'ModelerFormController',
        templateUrl: 'views/modeler/form.html'
      }).state('main.modeler.flow', {
        url: '/flow/?:id',
        controller: 'ModelerFlowController',
        templateUrl: 'views/modeler/flow.html'
      }).state('main.idm', {
        url: '/idm',
        abstract: true,
        template: '<div ui-view></div>'
      }).state('main.idm.user', {
        url: '/user',
        controller: 'UserController',
        templateUrl: 'views/idm/user.html'
      }).state('main.idm.group', {
        url: '/group/?:id',
        controller: 'GroupController',
        templateUrl: 'views/idm/group.html'
      }).state('main.idm.type', {
        url: '/type/?:id',
        controller: 'TypeController',
        templateUrl: 'views/idm/type.html'
      }).state('main.idm.menu', {
        url: '/menu/?:id',
        controller: 'MenuController',
        templateUrl: 'views/idm/menu.html'
      }).state('main.idm.role', {
        url: '/role',
        controller: 'RoleController',
        templateUrl: 'views/idm/role.html'
      }).state('main.flow', {
        url: '/flow',
        abstract: true,
        template: '<div ui-view></div>'
      }).state('main.flow.definition', {
        url: '/definition/?:id',
        controller: 'FlowDefinitionController',
        templateUrl: 'views/flow/definition.html'
      }).state('main.flow.instance', {
        url: '/instance/?:id',
        params: {
          processDefinitionId:null
        },
        controller: 'FlowInstanceController',
        templateUrl: 'views/flow/instance.html'
      }).state('main.flow.task', {
        url: '/task/?:id:status',
        controller: 'FlowTaskController',
        templateUrl: 'views/flow/task.html'
      }).state('main.flow.form', {
        url: '/form/?:id',
        controller: 'FlowFormController',
        templateUrl: 'views/flow/form.html'
      })
      // .state('main.flow.form', {
      //   url: '/form/?:id',
      //   controller: 'FlowFormController',
      //   templateUrl: 'views/flow/form.html'
      // })
      // .state('main.form', {
      //   url: '/form',
      //   abstract: true,
      //   template: '<div ui-view></div>'
      // })
      // .state('main.form.definition', {
      //   url: '/definition/?:id',
      //   controller: 'FormDefinitionController',
      //   templateUrl: 'views/form/definition.html'
      // })
      // .state('main.form.instance', {
      //   url: '/instance/?:id',
      //   params: {
      //     processDefinitionId:null
      //   },
      //   controller: 'FlowInstanceController',
      //   templateUrl: 'views/form/instance.html'
      // }) 
      ;

      $urlRouterProvider.otherwise('/modeler/flow/');
    });

})();
