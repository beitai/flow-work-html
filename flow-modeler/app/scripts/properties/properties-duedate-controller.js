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
 * Due date  这个是节点到期时间的。。。。。。。。。。。
 */
'use strict';

angular.module('flowableModeler').controller('BpmnEditorDueDateCtrl', [ '$scope', '$modal', function($scope, $modal) {

    // Config for the modal window
    var opts = {
        template: 'views/properties/duedate-popup.html',
        scope: $scope
    };

    // Open the dialog
    _internalCreateModal(opts, $modal, $scope);
}]);

angular.module('flowableModeler').controller('BpmnEditorDueDatePopupCtrl',
    [ '$rootScope', '$scope', '$translate', function($rootScope, $scope, $translate) {

    // Put json representing assignment on scope 将json表示为范围的赋值
    if ($scope.property.value !== undefined && $scope.property.value !== null) {
    
        if ($scope.property.value.duedate !== undefined && $scope.property.value.duedate !== null) {
            $scope.popup = {'duedate': $scope.property.value.duedate};
        
        } else if ($scope.property.value.duedateExpression !== undefined && $scope.property.value.duedateExpression !== null) {
            $scope.popup = {'duedateExpression': $scope.property.value.duedateExpression};
            
        } else {
            $scope.popup = {'duedateExpression': $scope.property.value};
        }
    
    } else {
        $scope.popup = {};
    }
    // 上面的作用好像是用来初始化值的。。。。
    console.log($scope.property);
    console.log($scope.popup);
    
    $scope.taskDueDateOptions = [
        {id: "none", title: $translate.instant('PROPERTY.DUEDATE.TASK-DUE-DATE-OPTIONS.NO-DUEDATE')},
        {id: "expression", title: $translate.instant('PROPERTY.DUEDATE.TASK-DUE-DATE-OPTIONS.EXPRESSION')},
        // {id: "static", title: $translate.instant('PROPERTY.DUEDATE.TASK-DUE-DATE-OPTIONS.STATIC')},
        // {id: "field", title: $translate.instant('PROPERTY.DUEDATE.TASK-DUE-DATE-OPTIONS.FIELD')}
    ];
    
    if (!$scope.popup.duedate && !$scope.popup.duedateExpression) {
        // Default, first time opening the popup
        $scope.popup.selectedDueDateOption = $scope.taskDueDateOptions[0].id;
        
    } else if (!$scope.popup.duedate) {
        $scope.popup.selectedDueDateOption = $scope.taskDueDateOptions[1].id;
        
    } else {
        
        if ($scope.popup.duedate.fixed) {
            $scope.popup.selectedDueDateOption = $scope.taskDueDateOptions[2].id;
            
        } else if ($scope.popup.duedate.field) {
            $scope.popup.selectedDueDateOption = $scope.taskDueDateOptions[3].id;
        
        } else {
            $scope.popup.selectedDueDateOption = $scope.taskDueDateOptions[0].id;
        }
    }
    
    $scope.dueDateOptionChanged = function() {
        if ($scope.popup.selectedDueDateOption === 'expression') {
            $scope.popup.duedate = undefined;
        
        } else if ($scope.popup.selectedDueDateOption === 'none') {
            $scope.popup.duedate = undefined;
            $scope.popup.duedateExpression = undefined;
        
        } else if ($scope.popup.selectedDueDateOption === 'static') {
            $scope.popup.duedate = {'fixed': {}};
            $scope.popup.duedateExpression = undefined;
        
        } else if ($scope.popup.selectedDueDateOption === 'field') {
            $scope.popup.duedate = {'field': {}};
            $scope.popup.duedateExpression = undefined;
        }
    };
    
    $scope.setAddCalculationType = function() {
        $scope.popup.duedate.field.taskDueDateCalculationType = 'add';
    };
    
    $scope.setSubtractCalculationType = function() {
        $scope.popup.duedate.field.taskDueDateCalculationType = 'subtract';
    };

    $scope.allSteps = EDITOR.UTIL.collectSortedElementsFromPrecedingElements($scope.selectedShape);

    $scope.save = function () {
        console.log($scope.popup.duedateExpression); 
        $scope.property.value = new Date($scope.popup.duedateExpression);
        // $scope.property.value = $scope.popup.duedateExpression;
        // $scope.property.value = {};
        // if ($scope.popup.duedate) {
        //     $scope.property.value.duedate = $scope.popup.duedate;
            
        // } else if ($scope.popup.duedateExpression) {
        //     $scope.property.value.duedateExpression = $scope.popup.duedateExpression;
        
        // } else {
        //     $scope.property.value = '';
        // }
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    // Close button handler
    $scope.close = function() {
    	$scope.property.mode = 'read';
    	$scope.$hide();
    };


}]).directive('datetimePicker', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var config = scope.$eval(attrs.datetimePicker) || {};
        config.autoclose = config.autoclose || true;
        config.todayBtn = config.todayBtn || true;
        config.showSeconds = config.showSeconds || true;
        config.format = config.format || 'yyyy-mm-dd hh:ii:ss';
        config.language = config.language || 'zh-CN';
        element.datetimepicker(config); 
      }
    };
  })
//   input 时间格式化的指令
  .directive('dateFormat', ['$filter',function($filter) {
    var dateFilter = $filter('date');
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
 
            function formatter(value) {
                return dateFilter(value, 'yyyy-MM-dd HH:mm:ss'); //format
            }
            // function parser() {
            //     return ctrl.$modelValue;
            // }
            ctrl.$formatters.push(formatter);
            // ctrl.$parsers.unshift(parser);
 
        }
    };
}]); 


 