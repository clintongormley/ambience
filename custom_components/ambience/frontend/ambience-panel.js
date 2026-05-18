/* Ambience panel — bundled output. Do not edit by hand. */
var It=Object.defineProperty;var zt=Object.getOwnPropertyDescriptor;var c=(n,r,t,e)=>{for(var s=e>1?void 0:e?zt(r,t):r,i=n.length-1,o;i>=0;i--)(o=n[i])&&(s=(e?o(r,t,s):o(s))||s);return e&&s&&It(r,t,s),s};var J=globalThis,K=J.ShadowRoot&&(J.ShadyCSS===void 0||J.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,tt=Symbol(),ft=new WeakMap,j=class{constructor(r,t,e){if(this._$cssResult$=!0,e!==tt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=t}get styleSheet(){let r=this.o,t=this.t;if(K&&r===void 0){let e=t!==void 0&&t.length===1;e&&(r=ft.get(t)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),e&&ft.set(t,r))}return r}toString(){return this.cssText}},gt=n=>new j(typeof n=="string"?n:n+"",void 0,tt),v=(n,...r)=>{let t=n.length===1?n[0]:r.reduce((e,s,i)=>e+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[i+1],n[0]);return new j(t,n,tt)},_t=(n,r)=>{if(K)n.adoptedStyleSheets=r.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of r){let e=document.createElement("style"),s=J.litNonce;s!==void 0&&e.setAttribute("nonce",s),e.textContent=t.cssText,n.appendChild(e)}},et=K?n=>n:n=>n instanceof CSSStyleSheet?(r=>{let t="";for(let e of r.cssRules)t+=e.cssText;return gt(t)})(n):n;var{is:qt,defineProperty:Lt,getOwnPropertyDescriptor:Wt,getOwnPropertyNames:Bt,getOwnPropertySymbols:Ft,getPrototypeOf:Vt}=Object,X=globalThis,vt=X.trustedTypes,Jt=vt?vt.emptyScript:"",Kt=X.reactiveElementPolyfillSupport,I=(n,r)=>n,z={toAttribute(n,r){switch(r){case Boolean:n=n?Jt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,r){let t=n;switch(r){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},Q=(n,r)=>!qt(n,r),yt={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:Q};Symbol.metadata??=Symbol("metadata"),X.litPropertyMetadata??=new WeakMap;var E=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,t=yt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(r,t),!t.noAccessor){let e=Symbol(),s=this.getPropertyDescriptor(r,e,t);s!==void 0&&Lt(this.prototype,r,s)}}static getPropertyDescriptor(r,t,e){let{get:s,set:i}=Wt(this.prototype,r)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let a=s?.call(this);i?.call(this,o),this.requestUpdate(r,a,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??yt}static _$Ei(){if(this.hasOwnProperty(I("elementProperties")))return;let r=Vt(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(I("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(I("properties"))){let t=this.properties,e=[...Bt(t),...Ft(t)];for(let s of e)this.createProperty(s,t[s])}let r=this[Symbol.metadata];if(r!==null){let t=litPropertyMetadata.get(r);if(t!==void 0)for(let[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let s=this._$Eu(t,e);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let t=[];if(Array.isArray(r)){let e=new Set(r.flat(1/0).reverse());for(let s of e)t.unshift(et(s))}else r!==void 0&&t.push(et(r));return t}static _$Eu(r,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(r.set(e,this[e]),delete this[e]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _t(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,t,e){this._$AK(r,e)}_$ET(r,t){let e=this.constructor.elementProperties.get(r),s=this.constructor._$Eu(r,e);if(s!==void 0&&e.reflect===!0){let i=(e.converter?.toAttribute!==void 0?e.converter:z).toAttribute(t,e.type);this._$Em=r,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(r,t){let e=this.constructor,s=e._$Eh.get(r);if(s!==void 0&&this._$Em!==s){let i=e.getPropertyOptions(s),o=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:z;this._$Em=s;let a=o.fromAttribute(t,i.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(r,t,e,s=!1,i){if(r!==void 0){let o=this.constructor;if(s===!1&&(i=this[r]),e??=o.getPropertyOptions(r),!((e.hasChanged??Q)(i,t)||e.useDefault&&e.reflect&&i===this._$Ej?.get(r)&&!this.hasAttribute(o._$Eu(r,e))))return;this.C(r,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,t,{useDefault:e,reflect:s,wrapped:i},o){e&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,o??t??this[r]),i!==!0||o!==void 0)||(this._$AL.has(r)||(this.hasUpdated||e||(t=void 0),this._$AL.set(r,t)),s===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[s,i]of e){let{wrapped:o}=i,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,i,a)}}let r=!1,t=this._$AL;try{r=this.shouldUpdate(t),r?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw r=!1,this._$EM(),e}r&&this._$AE(t)}willUpdate(r){}_$AE(r){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(r){}firstUpdated(r){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[I("elementProperties")]=new Map,E[I("finalized")]=new Map,Kt?.({ReactiveElement:E}),(X.reactiveElementVersions??=[]).push("2.1.2");var lt=globalThis,$t=n=>n,Z=lt.trustedTypes,bt=Z?Z.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ct="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,kt="?"+C,Xt=`<${kt}>`,R=document,L=()=>R.createComment(""),W=n=>n===null||typeof n!="object"&&typeof n!="function",ct=Array.isArray,Qt=n=>ct(n)||typeof n?.[Symbol.iterator]=="function",rt=`[ 	
\f\r]`,q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xt=/-->/g,Et=/>/g,P=RegExp(`>|${rt}(?:([^\\s"'>=/]+)(${rt}*=${rt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),At=/'/g,wt=/"/g,Pt=/^(?:script|style|textarea|title)$/i,dt=n=>(r,...t)=>({_$litType$:n,strings:r,values:t}),d=dt(1),le=dt(2),ce=dt(3),H=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),St=new WeakMap,T=R.createTreeWalker(R,129);function Tt(n,r){if(!ct(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return bt!==void 0?bt.createHTML(r):r}var Zt=(n,r)=>{let t=n.length-1,e=[],s,i=r===2?"<svg>":r===3?"<math>":"",o=q;for(let a=0;a<t;a++){let l=n[a],h,f,p=-1,x=0;for(;x<l.length&&(o.lastIndex=x,f=o.exec(l),f!==null);)x=o.lastIndex,o===q?f[1]==="!--"?o=xt:f[1]!==void 0?o=Et:f[2]!==void 0?(Pt.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=P):f[3]!==void 0&&(o=P):o===P?f[0]===">"?(o=s??q,p=-1):f[1]===void 0?p=-2:(p=o.lastIndex-f[2].length,h=f[1],o=f[3]===void 0?P:f[3]==='"'?wt:At):o===wt||o===At?o=P:o===xt||o===Et?o=q:(o=P,s=void 0);let S=o===P&&n[a+1].startsWith("/>")?" ":"";i+=o===q?l+Xt:p>=0?(e.push(h),l.slice(0,p)+Ct+l.slice(p)+C+S):l+C+(p===-2?a:S)}return[Tt(n,i+(n[t]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),e]},B=class n{constructor({strings:r,_$litType$:t},e){let s;this.parts=[];let i=0,o=0,a=r.length-1,l=this.parts,[h,f]=Zt(r,t);if(this.el=n.createElement(h,e),T.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=T.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let p of s.getAttributeNames())if(p.endsWith(Ct)){let x=f[o++],S=s.getAttribute(p).split(C),V=/([.?@])?(.*)/.exec(x);l.push({type:1,index:i,name:V[2],strings:S,ctor:V[1]==="."?it:V[1]==="?"?nt:V[1]==="@"?ot:O}),s.removeAttribute(p)}else p.startsWith(C)&&(l.push({type:6,index:i}),s.removeAttribute(p));if(Pt.test(s.tagName)){let p=s.textContent.split(C),x=p.length-1;if(x>0){s.textContent=Z?Z.emptyScript:"";for(let S=0;S<x;S++)s.append(p[S],L()),T.nextNode(),l.push({type:2,index:++i});s.append(p[x],L())}}}else if(s.nodeType===8)if(s.data===kt)l.push({type:2,index:i});else{let p=-1;for(;(p=s.data.indexOf(C,p+1))!==-1;)l.push({type:7,index:i}),p+=C.length-1}i++}}static createElement(r,t){let e=R.createElement("template");return e.innerHTML=r,e}};function M(n,r,t=n,e){if(r===H)return r;let s=e!==void 0?t._$Co?.[e]:t._$Cl,i=W(r)?void 0:r._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(n),s._$AT(n,t,e)),e!==void 0?(t._$Co??=[])[e]=s:t._$Cl=s),s!==void 0&&(r=M(n,s._$AS(n,r.values),s,e)),r}var st=class{constructor(r,t){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:t},parts:e}=this._$AD,s=(r?.creationScope??R).importNode(t,!0);T.currentNode=s;let i=T.nextNode(),o=0,a=0,l=e[0];for(;l!==void 0;){if(o===l.index){let h;l.type===2?h=new F(i,i.nextSibling,this,r):l.type===1?h=new l.ctor(i,l.name,l.strings,this,r):l.type===6&&(h=new at(i,this,r)),this._$AV.push(h),l=e[++a]}o!==l?.index&&(i=T.nextNode(),o++)}return T.currentNode=R,s}p(r){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(r,e,t),t+=e.strings.length-2):e._$AI(r[t])),t++}},F=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,t,e,s){this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=r,this._$AB=t,this._$AM=e,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,t=this._$AM;return t!==void 0&&r?.nodeType===11&&(r=t.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,t=this){r=M(this,r,t),W(r)?r===g||r==null||r===""?(this._$AH!==g&&this._$AR(),this._$AH=g):r!==this._$AH&&r!==H&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Qt(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==g&&W(this._$AH)?this._$AA.nextSibling.data=r:this.T(R.createTextNode(r)),this._$AH=r}$(r){let{values:t,_$litType$:e}=r,s=typeof e=="number"?this._$AC(r):(e.el===void 0&&(e.el=B.createElement(Tt(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===s)this._$AH.p(t);else{let i=new st(s,this),o=i.u(this.options);i.p(t),this.T(o),this._$AH=i}}_$AC(r){let t=St.get(r.strings);return t===void 0&&St.set(r.strings,t=new B(r)),t}k(r){ct(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,s=0;for(let i of r)s===t.length?t.push(e=new n(this.O(L()),this.O(L()),this,this.options)):e=t[s],e._$AI(i),s++;s<t.length&&(this._$AR(e&&e._$AB.nextSibling,s),t.length=s)}_$AR(r=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);r!==this._$AB;){let e=$t(r).nextSibling;$t(r).remove(),r=e}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,t,e,s,i){this.type=1,this._$AH=g,this._$AN=void 0,this.element=r,this.name=t,this._$AM=s,this.options=i,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=g}_$AI(r,t=this,e,s){let i=this.strings,o=!1;if(i===void 0)r=M(this,r,t,0),o=!W(r)||r!==this._$AH&&r!==H,o&&(this._$AH=r);else{let a=r,l,h;for(r=i[0],l=0;l<i.length-1;l++)h=M(this,a[e+l],t,l),h===H&&(h=this._$AH[l]),o||=!W(h)||h!==this._$AH[l],h===g?r=g:r!==g&&(r+=(h??"")+i[l+1]),this._$AH[l]=h}o&&!s&&this.j(r)}j(r){r===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},it=class extends O{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===g?void 0:r}},nt=class extends O{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==g)}},ot=class extends O{constructor(r,t,e,s,i){super(r,t,e,s,i),this.type=5}_$AI(r,t=this){if((r=M(this,r,t,0)??g)===H)return;let e=this._$AH,s=r===g&&e!==g||r.capture!==e.capture||r.once!==e.once||r.passive!==e.passive,i=r!==g&&(e===g||s);s&&this.element.removeEventListener(this.name,this,e),i&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},at=class{constructor(r,t,e){this.element=r,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(r){M(this,r)}};var Gt=lt.litHtmlPolyfillSupport;Gt?.(B,F),(lt.litHtmlVersions??=[]).push("3.3.2");var Rt=(n,r,t)=>{let e=t?.renderBefore??r,s=e._$litPart$;if(s===void 0){let i=t?.renderBefore??null;e._$litPart$=s=new F(r.insertBefore(L(),i),i,void 0,t??{})}return s._$AI(n),s};var ht=globalThis,m=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=Rt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return H}};m._$litElement$=!0,m.finalized=!0,ht.litElementHydrateSupport?.({LitElement:m});var Yt=ht.litElementPolyfillSupport;Yt?.({LitElement:m});(ht.litElementVersions??=[]).push("4.2.2");var y=n=>(r,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(n,r)}):customElements.define(n,r)};var te={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:Q},ee=(n=te,r,t)=>{let{kind:e,metadata:s}=t,i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),e==="setter"&&((n=Object.create(n)).wrapped=!0),i.set(t.name,n),e==="accessor"){let{name:o}=t;return{set(a){let l=r.get.call(this);r.set.call(this,a),this.requestUpdate(o,l,n,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,n,a),a}}}if(e==="setter"){let{name:o}=t;return function(a){let l=this[o];r.call(this,a),this.requestUpdate(o,l,n,!0,a)}}throw Error("Unsupported decorator location: "+e)};function u(n){return(r,t)=>typeof t=="object"?ee(n,r,t):((e,s,i)=>{let o=s.hasOwnProperty(i);return s.constructor.createProperty(i,e),o?Object.getOwnPropertyDescriptor(s,i):void 0})(n,r,t)}function _(n){return u({...n,state:!0,attribute:!1})}var Ht=["ha-combo-box"],pt=["ha-input","ha-textfield"];function re(){return pt.some(n=>customElements.get(n)!==void 0)}function ut(){return Ht.every(n=>customElements.get(n)!==void 0)&&re()}function Nt(){for(let n of pt)if(customElements.get(n))return n;return null}var Y=null;function mt(){return ut()?Promise.resolve(!0):Y||(Y=(async()=>{let n=window.loadCardHelpers;if(typeof n!="function")return!1;try{return await(await(await n()).createCardElement({type:"entities",entities:[]})).constructor?.getConfigElement?.(),await Promise.race([(async()=>{await Promise.all(Ht.map(e=>customElements.whenDefined(e))),await Promise.race(pt.map(e=>customElements.whenDefined(e)))})(),new Promise((e,s)=>setTimeout(()=>s(new Error("timeout")),5e3))]),ut()}catch{return!1}})(),Y)}var U=class{constructor(r){this.host=r;this.ready=ut();r.addController(this)}hostConnected(){this.ready||mt().then(r=>{this.ready=r,this.host.requestUpdate()})}hostDisconnected(){}};async function Mt(n){return n.callWS({type:"ambience/areas/list"})}async function Ot(n,r){return n.callWS({type:"ambience/area/get",area_id:r})}async function Ut(n,r,t){return n.callWS({type:"ambience/area/save",area_id:r,config:t})}async function Dt(n){return n.callWS({type:"ambience/matchers/list"})}async function jt(n){return n.callWS({type:"ambience/actions/list"})}var A=class extends m{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}_summary(t){let e=Object.keys(t.when).filter(o=>t.when[o]!=null),s=e.length===0?"any":e.map(o=>`${o}=${String(t.when[o])}`).join(", "),i=t.actions.length;return`${s} \xB7 ${i} action${i===1?"":"s"}`}_onDragStart(t){this._dragFrom=t}_onDragOver(t,e){this._dragFrom===null||e===this._dragFrom||(t.preventDefault(),this._dragOver=e)}_onDrop(t){let e=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(e===null||e===t)&&this._emit("reorder-rules",{from:e,to:t})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(t,e){let s=e.name||`Rule ${t+1}`;window.confirm(`Delete "${s}"?`)&&this._emit("delete-rule",{index:t})}render(){return this.rules.length===0?d`
        <p class="empty">No rules yet.</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          + Add rule
        </button>
      `:d`
      <ul>
        ${this.rules.map((t,e)=>d`
            <li
              class=${this._dragOver===e?"drag-over":""}
              draggable=${!this.autoSort}
              @dragstart=${()=>this._onDragStart(e)}
              @dragover=${s=>this._onDragOver(s,e)}
              @drop=${()=>this._onDrop(e)}
              @dragend=${this._onDragEnd}
            >
              ${this.autoSort?"":d`<span class="handle" title="Drag to reorder">⠿</span>`}
              <span class="idx">${e+1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${()=>this._emit("edit-rule",{index:e})}
                >
                  ${t.name||`Rule ${e+1}`}
                </div>
                <div class="summary">${this._summary(t)}</div>
              </div>
              <button
                @click=${()=>this._emit("duplicate-rule",{index:e})}
                title="Duplicate"
              >
                ⧉
              </button>
              <button
                @click=${()=>this._confirmDelete(e,t)}
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
    `}};A.styles=v`
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
  `,c([u({attribute:!1})],A.prototype,"rules",2),c([u({type:Boolean})],A.prototype,"autoSort",2),c([_()],A.prototype,"_dragFrom",2),c([_()],A.prototype,"_dragOver",2),A=c([y("ambience-rules-list")],A);var N=class extends m{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._ha=new U(this)}_onValueChanged(t){t.stopPropagation();let e=t.detail.value;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e===""?null:e},bubbles:!0,composed:!0}))}render(){if(!this._ha.ready)return d`<div class="placeholder">Loading scene picker…</div>`;let t=this.suggestions.map(e=>({value:e,label:e}));return d`
      <ha-combo-box
        .items=${t}
        .value=${this.value??""}
        item-value-path="value"
        item-label-path="label"
        placeholder="(any scene)"
        allow-custom-value
        @value-changed=${this._onValueChanged}
      ></ha-combo-box>
    `}};N.styles=v`
    :host {
      display: block;
    }
    .placeholder {
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      color: var(--secondary-text-color, #888);
      font-style: italic;
    }
    .placeholder.error {
      color: var(--error-color, #d32f2f);
      font-style: normal;
    }
  `,c([u()],N.prototype,"value",2),c([u({attribute:!1})],N.prototype,"suggestions",2),N=c([y("ambience-scene-combobox")],N);var k=class extends m{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(t){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_onText(t){let e=t.target.value;this._emit(e.trim()===""?null:e)}render(){return this.matcher.input==="scene_combobox"?d`
        <ambience-scene-combobox
          .value=${this.value??null}
          .suggestions=${this.sceneSuggestions}
          @value-changed=${t=>{t.stopPropagation(),this._emit(t.detail.value)}}
        ></ambience-scene-combobox>
      `:d`
      <input
        type="text"
        placeholder="(any)"
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};k.styles=v`
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
  `,c([u({attribute:!1})],k.prototype,"matcher",2),c([u({attribute:!1})],k.prototype,"value",2),c([u({attribute:!1})],k.prototype,"sceneSuggestions",2),k=c([y("ambience-matcher-input")],k);var b=class extends m{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._ha=new U(this);this._onNameInput=t=>{this._setName(t.target.value)}}willUpdate(t){t.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null)}_setName(t){this._draft&&(this._draft={...this._draft,name:t||void 0})}_renderNameField(){if(!this._ha.ready)return d`<div class="loading">Loading…</div>`;let t=this._draft.name??"";return Nt()==="ha-input"?d`
        <ha-input
          label="Name (optional)"
          .value=${t}
          @input=${this._onNameInput}
        ></ha-input>
      `:d`
      <ha-textfield
        label="Name (optional)"
        .value=${t}
        @input=${this._onNameInput}
      ></ha-textfield>
    `}_setPredicate(t,e){if(!this._draft)return;let s={...this._draft.when};e==null?delete s[t]:s[t]=e,this._draft={...this._draft,when:s}}_addActionSlot(){if(!this._draft)return;let t={action:"set_light",targets:{}};this._draft={...this._draft,actions:[...this._draft.actions,t]}}_updateActionAt(t,e){if(!this._draft)return;let s=this._draft.actions.map((i,o)=>o===t?e(i):i);this._draft={...this._draft,actions:s}}_changeActionType(t,e){this._updateActionAt(t,()=>({action:e,targets:{}}))}_deleteAction(t){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((e,s)=>s!==t)})}_addTarget(t){this._updateActionAt(t,e=>{let s=this.availableActions.find(o=>o.name===e.action),i={};return s?.target_params.forEach(o=>{"default"in o&&(i[o.name]=o.default)}),{...e,targets:{...e.targets,"":i}}})}_updateTargetId(t,e,s){this._updateActionAt(t,i=>{if(e===s)return i;let o={...i.targets};return o[s]=o[e],delete o[e],{...i,targets:o}})}_updateTargetParam(t,e,s,i){this._updateActionAt(t,o=>{let a={...o.targets},l={...a[e]??{}},h=i;return s.type==="int"?h=i===""?void 0:parseInt(i,10):s.type==="number"?h=i===""?void 0:parseFloat(i):s.type==="boolean"&&(h=i==="true"),h===void 0?delete l[s.name]:l[s.name]=h,a[e]=l,{...o,targets:a}})}_deleteTarget(t,e){this._updateActionAt(t,s=>{let i={...s.targets};return delete i[e],{...s,targets:i}})}_renderTargets(t,e){let s=this.availableActions.find(a=>a.name===e.action),i=s?.target_params??[],o=Object.entries(e.targets);return o.length===0?d`<p
        style="color: var(--secondary-text-color, #888); margin: 0.5rem 0;"
      >
        No targets yet.
      </p>`:d`
      ${o.map(([a,l])=>d`
          <div
            style="display: grid; grid-template-columns: 1fr ${"1fr ".repeat(i.length)}auto; gap: 0.5rem; margin: 0.5rem 0; align-items: end;"
          >
            <div>
              <label>entity_id</label>
              <input
                type="text"
                .value=${a}
                placeholder="${s?.domains?.[0]??"domain"}.example"
                @change=${h=>this._updateTargetId(t,a,h.target.value)}
              />
            </div>
            ${i.map(h=>d`
                <div>
                  <label>${h.name}${h.required?" *":""}</label>
                  <input
                    type=${h.type==="int"||h.type==="number"?"number":"text"}
                    .value=${String(l[h.name]??"")}
                    min=${h.min??""}
                    max=${h.max??""}
                    @input=${f=>this._updateTargetParam(t,a,h,f.target.value)}
                  />
                </div>
              `)}
            <button
              class="secondary"
              @click=${()=>this._deleteTarget(t,a)}
              title="Remove target"
            >
              ×
            </button>
          </div>
        `)}
    `}_save(){this._draft&&this.dispatchEvent(new CustomEvent("save-rule",{detail:this._draft,bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){return this._draft?d`
      <div class="modal">
        <h2>${this._draft.name||"New rule"}</h2>

        ${this._renderNameField()}

        <h3>When</h3>
        ${this.matchers.map(t=>d`
            <label>${t.name==="scene"?"Scene":t.name}</label>
            <ambience-matcher-input
              .matcher=${t}
              .value=${this._draft.when[t.name]??null}
              .sceneSuggestions=${this.sceneSuggestions}
              @value-changed=${e=>this._setPredicate(t.name,e.detail.value)}
            ></ambience-matcher-input>
          `)}

        <h3>Actions</h3>
        ${this._draft.actions.map((t,e)=>d`
            <div
              style="border: 1px solid var(--divider-color, #e0e0e0); border-radius: 4px; padding: 0.75rem; margin-bottom: 0.5rem;"
            >
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <select
                  @change=${s=>this._changeActionType(e,s.target.value)}
                >
                  ${this.availableActions.map(s=>d`
                      <option
                        value=${s.name}
                        ?selected=${t.action===s.name}
                      >
                        ${s.name}
                      </option>
                    `)}
                </select>
                <button
                  class="secondary"
                  style="margin-left: auto"
                  @click=${()=>this._deleteAction(e)}
                >
                  Remove action
                </button>
              </div>

              ${this._renderTargets(e,t)}

              <button
                class="secondary"
                @click=${()=>this._addTarget(e)}
              >
                + Add target
              </button>
            </div>
          `)}
        <button class="secondary" @click=${this._addActionSlot}>
          + Add action
        </button>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._save}>Save rule</button>
        </div>
      </div>
    `:d``}};b.styles=v`
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
      max-width: 40rem;
      max-height: 90vh;
      overflow-y: auto;
    }
    h2 {
      margin: 0 0 1rem 0;
    }
    h3 {
      margin: 1.5rem 0 0.5rem 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      padding-bottom: 0.25rem;
    }
    label {
      display: block;
      font-weight: 600;
      margin: 0.5rem 0 0.25rem 0;
    }
    input,
    select {
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
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
    .loading {
      padding: 0.6rem 0.75rem;
      color: var(--secondary-text-color, #888);
      font-style: italic;
    }
  `,c([u({type:Boolean,reflect:!0})],b.prototype,"open",2),c([u({attribute:!1})],b.prototype,"rule",2),c([u({attribute:!1})],b.prototype,"matchers",2),c([u({attribute:!1})],b.prototype,"sceneSuggestions",2),c([u({attribute:!1})],b.prototype,"availableActions",2),c([_()],b.prototype,"_draft",2),b=c([y("ambience-rule-editor")],b);var w=class extends m{constructor(){super(...arguments);this.open=!1;this.matchers=[];this.selected=[];this._draft=new Set}willUpdate(t){(t.has("selected")||t.has("open"))&&this.open&&(this._draft=new Set(this.selected))}_toggle(t,e){let s=new Set(this._draft);e?s.add(t):s.delete(t),this._draft=s}_apply(){this.dispatchEvent(new CustomEvent("apply-matchers",{detail:{matchers:[...this._draft]},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-matchers",{bubbles:!0,composed:!0}))}render(){let t=this.matchers.filter(e=>e.toggleable);return d`
      <div class="modal">
        <h2>Matchers</h2>
        <p class="intro">
          Select which matchers can be used in this area's rule predicates.
        </p>
        ${t.map(e=>d`
            <label class="matcher-row">
              <input
                type="checkbox"
                .checked=${this._draft.has(e.name)}
                @change=${s=>this._toggle(e.name,s.target.checked)}
              />
              <div class="matcher-meta">
                <div class="matcher-name">${e.name}</div>
                <div>${e.description}</div>
                <div class="matcher-help">${e.predicate_help}</div>
              </div>
            </label>
          `)}
        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._apply}>Apply</button>
        </div>
      </div>
    `}};w.styles=v`
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
  `,c([u({type:Boolean,reflect:!0})],w.prototype,"open",2),c([u({attribute:!1})],w.prototype,"matchers",2),c([u({attribute:!1})],w.prototype,"selected",2),c([_()],w.prototype,"_draft",2),w=c([y("ambience-matchers-modal")],w);var $=class extends m{constructor(){super(...arguments);this._areas=[];this._matchers=[];this._actions=[];this._configs=new Map;this._expanded=new Set;this._error="";this._editing=null;this._matchersModalArea=null}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await this._refreshAreas(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _loadStatic(){try{let[t,e]=await Promise.all([Dt(this.hass),jt(this.hass)]);if(!this.isConnected)return;this._matchers=t,this._actions=e}catch(t){this._error=t.message||String(t)}}async _refreshAreas(){try{let t=await Mt(this.hass),e=new Map;if(await Promise.all(t.map(async s=>{e.set(s.area_id,this._normalize(await Ot(this.hass,s.area_id)))})),!this.isConnected)return;this._areas=t,this._configs=e}catch(t){this._error=t.message||String(t)}}_normalize(t){return{matchers:t.matchers??[],rules:t.rules??[],auto_sort:t.auto_sort??!0}}async _subscribe(){let t=await this.hass.connection.subscribeEvents(e=>{if(e.data.action==="remove"){let s=e.data.area_id,i=new Set(this._expanded);i.delete(s),this._expanded=i,this._editing?.areaId===s&&(this._editing=null),this._matchersModalArea===s&&(this._matchersModalArea=null)}this._refreshAreas()},"area_registry_updated");this.isConnected?this._unsub=t:t()}_setConfig(t,e){let s=new Map(this._configs);s.set(t,e),this._configs=s}async _mutate(t,e){let s=this._configs.get(t);this._setConfig(t,e),this._error="";try{let{config:i}=await Ut(this.hass,t,e);this._setConfig(t,this._normalize(i))}catch(i){s&&this._setConfig(t,s),this._error=i.message||String(i)}}_toggleExpand(t){let e=new Set(this._expanded);e.has(t)?e.delete(t):e.add(t),this._expanded=e}_openMatchersModal(t){this._matchersModalArea=t}_applyMatchers(t){let e=this._matchersModalArea;if(this._matchersModalArea=null,!e)return;let s=this._configs.get(e);s&&this._mutate(e,{...s,matchers:t.detail.matchers})}_toggleAutoSort(t,e){let s=this._configs.get(t);s&&this._mutate(t,{...s,auto_sort:e})}_addRule(t){let e=this._configs.get(t);e&&(this._editing={areaId:t,index:e.rules.length,isNew:!0})}_editRule(t,e){this._editing={areaId:t,index:e.detail.index,isNew:!1}}_duplicateRule(t,e){let s=this._configs.get(t);if(!s)return;let i=s.rules[e.detail.index];if(!i)return;let o=JSON.parse(JSON.stringify(i)),a=[...s.rules];a.splice(e.detail.index+1,0,o),this._mutate(t,{...s,rules:a})}_deleteRule(t,e){let s=this._configs.get(t);if(!s)return;let i=s.rules.filter((o,a)=>a!==e.detail.index);this._mutate(t,{...s,rules:i})}_reorderRules(t,e){let s=this._configs.get(t);if(!s)return;let{from:i,to:o}=e.detail,a=[...s.rules],[l]=a.splice(i,1);a.splice(o,0,l),this._mutate(t,{...s,rules:a})}_saveRule(t){let e=this._editing;if(this._editing=null,!e)return;let s=this._configs.get(e.areaId);if(!s)return;let i=[...s.rules];e.isNew?i.push(t.detail):i[e.index]=t.detail,this._mutate(e.areaId,{...s,rules:i})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._configs.get(this._editing.areaId)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let t=this._configs.get(this._editing.areaId);if(!t)return[];let e=new Set;for(let s of t.rules){let i=s.when.scene;typeof i=="string"&&i&&e.add(i)}return[...e].sort((s,i)=>s.toLowerCase().localeCompare(i.toLowerCase()))}get _editorMatchers(){if(!this._editing)return[];let t=this._configs.get(this._editing.areaId);if(!t)return[];let e=this._matchers.find(i=>i.name==="scene"),s=this._matchers.filter(i=>t.matchers.includes(i.name));return e?[e,...s]:s}_summary(t){if(t.rules.length===0&&t.matchers.length===0)return"not configured";let e=t.rules.length,s=t.matchers.length;return`${e} rule${e===1?"":"s"} \xB7 ${s} matcher${s===1?"":"s"}`}render(){return d`
      ${this._error?d`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?d`<p class="empty">No areas found in Home Assistant.</p>`:d`<ul>
            ${this._areas.map(t=>this._renderArea(t))}
          </ul>`}

      <ambience-rule-editor
        ?open=${this._editing!==null}
        .rule=${this._editingRule}
        .matchers=${this._editorMatchers}
        .sceneSuggestions=${this._sceneSuggestions}
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
    `}_renderArea(t){let e=this._configs.get(t.area_id);if(!e)return d``;let s=this._expanded.has(t.area_id);return d`
      <li>
        <div
          class="area-header"
          @click=${()=>this._toggleExpand(t.area_id)}
        >
          <span class="chevron ${s?"open":""}">▶</span>
          <span class="area-name">${t.name}</span>
          <span class="area-summary">${this._summary(e)}</span>
          <button
            class="cog"
            title="Matchers"
            @click=${i=>{i.stopPropagation(),this._openMatchersModal(t.area_id)}}
          >
            ⚙
          </button>
        </div>
        ${s?d`
              <div class="area-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!e.auto_sort}
                    @change=${i=>this._toggleAutoSort(t.area_id,!i.target.checked)}
                  />
                  Order rules manually
                </label>
                <ambience-rules-list
                  .rules=${e.rules}
                  .autoSort=${e.auto_sort}
                  @add-rule=${()=>this._addRule(t.area_id)}
                  @edit-rule=${i=>this._editRule(t.area_id,i)}
                  @duplicate-rule=${i=>this._duplicateRule(t.area_id,i)}
                  @delete-rule=${i=>this._deleteRule(t.area_id,i)}
                  @reorder-rules=${i=>this._reorderRules(t.area_id,i)}
                ></ambience-rules-list>
              </div>
            `:""}
      </li>
    `}};$.styles=v`
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
  `,c([u({attribute:!1})],$.prototype,"hass",2),c([_()],$.prototype,"_areas",2),c([_()],$.prototype,"_matchers",2),c([_()],$.prototype,"_actions",2),c([_()],$.prototype,"_configs",2),c([_()],$.prototype,"_expanded",2),c([_()],$.prototype,"_error",2),c([_()],$.prototype,"_editing",2),c([_()],$.prototype,"_matchersModalArea",2),$=c([y("ambience-areas-list")],$);var D=class extends m{connectedCallback(){super.connectedCallback(),mt()}render(){return d`
      <header><h1>Ambience</h1></header>
      <ambience-areas-list .hass=${this.hass}></ambience-areas-list>
    `}};D.styles=v`
    :host {
      display: block;
      height: 100vh;
      background: var(--primary-background-color, #fafafa);
      color: var(--primary-text-color, #1d1d1d);
      font-family: var(--primary-font-family, system-ui, sans-serif);
    }
    header {
      padding: 1rem;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    h1 {
      margin: 0;
      font-size: 1.4rem;
    }
  `,c([u({attribute:!1})],D.prototype,"hass",2),D=c([y("ambience-panel")],D);export{D as AmbiencePanel};
