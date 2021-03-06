AngularJS
===

This demo is an implementation of the 
[AngularJS Tutorial](http://docs.angularjs.org/tutorial) through step 11.  

This demo starts by defining one index, and where to find the partials and
js templates:
[angularjs.rb](https://github.com/rubys/wunderbar/blob/master/demo/angularjs.rb).

views
---

Three views are provided, one common layout and two partials.

[index._html](https://github.com/rubys/wunderbar/blob/master/demo/views/index._html)
is a minimal.  Of note, underscored embedded in attribute names are converted to
dashes, and Ruby symbols may be used to define HTML boolean attributes.  Each
of the following are equivalent:

```ruby
_div :ng_view
_div ng_view: true
_div ng_view: "ng-view"
_div "ng-view" => "ng-view"
```

[phone-list._html](https://github.com/rubys/wunderbar/blob/master/demo/partials/phone-list._html)
is a partial.  Class names also get embedded underscores to dashes.  An
exclamation mark at the end of an element name indicates that the element is
compact, in that whitespace is added before or after child elements.  The net
result is that `<a ...><img .../></a>` all appears on one line.

[phone-detail._html](https://github.com/rubys/wunderbar/blob/master/demo/partials/phone-detail._html)
is a considerably larger partial.  This file would have required a bit of
effort to code by hand.  Wunderbar provides a tool to help.  This tool makes
use of the [nokogumbo](http://rubygems.org/gems/nokogumbo) gem, so install it
first, then run

    ruby tools/web2script.rb https://raw.github.com/angular/angular-phonecat/step-11/app/partials/phone-detail.html --partial --no-header --group=4

js
---

Four scripts are provided.
These correspond to the [original tutorial js
files](https://github.com/angular/angular-phonecat/tree/step-11/app/js).

[app._js](https://github.com/rubys/wunderbar/blob/master/demo/js/app._js)
defines a module that uses the other three and defines a route using the
[$routeProvider](http://docs.angularjs.org/api/ngRoute.$routeProvider) API.

```ruby
module Angular::PhonecatApp
  use :PhonecatControllers, :PhonecatFilters, :PhonecatServices

  case $routeProvider
  when '/phones'
    templateUrl = 'partials/phone-list.html'
    controller = 'PhoneListCtrl'
  when '/phones/:phoneId'
    templateUrl = 'partials/phone-detail.html'
    controller = 'PhoneDetailCtrl'
  else
    redirectTo '/phones'
  end
end
```

[services._js](https://github.com/rubys/wunderbar/blob/master/demo/js/services._js)
defines a `Phone` service using the [$resource](http://docs.angularjs.org/api/ngResource.$resource) API.

```ruby
module Angular::PhonecatServices
  Phone = $resource.new 'phones/:phoneId.json', {},
    query: {method: 'GET', params: {phoneId: 'phones'}, isArray: true}
end
```
[controllers._js](https://github.com/rubys/wunderbar/blob/master/demo/js/controllers._js)
defines two controllers.  The first sets `$scope.phones` based on a query
using the Phone service, and sets `$scope.orderProp` to a constant.

The second controller sets `$scope.phone` based on a get (and furthermore,
sets `$scope.mainImageUrl` once the get completes), and defines a
`$scope.setImage` function which is also referenced by the phone detail
partial.

```ruby
module Angular::PhonecatControllers
  controller :PhoneListCtrl do
    $scope.phones = Phone.query()
    $scope.orderProp = 'age'
  end

  controller :PhoneDetailCtrl do
    $scope.phone = Phone.get(phoneId: $routeParams.phoneId) do |phone|
      $scope.mainImageUrl = phone.images[0]
    end

    def $scope.setImage(imageUrl)
      $scope.mainImageUrl = imageUrl
    end
  end
end
```

Finally, [filters._js](https://github.com/rubys/wunderbar/blob/master/demo/js/filters._js)
defines a `checkmark` filter that is used within the phone detail partial.

```ruby
module Angular::PhonecatFilters
  filter :checkmark do |input|
    return input ? "\u2713" : "\u2718"
  end
end
```

Running the demo
---

Start Sinatra:

    ruby demo/angularjs.rb 

Navigate to the [http://localhost:4567/](http://localhost:4567/) web page.  If
you click on an image, you will see the details for that phone.

Once you are done exploring the application, view source on the web page and
fetch the generated JavaScripts and compare them both to the `_js` partials as
well as the [original Angular.js tutorial](https://github.com/angular/angular-phonecat/tree/step-11/app) partials.

```javascript
angular.module("PhonecatServices", ["ngResource"]).factory("Phone", [
  "$resource",

  function($resource) {
    return $resource(
      "phones/:phoneId.json",
      {},
      {query: {method: "GET", params: {phoneId: "phones"}, isArray: true}}
    )
  }
])
```
