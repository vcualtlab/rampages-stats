"use strict";

angular.module('App', ['MainCtrl']);

angular.module('MainCtrl', []).controller('MainController', function($scope, $http) {

		function isEmpty(obj) {
			return Object.keys(obj).length === 0;
		}

		$scope.butter = 'butter my bread';
		$scope.loading = "Loading Posts... 0";
		$scope.posts_loaded = 0;
		
		$scope.makeBlob = function( url, pagen, postsPerPage, blob ){
			
			$http.get( url + "/wp-json/posts?filter[posts_per_page]=" + postsPerPage + "&page=" + pagen).success(function (data) {
	       		
				if ( isEmpty(data) ){

					$scope.posts = blob;
					
					$scope.loading = $scope.posts.length + " posts loaded.";

					return;
				} else {
					blob = blob.concat(data);

					// $scope.posts = blob;

					pagen++;

					$scope.posts_loaded = pagen * postsPerPage;

					$scope.loading = "Loading Posts... " + $scope.posts_loaded;

					// console.log(blob);
					
					$scope.makeBlob( url, pagen, postsPerPage, blob );				
				}

	    	});
		};

});