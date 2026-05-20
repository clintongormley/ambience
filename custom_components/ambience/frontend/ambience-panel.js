/* Ambience panel — bundled output. Do not edit by hand. */
var ct=Object.defineProperty;var ht=Object.getOwnPropertyDescriptor;var a=(s,r,e,t)=>{for(var i=t>1?void 0:t?ht(r,e):r,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(t?o(r,e,i):o(i))||i);return t&&i&&ct(r,e,i),i};var se=globalThis,ne=se.ShadowRoot&&(se.ShadyCSS===void 0||se.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ve=Symbol(),He=new WeakMap,J=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==ve)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(ne&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=He.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&He.set(e,r))}return r}toString(){return this.cssText}},Re=s=>new J(typeof s=="string"?s:s+"",void 0,ve),m=(s,...r)=>{let e=s.length===1?s[0]:r.reduce((t,i,n)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[n+1],s[0]);return new J(e,s,ve)},Ne=(s,r)=>{if(ne)s.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),i=se.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,s.appendChild(t)}},_e=ne?s=>s:s=>s instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return Re(e)})(s):s;var{is:pt,defineProperty:ut,getOwnPropertyDescriptor:mt,getOwnPropertyNames:ft,getOwnPropertySymbols:gt,getPrototypeOf:vt}=Object,oe=globalThis,Te=oe.trustedTypes,_t=Te?Te.emptyScript:"",yt=oe.reactiveElementPolyfillSupport,X=(s,r)=>s,G={toAttribute(s,r){switch(r){case Boolean:s=s?_t:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,r){let e=s;switch(r){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},ae=(s,r)=>!pt(s,r),Me={attribute:!0,type:String,converter:G,reflect:!1,useDefault:!1,hasChanged:ae};Symbol.metadata??=Symbol("metadata"),oe.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=Me){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(r,t,e);i!==void 0&&ut(this.prototype,r,i)}}static getPropertyDescriptor(r,e,t){let{get:i,set:n}=mt(this.prototype,r)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let d=i?.call(this);n?.call(this,o),this.requestUpdate(r,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??Me}static _$Ei(){if(this.hasOwnProperty(X("elementProperties")))return;let r=vt(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(X("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(X("properties"))){let e=this.properties,t=[...ft(e),...gt(e)];for(let i of t)this.createProperty(i,e[i])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let i of t)e.unshift(_e(i))}else r!==void 0&&e.push(_e(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ne(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),i=this.constructor._$Eu(r,t);if(i!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:G).toAttribute(e,t.type);this._$Em=r,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(r,e){let t=this.constructor,i=t._$Eh.get(r);if(i!==void 0&&this._$Em!==i){let n=t.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:G;this._$Em=i;let d=o.fromAttribute(e,n.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(r,e,t,i=!1,n){if(r!==void 0){let o=this.constructor;if(i===!1&&(n=this[r]),t??=o.getPropertyOptions(r),!((t.hasChanged??ae)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(r)&&!this.hasAttribute(o._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:i,wrapped:n},o){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,o??e??this[r]),n!==!0||o!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),i===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,n]of t){let{wrapped:o}=n,d=this[i];o!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,n,d)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[X("elementProperties")]=new Map,A[X("finalized")]=new Map,yt?.({ReactiveElement:A}),(oe.reactiveElementVersions??=[]).push("2.1.2");var Ee=globalThis,Ie=s=>s,le=Ee.trustedTypes,Oe=le?le.createPolicy("lit-html",{createHTML:s=>s}):void 0,Fe="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,We="?"+M,bt=`<${We}>`,U=document,Z=()=>U.createComment(""),Q=s=>s===null||typeof s!="object"&&typeof s!="function",Se=Array.isArray,$t=s=>Se(s)||typeof s?.[Symbol.iterator]=="function",ye=`[ 	
\f\r]`,Y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Le=/-->/g,De=/>/g,D=RegExp(`>|${ye}(?:([^\\s"'>=/]+)(${ye}*=${ye}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),je=/'/g,Ue=/"/g,qe=/^(?:script|style|textarea|title)$/i,Ce=s=>(r,...e)=>({_$litType$:s,strings:r,values:e}),l=Ce(1),Ut=Ce(2),zt=Ce(3),z=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),ze=new WeakMap,j=U.createTreeWalker(U,129);function Be(s,r){if(!Se(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Oe!==void 0?Oe.createHTML(r):r}var xt=(s,r)=>{let e=s.length-1,t=[],i,n=r===2?"<svg>":r===3?"<math>":"",o=Y;for(let d=0;d<e;d++){let h=s[d],g,_,v=-1,C=0;for(;C<h.length&&(o.lastIndex=C,_=o.exec(h),_!==null);)C=o.lastIndex,o===Y?_[1]==="!--"?o=Le:_[1]!==void 0?o=De:_[2]!==void 0?(qe.test(_[2])&&(i=RegExp("</"+_[2],"g")),o=D):_[3]!==void 0&&(o=D):o===D?_[0]===">"?(o=i??Y,v=-1):_[1]===void 0?v=-2:(v=o.lastIndex-_[2].length,g=_[1],o=_[3]===void 0?D:_[3]==='"'?Ue:je):o===Ue||o===je?o=D:o===Le||o===De?o=Y:(o=D,i=void 0);let T=o===D&&s[d+1].startsWith("/>")?" ":"";n+=o===Y?h+bt:v>=0?(t.push(g),h.slice(0,v)+Fe+h.slice(v)+M+T):h+M+(v===-2?d:T)}return[Be(s,n+(s[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},ee=class s{constructor({strings:r,_$litType$:e},t){let i;this.parts=[];let n=0,o=0,d=r.length-1,h=this.parts,[g,_]=xt(r,e);if(this.el=s.createElement(g,t),j.currentNode=this.el.content,e===2||e===3){let v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(i=j.nextNode())!==null&&h.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let v of i.getAttributeNames())if(v.endsWith(Fe)){let C=_[o++],T=i.getAttribute(v).split(M),ie=/([.?@])?(.*)/.exec(C);h.push({type:1,index:n,name:ie[2],strings:T,ctor:ie[1]==="."?$e:ie[1]==="?"?xe:ie[1]==="@"?we:V}),i.removeAttribute(v)}else v.startsWith(M)&&(h.push({type:6,index:n}),i.removeAttribute(v));if(qe.test(i.tagName)){let v=i.textContent.split(M),C=v.length-1;if(C>0){i.textContent=le?le.emptyScript:"";for(let T=0;T<C;T++)i.append(v[T],Z()),j.nextNode(),h.push({type:2,index:++n});i.append(v[C],Z())}}}else if(i.nodeType===8)if(i.data===We)h.push({type:2,index:n});else{let v=-1;for(;(v=i.data.indexOf(M,v+1))!==-1;)h.push({type:7,index:n}),v+=M.length-1}n++}}static createElement(r,e){let t=U.createElement("template");return t.innerHTML=r,t}};function B(s,r,e=s,t){if(r===z)return r;let i=t!==void 0?e._$Co?.[t]:e._$Cl,n=Q(r)?void 0:r._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(s),i._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(r=B(s,i._$AS(s,r.values),i,t)),r}var be=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,i=(r?.creationScope??U).importNode(e,!0);j.currentNode=i;let n=j.nextNode(),o=0,d=0,h=t[0];for(;h!==void 0;){if(o===h.index){let g;h.type===2?g=new te(n,n.nextSibling,this,r):h.type===1?g=new h.ctor(n,h.name,h.strings,this,r):h.type===6&&(g=new ke(n,this,r)),this._$AV.push(g),h=t[++d]}o!==h?.index&&(n=j.nextNode(),o++)}return j.currentNode=U,i}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},te=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,i){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=B(this,r,e),Q(r)?r===y||r==null||r===""?(this._$AH!==y&&this._$AR(),this._$AH=y):r!==this._$AH&&r!==z&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):$t(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==y&&Q(this._$AH)?this._$AA.nextSibling.data=r:this.T(U.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,i=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=ee.createElement(Be(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new be(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(r){let e=ze.get(r.strings);return e===void 0&&ze.set(r.strings,e=new ee(r)),e}k(r){Se(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let n of r)i===e.length?e.push(t=new s(this.O(Z()),this.O(Z()),this,this.options)):t=e[i],t._$AI(n),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=Ie(r).nextSibling;Ie(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},V=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,i,n){this.type=1,this._$AH=y,this._$AN=void 0,this.element=r,this.name=e,this._$AM=i,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=y}_$AI(r,e=this,t,i){let n=this.strings,o=!1;if(n===void 0)r=B(this,r,e,0),o=!Q(r)||r!==this._$AH&&r!==z,o&&(this._$AH=r);else{let d=r,h,g;for(r=n[0],h=0;h<n.length-1;h++)g=B(this,d[t+h],e,h),g===z&&(g=this._$AH[h]),o||=!Q(g)||g!==this._$AH[h],g===y?r=y:r!==y&&(r+=(g??"")+n[h+1]),this._$AH[h]=g}o&&!i&&this.j(r)}j(r){r===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},$e=class extends V{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===y?void 0:r}},xe=class extends V{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==y)}},we=class extends V{constructor(r,e,t,i,n){super(r,e,t,i,n),this.type=5}_$AI(r,e=this){if((r=B(this,r,e,0)??y)===z)return;let t=this._$AH,i=r===y&&t!==y||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,n=r!==y&&(t===y||i);i&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},ke=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){B(this,r)}};var wt=Ee.litHtmlPolyfillSupport;wt?.(ee,te),(Ee.litHtmlVersions??=[]).push("3.3.2");var Ve=(s,r,e)=>{let t=e?.renderBefore??r,i=t._$litPart$;if(i===void 0){let n=e?.renderBefore??null;t._$litPart$=i=new te(r.insertBefore(Z(),n),n,void 0,e??{})}return i._$AI(s),i};var Ae=globalThis,u=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=Ve(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}};u._$litElement$=!0,u.finalized=!0,Ae.litElementHydrateSupport?.({LitElement:u});var kt=Ae.litElementPolyfillSupport;kt?.({LitElement:u});(Ae.litElementVersions??=[]).push("4.2.2");var f=s=>(r,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(s,r)}):customElements.define(s,r)};var Et={attribute:!0,type:String,converter:G,reflect:!1,hasChanged:ae},St=(s=Et,r,e)=>{let{kind:t,metadata:i}=e,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),t==="setter"&&((s=Object.create(s)).wrapped=!0),n.set(e.name,s),t==="accessor"){let{name:o}=e;return{set(d){let h=r.get.call(this);r.set.call(this,d),this.requestUpdate(o,h,s,!0,d)},init(d){return d!==void 0&&this.C(o,void 0,s,d),d}}}if(t==="setter"){let{name:o}=e;return function(d){let h=this[o];r.call(this,d),this.requestUpdate(o,h,s,!0,d)}}throw Error("Unsupported decorator location: "+t)};function c(s){return(r,e)=>typeof e=="object"?St(s,r,e):((t,i,n)=>{let o=i.hasOwnProperty(n);return i.constructor.createProperty(n,t),o?Object.getOwnPropertyDescriptor(i,n):void 0})(s,r,e)}function p(s){return c({...s,state:!0,attribute:!1})}var Ct=["ha-input","ha-textfield","ha-form"],At=["ha-input","ha-textfield"];function Ke(){for(let s of At)if(customElements.get(s))return s;return null}function I(s,r){for(let e of Ct)customElements.get(e)||customElements.whenDefined(e).then(()=>s.requestUpdate())}async function Je(s){return s.callWS({type:"ambience/areas/list"})}async function Xe(s,r){return s.callWS({type:"ambience/area/get",area_id:r})}async function Ge(s,r,e){return s.callWS({type:"ambience/area/save",area_id:r,config:e})}async function ce(s){return s.callWS({type:"ambience/matchers/list"})}async function Ye(s){return s.callWS({type:"ambience/actions/list"})}async function he(s){return s.callWS({type:"ambience/time_of_day_periods/list"})}async function Ze(s,r,e){return s.callWS({type:"ambience/time_of_day_periods/save",custom:r,hidden:e})}async function Qe(s){return s.callWS({type:"ambience/time_of_day_periods/reset"})}async function et(s){return s.callWS({type:"ambience/matchers/enabled/list"})}async function tt(s,r){return s.callWS({type:"ambience/matchers/enabled/save",enabled:r})}async function rt(s){return s.callWS({type:"ambience/matchers/day/config/list"})}async function it(s,r,e){return s.callWS({type:"ambience/matchers/day/config/save",workday_sensor:r,workday_calendar:e})}function pe(s,r,e){let t=s?.localize?.(r);return t&&t!==r?t:e}function Pe(s){let r=s.replaceAll("_"," ").toLowerCase();return r.charAt(0).toUpperCase()+r.slice(1)}function K(s,r){return pe(s,`component.ambience.matcher.${r}`,Pe(r))}function st(s,r){return pe(s,`component.ambience.action.${r}`,Pe(r))}function ue(s,r){return pe(s,`component.ambience.anchor.${r}`,Pe(r))}function F(s,r,e){let t=e[r]?.label;if(t)return t;let i=r.charAt(0).toUpperCase()+r.slice(1);return pe(s,`component.ambience.time_of_day_period.${r}`,i)}function me(s,r="New rule"){if(s.name&&s.name.trim())return s.name;let e=s.when?.scene;return typeof e=="string"&&e.trim()?e:r}function fe(s,r,e){return r==null?"(any)":s==="time_of_day"?ge(r,e):String(r)}function ge(s,r){if(s===null)return"any";let e=Array.isArray(s)?s:[s],t=r.periods?.custom??{};return e.map(i=>"period"in i?F(r.hass,i.period,t):`${nt(i.from,r)} \u2192 ${nt(i.to,r)}`).join(", ")}function nt(s,r){if(s.kind==="time")return`${String(s.hh).padStart(2,"0")}:${String(s.mm).padStart(2,"0")}`;let e=ue(r.hass,s.anchor);if(s.offset_min===0)return e;let t=Math.abs(s.offset_min),i=t%60===0?`${t/60}h`:`${t}m`;return`${e}${s.offset_min<0?"-":"+"}${i}`}function ot(s,r,e){let t=st(e.hass,s.action),i=r?.domains?.[0]??"target",n=s.entity_ids.length,o;n===0?o="(no targets)":n===1?o=`1 ${i}`:o=`${n} ${i}s`;let d={};for(let g of r?.target_params??[])g.unit&&(d[g.name]=g.unit);let h=Object.entries(s.params).filter(([,g])=>g!=null&&g!=="").map(([g,_])=>`${g} ${_}${d[g]??""}`).join(", ");return h?`${t}: ${o}, ${h}`:`${t}: ${o}`}var w=class extends u{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_summary(e){let t=Object.keys(e.when).filter(o=>e.when[o]!=null),i=t.length===0?"any":t.map(o=>`${K(this.hass,o)}: ${fe(o,e.when[o],{hass:this.hass,periods:this.periods})}`).join(", "),n=e.actions.length;return`${i} \xB7 ${n} action${n===1?"":"s"}`}_onDragStart(e){this._dragFrom=e}_onDragOver(e,t){this._dragFrom===null||t===this._dragFrom||(e.preventDefault(),this._dragOver=t)}_onDrop(e){let t=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(t===null||t===e)&&this._emit("reorder-rules",{from:t,to:e})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(e,t){let i=t.name||`Rule ${e+1}`;window.confirm(`Delete "${i}"?`)&&this._emit("delete-rule",{index:e})}render(){return this.rules.length===0?l`
        <p class="empty">No rules yet.</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          + Add rule
        </button>
      `:l`
      <ul>
        ${this.rules.map((e,t)=>l`
            <li
              class=${this._dragOver===t?"drag-over":""}
              draggable=${!this.autoSort}
              @dragstart=${()=>this._onDragStart(t)}
              @dragover=${i=>this._onDragOver(i,t)}
              @drop=${()=>this._onDrop(t)}
              @dragend=${this._onDragEnd}
            >
              ${this.autoSort?"":l`<span class="handle" title="Drag to reorder">⠿</span>`}
              <span class="idx">${t+1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${()=>this._emit("edit-rule",{index:t})}
                >
                  ${me(e,`Rule ${t+1}`)}
                </div>
                <div class="summary">${this._summary(e)}</div>
              </div>
              <button
                @click=${()=>this._emit("duplicate-rule",{index:t})}
                title="Duplicate"
              >
                ⧉
              </button>
              <button
                @click=${()=>this._confirmDelete(t,e)}
                title="Delete"
              >
                🗑
              </button>
            </li>
          `)}
      </ul>
      <button class="add" @click=${()=>this._emit("add-rule",{})}>
        + Add rule
      </button>
    `}};w.styles=m`
    :host {
      display: block;
    }
    .empty {
      color: var(--secondary-text-color, #888);
      padding: 1rem;
      text-align: center;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.75rem 1rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
    }
    li.drag-over {
      border-color: var(--primary-color, #03a9f4);
    }
    .handle {
      cursor: grab;
      color: var(--secondary-text-color, #888);
      padding: 0 0.25rem;
      user-select: none;
    }
    .idx {
      font-family: monospace;
      color: var(--secondary-text-color, #888);
      margin-right: 0.5rem;
      min-width: 2em;
    }
    .body {
      flex: 1;
    }
    .name {
      cursor: pointer;
    }
    .name:hover {
      text-decoration: underline;
    }
    .summary {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    button {
      background: transparent;
      border: 0;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      font-size: 1rem;
    }
    .add {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      margin-top: 0.5rem;
    }
  `,a([c({attribute:!1})],w.prototype,"rules",2),a([c({type:Boolean})],w.prototype,"autoSort",2),a([c({attribute:!1})],w.prototype,"periods",2),a([c({attribute:!1})],w.prototype,"hass",2),a([p()],w.prototype,"_dragFrom",2),a([p()],w.prototype,"_dragOver",2),w=a([f("ambience-rules-list")],w);function at(s,r,e){if(!s||!s.entities||!r)return[];let t=s.entities,i=s.devices??{};return Object.values(t).filter(n=>!!(n.area_id===r||n.device_id&&i[n.device_id]?.area_id===r)).filter(n=>e.includes(n.entity_id.split(".")[0])).map(n=>n.entity_id).sort()}var k=class extends u{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=e=>{this._open&&(e.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=e=>{e.stopPropagation();let t=e.detail.value?.scene??"";this._emit(t.trim()===""?null:t)}}connectedCallback(){super.connectedCallback(),I(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(e){e.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(t=>({value:t,label:t})),custom_value:!0,mode:"dropdown"}}}])}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target.value;this._emit(t.trim()===""?null:t),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(e){e.key==="Escape"&&this._open&&(this._open=!1,e.stopPropagation())}_toggle(e){e.preventDefault(),this._open=!this._open}_select(e,t){t.preventDefault(),this._emit(e),this._open=!1}render(){if(customElements.get("ha-form")){let e={scene:this.value??""};return l`
        <ha-form
          .hass=${this.hass}
          .schema=${this._schema}
          .data=${e}
          .computeLabel=${Pt}
          @value-changed=${this._onHaFormValueChanged}
        ></ha-form>
      `}return l`
      <div class="control">
        <input
          type="text"
          placeholder="Scene name"
          .value=${this.value??""}
          @input=${this._onInput}
          @focus=${this._onFocus}
          @keydown=${this._onKeyDown}
        />
        <button
          class="toggle"
          type="button"
          tabindex="-1"
          aria-label="Show scene suggestions"
          @mousedown=${this._toggle}
        >
          ▼
        </button>
      </div>
      ${this._open?l`
            <div class="menu" role="listbox">
              ${this.suggestions.length===0?l`<div class="empty">
                    No scenes yet — type to create one
                  </div>`:this.suggestions.map(e=>l`
                      <div
                        class="item ${e===this.value?"selected":""}"
                        role="option"
                        @mousedown=${t=>this._select(e,t)}
                      >
                        ${e}
                      </div>
                    `)}
            </div>
          `:""}
    `}};k.styles=m`
    :host {
      display: block;
      position: relative;
    }
    /* Fallback dropdown */
    .control {
      display: flex;
      align-items: stretch;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
    }
    .control:focus-within {
      border-color: var(--primary-color, #03a9f4);
    }
    input {
      flex: 1;
      min-width: 0;
      padding: 0.5rem;
      border: 0;
      background: transparent;
      color: inherit;
      outline: none;
      font: inherit;
    }
    .toggle {
      background: transparent;
      border: 0;
      padding: 0 0.6rem;
      cursor: pointer;
      color: var(--secondary-text-color, #888);
      font-size: 0.7em;
      line-height: 1;
    }
    .menu {
      position: absolute;
      top: calc(100% + 2px);
      left: 0;
      right: 0;
      max-height: 14rem;
      overflow-y: auto;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 10;
    }
    .item {
      padding: 0.5rem;
      cursor: pointer;
    }
    .item:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .item.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .empty {
      padding: 0.5rem;
      color: var(--secondary-text-color, #888);
      font-style: italic;
    }
  `,a([c({attribute:!1})],k.prototype,"hass",2),a([c()],k.prototype,"value",2),a([c({attribute:!1})],k.prototype,"suggestions",2),a([p()],k.prototype,"_schema",2),a([p()],k.prototype,"_open",2),k=a([f("ambience-scene-combobox")],k);function Pt(s){return s.name==="scene"?"Scene name":s.name}var Ht=["dawn","sunrise","noon","sunset","dusk","midnight"],W=class extends u{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onKindChange(e){let t=e.target.value;t!==this.value.kind&&(t==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let t=e.target.value,[i,n]=t.split(":").map(o=>parseInt(o,10));Number.isNaN(i)||Number.isNaN(n)||this._emit({kind:"time",hh:i,mm:n})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let t=e.target.value;this._emit({kind:"sun",anchor:t,offset_min:this.value.offset_min})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let t=parseInt(e.target.value,10);Number.isNaN(t)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:t})}_renderTime(e){let t=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return l`<input type="time" .value=${t} @input=${this._onTimeChange} />`}_renderSun(e){let t=Rt(e.offset_min);return l`
      <select @change=${this._onAnchorChange}>
        ${Ht.map(i=>l`<option value=${i} ?selected=${i===e.anchor}>${ue(this.hass,i)}</option>`)}
      </select>
      <input
        type="number"
        step="1"
        placeholder="±min, e.g. -30"
        .value=${String(e.offset_min)}
        @input=${this._onOffsetChange}
      />
      <span class="offset-hint">${t}</span>
    `}render(){return l`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>Time</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>Sun</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};W.styles=m`
    :host {
      display: inline-flex;
      gap: 0.5rem;
      align-items: center;
    }
    select, input {
      padding: 0.4rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
      font: inherit;
    }
    .offset-hint {
      color: var(--secondary-text-color, #888);
      font-size: 0.85em;
      min-width: 3em;
    }
  `,a([c({attribute:!1})],W.prototype,"hass",2),a([c({attribute:!1})],W.prototype,"value",2),W=a([f("ambience-time-endpoint")],W);function Rt(s){if(s===0)return"";let r=Math.abs(s),e=s<0?"\u2212":"+";if(r%60===0){let t=r/60;return`${e}${t} ${t===1?"hour":"hours"}`}return`${e}${r} min`}var re={kind:"any"},lt={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},E=class extends u{constructor(){super(...arguments);this.value=null;this._entries=[re];this._openIdx=0}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[re]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(t=>{let i=this._entries[this._openIdx];if(!i)return;let n=i.kind==="any"?"__any__":i.kind==="range"?"__custom__":i.period;t.value!==n&&(t.value=n)})}_predicateToEntries(e){return e===null?[re]:(Array.isArray(e)?e:[e]).map(i=>"period"in i?{kind:"period",period:i.period}:{kind:"range",from:i.from,to:i.to})}_emit(e){let t=e.filter(n=>n.kind!=="any").map(n=>n.kind==="period"?{period:n.period}:{from:n.from,to:n.to}),i=t.length===0?null:t.length===1?t[0]:t;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:i},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let e=Object.keys(this.periods.builtins),t=Object.keys(this.periods.custom).filter(n=>!(n in this.periods.builtins)),i=new Set(this.periods.hidden);return[...e.filter(n=>!i.has(n)),...t]}_onSelectChange(e,t){let i=t.target.value,n=[...this._entries];i==="__any__"?n[e]=re:i==="__custom__"?n[e]={kind:"range",...lt}:n[e]={kind:"period",period:i},this._entries=n,this._emit(n)}_onRangeChange(e,t,i){i.stopPropagation();let n=this._entries[e];if(!n||n.kind!=="range")return;let o=[...this._entries];o[e]={...n,[t]:i.detail.value},this._entries=o,this._emit(o)}_onRemove(e){let t=this._entries.filter((i,n)=>n!==e);this._entries=t.length===0?[re]:t,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...lt}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,t){let i;return e.kind==="any"?i="(any)":e.kind==="period"?i=ge({period:e.period},{hass:this.hass,periods:this.periods}):i=ge({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),l`
      <div class="summary-chip" @click=${()=>this._onChipClick(t)}>
        <span class="chip-label">${i}</span>
        ${this._entries.length>1?l`<button class="remove" @click=${n=>{n.stopPropagation(),this._onRemove(t)}} title="Remove">✕</button>`:""}
      </div>
    `}_renderEntry(e,t,i){let n=this._effectiveIds(),o=this.periods?.custom??{};return l`
      <div class="entry">
        <div class="entry-header">
          <select @change=${d=>this._onSelectChange(t,d)}>
            ${i?l`<option value="__any__">Any time</option>`:""}
            <option value="__custom__">Custom range</option>
            <option disabled>──────</option>
            ${n.map(d=>l`<option value=${d}>
                ${F(this.hass,d,o)}${o[d]&&!this.periods?.builtins[d]?" (custom)":""}
              </option>`)}
          </select>
          ${this._entries.length>1?l`<button class="remove" @click=${()=>this._onRemove(t)} title="Remove">✕</button>`:""}
        </div>
        ${e.kind==="range"?l`
              <div class="range-row">
                <label>From</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.from}
                  @value-changed=${d=>this._onRangeChange(t,"from",d)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>To</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${d=>this._onRangeChange(t,"to",d)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(i=>i.kind!=="any"),t=this._entries.length>1;return l`
      ${this._entries.map((i,n)=>t&&n!==this._openIdx?this._renderChip(i,n):this._renderEntry(i,n,n===0))}
      ${e?l`<button class="add-btn" @click=${this._onAdd}>+ add another time range</button>`:""}
    `}};E.styles=m`
    :host { display: block; }
    .entry {
      display: flex; flex-direction: column; gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .entry-header { display: flex; align-items: center; gap: 0.5rem; }
    select { padding: 0.4rem; flex: 1; }
    .remove {
      background: none; border: none; color: var(--secondary-text-color, #888);
      cursor: pointer; font-size: 1.1em;
    }
    .range-row { display: flex; align-items: center; gap: 0.5rem; }
    .range-row label { min-width: 3em; font-size: 0.9em; color: var(--secondary-text-color); }
    .add-btn {
      background: none; border: 1px dashed var(--divider-color, #ccc);
      padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; color: inherit;
    }
    .summary-chip {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
      cursor: pointer;
    }
    .summary-chip:hover { border-color: var(--primary-color, #03a9f4); }
    .chip-label { flex: 1; }
  `,a([c({attribute:!1})],E.prototype,"value",2),a([c({attribute:!1})],E.prototype,"periods",2),a([c({attribute:!1})],E.prototype,"hass",2),a([p()],E.prototype,"_entries",2),a([p()],E.prototype,"_openIdx",2),E=a([f("ambience-time-of-day-input")],E);var S=class extends u{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onText(e){let t=e.target.value;this._emit(t.trim()===""?null:t)}render(){return this.matcher.input==="time_of_day"?l`
        <ambience-time-of-day-input
          .value=${this.value}
          .periods=${this.periods}
          .hass=${this.hass}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-time-of-day-input>
      `:this.matcher.input==="scene_combobox"?l`
        <ambience-scene-combobox
          .hass=${this.hass}
          .value=${this.value??null}
          .suggestions=${this.sceneSuggestions}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-scene-combobox>
      `:l`
      <input
        type="text"
        placeholder="(any)"
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};S.styles=m`
    :host {
      display: block;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
    }
    .help {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
      white-space: pre-wrap;
      margin-top: 0.25rem;
    }
  `,a([c({attribute:!1})],S.prototype,"matcher",2),a([c({attribute:!1})],S.prototype,"value",2),a([c({attribute:!1})],S.prototype,"sceneSuggestions",2),a([c({attribute:!1})],S.prototype,"periods",2),a([c({attribute:!1})],S.prototype,"hass",2),S=a([f("ambience-matcher-input")],S);var O=class extends u{constructor(){super(...arguments);this.entities=[];this.value=[]}connectedCallback(){super.connectedCallback(),I(this,this.hass)}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let e=[{name:"entity_ids",label:"",selector:{entity:{multiple:!0,include_entities:this.entities}}}];return l`
      <ha-form
        .hass=${this.hass}
        .schema=${e}
        .data=${{entity_ids:this.value}}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,t){let i=new Set(this.value);t?i.add(e):i.delete(e),this._emit(this.entities.filter(n=>i.has(n)))}_renderFallback(){return this.entities.length===0?l`<p class="empty">No matching entities in this area.</p>`:l`
      <div class="checkboxes">
        ${this.entities.map(e=>l`
            <label>
              <input
                type="checkbox"
                .checked=${this.value.includes(e)}
                @change=${t=>this._toggle(e,t.target.checked)}
              />
              ${e}
            </label>
          `)}
      </div>
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};O.styles=m`
    :host { display: block; }
    .empty {
      color: var(--secondary-text-color, #888);
      font-style: italic;
      padding: 0.5rem 0;
    }
    .checkboxes {
      display: flex; flex-direction: column; gap: 0.25rem;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
    }
    label {
      display: flex; align-items: center; gap: 0.5rem;
      cursor: pointer;
      padding: 0.25rem;
    }
    label:hover { background: var(--secondary-background-color, #f5f5f5); }
  `,a([c({attribute:!1})],O.prototype,"hass",2),a([c({attribute:!1})],O.prototype,"entities",2),a([c({attribute:!1})],O.prototype,"value",2),O=a([f("ambience-target-picker")],O);var b=class extends u{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._open=null;this._showError=!1;this._onNameInput=e=>{this._setName(e.target.value)}}connectedCallback(){super.connectedCallback(),I(this,this.hass)}willUpdate(e){e.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null,this._open=null,this._showError=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"}))return l`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
        </div>
      `;let i=me(this._draft,"New rule");return l`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${i}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let t=Ke();return t==="ha-input"?l`<ha-input label="Name (optional)" .value=${e} @input=${this._onNameInput}></ha-input>`:t==="ha-textfield"?l`<ha-textfield label="Name (optional)" .value=${e} @input=${this._onNameInput}></ha-textfield>`:l`<input type="text" .value=${e} @input=${this._onNameInput} />`}_isOpen(e){return this._open===null?!1:e.kind==="name"&&this._open.kind==="name"?!0:e.kind==="matcher"&&this._open.kind==="matcher"?e.id===this._open.id:e.kind==="action"&&this._open.kind==="action"?e.idx===this._open.idx:!1}_validationError(e){if(e===null||e.kind==="name"||e.kind==="matcher")return null;let t=this._draft?.actions[e.idx];if(!t)return null;if(t.entity_ids.length===0)return"At least one target is required.";let i=this.availableActions.find(n=>n.name===t.action);if(!i)return null;for(let n of i.target_params){if(!n.required)continue;let o=t.params[n.name];if(o==null||o==="")return`${this._paramLabel(n.name)} is required.`}return null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){this._tryCloseCurrent();return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let t of e.composedPath())if(t instanceof Element&&(t.classList.contains("slot")||t.classList.contains("actions-bar")))return;this._tryCloseCurrent()}_setPredicate(e,t){if(!this._draft)return;let i={...this._draft.when};t==null?delete i[e]:i[e]=t,this._draft={...this._draft,when:i}}_renderMatcherRow(e){let t=this._draft.when[e.name]??null,i=this._isOpen({kind:"matcher",id:e.name}),n=e.input==="scene_combobox";if(i&&n)return l`
        <div class="slot combobox-slot expanded" data-slot-id=${e.name}>
          <ambience-matcher-input
            .hass=${this.hass}
            .matcher=${e}
            .value=${t}
            .sceneSuggestions=${this.sceneSuggestions}
            .periods=${this.periods}
            @value-changed=${d=>this._setPredicate(e.name,d.detail.value)}
          ></ambience-matcher-input>
        </div>
      `;let o=fe(e.name,t,{hass:this.hass,periods:this.periods});return l`
      <div class="slot ${i?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"matcher",id:e.name})}>
          <span class="summary-label"><strong>${K(this.hass,e.name)}:</strong> ${o}</span>
        </div>
        ${i?l`
          <div class="body">
            <ambience-matcher-input
              .hass=${this.hass}
              .matcher=${e}
              .value=${t}
              .sceneSuggestions=${this.sceneSuggestions}
              .periods=${this.periods}
              @value-changed=${d=>this._setPredicate(e.name,d.detail.value)}
            ></ambience-matcher-input>
          </div>
        `:""}
      </div>
    `}_addActionSlot(){if(!this._draft)return;let e={action:"set_light",entity_ids:[],params:{}},t=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,e]},this._open={kind:"action",idx:t}}_updateActionAt(e,t){if(!this._draft)return;let i=this._draft.actions.map((n,o)=>o===e?t(n):n);this._draft={...this._draft,actions:i}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((t,i)=>i!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,t){this._updateActionAt(e,i=>({...i,entity_ids:t}))}_paramLabel(e){let t=e.replaceAll("_"," ").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}_updateActionParam(e,t,i){this._updateActionAt(e,n=>{let o={...n.params},d=i;if(t.type==="int"?d=i===""?void 0:parseInt(i,10):t.type==="number"?d=i===""?void 0:parseFloat(i):t.type==="boolean"&&(d=i==="true"),typeof d=="number"&&Number.isFinite(d)){let h=d;typeof t.min=="number"&&h<t.min&&(h=t.min),typeof t.max=="number"&&h>t.max&&(h=t.max),d=h}return d===void 0?delete o[t.name]:o[t.name]=d,{...n,params:o}})}_renderActionParams(e,t,i){let n=i?.target_params??[];return l`
      ${n.map(o=>l`
        <div class="param-row">
          <label>${this._paramLabel(o.name)}${o.required?" *":""}</label>
          <div class="param-input">
            <input
              type=${o.type==="int"||o.type==="number"?"number":"text"}
              placeholder=${o.description??""}
              .value=${String(t.params[o.name]??"")}
              min=${o.min??""}
              max=${o.max??""}
              @input=${d=>this._updateActionParam(e,o,d.target.value)}
            />
            ${o.unit?l`<span class="param-unit">${o.unit}</span>`:""}
          </div>
        </div>
      `)}
    `}_renderActionRow(e,t){let i=this.availableActions.find(h=>h.name===e.action),n=this._isOpen({kind:"action",idx:t}),o=ot(e,i,{hass:this.hass}),d=at(this.hass,this.areaId,i?.domains??[]);return l`
      <div class="slot ${n?"expanded":"collapsed"}" data-slot-id="action-${t}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:t})}>
          <span class="summary-label">${o}</span>
          <button class="remove" @click=${h=>{h.stopPropagation(),this._deleteAction(t)}} title="Remove action">✕</button>
        </div>
        ${n?l`
          <div class="body">
            <label>Target</label>
            <ambience-target-picker
              .hass=${this.hass}
              .entities=${d}
              .value=${e.entity_ids}
              @value-changed=${h=>{h.stopPropagation(),this._setActionTargets(t,h.detail.value)}}
            ></ambience-target-picker>

            ${this._renderActionParams(t,e,i)}

            ${this._showError&&this._validationError({kind:"action",idx:t})?l`
              <div class="error">${this._validationError({kind:"action",idx:t})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_save(){this._draft&&this.dispatchEvent(new CustomEvent("save-rule",{detail:this._draft,bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){return this._draft?l`
      <div class="modal" @click=${this._onModalClick}>
        ${this._renderNameSlot()}

        <h3>When</h3>
        ${this.matchers.map(e=>this._renderMatcherRow(e))}

        <h3>Actions</h3>
        ${this._draft.actions.map((e,t)=>this._renderActionRow(e,t))}
        <button class="secondary add-action" @click=${this._addActionSlot}>+ Add action</button>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._save}>Save rule</button>
        </div>
      </div>
    `:l``}};b.styles=m`
    :host {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 100;
      align-items: center; justify-content: center;
    }
    :host([open]) { display: flex; }
    .modal {
      background: var(--card-background-color, #fff); color: inherit;
      border-radius: 8px; padding: 1.5rem;
      width: 90%; max-width: 40rem; max-height: 90vh; overflow-y: auto;
    }
    h3 {
      margin: 1.5rem 0 0.5rem 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      padding-bottom: 0.25rem;
    }
    label {
      display: block; font-weight: 600; margin: 0.5rem 0 0.25rem 0;
    }
    input, select {
      width: 100%; box-sizing: border-box; padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
    }
    .slot {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    .summary {
      padding: 0.6rem 0.75rem;
      cursor: pointer;
      display: flex; align-items: center;
      gap: 0.5rem;
    }
    .summary:hover { background: var(--secondary-background-color, #f5f5f5); }
    .summary-label { flex: 1; }
    .slot.expanded .summary {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .slot.combobox-slot.expanded,
    .slot.name-slot.expanded {
      border: none;
      padding: 0;
      margin-bottom: 0.5rem;
    }
    .body {
      padding: 0.75rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .actions-bar {
      display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;
    }
    button {
      padding: 0.5rem 1rem; border: 0; border-radius: 4px; cursor: pointer;
    }
    .primary { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); }
    .secondary {
      background: transparent; color: var(--primary-text-color, inherit);
      border: 1px solid var(--divider-color, #ccc);
    }
    .remove {
      background: none; border: none; color: var(--secondary-text-color, #888);
      cursor: pointer; font-size: 1.1em;
      padding: 0; width: auto;
    }
    .param-input {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .param-input input {
      flex: 1;
    }
    .param-unit {
      color: var(--secondary-text-color, #888);
      font-size: 0.9em;
      min-width: 1.5em;
    }
    .error {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      margin-top: 0.5rem;
      padding: 0.3rem 0;
    }
  `,a([c({type:Boolean,reflect:!0})],b.prototype,"open",2),a([c({attribute:!1})],b.prototype,"rule",2),a([c({attribute:!1})],b.prototype,"matchers",2),a([c({attribute:!1})],b.prototype,"sceneSuggestions",2),a([c({attribute:!1})],b.prototype,"periods",2),a([c({attribute:!1})],b.prototype,"availableActions",2),a([c({attribute:!1})],b.prototype,"hass",2),a([c({attribute:!1})],b.prototype,"areaId",2),a([p()],b.prototype,"_draft",2),a([p()],b.prototype,"_open",2),a([p()],b.prototype,"_showError",2),b=a([f("ambience-rule-editor")],b);var P=class extends u{constructor(){super(...arguments);this.open=!1;this.matchers=[];this.selected=[];this._draft=new Set}willUpdate(e){(e.has("selected")||e.has("open"))&&this.open&&(this._draft=new Set(this.selected))}_toggle(e,t){let i=new Set(this._draft);t?i.add(e):i.delete(e),this._draft=i}_apply(){this.dispatchEvent(new CustomEvent("apply-matchers",{detail:{matchers:[...this._draft]},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-matchers",{bubbles:!0,composed:!0}))}render(){let e=this.matchers.filter(t=>t.toggleable);return l`
      <div class="modal">
        <h2>Matchers</h2>
        <p class="intro">
          Select which matchers can be used in this area's rule predicates.
        </p>
        ${e.map(t=>l`
            <label class="matcher-row">
              <input
                type="checkbox"
                .checked=${this._draft.has(t.name)}
                @change=${i=>this._toggle(t.name,i.target.checked)}
              />
              <div class="matcher-meta">
                <div class="matcher-name">${t.name}</div>
                <div>${t.description}</div>
                <div class="matcher-help">${t.predicate_help}</div>
              </div>
            </label>
          `)}
        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._apply}>Apply</button>
        </div>
      </div>
    `}};P.styles=m`
    :host {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 100;
      align-items: center;
      justify-content: center;
    }
    :host([open]) {
      display: flex;
    }
    .modal {
      background: var(--card-background-color, #fff);
      color: inherit;
      border-radius: 8px;
      padding: 1.5rem;
      width: 90%;
      max-width: 36rem;
      max-height: 90vh;
      overflow-y: auto;
    }
    h2 {
      margin: 0 0 0.5rem 0;
    }
    p.intro {
      color: var(--secondary-text-color, #888);
      margin-top: 0;
    }
    .matcher-row {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      cursor: pointer;
    }
    .matcher-row input[type="checkbox"] {
      width: auto;
      margin-top: 0.25rem;
    }
    .matcher-meta {
      flex: 1;
    }
    .matcher-name {
      font-weight: 600;
    }
    .matcher-help {
      white-space: pre-wrap;
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .actions-bar {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    button {
      padding: 0.5rem 1rem;
      border: 0;
      border-radius: 4px;
      cursor: pointer;
    }
    .primary {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .secondary {
      background: transparent;
      color: var(--primary-text-color, inherit);
      border: 1px solid var(--divider-color, #ccc);
    }
  `,a([c({type:Boolean,reflect:!0})],P.prototype,"open",2),a([c({attribute:!1})],P.prototype,"matchers",2),a([c({attribute:!1})],P.prototype,"selected",2),a([p()],P.prototype,"_draft",2),P=a([f("ambience-matchers-modal")],P);var $=class extends u{constructor(){super(...arguments);this._areas=[];this._matchers=[];this._actions=[];this._configs=new Map;this._expanded=new Set;this._error="";this._editing=null;this._matchersModalArea=null}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await this._refreshAreas(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _loadStatic(){try{let[e,t,i]=await Promise.all([ce(this.hass),Ye(this.hass),he(this.hass)]);if(!this.isConnected)return;this._matchers=e,this._actions=t,this._periods=i}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await Je(this.hass),t=new Map;if(await Promise.all(e.map(async i=>{t.set(i.area_id,this._normalize(await Xe(this.hass,i.area_id)))})),!this.isConnected)return;this._areas=e,this._configs=t}catch(e){this._error=e.message||String(e)}}_normalize(e){return{matchers:e.matchers??[],rules:e.rules??[],auto_sort:e.auto_sort??!0}}async _subscribe(){let e=await this.hass.connection.subscribeEvents(t=>{if(t.data.action==="remove"){let i=t.data.area_id,n=new Set(this._expanded);n.delete(i),this._expanded=n,this._editing?.areaId===i&&(this._editing=null),this._matchersModalArea===i&&(this._matchersModalArea=null)}this._refreshAreas()},"area_registry_updated");this.isConnected?this._unsub=e:e()}_setConfig(e,t){let i=new Map(this._configs);i.set(e,t),this._configs=i}async _mutate(e,t){let i=this._configs.get(e);this._setConfig(e,t),this._error="";try{let{config:n}=await Ge(this.hass,e,t);this._setConfig(e,this._normalize(n))}catch(n){i&&this._setConfig(e,i),this._error=n.message||String(n)}}_toggleExpand(e){let t=new Set(this._expanded);t.has(e)?t.delete(e):t.add(e),this._expanded=t}_openMatchersModal(e){this._matchersModalArea=e}_applyMatchers(e){let t=this._matchersModalArea;if(this._matchersModalArea=null,!t)return;let i=this._configs.get(t);i&&this._mutate(t,{...i,matchers:e.detail.matchers})}_toggleAutoSort(e,t){let i=this._configs.get(e);i&&this._mutate(e,{...i,auto_sort:t})}_addRule(e){let t=this._configs.get(e);t&&(this._editing={areaId:e,index:t.rules.length,isNew:!0})}_editRule(e,t){this._editing={areaId:e,index:t.detail.index,isNew:!1}}_duplicateRule(e,t){let i=this._configs.get(e);if(!i)return;let n=i.rules[t.detail.index];if(!n)return;let o=JSON.parse(JSON.stringify(n)),d=[...i.rules];d.splice(t.detail.index+1,0,o),this._mutate(e,{...i,rules:d})}_deleteRule(e,t){let i=this._configs.get(e);if(!i)return;let n=i.rules.filter((o,d)=>d!==t.detail.index);this._mutate(e,{...i,rules:n})}_reorderRules(e,t){let i=this._configs.get(e);if(!i)return;let{from:n,to:o}=t.detail,d=[...i.rules],[h]=d.splice(n,1);d.splice(o,0,h),this._mutate(e,{...i,rules:d})}_saveRule(e){let t=this._editing;if(this._editing=null,!t)return;let i=this._configs.get(t.areaId);if(!i)return;let n=[...i.rules];t.isNew?n.push(e.detail):n[t.index]=e.detail,this._mutate(t.areaId,{...i,rules:n})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._configs.get(this._editing.areaId)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let e=this._configs.get(this._editing.areaId);if(!e)return[];let t=new Set;for(let i of e.rules){let n=i.when.scene;typeof n=="string"&&n&&t.add(n)}return[...t].sort((i,n)=>i.toLowerCase().localeCompare(n.toLowerCase()))}get _editorMatchers(){if(!this._editing)return[];let e=this._configs.get(this._editing.areaId);if(!e)return[];let t=this._matchers.find(n=>n.name==="scene"),i=this._matchers.filter(n=>e.matchers.includes(n.name));return t?[t,...i]:i}_summary(e){if(e.rules.length===0&&e.matchers.length===0)return"not configured";let t=e.rules.length,i=e.matchers.length;return`${t} rule${t===1?"":"s"} \xB7 ${i} matcher${i===1?"":"s"}`}render(){return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?l`<p class="empty">No areas found in Home Assistant.</p>`:l`<ul>
            ${this._areas.map(e=>this._renderArea(e))}
          </ul>`}

      <ambience-rule-editor
        ?open=${this._editing!==null}
        .hass=${this.hass}
        .areaId=${this._editing?.areaId}
        .rule=${this._editingRule}
        .matchers=${this._editorMatchers}
        .sceneSuggestions=${this._sceneSuggestions}
        .periods=${this._periods}
        .availableActions=${this._actions}
        @save-rule=${this._saveRule}
        @cancel-rule=${this._cancelRule}
      ></ambience-rule-editor>

      <ambience-matchers-modal
        ?open=${this._matchersModalArea!==null}
        .matchers=${this._matchers}
        .selected=${this._matchersModalArea?this._configs.get(this._matchersModalArea)?.matchers??[]:[]}
        @apply-matchers=${this._applyMatchers}
        @cancel-matchers=${()=>this._matchersModalArea=null}
      ></ambience-matchers-modal>
    `}_renderArea(e){let t=this._configs.get(e.area_id);if(!t)return l``;let i=this._expanded.has(e.area_id);return l`
      <li>
        <div
          class="area-header"
          @click=${()=>this._toggleExpand(e.area_id)}
        >
          <span class="chevron ${i?"open":""}">▶</span>
          <span class="area-name">${e.name}</span>
          <span class="area-summary">${this._summary(t)}</span>
          <button
            class="cog"
            title="Matchers"
            @click=${n=>{n.stopPropagation(),this._openMatchersModal(e.area_id)}}
          >
            ⚙
          </button>
        </div>
        ${i?l`
              <div class="area-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!t.auto_sort}
                    @change=${n=>this._toggleAutoSort(e.area_id,!n.target.checked)}
                  />
                  Order rules manually
                </label>
                <ambience-rules-list
                  .rules=${t.rules}
                  .autoSort=${t.auto_sort}
                  .periods=${this._periods}
                  .hass=${this.hass}
                  @add-rule=${()=>this._addRule(e.area_id)}
                  @edit-rule=${n=>this._editRule(e.area_id,n)}
                  @duplicate-rule=${n=>this._duplicateRule(e.area_id,n)}
                  @delete-rule=${n=>this._deleteRule(e.area_id,n)}
                  @reorder-rules=${n=>this._reorderRules(e.area_id,n)}
                ></ambience-rules-list>
              </div>
            `:""}
      </li>
    `}};$.styles=m`
    :host {
      display: block;
      padding: 1rem;
      max-width: 60rem;
      margin: 0 auto;
    }
    .empty {
      color: var(--secondary-text-color, #888);
      text-align: center;
      padding: 2rem;
    }
    .error {
      color: var(--error-color, #d32f2f);
      margin: 0.5rem 0;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
    }
    .area-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      cursor: pointer;
    }
    .chevron {
      width: 1em;
      color: var(--secondary-text-color, #888);
      transition: transform 0.1s;
    }
    .chevron.open {
      transform: rotate(90deg);
    }
    .area-name {
      flex: 1;
      font-weight: 600;
    }
    .area-summary {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .cog {
      background: transparent;
      border: 0;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0.25rem 0.5rem;
    }
    .area-body {
      padding: 0.5rem 1rem 1rem 1rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .autosort {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0 1rem 0;
      font-size: 0.9em;
    }
  `,a([c({attribute:!1})],$.prototype,"hass",2),a([p()],$.prototype,"_areas",2),a([p()],$.prototype,"_matchers",2),a([p()],$.prototype,"_actions",2),a([p()],$.prototype,"_periods",2),a([p()],$.prototype,"_configs",2),a([p()],$.prototype,"_expanded",2),a([p()],$.prototype,"_error",2),a([p()],$.prototype,"_editing",2),a([p()],$.prototype,"_matchersModalArea",2),$=a([f("ambience-areas-list")],$);var H=class extends u{constructor(){super(...arguments);this.matcherName="";this.matcherDescription="";this.enabled=!1}_onToggle(e){let t=e.target.checked;this.dispatchEvent(new CustomEvent("enable-changed",{detail:{enabled:t},bubbles:!0,composed:!0}))}render(){let e=K(this.hass,this.matcherName);return l`
      <div class="card">
        <header>
          <input type="checkbox" .checked=${this.enabled} @change=${this._onToggle} />
          <label>
            <div class="name">${e}</div>
            <div class="description">${this.matcherDescription}</div>
          </label>
        </header>
        <div class="body ${this.enabled?"":"disabled"}">
          <slot></slot>
        </div>
      </div>
    `}};H.styles=m`
    :host {
      display: block;
    }
    .card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      margin-bottom: 1rem;
    }
    header {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    header label {
      flex: 1;
      cursor: pointer;
    }
    .name {
      font-weight: 600;
    }
    .description {
      color: var(--secondary-text-color, #888);
      font-size: 0.9em;
    }
    .body {
      padding: 1rem;
    }
    .body.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  `,a([c({attribute:!1})],H.prototype,"hass",2),a([c()],H.prototype,"matcherName",2),a([c()],H.prototype,"matcherDescription",2),a([c({type:Boolean})],H.prototype,"enabled",2),H=a([f("ambience-matcher-card")],H);var Nt=/^[a-z][a-z0-9_]*$/;function Tt(s){return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var x=class extends u{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._label=this.initial.label??"",this._def=this.initial}_onLabelInput(e){this._label=e.target.value}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_validate(e){if(!this.existingId){if(!this._label.trim())return"Please enter a name.";if(!e||!Nt.test(e))return"Name must start with a letter.";if(this.takenIds.has(e))return"A period with this name already exists. Choose a different name."}return""}_onSave(){let e=this.existingId??Tt(this._label),t=this._validate(e);if(t){this._error=t,this.performUpdate();return}let i={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:e,definition:i},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){let e=this.existingId?`Edit "${this.initial?.label??this.existingId}"`:"Add custom period";return l`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <div class="field">
          <label for="label">Name</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput} placeholder="e.g. Wind down" />
        </div>
        <div class="row">
          <label style="min-width: 3em;">From</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
        </div>
        <div class="row">
          <label style="min-width: 3em;">To</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
        </div>
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>Cancel</button>
          <button @click=${this._onSave}>Save</button>
        </div>
      </div>
    `}};x.styles=m`
    :host {
      position: fixed; inset: 0;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.45); z-index: 1000;
    }
    .modal {
      background: var(--card-background-color, #fff);
      border-radius: 8px; padding: 1.5rem;
      max-width: 500px; width: 90%;
      display: flex; flex-direction: column; gap: 1rem;
    }
    h3 { margin: 0; }
    .field { display: flex; flex-direction: column; gap: 0.3rem; }
    label { font-size: 0.85em; color: var(--secondary-text-color); }
    input[type="text"] {
      padding: 0.5rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff); color: inherit;
    }
    .row { display: flex; align-items: center; gap: 0.5rem; }
    .error { color: var(--error-color, #c00); font-size: 0.85em; min-height: 1em; }
    .actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem; }
    button { padding: 0.5rem 1rem; cursor: pointer; }
  `,a([c({attribute:!1})],x.prototype,"hass",2),a([c({attribute:!1})],x.prototype,"existingId",2),a([c({attribute:!1})],x.prototype,"initial",2),a([c({attribute:!1})],x.prototype,"takenIds",2),a([p()],x.prototype,"_label",2),a([p()],x.prototype,"_def",2),a([p()],x.prototype,"_error",2),x=a([f("ambience-period-edit-modal")],x);function dt(s){if(s.kind==="time")return`${String(s.hh).padStart(2,"0")}:${String(s.mm).padStart(2,"0")}`;if(s.offset_min===0)return s.anchor;let r=Math.abs(s.offset_min),e=r%60===0?`${r/60}h`:`${r}m`;return`${s.anchor}${s.offset_min<0?"-":"+"}${e}`}function Mt(s){return`${dt(s.from)} \u2192 ${dt(s.to)}`}var R=class extends u{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await he(this.hass)}_effective(){let e=new Set(this._view.hidden),t=[];for(let[i,n]of Object.entries(this._view.builtins)){if(e.has(i))continue;let o=this._view.custom[i];o?t.push({id:i,defn:o,provenance:"builtin-edited"}):t.push({id:i,defn:n,provenance:"builtin"})}for(let[i,n]of Object.entries(this._view.custom))i in this._view.builtins||t.push({id:i,defn:n,provenance:"custom"});return t}async _saveState(e,t){let i=await Ze(this.hass,e,t);this._warnings=i.warnings,await this._reload()}_onEdit(e,t){this._modal={mode:"edit",id:e,initial:t}}async _onDelete(e){if(e in this._view.builtins){let i={...this._view.custom};delete i[e],await this._saveState(i,[...this._view.hidden,e])}else{let i={...this._view.custom};delete i[e],await this._saveState(i,this._view.hidden)}}async _onRevertEdited(e){let t={...this._view.custom};delete t[e],await this._saveState(t,this._view.hidden)}async _onRevertHidden(e){await this._saveState(this._view.custom,this._view.hidden.filter(t=>t!==e))}async _onResetAll(){let e=Object.keys(this._view.custom).length,t=this._view.hidden.length,i=`This will clear ${e} custom period(s) and restore ${t} hidden built-in(s). Continue?`;confirm(i)&&(await Qe(this.hass),this._warnings=[],await this._reload())}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:t,definition:i}=e.detail,n={...this._view.custom,[t]:i},o=this._view.hidden.filter(d=>d!==t);this._modal={mode:"closed"},await this._saveState(n,o)}_onModalCancel(){this._modal={mode:"closed"}}_renderRow(e){let t=this._view.custom,i=e.provenance==="builtin-edited",n=e.provenance==="custom";return l`
      <div class="row">
        <span class="name">${F(this.hass,e.id,t)}</span>
        <span class="def">${Mt(e.defn)}</span>
        <span class="badge">${e.provenance==="builtin"?"builtin":e.provenance==="builtin-edited"?"builtin, edited":"custom"}</span>
        <span class="actions">
          <button class="icon" title="Edit" @click=${()=>this._onEdit(e.id,e.defn)}>✎</button>
          ${i?l`<button class="icon" title="Revert to default" @click=${()=>this._onRevertEdited(e.id)}>↺</button>`:""}
          ${n||e.provenance==="builtin"||i?l`<button class="icon" title="Delete" @click=${()=>this._onDelete(e.id)}>✕</button>`:""}
        </span>
      </div>
    `}_renderHiddenRow(e){return l`
      <div class="row">
        <span class="name">${F(this.hass,e,{})}</span>
        <span class="def">(hidden)</span>
        <span class="badge">hidden</span>
        <span class="actions">
          <button class="icon" title="Restore" @click=${()=>this._onRevertHidden(e)}>↺</button>
        </span>
      </div>
    `}render(){let e=this._effective();return l`
      <header>
        <h2>Periods</h2>
        <button @click=${this._onResetAll}>Reset all to defaults</button>
      </header>
      ${this._warnings.length?l`<div class="warnings">
            <strong>Warning:</strong> some rules now reference missing periods:
            <ul>
              ${this._warnings.map(t=>l`<li>${t.area_id} / "${t.rule_name}" → ${t.missing_period}</li>`)}
            </ul>
          </div>`:""}
      ${e.map(t=>this._renderRow(t))}
      ${this._view.hidden.map(t=>this._renderHiddenRow(t))}
      <button class="add" @click=${this._onAdd}>+ Add custom period</button>
      ${this._modal.mode==="edit"?l`<ambience-period-edit-modal
            .existingId=${this._modal.id}
            .initial=${this._modal.initial}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:this._modal.mode==="add"?l`<ambience-period-edit-modal
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:""}
    `}};R.styles=m`
    :host { display: block; padding: 1rem; }
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    h2 { margin: 0; }
    .row {
      display: grid; grid-template-columns: 1fr 2fr auto auto; align-items: center;
      gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid var(--divider-color, #eee);
    }
    .name { font-weight: 500; }
    .def { color: var(--secondary-text-color); font-family: monospace; font-size: 0.9em; }
    .badge {
      font-size: 0.7em; padding: 0.1em 0.5em; border-radius: 3px;
      background: var(--secondary-background-color, #eee); color: var(--secondary-text-color);
    }
    .actions { display: flex; gap: 0.3rem; }
    button.icon {
      background: none; border: none; padding: 0.2rem 0.4rem; cursor: pointer;
      color: var(--secondary-text-color); font-size: 1em;
    }
    button.icon:hover { color: var(--primary-color); }
    button.add { margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer; }
    .warnings {
      background: var(--warning-color, #ffd); border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-bottom: 1rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,a([c({attribute:!1})],R.prototype,"hass",2),a([p()],R.prototype,"_view",2),a([p()],R.prototype,"_modal",2),a([p()],R.prototype,"_warnings",2),R=a([f("ambience-time-of-day-config")],R);var L=class extends u{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await rt(this.hass)}async _save(e){this._config=e;let t=await it(this.hass,e.workday_sensor,e.workday_calendar);this._warnings=t.warnings??[]}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=[{name:"workday_sensor",selector:{entity:{domain:"binary_sensor"}}}],t=[{name:"workday_calendar",selector:{entity:{domain:"calendar"}}}];return l`
      <div class="row">
        <label>Workday sensor</label>
        <ha-form
          .hass=${this.hass}
          .schema=${e}
          .data=${{workday_sensor:this._config.workday_sensor??""}}
          @value-changed=${i=>{i.stopPropagation(),this._onSensorChange({detail:{value:i.detail.value?.workday_sensor||null}})}}
        ></ha-form>
      </div>
      <div class="row">
        <label>Workday calendar</label>
        <ha-form
          .hass=${this.hass}
          .schema=${t}
          .data=${{workday_calendar:this._config.workday_calendar??""}}
          @value-changed=${i=>{i.stopPropagation(),this._onCalendarChange({detail:{value:i.detail.value?.workday_calendar||null}})}}
        ></ha-form>
      </div>
      ${this._warnings.length?l`
        <div class="warnings">
          <strong>Warning:</strong> rules now reference unconfigured entities:
          <ul>
            ${this._warnings.map(i=>l`<li>${i.area_id} / "${i.rule_name}" → ${i.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};L.styles=m`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,a([c({attribute:!1})],L.prototype,"hass",2),a([p()],L.prototype,"_config",2),a([p()],L.prototype,"_warnings",2),L=a([f("ambience-day-config")],L);var N=class extends u{constructor(){super(...arguments);this._matchers=[];this._enabled=new Set;this._error=""}async connectedCallback(){super.connectedCallback();try{let[e,t]=await Promise.all([ce(this.hass),et(this.hass)]);this._matchers=e,this._enabled=new Set(t.enabled)}catch(e){this._error=e.message||String(e)}}async _onToggle(e,t){let i=new Set(this._enabled);t?i.add(e):i.delete(e),this._enabled=i;try{let n=this._matchers.filter(o=>o.toggleable&&i.has(o.name)).map(o=>o.name);await tt(this.hass,n)}catch(n){this._error=n.message||String(n)}}render(){let e=this._matchers.filter(t=>t.toggleable);return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${e.map(t=>l`
        <ambience-matcher-card
          .hass=${this.hass}
          .matcherName=${t.name}
          .matcherDescription=${t.description}
          .enabled=${this._enabled.has(t.name)}
          @enable-changed=${i=>{i.stopPropagation(),this._onToggle(t.name,i.detail.enabled)}}
        >
          ${t.name==="time_of_day"?l`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`:t.name==="day"?l`<ambience-day-config .hass=${this.hass}></ambience-day-config>`:l``}
        </ambience-matcher-card>
      `)}
    `}};N.styles=m`
    :host { display: block; padding: 1rem; max-width: 60rem; margin: 0 auto; }
    .error { color: var(--error-color, #d32f2f); }
  `,a([c({attribute:!1})],N.prototype,"hass",2),a([p()],N.prototype,"_matchers",2),a([p()],N.prototype,"_enabled",2),a([p()],N.prototype,"_error",2),N=a([f("ambience-configuration-view")],N);var q=class extends u{constructor(){super(...arguments);this._view="areas"}connectedCallback(){super.connectedCallback(),I(this)}render(){return l`
      <header>
        <h1>Ambience</h1>
        <nav>
          <button
            class=${this._view==="areas"?"active":""}
            @click=${()=>{this._view="areas"}}
          >Areas</button>
          <button
            class=${this._view==="configuration"?"active":""}
            @click=${()=>{this._view="configuration"}}
          >Configuration</button>
        </nav>
      </header>
      ${this._view==="areas"?l`<ambience-areas-list .hass=${this.hass}></ambience-areas-list>`:l`<ambience-configuration-view .hass=${this.hass}></ambience-configuration-view>`}
    `}};q.styles=m`
    :host {
      display: block;
      height: 100vh;
      background: var(--primary-background-color, #fafafa);
      color: var(--primary-text-color, #1d1d1d);
      font-family: var(--primary-font-family, system-ui, sans-serif);
    }
    header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    h1 {
      margin: 0;
      font-size: 1.4rem;
      flex: 1;
    }
    nav {
      display: flex;
      gap: 0.25rem;
    }
    nav button {
      background: transparent;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
      color: var(--primary-text-color, inherit);
      font-size: 0.9rem;
    }
    nav button.active {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
  `,a([c({attribute:!1})],q.prototype,"hass",2),a([p()],q.prototype,"_view",2),q=a([f("ambience-panel")],q);export{q as AmbiencePanel};
