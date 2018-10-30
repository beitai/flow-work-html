// 获取数据的一些接口
(function() {
	'use strict';

	angular.module('builder.constant', [])
	.constant('restUrl', {
		getModelJson : function(modelId) {
			return 'http://192.168.249.211:8083/form-layouts/' + modelId + '/json';
		},
		saveModelJson : function(modelId) {
			return 'http://192.168.249.211:8083/form-layouts/' + modelId + '/json';
		},
		getFormField : function() {
      return 'http://192.168.249.211:8083/form-fields';
    },
		getDefinitionJsonById : function(definitionId) {
			return 'http://192.168.249.211:8083/form-definitions/' + definitionId + '/json';
		},
		getDefinitionJsonByKey : function(definitionKey) {
			return 'http://192.168.249.211:8083/form-definitions/' + definitionKey + '/latest/json';
		},
		createInstance : function() {
			return 'http://http://192.168.249.211:8083/form-instances';
		},
		updateInstance : function(instanceId) {
			return 'http://192.168.249.211:8083/form-instances/'+instanceId;
		},
		getInstance : function(instanceId) {
			return 'http://192.168.249.211:8083/form-instances/'+instanceId;
		},
		getStencilSet : function() {
			return './stencilset.json?version=' + Date.now();
		}
	});

}).call(this);