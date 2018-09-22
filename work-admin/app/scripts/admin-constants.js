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
      flowService:'http://61.160.207.86:8084',
		  formService:'http://61.160.207.86:8083',
      identityService:'http://61.160.207.86:8082'
    })
    .constant('restUrl', {
      formTables: '/form-tables',
      formFields: '/form-fields',
      formLayouts: '/form-layouts',
      formDefinitions: '/form-definition', 
      flowModels: '/models',
      flowDefinitions: '/process-definitions',
      flowInstances: '/process-instances',
      flowTasks: '/tasks',
      idmAuths: '/auths',
      idmUsers: '/users',
      idmGroups: '/groups',
      idmRoles: '/roles',
      idmMenus: '/menus',
      idmTypes: '/moduleTypes',
      log:'/loggers',
      formDesgin : function(modelId,token) {
        return 'http://localhost:9002/#/design?modelId=' + modelId + '&token='+token;
      },
      formPreview : function(modelId) {
        return 'http://localhost:9002/form-modeler/#/watch?modelId=' + modelId;
      },
      flowDesign : function(modelId,token) { 
        // return 'http://localhost:9001/flow-modeler/#/editor/' + modelId + '?token='+token;
        //  return 'http://localhost:9001/flow-modeler/#/editor/' + modelId+'?token='+token;
        
        return 'http://localhost:9004/#/editor/' + modelId+'?token='+token;
      
    }
  });

})();