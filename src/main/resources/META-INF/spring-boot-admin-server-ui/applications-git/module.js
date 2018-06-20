/*
 * Copyright 2018 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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

(function (sbaModules, angular) {
  'use strict';
  var module = angular.module('sba-applications-git', ['sba-applications']);
  sbaModules.push(module.name);

  module.controller('gitCtrl', ['$scope', '$http', 'application', function ($scope, $http, application) {
    $scope.application = application;

    $scope.application.timeSince = function timeSince(strDate) {
      // found at: https://stackoverflow.com/a/3177838
      var date = new Date(strDate);
      var seconds = Math.floor((new Date() - date) / 1000);

      var interval = Math.floor(seconds / 31536000);
      if (interval > 1) {
	    return interval + " years";
      }

      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return interval + " months";
      }

      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return interval + " days";
      }

      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return interval + " hours";
      }

      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return interval + " minutes";
      }

      return Math.floor(seconds) + " seconds";
    };

    $http.get('api/applications/' + application.id + '/git').then(function (response) {
      var git = response.data.git;
      $scope.summary = [];
      
      for(var gitProperty in git) {
          $scope.summary.push({
              key: gitProperty,
              value: git[gitProperty]
          });
      }
    }).catch(function (response) {
      $scope.error = response.data;
    });
  }]);

  module.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('applications.git', {
      url: '/git',
      templateUrl: 'applications-git/git.html',
      controller: 'gitCtrl'
    });
  }]);

  module.run(['ApplicationViews', '$http', '$sce', function (ApplicationViews, $http, $sce) {
    ApplicationViews.register({
      order: 100,
      title: $sce.trustAsHtml('<i class="fa fa-git-square fa-fw"></i>git'),
      state: 'applications.git',
      show: function (application) {
        return $http.get('api/applications/' + application.id + '/git').then(
          function (response) {
            return response.data.git !== undefined && response.data.git != null;
          }).catch(function () {
            return false;
          });
      }
    });
  }]);
} (sbaModules, angular));
