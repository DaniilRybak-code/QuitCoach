(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();function xP(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var mT={exports:{}},Xh={},gT={exports:{}},ae={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var tu=Symbol.for("react.element"),LP=Symbol.for("react.portal"),MP=Symbol.for("react.fragment"),VP=Symbol.for("react.strict_mode"),FP=Symbol.for("react.profiler"),UP=Symbol.for("react.provider"),BP=Symbol.for("react.context"),zP=Symbol.for("react.forward_ref"),jP=Symbol.for("react.suspense"),WP=Symbol.for("react.memo"),$P=Symbol.for("react.lazy"),Uv=Symbol.iterator;function HP(t){return t===null||typeof t!="object"?null:(t=Uv&&t[Uv]||t["@@iterator"],typeof t=="function"?t:null)}var _T={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},yT=Object.assign,vT={};function qo(t,e,n){this.props=t,this.context=e,this.refs=vT,this.updater=n||_T}qo.prototype.isReactComponent={};qo.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};qo.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function ET(){}ET.prototype=qo.prototype;function og(t,e,n){this.props=t,this.context=e,this.refs=vT,this.updater=n||_T}var ag=og.prototype=new ET;ag.constructor=og;yT(ag,qo.prototype);ag.isPureReactComponent=!0;var Bv=Array.isArray,wT=Object.prototype.hasOwnProperty,lg={current:null},IT={key:!0,ref:!0,__self:!0,__source:!0};function TT(t,e,n){var r,i={},s=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)wT.call(e,r)&&!IT.hasOwnProperty(r)&&(i[r]=e[r]);var a=arguments.length-2;if(a===1)i.children=n;else if(1<a){for(var u=Array(a),c=0;c<a;c++)u[c]=arguments[c+2];i.children=u}if(t&&t.defaultProps)for(r in a=t.defaultProps,a)i[r]===void 0&&(i[r]=a[r]);return{$$typeof:tu,type:t,key:s,ref:o,props:i,_owner:lg.current}}function qP(t,e){return{$$typeof:tu,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function ug(t){return typeof t=="object"&&t!==null&&t.$$typeof===tu}function GP(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var zv=/\/+/g;function Tf(t,e){return typeof t=="object"&&t!==null&&t.key!=null?GP(""+t.key):e.toString(36)}function Ic(t,e,n,r,i){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case tu:case LP:o=!0}}if(o)return o=t,i=i(o),t=r===""?"."+Tf(o,0):r,Bv(i)?(n="",t!=null&&(n=t.replace(zv,"$&/")+"/"),Ic(i,e,n,"",function(c){return c})):i!=null&&(ug(i)&&(i=qP(i,n+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(zv,"$&/")+"/")+t)),e.push(i)),1;if(o=0,r=r===""?".":r+":",Bv(t))for(var a=0;a<t.length;a++){s=t[a];var u=r+Tf(s,a);o+=Ic(s,e,n,u,i)}else if(u=HP(t),typeof u=="function")for(t=u.call(t),a=0;!(s=t.next()).done;)s=s.value,u=r+Tf(s,a++),o+=Ic(s,e,n,u,i);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function Qu(t,e,n){if(t==null)return t;var r=[],i=0;return Ic(t,r,"","",function(s){return e.call(n,s,i++)}),r}function KP(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Mt={current:null},Tc={transition:null},QP={ReactCurrentDispatcher:Mt,ReactCurrentBatchConfig:Tc,ReactCurrentOwner:lg};function ST(){throw Error("act(...) is not supported in production builds of React.")}ae.Children={map:Qu,forEach:function(t,e,n){Qu(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Qu(t,function(){e++}),e},toArray:function(t){return Qu(t,function(e){return e})||[]},only:function(t){if(!ug(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};ae.Component=qo;ae.Fragment=MP;ae.Profiler=FP;ae.PureComponent=og;ae.StrictMode=VP;ae.Suspense=jP;ae.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=QP;ae.act=ST;ae.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var r=yT({},t.props),i=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=lg.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(u in e)wT.call(e,u)&&!IT.hasOwnProperty(u)&&(r[u]=e[u]===void 0&&a!==void 0?a[u]:e[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){a=Array(u);for(var c=0;c<u;c++)a[c]=arguments[c+2];r.children=a}return{$$typeof:tu,type:t.type,key:i,ref:s,props:r,_owner:o}};ae.createContext=function(t){return t={$$typeof:BP,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:UP,_context:t},t.Consumer=t};ae.createElement=TT;ae.createFactory=function(t){var e=TT.bind(null,t);return e.type=t,e};ae.createRef=function(){return{current:null}};ae.forwardRef=function(t){return{$$typeof:zP,render:t}};ae.isValidElement=ug;ae.lazy=function(t){return{$$typeof:$P,_payload:{_status:-1,_result:t},_init:KP}};ae.memo=function(t,e){return{$$typeof:WP,type:t,compare:e===void 0?null:e}};ae.startTransition=function(t){var e=Tc.transition;Tc.transition={};try{t()}finally{Tc.transition=e}};ae.unstable_act=ST;ae.useCallback=function(t,e){return Mt.current.useCallback(t,e)};ae.useContext=function(t){return Mt.current.useContext(t)};ae.useDebugValue=function(){};ae.useDeferredValue=function(t){return Mt.current.useDeferredValue(t)};ae.useEffect=function(t,e){return Mt.current.useEffect(t,e)};ae.useId=function(){return Mt.current.useId()};ae.useImperativeHandle=function(t,e,n){return Mt.current.useImperativeHandle(t,e,n)};ae.useInsertionEffect=function(t,e){return Mt.current.useInsertionEffect(t,e)};ae.useLayoutEffect=function(t,e){return Mt.current.useLayoutEffect(t,e)};ae.useMemo=function(t,e){return Mt.current.useMemo(t,e)};ae.useReducer=function(t,e,n){return Mt.current.useReducer(t,e,n)};ae.useRef=function(t){return Mt.current.useRef(t)};ae.useState=function(t){return Mt.current.useState(t)};ae.useSyncExternalStore=function(t,e,n){return Mt.current.useSyncExternalStore(t,e,n)};ae.useTransition=function(){return Mt.current.useTransition()};ae.version="18.3.1";gT.exports=ae;var he=gT.exports;const YP=xP(he);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var XP=he,JP=Symbol.for("react.element"),ZP=Symbol.for("react.fragment"),ek=Object.prototype.hasOwnProperty,tk=XP.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,nk={key:!0,ref:!0,__self:!0,__source:!0};function CT(t,e,n){var r,i={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)ek.call(e,r)&&!nk.hasOwnProperty(r)&&(i[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)i[r]===void 0&&(i[r]=e[r]);return{$$typeof:JP,type:t,key:s,ref:o,props:i,_owner:tk.current}}Xh.Fragment=ZP;Xh.jsx=CT;Xh.jsxs=CT;mT.exports=Xh;var jv=mT.exports,Tp={},AT={exports:{}},sn={},RT={exports:{}},PT={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(W,Z){var ne=W.length;W.push(Z);e:for(;0<ne;){var Ce=ne-1>>>1,_e=W[Ce];if(0<i(_e,Z))W[Ce]=Z,W[ne]=_e,ne=Ce;else break e}}function n(W){return W.length===0?null:W[0]}function r(W){if(W.length===0)return null;var Z=W[0],ne=W.pop();if(ne!==Z){W[0]=ne;e:for(var Ce=0,_e=W.length,Me=_e>>>1;Ce<Me;){var Tn=2*(Ce+1)-1,Sn=W[Tn],Cn=Tn+1,ln=W[Cn];if(0>i(Sn,ne))Cn<_e&&0>i(ln,Sn)?(W[Ce]=ln,W[Cn]=ne,Ce=Cn):(W[Ce]=Sn,W[Tn]=ne,Ce=Tn);else if(Cn<_e&&0>i(ln,ne))W[Ce]=ln,W[Cn]=ne,Ce=Cn;else break e}}return Z}function i(W,Z){var ne=W.sortIndex-Z.sortIndex;return ne!==0?ne:W.id-Z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();t.unstable_now=function(){return o.now()-a}}var u=[],c=[],d=1,f=null,m=3,y=!1,C=!1,N=!1,b=typeof setTimeout=="function"?setTimeout:null,S=typeof clearTimeout=="function"?clearTimeout:null,v=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function A(W){for(var Z=n(c);Z!==null;){if(Z.callback===null)r(c);else if(Z.startTime<=W)r(c),Z.sortIndex=Z.expirationTime,e(u,Z);else break;Z=n(c)}}function O(W){if(N=!1,A(W),!C)if(n(u)!==null)C=!0,Bi(j);else{var Z=n(c);Z!==null&&In(O,Z.startTime-W)}}function j(W,Z){C=!1,N&&(N=!1,S(_),_=-1),y=!0;var ne=m;try{for(A(Z),f=n(u);f!==null&&(!(f.expirationTime>Z)||W&&!R());){var Ce=f.callback;if(typeof Ce=="function"){f.callback=null,m=f.priorityLevel;var _e=Ce(f.expirationTime<=Z);Z=t.unstable_now(),typeof _e=="function"?f.callback=_e:f===n(u)&&r(u),A(Z)}else r(u);f=n(u)}if(f!==null)var Me=!0;else{var Tn=n(c);Tn!==null&&In(O,Tn.startTime-Z),Me=!1}return Me}finally{f=null,m=ne,y=!1}}var z=!1,w=null,_=-1,E=5,T=-1;function R(){return!(t.unstable_now()-T<E)}function k(){if(w!==null){var W=t.unstable_now();T=W;var Z=!0;try{Z=w(!0,W)}finally{Z?I():(z=!1,w=null)}}else z=!1}var I;if(typeof v=="function")I=function(){v(k)};else if(typeof MessageChannel<"u"){var Ft=new MessageChannel,hr=Ft.port2;Ft.port1.onmessage=k,I=function(){hr.postMessage(null)}}else I=function(){b(k,0)};function Bi(W){w=W,z||(z=!0,I())}function In(W,Z){_=b(function(){W(t.unstable_now())},Z)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(W){W.callback=null},t.unstable_continueExecution=function(){C||y||(C=!0,Bi(j))},t.unstable_forceFrameRate=function(W){0>W||125<W?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):E=0<W?Math.floor(1e3/W):5},t.unstable_getCurrentPriorityLevel=function(){return m},t.unstable_getFirstCallbackNode=function(){return n(u)},t.unstable_next=function(W){switch(m){case 1:case 2:case 3:var Z=3;break;default:Z=m}var ne=m;m=Z;try{return W()}finally{m=ne}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(W,Z){switch(W){case 1:case 2:case 3:case 4:case 5:break;default:W=3}var ne=m;m=W;try{return Z()}finally{m=ne}},t.unstable_scheduleCallback=function(W,Z,ne){var Ce=t.unstable_now();switch(typeof ne=="object"&&ne!==null?(ne=ne.delay,ne=typeof ne=="number"&&0<ne?Ce+ne:Ce):ne=Ce,W){case 1:var _e=-1;break;case 2:_e=250;break;case 5:_e=1073741823;break;case 4:_e=1e4;break;default:_e=5e3}return _e=ne+_e,W={id:d++,callback:Z,priorityLevel:W,startTime:ne,expirationTime:_e,sortIndex:-1},ne>Ce?(W.sortIndex=ne,e(c,W),n(u)===null&&W===n(c)&&(N?(S(_),_=-1):N=!0,In(O,ne-Ce))):(W.sortIndex=_e,e(u,W),C||y||(C=!0,Bi(j))),W},t.unstable_shouldYield=R,t.unstable_wrapCallback=function(W){var Z=m;return function(){var ne=m;m=Z;try{return W.apply(this,arguments)}finally{m=ne}}}})(PT);RT.exports=PT;var rk=RT.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ik=he,nn=rk;function M(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var kT=new Set,gl={};function Ss(t,e){Ro(t,e),Ro(t+"Capture",e)}function Ro(t,e){for(gl[t]=e,t=0;t<e.length;t++)kT.add(e[t])}var Cr=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Sp=Object.prototype.hasOwnProperty,sk=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Wv={},$v={};function ok(t){return Sp.call($v,t)?!0:Sp.call(Wv,t)?!1:sk.test(t)?$v[t]=!0:(Wv[t]=!0,!1)}function ak(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function lk(t,e,n,r){if(e===null||typeof e>"u"||ak(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function Vt(t,e,n,r,i,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var _t={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){_t[t]=new Vt(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];_t[e]=new Vt(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){_t[t]=new Vt(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){_t[t]=new Vt(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){_t[t]=new Vt(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){_t[t]=new Vt(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){_t[t]=new Vt(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){_t[t]=new Vt(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){_t[t]=new Vt(t,5,!1,t.toLowerCase(),null,!1,!1)});var cg=/[\-:]([a-z])/g;function hg(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(cg,hg);_t[e]=new Vt(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(cg,hg);_t[e]=new Vt(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(cg,hg);_t[e]=new Vt(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){_t[t]=new Vt(t,1,!1,t.toLowerCase(),null,!1,!1)});_t.xlinkHref=new Vt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){_t[t]=new Vt(t,1,!1,t.toLowerCase(),null,!0,!0)});function dg(t,e,n,r){var i=_t.hasOwnProperty(e)?_t[e]:null;(i!==null?i.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(lk(e,n,i,r)&&(n=null),r||i===null?ok(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):i.mustUseProperty?t[i.propertyName]=n===null?i.type===3?!1:"":n:(e=i.attributeName,r=i.attributeNamespace,n===null?t.removeAttribute(e):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var Fr=ik.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Yu=Symbol.for("react.element"),Zs=Symbol.for("react.portal"),eo=Symbol.for("react.fragment"),fg=Symbol.for("react.strict_mode"),Cp=Symbol.for("react.profiler"),NT=Symbol.for("react.provider"),DT=Symbol.for("react.context"),pg=Symbol.for("react.forward_ref"),Ap=Symbol.for("react.suspense"),Rp=Symbol.for("react.suspense_list"),mg=Symbol.for("react.memo"),Gr=Symbol.for("react.lazy"),OT=Symbol.for("react.offscreen"),Hv=Symbol.iterator;function wa(t){return t===null||typeof t!="object"?null:(t=Hv&&t[Hv]||t["@@iterator"],typeof t=="function"?t:null)}var Be=Object.assign,Sf;function La(t){if(Sf===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Sf=e&&e[1]||""}return`
`+Sf+t}var Cf=!1;function Af(t,e){if(!t||Cf)return"";Cf=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var r=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){r=c}t.call(e.prototype)}else{try{throw Error()}catch(c){r=c}t()}}catch(c){if(c&&r&&typeof c.stack=="string"){for(var i=c.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,a=s.length-1;1<=o&&0<=a&&i[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(i[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||i[o]!==s[a]){var u=`
`+i[o].replace(" at new "," at ");return t.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",t.displayName)),u}while(1<=o&&0<=a);break}}}finally{Cf=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?La(t):""}function uk(t){switch(t.tag){case 5:return La(t.type);case 16:return La("Lazy");case 13:return La("Suspense");case 19:return La("SuspenseList");case 0:case 2:case 15:return t=Af(t.type,!1),t;case 11:return t=Af(t.type.render,!1),t;case 1:return t=Af(t.type,!0),t;default:return""}}function Pp(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case eo:return"Fragment";case Zs:return"Portal";case Cp:return"Profiler";case fg:return"StrictMode";case Ap:return"Suspense";case Rp:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case DT:return(t.displayName||"Context")+".Consumer";case NT:return(t._context.displayName||"Context")+".Provider";case pg:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case mg:return e=t.displayName||null,e!==null?e:Pp(t.type)||"Memo";case Gr:e=t._payload,t=t._init;try{return Pp(t(e))}catch{}}return null}function ck(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Pp(e);case 8:return e===fg?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function wi(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function bT(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function hk(t){var e=bT(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Xu(t){t._valueTracker||(t._valueTracker=hk(t))}function xT(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=bT(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function qc(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function kp(t,e){var n=e.checked;return Be({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function qv(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=wi(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function LT(t,e){e=e.checked,e!=null&&dg(t,"checked",e,!1)}function Np(t,e){LT(t,e);var n=wi(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Dp(t,e.type,n):e.hasOwnProperty("defaultValue")&&Dp(t,e.type,wi(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Gv(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Dp(t,e,n){(e!=="number"||qc(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Ma=Array.isArray;function ho(t,e,n,r){if(t=t.options,e){e={};for(var i=0;i<n.length;i++)e["$"+n[i]]=!0;for(n=0;n<t.length;n++)i=e.hasOwnProperty("$"+t[n].value),t[n].selected!==i&&(t[n].selected=i),i&&r&&(t[n].defaultSelected=!0)}else{for(n=""+wi(n),e=null,i=0;i<t.length;i++){if(t[i].value===n){t[i].selected=!0,r&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function Op(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(M(91));return Be({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Kv(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(M(92));if(Ma(n)){if(1<n.length)throw Error(M(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:wi(n)}}function MT(t,e){var n=wi(e.value),r=wi(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function Qv(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function VT(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function bp(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?VT(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Ju,FT=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,r,i){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Ju=Ju||document.createElement("div"),Ju.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Ju.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function _l(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Ka={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},dk=["Webkit","ms","Moz","O"];Object.keys(Ka).forEach(function(t){dk.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ka[e]=Ka[t]})});function UT(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Ka.hasOwnProperty(t)&&Ka[t]?(""+e).trim():e+"px"}function BT(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=UT(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,i):t[n]=i}}var fk=Be({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function xp(t,e){if(e){if(fk[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(M(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(M(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(M(61))}if(e.style!=null&&typeof e.style!="object")throw Error(M(62))}}function Lp(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Mp=null;function gg(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Vp=null,fo=null,po=null;function Yv(t){if(t=iu(t)){if(typeof Vp!="function")throw Error(M(280));var e=t.stateNode;e&&(e=nd(e),Vp(t.stateNode,t.type,e))}}function zT(t){fo?po?po.push(t):po=[t]:fo=t}function jT(){if(fo){var t=fo,e=po;if(po=fo=null,Yv(t),e)for(t=0;t<e.length;t++)Yv(e[t])}}function WT(t,e){return t(e)}function $T(){}var Rf=!1;function HT(t,e,n){if(Rf)return t(e,n);Rf=!0;try{return WT(t,e,n)}finally{Rf=!1,(fo!==null||po!==null)&&($T(),jT())}}function yl(t,e){var n=t.stateNode;if(n===null)return null;var r=nd(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(M(231,e,typeof n));return n}var Fp=!1;if(Cr)try{var Ia={};Object.defineProperty(Ia,"passive",{get:function(){Fp=!0}}),window.addEventListener("test",Ia,Ia),window.removeEventListener("test",Ia,Ia)}catch{Fp=!1}function pk(t,e,n,r,i,s,o,a,u){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(d){this.onError(d)}}var Qa=!1,Gc=null,Kc=!1,Up=null,mk={onError:function(t){Qa=!0,Gc=t}};function gk(t,e,n,r,i,s,o,a,u){Qa=!1,Gc=null,pk.apply(mk,arguments)}function _k(t,e,n,r,i,s,o,a,u){if(gk.apply(this,arguments),Qa){if(Qa){var c=Gc;Qa=!1,Gc=null}else throw Error(M(198));Kc||(Kc=!0,Up=c)}}function Cs(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function qT(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Xv(t){if(Cs(t)!==t)throw Error(M(188))}function yk(t){var e=t.alternate;if(!e){if(e=Cs(t),e===null)throw Error(M(188));return e!==t?null:t}for(var n=t,r=e;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return Xv(i),t;if(s===r)return Xv(i),e;s=s.sibling}throw Error(M(188))}if(n.return!==r.return)n=i,r=s;else{for(var o=!1,a=i.child;a;){if(a===n){o=!0,n=i,r=s;break}if(a===r){o=!0,r=i,n=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===n){o=!0,n=s,r=i;break}if(a===r){o=!0,r=s,n=i;break}a=a.sibling}if(!o)throw Error(M(189))}}if(n.alternate!==r)throw Error(M(190))}if(n.tag!==3)throw Error(M(188));return n.stateNode.current===n?t:e}function GT(t){return t=yk(t),t!==null?KT(t):null}function KT(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=KT(t);if(e!==null)return e;t=t.sibling}return null}var QT=nn.unstable_scheduleCallback,Jv=nn.unstable_cancelCallback,vk=nn.unstable_shouldYield,Ek=nn.unstable_requestPaint,qe=nn.unstable_now,wk=nn.unstable_getCurrentPriorityLevel,_g=nn.unstable_ImmediatePriority,YT=nn.unstable_UserBlockingPriority,Qc=nn.unstable_NormalPriority,Ik=nn.unstable_LowPriority,XT=nn.unstable_IdlePriority,Jh=null,er=null;function Tk(t){if(er&&typeof er.onCommitFiberRoot=="function")try{er.onCommitFiberRoot(Jh,t,void 0,(t.current.flags&128)===128)}catch{}}var Mn=Math.clz32?Math.clz32:Ak,Sk=Math.log,Ck=Math.LN2;function Ak(t){return t>>>=0,t===0?32:31-(Sk(t)/Ck|0)|0}var Zu=64,ec=4194304;function Va(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Yc(t,e){var n=t.pendingLanes;if(n===0)return 0;var r=0,i=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var a=o&~i;a!==0?r=Va(a):(s&=o,s!==0&&(r=Va(s)))}else o=n&~i,o!==0?r=Va(o):s!==0&&(r=Va(s));if(r===0)return 0;if(e!==0&&e!==r&&!(e&i)&&(i=r&-r,s=e&-e,i>=s||i===16&&(s&4194240)!==0))return e;if(r&4&&(r|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-Mn(e),i=1<<n,r|=t[n],e&=~i;return r}function Rk(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Pk(t,e){for(var n=t.suspendedLanes,r=t.pingedLanes,i=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-Mn(s),a=1<<o,u=i[o];u===-1?(!(a&n)||a&r)&&(i[o]=Rk(a,e)):u<=e&&(t.expiredLanes|=a),s&=~a}}function Bp(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function JT(){var t=Zu;return Zu<<=1,!(Zu&4194240)&&(Zu=64),t}function Pf(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function nu(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Mn(e),t[e]=n}function kk(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var r=t.eventTimes;for(t=t.expirationTimes;0<n;){var i=31-Mn(n),s=1<<i;e[i]=0,r[i]=-1,t[i]=-1,n&=~s}}function yg(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var r=31-Mn(n),i=1<<r;i&e|t[r]&e&&(t[r]|=e),n&=~i}}var ye=0;function ZT(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var e0,vg,t0,n0,r0,zp=!1,tc=[],oi=null,ai=null,li=null,vl=new Map,El=new Map,Qr=[],Nk="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Zv(t,e){switch(t){case"focusin":case"focusout":oi=null;break;case"dragenter":case"dragleave":ai=null;break;case"mouseover":case"mouseout":li=null;break;case"pointerover":case"pointerout":vl.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":El.delete(e.pointerId)}}function Ta(t,e,n,r,i,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},e!==null&&(e=iu(e),e!==null&&vg(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function Dk(t,e,n,r,i){switch(e){case"focusin":return oi=Ta(oi,t,e,n,r,i),!0;case"dragenter":return ai=Ta(ai,t,e,n,r,i),!0;case"mouseover":return li=Ta(li,t,e,n,r,i),!0;case"pointerover":var s=i.pointerId;return vl.set(s,Ta(vl.get(s)||null,t,e,n,r,i)),!0;case"gotpointercapture":return s=i.pointerId,El.set(s,Ta(El.get(s)||null,t,e,n,r,i)),!0}return!1}function i0(t){var e=Ji(t.target);if(e!==null){var n=Cs(e);if(n!==null){if(e=n.tag,e===13){if(e=qT(n),e!==null){t.blockedOn=e,r0(t.priority,function(){t0(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Sc(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=jp(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var r=new n.constructor(n.type,n);Mp=r,n.target.dispatchEvent(r),Mp=null}else return e=iu(n),e!==null&&vg(e),t.blockedOn=n,!1;e.shift()}return!0}function eE(t,e,n){Sc(t)&&n.delete(e)}function Ok(){zp=!1,oi!==null&&Sc(oi)&&(oi=null),ai!==null&&Sc(ai)&&(ai=null),li!==null&&Sc(li)&&(li=null),vl.forEach(eE),El.forEach(eE)}function Sa(t,e){t.blockedOn===e&&(t.blockedOn=null,zp||(zp=!0,nn.unstable_scheduleCallback(nn.unstable_NormalPriority,Ok)))}function wl(t){function e(i){return Sa(i,t)}if(0<tc.length){Sa(tc[0],t);for(var n=1;n<tc.length;n++){var r=tc[n];r.blockedOn===t&&(r.blockedOn=null)}}for(oi!==null&&Sa(oi,t),ai!==null&&Sa(ai,t),li!==null&&Sa(li,t),vl.forEach(e),El.forEach(e),n=0;n<Qr.length;n++)r=Qr[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<Qr.length&&(n=Qr[0],n.blockedOn===null);)i0(n),n.blockedOn===null&&Qr.shift()}var mo=Fr.ReactCurrentBatchConfig,Xc=!0;function bk(t,e,n,r){var i=ye,s=mo.transition;mo.transition=null;try{ye=1,Eg(t,e,n,r)}finally{ye=i,mo.transition=s}}function xk(t,e,n,r){var i=ye,s=mo.transition;mo.transition=null;try{ye=4,Eg(t,e,n,r)}finally{ye=i,mo.transition=s}}function Eg(t,e,n,r){if(Xc){var i=jp(t,e,n,r);if(i===null)Ff(t,e,r,Jc,n),Zv(t,r);else if(Dk(i,t,e,n,r))r.stopPropagation();else if(Zv(t,r),e&4&&-1<Nk.indexOf(t)){for(;i!==null;){var s=iu(i);if(s!==null&&e0(s),s=jp(t,e,n,r),s===null&&Ff(t,e,r,Jc,n),s===i)break;i=s}i!==null&&r.stopPropagation()}else Ff(t,e,r,null,n)}}var Jc=null;function jp(t,e,n,r){if(Jc=null,t=gg(r),t=Ji(t),t!==null)if(e=Cs(t),e===null)t=null;else if(n=e.tag,n===13){if(t=qT(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Jc=t,null}function s0(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(wk()){case _g:return 1;case YT:return 4;case Qc:case Ik:return 16;case XT:return 536870912;default:return 16}default:return 16}}var ti=null,wg=null,Cc=null;function o0(){if(Cc)return Cc;var t,e=wg,n=e.length,r,i="value"in ti?ti.value:ti.textContent,s=i.length;for(t=0;t<n&&e[t]===i[t];t++);var o=n-t;for(r=1;r<=o&&e[n-r]===i[s-r];r++);return Cc=i.slice(t,1<r?1-r:void 0)}function Ac(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function nc(){return!0}function tE(){return!1}function on(t){function e(n,r,i,s,o){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(n=t[a],this[a]=n?n(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?nc:tE,this.isPropagationStopped=tE,this}return Be(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=nc)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=nc)},persist:function(){},isPersistent:nc}),e}var Go={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ig=on(Go),ru=Be({},Go,{view:0,detail:0}),Lk=on(ru),kf,Nf,Ca,Zh=Be({},ru,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Tg,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Ca&&(Ca&&t.type==="mousemove"?(kf=t.screenX-Ca.screenX,Nf=t.screenY-Ca.screenY):Nf=kf=0,Ca=t),kf)},movementY:function(t){return"movementY"in t?t.movementY:Nf}}),nE=on(Zh),Mk=Be({},Zh,{dataTransfer:0}),Vk=on(Mk),Fk=Be({},ru,{relatedTarget:0}),Df=on(Fk),Uk=Be({},Go,{animationName:0,elapsedTime:0,pseudoElement:0}),Bk=on(Uk),zk=Be({},Go,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),jk=on(zk),Wk=Be({},Go,{data:0}),rE=on(Wk),$k={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Hk={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},qk={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Gk(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=qk[t])?!!e[t]:!1}function Tg(){return Gk}var Kk=Be({},ru,{key:function(t){if(t.key){var e=$k[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Ac(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Hk[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Tg,charCode:function(t){return t.type==="keypress"?Ac(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Ac(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Qk=on(Kk),Yk=Be({},Zh,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),iE=on(Yk),Xk=Be({},ru,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Tg}),Jk=on(Xk),Zk=Be({},Go,{propertyName:0,elapsedTime:0,pseudoElement:0}),eN=on(Zk),tN=Be({},Zh,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),nN=on(tN),rN=[9,13,27,32],Sg=Cr&&"CompositionEvent"in window,Ya=null;Cr&&"documentMode"in document&&(Ya=document.documentMode);var iN=Cr&&"TextEvent"in window&&!Ya,a0=Cr&&(!Sg||Ya&&8<Ya&&11>=Ya),sE=String.fromCharCode(32),oE=!1;function l0(t,e){switch(t){case"keyup":return rN.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function u0(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var to=!1;function sN(t,e){switch(t){case"compositionend":return u0(e);case"keypress":return e.which!==32?null:(oE=!0,sE);case"textInput":return t=e.data,t===sE&&oE?null:t;default:return null}}function oN(t,e){if(to)return t==="compositionend"||!Sg&&l0(t,e)?(t=o0(),Cc=wg=ti=null,to=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return a0&&e.locale!=="ko"?null:e.data;default:return null}}var aN={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function aE(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!aN[t.type]:e==="textarea"}function c0(t,e,n,r){zT(r),e=Zc(e,"onChange"),0<e.length&&(n=new Ig("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var Xa=null,Il=null;function lN(t){w0(t,0)}function ed(t){var e=io(t);if(xT(e))return t}function uN(t,e){if(t==="change")return e}var h0=!1;if(Cr){var Of;if(Cr){var bf="oninput"in document;if(!bf){var lE=document.createElement("div");lE.setAttribute("oninput","return;"),bf=typeof lE.oninput=="function"}Of=bf}else Of=!1;h0=Of&&(!document.documentMode||9<document.documentMode)}function uE(){Xa&&(Xa.detachEvent("onpropertychange",d0),Il=Xa=null)}function d0(t){if(t.propertyName==="value"&&ed(Il)){var e=[];c0(e,Il,t,gg(t)),HT(lN,e)}}function cN(t,e,n){t==="focusin"?(uE(),Xa=e,Il=n,Xa.attachEvent("onpropertychange",d0)):t==="focusout"&&uE()}function hN(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return ed(Il)}function dN(t,e){if(t==="click")return ed(e)}function fN(t,e){if(t==="input"||t==="change")return ed(e)}function pN(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Bn=typeof Object.is=="function"?Object.is:pN;function Tl(t,e){if(Bn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Sp.call(e,i)||!Bn(t[i],e[i]))return!1}return!0}function cE(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function hE(t,e){var n=cE(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=cE(n)}}function f0(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?f0(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function p0(){for(var t=window,e=qc();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=qc(t.document)}return e}function Cg(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function mN(t){var e=p0(),n=t.focusedElem,r=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&f0(n.ownerDocument.documentElement,n)){if(r!==null&&Cg(n)){if(e=r.start,t=r.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=n.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!t.extend&&s>r&&(i=r,r=s,s=i),i=hE(n,s);var o=hE(n,r);i&&o&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),s>r?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var gN=Cr&&"documentMode"in document&&11>=document.documentMode,no=null,Wp=null,Ja=null,$p=!1;function dE(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;$p||no==null||no!==qc(r)||(r=no,"selectionStart"in r&&Cg(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Ja&&Tl(Ja,r)||(Ja=r,r=Zc(Wp,"onSelect"),0<r.length&&(e=new Ig("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=no)))}function rc(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var ro={animationend:rc("Animation","AnimationEnd"),animationiteration:rc("Animation","AnimationIteration"),animationstart:rc("Animation","AnimationStart"),transitionend:rc("Transition","TransitionEnd")},xf={},m0={};Cr&&(m0=document.createElement("div").style,"AnimationEvent"in window||(delete ro.animationend.animation,delete ro.animationiteration.animation,delete ro.animationstart.animation),"TransitionEvent"in window||delete ro.transitionend.transition);function td(t){if(xf[t])return xf[t];if(!ro[t])return t;var e=ro[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in m0)return xf[t]=e[n];return t}var g0=td("animationend"),_0=td("animationiteration"),y0=td("animationstart"),v0=td("transitionend"),E0=new Map,fE="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function xi(t,e){E0.set(t,e),Ss(e,[t])}for(var Lf=0;Lf<fE.length;Lf++){var Mf=fE[Lf],_N=Mf.toLowerCase(),yN=Mf[0].toUpperCase()+Mf.slice(1);xi(_N,"on"+yN)}xi(g0,"onAnimationEnd");xi(_0,"onAnimationIteration");xi(y0,"onAnimationStart");xi("dblclick","onDoubleClick");xi("focusin","onFocus");xi("focusout","onBlur");xi(v0,"onTransitionEnd");Ro("onMouseEnter",["mouseout","mouseover"]);Ro("onMouseLeave",["mouseout","mouseover"]);Ro("onPointerEnter",["pointerout","pointerover"]);Ro("onPointerLeave",["pointerout","pointerover"]);Ss("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ss("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ss("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ss("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ss("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ss("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Fa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),vN=new Set("cancel close invalid load scroll toggle".split(" ").concat(Fa));function pE(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,_k(r,e,void 0,t),t.currentTarget=null}function w0(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var r=t[n],i=r.event;r=r.listeners;e:{var s=void 0;if(e)for(var o=r.length-1;0<=o;o--){var a=r[o],u=a.instance,c=a.currentTarget;if(a=a.listener,u!==s&&i.isPropagationStopped())break e;pE(i,a,c),s=u}else for(o=0;o<r.length;o++){if(a=r[o],u=a.instance,c=a.currentTarget,a=a.listener,u!==s&&i.isPropagationStopped())break e;pE(i,a,c),s=u}}}if(Kc)throw t=Up,Kc=!1,Up=null,t}function Re(t,e){var n=e[Qp];n===void 0&&(n=e[Qp]=new Set);var r=t+"__bubble";n.has(r)||(I0(e,t,2,!1),n.add(r))}function Vf(t,e,n){var r=0;e&&(r|=4),I0(n,t,r,e)}var ic="_reactListening"+Math.random().toString(36).slice(2);function Sl(t){if(!t[ic]){t[ic]=!0,kT.forEach(function(n){n!=="selectionchange"&&(vN.has(n)||Vf(n,!1,t),Vf(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[ic]||(e[ic]=!0,Vf("selectionchange",!1,e))}}function I0(t,e,n,r){switch(s0(e)){case 1:var i=bk;break;case 4:i=xk;break;default:i=Eg}n=i.bind(null,e,n,t),i=void 0,!Fp||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),r?i!==void 0?t.addEventListener(e,n,{capture:!0,passive:i}):t.addEventListener(e,n,!0):i!==void 0?t.addEventListener(e,n,{passive:i}):t.addEventListener(e,n,!1)}function Ff(t,e,n,r,i){var s=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var a=r.stateNode.containerInfo;if(a===i||a.nodeType===8&&a.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===i||u.nodeType===8&&u.parentNode===i))return;o=o.return}for(;a!==null;){if(o=Ji(a),o===null)return;if(u=o.tag,u===5||u===6){r=s=o;continue e}a=a.parentNode}}r=r.return}HT(function(){var c=s,d=gg(n),f=[];e:{var m=E0.get(t);if(m!==void 0){var y=Ig,C=t;switch(t){case"keypress":if(Ac(n)===0)break e;case"keydown":case"keyup":y=Qk;break;case"focusin":C="focus",y=Df;break;case"focusout":C="blur",y=Df;break;case"beforeblur":case"afterblur":y=Df;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":y=nE;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":y=Vk;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":y=Jk;break;case g0:case _0:case y0:y=Bk;break;case v0:y=eN;break;case"scroll":y=Lk;break;case"wheel":y=nN;break;case"copy":case"cut":case"paste":y=jk;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":y=iE}var N=(e&4)!==0,b=!N&&t==="scroll",S=N?m!==null?m+"Capture":null:m;N=[];for(var v=c,A;v!==null;){A=v;var O=A.stateNode;if(A.tag===5&&O!==null&&(A=O,S!==null&&(O=yl(v,S),O!=null&&N.push(Cl(v,O,A)))),b)break;v=v.return}0<N.length&&(m=new y(m,C,null,n,d),f.push({event:m,listeners:N}))}}if(!(e&7)){e:{if(m=t==="mouseover"||t==="pointerover",y=t==="mouseout"||t==="pointerout",m&&n!==Mp&&(C=n.relatedTarget||n.fromElement)&&(Ji(C)||C[Ar]))break e;if((y||m)&&(m=d.window===d?d:(m=d.ownerDocument)?m.defaultView||m.parentWindow:window,y?(C=n.relatedTarget||n.toElement,y=c,C=C?Ji(C):null,C!==null&&(b=Cs(C),C!==b||C.tag!==5&&C.tag!==6)&&(C=null)):(y=null,C=c),y!==C)){if(N=nE,O="onMouseLeave",S="onMouseEnter",v="mouse",(t==="pointerout"||t==="pointerover")&&(N=iE,O="onPointerLeave",S="onPointerEnter",v="pointer"),b=y==null?m:io(y),A=C==null?m:io(C),m=new N(O,v+"leave",y,n,d),m.target=b,m.relatedTarget=A,O=null,Ji(d)===c&&(N=new N(S,v+"enter",C,n,d),N.target=A,N.relatedTarget=b,O=N),b=O,y&&C)t:{for(N=y,S=C,v=0,A=N;A;A=qs(A))v++;for(A=0,O=S;O;O=qs(O))A++;for(;0<v-A;)N=qs(N),v--;for(;0<A-v;)S=qs(S),A--;for(;v--;){if(N===S||S!==null&&N===S.alternate)break t;N=qs(N),S=qs(S)}N=null}else N=null;y!==null&&mE(f,m,y,N,!1),C!==null&&b!==null&&mE(f,b,C,N,!0)}}e:{if(m=c?io(c):window,y=m.nodeName&&m.nodeName.toLowerCase(),y==="select"||y==="input"&&m.type==="file")var j=uN;else if(aE(m))if(h0)j=fN;else{j=hN;var z=cN}else(y=m.nodeName)&&y.toLowerCase()==="input"&&(m.type==="checkbox"||m.type==="radio")&&(j=dN);if(j&&(j=j(t,c))){c0(f,j,n,d);break e}z&&z(t,m,c),t==="focusout"&&(z=m._wrapperState)&&z.controlled&&m.type==="number"&&Dp(m,"number",m.value)}switch(z=c?io(c):window,t){case"focusin":(aE(z)||z.contentEditable==="true")&&(no=z,Wp=c,Ja=null);break;case"focusout":Ja=Wp=no=null;break;case"mousedown":$p=!0;break;case"contextmenu":case"mouseup":case"dragend":$p=!1,dE(f,n,d);break;case"selectionchange":if(gN)break;case"keydown":case"keyup":dE(f,n,d)}var w;if(Sg)e:{switch(t){case"compositionstart":var _="onCompositionStart";break e;case"compositionend":_="onCompositionEnd";break e;case"compositionupdate":_="onCompositionUpdate";break e}_=void 0}else to?l0(t,n)&&(_="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(_="onCompositionStart");_&&(a0&&n.locale!=="ko"&&(to||_!=="onCompositionStart"?_==="onCompositionEnd"&&to&&(w=o0()):(ti=d,wg="value"in ti?ti.value:ti.textContent,to=!0)),z=Zc(c,_),0<z.length&&(_=new rE(_,t,null,n,d),f.push({event:_,listeners:z}),w?_.data=w:(w=u0(n),w!==null&&(_.data=w)))),(w=iN?sN(t,n):oN(t,n))&&(c=Zc(c,"onBeforeInput"),0<c.length&&(d=new rE("onBeforeInput","beforeinput",null,n,d),f.push({event:d,listeners:c}),d.data=w))}w0(f,e)})}function Cl(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Zc(t,e){for(var n=e+"Capture",r=[];t!==null;){var i=t,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=yl(t,n),s!=null&&r.unshift(Cl(t,s,i)),s=yl(t,e),s!=null&&r.push(Cl(t,s,i))),t=t.return}return r}function qs(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function mE(t,e,n,r,i){for(var s=e._reactName,o=[];n!==null&&n!==r;){var a=n,u=a.alternate,c=a.stateNode;if(u!==null&&u===r)break;a.tag===5&&c!==null&&(a=c,i?(u=yl(n,s),u!=null&&o.unshift(Cl(n,u,a))):i||(u=yl(n,s),u!=null&&o.push(Cl(n,u,a)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var EN=/\r\n?/g,wN=/\u0000|\uFFFD/g;function gE(t){return(typeof t=="string"?t:""+t).replace(EN,`
`).replace(wN,"")}function sc(t,e,n){if(e=gE(e),gE(t)!==e&&n)throw Error(M(425))}function eh(){}var Hp=null,qp=null;function Gp(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Kp=typeof setTimeout=="function"?setTimeout:void 0,IN=typeof clearTimeout=="function"?clearTimeout:void 0,_E=typeof Promise=="function"?Promise:void 0,TN=typeof queueMicrotask=="function"?queueMicrotask:typeof _E<"u"?function(t){return _E.resolve(null).then(t).catch(SN)}:Kp;function SN(t){setTimeout(function(){throw t})}function Uf(t,e){var n=e,r=0;do{var i=n.nextSibling;if(t.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){t.removeChild(i),wl(e);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);wl(e)}function ui(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function yE(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Ko=Math.random().toString(36).slice(2),Yn="__reactFiber$"+Ko,Al="__reactProps$"+Ko,Ar="__reactContainer$"+Ko,Qp="__reactEvents$"+Ko,CN="__reactListeners$"+Ko,AN="__reactHandles$"+Ko;function Ji(t){var e=t[Yn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Ar]||n[Yn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=yE(t);t!==null;){if(n=t[Yn])return n;t=yE(t)}return e}t=n,n=t.parentNode}return null}function iu(t){return t=t[Yn]||t[Ar],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function io(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(M(33))}function nd(t){return t[Al]||null}var Yp=[],so=-1;function Li(t){return{current:t}}function Ne(t){0>so||(t.current=Yp[so],Yp[so]=null,so--)}function Te(t,e){so++,Yp[so]=t.current,t.current=e}var Ii={},kt=Li(Ii),jt=Li(!1),cs=Ii;function Po(t,e){var n=t.type.contextTypes;if(!n)return Ii;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in n)i[s]=e[s];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function Wt(t){return t=t.childContextTypes,t!=null}function th(){Ne(jt),Ne(kt)}function vE(t,e,n){if(kt.current!==Ii)throw Error(M(168));Te(kt,e),Te(jt,n)}function T0(t,e,n){var r=t.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in e))throw Error(M(108,ck(t)||"Unknown",i));return Be({},n,r)}function nh(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Ii,cs=kt.current,Te(kt,t),Te(jt,jt.current),!0}function EE(t,e,n){var r=t.stateNode;if(!r)throw Error(M(169));n?(t=T0(t,e,cs),r.__reactInternalMemoizedMergedChildContext=t,Ne(jt),Ne(kt),Te(kt,t)):Ne(jt),Te(jt,n)}var gr=null,rd=!1,Bf=!1;function S0(t){gr===null?gr=[t]:gr.push(t)}function RN(t){rd=!0,S0(t)}function Mi(){if(!Bf&&gr!==null){Bf=!0;var t=0,e=ye;try{var n=gr;for(ye=1;t<n.length;t++){var r=n[t];do r=r(!0);while(r!==null)}gr=null,rd=!1}catch(i){throw gr!==null&&(gr=gr.slice(t+1)),QT(_g,Mi),i}finally{ye=e,Bf=!1}}return null}var oo=[],ao=0,rh=null,ih=0,cn=[],hn=0,hs=null,_r=1,yr="";function Gi(t,e){oo[ao++]=ih,oo[ao++]=rh,rh=t,ih=e}function C0(t,e,n){cn[hn++]=_r,cn[hn++]=yr,cn[hn++]=hs,hs=t;var r=_r;t=yr;var i=32-Mn(r)-1;r&=~(1<<i),n+=1;var s=32-Mn(e)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,_r=1<<32-Mn(e)+i|n<<i|r,yr=s+t}else _r=1<<s|n<<i|r,yr=t}function Ag(t){t.return!==null&&(Gi(t,1),C0(t,1,0))}function Rg(t){for(;t===rh;)rh=oo[--ao],oo[ao]=null,ih=oo[--ao],oo[ao]=null;for(;t===hs;)hs=cn[--hn],cn[hn]=null,yr=cn[--hn],cn[hn]=null,_r=cn[--hn],cn[hn]=null}var en=null,Zt=null,be=!1,On=null;function A0(t,e){var n=mn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function wE(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,en=t,Zt=ui(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,en=t,Zt=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=hs!==null?{id:_r,overflow:yr}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=mn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,en=t,Zt=null,!0):!1;default:return!1}}function Xp(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Jp(t){if(be){var e=Zt;if(e){var n=e;if(!wE(t,e)){if(Xp(t))throw Error(M(418));e=ui(n.nextSibling);var r=en;e&&wE(t,e)?A0(r,n):(t.flags=t.flags&-4097|2,be=!1,en=t)}}else{if(Xp(t))throw Error(M(418));t.flags=t.flags&-4097|2,be=!1,en=t}}}function IE(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;en=t}function oc(t){if(t!==en)return!1;if(!be)return IE(t),be=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Gp(t.type,t.memoizedProps)),e&&(e=Zt)){if(Xp(t))throw R0(),Error(M(418));for(;e;)A0(t,e),e=ui(e.nextSibling)}if(IE(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(M(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Zt=ui(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Zt=null}}else Zt=en?ui(t.stateNode.nextSibling):null;return!0}function R0(){for(var t=Zt;t;)t=ui(t.nextSibling)}function ko(){Zt=en=null,be=!1}function Pg(t){On===null?On=[t]:On.push(t)}var PN=Fr.ReactCurrentBatchConfig;function Aa(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(M(309));var r=n.stateNode}if(!r)throw Error(M(147,t));var i=r,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=i.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(M(284));if(!n._owner)throw Error(M(290,t))}return t}function ac(t,e){throw t=Object.prototype.toString.call(e),Error(M(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function TE(t){var e=t._init;return e(t._payload)}function P0(t){function e(S,v){if(t){var A=S.deletions;A===null?(S.deletions=[v],S.flags|=16):A.push(v)}}function n(S,v){if(!t)return null;for(;v!==null;)e(S,v),v=v.sibling;return null}function r(S,v){for(S=new Map;v!==null;)v.key!==null?S.set(v.key,v):S.set(v.index,v),v=v.sibling;return S}function i(S,v){return S=fi(S,v),S.index=0,S.sibling=null,S}function s(S,v,A){return S.index=A,t?(A=S.alternate,A!==null?(A=A.index,A<v?(S.flags|=2,v):A):(S.flags|=2,v)):(S.flags|=1048576,v)}function o(S){return t&&S.alternate===null&&(S.flags|=2),S}function a(S,v,A,O){return v===null||v.tag!==6?(v=Gf(A,S.mode,O),v.return=S,v):(v=i(v,A),v.return=S,v)}function u(S,v,A,O){var j=A.type;return j===eo?d(S,v,A.props.children,O,A.key):v!==null&&(v.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===Gr&&TE(j)===v.type)?(O=i(v,A.props),O.ref=Aa(S,v,A),O.return=S,O):(O=bc(A.type,A.key,A.props,null,S.mode,O),O.ref=Aa(S,v,A),O.return=S,O)}function c(S,v,A,O){return v===null||v.tag!==4||v.stateNode.containerInfo!==A.containerInfo||v.stateNode.implementation!==A.implementation?(v=Kf(A,S.mode,O),v.return=S,v):(v=i(v,A.children||[]),v.return=S,v)}function d(S,v,A,O,j){return v===null||v.tag!==7?(v=os(A,S.mode,O,j),v.return=S,v):(v=i(v,A),v.return=S,v)}function f(S,v,A){if(typeof v=="string"&&v!==""||typeof v=="number")return v=Gf(""+v,S.mode,A),v.return=S,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Yu:return A=bc(v.type,v.key,v.props,null,S.mode,A),A.ref=Aa(S,null,v),A.return=S,A;case Zs:return v=Kf(v,S.mode,A),v.return=S,v;case Gr:var O=v._init;return f(S,O(v._payload),A)}if(Ma(v)||wa(v))return v=os(v,S.mode,A,null),v.return=S,v;ac(S,v)}return null}function m(S,v,A,O){var j=v!==null?v.key:null;if(typeof A=="string"&&A!==""||typeof A=="number")return j!==null?null:a(S,v,""+A,O);if(typeof A=="object"&&A!==null){switch(A.$$typeof){case Yu:return A.key===j?u(S,v,A,O):null;case Zs:return A.key===j?c(S,v,A,O):null;case Gr:return j=A._init,m(S,v,j(A._payload),O)}if(Ma(A)||wa(A))return j!==null?null:d(S,v,A,O,null);ac(S,A)}return null}function y(S,v,A,O,j){if(typeof O=="string"&&O!==""||typeof O=="number")return S=S.get(A)||null,a(v,S,""+O,j);if(typeof O=="object"&&O!==null){switch(O.$$typeof){case Yu:return S=S.get(O.key===null?A:O.key)||null,u(v,S,O,j);case Zs:return S=S.get(O.key===null?A:O.key)||null,c(v,S,O,j);case Gr:var z=O._init;return y(S,v,A,z(O._payload),j)}if(Ma(O)||wa(O))return S=S.get(A)||null,d(v,S,O,j,null);ac(v,O)}return null}function C(S,v,A,O){for(var j=null,z=null,w=v,_=v=0,E=null;w!==null&&_<A.length;_++){w.index>_?(E=w,w=null):E=w.sibling;var T=m(S,w,A[_],O);if(T===null){w===null&&(w=E);break}t&&w&&T.alternate===null&&e(S,w),v=s(T,v,_),z===null?j=T:z.sibling=T,z=T,w=E}if(_===A.length)return n(S,w),be&&Gi(S,_),j;if(w===null){for(;_<A.length;_++)w=f(S,A[_],O),w!==null&&(v=s(w,v,_),z===null?j=w:z.sibling=w,z=w);return be&&Gi(S,_),j}for(w=r(S,w);_<A.length;_++)E=y(w,S,_,A[_],O),E!==null&&(t&&E.alternate!==null&&w.delete(E.key===null?_:E.key),v=s(E,v,_),z===null?j=E:z.sibling=E,z=E);return t&&w.forEach(function(R){return e(S,R)}),be&&Gi(S,_),j}function N(S,v,A,O){var j=wa(A);if(typeof j!="function")throw Error(M(150));if(A=j.call(A),A==null)throw Error(M(151));for(var z=j=null,w=v,_=v=0,E=null,T=A.next();w!==null&&!T.done;_++,T=A.next()){w.index>_?(E=w,w=null):E=w.sibling;var R=m(S,w,T.value,O);if(R===null){w===null&&(w=E);break}t&&w&&R.alternate===null&&e(S,w),v=s(R,v,_),z===null?j=R:z.sibling=R,z=R,w=E}if(T.done)return n(S,w),be&&Gi(S,_),j;if(w===null){for(;!T.done;_++,T=A.next())T=f(S,T.value,O),T!==null&&(v=s(T,v,_),z===null?j=T:z.sibling=T,z=T);return be&&Gi(S,_),j}for(w=r(S,w);!T.done;_++,T=A.next())T=y(w,S,_,T.value,O),T!==null&&(t&&T.alternate!==null&&w.delete(T.key===null?_:T.key),v=s(T,v,_),z===null?j=T:z.sibling=T,z=T);return t&&w.forEach(function(k){return e(S,k)}),be&&Gi(S,_),j}function b(S,v,A,O){if(typeof A=="object"&&A!==null&&A.type===eo&&A.key===null&&(A=A.props.children),typeof A=="object"&&A!==null){switch(A.$$typeof){case Yu:e:{for(var j=A.key,z=v;z!==null;){if(z.key===j){if(j=A.type,j===eo){if(z.tag===7){n(S,z.sibling),v=i(z,A.props.children),v.return=S,S=v;break e}}else if(z.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===Gr&&TE(j)===z.type){n(S,z.sibling),v=i(z,A.props),v.ref=Aa(S,z,A),v.return=S,S=v;break e}n(S,z);break}else e(S,z);z=z.sibling}A.type===eo?(v=os(A.props.children,S.mode,O,A.key),v.return=S,S=v):(O=bc(A.type,A.key,A.props,null,S.mode,O),O.ref=Aa(S,v,A),O.return=S,S=O)}return o(S);case Zs:e:{for(z=A.key;v!==null;){if(v.key===z)if(v.tag===4&&v.stateNode.containerInfo===A.containerInfo&&v.stateNode.implementation===A.implementation){n(S,v.sibling),v=i(v,A.children||[]),v.return=S,S=v;break e}else{n(S,v);break}else e(S,v);v=v.sibling}v=Kf(A,S.mode,O),v.return=S,S=v}return o(S);case Gr:return z=A._init,b(S,v,z(A._payload),O)}if(Ma(A))return C(S,v,A,O);if(wa(A))return N(S,v,A,O);ac(S,A)}return typeof A=="string"&&A!==""||typeof A=="number"?(A=""+A,v!==null&&v.tag===6?(n(S,v.sibling),v=i(v,A),v.return=S,S=v):(n(S,v),v=Gf(A,S.mode,O),v.return=S,S=v),o(S)):n(S,v)}return b}var No=P0(!0),k0=P0(!1),sh=Li(null),oh=null,lo=null,kg=null;function Ng(){kg=lo=oh=null}function Dg(t){var e=sh.current;Ne(sh),t._currentValue=e}function Zp(t,e,n){for(;t!==null;){var r=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),t===n)break;t=t.return}}function go(t,e){oh=t,kg=lo=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(zt=!0),t.firstContext=null)}function vn(t){var e=t._currentValue;if(kg!==t)if(t={context:t,memoizedValue:e,next:null},lo===null){if(oh===null)throw Error(M(308));lo=t,oh.dependencies={lanes:0,firstContext:t}}else lo=lo.next=t;return e}var Zi=null;function Og(t){Zi===null?Zi=[t]:Zi.push(t)}function N0(t,e,n,r){var i=e.interleaved;return i===null?(n.next=n,Og(e)):(n.next=i.next,i.next=n),e.interleaved=n,Rr(t,r)}function Rr(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Kr=!1;function bg(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function D0(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Ir(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function ci(t,e,n){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,de&2){var i=r.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),r.pending=e,Rr(t,n)}return i=r.interleaved,i===null?(e.next=e,Og(r)):(e.next=i.next,i.next=e),r.interleaved=e,Rr(t,n)}function Rc(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,yg(t,n)}}function SE(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?i=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?i=s=e:s=s.next=e}else i=s=e;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function ah(t,e,n,r){var i=t.updateQueue;Kr=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,a=i.shared.pending;if(a!==null){i.shared.pending=null;var u=a,c=u.next;u.next=null,o===null?s=c:o.next=c,o=u;var d=t.alternate;d!==null&&(d=d.updateQueue,a=d.lastBaseUpdate,a!==o&&(a===null?d.firstBaseUpdate=c:a.next=c,d.lastBaseUpdate=u))}if(s!==null){var f=i.baseState;o=0,d=c=u=null,a=s;do{var m=a.lane,y=a.eventTime;if((r&m)===m){d!==null&&(d=d.next={eventTime:y,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var C=t,N=a;switch(m=e,y=n,N.tag){case 1:if(C=N.payload,typeof C=="function"){f=C.call(y,f,m);break e}f=C;break e;case 3:C.flags=C.flags&-65537|128;case 0:if(C=N.payload,m=typeof C=="function"?C.call(y,f,m):C,m==null)break e;f=Be({},f,m);break e;case 2:Kr=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,m=i.effects,m===null?i.effects=[a]:m.push(a))}else y={eventTime:y,lane:m,tag:a.tag,payload:a.payload,callback:a.callback,next:null},d===null?(c=d=y,u=f):d=d.next=y,o|=m;if(a=a.next,a===null){if(a=i.shared.pending,a===null)break;m=a,a=m.next,m.next=null,i.lastBaseUpdate=m,i.shared.pending=null}}while(1);if(d===null&&(u=f),i.baseState=u,i.firstBaseUpdate=c,i.lastBaseUpdate=d,e=i.shared.interleaved,e!==null){i=e;do o|=i.lane,i=i.next;while(i!==e)}else s===null&&(i.shared.lanes=0);fs|=o,t.lanes=o,t.memoizedState=f}}function CE(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(M(191,i));i.call(r)}}}var su={},tr=Li(su),Rl=Li(su),Pl=Li(su);function es(t){if(t===su)throw Error(M(174));return t}function xg(t,e){switch(Te(Pl,e),Te(Rl,t),Te(tr,su),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:bp(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=bp(e,t)}Ne(tr),Te(tr,e)}function Do(){Ne(tr),Ne(Rl),Ne(Pl)}function O0(t){es(Pl.current);var e=es(tr.current),n=bp(e,t.type);e!==n&&(Te(Rl,t),Te(tr,n))}function Lg(t){Rl.current===t&&(Ne(tr),Ne(Rl))}var Ve=Li(0);function lh(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var zf=[];function Mg(){for(var t=0;t<zf.length;t++)zf[t]._workInProgressVersionPrimary=null;zf.length=0}var Pc=Fr.ReactCurrentDispatcher,jf=Fr.ReactCurrentBatchConfig,ds=0,Ue=null,Je=null,at=null,uh=!1,Za=!1,kl=0,kN=0;function It(){throw Error(M(321))}function Vg(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Bn(t[n],e[n]))return!1;return!0}function Fg(t,e,n,r,i,s){if(ds=s,Ue=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Pc.current=t===null||t.memoizedState===null?bN:xN,t=n(r,i),Za){s=0;do{if(Za=!1,kl=0,25<=s)throw Error(M(301));s+=1,at=Je=null,e.updateQueue=null,Pc.current=LN,t=n(r,i)}while(Za)}if(Pc.current=ch,e=Je!==null&&Je.next!==null,ds=0,at=Je=Ue=null,uh=!1,e)throw Error(M(300));return t}function Ug(){var t=kl!==0;return kl=0,t}function Kn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return at===null?Ue.memoizedState=at=t:at=at.next=t,at}function En(){if(Je===null){var t=Ue.alternate;t=t!==null?t.memoizedState:null}else t=Je.next;var e=at===null?Ue.memoizedState:at.next;if(e!==null)at=e,Je=t;else{if(t===null)throw Error(M(310));Je=t,t={memoizedState:Je.memoizedState,baseState:Je.baseState,baseQueue:Je.baseQueue,queue:Je.queue,next:null},at===null?Ue.memoizedState=at=t:at=at.next=t}return at}function Nl(t,e){return typeof e=="function"?e(t):e}function Wf(t){var e=En(),n=e.queue;if(n===null)throw Error(M(311));n.lastRenderedReducer=t;var r=Je,i=r.baseQueue,s=n.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,n.pending=null}if(i!==null){s=i.next,r=r.baseState;var a=o=null,u=null,c=s;do{var d=c.lane;if((ds&d)===d)u!==null&&(u=u.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),r=c.hasEagerState?c.eagerState:t(r,c.action);else{var f={lane:d,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};u===null?(a=u=f,o=r):u=u.next=f,Ue.lanes|=d,fs|=d}c=c.next}while(c!==null&&c!==s);u===null?o=r:u.next=a,Bn(r,e.memoizedState)||(zt=!0),e.memoizedState=r,e.baseState=o,e.baseQueue=u,n.lastRenderedState=r}if(t=n.interleaved,t!==null){i=t;do s=i.lane,Ue.lanes|=s,fs|=s,i=i.next;while(i!==t)}else i===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function $f(t){var e=En(),n=e.queue;if(n===null)throw Error(M(311));n.lastRenderedReducer=t;var r=n.dispatch,i=n.pending,s=e.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do s=t(s,o.action),o=o.next;while(o!==i);Bn(s,e.memoizedState)||(zt=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,r]}function b0(){}function x0(t,e){var n=Ue,r=En(),i=e(),s=!Bn(r.memoizedState,i);if(s&&(r.memoizedState=i,zt=!0),r=r.queue,Bg(V0.bind(null,n,r,t),[t]),r.getSnapshot!==e||s||at!==null&&at.memoizedState.tag&1){if(n.flags|=2048,Dl(9,M0.bind(null,n,r,i,e),void 0,null),ut===null)throw Error(M(349));ds&30||L0(n,e,i)}return i}function L0(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=Ue.updateQueue,e===null?(e={lastEffect:null,stores:null},Ue.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function M0(t,e,n,r){e.value=n,e.getSnapshot=r,F0(e)&&U0(t)}function V0(t,e,n){return n(function(){F0(e)&&U0(t)})}function F0(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Bn(t,n)}catch{return!0}}function U0(t){var e=Rr(t,1);e!==null&&Vn(e,t,1,-1)}function AE(t){var e=Kn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Nl,lastRenderedState:t},e.queue=t,t=t.dispatch=ON.bind(null,Ue,t),[e.memoizedState,t]}function Dl(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=Ue.updateQueue,e===null?(e={lastEffect:null,stores:null},Ue.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function B0(){return En().memoizedState}function kc(t,e,n,r){var i=Kn();Ue.flags|=t,i.memoizedState=Dl(1|e,n,void 0,r===void 0?null:r)}function id(t,e,n,r){var i=En();r=r===void 0?null:r;var s=void 0;if(Je!==null){var o=Je.memoizedState;if(s=o.destroy,r!==null&&Vg(r,o.deps)){i.memoizedState=Dl(e,n,s,r);return}}Ue.flags|=t,i.memoizedState=Dl(1|e,n,s,r)}function RE(t,e){return kc(8390656,8,t,e)}function Bg(t,e){return id(2048,8,t,e)}function z0(t,e){return id(4,2,t,e)}function j0(t,e){return id(4,4,t,e)}function W0(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function $0(t,e,n){return n=n!=null?n.concat([t]):null,id(4,4,W0.bind(null,e,t),n)}function zg(){}function H0(t,e){var n=En();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Vg(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function q0(t,e){var n=En();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Vg(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function G0(t,e,n){return ds&21?(Bn(n,e)||(n=JT(),Ue.lanes|=n,fs|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,zt=!0),t.memoizedState=n)}function NN(t,e){var n=ye;ye=n!==0&&4>n?n:4,t(!0);var r=jf.transition;jf.transition={};try{t(!1),e()}finally{ye=n,jf.transition=r}}function K0(){return En().memoizedState}function DN(t,e,n){var r=di(t);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Q0(t))Y0(e,n);else if(n=N0(t,e,n,r),n!==null){var i=xt();Vn(n,t,r,i),X0(n,e,r)}}function ON(t,e,n){var r=di(t),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Q0(t))Y0(e,i);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,n);if(i.hasEagerState=!0,i.eagerState=a,Bn(a,o)){var u=e.interleaved;u===null?(i.next=i,Og(e)):(i.next=u.next,u.next=i),e.interleaved=i;return}}catch{}finally{}n=N0(t,e,i,r),n!==null&&(i=xt(),Vn(n,t,r,i),X0(n,e,r))}}function Q0(t){var e=t.alternate;return t===Ue||e!==null&&e===Ue}function Y0(t,e){Za=uh=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function X0(t,e,n){if(n&4194240){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,yg(t,n)}}var ch={readContext:vn,useCallback:It,useContext:It,useEffect:It,useImperativeHandle:It,useInsertionEffect:It,useLayoutEffect:It,useMemo:It,useReducer:It,useRef:It,useState:It,useDebugValue:It,useDeferredValue:It,useTransition:It,useMutableSource:It,useSyncExternalStore:It,useId:It,unstable_isNewReconciler:!1},bN={readContext:vn,useCallback:function(t,e){return Kn().memoizedState=[t,e===void 0?null:e],t},useContext:vn,useEffect:RE,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,kc(4194308,4,W0.bind(null,e,t),n)},useLayoutEffect:function(t,e){return kc(4194308,4,t,e)},useInsertionEffect:function(t,e){return kc(4,2,t,e)},useMemo:function(t,e){var n=Kn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=Kn();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},r.queue=t,t=t.dispatch=DN.bind(null,Ue,t),[r.memoizedState,t]},useRef:function(t){var e=Kn();return t={current:t},e.memoizedState=t},useState:AE,useDebugValue:zg,useDeferredValue:function(t){return Kn().memoizedState=t},useTransition:function(){var t=AE(!1),e=t[0];return t=NN.bind(null,t[1]),Kn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var r=Ue,i=Kn();if(be){if(n===void 0)throw Error(M(407));n=n()}else{if(n=e(),ut===null)throw Error(M(349));ds&30||L0(r,e,n)}i.memoizedState=n;var s={value:n,getSnapshot:e};return i.queue=s,RE(V0.bind(null,r,s,t),[t]),r.flags|=2048,Dl(9,M0.bind(null,r,s,n,e),void 0,null),n},useId:function(){var t=Kn(),e=ut.identifierPrefix;if(be){var n=yr,r=_r;n=(r&~(1<<32-Mn(r)-1)).toString(32)+n,e=":"+e+"R"+n,n=kl++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=kN++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},xN={readContext:vn,useCallback:H0,useContext:vn,useEffect:Bg,useImperativeHandle:$0,useInsertionEffect:z0,useLayoutEffect:j0,useMemo:q0,useReducer:Wf,useRef:B0,useState:function(){return Wf(Nl)},useDebugValue:zg,useDeferredValue:function(t){var e=En();return G0(e,Je.memoizedState,t)},useTransition:function(){var t=Wf(Nl)[0],e=En().memoizedState;return[t,e]},useMutableSource:b0,useSyncExternalStore:x0,useId:K0,unstable_isNewReconciler:!1},LN={readContext:vn,useCallback:H0,useContext:vn,useEffect:Bg,useImperativeHandle:$0,useInsertionEffect:z0,useLayoutEffect:j0,useMemo:q0,useReducer:$f,useRef:B0,useState:function(){return $f(Nl)},useDebugValue:zg,useDeferredValue:function(t){var e=En();return Je===null?e.memoizedState=t:G0(e,Je.memoizedState,t)},useTransition:function(){var t=$f(Nl)[0],e=En().memoizedState;return[t,e]},useMutableSource:b0,useSyncExternalStore:x0,useId:K0,unstable_isNewReconciler:!1};function Nn(t,e){if(t&&t.defaultProps){e=Be({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function em(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:Be({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var sd={isMounted:function(t){return(t=t._reactInternals)?Cs(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=xt(),i=di(t),s=Ir(r,i);s.payload=e,n!=null&&(s.callback=n),e=ci(t,s,i),e!==null&&(Vn(e,t,i,r),Rc(e,t,i))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=xt(),i=di(t),s=Ir(r,i);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=ci(t,s,i),e!==null&&(Vn(e,t,i,r),Rc(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=xt(),r=di(t),i=Ir(n,r);i.tag=2,e!=null&&(i.callback=e),e=ci(t,i,r),e!==null&&(Vn(e,t,r,n),Rc(e,t,r))}};function PE(t,e,n,r,i,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,s,o):e.prototype&&e.prototype.isPureReactComponent?!Tl(n,r)||!Tl(i,s):!0}function J0(t,e,n){var r=!1,i=Ii,s=e.contextType;return typeof s=="object"&&s!==null?s=vn(s):(i=Wt(e)?cs:kt.current,r=e.contextTypes,s=(r=r!=null)?Po(t,i):Ii),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=sd,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=s),e}function kE(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&sd.enqueueReplaceState(e,e.state,null)}function tm(t,e,n,r){var i=t.stateNode;i.props=n,i.state=t.memoizedState,i.refs={},bg(t);var s=e.contextType;typeof s=="object"&&s!==null?i.context=vn(s):(s=Wt(e)?cs:kt.current,i.context=Po(t,s)),i.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(em(t,e,s,n),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&sd.enqueueReplaceState(i,i.state,null),ah(t,n,i,r),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function Oo(t,e){try{var n="",r=e;do n+=uk(r),r=r.return;while(r);var i=n}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:i,digest:null}}function Hf(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function nm(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var MN=typeof WeakMap=="function"?WeakMap:Map;function Z0(t,e,n){n=Ir(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){dh||(dh=!0,dm=r),nm(t,e)},n}function eS(t,e,n){n=Ir(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var i=e.value;n.payload=function(){return r(i)},n.callback=function(){nm(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){nm(t,e),typeof r!="function"&&(hi===null?hi=new Set([this]):hi.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function NE(t,e,n){var r=t.pingCache;if(r===null){r=t.pingCache=new MN;var i=new Set;r.set(e,i)}else i=r.get(e),i===void 0&&(i=new Set,r.set(e,i));i.has(n)||(i.add(n),t=YN.bind(null,t,e,n),e.then(t,t))}function DE(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function OE(t,e,n,r,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Ir(-1,1),e.tag=2,ci(n,e,1))),n.lanes|=1),t)}var VN=Fr.ReactCurrentOwner,zt=!1;function Ot(t,e,n,r){e.child=t===null?k0(e,null,n,r):No(e,t.child,n,r)}function bE(t,e,n,r,i){n=n.render;var s=e.ref;return go(e,i),r=Fg(t,e,n,r,s,i),n=Ug(),t!==null&&!zt?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Pr(t,e,i)):(be&&n&&Ag(e),e.flags|=1,Ot(t,e,r,i),e.child)}function xE(t,e,n,r,i){if(t===null){var s=n.type;return typeof s=="function"&&!Qg(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,tS(t,e,s,r,i)):(t=bc(n.type,null,r,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&i)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:Tl,n(o,r)&&t.ref===e.ref)return Pr(t,e,i)}return e.flags|=1,t=fi(s,r),t.ref=e.ref,t.return=e,e.child=t}function tS(t,e,n,r,i){if(t!==null){var s=t.memoizedProps;if(Tl(s,r)&&t.ref===e.ref)if(zt=!1,e.pendingProps=r=s,(t.lanes&i)!==0)t.flags&131072&&(zt=!0);else return e.lanes=t.lanes,Pr(t,e,i)}return rm(t,e,n,r,i)}function nS(t,e,n){var r=e.pendingProps,i=r.children,s=t!==null?t.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},Te(co,Yt),Yt|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,Te(co,Yt),Yt|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,Te(co,Yt),Yt|=r}else s!==null?(r=s.baseLanes|n,e.memoizedState=null):r=n,Te(co,Yt),Yt|=r;return Ot(t,e,i,n),e.child}function rS(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function rm(t,e,n,r,i){var s=Wt(n)?cs:kt.current;return s=Po(e,s),go(e,i),n=Fg(t,e,n,r,s,i),r=Ug(),t!==null&&!zt?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Pr(t,e,i)):(be&&r&&Ag(e),e.flags|=1,Ot(t,e,n,i),e.child)}function LE(t,e,n,r,i){if(Wt(n)){var s=!0;nh(e)}else s=!1;if(go(e,i),e.stateNode===null)Nc(t,e),J0(e,n,r),tm(e,n,r,i),r=!0;else if(t===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var u=o.context,c=n.contextType;typeof c=="object"&&c!==null?c=vn(c):(c=Wt(n)?cs:kt.current,c=Po(e,c));var d=n.getDerivedStateFromProps,f=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";f||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==r||u!==c)&&kE(e,o,r,c),Kr=!1;var m=e.memoizedState;o.state=m,ah(e,r,o,i),u=e.memoizedState,a!==r||m!==u||jt.current||Kr?(typeof d=="function"&&(em(e,n,d,r),u=e.memoizedState),(a=Kr||PE(e,n,a,r,m,u,c))?(f||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=u),o.props=r,o.state=u,o.context=c,r=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{o=e.stateNode,D0(t,e),a=e.memoizedProps,c=e.type===e.elementType?a:Nn(e.type,a),o.props=c,f=e.pendingProps,m=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=vn(u):(u=Wt(n)?cs:kt.current,u=Po(e,u));var y=n.getDerivedStateFromProps;(d=typeof y=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==f||m!==u)&&kE(e,o,r,u),Kr=!1,m=e.memoizedState,o.state=m,ah(e,r,o,i);var C=e.memoizedState;a!==f||m!==C||jt.current||Kr?(typeof y=="function"&&(em(e,n,y,r),C=e.memoizedState),(c=Kr||PE(e,n,c,r,m,C,u)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,C,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,C,u)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&m===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&m===t.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=C),o.props=r,o.state=C,o.context=u,r=c):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&m===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&m===t.memoizedState||(e.flags|=1024),r=!1)}return im(t,e,n,r,s,i)}function im(t,e,n,r,i,s){rS(t,e);var o=(e.flags&128)!==0;if(!r&&!o)return i&&EE(e,n,!1),Pr(t,e,s);r=e.stateNode,VN.current=e;var a=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&o?(e.child=No(e,t.child,null,s),e.child=No(e,null,a,s)):Ot(t,e,a,s),e.memoizedState=r.state,i&&EE(e,n,!0),e.child}function iS(t){var e=t.stateNode;e.pendingContext?vE(t,e.pendingContext,e.pendingContext!==e.context):e.context&&vE(t,e.context,!1),xg(t,e.containerInfo)}function ME(t,e,n,r,i){return ko(),Pg(i),e.flags|=256,Ot(t,e,n,r),e.child}var sm={dehydrated:null,treeContext:null,retryLane:0};function om(t){return{baseLanes:t,cachePool:null,transitions:null}}function sS(t,e,n){var r=e.pendingProps,i=Ve.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=t!==null&&t.memoizedState===null?!1:(i&2)!==0),a?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),Te(Ve,i&1),t===null)return Jp(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=r.children,t=r.fallback,s?(r=e.mode,s=e.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=ld(o,r,0,null),t=os(t,r,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=om(n),e.memoizedState=sm,t):jg(e,o));if(i=t.memoizedState,i!==null&&(a=i.dehydrated,a!==null))return FN(t,e,o,r,a,i,n);if(s){s=r.fallback,o=e.mode,i=t.child,a=i.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&e.child!==i?(r=e.child,r.childLanes=0,r.pendingProps=u,e.deletions=null):(r=fi(i,u),r.subtreeFlags=i.subtreeFlags&14680064),a!==null?s=fi(a,s):(s=os(s,o,n,null),s.flags|=2),s.return=e,r.return=e,r.sibling=s,e.child=r,r=s,s=e.child,o=t.child.memoizedState,o=o===null?om(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=sm,r}return s=t.child,t=s.sibling,r=fi(s,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=n),r.return=e,r.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=r,e.memoizedState=null,r}function jg(t,e){return e=ld({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function lc(t,e,n,r){return r!==null&&Pg(r),No(e,t.child,null,n),t=jg(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function FN(t,e,n,r,i,s,o){if(n)return e.flags&256?(e.flags&=-257,r=Hf(Error(M(422))),lc(t,e,o,r)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=r.fallback,i=e.mode,r=ld({mode:"visible",children:r.children},i,0,null),s=os(s,i,o,null),s.flags|=2,r.return=e,s.return=e,r.sibling=s,e.child=r,e.mode&1&&No(e,t.child,null,o),e.child.memoizedState=om(o),e.memoizedState=sm,s);if(!(e.mode&1))return lc(t,e,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var a=r.dgst;return r=a,s=Error(M(419)),r=Hf(s,r,void 0),lc(t,e,o,r)}if(a=(o&t.childLanes)!==0,zt||a){if(r=ut,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,Rr(t,i),Vn(r,t,i,-1))}return Kg(),r=Hf(Error(M(421))),lc(t,e,o,r)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=XN.bind(null,t),i._reactRetry=e,null):(t=s.treeContext,Zt=ui(i.nextSibling),en=e,be=!0,On=null,t!==null&&(cn[hn++]=_r,cn[hn++]=yr,cn[hn++]=hs,_r=t.id,yr=t.overflow,hs=e),e=jg(e,r.children),e.flags|=4096,e)}function VE(t,e,n){t.lanes|=e;var r=t.alternate;r!==null&&(r.lanes|=e),Zp(t.return,e,n)}function qf(t,e,n,r,i){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=i)}function oS(t,e,n){var r=e.pendingProps,i=r.revealOrder,s=r.tail;if(Ot(t,e,r.children,n),r=Ve.current,r&2)r=r&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&VE(t,n,e);else if(t.tag===19)VE(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if(Te(Ve,r),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(n=e.child,i=null;n!==null;)t=n.alternate,t!==null&&lh(t)===null&&(i=n),n=n.sibling;n=i,n===null?(i=e.child,e.child=null):(i=n.sibling,n.sibling=null),qf(e,!1,i,n,s);break;case"backwards":for(n=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&lh(t)===null){e.child=i;break}t=i.sibling,i.sibling=n,n=i,i=t}qf(e,!0,n,null,s);break;case"together":qf(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Nc(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Pr(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),fs|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(M(153));if(e.child!==null){for(t=e.child,n=fi(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=fi(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function UN(t,e,n){switch(e.tag){case 3:iS(e),ko();break;case 5:O0(e);break;case 1:Wt(e.type)&&nh(e);break;case 4:xg(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,i=e.memoizedProps.value;Te(sh,r._currentValue),r._currentValue=i;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?(Te(Ve,Ve.current&1),e.flags|=128,null):n&e.child.childLanes?sS(t,e,n):(Te(Ve,Ve.current&1),t=Pr(t,e,n),t!==null?t.sibling:null);Te(Ve,Ve.current&1);break;case 19:if(r=(n&e.childLanes)!==0,t.flags&128){if(r)return oS(t,e,n);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),Te(Ve,Ve.current),r)break;return null;case 22:case 23:return e.lanes=0,nS(t,e,n)}return Pr(t,e,n)}var aS,am,lS,uS;aS=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};am=function(){};lS=function(t,e,n,r){var i=t.memoizedProps;if(i!==r){t=e.stateNode,es(tr.current);var s=null;switch(n){case"input":i=kp(t,i),r=kp(t,r),s=[];break;case"select":i=Be({},i,{value:void 0}),r=Be({},r,{value:void 0}),s=[];break;case"textarea":i=Op(t,i),r=Op(t,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=eh)}xp(n,r);var o;n=null;for(c in i)if(!r.hasOwnProperty(c)&&i.hasOwnProperty(c)&&i[c]!=null)if(c==="style"){var a=i[c];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(gl.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in r){var u=r[c];if(a=i!=null?i[c]:void 0,r.hasOwnProperty(c)&&u!==a&&(u!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&a[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(s||(s=[]),s.push(c,n)),n=u;else c==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,a=a?a.__html:void 0,u!=null&&a!==u&&(s=s||[]).push(c,u)):c==="children"?typeof u!="string"&&typeof u!="number"||(s=s||[]).push(c,""+u):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(gl.hasOwnProperty(c)?(u!=null&&c==="onScroll"&&Re("scroll",t),s||a===u||(s=[])):(s=s||[]).push(c,u))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};uS=function(t,e,n,r){n!==r&&(e.flags|=4)};function Ra(t,e){if(!be)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function Tt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,r=0;if(e)for(var i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=r,t.childLanes=n,e}function BN(t,e,n){var r=e.pendingProps;switch(Rg(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Tt(e),null;case 1:return Wt(e.type)&&th(),Tt(e),null;case 3:return r=e.stateNode,Do(),Ne(jt),Ne(kt),Mg(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&(oc(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,On!==null&&(mm(On),On=null))),am(t,e),Tt(e),null;case 5:Lg(e);var i=es(Pl.current);if(n=e.type,t!==null&&e.stateNode!=null)lS(t,e,n,r,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error(M(166));return Tt(e),null}if(t=es(tr.current),oc(e)){r=e.stateNode,n=e.type;var s=e.memoizedProps;switch(r[Yn]=e,r[Al]=s,t=(e.mode&1)!==0,n){case"dialog":Re("cancel",r),Re("close",r);break;case"iframe":case"object":case"embed":Re("load",r);break;case"video":case"audio":for(i=0;i<Fa.length;i++)Re(Fa[i],r);break;case"source":Re("error",r);break;case"img":case"image":case"link":Re("error",r),Re("load",r);break;case"details":Re("toggle",r);break;case"input":qv(r,s),Re("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},Re("invalid",r);break;case"textarea":Kv(r,s),Re("invalid",r)}xp(n,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?r.textContent!==a&&(s.suppressHydrationWarning!==!0&&sc(r.textContent,a,t),i=["children",a]):typeof a=="number"&&r.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&sc(r.textContent,a,t),i=["children",""+a]):gl.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&Re("scroll",r)}switch(n){case"input":Xu(r),Gv(r,s,!0);break;case"textarea":Xu(r),Qv(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=eh)}r=i,e.updateQueue=r,r!==null&&(e.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=VT(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=o.createElement(n,{is:r.is}):(t=o.createElement(n),n==="select"&&(o=t,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):t=o.createElementNS(t,n),t[Yn]=e,t[Al]=r,aS(t,e,!1,!1),e.stateNode=t;e:{switch(o=Lp(n,r),n){case"dialog":Re("cancel",t),Re("close",t),i=r;break;case"iframe":case"object":case"embed":Re("load",t),i=r;break;case"video":case"audio":for(i=0;i<Fa.length;i++)Re(Fa[i],t);i=r;break;case"source":Re("error",t),i=r;break;case"img":case"image":case"link":Re("error",t),Re("load",t),i=r;break;case"details":Re("toggle",t),i=r;break;case"input":qv(t,r),i=kp(t,r),Re("invalid",t);break;case"option":i=r;break;case"select":t._wrapperState={wasMultiple:!!r.multiple},i=Be({},r,{value:void 0}),Re("invalid",t);break;case"textarea":Kv(t,r),i=Op(t,r),Re("invalid",t);break;default:i=r}xp(n,i),a=i;for(s in a)if(a.hasOwnProperty(s)){var u=a[s];s==="style"?BT(t,u):s==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&FT(t,u)):s==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&_l(t,u):typeof u=="number"&&_l(t,""+u):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(gl.hasOwnProperty(s)?u!=null&&s==="onScroll"&&Re("scroll",t):u!=null&&dg(t,s,u,o))}switch(n){case"input":Xu(t),Gv(t,r,!1);break;case"textarea":Xu(t),Qv(t);break;case"option":r.value!=null&&t.setAttribute("value",""+wi(r.value));break;case"select":t.multiple=!!r.multiple,s=r.value,s!=null?ho(t,!!r.multiple,s,!1):r.defaultValue!=null&&ho(t,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=eh)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Tt(e),null;case 6:if(t&&e.stateNode!=null)uS(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(M(166));if(n=es(Pl.current),es(tr.current),oc(e)){if(r=e.stateNode,n=e.memoizedProps,r[Yn]=e,(s=r.nodeValue!==n)&&(t=en,t!==null))switch(t.tag){case 3:sc(r.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&sc(r.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Yn]=e,e.stateNode=r}return Tt(e),null;case 13:if(Ne(Ve),r=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(be&&Zt!==null&&e.mode&1&&!(e.flags&128))R0(),ko(),e.flags|=98560,s=!1;else if(s=oc(e),r!==null&&r.dehydrated!==null){if(t===null){if(!s)throw Error(M(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(M(317));s[Yn]=e}else ko(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Tt(e),s=!1}else On!==null&&(mm(On),On=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(r=r!==null,r!==(t!==null&&t.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(t===null||Ve.current&1?tt===0&&(tt=3):Kg())),e.updateQueue!==null&&(e.flags|=4),Tt(e),null);case 4:return Do(),am(t,e),t===null&&Sl(e.stateNode.containerInfo),Tt(e),null;case 10:return Dg(e.type._context),Tt(e),null;case 17:return Wt(e.type)&&th(),Tt(e),null;case 19:if(Ne(Ve),s=e.memoizedState,s===null)return Tt(e),null;if(r=(e.flags&128)!==0,o=s.rendering,o===null)if(r)Ra(s,!1);else{if(tt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=lh(t),o!==null){for(e.flags|=128,Ra(s,!1),r=o.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=n,n=e.child;n!==null;)s=n,t=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return Te(Ve,Ve.current&1|2),e.child}t=t.sibling}s.tail!==null&&qe()>bo&&(e.flags|=128,r=!0,Ra(s,!1),e.lanes=4194304)}else{if(!r)if(t=lh(o),t!==null){if(e.flags|=128,r=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Ra(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!be)return Tt(e),null}else 2*qe()-s.renderingStartTime>bo&&n!==1073741824&&(e.flags|=128,r=!0,Ra(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=qe(),e.sibling=null,n=Ve.current,Te(Ve,r?n&1|2:n&1),e):(Tt(e),null);case 22:case 23:return Gg(),r=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?Yt&1073741824&&(Tt(e),e.subtreeFlags&6&&(e.flags|=8192)):Tt(e),null;case 24:return null;case 25:return null}throw Error(M(156,e.tag))}function zN(t,e){switch(Rg(e),e.tag){case 1:return Wt(e.type)&&th(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Do(),Ne(jt),Ne(kt),Mg(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Lg(e),null;case 13:if(Ne(Ve),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(M(340));ko()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return Ne(Ve),null;case 4:return Do(),null;case 10:return Dg(e.type._context),null;case 22:case 23:return Gg(),null;case 24:return null;default:return null}}var uc=!1,At=!1,jN=typeof WeakSet=="function"?WeakSet:Set,H=null;function uo(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){We(t,e,r)}else n.current=null}function lm(t,e,n){try{n()}catch(r){We(t,e,r)}}var FE=!1;function WN(t,e){if(Hp=Xc,t=p0(),Cg(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,a=-1,u=-1,c=0,d=0,f=t,m=null;t:for(;;){for(var y;f!==n||i!==0&&f.nodeType!==3||(a=o+i),f!==s||r!==0&&f.nodeType!==3||(u=o+r),f.nodeType===3&&(o+=f.nodeValue.length),(y=f.firstChild)!==null;)m=f,f=y;for(;;){if(f===t)break t;if(m===n&&++c===i&&(a=o),m===s&&++d===r&&(u=o),(y=f.nextSibling)!==null)break;f=m,m=f.parentNode}f=y}n=a===-1||u===-1?null:{start:a,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(qp={focusedElem:t,selectionRange:n},Xc=!1,H=e;H!==null;)if(e=H,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,H=t;else for(;H!==null;){e=H;try{var C=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(C!==null){var N=C.memoizedProps,b=C.memoizedState,S=e.stateNode,v=S.getSnapshotBeforeUpdate(e.elementType===e.type?N:Nn(e.type,N),b);S.__reactInternalSnapshotBeforeUpdate=v}break;case 3:var A=e.stateNode.containerInfo;A.nodeType===1?A.textContent="":A.nodeType===9&&A.documentElement&&A.removeChild(A.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(M(163))}}catch(O){We(e,e.return,O)}if(t=e.sibling,t!==null){t.return=e.return,H=t;break}H=e.return}return C=FE,FE=!1,C}function el(t,e,n){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&t)===t){var s=i.destroy;i.destroy=void 0,s!==void 0&&lm(e,n,s)}i=i.next}while(i!==r)}}function od(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var r=n.create;n.destroy=r()}n=n.next}while(n!==e)}}function um(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function cS(t){var e=t.alternate;e!==null&&(t.alternate=null,cS(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Yn],delete e[Al],delete e[Qp],delete e[CN],delete e[AN])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function hS(t){return t.tag===5||t.tag===3||t.tag===4}function UE(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||hS(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function cm(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=eh));else if(r!==4&&(t=t.child,t!==null))for(cm(t,e,n),t=t.sibling;t!==null;)cm(t,e,n),t=t.sibling}function hm(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(hm(t,e,n),t=t.sibling;t!==null;)hm(t,e,n),t=t.sibling}var ft=null,Dn=!1;function Hr(t,e,n){for(n=n.child;n!==null;)dS(t,e,n),n=n.sibling}function dS(t,e,n){if(er&&typeof er.onCommitFiberUnmount=="function")try{er.onCommitFiberUnmount(Jh,n)}catch{}switch(n.tag){case 5:At||uo(n,e);case 6:var r=ft,i=Dn;ft=null,Hr(t,e,n),ft=r,Dn=i,ft!==null&&(Dn?(t=ft,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):ft.removeChild(n.stateNode));break;case 18:ft!==null&&(Dn?(t=ft,n=n.stateNode,t.nodeType===8?Uf(t.parentNode,n):t.nodeType===1&&Uf(t,n),wl(t)):Uf(ft,n.stateNode));break;case 4:r=ft,i=Dn,ft=n.stateNode.containerInfo,Dn=!0,Hr(t,e,n),ft=r,Dn=i;break;case 0:case 11:case 14:case 15:if(!At&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&lm(n,e,o),i=i.next}while(i!==r)}Hr(t,e,n);break;case 1:if(!At&&(uo(n,e),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(a){We(n,e,a)}Hr(t,e,n);break;case 21:Hr(t,e,n);break;case 22:n.mode&1?(At=(r=At)||n.memoizedState!==null,Hr(t,e,n),At=r):Hr(t,e,n);break;default:Hr(t,e,n)}}function BE(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new jN),e.forEach(function(r){var i=JN.bind(null,t,r);n.has(r)||(n.add(r),r.then(i,i))})}}function kn(t,e){var n=e.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var s=t,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:ft=a.stateNode,Dn=!1;break e;case 3:ft=a.stateNode.containerInfo,Dn=!0;break e;case 4:ft=a.stateNode.containerInfo,Dn=!0;break e}a=a.return}if(ft===null)throw Error(M(160));dS(s,o,i),ft=null,Dn=!1;var u=i.alternate;u!==null&&(u.return=null),i.return=null}catch(c){We(i,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)fS(e,t),e=e.sibling}function fS(t,e){var n=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(kn(e,t),Gn(t),r&4){try{el(3,t,t.return),od(3,t)}catch(N){We(t,t.return,N)}try{el(5,t,t.return)}catch(N){We(t,t.return,N)}}break;case 1:kn(e,t),Gn(t),r&512&&n!==null&&uo(n,n.return);break;case 5:if(kn(e,t),Gn(t),r&512&&n!==null&&uo(n,n.return),t.flags&32){var i=t.stateNode;try{_l(i,"")}catch(N){We(t,t.return,N)}}if(r&4&&(i=t.stateNode,i!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,a=t.type,u=t.updateQueue;if(t.updateQueue=null,u!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&LT(i,s),Lp(a,o);var c=Lp(a,s);for(o=0;o<u.length;o+=2){var d=u[o],f=u[o+1];d==="style"?BT(i,f):d==="dangerouslySetInnerHTML"?FT(i,f):d==="children"?_l(i,f):dg(i,d,f,c)}switch(a){case"input":Np(i,s);break;case"textarea":MT(i,s);break;case"select":var m=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var y=s.value;y!=null?ho(i,!!s.multiple,y,!1):m!==!!s.multiple&&(s.defaultValue!=null?ho(i,!!s.multiple,s.defaultValue,!0):ho(i,!!s.multiple,s.multiple?[]:"",!1))}i[Al]=s}catch(N){We(t,t.return,N)}}break;case 6:if(kn(e,t),Gn(t),r&4){if(t.stateNode===null)throw Error(M(162));i=t.stateNode,s=t.memoizedProps;try{i.nodeValue=s}catch(N){We(t,t.return,N)}}break;case 3:if(kn(e,t),Gn(t),r&4&&n!==null&&n.memoizedState.isDehydrated)try{wl(e.containerInfo)}catch(N){We(t,t.return,N)}break;case 4:kn(e,t),Gn(t);break;case 13:kn(e,t),Gn(t),i=t.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(Hg=qe())),r&4&&BE(t);break;case 22:if(d=n!==null&&n.memoizedState!==null,t.mode&1?(At=(c=At)||d,kn(e,t),At=c):kn(e,t),Gn(t),r&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!d&&t.mode&1)for(H=t,d=t.child;d!==null;){for(f=H=d;H!==null;){switch(m=H,y=m.child,m.tag){case 0:case 11:case 14:case 15:el(4,m,m.return);break;case 1:uo(m,m.return);var C=m.stateNode;if(typeof C.componentWillUnmount=="function"){r=m,n=m.return;try{e=r,C.props=e.memoizedProps,C.state=e.memoizedState,C.componentWillUnmount()}catch(N){We(r,n,N)}}break;case 5:uo(m,m.return);break;case 22:if(m.memoizedState!==null){jE(f);continue}}y!==null?(y.return=m,H=y):jE(f)}d=d.sibling}e:for(d=null,f=t;;){if(f.tag===5){if(d===null){d=f;try{i=f.stateNode,c?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=f.stateNode,u=f.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,a.style.display=UT("display",o))}catch(N){We(t,t.return,N)}}}else if(f.tag===6){if(d===null)try{f.stateNode.nodeValue=c?"":f.memoizedProps}catch(N){We(t,t.return,N)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===t)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===t)break e;for(;f.sibling===null;){if(f.return===null||f.return===t)break e;d===f&&(d=null),f=f.return}d===f&&(d=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:kn(e,t),Gn(t),r&4&&BE(t);break;case 21:break;default:kn(e,t),Gn(t)}}function Gn(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(hS(n)){var r=n;break e}n=n.return}throw Error(M(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(_l(i,""),r.flags&=-33);var s=UE(t);hm(t,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,a=UE(t);cm(t,a,o);break;default:throw Error(M(161))}}catch(u){We(t,t.return,u)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function $N(t,e,n){H=t,pS(t)}function pS(t,e,n){for(var r=(t.mode&1)!==0;H!==null;){var i=H,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||uc;if(!o){var a=i.alternate,u=a!==null&&a.memoizedState!==null||At;a=uc;var c=At;if(uc=o,(At=u)&&!c)for(H=i;H!==null;)o=H,u=o.child,o.tag===22&&o.memoizedState!==null?WE(i):u!==null?(u.return=o,H=u):WE(i);for(;s!==null;)H=s,pS(s),s=s.sibling;H=i,uc=a,At=c}zE(t)}else i.subtreeFlags&8772&&s!==null?(s.return=i,H=s):zE(t)}}function zE(t){for(;H!==null;){var e=H;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:At||od(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!At)if(n===null)r.componentDidMount();else{var i=e.elementType===e.type?n.memoizedProps:Nn(e.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&CE(e,s,r);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}CE(e,o,n)}break;case 5:var a=e.stateNode;if(n===null&&e.flags&4){n=a;var u=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var d=c.memoizedState;if(d!==null){var f=d.dehydrated;f!==null&&wl(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(M(163))}At||e.flags&512&&um(e)}catch(m){We(e,e.return,m)}}if(e===t){H=null;break}if(n=e.sibling,n!==null){n.return=e.return,H=n;break}H=e.return}}function jE(t){for(;H!==null;){var e=H;if(e===t){H=null;break}var n=e.sibling;if(n!==null){n.return=e.return,H=n;break}H=e.return}}function WE(t){for(;H!==null;){var e=H;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{od(4,e)}catch(u){We(e,n,u)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var i=e.return;try{r.componentDidMount()}catch(u){We(e,i,u)}}var s=e.return;try{um(e)}catch(u){We(e,s,u)}break;case 5:var o=e.return;try{um(e)}catch(u){We(e,o,u)}}}catch(u){We(e,e.return,u)}if(e===t){H=null;break}var a=e.sibling;if(a!==null){a.return=e.return,H=a;break}H=e.return}}var HN=Math.ceil,hh=Fr.ReactCurrentDispatcher,Wg=Fr.ReactCurrentOwner,_n=Fr.ReactCurrentBatchConfig,de=0,ut=null,Qe=null,gt=0,Yt=0,co=Li(0),tt=0,Ol=null,fs=0,ad=0,$g=0,tl=null,Bt=null,Hg=0,bo=1/0,mr=null,dh=!1,dm=null,hi=null,cc=!1,ni=null,fh=0,nl=0,fm=null,Dc=-1,Oc=0;function xt(){return de&6?qe():Dc!==-1?Dc:Dc=qe()}function di(t){return t.mode&1?de&2&&gt!==0?gt&-gt:PN.transition!==null?(Oc===0&&(Oc=JT()),Oc):(t=ye,t!==0||(t=window.event,t=t===void 0?16:s0(t.type)),t):1}function Vn(t,e,n,r){if(50<nl)throw nl=0,fm=null,Error(M(185));nu(t,n,r),(!(de&2)||t!==ut)&&(t===ut&&(!(de&2)&&(ad|=n),tt===4&&Yr(t,gt)),$t(t,r),n===1&&de===0&&!(e.mode&1)&&(bo=qe()+500,rd&&Mi()))}function $t(t,e){var n=t.callbackNode;Pk(t,e);var r=Yc(t,t===ut?gt:0);if(r===0)n!==null&&Jv(n),t.callbackNode=null,t.callbackPriority=0;else if(e=r&-r,t.callbackPriority!==e){if(n!=null&&Jv(n),e===1)t.tag===0?RN($E.bind(null,t)):S0($E.bind(null,t)),TN(function(){!(de&6)&&Mi()}),n=null;else{switch(ZT(r)){case 1:n=_g;break;case 4:n=YT;break;case 16:n=Qc;break;case 536870912:n=XT;break;default:n=Qc}n=IS(n,mS.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function mS(t,e){if(Dc=-1,Oc=0,de&6)throw Error(M(327));var n=t.callbackNode;if(_o()&&t.callbackNode!==n)return null;var r=Yc(t,t===ut?gt:0);if(r===0)return null;if(r&30||r&t.expiredLanes||e)e=ph(t,r);else{e=r;var i=de;de|=2;var s=_S();(ut!==t||gt!==e)&&(mr=null,bo=qe()+500,ss(t,e));do try{KN();break}catch(a){gS(t,a)}while(1);Ng(),hh.current=s,de=i,Qe!==null?e=0:(ut=null,gt=0,e=tt)}if(e!==0){if(e===2&&(i=Bp(t),i!==0&&(r=i,e=pm(t,i))),e===1)throw n=Ol,ss(t,0),Yr(t,r),$t(t,qe()),n;if(e===6)Yr(t,r);else{if(i=t.current.alternate,!(r&30)&&!qN(i)&&(e=ph(t,r),e===2&&(s=Bp(t),s!==0&&(r=s,e=pm(t,s))),e===1))throw n=Ol,ss(t,0),Yr(t,r),$t(t,qe()),n;switch(t.finishedWork=i,t.finishedLanes=r,e){case 0:case 1:throw Error(M(345));case 2:Ki(t,Bt,mr);break;case 3:if(Yr(t,r),(r&130023424)===r&&(e=Hg+500-qe(),10<e)){if(Yc(t,0)!==0)break;if(i=t.suspendedLanes,(i&r)!==r){xt(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=Kp(Ki.bind(null,t,Bt,mr),e);break}Ki(t,Bt,mr);break;case 4:if(Yr(t,r),(r&4194240)===r)break;for(e=t.eventTimes,i=-1;0<r;){var o=31-Mn(r);s=1<<o,o=e[o],o>i&&(i=o),r&=~s}if(r=i,r=qe()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*HN(r/1960))-r,10<r){t.timeoutHandle=Kp(Ki.bind(null,t,Bt,mr),r);break}Ki(t,Bt,mr);break;case 5:Ki(t,Bt,mr);break;default:throw Error(M(329))}}}return $t(t,qe()),t.callbackNode===n?mS.bind(null,t):null}function pm(t,e){var n=tl;return t.current.memoizedState.isDehydrated&&(ss(t,e).flags|=256),t=ph(t,e),t!==2&&(e=Bt,Bt=n,e!==null&&mm(e)),t}function mm(t){Bt===null?Bt=t:Bt.push.apply(Bt,t)}function qN(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],s=i.getSnapshot;i=i.value;try{if(!Bn(s(),i))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Yr(t,e){for(e&=~$g,e&=~ad,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Mn(e),r=1<<n;t[n]=-1,e&=~r}}function $E(t){if(de&6)throw Error(M(327));_o();var e=Yc(t,0);if(!(e&1))return $t(t,qe()),null;var n=ph(t,e);if(t.tag!==0&&n===2){var r=Bp(t);r!==0&&(e=r,n=pm(t,r))}if(n===1)throw n=Ol,ss(t,0),Yr(t,e),$t(t,qe()),n;if(n===6)throw Error(M(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Ki(t,Bt,mr),$t(t,qe()),null}function qg(t,e){var n=de;de|=1;try{return t(e)}finally{de=n,de===0&&(bo=qe()+500,rd&&Mi())}}function ps(t){ni!==null&&ni.tag===0&&!(de&6)&&_o();var e=de;de|=1;var n=_n.transition,r=ye;try{if(_n.transition=null,ye=1,t)return t()}finally{ye=r,_n.transition=n,de=e,!(de&6)&&Mi()}}function Gg(){Yt=co.current,Ne(co)}function ss(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,IN(n)),Qe!==null)for(n=Qe.return;n!==null;){var r=n;switch(Rg(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&th();break;case 3:Do(),Ne(jt),Ne(kt),Mg();break;case 5:Lg(r);break;case 4:Do();break;case 13:Ne(Ve);break;case 19:Ne(Ve);break;case 10:Dg(r.type._context);break;case 22:case 23:Gg()}n=n.return}if(ut=t,Qe=t=fi(t.current,null),gt=Yt=e,tt=0,Ol=null,$g=ad=fs=0,Bt=tl=null,Zi!==null){for(e=0;e<Zi.length;e++)if(n=Zi[e],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,s=n.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}n.pending=r}Zi=null}return t}function gS(t,e){do{var n=Qe;try{if(Ng(),Pc.current=ch,uh){for(var r=Ue.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}uh=!1}if(ds=0,at=Je=Ue=null,Za=!1,kl=0,Wg.current=null,n===null||n.return===null){tt=1,Ol=e,Qe=null;break}e:{var s=t,o=n.return,a=n,u=e;if(e=gt,a.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var c=u,d=a,f=d.tag;if(!(d.mode&1)&&(f===0||f===11||f===15)){var m=d.alternate;m?(d.updateQueue=m.updateQueue,d.memoizedState=m.memoizedState,d.lanes=m.lanes):(d.updateQueue=null,d.memoizedState=null)}var y=DE(o);if(y!==null){y.flags&=-257,OE(y,o,a,s,e),y.mode&1&&NE(s,c,e),e=y,u=c;var C=e.updateQueue;if(C===null){var N=new Set;N.add(u),e.updateQueue=N}else C.add(u);break e}else{if(!(e&1)){NE(s,c,e),Kg();break e}u=Error(M(426))}}else if(be&&a.mode&1){var b=DE(o);if(b!==null){!(b.flags&65536)&&(b.flags|=256),OE(b,o,a,s,e),Pg(Oo(u,a));break e}}s=u=Oo(u,a),tt!==4&&(tt=2),tl===null?tl=[s]:tl.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var S=Z0(s,u,e);SE(s,S);break e;case 1:a=u;var v=s.type,A=s.stateNode;if(!(s.flags&128)&&(typeof v.getDerivedStateFromError=="function"||A!==null&&typeof A.componentDidCatch=="function"&&(hi===null||!hi.has(A)))){s.flags|=65536,e&=-e,s.lanes|=e;var O=eS(s,a,e);SE(s,O);break e}}s=s.return}while(s!==null)}vS(n)}catch(j){e=j,Qe===n&&n!==null&&(Qe=n=n.return);continue}break}while(1)}function _S(){var t=hh.current;return hh.current=ch,t===null?ch:t}function Kg(){(tt===0||tt===3||tt===2)&&(tt=4),ut===null||!(fs&268435455)&&!(ad&268435455)||Yr(ut,gt)}function ph(t,e){var n=de;de|=2;var r=_S();(ut!==t||gt!==e)&&(mr=null,ss(t,e));do try{GN();break}catch(i){gS(t,i)}while(1);if(Ng(),de=n,hh.current=r,Qe!==null)throw Error(M(261));return ut=null,gt=0,tt}function GN(){for(;Qe!==null;)yS(Qe)}function KN(){for(;Qe!==null&&!vk();)yS(Qe)}function yS(t){var e=wS(t.alternate,t,Yt);t.memoizedProps=t.pendingProps,e===null?vS(t):Qe=e,Wg.current=null}function vS(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=zN(n,e),n!==null){n.flags&=32767,Qe=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{tt=6,Qe=null;return}}else if(n=BN(n,e,Yt),n!==null){Qe=n;return}if(e=e.sibling,e!==null){Qe=e;return}Qe=e=t}while(e!==null);tt===0&&(tt=5)}function Ki(t,e,n){var r=ye,i=_n.transition;try{_n.transition=null,ye=1,QN(t,e,n,r)}finally{_n.transition=i,ye=r}return null}function QN(t,e,n,r){do _o();while(ni!==null);if(de&6)throw Error(M(327));n=t.finishedWork;var i=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(M(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(kk(t,s),t===ut&&(Qe=ut=null,gt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||cc||(cc=!0,IS(Qc,function(){return _o(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=_n.transition,_n.transition=null;var o=ye;ye=1;var a=de;de|=4,Wg.current=null,WN(t,n),fS(n,t),mN(qp),Xc=!!Hp,qp=Hp=null,t.current=n,$N(n),Ek(),de=a,ye=o,_n.transition=s}else t.current=n;if(cc&&(cc=!1,ni=t,fh=i),s=t.pendingLanes,s===0&&(hi=null),Tk(n.stateNode),$t(t,qe()),e!==null)for(r=t.onRecoverableError,n=0;n<e.length;n++)i=e[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(dh)throw dh=!1,t=dm,dm=null,t;return fh&1&&t.tag!==0&&_o(),s=t.pendingLanes,s&1?t===fm?nl++:(nl=0,fm=t):nl=0,Mi(),null}function _o(){if(ni!==null){var t=ZT(fh),e=_n.transition,n=ye;try{if(_n.transition=null,ye=16>t?16:t,ni===null)var r=!1;else{if(t=ni,ni=null,fh=0,de&6)throw Error(M(331));var i=de;for(de|=4,H=t.current;H!==null;){var s=H,o=s.child;if(H.flags&16){var a=s.deletions;if(a!==null){for(var u=0;u<a.length;u++){var c=a[u];for(H=c;H!==null;){var d=H;switch(d.tag){case 0:case 11:case 15:el(8,d,s)}var f=d.child;if(f!==null)f.return=d,H=f;else for(;H!==null;){d=H;var m=d.sibling,y=d.return;if(cS(d),d===c){H=null;break}if(m!==null){m.return=y,H=m;break}H=y}}}var C=s.alternate;if(C!==null){var N=C.child;if(N!==null){C.child=null;do{var b=N.sibling;N.sibling=null,N=b}while(N!==null)}}H=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,H=o;else e:for(;H!==null;){if(s=H,s.flags&2048)switch(s.tag){case 0:case 11:case 15:el(9,s,s.return)}var S=s.sibling;if(S!==null){S.return=s.return,H=S;break e}H=s.return}}var v=t.current;for(H=v;H!==null;){o=H;var A=o.child;if(o.subtreeFlags&2064&&A!==null)A.return=o,H=A;else e:for(o=v;H!==null;){if(a=H,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:od(9,a)}}catch(j){We(a,a.return,j)}if(a===o){H=null;break e}var O=a.sibling;if(O!==null){O.return=a.return,H=O;break e}H=a.return}}if(de=i,Mi(),er&&typeof er.onPostCommitFiberRoot=="function")try{er.onPostCommitFiberRoot(Jh,t)}catch{}r=!0}return r}finally{ye=n,_n.transition=e}}return!1}function HE(t,e,n){e=Oo(n,e),e=Z0(t,e,1),t=ci(t,e,1),e=xt(),t!==null&&(nu(t,1,e),$t(t,e))}function We(t,e,n){if(t.tag===3)HE(t,t,n);else for(;e!==null;){if(e.tag===3){HE(e,t,n);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(hi===null||!hi.has(r))){t=Oo(n,t),t=eS(e,t,1),e=ci(e,t,1),t=xt(),e!==null&&(nu(e,1,t),$t(e,t));break}}e=e.return}}function YN(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=xt(),t.pingedLanes|=t.suspendedLanes&n,ut===t&&(gt&n)===n&&(tt===4||tt===3&&(gt&130023424)===gt&&500>qe()-Hg?ss(t,0):$g|=n),$t(t,e)}function ES(t,e){e===0&&(t.mode&1?(e=ec,ec<<=1,!(ec&130023424)&&(ec=4194304)):e=1);var n=xt();t=Rr(t,e),t!==null&&(nu(t,e,n),$t(t,n))}function XN(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),ES(t,n)}function JN(t,e){var n=0;switch(t.tag){case 13:var r=t.stateNode,i=t.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=t.stateNode;break;default:throw Error(M(314))}r!==null&&r.delete(e),ES(t,n)}var wS;wS=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||jt.current)zt=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return zt=!1,UN(t,e,n);zt=!!(t.flags&131072)}else zt=!1,be&&e.flags&1048576&&C0(e,ih,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;Nc(t,e),t=e.pendingProps;var i=Po(e,kt.current);go(e,n),i=Fg(null,e,r,t,i,n);var s=Ug();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Wt(r)?(s=!0,nh(e)):s=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,bg(e),i.updater=sd,e.stateNode=i,i._reactInternals=e,tm(e,r,t,n),e=im(null,e,r,!0,s,n)):(e.tag=0,be&&s&&Ag(e),Ot(null,e,i,n),e=e.child),e;case 16:r=e.elementType;e:{switch(Nc(t,e),t=e.pendingProps,i=r._init,r=i(r._payload),e.type=r,i=e.tag=eD(r),t=Nn(r,t),i){case 0:e=rm(null,e,r,t,n);break e;case 1:e=LE(null,e,r,t,n);break e;case 11:e=bE(null,e,r,t,n);break e;case 14:e=xE(null,e,r,Nn(r.type,t),n);break e}throw Error(M(306,r,""))}return e;case 0:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Nn(r,i),rm(t,e,r,i,n);case 1:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Nn(r,i),LE(t,e,r,i,n);case 3:e:{if(iS(e),t===null)throw Error(M(387));r=e.pendingProps,s=e.memoizedState,i=s.element,D0(t,e),ah(e,r,null,n);var o=e.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){i=Oo(Error(M(423)),e),e=ME(t,e,r,n,i);break e}else if(r!==i){i=Oo(Error(M(424)),e),e=ME(t,e,r,n,i);break e}else for(Zt=ui(e.stateNode.containerInfo.firstChild),en=e,be=!0,On=null,n=k0(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(ko(),r===i){e=Pr(t,e,n);break e}Ot(t,e,r,n)}e=e.child}return e;case 5:return O0(e),t===null&&Jp(e),r=e.type,i=e.pendingProps,s=t!==null?t.memoizedProps:null,o=i.children,Gp(r,i)?o=null:s!==null&&Gp(r,s)&&(e.flags|=32),rS(t,e),Ot(t,e,o,n),e.child;case 6:return t===null&&Jp(e),null;case 13:return sS(t,e,n);case 4:return xg(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=No(e,null,r,n):Ot(t,e,r,n),e.child;case 11:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Nn(r,i),bE(t,e,r,i,n);case 7:return Ot(t,e,e.pendingProps,n),e.child;case 8:return Ot(t,e,e.pendingProps.children,n),e.child;case 12:return Ot(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(r=e.type._context,i=e.pendingProps,s=e.memoizedProps,o=i.value,Te(sh,r._currentValue),r._currentValue=o,s!==null)if(Bn(s.value,o)){if(s.children===i.children&&!jt.current){e=Pr(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var u=a.firstContext;u!==null;){if(u.context===r){if(s.tag===1){u=Ir(-1,n&-n),u.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var d=c.pending;d===null?u.next=u:(u.next=d.next,d.next=u),c.pending=u}}s.lanes|=n,u=s.alternate,u!==null&&(u.lanes|=n),Zp(s.return,n,e),a.lanes|=n;break}u=u.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(M(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),Zp(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}Ot(t,e,i.children,n),e=e.child}return e;case 9:return i=e.type,r=e.pendingProps.children,go(e,n),i=vn(i),r=r(i),e.flags|=1,Ot(t,e,r,n),e.child;case 14:return r=e.type,i=Nn(r,e.pendingProps),i=Nn(r.type,i),xE(t,e,r,i,n);case 15:return tS(t,e,e.type,e.pendingProps,n);case 17:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Nn(r,i),Nc(t,e),e.tag=1,Wt(r)?(t=!0,nh(e)):t=!1,go(e,n),J0(e,r,i),tm(e,r,i,n),im(null,e,r,!0,t,n);case 19:return oS(t,e,n);case 22:return nS(t,e,n)}throw Error(M(156,e.tag))};function IS(t,e){return QT(t,e)}function ZN(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function mn(t,e,n,r){return new ZN(t,e,n,r)}function Qg(t){return t=t.prototype,!(!t||!t.isReactComponent)}function eD(t){if(typeof t=="function")return Qg(t)?1:0;if(t!=null){if(t=t.$$typeof,t===pg)return 11;if(t===mg)return 14}return 2}function fi(t,e){var n=t.alternate;return n===null?(n=mn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function bc(t,e,n,r,i,s){var o=2;if(r=t,typeof t=="function")Qg(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case eo:return os(n.children,i,s,e);case fg:o=8,i|=8;break;case Cp:return t=mn(12,n,e,i|2),t.elementType=Cp,t.lanes=s,t;case Ap:return t=mn(13,n,e,i),t.elementType=Ap,t.lanes=s,t;case Rp:return t=mn(19,n,e,i),t.elementType=Rp,t.lanes=s,t;case OT:return ld(n,i,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case NT:o=10;break e;case DT:o=9;break e;case pg:o=11;break e;case mg:o=14;break e;case Gr:o=16,r=null;break e}throw Error(M(130,t==null?t:typeof t,""))}return e=mn(o,n,e,i),e.elementType=t,e.type=r,e.lanes=s,e}function os(t,e,n,r){return t=mn(7,t,r,e),t.lanes=n,t}function ld(t,e,n,r){return t=mn(22,t,r,e),t.elementType=OT,t.lanes=n,t.stateNode={isHidden:!1},t}function Gf(t,e,n){return t=mn(6,t,null,e),t.lanes=n,t}function Kf(t,e,n){return e=mn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function tD(t,e,n,r,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Pf(0),this.expirationTimes=Pf(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Pf(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Yg(t,e,n,r,i,s,o,a,u){return t=new tD(t,e,n,a,u),e===1?(e=1,s===!0&&(e|=8)):e=0,s=mn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},bg(s),t}function nD(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Zs,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function TS(t){if(!t)return Ii;t=t._reactInternals;e:{if(Cs(t)!==t||t.tag!==1)throw Error(M(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Wt(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(M(171))}if(t.tag===1){var n=t.type;if(Wt(n))return T0(t,n,e)}return e}function SS(t,e,n,r,i,s,o,a,u){return t=Yg(n,r,!0,t,i,s,o,a,u),t.context=TS(null),n=t.current,r=xt(),i=di(n),s=Ir(r,i),s.callback=e??null,ci(n,s,i),t.current.lanes=i,nu(t,i,r),$t(t,r),t}function ud(t,e,n,r){var i=e.current,s=xt(),o=di(i);return n=TS(n),e.context===null?e.context=n:e.pendingContext=n,e=Ir(s,o),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),t=ci(i,e,o),t!==null&&(Vn(t,i,o,s),Rc(t,i,o)),o}function mh(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function qE(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Xg(t,e){qE(t,e),(t=t.alternate)&&qE(t,e)}function rD(){return null}var CS=typeof reportError=="function"?reportError:function(t){console.error(t)};function Jg(t){this._internalRoot=t}cd.prototype.render=Jg.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(M(409));ud(t,e,null,null)};cd.prototype.unmount=Jg.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;ps(function(){ud(null,t,null,null)}),e[Ar]=null}};function cd(t){this._internalRoot=t}cd.prototype.unstable_scheduleHydration=function(t){if(t){var e=n0();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Qr.length&&e!==0&&e<Qr[n].priority;n++);Qr.splice(n,0,t),n===0&&i0(t)}};function Zg(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function hd(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function GE(){}function iD(t,e,n,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var c=mh(o);s.call(c)}}var o=SS(e,r,t,0,null,!1,!1,"",GE);return t._reactRootContainer=o,t[Ar]=o.current,Sl(t.nodeType===8?t.parentNode:t),ps(),o}for(;i=t.lastChild;)t.removeChild(i);if(typeof r=="function"){var a=r;r=function(){var c=mh(u);a.call(c)}}var u=Yg(t,0,!1,null,null,!1,!1,"",GE);return t._reactRootContainer=u,t[Ar]=u.current,Sl(t.nodeType===8?t.parentNode:t),ps(function(){ud(e,u,n,r)}),u}function dd(t,e,n,r,i){var s=n._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var a=i;i=function(){var u=mh(o);a.call(u)}}ud(e,o,t,i)}else o=iD(n,e,t,i,r);return mh(o)}e0=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Va(e.pendingLanes);n!==0&&(yg(e,n|1),$t(e,qe()),!(de&6)&&(bo=qe()+500,Mi()))}break;case 13:ps(function(){var r=Rr(t,1);if(r!==null){var i=xt();Vn(r,t,1,i)}}),Xg(t,1)}};vg=function(t){if(t.tag===13){var e=Rr(t,134217728);if(e!==null){var n=xt();Vn(e,t,134217728,n)}Xg(t,134217728)}};t0=function(t){if(t.tag===13){var e=di(t),n=Rr(t,e);if(n!==null){var r=xt();Vn(n,t,e,r)}Xg(t,e)}};n0=function(){return ye};r0=function(t,e){var n=ye;try{return ye=t,e()}finally{ye=n}};Vp=function(t,e,n){switch(e){case"input":if(Np(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var i=nd(r);if(!i)throw Error(M(90));xT(r),Np(r,i)}}}break;case"textarea":MT(t,n);break;case"select":e=n.value,e!=null&&ho(t,!!n.multiple,e,!1)}};WT=qg;$T=ps;var sD={usingClientEntryPoint:!1,Events:[iu,io,nd,zT,jT,qg]},Pa={findFiberByHostInstance:Ji,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},oD={bundleType:Pa.bundleType,version:Pa.version,rendererPackageName:Pa.rendererPackageName,rendererConfig:Pa.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Fr.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=GT(t),t===null?null:t.stateNode},findFiberByHostInstance:Pa.findFiberByHostInstance||rD,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var hc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!hc.isDisabled&&hc.supportsFiber)try{Jh=hc.inject(oD),er=hc}catch{}}sn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sD;sn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Zg(e))throw Error(M(200));return nD(t,e,null,n)};sn.createRoot=function(t,e){if(!Zg(t))throw Error(M(299));var n=!1,r="",i=CS;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=Yg(t,1,!1,null,null,n,!1,r,i),t[Ar]=e.current,Sl(t.nodeType===8?t.parentNode:t),new Jg(e)};sn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(M(188)):(t=Object.keys(t).join(","),Error(M(268,t)));return t=GT(e),t=t===null?null:t.stateNode,t};sn.flushSync=function(t){return ps(t)};sn.hydrate=function(t,e,n){if(!hd(e))throw Error(M(200));return dd(null,t,e,!0,n)};sn.hydrateRoot=function(t,e,n){if(!Zg(t))throw Error(M(405));var r=n!=null&&n.hydratedSources||null,i=!1,s="",o=CS;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=SS(e,null,t,1,n??null,i,!1,s,o),t[Ar]=e.current,Sl(t),r)for(t=0;t<r.length;t++)n=r[t],i=n._getVersion,i=i(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,i]:e.mutableSourceEagerHydrationData.push(n,i);return new cd(e)};sn.render=function(t,e,n){if(!hd(e))throw Error(M(200));return dd(null,t,e,!1,n)};sn.unmountComponentAtNode=function(t){if(!hd(t))throw Error(M(40));return t._reactRootContainer?(ps(function(){dd(null,null,t,!1,function(){t._reactRootContainer=null,t[Ar]=null})}),!0):!1};sn.unstable_batchedUpdates=qg;sn.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!hd(n))throw Error(M(200));if(t==null||t._reactInternals===void 0)throw Error(M(38));return dd(t,e,n,!1,r)};sn.version="18.3.1-next-f1338f8080-20240426";function AS(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(AS)}catch(t){console.error(t)}}AS(),AT.exports=sn;var aD=AT.exports,KE=aD;Tp.createRoot=KE.createRoot,Tp.hydrateRoot=KE.hydrateRoot;const lD="modulepreload",uD=function(t){return"/"+t},QE={},ka=function(e,n,r){if(!n||n.length===0)return e();const i=document.getElementsByTagName("link");return Promise.all(n.map(s=>{if(s=uD(s),s in QE)return;QE[s]=!0;const o=s.endsWith(".css"),a=o?'[rel="stylesheet"]':"";if(!!r)for(let d=i.length-1;d>=0;d--){const f=i[d];if(f.href===s&&(!o||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${s}"]${a}`))return;const c=document.createElement("link");if(c.rel=o?"stylesheet":lD,o||(c.as="script",c.crossOrigin=""),c.href=s,document.head.appendChild(c),o)return new Promise((d,f)=>{c.addEventListener("load",d),c.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${s}`)))})})).then(()=>e()).catch(s=>{const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=s,window.dispatchEvent(o),!o.defaultPrevented)throw s})},cD=()=>{};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RS={NODE_CLIENT:!1,NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const F=function(t,e){if(!t)throw Qo(e)},Qo=function(t){return new Error("Firebase Database ("+RS.SDK_VERSION+") INTERNAL ASSERT FAILED: "+t)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PS=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},hD=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],o=t[n++],a=t[n++],u=((i&7)<<18|(s&63)<<12|(o&63)<<6|a&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const s=t[n++],o=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},e_={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],o=i+1<t.length,a=o?t[i+1]:0,u=i+2<t.length,c=u?t[i+2]:0,d=s>>2,f=(s&3)<<4|a>>4;let m=(a&15)<<2|c>>6,y=c&63;u||(y=64,o||(m=64)),r.push(n[d],n[f],n[m],n[y])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(PS(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):hD(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],a=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const f=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||a==null||c==null||f==null)throw new dD;const m=s<<2|a>>4;if(r.push(m),c!==64){const y=a<<4&240|c>>2;if(r.push(y),f!==64){const C=c<<6&192|f;r.push(C)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class dD extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const kS=function(t){const e=PS(t);return e_.encodeByteArray(e,!0)},gh=function(t){return kS(t).replace(/\./g,"")},_h=function(t){try{return e_.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fD(t){return NS(void 0,t)}function NS(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(const n in e)!e.hasOwnProperty(n)||!pD(n)||(t[n]=NS(t[n],e[n]));return t}function pD(t){return t!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mD(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gD=()=>mD().__FIREBASE_DEFAULTS__,_D=()=>{if(typeof process>"u"||typeof process.env>"u")return;const t={}.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},yD=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&_h(t[1]);return e&&JSON.parse(e)},fd=()=>{try{return cD()||gD()||_D()||yD()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},DS=t=>{var e,n;return(n=(e=fd())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},OS=t=>{const e=DS(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},bS=()=>{var t;return(t=fd())==null?void 0:t.config},xS=t=>{var e;return(e=fd())==null?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vi(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function t_(t){return(await fetch(t,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function LS(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}},...t},a="";return[gh(JSON.stringify(n)),gh(JSON.stringify(o)),a].join(".")}const rl={};function vD(){const t={prod:[],emulator:[]};for(const e of Object.keys(rl))rl[e]?t.emulator.push(e):t.prod.push(e);return t}function ED(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}let YE=!1;function n_(t,e){if(typeof window>"u"||typeof document>"u"||!Vi(window.location.host)||rl[t]===e||rl[t]||YE)return;rl[t]=e;function n(m){return`__firebase__banner__${m}`}const r="__firebase__banner",s=vD().prod.length>0;function o(){const m=document.getElementById(r);m&&m.remove()}function a(m){m.style.display="flex",m.style.background="#7faaf0",m.style.position="fixed",m.style.bottom="5px",m.style.left="5px",m.style.padding=".5em",m.style.borderRadius="5px",m.style.alignItems="center"}function u(m,y){m.setAttribute("width","24"),m.setAttribute("id",y),m.setAttribute("height","24"),m.setAttribute("viewBox","0 0 24 24"),m.setAttribute("fill","none"),m.style.marginLeft="-6px"}function c(){const m=document.createElement("span");return m.style.cursor="pointer",m.style.marginLeft="16px",m.style.fontSize="24px",m.innerHTML=" &times;",m.onclick=()=>{YE=!0,o()},m}function d(m,y){m.setAttribute("id",y),m.innerText="Learn more",m.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",m.setAttribute("target","__blank"),m.style.paddingLeft="5px",m.style.textDecoration="underline"}function f(){const m=ED(r),y=n("text"),C=document.getElementById(y)||document.createElement("span"),N=n("learnmore"),b=document.getElementById(N)||document.createElement("a"),S=n("preprendIcon"),v=document.getElementById(S)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(m.created){const A=m.element;a(A),d(b,N);const O=c();u(v,S),A.append(v,C,b,O),document.body.appendChild(A)}s?(C.innerText="Preview backend disconnected.",v.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(v.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,C.innerText="Preview backend running in this workspace."),C.setAttribute("id",y)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",f):f()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function r_(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Nt())}function wD(){var e;const t=(e=fd())==null?void 0:e.forceEnvironment;if(t==="node")return!0;if(t==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function ID(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function i_(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function MS(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function TD(){const t=Nt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function VS(){return RS.NODE_ADMIN===!0}function SD(){return!wD()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function s_(){try{return typeof indexedDB=="object"}catch{return!1}}function o_(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}function FS(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CD="FirebaseError";class jn extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=CD,Object.setPrototypeOf(this,jn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,As.prototype.create)}}class As{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?AD(s,r):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new jn(i,a,r)}}function AD(t,e){return t.replace(RD,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const RD=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bl(t){return JSON.parse(t)}function Ze(t){return JSON.stringify(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const US=function(t){let e={},n={},r={},i="";try{const s=t.split(".");e=bl(_h(s[0])||""),n=bl(_h(s[1])||""),i=s[2],r=n.d||{},delete n.d}catch{}return{header:e,claims:n,data:r,signature:i}},PD=function(t){const e=US(t),n=e.claims;return!!n&&typeof n=="object"&&n.hasOwnProperty("iat")},kD=function(t){const e=US(t).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wn(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function ms(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]}function yh(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function vh(t,e,n){const r={};for(const i in t)Object.prototype.hasOwnProperty.call(t,i)&&(r[i]=e.call(n,t[i],i,t));return r}function kr(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],o=e[i];if(XE(s)&&XE(o)){if(!kr(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function XE(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rs(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Ua(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function Ba(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ND{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,n){n||(n=0);const r=this.W_;if(typeof e=="string")for(let f=0;f<16;f++)r[f]=e.charCodeAt(n)<<24|e.charCodeAt(n+1)<<16|e.charCodeAt(n+2)<<8|e.charCodeAt(n+3),n+=4;else for(let f=0;f<16;f++)r[f]=e[n]<<24|e[n+1]<<16|e[n+2]<<8|e[n+3],n+=4;for(let f=16;f<80;f++){const m=r[f-3]^r[f-8]^r[f-14]^r[f-16];r[f]=(m<<1|m>>>31)&4294967295}let i=this.chain_[0],s=this.chain_[1],o=this.chain_[2],a=this.chain_[3],u=this.chain_[4],c,d;for(let f=0;f<80;f++){f<40?f<20?(c=a^s&(o^a),d=1518500249):(c=s^o^a,d=1859775393):f<60?(c=s&o|a&(s|o),d=2400959708):(c=s^o^a,d=3395469782);const m=(i<<5|i>>>27)+c+u+d+r[f]&4294967295;u=a,a=o,o=(s<<30|s>>>2)&4294967295,s=i,i=m}this.chain_[0]=this.chain_[0]+i&4294967295,this.chain_[1]=this.chain_[1]+s&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+u&4294967295}update(e,n){if(e==null)return;n===void 0&&(n=e.length);const r=n-this.blockSize;let i=0;const s=this.buf_;let o=this.inbuf_;for(;i<n;){if(o===0)for(;i<=r;)this.compress_(e,i),i+=this.blockSize;if(typeof e=="string"){for(;i<n;)if(s[o]=e.charCodeAt(i),++o,++i,o===this.blockSize){this.compress_(s),o=0;break}}else for(;i<n;)if(s[o]=e[i],++o,++i,o===this.blockSize){this.compress_(s),o=0;break}}this.inbuf_=o,this.total_+=n}digest(){const e=[];let n=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=n&255,n/=256;this.compress_(this.buf_);let r=0;for(let i=0;i<5;i++)for(let s=24;s>=0;s-=8)e[r]=this.chain_[i]>>s&255,++r;return e}}function DD(t,e){const n=new OD(t,e);return n.subscribe.bind(n)}class OD{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");bD(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=Qf),i.error===void 0&&(i.error=Qf),i.complete===void 0&&(i.complete=Qf);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function bD(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Qf(){}function gs(t,e){return`${t} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xD=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);if(i>=55296&&i<=56319){const s=i-55296;r++,F(r<t.length,"Surrogate pair missing trail surrogate.");const o=t.charCodeAt(r)-56320;i=65536+(s<<10)+o}i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):i<65536?(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},pd=function(t){let e=0;for(let n=0;n<t.length;n++){const r=t.charCodeAt(n);r<128?e++:r<2048?e+=2:r>=55296&&r<=56319?(e+=4,n++):e+=3}return e};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const LD=1e3,MD=2,VD=4*60*60*1e3,FD=.5;function JE(t,e=LD,n=MD){const r=e*Math.pow(n,t),i=Math.round(FD*r*(Math.random()-.5)*2);return Math.min(VD,r+i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q(t){return t&&t._delegate?t._delegate:t}class Gt{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qi="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gm{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new Jt;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(BD(e))try{this.getOrInitializeService({instanceIdentifier:Qi})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Qi){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Qi){return this.instances.has(e)}getOptions(e=Qi){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(s);r===a&&o.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:UD(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Qi){return this.component?this.component.multipleInstances?e:Qi:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function UD(t){return t===Qi?void 0:t}function BD(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BS{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new gm(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oe;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(oe||(oe={}));const zD={debug:oe.DEBUG,verbose:oe.VERBOSE,info:oe.INFO,warn:oe.WARN,error:oe.ERROR,silent:oe.SILENT},jD=oe.INFO,WD={[oe.DEBUG]:"log",[oe.VERBOSE]:"log",[oe.INFO]:"info",[oe.WARN]:"warn",[oe.ERROR]:"error"},$D=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=WD[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ou{constructor(e){this.name=e,this._logLevel=jD,this._logHandler=$D,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in oe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?zD[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,oe.DEBUG,...e),this._logHandler(this,oe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,oe.VERBOSE,...e),this._logHandler(this,oe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,oe.INFO,...e),this._logHandler(this,oe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,oe.WARN,...e),this._logHandler(this,oe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,oe.ERROR,...e),this._logHandler(this,oe.ERROR,...e)}}const HD=(t,e)=>e.some(n=>t instanceof n);let ZE,ew;function qD(){return ZE||(ZE=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function GD(){return ew||(ew=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const zS=new WeakMap,_m=new WeakMap,jS=new WeakMap,Yf=new WeakMap,a_=new WeakMap;function KD(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(pi(t.result)),i()},o=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&zS.set(n,t)}).catch(()=>{}),a_.set(e,t),e}function QD(t){if(_m.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),i()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});_m.set(t,e)}let ym={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return _m.get(t);if(e==="objectStoreNames")return t.objectStoreNames||jS.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return pi(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function YD(t){ym=t(ym)}function XD(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Xf(this),e,...n);return jS.set(r,e.sort?e.sort():[e]),pi(r)}:GD().includes(t)?function(...e){return t.apply(Xf(this),e),pi(zS.get(this))}:function(...e){return pi(t.apply(Xf(this),e))}}function JD(t){return typeof t=="function"?XD(t):(t instanceof IDBTransaction&&QD(t),HD(t,qD())?new Proxy(t,ym):t)}function pi(t){if(t instanceof IDBRequest)return KD(t);if(Yf.has(t))return Yf.get(t);const e=JD(t);return e!==t&&(Yf.set(t,e),a_.set(e,t)),e}const Xf=t=>a_.get(t);function WS(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(t,e),a=pi(o);return r&&o.addEventListener("upgradeneeded",u=>{r(pi(o.result),u.oldVersion,u.newVersion,pi(o.transaction),u)}),n&&o.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),a.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const ZD=["get","getKey","getAll","getAllKeys","count"],eO=["put","add","delete","clear"],Jf=new Map;function tw(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Jf.get(e))return Jf.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=eO.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||ZD.includes(n)))return;const s=async function(o,...a){const u=this.transaction(o,i?"readwrite":"readonly");let c=u.store;return r&&(c=c.index(a.shift())),(await Promise.all([c[n](...a),i&&u.done]))[0]};return Jf.set(e,s),s}YD(t=>({...t,get:(e,n,r)=>tw(e,n)||t.get(e,n,r),has:(e,n)=>!!tw(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tO{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(nO(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function nO(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const vm="@firebase/app",nw="0.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nr=new ou("@firebase/app"),rO="@firebase/app-compat",iO="@firebase/analytics-compat",sO="@firebase/analytics",oO="@firebase/app-check-compat",aO="@firebase/app-check",lO="@firebase/auth",uO="@firebase/auth-compat",cO="@firebase/database",hO="@firebase/data-connect",dO="@firebase/database-compat",fO="@firebase/functions",pO="@firebase/functions-compat",mO="@firebase/installations",gO="@firebase/installations-compat",_O="@firebase/messaging",yO="@firebase/messaging-compat",vO="@firebase/performance",EO="@firebase/performance-compat",wO="@firebase/remote-config",IO="@firebase/remote-config-compat",TO="@firebase/storage",SO="@firebase/storage-compat",CO="@firebase/firestore",AO="@firebase/ai",RO="@firebase/firestore-compat",PO="firebase",kO="12.1.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Em="[DEFAULT]",NO={[vm]:"fire-core",[rO]:"fire-core-compat",[sO]:"fire-analytics",[iO]:"fire-analytics-compat",[aO]:"fire-app-check",[oO]:"fire-app-check-compat",[lO]:"fire-auth",[uO]:"fire-auth-compat",[cO]:"fire-rtdb",[hO]:"fire-data-connect",[dO]:"fire-rtdb-compat",[fO]:"fire-fn",[pO]:"fire-fn-compat",[mO]:"fire-iid",[gO]:"fire-iid-compat",[_O]:"fire-fcm",[yO]:"fire-fcm-compat",[vO]:"fire-perf",[EO]:"fire-perf-compat",[wO]:"fire-rc",[IO]:"fire-rc-compat",[TO]:"fire-gcs",[SO]:"fire-gcs-compat",[CO]:"fire-fst",[RO]:"fire-fst-compat",[AO]:"fire-vertex","fire-js":"fire-js",[PO]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xl=new Map,DO=new Map,wm=new Map;function rw(t,e){try{t.container.addComponent(e)}catch(n){Nr.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function zn(t){const e=t.name;if(wm.has(e))return Nr.debug(`There were multiple attempts to register component ${e}.`),!1;wm.set(e,t);for(const n of xl.values())rw(n,t);for(const n of DO.values())rw(n,t);return!0}function Fi(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function xe(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OO={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},mi=new As("app","Firebase",OO);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bO{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Gt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw mi.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ps=kO;function $S(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Em,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw mi.create("bad-app-name",{appName:String(i)});if(n||(n=bS()),!n)throw mi.create("no-options");const s=xl.get(i);if(s){if(kr(n,s.options)&&kr(r,s.config))return s;throw mi.create("duplicate-app",{appName:i})}const o=new BS(i);for(const u of wm.values())o.addComponent(u);const a=new bO(n,r,o);return xl.set(i,a),a}function au(t=Em){const e=xl.get(t);if(!e&&t===Em&&bS())return $S();if(!e)throw mi.create("no-app",{appName:t});return e}function xO(){return Array.from(xl.values())}function Ht(t,e,n){let r=NO[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const o=[`Unable to register library "${r}" with version "${e}":`];i&&o.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&o.push("and"),s&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Nr.warn(o.join(" "));return}zn(new Gt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const LO="firebase-heartbeat-database",MO=1,Ll="firebase-heartbeat-store";let Zf=null;function HS(){return Zf||(Zf=WS(LO,MO,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Ll)}catch(n){console.warn(n)}}}}).catch(t=>{throw mi.create("idb-open",{originalErrorMessage:t.message})})),Zf}async function VO(t){try{const n=(await HS()).transaction(Ll),r=await n.objectStore(Ll).get(qS(t));return await n.done,r}catch(e){if(e instanceof jn)Nr.warn(e.message);else{const n=mi.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Nr.warn(n.message)}}}async function iw(t,e){try{const r=(await HS()).transaction(Ll,"readwrite");await r.objectStore(Ll).put(e,qS(t)),await r.done}catch(n){if(n instanceof jn)Nr.warn(n.message);else{const r=mi.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Nr.warn(r.message)}}}function qS(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FO=1024,UO=30;class BO{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new jO(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=sw();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>UO){const o=WO(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Nr.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=sw(),{heartbeatsToSend:r,unsentEntries:i}=zO(this._heartbeatsCache.heartbeats),s=gh(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Nr.warn(n),""}}}function sw(){return new Date().toISOString().substring(0,10)}function zO(t,e=FO){const n=[];let r=t.slice();for(const i of t){const s=n.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),ow(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),ow(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class jO{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return s_()?o_().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await VO(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return iw(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return iw(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function ow(t){return gh(JSON.stringify({version:2,heartbeats:t})).length}function WO(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $O(t){zn(new Gt("platform-logger",e=>new tO(e),"PRIVATE")),zn(new Gt("heartbeat",e=>new BO(e),"PRIVATE")),Ht(vm,nw,t),Ht(vm,nw,"esm2020"),Ht("fire-js","")}$O("");var HO="firebase",qO="12.1.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ht(HO,qO,"app");const aw="@firebase/database",lw="1.1.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let GS="";function KS(t){GS=t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GO{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,n){n==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),Ze(n))}get(e){const n=this.domStorage_.getItem(this.prefixedName_(e));return n==null?null:bl(n)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KO{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,n){n==null?delete this.cache_[e]:this.cache_[e]=n}get(e){return Wn(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QS=function(t){try{if(typeof window<"u"&&typeof window[t]<"u"){const e=window[t];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new GO(e)}}catch{}return new KO},ts=QS("localStorage"),Im=QS("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yo=new ou("@firebase/database"),YS=function(){let t=1;return function(){return t++}}(),XS=function(t){const e=xD(t),n=new ND;n.update(e);const r=n.digest();return e_.encodeByteArray(r)},lu=function(...t){let e="";for(let n=0;n<t.length;n++){const r=t[n];Array.isArray(r)||r&&typeof r=="object"&&typeof r.length=="number"?e+=lu.apply(null,r):typeof r=="object"?e+=Ze(r):e+=r,e+=" "}return e};let as=null,uw=!0;const JS=function(t,e){F(!e||t===!0||t===!1,"Can't turn on custom loggers persistently."),t===!0?(yo.logLevel=oe.VERBOSE,as=yo.log.bind(yo),e&&Im.set("logging_enabled",!0)):typeof t=="function"?as=t:(as=null,Im.remove("logging_enabled"))},lt=function(...t){if(uw===!0&&(uw=!1,as===null&&Im.get("logging_enabled")===!0&&JS(!0)),as){const e=lu.apply(null,t);as(e)}},uu=function(t){return function(...e){lt(t,...e)}},Tm=function(...t){const e="FIREBASE INTERNAL ERROR: "+lu(...t);yo.error(e)},ar=function(...t){const e=`FIREBASE FATAL ERROR: ${lu(...t)}`;throw yo.error(e),new Error(e)},Pt=function(...t){const e="FIREBASE WARNING: "+lu(...t);yo.warn(e)},QO=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&Pt("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},md=function(t){return typeof t=="number"&&(t!==t||t===Number.POSITIVE_INFINITY||t===Number.NEGATIVE_INFINITY)},YO=function(t){if(document.readyState==="complete")t();else{let e=!1;const n=function(){if(!document.body){setTimeout(n,Math.floor(10));return}e||(e=!0,t())};document.addEventListener?(document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&n()}),window.attachEvent("onload",n))}},Ti="[MIN_NAME]",Dr="[MAX_NAME]",ks=function(t,e){if(t===e)return 0;if(t===Ti||e===Dr)return-1;if(e===Ti||t===Dr)return 1;{const n=cw(t),r=cw(e);return n!==null?r!==null?n-r===0?t.length-e.length:n-r:-1:r!==null?1:t<e?-1:1}},XO=function(t,e){return t===e?0:t<e?-1:1},Na=function(t,e){if(e&&t in e)return e[t];throw new Error("Missing required key ("+t+") in object: "+Ze(e))},l_=function(t){if(typeof t!="object"||t===null)return Ze(t);const e=[];for(const r in t)e.push(r);e.sort();let n="{";for(let r=0;r<e.length;r++)r!==0&&(n+=","),n+=Ze(e[r]),n+=":",n+=l_(t[e[r]]);return n+="}",n},ZS=function(t,e){const n=t.length;if(n<=e)return[t];const r=[];for(let i=0;i<n;i+=e)i+e>n?r.push(t.substring(i,n)):r.push(t.substring(i,i+e));return r};function ht(t,e){for(const n in t)t.hasOwnProperty(n)&&e(n,t[n])}const eC=function(t){F(!md(t),"Invalid JSON number");const e=11,n=52,r=(1<<e-1)-1;let i,s,o,a,u;t===0?(s=0,o=0,i=1/t===-1/0?1:0):(i=t<0,t=Math.abs(t),t>=Math.pow(2,1-r)?(a=Math.min(Math.floor(Math.log(t)/Math.LN2),r),s=a+r,o=Math.round(t*Math.pow(2,n-a)-Math.pow(2,n))):(s=0,o=Math.round(t/Math.pow(2,1-r-n))));const c=[];for(u=n;u;u-=1)c.push(o%2?1:0),o=Math.floor(o/2);for(u=e;u;u-=1)c.push(s%2?1:0),s=Math.floor(s/2);c.push(i?1:0),c.reverse();const d=c.join("");let f="";for(u=0;u<64;u+=8){let m=parseInt(d.substr(u,8),2).toString(16);m.length===1&&(m="0"+m),f=f+m}return f.toLowerCase()},JO=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},ZO=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function eb(t,e){let n="Unknown Error";t==="too_big"?n="The data requested exceeds the maximum size that can be accessed with a single request.":t==="permission_denied"?n="Client doesn't have permission to access the desired data.":t==="unavailable"&&(n="The service is unavailable");const r=new Error(t+" at "+e._path.toString()+": "+n);return r.code=t.toUpperCase(),r}const tb=new RegExp("^-?(0*)\\d{1,10}$"),nb=-2147483648,rb=2147483647,cw=function(t){if(tb.test(t)){const e=Number(t);if(e>=nb&&e<=rb)return e}return null},Yo=function(t){try{t()}catch(e){setTimeout(()=>{const n=e.stack||"";throw Pt("Exception was thrown by user callback.",n),e},Math.floor(0))}},ib=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},il=function(t,e){const n=setTimeout(t,e);return typeof n=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(n):typeof n=="object"&&n.unref&&n.unref(),n};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sb{constructor(e,n){this.appCheckProvider=n,this.appName=e.name,xe(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=n==null?void 0:n.getImmediate({optional:!0}),this.appCheck||n==null||n.get().then(r=>this.appCheck=r)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((n,r)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(n,r):n(null)},0)})}addTokenChangeListener(e){var n;(n=this.appCheckProvider)==null||n.get().then(r=>r.addTokenListener(e))}notifyForInvalidToken(){Pt(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ob{constructor(e,n,r){this.appName_=e,this.firebaseOptions_=n,this.authProvider_=r,this.auth_=null,this.auth_=r.getImmediate({optional:!0}),this.auth_||r.onInit(i=>this.auth_=i)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(n=>n&&n.code==="auth/token-not-initialized"?(lt("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(n)):new Promise((n,r)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(n,r):n(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(n=>n.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(n=>n.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',Pt(e)}}class vo{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}vo.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const u_="5",tC="v",nC="s",rC="r",iC="f",sC=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,oC="ls",aC="p",Sm="ac",lC="websocket",uC="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cC{constructor(e,n,r,i,s=!1,o="",a=!1,u=!1,c=null){this.secure=n,this.namespace=r,this.webSocketOnly=i,this.nodeAdmin=s,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=u,this.emulatorOptions=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=ts.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&ts.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",n=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${n}`}}function ab(t){return t.host!==t.internalHost||t.isCustomHost()||t.includeNamespaceInQueryParams}function hC(t,e,n){F(typeof e=="string","typeof type must == string"),F(typeof n=="object","typeof params must == object");let r;if(e===lC)r=(t.secure?"wss://":"ws://")+t.internalHost+"/.ws?";else if(e===uC)r=(t.secure?"https://":"http://")+t.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);ab(t)&&(n.ns=t.namespace);const i=[];return ht(n,(s,o)=>{i.push(s+"="+o)}),r+i.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lb{constructor(){this.counters_={}}incrementCounter(e,n=1){Wn(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=n}get(){return fD(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ep={},tp={};function c_(t){const e=t.toString();return ep[e]||(ep[e]=new lb),ep[e]}function ub(t,e){const n=t.toString();return tp[n]||(tp[n]=e()),tp[n]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cb{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,n){this.closeAfterResponse=e,this.onClose=n,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,n){for(this.pendingResponses[e]=n;this.pendingResponses[this.currentResponseNum];){const r=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let i=0;i<r.length;++i)r[i]&&Yo(()=>{this.onMessage_(r[i])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hw="start",hb="close",db="pLPCommand",fb="pRTLPCB",dC="id",fC="pw",pC="ser",pb="cb",mb="seg",gb="ts",_b="d",yb="dframe",mC=1870,gC=30,vb=mC-gC,Eb=25e3,wb=3e4;class ri{constructor(e,n,r,i,s,o,a){this.connId=e,this.repoInfo=n,this.applicationId=r,this.appCheckToken=i,this.authToken=s,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=uu(e),this.stats_=c_(n),this.urlFn=u=>(this.appCheckToken&&(u[Sm]=this.appCheckToken),hC(n,uC,u))}open(e,n){this.curSegmentNum=0,this.onDisconnect_=n,this.myPacketOrderer=new cb(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(wb)),YO(()=>{if(this.isClosed_)return;this.scriptTagHolder=new h_((...s)=>{const[o,a,u,c,d]=s;if(this.incrementIncomingBytes_(s),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===hw)this.id=a,this.password=u;else if(o===hb)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...s)=>{const[o,a]=s;this.incrementIncomingBytes_(s),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);const r={};r[hw]="t",r[pC]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(r[pb]=this.scriptTagHolder.uniqueCallbackIdentifier),r[tC]=u_,this.transportSessionId&&(r[nC]=this.transportSessionId),this.lastSessionId&&(r[oC]=this.lastSessionId),this.applicationId&&(r[aC]=this.applicationId),this.appCheckToken&&(r[Sm]=this.appCheckToken),typeof location<"u"&&location.hostname&&sC.test(location.hostname)&&(r[rC]=iC);const i=this.urlFn(r);this.log_("Connecting via long-poll to "+i),this.scriptTagHolder.addTag(i,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){ri.forceAllow_=!0}static forceDisallow(){ri.forceDisallow_=!0}static isAvailable(){return ri.forceAllow_?!0:!ri.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!JO()&&!ZO()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const n=Ze(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const r=kS(n),i=ZS(r,vb);for(let s=0;s<i.length;s++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[s]),this.curSegmentNum++}addDisconnectPingFrame(e,n){this.myDisconnFrame=document.createElement("iframe");const r={};r[yb]="t",r[dC]=e,r[fC]=n,this.myDisconnFrame.src=this.urlFn(r),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const n=Ze(e).length;this.bytesReceived+=n,this.stats_.incrementCounter("bytes_received",n)}}class h_{constructor(e,n,r,i){this.onDisconnect=r,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=YS(),window[db+this.uniqueCallbackIdentifier]=e,window[fb+this.uniqueCallbackIdentifier]=n,this.myIFrame=h_.createIFrame_();let s="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(s='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+s+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){lt("frame writing exception"),a.stack&&lt(a.stack),lt(a)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||lt("No IE domain setting required")}catch{const r=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+r+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,n){for(this.myID=e,this.myPW=n,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[dC]=this.myID,e[fC]=this.myPW,e[pC]=this.currentSerial;let n=this.urlFn(e),r="",i=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+gC+r.length<=mC;){const o=this.pendingSegs.shift();r=r+"&"+mb+i+"="+o.seg+"&"+gb+i+"="+o.ts+"&"+_b+i+"="+o.d,i++}return n=n+r,this.addLongPollTag_(n,this.currentSerial),!0}else return!1}enqueueSegment(e,n,r){this.pendingSegs.push({seg:e,ts:n,d:r}),this.alive&&this.newRequest_()}addLongPollTag_(e,n){this.outstandingRequests.add(n);const r=()=>{this.outstandingRequests.delete(n),this.newRequest_()},i=setTimeout(r,Math.floor(Eb)),s=()=>{clearTimeout(i),r()};this.addTag(e,s)}addTag(e,n){setTimeout(()=>{try{if(!this.sendNewPolls)return;const r=this.myIFrame.doc.createElement("script");r.type="text/javascript",r.async=!0,r.src=e,r.onload=r.onreadystatechange=function(){const i=r.readyState;(!i||i==="loaded"||i==="complete")&&(r.onload=r.onreadystatechange=null,r.parentNode&&r.parentNode.removeChild(r),n())},r.onerror=()=>{lt("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(r)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ib=16384,Tb=45e3;let Eh=null;typeof MozWebSocket<"u"?Eh=MozWebSocket:typeof WebSocket<"u"&&(Eh=WebSocket);class dn{constructor(e,n,r,i,s,o,a){this.connId=e,this.applicationId=r,this.appCheckToken=i,this.authToken=s,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=uu(this.connId),this.stats_=c_(n),this.connURL=dn.connectionURL_(n,o,a,i,r),this.nodeAdmin=n.nodeAdmin}static connectionURL_(e,n,r,i,s){const o={};return o[tC]=u_,typeof location<"u"&&location.hostname&&sC.test(location.hostname)&&(o[rC]=iC),n&&(o[nC]=n),r&&(o[oC]=r),i&&(o[Sm]=i),s&&(o[aC]=s),hC(e,lC,o)}open(e,n){this.onDisconnect=n,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,ts.set("previous_websocket_failure",!0);try{let r;VS(),this.mySock=new Eh(this.connURL,[],r)}catch(r){this.log_("Error instantiating WebSocket.");const i=r.message||r.data;i&&this.log_(i),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=r=>{this.handleIncomingFrame(r)},this.mySock.onerror=r=>{this.log_("WebSocket error.  Closing connection.");const i=r.message||r.data;i&&this.log_(i),this.onClosed_()}}start(){}static forceDisallow(){dn.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const n=/Android ([0-9]{0,}\.[0-9]{0,})/,r=navigator.userAgent.match(n);r&&r.length>1&&parseFloat(r[1])<4.4&&(e=!0)}return!e&&Eh!==null&&!dn.forceDisallow_}static previouslyFailed(){return ts.isInMemoryStorage||ts.get("previous_websocket_failure")===!0}markConnectionHealthy(){ts.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const n=this.frames.join("");this.frames=null;const r=bl(n);this.onMessage(r)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(F(this.frames===null,"We already have a frame buffer"),e.length<=6){const n=Number(e);if(!isNaN(n))return this.handleNewFrameCount_(n),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const n=e.data;if(this.bytesReceived+=n.length,this.stats_.incrementCounter("bytes_received",n.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(n);else{const r=this.extractFrameCount_(n);r!==null&&this.appendFrame_(r)}}send(e){this.resetKeepAlive();const n=Ze(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const r=ZS(n,Ib);r.length>1&&this.sendString_(String(r.length));for(let i=0;i<r.length;i++)this.sendString_(r[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(Tb))}sendString_(e){try{this.mySock.send(e)}catch(n){this.log_("Exception thrown from WebSocket.send():",n.message||n.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}dn.responsesRequiredToBeHealthy=2;dn.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xo{static get ALL_TRANSPORTS(){return[ri,dn]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const n=dn&&dn.isAvailable();let r=n&&!dn.previouslyFailed();if(e.webSocketOnly&&(n||Pt("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),r=!0),r)this.transports_=[dn];else{const i=this.transports_=[];for(const s of xo.ALL_TRANSPORTS)s&&s.isAvailable()&&i.push(s);xo.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}xo.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sb=6e4,Cb=5e3,Ab=10*1024,Rb=100*1024,np="t",dw="d",Pb="s",fw="r",kb="e",pw="o",mw="a",gw="n",_w="p",Nb="h";class Db{constructor(e,n,r,i,s,o,a,u,c,d){this.id=e,this.repoInfo_=n,this.applicationId_=r,this.appCheckToken_=i,this.authToken_=s,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=u,this.onKill_=c,this.lastSessionId=d,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=uu("c:"+this.id+":"),this.transportManager_=new xo(n),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.conn_),r=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(n,r)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=il(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Rb?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>Ab?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return n=>{e===this.conn_?this.onConnectionLost_(n):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return n=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(n):e===this.secondaryConn_?this.onSecondaryMessageReceived_(n):this.log_("message on old connection"))}}sendRequest(e){const n={t:"d",d:e};this.sendData_(n)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(np in e){const n=e[np];n===mw?this.upgradeIfSecondaryHealthy_():n===fw?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):n===pw&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const n=Na("t",e),r=Na("d",e);if(n==="c")this.onSecondaryControl_(r);else if(n==="d")this.pendingDataMessages.push(r);else throw new Error("Unknown protocol layer: "+n)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:_w,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:mw,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:gw,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const n=Na("t",e),r=Na("d",e);n==="c"?this.onControl_(r):n==="d"&&this.onDataMessage_(r)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const n=Na(np,e);if(dw in e){const r=e[dw];if(n===Nb){const i={...r};this.repoInfo_.isUsingEmulator&&(i.h=this.repoInfo_.host),this.onHandshake_(i)}else if(n===gw){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let i=0;i<this.pendingDataMessages.length;++i)this.onDataMessage_(this.pendingDataMessages[i]);this.pendingDataMessages=[],this.tryCleanupConnection()}else n===Pb?this.onConnectionShutdown_(r):n===fw?this.onReset_(r):n===kb?Tm("Server Error: "+r):n===pw?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):Tm("Unknown control packet command: "+n)}}onHandshake_(e){const n=e.ts,r=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,n),u_!==r&&Pt("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.secondaryConn_),r=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(n,r),il(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(Sb))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,n){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(n,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):il(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(Cb))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:_w,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(ts.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _C{put(e,n,r,i){}merge(e,n,r,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,n,r){}onDisconnectMerge(e,n,r){}onDisconnectCancel(e,n){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yC{constructor(e){this.allowedEvents_=e,this.listeners_={},F(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...n){if(Array.isArray(this.listeners_[e])){const r=[...this.listeners_[e]];for(let i=0;i<r.length;i++)r[i].callback.apply(r[i].context,n)}}on(e,n,r){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:n,context:r});const i=this.getInitialEvent(e);i&&n.apply(r,i)}off(e,n,r){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let s=0;s<i.length;s++)if(i[s].callback===n&&(!r||r===i[s].context)){i.splice(s,1);return}}validateEventType_(e){F(this.allowedEvents_.find(n=>n===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wh extends yC{static getInstance(){return new wh}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!r_()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return F(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yw=32,vw=768;class ge{constructor(e,n){if(n===void 0){this.pieces_=e.split("/");let r=0;for(let i=0;i<this.pieces_.length;i++)this.pieces_[i].length>0&&(this.pieces_[r]=this.pieces_[i],r++);this.pieces_.length=r,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=n}toString(){let e="";for(let n=this.pieceNum_;n<this.pieces_.length;n++)this.pieces_[n]!==""&&(e+="/"+this.pieces_[n]);return e||"/"}}function pe(){return new ge("")}function re(t){return t.pieceNum_>=t.pieces_.length?null:t.pieces_[t.pieceNum_]}function Si(t){return t.pieces_.length-t.pieceNum_}function we(t){let e=t.pieceNum_;return e<t.pieces_.length&&e++,new ge(t.pieces_,e)}function d_(t){return t.pieceNum_<t.pieces_.length?t.pieces_[t.pieces_.length-1]:null}function Ob(t){let e="";for(let n=t.pieceNum_;n<t.pieces_.length;n++)t.pieces_[n]!==""&&(e+="/"+encodeURIComponent(String(t.pieces_[n])));return e||"/"}function Ml(t,e=0){return t.pieces_.slice(t.pieceNum_+e)}function vC(t){if(t.pieceNum_>=t.pieces_.length)return null;const e=[];for(let n=t.pieceNum_;n<t.pieces_.length-1;n++)e.push(t.pieces_[n]);return new ge(e,0)}function Le(t,e){const n=[];for(let r=t.pieceNum_;r<t.pieces_.length;r++)n.push(t.pieces_[r]);if(e instanceof ge)for(let r=e.pieceNum_;r<e.pieces_.length;r++)n.push(e.pieces_[r]);else{const r=e.split("/");for(let i=0;i<r.length;i++)r[i].length>0&&n.push(r[i])}return new ge(n,0)}function ie(t){return t.pieceNum_>=t.pieces_.length}function bt(t,e){const n=re(t),r=re(e);if(n===null)return e;if(n===r)return bt(we(t),we(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+t+")")}function bb(t,e){const n=Ml(t,0),r=Ml(e,0);for(let i=0;i<n.length&&i<r.length;i++){const s=ks(n[i],r[i]);if(s!==0)return s}return n.length===r.length?0:n.length<r.length?-1:1}function f_(t,e){if(Si(t)!==Si(e))return!1;for(let n=t.pieceNum_,r=e.pieceNum_;n<=t.pieces_.length;n++,r++)if(t.pieces_[n]!==e.pieces_[r])return!1;return!0}function gn(t,e){let n=t.pieceNum_,r=e.pieceNum_;if(Si(t)>Si(e))return!1;for(;n<t.pieces_.length;){if(t.pieces_[n]!==e.pieces_[r])return!1;++n,++r}return!0}class xb{constructor(e,n){this.errorPrefix_=n,this.parts_=Ml(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let r=0;r<this.parts_.length;r++)this.byteLength_+=pd(this.parts_[r]);EC(this)}}function Lb(t,e){t.parts_.length>0&&(t.byteLength_+=1),t.parts_.push(e),t.byteLength_+=pd(e),EC(t)}function Mb(t){const e=t.parts_.pop();t.byteLength_-=pd(e),t.parts_.length>0&&(t.byteLength_-=1)}function EC(t){if(t.byteLength_>vw)throw new Error(t.errorPrefix_+"has a key path longer than "+vw+" bytes ("+t.byteLength_+").");if(t.parts_.length>yw)throw new Error(t.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+yw+") or object contains a cycle "+Yi(t))}function Yi(t){return t.parts_.length===0?"":"in property '"+t.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p_ extends yC{static getInstance(){return new p_}constructor(){super(["visible"]);let e,n;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(n="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(n="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(n="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(n="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,n&&document.addEventListener(n,()=>{const r=!document[e];r!==this.visible_&&(this.visible_=r,this.trigger("visible",r))},!1)}getInitialEvent(e){return F(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Da=1e3,Vb=60*5*1e3,Ew=30*1e3,Fb=1.3,Ub=3e4,Bb="server_kill",ww=3;class yn extends _C{constructor(e,n,r,i,s,o,a,u){if(super(),this.repoInfo_=e,this.applicationId_=n,this.onDataUpdate_=r,this.onConnectStatus_=i,this.onServerInfoUpdate_=s,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=u,this.id=yn.nextPersistentConnectionId_++,this.log_=uu("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=Da,this.maxReconnectDelay_=Vb,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,u&&!VS())throw new Error("Auth override specified in options, but not supported on non Node.js platforms");p_.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&wh.getInstance().on("online",this.onOnline_,this)}sendRequest(e,n,r){const i=++this.requestNumber_,s={r:i,a:e,b:n};this.log_(Ze(s)),F(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(s),r&&(this.requestCBHash_[i]=r)}get(e){this.initConnection_();const n=new Jt,i={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const a=o.d;o.s==="ok"?n.resolve(a):n.reject(a)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const s=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(s),n.promise}listen(e,n,r,i){this.initConnection_();const s=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+s),this.listens.has(o)||this.listens.set(o,new Map),F(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),F(!this.listens.get(o).has(s),"listen() called twice for same path/queryId.");const a={onComplete:i,hashFn:n,query:e,tag:r};this.listens.get(o).set(s,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const n=this.outstandingGets_[e];this.sendRequest("g",n.request,r=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),n.onComplete&&n.onComplete(r)})}sendListen_(e){const n=e.query,r=n._path.toString(),i=n._queryIdentifier;this.log_("Listen on "+r+" for "+i);const s={p:r},o="q";e.tag&&(s.q=n._queryObject,s.t=e.tag),s.h=e.hashFn(),this.sendRequest(o,s,a=>{const u=a.d,c=a.s;yn.warnOnListenWarnings_(u,n),(this.listens.get(r)&&this.listens.get(r).get(i))===e&&(this.log_("listen response",a),c!=="ok"&&this.removeListen_(r,i),e.onComplete&&e.onComplete(c,u))})}static warnOnListenWarnings_(e,n){if(e&&typeof e=="object"&&Wn(e,"w")){const r=ms(e,"w");if(Array.isArray(r)&&~r.indexOf("no_index")){const i='".indexOn": "'+n._queryParams.getIndex().toString()+'"',s=n._path.toString();Pt(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${i} at ${s} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||kD(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=Ew)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,n=PD(e)?"auth":"gauth",r={cred:e};this.authOverride_===null?r.noauth=!0:typeof this.authOverride_=="object"&&(r.authvar=this.authOverride_),this.sendRequest(n,r,i=>{const s=i.s,o=i.d||"error";this.authToken_===e&&(s==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(s,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const n=e.s,r=e.d||"error";n==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(n,r)})}unlisten(e,n){const r=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+r+" "+i),F(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(r,i)&&this.connected_&&this.sendUnlisten_(r,i,e._queryObject,n)}sendUnlisten_(e,n,r,i){this.log_("Unlisten on "+e+" for "+n);const s={p:e},o="n";i&&(s.q=r,s.t=i),this.sendRequest(o,s)}onDisconnectPut(e,n,r){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,n,r):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:n,onComplete:r})}onDisconnectMerge(e,n,r){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,n,r):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:n,onComplete:r})}onDisconnectCancel(e,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:n})}sendOnDisconnect_(e,n,r,i){const s={p:n,d:r};this.log_("onDisconnect "+e,s),this.sendRequest(e,s,o=>{i&&setTimeout(()=>{i(o.s,o.d)},Math.floor(0))})}put(e,n,r,i){this.putInternal("p",e,n,r,i)}merge(e,n,r,i){this.putInternal("m",e,n,r,i)}putInternal(e,n,r,i,s){this.initConnection_();const o={p:n,d:r};s!==void 0&&(o.h=s),this.outstandingPuts_.push({action:e,request:o,onComplete:i}),this.outstandingPutCount_++;const a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+n)}sendPut_(e){const n=this.outstandingPuts_[e].action,r=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(n,r,s=>{this.log_(n+" response",s),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),i&&i(s.s,s.d)})}reportStats(e){if(this.connected_){const n={c:e};this.log_("reportStats",n),this.sendRequest("s",n,r=>{if(r.s!=="ok"){const s=r.d;this.log_("reportStats","Error sending stats: "+s)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+Ze(e));const n=e.r,r=this.requestCBHash_[n];r&&(delete this.requestCBHash_[n],r(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,n){this.log_("handleServerMessage",e,n),e==="d"?this.onDataUpdate_(n.p,n.d,!1,n.t):e==="m"?this.onDataUpdate_(n.p,n.d,!0,n.t):e==="c"?this.onListenRevoked_(n.p,n.q):e==="ac"?this.onAuthRevoked_(n.s,n.d):e==="apc"?this.onAppCheckRevoked_(n.s,n.d):e==="sd"?this.onSecurityDebugPacket_(n):Tm("Unrecognized action received from server: "+Ze(e)+`
Are you using the latest client?`)}onReady_(e,n){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=n,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){F(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=Da,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=Da,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Ub&&(this.reconnectDelay_=Da),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let n=Math.max(0,this.reconnectDelay_-e);n=Math.random()*n,this.log_("Trying to reconnect in "+n+"ms"),this.scheduleConnect_(n),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Fb)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),n=this.onReady_.bind(this),r=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+yn.nextConnectionId_++,s=this.lastSessionId;let o=!1,a=null;const u=function(){a?a.close():(o=!0,r())},c=function(f){F(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(f)};this.realtime_={close:u,sendRequest:c};const d=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[f,m]=await Promise.all([this.authTokenProvider_.getToken(d),this.appCheckTokenProvider_.getToken(d)]);o?lt("getToken() completed but was canceled"):(lt("getToken() completed. Creating connection."),this.authToken_=f&&f.accessToken,this.appCheckToken_=m&&m.token,a=new Db(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,n,r,y=>{Pt(y+" ("+this.repoInfo_.toString()+")"),this.interrupt(Bb)},s))}catch(f){this.log_("Failed to get token: "+f),o||(this.repoInfo_.nodeAdmin&&Pt(f),u())}}}interrupt(e){lt("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){lt("Resuming connection for reason: "+e),delete this.interruptReasons_[e],yh(this.interruptReasons_)&&(this.reconnectDelay_=Da,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const n=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:n})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const n=this.outstandingPuts_[e];n&&"h"in n.request&&n.queued&&(n.onComplete&&n.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,n){let r;n?r=n.map(s=>l_(s)).join("$"):r="default";const i=this.removeListen_(e,r);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,n){const r=new ge(e).toString();let i;if(this.listens.has(r)){const s=this.listens.get(r);i=s.get(n),s.delete(n),s.size===0&&this.listens.delete(r)}else i=void 0;return i}onAuthRevoked_(e,n){lt("Auth token revoked: "+e+"/"+n),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=ww&&(this.reconnectDelay_=Ew,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,n){lt("App check token revoked: "+e+"/"+n),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=ww&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const n of e.values())this.sendListen_(n);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let n="js";e["sdk."+n+"."+GS.replace(/\./g,"-")]=1,r_()?e["framework.cordova"]=1:MS()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=wh.getInstance().currentlyOnline();return yh(this.interruptReasons_)&&e}}yn.nextPersistentConnectionId_=0;yn.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se{constructor(e,n){this.name=e,this.node=n}static Wrap(e,n){return new se(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gd{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,n){const r=new se(Ti,e),i=new se(Ti,n);return this.compare(r,i)!==0}minPost(){return se.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let dc;class wC extends gd{static get __EMPTY_NODE(){return dc}static set __EMPTY_NODE(e){dc=e}compare(e,n){return ks(e.name,n.name)}isDefinedOn(e){throw Qo("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,n){return!1}minPost(){return se.MIN}maxPost(){return new se(Dr,dc)}makePost(e,n){return F(typeof e=="string","KeyIndex indexValue must always be a string."),new se(e,dc)}toString(){return".key"}}const nr=new wC;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let fc=class{constructor(e,n,r,i,s=null){this.isReverse_=i,this.resultGenerator_=s,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=n?r(e.key,n):1,i&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),n;if(this.resultGenerator_?n=this.resultGenerator_(e.key,e.value):n={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return n}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}},Xt=class za{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??za.RED,this.left=i??Xn.EMPTY_NODE,this.right=s??Xn.EMPTY_NODE}copy(e,n,r,i,s){return new za(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return s<0?i=i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i=i.copy(null,n,null,null,null):i=i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return Xn.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,n){let r,i;if(r=this,n(e,r.key)<0)!r.left.isEmpty()&&!r.left.isRed_()&&!r.left.left.isRed_()&&(r=r.moveRedLeft_()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed_()&&(r=r.rotateRight_()),!r.right.isEmpty()&&!r.right.isRed_()&&!r.right.left.isRed_()&&(r=r.moveRedRight_()),n(e,r.key)===0){if(r.right.isEmpty())return Xn.EMPTY_NODE;i=r.right.min_(),r=r.copy(i.key,i.value,null,null,r.right.removeMin_())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,za.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,za.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}};Xt.RED=!0;Xt.BLACK=!1;class zb{copy(e,n,r,i,s){return this}insert(e,n,r){return new Xt(e,n,null)}remove(e,n){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}let Xn=class xc{constructor(e,n=xc.EMPTY_NODE){this.comparator_=e,this.root_=n}insert(e,n){return new xc(this.comparator_,this.root_.insert(e,n,this.comparator_).copy(null,null,Xt.BLACK,null,null))}remove(e){return new xc(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,Xt.BLACK,null,null))}get(e){let n,r=this.root_;for(;!r.isEmpty();){if(n=this.comparator_(e,r.key),n===0)return r.value;n<0?r=r.left:n>0&&(r=r.right)}return null}getPredecessorKey(e){let n,r=this.root_,i=null;for(;!r.isEmpty();)if(n=this.comparator_(e,r.key),n===0){if(r.left.isEmpty())return i?i.key:null;for(r=r.left;!r.right.isEmpty();)r=r.right;return r.key}else n<0?r=r.left:n>0&&(i=r,r=r.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new fc(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,n){return new fc(this.root_,e,this.comparator_,!1,n)}getReverseIteratorFrom(e,n){return new fc(this.root_,e,this.comparator_,!0,n)}getReverseIterator(e){return new fc(this.root_,null,this.comparator_,!0,e)}};Xn.EMPTY_NODE=new zb;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jb(t,e){return ks(t.name,e.name)}function m_(t,e){return ks(t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Cm;function Wb(t){Cm=t}const IC=function(t){return typeof t=="number"?"number:"+eC(t):"string:"+t},TC=function(t){if(t.isLeafNode()){const e=t.val();F(typeof e=="string"||typeof e=="number"||typeof e=="object"&&Wn(e,".sv"),"Priority must be a string or number.")}else F(t===Cm||t.isEmpty(),"priority of unexpected type.");F(t===Cm||t.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Iw;class st{static set __childrenNodeConstructor(e){Iw=e}static get __childrenNodeConstructor(){return Iw}constructor(e,n=st.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=n,this.lazyHash_=null,F(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),TC(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new st(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:st.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return ie(e)?this:re(e)===".priority"?this.priorityNode_:st.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,n){return null}updateImmediateChild(e,n){return e===".priority"?this.updatePriority(n):n.isEmpty()&&e!==".priority"?this:st.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,n).updatePriority(this.priorityNode_)}updateChild(e,n){const r=re(e);return r===null?n:n.isEmpty()&&r!==".priority"?this:(F(r!==".priority"||Si(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(r,st.__childrenNodeConstructor.EMPTY_NODE.updateChild(we(e),n)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,n){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+IC(this.priorityNode_.val())+":");const n=typeof this.value_;e+=n+":",n==="number"?e+=eC(this.value_):e+=this.value_,this.lazyHash_=XS(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===st.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof st.__childrenNodeConstructor?-1:(F(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const n=typeof e.value_,r=typeof this.value_,i=st.VALUE_TYPE_ORDER.indexOf(n),s=st.VALUE_TYPE_ORDER.indexOf(r);return F(i>=0,"Unknown leaf type: "+n),F(s>=0,"Unknown leaf type: "+r),i===s?r==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:s-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const n=e;return this.value_===n.value_&&this.priorityNode_.equals(n.priorityNode_)}else return!1}}st.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let SC,CC;function $b(t){SC=t}function Hb(t){CC=t}class qb extends gd{compare(e,n){const r=e.node.getPriority(),i=n.node.getPriority(),s=r.compareTo(i);return s===0?ks(e.name,n.name):s}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,n){return!e.getPriority().equals(n.getPriority())}minPost(){return se.MIN}maxPost(){return new se(Dr,new st("[PRIORITY-POST]",CC))}makePost(e,n){const r=SC(e);return new se(n,new st("[PRIORITY-POST]",r))}toString(){return".priority"}}const Se=new qb;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gb=Math.log(2);class Kb{constructor(e){const n=s=>parseInt(Math.log(s)/Gb,10),r=s=>parseInt(Array(s+1).join("1"),2);this.count=n(e+1),this.current_=this.count-1;const i=r(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Ih=function(t,e,n,r){t.sort(e);const i=function(u,c){const d=c-u;let f,m;if(d===0)return null;if(d===1)return f=t[u],m=n?n(f):f,new Xt(m,f.node,Xt.BLACK,null,null);{const y=parseInt(d/2,10)+u,C=i(u,y),N=i(y+1,c);return f=t[y],m=n?n(f):f,new Xt(m,f.node,Xt.BLACK,C,N)}},s=function(u){let c=null,d=null,f=t.length;const m=function(C,N){const b=f-C,S=f;f-=C;const v=i(b+1,S),A=t[b],O=n?n(A):A;y(new Xt(O,A.node,N,null,v))},y=function(C){c?(c.left=C,c=C):(d=C,c=C)};for(let C=0;C<u.count;++C){const N=u.nextBitIsOne(),b=Math.pow(2,u.count-(C+1));N?m(b,Xt.BLACK):(m(b,Xt.BLACK),m(b,Xt.RED))}return d},o=new Kb(t.length),a=s(o);return new Xn(r||e,a)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rp;const Gs={};class vr{static get Default(){return F(Gs&&Se,"ChildrenNode.ts has not been loaded"),rp=rp||new vr({".priority":Gs},{".priority":Se}),rp}constructor(e,n){this.indexes_=e,this.indexSet_=n}get(e){const n=ms(this.indexes_,e);if(!n)throw new Error("No index defined for "+e);return n instanceof Xn?n:null}hasIndex(e){return Wn(this.indexSet_,e.toString())}addIndex(e,n){F(e!==nr,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const r=[];let i=!1;const s=n.getIterator(se.Wrap);let o=s.getNext();for(;o;)i=i||e.isDefinedOn(o.node),r.push(o),o=s.getNext();let a;i?a=Ih(r,e.getCompare()):a=Gs;const u=e.toString(),c={...this.indexSet_};c[u]=e;const d={...this.indexes_};return d[u]=a,new vr(d,c)}addToIndexes(e,n){const r=vh(this.indexes_,(i,s)=>{const o=ms(this.indexSet_,s);if(F(o,"Missing index implementation for "+s),i===Gs)if(o.isDefinedOn(e.node)){const a=[],u=n.getIterator(se.Wrap);let c=u.getNext();for(;c;)c.name!==e.name&&a.push(c),c=u.getNext();return a.push(e),Ih(a,o.getCompare())}else return Gs;else{const a=n.get(e.name);let u=i;return a&&(u=u.remove(new se(e.name,a))),u.insert(e,e.node)}});return new vr(r,this.indexSet_)}removeFromIndexes(e,n){const r=vh(this.indexes_,i=>{if(i===Gs)return i;{const s=n.get(e.name);return s?i.remove(new se(e.name,s)):i}});return new vr(r,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Oa;class Y{static get EMPTY_NODE(){return Oa||(Oa=new Y(new Xn(m_),null,vr.Default))}constructor(e,n,r){this.children_=e,this.priorityNode_=n,this.indexMap_=r,this.lazyHash_=null,this.priorityNode_&&TC(this.priorityNode_),this.children_.isEmpty()&&F(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||Oa}updatePriority(e){return this.children_.isEmpty()?this:new Y(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const n=this.children_.get(e);return n===null?Oa:n}}getChild(e){const n=re(e);return n===null?this:this.getImmediateChild(n).getChild(we(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,n){if(F(n,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(n);{const r=new se(e,n);let i,s;n.isEmpty()?(i=this.children_.remove(e),s=this.indexMap_.removeFromIndexes(r,this.children_)):(i=this.children_.insert(e,n),s=this.indexMap_.addToIndexes(r,this.children_));const o=i.isEmpty()?Oa:this.priorityNode_;return new Y(i,o,s)}}updateChild(e,n){const r=re(e);if(r===null)return n;{F(re(e)!==".priority"||Si(e)===1,".priority must be the last token in a path");const i=this.getImmediateChild(r).updateChild(we(e),n);return this.updateImmediateChild(r,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const n={};let r=0,i=0,s=!0;if(this.forEachChild(Se,(o,a)=>{n[o]=a.val(e),r++,s&&Y.INTEGER_REGEXP_.test(o)?i=Math.max(i,Number(o)):s=!1}),!e&&s&&i<2*r){const o=[];for(const a in n)o[a]=n[a];return o}else return e&&!this.getPriority().isEmpty()&&(n[".priority"]=this.getPriority().val()),n}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+IC(this.getPriority().val())+":"),this.forEachChild(Se,(n,r)=>{const i=r.hash();i!==""&&(e+=":"+n+":"+i)}),this.lazyHash_=e===""?"":XS(e)}return this.lazyHash_}getPredecessorChildName(e,n,r){const i=this.resolveIndex_(r);if(i){const s=i.getPredecessorKey(new se(e,n));return s?s.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const n=this.resolveIndex_(e);if(n){const r=n.minKey();return r&&r.name}else return this.children_.minKey()}getFirstChild(e){const n=this.getFirstChildName(e);return n?new se(n,this.children_.get(n)):null}getLastChildName(e){const n=this.resolveIndex_(e);if(n){const r=n.maxKey();return r&&r.name}else return this.children_.maxKey()}getLastChild(e){const n=this.getLastChildName(e);return n?new se(n,this.children_.get(n)):null}forEachChild(e,n){const r=this.resolveIndex_(e);return r?r.inorderTraversal(i=>n(i.name,i.node)):this.children_.inorderTraversal(n)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,n){const r=this.resolveIndex_(n);if(r)return r.getIteratorFrom(e,i=>i);{const i=this.children_.getIteratorFrom(e.name,se.Wrap);let s=i.peek();for(;s!=null&&n.compare(s,e)<0;)i.getNext(),s=i.peek();return i}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,n){const r=this.resolveIndex_(n);if(r)return r.getReverseIteratorFrom(e,i=>i);{const i=this.children_.getReverseIteratorFrom(e.name,se.Wrap);let s=i.peek();for(;s!=null&&n.compare(s,e)>0;)i.getNext(),s=i.peek();return i}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===cu?-1:0}withIndex(e){if(e===nr||this.indexMap_.hasIndex(e))return this;{const n=this.indexMap_.addIndex(e,this.children_);return new Y(this.children_,this.priorityNode_,n)}}isIndexed(e){return e===nr||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const n=e;if(this.getPriority().equals(n.getPriority()))if(this.children_.count()===n.children_.count()){const r=this.getIterator(Se),i=n.getIterator(Se);let s=r.getNext(),o=i.getNext();for(;s&&o;){if(s.name!==o.name||!s.node.equals(o.node))return!1;s=r.getNext(),o=i.getNext()}return s===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===nr?null:this.indexMap_.get(e.toString())}}Y.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class Qb extends Y{constructor(){super(new Xn(m_),Y.EMPTY_NODE,vr.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return Y.EMPTY_NODE}isEmpty(){return!1}}const cu=new Qb;Object.defineProperties(se,{MIN:{value:new se(Ti,Y.EMPTY_NODE)},MAX:{value:new se(Dr,cu)}});wC.__EMPTY_NODE=Y.EMPTY_NODE;st.__childrenNodeConstructor=Y;Wb(cu);Hb(cu);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yb=!0;function Fe(t,e=null){if(t===null)return Y.EMPTY_NODE;if(typeof t=="object"&&".priority"in t&&(e=t[".priority"]),F(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof t=="object"&&".value"in t&&t[".value"]!==null&&(t=t[".value"]),typeof t!="object"||".sv"in t){const n=t;return new st(n,Fe(e))}if(!(t instanceof Array)&&Yb){const n=[];let r=!1;if(ht(t,(o,a)=>{if(o.substring(0,1)!=="."){const u=Fe(a);u.isEmpty()||(r=r||!u.getPriority().isEmpty(),n.push(new se(o,u)))}}),n.length===0)return Y.EMPTY_NODE;const s=Ih(n,jb,o=>o.name,m_);if(r){const o=Ih(n,Se.getCompare());return new Y(s,Fe(e),new vr({".priority":o},{".priority":Se}))}else return new Y(s,Fe(e),vr.Default)}else{let n=Y.EMPTY_NODE;return ht(t,(r,i)=>{if(Wn(t,r)&&r.substring(0,1)!=="."){const s=Fe(i);(s.isLeafNode()||!s.isEmpty())&&(n=n.updateImmediateChild(r,s))}}),n.updatePriority(Fe(e))}}$b(Fe);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g_ extends gd{constructor(e){super(),this.indexPath_=e,F(!ie(e)&&re(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,n){const r=this.extractChild(e.node),i=this.extractChild(n.node),s=r.compareTo(i);return s===0?ks(e.name,n.name):s}makePost(e,n){const r=Fe(e),i=Y.EMPTY_NODE.updateChild(this.indexPath_,r);return new se(n,i)}maxPost(){const e=Y.EMPTY_NODE.updateChild(this.indexPath_,cu);return new se(Dr,e)}toString(){return Ml(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xb extends gd{compare(e,n){const r=e.node.compareTo(n.node);return r===0?ks(e.name,n.name):r}isDefinedOn(e){return!0}indexedValueChanged(e,n){return!e.equals(n)}minPost(){return se.MIN}maxPost(){return se.MAX}makePost(e,n){const r=Fe(e);return new se(n,r)}toString(){return".value"}}const __=new Xb;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AC(t){return{type:"value",snapshotNode:t}}function Lo(t,e){return{type:"child_added",snapshotNode:e,childName:t}}function Vl(t,e){return{type:"child_removed",snapshotNode:e,childName:t}}function Fl(t,e,n){return{type:"child_changed",snapshotNode:e,childName:t,oldSnap:n}}function Jb(t,e){return{type:"child_moved",snapshotNode:e,childName:t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y_{constructor(e){this.index_=e}updateChild(e,n,r,i,s,o){F(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(n);return a.getChild(i).equals(r.getChild(i))&&a.isEmpty()===r.isEmpty()||(o!=null&&(r.isEmpty()?e.hasChild(n)?o.trackChildChange(Vl(n,a)):F(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(Lo(n,r)):o.trackChildChange(Fl(n,r,a))),e.isLeafNode()&&r.isEmpty())?e:e.updateImmediateChild(n,r).withIndex(this.index_)}updateFullNode(e,n,r){return r!=null&&(e.isLeafNode()||e.forEachChild(Se,(i,s)=>{n.hasChild(i)||r.trackChildChange(Vl(i,s))}),n.isLeafNode()||n.forEachChild(Se,(i,s)=>{if(e.hasChild(i)){const o=e.getImmediateChild(i);o.equals(s)||r.trackChildChange(Fl(i,s,o))}else r.trackChildChange(Lo(i,s))})),n.withIndex(this.index_)}updatePriority(e,n){return e.isEmpty()?Y.EMPTY_NODE:e.updatePriority(n)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ul{constructor(e){this.indexedFilter_=new y_(e.getIndex()),this.index_=e.getIndex(),this.startPost_=Ul.getStartPost_(e),this.endPost_=Ul.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const n=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,r=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return n&&r}updateChild(e,n,r,i,s,o){return this.matches(new se(n,r))||(r=Y.EMPTY_NODE),this.indexedFilter_.updateChild(e,n,r,i,s,o)}updateFullNode(e,n,r){n.isLeafNode()&&(n=Y.EMPTY_NODE);let i=n.withIndex(this.index_);i=i.updatePriority(Y.EMPTY_NODE);const s=this;return n.forEachChild(Se,(o,a)=>{s.matches(new se(o,a))||(i=i.updateImmediateChild(o,Y.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,r)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const n=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),n)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const n=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),n)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zb{constructor(e){this.withinDirectionalStart=n=>this.reverse_?this.withinEndPost(n):this.withinStartPost(n),this.withinDirectionalEnd=n=>this.reverse_?this.withinStartPost(n):this.withinEndPost(n),this.withinStartPost=n=>{const r=this.index_.compare(this.rangedFilter_.getStartPost(),n);return this.startIsInclusive_?r<=0:r<0},this.withinEndPost=n=>{const r=this.index_.compare(n,this.rangedFilter_.getEndPost());return this.endIsInclusive_?r<=0:r<0},this.rangedFilter_=new Ul(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,n,r,i,s,o){return this.rangedFilter_.matches(new se(n,r))||(r=Y.EMPTY_NODE),e.getImmediateChild(n).equals(r)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,n,r,i,s,o):this.fullLimitUpdateChild_(e,n,r,s,o)}updateFullNode(e,n,r){let i;if(n.isLeafNode()||n.isEmpty())i=Y.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<n.numChildren()&&n.isIndexed(this.index_)){i=Y.EMPTY_NODE.withIndex(this.index_);let s;this.reverse_?s=n.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):s=n.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;s.hasNext()&&o<this.limit_;){const a=s.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))i=i.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{i=n.withIndex(this.index_),i=i.updatePriority(Y.EMPTY_NODE);let s;this.reverse_?s=i.getReverseIterator(this.index_):s=i.getIterator(this.index_);let o=0;for(;s.hasNext();){const a=s.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:i=i.updateImmediateChild(a.name,Y.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,r)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,n,r,i,s){let o;if(this.reverse_){const f=this.index_.getCompare();o=(m,y)=>f(y,m)}else o=this.index_.getCompare();const a=e;F(a.numChildren()===this.limit_,"");const u=new se(n,r),c=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),d=this.rangedFilter_.matches(u);if(a.hasChild(n)){const f=a.getImmediateChild(n);let m=i.getChildAfterChild(this.index_,c,this.reverse_);for(;m!=null&&(m.name===n||a.hasChild(m.name));)m=i.getChildAfterChild(this.index_,m,this.reverse_);const y=m==null?1:o(m,u);if(d&&!r.isEmpty()&&y>=0)return s!=null&&s.trackChildChange(Fl(n,r,f)),a.updateImmediateChild(n,r);{s!=null&&s.trackChildChange(Vl(n,f));const N=a.updateImmediateChild(n,Y.EMPTY_NODE);return m!=null&&this.rangedFilter_.matches(m)?(s!=null&&s.trackChildChange(Lo(m.name,m.node)),N.updateImmediateChild(m.name,m.node)):N}}else return r.isEmpty()?e:d&&o(c,u)>=0?(s!=null&&(s.trackChildChange(Vl(c.name,c.node)),s.trackChildChange(Lo(n,r))),a.updateImmediateChild(n,r).updateImmediateChild(c.name,Y.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v_{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=Se}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return F(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return F(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:Ti}hasEnd(){return this.endSet_}getIndexEndValue(){return F(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return F(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Dr}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return F(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===Se}copy(){const e=new v_;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function ex(t){return t.loadsAllData()?new y_(t.getIndex()):t.hasLimit()?new Zb(t):new Ul(t)}function tx(t,e){const n=t.copy();return n.limitSet_=!0,n.limit_=e,n.viewFrom_="l",n}function nx(t,e){const n=t.copy();return n.limitSet_=!0,n.limit_=e,n.viewFrom_="r",n}function Am(t,e,n){const r=t.copy();return r.startSet_=!0,e===void 0&&(e=null),r.indexStartValue_=e,n!=null?(r.startNameSet_=!0,r.indexStartName_=n):(r.startNameSet_=!1,r.indexStartName_=""),r}function rx(t,e,n){let r;return t.index_===nr||n?r=Am(t,e,n):r=Am(t,e,Dr),r.startAfterSet_=!0,r}function Rm(t,e,n){const r=t.copy();return r.endSet_=!0,e===void 0&&(e=null),r.indexEndValue_=e,n!==void 0?(r.endNameSet_=!0,r.indexEndName_=n):(r.endNameSet_=!1,r.indexEndName_=""),r}function ix(t,e,n){let r;return t.index_===nr||n?r=Rm(t,e,n):r=Rm(t,e,Ti),r.endBeforeSet_=!0,r}function _d(t,e){const n=t.copy();return n.index_=e,n}function Tw(t){const e={};if(t.isDefault())return e;let n;if(t.index_===Se?n="$priority":t.index_===__?n="$value":t.index_===nr?n="$key":(F(t.index_ instanceof g_,"Unrecognized index type!"),n=t.index_.toString()),e.orderBy=Ze(n),t.startSet_){const r=t.startAfterSet_?"startAfter":"startAt";e[r]=Ze(t.indexStartValue_),t.startNameSet_&&(e[r]+=","+Ze(t.indexStartName_))}if(t.endSet_){const r=t.endBeforeSet_?"endBefore":"endAt";e[r]=Ze(t.indexEndValue_),t.endNameSet_&&(e[r]+=","+Ze(t.indexEndName_))}return t.limitSet_&&(t.isViewFromLeft()?e.limitToFirst=t.limit_:e.limitToLast=t.limit_),e}function Sw(t){const e={};if(t.startSet_&&(e.sp=t.indexStartValue_,t.startNameSet_&&(e.sn=t.indexStartName_),e.sin=!t.startAfterSet_),t.endSet_&&(e.ep=t.indexEndValue_,t.endNameSet_&&(e.en=t.indexEndName_),e.ein=!t.endBeforeSet_),t.limitSet_){e.l=t.limit_;let n=t.viewFrom_;n===""&&(t.isViewFromLeft()?n="l":n="r"),e.vf=n}return t.index_!==Se&&(e.i=t.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Th extends _C{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,n){return n!==void 0?"tag$"+n:(F(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,n,r,i){super(),this.repoInfo_=e,this.onDataUpdate_=n,this.authTokenProvider_=r,this.appCheckTokenProvider_=i,this.log_=uu("p:rest:"),this.listens_={}}listen(e,n,r,i){const s=e._path.toString();this.log_("Listen called for "+s+" "+e._queryIdentifier);const o=Th.getListenId_(e,r),a={};this.listens_[o]=a;const u=Tw(e._queryParams);this.restRequest_(s+".json",u,(c,d)=>{let f=d;if(c===404&&(f=null,c=null),c===null&&this.onDataUpdate_(s,f,!1,r),ms(this.listens_,o)===a){let m;c?c===401?m="permission_denied":m="rest_error:"+c:m="ok",i(m,null)}})}unlisten(e,n){const r=Th.getListenId_(e,n);delete this.listens_[r]}get(e){const n=Tw(e._queryParams),r=e._path.toString(),i=new Jt;return this.restRequest_(r+".json",n,(s,o)=>{let a=o;s===404&&(a=null,s=null),s===null?(this.onDataUpdate_(r,a,!1,null),i.resolve(a)):i.reject(new Error(a))}),i.promise}refreshAuthToken(e){}restRequest_(e,n={},r){return n.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,s])=>{i&&i.accessToken&&(n.auth=i.accessToken),s&&s.token&&(n.ac=s.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Rs(n);this.log_("Sending REST request for "+o);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(r&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let u=null;if(a.status>=200&&a.status<300){try{u=bl(a.responseText)}catch{Pt("Failed to parse JSON response for "+o+": "+a.responseText)}r(null,u)}else a.status!==401&&a.status!==404&&Pt("Got unsuccessful REST response for "+o+" Status: "+a.status),r(a.status);r=null}},a.open("GET",o,!0),a.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sx{constructor(){this.rootNode_=Y.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,n){this.rootNode_=this.rootNode_.updateChild(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sh(){return{value:null,children:new Map}}function Xo(t,e,n){if(ie(e))t.value=n,t.children.clear();else if(t.value!==null)t.value=t.value.updateChild(e,n);else{const r=re(e);t.children.has(r)||t.children.set(r,Sh());const i=t.children.get(r);e=we(e),Xo(i,e,n)}}function Pm(t,e){if(ie(e))return t.value=null,t.children.clear(),!0;if(t.value!==null){if(t.value.isLeafNode())return!1;{const n=t.value;return t.value=null,n.forEachChild(Se,(r,i)=>{Xo(t,new ge(r),i)}),Pm(t,e)}}else if(t.children.size>0){const n=re(e);return e=we(e),t.children.has(n)&&Pm(t.children.get(n),e)&&t.children.delete(n),t.children.size===0}else return!0}function km(t,e,n){t.value!==null?n(e,t.value):ox(t,(r,i)=>{const s=new ge(e.toString()+"/"+r);km(i,s,n)})}function ox(t,e){t.children.forEach((n,r)=>{e(r,n)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ax{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),n={...e};return this.last_&&ht(this.last_,(r,i)=>{n[r]=n[r]-i}),this.last_=e,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cw=10*1e3,lx=30*1e3,ux=5*60*1e3;class cx{constructor(e,n){this.server_=n,this.statsToReport_={},this.statsListener_=new ax(e);const r=Cw+(lx-Cw)*Math.random();il(this.reportStats_.bind(this),Math.floor(r))}reportStats_(){const e=this.statsListener_.get(),n={};let r=!1;ht(e,(i,s)=>{s>0&&Wn(this.statsToReport_,i)&&(n[i]=s,r=!0)}),r&&this.server_.reportStats(n),il(this.reportStats_.bind(this),Math.floor(Math.random()*2*ux))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var bn;(function(t){t[t.OVERWRITE=0]="OVERWRITE",t[t.MERGE=1]="MERGE",t[t.ACK_USER_WRITE=2]="ACK_USER_WRITE",t[t.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(bn||(bn={}));function E_(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function w_(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function I_(t){return{fromUser:!1,fromServer:!0,queryId:t,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ch{constructor(e,n,r){this.path=e,this.affectedTree=n,this.revert=r,this.type=bn.ACK_USER_WRITE,this.source=E_()}operationForChild(e){if(ie(this.path)){if(this.affectedTree.value!=null)return F(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const n=this.affectedTree.subtree(new ge(e));return new Ch(pe(),n,this.revert)}}else return F(re(this.path)===e,"operationForChild called for unrelated child."),new Ch(we(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bl{constructor(e,n){this.source=e,this.path=n,this.type=bn.LISTEN_COMPLETE}operationForChild(e){return ie(this.path)?new Bl(this.source,pe()):new Bl(this.source,we(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _s{constructor(e,n,r){this.source=e,this.path=n,this.snap=r,this.type=bn.OVERWRITE}operationForChild(e){return ie(this.path)?new _s(this.source,pe(),this.snap.getImmediateChild(e)):new _s(this.source,we(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mo{constructor(e,n,r){this.source=e,this.path=n,this.children=r,this.type=bn.MERGE}operationForChild(e){if(ie(this.path)){const n=this.children.subtree(new ge(e));return n.isEmpty()?null:n.value?new _s(this.source,pe(),n.value):new Mo(this.source,pe(),n)}else return F(re(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Mo(this.source,we(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ci{constructor(e,n,r){this.node_=e,this.fullyInitialized_=n,this.filtered_=r}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(ie(e))return this.isFullyInitialized()&&!this.filtered_;const n=re(e);return this.isCompleteForChild(n)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hx{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function dx(t,e,n,r){const i=[],s=[];return e.forEach(o=>{o.type==="child_changed"&&t.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&s.push(Jb(o.childName,o.snapshotNode))}),ba(t,i,"child_removed",e,r,n),ba(t,i,"child_added",e,r,n),ba(t,i,"child_moved",s,r,n),ba(t,i,"child_changed",e,r,n),ba(t,i,"value",e,r,n),i}function ba(t,e,n,r,i,s){const o=r.filter(a=>a.type===n);o.sort((a,u)=>px(t,a,u)),o.forEach(a=>{const u=fx(t,a,s);i.forEach(c=>{c.respondsTo(a.type)&&e.push(c.createEvent(u,t.query_))})})}function fx(t,e,n){return e.type==="value"||e.type==="child_removed"||(e.prevName=n.getPredecessorChildName(e.childName,e.snapshotNode,t.index_)),e}function px(t,e,n){if(e.childName==null||n.childName==null)throw Qo("Should only compare child_ events.");const r=new se(e.childName,e.snapshotNode),i=new se(n.childName,n.snapshotNode);return t.index_.compare(r,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yd(t,e){return{eventCache:t,serverCache:e}}function sl(t,e,n,r){return yd(new Ci(e,n,r),t.serverCache)}function RC(t,e,n,r){return yd(t.eventCache,new Ci(e,n,r))}function Ah(t){return t.eventCache.isFullyInitialized()?t.eventCache.getNode():null}function ys(t){return t.serverCache.isFullyInitialized()?t.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ip;const mx=()=>(ip||(ip=new Xn(XO)),ip);class Ie{static fromObject(e){let n=new Ie(null);return ht(e,(r,i)=>{n=n.set(new ge(r),i)}),n}constructor(e,n=mx()){this.value=e,this.children=n}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,n){if(this.value!=null&&n(this.value))return{path:pe(),value:this.value};if(ie(e))return null;{const r=re(e),i=this.children.get(r);if(i!==null){const s=i.findRootMostMatchingPathAndValue(we(e),n);return s!=null?{path:Le(new ge(r),s.path),value:s.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(ie(e))return this;{const n=re(e),r=this.children.get(n);return r!==null?r.subtree(we(e)):new Ie(null)}}set(e,n){if(ie(e))return new Ie(n,this.children);{const r=re(e),s=(this.children.get(r)||new Ie(null)).set(we(e),n),o=this.children.insert(r,s);return new Ie(this.value,o)}}remove(e){if(ie(e))return this.children.isEmpty()?new Ie(null):new Ie(null,this.children);{const n=re(e),r=this.children.get(n);if(r){const i=r.remove(we(e));let s;return i.isEmpty()?s=this.children.remove(n):s=this.children.insert(n,i),this.value===null&&s.isEmpty()?new Ie(null):new Ie(this.value,s)}else return this}}get(e){if(ie(e))return this.value;{const n=re(e),r=this.children.get(n);return r?r.get(we(e)):null}}setTree(e,n){if(ie(e))return n;{const r=re(e),s=(this.children.get(r)||new Ie(null)).setTree(we(e),n);let o;return s.isEmpty()?o=this.children.remove(r):o=this.children.insert(r,s),new Ie(this.value,o)}}fold(e){return this.fold_(pe(),e)}fold_(e,n){const r={};return this.children.inorderTraversal((i,s)=>{r[i]=s.fold_(Le(e,i),n)}),n(e,this.value,r)}findOnPath(e,n){return this.findOnPath_(e,pe(),n)}findOnPath_(e,n,r){const i=this.value?r(n,this.value):!1;if(i)return i;if(ie(e))return null;{const s=re(e),o=this.children.get(s);return o?o.findOnPath_(we(e),Le(n,s),r):null}}foreachOnPath(e,n){return this.foreachOnPath_(e,pe(),n)}foreachOnPath_(e,n,r){if(ie(e))return this;{this.value&&r(n,this.value);const i=re(e),s=this.children.get(i);return s?s.foreachOnPath_(we(e),Le(n,i),r):new Ie(null)}}foreach(e){this.foreach_(pe(),e)}foreach_(e,n){this.children.inorderTraversal((r,i)=>{i.foreach_(Le(e,r),n)}),this.value&&n(e,this.value)}foreachChild(e){this.children.inorderTraversal((n,r)=>{r.value&&e(n,r.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(e){this.writeTree_=e}static empty(){return new Fn(new Ie(null))}}function ol(t,e,n){if(ie(e))return new Fn(new Ie(n));{const r=t.writeTree_.findRootMostValueAndPath(e);if(r!=null){const i=r.path;let s=r.value;const o=bt(i,e);return s=s.updateChild(o,n),new Fn(t.writeTree_.set(i,s))}else{const i=new Ie(n),s=t.writeTree_.setTree(e,i);return new Fn(s)}}}function Nm(t,e,n){let r=t;return ht(n,(i,s)=>{r=ol(r,Le(e,i),s)}),r}function Aw(t,e){if(ie(e))return Fn.empty();{const n=t.writeTree_.setTree(e,new Ie(null));return new Fn(n)}}function Dm(t,e){return Ns(t,e)!=null}function Ns(t,e){const n=t.writeTree_.findRootMostValueAndPath(e);return n!=null?t.writeTree_.get(n.path).getChild(bt(n.path,e)):null}function Rw(t){const e=[],n=t.writeTree_.value;return n!=null?n.isLeafNode()||n.forEachChild(Se,(r,i)=>{e.push(new se(r,i))}):t.writeTree_.children.inorderTraversal((r,i)=>{i.value!=null&&e.push(new se(r,i.value))}),e}function gi(t,e){if(ie(e))return t;{const n=Ns(t,e);return n!=null?new Fn(new Ie(n)):new Fn(t.writeTree_.subtree(e))}}function Om(t){return t.writeTree_.isEmpty()}function Vo(t,e){return PC(pe(),t.writeTree_,e)}function PC(t,e,n){if(e.value!=null)return n.updateChild(t,e.value);{let r=null;return e.children.inorderTraversal((i,s)=>{i===".priority"?(F(s.value!==null,"Priority writes must always be leaf nodes"),r=s.value):n=PC(Le(t,i),s,n)}),!n.getChild(t).isEmpty()&&r!==null&&(n=n.updateChild(Le(t,".priority"),r)),n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vd(t,e){return OC(e,t)}function gx(t,e,n,r,i){F(r>t.lastWriteId,"Stacking an older write on top of newer ones"),i===void 0&&(i=!0),t.allWrites.push({path:e,snap:n,writeId:r,visible:i}),i&&(t.visibleWrites=ol(t.visibleWrites,e,n)),t.lastWriteId=r}function _x(t,e,n,r){F(r>t.lastWriteId,"Stacking an older merge on top of newer ones"),t.allWrites.push({path:e,children:n,writeId:r,visible:!0}),t.visibleWrites=Nm(t.visibleWrites,e,n),t.lastWriteId=r}function yx(t,e){for(let n=0;n<t.allWrites.length;n++){const r=t.allWrites[n];if(r.writeId===e)return r}return null}function vx(t,e){const n=t.allWrites.findIndex(a=>a.writeId===e);F(n>=0,"removeWrite called with nonexistent writeId.");const r=t.allWrites[n];t.allWrites.splice(n,1);let i=r.visible,s=!1,o=t.allWrites.length-1;for(;i&&o>=0;){const a=t.allWrites[o];a.visible&&(o>=n&&Ex(a,r.path)?i=!1:gn(r.path,a.path)&&(s=!0)),o--}if(i){if(s)return wx(t),!0;if(r.snap)t.visibleWrites=Aw(t.visibleWrites,r.path);else{const a=r.children;ht(a,u=>{t.visibleWrites=Aw(t.visibleWrites,Le(r.path,u))})}return!0}else return!1}function Ex(t,e){if(t.snap)return gn(t.path,e);for(const n in t.children)if(t.children.hasOwnProperty(n)&&gn(Le(t.path,n),e))return!0;return!1}function wx(t){t.visibleWrites=kC(t.allWrites,Ix,pe()),t.allWrites.length>0?t.lastWriteId=t.allWrites[t.allWrites.length-1].writeId:t.lastWriteId=-1}function Ix(t){return t.visible}function kC(t,e,n){let r=Fn.empty();for(let i=0;i<t.length;++i){const s=t[i];if(e(s)){const o=s.path;let a;if(s.snap)gn(n,o)?(a=bt(n,o),r=ol(r,a,s.snap)):gn(o,n)&&(a=bt(o,n),r=ol(r,pe(),s.snap.getChild(a)));else if(s.children){if(gn(n,o))a=bt(n,o),r=Nm(r,a,s.children);else if(gn(o,n))if(a=bt(o,n),ie(a))r=Nm(r,pe(),s.children);else{const u=ms(s.children,re(a));if(u){const c=u.getChild(we(a));r=ol(r,pe(),c)}}}else throw Qo("WriteRecord should have .snap or .children")}}return r}function NC(t,e,n,r,i){if(!r&&!i){const s=Ns(t.visibleWrites,e);if(s!=null)return s;{const o=gi(t.visibleWrites,e);if(Om(o))return n;if(n==null&&!Dm(o,pe()))return null;{const a=n||Y.EMPTY_NODE;return Vo(o,a)}}}else{const s=gi(t.visibleWrites,e);if(!i&&Om(s))return n;if(!i&&n==null&&!Dm(s,pe()))return null;{const o=function(c){return(c.visible||i)&&(!r||!~r.indexOf(c.writeId))&&(gn(c.path,e)||gn(e,c.path))},a=kC(t.allWrites,o,e),u=n||Y.EMPTY_NODE;return Vo(a,u)}}}function Tx(t,e,n){let r=Y.EMPTY_NODE;const i=Ns(t.visibleWrites,e);if(i)return i.isLeafNode()||i.forEachChild(Se,(s,o)=>{r=r.updateImmediateChild(s,o)}),r;if(n){const s=gi(t.visibleWrites,e);return n.forEachChild(Se,(o,a)=>{const u=Vo(gi(s,new ge(o)),a);r=r.updateImmediateChild(o,u)}),Rw(s).forEach(o=>{r=r.updateImmediateChild(o.name,o.node)}),r}else{const s=gi(t.visibleWrites,e);return Rw(s).forEach(o=>{r=r.updateImmediateChild(o.name,o.node)}),r}}function Sx(t,e,n,r,i){F(r||i,"Either existingEventSnap or existingServerSnap must exist");const s=Le(e,n);if(Dm(t.visibleWrites,s))return null;{const o=gi(t.visibleWrites,s);return Om(o)?i.getChild(n):Vo(o,i.getChild(n))}}function Cx(t,e,n,r){const i=Le(e,n),s=Ns(t.visibleWrites,i);if(s!=null)return s;if(r.isCompleteForChild(n)){const o=gi(t.visibleWrites,i);return Vo(o,r.getNode().getImmediateChild(n))}else return null}function Ax(t,e){return Ns(t.visibleWrites,e)}function Rx(t,e,n,r,i,s,o){let a;const u=gi(t.visibleWrites,e),c=Ns(u,pe());if(c!=null)a=c;else if(n!=null)a=Vo(u,n);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){const d=[],f=o.getCompare(),m=s?a.getReverseIteratorFrom(r,o):a.getIteratorFrom(r,o);let y=m.getNext();for(;y&&d.length<i;)f(y,r)!==0&&d.push(y),y=m.getNext();return d}else return[]}function Px(){return{visibleWrites:Fn.empty(),allWrites:[],lastWriteId:-1}}function Rh(t,e,n,r){return NC(t.writeTree,t.treePath,e,n,r)}function T_(t,e){return Tx(t.writeTree,t.treePath,e)}function Pw(t,e,n,r){return Sx(t.writeTree,t.treePath,e,n,r)}function Ph(t,e){return Ax(t.writeTree,Le(t.treePath,e))}function kx(t,e,n,r,i,s){return Rx(t.writeTree,t.treePath,e,n,r,i,s)}function S_(t,e,n){return Cx(t.writeTree,t.treePath,e,n)}function DC(t,e){return OC(Le(t.treePath,e),t.writeTree)}function OC(t,e){return{treePath:t,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nx{constructor(){this.changeMap=new Map}trackChildChange(e){const n=e.type,r=e.childName;F(n==="child_added"||n==="child_changed"||n==="child_removed","Only child changes supported for tracking"),F(r!==".priority","Only non-priority child changes can be tracked.");const i=this.changeMap.get(r);if(i){const s=i.type;if(n==="child_added"&&s==="child_removed")this.changeMap.set(r,Fl(r,e.snapshotNode,i.snapshotNode));else if(n==="child_removed"&&s==="child_added")this.changeMap.delete(r);else if(n==="child_removed"&&s==="child_changed")this.changeMap.set(r,Vl(r,i.oldSnap));else if(n==="child_changed"&&s==="child_added")this.changeMap.set(r,Lo(r,e.snapshotNode));else if(n==="child_changed"&&s==="child_changed")this.changeMap.set(r,Fl(r,e.snapshotNode,i.oldSnap));else throw Qo("Illegal combination of changes: "+e+" occurred after "+i)}else this.changeMap.set(r,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dx{getCompleteChild(e){return null}getChildAfterChild(e,n,r){return null}}const bC=new Dx;class C_{constructor(e,n,r=null){this.writes_=e,this.viewCache_=n,this.optCompleteServerCache_=r}getCompleteChild(e){const n=this.viewCache_.eventCache;if(n.isCompleteForChild(e))return n.getNode().getImmediateChild(e);{const r=this.optCompleteServerCache_!=null?new Ci(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return S_(this.writes_,e,r)}}getChildAfterChild(e,n,r){const i=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:ys(this.viewCache_),s=kx(this.writes_,i,n,1,r,e);return s.length===0?null:s[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ox(t){return{filter:t}}function bx(t,e){F(e.eventCache.getNode().isIndexed(t.filter.getIndex()),"Event snap not indexed"),F(e.serverCache.getNode().isIndexed(t.filter.getIndex()),"Server snap not indexed")}function xx(t,e,n,r,i){const s=new Nx;let o,a;if(n.type===bn.OVERWRITE){const c=n;c.source.fromUser?o=bm(t,e,c.path,c.snap,r,i,s):(F(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered()&&!ie(c.path),o=kh(t,e,c.path,c.snap,r,i,a,s))}else if(n.type===bn.MERGE){const c=n;c.source.fromUser?o=Mx(t,e,c.path,c.children,r,i,s):(F(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered(),o=xm(t,e,c.path,c.children,r,i,a,s))}else if(n.type===bn.ACK_USER_WRITE){const c=n;c.revert?o=Ux(t,e,c.path,r,i,s):o=Vx(t,e,c.path,c.affectedTree,r,i,s)}else if(n.type===bn.LISTEN_COMPLETE)o=Fx(t,e,n.path,r,s);else throw Qo("Unknown operation type: "+n.type);const u=s.getChanges();return Lx(e,o,u),{viewCache:o,changes:u}}function Lx(t,e,n){const r=e.eventCache;if(r.isFullyInitialized()){const i=r.getNode().isLeafNode()||r.getNode().isEmpty(),s=Ah(t);(n.length>0||!t.eventCache.isFullyInitialized()||i&&!r.getNode().equals(s)||!r.getNode().getPriority().equals(s.getPriority()))&&n.push(AC(Ah(e)))}}function xC(t,e,n,r,i,s){const o=e.eventCache;if(Ph(r,n)!=null)return e;{let a,u;if(ie(n))if(F(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const c=ys(e),d=c instanceof Y?c:Y.EMPTY_NODE,f=T_(r,d);a=t.filter.updateFullNode(e.eventCache.getNode(),f,s)}else{const c=Rh(r,ys(e));a=t.filter.updateFullNode(e.eventCache.getNode(),c,s)}else{const c=re(n);if(c===".priority"){F(Si(n)===1,"Can't have a priority with additional path components");const d=o.getNode();u=e.serverCache.getNode();const f=Pw(r,n,d,u);f!=null?a=t.filter.updatePriority(d,f):a=o.getNode()}else{const d=we(n);let f;if(o.isCompleteForChild(c)){u=e.serverCache.getNode();const m=Pw(r,n,o.getNode(),u);m!=null?f=o.getNode().getImmediateChild(c).updateChild(d,m):f=o.getNode().getImmediateChild(c)}else f=S_(r,c,e.serverCache);f!=null?a=t.filter.updateChild(o.getNode(),c,f,d,i,s):a=o.getNode()}}return sl(e,a,o.isFullyInitialized()||ie(n),t.filter.filtersNodes())}}function kh(t,e,n,r,i,s,o,a){const u=e.serverCache;let c;const d=o?t.filter:t.filter.getIndexedFilter();if(ie(n))c=d.updateFullNode(u.getNode(),r,null);else if(d.filtersNodes()&&!u.isFiltered()){const y=u.getNode().updateChild(n,r);c=d.updateFullNode(u.getNode(),y,null)}else{const y=re(n);if(!u.isCompleteForPath(n)&&Si(n)>1)return e;const C=we(n),b=u.getNode().getImmediateChild(y).updateChild(C,r);y===".priority"?c=d.updatePriority(u.getNode(),b):c=d.updateChild(u.getNode(),y,b,C,bC,null)}const f=RC(e,c,u.isFullyInitialized()||ie(n),d.filtersNodes()),m=new C_(i,f,s);return xC(t,f,n,i,m,a)}function bm(t,e,n,r,i,s,o){const a=e.eventCache;let u,c;const d=new C_(i,e,s);if(ie(n))c=t.filter.updateFullNode(e.eventCache.getNode(),r,o),u=sl(e,c,!0,t.filter.filtersNodes());else{const f=re(n);if(f===".priority")c=t.filter.updatePriority(e.eventCache.getNode(),r),u=sl(e,c,a.isFullyInitialized(),a.isFiltered());else{const m=we(n),y=a.getNode().getImmediateChild(f);let C;if(ie(m))C=r;else{const N=d.getCompleteChild(f);N!=null?d_(m)===".priority"&&N.getChild(vC(m)).isEmpty()?C=N:C=N.updateChild(m,r):C=Y.EMPTY_NODE}if(y.equals(C))u=e;else{const N=t.filter.updateChild(a.getNode(),f,C,m,d,o);u=sl(e,N,a.isFullyInitialized(),t.filter.filtersNodes())}}}return u}function kw(t,e){return t.eventCache.isCompleteForChild(e)}function Mx(t,e,n,r,i,s,o){let a=e;return r.foreach((u,c)=>{const d=Le(n,u);kw(e,re(d))&&(a=bm(t,a,d,c,i,s,o))}),r.foreach((u,c)=>{const d=Le(n,u);kw(e,re(d))||(a=bm(t,a,d,c,i,s,o))}),a}function Nw(t,e,n){return n.foreach((r,i)=>{e=e.updateChild(r,i)}),e}function xm(t,e,n,r,i,s,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let u=e,c;ie(n)?c=r:c=new Ie(null).setTree(n,r);const d=e.serverCache.getNode();return c.children.inorderTraversal((f,m)=>{if(d.hasChild(f)){const y=e.serverCache.getNode().getImmediateChild(f),C=Nw(t,y,m);u=kh(t,u,new ge(f),C,i,s,o,a)}}),c.children.inorderTraversal((f,m)=>{const y=!e.serverCache.isCompleteForChild(f)&&m.value===null;if(!d.hasChild(f)&&!y){const C=e.serverCache.getNode().getImmediateChild(f),N=Nw(t,C,m);u=kh(t,u,new ge(f),N,i,s,o,a)}}),u}function Vx(t,e,n,r,i,s,o){if(Ph(i,n)!=null)return e;const a=e.serverCache.isFiltered(),u=e.serverCache;if(r.value!=null){if(ie(n)&&u.isFullyInitialized()||u.isCompleteForPath(n))return kh(t,e,n,u.getNode().getChild(n),i,s,a,o);if(ie(n)){let c=new Ie(null);return u.getNode().forEachChild(nr,(d,f)=>{c=c.set(new ge(d),f)}),xm(t,e,n,c,i,s,a,o)}else return e}else{let c=new Ie(null);return r.foreach((d,f)=>{const m=Le(n,d);u.isCompleteForPath(m)&&(c=c.set(d,u.getNode().getChild(m)))}),xm(t,e,n,c,i,s,a,o)}}function Fx(t,e,n,r,i){const s=e.serverCache,o=RC(e,s.getNode(),s.isFullyInitialized()||ie(n),s.isFiltered());return xC(t,o,n,r,bC,i)}function Ux(t,e,n,r,i,s){let o;if(Ph(r,n)!=null)return e;{const a=new C_(r,e,i),u=e.eventCache.getNode();let c;if(ie(n)||re(n)===".priority"){let d;if(e.serverCache.isFullyInitialized())d=Rh(r,ys(e));else{const f=e.serverCache.getNode();F(f instanceof Y,"serverChildren would be complete if leaf node"),d=T_(r,f)}d=d,c=t.filter.updateFullNode(u,d,s)}else{const d=re(n);let f=S_(r,d,e.serverCache);f==null&&e.serverCache.isCompleteForChild(d)&&(f=u.getImmediateChild(d)),f!=null?c=t.filter.updateChild(u,d,f,we(n),a,s):e.eventCache.getNode().hasChild(d)?c=t.filter.updateChild(u,d,Y.EMPTY_NODE,we(n),a,s):c=u,c.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=Rh(r,ys(e)),o.isLeafNode()&&(c=t.filter.updateFullNode(c,o,s)))}return o=e.serverCache.isFullyInitialized()||Ph(r,pe())!=null,sl(e,c,o,t.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bx{constructor(e,n){this.query_=e,this.eventRegistrations_=[];const r=this.query_._queryParams,i=new y_(r.getIndex()),s=ex(r);this.processor_=Ox(s);const o=n.serverCache,a=n.eventCache,u=i.updateFullNode(Y.EMPTY_NODE,o.getNode(),null),c=s.updateFullNode(Y.EMPTY_NODE,a.getNode(),null),d=new Ci(u,o.isFullyInitialized(),i.filtersNodes()),f=new Ci(c,a.isFullyInitialized(),s.filtersNodes());this.viewCache_=yd(f,d),this.eventGenerator_=new hx(this.query_)}get query(){return this.query_}}function zx(t){return t.viewCache_.serverCache.getNode()}function jx(t){return Ah(t.viewCache_)}function Wx(t,e){const n=ys(t.viewCache_);return n&&(t.query._queryParams.loadsAllData()||!ie(e)&&!n.getImmediateChild(re(e)).isEmpty())?n.getChild(e):null}function Dw(t){return t.eventRegistrations_.length===0}function $x(t,e){t.eventRegistrations_.push(e)}function Ow(t,e,n){const r=[];if(n){F(e==null,"A cancel should cancel all event registrations.");const i=t.query._path;t.eventRegistrations_.forEach(s=>{const o=s.createCancelEvent(n,i);o&&r.push(o)})}if(e){let i=[];for(let s=0;s<t.eventRegistrations_.length;++s){const o=t.eventRegistrations_[s];if(!o.matches(e))i.push(o);else if(e.hasAnyCallback()){i=i.concat(t.eventRegistrations_.slice(s+1));break}}t.eventRegistrations_=i}else t.eventRegistrations_=[];return r}function bw(t,e,n,r){e.type===bn.MERGE&&e.source.queryId!==null&&(F(ys(t.viewCache_),"We should always have a full cache before handling merges"),F(Ah(t.viewCache_),"Missing event cache, even though we have a server cache"));const i=t.viewCache_,s=xx(t.processor_,i,e,n,r);return bx(t.processor_,s.viewCache),F(s.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),t.viewCache_=s.viewCache,LC(t,s.changes,s.viewCache.eventCache.getNode(),null)}function Hx(t,e){const n=t.viewCache_.eventCache,r=[];return n.getNode().isLeafNode()||n.getNode().forEachChild(Se,(s,o)=>{r.push(Lo(s,o))}),n.isFullyInitialized()&&r.push(AC(n.getNode())),LC(t,r,n.getNode(),e)}function LC(t,e,n,r){const i=r?[r]:t.eventRegistrations_;return dx(t.eventGenerator_,e,n,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Nh;class MC{constructor(){this.views=new Map}}function qx(t){F(!Nh,"__referenceConstructor has already been defined"),Nh=t}function Gx(){return F(Nh,"Reference.ts has not been loaded"),Nh}function Kx(t){return t.views.size===0}function A_(t,e,n,r){const i=e.source.queryId;if(i!==null){const s=t.views.get(i);return F(s!=null,"SyncTree gave us an op for an invalid query."),bw(s,e,n,r)}else{let s=[];for(const o of t.views.values())s=s.concat(bw(o,e,n,r));return s}}function VC(t,e,n,r,i){const s=e._queryIdentifier,o=t.views.get(s);if(!o){let a=Rh(n,i?r:null),u=!1;a?u=!0:r instanceof Y?(a=T_(n,r),u=!1):(a=Y.EMPTY_NODE,u=!1);const c=yd(new Ci(a,u,!1),new Ci(r,i,!1));return new Bx(e,c)}return o}function Qx(t,e,n,r,i,s){const o=VC(t,e,r,i,s);return t.views.has(e._queryIdentifier)||t.views.set(e._queryIdentifier,o),$x(o,n),Hx(o,n)}function Yx(t,e,n,r){const i=e._queryIdentifier,s=[];let o=[];const a=Ai(t);if(i==="default")for(const[u,c]of t.views.entries())o=o.concat(Ow(c,n,r)),Dw(c)&&(t.views.delete(u),c.query._queryParams.loadsAllData()||s.push(c.query));else{const u=t.views.get(i);u&&(o=o.concat(Ow(u,n,r)),Dw(u)&&(t.views.delete(i),u.query._queryParams.loadsAllData()||s.push(u.query)))}return a&&!Ai(t)&&s.push(new(Gx())(e._repo,e._path)),{removed:s,events:o}}function FC(t){const e=[];for(const n of t.views.values())n.query._queryParams.loadsAllData()||e.push(n);return e}function _i(t,e){let n=null;for(const r of t.views.values())n=n||Wx(r,e);return n}function UC(t,e){if(e._queryParams.loadsAllData())return Ed(t);{const r=e._queryIdentifier;return t.views.get(r)}}function BC(t,e){return UC(t,e)!=null}function Ai(t){return Ed(t)!=null}function Ed(t){for(const e of t.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Dh;function Xx(t){F(!Dh,"__referenceConstructor has already been defined"),Dh=t}function Jx(){return F(Dh,"Reference.ts has not been loaded"),Dh}let Zx=1;class xw{constructor(e){this.listenProvider_=e,this.syncPointTree_=new Ie(null),this.pendingWriteTree_=Px(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function R_(t,e,n,r,i){return gx(t.pendingWriteTree_,e,n,r,i),i?Jo(t,new _s(E_(),e,n)):[]}function eL(t,e,n,r){_x(t.pendingWriteTree_,e,n,r);const i=Ie.fromObject(n);return Jo(t,new Mo(E_(),e,i))}function ii(t,e,n=!1){const r=yx(t.pendingWriteTree_,e);if(vx(t.pendingWriteTree_,e)){let s=new Ie(null);return r.snap!=null?s=s.set(pe(),!0):ht(r.children,o=>{s=s.set(new ge(o),!0)}),Jo(t,new Ch(r.path,s,n))}else return[]}function hu(t,e,n){return Jo(t,new _s(w_(),e,n))}function tL(t,e,n){const r=Ie.fromObject(n);return Jo(t,new Mo(w_(),e,r))}function nL(t,e){return Jo(t,new Bl(w_(),e))}function rL(t,e,n){const r=P_(t,n);if(r){const i=k_(r),s=i.path,o=i.queryId,a=bt(s,e),u=new Bl(I_(o),a);return N_(t,s,u)}else return[]}function Oh(t,e,n,r,i=!1){const s=e._path,o=t.syncPointTree_.get(s);let a=[];if(o&&(e._queryIdentifier==="default"||BC(o,e))){const u=Yx(o,e,n,r);Kx(o)&&(t.syncPointTree_=t.syncPointTree_.remove(s));const c=u.removed;if(a=u.events,!i){const d=c.findIndex(m=>m._queryParams.loadsAllData())!==-1,f=t.syncPointTree_.findOnPath(s,(m,y)=>Ai(y));if(d&&!f){const m=t.syncPointTree_.subtree(s);if(!m.isEmpty()){const y=oL(m);for(let C=0;C<y.length;++C){const N=y[C],b=N.query,S=$C(t,N);t.listenProvider_.startListening(al(b),zl(t,b),S.hashFn,S.onComplete)}}}!f&&c.length>0&&!r&&(d?t.listenProvider_.stopListening(al(e),null):c.forEach(m=>{const y=t.queryToTagMap.get(Id(m));t.listenProvider_.stopListening(al(m),y)}))}aL(t,c)}return a}function zC(t,e,n,r){const i=P_(t,r);if(i!=null){const s=k_(i),o=s.path,a=s.queryId,u=bt(o,e),c=new _s(I_(a),u,n);return N_(t,o,c)}else return[]}function iL(t,e,n,r){const i=P_(t,r);if(i){const s=k_(i),o=s.path,a=s.queryId,u=bt(o,e),c=Ie.fromObject(n),d=new Mo(I_(a),u,c);return N_(t,o,d)}else return[]}function Lm(t,e,n,r=!1){const i=e._path;let s=null,o=!1;t.syncPointTree_.foreachOnPath(i,(m,y)=>{const C=bt(m,i);s=s||_i(y,C),o=o||Ai(y)});let a=t.syncPointTree_.get(i);a?(o=o||Ai(a),s=s||_i(a,pe())):(a=new MC,t.syncPointTree_=t.syncPointTree_.set(i,a));let u;s!=null?u=!0:(u=!1,s=Y.EMPTY_NODE,t.syncPointTree_.subtree(i).foreachChild((y,C)=>{const N=_i(C,pe());N&&(s=s.updateImmediateChild(y,N))}));const c=BC(a,e);if(!c&&!e._queryParams.loadsAllData()){const m=Id(e);F(!t.queryToTagMap.has(m),"View does not exist, but we have a tag");const y=lL();t.queryToTagMap.set(m,y),t.tagToQueryMap.set(y,m)}const d=vd(t.pendingWriteTree_,i);let f=Qx(a,e,n,d,s,u);if(!c&&!o&&!r){const m=UC(a,e);f=f.concat(uL(t,e,m))}return f}function wd(t,e,n){const i=t.pendingWriteTree_,s=t.syncPointTree_.findOnPath(e,(o,a)=>{const u=bt(o,e),c=_i(a,u);if(c)return c});return NC(i,e,s,n,!0)}function sL(t,e){const n=e._path;let r=null;t.syncPointTree_.foreachOnPath(n,(c,d)=>{const f=bt(c,n);r=r||_i(d,f)});let i=t.syncPointTree_.get(n);i?r=r||_i(i,pe()):(i=new MC,t.syncPointTree_=t.syncPointTree_.set(n,i));const s=r!=null,o=s?new Ci(r,!0,!1):null,a=vd(t.pendingWriteTree_,e._path),u=VC(i,e,a,s?o.getNode():Y.EMPTY_NODE,s);return jx(u)}function Jo(t,e){return jC(e,t.syncPointTree_,null,vd(t.pendingWriteTree_,pe()))}function jC(t,e,n,r){if(ie(t.path))return WC(t,e,n,r);{const i=e.get(pe());n==null&&i!=null&&(n=_i(i,pe()));let s=[];const o=re(t.path),a=t.operationForChild(o),u=e.children.get(o);if(u&&a){const c=n?n.getImmediateChild(o):null,d=DC(r,o);s=s.concat(jC(a,u,c,d))}return i&&(s=s.concat(A_(i,t,r,n))),s}}function WC(t,e,n,r){const i=e.get(pe());n==null&&i!=null&&(n=_i(i,pe()));let s=[];return e.children.inorderTraversal((o,a)=>{const u=n?n.getImmediateChild(o):null,c=DC(r,o),d=t.operationForChild(o);d&&(s=s.concat(WC(d,a,u,c)))}),i&&(s=s.concat(A_(i,t,r,n))),s}function $C(t,e){const n=e.query,r=zl(t,n);return{hashFn:()=>(zx(e)||Y.EMPTY_NODE).hash(),onComplete:i=>{if(i==="ok")return r?rL(t,n._path,r):nL(t,n._path);{const s=eb(i,n);return Oh(t,n,null,s)}}}}function zl(t,e){const n=Id(e);return t.queryToTagMap.get(n)}function Id(t){return t._path.toString()+"$"+t._queryIdentifier}function P_(t,e){return t.tagToQueryMap.get(e)}function k_(t){const e=t.indexOf("$");return F(e!==-1&&e<t.length-1,"Bad queryKey."),{queryId:t.substr(e+1),path:new ge(t.substr(0,e))}}function N_(t,e,n){const r=t.syncPointTree_.get(e);F(r,"Missing sync point for query tag that we're tracking");const i=vd(t.pendingWriteTree_,e);return A_(r,n,i,null)}function oL(t){return t.fold((e,n,r)=>{if(n&&Ai(n))return[Ed(n)];{let i=[];return n&&(i=FC(n)),ht(r,(s,o)=>{i=i.concat(o)}),i}})}function al(t){return t._queryParams.loadsAllData()&&!t._queryParams.isDefault()?new(Jx())(t._repo,t._path):t}function aL(t,e){for(let n=0;n<e.length;++n){const r=e[n];if(!r._queryParams.loadsAllData()){const i=Id(r),s=t.queryToTagMap.get(i);t.queryToTagMap.delete(i),t.tagToQueryMap.delete(s)}}}function lL(){return Zx++}function uL(t,e,n){const r=e._path,i=zl(t,e),s=$C(t,n),o=t.listenProvider_.startListening(al(e),i,s.hashFn,s.onComplete),a=t.syncPointTree_.subtree(r);if(i)F(!Ai(a.value),"If we're adding a query, it shouldn't be shadowed");else{const u=a.fold((c,d,f)=>{if(!ie(c)&&d&&Ai(d))return[Ed(d).query];{let m=[];return d&&(m=m.concat(FC(d).map(y=>y.query))),ht(f,(y,C)=>{m=m.concat(C)}),m}});for(let c=0;c<u.length;++c){const d=u[c];t.listenProvider_.stopListening(al(d),zl(t,d))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D_{constructor(e){this.node_=e}getImmediateChild(e){const n=this.node_.getImmediateChild(e);return new D_(n)}node(){return this.node_}}class O_{constructor(e,n){this.syncTree_=e,this.path_=n}getImmediateChild(e){const n=Le(this.path_,e);return new O_(this.syncTree_,n)}node(){return wd(this.syncTree_,this.path_)}}const cL=function(t){return t=t||{},t.timestamp=t.timestamp||new Date().getTime(),t},Lw=function(t,e,n){if(!t||typeof t!="object")return t;if(F(".sv"in t,"Unexpected leaf node or priority contents"),typeof t[".sv"]=="string")return hL(t[".sv"],e,n);if(typeof t[".sv"]=="object")return dL(t[".sv"],e);F(!1,"Unexpected server value: "+JSON.stringify(t,null,2))},hL=function(t,e,n){switch(t){case"timestamp":return n.timestamp;default:F(!1,"Unexpected server value: "+t)}},dL=function(t,e,n){t.hasOwnProperty("increment")||F(!1,"Unexpected server value: "+JSON.stringify(t,null,2));const r=t.increment;typeof r!="number"&&F(!1,"Unexpected increment value: "+r);const i=e.node();if(F(i!==null&&typeof i<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!i.isLeafNode())return r;const o=i.getValue();return typeof o!="number"?r:o+r},HC=function(t,e,n,r){return x_(e,new O_(n,t),r)},b_=function(t,e,n){return x_(t,new D_(e),n)};function x_(t,e,n){const r=t.getPriority().val(),i=Lw(r,e.getImmediateChild(".priority"),n);let s;if(t.isLeafNode()){const o=t,a=Lw(o.getValue(),e,n);return a!==o.getValue()||i!==o.getPriority().val()?new st(a,Fe(i)):t}else{const o=t;return s=o,i!==o.getPriority().val()&&(s=s.updatePriority(new st(i))),o.forEachChild(Se,(a,u)=>{const c=x_(u,e.getImmediateChild(a),n);c!==u&&(s=s.updateImmediateChild(a,c))}),s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L_{constructor(e="",n=null,r={children:{},childCount:0}){this.name=e,this.parent=n,this.node=r}}function Td(t,e){let n=e instanceof ge?e:new ge(e),r=t,i=re(n);for(;i!==null;){const s=ms(r.node.children,i)||{children:{},childCount:0};r=new L_(i,r,s),n=we(n),i=re(n)}return r}function Ds(t){return t.node.value}function M_(t,e){t.node.value=e,Mm(t)}function qC(t){return t.node.childCount>0}function fL(t){return Ds(t)===void 0&&!qC(t)}function Sd(t,e){ht(t.node.children,(n,r)=>{e(new L_(n,t,r))})}function GC(t,e,n,r){n&&!r&&e(t),Sd(t,i=>{GC(i,e,!0,r)}),n&&r&&e(t)}function pL(t,e,n){let r=n?t:t.parent;for(;r!==null;){if(e(r))return!0;r=r.parent}return!1}function du(t){return new ge(t.parent===null?t.name:du(t.parent)+"/"+t.name)}function Mm(t){t.parent!==null&&mL(t.parent,t.name,t)}function mL(t,e,n){const r=fL(n),i=Wn(t.node.children,e);r&&i?(delete t.node.children[e],t.node.childCount--,Mm(t)):!r&&!i&&(t.node.children[e]=n.node,t.node.childCount++,Mm(t))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gL=/[\[\].#$\/\u0000-\u001F\u007F]/,_L=/[\[\].#$\u0000-\u001F\u007F]/,sp=10*1024*1024,Cd=function(t){return typeof t=="string"&&t.length!==0&&!gL.test(t)},KC=function(t){return typeof t=="string"&&t.length!==0&&!_L.test(t)},yL=function(t){return t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),KC(t)},jl=function(t){return t===null||typeof t=="string"||typeof t=="number"&&!md(t)||t&&typeof t=="object"&&Wn(t,".sv")},lr=function(t,e,n,r){r&&e===void 0||fu(gs(t,"value"),e,n)},fu=function(t,e,n){const r=n instanceof ge?new xb(n,t):n;if(e===void 0)throw new Error(t+"contains undefined "+Yi(r));if(typeof e=="function")throw new Error(t+"contains a function "+Yi(r)+" with contents = "+e.toString());if(md(e))throw new Error(t+"contains "+e.toString()+" "+Yi(r));if(typeof e=="string"&&e.length>sp/3&&pd(e)>sp)throw new Error(t+"contains a string greater than "+sp+" utf8 bytes "+Yi(r)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let i=!1,s=!1;if(ht(e,(o,a)=>{if(o===".value")i=!0;else if(o!==".priority"&&o!==".sv"&&(s=!0,!Cd(o)))throw new Error(t+" contains an invalid key ("+o+") "+Yi(r)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);Lb(r,o),fu(t,a,r),Mb(r)}),i&&s)throw new Error(t+' contains ".value" child '+Yi(r)+" in addition to actual children.")}},vL=function(t,e){let n,r;for(n=0;n<e.length;n++){r=e[n];const s=Ml(r);for(let o=0;o<s.length;o++)if(!(s[o]===".priority"&&o===s.length-1)){if(!Cd(s[o]))throw new Error(t+"contains an invalid key ("+s[o]+") in path "+r.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(bb);let i=null;for(n=0;n<e.length;n++){if(r=e[n],i!==null&&gn(i,r))throw new Error(t+"contains a path "+i.toString()+" that is ancestor of another path "+r.toString());i=r}},QC=function(t,e,n,r){if(r&&e===void 0)return;const i=gs(t,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(i+" must be an object containing the children to replace.");const s=[];ht(e,(o,a)=>{const u=new ge(o);if(fu(i,a,Le(n,u)),d_(u)===".priority"&&!jl(a))throw new Error(i+"contains an invalid value for '"+u.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");s.push(u)}),vL(i,s)},V_=function(t,e,n){if(!(n&&e===void 0)){if(md(e))throw new Error(gs(t,"priority")+"is "+e.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!jl(e))throw new Error(gs(t,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")}},pu=function(t,e,n,r){if(!(r&&n===void 0)&&!Cd(n))throw new Error(gs(t,e)+'was an invalid key = "'+n+`".  Firebase keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]").`)},F_=function(t,e,n,r){if(!(r&&n===void 0)&&!KC(n))throw new Error(gs(t,e)+'was an invalid path = "'+n+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},EL=function(t,e,n,r){n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),F_(t,e,n,r)},Jn=function(t,e){if(re(e)===".info")throw new Error(t+" failed = Can't modify data under /.info/")},YC=function(t,e){const n=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Cd(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||n.length!==0&&!yL(n))throw new Error(gs(t,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wL{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Ad(t,e){let n=null;for(let r=0;r<e.length;r++){const i=e[r],s=i.getPath();n!==null&&!f_(s,n.path)&&(t.eventLists_.push(n),n=null),n===null&&(n={events:[],path:s}),n.events.push(i)}n&&t.eventLists_.push(n)}function XC(t,e,n){Ad(t,n),JC(t,r=>f_(r,e))}function rn(t,e,n){Ad(t,n),JC(t,r=>gn(r,e)||gn(e,r))}function JC(t,e){t.recursionDepth_++;let n=!0;for(let r=0;r<t.eventLists_.length;r++){const i=t.eventLists_[r];if(i){const s=i.path;e(s)?(IL(t.eventLists_[r]),t.eventLists_[r]=null):n=!1}}n&&(t.eventLists_=[]),t.recursionDepth_--}function IL(t){for(let e=0;e<t.events.length;e++){const n=t.events[e];if(n!==null){t.events[e]=null;const r=n.getEventRunner();as&&lt("event: "+n.toString()),Yo(r)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZC="repo_interrupt",TL=25;class SL{constructor(e,n,r,i){this.repoInfo_=e,this.forceRestClient_=n,this.authTokenProvider_=r,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new wL,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Sh(),this.transactionQueueTree_=new L_,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function CL(t,e,n){if(t.stats_=c_(t.repoInfo_),t.forceRestClient_||ib())t.server_=new Th(t.repoInfo_,(r,i,s,o)=>{Mw(t,r,i,s,o)},t.authTokenProvider_,t.appCheckProvider_),setTimeout(()=>Vw(t,!0),0);else{if(typeof n<"u"&&n!==null){if(typeof n!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{Ze(n)}catch(r){throw new Error("Invalid authOverride provided: "+r)}}t.persistentConnection_=new yn(t.repoInfo_,e,(r,i,s,o)=>{Mw(t,r,i,s,o)},r=>{Vw(t,r)},r=>{AL(t,r)},t.authTokenProvider_,t.appCheckProvider_,n),t.server_=t.persistentConnection_}t.authTokenProvider_.addTokenChangeListener(r=>{t.server_.refreshAuthToken(r)}),t.appCheckProvider_.addTokenChangeListener(r=>{t.server_.refreshAppCheckToken(r.token)}),t.statsReporter_=ub(t.repoInfo_,()=>new cx(t.stats_,t.server_)),t.infoData_=new sx,t.infoSyncTree_=new xw({startListening:(r,i,s,o)=>{let a=[];const u=t.infoData_.getNode(r._path);return u.isEmpty()||(a=hu(t.infoSyncTree_,r._path,u),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),U_(t,"connected",!1),t.serverSyncTree_=new xw({startListening:(r,i,s,o)=>(t.server_.listen(r,s,i,(a,u)=>{const c=o(a,u);rn(t.eventQueue_,r._path,c)}),[]),stopListening:(r,i)=>{t.server_.unlisten(r,i)}})}function eA(t){const n=t.infoData_.getNode(new ge(".info/serverTimeOffset")).val()||0;return new Date().getTime()+n}function mu(t){return cL({timestamp:eA(t)})}function Mw(t,e,n,r,i){t.dataUpdateCount++;const s=new ge(e);n=t.interceptServerDataCallback_?t.interceptServerDataCallback_(e,n):n;let o=[];if(i)if(r){const u=vh(n,c=>Fe(c));o=iL(t.serverSyncTree_,s,u,i)}else{const u=Fe(n);o=zC(t.serverSyncTree_,s,u,i)}else if(r){const u=vh(n,c=>Fe(c));o=tL(t.serverSyncTree_,s,u)}else{const u=Fe(n);o=hu(t.serverSyncTree_,s,u)}let a=s;o.length>0&&(a=Fo(t,s)),rn(t.eventQueue_,a,o)}function Vw(t,e){U_(t,"connected",e),e===!1&&kL(t)}function AL(t,e){ht(e,(n,r)=>{U_(t,n,r)})}function U_(t,e,n){const r=new ge("/.info/"+e),i=Fe(n);t.infoData_.updateSnapshot(r,i);const s=hu(t.infoSyncTree_,r,i);rn(t.eventQueue_,r,s)}function Rd(t){return t.nextWriteId_++}function RL(t,e,n){const r=sL(t.serverSyncTree_,e);return r!=null?Promise.resolve(r):t.server_.get(e).then(i=>{const s=Fe(i).withIndex(e._queryParams.getIndex());Lm(t.serverSyncTree_,e,n,!0);let o;if(e._queryParams.loadsAllData())o=hu(t.serverSyncTree_,e._path,s);else{const a=zl(t.serverSyncTree_,e);o=zC(t.serverSyncTree_,e._path,s,a)}return rn(t.eventQueue_,e._path,o),Oh(t.serverSyncTree_,e,n,null,!0),s},i=>(Zo(t,"get for query "+Ze(e)+" failed: "+i),Promise.reject(new Error(i))))}function B_(t,e,n,r,i){Zo(t,"set",{path:e.toString(),value:n,priority:r});const s=mu(t),o=Fe(n,r),a=wd(t.serverSyncTree_,e),u=b_(o,a,s),c=Rd(t),d=R_(t.serverSyncTree_,e,u,c,!0);Ad(t.eventQueue_,d),t.server_.put(e.toString(),o.val(!0),(m,y)=>{const C=m==="ok";C||Pt("set at "+e+" failed: "+m);const N=ii(t.serverSyncTree_,c,!C);rn(t.eventQueue_,e,N),Ri(t,i,m,y)});const f=j_(t,e);Fo(t,f),rn(t.eventQueue_,f,[])}function PL(t,e,n,r){Zo(t,"update",{path:e.toString(),value:n});let i=!0;const s=mu(t),o={};if(ht(n,(a,u)=>{i=!1,o[a]=HC(Le(e,a),Fe(u),t.serverSyncTree_,s)}),i)lt("update() called with empty data.  Don't do anything."),Ri(t,r,"ok",void 0);else{const a=Rd(t),u=eL(t.serverSyncTree_,e,o,a);Ad(t.eventQueue_,u),t.server_.merge(e.toString(),n,(c,d)=>{const f=c==="ok";f||Pt("update at "+e+" failed: "+c);const m=ii(t.serverSyncTree_,a,!f),y=m.length>0?Fo(t,e):e;rn(t.eventQueue_,y,m),Ri(t,r,c,d)}),ht(n,c=>{const d=j_(t,Le(e,c));Fo(t,d)}),rn(t.eventQueue_,e,[])}}function kL(t){Zo(t,"onDisconnectEvents");const e=mu(t),n=Sh();km(t.onDisconnect_,pe(),(i,s)=>{const o=HC(i,s,t.serverSyncTree_,e);Xo(n,i,o)});let r=[];km(n,pe(),(i,s)=>{r=r.concat(hu(t.serverSyncTree_,i,s));const o=j_(t,i);Fo(t,o)}),t.onDisconnect_=Sh(),rn(t.eventQueue_,pe(),r)}function NL(t,e,n){t.server_.onDisconnectCancel(e.toString(),(r,i)=>{r==="ok"&&Pm(t.onDisconnect_,e),Ri(t,n,r,i)})}function Fw(t,e,n,r){const i=Fe(n);t.server_.onDisconnectPut(e.toString(),i.val(!0),(s,o)=>{s==="ok"&&Xo(t.onDisconnect_,e,i),Ri(t,r,s,o)})}function DL(t,e,n,r,i){const s=Fe(n,r);t.server_.onDisconnectPut(e.toString(),s.val(!0),(o,a)=>{o==="ok"&&Xo(t.onDisconnect_,e,s),Ri(t,i,o,a)})}function OL(t,e,n,r){if(yh(n)){lt("onDisconnect().update() called with empty data.  Don't do anything."),Ri(t,r,"ok",void 0);return}t.server_.onDisconnectMerge(e.toString(),n,(i,s)=>{i==="ok"&&ht(n,(o,a)=>{const u=Fe(a);Xo(t.onDisconnect_,Le(e,o),u)}),Ri(t,r,i,s)})}function bL(t,e,n){let r;re(e._path)===".info"?r=Lm(t.infoSyncTree_,e,n):r=Lm(t.serverSyncTree_,e,n),XC(t.eventQueue_,e._path,r)}function Vm(t,e,n){let r;re(e._path)===".info"?r=Oh(t.infoSyncTree_,e,n):r=Oh(t.serverSyncTree_,e,n),XC(t.eventQueue_,e._path,r)}function tA(t){t.persistentConnection_&&t.persistentConnection_.interrupt(ZC)}function xL(t){t.persistentConnection_&&t.persistentConnection_.resume(ZC)}function Zo(t,...e){let n="";t.persistentConnection_&&(n=t.persistentConnection_.id+":"),lt(n,...e)}function Ri(t,e,n,r){e&&Yo(()=>{if(n==="ok")e(null);else{const i=(n||"error").toUpperCase();let s=i;r&&(s+=": "+r);const o=new Error(s);o.code=i,e(o)}})}function LL(t,e,n,r,i,s){Zo(t,"transaction on "+e);const o={path:e,update:n,onComplete:r,status:null,order:YS(),applyLocally:s,retryCount:0,unwatcher:i,abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null},a=z_(t,e,void 0);o.currentInputSnapshot=a;const u=o.update(a.val());if(u===void 0)o.unwatcher(),o.currentOutputSnapshotRaw=null,o.currentOutputSnapshotResolved=null,o.onComplete&&o.onComplete(null,!1,o.currentInputSnapshot);else{fu("transaction failed: Data returned ",u,o.path),o.status=0;const c=Td(t.transactionQueueTree_,e),d=Ds(c)||[];d.push(o),M_(c,d);let f;typeof u=="object"&&u!==null&&Wn(u,".priority")?(f=ms(u,".priority"),F(jl(f),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):f=(wd(t.serverSyncTree_,e)||Y.EMPTY_NODE).getPriority().val();const m=mu(t),y=Fe(u,f),C=b_(y,a,m);o.currentOutputSnapshotRaw=y,o.currentOutputSnapshotResolved=C,o.currentWriteId=Rd(t);const N=R_(t.serverSyncTree_,e,C,o.currentWriteId,o.applyLocally);rn(t.eventQueue_,e,N),Pd(t,t.transactionQueueTree_)}}function z_(t,e,n){return wd(t.serverSyncTree_,e,n)||Y.EMPTY_NODE}function Pd(t,e=t.transactionQueueTree_){if(e||kd(t,e),Ds(e)){const n=rA(t,e);F(n.length>0,"Sending zero length transaction queue"),n.every(i=>i.status===0)&&ML(t,du(e),n)}else qC(e)&&Sd(e,n=>{Pd(t,n)})}function ML(t,e,n){const r=n.map(c=>c.currentWriteId),i=z_(t,e,r);let s=i;const o=i.hash();for(let c=0;c<n.length;c++){const d=n[c];F(d.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),d.status=1,d.retryCount++;const f=bt(e,d.path);s=s.updateChild(f,d.currentOutputSnapshotRaw)}const a=s.val(!0),u=e;t.server_.put(u.toString(),a,c=>{Zo(t,"transaction put response",{path:u.toString(),status:c});let d=[];if(c==="ok"){const f=[];for(let m=0;m<n.length;m++)n[m].status=2,d=d.concat(ii(t.serverSyncTree_,n[m].currentWriteId)),n[m].onComplete&&f.push(()=>n[m].onComplete(null,!0,n[m].currentOutputSnapshotResolved)),n[m].unwatcher();kd(t,Td(t.transactionQueueTree_,e)),Pd(t,t.transactionQueueTree_),rn(t.eventQueue_,e,d);for(let m=0;m<f.length;m++)Yo(f[m])}else{if(c==="datastale")for(let f=0;f<n.length;f++)n[f].status===3?n[f].status=4:n[f].status=0;else{Pt("transaction at "+u.toString()+" failed: "+c);for(let f=0;f<n.length;f++)n[f].status=4,n[f].abortReason=c}Fo(t,e)}},o)}function Fo(t,e){const n=nA(t,e),r=du(n),i=rA(t,n);return VL(t,i,r),r}function VL(t,e,n){if(e.length===0)return;const r=[];let i=[];const o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){const u=e[a],c=bt(n,u.path);let d=!1,f;if(F(c!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),u.status===4)d=!0,f=u.abortReason,i=i.concat(ii(t.serverSyncTree_,u.currentWriteId,!0));else if(u.status===0)if(u.retryCount>=TL)d=!0,f="maxretry",i=i.concat(ii(t.serverSyncTree_,u.currentWriteId,!0));else{const m=z_(t,u.path,o);u.currentInputSnapshot=m;const y=e[a].update(m.val());if(y!==void 0){fu("transaction failed: Data returned ",y,u.path);let C=Fe(y);typeof y=="object"&&y!=null&&Wn(y,".priority")||(C=C.updatePriority(m.getPriority()));const b=u.currentWriteId,S=mu(t),v=b_(C,m,S);u.currentOutputSnapshotRaw=C,u.currentOutputSnapshotResolved=v,u.currentWriteId=Rd(t),o.splice(o.indexOf(b),1),i=i.concat(R_(t.serverSyncTree_,u.path,v,u.currentWriteId,u.applyLocally)),i=i.concat(ii(t.serverSyncTree_,b,!0))}else d=!0,f="nodata",i=i.concat(ii(t.serverSyncTree_,u.currentWriteId,!0))}rn(t.eventQueue_,n,i),i=[],d&&(e[a].status=2,function(m){setTimeout(m,Math.floor(0))}(e[a].unwatcher),e[a].onComplete&&(f==="nodata"?r.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):r.push(()=>e[a].onComplete(new Error(f),!1,null))))}kd(t,t.transactionQueueTree_);for(let a=0;a<r.length;a++)Yo(r[a]);Pd(t,t.transactionQueueTree_)}function nA(t,e){let n,r=t.transactionQueueTree_;for(n=re(e);n!==null&&Ds(r)===void 0;)r=Td(r,n),e=we(e),n=re(e);return r}function rA(t,e){const n=[];return iA(t,e,n),n.sort((r,i)=>r.order-i.order),n}function iA(t,e,n){const r=Ds(e);if(r)for(let i=0;i<r.length;i++)n.push(r[i]);Sd(e,i=>{iA(t,i,n)})}function kd(t,e){const n=Ds(e);if(n){let r=0;for(let i=0;i<n.length;i++)n[i].status!==2&&(n[r]=n[i],r++);n.length=r,M_(e,n.length>0?n:void 0)}Sd(e,r=>{kd(t,r)})}function j_(t,e){const n=du(nA(t,e)),r=Td(t.transactionQueueTree_,e);return pL(r,i=>{op(t,i)}),op(t,r),GC(r,i=>{op(t,i)}),n}function op(t,e){const n=Ds(e);if(n){const r=[];let i=[],s=-1;for(let o=0;o<n.length;o++)n[o].status===3||(n[o].status===1?(F(s===o-1,"All SENT items should be at beginning of queue."),s=o,n[o].status=3,n[o].abortReason="set"):(F(n[o].status===0,"Unexpected transaction status in abort"),n[o].unwatcher(),i=i.concat(ii(t.serverSyncTree_,n[o].currentWriteId,!0)),n[o].onComplete&&r.push(n[o].onComplete.bind(null,new Error("set"),!1,null))));s===-1?M_(e,void 0):n.length=s+1,rn(t.eventQueue_,du(e),i);for(let o=0;o<r.length;o++)Yo(r[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function FL(t){let e="";const n=t.split("/");for(let r=0;r<n.length;r++)if(n[r].length>0){let i=n[r];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch{}e+="/"+i}return e}function UL(t){const e={};t.charAt(0)==="?"&&(t=t.substring(1));for(const n of t.split("&")){if(n.length===0)continue;const r=n.split("=");r.length===2?e[decodeURIComponent(r[0])]=decodeURIComponent(r[1]):Pt(`Invalid query segment '${n}' in query '${t}'`)}return e}const Fm=function(t,e){const n=BL(t),r=n.namespace;n.domain==="firebase.com"&&ar(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!r||r==="undefined")&&n.domain!=="localhost"&&ar("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),n.secure||QO();const i=n.scheme==="ws"||n.scheme==="wss";return{repoInfo:new cC(n.host,n.secure,r,i,e,"",r!==n.subdomain),path:new ge(n.pathString)}},BL=function(t){let e="",n="",r="",i="",s="",o=!0,a="https",u=443;if(typeof t=="string"){let c=t.indexOf("//");c>=0&&(a=t.substring(0,c-1),t=t.substring(c+2));let d=t.indexOf("/");d===-1&&(d=t.length);let f=t.indexOf("?");f===-1&&(f=t.length),e=t.substring(0,Math.min(d,f)),d<f&&(i=FL(t.substring(d,f)));const m=UL(t.substring(Math.min(t.length,f)));c=e.indexOf(":"),c>=0?(o=a==="https"||a==="wss",u=parseInt(e.substring(c+1),10)):c=e.length;const y=e.slice(0,c);if(y.toLowerCase()==="localhost")n="localhost";else if(y.split(".").length<=2)n=y;else{const C=e.indexOf(".");r=e.substring(0,C).toLowerCase(),n=e.substring(C+1),s=r}"ns"in m&&(s=m.ns)}return{host:e,port:u,domain:n,subdomain:r,secure:o,scheme:a,pathString:i,namespace:s}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uw="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",zL=function(){let t=0;const e=[];return function(n){const r=n===t;t=n;let i;const s=new Array(8);for(i=7;i>=0;i--)s[i]=Uw.charAt(n%64),n=Math.floor(n/64);F(n===0,"Cannot push at time == 0");let o=s.join("");if(r){for(i=11;i>=0&&e[i]===63;i--)e[i]=0;e[i]++}else for(i=0;i<12;i++)e[i]=Math.floor(Math.random()*64);for(i=0;i<12;i++)o+=Uw.charAt(e[i]);return F(o.length===20,"nextPushId: Length should be 20."),o}}();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sA{constructor(e,n,r,i){this.eventType=e,this.eventRegistration=n,this.snapshot=r,this.prevName=i}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+Ze(this.snapshot.exportVal())}}class oA{constructor(e,n,r){this.eventRegistration=e,this.error=n,this.path=r}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W_{constructor(e,n){this.snapshotCallback=e,this.cancelCallback=n}onValue(e,n){this.snapshotCallback.call(null,e,n)}onCancel(e){return F(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jL{constructor(e,n){this._repo=e,this._path=n}cancel(){const e=new Jt;return NL(this._repo,this._path,e.wrapCallback(()=>{})),e.promise}remove(){Jn("OnDisconnect.remove",this._path);const e=new Jt;return Fw(this._repo,this._path,null,e.wrapCallback(()=>{})),e.promise}set(e){Jn("OnDisconnect.set",this._path),lr("OnDisconnect.set",e,this._path,!1);const n=new Jt;return Fw(this._repo,this._path,e,n.wrapCallback(()=>{})),n.promise}setWithPriority(e,n){Jn("OnDisconnect.setWithPriority",this._path),lr("OnDisconnect.setWithPriority",e,this._path,!1),V_("OnDisconnect.setWithPriority",n,!1);const r=new Jt;return DL(this._repo,this._path,e,n,r.wrapCallback(()=>{})),r.promise}update(e){Jn("OnDisconnect.update",this._path),QC("OnDisconnect.update",e,this._path,!1);const n=new Jt;return OL(this._repo,this._path,e,n.wrapCallback(()=>{})),n.promise}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class an{constructor(e,n,r,i){this._repo=e,this._path=n,this._queryParams=r,this._orderByCalled=i}get key(){return ie(this._path)?null:d_(this._path)}get ref(){return new $n(this._repo,this._path)}get _queryIdentifier(){const e=Sw(this._queryParams),n=l_(e);return n==="{}"?"default":n}get _queryObject(){return Sw(this._queryParams)}isEqual(e){if(e=q(e),!(e instanceof an))return!1;const n=this._repo===e._repo,r=f_(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return n&&r&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+Ob(this._path)}}function Nd(t,e){if(t._orderByCalled===!0)throw new Error(e+": You can't combine multiple orderBy calls.")}function Ui(t){let e=null,n=null;if(t.hasStart()&&(e=t.getIndexStartValue()),t.hasEnd()&&(n=t.getIndexEndValue()),t.getIndex()===nr){const r="Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().",i="Query: When ordering by key, the argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() must be a string.";if(t.hasStart()){if(t.getIndexStartName()!==Ti)throw new Error(r);if(typeof e!="string")throw new Error(i)}if(t.hasEnd()){if(t.getIndexEndName()!==Dr)throw new Error(r);if(typeof n!="string")throw new Error(i)}}else if(t.getIndex()===Se){if(e!=null&&!jl(e)||n!=null&&!jl(n))throw new Error("Query: When ordering by priority, the first argument passed to startAt(), startAfter() endAt(), endBefore(), or equalTo() must be a valid priority value (null, a number, or a string).")}else if(F(t.getIndex()instanceof g_||t.getIndex()===__,"unknown index type."),e!=null&&typeof e=="object"||n!=null&&typeof n=="object")throw new Error("Query: First argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() cannot be an object.")}function Dd(t){if(t.hasStart()&&t.hasEnd()&&t.hasLimit()&&!t.hasAnchoredLimit())throw new Error("Query: Can't combine startAt(), startAfter(), endAt(), endBefore(), and limit(). Use limitToFirst() or limitToLast() instead.")}class $n extends an{constructor(e,n){super(e,n,new v_,!1)}get parent(){const e=vC(this._path);return e===null?null:new $n(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class vs{constructor(e,n,r){this._node=e,this.ref=n,this._index=r}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const n=new ge(e),r=Uo(this.ref,e);return new vs(this._node.getChild(n),r,Se)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(r,i)=>e(new vs(i,Uo(this.ref,r),Se)))}hasChild(e){const n=new ge(e);return!this._node.getChild(n).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function WL(t,e){return t=q(t),t._checkNotDeleted("ref"),e!==void 0?Uo(t._root,e):t._root}function z6(t,e){t=q(t),t._checkNotDeleted("refFromURL");const n=Fm(e,t._repo.repoInfo_.nodeAdmin);YC("refFromURL",n);const r=n.repoInfo;return!t._repo.repoInfo_.isCustomHost()&&r.host!==t._repo.repoInfo_.host&&ar("refFromURL: Host name does not match the current database: (found "+r.host+" but expected "+t._repo.repoInfo_.host+")"),WL(t,n.path.toString())}function Uo(t,e){return t=q(t),re(t._path)===null?EL("child","path",e,!1):F_("child","path",e,!1),new $n(t._repo,Le(t._path,e))}function j6(t){return t=q(t),new jL(t._repo,t._path)}function W6(t,e){t=q(t),Jn("push",t._path),lr("push",e,t._path,!0);const n=eA(t._repo),r=zL(n),i=Uo(t,r),s=Uo(t,r);let o;return e!=null?o=aA(s,e).then(()=>s):o=Promise.resolve(s),i.then=o.then.bind(o),i.catch=o.then.bind(o,void 0),i}function $6(t){return Jn("remove",t._path),aA(t,null)}function aA(t,e){t=q(t),Jn("set",t._path),lr("set",e,t._path,!1);const n=new Jt;return B_(t._repo,t._path,e,null,n.wrapCallback(()=>{})),n.promise}function H6(t,e){t=q(t),Jn("setPriority",t._path),V_("setPriority",e,!1);const n=new Jt;return B_(t._repo,Le(t._path,".priority"),e,null,n.wrapCallback(()=>{})),n.promise}function q6(t,e,n){if(Jn("setWithPriority",t._path),lr("setWithPriority",e,t._path,!1),V_("setWithPriority",n,!1),t.key===".length"||t.key===".keys")throw"setWithPriority failed: "+t.key+" is a read-only object.";const r=new Jt;return B_(t._repo,t._path,e,n,r.wrapCallback(()=>{})),r.promise}function G6(t,e){QC("update",e,t._path,!1);const n=new Jt;return PL(t._repo,t._path,e,n.wrapCallback(()=>{})),n.promise}function K6(t){t=q(t);const e=new W_(()=>{}),n=new gu(e);return RL(t._repo,t,n).then(r=>new vs(r,new $n(t._repo,t._path),t._queryParams.getIndex()))}class gu{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,n){const r=n._queryParams.getIndex();return new sA("value",this,new vs(e.snapshotNode,new $n(n._repo,n._path),r))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,n){return this.callbackContext.hasCancelCallback?new oA(this,e,n):null}matches(e){return e instanceof gu?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}class Od{constructor(e,n){this.eventType=e,this.callbackContext=n}respondsTo(e){let n=e==="children_added"?"child_added":e;return n=n==="children_removed"?"child_removed":n,this.eventType===n}createCancelEvent(e,n){return this.callbackContext.hasCancelCallback?new oA(this,e,n):null}createEvent(e,n){F(e.childName!=null,"Child events should have a childName.");const r=Uo(new $n(n._repo,n._path),e.childName),i=n._queryParams.getIndex();return new sA(e.type,this,new vs(e.snapshotNode,r,i),e.prevName)}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,e.prevName)}matches(e){return e instanceof Od?this.eventType===e.eventType&&(!this.callbackContext||!e.callbackContext||this.callbackContext.matches(e.callbackContext)):!1}hasAnyCallback(){return!!this.callbackContext}}function _u(t,e,n,r,i){let s;if(typeof r=="object"&&(s=void 0,i=r),typeof r=="function"&&(s=r),i&&i.onlyOnce){const u=n,c=(d,f)=>{Vm(t._repo,t,a),u(d,f)};c.userCallback=n.userCallback,c.context=n.context,n=c}const o=new W_(n,s||void 0),a=e==="value"?new gu(o):new Od(e,o);return bL(t._repo,t,a),()=>Vm(t._repo,t,a)}function $L(t,e,n,r){return _u(t,"value",e,n,r)}function Q6(t,e,n,r){return _u(t,"child_added",e,n,r)}function Y6(t,e,n,r){return _u(t,"child_changed",e,n,r)}function X6(t,e,n,r){return _u(t,"child_moved",e,n,r)}function J6(t,e,n,r){return _u(t,"child_removed",e,n,r)}function Z6(t,e,n){let r=null;const i=n?new W_(n):null;e==="value"?r=new gu(i):e&&(r=new Od(e,i)),Vm(t._repo,t,r)}class Hn{}class lA extends Hn{constructor(e,n){super(),this._value=e,this._key=n,this.type="endAt"}_apply(e){lr("endAt",this._value,e._path,!0);const n=Rm(e._queryParams,this._value,this._key);if(Dd(n),Ui(n),e._queryParams.hasEnd())throw new Error("endAt: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new an(e._repo,e._path,n,e._orderByCalled)}}function e9(t,e){return pu("endAt","key",e,!0),new lA(t,e)}class HL extends Hn{constructor(e,n){super(),this._value=e,this._key=n,this.type="endBefore"}_apply(e){lr("endBefore",this._value,e._path,!1);const n=ix(e._queryParams,this._value,this._key);if(Dd(n),Ui(n),e._queryParams.hasEnd())throw new Error("endBefore: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new an(e._repo,e._path,n,e._orderByCalled)}}function t9(t,e){return pu("endBefore","key",e,!0),new HL(t,e)}class uA extends Hn{constructor(e,n){super(),this._value=e,this._key=n,this.type="startAt"}_apply(e){lr("startAt",this._value,e._path,!0);const n=Am(e._queryParams,this._value,this._key);if(Dd(n),Ui(n),e._queryParams.hasStart())throw new Error("startAt: Starting point was already set (by another call to startAt, startBefore or equalTo).");return new an(e._repo,e._path,n,e._orderByCalled)}}function n9(t=null,e){return pu("startAt","key",e,!0),new uA(t,e)}class qL extends Hn{constructor(e,n){super(),this._value=e,this._key=n,this.type="startAfter"}_apply(e){lr("startAfter",this._value,e._path,!1);const n=rx(e._queryParams,this._value,this._key);if(Dd(n),Ui(n),e._queryParams.hasStart())throw new Error("startAfter: Starting point was already set (by another call to startAt, startAfter, or equalTo).");return new an(e._repo,e._path,n,e._orderByCalled)}}function r9(t,e){return pu("startAfter","key",e,!0),new qL(t,e)}class GL extends Hn{constructor(e){super(),this._limit=e,this.type="limitToFirst"}_apply(e){if(e._queryParams.hasLimit())throw new Error("limitToFirst: Limit was already set (by another call to limitToFirst or limitToLast).");return new an(e._repo,e._path,tx(e._queryParams,this._limit),e._orderByCalled)}}function i9(t){if(typeof t!="number"||Math.floor(t)!==t||t<=0)throw new Error("limitToFirst: First argument must be a positive integer.");return new GL(t)}class KL extends Hn{constructor(e){super(),this._limit=e,this.type="limitToLast"}_apply(e){if(e._queryParams.hasLimit())throw new Error("limitToLast: Limit was already set (by another call to limitToFirst or limitToLast).");return new an(e._repo,e._path,nx(e._queryParams,this._limit),e._orderByCalled)}}function s9(t){if(typeof t!="number"||Math.floor(t)!==t||t<=0)throw new Error("limitToLast: First argument must be a positive integer.");return new KL(t)}class QL extends Hn{constructor(e){super(),this._path=e,this.type="orderByChild"}_apply(e){Nd(e,"orderByChild");const n=new ge(this._path);if(ie(n))throw new Error("orderByChild: cannot pass in empty path. Use orderByValue() instead.");const r=new g_(n),i=_d(e._queryParams,r);return Ui(i),new an(e._repo,e._path,i,!0)}}function o9(t){if(t==="$key")throw new Error('orderByChild: "$key" is invalid.  Use orderByKey() instead.');if(t==="$priority")throw new Error('orderByChild: "$priority" is invalid.  Use orderByPriority() instead.');if(t==="$value")throw new Error('orderByChild: "$value" is invalid.  Use orderByValue() instead.');return F_("orderByChild","path",t,!1),new QL(t)}class YL extends Hn{constructor(){super(...arguments),this.type="orderByKey"}_apply(e){Nd(e,"orderByKey");const n=_d(e._queryParams,nr);return Ui(n),new an(e._repo,e._path,n,!0)}}function a9(){return new YL}class XL extends Hn{constructor(){super(...arguments),this.type="orderByPriority"}_apply(e){Nd(e,"orderByPriority");const n=_d(e._queryParams,Se);return Ui(n),new an(e._repo,e._path,n,!0)}}function l9(){return new XL}class JL extends Hn{constructor(){super(...arguments),this.type="orderByValue"}_apply(e){Nd(e,"orderByValue");const n=_d(e._queryParams,__);return Ui(n),new an(e._repo,e._path,n,!0)}}function u9(){return new JL}class ZL extends Hn{constructor(e,n){super(),this._value=e,this._key=n,this.type="equalTo"}_apply(e){if(lr("equalTo",this._value,e._path,!1),e._queryParams.hasStart())throw new Error("equalTo: Starting point was already set (by another call to startAt/startAfter or equalTo).");if(e._queryParams.hasEnd())throw new Error("equalTo: Ending point was already set (by another call to endAt/endBefore or equalTo).");return new lA(this._value,this._key)._apply(new uA(this._value,this._key)._apply(e))}}function c9(t,e){return pu("equalTo","key",e,!0),new ZL(t,e)}function h9(t,...e){let n=q(t);for(const r of e)n=r._apply(n);return n}qx($n);Xx($n);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eM="FIREBASE_DATABASE_EMULATOR_HOST",Um={};let cA=!1;function tM(t,e,n,r){const i=e.lastIndexOf(":"),s=e.substring(0,i),o=Vi(s);t.repoInfo_=new cC(e,o,t.repoInfo_.namespace,t.repoInfo_.webSocketOnly,t.repoInfo_.nodeAdmin,t.repoInfo_.persistenceKey,t.repoInfo_.includeNamespaceInQueryParams,!0,n),r&&(t.authTokenProvider_=r)}function hA(t,e,n,r,i){let s=r||t.options.databaseURL;s===void 0&&(t.options.projectId||ar("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),lt("Using default host for project ",t.options.projectId),s=`${t.options.projectId}-default-rtdb.firebaseio.com`);let o=Fm(s,i),a=o.repoInfo,u,c;typeof process<"u"&&process.env&&(c=process.env[eM]),c?(u=!0,s=`http://${c}?ns=${a.namespace}`,o=Fm(s,i),a=o.repoInfo):u=!o.repoInfo.secure;const d=i&&u?new vo(vo.OWNER):new ob(t.name,t.options,e);YC("Invalid Firebase Database URL",o),ie(o.path)||ar("Database URL must point to the root of a Firebase Database (not including a child path).");const f=rM(a,t,d,new sb(t,n));return new sM(f,t)}function nM(t,e){const n=Um[e];(!n||n[t.key]!==t)&&ar(`Database ${e}(${t.repoInfo_}) has already been deleted.`),tA(t),delete n[t.key]}function rM(t,e,n,r){let i=Um[e.name];i||(i={},Um[e.name]=i);let s=i[t.toURLString()];return s&&ar("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),s=new SL(t,cA,n,r),i[t.toURLString()]=s,s}function iM(t){cA=t}class sM{constructor(e,n){this._repoInternal=e,this.app=n,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(CL(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new $n(this._repo,pe())),this._rootInternal}_delete(){return this._rootInternal!==null&&(nM(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&ar("Cannot call "+e+" on a deleted database.")}}function dA(){xo.IS_TRANSPORT_INITIALIZED&&Pt("Transport has already been initialized. Please call this function before calling ref or setting up a listener")}function d9(){dA(),ri.forceDisallow()}function f9(){dA(),dn.forceDisallow(),ri.forceAllow()}function oM(t=au(),e){const n=Fi(t,"database").getImmediate({identifier:e});if(!n._instanceStarted){const r=OS("database");r&&aM(n,...r)}return n}function aM(t,e,n,r={}){t=q(t),t._checkNotDeleted("useEmulator");const i=`${e}:${n}`,s=t._repoInternal;if(t._instanceStarted){if(i===t._repoInternal.repoInfo_.host&&kr(r,s.repoInfo_.emulatorOptions))return;ar("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(s.repoInfo_.nodeAdmin)r.mockUserToken&&ar('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new vo(vo.OWNER);else if(r.mockUserToken){const a=typeof r.mockUserToken=="string"?r.mockUserToken:LS(r.mockUserToken,t.app.options.projectId);o=new vo(a)}Vi(e)&&(t_(e),n_("Database",!0)),tM(s,i,r,o)}function p9(t){t=q(t),t._checkNotDeleted("goOffline"),tA(t._repo)}function m9(t){t=q(t),t._checkNotDeleted("goOnline"),xL(t._repo)}function g9(t,e){JS(t,e)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lM(t){KS(Ps),zn(new Gt("database",(e,{instanceIdentifier:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),s=e.getProvider("app-check-internal");return hA(r,i,s,n)},"PUBLIC").setMultipleInstances(!0)),Ht(aw,lw,t),Ht(aw,lw,"esm2020")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uM={".sv":"timestamp"};function _9(){return uM}function y9(t){return{".sv":{increment:t}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cM{constructor(e,n){this.committed=e,this.snapshot=n}toJSON(){return{committed:this.committed,snapshot:this.snapshot.toJSON()}}}function v9(t,e,n){if(t=q(t),Jn("Reference.transaction",t._path),t.key===".length"||t.key===".keys")throw"Reference.transaction failed: "+t.key+" is a read-only object.";const r=(n==null?void 0:n.applyLocally)??!0,i=new Jt,s=(a,u,c)=>{let d=null;a?i.reject(a):(d=new vs(c,new $n(t._repo,t._path),Se),i.resolve(new cM(u,d)))},o=$L(t,()=>{});return LL(t._repo,t._path,e,s,o,r),i.promise}yn.prototype.simpleListen=function(t,e){this.sendRequest("q",{p:t},e)};yn.prototype.echo=function(t,e){this.sendRequest("echo",{d:t},e)};const E9=function(t){const e=yn.prototype.put;return yn.prototype.put=function(n,r,i,s){s!==void 0&&(s=t()),e.call(this,n,r,i,s)},function(){yn.prototype.put=e}},w9=function(t){iM(t)};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function I9({app:t,url:e,version:n,customAuthImpl:r,customAppCheckImpl:i,nodeAdmin:s=!1}){KS(n);const o=new BS("database-standalone"),a=new gm("auth-internal",o);let u;return i&&(u=new gm("app-check-internal",o),u.setComponent(new Gt("app-check-internal",()=>i,"PRIVATE"))),a.setComponent(new Gt("auth-internal",()=>r,"PRIVATE")),hA(t,a,u,e,s)}lM();var Bw=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var yi,fA;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(w,_){function E(){}E.prototype=_.prototype,w.D=_.prototype,w.prototype=new E,w.prototype.constructor=w,w.C=function(T,R,k){for(var I=Array(arguments.length-2),Ft=2;Ft<arguments.length;Ft++)I[Ft-2]=arguments[Ft];return _.prototype[R].apply(T,I)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(w,_,E){E||(E=0);var T=Array(16);if(typeof _=="string")for(var R=0;16>R;++R)T[R]=_.charCodeAt(E++)|_.charCodeAt(E++)<<8|_.charCodeAt(E++)<<16|_.charCodeAt(E++)<<24;else for(R=0;16>R;++R)T[R]=_[E++]|_[E++]<<8|_[E++]<<16|_[E++]<<24;_=w.g[0],E=w.g[1],R=w.g[2];var k=w.g[3],I=_+(k^E&(R^k))+T[0]+3614090360&4294967295;_=E+(I<<7&4294967295|I>>>25),I=k+(R^_&(E^R))+T[1]+3905402710&4294967295,k=_+(I<<12&4294967295|I>>>20),I=R+(E^k&(_^E))+T[2]+606105819&4294967295,R=k+(I<<17&4294967295|I>>>15),I=E+(_^R&(k^_))+T[3]+3250441966&4294967295,E=R+(I<<22&4294967295|I>>>10),I=_+(k^E&(R^k))+T[4]+4118548399&4294967295,_=E+(I<<7&4294967295|I>>>25),I=k+(R^_&(E^R))+T[5]+1200080426&4294967295,k=_+(I<<12&4294967295|I>>>20),I=R+(E^k&(_^E))+T[6]+2821735955&4294967295,R=k+(I<<17&4294967295|I>>>15),I=E+(_^R&(k^_))+T[7]+4249261313&4294967295,E=R+(I<<22&4294967295|I>>>10),I=_+(k^E&(R^k))+T[8]+1770035416&4294967295,_=E+(I<<7&4294967295|I>>>25),I=k+(R^_&(E^R))+T[9]+2336552879&4294967295,k=_+(I<<12&4294967295|I>>>20),I=R+(E^k&(_^E))+T[10]+4294925233&4294967295,R=k+(I<<17&4294967295|I>>>15),I=E+(_^R&(k^_))+T[11]+2304563134&4294967295,E=R+(I<<22&4294967295|I>>>10),I=_+(k^E&(R^k))+T[12]+1804603682&4294967295,_=E+(I<<7&4294967295|I>>>25),I=k+(R^_&(E^R))+T[13]+4254626195&4294967295,k=_+(I<<12&4294967295|I>>>20),I=R+(E^k&(_^E))+T[14]+2792965006&4294967295,R=k+(I<<17&4294967295|I>>>15),I=E+(_^R&(k^_))+T[15]+1236535329&4294967295,E=R+(I<<22&4294967295|I>>>10),I=_+(R^k&(E^R))+T[1]+4129170786&4294967295,_=E+(I<<5&4294967295|I>>>27),I=k+(E^R&(_^E))+T[6]+3225465664&4294967295,k=_+(I<<9&4294967295|I>>>23),I=R+(_^E&(k^_))+T[11]+643717713&4294967295,R=k+(I<<14&4294967295|I>>>18),I=E+(k^_&(R^k))+T[0]+3921069994&4294967295,E=R+(I<<20&4294967295|I>>>12),I=_+(R^k&(E^R))+T[5]+3593408605&4294967295,_=E+(I<<5&4294967295|I>>>27),I=k+(E^R&(_^E))+T[10]+38016083&4294967295,k=_+(I<<9&4294967295|I>>>23),I=R+(_^E&(k^_))+T[15]+3634488961&4294967295,R=k+(I<<14&4294967295|I>>>18),I=E+(k^_&(R^k))+T[4]+3889429448&4294967295,E=R+(I<<20&4294967295|I>>>12),I=_+(R^k&(E^R))+T[9]+568446438&4294967295,_=E+(I<<5&4294967295|I>>>27),I=k+(E^R&(_^E))+T[14]+3275163606&4294967295,k=_+(I<<9&4294967295|I>>>23),I=R+(_^E&(k^_))+T[3]+4107603335&4294967295,R=k+(I<<14&4294967295|I>>>18),I=E+(k^_&(R^k))+T[8]+1163531501&4294967295,E=R+(I<<20&4294967295|I>>>12),I=_+(R^k&(E^R))+T[13]+2850285829&4294967295,_=E+(I<<5&4294967295|I>>>27),I=k+(E^R&(_^E))+T[2]+4243563512&4294967295,k=_+(I<<9&4294967295|I>>>23),I=R+(_^E&(k^_))+T[7]+1735328473&4294967295,R=k+(I<<14&4294967295|I>>>18),I=E+(k^_&(R^k))+T[12]+2368359562&4294967295,E=R+(I<<20&4294967295|I>>>12),I=_+(E^R^k)+T[5]+4294588738&4294967295,_=E+(I<<4&4294967295|I>>>28),I=k+(_^E^R)+T[8]+2272392833&4294967295,k=_+(I<<11&4294967295|I>>>21),I=R+(k^_^E)+T[11]+1839030562&4294967295,R=k+(I<<16&4294967295|I>>>16),I=E+(R^k^_)+T[14]+4259657740&4294967295,E=R+(I<<23&4294967295|I>>>9),I=_+(E^R^k)+T[1]+2763975236&4294967295,_=E+(I<<4&4294967295|I>>>28),I=k+(_^E^R)+T[4]+1272893353&4294967295,k=_+(I<<11&4294967295|I>>>21),I=R+(k^_^E)+T[7]+4139469664&4294967295,R=k+(I<<16&4294967295|I>>>16),I=E+(R^k^_)+T[10]+3200236656&4294967295,E=R+(I<<23&4294967295|I>>>9),I=_+(E^R^k)+T[13]+681279174&4294967295,_=E+(I<<4&4294967295|I>>>28),I=k+(_^E^R)+T[0]+3936430074&4294967295,k=_+(I<<11&4294967295|I>>>21),I=R+(k^_^E)+T[3]+3572445317&4294967295,R=k+(I<<16&4294967295|I>>>16),I=E+(R^k^_)+T[6]+76029189&4294967295,E=R+(I<<23&4294967295|I>>>9),I=_+(E^R^k)+T[9]+3654602809&4294967295,_=E+(I<<4&4294967295|I>>>28),I=k+(_^E^R)+T[12]+3873151461&4294967295,k=_+(I<<11&4294967295|I>>>21),I=R+(k^_^E)+T[15]+530742520&4294967295,R=k+(I<<16&4294967295|I>>>16),I=E+(R^k^_)+T[2]+3299628645&4294967295,E=R+(I<<23&4294967295|I>>>9),I=_+(R^(E|~k))+T[0]+4096336452&4294967295,_=E+(I<<6&4294967295|I>>>26),I=k+(E^(_|~R))+T[7]+1126891415&4294967295,k=_+(I<<10&4294967295|I>>>22),I=R+(_^(k|~E))+T[14]+2878612391&4294967295,R=k+(I<<15&4294967295|I>>>17),I=E+(k^(R|~_))+T[5]+4237533241&4294967295,E=R+(I<<21&4294967295|I>>>11),I=_+(R^(E|~k))+T[12]+1700485571&4294967295,_=E+(I<<6&4294967295|I>>>26),I=k+(E^(_|~R))+T[3]+2399980690&4294967295,k=_+(I<<10&4294967295|I>>>22),I=R+(_^(k|~E))+T[10]+4293915773&4294967295,R=k+(I<<15&4294967295|I>>>17),I=E+(k^(R|~_))+T[1]+2240044497&4294967295,E=R+(I<<21&4294967295|I>>>11),I=_+(R^(E|~k))+T[8]+1873313359&4294967295,_=E+(I<<6&4294967295|I>>>26),I=k+(E^(_|~R))+T[15]+4264355552&4294967295,k=_+(I<<10&4294967295|I>>>22),I=R+(_^(k|~E))+T[6]+2734768916&4294967295,R=k+(I<<15&4294967295|I>>>17),I=E+(k^(R|~_))+T[13]+1309151649&4294967295,E=R+(I<<21&4294967295|I>>>11),I=_+(R^(E|~k))+T[4]+4149444226&4294967295,_=E+(I<<6&4294967295|I>>>26),I=k+(E^(_|~R))+T[11]+3174756917&4294967295,k=_+(I<<10&4294967295|I>>>22),I=R+(_^(k|~E))+T[2]+718787259&4294967295,R=k+(I<<15&4294967295|I>>>17),I=E+(k^(R|~_))+T[9]+3951481745&4294967295,w.g[0]=w.g[0]+_&4294967295,w.g[1]=w.g[1]+(R+(I<<21&4294967295|I>>>11))&4294967295,w.g[2]=w.g[2]+R&4294967295,w.g[3]=w.g[3]+k&4294967295}r.prototype.u=function(w,_){_===void 0&&(_=w.length);for(var E=_-this.blockSize,T=this.B,R=this.h,k=0;k<_;){if(R==0)for(;k<=E;)i(this,w,k),k+=this.blockSize;if(typeof w=="string"){for(;k<_;)if(T[R++]=w.charCodeAt(k++),R==this.blockSize){i(this,T),R=0;break}}else for(;k<_;)if(T[R++]=w[k++],R==this.blockSize){i(this,T),R=0;break}}this.h=R,this.o+=_},r.prototype.v=function(){var w=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);w[0]=128;for(var _=1;_<w.length-8;++_)w[_]=0;var E=8*this.o;for(_=w.length-8;_<w.length;++_)w[_]=E&255,E/=256;for(this.u(w),w=Array(16),_=E=0;4>_;++_)for(var T=0;32>T;T+=8)w[E++]=this.g[_]>>>T&255;return w};function s(w,_){var E=a;return Object.prototype.hasOwnProperty.call(E,w)?E[w]:E[w]=_(w)}function o(w,_){this.h=_;for(var E=[],T=!0,R=w.length-1;0<=R;R--){var k=w[R]|0;T&&k==_||(E[R]=k,T=!1)}this.g=E}var a={};function u(w){return-128<=w&&128>w?s(w,function(_){return new o([_|0],0>_?-1:0)}):new o([w|0],0>w?-1:0)}function c(w){if(isNaN(w)||!isFinite(w))return f;if(0>w)return b(c(-w));for(var _=[],E=1,T=0;w>=E;T++)_[T]=w/E|0,E*=4294967296;return new o(_,0)}function d(w,_){if(w.length==0)throw Error("number format error: empty string");if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(w.charAt(0)=="-")return b(d(w.substring(1),_));if(0<=w.indexOf("-"))throw Error('number format error: interior "-" character');for(var E=c(Math.pow(_,8)),T=f,R=0;R<w.length;R+=8){var k=Math.min(8,w.length-R),I=parseInt(w.substring(R,R+k),_);8>k?(k=c(Math.pow(_,k)),T=T.j(k).add(c(I))):(T=T.j(E),T=T.add(c(I)))}return T}var f=u(0),m=u(1),y=u(16777216);t=o.prototype,t.m=function(){if(N(this))return-b(this).m();for(var w=0,_=1,E=0;E<this.g.length;E++){var T=this.i(E);w+=(0<=T?T:4294967296+T)*_,_*=4294967296}return w},t.toString=function(w){if(w=w||10,2>w||36<w)throw Error("radix out of range: "+w);if(C(this))return"0";if(N(this))return"-"+b(this).toString(w);for(var _=c(Math.pow(w,6)),E=this,T="";;){var R=O(E,_).g;E=S(E,R.j(_));var k=((0<E.g.length?E.g[0]:E.h)>>>0).toString(w);if(E=R,C(E))return k+T;for(;6>k.length;)k="0"+k;T=k+T}},t.i=function(w){return 0>w?0:w<this.g.length?this.g[w]:this.h};function C(w){if(w.h!=0)return!1;for(var _=0;_<w.g.length;_++)if(w.g[_]!=0)return!1;return!0}function N(w){return w.h==-1}t.l=function(w){return w=S(this,w),N(w)?-1:C(w)?0:1};function b(w){for(var _=w.g.length,E=[],T=0;T<_;T++)E[T]=~w.g[T];return new o(E,~w.h).add(m)}t.abs=function(){return N(this)?b(this):this},t.add=function(w){for(var _=Math.max(this.g.length,w.g.length),E=[],T=0,R=0;R<=_;R++){var k=T+(this.i(R)&65535)+(w.i(R)&65535),I=(k>>>16)+(this.i(R)>>>16)+(w.i(R)>>>16);T=I>>>16,k&=65535,I&=65535,E[R]=I<<16|k}return new o(E,E[E.length-1]&-2147483648?-1:0)};function S(w,_){return w.add(b(_))}t.j=function(w){if(C(this)||C(w))return f;if(N(this))return N(w)?b(this).j(b(w)):b(b(this).j(w));if(N(w))return b(this.j(b(w)));if(0>this.l(y)&&0>w.l(y))return c(this.m()*w.m());for(var _=this.g.length+w.g.length,E=[],T=0;T<2*_;T++)E[T]=0;for(T=0;T<this.g.length;T++)for(var R=0;R<w.g.length;R++){var k=this.i(T)>>>16,I=this.i(T)&65535,Ft=w.i(R)>>>16,hr=w.i(R)&65535;E[2*T+2*R]+=I*hr,v(E,2*T+2*R),E[2*T+2*R+1]+=k*hr,v(E,2*T+2*R+1),E[2*T+2*R+1]+=I*Ft,v(E,2*T+2*R+1),E[2*T+2*R+2]+=k*Ft,v(E,2*T+2*R+2)}for(T=0;T<_;T++)E[T]=E[2*T+1]<<16|E[2*T];for(T=_;T<2*_;T++)E[T]=0;return new o(E,0)};function v(w,_){for(;(w[_]&65535)!=w[_];)w[_+1]+=w[_]>>>16,w[_]&=65535,_++}function A(w,_){this.g=w,this.h=_}function O(w,_){if(C(_))throw Error("division by zero");if(C(w))return new A(f,f);if(N(w))return _=O(b(w),_),new A(b(_.g),b(_.h));if(N(_))return _=O(w,b(_)),new A(b(_.g),_.h);if(30<w.g.length){if(N(w)||N(_))throw Error("slowDivide_ only works with positive integers.");for(var E=m,T=_;0>=T.l(w);)E=j(E),T=j(T);var R=z(E,1),k=z(T,1);for(T=z(T,2),E=z(E,2);!C(T);){var I=k.add(T);0>=I.l(w)&&(R=R.add(E),k=I),T=z(T,1),E=z(E,1)}return _=S(w,R.j(_)),new A(R,_)}for(R=f;0<=w.l(_);){for(E=Math.max(1,Math.floor(w.m()/_.m())),T=Math.ceil(Math.log(E)/Math.LN2),T=48>=T?1:Math.pow(2,T-48),k=c(E),I=k.j(_);N(I)||0<I.l(w);)E-=T,k=c(E),I=k.j(_);C(k)&&(k=m),R=R.add(k),w=S(w,I)}return new A(R,w)}t.A=function(w){return O(this,w).h},t.and=function(w){for(var _=Math.max(this.g.length,w.g.length),E=[],T=0;T<_;T++)E[T]=this.i(T)&w.i(T);return new o(E,this.h&w.h)},t.or=function(w){for(var _=Math.max(this.g.length,w.g.length),E=[],T=0;T<_;T++)E[T]=this.i(T)|w.i(T);return new o(E,this.h|w.h)},t.xor=function(w){for(var _=Math.max(this.g.length,w.g.length),E=[],T=0;T<_;T++)E[T]=this.i(T)^w.i(T);return new o(E,this.h^w.h)};function j(w){for(var _=w.g.length+1,E=[],T=0;T<_;T++)E[T]=w.i(T)<<1|w.i(T-1)>>>31;return new o(E,w.h)}function z(w,_){var E=_>>5;_%=32;for(var T=w.g.length-E,R=[],k=0;k<T;k++)R[k]=0<_?w.i(k+E)>>>_|w.i(k+E+1)<<32-_:w.i(k+E);return new o(R,w.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,fA=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=c,o.fromString=d,yi=o}).apply(typeof Bw<"u"?Bw:typeof self<"u"?self:typeof window<"u"?window:{});var pc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var pA,ja,mA,Lc,Bm,gA,_A,yA;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(l,h,p){return l==Array.prototype||l==Object.prototype||(l[h]=p.value),l};function n(l){l=[typeof globalThis=="object"&&globalThis,l,typeof window=="object"&&window,typeof self=="object"&&self,typeof pc=="object"&&pc];for(var h=0;h<l.length;++h){var p=l[h];if(p&&p.Math==Math)return p}throw Error("Cannot find global object")}var r=n(this);function i(l,h){if(h)e:{var p=r;l=l.split(".");for(var g=0;g<l.length-1;g++){var P=l[g];if(!(P in p))break e;p=p[P]}l=l[l.length-1],g=p[l],h=h(g),h!=g&&h!=null&&e(p,l,{configurable:!0,writable:!0,value:h})}}function s(l,h){l instanceof String&&(l+="");var p=0,g=!1,P={next:function(){if(!g&&p<l.length){var D=p++;return{value:h(D,l[D]),done:!1}}return g=!0,{done:!0,value:void 0}}};return P[Symbol.iterator]=function(){return P},P}i("Array.prototype.values",function(l){return l||function(){return s(this,function(h,p){return p})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function u(l){var h=typeof l;return h=h!="object"?h:l?Array.isArray(l)?"array":h:"null",h=="array"||h=="object"&&typeof l.length=="number"}function c(l){var h=typeof l;return h=="object"&&l!=null||h=="function"}function d(l,h,p){return l.call.apply(l.bind,arguments)}function f(l,h,p){if(!l)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var P=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(P,g),l.apply(h,P)}}return function(){return l.apply(h,arguments)}}function m(l,h,p){return m=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:f,m.apply(null,arguments)}function y(l,h){var p=Array.prototype.slice.call(arguments,1);return function(){var g=p.slice();return g.push.apply(g,arguments),l.apply(this,g)}}function C(l,h){function p(){}p.prototype=h.prototype,l.aa=h.prototype,l.prototype=new p,l.prototype.constructor=l,l.Qb=function(g,P,D){for(var B=Array(arguments.length-2),Ee=2;Ee<arguments.length;Ee++)B[Ee-2]=arguments[Ee];return h.prototype[P].apply(g,B)}}function N(l){const h=l.length;if(0<h){const p=Array(h);for(let g=0;g<h;g++)p[g]=l[g];return p}return[]}function b(l,h){for(let p=1;p<arguments.length;p++){const g=arguments[p];if(u(g)){const P=l.length||0,D=g.length||0;l.length=P+D;for(let B=0;B<D;B++)l[P+B]=g[B]}else l.push(g)}}class S{constructor(h,p){this.i=h,this.j=p,this.h=0,this.g=null}get(){let h;return 0<this.h?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function v(l){return/^[\s\xa0]*$/.test(l)}function A(){var l=a.navigator;return l&&(l=l.userAgent)?l:""}function O(l){return O[" "](l),l}O[" "]=function(){};var j=A().indexOf("Gecko")!=-1&&!(A().toLowerCase().indexOf("webkit")!=-1&&A().indexOf("Edge")==-1)&&!(A().indexOf("Trident")!=-1||A().indexOf("MSIE")!=-1)&&A().indexOf("Edge")==-1;function z(l,h,p){for(const g in l)h.call(p,l[g],g,l)}function w(l,h){for(const p in l)h.call(void 0,l[p],p,l)}function _(l){const h={};for(const p in l)h[p]=l[p];return h}const E="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function T(l,h){let p,g;for(let P=1;P<arguments.length;P++){g=arguments[P];for(p in g)l[p]=g[p];for(let D=0;D<E.length;D++)p=E[D],Object.prototype.hasOwnProperty.call(g,p)&&(l[p]=g[p])}}function R(l){var h=1;l=l.split(":");const p=[];for(;0<h&&l.length;)p.push(l.shift()),h--;return l.length&&p.push(l.join(":")),p}function k(l){a.setTimeout(()=>{throw l},0)}function I(){var l=Z;let h=null;return l.g&&(h=l.g,l.g=l.g.next,l.g||(l.h=null),h.next=null),h}class Ft{constructor(){this.h=this.g=null}add(h,p){const g=hr.get();g.set(h,p),this.h?this.h.next=g:this.g=g,this.h=g}}var hr=new S(()=>new Bi,l=>l.reset());class Bi{constructor(){this.next=this.g=this.h=null}set(h,p){this.h=h,this.g=p,this.next=null}reset(){this.next=this.g=this.h=null}}let In,W=!1,Z=new Ft,ne=()=>{const l=a.Promise.resolve(void 0);In=()=>{l.then(Ce)}};var Ce=()=>{for(var l;l=I();){try{l.h.call(l.g)}catch(p){k(p)}var h=hr;h.j(l),100>h.h&&(h.h++,l.next=h.g,h.g=l)}W=!1};function _e(){this.s=this.s,this.C=this.C}_e.prototype.s=!1,_e.prototype.ma=function(){this.s||(this.s=!0,this.N())},_e.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Me(l,h){this.type=l,this.g=this.target=h,this.defaultPrevented=!1}Me.prototype.h=function(){this.defaultPrevented=!0};var Tn=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var l=!1,h=Object.defineProperty({},"passive",{get:function(){l=!0}});try{const p=()=>{};a.addEventListener("test",p,h),a.removeEventListener("test",p,h)}catch{}return l}();function Sn(l,h){if(Me.call(this,l?l.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,l){var p=this.type=l.type,g=l.changedTouches&&l.changedTouches.length?l.changedTouches[0]:null;if(this.target=l.target||l.srcElement,this.g=h,h=l.relatedTarget){if(j){e:{try{O(h.nodeName);var P=!0;break e}catch{}P=!1}P||(h=null)}}else p=="mouseover"?h=l.fromElement:p=="mouseout"&&(h=l.toElement);this.relatedTarget=h,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0),this.button=l.button,this.key=l.key||"",this.ctrlKey=l.ctrlKey,this.altKey=l.altKey,this.shiftKey=l.shiftKey,this.metaKey=l.metaKey,this.pointerId=l.pointerId||0,this.pointerType=typeof l.pointerType=="string"?l.pointerType:Cn[l.pointerType]||"",this.state=l.state,this.i=l,l.defaultPrevented&&Sn.aa.h.call(this)}}C(Sn,Me);var Cn={2:"touch",3:"pen",4:"mouse"};Sn.prototype.h=function(){Sn.aa.h.call(this);var l=this.i;l.preventDefault?l.preventDefault():l.returnValue=!1};var ln="closure_listenable_"+(1e6*Math.random()|0),sf=0;function ku(l,h,p,g,P){this.listener=l,this.proxy=null,this.src=h,this.type=p,this.capture=!!g,this.ha=P,this.key=++sf,this.da=this.fa=!1}function aa(l){l.da=!0,l.listener=null,l.proxy=null,l.src=null,l.ha=null}function Fs(l){this.src=l,this.g={},this.h=0}Fs.prototype.add=function(l,h,p,g,P){var D=l.toString();l=this.g[D],l||(l=this.g[D]=[],this.h++);var B=U(l,h,g,P);return-1<B?(h=l[B],p||(h.fa=!1)):(h=new ku(h,this.src,D,!!g,P),h.fa=p,l.push(h)),h};function la(l,h){var p=h.type;if(p in l.g){var g=l.g[p],P=Array.prototype.indexOf.call(g,h,void 0),D;(D=0<=P)&&Array.prototype.splice.call(g,P,1),D&&(aa(h),l.g[p].length==0&&(delete l.g[p],l.h--))}}function U(l,h,p,g){for(var P=0;P<l.length;++P){var D=l[P];if(!D.da&&D.listener==h&&D.capture==!!p&&D.ha==g)return P}return-1}var X="closure_lm_"+(1e6*Math.random()|0),K={};function vt(l,h,p,g,P){if(g&&g.once)return zr(l,h,p,g,P);if(Array.isArray(h)){for(var D=0;D<h.length;D++)vt(l,h[D],p,g,P);return null}return p=zs(p),l&&l[ln]?l.K(h,p,c(g)?!!g.capture:!!g,P):un(l,h,p,!1,g,P)}function un(l,h,p,g,P,D){if(!h)throw Error("Invalid event type");var B=c(P)?!!P.capture:!!P,Ee=Us(l);if(Ee||(l[X]=Ee=new Fs(l)),p=Ee.add(h,p,g,B,D),p.proxy)return p;if(g=qn(),p.proxy=g,g.src=l,g.listener=p,l.addEventListener)Tn||(P=B),P===void 0&&(P=!1),l.addEventListener(h.toString(),g,P);else if(l.attachEvent)l.attachEvent(zi(h.toString()),g);else if(l.addListener&&l.removeListener)l.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return p}function qn(){function l(p){return h.call(l.src,l.listener,p)}const h=Nu;return l}function zr(l,h,p,g,P){if(Array.isArray(h)){for(var D=0;D<h.length;D++)zr(l,h[D],p,g,P);return null}return p=zs(p),l&&l[ln]?l.L(h,p,c(g)?!!g.capture:!!g,P):un(l,h,p,!0,g,P)}function An(l,h,p,g,P){if(Array.isArray(h))for(var D=0;D<h.length;D++)An(l,h[D],p,g,P);else g=c(g)?!!g.capture:!!g,p=zs(p),l&&l[ln]?(l=l.i,h=String(h).toString(),h in l.g&&(D=l.g[h],p=U(D,p,g,P),-1<p&&(aa(D[p]),Array.prototype.splice.call(D,p,1),D.length==0&&(delete l.g[h],l.h--)))):l&&(l=Us(l))&&(h=l.g[h.toString()],l=-1,h&&(l=U(h,p,g,P)),(p=-1<l?h[l]:null)&&Rn(p))}function Rn(l){if(typeof l!="number"&&l&&!l.da){var h=l.src;if(h&&h[ln])la(h.i,l);else{var p=l.type,g=l.proxy;h.removeEventListener?h.removeEventListener(p,g,l.capture):h.detachEvent?h.detachEvent(zi(p),g):h.addListener&&h.removeListener&&h.removeListener(g),(p=Us(h))?(la(p,l),p.h==0&&(p.src=null,h[X]=null)):aa(l)}}}function zi(l){return l in K?K[l]:K[l]="on"+l}function Nu(l,h){if(l.da)l=!0;else{h=new Sn(h,this);var p=l.listener,g=l.ha||l.src;l.fa&&Rn(l),l=p.call(g,h)}return l}function Us(l){return l=l[X],l instanceof Fs?l:null}var Bs="__closure_events_fn_"+(1e9*Math.random()>>>0);function zs(l){return typeof l=="function"?l:(l[Bs]||(l[Bs]=function(h){return l.handleEvent(h)}),l[Bs])}function Xe(){_e.call(this),this.i=new Fs(this),this.M=this,this.F=null}C(Xe,_e),Xe.prototype[ln]=!0,Xe.prototype.removeEventListener=function(l,h,p,g){An(this,l,h,p,g)};function it(l,h){var p,g=l.F;if(g)for(p=[];g;g=g.F)p.push(g);if(l=l.M,g=h.type||h,typeof h=="string")h=new Me(h,l);else if(h instanceof Me)h.target=h.target||l;else{var P=h;h=new Me(g,l),T(h,P)}if(P=!0,p)for(var D=p.length-1;0<=D;D--){var B=h.g=p[D];P=ji(B,g,!0,h)&&P}if(B=h.g=l,P=ji(B,g,!0,h)&&P,P=ji(B,g,!1,h)&&P,p)for(D=0;D<p.length;D++)B=h.g=p[D],P=ji(B,g,!1,h)&&P}Xe.prototype.N=function(){if(Xe.aa.N.call(this),this.i){var l=this.i,h;for(h in l.g){for(var p=l.g[h],g=0;g<p.length;g++)aa(p[g]);delete l.g[h],l.h--}}this.F=null},Xe.prototype.K=function(l,h,p,g){return this.i.add(String(l),h,!1,p,g)},Xe.prototype.L=function(l,h,p,g){return this.i.add(String(l),h,!0,p,g)};function ji(l,h,p,g){if(h=l.i.g[String(h)],!h)return!0;h=h.concat();for(var P=!0,D=0;D<h.length;++D){var B=h[D];if(B&&!B.da&&B.capture==p){var Ee=B.listener,dt=B.ha||B.src;B.fa&&la(l.i,B),P=Ee.call(dt,g)!==!1&&P}}return P&&!g.defaultPrevented}function Du(l,h,p){if(typeof l=="function")p&&(l=m(l,p));else if(l&&typeof l.handleEvent=="function")l=m(l.handleEvent,l);else throw Error("Invalid listener argument");return 2147483647<Number(h)?-1:a.setTimeout(l,h||0)}function Ou(l){l.g=Du(()=>{l.g=null,l.i&&(l.i=!1,Ou(l))},l.l);const h=l.h;l.h=null,l.m.apply(null,h)}class of extends _e{constructor(h,p){super(),this.m=h,this.l=p,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:Ou(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ve(l){_e.call(this),this.h=l,this.g={}}C(ve,_e);var dr=[];function bu(l){z(l.g,function(h,p){this.g.hasOwnProperty(p)&&Rn(h)},l),l.g={}}ve.prototype.N=function(){ve.aa.N.call(this),bu(this)},ve.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var af=a.JSON.stringify,uP=a.JSON.parse,cP=class{stringify(l){return a.JSON.stringify(l,void 0)}parse(l){return a.JSON.parse(l,void 0)}};function lf(){}lf.prototype.h=null;function Ky(l){return l.h||(l.h=l.i())}function Qy(){}var ua={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function uf(){Me.call(this,"d")}C(uf,Me);function cf(){Me.call(this,"c")}C(cf,Me);var Wi={},Yy=null;function xu(){return Yy=Yy||new Xe}Wi.La="serverreachability";function Xy(l){Me.call(this,Wi.La,l)}C(Xy,Me);function ca(l){const h=xu();it(h,new Xy(h))}Wi.STAT_EVENT="statevent";function Jy(l,h){Me.call(this,Wi.STAT_EVENT,l),this.stat=h}C(Jy,Me);function Dt(l){const h=xu();it(h,new Jy(h,l))}Wi.Ma="timingevent";function Zy(l,h){Me.call(this,Wi.Ma,l),this.size=h}C(Zy,Me);function ha(l,h){if(typeof l!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){l()},h)}function da(){this.g=!0}da.prototype.xa=function(){this.g=!1};function hP(l,h,p,g,P,D){l.info(function(){if(l.g)if(D)for(var B="",Ee=D.split("&"),dt=0;dt<Ee.length;dt++){var fe=Ee[dt].split("=");if(1<fe.length){var Et=fe[0];fe=fe[1];var wt=Et.split("_");B=2<=wt.length&&wt[1]=="type"?B+(Et+"="+fe+"&"):B+(Et+"=redacted&")}}else B=null;else B=D;return"XMLHTTP REQ ("+g+") [attempt "+P+"]: "+h+`
`+p+`
`+B})}function dP(l,h,p,g,P,D,B){l.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+P+"]: "+h+`
`+p+`
`+D+" "+B})}function js(l,h,p,g){l.info(function(){return"XMLHTTP TEXT ("+h+"): "+pP(l,p)+(g?" "+g:"")})}function fP(l,h){l.info(function(){return"TIMEOUT: "+h})}da.prototype.info=function(){};function pP(l,h){if(!l.g)return h;if(!h)return null;try{var p=JSON.parse(h);if(p){for(l=0;l<p.length;l++)if(Array.isArray(p[l])){var g=p[l];if(!(2>g.length)){var P=g[1];if(Array.isArray(P)&&!(1>P.length)){var D=P[0];if(D!="noop"&&D!="stop"&&D!="close")for(var B=1;B<P.length;B++)P[B]=""}}}}return af(p)}catch{return h}}var Lu={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},ev={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},hf;function Mu(){}C(Mu,lf),Mu.prototype.g=function(){return new XMLHttpRequest},Mu.prototype.i=function(){return{}},hf=new Mu;function jr(l,h,p,g){this.j=l,this.i=h,this.l=p,this.R=g||1,this.U=new ve(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new tv}function tv(){this.i=null,this.g="",this.h=!1}var nv={},df={};function ff(l,h,p){l.L=1,l.v=Bu(fr(h)),l.m=p,l.P=!0,rv(l,null)}function rv(l,h){l.F=Date.now(),Vu(l),l.A=fr(l.v);var p=l.A,g=l.R;Array.isArray(g)||(g=[String(g)]),_v(p.i,"t",g),l.C=0,p=l.j.J,l.h=new tv,l.g=Lv(l.j,p?h:null,!l.m),0<l.O&&(l.M=new of(m(l.Y,l,l.g),l.O)),h=l.U,p=l.g,g=l.ca;var P="readystatechange";Array.isArray(P)||(P&&(dr[0]=P.toString()),P=dr);for(var D=0;D<P.length;D++){var B=vt(p,P[D],g||h.handleEvent,!1,h.h||h);if(!B)break;h.g[B.key]=B}h=l.H?_(l.H):{},l.m?(l.u||(l.u="POST"),h["Content-Type"]="application/x-www-form-urlencoded",l.g.ea(l.A,l.u,l.m,h)):(l.u="GET",l.g.ea(l.A,l.u,null,h)),ca(),hP(l.i,l.u,l.A,l.l,l.R,l.m)}jr.prototype.ca=function(l){l=l.target;const h=this.M;h&&pr(l)==3?h.j():this.Y(l)},jr.prototype.Y=function(l){try{if(l==this.g)e:{const wt=pr(this.g);var h=this.g.Ba();const Hs=this.g.Z();if(!(3>wt)&&(wt!=3||this.g&&(this.h.h||this.g.oa()||Sv(this.g)))){this.J||wt!=4||h==7||(h==8||0>=Hs?ca(3):ca(2)),pf(this);var p=this.g.Z();this.X=p;t:if(iv(this)){var g=Sv(this.g);l="";var P=g.length,D=pr(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){$i(this),fa(this);var B="";break t}this.h.i=new a.TextDecoder}for(h=0;h<P;h++)this.h.h=!0,l+=this.h.i.decode(g[h],{stream:!(D&&h==P-1)});g.length=0,this.h.g+=l,this.C=0,B=this.h.g}else B=this.g.oa();if(this.o=p==200,dP(this.i,this.u,this.A,this.l,this.R,wt,p),this.o){if(this.T&&!this.K){t:{if(this.g){var Ee,dt=this.g;if((Ee=dt.g?dt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!v(Ee)){var fe=Ee;break t}}fe=null}if(p=fe)js(this.i,this.l,p,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,mf(this,p);else{this.o=!1,this.s=3,Dt(12),$i(this),fa(this);break e}}if(this.P){p=!0;let Pn;for(;!this.J&&this.C<B.length;)if(Pn=mP(this,B),Pn==df){wt==4&&(this.s=4,Dt(14),p=!1),js(this.i,this.l,null,"[Incomplete Response]");break}else if(Pn==nv){this.s=4,Dt(15),js(this.i,this.l,B,"[Invalid Chunk]"),p=!1;break}else js(this.i,this.l,Pn,null),mf(this,Pn);if(iv(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),wt!=4||B.length!=0||this.h.h||(this.s=1,Dt(16),p=!1),this.o=this.o&&p,!p)js(this.i,this.l,B,"[Invalid Chunked Response]"),$i(this),fa(this);else if(0<B.length&&!this.W){this.W=!0;var Et=this.j;Et.g==this&&Et.ba&&!Et.M&&(Et.j.info("Great, no buffering proxy detected. Bytes received: "+B.length),wf(Et),Et.M=!0,Dt(11))}}else js(this.i,this.l,B,null),mf(this,B);wt==4&&$i(this),this.o&&!this.J&&(wt==4?Dv(this.j,this):(this.o=!1,Vu(this)))}else OP(this.g),p==400&&0<B.indexOf("Unknown SID")?(this.s=3,Dt(12)):(this.s=0,Dt(13)),$i(this),fa(this)}}}catch{}finally{}};function iv(l){return l.g?l.u=="GET"&&l.L!=2&&l.j.Ca:!1}function mP(l,h){var p=l.C,g=h.indexOf(`
`,p);return g==-1?df:(p=Number(h.substring(p,g)),isNaN(p)?nv:(g+=1,g+p>h.length?df:(h=h.slice(g,g+p),l.C=g+p,h)))}jr.prototype.cancel=function(){this.J=!0,$i(this)};function Vu(l){l.S=Date.now()+l.I,sv(l,l.I)}function sv(l,h){if(l.B!=null)throw Error("WatchDog timer not null");l.B=ha(m(l.ba,l),h)}function pf(l){l.B&&(a.clearTimeout(l.B),l.B=null)}jr.prototype.ba=function(){this.B=null;const l=Date.now();0<=l-this.S?(fP(this.i,this.A),this.L!=2&&(ca(),Dt(17)),$i(this),this.s=2,fa(this)):sv(this,this.S-l)};function fa(l){l.j.G==0||l.J||Dv(l.j,l)}function $i(l){pf(l);var h=l.M;h&&typeof h.ma=="function"&&h.ma(),l.M=null,bu(l.U),l.g&&(h=l.g,l.g=null,h.abort(),h.ma())}function mf(l,h){try{var p=l.j;if(p.G!=0&&(p.g==l||gf(p.h,l))){if(!l.K&&gf(p.h,l)&&p.G==3){try{var g=p.Da.g.parse(h)}catch{g=null}if(Array.isArray(g)&&g.length==3){var P=g;if(P[0]==0){e:if(!p.u){if(p.g)if(p.g.F+3e3<l.F)qu(p),$u(p);else break e;Ef(p),Dt(18)}}else p.za=P[1],0<p.za-p.T&&37500>P[2]&&p.F&&p.v==0&&!p.C&&(p.C=ha(m(p.Za,p),6e3));if(1>=lv(p.h)&&p.ca){try{p.ca()}catch{}p.ca=void 0}}else qi(p,11)}else if((l.K||p.g==l)&&qu(p),!v(h))for(P=p.Da.g.parse(h),h=0;h<P.length;h++){let fe=P[h];if(p.T=fe[0],fe=fe[1],p.G==2)if(fe[0]=="c"){p.K=fe[1],p.ia=fe[2];const Et=fe[3];Et!=null&&(p.la=Et,p.j.info("VER="+p.la));const wt=fe[4];wt!=null&&(p.Aa=wt,p.j.info("SVER="+p.Aa));const Hs=fe[5];Hs!=null&&typeof Hs=="number"&&0<Hs&&(g=1.5*Hs,p.L=g,p.j.info("backChannelRequestTimeoutMs_="+g)),g=p;const Pn=l.g;if(Pn){const Ku=Pn.g?Pn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ku){var D=g.h;D.g||Ku.indexOf("spdy")==-1&&Ku.indexOf("quic")==-1&&Ku.indexOf("h2")==-1||(D.j=D.l,D.g=new Set,D.h&&(_f(D,D.h),D.h=null))}if(g.D){const If=Pn.g?Pn.g.getResponseHeader("X-HTTP-Session-Id"):null;If&&(g.ya=If,Ae(g.I,g.D,If))}}p.G=3,p.l&&p.l.ua(),p.ba&&(p.R=Date.now()-l.F,p.j.info("Handshake RTT: "+p.R+"ms")),g=p;var B=l;if(g.qa=xv(g,g.J?g.ia:null,g.W),B.K){uv(g.h,B);var Ee=B,dt=g.L;dt&&(Ee.I=dt),Ee.B&&(pf(Ee),Vu(Ee)),g.g=B}else kv(g);0<p.i.length&&Hu(p)}else fe[0]!="stop"&&fe[0]!="close"||qi(p,7);else p.G==3&&(fe[0]=="stop"||fe[0]=="close"?fe[0]=="stop"?qi(p,7):vf(p):fe[0]!="noop"&&p.l&&p.l.ta(fe),p.v=0)}}ca(4)}catch{}}var gP=class{constructor(l,h){this.g=l,this.map=h}};function ov(l){this.l=l||10,a.PerformanceNavigationTiming?(l=a.performance.getEntriesByType("navigation"),l=0<l.length&&(l[0].nextHopProtocol=="hq"||l[0].nextHopProtocol=="h2")):l=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=l?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function av(l){return l.h?!0:l.g?l.g.size>=l.j:!1}function lv(l){return l.h?1:l.g?l.g.size:0}function gf(l,h){return l.h?l.h==h:l.g?l.g.has(h):!1}function _f(l,h){l.g?l.g.add(h):l.h=h}function uv(l,h){l.h&&l.h==h?l.h=null:l.g&&l.g.has(h)&&l.g.delete(h)}ov.prototype.cancel=function(){if(this.i=cv(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const l of this.g.values())l.cancel();this.g.clear()}};function cv(l){if(l.h!=null)return l.i.concat(l.h.D);if(l.g!=null&&l.g.size!==0){let h=l.i;for(const p of l.g.values())h=h.concat(p.D);return h}return N(l.i)}function _P(l){if(l.V&&typeof l.V=="function")return l.V();if(typeof Map<"u"&&l instanceof Map||typeof Set<"u"&&l instanceof Set)return Array.from(l.values());if(typeof l=="string")return l.split("");if(u(l)){for(var h=[],p=l.length,g=0;g<p;g++)h.push(l[g]);return h}h=[],p=0;for(g in l)h[p++]=l[g];return h}function yP(l){if(l.na&&typeof l.na=="function")return l.na();if(!l.V||typeof l.V!="function"){if(typeof Map<"u"&&l instanceof Map)return Array.from(l.keys());if(!(typeof Set<"u"&&l instanceof Set)){if(u(l)||typeof l=="string"){var h=[];l=l.length;for(var p=0;p<l;p++)h.push(p);return h}h=[],p=0;for(const g in l)h[p++]=g;return h}}}function hv(l,h){if(l.forEach&&typeof l.forEach=="function")l.forEach(h,void 0);else if(u(l)||typeof l=="string")Array.prototype.forEach.call(l,h,void 0);else for(var p=yP(l),g=_P(l),P=g.length,D=0;D<P;D++)h.call(void 0,g[D],p&&p[D],l)}var dv=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function vP(l,h){if(l){l=l.split("&");for(var p=0;p<l.length;p++){var g=l[p].indexOf("="),P=null;if(0<=g){var D=l[p].substring(0,g);P=l[p].substring(g+1)}else D=l[p];h(D,P?decodeURIComponent(P.replace(/\+/g," ")):"")}}}function Hi(l){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,l instanceof Hi){this.h=l.h,Fu(this,l.j),this.o=l.o,this.g=l.g,Uu(this,l.s),this.l=l.l;var h=l.i,p=new ga;p.i=h.i,h.g&&(p.g=new Map(h.g),p.h=h.h),fv(this,p),this.m=l.m}else l&&(h=String(l).match(dv))?(this.h=!1,Fu(this,h[1]||"",!0),this.o=pa(h[2]||""),this.g=pa(h[3]||"",!0),Uu(this,h[4]),this.l=pa(h[5]||"",!0),fv(this,h[6]||"",!0),this.m=pa(h[7]||"")):(this.h=!1,this.i=new ga(null,this.h))}Hi.prototype.toString=function(){var l=[],h=this.j;h&&l.push(ma(h,pv,!0),":");var p=this.g;return(p||h=="file")&&(l.push("//"),(h=this.o)&&l.push(ma(h,pv,!0),"@"),l.push(encodeURIComponent(String(p)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),p=this.s,p!=null&&l.push(":",String(p))),(p=this.l)&&(this.g&&p.charAt(0)!="/"&&l.push("/"),l.push(ma(p,p.charAt(0)=="/"?IP:wP,!0))),(p=this.i.toString())&&l.push("?",p),(p=this.m)&&l.push("#",ma(p,SP)),l.join("")};function fr(l){return new Hi(l)}function Fu(l,h,p){l.j=p?pa(h,!0):h,l.j&&(l.j=l.j.replace(/:$/,""))}function Uu(l,h){if(h){if(h=Number(h),isNaN(h)||0>h)throw Error("Bad port number "+h);l.s=h}else l.s=null}function fv(l,h,p){h instanceof ga?(l.i=h,CP(l.i,l.h)):(p||(h=ma(h,TP)),l.i=new ga(h,l.h))}function Ae(l,h,p){l.i.set(h,p)}function Bu(l){return Ae(l,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),l}function pa(l,h){return l?h?decodeURI(l.replace(/%25/g,"%2525")):decodeURIComponent(l):""}function ma(l,h,p){return typeof l=="string"?(l=encodeURI(l).replace(h,EP),p&&(l=l.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l):null}function EP(l){return l=l.charCodeAt(0),"%"+(l>>4&15).toString(16)+(l&15).toString(16)}var pv=/[#\/\?@]/g,wP=/[#\?:]/g,IP=/[#\?]/g,TP=/[#\?@]/g,SP=/#/g;function ga(l,h){this.h=this.g=null,this.i=l||null,this.j=!!h}function Wr(l){l.g||(l.g=new Map,l.h=0,l.i&&vP(l.i,function(h,p){l.add(decodeURIComponent(h.replace(/\+/g," ")),p)}))}t=ga.prototype,t.add=function(l,h){Wr(this),this.i=null,l=Ws(this,l);var p=this.g.get(l);return p||this.g.set(l,p=[]),p.push(h),this.h+=1,this};function mv(l,h){Wr(l),h=Ws(l,h),l.g.has(h)&&(l.i=null,l.h-=l.g.get(h).length,l.g.delete(h))}function gv(l,h){return Wr(l),h=Ws(l,h),l.g.has(h)}t.forEach=function(l,h){Wr(this),this.g.forEach(function(p,g){p.forEach(function(P){l.call(h,P,g,this)},this)},this)},t.na=function(){Wr(this);const l=Array.from(this.g.values()),h=Array.from(this.g.keys()),p=[];for(let g=0;g<h.length;g++){const P=l[g];for(let D=0;D<P.length;D++)p.push(h[g])}return p},t.V=function(l){Wr(this);let h=[];if(typeof l=="string")gv(this,l)&&(h=h.concat(this.g.get(Ws(this,l))));else{l=Array.from(this.g.values());for(let p=0;p<l.length;p++)h=h.concat(l[p])}return h},t.set=function(l,h){return Wr(this),this.i=null,l=Ws(this,l),gv(this,l)&&(this.h-=this.g.get(l).length),this.g.set(l,[h]),this.h+=1,this},t.get=function(l,h){return l?(l=this.V(l),0<l.length?String(l[0]):h):h};function _v(l,h,p){mv(l,h),0<p.length&&(l.i=null,l.g.set(Ws(l,h),N(p)),l.h+=p.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const l=[],h=Array.from(this.g.keys());for(var p=0;p<h.length;p++){var g=h[p];const D=encodeURIComponent(String(g)),B=this.V(g);for(g=0;g<B.length;g++){var P=D;B[g]!==""&&(P+="="+encodeURIComponent(String(B[g]))),l.push(P)}}return this.i=l.join("&")};function Ws(l,h){return h=String(h),l.j&&(h=h.toLowerCase()),h}function CP(l,h){h&&!l.j&&(Wr(l),l.i=null,l.g.forEach(function(p,g){var P=g.toLowerCase();g!=P&&(mv(this,g),_v(this,P,p))},l)),l.j=h}function AP(l,h){const p=new da;if(a.Image){const g=new Image;g.onload=y($r,p,"TestLoadImage: loaded",!0,h,g),g.onerror=y($r,p,"TestLoadImage: error",!1,h,g),g.onabort=y($r,p,"TestLoadImage: abort",!1,h,g),g.ontimeout=y($r,p,"TestLoadImage: timeout",!1,h,g),a.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=l}else h(!1)}function RP(l,h){const p=new da,g=new AbortController,P=setTimeout(()=>{g.abort(),$r(p,"TestPingServer: timeout",!1,h)},1e4);fetch(l,{signal:g.signal}).then(D=>{clearTimeout(P),D.ok?$r(p,"TestPingServer: ok",!0,h):$r(p,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(P),$r(p,"TestPingServer: error",!1,h)})}function $r(l,h,p,g,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),g(p)}catch{}}function PP(){this.g=new cP}function kP(l,h,p){const g=p||"";try{hv(l,function(P,D){let B=P;c(P)&&(B=af(P)),h.push(g+D+"="+encodeURIComponent(B))})}catch(P){throw h.push(g+"type="+encodeURIComponent("_badmap")),P}}function zu(l){this.l=l.Ub||null,this.j=l.eb||!1}C(zu,lf),zu.prototype.g=function(){return new ju(this.l,this.j)},zu.prototype.i=function(l){return function(){return l}}({});function ju(l,h){Xe.call(this),this.D=l,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(ju,Xe),t=ju.prototype,t.open=function(l,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=l,this.A=h,this.readyState=1,ya(this)},t.send=function(l){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const h={headers:this.u,method:this.B,credentials:this.m,cache:void 0};l&&(h.body=l),(this.D||a).fetch(new Request(this.A,h)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,_a(this)),this.readyState=0},t.Sa=function(l){if(this.g&&(this.l=l,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=l.headers,this.readyState=2,ya(this)),this.g&&(this.readyState=3,ya(this),this.g)))if(this.responseType==="arraybuffer")l.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in l){if(this.j=l.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;yv(this)}else l.text().then(this.Ra.bind(this),this.ga.bind(this))};function yv(l){l.j.read().then(l.Pa.bind(l)).catch(l.ga.bind(l))}t.Pa=function(l){if(this.g){if(this.o&&l.value)this.response.push(l.value);else if(!this.o){var h=l.value?l.value:new Uint8Array(0);(h=this.v.decode(h,{stream:!l.done}))&&(this.response=this.responseText+=h)}l.done?_a(this):ya(this),this.readyState==3&&yv(this)}},t.Ra=function(l){this.g&&(this.response=this.responseText=l,_a(this))},t.Qa=function(l){this.g&&(this.response=l,_a(this))},t.ga=function(){this.g&&_a(this)};function _a(l){l.readyState=4,l.l=null,l.j=null,l.v=null,ya(l)}t.setRequestHeader=function(l,h){this.u.append(l,h)},t.getResponseHeader=function(l){return this.h&&this.h.get(l.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const l=[],h=this.h.entries();for(var p=h.next();!p.done;)p=p.value,l.push(p[0]+": "+p[1]),p=h.next();return l.join(`\r
`)};function ya(l){l.onreadystatechange&&l.onreadystatechange.call(l)}Object.defineProperty(ju.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(l){this.m=l?"include":"same-origin"}});function vv(l){let h="";return z(l,function(p,g){h+=g,h+=":",h+=p,h+=`\r
`}),h}function yf(l,h,p){e:{for(g in p){var g=!1;break e}g=!0}g||(p=vv(p),typeof l=="string"?p!=null&&encodeURIComponent(String(p)):Ae(l,h,p))}function je(l){Xe.call(this),this.headers=new Map,this.o=l||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(je,Xe);var NP=/^https?$/i,DP=["POST","PUT"];t=je.prototype,t.Ha=function(l){this.J=l},t.ea=function(l,h,p,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+l);h=h?h.toUpperCase():"GET",this.D=l,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():hf.g(),this.v=this.o?Ky(this.o):Ky(hf),this.g.onreadystatechange=m(this.Ea,this);try{this.B=!0,this.g.open(h,String(l),!0),this.B=!1}catch(D){Ev(this,D);return}if(l=p||"",p=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var P in g)p.set(P,g[P]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const D of g.keys())p.set(D,g.get(D));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(p.keys()).find(D=>D.toLowerCase()=="content-type"),P=a.FormData&&l instanceof a.FormData,!(0<=Array.prototype.indexOf.call(DP,h,void 0))||g||P||p.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[D,B]of p)this.g.setRequestHeader(D,B);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Tv(this),this.u=!0,this.g.send(l),this.u=!1}catch(D){Ev(this,D)}};function Ev(l,h){l.h=!1,l.g&&(l.j=!0,l.g.abort(),l.j=!1),l.l=h,l.m=5,wv(l),Wu(l)}function wv(l){l.A||(l.A=!0,it(l,"complete"),it(l,"error"))}t.abort=function(l){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=l||7,it(this,"complete"),it(this,"abort"),Wu(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Wu(this,!0)),je.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?Iv(this):this.bb())},t.bb=function(){Iv(this)};function Iv(l){if(l.h&&typeof o<"u"&&(!l.v[1]||pr(l)!=4||l.Z()!=2)){if(l.u&&pr(l)==4)Du(l.Ea,0,l);else if(it(l,"readystatechange"),pr(l)==4){l.h=!1;try{const B=l.Z();e:switch(B){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var p;if(!(p=h)){var g;if(g=B===0){var P=String(l.D).match(dv)[1]||null;!P&&a.self&&a.self.location&&(P=a.self.location.protocol.slice(0,-1)),g=!NP.test(P?P.toLowerCase():"")}p=g}if(p)it(l,"complete"),it(l,"success");else{l.m=6;try{var D=2<pr(l)?l.g.statusText:""}catch{D=""}l.l=D+" ["+l.Z()+"]",wv(l)}}finally{Wu(l)}}}}function Wu(l,h){if(l.g){Tv(l);const p=l.g,g=l.v[0]?()=>{}:null;l.g=null,l.v=null,h||it(l,"ready");try{p.onreadystatechange=g}catch{}}}function Tv(l){l.I&&(a.clearTimeout(l.I),l.I=null)}t.isActive=function(){return!!this.g};function pr(l){return l.g?l.g.readyState:0}t.Z=function(){try{return 2<pr(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(l){if(this.g){var h=this.g.responseText;return l&&h.indexOf(l)==0&&(h=h.substring(l.length)),uP(h)}};function Sv(l){try{if(!l.g)return null;if("response"in l.g)return l.g.response;switch(l.H){case"":case"text":return l.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in l.g)return l.g.mozResponseArrayBuffer}return null}catch{return null}}function OP(l){const h={};l=(l.g&&2<=pr(l)&&l.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<l.length;g++){if(v(l[g]))continue;var p=R(l[g]);const P=p[0];if(p=p[1],typeof p!="string")continue;p=p.trim();const D=h[P]||[];h[P]=D,D.push(p)}w(h,function(g){return g.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function va(l,h,p){return p&&p.internalChannelParams&&p.internalChannelParams[l]||h}function Cv(l){this.Aa=0,this.i=[],this.j=new da,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=va("failFast",!1,l),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=va("baseRetryDelayMs",5e3,l),this.cb=va("retryDelaySeedMs",1e4,l),this.Wa=va("forwardChannelMaxRetries",2,l),this.wa=va("forwardChannelRequestTimeoutMs",2e4,l),this.pa=l&&l.xmlHttpFactory||void 0,this.Xa=l&&l.Tb||void 0,this.Ca=l&&l.useFetchStreams||!1,this.L=void 0,this.J=l&&l.supportsCrossDomainXhr||!1,this.K="",this.h=new ov(l&&l.concurrentRequestLimit),this.Da=new PP,this.P=l&&l.fastHandshake||!1,this.O=l&&l.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=l&&l.Rb||!1,l&&l.xa&&this.j.xa(),l&&l.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&l&&l.detectBufferingProxy||!1,this.ja=void 0,l&&l.longPollingTimeout&&0<l.longPollingTimeout&&(this.ja=l.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=Cv.prototype,t.la=8,t.G=1,t.connect=function(l,h,p,g){Dt(0),this.W=l,this.H=h||{},p&&g!==void 0&&(this.H.OSID=p,this.H.OAID=g),this.F=this.X,this.I=xv(this,null,this.W),Hu(this)};function vf(l){if(Av(l),l.G==3){var h=l.U++,p=fr(l.I);if(Ae(p,"SID",l.K),Ae(p,"RID",h),Ae(p,"TYPE","terminate"),Ea(l,p),h=new jr(l,l.j,h),h.L=2,h.v=Bu(fr(p)),p=!1,a.navigator&&a.navigator.sendBeacon)try{p=a.navigator.sendBeacon(h.v.toString(),"")}catch{}!p&&a.Image&&(new Image().src=h.v,p=!0),p||(h.g=Lv(h.j,null),h.g.ea(h.v)),h.F=Date.now(),Vu(h)}bv(l)}function $u(l){l.g&&(wf(l),l.g.cancel(),l.g=null)}function Av(l){$u(l),l.u&&(a.clearTimeout(l.u),l.u=null),qu(l),l.h.cancel(),l.s&&(typeof l.s=="number"&&a.clearTimeout(l.s),l.s=null)}function Hu(l){if(!av(l.h)&&!l.s){l.s=!0;var h=l.Ga;In||ne(),W||(In(),W=!0),Z.add(h,l),l.B=0}}function bP(l,h){return lv(l.h)>=l.h.j-(l.s?1:0)?!1:l.s?(l.i=h.D.concat(l.i),!0):l.G==1||l.G==2||l.B>=(l.Va?0:l.Wa)?!1:(l.s=ha(m(l.Ga,l,h),Ov(l,l.B)),l.B++,!0)}t.Ga=function(l){if(this.s)if(this.s=null,this.G==1){if(!l){this.U=Math.floor(1e5*Math.random()),l=this.U++;const P=new jr(this,this.j,l);let D=this.o;if(this.S&&(D?(D=_(D),T(D,this.S)):D=this.S),this.m!==null||this.O||(P.H=D,D=null),this.P)e:{for(var h=0,p=0;p<this.i.length;p++){t:{var g=this.i[p];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(h+=g,4096<h){h=p;break e}if(h===4096||p===this.i.length-1){h=p+1;break e}}h=1e3}else h=1e3;h=Pv(this,P,h),p=fr(this.I),Ae(p,"RID",l),Ae(p,"CVER",22),this.D&&Ae(p,"X-HTTP-Session-Id",this.D),Ea(this,p),D&&(this.O?h="headers="+encodeURIComponent(String(vv(D)))+"&"+h:this.m&&yf(p,this.m,D)),_f(this.h,P),this.Ua&&Ae(p,"TYPE","init"),this.P?(Ae(p,"$req",h),Ae(p,"SID","null"),P.T=!0,ff(P,p,null)):ff(P,p,h),this.G=2}}else this.G==3&&(l?Rv(this,l):this.i.length==0||av(this.h)||Rv(this))};function Rv(l,h){var p;h?p=h.l:p=l.U++;const g=fr(l.I);Ae(g,"SID",l.K),Ae(g,"RID",p),Ae(g,"AID",l.T),Ea(l,g),l.m&&l.o&&yf(g,l.m,l.o),p=new jr(l,l.j,p,l.B+1),l.m===null&&(p.H=l.o),h&&(l.i=h.D.concat(l.i)),h=Pv(l,p,1e3),p.I=Math.round(.5*l.wa)+Math.round(.5*l.wa*Math.random()),_f(l.h,p),ff(p,g,h)}function Ea(l,h){l.H&&z(l.H,function(p,g){Ae(h,g,p)}),l.l&&hv({},function(p,g){Ae(h,g,p)})}function Pv(l,h,p){p=Math.min(l.i.length,p);var g=l.l?m(l.l.Na,l.l,l):null;e:{var P=l.i;let D=-1;for(;;){const B=["count="+p];D==-1?0<p?(D=P[0].g,B.push("ofs="+D)):D=0:B.push("ofs="+D);let Ee=!0;for(let dt=0;dt<p;dt++){let fe=P[dt].g;const Et=P[dt].map;if(fe-=D,0>fe)D=Math.max(0,P[dt].g-100),Ee=!1;else try{kP(Et,B,"req"+fe+"_")}catch{g&&g(Et)}}if(Ee){g=B.join("&");break e}}}return l=l.i.splice(0,p),h.D=l,g}function kv(l){if(!l.g&&!l.u){l.Y=1;var h=l.Fa;In||ne(),W||(In(),W=!0),Z.add(h,l),l.v=0}}function Ef(l){return l.g||l.u||3<=l.v?!1:(l.Y++,l.u=ha(m(l.Fa,l),Ov(l,l.v)),l.v++,!0)}t.Fa=function(){if(this.u=null,Nv(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var l=2*this.R;this.j.info("BP detection timer enabled: "+l),this.A=ha(m(this.ab,this),l)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Dt(10),$u(this),Nv(this))};function wf(l){l.A!=null&&(a.clearTimeout(l.A),l.A=null)}function Nv(l){l.g=new jr(l,l.j,"rpc",l.Y),l.m===null&&(l.g.H=l.o),l.g.O=0;var h=fr(l.qa);Ae(h,"RID","rpc"),Ae(h,"SID",l.K),Ae(h,"AID",l.T),Ae(h,"CI",l.F?"0":"1"),!l.F&&l.ja&&Ae(h,"TO",l.ja),Ae(h,"TYPE","xmlhttp"),Ea(l,h),l.m&&l.o&&yf(h,l.m,l.o),l.L&&(l.g.I=l.L);var p=l.g;l=l.ia,p.L=1,p.v=Bu(fr(h)),p.m=null,p.P=!0,rv(p,l)}t.Za=function(){this.C!=null&&(this.C=null,$u(this),Ef(this),Dt(19))};function qu(l){l.C!=null&&(a.clearTimeout(l.C),l.C=null)}function Dv(l,h){var p=null;if(l.g==h){qu(l),wf(l),l.g=null;var g=2}else if(gf(l.h,h))p=h.D,uv(l.h,h),g=1;else return;if(l.G!=0){if(h.o)if(g==1){p=h.m?h.m.length:0,h=Date.now()-h.F;var P=l.B;g=xu(),it(g,new Zy(g,p)),Hu(l)}else kv(l);else if(P=h.s,P==3||P==0&&0<h.X||!(g==1&&bP(l,h)||g==2&&Ef(l)))switch(p&&0<p.length&&(h=l.h,h.i=h.i.concat(p)),P){case 1:qi(l,5);break;case 4:qi(l,10);break;case 3:qi(l,6);break;default:qi(l,2)}}}function Ov(l,h){let p=l.Ta+Math.floor(Math.random()*l.cb);return l.isActive()||(p*=2),p*h}function qi(l,h){if(l.j.info("Error code "+h),h==2){var p=m(l.fb,l),g=l.Xa;const P=!g;g=new Hi(g||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||Fu(g,"https"),Bu(g),P?AP(g.toString(),p):RP(g.toString(),p)}else Dt(2);l.G=0,l.l&&l.l.sa(h),bv(l),Av(l)}t.fb=function(l){l?(this.j.info("Successfully pinged google.com"),Dt(2)):(this.j.info("Failed to ping google.com"),Dt(1))};function bv(l){if(l.G=0,l.ka=[],l.l){const h=cv(l.h);(h.length!=0||l.i.length!=0)&&(b(l.ka,h),b(l.ka,l.i),l.h.i.length=0,N(l.i),l.i.length=0),l.l.ra()}}function xv(l,h,p){var g=p instanceof Hi?fr(p):new Hi(p);if(g.g!="")h&&(g.g=h+"."+g.g),Uu(g,g.s);else{var P=a.location;g=P.protocol,h=h?h+"."+P.hostname:P.hostname,P=+P.port;var D=new Hi(null);g&&Fu(D,g),h&&(D.g=h),P&&Uu(D,P),p&&(D.l=p),g=D}return p=l.D,h=l.ya,p&&h&&Ae(g,p,h),Ae(g,"VER",l.la),Ea(l,g),g}function Lv(l,h,p){if(h&&!l.J)throw Error("Can't create secondary domain capable XhrIo object.");return h=l.Ca&&!l.pa?new je(new zu({eb:p})):new je(l.pa),h.Ha(l.J),h}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function Mv(){}t=Mv.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function Gu(){}Gu.prototype.g=function(l,h){return new Qt(l,h)};function Qt(l,h){Xe.call(this),this.g=new Cv(h),this.l=l,this.h=h&&h.messageUrlParams||null,l=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(l?l["X-Client-Protocol"]="webchannel":l={"X-Client-Protocol":"webchannel"}),this.g.o=l,l=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(l?l["X-WebChannel-Content-Type"]=h.messageContentType:l={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.va&&(l?l["X-WebChannel-Client-Profile"]=h.va:l={"X-WebChannel-Client-Profile":h.va}),this.g.S=l,(l=h&&h.Sb)&&!v(l)&&(this.g.m=l),this.v=h&&h.supportsCrossDomainXhr||!1,this.u=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!v(h)&&(this.g.D=h,l=this.h,l!==null&&h in l&&(l=this.h,h in l&&delete l[h])),this.j=new $s(this)}C(Qt,Xe),Qt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Qt.prototype.close=function(){vf(this.g)},Qt.prototype.o=function(l){var h=this.g;if(typeof l=="string"){var p={};p.__data__=l,l=p}else this.u&&(p={},p.__data__=af(l),l=p);h.i.push(new gP(h.Ya++,l)),h.G==3&&Hu(h)},Qt.prototype.N=function(){this.g.l=null,delete this.j,vf(this.g),delete this.g,Qt.aa.N.call(this)};function Vv(l){uf.call(this),l.__headers__&&(this.headers=l.__headers__,this.statusCode=l.__status__,delete l.__headers__,delete l.__status__);var h=l.__sm__;if(h){e:{for(const p in h){l=p;break e}l=void 0}(this.i=l)&&(l=this.i,h=h!==null&&l in h?h[l]:void 0),this.data=h}else this.data=l}C(Vv,uf);function Fv(){cf.call(this),this.status=1}C(Fv,cf);function $s(l){this.g=l}C($s,Mv),$s.prototype.ua=function(){it(this.g,"a")},$s.prototype.ta=function(l){it(this.g,new Vv(l))},$s.prototype.sa=function(l){it(this.g,new Fv)},$s.prototype.ra=function(){it(this.g,"b")},Gu.prototype.createWebChannel=Gu.prototype.g,Qt.prototype.send=Qt.prototype.o,Qt.prototype.open=Qt.prototype.m,Qt.prototype.close=Qt.prototype.close,yA=function(){return new Gu},_A=function(){return xu()},gA=Wi,Bm={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Lu.NO_ERROR=0,Lu.TIMEOUT=8,Lu.HTTP_ERROR=6,Lc=Lu,ev.COMPLETE="complete",mA=ev,Qy.EventType=ua,ua.OPEN="a",ua.CLOSE="b",ua.ERROR="c",ua.MESSAGE="d",Xe.prototype.listen=Xe.prototype.K,ja=Qy,je.prototype.listenOnce=je.prototype.L,je.prototype.getLastError=je.prototype.Ka,je.prototype.getLastErrorCode=je.prototype.Ba,je.prototype.getStatus=je.prototype.Z,je.prototype.getResponseJson=je.prototype.Oa,je.prototype.getResponseText=je.prototype.oa,je.prototype.send=je.prototype.ea,je.prototype.setWithCredentials=je.prototype.Ha,pA=je}).apply(typeof pc<"u"?pc:typeof self<"u"?self:typeof window<"u"?window:{});const zw="@firebase/firestore",jw="4.9.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ct.UNAUTHENTICATED=new Ct(null),Ct.GOOGLE_CREDENTIALS=new Ct("google-credentials-uid"),Ct.FIRST_PARTY=new Ct("first-party-uid"),Ct.MOCK_USER=new Ct("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ea="12.0.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Es=new ou("@firebase/firestore");function Ks(){return Es.logLevel}function $(t,...e){if(Es.logLevel<=oe.DEBUG){const n=e.map($_);Es.debug(`Firestore (${ea}): ${t}`,...n)}}function Or(t,...e){if(Es.logLevel<=oe.ERROR){const n=e.map($_);Es.error(`Firestore (${ea}): ${t}`,...n)}}function Bo(t,...e){if(Es.logLevel<=oe.WARN){const n=e.map($_);Es.warn(`Firestore (${ea}): ${t}`,...n)}}function $_(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function J(t,e,n){let r="Unexpected state";typeof e=="string"?r=e:n=e,vA(t,r,n)}function vA(t,e,n){let r=`FIRESTORE (${ea}) INTERNAL ASSERTION FAILED: ${e} (ID: ${t.toString(16)})`;if(n!==void 0)try{r+=" CONTEXT: "+JSON.stringify(n)}catch{r+=" CONTEXT: "+n}throw Or(r),new Error(r)}function me(t,e,n,r){let i="Unexpected state";typeof n=="string"?i=n:r=n,t||vA(e,i,r)}function te(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const L={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class G extends jn{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EA{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class hM{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(Ct.UNAUTHENTICATED))}shutdown(){}}class dM{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class fM{constructor(e){this.t=e,this.currentUser=Ct.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){me(this.o===void 0,42304);let r=this.i;const i=u=>this.i!==r?(r=this.i,n(u)):Promise.resolve();let s=new Tr;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Tr,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},a=u=>{$("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>a(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?a(u):($("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Tr)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?($("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(me(typeof r.accessToken=="string",31837,{l:r}),new EA(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return me(e===null||typeof e=="string",2055,{h:e}),new Ct(e)}}class pM{constructor(e,n,r){this.P=e,this.T=n,this.I=r,this.type="FirstParty",this.user=Ct.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class mM{constructor(e,n,r){this.P=e,this.T=n,this.I=r}getToken(){return Promise.resolve(new pM(this.P,this.T,this.I))}start(e,n){e.enqueueRetryable(()=>n(Ct.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Ww{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class gM{constructor(e,n){this.V=n,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,xe(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,n){me(this.o===void 0,3512);const r=s=>{s.error!=null&&$("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.m;return this.m=s.token,$("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{$("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?i(s):$("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new Ww(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(me(typeof n.token=="string",44558,{tokenResult:n}),this.m=n.token,new Ww(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _M(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H_{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const i=_M(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=e.charAt(i[s]%62))}return r}}function le(t,e){return t<e?-1:t>e?1:0}function zm(t,e){const n=Math.min(t.length,e.length);for(let r=0;r<n;r++){const i=t.charAt(r),s=e.charAt(r);if(i!==s)return ap(i)===ap(s)?le(i,s):ap(i)?1:-1}return le(t.length,e.length)}const yM=55296,vM=57343;function ap(t){const e=t.charCodeAt(0);return e>=yM&&e<=vM}function zo(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $w="__name__";class Qn{constructor(e,n,r){n===void 0?n=0:n>e.length&&J(637,{offset:n,range:e.length}),r===void 0?r=e.length-n:r>e.length-n&&J(1746,{length:r,range:e.length-n}),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return Qn.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof Qn?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const s=Qn.compareSegments(e.get(i),n.get(i));if(s!==0)return s}return le(e.length,n.length)}static compareSegments(e,n){const r=Qn.isNumericId(e),i=Qn.isNumericId(n);return r&&!i?-1:!r&&i?1:r&&i?Qn.extractNumericId(e).compare(Qn.extractNumericId(n)):zm(e,n)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return yi.fromString(e.substring(4,e.length-2))}}class Pe extends Qn{construct(e,n,r){return new Pe(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new G(L.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new Pe(n)}static emptyPath(){return new Pe([])}}const EM=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class mt extends Qn{construct(e,n,r){return new mt(e,n,r)}static isValidIdentifier(e){return EM.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),mt.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===$w}static keyField(){return new mt([$w])}static fromServerFormat(e){const n=[];let r="",i=0;const s=()=>{if(r.length===0)throw new G(L.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;i<e.length;){const a=e[i];if(a==="\\"){if(i+1===e.length)throw new G(L.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new G(L.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,i+=2}else a==="`"?(o=!o,i++):a!=="."||o?(r+=a,i++):(s(),i++)}if(s(),o)throw new G(L.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new mt(n)}static emptyPath(){return new mt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q{constructor(e){this.path=e}static fromPath(e){return new Q(Pe.fromString(e))}static fromName(e){return new Q(Pe.fromString(e).popFirst(5))}static empty(){return new Q(Pe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Pe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return Pe.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Q(new Pe(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wA(t,e,n){if(!n)throw new G(L.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function wM(t,e,n,r){if(e===!0&&r===!0)throw new G(L.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function Hw(t){if(!Q.isDocumentKey(t))throw new G(L.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function qw(t){if(Q.isDocumentKey(t))throw new G(L.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function IA(t){return typeof t=="object"&&t!==null&&(Object.getPrototypeOf(t)===Object.prototype||Object.getPrototypeOf(t)===null)}function q_(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":J(12329,{type:typeof t})}function br(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new G(L.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=q_(t);throw new G(L.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ye(t,e){const n={typeString:t};return e&&(n.value=e),n}function yu(t,e){if(!IA(t))throw new G(L.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in e)if(e[r]){const i=e[r].typeString,s="value"in e[r]?{value:e[r].value}:void 0;if(!(r in t)){n=`JSON missing required field: '${r}'`;break}const o=t[r];if(i&&typeof o!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(s!==void 0&&o!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new G(L.INVALID_ARGUMENT,n);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gw=-62135596800,Kw=1e6;class ke{static now(){return ke.fromMillis(Date.now())}static fromDate(e){return ke.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor((e-1e3*n)*Kw);return new ke(n,r)}constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new G(L.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new G(L.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<Gw)throw new G(L.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new G(L.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Kw}_compareTo(e){return this.seconds===e.seconds?le(this.nanoseconds,e.nanoseconds):le(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ke._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(yu(e,ke._jsonSchema))return new ke(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Gw;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ke._jsonSchemaVersion="firestore/timestamp/1.0",ke._jsonSchema={type:Ye("string",ke._jsonSchemaVersion),seconds:Ye("number"),nanoseconds:Ye("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{static fromTimestamp(e){return new ee(e)}static min(){return new ee(new ke(0,0))}static max(){return new ee(new ke(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wl=-1;function IM(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,i=ee.fromTimestamp(r===1e9?new ke(n+1,0):new ke(n,r));return new Pi(i,Q.empty(),e)}function TM(t){return new Pi(t.readTime,t.key,Wl)}class Pi{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new Pi(ee.min(),Q.empty(),Wl)}static max(){return new Pi(ee.max(),Q.empty(),Wl)}}function SM(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=Q.comparator(t.documentKey,e.documentKey),n!==0?n:le(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CM="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class AM{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ta(t){if(t.code!==L.FAILED_PRECONDITION||t.message!==CM)throw t;$("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&J(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new x((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(n,s).next(r,i)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof x?n:x.resolve(n)}catch(n){return x.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):x.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):x.reject(n)}static resolve(e){return new x((n,r)=>{n(e)})}static reject(e){return new x((n,r)=>{r(e)})}static waitFor(e){return new x((n,r)=>{let i=0,s=0,o=!1;e.forEach(a=>{++i,a.next(()=>{++s,o&&s===i&&n()},u=>r(u))}),o=!0,s===i&&n()})}static or(e){let n=x.resolve(!1);for(const r of e)n=n.next(i=>i?x.resolve(i):r());return n}static forEach(e,n){const r=[];return e.forEach((i,s)=>{r.push(n.call(this,i,s))}),this.waitFor(r)}static mapArray(e,n){return new x((r,i)=>{const s=e.length,o=new Array(s);let a=0;for(let u=0;u<s;u++){const c=u;n(e[c]).next(d=>{o[c]=d,++a,a===s&&r(o)},d=>i(d))}})}static doWhile(e,n){return new x((r,i)=>{const s=()=>{e()===!0?n().next(()=>{s()},i):r()};s()})}}function RM(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function na(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bd{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>n.writeSequenceNumber(r))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}bd.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const G_=-1;function xd(t){return t==null}function bh(t){return t===0&&1/t==-1/0}function PM(t){return typeof t=="number"&&Number.isInteger(t)&&!bh(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TA="";function kM(t){let e="";for(let n=0;n<t.length;n++)e.length>0&&(e=Qw(e)),e=NM(t.get(n),e);return Qw(e)}function NM(t,e){let n=e;const r=t.length;for(let i=0;i<r;i++){const s=t.charAt(i);switch(s){case"\0":n+="";break;case TA:n+="";break;default:n+=s}}return n}function Qw(t){return t+TA+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yw(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Os(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function SA(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e,n){this.comparator=e,this.root=n||pt.EMPTY}insert(e,n){return new ze(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,pt.BLACK,null,null))}remove(e){return new ze(this.comparator,this.root.remove(e,this.comparator).copy(null,null,pt.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new mc(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new mc(this.root,e,this.comparator,!1)}getReverseIterator(){return new mc(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new mc(this.root,e,this.comparator,!0)}}class mc{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class pt{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??pt.RED,this.left=i??pt.EMPTY,this.right=s??pt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new pt(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return pt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return pt.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,pt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,pt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw J(43730,{key:this.key,value:this.value});if(this.right.isRed())throw J(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw J(27949);return e+(this.isRed()?0:1)}}pt.EMPTY=null,pt.RED=!0,pt.BLACK=!1;pt.EMPTY=new class{constructor(){this.size=0}get key(){throw J(57766)}get value(){throw J(16141)}get color(){throw J(16727)}get left(){throw J(29726)}get right(){throw J(36894)}copy(e,n,r,i,s){return this}insert(e,n,r){return new pt(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e){this.comparator=e,this.data=new ze(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new Xw(this.data.getIterator())}getIteratorFrom(e){return new Xw(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof rt)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new rt(this.comparator);return n.data=e,n}}class Xw{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e){this.fields=e,e.sort(mt.comparator)}static empty(){return new xn([])}unionWith(e){let n=new rt(mt.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new xn(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return zo(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CA extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new CA("Invalid base64 string: "+s):s}}(e);return new yt(n)}static fromUint8Array(e){const n=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new yt(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return le(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}yt.EMPTY_BYTE_STRING=new yt("");const DM=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function ki(t){if(me(!!t,39018),typeof t=="string"){let e=0;const n=DM.exec(t);if(me(!!n,46558,{timestamp:t}),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:He(t.seconds),nanos:He(t.nanos)}}function He(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Ni(t){return typeof t=="string"?yt.fromBase64String(t):yt.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AA="server_timestamp",RA="__type__",PA="__previous_value__",kA="__local_write_time__";function K_(t){var n,r;return((r=(((n=t==null?void 0:t.mapValue)==null?void 0:n.fields)||{})[RA])==null?void 0:r.stringValue)===AA}function Ld(t){const e=t.mapValue.fields[PA];return K_(e)?Ld(e):e}function $l(t){const e=ki(t.mapValue.fields[kA].timestampValue);return new ke(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OM{constructor(e,n,r,i,s,o,a,u,c,d){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=u,this.useFetchStreams=c,this.isUsingEmulator=d}}const xh="(default)";class Hl{constructor(e,n){this.projectId=e,this.database=n||xh}static empty(){return new Hl("","")}get isDefaultDatabase(){return this.database===xh}isEqual(e){return e instanceof Hl&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NA="__type__",DA="__max__",gc={mapValue:{fields:{__type__:{stringValue:DA}}}},OA="__vector__",Lh="value";function Di(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?K_(t)?4:xM(t)?9007199254740991:bM(t)?10:11:J(28295,{value:t})}function ur(t,e){if(t===e)return!0;const n=Di(t);if(n!==Di(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return $l(t).isEqual($l(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=ki(i.timestampValue),a=ki(s.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return Ni(i.bytesValue).isEqual(Ni(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return He(i.geoPointValue.latitude)===He(s.geoPointValue.latitude)&&He(i.geoPointValue.longitude)===He(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return He(i.integerValue)===He(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=He(i.doubleValue),a=He(s.doubleValue);return o===a?bh(o)===bh(a):isNaN(o)&&isNaN(a)}return!1}(t,e);case 9:return zo(t.arrayValue.values||[],e.arrayValue.values||[],ur);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},a=s.mapValue.fields||{};if(Yw(o)!==Yw(a))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(a[u]===void 0||!ur(o[u],a[u])))return!1;return!0}(t,e);default:return J(52216,{left:t})}}function ql(t,e){return(t.values||[]).find(n=>ur(n,e))!==void 0}function jo(t,e){if(t===e)return 0;const n=Di(t),r=Di(e);if(n!==r)return le(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return le(t.booleanValue,e.booleanValue);case 2:return function(s,o){const a=He(s.integerValue||s.doubleValue),u=He(o.integerValue||o.doubleValue);return a<u?-1:a>u?1:a===u?0:isNaN(a)?isNaN(u)?0:-1:1}(t,e);case 3:return Jw(t.timestampValue,e.timestampValue);case 4:return Jw($l(t),$l(e));case 5:return zm(t.stringValue,e.stringValue);case 6:return function(s,o){const a=Ni(s),u=Ni(o);return a.compareTo(u)}(t.bytesValue,e.bytesValue);case 7:return function(s,o){const a=s.split("/"),u=o.split("/");for(let c=0;c<a.length&&c<u.length;c++){const d=le(a[c],u[c]);if(d!==0)return d}return le(a.length,u.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,o){const a=le(He(s.latitude),He(o.latitude));return a!==0?a:le(He(s.longitude),He(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return Zw(t.arrayValue,e.arrayValue);case 10:return function(s,o){var m,y,C,N;const a=s.fields||{},u=o.fields||{},c=(m=a[Lh])==null?void 0:m.arrayValue,d=(y=u[Lh])==null?void 0:y.arrayValue,f=le(((C=c==null?void 0:c.values)==null?void 0:C.length)||0,((N=d==null?void 0:d.values)==null?void 0:N.length)||0);return f!==0?f:Zw(c,d)}(t.mapValue,e.mapValue);case 11:return function(s,o){if(s===gc.mapValue&&o===gc.mapValue)return 0;if(s===gc.mapValue)return 1;if(o===gc.mapValue)return-1;const a=s.fields||{},u=Object.keys(a),c=o.fields||{},d=Object.keys(c);u.sort(),d.sort();for(let f=0;f<u.length&&f<d.length;++f){const m=zm(u[f],d[f]);if(m!==0)return m;const y=jo(a[u[f]],c[d[f]]);if(y!==0)return y}return le(u.length,d.length)}(t.mapValue,e.mapValue);default:throw J(23264,{he:n})}}function Jw(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return le(t,e);const n=ki(t),r=ki(e),i=le(n.seconds,r.seconds);return i!==0?i:le(n.nanos,r.nanos)}function Zw(t,e){const n=t.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const s=jo(n[i],r[i]);if(s)return s}return le(n.length,r.length)}function Wo(t){return jm(t)}function jm(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=ki(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return Ni(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return Q.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",i=!0;for(const s of n.values||[])i?i=!1:r+=",",r+=jm(s);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let i="{",s=!0;for(const o of r)s?s=!1:i+=",",i+=`${o}:${jm(n.fields[o])}`;return i+"}"}(t.mapValue):J(61005,{value:t})}function Mc(t){switch(Di(t)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Ld(t);return e?16+Mc(e):16;case 5:return 2*t.stringValue.length;case 6:return Ni(t.bytesValue).approximateByteSize();case 7:return t.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((i,s)=>i+Mc(s),0)}(t.arrayValue);case 10:case 11:return function(r){let i=0;return Os(r.fields,(s,o)=>{i+=s.length+Mc(o)}),i}(t.mapValue);default:throw J(13486,{value:t})}}function Wm(t){return!!t&&"integerValue"in t}function Q_(t){return!!t&&"arrayValue"in t}function eI(t){return!!t&&"nullValue"in t}function tI(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Vc(t){return!!t&&"mapValue"in t}function bM(t){var n,r;return((r=(((n=t==null?void 0:t.mapValue)==null?void 0:n.fields)||{})[NA])==null?void 0:r.stringValue)===OA}function ll(t){if(t.geoPointValue)return{geoPointValue:{...t.geoPointValue}};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:{...t.timestampValue}};if(t.mapValue){const e={mapValue:{fields:{}}};return Os(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=ll(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=ll(t.arrayValue.values[n]);return e}return{...t}}function xM(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue===DA}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn{constructor(e){this.value=e}static empty(){return new fn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!Vc(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=ll(n)}setAll(e){let n=mt.emptyPath(),r={},i=[];e.forEach((o,a)=>{if(!n.isImmediateParentOf(a)){const u=this.getFieldsMap(n);this.applyChanges(u,r,i),r={},i=[],n=a.popLast()}o?r[a.lastSegment()]=ll(o):i.push(a.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){const n=this.field(e.popLast());Vc(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return ur(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];Vc(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){Os(n,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new fn(ll(this.value))}}function bA(t){const e=[];return Os(t.fields,(n,r)=>{const i=new mt([n]);if(Vc(r)){const s=bA(r.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)}),new xn(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rt{constructor(e,n,r,i,s,o,a){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=a}static newInvalidDocument(e){return new Rt(e,0,ee.min(),ee.min(),ee.min(),fn.empty(),0)}static newFoundDocument(e,n,r,i){return new Rt(e,1,n,ee.min(),r,i,0)}static newNoDocument(e,n){return new Rt(e,2,n,ee.min(),ee.min(),fn.empty(),0)}static newUnknownDocument(e,n){return new Rt(e,3,n,ee.min(),ee.min(),fn.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(ee.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=fn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=fn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ee.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Rt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Rt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mh{constructor(e,n){this.position=e,this.inclusive=n}}function nI(t,e,n){let r=0;for(let i=0;i<t.position.length;i++){const s=e[i],o=t.position[i];if(s.field.isKeyField()?r=Q.comparator(Q.fromName(o.referenceValue),n.key):r=jo(o,n.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function rI(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!ur(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vh{constructor(e,n="asc"){this.field=e,this.dir=n}}function LM(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xA{}class et extends xA{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new VM(e,n,r):n==="array-contains"?new BM(e,r):n==="in"?new zM(e,r):n==="not-in"?new jM(e,r):n==="array-contains-any"?new WM(e,r):new et(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new FM(e,r):new UM(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&n.nullValue===void 0&&this.matchesComparison(jo(n,this.value)):n!==null&&Di(this.value)===Di(n)&&this.matchesComparison(jo(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return J(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class cr extends xA{constructor(e,n){super(),this.filters=e,this.op=n,this.Pe=null}static create(e,n){return new cr(e,n)}matches(e){return LA(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function LA(t){return t.op==="and"}function MA(t){return MM(t)&&LA(t)}function MM(t){for(const e of t.filters)if(e instanceof cr)return!1;return!0}function $m(t){if(t instanceof et)return t.field.canonicalString()+t.op.toString()+Wo(t.value);if(MA(t))return t.filters.map(e=>$m(e)).join(",");{const e=t.filters.map(n=>$m(n)).join(",");return`${t.op}(${e})`}}function VA(t,e){return t instanceof et?function(r,i){return i instanceof et&&r.op===i.op&&r.field.isEqual(i.field)&&ur(r.value,i.value)}(t,e):t instanceof cr?function(r,i){return i instanceof cr&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,o,a)=>s&&VA(o,i.filters[a]),!0):!1}(t,e):void J(19439)}function FA(t){return t instanceof et?function(n){return`${n.field.canonicalString()} ${n.op} ${Wo(n.value)}`}(t):t instanceof cr?function(n){return n.op.toString()+" {"+n.getFilters().map(FA).join(" ,")+"}"}(t):"Filter"}class VM extends et{constructor(e,n,r){super(e,n,r),this.key=Q.fromName(r.referenceValue)}matches(e){const n=Q.comparator(e.key,this.key);return this.matchesComparison(n)}}class FM extends et{constructor(e,n){super(e,"in",n),this.keys=UA("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class UM extends et{constructor(e,n){super(e,"not-in",n),this.keys=UA("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function UA(t,e){var n;return(((n=e.arrayValue)==null?void 0:n.values)||[]).map(r=>Q.fromName(r.referenceValue))}class BM extends et{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Q_(n)&&ql(n.arrayValue,this.value)}}class zM extends et{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&ql(this.value.arrayValue,n)}}class jM extends et{constructor(e,n){super(e,"not-in",n)}matches(e){if(ql(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&n.nullValue===void 0&&!ql(this.value.arrayValue,n)}}class WM extends et{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Q_(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>ql(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $M{constructor(e,n=null,r=[],i=[],s=null,o=null,a=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=a,this.Te=null}}function iI(t,e=null,n=[],r=[],i=null,s=null,o=null){return new $M(t,e,n,r,i,s,o)}function Y_(t){const e=te(t);if(e.Te===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>$m(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),xd(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>Wo(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>Wo(r)).join(",")),e.Te=n}return e.Te}function X_(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!LM(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!VA(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!rI(t.startAt,e.startAt)&&rI(t.endAt,e.endAt)}function Hm(t){return Q.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Md{constructor(e,n=null,r=[],i=[],s=null,o="F",a=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=a,this.endAt=u,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function HM(t,e,n,r,i,s,o,a){return new Md(t,e,n,r,i,s,o,a)}function J_(t){return new Md(t)}function sI(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function qM(t){return t.collectionGroup!==null}function ul(t){const e=te(t);if(e.Ie===null){e.Ie=[];const n=new Set;for(const s of e.explicitOrderBy)e.Ie.push(s),n.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new rt(mt.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(c=>{c.isInequality()&&(a=a.add(c.field))})}),a})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.Ie.push(new Vh(s,r))}),n.has(mt.keyField().canonicalString())||e.Ie.push(new Vh(mt.keyField(),r))}return e.Ie}function rr(t){const e=te(t);return e.Ee||(e.Ee=GM(e,ul(t))),e.Ee}function GM(t,e){if(t.limitType==="F")return iI(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new Vh(i.field,s)});const n=t.endAt?new Mh(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new Mh(t.startAt.position,t.startAt.inclusive):null;return iI(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function qm(t,e,n){return new Md(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function Vd(t,e){return X_(rr(t),rr(e))&&t.limitType===e.limitType}function BA(t){return`${Y_(rr(t))}|lt:${t.limitType}`}function Qs(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(i=>FA(i)).join(", ")}]`),xd(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(i=>Wo(i)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(i=>Wo(i)).join(",")),`Target(${r})`}(rr(t))}; limitType=${t.limitType})`}function Fd(t,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):Q.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(t,e)&&function(r,i){for(const s of ul(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(t,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(t,e)&&function(r,i){return!(r.startAt&&!function(o,a,u){const c=nI(o,a,u);return o.inclusive?c<=0:c<0}(r.startAt,ul(r),i)||r.endAt&&!function(o,a,u){const c=nI(o,a,u);return o.inclusive?c>=0:c>0}(r.endAt,ul(r),i))}(t,e)}function KM(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function zA(t){return(e,n)=>{let r=!1;for(const i of ul(t)){const s=QM(i,e,n);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function QM(t,e,n){const r=t.field.isKeyField()?Q.comparator(e.key,n.key):function(s,o,a){const u=o.data.field(s),c=a.data.field(s);return u!==null&&c!==null?jo(u,c):J(42886)}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return J(19790,{direction:t.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bs{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,n]);i.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[n]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Os(this.inner,(n,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return SA(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YM=new ze(Q.comparator);function xr(){return YM}const jA=new ze(Q.comparator);function Wa(...t){let e=jA;for(const n of t)e=e.insert(n.key,n);return e}function WA(t){let e=jA;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function ns(){return cl()}function $A(){return cl()}function cl(){return new bs(t=>t.toString(),(t,e)=>t.isEqual(e))}const XM=new ze(Q.comparator),JM=new rt(Q.comparator);function ue(...t){let e=JM;for(const n of t)e=e.add(n);return e}const ZM=new rt(le);function eV(){return ZM}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z_(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:bh(e)?"-0":e}}function HA(t){return{integerValue:""+t}}function tV(t,e){return PM(e)?HA(e):Z_(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ud{constructor(){this._=void 0}}function nV(t,e,n){return t instanceof Gl?function(i,s){const o={fields:{[RA]:{stringValue:AA},[kA]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&K_(s)&&(s=Ld(s)),s&&(o.fields[PA]=s),{mapValue:o}}(n,e):t instanceof Kl?GA(t,e):t instanceof Ql?KA(t,e):function(i,s){const o=qA(i,s),a=oI(o)+oI(i.Ae);return Wm(o)&&Wm(i.Ae)?HA(a):Z_(i.serializer,a)}(t,e)}function rV(t,e,n){return t instanceof Kl?GA(t,e):t instanceof Ql?KA(t,e):n}function qA(t,e){return t instanceof Fh?function(r){return Wm(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class Gl extends Ud{}class Kl extends Ud{constructor(e){super(),this.elements=e}}function GA(t,e){const n=QA(e);for(const r of t.elements)n.some(i=>ur(i,r))||n.push(r);return{arrayValue:{values:n}}}class Ql extends Ud{constructor(e){super(),this.elements=e}}function KA(t,e){let n=QA(e);for(const r of t.elements)n=n.filter(i=>!ur(i,r));return{arrayValue:{values:n}}}class Fh extends Ud{constructor(e,n){super(),this.serializer=e,this.Ae=n}}function oI(t){return He(t.integerValue||t.doubleValue)}function QA(t){return Q_(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iV{constructor(e,n){this.field=e,this.transform=n}}function sV(t,e){return t.field.isEqual(e.field)&&function(r,i){return r instanceof Kl&&i instanceof Kl||r instanceof Ql&&i instanceof Ql?zo(r.elements,i.elements,ur):r instanceof Fh&&i instanceof Fh?ur(r.Ae,i.Ae):r instanceof Gl&&i instanceof Gl}(t.transform,e.transform)}class oV{constructor(e,n){this.version=e,this.transformResults=n}}class Un{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new Un}static exists(e){return new Un(void 0,e)}static updateTime(e){return new Un(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Fc(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class Bd{}function YA(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new ey(t.key,Un.none()):new vu(t.key,t.data,Un.none());{const n=t.data,r=fn.empty();let i=new rt(mt.comparator);for(let s of e.fields)if(!i.has(s)){let o=n.field(s);o===null&&s.length>1&&(s=s.popLast(),o=n.field(s)),o===null?r.delete(s):r.set(s,o),i=i.add(s)}return new xs(t.key,r,new xn(i.toArray()),Un.none())}}function aV(t,e,n){t instanceof vu?function(i,s,o){const a=i.value.clone(),u=lI(i.fieldTransforms,s,o.transformResults);a.setAll(u),s.convertToFoundDocument(o.version,a).setHasCommittedMutations()}(t,e,n):t instanceof xs?function(i,s,o){if(!Fc(i.precondition,s))return void s.convertToUnknownDocument(o.version);const a=lI(i.fieldTransforms,s,o.transformResults),u=s.data;u.setAll(XA(i)),u.setAll(a),s.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(t,e,n):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function hl(t,e,n,r){return t instanceof vu?function(s,o,a,u){if(!Fc(s.precondition,o))return a;const c=s.value.clone(),d=uI(s.fieldTransforms,u,o);return c.setAll(d),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null}(t,e,n,r):t instanceof xs?function(s,o,a,u){if(!Fc(s.precondition,o))return a;const c=uI(s.fieldTransforms,u,o),d=o.data;return d.setAll(XA(s)),d.setAll(c),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),a===null?null:a.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(f=>f.field))}(t,e,n,r):function(s,o,a){return Fc(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a}(t,e,n)}function lV(t,e){let n=null;for(const r of t.fieldTransforms){const i=e.data.field(r.field),s=qA(r.transform,i||null);s!=null&&(n===null&&(n=fn.empty()),n.set(r.field,s))}return n||null}function aI(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&zo(r,i,(s,o)=>sV(s,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class vu extends Bd{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class xs extends Bd{constructor(e,n,r,i,s=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function XA(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function lI(t,e,n){const r=new Map;me(t.length===n.length,32656,{Re:n.length,Ve:t.length});for(let i=0;i<n.length;i++){const s=t[i],o=s.transform,a=e.data.field(s.field);r.set(s.field,rV(o,a,n[i]))}return r}function uI(t,e,n){const r=new Map;for(const i of t){const s=i.transform,o=n.data.field(i.field);r.set(i.field,nV(s,o,e))}return r}class ey extends Bd{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class uV extends Bd{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cV{constructor(e,n,r,i){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&aV(s,e,r[i])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=hl(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=hl(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=$A();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let a=this.applyToLocalView(o,s.mutatedFields);a=n.has(i.key)?null:a;const u=YA(o,a);u!==null&&r.set(i.key,u),o.isValidDocument()||o.convertToNoDocument(ee.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),ue())}isEqual(e){return this.batchId===e.batchId&&zo(this.mutations,e.mutations,(n,r)=>aI(n,r))&&zo(this.baseMutations,e.baseMutations,(n,r)=>aI(n,r))}}class ty{constructor(e,n,r,i){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=i}static from(e,n,r){me(e.mutations.length===r.length,58842,{me:e.mutations.length,fe:r.length});let i=function(){return XM}();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,r[o].version);return new ty(e,n,r,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hV{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dV{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ge,ce;function fV(t){switch(t){case L.OK:return J(64938);case L.CANCELLED:case L.UNKNOWN:case L.DEADLINE_EXCEEDED:case L.RESOURCE_EXHAUSTED:case L.INTERNAL:case L.UNAVAILABLE:case L.UNAUTHENTICATED:return!1;case L.INVALID_ARGUMENT:case L.NOT_FOUND:case L.ALREADY_EXISTS:case L.PERMISSION_DENIED:case L.FAILED_PRECONDITION:case L.ABORTED:case L.OUT_OF_RANGE:case L.UNIMPLEMENTED:case L.DATA_LOSS:return!0;default:return J(15467,{code:t})}}function JA(t){if(t===void 0)return Or("GRPC error has no .code"),L.UNKNOWN;switch(t){case Ge.OK:return L.OK;case Ge.CANCELLED:return L.CANCELLED;case Ge.UNKNOWN:return L.UNKNOWN;case Ge.DEADLINE_EXCEEDED:return L.DEADLINE_EXCEEDED;case Ge.RESOURCE_EXHAUSTED:return L.RESOURCE_EXHAUSTED;case Ge.INTERNAL:return L.INTERNAL;case Ge.UNAVAILABLE:return L.UNAVAILABLE;case Ge.UNAUTHENTICATED:return L.UNAUTHENTICATED;case Ge.INVALID_ARGUMENT:return L.INVALID_ARGUMENT;case Ge.NOT_FOUND:return L.NOT_FOUND;case Ge.ALREADY_EXISTS:return L.ALREADY_EXISTS;case Ge.PERMISSION_DENIED:return L.PERMISSION_DENIED;case Ge.FAILED_PRECONDITION:return L.FAILED_PRECONDITION;case Ge.ABORTED:return L.ABORTED;case Ge.OUT_OF_RANGE:return L.OUT_OF_RANGE;case Ge.UNIMPLEMENTED:return L.UNIMPLEMENTED;case Ge.DATA_LOSS:return L.DATA_LOSS;default:return J(39323,{code:t})}}(ce=Ge||(Ge={}))[ce.OK=0]="OK",ce[ce.CANCELLED=1]="CANCELLED",ce[ce.UNKNOWN=2]="UNKNOWN",ce[ce.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ce[ce.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ce[ce.NOT_FOUND=5]="NOT_FOUND",ce[ce.ALREADY_EXISTS=6]="ALREADY_EXISTS",ce[ce.PERMISSION_DENIED=7]="PERMISSION_DENIED",ce[ce.UNAUTHENTICATED=16]="UNAUTHENTICATED",ce[ce.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ce[ce.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ce[ce.ABORTED=10]="ABORTED",ce[ce.OUT_OF_RANGE=11]="OUT_OF_RANGE",ce[ce.UNIMPLEMENTED=12]="UNIMPLEMENTED",ce[ce.INTERNAL=13]="INTERNAL",ce[ce.UNAVAILABLE=14]="UNAVAILABLE",ce[ce.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pV(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mV=new yi([4294967295,4294967295],0);function cI(t){const e=pV().encode(t),n=new fA;return n.update(e),new Uint8Array(n.digest())}function hI(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new yi([n,r],0),new yi([i,s],0)]}class ny{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new $a(`Invalid padding: ${n}`);if(r<0)throw new $a(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new $a(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new $a(`Invalid padding when bitmap length is 0: ${n}`);this.ge=8*e.length-n,this.pe=yi.fromNumber(this.ge)}ye(e,n,r){let i=e.add(n.multiply(yi.fromNumber(r)));return i.compare(mV)===1&&(i=new yi([i.getBits(0),i.getBits(1)],0)),i.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const n=cI(e),[r,i]=hI(n);for(let s=0;s<this.hashCount;s++){const o=this.ye(r,i,s);if(!this.we(o))return!1}return!0}static create(e,n,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new ny(s,i,n);return r.forEach(a=>o.insert(a)),o}insert(e){if(this.ge===0)return;const n=cI(e),[r,i]=hI(n);for(let s=0;s<this.hashCount;s++){const o=this.ye(r,i,s);this.Se(o)}}Se(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class $a extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zd{constructor(e,n,r,i,s){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const i=new Map;return i.set(e,Eu.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new zd(ee.min(),i,new ze(le),xr(),ue())}}class Eu{constructor(e,n,r,i,s){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new Eu(r,n,ue(),ue(),ue())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uc{constructor(e,n,r,i){this.be=e,this.removedTargetIds=n,this.key=r,this.De=i}}class ZA{constructor(e,n){this.targetId=e,this.Ce=n}}class eR{constructor(e,n,r=yt.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=i}}class dI{constructor(){this.ve=0,this.Fe=fI(),this.Me=yt.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=ue(),n=ue(),r=ue();return this.Fe.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:n=n.add(i);break;case 1:r=r.add(i);break;default:J(38017,{changeType:s})}}),new Eu(this.Me,this.xe,e,n,r)}qe(){this.Oe=!1,this.Fe=fI()}Qe(e,n){this.Oe=!0,this.Fe=this.Fe.insert(e,n)}$e(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}Ue(){this.ve+=1}Ke(){this.ve-=1,me(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class gV{constructor(e){this.Ge=e,this.ze=new Map,this.je=xr(),this.Je=_c(),this.He=_c(),this.Ye=new ze(le)}Ze(e){for(const n of e.be)e.De&&e.De.isFoundDocument()?this.Xe(n,e.De):this.et(n,e.key,e.De);for(const n of e.removedTargetIds)this.et(n,e.key,e.De)}tt(e){this.forEachTarget(e,n=>{const r=this.nt(n);switch(e.state){case 0:this.rt(n)&&r.Le(e.resumeToken);break;case 1:r.Ke(),r.Ne||r.qe(),r.Le(e.resumeToken);break;case 2:r.Ke(),r.Ne||this.removeTarget(n);break;case 3:this.rt(n)&&(r.We(),r.Le(e.resumeToken));break;case 4:this.rt(n)&&(this.it(n),r.Le(e.resumeToken));break;default:J(56790,{state:e.state})}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.ze.forEach((r,i)=>{this.rt(i)&&n(i)})}st(e){const n=e.targetId,r=e.Ce.count,i=this.ot(n);if(i){const s=i.target;if(Hm(s))if(r===0){const o=new Q(s.path);this.et(n,o,Rt.newNoDocument(o,ee.min()))}else me(r===1,20013,{expectedCount:r});else{const o=this._t(n);if(o!==r){const a=this.ut(e),u=a?this.ct(a,e,o):1;if(u!==0){this.it(n);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(n,c)}}}}}ut(e){const n=e.Ce.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=n;let o,a;try{o=Ni(r).toUint8Array()}catch(u){if(u instanceof CA)return Bo("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{a=new ny(o,i,s)}catch(u){return Bo(u instanceof $a?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return a.ge===0?null:a}ct(e,n,r){return n.Ce.count===r-this.Pt(e,n.targetId)?0:2}Pt(e,n){const r=this.Ge.getRemoteKeysForTarget(n);let i=0;return r.forEach(s=>{const o=this.Ge.ht(),a=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(a)||(this.et(n,s,null),i++)}),i}Tt(e){const n=new Map;this.ze.forEach((s,o)=>{const a=this.ot(o);if(a){if(s.current&&Hm(a.target)){const u=new Q(a.target.path);this.It(u).has(o)||this.Et(o,u)||this.et(o,u,Rt.newNoDocument(u,e))}s.Be&&(n.set(o,s.ke()),s.qe())}});let r=ue();this.He.forEach((s,o)=>{let a=!0;o.forEachWhile(u=>{const c=this.ot(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)}),a&&(r=r.add(s))}),this.je.forEach((s,o)=>o.setReadTime(e));const i=new zd(e,n,this.Ye,this.je,r);return this.je=xr(),this.Je=_c(),this.He=_c(),this.Ye=new ze(le),i}Xe(e,n){if(!this.rt(e))return;const r=this.Et(e,n.key)?2:0;this.nt(e).Qe(n.key,r),this.je=this.je.insert(n.key,n),this.Je=this.Je.insert(n.key,this.It(n.key).add(e)),this.He=this.He.insert(n.key,this.dt(n.key).add(e))}et(e,n,r){if(!this.rt(e))return;const i=this.nt(e);this.Et(e,n)?i.Qe(n,1):i.$e(n),this.He=this.He.insert(n,this.dt(n).delete(e)),this.He=this.He.insert(n,this.dt(n).add(e)),r&&(this.je=this.je.insert(n,r))}removeTarget(e){this.ze.delete(e)}_t(e){const n=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}Ue(e){this.nt(e).Ue()}nt(e){let n=this.ze.get(e);return n||(n=new dI,this.ze.set(e,n)),n}dt(e){let n=this.He.get(e);return n||(n=new rt(le),this.He=this.He.insert(e,n)),n}It(e){let n=this.Je.get(e);return n||(n=new rt(le),this.Je=this.Je.insert(e,n)),n}rt(e){const n=this.ot(e)!==null;return n||$("WatchChangeAggregator","Detected inactive target",e),n}ot(e){const n=this.ze.get(e);return n&&n.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new dI),this.Ge.getRemoteKeysForTarget(e).forEach(n=>{this.et(e,n,null)})}Et(e,n){return this.Ge.getRemoteKeysForTarget(e).has(n)}}function _c(){return new ze(Q.comparator)}function fI(){return new ze(Q.comparator)}const _V=(()=>({asc:"ASCENDING",desc:"DESCENDING"}))(),yV=(()=>({"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"}))(),vV=(()=>({and:"AND",or:"OR"}))();class EV{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Gm(t,e){return t.useProto3Json||xd(e)?e:{value:e}}function Uh(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function tR(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function wV(t,e){return Uh(t,e.toTimestamp())}function ir(t){return me(!!t,49232),ee.fromTimestamp(function(n){const r=ki(n);return new ke(r.seconds,r.nanos)}(t))}function ry(t,e){return Km(t,e).canonicalString()}function Km(t,e){const n=function(i){return new Pe(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function nR(t){const e=Pe.fromString(t);return me(aR(e),10190,{key:e.toString()}),e}function Qm(t,e){return ry(t.databaseId,e.path)}function lp(t,e){const n=nR(e);if(n.get(1)!==t.databaseId.projectId)throw new G(L.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new G(L.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new Q(iR(n))}function rR(t,e){return ry(t.databaseId,e)}function IV(t){const e=nR(t);return e.length===4?Pe.emptyPath():iR(e)}function Ym(t){return new Pe(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function iR(t){return me(t.length>4&&t.get(4)==="documents",29091,{key:t.toString()}),t.popFirst(5)}function pI(t,e,n){return{name:Qm(t,e),fields:n.value.mapValue.fields}}function TV(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:J(39313,{state:c})}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(c,d){return c.useProto3Json?(me(d===void 0||typeof d=="string",58123),yt.fromBase64String(d||"")):(me(d===void 0||d instanceof Buffer||d instanceof Uint8Array,16193),yt.fromUint8Array(d||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&function(c){const d=c.code===void 0?L.UNKNOWN:JA(c.code);return new G(d,c.message||"")}(o);n=new eR(r,i,s,a||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=lp(t,r.document.name),s=ir(r.document.updateTime),o=r.document.createTime?ir(r.document.createTime):ee.min(),a=new fn({mapValue:{fields:r.document.fields}}),u=Rt.newFoundDocument(i,s,o,a),c=r.targetIds||[],d=r.removedTargetIds||[];n=new Uc(c,d,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=lp(t,r.document),s=r.readTime?ir(r.readTime):ee.min(),o=Rt.newNoDocument(i,s),a=r.removedTargetIds||[];n=new Uc([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=lp(t,r.document),s=r.removedTargetIds||[];n=new Uc([],s,i,null)}else{if(!("filter"in e))return J(11601,{Rt:e});{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,o=new dV(i,s),a=r.targetId;n=new ZA(a,o)}}return n}function SV(t,e){let n;if(e instanceof vu)n={update:pI(t,e.key,e.value)};else if(e instanceof ey)n={delete:Qm(t,e.key)};else if(e instanceof xs)n={update:pI(t,e.key,e.data),updateMask:bV(e.fieldMask)};else{if(!(e instanceof uV))return J(16599,{Vt:e.type});n={verify:Qm(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(s,o){const a=o.transform;if(a instanceof Gl)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof Kl)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof Ql)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof Fh)return{fieldPath:o.field.canonicalString(),increment:a.Ae};throw J(20930,{transform:o.transform})}(0,r))),e.precondition.isNone||(n.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:wV(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:J(27497)}(t,e.precondition)),n}function CV(t,e){return t&&t.length>0?(me(e!==void 0,14353),t.map(n=>function(i,s){let o=i.updateTime?ir(i.updateTime):ir(s);return o.isEqual(ee.min())&&(o=ir(s)),new oV(o,i.transformResults||[])}(n,e))):[]}function AV(t,e){return{documents:[rR(t,e.path)]}}function RV(t,e){const n={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=rR(t,i);const s=function(c){if(c.length!==0)return oR(cr.create(c,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(c){if(c.length!==0)return c.map(d=>function(m){return{field:Ys(m.field),direction:NV(m.dir)}}(d))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const a=Gm(t,e.limit);return a!==null&&(n.structuredQuery.limit=a),e.startAt&&(n.structuredQuery.startAt=function(c){return{before:c.inclusive,values:c.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(c){return{before:!c.inclusive,values:c.position}}(e.endAt)),{ft:n,parent:i}}function PV(t){let e=IV(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){me(r===1,65062);const d=n.from[0];d.allDescendants?i=d.collectionId:e=e.child(d.collectionId)}let s=[];n.where&&(s=function(f){const m=sR(f);return m instanceof cr&&MA(m)?m.getFilters():[m]}(n.where));let o=[];n.orderBy&&(o=function(f){return f.map(m=>function(C){return new Vh(Xs(C.field),function(b){switch(b){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(C.direction))}(m))}(n.orderBy));let a=null;n.limit&&(a=function(f){let m;return m=typeof f=="object"?f.value:f,xd(m)?null:m}(n.limit));let u=null;n.startAt&&(u=function(f){const m=!!f.before,y=f.values||[];return new Mh(y,m)}(n.startAt));let c=null;return n.endAt&&(c=function(f){const m=!f.before,y=f.values||[];return new Mh(y,m)}(n.endAt)),HM(e,i,o,s,a,"F",u,c)}function kV(t,e){const n=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return J(28987,{purpose:i})}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function sR(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=Xs(n.unaryFilter.field);return et.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=Xs(n.unaryFilter.field);return et.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=Xs(n.unaryFilter.field);return et.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Xs(n.unaryFilter.field);return et.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return J(61313);default:return J(60726)}}(t):t.fieldFilter!==void 0?function(n){return et.create(Xs(n.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return J(58110);default:return J(50506)}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return cr.create(n.compositeFilter.filters.map(r=>sR(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return J(1026)}}(n.compositeFilter.op))}(t):J(30097,{filter:t})}function NV(t){return _V[t]}function DV(t){return yV[t]}function OV(t){return vV[t]}function Ys(t){return{fieldPath:t.canonicalString()}}function Xs(t){return mt.fromServerFormat(t.fieldPath)}function oR(t){return t instanceof et?function(n){if(n.op==="=="){if(tI(n.value))return{unaryFilter:{field:Ys(n.field),op:"IS_NAN"}};if(eI(n.value))return{unaryFilter:{field:Ys(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(tI(n.value))return{unaryFilter:{field:Ys(n.field),op:"IS_NOT_NAN"}};if(eI(n.value))return{unaryFilter:{field:Ys(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Ys(n.field),op:DV(n.op),value:n.value}}}(t):t instanceof cr?function(n){const r=n.getFilters().map(i=>oR(i));return r.length===1?r[0]:{compositeFilter:{op:OV(n.op),filters:r}}}(t):J(54877,{filter:t})}function bV(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function aR(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(e,n,r,i,s=ee.min(),o=ee.min(),a=yt.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=u}withSequenceNumber(e){return new si(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new si(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new si(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new si(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xV{constructor(e){this.yt=e}}function LV(t){const e=PV({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?qm(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MV{constructor(){this.Cn=new VV}addToCollectionParentIndex(e,n){return this.Cn.add(n),x.resolve()}getCollectionParents(e,n){return x.resolve(this.Cn.getEntries(n))}addFieldIndex(e,n){return x.resolve()}deleteFieldIndex(e,n){return x.resolve()}deleteAllFieldIndexes(e){return x.resolve()}createTargetIndexes(e,n){return x.resolve()}getDocumentsMatchingTarget(e,n){return x.resolve(null)}getIndexType(e,n){return x.resolve(0)}getFieldIndexes(e,n){return x.resolve([])}getNextCollectionGroupToUpdate(e){return x.resolve(null)}getMinOffset(e,n){return x.resolve(Pi.min())}getMinOffsetFromCollectionGroup(e,n){return x.resolve(Pi.min())}updateCollectionGroup(e,n,r){return x.resolve()}updateIndexEntries(e,n){return x.resolve()}}class VV{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n]||new rt(Pe.comparator),s=!i.has(r);return this.index[n]=i.add(r),s}has(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n];return i&&i.has(r)}getEntries(e){return(this.index[e]||new rt(Pe.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mI={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},lR=41943040;class Ut{static withCacheSize(e){return new Ut(e,Ut.DEFAULT_COLLECTION_PERCENTILE,Ut.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,n,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=n,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ut.DEFAULT_COLLECTION_PERCENTILE=10,Ut.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ut.DEFAULT=new Ut(lR,Ut.DEFAULT_COLLECTION_PERCENTILE,Ut.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ut.DISABLED=new Ut(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $o{constructor(e){this.ar=e}next(){return this.ar+=2,this.ar}static ur(){return new $o(0)}static cr(){return new $o(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gI="LruGarbageCollector",FV=1048576;function _I([t,e],[n,r]){const i=le(t,n);return i===0?le(e,r):i}class UV{constructor(e){this.Ir=e,this.buffer=new rt(_I),this.Er=0}dr(){return++this.Er}Ar(e){const n=[e,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(n);else{const r=this.buffer.last();_I(n,r)<0&&(this.buffer=this.buffer.delete(r).add(n))}}get maxValue(){return this.buffer.last()[0]}}class BV{constructor(e,n,r){this.garbageCollector=e,this.asyncQueue=n,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(e){$(gI,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(n){na(n)?$(gI,"Ignoring IndexedDB error during garbage collection: ",n):await ta(n)}await this.Vr(3e5)})}}class zV{constructor(e,n){this.mr=e,this.params=n}calculateTargetCount(e,n){return this.mr.gr(e).next(r=>Math.floor(n/100*r))}nthSequenceNumber(e,n){if(n===0)return x.resolve(bd.ce);const r=new UV(n);return this.mr.forEachTarget(e,i=>r.Ar(i.sequenceNumber)).next(()=>this.mr.pr(e,i=>r.Ar(i))).next(()=>r.maxValue)}removeTargets(e,n,r){return this.mr.removeTargets(e,n,r)}removeOrphanedDocuments(e,n){return this.mr.removeOrphanedDocuments(e,n)}collect(e,n){return this.params.cacheSizeCollectionThreshold===-1?($("LruGarbageCollector","Garbage collection skipped; disabled"),x.resolve(mI)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?($("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),mI):this.yr(e,n))}getCacheSize(e){return this.mr.getCacheSize(e)}yr(e,n){let r,i,s,o,a,u,c;const d=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(f=>(f>this.params.maximumSequenceNumbersToCollect?($("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${f}`),i=this.params.maximumSequenceNumbersToCollect):i=f,o=Date.now(),this.nthSequenceNumber(e,i))).next(f=>(r=f,a=Date.now(),this.removeTargets(e,r,n))).next(f=>(s=f,u=Date.now(),this.removeOrphanedDocuments(e,r))).next(f=>(c=Date.now(),Ks()<=oe.DEBUG&&$("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-d}ms
	Determined least recently used ${i} in `+(a-o)+`ms
	Removed ${s} targets in `+(u-a)+`ms
	Removed ${f} documents in `+(c-u)+`ms
Total Duration: ${c-d}ms`),x.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:f})))}}function jV(t,e){return new zV(t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WV{constructor(){this.changes=new bs(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,Rt.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?x.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $V{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HV{constructor(e,n,r,i){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,n))).next(i=>(r!==null&&hl(r.mutation,i,xn.empty(),ke.now()),i))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,ue()).next(()=>r))}getLocalViewOfDocuments(e,n,r=ue()){const i=ns();return this.populateOverlays(e,i,n).next(()=>this.computeViews(e,n,i,r).next(s=>{let o=Wa();return s.forEach((a,u)=>{o=o.insert(a,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const r=ns();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,ue()))}populateOverlays(e,n,r){const i=[];return r.forEach(s=>{n.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,a)=>{n.set(o,a)})})}computeViews(e,n,r,i){let s=xr();const o=cl(),a=function(){return cl()}();return n.forEach((u,c)=>{const d=r.get(c.key);i.has(c.key)&&(d===void 0||d.mutation instanceof xs)?s=s.insert(c.key,c):d!==void 0?(o.set(c.key,d.mutation.getFieldMask()),hl(d.mutation,c,d.mutation.getFieldMask(),ke.now())):o.set(c.key,xn.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((c,d)=>o.set(c,d)),n.forEach((c,d)=>a.set(c,new $V(d,o.get(c)??null))),a))}recalculateAndSaveOverlays(e,n){const r=cl();let i=new ze((o,a)=>o-a),s=ue();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const a of o)a.keys().forEach(u=>{const c=n.get(u);if(c===null)return;let d=r.get(u)||xn.empty();d=a.applyToLocalView(c,d),r.set(u,d);const f=(i.get(a.batchId)||ue()).add(u);i=i.insert(a.batchId,f)})}).next(()=>{const o=[],a=i.getReverseIterator();for(;a.hasNext();){const u=a.getNext(),c=u.key,d=u.value,f=$A();d.forEach(m=>{if(!s.has(m)){const y=YA(n.get(m),r.get(m));y!==null&&f.set(m,y),s=s.add(m)}}),o.push(this.documentOverlayCache.saveOverlays(e,c,f))}return x.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,i){return function(o){return Q.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):qM(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,i):this.getDocumentsMatchingCollectionQuery(e,n,r,i)}getNextDocuments(e,n,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,i-s.size):x.resolve(ns());let a=Wl,u=s;return o.next(c=>x.forEach(c,(d,f)=>(a<f.largestBatchId&&(a=f.largestBatchId),s.get(d)?x.resolve():this.remoteDocumentCache.getEntry(e,d).next(m=>{u=u.insert(d,m)}))).next(()=>this.populateOverlays(e,c,s)).next(()=>this.computeViews(e,u,c,ue())).next(d=>({batchId:a,changes:WA(d)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new Q(n)).next(r=>{let i=Wa();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,n,r,i){const s=n.collectionGroup;let o=Wa();return this.indexManager.getCollectionParents(e,s).next(a=>x.forEach(a,u=>{const c=function(f,m){return new Md(m,null,f.explicitOrderBy.slice(),f.filters.slice(),f.limit,f.limitType,f.startAt,f.endAt)}(n,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,c,r,i).next(d=>{d.forEach((f,m)=>{o=o.insert(f,m)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,s,i))).next(o=>{s.forEach((u,c)=>{const d=c.getKey();o.get(d)===null&&(o=o.insert(d,Rt.newInvalidDocument(d)))});let a=Wa();return o.forEach((u,c)=>{const d=s.get(u);d!==void 0&&hl(d.mutation,c,xn.empty(),ke.now()),Fd(n,c)&&(a=a.insert(u,c))}),a})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qV{constructor(e){this.serializer=e,this.Lr=new Map,this.kr=new Map}getBundleMetadata(e,n){return x.resolve(this.Lr.get(n))}saveBundleMetadata(e,n){return this.Lr.set(n.id,function(i){return{id:i.id,version:i.version,createTime:ir(i.createTime)}}(n)),x.resolve()}getNamedQuery(e,n){return x.resolve(this.kr.get(n))}saveNamedQuery(e,n){return this.kr.set(n.name,function(i){return{name:i.name,query:LV(i.bundledQuery),readTime:ir(i.readTime)}}(n)),x.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GV{constructor(){this.overlays=new ze(Q.comparator),this.qr=new Map}getOverlay(e,n){return x.resolve(this.overlays.get(n))}getOverlays(e,n){const r=ns();return x.forEach(n,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((i,s)=>{this.St(e,n,s)}),x.resolve()}removeOverlaysForBatchId(e,n,r){const i=this.qr.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.qr.delete(r)),x.resolve()}getOverlaysForCollection(e,n,r){const i=ns(),s=n.length+1,o=new Q(n.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const u=a.getNext().value,c=u.getKey();if(!n.isPrefixOf(c.path))break;c.path.length===s&&u.largestBatchId>r&&i.set(u.getKey(),u)}return x.resolve(i)}getOverlaysForCollectionGroup(e,n,r,i){let s=new ze((c,d)=>c-d);const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===n&&c.largestBatchId>r){let d=s.get(c.largestBatchId);d===null&&(d=ns(),s=s.insert(c.largestBatchId,d)),d.set(c.getKey(),c)}}const a=ns(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((c,d)=>a.set(c,d)),!(a.size()>=i)););return x.resolve(a)}St(e,n,r){const i=this.overlays.get(r.key);if(i!==null){const o=this.qr.get(i.largestBatchId).delete(r.key);this.qr.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new hV(n,r));let s=this.qr.get(n);s===void 0&&(s=ue(),this.qr.set(n,s)),this.qr.set(n,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KV{constructor(){this.sessionToken=yt.EMPTY_BYTE_STRING}getSessionToken(e){return x.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,x.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iy{constructor(){this.Qr=new rt(ot.$r),this.Ur=new rt(ot.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(e,n){const r=new ot(e,n);this.Qr=this.Qr.add(r),this.Ur=this.Ur.add(r)}Wr(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Gr(new ot(e,n))}zr(e,n){e.forEach(r=>this.removeReference(r,n))}jr(e){const n=new Q(new Pe([])),r=new ot(n,e),i=new ot(n,e+1),s=[];return this.Ur.forEachInRange([r,i],o=>{this.Gr(o),s.push(o.key)}),s}Jr(){this.Qr.forEach(e=>this.Gr(e))}Gr(e){this.Qr=this.Qr.delete(e),this.Ur=this.Ur.delete(e)}Hr(e){const n=new Q(new Pe([])),r=new ot(n,e),i=new ot(n,e+1);let s=ue();return this.Ur.forEachInRange([r,i],o=>{s=s.add(o.key)}),s}containsKey(e){const n=new ot(e,0),r=this.Qr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class ot{constructor(e,n){this.key=e,this.Yr=n}static $r(e,n){return Q.comparator(e.key,n.key)||le(e.Yr,n.Yr)}static Kr(e,n){return le(e.Yr,n.Yr)||Q.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QV{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.tr=1,this.Zr=new rt(ot.$r)}checkEmpty(e){return x.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,i){const s=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new cV(s,n,r,i);this.mutationQueue.push(o);for(const a of i)this.Zr=this.Zr.add(new ot(a.key,s)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return x.resolve(o)}lookupMutationBatch(e,n){return x.resolve(this.Xr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,i=this.ei(r),s=i<0?0:i;return x.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return x.resolve(this.mutationQueue.length===0?G_:this.tr-1)}getAllMutationBatches(e){return x.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new ot(n,0),i=new ot(n,Number.POSITIVE_INFINITY),s=[];return this.Zr.forEachInRange([r,i],o=>{const a=this.Xr(o.Yr);s.push(a)}),x.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new rt(le);return n.forEach(i=>{const s=new ot(i,0),o=new ot(i,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([s,o],a=>{r=r.add(a.Yr)})}),x.resolve(this.ti(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,i=r.length+1;let s=r;Q.isDocumentKey(s)||(s=s.child(""));const o=new ot(new Q(s),0);let a=new rt(le);return this.Zr.forEachWhile(u=>{const c=u.key.path;return!!r.isPrefixOf(c)&&(c.length===i&&(a=a.add(u.Yr)),!0)},o),x.resolve(this.ti(a))}ti(e){const n=[];return e.forEach(r=>{const i=this.Xr(r);i!==null&&n.push(i)}),n}removeMutationBatch(e,n){me(this.ni(n.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Zr;return x.forEach(n.mutations,i=>{const s=new ot(i.key,n.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.Zr=r})}ir(e){}containsKey(e,n){const r=new ot(n,0),i=this.Zr.firstAfterOrEqual(r);return x.resolve(n.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,x.resolve()}ni(e,n){return this.ei(e)}ei(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Xr(e){const n=this.ei(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YV{constructor(e){this.ri=e,this.docs=function(){return new ze(Q.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,i=this.docs.get(r),s=i?i.size:0,o=this.ri(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return x.resolve(r?r.document.mutableCopy():Rt.newInvalidDocument(n))}getEntries(e,n){let r=xr();return n.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():Rt.newInvalidDocument(i))}),x.resolve(r)}getDocumentsMatchingQuery(e,n,r,i){let s=xr();const o=n.path,a=new Q(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(a);for(;u.hasNext();){const{key:c,value:{document:d}}=u.getNext();if(!o.isPrefixOf(c.path))break;c.path.length>o.length+1||SM(TM(d),r)<=0||(i.has(d.key)||Fd(n,d))&&(s=s.insert(d.key,d.mutableCopy()))}return x.resolve(s)}getAllFromCollectionGroup(e,n,r,i){J(9500)}ii(e,n){return x.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new XV(this)}getSize(e){return x.resolve(this.size)}}class XV extends WV{constructor(e){super(),this.Nr=e}applyChanges(e){const n=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?n.push(this.Nr.addEntry(e,i)):this.Nr.removeEntry(r)}),x.waitFor(n)}getFromCache(e,n){return this.Nr.getEntry(e,n)}getAllFromCache(e,n){return this.Nr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JV{constructor(e){this.persistence=e,this.si=new bs(n=>Y_(n),X_),this.lastRemoteSnapshotVersion=ee.min(),this.highestTargetId=0,this.oi=0,this._i=new iy,this.targetCount=0,this.ai=$o.ur()}forEachTarget(e,n){return this.si.forEach((r,i)=>n(i)),x.resolve()}getLastRemoteSnapshotVersion(e){return x.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return x.resolve(this.oi)}allocateTargetId(e){return this.highestTargetId=this.ai.next(),x.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.oi&&(this.oi=n),x.resolve()}Pr(e){this.si.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.ai=new $o(n),this.highestTargetId=n),e.sequenceNumber>this.oi&&(this.oi=e.sequenceNumber)}addTargetData(e,n){return this.Pr(n),this.targetCount+=1,x.resolve()}updateTargetData(e,n){return this.Pr(n),x.resolve()}removeTargetData(e,n){return this.si.delete(n.target),this._i.jr(n.targetId),this.targetCount-=1,x.resolve()}removeTargets(e,n,r){let i=0;const s=[];return this.si.forEach((o,a)=>{a.sequenceNumber<=n&&r.get(a.targetId)===null&&(this.si.delete(o),s.push(this.removeMatchingKeysForTargetId(e,a.targetId)),i++)}),x.waitFor(s).next(()=>i)}getTargetCount(e){return x.resolve(this.targetCount)}getTargetData(e,n){const r=this.si.get(n)||null;return x.resolve(r)}addMatchingKeys(e,n,r){return this._i.Wr(n,r),x.resolve()}removeMatchingKeys(e,n,r){this._i.zr(n,r);const i=this.persistence.referenceDelegate,s=[];return i&&n.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),x.waitFor(s)}removeMatchingKeysForTargetId(e,n){return this._i.jr(n),x.resolve()}getMatchingKeysForTargetId(e,n){const r=this._i.Hr(n);return x.resolve(r)}containsKey(e,n){return x.resolve(this._i.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uR{constructor(e,n){this.ui={},this.overlays={},this.ci=new bd(0),this.li=!1,this.li=!0,this.hi=new KV,this.referenceDelegate=e(this),this.Pi=new JV(this),this.indexManager=new MV,this.remoteDocumentCache=function(i){return new YV(i)}(r=>this.referenceDelegate.Ti(r)),this.serializer=new xV(n),this.Ii=new qV(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new GV,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this.ui[e.toKey()];return r||(r=new QV(n,this.referenceDelegate),this.ui[e.toKey()]=r),r}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(e,n,r){$("MemoryPersistence","Starting transaction:",e);const i=new ZV(this.ci.next());return this.referenceDelegate.Ei(),r(i).next(s=>this.referenceDelegate.di(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Ai(e,n){return x.or(Object.values(this.ui).map(r=>()=>r.containsKey(e,n)))}}class ZV extends AM{constructor(e){super(),this.currentSequenceNumber=e}}class sy{constructor(e){this.persistence=e,this.Ri=new iy,this.Vi=null}static mi(e){return new sy(e)}get fi(){if(this.Vi)return this.Vi;throw J(60996)}addReference(e,n,r){return this.Ri.addReference(r,n),this.fi.delete(r.toString()),x.resolve()}removeReference(e,n,r){return this.Ri.removeReference(r,n),this.fi.add(r.toString()),x.resolve()}markPotentiallyOrphaned(e,n){return this.fi.add(n.toString()),x.resolve()}removeTarget(e,n){this.Ri.jr(n.targetId).forEach(i=>this.fi.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(i=>{i.forEach(s=>this.fi.add(s.toString()))}).next(()=>r.removeTargetData(e,n))}Ei(){this.Vi=new Set}di(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return x.forEach(this.fi,r=>{const i=Q.fromPath(r);return this.gi(e,i).next(s=>{s||n.removeEntry(i,ee.min())})}).next(()=>(this.Vi=null,n.apply(e)))}updateLimboDocument(e,n){return this.gi(e,n).next(r=>{r?this.fi.delete(n.toString()):this.fi.add(n.toString())})}Ti(e){return 0}gi(e,n){return x.or([()=>x.resolve(this.Ri.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Ai(e,n)])}}class Bh{constructor(e,n){this.persistence=e,this.pi=new bs(r=>kM(r.path),(r,i)=>r.isEqual(i)),this.garbageCollector=jV(this,n)}static mi(e,n){return new Bh(e,n)}Ei(){}di(e){return x.resolve()}forEachTarget(e,n){return this.persistence.getTargetCache().forEachTarget(e,n)}gr(e){const n=this.wr(e);return this.persistence.getTargetCache().getTargetCount(e).next(r=>n.next(i=>r+i))}wr(e){let n=0;return this.pr(e,r=>{n++}).next(()=>n)}pr(e,n){return x.forEach(this.pi,(r,i)=>this.br(e,r,i).next(s=>s?x.resolve():n(i)))}removeTargets(e,n,r){return this.persistence.getTargetCache().removeTargets(e,n,r)}removeOrphanedDocuments(e,n){let r=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.ii(e,o=>this.br(e,o,n).next(a=>{a||(r++,s.removeEntry(o,ee.min()))})).next(()=>s.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,n){return this.pi.set(n,e.currentSequenceNumber),x.resolve()}removeTarget(e,n){const r=n.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,n,r){return this.pi.set(r,e.currentSequenceNumber),x.resolve()}removeReference(e,n,r){return this.pi.set(r,e.currentSequenceNumber),x.resolve()}updateLimboDocument(e,n){return this.pi.set(n,e.currentSequenceNumber),x.resolve()}Ti(e){let n=e.key.toString().length;return e.isFoundDocument()&&(n+=Mc(e.data.value)),n}br(e,n,r){return x.or([()=>this.persistence.Ai(e,n),()=>this.persistence.getTargetCache().containsKey(e,n),()=>{const i=this.pi.get(n);return x.resolve(i!==void 0&&i>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oy{constructor(e,n,r,i){this.targetId=e,this.fromCache=n,this.Es=r,this.ds=i}static As(e,n){let r=ue(),i=ue();for(const s of n.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new oy(e,n.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e2{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t2{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=function(){return SD()?8:RM(Nt())>0?6:4}()}initialize(e,n){this.ps=e,this.indexManager=n,this.Rs=!0}getDocumentsMatchingQuery(e,n,r,i){const s={result:null};return this.ys(e,n).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.ws(e,n,i,r).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new e2;return this.Ss(e,n,o).next(a=>{if(s.result=a,this.Vs)return this.bs(e,n,o,a.size)})}).next(()=>s.result)}bs(e,n,r,i){return r.documentReadCount<this.fs?(Ks()<=oe.DEBUG&&$("QueryEngine","SDK will not create cache indexes for query:",Qs(n),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),x.resolve()):(Ks()<=oe.DEBUG&&$("QueryEngine","Query:",Qs(n),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.gs*i?(Ks()<=oe.DEBUG&&$("QueryEngine","The SDK decides to create cache indexes for query:",Qs(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,rr(n))):x.resolve())}ys(e,n){if(sI(n))return x.resolve(null);let r=rr(n);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(n.limit!==null&&i===1&&(n=qm(n,null,"F"),r=rr(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const o=ue(...s);return this.ps.getDocuments(e,o).next(a=>this.indexManager.getMinOffset(e,r).next(u=>{const c=this.Ds(n,a);return this.Cs(n,c,o,u.readTime)?this.ys(e,qm(n,null,"F")):this.vs(e,c,n,u)}))})))}ws(e,n,r,i){return sI(n)||i.isEqual(ee.min())?x.resolve(null):this.ps.getDocuments(e,r).next(s=>{const o=this.Ds(n,s);return this.Cs(n,o,r,i)?x.resolve(null):(Ks()<=oe.DEBUG&&$("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),Qs(n)),this.vs(e,o,n,IM(i,Wl)).next(a=>a))})}Ds(e,n){let r=new rt(zA(e));return n.forEach((i,s)=>{Fd(e,s)&&(r=r.add(s))}),r}Cs(e,n,r,i){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const s=e.limitType==="F"?n.last():n.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}Ss(e,n,r){return Ks()<=oe.DEBUG&&$("QueryEngine","Using full collection scan to execute query:",Qs(n)),this.ps.getDocumentsMatchingQuery(e,n,Pi.min(),r)}vs(e,n,r,i){return this.ps.getDocumentsMatchingQuery(e,r,i).next(s=>(n.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ay="LocalStore",n2=3e8;class r2{constructor(e,n,r,i){this.persistence=e,this.Fs=n,this.serializer=i,this.Ms=new ze(le),this.xs=new bs(s=>Y_(s),X_),this.Os=new Map,this.Ns=e.getRemoteDocumentCache(),this.Pi=e.getTargetCache(),this.Ii=e.getBundleCache(),this.Bs(r)}Bs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new HV(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.Ms))}}function i2(t,e,n,r){return new r2(t,e,n,r)}async function cR(t,e){const n=te(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let i;return n.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,n.Bs(e),n.mutationQueue.getAllMutationBatches(r))).next(s=>{const o=[],a=[];let u=ue();for(const c of i){o.push(c.batchId);for(const d of c.mutations)u=u.add(d.key)}for(const c of s){a.push(c.batchId);for(const d of c.mutations)u=u.add(d.key)}return n.localDocuments.getDocuments(r,u).next(c=>({Ls:c,removedBatchIds:o,addedBatchIds:a}))})})}function s2(t,e){const n=te(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=n.Ns.newChangeBuffer({trackRemovals:!0});return function(a,u,c,d){const f=c.batch,m=f.keys();let y=x.resolve();return m.forEach(C=>{y=y.next(()=>d.getEntry(u,C)).next(N=>{const b=c.docVersions.get(C);me(b!==null,48541),N.version.compareTo(b)<0&&(f.applyToRemoteDocument(N,c),N.isValidDocument()&&(N.setReadTime(c.commitVersion),d.addEntry(N)))})}),y.next(()=>a.mutationQueue.removeMutationBatch(u,f))}(n,r,e,s).next(()=>s.apply(r)).next(()=>n.mutationQueue.performConsistencyCheck(r)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(a){let u=ue();for(let c=0;c<a.mutationResults.length;++c)a.mutationResults[c].transformResults.length>0&&(u=u.add(a.batch.mutations[c].key));return u}(e))).next(()=>n.localDocuments.getDocuments(r,i))})}function hR(t){const e=te(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Pi.getLastRemoteSnapshotVersion(n))}function o2(t,e){const n=te(t),r=e.snapshotVersion;let i=n.Ms;return n.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=n.Ns.newChangeBuffer({trackRemovals:!0});i=n.Ms;const a=[];e.targetChanges.forEach((d,f)=>{const m=i.get(f);if(!m)return;a.push(n.Pi.removeMatchingKeys(s,d.removedDocuments,f).next(()=>n.Pi.addMatchingKeys(s,d.addedDocuments,f)));let y=m.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(f)!==null?y=y.withResumeToken(yt.EMPTY_BYTE_STRING,ee.min()).withLastLimboFreeSnapshotVersion(ee.min()):d.resumeToken.approximateByteSize()>0&&(y=y.withResumeToken(d.resumeToken,r)),i=i.insert(f,y),function(N,b,S){return N.resumeToken.approximateByteSize()===0||b.snapshotVersion.toMicroseconds()-N.snapshotVersion.toMicroseconds()>=n2?!0:S.addedDocuments.size+S.modifiedDocuments.size+S.removedDocuments.size>0}(m,y,d)&&a.push(n.Pi.updateTargetData(s,y))});let u=xr(),c=ue();if(e.documentUpdates.forEach(d=>{e.resolvedLimboDocuments.has(d)&&a.push(n.persistence.referenceDelegate.updateLimboDocument(s,d))}),a.push(a2(s,o,e.documentUpdates).next(d=>{u=d.ks,c=d.qs})),!r.isEqual(ee.min())){const d=n.Pi.getLastRemoteSnapshotVersion(s).next(f=>n.Pi.setTargetsMetadata(s,s.currentSequenceNumber,r));a.push(d)}return x.waitFor(a).next(()=>o.apply(s)).next(()=>n.localDocuments.getLocalViewOfDocuments(s,u,c)).next(()=>u)}).then(s=>(n.Ms=i,s))}function a2(t,e,n){let r=ue(),i=ue();return n.forEach(s=>r=r.add(s)),e.getEntries(t,r).next(s=>{let o=xr();return n.forEach((a,u)=>{const c=s.get(a);u.isFoundDocument()!==c.isFoundDocument()&&(i=i.add(a)),u.isNoDocument()&&u.version.isEqual(ee.min())?(e.removeEntry(a,u.readTime),o=o.insert(a,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),o=o.insert(a,u)):$(ay,"Ignoring outdated watch update for ",a,". Current version:",c.version," Watch version:",u.version)}),{ks:o,qs:i}})}function l2(t,e){const n=te(t);return n.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=G_),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function u2(t,e){const n=te(t);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return n.Pi.getTargetData(r,e).next(s=>s?(i=s,x.resolve(i)):n.Pi.allocateTargetId(r).next(o=>(i=new si(e,o,"TargetPurposeListen",r.currentSequenceNumber),n.Pi.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=n.Ms.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(n.Ms=n.Ms.insert(r.targetId,r),n.xs.set(e,r.targetId)),r})}async function Xm(t,e,n){const r=te(t),i=r.Ms.get(e),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,o=>r.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!na(o))throw o;$(ay,`Failed to update sequence numbers for target ${e}: ${o}`)}r.Ms=r.Ms.remove(e),r.xs.delete(i.target)}function yI(t,e,n){const r=te(t);let i=ee.min(),s=ue();return r.persistence.runTransaction("Execute query","readwrite",o=>function(u,c,d){const f=te(u),m=f.xs.get(d);return m!==void 0?x.resolve(f.Ms.get(m)):f.Pi.getTargetData(c,d)}(r,o,rr(e)).next(a=>{if(a)return i=a.lastLimboFreeSnapshotVersion,r.Pi.getMatchingKeysForTargetId(o,a.targetId).next(u=>{s=u})}).next(()=>r.Fs.getDocumentsMatchingQuery(o,e,n?i:ee.min(),n?s:ue())).next(a=>(c2(r,KM(e),a),{documents:a,Qs:s})))}function c2(t,e,n){let r=t.Os.get(e)||ee.min();n.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),t.Os.set(e,r)}class vI{constructor(){this.activeTargetIds=eV()}zs(e){this.activeTargetIds=this.activeTargetIds.add(e)}js(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Gs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class h2{constructor(){this.Mo=new vI,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.Mo.zs(e),this.xo[e]||"not-current"}updateQueryState(e,n,r){this.xo[e]=n}removeLocalQueryTarget(e){this.Mo.js(e)}isLocalQueryTarget(e){return this.Mo.activeTargetIds.has(e)}clearQueryState(e){delete this.xo[e]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(e){return this.Mo.activeTargetIds.has(e)}start(){return this.Mo=new vI,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d2{Oo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const EI="ConnectivityMonitor";class wI{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(e){this.qo.push(e)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){$(EI,"Network connectivity changed: AVAILABLE");for(const e of this.qo)e(0)}ko(){$(EI,"Network connectivity changed: UNAVAILABLE");for(const e of this.qo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let yc=null;function Jm(){return yc===null?yc=function(){return 268435456+Math.round(2147483648*Math.random())}():yc++,"0x"+yc.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const up="RestConnection",f2={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class p2{get $o(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const n=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Uo=n+"://"+e.host,this.Ko=`projects/${r}/databases/${i}`,this.Wo=this.databaseId.database===xh?`project_id=${r}`:`project_id=${r}&database_id=${i}`}Go(e,n,r,i,s){const o=Jm(),a=this.zo(e,n.toUriEncodedString());$(up,`Sending RPC '${e}' ${o}:`,a,r);const u={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(u,i,s);const{host:c}=new URL(a),d=Vi(c);return this.Jo(e,a,u,r,d).then(f=>($(up,`Received RPC '${e}' ${o}: `,f),f),f=>{throw Bo(up,`RPC '${e}' ${o} failed with error: `,f,"url: ",a,"request:",r),f})}Ho(e,n,r,i,s,o){return this.Go(e,n,r,i,s)}jo(e,n,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+ea}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((i,s)=>e[s]=i),r&&r.headers.forEach((i,s)=>e[s]=i)}zo(e,n){const r=f2[e];return`${this.Uo}/v1/${n}:${r}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m2{constructor(e){this.Yo=e.Yo,this.Zo=e.Zo}Xo(e){this.e_=e}t_(e){this.n_=e}r_(e){this.i_=e}onMessage(e){this.s_=e}close(){this.Zo()}send(e){this.Yo(e)}o_(){this.e_()}__(){this.n_()}a_(e){this.i_(e)}u_(e){this.s_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const St="WebChannelConnection";class g2 extends p2{constructor(e){super(e),this.c_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,n,r,i,s){const o=Jm();return new Promise((a,u)=>{const c=new pA;c.setWithCredentials(!0),c.listenOnce(mA.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Lc.NO_ERROR:const f=c.getResponseJson();$(St,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(f)),a(f);break;case Lc.TIMEOUT:$(St,`RPC '${e}' ${o} timed out`),u(new G(L.DEADLINE_EXCEEDED,"Request time out"));break;case Lc.HTTP_ERROR:const m=c.getStatus();if($(St,`RPC '${e}' ${o} failed with status:`,m,"response text:",c.getResponseText()),m>0){let y=c.getResponseJson();Array.isArray(y)&&(y=y[0]);const C=y==null?void 0:y.error;if(C&&C.status&&C.message){const N=function(S){const v=S.toLowerCase().replace(/_/g,"-");return Object.values(L).indexOf(v)>=0?v:L.UNKNOWN}(C.status);u(new G(N,C.message))}else u(new G(L.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new G(L.UNAVAILABLE,"Connection failed."));break;default:J(9055,{l_:e,streamId:o,h_:c.getLastErrorCode(),P_:c.getLastError()})}}finally{$(St,`RPC '${e}' ${o} completed.`)}});const d=JSON.stringify(i);$(St,`RPC '${e}' ${o} sending request:`,i),c.send(n,"POST",d,r,15)})}T_(e,n,r){const i=Jm(),s=[this.Uo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=yA(),a=_A(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.useFetchStreams=!0),this.jo(u.initMessageHeaders,n,r),u.encodeInitMessageHeaders=!0;const d=s.join("");$(St,`Creating RPC '${e}' stream ${i}: ${d}`,u);const f=o.createWebChannel(d,u);this.I_(f);let m=!1,y=!1;const C=new m2({Yo:b=>{y?$(St,`Not sending because RPC '${e}' stream ${i} is closed:`,b):(m||($(St,`Opening RPC '${e}' stream ${i} transport.`),f.open(),m=!0),$(St,`RPC '${e}' stream ${i} sending:`,b),f.send(b))},Zo:()=>f.close()}),N=(b,S,v)=>{b.listen(S,A=>{try{v(A)}catch(O){setTimeout(()=>{throw O},0)}})};return N(f,ja.EventType.OPEN,()=>{y||($(St,`RPC '${e}' stream ${i} transport opened.`),C.o_())}),N(f,ja.EventType.CLOSE,()=>{y||(y=!0,$(St,`RPC '${e}' stream ${i} transport closed`),C.a_(),this.E_(f))}),N(f,ja.EventType.ERROR,b=>{y||(y=!0,Bo(St,`RPC '${e}' stream ${i} transport errored. Name:`,b.name,"Message:",b.message),C.a_(new G(L.UNAVAILABLE,"The operation could not be completed")))}),N(f,ja.EventType.MESSAGE,b=>{var S;if(!y){const v=b.data[0];me(!!v,16349);const A=v,O=(A==null?void 0:A.error)||((S=A[0])==null?void 0:S.error);if(O){$(St,`RPC '${e}' stream ${i} received error:`,O);const j=O.status;let z=function(E){const T=Ge[E];if(T!==void 0)return JA(T)}(j),w=O.message;z===void 0&&(z=L.INTERNAL,w="Unknown error status: "+j+" with message "+O.message),y=!0,C.a_(new G(z,w)),f.close()}else $(St,`RPC '${e}' stream ${i} received:`,v),C.u_(v)}}),N(a,gA.STAT_EVENT,b=>{b.stat===Bm.PROXY?$(St,`RPC '${e}' stream ${i} detected buffering proxy`):b.stat===Bm.NOPROXY&&$(St,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{C.__()},0),C}terminate(){this.c_.forEach(e=>e.close()),this.c_=[]}I_(e){this.c_.push(e)}E_(e){this.c_=this.c_.filter(n=>n===e)}}function cp(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jd(t){return new EV(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dR{constructor(e,n,r=1e3,i=1.5,s=6e4){this.Mi=e,this.timerId=n,this.d_=r,this.A_=i,this.R_=s,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();const n=Math.floor(this.V_+this.y_()),r=Math.max(0,Date.now()-this.f_),i=Math.max(0,n-r);i>0&&$("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.V_} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,i,()=>(this.f_=Date.now(),e())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const II="PersistentStream";class fR{constructor(e,n,r,i,s,o,a,u){this.Mi=e,this.S_=r,this.b_=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=u,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new dR(e,n)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(e){this.Q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,n){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():n&&n.code===L.RESOURCE_EXHAUSTED?(Or(n.toString()),Or("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):n&&n.code===L.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.r_(n)}K_(){}auth(){this.state=1;const e=this.W_(this.D_),n=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.D_===n&&this.G_(r,i)},r=>{e(()=>{const i=new G(L.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(i)})})}G_(e,n){const r=this.W_(this.D_);this.stream=this.j_(e,n),this.stream.Xo(()=>{r(()=>this.listener.Xo())}),this.stream.t_(()=>{r(()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.t_()))}),this.stream.r_(i=>{r(()=>this.z_(i))}),this.stream.onMessage(i=>{r(()=>++this.F_==1?this.J_(i):this.onNext(i))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return $(II,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return n=>{this.Mi.enqueueAndForget(()=>this.D_===e?n():($(II,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class _2 extends fR{constructor(e,n,r,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}j_(e,n){return this.connection.T_("Listen",e,n)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const n=TV(this.serializer,e),r=function(s){if(!("targetChange"in s))return ee.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?ee.min():o.readTime?ir(o.readTime):ee.min()}(e);return this.listener.H_(n,r)}Y_(e){const n={};n.database=Ym(this.serializer),n.addTarget=function(s,o){let a;const u=o.target;if(a=Hm(u)?{documents:AV(s,u)}:{query:RV(s,u).ft},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=tR(s,o.resumeToken);const c=Gm(s,o.expectedCount);c!==null&&(a.expectedCount=c)}else if(o.snapshotVersion.compareTo(ee.min())>0){a.readTime=Uh(s,o.snapshotVersion.toTimestamp());const c=Gm(s,o.expectedCount);c!==null&&(a.expectedCount=c)}return a}(this.serializer,e);const r=kV(this.serializer,e);r&&(n.labels=r),this.q_(n)}Z_(e){const n={};n.database=Ym(this.serializer),n.removeTarget=e,this.q_(n)}}class y2 extends fR{constructor(e,n,r,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(e,n){return this.connection.T_("Write",e,n)}J_(e){return me(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,me(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){me(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const n=CV(e.writeResults,e.commitTime),r=ir(e.commitTime);return this.listener.na(r,n)}ra(){const e={};e.database=Ym(this.serializer),this.q_(e)}ea(e){const n={streamToken:this.lastStreamToken,writes:e.map(r=>SV(this.serializer,r))};this.q_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v2{}class E2 extends v2{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.ia=!1}sa(){if(this.ia)throw new G(L.FAILED_PRECONDITION,"The client has already been terminated.")}Go(e,n,r,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Go(e,Km(n,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===L.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new G(L.UNKNOWN,s.toString())})}Ho(e,n,r,i,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Ho(e,Km(n,r),i,o,a,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===L.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new G(L.UNKNOWN,o.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class w2{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(Or(n),this.aa=!1):$("OnlineStateTracker",n)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ws="RemoteStore";class I2{constructor(e,n,r,i,s){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=s,this.Aa.Oo(o=>{r.enqueueAndForget(async()=>{Ls(this)&&($(ws,"Restarting streams for network reachability change."),await async function(u){const c=te(u);c.Ea.add(4),await wu(c),c.Ra.set("Unknown"),c.Ea.delete(4),await Wd(c)}(this))})}),this.Ra=new w2(r,i)}}async function Wd(t){if(Ls(t))for(const e of t.da)await e(!0)}async function wu(t){for(const e of t.da)await e(!1)}function pR(t,e){const n=te(t);n.Ia.has(e.targetId)||(n.Ia.set(e.targetId,e),hy(n)?cy(n):ra(n).O_()&&uy(n,e))}function ly(t,e){const n=te(t),r=ra(n);n.Ia.delete(e),r.O_()&&mR(n,e),n.Ia.size===0&&(r.O_()?r.L_():Ls(n)&&n.Ra.set("Unknown"))}function uy(t,e){if(t.Va.Ue(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ee.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}ra(t).Y_(e)}function mR(t,e){t.Va.Ue(e),ra(t).Z_(e)}function cy(t){t.Va=new gV({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),At:e=>t.Ia.get(e)||null,ht:()=>t.datastore.serializer.databaseId}),ra(t).start(),t.Ra.ua()}function hy(t){return Ls(t)&&!ra(t).x_()&&t.Ia.size>0}function Ls(t){return te(t).Ea.size===0}function gR(t){t.Va=void 0}async function T2(t){t.Ra.set("Online")}async function S2(t){t.Ia.forEach((e,n)=>{uy(t,e)})}async function C2(t,e){gR(t),hy(t)?(t.Ra.ha(e),cy(t)):t.Ra.set("Unknown")}async function A2(t,e,n){if(t.Ra.set("Online"),e instanceof eR&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const a of s.targetIds)i.Ia.has(a)&&(await i.remoteSyncer.rejectListen(a,o),i.Ia.delete(a),i.Va.removeTarget(a))}(t,e)}catch(r){$(ws,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await zh(t,r)}else if(e instanceof Uc?t.Va.Ze(e):e instanceof ZA?t.Va.st(e):t.Va.tt(e),!n.isEqual(ee.min()))try{const r=await hR(t.localStore);n.compareTo(r)>=0&&await function(s,o){const a=s.Va.Tt(o);return a.targetChanges.forEach((u,c)=>{if(u.resumeToken.approximateByteSize()>0){const d=s.Ia.get(c);d&&s.Ia.set(c,d.withResumeToken(u.resumeToken,o))}}),a.targetMismatches.forEach((u,c)=>{const d=s.Ia.get(u);if(!d)return;s.Ia.set(u,d.withResumeToken(yt.EMPTY_BYTE_STRING,d.snapshotVersion)),mR(s,u);const f=new si(d.target,u,c,d.sequenceNumber);uy(s,f)}),s.remoteSyncer.applyRemoteEvent(a)}(t,n)}catch(r){$(ws,"Failed to raise snapshot:",r),await zh(t,r)}}async function zh(t,e,n){if(!na(e))throw e;t.Ea.add(1),await wu(t),t.Ra.set("Offline"),n||(n=()=>hR(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{$(ws,"Retrying IndexedDB access"),await n(),t.Ea.delete(1),await Wd(t)})}function _R(t,e){return e().catch(n=>zh(t,n,e))}async function $d(t){const e=te(t),n=Oi(e);let r=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:G_;for(;R2(e);)try{const i=await l2(e.localStore,r);if(i===null){e.Ta.length===0&&n.L_();break}r=i.batchId,P2(e,i)}catch(i){await zh(e,i)}yR(e)&&vR(e)}function R2(t){return Ls(t)&&t.Ta.length<10}function P2(t,e){t.Ta.push(e);const n=Oi(t);n.O_()&&n.X_&&n.ea(e.mutations)}function yR(t){return Ls(t)&&!Oi(t).x_()&&t.Ta.length>0}function vR(t){Oi(t).start()}async function k2(t){Oi(t).ra()}async function N2(t){const e=Oi(t);for(const n of t.Ta)e.ea(n.mutations)}async function D2(t,e,n){const r=t.Ta.shift(),i=ty.from(r,e,n);await _R(t,()=>t.remoteSyncer.applySuccessfulWrite(i)),await $d(t)}async function O2(t,e){e&&Oi(t).X_&&await async function(r,i){if(function(o){return fV(o)&&o!==L.ABORTED}(i.code)){const s=r.Ta.shift();Oi(r).B_(),await _R(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await $d(r)}}(t,e),yR(t)&&vR(t)}async function TI(t,e){const n=te(t);n.asyncQueue.verifyOperationInProgress(),$(ws,"RemoteStore received new credentials");const r=Ls(n);n.Ea.add(3),await wu(n),r&&n.Ra.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.Ea.delete(3),await Wd(n)}async function b2(t,e){const n=te(t);e?(n.Ea.delete(2),await Wd(n)):e||(n.Ea.add(2),await wu(n),n.Ra.set("Unknown"))}function ra(t){return t.ma||(t.ma=function(n,r,i){const s=te(n);return s.sa(),new _2(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Xo:T2.bind(null,t),t_:S2.bind(null,t),r_:C2.bind(null,t),H_:A2.bind(null,t)}),t.da.push(async e=>{e?(t.ma.B_(),hy(t)?cy(t):t.Ra.set("Unknown")):(await t.ma.stop(),gR(t))})),t.ma}function Oi(t){return t.fa||(t.fa=function(n,r,i){const s=te(n);return s.sa(),new y2(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Xo:()=>Promise.resolve(),t_:k2.bind(null,t),r_:O2.bind(null,t),ta:N2.bind(null,t),na:D2.bind(null,t)}),t.da.push(async e=>{e?(t.fa.B_(),await $d(t)):(await t.fa.stop(),t.Ta.length>0&&($(ws,`Stopping write stream with ${t.Ta.length} pending writes`),t.Ta=[]))})),t.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dy{constructor(e,n,r,i,s){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new Tr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,i,s){const o=Date.now()+r,a=new dy(e,n,o,i,s);return a.start(r),a}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new G(L.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function fy(t,e){if(Or("AsyncQueue",`${e}: ${t}`),na(t))return new G(L.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eo{static emptySet(e){return new Eo(e.comparator)}constructor(e){this.comparator=e?(n,r)=>e(n,r)||Q.comparator(n.key,r.key):(n,r)=>Q.comparator(n.key,r.key),this.keyedMap=Wa(),this.sortedSet=new ze(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,r)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof Eo)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new Eo;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SI{constructor(){this.ga=new ze(Q.comparator)}track(e){const n=e.doc.key,r=this.ga.get(n);r?e.type!==0&&r.type===3?this.ga=this.ga.insert(n,e):e.type===3&&r.type!==1?this.ga=this.ga.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.ga=this.ga.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.ga=this.ga.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.ga=this.ga.remove(n):e.type===1&&r.type===2?this.ga=this.ga.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.ga=this.ga.insert(n,{type:2,doc:e.doc}):J(63341,{Rt:e,pa:r}):this.ga=this.ga.insert(n,e)}ya(){const e=[];return this.ga.inorderTraversal((n,r)=>{e.push(r)}),e}}class Ho{constructor(e,n,r,i,s,o,a,u,c){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,n,r,i,s){const o=[];return n.forEach(a=>{o.push({type:0,doc:a})}),new Ho(e,n,Eo.emptySet(n),o,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Vd(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let i=0;i<n.length;i++)if(n[i].type!==r[i].type||!n[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x2{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(e=>e.Da())}}class L2{constructor(){this.queries=CI(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(n,r){const i=te(n),s=i.queries;i.queries=CI(),s.forEach((o,a)=>{for(const u of a.Sa)u.onError(r)})})(this,new G(L.ABORTED,"Firestore shutting down"))}}function CI(){return new bs(t=>BA(t),Vd)}async function ER(t,e){const n=te(t);let r=3;const i=e.query;let s=n.queries.get(i);s?!s.ba()&&e.Da()&&(r=2):(s=new x2,r=e.Da()?0:1);try{switch(r){case 0:s.wa=await n.onListen(i,!0);break;case 1:s.wa=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const a=fy(o,`Initialization of query '${Qs(e.query)}' failed`);return void e.onError(a)}n.queries.set(i,s),s.Sa.push(e),e.va(n.onlineState),s.wa&&e.Fa(s.wa)&&py(n)}async function wR(t,e){const n=te(t),r=e.query;let i=3;const s=n.queries.get(r);if(s){const o=s.Sa.indexOf(e);o>=0&&(s.Sa.splice(o,1),s.Sa.length===0?i=e.Da()?0:1:!s.ba()&&e.Da()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function M2(t,e){const n=te(t);let r=!1;for(const i of e){const s=i.query,o=n.queries.get(s);if(o){for(const a of o.Sa)a.Fa(i)&&(r=!0);o.wa=i}}r&&py(n)}function V2(t,e,n){const r=te(t),i=r.queries.get(e);if(i)for(const s of i.Sa)s.onError(n);r.queries.delete(e)}function py(t){t.Ca.forEach(e=>{e.next()})}var Zm,AI;(AI=Zm||(Zm={})).Ma="default",AI.Cache="cache";class IR{constructor(e,n,r){this.query=e,this.xa=n,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=r||{}}Fa(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new Ho(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),n=!0):this.La(e,this.onlineState)&&(this.ka(e),n=!0),this.Na=e,n}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let n=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),n=!0),n}La(e,n){if(!e.fromCache||!this.Da())return!0;const r=n!=="Offline";return(!this.options.qa||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const n=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}ka(e){e=Ho.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==Zm.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TR{constructor(e){this.key=e}}class SR{constructor(e){this.key=e}}class F2{constructor(e,n){this.query=e,this.Ya=n,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=ue(),this.mutatedKeys=ue(),this.eu=zA(e),this.tu=new Eo(this.eu)}get nu(){return this.Ya}ru(e,n){const r=n?n.iu:new SI,i=n?n.tu:this.tu;let s=n?n.mutatedKeys:this.mutatedKeys,o=i,a=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,c=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((d,f)=>{const m=i.get(d),y=Fd(this.query,f)?f:null,C=!!m&&this.mutatedKeys.has(m.key),N=!!y&&(y.hasLocalMutations||this.mutatedKeys.has(y.key)&&y.hasCommittedMutations);let b=!1;m&&y?m.data.isEqual(y.data)?C!==N&&(r.track({type:3,doc:y}),b=!0):this.su(m,y)||(r.track({type:2,doc:y}),b=!0,(u&&this.eu(y,u)>0||c&&this.eu(y,c)<0)&&(a=!0)):!m&&y?(r.track({type:0,doc:y}),b=!0):m&&!y&&(r.track({type:1,doc:m}),b=!0,(u||c)&&(a=!0)),b&&(y?(o=o.add(y),s=N?s.add(d):s.delete(d)):(o=o.delete(d),s=s.delete(d)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const d=this.query.limitType==="F"?o.last():o.first();o=o.delete(d.key),s=s.delete(d.key),r.track({type:1,doc:d})}return{tu:o,iu:r,Cs:a,mutatedKeys:s}}su(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,i){const s=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const o=e.iu.ya();o.sort((d,f)=>function(y,C){const N=b=>{switch(b){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return J(20277,{Rt:b})}};return N(y)-N(C)}(d.type,f.type)||this.eu(d.doc,f.doc)),this.ou(r),i=i??!1;const a=n&&!i?this._u():[],u=this.Xa.size===0&&this.current&&!i?1:0,c=u!==this.Za;return this.Za=u,o.length!==0||c?{snapshot:new Ho(this.query,e.tu,s,o,e.mutatedKeys,u===0,c,!1,!!r&&r.resumeToken.approximateByteSize()>0),au:a}:{au:a}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new SI,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(e){return!this.Ya.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach(n=>this.Ya=this.Ya.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ya=this.Ya.delete(n)),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Xa;this.Xa=ue(),this.tu.forEach(r=>{this.uu(r.key)&&(this.Xa=this.Xa.add(r.key))});const n=[];return e.forEach(r=>{this.Xa.has(r)||n.push(new SR(r))}),this.Xa.forEach(r=>{e.has(r)||n.push(new TR(r))}),n}cu(e){this.Ya=e.Qs,this.Xa=ue();const n=this.ru(e.documents);return this.applyChanges(n,!0)}lu(){return Ho.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const my="SyncEngine";class U2{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class B2{constructor(e){this.key=e,this.hu=!1}}class z2{constructor(e,n,r,i,s,o){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Pu={},this.Tu=new bs(a=>BA(a),Vd),this.Iu=new Map,this.Eu=new Set,this.du=new ze(Q.comparator),this.Au=new Map,this.Ru=new iy,this.Vu={},this.mu=new Map,this.fu=$o.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function j2(t,e,n=!0){const r=NR(t);let i;const s=r.Tu.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.lu()):i=await CR(r,e,n,!0),i}async function W2(t,e){const n=NR(t);await CR(n,e,!0,!1)}async function CR(t,e,n,r){const i=await u2(t.localStore,rr(e)),s=i.targetId,o=t.sharedClientState.addLocalQueryTarget(s,n);let a;return r&&(a=await $2(t,e,s,o==="current",i.resumeToken)),t.isPrimaryClient&&n&&pR(t.remoteStore,i),a}async function $2(t,e,n,r,i){t.pu=(f,m,y)=>async function(N,b,S,v){let A=b.view.ru(S);A.Cs&&(A=await yI(N.localStore,b.query,!1).then(({documents:w})=>b.view.ru(w,A)));const O=v&&v.targetChanges.get(b.targetId),j=v&&v.targetMismatches.get(b.targetId)!=null,z=b.view.applyChanges(A,N.isPrimaryClient,O,j);return PI(N,b.targetId,z.au),z.snapshot}(t,f,m,y);const s=await yI(t.localStore,e,!0),o=new F2(e,s.Qs),a=o.ru(s.documents),u=Eu.createSynthesizedTargetChangeForCurrentChange(n,r&&t.onlineState!=="Offline",i),c=o.applyChanges(a,t.isPrimaryClient,u);PI(t,n,c.au);const d=new U2(e,n,o);return t.Tu.set(e,d),t.Iu.has(n)?t.Iu.get(n).push(e):t.Iu.set(n,[e]),c.snapshot}async function H2(t,e,n){const r=te(t),i=r.Tu.get(e),s=r.Iu.get(i.targetId);if(s.length>1)return r.Iu.set(i.targetId,s.filter(o=>!Vd(o,e))),void r.Tu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await Xm(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&ly(r.remoteStore,i.targetId),eg(r,i.targetId)}).catch(ta)):(eg(r,i.targetId),await Xm(r.localStore,i.targetId,!0))}async function q2(t,e){const n=te(t),r=n.Tu.get(e),i=n.Iu.get(r.targetId);n.isPrimaryClient&&i.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),ly(n.remoteStore,r.targetId))}async function G2(t,e,n){const r=eF(t);try{const i=await function(o,a){const u=te(o),c=ke.now(),d=a.reduce((y,C)=>y.add(C.key),ue());let f,m;return u.persistence.runTransaction("Locally write mutations","readwrite",y=>{let C=xr(),N=ue();return u.Ns.getEntries(y,d).next(b=>{C=b,C.forEach((S,v)=>{v.isValidDocument()||(N=N.add(S))})}).next(()=>u.localDocuments.getOverlayedDocuments(y,C)).next(b=>{f=b;const S=[];for(const v of a){const A=lV(v,f.get(v.key).overlayedDocument);A!=null&&S.push(new xs(v.key,A,bA(A.value.mapValue),Un.exists(!0)))}return u.mutationQueue.addMutationBatch(y,c,S,a)}).next(b=>{m=b;const S=b.applyToLocalDocumentSet(f,N);return u.documentOverlayCache.saveOverlays(y,b.batchId,S)})}).then(()=>({batchId:m.batchId,changes:WA(f)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(o,a,u){let c=o.Vu[o.currentUser.toKey()];c||(c=new ze(le)),c=c.insert(a,u),o.Vu[o.currentUser.toKey()]=c}(r,i.batchId,n),await Iu(r,i.changes),await $d(r.remoteStore)}catch(i){const s=fy(i,"Failed to persist write");n.reject(s)}}async function AR(t,e){const n=te(t);try{const r=await o2(n.localStore,e);e.targetChanges.forEach((i,s)=>{const o=n.Au.get(s);o&&(me(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?o.hu=!0:i.modifiedDocuments.size>0?me(o.hu,14607):i.removedDocuments.size>0&&(me(o.hu,42227),o.hu=!1))}),await Iu(n,r,e)}catch(r){await ta(r)}}function RI(t,e,n){const r=te(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const i=[];r.Tu.forEach((s,o)=>{const a=o.view.va(e);a.snapshot&&i.push(a.snapshot)}),function(o,a){const u=te(o);u.onlineState=a;let c=!1;u.queries.forEach((d,f)=>{for(const m of f.Sa)m.va(a)&&(c=!0)}),c&&py(u)}(r.eventManager,e),i.length&&r.Pu.H_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function K2(t,e,n){const r=te(t);r.sharedClientState.updateQueryState(e,"rejected",n);const i=r.Au.get(e),s=i&&i.key;if(s){let o=new ze(Q.comparator);o=o.insert(s,Rt.newNoDocument(s,ee.min()));const a=ue().add(s),u=new zd(ee.min(),new Map,new ze(le),o,a);await AR(r,u),r.du=r.du.remove(s),r.Au.delete(e),gy(r)}else await Xm(r.localStore,e,!1).then(()=>eg(r,e,n)).catch(ta)}async function Q2(t,e){const n=te(t),r=e.batch.batchId;try{const i=await s2(n.localStore,e);PR(n,r,null),RR(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Iu(n,i)}catch(i){await ta(i)}}async function Y2(t,e,n){const r=te(t);try{const i=await function(o,a){const u=te(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",c=>{let d;return u.mutationQueue.lookupMutationBatch(c,a).next(f=>(me(f!==null,37113),d=f.keys(),u.mutationQueue.removeMutationBatch(c,f))).next(()=>u.mutationQueue.performConsistencyCheck(c)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(c,d,a)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,d)).next(()=>u.localDocuments.getDocuments(c,d))})}(r.localStore,e);PR(r,e,n),RR(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await Iu(r,i)}catch(i){await ta(i)}}function RR(t,e){(t.mu.get(e)||[]).forEach(n=>{n.resolve()}),t.mu.delete(e)}function PR(t,e,n){const r=te(t);let i=r.Vu[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(n?s.reject(n):s.resolve(),i=i.remove(e)),r.Vu[r.currentUser.toKey()]=i}}function eg(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Iu.get(e))t.Tu.delete(r),n&&t.Pu.yu(r,n);t.Iu.delete(e),t.isPrimaryClient&&t.Ru.jr(e).forEach(r=>{t.Ru.containsKey(r)||kR(t,r)})}function kR(t,e){t.Eu.delete(e.path.canonicalString());const n=t.du.get(e);n!==null&&(ly(t.remoteStore,n),t.du=t.du.remove(e),t.Au.delete(n),gy(t))}function PI(t,e,n){for(const r of n)r instanceof TR?(t.Ru.addReference(r.key,e),X2(t,r)):r instanceof SR?($(my,"Document no longer in limbo: "+r.key),t.Ru.removeReference(r.key,e),t.Ru.containsKey(r.key)||kR(t,r.key)):J(19791,{wu:r})}function X2(t,e){const n=e.key,r=n.path.canonicalString();t.du.get(n)||t.Eu.has(r)||($(my,"New document in limbo: "+n),t.Eu.add(r),gy(t))}function gy(t){for(;t.Eu.size>0&&t.du.size<t.maxConcurrentLimboResolutions;){const e=t.Eu.values().next().value;t.Eu.delete(e);const n=new Q(Pe.fromString(e)),r=t.fu.next();t.Au.set(r,new B2(n)),t.du=t.du.insert(n,r),pR(t.remoteStore,new si(rr(J_(n.path)),r,"TargetPurposeLimboResolution",bd.ce))}}async function Iu(t,e,n){const r=te(t),i=[],s=[],o=[];r.Tu.isEmpty()||(r.Tu.forEach((a,u)=>{o.push(r.pu(u,e,n).then(c=>{var d;if((c||n)&&r.isPrimaryClient){const f=c?!c.fromCache:(d=n==null?void 0:n.targetChanges.get(u.targetId))==null?void 0:d.current;r.sharedClientState.updateQueryState(u.targetId,f?"current":"not-current")}if(c){i.push(c);const f=oy.As(u.targetId,c);s.push(f)}}))}),await Promise.all(o),r.Pu.H_(i),await async function(u,c){const d=te(u);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",f=>x.forEach(c,m=>x.forEach(m.Es,y=>d.persistence.referenceDelegate.addReference(f,m.targetId,y)).next(()=>x.forEach(m.ds,y=>d.persistence.referenceDelegate.removeReference(f,m.targetId,y)))))}catch(f){if(!na(f))throw f;$(ay,"Failed to update sequence numbers: "+f)}for(const f of c){const m=f.targetId;if(!f.fromCache){const y=d.Ms.get(m),C=y.snapshotVersion,N=y.withLastLimboFreeSnapshotVersion(C);d.Ms=d.Ms.insert(m,N)}}}(r.localStore,s))}async function J2(t,e){const n=te(t);if(!n.currentUser.isEqual(e)){$(my,"User change. New user:",e.toKey());const r=await cR(n.localStore,e);n.currentUser=e,function(s,o){s.mu.forEach(a=>{a.forEach(u=>{u.reject(new G(L.CANCELLED,o))})}),s.mu.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Iu(n,r.Ls)}}function Z2(t,e){const n=te(t),r=n.Au.get(e);if(r&&r.hu)return ue().add(r.key);{let i=ue();const s=n.Iu.get(e);if(!s)return i;for(const o of s){const a=n.Tu.get(o);i=i.unionWith(a.view.nu)}return i}}function NR(t){const e=te(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=AR.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Z2.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=K2.bind(null,e),e.Pu.H_=M2.bind(null,e.eventManager),e.Pu.yu=V2.bind(null,e.eventManager),e}function eF(t){const e=te(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Q2.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Y2.bind(null,e),e}class jh{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=jd(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,n){return null}Mu(e,n){return null}vu(e){return i2(this.persistence,new t2,e.initialUser,this.serializer)}Cu(e){return new uR(sy.mi,this.serializer)}Du(e){return new h2}async terminate(){var e,n;(e=this.gcScheduler)==null||e.stop(),(n=this.indexBackfillerScheduler)==null||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}jh.provider={build:()=>new jh};class tF extends jh{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,n){me(this.persistence.referenceDelegate instanceof Bh,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new BV(r,e.asyncQueue,n)}Cu(e){const n=this.cacheSizeBytes!==void 0?Ut.withCacheSize(this.cacheSizeBytes):Ut.DEFAULT;return new uR(r=>Bh.mi(r,n),this.serializer)}}class tg{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>RI(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=J2.bind(null,this.syncEngine),await b2(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new L2}()}createDatastore(e){const n=jd(e.databaseInfo.databaseId),r=function(s){return new g2(s)}(e.databaseInfo);return function(s,o,a,u){return new E2(s,o,a,u)}(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,i,s,o,a){return new I2(r,i,s,o,a)}(this.localStore,this.datastore,e.asyncQueue,n=>RI(this.syncEngine,n,0),function(){return wI.v()?new wI:new d2}())}createSyncEngine(e,n){return function(i,s,o,a,u,c,d){const f=new z2(i,s,o,a,u,c);return d&&(f.gu=!0),f}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(i){const s=te(i);$(ws,"RemoteStore shutting down."),s.Ea.add(5),await wu(s),s.Aa.shutdown(),s.Ra.set("Unknown")}(this.remoteStore),(e=this.datastore)==null||e.terminate(),(n=this.eventManager)==null||n.terminate()}}tg.provider={build:()=>new tg};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DR{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):Or("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bi="FirestoreClient";class nF{constructor(e,n,r,i,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=i,this.user=Ct.UNAUTHENTICATED,this.clientId=H_.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async o=>{$(bi,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>($(bi,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Tr;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=fy(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function hp(t,e){t.asyncQueue.verifyOperationInProgress(),$(bi,"Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async i=>{r.isEqual(i)||(await cR(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function kI(t,e){t.asyncQueue.verifyOperationInProgress();const n=await rF(t);$(bi,"Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>TI(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,i)=>TI(e.remoteStore,i)),t._onlineComponents=e}async function rF(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){$(bi,"Using user provided OfflineComponentProvider");try{await hp(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(i){return i.name==="FirebaseError"?i.code===L.FAILED_PRECONDITION||i.code===L.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(n))throw n;Bo("Error using user provided cache. Falling back to memory cache: "+n),await hp(t,new jh)}}else $(bi,"Using default OfflineComponentProvider"),await hp(t,new tF(void 0));return t._offlineComponents}async function OR(t){return t._onlineComponents||(t._uninitializedComponentsProvider?($(bi,"Using user provided OnlineComponentProvider"),await kI(t,t._uninitializedComponentsProvider._online)):($(bi,"Using default OnlineComponentProvider"),await kI(t,new tg))),t._onlineComponents}function iF(t){return OR(t).then(e=>e.syncEngine)}async function bR(t){const e=await OR(t),n=e.eventManager;return n.onListen=j2.bind(null,e.syncEngine),n.onUnlisten=H2.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=W2.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=q2.bind(null,e.syncEngine),n}function sF(t,e,n={}){const r=new Tr;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,a,u,c){const d=new DR({next:m=>{d.Nu(),o.enqueueAndForget(()=>wR(s,f));const y=m.docs.has(a);!y&&m.fromCache?c.reject(new G(L.UNAVAILABLE,"Failed to get document because the client is offline.")):y&&m.fromCache&&u&&u.source==="server"?c.reject(new G(L.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(m)},error:m=>c.reject(m)}),f=new IR(J_(a.path),d,{includeMetadataChanges:!0,qa:!0});return ER(s,f)}(await bR(t),t.asyncQueue,e,n,r)),r.promise}function oF(t,e,n={}){const r=new Tr;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,a,u,c){const d=new DR({next:m=>{d.Nu(),o.enqueueAndForget(()=>wR(s,f)),m.fromCache&&u.source==="server"?c.reject(new G(L.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(m)},error:m=>c.reject(m)}),f=new IR(a,d,{includeMetadataChanges:!0,qa:!0});return ER(s,f)}(await bR(t),t.asyncQueue,e,n,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xR(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NI=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const LR="firestore.googleapis.com",DI=!0;class OI{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new G(L.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=LR,this.ssl=DI}else this.host=e.host,this.ssl=e.ssl??DI;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=lR;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<FV)throw new G(L.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}wM("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=xR(e.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new G(L.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new G(L.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new G(L.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Hd{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new OI({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new G(L.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new G(L.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new OI(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new hM;switch(r.type){case"firstParty":return new mM(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new G(L.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=NI.get(n);r&&($("ComponentProvider","Removing Datastore"),NI.delete(n),r.terminate())}(this),Promise.resolve()}}function aF(t,e,n,r={}){var c;t=br(t,Hd);const i=Vi(e),s=t._getSettings(),o={...s,emulatorOptions:t._getEmulatorOptions()},a=`${e}:${n}`;i&&(t_(`https://${a}`),n_("Firestore",!0)),s.host!==LR&&s.host!==a&&Bo("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u={...s,host:a,ssl:i,emulatorOptions:r};if(!kr(u,o)&&(t._setSettings(u),r.mockUserToken)){let d,f;if(typeof r.mockUserToken=="string")d=r.mockUserToken,f=Ct.MOCK_USER;else{d=LS(r.mockUserToken,(c=t._app)==null?void 0:c.options.projectId);const m=r.mockUserToken.sub||r.mockUserToken.user_id;if(!m)throw new G(L.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");f=new Ct(m)}t._authCredentials=new dM(new EA(d,f))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qd{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new qd(this.firestore,e,this._query)}}class nt{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new vi(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new nt(this.firestore,e,this._key)}toJSON(){return{type:nt._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,n,r){if(yu(n,nt._jsonSchema))return new nt(e,r||null,new Q(Pe.fromString(n.referencePath)))}}nt._jsonSchemaVersion="firestore/documentReference/1.0",nt._jsonSchema={type:Ye("string",nt._jsonSchemaVersion),referencePath:Ye("string")};class vi extends qd{constructor(e,n,r){super(e,n,J_(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new nt(this.firestore,null,new Q(e))}withConverter(e){return new vi(this.firestore,e,this._path)}}function dp(t,e,...n){if(t=q(t),wA("collection","path",e),t instanceof Hd){const r=Pe.fromString(e,...n);return qw(r),new vi(t,null,r)}{if(!(t instanceof nt||t instanceof vi))throw new G(L.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(Pe.fromString(e,...n));return qw(r),new vi(t.firestore,null,r)}}function Ha(t,e,...n){if(t=q(t),arguments.length===1&&(e=H_.newId()),wA("doc","path",e),t instanceof Hd){const r=Pe.fromString(e,...n);return Hw(r),new nt(t,null,new Q(r))}{if(!(t instanceof nt||t instanceof vi))throw new G(L.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(Pe.fromString(e,...n));return Hw(r),new nt(t.firestore,t instanceof vi?t.converter:null,new Q(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bI="AsyncQueue";class xI{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new dR(this,"async_queue_retry"),this._c=()=>{const r=cp();r&&$(bI,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=e;const n=cp();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const n=cp();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const n=new Tr;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Xu.push(e),this.lc()))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!na(e))throw e;$(bI,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const n=this.ac.then(()=>(this.rc=!0,e().catch(r=>{throw this.nc=r,this.rc=!1,Or("INTERNAL UNHANDLED ERROR: ",LI(r)),r}).then(r=>(this.rc=!1,r))));return this.ac=n,n}enqueueAfterDelay(e,n,r){this.uc(),this.oc.indexOf(e)>-1&&(n=0);const i=dy.createAndSchedule(this,e,n,r,s=>this.hc(s));return this.tc.push(i),i}uc(){this.nc&&J(47125,{Pc:LI(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const n of this.tc)if(n.timerId===e)return!0;return!1}Ec(e){return this.Tc().then(()=>{this.tc.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.tc)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.Tc()})}dc(e){this.oc.push(e)}hc(e){const n=this.tc.indexOf(e);this.tc.splice(n,1)}}function LI(t){let e=t.message||"";return t.stack&&(e=t.stack.includes(t.message)?t.stack:t.message+`
`+t.stack),e}class ia extends Hd{constructor(e,n,r,i){super(e,n,r,i),this.type="firestore",this._queue=new xI,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new xI(e),this._firestoreClient=void 0,await e}}}function lF(t,e){const n=typeof t=="object"?t:au(),r=typeof t=="string"?t:e||xh,i=Fi(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=OS("firestore");s&&aF(i,...s)}return i}function _y(t){if(t._terminated)throw new G(L.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||uF(t),t._firestoreClient}function uF(t){var r,i,s;const e=t._freezeSettings(),n=function(a,u,c,d){return new OM(a,u,c,d.host,d.ssl,d.experimentalForceLongPolling,d.experimentalAutoDetectLongPolling,xR(d.experimentalLongPollingOptions),d.useFetchStreams,d.isUsingEmulator)}(t._databaseId,((r=t._app)==null?void 0:r.options.appId)||"",t._persistenceKey,e);t._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((s=e.localCache)!=null&&s._onlineComponentProvider)&&(t._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),t._firestoreClient=new nF(t._authCredentials,t._appCheckCredentials,t._queue,n,t._componentsProvider&&function(a){const u=a==null?void 0:a._online.build();return{_offline:a==null?void 0:a._offline.build(u),_online:u}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new pn(yt.fromBase64String(e))}catch(n){throw new G(L.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new pn(yt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:pn._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(yu(e,pn._jsonSchema))return pn.fromBase64String(e.bytes)}}pn._jsonSchemaVersion="firestore/bytes/1.0",pn._jsonSchema={type:Ye("string",pn._jsonSchemaVersion),bytes:Ye("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yy{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new G(L.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new mt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vy{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sr{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new G(L.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new G(L.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return le(this._lat,e._lat)||le(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:sr._jsonSchemaVersion}}static fromJSON(e){if(yu(e,sr._jsonSchema))return new sr(e.latitude,e.longitude)}}sr._jsonSchemaVersion="firestore/geoPoint/1.0",sr._jsonSchema={type:Ye("string",sr._jsonSchemaVersion),latitude:Ye("number"),longitude:Ye("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class or{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}toJSON(){return{type:or._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(yu(e,or._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(n=>typeof n=="number"))return new or(e.vectorValues);throw new G(L.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}or._jsonSchemaVersion="firestore/vectorValue/1.0",or._jsonSchema={type:Ye("string",or._jsonSchemaVersion),vectorValues:Ye("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cF=/^__.*__$/;class hF{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new xs(e,this.data,this.fieldMask,n,this.fieldTransforms):new vu(e,this.data,n,this.fieldTransforms)}}function MR(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw J(40011,{Ac:t})}}class Ey{constructor(e,n,r,i,s,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.Rc(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(e){return new Ey({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(e){var i;const n=(i=this.path)==null?void 0:i.child(e),r=this.Vc({path:n,fc:!1});return r.gc(e),r}yc(e){var i;const n=(i=this.path)==null?void 0:i.child(e),r=this.Vc({path:n,fc:!1});return r.Rc(),r}wc(e){return this.Vc({path:void 0,fc:!0})}Sc(e){return Wh(e,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}Rc(){if(this.path)for(let e=0;e<this.path.length;e++)this.gc(this.path.get(e))}gc(e){if(e.length===0)throw this.Sc("Document fields must not be empty");if(MR(this.Ac)&&cF.test(e))throw this.Sc('Document fields cannot begin and end with "__"')}}class dF{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||jd(e)}Cc(e,n,r,i=!1){return new Ey({Ac:e,methodName:n,Dc:r,path:mt.emptyPath(),fc:!1,bc:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function VR(t){const e=t._freezeSettings(),n=jd(t._databaseId);return new dF(t._databaseId,!!e.ignoreUndefinedProperties,n)}function FR(t,e,n,r,i,s={}){const o=t.Cc(s.merge||s.mergeFields?2:0,e,n,i);jR("Data must be an object, but it was:",o,r);const a=BR(r,o);let u,c;if(s.merge)u=new xn(o.fieldMask),c=o.fieldTransforms;else if(s.mergeFields){const d=[];for(const f of s.mergeFields){const m=fF(e,f,n);if(!o.contains(m))throw new G(L.INVALID_ARGUMENT,`Field '${m}' is specified in your field mask but missing from your input data.`);mF(d,m)||d.push(m)}u=new xn(d),c=o.fieldTransforms.filter(f=>u.covers(f.field))}else u=null,c=o.fieldTransforms;return new hF(new fn(a),u,c)}class wy extends vy{_toFieldTransform(e){return new iV(e.path,new Gl)}isEqual(e){return e instanceof wy}}function UR(t,e){if(zR(t=q(t)))return jR("Unsupported field value:",e,t),BR(t,e);if(t instanceof vy)return function(r,i){if(!MR(i.Ac))throw i.Sc(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Sc(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.fc&&e.Ac!==4)throw e.Sc("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const a of r){let u=UR(a,i.wc(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}}(t,e)}return function(r,i){if((r=q(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return tV(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=ke.fromDate(r);return{timestampValue:Uh(i.serializer,s)}}if(r instanceof ke){const s=new ke(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Uh(i.serializer,s)}}if(r instanceof sr)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof pn)return{bytesValue:tR(i.serializer,r._byteString)};if(r instanceof nt){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i.Sc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:ry(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof or)return function(o,a){return{mapValue:{fields:{[NA]:{stringValue:OA},[Lh]:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw a.Sc("VectorValues must only contain numeric values.");return Z_(a.serializer,c)})}}}}}}(r,i);throw i.Sc(`Unsupported field value: ${q_(r)}`)}(t,e)}function BR(t,e){const n={};return SA(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Os(t,(r,i)=>{const s=UR(i,e.mc(r));s!=null&&(n[r]=s)}),{mapValue:{fields:n}}}function zR(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof ke||t instanceof sr||t instanceof pn||t instanceof nt||t instanceof vy||t instanceof or)}function jR(t,e,n){if(!zR(n)||!IA(n)){const r=q_(n);throw r==="an object"?e.Sc(t+" a custom object"):e.Sc(t+" "+r)}}function fF(t,e,n){if((e=q(e))instanceof yy)return e._internalPath;if(typeof e=="string")return WR(t,e);throw Wh("Field path arguments must be of type string or ",t,!1,void 0,n)}const pF=new RegExp("[~\\*/\\[\\]]");function WR(t,e,n){if(e.search(pF)>=0)throw Wh(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new yy(...e.split("."))._internalPath}catch{throw Wh(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Wh(t,e,n,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let a=`Function ${e}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${r}`),o&&(u+=` in document ${i}`),u+=")"),new G(L.INVALID_ARGUMENT,a+t+u)}function mF(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $R{constructor(e,n,r,i,s){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new nt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new gF(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(HR("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class gF extends $R{data(){return super.data()}}function HR(t,e){return typeof e=="string"?WR(t,e):e instanceof yy?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _F(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new G(L.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class yF{convertValue(e,n="none"){switch(Di(e)){case 0:return null;case 1:return e.booleanValue;case 2:return He(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Ni(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw J(62114,{value:e})}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return Os(e,(i,s)=>{r[i]=this.convertValue(s,n)}),r}convertVectorValue(e){var r,i,s;const n=(s=(i=(r=e.fields)==null?void 0:r[Lh].arrayValue)==null?void 0:i.values)==null?void 0:s.map(o=>He(o.doubleValue));return new or(n)}convertGeoPoint(e){return new sr(He(e.latitude),He(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":const r=Ld(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp($l(e));default:return null}}convertTimestamp(e){const n=ki(e);return new ke(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=Pe.fromString(e);me(aR(r),9688,{name:e});const i=new Hl(r.get(1),r.get(3)),s=new Q(r.popFirst(5));return i.isEqual(n)||Or(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qR(t,e,n){let r;return r=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,r}class qa{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class ls extends $R{constructor(e,n,r,i,s,o){super(e,n,r,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new Bc(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(HR("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new G(L.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,n={};return n.type=ls._jsonSchemaVersion,n.bundle="",n.bundleSource="DocumentSnapshot",n.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?n:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),n.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),n)}}ls._jsonSchemaVersion="firestore/documentSnapshot/1.0",ls._jsonSchema={type:Ye("string",ls._jsonSchemaVersion),bundleSource:Ye("string","DocumentSnapshot"),bundleName:Ye("string"),bundle:Ye("string")};class Bc extends ls{data(e={}){return super.data(e)}}class wo{constructor(e,n,r,i){this._firestore=e,this._userDataWriter=n,this._snapshot=i,this.metadata=new qa(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(r=>{e.call(n,new Bc(this._firestore,this._userDataWriter,r.key,r,new qa(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new G(L.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(a=>{const u=new Bc(i._firestore,i._userDataWriter,a.doc.key,a.doc,new qa(i._snapshot.mutatedKeys.has(a.doc.key),i._snapshot.fromCache),i.query.converter);return a.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(a=>s||a.type!==3).map(a=>{const u=new Bc(i._firestore,i._userDataWriter,a.doc.key,a.doc,new qa(i._snapshot.mutatedKeys.has(a.doc.key),i._snapshot.fromCache),i.query.converter);let c=-1,d=-1;return a.type!==0&&(c=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),d=o.indexOf(a.doc.key)),{type:vF(a.type),doc:u,oldIndex:c,newIndex:d}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new G(L.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=wo._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=H_.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const n=[],r=[],i=[];return this.docs.forEach(s=>{s._document!==null&&(n.push(s._document),r.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),i.push(s.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function vF(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return J(61501,{type:t})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function EF(t){t=br(t,nt);const e=br(t.firestore,ia);return sF(_y(e),t._key).then(n=>TF(e,t,n))}wo._jsonSchemaVersion="firestore/querySnapshot/1.0",wo._jsonSchema={type:Ye("string",wo._jsonSchemaVersion),bundleSource:Ye("string","QuerySnapshot"),bundleName:Ye("string"),bundle:Ye("string")};class GR extends yF{constructor(e){super(),this.firestore=e}convertBytes(e){return new pn(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new nt(this.firestore,null,n)}}function wF(t){t=br(t,qd);const e=br(t.firestore,ia),n=_y(e),r=new GR(e);return _F(t._query),oF(n,t._query).then(i=>new wo(e,r,t,i))}function MI(t,e,n){t=br(t,nt);const r=br(t.firestore,ia),i=qR(t.converter,e,n);return Iy(r,[FR(VR(r),"setDoc",t._key,i,t.converter!==null,n).toMutation(t._key,Un.none())])}function VI(t){return Iy(br(t.firestore,ia),[new ey(t._key,Un.none())])}function IF(t,e){const n=br(t.firestore,ia),r=Ha(t),i=qR(t.converter,e);return Iy(n,[FR(VR(t.firestore),"addDoc",r._key,i,t.converter!==null,{}).toMutation(r._key,Un.exists(!1))]).then(()=>r)}function Iy(t,e){return function(r,i){const s=new Tr;return r.asyncQueue.enqueueAndForget(async()=>G2(await iF(r),i,s)),s.promise}(_y(t),e)}function TF(t,e,n){const r=n.docs.get(e._key),i=new GR(t);return new ls(t,i,e._key,r,new qa(n.hasPendingWrites,n.fromCache),e.converter)}function vc(){return new wy("serverTimestamp")}(function(e,n=!0){(function(i){ea=i})(Ps),zn(new Gt("firestore",(r,{instanceIdentifier:i,options:s})=>{const o=r.getProvider("app").getImmediate(),a=new ia(new fM(r.getProvider("auth-internal")),new gM(o,r.getProvider("app-check-internal")),function(c,d){if(!Object.prototype.hasOwnProperty.apply(c.options,["projectId"]))throw new G(L.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Hl(c.options.projectId,d)}(o,i),o);return s={useFetchStreams:n,...s},a._setSettings(s),a},"PUBLIC").setMultipleInstances(!0)),Ht(zw,jw,e),Ht(zw,jw,"esm2020")})();/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S9={PHONE:"phone",TOTP:"totp"},C9={FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PASSWORD:"password",PHONE:"phone",TWITTER:"twitter.com"},A9={EMAIL_LINK:"emailLink",EMAIL_PASSWORD:"password",FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PHONE:"phone",TWITTER:"twitter.com"},R9={LINK:"link",REAUTHENTICATE:"reauthenticate",SIGN_IN:"signIn"},P9={EMAIL_SIGNIN:"EMAIL_SIGNIN",PASSWORD_RESET:"PASSWORD_RESET",RECOVER_EMAIL:"RECOVER_EMAIL",REVERT_SECOND_FACTOR_ADDITION:"REVERT_SECOND_FACTOR_ADDITION",VERIFY_AND_CHANGE_EMAIL:"VERIFY_AND_CHANGE_EMAIL",VERIFY_EMAIL:"VERIFY_EMAIL"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function SF(){return{"admin-restricted-operation":"This operation is restricted to administrators only.","argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.","captcha-check-failed":"The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.","code-expired":"The SMS code has expired. Please re-send the verification code to try again.","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.","email-change-needs-verification":"Multi-factor users must always have a verified email.","email-already-in-use":"The email address is already in use by another account.","emulator-config-failed":'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',"expired-action-code":"The action code has expired.","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal AuthError has occurred.","invalid-app-credential":"The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.","invalid-app-id":"The mobile app identifier is not registered for the current project.","invalid-user-token":"This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.","invalid-auth-event":"An internal AuthError has occurred.","invalid-verification-code":"The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.","invalid-continue-uri":"The continue URL provided in the request is invalid.","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-dynamic-link-domain":"The provided dynamic link domain is not configured or authorized for the current project.","invalid-email":"The email address is badly formatted.","invalid-emulator-scheme":"Emulator URL must start with a valid scheme (http:// or https://).","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-cert-hash":"The SHA-1 certificate hash provided is invalid.","invalid-credential":"The supplied auth credential is incorrect, malformed or has expired.","invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-multi-factor-session":"The request does not contain a valid proof of first factor successful sign-in.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","invalid-oauth-client-id":"The OAuth client ID provided is either invalid or does not match the specified API key.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.","invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-persistence-type":"The specified persistence type is invalid. It can only be local, session or none.","invalid-phone-number":"The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].","invalid-provider-id":"The specified provider ID is invalid.","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-verification-id":"The verification ID used to create the phone auth credential is invalid.","invalid-tenant-id":"The Auth instance's tenant ID is invalid.","login-blocked":"Login blocked by user-provided method: {$originalMessage}","missing-android-pkg-name":"An Android Package Name must be provided if the Android App is required to be installed.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.","missing-verification-code":"The phone auth credential was created with an empty SMS verification code.","missing-continue-uri":"A continue URL must be provided in the request.","missing-iframe-start":"An internal AuthError has occurred.","missing-ios-bundle-id":"An iOS Bundle ID must be provided if an App Store ID is provided.","missing-or-invalid-nonce":"The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.","missing-password":"A non-empty password must be provided","missing-multi-factor-info":"No second factor identifier is provided.","missing-multi-factor-session":"The request is missing proof of first factor successful sign-in.","missing-phone-number":"To send verification codes, provide a phone number for the recipient.","missing-verification-id":"The phone auth credential was created with an empty verification ID.","app-deleted":"This instance of FirebaseApp has been deleted.","multi-factor-info-not-found":"The user does not have a second factor matching the identifier provided.","multi-factor-auth-required":"Proof of ownership of a second factor is required to complete sign-in.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.","network-request-failed":"A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal AuthError has occurred.","no-such-provider":"User was not linked to an account with the given provider.","null-user":"A null user object was provided as the argument for an operation which requires a non-null user object.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"The project's quota for this operation has been exceeded.","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.","rejected-credential":"The request contains malformed or mismatching credentials.","second-factor-already-in-use":"The second factor is already enrolled on this account.","maximum-second-factor-count-exceeded":"The maximum allowed number of second factors on a user has been exceeded.","tenant-id-mismatch":"The provided tenant ID does not match the Auth instance's tenant ID",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","unauthorized-continue-uri":"The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.","unsupported-first-factor":"Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.","unsupported-persistence-type":"The current environment does not support the specified persistence type.","unsupported-tenant-operation":"This operation is not supported in a multi-tenant context.","unverified-email":"The operation requires a verified email.","user-cancelled":"The user did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled.","already-initialized":"initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.","missing-recaptcha-token":"The reCAPTCHA token is missing when sending request to the backend.","invalid-recaptcha-token":"The reCAPTCHA token is invalid when sending request to the backend.","invalid-recaptcha-action":"The reCAPTCHA action is invalid when sending request to the backend.","recaptcha-not-enabled":"reCAPTCHA Enterprise integration is not enabled for this project.","missing-client-type":"The reCAPTCHA client type is missing when sending request to the backend.","missing-recaptcha-version":"The reCAPTCHA version is missing when sending request to the backend.","invalid-req-type":"Invalid request parameters.","invalid-recaptcha-version":"The reCAPTCHA version is invalid when sending request to the backend.","unsupported-password-policy-schema-version":"The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.","password-does-not-meet-requirements":"The password does not meet the requirements.","invalid-hosting-link-domain":"The provided Hosting link domain is not configured in Firebase Hosting or is not owned by the current project. This cannot be a default Hosting domain (`web.app` or `firebaseapp.com`)."}}function KR(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const k9=SF,CF=KR,QR=new As("auth","Firebase",KR()),N9={ADMIN_ONLY_OPERATION:"auth/admin-restricted-operation",ARGUMENT_ERROR:"auth/argument-error",APP_NOT_AUTHORIZED:"auth/app-not-authorized",APP_NOT_INSTALLED:"auth/app-not-installed",CAPTCHA_CHECK_FAILED:"auth/captcha-check-failed",CODE_EXPIRED:"auth/code-expired",CORDOVA_NOT_READY:"auth/cordova-not-ready",CORS_UNSUPPORTED:"auth/cors-unsupported",CREDENTIAL_ALREADY_IN_USE:"auth/credential-already-in-use",CREDENTIAL_MISMATCH:"auth/custom-token-mismatch",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"auth/requires-recent-login",DEPENDENT_SDK_INIT_BEFORE_AUTH:"auth/dependent-sdk-initialized-before-auth",DYNAMIC_LINK_NOT_ACTIVATED:"auth/dynamic-link-not-activated",EMAIL_CHANGE_NEEDS_VERIFICATION:"auth/email-change-needs-verification",EMAIL_EXISTS:"auth/email-already-in-use",EMULATOR_CONFIG_FAILED:"auth/emulator-config-failed",EXPIRED_OOB_CODE:"auth/expired-action-code",EXPIRED_POPUP_REQUEST:"auth/cancelled-popup-request",INTERNAL_ERROR:"auth/internal-error",INVALID_API_KEY:"auth/invalid-api-key",INVALID_APP_CREDENTIAL:"auth/invalid-app-credential",INVALID_APP_ID:"auth/invalid-app-id",INVALID_AUTH:"auth/invalid-user-token",INVALID_AUTH_EVENT:"auth/invalid-auth-event",INVALID_CERT_HASH:"auth/invalid-cert-hash",INVALID_CODE:"auth/invalid-verification-code",INVALID_CONTINUE_URI:"auth/invalid-continue-uri",INVALID_CORDOVA_CONFIGURATION:"auth/invalid-cordova-configuration",INVALID_CUSTOM_TOKEN:"auth/invalid-custom-token",INVALID_DYNAMIC_LINK_DOMAIN:"auth/invalid-dynamic-link-domain",INVALID_EMAIL:"auth/invalid-email",INVALID_EMULATOR_SCHEME:"auth/invalid-emulator-scheme",INVALID_IDP_RESPONSE:"auth/invalid-credential",INVALID_LOGIN_CREDENTIALS:"auth/invalid-credential",INVALID_MESSAGE_PAYLOAD:"auth/invalid-message-payload",INVALID_MFA_SESSION:"auth/invalid-multi-factor-session",INVALID_OAUTH_CLIENT_ID:"auth/invalid-oauth-client-id",INVALID_OAUTH_PROVIDER:"auth/invalid-oauth-provider",INVALID_OOB_CODE:"auth/invalid-action-code",INVALID_ORIGIN:"auth/unauthorized-domain",INVALID_PASSWORD:"auth/wrong-password",INVALID_PERSISTENCE:"auth/invalid-persistence-type",INVALID_PHONE_NUMBER:"auth/invalid-phone-number",INVALID_PROVIDER_ID:"auth/invalid-provider-id",INVALID_RECIPIENT_EMAIL:"auth/invalid-recipient-email",INVALID_SENDER:"auth/invalid-sender",INVALID_SESSION_INFO:"auth/invalid-verification-id",INVALID_TENANT_ID:"auth/invalid-tenant-id",MFA_INFO_NOT_FOUND:"auth/multi-factor-info-not-found",MFA_REQUIRED:"auth/multi-factor-auth-required",MISSING_ANDROID_PACKAGE_NAME:"auth/missing-android-pkg-name",MISSING_APP_CREDENTIAL:"auth/missing-app-credential",MISSING_AUTH_DOMAIN:"auth/auth-domain-config-required",MISSING_CODE:"auth/missing-verification-code",MISSING_CONTINUE_URI:"auth/missing-continue-uri",MISSING_IFRAME_START:"auth/missing-iframe-start",MISSING_IOS_BUNDLE_ID:"auth/missing-ios-bundle-id",MISSING_OR_INVALID_NONCE:"auth/missing-or-invalid-nonce",MISSING_MFA_INFO:"auth/missing-multi-factor-info",MISSING_MFA_SESSION:"auth/missing-multi-factor-session",MISSING_PHONE_NUMBER:"auth/missing-phone-number",MISSING_SESSION_INFO:"auth/missing-verification-id",MODULE_DESTROYED:"auth/app-deleted",NEED_CONFIRMATION:"auth/account-exists-with-different-credential",NETWORK_REQUEST_FAILED:"auth/network-request-failed",NULL_USER:"auth/null-user",NO_AUTH_EVENT:"auth/no-auth-event",NO_SUCH_PROVIDER:"auth/no-such-provider",OPERATION_NOT_ALLOWED:"auth/operation-not-allowed",OPERATION_NOT_SUPPORTED:"auth/operation-not-supported-in-this-environment",POPUP_BLOCKED:"auth/popup-blocked",POPUP_CLOSED_BY_USER:"auth/popup-closed-by-user",PROVIDER_ALREADY_LINKED:"auth/provider-already-linked",QUOTA_EXCEEDED:"auth/quota-exceeded",REDIRECT_CANCELLED_BY_USER:"auth/redirect-cancelled-by-user",REDIRECT_OPERATION_PENDING:"auth/redirect-operation-pending",REJECTED_CREDENTIAL:"auth/rejected-credential",SECOND_FACTOR_ALREADY_ENROLLED:"auth/second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"auth/maximum-second-factor-count-exceeded",TENANT_ID_MISMATCH:"auth/tenant-id-mismatch",TIMEOUT:"auth/timeout",TOKEN_EXPIRED:"auth/user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"auth/too-many-requests",UNAUTHORIZED_DOMAIN:"auth/unauthorized-continue-uri",UNSUPPORTED_FIRST_FACTOR:"auth/unsupported-first-factor",UNSUPPORTED_PERSISTENCE:"auth/unsupported-persistence-type",UNSUPPORTED_TENANT_OPERATION:"auth/unsupported-tenant-operation",UNVERIFIED_EMAIL:"auth/unverified-email",USER_CANCELLED:"auth/user-cancelled",USER_DELETED:"auth/user-not-found",USER_DISABLED:"auth/user-disabled",USER_MISMATCH:"auth/user-mismatch",USER_SIGNED_OUT:"auth/user-signed-out",WEAK_PASSWORD:"auth/weak-password",WEB_STORAGE_UNSUPPORTED:"auth/web-storage-unsupported",ALREADY_INITIALIZED:"auth/already-initialized",RECAPTCHA_NOT_ENABLED:"auth/recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"auth/missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"auth/invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"auth/invalid-recaptcha-action",MISSING_CLIENT_TYPE:"auth/missing-client-type",MISSING_RECAPTCHA_VERSION:"auth/missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"auth/invalid-recaptcha-version",INVALID_REQ_TYPE:"auth/invalid-req-type",INVALID_HOSTING_LINK_DOMAIN:"auth/invalid-hosting-link-domain"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $h=new ou("@firebase/auth");function AF(t,...e){$h.logLevel<=oe.WARN&&$h.warn(`Auth (${Ps}): ${t}`,...e)}function zc(t,...e){$h.logLevel<=oe.ERROR&&$h.error(`Auth (${Ps}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kt(t,...e){throw Sy(t,...e)}function Lt(t,...e){return Sy(t,...e)}function Ty(t,e,n){const r={...CF(),[e]:n};return new As("auth","Firebase",r).create(e,{appName:t.name})}function ct(t){return Ty(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function sa(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&Kt(t,"argument-error"),Ty(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Sy(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return QR.create(t,...e)}function V(t,e,...n){if(!t)throw Sy(e,...n)}function Zn(t){const e="INTERNAL ASSERTION FAILED: "+t;throw zc(e),new Error(e)}function Lr(t,e){t||Zn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yl(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function Cy(){return FI()==="http:"||FI()==="https:"}function FI(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RF(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Cy()||i_()||"connection"in navigator)?navigator.onLine:!0}function PF(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tu{constructor(e,n){this.shortDelay=e,this.longDelay=n,Lr(n>e,"Short delay should be less than long delay!"),this.isMobile=r_()||MS()}get(){return RF()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ay(t,e){Lr(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YR{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Zn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Zn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Zn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kF={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NF=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],DF=new Tu(3e4,6e4);function De(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function Oe(t,e,n,r,i={}){return XR(t,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const a=Rs({key:t.config.apiKey,...o}).slice(1),u=await t._getAdditionalHeaders();u["Content-Type"]="application/json",t.languageCode&&(u["X-Firebase-Locale"]=t.languageCode);const c={method:e,headers:u,...s};return ID()||(c.referrerPolicy="no-referrer"),t.emulatorConfig&&Vi(t.emulatorConfig.host)&&(c.credentials="include"),YR.fetch()(await JR(t,t.config.apiHost,n,a),c)})}async function XR(t,e,n){t._canInitEmulator=!1;const r={...kF,...e};try{const i=new bF(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw Ga(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const a=s.ok?o.errorMessage:o.error.message,[u,c]=a.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ga(t,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw Ga(t,"email-already-in-use",o);if(u==="USER_DISABLED")throw Ga(t,"user-disabled",o);const d=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw Ty(t,d,c);Kt(t,d)}}catch(i){if(i instanceof jn)throw i;Kt(t,"network-request-failed",{message:String(i)})}}async function Ur(t,e,n,r,i={}){const s=await Oe(t,e,n,r,i);return"mfaPendingCredential"in s&&Kt(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function JR(t,e,n,r){const i=`${e}${n}?${r}`,s=t,o=s.config.emulator?Ay(t.config,i):`${t.config.apiScheme}://${i}`;return NF.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o}function OF(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class bF{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(Lt(this.auth,"network-request-failed")),DF.get())})}}function Ga(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=Lt(t,e,r);return i.customData._tokenResponse=n,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function UI(t){return t!==void 0&&t.getResponse!==void 0}function BI(t){return t!==void 0&&t.enterprise!==void 0}class ZR{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return OF(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xF(t){return(await Oe(t,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}async function e1(t,e){return Oe(t,"GET","/v2/recaptchaConfig",De(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function LF(t,e){return Oe(t,"POST","/v1/accounts:delete",e)}async function MF(t,e){return Oe(t,"POST","/v1/accounts:update",e)}async function Hh(t,e){return Oe(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dl(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function D9(t,e=!1){return q(t).getIdToken(e)}async function VF(t,e=!1){const n=q(t),r=await n.getIdToken(e),i=Gd(r);V(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:dl(fp(i.auth_time)),issuedAtTime:dl(fp(i.iat)),expirationTime:dl(fp(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function fp(t){return Number(t)*1e3}function Gd(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return zc("JWT malformed, contained fewer than 3 sections"),null;try{const i=_h(n);return i?JSON.parse(i):(zc("Failed to decode base64 JWT payload"),null)}catch(i){return zc("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function zI(t){const e=Gd(t);return V(e,"internal-error"),V(typeof e.exp<"u","internal-error"),V(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mr(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof jn&&FF(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function FF({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UF{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ng{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=dl(this.lastLoginAt),this.creationTime=dl(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xl(t){var f;const e=t.auth,n=await t.getIdToken(),r=await Mr(t,Hh(e,{idToken:n}));V(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(f=i.providerUserInfo)!=null&&f.length?t1(i.providerUserInfo):[],o=zF(t.providerData,s),a=t.isAnonymous,u=!(t.email&&i.passwordHash)&&!(o!=null&&o.length),c=a?u:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:o,metadata:new ng(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(t,d)}async function BF(t){const e=q(t);await Xl(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function zF(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function t1(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jF(t,e){const n=await XR(t,{},async()=>{const r=Rs({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,o=await JR(t,i,"/v1/token",`key=${s}`),a=await t._getAdditionalHeaders();a["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:a,body:r};return t.emulatorConfig&&Vi(t.emulatorConfig.host)&&(u.credentials="include"),YR.fetch()(o,u)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function WF(t,e){return Oe(t,"POST","/v2/accounts:revokeToken",De(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){V(e.idToken,"internal-error"),V(typeof e.idToken<"u","internal-error"),V(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):zI(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){V(e.length!==0,"internal-error");const n=zI(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(V(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await jF(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,o=new Io;return r&&(V(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(V(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(V(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Io,this.toJSON())}_performRefresh(){return Zn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qr(t,e){V(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Ln{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new UF(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new ng(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Mr(this,this.stsTokenManager.getToken(this.auth,e));return V(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return VF(this,e)}reload(){return BF(this)}_assign(e){this!==e&&(V(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Ln({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){V(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Xl(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(xe(this.auth.app))return Promise.reject(ct(this.auth));const e=await this.getIdToken();return await Mr(this,LF(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,o=n.photoURL??void 0,a=n.tenantId??void 0,u=n._redirectEventId??void 0,c=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:f,emailVerified:m,isAnonymous:y,providerData:C,stsTokenManager:N}=n;V(f&&N,e,"internal-error");const b=Io.fromJSON(this.name,N);V(typeof f=="string",e,"internal-error"),qr(r,e.name),qr(i,e.name),V(typeof m=="boolean",e,"internal-error"),V(typeof y=="boolean",e,"internal-error"),qr(s,e.name),qr(o,e.name),qr(a,e.name),qr(u,e.name),qr(c,e.name),qr(d,e.name);const S=new Ln({uid:f,auth:e,email:i,emailVerified:m,displayName:r,isAnonymous:y,photoURL:o,phoneNumber:s,tenantId:a,stsTokenManager:b,createdAt:c,lastLoginAt:d});return C&&Array.isArray(C)&&(S.providerData=C.map(v=>({...v}))),u&&(S._redirectEventId=u),S}static async _fromIdTokenResponse(e,n,r=!1){const i=new Io;i.updateFromServerResponse(n);const s=new Ln({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Xl(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];V(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?t1(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),a=new Io;a.updateFromIdToken(r);const u=new Ln({uid:i.localId,auth:e,stsTokenManager:a,isAnonymous:o}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new ng(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(u,c),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jI=new Map;function Er(t){Lr(t instanceof Function,"Expected a class definition");let e=jI.get(t);return e?(Lr(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,jI.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n1{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}n1.type="NONE";const WI=n1;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jc(t,e,n){return`firebase:${t}:${e}:${n}`}class To{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=jc(this.userKey,i.apiKey,s),this.fullPersistenceKey=jc("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await Hh(this.auth,{idToken:e}).catch(()=>{});return n?Ln._fromGetAccountInfoResponse(this.auth,n,e):null}return Ln._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new To(Er(WI),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||Er(WI);const o=jc(r,e.config.apiKey,e.name);let a=null;for(const c of n)try{const d=await c._get(o);if(d){let f;if(typeof d=="string"){const m=await Hh(e,{idToken:d}).catch(()=>{});if(!m)break;f=await Ln._fromGetAccountInfoResponse(e,m,d)}else f=Ln._fromJSON(e,d);c!==s&&(a=f),s=c;break}}catch{}const u=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new To(s,e,r):(s=u[0],a&&await s._set(o,a.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(o)}catch{}})),new To(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $I(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(o1(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(r1(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(l1(e))return"Blackberry";if(u1(e))return"Webos";if(i1(e))return"Safari";if((e.includes("chrome/")||s1(e))&&!e.includes("edge/"))return"Chrome";if(a1(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function r1(t=Nt()){return/firefox\//i.test(t)}function i1(t=Nt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function s1(t=Nt()){return/crios\//i.test(t)}function o1(t=Nt()){return/iemobile/i.test(t)}function a1(t=Nt()){return/android/i.test(t)}function l1(t=Nt()){return/blackberry/i.test(t)}function u1(t=Nt()){return/webos/i.test(t)}function Ry(t=Nt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function $F(t=Nt()){var e;return Ry(t)&&!!((e=window.navigator)!=null&&e.standalone)}function HF(){return TD()&&document.documentMode===10}function c1(t=Nt()){return Ry(t)||a1(t)||u1(t)||l1(t)||/windows phone/i.test(t)||o1(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function h1(t,e=[]){let n;switch(t){case"Browser":n=$I(Nt());break;case"Worker":n=`${$I(Nt())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Ps}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qF{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((o,a)=>{try{const u=e(s);o(u)}catch(u){a(u)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function GF(t,e={}){return Oe(t,"GET","/v2/passwordPolicy",De(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const KF=6;class QF{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??KF,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YF{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new HI(this),this.idTokenSubscription=new HI(this),this.beforeStateQueue=new qF(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=QR,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Er(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await To.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Hh(this,{idToken:e}),r=await Ln._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(xe(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(s=this.redirectUser)==null?void 0:s._redirectEventId,a=r==null?void 0:r._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===a)&&(u!=null&&u.user)&&(r=u.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return V(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Xl(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=PF()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(xe(this.app))return Promise.reject(ct(this));const n=e?q(e):null;return n&&V(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&V(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return xe(this.app)?Promise.reject(ct(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return xe(this.app)?Promise.reject(ct(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Er(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await GF(this),n=new QF(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new As("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await WF(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Er(e)||this._popupRedirectResolver;V(n,this,"argument-error"),this.redirectPersistenceManager=await To.create(this,[Er(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(V(a,this,"internal-error"),a.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const u=e.addObserver(n,r,i);return()=>{o=!0,u()}}else{const u=e.addObserver(n);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return V(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=h1(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(xe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&AF(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function $e(t){return q(t)}class HI{constructor(e){this.auth=e,this.observer=null,this.addObserver=DD(n=>this.observer=n)}get next(){return V(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Su={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function XF(t){Su=t}function Py(t){return Su.loadJS(t)}function JF(){return Su.recaptchaV2Script}function ZF(){return Su.recaptchaEnterpriseScript}function e4(){return Su.gapiScript}function d1(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t4=500,n4=6e4,Ec=1e12;class r4{constructor(e){this.auth=e,this.counter=Ec,this._widgets=new Map}render(e,n){const r=this.counter;return this._widgets.set(r,new o4(e,this.auth.name,n||{})),this.counter++,r}reset(e){var r;const n=e||Ec;(r=this._widgets.get(n))==null||r.delete(),this._widgets.delete(n)}getResponse(e){var r;const n=e||Ec;return((r=this._widgets.get(n))==null?void 0:r.getResponse())||""}async execute(e){var r;const n=e||Ec;return(r=this._widgets.get(n))==null||r.execute(),""}}class i4{constructor(){this.enterprise=new s4}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class s4{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class o4{constructor(e,n,r){this.params=r,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const i=typeof e=="string"?document.getElementById(e):e;V(i,"argument-error",{appName:n}),this.container=i,this.isVisible=this.params.size!=="invisible",this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),!this.timerId&&(this.timerId=window.setTimeout(()=>{this.responseToken=a4(50);const{callback:e,"expired-callback":n}=this.params;if(e)try{e(this.responseToken)}catch{}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,n)try{n()}catch{}this.isVisible&&this.execute()},n4)},t4))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}function a4(t){const e=[],n="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let r=0;r<t;r++)e.push(n.charAt(Math.floor(Math.random()*n.length)));return e.join("")}const l4="recaptcha-enterprise",fl="NO_RECAPTCHA";class f1{constructor(e){this.type=l4,this.auth=$e(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,a)=>{e1(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const c=new ZR(u);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,o(c.siteKey)}}).catch(u=>{a(u)})})}function i(s,o,a){const u=window.grecaptcha;BI(u)?u.enterprise.ready(()=>{u.enterprise.execute(s,{action:e}).then(c=>{o(c)}).catch(()=>{o(fl)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new i4().execute("siteKey",{action:"verify"}):new Promise((s,o)=>{r(this.auth).then(a=>{if(!n&&BI(window.grecaptcha))i(a,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=ZF();u.length!==0&&(u+=a),Py(u).then(()=>{i(a,s,o)}).catch(c=>{o(c)})}}).catch(a=>{o(a)})})}}async function xa(t,e,n,r=!1,i=!1){const s=new f1(t);let o;if(i)o=fl;else try{o=await s.verify(n)}catch{o=await s.verify(n,!0)}const a={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in a){const u=a.phoneEnrollmentInfo.phoneNumber,c=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:c,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){const u=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return r?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Ei(t,e,n,r,i){var s,o;if(i==="EMAIL_PASSWORD_PROVIDER")if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await xa(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const u=await xa(t,e,n,n==="getOobCode");return r(t,u)}else return Promise.reject(a)});else if(i==="PHONE_PROVIDER")if((o=t._getRecaptchaConfig())!=null&&o.isProviderEnabled("PHONE_PROVIDER")){const a=await xa(t,e,n);return r(t,a).catch(async u=>{var c;if(((c=t._getRecaptchaConfig())==null?void 0:c.getProviderEnforcementState("PHONE_PROVIDER"))==="AUDIT"&&(u.code==="auth/missing-recaptcha-token"||u.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${n} flow.`);const d=await xa(t,e,n,!1,!0);return r(t,d)}return Promise.reject(u)})}else{const a=await xa(t,e,n,!1,!0);return r(t,a)}else return Promise.reject(i+" provider is not supported.")}async function p1(t){const e=$e(t),n=await e1(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new ZR(n);e.tenantId==null?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,r.isAnyProviderEnabled()&&new f1(e).verify()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function u4(t,e){const n=Fi(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(kr(s,e??{}))return i;Kt(i,"already-initialized")}return n.initialize({options:e})}function c4(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Er);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function h4(t,e,n){const r=$e(t);V(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!!(n!=null&&n.disableWarnings),s=m1(e),{host:o,port:a}=d4(e),u=a===null?"":`:${a}`,c={url:`${s}//${o}${u}/`},d=Object.freeze({host:o,port:a,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){V(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),V(kr(c,r.config.emulator)&&kr(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,Vi(o)?(t_(`${s}//${o}${u}`),n_("Auth",!0)):i||f4()}function m1(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function d4(t){const e=m1(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:qI(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:qI(o)}}}function qI(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function f4(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cu{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Zn("not implemented")}_getIdTokenResponse(e){return Zn("not implemented")}_linkToIdToken(e,n){return Zn("not implemented")}_getReauthenticationResolver(e){return Zn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function g1(t,e){return Oe(t,"POST","/v1/accounts:resetPassword",De(t,e))}async function p4(t,e){return Oe(t,"POST","/v1/accounts:update",e)}async function m4(t,e){return Oe(t,"POST","/v1/accounts:signUp",e)}async function g4(t,e){return Oe(t,"POST","/v1/accounts:update",De(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _4(t,e){return Ur(t,"POST","/v1/accounts:signInWithPassword",De(t,e))}async function Kd(t,e){return Oe(t,"POST","/v1/accounts:sendOobCode",De(t,e))}async function y4(t,e){return Kd(t,e)}async function v4(t,e){return Kd(t,e)}async function E4(t,e){return Kd(t,e)}async function w4(t,e){return Kd(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function I4(t,e){return Ur(t,"POST","/v1/accounts:signInWithEmailLink",De(t,e))}async function T4(t,e){return Ur(t,"POST","/v1/accounts:signInWithEmailLink",De(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jl extends Cu{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new Jl(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new Jl(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ei(e,n,"signInWithPassword",_4,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return I4(e,{email:this._email,oobCode:this._password});default:Kt(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ei(e,r,"signUpPassword",m4,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return T4(e,{idToken:n,email:this._email,oobCode:this._password});default:Kt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sr(t,e){return Ur(t,"POST","/v1/accounts:signInWithIdp",De(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S4="http://localhost";class Vr extends Cu{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Vr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Kt("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const o=new Vr(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return Sr(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,Sr(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Sr(e,n)}buildRequest(){const e={requestUri:S4,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Rs(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function GI(t,e){return Oe(t,"POST","/v1/accounts:sendVerificationCode",De(t,e))}async function C4(t,e){return Ur(t,"POST","/v1/accounts:signInWithPhoneNumber",De(t,e))}async function A4(t,e){const n=await Ur(t,"POST","/v1/accounts:signInWithPhoneNumber",De(t,e));if(n.temporaryProof)throw Ga(t,"account-exists-with-different-credential",n);return n}const R4={USER_NOT_FOUND:"user-not-found"};async function P4(t,e){const n={...e,operation:"REAUTH"};return Ur(t,"POST","/v1/accounts:signInWithPhoneNumber",De(t,n),R4)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class us extends Cu{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,n){return new us({verificationId:e,verificationCode:n})}static _fromTokenResponse(e,n){return new us({phoneNumber:e,temporaryProof:n})}_getIdTokenResponse(e){return C4(e,this._makeVerificationRequest())}_linkToIdToken(e,n){return A4(e,{idToken:n,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return P4(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:n,verificationId:r,verificationCode:i}=this.params;return e&&n?{temporaryProof:e,phoneNumber:n}:{sessionInfo:r,code:i}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));const{verificationId:n,verificationCode:r,phoneNumber:i,temporaryProof:s}=e;return!r&&!n&&!i&&!s?null:new us({verificationId:n,verificationCode:r,phoneNumber:i,temporaryProof:s})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function k4(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function N4(t){const e=Ua(Ba(t)).link,n=e?Ua(Ba(e)).deep_link_id:null,r=Ua(Ba(t)).deep_link_id;return(r?Ua(Ba(r)).link:null)||r||n||e||t}class Au{constructor(e){const n=Ua(Ba(e)),r=n.apiKey??null,i=n.oobCode??null,s=k4(n.mode??null);V(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=N4(e);try{return new Au(n)}catch{return null}}}function O9(t){return Au.parseLink(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms{constructor(){this.providerId=Ms.PROVIDER_ID}static credential(e,n){return Jl._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=Au.parseLink(n);return V(r,"argument-error"),Jl._fromEmailAndCode(e,r.code,r.tenantId)}}Ms.PROVIDER_ID="password";Ms.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Ms.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Br{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oa extends Br{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class Wc extends oa{static credentialFromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;return V("providerId"in n&&"signInMethod"in n,"argument-error"),Vr._fromParams(n)}credential(e){return this._credential({...e,nonce:e.rawNonce})}_credential(e){return V(e.idToken||e.accessToken,"argument-error"),Vr._fromParams({...e,providerId:this.providerId,signInMethod:this.providerId})}static credentialFromResult(e){return Wc.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return Wc.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r,oauthTokenSecret:i,pendingToken:s,nonce:o,providerId:a}=e;if(!r&&!i&&!n&&!s||!a)return null;try{return new Wc(a)._credential({idToken:n,accessToken:r,nonce:o,pendingToken:s})}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xr extends oa{constructor(){super("facebook.com")}static credential(e){return Vr._fromParams({providerId:Xr.PROVIDER_ID,signInMethod:Xr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Xr.credentialFromTaggedObject(e)}static credentialFromError(e){return Xr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Xr.credential(e.oauthAccessToken)}catch{return null}}}Xr.FACEBOOK_SIGN_IN_METHOD="facebook.com";Xr.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jr extends oa{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Vr._fromParams({providerId:Jr.PROVIDER_ID,signInMethod:Jr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Jr.credentialFromTaggedObject(e)}static credentialFromError(e){return Jr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return Jr.credential(n,r)}catch{return null}}}Jr.GOOGLE_SIGN_IN_METHOD="google.com";Jr.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zr extends oa{constructor(){super("github.com")}static credential(e){return Vr._fromParams({providerId:Zr.PROVIDER_ID,signInMethod:Zr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Zr.credentialFromTaggedObject(e)}static credentialFromError(e){return Zr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Zr.credential(e.oauthAccessToken)}catch{return null}}}Zr.GITHUB_SIGN_IN_METHOD="github.com";Zr.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D4="http://localhost";class Zl extends Cu{constructor(e,n){super(e,e),this.pendingToken=n}_getIdTokenResponse(e){const n=this.buildRequest();return Sr(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,Sr(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Sr(e,n)}toJSON(){return{signInMethod:this.signInMethod,providerId:this.providerId,pendingToken:this.pendingToken}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,pendingToken:s}=n;return!r||!i||!s||r!==i?null:new Zl(r,s)}static _create(e,n){return new Zl(e,n)}buildRequest(){return{requestUri:D4,returnSecureToken:!0,pendingToken:this.pendingToken}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O4="saml.";class rg extends Br{constructor(e){V(e.startsWith(O4),"argument-error"),super(e)}static credentialFromResult(e){return rg.samlCredentialFromTaggedObject(e)}static credentialFromError(e){return rg.samlCredentialFromTaggedObject(e.customData||{})}static credentialFromJSON(e){const n=Zl.fromJSON(e);return V(n,"argument-error"),n}static samlCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{pendingToken:n,providerId:r}=e;if(!n||!r)return null;try{return Zl._create(r,n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei extends oa{constructor(){super("twitter.com")}static credential(e,n){return Vr._fromParams({providerId:ei.PROVIDER_ID,signInMethod:ei.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ei.credentialFromTaggedObject(e)}static credentialFromError(e){return ei.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return ei.credential(n,r)}catch{return null}}}ei.TWITTER_SIGN_IN_METHOD="twitter.com";ei.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _1(t,e){return Ur(t,"POST","/v1/accounts:signUp",De(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await Ln._fromIdTokenResponse(e,r,i),o=KI(r);return new wn({user:s,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=KI(r);return new wn({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function KI(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function b9(t){var i;if(xe(t.app))return Promise.reject(ct(t));const e=$e(t);if(await e._initializationPromise,(i=e.currentUser)!=null&&i.isAnonymous)return new wn({user:e.currentUser,providerId:null,operationType:"signIn"});const n=await _1(e,{returnSecureToken:!0}),r=await wn._fromIdTokenResponse(e,"signIn",n,!0);return await e._updateCurrentUser(r.user),r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qh extends jn{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,qh.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new qh(e,n,r,i)}}function y1(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?qh._fromErrorAndOperation(t,s,e,r):s})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v1(t){return new Set(t.map(({providerId:e})=>e).filter(e=>!!e))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function x9(t,e){const n=q(t);await Qd(!0,n,e);const{providerUserInfo:r}=await MF(n.auth,{idToken:await n.getIdToken(),deleteProvider:[e]}),i=v1(r||[]);return n.providerData=n.providerData.filter(s=>i.has(s.providerId)),i.has("phone")||(n.phoneNumber=null),await n.auth._persistUserIfCurrent(n),n}async function ky(t,e,n=!1){const r=await Mr(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return wn._forOperation(t,"link",r)}async function Qd(t,e,n){await Xl(e);const r=v1(e.providerData),i=t===!1?"provider-already-linked":"no-such-provider";V(r.has(n)===t,e.auth,i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function E1(t,e,n=!1){const{auth:r}=t;if(xe(r.app))return Promise.reject(ct(r));const i="reauthenticate";try{const s=await Mr(t,y1(r,i,e,t),n);V(s.idToken,r,"internal-error");const o=Gd(s.idToken);V(o,r,"internal-error");const{sub:a}=o;return V(t.uid===a,r,"user-mismatch"),wn._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Kt(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function w1(t,e,n=!1){if(xe(t.app))return Promise.reject(ct(t));const r="signIn",i=await y1(t,r,e),s=await wn._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Ny(t,e){return w1($e(t),e)}async function b4(t,e){const n=q(t);return await Qd(!1,n,e.providerId),ky(n,e)}async function x4(t,e){return E1(q(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function L4(t,e){return Ur(t,"POST","/v1/accounts:signInWithCustomToken",De(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function L9(t,e){if(xe(t.app))return Promise.reject(ct(t));const n=$e(t),r=await L4(n,{token:e,returnSecureToken:!0}),i=await wn._fromIdTokenResponse(n,"signIn",r);return await n._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ru{constructor(e,n){this.factorId=e,this.uid=n.mfaEnrollmentId,this.enrollmentTime=new Date(n.enrolledAt).toUTCString(),this.displayName=n.displayName}static _fromServerResponse(e,n){return"phoneInfo"in n?Dy._fromServerResponse(e,n):"totpInfo"in n?Oy._fromServerResponse(e,n):Kt(e,"internal-error")}}class Dy extends Ru{constructor(e){super("phone",e),this.phoneNumber=e.phoneInfo}static _fromServerResponse(e,n){return new Dy(n)}}class Oy extends Ru{constructor(e){super("totp",e)}static _fromServerResponse(e,n){return new Oy(n)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yd(t,e,n){var r;V(((r=n.url)==null?void 0:r.length)>0,t,"invalid-continue-uri"),V(typeof n.dynamicLinkDomain>"u"||n.dynamicLinkDomain.length>0,t,"invalid-dynamic-link-domain"),V(typeof n.linkDomain>"u"||n.linkDomain.length>0,t,"invalid-hosting-link-domain"),e.continueUrl=n.url,e.dynamicLinkDomain=n.dynamicLinkDomain,e.linkDomain=n.linkDomain,e.canHandleCodeInApp=n.handleCodeInApp,n.iOS&&(V(n.iOS.bundleId.length>0,t,"missing-ios-bundle-id"),e.iOSBundleId=n.iOS.bundleId),n.android&&(V(n.android.packageName.length>0,t,"missing-android-pkg-name"),e.androidInstallApp=n.android.installApp,e.androidMinimumVersionCode=n.android.minimumVersion,e.androidPackageName=n.android.packageName)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function by(t){const e=$e(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function M9(t,e,n){const r=$e(t),i={requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"};n&&Yd(r,i,n),await Ei(r,i,"getOobCode",v4,"EMAIL_PASSWORD_PROVIDER")}async function V9(t,e,n){await g1(q(t),{oobCode:e,newPassword:n}).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&by(t),r})}async function F9(t,e){await g4(q(t),{oobCode:e})}async function M4(t,e){const n=q(t),r=await g1(n,{oobCode:e}),i=r.requestType;switch(V(i,n,"internal-error"),i){case"EMAIL_SIGNIN":break;case"VERIFY_AND_CHANGE_EMAIL":V(r.newEmail,n,"internal-error");break;case"REVERT_SECOND_FACTOR_ADDITION":V(r.mfaInfo,n,"internal-error");default:V(r.email,n,"internal-error")}let s=null;return r.mfaInfo&&(s=Ru._fromServerResponse($e(n),r.mfaInfo)),{data:{email:(r.requestType==="VERIFY_AND_CHANGE_EMAIL"?r.newEmail:r.email)||null,previousEmail:(r.requestType==="VERIFY_AND_CHANGE_EMAIL"?r.email:r.newEmail)||null,multiFactorInfo:s},operation:i}}async function U9(t,e){const{data:n}=await M4(q(t),e);return n.email}async function B9(t,e,n){if(xe(t.app))return Promise.reject(ct(t));const r=$e(t),o=await Ei(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",_1,"EMAIL_PASSWORD_PROVIDER").catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&by(t),u}),a=await wn._fromIdTokenResponse(r,"signIn",o);return await r._updateCurrentUser(a.user),a}function z9(t,e,n){return xe(t.app)?Promise.reject(ct(t)):Ny(q(t),Ms.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&by(t),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function j9(t,e,n){const r=$e(t),i={requestType:"EMAIL_SIGNIN",email:e,clientType:"CLIENT_TYPE_WEB"};function s(o,a){V(a.handleCodeInApp,r,"argument-error"),a&&Yd(r,o,a)}s(i,n),await Ei(r,i,"getOobCode",E4,"EMAIL_PASSWORD_PROVIDER")}function W9(t,e){const n=Au.parseLink(e);return(n==null?void 0:n.operation)==="EMAIL_SIGNIN"}async function $9(t,e,n){if(xe(t.app))return Promise.reject(ct(t));const r=q(t),i=Ms.credentialWithLink(e,n||Yl());return V(i._tenantId===(r.tenantId||null),r,"tenant-id-mismatch"),Ny(r,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function V4(t,e){return Oe(t,"POST","/v1/accounts:createAuthUri",De(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function H9(t,e){const n=Cy()?Yl():"http://localhost",r={identifier:e,continueUri:n},{signinMethods:i}=await V4(q(t),r);return i||[]}async function q9(t,e){const n=q(t),i={requestType:"VERIFY_EMAIL",idToken:await t.getIdToken()};e&&Yd(n.auth,i,e);const{email:s}=await y4(n.auth,i);s!==t.email&&await t.reload()}async function G9(t,e,n){const r=q(t),s={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:await t.getIdToken(),newEmail:e};n&&Yd(r.auth,s,n);const{email:o}=await w4(r.auth,s);o!==t.email&&await t.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function F4(t,e){return Oe(t,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function K9(t,{displayName:e,photoURL:n}){if(e===void 0&&n===void 0)return;const r=q(t),s={idToken:await r.getIdToken(),displayName:e,photoUrl:n,returnSecureToken:!0},o=await Mr(r,F4(r.auth,s));r.displayName=o.displayName||null,r.photoURL=o.photoUrl||null;const a=r.providerData.find(({providerId:u})=>u==="password");a&&(a.displayName=r.displayName,a.photoURL=r.photoURL),await r._updateTokensIfNecessary(o)}function Q9(t,e){const n=q(t);return xe(n.auth.app)?Promise.reject(ct(n.auth)):I1(n,e,null)}function Y9(t,e){return I1(q(t),null,e)}async function I1(t,e,n){const{auth:r}=t,s={idToken:await t.getIdToken(),returnSecureToken:!0};e&&(s.email=e),n&&(s.password=n);const o=await Mr(t,p4(r,s));await t._updateTokensIfNecessary(o,!0)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function U4(t){var i,s;if(!t)return null;const{providerId:e}=t,n=t.rawUserInfo?JSON.parse(t.rawUserInfo):{},r=t.isNewUser||t.kind==="identitytoolkit#SignupNewUserResponse";if(!e&&(t!=null&&t.idToken)){const o=(s=(i=Gd(t.idToken))==null?void 0:i.firebase)==null?void 0:s.sign_in_provider;if(o){const a=o!=="anonymous"&&o!=="custom"?o:null;return new So(r,a)}}if(!e)return null;switch(e){case"facebook.com":return new B4(r,n);case"github.com":return new z4(r,n);case"google.com":return new j4(r,n);case"twitter.com":return new W4(r,n,t.screenName||null);case"custom":case"anonymous":return new So(r,null);default:return new So(r,e,n)}}class So{constructor(e,n,r={}){this.isNewUser=e,this.providerId=n,this.profile=r}}class T1 extends So{constructor(e,n,r,i){super(e,n,r),this.username=i}}class B4 extends So{constructor(e,n){super(e,"facebook.com",n)}}class z4 extends T1{constructor(e,n){super(e,"github.com",n,typeof(n==null?void 0:n.login)=="string"?n==null?void 0:n.login:null)}}class j4 extends So{constructor(e,n){super(e,"google.com",n)}}class W4 extends T1{constructor(e,n,r){super(e,"twitter.com",n,r)}}function X9(t){const{user:e,_tokenResponse:n}=t;return e.isAnonymous&&!n?{providerId:null,isNewUser:!1,profile:null}:U4(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $4(t,e){return q(t).setPersistence(e)}function J9(t){return p1(t)}async function Z9(t,e){return $e(t).validatePassword(e)}function H4(t,e,n,r){return q(t).onIdTokenChanged(e,n,r)}function q4(t,e,n){return q(t).beforeAuthStateChanged(e,n)}function eB(t,e,n,r){return q(t).onAuthStateChanged(e,n,r)}function tB(t){q(t).useDeviceLanguage()}function nB(t,e){return q(t).updateCurrentUser(e)}function rB(t){return q(t).signOut()}function iB(t,e){return $e(t).revokeAccessToken(e)}async function sB(t){return q(t).delete()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(e,n,r){this.type=e,this.credential=n,this.user=r}static _fromIdtoken(e,n){return new rs("enroll",e,n)}static _fromMfaPendingCredential(e){return new rs("signin",e)}toJSON(){return{multiFactorSession:{[this.type==="enroll"?"idToken":"pendingCredential"]:this.credential}}}static fromJSON(e){var n,r;if(e!=null&&e.multiFactorSession){if((n=e.multiFactorSession)!=null&&n.pendingCredential)return rs._fromMfaPendingCredential(e.multiFactorSession.pendingCredential);if((r=e.multiFactorSession)!=null&&r.idToken)return rs._fromIdtoken(e.multiFactorSession.idToken)}return null}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xy{constructor(e,n,r){this.session=e,this.hints=n,this.signInResolver=r}static _fromError(e,n){const r=$e(e),i=n.customData._serverResponse,s=(i.mfaInfo||[]).map(a=>Ru._fromServerResponse(r,a));V(i.mfaPendingCredential,r,"internal-error");const o=rs._fromMfaPendingCredential(i.mfaPendingCredential);return new xy(o,s,async a=>{const u=await a._process(r,o);delete i.mfaInfo,delete i.mfaPendingCredential;const c={...i,idToken:u.idToken,refreshToken:u.refreshToken};switch(n.operationType){case"signIn":const d=await wn._fromIdTokenResponse(r,n.operationType,c);return await r._updateCurrentUser(d.user),d;case"reauthenticate":return V(n.user,r,"internal-error"),wn._forOperation(n.user,n.operationType,c);default:Kt(r,"internal-error")}})}async resolveSignIn(e){const n=e;return this.signInResolver(n)}}function oB(t,e){var i;const n=q(t),r=e;return V(e.customData.operationType,n,"argument-error"),V((i=r.customData._serverResponse)==null?void 0:i.mfaPendingCredential,n,"argument-error"),xy._fromError(n,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function QI(t,e){return Oe(t,"POST","/v2/accounts/mfaEnrollment:start",De(t,e))}function G4(t,e){return Oe(t,"POST","/v2/accounts/mfaEnrollment:finalize",De(t,e))}function K4(t,e){return Oe(t,"POST","/v2/accounts/mfaEnrollment:start",De(t,e))}function Q4(t,e){return Oe(t,"POST","/v2/accounts/mfaEnrollment:finalize",De(t,e))}function Y4(t,e){return Oe(t,"POST","/v2/accounts/mfaEnrollment:withdraw",De(t,e))}class Ly{constructor(e){this.user=e,this.enrolledFactors=[],e._onReload(n=>{n.mfaInfo&&(this.enrolledFactors=n.mfaInfo.map(r=>Ru._fromServerResponse(e.auth,r)))})}static _fromUser(e){return new Ly(e)}async getSession(){return rs._fromIdtoken(await this.user.getIdToken(),this.user)}async enroll(e,n){const r=e,i=await this.getSession(),s=await Mr(this.user,r._process(this.user.auth,i,n));return await this.user._updateTokensIfNecessary(s),this.user.reload()}async unenroll(e){const n=typeof e=="string"?e:e.uid,r=await this.user.getIdToken();try{const i=await Mr(this.user,Y4(this.user.auth,{idToken:r,mfaEnrollmentId:n}));this.enrolledFactors=this.enrolledFactors.filter(({uid:s})=>s!==n),await this.user._updateTokensIfNecessary(i),await this.user.reload()}catch(i){throw i}}}const pp=new WeakMap;function aB(t){const e=q(t);return pp.has(e)||pp.set(e,Ly._fromUser(e)),pp.get(e)}const Gh="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S1{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Gh,"1"),this.storage.removeItem(Gh),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X4=1e3,J4=10;class C1 extends S1{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=c1(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,a,u)=>{this.notifyListeners(o,u)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);HF()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,J4):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},X4)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}C1.type="LOCAL";const A1=C1;/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z4=1e3;function mp(t){var r;const e=t.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),n=RegExp(`${e}=([^;]+)`);return((r=document.cookie.match(n))==null?void 0:r[1])??null}function gp(t){return`${window.location.protocol==="http:"?"__dev_":"__HOST-"}FIREBASE_${t.split(":")[3]}`}class R1{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(typeof window===void 0)return e;const n=new URL(`${window.location.origin}/__cookies__`);return n.searchParams.set("finalTarget",e),n}async _isAvailable(){return typeof isSecureContext=="boolean"&&!isSecureContext||typeof navigator>"u"||typeof document>"u"?!1:navigator.cookieEnabled??!0}async _set(e,n){}async _get(e){if(!this._isAvailable())return null;const n=gp(e);if(window.cookieStore){const r=await window.cookieStore.get(n);return r==null?void 0:r.value}return mp(n)}async _remove(e){if(!this._isAvailable()||!await this._get(e))return;const r=gp(e);document.cookie=`${r}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,n){if(!this._isAvailable())return;const r=gp(e);if(window.cookieStore){const a=c=>{const d=c.changed.find(m=>m.name===r);d&&n(d.value),c.deleted.find(m=>m.name===r)&&n(null)},u=()=>window.cookieStore.removeEventListener("change",a);return this.listenerUnsubscribes.set(n,u),window.cookieStore.addEventListener("change",a)}let i=mp(r);const s=setInterval(()=>{const a=mp(r);a!==i&&(n(a),i=a)},Z4),o=()=>clearInterval(s);this.listenerUnsubscribes.set(n,o)}_removeListener(e,n){const r=this.listenerUnsubscribes.get(n);r&&(r(),this.listenerUnsubscribes.delete(n))}}R1.type="COOKIE";const lB=R1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P1 extends S1{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}P1.type="SESSION";const k1=P1;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eU(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xd{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new Xd(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const a=Array.from(o).map(async c=>c(n.origin,s)),u=await eU(a);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:u})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Xd.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jd(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tU{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((a,u)=>{const c=Jd("",20);i.port1.start();const d=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(f){const m=f;if(m.data.eventId===c)switch(m.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),a(m.data.response);break;default:clearTimeout(d),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ke(){return window}function nU(t){Ke().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function My(){return typeof Ke().WorkerGlobalScope<"u"&&typeof Ke().importScripts=="function"}async function rU(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function iU(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function sU(){return My()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N1="firebaseLocalStorageDb",oU=1,Kh="firebaseLocalStorage",D1="fbase_key";class Pu{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Zd(t,e){return t.transaction([Kh],e?"readwrite":"readonly").objectStore(Kh)}function aU(){const t=indexedDB.deleteDatabase(N1);return new Pu(t).toPromise()}function ig(){const t=indexedDB.open(N1,oU);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(Kh,{keyPath:D1})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(Kh)?e(r):(r.close(),await aU(),e(await ig()))})})}async function YI(t,e,n){const r=Zd(t,!0).put({[D1]:e,value:n});return new Pu(r).toPromise()}async function lU(t,e){const n=Zd(t,!1).get(e),r=await new Pu(n).toPromise();return r===void 0?null:r.value}function XI(t,e){const n=Zd(t,!0).delete(e);return new Pu(n).toPromise()}const uU=800,cU=3;class O1{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ig(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>cU)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return My()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Xd._getInstance(sU()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await rU(),!this.activeServiceWorker)return;this.sender=new tU(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||iU()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await ig();return await YI(e,Gh,"1"),await XI(e,Gh),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>YI(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>lU(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>XI(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Zd(i,!1).getAll();return new Pu(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),uU)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}O1.type="LOCAL";const hU=O1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function JI(t,e){return Oe(t,"POST","/v2/accounts/mfaSignIn:start",De(t,e))}function dU(t,e){return Oe(t,"POST","/v2/accounts/mfaSignIn:finalize",De(t,e))}function fU(t,e){return Oe(t,"POST","/v2/accounts/mfaSignIn:finalize",De(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _p=d1("rcb"),pU=new Tu(3e4,6e4);class mU{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!((e=Ke().grecaptcha)!=null&&e.render)}load(e,n=""){return V(gU(n),e,"argument-error"),this.shouldResolveImmediately(n)&&UI(Ke().grecaptcha)?Promise.resolve(Ke().grecaptcha):new Promise((r,i)=>{const s=Ke().setTimeout(()=>{i(Lt(e,"network-request-failed"))},pU.get());Ke()[_p]=()=>{Ke().clearTimeout(s),delete Ke()[_p];const a=Ke().grecaptcha;if(!a||!UI(a)){i(Lt(e,"internal-error"));return}const u=a.render;a.render=(c,d)=>{const f=u(c,d);return this.counter++,f},this.hostLanguage=n,r(a)};const o=`${JF()}?${Rs({onload:_p,render:"explicit",hl:n})}`;Py(o).catch(()=>{clearTimeout(s),i(Lt(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var n;return!!((n=Ke().grecaptcha)!=null&&n.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}function gU(t){return t.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(t)}class _U{async load(e){return new r4(e)}clearedOneInstance(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pl="recaptcha",yU={theme:"light",type:"image"};class uB{constructor(e,n,r={...yU}){this.parameters=r,this.type=pl,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=$e(e),this.isInvisible=this.parameters.size==="invisible",V(typeof document<"u",this.auth,"operation-not-supported-in-this-environment");const i=typeof n=="string"?document.getElementById(n):n;V(i,this.auth,"argument-error"),this.container=i,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new _U:new mU,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),n=this.getAssertedRecaptcha(),r=n.getResponse(e);return r||new Promise(i=>{const s=o=>{o&&(this.tokenChangeListeners.delete(s),i(o))};this.tokenChangeListeners.add(s),this.isInvisible&&n.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise?this.renderPromise:(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e}),this.renderPromise)}_reset(){this.assertNotDestroyed(),this.widgetId!==null&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){V(!this.parameters.sitekey,this.auth,"argument-error"),V(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),V(typeof document<"u",this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return n=>{if(this.tokenChangeListeners.forEach(r=>r(n)),typeof e=="function")e(n);else if(typeof e=="string"){const r=Ke()[e];typeof r=="function"&&r(n)}}}assertNotDestroyed(){V(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const n=document.createElement("div");e.appendChild(n),e=n}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){V(Cy()&&!My(),this.auth,"internal-error"),await vU(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await xF(this.auth);V(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return V(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}function vU(){let t=null;return new Promise(e=>{if(document.readyState==="complete"){e();return}t=()=>e(),window.addEventListener("load",t)}).catch(e=>{throw t&&window.removeEventListener("load",t),e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vy{constructor(e,n){this.verificationId=e,this.onConfirmation=n}confirm(e){const n=us._fromVerification(this.verificationId,e);return this.onConfirmation(n)}}async function cB(t,e,n){if(xe(t.app))return Promise.reject(ct(t));const r=$e(t),i=await ef(r,e,q(n));return new Vy(i,s=>Ny(r,s))}async function hB(t,e,n){const r=q(t);await Qd(!1,r,"phone");const i=await ef(r.auth,e,q(n));return new Vy(i,s=>b4(r,s))}async function dB(t,e,n){const r=q(t);if(xe(r.auth.app))return Promise.reject(ct(r.auth));const i=await ef(r.auth,e,q(n));return new Vy(i,s=>x4(r,s))}async function ef(t,e,n){var r;if(!t._getRecaptchaConfig())try{await p1(t)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let i;if(typeof e=="string"?i={phoneNumber:e}:i=e,"session"in i){const s=i.session;if("phoneNumber"in i){V(s.type==="enroll",t,"internal-error");const o={idToken:s.credential,phoneEnrollmentInfo:{phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await Ei(t,o,"mfaSmsEnrollment",async(d,f)=>{if(f.phoneEnrollmentInfo.captchaResponse===fl){V((n==null?void 0:n.type)===pl,d,"argument-error");const m=await yp(d,f,n);return QI(d,m)}return QI(d,f)},"PHONE_PROVIDER").catch(d=>Promise.reject(d))).phoneSessionInfo.sessionInfo}else{V(s.type==="signin",t,"internal-error");const o=((r=i.multiFactorHint)==null?void 0:r.uid)||i.multiFactorUid;V(o,t,"missing-multi-factor-info");const a={mfaPendingCredential:s.credential,mfaEnrollmentId:o,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await Ei(t,a,"mfaSmsSignIn",async(f,m)=>{if(m.phoneSignInInfo.captchaResponse===fl){V((n==null?void 0:n.type)===pl,f,"argument-error");const y=await yp(f,m,n);return JI(f,y)}return JI(f,m)},"PHONE_PROVIDER").catch(f=>Promise.reject(f))).phoneResponseInfo.sessionInfo}}else{const s={phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await Ei(t,s,"sendVerificationCode",async(c,d)=>{if(d.captchaResponse===fl){V((n==null?void 0:n.type)===pl,c,"argument-error");const f=await yp(c,d,n);return GI(c,f)}return GI(c,d)},"PHONE_PROVIDER").catch(c=>Promise.reject(c))).sessionInfo}}finally{n==null||n._reset()}}async function fB(t,e){const n=q(t);if(xe(n.auth.app))return Promise.reject(ct(n.auth));await ky(n,e)}async function yp(t,e,n){V(n.type===pl,t,"argument-error");const r=await n.verify();V(typeof r=="string",t,"argument-error");const i={...e};if("phoneEnrollmentInfo"in i){const s=i.phoneEnrollmentInfo.phoneNumber,o=i.phoneEnrollmentInfo.captchaResponse,a=i.phoneEnrollmentInfo.clientType,u=i.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(i,{phoneEnrollmentInfo:{phoneNumber:s,recaptchaToken:r,captchaResponse:o,clientType:a,recaptchaVersion:u}}),i}else if("phoneSignInInfo"in i){const s=i.phoneSignInInfo.captchaResponse,o=i.phoneSignInInfo.clientType,a=i.phoneSignInInfo.recaptchaVersion;return Object.assign(i,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:s,clientType:o,recaptchaVersion:a}}),i}else return Object.assign(i,{recaptchaToken:r}),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co{constructor(e){this.providerId=Co.PROVIDER_ID,this.auth=$e(e)}verifyPhoneNumber(e,n){return ef(this.auth,e,q(n))}static credential(e,n){return us._fromVerification(e,n)}static credentialFromResult(e){const n=e;return Co.credentialFromTaggedObject(n)}static credentialFromError(e){return Co.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{phoneNumber:n,temporaryProof:r}=e;return n&&r?us._fromTokenResponse(n,r):null}}Co.PROVIDER_ID="phone";Co.PHONE_SIGN_IN_METHOD="phone";/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vs(t,e){return e?Er(e):(V(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fy extends Cu{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Sr(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Sr(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Sr(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function EU(t){return w1(t.auth,new Fy(t),t.bypassAuthState)}function wU(t){const{auth:e,user:n}=t;return V(n,e,"internal-error"),E1(n,new Fy(t),t.bypassAuthState)}async function IU(t){const{auth:e,user:n}=t;return V(n,e,"internal-error"),ky(n,new Fy(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b1{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:o,type:a}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(u))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return EU;case"linkViaPopup":case"linkViaRedirect":return IU;case"reauthViaPopup":case"reauthViaRedirect":return wU;default:Kt(this.auth,"internal-error")}}resolve(e){Lr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Lr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TU=new Tu(2e3,1e4);async function pB(t,e,n){if(xe(t.app))return Promise.reject(Lt(t,"operation-not-supported-in-this-environment"));const r=$e(t);sa(t,e,Br);const i=Vs(r,n);return new wr(r,"signInViaPopup",e,i).executeNotNull()}async function mB(t,e,n){const r=q(t);if(xe(r.auth.app))return Promise.reject(Lt(r.auth,"operation-not-supported-in-this-environment"));sa(r.auth,e,Br);const i=Vs(r.auth,n);return new wr(r.auth,"reauthViaPopup",e,i,r).executeNotNull()}async function gB(t,e,n){const r=q(t);sa(r.auth,e,Br);const i=Vs(r.auth,n);return new wr(r.auth,"linkViaPopup",e,i,r).executeNotNull()}class wr extends b1{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,wr.currentPopupAction&&wr.currentPopupAction.cancel(),wr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return V(e,this.auth,"internal-error"),e}async onExecution(){Lr(this.filter.length===1,"Popup operations only handle one event");const e=Jd();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Lt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Lt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,wr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Lt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,TU.get())};e()}}wr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SU="pendingRedirect",$c=new Map;class CU extends b1{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=$c.get(this.auth._key());if(!e){try{const r=await AU(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}$c.set(this.auth._key(),e)}return this.bypassAuthState||$c.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function AU(t,e){const n=L1(e),r=x1(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function Uy(t,e){return x1(t)._set(L1(e),"true")}function RU(t,e){$c.set(t._key(),e)}function x1(t){return Er(t._redirectPersistence)}function L1(t){return jc(SU,t.config.apiKey,t.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _B(t,e,n){return PU(t,e,n)}async function PU(t,e,n){if(xe(t.app))return Promise.reject(ct(t));const r=$e(t);sa(t,e,Br),await r._initializationPromise;const i=Vs(r,n);return await Uy(i,r),i._openRedirect(r,e,"signInViaRedirect")}function yB(t,e,n){return kU(t,e,n)}async function kU(t,e,n){const r=q(t);if(sa(r.auth,e,Br),xe(r.auth.app))return Promise.reject(ct(r.auth));await r.auth._initializationPromise;const i=Vs(r.auth,n);await Uy(i,r.auth);const s=await V1(r);return i._openRedirect(r.auth,e,"reauthViaRedirect",s)}function vB(t,e,n){return NU(t,e,n)}async function NU(t,e,n){const r=q(t);sa(r.auth,e,Br),await r.auth._initializationPromise;const i=Vs(r.auth,n);await Qd(!1,r,e.providerId),await Uy(i,r.auth);const s=await V1(r);return i._openRedirect(r.auth,e,"linkViaRedirect",s)}async function EB(t,e){return await $e(t)._initializationPromise,M1(t,e,!1)}async function M1(t,e,n=!1){if(xe(t.app))return Promise.reject(ct(t));const r=$e(t),i=Vs(r,e),o=await new CU(r,i,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}async function V1(t){const e=Jd(`${t.uid}:::`);return t._redirectEventId=e,await t.auth._setRedirectUser(t),await t.auth._persistUserIfCurrent(t),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DU=10*60*1e3;class OU{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!bU(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!F1(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(Lt(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=DU&&this.cachedEventUids.clear(),this.cachedEventUids.has(ZI(e))}saveEventToCache(e){this.cachedEventUids.add(ZI(e)),this.lastProcessedEventTime=Date.now()}}function ZI(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function F1({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function bU(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return F1(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xU(t,e={}){return Oe(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const LU=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,MU=/^https?/;async function VU(t){if(t.config.emulator)return;const{authorizedDomains:e}=await xU(t);for(const n of e)try{if(FU(n))return}catch{}Kt(t,"unauthorized-domain")}function FU(t){const e=Yl(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!MU.test(n))return!1;if(LU.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UU=new Tu(3e4,6e4);function eT(){const t=Ke().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function BU(t){return new Promise((e,n)=>{var i,s,o;function r(){eT(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{eT(),n(Lt(t,"network-request-failed"))},timeout:UU.get()})}if((s=(i=Ke().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((o=Ke().gapi)!=null&&o.load)r();else{const a=d1("iframefcb");return Ke()[a]=()=>{gapi.load?r():n(Lt(t,"network-request-failed"))},Py(`${e4()}?onload=${a}`).catch(u=>n(u))}}).catch(e=>{throw Hc=null,e})}let Hc=null;function zU(t){return Hc=Hc||BU(t),Hc}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jU=new Tu(5e3,15e3),WU="__/auth/iframe",$U="emulator/auth/iframe",HU={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},qU=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function GU(t){const e=t.config;V(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Ay(e,$U):`https://${t.config.authDomain}/${WU}`,r={apiKey:e.apiKey,appName:t.name,v:Ps},i=qU.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Rs(r).slice(1)}`}async function KU(t){const e=await zU(t),n=Ke().gapi;return V(n,t,"internal-error"),e.open({where:document.body,url:GU(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:HU,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=Lt(t,"network-request-failed"),a=Ke().setTimeout(()=>{s(o)},jU.get());function u(){Ke().clearTimeout(a),i(r)}r.ping(u).then(u,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QU={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},YU=500,XU=600,JU="_blank",ZU="http://localhost";class tT{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function e3(t,e,n,r=YU,i=XU){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const u={...QU,width:r.toString(),height:i.toString(),top:s,left:o},c=Nt().toLowerCase();n&&(a=s1(c)?JU:n),r1(c)&&(e=e||ZU,u.scrollbars="yes");const d=Object.entries(u).reduce((m,[y,C])=>`${m}${y}=${C},`,"");if($F(c)&&a!=="_self")return t3(e||"",a),new tT(null);const f=window.open(e||"",a,d);V(f,t,"popup-blocked");try{f.focus()}catch{}return new tT(f)}function t3(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const n3="__/auth/handler",r3="emulator/auth/handler",i3=encodeURIComponent("fac");async function nT(t,e,n,r,i,s){V(t.config.authDomain,t,"auth-domain-config-required"),V(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Ps,eventId:i};if(e instanceof Br){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",yh(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,f]of Object.entries(s||{}))o[d]=f}if(e instanceof oa){const d=e.getScopes().filter(f=>f!=="");d.length>0&&(o.scopes=d.join(","))}t.tenantId&&(o.tid=t.tenantId);const a=o;for(const d of Object.keys(a))a[d]===void 0&&delete a[d];const u=await t._getAppCheckToken(),c=u?`#${i3}=${encodeURIComponent(u)}`:"";return`${s3(t)}?${Rs(a).slice(1)}${c}`}function s3({config:t}){return t.emulator?Ay(t,r3):`https://${t.authDomain}/${n3}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vp="webStorageSupport";class o3{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=k1,this._completeRedirectFn=M1,this._overrideRedirectResult=RU}async _openPopup(e,n,r,i){var o;Lr((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const s=await nT(e,n,r,Yl(),i);return e3(e,s,Jd())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await nT(e,n,r,Yl(),i);return nU(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(Lr(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await KU(e),r=new OU(e);return n.register("authEvent",i=>(V(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(vp,{type:vp},i=>{var o;const s=(o=i==null?void 0:i[0])==null?void 0:o[vp];s!==void 0&&n(!!s),Kt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=VU(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return c1()||i1()||Ry()}}const a3=o3;class U1{constructor(e){this.factorId=e}_process(e,n,r){switch(n.type){case"enroll":return this._finalizeEnroll(e,n.credential,r);case"signin":return this._finalizeSignIn(e,n.credential);default:return Zn("unexpected MultiFactorSessionType")}}}class By extends U1{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new By(e)}_finalizeEnroll(e,n,r){return G4(e,{idToken:n,displayName:r,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,n){return dU(e,{mfaPendingCredential:n,phoneVerificationInfo:this.credential._makeVerificationRequest()})}}class l3{constructor(){}static assertion(e){return By._fromCredential(e)}}l3.FACTOR_ID="phone";class u3{static assertionForEnrollment(e,n){return eu._fromSecret(e,n)}static assertionForSignIn(e,n){return eu._fromEnrollmentId(e,n)}static async generateSecret(e){var i;const n=e;V(typeof((i=n.user)==null?void 0:i.auth)<"u","internal-error");const r=await K4(n.user.auth,{idToken:n.credential,totpEnrollmentInfo:{}});return zy._fromStartTotpMfaEnrollmentResponse(r,n.user.auth)}}u3.FACTOR_ID="totp";class eu extends U1{constructor(e,n,r){super("totp"),this.otp=e,this.enrollmentId=n,this.secret=r}static _fromSecret(e,n){return new eu(n,void 0,e)}static _fromEnrollmentId(e,n){return new eu(n,e)}async _finalizeEnroll(e,n,r){return V(typeof this.secret<"u",e,"argument-error"),Q4(e,{idToken:n,displayName:r,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,n){V(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");const r={verificationCode:this.otp};return fU(e,{mfaPendingCredential:n,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:r})}}class zy{constructor(e,n,r,i,s,o,a){this.sessionInfo=o,this.auth=a,this.secretKey=e,this.hashingAlgorithm=n,this.codeLength=r,this.codeIntervalSeconds=i,this.enrollmentCompletionDeadline=s}static _fromStartTotpMfaEnrollmentResponse(e,n){return new zy(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,n)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,n){var i;let r=!1;return(wc(e)||wc(n))&&(r=!0),r&&(wc(e)&&(e=((i=this.auth.currentUser)==null?void 0:i.email)||"unknownuser"),wc(n)&&(n=this.auth.name)),`otpauth://totp/${n}:${e}?secret=${this.secretKey}&issuer=${n}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}}function wc(t){return typeof t>"u"||(t==null?void 0:t.length)===0}var rT="@firebase/auth",iT="1.11.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class c3{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){V(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function h3(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function d3(t){zn(new Gt("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=r.options;V(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:a,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:h1(t)},c=new YF(r,i,s,u);return c4(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),zn(new Gt("auth-internal",e=>{const n=$e(e.getProvider("auth").getImmediate());return(r=>new c3(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ht(rT,iT,h3(t)),Ht(rT,iT,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f3=5*60,p3=xS("authIdTokenMaxAge")||f3;let sT=null;const m3=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>p3)return;const i=n==null?void 0:n.token;sT!==i&&(sT=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function g3(t=au()){const e=Fi(t,"auth");if(e.isInitialized())return e.getImmediate();const n=u4(t,{popupRedirectResolver:a3,persistence:[hU,A1,k1]}),r=xS("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=m3(s.toString());q4(n,o,()=>o(n.currentUser)),H4(n,a=>o(a))}}const i=DS("auth");return i&&h4(n,`http://${i}`),n}function _3(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}XF({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=Lt("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",_3().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});d3("Browser");const B1="@firebase/installations",jy="0.6.19";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const z1=1e4,j1=`w:${jy}`,W1="FIS_v2",y3="https://firebaseinstallations.googleapis.com/v1",v3=60*60*1e3,E3="installations",w3="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I3={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Is=new As(E3,w3,I3);function $1(t){return t instanceof jn&&t.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function H1({projectId:t}){return`${y3}/projects/${t}/installations`}function q1(t){return{token:t.token,requestStatus:2,expiresIn:S3(t.expiresIn),creationTime:Date.now()}}async function G1(t,e){const r=(await e.json()).error;return Is.create("request-failed",{requestName:t,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function K1({apiKey:t}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function T3(t,{refreshToken:e}){const n=K1(t);return n.append("Authorization",C3(e)),n}async function Q1(t){const e=await t();return e.status>=500&&e.status<600?t():e}function S3(t){return Number(t.replace("s","000"))}function C3(t){return`${W1} ${t}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function A3({appConfig:t,heartbeatServiceProvider:e},{fid:n}){const r=H1(t),i=K1(t),s=e.getImmediate({optional:!0});if(s){const c=await s.getHeartbeatsHeader();c&&i.append("x-firebase-client",c)}const o={fid:n,authVersion:W1,appId:t.appId,sdkVersion:j1},a={method:"POST",headers:i,body:JSON.stringify(o)},u=await Q1(()=>fetch(r,a));if(u.ok){const c=await u.json();return{fid:c.fid||n,registrationStatus:2,refreshToken:c.refreshToken,authToken:q1(c.authToken)}}else throw await G1("Create Installation",u)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y1(t){return new Promise(e=>{setTimeout(e,t)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R3(t){return btoa(String.fromCharCode(...t)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P3=/^[cdef][\w-]{21}$/,sg="";function k3(){try{const t=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(t),t[0]=112+t[0]%16;const n=N3(t);return P3.test(n)?n:sg}catch{return sg}}function N3(t){return R3(t).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tf(t){return`${t.appName}!${t.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X1=new Map;function J1(t,e){const n=tf(t);Z1(n,e),D3(n,e)}function Z1(t,e){const n=X1.get(t);if(n)for(const r of n)r(e)}function D3(t,e){const n=O3();n&&n.postMessage({key:t,fid:e}),b3()}let is=null;function O3(){return!is&&"BroadcastChannel"in self&&(is=new BroadcastChannel("[Firebase] FID Change"),is.onmessage=t=>{Z1(t.data.key,t.data.fid)}),is}function b3(){X1.size===0&&is&&(is.close(),is=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x3="firebase-installations-database",L3=1,Ts="firebase-installations-store";let Ep=null;function Wy(){return Ep||(Ep=WS(x3,L3,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(Ts)}}})),Ep}async function Qh(t,e){const n=tf(t),i=(await Wy()).transaction(Ts,"readwrite"),s=i.objectStore(Ts),o=await s.get(n);return await s.put(e,n),await i.done,(!o||o.fid!==e.fid)&&J1(t,e.fid),e}async function eP(t){const e=tf(t),r=(await Wy()).transaction(Ts,"readwrite");await r.objectStore(Ts).delete(e),await r.done}async function nf(t,e){const n=tf(t),i=(await Wy()).transaction(Ts,"readwrite"),s=i.objectStore(Ts),o=await s.get(n),a=e(o);return a===void 0?await s.delete(n):await s.put(a,n),await i.done,a&&(!o||o.fid!==a.fid)&&J1(t,a.fid),a}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $y(t){let e;const n=await nf(t.appConfig,r=>{const i=M3(r),s=V3(t,i);return e=s.registrationPromise,s.installationEntry});return n.fid===sg?{installationEntry:await e}:{installationEntry:n,registrationPromise:e}}function M3(t){const e=t||{fid:k3(),registrationStatus:0};return tP(e)}function V3(t,e){if(e.registrationStatus===0){if(!navigator.onLine){const i=Promise.reject(Is.create("app-offline"));return{installationEntry:e,registrationPromise:i}}const n={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=F3(t,n);return{installationEntry:n,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:U3(t)}:{installationEntry:e}}async function F3(t,e){try{const n=await A3(t,e);return Qh(t.appConfig,n)}catch(n){throw $1(n)&&n.customData.serverCode===409?await eP(t.appConfig):await Qh(t.appConfig,{fid:e.fid,registrationStatus:0}),n}}async function U3(t){let e=await oT(t.appConfig);for(;e.registrationStatus===1;)await Y1(100),e=await oT(t.appConfig);if(e.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await $y(t);return r||n}return e}function oT(t){return nf(t,e=>{if(!e)throw Is.create("installation-not-found");return tP(e)})}function tP(t){return B3(t)?{fid:t.fid,registrationStatus:0}:t}function B3(t){return t.registrationStatus===1&&t.registrationTime+z1<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function z3({appConfig:t,heartbeatServiceProvider:e},n){const r=j3(t,n),i=T3(t,n),s=e.getImmediate({optional:!0});if(s){const c=await s.getHeartbeatsHeader();c&&i.append("x-firebase-client",c)}const o={installation:{sdkVersion:j1,appId:t.appId}},a={method:"POST",headers:i,body:JSON.stringify(o)},u=await Q1(()=>fetch(r,a));if(u.ok){const c=await u.json();return q1(c)}else throw await G1("Generate Auth Token",u)}function j3(t,{fid:e}){return`${H1(t)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hy(t,e=!1){let n;const r=await nf(t.appConfig,s=>{if(!nP(s))throw Is.create("not-registered");const o=s.authToken;if(!e&&H3(o))return s;if(o.requestStatus===1)return n=W3(t,e),s;{if(!navigator.onLine)throw Is.create("app-offline");const a=G3(s);return n=$3(t,a),a}});return n?await n:r.authToken}async function W3(t,e){let n=await aT(t.appConfig);for(;n.authToken.requestStatus===1;)await Y1(100),n=await aT(t.appConfig);const r=n.authToken;return r.requestStatus===0?Hy(t,e):r}function aT(t){return nf(t,e=>{if(!nP(e))throw Is.create("not-registered");const n=e.authToken;return K3(n)?{...e,authToken:{requestStatus:0}}:e})}async function $3(t,e){try{const n=await z3(t,e),r={...e,authToken:n};return await Qh(t.appConfig,r),n}catch(n){if($1(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await eP(t.appConfig);else{const r={...e,authToken:{requestStatus:0}};await Qh(t.appConfig,r)}throw n}}function nP(t){return t!==void 0&&t.registrationStatus===2}function H3(t){return t.requestStatus===2&&!q3(t)}function q3(t){const e=Date.now();return e<t.creationTime||t.creationTime+t.expiresIn<e+v3}function G3(t){const e={requestStatus:1,requestTime:Date.now()};return{...t,authToken:e}}function K3(t){return t.requestStatus===1&&t.requestTime+z1<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Q3(t){const e=t,{installationEntry:n,registrationPromise:r}=await $y(e);return r?r.catch(console.error):Hy(e).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Y3(t,e=!1){const n=t;return await X3(n),(await Hy(n,e)).token}async function X3(t){const{registrationPromise:e}=await $y(t);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function J3(t){if(!t||!t.options)throw wp("App Configuration");if(!t.name)throw wp("App Name");const e=["projectId","apiKey","appId"];for(const n of e)if(!t.options[n])throw wp(n);return{appName:t.name,projectId:t.options.projectId,apiKey:t.options.apiKey,appId:t.options.appId}}function wp(t){return Is.create("missing-app-config-values",{valueName:t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rP="installations",Z3="installations-internal",e6=t=>{const e=t.getProvider("app").getImmediate(),n=J3(e),r=Fi(e,"heartbeat");return{app:e,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},t6=t=>{const e=t.getProvider("app").getImmediate(),n=Fi(e,rP).getImmediate();return{getId:()=>Q3(n),getToken:i=>Y3(n,i)}};function n6(){zn(new Gt(rP,e6,"PUBLIC")),zn(new Gt(Z3,t6,"PRIVATE"))}n6();Ht(B1,jy);Ht(B1,jy,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yh="analytics",r6="firebase_id",i6="origin",s6=60*1e3,o6="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",qy="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qt=new ou("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const a6={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},tn=new As("analytics","Analytics",a6);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function l6(t){if(!t.startsWith(qy)){const e=tn.create("invalid-gtag-resource",{gtagURL:t});return qt.warn(e.message),""}return t}function iP(t){return Promise.all(t.map(e=>e.catch(n=>n)))}function u6(t,e){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(t,e)),n}function c6(t,e){const n=u6("firebase-js-sdk-policy",{createScriptURL:l6}),r=document.createElement("script"),i=`${qy}?l=${t}&id=${e}`;r.src=n?n==null?void 0:n.createScriptURL(i):i,r.async=!0,document.head.appendChild(r)}function h6(t){let e=[];return Array.isArray(window[t])?e=window[t]:window[t]=e,e}async function d6(t,e,n,r,i,s){const o=r[i];try{if(o)await e[o];else{const u=(await iP(n)).find(c=>c.measurementId===i);u&&await e[u.appId]}}catch(a){qt.error(a)}t("config",i,s)}async function f6(t,e,n,r,i){try{let s=[];if(i&&i.send_to){let o=i.send_to;Array.isArray(o)||(o=[o]);const a=await iP(n);for(const u of o){const c=a.find(f=>f.measurementId===u),d=c&&e[c.appId];if(d)s.push(d);else{s=[];break}}}s.length===0&&(s=Object.values(e)),await Promise.all(s),t("event",r,i||{})}catch(s){qt.error(s)}}function p6(t,e,n,r){async function i(s,...o){try{if(s==="event"){const[a,u]=o;await f6(t,e,n,a,u)}else if(s==="config"){const[a,u]=o;await d6(t,e,n,r,a,u)}else if(s==="consent"){const[a,u]=o;t("consent",a,u)}else if(s==="get"){const[a,u,c]=o;t("get",a,u,c)}else if(s==="set"){const[a]=o;t("set",a)}else t(s,...o)}catch(a){qt.error(a)}}return i}function m6(t,e,n,r,i){let s=function(...o){window[r].push(arguments)};return window[i]&&typeof window[i]=="function"&&(s=window[i]),window[i]=p6(s,t,e,n),{gtagCore:s,wrappedGtag:window[i]}}function g6(t){const e=window.document.getElementsByTagName("script");for(const n of Object.values(e))if(n.src&&n.src.includes(qy)&&n.src.includes(t))return n;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _6=30,y6=1e3;class v6{constructor(e={},n=y6){this.throttleMetadata=e,this.intervalMillis=n}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,n){this.throttleMetadata[e]=n}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const sP=new v6;function E6(t){return new Headers({Accept:"application/json","x-goog-api-key":t})}async function w6(t){var o;const{appId:e,apiKey:n}=t,r={method:"GET",headers:E6(n)},i=o6.replace("{app-id}",e),s=await fetch(i,r);if(s.status!==200&&s.status!==304){let a="";try{const u=await s.json();(o=u.error)!=null&&o.message&&(a=u.error.message)}catch{}throw tn.create("config-fetch-failed",{httpStatus:s.status,responseMessage:a})}return s.json()}async function I6(t,e=sP,n){const{appId:r,apiKey:i,measurementId:s}=t.options;if(!r)throw tn.create("no-app-id");if(!i){if(s)return{measurementId:s,appId:r};throw tn.create("no-api-key")}const o=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},a=new C6;return setTimeout(async()=>{a.abort()},n!==void 0?n:s6),oP({appId:r,apiKey:i,measurementId:s},o,a,e)}async function oP(t,{throttleEndTimeMillis:e,backoffCount:n},r,i=sP){var a;const{appId:s,measurementId:o}=t;try{await T6(r,e)}catch(u){if(o)return qt.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${u==null?void 0:u.message}]`),{appId:s,measurementId:o};throw u}try{const u=await w6(t);return i.deleteThrottleMetadata(s),u}catch(u){const c=u;if(!S6(c)){if(i.deleteThrottleMetadata(s),o)return qt.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${c==null?void 0:c.message}]`),{appId:s,measurementId:o};throw u}const d=Number((a=c==null?void 0:c.customData)==null?void 0:a.httpStatus)===503?JE(n,i.intervalMillis,_6):JE(n,i.intervalMillis),f={throttleEndTimeMillis:Date.now()+d,backoffCount:n+1};return i.setThrottleMetadata(s,f),qt.debug(`Calling attemptFetch again in ${d} millis`),oP(t,f,r,i)}}function T6(t,e){return new Promise((n,r)=>{const i=Math.max(e-Date.now(),0),s=setTimeout(n,i);t.addEventListener(()=>{clearTimeout(s),r(tn.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function S6(t){if(!(t instanceof jn)||!t.customData)return!1;const e=Number(t.customData.httpStatus);return e===429||e===500||e===503||e===504}class C6{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function A6(t,e,n,r,i){if(i&&i.global){t("event",n,r);return}else{const s=await e,o={...r,send_to:s};t("event",n,o)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function R6(){if(s_())try{await o_()}catch(t){return qt.warn(tn.create("indexeddb-unavailable",{errorInfo:t==null?void 0:t.toString()}).message),!1}else return qt.warn(tn.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function P6(t,e,n,r,i,s,o){const a=I6(t);a.then(m=>{n[m.measurementId]=m.appId,t.options.measurementId&&m.measurementId!==t.options.measurementId&&qt.warn(`The measurement ID in the local Firebase config (${t.options.measurementId}) does not match the measurement ID fetched from the server (${m.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(m=>qt.error(m)),e.push(a);const u=R6().then(m=>{if(m)return r.getId()}),[c,d]=await Promise.all([a,u]);g6(s)||c6(s,c.measurementId),i("js",new Date);const f=(o==null?void 0:o.config)??{};return f[i6]="firebase",f.update=!0,d!=null&&(f[r6]=d),i("config",c.measurementId,f),c.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k6{constructor(e){this.app=e}_delete(){return delete ml[this.app.options.appId],Promise.resolve()}}let ml={},lT=[];const uT={};let Ip="dataLayer",N6="gtag",cT,aP,hT=!1;function D6(){const t=[];if(i_()&&t.push("This is a browser extension environment."),FS()||t.push("Cookies are not available."),t.length>0){const e=t.map((r,i)=>`(${i+1}) ${r}`).join(" "),n=tn.create("invalid-analytics-context",{errorInfo:e});qt.warn(n.message)}}function O6(t,e,n){D6();const r=t.options.appId;if(!r)throw tn.create("no-app-id");if(!t.options.apiKey)if(t.options.measurementId)qt.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${t.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw tn.create("no-api-key");if(ml[r]!=null)throw tn.create("already-exists",{id:r});if(!hT){h6(Ip);const{wrappedGtag:s,gtagCore:o}=m6(ml,lT,uT,Ip,N6);aP=s,cT=o,hT=!0}return ml[r]=P6(t,lT,uT,e,cT,Ip,n),new k6(t)}function b6(t=au()){t=q(t);const e=Fi(t,Yh);return e.isInitialized()?e.getImmediate():x6(t)}function x6(t,e={}){const n=Fi(t,Yh);if(n.isInitialized()){const i=n.getImmediate();if(kr(e,n.getOptions()))return i;throw tn.create("already-initialized")}return n.initialize({options:e})}async function L6(){if(i_()||!FS()||!s_())return!1;try{return await o_()}catch{return!1}}function M6(t,e,n,r){t=q(t),A6(aP,ml[t.app.options.appId],e,n,r).catch(i=>qt.error(i))}const dT="@firebase/analytics",fT="0.10.18";function V6(){zn(new Gt(Yh,(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("installations-internal").getImmediate();return O6(r,i,n)},"PUBLIC")),zn(new Gt("analytics-internal",t,"PRIVATE")),Ht(dT,fT),Ht(dT,fT,"esm2020");function t(e){try{const n=e.getProvider(Yh).getImmediate();return{logEvent:(r,i,s)=>M6(n,r,i,s)}}catch(n){throw tn.create("interop-component-reg-failed",{reason:n})}}}V6();const lP={apiKey:"AIzaSyAdJ3lRxhgZWhnqH8SNQsT1bTFB8E0-cDg",authDomain:"quitarena-a97de.firebaseapp.com",databaseURL:"https://quitarena-a97de-default-rtdb.europe-west1.firebasedatabase.app",projectId:"quitarena-a97de",storageBucket:"quitarena-a97de.firebasestorage.app",messagingSenderId:"693525963288",appId:"1:693525963288:web:a175e9a8bd56fffb35596d",measurementId:"G-H2CCRXYY74"},rf=xO().length?au():$S(lP),Xi=oM(rf,lP.databaseURL),Js=lF(rf),Gy=g3(rf);console.log("✅ Firebase services initialized:",{db:!!Xi,firestore:!!Js,auth:!!Gy});$4(Gy,A1).then(()=>{console.log("Firebase Auth persistence configured for 30 days")}).catch(t=>{console.error("Error setting auth persistence:",t)});let F6=null;(async()=>{try{await L6()&&(F6=b6(rf))}catch(t){console.debug("Analytics not initialized:",t==null?void 0:t.message)}})();class Ao{constructor(e){if(!e)throw new Error("Firestore instance is required for FirestoreBuddyService");this.firestore=e,this.matchingPoolCollection=dp(e,"matchingPool"),this.buddyPairsCollection=dp(e,"buddyPairs"),console.log("🚀 FirestoreBuddyService initialized with Firestore instance:",!!e),console.log("📁 Collections configured:",{matchingPool:this.matchingPoolCollection.path,buddyPairs:this.buddyPairsCollection.path})}async addToMatchingPool(e,n){try{console.log("🔄 Firestore: Adding user to matching pool:",e);const r={userId:e,...n,createdAt:vc(),lastActive:vc(),status:"waiting"};return await MI(Ha(this.matchingPoolCollection,e),r),console.log("✅ Firestore: User successfully added to matching pool:",e),!0}catch(r){return console.error("❌ Firestore: Failed to add user to matching pool:",r),console.error("❌ Error details:",{code:r.code,message:r.message,userId:e,userData:Object.keys(n||{})}),!1}}async removeFromMatchingPool(e){try{return console.log("🔄 Firestore: Removing user from matching pool:",e),await VI(Ha(this.matchingPoolCollection,e)),console.log("✅ Firestore: User successfully removed from matching pool:",e),!0}catch(n){return console.error("❌ Firestore: Failed to remove user from matching pool:",n),console.error("❌ Error details:",{code:n.code,message:n.message,userId:e}),!1}}async createBuddyPair(e,n,r={}){try{console.log("🔄 Firestore: Creating buddy pair:",{user1Id:e,user2Id:n});const i={user1Id:e,user2Id:n,createdAt:vc(),status:"active",...r},s=await IF(this.buddyPairsCollection,i);return console.log("✅ Firestore: Buddy pair created successfully:",s.id),s.id}catch(i){return console.error("❌ Firestore: Failed to create buddy pair:",i),console.error("❌ Error details:",{code:i.code,message:i.message,user1Id:e,user2Id:n}),null}}async getAllMatchingPoolUsers(){try{console.log("🔄 Firestore: Fetching all matching pool users");const e=await wF(this.matchingPoolCollection),n=[];return e.forEach(r=>{n.push({id:r.id,...r.data()})}),console.log("✅ Firestore: Retrieved",n.length,"users from matching pool"),n}catch(e){return console.error("❌ Firestore: Failed to fetch matching pool users:",e),console.error("❌ Error details:",{code:e.code,message:e.message}),[]}}async getMatchingPoolUser(e){try{console.log("🔄 Firestore: Fetching user from matching pool:",e);const n=Ha(this.matchingPoolCollection,e),r=await EF(n);if(r.exists()){const i={id:r.id,...r.data()};return console.log("✅ Firestore: User found in matching pool:",e),i}else return console.log("ℹ️ Firestore: User not found in matching pool:",e),null}catch(n){return console.error("❌ Firestore: Failed to fetch user from matching pool:",n),console.error("❌ Error details:",{code:n.code,message:n.message,userId:e}),null}}async testConnectivity(){try{console.log("🧪 Firestore: Testing connectivity...");const e=dp(this.firestore,"connectionTest"),n=Ha(e,"test-"+Date.now()),r={test:!0,timestamp:vc(),message:"Firestore connectivity test",service:"FirestoreBuddyService"};return await MI(n,r),console.log("✅ Firestore: Connectivity test successful"),await VI(n),console.log("🧹 Firestore: Test document cleaned up"),!0}catch(e){return console.error("❌ Firestore: Connectivity test failed:",e),console.error("❌ Error details:",{code:e.code,message:e.message}),!1}}getServiceStatus(){var e,n;return{firestore:!!this.firestore,matchingPoolCollection:((e=this.matchingPoolCollection)==null?void 0:e.path)||"not configured",buddyPairsCollection:((n=this.buddyPairsCollection)==null?void 0:n.path)||"not configured",timestamp:new Date().toISOString()}}}console.log("🧪 FirestoreBuddyService import check:",!!Ao);console.log("🧪 FirestoreBuddyService type:",typeof Ao);console.log("🧪 FirestoreBuddyService constructor:",Ao==null?void 0:Ao.name);const pT=(t,e="adventurer")=>{const n="https://api.dicebear.com/7.x",r={seed:t||Math.random().toString(36).substring(7),backgroundColor:["b6e3f4","c0aede","ffdfbf","ffd5dc"],radius:50,size:200},i=new URLSearchParams(r).toString();return`${n}/${e}/svg?${i}`},U6=()=>{console.log("🚀 APP COMPONENT MOUNTING - Component function called"),console.log("🚀 STEP 1: About to declare state variables");const[t,e]=he.useState("arena"),[n,r]=he.useState("auth");he.useState(null);const[i,s]=he.useState(null),[o,a]=he.useState(!1),[u,c]=he.useState(null),[d,f]=he.useState(!0);console.log("🚀 STEP 2: State variables declared successfully"),console.log("🚀 STEP 3: About to declare data loading system state");const[m,y]=he.useState({isLoading:!1,progress:0,currentStep:"",error:null,isComplete:!1});console.log("🚀 STEP 4: Data loading state declared");const[C,N]=he.useState([]);console.log("🚀 STEP 5: Unsubscribe functions state declared"),he.useState(null),console.log("🚀 STEP 6: Buddy matching service state declared");const[b,S]=he.useState(null),v=he.useRef(null);console.log("🚀 STEP 7: Firestore buddy service state declared");const A=async()=>{console.log("🚀 ENTERING initializeFirestoreBuddyService function"),console.log("🚀 Function scope check - firestore:",!!Js),console.log("🚀 Function scope check - setFirestoreBuddyService:",!!S),console.log("🚀 Function scope check - firestoreBuddyServiceRef:",!!v);try{if(console.log("🔄 Initializing FirestoreBuddyService..."),console.log("🔄 Firestore instance check:",!!Js),console.log("🔄 Firestore type:",typeof Js),!Js){console.error("❌ Firestore instance is not available");return}console.log("🔄 Creating FirestoreBuddyService instance...");const U=new Ao(Js);console.log("🔄 FirestoreBuddyService instance created:",!!U),console.log("🔄 Testing Firestore connectivity...");const X=await U.testConnectivity();console.log("🔄 Connectivity test result:",X),X?(console.log("✅ Firestore connectivity test passed"),console.log("🔄 Setting FirestoreBuddyService state..."),S(U),console.log("🔄 Setting FirestoreBuddyService ref..."),v.current=U,console.log("✅ FirestoreBuddyService initialized successfully")):console.warn("⚠️ Firestore connectivity test failed - service not initialized")}catch(U){console.error("❌ Error initializing FirestoreBuddyService:",U),console.error("❌ Error details:",U.message),console.error("❌ Error stack:",U.stack)}};he.useEffect(()=>{console.log("🚀 FIRESTORE INITIALIZATION useEffect TRIGGERED"),console.log("🚀 Component mounted, initializing Firestore service..."),(async()=>{console.log("🔄 About to call initializeFirestoreBuddyService...");try{await A(),console.log("✅ initializeFirestoreBuddyService completed successfully")}catch(X){console.error("❌ Error calling initializeFirestoreBuddyService:",X),console.error("❌ Error details:",X.message),console.error("❌ Error stack:",X.stack)}})()},[]);const O=()=>({mentalStrength:50,motivation:50,triggerDefense:30,addictionLevel:50,moneySaved:0}),j=()=>({dailyWater:0,dailyMood:null,dailyBreathing:!1,scheduledTriggers:[],relapseDate:null,cravingsResisted:0}),z=U=>{U.relapseDate&&Z(new Date(U.relapseDate)),U.dailyWater!==void 0&&Ce(U.dailyWater),U.dailyMood!==void 0&&Me(U.dailyMood),U.dailyBreathing!==void 0&&Sn(U.dailyBreathing),U.scheduledTriggers&&ln(U.scheduledTriggers)},w=(U,X)=>{const K=document.createElement("div");K.className="fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg bg-red-500 text-white max-w-sm",K.innerHTML=`
      <div class="font-bold">${U}</div>
      <div class="text-sm opacity-90">${X}</div>
      <button class="mt-2 text-sm underline" onclick="this.parentElement.remove()">Dismiss</button>
    `,document.body.appendChild(K),setTimeout(()=>{K.parentNode&&K.parentNode.removeChild(K)},1e4)},_=async U=>{if(!U)return!1;y({isLoading:!0,progress:0,currentStep:"Initializing...",error:null,isComplete:!1});try{const{ref:X,get:K,onValue:vt}=await ka(()=>import("./index.esm-2f91dc11.js"),[]);y(ve=>({...ve,currentStep:"Loading profile data...",progress:20}));const un=X(Xi,`users/${U}`),qn=await K(un);if(!qn.exists())throw new Error("User profile not found");const zr=qn.val(),An=E(zr);y(ve=>({...ve,currentStep:"Loading battle stats...",progress:40}));const Rn=X(Xi,`users/${U}/stats`),zi=await K(Rn),Nu=zi.exists()?T(zi.val()):O();y(ve=>({...ve,currentStep:"Loading habits and progress...",progress:60}));const Us=X(Xi,`users/${U}/profile`),Bs=await K(Us),zs=Bs.exists()?R(Bs.val()):j();y(ve=>({...ve,currentStep:"Loading achievements...",progress:80}));const Xe=X(Xi,`users/${U}/profile/cravingsResisted`),it=await K(Xe),ji=it.exists()?Math.max(0,parseInt(it.val())||0):0;y(ve=>({...ve,currentStep:"Setting up live sync...",progress:90}));const Du=vt(Rn,ve=>{if(ve.exists()){const dr=T(ve.val());if(Fs(dr),n==="arena"&&i){const bu={...i,stats:dr};calculateRealTimeStats(bu).then(setRealTimeUserStats)}}}),Ou=vt(Us,ve=>{if(ve.exists()){const dr=R(ve.val());n==="profile"&&z(dr)}}),of=vt(Xe,ve=>{if(ve.exists()){const dr=Math.max(0,parseInt(ve.val())||0);n==="craving-support"&&ku(dr)}});return N([Du,Ou,of]),y(ve=>({...ve,currentStep:"Finalizing...",progress:100})),s(ve=>({...ve,...An,stats:Nu})),z(zs),ku(ji),An.onboardingCompleted&&a(!0),y({isLoading:!1,progress:100,currentStep:"Data loaded successfully!",error:null,isComplete:!0}),console.log("✅ All user data loaded successfully:",{profile:An,stats:Nu,profileData:zs,cravingsResisted:ji}),!0}catch(X){return console.error("❌ Error loading user data:",X),y({isLoading:!1,progress:0,currentStep:"Failed to load data",error:X.message,isComplete:!1}),w("Failed to load user data",X.message),!1}},E=U=>U?{uid:U.uid||"",email:U.email||"",heroName:U.heroName||"Hero",archetype:U.archetype||"The Determined",avatar:U.avatar||pT("default"),quitDate:U.quitDate||new Date().toISOString(),onboardingCompleted:!!U.onboardingCompleted,updatedAt:U.updatedAt||Date.now(),...U}:k(),T=U=>U?{mentalStrength:Math.max(0,Math.min(100,parseInt(U.mentalStrength)||50)),motivation:Math.max(0,Math.min(100,parseInt(U.motivation)||50)),triggerDefense:Math.max(0,Math.min(100,parseInt(U.triggerDefense)||30)),addictionLevel:Math.max(0,Math.min(100,parseInt(U.addictionLevel)||50)),moneySaved:Math.max(0,parseInt(U.moneySaved)||0),...U}:O(),R=U=>U?{dailyWater:Math.max(0,parseInt(U.dailyWater)||0),dailyMood:U.dailyMood||null,dailyBreathing:!!U.dailyBreathing,scheduledTriggers:Array.isArray(U.scheduledTriggers)?U.scheduledTriggers:[],relapseDate:U.relapseDate?new Date(U.relapseDate).toISOString():null,cravingsResisted:Math.max(0,parseInt(U.cravingsResisted)||0),...U}:j(),k=()=>({uid:"",email:"",heroName:"Hero",archetype:"The Determined",avatar:pT("default"),quitDate:new Date().toISOString(),onboardingCompleted:!1,updatedAt:Date.now()});he.useEffect(()=>()=>{C.forEach(U=>{typeof U=="function"&&U()})},[C]);const[I,Ft]=he.useState(null);he.useEffect(()=>{(async()=>{try{const X=(await ka(()=>import("./offlineManager-7cd472e8.js"),[])).default,K=new X;Ft(K),window.refreshUserData=In,console.log("✅ Offline manager initialized")}catch(X){console.error("Error initializing offline manager:",X)}})()},[]);const hr=async U=>{if(!U)return!1;const X=await _(U);if(X&&I&&(await I.cacheUserData(i),await I.cacheProfileData({dailyWater:ne,dailyMood:_e,dailyBreathing:Tn,scheduledTriggers:Cn,relapseDate:W,cravingsResisted:sf})),!X&&I){console.log("📱 Loading offline data...");const K=await I.getCachedUserData(),vt=await I.getCachedProfileData();if(K)return console.log("📱 Using offline user data"),s(K),a(K.onboardingCompleted),vt&&z(vt),!0}return X},Bi=async()=>u!=null&&u.uid?(console.log("🔄 Refreshing user data with offline support..."),await hr(u.uid)):!1,In=async()=>{if(!(u!=null&&u.uid)){w("Cannot Refresh","No authenticated user found");return}if(console.log("🔄 Manually refreshing user data..."),await Bi()){const X=document.createElement("div");X.className="fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg bg-green-500 text-white max-w-sm",X.innerHTML=`
        <div class="font-bold">✅ Data Refreshed!</div>
        <div class="text-sm opacity-90">Your data has been synced across all devices</div>
        <button class="mt-2 text-sm underline" onclick="this.parentElement.remove()">Dismiss</button>
      `,document.body.appendChild(X),setTimeout(()=>{X.parentNode&&X.parentNode.removeChild(X)},5e3)}else w("Refresh Failed","Could not refresh data. Please try again.")},[W,Z]=he.useState(null),[ne,Ce]=he.useState(0),[_e,Me]=he.useState(null),[Tn,Sn]=he.useState(!1),[Cn,ln]=he.useState([]),[sf,ku]=he.useState(0),[aa,Fs]=he.useState(O());he.useEffect(()=>{const U=K=>{if(K.message&&K.message.includes("content_script")){console.warn("Browser extension error (ignored):",K.message);return}if(K.message&&(K.message.includes("FrameDoesNotExistError")||K.message.includes("background.js"))){console.warn("Background frame error (ignored):",K.message);return}console.error("Global error caught:",K)},X=K=>{if(K.reason&&K.reason.message&&K.reason.message.includes("content_script")){console.warn("Browser extension promise rejection (ignored):",K.reason.message);return}if(K.reason&&K.reason.message&&(K.reason.message.includes("FrameDoesNotExistError")||K.reason.message.includes("background.js"))){console.warn("Background frame promise rejection (ignored):",K.reason.message);return}console.error("Unhandled promise rejection:",K.reason)};return window.addEventListener("error",U),window.addEventListener("unhandledrejection",X),()=>{window.removeEventListener("error",U),window.removeEventListener("unhandledrejection",X)}},[]),he.useEffect(()=>{const U=async(X=0)=>{try{const{ref:K,set:vt,get:un,child:qn}=await ka(()=>import("./index.esm-2f91dc11.js"),[]),zr=K(Xi),An=qn(zr,"healthchecks/vite_dev");await vt(An,{lastRun:Date.now()});const Rn=await un(An);console.log("🔥 Firebase RTDB connected. Healthcheck exists:",Rn.exists())}catch(K){if(console.error("Firebase connectivity test failed:",(K==null?void 0:K.message)||K),X<3){const vt=Math.pow(2,X)*1e3;console.log(`Retrying Firebase connection in ${vt}ms... (attempt ${X+1}/3)`),setTimeout(()=>U(X+1),vt)}else console.error("Firebase connection failed after 3 retries. Check your internet connection and Firebase configuration.")}};U()},[]);const la=async()=>{let U=!0,X=null;try{console.log("Initializing authentication state..."),f(!0);const{onAuthStateChanged:K}=await ka(()=>import("./index.esm-597d25f7.js"),[]);X=K(Gy,async un=>{if(console.log("Auth state changed:",un?`User: ${un.uid}`:"No user"),un){c(un),console.log("User authenticated, checking database for user data...");try{const{ref:qn,get:zr}=await ka(()=>import("./index.esm-2f91dc11.js"),[]),An=qn(Xi,`users/${un.uid}`),Rn=await zr(An);if(Rn.exists()){const zi=Rn.val();console.log("Existing user data found - auto-login successful"),s(zi),a(!0),r("arena"),console.log("User auto-logged in and redirected to Arena")}else console.log("No user data found - new user needs onboarding"),r("onboarding")}catch(qn){console.error("Error fetching user data during auto-login:",qn),r("onboarding")}}else console.log("No authenticated user - showing login screen"),c(null),s(null),a(!1),r("auth")});const vt=setTimeout(()=>{U&&(console.warn("Auth initialization timeout - forcing to auth screen"),f(!1),r("auth"))},1e4);X&&clearTimeout(vt)}catch(K){console.error("Error initializing authentication:",K),f(!1),r("auth")}finally{f(!1)}};he.useEffect(()=>(la(),()=>{}),[]),he.useState(null),he.useState(!1),he.useState(null),he.useEffect(()=>{const U=X=>{const K=X.detail;console.log("Navigating to tab:",K),K==="buddy-chat"&&(r("buddy-chat"),e("buddy-chat"))};return window.addEventListener("navigateToTab",U),()=>{window.removeEventListener("navigateToTab",U)}},[])};Tp.createRoot(document.getElementById("root")).render(jv.jsx(YP.StrictMode,{children:jv.jsx(U6,{})}));export{G6 as $,Y6 as A,X6 as B,J6 as C,vs as D,j6 as E,$L as F,o9 as G,a9 as H,l9 as I,u9 as J,W6 as K,h9 as L,WL as M,z6 as N,jL as O,$6 as P,Hn as Q,$n as R,v9 as S,cM as T,_9 as U,aA as V,H6 as W,q6 as X,r9 as Y,n9 as Z,I9 as _,sM as a,M9 as a$,P9 as a0,Au as a1,Cu as a2,N9 as a3,Jl as a4,Ms as a5,Xr as a6,S9 as a7,Zr as a8,Jr as a9,X9 as aA,g3 as aB,D9 as aC,VF as aD,oB as aE,EB as aF,WI as aG,hU as aH,u4 as aI,J9 as aJ,W9 as aK,b4 as aL,hB as aM,gB as aN,vB as aO,aB as aP,eB as aQ,H4 as aR,O9 as aS,CF as aT,x4 as aU,dB as aV,mB as aW,yB as aX,BF as aY,iB as aZ,q9 as a_,Vr as aa,Wc as ab,R9 as ac,us as ad,Co as ae,l3 as af,C9 as ag,uB as ah,rg as ai,A9 as aj,u3 as ak,zy as al,ei as am,F9 as an,q4 as ao,lB as ap,A1 as aq,a3 as ar,k1 as as,M4 as at,V9 as au,h4 as av,B9 as aw,k9 as ax,sB as ay,H9 as az,an as b,j9 as b0,$4 as b1,b9 as b2,Ny as b3,L9 as b4,z9 as b5,$9 as b6,cB as b7,pB as b8,_B as b9,rB as ba,x9 as bb,nB as bc,Q9 as bd,Y9 as be,fB as bf,K9 as bg,tB as bh,Z9 as bi,G9 as bj,U9 as bk,ka as bl,v_ as c,Jn as d,Uo as e,w9 as f,aM as g,E9 as h,g9 as i,e9 as j,t9 as k,c9 as l,f9 as m,d9 as n,K6 as o,oM as p,p9 as q,hA as r,KS as s,m9 as t,y9 as u,F_ as v,i9 as w,s9 as x,Z6 as y,Q6 as z};
