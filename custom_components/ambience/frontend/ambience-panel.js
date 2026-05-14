/* Ambience panel — bundled output. Do not edit by hand. */
var Mt=Object.defineProperty;var Pt=Object.getOwnPropertyDescriptor;var h=(i,t,e,r)=>{for(var s=r>1?void 0:r?Pt(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(t,e,s):o(s))||s);return r&&s&&Mt(t,e,s),s};var B=globalThis,F=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol(),lt=new WeakMap,N=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==G)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(F&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=lt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&lt.set(e,t))}return t}toString(){return this.cssText}},ct=i=>new N(typeof i=="string"?i:i+"",void 0,G),b=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new N(e,i,G)},dt=(i,t)=>{if(F)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),s=B.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Q=F?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return ct(e)})(i):i;var{is:Tt,defineProperty:Ht,getOwnPropertyDescriptor:It,getOwnPropertyNames:Nt,getOwnPropertySymbols:Ut,getPrototypeOf:Ot}=Object,J=globalThis,ht=J.trustedTypes,jt=ht?ht.emptyScript:"",Lt=J.reactiveElementPolyfillSupport,U=(i,t)=>i,O={toAttribute(i,t){switch(t){case Boolean:i=i?jt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},K=(i,t)=>!Tt(i,t),ut={attribute:!0,type:String,converter:O,reflect:!1,useDefault:!1,hasChanged:K};Symbol.metadata??=Symbol("metadata"),J.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ut){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Ht(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){let{get:s,set:n}=It(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let l=s?.call(this);n?.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ut}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;let t=Ot(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){let e=this.properties,r=[...Nt(e),...Ut(e)];for(let s of r)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let s of r)e.unshift(Q(s))}else t!==void 0&&e.push(Q(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return dt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute!==void 0?r.converter:O).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){let r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let n=r.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:O;this._$Em=s;let l=o.fromAttribute(e,n.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,r,s=!1,n){if(t!==void 0){let o=this.constructor;if(s===!1&&(n=this[t]),r??=o.getPropertyOptions(t),!((r.hasChanged??K)(n,e)||r.useDefault&&r.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,n]of r){let{wrapped:o}=n,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[U("elementProperties")]=new Map,A[U("finalized")]=new Map,Lt?.({ReactiveElement:A}),(J.reactiveElementVersions??=[]).push("2.1.2");var it=globalThis,pt=i=>i,V=it.trustedTypes,mt=V?V.createPolicy("lit-html",{createHTML:i=>i}):void 0,$t="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,yt="?"+E,Dt=`<${yt}>`,R=document,L=()=>R.createComment(""),D=i=>i===null||typeof i!="object"&&typeof i!="function",nt=Array.isArray,qt=i=>nt(i)||typeof i?.[Symbol.iterator]=="function",X=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ft=/-->/g,_t=/>/g,C=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gt=/'/g,vt=/"/g,xt=/^(?:script|style|textarea|title)$/i,ot=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),c=ot(1),Xt=ot(2),Yt=ot(3),M=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),bt=new WeakMap,k=R.createTreeWalker(R,129);function At(i,t){if(!nt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return mt!==void 0?mt.createHTML(t):t}var zt=(i,t)=>{let e=i.length-1,r=[],s,n=t===2?"<svg>":t===3?"<math>":"",o=j;for(let l=0;l<e;l++){let a=i[l],d,p,u=-1,x=0;for(;x<a.length&&(o.lastIndex=x,p=o.exec(a),p!==null);)x=o.lastIndex,o===j?p[1]==="!--"?o=ft:p[1]!==void 0?o=_t:p[2]!==void 0?(xt.test(p[2])&&(s=RegExp("</"+p[2],"g")),o=C):p[3]!==void 0&&(o=C):o===C?p[0]===">"?(o=s??j,u=-1):p[1]===void 0?u=-2:(u=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?C:p[3]==='"'?vt:gt):o===vt||o===gt?o=C:o===ft||o===_t?o=j:(o=C,s=void 0);let S=o===C&&i[l+1].startsWith("/>")?" ":"";n+=o===j?a+Dt:u>=0?(r.push(d),a.slice(0,u)+$t+a.slice(u)+E+S):a+E+(u===-2?l:S)}return[At(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},q=class i{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0,l=t.length-1,a=this.parts,[d,p]=zt(t,e);if(this.el=i.createElement(d,r),k.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=k.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith($t)){let x=p[o++],S=s.getAttribute(u).split(E),W=/([.?@])?(.*)/.exec(x);a.push({type:1,index:n,name:W[2],strings:S,ctor:W[1]==="."?tt:W[1]==="?"?et:W[1]==="@"?rt:H}),s.removeAttribute(u)}else u.startsWith(E)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(xt.test(s.tagName)){let u=s.textContent.split(E),x=u.length-1;if(x>0){s.textContent=V?V.emptyScript:"";for(let S=0;S<x;S++)s.append(u[S],L()),k.nextNode(),a.push({type:2,index:++n});s.append(u[x],L())}}}else if(s.nodeType===8)if(s.data===yt)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(E,u+1))!==-1;)a.push({type:7,index:n}),u+=E.length-1}n++}}static createElement(t,e){let r=R.createElement("template");return r.innerHTML=t,r}};function T(i,t,e=i,r){if(t===M)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl,n=D(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=T(i,s._$AS(i,t.values),s,r)),t}var Y=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??R).importNode(e,!0);k.currentNode=s;let n=k.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new z(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new st(n,this,t)),this._$AV.push(d),a=r[++l]}o!==a?.index&&(n=k.nextNode(),o++)}return k.currentNode=R,s}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},z=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=T(this,t,e),D(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==M&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):qt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&D(this._$AH)?this._$AA.nextSibling.data=t:this.T(R.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=q.createElement(At(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new Y(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=bt.get(t.strings);return e===void 0&&bt.set(t.strings,e=new q(t)),e}k(t){nt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,s=0;for(let n of t)s===e.length?e.push(r=new i(this.O(L()),this.O(L()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=pt(t).nextSibling;pt(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=m}_$AI(t,e=this,r,s){let n=this.strings,o=!1;if(n===void 0)t=T(this,t,e,0),o=!D(t)||t!==this._$AH&&t!==M,o&&(this._$AH=t);else{let l=t,a,d;for(t=n[0],a=0;a<n.length-1;a++)d=T(this,l[r+a],e,a),d===M&&(d=this._$AH[a]),o||=!D(d)||d!==this._$AH[a],d===m?t=m:t!==m&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},tt=class extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}},et=class extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},rt=class extends H{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=T(this,t,e,0)??m)===M)return;let r=this._$AH,s=t===m&&r!==m||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==m&&(r===m||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},st=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){T(this,t)}};var Wt=it.litHtmlPolyfillSupport;Wt?.(q,z),(it.litHtmlVersions??=[]).push("3.3.2");var St=(i,t,e)=>{let r=e?.renderBefore??t,s=r._$litPart$;if(s===void 0){let n=e?.renderBefore??null;r._$litPart$=s=new z(t.insertBefore(L(),n),n,void 0,e??{})}return s._$AI(i),s};var at=globalThis,_=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=St(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};_._$litElement$=!0,_.finalized=!0,at.litElementHydrateSupport?.({LitElement:_});var Bt=at.litElementPolyfillSupport;Bt?.({LitElement:_});(at.litElementVersions??=[]).push("4.2.2");var y=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var Ft={attribute:!0,type:String,converter:O,reflect:!1,hasChanged:K},Jt=(i=Ft,t,e)=>{let{kind:r,metadata:s}=e,n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),r==="accessor"){let{name:o}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(r==="setter"){let{name:o}=e;return function(l){let a=this[o];t.call(this,l),this.requestUpdate(o,a,i,!0,l)}}throw Error("Unsupported decorator location: "+r)};function f(i){return(t,e)=>typeof e=="object"?Jt(i,t,e):((r,s,n)=>{let o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}function g(i){return f({...i,state:!0,attribute:!1})}async function Et(i){return i.callWS({type:"ambience/areas/list"})}async function wt(i,t){return i.callWS({type:"ambience/area/get",area_id:t})}async function Ct(i,t,e){return i.callWS({type:"ambience/area/save",area_id:t,config:e})}async function kt(i){return i.callWS({type:"ambience/matchers/list"})}async function Rt(i){return i.callWS({type:"ambience/actions/list"})}var w=class extends _{constructor(){super(...arguments);this._areas=[];this._error=""}connectedCallback(){super.connectedCallback(),this._refresh(),this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _subscribe(){let e=await this.hass.connection.subscribeEvents(()=>this._refresh(),"area_registry_updated");this.isConnected?this._unsub=e:e()}async _refresh(){try{this._areas=await Et(this.hass)}catch(e){this._error=String(e)}}_open(e){this.dispatchEvent(new CustomEvent("open-area",{detail:{areaId:e},bubbles:!0,composed:!0}))}render(){return c`
      ${this._error?c`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?c`<p class="empty">No areas found in Home Assistant.</p>`:c`
            <ul>
              ${this._areas.map(e=>c`
                  <li @click=${()=>this._open(e.area_id)}>
                    ${e.name} <small>(${e.area_id})</small>
                  </li>
                `)}
            </ul>
          `}
    `}};w.styles=b`
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
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      padding: 0.75rem 1rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
      cursor: pointer;
    }
    li:hover {
      border-color: var(--primary-color, #03a9f4);
    }
    .error {
      color: var(--error-color, #d32f2f);
      margin-top: 0.5rem;
    }
  `,h([f({attribute:!1})],w.prototype,"hass",2),h([g()],w.prototype,"_areas",2),h([g()],w.prototype,"_error",2),w=h([y("ambience-areas-list")],w);var I=class extends _{constructor(){super(...arguments);this.rules=[]}_emit(e,r){this.dispatchEvent(new CustomEvent(e,{detail:r,bubbles:!0,composed:!0}))}render(){return this.rules.length===0?c`
        <p class="empty">No rules yet.</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          + Add rule
        </button>
      `:c`
      <ul>
        ${this.rules.map((e,r)=>c`
            <li>
              <span class="idx">${r+1}</span>
              <div style="flex: 1">
                <div class="name" @click=${()=>this._emit("edit-rule",{index:r})}>
                  ${e.name||`Rule ${r+1}`}
                </div>
                <div class="summary">
                  scene=${e.when.scene??"*"},
                  actions=${e.actions.length}
                </div>
              </div>
              <button
                ?disabled=${r===0}
                @click=${()=>this._emit("move-rule",{index:r,delta:-1})}
                title="Move up"
              >↑</button>
              <button
                ?disabled=${r===this.rules.length-1}
                @click=${()=>this._emit("move-rule",{index:r,delta:1})}
                title="Move down"
              >↓</button>
              <button @click=${()=>this._emit("delete-rule",{index:r})}>×</button>
            </li>
          `)}
      </ul>
      <button class="add" @click=${()=>this._emit("add-rule",{})}>
        + Add rule
      </button>
    `}};I.styles=b`
    :host { display: block; }
    .empty {
      color: var(--secondary-text-color, #888);
      padding: 1rem;
      text-align: center;
    }
    ul { list-style: none; padding: 0; margin: 0; }
    li {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
    }
    .idx {
      font-family: monospace;
      color: var(--secondary-text-color, #888);
      margin-right: 0.75rem;
      min-width: 2em;
    }
    .name {
      flex: 1;
      cursor: pointer;
    }
    .name:hover { text-decoration: underline; }
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
    }
    button:disabled {
      color: var(--disabled-text-color, #ccc);
      cursor: default;
    }
    .add {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      margin-top: 0.5rem;
    }
  `,h([f({attribute:!1})],I.prototype,"rules",2),I=h([y("ambience-rules-list")],I);var $=class extends _{constructor(){super(...arguments);this.open=!1;this.rule=null;this.scenes=[];this.activeMatchers=[];this.availableActions=[];this._draft=null}willUpdate(e){e.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_setScene(e){if(!this._draft)return;let r={...this._draft.when};e===""?r.scene=null:r.scene=e,this._draft={...this._draft,when:r}}_setPredicate(e,r){if(!this._draft)return;let s={...this._draft.when};r.trim()===""?delete s[e]:s[e]=r,this._draft={...this._draft,when:s}}_addActionSlot(){if(!this._draft)return;let e={action:"set_light",targets:{}};this._draft={...this._draft,actions:[...this._draft.actions,e]}}_updateActionAt(e,r){if(!this._draft)return;let s=this._draft.actions.map((n,o)=>o===e?r(n):n);this._draft={...this._draft,actions:s}}_changeActionType(e,r){this._updateActionAt(e,()=>({action:r,targets:{}}))}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((r,s)=>s!==e)})}_addTarget(e){this._updateActionAt(e,r=>{let s=this.availableActions.find(o=>o.name===r.action),n={};return s?.target_params.forEach(o=>{"default"in o&&(n[o.name]=o.default)}),{...r,targets:{...r.targets,"":n}}})}_updateTargetId(e,r,s){this._updateActionAt(e,n=>{if(r===s)return n;let o={...n.targets};return o[s]=o[r],delete o[r],{...n,targets:o}})}_updateTargetParam(e,r,s,n){this._updateActionAt(e,o=>{let l={...o.targets},a={...l[r]??{}},d=n;return s.type==="int"?d=n===""?void 0:parseInt(n,10):s.type==="number"?d=n===""?void 0:parseFloat(n):s.type==="boolean"&&(d=n==="true"),d===void 0?delete a[s.name]:a[s.name]=d,l[r]=a,{...o,targets:l}})}_deleteTarget(e,r){this._updateActionAt(e,s=>{let n={...s.targets};return delete n[r],{...s,targets:n}})}_renderTargets(e,r){let s=this.availableActions.find(l=>l.name===r.action),n=s?.target_params??[],o=Object.entries(r.targets);return o.length===0?c`<p style="color: var(--secondary-text-color, #888); margin: 0.5rem 0;">No targets yet.</p>`:c`
      ${o.map(([l,a])=>c`
          <div style="display: grid; grid-template-columns: 1fr ${"1fr ".repeat(n.length)}auto; gap: 0.5rem; margin: 0.5rem 0; align-items: end;">
            <div>
              <label>entity_id</label>
              <input
                type="text"
                .value=${l}
                placeholder="${s?.domains?.[0]??"domain"}.example"
                @change=${d=>this._updateTargetId(e,l,d.target.value)}
              />
            </div>
            ${n.map(d=>c`
                <div>
                  <label>${d.name}${d.required?" *":""}</label>
                  <input
                    type=${d.type==="int"||d.type==="number"?"number":"text"}
                    .value=${String(a[d.name]??"")}
                    min=${d.min??""}
                    max=${d.max??""}
                    @input=${p=>this._updateTargetParam(e,l,d,p.target.value)}
                  />
                </div>
              `)}
            <button
              class="secondary"
              @click=${()=>this._deleteTarget(e,l)}
              title="Remove target"
            >×</button>
          </div>
        `)}
    `}_save(){this._draft&&this.dispatchEvent(new CustomEvent("save-rule",{detail:this._draft,bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){return this._draft?c`
      <div class="modal">
        <h2>${this._draft.name||"New rule"}</h2>

        <label>Name (optional)</label>
        <input
          type="text"
          .value=${this._draft.name??""}
          @input=${e=>this._setName(e.target.value)}
        />

        <h3>When</h3>

        <label>Scene</label>
        <select
          @change=${e=>this._setScene(e.target.value)}
        >
          <option value="" ?selected=${this._draft.when.scene==null}>
            (any scene)
          </option>
          ${this.scenes.map(e=>c`
              <option value=${e} ?selected=${this._draft.when.scene===e}>
                ${e}
              </option>
            `)}
        </select>

        ${this.activeMatchers.map(e=>c`
            <label>${e.name}</label>
            <input
              type="text"
              placeholder="(any)"
              .value=${String(this._draft.when[e.name]??"")}
              @input=${r=>this._setPredicate(e.name,r.target.value)}
            />
            <div class="help">${e.predicate_help}</div>
          `)}

        <h3>Actions</h3>
        ${this._draft.actions.map((e,r)=>c`
            <div style="border: 1px solid var(--divider-color, #e0e0e0); border-radius: 4px; padding: 0.75rem; margin-bottom: 0.5rem;">
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <select
                  @change=${s=>this._changeActionType(r,s.target.value)}
                >
                  ${this.availableActions.map(s=>c`
                      <option
                        value=${s.name}
                        ?selected=${e.action===s.name}
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

              ${this._renderTargets(r,e)}

              <button class="secondary" @click=${()=>this._addTarget(r)}>
                + Add target
              </button>
            </div>
          `)}
        <button class="secondary" @click=${this._addActionSlot}>+ Add action</button>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._save}>Save rule</button>
        </div>
      </div>
    `:c``}};$.styles=b`
    :host {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 100;
      align-items: center;
      justify-content: center;
    }
    :host([open]) { display: flex; }
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
    h2 { margin: 0 0 1rem 0; }
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
    input, select, textarea {
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
  `,h([f({type:Boolean,reflect:!0})],$.prototype,"open",2),h([f({attribute:!1})],$.prototype,"rule",2),h([f({attribute:!1})],$.prototype,"scenes",2),h([f({attribute:!1})],$.prototype,"activeMatchers",2),h([f({attribute:!1})],$.prototype,"availableActions",2),h([g()],$.prototype,"_draft",2),$=h([y("ambience-rule-editor")],$);var v=class extends _{constructor(){super(...arguments);this.areaId="";this._config=null;this._matchers=[];this._tab="scenes";this._error="";this._saved=!1;this._editingRuleIdx=null;this._isNewRule=!1;this._availableActions=[]}async connectedCallback(){super.connectedCallback(),await this._load(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _subscribe(){let e=await this.hass.connection.subscribeEvents(r=>{r.data.action==="remove"&&r.data.area_id===this.areaId&&this.dispatchEvent(new CustomEvent("close-area",{bubbles:!0,composed:!0}))},"area_registry_updated");this.isConnected?this._unsub=e:e()}async _load(){try{let[e,r,s]=await Promise.all([wt(this.hass,this.areaId),kt(this.hass),Rt(this.hass)]);this._config=e,this._matchers=r,this._availableActions=s}catch(e){this._error=e.message||String(e)}}_setTab(e){this._tab=e,this._saved=!1,this._error=""}_addScene(){this._config&&(this._config={...this._config,scenes:[...this._config.scenes,""]})}_updateScene(e,r){if(!this._config)return;let s=[...this._config.scenes];s[e]=r,this._config={...this._config,scenes:s}}_removeScene(e){if(!this._config)return;let r=this._config.scenes.filter((s,n)=>n!==e);this._config={...this._config,scenes:r}}_toggleMatcher(e,r){if(!this._config)return;let s=new Set(this._config.matchers);r?s.add(e):s.delete(e),this._config={...this._config,matchers:[...s]}}async _save(){if(this._config){this._error="",this._saved=!1;try{await Ct(this.hass,this.areaId,this._config),this._saved=!0}catch(e){this._error=e.message||String(e)}}}render(){return this._config?c`
      <div class="tabs">
        <button
          class="tab ${this._tab==="scenes"?"active":""}"
          @click=${()=>this._setTab("scenes")}
        >
          Scenes
        </button>
        <button
          class="tab ${this._tab==="matchers"?"active":""}"
          @click=${()=>this._setTab("matchers")}
        >
          Matchers
        </button>
        <button
          class="tab ${this._tab==="rules"?"active":""}"
          @click=${()=>this._setTab("rules")}
        >
          Rules
        </button>
      </div>

      ${this._tab==="scenes"?this._renderScenes():""}
      ${this._tab==="matchers"?this._renderMatchers():""}
      ${this._tab==="rules"?this._renderRules():""}

      <div class="save-bar">
        <button @click=${this._save}>Save</button>
        ${this._error?c`<span class="error">${this._error}</span>`:""}
        ${this._saved?c`<span class="saved">Saved.</span>`:""}
      </div>

      <ambience-rule-editor
        ?open=${this._editingRuleIdx!==null}
        .rule=${this._editingRule}
        .scenes=${this._config.scenes}
        .activeMatchers=${this._activeMatcherInfos}
        .availableActions=${this._availableActions}
        @save-rule=${this._saveRule}
        @cancel-rule=${this._cancelRule}
      ></ambience-rule-editor>
    `:c`<p>Loading…</p>`}_renderScenes(){return c`
      <h3>Scenes</h3>
      ${this._config.scenes.map((e,r)=>c`
          <div class="row">
            <input
              type="text"
              .value=${e}
              @input=${s=>this._updateScene(r,s.target.value)}
            />
            <button class="secondary" @click=${()=>this._removeScene(r)}>×</button>
          </div>
        `)}
      <button class="secondary" @click=${this._addScene}>+ Add scene</button>
    `}_renderMatchers(){return c`
      <h3>Matchers</h3>
      <p>Select which matchers can be used in this area's rule predicates.</p>
      ${this._matchers.map(e=>c`
          <div class="matcher-row">
            <input
              type="checkbox"
              .checked=${this._config.matchers.includes(e.name)}
              @change=${r=>this._toggleMatcher(e.name,r.target.checked)}
            />
            <div class="matcher-meta">
              <div class="matcher-name">${e.name}</div>
              <div>${e.description}</div>
              <div class="matcher-help">${e.predicate_help}</div>
            </div>
          </div>
        `)}
    `}_renderRules(){return c`
      <h3>Rules</h3>
      <p>Rules are evaluated in order — the first match wins.</p>
      <ambience-rules-list
        .rules=${this._config.rules}
        @add-rule=${this._addRule}
        @delete-rule=${this._deleteRule}
        @move-rule=${this._moveRule}
        @edit-rule=${this._editRule}
      ></ambience-rules-list>
    `}_addRule(){if(!this._config)return;let e={when:{scene:null},actions:[]};this._config={...this._config,rules:[...this._config.rules,e]},this._editingRuleIdx=this._config.rules.length-1,this._isNewRule=!0}_editRule(e){this._editingRuleIdx=e.detail.index,this._isNewRule=!1}_saveRule(e){if(!this._config||this._editingRuleIdx===null)return;let r=[...this._config.rules];r[this._editingRuleIdx]=e.detail,this._config={...this._config,rules:r},this._editingRuleIdx=null,this._isNewRule=!1}_cancelRule(){if(this._isNewRule&&this._config&&this._editingRuleIdx!==null){let e=this._config.rules.filter((r,s)=>s!==this._editingRuleIdx);this._config={...this._config,rules:e}}this._editingRuleIdx=null,this._isNewRule=!1}get _editingRule(){return this._editingRuleIdx===null||!this._config?null:this._config.rules[this._editingRuleIdx]??null}get _activeMatcherInfos(){if(!this._config)return[];let e=new Set(this._config.matchers);return this._matchers.filter(r=>e.has(r.name))}_deleteRule(e){if(!this._config)return;let r=this._config.rules.filter((s,n)=>n!==e.detail.index);this._config={...this._config,rules:r}}_moveRule(e){if(!this._config)return;let{index:r,delta:s}=e.detail,n=r+s;if(n<0||n>=this._config.rules.length)return;let o=[...this._config.rules];[o[r],o[n]]=[o[n],o[r]],this._config={...this._config,rules:o}}};v.styles=b`
    :host {
      display: block;
      padding: 1rem;
      max-width: 60rem;
      margin: 0 auto;
    }
    .tabs {
      display: flex;
      gap: 0;
      border-bottom: 2px solid var(--divider-color, #e0e0e0);
      margin-bottom: 1rem;
    }
    .tab {
      padding: 0.75rem 1.25rem;
      cursor: pointer;
      border: 0;
      background: transparent;
      color: var(--primary-text-color, inherit);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
    }
    .tab.active {
      border-bottom-color: var(--primary-color, #03a9f4);
      font-weight: 600;
    }
    .field {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 600;
    }
    input, select, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
      box-sizing: border-box;
    }
    button {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border: 0;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    button.secondary {
      background: transparent;
      color: var(--primary-color, #03a9f4);
    }
    .row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .row input {
      flex: 1;
    }
    .save-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      margin-top: 1rem;
    }
    .matcher-row {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
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
    .error {
      color: var(--error-color, #d32f2f);
      margin-left: 1rem;
    }
    .saved {
      color: var(--success-color, #4caf50);
      margin-left: 1rem;
    }
  `,h([f({attribute:!1})],v.prototype,"hass",2),h([f()],v.prototype,"areaId",2),h([g()],v.prototype,"_config",2),h([g()],v.prototype,"_matchers",2),h([g()],v.prototype,"_tab",2),h([g()],v.prototype,"_error",2),h([g()],v.prototype,"_saved",2),h([g()],v.prototype,"_editingRuleIdx",2),h([g()],v.prototype,"_isNewRule",2),h([g()],v.prototype,"_availableActions",2),v=h([y("ambience-area-editor")],v);var P=class extends _{constructor(){super(...arguments);this._route={kind:"areas"}}render(){return c`
      <header>
        <h1>Ambience</h1>
        ${this._route.kind==="area"?c`<button @click=${()=>this._openAreas()}>← All areas</button>`:""}
      </header>
      ${this._renderRoute()}
    `}_renderRoute(){return this._route.kind==="areas"?c`
        <ambience-areas-list
          .hass=${this.hass}
          @open-area=${e=>this._openArea(e.detail.areaId)}
        ></ambience-areas-list>
      `:c`
      <ambience-area-editor
        .hass=${this.hass}
        .areaId=${this._route.areaId}
        @close-area=${()=>this._openAreas()}
      ></ambience-area-editor>
    `}_openArea(e){this._route={kind:"area",areaId:e}}_openAreas(){this._route={kind:"areas"}}};P.styles=b`
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
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    button {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border: 0;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
  `,h([f({attribute:!1})],P.prototype,"hass",2),h([g()],P.prototype,"_route",2),P=h([y("ambience-panel")],P);export{P as AmbiencePanel};
