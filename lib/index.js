'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = centerComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This is a higher order component decorator
 *
 * It listens for when its children are mounted, then it measures the size of
 * these children on the dom. Then it updates the children with appropriate
 * top and left offsets.
 *
 * Components that are wrapped with this decorator recieve two properties
 * topOffset and leftOffset, they are null before the component has mounted.
 *
 * When the window is resized, this component will reupdate its children. This process
 * is debounced by 100ms to reduce CPU strain
 */
function centerComponent(Component) {
  var componentClassName = Component.displayName || Component.name || 'Component';

  var DecoratedComponent = function (_React$Component) {
    _inherits(DecoratedComponent, _React$Component);

    function DecoratedComponent() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, DecoratedComponent);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DecoratedComponent.__proto__ || Object.getPrototypeOf(DecoratedComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        topOffset: null,
        leftOffset: null
      }, _this.resizeChildNode = function () {
        var node = _reactDom2.default.findDOMNode(_this.refs.component);

        var nodeSize = {
          height: node.clientHeight,
          width: node.clientWidth
        };

        var windowSize = {
          height: document.documentElement.clientHeight,
          width: document.documentElement.clientWidth
        };

        _this.setState({
          topOffset: (windowSize.height - nodeSize.height) / 2,
          leftOffset: (windowSize.width - nodeSize.width) / 2
        });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(DecoratedComponent, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.resizeChildNode();
        this._debouncedResize = (0, _debounce2.default)(this.resizeChildNode, 100);
        window.addEventListener('resize', this._debouncedResize);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        window.removeEventListener('resize', this._debouncedResize);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        if (this.props.children !== prevProps.children) {
          // Children are different, resize
          this.resizeChildNode();
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var rest = _objectWithoutProperties(this.props, []),
            _state = this.state,
            topOffset = _state.topOffset,
            leftOffset = _state.leftOffset;

        return _react2.default.createElement(Component, _extends({}, rest, {
          ref: 'component',
          topOffset: topOffset,
          top: topOffset,
          leftOffset: leftOffset,
          left: leftOffset,
          recenter: this.resizeChildNode
        }));
      }
    }]);

    return DecoratedComponent;
  }(_react2.default.Component);

  DecoratedComponent.displayName = 'Centered(' + componentClassName + ')';


  return DecoratedComponent;
}