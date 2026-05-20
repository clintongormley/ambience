/* Ambience panel — bundled output. Do not edit by hand. */
var pt=Object.defineProperty;var mt=Object.getOwnPropertyDescriptor;var o=(s,i,e,t)=>{for(var r=t>1?void 0:t?mt(i,e):i,n=s.length-1,a;n>=0;n--)(a=s[n])&&(r=(t?a(i,e,r):a(r))||r);return t&&r&&pt(i,e,r),r};var ne=globalThis,se=ne.ShadowRoot&&(ne.ShadyCSS===void 0||ne.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ye=Symbol(),De=new WeakMap,J=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==ye)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(se&&i===void 0){let t=e!==void 0&&e.length===1;t&&(i=De.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&De.set(e,i))}return i}toString(){return this.cssText}},Te=s=>new J(typeof s=="string"?s:s+"",void 0,ye),f=(s,...i)=>{let e=s.length===1?s[0]:i.reduce((t,r,n)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[n+1],s[0]);return new J(e,s,ye)},Me=(s,i)=>{if(se)s.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let t=document.createElement("style"),r=ne.litNonce;r!==void 0&&t.setAttribute("nonce",r),t.textContent=e.cssText,s.appendChild(t)}},be=se?s=>s:s=>s instanceof CSSStyleSheet?(i=>{let e="";for(let t of i.cssRules)e+=t.cssText;return Te(e)})(s):s;var{is:ft,defineProperty:gt,getOwnPropertyDescriptor:_t,getOwnPropertyNames:vt,getOwnPropertySymbols:yt,getPrototypeOf:bt}=Object,ae=globalThis,Ne=ae.trustedTypes,$t=Ne?Ne.emptyScript:"",xt=ae.reactiveElementPolyfillSupport,X=(s,i)=>s,Y={toAttribute(s,i){switch(i){case Boolean:s=s?$t:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,i){let e=s;switch(i){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},oe=(s,i)=>!ft(s,i),Re={attribute:!0,type:String,converter:Y,reflect:!1,useDefault:!1,hasChanged:oe};Symbol.metadata??=Symbol("metadata"),ae.litPropertyMetadata??=new WeakMap;var H=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=Re){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let t=Symbol(),r=this.getPropertyDescriptor(i,t,e);r!==void 0&&gt(this.prototype,i,r)}}static getPropertyDescriptor(i,e,t){let{get:r,set:n}=_t(this.prototype,i)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){let d=r?.call(this);n?.call(this,a),this.requestUpdate(i,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??Re}static _$Ei(){if(this.hasOwnProperty(X("elementProperties")))return;let i=bt(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(X("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(X("properties"))){let e=this.properties,t=[...vt(e),...yt(e)];for(let r of t)this.createProperty(r,e[r])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let r=this._$Eu(e,t);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let t=new Set(i.flat(1/0).reverse());for(let r of t)e.unshift(be(r))}else i!==void 0&&e.push(be(i));return e}static _$Eu(i,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Me(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){let t=this.constructor.elementProperties.get(i),r=this.constructor._$Eu(i,t);if(r!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:Y).toAttribute(e,t.type);this._$Em=i,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(i,e){let t=this.constructor,r=t._$Eh.get(i);if(r!==void 0&&this._$Em!==r){let n=t.getPropertyOptions(r),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Y;this._$Em=r;let d=a.fromAttribute(e,n.type);this[r]=d??this._$Ej?.get(r)??d,this._$Em=null}}requestUpdate(i,e,t,r=!1,n){if(i!==void 0){let a=this.constructor;if(r===!1&&(n=this[i]),t??=a.getPropertyOptions(i),!((t.hasChanged??oe)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(i)&&!this.hasAttribute(a._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:r,wrapped:n},a){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,a??e??this[i]),n!==!0||a!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),r===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[r,n]of t){let{wrapped:a}=n,d=this[r];a!==!0||this._$AL.has(r)||d===void 0||this.C(r,void 0,n,d)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};H.elementStyles=[],H.shadowRootOptions={mode:"open"},H[X("elementProperties")]=new Map,H[X("finalized")]=new Map,xt?.({ReactiveElement:H}),(ae.reactiveElementVersions??=[]).push("2.1.2");var Ce=globalThis,Le=s=>s,le=Ce.trustedTypes,Oe=le?le.createPolicy("lit-html",{createHTML:s=>s}):void 0,qe="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Be="?"+T,wt=`<${Be}>`,j=document,Z=()=>j.createComment(""),Q=s=>s===null||typeof s!="object"&&typeof s!="function",He=Array.isArray,kt=s=>He(s)||typeof s?.[Symbol.iterator]=="function",$e=`[ 	
\f\r]`,G=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,je=/-->/g,Ue=/>/g,L=RegExp(`>|${$e}(?:([^\\s"'>=/]+)(${$e}*=${$e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ze=/'/g,Fe=/"/g,Ve=/^(?:script|style|textarea|title)$/i,Pe=s=>(i,...e)=>({_$litType$:s,strings:i,values:e}),l=Pe(1),Vt=Pe(2),Kt=Pe(3),U=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),We=new WeakMap,O=j.createTreeWalker(j,129);function Ke(s,i){if(!He(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Oe!==void 0?Oe.createHTML(i):i}var Et=(s,i)=>{let e=s.length-1,t=[],r,n=i===2?"<svg>":i===3?"<math>":"",a=G;for(let d=0;d<e;d++){let h=s[d],p,v,_=-1,C=0;for(;C<h.length&&(a.lastIndex=C,v=a.exec(h),v!==null);)C=a.lastIndex,a===G?v[1]==="!--"?a=je:v[1]!==void 0?a=Ue:v[2]!==void 0?(Ve.test(v[2])&&(r=RegExp("</"+v[2],"g")),a=L):v[3]!==void 0&&(a=L):a===L?v[0]===">"?(a=r??G,_=-1):v[1]===void 0?_=-2:(_=a.lastIndex-v[2].length,p=v[1],a=v[3]===void 0?L:v[3]==='"'?Fe:ze):a===Fe||a===ze?a=L:a===je||a===Ue?a=G:(a=L,r=void 0);let D=a===L&&s[d+1].startsWith("/>")?" ":"";n+=a===G?h+wt:_>=0?(t.push(p),h.slice(0,_)+qe+h.slice(_)+T+D):h+T+(_===-2?d:D)}return[Ke(s,n+(s[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),t]},ee=class s{constructor({strings:i,_$litType$:e},t){let r;this.parts=[];let n=0,a=0,d=i.length-1,h=this.parts,[p,v]=Et(i,e);if(this.el=s.createElement(p,t),O.currentNode=this.el.content,e===2||e===3){let _=this.el.content.firstChild;_.replaceWith(..._.childNodes)}for(;(r=O.nextNode())!==null&&h.length<d;){if(r.nodeType===1){if(r.hasAttributes())for(let _ of r.getAttributeNames())if(_.endsWith(qe)){let C=v[a++],D=r.getAttribute(_).split(T),ie=/([.?@])?(.*)/.exec(C);h.push({type:1,index:n,name:ie[2],strings:D,ctor:ie[1]==="."?we:ie[1]==="?"?ke:ie[1]==="@"?Ee:V}),r.removeAttribute(_)}else _.startsWith(T)&&(h.push({type:6,index:n}),r.removeAttribute(_));if(Ve.test(r.tagName)){let _=r.textContent.split(T),C=_.length-1;if(C>0){r.textContent=le?le.emptyScript:"";for(let D=0;D<C;D++)r.append(_[D],Z()),O.nextNode(),h.push({type:2,index:++n});r.append(_[C],Z())}}}else if(r.nodeType===8)if(r.data===Be)h.push({type:2,index:n});else{let _=-1;for(;(_=r.data.indexOf(T,_+1))!==-1;)h.push({type:7,index:n}),_+=T.length-1}n++}}static createElement(i,e){let t=j.createElement("template");return t.innerHTML=i,t}};function B(s,i,e=s,t){if(i===U)return i;let r=t!==void 0?e._$Co?.[t]:e._$Cl,n=Q(i)?void 0:i._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(s),r._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=r:e._$Cl=r),r!==void 0&&(i=B(s,r._$AS(s,i.values),r,t)),i}var xe=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:t}=this._$AD,r=(i?.creationScope??j).importNode(e,!0);O.currentNode=r;let n=O.nextNode(),a=0,d=0,h=t[0];for(;h!==void 0;){if(a===h.index){let p;h.type===2?p=new te(n,n.nextSibling,this,i):h.type===1?p=new h.ctor(n,h.name,h.strings,this,i):h.type===6&&(p=new Se(n,this,i)),this._$AV.push(p),h=t[++d]}a!==h?.index&&(n=O.nextNode(),a++)}return O.currentNode=j,r}p(i){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}},te=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,t,r){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=t,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=B(this,i,e),Q(i)?i===y||i==null||i===""?(this._$AH!==y&&this._$AR(),this._$AH=y):i!==this._$AH&&i!==U&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):kt(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==y&&Q(this._$AH)?this._$AA.nextSibling.data=i:this.T(j.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:t}=i,r=typeof t=="number"?this._$AC(i):(t.el===void 0&&(t.el=ee.createElement(Ke(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===r)this._$AH.p(e);else{let n=new xe(r,this),a=n.u(this.options);n.p(e),this.T(a),this._$AH=n}}_$AC(i){let e=We.get(i.strings);return e===void 0&&We.set(i.strings,e=new ee(i)),e}k(i){He(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,r=0;for(let n of i)r===e.length?e.push(t=new s(this.O(Z()),this.O(Z()),this,this.options)):t=e[r],t._$AI(n),r++;r<e.length&&(this._$AR(t&&t._$AB.nextSibling,r),e.length=r)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let t=Le(i).nextSibling;Le(i).remove(),i=t}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},V=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,t,r,n){this.type=1,this._$AH=y,this._$AN=void 0,this.element=i,this.name=e,this._$AM=r,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=y}_$AI(i,e=this,t,r){let n=this.strings,a=!1;if(n===void 0)i=B(this,i,e,0),a=!Q(i)||i!==this._$AH&&i!==U,a&&(this._$AH=i);else{let d=i,h,p;for(i=n[0],h=0;h<n.length-1;h++)p=B(this,d[t+h],e,h),p===U&&(p=this._$AH[h]),a||=!Q(p)||p!==this._$AH[h],p===y?i=y:i!==y&&(i+=(p??"")+n[h+1]),this._$AH[h]=p}a&&!r&&this.j(i)}j(i){i===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},we=class extends V{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===y?void 0:i}},ke=class extends V{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==y)}},Ee=class extends V{constructor(i,e,t,r,n){super(i,e,t,r,n),this.type=5}_$AI(i,e=this){if((i=B(this,i,e,0)??y)===U)return;let t=this._$AH,r=i===y&&t!==y||i.capture!==t.capture||i.once!==t.once||i.passive!==t.passive,n=i!==y&&(t===y||r);r&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},Se=class{constructor(i,e,t){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(i){B(this,i)}};var St=Ce.litHtmlPolyfillSupport;St?.(ee,te),(Ce.litHtmlVersions??=[]).push("3.3.2");var Je=(s,i,e)=>{let t=e?.renderBefore??i,r=t._$litPart$;if(r===void 0){let n=e?.renderBefore??null;t._$litPart$=r=new te(i.insertBefore(Z(),n),n,void 0,e??{})}return r._$AI(s),r};var Ae=globalThis,m=class extends H{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=Je(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}};m._$litElement$=!0,m.finalized=!0,Ae.litElementHydrateSupport?.({LitElement:m});var Ct=Ae.litElementPolyfillSupport;Ct?.({LitElement:m});(Ae.litElementVersions??=[]).push("4.2.2");var g=s=>(i,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(s,i)}):customElements.define(s,i)};var Ht={attribute:!0,type:String,converter:Y,reflect:!1,hasChanged:oe},Pt=(s=Ht,i,e)=>{let{kind:t,metadata:r}=e,n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),t==="setter"&&((s=Object.create(s)).wrapped=!0),n.set(e.name,s),t==="accessor"){let{name:a}=e;return{set(d){let h=i.get.call(this);i.set.call(this,d),this.requestUpdate(a,h,s,!0,d)},init(d){return d!==void 0&&this.C(a,void 0,s,d),d}}}if(t==="setter"){let{name:a}=e;return function(d){let h=this[a];i.call(this,d),this.requestUpdate(a,h,s,!0,d)}}throw Error("Unsupported decorator location: "+t)};function c(s){return(i,e)=>typeof e=="object"?Pt(s,i,e):((t,r,n)=>{let a=r.hasOwnProperty(n);return r.constructor.createProperty(n,t),a?Object.getOwnPropertyDescriptor(r,n):void 0})(s,i,e)}function u(s){return c({...s,state:!0,attribute:!1})}var At=["ha-input","ha-textfield","ha-form"],It=["ha-input","ha-textfield"];function Xe(){for(let s of It)if(customElements.get(s))return s;return null}function M(s,i){for(let e of At)customElements.get(e)||customElements.whenDefined(e).then(()=>s.requestUpdate())}async function Ye(s){return s.callWS({type:"ambience/areas/list"})}async function Ge(s,i){return s.callWS({type:"ambience/area/get",area_id:i})}async function Ze(s,i,e){return s.callWS({type:"ambience/area/save",area_id:i,config:e})}async function ce(s){return s.callWS({type:"ambience/matchers/list"})}async function Qe(s){return s.callWS({type:"ambience/actions/list"})}async function he(s){return s.callWS({type:"ambience/time_of_day_periods/list"})}async function et(s,i,e){return s.callWS({type:"ambience/time_of_day_periods/save",custom:i,hidden:e})}async function tt(s){return s.callWS({type:"ambience/time_of_day_periods/reset"})}async function ue(s){return s.callWS({type:"ambience/matchers/enabled/list"})}async function rt(s,i){return s.callWS({type:"ambience/matchers/enabled/save",enabled:i})}async function pe(s){return s.callWS({type:"ambience/matchers/day/config/list"})}async function it(s,i,e){return s.callWS({type:"ambience/matchers/day/config/save",workday_sensor:i,workday_calendar:e})}function me(s,i,e){let t=s?.localize?.(i);return t&&t!==i?t:e}function Ie(s){let i=s.replaceAll("_"," ").toLowerCase();return i.charAt(0).toUpperCase()+i.slice(1)}function K(s,i){return me(s,`component.ambience.matcher.${i}`,Ie(i))}function nt(s,i){return me(s,`component.ambience.action.${i}`,Ie(i))}function fe(s,i){return me(s,`component.ambience.anchor.${i}`,Ie(i))}function z(s,i,e){let t=e[i]?.label;if(t)return t;let r=i.charAt(0).toUpperCase()+i.slice(1);return me(s,`component.ambience.time_of_day_period.${i}`,r)}function ge(s,i="New rule"){if(s.name&&s.name.trim())return s.name;let e=s.when?.scene;return typeof e=="string"&&e.trim()?e:i}function _e(s,i,e){return i==null?"(any)":s==="time_of_day"?ve(i,e):String(i)}function ve(s,i){if(s===null)return"any";let e=Array.isArray(s)?s:[s],t=i.periods?.custom??{};return e.map(r=>"period"in r?z(i.hass,r.period,t):`${st(r.from,i)} \u2192 ${st(r.to,i)}`).join(", ")}function st(s,i){if(s.kind==="time")return`${String(s.hh).padStart(2,"0")}:${String(s.mm).padStart(2,"0")}`;let e=fe(i.hass,s.anchor);if(s.offset_min===0)return e;let t=Math.abs(s.offset_min),r=t%60===0?`${t/60}h`:`${t}m`;return`${e}${s.offset_min<0?"-":"+"}${r}`}function at(s,i,e){let t=nt(e.hass,s.action),r=i?.domains?.[0]??"target",n=s.entity_ids.length,a;n===0?a="(no targets)":n===1?a=`1 ${r}`:a=`${n} ${r}s`;let d={};for(let p of i?.target_params??[])p.unit&&(d[p.name]=p.unit);let h=Object.entries(s.params).filter(([,p])=>p!=null&&p!=="").map(([p,v])=>`${p} ${v}${d[p]??""}`).join(", ");return h?`${t}: ${a}, ${h}`:`${t}: ${a}`}var w=class extends m{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_summary(e){let t=Object.keys(e.when).filter(a=>e.when[a]!=null),r=t.length===0?"any":t.map(a=>`${K(this.hass,a)}: ${_e(a,e.when[a],{hass:this.hass,periods:this.periods})}`).join(", "),n=e.actions.length;return`${r} \xB7 ${n} action${n===1?"":"s"}`}_onDragStart(e){this._dragFrom=e}_onDragOver(e,t){this._dragFrom===null||t===this._dragFrom||(e.preventDefault(),this._dragOver=t)}_onDrop(e){let t=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(t===null||t===e)&&this._emit("reorder-rules",{from:t,to:e})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(e,t){let r=t.name||`Rule ${e+1}`;window.confirm(`Delete "${r}"?`)&&this._emit("delete-rule",{index:e})}render(){return this.rules.length===0?l`
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
              @dragover=${r=>this._onDragOver(r,t)}
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
                  ${ge(e,`Rule ${t+1}`)}
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
    `}};w.styles=f`
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
  `,o([c({attribute:!1})],w.prototype,"rules",2),o([c({type:Boolean})],w.prototype,"autoSort",2),o([c({attribute:!1})],w.prototype,"periods",2),o([c({attribute:!1})],w.prototype,"hass",2),o([u()],w.prototype,"_dragFrom",2),o([u()],w.prototype,"_dragOver",2),w=o([g("ambience-rules-list")],w);function ot(s,i,e){if(!s||!s.entities||!i)return[];let t=s.entities,r=s.devices??{};return Object.values(t).filter(n=>!!(n.area_id===i||n.device_id&&r[n.device_id]?.area_id===i)).filter(n=>e.includes(n.entity_id.split(".")[0])).map(n=>n.entity_id).sort()}var E=class extends m{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=e=>{this._open&&(e.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=e=>{e.stopPropagation();let t=e.detail.value?.scene??"";this._emit(t.trim()===""?null:t)}}connectedCallback(){super.connectedCallback(),M(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(e){e.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(t=>({value:t,label:t})),custom_value:!0,mode:"dropdown"}}}])}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target.value;this._emit(t.trim()===""?null:t),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(e){e.key==="Escape"&&this._open&&(this._open=!1,e.stopPropagation())}_toggle(e){e.preventDefault(),this._open=!this._open}_select(e,t){t.preventDefault(),this._emit(e),this._open=!1}render(){if(customElements.get("ha-form")){let e={scene:this.value??""};return l`
        <ha-form
          .hass=${this.hass}
          .schema=${this._schema}
          .data=${e}
          .computeLabel=${Dt}
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
    `}};E.styles=f`
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
  `,o([c({attribute:!1})],E.prototype,"hass",2),o([c()],E.prototype,"value",2),o([c({attribute:!1})],E.prototype,"suggestions",2),o([u()],E.prototype,"_schema",2),o([u()],E.prototype,"_open",2),E=o([g("ambience-scene-combobox")],E);function Dt(s){return s.name==="scene"?"Scene name":s.name}var Tt=["dawn","sunrise","noon","sunset","dusk","midnight"],F=class extends m{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onKindChange(e){let t=e.target.value;t!==this.value.kind&&(t==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let t=e.target.value,[r,n]=t.split(":").map(a=>parseInt(a,10));Number.isNaN(r)||Number.isNaN(n)||this._emit({kind:"time",hh:r,mm:n})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let t=e.target.value;this._emit({kind:"sun",anchor:t,offset_min:this.value.offset_min})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let t=parseInt(e.target.value,10);Number.isNaN(t)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:t})}_renderTime(e){let t=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return l`<input type="time" .value=${t} @input=${this._onTimeChange} />`}_renderSun(e){let t=Mt(e.offset_min);return l`
      <select @change=${this._onAnchorChange}>
        ${Tt.map(r=>l`<option value=${r} ?selected=${r===e.anchor}>${fe(this.hass,r)}</option>`)}
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
    `}};F.styles=f`
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
  `,o([c({attribute:!1})],F.prototype,"hass",2),o([c({attribute:!1})],F.prototype,"value",2),F=o([g("ambience-time-endpoint")],F);function Mt(s){if(s===0)return"";let i=Math.abs(s),e=s<0?"\u2212":"+";if(i%60===0){let t=i/60;return`${e}${t} ${t===1?"hour":"hours"}`}return`${e}${i} min`}var re={kind:"any"},lt={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},S=class extends m{constructor(){super(...arguments);this.value=null;this._entries=[re];this._openIdx=0}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[re]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(t=>{let r=this._entries[this._openIdx];if(!r)return;let n=r.kind==="any"?"__any__":r.kind==="range"?"__custom__":r.period;t.value!==n&&(t.value=n)})}_predicateToEntries(e){return e===null?[re]:(Array.isArray(e)?e:[e]).map(r=>"period"in r?{kind:"period",period:r.period}:{kind:"range",from:r.from,to:r.to})}_emit(e){let t=e.filter(n=>n.kind!=="any").map(n=>n.kind==="period"?{period:n.period}:{from:n.from,to:n.to}),r=t.length===0?null:t.length===1?t[0]:t;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let e=Object.keys(this.periods.builtins),t=Object.keys(this.periods.custom).filter(n=>!(n in this.periods.builtins)),r=new Set(this.periods.hidden);return[...e.filter(n=>!r.has(n)),...t]}_onSelectChange(e,t){let r=t.target.value,n=[...this._entries];r==="__any__"?n[e]=re:r==="__custom__"?n[e]={kind:"range",...lt}:n[e]={kind:"period",period:r},this._entries=n,this._emit(n)}_onRangeChange(e,t,r){r.stopPropagation();let n=this._entries[e];if(!n||n.kind!=="range")return;let a=[...this._entries];a[e]={...n,[t]:r.detail.value},this._entries=a,this._emit(a)}_onRemove(e){let t=this._entries.filter((r,n)=>n!==e);this._entries=t.length===0?[re]:t,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...lt}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,t){let r;return e.kind==="any"?r="(any)":e.kind==="period"?r=ve({period:e.period},{hass:this.hass,periods:this.periods}):r=ve({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),l`
      <div class="summary-chip" @click=${()=>this._onChipClick(t)}>
        <span class="chip-label">${r}</span>
        ${this._entries.length>1?l`<button class="remove" @click=${n=>{n.stopPropagation(),this._onRemove(t)}} title="Remove">✕</button>`:""}
      </div>
    `}_renderEntry(e,t,r){let n=this._effectiveIds(),a=this.periods?.custom??{};return l`
      <div class="entry">
        <div class="entry-header">
          <select @change=${d=>this._onSelectChange(t,d)}>
            ${r?l`<option value="__any__">Any time</option>`:""}
            <option value="__custom__">Custom range</option>
            <option disabled>──────</option>
            ${n.map(d=>l`<option value=${d}>
                ${z(this.hass,d,a)}${a[d]&&!this.periods?.builtins[d]?" (custom)":""}
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
    `}render(){let e=this._entries.some(r=>r.kind!=="any"),t=this._entries.length>1;return l`
      ${this._entries.map((r,n)=>t&&n!==this._openIdx?this._renderChip(r,n):this._renderEntry(r,n,n===0))}
      ${e?l`<button class="add-btn" @click=${this._onAdd}>+ add another time range</button>`:""}
    `}};S.styles=f`
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
  `,o([c({attribute:!1})],S.prototype,"value",2),o([c({attribute:!1})],S.prototype,"periods",2),o([c({attribute:!1})],S.prototype,"hass",2),o([u()],S.prototype,"_entries",2),o([u()],S.prototype,"_openIdx",2),S=o([g("ambience-time-of-day-input")],S);var dt=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],ct={weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"},Nt=new Set(["workday","holiday"]),Rt=new Set(["first_workday","last_workday"]),Lt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function ht(s){switch(s){case"weekday":return{kind:s,days:[]};case"day_of_month":return{kind:s,days:[]};case"date":return{kind:s,month:1,day:1};case"date_range":return{kind:s,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:s}}}var W=class extends m{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let t=e.include.length===0&&e.exclude.length===0;this.value=t?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_addItem(e,t){let r=this._current();r[e]=[...r[e],ht(t)],this._emit(r)}_removeItem(e,t){let r=this._current();r[e]=r[e].filter((n,a)=>a!==t),this._emit(r)}_updateItem(e,t,r){let n=this._current();n[e]=n[e].map((a,d)=>d===t?{...a,...r}:a),this._emit(n)}_kindDisabled(e){return!!(Nt.has(e)&&!this.dayConfig.workday_sensor||Rt.has(e)&&!this.dayConfig.workday_calendar)}_renderItem(e,t,r){return l`
      <div class="item">
        <select
          .value=${r.kind}
          @change=${n=>{let a=n.target.value;this._updateItem(e,t,ht(a))}}
        >
          ${dt.map(n=>l`<option value=${n} ?disabled=${this._kindDisabled(n)}>${ct[n]}</option>`)}
        </select>
        <div class="body">${this._renderItemBody(e,t,r)}</div>
        <button class="remove" title="Remove" @click=${()=>this._removeItem(e,t)}>✕</button>
      </div>
    `}_renderItemBody(e,t,r){if(r.kind==="weekday")return l`${Lt.map((n,a)=>l`
        <label class="day-pill">
          <input
            type="checkbox"
            .checked=${r.days.includes(a)}
            @change=${d=>{let p=d.target.checked?[...r.days,a].sort((v,_)=>v-_):r.days.filter(v=>v!==a);this._updateItem(e,t,{kind:"weekday",days:p})}}
          />${n}
        </label>
      `)}`;if(r.kind==="day_of_month")return l`<input
        type="text" placeholder="e.g. 1, 15, 31"
        .value=${r.days.join(", ")}
        @change=${n=>{let a=n.target.value.split(",").map(d=>parseInt(d.trim(),10)).filter(d=>Number.isFinite(d));this._updateItem(e,t,{kind:"day_of_month",days:a})}}
      />`;if(r.kind==="date")return l`
        <input type="number" min="1" max="12" .value=${String(r.month)}
          @change=${n=>this._updateItem(e,t,{kind:"date",month:parseInt(n.target.value,10),day:r.day})} />
        /
        <input type="number" min="1" max="31" .value=${String(r.day)}
          @change=${n=>this._updateItem(e,t,{kind:"date",month:r.month,day:parseInt(n.target.value,10)})} />
      `;if(r.kind==="date_range"){let n=r.from.month,a=r.from.day,d=r.to.month,h=r.to.day;return l`
        <span>from</span>
        <input type="number" min="1" max="12" .value=${String(n)}
          @change=${p=>this._updateItem(e,t,{kind:"date_range",from:{month:parseInt(p.target.value,10),day:a},to:r.to})} />
        /
        <input type="number" min="1" max="31" .value=${String(a)}
          @change=${p=>this._updateItem(e,t,{kind:"date_range",from:{month:n,day:parseInt(p.target.value,10)},to:r.to})} />
        <span>to</span>
        <input type="number" min="1" max="12" .value=${String(d)}
          @change=${p=>this._updateItem(e,t,{kind:"date_range",from:r.from,to:{month:parseInt(p.target.value,10),day:h}})} />
        /
        <input type="number" min="1" max="31" .value=${String(h)}
          @change=${p=>this._updateItem(e,t,{kind:"date_range",from:r.from,to:{month:d,day:parseInt(p.target.value,10)}})} />
      `}return l``}_renderSection(e,t){return l`
      <div class="section">
        <h4>${e==="include"?"Include":"Exclude"}</h4>
        ${t.length===0&&e==="include"?l`<div class="hint">(empty → all days)</div>`:""}
        ${t.map((r,n)=>this._renderItem(e,n,r))}
        <select
          .value=${""}
          @change=${r=>{let n=r.target.value;n&&(this._addItem(e,n),r.target.value="")}}
        >
          <option value="">+ Add ${e} item</option>
          ${dt.map(r=>l`<option value=${r} ?disabled=${this._kindDisabled(r)}>${ct[r]}</option>`)}
        </select>
      </div>
    `}render(){let{include:e,exclude:t}=this._current();return l`
      ${this._renderSection("include",e)}
      ${this._renderSection("exclude",t)}
    `}};W.styles=f`
    :host { display: block; }
    .section { margin-bottom: 1rem; }
    .section h4 { margin: 0 0 0.5rem 0; font-size: 0.95em; }
    .hint { color: var(--secondary-text-color, #888); font-size: 0.85em; }
    .item {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.4rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; margin-bottom: 0.4rem;
      background: var(--card-background-color, #fff);
    }
    .item select, .item input[type="number"], .item input[type="text"] { padding: 0.25rem; }
    .item .body { flex: 1; display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
    .remove {
      background: none; border: none; color: var(--secondary-text-color);
      cursor: pointer; font-size: 1em; padding: 0;
    }
    label.day-pill {
      display: inline-flex; align-items: center; gap: 0.25rem;
      padding: 0.15rem 0.4rem; border-radius: 3px;
      background: var(--secondary-background-color, #f5f5f5);
      cursor: pointer;
    }
  `,o([c({attribute:!1})],W.prototype,"value",2),o([c({attribute:!1})],W.prototype,"dayConfig",2),W=o([g("ambience-day-predicate-input")],W);var k=class extends m{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onText(e){let t=e.target.value;this._emit(t.trim()===""?null:t)}render(){return this.matcher.input==="time_of_day"?l`
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
      `:this.matcher.input==="day_predicate"?l`
        <ambience-day-predicate-input
          .value=${this.value}
          .dayConfig=${this.dayConfig??{workday_sensor:null,workday_calendar:null}}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-day-predicate-input>
      `:l`
      <input
        type="text"
        placeholder="(any)"
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};k.styles=f`
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
  `,o([c({attribute:!1})],k.prototype,"matcher",2),o([c({attribute:!1})],k.prototype,"value",2),o([c({attribute:!1})],k.prototype,"sceneSuggestions",2),o([c({attribute:!1})],k.prototype,"periods",2),o([c({attribute:!1})],k.prototype,"dayConfig",2),o([c({attribute:!1})],k.prototype,"hass",2),k=o([g("ambience-matcher-input")],k);var N=class extends m{constructor(){super(...arguments);this.entities=[];this.value=[]}connectedCallback(){super.connectedCallback(),M(this,this.hass)}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let e=[{name:"entity_ids",label:"",selector:{entity:{multiple:!0,include_entities:this.entities}}}];return l`
      <ha-form
        .hass=${this.hass}
        .schema=${e}
        .data=${{entity_ids:this.value}}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,t){let r=new Set(this.value);t?r.add(e):r.delete(e),this._emit(this.entities.filter(n=>r.has(n)))}_renderFallback(){return this.entities.length===0?l`<p class="empty">No matching entities in this area.</p>`:l`
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
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};N.styles=f`
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
  `,o([c({attribute:!1})],N.prototype,"hass",2),o([c({attribute:!1})],N.prototype,"entities",2),o([c({attribute:!1})],N.prototype,"value",2),N=o([g("ambience-target-picker")],N);var b=class extends m{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._open=null;this._showError=!1;this._onNameInput=e=>{this._setName(e.target.value)}}connectedCallback(){super.connectedCallback(),M(this,this.hass)}willUpdate(e){e.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null,this._open=null,this._showError=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"}))return l`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
        </div>
      `;let r=ge(this._draft,"New rule");return l`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${r}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let t=Xe();return t==="ha-input"?l`<ha-input label="Name (optional)" .value=${e} @input=${this._onNameInput}></ha-input>`:t==="ha-textfield"?l`<ha-textfield label="Name (optional)" .value=${e} @input=${this._onNameInput}></ha-textfield>`:l`<input type="text" .value=${e} @input=${this._onNameInput} />`}_isOpen(e){return this._open===null?!1:e.kind==="name"&&this._open.kind==="name"?!0:e.kind==="matcher"&&this._open.kind==="matcher"?e.id===this._open.id:e.kind==="action"&&this._open.kind==="action"?e.idx===this._open.idx:!1}_validationError(e){if(e===null||e.kind==="name"||e.kind==="matcher")return null;let t=this._draft?.actions[e.idx];if(!t)return null;if(t.entity_ids.length===0)return"At least one target is required.";let r=this.availableActions.find(n=>n.name===t.action);if(!r)return null;for(let n of r.target_params){if(!n.required)continue;let a=t.params[n.name];if(a==null||a==="")return`${this._paramLabel(n.name)} is required.`}return null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){this._tryCloseCurrent();return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let t of e.composedPath())if(t instanceof Element&&(t.classList.contains("slot")||t.classList.contains("actions-bar")))return;this._tryCloseCurrent()}_setPredicate(e,t){if(!this._draft)return;let r={...this._draft.when};t==null?delete r[e]:r[e]=t,this._draft={...this._draft,when:r}}_renderMatcherRow(e){let t=this._draft.when[e.name]??null,r=this._isOpen({kind:"matcher",id:e.name}),n=e.input==="scene_combobox";if(r&&n)return l`
        <div class="slot combobox-slot expanded" data-slot-id=${e.name}>
          <ambience-matcher-input
            .hass=${this.hass}
            .matcher=${e}
            .value=${t}
            .sceneSuggestions=${this.sceneSuggestions}
            .periods=${this.periods}
            .dayConfig=${this.dayConfig}
            @value-changed=${d=>this._setPredicate(e.name,d.detail.value)}
          ></ambience-matcher-input>
        </div>
      `;let a=_e(e.name,t,{hass:this.hass,periods:this.periods});return l`
      <div class="slot ${r?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"matcher",id:e.name})}>
          <span class="summary-label"><strong>${K(this.hass,e.name)}:</strong> ${a}</span>
        </div>
        ${r?l`
          <div class="body">
            <ambience-matcher-input
              .hass=${this.hass}
              .matcher=${e}
              .value=${t}
              .sceneSuggestions=${this.sceneSuggestions}
              .periods=${this.periods}
              .dayConfig=${this.dayConfig}
              @value-changed=${d=>this._setPredicate(e.name,d.detail.value)}
            ></ambience-matcher-input>
          </div>
        `:""}
      </div>
    `}_addActionSlot(){if(!this._draft)return;let e={action:"set_light",entity_ids:[],params:{}},t=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,e]},this._open={kind:"action",idx:t}}_updateActionAt(e,t){if(!this._draft)return;let r=this._draft.actions.map((n,a)=>a===e?t(n):n);this._draft={...this._draft,actions:r}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((t,r)=>r!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,t){this._updateActionAt(e,r=>({...r,entity_ids:t}))}_paramLabel(e){let t=e.replaceAll("_"," ").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}_updateActionParam(e,t,r){this._updateActionAt(e,n=>{let a={...n.params},d=r;if(t.type==="int"?d=r===""?void 0:parseInt(r,10):t.type==="number"?d=r===""?void 0:parseFloat(r):t.type==="boolean"&&(d=r==="true"),typeof d=="number"&&Number.isFinite(d)){let h=d;typeof t.min=="number"&&h<t.min&&(h=t.min),typeof t.max=="number"&&h>t.max&&(h=t.max),d=h}return d===void 0?delete a[t.name]:a[t.name]=d,{...n,params:a}})}_renderActionParams(e,t,r){let n=r?.target_params??[];return l`
      ${n.map(a=>l`
        <div class="param-row">
          <label>${this._paramLabel(a.name)}${a.required?" *":""}</label>
          <div class="param-input">
            <input
              type=${a.type==="int"||a.type==="number"?"number":"text"}
              placeholder=${a.description??""}
              .value=${String(t.params[a.name]??"")}
              min=${a.min??""}
              max=${a.max??""}
              @input=${d=>this._updateActionParam(e,a,d.target.value)}
            />
            ${a.unit?l`<span class="param-unit">${a.unit}</span>`:""}
          </div>
        </div>
      `)}
    `}_renderActionRow(e,t){let r=this.availableActions.find(h=>h.name===e.action),n=this._isOpen({kind:"action",idx:t}),a=at(e,r,{hass:this.hass}),d=ot(this.hass,this.areaId,r?.domains??[]);return l`
      <div class="slot ${n?"expanded":"collapsed"}" data-slot-id="action-${t}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:t})}>
          <span class="summary-label">${a}</span>
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

            ${this._renderActionParams(t,e,r)}

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
    `:l``}};b.styles=f`
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
  `,o([c({type:Boolean,reflect:!0})],b.prototype,"open",2),o([c({attribute:!1})],b.prototype,"rule",2),o([c({attribute:!1})],b.prototype,"matchers",2),o([c({attribute:!1})],b.prototype,"sceneSuggestions",2),o([c({attribute:!1})],b.prototype,"periods",2),o([c({attribute:!1})],b.prototype,"dayConfig",2),o([c({attribute:!1})],b.prototype,"availableActions",2),o([c({attribute:!1})],b.prototype,"hass",2),o([c({attribute:!1})],b.prototype,"areaId",2),o([u()],b.prototype,"_draft",2),o([u()],b.prototype,"_open",2),o([u()],b.prototype,"_showError",2),b=o([g("ambience-rule-editor")],b);var $=class extends m{constructor(){super(...arguments);this._areas=[];this._matchers=[];this._actions=[];this._configs=new Map;this._expanded=new Set;this._error="";this._editing=null;this._enabledMatchers=new Set}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await this._refreshAreas(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _loadStatic(){try{let[e,t,r,n,a]=await Promise.all([ce(this.hass),Qe(this.hass),he(this.hass),ue(this.hass),pe(this.hass)]);if(!this.isConnected)return;this._matchers=e,this._actions=t,this._periods=r,this._enabledMatchers=new Set(n.enabled),this._dayConfig=a}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await Ye(this.hass),t=new Map;if(await Promise.all(e.map(async r=>{t.set(r.area_id,this._normalize(await Ge(this.hass,r.area_id)))})),!this.isConnected)return;this._areas=e,this._configs=t}catch(e){this._error=e.message||String(e)}}_normalize(e){return{rules:e.rules??[],auto_sort:e.auto_sort??!0}}async _subscribe(){let e=await this.hass.connection.subscribeEvents(t=>{if(t.data.action==="remove"){let r=t.data.area_id,n=new Set(this._expanded);n.delete(r),this._expanded=n,this._editing?.areaId===r&&(this._editing=null)}this._refreshAreas()},"area_registry_updated");this.isConnected?this._unsub=e:e()}_setConfig(e,t){let r=new Map(this._configs);r.set(e,t),this._configs=r}async _mutate(e,t){let r=this._configs.get(e);this._setConfig(e,t),this._error="";try{let{config:n}=await Ze(this.hass,e,t);this._setConfig(e,this._normalize(n))}catch(n){r&&this._setConfig(e,r),this._error=n.message||String(n)}}_toggleExpand(e){let t=new Set(this._expanded);t.has(e)?t.delete(e):t.add(e),this._expanded=t}_toggleAutoSort(e,t){let r=this._configs.get(e);r&&this._mutate(e,{...r,auto_sort:t})}_addRule(e){let t=this._configs.get(e);t&&(this._editing={areaId:e,index:t.rules.length,isNew:!0})}_editRule(e,t){this._editing={areaId:e,index:t.detail.index,isNew:!1}}_duplicateRule(e,t){let r=this._configs.get(e);if(!r)return;let n=r.rules[t.detail.index];if(!n)return;let a=JSON.parse(JSON.stringify(n)),d=[...r.rules];d.splice(t.detail.index+1,0,a),this._mutate(e,{...r,rules:d})}_deleteRule(e,t){let r=this._configs.get(e);if(!r)return;let n=r.rules.filter((a,d)=>d!==t.detail.index);this._mutate(e,{...r,rules:n})}_reorderRules(e,t){let r=this._configs.get(e);if(!r)return;let{from:n,to:a}=t.detail,d=[...r.rules],[h]=d.splice(n,1);d.splice(a,0,h),this._mutate(e,{...r,rules:d})}_saveRule(e){let t=this._editing;if(this._editing=null,!t)return;let r=this._configs.get(t.areaId);if(!r)return;let n=[...r.rules];t.isNew?n.push(e.detail):n[t.index]=e.detail,this._mutate(t.areaId,{...r,rules:n})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._configs.get(this._editing.areaId)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let e=this._configs.get(this._editing.areaId);if(!e)return[];let t=new Set;for(let r of e.rules){let n=r.when.scene;typeof n=="string"&&n&&t.add(n)}return[...t].sort((r,n)=>r.toLowerCase().localeCompare(n.toLowerCase()))}get _editorMatchers(){if(!this._editing)return[];let e=this._matchers.find(r=>r.name==="scene"),t=this._matchers.filter(r=>r.toggleable&&this._enabledMatchers.has(r.name));return e?[e,...t]:t}_summary(e){let t=e.rules.length;return t===0?"not configured":`${t} rule${t===1?"":"s"}`}render(){return l`
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
        .dayConfig=${this._dayConfig}
        .availableActions=${this._actions}
        @save-rule=${this._saveRule}
        @cancel-rule=${this._cancelRule}
      ></ambience-rule-editor>
    `}_renderArea(e){let t=this._configs.get(e.area_id);if(!t)return l``;let r=this._expanded.has(e.area_id);return l`
      <li>
        <div
          class="area-header"
          @click=${()=>this._toggleExpand(e.area_id)}
        >
          <span class="chevron ${r?"open":""}">▶</span>
          <span class="area-name">${e.name}</span>
          <span class="area-summary">${this._summary(t)}</span>
        </div>
        ${r?l`
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
    `}};$.styles=f`
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
  `,o([c({attribute:!1})],$.prototype,"hass",2),o([u()],$.prototype,"_areas",2),o([u()],$.prototype,"_matchers",2),o([u()],$.prototype,"_actions",2),o([u()],$.prototype,"_periods",2),o([u()],$.prototype,"_dayConfig",2),o([u()],$.prototype,"_configs",2),o([u()],$.prototype,"_expanded",2),o([u()],$.prototype,"_error",2),o([u()],$.prototype,"_editing",2),o([u()],$.prototype,"_enabledMatchers",2),$=o([g("ambience-areas-list")],$);var P=class extends m{constructor(){super(...arguments);this.matcherName="";this.matcherDescription="";this.enabled=!1}_onToggle(e){let t=e.target.checked;this.dispatchEvent(new CustomEvent("enable-changed",{detail:{enabled:t},bubbles:!0,composed:!0}))}render(){let e=K(this.hass,this.matcherName);return l`
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
    `}};P.styles=f`
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
  `,o([c({attribute:!1})],P.prototype,"hass",2),o([c()],P.prototype,"matcherName",2),o([c()],P.prototype,"matcherDescription",2),o([c({type:Boolean})],P.prototype,"enabled",2),P=o([g("ambience-matcher-card")],P);var Ot=/^[a-z][a-z0-9_]*$/;function jt(s){return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var x=class extends m{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._label=this.initial.label??"",this._def=this.initial}_onLabelInput(e){this._label=e.target.value}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_validate(e){if(!this.existingId){if(!this._label.trim())return"Please enter a name.";if(!e||!Ot.test(e))return"Name must start with a letter.";if(this.takenIds.has(e))return"A period with this name already exists. Choose a different name."}return""}_onSave(){let e=this.existingId??jt(this._label),t=this._validate(e);if(t){this._error=t,this.performUpdate();return}let r={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:e,definition:r},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){let e=this.existingId?`Edit "${this.initial?.label??this.existingId}"`:"Add custom period";return l`
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
    `}};x.styles=f`
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
  `,o([c({attribute:!1})],x.prototype,"hass",2),o([c({attribute:!1})],x.prototype,"existingId",2),o([c({attribute:!1})],x.prototype,"initial",2),o([c({attribute:!1})],x.prototype,"takenIds",2),o([u()],x.prototype,"_label",2),o([u()],x.prototype,"_def",2),o([u()],x.prototype,"_error",2),x=o([g("ambience-period-edit-modal")],x);function ut(s){if(s.kind==="time")return`${String(s.hh).padStart(2,"0")}:${String(s.mm).padStart(2,"0")}`;if(s.offset_min===0)return s.anchor;let i=Math.abs(s.offset_min),e=i%60===0?`${i/60}h`:`${i}m`;return`${s.anchor}${s.offset_min<0?"-":"+"}${e}`}function Ut(s){return`${ut(s.from)} \u2192 ${ut(s.to)}`}var A=class extends m{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await he(this.hass)}_effective(){let e=new Set(this._view.hidden),t=[];for(let[r,n]of Object.entries(this._view.builtins)){if(e.has(r))continue;let a=this._view.custom[r];a?t.push({id:r,defn:a,provenance:"builtin-edited"}):t.push({id:r,defn:n,provenance:"builtin"})}for(let[r,n]of Object.entries(this._view.custom))r in this._view.builtins||t.push({id:r,defn:n,provenance:"custom"});return t}async _saveState(e,t){let r=await et(this.hass,e,t);this._warnings=r.warnings,await this._reload()}_onEdit(e,t){this._modal={mode:"edit",id:e,initial:t}}async _onDelete(e){if(e in this._view.builtins){let r={...this._view.custom};delete r[e],await this._saveState(r,[...this._view.hidden,e])}else{let r={...this._view.custom};delete r[e],await this._saveState(r,this._view.hidden)}}async _onRevertEdited(e){let t={...this._view.custom};delete t[e],await this._saveState(t,this._view.hidden)}async _onRevertHidden(e){await this._saveState(this._view.custom,this._view.hidden.filter(t=>t!==e))}async _onResetAll(){let e=Object.keys(this._view.custom).length,t=this._view.hidden.length,r=`This will clear ${e} custom period(s) and restore ${t} hidden built-in(s). Continue?`;confirm(r)&&(await tt(this.hass),this._warnings=[],await this._reload())}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:t,definition:r}=e.detail,n={...this._view.custom,[t]:r},a=this._view.hidden.filter(d=>d!==t);this._modal={mode:"closed"},await this._saveState(n,a)}_onModalCancel(){this._modal={mode:"closed"}}_renderRow(e){let t=this._view.custom,r=e.provenance==="builtin-edited",n=e.provenance==="custom";return l`
      <div class="row">
        <span class="name">${z(this.hass,e.id,t)}</span>
        <span class="def">${Ut(e.defn)}</span>
        <span class="badge">${e.provenance==="builtin"?"builtin":e.provenance==="builtin-edited"?"builtin, edited":"custom"}</span>
        <span class="actions">
          <button class="icon" title="Edit" @click=${()=>this._onEdit(e.id,e.defn)}>✎</button>
          ${r?l`<button class="icon" title="Revert to default" @click=${()=>this._onRevertEdited(e.id)}>↺</button>`:""}
          ${n||e.provenance==="builtin"||r?l`<button class="icon" title="Delete" @click=${()=>this._onDelete(e.id)}>✕</button>`:""}
        </span>
      </div>
    `}_renderHiddenRow(e){return l`
      <div class="row">
        <span class="name">${z(this.hass,e,{})}</span>
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
    `}};A.styles=f`
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
  `,o([c({attribute:!1})],A.prototype,"hass",2),o([u()],A.prototype,"_view",2),o([u()],A.prototype,"_modal",2),o([u()],A.prototype,"_warnings",2),A=o([g("ambience-time-of-day-config")],A);var R=class extends m{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await pe(this.hass)}async _save(e){this._config=e;let t=await it(this.hass,e.workday_sensor,e.workday_calendar);this._warnings=t.warnings??[]}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=[{name:"workday_sensor",selector:{entity:{domain:"binary_sensor"}}}],t=[{name:"workday_calendar",selector:{entity:{domain:"calendar"}}}];return l`
      <div class="row">
        <label>Workday sensor</label>
        <ha-form
          .hass=${this.hass}
          .schema=${e}
          .data=${{workday_sensor:this._config.workday_sensor??""}}
          @value-changed=${r=>{r.stopPropagation(),this._onSensorChange({detail:{value:r.detail.value?.workday_sensor||null}})}}
        ></ha-form>
      </div>
      <div class="row">
        <label>Workday calendar</label>
        <ha-form
          .hass=${this.hass}
          .schema=${t}
          .data=${{workday_calendar:this._config.workday_calendar??""}}
          @value-changed=${r=>{r.stopPropagation(),this._onCalendarChange({detail:{value:r.detail.value?.workday_calendar||null}})}}
        ></ha-form>
      </div>
      ${this._warnings.length?l`
        <div class="warnings">
          <strong>Warning:</strong> rules now reference unconfigured entities:
          <ul>
            ${this._warnings.map(r=>l`<li>${r.area_id} / "${r.rule_name}" → ${r.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};R.styles=f`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,o([c({attribute:!1})],R.prototype,"hass",2),o([u()],R.prototype,"_config",2),o([u()],R.prototype,"_warnings",2),R=o([g("ambience-day-config")],R);var I=class extends m{constructor(){super(...arguments);this._matchers=[];this._enabled=new Set;this._error=""}async connectedCallback(){super.connectedCallback();try{let[e,t]=await Promise.all([ce(this.hass),ue(this.hass)]);this._matchers=e,this._enabled=new Set(t.enabled)}catch(e){this._error=e.message||String(e)}}async _onToggle(e,t){let r=new Set(this._enabled);t?r.add(e):r.delete(e),this._enabled=r;try{let n=this._matchers.filter(a=>a.toggleable&&r.has(a.name)).map(a=>a.name);await rt(this.hass,n)}catch(n){this._error=n.message||String(n)}}render(){let e=this._matchers.filter(t=>t.toggleable);return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${e.map(t=>l`
        <ambience-matcher-card
          .hass=${this.hass}
          .matcherName=${t.name}
          .matcherDescription=${t.description}
          .enabled=${this._enabled.has(t.name)}
          @enable-changed=${r=>{r.stopPropagation(),this._onToggle(t.name,r.detail.enabled)}}
        >
          ${t.name==="time_of_day"?l`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`:t.name==="day"?l`<ambience-day-config .hass=${this.hass}></ambience-day-config>`:l``}
        </ambience-matcher-card>
      `)}
    `}};I.styles=f`
    :host { display: block; padding: 1rem; max-width: 60rem; margin: 0 auto; }
    .error { color: var(--error-color, #d32f2f); }
  `,o([c({attribute:!1})],I.prototype,"hass",2),o([u()],I.prototype,"_matchers",2),o([u()],I.prototype,"_enabled",2),o([u()],I.prototype,"_error",2),I=o([g("ambience-configuration-view")],I);var q=class extends m{constructor(){super(...arguments);this._view="areas"}connectedCallback(){super.connectedCallback(),M(this)}render(){return l`
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
    `}};q.styles=f`
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
  `,o([c({attribute:!1})],q.prototype,"hass",2),o([u()],q.prototype,"_view",2),q=o([g("ambience-panel")],q);export{q as AmbiencePanel};
