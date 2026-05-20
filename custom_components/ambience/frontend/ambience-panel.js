/* Ambience panel — bundled output. Do not edit by hand. */
var _t=Object.defineProperty;var gt=Object.getOwnPropertyDescriptor;var l=(n,s,e,t)=>{for(var i=t>1?void 0:t?gt(s,e):s,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=(t?a(s,e,i):a(i))||i);return t&&i&&_t(s,e,i),i};var ae=globalThis,oe=ae.ShadowRoot&&(ae.ShadyCSS===void 0||ae.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$e=Symbol(),Ne=new WeakMap,X=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==$e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(oe&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=Ne.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&Ne.set(e,s))}return s}toString(){return this.cssText}},Re=n=>new X(typeof n=="string"?n:n+"",void 0,$e),_=(n,...s)=>{let e=n.length===1?n[0]:s.reduce((t,i,r)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new X(e,n,$e)},Le=(n,s)=>{if(oe)n.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),i=ae.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,n.appendChild(t)}},we=oe?n=>n:n=>n instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return Re(e)})(n):n;var{is:vt,defineProperty:yt,getOwnPropertyDescriptor:bt,getOwnPropertyNames:$t,getOwnPropertySymbols:wt,getPrototypeOf:kt}=Object,le=globalThis,Oe=le.trustedTypes,xt=Oe?Oe.emptyScript:"",Et=le.reactiveElementPolyfillSupport,G=(n,s)=>n,Z={toAttribute(n,s){switch(s){case Boolean:n=n?xt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,s){let e=n;switch(s){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},de=(n,s)=>!vt(n,s),ze={attribute:!0,type:String,converter:Z,reflect:!1,useDefault:!1,hasChanged:de};Symbol.metadata??=Symbol("metadata"),le.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=ze){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(s,t,e);i!==void 0&&yt(this.prototype,s,i)}}static getPropertyDescriptor(s,e,t){let{get:i,set:r}=bt(this.prototype,s)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let c=i?.call(this);r?.call(this,a),this.requestUpdate(s,c,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??ze}static _$Ei(){if(this.hasOwnProperty(G("elementProperties")))return;let s=kt(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(G("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(G("properties"))){let e=this.properties,t=[...$t(e),...wt(e)];for(let i of t)this.createProperty(i,e[i])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let i of t)e.unshift(we(i))}else s!==void 0&&e.push(we(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Le(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),i=this.constructor._$Eu(s,t);if(i!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:Z).toAttribute(e,t.type);this._$Em=s,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(s,e){let t=this.constructor,i=t._$Eh.get(s);if(i!==void 0&&this._$Em!==i){let r=t.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Z;this._$Em=i;let c=a.fromAttribute(e,r.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(s,e,t,i=!1,r){if(s!==void 0){let a=this.constructor;if(i===!1&&(r=this[s]),t??=a.getPropertyOptions(s),!((t.hasChanged??de)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(s)&&!this.hasAttribute(a._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:i,wrapped:r},a){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,a??e??this[s]),r!==!0||a!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),i===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,r]of t){let{wrapped:a}=r,c=this[i];a!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,r,c)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[G("elementProperties")]=new Map,A[G("finalized")]=new Map,Et?.({ReactiveElement:A}),(le.reactiveElementVersions??=[]).push("2.1.2");var Ae=globalThis,je=n=>n,ce=Ae.trustedTypes,Ue=ce?ce.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ke="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,Je="?"+M,Ct=`<${Je}>`,U=document,ee=()=>U.createComment(""),te=n=>n===null||typeof n!="object"&&typeof n!="function",Pe=Array.isArray,St=n=>Pe(n)||typeof n?.[Symbol.iterator]=="function",ke=`[ 	
\f\r]`,Q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Fe=/-->/g,We=/>/g,z=RegExp(`>|${ke}(?:([^\\s"'>=/]+)(${ke}*=${ke}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),qe=/'/g,Be=/"/g,Ye=/^(?:script|style|textarea|title)$/i,Ie=n=>(s,...e)=>({_$litType$:n,strings:s,values:e}),d=Ie(1),Gt=Ie(2),Zt=Ie(3),F=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Ve=new WeakMap,j=U.createTreeWalker(U,129);function Xe(n,s){if(!Pe(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ue!==void 0?Ue.createHTML(s):s}var Ht=(n,s)=>{let e=n.length-1,t=[],i,r=s===2?"<svg>":s===3?"<math>":"",a=Q;for(let c=0;c<e;c++){let u=n[c],p,y,v=-1,H=0;for(;H<u.length&&(a.lastIndex=H,y=a.exec(u),y!==null);)H=a.lastIndex,a===Q?y[1]==="!--"?a=Fe:y[1]!==void 0?a=We:y[2]!==void 0?(Ye.test(y[2])&&(i=RegExp("</"+y[2],"g")),a=z):y[3]!==void 0&&(a=z):a===z?y[0]===">"?(a=i??Q,v=-1):y[1]===void 0?v=-2:(v=a.lastIndex-y[2].length,p=y[1],a=y[3]===void 0?z:y[3]==='"'?Be:qe):a===Be||a===qe?a=z:a===Fe||a===We?a=Q:(a=z,i=void 0);let T=a===z&&n[c+1].startsWith("/>")?" ":"";r+=a===Q?u+Ct:v>=0?(t.push(p),u.slice(0,v)+Ke+u.slice(v)+M+T):u+M+(v===-2?c:T)}return[Xe(n,r+(n[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},se=class n{constructor({strings:s,_$litType$:e},t){let i;this.parts=[];let r=0,a=0,c=s.length-1,u=this.parts,[p,y]=Ht(s,e);if(this.el=n.createElement(p,t),j.currentNode=this.el.content,e===2||e===3){let v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(i=j.nextNode())!==null&&u.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let v of i.getAttributeNames())if(v.endsWith(Ke)){let H=y[a++],T=i.getAttribute(v).split(M),ne=/([.?@])?(.*)/.exec(H);u.push({type:1,index:r,name:ne[2],strings:T,ctor:ne[1]==="."?Ee:ne[1]==="?"?Ce:ne[1]==="@"?Se:J}),i.removeAttribute(v)}else v.startsWith(M)&&(u.push({type:6,index:r}),i.removeAttribute(v));if(Ye.test(i.tagName)){let v=i.textContent.split(M),H=v.length-1;if(H>0){i.textContent=ce?ce.emptyScript:"";for(let T=0;T<H;T++)i.append(v[T],ee()),j.nextNode(),u.push({type:2,index:++r});i.append(v[H],ee())}}}else if(i.nodeType===8)if(i.data===Je)u.push({type:2,index:r});else{let v=-1;for(;(v=i.data.indexOf(M,v+1))!==-1;)u.push({type:7,index:r}),v+=M.length-1}r++}}static createElement(s,e){let t=U.createElement("template");return t.innerHTML=s,t}};function K(n,s,e=n,t){if(s===F)return s;let i=t!==void 0?e._$Co?.[t]:e._$Cl,r=te(s)?void 0:s._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(s=K(n,i._$AS(n,s.values),i,t)),s}var xe=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,i=(s?.creationScope??U).importNode(e,!0);j.currentNode=i;let r=j.nextNode(),a=0,c=0,u=t[0];for(;u!==void 0;){if(a===u.index){let p;u.type===2?p=new ie(r,r.nextSibling,this,s):u.type===1?p=new u.ctor(r,u.name,u.strings,this,s):u.type===6&&(p=new He(r,this,s)),this._$AV.push(p),u=t[++c]}a!==u?.index&&(r=j.nextNode(),a++)}return j.currentNode=U,i}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},ie=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=K(this,s,e),te(s)?s===b||s==null||s===""?(this._$AH!==b&&this._$AR(),this._$AH=b):s!==this._$AH&&s!==F&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):St(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==b&&te(this._$AH)?this._$AA.nextSibling.data=s:this.T(U.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,i=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=se.createElement(Xe(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new xe(i,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(s){let e=Ve.get(s.strings);return e===void 0&&Ve.set(s.strings,e=new se(s)),e}k(s){Pe(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let r of s)i===e.length?e.push(t=new n(this.O(ee()),this.O(ee()),this,this.options)):t=e[i],t._$AI(r),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=je(s).nextSibling;je(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},J=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,i,r){this.type=1,this._$AH=b,this._$AN=void 0,this.element=s,this.name=e,this._$AM=i,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=b}_$AI(s,e=this,t,i){let r=this.strings,a=!1;if(r===void 0)s=K(this,s,e,0),a=!te(s)||s!==this._$AH&&s!==F,a&&(this._$AH=s);else{let c=s,u,p;for(s=r[0],u=0;u<r.length-1;u++)p=K(this,c[t+u],e,u),p===F&&(p=this._$AH[u]),a||=!te(p)||p!==this._$AH[u],p===b?s=b:s!==b&&(s+=(p??"")+r[u+1]),this._$AH[u]=p}a&&!i&&this.j(s)}j(s){s===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},Ee=class extends J{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===b?void 0:s}},Ce=class extends J{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==b)}},Se=class extends J{constructor(s,e,t,i,r){super(s,e,t,i,r),this.type=5}_$AI(s,e=this){if((s=K(this,s,e,0)??b)===F)return;let t=this._$AH,i=s===b&&t!==b||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,r=s!==b&&(t===b||i);i&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},He=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){K(this,s)}};var At=Ae.litHtmlPolyfillSupport;At?.(se,ie),(Ae.litHtmlVersions??=[]).push("3.3.2");var Ge=(n,s,e)=>{let t=e?.renderBefore??s,i=t._$litPart$;if(i===void 0){let r=e?.renderBefore??null;t._$litPart$=i=new ie(s.insertBefore(ee(),r),r,void 0,e??{})}return i._$AI(n),i};var De=globalThis,f=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=Ge(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};f._$litElement$=!0,f.finalized=!0,De.litElementHydrateSupport?.({LitElement:f});var Pt=De.litElementPolyfillSupport;Pt?.({LitElement:f});(De.litElementVersions??=[]).push("4.2.2");var g=n=>(s,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(n,s)}):customElements.define(n,s)};var It={attribute:!0,type:String,converter:Z,reflect:!1,hasChanged:de},Dt=(n=It,s,e)=>{let{kind:t,metadata:i}=e,r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),t==="setter"&&((n=Object.create(n)).wrapped=!0),r.set(e.name,n),t==="accessor"){let{name:a}=e;return{set(c){let u=s.get.call(this);s.set.call(this,c),this.requestUpdate(a,u,n,!0,c)},init(c){return c!==void 0&&this.C(a,void 0,n,c),c}}}if(t==="setter"){let{name:a}=e;return function(c){let u=this[a];s.call(this,c),this.requestUpdate(a,u,n,!0,c)}}throw Error("Unsupported decorator location: "+t)};function h(n){return(s,e)=>typeof e=="object"?Dt(n,s,e):((t,i,r)=>{let a=i.hasOwnProperty(r);return i.constructor.createProperty(r,t),a?Object.getOwnPropertyDescriptor(i,r):void 0})(n,s,e)}function m(n){return h({...n,state:!0,attribute:!1})}function W(n,s,e){let t=n?.localize?.(s);return t&&t!==s?t:e}function Te(n){let s=n.replaceAll("_"," ").toLowerCase();return s.charAt(0).toUpperCase()+s.slice(1)}function Y(n,s){return W(n,`component.ambience.matcher.${s}`,Te(s))}function Ze(n,s){return W(n,`component.ambience.action.${s}`,Te(s))}function ue(n,s){return W(n,`component.ambience.anchor.${s}`,Te(s))}function q(n,s,e){let t=e[s]?.label;if(t)return t;let i=s.charAt(0).toUpperCase()+s.slice(1);return W(n,`component.ambience.time_of_day_period.${s}`,i)}function o(n,s,e){return W(n,`component.ambience.${s}`,e)}var Tt=["mon","tue","wed","thu","fri","sat","sun"],Mt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function pe(n,s){return W(n,`component.ambience.weekday.${Tt[s]}`,Mt[s]??String(s))}var Nt={weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"};function Me(n,s){return W(n,`component.ambience.day_item.${s}`,Nt[s]??s)}var Rt=["ha-input","ha-textfield","ha-form"],Lt=["ha-input","ha-textfield"];function Qe(){for(let n of Lt)if(customElements.get(n))return n;return null}function N(n,s){for(let e of Rt)customElements.get(e)||customElements.whenDefined(e).then(()=>n.requestUpdate())}async function et(n){return n.callWS({type:"ambience/areas/list"})}async function tt(n,s){return n.callWS({type:"ambience/area/get",area_id:s})}async function st(n,s,e){return n.callWS({type:"ambience/area/save",area_id:s,config:e})}async function me(n){return n.callWS({type:"ambience/matchers/list"})}async function it(n){return n.callWS({type:"ambience/actions/list"})}async function fe(n){return n.callWS({type:"ambience/time_of_day_periods/list"})}async function rt(n,s,e){return n.callWS({type:"ambience/time_of_day_periods/save",custom:s,hidden:e})}async function nt(n){return n.callWS({type:"ambience/time_of_day_periods/reset"})}async function _e(n){return n.callWS({type:"ambience/matchers/enabled/list"})}async function at(n,s){return n.callWS({type:"ambience/matchers/enabled/save",enabled:s})}async function ge(n){return n.callWS({type:"ambience/matchers/day/config/list"})}async function ot(n,s,e){return n.callWS({type:"ambience/matchers/day/config/save",workday_sensor:s,workday_calendar:e})}function ve(n,s="New rule"){if(n.name&&n.name.trim())return n.name;let e=n.when?.scene;return typeof e=="string"&&e.trim()?e:s}function ye(n,s,e){return s==null?o(e.hass,"ui.summary_any_paren","(any)"):n==="time_of_day"?be(s,e):n==="day"?Ot(s,e):String(s)}function Ot(n,s={}){if(n===null)return o(s.hass,"day_summary.any","any");let e=n.include??[],t=n.exclude??[],i=e.length===0?o(s.hass,"day_summary.any_day","any day"):e.map(a=>lt(a,s)).join(", ");if(t.length===0)return i;let r=o(s.hass,"day_summary.except","except");return`${i} (${r} ${t.map(a=>lt(a,s)).join(", ")})`}function lt(n,s){switch(n.kind){case"weekday":return n.days.map(e=>pe(s.hass,e)).join("/");case"day_of_month":return`${o(s.hass,"day_summary.day_prefix","day")} ${n.days.join(",")}`;case"date":return`${n.month}/${n.day}`;case"date_range":return`${n.from.month}/${n.from.day} \u2192 ${n.to.month}/${n.to.day}`;case"last_day":return o(s.hass,"day_summary.last_day","last day");case"workday":return o(s.hass,"day_summary.workday","workday");case"holiday":return o(s.hass,"day_summary.holiday","holiday");case"first_workday":return o(s.hass,"day_summary.first_workday","first workday");case"last_workday":return o(s.hass,"day_summary.last_workday","last workday")}}function be(n,s){if(n===null)return o(s.hass,"ui.summary_any","any");let e=Array.isArray(n)?n:[n],t=s.periods?.custom??{};return e.map(i=>"period"in i?q(s.hass,i.period,t):`${dt(i.from,s)} \u2192 ${dt(i.to,s)}`).join(", ")}function dt(n,s){if(n.kind==="time")return`${String(n.hh).padStart(2,"0")}:${String(n.mm).padStart(2,"0")}`;let e=ue(s.hass,n.anchor);if(n.offset_min===0)return e;let t=Math.abs(n.offset_min),i=t%60===0?`${t/60}${o(s.hass,"ui.unit_hour_abbr","h")}`:`${t}${o(s.hass,"ui.unit_min_abbr","m")}`;return`${e}${n.offset_min<0?"-":"+"}${i}`}function ct(n,s,e){let t=Ze(e.hass,n.action),i=s?.domains?.[0]??o(e.hass,"ui.target_noun","target"),r=n.entity_ids.length,a;r===0?a=o(e.hass,"ui.no_targets","(no targets)"):r===1?a=`1 ${i}`:a=`${r} ${i}s`;let c={};for(let p of s?.target_params??[])p.unit&&(c[p.name]=p.unit);let u=Object.entries(n.params).filter(([,p])=>p!=null&&p!=="").map(([p,y])=>`${p} ${y}${c[p]??""}`).join(", ");return u?`${t}: ${a}, ${u}`:`${t}: ${a}`}var x=class extends f{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_summary(e){let t=Object.keys(e.when).filter(c=>e.when[c]!=null),i=t.length===0?o(this.hass,"ui.summary_any","any"):t.map(c=>`${Y(this.hass,c)}: ${ye(c,e.when[c],{hass:this.hass,periods:this.periods})}`).join(", "),r=e.actions.length,a=r===1?o(this.hass,"ui.action_singular","action"):o(this.hass,"ui.action_plural","actions");return`${i} \xB7 ${r} ${a}`}_onDragStart(e){this._dragFrom=e}_onDragOver(e,t){this._dragFrom===null||t===this._dragFrom||(e.preventDefault(),this._dragOver=t)}_onDrop(e){let t=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(t===null||t===e)&&this._emit("reorder-rules",{from:t,to:e})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(e,t){let i=t.name||o(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(e+1));window.confirm(o(this.hass,"ui.confirm_delete",'Delete "{name}"?').replace("{name}",i))&&this._emit("delete-rule",{index:e})}render(){return this.rules.length===0?d`
        <p class="empty">${o(this.hass,"ui.no_rules_yet","No rules yet.")}</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          ${o(this.hass,"ui.add_rule","+ Add rule")}
        </button>
      `:d`
      <ul>
        ${this.rules.map((e,t)=>d`
            <li
              class=${this._dragOver===t?"drag-over":""}
              draggable=${!this.autoSort}
              @dragstart=${()=>this._onDragStart(t)}
              @dragover=${i=>this._onDragOver(i,t)}
              @drop=${()=>this._onDrop(t)}
              @dragend=${this._onDragEnd}
            >
              ${this.autoSort?"":d`<span class="handle" title=${o(this.hass,"ui.drag_to_reorder","Drag to reorder")}>⠿</span>`}
              <span class="idx">${t+1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${()=>this._emit("edit-rule",{index:t})}
                >
                  ${ve(e,o(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(t+1)))}
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
    `}};x.styles=_`
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
  `,l([h({attribute:!1})],x.prototype,"rules",2),l([h({type:Boolean})],x.prototype,"autoSort",2),l([h({attribute:!1})],x.prototype,"periods",2),l([h({attribute:!1})],x.prototype,"hass",2),l([m()],x.prototype,"_dragFrom",2),l([m()],x.prototype,"_dragOver",2),x=l([g("ambience-rules-list")],x);function ht(n,s,e){if(!n||!n.entities||!s)return[];let t=n.entities,i=n.devices??{};return Object.values(t).filter(r=>!!(r.area_id===s||r.device_id&&i[r.device_id]?.area_id===s)).filter(r=>e.includes(r.entity_id.split(".")[0])).map(r=>r.entity_id).sort()}var C=class extends f{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=e=>{this._open&&(e.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=e=>{e.stopPropagation();let t=e.detail.value?.scene??"";this._emit(t.trim()===""?null:t)};this._sceneComputeLabel=e=>e.name==="scene"?o(this.hass,"ui.scene_name","Scene name"):e.name}connectedCallback(){super.connectedCallback(),N(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(e){e.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(t=>({value:t,label:t})),custom_value:!0,mode:"dropdown"}}}])}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target.value;this._emit(t.trim()===""?null:t),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(e){e.key==="Escape"&&this._open&&(this._open=!1,e.stopPropagation())}_toggle(e){e.preventDefault(),this._open=!this._open}_select(e,t){t.preventDefault(),this._emit(e),this._open=!1}render(){if(customElements.get("ha-form")){let e={scene:this.value??""};return d`
        <ha-form
          .hass=${this.hass}
          .schema=${this._schema}
          .data=${e}
          .computeLabel=${this._sceneComputeLabel}
          @value-changed=${this._onHaFormValueChanged}
        ></ha-form>
      `}return d`
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
      ${this._open?d`
            <div class="menu" role="listbox">
              ${this.suggestions.length===0?d`<div class="empty">
                    ${o(this.hass,"ui.no_scenes_yet","No scenes yet \u2014 type to create one")}
                  </div>`:this.suggestions.map(e=>d`
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
    `}};C.styles=_`
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
  `,l([h({attribute:!1})],C.prototype,"hass",2),l([h()],C.prototype,"value",2),l([h({attribute:!1})],C.prototype,"suggestions",2),l([m()],C.prototype,"_schema",2),l([m()],C.prototype,"_open",2),C=l([g("ambience-scene-combobox")],C);var zt=["dawn","sunrise","noon","sunset","dusk","midnight"],B=class extends f{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onKindChange(e){let t=e.target.value;t!==this.value.kind&&(t==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let t=e.target.value,[i,r]=t.split(":").map(a=>parseInt(a,10));Number.isNaN(i)||Number.isNaN(r)||this._emit({kind:"time",hh:i,mm:r})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let t=e.target.value;this._emit({kind:"sun",anchor:t,offset_min:this.value.offset_min})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let t=parseInt(e.target.value,10);Number.isNaN(t)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:t})}_renderTime(e){let t=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return d`<input type="time" .value=${t} @input=${this._onTimeChange} />`}_renderSun(e){let t=jt(e.offset_min,this.hass);return d`
      <select @change=${this._onAnchorChange}>
        ${zt.map(i=>d`<option value=${i} ?selected=${i===e.anchor}>${ue(this.hass,i)}</option>`)}
      </select>
      <input
        type="number"
        step="1"
        placeholder=${o(this.hass,"ui.offset_placeholder","\xB1min, e.g. -30")}
        .value=${String(e.offset_min)}
        @input=${this._onOffsetChange}
      />
      <span class="offset-hint">${t}</span>
    `}render(){return d`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>${o(this.hass,"ui.endpoint_time","Time")}</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>${o(this.hass,"ui.endpoint_sun","Sun")}</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};B.styles=_`
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
  `,l([h({attribute:!1})],B.prototype,"hass",2),l([h({attribute:!1})],B.prototype,"value",2),B=l([g("ambience-time-endpoint")],B);function jt(n,s){if(n===0)return"";let e=Math.abs(n),t=n<0?"\u2212":"+";if(e%60===0){let i=e/60,r=i===1?o(s,"ui.unit_hour","hour"):o(s,"ui.unit_hours","hours");return`${t}${i} ${r}`}return`${t}${e} ${o(s,"ui.unit_min","min")}`}var re={kind:"any"},ut={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},S=class extends f{constructor(){super(...arguments);this.value=null;this._entries=[re];this._openIdx=0}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[re]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(t=>{let i=this._entries[this._openIdx];if(!i)return;let r=i.kind==="any"?"__any__":i.kind==="range"?"__custom__":i.period;t.value!==r&&(t.value=r)})}_predicateToEntries(e){return e===null?[re]:(Array.isArray(e)?e:[e]).map(i=>"period"in i?{kind:"period",period:i.period}:{kind:"range",from:i.from,to:i.to})}_emit(e){let t=e.filter(r=>r.kind!=="any").map(r=>r.kind==="period"?{period:r.period}:{from:r.from,to:r.to}),i=t.length===0?null:t.length===1?t[0]:t;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:i},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let e=Object.keys(this.periods.builtins),t=Object.keys(this.periods.custom).filter(r=>!(r in this.periods.builtins)),i=new Set(this.periods.hidden);return[...e.filter(r=>!i.has(r)),...t]}_onSelectChange(e,t){let i=t.target.value,r=[...this._entries];i==="__any__"?r[e]=re:i==="__custom__"?r[e]={kind:"range",...ut}:r[e]={kind:"period",period:i},this._entries=r,this._emit(r)}_onRangeChange(e,t,i){i.stopPropagation();let r=this._entries[e];if(!r||r.kind!=="range")return;let a=[...this._entries];a[e]={...r,[t]:i.detail.value},this._entries=a,this._emit(a)}_onRemove(e){let t=this._entries.filter((i,r)=>r!==e);this._entries=t.length===0?[re]:t,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...ut}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,t){let i;return e.kind==="any"?i=o(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?i=be({period:e.period},{hass:this.hass,periods:this.periods}):i=be({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),d`
      <div class="summary-chip" @click=${()=>this._onChipClick(t)}>
        <span class="chip-label">${i}</span>
        ${this._entries.length>1?d`<button class="remove" @click=${r=>{r.stopPropagation(),this._onRemove(t)}} title=${o(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,t,i){let r=this._effectiveIds(),a=this.periods?.custom??{};return d`
      <div class="entry">
        <div class="entry-header">
          <select @change=${c=>this._onSelectChange(t,c)}>
            ${i?d`<option value="__any__">${o(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${o(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${r.map(c=>d`<option value=${c}>
                ${q(this.hass,c,a)}${a[c]&&!this.periods?.builtins[c]?o(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?d`<button class="remove" @click=${()=>this._onRemove(t)} title=${o(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${e.kind==="range"?d`
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
    `}render(){let e=this._entries.some(i=>i.kind!=="any"),t=this._entries.length>1;return d`
      ${this._entries.map((i,r)=>t&&r!==this._openIdx?this._renderChip(i,r):this._renderEntry(i,r,r===0))}
      ${e?d`<button class="add-btn" @click=${this._onAdd}>${o(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};S.styles=_`
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
  `,l([h({attribute:!1})],S.prototype,"value",2),l([h({attribute:!1})],S.prototype,"periods",2),l([h({attribute:!1})],S.prototype,"hass",2),l([m()],S.prototype,"_entries",2),l([m()],S.prototype,"_openIdx",2),S=l([g("ambience-time-of-day-input")],S);var pt=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Ut=new Set(["workday","holiday"]),Ft=new Set(["first_workday","last_workday"]);function mt(n){switch(n){case"weekday":return{kind:n,days:[]};case"day_of_month":return{kind:n,days:[]};case"date":return{kind:n,month:1,day:1};case"date_range":return{kind:n,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:n}}}var R=class extends f{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let t=e.include.length===0&&e.exclude.length===0;this.value=t?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_addItem(e,t){let i=this._current();i[e]=[...i[e],mt(t)],this._emit(i)}_removeItem(e,t){let i=this._current();i[e]=i[e].filter((r,a)=>a!==t),this._emit(i)}_updateItem(e,t,i){let r=this._current();r[e]=r[e].map((a,c)=>c===t?{...a,...i}:a),this._emit(r)}_kindDisabled(e){return!!(Ut.has(e)&&!this.dayConfig.workday_sensor||Ft.has(e)&&!this.dayConfig.workday_calendar)}_renderItem(e,t,i){return d`
      <div class="item">
        <select
          .value=${i.kind}
          @change=${r=>{let a=r.target.value;this._updateItem(e,t,mt(a))}}
        >
          ${pt.map(r=>d`<option value=${r} ?disabled=${this._kindDisabled(r)}>${Me(this.hass,r)}</option>`)}
        </select>
        <div class="body">${this._renderItemBody(e,t,i)}</div>
        <button class="remove" title=${o(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(e,t)}>✕</button>
      </div>
    `}_renderItemBody(e,t,i){if(i.kind==="weekday")return d`${[0,1,2,3,4,5,6].map(r=>d`
        <label class="day-pill">
          <input
            type="checkbox"
            .checked=${i.days.includes(r)}
            @change=${a=>{let u=a.target.checked?[...i.days,r].sort((p,y)=>p-y):i.days.filter(p=>p!==r);this._updateItem(e,t,{kind:"weekday",days:u})}}
          />${pe(this.hass,r)}
        </label>
      `)}`;if(i.kind==="day_of_month")return d`<input
        type="text" placeholder=${o(this.hass,"ui.day_of_month_placeholder","e.g. 1, 15, 31")}
        .value=${i.days.join(", ")}
        @change=${r=>{let a=r.target.value.split(",").map(c=>parseInt(c.trim(),10)).filter(c=>Number.isFinite(c));this._updateItem(e,t,{kind:"day_of_month",days:a})}}
      />`;if(i.kind==="date")return d`
        <input type="number" min="1" max="12" .value=${String(i.month)}
          @change=${r=>this._updateItem(e,t,{kind:"date",month:parseInt(r.target.value,10),day:i.day})} />
        /
        <input type="number" min="1" max="31" .value=${String(i.day)}
          @change=${r=>this._updateItem(e,t,{kind:"date",month:i.month,day:parseInt(r.target.value,10)})} />
      `;if(i.kind==="date_range"){let r=i.from.month,a=i.from.day,c=i.to.month,u=i.to.day;return d`
        <span>${o(this.hass,"ui.from","from")}</span>
        <input type="number" min="1" max="12" .value=${String(r)}
          @change=${p=>this._updateItem(e,t,{kind:"date_range",from:{month:parseInt(p.target.value,10),day:a},to:i.to})} />
        /
        <input type="number" min="1" max="31" .value=${String(a)}
          @change=${p=>this._updateItem(e,t,{kind:"date_range",from:{month:r,day:parseInt(p.target.value,10)},to:i.to})} />
        <span>${o(this.hass,"ui.to","to")}</span>
        <input type="number" min="1" max="12" .value=${String(c)}
          @change=${p=>this._updateItem(e,t,{kind:"date_range",from:i.from,to:{month:parseInt(p.target.value,10),day:u}})} />
        /
        <input type="number" min="1" max="31" .value=${String(u)}
          @change=${p=>this._updateItem(e,t,{kind:"date_range",from:i.from,to:{month:c,day:parseInt(p.target.value,10)}})} />
      `}return d``}_renderSection(e,t){return d`
      <div class="section">
        <h4>${e==="include"?o(this.hass,"ui.include","Include"):o(this.hass,"ui.exclude","Exclude")}</h4>
        ${t.length===0&&e==="include"?d`<div class="hint">${o(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${t.map((i,r)=>this._renderItem(e,r,i))}
        <select
          .value=${""}
          @change=${i=>{let r=i.target.value;r&&(this._addItem(e,r),i.target.value="")}}
        >
          <option value="">${e==="include"?o(this.hass,"ui.add_include_item","+ Add include item"):o(this.hass,"ui.add_exclude_item","+ Add exclude item")}</option>
          ${pt.map(i=>d`<option value=${i} ?disabled=${this._kindDisabled(i)}>${Me(this.hass,i)}</option>`)}
        </select>
      </div>
    `}render(){let{include:e,exclude:t}=this._current();return d`
      ${this._renderSection("include",e)}
      ${this._renderSection("exclude",t)}
    `}};R.styles=_`
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
  `,l([h({attribute:!1})],R.prototype,"hass",2),l([h({attribute:!1})],R.prototype,"value",2),l([h({attribute:!1})],R.prototype,"dayConfig",2),R=l([g("ambience-day-predicate-input")],R);var E=class extends f{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onText(e){let t=e.target.value;this._emit(t.trim()===""?null:t)}render(){return this.matcher.input==="time_of_day"?d`
        <ambience-time-of-day-input
          .value=${this.value}
          .periods=${this.periods}
          .hass=${this.hass}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-time-of-day-input>
      `:this.matcher.input==="scene_combobox"?d`
        <ambience-scene-combobox
          .hass=${this.hass}
          .value=${this.value??null}
          .suggestions=${this.sceneSuggestions}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-scene-combobox>
      `:this.matcher.input==="day_predicate"?d`
        <ambience-day-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .dayConfig=${this.dayConfig??{workday_sensor:null,workday_calendar:null}}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-day-predicate-input>
      `:d`
      <input
        type="text"
        placeholder=${o(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};E.styles=_`
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
  `,l([h({attribute:!1})],E.prototype,"matcher",2),l([h({attribute:!1})],E.prototype,"value",2),l([h({attribute:!1})],E.prototype,"sceneSuggestions",2),l([h({attribute:!1})],E.prototype,"periods",2),l([h({attribute:!1})],E.prototype,"dayConfig",2),l([h({attribute:!1})],E.prototype,"hass",2),E=l([g("ambience-matcher-input")],E);var L=class extends f{constructor(){super(...arguments);this.entities=[];this.value=[]}connectedCallback(){super.connectedCallback(),N(this,this.hass)}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let e=[{name:"entity_ids",label:"",selector:{entity:{multiple:!0,include_entities:this.entities}}}];return d`
      <ha-form
        .hass=${this.hass}
        .schema=${e}
        .data=${{entity_ids:this.value}}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,t){let i=new Set(this.value);t?i.add(e):i.delete(e),this._emit(this.entities.filter(r=>i.has(r)))}_renderFallback(){return this.entities.length===0?d`<p class="empty">${o(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:d`
      <div class="checkboxes">
        ${this.entities.map(e=>d`
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
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};L.styles=_`
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
  `,l([h({attribute:!1})],L.prototype,"hass",2),l([h({attribute:!1})],L.prototype,"entities",2),l([h({attribute:!1})],L.prototype,"value",2),L=l([g("ambience-target-picker")],L);var $=class extends f{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._open=null;this._showError=!1;this._onNameInput=e=>{this._setName(e.target.value)}}connectedCallback(){super.connectedCallback(),N(this,this.hass)}willUpdate(e){e.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null,this._open=null,this._showError=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"}))return d`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
        </div>
      `;let i=ve(this._draft,o(this.hass,"ui.new_rule","New rule"));return d`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${i}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let t=Qe();return t==="ha-input"?d`<ha-input label=${o(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:t==="ha-textfield"?d`<ha-textfield label=${o(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:d`<input type="text" .value=${e} @input=${this._onNameInput} />`}_isOpen(e){return this._open===null?!1:e.kind==="name"&&this._open.kind==="name"?!0:e.kind==="matcher"&&this._open.kind==="matcher"?e.id===this._open.id:e.kind==="action"&&this._open.kind==="action"?e.idx===this._open.idx:!1}_validationError(e){if(e===null||e.kind==="name"||e.kind==="matcher")return null;let t=this._draft?.actions[e.idx];if(!t)return null;if(t.entity_ids.length===0)return o(this.hass,"ui.at_least_one_target","At least one target is required.");let i=this.availableActions.find(r=>r.name===t.action);if(!i)return null;for(let r of i.target_params){if(!r.required)continue;let a=t.params[r.name];if(a==null||a==="")return o(this.hass,"ui.param_required","{param} is required.").replace("{param}",this._paramLabel(r.name))}return null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){this._tryCloseCurrent();return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let t of e.composedPath())if(t instanceof Element&&(t.classList.contains("slot")||t.classList.contains("actions-bar")))return;this._tryCloseCurrent()}_setPredicate(e,t){if(!this._draft)return;let i={...this._draft.when};t==null?delete i[e]:i[e]=t,this._draft={...this._draft,when:i}}_renderMatcherRow(e){let t=this._draft.when[e.name]??null,i=this._isOpen({kind:"matcher",id:e.name}),r=e.input==="scene_combobox";if(i&&r)return d`
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
      `;let a=ye(e.name,t,{hass:this.hass,periods:this.periods});return d`
      <div class="slot ${i?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"matcher",id:e.name})}>
          <span class="summary-label"><strong>${Y(this.hass,e.name)}:</strong> ${a}</span>
        </div>
        ${i?d`
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
    `}_addActionSlot(){if(!this._draft)return;let e={action:"set_light",entity_ids:[],params:{}},t=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,e]},this._open={kind:"action",idx:t}}_updateActionAt(e,t){if(!this._draft)return;let i=this._draft.actions.map((r,a)=>a===e?t(r):r);this._draft={...this._draft,actions:i}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((t,i)=>i!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,t){this._updateActionAt(e,i=>({...i,entity_ids:t}))}_paramLabel(e){let t=e.replaceAll("_"," ").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}_updateActionParam(e,t,i){this._updateActionAt(e,r=>{let a={...r.params},c=i;if(t.type==="int"?c=i===""?void 0:parseInt(i,10):t.type==="number"?c=i===""?void 0:parseFloat(i):t.type==="boolean"&&(c=i==="true"),typeof c=="number"&&Number.isFinite(c)){let u=c;typeof t.min=="number"&&u<t.min&&(u=t.min),typeof t.max=="number"&&u>t.max&&(u=t.max),c=u}return c===void 0?delete a[t.name]:a[t.name]=c,{...r,params:a}})}_renderActionParams(e,t,i){let r=i?.target_params??[];return d`
      ${r.map(a=>d`
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
            ${a.unit?d`<span class="param-unit">${a.unit}</span>`:""}
          </div>
        </div>
      `)}
    `}_renderActionRow(e,t){let i=this.availableActions.find(u=>u.name===e.action),r=this._isOpen({kind:"action",idx:t}),a=ct(e,i,{hass:this.hass}),c=ht(this.hass,this.areaId,i?.domains??[]);return d`
      <div class="slot ${r?"expanded":"collapsed"}" data-slot-id="action-${t}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:t})}>
          <span class="summary-label">${a}</span>
          <button class="remove" @click=${u=>{u.stopPropagation(),this._deleteAction(t)}} title=${o(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${r?d`
          <div class="body">
            <label>${o(this.hass,"ui.target","Target")}</label>
            <ambience-target-picker
              .hass=${this.hass}
              .entities=${c}
              .value=${e.entity_ids}
              @value-changed=${u=>{u.stopPropagation(),this._setActionTargets(t,u.detail.value)}}
            ></ambience-target-picker>

            ${this._renderActionParams(t,e,i)}

            ${this._showError&&this._validationError({kind:"action",idx:t})?d`
              <div class="error">${this._validationError({kind:"action",idx:t})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_save(){this._draft&&this.dispatchEvent(new CustomEvent("save-rule",{detail:this._draft,bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){return this._draft?d`
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
    `:d``}};$.styles=_`
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
  `,l([h({type:Boolean,reflect:!0})],$.prototype,"open",2),l([h({attribute:!1})],$.prototype,"rule",2),l([h({attribute:!1})],$.prototype,"matchers",2),l([h({attribute:!1})],$.prototype,"sceneSuggestions",2),l([h({attribute:!1})],$.prototype,"periods",2),l([h({attribute:!1})],$.prototype,"dayConfig",2),l([h({attribute:!1})],$.prototype,"availableActions",2),l([h({attribute:!1})],$.prototype,"hass",2),l([h({attribute:!1})],$.prototype,"areaId",2),l([m()],$.prototype,"_draft",2),l([m()],$.prototype,"_open",2),l([m()],$.prototype,"_showError",2),$=l([g("ambience-rule-editor")],$);var w=class extends f{constructor(){super(...arguments);this._areas=[];this._matchers=[];this._actions=[];this._configs=new Map;this._expanded=new Set;this._error="";this._editing=null;this._enabledMatchers=new Set}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await this._refreshAreas(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _loadStatic(){try{let[e,t,i,r,a]=await Promise.all([me(this.hass),it(this.hass),fe(this.hass),_e(this.hass),ge(this.hass)]);if(!this.isConnected)return;this._matchers=e,this._actions=t,this._periods=i,this._enabledMatchers=new Set(r.enabled),this._dayConfig=a}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await et(this.hass),t=new Map;if(await Promise.all(e.map(async i=>{t.set(i.area_id,this._normalize(await tt(this.hass,i.area_id)))})),!this.isConnected)return;this._areas=e,this._configs=t}catch(e){this._error=e.message||String(e)}}_normalize(e){return{rules:e.rules??[],auto_sort:e.auto_sort??!0}}async _subscribe(){let e=await this.hass.connection.subscribeEvents(t=>{if(t.data.action==="remove"){let i=t.data.area_id,r=new Set(this._expanded);r.delete(i),this._expanded=r,this._editing?.areaId===i&&(this._editing=null)}this._refreshAreas()},"area_registry_updated");this.isConnected?this._unsub=e:e()}_setConfig(e,t){let i=new Map(this._configs);i.set(e,t),this._configs=i}async _mutate(e,t){let i=this._configs.get(e);this._setConfig(e,t),this._error="";try{let{config:r}=await st(this.hass,e,t);this._setConfig(e,this._normalize(r))}catch(r){i&&this._setConfig(e,i),this._error=r.message||String(r)}}_toggleExpand(e){let t=new Set(this._expanded);t.has(e)?t.delete(e):t.add(e),this._expanded=t}_toggleAutoSort(e,t){let i=this._configs.get(e);i&&this._mutate(e,{...i,auto_sort:t})}_addRule(e){let t=this._configs.get(e);t&&(this._editing={areaId:e,index:t.rules.length,isNew:!0})}_editRule(e,t){this._editing={areaId:e,index:t.detail.index,isNew:!1}}_duplicateRule(e,t){let i=this._configs.get(e);if(!i)return;let r=i.rules[t.detail.index];if(!r)return;let a=JSON.parse(JSON.stringify(r)),c=[...i.rules];c.splice(t.detail.index+1,0,a),this._mutate(e,{...i,rules:c})}_deleteRule(e,t){let i=this._configs.get(e);if(!i)return;let r=i.rules.filter((a,c)=>c!==t.detail.index);this._mutate(e,{...i,rules:r})}_reorderRules(e,t){let i=this._configs.get(e);if(!i)return;let{from:r,to:a}=t.detail,c=[...i.rules],[u]=c.splice(r,1);c.splice(a,0,u),this._mutate(e,{...i,rules:c})}_saveRule(e){let t=this._editing;if(this._editing=null,!t)return;let i=this._configs.get(t.areaId);if(!i)return;let r=[...i.rules];t.isNew?r.push(e.detail):r[t.index]=e.detail,this._mutate(t.areaId,{...i,rules:r})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._configs.get(this._editing.areaId)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let e=this._configs.get(this._editing.areaId);if(!e)return[];let t=new Set;for(let i of e.rules){let r=i.when.scene;typeof r=="string"&&r&&t.add(r)}return[...t].sort((i,r)=>i.toLowerCase().localeCompare(r.toLowerCase()))}get _editorMatchers(){if(!this._editing)return[];let e=this._matchers.find(i=>i.name==="scene"),t=this._matchers.filter(i=>i.toggleable&&this._enabledMatchers.has(i.name));return e?[e,...t]:t}_summary(e){let t=e.rules.length;if(t===0)return o(this.hass,"ui.not_configured","not configured");let i=t===1?o(this.hass,"ui.rule_singular","rule"):o(this.hass,"ui.rule_plural","rules");return`${t} ${i}`}render(){return d`
      ${this._error?d`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?d`<p class="empty">${o(this.hass,"ui.no_areas","No areas found in Home Assistant.")}</p>`:d`<ul>
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
    `}_renderArea(e){let t=this._configs.get(e.area_id);if(!t)return d``;let i=this._expanded.has(e.area_id);return d`
      <li>
        <div
          class="area-header"
          @click=${()=>this._toggleExpand(e.area_id)}
        >
          <span class="chevron ${i?"open":""}">▶</span>
          <span class="area-name">${e.name}</span>
          <span class="area-summary">${this._summary(t)}</span>
        </div>
        ${i?d`
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
    `}};w.styles=_`
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
  `,l([h({attribute:!1})],w.prototype,"hass",2),l([m()],w.prototype,"_areas",2),l([m()],w.prototype,"_matchers",2),l([m()],w.prototype,"_actions",2),l([m()],w.prototype,"_periods",2),l([m()],w.prototype,"_dayConfig",2),l([m()],w.prototype,"_configs",2),l([m()],w.prototype,"_expanded",2),l([m()],w.prototype,"_error",2),l([m()],w.prototype,"_editing",2),l([m()],w.prototype,"_enabledMatchers",2),w=l([g("ambience-areas-list")],w);var P=class extends f{constructor(){super(...arguments);this.matcherName="";this.matcherDescription="";this.enabled=!1}_onToggle(e){let t=e.target.checked;this.dispatchEvent(new CustomEvent("enable-changed",{detail:{enabled:t},bubbles:!0,composed:!0}))}render(){let e=Y(this.hass,this.matcherName);return d`
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
    `}};P.styles=_`
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
  `,l([h({attribute:!1})],P.prototype,"hass",2),l([h()],P.prototype,"matcherName",2),l([h()],P.prototype,"matcherDescription",2),l([h({type:Boolean})],P.prototype,"enabled",2),P=l([g("ambience-matcher-card")],P);var Wt=/^[a-z][a-z0-9_]*$/;function qt(n){return n.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var k=class extends f{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._label=this.initial.label??"",this._def=this.initial}_onLabelInput(e){this._label=e.target.value}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_validate(e){if(!this.existingId){if(!this._label.trim())return o(this.hass,"ui.error_enter_name","Please enter a name.");if(!e)return o(this.hass,"ui.error_start_letter","Name must start with a letter.");if(!Wt.test(e))return o(this.hass,"ui.error_start_letter","Name must start with a letter.");if(this.takenIds.has(e))return o(this.hass,"ui.error_name_exists","A period with this name already exists. Choose a different name.")}return""}_onSave(){let e=this.existingId??qt(this._label),t=this._validate(e);if(t){this._error=t,this.performUpdate();return}let i={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:e,definition:i},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){let e=this.existingId?o(this.hass,"ui.period_modal_edit_title",'Edit "{name}"').replace("{name}",this.initial?.label??this.existingId):o(this.hass,"ui.period_modal_add_title","Add custom period");return d`
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
    `}};k.styles=_`
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
  `,l([h({attribute:!1})],k.prototype,"hass",2),l([h({attribute:!1})],k.prototype,"existingId",2),l([h({attribute:!1})],k.prototype,"initial",2),l([h({attribute:!1})],k.prototype,"takenIds",2),l([m()],k.prototype,"_label",2),l([m()],k.prototype,"_def",2),l([m()],k.prototype,"_error",2),k=l([g("ambience-period-edit-modal")],k);function ft(n,s){if(n.kind==="time")return`${String(n.hh).padStart(2,"0")}:${String(n.mm).padStart(2,"0")}`;if(n.offset_min===0)return n.anchor;let e=Math.abs(n.offset_min),t=e%60===0?`${e/60}${o(s,"ui.unit_hour_abbr","h")}`:`${e}${o(s,"ui.unit_min_abbr","m")}`;return`${n.anchor}${n.offset_min<0?"-":"+"}${t}`}function Bt(n,s){return`${ft(n.from,s)} \u2192 ${ft(n.to,s)}`}var I=class extends f{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await fe(this.hass)}_effective(){let e=new Set(this._view.hidden),t=[];for(let[i,r]of Object.entries(this._view.builtins)){if(e.has(i))continue;let a=this._view.custom[i];a?t.push({id:i,defn:a,provenance:"builtin-edited"}):t.push({id:i,defn:r,provenance:"builtin"})}for(let[i,r]of Object.entries(this._view.custom))i in this._view.builtins||t.push({id:i,defn:r,provenance:"custom"});return t}async _saveState(e,t){let i=await rt(this.hass,e,t);this._warnings=i.warnings,await this._reload()}_onEdit(e,t){this._modal={mode:"edit",id:e,initial:t}}async _onDelete(e){if(e in this._view.builtins){let i={...this._view.custom};delete i[e],await this._saveState(i,[...this._view.hidden,e])}else{let i={...this._view.custom};delete i[e],await this._saveState(i,this._view.hidden)}}async _onRevertEdited(e){let t={...this._view.custom};delete t[e],await this._saveState(t,this._view.hidden)}async _onRevertHidden(e){await this._saveState(this._view.custom,this._view.hidden.filter(t=>t!==e))}async _onResetAll(){let e=Object.keys(this._view.custom).length,t=this._view.hidden.length,i=o(this.hass,"ui.reset_confirm","This will clear {custom} custom period(s) and restore {hidden} hidden built-in(s). Continue?").replace("{custom}",String(e)).replace("{hidden}",String(t));confirm(i)&&(await nt(this.hass),this._warnings=[],await this._reload())}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:t,definition:i}=e.detail,r={...this._view.custom,[t]:i},a=this._view.hidden.filter(c=>c!==t);this._modal={mode:"closed"},await this._saveState(r,a)}_onModalCancel(){this._modal={mode:"closed"}}_renderRow(e){let t=this._view.custom,i=e.provenance==="builtin-edited",r=e.provenance==="custom";return d`
      <div class="row">
        <span class="name">${q(this.hass,e.id,t)}</span>
        <span class="def">${Bt(e.defn,this.hass)}</span>
        <span class="badge">${e.provenance==="builtin"?o(this.hass,"ui.badge_builtin","builtin"):e.provenance==="builtin-edited"?o(this.hass,"ui.badge_builtin_edited","builtin, edited"):o(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${o(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e.id,e.defn)}>✎</button>
          ${i?d`<button class="icon" title=${o(this.hass,"ui.title_revert","Revert to default")} @click=${()=>this._onRevertEdited(e.id)}>↺</button>`:""}
          ${r||e.provenance==="builtin"||i?d`<button class="icon" title=${o(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e.id)}>✕</button>`:""}
        </span>
      </div>
    `}_renderHiddenRow(e){return d`
      <div class="row">
        <span class="name">${q(this.hass,e,{})}</span>
        <span class="def">${o(this.hass,"ui.hidden_marker","(hidden)")}</span>
        <span class="badge">${o(this.hass,"ui.badge_hidden","hidden")}</span>
        <span class="actions">
          <button class="icon" title=${o(this.hass,"ui.title_restore","Restore")} @click=${()=>this._onRevertHidden(e)}>↺</button>
        </span>
      </div>
    `}render(){let e=this._effective();return d`
      <header>
        <h2>${o(this.hass,"ui.periods_heading","Periods")}</h2>
        <button @click=${this._onResetAll}>${o(this.hass,"ui.reset_all_to_defaults","Reset all to defaults")}</button>
      </header>
      ${this._warnings.length?d`<div class="warnings">
            <strong>${o(this.hass,"ui.period_warning_prefix","Warning:")}</strong> ${o(this.hass,"ui.period_warning_text","some rules now reference missing periods:")}
            <ul>
              ${this._warnings.map(t=>d`<li>${t.area_id} / "${t.rule_name}" → ${t.missing_period}</li>`)}
            </ul>
          </div>`:""}
      ${e.map(t=>this._renderRow(t))}
      ${this._view.hidden.map(t=>this._renderHiddenRow(t))}
      <button class="add" @click=${this._onAdd}>${o(this.hass,"ui.add_custom_period","+ Add custom period")}</button>
      ${this._modal.mode==="edit"?d`<ambience-period-edit-modal
            .hass=${this.hass}
            .existingId=${this._modal.id}
            .initial=${this._modal.initial}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:this._modal.mode==="add"?d`<ambience-period-edit-modal
            .hass=${this.hass}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:""}
    `}};I.styles=_`
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
  `,l([h({attribute:!1})],I.prototype,"hass",2),l([m()],I.prototype,"_view",2),l([m()],I.prototype,"_modal",2),l([m()],I.prototype,"_warnings",2),I=l([g("ambience-time-of-day-config")],I);var O=class extends f{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await ge(this.hass)}async _save(e){this._config=e;let t=await ot(this.hass,e.workday_sensor,e.workday_calendar);this._warnings=t.warnings??[]}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=[{name:"workday_sensor",selector:{entity:{domain:"binary_sensor"}}}],t=[{name:"workday_calendar",selector:{entity:{domain:"calendar"}}}];return d`
      <div class="row">
        <label>${o(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${e}
          .data=${{workday_sensor:this._config.workday_sensor??""}}
          @value-changed=${i=>{i.stopPropagation(),this._onSensorChange({detail:{value:i.detail.value?.workday_sensor||null}})}}
        ></ha-form>
      </div>
      <div class="row">
        <label>${o(this.hass,"ui.workday_calendar","Workday calendar")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${t}
          .data=${{workday_calendar:this._config.workday_calendar??""}}
          @value-changed=${i=>{i.stopPropagation(),this._onCalendarChange({detail:{value:i.detail.value?.workday_calendar||null}})}}
        ></ha-form>
      </div>
      ${this._warnings.length?d`
        <div class="warnings">
          <strong>${o(this.hass,"ui.day_warning_prefix","Warning:")}</strong> ${o(this.hass,"ui.day_warning_text","rules now reference unconfigured entities:")}
          <ul>
            ${this._warnings.map(i=>d`<li>${i.area_id} / "${i.rule_name}" → ${i.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};O.styles=_`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,l([h({attribute:!1})],O.prototype,"hass",2),l([m()],O.prototype,"_config",2),l([m()],O.prototype,"_warnings",2),O=l([g("ambience-day-config")],O);var D=class extends f{constructor(){super(...arguments);this._matchers=[];this._enabled=new Set;this._error=""}async connectedCallback(){super.connectedCallback();try{let[e,t]=await Promise.all([me(this.hass),_e(this.hass)]);this._matchers=e,this._enabled=new Set(t.enabled)}catch(e){this._error=e.message||String(e)}}async _onToggle(e,t){let i=new Set(this._enabled);t?i.add(e):i.delete(e),this._enabled=i;try{let r=this._matchers.filter(a=>a.toggleable&&i.has(a.name)).map(a=>a.name);await at(this.hass,r)}catch(r){this._error=r.message||String(r)}}render(){let e=this._matchers.filter(t=>t.toggleable);return d`
      ${this._error?d`<p class="error">${this._error}</p>`:""}
      ${e.map(t=>d`
        <ambience-matcher-card
          .hass=${this.hass}
          .matcherName=${t.name}
          .matcherDescription=${t.description}
          .enabled=${this._enabled.has(t.name)}
          @enable-changed=${i=>{i.stopPropagation(),this._onToggle(t.name,i.detail.enabled)}}
        >
          ${t.name==="time_of_day"?d`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`:t.name==="day"?d`<ambience-day-config .hass=${this.hass}></ambience-day-config>`:d``}
        </ambience-matcher-card>
      `)}
    `}};D.styles=_`
    :host { display: block; padding: 1rem; max-width: 60rem; margin: 0 auto; }
    .error { color: var(--error-color, #d32f2f); }
  `,l([h({attribute:!1})],D.prototype,"hass",2),l([m()],D.prototype,"_matchers",2),l([m()],D.prototype,"_enabled",2),l([m()],D.prototype,"_error",2),D=l([g("ambience-configuration-view")],D);var V=class extends f{constructor(){super(...arguments);this._view="areas"}connectedCallback(){super.connectedCallback(),N(this)}render(){return d`
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
      ${this._view==="areas"?d`<ambience-areas-list .hass=${this.hass}></ambience-areas-list>`:d`<ambience-configuration-view .hass=${this.hass}></ambience-configuration-view>`}
    `}};V.styles=_`
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
  `,l([h({attribute:!1})],V.prototype,"hass",2),l([m()],V.prototype,"_view",2),V=l([g("ambience-panel")],V);export{V as AmbiencePanel};
