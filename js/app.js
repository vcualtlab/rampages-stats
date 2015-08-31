"use strict";
angular.module('App', ['MainCtrl', 'angularUtils.directives.dirPagination', 'ngSanitize', 'angular.filter']);
angular.module('MainCtrl', []).controller('MainController', function($scope, $http, $filter) {
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    $scope.butter = 'butter my bread';
    $scope.loading = "";
    $scope.posts_loaded = 0;
    $scope.view = 'list';
    $scope.switchTo = function(view) {
        $scope.view = view;
    };
    /**
     * Gets the first model in scope array. Does not do any ordering. Just takes index 0.
     * @param  {array} scope 
     * @return {array}       Returns a single model from index[0] in given scope
     */
    var getFirstPostInScope = function(scope) {
        var firstPost = scope[0];
        return firstPost;
    };
    /**
     * Gets the last model in scope array. Does not do any ordering. Just takes last index.
     * @param  {array} scope 
     * @return {array}       Returns a single model from end of given scope
     */
    var getLastPostInScope = function(scope) {
        var lastPost = scope[scope.length - 1];
        return lastPost;
    };
    var getDateGMT = function(model) {
        return model.date_gmt;
    };
    var getEpoch = function(date) {
        var epoch = Date.parse(date);
        return epoch;
    };
    $scope.getEpoch = function(date) {
        return Date.parse(date);
    };
    var getMinEpoch = function(scope) {
        var firstPostInScope = getFirstPostInScope(scope);
        // console.log(firstPostInScope[0].ID );
        var dateGMT = getDateGMT(firstPostInScope);
        // console.log(dateGMT);
        var epoch = getEpoch(dateGMT);
        // console.log(epoch);
        return epoch;
    };
    var getMaxEpoch = function(scope) {
        var lastPostInScope = getLastPostInScope(scope);
        // console.log(firstPostInScope);
        var dateGMT = getDateGMT(lastPostInScope);
        // console.log(dateGMT);
        var epoch = getEpoch(dateGMT);
        // console.log(epoch);
        return epoch;
    };
    $scope.pointInTime = function(value, min, max) {
        return (value - min) / (max - min) * 100;
    };
    // var pointInTime = function(value, min, max) {
    //     return (value - min) / (max - min) * 100;
    // };
    // console.log( pointInTime( Date.parse( '2015-08-06T02:38:16' ), 1435196297000, 1438953151000) );
    

    $scope.callToPoint = function( id ){
    	$scope.active_point_in_time = id;
    	// console.log( 'you are hovering over post_id: ' + id );
    };

    $scope.clearPoint = function( id ){
    	$scope.active_point_in_time = "";
    };

    $scope.activePointCalled = function( id ){
    	if ( id === $scope.active_point_in_time ){
    		return "active-point";
    	}
    };

    // $scope.togglePoint







    $scope.makeBlob = function(url, pagen, postsPerPage, blob) {
        if (pagen <= 1) {
            $scope.loading = "Loading posts...";
        }
        $http.get(url + "/wp-json/posts?filter[posts_per_page]=" + postsPerPage + "&page=" + pagen).success(function(data) {
            if (isEmpty(data)) {
                $scope.posts = blob;
                $scope.loading = $scope.posts.length + " posts loaded.";
                $scope.max = getMinEpoch($scope.posts);
                $scope.min = getMaxEpoch($scope.posts);
                // getFirstPostInScope( $scope.posts, url );
                return;
            } else {
                blob = blob.concat(data);
                // $scope.posts = blob;
                pagen++;
                $scope.posts_loaded = pagen * postsPerPage;
                $scope.loading = "Loading Posts... " + $scope.posts_loaded;
                // console.log(blob);
                $scope.makeBlob(url, pagen, postsPerPage, blob);
            }
        });
    };
});