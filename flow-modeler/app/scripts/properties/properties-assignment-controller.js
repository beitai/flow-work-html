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
 * Assignment
 */
'use strict';
// 有关受理人的控制器
angular.module('flowableModeler').controller('FlowableAssignmentCtrl', ['$scope', '$modal', function ($scope, $modal) {

    // Config for the modal window
    var opts = {
        template: 'views/properties/assignment-popup.html',
        scope: $scope
    };

    // Open the dialog
    _internalCreateModal(opts, $modal, $scope);
}]);

//  做一个选择潜在启动组的控制器
angular.module('flowableModeler').controller('FlowableAssignmentCtrl1', ['$scope', '$modal', function ($scope, $modal) {
    // Config for the modal window
    var opts = {
        template: 'views/properties/assignment-popup1.html',
        scope: $scope
    };

    // Open the dialog
    _internalCreateModal(opts, $modal, $scope);
}]);

// 做一个可阅人的控制器
//  做一个选择潜在启动组的控制器
angular.module('flowableModeler').controller('FlowableAssignmentCtrl2', ['$scope', '$modal', function ($scope, $modal) {
    // Config for the modal window
    var opts = {
        template: 'views/properties/assignment-popup2.html',
        scope: $scope
    };

    // Open the dialog
    _internalCreateModal(opts, $modal, $scope);
}]);

angular.module('flowableModeler').controller('FlowableAssignmentPopupCtrl',
    ['$rootScope', '$scope', '$translate', '$http', 'UserService', 'GroupService', function ($rootScope, $scope, $translate, $http, UserService, GroupService) {
        
        // Put json representing assignment on scope 将json表示为范围的赋值
        if ($scope.property.value !== undefined && $scope.property.value !== null
            && $scope.property.value.assignment !== undefined
            && $scope.property.value.assignment !== null) {

            $scope.assignment = $scope.property.value.assignment;

        } else {
            $scope.assignment = { type: 'idm' };
        }
        
        $scope.assignment.type = 'static';

        $scope.popup = {
            assignmentObject: {
                type: $scope.assignment.type,
                fs:'',
                idm: {
                    type: undefined,
                    assignee: undefined,
                    candidateUsers: [],
                    candidateGroups: []
                },
                static: {
                    assignee: undefined,
                    candidateUsers: [],
                    candidateGroups: [],
                    candireadUsers: []
                }, 
            }
        };


        $scope.assignmentOptions = [
            { id: "initiator", title: $translate.instant('PROPERTY.ASSIGNMENT.IDM.DROPDOWN.INITIATOR') },
            { id: "user", title: $translate.instant('PROPERTY.ASSIGNMENT.IDM.DROPDOWN.USER') },
            // { id: "users", title: $translate.instant('PROPERTY.ASSIGNMENT.IDM.DROPDOWN.USERS') },
            // { id: "groups", title: $translate.instant('PROPERTY.ASSIGNMENT.IDM.DROPDOWN.GROUPS') }
        ];

        if ($scope.assignment.idm && $scope.assignment.idm.type) {
            for (var i = 0; i < $scope.assignmentOptions.length; i++) {
                if ($scope.assignmentOptions[i].id == $scope.assignment.idm.type) {
                    $scope.assignmentOption = $scope.assignmentOptions[i];
                    break;
                }
            }
        }
        // console.log($scope.popup);
        // console.log($scope.assignment);

        // 把单选或者全选的状态给赋值进去；
        if($scope.assignment.fs!=null){
            $scope.popup.assignmentObject.fs = $scope.assignment.fs;
        }

        // fill the IDM area  填写IDM区域  不知道什么意思
        if (!$scope.assignmentOption) {
            // Default, first time opening the popup Default, 默认，第一次打开弹出窗口
            $scope.assignmentOption = $scope.assignmentOptions[0];
        } else {
            // Values already filled   看怎么那个 user的值  $scope.popup.assignmentObject.idm.assignee 表示用户
            if ($scope.assignment.idm) { //fill the IDM tab
                if ($scope.assignment.idm.assignee) {
                    if ($scope.assignment.idm.assignee.id) {
                        $scope.popup.assignmentObject.idm.assignee = $scope.assignment.idm.assignee;
                    } else {
                        $scope.popup.assignmentObject.idm.assignee = { email: $scope.assignment.idm.assignee.email };
                    }
                }

                if ($scope.assignment.idm.candidateUsers && $scope.assignment.idm.candidateUsers.length > 0) {
                    for (var i = 0; i < $scope.assignment.idm.candidateUsers.length; i++) {
                        $scope.popup.assignmentObject.idm.candidateUsers.push($scope.assignment.idm.candidateUsers[i]);
                    }
                }

                if ($scope.assignment.idm.candidateGroups && $scope.assignment.idm.candidateGroups.length > 0) {
                    for (var i = 0; i < $scope.assignment.idm.candidateGroups.length; i++) {
                        $scope.popup.assignmentObject.idm.candidateGroups.push($scope.assignment.idm.candidateGroups[i]);
                    }
                }
            }
        }

        //fill the static area
        if ($scope.assignment.assignee) {
            $scope.popup.assignmentObject.static.assignee = $scope.assignment.assignee;
        }
        
        if ($scope.assignment.candidateUsers && $scope.assignment.candidateUsers.length > 0) {
            for (var i = 0; i < $scope.assignment.candidateUsers.length; i++) {
                $scope.popup.assignmentObject.static.candidateUsers.push($scope.assignment.candidateUsers[i]);
            }
        }
        // 初始化的。  可阅人
        if ($scope.assignment.candireadUsers && $scope.assignment.candireadUsers.length > 0) {
            for (var i = 0; i < $scope.assignment.candireadUsers.length; i++) {
                $scope.popup.assignmentObject.static.candireadUsers.push($scope.assignment.candireadUsers[i]);
            }
        }

        if ($scope.assignment.candidateGroups && $scope.assignment.candidateGroups.length > 0) {
            for (var i = 0; i < $scope.assignment.candidateGroups.length; i++) {
                $scope.popup.assignmentObject.static.candidateGroups.push($scope.assignment.candidateGroups[i]);
            }
        }

        initStaticContextForEditing($scope);
        // 这个相当于监听？  判断值的改变
        $scope.$watch('popup.groupFilter', function () {
            $scope.updateGroupFilter();
        });

        $scope.$watch('popup.filter', function () {
            $scope.updateFilter();
        });

        $scope.updateFilter = function () {
            if ($scope.popup.oldFilter == undefined || $scope.popup.oldFilter != $scope.popup.filter) {
                if (!$scope.popup.filter) {
                    $scope.popup.oldFilter = '';
                } else {
                    $scope.popup.oldFilter = $scope.popup.filter;
                }
                // console.log("判断")
                // console.log($scope.popup.oldFilter);
                // console.log($scope.popup.filter);
                // if ($scope.popup.filter !== null && $scope.popup.filter !== undefined) {
                UserService.getFilteredUsers($scope.popup.filter).then(function (result) {
                    var filteredUsers = [];
                    for (var i = 0; i < result.data.length; i++) {
                        var filteredUser = result.data[i];

                        var foundCandidateUser = false;
                        if ($scope.popup.assignmentObject.idm.candidateUsers !== null && $scope.popup.assignmentObject.idm.candidateUsers !== undefined) {
                            for (var j = 0; j < $scope.popup.assignmentObject.idm.candidateUsers.length; j++) {
                                var candidateUser = $scope.popup.assignmentObject.idm.candidateUsers[j];
                                if (candidateUser.id === filteredUser.id) {
                                    foundCandidateUser = true;
                                    break;
                                }
                            }
                        }

                        if (!foundCandidateUser) {
                            filteredUsers.push(filteredUser);
                        }

                    }

                    $scope.popup.userResults = filteredUsers;
                    // 里面放的是所有用户的信息
                    // console.log($scope.popup.userResults);
                    $scope.resetSelection();
                });
                // }
            }
        };

        $scope.updateGroupFilter = function () {
            if ($scope.popup.oldGroupFilter == undefined || $scope.popup.oldGroupFilter != $scope.popup.groupFilter) {
                if (!$scope.popup.groupFilter) {
                    $scope.popup.oldGroupFilter = '';
                } else {
                    $scope.popup.oldGroupFilter = $scope.popup.groupFilter;
                }
                // 获取组的方法
                GroupService.getFilteredGroups($scope.popup.groupFilter).then(function (result) {
                    // $scope.popup.groupResults = result.data;
                    $scope.popup.groupResults = result.data;
                    $scope.resetGroupSelection();
                });
            }
        };

        $scope.confirmUser = function (user) {
            if (!user) {
                // Selection is done with keyboard, use selection index
                // 使用键盘选择，使用选择索引
                var users = $scope.popup.userResults;
                if ($scope.popup.selectedIndex >= 0 && $scope.popup.selectedIndex < users.length) {
                    user = users[$scope.popup.selectedIndex];
                }
            }

            if (user) {
                if ("user" == $scope.assignmentOption.id) {
                    $scope.popup.assignmentObject.idm.assignee = user;
                    // 当是单个用户的时候   这个是多选框里面的值
                    // console.log($scope.popup.assignmentObject.idm.assignee)
                } else if ("users" == $scope.assignmentOption.id) {

                    // Only add if not yet part of candidate users 仅添加（如果尚未成为候选用户的一部分）
                    var found = false;
                    if ($scope.popup.assignmentObject.idm.candidateUsers) {
                        for (var i = 0; i < $scope.popup.assignmentObject.idm.candidateUsers.length; i++) {
                            if ($scope.popup.assignmentObject.idm.candidateUsers[i].id === user.id) {
                                found = true;
                                break;
                            }
                        }
                    }

                    if (!found) {
                        $scope.addCandidateUser(user);
                    }
                }
            }
        };

        $scope.confirmEmail = function () {
            if ("user" == $scope.assignmentOption.id) {
                $scope.popup.assignmentObject.idm.assignee = { email: $scope.popup.email };
                console.log('---------');
                console.log($scope.popup.assignmentObject.idm.assignee);
            } else if ("users" == $scope.assignmentOption.id) {

                // Only add if not yet part of candidate users
                // 仅添加（如果尚未成为候选用户的一部分）
                var found = false;
                if ($scope.popup.assignmentObject.idm.candidateUsers) {
                    for (var i = 0; i < $scope.popup.assignmentObject.idm.candidateUsers.length; i++) {

                        if ($scope.popup.assignmentObject.idm.candidateUsers[i].id) {
                            if ($scope.popup.assignmentObject.idm.candidateUsers[i].id === user.id) {
                                found = true;
                                break;
                            }
                        } else if ($scope.popup.assignmentObject.idm.candidateUsers[i].email) {
                            if ($scope.popup.assignmentObject.idm.candidateUsers[i].email === $scope.popup.email) {
                                found = true;
                                break;
                            }
                        }
                    }
                }

                if (!found) {
                    $scope.addCandidateUser({ email: $scope.popup.email });
                }
            }
        };

        $scope.confirmGroup = function (group) {
            if (!group) {
                // Selection is done with keyboard, use selection index
                var groups = $scope.popup.groupResults;
                if ($scope.popup.selectedGroupIndex >= 0 && $scope.popup.selectedGroupIndex < groups.length) {
                    group = groups[$scope.popup.selectedGroupIndex];
                }
            }

            if (group) {
                // Only add if not yet part of candidate groups
                var found = false;
                if ($scope.popup.assignmentObject.idm.candidateGroups) {
                    for (var i = 0; i < $scope.popup.assignmentObject.idm.candidateGroups.length; i++) {
                        if ($scope.popup.assignmentObject.idm.candidateGroups[i].id === group.id) {
                            found = true;
                            break;
                        }
                    }
                }

                if (!found) {
                    $scope.addCandidateGroup(group);
                }
            }
        };

        $scope.addCandidateUser = function (user) {
            $scope.popup.assignmentObject.idm.candidateUsers.push(user);
        };

        $scope.removeCandidateUser = function (user) {
            var users = $scope.popup.assignmentObject.idm.candidateUsers;
            var indexToRemove = -1;
            for (var i = 0; i < users.length; i++) {
                if (user.id) {
                    if (user.id === users[i].id) {
                        indexToRemove = i;
                        break;
                    }
                } else {
                    if (user.email === users[i].email) {
                        indexToRemove = i;
                        break;
                    }
                }
            }
            if (indexToRemove >= 0) {
                users.splice(indexToRemove, 1);
            }
        };

        $scope.addCandidateGroup = function (group) {
            $scope.popup.assignmentObject.idm.candidateGroups.push(group);
        };

        $scope.removeCandidateGroup = function (group) {
            var groups = $scope.popup.assignmentObject.idm.candidateGroups;
            var indexToRemove = -1;
            for (var i = 0; i < groups.length; i++) {
                if (group.id == groups[i].id) {
                    indexToRemove = i;
                    break;
                }
            }
            if (indexToRemove >= 0) {
                groups.splice(indexToRemove, 1);
            }
        };

        $scope.resetSelection = function () {
            if ($scope.popup.userResults && $scope.popup.userResults.length > 0) {
                $scope.popup.selectedIndex = 0;
            } else {
                $scope.popup.selectedIndex = -1;
            }
        };

        $scope.nextUser = function () {
            var users = $scope.popup.userResults;
            if (users && users.length > 0 && $scope.popup.selectedIndex < users.length - 1) {
                $scope.popup.selectedIndex += 1;
            }
        };

        $scope.previousUser = function () {
            var users = $scope.popup.userResults;
            if (users && users.length > 0 && $scope.popup.selectedIndex > 0) {
                $scope.popup.selectedIndex -= 1;
            }
        };

        $scope.resetGroupSelection = function () {
            if ($scope.popup.groupResults && $scope.popup.groupResults.length > 0) {
                $scope.popup.selectedGroupIndex = 0;
            } else {
                $scope.popup.selectedGroupIndex = -1;
            }
        };

        $scope.nextGroup = function () {
            var groups = $scope.popup.groupResults;
            if (groups && groups.length > 0 && $scope.popup.selectedGroupIndex < groups.length - 1) {
                $scope.popup.selectedGroupIndex += 1;
            }
        };

        $scope.previousGroup = function () {
            var groups = $scope.popup.groupResults;
            if (groups && groups.length > 0 && $scope.popup.selectedGroupIndex > 0) {
                $scope.popup.selectedGroupIndex -= 1;
            }
        };

        $scope.removeAssignee = function () {
            $scope.popup.assignmentObject.idm.assignee = undefined;
        };

        // Click handler for + button after enum value 在枚举值后单击+按钮处理程序
        $scope.addCandireadUserValue = function (index) {
            $scope.popup.assignmentObject.static.candireadUsers.splice(index + 1, 0, { value: '' });
        };

        // Click handler for - button after enum value 在枚举值后单击-按钮处理程序
        $scope.removeCandireadUserValue = function (index) {
            $scope.popup.assignmentObject.static.candireadUsers.splice(index, 1);
        };


        // Click handler for + button after enum value 在枚举值后单击+按钮处理程序
        $scope.addCandidateUserValue = function (index) {
            $scope.popup.assignmentObject.static.candidateUsers.splice(index + 1, 0, { value: '' });
        };

        // Click handler for - button after enum value 在枚举值后单击-按钮处理程序
        $scope.removeCandidateUserValue = function (index) {
            $scope.popup.assignmentObject.static.candidateUsers.splice(index, 1);
        };

        // Click handler for + button after enum value
        $scope.addCandidateGroupValue = function (index) {
            $scope.popup.assignmentObject.static.candidateGroups.splice(index + 1, 0, { value: '' });
        };

        // Click handler for - button after enum value
        $scope.removeCandidateGroupValue = function (index) {
            $scope.popup.assignmentObject.static.candidateGroups.splice(index, 1);
        };

        $scope.setSearchType = function () {
            $scope.popup.assignmentObject.assignmentSourceType = 'search';
        };

        // $scope.allSteps = EDITOR.UTIL.collectSortedElementsFromPrecedingElements($scope.selectedShape);

        
        console.log("----------");
        // console.log($scope);
        console.log($scope.property);
        // 保存的事件
        $scope.save = function () {

            handleAssignmentInput($scope.popup.assignmentObject.static);

            $scope.assignment.type = $scope.popup.assignmentObject.type;
            // 这个里面就是默认开启人的。
            // console.log($scope.assignment);
            if ('idm' === $scope.popup.assignmentObject.type) { // IDM
                $scope.popup.assignmentObject.static = undefined;

                //Construct an IDM object to be saved to the process model.
                var idm = { type: $scope.assignmentOption.id };
                if ('user' == idm.type) {
                    if ($scope.popup.assignmentObject.idm.assignee) {
                        idm.assignee = $scope.popup.assignmentObject.idm.assignee;
                        // 这个是选择之后的
                        console.log("测试===");
                        console.log($scope.popup.assignmentObject.idm.assignee);
                    }
                } else if ('users' == idm.type) {
                    if ($scope.popup.assignmentObject.idm.candidateUsers && $scope.popup.assignmentObject.idm.candidateUsers.length > 0) {
                        idm.candidateUsers = $scope.popup.assignmentObject.idm.candidateUsers;
                    }
                    console.log("像静态一样赋值")
                    // 添加一个通过的方式
                    // console.log($scope.popup.assignmentObject.fs);
                    $scope.assignment.fs = $scope.popup.assignmentObject.fs
                } else if ('groups' == idm.type) {
                    if ($scope.popup.assignmentObject.idm.candidateGroups && $scope.popup.assignmentObject.idm.candidateGroups.length > 0) {
                        idm.candidateGroups = $scope.popup.assignmentObject.idm.candidateGroups;
                    }
                }

                $scope.assignment.idm = idm;
                $scope.assignment.assignee = undefined;
                if ('initiator' == idm.type) {
                    console.log("这个是默认开启人的。");
                    $scope.assignment.assignee = '#{userId}';
                    $scope.assignment.idm = undefined;
                    $scope.assignment.type = 'static';
                }
                // && 'all' == idm.fs
                if ('users' == idm.type) {
                    // console.log("这个是要求全员通过的。");
                    // console.log($scope.assignment.fs); 
                    if($scope.assignment.fs=="all"){
                        $scope.assignment.assignee = '${all}';
                    }else{
                        $scope.assignment.assignee = '';   
                        $scope.assignment.fs = ''; 
                    }
                    console.log($scope.assignment);

                }
                $scope.assignment.candidateUsers = undefined;
                $scope.assignment.candidateGroups = undefined;

            }
            // 静态的。
            if ('static' === $scope.popup.assignmentObject.type) { // IDM
                $scope.popup.assignmentObject.idm = undefined;
                $scope.assignment.idm = undefined;
                $scope.assignment.assignee = $scope.popup.assignmentObject.static.assignee;
                $scope.assignment.candidateUsers = $scope.popup.assignmentObject.static.candidateUsers;
                $scope.assignment.candidateGroups = $scope.popup.assignmentObject.static.candidateGroups;
                //这个是可阅人的赋值 
                $scope.assignment.candireadUsers = $scope.popup.assignmentObject.static.candireadUsers;
               
                $scope.assignment.fs = $scope.popup.assignmentObject.fs
                //  console.log("測試-------------------------")
                // console.log($scope.assignment.fs);
                if($scope.assignment.fs=="all"){
                    $scope.assignment.assignee = '${all}';
                }else{
                    $scope.assignment.assignee = '';   
                    $scope.assignment.fs = ''; 
                }
            }
            // $scope.assignment.type = "static";
            // $scope.assignment.candidateUsers = $scope.popup.assignmentObject.idm.candidateUsers;
            // console.log($scope.popup.assignmentObject.idm.candidateUsers);
                  

            $scope.property.value = {};
            $scope.property.value.assignment = $scope.assignment;
            // $scope.property.type = 'static';
            console.log("最后赋值");
            console.log($scope.assignment); 
            // console.log($userId);
            $scope.updatePropertyInModel($scope.property);
            $scope.close();
                // if($scope.assignment.fs == 'one')
                // { 
                    $scope.property.key="oryx-multiinstance_variable";
                    $scope.property.value=$scope.assignment.fs;
                    $scope.updatePropertyInModel($scope.property);
                    console.log("测试成功");
                    console.log($scope.property);
                    // $scope.property.key="oryx-multiinstance_collection";
                    // if($scope.assignment.fs==null || $scope.assignment.fs=="")
                    // {
                    //     $scope.property.value=""  
                    // }else{
                        // $scope.property.value="${name}"; 
                    // }   
                    // $scope.updatePropertyInModel($scope.property);
                    // console.log("测试成功1");
                    // console.log($scope.property);

                    // $scope.property.key="oryx-name";
                    // $scope.queryPropertyInModel($scope.property);
                // }
        };

        // Close button handler
        $scope.close = function () {
            $scope.property.mode = 'read';
            $scope.$hide();
        };

        var handleAssignmentInput = function ($assignment) {

            function isEmptyString(value) {
                return (value === undefined || value === null || value.trim().length === 0);
            }

            if (isEmptyString($assignment.assignee)) {
                $assignment.assignee = undefined;
            }
            var toRemoveIndexes;
            var removedItems = 0;
            var i = 0;
            if ($assignment.candidateUsers) {
                toRemoveIndexes = [];
                for (i = 0; i < $assignment.candidateUsers.length; i++) {
                    if (isEmptyString($assignment.candidateUsers[i].value)) {
                        toRemoveIndexes[toRemoveIndexes.length] = i;
                    }
                }

                if (toRemoveIndexes.length == $assignment.candidateUsers.length) {
                    $assignment.candidateUsers = undefined;
                } else {
                    removedItems = 0;
                    for (i = 0; i < toRemoveIndexes.length; i++) {
                        $assignment.candidateUsers.splice(toRemoveIndexes[i] - removedItems, 1);
                        removedItems++;
                    }
                }
            }

            if ($assignment.candidateGroups) {
                toRemoveIndexes = [];
                for (i = 0; i < $assignment.candidateGroups.length; i++) {
                    if (isEmptyString($assignment.candidateGroups[i].value)) {
                        toRemoveIndexes[toRemoveIndexes.length] = i;
                    }
                }

                if (toRemoveIndexes.length == $assignment.candidateGroups.length) {
                    $assignment.candidateGroups = undefined;
                } else {
                    removedItems = 0;
                    for (i = 0; i < toRemoveIndexes.length; i++) {
                        $assignment.candidateGroups.splice(toRemoveIndexes[i] - removedItems, 1);
                        removedItems++;
                    }
                }
            }
        };

        function initStaticContextForEditing($scope) {
            if (!$scope.popup.assignmentObject.static.candidateUsers || $scope.popup.assignmentObject.static.candidateUsers.length == 0) {
                $scope.popup.assignmentObject.static.candidateUsers = [{ value: '' }];
            }
            
            if (!$scope.popup.assignmentObject.static.candidateGroups || $scope.popup.assignmentObject.static.candidateGroups.length == 0) {
                $scope.popup.assignmentObject.static.candidateGroups = [{ value: '' }];
            }
            //可阅人的初始化 
            if (!$scope.popup.assignmentObject.static.candireadUsers || $scope.popup.assignmentObject.static.candireadUsers.length == 0) {
                $scope.popup.assignmentObject.static.candireadUsers = [{ value: '' }];
            }
        }
    }]);

    // 这个是  按组启动的 写的控制器------------------
angular.module('flowableModeler').controller('FlowableAssignmentPopupCtrl1',
    ['$rootScope', '$scope', '$translate', '$http', 'UserService', 'GroupService','$modal', 'editorManager', function ($rootScope, $scope, $translate, $http, UserService, GroupService,$modal,editorManager) {
        // console.log("默认初始化--") 
        // $scope.property.value = angular.fromJson($scope.property.value)
        // console.log(angular.fromJson($scope.property.value));

        // Put json representing assignment on scope 将json表示为范围的赋值
        if ($scope.property.value !== undefined && $scope.property.value !== null
            && $scope.property.value.assignment !== undefined
            && $scope.property.value.assignment !== null) {

            $scope.assignment = $scope.property.value.assignment;

        } else {
            $scope.assignment = { type: 'idm' };
        }

        $scope.assignment.type = 'static';
        $scope.popup = {
            assignmentObject: {
                type: $scope.assignment.type,
                idm: {
                    type: undefined,
                    assignee: undefined,
                    candidateUsers: [],
                    candidateGroups: []
                },
                static: {
                    assignee: undefined,
                    candidateUsers: [],
                    candidateGroups: []
                }
            }
        };


        $scope.assignmentOptions = [
            // {id: "initiator", title: $translate.instant('PROPERTY.ASSIGNMENT.IDM.DROPDOWN.INITIATOR')},
            // {id: "user", title: $translate.instant('PROPERTY.ASSIGNMENT.IDM.DROPDOWN.USER')},
            // {id: "users", title: $translate.instant('PROPERTY.ASSIGNMENT.IDM.DROPDOWN.USERS')},
            // { id: "groups", title: $translate.instant('PROPERTY.ASSIGNMENT.IDM.DROPDOWN.GROUPS') }
        ];

        if ($scope.assignment.idm && $scope.assignment.idm.type) {
            for (var i = 0; i < $scope.assignmentOptions.length; i++) {
                if ($scope.assignmentOptions[i].id == $scope.assignment.idm.type) {
                    $scope.assignmentOption = $scope.assignmentOptions[i];
                    break;
                }
            }
        }

        // fill the IDM area  填写IDM区域  不知道什么意思
        if (!$scope.assignmentOption) {
            // Default, first time opening the popup Default, 默认，第一次打开弹出窗口
            $scope.assignmentOption = $scope.assignmentOptions[0];
        } else {
            // Values already filled   看怎么那个 user的值  $scope.popup.assignmentObject.idm.assignee 表示用户
            if ($scope.assignment.idm) { //fill the IDM tab
                if ($scope.assignment.idm.assignee) {
                    if ($scope.assignment.idm.assignee.id) {
                        $scope.popup.assignmentObject.idm.assignee = $scope.assignment.idm.assignee;
                    } else {
                        $scope.popup.assignmentObject.idm.assignee = { email: $scope.assignment.idm.assignee.email };
                    }
                }

                if ($scope.assignment.idm.candidateUsers && $scope.assignment.idm.candidateUsers.length > 0) {
                    for (var i = 0; i < $scope.assignment.idm.candidateUsers.length; i++) {
                        $scope.popup.assignmentObject.idm.candidateUsers.push($scope.assignment.idm.candidateUsers[i]);
                    }
                }

                if ($scope.assignment.idm.candidateGroups && $scope.assignment.idm.candidateGroups.length > 0) {
                    for (var i = 0; i < $scope.assignment.idm.candidateGroups.length; i++) {
                        $scope.popup.assignmentObject.idm.candidateGroups.push($scope.assignment.idm.candidateGroups[i]);
                    }
                }
            }
        }
 
        //fill the static area 填充静态区域
        if ($scope.assignment.assignee) {
            $scope.popup.assignmentObject.static.assignee = $scope.assignment.assignee;
        }

        if ($scope.assignment.candidateUsers && $scope.assignment.candidateUsers.length > 0) {
            for (var i = 0; i < $scope.assignment.candidateUsers.length; i++) {
                $scope.popup.assignmentObject.static.candidateUsers.push($scope.assignment.candidateUsers[i]);
            }
        }

        if ($scope.assignment.candidateGroups && $scope.assignment.candidateGroups.length > 0) {
            for (var i = 0; i < $scope.assignment.candidateGroups.length; i++) {
                $scope.popup.assignmentObject.static.candidateGroups.push($scope.assignment.candidateGroups[i]);
            }
        }

        initStaticContextForEditing($scope);

        $scope.$watch('popup.groupFilter', function () {
            $scope.updateGroupFilter();
        });

        $scope.$watch('popup.filter', function () {
            $scope.updateFilter();
        });

        $scope.updateFilter = function () {
            if ($scope.popup.oldFilter == undefined || $scope.popup.oldFilter != $scope.popup.filter) {
                if (!$scope.popup.filter) {
                    $scope.popup.oldFilter = '';
                } else {
                    $scope.popup.oldFilter = $scope.popup.filter;
                }
                // console.log("判断")
                // console.log($scope.popup.oldFilter);
                // console.log($scope.popup.filter);
                // if ($scope.popup.filter !== null && $scope.popup.filter !== undefined) {
                UserService.getFilteredUsers($scope.popup.filter).then(function (result) {
                    var filteredUsers = [];
                    for (var i = 0; i < result.data.length; i++) {
                        var filteredUser = result.data[i];

                        var foundCandidateUser = false;
                        if ($scope.popup.assignmentObject.idm.candidateUsers !== null && $scope.popup.assignmentObject.idm.candidateUsers !== undefined) {
                            for (var j = 0; j < $scope.popup.assignmentObject.idm.candidateUsers.length; j++) {
                                var candidateUser = $scope.popup.assignmentObject.idm.candidateUsers[j];
                                if (candidateUser.id === filteredUser.id) {
                                    foundCandidateUser = true;
                                    break;
                                }
                            }
                        }

                        if (!foundCandidateUser) {
                            filteredUsers.push(filteredUser);
                        }

                    }

                    $scope.popup.userResults = filteredUsers;
                    console.log($scope.popup);
                    console.log($scope.popup.userResults);
                    $scope.resetSelection();
                });
                // }
            }
        };

        $scope.updateGroupFilter = function () {
            if ($scope.popup.oldGroupFilter == undefined || $scope.popup.oldGroupFilter != $scope.popup.groupFilter) {
                if (!$scope.popup.groupFilter) {
                    $scope.popup.oldGroupFilter = '';
                } else {
                    $scope.popup.oldGroupFilter = $scope.popup.groupFilter;
                }
                // 获取组的方法
                GroupService.getFilteredGroups($scope.popup.groupFilter).then(function (result) {
                    $scope.popup.groupResults = result.data;
                    $scope.resetGroupSelection();
                });
            }
        };

        $scope.confirmUser = function (user) {
            if (!user) {
                // Selection is done with keyboard, use selection index
                // 使用键盘选择，使用选择索引
                var users = $scope.popup.userResults;
                if ($scope.popup.selectedIndex >= 0 && $scope.popup.selectedIndex < users.length) {
                    user = users[$scope.popup.selectedIndex];
                }
            }

            if (user) {
                if ("user" == $scope.assignmentOption.id) {
                    $scope.popup.assignmentObject.idm.assignee = user;
                    // 当是单个用户的时候   这个是多选框里面的值
                    // console.log($scope.popup.assignmentObject.idm.assignee)
                } else if ("users" == $scope.assignmentOption.id) {

                    // Only add if not yet part of candidate users 仅添加（如果尚未成为候选用户的一部分）
                    var found = false;
                    if ($scope.popup.assignmentObject.idm.candidateUsers) {
                        for (var i = 0; i < $scope.popup.assignmentObject.idm.candidateUsers.length; i++) {
                            if ($scope.popup.assignmentObject.idm.candidateUsers[i].id === user.id) {
                                found = true;
                                break;
                            }
                        }
                    }

                    if (!found) {
                        $scope.addCandidateUser(user);
                    }
                }
            }
        };

        $scope.confirmEmail = function () {
            if ("user" == $scope.assignmentOption.id) {
                $scope.popup.assignmentObject.idm.assignee = { email: $scope.popup.email };
                console.log('---------');
                console.log($scope.popup.assignmentObject.idm.assignee);
            } else if ("users" == $scope.assignmentOption.id) {
                // Only add if not yet part of candidate users
                // 仅添加（如果尚未成为候选用户的一部分）
                var found = false;
                if ($scope.popup.assignmentObject.idm.candidateUsers) {
                    for (var i = 0; i < $scope.popup.assignmentObject.idm.candidateUsers.length; i++) {

                        if ($scope.popup.assignmentObject.idm.candidateUsers[i].id) {
                            if ($scope.popup.assignmentObject.idm.candidateUsers[i].id === user.id) {
                                found = true;
                                break;
                            }
                        } else if ($scope.popup.assignmentObject.idm.candidateUsers[i].email) {
                            if ($scope.popup.assignmentObject.idm.candidateUsers[i].email === $scope.popup.email) {
                                found = true;
                                break;
                            }
                        }
                    }
                }

                if (!found) {
                    $scope.addCandidateUser({ email: $scope.popup.email });
                }
            }
        };

        $scope.confirmGroup = function (group) {
            if (!group) {
                // Selection is done with keyboard, use selection index
                var groups = $scope.popup.groupResults;
                if ($scope.popup.selectedGroupIndex >= 0 && $scope.popup.selectedGroupIndex < groups.length) {
                    group = groups[$scope.popup.selectedGroupIndex];
                }
            }

            if (group) {
                // Only add if not yet part of candidate groups
                var found = false;
                if ($scope.popup.assignmentObject.idm.candidateGroups) {
                    for (var i = 0; i < $scope.popup.assignmentObject.idm.candidateGroups.length; i++) {
                        if ($scope.popup.assignmentObject.idm.candidateGroups[i].id === group.id) {
                            found = true;
                            break;
                        }
                    }
                }

                if (!found) {
                    $scope.addCandidateGroup(group);
                }
            }
        };

        $scope.addCandidateUser = function (user) {
            $scope.popup.assignmentObject.idm.candidateUsers.push(user);
        };

        $scope.removeCandidateUser = function (user) {
            var users = $scope.popup.assignmentObject.idm.candidateUsers;
            var indexToRemove = -1;
            for (var i = 0; i < users.length; i++) {
                if (user.id) {
                    if (user.id === users[i].id) {
                        indexToRemove = i;
                        break;
                    }
                } else {
                    if (user.email === users[i].email) {
                        indexToRemove = i;
                        break;
                    }
                }
            }
            if (indexToRemove >= 0) {
                users.splice(indexToRemove, 1);
            }
        };

        $scope.addCandidateGroup = function (group) {
            $scope.popup.assignmentObject.idm.candidateGroups.push(group);
        };

        $scope.removeCandidateGroup = function (group) {
            var groups = $scope.popup.assignmentObject.idm.candidateGroups;
            var indexToRemove = -1;
            for (var i = 0; i < groups.length; i++) {
                if (group.id == groups[i].id) {
                    indexToRemove = i;
                    break;
                }
            }
            if (indexToRemove >= 0) {
                groups.splice(indexToRemove, 1);
            }
        };

        $scope.resetSelection = function () {
            if ($scope.popup.userResults && $scope.popup.userResults.length > 0) {
                $scope.popup.selectedIndex = 0;
            } else {
                $scope.popup.selectedIndex = -1;
            }
        };

        $scope.nextUser = function () {
            var users = $scope.popup.userResults;
            if (users && users.length > 0 && $scope.popup.selectedIndex < users.length - 1) {
                $scope.popup.selectedIndex += 1;
            }
        };

        $scope.previousUser = function () {
            var users = $scope.popup.userResults;
            if (users && users.length > 0 && $scope.popup.selectedIndex > 0) {
                $scope.popup.selectedIndex -= 1;
            }
        };

        $scope.resetGroupSelection = function () {
            if ($scope.popup.groupResults && $scope.popup.groupResults.length > 0) {
                $scope.popup.selectedGroupIndex = 0;
            } else {
                $scope.popup.selectedGroupIndex = -1;
            }
        };

        $scope.nextGroup = function () {
            var groups = $scope.popup.groupResults;
            if (groups && groups.length > 0 && $scope.popup.selectedGroupIndex < groups.length - 1) {
                $scope.popup.selectedGroupIndex += 1;
            }
        };

        $scope.previousGroup = function () {
            var groups = $scope.popup.groupResults;
            if (groups && groups.length > 0 && $scope.popup.selectedGroupIndex > 0) {
                $scope.popup.selectedGroupIndex -= 1;
            }
        };

        $scope.removeAssignee = function () {
            $scope.popup.assignmentObject.idm.assignee = undefined;
        };

        // Click handler for + button after enum value
        $scope.addCandidateUserValue = function (index) {
            $scope.popup.assignmentObject.static.candidateUsers.splice(index + 1, 0, { value: '' });
        };

        // Click handler for - button after enum value
        $scope.removeCandidateUserValue = function (index) {
            $scope.popup.assignmentObject.static.candidateUsers.splice(index, 1);
        };

        // Click handler for + button after enum value
        $scope.addCandidateGroupValue = function (index) {
            $scope.popup.assignmentObject.static.candidateGroups.splice(index + 1, 0, { value: '' });
        };

        // Click handler for - button after enum value
        $scope.removeCandidateGroupValue = function (index) {
            $scope.popup.assignmentObject.static.candidateGroups.splice(index, 1);
        };

        $scope.setSearchType = function () {
            $scope.popup.assignmentObject.assignmentSourceType = 'search';
        };

        // $scope.allSteps = EDITOR.UTIL.collectSortedElementsFromPrecedingElements($scope.selectedShape);
       
        // Config for the modal window
        var opts = {
            template: 'views/properties/form-reference-popup2.html',
            scope: $scope
        };
        // $scope.updateFilter = function () {
        $scope.open = function(){  
            // Open the dialog
            _internalCreateModal(opts, $modal, $scope);
            console.log("打开------------------------------")
            console.log($scope.popup.assignmentObject.idm.candidateUsers);
        }



        $scope.save = function () {
            console.log("保存的测试-----------");

            handleAssignmentInput($scope.popup.assignmentObject.static);

            $scope.assignment.type = $scope.popup.assignmentObject.type;
            // 这个里面就是默认开启人的。
            // console.log($scope.assignment);
            if ('idm' === $scope.popup.assignmentObject.type) { // IDM
                $scope.popup.assignmentObject.static = undefined;

                //Construct an IDM object to be saved to the process model.
                var idm = { type: $scope.assignmentOption.id };
                if ('user' == idm.type) {
                    if ($scope.popup.assignmentObject.idm.assignee) {
                        idm.assignee = $scope.popup.assignmentObject.idm.assignee;
                        // 这个是选择之后的
                        console.log("测试===");
                        console.log($scope.popup.assignmentObject.idm.assignee);
                    }
                } else if ('users' == idm.type) {
                    if ($scope.popup.assignmentObject.idm.candidateUsers && $scope.popup.assignmentObject.idm.candidateUsers.length > 0) {
                        idm.candidateUsers = $scope.popup.assignmentObject.idm.candidateUsers;
                    }
                } else if ('groups' == idm.type) {
                    if ($scope.popup.assignmentObject.idm.candidateGroups && $scope.popup.assignmentObject.idm.candidateGroups.length > 0) {
                        idm.candidateGroups = $scope.popup.assignmentObject.idm.candidateGroups;
                    }
                }
                $scope.assignment.idm = idm;
                $scope.assignment.assignee = undefined;
                if ('initiator' == idm.type) {
                    console.log("这个是默认开启人的。");
                    $scope.assignment.assignee = '#{userId}';
                    $scope.assignment.idm = undefined;
                    $scope.assignment.type = 'static';
                }
                $scope.assignment.candidateUsers = undefined;
                $scope.assignment.candidateGroups = undefined;

            }
            // 静态的。
            if ('static' === $scope.popup.assignmentObject.type) { // IDM
                $scope.popup.assignmentObject.idm = undefined;
                $scope.assignment.idm = undefined;
                $scope.assignment.assignee = $scope.popup.assignmentObject.static.assignee;
                $scope.assignment.candidateUsers = $scope.popup.assignmentObject.static.candidateUsers;
                $scope.assignment.candidateGroups = $scope.popup.assignmentObject.static.candidateGroups;
            }


            $scope.property.value = {};
            $scope.property.value.assignment = $scope.assignment;
            console.log("我想要其他地方拿到这个值怎么拿？？？");
            console.log($scope.property.value);
            console.log("最后赋值-------------------  这个是他的值");
            console.log($scope.property.value.assignment.candidateGroups);
            $scope.updatePropertyInModel($scope.property);
            console.log("一次保存成功？？")
            console.log($scope.property);    
            $scope.close();

              
            $scope.property.key = "oryx-process_potentialstarteruser"
            //  $scope.property.value.assignment.candidateGroups相当于是选中组的值
            $scope.value1 = $scope.property.value.assignment.candidateGroups;
            // console.log("循环===================================");     
            // $scope.property.value = []; 
            // 把数据里面的用户给赋值到 用户里面去  根据数组id把对应的用户给查出来后，赋值到用户
            $scope.property.value = ""
            angular.forEach($scope.value1,function(value,key){
                // $scope.property.value.push(value.value); 循环输出里面的集合
                $http.get(FLOWABLE.CONFIG.contextRoot2 + '/groups/'+value.value+'/users')
                .success(
                    function (response) { 
                        // $scope.forms = response.data;
                        // console.log(response.data);
                        $scope.forms = response;
                        // 取出用户的id后，赋值给那个  用户属性的 value
                        angular.forEach($scope.forms,function(value,key){
                            // console.log(value);
                            // $scope.property.value.push(value.id);
                            // if($scope.forms.length ==key+1 ){
                            //     $scope.property.value += value.id 
                            // }else{
                                // $scope.property.value += value.id + ","
                            // } 
                            // $scope.property.value.assignment = $scope.assignment;
                            $scope.property.value += value.id + ","
                            $scope.updatePropertyInModel($scope.property);
                            // console.log("二次赋值成功");    
                            // console.log($scope.property);    
                        });
                        console.log(response); 
                    }); 
            });
            


            // var modelMetaData = editorManager.getBaseModelData();
            // var json = editorManager.getModel();
            // json = JSON.stringify(json);
            // var params = {
            //     modeltype: modelMetaData.model.modelType,
            //     jsonXml: json,
            //     name: modelMetaData.name,
            //     key: modelMetaData.key,
            //     description: modelMetaData.description,
            //     newversion: false,
            //     comment: '',
            //     lastUpdated: modelMetaData.lastUpdated
            // };
            // $http({
            //     method: 'POST',
            //     data: params,
            //     ignoreErrors: true,
            //     headers: {
            //         'Token': editorManager.getToken(),
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json; charset=UTF-8'
            //     },
            //     url: FLOWABLE.URL.putModel(modelMetaData.modelId)
            // })
            //     .success(function (data, status, headers, config) {
            //         editorManager.handleEvents({
            //             type: ORYX.CONFIG.EVENT_SAVED
            //         });
            //         // var allSteps = EDITOR.UTIL.collectSortedElementsFromPrecedingElements($scope.selectedShape);
            //         $rootScope.addHistoryItem($scope.selectedShape.resourceId);
            //         // $location.path('form-editor/' + $scope.selectedForm.id);
            //     })
            //     .error(function (data, status, headers, config) {

            //     });

            $scope.close();
        };

        // Close button handler
        $scope.close = function () {
            $scope.property.mode = 'read';
            $scope.$hide();
        };

        var handleAssignmentInput = function ($assignment) {

            function isEmptyString(value) {
                return (value === undefined || value === null || value.trim().length === 0);
            }

            if (isEmptyString($assignment.assignee)) {
                $assignment.assignee = undefined;
            }
            var toRemoveIndexes;
            var removedItems = 0;
            var i = 0;
            if ($assignment.candidateUsers) {
                toRemoveIndexes = [];
                for (i = 0; i < $assignment.candidateUsers.length; i++) {
                    if (isEmptyString($assignment.candidateUsers[i].value)) {
                        toRemoveIndexes[toRemoveIndexes.length] = i;
                    }
                }

                if (toRemoveIndexes.length == $assignment.candidateUsers.length) {
                    $assignment.candidateUsers = undefined;
                } else {
                    removedItems = 0;
                    for (i = 0; i < toRemoveIndexes.length; i++) {
                        $assignment.candidateUsers.splice(toRemoveIndexes[i] - removedItems, 1);
                        removedItems++;
                    }
                }
            }

            if ($assignment.candidateGroups) {
                toRemoveIndexes = [];
                for (i = 0; i < $assignment.candidateGroups.length; i++) {
                    if (isEmptyString($assignment.candidateGroups[i].value)) {
                        toRemoveIndexes[toRemoveIndexes.length] = i;
                    }
                }

                if (toRemoveIndexes.length == $assignment.candidateGroups.length) {
                    $assignment.candidateGroups = undefined;
                } else {
                    removedItems = 0;
                    for (i = 0; i < toRemoveIndexes.length; i++) {
                        $assignment.candidateGroups.splice(toRemoveIndexes[i] - removedItems, 1);
                        removedItems++;
                    }
                }
            }
        };

        function initStaticContextForEditing($scope) {
            if (!$scope.popup.assignmentObject.static.candidateUsers || $scope.popup.assignmentObject.static.candidateUsers.length == 0) {
                $scope.popup.assignmentObject.static.candidateUsers = [{ value: '' }];
            }
            if (!$scope.popup.assignmentObject.static.candidateGroups || $scope.popup.assignmentObject.static.candidateGroups.length == 0) {
                $scope.popup.assignmentObject.static.candidateGroups = [{ value: '' }];
            }
        }
    }]);

    angular.module('flowableModeler').controller('FlowableAssignmentPopupCtrl2',
    ['$rootScope', '$scope', '$translate', '$http', 'UserService', 'GroupService','$modal', 'editorManager', function ($rootScope, $scope, $translate, $http, UserService, GroupService,$modal,editorManager) {
        // console.log("--------------------");
        // console.log($scope);
        // console.log($scope.property);
        // console.log($scope.property.value);
        if($scope.property.value ==null || $scope.property.value =="" || $scope.property.value==undefined){ 
           console.log("为空不执行")
        } else{ 
            $scope.property.value = angular.fromJson($scope.property.value)
            // console.log(angular.fromJson($scope.property.value));
        }
    }]);

    
    

    // -------------------------------------------
    // 可阅人的控制器 
angular.module('flowableModeler').controller('FlowableAssignmentPopupCtrl3',
['$rootScope', '$scope', '$translate', '$http', 'UserService', 'GroupService','$modal', 'editorManager', function ($rootScope, $scope, $translate, $http, UserService, GroupService,$modal,editorManager) {
    
    // 当可阅人有值的时候 重新赋值到那个选择框中
    if ($scope.property.value !== undefined && $scope.property.value !== null){
        console.log($scope.property.value); 
        $scope.init = {}
        $scope.init.assignment = {
            type: 'staitc',
            candidateUsers: []
        }; 
        // 把只用来分割， 用，割开。  console.log($scope.initvalue);
        $scope.initvalue = $scope.property.value.split(',');
        angular.forEach($scope.initvalue,function(value1,key){ 
            if($scope.initvalue.length == key+1){ 
                // console.log("逗号不输出，一般最后一个值为逗号。");
            }else{
                // console.log("這個是有值的。。。")
                var json = { value: value1 }
                // console.log(json) 
                $scope.init.assignment.candidateUsers.push(json);
                // console.log($scope.init.assignment.candidateUsers)
            } 
        }); 
    }

    if ($scope.property.value !== undefined && $scope.property.value !== null
        && $scope.property.value.assignment !== undefined
        && $scope.property.value.assignment !== null) {

        $scope.assignment = $scope.property.value.assignment;

    } else {
        $scope.assignment = { type: 'idm' };
    }

    $scope.popup = {
        assignmentObject: {
            type: 'static',
            idm: {
                type: undefined,
                assignee: undefined,
                candidateUsers: [],
                candidateGroups: []
            },
            static: {
                assignee: undefined,
                candidateUsers: [],
                candidateGroups: []
            }
        }
    };
    
    // 初始化的---------------  要用到。。。  已选择的里面。
    if ($scope.init.assignment.candidateUsers && $scope.init.assignment.candidateUsers.length > 0) {
        for (var i = 0; i < $scope.init.assignment.candidateUsers.length; i++) {
            $scope.popup.assignmentObject.static.candidateUsers.push($scope.init.assignment.candidateUsers[i]);
        }
    }


    //fill the static area 填充静态区域
    // if ($scope.assignment.assignee) {
    //     $scope.popup.assignmentObject.static.assignee = $scope.assignment.assignee;
    // }

    if ($scope.assignment.candidateUsers && $scope.assignment.candidateUsers.length > 0) {
        for (var i = 0; i < $scope.assignment.candidateUsers.length; i++) {
            $scope.popup.assignmentObject.static.candidateUsers.push($scope.assignment.candidateUsers[i]);
        }
    }

    if ($scope.assignment.candidateGroups && $scope.assignment.candidateGroups.length > 0) {
        for (var i = 0; i < $scope.assignment.candidateGroups.length; i++) {
            $scope.popup.assignmentObject.static.candidateGroups.push($scope.assignment.candidateGroups[i]);
        }
    }

    initStaticContextForEditing($scope);

    $scope.$watch('popup.groupFilter', function () {
        $scope.updateGroupFilter();
    });

    $scope.$watch('popup.filter', function () {
        $scope.updateFilter();
    });

    // 当值有改变时候的过滤器。  用户的
    $scope.updateFilter = function () {
        if ($scope.popup.oldFilter == undefined || $scope.popup.oldFilter != $scope.popup.filter) {
            if (!$scope.popup.filter) {
                $scope.popup.oldFilter = '';
            } else {
                $scope.popup.oldFilter = $scope.popup.filter;
            }

            // if ($scope.popup.filter !== null && $scope.popup.filter !== undefined) {
            UserService.getFilteredUsers($scope.popup.filter).then(function (result) {
                var filteredUsers = [];
                for (var i = 0; i < result.data.length; i++) {
                    var filteredUser = result.data[i];

                    var foundCandidateUser = false;
                    if ($scope.popup.assignmentObject.idm.candidateUsers !== null && $scope.popup.assignmentObject.idm.candidateUsers !== undefined) {
                        for (var j = 0; j < $scope.popup.assignmentObject.idm.candidateUsers.length; j++) {
                            var candidateUser = $scope.popup.assignmentObject.idm.candidateUsers[j];
                            if (candidateUser.id === filteredUser.id) {
                                foundCandidateUser = true;
                                break;
                            }
                        }
                    }

                    if (!foundCandidateUser) {
                        filteredUsers.push(filteredUser);
                    }

                }

                $scope.popup.userResults = filteredUsers;
                // console.log($scope.popup);
                // console.log($scope.popup.userResults);
                $scope.resetSelection();
            });
            // }
        }
    };

    // 当值有改变时候的过滤器。  组的
    $scope.updateGroupFilter = function () {
        if ($scope.popup.oldGroupFilter == undefined || $scope.popup.oldGroupFilter != $scope.popup.groupFilter) {
            if (!$scope.popup.groupFilter) {
                $scope.popup.oldGroupFilter = '';
            } else {
                $scope.popup.oldGroupFilter = $scope.popup.groupFilter;
            }
            // 获取组的方法
            GroupService.getFilteredGroups($scope.popup.groupFilter).then(function (result) {
                $scope.popup.groupResults = result.data;
                $scope.resetGroupSelection();
            });
        }
    };

    $scope.resetSelection = function () {
        if ($scope.popup.userResults && $scope.popup.userResults.length > 0) {
            $scope.popup.selectedIndex = 0;
        } else {
            $scope.popup.selectedIndex = -1;
        }
    };

    $scope.resetGroupSelection = function () {
        if ($scope.popup.groupResults && $scope.popup.groupResults.length > 0) {
            $scope.popup.selectedGroupIndex = 0;
        } else {
            $scope.popup.selectedGroupIndex = -1;
        }
    };

    $scope.removeAssignee = function () {
        $scope.popup.assignmentObject.idm.assignee = undefined;
    };


    // Click handler for + button after enum value
    $scope.addCandidateUserValue = function (index) {
        $scope.popup.assignmentObject.static.candidateUsers.splice(index + 1, 0, { value: '' });
    };

    // Click handler for - button after enum value
    $scope.removeCandidateUserValue = function (index) {
        $scope.popup.assignmentObject.static.candidateUsers.splice(index, 1);
    };

    $scope.setSearchType = function () {
        $scope.popup.assignmentObject.assignmentSourceType = 'search';
    };


    $scope.save = function () {
        console.log("保存的测试-----------");

        handleAssignmentInput($scope.popup.assignmentObject.static);

        $scope.assignment.type = $scope.popup.assignmentObject.type;
        // 这个里面就是默认开启人的。
        // console.log($scope.assignment);
     
        // 静态的。
        if ('static' === $scope.popup.assignmentObject.type) { // IDM
            $scope.popup.assignmentObject.idm = undefined;
            $scope.assignment.idm = undefined;
            $scope.assignment.assignee = $scope.popup.assignmentObject.static.assignee;
            $scope.assignment.candidateUsers = $scope.popup.assignmentObject.static.candidateUsers;
            $scope.assignment.candidateGroups = $scope.popup.assignmentObject.static.candidateGroups;
        }

        // $scope.property.value = {};
        // $scope.property.value.assignment = $scope.assignment;

        // console.log("测试==================================="); 
        console.log($scope.assignment);    
        $scope.value1 = $scope.assignment.candidateUsers;
        console.log("循环===================================");      
        // 把数据里面的用户给赋值到 用户里面去  根据数组id把对应的用户给查出来后，赋值到用户
        $scope.property.value = ""
        angular.forEach($scope.value1,function(value,key){
            // console.log(value.value);
            $scope.property.value += value.value + ","
            $scope.updatePropertyInModel($scope.property); 
        }); 
        console.log($scope.property);    

        $scope.close();

        // $scope.property.key = "oryx-process_potentialstarteruser"
        
        //  $scope.property.value.assignment.candidateGroups相当于是选中组的值
        // $scope.value1 = $scope.property.value.assignment.candidateUsers;
        // console.log("循环===================================");     
        // $scope.property.value = []; 
        // 把数据里面的用户给赋值到 用户里面去  根据数组id把对应的用户给查出来后，赋值到用户
        // $scope.property.value = ""
        // angular.forEach($scope.value1,function(value,key){
        //     console.log(key);
        //     // $scope.property.value.push(value.value); 循环输出里面的集合
        //     $http.get(FLOWABLE.CONFIG.contextRoot2 + '/groups/'+value.value+'/users')
        //     .success(
        //         function (response) { 
        //             // $scope.forms = response.data;
        //             // console.log(response.data);
        //             $scope.forms = response;
        //             // 取出用户的id后，赋值给那个  用户属性的 value
        //             angular.forEach($scope.forms,function(value,key){
        //                 // console.log(value);
        //                 // $scope.property.value.push(value.id);
        //                 // if($scope.forms.length ==key+1 ){
        //                 //     $scope.property.value += value.id 
        //                 // }else{
        //                     // $scope.property.value += value.id + ","
        //                 // } 
        //                 // $scope.property.value.assignment = $scope.assignment;
        //                 $scope.property.value += value.id + ","
        //                 $scope.updatePropertyInModel($scope.property);
        //                 // console.log("二次赋值成功");    
        //                 // console.log($scope.property);    
        //             });
        //             console.log(response); 
        //         }); 
        // });
        

        $scope.close();
    };

    // Close button handler
    $scope.close = function () {
        $scope.property.mode = 'read';
        $scope.$hide();
    };

    var handleAssignmentInput = function ($assignment) {

        function isEmptyString(value) {
            return (value === undefined || value === null || value.trim().length === 0);
        }

        if (isEmptyString($assignment.assignee)) {
            $assignment.assignee = undefined;
        }
        var toRemoveIndexes;
        var removedItems = 0;
        var i = 0;
        if ($assignment.candidateUsers) {
            toRemoveIndexes = [];
            for (i = 0; i < $assignment.candidateUsers.length; i++) {
                if (isEmptyString($assignment.candidateUsers[i].value)) {
                    toRemoveIndexes[toRemoveIndexes.length] = i;
                }
            }

            if (toRemoveIndexes.length == $assignment.candidateUsers.length) {
                $assignment.candidateUsers = undefined;
            } else {
                removedItems = 0;
                for (i = 0; i < toRemoveIndexes.length; i++) {
                    $assignment.candidateUsers.splice(toRemoveIndexes[i] - removedItems, 1);
                    removedItems++;
                }
            }
        }

        if ($assignment.candidateGroups) {
            toRemoveIndexes = [];
            for (i = 0; i < $assignment.candidateGroups.length; i++) {
                if (isEmptyString($assignment.candidateGroups[i].value)) {
                    toRemoveIndexes[toRemoveIndexes.length] = i;
                }
            }

            if (toRemoveIndexes.length == $assignment.candidateGroups.length) {
                $assignment.candidateGroups = undefined;
            } else {
                removedItems = 0;
                for (i = 0; i < toRemoveIndexes.length; i++) {
                    $assignment.candidateGroups.splice(toRemoveIndexes[i] - removedItems, 1);
                    removedItems++;
                }
            }
        }
    };

    function initStaticContextForEditing($scope) {
        if (!$scope.popup.assignmentObject.static.candidateUsers || $scope.popup.assignmentObject.static.candidateUsers.length == 0) {
            $scope.popup.assignmentObject.static.candidateUsers = [{ value: '' }];
        }
        if (!$scope.popup.assignmentObject.static.candidateGroups || $scope.popup.assignmentObject.static.candidateGroups.length == 0) {
            $scope.popup.assignmentObject.static.candidateGroups = [{ value: '' }];
        }
    }
}]);



// -------------------------------------------
// 可阅人的控制器------------读的。。
 angular.module('flowableModeler').controller('FlowableAssignmentPopupCtrl4',
    ['$rootScope', '$scope', '$translate', '$http', 'UserService', 'GroupService','$modal', 'editorManager', function ($rootScope, $scope, $translate, $http, UserService, GroupService,$modal,editorManager) {
        // 当可阅人有值的时候 
        if ($scope.property.value !== undefined && $scope.property.value !== null){
            // console.log($scope.property.value); 
            $scope.init = {}
            $scope.init.assignment = {
                type: 'staitc',
                candidateUsers: []
            }; 
            $scope.initvalue = $scope.property.value.split(','); 
            angular.forEach($scope.initvalue,function(value1,key){ 
                if($scope.initvalue.length == key+1){ 
                    // console.log("逗号不输出");
                }else{
                    // console.log("這個是有值的。。。")
                    var json = { value: value1 }
                    $scope.init.assignment.candidateUsers.push(json);
                    // console.log($scope.init.assignment.candidateUsers)
                } 
            }); 
        }
    
}]);