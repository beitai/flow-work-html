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

angular.module('flowableModeler').controller('FlowableFormReferenceDisplayCtrl',
    ['$scope', '$modal', '$http', function ($scope, $modal, $http) { 
        // console.log("-----------------------表单");
        // console.log($scope.property);
        if ($scope.property && $scope.property.value) {
            // /form-byteArray/{id}   /app/rest/models/ && $scope.property.value.id
            $http.get(FLOWABLE.CONFIG.contextRoot1 + '/form-definition?key=' + $scope.property.value)
                .success(
                    function (response) {
                        // console.log("点击时候出来的值");
                        // console.log(response);
                        $scope.form = response.data[0];
                        // $scope.form = {
                        //     id: response.id,
                        //     name: response.name,
                        //     key: response.key,
                        // };
                    });
        }

    }]);
    angular.module('flowableModeler').controller('FlowableFormReferenceDisplayCtrl1',
    ['$scope', '$modal', '$http', function ($scope, $modal, $http) { 
        console.log("-----------------------用户"); 
        console.log($scope.property);
        $scope.users = [];
        // 把各个用户的id给取出来
        $scope.value = $scope.property.value.split(","); 
        console.log($scope.value);
        if ($scope.property && $scope.property.value ) {
            // /form-byteArray/{id}   /app/rest/models/  && $scope.property.value.id
            angular.forEach($scope.value,function(value){
                // console.log(value); 
                     $http.get(FLOWABLE.CONFIG.contextRoot2  + '/users/' + value)
                .success(function (response) {
                        // console.log("点击时候出来的值---用户 查询成功");
                        // console.log(response);
                        // $scope.form = {
                        //     id: response.id,
                        //     name: response.name, 
                        // };
                        $scope.users.push(response);
                        // 所有的启动组
                        // console.log($scope.users);
                    }); 
            })
        }

    }]);
// 表单
angular.module('flowableModeler').controller('FlowableFormReferenceCtrl',
    ['$scope', '$modal', '$http', function ($scope, $modal, $http) {

        // Config for the modal window
        var opts = {
            template: 'views/properties/form-reference-popup.html',
            scope: $scope
        };

        // Open the dialog
        _internalCreateModal(opts, $modal, $scope);
    }]);
// 用户
angular.module('flowableModeler').controller('FlowableFormReferenceCtrl1',
    ['$scope', '$modal', '$http', function ($scope, $modal, $http) {

        // Config for the modal window
        var opts = {
            template: 'views/properties/form-reference-popup2.html',
            scope: $scope
        };

        // Open the dialog
        _internalCreateModal(opts, $modal, $scope);
    }]);

angular.module('flowableModeler').controller('FlowableFormReferencePopupCtrl',
    ['$rootScope', '$scope', '$http', '$location', 'editorManager', function ($rootScope, $scope, $http, $location, editorManager) {

        $scope.state = { 'loadingForms': true, 'formError': false };

        $scope.popup = { 'state': 'formReference' };

        $scope.foldersBreadCrumbs = [];

        // Close button handler
        $scope.close = function () {
            $scope.property.mode = 'read';
            $scope.$hide();
        };

        // Selecting/deselecting a subprocess  选择/取消选择子流程??
        $scope.selectForm = function (form, $event) {
            $event.stopPropagation();
            if ($scope.selectedForm && $scope.selectedForm.id && form.id == $scope.selectedForm.id) {
                // un-select the current selection  取消选择当前选择
                $scope.selectedForm = null;
            } else {
                $scope.selectedForm = form;
            }
        };

        // Saving the selected value
        $scope.save = function () {
            if ($scope.selectedForm) {
                $scope.property.value = {
                    'id': $scope.selectedForm.id,
                    'name': $scope.selectedForm.name,
                    'key': $scope.selectedForm.key
                };
            } else {
                $scope.property.value = null;
            }

            $scope.property.value =  $scope.selectedForm;
            $scope.updatePropertyInModel($scope.property);
            $scope.close();
        };

        // Open the selected value
        $scope.open = function () {
            if ($scope.selectedForm) {
                $scope.property.value = {
                    'id': $scope.selectedForm.id,
                    'name': $scope.selectedForm.name,
                    'key': $scope.selectedForm.key,
                    // 'deploySourceId':$scope.selectedForm.deploySourceId,
                };
                $scope.property.value =  $scope.selectedForm.key; 
                console.log("修改成功：  key为")
                console.log($scope.property);
                // console.log($scope.property.value);
                $scope.updatePropertyInModel($scope.property); 

                var modelMetaData = editorManager.getBaseModelData();
                var json = editorManager.getModel();
                json = JSON.stringify(json);

                // var params = {
                //     modeltype: modelMetaData.model.modelType,
                //     json_xml: json,
                //     name: modelMetaData.name,
                //     key: modelMetaData.key,
                //     description: modelMetaData.description,
                //     newversion: false,
                //     lastUpdated: modelMetaData.lastUpdated
                // };
                var params = {
                    modeltype: modelMetaData.model.modelType,
                    jsonXml: json,
                    name: modelMetaData.name,
                    key: modelMetaData.key,
                    description: modelMetaData.description,
                    newversion: false,
                    comment: '',
                    lastUpdated: modelMetaData.lastUpdated
                };

                // Update
                // $http({ method: 'POST',
                //     data: params,
                //     ignoreErrors: true,
                //     headers: {'Accept': 'application/json',
                //               'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                // transformRequest: function (obj) {
                //     var str = [];
                //     for (var p in obj) {
                //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                //     }
                //     return str.join("&");
                // },
                $http({
                    method: 'POST',
                    data: params,
                    ignoreErrors: true,
                    headers: {
                        'Token': editorManager.getToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    url: FLOWABLE.URL.putModel(modelMetaData.modelId)
                })

                    .success(function (data, status, headers, config) {
                        editorManager.handleEvents({
                            type: ORYX.CONFIG.EVENT_SAVED
                        });

                        var allSteps = EDITOR.UTIL.collectSortedElementsFromPrecedingElements($scope.selectedShape);

                        $rootScope.addHistoryItem($scope.selectedShape.resourceId);
                        // $location.path('form-editor/' + $scope.selectedForm.id);

                    })
                    .error(function (data, status, headers, config) {

                    });

                $scope.close();
            }
        };

        $scope.newForm = function () {
            $scope.popup.state = 'newForm';

            var modelMetaData = editorManager.getBaseModelData();

            $scope.model = {
                loading: false,
                form: {
                    name: '',
                    key: '',
                    description: '',
                    modelType: 2
                }
            };
        };

        $scope.createForm = function () {

            if (!$scope.model.form.name || $scope.model.form.name.length == 0 ||
                !$scope.model.form.key || $scope.model.form.key.length == 0) {

                return;
            }

            $scope.model.loading = true;

            $http({ method: 'POST', url: FLOWABLE.CONFIG.contextRoot + '/app/rest/models', data: $scope.model.form }).
                success(function (data, status, headers, config) {

                    var newFormId = data.id;
                    $scope.property.value = {
                        'id': newFormId,
                        'name': data.name,
                        'key': data.key
                    };
                    $scope.updatePropertyInModel($scope.property);

                    var modelMetaData = editorManager.getBaseModelData();
                    var json = editorManager.getModel();
                    json = JSON.stringify(json);

                    var params = {
                        modeltype: modelMetaData.model.modelType,
                        json_xml: json,
                        name: modelMetaData.name,
                        key: modelMetaData.key,
                        description: modelMetaData.description,
                        newversion: false,
                        // lastUpdated: modelMetaData.lastUpdated
                    };

                    // Update
                    $http({
                        method: 'POST',
                        data: params,
                        ignoreErrors: true,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj) {
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            }
                            return str.join("&");
                        },
                        url: FLOWABLE.URL.putModel(modelMetaData.modelId)
                    })

                        .success(function (data, status, headers, config) {
                            editorManager.handleEvents({
                                type: ORYX.CONFIG.EVENT_SAVED
                            });

                            $scope.model.loading = false;
                            $scope.$hide();

                            var allSteps = EDITOR.UTIL.collectSortedElementsFromPrecedingElements($scope.selectedShape);

                            $rootScope.addHistoryItem($scope.selectedShape.resourceId);
                            $location.path('form-editor/' + newFormId);

                        })
                        .error(function (data, status, headers, config) {
                            $scope.model.loading = false;
                            $scope.$hide();
                        });

                }).
                error(function (data, status, headers, config) {
                    $scope.model.loading = false;
                    $scope.model.errorMessage = data.message;
                });
        };

        $scope.cancel = function () {
            $scope.close();
        };
        // 查询所有表单
        $scope.loadForms = function () {
            var modelMetaData = editorManager.getBaseModelData();
            $http.get(FLOWABLE.CONFIG.contextRoot1 + '/form-definition')
                .success(
                    function (response) {
                        $scope.state.loadingForms = false;
                        $scope.state.formError = false;
                        $scope.forms = response.data;
                    })
                .error(
                    function (data, status, headers, config) {
                        $scope.state.loadingForms = false;
                        $scope.state.formError = true;
                    });
        };

        if ($scope.property && $scope.property.value && $scope.property.value.id) {
            $scope.selectedForm = $scope.property.value;
        }

        $scope.loadForms();
    }]);

    // 这个是用户弹出框的控制器
angular.module('flowableModeler').controller('FlowableFormReferencePopupCtrl1',
    ['$rootScope', '$scope', '$http', '$location', 'editorManager', function ($rootScope, $scope, $http, $location, editorManager) {
        $scope.state = { 'loadingForms': true, 'formError': false };
        $scope.popup = { 'state': 'formReference' };
        $scope.close = function () {
            $scope.property.mode = 'read';
            $scope.$hide();
        };
        $scope.open = function () {
            if ($scope.selectedForm) {
                $scope.property.value = {
                    'id': $scope.selectedForm.id,
                    'name': $scope.selectedForm.name,
                    // 'key': $scope.selectedForm.key,
                    // 'deploySourceId':$scope.selectedForm.deploySourceId,
                };
                // $scope.property.value =  $scope.selectedForm.id;
                // 重新定义一个name 给  他
                // $scope.property.name = $scope.selectedForm.name; 
                $scope.property.value =  $scope.selectedForm.id;
                console.log("修改成功:id为")
                console.log($scope.property);
                console.log($scope.property.value);
                $scope.updatePropertyInModel($scope.property);  

                var modelMetaData = editorManager.getBaseModelData();
                var json = editorManager.getModel();
                json = JSON.stringify(json);

                // var params = {
                //     modeltype: modelMetaData.model.modelType,
                //     json_xml: json,
                //     name: modelMetaData.name,
                //     key: modelMetaData.key,
                //     description: modelMetaData.description,
                //     newversion: false,
                //     lastUpdated: modelMetaData.lastUpdated
                // };
                var params = {
                    modeltype: modelMetaData.model.modelType,
                    jsonXml: json,
                    name: modelMetaData.name,
                    key: modelMetaData.key,
                    description: modelMetaData.description,
                    newversion: false,
                    comment: '',
                    lastUpdated: modelMetaData.lastUpdated
                };

                // Update
                // $http({ method: 'POST',
                //     data: params,
                //     ignoreErrors: true,
                //     headers: {'Accept': 'application/json',
                //               'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                // transformRequest: function (obj) {
                //     var str = [];
                //     for (var p in obj) {
                //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                //     }
                //     return str.join("&");
                // },
                $http({
                    method: 'POST',
                    data: params,
                    ignoreErrors: true,
                    headers: {
                        'Token': editorManager.getToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    url: FLOWABLE.URL.putModel(modelMetaData.modelId)
                })

                    .success(function (data, status, headers, config) {
                        editorManager.handleEvents({
                            type: ORYX.CONFIG.EVENT_SAVED
                        });
                        // var allSteps = EDITOR.UTIL.collectSortedElementsFromPrecedingElements($scope.selectedShape);
                        $rootScope.addHistoryItem($scope.selectedShape.resourceId);
                        // $location.path('form-editor/' + $scope.selectedForm.id);

                    })
                    .error(function (data, status, headers, config) {

                    });

                $scope.close();
            }
        };
        // 判断是否选择成功 
        $scope.selectForm = function (form, $event) {
            $event.stopPropagation();
            if ($scope.selectedForm && $scope.selectedForm.id && form.id == $scope.selectedForm.id) {
                // un-select the current selection  取消选择当前选择
                $scope.selectedForm = null;
            } else {
                $scope.selectedForm = form;
            }
        };
        $scope.cancel = function () {
            $scope.close();
        };
        $scope.loadForms = function () {
            var modelMetaData = editorManager.getBaseModelData();
            $http.get(FLOWABLE.CONFIG.contextRoot2 + '/users')
                .success(
                    function (response) {
                        $scope.state.loadingForms = false;
                        $scope.state.formError = false;
                        $scope.forms = response.data;
                    })
                .error(
                    function (data, status, headers, config) {
                        $scope.state.loadingForms = false;
                        $scope.state.formError = true;
                    });
        };

        $scope.loadForms();
    }]);

 

    
// 这个是用户弹出框的控制器  用户启动组的
angular.module('flowableModeler').controller('FlowableFormReferencePopupCtrl2',
['$rootScope', '$scope', '$http', '$location', 'editorManager', function ($rootScope, $scope, $http, $location, editorManager) {
 
   
    $scope.state = { 'loadingForms': true, 'formError': false };
    $scope.popup = { 'state': 'formReference' };
    $scope.close = function () {
        $scope.property.mode = 'read';
        $scope.$hide();
    };
    // console.log("")
    $scope.open = function () {
        if ($scope.selected) {
            // $scope.property.value = {
            //     'id': $scope.selectedForm.id,
            //     'name': $scope.selectedForm.name,
                // 'key': $scope.selectedForm.key,
                // 'deploySourceId':$scope.selectedForm.deploySourceId,
            // };
            // $scope.property.value =  $scope.selectedForm.id;
            // 重新定义一个name 给  他
            // $scope.property.name = $scope.selectedForm.name; 
            console.log($scope.selected);
            $scope.value = ""
            angular.forEach($scope.selected,function(value,key){ 
                if($scope.selected.length ==key+1 ){
                    $scope.value += value.id 
                }else{
                    $scope.value += value.id + ","
                }
            })
            $scope.property.value =  $scope.value;
            // $scope.property.value =  $scope.selected;
            console.log("修改成功:id为")
            console.log($scope.property);
            console.log($scope.property.value);
            $scope.updatePropertyInModel($scope.property);  

            var modelMetaData = editorManager.getBaseModelData();
            // 这个json 就是获取到的哇。。。。。。。。。。。。。。。
            var json = editorManager.getModel();
            json = JSON.stringify(json);
            var params = {
                modeltype: modelMetaData.model.modelType,
                jsonXml: json,
                name: modelMetaData.name,
                key: modelMetaData.key,
                description: modelMetaData.description,
                newversion: false,
                comment: '',
                lastUpdated: modelMetaData.lastUpdated
            };
            $http({
                method: 'POST',
                data: params,
                ignoreErrors: true,
                headers: {
                    'Token': editorManager.getToken(),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                url: FLOWABLE.URL.putModel(modelMetaData.modelId)
            })
                .success(function (data, status, headers, config) {
                    editorManager.handleEvents({
                        type: ORYX.CONFIG.EVENT_SAVED
                    });
                    // var allSteps = EDITOR.UTIL.collectSortedElementsFromPrecedingElements($scope.selectedShape);
                    $rootScope.addHistoryItem($scope.selectedShape.resourceId);
                    // $location.path('form-editor/' + $scope.selectedForm.id);

                })
                .error(function (data, status, headers, config) {

                });

            $scope.close();
        }
    };
    // 判断是否选择成功 
    // $scope.selectForm = function (form, $event) {
    //     $event.stopPropagation();
    //     if ($scope.selectedForm && $scope.selectedForm.id && form.id == $scope.selectedForm.id) {
    //         // un-select the current selection  取消选择当前选择
    //         $scope.selectedForm = null;
    //     } else {
    //         $scope.selectedForm = form;
    //     }
    //     // $scope.forms = $scope.loadForms()
    //     // console.log($scope.forms);
    // };
    $scope.selected = [];
    // 判断是否选择成功 
    $scope.selectForm = function (form, $event) { 
        $event.stopPropagation();
        var checkbox = $event.target; 
        // checkbox.checked 当为复选框是，  选中为true,没选中为false, 当单击的不是复选框框时为undefined
        // console.log(checkbox.checked);
        // 判断选中的复选框的值的下标。。。。   不怎么懂。
        // console.log($scope.selected.indexOf(form));
        if(checkbox.checked != undefined){
            var action = (checkbox.checked ? 'add' : 'remove'); 
            if (action == 'add' && $scope.selected.indexOf(form) == -1) {
                $scope.selected.push(form);
            }
            if (action == 'remove' && $scope.selected.indexOf(form) != -1) {
                var idx = $scope.selected.indexOf(form);
                $scope.selected.splice(idx, 1);
            }
        }
        // console.log("測試------------");
        // console.log($scope.selected);
        if ($scope.selectedForm && $scope.selectedForm.id && form.id == $scope.selectedForm.id) {
            // un-select the current selection  取消选择当前选择
            // $scope.selectedForm = null;
        } else {
            // $scope.selectedForm = form;
        }
    };

    $scope.isselect = function(id){  
        var result = false;
        angular.forEach($scope.selected,function(value){ 
            if(id == value.id){
                result = true;
            } 
        }) 
        return result; 
    }

    $scope.cancel = function () {
        $scope.close();
    };
    
    console.log($scope);
    console.log($scope.property.value);
    if($scope.property.value!=null || $scope.property.value!=''){
        $scope.checked_user = $scope.property.value.split(','); 
    }

    $scope.loadForms = function () {
        var modelMetaData = editorManager.getBaseModelData();
        // $http.get(FLOWABLE.CONFIG.contextRoot2 + '/groups/3/users')
        $http.get(FLOWABLE.CONFIG.contextRoot2 + '/users')
            .success(
                function (response) {
                    $scope.state.loadingForms = false;
                    $scope.state.formError = false;
                    // $scope.forms = response.data;
                    // console.log(response.data);
                    $scope.forms = response.data;
                    angular.forEach($scope.forms,function(value){
                        angular.forEach($scope.checked_user,function(value1){ 
                            if(value.id == value1){  
                                $scope.selected.push(value);
                                // console.log(value.id);  将已经选择的给弄出来
                            }
                        })
                        
                    });
                    console.log(response);
                })
            .error(
                function (data, status, headers, config) {
                    $scope.state.loadingForms = false;
                    $scope.state.formError = true;
                });
        return $scope.forms;
    };
 
    $scope.loadForms(); 
}]);

