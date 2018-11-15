/**
 * 系统常量定义
 *
 * @author wengwenhui
 * @date 2018年4月20日
 */
(function () {
  'use strict';

  angular.module('adminApp')
    .constant('contextRoot', {
        // flowService:'http://work.plumdo.com/flow-service',
        // identityService:'http://work.plumdo.com/identity-service',
         // formService:'http://work.plumdo.com/form-service'
      // flowService:'http://localhost:8084',
		  // formService:'http://localhost:8083',
      // identityService:'http://localhost:8082'
      flowService:'http://192.168.249.211:8084',
		  formService:'http://192.168.249.211:8083',
      identityService:'http://192.168.249.211:8082'
    })
    .constant('restUrl', {
      formTables: '/form-tables',
      formFields: '/form-fields',
      formLayouts: '/form-layouts',
      formDefinitions: '/form-definition',
      formFieldTypes:'/form-fieldTypes', 
      flowModels: '/models',
      flowDefinitions: '/process-definitions',
      flowInstances: '/process-instances',
      flowTasks: '/tasks',
      runTasks:'/runTasks',
      idmAuths: '/auths',
      idmUsers: '/users',
      idmGroups: '/groups',
      idmRoles: '/roles',
      idmMenus: '/menus',
      idmTypes: '/moduleTypes',
      log:'/loggers', 
      tasklog:'/task/logger', 
      token:'/auths/access_token',  
      formDesgin : function(modelId,token) {
        // return 'http://localhost:9002/#/design?modelId=' + modelId + '&token='+token;
        return 'http://192.168.249.211:66/form-modeler/#/design?modelId=' + modelId + '&token='+token;
      },
      formPreview : function(modelId) {
        // return 'http://localhost:9002/form-modeler/#/watch?modelId=' + modelId;
        return 'http://192.168.249.211:66/form-modeler/#/watch?modelId=' + modelId;
      },
      flowDesign : function(modelId,token) { 
        // return 'http://localhost:9001/flow-modeler/#/editor/' + modelId + '?token='+token;
        //  本地的
        // return 'http://localhost:9004/#/editor/' + modelId+'?token='+token;
        //  打包好的
        return 'http://192.168.249.211:66/flow-modeler/#/editor/' + modelId+'?token='+token;
        }

  });

})();