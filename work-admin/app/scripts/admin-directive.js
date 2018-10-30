/**
 * 自定义指令
 * 
 * @author wengwh
 * @date 2018-03-26
 */
(function () {
  'use strict';

  angular.module('adminApp').directive('viewLoad', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/common/view-load.html',
      link: function (scope, element) {
        $(element).fadeIn(300);
      }
    };
  }).directive('ngPagination', [ '$compile',function($compile) {
    return {
      restrict : 'A',
      require: 'ngModel',
      scope: {
        total: '=ngModel' ,
        param: '=' ,
        changed: '=' 
      },
      link : function($scope, element) {
        $scope.pageList= [5, 10, 20, 50, 100, 500];
        $scope.param = $scope.param || {};
        $scope.param.pageNum = $scope.param.pageNum || 1;
        $scope.param.pageSize = $scope.param.pageSize || 10;
        $scope.total = $scope.total || 9999999;

        $scope.pageNumChange = function() {
          $scope.changed();
        };

        $scope.pageSizeChange = function() {
          $scope.param.pageNum = 1;
          $scope.changed();
        };

        var html = '<div class="row ng-pagination">'+
              '          <div class="col-xs-12 col-sm-5">'+
              '        <select class="form-control input-sm" ng-model="param.pageSize" ng-change="pageSizeChange()">'+
              '          <option ng-repeat="item in pageList" ng-value="item">{{item}} 条/页</option>'+
              '        </select> 共 {{total}} 条'+
              '      </div>'+
              '      <div class="col-xs-12 col-sm-7">'+
              '        <nav>'+
              '          <ul uib-pagination ng-change="pageNumChange()" total-items="total"'+
              '            items-per-page="param.pageSize" ng-model="param.pageNum"'+
              '            max-size="5" class="pagination-sm" boundary-links="true"'+
              '            previous-text="&lsaquo;" next-text="&rsaquo;"'+
              '            first-text="&laquo;" last-text="&raquo;">'+
              '          </ul>'+
              '        </nav>'+
              '      </div>'+
              '    </div>';
        
        element.html('').append($compile(html)($scope));
      }
    };
  } ]).directive('ngIcheck', ['$timeout',function($timeout) {
    return {
      require: 'ngModel',
      link: function($scope, element, $attrs, ngModel) {
        return $timeout(function() {
          $scope.$watch($attrs.ngModel, function () {
              $(element).iCheck('update');
          });

          return $(element).iCheck({
              checkboxClass: 'icheckbox_square-aero',
              radioClass: 'iradio_square-aero',
              increaseArea: '20%' 
          }).on('ifChanged', function (event) {
              if ($(element).attr('type') === 'checkbox' && $attrs.ngModel) {
                  $scope.$apply(function () {
                      return ngModel.$setViewValue(event.target.checked);
                  });
              }
              if ($(element).attr('type') === 'radio' && $attrs.ngModel) {
                  return $scope.$apply(function () {
                      return ngModel.$setViewValue($attrs.value);
                  });
              }
          });
        });
      }
    };
  }]).directive('ngTable', [ '$compile', function($compile) {
    return {
      restrict : 'A',
      link : function(scope, element, attrs) {
        var conf = scope[attrs.ngTable];
        var tableId = conf.id;
        scope[tableId] = scope[tableId] || {};
        scope[tableId].loadFunction = conf.loadFunction || function() {};
        scope[tableId].queryParams = conf.queryParams || {};
        
        if(angular.isUndefined(scope[tableId].queryParams.sortName)){
          scope[tableId].queryParams.sortName = conf.sortName || "";
        }
        if(angular.isUndefined(scope[tableId].queryParams.sortOrder)){
          scope[tableId].queryParams.sortOrder = conf.sortOrder || "desc";
        }

        if(conf.isPage === false){
          scope[tableId].isPage = false;
        }else{
          scope[tableId].isPage = true;
        }

        scope[tableId].sortChange = scope[tableId].sortChange || function(sortName) {
          if (scope[tableId].queryParams.sortName !== sortName) {
            scope[tableId].queryParams.sortName = sortName;
            scope[tableId].queryParams.sortOrder = "desc";
          } else {
            if (scope[tableId].queryParams.sortOrder === "desc") {
              scope[tableId].queryParams.sortOrder = "asc";
            } else {
              scope[tableId].queryParams.sortOrder = "desc";
            }
          }
          scope[tableId].loadFunction();
        };
        
        var headThStr = '';
        var bodyThStr = '';
        for (var i in conf.colModels) {
          var sortHtml = '';
          if (conf.colModels[i].sortable) {
            sortHtml = 'ng-class="{\'sorting\':' + tableId + '.queryParams.sortName!=\'' + conf.colModels[i].index + '\',' +
             '\'sorting_asc\':' + tableId + '.queryParams.sortName==\'' + conf.colModels[i].index + '\'&&' + tableId + '.queryParams.sortOrder==\'asc\',' +
             '\'sorting_desc\':' + tableId + '.queryParams.sortName==\'' + conf.colModels[i].index + '\'&&' + tableId + '.queryParams.sortOrder==\'desc\'}" '+ 
             'ng-click="' + tableId + '.sortChange(\'' + conf.colModels[i].index + '\')"';
          }
          var widthHtml = '';
          if (conf.colModels[i].width) {
            widthHtml = 'width=' + conf.colModels[i].width;
          }
          headThStr = headThStr + '<th ' + widthHtml + ' ' + sortHtml + ' >' + conf.colModels[i].name + '</th>\n';

          if (conf.colModels[i].formatter) {
            bodyThStr = bodyThStr + '<td>' + conf.colModels[i].formatter() + '</td>\n';
          } else {
            bodyThStr = bodyThStr + '<td>{{row.' + conf.colModels[i].index + '}}</td>\n';
          }
        }

        var trHtml = null;
        if(scope[tableId].isPage){
          trHtml = '<tr ng-repeat="row in ' + conf.data + '.data ">';
        }else{
          trHtml = '<tr ng-repeat="row in ' + conf.data +'">';
        }
        
        var tableHtml = '<thead><tr>' + headThStr + '</tr></thead><tbody>'+ trHtml+ bodyThStr + '</tr></tbody>';
        
        element.html('').append($compile(tableHtml)(scope));
        
        if(scope[tableId].isPage){
          var pageHtml = '<div ng-pagination ng-model="'+ conf.data +'.total" changed="'+ tableId +'.loadFunction" param="' + tableId + '.queryParams"></div>';
          element.after($compile(pageHtml)(scope));
        }
      }
    };
  } ]).directive('ngIconpicker', ['$timeout',function ($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        data: '=ngModel'
      },
      link: function (scope, element) {
        var config = {
            arrowClass: 'btn-info',
            arrowPrevIconClass: 'glyphicon glyphicon-chevron-left',
            arrowNextIconClass: 'glyphicon glyphicon-chevron-right',
            cols: 10,
            footer: true,
            header: true,
            iconset: 'fontawesome',
            labelHeader: '第{0}页/共 {1} 页',
            labelFooter: '{0} - {1} 共 {2} 图标',
            placement: 'bottom',
            rows: 5,
            search: true,
            searchText: '搜索',
            selectedClass: 'btn-success',
            unselectedClass: ''
        };
        
        scope.$watch("data", function(newValue) {
          if(newValue){
            element.iconpicker('setIcon', newValue);
          }
        });
        
        element.on('change', function(e) {
          $timeout(function() {
            scope.data = e.icon;
          });
        });
        element.iconpicker(config);
      }
    };
  }]).directive('colorbox', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var colorbox_params = {
          rel: 'colorbox',
          reposition:true,
          scalePhotos:true,
          scrolling:false,
          current:'{current} of {total}',
          maxWidth:'100%',
          maxHeight:'100%'
        };
        $(element).colorbox(colorbox_params);
      }
    };
  }).directive('fileInput', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.fileinput({
          language: 'zh',
          uploadUrl: '#'
        });
        
        scope.$watch(attrs.ngDisabled, function (ngDisabled) {
          if (ngDisabled) {
            element.fileinput('disable');
          } else {
            element.fileinput('enable');
          }
        });
       
        scope.$watch(attrs.fileInput, function (fileInput) {
          if (angular.isDefined(fileInput)) {
            fileInput = angular.copy(fileInput);
            if(angular.isDefined(fileInput.allowedFileTypes)){
              if (fileInput.allowedFileTypes.indexOf("all") >= 0 || fileInput.allowedFileTypes.length === 0) {
                fileInput.allowedFileTypes = null;
              }
            }
            if(angular.isDefined(fileInput.allowedFileExtensions)){
              if (fileInput.allowedFileExtensions.indexOf("all") >= 0 || fileInput.allowedFileExtensions.length === 0) {
                fileInput.allowedFileExtensions = null;
              }
            }
            if(angular.isDefined(fileInput.fileuploaded)){
              element.on('fileuploaded', fileInput.fileuploaded);
            }
            element.fileinput('refresh', fileInput);
          }
        }, true);
      }
    };
  }).directive('datetimePicker', function () {
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
  });

  var compileTemplate = function ($compile, element, templatName, scope) {
    return scope.$watch(templatName, function (template) {
      if (!template) {
        return;
      }
      var view = $compile(template)(scope);
      return $(element).html(view);
    });
  };
// 这个是插件来着？
  angular.module('builder.directive', []).directive('fbForm', [function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        data: '=ngModel',
        forms: '=fbForm'
      },
      template: '<div ng-repeat="component in forms.components"><div fb-form-object="component"></div></div>'
    };
  }]).directive('fbFormObject', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      scope: {
        component: '=fbFormObject'
      },
      link: function (scope, element, attrs, ngModel) {
        scope.data = scope.$parent.data;
        scope.showForm = true;
        var watchArrayValue = ['checkbox', 'select', 'multiple-select'];

        var overrideId = scope.component.properties.overrideId;
        return compileTemplate($compile, element, 'component.template', scope);
      }
    };
    
  }]).directive('fbBuilder', [function () {
    return {
      restrict: 'A',
      scope: {
        forms: '=fbBuilder'
      },
      templateUrl: 'views/directive/fb-builder.html',
      controller: 'fbBuilderController',
      link: function (scope, element) {
        if (scope.forms.id === 'root') {
          element.children(':first').addClass('fb-builder');
          angular.element(window).resize();
        }
      }
    };
  }]).directive('fbBuilderObject', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      scope: {
        component: '=fbBuilderObject'
      },
      link: function (scope, element) {
        return compileTemplate($compile, element, 'component.template', scope);
      }
    };
  }]).directive('fbHtml', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (attrs.summernote) {
          return;
        }

        scope.fbHtmlConfig = scope.$eval(attrs.fbHtml) || {};
        scope.fbHtmlConfig.lang = scope.fbHtmlConfig.lang || 'zh-CN';

        scope.$watch(attrs.ngDisabled, function (ngDisabled) {
          if (ngDisabled) {
            element.summernote('disable');
          } else {
            element.summernote('enable');
          }
        });
        
        element.removeAttr('fb-html');
        element.attr('summernote', '');
        element.attr('config', 'fbHtmlConfig');
        $compile(element)(scope);
      }
    };
  }]);
  
})();
