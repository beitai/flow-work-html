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
'use strict';

angular.module('flowableModeler').service('UserService', ['$http', '$q','$window',
    function ($http, $q,$window) {

        // var token = $window.localStorage.token;
        // console.log("用户的token");
        // console.log(token);

        var httpAsPromise = function(options) {
            var deferred = $q.defer();
            $http(options).
                success(function (response, status, headers, config) {
                    deferred.resolve(response);
                })
                .error(function (response, status, headers, config) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        /*
         * Filter users based on a filter text. 根据过滤器文本过滤用户
         */ 
        this.getFilteredUsers = function (filterText, taskId, processInstanceId) {
            console.log("用户的的");
            var params = {filter: filterText};
            if(taskId) {
                params.excludeTaskId = taskId;
            }
            if (processInstanceId) {
                params.exclusdeProcessId = processInstanceId;
            }

            return httpAsPromise({
                method: 'GET',
                url: FLOWABLE.CONFIG.contextRoot2  + '/users',
                params: params,
                // headers:{'token':token}
            });
        };

    }]);

angular.module('flowableModeler').service('GroupService', ['$http', '$q','$window',
    function ($http, $q,$window) {

        // var token = $window.localStorage.token;
        // console.log("组的token");
        // console.log(token);

        var httpAsPromise = function(options) {
            var deferred = $q.defer();
            $http(options).
                success(function (response, status, headers, config) {
                    deferred.resolve(response);
                })
                .error(function (response, status, headers, config) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        /*
         * Filter functional groups based on a filter text. 根据过滤器文本过滤功能组。
         */
        this.getFilteredGroups = function (filterText) {
            console.log("组的"); 
            var params;
            if(filterText) {
                params = {filter: filterText};
            }

            // params = {'parentId': '0'};
            return httpAsPromise({
                method: 'GET',
                // url: FLOWABLE.CONFIG.contextRoot2 + '/groups',
                url: FLOWABLE.CONFIG.contextRoot2 + '/groupChild',
                params: params,
                // headers:{'token':token}
            });
        };
    }]);
