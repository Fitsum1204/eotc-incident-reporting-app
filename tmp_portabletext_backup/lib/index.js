import { jsx, jsxs, Fragment as Fragment$1 } from "react/jsx-runtime";
import { c } from "react-compiler-runtime";
import { useSelector, useActorRef } from "@xstate/react";
import noop from "lodash/noop.js";
import React, { forwardRef, useContext, createContext, useReducer, useLayoutEffect, useEffect, useCallback, useState, useRef, useMemo, Component, Fragment, memo, startTransition } from "react";
import debounce from "lodash/debounce.js"
import throttle from "lodash/throttle";
import debug$i from "debug";
import { getBlockEndPoint, getBlockStartPoint, getBlockKeyFromSelectionPoint, isSelectionCollapsed, isEqualSelectionPoints, getChildKeyFromSelectionPoint, blockOffsetToSpanSelectionPoint, defaultKeyGenerator, parseBlocks, parseBlock, parseAnnotation, parseMarkDefs, parseSpan, parseInlineObject, isKeyedSegment, isListBlock, isTypedObject, getSelectionStartPoint, getSelectionEndPoint } from "./_chunks-es/util.slice-blocks.js";
import isEqual from "lodash/isEqual.js";
import { isTextBlock, isSpan, compileSchema } from "@portabletext/schema";
import { defineSchema } from "@portabletext/schema";
import { isEmptyTextBlock, sliceTextBlock, getTextBlockText } from "./_chunks-es/util.slice-text-block.js";
import { getFocusInlineObject, isSelectionCollapsed as isSelectionCollapsed$1, getFocusTextBlock, getFocusSpan as getFocusSpan$1, getSelectedBlocks, isSelectionExpanded, getSelectionStartBlock, getSelectionEndBlock, isOverlappingSelection, getFocusBlock as getFocusBlock$1, isSelectingEntireBlocks, getSelectedValue, getActiveDecorators, isActiveAnnotation, getCaretWordSelection, getFocusBlockObject, getPreviousBlock, getNextBlock, getMarkState, getActiveAnnotationsMarks, isAtTheEndOfBlock, isAtTheStartOfBlock, getFirstBlock as getFirstBlock$1, getLastBlock as getLastBlock$1, getFocusListBlock, getSelectionStartPoint as getSelectionStartPoint$1, getSelectionEndPoint as getSelectionEndPoint$1, isActiveDecorator, getFocusChild as getFocusChild$1, getActiveAnnotations, getSelectedTextBlocks, isActiveListItem, isActiveStyle } from "./_chunks-es/selector.is-at-the-start-of-block.js";
import { defineBehavior, forward, raise, effect } from "./behaviors/index.js";
import uniq from "lodash/uniq.js";
import { setup, fromCallback, assign, and, enqueueActions, emit, assertEvent, raise as raise$1, not, createActor } from "xstate";
import { compileSchemaDefinitionToPortableTextMemberSchemaTypes, createPortableTextMemberSchemaTypes, portableTextMemberSchemaTypesToSchema } from "@portabletext/sanity-bridge";
import { htmlToBlocks } from "@portabletext/block-tools";
import { toHTML } from "@portabletext/to-html";
import { markdownToPortableText, portableTextToMarkdown } from "@portabletext/markdown";
import { Schema } from "@sanity/schema";
import flatten from "lodash/flatten.js";
import { set, applyAll, unset, insert, setIfMissing, diffMatchPatch as diffMatchPatch$1 } from "@portabletext/patches";
import { createKeyboardShortcut, code, underline, italic, bold, undo, redo } from "@portabletext/keyboard-shortcuts";
import isPlainObject from "lodash/isPlainObject.js";
import { EditorContext as EditorContext$1 } from "./_chunks-es/use-editor.js";
import { useEditor } from "./_chunks-es/use-editor.js";
import { Subject } from "rxjs";
var PathRef = {
  transform(ref, op) {
    var {
      current,
      affinity
    } = ref;
    if (current != null) {
      var path3 = Path.transform(current, op, {
        affinity
      });
      ref.current = path3, path3 == null && ref.unref();
    }
  }
}, PointRef = {
  transform(ref, op) {
    var {
      current,
      affinity
    } = ref;
    if (current != null) {
      var point3 = Point.transform(current, op, {
        affinity
      });
      ref.current = point3, point3 == null && ref.unref();
    }
  }
}, RangeRef = {
  transform(ref, op) {
    var {
      current,
      affinity
    } = ref;
    if (current != null) {
      var path3 = Range.transform(current, op, {
        affinity
      });
      ref.current = path3, path3 == null && ref.unref();
    }
  }
}, DIRTY_PATHS = /* @__PURE__ */ new WeakMap(), DIRTY_PATH_KEYS = /* @__PURE__ */ new WeakMap(), FLUSHING = /* @__PURE__ */ new WeakMap(), NORMALIZING = /* @__PURE__ */ new WeakMap(), PATH_REFS = /* @__PURE__ */ new WeakMap(), POINT_REFS = /* @__PURE__ */ new WeakMap(), RANGE_REFS = /* @__PURE__ */ new WeakMap(), Path = {
  ancestors(path3) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
      reverse = !1
    } = options, paths = Path.levels(path3, options);
    return reverse ? paths = paths.slice(1) : paths = paths.slice(0, -1), paths;
  },
  common(path3, another) {
    for (var common = [], i = 0; i < path3.length && i < another.length; i++) {
      var av = path3[i], bv = another[i];
      if (av !== bv)
        break;
      common.push(av);
    }
    return common;
  },
  compare(path3, another) {
    for (var min = Math.min(path3.length, another.length), i = 0; i < min; i++) {
      if (path3[i] < another[i]) return -1;
      if (path3[i] > another[i]) return 1;
    }
    return 0;
  },
  endsAfter(path3, another) {
    var i = path3.length - 1, as = path3.slice(0, i), bs = another.slice(0, i), av = path3[i], bv = another[i];
    return Path.equals(as, bs) && av > bv;
  },
  endsAt(path3, another) {
    var i = path3.length, as = path3.slice(0, i), bs = another.slice(0, i);
    return Path.equals(as, bs);
  },
  endsBefore(path3, another) {
    var i = path3.length - 1, as = path3.slice(0, i), bs = another.slice(0, i), av = path3[i], bv = another[i];
    return Path.equals(as, bs) && av < bv;
  },
  equals(path3, another) {
    return path3.length === another.length && path3.every((n2, i) => n2 === another[i]);
  },
  hasPrevious(path3) {
    return path3[path3.length - 1] > 0;
  },
  isAfter(path3, another) {
    return Path.compare(path3, another) === 1;
  },
  isAncestor(path3, another) {
    return path3.length < another.length && Path.compare(path3, another) === 0;
  },
  isBefore(path3, another) {
    return Path.compare(path3, another) === -1;
  },
  isChild(path3, another) {
    return path3.length === another.length + 1 && Path.compare(path3, another) === 0;
  },
  isCommon(path3, another) {
    return path3.length <= another.length && Path.compare(path3, another) === 0;
  },
  isDescendant(path3, another) {
    return path3.length > another.length && Path.compare(path3, another) === 0;
  },
  isParent(path3, another) {
    return path3.length + 1 === another.length && Path.compare(path3, another) === 0;
  },
  isPath(value) {
    return Array.isArray(value) && (value.length === 0 || typeof value[0] == "number");
  },
  isSibling(path3, another) {
    if (path3.length !== another.length)
      return !1;
    var as = path3.slice(0, -1), bs = another.slice(0, -1), al = path3[path3.length - 1], bl = another[another.length - 1];
    return al !== bl && Path.equals(as, bs);
  },
  levels(path3) {
    for (var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
      reverse = !1
    } = options, list = [], i = 0; i <= path3.length; i++)
      list.push(path3.slice(0, i));
    return reverse && list.reverse(), list;
  },
  next(path3) {
    if (path3.length === 0)
      throw new Error("Cannot get the next path of a root path [".concat(path3, "], because it has no next index."));
    var last2 = path3[path3.length - 1];
    return path3.slice(0, -1).concat(last2 + 1);
  },
  operationCanTransformPath(operation) {
    switch (operation.type) {
      case "insert_node":
      case "remove_node":
      case "merge_node":
      case "split_node":
      case "move_node":
        return !0;
      default:
        return !1;
    }
  },
  parent(path3) {
    if (path3.length === 0)
      throw new Error("Cannot get the parent path of the root path [".concat(path3, "]."));
    return path3.slice(0, -1);
  },
  previous(path3) {
    if (path3.length === 0)
      throw new Error("Cannot get the previous path of a root path [".concat(path3, "], because it has no previous index."));
    var last2 = path3[path3.length - 1];
    if (last2 <= 0)
      throw new Error("Cannot get the previous path of a first child path [".concat(path3, "] because it would result in a negative index."));
    return path3.slice(0, -1).concat(last2 - 1);
  },
  relative(path3, ancestor) {
    if (!Path.isAncestor(ancestor, path3) && !Path.equals(path3, ancestor))
      throw new Error("Cannot get the relative path of [".concat(path3, "] inside ancestor [").concat(ancestor, "], because it is not above or equal to the path."));
    return path3.slice(ancestor.length);
  },
  transform(path3, operation) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (!path3) return null;
    var p = [...path3], {
      affinity = "forward"
    } = options;
    if (path3.length === 0)
      return p;
    switch (operation.type) {
      case "insert_node": {
        var {
          path: op
        } = operation;
        (Path.equals(op, p) || Path.endsBefore(op, p) || Path.isAncestor(op, p)) && (p[op.length - 1] += 1);
        break;
      }
      case "remove_node": {
        var {
          path: _op
        } = operation;
        if (Path.equals(_op, p) || Path.isAncestor(_op, p))
          return null;
        Path.endsBefore(_op, p) && (p[_op.length - 1] -= 1);
        break;
      }
      case "merge_node": {
        var {
          path: _op2,
          position
        } = operation;
        Path.equals(_op2, p) || Path.endsBefore(_op2, p) ? p[_op2.length - 1] -= 1 : Path.isAncestor(_op2, p) && (p[_op2.length - 1] -= 1, p[_op2.length] += position);
        break;
      }
      case "split_node": {
        var {
          path: _op3,
          position: _position
        } = operation;
        if (Path.equals(_op3, p)) {
          if (affinity === "forward")
            p[p.length - 1] += 1;
          else if (affinity !== "backward") return null;
        } else Path.endsBefore(_op3, p) ? p[_op3.length - 1] += 1 : Path.isAncestor(_op3, p) && path3[_op3.length] >= _position && (p[_op3.length - 1] += 1, p[_op3.length] -= _position);
        break;
      }
      case "move_node": {
        var {
          path: _op4,
          newPath: onp
        } = operation;
        if (Path.equals(_op4, onp))
          return p;
        if (Path.isAncestor(_op4, p) || Path.equals(_op4, p)) {
          var copy = onp.slice();
          return Path.endsBefore(_op4, onp) && _op4.length < onp.length && (copy[_op4.length - 1] -= 1), copy.concat(p.slice(_op4.length));
        } else Path.isSibling(_op4, onp) && (Path.isAncestor(onp, p) || Path.equals(onp, p)) ? Path.endsBefore(_op4, p) ? p[_op4.length - 1] -= 1 : p[_op4.length - 1] += 1 : Path.endsBefore(onp, p) || Path.equals(onp, p) || Path.isAncestor(onp, p) ? (Path.endsBefore(_op4, p) && (p[_op4.length - 1] -= 1), p[onp.length - 1] += 1) : Path.endsBefore(_op4, p) && (Path.equals(onp, p) && (p[onp.length - 1] += 1), p[_op4.length - 1] -= 1);
        break;
      }
    }
    return p;
  }
};
function _typeof$2(o2) {
  "@babel/helpers - typeof";
  return _typeof$2 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(o3) {
    return typeof o3;
  } : function(o3) {
    return o3 && typeof Symbol == "function" && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
  }, _typeof$2(o2);
}
function _toPrimitive$2(input, hint) {
  if (_typeof$2(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint);
    if (_typeof$2(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey$2(arg) {
  var key = _toPrimitive$2(arg, "string");
  return _typeof$2(key) === "symbol" ? key : String(key);
}
function _defineProperty$2(obj, key, value) {
  return key = _toPropertyKey$2(key), key in obj ? Object.defineProperty(obj, key, {
    value,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : obj[key] = value, obj;
}
function _objectWithoutPropertiesLoose$2(source, excluded) {
  if (source == null) return {};
  var target = {}, sourceKeys = Object.keys(source), key, i;
  for (i = 0; i < sourceKeys.length; i++)
    key = sourceKeys[i], !(excluded.indexOf(key) >= 0) && (target[key] = source[key]);
  return target;
}
function _objectWithoutProperties$2(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose$2(source, excluded), key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++)
      key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
  }
  return target;
}
var _excluded$4 = ["anchor", "focus"];
function ownKeys$g(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$g(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$g(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$g(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Range = {
  edges(range2) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
      reverse = !1
    } = options, {
      anchor,
      focus: focus2
    } = range2;
    return Range.isBackward(range2) === reverse ? [anchor, focus2] : [focus2, anchor];
  },
  end(range2) {
    var [, end2] = Range.edges(range2);
    return end2;
  },
  equals(range2, another) {
    return Point.equals(range2.anchor, another.anchor) && Point.equals(range2.focus, another.focus);
  },
  surrounds(range2, target) {
    var intersectionRange = Range.intersection(range2, target);
    return intersectionRange ? Range.equals(intersectionRange, target) : !1;
  },
  includes(range2, target) {
    if (Range.isRange(target)) {
      if (Range.includes(range2, target.anchor) || Range.includes(range2, target.focus))
        return !0;
      var [rs, re] = Range.edges(range2), [ts, te] = Range.edges(target);
      return Point.isBefore(rs, ts) && Point.isAfter(re, te);
    }
    var [start2, end2] = Range.edges(range2), isAfterStart = !1, isBeforeEnd = !1;
    return Point.isPoint(target) ? (isAfterStart = Point.compare(target, start2) >= 0, isBeforeEnd = Point.compare(target, end2) <= 0) : (isAfterStart = Path.compare(target, start2.path) >= 0, isBeforeEnd = Path.compare(target, end2.path) <= 0), isAfterStart && isBeforeEnd;
  },
  intersection(range2, another) {
    var rest = _objectWithoutProperties$2(range2, _excluded$4), [s1, e1] = Range.edges(range2), [s2, e2] = Range.edges(another), start2 = Point.isBefore(s1, s2) ? s2 : s1, end2 = Point.isBefore(e1, e2) ? e1 : e2;
    return Point.isBefore(end2, start2) ? null : _objectSpread$g({
      anchor: start2,
      focus: end2
    }, rest);
  },
  isBackward(range2) {
    var {
      anchor,
      focus: focus2
    } = range2;
    return Point.isAfter(anchor, focus2);
  },
  isCollapsed(range2) {
    var {
      anchor,
      focus: focus2
    } = range2;
    return Point.equals(anchor, focus2);
  },
  isExpanded(range2) {
    return !Range.isCollapsed(range2);
  },
  isForward(range2) {
    return !Range.isBackward(range2);
  },
  isRange(value) {
    return isObject(value) && Point.isPoint(value.anchor) && Point.isPoint(value.focus);
  },
  *points(range2) {
    yield [range2.anchor, "anchor"], yield [range2.focus, "focus"];
  },
  start(range2) {
    var [start2] = Range.edges(range2);
    return start2;
  },
  transform(range2, op) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (range2 === null)
      return null;
    var {
      affinity = "inward"
    } = options, affinityAnchor, affinityFocus;
    if (affinity === "inward") {
      var isCollapsed = Range.isCollapsed(range2);
      Range.isForward(range2) ? (affinityAnchor = "forward", affinityFocus = isCollapsed ? affinityAnchor : "backward") : (affinityAnchor = "backward", affinityFocus = isCollapsed ? affinityAnchor : "forward");
    } else affinity === "outward" ? Range.isForward(range2) ? (affinityAnchor = "backward", affinityFocus = "forward") : (affinityAnchor = "forward", affinityFocus = "backward") : (affinityAnchor = affinity, affinityFocus = affinity);
    var anchor = Point.transform(range2.anchor, op, {
      affinity: affinityAnchor
    }), focus2 = Point.transform(range2.focus, op, {
      affinity: affinityFocus
    });
    return !anchor || !focus2 ? null : {
      anchor,
      focus: focus2
    };
  }
}, isElement$1 = function(value) {
  var {
    deep = !1
  } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (!isObject(value)) return !1;
  var isEditor3 = typeof value.apply == "function";
  if (isEditor3) return !1;
  var isChildrenValid = deep ? Node.isNodeList(value.children) : Array.isArray(value.children);
  return isChildrenValid;
}, Element$2 = {
  isAncestor(value) {
    var {
      deep = !1
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return isObject(value) && Node.isNodeList(value.children, {
      deep
    });
  },
  isElement: isElement$1,
  isElementList(value) {
    var {
      deep = !1
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return Array.isArray(value) && value.every((val) => Element$2.isElement(val, {
      deep
    }));
  },
  isElementProps(props) {
    return props.children !== void 0;
  },
  isElementType: function(value, elementVal) {
    var elementKey = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "type";
    return isElement$1(value) && value[elementKey] === elementVal;
  },
  matches(element, props) {
    for (var key in props)
      if (key !== "children" && element[key] !== props[key])
        return !1;
    return !0;
  }
}, _excluded$3$1 = ["children"], _excluded2$3 = ["text"];
function ownKeys$f(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$f(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$f(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$f(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Node = {
  ancestor(root, path3) {
    var node3 = Node.get(root, path3);
    if (Text$1.isText(node3))
      throw new Error("Cannot get the ancestor node at path [".concat(path3, "] because it refers to a text node instead: ").concat(Scrubber.stringify(node3)));
    return node3;
  },
  ancestors(root, path3) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return (function* () {
      for (var p of Path.ancestors(path3, options)) {
        var n2 = Node.ancestor(root, p), entry = [n2, p];
        yield entry;
      }
    })();
  },
  child(root, index) {
    if (Text$1.isText(root))
      throw new Error("Cannot get the child of a text node: ".concat(Scrubber.stringify(root)));
    var c2 = root.children[index];
    if (c2 == null)
      throw new Error("Cannot get child at index `".concat(index, "` in node: ").concat(Scrubber.stringify(root)));
    return c2;
  },
  children(root, path3) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return (function* () {
      for (var {
        reverse = !1
      } = options, ancestor = Node.ancestor(root, path3), {
        children
      } = ancestor, index = reverse ? children.length - 1 : 0; reverse ? index >= 0 : index < children.length; ) {
        var child = Node.child(ancestor, index), childPath = path3.concat(index);
        yield [child, childPath], index = reverse ? index - 1 : index + 1;
      }
    })();
  },
  common(root, path3, another) {
    var p = Path.common(path3, another), n2 = Node.get(root, p);
    return [n2, p];
  },
  descendant(root, path3) {
    var node3 = Node.get(root, path3);
    if (Editor.isEditor(node3))
      throw new Error("Cannot get the descendant node at path [".concat(path3, "] because it refers to the root editor node instead: ").concat(Scrubber.stringify(node3)));
    return node3;
  },
  descendants(root) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (function* () {
      for (var [node3, path3] of Node.nodes(root, options))
        path3.length !== 0 && (yield [node3, path3]);
    })();
  },
  elements(root) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (function* () {
      for (var [node3, path3] of Node.nodes(root, options))
        Element$2.isElement(node3) && (yield [node3, path3]);
    })();
  },
  extractProps(node3) {
    if (Element$2.isAncestor(node3)) {
      var properties = _objectWithoutProperties$2(node3, _excluded$3$1);
      return properties;
    } else {
      var properties = _objectWithoutProperties$2(node3, _excluded2$3);
      return properties;
    }
  },
  first(root, path3) {
    for (var p = path3.slice(), n2 = Node.get(root, p); n2 && !(Text$1.isText(n2) || n2.children.length === 0); )
      n2 = n2.children[0], p.push(0);
    return [n2, p];
  },
  fragment(root, range2) {
    var newRoot = {
      children: root.children
    }, [start2, end2] = Range.edges(range2), nodeEntries = Node.nodes(newRoot, {
      reverse: !0,
      pass: (_ref) => {
        var [, path4] = _ref;
        return !Range.includes(range2, path4);
      }
    }), _loop = function() {
      if (!Range.includes(range2, path3)) {
        var index = path3[path3.length - 1];
        modifyChildren(newRoot, Path.parent(path3), (children) => removeChildren$1(children, index, 1));
      }
      Path.equals(path3, end2.path) && modifyLeaf(newRoot, path3, (node3) => {
        var before3 = node3.text.slice(0, end2.offset);
        return _objectSpread$f(_objectSpread$f({}, node3), {}, {
          text: before3
        });
      }), Path.equals(path3, start2.path) && modifyLeaf(newRoot, path3, (node3) => {
        var before3 = node3.text.slice(start2.offset);
        return _objectSpread$f(_objectSpread$f({}, node3), {}, {
          text: before3
        });
      });
    };
    for (var [, path3] of nodeEntries)
      _loop();
    return newRoot.children;
  },
  get(root, path3) {
    var node3 = Node.getIf(root, path3);
    if (node3 === void 0)
      throw new Error("Cannot find a descendant at path [".concat(path3, "] in node: ").concat(Scrubber.stringify(root)));
    return node3;
  },
  getIf(root, path3) {
    for (var node3 = root, i = 0; i < path3.length; i++) {
      var p = path3[i];
      if (Text$1.isText(node3) || !node3.children[p])
        return;
      node3 = node3.children[p];
    }
    return node3;
  },
  has(root, path3) {
    for (var node3 = root, i = 0; i < path3.length; i++) {
      var p = path3[i];
      if (Text$1.isText(node3) || !node3.children[p])
        return !1;
      node3 = node3.children[p];
    }
    return !0;
  },
  isNode(value) {
    var {
      deep = !1
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return Text$1.isText(value) || Element$2.isElement(value, {
      deep
    }) || Editor.isEditor(value, {
      deep
    });
  },
  isNodeList(value) {
    var {
      deep = !1
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return Array.isArray(value) && value.every((val) => Node.isNode(val, {
      deep
    }));
  },
  last(root, path3) {
    for (var p = path3.slice(), n2 = Node.get(root, p); n2 && !(Text$1.isText(n2) || n2.children.length === 0); ) {
      var i = n2.children.length - 1;
      n2 = n2.children[i], p.push(i);
    }
    return [n2, p];
  },
  leaf(root, path3) {
    var node3 = Node.get(root, path3);
    if (!Text$1.isText(node3))
      throw new Error("Cannot get the leaf node at path [".concat(path3, "] because it refers to a non-leaf node: ").concat(Scrubber.stringify(node3)));
    return node3;
  },
  levels(root, path3) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return (function* () {
      for (var p of Path.levels(path3, options)) {
        var n2 = Node.get(root, p);
        yield [n2, p];
      }
    })();
  },
  matches(node3, props) {
    return Element$2.isElement(node3) && Element$2.isElementProps(props) && Element$2.matches(node3, props) || Text$1.isText(node3) && Text$1.isTextProps(props) && Text$1.matches(node3, props);
  },
  nodes(root) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (function* () {
      for (var {
        pass,
        reverse = !1
      } = options, {
        from = [],
        to
      } = options, visited = /* @__PURE__ */ new Set(), p = [], n2 = root; !(to && (reverse ? Path.isBefore(p, to) : Path.isAfter(p, to))); ) {
        if (visited.has(n2) || (yield [n2, p]), !visited.has(n2) && !Text$1.isText(n2) && n2.children.length !== 0 && (pass == null || pass([n2, p]) === !1)) {
          visited.add(n2);
          var nextIndex = reverse ? n2.children.length - 1 : 0;
          Path.isAncestor(p, from) && (nextIndex = from[p.length]), p = p.concat(nextIndex), n2 = Node.get(root, p);
          continue;
        }
        if (p.length === 0)
          break;
        if (!reverse) {
          var newPath = Path.next(p);
          if (Node.has(root, newPath)) {
            p = newPath, n2 = Node.get(root, p);
            continue;
          }
        }
        if (reverse && p[p.length - 1] !== 0) {
          var _newPath = Path.previous(p);
          p = _newPath, n2 = Node.get(root, p);
          continue;
        }
        p = Path.parent(p), n2 = Node.get(root, p), visited.add(n2);
      }
    })();
  },
  parent(root, path3) {
    var parentPath = Path.parent(path3), p = Node.get(root, parentPath);
    if (Text$1.isText(p))
      throw new Error("Cannot get the parent of path [".concat(path3, "] because it does not exist in the root."));
    return p;
  },
  string(node3) {
    return Text$1.isText(node3) ? node3.text : node3.children.map(Node.string).join("");
  },
  texts(root) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (function* () {
      for (var [node3, path3] of Node.nodes(root, options))
        Text$1.isText(node3) && (yield [node3, path3]);
    })();
  }
};
function ownKeys$e(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$e(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$e(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$e(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Operation = {
  isNodeOperation(value) {
    return Operation.isOperation(value) && value.type.endsWith("_node");
  },
  isOperation(value) {
    if (!isObject(value))
      return !1;
    switch (value.type) {
      case "insert_node":
        return Path.isPath(value.path) && Node.isNode(value.node);
      case "insert_text":
        return typeof value.offset == "number" && typeof value.text == "string" && Path.isPath(value.path);
      case "merge_node":
        return typeof value.position == "number" && Path.isPath(value.path) && isObject(value.properties);
      case "move_node":
        return Path.isPath(value.path) && Path.isPath(value.newPath);
      case "remove_node":
        return Path.isPath(value.path) && Node.isNode(value.node);
      case "remove_text":
        return typeof value.offset == "number" && typeof value.text == "string" && Path.isPath(value.path);
      case "set_node":
        return Path.isPath(value.path) && isObject(value.properties) && isObject(value.newProperties);
      case "set_selection":
        return value.properties === null && Range.isRange(value.newProperties) || value.newProperties === null && Range.isRange(value.properties) || isObject(value.properties) && isObject(value.newProperties);
      case "split_node":
        return Path.isPath(value.path) && typeof value.position == "number" && isObject(value.properties);
      default:
        return !1;
    }
  },
  isOperationList(value) {
    return Array.isArray(value) && value.every((val) => Operation.isOperation(val));
  },
  isSelectionOperation(value) {
    return Operation.isOperation(value) && value.type.endsWith("_selection");
  },
  isTextOperation(value) {
    return Operation.isOperation(value) && value.type.endsWith("_text");
  },
  inverse(op) {
    switch (op.type) {
      case "insert_node":
        return _objectSpread$e(_objectSpread$e({}, op), {}, {
          type: "remove_node"
        });
      case "insert_text":
        return _objectSpread$e(_objectSpread$e({}, op), {}, {
          type: "remove_text"
        });
      case "merge_node":
        return _objectSpread$e(_objectSpread$e({}, op), {}, {
          type: "split_node",
          path: Path.previous(op.path)
        });
      case "move_node": {
        var {
          newPath,
          path: path3
        } = op;
        if (Path.equals(newPath, path3))
          return op;
        if (Path.isSibling(path3, newPath))
          return _objectSpread$e(_objectSpread$e({}, op), {}, {
            path: newPath,
            newPath: path3
          });
        var inversePath = Path.transform(path3, op), inverseNewPath = Path.transform(Path.next(path3), op);
        return _objectSpread$e(_objectSpread$e({}, op), {}, {
          path: inversePath,
          newPath: inverseNewPath
        });
      }
      case "remove_node":
        return _objectSpread$e(_objectSpread$e({}, op), {}, {
          type: "insert_node"
        });
      case "remove_text":
        return _objectSpread$e(_objectSpread$e({}, op), {}, {
          type: "insert_text"
        });
      case "set_node": {
        var {
          properties,
          newProperties
        } = op;
        return _objectSpread$e(_objectSpread$e({}, op), {}, {
          properties: newProperties,
          newProperties: properties
        });
      }
      case "set_selection": {
        var {
          properties: _properties,
          newProperties: _newProperties
        } = op;
        return _properties == null ? _objectSpread$e(_objectSpread$e({}, op), {}, {
          properties: _newProperties,
          newProperties: null
        }) : _newProperties == null ? _objectSpread$e(_objectSpread$e({}, op), {}, {
          properties: null,
          newProperties: _properties
        }) : _objectSpread$e(_objectSpread$e({}, op), {}, {
          properties: _newProperties,
          newProperties: _properties
        });
      }
      case "split_node":
        return _objectSpread$e(_objectSpread$e({}, op), {}, {
          type: "merge_node",
          path: Path.next(op.path)
        });
    }
  }
}, isObject = (value) => typeof value == "object" && value !== null, isDeepEqual = (node3, another) => {
  for (var key in node3) {
    var a = node3[key], b = another[key];
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return !1;
      for (var i = 0; i < a.length; i++)
        if (a[i] !== b[i]) return !1;
    } else if (isObject(a) && isObject(b)) {
      if (!isDeepEqual(a, b)) return !1;
    } else if (a !== b)
      return !1;
  }
  for (var _key in another)
    if (node3[_key] === void 0 && another[_key] !== void 0)
      return !1;
  return !0;
}, getDefaultInsertLocation = (editor) => editor.selection ? editor.selection : editor.children.length > 0 ? Editor.end(editor, []) : [0], matchPath = (editor, path3) => {
  var [node3] = Editor.node(editor, path3);
  return (n2) => n2 === node3;
}, getCharacterDistance = function(str) {
  var isRTL = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, isLTR = !isRTL, codepoints = isRTL ? codepointsIteratorRTL(str) : str, left = CodepointType.None, right = CodepointType.None, distance = 0, gb11 = null, gb12Or13 = null;
  for (var char of codepoints) {
    var code2 = char.codePointAt(0);
    if (!code2) break;
    var type = getCodepointType(char, code2);
    if ([left, right] = isLTR ? [right, type] : [type, left], intersects(left, CodepointType.ZWJ) && intersects(right, CodepointType.ExtPict) && (isLTR ? gb11 = endsWithEmojiZWJ(str.substring(0, distance)) : gb11 = endsWithEmojiZWJ(str.substring(0, str.length - distance)), !gb11) || intersects(left, CodepointType.RI) && intersects(right, CodepointType.RI) && (gb12Or13 !== null ? gb12Or13 = !gb12Or13 : isLTR ? gb12Or13 = !0 : gb12Or13 = endsWithOddNumberOfRIs(str.substring(0, str.length - distance)), !gb12Or13) || left !== CodepointType.None && right !== CodepointType.None && isBoundaryPair(left, right))
      break;
    distance += char.length;
  }
  return distance || 1;
}, SPACE = /\s/, PUNCTUATION = /[\u002B\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/, CHAMELEON = /['\u2018\u2019]/, getWordDistance = function(text) {
  for (var isRTL = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, dist = 0, started = !1; text.length > 0; ) {
    var charDist = getCharacterDistance(text, isRTL), [char, remaining] = splitByCharacterDistance(text, charDist, isRTL);
    if (isWordCharacter(char, remaining, isRTL))
      started = !0, dist += charDist;
    else if (!started)
      dist += charDist;
    else
      break;
    text = remaining;
  }
  return dist;
}, splitByCharacterDistance = (str, dist, isRTL) => {
  if (isRTL) {
    var at = str.length - dist;
    return [str.slice(at, str.length), str.slice(0, at)];
  }
  return [str.slice(0, dist), str.slice(dist)];
}, isWordCharacter = function isWordCharacter2(char, remaining) {
  var isRTL = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
  if (SPACE.test(char))
    return !1;
  if (CHAMELEON.test(char)) {
    var charDist = getCharacterDistance(remaining, isRTL), [nextChar, nextRemaining] = splitByCharacterDistance(remaining, charDist, isRTL);
    if (isWordCharacter2(nextChar, nextRemaining, isRTL))
      return !0;
  }
  return !PUNCTUATION.test(char);
}, codepointsIteratorRTL = function* (str) {
  for (var end2 = str.length - 1, i = 0; i < str.length; i++) {
    var char1 = str.charAt(end2 - i);
    if (isLowSurrogate$1(char1.charCodeAt(0))) {
      var char2 = str.charAt(end2 - i - 1);
      if (isHighSurrogate$1(char2.charCodeAt(0))) {
        yield char2 + char1, i++;
        continue;
      }
    }
    yield char1;
  }
}, isHighSurrogate$1 = (charCode) => charCode >= 55296 && charCode <= 56319, isLowSurrogate$1 = (charCode) => charCode >= 56320 && charCode <= 57343, CodepointType;
(function(CodepointType2) {
  CodepointType2[CodepointType2.None = 0] = "None", CodepointType2[CodepointType2.Extend = 1] = "Extend", CodepointType2[CodepointType2.ZWJ = 2] = "ZWJ", CodepointType2[CodepointType2.RI = 4] = "RI", CodepointType2[CodepointType2.Prepend = 8] = "Prepend", CodepointType2[CodepointType2.SpacingMark = 16] = "SpacingMark", CodepointType2[CodepointType2.L = 32] = "L", CodepointType2[CodepointType2.V = 64] = "V", CodepointType2[CodepointType2.T = 128] = "T", CodepointType2[CodepointType2.LV = 256] = "LV", CodepointType2[CodepointType2.LVT = 512] = "LVT", CodepointType2[CodepointType2.ExtPict = 1024] = "ExtPict", CodepointType2[CodepointType2.Any = 2048] = "Any";
})(CodepointType || (CodepointType = {}));
var reExtend = /^(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC2\u0CC6\u0CCC\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200C\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDEFD-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF57\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF42]|\uD80D[\uDC40\uDC47-\uDC55]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65\uDD67-\uDD69\uDD6E-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])$/, rePrepend = /^(?:[\u0600-\u0605\u06DD\u070F\u0890\u0891\u08E2\u0D4E]|\uD804[\uDCBD\uDCCD\uDDC2\uDDC3]|\uD806[\uDD3F\uDD41\uDE3A\uDE84-\uDE89]|\uD807\uDD46)$/, reSpacingMark = /^(?:[\u0903\u093B\u093E-\u0940\u0949-\u094C\u094E\u094F\u0982\u0983\u09BF\u09C0\u09C7\u09C8\u09CB\u09CC\u0A03\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB\u0ACC\u0B02\u0B03\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0C01-\u0C03\u0C41-\u0C44\u0C82\u0C83\u0CBE\u0CC0\u0CC1\u0CC3\u0CC4\u0CC7\u0CC8\u0CCA\u0CCB\u0D02\u0D03\u0D3F\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D82\u0D83\u0DD0\u0DD1\u0DD8-\u0DDE\u0DF2\u0DF3\u0E33\u0EB3\u0F3E\u0F3F\u0F7F\u1031\u103B\u103C\u1056\u1057\u1084\u1715\u1734\u17B6\u17BE-\u17C5\u17C7\u17C8\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1A19\u1A1A\u1A55\u1A57\u1A6D-\u1A72\u1B04\u1B3B\u1B3D-\u1B41\u1B43\u1B44\u1B82\u1BA1\u1BA6\u1BA7\u1BAA\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1C24-\u1C2B\u1C34\u1C35\u1CE1\u1CF7\uA823\uA824\uA827\uA880\uA881\uA8B4-\uA8C3\uA952\uA953\uA983\uA9B4\uA9B5\uA9BA\uA9BB\uA9BE-\uA9C0\uAA2F\uAA30\uAA33\uAA34\uAA4D\uAAEB\uAAEE\uAAEF\uAAF5\uABE3\uABE4\uABE6\uABE7\uABE9\uABEA\uABEC]|\uD804[\uDC00\uDC02\uDC82\uDCB0-\uDCB2\uDCB7\uDCB8\uDD2C\uDD45\uDD46\uDD82\uDDB3-\uDDB5\uDDBF\uDDC0\uDDCE\uDE2C-\uDE2E\uDE32\uDE33\uDE35\uDEE0-\uDEE2\uDF02\uDF03\uDF3F\uDF41-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF62\uDF63]|\uD805[\uDC35-\uDC37\uDC40\uDC41\uDC45\uDCB1\uDCB2\uDCB9\uDCBB\uDCBC\uDCBE\uDCC1\uDDB0\uDDB1\uDDB8-\uDDBB\uDDBE\uDE30-\uDE32\uDE3B\uDE3C\uDE3E\uDEAC\uDEAE\uDEAF\uDEB6\uDF26]|\uD806[\uDC2C-\uDC2E\uDC38\uDD31-\uDD35\uDD37\uDD38\uDD3D\uDD40\uDD42\uDDD1-\uDDD3\uDDDC-\uDDDF\uDDE4\uDE39\uDE57\uDE58\uDE97]|\uD807[\uDC2F\uDC3E\uDCA9\uDCB1\uDCB4\uDD8A-\uDD8E\uDD93\uDD94\uDD96\uDEF5\uDEF6]|\uD81B[\uDF51-\uDF87\uDFF0\uDFF1]|\uD834[\uDD66\uDD6D])$/, reL = /^[\u1100-\u115F\uA960-\uA97C]$/, reV = /^[\u1160-\u11A7\uD7B0-\uD7C6]$/, reT = /^[\u11A8-\u11FF\uD7CB-\uD7FB]$/, reLV = /^[\uAC00\uAC1C\uAC38\uAC54\uAC70\uAC8C\uACA8\uACC4\uACE0\uACFC\uAD18\uAD34\uAD50\uAD6C\uAD88\uADA4\uADC0\uADDC\uADF8\uAE14\uAE30\uAE4C\uAE68\uAE84\uAEA0\uAEBC\uAED8\uAEF4\uAF10\uAF2C\uAF48\uAF64\uAF80\uAF9C\uAFB8\uAFD4\uAFF0\uB00C\uB028\uB044\uB060\uB07C\uB098\uB0B4\uB0D0\uB0EC\uB108\uB124\uB140\uB15C\uB178\uB194\uB1B0\uB1CC\uB1E8\uB204\uB220\uB23C\uB258\uB274\uB290\uB2AC\uB2C8\uB2E4\uB300\uB31C\uB338\uB354\uB370\uB38C\uB3A8\uB3C4\uB3E0\uB3FC\uB418\uB434\uB450\uB46C\uB488\uB4A4\uB4C0\uB4DC\uB4F8\uB514\uB530\uB54C\uB568\uB584\uB5A0\uB5BC\uB5D8\uB5F4\uB610\uB62C\uB648\uB664\uB680\uB69C\uB6B8\uB6D4\uB6F0\uB70C\uB728\uB744\uB760\uB77C\uB798\uB7B4\uB7D0\uB7EC\uB808\uB824\uB840\uB85C\uB878\uB894\uB8B0\uB8CC\uB8E8\uB904\uB920\uB93C\uB958\uB974\uB990\uB9AC\uB9C8\uB9E4\uBA00\uBA1C\uBA38\uBA54\uBA70\uBA8C\uBAA8\uBAC4\uBAE0\uBAFC\uBB18\uBB34\uBB50\uBB6C\uBB88\uBBA4\uBBC0\uBBDC\uBBF8\uBC14\uBC30\uBC4C\uBC68\uBC84\uBCA0\uBCBC\uBCD8\uBCF4\uBD10\uBD2C\uBD48\uBD64\uBD80\uBD9C\uBDB8\uBDD4\uBDF0\uBE0C\uBE28\uBE44\uBE60\uBE7C\uBE98\uBEB4\uBED0\uBEEC\uBF08\uBF24\uBF40\uBF5C\uBF78\uBF94\uBFB0\uBFCC\uBFE8\uC004\uC020\uC03C\uC058\uC074\uC090\uC0AC\uC0C8\uC0E4\uC100\uC11C\uC138\uC154\uC170\uC18C\uC1A8\uC1C4\uC1E0\uC1FC\uC218\uC234\uC250\uC26C\uC288\uC2A4\uC2C0\uC2DC\uC2F8\uC314\uC330\uC34C\uC368\uC384\uC3A0\uC3BC\uC3D8\uC3F4\uC410\uC42C\uC448\uC464\uC480\uC49C\uC4B8\uC4D4\uC4F0\uC50C\uC528\uC544\uC560\uC57C\uC598\uC5B4\uC5D0\uC5EC\uC608\uC624\uC640\uC65C\uC678\uC694\uC6B0\uC6CC\uC6E8\uC704\uC720\uC73C\uC758\uC774\uC790\uC7AC\uC7C8\uC7E4\uC800\uC81C\uC838\uC854\uC870\uC88C\uC8A8\uC8C4\uC8E0\uC8FC\uC918\uC934\uC950\uC96C\uC988\uC9A4\uC9C0\uC9DC\uC9F8\uCA14\uCA30\uCA4C\uCA68\uCA84\uCAA0\uCABC\uCAD8\uCAF4\uCB10\uCB2C\uCB48\uCB64\uCB80\uCB9C\uCBB8\uCBD4\uCBF0\uCC0C\uCC28\uCC44\uCC60\uCC7C\uCC98\uCCB4\uCCD0\uCCEC\uCD08\uCD24\uCD40\uCD5C\uCD78\uCD94\uCDB0\uCDCC\uCDE8\uCE04\uCE20\uCE3C\uCE58\uCE74\uCE90\uCEAC\uCEC8\uCEE4\uCF00\uCF1C\uCF38\uCF54\uCF70\uCF8C\uCFA8\uCFC4\uCFE0\uCFFC\uD018\uD034\uD050\uD06C\uD088\uD0A4\uD0C0\uD0DC\uD0F8\uD114\uD130\uD14C\uD168\uD184\uD1A0\uD1BC\uD1D8\uD1F4\uD210\uD22C\uD248\uD264\uD280\uD29C\uD2B8\uD2D4\uD2F0\uD30C\uD328\uD344\uD360\uD37C\uD398\uD3B4\uD3D0\uD3EC\uD408\uD424\uD440\uD45C\uD478\uD494\uD4B0\uD4CC\uD4E8\uD504\uD520\uD53C\uD558\uD574\uD590\uD5AC\uD5C8\uD5E4\uD600\uD61C\uD638\uD654\uD670\uD68C\uD6A8\uD6C4\uD6E0\uD6FC\uD718\uD734\uD750\uD76C\uD788]$/, reLVT = /^[\uAC01-\uAC1B\uAC1D-\uAC37\uAC39-\uAC53\uAC55-\uAC6F\uAC71-\uAC8B\uAC8D-\uACA7\uACA9-\uACC3\uACC5-\uACDF\uACE1-\uACFB\uACFD-\uAD17\uAD19-\uAD33\uAD35-\uAD4F\uAD51-\uAD6B\uAD6D-\uAD87\uAD89-\uADA3\uADA5-\uADBF\uADC1-\uADDB\uADDD-\uADF7\uADF9-\uAE13\uAE15-\uAE2F\uAE31-\uAE4B\uAE4D-\uAE67\uAE69-\uAE83\uAE85-\uAE9F\uAEA1-\uAEBB\uAEBD-\uAED7\uAED9-\uAEF3\uAEF5-\uAF0F\uAF11-\uAF2B\uAF2D-\uAF47\uAF49-\uAF63\uAF65-\uAF7F\uAF81-\uAF9B\uAF9D-\uAFB7\uAFB9-\uAFD3\uAFD5-\uAFEF\uAFF1-\uB00B\uB00D-\uB027\uB029-\uB043\uB045-\uB05F\uB061-\uB07B\uB07D-\uB097\uB099-\uB0B3\uB0B5-\uB0CF\uB0D1-\uB0EB\uB0ED-\uB107\uB109-\uB123\uB125-\uB13F\uB141-\uB15B\uB15D-\uB177\uB179-\uB193\uB195-\uB1AF\uB1B1-\uB1CB\uB1CD-\uB1E7\uB1E9-\uB203\uB205-\uB21F\uB221-\uB23B\uB23D-\uB257\uB259-\uB273\uB275-\uB28F\uB291-\uB2AB\uB2AD-\uB2C7\uB2C9-\uB2E3\uB2E5-\uB2FF\uB301-\uB31B\uB31D-\uB337\uB339-\uB353\uB355-\uB36F\uB371-\uB38B\uB38D-\uB3A7\uB3A9-\uB3C3\uB3C5-\uB3DF\uB3E1-\uB3FB\uB3FD-\uB417\uB419-\uB433\uB435-\uB44F\uB451-\uB46B\uB46D-\uB487\uB489-\uB4A3\uB4A5-\uB4BF\uB4C1-\uB4DB\uB4DD-\uB4F7\uB4F9-\uB513\uB515-\uB52F\uB531-\uB54B\uB54D-\uB567\uB569-\uB583\uB585-\uB59F\uB5A1-\uB5BB\uB5BD-\uB5D7\uB5D9-\uB5F3\uB5F5-\uB60F\uB611-\uB62B\uB62D-\uB647\uB649-\uB663\uB665-\uB67F\uB681-\uB69B\uB69D-\uB6B7\uB6B9-\uB6D3\uB6D5-\uB6EF\uB6F1-\uB70B\uB70D-\uB727\uB729-\uB743\uB745-\uB75F\uB761-\uB77B\uB77D-\uB797\uB799-\uB7B3\uB7B5-\uB7CF\uB7D1-\uB7EB\uB7ED-\uB807\uB809-\uB823\uB825-\uB83F\uB841-\uB85B\uB85D-\uB877\uB879-\uB893\uB895-\uB8AF\uB8B1-\uB8CB\uB8CD-\uB8E7\uB8E9-\uB903\uB905-\uB91F\uB921-\uB93B\uB93D-\uB957\uB959-\uB973\uB975-\uB98F\uB991-\uB9AB\uB9AD-\uB9C7\uB9C9-\uB9E3\uB9E5-\uB9FF\uBA01-\uBA1B\uBA1D-\uBA37\uBA39-\uBA53\uBA55-\uBA6F\uBA71-\uBA8B\uBA8D-\uBAA7\uBAA9-\uBAC3\uBAC5-\uBADF\uBAE1-\uBAFB\uBAFD-\uBB17\uBB19-\uBB33\uBB35-\uBB4F\uBB51-\uBB6B\uBB6D-\uBB87\uBB89-\uBBA3\uBBA5-\uBBBF\uBBC1-\uBBDB\uBBDD-\uBBF7\uBBF9-\uBC13\uBC15-\uBC2F\uBC31-\uBC4B\uBC4D-\uBC67\uBC69-\uBC83\uBC85-\uBC9F\uBCA1-\uBCBB\uBCBD-\uBCD7\uBCD9-\uBCF3\uBCF5-\uBD0F\uBD11-\uBD2B\uBD2D-\uBD47\uBD49-\uBD63\uBD65-\uBD7F\uBD81-\uBD9B\uBD9D-\uBDB7\uBDB9-\uBDD3\uBDD5-\uBDEF\uBDF1-\uBE0B\uBE0D-\uBE27\uBE29-\uBE43\uBE45-\uBE5F\uBE61-\uBE7B\uBE7D-\uBE97\uBE99-\uBEB3\uBEB5-\uBECF\uBED1-\uBEEB\uBEED-\uBF07\uBF09-\uBF23\uBF25-\uBF3F\uBF41-\uBF5B\uBF5D-\uBF77\uBF79-\uBF93\uBF95-\uBFAF\uBFB1-\uBFCB\uBFCD-\uBFE7\uBFE9-\uC003\uC005-\uC01F\uC021-\uC03B\uC03D-\uC057\uC059-\uC073\uC075-\uC08F\uC091-\uC0AB\uC0AD-\uC0C7\uC0C9-\uC0E3\uC0E5-\uC0FF\uC101-\uC11B\uC11D-\uC137\uC139-\uC153\uC155-\uC16F\uC171-\uC18B\uC18D-\uC1A7\uC1A9-\uC1C3\uC1C5-\uC1DF\uC1E1-\uC1FB\uC1FD-\uC217\uC219-\uC233\uC235-\uC24F\uC251-\uC26B\uC26D-\uC287\uC289-\uC2A3\uC2A5-\uC2BF\uC2C1-\uC2DB\uC2DD-\uC2F7\uC2F9-\uC313\uC315-\uC32F\uC331-\uC34B\uC34D-\uC367\uC369-\uC383\uC385-\uC39F\uC3A1-\uC3BB\uC3BD-\uC3D7\uC3D9-\uC3F3\uC3F5-\uC40F\uC411-\uC42B\uC42D-\uC447\uC449-\uC463\uC465-\uC47F\uC481-\uC49B\uC49D-\uC4B7\uC4B9-\uC4D3\uC4D5-\uC4EF\uC4F1-\uC50B\uC50D-\uC527\uC529-\uC543\uC545-\uC55F\uC561-\uC57B\uC57D-\uC597\uC599-\uC5B3\uC5B5-\uC5CF\uC5D1-\uC5EB\uC5ED-\uC607\uC609-\uC623\uC625-\uC63F\uC641-\uC65B\uC65D-\uC677\uC679-\uC693\uC695-\uC6AF\uC6B1-\uC6CB\uC6CD-\uC6E7\uC6E9-\uC703\uC705-\uC71F\uC721-\uC73B\uC73D-\uC757\uC759-\uC773\uC775-\uC78F\uC791-\uC7AB\uC7AD-\uC7C7\uC7C9-\uC7E3\uC7E5-\uC7FF\uC801-\uC81B\uC81D-\uC837\uC839-\uC853\uC855-\uC86F\uC871-\uC88B\uC88D-\uC8A7\uC8A9-\uC8C3\uC8C5-\uC8DF\uC8E1-\uC8FB\uC8FD-\uC917\uC919-\uC933\uC935-\uC94F\uC951-\uC96B\uC96D-\uC987\uC989-\uC9A3\uC9A5-\uC9BF\uC9C1-\uC9DB\uC9DD-\uC9F7\uC9F9-\uCA13\uCA15-\uCA2F\uCA31-\uCA4B\uCA4D-\uCA67\uCA69-\uCA83\uCA85-\uCA9F\uCAA1-\uCABB\uCABD-\uCAD7\uCAD9-\uCAF3\uCAF5-\uCB0F\uCB11-\uCB2B\uCB2D-\uCB47\uCB49-\uCB63\uCB65-\uCB7F\uCB81-\uCB9B\uCB9D-\uCBB7\uCBB9-\uCBD3\uCBD5-\uCBEF\uCBF1-\uCC0B\uCC0D-\uCC27\uCC29-\uCC43\uCC45-\uCC5F\uCC61-\uCC7B\uCC7D-\uCC97\uCC99-\uCCB3\uCCB5-\uCCCF\uCCD1-\uCCEB\uCCED-\uCD07\uCD09-\uCD23\uCD25-\uCD3F\uCD41-\uCD5B\uCD5D-\uCD77\uCD79-\uCD93\uCD95-\uCDAF\uCDB1-\uCDCB\uCDCD-\uCDE7\uCDE9-\uCE03\uCE05-\uCE1F\uCE21-\uCE3B\uCE3D-\uCE57\uCE59-\uCE73\uCE75-\uCE8F\uCE91-\uCEAB\uCEAD-\uCEC7\uCEC9-\uCEE3\uCEE5-\uCEFF\uCF01-\uCF1B\uCF1D-\uCF37\uCF39-\uCF53\uCF55-\uCF6F\uCF71-\uCF8B\uCF8D-\uCFA7\uCFA9-\uCFC3\uCFC5-\uCFDF\uCFE1-\uCFFB\uCFFD-\uD017\uD019-\uD033\uD035-\uD04F\uD051-\uD06B\uD06D-\uD087\uD089-\uD0A3\uD0A5-\uD0BF\uD0C1-\uD0DB\uD0DD-\uD0F7\uD0F9-\uD113\uD115-\uD12F\uD131-\uD14B\uD14D-\uD167\uD169-\uD183\uD185-\uD19F\uD1A1-\uD1BB\uD1BD-\uD1D7\uD1D9-\uD1F3\uD1F5-\uD20F\uD211-\uD22B\uD22D-\uD247\uD249-\uD263\uD265-\uD27F\uD281-\uD29B\uD29D-\uD2B7\uD2B9-\uD2D3\uD2D5-\uD2EF\uD2F1-\uD30B\uD30D-\uD327\uD329-\uD343\uD345-\uD35F\uD361-\uD37B\uD37D-\uD397\uD399-\uD3B3\uD3B5-\uD3CF\uD3D1-\uD3EB\uD3ED-\uD407\uD409-\uD423\uD425-\uD43F\uD441-\uD45B\uD45D-\uD477\uD479-\uD493\uD495-\uD4AF\uD4B1-\uD4CB\uD4CD-\uD4E7\uD4E9-\uD503\uD505-\uD51F\uD521-\uD53B\uD53D-\uD557\uD559-\uD573\uD575-\uD58F\uD591-\uD5AB\uD5AD-\uD5C7\uD5C9-\uD5E3\uD5E5-\uD5FF\uD601-\uD61B\uD61D-\uD637\uD639-\uD653\uD655-\uD66F\uD671-\uD68B\uD68D-\uD6A7\uD6A9-\uD6C3\uD6C5-\uD6DF\uD6E1-\uD6FB\uD6FD-\uD717\uD719-\uD733\uD735-\uD74F\uD751-\uD76B\uD76D-\uD787\uD789-\uD7A3]$/, reExtPict = /^(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])$/, getCodepointType = (char, code2) => {
  var type = CodepointType.Any;
  return char.search(reExtend) !== -1 && (type |= CodepointType.Extend), code2 === 8205 && (type |= CodepointType.ZWJ), code2 >= 127462 && code2 <= 127487 && (type |= CodepointType.RI), char.search(rePrepend) !== -1 && (type |= CodepointType.Prepend), char.search(reSpacingMark) !== -1 && (type |= CodepointType.SpacingMark), char.search(reL) !== -1 && (type |= CodepointType.L), char.search(reV) !== -1 && (type |= CodepointType.V), char.search(reT) !== -1 && (type |= CodepointType.T), char.search(reLV) !== -1 && (type |= CodepointType.LV), char.search(reLVT) !== -1 && (type |= CodepointType.LVT), char.search(reExtPict) !== -1 && (type |= CodepointType.ExtPict), type;
};
function intersects(x, y) {
  return (x & y) !== 0;
}
var NonBoundaryPairs = [
  // GB6
  [CodepointType.L, CodepointType.L | CodepointType.V | CodepointType.LV | CodepointType.LVT],
  // GB7
  [CodepointType.LV | CodepointType.V, CodepointType.V | CodepointType.T],
  // GB8
  [CodepointType.LVT | CodepointType.T, CodepointType.T],
  // GB9
  [CodepointType.Any, CodepointType.Extend | CodepointType.ZWJ],
  // GB9a
  [CodepointType.Any, CodepointType.SpacingMark],
  // GB9b
  [CodepointType.Prepend, CodepointType.Any],
  // GB11
  [CodepointType.ZWJ, CodepointType.ExtPict],
  // GB12 and GB13
  [CodepointType.RI, CodepointType.RI]
];
function isBoundaryPair(left, right) {
  return NonBoundaryPairs.findIndex((r2) => intersects(left, r2[0]) && intersects(right, r2[1])) === -1;
}
var endingEmojiZWJ = /(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC2\u0CC6\u0CCC\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200C\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDEFD-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF57\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF42]|\uD80D[\uDC40\uDC47-\uDC55]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65\uDD67-\uDD69\uDD6E-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])*\u200D$/, endsWithEmojiZWJ = (str) => str.search(endingEmojiZWJ) !== -1, endingRIs = /(?:\uD83C[\uDDE6-\uDDFF])+$/g, endsWithOddNumberOfRIs = (str) => {
  var match2 = str.match(endingRIs);
  if (match2 === null)
    return !1;
  var numRIs = match2[0].length / 2;
  return numRIs % 2 === 1;
}, isEditor = function(value) {
  var {
    deep = !1
  } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (!isObject(value))
    return !1;
  var isEditor3 = typeof value.addMark == "function" && typeof value.apply == "function" && typeof value.deleteFragment == "function" && typeof value.insertBreak == "function" && typeof value.insertSoftBreak == "function" && typeof value.insertFragment == "function" && typeof value.insertNode == "function" && typeof value.insertText == "function" && typeof value.isElementReadOnly == "function" && typeof value.isInline == "function" && typeof value.isSelectable == "function" && typeof value.isVoid == "function" && typeof value.normalizeNode == "function" && typeof value.onChange == "function" && typeof value.removeMark == "function" && typeof value.getDirtyPaths == "function" && (value.marks === null || isObject(value.marks)) && (value.selection === null || Range.isRange(value.selection)) && (!deep || Node.isNodeList(value.children)) && Operation.isOperationList(value.operations);
  return isEditor3;
}, Editor = {
  above(editor, options) {
    return editor.above(options);
  },
  addMark(editor, key, value) {
    editor.addMark(key, value);
  },
  after(editor, at, options) {
    return editor.after(at, options);
  },
  before(editor, at, options) {
    return editor.before(at, options);
  },
  deleteBackward(editor) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
      unit = "character"
    } = options;
    editor.deleteBackward(unit);
  },
  deleteForward(editor) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
      unit = "character"
    } = options;
    editor.deleteForward(unit);
  },
  deleteFragment(editor, options) {
    editor.deleteFragment(options);
  },
  edges(editor, at) {
    return editor.edges(at);
  },
  elementReadOnly(editor) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return editor.elementReadOnly(options);
  },
  end(editor, at) {
    return editor.end(at);
  },
  first(editor, at) {
    return editor.first(at);
  },
  fragment(editor, at) {
    return editor.fragment(at);
  },
  hasBlocks(editor, element) {
    return editor.hasBlocks(element);
  },
  hasInlines(editor, element) {
    return editor.hasInlines(element);
  },
  hasPath(editor, path3) {
    return editor.hasPath(path3);
  },
  hasTexts(editor, element) {
    return editor.hasTexts(element);
  },
  insertBreak(editor) {
    editor.insertBreak();
  },
  insertFragment(editor, fragment2, options) {
    editor.insertFragment(fragment2, options);
  },
  insertNode(editor, node3) {
    editor.insertNode(node3);
  },
  insertSoftBreak(editor) {
    editor.insertSoftBreak();
  },
  insertText(editor, text) {
    editor.insertText(text);
  },
  isBlock(editor, value) {
    return editor.isBlock(value);
  },
  isEdge(editor, point3, at) {
    return editor.isEdge(point3, at);
  },
  isEditor(value) {
    return isEditor(value);
  },
  isElementReadOnly(editor, element) {
    return editor.isElementReadOnly(element);
  },
  isEmpty(editor, element) {
    return editor.isEmpty(element);
  },
  isEnd(editor, point3, at) {
    return editor.isEnd(point3, at);
  },
  isInline(editor, value) {
    return editor.isInline(value);
  },
  isNormalizing(editor) {
    return editor.isNormalizing();
  },
  isSelectable(editor, value) {
    return editor.isSelectable(value);
  },
  isStart(editor, point3, at) {
    return editor.isStart(point3, at);
  },
  isVoid(editor, value) {
    return editor.isVoid(value);
  },
  last(editor, at) {
    return editor.last(at);
  },
  leaf(editor, at, options) {
    return editor.leaf(at, options);
  },
  levels(editor, options) {
    return editor.levels(options);
  },
  marks(editor) {
    return editor.getMarks();
  },
  next(editor, options) {
    return editor.next(options);
  },
  node(editor, at, options) {
    return editor.node(at, options);
  },
  nodes(editor, options) {
    return editor.nodes(options);
  },
  normalize(editor, options) {
    editor.normalize(options);
  },
  parent(editor, at, options) {
    return editor.parent(at, options);
  },
  path(editor, at, options) {
    return editor.path(at, options);
  },
  pathRef(editor, path3, options) {
    return editor.pathRef(path3, options);
  },
  pathRefs(editor) {
    return editor.pathRefs();
  },
  point(editor, at, options) {
    return editor.point(at, options);
  },
  pointRef(editor, point3, options) {
    return editor.pointRef(point3, options);
  },
  pointRefs(editor) {
    return editor.pointRefs();
  },
  positions(editor, options) {
    return editor.positions(options);
  },
  previous(editor, options) {
    return editor.previous(options);
  },
  range(editor, at, to) {
    return editor.range(at, to);
  },
  rangeRef(editor, range2, options) {
    return editor.rangeRef(range2, options);
  },
  rangeRefs(editor) {
    return editor.rangeRefs();
  },
  removeMark(editor, key) {
    editor.removeMark(key);
  },
  setNormalizing(editor, isNormalizing2) {
    editor.setNormalizing(isNormalizing2);
  },
  start(editor, at) {
    return editor.start(at);
  },
  string(editor, at, options) {
    return editor.string(at, options);
  },
  unhangRange(editor, range2, options) {
    return editor.unhangRange(range2, options);
  },
  void(editor, options) {
    return editor.void(options);
  },
  withoutNormalizing(editor, fn) {
    editor.withoutNormalizing(fn);
  },
  shouldMergeNodesRemovePrevNode: (editor, prevNode, curNode) => editor.shouldMergeNodesRemovePrevNode(prevNode, curNode)
}, Span = {
  isSpan(value) {
    return Array.isArray(value) && value.length === 2 && value.every(Path.isPath);
  }
};
function ownKeys$d(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$d(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$d(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$d(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Point = {
  compare(point3, another) {
    var result = Path.compare(point3.path, another.path);
    return result === 0 ? point3.offset < another.offset ? -1 : point3.offset > another.offset ? 1 : 0 : result;
  },
  isAfter(point3, another) {
    return Point.compare(point3, another) === 1;
  },
  isBefore(point3, another) {
    return Point.compare(point3, another) === -1;
  },
  equals(point3, another) {
    return point3.offset === another.offset && Path.equals(point3.path, another.path);
  },
  isPoint(value) {
    return isObject(value) && typeof value.offset == "number" && Path.isPath(value.path);
  },
  transform(point3, op) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (point3 === null)
      return null;
    var {
      affinity = "forward"
    } = options, {
      path: path3,
      offset
    } = point3;
    switch (op.type) {
      case "insert_node":
      case "move_node": {
        path3 = Path.transform(path3, op, options);
        break;
      }
      case "insert_text": {
        Path.equals(op.path, path3) && (op.offset < offset || op.offset === offset && affinity === "forward") && (offset += op.text.length);
        break;
      }
      case "merge_node": {
        Path.equals(op.path, path3) && (offset += op.position), path3 = Path.transform(path3, op, options);
        break;
      }
      case "remove_text": {
        Path.equals(op.path, path3) && op.offset <= offset && (offset -= Math.min(offset - op.offset, op.text.length));
        break;
      }
      case "remove_node": {
        if (Path.equals(op.path, path3) || Path.isAncestor(op.path, path3))
          return null;
        path3 = Path.transform(path3, op, options);
        break;
      }
      case "split_node": {
        if (Path.equals(op.path, path3)) {
          if (op.position === offset && affinity == null)
            return null;
          (op.position < offset || op.position === offset && affinity === "forward") && (offset -= op.position, path3 = Path.transform(path3, op, _objectSpread$d(_objectSpread$d({}, options), {}, {
            affinity: "forward"
          })));
        } else
          path3 = Path.transform(path3, op, options);
        break;
      }
      default:
        return point3;
    }
    return {
      path: path3,
      offset
    };
  }
}, _scrubber = void 0, Scrubber = {
  setScrubber(scrubber) {
    _scrubber = scrubber;
  },
  stringify(value) {
    return JSON.stringify(value, _scrubber);
  }
}, _excluded$2$1 = ["text"], _excluded2$2 = ["anchor", "focus", "merge"];
function ownKeys$c(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$c(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$c(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$c(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Text$1 = {
  equals(text, another) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, {
      loose = !1
    } = options;
    function omitText(obj) {
      var rest = _objectWithoutProperties$2(obj, _excluded$2$1);
      return rest;
    }
    return isDeepEqual(loose ? omitText(text) : text, loose ? omitText(another) : another);
  },
  isText(value) {
    return isObject(value) && typeof value.text == "string";
  },
  isTextList(value) {
    return Array.isArray(value) && value.every((val) => Text$1.isText(val));
  },
  isTextProps(props) {
    return props.text !== void 0;
  },
  matches(text, props) {
    for (var key in props)
      if (key !== "text" && (!text.hasOwnProperty(key) || text[key] !== props[key]))
        return !1;
    return !0;
  },
  decorations(node3, decorations) {
    var leaves = [{
      leaf: _objectSpread$c({}, node3)
    }];
    for (var dec of decorations) {
      var {
        merge: mergeDecoration
      } = dec, rest = _objectWithoutProperties$2(dec, _excluded2$2), [start2, end2] = Range.edges(dec), next3 = [], leafEnd = 0, decorationStart = start2.offset, decorationEnd = end2.offset, merge = mergeDecoration ?? Object.assign;
      for (var {
        leaf: leaf3
      } of leaves) {
        var {
          length
        } = leaf3.text, leafStart = leafEnd;
        if (leafEnd += length, decorationStart <= leafStart && leafEnd <= decorationEnd) {
          merge(leaf3, rest), next3.push({
            leaf: leaf3
          });
          continue;
        }
        if (decorationStart !== decorationEnd && (decorationStart === leafEnd || decorationEnd === leafStart) || decorationStart > leafEnd || decorationEnd < leafStart || decorationEnd === leafStart && leafStart !== 0) {
          next3.push({
            leaf: leaf3
          });
          continue;
        }
        var middle = leaf3, before3 = void 0, after3 = void 0;
        if (decorationEnd < leafEnd) {
          var off = decorationEnd - leafStart;
          after3 = {
            leaf: _objectSpread$c(_objectSpread$c({}, middle), {}, {
              text: middle.text.slice(off)
            })
          }, middle = _objectSpread$c(_objectSpread$c({}, middle), {}, {
            text: middle.text.slice(0, off)
          });
        }
        if (decorationStart > leafStart) {
          var _off = decorationStart - leafStart;
          before3 = {
            leaf: _objectSpread$c(_objectSpread$c({}, middle), {}, {
              text: middle.text.slice(0, _off)
            })
          }, middle = _objectSpread$c(_objectSpread$c({}, middle), {}, {
            text: middle.text.slice(_off)
          });
        }
        merge(middle, rest), before3 && next3.push(before3), next3.push({
          leaf: middle
        }), after3 && next3.push(after3);
      }
      leaves = next3;
    }
    if (leaves.length > 1) {
      var currentOffset = 0;
      for (var [index, item] of leaves.entries()) {
        var _start = currentOffset, _end = _start + item.leaf.text.length, position = {
          start: _start,
          end: _end
        };
        index === 0 && (position.isFirst = !0), index === leaves.length - 1 && (position.isLast = !0), item.position = position, currentOffset = _end;
      }
    }
    return leaves;
  }
};
function ownKeys$b(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$b(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$b(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$b(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var insertChildren$1 = function(xs, index) {
  for (var _len = arguments.length, newValues = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)
    newValues[_key - 2] = arguments[_key];
  return [...xs.slice(0, index), ...newValues, ...xs.slice(index)];
}, replaceChildren = function(xs, index, removeCount) {
  for (var _len2 = arguments.length, newValues = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++)
    newValues[_key2 - 3] = arguments[_key2];
  return [...xs.slice(0, index), ...newValues, ...xs.slice(index + removeCount)];
}, removeChildren$1 = replaceChildren, modifyDescendant = (root, path3, f) => {
  if (path3.length === 0)
    throw new Error("Cannot modify the editor");
  for (var node3 = Node.get(root, path3), slicedPath = path3.slice(), modifiedNode = f(node3); slicedPath.length > 1; ) {
    var _index = slicedPath.pop(), ancestorNode = Node.get(root, slicedPath);
    modifiedNode = _objectSpread$b(_objectSpread$b({}, ancestorNode), {}, {
      children: replaceChildren(ancestorNode.children, _index, 1, modifiedNode)
    });
  }
  var index = slicedPath.pop();
  root.children = replaceChildren(root.children, index, 1, modifiedNode);
}, modifyChildren = (root, path3, f) => {
  path3.length === 0 ? root.children = f(root.children) : modifyDescendant(root, path3, (node3) => {
    if (Text$1.isText(node3))
      throw new Error("Cannot get the element at path [".concat(path3, "] because it refers to a leaf node: ").concat(Scrubber.stringify(node3)));
    return _objectSpread$b(_objectSpread$b({}, node3), {}, {
      children: f(node3.children)
    });
  });
}, modifyLeaf = (root, path3, f) => modifyDescendant(root, path3, (node3) => {
  if (!Text$1.isText(node3))
    throw new Error("Cannot get the leaf node at path [".concat(path3, "] because it refers to a non-leaf node: ").concat(Scrubber.stringify(node3)));
  return f(node3);
});
function ownKeys$a(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$a(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$a(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$a(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var GeneralTransforms = {
  transform(editor, op) {
    var transformSelection = !1;
    switch (op.type) {
      case "insert_node": {
        var {
          path: path3,
          node: node3
        } = op;
        modifyChildren(editor, Path.parent(path3), (children) => {
          var index2 = path3[path3.length - 1];
          if (index2 > children.length)
            throw new Error('Cannot apply an "insert_node" operation at path ['.concat(path3, "] because the destination is past the end of the node."));
          return insertChildren$1(children, index2, node3);
        }), transformSelection = !0;
        break;
      }
      case "insert_text": {
        var {
          path: _path,
          offset,
          text
        } = op;
        if (text.length === 0) break;
        modifyLeaf(editor, _path, (node4) => {
          var before3 = node4.text.slice(0, offset), after3 = node4.text.slice(offset);
          return _objectSpread$a(_objectSpread$a({}, node4), {}, {
            text: before3 + text + after3
          });
        }), transformSelection = !0;
        break;
      }
      case "merge_node": {
        var {
          path: _path2
        } = op, index = _path2[_path2.length - 1], prevPath = Path.previous(_path2), prevIndex = prevPath[prevPath.length - 1];
        modifyChildren(editor, Path.parent(_path2), (children) => {
          var node4 = children[index], prev2 = children[prevIndex], newNode;
          if (Text$1.isText(node4) && Text$1.isText(prev2))
            newNode = _objectSpread$a(_objectSpread$a({}, prev2), {}, {
              text: prev2.text + node4.text
            });
          else if (!Text$1.isText(node4) && !Text$1.isText(prev2))
            newNode = _objectSpread$a(_objectSpread$a({}, prev2), {}, {
              children: prev2.children.concat(node4.children)
            });
          else
            throw new Error('Cannot apply a "merge_node" operation at path ['.concat(_path2, "] to nodes of different interfaces: ").concat(Scrubber.stringify(node4), " ").concat(Scrubber.stringify(prev2)));
          return replaceChildren(children, prevIndex, 2, newNode);
        }), transformSelection = !0;
        break;
      }
      case "move_node": {
        var {
          path: _path3,
          newPath
        } = op, _index = _path3[_path3.length - 1];
        if (Path.isAncestor(_path3, newPath))
          throw new Error("Cannot move a path [".concat(_path3, "] to new path [").concat(newPath, "] because the destination is inside itself."));
        var _node = Node.get(editor, _path3);
        modifyChildren(editor, Path.parent(_path3), (children) => removeChildren$1(children, _index, 1));
        var truePath = Path.transform(_path3, op), newIndex = truePath[truePath.length - 1];
        modifyChildren(editor, Path.parent(truePath), (children) => insertChildren$1(children, newIndex, _node)), transformSelection = !0;
        break;
      }
      case "remove_node": {
        var {
          path: _path4
        } = op, _index2 = _path4[_path4.length - 1];
        if (modifyChildren(editor, Path.parent(_path4), (children) => removeChildren$1(children, _index2, 1)), editor.selection) {
          var selection = _objectSpread$a({}, editor.selection);
          for (var [point3, key] of Range.points(selection)) {
            var result = Point.transform(point3, op);
            if (selection != null && result != null)
              selection[key] = result;
            else {
              var prev = void 0, next3 = void 0;
              for (var [n2, p] of Node.texts(editor))
                if (Path.compare(p, _path4) === -1)
                  prev = [n2, p];
                else {
                  next3 = [n2, p];
                  break;
                }
              var preferNext = !1;
              prev && next3 && (Path.isSibling(prev[1], _path4) ? preferNext = !1 : Path.equals(next3[1], _path4) ? preferNext = !0 : preferNext = Path.common(prev[1], _path4).length < Path.common(next3[1], _path4).length), prev && !preferNext ? selection[key] = {
                path: prev[1],
                offset: prev[0].text.length
              } : next3 ? selection[key] = {
                path: next3[1],
                offset: 0
              } : selection = null;
            }
          }
          (!selection || !Range.equals(selection, editor.selection)) && (editor.selection = selection);
        }
        break;
      }
      case "remove_text": {
        var {
          path: _path5,
          offset: _offset,
          text: _text
        } = op;
        if (_text.length === 0) break;
        modifyLeaf(editor, _path5, (node4) => {
          var before3 = node4.text.slice(0, _offset), after3 = node4.text.slice(_offset + _text.length);
          return _objectSpread$a(_objectSpread$a({}, node4), {}, {
            text: before3 + after3
          });
        }), transformSelection = !0;
        break;
      }
      case "set_node": {
        var {
          path: _path6,
          properties,
          newProperties
        } = op;
        if (_path6.length === 0)
          throw new Error("Cannot set properties on the root node!");
        modifyDescendant(editor, _path6, (node4) => {
          var newNode = _objectSpread$a({}, node4);
          for (var _key in newProperties) {
            if (_key === "children" || _key === "text")
              throw new Error('Cannot set the "'.concat(_key, '" property of nodes!'));
            var value2 = newProperties[_key];
            value2 == null ? delete newNode[_key] : newNode[_key] = value2;
          }
          for (var _key2 in properties)
            newProperties.hasOwnProperty(_key2) || delete newNode[_key2];
          return newNode;
        });
        break;
      }
      case "set_selection": {
        var {
          newProperties: _newProperties
        } = op;
        if (_newProperties == null) {
          editor.selection = null;
          break;
        }
        if (editor.selection == null) {
          if (!Range.isRange(_newProperties))
            throw new Error('Cannot apply an incomplete "set_selection" operation properties '.concat(Scrubber.stringify(_newProperties), " when there is no current selection."));
          editor.selection = _objectSpread$a({}, _newProperties);
          break;
        }
        var _selection = _objectSpread$a({}, editor.selection);
        for (var _key3 in _newProperties) {
          var value = _newProperties[_key3];
          if (value == null) {
            if (_key3 === "anchor" || _key3 === "focus")
              throw new Error('Cannot remove the "'.concat(_key3, '" selection property'));
            delete _selection[_key3];
          } else
            _selection[_key3] = value;
        }
        editor.selection = _selection;
        break;
      }
      case "split_node": {
        var {
          path: _path7,
          position,
          properties: _properties
        } = op, _index3 = _path7[_path7.length - 1];
        if (_path7.length === 0)
          throw new Error('Cannot apply a "split_node" operation at path ['.concat(_path7, "] because the root node cannot be split."));
        modifyChildren(editor, Path.parent(_path7), (children) => {
          var node4 = children[_index3], newNode, nextNode;
          if (Text$1.isText(node4)) {
            var before3 = node4.text.slice(0, position), after3 = node4.text.slice(position);
            newNode = _objectSpread$a(_objectSpread$a({}, node4), {}, {
              text: before3
            }), nextNode = _objectSpread$a(_objectSpread$a({}, _properties), {}, {
              text: after3
            });
          } else {
            var _before = node4.children.slice(0, position), _after = node4.children.slice(position);
            newNode = _objectSpread$a(_objectSpread$a({}, node4), {}, {
              children: _before
            }), nextNode = _objectSpread$a(_objectSpread$a({}, _properties), {}, {
              children: _after
            });
          }
          return replaceChildren(children, _index3, 1, newNode, nextNode);
        }), transformSelection = !0;
        break;
      }
    }
    if (transformSelection && editor.selection) {
      var _selection2 = _objectSpread$a({}, editor.selection);
      for (var [_point, _key4] of Range.points(_selection2))
        _selection2[_key4] = Point.transform(_point, op);
      Range.equals(_selection2, editor.selection) || (editor.selection = _selection2);
    }
  }
}, NodeTransforms = {
  insertNodes(editor, nodes2, options) {
    editor.insertNodes(nodes2, options);
  },
  liftNodes(editor, options) {
    editor.liftNodes(options);
  },
  mergeNodes(editor, options) {
    editor.mergeNodes(options);
  },
  moveNodes(editor, options) {
    editor.moveNodes(options);
  },
  removeNodes(editor, options) {
    editor.removeNodes(options);
  },
  setNodes(editor, props, options) {
    editor.setNodes(props, options);
  },
  splitNodes(editor, options) {
    editor.splitNodes(options);
  },
  unsetNodes(editor, props, options) {
    editor.unsetNodes(props, options);
  },
  unwrapNodes(editor, options) {
    editor.unwrapNodes(options);
  },
  wrapNodes(editor, element, options) {
    editor.wrapNodes(element, options);
  }
}, SelectionTransforms = {
  collapse(editor, options) {
    editor.collapse(options);
  },
  deselect(editor) {
    editor.deselect();
  },
  move(editor, options) {
    editor.move(options);
  },
  select(editor, target) {
    editor.select(target);
  },
  setPoint(editor, props, options) {
    editor.setPoint(props, options);
  },
  setSelection(editor, props) {
    editor.setSelection(props);
  }
}, TextTransforms = {
  delete(editor, options) {
    editor.delete(options);
  },
  insertFragment(editor, fragment2, options) {
    editor.insertFragment(fragment2, options);
  },
  insertText(editor, text) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        voids = !1
      } = options, {
        at = getDefaultInsertLocation(editor)
      } = options;
      if (Path.isPath(at) && (at = Editor.range(editor, at)), Range.isRange(at))
        if (Range.isCollapsed(at))
          at = at.anchor;
        else {
          var end2 = Range.end(at);
          if (!voids && Editor.void(editor, {
            at: end2
          }))
            return;
          var start2 = Range.start(at), startRef = Editor.pointRef(editor, start2), endRef = Editor.pointRef(editor, end2);
          Transforms.delete(editor, {
            at,
            voids
          });
          var startPoint = startRef.unref(), endPoint = endRef.unref();
          at = startPoint || endPoint, Transforms.setSelection(editor, {
            anchor: at,
            focus: at
          });
        }
      if (!(!voids && Editor.void(editor, {
        at
      }) || Editor.elementReadOnly(editor, {
        at
      }))) {
        var {
          path: path3,
          offset
        } = at;
        text.length > 0 && editor.apply({
          type: "insert_text",
          path: path3,
          offset,
          text
        });
      }
    });
  }
};
function ownKeys$9(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$9(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$9(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$9(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Transforms = _objectSpread$9(_objectSpread$9(_objectSpread$9(_objectSpread$9({}, GeneralTransforms), NodeTransforms), SelectionTransforms), TextTransforms), BATCHING_DIRTY_PATHS = /* @__PURE__ */ new WeakMap(), isBatchingDirtyPaths = (editor) => BATCHING_DIRTY_PATHS.get(editor) || !1, batchDirtyPaths = (editor, fn, update) => {
  var value = BATCHING_DIRTY_PATHS.get(editor) || !1;
  BATCHING_DIRTY_PATHS.set(editor, !0);
  try {
    fn(), update();
  } finally {
    BATCHING_DIRTY_PATHS.set(editor, value);
  }
};
function updateDirtyPaths(editor, newDirtyPaths, transform) {
  var oldDirtyPaths = DIRTY_PATHS.get(editor) || [], oldDirtyPathKeys = DIRTY_PATH_KEYS.get(editor) || /* @__PURE__ */ new Set(), dirtyPaths, dirtyPathKeys, add = (path4) => {
    if (path4) {
      var key = path4.join(",");
      dirtyPathKeys.has(key) || (dirtyPathKeys.add(key), dirtyPaths.push(path4));
    }
  };
  if (transform) {
    dirtyPaths = [], dirtyPathKeys = /* @__PURE__ */ new Set();
    for (var path3 of oldDirtyPaths) {
      var newPath = transform(path3);
      add(newPath);
    }
  } else
    dirtyPaths = oldDirtyPaths, dirtyPathKeys = oldDirtyPathKeys;
  for (var _path of newDirtyPaths)
    add(_path);
  DIRTY_PATHS.set(editor, dirtyPaths), DIRTY_PATH_KEYS.set(editor, dirtyPathKeys);
}
var apply$1 = (editor, op) => {
  for (var ref of Editor.pathRefs(editor))
    PathRef.transform(ref, op);
  for (var _ref of Editor.pointRefs(editor))
    PointRef.transform(_ref, op);
  for (var _ref2 of Editor.rangeRefs(editor))
    RangeRef.transform(_ref2, op);
  if (!isBatchingDirtyPaths(editor)) {
    var transform = Path.operationCanTransformPath(op) ? (p) => Path.transform(p, op) : void 0;
    updateDirtyPaths(editor, editor.getDirtyPaths(op), transform);
  }
  Transforms.transform(editor, op), editor.operations.push(op), Editor.normalize(editor, {
    operation: op
  }), op.type === "set_selection" && (editor.marks = null), FLUSHING.get(editor) || (FLUSHING.set(editor, !0), Promise.resolve().then(() => {
    FLUSHING.set(editor, !1), editor.onChange({
      operation: op
    }), editor.operations = [];
  }));
}, getDirtyPaths = (editor, op) => {
  switch (op.type) {
    case "insert_text":
    case "remove_text":
    case "set_node": {
      var {
        path: path3
      } = op;
      return Path.levels(path3);
    }
    case "insert_node": {
      var {
        node: node3,
        path: _path
      } = op, levels2 = Path.levels(_path), descendants = Text$1.isText(node3) ? [] : Array.from(Node.nodes(node3), (_ref) => {
        var [, p2] = _ref;
        return _path.concat(p2);
      });
      return [...levels2, ...descendants];
    }
    case "merge_node": {
      var {
        path: _path2
      } = op, ancestors = Path.ancestors(_path2), previousPath = Path.previous(_path2);
      return [...ancestors, previousPath];
    }
    case "move_node": {
      var {
        path: _path3,
        newPath
      } = op;
      if (Path.equals(_path3, newPath))
        return [];
      var oldAncestors = [], newAncestors = [];
      for (var ancestor of Path.ancestors(_path3)) {
        var p = Path.transform(ancestor, op);
        oldAncestors.push(p);
      }
      for (var _ancestor of Path.ancestors(newPath)) {
        var _p = Path.transform(_ancestor, op);
        newAncestors.push(_p);
      }
      var newParent = newAncestors[newAncestors.length - 1], newIndex = newPath[newPath.length - 1], resultPath = newParent.concat(newIndex);
      return [...oldAncestors, ...newAncestors, resultPath];
    }
    case "remove_node": {
      var {
        path: _path4
      } = op, _ancestors = Path.ancestors(_path4);
      return [..._ancestors];
    }
    case "split_node": {
      var {
        path: _path5
      } = op, _levels = Path.levels(_path5), nextPath = Path.next(_path5);
      return [..._levels, nextPath];
    }
    default:
      return [];
  }
}, getFragment = (editor) => {
  var {
    selection
  } = editor;
  return selection ? Node.fragment(editor, selection) : [];
}, normalizeNode = (editor, entry, options) => {
  var [node3, path3] = entry;
  if (!Text$1.isText(node3)) {
    if (Element$2.isElement(node3) && node3.children.length === 0) {
      var child = {
        text: ""
      };
      Transforms.insertNodes(editor, child, {
        at: path3.concat(0),
        voids: !0
      });
      return;
    }
    for (var shouldHaveInlines = Editor.isEditor(node3) ? !1 : Element$2.isElement(node3) && (editor.isInline(node3) || node3.children.length === 0 || Text$1.isText(node3.children[0]) || editor.isInline(node3.children[0])), n2 = 0, i = 0; i < node3.children.length; i++, n2++) {
      var currentNode = Node.get(editor, path3);
      if (!Text$1.isText(currentNode)) {
        var _child = currentNode.children[n2], prev = currentNode.children[n2 - 1], isLast = i === node3.children.length - 1, isInlineOrText = Text$1.isText(_child) || Element$2.isElement(_child) && editor.isInline(_child);
        if (isInlineOrText !== shouldHaveInlines)
          isInlineOrText ? options != null && options.fallbackElement ? Transforms.wrapNodes(editor, options.fallbackElement(), {
            at: path3.concat(n2),
            voids: !0
          }) : Transforms.removeNodes(editor, {
            at: path3.concat(n2),
            voids: !0
          }) : Transforms.unwrapNodes(editor, {
            at: path3.concat(n2),
            voids: !0
          }), n2--;
        else if (Element$2.isElement(_child)) {
          if (editor.isInline(_child)) {
            if (prev == null || !Text$1.isText(prev)) {
              var newChild = {
                text: ""
              };
              Transforms.insertNodes(editor, newChild, {
                at: path3.concat(n2),
                voids: !0
              }), n2++;
            } else if (isLast) {
              var _newChild = {
                text: ""
              };
              Transforms.insertNodes(editor, _newChild, {
                at: path3.concat(n2 + 1),
                voids: !0
              }), n2++;
            }
          }
        } else {
          if (!Text$1.isText(_child) && !("children" in _child)) {
            var elementChild = _child;
            elementChild.children = [];
          }
          prev != null && Text$1.isText(prev) && (Text$1.equals(_child, prev, {
            loose: !0
          }) ? (Transforms.mergeNodes(editor, {
            at: path3.concat(n2),
            voids: !0
          }), n2--) : prev.text === "" ? (Transforms.removeNodes(editor, {
            at: path3.concat(n2 - 1),
            voids: !0
          }), n2--) : _child.text === "" && (Transforms.removeNodes(editor, {
            at: path3.concat(n2),
            voids: !0
          }), n2--));
        }
      }
    }
  }
}, shouldNormalize = (editor, _ref) => {
  var {
    iteration,
    initialDirtyPathsLength
  } = _ref, maxIterations = initialDirtyPathsLength * 42;
  if (iteration > maxIterations)
    throw new Error("Could not completely normalize the editor after ".concat(maxIterations, " iterations! This is usually due to incorrect normalization logic that leaves a node in an invalid state."));
  return !0;
}, above = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
    voids = !1,
    mode = "lowest",
    at = editor.selection,
    match: match2
  } = options;
  if (at) {
    var path3 = Editor.path(editor, at);
    if (!Range.isRange(at) || Path.equals(at.focus.path, at.anchor.path)) {
      if (path3.length === 0) return;
      path3 = Path.parent(path3);
    }
    var reverse = mode === "lowest", [firstMatch] = Editor.levels(editor, {
      at: path3,
      voids,
      match: match2,
      reverse
    });
    return firstMatch;
  }
};
function ownKeys$8$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$8$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$8$1(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$8$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var addMark = (editor, key, value) => {
  var {
    selection
  } = editor;
  if (selection) {
    var match2 = (node3, path3) => {
      if (!Text$1.isText(node3))
        return !1;
      var [parentNode2] = Editor.parent(editor, path3);
      return !editor.isVoid(parentNode2) || editor.markableVoid(parentNode2);
    }, expandedSelection = Range.isExpanded(selection), markAcceptingVoidSelected = !1;
    if (!expandedSelection) {
      var [selectedNode, selectedPath] = Editor.node(editor, selection);
      if (selectedNode && match2(selectedNode, selectedPath)) {
        var [parentNode] = Editor.parent(editor, selectedPath);
        markAcceptingVoidSelected = parentNode && editor.markableVoid(parentNode);
      }
    }
    if (expandedSelection || markAcceptingVoidSelected)
      Transforms.setNodes(editor, {
        [key]: value
      }, {
        match: match2,
        split: !0,
        voids: !0
      });
    else {
      var marks3 = _objectSpread$8$1(_objectSpread$8$1({}, Editor.marks(editor) || {}), {}, {
        [key]: value
      });
      editor.marks = marks3, FLUSHING.get(editor) || editor.onChange();
    }
  }
};
function ownKeys$7$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$7$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$7$1(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$7$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var after = function(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, anchor = Editor.point(editor, at, {
    edge: "end"
  }), focus2 = Editor.end(editor, []), range2 = {
    anchor,
    focus: focus2
  }, {
    distance = 1
  } = options, d = 0, target;
  for (var p of Editor.positions(editor, _objectSpread$7$1(_objectSpread$7$1({}, options), {}, {
    at: range2
  }))) {
    if (d > distance)
      break;
    d !== 0 && (target = p), d++;
  }
  return target;
};
function ownKeys$6$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$6$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$6$1(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$6$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var before = function(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, anchor = Editor.start(editor, []), focus2 = Editor.point(editor, at, {
    edge: "start"
  }), range2 = {
    anchor,
    focus: focus2
  }, {
    distance = 1
  } = options, d = 0, target;
  for (var p of Editor.positions(editor, _objectSpread$6$1(_objectSpread$6$1({}, options), {}, {
    at: range2,
    reverse: !0
  }))) {
    if (d > distance)
      break;
    d !== 0 && (target = p), d++;
  }
  return target;
}, deleteBackward = (editor, unit) => {
  var {
    selection
  } = editor;
  selection && Range.isCollapsed(selection) && Transforms.delete(editor, {
    unit,
    reverse: !0
  });
}, deleteForward = (editor, unit) => {
  var {
    selection
  } = editor;
  selection && Range.isCollapsed(selection) && Transforms.delete(editor, {
    unit
  });
}, deleteFragment = function(editor) {
  var {
    direction = "forward"
  } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
    selection
  } = editor;
  selection && Range.isExpanded(selection) && Transforms.delete(editor, {
    reverse: direction === "backward"
  });
}, edges = (editor, at) => [Editor.start(editor, at), Editor.end(editor, at)];
function ownKeys$5$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$5$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$5$1(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$5$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var elementReadOnly = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return Editor.above(editor, _objectSpread$5$1(_objectSpread$5$1({}, options), {}, {
    match: (n2) => Element$2.isElement(n2) && Editor.isElementReadOnly(editor, n2)
  }));
}, end = (editor, at) => Editor.point(editor, at, {
  edge: "end"
}), first = (editor, at) => {
  var path3 = Editor.path(editor, at, {
    edge: "start"
  });
  return Editor.node(editor, path3);
}, fragment = (editor, at) => {
  var range2 = Editor.range(editor, at);
  return Node.fragment(editor, range2);
};
function ownKeys$4$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$4$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$4$1(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$4$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var getVoid = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return Editor.above(editor, _objectSpread$4$1(_objectSpread$4$1({}, options), {}, {
    match: (n2) => Element$2.isElement(n2) && Editor.isVoid(editor, n2)
  }));
}, hasBlocks = (editor, element) => element.children.some((n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2)), hasInlines = (editor, element) => element.children.some((n2) => Text$1.isText(n2) || Editor.isInline(editor, n2)), hasPath = (editor, path3) => Node.has(editor, path3), hasTexts = (editor, element) => element.children.every((n2) => Text$1.isText(n2)), insertBreak = (editor) => {
  Transforms.splitNodes(editor, {
    always: !0
  });
}, insertNode = (editor, node3, options) => {
  Transforms.insertNodes(editor, node3, options);
}, insertSoftBreak = (editor) => {
  Transforms.splitNodes(editor, {
    always: !0
  });
};
function ownKeys$3$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$3$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$3$1(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$3$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var insertText = function(editor, text) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, {
    selection,
    marks: marks3
  } = editor;
  if (selection) {
    if (marks3) {
      var node3 = _objectSpread$3$1({
        text
      }, marks3);
      Transforms.insertNodes(editor, node3, {
        at: options.at,
        voids: options.voids
      });
    } else
      Transforms.insertText(editor, text, options);
    editor.marks = null;
  }
}, isBlock = (editor, value) => !editor.isInline(value), isEdge = (editor, point3, at) => Editor.isStart(editor, point3, at) || Editor.isEnd(editor, point3, at), isEmpty = (editor, element) => {
  var {
    children
  } = element, [first2] = children;
  return children.length === 0 || children.length === 1 && Text$1.isText(first2) && first2.text === "" && !editor.isVoid(element);
}, isEnd = (editor, point3, at) => {
  var end2 = Editor.end(editor, at);
  return Point.equals(point3, end2);
}, isNormalizing = (editor) => {
  var isNormalizing2 = NORMALIZING.get(editor);
  return isNormalizing2 === void 0 ? !0 : isNormalizing2;
}, isStart = (editor, point3, at) => {
  if (point3.offset !== 0)
    return !1;
  var start2 = Editor.start(editor, at);
  return Point.equals(point3, start2);
}, last = (editor, at) => {
  var path3 = Editor.path(editor, at, {
    edge: "end"
  });
  return Editor.node(editor, path3);
}, leaf = function(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, path3 = Editor.path(editor, at, options), node3 = Node.leaf(editor, path3);
  return [node3, path3];
};
function levels(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return (function* () {
    var {
      at = editor.selection,
      reverse = !1,
      voids = !1
    } = options, {
      match: match2
    } = options;
    if (match2 == null && (match2 = () => !0), !!at) {
      var levels2 = [], path3 = Editor.path(editor, at);
      for (var [n2, p] of Node.levels(editor, path3))
        if (match2(n2, p) && (levels2.push([n2, p]), !voids && Element$2.isElement(n2) && Editor.isVoid(editor, n2)))
          break;
      reverse && levels2.reverse(), yield* levels2;
    }
  })();
}
var _excluded$1$1 = ["text"], _excluded2$1$1 = ["text"], marks = function(editor) {
  var {
    marks: marks3,
    selection
  } = editor;
  if (!selection)
    return null;
  var {
    anchor,
    focus: focus2
  } = selection;
  if (marks3)
    return marks3;
  if (Range.isExpanded(selection)) {
    var isBackward = Range.isBackward(selection);
    isBackward && ([focus2, anchor] = [anchor, focus2]);
    var isEnd2 = Editor.isEnd(editor, anchor, anchor.path);
    if (isEnd2) {
      var after3 = Editor.after(editor, anchor);
      after3 && (anchor = after3);
    }
    var [match2] = Editor.nodes(editor, {
      match: Text$1.isText,
      at: {
        anchor,
        focus: focus2
      }
    });
    if (match2) {
      var [_node] = match2, _rest = _objectWithoutProperties$2(_node, _excluded$1$1);
      return _rest;
    } else
      return {};
  }
  var {
    path: path3
  } = anchor, [node3] = Editor.leaf(editor, path3);
  if (anchor.offset === 0) {
    var prev = Editor.previous(editor, {
      at: path3,
      match: Text$1.isText
    }), markedVoid = Editor.above(editor, {
      match: (n2) => Element$2.isElement(n2) && Editor.isVoid(editor, n2) && editor.markableVoid(n2)
    });
    if (!markedVoid) {
      var block = Editor.above(editor, {
        match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2)
      });
      if (prev && block) {
        var [prevNode, prevPath] = prev, [, blockPath] = block;
        Path.isAncestor(blockPath, prevPath) && (node3 = prevNode);
      }
    }
  }
  var rest = _objectWithoutProperties$2(node3, _excluded2$1$1);
  return rest;
}, next = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
    mode = "lowest",
    voids = !1
  } = options, {
    match: match2,
    at = editor.selection
  } = options;
  if (at) {
    var pointAfterLocation = Editor.after(editor, at, {
      voids
    });
    if (pointAfterLocation) {
      var [, to] = Editor.last(editor, []), span = [pointAfterLocation.path, to];
      if (Path.isPath(at) && at.length === 0)
        throw new Error("Cannot get the next node from the root node!");
      if (match2 == null)
        if (Path.isPath(at)) {
          var [parent3] = Editor.parent(editor, at);
          match2 = (n2) => parent3.children.includes(n2);
        } else
          match2 = () => !0;
      var [next3] = Editor.nodes(editor, {
        at: span,
        match: match2,
        mode,
        voids
      });
      return next3;
    }
  }
}, node = function(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, path3 = Editor.path(editor, at, options), node3 = Node.get(editor, path3);
  return [node3, path3];
};
function nodes(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return (function* () {
    var {
      at = editor.selection,
      mode = "all",
      universal = !1,
      reverse = !1,
      voids = !1,
      pass: _pass
    } = options, {
      match: match2
    } = options;
    if (match2 || (match2 = () => !0), !!at) {
      var from, to;
      if (Span.isSpan(at))
        from = at[0], to = at[1];
      else {
        var first2 = Editor.path(editor, at, {
          edge: "start"
        }), last2 = Editor.path(editor, at, {
          edge: "end"
        });
        from = reverse ? last2 : first2, to = reverse ? first2 : last2;
      }
      var nodeEntries = Node.nodes(editor, {
        reverse,
        from,
        to,
        pass: (_ref) => {
          var [node4, path4] = _ref;
          return _pass && _pass([node4, path4]) ? !0 : Element$2.isElement(node4) ? !!(!voids && (Editor.isVoid(editor, node4) || Editor.isElementReadOnly(editor, node4))) : !1;
        }
      }), matches = [], hit;
      for (var [node3, path3] of nodeEntries) {
        var isLower = hit && Path.compare(path3, hit[1]) === 0;
        if (!(mode === "highest" && isLower)) {
          if (!match2(node3, path3)) {
            if (universal && !isLower && Text$1.isText(node3))
              return;
            continue;
          }
          if (mode === "lowest" && isLower) {
            hit = [node3, path3];
            continue;
          }
          var emit2 = mode === "lowest" ? hit : [node3, path3];
          emit2 && (universal ? matches.push(emit2) : yield emit2), hit = [node3, path3];
        }
      }
      mode === "lowest" && hit && (universal ? matches.push(hit) : yield hit), universal && (yield* matches);
    }
  })();
}
var normalize = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
    force = !1,
    operation
  } = options, getDirtyPaths2 = (editor2) => DIRTY_PATHS.get(editor2) || [], getDirtyPathKeys = (editor2) => DIRTY_PATH_KEYS.get(editor2) || /* @__PURE__ */ new Set(), popDirtyPath = (editor2) => {
    var path3 = getDirtyPaths2(editor2).pop(), key = path3.join(",");
    return getDirtyPathKeys(editor2).delete(key), path3;
  };
  if (Editor.isNormalizing(editor)) {
    if (force) {
      var allPaths = Array.from(Node.nodes(editor), (_ref) => {
        var [, p] = _ref;
        return p;
      }), allPathKeys = new Set(allPaths.map((p) => p.join(",")));
      DIRTY_PATHS.set(editor, allPaths), DIRTY_PATH_KEYS.set(editor, allPathKeys);
    }
    getDirtyPaths2(editor).length !== 0 && Editor.withoutNormalizing(editor, () => {
      for (var dirtyPath of getDirtyPaths2(editor))
        if (Node.has(editor, dirtyPath)) {
          var entry = Editor.node(editor, dirtyPath), [node3] = entry;
          Element$2.isElement(node3) && node3.children.length === 0 && editor.normalizeNode(entry, {
            operation
          });
        }
      for (var dirtyPaths = getDirtyPaths2(editor), initialDirtyPathsLength = dirtyPaths.length, iteration = 0; dirtyPaths.length !== 0; ) {
        if (!editor.shouldNormalize({
          dirtyPaths,
          iteration,
          initialDirtyPathsLength,
          operation
        }))
          return;
        var _dirtyPath = popDirtyPath(editor);
        if (Node.has(editor, _dirtyPath)) {
          var _entry = Editor.node(editor, _dirtyPath);
          editor.normalizeNode(_entry, {
            operation
          });
        }
        iteration++, dirtyPaths = getDirtyPaths2(editor);
      }
    });
  }
}, parent = function(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, path3 = Editor.path(editor, at, options), parentPath = Path.parent(path3), entry = Editor.node(editor, parentPath);
  return entry;
}, pathRef = function(editor, path3) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, {
    affinity = "forward"
  } = options, ref = {
    current: path3,
    affinity,
    unref() {
      var {
        current
      } = ref, pathRefs2 = Editor.pathRefs(editor);
      return pathRefs2.delete(ref), ref.current = null, current;
    }
  }, refs = Editor.pathRefs(editor);
  return refs.add(ref), ref;
}, pathRefs = (editor) => {
  var refs = PATH_REFS.get(editor);
  return refs || (refs = /* @__PURE__ */ new Set(), PATH_REFS.set(editor, refs)), refs;
}, path = function(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, {
    depth,
    edge
  } = options;
  if (Path.isPath(at)) {
    if (edge === "start") {
      var [, firstPath] = Node.first(editor, at);
      at = firstPath;
    } else if (edge === "end") {
      var [, lastPath] = Node.last(editor, at);
      at = lastPath;
    }
  }
  return Range.isRange(at) && (edge === "start" ? at = Range.start(at) : edge === "end" ? at = Range.end(at) : at = Path.common(at.anchor.path, at.focus.path)), Point.isPoint(at) && (at = at.path), depth != null && (at = at.slice(0, depth)), at;
}, pointRef = function(editor, point3) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, {
    affinity = "forward"
  } = options, ref = {
    current: point3,
    affinity,
    unref() {
      var {
        current
      } = ref, pointRefs2 = Editor.pointRefs(editor);
      return pointRefs2.delete(ref), ref.current = null, current;
    }
  }, refs = Editor.pointRefs(editor);
  return refs.add(ref), ref;
}, pointRefs = (editor) => {
  var refs = POINT_REFS.get(editor);
  return refs || (refs = /* @__PURE__ */ new Set(), POINT_REFS.set(editor, refs)), refs;
}, point = function(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, {
    edge = "start"
  } = options;
  if (Path.isPath(at)) {
    var path3;
    if (edge === "end") {
      var [, lastPath] = Node.last(editor, at);
      path3 = lastPath;
    } else {
      var [, firstPath] = Node.first(editor, at);
      path3 = firstPath;
    }
    var node3 = Node.get(editor, path3);
    if (!Text$1.isText(node3))
      throw new Error("Cannot get the ".concat(edge, " point in the node at path [").concat(at, "] because it has no ").concat(edge, " text node."));
    return {
      path: path3,
      offset: edge === "end" ? node3.text.length : 0
    };
  }
  if (Range.isRange(at)) {
    var [start2, end2] = Range.edges(at);
    return edge === "start" ? start2 : end2;
  }
  return at;
};
function positions(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return (function* () {
    var {
      at = editor.selection,
      unit = "offset",
      reverse = !1,
      voids = !1
    } = options;
    if (!at)
      return;
    var range2 = Editor.range(editor, at), [start2, end2] = Range.edges(range2), first2 = reverse ? end2 : start2, isNewBlock = !1, blockText = "", distance = 0, leafTextRemaining = 0, leafTextOffset = 0, skippedPaths = [], _loop = function* (path4) {
      var hasSkippedAncestor = skippedPaths.some((p) => Path.isAncestor(p, path4));
      function* maybeYield(point3) {
        hasSkippedAncestor || (yield point3);
      }
      if (Element$2.isElement(node3)) {
        if (!editor.isSelectable(node3)) {
          if (skippedPaths.push(path4), reverse)
            return Path.hasPrevious(path4) && (yield* maybeYield(Editor.end(editor, Path.previous(path4)))), 0;
          var nextPath = Path.next(path4);
          return Editor.hasPath(editor, nextPath) && (yield* maybeYield(Editor.start(editor, nextPath))), 0;
        }
        if (!voids && (editor.isVoid(node3) || editor.isElementReadOnly(node3)))
          return yield* maybeYield(Editor.start(editor, path4)), 0;
        if (editor.isInline(node3)) return 0;
        if (Editor.hasInlines(editor, node3)) {
          var e2 = Path.isAncestor(path4, end2.path) ? end2 : Editor.end(editor, path4), s = Path.isAncestor(path4, start2.path) ? start2 : Editor.start(editor, path4);
          blockText = Editor.string(editor, {
            anchor: s,
            focus: e2
          }, {
            voids
          }), isNewBlock = !0;
        }
      }
      if (Text$1.isText(node3)) {
        var isFirst = Path.equals(path4, first2.path);
        for (isFirst ? (leafTextRemaining = reverse ? first2.offset : node3.text.length - first2.offset, leafTextOffset = first2.offset) : (leafTextRemaining = node3.text.length, leafTextOffset = reverse ? leafTextRemaining : 0), (isFirst || isNewBlock || unit === "offset") && (yield* maybeYield({
          path: path4,
          offset: leafTextOffset
        }), isNewBlock = !1); ; ) {
          if (distance === 0) {
            if (blockText === "") break;
            distance = calcDistance(blockText, unit, reverse), blockText = splitByCharacterDistance(blockText, distance, reverse)[1];
          }
          if (leafTextOffset = reverse ? leafTextOffset - distance : leafTextOffset + distance, leafTextRemaining = leafTextRemaining - distance, leafTextRemaining < 0) {
            distance = -leafTextRemaining;
            break;
          }
          distance = 0, yield* maybeYield({
            path: path4,
            offset: leafTextOffset
          });
        }
      }
    }, _ret;
    for (var [node3, path3] of Editor.nodes(editor, {
      at,
      reverse,
      voids
    }))
      _ret = yield* _loop(path3);
    function calcDistance(text, unit2, reverse2) {
      return unit2 === "character" ? getCharacterDistance(text, reverse2) : unit2 === "word" ? getWordDistance(text, reverse2) : unit2 === "line" || unit2 === "block" ? text.length : 1;
    }
  })();
}
var previous = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
    mode = "lowest",
    voids = !1
  } = options, {
    match: match2,
    at = editor.selection
  } = options;
  if (at) {
    var pointBeforeLocation = Editor.before(editor, at, {
      voids
    });
    if (pointBeforeLocation) {
      var [, to] = Editor.first(editor, []), span = [pointBeforeLocation.path, to];
      if (Path.isPath(at) && at.length === 0)
        throw new Error("Cannot get the previous node from the root node!");
      if (match2 == null)
        if (Path.isPath(at)) {
          var [parent3] = Editor.parent(editor, at);
          match2 = (n2) => parent3.children.includes(n2);
        } else
          match2 = () => !0;
      var [previous3] = Editor.nodes(editor, {
        reverse: !0,
        at: span,
        match: match2,
        mode,
        voids
      });
      return previous3;
    }
  }
}, rangeRef = function(editor, range2) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, {
    affinity = "forward"
  } = options, ref = {
    current: range2,
    affinity,
    unref() {
      var {
        current
      } = ref, rangeRefs2 = Editor.rangeRefs(editor);
      return rangeRefs2.delete(ref), ref.current = null, current;
    }
  }, refs = Editor.rangeRefs(editor);
  return refs.add(ref), ref;
}, rangeRefs = (editor) => {
  var refs = RANGE_REFS.get(editor);
  return refs || (refs = /* @__PURE__ */ new Set(), RANGE_REFS.set(editor, refs)), refs;
}, range = (editor, at, to) => {
  if (Range.isRange(at) && !to)
    return at;
  var start2 = Editor.start(editor, at), end2 = Editor.end(editor, to || at);
  return {
    anchor: start2,
    focus: end2
  };
};
function ownKeys$2$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$2$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$2$1(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$2$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var removeMark = (editor, key) => {
  var {
    selection
  } = editor;
  if (selection) {
    var match2 = (node3, path3) => {
      if (!Text$1.isText(node3))
        return !1;
      var [parentNode2] = Editor.parent(editor, path3);
      return !editor.isVoid(parentNode2) || editor.markableVoid(parentNode2);
    }, expandedSelection = Range.isExpanded(selection), markAcceptingVoidSelected = !1;
    if (!expandedSelection) {
      var [selectedNode, selectedPath] = Editor.node(editor, selection);
      if (selectedNode && match2(selectedNode, selectedPath)) {
        var [parentNode] = Editor.parent(editor, selectedPath);
        markAcceptingVoidSelected = parentNode && editor.markableVoid(parentNode);
      }
    }
    if (expandedSelection || markAcceptingVoidSelected)
      Transforms.unsetNodes(editor, key, {
        match: match2,
        split: !0,
        voids: !0
      });
    else {
      var marks3 = _objectSpread$2$1({}, Editor.marks(editor) || {});
      delete marks3[key], editor.marks = marks3, FLUSHING.get(editor) || editor.onChange();
    }
  }
}, setNormalizing = (editor, isNormalizing2) => {
  NORMALIZING.set(editor, isNormalizing2);
}, start = (editor, at) => Editor.point(editor, at, {
  edge: "start"
}), string = function(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, {
    voids = !1
  } = options, range2 = Editor.range(editor, at), [start2, end2] = Range.edges(range2), text = "";
  for (var [node3, path3] of Editor.nodes(editor, {
    at: range2,
    match: Text$1.isText,
    voids
  })) {
    var t2 = node3.text;
    Path.equals(path3, end2.path) && (t2 = t2.slice(0, end2.offset)), Path.equals(path3, start2.path) && (t2 = t2.slice(start2.offset)), text += t2;
  }
  return text;
}, unhangRange = function(editor, range2) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, {
    voids = !1
  } = options, [start2, end2] = Range.edges(range2);
  if (start2.offset !== 0 || end2.offset !== 0 || Range.isCollapsed(range2) || Path.hasPrevious(end2.path))
    return range2;
  var endBlock = Editor.above(editor, {
    at: end2,
    match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
    voids
  }), blockPath = endBlock ? endBlock[1] : [], first2 = Editor.start(editor, start2), before3 = {
    anchor: first2,
    focus: end2
  }, skip = !0;
  for (var [node3, path3] of Editor.nodes(editor, {
    at: before3,
    match: Text$1.isText,
    reverse: !0,
    voids
  })) {
    if (skip) {
      skip = !1;
      continue;
    }
    if (node3.text !== "" || Path.isBefore(path3, blockPath)) {
      end2 = {
        path: path3,
        offset: node3.text.length
      };
      break;
    }
  }
  return {
    anchor: start2,
    focus: end2
  };
}, withoutNormalizing = (editor, fn) => {
  var value = Editor.isNormalizing(editor);
  Editor.setNormalizing(editor, !1);
  try {
    fn();
  } finally {
    Editor.setNormalizing(editor, value);
  }
  Editor.normalize(editor);
}, shouldMergeNodesRemovePrevNode = (editor, _ref, _ref2) => {
  var [prevNode, prevPath] = _ref;
  return Element$2.isElement(prevNode) && Editor.isEmpty(editor, prevNode) || Text$1.isText(prevNode) && prevNode.text === "" && prevPath[prevPath.length - 1] !== 0;
}, deleteText = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Editor.withoutNormalizing(editor, () => {
    var _Editor$void, _Editor$void2, {
      reverse = !1,
      unit = "character",
      distance = 1,
      voids = !1
    } = options, {
      at = editor.selection,
      hanging = !1
    } = options;
    if (at) {
      var isCollapsed = !1;
      if (Range.isRange(at) && Range.isCollapsed(at) && (isCollapsed = !0, at = at.anchor), Point.isPoint(at)) {
        var furthestVoid = Editor.void(editor, {
          at,
          mode: "highest"
        });
        if (!voids && furthestVoid) {
          var [, voidPath] = furthestVoid;
          at = voidPath;
        } else {
          var opts = {
            unit,
            distance
          }, target = reverse ? Editor.before(editor, at, opts) || Editor.start(editor, []) : Editor.after(editor, at, opts) || Editor.end(editor, []);
          at = {
            anchor: at,
            focus: target
          }, hanging = !0;
        }
      }
      if (Path.isPath(at)) {
        Transforms.removeNodes(editor, {
          at,
          voids
        });
        return;
      }
      if (!Range.isCollapsed(at)) {
        if (!hanging) {
          var [, _end] = Range.edges(at), endOfDoc = Editor.end(editor, []);
          Point.equals(_end, endOfDoc) || (at = Editor.unhangRange(editor, at, {
            voids
          }));
        }
        var [start2, end2] = Range.edges(at), startBlock = Editor.above(editor, {
          match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
          at: start2,
          voids
        }), endBlock = Editor.above(editor, {
          match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
          at: end2,
          voids
        }), isAcrossBlocks = startBlock && endBlock && !Path.equals(startBlock[1], endBlock[1]), isSingleText = Path.equals(start2.path, end2.path), startNonEditable = voids ? null : (_Editor$void = Editor.void(editor, {
          at: start2,
          mode: "highest"
        })) !== null && _Editor$void !== void 0 ? _Editor$void : Editor.elementReadOnly(editor, {
          at: start2,
          mode: "highest"
        }), endNonEditable = voids ? null : (_Editor$void2 = Editor.void(editor, {
          at: end2,
          mode: "highest"
        })) !== null && _Editor$void2 !== void 0 ? _Editor$void2 : Editor.elementReadOnly(editor, {
          at: end2,
          mode: "highest"
        });
        if (startNonEditable) {
          var before3 = Editor.before(editor, start2);
          before3 && startBlock && Path.isAncestor(startBlock[1], before3.path) && (start2 = before3);
        }
        if (endNonEditable) {
          var after3 = Editor.after(editor, end2);
          after3 && endBlock && Path.isAncestor(endBlock[1], after3.path) && (end2 = after3);
        }
        var matches = [], lastPath;
        for (var entry of Editor.nodes(editor, {
          at,
          voids
        })) {
          var [node3, path3] = entry;
          lastPath && Path.compare(path3, lastPath) === 0 || (!voids && Element$2.isElement(node3) && (Editor.isVoid(editor, node3) || Editor.isElementReadOnly(editor, node3)) || !Path.isCommon(path3, start2.path) && !Path.isCommon(path3, end2.path)) && (matches.push(entry), lastPath = path3);
        }
        var pathRefs2 = Array.from(matches, (_ref) => {
          var [, p] = _ref;
          return Editor.pathRef(editor, p);
        }), startRef = Editor.pointRef(editor, start2), endRef = Editor.pointRef(editor, end2), removedText = "";
        if (!isSingleText && !startNonEditable) {
          var _point = startRef.current, [_node] = Editor.leaf(editor, _point), {
            path: _path
          } = _point, {
            offset
          } = start2, text = _node.text.slice(offset);
          text.length > 0 && (editor.apply({
            type: "remove_text",
            path: _path,
            offset,
            text
          }), removedText = text);
        }
        if (pathRefs2.reverse().map((r2) => r2.unref()).filter((r2) => r2 !== null).forEach((p) => Transforms.removeNodes(editor, {
          at: p,
          voids
        })), !endNonEditable) {
          var _point2 = endRef.current, [_node2] = Editor.leaf(editor, _point2), {
            path: _path2
          } = _point2, _offset = isSingleText ? start2.offset : 0, _text = _node2.text.slice(_offset, end2.offset);
          _text.length > 0 && (editor.apply({
            type: "remove_text",
            path: _path2,
            offset: _offset,
            text: _text
          }), removedText = _text);
        }
        !isSingleText && isAcrossBlocks && endRef.current && startRef.current && Transforms.mergeNodes(editor, {
          at: endRef.current,
          hanging: !0,
          voids
        }), isCollapsed && reverse && unit === "character" && removedText.length > 1 && removedText.match(/[\u0980-\u09FF\u0E00-\u0E7F\u1000-\u109F\u0900-\u097F\u1780-\u17FF\u0D00-\u0D7F\u0B00-\u0B7F\u0A00-\u0A7F\u0B80-\u0BFF\u0C00-\u0C7F]+/) && Transforms.insertText(editor, removedText.slice(0, removedText.length - distance));
        var startUnref = startRef.unref(), endUnref = endRef.unref(), point3 = reverse ? startUnref || endUnref : endUnref || startUnref;
        options.at == null && point3 && Transforms.select(editor, point3);
      }
    }
  });
}, insertFragment = function(editor, fragment2) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      hanging = !1,
      voids = !1
    } = options, {
      at = getDefaultInsertLocation(editor),
      batchDirty = !0
    } = options;
    if (fragment2.length) {
      if (Range.isRange(at))
        if (hanging || (at = Editor.unhangRange(editor, at, {
          voids
        })), Range.isCollapsed(at))
          at = at.anchor;
        else {
          var [, end2] = Range.edges(at);
          if (!voids && Editor.void(editor, {
            at: end2
          }))
            return;
          var pointRef3 = Editor.pointRef(editor, end2);
          Transforms.delete(editor, {
            at
          }), at = pointRef3.unref();
        }
      else Path.isPath(at) && (at = Editor.start(editor, at));
      if (!(!voids && Editor.void(editor, {
        at
      }))) {
        var inlineElementMatch = Editor.above(editor, {
          at,
          match: (n2) => Element$2.isElement(n2) && Editor.isInline(editor, n2),
          mode: "highest",
          voids
        });
        if (inlineElementMatch) {
          var [, _inlinePath] = inlineElementMatch;
          if (Editor.isEnd(editor, at, _inlinePath)) {
            var after3 = Editor.after(editor, _inlinePath);
            at = after3;
          } else if (Editor.isStart(editor, at, _inlinePath)) {
            var before3 = Editor.before(editor, _inlinePath);
            at = before3;
          }
        }
        var blockMatch = Editor.above(editor, {
          match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
          at,
          voids
        }), [, blockPath] = blockMatch, isBlockStart = Editor.isStart(editor, at, blockPath), isBlockEnd = Editor.isEnd(editor, at, blockPath), isBlockEmpty = isBlockStart && isBlockEnd, [, firstLeafPath] = Node.first({
          children: fragment2
        }, []), [, lastLeafPath] = Node.last({
          children: fragment2
        }, []), shouldInsert = (_ref) => {
          var [n2, p] = _ref, isRoot = p.length === 0;
          return isRoot ? !1 : isBlockEmpty ? !0 : !(!isBlockStart && Path.isAncestor(p, firstLeafPath) && Element$2.isElement(n2) && !editor.isVoid(n2) && !editor.isInline(n2) || !isBlockEnd && Path.isAncestor(p, lastLeafPath) && Element$2.isElement(n2) && !editor.isVoid(n2) && !editor.isInline(n2));
        }, starting = !0, starts = [], middles = [], ends = [];
        for (var entry of Node.nodes({
          children: fragment2
        }, {
          pass: shouldInsert
        })) {
          var [node3, path3] = entry;
          starting && Element$2.isElement(node3) && !editor.isInline(node3) && !Path.isAncestor(path3, firstLeafPath) && (starting = !1), shouldInsert(entry) && (Element$2.isElement(node3) && !editor.isInline(node3) ? (starting = !1, middles.push(node3)) : starting ? starts.push(node3) : ends.push(node3));
        }
        var [inlineMatch] = Editor.nodes(editor, {
          at,
          match: (n2) => Text$1.isText(n2) || Editor.isInline(editor, n2),
          mode: "highest",
          voids
        }), [, inlinePath] = inlineMatch, isInlineStart = Editor.isStart(editor, at, inlinePath), isInlineEnd = Editor.isEnd(editor, at, inlinePath), middleRef = Editor.pathRef(editor, isBlockEnd && !ends.length ? Path.next(blockPath) : blockPath), endRef = Editor.pathRef(editor, isInlineEnd ? Path.next(inlinePath) : inlinePath), splitBlock = ends.length > 0;
        Transforms.splitNodes(editor, {
          at,
          match: (n2) => splitBlock ? Element$2.isElement(n2) && Editor.isBlock(editor, n2) : Text$1.isText(n2) || Editor.isInline(editor, n2),
          mode: splitBlock ? "lowest" : "highest",
          always: splitBlock && (!isBlockStart || starts.length > 0) && (!isBlockEnd || ends.length > 0),
          voids
        });
        var startRef = Editor.pathRef(editor, !isInlineStart || isInlineStart && isInlineEnd ? Path.next(inlinePath) : inlinePath);
        if (Transforms.insertNodes(editor, starts, {
          at: startRef.current,
          match: (n2) => Text$1.isText(n2) || Editor.isInline(editor, n2),
          mode: "highest",
          voids,
          batchDirty
        }), isBlockEmpty && !starts.length && middles.length && !ends.length && Transforms.delete(editor, {
          at: blockPath,
          voids
        }), Transforms.insertNodes(editor, middles, {
          at: middleRef.current,
          match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
          mode: "lowest",
          voids,
          batchDirty
        }), Transforms.insertNodes(editor, ends, {
          at: endRef.current,
          match: (n2) => Text$1.isText(n2) || Editor.isInline(editor, n2),
          mode: "highest",
          voids,
          batchDirty
        }), !options.at) {
          var _path;
          if (ends.length > 0 && endRef.current ? _path = Path.previous(endRef.current) : middles.length > 0 && middleRef.current ? _path = Path.previous(middleRef.current) : startRef.current && (_path = Path.previous(startRef.current)), _path) {
            var _end = Editor.end(editor, _path);
            Transforms.select(editor, _end);
          }
        }
        startRef.unref(), middleRef.unref(), endRef.unref();
      }
    }
  });
}, collapse = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
    edge = "anchor"
  } = options, {
    selection
  } = editor;
  if (selection) {
    if (edge === "anchor")
      Transforms.select(editor, selection.anchor);
    else if (edge === "focus")
      Transforms.select(editor, selection.focus);
    else if (edge === "start") {
      var [start2] = Range.edges(selection);
      Transforms.select(editor, start2);
    } else if (edge === "end") {
      var [, end2] = Range.edges(selection);
      Transforms.select(editor, end2);
    }
  } else return;
}, deselect = (editor) => {
  var {
    selection
  } = editor;
  selection && editor.apply({
    type: "set_selection",
    properties: selection,
    newProperties: null
  });
}, move = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
    selection
  } = editor, {
    distance = 1,
    unit = "character",
    reverse = !1
  } = options, {
    edge = null
  } = options;
  if (selection) {
    edge === "start" && (edge = Range.isBackward(selection) ? "focus" : "anchor"), edge === "end" && (edge = Range.isBackward(selection) ? "anchor" : "focus");
    var {
      anchor,
      focus: focus2
    } = selection, opts = {
      distance,
      unit
    }, props = {};
    if (edge == null || edge === "anchor") {
      var point3 = reverse ? Editor.before(editor, anchor, opts) : Editor.after(editor, anchor, opts);
      point3 && (props.anchor = point3);
    }
    if (edge == null || edge === "focus") {
      var _point = reverse ? Editor.before(editor, focus2, opts) : Editor.after(editor, focus2, opts);
      _point && (props.focus = _point);
    }
    Transforms.setSelection(editor, props);
  }
}, select = (editor, target) => {
  var {
    selection
  } = editor;
  if (target = Editor.range(editor, target), selection) {
    Transforms.setSelection(editor, target);
    return;
  }
  if (!Range.isRange(target))
    throw new Error("When setting the selection and the current selection is `null` you must provide at least an `anchor` and `focus`, but you passed: ".concat(Scrubber.stringify(target)));
  editor.apply({
    type: "set_selection",
    properties: selection,
    newProperties: target
  });
};
function ownKeys$1$2(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$1$2(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$1$2(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$1$2(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var setPoint = function(editor, props) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, {
    selection
  } = editor, {
    edge = "both"
  } = options;
  if (selection) {
    edge === "start" && (edge = Range.isBackward(selection) ? "focus" : "anchor"), edge === "end" && (edge = Range.isBackward(selection) ? "anchor" : "focus");
    var {
      anchor,
      focus: focus2
    } = selection, point3 = edge === "anchor" ? anchor : focus2;
    Transforms.setSelection(editor, {
      [edge === "anchor" ? "anchor" : "focus"]: _objectSpread$1$2(_objectSpread$1$2({}, point3), props)
    });
  }
}, setSelection = (editor, props) => {
  var {
    selection
  } = editor, oldProps = {}, newProps = {};
  if (selection) {
    for (var k in props)
      (k === "anchor" && props.anchor != null && !Point.equals(props.anchor, selection.anchor) || k === "focus" && props.focus != null && !Point.equals(props.focus, selection.focus) || k !== "anchor" && k !== "focus" && props[k] !== selection[k]) && (oldProps[k] = selection[k], newProps[k] = props[k]);
    Object.keys(oldProps).length > 0 && editor.apply({
      type: "set_selection",
      properties: oldProps,
      newProperties: newProps
    });
  }
}, insertNodes = function(editor, nodes2) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      hanging = !1,
      voids = !1,
      mode = "lowest",
      batchDirty = !0
    } = options, {
      at,
      match: match2,
      select: select2
    } = options;
    if (Node.isNode(nodes2) && (nodes2 = [nodes2]), nodes2.length !== 0) {
      var [node3] = nodes2;
      if (at || (at = getDefaultInsertLocation(editor), select2 !== !1 && (select2 = !0)), select2 == null && (select2 = !1), Range.isRange(at))
        if (hanging || (at = Editor.unhangRange(editor, at, {
          voids
        })), Range.isCollapsed(at))
          at = at.anchor;
        else {
          var [, end2] = Range.edges(at), pointRef3 = Editor.pointRef(editor, end2);
          Transforms.delete(editor, {
            at
          }), at = pointRef3.unref();
        }
      if (Point.isPoint(at)) {
        match2 == null && (Text$1.isText(node3) ? match2 = (n2) => Text$1.isText(n2) : editor.isInline(node3) ? match2 = (n2) => Text$1.isText(n2) || Editor.isInline(editor, n2) : match2 = (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2));
        var [entry] = Editor.nodes(editor, {
          at: at.path,
          match: match2,
          mode,
          voids
        });
        if (entry) {
          var [, matchPath2] = entry, pathRef3 = Editor.pathRef(editor, matchPath2), isAtEnd = Editor.isEnd(editor, at, matchPath2);
          Transforms.splitNodes(editor, {
            at,
            match: match2,
            mode,
            voids
          });
          var path3 = pathRef3.unref();
          at = isAtEnd ? Path.next(path3) : path3;
        } else
          return;
      }
      var parentPath = Path.parent(at), index = at[at.length - 1];
      if (!(!voids && Editor.void(editor, {
        at: parentPath
      }))) {
        if (batchDirty) {
          var batchedOps = [], newDirtyPaths = Path.levels(parentPath);
          batchDirtyPaths(editor, () => {
            var _loop = function() {
              var path4 = parentPath.concat(index);
              index++;
              var op = {
                type: "insert_node",
                path: path4,
                node: _node
              };
              editor.apply(op), at = Path.next(at), batchedOps.push(op), Text$1.isText(_node) ? newDirtyPaths.push(path4) : newDirtyPaths.push(...Array.from(Node.nodes(_node), (_ref) => {
                var [, p] = _ref;
                return path4.concat(p);
              }));
            };
            for (var _node of nodes2)
              _loop();
          }, () => {
            updateDirtyPaths(editor, newDirtyPaths, (p) => {
              var newPath = p;
              for (var op of batchedOps)
                if (Path.operationCanTransformPath(op) && (newPath = Path.transform(newPath, op), !newPath))
                  return null;
              return newPath;
            });
          });
        } else
          for (var _node2 of nodes2) {
            var _path = parentPath.concat(index);
            index++, editor.apply({
              type: "insert_node",
              path: _path,
              node: _node2
            }), at = Path.next(at);
          }
        if (at = Path.previous(at), select2) {
          var point3 = Editor.end(editor, at);
          point3 && Transforms.select(editor, point3);
        }
      }
    }
  });
}, liftNodes = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      at = editor.selection,
      mode = "lowest",
      voids = !1
    } = options, {
      match: match2
    } = options;
    if (match2 == null && (match2 = Path.isPath(at) ? matchPath(editor, at) : (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2)), !!at) {
      var matches = Editor.nodes(editor, {
        at,
        match: match2,
        mode,
        voids
      }), pathRefs2 = Array.from(matches, (_ref) => {
        var [, p] = _ref;
        return Editor.pathRef(editor, p);
      });
      for (var pathRef3 of pathRefs2) {
        var path3 = pathRef3.unref();
        if (path3.length < 2)
          throw new Error("Cannot lift node at a path [".concat(path3, "] because it has a depth of less than `2`."));
        var parentNodeEntry = Editor.node(editor, Path.parent(path3)), [parent3, parentPath] = parentNodeEntry, index = path3[path3.length - 1], {
          length
        } = parent3.children;
        if (length === 1) {
          var toPath = Path.next(parentPath);
          Transforms.moveNodes(editor, {
            at: path3,
            to: toPath,
            voids
          }), Transforms.removeNodes(editor, {
            at: parentPath,
            voids
          });
        } else if (index === 0)
          Transforms.moveNodes(editor, {
            at: path3,
            to: parentPath,
            voids
          });
        else if (index === length - 1) {
          var _toPath = Path.next(parentPath);
          Transforms.moveNodes(editor, {
            at: path3,
            to: _toPath,
            voids
          });
        } else {
          var splitPath = Path.next(path3), _toPath2 = Path.next(parentPath);
          Transforms.splitNodes(editor, {
            at: splitPath,
            voids
          }), Transforms.moveNodes(editor, {
            at: path3,
            to: _toPath2,
            voids
          });
        }
      }
    }
  });
}, _excluded$5 = ["text"], _excluded2$4 = ["children"], hasSingleChildNest = (editor, node3) => {
  if (Element$2.isElement(node3)) {
    var element = node3;
    return Editor.isVoid(editor, node3) ? !0 : element.children.length === 1 ? hasSingleChildNest(editor, element.children[0]) : !1;
  } else return !Editor.isEditor(node3);
}, mergeNodes = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      match: match2,
      at = editor.selection
    } = options, {
      hanging = !1,
      voids = !1,
      mode = "lowest"
    } = options;
    if (at) {
      if (match2 == null)
        if (Path.isPath(at)) {
          var [parent3] = Editor.parent(editor, at);
          match2 = (n2) => parent3.children.includes(n2);
        } else
          match2 = (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2);
      if (!hanging && Range.isRange(at) && (at = Editor.unhangRange(editor, at, {
        voids
      })), Range.isRange(at))
        if (Range.isCollapsed(at))
          at = at.anchor;
        else {
          var [, end2] = Range.edges(at), pointRef3 = Editor.pointRef(editor, end2);
          Transforms.delete(editor, {
            at
          }), at = pointRef3.unref(), options.at == null && Transforms.select(editor, at);
        }
      var [current] = Editor.nodes(editor, {
        at,
        match: match2,
        voids,
        mode
      }), prev = Editor.previous(editor, {
        at,
        match: match2,
        voids,
        mode
      });
      if (!(!current || !prev)) {
        var [node3, path3] = current, [prevNode, prevPath] = prev;
        if (!(path3.length === 0 || prevPath.length === 0)) {
          var newPath = Path.next(prevPath), commonPath = Path.common(path3, prevPath), isPreviousSibling = Path.isSibling(path3, prevPath), levels2 = Array.from(Editor.levels(editor, {
            at: path3
          }), (_ref) => {
            var [n2] = _ref;
            return n2;
          }).slice(commonPath.length).slice(0, -1), emptyAncestor = Editor.above(editor, {
            at: path3,
            mode: "highest",
            match: (n2) => levels2.includes(n2) && hasSingleChildNest(editor, n2)
          }), emptyRef = emptyAncestor && Editor.pathRef(editor, emptyAncestor[1]), properties, position;
          if (Text$1.isText(node3) && Text$1.isText(prevNode)) {
            var rest = _objectWithoutProperties$2(node3, _excluded$5);
            position = prevNode.text.length, properties = rest;
          } else if (Element$2.isElement(node3) && Element$2.isElement(prevNode)) {
            var rest = _objectWithoutProperties$2(node3, _excluded2$4);
            position = prevNode.children.length, properties = rest;
          } else
            throw new Error("Cannot merge the node at path [".concat(path3, "] with the previous sibling because it is not the same kind: ").concat(Scrubber.stringify(node3), " ").concat(Scrubber.stringify(prevNode)));
          isPreviousSibling || Transforms.moveNodes(editor, {
            at: path3,
            to: newPath,
            voids
          }), emptyRef && Transforms.removeNodes(editor, {
            at: emptyRef.current,
            voids
          }), Editor.shouldMergeNodesRemovePrevNode(editor, prev, current) ? Transforms.removeNodes(editor, {
            at: prevPath,
            voids
          }) : editor.apply({
            type: "merge_node",
            path: newPath,
            position,
            properties
          }), emptyRef && emptyRef.unref();
        }
      }
    }
  });
}, moveNodes = (editor, options) => {
  Editor.withoutNormalizing(editor, () => {
    var {
      to,
      at = editor.selection,
      mode = "lowest",
      voids = !1
    } = options, {
      match: match2
    } = options;
    if (at) {
      match2 == null && (match2 = Path.isPath(at) ? matchPath(editor, at) : (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2));
      var toRef = Editor.pathRef(editor, to), targets = Editor.nodes(editor, {
        at,
        match: match2,
        mode,
        voids
      }), pathRefs2 = Array.from(targets, (_ref) => {
        var [, p] = _ref;
        return Editor.pathRef(editor, p);
      });
      for (var pathRef3 of pathRefs2) {
        var path3 = pathRef3.unref(), newPath = toRef.current;
        path3.length !== 0 && editor.apply({
          type: "move_node",
          path: path3,
          newPath
        }), toRef.current && Path.isSibling(newPath, path3) && Path.isAfter(newPath, path3) && (toRef.current = Path.next(toRef.current));
      }
      toRef.unref();
    }
  });
}, removeNodes = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      hanging = !1,
      voids = !1,
      mode = "lowest"
    } = options, {
      at = editor.selection,
      match: match2
    } = options;
    if (at) {
      match2 == null && (match2 = Path.isPath(at) ? matchPath(editor, at) : (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2)), !hanging && Range.isRange(at) && (at = Editor.unhangRange(editor, at, {
        voids
      }));
      var depths = Editor.nodes(editor, {
        at,
        match: match2,
        mode,
        voids
      }), pathRefs2 = Array.from(depths, (_ref) => {
        var [, p] = _ref;
        return Editor.pathRef(editor, p);
      });
      for (var pathRef3 of pathRefs2) {
        var path3 = pathRef3.unref();
        if (path3) {
          var [node3] = Editor.node(editor, path3);
          editor.apply({
            type: "remove_node",
            path: path3,
            node: node3
          });
        }
      }
    }
  });
}, setNodes = function(editor, props) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      match: match2,
      at = editor.selection,
      compare,
      merge
    } = options, {
      hanging = !1,
      mode = "lowest",
      split = !1,
      voids = !1
    } = options;
    if (at) {
      if (match2 == null && (match2 = Path.isPath(at) ? matchPath(editor, at) : (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2)), !hanging && Range.isRange(at) && (at = Editor.unhangRange(editor, at, {
        voids
      })), split && Range.isRange(at)) {
        if (Range.isCollapsed(at) && Editor.leaf(editor, at.anchor)[0].text.length > 0)
          return;
        var rangeRef3 = Editor.rangeRef(editor, at, {
          affinity: "inward"
        }), [start2, end2] = Range.edges(at), splitMode = mode === "lowest" ? "lowest" : "highest", endAtEndOfNode = Editor.isEnd(editor, end2, end2.path);
        Transforms.splitNodes(editor, {
          at: end2,
          match: match2,
          mode: splitMode,
          voids,
          always: !endAtEndOfNode
        });
        var startAtStartOfNode = Editor.isStart(editor, start2, start2.path);
        Transforms.splitNodes(editor, {
          at: start2,
          match: match2,
          mode: splitMode,
          voids,
          always: !startAtStartOfNode
        }), at = rangeRef3.unref(), options.at == null && Transforms.select(editor, at);
      }
      compare || (compare = (prop, nodeProp) => prop !== nodeProp);
      for (var [node3, path3] of Editor.nodes(editor, {
        at,
        match: match2,
        mode,
        voids
      })) {
        var properties = {}, newProperties = {};
        if (path3.length !== 0) {
          var hasChanges = !1;
          for (var k in props)
            k === "children" || k === "text" || compare(props[k], node3[k]) && (hasChanges = !0, node3.hasOwnProperty(k) && (properties[k] = node3[k]), merge ? props[k] != null && (newProperties[k] = merge(node3[k], props[k])) : props[k] != null && (newProperties[k] = props[k]));
          hasChanges && editor.apply({
            type: "set_node",
            path: path3,
            properties,
            newProperties
          });
        }
      }
    }
  });
}, deleteRange = (editor, range2) => {
  if (Range.isCollapsed(range2))
    return range2.anchor;
  var [, end2] = Range.edges(range2), pointRef3 = Editor.pointRef(editor, end2);
  return Transforms.delete(editor, {
    at: range2
  }), pointRef3.unref();
}, splitNodes = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      mode = "lowest",
      voids = !1
    } = options, {
      match: match2,
      at = editor.selection,
      height = 0,
      always = !1
    } = options;
    if (match2 == null && (match2 = (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2)), Range.isRange(at) && (at = deleteRange(editor, at)), Path.isPath(at)) {
      var path3 = at, point3 = Editor.point(editor, path3), [parent3] = Editor.parent(editor, path3);
      match2 = (n2) => n2 === parent3, height = point3.path.length - path3.length + 1, at = point3, always = !0;
    }
    if (at) {
      var beforeRef = Editor.pointRef(editor, at, {
        affinity: "backward"
      }), afterRef;
      try {
        var [highest] = Editor.nodes(editor, {
          at,
          match: match2,
          mode,
          voids
        });
        if (!highest)
          return;
        var voidMatch = Editor.void(editor, {
          at,
          mode: "highest"
        }), nudge = 0;
        if (!voids && voidMatch) {
          var [voidNode, voidPath] = voidMatch;
          if (Element$2.isElement(voidNode) && editor.isInline(voidNode)) {
            var after3 = Editor.after(editor, voidPath);
            if (!after3) {
              var text = {
                text: ""
              }, afterPath = Path.next(voidPath);
              Transforms.insertNodes(editor, text, {
                at: afterPath,
                voids
              }), after3 = Editor.point(editor, afterPath);
            }
            at = after3, always = !0;
          }
          var siblingHeight = at.path.length - voidPath.length;
          height = siblingHeight + 1, always = !0;
        }
        afterRef = Editor.pointRef(editor, at);
        var depth = at.path.length - height, [, highestPath] = highest, lowestPath = at.path.slice(0, depth), position = height === 0 ? at.offset : at.path[depth] + nudge;
        for (var [node3, _path] of Editor.levels(editor, {
          at: lowestPath,
          reverse: !0,
          voids
        })) {
          var split = !1;
          if (_path.length < highestPath.length || _path.length === 0 || !voids && Element$2.isElement(node3) && Editor.isVoid(editor, node3))
            break;
          var _point = beforeRef.current, isEnd2 = Editor.isEnd(editor, _point, _path);
          if (always || !beforeRef || !Editor.isEdge(editor, _point, _path)) {
            split = !0;
            var properties = Node.extractProps(node3);
            editor.apply({
              type: "split_node",
              path: _path,
              position,
              properties
            });
          }
          position = _path[_path.length - 1] + (split || isEnd2 ? 1 : 0);
        }
        if (options.at == null) {
          var _point2 = afterRef.current || Editor.end(editor, []);
          Transforms.select(editor, _point2);
        }
      } finally {
        var _afterRef;
        beforeRef.unref(), (_afterRef = afterRef) === null || _afterRef === void 0 || _afterRef.unref();
      }
    }
  });
}, unsetNodes = function(editor, props) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  Array.isArray(props) || (props = [props]);
  var obj = {};
  for (var key of props)
    obj[key] = null;
  Transforms.setNodes(editor, obj, options);
}, unwrapNodes = function(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      mode = "lowest",
      split = !1,
      voids = !1
    } = options, {
      at = editor.selection,
      match: match2
    } = options;
    if (at) {
      match2 == null && (match2 = Path.isPath(at) ? matchPath(editor, at) : (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2)), Path.isPath(at) && (at = Editor.range(editor, at));
      var rangeRef3 = Range.isRange(at) ? Editor.rangeRef(editor, at) : null, matches = Editor.nodes(editor, {
        at,
        match: match2,
        mode,
        voids
      }), pathRefs2 = Array.from(
        matches,
        (_ref) => {
          var [, p] = _ref;
          return Editor.pathRef(editor, p);
        }
        // unwrapNode will call liftNode which does not support splitting the node when nested.
        // If we do not reverse the order and call it from top to the bottom, it will remove all blocks
        // that wrap target node. So we reverse the order.
      ).reverse(), _loop = function() {
        var path3 = pathRef3.unref(), [node3] = Editor.node(editor, path3), range2 = Editor.range(editor, path3);
        split && rangeRef3 && (range2 = Range.intersection(rangeRef3.current, range2)), Transforms.liftNodes(editor, {
          at: range2,
          match: (n2) => Element$2.isAncestor(node3) && node3.children.includes(n2),
          voids
        });
      };
      for (var pathRef3 of pathRefs2)
        _loop();
      rangeRef3 && rangeRef3.unref();
    }
  });
};
function ownKeys$h(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$h(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$h(Object(t2), !0).forEach(function(r3) {
      _defineProperty$2(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$h(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var wrapNodes = function(editor, element) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      mode = "lowest",
      split = !1,
      voids = !1
    } = options, {
      match: match2,
      at = editor.selection
    } = options;
    if (at) {
      if (match2 == null && (Path.isPath(at) ? match2 = matchPath(editor, at) : editor.isInline(element) ? match2 = (n2) => Element$2.isElement(n2) && Editor.isInline(editor, n2) || Text$1.isText(n2) : match2 = (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2)), split && Range.isRange(at)) {
        var [start2, end2] = Range.edges(at), rangeRef3 = Editor.rangeRef(editor, at, {
          affinity: "inward"
        }), isAtBlockEdge = (point3) => {
          var blockAbove = Editor.above(editor, {
            at: point3,
            match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2)
          });
          return blockAbove && Editor.isEdge(editor, point3, blockAbove[1]);
        };
        Transforms.splitNodes(editor, {
          at: end2,
          match: match2,
          voids,
          always: !isAtBlockEdge(end2)
        }), Transforms.splitNodes(editor, {
          at: start2,
          match: match2,
          voids,
          always: !isAtBlockEdge(start2)
        }), at = rangeRef3.unref(), options.at == null && Transforms.select(editor, at);
      }
      var roots = Array.from(Editor.nodes(editor, {
        at,
        match: editor.isInline(element) ? (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2) : (n2) => Editor.isEditor(n2),
        mode: "lowest",
        voids
      })), _loop = function() {
        var a = Range.isRange(at) ? Range.intersection(at, Editor.range(editor, rootPath)) : at;
        if (!a)
          return 0;
        var matches = Array.from(Editor.nodes(editor, {
          at: a,
          match: match2,
          mode,
          voids
        }));
        if (matches.length > 0) {
          var [first2] = matches, last2 = matches[matches.length - 1], [, firstPath] = first2, [, lastPath] = last2;
          if (firstPath.length === 0 && lastPath.length === 0)
            return 0;
          var commonPath = Path.equals(firstPath, lastPath) ? Path.parent(firstPath) : Path.common(firstPath, lastPath), range2 = Editor.range(editor, firstPath, lastPath), commonNodeEntry = Editor.node(editor, commonPath), [commonNode] = commonNodeEntry, depth = commonPath.length + 1, wrapperPath = Path.next(lastPath.slice(0, depth)), wrapper = _objectSpread$h(_objectSpread$h({}, element), {}, {
            children: []
          });
          Transforms.insertNodes(editor, wrapper, {
            at: wrapperPath,
            voids
          }), Transforms.moveNodes(editor, {
            at: range2,
            match: (n2) => Element$2.isAncestor(commonNode) && commonNode.children.includes(n2),
            to: wrapperPath.concat(0),
            voids
          });
        }
      }, _ret;
      for (var [, rootPath] of roots)
        _ret = _loop();
    }
  });
}, createEditor = () => {
  var editor = {
    children: [],
    operations: [],
    selection: null,
    marks: null,
    isElementReadOnly: () => !1,
    isInline: () => !1,
    isSelectable: () => !0,
    isVoid: () => !1,
    markableVoid: () => !1,
    onChange: () => {
    },
    // Core
    apply: function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)
        args[_key] = arguments[_key];
      return apply$1(editor, ...args);
    },
    // Editor
    addMark: function() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++)
        args[_key2] = arguments[_key2];
      return addMark(editor, ...args);
    },
    deleteBackward: function() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++)
        args[_key3] = arguments[_key3];
      return deleteBackward(editor, ...args);
    },
    deleteForward: function() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++)
        args[_key4] = arguments[_key4];
      return deleteForward(editor, ...args);
    },
    deleteFragment: function() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++)
        args[_key5] = arguments[_key5];
      return deleteFragment(editor, ...args);
    },
    getFragment: function() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++)
        args[_key6] = arguments[_key6];
      return getFragment(editor, ...args);
    },
    insertBreak: function() {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++)
        args[_key7] = arguments[_key7];
      return insertBreak(editor, ...args);
    },
    insertSoftBreak: function() {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++)
        args[_key8] = arguments[_key8];
      return insertSoftBreak(editor, ...args);
    },
    insertFragment: function() {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++)
        args[_key9] = arguments[_key9];
      return insertFragment(editor, ...args);
    },
    insertNode: function() {
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++)
        args[_key10] = arguments[_key10];
      return insertNode(editor, ...args);
    },
    insertText: function() {
      for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++)
        args[_key11] = arguments[_key11];
      return insertText(editor, ...args);
    },
    normalizeNode: function() {
      for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++)
        args[_key12] = arguments[_key12];
      return normalizeNode(editor, ...args);
    },
    removeMark: function() {
      for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++)
        args[_key13] = arguments[_key13];
      return removeMark(editor, ...args);
    },
    getDirtyPaths: function() {
      for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++)
        args[_key14] = arguments[_key14];
      return getDirtyPaths(editor, ...args);
    },
    shouldNormalize: function() {
      for (var _len15 = arguments.length, args = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++)
        args[_key15] = arguments[_key15];
      return shouldNormalize(editor, ...args);
    },
    // Editor interface
    above: function() {
      for (var _len16 = arguments.length, args = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++)
        args[_key16] = arguments[_key16];
      return above(editor, ...args);
    },
    after: function() {
      for (var _len17 = arguments.length, args = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++)
        args[_key17] = arguments[_key17];
      return after(editor, ...args);
    },
    before: function() {
      for (var _len18 = arguments.length, args = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++)
        args[_key18] = arguments[_key18];
      return before(editor, ...args);
    },
    collapse: function() {
      for (var _len19 = arguments.length, args = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++)
        args[_key19] = arguments[_key19];
      return collapse(editor, ...args);
    },
    delete: function() {
      for (var _len20 = arguments.length, args = new Array(_len20), _key20 = 0; _key20 < _len20; _key20++)
        args[_key20] = arguments[_key20];
      return deleteText(editor, ...args);
    },
    deselect: function() {
      for (var _len21 = arguments.length, args = new Array(_len21), _key21 = 0; _key21 < _len21; _key21++)
        args[_key21] = arguments[_key21];
      return deselect(editor, ...args);
    },
    edges: function() {
      for (var _len22 = arguments.length, args = new Array(_len22), _key22 = 0; _key22 < _len22; _key22++)
        args[_key22] = arguments[_key22];
      return edges(editor, ...args);
    },
    elementReadOnly: function() {
      for (var _len23 = arguments.length, args = new Array(_len23), _key23 = 0; _key23 < _len23; _key23++)
        args[_key23] = arguments[_key23];
      return elementReadOnly(editor, ...args);
    },
    end: function() {
      for (var _len24 = arguments.length, args = new Array(_len24), _key24 = 0; _key24 < _len24; _key24++)
        args[_key24] = arguments[_key24];
      return end(editor, ...args);
    },
    first: function() {
      for (var _len25 = arguments.length, args = new Array(_len25), _key25 = 0; _key25 < _len25; _key25++)
        args[_key25] = arguments[_key25];
      return first(editor, ...args);
    },
    fragment: function() {
      for (var _len26 = arguments.length, args = new Array(_len26), _key26 = 0; _key26 < _len26; _key26++)
        args[_key26] = arguments[_key26];
      return fragment(editor, ...args);
    },
    getMarks: function() {
      for (var _len27 = arguments.length, args = new Array(_len27), _key27 = 0; _key27 < _len27; _key27++)
        args[_key27] = arguments[_key27];
      return marks(editor, ...args);
    },
    hasBlocks: function() {
      for (var _len28 = arguments.length, args = new Array(_len28), _key28 = 0; _key28 < _len28; _key28++)
        args[_key28] = arguments[_key28];
      return hasBlocks(editor, ...args);
    },
    hasInlines: function() {
      for (var _len29 = arguments.length, args = new Array(_len29), _key29 = 0; _key29 < _len29; _key29++)
        args[_key29] = arguments[_key29];
      return hasInlines(editor, ...args);
    },
    hasPath: function() {
      for (var _len30 = arguments.length, args = new Array(_len30), _key30 = 0; _key30 < _len30; _key30++)
        args[_key30] = arguments[_key30];
      return hasPath(editor, ...args);
    },
    hasTexts: function() {
      for (var _len31 = arguments.length, args = new Array(_len31), _key31 = 0; _key31 < _len31; _key31++)
        args[_key31] = arguments[_key31];
      return hasTexts(editor, ...args);
    },
    insertNodes: function() {
      for (var _len32 = arguments.length, args = new Array(_len32), _key32 = 0; _key32 < _len32; _key32++)
        args[_key32] = arguments[_key32];
      return insertNodes(editor, ...args);
    },
    isBlock: function() {
      for (var _len33 = arguments.length, args = new Array(_len33), _key33 = 0; _key33 < _len33; _key33++)
        args[_key33] = arguments[_key33];
      return isBlock(editor, ...args);
    },
    isEdge: function() {
      for (var _len34 = arguments.length, args = new Array(_len34), _key34 = 0; _key34 < _len34; _key34++)
        args[_key34] = arguments[_key34];
      return isEdge(editor, ...args);
    },
    isEmpty: function() {
      for (var _len35 = arguments.length, args = new Array(_len35), _key35 = 0; _key35 < _len35; _key35++)
        args[_key35] = arguments[_key35];
      return isEmpty(editor, ...args);
    },
    isEnd: function() {
      for (var _len36 = arguments.length, args = new Array(_len36), _key36 = 0; _key36 < _len36; _key36++)
        args[_key36] = arguments[_key36];
      return isEnd(editor, ...args);
    },
    isNormalizing: function() {
      for (var _len37 = arguments.length, args = new Array(_len37), _key37 = 0; _key37 < _len37; _key37++)
        args[_key37] = arguments[_key37];
      return isNormalizing(editor, ...args);
    },
    isStart: function() {
      for (var _len38 = arguments.length, args = new Array(_len38), _key38 = 0; _key38 < _len38; _key38++)
        args[_key38] = arguments[_key38];
      return isStart(editor, ...args);
    },
    last: function() {
      for (var _len39 = arguments.length, args = new Array(_len39), _key39 = 0; _key39 < _len39; _key39++)
        args[_key39] = arguments[_key39];
      return last(editor, ...args);
    },
    leaf: function() {
      for (var _len40 = arguments.length, args = new Array(_len40), _key40 = 0; _key40 < _len40; _key40++)
        args[_key40] = arguments[_key40];
      return leaf(editor, ...args);
    },
    levels: function() {
      for (var _len41 = arguments.length, args = new Array(_len41), _key41 = 0; _key41 < _len41; _key41++)
        args[_key41] = arguments[_key41];
      return levels(editor, ...args);
    },
    liftNodes: function() {
      for (var _len42 = arguments.length, args = new Array(_len42), _key42 = 0; _key42 < _len42; _key42++)
        args[_key42] = arguments[_key42];
      return liftNodes(editor, ...args);
    },
    mergeNodes: function() {
      for (var _len43 = arguments.length, args = new Array(_len43), _key43 = 0; _key43 < _len43; _key43++)
        args[_key43] = arguments[_key43];
      return mergeNodes(editor, ...args);
    },
    move: function() {
      for (var _len44 = arguments.length, args = new Array(_len44), _key44 = 0; _key44 < _len44; _key44++)
        args[_key44] = arguments[_key44];
      return move(editor, ...args);
    },
    moveNodes: function() {
      for (var _len45 = arguments.length, args = new Array(_len45), _key45 = 0; _key45 < _len45; _key45++)
        args[_key45] = arguments[_key45];
      return moveNodes(editor, ...args);
    },
    next: function() {
      for (var _len46 = arguments.length, args = new Array(_len46), _key46 = 0; _key46 < _len46; _key46++)
        args[_key46] = arguments[_key46];
      return next(editor, ...args);
    },
    node: function() {
      for (var _len47 = arguments.length, args = new Array(_len47), _key47 = 0; _key47 < _len47; _key47++)
        args[_key47] = arguments[_key47];
      return node(editor, ...args);
    },
    nodes: function() {
      for (var _len48 = arguments.length, args = new Array(_len48), _key48 = 0; _key48 < _len48; _key48++)
        args[_key48] = arguments[_key48];
      return nodes(editor, ...args);
    },
    normalize: function() {
      for (var _len49 = arguments.length, args = new Array(_len49), _key49 = 0; _key49 < _len49; _key49++)
        args[_key49] = arguments[_key49];
      return normalize(editor, ...args);
    },
    parent: function() {
      for (var _len50 = arguments.length, args = new Array(_len50), _key50 = 0; _key50 < _len50; _key50++)
        args[_key50] = arguments[_key50];
      return parent(editor, ...args);
    },
    path: function() {
      for (var _len51 = arguments.length, args = new Array(_len51), _key51 = 0; _key51 < _len51; _key51++)
        args[_key51] = arguments[_key51];
      return path(editor, ...args);
    },
    pathRef: function() {
      for (var _len52 = arguments.length, args = new Array(_len52), _key52 = 0; _key52 < _len52; _key52++)
        args[_key52] = arguments[_key52];
      return pathRef(editor, ...args);
    },
    pathRefs: function() {
      for (var _len53 = arguments.length, args = new Array(_len53), _key53 = 0; _key53 < _len53; _key53++)
        args[_key53] = arguments[_key53];
      return pathRefs(editor, ...args);
    },
    point: function() {
      for (var _len54 = arguments.length, args = new Array(_len54), _key54 = 0; _key54 < _len54; _key54++)
        args[_key54] = arguments[_key54];
      return point(editor, ...args);
    },
    pointRef: function() {
      for (var _len55 = arguments.length, args = new Array(_len55), _key55 = 0; _key55 < _len55; _key55++)
        args[_key55] = arguments[_key55];
      return pointRef(editor, ...args);
    },
    pointRefs: function() {
      for (var _len56 = arguments.length, args = new Array(_len56), _key56 = 0; _key56 < _len56; _key56++)
        args[_key56] = arguments[_key56];
      return pointRefs(editor, ...args);
    },
    positions: function() {
      for (var _len57 = arguments.length, args = new Array(_len57), _key57 = 0; _key57 < _len57; _key57++)
        args[_key57] = arguments[_key57];
      return positions(editor, ...args);
    },
    previous: function() {
      for (var _len58 = arguments.length, args = new Array(_len58), _key58 = 0; _key58 < _len58; _key58++)
        args[_key58] = arguments[_key58];
      return previous(editor, ...args);
    },
    range: function() {
      for (var _len59 = arguments.length, args = new Array(_len59), _key59 = 0; _key59 < _len59; _key59++)
        args[_key59] = arguments[_key59];
      return range(editor, ...args);
    },
    rangeRef: function() {
      for (var _len60 = arguments.length, args = new Array(_len60), _key60 = 0; _key60 < _len60; _key60++)
        args[_key60] = arguments[_key60];
      return rangeRef(editor, ...args);
    },
    rangeRefs: function() {
      for (var _len61 = arguments.length, args = new Array(_len61), _key61 = 0; _key61 < _len61; _key61++)
        args[_key61] = arguments[_key61];
      return rangeRefs(editor, ...args);
    },
    removeNodes: function() {
      for (var _len62 = arguments.length, args = new Array(_len62), _key62 = 0; _key62 < _len62; _key62++)
        args[_key62] = arguments[_key62];
      return removeNodes(editor, ...args);
    },
    select: function() {
      for (var _len63 = arguments.length, args = new Array(_len63), _key63 = 0; _key63 < _len63; _key63++)
        args[_key63] = arguments[_key63];
      return select(editor, ...args);
    },
    setNodes: function() {
      for (var _len64 = arguments.length, args = new Array(_len64), _key64 = 0; _key64 < _len64; _key64++)
        args[_key64] = arguments[_key64];
      return setNodes(editor, ...args);
    },
    setNormalizing: function() {
      for (var _len65 = arguments.length, args = new Array(_len65), _key65 = 0; _key65 < _len65; _key65++)
        args[_key65] = arguments[_key65];
      return setNormalizing(editor, ...args);
    },
    setPoint: function() {
      for (var _len66 = arguments.length, args = new Array(_len66), _key66 = 0; _key66 < _len66; _key66++)
        args[_key66] = arguments[_key66];
      return setPoint(editor, ...args);
    },
    setSelection: function() {
      for (var _len67 = arguments.length, args = new Array(_len67), _key67 = 0; _key67 < _len67; _key67++)
        args[_key67] = arguments[_key67];
      return setSelection(editor, ...args);
    },
    splitNodes: function() {
      for (var _len68 = arguments.length, args = new Array(_len68), _key68 = 0; _key68 < _len68; _key68++)
        args[_key68] = arguments[_key68];
      return splitNodes(editor, ...args);
    },
    start: function() {
      for (var _len69 = arguments.length, args = new Array(_len69), _key69 = 0; _key69 < _len69; _key69++)
        args[_key69] = arguments[_key69];
      return start(editor, ...args);
    },
    string: function() {
      for (var _len70 = arguments.length, args = new Array(_len70), _key70 = 0; _key70 < _len70; _key70++)
        args[_key70] = arguments[_key70];
      return string(editor, ...args);
    },
    unhangRange: function() {
      for (var _len71 = arguments.length, args = new Array(_len71), _key71 = 0; _key71 < _len71; _key71++)
        args[_key71] = arguments[_key71];
      return unhangRange(editor, ...args);
    },
    unsetNodes: function() {
      for (var _len72 = arguments.length, args = new Array(_len72), _key72 = 0; _key72 < _len72; _key72++)
        args[_key72] = arguments[_key72];
      return unsetNodes(editor, ...args);
    },
    unwrapNodes: function() {
      for (var _len73 = arguments.length, args = new Array(_len73), _key73 = 0; _key73 < _len73; _key73++)
        args[_key73] = arguments[_key73];
      return unwrapNodes(editor, ...args);
    },
    void: function() {
      for (var _len74 = arguments.length, args = new Array(_len74), _key74 = 0; _key74 < _len74; _key74++)
        args[_key74] = arguments[_key74];
      return getVoid(editor, ...args);
    },
    withoutNormalizing: function() {
      for (var _len75 = arguments.length, args = new Array(_len75), _key75 = 0; _key75 < _len75; _key75++)
        args[_key75] = arguments[_key75];
      return withoutNormalizing(editor, ...args);
    },
    wrapNodes: function() {
      for (var _len76 = arguments.length, args = new Array(_len76), _key76 = 0; _key76 < _len76; _key76++)
        args[_key76] = arguments[_key76];
      return wrapNodes(editor, ...args);
    },
    shouldMergeNodesRemovePrevNode: function() {
      for (var _len77 = arguments.length, args = new Array(_len77), _key77 = 0; _key77 < _len77; _key77++)
        args[_key77] = arguments[_key77];
      return shouldMergeNodesRemovePrevNode(editor, ...args);
    }
  };
  return editor;
};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x;
}
var direction_1, hasRequiredDirection;
function requireDirection() {
  if (hasRequiredDirection) return direction_1;
  hasRequiredDirection = 1, direction_1 = direction;
  var RTL = "\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC", LTR = "A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u0300-\u0590\u0800-\u1FFF\u200E\u2C00-\uFB1C\uFE00-\uFE6F\uFEFD-\uFFFF", rtl = new RegExp("^[^" + LTR + "]*[" + RTL + "]"), ltr = new RegExp("^[^" + RTL + "]*[" + LTR + "]");
  function direction(value) {
    return value = String(value || ""), rtl.test(value) ? "rtl" : ltr.test(value) ? "ltr" : "neutral";
  }
  return direction_1;
}
var directionExports = requireDirection(), getDirection = /* @__PURE__ */ getDefaultExportFromCjs(directionExports);
const t = (t2) => typeof t2 == "object" && t2 != null && t2.nodeType === 1, e$1 = (t2, e2) => (!e2 || t2 !== "hidden") && t2 !== "visible" && t2 !== "clip", n$1 = (t2, n2) => {
  if (t2.clientHeight < t2.scrollHeight || t2.clientWidth < t2.scrollWidth) {
    const o2 = getComputedStyle(t2, null);
    return e$1(o2.overflowY, n2) || e$1(o2.overflowX, n2) || ((t3) => {
      const e2 = ((t4) => {
        if (!t4.ownerDocument || !t4.ownerDocument.defaultView) return null;
        try {
          return t4.ownerDocument.defaultView.frameElement;
        } catch {
          return null;
        }
      })(t3);
      return !!e2 && (e2.clientHeight < t3.scrollHeight || e2.clientWidth < t3.scrollWidth);
    })(t2);
  }
  return !1;
}, o$1 = (t2, e2, n2, o2, l2, r2, i, s) => r2 < t2 && i > e2 || r2 > t2 && i < e2 ? 0 : r2 <= t2 && s <= n2 || i >= e2 && s >= n2 ? r2 - t2 - o2 : i > e2 && s < n2 || r2 < t2 && s > n2 ? i - e2 + l2 : 0, l = (t2) => {
  const e2 = t2.parentElement;
  return e2 ?? (t2.getRootNode().host || null);
}, r = (e2, r2) => {
  var i, s, d, h;
  if (typeof document > "u") return [];
  const {
    scrollMode: c2,
    block: f,
    inline: u,
    boundary: a,
    skipOverflowHiddenElements: g
  } = r2, p = typeof a == "function" ? a : (t2) => t2 !== a;
  if (!t(e2)) throw new TypeError("Invalid target");
  const m = document.scrollingElement || document.documentElement, w = [];
  let W = e2;
  for (; t(W) && p(W); ) {
    if (W = l(W), W === m) {
      w.push(W);
      break;
    }
    W != null && W === document.body && n$1(W) && !n$1(document.documentElement) || W != null && n$1(W, g) && w.push(W);
  }
  const b = (s = (i = window.visualViewport) == null ? void 0 : i.width) != null ? s : innerWidth, H = (h = (d = window.visualViewport) == null ? void 0 : d.height) != null ? h : innerHeight, {
    scrollX: y,
    scrollY: M
  } = window, {
    height: v,
    width: E,
    top: x,
    right: C,
    bottom: I,
    left: R
  } = e2.getBoundingClientRect(), {
    top: T,
    right: B,
    bottom: F,
    left: V
  } = ((t2) => {
    const e3 = window.getComputedStyle(t2);
    return {
      top: parseFloat(e3.scrollMarginTop) || 0,
      right: parseFloat(e3.scrollMarginRight) || 0,
      bottom: parseFloat(e3.scrollMarginBottom) || 0,
      left: parseFloat(e3.scrollMarginLeft) || 0
    };
  })(e2);
  let k = f === "start" || f === "nearest" ? x - T : f === "end" ? I + F : x + v / 2 - T + F, D = u === "center" ? R + E / 2 - V + B : u === "end" ? C + B : R - V;
  const L = [];
  for (let t2 = 0; t2 < w.length; t2++) {
    const e3 = w[t2], {
      height: l2,
      width: r3,
      top: i2,
      right: s2,
      bottom: d2,
      left: h2
    } = e3.getBoundingClientRect();
    if (c2 === "if-needed" && x >= 0 && R >= 0 && I <= H && C <= b && (e3 === m && !n$1(e3) || x >= i2 && I <= d2 && R >= h2 && C <= s2)) return L;
    const a2 = getComputedStyle(e3), g2 = parseInt(a2.borderLeftWidth, 10), p2 = parseInt(a2.borderTopWidth, 10), W2 = parseInt(a2.borderRightWidth, 10), T2 = parseInt(a2.borderBottomWidth, 10);
    let B2 = 0, F2 = 0;
    const V2 = "offsetWidth" in e3 ? e3.offsetWidth - e3.clientWidth - g2 - W2 : 0, S = "offsetHeight" in e3 ? e3.offsetHeight - e3.clientHeight - p2 - T2 : 0, X = "offsetWidth" in e3 ? e3.offsetWidth === 0 ? 0 : r3 / e3.offsetWidth : 0, Y = "offsetHeight" in e3 ? e3.offsetHeight === 0 ? 0 : l2 / e3.offsetHeight : 0;
    if (m === e3) B2 = f === "start" ? k : f === "end" ? k - H : f === "nearest" ? o$1(M, M + H, H, p2, T2, M + k, M + k + v, v) : k - H / 2, F2 = u === "start" ? D : u === "center" ? D - b / 2 : u === "end" ? D - b : o$1(y, y + b, b, g2, W2, y + D, y + D + E, E), B2 = Math.max(0, B2 + M), F2 = Math.max(0, F2 + y);
    else {
      B2 = f === "start" ? k - i2 - p2 : f === "end" ? k - d2 + T2 + S : f === "nearest" ? o$1(i2, d2, l2, p2, T2 + S, k, k + v, v) : k - (i2 + l2 / 2) + S / 2, F2 = u === "start" ? D - h2 - g2 : u === "center" ? D - (h2 + r3 / 2) + V2 / 2 : u === "end" ? D - s2 + W2 + V2 : o$1(h2, s2, r3, g2, W2 + V2, D, D + E, E);
      const {
        scrollLeft: t3,
        scrollTop: n2
      } = e3;
      B2 = Y === 0 ? 0 : Math.max(0, Math.min(n2 + B2 / Y, e3.scrollHeight - l2 / Y + S)), F2 = X === 0 ? 0 : Math.max(0, Math.min(t3 + F2 / X, e3.scrollWidth - r3 / X + V2)), k += n2 - B2, D += t3 - F2;
    }
    L.push({
      el: e3,
      top: B2,
      left: F2
    });
  }
  return L;
}, o = (t2) => t2 === !1 ? {
  block: "end",
  inline: "nearest"
} : ((t3) => t3 === Object(t3) && Object.keys(t3).length !== 0)(t2) ? t2 : {
  block: "start",
  inline: "nearest"
};
function e(e2, r$1) {
  if (!e2.isConnected || !((t2) => {
    let o2 = t2;
    for (; o2 && o2.parentNode; ) {
      if (o2.parentNode === document) return !0;
      o2 = o2.parentNode instanceof ShadowRoot ? o2.parentNode.host : o2.parentNode;
    }
    return !1;
  })(e2)) return;
  const n2 = ((t2) => {
    const o2 = window.getComputedStyle(t2);
    return {
      top: parseFloat(o2.scrollMarginTop) || 0,
      right: parseFloat(o2.scrollMarginRight) || 0,
      bottom: parseFloat(o2.scrollMarginBottom) || 0,
      left: parseFloat(o2.scrollMarginLeft) || 0
    };
  })(e2);
  if (((t2) => typeof t2 == "object" && typeof t2.behavior == "function")(r$1)) return r$1.behavior(r(e2, r$1));
  const l2 = typeof r$1 == "boolean" || r$1 == null ? void 0 : r$1.behavior;
  for (const {
    el: a,
    top: i,
    left: s
  } of r(e2, o(r$1))) {
    const t2 = i - n2.top + n2.bottom, o2 = s - n2.left + n2.right;
    a.scroll({
      top: t2,
      left: o2,
      behavior: l2
    });
  }
}
var lib = {}, hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1, Object.defineProperty(lib, "__esModule", {
    value: !0
  });
  for (var IS_MAC2 = typeof window < "u" && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform), MODIFIERS = {
    alt: "altKey",
    control: "ctrlKey",
    meta: "metaKey",
    shift: "shiftKey"
  }, ALIASES = {
    add: "+",
    break: "pause",
    cmd: "meta",
    command: "meta",
    ctl: "control",
    ctrl: "control",
    del: "delete",
    down: "arrowdown",
    esc: "escape",
    ins: "insert",
    left: "arrowleft",
    mod: IS_MAC2 ? "meta" : "control",
    opt: "alt",
    option: "alt",
    return: "enter",
    right: "arrowright",
    space: " ",
    spacebar: " ",
    up: "arrowup",
    win: "meta",
    windows: "meta"
  }, CODES = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    control: 17,
    alt: 18,
    pause: 19,
    capslock: 20,
    escape: 27,
    " ": 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    arrowleft: 37,
    arrowup: 38,
    arrowright: 39,
    arrowdown: 40,
    insert: 45,
    delete: 46,
    meta: 91,
    numlock: 144,
    scrolllock: 145,
    ";": 186,
    "=": 187,
    ",": 188,
    "-": 189,
    ".": 190,
    "/": 191,
    "`": 192,
    "[": 219,
    "\\": 220,
    "]": 221,
    "'": 222
  }, f = 1; f < 20; f++)
    CODES["f" + f] = 111 + f;
  function isHotkey2(hotkey, options, event) {
    options && !("byKey" in options) && (event = options, options = null), Array.isArray(hotkey) || (hotkey = [hotkey]);
    var array = hotkey.map(function(string3) {
      return parseHotkey2(string3, options);
    }), check = function(e2) {
      return array.some(function(object) {
        return compareHotkey2(object, e2);
      });
    }, ret = event == null ? check : check(event);
    return ret;
  }
  function isCodeHotkey(hotkey, event) {
    return isHotkey2(hotkey, event);
  }
  function isKeyHotkey(hotkey, event) {
    return isHotkey2(hotkey, {
      byKey: !0
    }, event);
  }
  function parseHotkey2(hotkey, options) {
    var byKey = options && options.byKey, ret = {};
    hotkey = hotkey.replace("++", "+add");
    var values = hotkey.split("+"), length = values.length;
    for (var k in MODIFIERS)
      ret[MODIFIERS[k]] = !1;
    var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
    try {
      for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0) {
        var value = _step.value, optional = value.endsWith("?") && value.length > 1;
        optional && (value = value.slice(0, -1));
        var name = toKeyName2(value), modifier = MODIFIERS[name];
        if (value.length > 1 && !modifier && !ALIASES[value] && !CODES[name])
          throw new TypeError('Unknown modifier: "' + value + '"');
        (length === 1 || !modifier) && (byKey ? ret.key = name : ret.which = toKeyCode2(value)), modifier && (ret[modifier] = optional ? null : !0);
      }
    } catch (err) {
      _didIteratorError = !0, _iteratorError = err;
    } finally {
      try {
        !_iteratorNormalCompletion && _iterator.return && _iterator.return();
      } finally {
        if (_didIteratorError)
          throw _iteratorError;
      }
    }
    return ret;
  }
  function compareHotkey2(object, event) {
    for (var key in object) {
      var expected = object[key], actual = void 0;
      if (expected != null && (key === "key" && event.key != null ? actual = event.key.toLowerCase() : key === "which" ? actual = expected === 91 && event.which === 93 ? 91 : event.which : actual = event[key], !(actual == null && expected === !1) && actual !== expected))
        return !1;
    }
    return !0;
  }
  function toKeyCode2(name) {
    name = toKeyName2(name);
    var code2 = CODES[name] || name.toUpperCase().charCodeAt(0);
    return code2;
  }
  function toKeyName2(name) {
    return name = name.toLowerCase(), name = ALIASES[name] || name, name;
  }
  return lib.default = isHotkey2, lib.isHotkey = isHotkey2, lib.isCodeHotkey = isCodeHotkey, lib.isKeyHotkey = isKeyHotkey, lib.parseHotkey = parseHotkey2, lib.compareHotkey = compareHotkey2, lib.toKeyCode = toKeyCode2, lib.toKeyName = toKeyName2, lib;
}
var libExports = requireLib(), DOMNode = globalThis.Node, DOMText = globalThis.Text, getDefaultView = (value) => value && value.ownerDocument && value.ownerDocument.defaultView || null, isDOMComment = (value) => isDOMNode(value) && value.nodeType === 8, isDOMElement = (value) => isDOMNode(value) && value.nodeType === 1, isDOMNode = (value) => {
  var window2 = getDefaultView(value);
  return !!window2 && value instanceof window2.Node;
}, isDOMSelection = (value) => {
  var window2 = value && value.anchorNode && getDefaultView(value.anchorNode);
  return !!window2 && value instanceof window2.Selection;
}, isDOMText = (value) => isDOMNode(value) && value.nodeType === 3, isPlainTextOnlyPaste = (event) => event.clipboardData && event.clipboardData.getData("text/plain") !== "" && event.clipboardData.types.length === 1, normalizeDOMPoint = (domPoint) => {
  var [node3, offset] = domPoint;
  if (isDOMElement(node3) && node3.childNodes.length) {
    var isLast = offset === node3.childNodes.length, index = isLast ? offset - 1 : offset;
    for ([node3, index] = getEditableChildAndIndex(node3, index, isLast ? "backward" : "forward"), isLast = index < offset; isDOMElement(node3) && node3.childNodes.length; ) {
      var i = isLast ? node3.childNodes.length - 1 : 0;
      node3 = getEditableChild(node3, i, isLast ? "backward" : "forward");
    }
    offset = isLast && node3.textContent != null ? node3.textContent.length : 0;
  }
  return [node3, offset];
}, hasShadowRoot = (node3) => {
  for (var parent3 = node3 && node3.parentNode; parent3; ) {
    if (parent3.toString() === "[object ShadowRoot]")
      return !0;
    parent3 = parent3.parentNode;
  }
  return !1;
}, getEditableChildAndIndex = (parent3, index, direction) => {
  for (var {
    childNodes
  } = parent3, child = childNodes[index], i = index, triedForward = !1, triedBackward = !1; (isDOMComment(child) || isDOMElement(child) && child.childNodes.length === 0 || isDOMElement(child) && child.getAttribute("contenteditable") === "false") && !(triedForward && triedBackward); ) {
    if (i >= childNodes.length) {
      triedForward = !0, i = index - 1, direction = "backward";
      continue;
    }
    if (i < 0) {
      triedBackward = !0, i = index + 1, direction = "forward";
      continue;
    }
    child = childNodes[i], index = i, i += direction === "forward" ? 1 : -1;
  }
  return [child, index];
}, getEditableChild = (parent3, index, direction) => {
  var [child] = getEditableChildAndIndex(parent3, index, direction);
  return child;
}, getPlainText = (domNode) => {
  var text = "";
  if (isDOMText(domNode) && domNode.nodeValue)
    return domNode.nodeValue;
  if (isDOMElement(domNode)) {
    for (var childNode of Array.from(domNode.childNodes))
      text += getPlainText(childNode);
    var display = getComputedStyle(domNode).getPropertyValue("display");
    (display === "block" || display === "list" || domNode.tagName === "BR") && (text += `
`);
  }
  return text;
}, catchSlateFragment = /data-slate-fragment="(.+?)"/m, getSlateFragmentAttribute = (dataTransfer) => {
  var htmlData = dataTransfer.getData("text/html"), [, fragment2] = htmlData.match(catchSlateFragment) || [];
  return fragment2;
}, getSelection = (root) => root.getSelection != null ? root.getSelection() : document.getSelection(), isTrackedMutation = (editor, mutation, batch) => {
  var {
    target
  } = mutation;
  if (isDOMElement(target) && target.matches('[contentEditable="false"]'))
    return !1;
  var {
    document: document2
  } = DOMEditor.getWindow(editor);
  if (containsShadowAware(document2, target))
    return DOMEditor.hasDOMNode(editor, target, {
      editable: !0
    });
  var parentMutation = batch.find((_ref) => {
    var {
      addedNodes,
      removedNodes
    } = _ref;
    for (var node3 of addedNodes)
      if (node3 === target || containsShadowAware(node3, target))
        return !0;
    for (var _node of removedNodes)
      if (_node === target || containsShadowAware(_node, target))
        return !0;
  });
  return !parentMutation || parentMutation === mutation ? !1 : isTrackedMutation(editor, parentMutation, batch);
}, getActiveElement = () => {
  for (var activeElement = document.activeElement; (_activeElement = activeElement) !== null && _activeElement !== void 0 && _activeElement.shadowRoot && (_activeElement$shadow = activeElement.shadowRoot) !== null && _activeElement$shadow !== void 0 && _activeElement$shadow.activeElement; ) {
    var _activeElement, _activeElement$shadow, _activeElement2;
    activeElement = (_activeElement2 = activeElement) === null || _activeElement2 === void 0 || (_activeElement2 = _activeElement2.shadowRoot) === null || _activeElement2 === void 0 ? void 0 : _activeElement2.activeElement;
  }
  return activeElement;
}, isBefore = (node3, otherNode) => !!(node3.compareDocumentPosition(otherNode) & DOMNode.DOCUMENT_POSITION_PRECEDING), isAfter = (node3, otherNode) => !!(node3.compareDocumentPosition(otherNode) & DOMNode.DOCUMENT_POSITION_FOLLOWING), closestShadowAware = (element, selector) => {
  if (!element)
    return null;
  for (var current = element; current; ) {
    if (current.matches && current.matches(selector))
      return current;
    if (current.parentElement)
      current = current.parentElement;
    else if (current.parentNode && "host" in current.parentNode)
      current = current.parentNode.host;
    else
      return null;
  }
  return null;
}, containsShadowAware = (parent3, child) => {
  if (!parent3 || !child)
    return !1;
  if (parent3.contains(child))
    return !0;
  for (var current = child; current; ) {
    if (current === parent3)
      return !0;
    if (current.parentNode)
      "host" in current.parentNode ? current = current.parentNode.host : current = current.parentNode;
    else
      return !1;
  }
  return !1;
}, _navigator$userAgent$, _navigator$userAgent$2, IS_IOS = typeof navigator < "u" && typeof window < "u" && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, IS_APPLE = typeof navigator < "u" && /Mac OS X/.test(navigator.userAgent), IS_ANDROID = typeof navigator < "u" && /Android/.test(navigator.userAgent), IS_FIREFOX = typeof navigator < "u" && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent), IS_WEBKIT = typeof navigator < "u" && /AppleWebKit(?!.*Chrome)/i.test(navigator.userAgent), IS_EDGE_LEGACY = typeof navigator < "u" && /Edge?\/(?:[0-6][0-9]|[0-7][0-8])(?:\.)/i.test(navigator.userAgent), IS_CHROME = typeof navigator < "u" && /Chrome/i.test(navigator.userAgent), IS_CHROME_LEGACY = typeof navigator < "u" && /Chrome?\/(?:[0-7][0-5]|[0-6][0-9])(?:\.)/i.test(navigator.userAgent), IS_ANDROID_CHROME_LEGACY = IS_ANDROID && typeof navigator < "u" && /Chrome?\/(?:[0-5]?\d)(?:\.)/i.test(navigator.userAgent), IS_FIREFOX_LEGACY = typeof navigator < "u" && /^(?!.*Seamonkey)(?=.*Firefox\/(?:[0-7][0-9]|[0-8][0-6])(?:\.)).*/i.test(navigator.userAgent), IS_UC_MOBILE = typeof navigator < "u" && /.*UCBrowser/.test(navigator.userAgent), IS_WECHATBROWSER = typeof navigator < "u" && /.*Wechat/.test(navigator.userAgent) && !/.*MacWechat/.test(navigator.userAgent) && // avoid lookbehind (buggy in safari < 16.4)
(!IS_CHROME || IS_CHROME_LEGACY), CAN_USE_DOM = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
typeof navigator < "u" && /Safari/.test(navigator.userAgent) && /Version\/(\d+)/.test(navigator.userAgent) && ((_navigator$userAgent$ = navigator.userAgent.match(/Version\/(\d+)/)) !== null && _navigator$userAgent$ !== void 0 && _navigator$userAgent$[1] && parseInt((_navigator$userAgent$2 = navigator.userAgent.match(/Version\/(\d+)/)) === null || _navigator$userAgent$2 === void 0 ? void 0 : _navigator$userAgent$2[1], 10) < 17);
var HAS_BEFORE_INPUT_SUPPORT = (!IS_CHROME_LEGACY || !IS_ANDROID_CHROME_LEGACY) && !IS_EDGE_LEGACY && // globalThis is undefined in older browsers
typeof globalThis < "u" && globalThis.InputEvent && // @ts-ignore The `getTargetRanges` property isn't recognized.
typeof globalThis.InputEvent.prototype.getTargetRanges == "function";
function _typeof$1(o2) {
  "@babel/helpers - typeof";
  return _typeof$1 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(o3) {
    return typeof o3;
  } : function(o3) {
    return o3 && typeof Symbol == "function" && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
  }, _typeof$1(o2);
}
function _toPrimitive$1(input, hint) {
  if (_typeof$1(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint);
    if (_typeof$1(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey$1(arg) {
  var key = _toPrimitive$1(arg, "string");
  return _typeof$1(key) === "symbol" ? key : String(key);
}
function _defineProperty$1(obj, key, value) {
  return key = _toPropertyKey$1(key), key in obj ? Object.defineProperty(obj, key, {
    value,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : obj[key] = value, obj;
}
var n = 0;
class Key {
  constructor() {
    _defineProperty$1(this, "id", void 0), this.id = "".concat(n++);
  }
}
var IS_NODE_MAP_DIRTY = /* @__PURE__ */ new WeakMap(), NODE_TO_INDEX = /* @__PURE__ */ new WeakMap(), NODE_TO_PARENT = /* @__PURE__ */ new WeakMap(), EDITOR_TO_WINDOW = /* @__PURE__ */ new WeakMap(), EDITOR_TO_ELEMENT = /* @__PURE__ */ new WeakMap(), EDITOR_TO_PLACEHOLDER_ELEMENT = /* @__PURE__ */ new WeakMap(), ELEMENT_TO_NODE = /* @__PURE__ */ new WeakMap(), NODE_TO_ELEMENT = /* @__PURE__ */ new WeakMap(), NODE_TO_KEY = /* @__PURE__ */ new WeakMap(), EDITOR_TO_KEY_TO_ELEMENT = /* @__PURE__ */ new WeakMap(), IS_READ_ONLY = /* @__PURE__ */ new WeakMap(), IS_FOCUSED = /* @__PURE__ */ new WeakMap(), IS_COMPOSING = /* @__PURE__ */ new WeakMap(), EDITOR_TO_USER_SELECTION = /* @__PURE__ */ new WeakMap(), EDITOR_TO_ON_CHANGE = /* @__PURE__ */ new WeakMap(), EDITOR_TO_SCHEDULE_FLUSH = /* @__PURE__ */ new WeakMap(), EDITOR_TO_PENDING_INSERTION_MARKS = /* @__PURE__ */ new WeakMap(), EDITOR_TO_USER_MARKS = /* @__PURE__ */ new WeakMap(), EDITOR_TO_PENDING_DIFFS = /* @__PURE__ */ new WeakMap(), EDITOR_TO_PENDING_ACTION = /* @__PURE__ */ new WeakMap(), EDITOR_TO_PENDING_SELECTION = /* @__PURE__ */ new WeakMap(), EDITOR_TO_FORCE_RENDER = /* @__PURE__ */ new WeakMap(), PLACEHOLDER_SYMBOL = Symbol("placeholder"), MARK_PLACEHOLDER_SYMBOL = Symbol("mark-placeholder"), DOMEditor = {
  androidPendingDiffs: (editor) => EDITOR_TO_PENDING_DIFFS.get(editor),
  androidScheduleFlush: (editor) => {
    var _EDITOR_TO_SCHEDULE_F;
    (_EDITOR_TO_SCHEDULE_F = EDITOR_TO_SCHEDULE_FLUSH.get(editor)) === null || _EDITOR_TO_SCHEDULE_F === void 0 || _EDITOR_TO_SCHEDULE_F();
  },
  blur: (editor) => {
    var el = DOMEditor.toDOMNode(editor, editor), root = DOMEditor.findDocumentOrShadowRoot(editor);
    IS_FOCUSED.set(editor, !1), root.activeElement === el && el.blur();
  },
  deselect: (editor) => {
    var {
      selection
    } = editor, root = DOMEditor.findDocumentOrShadowRoot(editor), domSelection = getSelection(root);
    domSelection && domSelection.rangeCount > 0 && domSelection.removeAllRanges(), selection && Transforms.deselect(editor);
  },
  findDocumentOrShadowRoot: (editor) => {
    var el = DOMEditor.toDOMNode(editor, editor), root = el.getRootNode();
    return root instanceof Document || root instanceof ShadowRoot ? root : el.ownerDocument;
  },
  findEventRange: (editor, event) => {
    "nativeEvent" in event && (event = event.nativeEvent);
    var {
      clientX: x,
      clientY: y,
      target
    } = event;
    if (x == null || y == null)
      throw new Error("Cannot resolve a Slate range from a DOM event: ".concat(event));
    var node3 = DOMEditor.toSlateNode(editor, event.target), path3 = DOMEditor.findPath(editor, node3);
    if (Element$2.isElement(node3) && Editor.isVoid(editor, node3)) {
      var rect = target.getBoundingClientRect(), isPrev = editor.isInline(node3) ? x - rect.left < rect.left + rect.width - x : y - rect.top < rect.top + rect.height - y, edge = Editor.point(editor, path3, {
        edge: isPrev ? "start" : "end"
      }), point3 = isPrev ? Editor.before(editor, edge) : Editor.after(editor, edge);
      if (point3) {
        var _range = Editor.range(editor, point3);
        return _range;
      }
    }
    var domRange, {
      document: document2
    } = DOMEditor.getWindow(editor);
    if (document2.caretRangeFromPoint)
      domRange = document2.caretRangeFromPoint(x, y);
    else {
      var position = document2.caretPositionFromPoint(x, y);
      position && (domRange = document2.createRange(), domRange.setStart(position.offsetNode, position.offset), domRange.setEnd(position.offsetNode, position.offset));
    }
    if (!domRange)
      throw new Error("Cannot resolve a Slate range from a DOM event: ".concat(event));
    var range2 = DOMEditor.toSlateRange(editor, domRange, {
      exactMatch: !1,
      suppressThrow: !1
    });
    return range2;
  },
  findKey: (editor, node3) => {
    var key = NODE_TO_KEY.get(node3);
    return key || (key = new Key(), NODE_TO_KEY.set(node3, key)), key;
  },
  findPath: (editor, node3) => {
    for (var path3 = [], child = node3; ; ) {
      var parent3 = NODE_TO_PARENT.get(child);
      if (parent3 == null) {
        if (Editor.isEditor(child))
          return path3;
        break;
      }
      var i = NODE_TO_INDEX.get(child);
      if (i == null)
        break;
      path3.unshift(i), child = parent3;
    }
    throw new Error("Unable to find the path for Slate node: ".concat(Scrubber.stringify(node3)));
  },
  focus: function(editor) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      retries: 5
    };
    if (!IS_FOCUSED.get(editor) && EDITOR_TO_ELEMENT.get(editor)) {
      if (options.retries <= 0)
        throw new Error("Could not set focus, editor seems stuck with pending operations");
      if (editor.operations.length > 0) {
        setTimeout(() => {
          DOMEditor.focus(editor, {
            retries: options.retries - 1
          });
        }, 10);
        return;
      }
      var el = DOMEditor.toDOMNode(editor, editor), root = DOMEditor.findDocumentOrShadowRoot(editor);
      if (root.activeElement !== el) {
        if (editor.selection && root instanceof Document) {
          var domSelection = getSelection(root), domRange = DOMEditor.toDOMRange(editor, editor.selection);
          domSelection?.removeAllRanges(), domSelection?.addRange(domRange);
        }
        editor.selection || Transforms.select(editor, Editor.start(editor, [])), IS_FOCUSED.set(editor, !0), el.focus({
          preventScroll: !0
        });
      }
    }
  },
  getWindow: (editor) => {
    var window2 = EDITOR_TO_WINDOW.get(editor);
    if (!window2)
      throw new Error("Unable to find a host window element for this editor");
    return window2;
  },
  hasDOMNode: function(editor, target) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, {
      editable = !1
    } = options, editorEl = DOMEditor.toDOMNode(editor, editor), targetEl;
    try {
      targetEl = isDOMElement(target) ? target : target.parentElement;
    } catch (err) {
      if (err instanceof Error && !err.message.includes('Permission denied to access property "nodeType"'))
        throw err;
    }
    return targetEl ? closestShadowAware(targetEl, "[data-slate-editor]") === editorEl && (!editable || targetEl.isContentEditable ? !0 : typeof targetEl.isContentEditable == "boolean" && // isContentEditable exists only on HTMLElement, and on other nodes it will be undefined
    // this is the core logic that lets you know you got the right editor.selection instead of null when editor is contenteditable="false"(readOnly)
    closestShadowAware(targetEl, '[contenteditable="false"]') === editorEl || !!targetEl.getAttribute("data-slate-zero-width")) : !1;
  },
  hasEditableTarget: (editor, target) => isDOMNode(target) && DOMEditor.hasDOMNode(editor, target, {
    editable: !0
  }),
  hasRange: (editor, range2) => {
    var {
      anchor,
      focus: focus2
    } = range2;
    return Editor.hasPath(editor, anchor.path) && Editor.hasPath(editor, focus2.path);
  },
  hasSelectableTarget: (editor, target) => DOMEditor.hasEditableTarget(editor, target) || DOMEditor.isTargetInsideNonReadonlyVoid(editor, target),
  hasTarget: (editor, target) => isDOMNode(target) && DOMEditor.hasDOMNode(editor, target),
  insertData: (editor, data) => {
    editor.insertData(data);
  },
  insertFragmentData: (editor, data) => editor.insertFragmentData(data),
  insertTextData: (editor, data) => editor.insertTextData(data),
  isComposing: (editor) => !!IS_COMPOSING.get(editor),
  isFocused: (editor) => !!IS_FOCUSED.get(editor),
  isReadOnly: (editor) => !!IS_READ_ONLY.get(editor),
  isTargetInsideNonReadonlyVoid: (editor, target) => {
    if (IS_READ_ONLY.get(editor)) return !1;
    var slateNode = DOMEditor.hasTarget(editor, target) && DOMEditor.toSlateNode(editor, target);
    return Element$2.isElement(slateNode) && Editor.isVoid(editor, slateNode);
  },
  setFragmentData: (editor, data, originEvent) => editor.setFragmentData(data, originEvent),
  toDOMNode: (editor, node3) => {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor), domNode = Editor.isEditor(node3) ? EDITOR_TO_ELEMENT.get(editor) : KEY_TO_ELEMENT?.get(DOMEditor.findKey(editor, node3));
    if (!domNode)
      throw new Error("Cannot resolve a DOM node from Slate node: ".concat(Scrubber.stringify(node3)));
    return domNode;
  },
  toDOMPoint: (editor, point3) => {
    var [node3] = Editor.node(editor, point3.path), el = DOMEditor.toDOMNode(editor, node3), domPoint;
    Editor.void(editor, {
      at: point3
    }) && (point3 = {
      path: point3.path,
      offset: 0
    });
    for (var selector = "[data-slate-string], [data-slate-zero-width]", texts = Array.from(el.querySelectorAll(selector)), start2 = 0, i = 0; i < texts.length; i++) {
      var text = texts[i], domNode = text.childNodes[0];
      if (!(domNode == null || domNode.textContent == null)) {
        var {
          length
        } = domNode.textContent, attr = text.getAttribute("data-slate-length"), trueLength = attr == null ? length : parseInt(attr, 10), end2 = start2 + trueLength, nextText = texts[i + 1];
        if (point3.offset === end2 && nextText !== null && nextText !== void 0 && nextText.hasAttribute("data-slate-mark-placeholder")) {
          var _nextText$textContent, domText = nextText.childNodes[0];
          domPoint = [
            // COMPAT: If we don't explicity set the dom point to be on the actual
            // dom text element, chrome will put the selection behind the actual dom
            // text element, causing domRange.getBoundingClientRect() calls on a collapsed
            // selection to return incorrect zero values (https://bugs.chromium.org/p/chromium/issues/detail?id=435438)
            // which will cause issues when scrolling to it.
            domText instanceof DOMText ? domText : nextText,
            (_nextText$textContent = nextText.textContent) !== null && _nextText$textContent !== void 0 && _nextText$textContent.startsWith("\uFEFF") ? 1 : 0
          ];
          break;
        }
        if (point3.offset <= end2) {
          var offset = Math.min(length, Math.max(0, point3.offset - start2));
          domPoint = [domNode, offset];
          break;
        }
        start2 = end2;
      }
    }
    if (!domPoint)
      throw new Error("Cannot resolve a DOM point from Slate point: ".concat(Scrubber.stringify(point3)));
    return domPoint;
  },
  toDOMRange: (editor, range2) => {
    var {
      anchor,
      focus: focus2
    } = range2, isBackward = Range.isBackward(range2), domAnchor = DOMEditor.toDOMPoint(editor, anchor), domFocus = Range.isCollapsed(range2) ? domAnchor : DOMEditor.toDOMPoint(editor, focus2), window2 = DOMEditor.getWindow(editor), domRange = window2.document.createRange(), [startNode, startOffset] = isBackward ? domFocus : domAnchor, [endNode, endOffset] = isBackward ? domAnchor : domFocus, startEl = isDOMElement(startNode) ? startNode : startNode.parentElement, isStartAtZeroWidth = !!startEl.getAttribute("data-slate-zero-width"), endEl = isDOMElement(endNode) ? endNode : endNode.parentElement, isEndAtZeroWidth = !!endEl.getAttribute("data-slate-zero-width");
    return domRange.setStart(startNode, isStartAtZeroWidth ? 1 : startOffset), domRange.setEnd(endNode, isEndAtZeroWidth ? 1 : endOffset), domRange;
  },
  toSlateNode: (editor, domNode) => {
    var domEl = isDOMElement(domNode) ? domNode : domNode.parentElement;
    domEl && !domEl.hasAttribute("data-slate-node") && (domEl = domEl.closest("[data-slate-node]"));
    var node3 = domEl ? ELEMENT_TO_NODE.get(domEl) : null;
    if (!node3)
      throw new Error("Cannot resolve a Slate node from DOM node: ".concat(domEl));
    return node3;
  },
  toSlatePoint: (editor, domPoint, options) => {
    var {
      exactMatch,
      suppressThrow,
      searchDirection
    } = options, [nearestNode, nearestOffset] = exactMatch ? domPoint : normalizeDOMPoint(domPoint), parentNode = nearestNode.parentNode, textNode = null, offset = 0;
    if (parentNode) {
      var _domNode$textContent, _domNode$textContent2, editorEl = DOMEditor.toDOMNode(editor, editor), potentialVoidNode = parentNode.closest('[data-slate-void="true"]'), voidNode = potentialVoidNode && containsShadowAware(editorEl, potentialVoidNode) ? potentialVoidNode : null, potentialNonEditableNode = parentNode.closest('[contenteditable="false"]'), nonEditableNode = potentialNonEditableNode && containsShadowAware(editorEl, potentialNonEditableNode) ? potentialNonEditableNode : null, leafNode = parentNode.closest("[data-slate-leaf]"), domNode = null;
      if (leafNode) {
        if (textNode = leafNode.closest('[data-slate-node="text"]'), textNode) {
          var window2 = DOMEditor.getWindow(editor), range2 = window2.document.createRange();
          range2.setStart(textNode, 0), range2.setEnd(nearestNode, nearestOffset);
          var contents = range2.cloneContents(), removals = [...Array.prototype.slice.call(contents.querySelectorAll("[data-slate-zero-width]")), ...Array.prototype.slice.call(contents.querySelectorAll("[contenteditable=false]"))];
          removals.forEach((el) => {
            if (IS_ANDROID && !exactMatch && el.hasAttribute("data-slate-zero-width") && el.textContent.length > 0 && el.textContext !== "\uFEFF") {
              el.textContent.startsWith("\uFEFF") && (el.textContent = el.textContent.slice(1));
              return;
            }
            el.parentNode.removeChild(el);
          }), offset = contents.textContent.length, domNode = textNode;
        }
      } else if (voidNode) {
        for (var leafNodes = voidNode.querySelectorAll("[data-slate-leaf]"), index = 0; index < leafNodes.length; index++) {
          var current = leafNodes[index];
          if (DOMEditor.hasDOMNode(editor, current)) {
            leafNode = current;
            break;
          }
        }
        leafNode ? (textNode = leafNode.closest('[data-slate-node="text"]'), domNode = leafNode, offset = domNode.textContent.length, domNode.querySelectorAll("[data-slate-zero-width]").forEach((el) => {
          offset -= el.textContent.length;
        })) : offset = 1;
      } else if (nonEditableNode) {
        var getLeafNodes = (node4) => node4 ? node4.querySelectorAll(
          // Exclude leaf nodes in nested editors
          "[data-slate-leaf]:not(:scope [data-slate-editor] [data-slate-leaf])"
        ) : [], elementNode = nonEditableNode.closest('[data-slate-node="element"]');
        if (searchDirection === "backward" || !searchDirection) {
          var _leafNodes$findLast, _leafNodes = [...getLeafNodes(elementNode?.previousElementSibling), ...getLeafNodes(elementNode)];
          leafNode = (_leafNodes$findLast = _leafNodes.findLast((leaf3) => isBefore(nonEditableNode, leaf3))) !== null && _leafNodes$findLast !== void 0 ? _leafNodes$findLast : null;
        }
        if (searchDirection === "forward" || !searchDirection) {
          var _leafNodes2$find, _leafNodes2 = [...getLeafNodes(elementNode), ...getLeafNodes(elementNode?.nextElementSibling)];
          leafNode = (_leafNodes2$find = _leafNodes2.find((leaf3) => isAfter(nonEditableNode, leaf3))) !== null && _leafNodes2$find !== void 0 ? _leafNodes2$find : null;
        }
        leafNode && (textNode = leafNode.closest('[data-slate-node="text"]'), domNode = leafNode, searchDirection === "forward" ? offset = 0 : (offset = domNode.textContent.length, domNode.querySelectorAll("[data-slate-zero-width]").forEach((el) => {
          offset -= el.textContent.length;
        })));
      }
      domNode && offset === domNode.textContent.length && // COMPAT: Android IMEs might remove the zero width space while composing,
      // and we don't add it for line-breaks.
      IS_ANDROID && domNode.getAttribute("data-slate-zero-width") === "z" && (_domNode$textContent = domNode.textContent) !== null && _domNode$textContent !== void 0 && _domNode$textContent.startsWith("\uFEFF") && // COMPAT: If the parent node is a Slate zero-width space, editor is
      // because the text node should have no characters. However, during IME
      // composition the ASCII characters will be prepended to the zero-width
      // space, so subtract 1 from the offset to account for the zero-width
      // space character.
      (parentNode.hasAttribute("data-slate-zero-width") || // COMPAT: In Firefox, `range.cloneContents()` returns an extra trailing '\n'
      // when the document ends with a new-line character. This results in the offset
      // length being off by one, so we need to subtract one to account for this.
      IS_FIREFOX && (_domNode$textContent2 = domNode.textContent) !== null && _domNode$textContent2 !== void 0 && _domNode$textContent2.endsWith(`

`)) && offset--;
    }
    if (IS_ANDROID && !textNode && !exactMatch) {
      var node3 = parentNode.hasAttribute("data-slate-node") ? parentNode : parentNode.closest("[data-slate-node]");
      if (node3 && DOMEditor.hasDOMNode(editor, node3, {
        editable: !0
      })) {
        var _slateNode = DOMEditor.toSlateNode(editor, node3), {
          path: _path,
          offset: _offset
        } = Editor.start(editor, DOMEditor.findPath(editor, _slateNode));
        return node3.querySelector("[data-slate-leaf]") || (_offset = nearestOffset), {
          path: _path,
          offset: _offset
        };
      }
    }
    if (!textNode) {
      if (suppressThrow)
        return null;
      throw new Error("Cannot resolve a Slate point from DOM point: ".concat(domPoint));
    }
    var slateNode = DOMEditor.toSlateNode(editor, textNode), path3 = DOMEditor.findPath(editor, slateNode);
    return {
      path: path3,
      offset
    };
  },
  toSlateRange: (editor, domRange, options) => {
    var _focusNode$textConten, {
      exactMatch,
      suppressThrow
    } = options, el = isDOMSelection(domRange) ? domRange.anchorNode : domRange.startContainer, anchorNode, anchorOffset, focusNode, focusOffset, isCollapsed;
    if (el)
      if (isDOMSelection(domRange)) {
        if (IS_FIREFOX && domRange.rangeCount > 1) {
          focusNode = domRange.focusNode;
          var firstRange = domRange.getRangeAt(0), lastRange = domRange.getRangeAt(domRange.rangeCount - 1);
          if (focusNode instanceof HTMLTableRowElement && firstRange.startContainer instanceof HTMLTableRowElement && lastRange.startContainer instanceof HTMLTableRowElement) {
            let getLastChildren = function(element) {
              return element.childElementCount > 0 ? getLastChildren(element.children[0]) : element;
            };
            var firstNodeRow = firstRange.startContainer, lastNodeRow = lastRange.startContainer, firstNode = getLastChildren(firstNodeRow.children[firstRange.startOffset]), lastNode = getLastChildren(lastNodeRow.children[lastRange.startOffset]);
            focusOffset = 0, lastNode.childNodes.length > 0 ? anchorNode = lastNode.childNodes[0] : anchorNode = lastNode, firstNode.childNodes.length > 0 ? focusNode = firstNode.childNodes[0] : focusNode = firstNode, lastNode instanceof HTMLElement ? anchorOffset = lastNode.innerHTML.length : anchorOffset = 0;
          } else
            firstRange.startContainer === focusNode ? (anchorNode = lastRange.endContainer, anchorOffset = lastRange.endOffset, focusOffset = firstRange.startOffset) : (anchorNode = firstRange.startContainer, anchorOffset = firstRange.endOffset, focusOffset = lastRange.startOffset);
        } else
          anchorNode = domRange.anchorNode, anchorOffset = domRange.anchorOffset, focusNode = domRange.focusNode, focusOffset = domRange.focusOffset;
        IS_CHROME && hasShadowRoot(anchorNode) || IS_FIREFOX ? isCollapsed = domRange.anchorNode === domRange.focusNode && domRange.anchorOffset === domRange.focusOffset : isCollapsed = domRange.isCollapsed;
      } else
        anchorNode = domRange.startContainer, anchorOffset = domRange.startOffset, focusNode = domRange.endContainer, focusOffset = domRange.endOffset, isCollapsed = domRange.collapsed;
    if (anchorNode == null || focusNode == null || anchorOffset == null || focusOffset == null)
      throw new Error("Cannot resolve a Slate range from DOM range: ".concat(domRange));
    IS_FIREFOX && (_focusNode$textConten = focusNode.textContent) !== null && _focusNode$textConten !== void 0 && _focusNode$textConten.endsWith(`

`) && focusOffset === focusNode.textContent.length && focusOffset--;
    var anchor = DOMEditor.toSlatePoint(editor, [anchorNode, anchorOffset], {
      exactMatch,
      suppressThrow
    });
    if (!anchor)
      return null;
    var focusBeforeAnchor = isBefore(anchorNode, focusNode) || anchorNode === focusNode && focusOffset < anchorOffset, focus2 = isCollapsed ? anchor : DOMEditor.toSlatePoint(editor, [focusNode, focusOffset], {
      exactMatch,
      suppressThrow,
      searchDirection: focusBeforeAnchor ? "forward" : "backward"
    });
    if (!focus2)
      return null;
    var range2 = {
      anchor,
      focus: focus2
    };
    return Range.isExpanded(range2) && Range.isForward(range2) && isDOMElement(focusNode) && Editor.void(editor, {
      at: range2.focus,
      mode: "highest"
    }) && (range2 = Editor.unhangRange(editor, range2, {
      voids: !0
    })), range2;
  }
};
function verifyDiffState(editor, textDiff) {
  var {
    path: path3,
    diff: diff2
  } = textDiff;
  if (!Editor.hasPath(editor, path3))
    return !1;
  var node3 = Node.get(editor, path3);
  if (!Text$1.isText(node3))
    return !1;
  if (diff2.start !== node3.text.length || diff2.text.length === 0)
    return node3.text.slice(diff2.start, diff2.start + diff2.text.length) === diff2.text;
  var nextPath = Path.next(path3);
  if (!Editor.hasPath(editor, nextPath))
    return !1;
  var nextNode = Node.get(editor, nextPath);
  return Text$1.isText(nextNode) && nextNode.text.startsWith(diff2.text);
}
function applyStringDiff(text) {
  for (var _len = arguments.length, diffs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)
    diffs[_key - 1] = arguments[_key];
  return diffs.reduce((text2, diff2) => text2.slice(0, diff2.start) + diff2.text + text2.slice(diff2.end), text);
}
function longestCommonPrefixLength(str, another) {
  for (var length = Math.min(str.length, another.length), i = 0; i < length; i++)
    if (str.charAt(i) !== another.charAt(i))
      return i;
  return length;
}
function longestCommonSuffixLength(str, another, max) {
  for (var length = Math.min(str.length, another.length, max), i = 0; i < length; i++)
    if (str.charAt(str.length - i - 1) !== another.charAt(another.length - i - 1))
      return i;
  return length;
}
function normalizeStringDiff(targetText, diff2) {
  var {
    start: start2,
    end: end2,
    text
  } = diff2, removedText = targetText.slice(start2, end2), prefixLength = longestCommonPrefixLength(removedText, text), max = Math.min(removedText.length - prefixLength, text.length - prefixLength), suffixLength = longestCommonSuffixLength(removedText, text, max), normalized = {
    start: start2 + prefixLength,
    end: end2 - suffixLength,
    text: text.slice(prefixLength, text.length - suffixLength)
  };
  return normalized.start === normalized.end && normalized.text.length === 0 ? null : normalized;
}
function mergeStringDiffs(targetText, a, b) {
  var start2 = Math.min(a.start, b.start), overlap = Math.max(0, Math.min(a.start + a.text.length, b.end) - b.start), applied = applyStringDiff(targetText, a, b), sliceEnd = Math.max(b.start + b.text.length, a.start + a.text.length + (a.start + a.text.length > b.start ? b.text.length : 0) - overlap), text = applied.slice(start2, sliceEnd), end2 = Math.max(a.end, b.end - a.text.length + (a.end - a.start));
  return normalizeStringDiff(targetText, {
    start: start2,
    end: end2,
    text
  });
}
function targetRange(textDiff) {
  var {
    path: path3,
    diff: diff2
  } = textDiff;
  return {
    anchor: {
      path: path3,
      offset: diff2.start
    },
    focus: {
      path: path3,
      offset: diff2.end
    }
  };
}
function normalizePoint$1(editor, point3) {
  var {
    path: path3,
    offset
  } = point3;
  if (!Editor.hasPath(editor, path3))
    return null;
  var leaf3 = Node.get(editor, path3);
  if (!Text$1.isText(leaf3))
    return null;
  var parentBlock = Editor.above(editor, {
    match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
    at: path3
  });
  if (!parentBlock)
    return null;
  for (; offset > leaf3.text.length; ) {
    var entry = Editor.next(editor, {
      at: path3,
      match: Text$1.isText
    });
    if (!entry || !Path.isDescendant(entry[1], parentBlock[1]))
      return null;
    offset -= leaf3.text.length, leaf3 = entry[0], path3 = entry[1];
  }
  return {
    path: path3,
    offset
  };
}
function normalizeRange(editor, range2) {
  var anchor = normalizePoint$1(editor, range2.anchor);
  if (!anchor)
    return null;
  if (Range.isCollapsed(range2))
    return {
      anchor,
      focus: anchor
    };
  var focus2 = normalizePoint$1(editor, range2.focus);
  return focus2 ? {
    anchor,
    focus: focus2
  } : null;
}
function transformPendingPoint(editor, point3, op) {
  var pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(editor), textDiff = pendingDiffs?.find((_ref) => {
    var {
      path: path3
    } = _ref;
    return Path.equals(path3, point3.path);
  });
  if (!textDiff || point3.offset <= textDiff.diff.start)
    return Point.transform(point3, op, {
      affinity: "backward"
    });
  var {
    diff: diff2
  } = textDiff;
  if (point3.offset <= diff2.start + diff2.text.length) {
    var _anchor = {
      path: point3.path,
      offset: diff2.start
    }, _transformed = Point.transform(_anchor, op, {
      affinity: "backward"
    });
    return _transformed ? {
      path: _transformed.path,
      offset: _transformed.offset + point3.offset - diff2.start
    } : null;
  }
  var anchor = {
    path: point3.path,
    offset: point3.offset - diff2.text.length + diff2.end - diff2.start
  }, transformed = Point.transform(anchor, op, {
    affinity: "backward"
  });
  return transformed ? op.type === "split_node" && Path.equals(op.path, point3.path) && anchor.offset < op.position && diff2.start < op.position ? transformed : {
    path: transformed.path,
    offset: transformed.offset + diff2.text.length - diff2.end + diff2.start
  } : null;
}
function transformPendingRange(editor, range2, op) {
  var anchor = transformPendingPoint(editor, range2.anchor, op);
  if (!anchor)
    return null;
  if (Range.isCollapsed(range2))
    return {
      anchor,
      focus: anchor
    };
  var focus2 = transformPendingPoint(editor, range2.focus, op);
  return focus2 ? {
    anchor,
    focus: focus2
  } : null;
}
function transformTextDiff(textDiff, op) {
  var {
    path: path3,
    diff: diff2,
    id
  } = textDiff;
  switch (op.type) {
    case "insert_text":
      return !Path.equals(op.path, path3) || op.offset >= diff2.end ? textDiff : op.offset <= diff2.start ? {
        diff: {
          start: op.text.length + diff2.start,
          end: op.text.length + diff2.end,
          text: diff2.text
        },
        id,
        path: path3
      } : {
        diff: {
          start: diff2.start,
          end: diff2.end + op.text.length,
          text: diff2.text
        },
        id,
        path: path3
      };
    case "remove_text":
      return !Path.equals(op.path, path3) || op.offset >= diff2.end ? textDiff : op.offset + op.text.length <= diff2.start ? {
        diff: {
          start: diff2.start - op.text.length,
          end: diff2.end - op.text.length,
          text: diff2.text
        },
        id,
        path: path3
      } : {
        diff: {
          start: diff2.start,
          end: diff2.end - op.text.length,
          text: diff2.text
        },
        id,
        path: path3
      };
    case "split_node":
      return !Path.equals(op.path, path3) || op.position >= diff2.end ? {
        diff: diff2,
        id,
        path: Path.transform(path3, op, {
          affinity: "backward"
        })
      } : op.position > diff2.start ? {
        diff: {
          start: diff2.start,
          end: Math.min(op.position, diff2.end),
          text: diff2.text
        },
        id,
        path: path3
      } : {
        diff: {
          start: diff2.start - op.position,
          end: diff2.end - op.position,
          text: diff2.text
        },
        id,
        path: Path.transform(path3, op, {
          affinity: "forward"
        })
      };
    case "merge_node":
      return Path.equals(op.path, path3) ? {
        diff: {
          start: diff2.start + op.position,
          end: diff2.end + op.position,
          text: diff2.text
        },
        id,
        path: Path.transform(path3, op)
      } : {
        diff: diff2,
        id,
        path: Path.transform(path3, op)
      };
  }
  var newPath = Path.transform(path3, op);
  return newPath ? {
    diff: diff2,
    path: newPath,
    id
  } : null;
}
var doRectsIntersect = (rect, compareRect) => {
  var middle = (compareRect.top + compareRect.bottom) / 2;
  return rect.top <= middle && rect.bottom >= middle;
}, areRangesSameLine = (editor, range1, range2) => {
  var rect1 = DOMEditor.toDOMRange(editor, range1).getBoundingClientRect(), rect2 = DOMEditor.toDOMRange(editor, range2).getBoundingClientRect();
  return doRectsIntersect(rect1, rect2) && doRectsIntersect(rect2, rect1);
}, findCurrentLineRange$1 = (editor, parentRange) => {
  var parentRangeBoundary = Editor.range(editor, Range.end(parentRange)), positions2 = Array.from(Editor.positions(editor, {
    at: parentRange
  })), left = 0, right = positions2.length, middle = Math.floor(right / 2);
  if (areRangesSameLine(editor, Editor.range(editor, positions2[left]), parentRangeBoundary))
    return Editor.range(editor, positions2[left], parentRangeBoundary);
  if (positions2.length < 2)
    return Editor.range(editor, positions2[positions2.length - 1], parentRangeBoundary);
  for (; middle !== positions2.length && middle !== left; )
    areRangesSameLine(editor, Editor.range(editor, positions2[middle]), parentRangeBoundary) ? right = middle : left = middle, middle = Math.floor((left + right) / 2);
  return Editor.range(editor, positions2[left], parentRangeBoundary);
};
function ownKeys$1$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$1$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$1$1(Object(t2), !0).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$1$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var withDOM = function(editor) {
  var clipboardFormatKey = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "x-slate-fragment", e2 = editor, {
    apply: apply2,
    onChange,
    deleteBackward: deleteBackward2,
    addMark: addMark2,
    removeMark: removeMark2
  } = e2;
  return EDITOR_TO_KEY_TO_ELEMENT.set(e2, /* @__PURE__ */ new WeakMap()), e2.addMark = (key, value) => {
    var _EDITOR_TO_SCHEDULE_F, _EDITOR_TO_PENDING_DI;
    (_EDITOR_TO_SCHEDULE_F = EDITOR_TO_SCHEDULE_FLUSH.get(e2)) === null || _EDITOR_TO_SCHEDULE_F === void 0 || _EDITOR_TO_SCHEDULE_F(), !EDITOR_TO_PENDING_INSERTION_MARKS.get(e2) && (_EDITOR_TO_PENDING_DI = EDITOR_TO_PENDING_DIFFS.get(e2)) !== null && _EDITOR_TO_PENDING_DI !== void 0 && _EDITOR_TO_PENDING_DI.length && EDITOR_TO_PENDING_INSERTION_MARKS.set(e2, null), EDITOR_TO_USER_MARKS.delete(e2), addMark2(key, value);
  }, e2.removeMark = (key) => {
    var _EDITOR_TO_PENDING_DI2;
    !EDITOR_TO_PENDING_INSERTION_MARKS.get(e2) && (_EDITOR_TO_PENDING_DI2 = EDITOR_TO_PENDING_DIFFS.get(e2)) !== null && _EDITOR_TO_PENDING_DI2 !== void 0 && _EDITOR_TO_PENDING_DI2.length && EDITOR_TO_PENDING_INSERTION_MARKS.set(e2, null), EDITOR_TO_USER_MARKS.delete(e2), removeMark2(key);
  }, e2.deleteBackward = (unit) => {
    if (unit !== "line")
      return deleteBackward2(unit);
    if (e2.selection && Range.isCollapsed(e2.selection)) {
      var parentBlockEntry = Editor.above(e2, {
        match: (n2) => Element$2.isElement(n2) && Editor.isBlock(e2, n2),
        at: e2.selection
      });
      if (parentBlockEntry) {
        var [, parentBlockPath] = parentBlockEntry, parentElementRange = Editor.range(e2, parentBlockPath, e2.selection.anchor), currentLineRange = findCurrentLineRange$1(e2, parentElementRange);
        Range.isCollapsed(currentLineRange) || Transforms.delete(e2, {
          at: currentLineRange
        });
      }
    }
  }, e2.apply = (op) => {
    var matches = [], pathRefMatches = [], pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(e2);
    if (pendingDiffs != null && pendingDiffs.length) {
      var transformed = pendingDiffs.map((textDiff) => transformTextDiff(textDiff, op)).filter(Boolean);
      EDITOR_TO_PENDING_DIFFS.set(e2, transformed);
    }
    var pendingSelection = EDITOR_TO_PENDING_SELECTION.get(e2);
    pendingSelection && EDITOR_TO_PENDING_SELECTION.set(e2, transformPendingRange(e2, pendingSelection, op));
    var pendingAction = EDITOR_TO_PENDING_ACTION.get(e2);
    if (pendingAction != null && pendingAction.at) {
      var at = Point.isPoint(pendingAction?.at) ? transformPendingPoint(e2, pendingAction.at, op) : transformPendingRange(e2, pendingAction.at, op);
      EDITOR_TO_PENDING_ACTION.set(e2, at ? _objectSpread$1$1(_objectSpread$1$1({}, pendingAction), {}, {
        at
      }) : null);
    }
    switch (op.type) {
      case "insert_text":
      case "remove_text":
      case "set_node":
      case "split_node": {
        matches.push(...getMatches(e2, op.path));
        break;
      }
      case "set_selection": {
        var _EDITOR_TO_USER_SELEC;
        (_EDITOR_TO_USER_SELEC = EDITOR_TO_USER_SELECTION.get(e2)) === null || _EDITOR_TO_USER_SELEC === void 0 || _EDITOR_TO_USER_SELEC.unref(), EDITOR_TO_USER_SELECTION.delete(e2);
        break;
      }
      case "insert_node":
      case "remove_node": {
        matches.push(...getMatches(e2, Path.parent(op.path)));
        break;
      }
      case "merge_node": {
        var prevPath = Path.previous(op.path);
        matches.push(...getMatches(e2, prevPath));
        break;
      }
      case "move_node": {
        var commonPath = Path.common(Path.parent(op.path), Path.parent(op.newPath));
        matches.push(...getMatches(e2, commonPath));
        var changedPath;
        Path.isBefore(op.path, op.newPath) ? (matches.push(...getMatches(e2, Path.parent(op.path))), changedPath = op.newPath) : (matches.push(...getMatches(e2, Path.parent(op.newPath))), changedPath = op.path);
        var changedNode = Node.get(editor, Path.parent(changedPath)), changedNodeKey = DOMEditor.findKey(e2, changedNode), changedPathRef = Editor.pathRef(e2, Path.parent(changedPath));
        pathRefMatches.push([changedPathRef, changedNodeKey]);
        break;
      }
    }
    switch (apply2(op), op.type) {
      case "insert_node":
      case "remove_node":
      case "merge_node":
      case "move_node":
      case "split_node":
      case "insert_text":
      case "remove_text":
      case "set_selection":
        IS_NODE_MAP_DIRTY.set(e2, !0);
    }
    for (var [path3, key] of matches) {
      var [node3] = Editor.node(e2, path3);
      NODE_TO_KEY.set(node3, key);
    }
    for (var [pathRef3, _key] of pathRefMatches) {
      if (pathRef3.current) {
        var [_node] = Editor.node(e2, pathRef3.current);
        NODE_TO_KEY.set(_node, _key);
      }
      pathRef3.unref();
    }
  }, e2.setFragmentData = (data) => {
    var {
      selection
    } = e2;
    if (selection) {
      var [start2, end2] = Range.edges(selection), startVoid = Editor.void(e2, {
        at: start2.path
      }), endVoid = Editor.void(e2, {
        at: end2.path
      });
      if (!(Range.isCollapsed(selection) && !startVoid)) {
        var domRange = DOMEditor.toDOMRange(e2, selection), contents = domRange.cloneContents(), attach = contents.childNodes[0];
        if (contents.childNodes.forEach((node3) => {
          node3.textContent && node3.textContent.trim() !== "" && (attach = node3);
        }), endVoid) {
          var [voidNode] = endVoid, r2 = domRange.cloneRange(), domNode = DOMEditor.toDOMNode(e2, voidNode);
          r2.setEndAfter(domNode), contents = r2.cloneContents();
        }
        if (startVoid && (attach = contents.querySelector("[data-slate-spacer]")), Array.from(contents.querySelectorAll("[data-slate-zero-width]")).forEach((zw) => {
          var isNewline = zw.getAttribute("data-slate-zero-width") === "n";
          zw.textContent = isNewline ? `
` : "";
        }), isDOMText(attach)) {
          var span = attach.ownerDocument.createElement("span");
          span.style.whiteSpace = "pre", span.appendChild(attach), contents.appendChild(span), attach = span;
        }
        var fragment2 = e2.getFragment(), string3 = JSON.stringify(fragment2), encoded = window.btoa(encodeURIComponent(string3));
        attach.setAttribute("data-slate-fragment", encoded), data.setData("application/".concat(clipboardFormatKey), encoded);
        var div = contents.ownerDocument.createElement("div");
        return div.appendChild(contents), div.setAttribute("hidden", "true"), contents.ownerDocument.body.appendChild(div), data.setData("text/html", div.innerHTML), data.setData("text/plain", getPlainText(div)), contents.ownerDocument.body.removeChild(div), data;
      }
    }
  }, e2.insertData = (data) => {
    e2.insertFragmentData(data) || e2.insertTextData(data);
  }, e2.insertFragmentData = (data) => {
    var fragment2 = data.getData("application/".concat(clipboardFormatKey)) || getSlateFragmentAttribute(data);
    if (fragment2) {
      var decoded = decodeURIComponent(window.atob(fragment2)), parsed = JSON.parse(decoded);
      return e2.insertFragment(parsed), !0;
    }
    return !1;
  }, e2.insertTextData = (data) => {
    var text = data.getData("text/plain");
    if (text) {
      var lines = text.split(/\r\n|\r|\n/), split = !1;
      for (var line of lines)
        split && Transforms.splitNodes(e2, {
          always: !0
        }), e2.insertText(line), split = !0;
      return !0;
    }
    return !1;
  }, e2.onChange = (options) => {
    var onContextChange = EDITOR_TO_ON_CHANGE.get(e2);
    onContextChange && onContextChange(options), onChange(options);
  }, e2;
}, getMatches = (e2, path3) => {
  var matches = [];
  for (var [n2, p] of Editor.levels(e2, {
    at: path3
  })) {
    var key = DOMEditor.findKey(e2, n2);
    matches.push([p, key]);
  }
  return matches;
}, TRIPLE_CLICK = 3, HOTKEYS = {
  bold: "mod+b",
  compose: ["down", "left", "right", "up", "backspace", "enter"],
  moveBackward: "left",
  moveForward: "right",
  moveWordBackward: "ctrl+left",
  moveWordForward: "ctrl+right",
  deleteBackward: "shift?+backspace",
  deleteForward: "shift?+delete",
  extendBackward: "shift+left",
  extendForward: "shift+right",
  italic: "mod+i",
  insertSoftBreak: "shift+enter",
  splitBlock: "enter",
  undo: "mod+z"
}, APPLE_HOTKEYS = {
  moveLineBackward: "opt+up",
  moveLineForward: "opt+down",
  moveWordBackward: "opt+left",
  moveWordForward: "opt+right",
  deleteBackward: ["ctrl+backspace", "ctrl+h"],
  deleteForward: ["ctrl+delete", "ctrl+d"],
  deleteLineBackward: "cmd+shift?+backspace",
  deleteLineForward: ["cmd+shift?+delete", "ctrl+k"],
  deleteWordBackward: "opt+shift?+backspace",
  deleteWordForward: "opt+shift?+delete",
  extendLineBackward: "opt+shift+up",
  extendLineForward: "opt+shift+down",
  redo: "cmd+shift+z",
  transposeCharacter: "ctrl+t"
}, WINDOWS_HOTKEYS = {
  deleteWordBackward: "ctrl+shift?+backspace",
  deleteWordForward: "ctrl+shift?+delete",
  redo: ["ctrl+y", "ctrl+shift+z"]
}, create = (key) => {
  var generic = HOTKEYS[key], apple = APPLE_HOTKEYS[key], windows = WINDOWS_HOTKEYS[key], isGeneric = generic && libExports.isHotkey(generic), isApple = apple && libExports.isHotkey(apple), isWindows = windows && libExports.isHotkey(windows);
  return (event) => !!(isGeneric && isGeneric(event) || IS_APPLE && isApple && isApple(event) || !IS_APPLE && isWindows && isWindows(event));
}, hotkeys = {
  isBold: create("bold"),
  isCompose: create("compose"),
  isMoveBackward: create("moveBackward"),
  isMoveForward: create("moveForward"),
  isDeleteBackward: create("deleteBackward"),
  isDeleteForward: create("deleteForward"),
  isDeleteLineBackward: create("deleteLineBackward"),
  isDeleteLineForward: create("deleteLineForward"),
  isDeleteWordBackward: create("deleteWordBackward"),
  isDeleteWordForward: create("deleteWordForward"),
  isExtendBackward: create("extendBackward"),
  isExtendForward: create("extendForward"),
  isExtendLineBackward: create("extendLineBackward"),
  isExtendLineForward: create("extendLineForward"),
  isItalic: create("italic"),
  isMoveLineBackward: create("moveLineBackward"),
  isMoveLineForward: create("moveLineForward"),
  isMoveWordBackward: create("moveWordBackward"),
  isMoveWordForward: create("moveWordForward"),
  isRedo: create("redo"),
  isSoftBreak: create("insertSoftBreak"),
  isSplitBlock: create("splitBlock"),
  isTransposeCharacter: create("transposeCharacter"),
  isUndo: create("undo")
};
function _objectWithoutPropertiesLoose$1(source, excluded) {
  if (source == null) return {};
  var target = {}, sourceKeys = Object.keys(source), key, i;
  for (i = 0; i < sourceKeys.length; i++)
    key = sourceKeys[i], !(excluded.indexOf(key) >= 0) && (target[key] = source[key]);
  return target;
}
function _objectWithoutProperties$1(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose$1(source, excluded), key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++)
      key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
  }
  return target;
}
var _excluded$3 = ["anchor", "focus"], _excluded2$1 = ["anchor", "focus"];
function ownKeys$8(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$8(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$8(Object(t2), !0).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$8(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var shallowCompare = (obj1, obj2) => Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]), isDecorationFlagsEqual = (range2, other) => {
  var rangeOwnProps = _objectWithoutProperties$1(range2, _excluded$3), otherOwnProps = _objectWithoutProperties$1(other, _excluded2$1);
  return range2[PLACEHOLDER_SYMBOL] === other[PLACEHOLDER_SYMBOL] && shallowCompare(rangeOwnProps, otherOwnProps);
}, isElementDecorationsEqual = (list, another) => {
  if (list === another)
    return !0;
  if (!list || !another || list.length !== another.length)
    return !1;
  for (var i = 0; i < list.length; i++) {
    var range2 = list[i], other = another[i];
    if (!Range.equals(range2, other) || !isDecorationFlagsEqual(range2, other))
      return !1;
  }
  return !0;
}, isTextDecorationsEqual = (list, another) => {
  if (list === another)
    return !0;
  if (!list || !another || list.length !== another.length)
    return !1;
  for (var i = 0; i < list.length; i++) {
    var range2 = list[i], other = another[i];
    if (range2.anchor.offset !== other.anchor.offset || range2.focus.offset !== other.focus.offset || !isDecorationFlagsEqual(range2, other))
      return !1;
  }
  return !0;
}, splitDecorationsByChild = (editor, node3, decorations) => {
  var decorationsByChild = Array.from(node3.children, () => []);
  if (decorations.length === 0)
    return decorationsByChild;
  var path3 = DOMEditor.findPath(editor, node3), level = path3.length, ancestorRange = Editor.range(editor, path3), cachedChildRanges = new Array(node3.children.length), getChildRange = (index) => {
    var cachedRange = cachedChildRanges[index];
    if (cachedRange) return cachedRange;
    var childRange2 = Editor.range(editor, [...path3, index]);
    return cachedChildRanges[index] = childRange2, childRange2;
  };
  for (var decoration of decorations) {
    var decorationRange = Range.intersection(ancestorRange, decoration);
    if (decorationRange)
      for (var [startPoint, endPoint] = Range.edges(decorationRange), startIndex = startPoint.path[level], endIndex = endPoint.path[level], i = startIndex; i <= endIndex; i++) {
        var ds = decorationsByChild[i];
        if (ds) {
          var childRange = getChildRange(i), childDecorationRange = Range.intersection(childRange, decoration);
          childDecorationRange && ds.push(_objectSpread$8(_objectSpread$8({}, decoration), childDecorationRange));
        }
      }
  }
  return decorationsByChild;
}, resizeObservers = [], hasActiveObservations = function() {
  return resizeObservers.some(function(ro) {
    return ro.activeTargets.length > 0;
  });
}, hasSkippedObservations = function() {
  return resizeObservers.some(function(ro) {
    return ro.skippedTargets.length > 0;
  });
}, msg = "ResizeObserver loop completed with undelivered notifications.", deliverResizeLoopError = function() {
  var event;
  typeof ErrorEvent == "function" ? event = new ErrorEvent("error", {
    message: msg
  }) : (event = document.createEvent("Event"), event.initEvent("error", !1, !1), event.message = msg), window.dispatchEvent(event);
}, ResizeObserverBoxOptions;
(function(ResizeObserverBoxOptions2) {
  ResizeObserverBoxOptions2.BORDER_BOX = "border-box", ResizeObserverBoxOptions2.CONTENT_BOX = "content-box", ResizeObserverBoxOptions2.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box";
})(ResizeObserverBoxOptions || (ResizeObserverBoxOptions = {}));
var freeze = function(obj) {
  return Object.freeze(obj);
}, ResizeObserverSize = /* @__PURE__ */ (function() {
  function ResizeObserverSize2(inlineSize, blockSize) {
    this.inlineSize = inlineSize, this.blockSize = blockSize, freeze(this);
  }
  return ResizeObserverSize2;
})(), DOMRectReadOnly = (function() {
  function DOMRectReadOnly2(x, y, width, height) {
    return this.x = x, this.y = y, this.width = width, this.height = height, this.top = this.y, this.left = this.x, this.bottom = this.top + this.height, this.right = this.left + this.width, freeze(this);
  }
  return DOMRectReadOnly2.prototype.toJSON = function() {
    var _a = this, x = _a.x, y = _a.y, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left, width = _a.width, height = _a.height;
    return {
      x,
      y,
      top,
      right,
      bottom,
      left,
      width,
      height
    };
  }, DOMRectReadOnly2.fromRect = function(rectangle) {
    return new DOMRectReadOnly2(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  }, DOMRectReadOnly2;
})(), isSVG = function(target) {
  return target instanceof SVGElement && "getBBox" in target;
}, isHidden = function(target) {
  if (isSVG(target)) {
    var _a = target.getBBox(), width = _a.width, height = _a.height;
    return !width && !height;
  }
  var _b = target, offsetWidth = _b.offsetWidth, offsetHeight = _b.offsetHeight;
  return !(offsetWidth || offsetHeight || target.getClientRects().length);
}, isElement2 = function(obj) {
  var _a;
  if (obj instanceof Element)
    return !0;
  var scope = (_a = obj?.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView;
  return !!(scope && obj instanceof scope.Element);
}, isReplacedElement = function(target) {
  switch (target.tagName) {
    case "INPUT":
      if (target.type !== "image")
        break;
    case "VIDEO":
    case "AUDIO":
    case "EMBED":
    case "OBJECT":
    case "CANVAS":
    case "IFRAME":
    case "IMG":
      return !0;
  }
  return !1;
}, global$1 = typeof window < "u" ? window : {}, cache = /* @__PURE__ */ new WeakMap(), scrollRegexp = /auto|scroll/, verticalRegexp = /^tb|vertical/, IE = /msie|trident/i.test(global$1.navigator && global$1.navigator.userAgent), parseDimension = function(pixel) {
  return parseFloat(pixel || "0");
}, size = function(inlineSize, blockSize, switchSizes) {
  return inlineSize === void 0 && (inlineSize = 0), blockSize === void 0 && (blockSize = 0), switchSizes === void 0 && (switchSizes = !1), new ResizeObserverSize((switchSizes ? blockSize : inlineSize) || 0, (switchSizes ? inlineSize : blockSize) || 0);
}, zeroBoxes = freeze({
  devicePixelContentBoxSize: size(),
  borderBoxSize: size(),
  contentBoxSize: size(),
  contentRect: new DOMRectReadOnly(0, 0, 0, 0)
}), calculateBoxSizes = function(target, forceRecalculation) {
  if (forceRecalculation === void 0 && (forceRecalculation = !1), cache.has(target) && !forceRecalculation)
    return cache.get(target);
  if (isHidden(target))
    return cache.set(target, zeroBoxes), zeroBoxes;
  var cs = getComputedStyle(target), svg = isSVG(target) && target.ownerSVGElement && target.getBBox(), removePadding = !IE && cs.boxSizing === "border-box", switchSizes = verticalRegexp.test(cs.writingMode || ""), canScrollVertically = !svg && scrollRegexp.test(cs.overflowY || ""), canScrollHorizontally = !svg && scrollRegexp.test(cs.overflowX || ""), paddingTop = svg ? 0 : parseDimension(cs.paddingTop), paddingRight = svg ? 0 : parseDimension(cs.paddingRight), paddingBottom = svg ? 0 : parseDimension(cs.paddingBottom), paddingLeft = svg ? 0 : parseDimension(cs.paddingLeft), borderTop = svg ? 0 : parseDimension(cs.borderTopWidth), borderRight = svg ? 0 : parseDimension(cs.borderRightWidth), borderBottom = svg ? 0 : parseDimension(cs.borderBottomWidth), borderLeft = svg ? 0 : parseDimension(cs.borderLeftWidth), horizontalPadding = paddingLeft + paddingRight, verticalPadding = paddingTop + paddingBottom, horizontalBorderArea = borderLeft + borderRight, verticalBorderArea = borderTop + borderBottom, horizontalScrollbarThickness = canScrollHorizontally ? target.offsetHeight - verticalBorderArea - target.clientHeight : 0, verticalScrollbarThickness = canScrollVertically ? target.offsetWidth - horizontalBorderArea - target.clientWidth : 0, widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0, heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0, contentWidth = svg ? svg.width : parseDimension(cs.width) - widthReduction - verticalScrollbarThickness, contentHeight = svg ? svg.height : parseDimension(cs.height) - heightReduction - horizontalScrollbarThickness, borderBoxWidth = contentWidth + horizontalPadding + verticalScrollbarThickness + horizontalBorderArea, borderBoxHeight = contentHeight + verticalPadding + horizontalScrollbarThickness + verticalBorderArea, boxes = freeze({
    devicePixelContentBoxSize: size(Math.round(contentWidth * devicePixelRatio), Math.round(contentHeight * devicePixelRatio), switchSizes),
    borderBoxSize: size(borderBoxWidth, borderBoxHeight, switchSizes),
    contentBoxSize: size(contentWidth, contentHeight, switchSizes),
    contentRect: new DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight)
  });
  return cache.set(target, boxes), boxes;
}, calculateBoxSize = function(target, observedBox, forceRecalculation) {
  var _a = calculateBoxSizes(target, forceRecalculation), borderBoxSize = _a.borderBoxSize, contentBoxSize = _a.contentBoxSize, devicePixelContentBoxSize = _a.devicePixelContentBoxSize;
  switch (observedBox) {
    case ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
      return devicePixelContentBoxSize;
    case ResizeObserverBoxOptions.BORDER_BOX:
      return borderBoxSize;
    default:
      return contentBoxSize;
  }
}, ResizeObserverEntry = /* @__PURE__ */ (function() {
  function ResizeObserverEntry2(target) {
    var boxes = calculateBoxSizes(target);
    this.target = target, this.contentRect = boxes.contentRect, this.borderBoxSize = freeze([boxes.borderBoxSize]), this.contentBoxSize = freeze([boxes.contentBoxSize]), this.devicePixelContentBoxSize = freeze([boxes.devicePixelContentBoxSize]);
  }
  return ResizeObserverEntry2;
})(), calculateDepthForNode = function(node3) {
  if (isHidden(node3))
    return 1 / 0;
  for (var depth = 0, parent3 = node3.parentNode; parent3; )
    depth += 1, parent3 = parent3.parentNode;
  return depth;
}, broadcastActiveObservations = function() {
  var shallowestDepth = 1 / 0, callbacks2 = [];
  resizeObservers.forEach(function(ro) {
    if (ro.activeTargets.length !== 0) {
      var entries = [];
      ro.activeTargets.forEach(function(ot) {
        var entry = new ResizeObserverEntry(ot.target), targetDepth = calculateDepthForNode(ot.target);
        entries.push(entry), ot.lastReportedSize = calculateBoxSize(ot.target, ot.observedBox), targetDepth < shallowestDepth && (shallowestDepth = targetDepth);
      }), callbacks2.push(function() {
        ro.callback.call(ro.observer, entries, ro.observer);
      }), ro.activeTargets.splice(0, ro.activeTargets.length);
    }
  });
  for (var _i = 0, callbacks_1 = callbacks2; _i < callbacks_1.length; _i++) {
    var callback = callbacks_1[_i];
    callback();
  }
  return shallowestDepth;
}, gatherActiveObservationsAtDepth = function(depth) {
  resizeObservers.forEach(function(ro) {
    ro.activeTargets.splice(0, ro.activeTargets.length), ro.skippedTargets.splice(0, ro.skippedTargets.length), ro.observationTargets.forEach(function(ot) {
      ot.isActive() && (calculateDepthForNode(ot.target) > depth ? ro.activeTargets.push(ot) : ro.skippedTargets.push(ot));
    });
  });
}, process$1 = function() {
  var depth = 0;
  for (gatherActiveObservationsAtDepth(depth); hasActiveObservations(); )
    depth = broadcastActiveObservations(), gatherActiveObservationsAtDepth(depth);
  return hasSkippedObservations() && deliverResizeLoopError(), depth > 0;
}, trigger, callbacks = [], notify = function() {
  return callbacks.splice(0).forEach(function(cb) {
    return cb();
  });
}, queueMicroTask = function(callback) {
  if (!trigger) {
    var toggle_1 = 0, el_1 = document.createTextNode(""), config = {
      characterData: !0
    };
    new MutationObserver(function() {
      return notify();
    }).observe(el_1, config), trigger = function() {
      el_1.textContent = "".concat(toggle_1 ? toggle_1-- : toggle_1++);
    };
  }
  callbacks.push(callback), trigger();
}, queueResizeObserver = function(cb) {
  queueMicroTask(function() {
    requestAnimationFrame(cb);
  });
}, watching = 0, isWatching = function() {
  return !!watching;
}, CATCH_PERIOD = 250, observerConfig = {
  attributes: !0,
  characterData: !0,
  childList: !0,
  subtree: !0
}, events = ["resize", "load", "transitionend", "animationend", "animationstart", "animationiteration", "keyup", "keydown", "mouseup", "mousedown", "mouseover", "mouseout", "blur", "focus"], time = function(timeout) {
  return timeout === void 0 && (timeout = 0), Date.now() + timeout;
}, scheduled = !1, Scheduler = (function() {
  function Scheduler2() {
    var _this = this;
    this.stopped = !0, this.listener = function() {
      return _this.schedule();
    };
  }
  return Scheduler2.prototype.run = function(timeout) {
    var _this = this;
    if (timeout === void 0 && (timeout = CATCH_PERIOD), !scheduled) {
      scheduled = !0;
      var until = time(timeout);
      queueResizeObserver(function() {
        var elementsHaveResized = !1;
        try {
          elementsHaveResized = process$1();
        } finally {
          if (scheduled = !1, timeout = until - time(), !isWatching())
            return;
          elementsHaveResized ? _this.run(1e3) : timeout > 0 ? _this.run(timeout) : _this.start();
        }
      });
    }
  }, Scheduler2.prototype.schedule = function() {
    this.stop(), this.run();
  }, Scheduler2.prototype.observe = function() {
    var _this = this, cb = function() {
      return _this.observer && _this.observer.observe(document.body, observerConfig);
    };
    document.body ? cb() : global$1.addEventListener("DOMContentLoaded", cb);
  }, Scheduler2.prototype.start = function() {
    var _this = this;
    this.stopped && (this.stopped = !1, this.observer = new MutationObserver(this.listener), this.observe(), events.forEach(function(name) {
      return global$1.addEventListener(name, _this.listener, !0);
    }));
  }, Scheduler2.prototype.stop = function() {
    var _this = this;
    this.stopped || (this.observer && this.observer.disconnect(), events.forEach(function(name) {
      return global$1.removeEventListener(name, _this.listener, !0);
    }), this.stopped = !0);
  }, Scheduler2;
})(), scheduler = new Scheduler(), updateCount = function(n2) {
  !watching && n2 > 0 && scheduler.start(), watching += n2, !watching && scheduler.stop();
}, skipNotifyOnElement = function(target) {
  return !isSVG(target) && !isReplacedElement(target) && getComputedStyle(target).display === "inline";
}, ResizeObservation = (function() {
  function ResizeObservation2(target, observedBox) {
    this.target = target, this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX, this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    };
  }
  return ResizeObservation2.prototype.isActive = function() {
    var size2 = calculateBoxSize(this.target, this.observedBox, !0);
    return skipNotifyOnElement(this.target) && (this.lastReportedSize = size2), this.lastReportedSize.inlineSize !== size2.inlineSize || this.lastReportedSize.blockSize !== size2.blockSize;
  }, ResizeObservation2;
})(), ResizeObserverDetail = /* @__PURE__ */ (function() {
  function ResizeObserverDetail2(resizeObserver, callback) {
    this.activeTargets = [], this.skippedTargets = [], this.observationTargets = [], this.observer = resizeObserver, this.callback = callback;
  }
  return ResizeObserverDetail2;
})(), observerMap = /* @__PURE__ */ new WeakMap(), getObservationIndex = function(observationTargets, target) {
  for (var i = 0; i < observationTargets.length; i += 1)
    if (observationTargets[i].target === target)
      return i;
  return -1;
}, ResizeObserverController = (function() {
  function ResizeObserverController2() {
  }
  return ResizeObserverController2.connect = function(resizeObserver, callback) {
    var detail = new ResizeObserverDetail(resizeObserver, callback);
    observerMap.set(resizeObserver, detail);
  }, ResizeObserverController2.observe = function(resizeObserver, target, options) {
    var detail = observerMap.get(resizeObserver), firstObservation = detail.observationTargets.length === 0;
    getObservationIndex(detail.observationTargets, target) < 0 && (firstObservation && resizeObservers.push(detail), detail.observationTargets.push(new ResizeObservation(target, options && options.box)), updateCount(1), scheduler.schedule());
  }, ResizeObserverController2.unobserve = function(resizeObserver, target) {
    var detail = observerMap.get(resizeObserver), index = getObservationIndex(detail.observationTargets, target), lastObservation = detail.observationTargets.length === 1;
    index >= 0 && (lastObservation && resizeObservers.splice(resizeObservers.indexOf(detail), 1), detail.observationTargets.splice(index, 1), updateCount(-1));
  }, ResizeObserverController2.disconnect = function(resizeObserver) {
    var _this = this, detail = observerMap.get(resizeObserver);
    detail.observationTargets.slice().forEach(function(ot) {
      return _this.unobserve(resizeObserver, ot.target);
    }), detail.activeTargets.splice(0, detail.activeTargets.length);
  }, ResizeObserverController2;
})(), ResizeObserver = (function() {
  function ResizeObserver2(callback) {
    if (arguments.length === 0)
      throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
    if (typeof callback != "function")
      throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
    ResizeObserverController.connect(this, callback);
  }
  return ResizeObserver2.prototype.observe = function(target, options) {
    if (arguments.length === 0)
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
    if (!isElement2(target))
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
    ResizeObserverController.observe(this, target, options);
  }, ResizeObserver2.prototype.unobserve = function(target) {
    if (arguments.length === 0)
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
    if (!isElement2(target))
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
    ResizeObserverController.unobserve(this, target);
  }, ResizeObserver2.prototype.disconnect = function() {
    ResizeObserverController.disconnect(this);
  }, ResizeObserver2.toString = function() {
    return "function ResizeObserver () { [polyfill code] }";
  }, ResizeObserver2;
})(), reactDom = { exports: {} }, reactDom_production = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactDom_production;
function requireReactDom_production() {
  if (hasRequiredReactDom_production) return reactDom_production;
  hasRequiredReactDom_production = 1;
  var React$1 = React;
  function formatProdErrorMessage(code2) {
    var url = "https://react.dev/errors/" + code2;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code2 + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function noop2() {
  }
  var Internals = {
    d: {
      f: noop2,
      r: function() {
        throw Error(formatProdErrorMessage(522));
      },
      D: noop2,
      C: noop2,
      L: noop2,
      m: noop2,
      X: noop2,
      S: noop2,
      M: noop2
    },
    p: 0,
    findDOMNode: null
  }, REACT_PORTAL_TYPE = Symbol.for("react.portal");
  function createPortal$1(children, containerInfo, implementation) {
    var key = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: REACT_PORTAL_TYPE,
      key: key == null ? null : "" + key,
      children,
      containerInfo,
      implementation
    };
  }
  var ReactSharedInternals = React$1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function getCrossOriginStringAs(as, input) {
    if (as === "font") return "";
    if (typeof input == "string") return input === "use-credentials" ? input : "";
  }
  return reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals, reactDom_production.createPortal = function(children, container) {
    var key = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!container || container.nodeType !== 1 && container.nodeType !== 9 && container.nodeType !== 11) throw Error(formatProdErrorMessage(299));
    return createPortal$1(children, container, null, key);
  }, reactDom_production.flushSync = function(fn) {
    var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
    try {
      if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
    } finally {
      ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
    }
  }, reactDom_production.preconnect = function(href, options) {
    typeof href == "string" && (options ? (options = options.crossOrigin, options = typeof options == "string" ? options === "use-credentials" ? options : "" : void 0) : options = null, Internals.d.C(href, options));
  }, reactDom_production.prefetchDNS = function(href) {
    typeof href == "string" && Internals.d.D(href);
  }, reactDom_production.preinit = function(href, options) {
    if (typeof href == "string" && options && typeof options.as == "string") {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = typeof options.integrity == "string" ? options.integrity : void 0, fetchPriority = typeof options.fetchPriority == "string" ? options.fetchPriority : void 0;
      as === "style" ? Internals.d.S(href, typeof options.precedence == "string" ? options.precedence : void 0, {
        crossOrigin,
        integrity,
        fetchPriority
      }) : as === "script" && Internals.d.X(href, {
        crossOrigin,
        integrity,
        fetchPriority,
        nonce: typeof options.nonce == "string" ? options.nonce : void 0
      });
    }
  }, reactDom_production.preinitModule = function(href, options) {
    if (typeof href == "string") if (typeof options == "object" && options !== null) {
      if (options.as == null || options.as === "script") {
        var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
        Internals.d.M(href, {
          crossOrigin,
          integrity: typeof options.integrity == "string" ? options.integrity : void 0,
          nonce: typeof options.nonce == "string" ? options.nonce : void 0
        });
      }
    } else options == null && Internals.d.M(href);
  }, reactDom_production.preload = function(href, options) {
    if (typeof href == "string" && typeof options == "object" && options !== null && typeof options.as == "string") {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
      Internals.d.L(href, as, {
        crossOrigin,
        integrity: typeof options.integrity == "string" ? options.integrity : void 0,
        nonce: typeof options.nonce == "string" ? options.nonce : void 0,
        type: typeof options.type == "string" ? options.type : void 0,
        fetchPriority: typeof options.fetchPriority == "string" ? options.fetchPriority : void 0,
        referrerPolicy: typeof options.referrerPolicy == "string" ? options.referrerPolicy : void 0,
        imageSrcSet: typeof options.imageSrcSet == "string" ? options.imageSrcSet : void 0,
        imageSizes: typeof options.imageSizes == "string" ? options.imageSizes : void 0,
        media: typeof options.media == "string" ? options.media : void 0
      });
    }
  }, reactDom_production.preloadModule = function(href, options) {
    if (typeof href == "string") if (options) {
      var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
      Internals.d.m(href, {
        as: typeof options.as == "string" && options.as !== "script" ? options.as : void 0,
        crossOrigin,
        integrity: typeof options.integrity == "string" ? options.integrity : void 0
      });
    } else Internals.d.m(href);
  }, reactDom_production.requestFormReset = function(form) {
    Internals.d.r(form);
  }, reactDom_production.unstable_batchedUpdates = function(fn, a) {
    return fn(a);
  }, reactDom_production.useFormState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useFormState(action, initialState, permalink);
  }, reactDom_production.useFormStatus = function() {
    return ReactSharedInternals.H.useHostTransitionStatus();
  }, reactDom_production.version = "19.2.1", reactDom_production;
}
var reactDom_development = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactDom_development;
function requireReactDom_development() {
  return hasRequiredReactDom_development || (hasRequiredReactDom_development = 1, process.env.NODE_ENV !== "production" && (function() {
    function noop2() {
    }
    function testStringCoercion(value) {
      return "" + value;
    }
    function createPortal$1(children, containerInfo, implementation) {
      var key = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      try {
        testStringCoercion(key);
        var JSCompiler_inline_result = !1;
      } catch {
        JSCompiler_inline_result = !0;
      }
      return JSCompiler_inline_result && (console.error("The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", typeof Symbol == "function" && Symbol.toStringTag && key[Symbol.toStringTag] || key.constructor.name || "Object"), testStringCoercion(key)), {
        $$typeof: REACT_PORTAL_TYPE,
        key: key == null ? null : "" + key,
        children,
        containerInfo,
        implementation
      };
    }
    function getCrossOriginStringAs(as, input) {
      if (as === "font") return "";
      if (typeof input == "string") return input === "use-credentials" ? input : "";
    }
    function getValueDescriptorExpectingObjectForWarning(thing) {
      return thing === null ? "`null`" : thing === void 0 ? "`undefined`" : thing === "" ? "an empty string" : 'something with type "' + typeof thing + '"';
    }
    function getValueDescriptorExpectingEnumForWarning(thing) {
      return thing === null ? "`null`" : thing === void 0 ? "`undefined`" : thing === "" ? "an empty string" : typeof thing == "string" ? JSON.stringify(thing) : typeof thing == "number" ? "`" + thing + "`" : 'something with type "' + typeof thing + '"';
    }
    function resolveDispatcher() {
      var dispatcher = ReactSharedInternals.H;
      return dispatcher === null && console.error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`), dispatcher;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React$1 = React, Internals = {
      d: {
        f: noop2,
        r: function() {
          throw Error("Invalid form element. requestFormReset must be passed a form that was rendered by React.");
        },
        D: noop2,
        C: noop2,
        L: noop2,
        m: noop2,
        X: noop2,
        S: noop2,
        M: noop2
      },
      p: 0,
      findDOMNode: null
    }, REACT_PORTAL_TYPE = Symbol.for("react.portal"), ReactSharedInternals = React$1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    typeof Map == "function" && Map.prototype != null && typeof Map.prototype.forEach == "function" && typeof Set == "function" && Set.prototype != null && typeof Set.prototype.clear == "function" && typeof Set.prototype.forEach == "function" || console.error("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), reactDom_development.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals, reactDom_development.createPortal = function(children, container) {
      var key = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!container || container.nodeType !== 1 && container.nodeType !== 9 && container.nodeType !== 11) throw Error("Target container is not a DOM element.");
      return createPortal$1(children, container, null, key);
    }, reactDom_development.flushSync = function(fn) {
      var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
      try {
        if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
      } finally {
        ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f() && console.error("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.");
      }
    }, reactDom_development.preconnect = function(href, options) {
      typeof href == "string" && href ? options != null && typeof options != "object" ? console.error("ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.", getValueDescriptorExpectingEnumForWarning(options)) : options != null && typeof options.crossOrigin != "string" && console.error("ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.", getValueDescriptorExpectingObjectForWarning(options.crossOrigin)) : console.error("ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", getValueDescriptorExpectingObjectForWarning(href)), typeof href == "string" && (options ? (options = options.crossOrigin, options = typeof options == "string" ? options === "use-credentials" ? options : "" : void 0) : options = null, Internals.d.C(href, options));
    }, reactDom_development.prefetchDNS = function(href) {
      if (typeof href != "string" || !href) console.error("ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", getValueDescriptorExpectingObjectForWarning(href));
      else if (1 < arguments.length) {
        var options = arguments[1];
        typeof options == "object" && options.hasOwnProperty("crossOrigin") ? console.error("ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.", getValueDescriptorExpectingEnumForWarning(options)) : console.error("ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.", getValueDescriptorExpectingEnumForWarning(options));
      }
      typeof href == "string" && Internals.d.D(href);
    }, reactDom_development.preinit = function(href, options) {
      if (typeof href == "string" && href ? options == null || typeof options != "object" ? console.error("ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.", getValueDescriptorExpectingEnumForWarning(options)) : options.as !== "style" && options.as !== "script" && console.error('ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are "style" and "script".', getValueDescriptorExpectingEnumForWarning(options.as)) : console.error("ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", getValueDescriptorExpectingObjectForWarning(href)), typeof href == "string" && options && typeof options.as == "string") {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = typeof options.integrity == "string" ? options.integrity : void 0, fetchPriority = typeof options.fetchPriority == "string" ? options.fetchPriority : void 0;
        as === "style" ? Internals.d.S(href, typeof options.precedence == "string" ? options.precedence : void 0, {
          crossOrigin,
          integrity,
          fetchPriority
        }) : as === "script" && Internals.d.X(href, {
          crossOrigin,
          integrity,
          fetchPriority,
          nonce: typeof options.nonce == "string" ? options.nonce : void 0
        });
      }
    }, reactDom_development.preinitModule = function(href, options) {
      var encountered = "";
      if (typeof href == "string" && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + "."), options !== void 0 && typeof options != "object" ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : options && "as" in options && options.as !== "script" && (encountered += " The `as` option encountered was " + getValueDescriptorExpectingEnumForWarning(options.as) + "."), encountered) console.error("ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s", encountered);
      else switch (encountered = options && typeof options.as == "string" ? options.as : "script", encountered) {
        case "script":
          break;
        default:
          encountered = getValueDescriptorExpectingEnumForWarning(encountered), console.error('ReactDOM.preinitModule(): Currently the only supported "as" type for this function is "script" but received "%s" instead. This warning was generated for `href` "%s". In the future other module types will be supported, aligning with the import-attributes proposal. Learn more here: (https://github.com/tc39/proposal-import-attributes)', encountered, href);
      }
      typeof href == "string" && (typeof options == "object" && options !== null ? (options.as == null || options.as === "script") && (encountered = getCrossOriginStringAs(options.as, options.crossOrigin), Internals.d.M(href, {
        crossOrigin: encountered,
        integrity: typeof options.integrity == "string" ? options.integrity : void 0,
        nonce: typeof options.nonce == "string" ? options.nonce : void 0
      })) : options == null && Internals.d.M(href));
    }, reactDom_development.preload = function(href, options) {
      var encountered = "";
      if (typeof href == "string" && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + "."), options == null || typeof options != "object" ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : typeof options.as == "string" && options.as || (encountered += " The `as` option encountered was " + getValueDescriptorExpectingObjectForWarning(options.as) + "."), encountered && console.error('ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel="preload" as="..." />` tag.%s', encountered), typeof href == "string" && typeof options == "object" && options !== null && typeof options.as == "string") {
        encountered = options.as;
        var crossOrigin = getCrossOriginStringAs(encountered, options.crossOrigin);
        Internals.d.L(href, encountered, {
          crossOrigin,
          integrity: typeof options.integrity == "string" ? options.integrity : void 0,
          nonce: typeof options.nonce == "string" ? options.nonce : void 0,
          type: typeof options.type == "string" ? options.type : void 0,
          fetchPriority: typeof options.fetchPriority == "string" ? options.fetchPriority : void 0,
          referrerPolicy: typeof options.referrerPolicy == "string" ? options.referrerPolicy : void 0,
          imageSrcSet: typeof options.imageSrcSet == "string" ? options.imageSrcSet : void 0,
          imageSizes: typeof options.imageSizes == "string" ? options.imageSizes : void 0,
          media: typeof options.media == "string" ? options.media : void 0
        });
      }
    }, reactDom_development.preloadModule = function(href, options) {
      var encountered = "";
      typeof href == "string" && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + "."), options !== void 0 && typeof options != "object" ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : options && "as" in options && typeof options.as != "string" && (encountered += " The `as` option encountered was " + getValueDescriptorExpectingObjectForWarning(options.as) + "."), encountered && console.error('ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel="modulepreload" as="..." />` tag.%s', encountered), typeof href == "string" && (options ? (encountered = getCrossOriginStringAs(options.as, options.crossOrigin), Internals.d.m(href, {
        as: typeof options.as == "string" && options.as !== "script" ? options.as : void 0,
        crossOrigin: encountered,
        integrity: typeof options.integrity == "string" ? options.integrity : void 0
      })) : Internals.d.m(href));
    }, reactDom_development.requestFormReset = function(form) {
      Internals.d.r(form);
    }, reactDom_development.unstable_batchedUpdates = function(fn, a) {
      return fn(a);
    }, reactDom_development.useFormState = function(action, initialState, permalink) {
      return resolveDispatcher().useFormState(action, initialState, permalink);
    }, reactDom_development.useFormStatus = function() {
      return resolveDispatcher().useHostTransitionStatus();
    }, reactDom_development.version = "19.2.1", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), reactDom_development;
}
var hasRequiredReactDom;
function requireReactDom() {
  if (hasRequiredReactDom) return reactDom.exports;
  hasRequiredReactDom = 1;
  function checkDCE() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("^_^");
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
  }
  return process.env.NODE_ENV === "production" ? (checkDCE(), reactDom.exports = requireReactDom_production()) : reactDom.exports = requireReactDom_development(), reactDom.exports;
}
var reactDomExports = requireReactDom(), ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports);
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {}, sourceKeys = Object.keys(source), key, i;
  for (i = 0; i < sourceKeys.length; i++)
    key = sourceKeys[i], !(excluded.indexOf(key) >= 0) && (target[key] = source[key]);
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded), key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++)
      key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
  }
  return target;
}
function _typeof(o2) {
  "@babel/helpers - typeof";
  return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(o3) {
    return typeof o3;
  } : function(o3) {
    return o3 && typeof Symbol == "function" && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
  }, _typeof(o2);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint);
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _defineProperty(obj, key, value) {
  return key = _toPropertyKey(key), key in obj ? Object.defineProperty(obj, key, {
    value,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : obj[key] = value, obj;
}
var EditorContext = /* @__PURE__ */ createContext(null), useSlateStatic = () => {
  var editor = useContext(EditorContext);
  if (!editor)
    throw new Error("The `useSlateStatic` hook must be used inside the <Slate> component's context.");
  return editor;
}, ReactEditor = DOMEditor;
function ownKeys$7(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$7(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$7(Object(t2), !0).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$7(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var RESOLVE_DELAY = 25, FLUSH_DELAY = 200, debug$h = function() {
}, isDataTransfer = (value) => value?.constructor.name === "DataTransfer";
function createAndroidInputManager(_ref) {
  var {
    editor,
    scheduleOnDOMSelectionChange,
    onDOMSelectionChange
  } = _ref, flushing = !1, compositionEndTimeoutId = null, flushTimeoutId = null, actionTimeoutId = null, idCounter = 0, insertPositionHint = !1, applyPendingSelection = () => {
    var pendingSelection = EDITOR_TO_PENDING_SELECTION.get(editor);
    if (EDITOR_TO_PENDING_SELECTION.delete(editor), pendingSelection) {
      var {
        selection
      } = editor, normalized = normalizeRange(editor, pendingSelection);
      normalized && (!selection || !Range.equals(normalized, selection)) && Transforms.select(editor, normalized);
    }
  }, performAction = () => {
    var action = EDITOR_TO_PENDING_ACTION.get(editor);
    if (EDITOR_TO_PENDING_ACTION.delete(editor), !!action) {
      if (action.at) {
        var target = Point.isPoint(action.at) ? normalizePoint$1(editor, action.at) : normalizeRange(editor, action.at);
        if (!target)
          return;
        var _targetRange = Editor.range(editor, target);
        (!editor.selection || !Range.equals(editor.selection, _targetRange)) && Transforms.select(editor, target);
      }
      action.run();
    }
  }, flush = () => {
    if (flushTimeoutId && (clearTimeout(flushTimeoutId), flushTimeoutId = null), actionTimeoutId && (clearTimeout(actionTimeoutId), actionTimeoutId = null), !hasPendingDiffs() && !hasPendingAction()) {
      applyPendingSelection();
      return;
    }
    flushing || (flushing = !0, setTimeout(() => flushing = !1)), hasPendingAction() && (flushing = "action");
    var selectionRef = editor.selection && Editor.rangeRef(editor, editor.selection, {
      affinity: "forward"
    });
    EDITOR_TO_USER_MARKS.set(editor, editor.marks), debug$h("flush", EDITOR_TO_PENDING_ACTION.get(editor), EDITOR_TO_PENDING_DIFFS.get(editor));
    for (var scheduleSelectionChange = hasPendingDiffs(), diff2; diff2 = (_EDITOR_TO_PENDING_DI = EDITOR_TO_PENDING_DIFFS.get(editor)) === null || _EDITOR_TO_PENDING_DI === void 0 ? void 0 : _EDITOR_TO_PENDING_DI[0]; ) {
      var _EDITOR_TO_PENDING_DI, _EDITOR_TO_PENDING_DI2, pendingMarks = EDITOR_TO_PENDING_INSERTION_MARKS.get(editor);
      pendingMarks !== void 0 && (EDITOR_TO_PENDING_INSERTION_MARKS.delete(editor), editor.marks = pendingMarks), pendingMarks && insertPositionHint === !1 && (insertPositionHint = null);
      var range2 = targetRange(diff2);
      (!editor.selection || !Range.equals(editor.selection, range2)) && Transforms.select(editor, range2), diff2.diff.text ? Editor.insertText(editor, diff2.diff.text) : Editor.deleteFragment(editor), EDITOR_TO_PENDING_DIFFS.set(editor, (_EDITOR_TO_PENDING_DI2 = EDITOR_TO_PENDING_DIFFS.get(editor)) === null || _EDITOR_TO_PENDING_DI2 === void 0 ? void 0 : _EDITOR_TO_PENDING_DI2.filter((_ref2) => {
        var {
          id
        } = _ref2;
        return id !== diff2.id;
      })), verifyDiffState(editor, diff2) || (scheduleSelectionChange = !1, EDITOR_TO_PENDING_ACTION.delete(editor), EDITOR_TO_USER_MARKS.delete(editor), flushing = "action", EDITOR_TO_PENDING_SELECTION.delete(editor), scheduleOnDOMSelectionChange.cancel(), onDOMSelectionChange.cancel(), selectionRef?.unref());
    }
    var selection = selectionRef?.unref();
    if (selection && !EDITOR_TO_PENDING_SELECTION.get(editor) && (!editor.selection || !Range.equals(selection, editor.selection)) && Transforms.select(editor, selection), hasPendingAction()) {
      performAction();
      return;
    }
    scheduleSelectionChange && scheduleOnDOMSelectionChange(), scheduleOnDOMSelectionChange.flush(), onDOMSelectionChange.flush(), applyPendingSelection();
    var userMarks = EDITOR_TO_USER_MARKS.get(editor);
    EDITOR_TO_USER_MARKS.delete(editor), userMarks !== void 0 && (editor.marks = userMarks, editor.onChange());
  }, handleCompositionEnd = (_event) => {
    compositionEndTimeoutId && clearTimeout(compositionEndTimeoutId), compositionEndTimeoutId = setTimeout(() => {
      IS_COMPOSING.set(editor, !1), flush();
    }, RESOLVE_DELAY);
  }, handleCompositionStart = (_event) => {
    IS_COMPOSING.set(editor, !0), compositionEndTimeoutId && (clearTimeout(compositionEndTimeoutId), compositionEndTimeoutId = null);
  }, updatePlaceholderVisibility = function() {
    var forceHide = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1, placeholderElement = EDITOR_TO_PLACEHOLDER_ELEMENT.get(editor);
    if (placeholderElement) {
      if (hasPendingDiffs() || forceHide) {
        placeholderElement.style.display = "none";
        return;
      }
      placeholderElement.style.removeProperty("display");
    }
  }, storeDiff = (path3, diff2) => {
    var _EDITOR_TO_PENDING_DI3, pendingDiffs = (_EDITOR_TO_PENDING_DI3 = EDITOR_TO_PENDING_DIFFS.get(editor)) !== null && _EDITOR_TO_PENDING_DI3 !== void 0 ? _EDITOR_TO_PENDING_DI3 : [];
    EDITOR_TO_PENDING_DIFFS.set(editor, pendingDiffs);
    var target = Node.leaf(editor, path3), idx = pendingDiffs.findIndex((change) => Path.equals(change.path, path3));
    if (idx < 0) {
      var normalized = normalizeStringDiff(target.text, diff2);
      normalized && pendingDiffs.push({
        path: path3,
        diff: diff2,
        id: idCounter++
      }), updatePlaceholderVisibility();
      return;
    }
    var merged = mergeStringDiffs(target.text, pendingDiffs[idx].diff, diff2);
    if (!merged) {
      pendingDiffs.splice(idx, 1), updatePlaceholderVisibility();
      return;
    }
    pendingDiffs[idx] = _objectSpread$7(_objectSpread$7({}, pendingDiffs[idx]), {}, {
      diff: merged
    });
  }, scheduleAction = function(run) {
    var {
      at
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    insertPositionHint = !1, EDITOR_TO_PENDING_SELECTION.delete(editor), scheduleOnDOMSelectionChange.cancel(), onDOMSelectionChange.cancel(), hasPendingAction() && flush(), EDITOR_TO_PENDING_ACTION.set(editor, {
      at,
      run
    }), actionTimeoutId = setTimeout(flush);
  }, handleDOMBeforeInput = (event) => {
    var _targetRange2;
    if (flushTimeoutId && (clearTimeout(flushTimeoutId), flushTimeoutId = null), !IS_NODE_MAP_DIRTY.get(editor)) {
      var {
        inputType: type
      } = event, targetRange2 = null, data = event.dataTransfer || event.data || void 0;
      insertPositionHint !== !1 && type !== "insertText" && type !== "insertCompositionText" && (insertPositionHint = !1);
      var [nativeTargetRange] = event.getTargetRanges();
      nativeTargetRange && (targetRange2 = ReactEditor.toSlateRange(editor, nativeTargetRange, {
        exactMatch: !1,
        suppressThrow: !0
      }));
      var window2 = ReactEditor.getWindow(editor), domSelection = window2.getSelection();
      if (!targetRange2 && domSelection && (nativeTargetRange = domSelection, targetRange2 = ReactEditor.toSlateRange(editor, domSelection, {
        exactMatch: !1,
        suppressThrow: !0
      })), targetRange2 = (_targetRange2 = targetRange2) !== null && _targetRange2 !== void 0 ? _targetRange2 : editor.selection, !!targetRange2) {
        var canStoreDiff = !0;
        if (type.startsWith("delete")) {
          var direction = type.endsWith("Backward") ? "backward" : "forward", [start2, end2] = Range.edges(targetRange2), [leaf3, path3] = Editor.leaf(editor, start2.path);
          if (Range.isExpanded(targetRange2) && leaf3.text.length === start2.offset && end2.offset === 0) {
            var next3 = Editor.next(editor, {
              at: start2.path,
              match: Text$1.isText
            });
            next3 && Path.equals(next3[1], end2.path) && (direction === "backward" ? (targetRange2 = {
              anchor: end2,
              focus: end2
            }, start2 = end2, [leaf3, path3] = next3) : (targetRange2 = {
              anchor: start2,
              focus: start2
            }, end2 = start2));
          }
          var diff2 = {
            text: "",
            start: start2.offset,
            end: end2.offset
          }, pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(editor), relevantPendingDiffs = pendingDiffs?.find((change) => Path.equals(change.path, path3)), diffs = relevantPendingDiffs ? [relevantPendingDiffs.diff, diff2] : [diff2], text = applyStringDiff(leaf3.text, ...diffs);
          if (text.length === 0 && (canStoreDiff = !1), Range.isExpanded(targetRange2)) {
            if (canStoreDiff && Path.equals(targetRange2.anchor.path, targetRange2.focus.path)) {
              var point3 = {
                path: targetRange2.anchor.path,
                offset: start2.offset
              }, range2 = Editor.range(editor, point3, point3);
              return handleUserSelect(range2), storeDiff(targetRange2.anchor.path, {
                text: "",
                end: end2.offset,
                start: start2.offset
              });
            }
            return scheduleAction(() => Editor.deleteFragment(editor, {
              direction
            }), {
              at: targetRange2
            });
          }
        }
        switch (type) {
          case "deleteByComposition":
          case "deleteByCut":
          case "deleteByDrag":
            return scheduleAction(() => Editor.deleteFragment(editor), {
              at: targetRange2
            });
          case "deleteContent":
          case "deleteContentForward": {
            var {
              anchor
            } = targetRange2;
            if (canStoreDiff && Range.isCollapsed(targetRange2)) {
              var targetNode = Node.leaf(editor, anchor.path);
              if (anchor.offset < targetNode.text.length)
                return storeDiff(anchor.path, {
                  text: "",
                  start: anchor.offset,
                  end: anchor.offset + 1
                });
            }
            return scheduleAction(() => Editor.deleteForward(editor), {
              at: targetRange2
            });
          }
          case "deleteContentBackward": {
            var _nativeTargetRange, {
              anchor: _anchor
            } = targetRange2, nativeCollapsed = isDOMSelection(nativeTargetRange) ? nativeTargetRange.isCollapsed : !!((_nativeTargetRange = nativeTargetRange) !== null && _nativeTargetRange !== void 0 && _nativeTargetRange.collapsed);
            return canStoreDiff && nativeCollapsed && Range.isCollapsed(targetRange2) && _anchor.offset > 0 ? storeDiff(_anchor.path, {
              text: "",
              start: _anchor.offset - 1,
              end: _anchor.offset
            }) : scheduleAction(() => Editor.deleteBackward(editor), {
              at: targetRange2
            });
          }
          case "deleteEntireSoftLine":
            return scheduleAction(() => {
              Editor.deleteBackward(editor, {
                unit: "line"
              }), Editor.deleteForward(editor, {
                unit: "line"
              });
            }, {
              at: targetRange2
            });
          case "deleteHardLineBackward":
            return scheduleAction(() => Editor.deleteBackward(editor, {
              unit: "block"
            }), {
              at: targetRange2
            });
          case "deleteSoftLineBackward":
            return scheduleAction(() => Editor.deleteBackward(editor, {
              unit: "line"
            }), {
              at: targetRange2
            });
          case "deleteHardLineForward":
            return scheduleAction(() => Editor.deleteForward(editor, {
              unit: "block"
            }), {
              at: targetRange2
            });
          case "deleteSoftLineForward":
            return scheduleAction(() => Editor.deleteForward(editor, {
              unit: "line"
            }), {
              at: targetRange2
            });
          case "deleteWordBackward":
            return scheduleAction(() => Editor.deleteBackward(editor, {
              unit: "word"
            }), {
              at: targetRange2
            });
          case "deleteWordForward":
            return scheduleAction(() => Editor.deleteForward(editor, {
              unit: "word"
            }), {
              at: targetRange2
            });
          case "insertLineBreak":
            return scheduleAction(() => Editor.insertSoftBreak(editor), {
              at: targetRange2
            });
          case "insertParagraph":
            return scheduleAction(() => Editor.insertBreak(editor), {
              at: targetRange2
            });
          case "insertCompositionText":
          case "deleteCompositionText":
          case "insertFromComposition":
          case "insertFromDrop":
          case "insertFromPaste":
          case "insertFromYank":
          case "insertReplacementText":
          case "insertText": {
            if (isDataTransfer(data))
              return scheduleAction(() => ReactEditor.insertData(editor, data), {
                at: targetRange2
              });
            var _text = data ?? "";
            if (EDITOR_TO_PENDING_INSERTION_MARKS.get(editor) && (_text = _text.replace("\uFEFF", "")), type === "insertText" && /.*\n.*\n$/.test(_text) && (_text = _text.slice(0, -1)), _text.includes(`
`))
              return scheduleAction(() => {
                var parts = _text.split(`
`);
                parts.forEach((line, i) => {
                  line && Editor.insertText(editor, line), i !== parts.length - 1 && Editor.insertSoftBreak(editor);
                });
              }, {
                at: targetRange2
              });
            if (Path.equals(targetRange2.anchor.path, targetRange2.focus.path)) {
              var [_start, _end] = Range.edges(targetRange2), _diff = {
                start: _start.offset,
                end: _end.offset,
                text: _text
              };
              if (_text && insertPositionHint && type === "insertCompositionText") {
                var hintPosition = insertPositionHint.start + insertPositionHint.text.search(/\S|$/), diffPosition = _diff.start + _diff.text.search(/\S|$/);
                diffPosition === hintPosition + 1 && _diff.end === insertPositionHint.start + insertPositionHint.text.length ? (_diff.start -= 1, insertPositionHint = null, scheduleFlush()) : insertPositionHint = !1;
              } else type === "insertText" ? insertPositionHint === null ? insertPositionHint = _diff : insertPositionHint && Range.isCollapsed(targetRange2) && insertPositionHint.end + insertPositionHint.text.length === _start.offset ? insertPositionHint = _objectSpread$7(_objectSpread$7({}, insertPositionHint), {}, {
                text: insertPositionHint.text + _text
              }) : insertPositionHint = !1 : insertPositionHint = !1;
              if (canStoreDiff) {
                var currentSelection = editor.selection;
                if (storeDiff(_start.path, _diff), currentSelection) {
                  var newPoint = {
                    path: _start.path,
                    offset: _start.offset + _text.length
                  };
                  scheduleAction(() => {
                    Transforms.select(editor, {
                      anchor: newPoint,
                      focus: newPoint
                    });
                  }, {
                    at: newPoint
                  });
                }
                return;
              }
            }
            return scheduleAction(() => Editor.insertText(editor, _text), {
              at: targetRange2
            });
          }
        }
      }
    }
  }, hasPendingAction = () => !!EDITOR_TO_PENDING_ACTION.get(editor), hasPendingDiffs = () => {
    var _EDITOR_TO_PENDING_DI4;
    return !!((_EDITOR_TO_PENDING_DI4 = EDITOR_TO_PENDING_DIFFS.get(editor)) !== null && _EDITOR_TO_PENDING_DI4 !== void 0 && _EDITOR_TO_PENDING_DI4.length);
  }, hasPendingChanges = () => hasPendingAction() || hasPendingDiffs(), isFlushing = () => flushing, handleUserSelect = (range2) => {
    EDITOR_TO_PENDING_SELECTION.set(editor, range2), flushTimeoutId && (clearTimeout(flushTimeoutId), flushTimeoutId = null);
    var {
      selection
    } = editor;
    if (range2) {
      var pathChanged = !selection || !Path.equals(selection.anchor.path, range2.anchor.path), parentPathChanged = !selection || !Path.equals(selection.anchor.path.slice(0, -1), range2.anchor.path.slice(0, -1));
      (pathChanged && insertPositionHint || parentPathChanged) && (insertPositionHint = !1), (pathChanged || hasPendingDiffs()) && (flushTimeoutId = setTimeout(flush, FLUSH_DELAY));
    }
  }, handleInput = () => {
    (hasPendingAction() || !hasPendingDiffs()) && flush();
  }, handleKeyDown = (_) => {
    hasPendingDiffs() || (updatePlaceholderVisibility(!0), setTimeout(updatePlaceholderVisibility));
  }, scheduleFlush = () => {
    hasPendingAction() || (actionTimeoutId = setTimeout(flush));
  }, handleDomMutations = (mutations) => {
    if (!(hasPendingDiffs() || hasPendingAction()) && mutations.some((mutation) => isTrackedMutation(editor, mutation, mutations))) {
      var _EDITOR_TO_FORCE_REND;
      (_EDITOR_TO_FORCE_REND = EDITOR_TO_FORCE_RENDER.get(editor)) === null || _EDITOR_TO_FORCE_REND === void 0 || _EDITOR_TO_FORCE_REND();
    }
  };
  return {
    flush,
    scheduleFlush,
    hasPendingDiffs,
    hasPendingAction,
    hasPendingChanges,
    isFlushing,
    handleUserSelect,
    handleCompositionEnd,
    handleCompositionStart,
    handleDOMBeforeInput,
    handleKeyDown,
    handleDomMutations,
    handleInput
  };
}
function useIsMounted() {
  var isMountedRef = useRef(!1);
  return useEffect(() => (isMountedRef.current = !0, () => {
    isMountedRef.current = !1;
  }), []), isMountedRef.current;
}
var useIsomorphicLayoutEffect = CAN_USE_DOM ? useLayoutEffect : useEffect;
function useMutationObserver(node3, callback, options) {
  var [mutationObserver] = useState(() => new MutationObserver(callback));
  useIsomorphicLayoutEffect(() => {
    mutationObserver.takeRecords();
  }), useEffect(() => {
    if (!node3.current)
      throw new Error("Failed to attach MutationObserver, `node` is undefined");
    return mutationObserver.observe(node3.current, options), () => mutationObserver.disconnect();
  }, [mutationObserver, node3, options]);
}
var _excluded$2 = ["node"];
function ownKeys$6(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$6(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$6(Object(t2), !0).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$6(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var MUTATION_OBSERVER_CONFIG$1 = {
  subtree: !0,
  childList: !0,
  characterData: !0
}, useAndroidInputManager = IS_ANDROID ? (_ref) => {
  var {
    node: node3
  } = _ref, options = _objectWithoutProperties(_ref, _excluded$2);
  if (!IS_ANDROID)
    return null;
  var editor = useSlateStatic(), isMounted = useIsMounted(), [inputManager] = useState(() => createAndroidInputManager(_objectSpread$6({
    editor
  }, options)));
  return useMutationObserver(node3, inputManager.handleDomMutations, MUTATION_OBSERVER_CONFIG$1), EDITOR_TO_SCHEDULE_FLUSH.set(editor, inputManager.scheduleFlush), isMounted && inputManager.flush(), inputManager;
} : () => null;
function ownKeys$5(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$5(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$5(Object(t2), !0).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$5(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var String$1 = (props) => {
  var {
    isLast,
    leaf: leaf3,
    parent: parent3,
    text
  } = props, editor = useSlateStatic(), path3 = ReactEditor.findPath(editor, text), parentPath = Path.parent(path3), isMarkPlaceholder = !!leaf3[MARK_PLACEHOLDER_SYMBOL];
  return editor.isVoid(parent3) ? /* @__PURE__ */ React.createElement(ZeroWidthString, {
    length: Node.string(parent3).length
  }) : leaf3.text === "" && parent3.children[parent3.children.length - 1] === text && !editor.isInline(parent3) && Editor.string(editor, parentPath) === "" ? /* @__PURE__ */ React.createElement(ZeroWidthString, {
    isLineBreak: !0,
    isMarkPlaceholder
  }) : leaf3.text === "" ? /* @__PURE__ */ React.createElement(ZeroWidthString, {
    isMarkPlaceholder
  }) : isLast && leaf3.text.slice(-1) === `
` ? /* @__PURE__ */ React.createElement(TextString, {
    isTrailing: !0,
    text: leaf3.text
  }) : /* @__PURE__ */ React.createElement(TextString, {
    text: leaf3.text
  });
}, TextString = (props) => {
  var {
    text,
    isTrailing = !1
  } = props, ref = useRef(null), getTextContent = () => "".concat(text ?? "").concat(isTrailing ? `
` : ""), [initialText] = useState(getTextContent);
  return useIsomorphicLayoutEffect(() => {
    var textWithTrailing = getTextContent();
    ref.current && ref.current.textContent !== textWithTrailing && (ref.current.textContent = textWithTrailing);
  }), /* @__PURE__ */ React.createElement(MemoizedText$1, {
    ref
  }, initialText);
}, MemoizedText$1 = /* @__PURE__ */ memo(/* @__PURE__ */ forwardRef((props, ref) => /* @__PURE__ */ React.createElement("span", {
  "data-slate-string": !0,
  ref
}, props.children))), ZeroWidthString = (props) => {
  var {
    length = 0,
    isLineBreak = !1,
    isMarkPlaceholder = !1
  } = props, attributes = {
    "data-slate-zero-width": isLineBreak ? "n" : "z",
    "data-slate-length": length
  };
  return isMarkPlaceholder && (attributes["data-slate-mark-placeholder"] = !0), /* @__PURE__ */ React.createElement("span", _objectSpread$5({}, attributes), !IS_ANDROID || !isLineBreak ? "\uFEFF" : null, isLineBreak ? /* @__PURE__ */ React.createElement("br", null) : null);
};
function ownKeys$4(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$4(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$4(Object(t2), !0).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$4(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var PLACEHOLDER_DELAY = IS_ANDROID ? 300 : 0;
function disconnectPlaceholderResizeObserver(placeholderResizeObserver, releaseObserver) {
  placeholderResizeObserver.current && (placeholderResizeObserver.current.disconnect(), releaseObserver && (placeholderResizeObserver.current = null));
}
function clearTimeoutRef(timeoutRef) {
  timeoutRef.current && (clearTimeout(timeoutRef.current), timeoutRef.current = null);
}
var defaultRenderLeaf = (props) => /* @__PURE__ */ React.createElement(DefaultLeaf, _objectSpread$4({}, props)), Leaf = (props) => {
  var {
    leaf: leaf3,
    isLast,
    text,
    parent: parent3,
    renderPlaceholder,
    renderLeaf = defaultRenderLeaf,
    leafPosition
  } = props, editor = useSlateStatic(), placeholderResizeObserver = useRef(null), placeholderRef = useRef(null), [showPlaceholder, setShowPlaceholder] = useState(!1), showPlaceholderTimeoutRef = useRef(null), callbackPlaceholderRef = useCallback((placeholderEl) => {
    if (disconnectPlaceholderResizeObserver(placeholderResizeObserver, placeholderEl == null), placeholderEl == null) {
      var _leaf$onPlaceholderRe;
      EDITOR_TO_PLACEHOLDER_ELEMENT.delete(editor), (_leaf$onPlaceholderRe = leaf3.onPlaceholderResize) === null || _leaf$onPlaceholderRe === void 0 || _leaf$onPlaceholderRe.call(leaf3, null);
    } else {
      if (EDITOR_TO_PLACEHOLDER_ELEMENT.set(editor, placeholderEl), !placeholderResizeObserver.current) {
        var ResizeObserver$1 = window.ResizeObserver || ResizeObserver;
        placeholderResizeObserver.current = new ResizeObserver$1(() => {
          var _leaf$onPlaceholderRe2;
          (_leaf$onPlaceholderRe2 = leaf3.onPlaceholderResize) === null || _leaf$onPlaceholderRe2 === void 0 || _leaf$onPlaceholderRe2.call(leaf3, placeholderEl);
        });
      }
      placeholderResizeObserver.current.observe(placeholderEl), placeholderRef.current = placeholderEl;
    }
  }, [placeholderRef, leaf3, editor]), children = /* @__PURE__ */ React.createElement(String$1, {
    isLast,
    leaf: leaf3,
    parent: parent3,
    text
  }), leafIsPlaceholder = !!leaf3[PLACEHOLDER_SYMBOL];
  if (useEffect(() => (leafIsPlaceholder ? showPlaceholderTimeoutRef.current || (showPlaceholderTimeoutRef.current = setTimeout(() => {
    setShowPlaceholder(!0), showPlaceholderTimeoutRef.current = null;
  }, PLACEHOLDER_DELAY)) : (clearTimeoutRef(showPlaceholderTimeoutRef), setShowPlaceholder(!1)), () => clearTimeoutRef(showPlaceholderTimeoutRef)), [leafIsPlaceholder, setShowPlaceholder]), leafIsPlaceholder && showPlaceholder) {
    var placeholderProps = {
      children: leaf3.placeholder,
      attributes: {
        "data-slate-placeholder": !0,
        style: {
          position: "absolute",
          top: 0,
          pointerEvents: "none",
          width: "100%",
          maxWidth: "100%",
          display: "block",
          opacity: "0.333",
          userSelect: "none",
          textDecoration: "none",
          // Fixes https://github.com/udecode/plate/issues/2315
          WebkitUserModify: IS_WEBKIT ? "inherit" : void 0
        },
        contentEditable: !1,
        ref: callbackPlaceholderRef
      }
    };
    children = /* @__PURE__ */ React.createElement(React.Fragment, null, children, renderPlaceholder(placeholderProps));
  }
  var attributes = {
    "data-slate-leaf": !0
  };
  return renderLeaf({
    attributes,
    children,
    leaf: leaf3,
    text,
    leafPosition
  });
}, MemoizedLeaf = /* @__PURE__ */ React.memo(Leaf, (prev, next3) => next3.parent === prev.parent && next3.isLast === prev.isLast && next3.renderLeaf === prev.renderLeaf && next3.renderPlaceholder === prev.renderPlaceholder && next3.text === prev.text && Text$1.equals(next3.leaf, prev.leaf) && next3.leaf[PLACEHOLDER_SYMBOL] === prev.leaf[PLACEHOLDER_SYMBOL]), DefaultLeaf = (props) => {
  var {
    attributes,
    children
  } = props;
  return /* @__PURE__ */ React.createElement("span", _objectSpread$4({}, attributes), children);
};
function useGenericSelector(selector, equalityFn) {
  var [, forceRender] = useReducer((s) => s + 1, 0), latestSubscriptionCallbackError = useRef(), latestSelector = useRef(() => null), latestSelectedState = useRef(null), selectedState;
  try {
    if (selector !== latestSelector.current || latestSubscriptionCallbackError.current) {
      var selectorResult = selector();
      equalityFn(latestSelectedState.current, selectorResult) ? selectedState = latestSelectedState.current : selectedState = selectorResult;
    } else
      selectedState = latestSelectedState.current;
  } catch (err) {
    throw latestSubscriptionCallbackError.current && isError(err) && (err.message += `
The error may be correlated with this previous error:
`.concat(latestSubscriptionCallbackError.current.stack, `

`)), err;
  }
  latestSelector.current = selector, latestSelectedState.current = selectedState, latestSubscriptionCallbackError.current = void 0;
  var update = useCallback(() => {
    try {
      var newSelectedState = latestSelector.current();
      if (equalityFn(latestSelectedState.current, newSelectedState))
        return;
      latestSelectedState.current = newSelectedState;
    } catch (err) {
      err instanceof Error ? latestSubscriptionCallbackError.current = err : latestSubscriptionCallbackError.current = new Error(String(err));
    }
    forceRender();
  }, []);
  return [selectedState, update];
}
function isError(error) {
  return error instanceof Error;
}
var DecorateContext = /* @__PURE__ */ createContext({}), useDecorations = (node3, parentDecorations) => {
  var editor = useSlateStatic(), {
    decorate,
    addEventListener
  } = useContext(DecorateContext), selector = () => {
    var path3 = ReactEditor.findPath(editor, node3);
    return decorate([node3, path3]);
  }, equalityFn = Text$1.isText(node3) ? isTextDecorationsEqual : isElementDecorationsEqual, [decorations, update] = useGenericSelector(selector, equalityFn);
  return useIsomorphicLayoutEffect(() => {
    var unsubscribe = addEventListener(update);
    return update(), unsubscribe;
  }, [addEventListener, update]), useMemo(() => [...decorations, ...parentDecorations], [decorations, parentDecorations]);
}, useDecorateContext = (decorateProp) => {
  var eventListeners = useRef(/* @__PURE__ */ new Set()), latestDecorate = useRef(decorateProp);
  useIsomorphicLayoutEffect(() => {
    latestDecorate.current = decorateProp, eventListeners.current.forEach((listener) => listener());
  }, [decorateProp]);
  var decorate = useCallback((entry) => latestDecorate.current(entry), []), addEventListener = useCallback((callback) => (eventListeners.current.add(callback), () => {
    eventListeners.current.delete(callback);
  }), []);
  return useMemo(() => ({
    decorate,
    addEventListener
  }), [decorate, addEventListener]);
};
function ownKeys$3(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$3(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$3(Object(t2), !0).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$3(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var defaultRenderText = (props) => /* @__PURE__ */ React.createElement(DefaultText, _objectSpread$3({}, props)), Text = (props) => {
  for (var {
    decorations: parentDecorations,
    isLast,
    parent: parent3,
    renderPlaceholder,
    renderLeaf,
    renderText = defaultRenderText,
    text
  } = props, editor = useSlateStatic(), ref = useRef(null), decorations = useDecorations(text, parentDecorations), decoratedLeaves = Text$1.decorations(text, decorations), key = ReactEditor.findKey(editor, text), children = [], i = 0; i < decoratedLeaves.length; i++) {
    var {
      leaf: leaf3,
      position
    } = decoratedLeaves[i];
    children.push(/* @__PURE__ */ React.createElement(MemoizedLeaf, {
      isLast: isLast && i === decoratedLeaves.length - 1,
      key: "".concat(key.id, "-").concat(i),
      renderPlaceholder,
      leaf: leaf3,
      leafPosition: position,
      text,
      parent: parent3,
      renderLeaf
    }));
  }
  var callbackRef = useCallback((span) => {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
    span ? (KEY_TO_ELEMENT?.set(key, span), NODE_TO_ELEMENT.set(text, span), ELEMENT_TO_NODE.set(span, text)) : (KEY_TO_ELEMENT?.delete(key), NODE_TO_ELEMENT.delete(text), ref.current && ELEMENT_TO_NODE.delete(ref.current)), ref.current = span;
  }, [ref, editor, key, text]), attributes = {
    "data-slate-node": "text",
    ref: callbackRef
  };
  return renderText({
    text,
    children,
    attributes
  });
}, MemoizedText = /* @__PURE__ */ React.memo(Text, (prev, next3) => next3.parent === prev.parent && next3.isLast === prev.isLast && next3.renderText === prev.renderText && next3.renderLeaf === prev.renderLeaf && next3.renderPlaceholder === prev.renderPlaceholder && next3.text === prev.text && isTextDecorationsEqual(next3.decorations, prev.decorations)), DefaultText = (props) => {
  var {
    attributes,
    children
  } = props;
  return /* @__PURE__ */ React.createElement("span", _objectSpread$3({}, attributes), children);
};
function ownKeys$2(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$2(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$2(Object(t2), !0).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$2(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var defaultRenderElement = (props) => /* @__PURE__ */ React.createElement(DefaultElement, _objectSpread$2({}, props)), Element$1 = (props) => {
  var {
    decorations: parentDecorations,
    element,
    renderElement = defaultRenderElement,
    renderChunk,
    renderPlaceholder,
    renderLeaf,
    renderText
  } = props, editor = useSlateStatic(), readOnly = useReadOnly(), isInline = editor.isInline(element), decorations = useDecorations(element, parentDecorations), key = ReactEditor.findKey(editor, element), ref = useCallback((ref2) => {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
    ref2 ? (KEY_TO_ELEMENT?.set(key, ref2), NODE_TO_ELEMENT.set(element, ref2), ELEMENT_TO_NODE.set(ref2, element)) : (KEY_TO_ELEMENT?.delete(key), NODE_TO_ELEMENT.delete(element));
  }, [editor, key, element]), children = useChildren({
    decorations,
    node: element,
    renderElement,
    renderChunk,
    renderPlaceholder,
    renderLeaf,
    renderText
  }), attributes = {
    "data-slate-node": "element",
    ref
  };
  if (isInline && (attributes["data-slate-inline"] = !0), !isInline && Editor.hasInlines(editor, element)) {
    var text = Node.string(element), dir = getDirection(text);
    dir === "rtl" && (attributes.dir = dir);
  }
  if (Editor.isVoid(editor, element)) {
    attributes["data-slate-void"] = !0, !readOnly && isInline && (attributes.contentEditable = !1);
    var Tag = isInline ? "span" : "div", [[_text]] = Node.texts(element);
    children = /* @__PURE__ */ React.createElement(Tag, {
      "data-slate-spacer": !0,
      style: {
        height: "0",
        color: "transparent",
        outline: "none",
        position: "absolute"
      }
    }, /* @__PURE__ */ React.createElement(MemoizedText, {
      renderPlaceholder,
      decorations: [],
      isLast: !1,
      parent: element,
      text: _text
    })), NODE_TO_INDEX.set(_text, 0), NODE_TO_PARENT.set(_text, element);
  }
  return renderElement({
    attributes,
    children,
    element
  });
}, MemoizedElement = /* @__PURE__ */ React.memo(Element$1, (prev, next3) => prev.element === next3.element && prev.renderElement === next3.renderElement && prev.renderChunk === next3.renderChunk && prev.renderText === next3.renderText && prev.renderLeaf === next3.renderLeaf && prev.renderPlaceholder === next3.renderPlaceholder && isElementDecorationsEqual(prev.decorations, next3.decorations)), DefaultElement = (props) => {
  var {
    attributes,
    children,
    element
  } = props, editor = useSlateStatic(), Tag = editor.isInline(element) ? "span" : "div";
  return /* @__PURE__ */ React.createElement(Tag, _objectSpread$2(_objectSpread$2({}, attributes), {}, {
    style: {
      position: "relative"
    }
  }), children);
};
class ChunkTreeHelper {
  constructor(chunkTree, _ref) {
    var {
      chunkSize,
      debug: debug3
    } = _ref;
    _defineProperty(this, "root", void 0), _defineProperty(this, "chunkSize", void 0), _defineProperty(this, "debug", void 0), _defineProperty(this, "reachedEnd", void 0), _defineProperty(this, "pointerChunk", void 0), _defineProperty(this, "pointerIndex", void 0), _defineProperty(this, "pointerIndexStack", void 0), _defineProperty(this, "cachedPointerNode", void 0), this.root = chunkTree, this.chunkSize = chunkSize, this.debug = debug3 ?? !1, this.pointerChunk = chunkTree, this.pointerIndex = -1, this.pointerIndexStack = [], this.reachedEnd = !1, this.validateState();
  }
  /**
   * Move the pointer to the next leaf in the chunk tree
   */
  readLeaf() {
    if (this.reachedEnd) return null;
    for (; ; )
      if (this.pointerIndex + 1 < this.pointerSiblings.length) {
        this.pointerIndex++, this.cachedPointerNode = void 0;
        break;
      } else {
        if (this.pointerChunk.type === "root")
          return this.reachedEnd = !0, null;
        this.exitChunk();
      }
    return this.validateState(), this.enterChunkUntilLeaf(!1), this.pointerNode;
  }
  /**
   * Move the pointer to the previous leaf in the chunk tree
   */
  returnToPreviousLeaf() {
    if (this.reachedEnd) {
      this.reachedEnd = !1, this.enterChunkUntilLeaf(!0);
      return;
    }
    for (; ; )
      if (this.pointerIndex >= 1) {
        this.pointerIndex--, this.cachedPointerNode = void 0;
        break;
      } else if (this.pointerChunk.type === "root") {
        this.pointerIndex = -1;
        return;
      } else
        this.exitChunk();
    this.validateState(), this.enterChunkUntilLeaf(!0);
  }
  /**
   * Insert leaves before the current leaf, leaving the pointer unchanged
   */
  insertBefore(leaves) {
    this.returnToPreviousLeaf(), this.insertAfter(leaves), this.readLeaf();
  }
  /**
   * Insert leaves after the current leaf, leaving the pointer on the last
   * inserted leaf
   *
   * The insertion algorithm first checks for any chunk we're currently at the
   * end of that can receive additional leaves. Next, it tries to insert leaves
   * at the starts of any subsequent chunks.
   *
   * Any remaining leaves are passed to rawInsertAfter to be chunked and
   * inserted at the highest possible level.
   */
  insertAfter(leaves) {
    if (leaves.length !== 0) {
      for (var beforeDepth = 0, afterDepth = 0; this.pointerChunk.type === "chunk" && this.pointerIndex === this.pointerSiblings.length - 1; ) {
        var remainingCapacity = this.chunkSize - this.pointerSiblings.length, toInsertCount = Math.min(remainingCapacity, leaves.length);
        if (toInsertCount > 0) {
          var leavesToInsert = leaves.splice(0, toInsertCount);
          this.rawInsertAfter(leavesToInsert, beforeDepth);
        }
        this.exitChunk(), beforeDepth++;
      }
      if (leaves.length !== 0) {
        var rawInsertPointer = this.savePointer(), finalPointer = null;
        if (this.readLeaf())
          for (; this.pointerChunk.type === "chunk" && this.pointerIndex === 0; ) {
            var _remainingCapacity = this.chunkSize - this.pointerSiblings.length, _toInsertCount = Math.min(_remainingCapacity, leaves.length);
            if (_toInsertCount > 0) {
              var _leavesToInsert = leaves.splice(-_toInsertCount, _toInsertCount);
              this.pointerIndex = -1, this.cachedPointerNode = void 0, this.rawInsertAfter(_leavesToInsert, afterDepth), finalPointer || (finalPointer = this.savePointer());
            }
            this.exitChunk(), afterDepth++;
          }
        this.restorePointer(rawInsertPointer);
        var minDepth = Math.max(beforeDepth, afterDepth);
        this.rawInsertAfter(leaves, minDepth), finalPointer && this.restorePointer(finalPointer), this.validateState();
      }
    }
  }
  /**
   * Remove the current node and decrement the pointer, deleting any ancestor
   * chunk that becomes empty as a result
   */
  remove() {
    this.pointerSiblings.splice(this.pointerIndex--, 1), this.cachedPointerNode = void 0, this.pointerSiblings.length === 0 && this.pointerChunk.type === "chunk" ? (this.exitChunk(), this.remove()) : this.invalidateChunk(), this.validateState();
  }
  /**
   * Add the current chunk and all ancestor chunks to the list of modified
   * chunks
   */
  invalidateChunk() {
    for (var c2 = this.pointerChunk; c2.type === "chunk"; c2 = c2.parent)
      this.root.modifiedChunks.add(c2);
  }
  /**
   * Whether the pointer is at the start of the tree
   */
  get atStart() {
    return this.pointerChunk.type === "root" && this.pointerIndex === -1;
  }
  /**
   * The siblings of the current node
   */
  get pointerSiblings() {
    return this.pointerChunk.children;
  }
  /**
   * Get the current node (uncached)
   *
   * If the pointer is at the start or end of the document, returns null.
   *
   * Usually, the current node is a chunk leaf, although it can be a chunk
   * while insertions are in progress.
   */
  getPointerNode() {
    return this.reachedEnd || this.pointerIndex === -1 ? null : this.pointerSiblings[this.pointerIndex];
  }
  /**
   * Cached getter for the current node
   */
  get pointerNode() {
    if (this.cachedPointerNode !== void 0) return this.cachedPointerNode;
    var pointerNode = this.getPointerNode();
    return this.cachedPointerNode = pointerNode, pointerNode;
  }
  /**
   * Get the path of a chunk relative to the root, returning null if the chunk
   * is not connected to the root
   */
  getChunkPath(chunk) {
    for (var path3 = [], c2 = chunk; c2.type === "chunk"; c2 = c2.parent) {
      var index = c2.parent.children.indexOf(c2);
      if (index === -1)
        return null;
      path3.unshift(index);
    }
    return path3;
  }
  /**
   * Save the current pointer to be restored later
   */
  savePointer() {
    if (this.atStart) return "start";
    if (!this.pointerNode)
      throw new Error("Cannot save pointer when pointerNode is null");
    return {
      chunk: this.pointerChunk,
      node: this.pointerNode
    };
  }
  /**
   * Restore the pointer to a previous state
   */
  restorePointer(savedPointer) {
    if (savedPointer === "start") {
      this.pointerChunk = this.root, this.pointerIndex = -1, this.pointerIndexStack = [], this.reachedEnd = !1, this.cachedPointerNode = void 0;
      return;
    }
    var {
      chunk,
      node: node3
    } = savedPointer, index = chunk.children.indexOf(node3);
    if (index === -1)
      throw new Error("Cannot restore point because saved node is no longer in saved chunk");
    var indexStack = this.getChunkPath(chunk);
    if (!indexStack)
      throw new Error("Cannot restore point because saved chunk is no longer connected to root");
    this.pointerChunk = chunk, this.pointerIndex = index, this.pointerIndexStack = indexStack, this.reachedEnd = !1, this.cachedPointerNode = node3, this.validateState();
  }
  /**
   * Assuming the current node is a chunk, move the pointer into that chunk
   *
   * @param end If true, place the pointer on the last node of the chunk.
   * Otherwise, place the pointer on the first node.
   */
  enterChunk(end2) {
    var _this$pointerNode;
    if (((_this$pointerNode = this.pointerNode) === null || _this$pointerNode === void 0 ? void 0 : _this$pointerNode.type) !== "chunk")
      throw new Error("Cannot enter non-chunk");
    if (this.pointerIndexStack.push(this.pointerIndex), this.pointerChunk = this.pointerNode, this.pointerIndex = end2 ? this.pointerSiblings.length - 1 : 0, this.cachedPointerNode = void 0, this.validateState(), this.pointerChunk.children.length === 0)
      throw new Error("Cannot enter empty chunk");
  }
  /**
   * Assuming the current node is a chunk, move the pointer into that chunk
   * repeatedly until the current node is a leaf
   *
   * @param end If true, place the pointer on the last node of the chunk.
   * Otherwise, place the pointer on the first node.
   */
  enterChunkUntilLeaf(end2) {
    for (; ((_this$pointerNode2 = this.pointerNode) === null || _this$pointerNode2 === void 0 ? void 0 : _this$pointerNode2.type) === "chunk"; ) {
      var _this$pointerNode2;
      this.enterChunk(end2);
    }
  }
  /**
   * Move the pointer to the parent chunk
   */
  exitChunk() {
    if (this.pointerChunk.type === "root")
      throw new Error("Cannot exit root");
    var previousPointerChunk = this.pointerChunk;
    this.pointerChunk = previousPointerChunk.parent, this.pointerIndex = this.pointerIndexStack.pop(), this.cachedPointerNode = void 0, this.validateState();
  }
  /**
   * Insert leaves immediately after the current node, leaving the pointer on
   * the last inserted leaf
   *
   * Leaves are chunked according to the number of nodes already in the parent
   * plus the number of nodes being inserted, or the minimum depth if larger
   */
  rawInsertAfter(leaves, minDepth) {
    if (leaves.length !== 0) {
      for (var groupIntoChunks = (leaves2, parent3, perChunk) => {
        if (perChunk === 1) return leaves2;
        for (var chunks2 = [], i2 = 0; i2 < this.chunkSize; i2++) {
          var chunkNodes = leaves2.slice(i2 * perChunk, (i2 + 1) * perChunk);
          if (chunkNodes.length === 0) break;
          var chunk = {
            type: "chunk",
            key: new Key(),
            parent: parent3,
            children: []
          };
          chunk.children = groupIntoChunks(chunkNodes, chunk, perChunk / this.chunkSize), chunks2.push(chunk);
        }
        return chunks2;
      }, newTotal = this.pointerSiblings.length + leaves.length, depthForTotal = 0, i = this.chunkSize; i < newTotal; i *= this.chunkSize)
        depthForTotal++;
      var depth = Math.max(depthForTotal, minDepth), perTopLevelChunk = Math.pow(this.chunkSize, depth), chunks = groupIntoChunks(leaves, this.pointerChunk, perTopLevelChunk);
      this.pointerSiblings.splice(this.pointerIndex + 1, 0, ...chunks), this.pointerIndex += chunks.length, this.cachedPointerNode = void 0, this.invalidateChunk(), this.validateState();
    }
  }
  /**
   * If debug mode is enabled, ensure that the state is internally consistent
   */
  // istanbul ignore next
  validateState() {
    if (this.debug) {
      var validateDescendant = (node3) => {
        if (node3.type === "chunk") {
          var {
            parent: parent3,
            children
          } = node3;
          if (!parent3.children.includes(node3))
            throw new Error("Debug: Chunk ".concat(node3.key.id, " has an incorrect parent property"));
          children.forEach(validateDescendant);
        }
      };
      if (this.root.children.forEach(validateDescendant), this.cachedPointerNode !== void 0 && this.cachedPointerNode !== this.getPointerNode())
        throw new Error("Debug: The cached pointer is incorrect and has not been invalidated");
      var actualIndexStack = this.getChunkPath(this.pointerChunk);
      if (!actualIndexStack)
        throw new Error("Debug: The pointer chunk is not connected to the root");
      if (!Path.equals(this.pointerIndexStack, actualIndexStack))
        throw new Error("Debug: The cached index stack [".concat(this.pointerIndexStack.join(", "), "] does not match the path of the pointer chunk [").concat(actualIndexStack.join(", "), "]"));
    }
  }
}
class ChildrenHelper {
  constructor(editor, children) {
    _defineProperty(this, "editor", void 0), _defineProperty(this, "children", void 0), _defineProperty(this, "cachedKeys", void 0), _defineProperty(this, "pointerIndex", void 0), this.editor = editor, this.children = children, this.cachedKeys = new Array(children.length), this.pointerIndex = 0;
  }
  /**
   * Read a given number of nodes, advancing the pointer by that amount
   */
  read(n2) {
    if (n2 === 1)
      return [this.children[this.pointerIndex++]];
    var slicedChildren = this.remaining(n2);
    return this.pointerIndex += n2, slicedChildren;
  }
  /**
   * Get the remaining children without advancing the pointer
   *
   * @param [maxChildren] Limit the number of children returned.
   */
  remaining(maxChildren) {
    return maxChildren === void 0 ? this.children.slice(this.pointerIndex) : this.children.slice(this.pointerIndex, this.pointerIndex + maxChildren);
  }
  /**
   * Whether all children have been read
   */
  get reachedEnd() {
    return this.pointerIndex >= this.children.length;
  }
  /**
   * Determine whether a node with a given key appears in the unread part of the
   * children array, and return its index relative to the current pointer if so
   *
   * Searching for the node object itself using indexOf is most efficient, but
   * will fail to locate nodes that have been modified. In this case, nodes
   * should be identified by their keys instead.
   *
   * Searching an array of keys using indexOf is very inefficient since fetching
   * the keys for all children in advance is very slow. Insead, if the node
   * search fails to return a value, fetch the keys of each remaining child one
   * by one and compare it to the known key.
   */
  lookAhead(node3, key) {
    var elementResult = this.children.indexOf(node3, this.pointerIndex);
    if (elementResult > -1) return elementResult - this.pointerIndex;
    for (var i = this.pointerIndex; i < this.children.length; i++) {
      var candidateNode = this.children[i], candidateKey = this.findKey(candidateNode, i);
      if (candidateKey === key) return i - this.pointerIndex;
    }
    return -1;
  }
  /**
   * Convert an array of Slate nodes to an array of chunk leaves, each
   * containing the node and its key
   */
  toChunkLeaves(nodes2, startIndex) {
    return nodes2.map((node3, i) => ({
      type: "leaf",
      node: node3,
      key: this.findKey(node3, startIndex + i),
      index: startIndex + i
    }));
  }
  /**
   * Get the key for a Slate node, cached using the node's index
   */
  findKey(node3, index) {
    var cachedKey = this.cachedKeys[index];
    if (cachedKey) return cachedKey;
    var key = ReactEditor.findKey(this.editor, node3);
    return this.cachedKeys[index] = key, key;
  }
}
var reconcileChildren = (editor, _ref) => {
  var {
    chunkTree,
    children,
    chunkSize,
    rerenderChildren = [],
    onInsert,
    onUpdate,
    onIndexChange,
    debug: debug3
  } = _ref;
  chunkTree.modifiedChunks.clear();
  for (var chunkTreeHelper = new ChunkTreeHelper(chunkTree, {
    chunkSize,
    debug: debug3
  }), childrenHelper = new ChildrenHelper(editor, children), treeLeaf, _loop = function() {
    var lookAhead = childrenHelper.lookAhead(treeLeaf.node, treeLeaf.key), wasMoved = lookAhead > 0 && chunkTree.movedNodeKeys.has(treeLeaf.key);
    if (lookAhead === -1 || wasMoved)
      return chunkTreeHelper.remove(), 1;
    var insertedChildrenStartIndex = childrenHelper.pointerIndex, insertedChildren = childrenHelper.read(lookAhead + 1), matchingChild = insertedChildren.pop();
    if (insertedChildren.length) {
      var _leavesToInsert = childrenHelper.toChunkLeaves(insertedChildren, insertedChildrenStartIndex);
      chunkTreeHelper.insertBefore(_leavesToInsert), insertedChildren.forEach((node3, relativeIndex) => {
        onInsert?.(node3, insertedChildrenStartIndex + relativeIndex);
      });
    }
    var matchingChildIndex = childrenHelper.pointerIndex - 1;
    treeLeaf.node !== matchingChild && (treeLeaf.node = matchingChild, chunkTreeHelper.invalidateChunk(), onUpdate?.(matchingChild, matchingChildIndex)), treeLeaf.index !== matchingChildIndex && (treeLeaf.index = matchingChildIndex, onIndexChange?.(matchingChild, matchingChildIndex)), rerenderChildren.includes(matchingChildIndex) && chunkTreeHelper.invalidateChunk();
  }; treeLeaf = chunkTreeHelper.readLeaf(); )
    _loop();
  if (!childrenHelper.reachedEnd) {
    var remainingChildren = childrenHelper.remaining(), leavesToInsert = childrenHelper.toChunkLeaves(remainingChildren, childrenHelper.pointerIndex);
    chunkTreeHelper.returnToPreviousLeaf(), chunkTreeHelper.insertAfter(leavesToInsert), remainingChildren.forEach((node3, relativeIndex) => {
      onInsert?.(node3, childrenHelper.pointerIndex + relativeIndex);
    });
  }
  chunkTree.movedNodeKeys.clear();
};
function ownKeys$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys$1(Object(t2), !0).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var KEY_TO_CHUNK_TREE = /* @__PURE__ */ new WeakMap(), getChunkTreeForNode = function(editor, node3) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, key = ReactEditor.findKey(editor, node3), chunkTree = KEY_TO_CHUNK_TREE.get(key);
  return chunkTree || (chunkTree = {
    type: "root",
    movedNodeKeys: /* @__PURE__ */ new Set(),
    modifiedChunks: /* @__PURE__ */ new Set(),
    children: []
  }, KEY_TO_CHUNK_TREE.set(key, chunkTree)), options.reconcile && reconcileChildren(editor, _objectSpread$1({
    chunkTree,
    children: node3.children
  }, options.reconcile)), chunkTree;
}, defaultRenderChunk = (_ref) => {
  var {
    children
  } = _ref;
  return children;
}, ChunkAncestor = (props) => {
  var {
    root,
    ancestor,
    renderElement,
    renderChunk = defaultRenderChunk
  } = props;
  return ancestor.children.map((chunkNode) => {
    if (chunkNode.type === "chunk") {
      var key = chunkNode.key.id, renderedChunk = renderChunk({
        highest: ancestor === root,
        lowest: chunkNode.children.some((c2) => c2.type === "leaf"),
        attributes: {
          "data-slate-chunk": !0
        },
        children: /* @__PURE__ */ React.createElement(MemoizedChunk, {
          root,
          ancestor: chunkNode,
          renderElement,
          renderChunk
        })
      });
      return /* @__PURE__ */ React.createElement(Fragment, {
        key
      }, renderedChunk);
    }
    var element = chunkNode.node;
    return renderElement(element, chunkNode.index, chunkNode.key);
  });
}, ChunkTree = ChunkAncestor, MemoizedChunk = /* @__PURE__ */ React.memo(ChunkAncestor, (prev, next3) => prev.root === next3.root && prev.renderElement === next3.renderElement && prev.renderChunk === next3.renderChunk && !next3.root.modifiedChunks.has(next3.ancestor)), ElementContext = /* @__PURE__ */ createContext(null), useElementIf = () => useContext(ElementContext), useChildren = (props) => {
  var {
    decorations,
    node: node3,
    renderElement,
    renderChunk,
    renderPlaceholder,
    renderText,
    renderLeaf
  } = props, editor = useSlateStatic();
  IS_NODE_MAP_DIRTY.set(editor, !1);
  var isEditor3 = Editor.isEditor(node3), isBlock2 = !isEditor3 && Element$2.isElement(node3) && !editor.isInline(node3), isLeafBlock = isBlock2 && Editor.hasInlines(editor, node3), chunkSize = isLeafBlock ? null : editor.getChunkSize(node3), chunking = !!chunkSize, {
    decorationsByChild,
    childrenToRedecorate
  } = useDecorationsByChild(editor, node3, decorations);
  chunking || node3.children.forEach((n2, i) => {
    NODE_TO_INDEX.set(n2, i), NODE_TO_PARENT.set(n2, node3);
  });
  var renderElementComponent = useCallback((n2, i, cachedKey) => {
    var key = cachedKey ?? ReactEditor.findKey(editor, n2);
    return /* @__PURE__ */ React.createElement(ElementContext.Provider, {
      key: "provider-".concat(key.id),
      value: n2
    }, /* @__PURE__ */ React.createElement(MemoizedElement, {
      decorations: decorationsByChild[i],
      element: n2,
      key: key.id,
      renderElement,
      renderChunk,
      renderPlaceholder,
      renderLeaf,
      renderText
    }));
  }, [editor, decorationsByChild, renderElement, renderChunk, renderPlaceholder, renderLeaf, renderText]), renderTextComponent = (n2, i) => {
    var key = ReactEditor.findKey(editor, n2);
    return /* @__PURE__ */ React.createElement(MemoizedText, {
      decorations: decorationsByChild[i],
      key: key.id,
      isLast: i === node3.children.length - 1,
      parent: node3,
      renderPlaceholder,
      renderLeaf,
      renderText,
      text: n2
    });
  };
  if (!chunking)
    return node3.children.map((n2, i) => Text$1.isText(n2) ? renderTextComponent(n2, i) : renderElementComponent(n2, i));
  var chunkTree = getChunkTreeForNode(editor, node3, {
    reconcile: {
      chunkSize,
      rerenderChildren: childrenToRedecorate,
      onInsert: (n2, i) => {
        NODE_TO_INDEX.set(n2, i), NODE_TO_PARENT.set(n2, node3);
      },
      onUpdate: (n2, i) => {
        NODE_TO_INDEX.set(n2, i), NODE_TO_PARENT.set(n2, node3);
      },
      onIndexChange: (n2, i) => {
        NODE_TO_INDEX.set(n2, i);
      }
    }
  });
  return /* @__PURE__ */ React.createElement(ChunkTree, {
    root: chunkTree,
    ancestor: chunkTree,
    renderElement: renderElementComponent,
    renderChunk
  });
}, useDecorationsByChild = (editor, node3, decorations) => {
  var decorationsByChild = splitDecorationsByChild(editor, node3, decorations), mutableDecorationsByChild = useRef(decorationsByChild).current, childrenToRedecorate = [];
  mutableDecorationsByChild.length = decorationsByChild.length;
  for (var i = 0; i < decorationsByChild.length; i++) {
    var _mutableDecorationsBy, _decorations = decorationsByChild[i], previousDecorations = (_mutableDecorationsBy = mutableDecorationsByChild[i]) !== null && _mutableDecorationsBy !== void 0 ? _mutableDecorationsBy : null;
    isElementDecorationsEqual(previousDecorations, _decorations) || (mutableDecorationsByChild[i] = _decorations, childrenToRedecorate.push(i));
  }
  return {
    decorationsByChild: mutableDecorationsByChild,
    childrenToRedecorate
  };
}, ReadOnlyContext = /* @__PURE__ */ createContext(!1), useReadOnly = () => useContext(ReadOnlyContext), SlateSelectorContext = /* @__PURE__ */ createContext({}), refEquality = (a, b) => a === b;
function useSlateSelector(selector) {
  var equalityFn = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : refEquality, {
    deferred
  } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, context = useContext(SlateSelectorContext);
  if (!context)
    throw new Error("The `useSlateSelector` hook must be used inside the <Slate> component's context.");
  var {
    addEventListener
  } = context, editor = useSlateStatic(), genericSelector = useCallback(() => selector(editor), [editor, selector]), [selectedState, update] = useGenericSelector(genericSelector, equalityFn);
  return useIsomorphicLayoutEffect(() => {
    var unsubscribe = addEventListener(update, {
      deferred
    });
    return update(), unsubscribe;
  }, [addEventListener, update, deferred]), selectedState;
}
function useSelectorContext() {
  var eventListeners = useRef(/* @__PURE__ */ new Set()), deferredEventListeners = useRef(/* @__PURE__ */ new Set()), onChange = useCallback(() => {
    eventListeners.current.forEach((listener) => listener());
  }, []), flushDeferred = useCallback(() => {
    deferredEventListeners.current.forEach((listener) => listener()), deferredEventListeners.current.clear();
  }, []), addEventListener = useCallback(function(callbackProp) {
    var {
      deferred = !1
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, callback = deferred ? () => deferredEventListeners.current.add(callbackProp) : callbackProp;
    return eventListeners.current.add(callback), () => {
      eventListeners.current.delete(callback);
    };
  }, []), selectorContext = useMemo(() => ({
    addEventListener,
    flushDeferred
  }), [addEventListener, flushDeferred]);
  return {
    selectorContext,
    onChange
  };
}
function useFlushDeferredSelectorsOnRender() {
  var {
    flushDeferred
  } = useContext(SlateSelectorContext);
  useIsomorphicLayoutEffect(flushDeferred);
}
var useSlate = () => {
  var {
    addEventListener
  } = useContext(SlateSelectorContext), [, forceRender] = useReducer((s) => s + 1, 0);
  if (!addEventListener)
    throw new Error("The `useSlate` hook must be used inside the <Slate> component's context.");
  return useIsomorphicLayoutEffect(() => addEventListener(forceRender), [addEventListener]), useSlateStatic();
};
function useTrackUserInput() {
  var editor = useSlateStatic(), receivedUserInput = useRef(!1), animationFrameIdRef = useRef(0), onUserInput = useCallback(() => {
    if (!receivedUserInput.current) {
      receivedUserInput.current = !0;
      var window2 = ReactEditor.getWindow(editor);
      window2.cancelAnimationFrame(animationFrameIdRef.current), animationFrameIdRef.current = window2.requestAnimationFrame(() => {
        receivedUserInput.current = !1;
      });
    }
  }, [editor]);
  return useEffect(() => () => cancelAnimationFrame(animationFrameIdRef.current), []), {
    receivedUserInput,
    onUserInput
  };
}
var createRestoreDomManager = (editor, receivedUserInput) => {
  var bufferedMutations = [], clear = () => {
    bufferedMutations = [];
  }, registerMutations = (mutations) => {
    if (receivedUserInput.current) {
      var trackedMutations = mutations.filter((mutation) => isTrackedMutation(editor, mutation, mutations));
      bufferedMutations.push(...trackedMutations);
    }
  };
  function restoreDOM() {
    bufferedMutations.length > 0 && (bufferedMutations.reverse().forEach((mutation) => {
      mutation.type !== "characterData" && (mutation.removedNodes.forEach((node3) => {
        mutation.target.insertBefore(node3, mutation.nextSibling);
      }), mutation.addedNodes.forEach((node3) => {
        mutation.target.removeChild(node3);
      }));
    }), clear());
  }
  return {
    registerMutations,
    restoreDOM,
    clear
  };
}, MUTATION_OBSERVER_CONFIG = {
  subtree: !0,
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0
};
class RestoreDOMComponent extends Component {
  constructor() {
    super(...arguments), _defineProperty(this, "context", null), _defineProperty(this, "manager", null), _defineProperty(this, "mutationObserver", null);
  }
  observe() {
    var _this$mutationObserve, {
      node: node3
    } = this.props;
    if (!node3.current)
      throw new Error("Failed to attach MutationObserver, `node` is undefined");
    (_this$mutationObserve = this.mutationObserver) === null || _this$mutationObserve === void 0 || _this$mutationObserve.observe(node3.current, MUTATION_OBSERVER_CONFIG);
  }
  componentDidMount() {
    var {
      receivedUserInput
    } = this.props, editor = this.context;
    this.manager = createRestoreDomManager(editor, receivedUserInput), this.mutationObserver = new MutationObserver(this.manager.registerMutations), this.observe();
  }
  getSnapshotBeforeUpdate() {
    var _this$mutationObserve2, _this$mutationObserve3, _this$manager2, pendingMutations = (_this$mutationObserve2 = this.mutationObserver) === null || _this$mutationObserve2 === void 0 ? void 0 : _this$mutationObserve2.takeRecords();
    if (pendingMutations != null && pendingMutations.length) {
      var _this$manager;
      (_this$manager = this.manager) === null || _this$manager === void 0 || _this$manager.registerMutations(pendingMutations);
    }
    return (_this$mutationObserve3 = this.mutationObserver) === null || _this$mutationObserve3 === void 0 || _this$mutationObserve3.disconnect(), (_this$manager2 = this.manager) === null || _this$manager2 === void 0 || _this$manager2.restoreDOM(), null;
  }
  componentDidUpdate() {
    var _this$manager3;
    (_this$manager3 = this.manager) === null || _this$manager3 === void 0 || _this$manager3.clear(), this.observe();
  }
  componentWillUnmount() {
    var _this$mutationObserve4;
    (_this$mutationObserve4 = this.mutationObserver) === null || _this$mutationObserve4 === void 0 || _this$mutationObserve4.disconnect();
  }
  render() {
    return this.props.children;
  }
}
_defineProperty(RestoreDOMComponent, "contextType", EditorContext);
var RestoreDOM = IS_ANDROID ? RestoreDOMComponent : (_ref) => {
  var {
    children
  } = _ref;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
}, ComposingContext = /* @__PURE__ */ createContext(!1), _excluded$1 = ["autoFocus", "decorate", "onDOMBeforeInput", "placeholder", "readOnly", "renderElement", "renderChunk", "renderLeaf", "renderText", "renderPlaceholder", "scrollSelectionIntoView", "style", "as", "disableDefaultStyles"], _excluded2 = ["text"];
function ownKeys(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = arguments[r2] != null ? arguments[r2] : {};
    r2 % 2 ? ownKeys(Object(t2), !0).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Children = (props) => /* @__PURE__ */ React.createElement(React.Fragment, null, useChildren(props)), Editable = /* @__PURE__ */ forwardRef((props, forwardedRef) => {
  var defaultRenderPlaceholder = useCallback((props2) => /* @__PURE__ */ React.createElement(DefaultPlaceholder, _objectSpread({}, props2)), []), {
    autoFocus,
    decorate = defaultDecorate,
    onDOMBeforeInput: propsOnDOMBeforeInput,
    placeholder,
    readOnly = !1,
    renderElement,
    renderChunk,
    renderLeaf,
    renderText,
    renderPlaceholder = defaultRenderPlaceholder,
    scrollSelectionIntoView = defaultScrollSelectionIntoView,
    style: userStyle = {},
    as: Component2 = "div",
    disableDefaultStyles = !1
  } = props, attributes = _objectWithoutProperties(props, _excluded$1), editor = useSlate(), [isComposing, setIsComposing] = useState(!1), ref = useRef(null), deferredOperations = useRef([]), [placeholderHeight, setPlaceholderHeight] = useState(), processing = useRef(!1), {
    onUserInput,
    receivedUserInput
  } = useTrackUserInput(), [, forceRender] = useReducer((s) => s + 1, 0);
  EDITOR_TO_FORCE_RENDER.set(editor, forceRender), IS_READ_ONLY.set(editor, readOnly);
  var state = useMemo(() => ({
    isDraggingInternally: !1,
    isUpdatingSelection: !1,
    latestElement: null,
    hasMarkPlaceholder: !1
  }), []);
  useEffect(() => {
    ref.current && autoFocus && ref.current.focus();
  }, [autoFocus]);
  var androidInputManagerRef = useRef(), onDOMSelectionChange = useMemo(() => throttle(() => {
    if (IS_NODE_MAP_DIRTY.get(editor)) {
      onDOMSelectionChange();
      return;
    }
    var el = ReactEditor.toDOMNode(editor, editor), root = el.getRootNode();
    if (!processing.current && IS_WEBKIT && root instanceof ShadowRoot) {
      processing.current = !0;
      var active = getActiveElement();
      active ? document.execCommand("indent") : Transforms.deselect(editor), processing.current = !1;
      return;
    }
    var androidInputManager = androidInputManagerRef.current;
    if ((IS_ANDROID || !ReactEditor.isComposing(editor)) && (!state.isUpdatingSelection || androidInputManager != null && androidInputManager.isFlushing()) && !state.isDraggingInternally) {
      var _root = ReactEditor.findDocumentOrShadowRoot(editor), {
        activeElement
      } = _root, _el = ReactEditor.toDOMNode(editor, editor), domSelection = getSelection(_root);
      if (activeElement === _el ? (state.latestElement = activeElement, IS_FOCUSED.set(editor, !0)) : IS_FOCUSED.delete(editor), !domSelection)
        return Transforms.deselect(editor);
      var {
        anchorNode,
        focusNode
      } = domSelection, anchorNodeSelectable = ReactEditor.hasEditableTarget(editor, anchorNode) || ReactEditor.isTargetInsideNonReadonlyVoid(editor, anchorNode), focusNodeInEditor = ReactEditor.hasTarget(editor, focusNode);
      if (anchorNodeSelectable && focusNodeInEditor) {
        var range2 = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: !1,
          suppressThrow: !0
        });
        range2 && (!ReactEditor.isComposing(editor) && !(androidInputManager != null && androidInputManager.hasPendingChanges()) && !(androidInputManager != null && androidInputManager.isFlushing()) ? Transforms.select(editor, range2) : androidInputManager?.handleUserSelect(range2));
      }
      readOnly && (!anchorNodeSelectable || !focusNodeInEditor) && Transforms.deselect(editor);
    }
  }, 100), [editor, readOnly, state]), scheduleOnDOMSelectionChange = useMemo(() => debounce(onDOMSelectionChange, 0), [onDOMSelectionChange]);
  androidInputManagerRef.current = useAndroidInputManager({
    node: ref,
    onDOMSelectionChange,
    scheduleOnDOMSelectionChange
  }), useIsomorphicLayoutEffect(() => {
    var _androidInputManagerR, _androidInputManagerR2, window2;
    ref.current && (window2 = getDefaultView(ref.current)) ? (EDITOR_TO_WINDOW.set(editor, window2), EDITOR_TO_ELEMENT.set(editor, ref.current), NODE_TO_ELEMENT.set(editor, ref.current), ELEMENT_TO_NODE.set(ref.current, editor)) : NODE_TO_ELEMENT.delete(editor);
    var {
      selection
    } = editor, root = ReactEditor.findDocumentOrShadowRoot(editor), domSelection = getSelection(root);
    if (!(!domSelection || !ReactEditor.isFocused(editor) || (_androidInputManagerR = androidInputManagerRef.current) !== null && _androidInputManagerR !== void 0 && _androidInputManagerR.hasPendingAction())) {
      var setDomSelection = (forceChange) => {
        var hasDomSelection = domSelection.type !== "None";
        if (!(!selection && !hasDomSelection)) {
          var focusNode = domSelection.focusNode, anchorNode;
          if (IS_FIREFOX && domSelection.rangeCount > 1) {
            var firstRange = domSelection.getRangeAt(0), lastRange = domSelection.getRangeAt(domSelection.rangeCount - 1);
            firstRange.startContainer === focusNode ? anchorNode = lastRange.endContainer : anchorNode = firstRange.startContainer;
          } else
            anchorNode = domSelection.anchorNode;
          var editorElement = EDITOR_TO_ELEMENT.get(editor), hasDomSelectionInEditor = !1;
          if (containsShadowAware(editorElement, anchorNode) && containsShadowAware(editorElement, focusNode) && (hasDomSelectionInEditor = !0), hasDomSelection && hasDomSelectionInEditor && selection && !forceChange) {
            var slateRange = ReactEditor.toSlateRange(editor, domSelection, {
              exactMatch: !0,
              // domSelection is not necessarily a valid Slate range
              // (e.g. when clicking on contentEditable:false element)
              suppressThrow: !0
            });
            if (slateRange && Range.equals(slateRange, selection)) {
              var _anchorNode;
              if (!state.hasMarkPlaceholder || (_anchorNode = anchorNode) !== null && _anchorNode !== void 0 && (_anchorNode = _anchorNode.parentElement) !== null && _anchorNode !== void 0 && _anchorNode.hasAttribute("data-slate-mark-placeholder"))
                return;
            }
          }
          if (selection && !ReactEditor.hasRange(editor, selection)) {
            editor.selection = ReactEditor.toSlateRange(editor, domSelection, {
              exactMatch: !1,
              suppressThrow: !0
            });
            return;
          }
          state.isUpdatingSelection = !0;
          var newDomRange = null;
          try {
            newDomRange = selection && ReactEditor.toDOMRange(editor, selection);
          } catch {
          }
          return newDomRange ? (ReactEditor.isComposing(editor) && !IS_ANDROID ? domSelection.collapseToEnd() : Range.isBackward(selection) ? domSelection.setBaseAndExtent(newDomRange.endContainer, newDomRange.endOffset, newDomRange.startContainer, newDomRange.startOffset) : domSelection.setBaseAndExtent(newDomRange.startContainer, newDomRange.startOffset, newDomRange.endContainer, newDomRange.endOffset), scrollSelectionIntoView(editor, newDomRange)) : domSelection.removeAllRanges(), newDomRange;
        }
      };
      domSelection.rangeCount <= 1 && setDomSelection();
      var ensureSelection = ((_androidInputManagerR2 = androidInputManagerRef.current) === null || _androidInputManagerR2 === void 0 ? void 0 : _androidInputManagerR2.isFlushing()) === "action";
      if (!IS_ANDROID || !ensureSelection) {
        setTimeout(() => {
          state.isUpdatingSelection = !1;
        });
        return;
      }
      var timeoutId = null, animationFrameId = requestAnimationFrame(() => {
        if (ensureSelection) {
          var ensureDomSelection = (forceChange) => {
            try {
              var el = ReactEditor.toDOMNode(editor, editor);
              el.focus(), setDomSelection(forceChange);
            } catch {
            }
          };
          ensureDomSelection(), timeoutId = setTimeout(() => {
            ensureDomSelection(!0), state.isUpdatingSelection = !1;
          });
        }
      });
      return () => {
        cancelAnimationFrame(animationFrameId), timeoutId && clearTimeout(timeoutId);
      };
    }
  });
  var onDOMBeforeInput = useCallback((event) => {
    handleNativeHistoryEvents(editor, event);
    var el = ReactEditor.toDOMNode(editor, editor), root = el.getRootNode();
    if (processing != null && processing.current && IS_WEBKIT && root instanceof ShadowRoot) {
      var ranges = event.getTargetRanges(), range2 = ranges[0], newRange = new window.Range();
      newRange.setStart(range2.startContainer, range2.startOffset), newRange.setEnd(range2.endContainer, range2.endOffset);
      var slateRange = ReactEditor.toSlateRange(editor, newRange, {
        exactMatch: !1,
        suppressThrow: !1
      });
      Transforms.select(editor, slateRange), event.preventDefault(), event.stopImmediatePropagation();
      return;
    }
    if (onUserInput(), !readOnly && ReactEditor.hasEditableTarget(editor, event.target) && !isDOMEventHandled(event, propsOnDOMBeforeInput)) {
      var _EDITOR_TO_USER_SELEC;
      if (androidInputManagerRef.current)
        return androidInputManagerRef.current.handleDOMBeforeInput(event);
      scheduleOnDOMSelectionChange.flush(), onDOMSelectionChange.flush();
      var {
        selection
      } = editor, {
        inputType: type
      } = event, data = event.dataTransfer || event.data || void 0, isCompositionChange = type === "insertCompositionText" || type === "deleteCompositionText";
      if (isCompositionChange && ReactEditor.isComposing(editor))
        return;
      var native = !1;
      if (type === "insertText" && selection && Range.isCollapsed(selection) && // Only use native character insertion for single characters a-z or space for now.
      // Long-press events (hold a + press 4 = ä) to choose a special character otherwise
      // causes duplicate inserts.
      event.data && event.data.length === 1 && /[a-z ]/i.test(event.data) && // Chrome has issues correctly editing the start of nodes: https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
      // When there is an inline element, e.g. a link, and you select
      // right after it (the start of the next node).
      selection.anchor.offset !== 0 && (native = !0, editor.marks && (native = !1), !IS_NODE_MAP_DIRTY.get(editor))) {
        var _node$parentElement, _window$getComputedSt, {
          anchor: anchor2
        } = selection, [node3, offset] = ReactEditor.toDOMPoint(editor, anchor2), anchorNode = (_node$parentElement = node3.parentElement) === null || _node$parentElement === void 0 ? void 0 : _node$parentElement.closest("a"), _window = ReactEditor.getWindow(editor);
        if (native && anchorNode && ReactEditor.hasDOMNode(editor, anchorNode)) {
          var _lastText$textContent, lastText = _window?.document.createTreeWalker(anchorNode, NodeFilter.SHOW_TEXT).lastChild();
          lastText === node3 && ((_lastText$textContent = lastText.textContent) === null || _lastText$textContent === void 0 ? void 0 : _lastText$textContent.length) === offset && (native = !1);
        }
        if (native && node3.parentElement && (_window == null || (_window$getComputedSt = _window.getComputedStyle(node3.parentElement)) === null || _window$getComputedSt === void 0 ? void 0 : _window$getComputedSt.whiteSpace) === "pre") {
          var block = Editor.above(editor, {
            at: anchor2.path,
            match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2)
          });
          block && Node.string(block[0]).includes("	") && (native = !1);
        }
      }
      if ((!type.startsWith("delete") || type.startsWith("deleteBy")) && !IS_NODE_MAP_DIRTY.get(editor)) {
        var [targetRange2] = event.getTargetRanges();
        if (targetRange2) {
          var _range = ReactEditor.toSlateRange(editor, targetRange2, {
            exactMatch: !1,
            suppressThrow: !1
          });
          if (!selection || !Range.equals(selection, _range)) {
            native = !1;
            var selectionRef = !isCompositionChange && editor.selection && Editor.rangeRef(editor, editor.selection);
            Transforms.select(editor, _range), selectionRef && EDITOR_TO_USER_SELECTION.set(editor, selectionRef);
          }
        }
      }
      if (isCompositionChange)
        return;
      if (native || event.preventDefault(), selection && Range.isExpanded(selection) && type.startsWith("delete")) {
        var direction = type.endsWith("Backward") ? "backward" : "forward";
        Editor.deleteFragment(editor, {
          direction
        });
        return;
      }
      switch (type) {
        case "deleteByComposition":
        case "deleteByCut":
        case "deleteByDrag": {
          Editor.deleteFragment(editor);
          break;
        }
        case "deleteContent":
        case "deleteContentForward": {
          Editor.deleteForward(editor);
          break;
        }
        case "deleteContentBackward": {
          Editor.deleteBackward(editor);
          break;
        }
        case "deleteEntireSoftLine": {
          Editor.deleteBackward(editor, {
            unit: "line"
          }), Editor.deleteForward(editor, {
            unit: "line"
          });
          break;
        }
        case "deleteHardLineBackward": {
          Editor.deleteBackward(editor, {
            unit: "block"
          });
          break;
        }
        case "deleteSoftLineBackward": {
          Editor.deleteBackward(editor, {
            unit: "line"
          });
          break;
        }
        case "deleteHardLineForward": {
          Editor.deleteForward(editor, {
            unit: "block"
          });
          break;
        }
        case "deleteSoftLineForward": {
          Editor.deleteForward(editor, {
            unit: "line"
          });
          break;
        }
        case "deleteWordBackward": {
          Editor.deleteBackward(editor, {
            unit: "word"
          });
          break;
        }
        case "deleteWordForward": {
          Editor.deleteForward(editor, {
            unit: "word"
          });
          break;
        }
        case "insertLineBreak":
          Editor.insertSoftBreak(editor);
          break;
        case "insertParagraph": {
          Editor.insertBreak(editor);
          break;
        }
        case "insertFromComposition":
        case "insertFromDrop":
        case "insertFromPaste":
        case "insertFromYank":
        case "insertReplacementText":
        case "insertText": {
          type === "insertFromComposition" && ReactEditor.isComposing(editor) && (setIsComposing(!1), IS_COMPOSING.set(editor, !1)), data?.constructor.name === "DataTransfer" ? ReactEditor.insertData(editor, data) : typeof data == "string" && (native ? deferredOperations.current.push(() => Editor.insertText(editor, data)) : Editor.insertText(editor, data));
          break;
        }
      }
      var toRestore = (_EDITOR_TO_USER_SELEC = EDITOR_TO_USER_SELECTION.get(editor)) === null || _EDITOR_TO_USER_SELEC === void 0 ? void 0 : _EDITOR_TO_USER_SELEC.unref();
      EDITOR_TO_USER_SELECTION.delete(editor), toRestore && (!editor.selection || !Range.equals(editor.selection, toRestore)) && Transforms.select(editor, toRestore);
    }
  }, [editor, onDOMSelectionChange, onUserInput, propsOnDOMBeforeInput, readOnly, scheduleOnDOMSelectionChange]), callbackRef = useCallback((node3) => {
    node3 == null ? (onDOMSelectionChange.cancel(), scheduleOnDOMSelectionChange.cancel(), EDITOR_TO_ELEMENT.delete(editor), NODE_TO_ELEMENT.delete(editor), ref.current && HAS_BEFORE_INPUT_SUPPORT && ref.current.removeEventListener("beforeinput", onDOMBeforeInput)) : HAS_BEFORE_INPUT_SUPPORT && node3.addEventListener("beforeinput", onDOMBeforeInput), ref.current = node3, typeof forwardedRef == "function" ? forwardedRef(node3) : forwardedRef && (forwardedRef.current = node3);
  }, [onDOMSelectionChange, scheduleOnDOMSelectionChange, editor, onDOMBeforeInput, forwardedRef]);
  useIsomorphicLayoutEffect(() => {
    var window2 = ReactEditor.getWindow(editor), onSelectionChange = (_ref) => {
      var {
        target
      } = _ref, targetElement = target instanceof HTMLElement ? target : null, targetTagName = targetElement?.tagName;
      targetTagName === "INPUT" || targetTagName === "TEXTAREA" || scheduleOnDOMSelectionChange();
    };
    window2.document.addEventListener("selectionchange", onSelectionChange);
    var stoppedDragging = () => {
      state.isDraggingInternally = !1;
    };
    return window2.document.addEventListener("dragend", stoppedDragging), window2.document.addEventListener("drop", stoppedDragging), () => {
      window2.document.removeEventListener("selectionchange", onSelectionChange), window2.document.removeEventListener("dragend", stoppedDragging), window2.document.removeEventListener("drop", stoppedDragging);
    };
  }, [scheduleOnDOMSelectionChange, state]);
  var decorations = decorate([editor, []]), decorateContext = useDecorateContext(decorate), showPlaceholder = placeholder && editor.children.length === 1 && Array.from(Node.texts(editor)).length === 1 && Node.string(editor) === "" && !isComposing, placeHolderResizeHandler = useCallback((placeholderEl) => {
    if (placeholderEl && showPlaceholder) {
      var _placeholderEl$getBou;
      setPlaceholderHeight((_placeholderEl$getBou = placeholderEl.getBoundingClientRect()) === null || _placeholderEl$getBou === void 0 ? void 0 : _placeholderEl$getBou.height);
    } else
      setPlaceholderHeight(void 0);
  }, [showPlaceholder]);
  if (showPlaceholder) {
    var start2 = Editor.start(editor, []);
    decorations.push({
      [PLACEHOLDER_SYMBOL]: !0,
      placeholder,
      onPlaceholderResize: placeHolderResizeHandler,
      anchor: start2,
      focus: start2
    });
  }
  var {
    marks: marks3
  } = editor;
  if (state.hasMarkPlaceholder = !1, editor.selection && Range.isCollapsed(editor.selection) && marks3) {
    var {
      anchor
    } = editor.selection, leaf3 = Node.leaf(editor, anchor.path), rest = _objectWithoutProperties(leaf3, _excluded2);
    if (!Text$1.equals(leaf3, marks3, {
      loose: !0
    })) {
      state.hasMarkPlaceholder = !0;
      var unset2 = Object.fromEntries(Object.keys(rest).map((mark) => [mark, null]));
      decorations.push(_objectSpread(_objectSpread(_objectSpread({
        [MARK_PLACEHOLDER_SYMBOL]: !0
      }, unset2), marks3), {}, {
        anchor,
        focus: anchor
      }));
    }
  }
  return useEffect(() => {
    setTimeout(() => {
      var {
        selection
      } = editor;
      if (selection) {
        var {
          anchor: _anchor
        } = selection, _text = Node.leaf(editor, _anchor.path);
        if (marks3 && !Text$1.equals(_text, marks3, {
          loose: !0
        })) {
          EDITOR_TO_PENDING_INSERTION_MARKS.set(editor, marks3);
          return;
        }
      }
      EDITOR_TO_PENDING_INSERTION_MARKS.delete(editor);
    });
  }), useFlushDeferredSelectorsOnRender(), /* @__PURE__ */ React.createElement(ReadOnlyContext.Provider, {
    value: readOnly
  }, /* @__PURE__ */ React.createElement(ComposingContext.Provider, {
    value: isComposing
  }, /* @__PURE__ */ React.createElement(DecorateContext.Provider, {
    value: decorateContext
  }, /* @__PURE__ */ React.createElement(RestoreDOM, {
    node: ref,
    receivedUserInput
  }, /* @__PURE__ */ React.createElement(Component2, _objectSpread(_objectSpread({
    role: readOnly ? void 0 : "textbox",
    "aria-multiline": readOnly ? void 0 : !0,
    translate: "no"
  }, attributes), {}, {
    // COMPAT: Certain browsers don't support the `beforeinput` event, so we'd
    // have to use hacks to make these replacement-based features work.
    // For SSR situations HAS_BEFORE_INPUT_SUPPORT is false and results in prop
    // mismatch warning app moves to browser. Pass-through consumer props when
    // not CAN_USE_DOM (SSR) and default to falsy value
    spellCheck: HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM ? attributes.spellCheck : !1,
    autoCorrect: HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM ? attributes.autoCorrect : "false",
    autoCapitalize: HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM ? attributes.autoCapitalize : "false",
    "data-slate-editor": !0,
    "data-slate-node": "value",
    // explicitly set this
    contentEditable: !readOnly,
    // in some cases, a decoration needs access to the range / selection to decorate a text node,
    // then you will select the whole text node when you select part the of text
    // this magic zIndex="-1" will fix it
    zindex: -1,
    suppressContentEditableWarning: !0,
    ref: callbackRef,
    style: _objectSpread(_objectSpread({}, disableDefaultStyles ? {} : _objectSpread({
      // Allow positioning relative to the editable element.
      position: "relative",
      // Preserve adjacent whitespace and new lines.
      whiteSpace: "pre-wrap",
      // Allow words to break if they are too long.
      wordWrap: "break-word"
    }, placeholderHeight ? {
      minHeight: placeholderHeight
    } : {})), userStyle),
    onBeforeInput: useCallback((event) => {
      if (!HAS_BEFORE_INPUT_SUPPORT && !readOnly && !isEventHandled(event, attributes.onBeforeInput) && ReactEditor.hasSelectableTarget(editor, event.target) && (event.preventDefault(), !ReactEditor.isComposing(editor))) {
        var _text2 = event.data;
        Editor.insertText(editor, _text2);
      }
    }, [attributes.onBeforeInput, editor, readOnly]),
    onInput: useCallback((event) => {
      if (!isEventHandled(event, attributes.onInput)) {
        if (androidInputManagerRef.current) {
          androidInputManagerRef.current.handleInput();
          return;
        }
        for (var op of deferredOperations.current)
          op();
        deferredOperations.current = [], ReactEditor.isFocused(editor) || handleNativeHistoryEvents(editor, event.nativeEvent);
      }
    }, [attributes.onInput, editor]),
    onBlur: useCallback((event) => {
      if (!(readOnly || state.isUpdatingSelection || !ReactEditor.hasSelectableTarget(editor, event.target) || isEventHandled(event, attributes.onBlur))) {
        var root = ReactEditor.findDocumentOrShadowRoot(editor);
        if (state.latestElement !== root.activeElement) {
          var {
            relatedTarget
          } = event, el = ReactEditor.toDOMNode(editor, editor);
          if (relatedTarget !== el && !(isDOMElement(relatedTarget) && relatedTarget.hasAttribute("data-slate-spacer"))) {
            if (relatedTarget != null && isDOMNode(relatedTarget) && ReactEditor.hasDOMNode(editor, relatedTarget)) {
              var node3 = ReactEditor.toSlateNode(editor, relatedTarget);
              if (Element$2.isElement(node3) && !editor.isVoid(node3))
                return;
            }
            if (IS_WEBKIT) {
              var domSelection = getSelection(root);
              domSelection?.removeAllRanges();
            }
            IS_FOCUSED.delete(editor);
          }
        }
      }
    }, [readOnly, state.isUpdatingSelection, state.latestElement, editor, attributes.onBlur]),
    onClick: useCallback((event) => {
      if (ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onClick) && isDOMNode(event.target)) {
        var node3 = ReactEditor.toSlateNode(editor, event.target), path3 = ReactEditor.findPath(editor, node3);
        if (!Editor.hasPath(editor, path3) || Node.get(editor, path3) !== node3)
          return;
        if (event.detail === TRIPLE_CLICK && path3.length >= 1) {
          var blockPath = path3;
          if (!(Element$2.isElement(node3) && Editor.isBlock(editor, node3))) {
            var _block$, block = Editor.above(editor, {
              match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
              at: path3
            });
            blockPath = (_block$ = block?.[1]) !== null && _block$ !== void 0 ? _block$ : path3.slice(0, 1);
          }
          var range2 = Editor.range(editor, blockPath);
          Transforms.select(editor, range2);
          return;
        }
        if (readOnly)
          return;
        var _start = Editor.start(editor, path3), end2 = Editor.end(editor, path3), startVoid = Editor.void(editor, {
          at: _start
        }), endVoid = Editor.void(editor, {
          at: end2
        });
        if (startVoid && endVoid && Path.equals(startVoid[1], endVoid[1])) {
          var _range2 = Editor.range(editor, _start);
          Transforms.select(editor, _range2);
        }
      }
    }, [editor, attributes.onClick, readOnly]),
    onCompositionEnd: useCallback((event) => {
      if (!isDOMEventTargetInput(event) && ReactEditor.hasSelectableTarget(editor, event.target)) {
        var _androidInputManagerR3;
        if (ReactEditor.isComposing(editor) && Promise.resolve().then(() => {
          setIsComposing(!1), IS_COMPOSING.set(editor, !1);
        }), (_androidInputManagerR3 = androidInputManagerRef.current) === null || _androidInputManagerR3 === void 0 || _androidInputManagerR3.handleCompositionEnd(event), isEventHandled(event, attributes.onCompositionEnd) || IS_ANDROID)
          return;
        if (!IS_WEBKIT && !IS_FIREFOX_LEGACY && !IS_IOS && !IS_WECHATBROWSER && !IS_UC_MOBILE && event.data) {
          var placeholderMarks = EDITOR_TO_PENDING_INSERTION_MARKS.get(editor);
          EDITOR_TO_PENDING_INSERTION_MARKS.delete(editor), placeholderMarks !== void 0 && (EDITOR_TO_USER_MARKS.set(editor, editor.marks), editor.marks = placeholderMarks), Editor.insertText(editor, event.data);
          var userMarks = EDITOR_TO_USER_MARKS.get(editor);
          EDITOR_TO_USER_MARKS.delete(editor), userMarks !== void 0 && (editor.marks = userMarks);
        }
      }
    }, [attributes.onCompositionEnd, editor]),
    onCompositionUpdate: useCallback((event) => {
      ReactEditor.hasSelectableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionUpdate) && !isDOMEventTargetInput(event) && (ReactEditor.isComposing(editor) || (setIsComposing(!0), IS_COMPOSING.set(editor, !0)));
    }, [attributes.onCompositionUpdate, editor]),
    onCompositionStart: useCallback((event) => {
      if (!isDOMEventTargetInput(event) && ReactEditor.hasSelectableTarget(editor, event.target)) {
        var _androidInputManagerR4;
        if ((_androidInputManagerR4 = androidInputManagerRef.current) === null || _androidInputManagerR4 === void 0 || _androidInputManagerR4.handleCompositionStart(event), isEventHandled(event, attributes.onCompositionStart) || IS_ANDROID)
          return;
        setIsComposing(!0);
        var {
          selection
        } = editor;
        if (selection && Range.isExpanded(selection)) {
          Editor.deleteFragment(editor);
          return;
        }
      }
    }, [attributes.onCompositionStart, editor]),
    onCopy: useCallback((event) => {
      ReactEditor.hasSelectableTarget(editor, event.target) && !isEventHandled(event, attributes.onCopy) && !isDOMEventTargetInput(event) && (event.preventDefault(), ReactEditor.setFragmentData(editor, event.clipboardData, "copy"));
    }, [attributes.onCopy, editor]),
    onCut: useCallback((event) => {
      if (!readOnly && ReactEditor.hasSelectableTarget(editor, event.target) && !isEventHandled(event, attributes.onCut) && !isDOMEventTargetInput(event)) {
        event.preventDefault(), ReactEditor.setFragmentData(editor, event.clipboardData, "cut");
        var {
          selection
        } = editor;
        if (selection)
          if (Range.isExpanded(selection))
            Editor.deleteFragment(editor);
          else {
            var node3 = Node.parent(editor, selection.anchor.path);
            Editor.isVoid(editor, node3) && Transforms.delete(editor);
          }
      }
    }, [readOnly, editor, attributes.onCut]),
    onDragOver: useCallback((event) => {
      if (ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDragOver)) {
        var node3 = ReactEditor.toSlateNode(editor, event.target);
        Element$2.isElement(node3) && Editor.isVoid(editor, node3) && event.preventDefault();
      }
    }, [attributes.onDragOver, editor]),
    onDragStart: useCallback((event) => {
      if (!readOnly && ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDragStart)) {
        var node3 = ReactEditor.toSlateNode(editor, event.target), path3 = ReactEditor.findPath(editor, node3), voidMatch = Element$2.isElement(node3) && Editor.isVoid(editor, node3) || Editor.void(editor, {
          at: path3,
          voids: !0
        });
        if (voidMatch) {
          var range2 = Editor.range(editor, path3);
          Transforms.select(editor, range2);
        }
        state.isDraggingInternally = !0, ReactEditor.setFragmentData(editor, event.dataTransfer, "drag");
      }
    }, [readOnly, editor, attributes.onDragStart, state]),
    onDrop: useCallback((event) => {
      if (!readOnly && ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDrop)) {
        event.preventDefault();
        var draggedRange = editor.selection, range2 = ReactEditor.findEventRange(editor, event), data = event.dataTransfer;
        Transforms.select(editor, range2), state.isDraggingInternally && draggedRange && !Range.equals(draggedRange, range2) && !Editor.void(editor, {
          at: range2,
          voids: !0
        }) && Transforms.delete(editor, {
          at: draggedRange
        }), ReactEditor.insertData(editor, data), ReactEditor.isFocused(editor) || ReactEditor.focus(editor);
      }
    }, [readOnly, editor, attributes.onDrop, state]),
    onDragEnd: useCallback((event) => {
      !readOnly && state.isDraggingInternally && attributes.onDragEnd && ReactEditor.hasTarget(editor, event.target) && attributes.onDragEnd(event);
    }, [readOnly, state, attributes, editor]),
    onFocus: useCallback((event) => {
      if (!readOnly && !state.isUpdatingSelection && ReactEditor.hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onFocus)) {
        var el = ReactEditor.toDOMNode(editor, editor), root = ReactEditor.findDocumentOrShadowRoot(editor);
        if (state.latestElement = root.activeElement, IS_FIREFOX && event.target !== el) {
          el.focus();
          return;
        }
        IS_FOCUSED.set(editor, !0);
      }
    }, [readOnly, state, editor, attributes.onFocus]),
    onKeyDown: useCallback((event) => {
      if (!readOnly && ReactEditor.hasEditableTarget(editor, event.target)) {
        var _androidInputManagerR5;
        (_androidInputManagerR5 = androidInputManagerRef.current) === null || _androidInputManagerR5 === void 0 || _androidInputManagerR5.handleKeyDown(event);
        var {
          nativeEvent
        } = event;
        if (ReactEditor.isComposing(editor) && nativeEvent.isComposing === !1 && (IS_COMPOSING.set(editor, !1), setIsComposing(!1)), isEventHandled(event, attributes.onKeyDown) || ReactEditor.isComposing(editor))
          return;
        var {
          selection
        } = editor, element = editor.children[selection !== null ? selection.focus.path[0] : 0], isRTL = getDirection(Node.string(element)) === "rtl";
        if (hotkeys.isRedo(nativeEvent)) {
          event.preventDefault();
          var maybeHistoryEditor = editor;
          typeof maybeHistoryEditor.redo == "function" && maybeHistoryEditor.redo();
          return;
        }
        if (hotkeys.isUndo(nativeEvent)) {
          event.preventDefault();
          var _maybeHistoryEditor = editor;
          typeof _maybeHistoryEditor.undo == "function" && _maybeHistoryEditor.undo();
          return;
        }
        if (hotkeys.isMoveLineBackward(nativeEvent)) {
          event.preventDefault(), Transforms.move(editor, {
            unit: "line",
            reverse: !0
          });
          return;
        }
        if (hotkeys.isMoveLineForward(nativeEvent)) {
          event.preventDefault(), Transforms.move(editor, {
            unit: "line"
          });
          return;
        }
        if (hotkeys.isExtendLineBackward(nativeEvent)) {
          event.preventDefault(), Transforms.move(editor, {
            unit: "line",
            edge: "focus",
            reverse: !0
          });
          return;
        }
        if (hotkeys.isExtendLineForward(nativeEvent)) {
          event.preventDefault(), Transforms.move(editor, {
            unit: "line",
            edge: "focus"
          });
          return;
        }
        if (hotkeys.isMoveBackward(nativeEvent)) {
          event.preventDefault(), selection && Range.isCollapsed(selection) ? Transforms.move(editor, {
            reverse: !isRTL
          }) : Transforms.collapse(editor, {
            edge: isRTL ? "end" : "start"
          });
          return;
        }
        if (hotkeys.isMoveForward(nativeEvent)) {
          event.preventDefault(), selection && Range.isCollapsed(selection) ? Transforms.move(editor, {
            reverse: isRTL
          }) : Transforms.collapse(editor, {
            edge: isRTL ? "start" : "end"
          });
          return;
        }
        if (hotkeys.isMoveWordBackward(nativeEvent)) {
          event.preventDefault(), selection && Range.isExpanded(selection) && Transforms.collapse(editor, {
            edge: "focus"
          }), Transforms.move(editor, {
            unit: "word",
            reverse: !isRTL
          });
          return;
        }
        if (hotkeys.isMoveWordForward(nativeEvent)) {
          event.preventDefault(), selection && Range.isExpanded(selection) && Transforms.collapse(editor, {
            edge: "focus"
          }), Transforms.move(editor, {
            unit: "word",
            reverse: isRTL
          });
          return;
        }
        if (HAS_BEFORE_INPUT_SUPPORT) {
          if ((IS_CHROME || IS_WEBKIT) && selection && (hotkeys.isDeleteBackward(nativeEvent) || hotkeys.isDeleteForward(nativeEvent)) && Range.isCollapsed(selection)) {
            var currentNode = Node.parent(editor, selection.anchor.path);
            if (Element$2.isElement(currentNode) && Editor.isVoid(editor, currentNode) && (Editor.isInline(editor, currentNode) || Editor.isBlock(editor, currentNode))) {
              event.preventDefault(), Editor.deleteBackward(editor, {
                unit: "block"
              });
              return;
            }
          }
        } else {
          if (hotkeys.isBold(nativeEvent) || hotkeys.isItalic(nativeEvent) || hotkeys.isTransposeCharacter(nativeEvent)) {
            event.preventDefault();
            return;
          }
          if (hotkeys.isSoftBreak(nativeEvent)) {
            event.preventDefault(), Editor.insertSoftBreak(editor);
            return;
          }
          if (hotkeys.isSplitBlock(nativeEvent)) {
            event.preventDefault(), Editor.insertBreak(editor);
            return;
          }
          if (hotkeys.isDeleteBackward(nativeEvent)) {
            event.preventDefault(), selection && Range.isExpanded(selection) ? Editor.deleteFragment(editor, {
              direction: "backward"
            }) : Editor.deleteBackward(editor);
            return;
          }
          if (hotkeys.isDeleteForward(nativeEvent)) {
            event.preventDefault(), selection && Range.isExpanded(selection) ? Editor.deleteFragment(editor, {
              direction: "forward"
            }) : Editor.deleteForward(editor);
            return;
          }
          if (hotkeys.isDeleteLineBackward(nativeEvent)) {
            event.preventDefault(), selection && Range.isExpanded(selection) ? Editor.deleteFragment(editor, {
              direction: "backward"
            }) : Editor.deleteBackward(editor, {
              unit: "line"
            });
            return;
          }
          if (hotkeys.isDeleteLineForward(nativeEvent)) {
            event.preventDefault(), selection && Range.isExpanded(selection) ? Editor.deleteFragment(editor, {
              direction: "forward"
            }) : Editor.deleteForward(editor, {
              unit: "line"
            });
            return;
          }
          if (hotkeys.isDeleteWordBackward(nativeEvent)) {
            event.preventDefault(), selection && Range.isExpanded(selection) ? Editor.deleteFragment(editor, {
              direction: "backward"
            }) : Editor.deleteBackward(editor, {
              unit: "word"
            });
            return;
          }
          if (hotkeys.isDeleteWordForward(nativeEvent)) {
            event.preventDefault(), selection && Range.isExpanded(selection) ? Editor.deleteFragment(editor, {
              direction: "forward"
            }) : Editor.deleteForward(editor, {
              unit: "word"
            });
            return;
          }
        }
      }
    }, [readOnly, editor, attributes.onKeyDown]),
    onPaste: useCallback((event) => {
      !readOnly && ReactEditor.hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onPaste) && (!HAS_BEFORE_INPUT_SUPPORT || isPlainTextOnlyPaste(event.nativeEvent) || IS_WEBKIT) && (event.preventDefault(), ReactEditor.insertData(editor, event.clipboardData));
    }, [readOnly, editor, attributes.onPaste])
  }), /* @__PURE__ */ React.createElement(Children, {
    decorations,
    node: editor,
    renderElement,
    renderChunk,
    renderPlaceholder,
    renderLeaf,
    renderText
  }))))));
}), DefaultPlaceholder = (_ref2) => {
  var {
    attributes,
    children
  } = _ref2;
  return (
    // COMPAT: Artificially add a line-break to the end on the placeholder element
    // to prevent Android IMEs to pick up its content in autocorrect and to auto-capitalize the first letter
    /* @__PURE__ */ React.createElement("span", _objectSpread({}, attributes), children, IS_ANDROID && /* @__PURE__ */ React.createElement("br", null))
  );
}, defaultDecorate = () => [], defaultScrollSelectionIntoView = (editor, domRange) => {
  var isBackward = !!editor.selection && Range.isBackward(editor.selection), domFocusPoint = domRange.cloneRange();
  if (domFocusPoint.collapse(isBackward), domFocusPoint.getBoundingClientRect) {
    var leafEl = domFocusPoint.startContainer.parentElement, domRect = domFocusPoint.getBoundingClientRect(), isZeroDimensionRect = domRect.width === 0 && domRect.height === 0 && domRect.x === 0 && domRect.y === 0;
    if (isZeroDimensionRect) {
      var leafRect = leafEl.getBoundingClientRect(), leafHasDimensions = leafRect.width > 0 || leafRect.height > 0;
      if (leafHasDimensions)
        return;
    }
    leafEl.getBoundingClientRect = domFocusPoint.getBoundingClientRect.bind(domFocusPoint), e(leafEl, {
      scrollMode: "if-needed"
    }), delete leafEl.getBoundingClientRect;
  }
}, isEventHandled = (event, handler) => {
  if (!handler)
    return !1;
  var shouldTreatEventAsHandled = handler(event);
  return shouldTreatEventAsHandled ?? (event.isDefaultPrevented() || event.isPropagationStopped());
}, isDOMEventTargetInput = (event) => isDOMNode(event.target) && (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement), isDOMEventHandled = (event, handler) => {
  if (!handler)
    return !1;
  var shouldTreatEventAsHandled = handler(event);
  return shouldTreatEventAsHandled ?? event.defaultPrevented;
}, handleNativeHistoryEvents = (editor, event) => {
  var maybeHistoryEditor = editor;
  if (event.inputType === "historyUndo" && typeof maybeHistoryEditor.undo == "function") {
    maybeHistoryEditor.undo();
    return;
  }
  if (event.inputType === "historyRedo" && typeof maybeHistoryEditor.redo == "function") {
    maybeHistoryEditor.redo();
    return;
  }
}, FocusedContext = /* @__PURE__ */ createContext(!1), REACT_MAJOR_VERSION = parseInt(React.version.split(".")[0], 10), _excluded = ["editor", "children", "onChange", "onSelectionChange", "onValueChange", "initialValue"], Slate = (props) => {
  var {
    editor,
    children,
    onChange,
    onSelectionChange,
    onValueChange,
    initialValue
  } = props, rest = _objectWithoutProperties(props, _excluded);
  React.useState(() => {
    if (!Node.isNodeList(initialValue))
      throw new Error("[Slate] initialValue is invalid! Expected a list of elements but got: ".concat(Scrubber.stringify(initialValue)));
    if (!Editor.isEditor(editor))
      throw new Error("[Slate] editor is invalid! You passed: ".concat(Scrubber.stringify(editor)));
    editor.children = initialValue, Object.assign(editor, rest);
  });
  var {
    selectorContext,
    onChange: handleSelectorChange
  } = useSelectorContext(), onContextChange = useCallback(() => {
    onChange && onChange(editor.children), onSelectionChange && editor.operations.find((op) => op.type === "set_selection") && onSelectionChange(editor.selection), onValueChange && editor.operations.find((op) => op.type !== "set_selection") && onValueChange(editor.children), handleSelectorChange();
  }, [editor, handleSelectorChange, onChange, onSelectionChange, onValueChange]);
  useEffect(() => (EDITOR_TO_ON_CHANGE.set(editor, onContextChange), () => {
    EDITOR_TO_ON_CHANGE.set(editor, () => {
    });
  }), [editor, onContextChange]);
  var [isFocused, setIsFocused] = useState(ReactEditor.isFocused(editor));
  return useEffect(() => {
    setIsFocused(ReactEditor.isFocused(editor));
  }, [editor]), useIsomorphicLayoutEffect(() => {
    var fn = () => setIsFocused(ReactEditor.isFocused(editor));
    return REACT_MAJOR_VERSION >= 17 ? (document.addEventListener("focusin", fn), document.addEventListener("focusout", fn), () => {
      document.removeEventListener("focusin", fn), document.removeEventListener("focusout", fn);
    }) : (document.addEventListener("focus", fn, !0), document.addEventListener("blur", fn, !0), () => {
      document.removeEventListener("focus", fn, !0), document.removeEventListener("blur", fn, !0);
    });
  }, []), /* @__PURE__ */ React.createElement(SlateSelectorContext.Provider, {
    value: selectorContext
  }, /* @__PURE__ */ React.createElement(EditorContext.Provider, {
    value: editor
  }, /* @__PURE__ */ React.createElement(FocusedContext.Provider, {
    value: isFocused
  }, children)));
}, useSelected = () => {
  var element = useElementIf();
  if (!element) return !1;
  var selector = useCallback((editor) => {
    if (!editor.selection) return !1;
    var path3 = ReactEditor.findPath(editor, element), range2 = Editor.range(editor, path3);
    return !!Range.intersection(range2, editor.selection);
  }, [element]);
  return useSlateSelector(selector, void 0, {
    // Defer the selector until after `Editable` has rendered so that the path
    // will be accurate.
    deferred: !0
  });
}, withReact = function(editor) {
  var clipboardFormatKey = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "x-slate-fragment", e2 = editor;
  e2 = withDOM(e2, clipboardFormatKey);
  var {
    onChange,
    apply: apply2,
    insertText: insertText3
  } = e2;
  return e2.getChunkSize = () => null, IS_ANDROID && (e2.insertText = (text, options) => (EDITOR_TO_PENDING_SELECTION.delete(e2), insertText3(text, options))), e2.onChange = (options) => {
    var maybeBatchUpdates = REACT_MAJOR_VERSION < 18 ? ReactDOM.unstable_batchedUpdates : (callback) => callback();
    maybeBatchUpdates(() => {
      onChange(options);
    });
  }, e2.apply = (operation) => {
    if (operation.type === "move_node") {
      var parent3 = Node.parent(e2, operation.path), chunking = !!e2.getChunkSize(parent3);
      if (chunking) {
        var node3 = Node.get(e2, operation.path), chunkTree = getChunkTreeForNode(e2, parent3), key = ReactEditor.findKey(e2, node3);
        chunkTree.movedNodeKeys.add(key);
      }
    }
    apply2(operation);
  }, e2;
};
const rootName = "sanity-pte:";
debug$i(rootName);
function debugWithName(name) {
  const namespace = `${rootName}${name}`;
  return debug$i && debug$i.enabled(namespace) ? debug$i(namespace) : debug$i(rootName);
}
const VOID_CHILD_KEY = "void-child";
function keepObjectEquality(object, keyMap) {
  const value = keyMap[object._key];
  return value && isEqual(object, value) ? value : (keyMap[object._key] = object, object);
}
function toSlateBlock(block, {
  schemaTypes
}, keyMap = {}) {
  const {
    _type,
    _key,
    ...rest
  } = block;
  if (block && block._type === schemaTypes.block.name) {
    const textBlock = block;
    let hasInlines2 = !1;
    const hasMissingMarkDefs = typeof textBlock.markDefs > "u", hasMissingChildren = typeof textBlock.children > "u", children = (textBlock.children || []).map((child) => {
      const {
        _type: childType,
        _key: childKey,
        ...childProps
      } = child, propKeys = Object.keys(childProps);
      return childType === void 0 && propKeys.length === 1 && propKeys.at(0) === "text" ? {
        _key: childKey,
        _type: schemaTypes.span.name,
        text: childProps.text
      } : childType !== schemaTypes.span.name ? (hasInlines2 = !0, keepObjectEquality({
        _type: childType,
        _key: childKey,
        children: [{
          _key: VOID_CHILD_KEY,
          _type: schemaTypes.span.name,
          text: "",
          marks: []
        }],
        value: childProps,
        __inline: !0
      }, keyMap)) : child;
    });
    return !hasMissingMarkDefs && !hasMissingChildren && !hasInlines2 && Element$2.isElement(block) ? block : keepObjectEquality({
      _type,
      _key,
      ...rest,
      children
    }, keyMap);
  }
  return keepObjectEquality({
    _type,
    _key,
    children: [{
      _key: VOID_CHILD_KEY,
      _type: "span",
      text: "",
      marks: []
    }],
    value: rest
  }, keyMap);
}
function fromSlateBlock(block, textBlockType, keyMap = {}) {
  const {
    _key,
    _type
  } = block;
  if (!_key || !_type)
    throw new Error("Not a valid block");
  if (_type === textBlockType && "children" in block && Array.isArray(block.children) && _key) {
    let hasInlines2 = !1;
    const children = block.children.map((child) => {
      const {
        _type: _cType
      } = child;
      if ("value" in child && _cType !== "span") {
        hasInlines2 = !0;
        const {
          value: v,
          _key: k,
          _type: t2,
          __inline: _i,
          children: _c,
          ...rest
        } = child;
        return keepObjectEquality({
          ...rest,
          ...v,
          _key: k,
          _type: t2
        }, keyMap);
      }
      return child;
    });
    return hasInlines2 ? keepObjectEquality({
      ...block,
      children,
      _key,
      _type
    }, keyMap) : block;
  }
  const blockValue = "value" in block && block.value;
  return keepObjectEquality({
    _key,
    _type,
    ...typeof blockValue == "object" ? blockValue : {}
  }, keyMap);
}
function isEqualToEmptyEditor(initialValue, blocks, schemaTypes) {
  if (!blocks || blocks.length !== 1)
    return !1;
  const firstBlock = blocks.at(0);
  if (!firstBlock)
    return !0;
  if (!Element$2.isElement(firstBlock) || firstBlock._type !== schemaTypes.block.name || "listItem" in firstBlock || !("style" in firstBlock) || firstBlock.style !== schemaTypes.styles.at(0)?.name || !Array.isArray(firstBlock.children) || firstBlock.children.length !== 1)
    return !1;
  const firstChild = firstBlock.children.at(0);
  return !(!firstChild || !Text$1.isText(firstChild) || !("_type" in firstChild) || firstChild._type !== schemaTypes.span.name || firstChild.text !== "" || firstChild.marks?.join("") || Object.keys(firstBlock).some((key) => key !== "_type" && key !== "_key" && key !== "children" && key !== "markDefs" && key !== "style") || isEqual(initialValue, [firstBlock]));
}
function getFocusBlock({
  editor
}) {
  if (!editor.selection)
    return [void 0, void 0];
  try {
    return Editor.node(editor, editor.selection.focus.path.slice(0, 1)) ?? [void 0, void 0];
  } catch {
    return [void 0, void 0];
  }
}
function getFocusSpan({
  editor
}) {
  if (!editor.selection)
    return [void 0, void 0];
  try {
    const [focusBlock] = getFocusBlock({
      editor
    });
    if (!focusBlock)
      return [void 0, void 0];
    if (!editor.isTextBlock(focusBlock))
      return [void 0, void 0];
    const [node3, path3] = Editor.node(editor, editor.selection.focus.path.slice(0, 2));
    if (editor.isTextSpan(node3))
      return [node3, path3];
  } catch {
    return [void 0, void 0];
  }
  return [void 0, void 0];
}
function getPointBlock({
  editor,
  point: point3
}) {
  try {
    const [block] = Editor.node(editor, point3.path.slice(0, 1)) ?? [void 0, void 0];
    return block ? [block, point3.path.slice(0, 1)] : [void 0, void 0];
  } catch {
    return [void 0, void 0];
  }
}
function getFocusChild({
  editor
}) {
  const [focusBlock, focusBlockPath] = getFocusBlock({
    editor
  }), childIndex = editor.selection?.focus.path.at(1);
  if (!focusBlock || !focusBlockPath || childIndex === void 0)
    return [void 0, void 0];
  try {
    const focusChild = Node.child(focusBlock, childIndex);
    return focusChild ? [focusChild, [...focusBlockPath, childIndex]] : [void 0, void 0];
  } catch {
    return [void 0, void 0];
  }
}
function getPointChild({
  editor,
  point: point3
}) {
  const [block, blockPath] = getPointBlock({
    editor,
    point: point3
  }), childIndex = point3.path.at(1);
  if (!block || !blockPath || childIndex === void 0)
    return [void 0, void 0];
  try {
    const pointChild = Node.child(block, childIndex);
    return pointChild ? [pointChild, [...blockPath, childIndex]] : [void 0, void 0];
  } catch {
    return [void 0, void 0];
  }
}
function getFirstBlock({
  editor
}) {
  if (editor.children.length === 0)
    return [void 0, void 0];
  const firstBlockPath = Editor.start(editor, []).path.at(0);
  try {
    return firstBlockPath !== void 0 ? Editor.node(editor, [firstBlockPath]) ?? [void 0, void 0] : [void 0, void 0];
  } catch {
    return [void 0, void 0];
  }
}
function getLastBlock({
  editor
}) {
  if (editor.children.length === 0)
    return [void 0, void 0];
  const lastBlockPath = Editor.end(editor, []).path.at(0);
  try {
    return lastBlockPath !== void 0 ? Editor.node(editor, [lastBlockPath]) ?? [void 0, void 0] : [void 0, void 0];
  } catch {
    return [void 0, void 0];
  }
}
function getNodeBlock({
  editor,
  schema,
  node: node3
}) {
  if (Editor.isEditor(node3))
    return;
  if (isBlockElement({
    editor,
    schema
  }, node3))
    return elementToBlock({
      schema,
      element: node3
    });
  const parent3 = Array.from(Editor.nodes(editor, {
    mode: "highest",
    at: [],
    match: (n2) => isBlockElement({
      editor,
      schema
    }, n2) && n2.children.some((child) => child._key === node3._key)
  })).at(0)?.at(0);
  return Element$2.isElement(parent3) ? elementToBlock({
    schema,
    element: parent3
  }) : void 0;
}
function elementToBlock({
  schema,
  element
}) {
  return fromSlateBlock(element, schema.block.name);
}
function isBlockElement({
  editor,
  schema
}, node3) {
  return Element$2.isElement(node3) && !editor.isInline(node3) && (schema.block.name === node3._type || schema.blockObjects.some((blockObject) => blockObject.name === node3._type));
}
function isListItemActive({
  editor,
  listItem
}) {
  if (!editor.selection)
    return !1;
  const selectedBlocks = [...Editor.nodes(editor, {
    at: editor.selection,
    match: (node3) => editor.isTextBlock(node3)
  })];
  return selectedBlocks.length > 0 ? selectedBlocks.every(([node3]) => editor.isListBlock(node3) && node3.listItem === listItem) : !1;
}
function isStyleActive({
  editor,
  style
}) {
  if (!editor.selection)
    return !1;
  const selectedBlocks = [...Editor.nodes(editor, {
    at: editor.selection,
    match: (node3) => editor.isTextBlock(node3)
  })];
  return selectedBlocks.length > 0 ? selectedBlocks.every(([node3]) => node3.style === style) : !1;
}
function slateRangeToSelection({
  schema,
  editor,
  range: range2
}) {
  const [anchorBlock] = getPointBlock({
    editor,
    point: range2.anchor
  }), [focusBlock] = getPointBlock({
    editor,
    point: range2.focus
  });
  if (!anchorBlock || !focusBlock)
    return null;
  const [anchorChild] = anchorBlock._type === schema.block.name ? getPointChild({
    editor,
    point: range2.anchor
  }) : [void 0, void 0], [focusChild] = focusBlock._type === schema.block.name ? getPointChild({
    editor,
    point: range2.focus
  }) : [void 0, void 0], selection = {
    anchor: {
      path: [{
        _key: anchorBlock._key
      }],
      offset: range2.anchor.offset
    },
    focus: {
      path: [{
        _key: focusBlock._key
      }],
      offset: range2.focus.offset
    },
    backward: Range.isBackward(range2)
  };
  return anchorChild && (selection.anchor.path.push("children"), selection.anchor.path.push({
    _key: anchorChild._key
  })), focusChild && (selection.focus.path.push("children"), selection.focus.path.push({
    _key: focusChild._key
  })), selection;
}
function getEventPosition({
  editorActor,
  slateEditor,
  event
}) {
  if (editorActor.getSnapshot().matches({
    setup: "setting up"
  }))
    return;
  const eventNode = getEventNode({
    slateEditor,
    event
  });
  if (!eventNode)
    return;
  const eventBlock = getNodeBlock({
    editor: slateEditor,
    schema: editorActor.getSnapshot().context.schema,
    node: eventNode
  }), eventPositionBlock = getEventPositionBlock({
    node: eventNode,
    slateEditor,
    event
  }), eventSelection = getEventSelection({
    schema: editorActor.getSnapshot().context.schema,
    slateEditor,
    event
  });
  if (eventBlock && eventPositionBlock && !eventSelection && !Editor.isEditor(eventNode))
    return {
      block: eventPositionBlock,
      isEditor: !1,
      selection: {
        anchor: getBlockStartPoint({
          context: editorActor.getSnapshot().context,
          block: {
            node: eventBlock,
            path: [{
              _key: eventBlock._key
            }]
          }
        }),
        focus: getBlockEndPoint({
          context: editorActor.getSnapshot().context,
          block: {
            node: eventBlock,
            path: [{
              _key: eventBlock._key
            }]
          }
        })
      }
    };
  if (!eventPositionBlock || !eventSelection)
    return;
  const eventSelectionFocusBlockKey = getBlockKeyFromSelectionPoint(eventSelection.focus);
  if (eventSelectionFocusBlockKey !== void 0)
    return isSelectionCollapsed(eventSelection) && eventBlock && eventSelectionFocusBlockKey !== eventBlock._key ? {
      block: eventPositionBlock,
      isEditor: !1,
      selection: {
        anchor: getBlockStartPoint({
          context: editorActor.getSnapshot().context,
          block: {
            node: eventBlock,
            path: [{
              _key: eventBlock._key
            }]
          }
        }),
        focus: getBlockEndPoint({
          context: editorActor.getSnapshot().context,
          block: {
            node: eventBlock,
            path: [{
              _key: eventBlock._key
            }]
          }
        })
      }
    } : {
      block: eventPositionBlock,
      isEditor: Editor.isEditor(eventNode),
      selection: eventSelection
    };
}
function getEventNode({
  slateEditor,
  event
}) {
  if (!DOMEditor.hasTarget(slateEditor, event.target))
    return;
  let node3;
  try {
    node3 = DOMEditor.toSlateNode(slateEditor, event.target);
  } catch (error) {
    console.error(error);
  }
  return node3;
}
function getEventPositionBlock({
  node: node3,
  slateEditor,
  event
}) {
  const [firstBlock] = getFirstBlock({
    editor: slateEditor
  });
  if (!firstBlock)
    return;
  let firstBlockElement;
  try {
    firstBlockElement = DOMEditor.toDOMNode(slateEditor, firstBlock);
  } catch (error) {
    console.error(error);
  }
  if (!firstBlockElement)
    return;
  const firstBlockRect = firstBlockElement.getBoundingClientRect();
  if (event.pageY < firstBlockRect.top)
    return "start";
  const [lastBlock] = getLastBlock({
    editor: slateEditor
  });
  if (!lastBlock)
    return;
  let lastBlockElement;
  try {
    lastBlockElement = DOMEditor.toDOMNode(slateEditor, lastBlock);
  } catch (error) {
    console.error(error);
  }
  if (!lastBlockElement)
    return;
  const lastBlockRef = lastBlockElement.getBoundingClientRect();
  if (event.pageY > lastBlockRef.bottom)
    return "end";
  let element;
  try {
    element = DOMEditor.toDOMNode(slateEditor, node3);
  } catch (error) {
    console.error(error);
  }
  if (!element)
    return;
  const elementRect = element.getBoundingClientRect(), top = elementRect.top, height = elementRect.height;
  return Math.abs(top - event.pageY) < height / 2 ? "start" : "end";
}
function getEventSelection({
  schema,
  slateEditor,
  event
}) {
  const range2 = getSlateRangeFromEvent(slateEditor, event);
  return range2 ? slateRangeToSelection({
    schema,
    editor: slateEditor,
    range: range2
  }) : null;
}
function getSlateRangeFromEvent(editor, event) {
  if (!event.target || !isDOMNode(event.target))
    return;
  const window2 = DOMEditor.getWindow(editor);
  let domRange;
  if (window2.document.caretPositionFromPoint !== void 0) {
    const position = window2.document.caretPositionFromPoint(event.clientX, event.clientY);
    if (position)
      try {
        domRange = window2.document.createRange(), domRange.setStart(position.offsetNode, position.offset), domRange.setEnd(position.offsetNode, position.offset);
      } catch {
      }
  } else if (window2.document.caretRangeFromPoint !== void 0)
    domRange = window2.document.caretRangeFromPoint(event.clientX, event.clientY) ?? void 0;
  else {
    console.warn("Neither caretPositionFromPoint nor caretRangeFromPoint is supported");
    return;
  }
  if (!domRange)
    return;
  let range2;
  try {
    range2 = DOMEditor.toSlateRange(editor, domRange, {
      exactMatch: !1,
      // It can still throw even with this option set to true
      suppressThrow: !1
    });
  } catch {
  }
  return range2;
}
function normalizePoint(point3, value) {
  if (!point3 || !value)
    return null;
  const newPath = [];
  let newOffset = point3.offset || 0;
  const blockKey = typeof point3.path[0] == "object" && "_key" in point3.path[0] && point3.path[0]._key, childKey = typeof point3.path[2] == "object" && "_key" in point3.path[2] && point3.path[2]._key, block = value.find((blk) => blk._key === blockKey);
  if (block)
    newPath.push({
      _key: block._key
    });
  else
    return null;
  if (block && point3.path[1] === "children") {
    if (!block.children || Array.isArray(block.children) && block.children.length === 0)
      return null;
    const child = Array.isArray(block.children) && block.children.find((cld) => cld._key === childKey);
    if (child)
      newPath.push("children"), newPath.push({
        _key: child._key
      }), newOffset = child.text && child.text.length >= point3.offset ? point3.offset : child.text && child.text.length || 0;
    else
      return null;
  }
  return {
    path: newPath,
    offset: newOffset
  };
}
function normalizeSelection(selection, value) {
  if (!selection || !value || value.length === 0)
    return null;
  let newAnchor = null, newFocus = null;
  const {
    anchor,
    focus: focus2
  } = selection;
  return anchor && value.find((blk) => isEqual({
    _key: blk._key
  }, anchor.path[0])) && (newAnchor = normalizePoint(anchor, value)), focus2 && value.find((blk) => isEqual({
    _key: blk._key
  }, focus2.path[0])) && (newFocus = normalizePoint(focus2, value)), newAnchor && newFocus ? {
    anchor: newAnchor,
    focus: newFocus,
    backward: selection.backward
  } : null;
}
function toSlateRange(snapshot) {
  if (!snapshot.context.selection)
    return null;
  if (isEqualSelectionPoints(snapshot.context.selection.anchor, snapshot.context.selection.focus)) {
    const anchorPoint2 = toSlateSelectionPoint(snapshot, snapshot.context.selection.anchor, snapshot.context.selection.backward ? "backward" : "forward");
    return anchorPoint2 ? {
      anchor: anchorPoint2,
      focus: anchorPoint2
    } : null;
  }
  const anchorPoint = toSlateSelectionPoint(snapshot, snapshot.context.selection.anchor, snapshot.context.selection.backward ? "forward" : "backward"), focusPoint = toSlateSelectionPoint(snapshot, snapshot.context.selection.focus, snapshot.context.selection.backward ? "backward" : "forward");
  return !anchorPoint || !focusPoint ? null : {
    anchor: anchorPoint,
    focus: focusPoint
  };
}
function toSlateSelectionPoint(snapshot, selectionPoint, direction) {
  const blockKey = getBlockKeyFromSelectionPoint(selectionPoint);
  if (!blockKey)
    return;
  const blockIndex = snapshot.blockIndexMap.get(blockKey);
  if (blockIndex === void 0)
    return;
  const block = snapshot.context.value.at(blockIndex);
  if (!block)
    return;
  if (!isTextBlock(snapshot.context, block))
    return {
      path: [blockIndex, 0],
      offset: 0
    };
  let childKey = getChildKeyFromSelectionPoint({
    path: selectionPoint.path
  });
  const spanSelectionPoint = childKey ? void 0 : blockOffsetToSpanSelectionPoint({
    context: {
      schema: snapshot.context.schema,
      value: [block]
    },
    blockOffset: {
      path: [{
        _key: blockKey
      }],
      offset: selectionPoint.offset
    },
    direction
  });
  if (childKey = spanSelectionPoint ? getChildKeyFromSelectionPoint(spanSelectionPoint) : childKey, !childKey)
    return {
      path: [blockIndex, 0],
      offset: 0
    };
  let offset = spanSelectionPoint?.offset ?? selectionPoint.offset, childPath = [], childIndex = -1, pathChild;
  for (const child of block.children)
    if (childIndex++, child._key === childKey) {
      pathChild = child, isSpan(snapshot.context, child) ? childPath = [childIndex] : (childPath = [childIndex, 0], offset = 0);
      break;
    }
  return childPath.length === 0 ? {
    path: [blockIndex, 0],
    offset: 0
  } : {
    path: [blockIndex].concat(childPath),
    offset: isSpan(snapshot.context, pathChild) ? Math.min(pathChild.text.length, offset) : offset
  };
}
const EditorActorContext = createContext({});
function DropIndicator() {
  const $ = c(1);
  let t0;
  return $[0] === Symbol.for("react.memo_cache_sentinel") ? (t0 = /* @__PURE__ */ jsx("div", { contentEditable: !1, className: "pt-drop-indicator", style: {
    position: "absolute",
    width: "100%",
    height: 1,
    borderBottom: "1px solid currentColor",
    zIndex: 5
  }, children: /* @__PURE__ */ jsx("span", {}) }), $[0] = t0) : t0 = $[0], t0;
}
function RenderDefaultBlockObject(props) {
  const $ = c(4);
  let t0;
  $[0] === Symbol.for("react.memo_cache_sentinel") ? (t0 = {
    userSelect: "none"
  }, $[0] = t0) : t0 = $[0];
  let t1;
  return $[1] !== props.blockObject._key || $[2] !== props.blockObject._type ? (t1 = /* @__PURE__ */ jsxs("div", { style: t0, children: [
    "[",
    props.blockObject._type,
    ": ",
    props.blockObject._key,
    "]"
  ] }), $[1] = props.blockObject._key, $[2] = props.blockObject._type, $[3] = t1) : t1 = $[3], t1;
}
function RenderDefaultInlineObject(props) {
  const $ = c(4);
  let t0;
  $[0] === Symbol.for("react.memo_cache_sentinel") ? (t0 = {
    userSelect: "none"
  }, $[0] = t0) : t0 = $[0];
  let t1;
  return $[1] !== props.inlineObject._key || $[2] !== props.inlineObject._type ? (t1 = /* @__PURE__ */ jsxs("span", { style: t0, children: [
    "[",
    props.inlineObject._type,
    ": ",
    props.inlineObject._key,
    "]"
  ] }), $[1] = props.inlineObject._key, $[2] = props.inlineObject._type, $[3] = t1) : t1 = $[3], t1;
}
function createEditorPriority(config) {
  return {
    id: defaultKeyGenerator(),
    name: config?.name,
    reference: config?.reference
  };
}
const corePriority = createEditorPriority({
  name: "core"
});
function getDragSelection({
  eventSelection,
  snapshot
}) {
  let dragSelection = eventSelection;
  if (getFocusInlineObject({
    ...snapshot,
    context: {
      ...snapshot.context,
      selection: eventSelection
    }
  }))
    return dragSelection;
  const draggingCollapsedSelection = isSelectionCollapsed$1({
    context: {
      ...snapshot.context,
      selection: eventSelection
    }
  }), draggedTextBlock = getFocusTextBlock({
    ...snapshot,
    context: {
      ...snapshot.context,
      selection: eventSelection
    }
  }), draggedSpan = getFocusSpan$1({
    ...snapshot,
    context: {
      ...snapshot.context,
      selection: eventSelection
    }
  });
  draggingCollapsedSelection && draggedTextBlock && draggedSpan && (dragSelection = {
    anchor: getBlockStartPoint({
      context: snapshot.context,
      block: draggedTextBlock
    }),
    focus: getBlockEndPoint({
      context: snapshot.context,
      block: draggedTextBlock
    })
  });
  const selectedBlocks = getSelectedBlocks(snapshot);
  if (snapshot.context.selection && isSelectionExpanded(snapshot) && selectedBlocks.length > 1) {
    const selectionStartBlock = getSelectionStartBlock(snapshot), selectionEndBlock = getSelectionEndBlock(snapshot);
    if (!selectionStartBlock || !selectionEndBlock)
      return dragSelection;
    const selectionStartPoint = getBlockStartPoint({
      context: snapshot.context,
      block: selectionStartBlock
    }), selectionEndPoint = getBlockEndPoint({
      context: snapshot.context,
      block: selectionEndBlock
    });
    isOverlappingSelection(eventSelection)({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: {
          anchor: selectionStartPoint,
          focus: selectionEndPoint
        }
      }
    }) && (dragSelection = {
      anchor: selectionStartPoint,
      focus: selectionEndPoint
    });
  }
  return dragSelection;
}
function createCoreBlockElementBehaviorsConfig({
  key,
  onSetDragPositionBlock
}) {
  return [{
    behavior: defineBehavior({
      on: "drag.dragover",
      guard: ({
        snapshot,
        event
      }) => {
        const dropFocusBlock = getFocusBlock$1({
          ...snapshot,
          context: {
            ...snapshot.context,
            selection: event.position.selection
          }
        });
        if (!dropFocusBlock || dropFocusBlock.node._key !== key)
          return !1;
        const dragOrigin = event.dragOrigin;
        if (!dragOrigin)
          return !1;
        const dragSelection = getDragSelection({
          eventSelection: dragOrigin.selection,
          snapshot
        });
        return getSelectedBlocks({
          ...snapshot,
          context: {
            ...snapshot.context,
            selection: dragSelection
          }
        }).some((draggedBlock) => draggedBlock.node._key === key) ? !1 : isSelectingEntireBlocks({
          ...snapshot,
          context: {
            ...snapshot.context,
            selection: dragSelection
          }
        });
      },
      actions: [({
        event
      }) => [{
        type: "effect",
        effect: () => {
          onSetDragPositionBlock(event.position.block);
        }
      }]]
    }),
    priority: createEditorPriority({
      reference: {
        priority: corePriority,
        importance: "lower"
      }
    })
  }, {
    behavior: defineBehavior({
      on: "drag.*",
      guard: ({
        event
      }) => event.type !== "drag.dragover",
      actions: [({
        event
      }) => [{
        type: "effect",
        effect: () => {
          onSetDragPositionBlock(void 0);
        }
      }, forward(event)]]
    }),
    priority: createEditorPriority({
      reference: {
        priority: corePriority,
        importance: "lower"
      }
    })
  }];
}
function useCoreBlockElementBehaviors(t0) {
  const $ = c(5), {
    key,
    onSetDragPositionBlock
  } = t0, editorActor = useContext(EditorActorContext);
  let t1, t2;
  $[0] !== editorActor || $[1] !== key || $[2] !== onSetDragPositionBlock ? (t1 = () => {
    const behaviorConfigs = createCoreBlockElementBehaviorsConfig({
      key,
      onSetDragPositionBlock
    });
    for (const behaviorConfig of behaviorConfigs)
      editorActor.send({
        type: "add behavior",
        behaviorConfig
      });
    return () => {
      for (const behaviorConfig_0 of behaviorConfigs)
        editorActor.send({
          type: "remove behavior",
          behaviorConfig: behaviorConfig_0
        });
    };
  }, t2 = [editorActor, key, onSetDragPositionBlock], $[0] = editorActor, $[1] = key, $[2] = onSetDragPositionBlock, $[3] = t1, $[4] = t2) : (t1 = $[3], t2 = $[4]), useEffect(t1, t2);
}
function RenderBlockObject(props) {
  const $ = c(35), [dragPositionBlock, setDragPositionBlock] = useState(), blockObjectRef = useRef(null), selected = useSelected();
  let t0;
  $[0] !== selected ? (t0 = (editor) => selected && editor.selection !== null && Range.isCollapsed(editor.selection), $[0] = selected, $[1] = t0) : t0 = $[1];
  const focused = useSlateSelector(t0);
  let t1;
  $[2] !== props.element._key ? (t1 = {
    key: props.element._key,
    onSetDragPositionBlock: setDragPositionBlock
  }, $[2] = props.element._key, $[3] = t1) : t1 = $[3], useCoreBlockElementBehaviors(t1);
  let t2;
  if ($[4] !== props.element._type || $[5] !== props.legacySchema.blockObjects) {
    let t32;
    $[7] !== props.element._type ? (t32 = (schemaType) => schemaType.name === props.element._type, $[7] = props.element._type, $[8] = t32) : t32 = $[8], t2 = props.legacySchema.blockObjects.find(t32), $[4] = props.element._type, $[5] = props.legacySchema.blockObjects, $[6] = t2;
  } else
    t2 = $[6];
  const legacySchemaType = t2;
  legacySchemaType || console.error(`Unable to find Block Object "${props.element._type}" in Schema`);
  let t3;
  $[9] !== props.blockObject || $[10] !== props.element._key || $[11] !== props.element._type ? (t3 = props.blockObject ?? {
    _key: props.element._key,
    _type: props.element._type
  }, $[9] = props.blockObject, $[10] = props.element._key, $[11] = props.element._type, $[12] = t3) : t3 = $[12];
  const blockObject = t3;
  let t4;
  $[13] !== dragPositionBlock ? (t4 = dragPositionBlock === "start" ? /* @__PURE__ */ jsx(DropIndicator, {}) : null, $[13] = dragPositionBlock, $[14] = t4) : t4 = $[14];
  const t5 = !props.readOnly;
  let t6;
  $[15] !== blockObject || $[16] !== focused || $[17] !== legacySchemaType || $[18] !== props.element._key || $[19] !== props.renderBlock || $[20] !== selected ? (t6 = props.renderBlock && legacySchemaType ? /* @__PURE__ */ jsx(RenderBlock$1, { renderBlock: props.renderBlock, editorElementRef: blockObjectRef, focused, path: [{
    _key: props.element._key
  }], schemaType: legacySchemaType, selected, type: legacySchemaType, value: blockObject, children: /* @__PURE__ */ jsx(RenderDefaultBlockObject, { blockObject }) }) : /* @__PURE__ */ jsx(RenderDefaultBlockObject, { blockObject }), $[15] = blockObject, $[16] = focused, $[17] = legacySchemaType, $[18] = props.element._key, $[19] = props.renderBlock, $[20] = selected, $[21] = t6) : t6 = $[21];
  let t7;
  $[22] !== t5 || $[23] !== t6 ? (t7 = /* @__PURE__ */ jsx("div", { ref: blockObjectRef, contentEditable: !1, draggable: t5, children: t6 }), $[22] = t5, $[23] = t6, $[24] = t7) : t7 = $[24];
  let t8;
  $[25] !== dragPositionBlock ? (t8 = dragPositionBlock === "end" ? /* @__PURE__ */ jsx(DropIndicator, {}) : null, $[25] = dragPositionBlock, $[26] = t8) : t8 = $[26];
  let t9;
  return $[27] !== props.attributes || $[28] !== props.children || $[29] !== props.element._key || $[30] !== props.element._type || $[31] !== t4 || $[32] !== t7 || $[33] !== t8 ? (t9 = /* @__PURE__ */ jsxs("div", { ...props.attributes, className: "pt-block pt-object-block", "data-block-key": props.element._key, "data-block-name": props.element._type, "data-block-type": "object", children: [
    t4,
    props.children,
    t7,
    t8
  ] }), $[27] = props.attributes, $[28] = props.children, $[29] = props.element._key, $[30] = props.element._type, $[31] = t4, $[32] = t7, $[33] = t8, $[34] = t9) : t9 = $[34], t9;
}
function RenderBlock$1({
  renderBlock,
  children,
  editorElementRef,
  focused,
  path: path3,
  schemaType,
  selected,
  type,
  value
}) {
  return renderBlock({
    children,
    editorElementRef,
    focused,
    path: path3,
    schemaType,
    selected,
    type,
    value
  });
}
function RenderInlineObject(props) {
  const $ = c(32), inlineObjectRef = useRef(null), slateEditor = useSlateStatic(), selected = useSelected();
  let t0;
  $[0] !== selected ? (t0 = (editor) => selected && editor.selection !== null && Range.isCollapsed(editor.selection), $[0] = selected, $[1] = t0) : t0 = $[1];
  const focused = useSlateSelector(t0);
  let t1;
  if ($[2] !== props.element._type || $[3] !== props.legacySchema.inlineObjects) {
    let t22;
    $[5] !== props.element._type ? (t22 = (inlineObject) => inlineObject.name === props.element._type, $[5] = props.element._type, $[6] = t22) : t22 = $[6], t1 = props.legacySchema.inlineObjects.find(t22), $[2] = props.element._type, $[3] = props.legacySchema.inlineObjects, $[4] = t1;
  } else
    t1 = $[4];
  const legacySchemaType = t1;
  legacySchemaType || console.error(`Unable to find Inline Object "${props.element._type}" in Schema`);
  let t2;
  if ($[7] !== props.element || $[8] !== slateEditor) {
    const path3 = DOMEditor.findPath(slateEditor, props.element);
    t2 = getPointBlock({
      editor: slateEditor,
      point: {
        path: path3,
        offset: 0
      }
    }), $[7] = props.element, $[8] = slateEditor, $[9] = t2;
  } else
    t2 = $[9];
  const [block] = t2;
  block || console.error(`Unable to find parent block of inline object ${props.element._key}`);
  let t3;
  $[10] !== props.element ? (t3 = "value" in props.element && typeof props.element.value == "object" ? props.element.value : {}, $[10] = props.element, $[11] = t3) : t3 = $[11];
  let t4;
  $[12] !== props.element._key || $[13] !== props.element._type || $[14] !== t3 ? (t4 = {
    _key: props.element._key,
    _type: props.element._type,
    ...t3
  }, $[12] = props.element._key, $[13] = props.element._type, $[14] = t3, $[15] = t4) : t4 = $[15];
  const inlineObject_0 = t4, t5 = !props.readOnly;
  let t6;
  $[16] === Symbol.for("react.memo_cache_sentinel") ? (t6 = {
    display: "inline-block"
  }, $[16] = t6) : t6 = $[16];
  let t7;
  $[17] !== block || $[18] !== focused || $[19] !== inlineObject_0 || $[20] !== legacySchemaType || $[21] !== props.element._key || $[22] !== props.renderChild || $[23] !== selected ? (t7 = /* @__PURE__ */ jsx("span", { ref: inlineObjectRef, style: t6, children: props.renderChild && block && legacySchemaType ? /* @__PURE__ */ jsx(RenderChild$1, { renderChild: props.renderChild, annotations: [], editorElementRef: inlineObjectRef, selected, focused, path: [{
    _key: block._key
  }, "children", {
    _key: props.element._key
  }], schemaType: legacySchemaType, value: inlineObject_0, type: legacySchemaType, children: /* @__PURE__ */ jsx(RenderDefaultInlineObject, { inlineObject: inlineObject_0 }) }) : /* @__PURE__ */ jsx(RenderDefaultInlineObject, { inlineObject: inlineObject_0 }) }), $[17] = block, $[18] = focused, $[19] = inlineObject_0, $[20] = legacySchemaType, $[21] = props.element._key, $[22] = props.renderChild, $[23] = selected, $[24] = t7) : t7 = $[24];
  let t8;
  return $[25] !== inlineObject_0._key || $[26] !== inlineObject_0._type || $[27] !== props.attributes || $[28] !== props.children || $[29] !== t5 || $[30] !== t7 ? (t8 = /* @__PURE__ */ jsxs("span", { ...props.attributes, draggable: t5, className: "pt-inline-object", "data-child-key": inlineObject_0._key, "data-child-name": inlineObject_0._type, "data-child-type": "object", children: [
    props.children,
    t7
  ] }), $[25] = inlineObject_0._key, $[26] = inlineObject_0._type, $[27] = props.attributes, $[28] = props.children, $[29] = t5, $[30] = t7, $[31] = t8) : t8 = $[31], t8;
}
function RenderChild$1({
  renderChild,
  annotations,
  children,
  editorElementRef,
  focused,
  path: path3,
  schemaType,
  selected,
  value,
  type
}) {
  return renderChild({
    annotations,
    children,
    editorElementRef,
    focused,
    path: path3,
    schemaType,
    selected,
    value,
    type
  });
}
function RenderTextBlock(props) {
  const $ = c(77), [dragPositionBlock, setDragPositionBlock] = useState(), blockRef = useRef(null), selected = useSelected();
  let t0;
  $[0] !== selected ? (t0 = (editor) => selected && editor.selection !== null && Range.isCollapsed(editor.selection), $[0] = selected, $[1] = t0) : t0 = $[1];
  const focused = useSlateSelector(t0);
  let t1;
  $[2] !== props.element._key ? (t1 = {
    key: props.element._key,
    onSetDragPositionBlock: setDragPositionBlock
  }, $[2] = props.element._key, $[3] = t1) : t1 = $[3], useCoreBlockElementBehaviors(t1);
  let t2;
  $[4] !== props.textBlock._key ? (t2 = (editor_0) => editor_0.listIndexMap.get(props.textBlock._key), $[4] = props.textBlock._key, $[5] = t2) : t2 = $[5];
  const listIndex = useSlateSelector(t2);
  let children = props.children;
  if (props.renderStyle && props.textBlock.style) {
    let t32;
    $[6] !== props.legacySchema || $[7] !== props.textBlock.style ? (t32 = props.textBlock.style !== void 0 ? props.legacySchema.styles.find((style) => style.value === props.textBlock.style) : void 0, $[6] = props.legacySchema, $[7] = props.textBlock.style, $[8] = t32) : t32 = $[8];
    const legacyStyleSchemaType = t32;
    if (legacyStyleSchemaType) {
      let t42;
      $[9] !== props.textBlock._key ? (t42 = [{
        _key: props.textBlock._key
      }], $[9] = props.textBlock._key, $[10] = t42) : t42 = $[10];
      let t52;
      $[11] !== children || $[12] !== focused || $[13] !== legacyStyleSchemaType || $[14] !== props.renderStyle || $[15] !== props.textBlock || $[16] !== selected || $[17] !== t42 ? (t52 = /* @__PURE__ */ jsx(RenderStyle, { renderStyle: props.renderStyle, block: props.textBlock, editorElementRef: blockRef, focused, path: t42, schemaType: legacyStyleSchemaType, selected, value: props.textBlock.style, children }), $[11] = children, $[12] = focused, $[13] = legacyStyleSchemaType, $[14] = props.renderStyle, $[15] = props.textBlock, $[16] = selected, $[17] = t42, $[18] = t52) : t52 = $[18], children = t52;
    } else
      console.error(`Unable to find Schema type for text block style ${props.textBlock.style}`);
  }
  if (props.renderListItem && props.textBlock.listItem) {
    let t32;
    if ($[19] !== props.legacySchema.lists || $[20] !== props.textBlock.listItem) {
      let t42;
      $[22] !== props.textBlock.listItem ? (t42 = (list) => list.value === props.textBlock.listItem, $[22] = props.textBlock.listItem, $[23] = t42) : t42 = $[23], t32 = props.legacySchema.lists.find(t42), $[19] = props.legacySchema.lists, $[20] = props.textBlock.listItem, $[21] = t32;
    } else
      t32 = $[21];
    const legacyListItemSchemaType = t32;
    if (legacyListItemSchemaType) {
      const t42 = props.textBlock.level ?? 1;
      let t52;
      $[24] !== props.textBlock._key ? (t52 = [{
        _key: props.textBlock._key
      }], $[24] = props.textBlock._key, $[25] = t52) : t52 = $[25];
      let t62;
      $[26] !== children || $[27] !== focused || $[28] !== legacyListItemSchemaType || $[29] !== props.renderListItem || $[30] !== props.textBlock || $[31] !== selected || $[32] !== t42 || $[33] !== t52 ? (t62 = /* @__PURE__ */ jsx(RenderListItem, { renderListItem: props.renderListItem, block: props.textBlock, editorElementRef: blockRef, focused, level: t42, path: t52, selected, value: props.textBlock.listItem, schemaType: legacyListItemSchemaType, children }), $[26] = children, $[27] = focused, $[28] = legacyListItemSchemaType, $[29] = props.renderListItem, $[30] = props.textBlock, $[31] = selected, $[32] = t42, $[33] = t52, $[34] = t62) : t62 = $[34], children = t62;
    } else
      console.error(`Unable to find Schema type for text block list item ${props.textBlock.listItem}`);
  }
  const t3 = props.attributes;
  let t4;
  $[35] !== props.textBlock.style ? (t4 = props.textBlock.style ? [`pt-text-block-style-${props.textBlock.style}`] : [], $[35] = props.textBlock.style, $[36] = t4) : t4 = $[36];
  let t5;
  $[37] !== props.textBlock.level || $[38] !== props.textBlock.listItem ? (t5 = props.textBlock.listItem ? ["pt-list-item", `pt-list-item-${props.textBlock.listItem}`, `pt-list-item-level-${props.textBlock.level ?? 1}`] : [], $[37] = props.textBlock.level, $[38] = props.textBlock.listItem, $[39] = t5) : t5 = $[39];
  let t6;
  $[40] !== t4 || $[41] !== t5 ? (t6 = ["pt-block", "pt-text-block", ...t4, ...t5], $[40] = t4, $[41] = t5, $[42] = t6) : t6 = $[42];
  const t7 = t6.join(" ");
  let t8;
  $[43] !== props.textBlock.listItem ? (t8 = props.textBlock.listItem !== void 0 ? {
    "data-list-item": props.textBlock.listItem
  } : {}, $[43] = props.textBlock.listItem, $[44] = t8) : t8 = $[44];
  let t9;
  $[45] !== props.textBlock.level ? (t9 = props.textBlock.level !== void 0 ? {
    "data-level": props.textBlock.level
  } : {}, $[45] = props.textBlock.level, $[46] = t9) : t9 = $[46];
  let t10;
  $[47] !== props.textBlock.style ? (t10 = props.textBlock.style !== void 0 ? {
    "data-style": props.textBlock.style
  } : {}, $[47] = props.textBlock.style, $[48] = t10) : t10 = $[48];
  let t11;
  $[49] !== listIndex ? (t11 = listIndex !== void 0 ? {
    "data-list-index": listIndex
  } : {}, $[49] = listIndex, $[50] = t11) : t11 = $[50];
  let t12;
  $[51] !== dragPositionBlock ? (t12 = dragPositionBlock === "start" ? /* @__PURE__ */ jsx(DropIndicator, {}) : null, $[51] = dragPositionBlock, $[52] = t12) : t12 = $[52];
  let t13;
  $[53] !== children || $[54] !== focused || $[55] !== props.legacySchema || $[56] !== props.renderBlock || $[57] !== props.textBlock || $[58] !== selected ? (t13 = props.renderBlock ? /* @__PURE__ */ jsx(RenderBlock, { renderBlock: props.renderBlock, editorElementRef: blockRef, focused, level: props.textBlock.level, listItem: props.textBlock.listItem, path: [{
    _key: props.textBlock._key
  }], selected, schemaType: props.legacySchema.block, style: props.textBlock.style, type: props.legacySchema.block, value: props.textBlock, children }) : children, $[53] = children, $[54] = focused, $[55] = props.legacySchema, $[56] = props.renderBlock, $[57] = props.textBlock, $[58] = selected, $[59] = t13) : t13 = $[59];
  let t14;
  $[60] !== t13 ? (t14 = /* @__PURE__ */ jsx("div", { ref: blockRef, children: t13 }), $[60] = t13, $[61] = t14) : t14 = $[61];
  let t15;
  $[62] !== dragPositionBlock ? (t15 = dragPositionBlock === "end" ? /* @__PURE__ */ jsx(DropIndicator, {}) : null, $[62] = dragPositionBlock, $[63] = t15) : t15 = $[63];
  let t16;
  return $[64] !== props.attributes || $[65] !== props.spellCheck || $[66] !== props.textBlock._key || $[67] !== props.textBlock._type || $[68] !== t10 || $[69] !== t11 || $[70] !== t12 || $[71] !== t14 || $[72] !== t15 || $[73] !== t7 || $[74] !== t8 || $[75] !== t9 ? (t16 = /* @__PURE__ */ jsxs("div", { ...t3, className: t7, spellCheck: props.spellCheck, "data-block-key": props.textBlock._key, "data-block-name": props.textBlock._type, "data-block-type": "text", ...t8, ...t9, ...t10, ...t11, children: [
    t12,
    t14,
    t15
  ] }), $[64] = props.attributes, $[65] = props.spellCheck, $[66] = props.textBlock._key, $[67] = props.textBlock._type, $[68] = t10, $[69] = t11, $[70] = t12, $[71] = t14, $[72] = t15, $[73] = t7, $[74] = t8, $[75] = t9, $[76] = t16) : t16 = $[76], t16;
}
function RenderBlock({
  renderBlock,
  children,
  editorElementRef,
  focused,
  level,
  listItem,
  path: path3,
  selected,
  style,
  schemaType,
  type,
  value
}) {
  return renderBlock({
    children,
    editorElementRef,
    focused,
    level,
    listItem,
    path: path3,
    selected,
    style,
    schemaType,
    type,
    value
  });
}
function RenderListItem({
  renderListItem,
  block,
  children,
  editorElementRef,
  focused,
  level,
  path: path3,
  schemaType,
  selected,
  value
}) {
  return renderListItem({
    block,
    children,
    editorElementRef,
    focused,
    level,
    path: path3,
    schemaType,
    selected,
    value
  });
}
function RenderStyle({
  renderStyle,
  block,
  children,
  editorElementRef,
  focused,
  path: path3,
  schemaType,
  selected,
  value
}) {
  return renderStyle({
    block,
    children,
    editorElementRef,
    focused,
    path: path3,
    schemaType,
    selected,
    value
  });
}
function RenderElement(props) {
  const $ = c(34), editorActor = useContext(EditorActorContext), schema = useSelector(editorActor, _temp$3), legacySchema = useSelector(editorActor, _temp2$2), slateStatic = useSlateStatic();
  if ("__inline" in props.element && props.element.__inline === !0) {
    let t02;
    return $[0] !== legacySchema || $[1] !== props.attributes || $[2] !== props.children || $[3] !== props.element || $[4] !== props.readOnly || $[5] !== props.renderChild || $[6] !== schema ? (t02 = /* @__PURE__ */ jsx(RenderInlineObject, { attributes: props.attributes, element: props.element, legacySchema, readOnly: props.readOnly, renderChild: props.renderChild, schema, children: props.children }), $[0] = legacySchema, $[1] = props.attributes, $[2] = props.children, $[3] = props.element, $[4] = props.readOnly, $[5] = props.renderChild, $[6] = schema, $[7] = t02) : t02 = $[7], t02;
  }
  let block, t0;
  if ($[8] !== props.element._key || $[9] !== schema || $[10] !== slateStatic.blockIndexMap || $[11] !== slateStatic.value) {
    const blockIndex = slateStatic.blockIndexMap.get(props.element._key);
    block = blockIndex !== void 0 ? slateStatic.value.at(blockIndex) : void 0, t0 = isTextBlock({
      schema
    }, block), $[8] = props.element._key, $[9] = schema, $[10] = slateStatic.blockIndexMap, $[11] = slateStatic.value, $[12] = block, $[13] = t0;
  } else
    block = $[12], t0 = $[13];
  if (t0) {
    let t12;
    return $[14] !== block || $[15] !== legacySchema || $[16] !== props.attributes || $[17] !== props.children || $[18] !== props.element || $[19] !== props.readOnly || $[20] !== props.renderBlock || $[21] !== props.renderListItem || $[22] !== props.renderStyle || $[23] !== props.spellCheck ? (t12 = /* @__PURE__ */ jsx(RenderTextBlock, { attributes: props.attributes, element: props.element, legacySchema, readOnly: props.readOnly, renderBlock: props.renderBlock, renderListItem: props.renderListItem, renderStyle: props.renderStyle, spellCheck: props.spellCheck, textBlock: block, children: props.children }), $[14] = block, $[15] = legacySchema, $[16] = props.attributes, $[17] = props.children, $[18] = props.element, $[19] = props.readOnly, $[20] = props.renderBlock, $[21] = props.renderListItem, $[22] = props.renderStyle, $[23] = props.spellCheck, $[24] = t12) : t12 = $[24], t12;
  }
  let t1;
  return $[25] !== block || $[26] !== legacySchema || $[27] !== props.attributes || $[28] !== props.children || $[29] !== props.element || $[30] !== props.readOnly || $[31] !== props.renderBlock || $[32] !== schema ? (t1 = /* @__PURE__ */ jsx(RenderBlockObject, { attributes: props.attributes, blockObject: block, element: props.element, legacySchema, readOnly: props.readOnly, renderBlock: props.renderBlock, schema, children: props.children }), $[25] = block, $[26] = legacySchema, $[27] = props.attributes, $[28] = props.children, $[29] = props.element, $[30] = props.readOnly, $[31] = props.renderBlock, $[32] = schema, $[33] = t1) : t1 = $[33], t1;
}
function _temp2$2(s_0) {
  return s_0.context.getLegacySchema();
}
function _temp$3(s) {
  return s.context.schema;
}
function defaultCompare(a, b) {
  return a === b;
}
function useEditorSelector(editor, selector, t0) {
  const $ = c(3), compare = t0 === void 0 ? defaultCompare : t0;
  let t1;
  return $[0] !== editor || $[1] !== selector ? (t1 = (editorActorSnapshot) => {
    const snapshot = getEditorSnapshot({
      editorActorSnapshot,
      slateEditorInstance: editor._internal.slateEditor.instance
    });
    return selector(snapshot);
  }, $[0] = editor, $[1] = selector, $[2] = t1) : t1 = $[2], useSelector(editor._internal.editorActor, t1, compare);
}
function getEditorSnapshot({
  editorActorSnapshot,
  slateEditorInstance
}) {
  const selection = slateEditorInstance.selection ? slateRangeToSelection({
    schema: editorActorSnapshot.context.schema,
    editor: slateEditorInstance,
    range: slateEditorInstance.selection
  }) : null;
  return {
    blockIndexMap: slateEditorInstance.blockIndexMap,
    context: {
      converters: [...editorActorSnapshot.context.converters],
      keyGenerator: editorActorSnapshot.context.keyGenerator,
      readOnly: editorActorSnapshot.matches({
        "edit mode": "read only"
      }),
      schema: editorActorSnapshot.context.schema,
      selection,
      value: slateEditorInstance.value
    },
    decoratorState: slateEditorInstance.decoratorState
  };
}
function RenderSpan(props) {
  const $ = c(40), slateEditor = useSlateStatic(), editorActor = useContext(EditorActorContext), legacySchema = useSelector(editorActor, _temp$2), spanRef = useRef(null);
  let t0;
  $[0] !== props.leaf._key || $[1] !== slateEditor ? (t0 = (editorActorSnapshot) => {
    const snapshot = getEditorSnapshot({
      editorActorSnapshot,
      slateEditorInstance: slateEditor
    });
    if (!snapshot.context.selection || !isSelectionCollapsed$1(snapshot))
      return !1;
    const focusedSpan = getFocusSpan$1(snapshot);
    return focusedSpan ? focusedSpan.node._key === props.leaf._key : !1;
  }, $[0] = props.leaf._key, $[1] = slateEditor, $[2] = t0) : t0 = $[2];
  const focused = useSelector(editorActor, t0);
  let t1;
  $[3] !== props.children.props.parent || $[4] !== props.leaf._key || $[5] !== props.leaf.text || $[6] !== slateEditor ? (t1 = (editorActorSnapshot_0) => {
    const snapshot_0 = getEditorSnapshot({
      editorActorSnapshot: editorActorSnapshot_0,
      slateEditorInstance: slateEditor
    });
    if (!snapshot_0.context.selection)
      return !1;
    const parent3 = props.children.props.parent, block = parent3 && isTextBlock(snapshot_0.context, parent3) ? parent3 : void 0, spanSelection = block ? {
      anchor: {
        path: [{
          _key: block._key
        }, "children", {
          _key: props.leaf._key
        }],
        offset: 0
      },
      focus: {
        path: [{
          _key: block._key
        }, "children", {
          _key: props.leaf._key
        }],
        offset: props.leaf.text.length
      }
    } : null;
    return isOverlappingSelection(spanSelection)(snapshot_0);
  }, $[3] = props.children.props.parent, $[4] = props.leaf._key, $[5] = props.leaf.text, $[6] = slateEditor, $[7] = t1) : t1 = $[7];
  const selected = useSelector(editorActor, t1), parent_0 = props.children.props.parent, block_0 = parent_0 && slateEditor.isTextBlock(parent_0) ? parent_0 : void 0;
  let t2;
  $[8] !== block_0 || $[9] !== props.leaf._key ? (t2 = block_0 ? [{
    _key: block_0._key
  }, "children", {
    _key: props.leaf._key
  }] : void 0, $[8] = block_0, $[9] = props.leaf._key, $[10] = t2) : t2 = $[10];
  const path3 = t2;
  let annotationMarkDefs, children;
  if ($[11] !== block_0 || $[12] !== editorActor || $[13] !== focused || $[14] !== legacySchema || $[15] !== path3 || $[16] !== props.children || $[17] !== props.leaf.marks || $[18] !== props.renderAnnotation || $[19] !== props.renderDecorator || $[20] !== selected) {
    const decoratorSchemaTypes = editorActor.getSnapshot().context.schema.decorators.map(_temp2$1), decorators = uniq((props.leaf.marks ?? []).filter((mark) => decoratorSchemaTypes.includes(mark)));
    annotationMarkDefs = (props.leaf.marks ?? []).flatMap((mark_0) => {
      if (decoratorSchemaTypes.includes(mark_0))
        return [];
      const markDef_0 = block_0?.markDefs?.find((markDef) => markDef._key === mark_0);
      return markDef_0 ? [markDef_0] : [];
    }), children = props.children;
    for (const mark_1 of decorators) {
      const legacyDecoratorSchemaType = legacySchema.decorators.find((dec) => dec.value === mark_1);
      path3 && legacyDecoratorSchemaType && props.renderDecorator && (children = /* @__PURE__ */ jsx(RenderDecorator, { renderDecorator: props.renderDecorator, editorElementRef: spanRef, focused, path: path3, selected, schemaType: legacyDecoratorSchemaType, value: mark_1, type: legacyDecoratorSchemaType, children }));
    }
    for (const annotationMarkDef of annotationMarkDefs) {
      const legacyAnnotationSchemaType = legacySchema.annotations.find((t4) => t4.name === annotationMarkDef._type);
      legacyAnnotationSchemaType && (block_0 && path3 && props.renderAnnotation ? children = /* @__PURE__ */ jsx("span", { ref: spanRef, children: /* @__PURE__ */ jsx(RenderAnnotation, { renderAnnotation: props.renderAnnotation, block: block_0, editorElementRef: spanRef, focused, path: path3, selected, schemaType: legacyAnnotationSchemaType, value: annotationMarkDef, type: legacyAnnotationSchemaType, children }) }) : children = /* @__PURE__ */ jsx("span", { ref: spanRef, children }));
    }
    $[11] = block_0, $[12] = editorActor, $[13] = focused, $[14] = legacySchema, $[15] = path3, $[16] = props.children, $[17] = props.leaf.marks, $[18] = props.renderAnnotation, $[19] = props.renderDecorator, $[20] = selected, $[21] = annotationMarkDefs, $[22] = children;
  } else
    annotationMarkDefs = $[21], children = $[22];
  if (block_0 && path3 && props.renderChild) {
    let t32;
    if ($[23] !== block_0.children || $[24] !== props.leaf) {
      let t4;
      $[26] !== props.leaf ? (t4 = (_child) => _child._key === props.leaf._key, $[26] = props.leaf, $[27] = t4) : t4 = $[27], t32 = block_0.children.find(t4), $[23] = block_0.children, $[24] = props.leaf, $[25] = t32;
    } else
      t32 = $[25];
    const child = t32;
    if (child) {
      let t4;
      $[28] !== annotationMarkDefs || $[29] !== child || $[30] !== children || $[31] !== focused || $[32] !== legacySchema.span || $[33] !== path3 || $[34] !== props.renderChild || $[35] !== selected ? (t4 = /* @__PURE__ */ jsx(RenderChild, { renderChild: props.renderChild, annotations: annotationMarkDefs, editorElementRef: spanRef, focused, path: path3, schemaType: legacySchema.span, selected, value: child, type: legacySchema.span, children }), $[28] = annotationMarkDefs, $[29] = child, $[30] = children, $[31] = focused, $[32] = legacySchema.span, $[33] = path3, $[34] = props.renderChild, $[35] = selected, $[36] = t4) : t4 = $[36], children = t4;
    }
  }
  let t3;
  return $[37] !== children || $[38] !== props.attributes ? (t3 = /* @__PURE__ */ jsx("span", { ...props.attributes, ref: spanRef, children }), $[37] = children, $[38] = props.attributes, $[39] = t3) : t3 = $[39], t3;
}
function _temp2$1(decorator) {
  return decorator.name;
}
function _temp$2(s) {
  return s.context.getLegacySchema();
}
function RenderAnnotation({
  renderAnnotation,
  block,
  children,
  editorElementRef,
  focused,
  path: path3,
  schemaType,
  selected,
  value,
  type
}) {
  return renderAnnotation({
    block,
    children,
    editorElementRef,
    focused,
    path: path3,
    schemaType,
    selected,
    value,
    type
  });
}
function RenderDecorator({
  renderDecorator,
  children,
  editorElementRef,
  focused,
  path: path3,
  schemaType,
  selected,
  value,
  type
}) {
  return renderDecorator({
    children,
    editorElementRef,
    focused,
    path: path3,
    schemaType,
    selected,
    value,
    type
  });
}
function RenderChild({
  renderChild,
  annotations,
  children,
  editorElementRef,
  focused,
  path: path3,
  schemaType,
  selected,
  value,
  type
}) {
  return renderChild({
    annotations,
    children,
    editorElementRef,
    focused,
    path: path3,
    schemaType,
    selected,
    value,
    type
  });
}
const PLACEHOLDER_STYLE = {
  position: "absolute",
  userSelect: "none",
  pointerEvents: "none",
  left: 0,
  right: 0
};
function RenderLeaf(props) {
  const $ = c(12), editorActor = useContext(EditorActorContext), schema = useSelector(editorActor, _temp$1);
  if (props.leaf._type !== schema.span.name)
    return props.children;
  let t0;
  $[0] !== props ? (t0 = /* @__PURE__ */ jsx(RenderSpan, { ...props }), $[0] = props, $[1] = t0) : t0 = $[1];
  let renderedSpan = t0;
  if (props.renderPlaceholder && props.leaf.placeholder && props.text.text === "") {
    let t1;
    $[2] !== props.renderPlaceholder ? (t1 = props.renderPlaceholder(), $[2] = props.renderPlaceholder, $[3] = t1) : t1 = $[3];
    let t2;
    $[4] !== t1 ? (t2 = /* @__PURE__ */ jsx("span", { style: PLACEHOLDER_STYLE, contentEditable: !1, children: t1 }), $[4] = t1, $[5] = t2) : t2 = $[5];
    let t3;
    return $[6] !== renderedSpan || $[7] !== t2 ? (t3 = /* @__PURE__ */ jsxs(Fragment$1, { children: [
      t2,
      renderedSpan
    ] }), $[6] = renderedSpan, $[7] = t2, $[8] = t3) : t3 = $[8], t3;
  }
  const rangeDecoration = props.leaf.rangeDecoration;
  if (rangeDecoration) {
    let t1;
    $[9] !== rangeDecoration || $[10] !== renderedSpan ? (t1 = rangeDecoration.component({
      children: renderedSpan
    }), $[9] = rangeDecoration, $[10] = renderedSpan, $[11] = t1) : t1 = $[11], renderedSpan = t1;
  }
  return renderedSpan;
}
function _temp$1(s) {
  return s.context.schema;
}
function RenderText(props) {
  const $ = c(5);
  let t0;
  return $[0] !== props.attributes || $[1] !== props.children || $[2] !== props.text._key || $[3] !== props.text._type ? (t0 = /* @__PURE__ */ jsx("span", { ...props.attributes, "data-child-key": props.text._key, "data-child-name": props.text._type, "data-child-type": "span", children: props.children }), $[0] = props.attributes, $[1] = props.children, $[2] = props.text._key, $[3] = props.text._type, $[4] = t0) : t0 = $[4], t0;
}
const PortableTextEditorContext = createContext(null), usePortableTextEditor = () => {
  const editor = useContext(PortableTextEditorContext);
  if (!editor)
    throw new Error("The `usePortableTextEditor` hook must be used inside the <PortableTextEditor> component's context.");
  return editor;
}, IS_MAC = typeof window < "u" && /Mac|iPod|iPhone|iPad/.test(window.navigator.userAgent), modifiers = {
  alt: "altKey",
  control: "ctrlKey",
  meta: "metaKey",
  shift: "shiftKey"
}, aliases = {
  add: "+",
  break: "pause",
  cmd: "meta",
  command: "meta",
  ctl: "control",
  ctrl: "control",
  del: "delete",
  down: "arrowdown",
  esc: "escape",
  ins: "insert",
  left: "arrowleft",
  mod: IS_MAC ? "meta" : "control",
  opt: "alt",
  option: "alt",
  return: "enter",
  right: "arrowright",
  space: " ",
  spacebar: " ",
  up: "arrowup",
  win: "meta",
  windows: "meta"
}, keyCodes = {
  backspace: 8,
  tab: 9,
  enter: 13,
  shift: 16,
  control: 17,
  alt: 18,
  pause: 19,
  capslock: 20,
  escape: 27,
  " ": 32,
  pageup: 33,
  pagedown: 34,
  end: 35,
  home: 36,
  arrowleft: 37,
  arrowup: 38,
  arrowright: 39,
  arrowdown: 40,
  insert: 45,
  delete: 46,
  meta: 91,
  numlock: 144,
  scrolllock: 145,
  ";": 186,
  "=": 187,
  ",": 188,
  "-": 189,
  ".": 190,
  "/": 191,
  "`": 192,
  "[": 219,
  "\\": 220,
  "]": 221,
  "'": 222,
  f1: 112,
  f2: 113,
  f3: 114,
  f4: 115,
  f5: 116,
  f6: 117,
  f7: 118,
  f8: 119,
  f9: 120,
  f10: 121,
  f11: 122,
  f12: 123,
  f13: 124,
  f14: 125,
  f15: 126,
  f16: 127,
  f17: 128,
  f18: 129,
  f19: 130,
  f20: 131
};
function isHotkey(hotkey, event) {
  return compareHotkey(parseHotkey(hotkey), event);
}
function parseHotkey(hotkey) {
  const parsedHotkey = {
    altKey: !1,
    ctrlKey: !1,
    metaKey: !1,
    shiftKey: !1
  }, hotkeySegments = hotkey.replace("++", "+add").split("+");
  for (const rawHotkeySegment of hotkeySegments) {
    const optional = rawHotkeySegment.endsWith("?") && rawHotkeySegment.length > 1, hotkeySegment = optional ? rawHotkeySegment.slice(0, -1) : rawHotkeySegment, keyName = toKeyName(hotkeySegment), modifier = modifiers[keyName], alias = aliases[hotkeySegment], code2 = keyCodes[keyName];
    if (hotkeySegment.length > 1 && modifier === void 0 && alias === void 0 && code2 === void 0)
      throw new TypeError(`Unknown modifier: "${hotkeySegment}"`);
    (hotkeySegments.length === 1 || modifier === void 0) && (parsedHotkey.key = keyName, parsedHotkey.keyCode = toKeyCode(hotkeySegment)), modifier !== void 0 && (parsedHotkey[modifier] = optional ? null : !0);
  }
  return parsedHotkey;
}
function compareHotkey(parsedHotkey, event) {
  return (parsedHotkey.altKey == null || parsedHotkey.altKey === event.altKey) && (parsedHotkey.ctrlKey == null || parsedHotkey.ctrlKey === event.ctrlKey) && (parsedHotkey.metaKey == null || parsedHotkey.metaKey === event.metaKey) && (parsedHotkey.shiftKey == null || parsedHotkey.shiftKey === event.shiftKey) ? parsedHotkey.keyCode !== void 0 && event.keyCode !== void 0 ? parsedHotkey.keyCode === 91 && event.keyCode === 93 ? !0 : parsedHotkey.keyCode === event.keyCode : parsedHotkey.keyCode === event.keyCode || parsedHotkey.key === event.key.toLowerCase() : !1;
}
function toKeyCode(name) {
  const keyName = toKeyName(name);
  return keyCodes[keyName] ?? keyName.toUpperCase().charCodeAt(0);
}
function toKeyName(name) {
  const keyName = name.toLowerCase();
  return aliases[keyName] ?? keyName;
}
const debug$g = debugWithName("plugin:withHotKeys");
function createWithHotkeys(editorActor, portableTextEditor, hotkeysFromOptions) {
  const reservedHotkeys = ["enter", "tab", "shift", "delete", "end"], activeHotkeys = hotkeysFromOptions ?? {};
  return function(editor) {
    return editor.pteWithHotKeys = (event) => {
      Object.keys(activeHotkeys).forEach((cat) => {
        if (cat === "marks")
          for (const hotkey in activeHotkeys[cat]) {
            if (reservedHotkeys.includes(hotkey))
              throw new Error(`The hotkey ${hotkey} is reserved!`);
            if (isHotkey(hotkey, event.nativeEvent)) {
              event.preventDefault();
              const possibleMark = activeHotkeys[cat];
              if (possibleMark) {
                const mark = possibleMark[hotkey];
                debug$g(`HotKey ${hotkey} to toggle ${mark}`), editorActor.send({
                  type: "behavior event",
                  behaviorEvent: {
                    type: "decorator.toggle",
                    decorator: mark
                  },
                  editor
                });
              }
            }
          }
        if (cat === "custom")
          for (const hotkey in activeHotkeys[cat]) {
            if (reservedHotkeys.includes(hotkey))
              throw new Error(`The hotkey ${hotkey} is reserved!`);
            if (isHotkey(hotkey, event.nativeEvent)) {
              const possibleCommand = activeHotkeys[cat];
              if (possibleCommand) {
                const command = possibleCommand[hotkey];
                command(event, portableTextEditor);
              }
            }
          }
      });
    }, editor;
  };
}
function moveRangeByOperation(range2, operation) {
  const anchor = Point.transform(range2.anchor, operation), focus2 = Point.transform(range2.focus, operation);
  return anchor === null || focus2 === null ? null : Point.equals(anchor, range2.anchor) && Point.equals(focus2, range2.focus) ? range2 : {
    anchor,
    focus: focus2
  };
}
const slateOperationCallback = ({
  input,
  sendBack
}) => {
  const originalApply = input.slateEditor.apply;
  return input.slateEditor.apply = (op) => {
    op.type !== "set_selection" && sendBack({
      type: "slate operation",
      operation: op
    }), originalApply(op);
  }, () => {
    input.slateEditor.apply = originalApply;
  };
}, rangeDecorationsMachine = setup({
  types: {
    context: {},
    input: {},
    events: {}
  },
  actions: {
    "update pending range decorations": assign({
      pendingRangeDecorations: ({
        context,
        event
      }) => event.type !== "range decorations updated" ? context.pendingRangeDecorations : event.rangeDecorations
    }),
    "set up initial range decorations": ({
      context
    }) => {
      const rangeDecorationState = [];
      for (const rangeDecoration of context.pendingRangeDecorations) {
        const slateRange = toSlateRange({
          context: {
            schema: context.schema,
            value: context.slateEditor.value,
            selection: rangeDecoration.selection
          },
          blockIndexMap: context.slateEditor.blockIndexMap
        });
        if (!Range.isRange(slateRange)) {
          rangeDecoration.onMoved?.({
            newSelection: null,
            rangeDecoration,
            origin: "local"
          });
          continue;
        }
        rangeDecorationState.push({
          rangeDecoration,
          ...slateRange
        });
      }
      context.slateEditor.decoratedRanges = rangeDecorationState;
    },
    "update range decorations": ({
      context,
      event
    }) => {
      if (event.type !== "range decorations updated")
        return;
      const rangeDecorationState = [];
      for (const rangeDecoration of event.rangeDecorations) {
        const slateRange = toSlateRange({
          context: {
            schema: context.schema,
            value: context.slateEditor.value,
            selection: rangeDecoration.selection
          },
          blockIndexMap: context.slateEditor.blockIndexMap
        });
        if (!Range.isRange(slateRange)) {
          rangeDecoration.onMoved?.({
            newSelection: null,
            rangeDecoration,
            origin: "local"
          });
          continue;
        }
        rangeDecorationState.push({
          rangeDecoration,
          ...slateRange
        });
      }
      context.slateEditor.decoratedRanges = rangeDecorationState;
    },
    "move range decorations": ({
      context,
      event
    }) => {
      if (event.type !== "slate operation")
        return;
      const rangeDecorationState = [];
      for (const decoratedRange of context.slateEditor.decoratedRanges) {
        const slateRange = toSlateRange({
          context: {
            schema: context.schema,
            value: context.slateEditor.value,
            selection: decoratedRange.rangeDecoration.selection
          },
          blockIndexMap: context.slateEditor.blockIndexMap
        });
        if (!Range.isRange(slateRange)) {
          decoratedRange.rangeDecoration.onMoved?.({
            newSelection: null,
            rangeDecoration: decoratedRange.rangeDecoration,
            origin: "local"
          });
          continue;
        }
        let newRange;
        if (newRange = moveRangeByOperation(slateRange, event.operation), newRange && newRange !== slateRange || newRange === null && slateRange) {
          const newRangeSelection = newRange ? slateRangeToSelection({
            schema: context.schema,
            editor: context.slateEditor,
            range: newRange
          }) : null;
          decoratedRange.rangeDecoration.onMoved?.({
            newSelection: newRangeSelection,
            rangeDecoration: decoratedRange.rangeDecoration,
            origin: "local"
          });
        }
        newRange !== null && rangeDecorationState.push({
          ...newRange || slateRange,
          rangeDecoration: {
            ...decoratedRange.rangeDecoration,
            selection: slateRangeToSelection({
              schema: context.schema,
              editor: context.slateEditor,
              range: newRange
            })
          }
        });
      }
      context.slateEditor.decoratedRanges = rangeDecorationState;
    },
    "assign readOnly": assign({
      readOnly: ({
        context,
        event
      }) => event.type !== "update read only" ? context.readOnly : event.readOnly
    }),
    "update decorate": assign({
      decorate: ({
        context
      }) => ({
        fn: createDecorate(context.schema, context.slateEditor)
      })
    })
  },
  actors: {
    "slate operation listener": fromCallback(slateOperationCallback)
  },
  guards: {
    "has pending range decorations": ({
      context
    }) => context.pendingRangeDecorations.length > 0,
    "has range decorations": ({
      context
    }) => context.slateEditor.decoratedRanges.length > 0,
    "has different decorations": ({
      context,
      event
    }) => {
      if (event.type !== "range decorations updated")
        return !1;
      const existingRangeDecorations = context.slateEditor.decoratedRanges.map((decoratedRange) => ({
        anchor: decoratedRange.rangeDecoration.selection?.anchor,
        focus: decoratedRange.rangeDecoration.selection?.focus,
        payload: decoratedRange.rangeDecoration.payload
      })), newRangeDecorations = event.rangeDecorations.map((rangeDecoration) => ({
        anchor: rangeDecoration.selection?.anchor,
        focus: rangeDecoration.selection?.focus,
        payload: rangeDecoration.payload
      }));
      return !isEqual(existingRangeDecorations, newRangeDecorations);
    },
    "not read only": ({
      context
    }) => !context.readOnly,
    "should skip setup": ({
      context
    }) => context.skipSetup
  }
}).createMachine({
  id: "range decorations",
  context: ({
    input
  }) => ({
    readOnly: input.readOnly,
    pendingRangeDecorations: input.rangeDecorations,
    decoratedRanges: [],
    skipSetup: input.skipSetup,
    schema: input.schema,
    slateEditor: input.slateEditor,
    decorate: {
      fn: createDecorate(input.schema, input.slateEditor)
    }
  }),
  invoke: {
    src: "slate operation listener",
    input: ({
      context
    }) => ({
      slateEditor: context.slateEditor
    })
  },
  on: {
    "update read only": {
      actions: ["assign readOnly"]
    }
  },
  initial: "setting up",
  states: {
    "setting up": {
      always: [{
        guard: and(["should skip setup", "has pending range decorations"]),
        target: "ready",
        actions: ["set up initial range decorations", "update decorate"]
      }, {
        guard: "should skip setup",
        target: "ready"
      }],
      on: {
        "range decorations updated": {
          actions: ["update pending range decorations"]
        },
        ready: [{
          target: "ready",
          guard: "has pending range decorations",
          actions: ["set up initial range decorations", "update decorate"]
        }, {
          target: "ready"
        }]
      }
    },
    ready: {
      initial: "idle",
      on: {
        "range decorations updated": {
          target: ".idle",
          guard: "has different decorations",
          actions: ["update range decorations", "update decorate"]
        }
      },
      states: {
        idle: {
          on: {
            "slate operation": {
              target: "moving range decorations",
              guard: and(["has range decorations", "not read only"])
            }
          }
        },
        "moving range decorations": {
          entry: ["move range decorations"],
          always: {
            target: "idle"
          }
        }
      }
    }
  }
});
function createDecorate(schema, slateEditor) {
  return function([node3, path3]) {
    const defaultStyle = schema.styles.at(0)?.name;
    if (slateEditor.value.length === 1 && isEmptyTextBlock({
      schema
    }, slateEditor.value[0]) && (!slateEditor.value[0].style || slateEditor.value[0].style === defaultStyle) && !slateEditor.value[0].listItem)
      return [{
        anchor: {
          path: [0, 0],
          offset: 0
        },
        focus: {
          path: [0, 0],
          offset: 0
        },
        placeholder: !0
      }];
    if (path3.length === 0)
      return [];
    if (!Element$2.isElement(node3) || node3.children.length === 0)
      return [];
    const blockIndex = path3.at(0);
    return blockIndex === void 0 ? [] : slateEditor.decoratedRanges.filter((decoratedRange) => Range.isCollapsed(decoratedRange) ? node3.children.some((_, childIndex) => Path.equals(decoratedRange.anchor.path, [blockIndex, childIndex]) && Path.equals(decoratedRange.focus.path, [blockIndex, childIndex])) : Range.intersection(decoratedRange, {
      anchor: {
        path: path3,
        offset: 0
      },
      focus: {
        path: path3,
        offset: 0
      }
    }) || Range.includes(decoratedRange, path3));
  };
}
const RelayActorContext = createContext({}), debug$f = debugWithName("validate selection machine"), validateSelectionSetup = setup({
  types: {
    context: {},
    input: {},
    events: {}
  },
  guards: {
    "pending operations": ({
      context
    }) => context.slateEditor.operations.length > 0
  }
}), validateSelectionAction = validateSelectionSetup.createAction(({
  context,
  event
}) => {
  validateSelection(context.slateEditor, event.editorElement);
}), validateSelectionMachine = validateSelectionSetup.createMachine({
  id: "validate selection",
  context: ({
    input
  }) => ({
    slateEditor: input.slateEditor
  }),
  initial: "idle",
  states: {
    idle: {
      on: {
        "validate selection": [{
          guard: "pending operations",
          target: "waiting"
        }, {
          actions: [validateSelectionAction],
          target: "idle"
        }]
      }
    },
    waiting: {
      after: {
        0: [{
          guard: "pending operations",
          target: ".",
          reenter: !0
        }, {
          target: "idle",
          actions: [validateSelectionAction]
        }]
      },
      on: {
        "validate selection": {
          target: ".",
          reenter: !0
        }
      }
    }
  }
});
function validateSelection(slateEditor, editorElement) {
  if (!slateEditor.selection)
    return;
  let root;
  try {
    root = ReactEditor.findDocumentOrShadowRoot(slateEditor);
  } catch {
  }
  if (!root || editorElement !== root.activeElement)
    return;
  const domSelection = ReactEditor.getWindow(slateEditor).getSelection();
  if (!domSelection || domSelection.rangeCount === 0)
    return;
  const existingDOMRange = domSelection.getRangeAt(0);
  try {
    const newDOMRange = ReactEditor.toDOMRange(slateEditor, slateEditor.selection);
    (newDOMRange.startOffset !== existingDOMRange.startOffset || newDOMRange.endOffset !== existingDOMRange.endOffset) && (debug$f("DOM range out of sync, validating selection"), domSelection?.removeAllRanges(), domSelection.addRange(newDOMRange));
  } catch {
    debug$f("Could not resolve selection, selecting top document"), Transforms.deselect(slateEditor), slateEditor.children.length > 0 && Transforms.select(slateEditor, Editor.start(slateEditor, [])), slateEditor.onChange();
  }
}
const debug$e = debugWithName("component:Editable"), PortableTextEditable = forwardRef(function(props, forwardedRef) {
  const $ = c(176);
  let hotkeys2, onBeforeInput, onBlur, onClick, onCopy, onCut, onDrag, onDragEnd, onDragEnter, onDragLeave, onDragOver, onDragStart, onDrop, onFocus, onPaste, propsSelection, rangeDecorations, renderAnnotation, renderBlock, renderChild, renderDecorator, renderListItem, renderPlaceholder, renderStyle, restProps, scrollSelectionIntoView, spellCheck;
  $[0] !== props ? ({
    hotkeys: hotkeys2,
    onBlur,
    onFocus,
    onBeforeInput,
    onPaste,
    onCopy,
    onCut,
    onClick,
    onDragStart,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragOver,
    onDrop,
    onDragLeave,
    rangeDecorations,
    renderAnnotation,
    renderBlock,
    renderChild,
    renderDecorator,
    renderListItem,
    renderPlaceholder,
    renderStyle,
    selection: propsSelection,
    scrollSelectionIntoView,
    spellCheck,
    ...restProps
  } = props, $[0] = props, $[1] = hotkeys2, $[2] = onBeforeInput, $[3] = onBlur, $[4] = onClick, $[5] = onCopy, $[6] = onCut, $[7] = onDrag, $[8] = onDragEnd, $[9] = onDragEnter, $[10] = onDragLeave, $[11] = onDragOver, $[12] = onDragStart, $[13] = onDrop, $[14] = onFocus, $[15] = onPaste, $[16] = propsSelection, $[17] = rangeDecorations, $[18] = renderAnnotation, $[19] = renderBlock, $[20] = renderChild, $[21] = renderDecorator, $[22] = renderListItem, $[23] = renderPlaceholder, $[24] = renderStyle, $[25] = restProps, $[26] = scrollSelectionIntoView, $[27] = spellCheck) : (hotkeys2 = $[1], onBeforeInput = $[2], onBlur = $[3], onClick = $[4], onCopy = $[5], onCut = $[6], onDrag = $[7], onDragEnd = $[8], onDragEnter = $[9], onDragLeave = $[10], onDragOver = $[11], onDragStart = $[12], onDrop = $[13], onFocus = $[14], onPaste = $[15], propsSelection = $[16], rangeDecorations = $[17], renderAnnotation = $[18], renderBlock = $[19], renderChild = $[20], renderDecorator = $[21], renderListItem = $[22], renderPlaceholder = $[23], renderStyle = $[24], restProps = $[25], scrollSelectionIntoView = $[26], spellCheck = $[27]);
  const portableTextEditor = usePortableTextEditor(), [hasInvalidValue, setHasInvalidValue] = useState(!1), editorActor = useContext(EditorActorContext), relayActor = useContext(RelayActorContext), readOnly = useSelector(editorActor, _temp), slateEditor = useSlate();
  let t0;
  $[28] !== slateEditor ? (t0 = {
    input: {
      slateEditor
    }
  }, $[28] = slateEditor, $[29] = t0) : t0 = $[29];
  const validateSelectionActor = useActorRef(validateSelectionMachine, t0);
  let t1;
  $[30] !== rangeDecorations ? (t1 = rangeDecorations ?? [], $[30] = rangeDecorations, $[31] = t1) : t1 = $[31];
  let t2;
  $[32] !== editorActor ? (t2 = editorActor.getSnapshot(), $[32] = editorActor, $[33] = t2) : t2 = $[33];
  const t3 = t2.context.schema;
  let t4;
  $[34] !== editorActor ? (t4 = editorActor.getSnapshot().matches({
    setup: "setting up"
  }), $[34] = editorActor, $[35] = t4) : t4 = $[35];
  const t5 = !t4;
  let t6;
  $[36] !== readOnly || $[37] !== slateEditor || $[38] !== t1 || $[39] !== t2.context.schema || $[40] !== t5 ? (t6 = {
    input: {
      rangeDecorations: t1,
      readOnly,
      schema: t3,
      slateEditor,
      skipSetup: t5
    }
  }, $[36] = readOnly, $[37] = slateEditor, $[38] = t1, $[39] = t2.context.schema, $[40] = t5, $[41] = t6) : t6 = $[41];
  const rangeDecorationsActor = useActorRef(rangeDecorationsMachine, t6), decorate = useSelector(rangeDecorationsActor, _temp2);
  let t7, t8;
  $[42] !== rangeDecorationsActor || $[43] !== readOnly ? (t7 = () => {
    rangeDecorationsActor.send({
      type: "update read only",
      readOnly
    });
  }, t8 = [rangeDecorationsActor, readOnly], $[42] = rangeDecorationsActor, $[43] = readOnly, $[44] = t7, $[45] = t8) : (t7 = $[44], t8 = $[45]), useEffect(t7, t8);
  let t10, t9;
  $[46] !== rangeDecorations || $[47] !== rangeDecorationsActor ? (t9 = () => {
    rangeDecorationsActor.send({
      type: "range decorations updated",
      rangeDecorations: rangeDecorations ?? []
    });
  }, t10 = [rangeDecorationsActor, rangeDecorations], $[46] = rangeDecorations, $[47] = rangeDecorationsActor, $[48] = t10, $[49] = t9) : (t10 = $[48], t9 = $[49]), useEffect(t9, t10);
  bb0: {
    if (readOnly)
      break bb0;
    createWithHotkeys(editorActor, portableTextEditor, hotkeys2)(slateEditor);
  }
  let t12;
  $[50] !== readOnly || $[51] !== renderBlock || $[52] !== renderChild || $[53] !== renderListItem || $[54] !== renderStyle || $[55] !== spellCheck ? (t12 = (eProps) => /* @__PURE__ */ jsx(RenderElement, { ...eProps, readOnly, renderBlock, renderChild, renderListItem, renderStyle, spellCheck }), $[50] = readOnly, $[51] = renderBlock, $[52] = renderChild, $[53] = renderListItem, $[54] = renderStyle, $[55] = spellCheck, $[56] = t12) : t12 = $[56];
  const renderElement = t12;
  let t13;
  $[57] !== readOnly || $[58] !== renderAnnotation || $[59] !== renderChild || $[60] !== renderDecorator || $[61] !== renderPlaceholder ? (t13 = (leafProps) => /* @__PURE__ */ jsx(RenderLeaf, { ...leafProps, readOnly, renderAnnotation, renderChild, renderDecorator, renderPlaceholder }), $[57] = readOnly, $[58] = renderAnnotation, $[59] = renderChild, $[60] = renderDecorator, $[61] = renderPlaceholder, $[62] = t13) : t13 = $[62];
  const renderLeaf = t13, renderText = _temp3;
  let t14;
  $[63] !== editorActor || $[64] !== propsSelection || $[65] !== slateEditor ? (t14 = () => {
    if (propsSelection) {
      debug$e(`Selection from props ${JSON.stringify(propsSelection)}`);
      const normalizedSelection = normalizeSelection(propsSelection, slateEditor.value);
      if (normalizedSelection !== null) {
        debug$e(`Normalized selection from props ${JSON.stringify(normalizedSelection)}`);
        const slateRange = toSlateRange({
          context: {
            schema: editorActor.getSnapshot().context.schema,
            value: slateEditor.value,
            selection: normalizedSelection
          },
          blockIndexMap: slateEditor.blockIndexMap
        });
        slateRange && (Transforms.select(slateEditor, slateRange), slateEditor.operations.some(_temp4) || editorActor.send({
          type: "update selection",
          selection: normalizedSelection
        }), slateEditor.onChange());
      }
    }
  }, $[63] = editorActor, $[64] = propsSelection, $[65] = slateEditor, $[66] = t14) : t14 = $[66];
  const restoreSelectionFromProps = t14;
  let t15, t16;
  $[67] !== editorActor || $[68] !== rangeDecorationsActor || $[69] !== restoreSelectionFromProps ? (t15 = () => {
    const onReady = editorActor.on("ready", () => {
      rangeDecorationsActor.send({
        type: "ready"
      }), restoreSelectionFromProps();
    }), onInvalidValue = editorActor.on("invalid value", () => {
      setHasInvalidValue(!0);
    }), onValueChanged = editorActor.on("value changed", () => {
      setHasInvalidValue(!1);
    });
    return () => {
      onReady.unsubscribe(), onInvalidValue.unsubscribe(), onValueChanged.unsubscribe();
    };
  }, t16 = [rangeDecorationsActor, editorActor, restoreSelectionFromProps], $[67] = editorActor, $[68] = rangeDecorationsActor, $[69] = restoreSelectionFromProps, $[70] = t15, $[71] = t16) : (t15 = $[70], t16 = $[71]), useEffect(t15, t16);
  let t17, t18;
  $[72] !== hasInvalidValue || $[73] !== propsSelection || $[74] !== restoreSelectionFromProps ? (t17 = () => {
    propsSelection && !hasInvalidValue && restoreSelectionFromProps();
  }, t18 = [hasInvalidValue, propsSelection, restoreSelectionFromProps], $[72] = hasInvalidValue, $[73] = propsSelection, $[74] = restoreSelectionFromProps, $[75] = t17, $[76] = t18) : (t17 = $[75], t18 = $[76]), useEffect(t17, t18);
  let t19;
  $[77] !== editorActor || $[78] !== onCopy || $[79] !== slateEditor ? (t19 = (event) => {
    if (onCopy)
      onCopy(event) !== void 0 && event.preventDefault();
    else if (event.nativeEvent.clipboardData) {
      event.stopPropagation(), event.preventDefault();
      const selection = slateEditor.selection ? slateRangeToSelection({
        schema: editorActor.getSnapshot().context.schema,
        editor: slateEditor,
        range: slateEditor.selection
      }) : void 0, position = selection ? {
        selection
      } : void 0;
      if (!position) {
        console.warn("Could not find position for copy event");
        return;
      }
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "clipboard.copy",
          originEvent: {
            dataTransfer: event.nativeEvent.clipboardData
          },
          position
        },
        editor: slateEditor,
        nativeEvent: event
      });
    }
  }, $[77] = editorActor, $[78] = onCopy, $[79] = slateEditor, $[80] = t19) : t19 = $[80];
  const handleCopy = t19;
  let t20;
  $[81] !== editorActor || $[82] !== onCut || $[83] !== slateEditor ? (t20 = (event_0) => {
    if (onCut)
      onCut(event_0) !== void 0 && event_0.preventDefault();
    else if (event_0.nativeEvent.clipboardData) {
      event_0.stopPropagation(), event_0.preventDefault();
      const selection_0 = editorActor.getSnapshot().context.selection, position_0 = selection_0 ? {
        selection: selection_0
      } : void 0;
      if (!position_0) {
        console.warn("Could not find position for cut event");
        return;
      }
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "clipboard.cut",
          originEvent: {
            dataTransfer: event_0.nativeEvent.clipboardData
          },
          position: position_0
        },
        editor: slateEditor,
        nativeEvent: event_0
      });
    }
  }, $[81] = editorActor, $[82] = onCut, $[83] = slateEditor, $[84] = t20) : t20 = $[84];
  const handleCut = t20;
  let t21;
  $[85] !== editorActor || $[86] !== onPaste || $[87] !== portableTextEditor || $[88] !== relayActor || $[89] !== slateEditor ? (t21 = (event_1) => {
    const value = slateEditor.value, path3 = (slateEditor.selection ? slateRangeToSelection({
      schema: editorActor.getSnapshot().context.schema,
      editor: slateEditor,
      range: slateEditor.selection
    }) : null)?.focus.path || [], onPasteResult = onPaste?.({
      event: event_1,
      value,
      path: path3,
      schemaTypes: portableTextEditor.schemaTypes
    });
    if (onPasteResult || !slateEditor.selection)
      event_1.preventDefault(), relayActor.send({
        type: "loading"
      }), Promise.resolve(onPasteResult).then((result_1) => {
        if (debug$e("Custom paste function from client resolved", result_1), !result_1 || !result_1.insert) {
          debug$e("No result from custom paste handler, pasting normally");
          const selection_1 = editorActor.getSnapshot().context.selection, position_1 = selection_1 ? {
            selection: selection_1
          } : void 0;
          if (!position_1) {
            console.warn("Could not find position for paste event");
            return;
          }
          editorActor.send({
            type: "behavior event",
            behaviorEvent: {
              type: "clipboard.paste",
              originEvent: {
                dataTransfer: event_1.clipboardData
              },
              position: position_1
            },
            editor: slateEditor,
            nativeEvent: event_1
          });
        } else
          result_1.insert ? editorActor.send({
            type: "behavior event",
            behaviorEvent: {
              type: "insert.blocks",
              blocks: parseBlocks({
                context: {
                  keyGenerator: editorActor.getSnapshot().context.keyGenerator,
                  schema: editorActor.getSnapshot().context.schema
                },
                blocks: result_1.insert,
                options: {
                  normalize: !1,
                  removeUnusedMarkDefs: !0,
                  validateFields: !1
                }
              }),
              placement: "auto"
            },
            editor: slateEditor
          }) : console.warn("Your onPaste function returned something unexpected:", result_1);
      }).catch(_temp5).finally(() => {
        relayActor.send({
          type: "done loading"
        });
      });
    else if (event_1.nativeEvent.clipboardData) {
      event_1.preventDefault(), event_1.stopPropagation();
      const selection_2 = editorActor.getSnapshot().context.selection, position_2 = selection_2 ? {
        selection: selection_2
      } : void 0;
      if (!position_2) {
        console.warn("Could not find position for paste event");
        return;
      }
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "clipboard.paste",
          originEvent: {
            dataTransfer: event_1.nativeEvent.clipboardData
          },
          position: position_2
        },
        editor: slateEditor,
        nativeEvent: event_1
      });
    }
    debug$e("No result from custom paste handler, pasting normally");
  }, $[85] = editorActor, $[86] = onPaste, $[87] = portableTextEditor, $[88] = relayActor, $[89] = slateEditor, $[90] = t21) : t21 = $[90];
  const handlePaste = t21;
  let t22;
  $[91] !== editorActor || $[92] !== onFocus || $[93] !== relayActor || $[94] !== slateEditor ? (t22 = (event_2) => {
    onFocus && onFocus(event_2), event_2.isDefaultPrevented() || (relayActor.send({
      type: "focused",
      event: event_2
    }), !slateEditor.selection && slateEditor.children.length === 1 && isEmptyTextBlock(editorActor.getSnapshot().context, slateEditor.value.at(0)) && (Transforms.select(slateEditor, Editor.start(slateEditor, [])), slateEditor.onChange()));
  }, $[91] = editorActor, $[92] = onFocus, $[93] = relayActor, $[94] = slateEditor, $[95] = t22) : t22 = $[95];
  const handleOnFocus = t22;
  let t23;
  $[96] !== editorActor || $[97] !== onClick || $[98] !== slateEditor ? (t23 = (event_3) => {
    if (onClick && onClick(event_3), event_3.isDefaultPrevented() || event_3.isPropagationStopped())
      return;
    const position_3 = getEventPosition({
      editorActor,
      slateEditor,
      event: event_3.nativeEvent
    });
    position_3 && editorActor.send({
      type: "behavior event",
      behaviorEvent: {
        type: "mouse.click",
        position: position_3
      },
      editor: slateEditor,
      nativeEvent: event_3
    });
  }, $[96] = editorActor, $[97] = onClick, $[98] = slateEditor, $[99] = t23) : t23 = $[99];
  const handleClick = t23;
  let t24;
  $[100] !== onBlur || $[101] !== relayActor ? (t24 = (event_4) => {
    onBlur && onBlur(event_4), event_4.isPropagationStopped() || relayActor.send({
      type: "blurred",
      event: event_4
    });
  }, $[100] = onBlur, $[101] = relayActor, $[102] = t24) : t24 = $[102];
  const handleOnBlur = t24;
  let t25;
  $[103] !== onBeforeInput ? (t25 = (event_5) => {
    onBeforeInput && onBeforeInput(event_5);
  }, $[103] = onBeforeInput, $[104] = t25) : t25 = $[104];
  const handleOnBeforeInput = t25;
  let t26;
  $[105] !== editorActor || $[106] !== props || $[107] !== slateEditor ? (t26 = (event_6) => {
    props.onKeyDown && props.onKeyDown(event_6), event_6.isDefaultPrevented() || slateEditor.pteWithHotKeys(event_6), event_6.isDefaultPrevented() || editorActor.send({
      type: "behavior event",
      behaviorEvent: {
        type: "keyboard.keydown",
        originEvent: {
          key: event_6.key,
          code: event_6.code,
          altKey: event_6.altKey,
          ctrlKey: event_6.ctrlKey,
          metaKey: event_6.metaKey,
          shiftKey: event_6.shiftKey
        }
      },
      editor: slateEditor,
      nativeEvent: event_6
    });
  }, $[105] = editorActor, $[106] = props, $[107] = slateEditor, $[108] = t26) : t26 = $[108];
  const handleKeyDown = t26;
  let t27;
  $[109] !== editorActor || $[110] !== props || $[111] !== slateEditor ? (t27 = (event_7) => {
    props.onKeyUp && props.onKeyUp(event_7), event_7.isDefaultPrevented() || editorActor.send({
      type: "behavior event",
      behaviorEvent: {
        type: "keyboard.keyup",
        originEvent: {
          key: event_7.key,
          code: event_7.code,
          altKey: event_7.altKey,
          ctrlKey: event_7.ctrlKey,
          metaKey: event_7.metaKey,
          shiftKey: event_7.shiftKey
        }
      },
      editor: slateEditor,
      nativeEvent: event_7
    });
  }, $[109] = editorActor, $[110] = props, $[111] = slateEditor, $[112] = t27) : t27 = $[112];
  const handleKeyUp = t27;
  let t28;
  bb1: {
    if (scrollSelectionIntoView === void 0) {
      t28 = void 0;
      break bb1;
    }
    if (scrollSelectionIntoView === null) {
      t28 = noop;
      break bb1;
    }
    let t292;
    $[113] !== portableTextEditor || $[114] !== scrollSelectionIntoView ? (t292 = (_editor, domRange) => {
      scrollSelectionIntoView(portableTextEditor, domRange);
    }, $[113] = portableTextEditor, $[114] = scrollSelectionIntoView, $[115] = t292) : t292 = $[115], t28 = t292;
  }
  const scrollSelectionIntoViewToSlate = t28;
  let t29, t30;
  $[116] !== editorActor || $[117] !== slateEditor ? (t29 = () => {
    const window2 = ReactEditor.getWindow(slateEditor), onDragEnd_0 = () => {
      editorActor.send({
        type: "dragend"
      });
    }, onDrop_0 = () => {
      editorActor.send({
        type: "drop"
      });
    };
    return window2.document.addEventListener("dragend", onDragEnd_0), window2.document.addEventListener("drop", onDrop_0), () => {
      window2.document.removeEventListener("dragend", onDragEnd_0), window2.document.removeEventListener("drop", onDrop_0);
    };
  }, t30 = [slateEditor, editorActor], $[116] = editorActor, $[117] = slateEditor, $[118] = t29, $[119] = t30) : (t29 = $[118], t30 = $[119]), useEffect(t29, t30);
  let t31;
  $[120] !== editorActor || $[121] !== onDragStart || $[122] !== slateEditor ? (t31 = (event_8) => {
    if (onDragStart?.(event_8), event_8.isDefaultPrevented() || event_8.isPropagationStopped())
      return;
    const position_4 = getEventPosition({
      editorActor,
      slateEditor,
      event: event_8.nativeEvent
    });
    if (!position_4) {
      console.warn("Could not find position for dragstart event");
      return;
    }
    return editorActor.send({
      type: "dragstart",
      origin: position_4
    }), editorActor.send({
      type: "behavior event",
      behaviorEvent: {
        type: "drag.dragstart",
        originEvent: {
          clientX: event_8.clientX,
          clientY: event_8.clientY,
          dataTransfer: event_8.dataTransfer
        },
        position: position_4
      },
      editor: slateEditor
    }), !0;
  }, $[120] = editorActor, $[121] = onDragStart, $[122] = slateEditor, $[123] = t31) : t31 = $[123];
  const handleDragStart = t31;
  let t32;
  $[124] !== editorActor || $[125] !== onDrag || $[126] !== slateEditor ? (t32 = (event_9) => {
    if (onDrag?.(event_9), !(event_9.isDefaultPrevented() || event_9.isPropagationStopped() || !getEventPosition({
      editorActor,
      slateEditor,
      event: event_9.nativeEvent
    })))
      return editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "drag.drag",
          originEvent: {
            dataTransfer: event_9.dataTransfer
          }
        },
        editor: slateEditor
      }), !0;
  }, $[124] = editorActor, $[125] = onDrag, $[126] = slateEditor, $[127] = t32) : t32 = $[127];
  const handleDrag = t32;
  let t33;
  $[128] !== editorActor || $[129] !== onDragEnd || $[130] !== slateEditor ? (t33 = (event_10) => {
    if (onDragEnd?.(event_10), !(event_10.isDefaultPrevented() || event_10.isPropagationStopped()))
      return editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "drag.dragend",
          originEvent: {
            dataTransfer: event_10.dataTransfer
          }
        },
        editor: slateEditor
      }), !0;
  }, $[128] = editorActor, $[129] = onDragEnd, $[130] = slateEditor, $[131] = t33) : t33 = $[131];
  const handleDragEnd = t33;
  let t34;
  $[132] !== editorActor || $[133] !== onDragEnter || $[134] !== slateEditor ? (t34 = (event_11) => {
    if (onDragEnter?.(event_11), event_11.isDefaultPrevented() || event_11.isPropagationStopped())
      return;
    const position_6 = getEventPosition({
      editorActor,
      slateEditor,
      event: event_11.nativeEvent
    });
    if (position_6)
      return editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "drag.dragenter",
          originEvent: {
            dataTransfer: event_11.dataTransfer
          },
          position: position_6
        },
        editor: slateEditor
      }), !0;
  }, $[132] = editorActor, $[133] = onDragEnter, $[134] = slateEditor, $[135] = t34) : t34 = $[135];
  const handleDragEnter = t34;
  let t35;
  $[136] !== editorActor || $[137] !== onDragOver || $[138] !== slateEditor ? (t35 = (event_12) => {
    if (onDragOver?.(event_12), event_12.isDefaultPrevented() || event_12.isPropagationStopped())
      return;
    const position_7 = getEventPosition({
      editorActor,
      slateEditor,
      event: event_12.nativeEvent
    });
    if (position_7)
      return editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "drag.dragover",
          originEvent: {
            dataTransfer: event_12.dataTransfer
          },
          dragOrigin: editorActor.getSnapshot().context.internalDrag?.origin,
          position: position_7
        },
        editor: slateEditor,
        nativeEvent: event_12
      }), !0;
  }, $[136] = editorActor, $[137] = onDragOver, $[138] = slateEditor, $[139] = t35) : t35 = $[139];
  const handleDragOver = t35;
  let t36;
  $[140] !== editorActor || $[141] !== onDrop || $[142] !== slateEditor ? (t36 = (event_13) => {
    if (onDrop?.(event_13), event_13.isDefaultPrevented() || event_13.isPropagationStopped())
      return;
    const position_8 = getEventPosition({
      editorActor,
      slateEditor,
      event: event_13.nativeEvent
    });
    if (!position_8) {
      console.warn("Could not find position for drop event");
      return;
    }
    return editorActor.send({
      type: "behavior event",
      behaviorEvent: {
        type: "drag.drop",
        originEvent: {
          dataTransfer: event_13.dataTransfer
        },
        dragOrigin: editorActor.getSnapshot().context.internalDrag?.origin,
        position: position_8
      },
      editor: slateEditor,
      nativeEvent: event_13
    }), !0;
  }, $[140] = editorActor, $[141] = onDrop, $[142] = slateEditor, $[143] = t36) : t36 = $[143];
  const handleDrop = t36;
  let t37;
  $[144] !== editorActor || $[145] !== onDragLeave || $[146] !== slateEditor ? (t37 = (event_14) => {
    if (onDragLeave?.(event_14), !(event_14.isDefaultPrevented() || event_14.isPropagationStopped() || !getEventPosition({
      editorActor,
      slateEditor,
      event: event_14.nativeEvent
    })))
      return editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "drag.dragleave",
          originEvent: {
            dataTransfer: event_14.dataTransfer
          }
        },
        editor: slateEditor
      }), !0;
  }, $[144] = editorActor, $[145] = onDragLeave, $[146] = slateEditor, $[147] = t37) : t37 = $[147];
  const handleDragLeave = t37;
  let t38;
  $[148] !== forwardedRef || $[149] !== validateSelectionActor ? (t38 = (editorElement) => {
    if (typeof forwardedRef == "function" ? forwardedRef(editorElement) : forwardedRef && (forwardedRef.current = editorElement), editorElement) {
      const mutationObserver = new MutationObserver(() => {
        validateSelectionActor.send({
          type: "validate selection",
          editorElement
        });
      });
      return mutationObserver.observe(editorElement, {
        attributeOldValue: !1,
        attributes: !1,
        characterData: !1,
        childList: !0,
        subtree: !0
      }), () => {
        mutationObserver.disconnect();
      };
    }
  }, $[148] = forwardedRef, $[149] = validateSelectionActor, $[150] = t38) : t38 = $[150];
  const callbackRef = t38;
  if (!portableTextEditor)
    return null;
  let t39;
  return $[151] !== callbackRef || $[152] !== decorate || $[153] !== handleClick || $[154] !== handleCopy || $[155] !== handleCut || $[156] !== handleDrag || $[157] !== handleDragEnd || $[158] !== handleDragEnter || $[159] !== handleDragLeave || $[160] !== handleDragOver || $[161] !== handleDragStart || $[162] !== handleDrop || $[163] !== handleKeyDown || $[164] !== handleKeyUp || $[165] !== handleOnBeforeInput || $[166] !== handleOnBlur || $[167] !== handleOnFocus || $[168] !== handlePaste || $[169] !== hasInvalidValue || $[170] !== readOnly || $[171] !== renderElement || $[172] !== renderLeaf || $[173] !== restProps || $[174] !== scrollSelectionIntoViewToSlate ? (t39 = hasInvalidValue ? null : /* @__PURE__ */ jsx(Editable, { ...restProps, ref: callbackRef, "data-read-only": readOnly, autoFocus: !1, className: restProps.className || "pt-editable", decorate, onBlur: handleOnBlur, onCopy: handleCopy, onCut: handleCut, onClick: handleClick, onDOMBeforeInput: handleOnBeforeInput, onDragStart: handleDragStart, onDrag: handleDrag, onDragEnd: handleDragEnd, onDragEnter: handleDragEnter, onDragOver: handleDragOver, onDrop: handleDrop, onDragLeave: handleDragLeave, onFocus: handleOnFocus, onKeyDown: handleKeyDown, onKeyUp: handleKeyUp, onPaste: handlePaste, readOnly, renderPlaceholder: void 0, renderElement, renderLeaf, renderText, scrollSelectionIntoView: scrollSelectionIntoViewToSlate }), $[151] = callbackRef, $[152] = decorate, $[153] = handleClick, $[154] = handleCopy, $[155] = handleCut, $[156] = handleDrag, $[157] = handleDragEnd, $[158] = handleDragEnter, $[159] = handleDragLeave, $[160] = handleDragOver, $[161] = handleDragStart, $[162] = handleDrop, $[163] = handleKeyDown, $[164] = handleKeyUp, $[165] = handleOnBeforeInput, $[166] = handleOnBlur, $[167] = handleOnFocus, $[168] = handlePaste, $[169] = hasInvalidValue, $[170] = readOnly, $[171] = renderElement, $[172] = renderLeaf, $[173] = restProps, $[174] = scrollSelectionIntoViewToSlate, $[175] = t39) : t39 = $[175], t39;
});
PortableTextEditable.displayName = "ForwardRef(PortableTextEditable)";
function _temp(s) {
  return s.matches({
    "edit mode": "read only"
  });
}
function _temp2(s_0) {
  return s_0.context.decorate?.fn;
}
function _temp3(props_0) {
  return /* @__PURE__ */ jsx(RenderText, { ...props_0 });
}
function _temp4(o2) {
  return o2.type === "set_selection";
}
function _temp5(error) {
  return console.warn(error), error;
}
const forEachActor = (actorRef, callback) => {
  callback(actorRef);
  const children = actorRef.getSnapshot().children;
  children && Object.values(children).forEach((child) => {
    forEachActor(child, callback);
  });
};
function stopActor(actorRef) {
  const persistedSnapshots = [];
  forEachActor(actorRef, (ref) => {
    persistedSnapshots.push([ref, ref.getSnapshot()]), ref.observers = /* @__PURE__ */ new Set();
  });
  const systemSnapshot = actorRef.system.getSnapshot?.();
  actorRef.stop(), actorRef.system._snapshot = systemSnapshot, persistedSnapshots.forEach(([ref, snapshot]) => {
    ref._processingStatus = 0, ref._snapshot = snapshot;
  });
}
const converterJson = {
  mimeType: "application/json",
  serialize: ({
    snapshot,
    event
  }) => {
    const portableTextConverter = snapshot.context.converters.find((converter) => converter.mimeType === "application/x-portable-text");
    return portableTextConverter ? {
      ...portableTextConverter.serialize({
        snapshot,
        event
      }),
      mimeType: "application/json",
      originEvent: event.originEvent
    } : {
      type: "serialization.failure",
      mimeType: "application/json",
      originEvent: event.originEvent,
      reason: "No application/x-portable-text Converter found"
    };
  },
  deserialize: ({
    snapshot,
    event
  }) => {
    const portableTextConverter = snapshot.context.converters.find((converter) => converter.mimeType === "application/x-portable-text");
    return portableTextConverter ? {
      ...portableTextConverter.deserialize({
        snapshot,
        event
      }),
      mimeType: "application/json"
    } : {
      type: "deserialization.failure",
      mimeType: "application/json",
      reason: "No application/x-portable-text Converter found"
    };
  }
}, converterPortableText = {
  mimeType: "application/x-portable-text",
  serialize: ({
    snapshot,
    event
  }) => {
    if (!snapshot.context.selection)
      return {
        type: "serialization.failure",
        mimeType: "application/x-portable-text",
        originEvent: event.originEvent,
        reason: "No selection"
      };
    const blocks = getSelectedValue(snapshot);
    return blocks.length === 0 ? {
      type: "serialization.failure",
      mimeType: "application/x-portable-text",
      reason: "No blocks serialized",
      originEvent: event.originEvent
    } : {
      type: "serialization.success",
      data: JSON.stringify(blocks),
      mimeType: "application/x-portable-text",
      originEvent: event.originEvent
    };
  },
  deserialize: ({
    snapshot,
    event
  }) => {
    const blocks = JSON.parse(event.data);
    if (!Array.isArray(blocks))
      return {
        type: "deserialization.failure",
        mimeType: "application/x-portable-text",
        reason: "Data is not an array"
      };
    const parsedBlocks = blocks.flatMap((block) => {
      const parsedBlock = parseBlock({
        context: snapshot.context,
        block,
        options: {
          normalize: !1,
          removeUnusedMarkDefs: !0,
          validateFields: !1
        }
      });
      return parsedBlock ? [parsedBlock] : [];
    });
    return parsedBlocks.length === 0 && blocks.length > 0 ? {
      type: "deserialization.failure",
      mimeType: "application/x-portable-text",
      reason: "No blocks were parsed"
    } : {
      type: "deserialization.success",
      data: parsedBlocks,
      mimeType: "application/x-portable-text"
    };
  }
};
function createConverterTextHtml(legacySchema) {
  return {
    mimeType: "text/html",
    serialize: ({
      snapshot,
      event
    }) => {
      if (!snapshot.context.selection)
        return {
          type: "serialization.failure",
          mimeType: "text/html",
          originEvent: event.originEvent,
          reason: "No selection"
        };
      const blocks = getSelectedValue(snapshot), html = toHTML(blocks, {
        onMissingComponent: !1,
        components: {
          unknownType: ({
            children
          }) => children !== void 0 ? `${children}` : ""
        }
      });
      return html === "" ? {
        type: "serialization.failure",
        mimeType: "text/html",
        originEvent: event.originEvent,
        reason: "Serialized HTML is empty"
      } : {
        type: "serialization.success",
        data: html,
        mimeType: "text/html",
        originEvent: event.originEvent
      };
    },
    deserialize: ({
      snapshot,
      event
    }) => {
      const parsedBlocks = htmlToBlocks(event.data, legacySchema.portableText, {
        keyGenerator: snapshot.context.keyGenerator,
        unstable_whitespaceOnPasteMode: legacySchema.block.options.unstable_whitespaceOnPasteMode
      }).flatMap((block) => {
        const parsedBlock = parseBlock({
          context: snapshot.context,
          block,
          options: {
            normalize: !1,
            removeUnusedMarkDefs: !0,
            validateFields: !1
          }
        });
        return parsedBlock ? [parsedBlock] : [];
      });
      return parsedBlocks.length === 0 ? {
        type: "deserialization.failure",
        mimeType: "text/html",
        reason: "No blocks deserialized"
      } : {
        type: "deserialization.success",
        data: parsedBlocks,
        mimeType: "text/html"
      };
    }
  };
}
const converterTextMarkdown = {
  mimeType: "text/markdown",
  serialize: ({
    snapshot,
    event
  }) => {
    if (!snapshot.context.selection)
      return {
        type: "serialization.failure",
        mimeType: "text/markdown",
        reason: "No selection",
        originEvent: event.originEvent
      };
    const blocks = getSelectedValue(snapshot);
    return {
      type: "serialization.success",
      data: portableTextToMarkdown(blocks),
      mimeType: "text/markdown",
      originEvent: event.originEvent
    };
  },
  deserialize: ({
    snapshot,
    event
  }) => {
    const parsedBlocks = markdownToPortableText(event.data, {
      keyGenerator: snapshot.context.keyGenerator,
      schema: snapshot.context.schema
    }).flatMap((block) => {
      const parsedBlock = parseBlock({
        context: snapshot.context,
        block,
        options: {
          normalize: !1,
          removeUnusedMarkDefs: !0,
          validateFields: !1
        }
      });
      return parsedBlock ? [parsedBlock] : [];
    });
    return parsedBlocks.length === 0 ? {
      type: "deserialization.failure",
      mimeType: "text/markdown",
      reason: "No blocks deserialized"
    } : {
      type: "deserialization.success",
      data: parsedBlocks,
      mimeType: "text/markdown"
    };
  }
};
function createConverterTextPlain(legacySchema) {
  return {
    mimeType: "text/plain",
    serialize: ({
      snapshot,
      event
    }) => snapshot.context.selection ? {
      type: "serialization.success",
      data: getSelectedValue(snapshot).map((block) => isTextBlock(snapshot.context, block) ? block.children.map((child) => child._type === snapshot.context.schema.span.name ? child.text : event.originEvent === "drag.dragstart" ? `[${snapshot.context.schema.inlineObjects.find((inlineObjectType) => inlineObjectType.name === child._type)?.title ?? "Object"}]` : "").join("") : event.originEvent === "drag.dragstart" ? `[${snapshot.context.schema.blockObjects.find((blockObjectType) => blockObjectType.name === block._type)?.title ?? "Object"}]` : "").filter((block) => block !== "").join(`

`),
      mimeType: "text/plain",
      originEvent: event.originEvent
    } : {
      type: "serialization.failure",
      mimeType: "text/plain",
      originEvent: event.originEvent,
      reason: "No selection"
    },
    deserialize: ({
      snapshot,
      event
    }) => {
      const textToHtml = `<html><body>${escapeHtml(event.data).split(/\n{2,}/).map((line) => line ? `<p>${line.replace(/(?:\r\n|\r|\n)/g, "<br/>")}</p>` : "<p></p>").join("")}</body></html>`, parsedBlocks = htmlToBlocks(textToHtml, legacySchema.portableText, {
        keyGenerator: snapshot.context.keyGenerator
      }).flatMap((block) => {
        const parsedBlock = parseBlock({
          context: snapshot.context,
          block,
          options: {
            normalize: !1,
            removeUnusedMarkDefs: !0,
            validateFields: !1
          }
        });
        return parsedBlock ? [parsedBlock] : [];
      });
      return parsedBlocks.length === 0 ? {
        type: "deserialization.failure",
        mimeType: "text/plain",
        reason: "No blocks deserialized"
      } : {
        type: "deserialization.success",
        data: parsedBlocks,
        mimeType: "text/plain"
      };
    }
  };
}
const entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;"
};
function escapeHtml(str) {
  return String(str).replace(/[&<>"'`=/]/g, (s) => entityMap[s]);
}
function createCoreConverters(legacySchema) {
  return [converterJson, converterPortableText, converterTextMarkdown, createConverterTextHtml(legacySchema), createConverterTextPlain(legacySchema)];
}
function compileType(rawType) {
  return Schema.compile({
    name: "blockTypeSchema",
    types: [rawType]
  }).get(rawType.name);
}
const levelIndexMaps = /* @__PURE__ */ new Map();
function buildIndexMaps(context, {
  blockIndexMap,
  listIndexMap
}) {
  blockIndexMap.clear(), listIndexMap.clear(), levelIndexMaps.clear();
  let previousListItem;
  for (let blockIndex = 0; blockIndex < context.value.length; blockIndex++) {
    const block = context.value.at(blockIndex);
    if (block === void 0)
      continue;
    if (blockIndexMap.set(block._key, blockIndex), !isTextBlock(context, block)) {
      levelIndexMaps.clear(), previousListItem = void 0;
      continue;
    }
    if (block.listItem === void 0 || block.level === void 0) {
      levelIndexMaps.clear(), previousListItem = void 0;
      continue;
    }
    if (!previousListItem) {
      const levelIndexMap2 = levelIndexMaps.get(block.listItem) ?? /* @__PURE__ */ new Map();
      levelIndexMap2.set(block.level, 1), levelIndexMaps.set(block.listItem, levelIndexMap2), listIndexMap.set(block._key, 1), previousListItem = {
        listItem: block.listItem,
        level: block.level
      };
      continue;
    }
    if (previousListItem.listItem === block.listItem && previousListItem.level < block.level) {
      const levelIndexMap2 = levelIndexMaps.get(block.listItem) ?? /* @__PURE__ */ new Map();
      levelIndexMap2.set(block.level, 1), levelIndexMaps.set(block.listItem, levelIndexMap2), listIndexMap.set(block._key, 1), previousListItem = {
        listItem: block.listItem,
        level: block.level
      };
      continue;
    }
    levelIndexMaps.forEach((levelIndexMap2, listItem) => {
      if (listItem === block.listItem)
        return;
      const levelsToDelete = [];
      levelIndexMap2.forEach((_, level) => {
        level >= block.level && levelsToDelete.push(level);
      }), levelsToDelete.forEach((level) => {
        levelIndexMap2.delete(level);
      });
    });
    const levelIndexMap = levelIndexMaps.get(block.listItem) ?? /* @__PURE__ */ new Map(), levelCounter = levelIndexMap.get(block.level) ?? 0;
    levelIndexMap.set(block.level, levelCounter + 1), levelIndexMaps.set(block.listItem, levelIndexMap), listIndexMap.set(block._key, levelCounter + 1), previousListItem = {
      listItem: block.listItem,
      level: block.level
    };
  }
}
function createPlaceholderBlock(context) {
  return {
    _type: context.schema.block.name,
    _key: context.keyGenerator(),
    style: context.schema.styles[0].name ?? "normal",
    markDefs: [],
    children: [{
      _type: context.schema.span.name,
      _key: context.keyGenerator(),
      text: "",
      marks: []
    }]
  };
}
const IS_PROCESSING_REMOTE_CHANGES = /* @__PURE__ */ new WeakMap(), KEY_TO_SLATE_ELEMENT = /* @__PURE__ */ new WeakMap(), SLATE_TO_PORTABLE_TEXT_RANGE = /* @__PURE__ */ new WeakMap();
function withRemoteChanges(editor, fn) {
  const prev = isChangingRemotely(editor) || !1;
  IS_PROCESSING_REMOTE_CHANGES.set(editor, !0), fn(), IS_PROCESSING_REMOTE_CHANGES.set(editor, prev);
}
function isChangingRemotely(editor) {
  return IS_PROCESSING_REMOTE_CHANGES.get(editor);
}
const REMOTE_PATCHES = /* @__PURE__ */ new WeakMap(), getRemotePatches = (editor) => (REMOTE_PATCHES.get(editor) || REMOTE_PATCHES.set(editor, []), REMOTE_PATCHES.get(editor) ?? []), IS_REDOING = /* @__PURE__ */ new WeakMap();
function pluginRedoing(editor, fn) {
  const prev = isRedoing(editor);
  IS_REDOING.set(editor, !0), fn(), IS_REDOING.set(editor, prev);
}
function isRedoing(editor) {
  return IS_REDOING.get(editor) ?? !1;
}
function setIsRedoing(editor, isRedoing2) {
  IS_REDOING.set(editor, isRedoing2);
}
const IS_UDOING = /* @__PURE__ */ new WeakMap();
function pluginUndoing(editor, fn) {
  const prev = isUndoing(editor);
  IS_UDOING.set(editor, !0), fn(), IS_UDOING.set(editor, prev);
}
function isUndoing(editor) {
  return IS_UDOING.get(editor) ?? !1;
}
function setIsUndoing(editor, isUndoing2) {
  IS_UDOING.set(editor, isUndoing2);
}
const WITH_HISTORY = /* @__PURE__ */ new WeakMap();
function isWithHistory(editor) {
  return WITH_HISTORY.get(editor) ?? !0;
}
function pluginWithoutHistory(editor, fn) {
  const withHistory = isWithHistory(editor);
  WITH_HISTORY.set(editor, !1), fn(), WITH_HISTORY.set(editor, withHistory);
}
function setWithHistory(editor, withHistory) {
  WITH_HISTORY.set(editor, withHistory);
}
const IS_NORMALIZING_NODE = /* @__PURE__ */ new WeakMap();
function withNormalizeNode(editor, fn) {
  const prev = IS_NORMALIZING_NODE.get(editor);
  IS_NORMALIZING_NODE.set(editor, !0), fn(), IS_NORMALIZING_NODE.set(editor, prev);
}
function isNormalizingNode(editor) {
  return IS_NORMALIZING_NODE.get(editor) ?? !1;
}
const CURRENT_UNDO_STEP_ID = /* @__PURE__ */ new WeakMap();
function getCurrentUndoStepId(editor) {
  return CURRENT_UNDO_STEP_ID.get(editor)?.undoStepId;
}
function createUndoStepId(editor) {
  CURRENT_UNDO_STEP_ID.set(editor, {
    undoStepId: defaultKeyGenerator()
  });
}
function clearUndoStepId(editor) {
  CURRENT_UNDO_STEP_ID.set(editor, void 0);
}
function createUndoSteps({
  steps,
  op,
  editor,
  currentUndoStepId,
  previousUndoStepId
}) {
  const lastStep = steps.at(-1);
  if (!lastStep)
    return createNewStep(steps, op, editor);
  if (editor.operations.length > 0)
    return currentUndoStepId === previousUndoStepId || isNormalizingNode(editor) ? mergeIntoLastStep(steps, lastStep, op) : createNewStep(steps, op, editor);
  if (op.type === "set_selection" && currentUndoStepId === void 0 && previousUndoStepId !== void 0 || op.type === "set_selection" && currentUndoStepId !== void 0 && previousUndoStepId !== void 0 && previousUndoStepId !== currentUndoStepId)
    return mergeIntoLastStep(steps, lastStep, op);
  if (currentUndoStepId === void 0 && previousUndoStepId === void 0) {
    if (op.type === "set_selection")
      return mergeIntoLastStep(steps, lastStep, op);
    const lastOp = lastStep.operations.at(-1);
    return lastOp && op.type === "insert_text" && lastOp.type === "insert_text" && op.offset === lastOp.offset + lastOp.text.length && Path.equals(op.path, lastOp.path) && op.text !== " " || lastOp && op.type === "remove_text" && lastOp.type === "remove_text" && op.offset + op.text.length === lastOp.offset && Path.equals(op.path, lastOp.path) ? mergeIntoLastStep(steps, lastStep, op) : createNewStep(steps, op, editor);
  }
  return createNewStep(steps, op, editor);
}
function createNewStep(steps, op, editor) {
  const operations = editor.selection === null ? [op] : [{
    type: "set_selection",
    properties: {
      ...editor.selection
    },
    newProperties: {
      ...editor.selection
    }
  }, op];
  return [...steps, {
    operations,
    timestamp: /* @__PURE__ */ new Date()
  }];
}
function mergeIntoLastStep(steps, lastStep, op) {
  return [...steps.slice(0, -1), {
    timestamp: lastStep.timestamp,
    operations: [...lastStep.operations, op]
  }];
}
const debug$d = debugWithName("plugin:history"), UNDO_STEP_LIMIT = 1e3;
function pluginHistory({
  editorActor,
  subscriptions
}) {
  return (editor) => {
    const remotePatches = getRemotePatches(editor);
    let previousSnapshot = editor.value, previousUndoStepId = getCurrentUndoStepId(editor);
    subscriptions.push(() => {
      const subscription = editorActor.on("patches", ({
        patches,
        snapshot
      }) => {
        let reset = !1;
        for (const patch of patches)
          if (!reset && patch.origin !== "local") {
            if (patch.type === "unset" && patch.path.length === 0) {
              debug$d("Someone else cleared the content, resetting undo/redo history"), editor.history = {
                undos: [],
                redos: []
              }, remotePatches.splice(0, remotePatches.length), setWithHistory(editor, !0), reset = !0;
              return;
            }
            remotePatches.push({
              patch,
              time: /* @__PURE__ */ new Date(),
              snapshot,
              previousSnapshot
            });
          }
        previousSnapshot = snapshot;
      });
      return () => {
        subscription.unsubscribe();
      };
    }), editor.history = {
      undos: [],
      redos: []
    };
    const {
      apply: apply2
    } = editor;
    return editor.apply = (op) => {
      if (editorActor.getSnapshot().matches({
        "edit mode": "read only"
      })) {
        apply2(op);
        return;
      }
      if (isChangingRemotely(editor)) {
        apply2(op);
        return;
      }
      if (isUndoing(editor) || isRedoing(editor)) {
        apply2(op);
        return;
      }
      const withHistory = isWithHistory(editor), currentUndoStepId = getCurrentUndoStepId(editor);
      if (!withHistory) {
        previousUndoStepId = currentUndoStepId, apply2(op);
        return;
      }
      for (op.type !== "set_selection" && (editor.history.redos = []), editor.history.undos = createUndoSteps({
        steps: editor.history.undos,
        op,
        editor,
        currentUndoStepId,
        previousUndoStepId
      }); editor.history.undos.length > UNDO_STEP_LIMIT; )
        editor.history.undos.shift();
      previousUndoStepId = currentUndoStepId, apply2(op);
    }, editor;
  };
}
function getPreviousSpan({
  editor,
  blockPath,
  spanPath
}) {
  let previousSpan;
  for (const [child, childPath] of Node.children(editor, blockPath, {
    reverse: !0
  }))
    if (editor.isTextSpan(child) && Path.isBefore(childPath, spanPath)) {
      previousSpan = child;
      break;
    }
  return previousSpan;
}
function getNextSpan({
  editor,
  blockPath,
  spanPath
}) {
  let nextSpan;
  for (const [child, childPath] of Node.children(editor, blockPath))
    if (editor.isTextSpan(child) && Path.isAfter(childPath, spanPath)) {
      nextSpan = child;
      break;
    }
  return nextSpan;
}
const PATCHING = /* @__PURE__ */ new WeakMap();
function withoutPatching(editor, fn) {
  const prev = isPatching(editor);
  PATCHING.set(editor, !1), fn(), PATCHING.set(editor, prev);
}
function isPatching(editor) {
  return PATCHING.get(editor);
}
const debug$c = debugWithName("plugin:withPortableTextMarkModel");
function createWithPortableTextMarkModel(editorActor) {
  return function(editor) {
    const {
      apply: apply2,
      normalizeNode: normalizeNode2
    } = editor, decorators = editorActor.getSnapshot().context.schema.decorators.map((t2) => t2.name), defaultStyle = editorActor.getSnapshot().context.schema.styles.at(0)?.name;
    return editor.normalizeNode = (nodeEntry) => {
      const [node3, path3] = nodeEntry;
      if (Editor.isEditor(node3) && node3.children.length === 0 && withoutPatching(editor, () => {
        withNormalizeNode(editor, () => {
          Transforms.insertNodes(editor, createPlaceholderBlock(editorActor.getSnapshot().context), {
            at: [0],
            select: !0
          });
        });
      }), editor.isTextBlock(node3)) {
        const children = Node.children(editor, path3);
        for (const [child, childPath] of children) {
          const nextNode = node3.children[childPath[1] + 1];
          if (editor.isTextSpan(child) && editor.isTextSpan(nextNode) && child.marks?.every((mark) => nextNode.marks?.includes(mark)) && nextNode.marks?.every((mark) => child.marks?.includes(mark))) {
            debug$c("Merging spans", JSON.stringify(child, null, 2), JSON.stringify(nextNode, null, 2)), withNormalizeNode(editor, () => {
              Transforms.mergeNodes(editor, {
                at: [childPath[0], childPath[1] + 1],
                voids: !0
              });
            });
            return;
          }
        }
      }
      if (editor.isTextBlock(node3) && !Array.isArray(node3.markDefs)) {
        debug$c("Adding .markDefs to block node"), withNormalizeNode(editor, () => {
          Transforms.setNodes(editor, {
            markDefs: []
          }, {
            at: path3
          });
        });
        return;
      }
      if (defaultStyle && editor.isTextBlock(node3) && typeof node3.style > "u") {
        debug$c("Adding .style to block node"), withNormalizeNode(editor, () => {
          Transforms.setNodes(editor, {
            style: defaultStyle
          }, {
            at: path3
          });
        });
        return;
      }
      if (editor.isTextSpan(node3) && !Array.isArray(node3.marks)) {
        debug$c("Adding .marks to span node"), withNormalizeNode(editor, () => {
          Transforms.setNodes(editor, {
            marks: []
          }, {
            at: path3
          });
        });
        return;
      }
      if (editor.isTextSpan(node3)) {
        const blockPath = Path.parent(path3), [block] = Editor.node(editor, blockPath), decorators2 = editorActor.getSnapshot().context.schema.decorators.map((decorator) => decorator.name), annotations = node3.marks?.filter((mark) => !decorators2.includes(mark));
        if (editor.isTextBlock(block) && node3.text === "" && annotations && annotations.length > 0) {
          debug$c("Removing annotations from empty span node"), withNormalizeNode(editor, () => {
            Transforms.setNodes(editor, {
              marks: node3.marks?.filter((mark) => decorators2.includes(mark))
            }, {
              at: path3
            });
          });
          return;
        }
      }
      if (editor.isTextBlock(node3)) {
        const decorators2 = editorActor.getSnapshot().context.schema.decorators.map((decorator) => decorator.name);
        for (const [child, childPath] of Node.children(editor, path3))
          if (editor.isTextSpan(child)) {
            const marks3 = child.marks ?? [], orphanedAnnotations = marks3.filter((mark) => !decorators2.includes(mark) && !node3.markDefs?.find((def) => def._key === mark));
            if (orphanedAnnotations.length > 0) {
              debug$c("Removing orphaned annotations from span node"), withNormalizeNode(editor, () => {
                Transforms.setNodes(editor, {
                  marks: marks3.filter((mark) => !orphanedAnnotations.includes(mark))
                }, {
                  at: childPath
                });
              });
              return;
            }
          }
      }
      if (editor.isTextSpan(node3)) {
        const blockPath = Path.parent(path3), [block] = Editor.node(editor, blockPath);
        if (editor.isTextBlock(block)) {
          const decorators2 = editorActor.getSnapshot().context.schema.decorators.map((decorator) => decorator.name), marks3 = node3.marks ?? [], orphanedAnnotations = marks3.filter((mark) => !decorators2.includes(mark) && !block.markDefs?.find((def) => def._key === mark));
          if (orphanedAnnotations.length > 0) {
            debug$c("Removing orphaned annotations from span node"), withNormalizeNode(editor, () => {
              Transforms.setNodes(editor, {
                marks: marks3.filter((mark) => !orphanedAnnotations.includes(mark))
              }, {
                at: path3
              });
            });
            return;
          }
        }
      }
      if (editor.isTextBlock(node3)) {
        const markDefs = node3.markDefs ?? [], markDefKeys = /* @__PURE__ */ new Set(), newMarkDefs = [];
        for (const markDef of markDefs)
          markDefKeys.has(markDef._key) || (markDefKeys.add(markDef._key), newMarkDefs.push(markDef));
        if (markDefs.length !== newMarkDefs.length) {
          debug$c("Removing duplicate markDefs"), withNormalizeNode(editor, () => {
            Transforms.setNodes(editor, {
              markDefs: newMarkDefs
            }, {
              at: path3
            });
          });
          return;
        }
      }
      if (editor.isTextBlock(node3) && !editor.operations.some((op) => op.type === "merge_node" && "markDefs" in op.properties && op.path.length === 1)) {
        const newMarkDefs = (node3.markDefs || []).filter((def) => node3.children.find((child) => Text$1.isText(child) && Array.isArray(child.marks) && child.marks.includes(def._key)));
        if (node3.markDefs && !isEqual(newMarkDefs, node3.markDefs)) {
          debug$c("Removing markDef not in use"), withNormalizeNode(editor, () => {
            Transforms.setNodes(editor, {
              markDefs: newMarkDefs
            }, {
              at: path3
            });
          });
          return;
        }
      }
      withNormalizeNode(editor, () => {
        normalizeNode2(nodeEntry);
      });
    }, editor.apply = (op) => {
      if (isChangingRemotely(editor)) {
        apply2(op);
        return;
      }
      if (isUndoing(editor) || isRedoing(editor)) {
        apply2(op);
        return;
      }
      if (op.type === "set_selection")
        if (op.properties && op.newProperties && op.properties.anchor && op.properties.focus && op.newProperties.anchor && op.newProperties.focus) {
          const previousSelectionIsCollapsed = Range.isCollapsed({
            anchor: op.properties.anchor,
            focus: op.properties.focus
          }), newSelectionIsCollapsed = Range.isCollapsed({
            anchor: op.newProperties.anchor,
            focus: op.newProperties.focus
          });
          if (previousSelectionIsCollapsed && newSelectionIsCollapsed) {
            const focusSpan = Array.from(Editor.nodes(editor, {
              mode: "lowest",
              at: op.properties.focus,
              match: (n2) => editor.isTextSpan(n2),
              voids: !1
            }))[0]?.[0], newFocusSpan = Array.from(Editor.nodes(editor, {
              mode: "lowest",
              at: op.newProperties.focus,
              match: (n2) => editor.isTextSpan(n2),
              voids: !1
            }))[0]?.[0], movedToNextSpan = focusSpan && newFocusSpan && op.newProperties.focus.path[0] === op.properties.focus.path[0] && op.newProperties.focus.path[1] === op.properties.focus.path[1] + 1 && focusSpan.text.length === op.properties.focus.offset && op.newProperties.focus.offset === 0, movedToPreviousSpan = focusSpan && newFocusSpan && op.newProperties.focus.path[0] === op.properties.focus.path[0] && op.newProperties.focus.path[1] === op.properties.focus.path[1] - 1 && op.properties.focus.offset === 0 && newFocusSpan.text.length === op.newProperties.focus.offset;
            !movedToNextSpan && !movedToPreviousSpan && (editor.decoratorState = {});
          }
        } else
          editor.decoratorState = {};
      if (op.type === "remove_text") {
        const {
          selection
        } = editor;
        if (selection && Range.isExpanded(selection)) {
          const [block, blockPath] = Editor.node(editor, selection, {
            depth: 1
          }), [span, spanPath] = Array.from(Editor.nodes(editor, {
            mode: "lowest",
            at: {
              path: op.path,
              offset: op.offset
            },
            match: (n2) => editor.isTextSpan(n2),
            voids: !1
          }))[0] ?? [void 0, void 0];
          if (span && block && isTextBlock(editorActor.getSnapshot().context, block)) {
            const markDefs = block.markDefs ?? [], marks3 = span.marks ?? [], spanHasAnnotations = marks3.some((mark) => markDefs.find((markDef) => markDef._key === mark)), deletingFromTheEnd = op.offset + op.text.length === span.text.length, deletingAllText = op.offset === 0 && deletingFromTheEnd, previousSpan = getPreviousSpan({
              editor,
              blockPath,
              spanPath
            }), nextSpan = getNextSpan({
              editor,
              blockPath,
              spanPath
            }), previousSpanHasSameAnnotation = previousSpan ? previousSpan.marks?.some((mark) => !decorators.includes(mark) && marks3.includes(mark)) : !1, nextSpanHasSameAnnotation = nextSpan ? nextSpan.marks?.some((mark) => !decorators.includes(mark) && marks3.includes(mark)) : !1;
            if (spanHasAnnotations && deletingAllText && !previousSpanHasSameAnnotation && !nextSpanHasSameAnnotation) {
              const snapshot = getEditorSnapshot({
                editorActorSnapshot: editorActor.getSnapshot(),
                slateEditorInstance: editor
              });
              Editor.withoutNormalizing(editor, () => {
                apply2(op), Transforms.setNodes(editor, {
                  marks: getActiveDecorators(snapshot)
                }, {
                  at: op.path
                });
              }), editor.onChange();
              return;
            }
          }
        }
      }
      if (op.type === "merge_node" && op.path.length === 1 && "markDefs" in op.properties && op.properties._type === editorActor.getSnapshot().context.schema.block.name && Array.isArray(op.properties.markDefs) && op.properties.markDefs.length > 0 && op.path[0] - 1 >= 0) {
        const [targetBlock, targetPath] = Editor.node(editor, [op.path[0] - 1]);
        if (editor.isTextBlock(targetBlock)) {
          const oldDefs = Array.isArray(targetBlock.markDefs) && targetBlock.markDefs || [], newMarkDefs = uniq([...oldDefs, ...op.properties.markDefs]);
          debug$c("Copying markDefs over to merged block", op), Transforms.setNodes(editor, {
            markDefs: newMarkDefs
          }, {
            at: targetPath,
            voids: !1
          }), apply2(op);
          return;
        }
      }
      apply2(op);
    }, editor;
  };
}
const removeDecoratorOperationImplementation = ({
  operation
}) => {
  const editor = operation.editor, mark = operation.decorator, {
    selection
  } = editor;
  if (selection) {
    if (Range.isExpanded(selection))
      Transforms.setNodes(editor, {}, {
        match: Text$1.isText,
        split: !0,
        hanging: !0
      }), editor.selection && [...Editor.nodes(editor, {
        at: editor.selection,
        match: Text$1.isText
      })].forEach(([node3, path3]) => {
        const block = editor.children[path3[0]];
        Element$2.isElement(block) && block.children.includes(node3) && Transforms.setNodes(editor, {
          marks: (Array.isArray(node3.marks) ? node3.marks : []).filter((eMark) => eMark !== mark),
          _type: "span"
        }, {
          at: path3
        });
      });
    else {
      const [block, blockPath] = Editor.node(editor, selection, {
        depth: 1
      }), lonelyEmptySpan = editor.isTextBlock(block) && block.children.length === 1 && editor.isTextSpan(block.children[0]) && block.children[0].text === "" ? block.children[0] : void 0;
      if (lonelyEmptySpan) {
        const existingMarksWithoutDecorator = (lonelyEmptySpan.marks ?? []).filter((existingMark) => existingMark !== mark);
        Transforms.setNodes(editor, {
          marks: existingMarksWithoutDecorator
        }, {
          at: blockPath,
          match: (node3) => editor.isTextSpan(node3)
        });
      } else
        editor.decoratorState[mark] = !1;
    }
    if (editor.selection) {
      const selection2 = editor.selection;
      editor.selection = {
        ...selection2
      };
    }
  }
};
function cloneDiff(diff2) {
  const [type, patch] = diff2;
  return [type, patch];
}
function getCommonOverlap(textA, textB) {
  let text1 = textA, text2 = textB;
  const text1Length = text1.length, text2Length = text2.length;
  if (text1Length === 0 || text2Length === 0) return 0;
  text1Length > text2Length ? text1 = text1.substring(text1Length - text2Length) : text1Length < text2Length && (text2 = text2.substring(0, text1Length));
  const textLength = Math.min(text1Length, text2Length);
  if (text1 === text2) return textLength;
  let best = 0, length = 1;
  for (let found = 0; found !== -1; ) {
    const pattern = text1.substring(textLength - length);
    if (found = text2.indexOf(pattern), found === -1) return best;
    length += found, (found === 0 || text1.substring(textLength - length) === text2.substring(0, length)) && (best = length, length++);
  }
  return best;
}
function getCommonPrefix(text1, text2) {
  if (!text1 || !text2 || text1[0] !== text2[0]) return 0;
  let pointerMin = 0, pointerMax = Math.min(text1.length, text2.length), pointerMid = pointerMax, pointerStart = 0;
  for (; pointerMin < pointerMid; ) text1.substring(pointerStart, pointerMid) === text2.substring(pointerStart, pointerMid) ? (pointerMin = pointerMid, pointerStart = pointerMin) : pointerMax = pointerMid, pointerMid = Math.floor((pointerMax - pointerMin) / 2 + pointerMin);
  return pointerMid;
}
function getCommonSuffix(text1, text2) {
  if (!text1 || !text2 || text1[text1.length - 1] !== text2[text2.length - 1]) return 0;
  let pointerMin = 0, pointerMax = Math.min(text1.length, text2.length), pointerMid = pointerMax, pointerEnd = 0;
  for (; pointerMin < pointerMid; ) text1.substring(text1.length - pointerMid, text1.length - pointerEnd) === text2.substring(text2.length - pointerMid, text2.length - pointerEnd) ? (pointerMin = pointerMid, pointerEnd = pointerMin) : pointerMax = pointerMid, pointerMid = Math.floor((pointerMax - pointerMin) / 2 + pointerMin);
  return pointerMid;
}
function isHighSurrogate(char) {
  const charCode = char.charCodeAt(0);
  return charCode >= 55296 && charCode <= 56319;
}
function isLowSurrogate(char) {
  const charCode = char.charCodeAt(0);
  return charCode >= 56320 && charCode <= 57343;
}
function bisect(text1, text2, deadline) {
  const text1Length = text1.length, text2Length = text2.length, maxD = Math.ceil((text1Length + text2Length) / 2), vOffset = maxD, vLength = 2 * maxD, v1 = new Array(vLength), v2 = new Array(vLength);
  for (let x = 0; x < vLength; x++) v1[x] = -1, v2[x] = -1;
  v1[vOffset + 1] = 0, v2[vOffset + 1] = 0;
  const delta = text1Length - text2Length, front = delta % 2 !== 0;
  let k1start = 0, k1end = 0, k2start = 0, k2end = 0;
  for (let d = 0; d < maxD && !(Date.now() > deadline); d++) {
    for (let k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      const k1Offset = vOffset + k1;
      let x1;
      k1 === -d || k1 !== d && v1[k1Offset - 1] < v1[k1Offset + 1] ? x1 = v1[k1Offset + 1] : x1 = v1[k1Offset - 1] + 1;
      let y1 = x1 - k1;
      for (; x1 < text1Length && y1 < text2Length && text1.charAt(x1) === text2.charAt(y1); ) x1++, y1++;
      if (v1[k1Offset] = x1, x1 > text1Length) k1end += 2;
      else if (y1 > text2Length) k1start += 2;
      else if (front) {
        const k2Offset = vOffset + delta - k1;
        if (k2Offset >= 0 && k2Offset < vLength && v2[k2Offset] !== -1) {
          const x2 = text1Length - v2[k2Offset];
          if (x1 >= x2) return bisectSplit(text1, text2, x1, y1, deadline);
        }
      }
    }
    for (let k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      const k2Offset = vOffset + k2;
      let x2;
      k2 === -d || k2 !== d && v2[k2Offset - 1] < v2[k2Offset + 1] ? x2 = v2[k2Offset + 1] : x2 = v2[k2Offset - 1] + 1;
      let y2 = x2 - k2;
      for (; x2 < text1Length && y2 < text2Length && text1.charAt(text1Length - x2 - 1) === text2.charAt(text2Length - y2 - 1); ) x2++, y2++;
      if (v2[k2Offset] = x2, x2 > text1Length) k2end += 2;
      else if (y2 > text2Length) k2start += 2;
      else if (!front) {
        const k1Offset = vOffset + delta - k2;
        if (k1Offset >= 0 && k1Offset < vLength && v1[k1Offset] !== -1) {
          const x1 = v1[k1Offset], y1 = vOffset + x1 - k1Offset;
          if (x2 = text1Length - x2, x1 >= x2) return bisectSplit(text1, text2, x1, y1, deadline);
        }
      }
    }
  }
  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
}
function bisectSplit(text1, text2, x, y, deadline) {
  const text1a = text1.substring(0, x), text2a = text2.substring(0, y), text1b = text1.substring(x), text2b = text2.substring(y), diffs = doDiff(text1a, text2a, {
    checkLines: !1,
    deadline
  }), diffsb = doDiff(text1b, text2b, {
    checkLines: !1,
    deadline
  });
  return diffs.concat(diffsb);
}
function findHalfMatch(text1, text2, timeout = 1) {
  if (timeout <= 0) return null;
  const longText = text1.length > text2.length ? text1 : text2, shortText = text1.length > text2.length ? text2 : text1;
  if (longText.length < 4 || shortText.length * 2 < longText.length) return null;
  const halfMatch1 = halfMatchI(longText, shortText, Math.ceil(longText.length / 4)), halfMatch2 = halfMatchI(longText, shortText, Math.ceil(longText.length / 2));
  let halfMatch;
  if (halfMatch1 && halfMatch2) halfMatch = halfMatch1[4].length > halfMatch2[4].length ? halfMatch1 : halfMatch2;
  else {
    if (!halfMatch1 && !halfMatch2) return null;
    halfMatch2 ? halfMatch1 || (halfMatch = halfMatch2) : halfMatch = halfMatch1;
  }
  if (!halfMatch) throw new Error("Unable to find a half match.");
  let text1A, text1B, text2A, text2B;
  text1.length > text2.length ? (text1A = halfMatch[0], text1B = halfMatch[1], text2A = halfMatch[2], text2B = halfMatch[3]) : (text2A = halfMatch[0], text2B = halfMatch[1], text1A = halfMatch[2], text1B = halfMatch[3]);
  const midCommon = halfMatch[4];
  return [text1A, text1B, text2A, text2B, midCommon];
}
function halfMatchI(longText, shortText, i) {
  const seed = longText.slice(i, i + Math.floor(longText.length / 4));
  let j = -1, bestCommon = "", bestLongTextA, bestLongTextB, bestShortTextA, bestShortTextB;
  for (; (j = shortText.indexOf(seed, j + 1)) !== -1; ) {
    const prefixLength = getCommonPrefix(longText.slice(i), shortText.slice(j)), suffixLength = getCommonSuffix(longText.slice(0, i), shortText.slice(0, j));
    bestCommon.length < suffixLength + prefixLength && (bestCommon = shortText.slice(j - suffixLength, j) + shortText.slice(j, j + prefixLength), bestLongTextA = longText.slice(0, i - suffixLength), bestLongTextB = longText.slice(i + prefixLength), bestShortTextA = shortText.slice(0, j - suffixLength), bestShortTextB = shortText.slice(j + prefixLength));
  }
  return bestCommon.length * 2 >= longText.length ? [bestLongTextA || "", bestLongTextB || "", bestShortTextA || "", bestShortTextB || "", bestCommon || ""] : null;
}
function charsToLines(diffs, lineArray) {
  for (let x = 0; x < diffs.length; x++) {
    const chars = diffs[x][1], text = [];
    for (let y = 0; y < chars.length; y++) text[y] = lineArray[chars.charCodeAt(y)];
    diffs[x][1] = text.join("");
  }
}
function linesToChars(textA, textB) {
  const lineArray = [], lineHash = {};
  lineArray[0] = "";
  function diffLinesToMunge(text) {
    let chars = "", lineStart = 0, lineEnd = -1, lineArrayLength = lineArray.length;
    for (; lineEnd < text.length - 1; ) {
      lineEnd = text.indexOf(`
`, lineStart), lineEnd === -1 && (lineEnd = text.length - 1);
      let line = text.slice(lineStart, lineEnd + 1);
      (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) : lineHash[line] !== void 0) ? chars += String.fromCharCode(lineHash[line]) : (lineArrayLength === maxLines && (line = text.slice(lineStart), lineEnd = text.length), chars += String.fromCharCode(lineArrayLength), lineHash[line] = lineArrayLength, lineArray[lineArrayLength++] = line), lineStart = lineEnd + 1;
    }
    return chars;
  }
  let maxLines = 4e4;
  const chars1 = diffLinesToMunge(textA);
  maxLines = 65535;
  const chars2 = diffLinesToMunge(textB);
  return {
    chars1,
    chars2,
    lineArray
  };
}
function doLineModeDiff(textA, textB, opts) {
  let text1 = textA, text2 = textB;
  const a = linesToChars(text1, text2);
  text1 = a.chars1, text2 = a.chars2;
  const linearray = a.lineArray;
  let diffs = doDiff(text1, text2, {
    checkLines: !1,
    deadline: opts.deadline
  });
  charsToLines(diffs, linearray), diffs = cleanupSemantic(diffs), diffs.push([DIFF_EQUAL, ""]);
  let pointer = 0, countDelete = 0, countInsert = 0, textDelete = "", textInsert = "";
  for (; pointer < diffs.length; ) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        countInsert++, textInsert += diffs[pointer][1];
        break;
      case DIFF_DELETE:
        countDelete++, textDelete += diffs[pointer][1];
        break;
      case DIFF_EQUAL:
        if (countDelete >= 1 && countInsert >= 1) {
          diffs.splice(pointer - countDelete - countInsert, countDelete + countInsert), pointer = pointer - countDelete - countInsert;
          const aa = doDiff(textDelete, textInsert, {
            checkLines: !1,
            deadline: opts.deadline
          });
          for (let j = aa.length - 1; j >= 0; j--) diffs.splice(pointer, 0, aa[j]);
          pointer += aa.length;
        }
        countInsert = 0, countDelete = 0, textDelete = "", textInsert = "";
        break;
      default:
        throw new Error("Unknown diff operation.");
    }
    pointer++;
  }
  return diffs.pop(), diffs;
}
function computeDiff(text1, text2, opts) {
  let diffs;
  if (!text1) return [[DIFF_INSERT, text2]];
  if (!text2) return [[DIFF_DELETE, text1]];
  const longtext = text1.length > text2.length ? text1 : text2, shorttext = text1.length > text2.length ? text2 : text1, i = longtext.indexOf(shorttext);
  if (i !== -1) return diffs = [[DIFF_INSERT, longtext.substring(0, i)], [DIFF_EQUAL, shorttext], [DIFF_INSERT, longtext.substring(i + shorttext.length)]], text1.length > text2.length && (diffs[0][0] = DIFF_DELETE, diffs[2][0] = DIFF_DELETE), diffs;
  if (shorttext.length === 1) return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  const halfMatch = findHalfMatch(text1, text2);
  if (halfMatch) {
    const text1A = halfMatch[0], text1B = halfMatch[1], text2A = halfMatch[2], text2B = halfMatch[3], midCommon = halfMatch[4], diffsA = doDiff(text1A, text2A, opts), diffsB = doDiff(text1B, text2B, opts);
    return diffsA.concat([[DIFF_EQUAL, midCommon]], diffsB);
  }
  return opts.checkLines && text1.length > 100 && text2.length > 100 ? doLineModeDiff(text1, text2, opts) : bisect(text1, text2, opts.deadline);
}
var __defProp$2 = Object.defineProperty, __getOwnPropSymbols$2 = Object.getOwnPropertySymbols, __hasOwnProp$2 = Object.prototype.hasOwnProperty, __propIsEnum$2 = Object.prototype.propertyIsEnumerable, __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value
}) : obj[key] = value, __spreadValues$2 = (a, b) => {
  for (var prop in b || (b = {})) __hasOwnProp$2.call(b, prop) && __defNormalProp$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$2) for (var prop of __getOwnPropSymbols$2(b)) __propIsEnum$2.call(b, prop) && __defNormalProp$2(a, prop, b[prop]);
  return a;
};
const DIFF_DELETE = -1, DIFF_INSERT = 1, DIFF_EQUAL = 0;
function diff(textA, textB, opts) {
  if (textA === null || textB === null) throw new Error("Null input. (diff)");
  const diffs = doDiff(textA, textB, createInternalOpts(opts || {}));
  return adjustDiffForSurrogatePairs(diffs), diffs;
}
function doDiff(textA, textB, options) {
  let text1 = textA, text2 = textB;
  if (text1 === text2) return text1 ? [[DIFF_EQUAL, text1]] : [];
  let commonlength = getCommonPrefix(text1, text2);
  const commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength), text2 = text2.substring(commonlength), commonlength = getCommonSuffix(text1, text2);
  const commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength), text2 = text2.substring(0, text2.length - commonlength);
  let diffs = computeDiff(text1, text2, options);
  return commonprefix && diffs.unshift([DIFF_EQUAL, commonprefix]), commonsuffix && diffs.push([DIFF_EQUAL, commonsuffix]), diffs = cleanupMerge(diffs), diffs;
}
function createDeadLine(timeout) {
  let t2 = 1;
  return typeof timeout < "u" && (t2 = timeout <= 0 ? Number.MAX_VALUE : timeout), Date.now() + t2 * 1e3;
}
function createInternalOpts(opts) {
  return __spreadValues$2({
    checkLines: !0,
    deadline: createDeadLine(opts.timeout || 1)
  }, opts);
}
function combineChar(data, char, dir) {
  return dir === 1 ? data + char : char + data;
}
function splitChar(data, dir) {
  return dir === 1 ? [data.substring(0, data.length - 1), data[data.length - 1]] : [data.substring(1), data[0]];
}
function hasSharedChar(diffs, i, j, dir) {
  return dir === 1 ? diffs[i][1][diffs[i][1].length - 1] === diffs[j][1][diffs[j][1].length - 1] : diffs[i][1][0] === diffs[j][1][0];
}
function deisolateChar(diffs, i, dir) {
  const inv = dir === 1 ? -1 : 1;
  let insertIdx = null, deleteIdx = null, j = i + dir;
  for (; j >= 0 && j < diffs.length && (insertIdx === null || deleteIdx === null); j += dir) {
    const [op, text2] = diffs[j];
    if (text2.length !== 0) {
      if (op === DIFF_INSERT) {
        insertIdx === null && (insertIdx = j);
        continue;
      } else if (op === DIFF_DELETE) {
        deleteIdx === null && (deleteIdx = j);
        continue;
      } else if (op === DIFF_EQUAL) {
        if (insertIdx === null && deleteIdx === null) {
          const [rest, char2] = splitChar(diffs[i][1], dir);
          diffs[i][1] = rest, diffs[j][1] = combineChar(diffs[j][1], char2, inv);
          return;
        }
        break;
      }
    }
  }
  if (insertIdx !== null && deleteIdx !== null && hasSharedChar(diffs, insertIdx, deleteIdx, dir)) {
    const [insertText3, insertChar] = splitChar(diffs[insertIdx][1], inv), [deleteText3] = splitChar(diffs[deleteIdx][1], inv);
    diffs[insertIdx][1] = insertText3, diffs[deleteIdx][1] = deleteText3, diffs[i][1] = combineChar(diffs[i][1], insertChar, dir);
    return;
  }
  const [text, char] = splitChar(diffs[i][1], dir);
  diffs[i][1] = text, insertIdx === null ? (diffs.splice(j, 0, [DIFF_INSERT, char]), deleteIdx !== null && deleteIdx >= j && deleteIdx++) : diffs[insertIdx][1] = combineChar(diffs[insertIdx][1], char, inv), deleteIdx === null ? diffs.splice(j, 0, [DIFF_DELETE, char]) : diffs[deleteIdx][1] = combineChar(diffs[deleteIdx][1], char, inv);
}
function adjustDiffForSurrogatePairs(diffs) {
  for (let i = 0; i < diffs.length; i++) {
    const [diffType, diffText] = diffs[i];
    if (diffText.length === 0) continue;
    const firstChar = diffText[0], lastChar = diffText[diffText.length - 1];
    isHighSurrogate(lastChar) && diffType === DIFF_EQUAL && deisolateChar(diffs, i, 1), isLowSurrogate(firstChar) && diffType === DIFF_EQUAL && deisolateChar(diffs, i, -1);
  }
  for (let i = 0; i < diffs.length; i++) diffs[i][1].length === 0 && diffs.splice(i, 1);
}
function cleanupSemantic(rawDiffs) {
  let diffs = rawDiffs.map((diff2) => cloneDiff(diff2)), hasChanges = !1;
  const equalities = [];
  let equalitiesLength = 0, lastEquality = null, pointer = 0, lengthInsertions1 = 0, lengthDeletions1 = 0, lengthInsertions2 = 0, lengthDeletions2 = 0;
  for (; pointer < diffs.length; ) diffs[pointer][0] === DIFF_EQUAL ? (equalities[equalitiesLength++] = pointer, lengthInsertions1 = lengthInsertions2, lengthDeletions1 = lengthDeletions2, lengthInsertions2 = 0, lengthDeletions2 = 0, lastEquality = diffs[pointer][1]) : (diffs[pointer][0] === DIFF_INSERT ? lengthInsertions2 += diffs[pointer][1].length : lengthDeletions2 += diffs[pointer][1].length, lastEquality && lastEquality.length <= Math.max(lengthInsertions1, lengthDeletions1) && lastEquality.length <= Math.max(lengthInsertions2, lengthDeletions2) && (diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastEquality]), diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT, equalitiesLength--, equalitiesLength--, pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1, lengthInsertions1 = 0, lengthDeletions1 = 0, lengthInsertions2 = 0, lengthDeletions2 = 0, lastEquality = null, hasChanges = !0)), pointer++;
  for (hasChanges && (diffs = cleanupMerge(diffs)), diffs = cleanupSemanticLossless(diffs), pointer = 1; pointer < diffs.length; ) {
    if (diffs[pointer - 1][0] === DIFF_DELETE && diffs[pointer][0] === DIFF_INSERT) {
      const deletion = diffs[pointer - 1][1], insertion = diffs[pointer][1], overlapLength1 = getCommonOverlap(deletion, insertion), overlapLength2 = getCommonOverlap(insertion, deletion);
      overlapLength1 >= overlapLength2 ? (overlapLength1 >= deletion.length / 2 || overlapLength1 >= insertion.length / 2) && (diffs.splice(pointer, 0, [DIFF_EQUAL, insertion.substring(0, overlapLength1)]), diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlapLength1), diffs[pointer + 1][1] = insertion.substring(overlapLength1), pointer++) : (overlapLength2 >= deletion.length / 2 || overlapLength2 >= insertion.length / 2) && (diffs.splice(pointer, 0, [DIFF_EQUAL, deletion.substring(0, overlapLength2)]), diffs[pointer - 1][0] = DIFF_INSERT, diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlapLength2), diffs[pointer + 1][0] = DIFF_DELETE, diffs[pointer + 1][1] = deletion.substring(overlapLength2), pointer++), pointer++;
    }
    pointer++;
  }
  return diffs;
}
const nonAlphaNumericRegex = /[^a-zA-Z0-9]/, whitespaceRegex = /\s/, linebreakRegex = /[\r\n]/, blanklineEndRegex = /\n\r?\n$/, blanklineStartRegex = /^\r?\n\r?\n/;
function cleanupSemanticLossless(rawDiffs) {
  const diffs = rawDiffs.map((diff2) => cloneDiff(diff2));
  function diffCleanupSemanticScore(one, two) {
    if (!one || !two) return 6;
    const char1 = one.charAt(one.length - 1), char2 = two.charAt(0), nonAlphaNumeric1 = char1.match(nonAlphaNumericRegex), nonAlphaNumeric2 = char2.match(nonAlphaNumericRegex), whitespace1 = nonAlphaNumeric1 && char1.match(whitespaceRegex), whitespace2 = nonAlphaNumeric2 && char2.match(whitespaceRegex), lineBreak1 = whitespace1 && char1.match(linebreakRegex), lineBreak2 = whitespace2 && char2.match(linebreakRegex), blankLine1 = lineBreak1 && one.match(blanklineEndRegex), blankLine2 = lineBreak2 && two.match(blanklineStartRegex);
    return blankLine1 || blankLine2 ? 5 : lineBreak1 || lineBreak2 ? 4 : nonAlphaNumeric1 && !whitespace1 && whitespace2 ? 3 : whitespace1 || whitespace2 ? 2 : nonAlphaNumeric1 || nonAlphaNumeric2 ? 1 : 0;
  }
  let pointer = 1;
  for (; pointer < diffs.length - 1; ) {
    if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
      let equality1 = diffs[pointer - 1][1], edit = diffs[pointer][1], equality2 = diffs[pointer + 1][1];
      const commonOffset = getCommonSuffix(equality1, edit);
      if (commonOffset) {
        const commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset), edit = commonString + edit.substring(0, edit.length - commonOffset), equality2 = commonString + equality2;
      }
      let bestEquality1 = equality1, bestEdit = edit, bestEquality2 = equality2, bestScore = diffCleanupSemanticScore(equality1, edit) + diffCleanupSemanticScore(edit, equality2);
      for (; edit.charAt(0) === equality2.charAt(0); ) {
        equality1 += edit.charAt(0), edit = edit.substring(1) + equality2.charAt(0), equality2 = equality2.substring(1);
        const score = diffCleanupSemanticScore(equality1, edit) + diffCleanupSemanticScore(edit, equality2);
        score >= bestScore && (bestScore = score, bestEquality1 = equality1, bestEdit = edit, bestEquality2 = equality2);
      }
      diffs[pointer - 1][1] !== bestEquality1 && (bestEquality1 ? diffs[pointer - 1][1] = bestEquality1 : (diffs.splice(pointer - 1, 1), pointer--), diffs[pointer][1] = bestEdit, bestEquality2 ? diffs[pointer + 1][1] = bestEquality2 : (diffs.splice(pointer + 1, 1), pointer--));
    }
    pointer++;
  }
  return diffs;
}
function cleanupMerge(rawDiffs) {
  let diffs = rawDiffs.map((diff2) => cloneDiff(diff2));
  diffs.push([DIFF_EQUAL, ""]);
  let pointer = 0, countDelete = 0, countInsert = 0, textDelete = "", textInsert = "", commonlength;
  for (; pointer < diffs.length; ) switch (diffs[pointer][0]) {
    case DIFF_INSERT:
      countInsert++, textInsert += diffs[pointer][1], pointer++;
      break;
    case DIFF_DELETE:
      countDelete++, textDelete += diffs[pointer][1], pointer++;
      break;
    case DIFF_EQUAL:
      countDelete + countInsert > 1 ? (countDelete !== 0 && countInsert !== 0 && (commonlength = getCommonPrefix(textInsert, textDelete), commonlength !== 0 && (pointer - countDelete - countInsert > 0 && diffs[pointer - countDelete - countInsert - 1][0] === DIFF_EQUAL ? diffs[pointer - countDelete - countInsert - 1][1] += textInsert.substring(0, commonlength) : (diffs.splice(0, 0, [DIFF_EQUAL, textInsert.substring(0, commonlength)]), pointer++), textInsert = textInsert.substring(commonlength), textDelete = textDelete.substring(commonlength)), commonlength = getCommonSuffix(textInsert, textDelete), commonlength !== 0 && (diffs[pointer][1] = textInsert.substring(textInsert.length - commonlength) + diffs[pointer][1], textInsert = textInsert.substring(0, textInsert.length - commonlength), textDelete = textDelete.substring(0, textDelete.length - commonlength))), pointer -= countDelete + countInsert, diffs.splice(pointer, countDelete + countInsert), textDelete.length && (diffs.splice(pointer, 0, [DIFF_DELETE, textDelete]), pointer++), textInsert.length && (diffs.splice(pointer, 0, [DIFF_INSERT, textInsert]), pointer++), pointer++) : pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL ? (diffs[pointer - 1][1] += diffs[pointer][1], diffs.splice(pointer, 1)) : pointer++, countInsert = 0, countDelete = 0, textDelete = "", textInsert = "";
      break;
    default:
      throw new Error("Unknown diff operation");
  }
  diffs[diffs.length - 1][1] === "" && diffs.pop();
  let hasChanges = !1;
  for (pointer = 1; pointer < diffs.length - 1; ) diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL && (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) === diffs[pointer - 1][1] ? (diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length), diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1], diffs.splice(pointer - 1, 1), hasChanges = !0) : diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) === diffs[pointer + 1][1] && (diffs[pointer - 1][1] += diffs[pointer + 1][1], diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1], diffs.splice(pointer + 1, 1), hasChanges = !0)), pointer++;
  return hasChanges && (diffs = cleanupMerge(diffs)), diffs;
}
function trueCount(...args) {
  return args.reduce((n2, bool) => n2 + (bool ? 1 : 0), 0);
}
function cleanupEfficiency(rawDiffs, editCost = 4) {
  let diffs = rawDiffs.map((diff2) => cloneDiff(diff2)), hasChanges = !1;
  const equalities = [];
  let equalitiesLength = 0, lastEquality = null, pointer = 0, preIns = !1, preDel = !1, postIns = !1, postDel = !1;
  for (; pointer < diffs.length; ) diffs[pointer][0] === DIFF_EQUAL ? (diffs[pointer][1].length < editCost && (postIns || postDel) ? (equalities[equalitiesLength++] = pointer, preIns = postIns, preDel = postDel, lastEquality = diffs[pointer][1]) : (equalitiesLength = 0, lastEquality = null), postIns = !1, postDel = !1) : (diffs[pointer][0] === DIFF_DELETE ? postDel = !0 : postIns = !0, lastEquality && (preIns && preDel && postIns && postDel || lastEquality.length < editCost / 2 && trueCount(preIns, preDel, postIns, postDel) === 3) && (diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastEquality]), diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT, equalitiesLength--, lastEquality = null, preIns && preDel ? (postIns = !0, postDel = !0, equalitiesLength = 0) : (equalitiesLength--, pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1, postIns = !1, postDel = !1), hasChanges = !0)), pointer++;
  return hasChanges && (diffs = cleanupMerge(diffs)), diffs;
}
var __defProp$1 = Object.defineProperty, __getOwnPropSymbols$1 = Object.getOwnPropertySymbols, __hasOwnProp$1 = Object.prototype.hasOwnProperty, __propIsEnum$1 = Object.prototype.propertyIsEnumerable, __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value
}) : obj[key] = value, __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {})) __hasOwnProp$1.call(b, prop) && __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1) for (var prop of __getOwnPropSymbols$1(b)) __propIsEnum$1.call(b, prop) && __defNormalProp$1(a, prop, b[prop]);
  return a;
};
const DEFAULT_OPTIONS = {
  /**
   * At what point is no match declared (0.0 = perfection, 1.0 = very loose).
   */
  threshold: 0.5,
  /**
   * How far to search for a match (0 = exact location, 1000+ = broad match).
   * A match this many characters away from the expected location will add
   * 1.0 to the score (0.0 is a perfect match).
   */
  distance: 1e3
};
function applyDefaults(options) {
  return __spreadValues$1(__spreadValues$1({}, DEFAULT_OPTIONS), options);
}
const MAX_BITS$1 = 32;
function bitap(text, pattern, loc, opts = {}) {
  if (pattern.length > MAX_BITS$1) throw new Error("Pattern too long for this browser.");
  const options = applyDefaults(opts), s = getAlphabetFromPattern(pattern);
  function getBitapScore(e2, x) {
    const accuracy = e2 / pattern.length, proximity = Math.abs(loc - x);
    return options.distance ? accuracy + proximity / options.distance : proximity ? 1 : accuracy;
  }
  let scoreThreshold = options.threshold, bestLoc = text.indexOf(pattern, loc);
  bestLoc !== -1 && (scoreThreshold = Math.min(getBitapScore(0, bestLoc), scoreThreshold), bestLoc = text.lastIndexOf(pattern, loc + pattern.length), bestLoc !== -1 && (scoreThreshold = Math.min(getBitapScore(0, bestLoc), scoreThreshold)));
  const matchmask = 1 << pattern.length - 1;
  bestLoc = -1;
  let binMin, binMid, binMax = pattern.length + text.length, lastRd = [];
  for (let d = 0; d < pattern.length; d++) {
    for (binMin = 0, binMid = binMax; binMin < binMid; ) getBitapScore(d, loc + binMid) <= scoreThreshold ? binMin = binMid : binMax = binMid, binMid = Math.floor((binMax - binMin) / 2 + binMin);
    binMax = binMid;
    let start2 = Math.max(1, loc - binMid + 1);
    const finish = Math.min(loc + binMid, text.length) + pattern.length, rd = new Array(finish + 2);
    rd[finish + 1] = (1 << d) - 1;
    for (let j = finish; j >= start2; j--) {
      const charMatch = s[text.charAt(j - 1)];
      if (d === 0 ? rd[j] = (rd[j + 1] << 1 | 1) & charMatch : rd[j] = (rd[j + 1] << 1 | 1) & charMatch | ((lastRd[j + 1] | lastRd[j]) << 1 | 1) | lastRd[j + 1], rd[j] & matchmask) {
        const score = getBitapScore(d, j - 1);
        if (score <= scoreThreshold) if (scoreThreshold = score, bestLoc = j - 1, bestLoc > loc) start2 = Math.max(1, 2 * loc - bestLoc);
        else break;
      }
    }
    if (getBitapScore(d + 1, loc) > scoreThreshold) break;
    lastRd = rd;
  }
  return bestLoc;
}
function getAlphabetFromPattern(pattern) {
  const s = {};
  for (let i = 0; i < pattern.length; i++) s[pattern.charAt(i)] = 0;
  for (let i = 0; i < pattern.length; i++) s[pattern.charAt(i)] |= 1 << pattern.length - i - 1;
  return s;
}
function match(text, pattern, searchLocation, options = {}) {
  if (text === null || pattern === null || searchLocation === null) throw new Error("Null input. (match())");
  const loc = Math.max(0, Math.min(searchLocation, text.length));
  if (text === pattern) return 0;
  if (text.length) {
    if (text.substring(loc, loc + pattern.length) === pattern) return loc;
  } else return -1;
  return bitap(text, pattern, loc, options);
}
function diffText1(diffs) {
  const text = [];
  for (let x = 0; x < diffs.length; x++) diffs[x][0] !== DIFF_INSERT && (text[x] = diffs[x][1]);
  return text.join("");
}
function diffText2(diffs) {
  const text = [];
  for (let x = 0; x < diffs.length; x++) diffs[x][0] !== DIFF_DELETE && (text[x] = diffs[x][1]);
  return text.join("");
}
function levenshtein(diffs) {
  let leven = 0, insertions = 0, deletions = 0;
  for (let x = 0; x < diffs.length; x++) {
    const op = diffs[x][0], data = diffs[x][1];
    switch (op) {
      case DIFF_INSERT:
        insertions += data.length;
        break;
      case DIFF_DELETE:
        deletions += data.length;
        break;
      case DIFF_EQUAL:
        leven += Math.max(insertions, deletions), insertions = 0, deletions = 0;
        break;
      default:
        throw new Error("Unknown diff operation.");
    }
  }
  return leven += Math.max(insertions, deletions), leven;
}
function xIndex(diffs, location) {
  let chars1 = 0, chars2 = 0, lastChars1 = 0, lastChars2 = 0, x;
  for (x = 0; x < diffs.length && (diffs[x][0] !== DIFF_INSERT && (chars1 += diffs[x][1].length), diffs[x][0] !== DIFF_DELETE && (chars2 += diffs[x][1].length), !(chars1 > location)); x++) lastChars1 = chars1, lastChars2 = chars2;
  return diffs.length !== x && diffs[x][0] === DIFF_DELETE ? lastChars2 : lastChars2 + (location - lastChars1);
}
function countUtf8Bytes(str) {
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    const codePoint = str.codePointAt(i);
    if (typeof codePoint > "u") throw new Error("Failed to get codepoint");
    bytes += utf8len(codePoint);
  }
  return bytes;
}
function adjustIndiciesToUcs2(patches, base, options = {}) {
  let byteOffset = 0, idx = 0;
  function advanceTo(target) {
    for (; byteOffset < target; ) {
      const codePoint = base.codePointAt(idx);
      if (typeof codePoint > "u") return idx;
      byteOffset += utf8len(codePoint), codePoint > 65535 ? idx += 2 : idx += 1;
    }
    if (!options.allowExceedingIndices && byteOffset !== target) throw new Error("Failed to determine byte offset");
    return idx;
  }
  const adjusted = [];
  for (const patch of patches) adjusted.push({
    diffs: patch.diffs.map((diff2) => cloneDiff(diff2)),
    start1: advanceTo(patch.start1),
    start2: advanceTo(patch.start2),
    utf8Start1: patch.utf8Start1,
    utf8Start2: patch.utf8Start2,
    length1: patch.length1,
    length2: patch.length2,
    utf8Length1: patch.utf8Length1,
    utf8Length2: patch.utf8Length2
  });
  return adjusted;
}
function utf8len(codePoint) {
  return codePoint <= 127 ? 1 : codePoint <= 2047 ? 2 : codePoint <= 65535 ? 3 : 4;
}
const MAX_BITS = 32, DEFAULT_MARGIN = 4;
function addPadding(patches, margin = DEFAULT_MARGIN) {
  const paddingLength = margin;
  let nullPadding = "";
  for (let x = 1; x <= paddingLength; x++) nullPadding += String.fromCharCode(x);
  for (const p of patches) p.start1 += paddingLength, p.start2 += paddingLength, p.utf8Start1 += paddingLength, p.utf8Start2 += paddingLength;
  let patch = patches[0], diffs = patch.diffs;
  if (diffs.length === 0 || diffs[0][0] !== DIFF_EQUAL) diffs.unshift([DIFF_EQUAL, nullPadding]), patch.start1 -= paddingLength, patch.start2 -= paddingLength, patch.utf8Start1 -= paddingLength, patch.utf8Start2 -= paddingLength, patch.length1 += paddingLength, patch.length2 += paddingLength, patch.utf8Length1 += paddingLength, patch.utf8Length2 += paddingLength;
  else if (paddingLength > diffs[0][1].length) {
    const firstDiffLength = diffs[0][1].length, extraLength = paddingLength - firstDiffLength;
    diffs[0][1] = nullPadding.substring(firstDiffLength) + diffs[0][1], patch.start1 -= extraLength, patch.start2 -= extraLength, patch.utf8Start1 -= extraLength, patch.utf8Start2 -= extraLength, patch.length1 += extraLength, patch.length2 += extraLength, patch.utf8Length1 += extraLength, patch.utf8Length2 += extraLength;
  }
  if (patch = patches[patches.length - 1], diffs = patch.diffs, diffs.length === 0 || diffs[diffs.length - 1][0] !== DIFF_EQUAL) diffs.push([DIFF_EQUAL, nullPadding]), patch.length1 += paddingLength, patch.length2 += paddingLength, patch.utf8Length1 += paddingLength, patch.utf8Length2 += paddingLength;
  else if (paddingLength > diffs[diffs.length - 1][1].length) {
    const extraLength = paddingLength - diffs[diffs.length - 1][1].length;
    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength), patch.length1 += extraLength, patch.length2 += extraLength, patch.utf8Length1 += extraLength, patch.utf8Length2 += extraLength;
  }
  return nullPadding;
}
function createPatchObject(start1, start2) {
  return {
    diffs: [],
    start1,
    start2,
    utf8Start1: start1,
    utf8Start2: start2,
    length1: 0,
    length2: 0,
    utf8Length1: 0,
    utf8Length2: 0
  };
}
function splitMax(patches, margin = DEFAULT_MARGIN) {
  const patchSize = MAX_BITS;
  for (let x = 0; x < patches.length; x++) {
    if (patches[x].length1 <= patchSize) continue;
    const bigpatch = patches[x];
    patches.splice(x--, 1);
    let start1 = bigpatch.start1, start2 = bigpatch.start2, preContext = "";
    for (; bigpatch.diffs.length !== 0; ) {
      const patch = createPatchObject(start1 - preContext.length, start2 - preContext.length);
      let empty = !0;
      if (preContext !== "") {
        const precontextByteCount = countUtf8Bytes(preContext);
        patch.length1 = preContext.length, patch.utf8Length1 = precontextByteCount, patch.length2 = preContext.length, patch.utf8Length2 = precontextByteCount, patch.diffs.push([DIFF_EQUAL, preContext]);
      }
      for (; bigpatch.diffs.length !== 0 && patch.length1 < patchSize - margin; ) {
        const diffType = bigpatch.diffs[0][0];
        let diffText = bigpatch.diffs[0][1], diffTextByteCount = countUtf8Bytes(diffText);
        if (diffType === DIFF_INSERT) {
          patch.length2 += diffText.length, patch.utf8Length2 += diffTextByteCount, start2 += diffText.length;
          const diff2 = bigpatch.diffs.shift();
          diff2 && patch.diffs.push(diff2), empty = !1;
        } else diffType === DIFF_DELETE && patch.diffs.length === 1 && patch.diffs[0][0] === DIFF_EQUAL && diffText.length > 2 * patchSize ? (patch.length1 += diffText.length, patch.utf8Length1 += diffTextByteCount, start1 += diffText.length, empty = !1, patch.diffs.push([diffType, diffText]), bigpatch.diffs.shift()) : (diffText = diffText.substring(0, patchSize - patch.length1 - margin), diffTextByteCount = countUtf8Bytes(diffText), patch.length1 += diffText.length, patch.utf8Length1 += diffTextByteCount, start1 += diffText.length, diffType === DIFF_EQUAL ? (patch.length2 += diffText.length, patch.utf8Length2 += diffTextByteCount, start2 += diffText.length) : empty = !1, patch.diffs.push([diffType, diffText]), diffText === bigpatch.diffs[0][1] ? bigpatch.diffs.shift() : bigpatch.diffs[0][1] = bigpatch.diffs[0][1].substring(diffText.length));
      }
      preContext = diffText2(patch.diffs), preContext = preContext.substring(preContext.length - margin);
      const postContext = diffText1(bigpatch.diffs).substring(0, margin), postContextByteCount = countUtf8Bytes(postContext);
      postContext !== "" && (patch.length1 += postContext.length, patch.length2 += postContext.length, patch.utf8Length1 += postContextByteCount, patch.utf8Length2 += postContextByteCount, patch.diffs.length !== 0 && patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL ? patch.diffs[patch.diffs.length - 1][1] += postContext : patch.diffs.push([DIFF_EQUAL, postContext])), empty || patches.splice(++x, 0, patch);
    }
  }
}
function apply(patches, originalText, opts = {}) {
  if (typeof patches == "string") throw new Error("Patches must be an array - pass the patch to `parsePatch()` first");
  let text = originalText;
  if (patches.length === 0) return [text, []];
  const parsed = adjustIndiciesToUcs2(patches, text, {
    allowExceedingIndices: opts.allowExceedingIndices
  }), margin = opts.margin || DEFAULT_MARGIN, deleteThreshold = opts.deleteThreshold || 0.4, nullPadding = addPadding(parsed, margin);
  text = nullPadding + text + nullPadding, splitMax(parsed, margin);
  let delta = 0;
  const results = [];
  for (let x = 0; x < parsed.length; x++) {
    const expectedLoc = parsed[x].start2 + delta, text1 = diffText1(parsed[x].diffs);
    let startLoc, endLoc = -1;
    if (text1.length > MAX_BITS ? (startLoc = match(text, text1.substring(0, MAX_BITS), expectedLoc), startLoc !== -1 && (endLoc = match(text, text1.substring(text1.length - MAX_BITS), expectedLoc + text1.length - MAX_BITS), (endLoc === -1 || startLoc >= endLoc) && (startLoc = -1))) : startLoc = match(text, text1, expectedLoc), startLoc === -1) results[x] = !1, delta -= parsed[x].length2 - parsed[x].length1;
    else {
      results[x] = !0, delta = startLoc - expectedLoc;
      let text2;
      if (endLoc === -1 ? text2 = text.substring(startLoc, startLoc + text1.length) : text2 = text.substring(startLoc, endLoc + MAX_BITS), text1 === text2) text = text.substring(0, startLoc) + diffText2(parsed[x].diffs) + text.substring(startLoc + text1.length);
      else {
        let diffs = diff(text1, text2, {
          checkLines: !1
        });
        if (text1.length > MAX_BITS && levenshtein(diffs) / text1.length > deleteThreshold) results[x] = !1;
        else {
          diffs = cleanupSemanticLossless(diffs);
          let index1 = 0, index2 = 0;
          for (let y = 0; y < parsed[x].diffs.length; y++) {
            const mod = parsed[x].diffs[y];
            mod[0] !== DIFF_EQUAL && (index2 = xIndex(diffs, index1)), mod[0] === DIFF_INSERT ? text = text.substring(0, startLoc + index2) + mod[1] + text.substring(startLoc + index2) : mod[0] === DIFF_DELETE && (text = text.substring(0, startLoc + index2) + text.substring(startLoc + xIndex(diffs, index1 + mod[1].length))), mod[0] !== DIFF_DELETE && (index1 += mod[1].length);
          }
        }
      }
    }
  }
  return text = text.substring(nullPadding.length, text.length - nullPadding.length), [text, results];
}
const patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
function parse(textline) {
  if (!textline) return [];
  const patches = [], lines = textline.split(`
`);
  let textPointer = 0;
  for (; textPointer < lines.length; ) {
    const m = lines[textPointer].match(patchHeader);
    if (!m) throw new Error(`Invalid patch string: ${lines[textPointer]}`);
    const patch = createPatchObject(toInt(m[1]), toInt(m[3]));
    for (patches.push(patch), m[2] === "" ? (patch.start1--, patch.utf8Start1--, patch.length1 = 1, patch.utf8Length1 = 1) : m[2] === "0" ? (patch.length1 = 0, patch.utf8Length1 = 0) : (patch.start1--, patch.utf8Start1--, patch.utf8Length1 = toInt(m[2]), patch.length1 = patch.utf8Length1), m[4] === "" ? (patch.start2--, patch.utf8Start2--, patch.length2 = 1, patch.utf8Length2 = 1) : m[4] === "0" ? (patch.length2 = 0, patch.utf8Length2 = 0) : (patch.start2--, patch.utf8Start2--, patch.utf8Length2 = toInt(m[4]), patch.length2 = patch.utf8Length2), textPointer++; textPointer < lines.length; ) {
      const currentLine = lines[textPointer], sign = currentLine.charAt(0);
      if (sign === "@") break;
      if (sign === "") {
        textPointer++;
        continue;
      }
      let line;
      try {
        line = decodeURI(currentLine.slice(1));
      } catch {
        throw new Error(`Illegal escape in parse: ${currentLine}`);
      }
      const utf8Diff = countUtf8Bytes(line) - line.length;
      if (sign === "-") patch.diffs.push([DIFF_DELETE, line]), patch.length1 -= utf8Diff;
      else if (sign === "+") patch.diffs.push([DIFF_INSERT, line]), patch.length2 -= utf8Diff;
      else if (sign === " ") patch.diffs.push([DIFF_EQUAL, line]), patch.length1 -= utf8Diff, patch.length2 -= utf8Diff;
      else throw new Error(`Invalid patch mode "${sign}" in: ${line}`);
      textPointer++;
    }
  }
  return patches;
}
function toInt(num) {
  return parseInt(num, 10);
}
const debug$b = debugWithName("transformOperation");
function transformOperation(editor, patch, operation, snapshot, previousSnapshot) {
  const transformedOperation = {
    ...operation
  };
  if (patch.type === "insert" && patch.path.length === 1) {
    const insertBlockIndex = (snapshot || []).findIndex((blk) => isEqual({
      _key: blk._key
    }, patch.path[0]));
    return debug$b(`Adjusting block path (+${patch.items.length}) for '${transformedOperation.type}' operation and patch '${patch.type}'`), [adjustBlockPath(transformedOperation, patch.items.length, insertBlockIndex)];
  }
  if (patch.type === "unset" && patch.path.length === 1) {
    const unsetBlockIndex = (previousSnapshot || []).findIndex((blk) => isEqual({
      _key: blk._key
    }, patch.path[0]));
    return "path" in transformedOperation && Array.isArray(transformedOperation.path) && transformedOperation.path[0] === unsetBlockIndex ? (debug$b("Skipping transformation that targeted removed block"), []) : [adjustBlockPath(transformedOperation, -1, unsetBlockIndex)];
  }
  if (patch.type === "unset" && patch.path.length === 0)
    return debug$b(`Adjusting selection for unset everything patch and ${operation.type} operation`), [];
  if (patch.type === "diffMatchPatch") {
    const operationTargetBlock = findOperationTargetBlock(editor, transformedOperation);
    return !operationTargetBlock || !isEqual({
      _key: operationTargetBlock._key
    }, patch.path[0]) ? [transformedOperation] : (parse(patch.value).forEach((diffPatch) => {
      let adjustOffsetBy = 0, changedOffset = diffPatch.utf8Start1;
      const {
        diffs
      } = diffPatch;
      if (diffs.forEach((diff2, index) => {
        const [diffType, text] = diff2;
        diffType === DIFF_INSERT ? (adjustOffsetBy += text.length, changedOffset += text.length) : diffType === DIFF_DELETE ? (adjustOffsetBy -= text.length, changedOffset -= text.length) : diffType === DIFF_EQUAL && (diffs.slice(index).every(([dType]) => dType === DIFF_EQUAL) || (changedOffset += text.length));
      }), transformedOperation.type === "insert_text" && changedOffset < transformedOperation.offset && (transformedOperation.offset += adjustOffsetBy), transformedOperation.type === "remove_text" && changedOffset <= transformedOperation.offset - transformedOperation.text.length && (transformedOperation.offset += adjustOffsetBy), transformedOperation.type === "set_selection") {
        const currentFocus = transformedOperation.properties?.focus ? {
          ...transformedOperation.properties.focus
        } : void 0, currentAnchor = transformedOperation?.properties?.anchor ? {
          ...transformedOperation.properties.anchor
        } : void 0, newFocus = transformedOperation?.newProperties?.focus ? {
          ...transformedOperation.newProperties.focus
        } : void 0, newAnchor = transformedOperation?.newProperties?.anchor ? {
          ...transformedOperation.newProperties.anchor
        } : void 0;
        (currentFocus && currentAnchor || newFocus && newAnchor) && ([currentFocus, currentAnchor, newFocus, newAnchor].forEach((point3) => {
          point3 && changedOffset < point3.offset && (point3.offset += adjustOffsetBy);
        }), currentFocus && currentAnchor && (transformedOperation.properties = {
          focus: currentFocus,
          anchor: currentAnchor
        }), newFocus && newAnchor && (transformedOperation.newProperties = {
          focus: newFocus,
          anchor: newAnchor
        }));
      }
    }), [transformedOperation]);
  }
  return [transformedOperation];
}
function adjustBlockPath(operation, level, blockIndex) {
  const transformedOperation = {
    ...operation
  };
  if (blockIndex >= 0 && transformedOperation.type !== "set_selection" && Array.isArray(transformedOperation.path) && transformedOperation.path[0] >= blockIndex + level && transformedOperation.path[0] + level > -1) {
    const newPath = [transformedOperation.path[0] + level, ...transformedOperation.path.slice(1)];
    transformedOperation.path = newPath;
  }
  if (transformedOperation.type === "set_selection") {
    const currentFocus = transformedOperation.properties?.focus ? {
      ...transformedOperation.properties.focus
    } : void 0, currentAnchor = transformedOperation?.properties?.anchor ? {
      ...transformedOperation.properties.anchor
    } : void 0, newFocus = transformedOperation?.newProperties?.focus ? {
      ...transformedOperation.newProperties.focus
    } : void 0, newAnchor = transformedOperation?.newProperties?.anchor ? {
      ...transformedOperation.newProperties.anchor
    } : void 0;
    (currentFocus && currentAnchor || newFocus && newAnchor) && ([currentFocus, currentAnchor, newFocus, newAnchor].forEach((point3) => {
      point3 && point3.path[0] >= blockIndex + level && point3.path[0] + level > -1 && (point3.path = [point3.path[0] + level, ...point3.path.slice(1)]);
    }), currentFocus && currentAnchor && (transformedOperation.properties = {
      focus: currentFocus,
      anchor: currentAnchor
    }), newFocus && newAnchor && (transformedOperation.newProperties = {
      focus: newFocus,
      anchor: newAnchor
    }));
  }
  return transformedOperation;
}
function findOperationTargetBlock(editor, operation) {
  let block;
  return operation.type === "set_selection" && editor.selection ? block = editor.children[editor.selection.focus.path[0]] : "path" in operation && (block = editor.children[operation.path[0]]), block;
}
const debug$a = debugWithName("behavior.operation.history.redo"), historyRedoOperationImplementation = ({
  operation
}) => {
  const editor = operation.editor, {
    redos
  } = editor.history, remotePatches = getRemotePatches(editor);
  if (redos.length > 0) {
    const step = redos[redos.length - 1];
    if (debug$a("Redoing", step), step.operations.length > 0) {
      const otherPatches = remotePatches.filter((item) => item.time >= step.timestamp);
      let transformedOperations = step.operations;
      otherPatches.forEach((item) => {
        transformedOperations = flatten(transformedOperations.map((op) => transformOperation(editor, item.patch, op, item.snapshot, item.previousSnapshot)));
      });
      try {
        Editor.withoutNormalizing(editor, () => {
          pluginRedoing(editor, () => {
            pluginWithoutHistory(editor, () => {
              transformedOperations.forEach((op) => {
                editor.apply(op);
              });
            });
          });
        });
      } catch (err) {
        debug$a("Could not perform redo step", err), remotePatches.splice(0, remotePatches.length), Transforms.deselect(editor), editor.history = {
          undos: [],
          redos: []
        }, setWithHistory(editor, !0), setIsRedoing(editor, !1), editor.onChange();
        return;
      }
      editor.history.undos.push(step), editor.history.redos.pop();
    }
  }
}, debug$9 = debugWithName("behavior.operation.history.undo"), historyUndoOperationImplementation = ({
  operation
}) => {
  const editor = operation.editor, {
    undos
  } = editor.history, remotePatches = getRemotePatches(editor);
  if (undos.length > 0) {
    const step = undos[undos.length - 1];
    if (debug$9("Undoing", step), step.operations.length > 0) {
      const otherPatches = remotePatches.filter((item) => item.time >= step.timestamp);
      let transformedOperations = step.operations;
      otherPatches.forEach((item) => {
        transformedOperations = flatten(transformedOperations.map((op) => transformOperation(editor, item.patch, op, item.snapshot, item.previousSnapshot)));
      });
      const reversedOperations = transformedOperations.map(Operation.inverse).reverse();
      try {
        Editor.withoutNormalizing(editor, () => {
          pluginUndoing(editor, () => {
            pluginWithoutHistory(editor, () => {
              reversedOperations.forEach((op) => {
                editor.apply(op);
              });
            });
          });
        });
      } catch (err) {
        debug$9("Could not perform undo step", err), remotePatches.splice(0, remotePatches.length), Transforms.deselect(editor), editor.history = {
          undos: [],
          redos: []
        }, setWithHistory(editor, !0), setIsUndoing(editor, !1), editor.onChange();
        return;
      }
      editor.history.redos.push(step), editor.history.undos.pop();
    }
  }
}, addAnnotationOperationImplementation = ({
  context,
  operation
}) => {
  const parsedAnnotation = parseAnnotation({
    annotation: {
      _type: operation.annotation.name,
      _key: operation.annotation._key,
      ...operation.annotation.value
    },
    context,
    options: {
      validateFields: !0
    }
  });
  if (!parsedAnnotation)
    throw new Error(`Failed to parse annotation ${JSON.stringify(operation.annotation)}`);
  const editor = operation.editor;
  if (!editor.selection || Range.isCollapsed(editor.selection))
    return;
  const selectedBlocks = Editor.nodes(editor, {
    at: editor.selection,
    match: (node3) => editor.isTextBlock(node3),
    reverse: Range.isBackward(editor.selection)
  });
  let blockIndex = 0;
  for (const [block, blockPath] of selectedBlocks) {
    if (block.children.length === 0 || block.children.length === 1 && block.children[0].text === "")
      continue;
    const annotationKey = blockIndex === 0 ? parsedAnnotation._key : context.keyGenerator(), markDefs = block.markDefs ?? [];
    markDefs.find((markDef) => markDef._type === parsedAnnotation._type && markDef._key === annotationKey) === void 0 && Transforms.setNodes(editor, {
      markDefs: [...markDefs, {
        ...parsedAnnotation,
        _key: annotationKey
      }]
    }, {
      at: blockPath
    }), Transforms.setNodes(editor, {}, {
      match: Text$1.isText,
      split: !0
    });
    const children = Node.children(editor, blockPath);
    for (const [span, path3] of children) {
      if (!editor.isTextSpan(span) || !Range.includes(editor.selection, path3))
        continue;
      const marks3 = span.marks ?? [];
      Transforms.setNodes(editor, {
        marks: [...marks3, annotationKey]
      }, {
        at: path3
      });
    }
    blockIndex++;
  }
}, removeAnnotationOperationImplementation = ({
  operation
}) => {
  const editor = operation.editor;
  if (editor.selection)
    if (Range.isCollapsed(editor.selection)) {
      const [block, blockPath] = Editor.node(editor, editor.selection, {
        depth: 1
      });
      if (!editor.isTextBlock(block))
        return;
      const potentialAnnotations = (block.markDefs ?? []).filter((markDef) => markDef._type === operation.annotation.name), [selectedChild, selectedChildPath] = Editor.node(editor, editor.selection, {
        depth: 2
      });
      if (!editor.isTextSpan(selectedChild))
        return;
      const annotationToRemove = selectedChild.marks?.find((mark) => potentialAnnotations.some((markDef) => markDef._key === mark));
      if (!annotationToRemove)
        return;
      const previousSpansWithSameAnnotation = [];
      for (const [child, childPath] of Node.children(editor, blockPath, {
        reverse: !0
      }))
        if (editor.isTextSpan(child) && Path.isBefore(childPath, selectedChildPath))
          if (child.marks?.includes(annotationToRemove))
            previousSpansWithSameAnnotation.push([child, childPath]);
          else
            break;
      const nextSpansWithSameAnnotation = [];
      for (const [child, childPath] of Node.children(editor, blockPath))
        if (editor.isTextSpan(child) && Path.isAfter(childPath, selectedChildPath))
          if (child.marks?.includes(annotationToRemove))
            nextSpansWithSameAnnotation.push([child, childPath]);
          else
            break;
      for (const [child, childPath] of [...previousSpansWithSameAnnotation, [selectedChild, selectedChildPath], ...nextSpansWithSameAnnotation])
        Transforms.setNodes(editor, {
          marks: child.marks?.filter((mark) => mark !== annotationToRemove)
        }, {
          at: childPath
        });
    } else {
      Transforms.setNodes(editor, {}, {
        match: (node3) => editor.isTextSpan(node3),
        split: !0,
        hanging: !0
      });
      const blocks = Editor.nodes(editor, {
        at: editor.selection,
        match: (node3) => editor.isTextBlock(node3)
      });
      for (const [block, blockPath] of blocks) {
        const children = Node.children(editor, blockPath);
        for (const [child, childPath] of children) {
          if (!editor.isTextSpan(child) || !Range.includes(editor.selection, childPath))
            continue;
          const markDefs = block.markDefs ?? [], marks3 = child.marks ?? [], marksWithoutAnnotation = marks3.filter((mark) => markDefs.find((markDef2) => markDef2._key === mark)?._type !== operation.annotation.name);
          marksWithoutAnnotation.length !== marks3.length && Transforms.setNodes(editor, {
            marks: marksWithoutAnnotation
          }, {
            at: childPath
          });
        }
      }
    }
}, blockSetOperationImplementation = ({
  context,
  operation
}) => {
  const blockIndex = operation.editor.blockIndexMap.get(operation.at[0]._key);
  if (blockIndex === void 0)
    throw new Error(`Unable to find block index for block at ${JSON.stringify(operation.at)}`);
  const slateBlock = operation.editor.children.at(blockIndex);
  if (!slateBlock)
    throw new Error(`Unable to find block at ${JSON.stringify(operation.at)}`);
  if (isTextBlock(context, slateBlock)) {
    const filteredProps = {};
    for (const key of Object.keys(operation.props))
      if (!(key === "_type" || key === "children")) {
        if (key === "style") {
          context.schema.styles.some((style) => style.name === operation.props[key]) && (filteredProps[key] = operation.props[key]);
          continue;
        }
        if (key === "listItem") {
          context.schema.lists.some((list) => list.name === operation.props[key]) && (filteredProps[key] = operation.props[key]);
          continue;
        }
        if (key === "level") {
          filteredProps[key] = operation.props[key];
          continue;
        }
        if (key === "markDefs") {
          const {
            markDefs
          } = parseMarkDefs({
            context,
            markDefs: operation.props[key],
            options: {
              validateFields: !0
            }
          });
          filteredProps[key] = markDefs;
          continue;
        }
        context.schema.block.fields?.some((field) => field.name === key) && (filteredProps[key] = operation.props[key]);
      }
    Transforms.setNodes(operation.editor, filteredProps, {
      at: [blockIndex]
    });
  } else {
    const schemaDefinition = context.schema.blockObjects.find((definition) => definition.name === slateBlock._type), filteredProps = {};
    for (const key of Object.keys(operation.props))
      if (key !== "_type") {
        if (key === "_key") {
          filteredProps[key] = operation.props[key];
          continue;
        }
        schemaDefinition?.fields.some((field) => field.name === key) && (filteredProps[key] = operation.props[key]);
      }
    const patches = Object.entries(filteredProps).map(([key, value]) => key === "_key" ? set(value, ["_key"]) : set(value, ["value", key])), updatedSlateBlock = applyAll(slateBlock, patches);
    Transforms.setNodes(operation.editor, updatedSlateBlock, {
      at: [blockIndex]
    });
  }
}, blockUnsetOperationImplementation = ({
  context,
  operation
}) => {
  const blockKey = operation.at[0]._key, blockIndex = operation.editor.blockIndexMap.get(blockKey);
  if (blockIndex === void 0)
    throw new Error(`Unable to find block index for block key ${blockKey}`);
  const slateBlock = blockIndex !== void 0 ? operation.editor.children.at(blockIndex) : void 0;
  if (!slateBlock)
    throw new Error(`Unable to find block at ${JSON.stringify(operation.at)}`);
  if (isTextBlock(context, slateBlock)) {
    const propsToRemove = operation.props.filter((prop) => prop !== "_type" && prop !== "_key" && prop !== "children");
    Transforms.unsetNodes(operation.editor, propsToRemove, {
      at: [blockIndex]
    }), operation.props.includes("_key") && Transforms.setNodes(operation.editor, {
      _key: context.keyGenerator()
    }, {
      at: [blockIndex]
    });
    return;
  }
  const patches = operation.props.flatMap((key) => key === "_type" ? [] : key === "_key" ? set(context.keyGenerator(), ["_key"]) : unset(["value", key])), updatedSlateBlock = applyAll(slateBlock, patches);
  Transforms.setNodes(operation.editor, updatedSlateBlock, {
    at: [blockIndex]
  });
}, childSetOperationImplementation = ({
  context,
  operation
}) => {
  const location = toSlateRange({
    context: {
      schema: context.schema,
      value: operation.editor.value,
      selection: {
        anchor: {
          path: operation.at,
          offset: 0
        },
        focus: {
          path: operation.at,
          offset: 0
        }
      }
    },
    blockIndexMap: operation.editor.blockIndexMap
  });
  if (!location)
    throw new Error(`Unable to convert ${JSON.stringify(operation.at)} into a Slate Range`);
  const childEntry = Editor.node(operation.editor, location, {
    depth: 2
  }), child = childEntry?.[0], childPath = childEntry?.[1];
  if (!child || !childPath)
    throw new Error(`Unable to find child at ${JSON.stringify(operation.at)}`);
  if (operation.editor.isTextSpan(child)) {
    const {
      _type,
      text,
      ...rest
    } = operation.props;
    Transforms.setNodes(operation.editor, {
      ...child,
      ...rest
    }, {
      at: childPath
    }), typeof text == "string" && child.text !== text && (operation.editor.apply({
      type: "remove_text",
      path: childPath,
      offset: 0,
      text: child.text
    }), operation.editor.apply({
      type: "insert_text",
      path: childPath,
      offset: 0,
      text
    }));
    return;
  }
  if (Element$2.isElement(child)) {
    const definition = context.schema.inlineObjects.find((definition2) => definition2.name === child._type);
    if (!definition)
      throw new Error(`Unable to find schema definition for Inline Object type ${child._type}`);
    const value = "value" in child && typeof child.value == "object" ? child.value : {}, {
      _type,
      _key,
      ...rest
    } = operation.props;
    for (const prop in rest)
      definition.fields.some((field) => field.name === prop) || delete rest[prop];
    Transforms.setNodes(operation.editor, {
      ...child,
      _key: typeof _key == "string" ? _key : child._key,
      value: {
        ...value,
        ...rest
      }
    }, {
      at: childPath
    });
    return;
  }
  throw new Error(`Unable to determine the type of child at ${JSON.stringify(operation.at)}`);
}, childUnsetOperationImplementation = ({
  context,
  operation
}) => {
  const blockKey = operation.at[0]._key, blockIndex = operation.editor.blockIndexMap.get(blockKey);
  if (blockIndex === void 0)
    throw new Error(`Unable to find block index for block key ${blockKey}`);
  const block = blockIndex !== void 0 ? operation.editor.value.at(blockIndex) : void 0;
  if (!block)
    throw new Error(`Unable to find block at ${JSON.stringify(operation.at)}`);
  if (!isTextBlock(context, block))
    throw new Error(`Block ${JSON.stringify(blockKey)} is not a text block`);
  const childKey = operation.at[2]._key;
  if (!childKey)
    throw new Error(`Unable to find child key at ${JSON.stringify(operation.at)}`);
  const childIndex = block.children.findIndex((child2) => child2._key === childKey);
  if (childIndex === -1)
    throw new Error(`Unable to find child at ${JSON.stringify(operation.at)}`);
  const childEntry = Editor.node(operation.editor, [blockIndex, childIndex], {
    depth: 2
  }), child = childEntry?.[0], childPath = childEntry?.[1];
  if (!child || !childPath)
    throw new Error(`Unable to find child at ${JSON.stringify(operation.at)}`);
  if (operation.editor.isTextSpan(child)) {
    const newNode = {};
    for (const prop of operation.props)
      if (prop !== "text" && prop !== "_type") {
        if (prop === "_key") {
          newNode._key = context.keyGenerator();
          continue;
        }
        newNode[prop] = null;
      }
    Transforms.setNodes(operation.editor, newNode, {
      at: childPath
    }), operation.props.includes("text") && operation.editor.apply({
      type: "remove_text",
      path: childPath,
      offset: 0,
      text: child.text
    });
    return;
  }
  if (Element$2.isElement(child)) {
    const value = "value" in child && typeof child.value == "object" ? child.value : {}, patches = operation.props.map((prop) => ({
      type: "unset",
      path: [prop]
    })), newValue = applyAll(value, patches);
    Transforms.setNodes(operation.editor, {
      ...child,
      _key: operation.props.includes("_key") ? context.keyGenerator() : child._key,
      value: newValue
    }, {
      at: childPath
    });
    return;
  }
  throw new Error(`Unable to determine the type of child at ${JSON.stringify(operation.at)}`);
}, decoratorAddOperationImplementation = ({
  context,
  operation
}) => {
  const editor = operation.editor, mark = operation.decorator;
  let at = operation.at ? toSlateRange({
    context: {
      schema: context.schema,
      value: operation.editor.value,
      selection: operation.at
    },
    blockIndexMap: operation.editor.blockIndexMap
  }) : operation.editor.selection;
  if (!at)
    throw new Error("Unable to add decorator without a selection");
  if (Range.isExpanded(at)) {
    const rangeRef3 = Editor.rangeRef(editor, at, {
      affinity: "inward"
    }), [start2, end2] = Range.edges(at), endAtEndOfNode = Editor.isEnd(editor, end2, end2.path);
    Transforms.splitNodes(editor, {
      at: end2,
      match: Text$1.isText,
      mode: "lowest",
      voids: !1,
      always: !endAtEndOfNode
    });
    const startAtStartOfNode = Editor.isStart(editor, start2, start2.path);
    if (Transforms.splitNodes(editor, {
      at: start2,
      match: Text$1.isText,
      mode: "lowest",
      voids: !1,
      always: !startAtStartOfNode
    }), at = rangeRef3.unref(), !at)
      throw new Error("Unable to add decorator without a selection");
    operation.at || Transforms.select(editor, at);
    const splitTextNodes = Editor.nodes(editor, {
      at,
      match: Text$1.isText
    });
    for (const [node3, path3] of splitTextNodes) {
      const marks3 = [...(Array.isArray(node3.marks) ? node3.marks : []).filter((eMark) => eMark !== mark), mark];
      Transforms.setNodes(editor, {
        marks: marks3
      }, {
        at: path3,
        match: Text$1.isText,
        split: !0,
        hanging: !0
      });
    }
  } else {
    if (!Array.from(Editor.nodes(editor, {
      at,
      match: (node3) => editor.isTextSpan(node3)
    }))?.at(0))
      return;
    const [block, blockPath] = Editor.node(editor, at, {
      depth: 1
    }), lonelyEmptySpan = editor.isTextBlock(block) && block.children.length === 1 && editor.isTextSpan(block.children[0]) && block.children[0].text === "" ? block.children[0] : void 0;
    if (lonelyEmptySpan) {
      const existingMarks = lonelyEmptySpan.marks ?? [], existingMarksWithoutDecorator = existingMarks.filter((existingMark) => existingMark !== mark);
      Transforms.setNodes(editor, {
        marks: existingMarks.length === existingMarksWithoutDecorator.length ? [...existingMarks, mark] : existingMarksWithoutDecorator
      }, {
        at: blockPath,
        match: (node3) => editor.isTextSpan(node3)
      });
    } else
      editor.decoratorState[mark] = !0;
  }
  if (editor.selection) {
    const selection = editor.selection;
    editor.selection = {
      ...selection
    };
  }
}, deleteOperationImplementation = ({
  context,
  operation
}) => {
  const at = operation.at ? toSlateRange({
    context: {
      schema: context.schema,
      value: operation.editor.value,
      selection: operation.at
    },
    blockIndexMap: operation.editor.blockIndexMap
  }) : operation.editor.selection;
  if (!at)
    throw new Error("Unable to delete without a selection");
  const [start2, end2] = Range.edges(at);
  if (operation.unit === "block") {
    const startBlockIndex = start2.path.at(0), endBlockIndex = end2.path.at(0);
    if (startBlockIndex === void 0 || endBlockIndex === void 0)
      throw new Error("Failed to get start or end block index");
    Transforms.removeNodes(operation.editor, {
      at: {
        anchor: {
          path: [startBlockIndex],
          offset: 0
        },
        focus: {
          path: [endBlockIndex],
          offset: 0
        }
      },
      mode: "highest"
    });
    return;
  }
  if (operation.unit === "child") {
    Transforms.removeNodes(operation.editor, {
      at,
      match: (node3) => isSpan(context, node3) && node3._key !== VOID_CHILD_KEY || "__inline" in node3 && node3.__inline === !0
    });
    return;
  }
  if (operation.direction === "backward" && operation.unit === "line") {
    const parentBlockEntry = Editor.above(operation.editor, {
      match: (n2) => Element$2.isElement(n2) && Editor.isBlock(operation.editor, n2),
      at
    });
    if (parentBlockEntry) {
      const [, parentBlockPath] = parentBlockEntry, parentElementRange = Editor.range(operation.editor, parentBlockPath, at.anchor), currentLineRange = findCurrentLineRange(operation.editor, parentElementRange);
      if (!Range.isCollapsed(currentLineRange)) {
        Transforms.delete(operation.editor, {
          at: currentLineRange
        });
        return;
      }
    }
  }
  if (operation.unit === "word" && Range.isCollapsed(at)) {
    deleteText(operation.editor, {
      at,
      unit: "word",
      reverse: operation.direction === "backward"
    });
    return;
  }
  const startBlock = Editor.above(operation.editor, {
    match: (n2) => Element$2.isElement(n2) && Editor.isBlock(operation.editor, n2),
    at: start2,
    voids: !1
  }), endBlock = Editor.above(operation.editor, {
    match: (n2) => Element$2.isElement(n2) && Editor.isBlock(operation.editor, n2),
    at: end2,
    voids: !1
  }), isAcrossBlocks = startBlock && endBlock && !Path.equals(startBlock[1], endBlock[1]), startNonEditable = Editor.void(operation.editor, {
    at: start2,
    mode: "highest"
  }) ?? Editor.elementReadOnly(operation.editor, {
    at: start2,
    mode: "highest"
  }), endNonEditable = Editor.void(operation.editor, {
    at: end2,
    mode: "highest"
  }) ?? Editor.elementReadOnly(operation.editor, {
    at: end2,
    mode: "highest"
  }), matches = [];
  let lastPath;
  for (const entry of Editor.nodes(operation.editor, {
    at,
    voids: !1
  })) {
    const [node3, path3] = entry;
    lastPath && Path.compare(path3, lastPath) === 0 || (Element$2.isElement(node3) && (Editor.isVoid(operation.editor, node3) || Editor.isElementReadOnly(operation.editor, node3)) || !Path.isCommon(path3, start2.path) && !Path.isCommon(path3, end2.path)) && (matches.push(entry), lastPath = path3);
  }
  const pathRefs2 = Array.from(matches, ([, path3]) => Editor.pathRef(operation.editor, path3)), startRef = Editor.pointRef(operation.editor, start2), endRef = Editor.pointRef(operation.editor, end2);
  if (startBlock && endBlock && Point.equals(start2, Editor.start(operation.editor, startBlock[1])) && Point.equals(end2, Editor.end(operation.editor, endBlock[1])) && isAcrossBlocks && !startNonEditable && !endNonEditable) {
    if (!startNonEditable) {
      const point3 = startRef.current, [node3] = Editor.leaf(operation.editor, point3);
      node3.text.length > 0 && operation.editor.apply({
        type: "remove_text",
        path: point3.path,
        offset: 0,
        text: node3.text
      });
    }
    for (const pathRef3 of pathRefs2.reverse()) {
      const path3 = pathRef3.unref();
      path3 && Transforms.removeNodes(operation.editor, {
        at: path3,
        voids: !1
      });
    }
    if (!endNonEditable) {
      const point3 = endRef.current, [node3] = Editor.leaf(operation.editor, point3), {
        path: path3
      } = point3, offset = 0, text = node3.text.slice(offset, end2.offset);
      text.length > 0 && operation.editor.apply({
        type: "remove_text",
        path: path3,
        offset,
        text
      });
    }
    endRef.current && startRef.current && Transforms.removeNodes(operation.editor, {
      at: endRef.current,
      voids: !1
    });
    return;
  }
  const reverse = operation.direction === "backward", hanging = reverse ? end2 ? isTextBlock(context, endBlock) ? end2.offset === 0 : !0 : !1 : start2 ? isTextBlock(context, startBlock) ? start2.offset === 0 : !0 : !1;
  operation.at ? deleteText(operation.editor, {
    at,
    hanging,
    reverse
  }) : deleteText(operation.editor, {
    hanging,
    reverse
  });
};
function findCurrentLineRange(editor, parentRange) {
  const parentRangeBoundary = Editor.range(editor, Range.end(parentRange)), positions2 = Array.from(Editor.positions(editor, {
    at: parentRange
  }));
  let left = 0, right = positions2.length, middle = Math.floor(right / 2);
  if (rangesAreOnSameLine(editor, Editor.range(editor, positions2[left]), parentRangeBoundary))
    return Editor.range(editor, positions2[left], parentRangeBoundary);
  if (positions2.length < 2)
    return Editor.range(editor, positions2[positions2.length - 1], parentRangeBoundary);
  for (; middle !== positions2.length && middle !== left; )
    rangesAreOnSameLine(editor, Editor.range(editor, positions2[middle]), parentRangeBoundary) ? right = middle : left = middle, middle = Math.floor((left + right) / 2);
  return Editor.range(editor, positions2[left], parentRangeBoundary);
}
function rangesAreOnSameLine(editor, range1, range2) {
  const rect1 = DOMEditor.toDOMRange(editor, range1).getBoundingClientRect(), rect2 = DOMEditor.toDOMRange(editor, range2).getBoundingClientRect();
  return domRectsIntersect(rect1, rect2) && domRectsIntersect(rect2, rect1);
}
function domRectsIntersect(rect, compareRect) {
  const middle = (compareRect.top + compareRect.bottom) / 2;
  return rect.top <= middle && rect.bottom >= middle;
}
const insertBlockOperationImplementation = ({
  context,
  operation
}) => {
  const parsedBlock = parseBlock({
    block: operation.block,
    context,
    options: {
      normalize: !0,
      removeUnusedMarkDefs: !0,
      validateFields: !0
    }
  });
  if (!parsedBlock)
    throw new Error(`Failed to parse block ${JSON.stringify(operation.block)}`);
  const block = toSlateBlock(parsedBlock, {
    schemaTypes: context.schema
  });
  insertBlock({
    context,
    block,
    placement: operation.placement,
    select: operation.select ?? "start",
    at: operation.at,
    editor: operation.editor
  });
};
function insertBlock(options) {
  const {
    context,
    block,
    placement,
    select: select2,
    editor
  } = options, at = options.at ? toSlateRange({
    context: {
      schema: context.schema,
      value: editor.value,
      selection: options.at
    },
    blockIndexMap: editor.blockIndexMap
  }) : editor.selection;
  editor.children.length === 0 && Transforms.insertNodes(editor, createPlaceholderBlock(context), {
    at: [0]
  });
  const start2 = at ? Range.start(at) : Editor.start(editor, []), end2 = at ? Range.end(at) : Editor.end(editor, []), [startBlock, startBlockPath] = Array.from(Editor.nodes(editor, {
    at: start2,
    mode: "lowest",
    match: (node3, path3) => Element$2.isElement(node3) && path3.length <= start2.path.length
  })).at(0) ?? [void 0, void 0], [endBlock, endBlockPath] = Array.from(Editor.nodes(editor, {
    at: end2,
    mode: "lowest",
    match: (node3, path3) => Element$2.isElement(node3) && path3.length <= end2.path.length
  })).at(0) ?? [void 0, void 0];
  if (!startBlock || !startBlockPath || !endBlock || !endBlockPath)
    throw new Error("Unable to insert block without a start and end block");
  if (!editor.selection && select2 !== "none" && DOMEditor.focus(editor), !at) {
    if (placement === "before")
      Transforms.insertNodes(editor, [block], {
        at: [0]
      }), select2 === "start" ? Transforms.select(editor, Editor.start(editor, [0])) : select2 === "end" && Transforms.select(editor, Editor.end(editor, [0]));
    else if (placement === "after") {
      const nextPath = Path.next(endBlockPath);
      Transforms.insertNodes(editor, [block], {
        at: nextPath
      }), select2 === "start" ? Transforms.select(editor, Editor.start(editor, nextPath)) : select2 === "end" && Transforms.select(editor, Editor.end(editor, nextPath));
    } else {
      if (isEmptyTextBlock(context, endBlock)) {
        Transforms.insertNodes(editor, [block], {
          at: endBlockPath,
          select: !1
        }), Transforms.removeNodes(editor, {
          at: Path.next(endBlockPath)
        }), Transforms.deselect(editor), select2 === "start" ? Transforms.select(editor, Editor.start(editor, endBlockPath)) : select2 === "end" && Transforms.select(editor, Editor.end(editor, endBlockPath));
        return;
      }
      if (editor.isTextBlock(block) && endBlock && editor.isTextBlock(endBlock)) {
        const selectionBefore = Editor.end(editor, endBlockPath);
        Transforms.insertFragment(editor, [block], {
          at: Editor.end(editor, endBlockPath)
        }), select2 === "start" ? Transforms.select(editor, selectionBefore) : select2 === "none" && Transforms.deselect(editor);
        return;
      }
      const nextPath = Path.next(endBlockPath);
      Transforms.insertNodes(editor, [block], {
        at: nextPath,
        select: !1
      }), select2 === "start" ? Transforms.select(editor, Editor.start(editor, nextPath)) : select2 === "end" && Transforms.select(editor, Editor.end(editor, nextPath));
    }
    return;
  }
  if (!at)
    throw new Error("Unable to insert block without a selection");
  if (placement === "before")
    Transforms.insertNodes(editor, [block], {
      at: startBlockPath,
      select: !1
    }), select2 === "start" ? Transforms.select(editor, Editor.start(editor, startBlockPath)) : select2 === "end" && Transforms.select(editor, Editor.end(editor, startBlockPath));
  else if (placement === "after") {
    const nextPath = Path.next(endBlockPath);
    Transforms.insertNodes(editor, [block], {
      at: nextPath,
      select: !1
    }), select2 === "start" ? Transforms.select(editor, Editor.start(editor, nextPath)) : select2 === "end" && Transforms.select(editor, Editor.end(editor, nextPath));
  } else {
    const endBlockEndPoint = Editor.start(editor, endBlockPath);
    if (Range.isExpanded(at) && !editor.isTextBlock(block)) {
      const atBeforeDelete = Editor.rangeRef(editor, at, {
        affinity: "inward"
      });
      Transforms.delete(editor, {
        at
      });
      const [focusBlock, focusBlockPath] = getFocusBlock({
        editor
      }), atAfterDelete = atBeforeDelete.unref() ?? editor.selection, atBeforeInsert = atAfterDelete ? Editor.rangeRef(editor, atAfterDelete, {
        affinity: "inward"
      }) : void 0;
      Transforms.insertNodes(editor, [block], {
        voids: !0,
        at: atAfterDelete ?? void 0,
        select: select2 !== "none"
      });
      const atAfterInsert = atBeforeInsert?.unref() ?? editor.selection;
      select2 === "none" && atAfterInsert && Transforms.select(editor, atAfterInsert), isEmptyTextBlock(context, focusBlock) && Transforms.removeNodes(editor, {
        at: focusBlockPath
      });
      return;
    }
    if (editor.isTextBlock(endBlock) && editor.isTextBlock(block)) {
      const selectionStartPoint = Range.start(at);
      if (isEmptyTextBlock(context, endBlock)) {
        Transforms.insertNodes(editor, [block], {
          at: endBlockPath,
          select: !1
        }), Transforms.removeNodes(editor, {
          at: Path.next(endBlockPath)
        }), select2 === "start" ? Transforms.select(editor, selectionStartPoint) : select2 === "end" ? Transforms.select(editor, Editor.end(editor, endBlockPath)) : Transforms.select(editor, at);
        return;
      }
      const endBlockChildKeys = endBlock.children.map((child) => child._key), endBlockMarkDefsKeys = endBlock.markDefs?.map((markDef) => markDef._key) ?? [], markDefKeyMap = /* @__PURE__ */ new Map(), adjustedMarkDefs = block.markDefs?.map((markDef) => {
        if (endBlockMarkDefsKeys.includes(markDef._key)) {
          const newKey = context.keyGenerator();
          return markDefKeyMap.set(markDef._key, newKey), {
            ...markDef,
            _key: newKey
          };
        }
        return markDef;
      }), adjustedChildren = block.children.map((child) => {
        if (isSpan(context, child)) {
          const marks3 = child.marks?.map((mark) => markDefKeyMap.get(mark) || mark) ?? [];
          if (!isEqual(child.marks, marks3))
            return {
              ...child,
              _key: endBlockChildKeys.includes(child._key) ? context.keyGenerator() : child._key,
              marks: marks3
            };
        }
        return endBlockChildKeys.includes(child._key) ? {
          ...child,
          _key: context.keyGenerator()
        } : child;
      });
      Transforms.setNodes(editor, {
        markDefs: [...endBlock.markDefs ?? [], ...adjustedMarkDefs ?? []]
      }, {
        at: endBlockPath
      });
      const adjustedBlock = isEqual(block.children, adjustedChildren) ? block : {
        ...block,
        children: adjustedChildren
      };
      if (select2 === "end") {
        Transforms.insertFragment(editor, [adjustedBlock], {
          voids: !0
        });
        return;
      }
      Transforms.insertFragment(editor, [adjustedBlock], {
        at,
        voids: !0
      }), select2 === "start" ? Transforms.select(editor, selectionStartPoint) : Point.equals(selectionStartPoint, endBlockEndPoint) || Transforms.select(editor, selectionStartPoint);
    } else if (editor.isTextBlock(endBlock)) {
      const endBlockStartPoint = Editor.start(editor, endBlockPath), endBlockEndPoint2 = Editor.end(editor, endBlockPath), selectionStartPoint = Range.start(at), selectionEndPoint = Range.end(at);
      if (Range.isCollapsed(at) && Point.equals(selectionStartPoint, endBlockStartPoint))
        Transforms.insertNodes(editor, [block], {
          at: endBlockPath,
          select: !1
        }), (select2 === "start" || select2 === "end") && Transforms.select(editor, Editor.start(editor, endBlockPath)), isEmptyTextBlock(context, endBlock) && Transforms.removeNodes(editor, {
          at: Path.next(endBlockPath)
        });
      else if (Range.isCollapsed(at) && Point.equals(selectionEndPoint, endBlockEndPoint2)) {
        const nextPath = [endBlockPath[0] + 1];
        Transforms.insertNodes(editor, [block], {
          at: nextPath,
          select: !1
        }), (select2 === "start" || select2 === "end") && Transforms.select(editor, Editor.start(editor, nextPath));
      } else if (Range.isExpanded(at) && Point.equals(selectionStartPoint, endBlockStartPoint) && Point.equals(selectionEndPoint, endBlockEndPoint2))
        Transforms.insertFragment(editor, [block], {
          at
        }), select2 === "start" ? Transforms.select(editor, Editor.start(editor, endBlockPath)) : select2 === "end" && Transforms.select(editor, Editor.end(editor, endBlockPath));
      else if (Range.isExpanded(at) && Point.equals(selectionStartPoint, endBlockStartPoint))
        Transforms.insertFragment(editor, [block], {
          at
        }), select2 === "start" ? Transforms.select(editor, Editor.start(editor, endBlockPath)) : select2 === "end" && Transforms.select(editor, Editor.end(editor, endBlockPath));
      else if (Range.isExpanded(at) && Point.equals(selectionEndPoint, endBlockEndPoint2))
        Transforms.insertFragment(editor, [block], {
          at
        }), select2 === "start" ? Transforms.select(editor, Editor.start(editor, Path.next(endBlockPath))) : select2 === "end" && Transforms.select(editor, Editor.end(editor, Path.next(endBlockPath)));
      else {
        const [focusChild] = getFocusChild({
          editor
        });
        if (focusChild && editor.isTextSpan(focusChild))
          Transforms.splitNodes(editor, {
            at
          }), Transforms.insertFragment(editor, [block], {
            at
          }), select2 === "start" || select2 === "end" ? Transforms.select(editor, [endBlockPath[0] + 1]) : Transforms.select(editor, at);
        else {
          const nextPath = [endBlockPath[0] + 1];
          Transforms.insertNodes(editor, [block], {
            at: nextPath,
            select: !1
          }), Transforms.select(editor, at), select2 === "start" ? Transforms.select(editor, Editor.start(editor, nextPath)) : select2 === "end" && Transforms.select(editor, Editor.end(editor, nextPath));
        }
      }
    } else {
      Transforms.insertNodes(editor, [block], {
        select: !1
      });
      const nextPath = [endBlockPath[0] + 1];
      select2 === "start" ? Transforms.select(editor, Editor.start(editor, nextPath)) : select2 === "end" && Transforms.select(editor, Editor.end(editor, nextPath));
    }
  }
}
const insertChildOperationImplementation = ({
  context,
  operation
}) => {
  const focus2 = operation.editor.selection?.focus, focusBlockIndex = focus2?.path.at(0), focusChildIndex = focus2?.path.at(1);
  if (focusBlockIndex === void 0 || focusChildIndex === void 0)
    throw new Error("Unable to insert child without a focus");
  const [focusBlock, focusBlockPath] = getFocusBlock({
    editor: operation.editor
  });
  if (!focus2 || !focusBlock || !focusBlockPath)
    throw new Error("Unable to insert child without a focus block");
  if (!isTextBlock(context, focusBlock))
    throw new Error("Unable to insert child into a non-text block");
  const markDefs = focusBlock.markDefs ?? [], markDefKeyMap = /* @__PURE__ */ new Map();
  for (const markDef of markDefs)
    markDefKeyMap.set(markDef._key, markDef._key);
  const span = parseSpan({
    span: operation.child,
    context,
    markDefKeyMap,
    options: {
      validateFields: !0
    }
  });
  if (span) {
    const [focusSpan] = getFocusSpan({
      editor: operation.editor
    });
    focusSpan ? Transforms.insertNodes(operation.editor, span, {
      at: focus2,
      select: !0
    }) : Transforms.insertNodes(operation.editor, span, {
      at: [focusBlockIndex, focusChildIndex + 1],
      select: !0
    }), EDITOR_TO_PENDING_SELECTION.set(operation.editor, operation.editor.selection);
    return;
  }
  const inlineObject = parseInlineObject({
    inlineObject: operation.child,
    context,
    options: {
      validateFields: !0
    }
  });
  if (inlineObject) {
    const {
      _key,
      _type,
      ...rest
    } = inlineObject, [focusSpan] = getFocusSpan({
      editor: operation.editor
    });
    focusSpan ? Transforms.insertNodes(operation.editor, {
      _key,
      _type,
      children: [{
        _key: VOID_CHILD_KEY,
        _type: "span",
        text: "",
        marks: []
      }],
      value: rest,
      __inline: !0
    }, {
      at: focus2,
      select: !0
    }) : Transforms.insertNodes(operation.editor, {
      _key,
      _type,
      children: [{
        _key: VOID_CHILD_KEY,
        _type: "span",
        text: "",
        marks: []
      }],
      value: rest,
      __inline: !0
    }, {
      at: [focusBlockIndex, focusChildIndex + 1],
      select: !0
    });
    return;
  }
  throw new Error("Unable to parse child");
}, insertTextOperationImplementation = ({
  operation
}) => {
  Transforms.insertText(operation.editor, operation.text);
}, moveBackwardOperationImplementation = ({
  operation
}) => {
  Transforms.move(operation.editor, {
    unit: "character",
    distance: operation.distance,
    reverse: !0
  });
}, moveBlockOperationImplementation = ({
  operation
}) => {
  const originKey = getBlockKeyFromSelectionPoint({
    path: operation.at
  });
  if (!originKey)
    throw new Error("Failed to get block key from selection point");
  const originBlockIndex = operation.editor.blockIndexMap.get(originKey);
  if (originBlockIndex === void 0)
    throw new Error("Failed to get block index from block key");
  const destinationKey = getBlockKeyFromSelectionPoint({
    path: operation.to
  });
  if (!destinationKey)
    throw new Error("Failed to get block key from selection point");
  const destinationBlockIndex = operation.editor.blockIndexMap.get(destinationKey);
  if (destinationBlockIndex === void 0)
    throw new Error("Failed to get block index from block key");
  Transforms.moveNodes(operation.editor, {
    at: [originBlockIndex],
    to: [destinationBlockIndex],
    mode: "highest"
  });
}, moveForwardOperationImplementation = ({
  operation
}) => {
  Transforms.move(operation.editor, {
    unit: "character",
    distance: operation.distance
  });
}, selectOperationImplementation = ({
  context,
  operation
}) => {
  const newSelection = toSlateRange({
    context: {
      schema: context.schema,
      value: operation.editor.value,
      selection: operation.at
    },
    blockIndexMap: operation.editor.blockIndexMap
  });
  newSelection ? Transforms.select(operation.editor, newSelection) : Transforms.deselect(operation.editor), IS_FOCUSED.get(operation.editor) && IS_READ_ONLY.get(operation.editor) && IS_FOCUSED.set(operation.editor, !1);
}, behaviorOperationImplementations = {
  "annotation.add": addAnnotationOperationImplementation,
  "annotation.remove": removeAnnotationOperationImplementation,
  "block.set": blockSetOperationImplementation,
  "block.unset": blockUnsetOperationImplementation,
  "child.set": childSetOperationImplementation,
  "child.unset": childUnsetOperationImplementation,
  "decorator.add": decoratorAddOperationImplementation,
  "decorator.remove": removeDecoratorOperationImplementation,
  delete: deleteOperationImplementation,
  "history.redo": historyRedoOperationImplementation,
  "history.undo": historyUndoOperationImplementation,
  "insert.block": insertBlockOperationImplementation,
  "insert.child": insertChildOperationImplementation,
  "insert.text": insertTextOperationImplementation,
  "move.backward": moveBackwardOperationImplementation,
  "move.block": moveBlockOperationImplementation,
  "move.forward": moveForwardOperationImplementation,
  select: selectOperationImplementation
};
function performOperation({
  context,
  operation
}) {
  Editor.withoutNormalizing(operation.editor, () => {
    try {
      switch (operation.type) {
        case "annotation.add": {
          behaviorOperationImplementations["annotation.add"]({
            context,
            operation
          });
          break;
        }
        case "annotation.remove": {
          behaviorOperationImplementations["annotation.remove"]({
            context,
            operation
          });
          break;
        }
        case "block.set": {
          behaviorOperationImplementations["block.set"]({
            context,
            operation
          });
          break;
        }
        case "block.unset": {
          behaviorOperationImplementations["block.unset"]({
            context,
            operation
          });
          break;
        }
        case "child.set": {
          behaviorOperationImplementations["child.set"]({
            context,
            operation
          });
          break;
        }
        case "child.unset": {
          behaviorOperationImplementations["child.unset"]({
            context,
            operation
          });
          break;
        }
        case "decorator.add": {
          behaviorOperationImplementations["decorator.add"]({
            context,
            operation
          });
          break;
        }
        case "decorator.remove": {
          behaviorOperationImplementations["decorator.remove"]({
            context,
            operation
          });
          break;
        }
        case "delete": {
          behaviorOperationImplementations.delete({
            context,
            operation
          });
          break;
        }
        case "history.redo": {
          behaviorOperationImplementations["history.redo"]({
            context,
            operation
          });
          break;
        }
        case "history.undo": {
          behaviorOperationImplementations["history.undo"]({
            context,
            operation
          });
          break;
        }
        case "insert.block": {
          behaviorOperationImplementations["insert.block"]({
            context,
            operation
          });
          break;
        }
        case "insert.child": {
          behaviorOperationImplementations["insert.child"]({
            context,
            operation
          });
          break;
        }
        case "insert.text": {
          behaviorOperationImplementations["insert.text"]({
            context,
            operation
          });
          break;
        }
        case "move.backward": {
          behaviorOperationImplementations["move.backward"]({
            context,
            operation
          });
          break;
        }
        case "move.block": {
          behaviorOperationImplementations["move.block"]({
            context,
            operation
          });
          break;
        }
        case "move.forward": {
          behaviorOperationImplementations["move.forward"]({
            context,
            operation
          });
          break;
        }
        default: {
          behaviorOperationImplementations.select({
            context,
            operation
          });
          break;
        }
      }
    } catch (error) {
      console.error(new Error(`Executing "${operation.type}" failed due to: ${error.message}`));
    }
  });
}
const IS_PERFORMING_OPERATION = /* @__PURE__ */ new WeakMap();
function withPerformingBehaviorOperation(editor, fn) {
  const prev = IS_PERFORMING_OPERATION.get(editor);
  IS_PERFORMING_OPERATION.set(editor, !0), fn(), IS_PERFORMING_OPERATION.set(editor, prev);
}
function isPerformingBehaviorOperation(editor) {
  return IS_PERFORMING_OPERATION.get(editor) ?? !1;
}
function createWithEventListeners(editorActor) {
  return function(editor) {
    const {
      delete: editorDelete,
      insertNodes: insertNodes3,
      select: select2
    } = editor;
    return editor.delete = (options) => {
      if (isPerformingBehaviorOperation(editor)) {
        editorDelete(options);
        return;
      }
      const range2 = options?.at ? Editor.range(editor, options.at) : void 0, selection = range2 ? slateRangeToSelection({
        schema: editorActor.getSnapshot().context.schema,
        editor,
        range: range2
      }) : void 0;
      selection ? editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "delete",
          at: selection,
          direction: options?.reverse ? "backward" : "forward",
          unit: options?.unit
        },
        editor
      }) : editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "delete",
          direction: options?.reverse ? "backward" : "forward",
          unit: options?.unit
        },
        editor
      });
    }, editor.deleteBackward = (unit) => {
      if (isPerformingBehaviorOperation(editor)) {
        console.error("Unexpected call to .deleteBackward(...)");
        return;
      }
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "delete.backward",
          unit
        },
        editor
      });
    }, editor.deleteForward = (unit) => {
      if (isPerformingBehaviorOperation(editor)) {
        console.error("Unexpected call to .deleteForward(...)");
        return;
      }
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "delete.forward",
          unit
        },
        editor
      });
    }, editor.insertBreak = () => {
      if (isPerformingBehaviorOperation(editor)) {
        console.error("Unexpected call to .insertBreak(...)");
        return;
      }
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "insert.break"
        },
        editor
      });
    }, editor.insertData = (dataTransfer) => {
      if (isPerformingBehaviorOperation(editor)) {
        console.error("Unexpected call to .insertData(...)");
        return;
      }
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "input.*",
          originEvent: {
            dataTransfer
          }
        },
        editor
      });
    }, editor.insertNodes = (nodes2, options) => {
      if (isNormalizingNode(editor)) {
        const normalizedNodes = (Node.isNode(nodes2) ? [nodes2] : nodes2).map((node3) => Text$1.isText(node3) && typeof node3._type != "string" ? {
          ...node3,
          _type: editorActor.getSnapshot().context.schema.span.name
        } : node3);
        insertNodes3(normalizedNodes, options);
        return;
      }
      insertNodes3(nodes2, options);
    }, editor.insertSoftBreak = () => {
      if (isPerformingBehaviorOperation(editor)) {
        performOperation({
          context: {
            keyGenerator: editorActor.getSnapshot().context.keyGenerator,
            schema: editorActor.getSnapshot().context.schema
          },
          operation: {
            type: "insert.text",
            text: `
`,
            editor
          }
        });
        return;
      }
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "insert.soft break"
        },
        editor
      });
    }, editor.insertText = (text) => {
      if (isPerformingBehaviorOperation(editor)) {
        performOperation({
          context: {
            keyGenerator: editorActor.getSnapshot().context.keyGenerator,
            schema: editorActor.getSnapshot().context.schema
          },
          operation: {
            type: "insert.text",
            text,
            editor
          }
        });
        return;
      }
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "insert.text",
          text
        },
        editor
      });
    }, editor.redo = () => {
      if (isPerformingBehaviorOperation(editor)) {
        performOperation({
          context: {
            keyGenerator: editorActor.getSnapshot().context.keyGenerator,
            schema: editorActor.getSnapshot().context.schema
          },
          operation: {
            type: "history.redo",
            editor
          }
        });
        return;
      }
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "history.redo"
        },
        editor
      });
    }, editor.select = (location) => {
      if (isPerformingBehaviorOperation(editor)) {
        select2(location);
        return;
      }
      const range2 = Editor.range(editor, location);
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "select",
          at: slateRangeToSelection({
            schema: editorActor.getSnapshot().context.schema,
            editor,
            range: range2
          })
        },
        editor
      });
    }, editor.setFragmentData = () => {
      console.error("Unexpected call to .setFragmentData(...)");
    }, editor.undo = () => {
      if (isPerformingBehaviorOperation(editor)) {
        performOperation({
          context: {
            keyGenerator: editorActor.getSnapshot().context.keyGenerator,
            schema: editorActor.getSnapshot().context.schema
          },
          operation: {
            type: "history.undo",
            editor
          }
        });
        return;
      }
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "history.undo"
        },
        editor
      });
    }, editor;
  };
}
function createWithObjectKeys(editorActor) {
  return function(editor) {
    const {
      apply: apply2,
      normalizeNode: normalizeNode2
    } = editor;
    return editor.apply = (operation) => {
      if (isChangingRemotely(editor)) {
        apply2(operation);
        return;
      }
      if (isUndoing(editor) || isRedoing(editor)) {
        apply2(operation);
        return;
      }
      if (operation.type === "split_node") {
        const existingKeys = [...Node.descendants(editor)].map(([node3]) => node3._key);
        apply2({
          ...operation,
          properties: {
            ...operation.properties,
            _key: operation.properties._key === void 0 || existingKeys.includes(operation.properties._key) ? editorActor.getSnapshot().context.keyGenerator() : operation.properties._key
          }
        });
        return;
      }
      if (operation.type === "insert_node" && !Editor.isEditor(operation.node)) {
        const existingKeys = [...Node.descendants(editor)].map(([node3]) => node3._key);
        apply2({
          ...operation,
          node: {
            ...operation.node,
            _key: operation.node._key === void 0 || existingKeys.includes(operation.node._key) ? editorActor.getSnapshot().context.keyGenerator() : operation.node._key
          }
        });
        return;
      }
      if (operation.type === "merge_node") {
        const index = operation.path[operation.path.length - 1], prevPath = Path.previous(operation.path), prevIndex = prevPath[prevPath.length - 1];
        if (operation.path.length !== 1 || prevPath.length !== 1) {
          apply2(operation);
          return;
        }
        const block = editor.value.at(index), previousBlock = editor.value.at(prevIndex);
        if (!block || !previousBlock) {
          apply2(operation);
          return;
        }
        if (!isTextBlock(editorActor.getSnapshot().context, block) || !isTextBlock(editorActor.getSnapshot().context, previousBlock)) {
          apply2(operation);
          return;
        }
        const previousBlockChildKeys = previousBlock.children.map((child) => child._key), previousBlockMarkDefKeys = previousBlock.markDefs?.map((markDef) => markDef._key) ?? [], markDefKeyMap = /* @__PURE__ */ new Map(), adjustedMarkDefs = block.markDefs?.map((markDef) => {
          if (previousBlockMarkDefKeys.includes(markDef._key)) {
            const newKey = editorActor.getSnapshot().context.keyGenerator();
            return markDefKeyMap.set(markDef._key, newKey), {
              ...markDef,
              _key: newKey
            };
          }
          return markDef;
        });
        let childIndex = 0;
        for (const child of block.children) {
          if (isSpan(editorActor.getSnapshot().context, child)) {
            const marks3 = child.marks?.map((mark) => markDefKeyMap.get(mark) || mark) ?? [];
            isEqual(child.marks, marks3) || Transforms.setNodes(editor, {
              marks: marks3
            }, {
              at: [index, childIndex]
            });
          }
          previousBlockChildKeys.includes(child._key) && Transforms.setNodes(editor, {
            _key: editorActor.getSnapshot().context.keyGenerator()
          }, {
            at: [index, childIndex]
          }), childIndex++;
        }
        apply2({
          ...operation,
          properties: {
            ...operation.properties,
            // Make sure the adjusted markDefs are carried along for the merge
            // operation
            markDefs: adjustedMarkDefs
          }
        });
        return;
      }
      apply2(operation);
    }, editor.normalizeNode = (entry) => {
      const [node3, path3] = entry;
      if (Element$2.isElement(node3)) {
        const [parent3] = Editor.parent(editor, path3);
        if (parent3 && Editor.isEditor(parent3)) {
          const blockKeys = /* @__PURE__ */ new Set();
          for (const sibling of parent3.children) {
            if (sibling._key && blockKeys.has(sibling._key)) {
              const _key = editorActor.getSnapshot().context.keyGenerator();
              blockKeys.add(_key), withNormalizeNode(editor, () => {
                Transforms.setNodes(editor, {
                  _key
                }, {
                  at: path3
                });
              });
              return;
            }
            if (!sibling._key) {
              const _key = editorActor.getSnapshot().context.keyGenerator();
              blockKeys.add(_key), withNormalizeNode(editor, () => {
                Transforms.setNodes(editor, {
                  _key
                }, {
                  at: path3
                });
              });
              return;
            }
            blockKeys.add(sibling._key);
          }
        }
      }
      if (Element$2.isElement(node3) && node3._type === editorActor.getSnapshot().context.schema.block.name) {
        if (!node3._key) {
          withNormalizeNode(editor, () => {
            Transforms.setNodes(editor, {
              _key: editorActor.getSnapshot().context.keyGenerator()
            }, {
              at: path3
            });
          });
          return;
        }
        const childKeys = /* @__PURE__ */ new Set();
        for (const [child, childPath] of Node.children(editor, path3)) {
          if (child._key && childKeys.has(child._key)) {
            const _key = editorActor.getSnapshot().context.keyGenerator();
            childKeys.add(_key), withNormalizeNode(editor, () => {
              Transforms.setNodes(editor, {
                _key
              }, {
                at: childPath
              });
            });
            return;
          }
          if (!child._key) {
            const _key = editorActor.getSnapshot().context.keyGenerator();
            childKeys.add(_key), withNormalizeNode(editor, () => {
              Transforms.setNodes(editor, {
                _key
              }, {
                at: childPath
              });
            });
            return;
          }
          childKeys.add(child._key);
        }
      }
      withNormalizeNode(editor, () => {
        normalizeNode2(entry);
      });
    }, editor;
  };
}
function createApplyPatch(context) {
  return (editor, patch) => {
    let changed = !1;
    try {
      switch (patch.type) {
        case "insert":
          changed = insertPatch(context, editor, patch);
          break;
        case "unset":
          changed = unsetPatch(editor, patch);
          break;
        case "set":
          changed = setPatch(editor, patch);
          break;
        case "diffMatchPatch":
          changed = diffMatchPatch(editor, patch);
          break;
      }
    } catch (err) {
      console.error(err);
    }
    return changed;
  };
}
function diffMatchPatch(editor, patch) {
  const block = findBlock(editor.children, patch.path);
  if (!block)
    return !1;
  const child = findBlockChild(block, patch.path);
  if (!child || !(block && editor.isTextBlock(block.node) && patch.path.length === 4 && patch.path[1] === "children" && patch.path[3] === "text") || !Text$1.isText(child.node))
    return !1;
  const patches = parse(patch.value), [newValue] = apply(patches, child.node.text, {
    allowExceedingIndices: !0
  }), diff$1 = cleanupEfficiency(diff(child.node.text, newValue), 5);
  let offset = 0;
  for (const [op, text] of diff$1)
    op === DIFF_INSERT ? (editor.apply({
      type: "insert_text",
      path: [block.index, child.index],
      offset,
      text
    }), offset += text.length) : op === DIFF_DELETE ? editor.apply({
      type: "remove_text",
      path: [block.index, child.index],
      offset,
      text
    }) : op === DIFF_EQUAL && (offset += text.length);
  return !0;
}
function insertPatch(context, editor, patch) {
  const block = findBlock(editor.children, patch.path);
  if (!block) {
    if (patch.path.length === 1 && patch.path[0] === 0) {
      const blocksToInsert = patch.items.map((item) => toSlateBlock(item, {
        schemaTypes: context.schema
      }, KEY_TO_SLATE_ELEMENT.get(editor)));
      return Transforms.insertNodes(editor, blocksToInsert, {
        at: [0]
      }), !0;
    }
    return !1;
  }
  if (patch.path.length > 1 && patch.path[1] !== "children")
    return !1;
  if (patch.path.length === 1) {
    const {
      items: items2,
      position: position2
    } = patch, blocksToInsert = items2.map((item) => toSlateBlock(item, {
      schemaTypes: context.schema
    }, KEY_TO_SLATE_ELEMENT.get(editor))), targetBlockIndex = block.index, normalizedIdx2 = position2 === "after" ? targetBlockIndex + 1 : targetBlockIndex, editorWasEmptyBefore = isEqualToEmptyEditor(context.initialValue, editor.value, context.schema);
    return Transforms.insertNodes(editor, blocksToInsert, {
      at: [normalizedIdx2]
    }), editorWasEmptyBefore && typeof patch.path[0] == "number" && patch.path[0] === 0 && Transforms.removeNodes(editor, {
      at: [position2 === "before" ? targetBlockIndex + blocksToInsert.length : targetBlockIndex]
    }), !0;
  }
  const {
    items,
    position
  } = patch, targetChild = findBlockChild(block, patch.path);
  if (!targetChild)
    return !1;
  const childrenToInsert = toSlateBlock({
    ...block.node,
    children: items
  }, {
    schemaTypes: context.schema
  }, KEY_TO_SLATE_ELEMENT.get(editor)), normalizedIdx = position === "after" ? targetChild.index + 1 : targetChild.index, childInsertPath = [block.index, normalizedIdx];
  return childrenToInsert && Element$2.isElement(childrenToInsert) && Transforms.insertNodes(editor, childrenToInsert.children, {
    at: childInsertPath
  }), !0;
}
function setPatch(editor, patch) {
  let value = patch.value;
  typeof patch.path[3] == "string" && (value = {}, value[patch.path[3]] = patch.value);
  const block = findBlock(editor.children, patch.path);
  if (!block)
    return !1;
  const isTextBlock2 = editor.isTextBlock(block.node);
  if (patch.path.length === 1) {
    const updatedBlock = applyAll(block.node, [{
      ...patch,
      path: patch.path.slice(1)
    }]);
    if (editor.isTextBlock(block.node) && Element$2.isElement(updatedBlock)) {
      Transforms.setNodes(editor, updatedBlock, {
        at: [block.index]
      });
      const previousSelection = editor.selection;
      for (const [_, childPath] of Editor.nodes(editor, {
        at: [block.index],
        reverse: !0,
        mode: "lowest"
      }))
        Transforms.removeNodes(editor, {
          at: childPath
        });
      return Transforms.insertNodes(editor, updatedBlock.children, {
        at: [block.index, 0]
      }), previousSelection && (Transforms.setSelection(editor, previousSelection), Transforms.select(editor, previousSelection)), !0;
    } else
      return Transforms.setNodes(editor, updatedBlock, {
        at: [block.index]
      }), !0;
  }
  if (isTextBlock2 && patch.path[1] !== "children") {
    const updatedBlock = applyAll(block.node, [{
      ...patch,
      path: patch.path.slice(1)
    }]);
    return Transforms.setNodes(editor, updatedBlock, {
      at: [block.index]
    }), !0;
  }
  const child = findBlockChild(block, patch.path);
  if (isTextBlock2 && child) {
    if (Text$1.isText(child.node))
      if (Text$1.isText(value)) {
        const oldText = child.node.text, newText = value.text;
        oldText !== newText && (editor.apply({
          type: "remove_text",
          path: [block.index, child.index],
          offset: 0,
          text: oldText
        }), editor.apply({
          type: "insert_text",
          path: [block.index, child.index],
          offset: 0,
          text: newText
        }), editor.onChange());
      } else {
        const propPath = patch.path.slice(3), propEntry = propPath.at(0);
        if (propEntry === void 0 || typeof propEntry == "string" && ["_key", "_type", "text"].includes(propEntry))
          return !1;
        const newNode = applyAll(child.node, [{
          ...patch,
          path: propPath
        }]);
        Transforms.setNodes(editor, newNode, {
          at: [block.index, child.index]
        });
      }
    else {
      const propPath = patch.path.slice(3), reservedProps = ["_key", "_type", "children", "__inline"], propEntry = propPath.at(0);
      if (propEntry === void 0 || typeof propEntry == "string" && reservedProps.includes(propEntry))
        return !1;
      const value2 = "value" in child.node && typeof child.node.value == "object" ? child.node.value : {}, newValue = applyAll(value2, [{
        ...patch,
        path: patch.path.slice(3)
      }]);
      Transforms.setNodes(editor, {
        ...child.node,
        value: newValue
      }, {
        at: [block.index, child.index]
      });
    }
    return !0;
  } else if (Element$2.isElement(block.node) && patch.path.length === 1) {
    const {
      children,
      ...nextRest
    } = value, {
      children: _prevChildren,
      ...prevRest
    } = block.node || {
      children: void 0
    };
    editor.apply({
      type: "set_node",
      path: [block.index],
      properties: {
        ...prevRest
      },
      newProperties: nextRest
    });
    const blockNode = block.node;
    blockNode.children.forEach((child2, childIndex) => {
      editor.apply({
        type: "remove_node",
        path: [block.index, blockNode.children.length - 1 - childIndex],
        node: child2
      });
    }), Array.isArray(children) && children.forEach((child2, childIndex) => {
      editor.apply({
        type: "insert_node",
        path: [block.index, childIndex],
        node: child2
      });
    });
  } else if (block && "value" in block.node)
    if (patch.path.length > 1 && patch.path[1] !== "children") {
      const newVal = applyAll(block.node.value, [{
        ...patch,
        path: patch.path.slice(1)
      }]);
      Transforms.setNodes(editor, {
        ...block.node,
        value: newVal
      }, {
        at: [block.index]
      });
    } else
      return !1;
  return !0;
}
function unsetPatch(editor, patch) {
  if (patch.path.length === 0) {
    Transforms.deselect(editor);
    const children = Node.children(editor, [], {
      reverse: !0
    });
    for (const [_, path3] of children)
      Transforms.removeNodes(editor, {
        at: path3
      });
    return !0;
  }
  const block = findBlock(editor.children, patch.path);
  if (!block)
    return !1;
  if (patch.path.length === 1)
    return Transforms.removeNodes(editor, {
      at: [block.index]
    }), !0;
  const child = findBlockChild(block, patch.path);
  if (editor.isTextBlock(block.node) && child && patch.path[1] === "children" && patch.path.length === 3)
    return Transforms.removeNodes(editor, {
      at: [block.index, child.index]
    }), !0;
  if (child && !Text$1.isText(child.node)) {
    const propEntry = patch.path.slice(3).at(0);
    if (propEntry === void 0 || typeof propEntry == "string" && ["_key", "_type", "children", "__inline"].includes(propEntry))
      return !1;
    const value = "value" in child.node && typeof child.node.value == "object" ? child.node.value : {}, newValue = applyAll(value, [{
      ...patch,
      path: patch.path.slice(3)
    }]);
    return Transforms.setNodes(editor, {
      ...child.node,
      value: newValue
    }, {
      at: [block.index, child.index]
    }), !0;
  }
  if (child && Text$1.isText(child.node)) {
    const propPath = patch.path.slice(3), propEntry = propPath.at(0);
    if (propEntry === void 0 || typeof propEntry == "string" && ["_key", "_type"].includes(propEntry))
      return !1;
    if (typeof propEntry == "string" && propEntry === "text")
      return editor.apply({
        type: "remove_text",
        path: [block.index, child.index],
        offset: 0,
        text: child.node.text
      }), !0;
    const newNode = applyAll(child.node, [{
      ...patch,
      path: propPath
    }]), newKeys = Object.keys(newNode), removedProperties = Object.keys(child.node).filter((property) => !newKeys.includes(property));
    return Transforms.unsetNodes(editor, removedProperties, {
      at: [block.index, child.index]
    }), !0;
  }
  if (!child) {
    if ("value" in block.node) {
      const newVal = applyAll(block.node.value, [{
        ...patch,
        path: patch.path.slice(1)
      }]);
      return Transforms.setNodes(editor, {
        ...block.node,
        value: newVal
      }, {
        at: [block.index]
      }), !0;
    }
    return !1;
  }
  return !1;
}
function findBlock(children, path3) {
  let blockIndex = -1;
  const block = children.find((node3, index) => {
    const isMatch = isKeyedSegment(path3[0]) ? node3._key === path3[0]._key : index === path3[0];
    return isMatch && (blockIndex = index), isMatch;
  });
  if (block)
    return {
      node: block,
      index: blockIndex
    };
}
function findBlockChild(block, path3) {
  const blockNode = block.node;
  if (!Element$2.isElement(blockNode) || path3[1] !== "children")
    return;
  let childIndex = -1;
  const child = blockNode.children.find((node3, index) => {
    const isMatch = isKeyedSegment(path3[2]) ? node3._key === path3[2]._key : index === path3[2];
    return isMatch && (childIndex = index), isMatch;
  });
  if (child)
    return {
      node: child,
      index: childIndex
    };
}
function insertTextPatch(schema, children, operation, beforeValue) {
  const block = isTextBlock({
    schema
  }, children[operation.path[0]]) && children[operation.path[0]];
  if (!block)
    throw new Error("Could not find block");
  const textChild = isTextBlock({
    schema
  }, block) && isSpan({
    schema
  }, block.children[operation.path[1]]) && block.children[operation.path[1]];
  if (!textChild)
    throw new Error("Could not find child");
  const path3 = [{
    _key: block._key
  }, "children", {
    _key: textChild._key
  }, "text"], prevBlock = beforeValue[operation.path[0]], prevChild = isTextBlock({
    schema
  }, prevBlock) && prevBlock.children[operation.path[1]], prevText = isSpan({
    schema
  }, prevChild) ? prevChild.text : "", patch = diffMatchPatch$1(prevText, textChild.text, path3);
  return patch.value.length ? [patch] : [];
}
function removeTextPatch(schema, children, operation, beforeValue) {
  const block = children[operation.path[0]];
  if (!block)
    throw new Error("Could not find block");
  const child = isTextBlock({
    schema
  }, block) && block.children[operation.path[1]] || void 0, textChild = isSpan({
    schema
  }, child) ? child : void 0;
  if (child && !textChild)
    throw new Error("Expected span");
  if (!textChild)
    throw new Error("Could not find child");
  const path3 = [{
    _key: block._key
  }, "children", {
    _key: textChild._key
  }, "text"], beforeBlock = beforeValue[operation.path[0]], prevTextChild = isTextBlock({
    schema
  }, beforeBlock) && beforeBlock.children[operation.path[1]], prevText = isSpan({
    schema
  }, prevTextChild) && prevTextChild.text, patch = diffMatchPatch$1(prevText || "", textChild.text, path3);
  return patch.value ? [patch] : [];
}
function setNodePatch(schema, children, operation) {
  const blockIndex = operation.path.at(0);
  if (blockIndex !== void 0 && operation.path.length === 1) {
    const block = children.at(blockIndex);
    if (!block)
      return console.error("Could not find block at index", blockIndex), [];
    if (isTextBlock({
      schema
    }, block)) {
      const patches = [];
      for (const key of Object.keys(operation.newProperties)) {
        const value = operation.newProperties[key];
        key === "_key" ? patches.push(set(value, [blockIndex, "_key"])) : patches.push(set(value, [{
          _key: block._key
        }, key]));
      }
      for (const key of Object.keys(operation.properties))
        key in operation.newProperties || patches.push(unset([{
          _key: block._key
        }, key]));
      return patches;
    } else {
      const patches = [], _key = operation.newProperties._key;
      _key !== void 0 && patches.push(set(_key, [blockIndex, "_key"]));
      const newValue = "value" in operation.newProperties && typeof operation.newProperties.value == "object" ? operation.newProperties.value : {}, keys = Object.keys(newValue);
      for (const key of keys) {
        const value2 = newValue[key];
        patches.push(set(value2, [{
          _key: block._key
        }, key]));
      }
      const value = "value" in operation.properties && typeof operation.properties.value == "object" ? operation.properties.value : {};
      for (const key of Object.keys(value))
        key in newValue || patches.push(unset([{
          _key: block._key
        }, key]));
      return patches;
    }
  } else if (operation.path.length === 2) {
    const block = children[operation.path[0]];
    if (isTextBlock({
      schema
    }, block)) {
      const child = block.children[operation.path[1]];
      if (child) {
        const blockKey = block._key, childKey = child._key, patches = [];
        if (Element$2.isElement(child)) {
          const _key = operation.newProperties._key;
          _key !== void 0 && patches.push(set(_key, [{
            _key: blockKey
          }, "children", block.children.indexOf(child), "_key"]));
          const properties = "value" in operation.newProperties && typeof operation.newProperties.value == "object" ? operation.newProperties.value : {}, keys = Object.keys(properties);
          for (const key of keys) {
            const value = properties[key];
            patches.push(set(value, [{
              _key: blockKey
            }, "children", {
              _key: childKey
            }, key]));
          }
          return patches;
        }
        const newPropNames = Object.keys(operation.newProperties);
        for (const keyName of newPropNames) {
          const value = operation.newProperties[keyName];
          if (keyName === "_key") {
            patches.push(set(value, [{
              _key: blockKey
            }, "children", block.children.indexOf(child), keyName]));
            continue;
          }
          patches.push(set(value, [{
            _key: blockKey
          }, "children", {
            _key: childKey
          }, keyName]));
        }
        const propNames = Object.keys(operation.properties);
        for (const keyName of propNames)
          keyName in operation.newProperties || patches.push(unset([{
            _key: blockKey
          }, "children", {
            _key: childKey
          }, keyName]));
        return patches;
      }
      throw new Error("Could not find a valid child");
    }
    throw new Error("Could not find a valid block");
  } else
    throw new Error(`Unexpected path encountered: ${JSON.stringify(operation.path)}`);
}
function insertNodePatch(schema, children, operation, beforeValue) {
  const block = beforeValue[operation.path[0]];
  if (operation.path.length === 1) {
    const position = operation.path[0] === 0 ? "before" : "after", beforeBlock = beforeValue[operation.path[0] - 1], targetKey = operation.path[0] === 0 ? block?._key : beforeBlock?._key;
    return targetKey ? [insert([fromSlateBlock(operation.node, schema.block.name)], position, [{
      _key: targetKey
    }])] : [setIfMissing(beforeValue, []), insert([fromSlateBlock(operation.node, schema.block.name)], "before", [operation.path[0]])];
  } else if (isTextBlock({
    schema
  }, block) && operation.path.length === 2 && children[operation.path[0]]) {
    const position = block.children.length === 0 || !block.children[operation.path[1] - 1] ? "before" : "after", path3 = block.children.length <= 1 || !block.children[operation.path[1] - 1] ? [{
      _key: block._key
    }, "children", 0] : [{
      _key: block._key
    }, "children", {
      _key: block.children[operation.path[1] - 1]._key
    }];
    if (Text$1.isText(operation.node))
      return [insert([operation.node], position, path3)];
    const _type = operation.node._type, _key = operation.node._key, value = "value" in operation.node && typeof operation.node.value == "object" ? operation.node.value : {};
    return [insert([{
      _type,
      _key,
      ...value
    }], position, path3)];
  }
  return [];
}
function splitNodePatch(schema, children, operation, beforeValue) {
  const patches = [], splitBlock = children[operation.path[0]];
  if (!isTextBlock({
    schema
  }, splitBlock))
    throw new Error(`Block with path ${JSON.stringify(operation.path[0])} is not a text block and can't be split`);
  if (operation.path.length === 1) {
    const oldBlock = beforeValue[operation.path[0]];
    if (isTextBlock({
      schema
    }, oldBlock)) {
      const targetValue = fromSlateBlock(children[operation.path[0] + 1], schema.block.name);
      targetValue && (patches.push(insert([targetValue], "after", [{
        _key: splitBlock._key
      }])), oldBlock.children.slice(operation.position).forEach((span) => {
        const path3 = [{
          _key: oldBlock._key
        }, "children", {
          _key: span._key
        }];
        patches.push(unset(path3));
      }));
    }
    return patches;
  }
  if (operation.path.length === 2) {
    const splitSpan = splitBlock.children[operation.path[1]];
    if (isSpan({
      schema
    }, splitSpan)) {
      const targetSpans = fromSlateBlock({
        ...splitBlock,
        children: splitBlock.children.slice(operation.path[1] + 1, operation.path[1] + 2)
      }, schema.block.name).children;
      patches.push(insert(targetSpans, "after", [{
        _key: splitBlock._key
      }, "children", {
        _key: splitSpan._key
      }])), patches.push(set(splitSpan.text, [{
        _key: splitBlock._key
      }, "children", {
        _key: splitSpan._key
      }, "text"]));
    }
    return patches;
  }
  return patches;
}
function removeNodePatch(schema, beforeValue, operation) {
  const block = beforeValue[operation.path[0]];
  if (operation.path.length === 1) {
    if (block && block._key)
      return [unset([{
        _key: block._key
      }])];
    throw new Error("Block not found");
  } else if (isTextBlock({
    schema
  }, block) && operation.path.length === 2) {
    const spanToRemove = block.children[operation.path[1]];
    return spanToRemove ? block.children.filter((span) => span._key === operation.node._key).length > 1 ? (console.warn(`Multiple spans have \`_key\` ${operation.node._key}. It's ambiguous which one to remove.`, JSON.stringify(block, null, 2)), []) : [unset([{
      _key: block._key
    }, "children", {
      _key: spanToRemove._key
    }])] : [];
  } else
    return [];
}
function mergeNodePatch(schema, children, operation, beforeValue) {
  const patches = [], block = beforeValue[operation.path[0]], updatedBlock = children[operation.path[0]];
  if (operation.path.length === 1)
    if (block?._key) {
      const newBlock = fromSlateBlock(children[operation.path[0] - 1], schema.block.name);
      patches.push(set(newBlock, [{
        _key: newBlock._key
      }])), patches.push(unset([{
        _key: block._key
      }]));
    } else
      throw new Error("Target key not found!");
  else if (isTextBlock({
    schema
  }, block) && isTextBlock({
    schema
  }, updatedBlock) && operation.path.length === 2) {
    const updatedSpan = updatedBlock.children[operation.path[1] - 1] && isSpan({
      schema
    }, updatedBlock.children[operation.path[1] - 1]) ? updatedBlock.children[operation.path[1] - 1] : void 0, removedSpan = block.children[operation.path[1]] && isSpan({
      schema
    }, block.children[operation.path[1]]) ? block.children[operation.path[1]] : void 0;
    updatedSpan && (block.children.filter((span) => span._key === updatedSpan._key).length === 1 ? patches.push(set(updatedSpan.text, [{
      _key: block._key
    }, "children", {
      _key: updatedSpan._key
    }, "text"])) : console.warn(`Multiple spans have \`_key\` ${updatedSpan._key}. It's ambiguous which one to update.`, JSON.stringify(block, null, 2))), removedSpan && (block.children.filter((span) => span._key === removedSpan._key).length === 1 ? patches.push(unset([{
      _key: block._key
    }, "children", {
      _key: removedSpan._key
    }])) : console.warn(`Multiple spans have \`_key\` ${removedSpan._key}. It's ambiguous which one to remove.`, JSON.stringify(block, null, 2)));
  }
  return patches;
}
function moveNodePatch(schema, beforeValue, operation) {
  const patches = [], block = beforeValue[operation.path[0]], targetBlock = beforeValue[operation.newPath[0]];
  if (!targetBlock)
    return patches;
  if (operation.path.length === 1) {
    const position = operation.path[0] > operation.newPath[0] ? "before" : "after";
    patches.push(unset([{
      _key: block._key
    }])), patches.push(insert([block], position, [{
      _key: targetBlock._key
    }]));
  } else if (operation.path.length === 2 && isTextBlock({
    schema
  }, block) && isTextBlock({
    schema
  }, targetBlock)) {
    const child = block.children[operation.path[1]], targetChild = targetBlock.children[operation.newPath[1]], position = operation.newPath[1] === targetBlock.children.length ? "after" : "before", childToInsert = block.children[operation.path[1]];
    patches.push(unset([{
      _key: block._key
    }, "children", {
      _key: child._key
    }])), patches.push(insert([childToInsert], position, [{
      _key: targetBlock._key
    }, "children", {
      _key: targetChild._key
    }]));
  }
  return patches;
}
const debug$8 = debugWithName("plugin:withPatches");
function createWithPatches({
  editorActor,
  relayActor,
  subscriptions
}) {
  let previousValue;
  const applyPatch = createApplyPatch(editorActor.getSnapshot().context);
  return function(editor) {
    IS_PROCESSING_REMOTE_CHANGES.set(editor, !1), PATCHING.set(editor, !0), previousValue = [...editor.value];
    const {
      apply: apply2
    } = editor;
    let bufferedPatches = [];
    const handleBufferedRemotePatches = () => {
      if (bufferedPatches.length === 0)
        return;
      const patches = bufferedPatches;
      bufferedPatches = [];
      let changed = !1;
      withRemoteChanges(editor, () => {
        Editor.withoutNormalizing(editor, () => {
          withoutPatching(editor, () => {
            pluginWithoutHistory(editor, () => {
              for (const patch of patches) {
                debug$8.enabled && debug$8(`Handling remote patch ${JSON.stringify(patch)}`);
                try {
                  changed = applyPatch(editor, patch);
                } catch (error) {
                  console.error(`Applying patch ${JSON.stringify(patch)} failed due to: ${error.message}`);
                }
              }
            });
          });
        }), changed && (editor.normalize(), editor.onChange());
      });
    }, handlePatches = ({
      patches
    }) => {
      const remotePatches = patches.filter((p) => p.origin !== "local");
      remotePatches.length !== 0 && (bufferedPatches = bufferedPatches.concat(remotePatches), handleBufferedRemotePatches());
    };
    return subscriptions.push(() => {
      debug$8("Subscribing to remote patches");
      const sub = editorActor.on("patches", handlePatches);
      return () => {
        debug$8("Unsubscribing to remote patches"), sub.unsubscribe();
      };
    }), editor.apply = (operation) => {
      let patches = [];
      previousValue = editor.value;
      const editorWasEmpty = isEqualToEmptyEditor(editorActor.getSnapshot().context.initialValue, previousValue, editorActor.getSnapshot().context.schema);
      apply2(operation);
      const editorIsEmpty = isEqualToEmptyEditor(editorActor.getSnapshot().context.initialValue, editor.value, editorActor.getSnapshot().context.schema);
      if (!isPatching(editor))
        return editor;
      switch (editorWasEmpty && !editorIsEmpty && operation.type !== "set_selection" && patches.push(insert(previousValue, "before", [0])), operation.type) {
        case "insert_text":
          patches = [...patches, ...insertTextPatch(editorActor.getSnapshot().context.schema, editor.children, operation, previousValue)];
          break;
        case "remove_text":
          patches = [...patches, ...removeTextPatch(editorActor.getSnapshot().context.schema, editor.children, operation, previousValue)];
          break;
        case "remove_node":
          patches = [...patches, ...removeNodePatch(editorActor.getSnapshot().context.schema, previousValue, operation)];
          break;
        case "split_node":
          patches = [...patches, ...splitNodePatch(editorActor.getSnapshot().context.schema, editor.children, operation, previousValue)];
          break;
        case "insert_node":
          patches = [...patches, ...insertNodePatch(editorActor.getSnapshot().context.schema, editor.children, operation, previousValue)];
          break;
        case "set_node":
          patches = [...patches, ...setNodePatch(editorActor.getSnapshot().context.schema, editor.children, operation)];
          break;
        case "merge_node":
          patches = [...patches, ...mergeNodePatch(editorActor.getSnapshot().context.schema, editor.children, operation, previousValue)];
          break;
        case "move_node":
          patches = [...patches, ...moveNodePatch(editorActor.getSnapshot().context.schema, previousValue, operation)];
          break;
      }
      if (!editorWasEmpty && editorIsEmpty && ["merge_node", "set_node", "remove_text", "remove_node"].includes(operation.type) && (patches = [...patches, unset([])], relayActor.send({
        type: "unset",
        previousValue
      })), editorWasEmpty && patches.length > 0 && (patches = [setIfMissing([], []), ...patches]), patches.length > 0)
        for (const patch of patches)
          editorActor.send({
            type: "internal.patch",
            patch: {
              ...patch,
              origin: "local"
            },
            operationId: getCurrentUndoStepId(editor),
            value: editor.value
          });
      return editor;
    }, editor;
  };
}
const debug$7 = debugWithName("plugin:withSchemaTypes");
function createWithSchemaTypes({
  editorActor
}) {
  return function(editor) {
    editor.isTextBlock = (value) => Editor.isEditor(value) ? !1 : isTextBlock(editorActor.getSnapshot().context, value), editor.isTextSpan = (value) => Editor.isEditor(value) ? !1 : isSpan(editorActor.getSnapshot().context, value), editor.isListBlock = (value) => Editor.isEditor(value) ? !1 : isListBlock(editorActor.getSnapshot().context, value), editor.isVoid = (element) => Editor.isEditor(element) ? !1 : editorActor.getSnapshot().context.schema.block.name !== element._type && (editorActor.getSnapshot().context.schema.blockObjects.map((obj) => obj.name).includes(element._type) || editorActor.getSnapshot().context.schema.inlineObjects.map((obj) => obj.name).includes(element._type)), editor.isInline = (element) => Editor.isEditor(element) ? !1 : editorActor.getSnapshot().context.schema.inlineObjects.map((obj) => obj.name).includes(element._type) && "__inline" in element && element.__inline === !0;
    const {
      normalizeNode: normalizeNode2
    } = editor;
    return editor.normalizeNode = (entry) => {
      const [node3, path3] = entry;
      if (node3._type === void 0 && path3.length === 2) {
        debug$7("Setting span type on text node without a type");
        const span = node3, key = span._key || editorActor.getSnapshot().context.keyGenerator();
        withNormalizeNode(editor, () => {
          Transforms.setNodes(editor, {
            ...span,
            _type: editorActor.getSnapshot().context.schema.span.name,
            _key: key
          }, {
            at: path3
          });
        });
        return;
      }
      if (node3._key === void 0 && (path3.length === 1 || path3.length === 2)) {
        debug$7("Setting missing key on child node without a key");
        const key = editorActor.getSnapshot().context.keyGenerator();
        withNormalizeNode(editor, () => {
          Transforms.setNodes(editor, {
            _key: key
          }, {
            at: path3
          });
        });
        return;
      }
      withNormalizeNode(editor, () => {
        normalizeNode2(entry);
      });
    }, editor;
  };
}
function pluginUpdateSelection({
  editor,
  editorActor
}) {
  const updateSelection = () => {
    if (editor.selection) {
      const existingSelection = SLATE_TO_PORTABLE_TEXT_RANGE.get(editor.selection);
      if (existingSelection)
        editorActor.send({
          type: "update selection",
          selection: existingSelection
        });
      else {
        const selection = slateRangeToSelection({
          schema: editorActor.getSnapshot().context.schema,
          editor,
          range: editor.selection
        });
        SLATE_TO_PORTABLE_TEXT_RANGE.set(editor.selection, selection), editorActor.send({
          type: "update selection",
          selection
        });
      }
    } else
      editorActor.send({
        type: "update selection",
        selection: null
      });
  }, {
    onChange
  } = editor;
  return editor.onChange = () => {
    onChange(), editorActor.getSnapshot().matches({
      setup: "setting up"
    }) || updateSelection();
  }, editor;
}
function isEditorNode(node3) {
  return typeof node3 == "object" && node3 !== null ? !("_type" in node3) && "children" in node3 && Array.isArray(node3.children) : !1;
}
function isTextBlockNode(context, node3) {
  return isTypedObject(node3) && node3._type === context.schema.block.name;
}
function isSpanNode(context, node3) {
  return typeof node3 != "object" || node3 === null || "children" in node3 ? !1 : "_type" in node3 ? node3._type === context.schema.span.name : "text" in node3;
}
function isPartialSpanNode(node3) {
  return typeof node3 == "object" && node3 !== null && "text" in node3 && typeof node3.text == "string";
}
function isObjectNode(context, node3) {
  return !isEditorNode(node3) && !isTextBlockNode(context, node3) && !isSpanNode(context, node3) && !isPartialSpanNode(node3);
}
function getBlock(root, path3) {
  const index = path3.at(0);
  if (!(index === void 0 || path3.length !== 1))
    return root.children.at(index);
}
function getNode(context, root, path3) {
  if (path3.length === 0)
    return root;
  if (path3.length === 1)
    return getBlock(root, path3);
  if (path3.length === 2) {
    const block = getBlock(root, path3.slice(0, 1));
    return !block || !isTextBlockNode(context, block) ? void 0 : block.children.at(path3[1]) || void 0;
  }
}
function getSpan(context, root, path3) {
  const node3 = getNode(context, root, path3);
  if (node3 && isSpanNode(context, node3))
    return node3;
}
function getParent(context, root, path3) {
  if (path3.length === 0)
    return;
  const parentPath = path3.slice(0, -1);
  if (parentPath.length === 0)
    return root;
  const blockIndex = parentPath.at(0);
  if (blockIndex === void 0 || parentPath.length !== 1)
    return;
  const block = root.children.at(blockIndex);
  if (block && isTextBlockNode(context, block))
    return block;
}
function applyOperationToPortableText(context, value, operation) {
  const root = {
    children: value
  };
  try {
    return applyOperationToPortableTextImmutable(context, root, operation).children;
  } catch (e2) {
    return console.error(e2), value;
  }
}
function applyOperationToPortableTextImmutable(context, root, operation) {
  switch (operation.type) {
    case "insert_node": {
      const {
        path: path3,
        node: insertedNode
      } = operation, parent3 = getParent(context, root, path3), index = path3[path3.length - 1];
      if (!parent3 || index > parent3.children.length)
        return root;
      if (path3.length === 1) {
        if (isTextBlockNode(context, insertedNode)) {
          const newBlock = {
            ...insertedNode,
            children: insertedNode.children.map((child) => "__inline" in child ? {
              _key: child._key,
              _type: child._type,
              ..."value" in child && typeof child.value == "object" ? child.value : {}
            } : child)
          };
          return {
            ...root,
            children: insertChildren2(root.children, index, newBlock)
          };
        }
        if (Element$2.isElement(insertedNode) && !("__inline" in insertedNode)) {
          const newBlock = {
            _key: insertedNode._key,
            _type: insertedNode._type,
            ..."value" in insertedNode && typeof insertedNode.value == "object" ? insertedNode.value : {}
          };
          return {
            ...root,
            children: insertChildren2(root.children, index, newBlock)
          };
        }
      }
      if (path3.length === 2) {
        const blockIndex = path3[0];
        if (!isTextBlockNode(context, parent3))
          return root;
        let newChild;
        if (isPartialSpanNode(insertedNode))
          newChild = insertedNode;
        else if ("__inline" in insertedNode)
          newChild = {
            _key: insertedNode._key,
            _type: insertedNode._type,
            ..."value" in insertedNode && typeof insertedNode.value == "object" ? insertedNode.value : {}
          };
        else
          return root;
        return updateTextBlockAtIndex(context, root, blockIndex, (block) => ({
          ...block,
          children: insertChildren2(block.children, index, newChild)
        }));
      }
      return root;
    }
    case "insert_text": {
      const {
        path: path3,
        offset,
        text
      } = operation;
      if (text.length === 0)
        return root;
      const span = getSpan(context, root, path3);
      if (!span)
        return root;
      const blockIndex = path3[0], childIndex = path3[1], before3 = span.text.slice(0, offset), after3 = span.text.slice(offset), newSpan = {
        ...span,
        text: before3 + text + after3
      };
      return updateTextBlockAtIndex(context, root, blockIndex, (block) => ({
        ...block,
        children: replaceChild(block.children, childIndex, newSpan)
      }));
    }
    case "merge_node": {
      const {
        path: path3
      } = operation;
      if (path3.at(-1) === 0)
        return root;
      const node3 = getNode(context, root, path3), prevPath = Path.previous(path3), prev = getNode(context, root, prevPath), parent3 = getParent(context, root, path3);
      if (!node3 || !prev || !parent3)
        return root;
      const index = path3[path3.length - 1];
      if (isPartialSpanNode(node3) && isPartialSpanNode(prev)) {
        const blockIndex = path3[0], newPrev = {
          ...prev,
          text: prev.text + node3.text
        };
        return updateTextBlockAtIndex(context, root, blockIndex, (block) => {
          const newChildren = replaceChild(block.children, index - 1, newPrev);
          return {
            ...block,
            children: removeChildren(newChildren, index)
          };
        });
      }
      if (isTextBlockNode(context, node3) && isTextBlockNode(context, prev)) {
        const newPrev = {
          ...prev,
          children: [...prev.children, ...node3.children]
        }, newChildren = replaceChild(root.children, index - 1, newPrev);
        return {
          ...root,
          children: removeChildren(newChildren, index)
        };
      }
      return root;
    }
    case "move_node": {
      const {
        path: path3,
        newPath
      } = operation;
      if (Path.isAncestor(path3, newPath))
        return root;
      const node3 = getNode(context, root, path3), parent3 = getParent(context, root, path3), index = path3[path3.length - 1];
      if (!node3 || !parent3)
        return root;
      let newRoot;
      if (path3.length === 1)
        newRoot = {
          ...root,
          children: removeChildren(root.children, index)
        };
      else if (path3.length === 2) {
        const blockIndex = path3[0];
        newRoot = updateTextBlockAtIndex(context, root, blockIndex, (block) => ({
          ...block,
          children: removeChildren(block.children, index)
        }));
      } else
        return root;
      const truePath = Path.transform(path3, operation), newIndex = truePath[truePath.length - 1];
      if (truePath.length === 1)
        return {
          ...newRoot,
          children: insertChildren2(newRoot.children, newIndex, node3)
        };
      if (truePath.length === 2) {
        const newBlockIndex = truePath[0], newParent = newRoot.children[newBlockIndex];
        return !newParent || !isTextBlockNode(context, newParent) ? root : updateTextBlockAtIndex(context, newRoot, newBlockIndex, (block) => ({
          ...block,
          children: insertChildren2(block.children, newIndex, node3)
        }));
      }
      return root;
    }
    case "remove_node": {
      const {
        path: path3
      } = operation, index = path3[path3.length - 1];
      if (!getParent(context, root, path3))
        return root;
      if (path3.length === 1)
        return {
          ...root,
          children: removeChildren(root.children, index)
        };
      if (path3.length === 2) {
        const blockIndex = path3[0];
        return updateTextBlockAtIndex(context, root, blockIndex, (block) => ({
          ...block,
          children: removeChildren(block.children, index)
        }));
      }
      return root;
    }
    case "remove_text": {
      const {
        path: path3,
        offset,
        text
      } = operation;
      if (text.length === 0)
        return root;
      const span = getSpan(context, root, path3);
      if (!span)
        return root;
      const blockIndex = path3[0], childIndex = path3[1], before3 = span.text.slice(0, offset), after3 = span.text.slice(offset + text.length), newSpan = {
        ...span,
        text: before3 + after3
      };
      return updateTextBlockAtIndex(context, root, blockIndex, (block) => ({
        ...block,
        children: replaceChild(block.children, childIndex, newSpan)
      }));
    }
    case "set_node": {
      const {
        path: path3,
        properties,
        newProperties
      } = operation, node3 = getNode(context, root, path3);
      if (!node3 || isEditorNode(node3))
        return root;
      if (isObjectNode(context, node3)) {
        const valueBefore = "value" in properties && typeof properties.value == "object" ? properties.value : {}, valueAfter = "value" in newProperties && typeof newProperties.value == "object" ? newProperties.value : {}, newNode = {
          ...node3
        };
        for (const key in newProperties) {
          if (key === "value")
            continue;
          const value = newProperties[key];
          value == null ? delete newNode[key] : newNode[key] = value;
        }
        for (const key in properties)
          key !== "value" && (newProperties.hasOwnProperty(key) || delete newNode[key]);
        for (const key in valueAfter) {
          const value = valueAfter[key];
          value == null ? delete newNode[key] : newNode[key] = value;
        }
        for (const key in valueBefore)
          valueAfter.hasOwnProperty(key) || delete newNode[key];
        return path3.length === 1 ? {
          ...root,
          children: replaceChild(root.children, path3[0], newNode)
        } : path3.length === 2 ? updateTextBlockAtIndex(context, root, path3[0], (block) => ({
          ...block,
          children: replaceChild(block.children, path3[1], newNode)
        })) : root;
      }
      if (isTextBlockNode(context, node3)) {
        const newNode = {
          ...node3
        };
        for (const key in newProperties) {
          if (key === "children" || key === "text")
            continue;
          const value = newProperties[key];
          value == null ? delete newNode[key] : newNode[key] = value;
        }
        for (const key in properties)
          newProperties.hasOwnProperty(key) || delete newNode[key];
        return {
          ...root,
          children: replaceChild(root.children, path3[0], newNode)
        };
      }
      if (isPartialSpanNode(node3)) {
        const newNode = {
          ...node3
        };
        for (const key in newProperties) {
          if (key === "text")
            continue;
          const value = newProperties[key];
          value == null ? delete newNode[key] : newNode[key] = value;
        }
        for (const key in properties)
          newProperties.hasOwnProperty(key) || delete newNode[key];
        return updateTextBlockAtIndex(context, root, path3[0], (block) => ({
          ...block,
          children: replaceChild(block.children, path3[1], newNode)
        }));
      }
      return root;
    }
    case "split_node": {
      const {
        path: path3,
        position,
        properties
      } = operation;
      if (path3.length === 0)
        return root;
      const parent3 = getParent(context, root, path3), index = path3[path3.length - 1];
      if (!parent3)
        return root;
      if (isEditorNode(parent3)) {
        const block = getBlock(root, path3);
        if (!block || !isTextBlockNode(context, block))
          return root;
        const before3 = block.children.slice(0, position), after3 = block.children.slice(position), updatedTextBlockNode = {
          ...block,
          children: before3
        }, newTextBlockNode = {
          ...properties,
          children: after3,
          _type: context.schema.block.name
        };
        return {
          ...root,
          children: insertChildren2(replaceChild(root.children, index, updatedTextBlockNode), index + 1, newTextBlockNode)
        };
      }
      if (isTextBlockNode(context, parent3)) {
        const node3 = getNode(context, root, path3);
        if (!node3 || !isSpanNode(context, node3))
          return root;
        const blockIndex = path3[0], before3 = node3.text.slice(0, position), after3 = node3.text.slice(position), updatedSpanNode = {
          ...node3,
          text: before3
        }, newSpanNode = {
          ...properties,
          text: after3
        };
        return updateTextBlockAtIndex(context, root, blockIndex, (block) => ({
          ...block,
          children: insertChildren2(replaceChild(block.children, index, updatedSpanNode), index + 1, newSpanNode)
        }));
      }
      return root;
    }
  }
}
function insertChildren2(children, index, ...nodes2) {
  return [...children.slice(0, index), ...nodes2, ...children.slice(index)];
}
function removeChildren(children, index, count = 1) {
  return [...children.slice(0, index), ...children.slice(index + count)];
}
function replaceChild(children, index, newChild) {
  return [...children.slice(0, index), newChild, ...children.slice(index + 1)];
}
function updateTextBlockAtIndex(context, root, blockIndex, updater) {
  const block = root.children.at(blockIndex);
  if (!block || !isTextBlockNode(context, block))
    return root;
  const newBlock = updater(block);
  return {
    ...root,
    children: replaceChild(root.children, blockIndex, newBlock)
  };
}
function pluginUpdateValue(context, editor) {
  const {
    apply: apply2
  } = editor;
  return editor.apply = (operation) => {
    if (operation.type === "set_selection") {
      apply2(operation);
      return;
    }
    if (editor.value = applyOperationToPortableText(context, editor.value, operation), operation.type === "insert_text" || operation.type === "remove_text") {
      apply2(operation);
      return;
    }
    buildIndexMaps({
      schema: context.schema,
      value: editor.value
    }, {
      blockIndexMap: editor.blockIndexMap,
      listIndexMap: editor.listIndexMap
    }), apply2(operation);
  }, editor;
}
const withPlugins = (editor, options) => {
  const e2 = editor, {
    editorActor,
    relayActor
  } = options, withObjectKeys = createWithObjectKeys(editorActor), withSchemaTypes = createWithSchemaTypes({
    editorActor
  }), withPatches = createWithPatches({
    editorActor,
    relayActor,
    subscriptions: options.subscriptions
  }), withUndoRedo = pluginHistory({
    editorActor,
    subscriptions: options.subscriptions
  }), withPortableTextMarkModel = createWithPortableTextMarkModel(editorActor);
  return createWithEventListeners(editorActor)(withSchemaTypes(withObjectKeys(withPortableTextMarkModel(withUndoRedo(withPatches(pluginUpdateValue(editorActor.getSnapshot().context, pluginUpdateSelection({
    editorActor,
    editor: e2
  }))))))));
}, debug$6 = debugWithName("setup");
function createSlateEditor(config) {
  debug$6("Creating new Slate editor instance");
  const placeholderBlock = createPlaceholderBlock(config.editorActor.getSnapshot().context), editor = createEditor();
  editor.decoratedRanges = [], editor.decoratorState = {}, editor.value = [placeholderBlock], editor.blockIndexMap = /* @__PURE__ */ new Map(), editor.listIndexMap = /* @__PURE__ */ new Map();
  const instance = withPlugins(withReact(editor), {
    editorActor: config.editorActor,
    relayActor: config.relayActor,
    subscriptions: config.subscriptions
  });
  return KEY_TO_SLATE_ELEMENT.set(instance, {}), buildIndexMaps({
    schema: config.editorActor.getSnapshot().context.schema,
    value: instance.value
  }, {
    blockIndexMap: instance.blockIndexMap,
    listIndexMap: instance.listIndexMap
  }), {
    instance,
    initialValue: [placeholderBlock]
  };
}
function createEditorDom(sendBack, slateEditor) {
  return {
    getBlockNodes: (snapshot) => getBlockNodes(slateEditor, snapshot),
    getChildNodes: (snapshot) => getChildNodes(slateEditor, snapshot),
    getEditorElement: () => getEditorElement(slateEditor),
    getSelectionRect: (snapshot) => getSelectionRect(snapshot),
    getStartBlockElement: (snapshot) => getStartBlockElement(slateEditor, snapshot),
    getEndBlockElement: (snapshot) => getEndBlockElement(slateEditor, snapshot),
    setDragGhost: ({
      event,
      ghost
    }) => setDragGhost({
      sendBack,
      event,
      ghost
    })
  };
}
function getBlockNodes(slateEditor, snapshot) {
  if (!snapshot.context.selection)
    return [];
  const range2 = toSlateRange(snapshot);
  if (!range2)
    return [];
  try {
    return Array.from(Editor.nodes(slateEditor, {
      at: range2,
      mode: "highest",
      match: (n2) => !Editor.isEditor(n2)
    })).map(([blockNode]) => DOMEditor.toDOMNode(slateEditor, blockNode));
  } catch {
    return [];
  }
}
function getChildNodes(slateEditor, snapshot) {
  if (!snapshot.context.selection)
    return [];
  const range2 = toSlateRange(snapshot);
  if (!range2)
    return [];
  try {
    return Array.from(Editor.nodes(slateEditor, {
      at: range2,
      mode: "lowest",
      match: (n2) => !Editor.isEditor(n2)
    })).map(([childNode]) => DOMEditor.toDOMNode(slateEditor, childNode));
  } catch {
    return [];
  }
}
function getEditorElement(slateEditor) {
  try {
    return DOMEditor.toDOMNode(slateEditor, slateEditor);
  } catch {
    return;
  }
}
function getSelectionRect(snapshot) {
  if (!snapshot.context.selection)
    return null;
  try {
    const selection = window.getSelection();
    return selection ? selection.getRangeAt(0).getBoundingClientRect() : null;
  } catch {
    return null;
  }
}
function getStartBlockElement(slateEditor, snapshot) {
  const startBlock = getSelectionStartBlock(snapshot);
  if (!startBlock)
    return null;
  const startBlockNode = getBlockNodes(slateEditor, {
    ...snapshot,
    context: {
      ...snapshot.context,
      selection: {
        anchor: {
          path: startBlock.path,
          offset: 0
        },
        focus: {
          path: startBlock.path,
          offset: 0
        }
      }
    }
  })?.at(0);
  return startBlockNode && startBlockNode instanceof Element ? startBlockNode : null;
}
function getEndBlockElement(slateEditor, snapshot) {
  const endBlock = getSelectionEndBlock(snapshot);
  if (!endBlock)
    return null;
  const endBlockNode = getBlockNodes(slateEditor, {
    ...snapshot,
    context: {
      ...snapshot.context,
      selection: {
        anchor: {
          path: endBlock.path,
          offset: 0
        },
        focus: {
          path: endBlock.path,
          offset: 0
        }
      }
    }
  })?.at(0);
  return endBlockNode && endBlockNode instanceof Element ? endBlockNode : null;
}
function setDragGhost({
  sendBack,
  event,
  ghost
}) {
  event.originEvent.dataTransfer.setDragImage(ghost.element, ghost.x, ghost.y), sendBack({
    type: "set drag ghost",
    ghost: ghost.element
  });
}
const addAnnotationOnCollapsedSelection = defineBehavior({
  on: "annotation.add",
  guard: ({
    snapshot
  }) => {
    if (!isSelectionCollapsed$1(snapshot))
      return !1;
    const caretWordSelection = getCaretWordSelection(snapshot);
    return !caretWordSelection || !isSelectionExpanded({
      context: {
        ...snapshot.context,
        selection: caretWordSelection
      }
    }) ? !1 : {
      caretWordSelection
    };
  },
  actions: [({
    event
  }, {
    caretWordSelection
  }) => [raise({
    type: "select",
    at: caretWordSelection
  }), raise({
    type: "annotation.add",
    annotation: event.annotation
  })]]
}), preventOverlappingAnnotations = defineBehavior({
  // Given an `annotation.add` event
  on: "annotation.add",
  // When the annotation is active in the selection
  guard: ({
    snapshot,
    event
  }) => isActiveAnnotation(event.annotation.name, {
    mode: "partial"
  })(snapshot),
  // Then the existing annotation is removed
  actions: [({
    event
  }) => [raise({
    type: "annotation.remove",
    annotation: event.annotation
  }), raise(event)]]
}), coreAnnotationBehaviors = [addAnnotationOnCollapsedSelection, preventOverlappingAnnotations], defaultKeyboardShortcuts = {
  arrowDown: createKeyboardShortcut({
    default: [{
      key: "ArrowDown",
      alt: !1,
      ctrl: !1,
      meta: !1,
      shift: !1
    }]
  }),
  arrowUp: createKeyboardShortcut({
    default: [{
      key: "ArrowUp",
      alt: !1,
      ctrl: !1,
      meta: !1,
      shift: !1
    }]
  }),
  backspace: createKeyboardShortcut({
    default: [{
      key: "Backspace",
      alt: !1,
      ctrl: !1,
      meta: !1,
      shift: !1
    }]
  }),
  break: createKeyboardShortcut({
    default: [{
      key: "Enter",
      shift: !1
    }]
  }),
  lineBreak: createKeyboardShortcut({
    default: [{
      key: "Enter",
      shift: !0
    }]
  }),
  decorators: {
    strong: bold,
    em: italic,
    underline,
    code
  },
  delete: createKeyboardShortcut({
    default: [{
      key: "Delete",
      alt: !1,
      ctrl: !1,
      meta: !1,
      shift: !1
    }]
  }),
  deleteWord: {
    backward: createKeyboardShortcut({
      default: [{
        key: "Backspace",
        alt: !1,
        ctrl: !0,
        meta: !1
        // shift is optional
      }],
      apple: [{
        key: "Backspace",
        alt: !0,
        ctrl: !1,
        meta: !1
        // shift is optional
      }]
    }),
    forward: createKeyboardShortcut({
      default: [{
        key: "Delete",
        alt: !1,
        ctrl: !0,
        meta: !1
        // shift is optional
      }],
      apple: [{
        key: "Delete",
        alt: !0,
        ctrl: !1,
        meta: !1
        // shift is optional
      }]
    })
  },
  history: {
    undo,
    redo
  },
  tab: createKeyboardShortcut({
    default: [{
      key: "Tab",
      alt: !1,
      ctrl: !1,
      meta: !1,
      shift: !1
    }]
  }),
  shiftTab: createKeyboardShortcut({
    default: [{
      key: "Tab",
      alt: !1,
      ctrl: !1,
      meta: !1,
      shift: !0
    }]
  })
}, arrowDownOnLonelyBlockObject = defineBehavior({
  on: "keyboard.keydown",
  guard: ({
    snapshot,
    event
  }) => {
    if (!defaultKeyboardShortcuts.arrowDown.guard(event.originEvent) || !isSelectionCollapsed$1(snapshot))
      return !1;
    const focusBlockObject = getFocusBlockObject(snapshot), nextBlock = getNextBlock(snapshot);
    return focusBlockObject && !nextBlock;
  },
  actions: [({
    snapshot
  }) => [raise({
    type: "insert.block",
    block: {
      _type: snapshot.context.schema.block.name
    },
    placement: "after"
  })]]
}), arrowUpOnLonelyBlockObject = defineBehavior({
  on: "keyboard.keydown",
  guard: ({
    snapshot,
    event
  }) => {
    if (!defaultKeyboardShortcuts.arrowUp.guard(event.originEvent) || !isSelectionCollapsed$1(snapshot))
      return !1;
    const focusBlockObject = getFocusBlockObject(snapshot), previousBlock = getPreviousBlock(snapshot);
    return focusBlockObject && !previousBlock;
  },
  actions: [({
    snapshot
  }) => [raise({
    type: "insert.block",
    block: {
      _type: snapshot.context.schema.block.name
    },
    placement: "before"
  })]]
}), breakingBlockObject = defineBehavior({
  on: "insert.break",
  guard: ({
    snapshot
  }) => {
    const focusBlockObject = getFocusBlockObject(snapshot);
    return isSelectionCollapsed$1(snapshot) && focusBlockObject !== void 0;
  },
  actions: [({
    snapshot
  }) => [raise({
    type: "insert.block",
    block: {
      _type: snapshot.context.schema.block.name
    },
    placement: "after"
  })]]
}), clickingAboveLonelyBlockObject = defineBehavior({
  on: "mouse.click",
  guard: ({
    snapshot,
    event
  }) => {
    if (snapshot.context.readOnly || snapshot.context.selection && !isSelectionCollapsed$1(snapshot))
      return !1;
    const focusBlockObject = getFocusBlockObject({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: event.position.selection
      }
    }), previousBlock = getPreviousBlock({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: event.position.selection
      }
    });
    return event.position.isEditor && event.position.block === "start" && focusBlockObject && !previousBlock;
  },
  actions: [({
    snapshot,
    event
  }) => [raise({
    type: "select",
    at: event.position.selection
  }), raise({
    type: "insert.block",
    block: {
      _type: snapshot.context.schema.block.name
    },
    placement: "before",
    select: "start"
  })]]
}), clickingBelowLonelyBlockObject = defineBehavior({
  on: "mouse.click",
  guard: ({
    snapshot,
    event
  }) => {
    if (snapshot.context.readOnly || snapshot.context.selection && !isSelectionCollapsed$1(snapshot))
      return !1;
    const focusBlockObject = getFocusBlockObject({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: event.position.selection
      }
    }), nextBlock = getNextBlock({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: event.position.selection
      }
    });
    return event.position.isEditor && event.position.block === "end" && focusBlockObject && !nextBlock;
  },
  actions: [({
    snapshot,
    event
  }) => [raise({
    type: "select",
    at: event.position.selection
  }), raise({
    type: "insert.block",
    block: {
      _type: snapshot.context.schema.block.name
    },
    placement: "after",
    select: "start"
  })]]
}), deletingEmptyTextBlockAfterBlockObject = defineBehavior({
  on: "delete.backward",
  guard: ({
    snapshot
  }) => {
    const focusTextBlock = getFocusTextBlock(snapshot), selectionCollapsed = isSelectionCollapsed$1(snapshot), previousBlock = getPreviousBlock(snapshot);
    return !focusTextBlock || !selectionCollapsed || !previousBlock ? !1 : isEmptyTextBlock(snapshot.context, focusTextBlock.node) && !isTextBlock(snapshot.context, previousBlock.node) ? {
      focusTextBlock,
      previousBlock
    } : !1;
  },
  actions: [(_, {
    focusTextBlock,
    previousBlock
  }) => [raise({
    type: "delete.block",
    at: focusTextBlock.path
  }), raise({
    type: "select",
    at: {
      anchor: {
        path: previousBlock.path,
        offset: 0
      },
      focus: {
        path: previousBlock.path,
        offset: 0
      }
    }
  })]]
}), deletingEmptyTextBlockBeforeBlockObject = defineBehavior({
  on: "delete.forward",
  guard: ({
    snapshot
  }) => {
    const focusTextBlock = getFocusTextBlock(snapshot), selectionCollapsed = isSelectionCollapsed$1(snapshot), nextBlock = getNextBlock(snapshot);
    return !focusTextBlock || !selectionCollapsed || !nextBlock ? !1 : isEmptyTextBlock(snapshot.context, focusTextBlock.node) && !isTextBlock(snapshot.context, nextBlock.node) ? {
      focusTextBlock,
      nextBlock
    } : !1;
  },
  actions: [(_, {
    focusTextBlock,
    nextBlock
  }) => [raise({
    type: "delete.block",
    at: focusTextBlock.path
  }), raise({
    type: "select",
    at: {
      anchor: {
        path: nextBlock.path,
        offset: 0
      },
      focus: {
        path: nextBlock.path,
        offset: 0
      }
    }
  })]]
}), coreBlockObjectBehaviors = {
  arrowDownOnLonelyBlockObject,
  arrowUpOnLonelyBlockObject,
  breakingBlockObject,
  clickingAboveLonelyBlockObject,
  clickingBelowLonelyBlockObject,
  deletingEmptyTextBlockAfterBlockObject,
  deletingEmptyTextBlockBeforeBlockObject
}, coreDecoratorBehaviors = {
  strongShortcut: defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      snapshot,
      event
    }) => defaultKeyboardShortcuts.decorators.strong.guard(event.originEvent) && snapshot.context.schema.decorators.some((decorator) => decorator.name === "strong"),
    actions: [() => [raise({
      type: "decorator.toggle",
      decorator: "strong"
    })]]
  }),
  emShortcut: defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      snapshot,
      event
    }) => defaultKeyboardShortcuts.decorators.em.guard(event.originEvent) && snapshot.context.schema.decorators.some((decorator) => decorator.name === "em"),
    actions: [() => [raise({
      type: "decorator.toggle",
      decorator: "em"
    })]]
  }),
  underlineShortcut: defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      snapshot,
      event
    }) => defaultKeyboardShortcuts.decorators.underline.guard(event.originEvent) && snapshot.context.schema.decorators.some((decorator) => decorator.name === "underline"),
    actions: [() => [raise({
      type: "decorator.toggle",
      decorator: "underline"
    })]]
  }),
  codeShortcut: defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      snapshot,
      event
    }) => defaultKeyboardShortcuts.decorators.code.guard(event.originEvent) && snapshot.context.schema.decorators.some((decorator) => decorator.name === "code"),
    actions: [() => [raise({
      type: "decorator.toggle",
      decorator: "code"
    })]]
  })
};
function getCompoundClientRect(nodes2) {
  if (nodes2.length === 0)
    return new DOMRect(0, 0, 0, 0);
  const elements = nodes2.filter((node3) => node3 instanceof Element), firstRect = elements.at(0)?.getBoundingClientRect();
  if (!firstRect)
    return new DOMRect(0, 0, 0, 0);
  let left = firstRect.left, top = firstRect.top, right = firstRect.right, bottom = firstRect.bottom;
  for (let i = 1; i < elements.length; i++) {
    const rect = elements[i].getBoundingClientRect();
    left = Math.min(left, rect.left), top = Math.min(top, rect.top), right = Math.max(right, rect.right), bottom = Math.max(bottom, rect.bottom);
  }
  return new DOMRect(left, top, right - left, bottom - top);
}
const coreDndBehaviors = [
  /**
   * Core Behavior that:
   * 1. Calculates and selects a "drag selection"
   * 2. Constructs and sets a drag ghost element
   * 3. Forwards the dragstart event
   */
  defineBehavior({
    on: "drag.dragstart",
    guard: ({
      snapshot,
      dom,
      event
    }) => {
      const dragSelection = getDragSelection({
        snapshot,
        eventSelection: event.position.selection
      }), selectingEntireBlocks = isSelectingEntireBlocks({
        ...snapshot,
        context: {
          ...snapshot.context,
          selection: dragSelection
        }
      }), draggedDomNodes = {
        blockNodes: dom.getBlockNodes({
          ...snapshot,
          context: {
            ...snapshot.context,
            selection: dragSelection
          }
        }),
        childNodes: dom.getChildNodes({
          ...snapshot,
          context: {
            ...snapshot.context,
            selection: dragSelection
          }
        })
      };
      return {
        dragSelection,
        draggedDomNodes,
        selectingEntireBlocks
      };
    },
    actions: [({
      dom,
      event
    }, {
      dragSelection,
      draggedDomNodes,
      selectingEntireBlocks
    }) => {
      const dragGhost = document.createElement("div");
      if (selectingEntireBlocks) {
        const clonedBlockNodes = draggedDomNodes.blockNodes.map((node3) => node3.cloneNode(!0));
        for (const block of clonedBlockNodes)
          block instanceof HTMLElement && (block.style.position = "relative"), dragGhost.appendChild(block);
        const customGhost = dragGhost.querySelector("[data-pt-drag-ghost-element]");
        if (customGhost && dragGhost.replaceChildren(customGhost), dragGhost.setAttribute("data-dragged", ""), dragGhost.style.position = "absolute", dragGhost.style.left = "-99999px", dragGhost.style.boxSizing = "border-box", document.body.appendChild(dragGhost), customGhost) {
          const customGhostRect = customGhost.getBoundingClientRect(), x = event.originEvent.clientX - customGhostRect.left, y = event.originEvent.clientY - customGhostRect.top;
          return dragGhost.style.width = `${customGhostRect.width}px`, dragGhost.style.height = `${customGhostRect.height}px`, [raise({
            type: "select",
            at: dragSelection
          }), effect(() => {
            dom.setDragGhost({
              event,
              ghost: {
                element: dragGhost,
                x,
                y
              }
            });
          }), forward(event)];
        } else {
          const blocksDomRect = getCompoundClientRect(draggedDomNodes.blockNodes), x = event.originEvent.clientX - blocksDomRect.left, y = event.originEvent.clientY - blocksDomRect.top;
          return dragGhost.style.width = `${blocksDomRect.width}px`, dragGhost.style.height = `${blocksDomRect.height}px`, [raise({
            type: "select",
            at: dragSelection
          }), effect(() => {
            dom.setDragGhost({
              event,
              ghost: {
                element: dragGhost,
                x,
                y
              }
            });
          }), forward(event)];
        }
      } else {
        const clonedChildNodes = draggedDomNodes.childNodes.map((node3) => node3.cloneNode(!0));
        for (const child of clonedChildNodes)
          dragGhost.appendChild(child);
        dragGhost.style.position = "absolute", dragGhost.style.left = "-99999px", dragGhost.style.boxSizing = "border-box", document.body.appendChild(dragGhost);
        const childrenDomRect = getCompoundClientRect(draggedDomNodes.childNodes), x = event.originEvent.clientX - childrenDomRect.left, y = event.originEvent.clientY - childrenDomRect.top;
        return dragGhost.style.width = `${childrenDomRect.width}px`, dragGhost.style.height = `${childrenDomRect.height}px`, [raise({
          type: "select",
          at: dragSelection
        }), effect(() => {
          dom.setDragGhost({
            event,
            ghost: {
              element: dragGhost,
              x,
              y
            }
          });
        }), forward(event)];
      }
    }]
  }),
  /**
   * When dragging over the drag origin, we don't want to show the caret in the
   * text.
   */
  defineBehavior({
    on: "drag.dragover",
    guard: ({
      snapshot,
      event
    }) => {
      const dragOrigin = event.dragOrigin;
      return dragOrigin ? isOverlappingSelection(event.position.selection)({
        ...snapshot,
        context: {
          ...snapshot.context,
          selection: dragOrigin.selection
        }
      }) : !1;
    },
    actions: []
  }),
  /**
   * If the drop position overlaps the drag origin, then the event should be
   * cancelled.
   */
  defineBehavior({
    on: "drag.drop",
    guard: ({
      snapshot,
      event
    }) => {
      const dragOrigin = event.dragOrigin, dropPosition = event.position.selection;
      return dragOrigin ? isOverlappingSelection(dropPosition)({
        ...snapshot,
        context: {
          ...snapshot.context,
          selection: dragOrigin.selection
        }
      }) : !1;
    },
    actions: []
  }),
  /**
   * If we drop and have access to a drag origin, then we can deserialize
   * without creating a new selection.
   */
  defineBehavior({
    on: "drag.drop",
    guard: ({
      event
    }) => event.dragOrigin !== void 0,
    actions: [({
      event
    }) => [raise({
      type: "deserialize",
      originEvent: event
    })]]
  }),
  /**
   * Otherwise, we should to create a new selection.
   */
  defineBehavior({
    on: "drag.drop",
    actions: [({
      event
    }) => [raise({
      type: "select",
      at: event.position.selection
    }), raise({
      type: "deserialize",
      originEvent: event
    })]]
  }),
  /**
   * Core Behavior that uses the drag origin to mimic a move operation during
   * internal dragging.
   */
  defineBehavior({
    on: "deserialization.success",
    guard: ({
      snapshot,
      event
    }) => {
      if (event.originEvent.type !== "drag.drop" || event.originEvent.dragOrigin === void 0)
        return !1;
      const dragOrigin = event.originEvent.dragOrigin, dragSelection = getDragSelection({
        eventSelection: dragOrigin.selection,
        snapshot
      }), dropPosition = event.originEvent.position.selection, droppingOnDragOrigin = dragOrigin ? isOverlappingSelection(dropPosition)({
        ...snapshot,
        context: {
          ...snapshot.context,
          selection: dragSelection
        }
      }) : !1, draggingEntireBlocks = isSelectingEntireBlocks({
        ...snapshot,
        context: {
          ...snapshot.context,
          selection: dragSelection
        }
      }), draggedBlocks = getSelectedBlocks({
        ...snapshot,
        context: {
          ...snapshot.context,
          selection: dragSelection
        }
      });
      return droppingOnDragOrigin ? !1 : {
        dropPosition,
        draggingEntireBlocks,
        draggedBlocks,
        dragOrigin,
        originEvent: event.originEvent
      };
    },
    actions: [({
      event
    }, {
      draggingEntireBlocks,
      draggedBlocks,
      dragOrigin,
      dropPosition,
      originEvent
    }) => [raise({
      type: "select",
      at: dropPosition
    }), ...draggingEntireBlocks ? draggedBlocks.map((block) => raise({
      type: "delete.block",
      at: block.path
    })) : [raise({
      type: "delete",
      at: dragOrigin.selection
    })], raise({
      type: "insert.blocks",
      blocks: event.data,
      placement: draggingEntireBlocks ? originEvent.position.block === "start" ? "before" : originEvent.position.block === "end" ? "after" : "auto" : "auto"
    })]]
  })
], coreInsertBehaviors = [defineBehavior({
  on: "insert.text",
  guard: ({
    snapshot
  }) => {
    if (!getFocusSpan$1(snapshot))
      return !1;
    const markState = getMarkState(snapshot), activeDecorators = getActiveDecorators(snapshot), activeAnnotations = getActiveAnnotationsMarks(snapshot);
    if (markState && markState.state === "unchanged") {
      const markStateDecorators = (markState.marks ?? []).filter((mark) => snapshot.context.schema.decorators.map((decorator) => decorator.name).includes(mark));
      if (markStateDecorators.length === activeDecorators.length && markStateDecorators.every((mark) => activeDecorators.includes(mark)))
        return !1;
    }
    return {
      activeDecorators,
      activeAnnotations
    };
  },
  actions: [({
    snapshot,
    event
  }, {
    activeDecorators,
    activeAnnotations
  }) => [raise({
    type: "insert.child",
    child: {
      _type: snapshot.context.schema.span.name,
      text: event.text,
      marks: [...activeDecorators, ...activeAnnotations]
    }
  })]]
})], breakingAtTheEndOfTextBlock = defineBehavior({
  on: "insert.break",
  guard: ({
    snapshot
  }) => {
    const focusTextBlock = getFocusTextBlock(snapshot), selectionCollapsed = isSelectionCollapsed$1(snapshot);
    if (!snapshot.context.selection || !focusTextBlock || !selectionCollapsed)
      return !1;
    const atTheEndOfBlock = isAtTheEndOfBlock(focusTextBlock)(snapshot), focusListItem = focusTextBlock.node.listItem, focusLevel = focusTextBlock.node.level;
    return atTheEndOfBlock ? {
      focusListItem,
      focusLevel
    } : !1;
  },
  actions: [({
    snapshot
  }, {
    focusListItem,
    focusLevel
  }) => [raise({
    type: "insert.block",
    block: {
      _type: snapshot.context.schema.block.name,
      children: [{
        _type: snapshot.context.schema.span.name,
        text: "",
        marks: []
      }],
      markDefs: [],
      listItem: focusListItem,
      level: focusLevel,
      style: snapshot.context.schema.styles[0]?.name
    },
    placement: "after"
  })]]
}), breakingAtTheStartOfTextBlock = defineBehavior({
  on: "insert.break",
  guard: ({
    snapshot
  }) => {
    const focusTextBlock = getFocusTextBlock(snapshot), selectionCollapsed = isSelectionCollapsed$1(snapshot);
    if (!snapshot.context.selection || !focusTextBlock || !selectionCollapsed)
      return !1;
    const focusSpan = getFocusSpan$1(snapshot), focusDecorators = focusSpan?.node.marks?.filter((mark) => snapshot.context.schema.decorators.some((decorator) => decorator.name === mark) ?? []), focusAnnotations = focusSpan?.node.marks?.filter((mark) => !snapshot.context.schema.decorators.some((decorator) => decorator.name === mark)) ?? [], focusListItem = focusTextBlock.node.listItem, focusLevel = focusTextBlock.node.level;
    return isAtTheStartOfBlock(focusTextBlock)(snapshot) ? {
      focusAnnotations,
      focusDecorators,
      focusListItem,
      focusLevel
    } : !1;
  },
  actions: [({
    snapshot
  }, {
    focusAnnotations,
    focusDecorators,
    focusListItem,
    focusLevel
  }) => [raise({
    type: "insert.block",
    block: {
      _type: snapshot.context.schema.block.name,
      children: [{
        _type: snapshot.context.schema.span.name,
        marks: focusAnnotations.length === 0 ? focusDecorators : [],
        text: ""
      }],
      listItem: focusListItem,
      level: focusLevel,
      style: snapshot.context.schema.styles[0]?.name
    },
    placement: "before",
    select: "none"
  })]]
}), breakingEntireDocument = defineBehavior({
  on: "insert.break",
  guard: ({
    snapshot
  }) => {
    if (!snapshot.context.selection || !isSelectionExpanded(snapshot))
      return !1;
    const firstBlock = getFirstBlock$1(snapshot), lastBlock = getLastBlock$1(snapshot);
    if (!firstBlock || !lastBlock)
      return !1;
    const firstBlockStartPoint = getBlockStartPoint({
      context: snapshot.context,
      block: firstBlock
    }), selectionStartPoint = getSelectionStartPoint(snapshot.context.selection), lastBlockEndPoint = getBlockEndPoint({
      context: snapshot.context,
      block: lastBlock
    }), selectionEndPoint = getSelectionEndPoint(snapshot.context.selection);
    return isEqualSelectionPoints(firstBlockStartPoint, selectionStartPoint) && isEqualSelectionPoints(lastBlockEndPoint, selectionEndPoint) ? {
      selection: snapshot.context.selection
    } : !1;
  },
  actions: [(_, {
    selection
  }) => [raise({
    type: "delete",
    at: selection
  })]]
}), breakingEntireBlocks = defineBehavior({
  on: "insert.break",
  guard: ({
    snapshot
  }) => {
    if (!snapshot.context.selection || !isSelectionExpanded(snapshot))
      return !1;
    const selectedBlocks = getSelectedBlocks(snapshot), selectionStartBlock = getSelectionStartBlock(snapshot), selectionEndBlock = getSelectionEndBlock(snapshot);
    if (!selectionStartBlock || !selectionEndBlock)
      return !1;
    const startBlockStartPoint = getBlockStartPoint({
      context: snapshot.context,
      block: selectionStartBlock
    }), selectionStartPoint = getSelectionStartPoint(snapshot.context.selection), endBlockEndPoint = getBlockEndPoint({
      context: snapshot.context,
      block: selectionEndBlock
    }), selectionEndPoint = getSelectionEndPoint(snapshot.context.selection);
    return isEqualSelectionPoints(selectionStartPoint, startBlockStartPoint) && isEqualSelectionPoints(selectionEndPoint, endBlockEndPoint) ? {
      selectedBlocks
    } : !1;
  },
  actions: [({
    snapshot
  }, {
    selectedBlocks
  }) => [raise({
    type: "insert.block",
    block: {
      _type: snapshot.context.schema.block.name,
      children: [{
        _type: snapshot.context.schema.span.name,
        text: "",
        marks: []
      }]
    },
    placement: "before",
    select: "start"
  }), ...selectedBlocks.map((block) => raise({
    type: "delete.block",
    at: block.path
  }))]]
}), breakingInlineObject = defineBehavior({
  on: "insert.break",
  guard: ({
    snapshot
  }) => {
    const selectionCollapsed = isSelectionCollapsed$1(snapshot), focusInlineObject = getFocusInlineObject(snapshot);
    return selectionCollapsed && focusInlineObject;
  },
  actions: [() => [raise({
    type: "move.forward",
    distance: 1
  }), raise({
    type: "split"
  })]]
}), coreInsertBreakBehaviors = {
  breakingAtTheEndOfTextBlock,
  breakingAtTheStartOfTextBlock,
  breakingEntireDocument,
  breakingEntireBlocks,
  breakingInlineObject
};
function isAtTheBeginningOfBlock({
  context,
  block
}) {
  return !isTextBlock(context, block) || !context.selection || !isSelectionCollapsed(context.selection) ? !1 : getChildKeyFromSelectionPoint(context.selection.focus) === block.children[0]._key && context.selection.focus.offset === 0;
}
const MAX_LIST_LEVEL = 10, clearListOnBackspace = defineBehavior({
  on: "delete.backward",
  guard: ({
    snapshot
  }) => {
    const focusTextBlock = getFocusTextBlock(snapshot);
    return !focusTextBlock || focusTextBlock.node.level !== 1 || !isAtTheBeginningOfBlock({
      context: snapshot.context,
      block: focusTextBlock.node
    }) ? !1 : {
      focusTextBlock
    };
  },
  actions: [(_, {
    focusTextBlock
  }) => [raise({
    type: "block.unset",
    props: ["listItem", "level"],
    at: focusTextBlock.path
  })]]
}), unindentListOnBackspace = defineBehavior({
  on: "delete.backward",
  guard: ({
    snapshot
  }) => {
    const selectionCollapsed = isSelectionCollapsed$1(snapshot), focusTextBlock = getFocusTextBlock(snapshot), focusSpan = getFocusSpan$1(snapshot);
    return !selectionCollapsed || !focusTextBlock || !focusSpan ? !1 : focusTextBlock.node.children[0]._key === focusSpan.node._key && snapshot.context.selection?.focus.offset === 0 && focusTextBlock.node.level !== void 0 && focusTextBlock.node.level > 1 ? {
      focusTextBlock,
      level: focusTextBlock.node.level - 1
    } : !1;
  },
  actions: [(_, {
    focusTextBlock,
    level
  }) => [raise({
    type: "block.set",
    props: {
      level
    },
    at: focusTextBlock.path
  })]]
}), mergeTextIntoListOnDelete = defineBehavior({
  on: "delete.forward",
  guard: ({
    snapshot
  }) => {
    const focusListBlock = getFocusListBlock(snapshot), nextBlock = getNextBlock(snapshot);
    return !focusListBlock || !nextBlock || !isTextBlock(snapshot.context, nextBlock.node) || !isEmptyTextBlock(snapshot.context, focusListBlock.node) ? !1 : {
      focusListBlock,
      nextBlock
    };
  },
  actions: [(_, {
    nextBlock
  }) => [raise({
    type: "insert.block",
    block: nextBlock.node,
    placement: "auto",
    select: "start"
  }), raise({
    type: "delete.block",
    at: nextBlock.path
  })]]
}), mergeTextIntoListOnBackspace = defineBehavior({
  on: "delete.backward",
  guard: ({
    snapshot
  }) => {
    const focusTextBlock = getFocusTextBlock(snapshot), previousBlock = getPreviousBlock(snapshot);
    if (!focusTextBlock || !previousBlock || !isAtTheBeginningOfBlock({
      context: snapshot.context,
      block: focusTextBlock.node
    }) || !isListBlock(snapshot.context, previousBlock.node) || !isEmptyTextBlock(snapshot.context, previousBlock.node))
      return !1;
    const previousBlockEndPoint = getBlockEndPoint({
      context: snapshot.context,
      block: previousBlock
    });
    return {
      focusTextBlock,
      previousBlockEndPoint
    };
  },
  actions: [(_, {
    focusTextBlock,
    previousBlockEndPoint
  }) => [raise({
    type: "select",
    at: {
      anchor: previousBlockEndPoint,
      focus: previousBlockEndPoint
    }
  }), raise({
    type: "insert.block",
    block: focusTextBlock.node,
    placement: "auto",
    select: "start"
  }), raise({
    type: "delete.block",
    at: focusTextBlock.path
  })]]
}), deletingListFromStart = defineBehavior({
  on: "delete",
  guard: ({
    snapshot,
    event
  }) => {
    const at = event.at ?? snapshot.context.selection;
    if (!at)
      return !1;
    const blocksToDelete = getSelectedBlocks({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: at
      }
    });
    if (blocksToDelete.length < 2)
      return !1;
    const startBlock = blocksToDelete.at(0)?.node, middleBlocks = blocksToDelete.slice(1, -1), endBlock = blocksToDelete.at(-1)?.node;
    if (!isListBlock(snapshot.context, startBlock) || !isListBlock(snapshot.context, endBlock))
      return !1;
    const deleteStartPoint = getSelectionStartPoint$1({
      context: {
        ...snapshot.context,
        selection: at
      }
    }), deleteEndPoint = getSelectionEndPoint$1({
      context: {
        ...snapshot.context,
        selection: at
      }
    });
    if (!deleteStartPoint || !deleteEndPoint)
      return !1;
    const startBlockStartPoint = getBlockStartPoint({
      context: snapshot.context,
      block: {
        node: startBlock,
        path: [{
          _key: startBlock._key
        }]
      }
    });
    if (!isEqualSelectionPoints(deleteStartPoint, startBlockStartPoint))
      return !1;
    const startBlockEndPoint = getBlockEndPoint({
      context: snapshot.context,
      block: {
        node: startBlock,
        path: [{
          _key: startBlock._key
        }]
      }
    }), endBlockEndPoint = getBlockEndPoint({
      context: snapshot.context,
      block: {
        node: endBlock,
        path: [{
          _key: endBlock._key
        }]
      }
    }), slicedEndBlock = sliceTextBlock({
      context: {
        schema: snapshot.context.schema,
        selection: {
          anchor: deleteEndPoint,
          focus: endBlockEndPoint
        }
      },
      block: endBlock
    });
    return {
      startBlockStartPoint,
      startBlockEndPoint,
      middleBlocks,
      endBlock,
      slicedEndBlock
    };
  },
  actions: [(_, {
    startBlockStartPoint,
    startBlockEndPoint,
    middleBlocks,
    endBlock,
    slicedEndBlock
  }) => [
    // All block in between can safely be deleted.
    ...middleBlocks.map((block) => raise({
      type: "delete.block",
      at: block.path
    })),
    // The last block is deleted as well.
    raise({
      type: "delete.block",
      at: [{
        _key: endBlock._key
      }]
    }),
    // But in case the delete operation didn't reach all the way to the end
    // of it, we first place the caret at the end of the start block...
    raise({
      type: "select",
      at: {
        anchor: startBlockEndPoint,
        focus: startBlockEndPoint
      }
    }),
    // ...and insert the rest of the end block at the end of it.
    raise({
      type: "insert.block",
      block: slicedEndBlock,
      placement: "auto",
      select: "none"
    }),
    // And finally, we delete the original text of the start block.
    raise({
      type: "delete",
      at: {
        anchor: startBlockStartPoint,
        focus: startBlockEndPoint
      }
    })
  ]]
}), clearListOnEnter = defineBehavior({
  on: "insert.break",
  guard: ({
    snapshot
  }) => {
    const selectionCollapsed = isSelectionCollapsed$1(snapshot), focusListBlock = getFocusListBlock(snapshot);
    return !selectionCollapsed || !focusListBlock || !isEmptyTextBlock(snapshot.context, focusListBlock.node) ? !1 : {
      focusListBlock
    };
  },
  actions: [(_, {
    focusListBlock
  }) => [raise({
    type: "block.unset",
    props: ["listItem", "level"],
    at: focusListBlock.path
  })]]
}), indentListOnTab = defineBehavior({
  on: "keyboard.keydown",
  guard: ({
    snapshot,
    event
  }) => {
    if (!defaultKeyboardShortcuts.tab.guard(event.originEvent))
      return !1;
    const selectedBlocks = getSelectedBlocks(snapshot), selectedListBlocks = selectedBlocks.flatMap((block) => isListBlock(snapshot.context, block.node) ? [{
      node: block.node,
      path: block.path
    }] : []);
    return selectedListBlocks.length === selectedBlocks.length ? {
      selectedListBlocks
    } : !1;
  },
  actions: [(_, {
    selectedListBlocks
  }) => selectedListBlocks.map((selectedListBlock) => raise({
    type: "block.set",
    props: {
      level: Math.min(MAX_LIST_LEVEL, Math.max(1, selectedListBlock.node.level + 1))
    },
    at: selectedListBlock.path
  }))]
}), unindentListOnShiftTab = defineBehavior({
  on: "keyboard.keydown",
  guard: ({
    snapshot,
    event
  }) => {
    if (!defaultKeyboardShortcuts.shiftTab.guard(event.originEvent))
      return !1;
    const selectedBlocks = getSelectedBlocks(snapshot), selectedListBlocks = selectedBlocks.flatMap((block) => isListBlock(snapshot.context, block.node) ? [{
      node: block.node,
      path: block.path
    }] : []);
    return selectedListBlocks.length === selectedBlocks.length ? {
      selectedListBlocks
    } : !1;
  },
  actions: [(_, {
    selectedListBlocks
  }) => selectedListBlocks.map((selectedListBlock) => raise({
    type: "block.set",
    props: {
      level: Math.min(MAX_LIST_LEVEL, Math.max(1, selectedListBlock.node.level - 1))
    },
    at: selectedListBlock.path
  }))]
}), inheritListLevel = defineBehavior({
  on: "insert.blocks",
  guard: ({
    snapshot,
    event
  }) => {
    const focusListBlock = getFocusListBlock(snapshot);
    if (!focusListBlock)
      return !1;
    const firstInsertedBlock = event.blocks.at(0), secondInsertedBlock = event.blocks.at(1), insertedListBlock = isListBlock(snapshot.context, firstInsertedBlock) ? firstInsertedBlock : isListBlock(snapshot.context, secondInsertedBlock) ? secondInsertedBlock : void 0;
    if (!insertedListBlock)
      return !1;
    const levelDifference = focusListBlock.node.level - insertedListBlock.level;
    return levelDifference === 0 ? !1 : {
      levelDifference,
      insertedListBlock
    };
  },
  actions: [({
    snapshot,
    event
  }, {
    levelDifference,
    insertedListBlock
  }) => {
    let adjustLevel = !0, listStartBlockFound = !1;
    return [raise({
      ...event,
      blocks: event.blocks.map((block) => (block._key === insertedListBlock._key && (listStartBlockFound = !0), adjustLevel ? listStartBlockFound && adjustLevel && isListBlock(snapshot.context, block) ? {
        ...block,
        level: Math.min(MAX_LIST_LEVEL, Math.max(1, block.level + levelDifference))
      } : (listStartBlockFound && (adjustLevel = !1), block) : block))
    })];
  }]
}), inheritListItem = defineBehavior({
  on: "insert.blocks",
  guard: ({
    snapshot,
    event
  }) => {
    const focusListBlock = getFocusListBlock(snapshot);
    if (!focusListBlock || isEmptyTextBlock(snapshot.context, focusListBlock.node))
      return !1;
    const firstInsertedBlock = event.blocks.at(0), secondInsertedBlock = event.blocks.at(1), insertedListBlock = isListBlock(snapshot.context, firstInsertedBlock) ? firstInsertedBlock : isListBlock(snapshot.context, secondInsertedBlock) ? secondInsertedBlock : void 0;
    return !insertedListBlock || focusListBlock.node.level !== insertedListBlock.level || focusListBlock.node.listItem === insertedListBlock.listItem ? !1 : {
      listItem: focusListBlock.node.listItem,
      insertedListBlock
    };
  },
  actions: [({
    snapshot,
    event
  }, {
    listItem,
    insertedListBlock
  }) => {
    let adjustListItem = !0, listStartBlockFound = !1;
    return [raise({
      ...event,
      blocks: event.blocks.map((block) => (block._key === insertedListBlock._key && (listStartBlockFound = !0), adjustListItem ? listStartBlockFound && adjustListItem && isListBlock(snapshot.context, block) ? {
        ...block,
        listItem: block.level === insertedListBlock.level ? listItem : block.listItem
      } : (listStartBlockFound && (adjustListItem = !1), block) : block))
    })];
  }]
}), inheritListProperties = defineBehavior({
  on: "insert.block",
  guard: ({
    snapshot,
    event
  }) => {
    if (event.placement !== "auto" || event.block._type !== snapshot.context.schema.block.name || event.block.listItem !== void 0)
      return !1;
    const focusListBlock = getFocusListBlock(snapshot);
    return !focusListBlock || !isEmptyTextBlock(snapshot.context, focusListBlock.node) ? !1 : {
      level: focusListBlock.node.level,
      listItem: focusListBlock.node.listItem
    };
  },
  actions: [({
    event
  }, {
    level,
    listItem
  }) => [raise({
    ...event,
    block: {
      ...event.block,
      level,
      listItem
    }
  })]]
}), coreListBehaviors = {
  clearListOnBackspace,
  unindentListOnBackspace,
  mergeTextIntoListOnDelete,
  mergeTextIntoListOnBackspace,
  deletingListFromStart,
  clearListOnEnter,
  indentListOnTab,
  unindentListOnShiftTab,
  inheritListLevel,
  inheritListItem,
  inheritListProperties
}, coreBehaviorsConfig = [...coreAnnotationBehaviors, coreDecoratorBehaviors.strongShortcut, coreDecoratorBehaviors.emShortcut, coreDecoratorBehaviors.underlineShortcut, coreDecoratorBehaviors.codeShortcut, ...coreDndBehaviors, coreBlockObjectBehaviors.clickingAboveLonelyBlockObject, coreBlockObjectBehaviors.clickingBelowLonelyBlockObject, coreBlockObjectBehaviors.arrowDownOnLonelyBlockObject, coreBlockObjectBehaviors.arrowUpOnLonelyBlockObject, coreBlockObjectBehaviors.breakingBlockObject, coreBlockObjectBehaviors.deletingEmptyTextBlockAfterBlockObject, coreBlockObjectBehaviors.deletingEmptyTextBlockBeforeBlockObject, ...coreInsertBehaviors, coreListBehaviors.clearListOnBackspace, coreListBehaviors.unindentListOnBackspace, coreListBehaviors.mergeTextIntoListOnDelete, coreListBehaviors.mergeTextIntoListOnBackspace, coreListBehaviors.deletingListFromStart, coreListBehaviors.clearListOnEnter, coreListBehaviors.indentListOnTab, coreListBehaviors.unindentListOnShiftTab, coreListBehaviors.inheritListLevel, coreListBehaviors.inheritListItem, coreListBehaviors.inheritListProperties, coreInsertBreakBehaviors.breakingAtTheEndOfTextBlock, coreInsertBreakBehaviors.breakingAtTheStartOfTextBlock, coreInsertBreakBehaviors.breakingEntireDocument, coreInsertBreakBehaviors.breakingEntireBlocks, coreInsertBreakBehaviors.breakingInlineObject].map((behavior) => ({
  behavior,
  priority: corePriority
}));
function withoutNormalizingConditional(editor, predicate, fn) {
  predicate() ? Editor.withoutNormalizing(editor, fn) : fn();
}
const abstractAnnotationBehaviors = [defineBehavior({
  on: "annotation.set",
  guard: ({
    snapshot,
    event
  }) => {
    const blockKey = event.at[0]._key, markDefKey = event.at[2]._key, block = getFocusTextBlock({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: {
          anchor: {
            path: [{
              _key: blockKey
            }],
            offset: 0
          },
          focus: {
            path: [{
              _key: blockKey
            }],
            offset: 0
          }
        }
      }
    });
    if (!block)
      return !1;
    const updatedMarkDefs = block.node.markDefs?.map((markDef) => markDef._key === markDefKey ? {
      ...markDef,
      ...event.props
    } : markDef);
    return {
      blockKey,
      updatedMarkDefs
    };
  },
  actions: [(_, {
    blockKey,
    updatedMarkDefs
  }) => [raise({
    type: "block.set",
    at: [{
      _key: blockKey
    }],
    props: {
      markDefs: updatedMarkDefs
    }
  })]]
}), defineBehavior({
  on: "annotation.toggle",
  guard: ({
    snapshot,
    event
  }) => isActiveAnnotation(event.annotation.name)(snapshot),
  actions: [({
    event
  }) => [raise({
    type: "annotation.remove",
    annotation: event.annotation
  })]]
}), defineBehavior({
  on: "annotation.toggle",
  guard: ({
    snapshot,
    event
  }) => !isActiveAnnotation(event.annotation.name)(snapshot),
  actions: [({
    event
  }) => [raise({
    type: "annotation.add",
    annotation: event.annotation
  })]]
})], abstractDecoratorBehaviors = [defineBehavior({
  on: "decorator.toggle",
  guard: ({
    snapshot,
    event
  }) => isActiveDecorator(event.decorator)(snapshot),
  actions: [({
    event
  }) => [raise({
    type: "decorator.remove",
    decorator: event.decorator
  })]]
}), defineBehavior({
  on: "decorator.toggle",
  guard: ({
    snapshot,
    event
  }) => event.at ? !isActiveDecorator(event.decorator)({
    ...snapshot,
    context: {
      ...snapshot.context,
      selection: event.at
    }
  }) : !isActiveDecorator(event.decorator)(snapshot),
  actions: [({
    event
  }) => [raise({
    ...event,
    type: "decorator.add"
  })]]
})], abstractDeleteBehaviors = [defineBehavior({
  on: "delete.backward",
  guard: ({
    snapshot
  }) => snapshot.context.selection,
  actions: [({
    event
  }) => [raise({
    type: "delete",
    direction: "backward",
    unit: event.unit
  })]]
}), defineBehavior({
  on: "delete",
  guard: ({
    snapshot,
    event
  }) => {
    if (event.direction !== "backward")
      return !1;
    const previousBlock = getPreviousBlock(snapshot), focusTextBlock = getFocusTextBlock(snapshot);
    if (!previousBlock || !focusTextBlock || !isAtTheStartOfBlock(focusTextBlock)(snapshot))
      return !1;
    const previousBlockEndPoint = getBlockEndPoint({
      context: snapshot.context,
      block: previousBlock
    });
    return isTextBlock(snapshot.context, previousBlock.node) ? {
      previousBlockEndPoint,
      focusTextBlock
    } : !1;
  },
  actions: [(_, {
    previousBlockEndPoint,
    focusTextBlock
  }) => [raise({
    type: "delete.block",
    at: focusTextBlock.path
  }), raise({
    type: "select",
    at: {
      anchor: previousBlockEndPoint,
      focus: previousBlockEndPoint
    }
  }), raise({
    type: "insert.block",
    block: focusTextBlock.node,
    placement: "auto",
    select: "start"
  })]]
}), defineBehavior({
  on: "delete.forward",
  guard: ({
    snapshot
  }) => snapshot.context.selection,
  actions: [({
    event
  }) => [raise({
    type: "delete",
    direction: "forward",
    unit: event.unit
  })]]
}), defineBehavior({
  on: "delete",
  guard: ({
    snapshot,
    event
  }) => {
    if (event.direction !== "forward")
      return !1;
    const at = event.at ?? snapshot.context.selection;
    if (!at)
      return !1;
    const nextBlock = getNextBlock({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: at
      }
    }), focusTextBlock = getFocusTextBlock({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: at
      }
    });
    if (!nextBlock || !focusTextBlock || !isEmptyTextBlock(snapshot.context, focusTextBlock.node))
      return !1;
    const nextBlockStartPoint = getBlockStartPoint({
      context: snapshot.context,
      block: nextBlock
    });
    return {
      focusTextBlock,
      nextBlockStartPoint
    };
  },
  actions: [(_, {
    focusTextBlock,
    nextBlockStartPoint
  }) => [raise({
    type: "delete.block",
    at: focusTextBlock.path
  }), raise({
    type: "select",
    at: {
      anchor: nextBlockStartPoint,
      focus: nextBlockStartPoint
    }
  })]]
}), defineBehavior({
  on: "delete",
  guard: ({
    snapshot,
    event
  }) => {
    if (event.direction !== "forward")
      return !1;
    const nextBlock = getNextBlock(snapshot), focusTextBlock = getFocusTextBlock(snapshot);
    return !nextBlock || !focusTextBlock || !isAtTheEndOfBlock(focusTextBlock)(snapshot) || !isTextBlock(snapshot.context, nextBlock.node) ? !1 : {
      nextBlock
    };
  },
  actions: [(_, {
    nextBlock
  }) => [raise({
    type: "delete.block",
    at: nextBlock.path
  }), raise({
    type: "insert.block",
    block: nextBlock.node,
    placement: "auto",
    select: "none"
  })]]
}), defineBehavior({
  on: "delete.block",
  actions: [({
    event
  }) => [raise({
    type: "delete",
    at: {
      anchor: {
        path: event.at,
        offset: 0
      },
      focus: {
        path: event.at,
        offset: 0
      }
    },
    unit: "block"
  })]]
}), defineBehavior({
  on: "delete.child",
  guard: ({
    snapshot,
    event
  }) => {
    const focusChild = getFocusChild$1({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: {
          anchor: {
            path: event.at,
            offset: 0
          },
          focus: {
            path: event.at,
            offset: 0
          }
        }
      }
    });
    return focusChild ? isSpan(snapshot.context, focusChild.node) ? {
      selection: {
        anchor: {
          path: event.at,
          offset: 0
        },
        focus: {
          path: event.at,
          offset: focusChild.node.text.length
        }
      }
    } : {
      selection: {
        anchor: {
          path: event.at,
          offset: 0
        },
        focus: {
          path: event.at,
          offset: 0
        }
      }
    } : !1;
  },
  actions: [(_, {
    selection
  }) => [raise({
    type: "delete",
    at: selection
  })]]
}), defineBehavior({
  on: "delete.text",
  actions: [({
    event
  }) => [raise({
    ...event,
    type: "delete"
  })]]
})], mimeTypePriority = ["application/x-portable-text", "application/json", "text/markdown", "text/html", "text/plain"];
function getFirstAvailableData({
  dataTransfer,
  startAfter
}) {
  const startIndex = startAfter ? mimeTypePriority.indexOf(startAfter) + 1 : 0;
  for (let index = startIndex; index < mimeTypePriority.length; index++) {
    const mimeType = mimeTypePriority.at(index);
    if (!mimeType)
      continue;
    const data = dataTransfer.getData(mimeType);
    if (data)
      return {
        mimeType,
        data
      };
  }
}
const abstractDeserializeBehaviors = [
  defineBehavior({
    on: "deserialize",
    guard: ({
      event
    }) => {
      const availableData = getFirstAvailableData({
        dataTransfer: event.originEvent.originEvent.dataTransfer
      });
      return availableData ? {
        type: "deserialize.data",
        mimeType: availableData.mimeType,
        data: availableData.data,
        originEvent: event.originEvent
      } : !1;
    },
    actions: [(_, deserializeEvent) => [raise(deserializeEvent)]]
  }),
  defineBehavior({
    on: "deserialize",
    actions: [({
      event
    }) => [raise({
      type: "deserialization.failure",
      mimeType: "*/*",
      reason: "No Behavior was able to handle the incoming data",
      originEvent: event.originEvent
    })]]
  }),
  defineBehavior({
    on: "deserialize.data",
    guard: ({
      snapshot,
      event
    }) => {
      const converter = snapshot.context.converters.find((converter2) => converter2.mimeType === event.mimeType);
      return converter ? converter.deserialize({
        snapshot,
        event: {
          type: "deserialize",
          data: event.data
        }
      }) : !1;
    },
    actions: [({
      event
    }, deserializeEvent) => [raise({
      ...deserializeEvent,
      originEvent: event.originEvent
    })]]
  }),
  /**
   * If we are pasting text/plain into a text block then we can probably
   * assume that the intended behavior is that the pasted text inherits
   * formatting from the text it's pasted into.
   */
  defineBehavior({
    on: "deserialization.success",
    guard: ({
      snapshot,
      event
    }) => {
      if (getFocusTextBlock(snapshot) && event.mimeType === "text/plain" && event.originEvent.type === "clipboard.paste") {
        const activeDecorators = getActiveDecorators(snapshot);
        return {
          activeAnnotations: getActiveAnnotations(snapshot),
          activeDecorators,
          textRuns: event.data.flatMap((block) => isTextBlock(snapshot.context, block) ? [getTextBlockText(block)] : [])
        };
      }
      return !1;
    },
    actions: [(_, {
      activeAnnotations,
      activeDecorators,
      textRuns
    }) => textRuns.flatMap((textRun, index) => index !== textRuns.length - 1 ? [raise({
      type: "insert.span",
      text: textRun,
      decorators: activeDecorators,
      annotations: activeAnnotations.map(({
        _key,
        _type,
        ...value
      }) => ({
        name: _type,
        value
      }))
    }), raise({
      type: "insert.break"
    })] : [raise({
      type: "insert.span",
      text: textRun,
      decorators: activeDecorators,
      annotations: activeAnnotations.map(({
        _key,
        _type,
        ...value
      }) => ({
        name: _type,
        value
      }))
    })])]
  }),
  defineBehavior({
    on: "deserialization.success",
    actions: [({
      event
    }) => [raise({
      type: "insert.blocks",
      blocks: event.data,
      placement: "auto"
    })]]
  }),
  defineBehavior({
    on: "deserialization.failure",
    guard: ({
      event
    }) => {
      if (event.mimeType === "*/*")
        return !1;
      const availableData = getFirstAvailableData({
        dataTransfer: event.originEvent.originEvent.dataTransfer,
        startAfter: event.mimeType
      });
      return availableData ? {
        type: "deserialize.data",
        mimeType: availableData.mimeType,
        data: availableData.data,
        originEvent: event.originEvent
      } : !1;
    },
    actions: [(_, deserializeDataEvent) => [raise(deserializeDataEvent)]]
  }),
  defineBehavior({
    on: "deserialization.failure",
    actions: [({
      event
    }) => [{
      type: "effect",
      effect: () => {
        console.warn(`Deserialization of ${event.mimeType} failed with reason "${event.reason}"`);
      }
    }]]
  })
], abstractInsertBehaviors = [
  defineBehavior({
    on: "insert.blocks",
    guard: ({
      event
    }) => {
      const onlyBlock = event.blocks.length === 1 ? event.blocks.at(0) : void 0;
      return onlyBlock ? {
        onlyBlock
      } : !1;
    },
    actions: [({
      event
    }, {
      onlyBlock
    }) => [raise({
      type: "insert.block",
      block: onlyBlock,
      placement: event.placement,
      select: event.select ?? "end"
    })]]
  }),
  defineBehavior({
    on: "insert.blocks",
    guard: ({
      snapshot,
      event
    }) => {
      if (event.placement !== "before")
        return !1;
      const firstBlockKey = event.blocks.at(0)?._key ?? snapshot.context.keyGenerator(), lastBlockKey = event.blocks.at(-1)?._key ?? snapshot.context.keyGenerator();
      return {
        firstBlockKey,
        lastBlockKey
      };
    },
    actions: [({
      snapshot,
      event
    }, {
      firstBlockKey,
      lastBlockKey
    }) => [...event.blocks.map((block, index) => raise({
      type: "insert.block",
      block,
      placement: index === 0 ? "before" : "after",
      select: index !== event.blocks.length - 1 ? "end" : "none"
    })), ...event.select === "none" ? [raise({
      type: "select",
      at: snapshot.context.selection
    })] : event.select === "start" ? [raise({
      type: "select.block",
      at: [{
        _key: firstBlockKey
      }],
      select: "start"
    })] : [raise({
      type: "select.block",
      at: [{
        _key: lastBlockKey
      }],
      select: "end"
    })]]]
  }),
  defineBehavior({
    on: "insert.blocks",
    guard: ({
      snapshot,
      event
    }) => {
      if (event.placement !== "after")
        return !1;
      const firstBlockKey = event.blocks.at(0)?._key ?? snapshot.context.keyGenerator(), lastBlockKey = event.blocks.at(-1)?._key ?? snapshot.context.keyGenerator();
      return {
        firstBlockKey,
        lastBlockKey
      };
    },
    actions: [({
      snapshot,
      event
    }, {
      firstBlockKey,
      lastBlockKey
    }) => [...event.blocks.map((block, index) => raise({
      type: "insert.block",
      block,
      placement: "after",
      select: index !== event.blocks.length - 1 ? "end" : "none"
    })), ...event.select === "none" ? [raise({
      type: "select",
      at: snapshot.context.selection
    })] : event.select === "start" ? [raise({
      type: "select.block",
      at: [{
        _key: firstBlockKey
      }],
      select: "start"
    })] : [raise({
      type: "select.block",
      at: [{
        _key: lastBlockKey
      }],
      select: "end"
    })]]]
  }),
  defineBehavior({
    on: "insert.blocks",
    guard: ({
      snapshot,
      event
    }) => {
      if (event.placement !== "auto")
        return !1;
      const focusTextBlock = getFocusTextBlock(snapshot);
      if (!focusTextBlock || !isEmptyTextBlock(snapshot.context, focusTextBlock.node))
        return !1;
      const firstBlockKey = event.blocks.at(0)?._key ?? snapshot.context.keyGenerator(), lastBlockKey = event.blocks.at(-1)?._key ?? snapshot.context.keyGenerator();
      return {
        focusTextBlock,
        firstBlockKey,
        lastBlockKey
      };
    },
    actions: [({
      event
    }, {
      firstBlockKey,
      lastBlockKey
    }) => [...event.blocks.map((block, index) => raise({
      type: "insert.block",
      block,
      placement: index === 0 ? "auto" : "after",
      select: index !== event.blocks.length - 1 ? "end" : "none"
    })), ...event.select === "none" || event.select === "start" ? [raise({
      type: "select.block",
      at: [{
        _key: firstBlockKey
      }],
      select: "start"
    })] : [raise({
      type: "select.block",
      at: [{
        _key: lastBlockKey
      }],
      select: "end"
    })]]]
  }),
  defineBehavior({
    on: "insert.blocks",
    guard: ({
      snapshot,
      event
    }) => {
      if (event.placement !== "auto")
        return !1;
      const focusTextBlock = getFocusTextBlock(snapshot);
      if (!focusTextBlock || !snapshot.context.selection)
        return !1;
      const focusBlockStartPoint = getBlockStartPoint({
        context: snapshot.context,
        block: focusTextBlock
      }), focusBlockEndPoint = getBlockEndPoint({
        context: snapshot.context,
        block: focusTextBlock
      }), focusTextBlockAfter = sliceTextBlock({
        context: {
          schema: snapshot.context.schema,
          selection: {
            anchor: snapshot.context.selection.focus,
            focus: focusBlockEndPoint
          }
        },
        block: focusTextBlock.node
      });
      return {
        firstBlockKey: event.blocks.at(0)?._key ?? snapshot.context.keyGenerator(),
        focusBlockStartPoint,
        focusBlockEndPoint,
        focusTextBlockAfter,
        selection: snapshot.context.selection
      };
    },
    actions: [({
      event
    }, {
      focusBlockEndPoint,
      focusTextBlockAfter,
      selection,
      firstBlockKey,
      focusBlockStartPoint
    }) => [...event.blocks.flatMap((block, index) => index === 0 ? [...isEqualSelectionPoints(selection.focus, focusBlockEndPoint) ? [] : [raise({
      type: "delete",
      at: {
        anchor: selection.focus,
        focus: focusBlockEndPoint
      }
    })], raise({
      type: "insert.block",
      block,
      placement: "auto",
      select: "end"
    })] : index === event.blocks.length - 1 ? [raise({
      type: "insert.block",
      block,
      placement: "after",
      select: "end"
    }), raise({
      type: "insert.block",
      block: focusTextBlockAfter,
      placement: "auto",
      select: event.select === "end" ? "none" : "end"
    })] : [raise({
      type: "insert.block",
      block,
      placement: "after",
      select: "end"
    })]), ...event.select === "none" ? [raise({
      type: "select",
      at: selection
    })] : event.select === "start" ? [isEqualSelectionPoints(selection.focus, focusBlockStartPoint) ? raise({
      type: "select.block",
      at: [{
        _key: firstBlockKey
      }],
      select: "start"
    }) : raise({
      type: "select",
      at: {
        anchor: selection.focus,
        focus: selection.focus
      }
    })] : []]]
  }),
  defineBehavior({
    on: "insert.blocks",
    guard: ({
      event
    }) => event.placement === "auto",
    actions: [({
      event
    }) => event.blocks.map((block, index) => raise({
      type: "insert.block",
      block,
      placement: index === 0 ? "auto" : "after",
      select: event.select ?? "end"
    }))]
  }),
  defineBehavior({
    on: "insert.break",
    actions: [() => [raise({
      type: "split"
    })]]
  }),
  defineBehavior({
    on: "insert.child",
    guard: ({
      snapshot
    }) => {
      const lastBlock = getLastBlock$1(snapshot);
      return !lastBlock || snapshot.context.selection ? !1 : {
        lastBlockEndPoint: getBlockEndPoint({
          context: snapshot.context,
          block: lastBlock
        })
      };
    },
    actions: [({
      event
    }, {
      lastBlockEndPoint
    }) => [raise({
      type: "select",
      at: {
        anchor: lastBlockEndPoint,
        focus: lastBlockEndPoint
      }
    }), raise(event)]]
  }),
  defineBehavior({
    on: "insert.child",
    guard: ({
      snapshot
    }) => {
      const focusTextBlock = getFocusTextBlock(snapshot);
      return snapshot.context.selection && !focusTextBlock;
    },
    actions: [({
      snapshot,
      event
    }) => [raise({
      type: "insert.block",
      block: {
        _type: snapshot.context.schema.block.name,
        children: [{
          _type: snapshot.context.schema.span.name,
          text: "",
          marks: []
        }]
      },
      placement: "auto",
      select: "end"
    }), raise(event)]]
  }),
  defineBehavior({
    on: "insert.inline object",
    actions: [({
      event
    }) => [raise({
      type: "insert.child",
      child: {
        _type: event.inlineObject.name,
        ...event.inlineObject.value
      }
    })]]
  }),
  defineBehavior({
    on: "insert.soft break",
    actions: [() => [raise({
      type: "insert.text",
      text: `
`
    })]]
  }),
  defineBehavior({
    on: "insert.span",
    guard: ({
      snapshot
    }) => !getFocusTextBlock(snapshot),
    actions: [({
      snapshot,
      event
    }) => [raise({
      type: "insert.block",
      block: {
        _type: snapshot.context.schema.block.name,
        children: [{
          _type: snapshot.context.schema.span.name,
          text: "",
          marks: []
        }]
      },
      placement: "auto",
      select: "end"
    }), raise(event)]]
  }),
  defineBehavior({
    on: "insert.span",
    guard: ({
      snapshot,
      event
    }) => {
      const focusTextBlock = getFocusTextBlock(snapshot);
      return {
        markDefs: event.annotations?.map((annotation) => ({
          _type: annotation.name,
          _key: snapshot.context.keyGenerator(),
          ...annotation.value
        })) ?? [],
        focusTextBlock
      };
    },
    actions: [({
      snapshot,
      event
    }, {
      markDefs,
      focusTextBlock
    }) => [...focusTextBlock ? [raise({
      type: "block.set",
      at: focusTextBlock.path,
      props: {
        markDefs: [...focusTextBlock.node.markDefs ?? [], ...markDefs]
      }
    })] : [], raise({
      type: "insert.child",
      child: {
        _type: snapshot.context.schema.span.name,
        text: event.text,
        marks: [...event.decorators ?? [], ...markDefs.map((markDef) => markDef._key)]
      }
    })]]
  }),
  /**
   * If there's an expanded selection, then we delete the selection before we
   * insert the text.
   */
  defineBehavior({
    on: "insert.text",
    guard: ({
      snapshot
    }) => isSelectionExpanded(snapshot),
    actions: [({
      event
    }) => [raise({
      type: "delete"
    }), raise(event)]]
  }),
  /**
   * If there's no selection, then we select the end of the editor before we
   * we insert the text.
   */
  defineBehavior({
    on: "insert.text",
    guard: ({
      snapshot
    }) => {
      if (snapshot.context.selection)
        return !1;
      const lastBlok = getLastBlock$1(snapshot);
      return lastBlok ? {
        endPoint: getBlockEndPoint({
          context: snapshot.context,
          block: lastBlok
        })
      } : !1;
    },
    actions: [({
      event
    }, {
      endPoint
    }) => [raise({
      type: "select",
      at: {
        anchor: endPoint,
        focus: endPoint
      }
    }), raise(event)]]
  })
], shiftLeft = createKeyboardShortcut({
  default: [{
    key: "ArrowLeft",
    shift: !0,
    meta: !1,
    ctrl: !1,
    alt: !1
  }]
}), abstractKeyboardBehaviors = [
  /**
   * When Backspace is pressed on an inline object, Slate will raise a
   * `delete.backward` event with `unit: 'block'`. This is wrong and this
   * Behavior adjusts that.
   */
  defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      snapshot,
      event
    }) => defaultKeyboardShortcuts.backspace.guard(event.originEvent) && isSelectionCollapsed$1(snapshot) && getFocusInlineObject(snapshot),
    actions: [() => [raise({
      type: "delete.backward",
      unit: "character"
    })]]
  }),
  /**
   * When Delete is pressed on an inline object, Slate will raise a
   * `delete.forward` event with `unit: 'block'`. This is wrong and this
   * Behavior adjusts that.
   */
  defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      snapshot,
      event
    }) => defaultKeyboardShortcuts.delete.guard(event.originEvent) && isSelectionCollapsed$1(snapshot) && getFocusInlineObject(snapshot),
    actions: [() => [raise({
      type: "delete.forward",
      unit: "character"
    })]]
  }),
  defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      event
    }) => defaultKeyboardShortcuts.deleteWord.backward.guard(event.originEvent),
    actions: [() => [raise({
      type: "delete.backward",
      unit: "word"
    })]]
  }),
  defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      event
    }) => defaultKeyboardShortcuts.deleteWord.forward.guard(event.originEvent),
    actions: [() => [raise({
      type: "delete.forward",
      unit: "word"
    })]]
  }),
  /**
   * Allow raising an `insert.break` event when pressing Enter on an inline
   * object.
   */
  defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      snapshot,
      event
    }) => defaultKeyboardShortcuts.break.guard(event.originEvent) && isSelectionCollapsed$1(snapshot) && getFocusInlineObject(snapshot),
    actions: [() => [raise({
      type: "insert.break"
    })]]
  }),
  /**
   * On Firefox, Enter might collapse the selection. To mitigate this, we
   * `raise` an `insert.break` event manually.
   */
  defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      snapshot,
      event
    }) => defaultKeyboardShortcuts.break.guard(event.originEvent) && isSelectionExpanded(snapshot),
    actions: [() => [raise({
      type: "insert.break"
    })]]
  }),
  /**
   * On WebKit, Shift+Enter results in an `insertParagraph` input event rather
   * than an `insertLineBreak` input event. This Behavior makes sure we catch
   * that `keyboard.keydown` event beforehand and raise an `insert.soft break` manually.
   */
  defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      event
    }) => defaultKeyboardShortcuts.lineBreak.guard(event.originEvent),
    actions: [() => [raise({
      type: "insert.soft break"
    })]]
  }),
  /**
   * Manual handling of undo shortcuts.
   */
  defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      event
    }) => defaultKeyboardShortcuts.history.undo.guard(event.originEvent),
    actions: [() => [raise({
      type: "history.undo"
    })]]
  }),
  /**
   * Manual handling of redo shortcuts.
   */
  defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      event
    }) => defaultKeyboardShortcuts.history.redo.guard(event.originEvent),
    actions: [() => [raise({
      type: "history.redo"
    })]]
  }),
  /**
   * Fix edge case where Shift+ArrowLeft didn't reduce a selection hanging
   * onto an empty text block.
   */
  defineBehavior({
    on: "keyboard.keydown",
    guard: ({
      snapshot,
      event
    }) => {
      if (!snapshot.context.selection || !shiftLeft.guard(event.originEvent))
        return !1;
      const focusBlock = getFocusBlock$1(snapshot);
      if (!focusBlock)
        return !1;
      const previousBlock = getPreviousBlock({
        ...snapshot,
        context: {
          ...snapshot.context,
          selection: {
            anchor: {
              path: focusBlock.path,
              offset: 0
            },
            focus: {
              path: focusBlock.path,
              offset: 0
            }
          }
        }
      });
      return previousBlock && isTextBlock(snapshot.context, focusBlock.node) && snapshot.context.selection.focus.offset === 0 && isEmptyTextBlock(snapshot.context, focusBlock.node) ? {
        previousBlock,
        selection: snapshot.context.selection
      } : !1;
    },
    actions: [({
      snapshot
    }, {
      previousBlock,
      selection
    }) => [raise({
      type: "select",
      at: {
        anchor: selection.anchor,
        focus: getBlockEndPoint({
          context: snapshot.context,
          block: previousBlock
        })
      }
    })]]
  })
], abstractListItemBehaviors = [defineBehavior({
  on: "list item.add",
  guard: ({
    snapshot,
    event
  }) => snapshot.context.schema.lists.some((list) => list.name === event.listItem) ? {
    selectedTextBlocks: getSelectedTextBlocks(snapshot)
  } : !1,
  actions: [({
    event
  }, {
    selectedTextBlocks
  }) => selectedTextBlocks.map((block) => raise({
    type: "block.set",
    at: block.path,
    props: {
      level: block.node.level ?? 1,
      listItem: event.listItem
    }
  }))]
}), defineBehavior({
  on: "list item.remove",
  guard: ({
    snapshot
  }) => ({
    selectedTextBlocks: getSelectedTextBlocks(snapshot)
  }),
  actions: [(_, {
    selectedTextBlocks
  }) => selectedTextBlocks.map((block) => raise({
    type: "block.unset",
    at: block.path,
    props: ["level", "listItem"]
  }))]
}), defineBehavior({
  on: "list item.toggle",
  guard: ({
    snapshot,
    event
  }) => isActiveListItem(event.listItem)(snapshot),
  actions: [({
    event
  }) => [raise({
    type: "list item.remove",
    listItem: event.listItem
  })]]
}), defineBehavior({
  on: "list item.toggle",
  guard: ({
    snapshot,
    event
  }) => !isActiveListItem(event.listItem)(snapshot),
  actions: [({
    event
  }) => [raise({
    type: "list item.add",
    listItem: event.listItem
  })]]
})], abstractMoveBehaviors = [defineBehavior({
  on: "move.block up",
  guard: ({
    snapshot,
    event
  }) => {
    const previousBlock = getPreviousBlock({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: {
          anchor: {
            path: event.at,
            offset: 0
          },
          focus: {
            path: event.at,
            offset: 0
          }
        }
      }
    });
    return previousBlock ? {
      previousBlock
    } : !1;
  },
  actions: [({
    event
  }, {
    previousBlock
  }) => [raise({
    type: "move.block",
    at: event.at,
    to: previousBlock.path
  })]]
}), defineBehavior({
  on: "move.block down",
  guard: ({
    snapshot,
    event
  }) => {
    const nextBlock = getNextBlock({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: {
          anchor: {
            path: event.at,
            offset: 0
          },
          focus: {
            path: event.at,
            offset: 0
          }
        }
      }
    });
    return nextBlock ? {
      nextBlock
    } : !1;
  },
  actions: [({
    event
  }, {
    nextBlock
  }) => [raise({
    type: "move.block",
    at: event.at,
    to: nextBlock.path
  })]]
})], abstractSelectBehaviors = [defineBehavior({
  on: "select.block",
  guard: ({
    snapshot,
    event
  }) => {
    if (event.select !== "end")
      return !1;
    const block = getFocusBlock$1({
      ...snapshot,
      context: {
        ...snapshot.context,
        selection: {
          anchor: {
            path: event.at,
            offset: 0
          },
          focus: {
            path: event.at,
            offset: 0
          }
        }
      }
    });
    return block ? {
      blockEndPoint: getBlockEndPoint({
        context: snapshot.context,
        block
      })
    } : !1;
  },
  actions: [(_, {
    blockEndPoint
  }) => [raise({
    type: "select",
    at: {
      anchor: blockEndPoint,
      focus: blockEndPoint
    }
  })]]
}), defineBehavior({
  on: "select.block",
  actions: [({
    event
  }) => [raise({
    type: "select",
    at: {
      anchor: {
        path: event.at,
        offset: 0
      },
      focus: {
        path: event.at,
        offset: 0
      }
    }
  })]]
}), defineBehavior({
  on: "select.previous block",
  guard: ({
    snapshot
  }) => {
    const previousBlock = getPreviousBlock(snapshot);
    return previousBlock ? {
      previousBlock
    } : !1;
  },
  actions: [({
    event
  }, {
    previousBlock
  }) => [raise({
    type: "select.block",
    at: previousBlock.path,
    select: event.select
  })]]
}), defineBehavior({
  on: "select.next block",
  guard: ({
    snapshot
  }) => {
    const nextBlock = getNextBlock(snapshot);
    return nextBlock ? {
      nextBlock
    } : !1;
  },
  actions: [({
    event
  }, {
    nextBlock
  }) => [raise({
    type: "select.block",
    at: nextBlock.path,
    select: event.select
  })]]
})], abstractSerializeBehaviors = [defineBehavior({
  on: "serialize",
  actions: [({
    event
  }) => [raise({
    type: "serialize.data",
    mimeType: "application/x-portable-text",
    originEvent: event.originEvent
  }), raise({
    type: "serialize.data",
    mimeType: "application/json",
    originEvent: event.originEvent
  }), raise({
    type: "serialize.data",
    mimeType: "text/markdown",
    originEvent: event.originEvent
  }), raise({
    type: "serialize.data",
    mimeType: "text/html",
    originEvent: event.originEvent
  }), raise({
    type: "serialize.data",
    mimeType: "text/plain",
    originEvent: event.originEvent
  })]]
}), defineBehavior({
  on: "serialize.data",
  guard: ({
    snapshot,
    event
  }) => {
    const converter = snapshot.context.converters.find((converter2) => converter2.mimeType === event.mimeType);
    return converter ? converter.serialize({
      snapshot,
      event: {
        type: "serialize",
        originEvent: event.originEvent.type
      }
    }) : !1;
  },
  actions: [({
    event
  }, serializeEvent) => [raise({
    ...serializeEvent,
    originEvent: event.originEvent
  })]]
}), defineBehavior({
  on: "serialization.success",
  actions: [({
    event
  }) => [{
    type: "effect",
    effect: () => {
      event.originEvent.originEvent.dataTransfer.setData(event.mimeType, event.data);
    }
  }]]
}), defineBehavior({
  on: "serialization.failure",
  actions: [({
    event
  }) => [{
    type: "effect",
    effect: () => {
      console.warn(`Serialization of ${event.mimeType} failed with reason "${event.reason}"`);
    }
  }]]
})], abstractSplitBehaviors = [
  /**
   * You can't split an inline object.
   */
  defineBehavior({
    on: "split",
    guard: ({
      snapshot
    }) => isSelectionCollapsed(snapshot.context.selection) && getFocusInlineObject(snapshot),
    actions: []
  }),
  /**
   * You can't split a block object.
   */
  defineBehavior({
    on: "split",
    guard: ({
      snapshot
    }) => isSelectionCollapsed(snapshot.context.selection) && getFocusBlockObject(snapshot),
    actions: []
  }),
  defineBehavior({
    on: "split",
    guard: ({
      snapshot
    }) => {
      const selection = snapshot.context.selection;
      if (!selection || isSelectionCollapsed(selection))
        return !1;
      const startPoint = getSelectionStartPoint(selection), endPoint = getSelectionEndPoint(selection);
      if (!startPoint || !endPoint)
        return !1;
      const startBlock = getSelectionStartBlock(snapshot), endBlock = getSelectionEndBlock(snapshot);
      if (!startBlock || !endBlock)
        return !1;
      const startBlockStartPoint = getBlockStartPoint({
        context: snapshot.context,
        block: startBlock
      }), endBlockEndPoint = getBlockEndPoint({
        context: snapshot.context,
        block: endBlock
      });
      return !!(isTextBlock(snapshot.context, startBlock.node) && isTextBlock(snapshot.context, endBlock.node) && !isEqualSelectionPoints(startPoint, startBlockStartPoint) && !isEqualSelectionPoints(endPoint, endBlockEndPoint));
    },
    actions: [() => [raise({
      type: "delete"
    }), raise({
      type: "split"
    })]]
  }),
  defineBehavior({
    on: "split",
    guard: ({
      snapshot
    }) => isSelectionExpanded(snapshot),
    actions: [() => [raise({
      type: "delete"
    })]]
  }),
  defineBehavior({
    on: "split",
    guard: ({
      snapshot
    }) => {
      const selection = snapshot.context.selection;
      if (!selection || !isSelectionCollapsed(selection))
        return !1;
      const selectionStartPoint = getSelectionStartPoint(selection), focusTextBlock = getFocusTextBlock(snapshot);
      if (!focusTextBlock)
        return !1;
      const blockEndPoint = getBlockEndPoint({
        context: snapshot.context,
        block: focusTextBlock
      }), newTextBlockSelection = {
        anchor: selectionStartPoint,
        focus: blockEndPoint
      }, newTextBlock = parseBlock({
        block: sliceTextBlock({
          context: {
            ...snapshot.context,
            selection: newTextBlockSelection
          },
          block: focusTextBlock.node
        }),
        context: snapshot.context,
        options: {
          normalize: !1,
          removeUnusedMarkDefs: !0,
          validateFields: !1
        }
      });
      return newTextBlock ? {
        newTextBlock,
        newTextBlockSelection
      } : !1;
    },
    actions: [(_, {
      newTextBlock,
      newTextBlockSelection
    }) => isSelectionCollapsed(newTextBlockSelection) ? [raise({
      type: "insert.block",
      block: newTextBlock,
      placement: "after",
      select: "start"
    })] : [raise({
      type: "delete",
      at: newTextBlockSelection
    }), raise({
      type: "insert.block",
      block: newTextBlock,
      placement: "after",
      select: "start"
    })]]
  })
], abstractStyleBehaviors = [defineBehavior({
  on: "style.add",
  guard: ({
    snapshot
  }) => ({
    selectedTextBlocks: getSelectedTextBlocks(snapshot)
  }),
  actions: [({
    event
  }, {
    selectedTextBlocks
  }) => selectedTextBlocks.map((block) => raise({
    type: "block.set",
    at: block.path,
    props: {
      style: event.style
    }
  }))]
}), defineBehavior({
  on: "style.remove",
  guard: ({
    snapshot
  }) => ({
    selectedTextBlocks: getSelectedTextBlocks(snapshot)
  }),
  actions: [(_, {
    selectedTextBlocks
  }) => selectedTextBlocks.map((block) => raise({
    type: "block.unset",
    at: block.path,
    props: ["style"]
  }))]
}), defineBehavior({
  on: "style.toggle",
  guard: ({
    snapshot,
    event
  }) => isActiveStyle(event.style)(snapshot),
  actions: [({
    event
  }) => [raise({
    type: "style.remove",
    style: event.style
  })]]
}), defineBehavior({
  on: "style.toggle",
  guard: ({
    snapshot,
    event
  }) => !isActiveStyle(event.style)(snapshot),
  actions: [({
    event
  }) => [raise({
    type: "style.add",
    style: event.style
  })]]
})], abstractBehaviors = [defineBehavior({
  on: "clipboard.copy",
  guard: ({
    snapshot
  }) => {
    const focusSpan = getFocusSpan$1(snapshot), selectionCollapsed = isSelectionCollapsed$1(snapshot);
    return focusSpan && selectionCollapsed;
  },
  actions: []
}), defineBehavior({
  on: "clipboard.copy",
  actions: [({
    event
  }) => [raise({
    type: "serialize",
    originEvent: event
  })]]
}), defineBehavior({
  on: "clipboard.cut",
  guard: ({
    snapshot
  }) => {
    const focusSpan = getFocusSpan$1(snapshot), selectionCollapsed = isSelectionCollapsed$1(snapshot);
    return focusSpan && selectionCollapsed;
  },
  actions: []
}), defineBehavior({
  on: "clipboard.cut",
  guard: ({
    snapshot
  }) => snapshot.context.selection ? {
    selection: snapshot.context.selection
  } : !1,
  actions: [({
    event
  }, {
    selection
  }) => [raise({
    type: "serialize",
    originEvent: event
  }), raise({
    type: "delete",
    at: selection
  })]]
}), defineBehavior({
  on: "drag.dragstart",
  actions: [({
    event
  }) => [raise({
    type: "serialize",
    originEvent: event
  })]]
}), defineBehavior({
  on: "clipboard.paste",
  guard: ({
    snapshot
  }) => snapshot.context.selection && isSelectionExpanded(snapshot) ? {
    selection: snapshot.context.selection
  } : !1,
  actions: [({
    event
  }, {
    selection
  }) => [raise({
    type: "delete",
    at: selection
  }), raise({
    type: "deserialize",
    originEvent: event
  })]]
}), defineBehavior({
  on: "clipboard.paste",
  actions: [({
    event
  }) => [raise({
    type: "deserialize",
    originEvent: event
  })]]
}), defineBehavior({
  on: "input.*",
  actions: [({
    event
  }) => [raise({
    type: "deserialize",
    originEvent: event
  })]]
}), ...abstractAnnotationBehaviors, ...abstractDecoratorBehaviors, ...abstractDeleteBehaviors, ...abstractDeserializeBehaviors, ...abstractInsertBehaviors, ...abstractKeyboardBehaviors, ...abstractListItemBehaviors, ...abstractMoveBehaviors, ...abstractStyleBehaviors, ...abstractSelectBehaviors, ...abstractSerializeBehaviors, ...abstractSplitBehaviors];
function isSyntheticBehaviorEvent(event) {
  return !isCustomBehaviorEvent(event) && !isNativeBehaviorEvent(event) && !isAbstractBehaviorEvent(event);
}
const abstractBehaviorEventTypes = ["annotation.set", "annotation.toggle", "decorator.toggle", "delete.backward", "delete.block", "delete.child", "delete.forward", "delete.text", "deserialize", "deserialize.data", "deserialization.success", "deserialization.failure", "insert.blocks", "insert.break", "insert.inline object", "insert.soft break", "insert.span", "list item.add", "list item.remove", "list item.toggle", "move.block down", "move.block up", "select.block", "select.previous block", "select.next block", "serialize", "serialize.data", "serialization.success", "serialization.failure", "split", "style.add", "style.remove", "style.toggle"];
function isAbstractBehaviorEvent(event) {
  return abstractBehaviorEventTypes.includes(event.type);
}
const nativeBehaviorEventTypes = ["clipboard.copy", "clipboard.cut", "clipboard.paste", "drag.dragstart", "drag.drag", "drag.dragend", "drag.dragenter", "drag.dragover", "drag.dragleave", "drag.drop", "input.*", "keyboard.keydown", "keyboard.keyup", "mouse.click"];
function isNativeBehaviorEvent(event) {
  return nativeBehaviorEventTypes.includes(event.type);
}
function isCustomBehaviorEvent(event) {
  return event.type.startsWith("custom.");
}
const debug$5 = debugWithName("behaviors:event");
function eventCategory(event) {
  return isNativeBehaviorEvent(event) ? "native" : isAbstractBehaviorEvent(event) ? "synthetic" : isCustomBehaviorEvent(event) ? "custom" : "synthetic";
}
function performEvent({
  mode,
  behaviors,
  remainingEventBehaviors,
  event,
  editor,
  keyGenerator,
  schema,
  getSnapshot,
  nativeEvent,
  sendBack
}) {
  mode === "send" && !isNativeBehaviorEvent(event) && createUndoStepId(editor), debug$5(`(${mode}:${eventCategory(event)})`, JSON.stringify(event, null, 2));
  const eventBehaviors = [...remainingEventBehaviors, ...abstractBehaviors].filter((behavior) => {
    if (behavior.on === "*")
      return !0;
    const [listenedNamespace] = behavior.on.includes("*") && behavior.on.includes(".") ? behavior.on.split(".") : [void 0], [eventNamespace] = event.type.includes(".") ? event.type.split(".") : [void 0];
    return listenedNamespace !== void 0 && eventNamespace !== void 0 && listenedNamespace === eventNamespace || listenedNamespace !== void 0 && eventNamespace === void 0 && listenedNamespace === event.type ? !0 : behavior.on === event.type;
  });
  if (eventBehaviors.length === 0 && isSyntheticBehaviorEvent(event)) {
    nativeEvent?.preventDefault(), mode === "send" && clearUndoStepId(editor), withPerformingBehaviorOperation(editor, () => {
      debug$5(`(execute:${eventCategory(event)})`, JSON.stringify(event, null, 2)), performOperation({
        context: {
          keyGenerator,
          schema
        },
        operation: {
          ...event,
          editor
        }
      });
    }), editor.onChange();
    return;
  }
  const guardSnapshot = getSnapshot();
  let nativeEventPrevented = !1, defaultBehaviorOverwritten = !1, eventBehaviorIndex = -1;
  for (const eventBehavior of eventBehaviors) {
    eventBehaviorIndex++;
    let shouldRun = !1;
    try {
      shouldRun = eventBehavior.guard === void 0 || eventBehavior.guard({
        snapshot: guardSnapshot,
        event,
        dom: createEditorDom(sendBack, editor)
      });
    } catch (error) {
      console.error(new Error(`Evaluating guard for "${event.type}" failed due to: ${error.message}`));
    }
    if (!shouldRun)
      continue;
    defaultBehaviorOverwritten = !0, eventBehavior.actions.length === 0 && (nativeEventPrevented = !0);
    let actionSetIndex = -1;
    for (const actionSet of eventBehavior.actions) {
      actionSetIndex++;
      const actionsSnapshot = getSnapshot();
      let actions = [];
      try {
        actions = actionSet({
          snapshot: actionsSnapshot,
          event,
          dom: createEditorDom(sendBack, editor)
        }, shouldRun);
      } catch (error) {
        console.error(new Error(`Evaluating actions for "${event.type}" failed due to: ${error.message}`));
      }
      if (actions.length === 0)
        continue;
      nativeEventPrevented = actions.some((action) => action.type === "raise" || action.type === "execute") || !actions.some((action) => action.type === "forward");
      let undoStepCreated = !1;
      actionSetIndex > 0 && (createUndoStepId(editor), undoStepCreated = !0), !undoStepCreated && actions.some((action) => action.type === "execute") && (createUndoStepId(editor), undoStepCreated = !0);
      const actionTypes = actions.map((action) => action.type), uniqueActionTypes = new Set(actionTypes), raiseGroup = actionTypes.length > 1 && uniqueActionTypes.size === 1 && uniqueActionTypes.has("raise"), executeGroup = actionTypes.length > 1 && uniqueActionTypes.size === 1 && uniqueActionTypes.has("execute");
      withoutNormalizingConditional(editor, () => raiseGroup || executeGroup, () => {
        for (const action of actions) {
          if (action.type === "effect") {
            try {
              action.effect({
                send: sendBack
              });
            } catch (error) {
              console.error(new Error(`Executing effect as a result of "${event.type}" failed due to: ${error.message}`));
            }
            continue;
          }
          if (action.type === "forward") {
            const remainingEventBehaviors2 = eventBehaviors.slice(eventBehaviorIndex + 1);
            performEvent({
              mode: mode === "execute" ? "execute" : "forward",
              behaviors,
              remainingEventBehaviors: remainingEventBehaviors2,
              event: action.event,
              editor,
              keyGenerator,
              schema,
              getSnapshot,
              nativeEvent,
              sendBack
            });
            continue;
          }
          if (action.type === "raise") {
            performEvent({
              mode: mode === "execute" ? "execute" : "raise",
              behaviors,
              remainingEventBehaviors: mode === "execute" ? remainingEventBehaviors : behaviors,
              event: action.event,
              editor,
              keyGenerator,
              schema,
              getSnapshot,
              nativeEvent,
              sendBack
            });
            continue;
          }
          performEvent({
            mode: "execute",
            behaviors,
            remainingEventBehaviors: [],
            event: action.event,
            editor,
            keyGenerator,
            schema,
            getSnapshot,
            nativeEvent: void 0,
            sendBack
          });
        }
      }), undoStepCreated && clearUndoStepId(editor);
    }
    break;
  }
  !defaultBehaviorOverwritten && isSyntheticBehaviorEvent(event) ? (nativeEvent?.preventDefault(), mode === "send" && clearUndoStepId(editor), withPerformingBehaviorOperation(editor, () => {
    debug$5(`(execute:${eventCategory(event)})`, JSON.stringify(event, null, 2)), performOperation({
      context: {
        keyGenerator,
        schema
      },
      operation: {
        ...event,
        editor
      }
    });
  }), editor.onChange()) : nativeEventPrevented && nativeEvent?.preventDefault();
}
function sortByPriority(items) {
  if (items.length === 0)
    return [];
  const itemsWithPriority = items.filter((item) => item.priority !== void 0), itemsWithoutPriority = items.filter((item) => item.priority === void 0);
  if (itemsWithPriority.length === 0)
    return items;
  const itemsByPriorityId = new Map(itemsWithPriority.map((item) => [item.priority.id, item])), graph = /* @__PURE__ */ new Map(), inDegree = /* @__PURE__ */ new Map();
  function ensureNode(id) {
    graph.has(id) || (graph.set(id, /* @__PURE__ */ new Set()), inDegree.set(id, 0));
  }
  for (const item of itemsWithPriority) {
    const id = item.priority.id;
    ensureNode(id);
  }
  function addEdge(fromId, toId) {
    !graph.has(fromId) || !graph.has(toId) || (graph.get(fromId)?.add(toId), inDegree.set(toId, (inDegree.get(toId) ?? 0) + 1));
  }
  for (const item of itemsWithPriority) {
    const id = item.priority.id, visited = /* @__PURE__ */ new Set();
    let ref = item.priority.reference;
    for (; ref; ) {
      const refId = ref.priority.id;
      if (ensureNode(refId), visited.has(refId))
        throw new Error("Circular dependency detected in priorities");
      visited.add(refId), ref.importance === "higher" ? addEdge(id, refId) : addEdge(refId, id), ref = ref.priority.reference;
    }
  }
  const queue = [];
  for (const [id, degree] of inDegree)
    degree === 0 && queue.push(id);
  const result = [];
  for (; queue.length > 0; ) {
    const currentId = queue.shift(), currentItem = itemsByPriorityId.get(currentId);
    currentItem && result.push(currentItem);
    for (const neighborId of graph.get(currentId) ?? []) {
      const newDegree = (inDegree.get(neighborId) ?? 0) - 1;
      inDegree.set(neighborId, newDegree), newDegree === 0 && queue.push(neighborId);
    }
  }
  for (const item of itemsWithPriority)
    result.includes(item) || result.push(item);
  return [...result, ...itemsWithoutPriority];
}
function createEditorSnapshot({
  converters,
  editor,
  keyGenerator,
  readOnly,
  schema
}) {
  const selection = editor.selection ? slateRangeToSelection({
    schema,
    editor,
    range: editor.selection
  }) : null, context = {
    converters,
    keyGenerator,
    readOnly,
    schema,
    selection,
    value: editor.value
  };
  return {
    blockIndexMap: editor.blockIndexMap,
    context,
    decoratorState: editor.decoratorState
  };
}
const debug$4 = debugWithName("editor machine");
function rerouteExternalBehaviorEvent({
  event,
  slateEditor
}) {
  switch (event.type) {
    case "blur":
      return {
        type: "blur",
        editor: slateEditor
      };
    case "focus":
      return {
        type: "focus",
        editor: slateEditor
      };
    case "insert.block object":
      return {
        type: "behavior event",
        behaviorEvent: {
          type: "insert.block",
          block: {
            _type: event.blockObject.name,
            ...event.blockObject.value ?? {}
          },
          placement: event.placement
        },
        editor: slateEditor
      };
    default:
      return {
        type: "behavior event",
        behaviorEvent: event,
        editor: slateEditor
      };
  }
}
const editorMachine = setup({
  types: {
    context: {},
    events: {},
    emitted: {},
    input: {},
    tags: {}
  },
  actions: {
    "add behavior to context": assign({
      behaviors: ({
        context,
        event
      }) => (assertEvent(event, "add behavior"), /* @__PURE__ */ new Set([...context.behaviors, event.behaviorConfig])),
      behaviorsSorted: !1
    }),
    "remove behavior from context": assign({
      behaviors: ({
        context,
        event
      }) => (assertEvent(event, "remove behavior"), context.behaviors.delete(event.behaviorConfig), /* @__PURE__ */ new Set([...context.behaviors]))
    }),
    "add slate editor to context": assign({
      slateEditor: ({
        context,
        event
      }) => event.type === "add slate editor" ? event.editor : context.slateEditor
    }),
    "emit patch event": emit(({
      event
    }) => (assertEvent(event, "internal.patch"), event)),
    "emit mutation event": emit(({
      event
    }) => (assertEvent(event, "mutation"), event)),
    "emit read only": emit({
      type: "read only"
    }),
    "emit editable": emit({
      type: "editable"
    }),
    "defer event": assign({
      pendingEvents: ({
        context,
        event
      }) => (assertEvent(event, ["internal.patch", "mutation"]), [...context.pendingEvents, event])
    }),
    "emit pending events": enqueueActions(({
      context,
      enqueue
    }) => {
      for (const event of context.pendingEvents)
        enqueue.emit(event);
    }),
    "emit ready": emit({
      type: "ready"
    }),
    "clear pending events": assign({
      pendingEvents: []
    }),
    "defer incoming patches": assign({
      pendingIncomingPatchesEvents: ({
        context,
        event
      }) => event.type === "patches" ? [...context.pendingIncomingPatchesEvents, event] : context.pendingIncomingPatchesEvents
    }),
    "emit pending incoming patches": enqueueActions(({
      context,
      enqueue
    }) => {
      for (const event of context.pendingIncomingPatchesEvents)
        enqueue.emit(event);
    }),
    "clear pending incoming patches": assign({
      pendingIncomingPatchesEvents: []
    }),
    "handle blur": ({
      event
    }) => {
      assertEvent(event, "blur");
      try {
        ReactEditor.blur(event.editor);
      } catch (error) {
        console.error(new Error(`Failed to blur editor: ${error.message}`));
      }
    },
    "handle focus": ({
      context
    }) => {
      if (!context.slateEditor) {
        console.error("No Slate editor found to focus");
        return;
      }
      try {
        const currentSelection = context.slateEditor.selection;
        ReactEditor.focus(context.slateEditor), currentSelection && Transforms.select(context.slateEditor, currentSelection);
      } catch (error) {
        console.error(new Error(`Failed to focus editor: ${error.message}`));
      }
    },
    "handle behavior event": ({
      context,
      event,
      self
    }) => {
      assertEvent(event, ["behavior event"]);
      try {
        const behaviors = [...context.behaviors.values()].map((config) => config.behavior);
        performEvent({
          mode: "send",
          behaviors,
          remainingEventBehaviors: behaviors,
          event: event.behaviorEvent,
          editor: event.editor,
          keyGenerator: context.keyGenerator,
          schema: context.schema,
          getSnapshot: () => createEditorSnapshot({
            converters: [...context.converters],
            editor: event.editor,
            keyGenerator: context.keyGenerator,
            readOnly: self.getSnapshot().matches({
              "edit mode": "read only"
            }),
            schema: context.schema
          }),
          nativeEvent: event.nativeEvent,
          sendBack: (eventSentBack) => {
            if (eventSentBack.type === "set drag ghost") {
              self.send(eventSentBack);
              return;
            }
            self.send(rerouteExternalBehaviorEvent({
              event: eventSentBack,
              slateEditor: event.editor
            }));
          }
        });
      } catch (error) {
        console.error(new Error(`Raising "${event.behaviorEvent.type}" failed due to: ${error.message}`));
      }
    },
    "sort behaviors": assign({
      behaviors: ({
        context
      }) => context.behaviorsSorted ? context.behaviors : new Set(sortByPriority([...context.behaviors.values()])),
      behaviorsSorted: !0
    })
  },
  guards: {
    "slate is busy": ({
      context
    }) => context.slateEditor ? context.slateEditor.operations.length > 0 : !1,
    "slate is normalizing node": ({
      context
    }) => context.slateEditor ? isNormalizingNode(context.slateEditor) : !1
  }
}).createMachine({
  id: "editor",
  context: ({
    input
  }) => ({
    behaviors: new Set(coreBehaviorsConfig),
    behaviorsSorted: !1,
    converters: new Set(input.converters ?? []),
    getLegacySchema: input.getLegacySchema,
    keyGenerator: input.keyGenerator,
    pendingEvents: [],
    pendingIncomingPatchesEvents: [],
    schema: input.schema,
    selection: null,
    initialReadOnly: input.readOnly ?? !1,
    initialValue: input.initialValue
  }),
  on: {
    "add behavior": {
      actions: "add behavior to context"
    },
    "remove behavior": {
      actions: "remove behavior from context"
    },
    "add slate editor": {
      actions: "add slate editor to context"
    },
    "update selection": {
      actions: [assign({
        selection: ({
          event
        }) => event.selection
      }), emit(({
        event
      }) => ({
        ...event,
        type: "selection"
      }))]
    },
    "set drag ghost": {
      actions: assign({
        dragGhost: ({
          event
        }) => event.ghost
      })
    }
  },
  type: "parallel",
  states: {
    "edit mode": {
      initial: "read only",
      states: {
        "read only": {
          initial: "determine initial edit mode",
          on: {
            "behavior event": {
              actions: ["sort behaviors", "handle behavior event"],
              guard: ({
                event
              }) => event.behaviorEvent.type === "clipboard.copy" || event.behaviorEvent.type === "mouse.click" || event.behaviorEvent.type === "serialize" || event.behaviorEvent.type === "serialization.failure" || event.behaviorEvent.type === "serialization.success" || event.behaviorEvent.type === "select"
            }
          },
          states: {
            "determine initial edit mode": {
              entry: [() => {
                debug$4("entry: edit mode->read only->determine initial edit mode");
              }],
              exit: [() => {
                debug$4("exit: edit mode->read only->determine initial edit mode");
              }],
              on: {
                "done syncing value": [{
                  target: "#editor.edit mode.read only.read only",
                  guard: ({
                    context
                  }) => context.initialReadOnly
                }, {
                  target: "#editor.edit mode.editable"
                }]
              }
            },
            "read only": {
              entry: [() => {
                debug$4("entry: edit mode->read only->read only");
              }],
              exit: [() => {
                debug$4("exit: edit mode->read only->read only");
              }],
              on: {
                "update readOnly": {
                  guard: ({
                    event
                  }) => !event.readOnly,
                  target: "#editor.edit mode.editable",
                  actions: ["emit editable"]
                }
              }
            }
          }
        },
        editable: {
          on: {
            "update readOnly": {
              guard: ({
                event
              }) => event.readOnly,
              target: "#editor.edit mode.read only.read only",
              actions: ["emit read only"]
            },
            "behavior event": {
              actions: ["sort behaviors", "handle behavior event"]
            },
            blur: {
              actions: "handle blur"
            },
            focus: {
              target: ".focusing",
              actions: [assign({
                slateEditor: ({
                  event
                }) => event.editor
              })]
            }
          },
          initial: "idle",
          states: {
            idle: {
              entry: [() => {
                debug$4("entry: edit mode->editable->idle");
              }],
              exit: [() => {
                debug$4("exit: edit mode->editable-idle");
              }],
              on: {
                dragstart: {
                  actions: [assign({
                    internalDrag: ({
                      event
                    }) => ({
                      origin: event.origin
                    })
                  })],
                  target: "dragging internally"
                }
              }
            },
            focusing: {
              initial: "checking if busy",
              states: {
                "checking if busy": {
                  entry: [() => {
                    debug$4("entry: edit mode->editable->focusing->checking if busy");
                  }],
                  exit: [() => {
                    debug$4("exit: edit mode->editable->focusing->checking if busy");
                  }],
                  always: [{
                    guard: "slate is busy",
                    target: "busy"
                  }, {
                    target: "#editor.edit mode.editable.idle",
                    actions: ["handle focus"]
                  }]
                },
                busy: {
                  entry: [() => {
                    debug$4("entry: edit mode->editable->focusing-busy");
                  }],
                  exit: [() => {
                    debug$4("exit: edit mode->editable->focusing->busy");
                  }],
                  after: {
                    10: {
                      target: "checking if busy"
                    }
                  }
                }
              }
            },
            "dragging internally": {
              entry: [() => {
                debug$4("entry: edit mode->editable->dragging internally");
              }],
              exit: [() => {
                debug$4("exit: edit mode->editable->dragging internally");
              }, ({
                context
              }) => {
                if (context.dragGhost)
                  try {
                    context.dragGhost.parentNode?.removeChild(context.dragGhost);
                  } catch (error) {
                    console.error(new Error(`Removing the drag ghost failed due to: ${error.message}`));
                  }
              }, assign({
                dragGhost: void 0
              }), assign({
                internalDrag: void 0
              })],
              tags: ["dragging internally"],
              on: {
                dragend: {
                  target: "idle"
                },
                drop: {
                  target: "idle"
                }
              }
            }
          }
        }
      }
    },
    setup: {
      initial: "setting up",
      states: {
        "setting up": {
          entry: [() => {
            debug$4("entry: setup->setting up");
          }],
          exit: [() => {
            debug$4("exit: setup->setting up");
          }, "emit ready", "emit pending incoming patches", "clear pending incoming patches"],
          on: {
            "internal.patch": {
              actions: "defer event"
            },
            mutation: {
              actions: "defer event"
            },
            "done syncing value": {
              target: "set up"
            },
            patches: {
              actions: ["defer incoming patches"]
            }
          }
        },
        "set up": {
          type: "parallel",
          states: {
            "value sync": {
              initial: "idle",
              states: {
                idle: {
                  entry: [() => {
                    debug$4("entry: setup->set up->value sync->idle");
                  }],
                  exit: [() => {
                    debug$4("exit: setup->set up->value sync->idle");
                  }],
                  on: {
                    patches: {
                      actions: [emit(({
                        event
                      }) => event)]
                    },
                    "syncing value": {
                      target: "syncing value"
                    }
                  }
                },
                "syncing value": {
                  entry: [() => {
                    debug$4("entry: setup->set up->value sync->syncing value");
                  }],
                  exit: [() => {
                    debug$4("exit: setup->set up->value sync->syncing value");
                  }, "emit pending incoming patches", "clear pending incoming patches"],
                  on: {
                    patches: {
                      actions: ["defer incoming patches"]
                    },
                    "done syncing value": {
                      target: "idle"
                    }
                  }
                }
              }
            },
            writing: {
              initial: "pristine",
              states: {
                pristine: {
                  initial: "idle",
                  states: {
                    idle: {
                      entry: [() => {
                        debug$4("entry: setup->set up->writing->pristine->idle");
                      }],
                      exit: [() => {
                        debug$4("exit: setup->set up->writing->pristine->idle");
                      }],
                      on: {
                        "internal.patch": [{
                          guard: "slate is normalizing node",
                          actions: "defer event"
                        }, {
                          actions: "defer event",
                          target: "#editor.setup.set up.writing.dirty"
                        }],
                        mutation: [{
                          guard: "slate is normalizing node",
                          actions: "defer event"
                        }, {
                          actions: "defer event",
                          target: "#editor.setup.set up.writing.dirty"
                        }]
                      }
                    }
                  }
                },
                dirty: {
                  entry: [() => {
                    debug$4("entry: setup->set up->writing->dirty");
                  }, "emit pending events", "clear pending events"],
                  exit: [() => {
                    debug$4("exit: setup->set up->writing->dirty");
                  }],
                  on: {
                    "internal.patch": {
                      actions: "emit patch event"
                    },
                    mutation: {
                      actions: "emit mutation event"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}), debug$3 = debugWithName("mutation-machine"), mutationMachine = setup({
  types: {
    context: {},
    events: {},
    input: {},
    emitted: {}
  },
  actions: {
    "assign readOnly": assign({
      readOnly: ({
        context,
        event
      }) => event.type === "update readOnly" ? event.readOnly : context.readOnly
    }),
    "emit patch": emit(({
      event
    }) => (assertEvent(event, "patch"), {
      type: "patch",
      patch: event.patch
    })),
    "emit has pending mutations": emit({
      type: "has pending mutations"
    }),
    "emit mutations": enqueueActions(({
      context,
      enqueue
    }) => {
      for (const bulk of context.pendingMutations)
        enqueue.emit({
          type: "mutation",
          patches: bulk.patches,
          snapshot: bulk.value
        });
    }),
    "clear pending mutations": assign({
      pendingMutations: []
    }),
    "defer mutation": assign({
      pendingMutations: ({
        context,
        event
      }) => {
        if (assertEvent(event, "patch"), context.pendingMutations.length === 0)
          return [{
            operationId: event.operationId,
            value: event.value,
            patches: [event.patch]
          }];
        const lastBulk = context.pendingMutations.at(-1);
        return lastBulk && lastBulk.operationId === event.operationId ? context.pendingMutations.slice(0, -1).concat({
          value: event.value,
          operationId: lastBulk.operationId,
          patches: [...lastBulk.patches, event.patch]
        }) : context.pendingMutations.concat({
          value: event.value,
          operationId: event.operationId,
          patches: [event.patch]
        });
      }
    }),
    "clear pending patch events": assign({
      pendingPatchEvents: []
    }),
    "defer patch": assign({
      pendingPatchEvents: ({
        context,
        event
      }) => event.type === "patch" ? [...context.pendingPatchEvents, event] : context.pendingPatchEvents
    }),
    "emit pending patch events": enqueueActions(({
      context,
      enqueue
    }) => {
      for (const event of context.pendingPatchEvents)
        enqueue.emit(event);
    })
  },
  actors: {
    "type listener": fromCallback(({
      input,
      sendBack
    }) => {
      const originalApply = input.slateEditor.apply;
      return input.slateEditor.apply = (op) => {
        op.type === "insert_text" || op.type === "remove_text" ? sendBack({
          type: "typing"
        }) : sendBack({
          type: "not typing"
        }), originalApply(op);
      }, () => {
        input.slateEditor.apply = originalApply;
      };
    }),
    "mutation interval": fromCallback(({
      sendBack
    }) => {
      const interval = setInterval(() => {
        sendBack({
          type: "emit changes"
        });
      }, process.env.NODE_ENV === "test" ? 250 : 1e3);
      return () => {
        clearInterval(interval);
      };
    })
  },
  guards: {
    "is read-only": ({
      context
    }) => context.readOnly,
    "slate is normalizing": ({
      context
    }) => Editor.isNormalizing(context.slateEditor)
  },
  delays: {
    "type debounce": 250
  }
}).createMachine({
  id: "mutation",
  context: ({
    input
  }) => ({
    pendingMutations: [],
    pendingPatchEvents: [],
    readOnly: input.readOnly,
    schema: input.schema,
    slateEditor: input.slateEditor
  }),
  on: {
    "update readOnly": {
      actions: ["assign readOnly"]
    }
  },
  type: "parallel",
  states: {
    typing: {
      initial: "idle",
      invoke: {
        src: "type listener",
        input: ({
          context
        }) => ({
          slateEditor: context.slateEditor
        })
      },
      states: {
        idle: {
          entry: [() => {
            debug$3("entry: typing->idle");
          }],
          exit: [() => {
            debug$3("exit: typing->idle"), debug$3("entry: typing->typing");
          }],
          on: {
            typing: {
              target: "typing"
            }
          }
        },
        typing: {
          after: {
            "type debounce": {
              target: "idle",
              actions: [raise$1({
                type: "emit changes"
              }), () => {
                debug$3("exit: typing->typing");
              }]
            }
          },
          on: {
            "not typing": {
              target: "idle",
              actions: [raise$1({
                type: "emit changes"
              })]
            },
            typing: {
              target: "typing",
              reenter: !0
            }
          }
        }
      }
    },
    mutations: {
      initial: "idle",
      states: {
        idle: {
          entry: [() => {
            debug$3("entry: mutations->idle");
          }],
          exit: [() => {
            debug$3("exit: mutations->idle");
          }],
          on: {
            patch: [{
              guard: "is read-only",
              actions: ["defer patch", "defer mutation"],
              target: "has pending mutations"
            }, {
              actions: ["emit patch", "defer mutation"],
              target: "has pending mutations"
            }]
          }
        },
        "has pending mutations": {
          entry: [() => {
            debug$3("entry: mutations->has pending mutations");
          }, "emit has pending mutations"],
          exit: [() => {
            debug$3("exit: mutations->has pending mutations");
          }],
          invoke: {
            src: "mutation interval"
          },
          on: {
            "emit changes": {
              guard: and([not("is read-only"), "slate is normalizing"]),
              target: "idle",
              actions: ["emit pending patch events", "clear pending patch events", "emit mutations", "clear pending mutations"]
            },
            patch: [{
              guard: "is read-only",
              actions: ["defer patch", "defer mutation"]
            }, {
              actions: ["emit patch", "defer mutation"]
            }]
          }
        }
      }
    }
  }
});
function createEditableAPI(editor, editorActor) {
  const types = editorActor.getSnapshot().context.schema;
  return {
    focus: () => {
      editorActor.send({
        type: "focus",
        editor
      });
    },
    blur: () => {
      editorActor.send({
        type: "blur",
        editor
      });
    },
    toggleMark: (mark) => {
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "decorator.toggle",
          decorator: mark
        },
        editor
      });
    },
    toggleList: (listItem) => {
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "list item.toggle",
          listItem
        },
        editor
      });
    },
    toggleBlockStyle: (style) => {
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "style.toggle",
          style
        },
        editor
      });
    },
    isMarkActive: (mark) => {
      const snapshot = getEditorSnapshot({
        editorActorSnapshot: editorActor.getSnapshot(),
        slateEditorInstance: editor
      });
      return getActiveDecorators(snapshot).includes(mark);
    },
    marks: () => {
      const snapshot = getEditorSnapshot({
        editorActorSnapshot: editorActor.getSnapshot(),
        slateEditorInstance: editor
      }), activeAnnotations = getActiveAnnotationsMarks(snapshot), activeDecorators = getActiveDecorators(snapshot);
      return [...activeAnnotations, ...activeDecorators];
    },
    undo: () => {
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "history.undo"
        },
        editor
      });
    },
    redo: () => {
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "history.redo"
        },
        editor
      });
    },
    select: (selection) => {
      const slateSelection = toSlateRange({
        context: {
          schema: editorActor.getSnapshot().context.schema,
          value: editor.value,
          selection
        },
        blockIndexMap: editor.blockIndexMap
      });
      slateSelection ? Transforms.select(editor, slateSelection) : Transforms.deselect(editor), editor.onChange();
    },
    focusBlock: () => {
      if (!editor.selection)
        return;
      const focusBlockIndex = editor.selection.focus.path.at(0);
      if (focusBlockIndex !== void 0)
        return editor.value.at(focusBlockIndex);
    },
    focusChild: () => {
      if (!editor.selection)
        return;
      const focusBlockIndex = editor.selection.focus.path.at(0), focusChildIndex = editor.selection.focus.path.at(1), block = focusBlockIndex !== void 0 ? editor.value.at(focusBlockIndex) : void 0;
      if (block && isTextBlock(editorActor.getSnapshot().context, block))
        return focusChildIndex === void 0 ? void 0 : block.children.at(focusChildIndex);
    },
    insertChild: (type, value) => (editorActor.send({
      type: "behavior event",
      behaviorEvent: {
        type: "insert.child",
        child: {
          _type: type.name,
          ...value || {}
        }
      },
      editor
    }), editor.selection ? slateRangeToSelection({
      schema: editorActor.getSnapshot().context.schema,
      editor,
      range: editor.selection
    })?.focus.path ?? [] : []),
    insertBlock: (type, value) => (editorActor.send({
      type: "behavior event",
      behaviorEvent: {
        type: "insert.block",
        block: {
          _type: type.name,
          ...value || {}
        },
        placement: "auto"
      },
      editor
    }), editor.selection ? slateRangeToSelection({
      schema: editorActor.getSnapshot().context.schema,
      editor,
      range: editor.selection
    })?.focus.path ?? [] : []),
    hasBlockStyle: (style) => {
      try {
        return isStyleActive({
          editor,
          style
        });
      } catch {
        return !1;
      }
    },
    hasListStyle: (listItem) => {
      try {
        return isListItemActive({
          editor,
          listItem
        });
      } catch {
        return !1;
      }
    },
    isVoid: (element) => ![types.block.name, types.span.name].includes(element._type),
    findByPath: (path3) => {
      const blockKey = getBlockKeyFromSelectionPoint({
        path: path3
      });
      if (!blockKey)
        return [void 0, void 0];
      const blockIndex = editor.blockIndexMap.get(blockKey);
      if (blockIndex === void 0)
        return [void 0, void 0];
      const block = editor.value.at(blockIndex);
      if (!block)
        return [void 0, void 0];
      const childKey = getChildKeyFromSelectionPoint({
        path: path3
      });
      if (path3.length === 1 && !childKey)
        return [block, [{
          _key: block._key
        }]];
      if (isTextBlock(editorActor.getSnapshot().context, block) && childKey) {
        const child = block.children.find((child2) => child2._key === childKey);
        if (child)
          return [child, [{
            _key: block._key
          }, "children", {
            _key: child._key
          }]];
      }
      return [void 0, void 0];
    },
    findDOMNode: (element) => {
      let node3;
      try {
        const [item] = Array.from(Editor.nodes(editor, {
          at: [],
          match: (n2) => n2._key === element._key
        }) || [])[0] || [void 0];
        node3 = ReactEditor.toDOMNode(editor, item);
      } catch {
      }
      return node3;
    },
    activeAnnotations: () => {
      if (!editor.selection || editor.selection.focus.path.length < 2)
        return [];
      try {
        const activeAnnotations = [], spans = Editor.nodes(editor, {
          at: editor.selection,
          match: (node3) => Text$1.isText(node3) && node3.marks !== void 0 && Array.isArray(node3.marks) && node3.marks.length > 0
        });
        for (const [span, path3] of spans) {
          const [block] = Editor.node(editor, path3, {
            depth: 1
          });
          editor.isTextBlock(block) && block.markDefs?.forEach((def) => {
            Text$1.isText(span) && span.marks && Array.isArray(span.marks) && span.marks.includes(def._key) && activeAnnotations.push(def);
          });
        }
        return activeAnnotations;
      } catch {
        return [];
      }
    },
    isAnnotationActive: (annotationType) => {
      const snapshot = getEditorSnapshot({
        editorActorSnapshot: editorActor.getSnapshot(),
        slateEditorInstance: editor
      });
      return isActiveAnnotation(annotationType)(snapshot);
    },
    addAnnotation: (type, value) => {
      const snapshotBefore = getEditorSnapshot({
        editorActorSnapshot: editorActor.getSnapshot(),
        slateEditorInstance: editor
      }), selectedValueBefore = getSelectedValue(snapshotBefore), focusSpanBefore = getFocusSpan$1(snapshotBefore), markDefsBefore = selectedValueBefore.flatMap((block) => isTextBlock(snapshotBefore.context, block) ? block.markDefs ?? [] : []);
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "annotation.add",
          annotation: {
            name: type.name,
            value: value ?? {}
          }
        },
        editor
      });
      const snapshotAfter = getEditorSnapshot({
        editorActorSnapshot: editorActor.getSnapshot(),
        slateEditorInstance: editor
      }), selectedValueAfter = getSelectedValue(snapshotAfter), focusBlockAfter = getFocusBlock$1(snapshotAfter), focusSpanAfter = getFocusSpan$1(snapshotAfter), newMarkDefKeysOnFocusSpan = focusSpanAfter?.node.marks?.filter((mark) => !focusSpanBefore?.node.marks?.includes(mark) && !snapshotAfter.context.schema.decorators.map((decorator) => decorator.name).includes(mark)), markDefs = selectedValueAfter.flatMap((block) => isTextBlock(snapshotAfter.context, block) ? block.markDefs?.map((markDef2) => ({
        markDef: markDef2,
        path: [{
          _key: block._key
        }, "markDefs", {
          _key: markDef2._key
        }]
      })) ?? [] : []).filter((markDef2) => !markDefsBefore.some((markDefBefore) => markDefBefore._key === markDef2.markDef._key)), spanPath = focusSpanAfter?.path, markDef = markDefs.find((markDef2) => newMarkDefKeysOnFocusSpan?.some((mark) => mark === markDef2.markDef._key));
      if (focusBlockAfter && spanPath && markDef)
        return {
          markDefPath: markDef.path,
          markDefPaths: markDefs.map((markDef2) => markDef2.path),
          spanPath
        };
    },
    delete: (selection, options) => {
      selection && editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "delete",
          at: selection,
          unit: options?.mode === "blocks" ? "block" : options?.mode === "children" ? "child" : void 0
        },
        editor
      });
    },
    removeAnnotation: (type) => {
      editorActor.send({
        type: "behavior event",
        behaviorEvent: {
          type: "annotation.remove",
          annotation: {
            name: type.name
          }
        },
        editor
      });
    },
    getSelection: () => {
      let ptRange = null;
      if (editor.selection) {
        const existing = SLATE_TO_PORTABLE_TEXT_RANGE.get(editor.selection);
        if (existing)
          return existing;
        ptRange = slateRangeToSelection({
          schema: editorActor.getSnapshot().context.schema,
          editor,
          range: editor.selection
        }), SLATE_TO_PORTABLE_TEXT_RANGE.set(editor.selection, ptRange);
      }
      return ptRange;
    },
    getValue: () => editor.value,
    isCollapsedSelection: () => !!editor.selection && Range.isCollapsed(editor.selection),
    isExpandedSelection: () => !!editor.selection && Range.isExpanded(editor.selection),
    insertBreak: () => {
      editor.insertBreak(), editor.onChange();
    },
    getFragment: () => {
      const snapshot = getEditorSnapshot({
        editorActorSnapshot: editorActor.getSnapshot(),
        slateEditorInstance: editor
      });
      return getSelectedValue(snapshot);
    },
    isSelectionsOverlapping: (selectionA, selectionB) => {
      const rangeA = toSlateRange({
        context: {
          schema: editorActor.getSnapshot().context.schema,
          value: editor.value,
          selection: selectionA
        },
        blockIndexMap: editor.blockIndexMap
      }), rangeB = toSlateRange({
        context: {
          schema: editorActor.getSnapshot().context.schema,
          value: editor.value,
          selection: selectionB
        },
        blockIndexMap: editor.blockIndexMap
      });
      return Range.isRange(rangeA) && Range.isRange(rangeB) && Range.includes(rangeA, rangeB);
    }
  };
}
const relayMachine = setup({
  types: {
    context: {},
    events: {},
    emitted: {}
  }
}).createMachine({
  id: "relay",
  context: {
    prevSelection: null,
    lastEventWasFocused: !1
  },
  on: {
    focused: {
      actions: [assign({
        lastEventWasFocused: !0
      }), emit(({
        event
      }) => event)]
    },
    selection: [{
      guard: ({
        context
      }) => context.lastEventWasFocused,
      actions: [assign({
        prevSelection: ({
          event
        }) => event.selection
      }), emit(({
        event
      }) => event), assign({
        lastEventWasFocused: !1
      })]
    }, {
      guard: ({
        context,
        event
      }) => context.prevSelection !== event.selection,
      actions: [assign({
        prevSelection: ({
          event
        }) => event.selection
      }), emit(({
        event
      }) => event), assign({
        lastEventWasFocused: !1
      })]
    }],
    "*": {
      actions: [emit(({
        event
      }) => event), assign({
        lastEventWasFocused: !1
      })]
    }
  }
});
function validateValue(value, types, keyGenerator) {
  let resolution = null, valid = !0;
  const validChildTypes = [types.span.name, ...types.inlineObjects.map((t2) => t2.name)], validBlockTypes = [types.block.name, ...types.blockObjects.map((t2) => t2.name)];
  return value === void 0 ? {
    valid: !0,
    resolution: null,
    value
  } : !Array.isArray(value) || value.length === 0 ? {
    valid: !1,
    resolution: {
      patches: [unset([])],
      description: "Editor value must be an array of Portable Text blocks, or undefined.",
      action: "Unset the value",
      item: value,
      i18n: {
        description: "inputs.portable-text.invalid-value.not-an-array.description",
        action: "inputs.portable-text.invalid-value.not-an-array.action"
      }
    },
    value
  } : (value.some((blk, index) => {
    if (!isPlainObject(blk))
      return resolution = {
        patches: [unset([index])],
        description: `Block must be an object, got ${String(blk)}`,
        action: "Unset invalid item",
        item: blk,
        i18n: {
          description: "inputs.portable-text.invalid-value.not-an-object.description",
          action: "inputs.portable-text.invalid-value.not-an-object.action",
          values: {
            index
          }
        }
      }, !0;
    if (!blk._key || typeof blk._key != "string")
      return resolution = {
        patches: [set({
          ...blk,
          _key: keyGenerator()
        }, [index])],
        description: `Block at index ${index} is missing required _key.`,
        action: "Set the block with a random _key value",
        item: blk,
        i18n: {
          description: "inputs.portable-text.invalid-value.missing-key.description",
          action: "inputs.portable-text.invalid-value.missing-key.action",
          values: {
            index
          }
        }
      }, !0;
    if (!blk._type || !validBlockTypes.includes(blk._type)) {
      if (blk._type === "block") {
        const currentBlockTypeName = types.block.name;
        return resolution = {
          patches: [set({
            ...blk,
            _type: currentBlockTypeName
          }, [{
            _key: blk._key
          }])],
          description: `Block with _key '${blk._key}' has invalid type name '${blk._type}'. According to the schema, the block type name is '${currentBlockTypeName}'`,
          action: `Use type '${currentBlockTypeName}'`,
          item: blk,
          i18n: {
            description: "inputs.portable-text.invalid-value.incorrect-block-type.description",
            action: "inputs.portable-text.invalid-value.incorrect-block-type.action",
            values: {
              key: blk._key,
              expectedTypeName: currentBlockTypeName
            }
          }
        }, !0;
      }
      return !blk._type && isTextBlock({
        schema: types
      }, {
        ...blk,
        _type: types.block.name
      }) ? (resolution = {
        patches: [set({
          ...blk,
          _type: types.block.name
        }, [{
          _key: blk._key
        }])],
        description: `Block with _key '${blk._key}' is missing a type name. According to the schema, the block type name is '${types.block.name}'`,
        action: `Use type '${types.block.name}'`,
        item: blk,
        i18n: {
          description: "inputs.portable-text.invalid-value.missing-block-type.description",
          action: "inputs.portable-text.invalid-value.missing-block-type.action",
          values: {
            key: blk._key,
            expectedTypeName: types.block.name
          }
        }
      }, !0) : blk._type ? (resolution = {
        patches: [unset([{
          _key: blk._key
        }])],
        description: `Block with _key '${blk._key}' has invalid _type '${blk._type}'`,
        action: "Remove the block",
        item: blk,
        i18n: {
          description: "inputs.portable-text.invalid-value.disallowed-type.description",
          action: "inputs.portable-text.invalid-value.disallowed-type.action",
          values: {
            key: blk._key,
            typeName: blk._type
          }
        }
      }, !0) : (resolution = {
        patches: [unset([{
          _key: blk._key
        }])],
        description: `Block with _key '${blk._key}' is missing an _type property`,
        action: "Remove the block",
        item: blk,
        i18n: {
          description: "inputs.portable-text.invalid-value.missing-type.description",
          action: "inputs.portable-text.invalid-value.missing-type.action",
          values: {
            key: blk._key
          }
        }
      }, !0);
    }
    if (blk._type === types.block.name) {
      const textBlock = blk;
      if (textBlock.children && !Array.isArray(textBlock.children))
        return resolution = {
          patches: [set({
            children: []
          }, [{
            _key: textBlock._key
          }])],
          description: `Text block with _key '${textBlock._key}' has a invalid required property 'children'.`,
          action: "Reset the children property",
          item: textBlock,
          i18n: {
            description: "inputs.portable-text.invalid-value.missing-or-invalid-children.description",
            action: "inputs.portable-text.invalid-value.missing-or-invalid-children.action",
            values: {
              key: textBlock._key
            }
          }
        }, !0;
      if (textBlock.children === void 0 || Array.isArray(textBlock.children) && textBlock.children.length === 0) {
        const newSpan = {
          _type: types.span.name,
          _key: keyGenerator(),
          text: "",
          marks: []
        };
        return resolution = {
          autoResolve: !0,
          patches: [setIfMissing([], [{
            _key: blk._key
          }, "children"]), insert([newSpan], "after", [{
            _key: blk._key
          }, "children", 0])],
          description: `Children for text block with _key '${blk._key}' is empty.`,
          action: "Insert an empty text",
          item: blk,
          i18n: {
            description: "inputs.portable-text.invalid-value.empty-children.description",
            action: "inputs.portable-text.invalid-value.empty-children.action",
            values: {
              key: blk._key
            }
          }
        }, !0;
      }
      const allUsedMarks = uniq(flatten(textBlock.children.filter((child) => isSpan({
        schema: types
      }, child)).map((cld) => cld.marks || [])));
      if (Array.isArray(blk.markDefs) && blk.markDefs.length > 0) {
        const unusedMarkDefs = uniq(blk.markDefs.map((def) => def._key).filter((key) => !allUsedMarks.includes(key)));
        if (unusedMarkDefs.length > 0)
          return resolution = {
            autoResolve: !0,
            patches: unusedMarkDefs.map((markDefKey) => unset([{
              _key: blk._key
            }, "markDefs", {
              _key: markDefKey
            }])),
            description: `Block contains orphaned data (unused mark definitions): ${unusedMarkDefs.join(", ")}.`,
            action: "Remove unused mark definition item",
            item: blk,
            i18n: {
              description: "inputs.portable-text.invalid-value.orphaned-mark-defs.description",
              action: "inputs.portable-text.invalid-value.orphaned-mark-defs.action",
              values: {
                key: blk._key,
                unusedMarkDefs: unusedMarkDefs.map((m) => m.toString())
              }
            }
          }, !0;
      }
      const orphanedMarks = allUsedMarks.filter((mark) => !types.decorators.map((dec) => dec.name).includes(mark)).filter((mark) => textBlock.markDefs === void 0 || !textBlock.markDefs.find((def) => def._key === mark));
      if (orphanedMarks.length > 0) {
        const spanChildren = textBlock.children.filter((cld) => cld._type === types.span.name && Array.isArray(cld.marks) && cld.marks.some((mark) => orphanedMarks.includes(mark)));
        if (spanChildren) {
          const orphaned = orphanedMarks.join(", ");
          return resolution = {
            autoResolve: !0,
            patches: spanChildren.map((child) => set((child.marks || []).filter((cMrk) => !orphanedMarks.includes(cMrk)), [{
              _key: blk._key
            }, "children", {
              _key: child._key
            }, "marks"])),
            description: `Block with _key '${blk._key}' contains marks (${orphaned}) not supported by the current content model.`,
            action: "Remove invalid marks",
            item: blk,
            i18n: {
              description: "inputs.portable-text.invalid-value.orphaned-marks.description",
              action: "inputs.portable-text.invalid-value.orphaned-marks.action",
              values: {
                key: blk._key,
                orphanedMarks: orphanedMarks.map((m) => m.toString())
              }
            }
          }, !0;
        }
      }
      textBlock.children.some((child, cIndex) => {
        if (!isPlainObject(child))
          return resolution = {
            patches: [unset([{
              _key: blk._key
            }, "children", cIndex])],
            description: `Child at index '${cIndex}' in block with key '${blk._key}' is not an object.`,
            action: "Remove the item",
            item: blk,
            i18n: {
              description: "inputs.portable-text.invalid-value.non-object-child.description",
              action: "inputs.portable-text.invalid-value.non-object-child.action",
              values: {
                key: blk._key,
                index: cIndex
              }
            }
          }, !0;
        if (!child._key || typeof child._key != "string") {
          const newChild = {
            ...child,
            _key: keyGenerator()
          };
          return resolution = {
            autoResolve: !0,
            patches: [set(newChild, [{
              _key: blk._key
            }, "children", cIndex])],
            description: `Child at index ${cIndex} is missing required _key in block with _key ${blk._key}.`,
            action: "Set a new random _key on the object",
            item: blk,
            i18n: {
              description: "inputs.portable-text.invalid-value.missing-child-key.description",
              action: "inputs.portable-text.invalid-value.missing-child-key.action",
              values: {
                key: blk._key,
                index: cIndex
              }
            }
          }, !0;
        }
        return child._type ? validChildTypes.includes(child._type) ? child._type === types.span.name && typeof child.text != "string" ? (resolution = {
          patches: [set({
            ...child,
            text: ""
          }, [{
            _key: blk._key
          }, "children", {
            _key: child._key
          }])],
          description: `Child with _key '${child._key}' in block with key '${blk._key}' has missing or invalid text property!`,
          action: "Write an empty text property to the object",
          item: blk,
          i18n: {
            description: "inputs.portable-text.invalid-value.invalid-span-text.description",
            action: "inputs.portable-text.invalid-value.invalid-span-text.action",
            values: {
              key: blk._key,
              childKey: child._key
            }
          }
        }, !0) : !1 : (resolution = {
          patches: [unset([{
            _key: blk._key
          }, "children", {
            _key: child._key
          }])],
          description: `Child with _key '${child._key}' in block with key '${blk._key}' has invalid '_type' property (${child._type}).`,
          action: "Remove the object",
          item: blk,
          i18n: {
            description: "inputs.portable-text.invalid-value.disallowed-child-type.description",
            action: "inputs.portable-text.invalid-value.disallowed-child-type.action",
            values: {
              key: blk._key,
              childKey: child._key,
              childType: child._type
            }
          }
        }, !0) : (resolution = {
          patches: [unset([{
            _key: blk._key
          }, "children", {
            _key: child._key
          }])],
          description: `Child with _key '${child._key}' in block with key '${blk._key}' is missing '_type' property.`,
          action: "Remove the object",
          item: blk,
          i18n: {
            description: "inputs.portable-text.invalid-value.missing-child-type.description",
            action: "inputs.portable-text.invalid-value.missing-child-type.action",
            values: {
              key: blk._key,
              childKey: child._key
            }
          }
        }, !0);
      }) && (valid = !1);
    }
    return !1;
  }) && (valid = !1), {
    valid,
    resolution,
    value
  });
}
const debug$2 = debugWithName("sync machine"), syncValueCallback = ({
  sendBack,
  input
}) => {
  updateValue({
    context: input.context,
    sendBack,
    slateEditor: input.slateEditor,
    value: input.value,
    streamBlocks: input.streamBlocks
  });
}, syncValueLogic = fromCallback(syncValueCallback), syncMachine = setup({
  types: {
    context: {},
    input: {},
    events: {},
    emitted: {}
  },
  actions: {
    "assign initial value synced": assign({
      initialValueSynced: !0
    }),
    "assign readOnly": assign({
      readOnly: ({
        event
      }) => (assertEvent(event, "update readOnly"), event.readOnly)
    }),
    "assign pending value": assign({
      pendingValue: ({
        event
      }) => (assertEvent(event, "update value"), event.value)
    }),
    "clear pending value": assign({
      pendingValue: void 0
    }),
    "assign previous value": assign({
      previousValue: ({
        event
      }) => (assertEvent(event, "done syncing"), event.value)
    }),
    "emit done syncing value": emit({
      type: "done syncing value"
    }),
    "emit syncing value": emit({
      type: "syncing value"
    })
  },
  guards: {
    "initial value synced": ({
      context
    }) => context.initialValueSynced,
    "is busy": ({
      context
    }) => {
      const isProcessingLocalChanges = context.isProcessingLocalChanges, isChanging = isChangingRemotely(context.slateEditor) ?? !1, isBusy = isProcessingLocalChanges || isChanging;
      return debug$2("isBusy", {
        isBusy,
        isProcessingLocalChanges,
        isChanging
      }), isBusy;
    },
    "is empty value": ({
      event
    }) => event.type === "update value" && event.value === void 0,
    "is empty array": ({
      event
    }) => event.type === "update value" && Array.isArray(event.value) && event.value.length === 0,
    "is new value": ({
      context,
      event
    }) => event.type === "update value" && context.previousValue !== event.value,
    "value changed while syncing": ({
      context,
      event
    }) => (assertEvent(event, "done syncing"), context.pendingValue !== event.value),
    "pending value equals previous value": ({
      context
    }) => isEqual(context.pendingValue, context.previousValue)
  },
  actors: {
    "sync value": syncValueLogic
  }
}).createMachine({
  id: "sync",
  context: ({
    input
  }) => ({
    initialValue: input.initialValue,
    initialValueSynced: !1,
    isProcessingLocalChanges: !1,
    keyGenerator: input.keyGenerator,
    schema: input.schema,
    readOnly: input.readOnly,
    slateEditor: input.slateEditor,
    pendingValue: void 0,
    previousValue: void 0
  }),
  entry: [raise$1(({
    context
  }) => ({
    type: "update value",
    value: context.initialValue
  }))],
  on: {
    "has pending mutations": {
      actions: assign({
        isProcessingLocalChanges: !0
      })
    },
    mutation: {
      actions: assign({
        isProcessingLocalChanges: !1
      })
    },
    "update readOnly": {
      actions: ["assign readOnly"]
    }
  },
  initial: "idle",
  states: {
    idle: {
      entry: [() => {
        debug$2("entry: syncing->idle");
      }],
      exit: [() => {
        debug$2("exit: syncing->idle");
      }],
      on: {
        "update value": [{
          guard: and(["is empty value", not("initial value synced")]),
          actions: ["assign initial value synced", "emit done syncing value"]
        }, {
          guard: and(["is empty array", not("initial value synced")]),
          actions: ["assign initial value synced", emit({
            type: "value changed",
            value: []
          }), "emit done syncing value"]
        }, {
          guard: and(["is busy", "is new value"]),
          target: "busy",
          actions: ["assign pending value"]
        }, {
          guard: "is new value",
          target: "syncing",
          actions: ["assign pending value"]
        }, {
          guard: not("initial value synced"),
          actions: [() => {
            debug$2("no new value \u2013 setting initial value as synced");
          }, "assign initial value synced", "emit done syncing value"]
        }, {
          actions: [() => {
            debug$2("no new value and initial value already synced");
          }]
        }]
      }
    },
    busy: {
      entry: [() => {
        debug$2("entry: syncing->busy");
      }],
      exit: [() => {
        debug$2("exit: syncing->busy");
      }],
      after: {
        1e3: [{
          guard: "is busy",
          target: ".",
          reenter: !0,
          actions: [() => {
            debug$2("reenter: syncing->busy");
          }]
        }, {
          target: "syncing"
        }]
      },
      on: {
        "update value": [{
          guard: "is new value",
          actions: ["assign pending value"]
        }]
      }
    },
    syncing: {
      entry: [() => {
        debug$2("entry: syncing->syncing");
      }, "emit syncing value"],
      exit: [() => {
        debug$2("exit: syncing->syncing");
      }, "emit done syncing value"],
      invoke: {
        src: "sync value",
        id: "sync value",
        input: ({
          context
        }) => ({
          context: {
            keyGenerator: context.keyGenerator,
            previousValue: context.previousValue,
            readOnly: context.readOnly,
            schema: context.schema
          },
          slateEditor: context.slateEditor,
          streamBlocks: !context.initialValueSynced,
          value: context.pendingValue
        })
      },
      on: {
        "update value": {
          guard: "is new value",
          actions: ["assign pending value"]
        },
        patch: {
          actions: [emit(({
            event
          }) => event)]
        },
        "invalid value": {
          actions: [emit(({
            event
          }) => event)]
        },
        "value changed": {
          actions: [emit(({
            event
          }) => event)]
        },
        "done syncing": [{
          guard: "value changed while syncing",
          actions: ["assign previous value", "assign initial value synced"],
          target: "syncing",
          reenter: !0
        }, {
          target: "idle",
          actions: ["clear pending value", "assign previous value", "assign initial value synced"]
        }]
      }
    }
  }
});
async function updateValue({
  context,
  sendBack,
  slateEditor,
  streamBlocks,
  value
}) {
  let doneSyncing = !1, isChanged = !1, isValid = !0;
  const hadSelection = !!slateEditor.selection;
  if ((!value || value.length === 0) && (debug$2("Value is empty"), clearEditor({
    slateEditor,
    doneSyncing
  }), isChanged = !0), value && value.length > 0)
    if (streamBlocks)
      await new Promise((resolve) => {
        if (doneSyncing) {
          resolve();
          return;
        }
        isChanged = removeExtraBlocks({
          slateEditor,
          value
        }), (async () => {
          for await (const [currentBlock, currentBlockIndex] of getStreamedBlocks({
            value
          })) {
            const {
              blockChanged,
              blockValid
            } = syncBlock({
              context,
              sendBack,
              block: currentBlock,
              index: currentBlockIndex,
              slateEditor,
              value
            });
            if (isChanged = blockChanged || isChanged, isValid = isValid && blockValid, !isValid)
              break;
          }
          resolve();
        })();
      });
    else {
      if (doneSyncing)
        return;
      isChanged = removeExtraBlocks({
        slateEditor,
        value
      });
      let index = 0;
      for (const block of value) {
        const {
          blockChanged,
          blockValid
        } = syncBlock({
          context,
          sendBack,
          block,
          index,
          slateEditor,
          value
        });
        if (isChanged = blockChanged || isChanged, isValid = isValid && blockValid, !blockValid)
          break;
        index++;
      }
    }
  if (!isValid) {
    debug$2("Invalid value, returning"), doneSyncing = !0, sendBack({
      type: "done syncing",
      value
    });
    return;
  }
  if (isChanged) {
    debug$2("Server value changed, syncing editor");
    try {
      slateEditor.onChange();
    } catch (err) {
      console.error(err), sendBack({
        type: "invalid value",
        resolution: null,
        value
      }), doneSyncing = !0, sendBack({
        type: "done syncing",
        value
      });
      return;
    }
    hadSelection && !slateEditor.selection && (Transforms.select(slateEditor, {
      anchor: {
        path: [0, 0],
        offset: 0
      },
      focus: {
        path: [0, 0],
        offset: 0
      }
    }), slateEditor.onChange()), sendBack({
      type: "value changed",
      value
    });
  } else
    debug$2("Server value and editor value is equal, no need to sync.");
  doneSyncing = !0, sendBack({
    type: "done syncing",
    value
  });
}
async function* getStreamedBlocks({
  value
}) {
  let index = 0;
  for await (const block of value)
    index % 10 === 0 && await new Promise((resolve) => setTimeout(resolve, 0)), yield [block, index], index++;
}
function clearEditor({
  slateEditor,
  doneSyncing
}) {
  Editor.withoutNormalizing(slateEditor, () => {
    pluginWithoutHistory(slateEditor, () => {
      withRemoteChanges(slateEditor, () => {
        withoutPatching(slateEditor, () => {
          if (doneSyncing)
            return;
          const childrenLength = slateEditor.children.length;
          slateEditor.children.forEach((_, index) => {
            Transforms.removeNodes(slateEditor, {
              at: [childrenLength - 1 - index]
            });
          });
        });
      });
    });
  });
}
function removeExtraBlocks({
  slateEditor,
  value
}) {
  let isChanged = !1;
  return Editor.withoutNormalizing(slateEditor, () => {
    withRemoteChanges(slateEditor, () => {
      withoutPatching(slateEditor, () => {
        const childrenLength = slateEditor.children.length;
        if (value.length < childrenLength) {
          for (let i = childrenLength - 1; i > value.length - 1; i--)
            Transforms.removeNodes(slateEditor, {
              at: [i]
            });
          isChanged = !0;
        }
      });
    });
  }), isChanged;
}
function syncBlock({
  context,
  sendBack,
  block,
  index,
  slateEditor,
  value
}) {
  const oldBlock = slateEditor.children.at(index);
  if (!oldBlock) {
    const validation2 = validateValue([block], context.schema, context.keyGenerator);
    if (debug$2.enabled && debug$2("Validating and inserting new block in the end of the value", block), validation2.valid || validation2.resolution?.autoResolve) {
      const slateBlock = toSlateBlock(block, {
        schemaTypes: context.schema
      });
      return Editor.withoutNormalizing(slateEditor, () => {
        withRemoteChanges(slateEditor, () => {
          withoutPatching(slateEditor, () => {
            Transforms.insertNodes(slateEditor, slateBlock, {
              at: [index]
            });
          });
        });
      }), {
        blockChanged: !0,
        blockValid: !0
      };
    }
    return debug$2("Invalid", validation2), sendBack({
      type: "invalid value",
      resolution: validation2.resolution,
      value
    }), {
      blockChanged: !1,
      blockValid: !1
    };
  }
  if (isEqual(block, oldBlock))
    return {
      blockChanged: !1,
      blockValid: !0
    };
  const validationValue = [value[index]], validation = validateValue(validationValue, context.schema, context.keyGenerator);
  return !validation.valid && validation.resolution?.autoResolve && validation.resolution?.patches.length > 0 && !context.readOnly && context.previousValue && context.previousValue !== value && (console.warn(`${validation.resolution.action} for block with _key '${validationValue[0]._key}'. ${validation.resolution?.description}`), validation.resolution.patches.forEach((patch) => {
    sendBack({
      type: "patch",
      patch
    });
  })), validation.valid || validation.resolution?.autoResolve ? (oldBlock._key === block._key ? (debug$2.enabled && debug$2("Updating block", oldBlock, block), Editor.withoutNormalizing(slateEditor, () => {
    withRemoteChanges(slateEditor, () => {
      withoutPatching(slateEditor, () => {
        updateBlock({
          context,
          slateEditor,
          oldBlock,
          block,
          index
        });
      });
    });
  })) : (debug$2.enabled && debug$2("Replacing block", oldBlock, block), Editor.withoutNormalizing(slateEditor, () => {
    withRemoteChanges(slateEditor, () => {
      withoutPatching(slateEditor, () => {
        replaceBlock({
          context,
          slateEditor,
          block,
          index
        });
      });
    });
  })), {
    blockChanged: !0,
    blockValid: !0
  }) : (sendBack({
    type: "invalid value",
    resolution: validation.resolution,
    value
  }), {
    blockChanged: !1,
    blockValid: !1
  });
}
function replaceBlock({
  context,
  slateEditor,
  block,
  index
}) {
  const slateBlock = toSlateBlock(block, {
    schemaTypes: context.schema
  }), currentSelection = slateEditor.selection, selectionFocusOnBlock = currentSelection && currentSelection.focus.path[0] === index;
  selectionFocusOnBlock && Transforms.deselect(slateEditor), Transforms.removeNodes(slateEditor, {
    at: [index]
  }), Transforms.insertNodes(slateEditor, slateBlock, {
    at: [index]
  }), slateEditor.onChange(), selectionFocusOnBlock && Transforms.select(slateEditor, currentSelection);
}
function updateBlock({
  context,
  slateEditor,
  oldBlock,
  block,
  index
}) {
  const slateBlock = toSlateBlock(block, {
    schemaTypes: context.schema
  });
  if (Transforms.setNodes(slateEditor, slateBlock, {
    at: [index]
  }), slateEditor.isTextBlock(slateBlock) && slateEditor.isTextBlock(oldBlock)) {
    const oldBlockChildrenLength = oldBlock.children.length;
    slateBlock.children.length < oldBlockChildrenLength && Array.from(Array(oldBlockChildrenLength - slateBlock.children.length)).forEach((_, index2) => {
      const childIndex = oldBlockChildrenLength - 1 - index2;
      childIndex > 0 && (debug$2("Removing child"), Transforms.removeNodes(slateEditor, {
        at: [index2, childIndex]
      }));
    }), slateBlock.children.forEach((currentBlockChild, currentBlockChildIndex) => {
      const oldBlockChild = oldBlock.children[currentBlockChildIndex], isChildChanged = !isEqual(currentBlockChild, oldBlockChild), isTextChanged = !isEqual(currentBlockChild.text, oldBlockChild?.text), path3 = [index, currentBlockChildIndex];
      if (isChildChanged)
        if (currentBlockChild._key === oldBlockChild?._key) {
          debug$2("Updating changed child", currentBlockChild, oldBlockChild), Transforms.setNodes(slateEditor, currentBlockChild, {
            at: path3
          });
          const isSpanNode2 = isSpan({
            schema: context.schema
          }, currentBlockChild) && isSpan({
            schema: context.schema
          }, oldBlockChild);
          isSpanNode2 && isTextChanged ? (oldBlockChild.text.length > 0 && deleteText(slateEditor, {
            at: {
              focus: {
                path: path3,
                offset: 0
              },
              anchor: {
                path: path3,
                offset: oldBlockChild.text.length
              }
            }
          }), Transforms.insertText(slateEditor, currentBlockChild.text, {
            at: path3
          }), slateEditor.onChange()) : isSpanNode2 || (debug$2("Updating changed inline object child", currentBlockChild), Transforms.setNodes(slateEditor, {
            _key: VOID_CHILD_KEY
          }, {
            at: [...path3, 0],
            voids: !0
          }));
        } else oldBlockChild ? (debug$2("Replacing child", currentBlockChild), Transforms.removeNodes(slateEditor, {
          at: [index, currentBlockChildIndex]
        }), Transforms.insertNodes(slateEditor, currentBlockChild, {
          at: [index, currentBlockChildIndex]
        }), slateEditor.onChange()) : oldBlockChild || (debug$2("Inserting new child", currentBlockChild), Transforms.insertNodes(slateEditor, currentBlockChild, {
          at: [index, currentBlockChildIndex]
        }), slateEditor.onChange());
    });
  }
}
const debug$1 = debugWithName("setup");
function createInternalEditor(config) {
  debug$1("Creating new Editor instance");
  const subscriptions = [], editorActor = createActor(editorMachine, {
    input: editorConfigToMachineInput(config)
  }), relayActor = createActor(relayMachine), slateEditor = createSlateEditor({
    editorActor,
    relayActor,
    subscriptions
  }), editable = createEditableAPI(slateEditor.instance, editorActor), {
    mutationActor,
    syncActor
  } = createActors({
    editorActor,
    relayActor,
    slateEditor: slateEditor.instance,
    subscriptions
  }), editor = {
    dom: createEditorDom((event) => editorActor.send(event), slateEditor.instance),
    getSnapshot: () => getEditorSnapshot({
      editorActorSnapshot: editorActor.getSnapshot(),
      slateEditorInstance: slateEditor.instance
    }),
    registerBehavior: (behaviorConfig) => {
      const priority = createEditorPriority({
        name: "custom",
        reference: {
          priority: corePriority,
          importance: "higher"
        }
      }), behaviorConfigWithPriority = {
        ...behaviorConfig,
        priority
      };
      return editorActor.send({
        type: "add behavior",
        behaviorConfig: behaviorConfigWithPriority
      }), () => {
        editorActor.send({
          type: "remove behavior",
          behaviorConfig: behaviorConfigWithPriority
        });
      };
    },
    send: (event) => {
      switch (event.type) {
        case "update value":
          syncActor.send(event);
          break;
        case "update readOnly":
        case "patches":
          editorActor.send(event);
          break;
        default:
          editorActor.send(rerouteExternalBehaviorEvent({
            event,
            slateEditor: slateEditor.instance
          }));
      }
    },
    on: (event, listener) => relayActor.on(event, (event2) => {
      switch (event2.type) {
        case "blurred":
        case "done loading":
        case "editable":
        case "focused":
        case "invalid value":
        case "loading":
        case "mutation":
        case "patch":
        case "read only":
        case "ready":
        case "selection":
        case "value changed":
          listener(event2);
          break;
      }
    }),
    _internal: {
      editable,
      editorActor,
      slateEditor
    }
  };
  return {
    actors: {
      editorActor,
      mutationActor,
      relayActor,
      syncActor
    },
    editor,
    subscriptions
  };
}
function editorConfigToMachineInput(config) {
  const {
    legacySchema,
    schema
  } = compileSchemasFromEditorConfig(config);
  return {
    converters: createCoreConverters(legacySchema),
    getLegacySchema: () => legacySchema,
    keyGenerator: config.keyGenerator ?? defaultKeyGenerator,
    readOnly: config.readOnly,
    schema,
    initialValue: config.initialValue
  };
}
function compileSchemasFromEditorConfig(config) {
  const legacySchema = config.schemaDefinition ? compileSchemaDefinitionToPortableTextMemberSchemaTypes(config.schemaDefinition) : createPortableTextMemberSchemaTypes(config.schema.hasOwnProperty("jsonType") ? config.schema : compileType(config.schema)), schema = config.schemaDefinition ? compileSchema(config.schemaDefinition) : portableTextMemberSchemaTypesToSchema(legacySchema);
  return {
    legacySchema,
    schema
  };
}
function createActors(config) {
  debug$1("Creating new Actors");
  const mutationActor = createActor(mutationMachine, {
    input: {
      readOnly: config.editorActor.getSnapshot().matches({
        "edit mode": "read only"
      }),
      schema: config.editorActor.getSnapshot().context.schema,
      slateEditor: config.slateEditor
    }
  }), syncActor = createActor(syncMachine, {
    input: {
      initialValue: config.editorActor.getSnapshot().context.initialValue,
      keyGenerator: config.editorActor.getSnapshot().context.keyGenerator,
      readOnly: config.editorActor.getSnapshot().matches({
        "edit mode": "read only"
      }),
      schema: config.editorActor.getSnapshot().context.schema,
      slateEditor: config.slateEditor
    }
  });
  return config.subscriptions.push(() => {
    const subscription = mutationActor.on("*", (event) => {
      event.type === "has pending mutations" && syncActor.send({
        type: "has pending mutations"
      }), event.type === "mutation" && (syncActor.send({
        type: "mutation"
      }), config.editorActor.send({
        type: "mutation",
        patches: event.patches,
        value: event.snapshot
      })), event.type === "patch" && config.relayActor.send(event);
    });
    return () => {
      mutationActor.send({
        type: "emit changes"
      }), subscription.unsubscribe();
    };
  }), config.subscriptions.push(() => {
    const subscription = syncActor.on("*", (event) => {
      switch (event.type) {
        case "invalid value":
          config.relayActor.send(event);
          break;
        case "value changed":
          config.relayActor.send(event);
          break;
        case "patch":
          config.editorActor.send({
            ...event,
            type: "internal.patch",
            value: config.slateEditor.value
          });
          break;
        default:
          config.editorActor.send(event);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }), config.subscriptions.push(() => {
    const subscription = config.editorActor.subscribe((snapshot) => {
      snapshot.matches({
        "edit mode": "read only"
      }) ? (mutationActor.send({
        type: "update readOnly",
        readOnly: !0
      }), syncActor.send({
        type: "update readOnly",
        readOnly: !0
      })) : (mutationActor.send({
        type: "update readOnly",
        readOnly: !1
      }), syncActor.send({
        type: "update readOnly",
        readOnly: !1
      }));
    });
    return () => {
      subscription.unsubscribe();
    };
  }), config.subscriptions.push(() => {
    const subscription = config.editorActor.on("*", (event) => {
      switch (event.type) {
        case "editable":
        case "mutation":
        case "ready":
        case "read only":
        case "selection":
          config.relayActor.send(event);
          break;
        case "internal.patch":
          mutationActor.send({
            ...event,
            type: "patch"
          });
          break;
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }), {
    mutationActor,
    syncActor
  };
}
function eventToChange(event) {
  switch (event.type) {
    case "blurred":
      return {
        type: "blur",
        event: event.event
      };
    case "patch":
      return event;
    case "loading":
      return {
        type: "loading",
        isLoading: !0
      };
    case "done loading":
      return {
        type: "loading",
        isLoading: !1
      };
    case "focused":
      return {
        type: "focus",
        event: event.event
      };
    case "value changed":
      return {
        type: "value",
        value: event.value
      };
    case "invalid value":
      return {
        type: "invalidValue",
        resolution: event.resolution,
        value: event.value
      };
    case "mutation":
      return {
        type: "mutation",
        patches: event.patches,
        snapshot: event.value
      };
    case "ready":
      return event;
    case "selection":
      return event;
    case "unset":
      return event;
  }
}
const debug2 = debugWithName("component:PortableTextEditor");
class PortableTextEditor extends Component {
  static displayName = "PortableTextEditor";
  /**
   * An observable of all the editor changes.
   */
  change$ = new Subject();
  /**
   * A lookup table for all the relevant schema types for this portable text type.
   */
  /**
   * The editor instance
   */
  /*
   * The editor API (currently implemented with Slate).
   */
  subscriptions = [];
  unsubscribers = [];
  constructor(props) {
    if (super(props), props.editor)
      this.editor = props.editor, this.schemaTypes = this.editor._internal.editorActor.getSnapshot().context.getLegacySchema();
    else {
      const {
        actors,
        editor,
        subscriptions
      } = createInternalEditor({
        initialValue: props.value,
        keyGenerator: props.keyGenerator,
        readOnly: props.readOnly,
        schema: props.schemaType
      });
      this.subscriptions = subscriptions, this.actors = actors, this.editor = editor, this.schemaTypes = actors.editorActor.getSnapshot().context.getLegacySchema();
    }
    this.editable = this.editor._internal.editable;
  }
  componentDidMount() {
    if (!this.actors)
      return;
    for (const subscription of this.subscriptions)
      this.unsubscribers.push(subscription());
    const relayActorSubscription = this.actors.relayActor.on("*", (event) => {
      const change = eventToChange(event);
      change && (this.props.editor || this.props.onChange(change), this.change$.next(change));
    });
    this.unsubscribers.push(relayActorSubscription.unsubscribe), this.actors.editorActor.start(), this.actors.mutationActor.start(), this.actors.relayActor.start(), this.actors.syncActor.start();
  }
  componentDidUpdate(prevProps) {
    !this.props.editor && !prevProps.editor && this.props.schemaType !== prevProps.schemaType && console.warn("Updating schema type is no longer supported"), !this.props.editor && !prevProps.editor && (this.props.readOnly !== prevProps.readOnly && this.editor._internal.editorActor.send({
      type: "update readOnly",
      readOnly: this.props.readOnly ?? !1
    }), this.props.value !== prevProps.value && this.editor.send({
      type: "update value",
      value: this.props.value
    }), this.props.editorRef !== prevProps.editorRef && this.props.editorRef && (this.props.editorRef.current = this));
  }
  componentWillUnmount() {
    for (const unsubscribe of this.unsubscribers)
      unsubscribe();
    this.actors && (stopActor(this.actors.editorActor), stopActor(this.actors.mutationActor), stopActor(this.actors.relayActor), stopActor(this.actors.syncActor));
  }
  setEditable = (editable) => {
    this.editor._internal.editable = {
      ...this.editor._internal.editable,
      ...editable
    };
  };
  render() {
    const legacyPatches = this.props.editor ? void 0 : this.props.incomingPatches$ ?? this.props.patches$;
    return /* @__PURE__ */ jsxs(Fragment$1, { children: [
      legacyPatches ? /* @__PURE__ */ jsx(RoutePatchesObservableToEditorActor, { editorActor: this.editor._internal.editorActor, patches$: legacyPatches }) : null,
      /* @__PURE__ */ jsx(EditorActorContext.Provider, { value: this.editor._internal.editorActor, children: /* @__PURE__ */ jsx(RelayActorContext.Provider, { value: this.actors.relayActor, children: /* @__PURE__ */ jsx(Slate, { editor: this.editor._internal.slateEditor.instance, initialValue: this.editor._internal.slateEditor.initialValue, children: /* @__PURE__ */ jsx(PortableTextEditorContext.Provider, { value: this, children: this.props.children }) }) }) })
    ] });
  }
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const isActive = useEditorSelector(editor, selectors.getActiveAnnotations)
   * ```
   */
  static activeAnnotations = (editor) => editor && editor.editable ? editor.editable.activeAnnotations() : [];
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const isActive = useEditorSelector(editor, selectors.isActiveAnnotation(...))
   * ```
   */
  static isAnnotationActive = (editor, annotationType) => editor && editor.editable ? editor.editable.isAnnotationActive(annotationType) : !1;
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *  type: 'annotation.add',
   *  annotation: {
   *    name: '...',
   *    value: {...},
   *  }
   * })
   * ```
   */
  static addAnnotation = (editor, type, value) => editor.editable?.addAnnotation(type, value);
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *  type: 'blur',
   * })
   * ```
   */
  static blur = (editor) => {
    debug2("Host blurred"), editor.editable?.blur();
  };
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *  type: 'delete',
   *  at: {...},
   *  direction: '...',
   *  unit: '...',
   * })
   * ```
   */
  static delete = (editor, selection, options) => editor.editable?.delete(selection, options);
  static findDOMNode = (editor, element) => editor.editable?.findDOMNode(element);
  static findByPath = (editor, path3) => editor.editable?.findByPath(path3) || [];
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *  type: 'focus',
   * })
   * ```
   */
  static focus = (editor) => {
    debug2("Host requesting focus"), editor.editable?.focus();
  };
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const focusBlock = useEditorSelector(editor, selectors.getFocusBlock)
   * ```
   */
  static focusBlock = (editor) => editor.editable?.focusBlock();
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const focusChild = useEditorSelector(editor, selectors.getFocusChild)
   * ```
   */
  static focusChild = (editor) => editor.editable?.focusChild();
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const selection = useEditorSelector(editor, selectors.getSelection)
   * ```
   */
  static getSelection = (editor) => editor.editable ? editor.editable.getSelection() : null;
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const value = useEditorSelector(editor, selectors.getValue)
   * ```
   */
  static getValue = (editor) => editor.editable?.getValue();
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const isActive = useEditorSelector(editor, selectors.isActiveStyle(...))
   * ```
   */
  static hasBlockStyle = (editor, blockStyle) => editor.editable?.hasBlockStyle(blockStyle);
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const isActive = useEditorSelector(editor, selectors.isActiveListItem(...))
   * ```
   */
  static hasListStyle = (editor, listStyle) => editor.editable?.hasListStyle(listStyle);
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const isSelectionCollapsed = useEditorSelector(editor, selectors.isSelectionCollapsed)
   * ```
   */
  static isCollapsedSelection = (editor) => editor.editable?.isCollapsedSelection();
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const isSelectionExpanded = useEditorSelector(editor, selectors.isSelectionExpanded)
   * ```
   */
  static isExpandedSelection = (editor) => editor.editable?.isExpandedSelection();
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const isActive = useEditorSelector(editor, selectors.isActiveDecorator(...))
   * ```
   */
  static isMarkActive = (editor, mark) => editor.editable?.isMarkActive(mark);
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *  type: 'insert.span',
   *  text: '...',
   *  annotations: [{name: '...', value: {...}}],
   *  decorators: ['...'],
   * })
   * editor.send({
   *  type: 'insert.inline object',
   *  inlineObject: {
   *    name: '...',
   *    value: {...},
   *  },
   * })
   * ```
   */
  static insertChild = (editor, type, value) => (debug2("Host inserting child"), editor.editable?.insertChild(type, value));
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *  type: 'insert.block object',
   *  blockObject: {
   *    name: '...',
   *    value: {...},
   *  },
   *  placement: 'auto' | 'after' | 'before',
   * })
   * ```
   */
  static insertBlock = (editor, type, value) => editor.editable?.insertBlock(type, value);
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *  type: 'insert.break',
   * })
   * ```
   */
  static insertBreak = (editor) => editor.editable?.insertBreak();
  static isVoid = (editor, element) => editor.editable?.isVoid(element);
  static isObjectPath = (_editor, path3) => {
    if (!path3 || !Array.isArray(path3))
      return !1;
    const isChildObjectEditPath = path3.length > 3 && path3[1] === "children";
    return path3.length > 1 && path3[1] !== "children" || isChildObjectEditPath;
  };
  static marks = (editor) => editor.editable?.marks();
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *  type: 'select',
   *  selection: {...},
   * })
   * ```
   */
  static select = (editor, selection) => {
    debug2("Host setting selection", selection), editor.editable?.select(selection);
  };
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *  type: 'annotation.remove',
   *  annotation: {
   *    name: '...',
   *  },
   * })
   * ```
   */
  static removeAnnotation = (editor, type) => editor.editable?.removeAnnotation(type);
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *  type: 'style.toggle',
   *  style: '...',
   * })
   * ```
   */
  static toggleBlockStyle = (editor, blockStyle) => (debug2("Host is toggling block style"), editor.editable?.toggleBlockStyle(blockStyle));
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *  type: 'list item.toggle',
   *  listItem: '...',
   * })
   * ```
   */
  static toggleList = (editor, listStyle) => editor.editable?.toggleList(listStyle);
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *  type: 'decorator.toggle',
   *  decorator: '...',
   * })
   * ```
   */
  static toggleMark = (editor, mark) => {
    debug2("Host toggling mark", mark), editor.editable?.toggleMark(mark);
  };
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const selectedValue = useEditorSelector(editor, selectors.getSelectedValue)
   * ```
   */
  static getFragment = (editor) => editor.editable?.getFragment();
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *   type: 'history.undo',
   * })
   * ```
   */
  static undo = (editor) => {
    debug2("Host undoing"), editor.editable?.undo();
  };
  /**
   * @deprecated
   * Use `editor.send(...)` instead
   *
   * ```
   * const editor = useEditor()
   * editor.send({
   *   type: 'history.redo',
   * })
   * ```
   */
  static redo = (editor) => {
    debug2("Host redoing"), editor.editable?.redo();
  };
  /**
   * @deprecated
   * Use built-in selectors or write your own: https://www.portabletext.org/reference/selectors/
   *
   * ```
   * import * as selectors from '@portabletext/editor/selectors'
   * const editor = useEditor()
   * const isOverlapping = useEditorSelector(editor, selectors.isOverlappingSelection(selectionB))
   * ```
   */
  static isSelectionsOverlapping = (editor, selectionA, selectionB) => editor.editable?.isSelectionsOverlapping(selectionA, selectionB);
}
function RoutePatchesObservableToEditorActor(props) {
  const $ = c(4);
  let t0, t1;
  return $[0] !== props.editorActor || $[1] !== props.patches$ ? (t0 = () => {
    const subscription = props.patches$.subscribe((payload) => {
      props.editorActor.send({
        type: "patches",
        ...payload
      });
    });
    return () => {
      subscription.unsubscribe();
    };
  }, t1 = [props.editorActor, props.patches$], $[0] = props.editorActor, $[1] = props.patches$, $[2] = t0, $[3] = t1) : (t0 = $[2], t1 = $[3]), useEffect(t0, t1), null;
}
function EditorProvider(props) {
  const $ = c(29);
  let t0;
  $[0] !== props.initialConfig ? (t0 = () => {
    const internalEditor = createInternalEditor(props.initialConfig), portableTextEditor = new PortableTextEditor({
      editor: internalEditor.editor
    });
    return {
      internalEditor,
      portableTextEditor
    };
  }, $[0] = props.initialConfig, $[1] = t0) : t0 = $[1];
  const [t1] = useState(t0), {
    internalEditor: internalEditor_0,
    portableTextEditor: portableTextEditor_0
  } = t1;
  let t2;
  $[2] !== internalEditor_0.actors.editorActor || $[3] !== internalEditor_0.actors.mutationActor || $[4] !== internalEditor_0.actors.relayActor || $[5] !== internalEditor_0.actors.syncActor || $[6] !== internalEditor_0.editor._internal.slateEditor.instance || $[7] !== internalEditor_0.subscriptions || $[8] !== portableTextEditor_0 ? (t2 = () => {
    const unsubscribers = [];
    for (const subscription of internalEditor_0.subscriptions)
      unsubscribers.push(subscription());
    const relayActorSubscription = internalEditor_0.actors.relayActor.on("*", (event) => {
      const change = eventToChange(event);
      change && portableTextEditor_0.change$.next(change);
    });
    return unsubscribers.push(relayActorSubscription.unsubscribe), internalEditor_0.actors.editorActor.start(), internalEditor_0.actors.editorActor.send({
      type: "add slate editor",
      editor: internalEditor_0.editor._internal.slateEditor.instance
    }), internalEditor_0.actors.mutationActor.start(), internalEditor_0.actors.relayActor.start(), internalEditor_0.actors.syncActor.start(), () => {
      for (const unsubscribe of unsubscribers)
        unsubscribe();
      stopActor(internalEditor_0.actors.editorActor), stopActor(internalEditor_0.actors.mutationActor), stopActor(internalEditor_0.actors.relayActor), stopActor(internalEditor_0.actors.syncActor);
    };
  }, $[2] = internalEditor_0.actors.editorActor, $[3] = internalEditor_0.actors.mutationActor, $[4] = internalEditor_0.actors.relayActor, $[5] = internalEditor_0.actors.syncActor, $[6] = internalEditor_0.editor._internal.slateEditor.instance, $[7] = internalEditor_0.subscriptions, $[8] = portableTextEditor_0, $[9] = t2) : t2 = $[9];
  let t3;
  $[10] !== internalEditor_0 || $[11] !== portableTextEditor_0 ? (t3 = [internalEditor_0, portableTextEditor_0], $[10] = internalEditor_0, $[11] = portableTextEditor_0, $[12] = t3) : t3 = $[12], useEffect(t2, t3);
  let t4;
  $[13] !== portableTextEditor_0 || $[14] !== props.children ? (t4 = /* @__PURE__ */ jsx(PortableTextEditorContext.Provider, { value: portableTextEditor_0, children: props.children }), $[13] = portableTextEditor_0, $[14] = props.children, $[15] = t4) : t4 = $[15];
  let t5;
  $[16] !== internalEditor_0.editor._internal.slateEditor.initialValue || $[17] !== internalEditor_0.editor._internal.slateEditor.instance || $[18] !== t4 ? (t5 = /* @__PURE__ */ jsx(Slate, { editor: internalEditor_0.editor._internal.slateEditor.instance, initialValue: internalEditor_0.editor._internal.slateEditor.initialValue, children: t4 }), $[16] = internalEditor_0.editor._internal.slateEditor.initialValue, $[17] = internalEditor_0.editor._internal.slateEditor.instance, $[18] = t4, $[19] = t5) : t5 = $[19];
  let t6;
  $[20] !== internalEditor_0.actors.relayActor || $[21] !== t5 ? (t6 = /* @__PURE__ */ jsx(RelayActorContext.Provider, { value: internalEditor_0.actors.relayActor, children: t5 }), $[20] = internalEditor_0.actors.relayActor, $[21] = t5, $[22] = t6) : t6 = $[22];
  let t7;
  $[23] !== internalEditor_0.actors.editorActor || $[24] !== t6 ? (t7 = /* @__PURE__ */ jsx(EditorActorContext.Provider, { value: internalEditor_0.actors.editorActor, children: t6 }), $[23] = internalEditor_0.actors.editorActor, $[24] = t6, $[25] = t7) : t7 = $[25];
  let t8;
  return $[26] !== internalEditor_0.editor || $[27] !== t7 ? (t8 = /* @__PURE__ */ jsx(EditorContext$1.Provider, { value: internalEditor_0.editor, children: t7 }), $[26] = internalEditor_0.editor, $[27] = t7, $[28] = t8) : t8 = $[28], t8;
}
const usePortableTextEditorSelection = () => {
  const $ = c(3), editorActor = useContext(EditorActorContext), [selection, setSelection2] = useState(null);
  let t0, t1;
  return $[0] !== editorActor ? (t0 = () => {
    const subscription = editorActor.on("selection", (event) => {
      startTransition(() => {
        setSelection2(event.selection);
      });
    });
    return () => {
      subscription.unsubscribe();
    };
  }, t1 = [editorActor], $[0] = editorActor, $[1] = t0, $[2] = t1) : (t0 = $[1], t1 = $[2]), useEffect(t0, t1), selection;
};
export {
  EditorProvider,
  PortableTextEditable,
  PortableTextEditor,
  defineSchema,
  defaultKeyGenerator as keyGenerator,
  useEditor,
  useEditorSelector,
  usePortableTextEditor,
  usePortableTextEditorSelection
};
//# sourceMappingURL=index.js.map
