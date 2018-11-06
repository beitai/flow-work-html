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
 * Execution listeners
 */
// 多选的控制器。
angular.module('flowableModeler').controller('FlowableMultiInstanceCtrl', [ '$scope','$http', function($scope,$http) {
    $scope.category = null; 

    if ($scope.property.value == undefined && $scope.property.value == null)
    {
    	$scope.property.value = '';
    }
    
    // $scope.querycategory = function(){  
    //     $scope.categoryService.get({ 
    //         path:"/moduleTypes/parentId/1"
    //     }, function(response) {
    //       $scope.category = response.data;
    //       console.log(response);
    //     });
    // }
    $http.get(FLOWABLE.CONFIG.contextRoot2 + '//moduleTypes/parentId/1')
        .success(function(response){
            $scope.category  = response;
            console.log($scope.category);
        })

    $scope.multiInstanceChanged = function() {
        // console.log($scope.property);
    	$scope.updatePropertyInModel($scope.property);
    };
}]);