/**
 * 弹出框默认的增加和修改操作
 *
 * @author wengwenhui
 * @date 2018年4月11日
 */
(function () {
  'use strict';
  //  默认为修改的模态框哇。 
  angular.module('adminApp').controller('EditModalController', function ($scope, $uibModalInstance) {
    //  用来做类型的接口
    $scope.categoryService = $scope.IdmService($scope.restUrl.idmTypes);
    $scope.category = 0;
    // 表单分类
    $scope.typeService = $scope.FormService($scope.restUrl.formFieldTypes);
    $scope.formData = $scope.formData || {};
    // 流程定义三层导航
    $scope.definitionService = $scope.FlowService($scope.restUrl.flowDefinitions); // 流程的定义 
    //  启动的
    $scope.instanceService = $scope.FlowService($scope.restUrl.flowInstances);

    if ($scope.id) {
      $scope.modalTitle = "修改" + $scope.title;

      $scope.service.get({
        urlPath: '/' + $scope.id
      }, function (data) {
        $scope.formData = angular.extend($scope.formData, data);
      });

      $scope.ok = function () {
        $scope.service.put({
          urlPath: '/' + $scope.id,
          data: $scope.formData
        }, function () {
          $uibModalInstance.close();
          $scope.showSuccessMsg($scope.modalTitle + '成功');
          $scope.complete();
        });
      };

    } else {
      $scope.modalTitle = '添加' + $scope.title;
      $scope.ok = function () {
        $scope.service.post({
          data: $scope.formData
        }, function () {
          $uibModalInstance.close();
          $scope.showSuccessMsg($scope.modalTitle + '成功');
          $scope.complete();
        });
      };
    }

    //日志的输出 
    if ($scope.key == 'log') {
      console.log("日记输出")
      $scope.modalTitle = $scope.title;
      $scope.service.get({
        urlPath: '/' + $scope.id
      }, function (data) {
        // $scope.formData = angular.extend($scope.formData, data);
        $scope.log = data;
        $scope.name = $scope.username
      });
    }

    // 流程分类   
    if ($scope.key == 'category') {
      $scope.toggle = false;
      $scope.toggle1 = false;
      // console.log("流程分类的输出")
      $scope.querycategory = function () {
        $scope.categoryService.get({
          urlPath: '/parentId/1'
        }, function (response) {
          $scope.category = response;
          // console.log(response);
        });
      }
      $scope.querycategory();
      // 单击  显示
      $scope.aa = function (category) {
        $scope.toggle = true;
      }
      //  失去焦点的方法  隐藏
      $scope.bb = function () {
        $(document).mousedown(
          function (event) {
            // console.log(event.target.id);
            if (event.target.id != 'groupColumn') {
              $scope.toggle = false;
              // console.log("隐藏")
            }
          }
        );
      }
      //  当值改变的方法  ng-change
      $scope.cc = function (category) {
        if (category != null) {
          $scope.toggle1 = true;
          $scope.category = null;
        } else { 
          $scope.toggle = true;
          $scope.toggle1 = false;
          $scope.formData.category = category
          $scope.categoryService.get({
            urlPath: '/parentId/1',
            params: $scope.formData
          }, function (response) {
            $scope.category = response;
            // console.log("查询赋值。。。");
          });
        }
      }
      // groupselect   单击赋值的方法  选择
      $scope.selectGroup = function (category) { 
        $scope.formData.category = category;
        $scope.toggle = false;
      }
      // 删除
      $scope.deleteGroup = function (id) {
        $scope.confirmModal({
          title: '确认删除分类',
          confirm: function () {
            $scope.categoryService.delete({
              urlPath: '/' + id
            }, function () {
              $scope.showSuccessMsg('删除分类成功');
              $scope.querycategory();
              $scope.formData.category = null;
            });
          }
        });
      };
      // 添加
      $scope.ok = function () {
         $scope.service.post({
          data: $scope.formData
        }, function () {
          $uibModalInstance.close();
          $scope.showSuccessMsg($scope.modalTitle + '成功');
          $scope.complete();
        });
        if(!$scope.id){
          $scope.formData.parentId = 1;
          $scope.formData.moduleType = $scope.formData.category; 
          $scope.categoryService.post({
            data: $scope.formData
          }, function () {
            // console.log("分类添加成功");
          });    
        }
      };
    }

    // 表单分类  
    if ($scope.key == 'category1') {
      $scope.toggle = false;
      $scope.toggle1 = false;
      // console.log("表单分类的输出")
      $scope.querycategory = function () {
        $scope.categoryService.get({
          urlPath: '/parentId/2'
        }, function (response) {
          $scope.category = response;
          // console.log(response);
        });
      }
      $scope.querycategory();
      // 单击  显示
      $scope.aa = function (category) {
        $scope.toggle = true;
      }
      //  失去焦点的方法  隐藏
      $scope.bb = function () {
        $(document).mousedown(
          function (event) { 
            if (event.target.id != 'groupColumn') {
              $scope.toggle = false; 
            }
          }
        );
      }
      //  当值改变的方法  ng-change
      $scope.cc = function (category) {
        if (category != null) {
          $scope.toggle1 = true;
          $scope.category = null;
        } else { 
          $scope.toggle = true;
          $scope.toggle1 = false;
          $scope.formData.category = category
          $scope.categoryService.get({
            urlPath: '/parentId/2',
            params: $scope.formData
          }, function (response) {
            $scope.category = response;
            // console.log("查询赋值。。。");
          });
        }
      }
      // groupselect   单击赋值的方法  选择
      $scope.selectGroup = function (category) { 
        $scope.formData.category = category;
        $scope.toggle = false;
      }
      // 删除
      $scope.deleteGroup = function (id) {
        $scope.confirmModal({
          title: '确认删除分类',
          confirm: function () {
            $scope.categoryService.delete({
              urlPath: '/' + id
            }, function () {
              $scope.showSuccessMsg('删除分类成功');
              $scope.querycategory();
              $scope.formData.category = null;
            });
          }
        });
      };
      // 添加
      $scope.ok = function () {
         $scope.service.post({
          data: $scope.formData
        }, function () {
          $uibModalInstance.close();
          $scope.showSuccessMsg($scope.modalTitle + '成功');
          $scope.complete();
        });
      if(!$scope.id){
          $scope.formData.parentId = 2;
          $scope.formData.moduleType = $scope.formData.category; 
          $scope.categoryService.post({
            data: $scope.formData
          }, function () {
            // console.log("分类添加成功");
          });    
        }
      };
    }

    // 表单字段类型的。
    if ($scope.key == "types") {
      // 做文本框选择的  测试;
      $scope.toggle = false;
      $scope.toggle1 = false;
      // console.log("测试--分类的输出")
      // 查询
      $scope.querytypes = function () {
        $scope.typeService.get({
        }, function (response) {
          $scope.types = response.data;
          $scope.count = response.total;
          // console.log(response);
        });
      }
      $scope.querytypes();
      //  单击显示的方法  获得焦点显示下次
      $scope.aa = function () {
        $scope.toggle = true;
      }
      //  失去焦点的方法  失去的时候隐藏
      $scope.bb = function () {
        $(document).mousedown(
          function (event) {
            if (event.target.id != 'groupColumn') {
              $scope.toggle = false;
            }
          }
        );
      }
      //  当值改变的方法  change  方法
       $scope.cc = function (types) {
        // console.log(types)
        if (types != null) {
          $scope.toggle1 = true;
          $scope.types = null;
        } else {
          $scope.toggle = true;
          $scope.toggle1 = false;
          $scope.formData.type = types
          $scope.typeService.get({
            params: $scope.formData
          }, function (response) {
            $scope.types = response.data;
            $scope.count = response.total;
            // console.log("查询赋值。。。");
          });
        }
      }
      // groupselect   选择 单击赋值的方法
      $scope.selectGroup = function (types) { 
        $scope.formData.type = types;
        $scope.toggle = false;
      }
      $scope.deleteGroup = function (id) {
        $scope.confirmModal({
          title: '确认删除分类',
          confirm: function () {
            $scope.typeService.delete({
              urlPath: '/' + id
            }, function () {
              $scope.showSuccessMsg('删除分类成功');
              $scope.querytypes();
              $scope.formData.type = null;
            });
          }
        });
      };
      $scope.ok = function () {
        // console.log("分类的测试");
        $scope.service.post({
          data: $scope.formData
        }, function () {
          $uibModalInstance.close();
          $scope.showSuccessMsg($scope.modalTitle + '成功');
          $scope.complete();
        });
        if (!$scope.id) {
          // console.log($scope.key);
          // console.log($scope.formData.type);
          // 设计一个表单字段的类型
          $scope.formData1 = {};
          $scope.formData1.name = $scope.formData.type; 
          $scope.typeService.post({
            data: $scope.formData1
          }, function () {
            // console.log("添加成功")
          });
        }
      };

    }

    // 这个是三层导航的 
    if($scope.key == 'nav'){
      // console.log("流程开启")
      $scope.modalTitle = $scope.title;
      $scope.service.get({
        urlPath : '/' + $scope.id
      }, function(data) {
        // $scope.formData = angular.extend($scope.formData, data);
        $scope.nav = data; 
        // console.log($scope.nav);
      });
       // 第一层
      $scope.b = function(){
        $(".AreaCenter").css({"width":"70%"});
        $(".AreaRight").hide();
      }
      // 第二层
      $scope.bb = function(data){
        $scope.category = data;
        // console.log('----------------------i')
        // console.log(i);
        $(".AreaCenter").css({"width":"30%"});
        $(".AreaRight").show();
        // console.log(data);
        $scope.queryParams = {};
        $scope.queryParams.name = null;
        $scope.queryParams.category = data;
        $scope.definitionService.get({
          params : $scope.queryParams 
        }, function(response) {
          $scope.queryResult = response.data; 
          $scope.count = response.total; 
          // console.log($scope.queryResult);
          // console.log($scope.count);
        });
      } 

      // 在搜索里查出所有的定义流程
      $scope.queryDefinition = function () {
        $scope.definitionService.get({
        }, function (response) {
          $scope.definitions = response.data;
          $scope.count = response.total;
          // console.log($scope.definitions);
          // console.log($scope.count);
        });
      };
      //搜索  查询的方法------------------
      $scope.queryParams = {};
      $scope.queryTask = function () {
        $(".AreaCenter").css({"width":"30%"});
        $(".AreaRight").show(); 
        $scope.userService = $scope.IdmService($scope.restUrl.idmUsers);  
        $scope.queryParams.category = null;
        // console.log("参数");
        // console.log($scope.queryParams);
        $scope.definitionService.get({
          params: $scope.queryParams
        }, function(response) {
          $scope.queryResult = response.data; 
          $scope.count = response.total; 
          $scope.category = response.data[0].category;
          // console.log("搜索-----------------有类型");
          // console.log($scope.queryResult);
          // console.log($scope.category); 
          // 把下面的给去掉，
          if($scope.queryParams.name==null){
            $scope.category = null;
          }
          // console.log(response.data.category);
          // 把负责人的id 改为 名字， 在列表里面。。
          // angular.forEach($scope.queryResult.data,function(each){
          //   console.log(each);
          //   var groupsPromise = $scope.userService.get({
          //     urlPath: '/'+each.assignee
          //   }, function (response) {
          //     console.log(response);
          //     each.assigneeName =  response.name
          //   });
          // });
          // $scope.queryResult.data[0].assigneeName= '11'
          // console.log("所有数据"); 
          // console.log($scope.queryResult.data[0]);
        });
      };
      $scope.queryDefinition();

      // $scope.queryTask();
      // 启动流程
      $scope.createInstance1 = function(name,id) {
        $scope.editConfirmModal({
          formUrl: 'definition-start.html',
          title: '启动流程实例',
          formData: {name:name,processDefinitionId:id},
          confirm: function (formData,modalInstance) {
            $scope.instanceService.post({
              data: formData
            }, function () {
              $scope.showSuccessMsg('启动流程实例成功');
              modalInstance.close();
              $scope.$state.go('main.flow.task');
              $uibModalInstance.dismiss('cancel');
            });
          }
        }); 
      };
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };


  });
})();
