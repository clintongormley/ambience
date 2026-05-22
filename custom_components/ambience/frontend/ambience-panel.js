/* Ambience panel — bundled output. Do not edit by hand. */
var vt=Object.defineProperty;var yt=Object.getOwnPropertyDescriptor;var d=(n,i,e,t)=>{for(var s=t>1?void 0:t?yt(i,e):i,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=(t?a(i,e,s):a(s))||s);return t&&s&&vt(i,e,s),s};var oe=globalThis,le=oe.ShadowRoot&&(oe.ShadyCSS===void 0||oe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,we=Symbol(),Oe=new WeakMap,X=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==we)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(le&&i===void 0){let t=e!==void 0&&e.length===1;t&&(i=Oe.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&Oe.set(e,i))}return i}toString(){return this.cssText}},ze=n=>new X(typeof n=="string"?n:n+"",void 0,we),g=(n,...i)=>{let e=n.length===1?n[0]:i.reduce((t,s,r)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new X(e,n,we)},je=(n,i)=>{if(le)n.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let t=document.createElement("style"),s=oe.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,n.appendChild(t)}},xe=le?n=>n:n=>n instanceof CSSStyleSheet?(i=>{let e="";for(let t of i.cssRules)e+=t.cssText;return ze(e)})(n):n;var{is:bt,defineProperty:$t,getOwnPropertyDescriptor:kt,getOwnPropertyNames:wt,getOwnPropertySymbols:xt,getPrototypeOf:Et}=Object,de=globalThis,Ue=de.trustedTypes,St=Ue?Ue.emptyScript:"",Ct=de.reactiveElementPolyfillSupport,G=(n,i)=>n,Z={toAttribute(n,i){switch(i){case Boolean:n=n?St:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,i){let e=n;switch(i){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},ce=(n,i)=>!bt(n,i),Fe={attribute:!0,type:String,converter:Z,reflect:!1,useDefault:!1,hasChanged:ce};Symbol.metadata??=Symbol("metadata"),de.litPropertyMetadata??=new WeakMap;var P=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=Fe){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(i,t,e);s!==void 0&&$t(this.prototype,i,s)}}static getPropertyDescriptor(i,e,t){let{get:s,set:r}=kt(this.prototype,i)??{get(){return this[e]},set(a){this[e]=a}};return{get:s,set(a){let c=s?.call(this);r?.call(this,a),this.requestUpdate(i,c,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??Fe}static _$Ei(){if(this.hasOwnProperty(G("elementProperties")))return;let i=Et(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(G("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(G("properties"))){let e=this.properties,t=[...wt(e),...xt(e)];for(let s of t)this.createProperty(s,e[s])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let t=new Set(i.flat(1/0).reverse());for(let s of t)e.unshift(xe(s))}else i!==void 0&&e.push(xe(i));return e}static _$Eu(i,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return je(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){let t=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,t);if(s!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:Z).toAttribute(e,t.type);this._$Em=i,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(i,e){let t=this.constructor,s=t._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let r=t.getPropertyOptions(s),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Z;this._$Em=s;let c=a.fromAttribute(e,r.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(i,e,t,s=!1,r){if(i!==void 0){let a=this.constructor;if(s===!1&&(r=this[i]),t??=a.getPropertyOptions(i),!((t.hasChanged??ce)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(i)&&!this.hasAttribute(a._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:s,wrapped:r},a){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,a??e??this[i]),r!==!0||a!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,r]of t){let{wrapped:a}=r,c=this[s];a!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,r,c)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};P.elementStyles=[],P.shadowRootOptions={mode:"open"},P[G("elementProperties")]=new Map,P[G("finalized")]=new Map,Ct?.({ReactiveElement:P}),(de.reactiveElementVersions??=[]).push("2.1.2");var Ae=globalThis,We=n=>n,he=Ae.trustedTypes,Be=he?he.createPolicy("lit-html",{createHTML:n=>n}):void 0,Xe="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,Ge="?"+N,Dt=`<${Ge}>`,F=document,ee=()=>F.createComment(""),te=n=>n===null||typeof n!="object"&&typeof n!="function",Ie=Array.isArray,Pt=n=>Ie(n)||typeof n?.[Symbol.iterator]=="function",Ee=`[ 	
\f\r]`,Q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qe=/-->/g,Ke=/>/g,j=RegExp(`>|${Ee}(?:([^\\s"'>=/]+)(${Ee}*=${Ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ve=/'/g,Je=/"/g,Ze=/^(?:script|style|textarea|title)$/i,Re=n=>(i,...e)=>({_$litType$:n,strings:i,values:e}),l=Re(1),ts=Re(2),ss=Re(3),W=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Ye=new WeakMap,U=F.createTreeWalker(F,129);function Qe(n,i){if(!Ie(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Be!==void 0?Be.createHTML(i):i}var Ht=(n,i)=>{let e=n.length-1,t=[],s,r=i===2?"<svg>":i===3?"<math>":"",a=Q;for(let c=0;c<e;c++){let h=n[c],p,_,y=-1,D=0;for(;D<h.length&&(a.lastIndex=D,_=a.exec(h),_!==null);)D=a.lastIndex,a===Q?_[1]==="!--"?a=qe:_[1]!==void 0?a=Ke:_[2]!==void 0?(Ze.test(_[2])&&(s=RegExp("</"+_[2],"g")),a=j):_[3]!==void 0&&(a=j):a===j?_[0]===">"?(a=s??Q,y=-1):_[1]===void 0?y=-2:(y=a.lastIndex-_[2].length,p=_[1],a=_[3]===void 0?j:_[3]==='"'?Je:Ve):a===Je||a===Ve?a=j:a===qe||a===Ke?a=Q:(a=j,s=void 0);let R=a===j&&n[c+1].startsWith("/>")?" ":"";r+=a===Q?h+Dt:y>=0?(t.push(p),h.slice(0,y)+Xe+h.slice(y)+N+R):h+N+(y===-2?c:R)}return[Qe(n,r+(n[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),t]},se=class n{constructor({strings:i,_$litType$:e},t){let s;this.parts=[];let r=0,a=0,c=i.length-1,h=this.parts,[p,_]=Ht(i,e);if(this.el=n.createElement(p,t),U.currentNode=this.el.content,e===2||e===3){let y=this.el.content.firstChild;y.replaceWith(...y.childNodes)}for(;(s=U.nextNode())!==null&&h.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let y of s.getAttributeNames())if(y.endsWith(Xe)){let D=_[a++],R=s.getAttribute(y).split(N),ae=/([.?@])?(.*)/.exec(D);h.push({type:1,index:r,name:ae[2],strings:R,ctor:ae[1]==="."?Ce:ae[1]==="?"?De:ae[1]==="@"?Pe:J}),s.removeAttribute(y)}else y.startsWith(N)&&(h.push({type:6,index:r}),s.removeAttribute(y));if(Ze.test(s.tagName)){let y=s.textContent.split(N),D=y.length-1;if(D>0){s.textContent=he?he.emptyScript:"";for(let R=0;R<D;R++)s.append(y[R],ee()),U.nextNode(),h.push({type:2,index:++r});s.append(y[D],ee())}}}else if(s.nodeType===8)if(s.data===Ge)h.push({type:2,index:r});else{let y=-1;for(;(y=s.data.indexOf(N,y+1))!==-1;)h.push({type:7,index:r}),y+=N.length-1}r++}}static createElement(i,e){let t=F.createElement("template");return t.innerHTML=i,t}};function V(n,i,e=n,t){if(i===W)return i;let s=t!==void 0?e._$Co?.[t]:e._$Cl,r=te(i)?void 0:i._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(i=V(n,s._$AS(n,i.values),s,t)),i}var Se=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:t}=this._$AD,s=(i?.creationScope??F).importNode(e,!0);U.currentNode=s;let r=U.nextNode(),a=0,c=0,h=t[0];for(;h!==void 0;){if(a===h.index){let p;h.type===2?p=new ie(r,r.nextSibling,this,i):h.type===1?p=new h.ctor(r,h.name,h.strings,this,i):h.type===6&&(p=new He(r,this,i)),this._$AV.push(p),h=t[++c]}a!==h?.index&&(r=U.nextNode(),a++)}return U.currentNode=F,s}p(i){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}},ie=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,t,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=V(this,i,e),te(i)?i===b||i==null||i===""?(this._$AH!==b&&this._$AR(),this._$AH=b):i!==this._$AH&&i!==W&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):Pt(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==b&&te(this._$AH)?this._$AA.nextSibling.data=i:this.T(F.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:t}=i,s=typeof t=="number"?this._$AC(i):(t.el===void 0&&(t.el=se.createElement(Qe(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let r=new Se(s,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(i){let e=Ye.get(i.strings);return e===void 0&&Ye.set(i.strings,e=new se(i)),e}k(i){Ie(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let r of i)s===e.length?e.push(t=new n(this.O(ee()),this.O(ee()),this,this.options)):t=e[s],t._$AI(r),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let t=We(i).nextSibling;We(i).remove(),i=t}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},J=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,t,s,r){this.type=1,this._$AH=b,this._$AN=void 0,this.element=i,this.name=e,this._$AM=s,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=b}_$AI(i,e=this,t,s){let r=this.strings,a=!1;if(r===void 0)i=V(this,i,e,0),a=!te(i)||i!==this._$AH&&i!==W,a&&(this._$AH=i);else{let c=i,h,p;for(i=r[0],h=0;h<r.length-1;h++)p=V(this,c[t+h],e,h),p===W&&(p=this._$AH[h]),a||=!te(p)||p!==this._$AH[h],p===b?i=b:i!==b&&(i+=(p??"")+r[h+1]),this._$AH[h]=p}a&&!s&&this.j(i)}j(i){i===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},Ce=class extends J{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===b?void 0:i}},De=class extends J{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==b)}},Pe=class extends J{constructor(i,e,t,s,r){super(i,e,t,s,r),this.type=5}_$AI(i,e=this){if((i=V(this,i,e,0)??b)===W)return;let t=this._$AH,s=i===b&&t!==b||i.capture!==t.capture||i.once!==t.once||i.passive!==t.passive,r=i!==b&&(t===b||s);s&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},He=class{constructor(i,e,t){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(i){V(this,i)}};var At=Ae.litHtmlPolyfillSupport;At?.(se,ie),(Ae.litHtmlVersions??=[]).push("3.3.2");var et=(n,i,e)=>{let t=e?.renderBefore??i,s=t._$litPart$;if(s===void 0){let r=e?.renderBefore??null;t._$litPart$=s=new ie(i.insertBefore(ee(),r),r,void 0,e??{})}return s._$AI(n),s};var Ne=globalThis,f=class extends P{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=et(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};f._$litElement$=!0,f.finalized=!0,Ne.litElementHydrateSupport?.({LitElement:f});var It=Ne.litElementPolyfillSupport;It?.({LitElement:f});(Ne.litElementVersions??=[]).push("4.2.2");var v=n=>(i,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(n,i)}):customElements.define(n,i)};var Rt={attribute:!0,type:String,converter:Z,reflect:!1,hasChanged:ce},Nt=(n=Rt,i,e)=>{let{kind:t,metadata:s}=e,r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),t==="setter"&&((n=Object.create(n)).wrapped=!0),r.set(e.name,n),t==="accessor"){let{name:a}=e;return{set(c){let h=i.get.call(this);i.set.call(this,c),this.requestUpdate(a,h,n,!0,c)},init(c){return c!==void 0&&this.C(a,void 0,n,c),c}}}if(t==="setter"){let{name:a}=e;return function(c){let h=this[a];i.call(this,c),this.requestUpdate(a,h,n,!0,c)}}throw Error("Unsupported decorator location: "+t)};function u(n){return(i,e)=>typeof e=="object"?Nt(n,i,e):((t,s,r)=>{let a=s.hasOwnProperty(r);return s.constructor.createProperty(r,t),a?Object.getOwnPropertyDescriptor(s,r):void 0})(n,i,e)}function m(n){return u({...n,state:!0,attribute:!1})}function L(n,i,e){let t=n?.localize?.(i);return t&&t!==i?t:e}function Le(n){let i=n.replaceAll("_"," ").toLowerCase();return i.charAt(0).toUpperCase()+i.slice(1)}function Y(n,i){return L(n,`component.ambience.matcher.${i}`,Le(i))}function tt(n,i){return L(n,`component.ambience.action.${i}`,Le(i))}function me(n,i){return L(n,`component.ambience.anchor.${i}`,Le(i))}function B(n,i,e){let t=e[i]?.label;if(t)return t;let s=i.charAt(0).toUpperCase()+i.slice(1);return L(n,`component.ambience.time_of_day_period.${i}`,s)}function o(n,i,e){return L(n,`component.ambience.${i}`,e)}var Lt=["mon","tue","wed","thu","fri","sat","sun"],Mt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function pe(n,i){return L(n,`component.ambience.weekday.${Lt[i]}`,Mt[i]??String(i))}var Tt={weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"};function fe(n,i){return L(n,`component.ambience.day_item.${i}`,Tt[i]??i)}var Ot=["January","February","March","April","May","June","July","August","September","October","November","December"];function st(n,i){return L(n,`component.ambience.month.${i}`,Ot[i-1]??String(i))}var zt=["ha-input","ha-textfield","ha-form"],jt=["ha-input","ha-textfield"];function it(){for(let n of jt)if(customElements.get(n))return n;return null}function M(n,i){for(let e of zt)customElements.get(e)||customElements.whenDefined(e).then(()=>n.requestUpdate())}async function rt(n){return n.callWS({type:"ambience/areas/list"})}async function nt(n,i){return n.callWS({type:"ambience/area/get",area_id:i})}async function at(n,i,e){return n.callWS({type:"ambience/area/save",area_id:i,config:e})}async function _e(n){return n.callWS({type:"ambience/matchers/list"})}async function ot(n){return n.callWS({type:"ambience/actions/list"})}async function ge(n){return n.callWS({type:"ambience/time_of_day_periods/list"})}async function lt(n,i,e){return n.callWS({type:"ambience/time_of_day_periods/save",custom:i,hidden:e})}async function dt(n){return n.callWS({type:"ambience/time_of_day_periods/reset"})}async function ve(n){return n.callWS({type:"ambience/matchers/enabled/list"})}async function ct(n,i){return n.callWS({type:"ambience/matchers/enabled/save",enabled:i})}async function ye(n){return n.callWS({type:"ambience/matchers/day/config/list"})}async function ht(n,i,e){return n.callWS({type:"ambience/matchers/day/config/save",workday_sensor:i,workday_calendar:e})}function be(n,i="New rule"){if(n.name&&n.name.trim())return n.name;let e=n.when?.scene;return typeof e=="string"&&e.trim()?e:i}function $e(n,i,e){return i==null?o(e.hass,"ui.summary_any_paren","(any)"):n==="time_of_day"?ke(i,e):n==="day"?Ut(i,e):String(i)}function Ut(n,i={}){if(n===null)return o(i.hass,"day_summary.any","any");let e=n.include??[],t=n.exclude??[],s=e.length===0?o(i.hass,"day_summary.any_day","any day"):e.map(a=>ut(a,i)).join(", ");if(t.length===0)return s;let r=o(i.hass,"day_summary.except","except");return`${s} (${r} ${t.map(a=>ut(a,i)).join(", ")})`}function ut(n,i){switch(n.kind){case"weekday":return n.days.map(e=>pe(i.hass,e)).join("/");case"day_of_month":return`${o(i.hass,"day_summary.day_prefix","day")} ${n.days}`;case"date":return`${n.month}/${n.day}`;case"date_range":return`${n.from.month}/${n.from.day} \u2192 ${n.to.month}/${n.to.day}`;case"last_day":return o(i.hass,"day_summary.last_day","last day");case"workday":return o(i.hass,"day_summary.workday","workday");case"holiday":return o(i.hass,"day_summary.holiday","holiday");case"first_workday":return o(i.hass,"day_summary.first_workday","first workday");case"last_workday":return o(i.hass,"day_summary.last_workday","last workday")}}function ke(n,i){if(n===null)return o(i.hass,"ui.summary_any","any");let e=Array.isArray(n)?n:[n],t=i.periods?.custom??{};return e.map(s=>"period"in s?B(i.hass,s.period,t):`${mt(s.from,i)} \u2192 ${mt(s.to,i)}`).join(", ")}function mt(n,i){if(n.kind==="time")return`${String(n.hh).padStart(2,"0")}:${String(n.mm).padStart(2,"0")}`;let e=me(i.hass,n.anchor);if(n.offset_min===0)return e;let t=Math.abs(n.offset_min),s=t%60===0?`${t/60}${o(i.hass,"ui.unit_hour_abbr","h")}`:`${t}${o(i.hass,"ui.unit_min_abbr","m")}`;return`${e}${n.offset_min<0?"-":"+"}${s}`}function pt(n,i,e){let t=tt(e.hass,n.action),s=i?.domains?.[0]??o(e.hass,"ui.target_noun","target"),r=n.entity_ids.length,a;r===0?a=o(e.hass,"ui.no_targets","(no targets)"):r===1?a=`1 ${s}`:a=`${r} ${s}s`;let c={};for(let p of i?.target_params??[])p.unit&&(c[p.name]=p.unit);let h=Object.entries(n.params).filter(([,p])=>p!=null&&p!=="").map(([p,_])=>`${p} ${_}${c[p]??""}`).join(", ");return h?`${t}: ${a}, ${h}`:`${t}: ${a}`}var x=class extends f{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_summary(e){let t=Object.keys(e.when).filter(c=>e.when[c]!=null),s=t.length===0?o(this.hass,"ui.summary_any","any"):t.map(c=>`${Y(this.hass,c)}: ${$e(c,e.when[c],{hass:this.hass,periods:this.periods})}`).join(", "),r=e.actions.length,a=r===1?o(this.hass,"ui.action_singular","action"):o(this.hass,"ui.action_plural","actions");return`${s} \xB7 ${r} ${a}`}_onDragStart(e){this._dragFrom=e}_onDragOver(e,t){this._dragFrom===null||t===this._dragFrom||(e.preventDefault(),this._dragOver=t)}_onDrop(e){let t=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(t===null||t===e)&&this._emit("reorder-rules",{from:t,to:e})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(e,t){let s=t.name||o(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(e+1));window.confirm(o(this.hass,"ui.confirm_delete",'Delete "{name}"?').replace("{name}",s))&&this._emit("delete-rule",{index:e})}render(){return this.rules.length===0?l`
        <p class="empty">${o(this.hass,"ui.no_rules_yet","No rules yet.")}</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          ${o(this.hass,"ui.add_rule","+ Add rule")}
        </button>
      `:l`
      <ul>
        ${this.rules.map((e,t)=>l`
            <li
              class=${this._dragOver===t?"drag-over":""}
              draggable=${!this.autoSort}
              @dragstart=${()=>this._onDragStart(t)}
              @dragover=${s=>this._onDragOver(s,t)}
              @drop=${()=>this._onDrop(t)}
              @dragend=${this._onDragEnd}
            >
              ${this.autoSort?"":l`<span class="handle" title=${o(this.hass,"ui.drag_to_reorder","Drag to reorder")}>⠿</span>`}
              <span class="idx">${t+1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${()=>this._emit("edit-rule",{index:t})}
                >
                  ${be(e,o(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(t+1)))}
                </div>
                <div class="summary">${this._summary(e)}</div>
              </div>
              <button
                @click=${()=>this._emit("duplicate-rule",{index:t})}
                title=${o(this.hass,"ui.duplicate","Duplicate")}
              >
                ⧉
              </button>
              <button
                @click=${()=>this._confirmDelete(t,e)}
                title=${o(this.hass,"ui.title_delete","Delete")}
              >
                🗑
              </button>
            </li>
          `)}
      </ul>
      <button class="add" @click=${()=>this._emit("add-rule",{})}>
        ${o(this.hass,"ui.add_rule","+ Add rule")}
      </button>
    `}};x.styles=g`
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
  `,d([u({attribute:!1})],x.prototype,"rules",2),d([u({type:Boolean})],x.prototype,"autoSort",2),d([u({attribute:!1})],x.prototype,"periods",2),d([u({attribute:!1})],x.prototype,"hass",2),d([m()],x.prototype,"_dragFrom",2),d([m()],x.prototype,"_dragOver",2),x=d([v("ambience-rules-list")],x);function ft(n,i,e){if(!n||!n.entities||!i)return[];let t=n.entities,s=n.devices??{};return Object.values(t).filter(r=>!!(r.area_id===i||r.device_id&&s[r.device_id]?.area_id===i)).filter(r=>e.includes(r.entity_id.split(".")[0])).map(r=>r.entity_id).sort()}var S=class extends f{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=e=>{this._open&&(e.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=e=>{e.stopPropagation();let t=e.detail.value?.scene??"";this._emit(t.trim()===""?null:t)};this._sceneComputeLabel=e=>e.name==="scene"?o(this.hass,"ui.scene_name","Scene name"):e.name}connectedCallback(){super.connectedCallback(),M(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(e){e.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(t=>({value:t,label:t})),custom_value:!0,mode:"dropdown"}}}])}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target.value;this._emit(t.trim()===""?null:t),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(e){e.key==="Escape"&&this._open&&(this._open=!1,e.stopPropagation())}_toggle(e){e.preventDefault(),this._open=!this._open}_select(e,t){t.preventDefault(),this._emit(e),this._open=!1}render(){if(customElements.get("ha-form")){let e={scene:this.value??""};return l`
        <ha-form
          .hass=${this.hass}
          .schema=${this._schema}
          .data=${e}
          .computeLabel=${this._sceneComputeLabel}
          @value-changed=${this._onHaFormValueChanged}
        ></ha-form>
      `}return l`
      <div class="control">
        <input
          type="text"
          placeholder=${o(this.hass,"ui.scene_name","Scene name")}
          .value=${this.value??""}
          @input=${this._onInput}
          @focus=${this._onFocus}
          @keydown=${this._onKeyDown}
        />
        <button
          class="toggle"
          type="button"
          tabindex="-1"
          aria-label=${o(this.hass,"ui.show_scene_suggestions","Show scene suggestions")}
          @mousedown=${this._toggle}
        >
          ▼
        </button>
      </div>
      ${this._open?l`
            <div class="menu" role="listbox">
              ${this.suggestions.length===0?l`<div class="empty">
                    ${o(this.hass,"ui.no_scenes_yet","No scenes yet \u2014 type to create one")}
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
    `}};S.styles=g`
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
  `,d([u({attribute:!1})],S.prototype,"hass",2),d([u()],S.prototype,"value",2),d([u({attribute:!1})],S.prototype,"suggestions",2),d([m()],S.prototype,"_schema",2),d([m()],S.prototype,"_open",2),S=d([v("ambience-scene-combobox")],S);var Ft=["dawn","sunrise","noon","sunset","dusk","midnight"],q=class extends f{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onKindChange(e){let t=e.target.value;t!==this.value.kind&&(t==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let t=e.target.value,[s,r]=t.split(":").map(a=>parseInt(a,10));Number.isNaN(s)||Number.isNaN(r)||this._emit({kind:"time",hh:s,mm:r})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let t=e.target.value;this._emit({kind:"sun",anchor:t,offset_min:this.value.offset_min})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let t=parseInt(e.target.value,10);Number.isNaN(t)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:t})}_renderTime(e){let t=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return l`<input type="time" .value=${t} @input=${this._onTimeChange} />`}_renderSun(e){let t=Wt(e.offset_min,this.hass);return l`
      <select @change=${this._onAnchorChange}>
        ${Ft.map(s=>l`<option value=${s} ?selected=${s===e.anchor}>${me(this.hass,s)}</option>`)}
      </select>
      <input
        type="number"
        step="1"
        placeholder=${o(this.hass,"ui.offset_placeholder","\xB1min, e.g. -30")}
        .value=${String(e.offset_min)}
        @input=${this._onOffsetChange}
      />
      <span class="offset-hint">${t}</span>
    `}render(){return l`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>${o(this.hass,"ui.endpoint_time","Time")}</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>${o(this.hass,"ui.endpoint_sun","Sun")}</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};q.styles=g`
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
  `,d([u({attribute:!1})],q.prototype,"hass",2),d([u({attribute:!1})],q.prototype,"value",2),q=d([v("ambience-time-endpoint")],q);function Wt(n,i){if(n===0)return"";let e=Math.abs(n),t=n<0?"\u2212":"+";if(e%60===0){let s=e/60,r=s===1?o(i,"ui.unit_hour","hour"):o(i,"ui.unit_hours","hours");return`${t}${s} ${r}`}return`${t}${e} ${o(i,"ui.unit_min","min")}`}var re={kind:"any"},_t={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},C=class extends f{constructor(){super(...arguments);this.value=null;this._entries=[re];this._openIdx=0}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[re]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(t=>{let s=this._entries[this._openIdx];if(!s)return;let r=s.kind==="any"?"__any__":s.kind==="range"?"__custom__":s.period;t.value!==r&&(t.value=r)})}_predicateToEntries(e){return e===null?[re]:(Array.isArray(e)?e:[e]).map(s=>"period"in s?{kind:"period",period:s.period}:{kind:"range",from:s.from,to:s.to})}_emit(e){let t=e.filter(r=>r.kind!=="any").map(r=>r.kind==="period"?{period:r.period}:{from:r.from,to:r.to}),s=t.length===0?null:t.length===1?t[0]:t;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:s},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let e=Object.keys(this.periods.builtins),t=Object.keys(this.periods.custom).filter(r=>!(r in this.periods.builtins)),s=new Set(this.periods.hidden);return[...e.filter(r=>!s.has(r)),...t]}_onSelectChange(e,t){let s=t.target.value,r=[...this._entries];s==="__any__"?r[e]=re:s==="__custom__"?r[e]={kind:"range",..._t}:r[e]={kind:"period",period:s},this._entries=r,this._emit(r)}_onRangeChange(e,t,s){s.stopPropagation();let r=this._entries[e];if(!r||r.kind!=="range")return;let a=[...this._entries];a[e]={...r,[t]:s.detail.value},this._entries=a,this._emit(a)}_onRemove(e){let t=this._entries.filter((s,r)=>r!==e);this._entries=t.length===0?[re]:t,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",..._t}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,t){let s;return e.kind==="any"?s=o(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?s=ke({period:e.period},{hass:this.hass,periods:this.periods}):s=ke({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),l`
      <div class="summary-chip" @click=${()=>this._onChipClick(t)}>
        <span class="chip-label">${s}</span>
        ${this._entries.length>1?l`<button class="remove" @click=${r=>{r.stopPropagation(),this._onRemove(t)}} title=${o(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,t,s){let r=this._effectiveIds(),a=this.periods?.custom??{};return l`
      <div class="entry">
        <div class="entry-header">
          <select @change=${c=>this._onSelectChange(t,c)}>
            ${s?l`<option value="__any__">${o(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${o(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${r.map(c=>l`<option value=${c}>
                ${B(this.hass,c,a)}${a[c]&&!this.periods?.builtins[c]?o(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?l`<button class="remove" @click=${()=>this._onRemove(t)} title=${o(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${e.kind==="range"?l`
              <div class="range-row">
                <label>${o(this.hass,"ui.from_label","From")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.from}
                  @value-changed=${c=>this._onRangeChange(t,"from",c)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${o(this.hass,"ui.to_label","To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${c=>this._onRangeChange(t,"to",c)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(s=>s.kind!=="any"),t=this._entries.length>1;return l`
      ${this._entries.map((s,r)=>t&&r!==this._openIdx?this._renderChip(s,r):this._renderEntry(s,r,r===0))}
      ${e?l`<button class="add-btn" @click=${this._onAdd}>${o(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};C.styles=g`
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
  `,d([u({attribute:!1})],C.prototype,"value",2),d([u({attribute:!1})],C.prototype,"periods",2),d([u({attribute:!1})],C.prototype,"hass",2),d([m()],C.prototype,"_entries",2),d([m()],C.prototype,"_openIdx",2),C=d([v("ambience-time-of-day-input")],C);var Me=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Bt=new Set(["workday","holiday"]),qt=new Set(["first_workday","last_workday"]),Kt=[31,29,31,30,31,30,31,31,30,31,30,31];function ne(n){return Kt[n-1]??31}function Te(n){switch(n){case"weekday":return{kind:n,days:[]};case"day_of_month":return{kind:n,days:""};case"date":return{kind:n,month:1,day:1};case"date_range":return{kind:n,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:n}}}var T=class extends f{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?o(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return o(this.hass,"ui.field_kind","Kind");case"days":return o(this.hass,"ui.field_days_of_month","Days of month");case"month":return o(this.hass,"ui.field_month","Month");case"day":return o(this.hass,"ui.field_day","Day");case"from_month":return o(this.hass,"ui.field_from_month","From month");case"from_day":return o(this.hass,"ui.field_from_day","From day");case"to_month":return o(this.hass,"ui.field_to_month","To month");case"to_day":return o(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let t=e.include.length===0&&e.exclude.length===0;this.value=t?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_addItem(e,t){let s=this._current();s[e]=[...s[e],Te(t)],this._emit(s)}_removeItem(e,t){let s=this._current();s[e]=s[e].filter((r,a)=>a!==t),this._emit(s)}_updateItem(e,t,s){let r=this._current();r[e]=r[e].map((a,c)=>c===t?s:a),this._emit(r)}_kindDisabled(e){return!!(Bt.has(e)&&!this.dayConfig.workday_sensor||qt.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:Me.map(e=>({value:e,label:fe(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:st(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:ne(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,t){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(t.days??"")}:e}_setDatePart(e,t,s){if(e.kind==="date"){let{month:r,day:a}=e;return t==="month"&&(r=Number(s)),t==="day"&&(a=Number(s)),{kind:"date",month:r,day:Math.min(a,ne(r))}}if(e.kind==="date_range"){let r={...e.from},a={...e.to};return t==="from_month"&&(r.month=Number(s)),t==="from_day"&&(r.day=Number(s)),t==="to_month"&&(a.month=Number(s)),t==="to_day"&&(a.day=Number(s)),r.day=Math.min(r.day,ne(r.month)),a.day=Math.min(a.day,ne(a.month)),{kind:"date_range",from:r,to:a}}return e}_onKindForm(e,t,s){let r=s.kind;if(!r||this._kindDisabled(r))return;let a=this._current()[e][t];a&&a.kind===r||this._updateItem(e,t,Te(r))}_onBodyForm(e,t,s,r){this._updateItem(e,t,this._bodyPatch(s,r))}_renderWeekday(e,t,s){return l`${[0,1,2,3,4,5,6].map(r=>l`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${s.days.includes(r)}
          @change=${a=>{let h=a.target.checked?[...s.days,r].sort((p,_)=>p-_):s.days.filter(p=>p!==r);this._updateItem(e,t,{kind:"weekday",days:h})}}
        />${pe(this.hass,r)}
      </label>
    `)}`}_renderKindPicker(e,t,s){return customElements.get("ha-form")?l`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:s.kind}}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${r=>{r.stopPropagation(),this._onKindForm(e,t,r.detail.value)}}
      ></ha-form>`:l`
      <select
        class="kind"
        .value=${s.kind}
        @change=${r=>{let a=r.target.value;this._kindDisabled(a)||a===s.kind||this._updateItem(e,t,Te(a))}}
      >
        ${Me.map(r=>l`<option value=${r} ?disabled=${this._kindDisabled(r)}>${fe(this.hass,r)}</option>`)}
      </select>
    `}_renderItemBody(e,t,s){if(s.kind==="weekday")return this._renderWeekday(e,t,s);if(customElements.get("ha-form")){if(s.kind==="date")return this._renderDateRow(e,t,s,"month","day",s.month,s.day);if(s.kind==="date_range")return l`
          ${this._renderDateRow(e,t,s,"from_month","from_day",s.from.month,s.from.day)}
          ${this._renderDateRow(e,t,s,"to_month","to_day",s.to.month,s.to.day)}
        `;let r=this._bodySchema(s);return r?l`<ha-form
        .hass=${this.hass}
        .schema=${r}
        .data=${this._bodyData(s)}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${a=>{a.stopPropagation(),this._onBodyForm(e,t,s,a.detail.value)}}
      ></ha-form>`:l``}return this._renderNativeBody(e,t,s)}_renderDateRow(e,t,s,r,a,c,h){let p=(_,y)=>{this._updateItem(e,t,this._setDatePart(s,_,y[_]))};return l`
      <div class="date-row">
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:r,selector:this._monthSelector()}]}
          .data=${{[r]:String(c)}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${_=>{_.stopPropagation(),p(r,_.detail.value)}}
        ></ha-form>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:a,selector:this._daySelector(c)}]}
          .data=${{[a]:h}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${_=>{_.stopPropagation(),p(a,_.detail.value)}}
        ></ha-form>
      </div>
    `}_renderNativeBody(e,t,s){if(s.kind==="day_of_month")return l`<input
        type="text" placeholder=${o(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${s.days}
        @change=${c=>this._updateItem(e,t,this._bodyPatch(s,{days:c.target.value}))}
      />`;let r=(c,h)=>l`
      <input type="number" min="1" max="12" .value=${String(h)}
        @change=${p=>this._updateItem(e,t,this._setDatePart(s,c,p.target.value))} />
    `,a=(c,h,p)=>l`
      <input type="number" min="1" max=${String(ne(h))} .value=${String(p)}
        @change=${_=>this._updateItem(e,t,this._setDatePart(s,c,_.target.value))} />
    `;return s.kind==="date"?l`${r("month",s.month)} / ${a("day",s.month,s.day)}`:s.kind==="date_range"?l`
        <span>${o(this.hass,"ui.from","from")}</span>
        ${r("from_month",s.from.month)} / ${a("from_day",s.from.month,s.from.day)}
        <span>${o(this.hass,"ui.to","to")}</span>
        ${r("to_month",s.to.month)} / ${a("to_day",s.to.month,s.to.day)}
      `:l``}_renderAddPicker(e){let t=e==="include"?o(this.hass,"ui.add_include_item","+ Add include item"):o(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let s=()=>t;return l`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${s}
        @value-changed=${r=>{r.stopPropagation();let a=r.detail.value.kind;a&&!this._kindDisabled(a)&&this._addItem(e,a)}}
      ></ha-form>`}return l`
      <select
        .value=${""}
        @change=${s=>{let r=s.target.value;r&&(this._addItem(e,r),s.target.value="")}}
      >
        <option value="">${t}</option>
        ${Me.map(s=>l`<option value=${s} ?disabled=${this._kindDisabled(s)}>${fe(this.hass,s)}</option>`)}
      </select>
    `}_renderItem(e,t,s){return l`
      <div class="item">
        ${this._renderKindPicker(e,t,s)}
        <div class="body">${this._renderItemBody(e,t,s)}</div>
        <button class="remove" title=${o(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(e,t)}>✕</button>
      </div>
    `}_renderSection(e,t){return l`
      <div class="section">
        <h4>${e==="include"?o(this.hass,"ui.include","Include"):o(this.hass,"ui.exclude","Exclude")}</h4>
        ${t.length===0&&e==="include"?l`<div class="hint">${o(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${t.map((s,r)=>this._renderItem(e,r,s))}
        ${this._renderAddPicker(e)}
      </div>
    `}render(){let{include:e,exclude:t}=this._current();return l`
      ${this._renderSection("include",e)}
      ${this._renderSection("exclude",t)}
    `}};T.styles=g`
    :host { display: block; }
    .section { margin-bottom: 1rem; }
    .section h4 { margin: 0 0 0.5rem 0; font-size: 0.95em; }
    .hint { color: var(--secondary-text-color, #888); font-size: 0.85em; }
    .item {
      display: flex; align-items: flex-start; gap: 0.5rem;
      padding: 0.4rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; margin-bottom: 0.4rem;
      background: var(--card-background-color, #fff);
    }
    .item select, .item input[type="number"], .item input[type="text"] { padding: 0.25rem; }
    .item .kind { min-width: 12rem; }
    .item .body { flex: 1; display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
    .item ha-form { display: block; flex: 1; }
    .date-row {
      display: flex; gap: 0.5rem; align-items: flex-end; width: 100%;
    }
    .date-row ha-form { flex: 1 1 8rem; }
    .remove {
      background: none; border: none; color: var(--secondary-text-color);
      cursor: pointer; font-size: 1em; padding: 0.25rem 0 0 0;
    }
    label.day-pill {
      display: inline-flex; align-items: center; gap: 0.25rem;
      padding: 0.15rem 0.4rem; border-radius: 3px;
      background: var(--secondary-background-color, #f5f5f5);
      cursor: pointer;
    }
  `,d([u({attribute:!1})],T.prototype,"hass",2),d([u({attribute:!1})],T.prototype,"value",2),d([u({attribute:!1})],T.prototype,"dayConfig",2),T=d([v("ambience-day-predicate-input")],T);var E=class extends f{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onText(e){let t=e.target.value;this._emit(t.trim()===""?null:t)}render(){return this.matcher.input==="time_of_day"?l`
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
          .hass=${this.hass}
          .value=${this.value}
          .dayConfig=${this.dayConfig??{workday_sensor:null,workday_calendar:null}}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-day-predicate-input>
      `:l`
      <input
        type="text"
        placeholder=${o(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};E.styles=g`
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
  `,d([u({attribute:!1})],E.prototype,"matcher",2),d([u({attribute:!1})],E.prototype,"value",2),d([u({attribute:!1})],E.prototype,"sceneSuggestions",2),d([u({attribute:!1})],E.prototype,"periods",2),d([u({attribute:!1})],E.prototype,"dayConfig",2),d([u({attribute:!1})],E.prototype,"hass",2),E=d([v("ambience-matcher-input")],E);var O=class extends f{constructor(){super(...arguments);this.entities=[];this.value=[]}connectedCallback(){super.connectedCallback(),M(this,this.hass)}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let e=[{name:"entity_ids",label:"",selector:{entity:{multiple:!0,include_entities:this.entities}}}];return l`
      <ha-form
        .hass=${this.hass}
        .schema=${e}
        .data=${{entity_ids:this.value}}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,t){let s=new Set(this.value);t?s.add(e):s.delete(e),this._emit(this.entities.filter(r=>s.has(r)))}_renderFallback(){return this.entities.length===0?l`<p class="empty">${o(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:l`
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
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};O.styles=g`
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
  `,d([u({attribute:!1})],O.prototype,"hass",2),d([u({attribute:!1})],O.prototype,"entities",2),d([u({attribute:!1})],O.prototype,"value",2),O=d([v("ambience-target-picker")],O);var $=class extends f{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._open=null;this._showError=!1;this._onNameInput=e=>{this._setName(e.target.value)}}connectedCallback(){super.connectedCallback(),M(this,this.hass)}willUpdate(e){e.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null,this._open=null,this._showError=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"}))return l`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
        </div>
      `;let s=be(this._draft,o(this.hass,"ui.new_rule","New rule"));return l`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${s}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let t=it();return t==="ha-input"?l`<ha-input label=${o(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:t==="ha-textfield"?l`<ha-textfield label=${o(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:l`<input type="text" .value=${e} @input=${this._onNameInput} />`}_isOpen(e){return this._open===null?!1:e.kind==="name"&&this._open.kind==="name"?!0:e.kind==="matcher"&&this._open.kind==="matcher"?e.id===this._open.id:e.kind==="action"&&this._open.kind==="action"?e.idx===this._open.idx:!1}_validationError(e){if(e===null||e.kind==="name"||e.kind==="matcher")return null;let t=this._draft?.actions[e.idx];if(!t)return null;if(t.entity_ids.length===0)return o(this.hass,"ui.at_least_one_target","At least one target is required.");let s=this.availableActions.find(r=>r.name===t.action);if(!s)return null;for(let r of s.target_params){if(!r.required)continue;let a=t.params[r.name];if(a==null||a==="")return o(this.hass,"ui.param_required","{param} is required.").replace("{param}",this._paramLabel(r.name))}return null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){this._tryCloseCurrent();return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let t of e.composedPath())if(t instanceof Element&&(t.classList.contains("slot")||t.classList.contains("actions-bar")))return;this._tryCloseCurrent()}_setPredicate(e,t){if(!this._draft)return;let s={...this._draft.when};t==null?delete s[e]:s[e]=t,this._draft={...this._draft,when:s}}_renderMatcherRow(e){let t=this._draft.when[e.name]??null,s=this._isOpen({kind:"matcher",id:e.name}),r=e.input==="scene_combobox";if(s&&r)return l`
        <div class="slot combobox-slot expanded" data-slot-id=${e.name}>
          <ambience-matcher-input
            .hass=${this.hass}
            .matcher=${e}
            .value=${t}
            .sceneSuggestions=${this.sceneSuggestions}
            .periods=${this.periods}
            .dayConfig=${this.dayConfig}
            @value-changed=${c=>this._setPredicate(e.name,c.detail.value)}
          ></ambience-matcher-input>
        </div>
      `;let a=$e(e.name,t,{hass:this.hass,periods:this.periods});return l`
      <div class="slot ${s?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"matcher",id:e.name})}>
          <span class="summary-label"><strong>${Y(this.hass,e.name)}:</strong> ${a}</span>
        </div>
        ${s?l`
          <div class="body">
            <ambience-matcher-input
              .hass=${this.hass}
              .matcher=${e}
              .value=${t}
              .sceneSuggestions=${this.sceneSuggestions}
              .periods=${this.periods}
              .dayConfig=${this.dayConfig}
              @value-changed=${c=>this._setPredicate(e.name,c.detail.value)}
            ></ambience-matcher-input>
          </div>
        `:""}
      </div>
    `}_addActionSlot(){if(!this._draft)return;let e={action:"set_light",entity_ids:[],params:{}},t=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,e]},this._open={kind:"action",idx:t}}_updateActionAt(e,t){if(!this._draft)return;let s=this._draft.actions.map((r,a)=>a===e?t(r):r);this._draft={...this._draft,actions:s}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((t,s)=>s!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,t){this._updateActionAt(e,s=>({...s,entity_ids:t}))}_paramLabel(e){let t=e.replaceAll("_"," ").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}_updateActionParam(e,t,s){this._updateActionAt(e,r=>{let a={...r.params},c=s;if(t.type==="int"?c=s===""?void 0:parseInt(s,10):t.type==="number"?c=s===""?void 0:parseFloat(s):t.type==="boolean"&&(c=s==="true"),typeof c=="number"&&Number.isFinite(c)){let h=c;typeof t.min=="number"&&h<t.min&&(h=t.min),typeof t.max=="number"&&h>t.max&&(h=t.max),c=h}return c===void 0?delete a[t.name]:a[t.name]=c,{...r,params:a}})}_renderActionParams(e,t,s){let r=s?.target_params??[];return l`
      ${r.map(a=>l`
        <div class="param-row">
          <label>${this._paramLabel(a.name)}${a.required?" *":""}</label>
          <div class="param-input">
            <input
              type=${a.type==="int"||a.type==="number"?"number":"text"}
              placeholder=${a.description??""}
              .value=${String(t.params[a.name]??"")}
              min=${a.min??""}
              max=${a.max??""}
              @input=${c=>this._updateActionParam(e,a,c.target.value)}
            />
            ${a.unit?l`<span class="param-unit">${a.unit}</span>`:""}
          </div>
        </div>
      `)}
    `}_renderActionRow(e,t){let s=this.availableActions.find(h=>h.name===e.action),r=this._isOpen({kind:"action",idx:t}),a=pt(e,s,{hass:this.hass}),c=ft(this.hass,this.areaId,s?.domains??[]);return l`
      <div class="slot ${r?"expanded":"collapsed"}" data-slot-id="action-${t}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:t})}>
          <span class="summary-label">${a}</span>
          <button class="remove" @click=${h=>{h.stopPropagation(),this._deleteAction(t)}} title=${o(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${r?l`
          <div class="body">
            <label>${o(this.hass,"ui.target","Target")}</label>
            <ambience-target-picker
              .hass=${this.hass}
              .entities=${c}
              .value=${e.entity_ids}
              @value-changed=${h=>{h.stopPropagation(),this._setActionTargets(t,h.detail.value)}}
            ></ambience-target-picker>

            ${this._renderActionParams(t,e,s)}

            ${this._showError&&this._validationError({kind:"action",idx:t})?l`
              <div class="error">${this._validationError({kind:"action",idx:t})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_save(){this._draft&&this.dispatchEvent(new CustomEvent("save-rule",{detail:this._draft,bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){return this._draft?l`
      <div class="modal" @click=${this._onModalClick}>
        ${this._renderNameSlot()}

        <h3>${o(this.hass,"ui.when_heading","When")}</h3>
        ${this.matchers.map(e=>this._renderMatcherRow(e))}

        <h3>${o(this.hass,"ui.actions_heading","Actions")}</h3>
        ${this._draft.actions.map((e,t)=>this._renderActionRow(e,t))}
        <button class="secondary add-action" @click=${this._addActionSlot}>${o(this.hass,"ui.add_action","+ Add action")}</button>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>${o(this.hass,"ui.cancel","Cancel")}</button>
          <button class="primary" @click=${this._save}>${o(this.hass,"ui.save_rule","Save rule")}</button>
        </div>
      </div>
    `:l``}};$.styles=g`
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
  `,d([u({type:Boolean,reflect:!0})],$.prototype,"open",2),d([u({attribute:!1})],$.prototype,"rule",2),d([u({attribute:!1})],$.prototype,"matchers",2),d([u({attribute:!1})],$.prototype,"sceneSuggestions",2),d([u({attribute:!1})],$.prototype,"periods",2),d([u({attribute:!1})],$.prototype,"dayConfig",2),d([u({attribute:!1})],$.prototype,"availableActions",2),d([u({attribute:!1})],$.prototype,"hass",2),d([u({attribute:!1})],$.prototype,"areaId",2),d([m()],$.prototype,"_draft",2),d([m()],$.prototype,"_open",2),d([m()],$.prototype,"_showError",2),$=d([v("ambience-rule-editor")],$);var k=class extends f{constructor(){super(...arguments);this._areas=[];this._matchers=[];this._actions=[];this._configs=new Map;this._expanded=new Set;this._error="";this._editing=null;this._enabledMatchers=new Set}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await this._refreshAreas(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _loadStatic(){try{let[e,t,s,r,a]=await Promise.all([_e(this.hass),ot(this.hass),ge(this.hass),ve(this.hass),ye(this.hass)]);if(!this.isConnected)return;this._matchers=e,this._actions=t,this._periods=s,this._enabledMatchers=new Set(r.enabled),this._dayConfig=a}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await rt(this.hass),t=new Map;if(await Promise.all(e.map(async s=>{t.set(s.area_id,this._normalize(await nt(this.hass,s.area_id)))})),!this.isConnected)return;this._areas=e,this._configs=t}catch(e){this._error=e.message||String(e)}}_normalize(e){return{rules:e.rules??[],auto_sort:e.auto_sort??!0}}async _subscribe(){let e=await this.hass.connection.subscribeEvents(t=>{if(t.data.action==="remove"){let s=t.data.area_id,r=new Set(this._expanded);r.delete(s),this._expanded=r,this._editing?.areaId===s&&(this._editing=null)}this._refreshAreas()},"area_registry_updated");this.isConnected?this._unsub=e:e()}_setConfig(e,t){let s=new Map(this._configs);s.set(e,t),this._configs=s}async _mutate(e,t){let s=this._configs.get(e);this._setConfig(e,t),this._error="";try{let{config:r}=await at(this.hass,e,t);this._setConfig(e,this._normalize(r))}catch(r){s&&this._setConfig(e,s),this._error=r.message||String(r)}}_toggleExpand(e){let t=new Set(this._expanded);t.has(e)?t.delete(e):t.add(e),this._expanded=t}_toggleAutoSort(e,t){let s=this._configs.get(e);s&&this._mutate(e,{...s,auto_sort:t})}_addRule(e){let t=this._configs.get(e);t&&(this._editing={areaId:e,index:t.rules.length,isNew:!0})}_editRule(e,t){this._editing={areaId:e,index:t.detail.index,isNew:!1}}_duplicateRule(e,t){let s=this._configs.get(e);if(!s)return;let r=s.rules[t.detail.index];if(!r)return;let a=JSON.parse(JSON.stringify(r)),c=[...s.rules];c.splice(t.detail.index+1,0,a),this._mutate(e,{...s,rules:c})}_deleteRule(e,t){let s=this._configs.get(e);if(!s)return;let r=s.rules.filter((a,c)=>c!==t.detail.index);this._mutate(e,{...s,rules:r})}_reorderRules(e,t){let s=this._configs.get(e);if(!s)return;let{from:r,to:a}=t.detail,c=[...s.rules],[h]=c.splice(r,1);c.splice(a,0,h),this._mutate(e,{...s,rules:c})}_saveRule(e){let t=this._editing;if(this._editing=null,!t)return;let s=this._configs.get(t.areaId);if(!s)return;let r=[...s.rules];t.isNew?r.push(e.detail):r[t.index]=e.detail,this._mutate(t.areaId,{...s,rules:r})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._configs.get(this._editing.areaId)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let e=this._configs.get(this._editing.areaId);if(!e)return[];let t=new Set;for(let s of e.rules){let r=s.when.scene;typeof r=="string"&&r&&t.add(r)}return[...t].sort((s,r)=>s.toLowerCase().localeCompare(r.toLowerCase()))}get _editorMatchers(){if(!this._editing)return[];let e=this._matchers.find(s=>s.name==="scene"),t=this._matchers.filter(s=>s.toggleable&&this._enabledMatchers.has(s.name));return e?[e,...t]:t}_summary(e){let t=e.rules.length;if(t===0)return o(this.hass,"ui.not_configured","not configured");let s=t===1?o(this.hass,"ui.rule_singular","rule"):o(this.hass,"ui.rule_plural","rules");return`${t} ${s}`}render(){return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?l`<p class="empty">${o(this.hass,"ui.no_areas","No areas found in Home Assistant.")}</p>`:l`<ul>
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
    `}_renderArea(e){let t=this._configs.get(e.area_id);if(!t)return l``;let s=this._expanded.has(e.area_id);return l`
      <li>
        <div
          class="area-header"
          @click=${()=>this._toggleExpand(e.area_id)}
        >
          <span class="chevron ${s?"open":""}">▶</span>
          <span class="area-name">${e.name}</span>
          <span class="area-summary">${this._summary(t)}</span>
        </div>
        ${s?l`
              <div class="area-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!t.auto_sort}
                    @change=${r=>this._toggleAutoSort(e.area_id,!r.target.checked)}
                  />
                  ${o(this.hass,"ui.order_rules_manually","Order rules manually")}
                </label>
                <ambience-rules-list
                  .rules=${t.rules}
                  .autoSort=${t.auto_sort}
                  .periods=${this._periods}
                  .hass=${this.hass}
                  @add-rule=${()=>this._addRule(e.area_id)}
                  @edit-rule=${r=>this._editRule(e.area_id,r)}
                  @duplicate-rule=${r=>this._duplicateRule(e.area_id,r)}
                  @delete-rule=${r=>this._deleteRule(e.area_id,r)}
                  @reorder-rules=${r=>this._reorderRules(e.area_id,r)}
                ></ambience-rules-list>
              </div>
            `:""}
      </li>
    `}};k.styles=g`
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
  `,d([u({attribute:!1})],k.prototype,"hass",2),d([m()],k.prototype,"_areas",2),d([m()],k.prototype,"_matchers",2),d([m()],k.prototype,"_actions",2),d([m()],k.prototype,"_periods",2),d([m()],k.prototype,"_dayConfig",2),d([m()],k.prototype,"_configs",2),d([m()],k.prototype,"_expanded",2),d([m()],k.prototype,"_error",2),d([m()],k.prototype,"_editing",2),d([m()],k.prototype,"_enabledMatchers",2),k=d([v("ambience-areas-list")],k);var H=class extends f{constructor(){super(...arguments);this.matcherName="";this.matcherDescription="";this.enabled=!1}_onToggle(e){let t=e.target.checked;this.dispatchEvent(new CustomEvent("enable-changed",{detail:{enabled:t},bubbles:!0,composed:!0}))}render(){let e=Y(this.hass,this.matcherName);return l`
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
    `}};H.styles=g`
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
  `,d([u({attribute:!1})],H.prototype,"hass",2),d([u()],H.prototype,"matcherName",2),d([u()],H.prototype,"matcherDescription",2),d([u({type:Boolean})],H.prototype,"enabled",2),H=d([v("ambience-matcher-card")],H);var Vt=/^[a-z][a-z0-9_]*$/;function Jt(n){return n.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var w=class extends f{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._label=this.initial.label??"",this._def=this.initial}_onLabelInput(e){this._label=e.target.value}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_validate(e){if(!this.existingId){if(!this._label.trim())return o(this.hass,"ui.error_enter_name","Please enter a name.");if(!e)return o(this.hass,"ui.error_start_letter","Name must start with a letter.");if(!Vt.test(e))return o(this.hass,"ui.error_start_letter","Name must start with a letter.");if(this.takenIds.has(e))return o(this.hass,"ui.error_name_exists","A period with this name already exists. Choose a different name.")}return""}_onSave(){let e=this.existingId??Jt(this._label),t=this._validate(e);if(t){this._error=t,this.performUpdate();return}let s={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:e,definition:s},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){let e=this.existingId?o(this.hass,"ui.period_modal_edit_title",'Edit "{name}"').replace("{name}",this.initial?.label??this.existingId):o(this.hass,"ui.period_modal_add_title","Add custom period");return l`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <div class="field">
          <label for="label">${o(this.hass,"ui.name","Name")}</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput} placeholder=${o(this.hass,"ui.name_placeholder","e.g. Wind down")} />
        </div>
        <div class="row">
          <label style="min-width: 3em;">${o(this.hass,"ui.from_label","From")}</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
        </div>
        <div class="row">
          <label style="min-width: 3em;">${o(this.hass,"ui.to_label","To")}</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
        </div>
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>${o(this.hass,"ui.cancel","Cancel")}</button>
          <button @click=${this._onSave}>${o(this.hass,"ui.save","Save")}</button>
        </div>
      </div>
    `}};w.styles=g`
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
  `,d([u({attribute:!1})],w.prototype,"hass",2),d([u({attribute:!1})],w.prototype,"existingId",2),d([u({attribute:!1})],w.prototype,"initial",2),d([u({attribute:!1})],w.prototype,"takenIds",2),d([m()],w.prototype,"_label",2),d([m()],w.prototype,"_def",2),d([m()],w.prototype,"_error",2),w=d([v("ambience-period-edit-modal")],w);function gt(n,i){if(n.kind==="time")return`${String(n.hh).padStart(2,"0")}:${String(n.mm).padStart(2,"0")}`;if(n.offset_min===0)return n.anchor;let e=Math.abs(n.offset_min),t=e%60===0?`${e/60}${o(i,"ui.unit_hour_abbr","h")}`:`${e}${o(i,"ui.unit_min_abbr","m")}`;return`${n.anchor}${n.offset_min<0?"-":"+"}${t}`}function Yt(n,i){return`${gt(n.from,i)} \u2192 ${gt(n.to,i)}`}var A=class extends f{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await ge(this.hass)}_effective(){let e=new Set(this._view.hidden),t=[];for(let[s,r]of Object.entries(this._view.builtins)){if(e.has(s))continue;let a=this._view.custom[s];a?t.push({id:s,defn:a,provenance:"builtin-edited"}):t.push({id:s,defn:r,provenance:"builtin"})}for(let[s,r]of Object.entries(this._view.custom))s in this._view.builtins||t.push({id:s,defn:r,provenance:"custom"});return t}async _saveState(e,t){let s=await lt(this.hass,e,t);this._warnings=s.warnings,await this._reload()}_onEdit(e,t){this._modal={mode:"edit",id:e,initial:t}}async _onDelete(e){if(e in this._view.builtins){let s={...this._view.custom};delete s[e],await this._saveState(s,[...this._view.hidden,e])}else{let s={...this._view.custom};delete s[e],await this._saveState(s,this._view.hidden)}}async _onRevertEdited(e){let t={...this._view.custom};delete t[e],await this._saveState(t,this._view.hidden)}async _onRevertHidden(e){await this._saveState(this._view.custom,this._view.hidden.filter(t=>t!==e))}async _onResetAll(){let e=Object.keys(this._view.custom).length,t=this._view.hidden.length,s=o(this.hass,"ui.reset_confirm","This will clear {custom} custom period(s) and restore {hidden} hidden built-in(s). Continue?").replace("{custom}",String(e)).replace("{hidden}",String(t));confirm(s)&&(await dt(this.hass),this._warnings=[],await this._reload())}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:t,definition:s}=e.detail,r={...this._view.custom,[t]:s},a=this._view.hidden.filter(c=>c!==t);this._modal={mode:"closed"},await this._saveState(r,a)}_onModalCancel(){this._modal={mode:"closed"}}_renderRow(e){let t=this._view.custom,s=e.provenance==="builtin-edited",r=e.provenance==="custom";return l`
      <div class="row">
        <span class="name">${B(this.hass,e.id,t)}</span>
        <span class="def">${Yt(e.defn,this.hass)}</span>
        <span class="badge">${e.provenance==="builtin"?o(this.hass,"ui.badge_builtin","builtin"):e.provenance==="builtin-edited"?o(this.hass,"ui.badge_builtin_edited","builtin, edited"):o(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${o(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e.id,e.defn)}>✎</button>
          ${s?l`<button class="icon" title=${o(this.hass,"ui.title_revert","Revert to default")} @click=${()=>this._onRevertEdited(e.id)}>↺</button>`:""}
          ${r||e.provenance==="builtin"||s?l`<button class="icon" title=${o(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e.id)}>✕</button>`:""}
        </span>
      </div>
    `}_renderHiddenRow(e){return l`
      <div class="row">
        <span class="name">${B(this.hass,e,{})}</span>
        <span class="def">${o(this.hass,"ui.hidden_marker","(hidden)")}</span>
        <span class="badge">${o(this.hass,"ui.badge_hidden","hidden")}</span>
        <span class="actions">
          <button class="icon" title=${o(this.hass,"ui.title_restore","Restore")} @click=${()=>this._onRevertHidden(e)}>↺</button>
        </span>
      </div>
    `}render(){let e=this._effective();return l`
      <header>
        <h2>${o(this.hass,"ui.periods_heading","Periods")}</h2>
        <button @click=${this._onResetAll}>${o(this.hass,"ui.reset_all_to_defaults","Reset all to defaults")}</button>
      </header>
      ${this._warnings.length?l`<div class="warnings">
            <strong>${o(this.hass,"ui.period_warning_prefix","Warning:")}</strong> ${o(this.hass,"ui.period_warning_text","some rules now reference missing periods:")}
            <ul>
              ${this._warnings.map(t=>l`<li>${t.area_id} / "${t.rule_name}" → ${t.missing_period}</li>`)}
            </ul>
          </div>`:""}
      ${e.map(t=>this._renderRow(t))}
      ${this._view.hidden.map(t=>this._renderHiddenRow(t))}
      <button class="add" @click=${this._onAdd}>${o(this.hass,"ui.add_custom_period","+ Add custom period")}</button>
      ${this._modal.mode==="edit"?l`<ambience-period-edit-modal
            .hass=${this.hass}
            .existingId=${this._modal.id}
            .initial=${this._modal.initial}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:this._modal.mode==="add"?l`<ambience-period-edit-modal
            .hass=${this.hass}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:""}
    `}};A.styles=g`
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
  `,d([u({attribute:!1})],A.prototype,"hass",2),d([m()],A.prototype,"_view",2),d([m()],A.prototype,"_modal",2),d([m()],A.prototype,"_warnings",2),A=d([v("ambience-time-of-day-config")],A);var z=class extends f{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await ye(this.hass)}async _save(e){this._config=e;let t=await ht(this.hass,e.workday_sensor,e.workday_calendar);this._warnings=t.warnings??[]}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=[{name:"workday_sensor",selector:{entity:{domain:"binary_sensor"}}}],t=[{name:"workday_calendar",selector:{entity:{domain:"calendar"}}}];return l`
      <div class="row">
        <label>${o(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${e}
          .data=${{workday_sensor:this._config.workday_sensor??""}}
          @value-changed=${s=>{s.stopPropagation(),this._onSensorChange({detail:{value:s.detail.value?.workday_sensor||null}})}}
        ></ha-form>
      </div>
      <div class="row">
        <label>${o(this.hass,"ui.workday_calendar","Workday calendar")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${t}
          .data=${{workday_calendar:this._config.workday_calendar??""}}
          @value-changed=${s=>{s.stopPropagation(),this._onCalendarChange({detail:{value:s.detail.value?.workday_calendar||null}})}}
        ></ha-form>
      </div>
      ${this._warnings.length?l`
        <div class="warnings">
          <strong>${o(this.hass,"ui.day_warning_prefix","Warning:")}</strong> ${o(this.hass,"ui.day_warning_text","rules now reference unconfigured entities:")}
          <ul>
            ${this._warnings.map(s=>l`<li>${s.area_id} / "${s.rule_name}" → ${s.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};z.styles=g`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,d([u({attribute:!1})],z.prototype,"hass",2),d([m()],z.prototype,"_config",2),d([m()],z.prototype,"_warnings",2),z=d([v("ambience-day-config")],z);var I=class extends f{constructor(){super(...arguments);this._matchers=[];this._enabled=new Set;this._error=""}async connectedCallback(){super.connectedCallback();try{let[e,t]=await Promise.all([_e(this.hass),ve(this.hass)]);this._matchers=e,this._enabled=new Set(t.enabled)}catch(e){this._error=e.message||String(e)}}async _onToggle(e,t){let s=new Set(this._enabled);t?s.add(e):s.delete(e),this._enabled=s;try{let r=this._matchers.filter(a=>a.toggleable&&s.has(a.name)).map(a=>a.name);await ct(this.hass,r)}catch(r){this._error=r.message||String(r)}}render(){let e=this._matchers.filter(t=>t.toggleable);return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${e.map(t=>l`
        <ambience-matcher-card
          .hass=${this.hass}
          .matcherName=${t.name}
          .matcherDescription=${t.description}
          .enabled=${this._enabled.has(t.name)}
          @enable-changed=${s=>{s.stopPropagation(),this._onToggle(t.name,s.detail.enabled)}}
        >
          ${t.name==="time_of_day"?l`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`:t.name==="day"?l`<ambience-day-config .hass=${this.hass}></ambience-day-config>`:l``}
        </ambience-matcher-card>
      `)}
    `}};I.styles=g`
    :host { display: block; padding: 1rem; max-width: 60rem; margin: 0 auto; }
    .error { color: var(--error-color, #d32f2f); }
  `,d([u({attribute:!1})],I.prototype,"hass",2),d([m()],I.prototype,"_matchers",2),d([m()],I.prototype,"_enabled",2),d([m()],I.prototype,"_error",2),I=d([v("ambience-configuration-view")],I);var K=class extends f{constructor(){super(...arguments);this._view="areas"}connectedCallback(){super.connectedCallback(),M(this)}render(){return l`
      <header>
        <h1>${o(this.hass,"ui.panel_title","Ambience")}</h1>
        <nav>
          <button
            class=${this._view==="areas"?"active":""}
            @click=${()=>{this._view="areas"}}
          >${o(this.hass,"ui.tab_areas","Areas")}</button>
          <button
            class=${this._view==="configuration"?"active":""}
            @click=${()=>{this._view="configuration"}}
          >${o(this.hass,"ui.tab_configuration","Configuration")}</button>
        </nav>
      </header>
      ${this._view==="areas"?l`<ambience-areas-list .hass=${this.hass}></ambience-areas-list>`:l`<ambience-configuration-view .hass=${this.hass}></ambience-configuration-view>`}
    `}};K.styles=g`
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
  `,d([u({attribute:!1})],K.prototype,"hass",2),d([m()],K.prototype,"_view",2),K=d([v("ambience-panel")],K);export{K as AmbiencePanel};
