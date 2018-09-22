/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * String controller
 */
//   这个是 字符串的控制器， 好奇，为什么 这里就能把key传过去，那边的就不可以？？
angular.module('flowableModeler').controller('FlowableStringPropertyCtrl', [ '$scope', function ($scope) {

	$scope.shapeId = $scope.selectedShape.id;
	$scope.valueFlushed = false;
    /** Handler called when input field is blurred */
    $scope.inputBlurred = function() {
    	$scope.valueFlushed = true;
    	if ($scope.property.value) {
    		$scope.property.value = $scope.property.value.replace(/(<([^>]+)>)/ig,"");
    	}
        $scope.updatePropertyInModel($scope.property);
    };

    $scope.enterPressed = function(keyEvent) {
        // if enter is pressed 如果输入被按下
        if (keyEvent && keyEvent.which === 13) {
            keyEvent.preventDefault();
            $scope.inputBlurred(); // we want to do the same as if the user would blur the input field
            // 我们想要做同样的事情，就像用户将模糊输入字段
        }
        // else; do nothing
    };
    
    $scope.$on('$destroy', function controllerDestroyed() {
    	if(!$scope.valueFlushed) {
    		if ($scope.property.value) {
        		$scope.property.value = $scope.property.value.replace(/(<([^>]+)>)/ig,"");
        	}
    		$scope.updatePropertyInModel($scope.property, $scope.shapeId);
    	}
    });

}]);

/*
 * Boolean controller
 */

angular.module('flowableModeler').controller('FlowableBooleanPropertyCtrl', ['$scope', function ($scope) {

    $scope.changeValue = function() {
        if ($scope.property.key === 'oryx-defaultflow' && $scope.property.value) {
            var selectedShape = $scope.selectedShape;
            if (selectedShape) {
                var incomingNodes = selectedShape.getIncomingShapes();
                if (incomingNodes && incomingNodes.length > 0) {
                    // get first node, since there can be only one for a sequence flow
                    var rootNode = incomingNodes[0];
                    var flows = rootNode.getOutgoingShapes();
                    if (flows && flows.length > 1) {
                        // in case there are more flows, check if another flow is already defined as default
                        for (var i = 0; i < flows.length; i++) {
                            if (flows[i].resourceId != selectedShape.resourceId) {
                                var defaultFlowProp = flows[i].properties.get('oryx-defaultflow');
                                if (defaultFlowProp) {
                                    flows[i].setProperty('oryx-defaultflow', false, true);
                                }
                            }
                        }
                    }
                }
            }
        }
        $scope.updatePropertyInModel($scope.property);
    };

}]);

/*
 * Text controller
 */

angular.module('flowableModeler').controller('FlowableTextPropertyCtrl', [ '$scope', '$modal', function($scope, $modal) {

    var opts = {
        template:  'views/properties/text-popup.html',
        scope: $scope
    };

    // Open the dialog
    _internalCreateModal(opts, $modal, $scope);
}]);

angular.module('flowableModeler').controller('FlowableTextPropertyPopupCtrl', ['$scope', function($scope) {
    
    $scope.save = function() {
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    $scope.close = function() {
        $scope.property.mode = 'read';
        $scope.$hide();
    };
}]);