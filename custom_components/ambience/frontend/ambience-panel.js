/* Ambience panel — bundled output. Do not edit by hand. */
var Mt=Object.defineProperty;var Ot=Object.getOwnPropertyDescriptor;var c=(n,e,t,r)=>{for(var s=r>1?void 0:r?Ot(e,t):e,i=n.length-1,o;i>=0;i--)(o=n[i])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&Mt(e,t,s),s};var J=globalThis,K=J.ShadowRoot&&(J.ShadyCSS===void 0||J.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),dt=new WeakMap,D=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(K&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=dt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&dt.set(t,e))}return e}toString(){return this.cssText}},ht=n=>new D(typeof n=="string"?n:n+"",void 0,X),v=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((r,s,i)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[i+1],n[0]);return new D(t,n,X)},ut=(n,e)=>{if(K)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),s=J.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=t.cssText,n.appendChild(r)}},Y=K?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return ht(t)})(n):n;var{is:Ht,defineProperty:Nt,getOwnPropertyDescriptor:Ut,getOwnPropertyNames:Dt,getOwnPropertySymbols:jt,getPrototypeOf:It}=Object,V=globalThis,pt=V.trustedTypes,zt=pt?pt.emptyScript:"",qt=V.reactiveElementPolyfillSupport,j=(n,e)=>n,I={toAttribute(n,e){switch(e){case Boolean:n=n?zt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},Z=(n,e)=>!Ht(n,e),mt={attribute:!0,type:String,converter:I,reflect:!1,useDefault:!1,hasChanged:Z};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=mt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(e,r,t);s!==void 0&&Nt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){let{get:s,set:i}=Ut(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let a=s?.call(this);i?.call(this,o),this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??mt}static _$Ei(){if(this.hasOwnProperty(j("elementProperties")))return;let e=It(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(j("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(j("properties"))){let t=this.properties,r=[...Dt(t),...jt(t)];for(let s of r)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,s]of t)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let s=this._$Eu(t,r);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let s of r)t.unshift(Y(s))}else e!==void 0&&t.push(Y(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ut(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(s!==void 0&&r.reflect===!0){let i=(r.converter?.toAttribute!==void 0?r.converter:I).toAttribute(t,r.type);this._$Em=e,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(e,t){let r=this.constructor,s=r._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let i=r.getPropertyOptions(s),o=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:I;this._$Em=s;let a=o.fromAttribute(t,i.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(e,t,r,s=!1,i){if(e!==void 0){let o=this.constructor;if(s===!1&&(i=this[e]),r??=o.getPropertyOptions(e),!((r.hasChanged??Z)(i,t)||r.useDefault&&r.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:i},o){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),i!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,i]of r){let{wrapped:o}=i,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,i,a)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[j("elementProperties")]=new Map,A[j("finalized")]=new Map,qt?.({ReactiveElement:A}),(V.reactiveElementVersions??=[]).push("2.1.2");var ot=globalThis,gt=n=>n,G=ot.trustedTypes,ft=G?G.createPolicy("lit-html",{createHTML:n=>n}):void 0,xt="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,At="?"+C,Lt=`<${At}>`,T=document,q=()=>T.createComment(""),L=n=>n===null||typeof n!="object"&&typeof n!="function",at=Array.isArray,Bt=n=>at(n)||typeof n?.[Symbol.iterator]=="function",tt=`[ 	
\f\r]`,z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_t=/-->/g,vt=/>/g,P=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),yt=/'/g,$t=/"/g,Et=/^(?:script|style|textarea|title)$/i,lt=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),h=lt(1),te=lt(2),ee=lt(3),M=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),bt=new WeakMap,R=T.createTreeWalker(T,129);function St(n,e){if(!at(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return ft!==void 0?ft.createHTML(e):e}var Wt=(n,e)=>{let t=n.length-1,r=[],s,i=e===2?"<svg>":e===3?"<math>":"",o=z;for(let a=0;a<t;a++){let l=n[a],d,g,p=-1,x=0;for(;x<l.length&&(o.lastIndex=x,g=o.exec(l),g!==null);)x=o.lastIndex,o===z?g[1]==="!--"?o=_t:g[1]!==void 0?o=vt:g[2]!==void 0?(Et.test(g[2])&&(s=RegExp("</"+g[2],"g")),o=P):g[3]!==void 0&&(o=P):o===P?g[0]===">"?(o=s??z,p=-1):g[1]===void 0?p=-2:(p=o.lastIndex-g[2].length,d=g[1],o=g[3]===void 0?P:g[3]==='"'?$t:yt):o===$t||o===yt?o=P:o===_t||o===vt?o=z:(o=P,s=void 0);let w=o===P&&n[a+1].startsWith("/>")?" ":"";i+=o===z?l+Lt:p>=0?(r.push(d),l.slice(0,p)+xt+l.slice(p)+C+w):l+C+(p===-2?a:w)}return[St(n,i+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},B=class n{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let i=0,o=0,a=e.length-1,l=this.parts,[d,g]=Wt(e,t);if(this.el=n.createElement(d,r),R.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=R.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let p of s.getAttributeNames())if(p.endsWith(xt)){let x=g[o++],w=s.getAttribute(p).split(C),F=/([.?@])?(.*)/.exec(x);l.push({type:1,index:i,name:F[2],strings:w,ctor:F[1]==="."?rt:F[1]==="?"?st:F[1]==="@"?it:N}),s.removeAttribute(p)}else p.startsWith(C)&&(l.push({type:6,index:i}),s.removeAttribute(p));if(Et.test(s.tagName)){let p=s.textContent.split(C),x=p.length-1;if(x>0){s.textContent=G?G.emptyScript:"";for(let w=0;w<x;w++)s.append(p[w],q()),R.nextNode(),l.push({type:2,index:++i});s.append(p[x],q())}}}else if(s.nodeType===8)if(s.data===At)l.push({type:2,index:i});else{let p=-1;for(;(p=s.data.indexOf(C,p+1))!==-1;)l.push({type:7,index:i}),p+=C.length-1}i++}}static createElement(e,t){let r=T.createElement("template");return r.innerHTML=e,r}};function H(n,e,t=n,r){if(e===M)return e;let s=r!==void 0?t._$Co?.[r]:t._$Cl,i=L(e)?void 0:e._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(n),s._$AT(n,t,r)),r!==void 0?(t._$Co??=[])[r]=s:t._$Cl=s),s!==void 0&&(e=H(n,s._$AS(n,e.values),s,r)),e}var et=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,s=(e?.creationScope??T).importNode(t,!0);R.currentNode=s;let i=R.nextNode(),o=0,a=0,l=r[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new W(i,i.nextSibling,this,e):l.type===1?d=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(d=new nt(i,this,e)),this._$AV.push(d),l=r[++a]}o!==l?.index&&(i=R.nextNode(),o++)}return R.currentNode=T,s}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},W=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=H(this,e,t),L(e)?e===f||e==null||e===""?(this._$AH!==f&&this._$AR(),this._$AH=f):e!==this._$AH&&e!==M&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Bt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==f&&L(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,s=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=B.createElement(St(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(t);else{let i=new et(s,this),o=i.u(this.options);i.p(t),this.T(o),this._$AH=i}}_$AC(e){let t=bt.get(e.strings);return t===void 0&&bt.set(e.strings,t=new B(e)),t}k(e){at(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,s=0;for(let i of e)s===t.length?t.push(r=new n(this.O(q()),this.O(q()),this,this.options)):r=t[s],r._$AI(i),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=gt(e).nextSibling;gt(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},N=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,i){this.type=1,this._$AH=f,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=f}_$AI(e,t=this,r,s){let i=this.strings,o=!1;if(i===void 0)e=H(this,e,t,0),o=!L(e)||e!==this._$AH&&e!==M,o&&(this._$AH=e);else{let a=e,l,d;for(e=i[0],l=0;l<i.length-1;l++)d=H(this,a[r+l],t,l),d===M&&(d=this._$AH[l]),o||=!L(d)||d!==this._$AH[l],d===f?e=f:e!==f&&(e+=(d??"")+i[l+1]),this._$AH[l]=d}o&&!s&&this.j(e)}j(e){e===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},rt=class extends N{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===f?void 0:e}},st=class extends N{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==f)}},it=class extends N{constructor(e,t,r,s,i){super(e,t,r,s,i),this.type=5}_$AI(e,t=this){if((e=H(this,e,t,0)??f)===M)return;let r=this._$AH,s=e===f&&r!==f||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,i=e!==f&&(r===f||s);s&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},nt=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){H(this,e)}};var Ft=ot.litHtmlPolyfillSupport;Ft?.(B,W),(ot.litHtmlVersions??=[]).push("3.3.2");var wt=(n,e,t)=>{let r=t?.renderBefore??e,s=r._$litPart$;if(s===void 0){let i=t?.renderBefore??null;r._$litPart$=s=new W(e.insertBefore(q(),i),i,void 0,t??{})}return s._$AI(n),s};var ct=globalThis,m=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=wt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};m._$litElement$=!0,m.finalized=!0,ct.litElementHydrateSupport?.({LitElement:m});var Jt=ct.litElementPolyfillSupport;Jt?.({LitElement:m});(ct.litElementVersions??=[]).push("4.2.2");var y=n=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(n,e)}):customElements.define(n,e)};var Kt={attribute:!0,type:String,converter:I,reflect:!1,hasChanged:Z},Vt=(n=Kt,e,t)=>{let{kind:r,metadata:s}=t,i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),r==="setter"&&((n=Object.create(n)).wrapped=!0),i.set(t.name,n),r==="accessor"){let{name:o}=t;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(o,l,n,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,n,a),a}}}if(r==="setter"){let{name:o}=t;return function(a){let l=this[o];e.call(this,a),this.requestUpdate(o,l,n,!0,a)}}throw Error("Unsupported decorator location: "+r)};function u(n){return(e,t)=>typeof t=="object"?Vt(n,e,t):((r,s,i)=>{let o=s.hasOwnProperty(i);return s.constructor.createProperty(i,r),o?Object.getOwnPropertyDescriptor(s,i):void 0})(n,e,t)}function _(n){return u({...n,state:!0,attribute:!1})}async function Ct(n){return n.callWS({type:"ambience/areas/list"})}async function kt(n,e){return n.callWS({type:"ambience/area/get",area_id:e})}async function Pt(n,e,t){return n.callWS({type:"ambience/area/save",area_id:e,config:t})}async function Rt(n){return n.callWS({type:"ambience/matchers/list"})}async function Tt(n){return n.callWS({type:"ambience/actions/list"})}var E=class extends m{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(t,r){this.dispatchEvent(new CustomEvent(t,{detail:r,bubbles:!0,composed:!0}))}_summary(t){let r=Object.keys(t.when).filter(o=>t.when[o]!=null),s=r.length===0?"any":r.map(o=>`${o}=${String(t.when[o])}`).join(", "),i=t.actions.length;return`${s} \xB7 ${i} action${i===1?"":"s"}`}_onDragStart(t){this._dragFrom=t}_onDragOver(t,r){this._dragFrom===null||r===this._dragFrom||(t.preventDefault(),this._dragOver=r)}_onDrop(t){let r=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(r===null||r===t)&&this._emit("reorder-rules",{from:r,to:t})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(t,r){let s=r.name||`Rule ${t+1}`;window.confirm(`Delete "${s}"?`)&&this._emit("delete-rule",{index:t})}render(){return this.rules.length===0?h`
        <p class="empty">No rules yet.</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          + Add rule
        </button>
      `:h`
      <ul>
        ${this.rules.map((t,r)=>h`
            <li
              class=${this._dragOver===r?"drag-over":""}
              draggable=${!this.autoSort}
              @dragstart=${()=>this._onDragStart(r)}
              @dragover=${s=>this._onDragOver(s,r)}
              @drop=${()=>this._onDrop(r)}
              @dragend=${this._onDragEnd}
            >
              ${this.autoSort?"":h`<span class="handle" title="Drag to reorder">⠿</span>`}
              <span class="idx">${r+1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${()=>this._emit("edit-rule",{index:r})}
                >
                  ${t.name||`Rule ${r+1}`}
                </div>
                <div class="summary">${this._summary(t)}</div>
              </div>
              <button
                @click=${()=>this._emit("duplicate-rule",{index:r})}
                title="Duplicate"
              >
                ⧉
              </button>
              <button
                @click=${()=>this._confirmDelete(r,t)}
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
    `}};E.styles=v`
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
  `,c([u({attribute:!1})],E.prototype,"rules",2),c([u({type:Boolean})],E.prototype,"autoSort",2),c([_()],E.prototype,"_dragFrom",2),c([_()],E.prototype,"_dragOver",2),E=c([y("ambience-rules-list")],E);var O=class extends m{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._listId=`scene-suggestions-${Math.random().toString(36).slice(2)}`}_onInput(t){let r=t.target.value;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r.trim()===""?null:r},bubbles:!0,composed:!0}))}render(){return h`
      <input
        type="text"
        list=${this._listId}
        placeholder="(any scene)"
        .value=${this.value??""}
        @input=${this._onInput}
      />
      <datalist id=${this._listId}>
        ${this.suggestions.map(t=>h`<option value=${t}></option>`)}
      </datalist>
    `}};O.styles=v`
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
  `,c([u()],O.prototype,"value",2),c([u({attribute:!1})],O.prototype,"suggestions",2),O=c([y("ambience-scene-combobox")],O);var k=class extends m{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(t){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_onText(t){let r=t.target.value;this._emit(r.trim()===""?null:r)}render(){return this.matcher.input==="scene_combobox"?h`
        <ambience-scene-combobox
          .value=${this.value??null}
          .suggestions=${this.sceneSuggestions}
          @value-changed=${t=>{t.stopPropagation(),this._emit(t.detail.value)}}
        ></ambience-scene-combobox>
      `:h`
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
  `,c([u({attribute:!1})],k.prototype,"matcher",2),c([u({attribute:!1})],k.prototype,"value",2),c([u({attribute:!1})],k.prototype,"sceneSuggestions",2),k=c([y("ambience-matcher-input")],k);var b=class extends m{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null}willUpdate(t){t.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null)}_setName(t){this._draft&&(this._draft={...this._draft,name:t||void 0})}_setPredicate(t,r){if(!this._draft)return;let s={...this._draft.when};r==null?delete s[t]:s[t]=r,this._draft={...this._draft,when:s}}_addActionSlot(){if(!this._draft)return;let t={action:"set_light",targets:{}};this._draft={...this._draft,actions:[...this._draft.actions,t]}}_updateActionAt(t,r){if(!this._draft)return;let s=this._draft.actions.map((i,o)=>o===t?r(i):i);this._draft={...this._draft,actions:s}}_changeActionType(t,r){this._updateActionAt(t,()=>({action:r,targets:{}}))}_deleteAction(t){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((r,s)=>s!==t)})}_addTarget(t){this._updateActionAt(t,r=>{let s=this.availableActions.find(o=>o.name===r.action),i={};return s?.target_params.forEach(o=>{"default"in o&&(i[o.name]=o.default)}),{...r,targets:{...r.targets,"":i}}})}_updateTargetId(t,r,s){this._updateActionAt(t,i=>{if(r===s)return i;let o={...i.targets};return o[s]=o[r],delete o[r],{...i,targets:o}})}_updateTargetParam(t,r,s,i){this._updateActionAt(t,o=>{let a={...o.targets},l={...a[r]??{}},d=i;return s.type==="int"?d=i===""?void 0:parseInt(i,10):s.type==="number"?d=i===""?void 0:parseFloat(i):s.type==="boolean"&&(d=i==="true"),d===void 0?delete l[s.name]:l[s.name]=d,a[r]=l,{...o,targets:a}})}_deleteTarget(t,r){this._updateActionAt(t,s=>{let i={...s.targets};return delete i[r],{...s,targets:i}})}_renderTargets(t,r){let s=this.availableActions.find(a=>a.name===r.action),i=s?.target_params??[],o=Object.entries(r.targets);return o.length===0?h`<p
        style="color: var(--secondary-text-color, #888); margin: 0.5rem 0;"
      >
        No targets yet.
      </p>`:h`
      ${o.map(([a,l])=>h`
          <div
            style="display: grid; grid-template-columns: 1fr ${"1fr ".repeat(i.length)}auto; gap: 0.5rem; margin: 0.5rem 0; align-items: end;"
          >
            <div>
              <label>entity_id</label>
              <input
                type="text"
                .value=${a}
                placeholder="${s?.domains?.[0]??"domain"}.example"
                @change=${d=>this._updateTargetId(t,a,d.target.value)}
              />
            </div>
            ${i.map(d=>h`
                <div>
                  <label>${d.name}${d.required?" *":""}</label>
                  <input
                    type=${d.type==="int"||d.type==="number"?"number":"text"}
                    .value=${String(l[d.name]??"")}
                    min=${d.min??""}
                    max=${d.max??""}
                    @input=${g=>this._updateTargetParam(t,a,d,g.target.value)}
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
    `}_save(){this._draft&&this.dispatchEvent(new CustomEvent("save-rule",{detail:this._draft,bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){return this._draft?h`
      <div class="modal">
        <h2>${this._draft.name||"New rule"}</h2>

        <label>Name (optional)</label>
        <input
          type="text"
          .value=${this._draft.name??""}
          @input=${t=>this._setName(t.target.value)}
        />

        <h3>When</h3>
        ${this.matchers.map(t=>h`
            <label>${t.name==="scene"?"Scene":t.name}</label>
            <ambience-matcher-input
              .matcher=${t}
              .value=${this._draft.when[t.name]??null}
              .sceneSuggestions=${this.sceneSuggestions}
              @value-changed=${r=>this._setPredicate(t.name,r.detail.value)}
            ></ambience-matcher-input>
          `)}

        <h3>Actions</h3>
        ${this._draft.actions.map((t,r)=>h`
            <div
              style="border: 1px solid var(--divider-color, #e0e0e0); border-radius: 4px; padding: 0.75rem; margin-bottom: 0.5rem;"
            >
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <select
                  @change=${s=>this._changeActionType(r,s.target.value)}
                >
                  ${this.availableActions.map(s=>h`
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
                  @click=${()=>this._deleteAction(r)}
                >
                  Remove action
                </button>
              </div>

              ${this._renderTargets(r,t)}

              <button
                class="secondary"
                @click=${()=>this._addTarget(r)}
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
    `:h``}};b.styles=v`
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
  `,c([u({type:Boolean,reflect:!0})],b.prototype,"open",2),c([u({attribute:!1})],b.prototype,"rule",2),c([u({attribute:!1})],b.prototype,"matchers",2),c([u({attribute:!1})],b.prototype,"sceneSuggestions",2),c([u({attribute:!1})],b.prototype,"availableActions",2),c([_()],b.prototype,"_draft",2),b=c([y("ambience-rule-editor")],b);var S=class extends m{constructor(){super(...arguments);this.open=!1;this.matchers=[];this.selected=[];this._draft=new Set}willUpdate(t){(t.has("selected")||t.has("open"))&&this.open&&(this._draft=new Set(this.selected))}_toggle(t,r){let s=new Set(this._draft);r?s.add(t):s.delete(t),this._draft=s}_apply(){this.dispatchEvent(new CustomEvent("apply-matchers",{detail:{matchers:[...this._draft]},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-matchers",{bubbles:!0,composed:!0}))}render(){let t=this.matchers.filter(r=>r.toggleable);return h`
      <div class="modal">
        <h2>Matchers</h2>
        <p class="intro">
          Select which matchers can be used in this area's rule predicates.
        </p>
        ${t.map(r=>h`
            <label class="matcher-row">
              <input
                type="checkbox"
                .checked=${this._draft.has(r.name)}
                @change=${s=>this._toggle(r.name,s.target.checked)}
              />
              <div class="matcher-meta">
                <div class="matcher-name">${r.name}</div>
                <div>${r.description}</div>
                <div class="matcher-help">${r.predicate_help}</div>
              </div>
            </label>
          `)}
        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._apply}>Apply</button>
        </div>
      </div>
    `}};S.styles=v`
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
  `,c([u({type:Boolean,reflect:!0})],S.prototype,"open",2),c([u({attribute:!1})],S.prototype,"matchers",2),c([u({attribute:!1})],S.prototype,"selected",2),c([_()],S.prototype,"_draft",2),S=c([y("ambience-matchers-modal")],S);var $=class extends m{constructor(){super(...arguments);this._areas=[];this._matchers=[];this._actions=[];this._configs=new Map;this._expanded=new Set;this._error="";this._editing=null;this._matchersModalArea=null}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await this._refreshAreas(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _loadStatic(){try{let[t,r]=await Promise.all([Rt(this.hass),Tt(this.hass)]);if(!this.isConnected)return;this._matchers=t,this._actions=r}catch(t){this._error=t.message||String(t)}}async _refreshAreas(){try{let t=await Ct(this.hass),r=new Map;if(await Promise.all(t.map(async s=>{r.set(s.area_id,this._normalize(await kt(this.hass,s.area_id)))})),!this.isConnected)return;this._areas=t,this._configs=r}catch(t){this._error=t.message||String(t)}}_normalize(t){return{matchers:t.matchers??[],rules:t.rules??[],auto_sort:t.auto_sort??!0}}async _subscribe(){let t=await this.hass.connection.subscribeEvents(r=>{if(r.data.action==="remove"){let s=r.data.area_id,i=new Set(this._expanded);i.delete(s),this._expanded=i,this._editing?.areaId===s&&(this._editing=null),this._matchersModalArea===s&&(this._matchersModalArea=null)}this._refreshAreas()},"area_registry_updated");this.isConnected?this._unsub=t:t()}_setConfig(t,r){let s=new Map(this._configs);s.set(t,r),this._configs=s}async _mutate(t,r){let s=this._configs.get(t);this._setConfig(t,r),this._error="";try{let{config:i}=await Pt(this.hass,t,r);this._setConfig(t,this._normalize(i))}catch(i){s&&this._setConfig(t,s),this._error=i.message||String(i)}}_toggleExpand(t){let r=new Set(this._expanded);r.has(t)?r.delete(t):r.add(t),this._expanded=r}_openMatchersModal(t){this._matchersModalArea=t}_applyMatchers(t){let r=this._matchersModalArea;if(this._matchersModalArea=null,!r)return;let s=this._configs.get(r);s&&this._mutate(r,{...s,matchers:t.detail.matchers})}_toggleAutoSort(t,r){let s=this._configs.get(t);s&&this._mutate(t,{...s,auto_sort:r})}_addRule(t){let r=this._configs.get(t);r&&(this._editing={areaId:t,index:r.rules.length,isNew:!0})}_editRule(t,r){this._editing={areaId:t,index:r.detail.index,isNew:!1}}_duplicateRule(t,r){let s=this._configs.get(t);if(!s)return;let i=s.rules[r.detail.index];if(!i)return;let o=JSON.parse(JSON.stringify(i)),a=[...s.rules];a.splice(r.detail.index+1,0,o),this._mutate(t,{...s,rules:a})}_deleteRule(t,r){let s=this._configs.get(t);if(!s)return;let i=s.rules.filter((o,a)=>a!==r.detail.index);this._mutate(t,{...s,rules:i})}_reorderRules(t,r){let s=this._configs.get(t);if(!s)return;let{from:i,to:o}=r.detail,a=[...s.rules],[l]=a.splice(i,1);a.splice(o,0,l),this._mutate(t,{...s,rules:a})}_saveRule(t){let r=this._editing;if(this._editing=null,!r)return;let s=this._configs.get(r.areaId);if(!s)return;let i=[...s.rules];r.isNew?i.push(t.detail):i[r.index]=t.detail,this._mutate(r.areaId,{...s,rules:i})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._configs.get(this._editing.areaId)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let t=this._configs.get(this._editing.areaId);if(!t)return[];let r=new Set;for(let s of t.rules){let i=s.when.scene;typeof i=="string"&&i&&r.add(i)}return[...r].sort((s,i)=>s.toLowerCase().localeCompare(i.toLowerCase()))}get _editorMatchers(){if(!this._editing)return[];let t=this._configs.get(this._editing.areaId);if(!t)return[];let r=this._matchers.find(i=>i.name==="scene"),s=this._matchers.filter(i=>t.matchers.includes(i.name));return r?[r,...s]:s}_summary(t){if(t.rules.length===0&&t.matchers.length===0)return"not configured";let r=t.rules.length,s=t.matchers.length;return`${r} rule${r===1?"":"s"} \xB7 ${s} matcher${s===1?"":"s"}`}render(){return h`
      ${this._error?h`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?h`<p class="empty">No areas found in Home Assistant.</p>`:h`<ul>
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
    `}_renderArea(t){let r=this._configs.get(t.area_id);if(!r)return h``;let s=this._expanded.has(t.area_id);return h`
      <li>
        <div
          class="area-header"
          @click=${()=>this._toggleExpand(t.area_id)}
        >
          <span class="chevron ${s?"open":""}">▶</span>
          <span class="area-name">${t.name}</span>
          <span class="area-summary">${this._summary(r)}</span>
          <button
            class="cog"
            title="Matchers"
            @click=${i=>{i.stopPropagation(),this._openMatchersModal(t.area_id)}}
          >
            ⚙
          </button>
        </div>
        ${s?h`
              <div class="area-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!r.auto_sort}
                    @change=${i=>this._toggleAutoSort(t.area_id,!i.target.checked)}
                  />
                  Order rules manually
                </label>
                <ambience-rules-list
                  .rules=${r.rules}
                  ?autoSort=${r.auto_sort}
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
  `,c([u({attribute:!1})],$.prototype,"hass",2),c([_()],$.prototype,"_areas",2),c([_()],$.prototype,"_matchers",2),c([_()],$.prototype,"_actions",2),c([_()],$.prototype,"_configs",2),c([_()],$.prototype,"_expanded",2),c([_()],$.prototype,"_error",2),c([_()],$.prototype,"_editing",2),c([_()],$.prototype,"_matchersModalArea",2),$=c([y("ambience-areas-list")],$);var U=class extends m{render(){return h`
      <header><h1>Ambience</h1></header>
      <ambience-areas-list .hass=${this.hass}></ambience-areas-list>
    `}};U.styles=v`
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
  `,c([u({attribute:!1})],U.prototype,"hass",2),U=c([y("ambience-panel")],U);export{U as AmbiencePanel};
