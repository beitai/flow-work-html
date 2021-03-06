/**
 * 流程任务控制器
 *
 * @author wengwenhui
 * @date 2018年4月19日
 */
(function () {
  'use strict';

  angular.module('adminApp').controller('FlowTaskController', function ($scope, $stateParams, $q,$timeout,$location,$window) {
    $scope.form_definitionService = $scope.FormService($scope.restUrl.formDefinitions);
    $scope.taskService = $scope.FlowService($scope.restUrl.flowTasks);
    $scope.taskService1 = $scope.FlowService($scope.restUrl.runTasks);
    $scope.instanceService = $scope.FlowService($scope.restUrl.flowInstances);
    $scope.definitionService = $scope.FlowService($scope.restUrl.flowDefinitions);
    $scope.userService = $scope.IdmService($scope.restUrl.idmUsers);
    $scope.detailId = $stateParams.id || '0';
    $scope.queryParams = $scope.detailId === '0' ? $scope.getCacheParams() : {};
    $scope.queryResult = {};
    $scope.selectedItem = null;
    // 根据用access_token获取相应的 token 和 name,id
    $scope.token = $scope.IdmService($scope.restUrl.token); 
    //这个是定义的流程，  算是搜索的？  
    $scope.queryDefinition = function () {
      $scope.definitionService.get({
      }, function (response) { 
        $scope.definitions = response.data;
      });
    };

    // 查看任务详情的 
    $scope.queryDetail = function (id,status) {
      // console.log("这个是获取可阅人的状态");
      var str = $location.search();   
      $scope.status = $location.search().status;
      
      // 根据那边系统跳转过来，重置用户信息
      $scope.user()

      // 查询任务详情的方法
      $scope.taskService.get({
        urlPath: '/' + id
      }, function (response) {
        $scope.selectedItem = response;
        // 把图片给查询出来
        $scope.img = $scope.instanceService.url + '/' + $scope.selectedItem.processInstanceId + '/image.png?token=' + $scope.loginUser.token;

        console.log("表单标识");
        console.log($scope.selectedItem);
        // 执行查询流程日记的任务
        $scope.log(); 
        // 执行表单输出的任务
        $scope.form();
        
     
      });
    };

    // 这个是跳转的方法。 另一套系统跳过来的。
    $scope.user = function(){
      // 同步 用户的id 和姓名  
      $scope.access_token = $location.search()["access_token"];  
      if($scope.access_token!=null){ 
        $window.localStorage.access_token = $scope.access_token;
        // 请求token的接口
          $scope.token.get({  
            urlPath:"/"+$scope.access_token
          },function(response){ 
            // console.log(response); 
            // window.localStorage.token 指的是浏览器本地的缓存
            // $scope.loginUser.token 是否是实时指的用户的登录信息?
            $window.localStorage.token = response.token;
            $window.localStorage.userName = response.name;
            $window.localStorage.userId = response.id;  
            $window.localStorage.userId = response.id;  
            $window.localStorage.userAvatar = response.avatar;
            $scope.loginUser.userName = response.name; 
            $scope.loginUser.token = response.token;
            $scope.loginUser.userId = response.id;  
            $scope.loginUser.userAvatar = response.avatar;  
          }); 
      }
  }
    
    // 表单输出和是否填写判断
    $scope.form = function(){
      if($scope.selectedItem.formKey!=null && $scope.selectedItem.formKey!=""){
        $scope.form_definitionService.get({
          urlPath: '/json',
          params: {
            processInstanceId: $scope.selectedItem.processInstanceId,
            formKey: $scope.selectedItem.formKey
          }
        }, function (response) {
          $scope.id = response.bytearrayId
          // console.log("查询出来的格式 id")
          // console.log($scope.id);
          // console.log("查询出来的格式 json 对应值是数组")
          // console.log(response.json);
          if (response.json === "") { return; }
          $scope.forms1 = $.parseJSON(response.json);
          if ($scope.forms1.length > 0) {
            $scope.forms = []; 
            angular.forEach($scope.forms1, function (forms, index) { 
              // ------------------------------------以下是做表单的是否可填
              // 拿出各行里面的对应的组件，无论多少个多少放在 .components[0]里面 
              // console.log($scope.forms1[index].forms);
              // 这个是根据json的结构， 一行对应的4(会变，但一般有多少个就输多少个)个组件放在$scope.forms1[index].forms里面
              if($scope.selectedItem.form_update == '不可填'){   
                angular.forEach($scope.forms1[index].forms,function (value,key){
                  // console.log(value);  value.components[0] 输出里面的所有组件   
                  // console.log(value.components[0]);
                  if(value.components[0]!= undefined ){
                    // console.log(value.components[0].properties);
                    // 这是是根据初始值来判断是文本还是输入框，如果是输入框的话，可以把它的样式进行更改
                    if(value.components[0].properties.initValue != undefined ){
                      value.components[0].properties.visible = "disabled";
                      value.components[0].properties.style.border = "0px";
                      value.components[0].properties.style["border-bottom"] = "1px solid";
                    }
                  }
                }) 
             }
              // console.log($scope.forms1[index].forms[index]);
              // console.log($scope.forms1[index].forms[index].components[0]); 
              // console.log($scope.forms1[index].forms[index].components[0].properties); 
              // if($scope.forms1[index].forms[index].components[0].properties.initValue != undefined ){
              //   $scope.forms1[index].forms[index].components[0].properties.visible = "disabled";
              // }
              $scope.forms[index] = {};
              $scope.forms[index].component = $scope.forms1[index];
            });
            // 这个是最后的 在页面输出组件的json 格式
            // console.log($scope.forms);
          } 
        }); 
      }
    }
         // 组件
    // $scope.queryjson = function (id) { 
    // $scope.form_definitionService.get({
    //   urlPath: '/' + id + '/json'
    // }, function (response) {
    //   console.log($.parseJSON(response.json));
    //   $scope.forms1 = $.parseJSON(response.json);
    //   if($scope.forms1.length > 0){
    //     $scope.forms = [];
    //     angular.forEach($scope.forms1, function(forms,index){
    //       $scope.forms[index] = {};
    //       $scope.forms[index].component = $scope.forms1[index];
    //     });
    //   }  
    // });
    // };

    // 这个是之前做图片更新无效，然后用另外一种方法替换掉。
    // $scope.count = 0;
    // $scope.getImageUrl = function (id,con) {
    //   $scope.count ++;
    //   console.log("执行"+$scope.count);
    //   if (angular.isDefined(id)) {
    //     var time = new Date().getTime();   
    //     console.log("图片测试");
    //     console.log(con);  
    //     return $scope.instanceService.url + '/' + id + '/image.png?token=' + $scope.loginUser.token+con;
    //   }
    //   return null;
    // };

    //  提交表单数据 
    $scope.subjson = function (id,component) { 
      var components = [];
      angular.forEach(component,function(com,index){ 
          components.push(com.component);
      })
      console.log(components); 

      $scope.taskService.get({
        urlPath: '/' + id
      }, function (response) {
          $scope.confirmModal({
            title: '确认提交数据',
            confirm: function () {
              console.log($scope.selectedItem);
              $scope.selectedItem = response;
              $scope.form_definitionService.post({
                urlPath: '/json',
                data:{
                  procInstId: $scope.selectedItem.processInstanceId,
                  tableKey: $scope.selectedItem.formKey,
                  editorJson: JSON.stringify(components),
                  id:$scope.id
                }
              }, function (response) {
                console.log('提交成功'); 
                $scope.showSuccessMsg('表单提交成功');
              }); 
            }
          });
        });
    };

    //流程日记输出的方法 
    $scope.log = function (){
           // 流程图日志详情
        // 用来把日志的 id 换成 name
        $scope.userService.get({
        }, function (response) {
          $scope.users = response; 
          // 根据流程的标识来把日志的表格给弄出来
          $scope.logService = $scope.FlowService($scope.restUrl.tasklog);
          $scope.queryParams.procDefId = $scope.selectedItem.processDefinitionId;
          $scope.queryParams.sortName = 'time';
          $scope.logService.get({ 
            params: $scope.queryParams
          },function(response){ 
            // console.log(response); 
            $scope.tasklogResult = response.data;  
            // 把负责人的id 改为 名字， 在列表里面。。
              angular.forEach(response.data,function(each){
                  angular.forEach($scope.users.data,function(user){ 
                    // console.log(each);console.log(user)
                      if (each.userId==user.id) {
                          each.username = user.name 
                      }
                  }); 
              });  
          });

        });
    } 
    // 流程日记输出的方法
    $scope.logOptions = {
        id: 'tasklog',
        data: 'tasklogResult',
        isPage: false,
        colModels: [ 
          { name: 'id', index: 'id',width: '20%' },
          { name: '任务名称', index: 'taskName',width: '20%' },
          { name: '操作人', index: 'username',width: '20%' },
          {name:'状态',index:'status', width: '20%',
            formatter : function() {
                return '<span ng-if="row.status==2">结束</span> <span ng-if="row.status!=2">{{row.status== 0 ?"反驳":"完成"}}</span>';
              }
          },
          { name: '操作时间', index: 'time', width: '20%',sortable: true, },
        ], 
        loadFunction: $scope.log,
        queryParams: $scope.queryParams,
        sortName: 'time',
        sortOrder: 'desc',
      };

    // 查询所有任务的， 把负责人id 改成负责人名字
    $scope.queryTask = function () {
  
      $scope.userService.get({
        }, function (response) {
          $scope.users = response;

          $scope.taskService.get({
            params: $scope.queryParams
          }, function (response) {
            $scope.queryResult = response;
            // 把负责人的id 改为 名字， 在列表里面。。
            angular.forEach($scope.queryResult.data,function(each){
              // console.log(each);
              if(each.assignee==null)
              {
                each.assigneeName = '空';
              }else{   
                  angular.forEach($scope.users.data,function(user){
                    if(each.assignee==user.id){
                        each.assigneeName = user.name
                      }
              }); 
              // 这个不行，查太多次用户。
              // var groupsPromise = $scope.userService.get({
              //   urlPath: '/'+each.assignee
              // }, function (response) {
              //   console.log(response);
              //   each.assigneeName =  response.name
              // }); 
            }
          }); 
        }); 

      });
    };

    $scope.editTask = function (item) {
      $scope.editConfirmModal({
        formUrl: 'task-edit.html',
        title: '编辑任务',
        formData: item,
        confirm: function (formData, modalInstance) {
          $scope.taskService.put({
            urlPath: '/' + item.id,
            data: formData
          }, function () {
            $scope.showSuccessMsg('编辑任务成功');
            $scope.queryDetail(item.id);
            modalInstance.close();
          });
        }
      });
    };

    $scope.assignTask = function (item) {
      $scope.editTaskUser(item, '转派任务', 'assign');
    };

    $scope.delegateTask = function (item) {
      $scope.editTaskUser(item, '委托任务', 'delegate');
    };

    $scope.editTaskUser = function (item, title, action) {
      var users = [];
      var usersPromise = $scope.userService.get({
        params: { status: 0 }
      }, function (response) {
        users = response.data;
      });

      $q.all([usersPromise]).then(function () {
        $scope.editConfirmModal({
          formUrl: 'task-user-edit.html',
          title: title,
          formData: { name: item.name, users: users },
          confirm: function (formData, modalInstance) {
            $scope.taskService.put({
              urlPath: '/' + item.id + '/' + action + '/' + formData.userId,
            }, function () {
              $scope.showSuccessMsg(title + '成功');
              $scope.queryDetail(item.id);
              modalInstance.close();
            });
          }
        });
      });
    };
    // 完成任务
    $scope.completeTask = function (item) {
      $scope.confirmModal({
        title: '确认完成任务',
        confirm: function () {
          $scope.taskService.put({
            urlPath: '/' + item.id + '/complete',
            data: '{"variables":[{"name":"submitType","type":"string","value":"y"}]}'
          }, function (data) {
            $scope.showSuccessMsg('完成任务成功');
            $scope.queryDetail(item.id);

            $scope.taskService1.get({  
            urlPath: '/' + item.id
            },function(data){
              console.log(data);
            });
            
            // $timeout(function(){location.reload()},1000);  
            // console.log($scope.getImageUrl(item.processInstanceId)); 
            console.log("图片的重新获取"); 
            $scope.img = $scope.instanceService.url + '/' + $scope.selectedItem.processInstanceId + '/image.png?token=' + $scope.loginUser.token+"&"+new Date().getTime();
          });
        }
      });
    };
    // 驳回任务
    $scope.backTask = function (item) {
      $scope.confirmModal({
        title: '确认驳回任务',
        confirm: function () {
          $scope.taskService.put({
            urlPath: '/' + item.id + '/complete',
            data: '{"variables":[{"name":"submitType","type":"string","value":"n"}]}'
          }, function () {
            $scope.showSuccessMsg('任务驳回成功');
            $scope.queryDetail(item.id);

            $scope.taskService1.get({  
              urlPath: '/' + item.id
              },function(data){
                console.log(data);
              });

            // $timeout(function(){location.reload()},1000); 
            console.log("图片的重新获取"); 
            $scope.img = $scope.instanceService.url + '/' + $scope.selectedItem.processInstanceId + '/image.png?token=' + $scope.loginUser.token+"&"+new Date().getTime();
          });
        }
      });
    };
    $scope.deleteTask = function (item) {
      $scope.confirmModal({
        title: '确认删除任务',
        confirm: function () {
          $scope.taskService.delete({
            urlPath: '/' + item.id
          }, function () {
            $scope.showSuccessMsg('删除任务成功');
            $scope.gotoList();
          });
        }
      });
    };




    $scope.tableOptions = {
      id: 'task',
      data: 'queryResult',
      colModels: [
        { name: '任务ID', index: 'id', width: '7%' },
        { name: '任务名称', index: 'name', width: '8%' },
        { name: '流程标识', index: 'processDefinitionId', sortable: true, width: '8%' },
        // { name: '负责人', index: 'assignee', sortable: true, width: '7%' },
        { name: '负责人', index: 'assigneeName',  width: '7%' },
        // { name: '所有人', index: 'owner', sortable: true, width: '7%' }, 
        {name:'状态',index:'endTime', width: '7%',
        formatter : function() {
          return '<span>{{row.endTime==null?"未处理":"已处理"}}</span>';
          }
        },
        { name: '开始时间', index: 'startTime', sortable: true, width: '10%' },
        { name: '结束时间', index: 'endTime', sortable: true, width: '10%' },
        {
          name: '操作', index: '', width: '7%',
          formatter: function () {
            return '<button type="button" class="btn btn-info btn-xs" ng-click=gotoDetail1(row.id,row.status)><i class="fa fa-eye"></i>&nbsp;明细</button>';
          }
        }
      ],
      loadFunction: $scope.queryTask,
      queryParams: $scope.queryParams,
      sortName: 'startTime',
      sortOrder: 'desc',
    };

    $scope.queryVariable = function (id) {
      $scope.taskService.get({
        urlPath: '/' + id + '/variables'
      }, function (response) {
        $scope.queryVariableResult = response;
      });
    };

    $scope.createVariable = function (id) {
      $scope.editConfirmModal({
        formUrl: 'variable-create.html',
        title: '添加任务变量',
        confirm: function (formData, modalInstance) {
          $scope.taskService.post({
            urlPath: '/' + id + '/variables',
            data: formData
          }, function () {
            $scope.showSuccessMsg('添加任务变量成功');
            $scope.queryVariable(id);
            modalInstance.close();
          });
        }
      });
    };

    $scope.deleteVariable = function (id, name) {
      $scope.taskService.delete({
        urlPath: '/' + id + '/variables/' + name
      }, function () {
        $scope.showSuccessMsg('删除任务变量成功');
        $scope.queryVariable(id);
      });
    };

    $scope.variableTableOptions = {
      id: 'taskVariable',
      data: 'queryVariableResult',
      isPage: false,
      colModels: [
        { name: '变量名称', index: 'name' },
        { name: '类型', index: 'type' },
        { name: '变量值', index: 'value' },
        {
          name: '操作', index: '',
          formatter: function () {
            return '<button type="button" class="btn btn-danger btn-xs" ng-click=deleteVariable(selectedItem.id,row.name) ng-disabled="selectedItem.endTime != null"><i class="fa fa-trash-o"></i>&nbsp;删除</button>';
          }
        }
      ]
    };
    $scope.queryIdentity = function (id) {
      $scope.taskService.get({
        urlPath: '/' + id + '/identity-links'
      }, function (response) {
        $scope.queryIdentityResult = response; 
      });
    };

    $scope.deleteIdentity = function (id, type, identityId) {
      $scope.taskService.delete({
        urlPath: '/' + id + '/identity-links/' + type + '/' + identityId
      }, function () {
        $scope.showSuccessMsg('删除候选信息成功');
        $scope.queryIdentity(id);
      });
    };

    $scope.createIdentity = function (id) {
      var item = {};
      var usersPromise = $scope.userService.get({
        params: { status: 0 }
      }, function (response) {
        item.users = response.data;
      });

      var groupsPromise = $scope.userService.get({
        urlPath: '/groups'
      }, function (response) {
        item.groups = response;
      });


      $q.all([usersPromise, groupsPromise]).then(function () {
        $scope.editConfirmModal({
          formUrl: 'task-identity-create.html',
          title: '添加候选信息',
          formData: item,
          confirm: function (formData, modalInstance) {
            var requestBody = { type: formData.type };
            if (formData.type === 'user') {
              requestBody.identityId = formData.user[0].id;
            } else {
              requestBody.identityId = formData.group[0].id;
            }
            $scope.taskService.post({
              urlPath: '/' + id + '/identity-links',
              data: requestBody
            }, function () {
              $scope.showSuccessMsg('添加候选信息成功');
              $scope.queryIdentity(id);
              modalInstance.close();
            });
          }
        });
      });
    };

    $scope.identityTableOptions = {
      id: 'taskidentity',
      data: 'queryIdentityResult',
      isPage: false,
      colModels: [
        { name: 'ID', index: 'identityId' },
        { name: '名称', index: 'identityName' },
        {
          name: '类型', index: 'type',
          formatter: function () {
            return '<span>{{row.type=="user"?"用户":"群组"}}</span>';
          }
        },
        {
          name: '操作', index: '',
          formatter: function () {
            return '<button type="button" class="btn btn-danger btn-xs" ng-click=deleteIdentity(selectedItem.id,row.type,row.identityId) ng-disabled="selectedItem.endTime != null"><i class="fa fa-trash-o"></i>&nbsp;删除</button>';
          }
        }
      ]
    };

    if ($scope.detailId !== '0') {
      $scope.queryDetail($scope.detailId);
    } else {
      $scope.queryDefinition();
      $scope.queryTask();
    }

  });

})();
