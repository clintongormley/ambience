/* Ambience panel — bundled output. Do not edit by hand. */
var Mt=Object.defineProperty;var It=Object.getOwnPropertyDescriptor;var c=(i,t,e,r)=>{for(var s=r>1?void 0:r?It(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(t,e,s):n(s))||s);return r&&s&&Mt(t,e,s),s};var B=globalThis,V=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol(),ct=new WeakMap,N=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(V&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=ct.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ct.set(e,t))}return t}toString(){return this.cssText}},ht=i=>new N(typeof i=="string"?i:i+"",void 0,Q),$=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new N(e,i,Q)},dt=(i,t)=>{if(V)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),s=B.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},X=V?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return ht(e)})(i):i;var{is:Pt,defineProperty:Ht,getOwnPropertyDescriptor:Tt,getOwnPropertyNames:Nt,getOwnPropertySymbols:Ut,getPrototypeOf:Ot}=Object,J=globalThis,pt=J.trustedTypes,jt=pt?pt.emptyScript:"",Dt=J.reactiveElementPolyfillSupport,U=(i,t)=>i,O={toAttribute(i,t){switch(t){case Boolean:i=i?jt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},K=(i,t)=>!Pt(i,t),ut={attribute:!0,type:String,converter:O,reflect:!1,useDefault:!1,hasChanged:K};Symbol.metadata??=Symbol("metadata"),J.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ut){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Ht(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){let{get:s,set:o}=Tt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){let h=s?.call(this);o?.call(this,n),this.requestUpdate(t,h,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ut}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;let t=Ot(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){let e=this.properties,r=[...Nt(e),...Ut(e)];for(let s of r)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let s of r)e.unshift(X(s))}else t!==void 0&&e.push(X(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return dt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:O).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){let r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let o=r.getPropertyOptions(s),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:O;this._$Em=s;let h=n.fromAttribute(e,o.type);this[s]=h??this._$Ej?.get(s)??h,this._$Em=null}}requestUpdate(t,e,r,s=!1,o){if(t!==void 0){let n=this.constructor;if(s===!1&&(o=this[t]),r??=n.getPropertyOptions(t),!((r.hasChanged??K)(o,e)||r.useDefault&&r.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:o},n){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,o]of r){let{wrapped:n}=o,h=this[s];n!==!0||this._$AL.has(s)||h===void 0||this.C(s,void 0,o,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[U("elementProperties")]=new Map,w[U("finalized")]=new Map,Dt?.({ReactiveElement:w}),(J.reactiveElementVersions??=[]).push("2.1.2");var ot=globalThis,mt=i=>i,F=ot.trustedTypes,ft=F?F.createPolicy("lit-html",{createHTML:i=>i}):void 0,bt="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,xt="?"+E,Lt=`<${xt}>`,R=document,D=()=>R.createComment(""),L=i=>i===null||typeof i!="object"&&typeof i!="function",nt=Array.isArray,qt=i=>nt(i)||typeof i?.[Symbol.iterator]=="function",Y=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_t=/-->/g,gt=/>/g,C=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vt=/'/g,$t=/"/g,St=/^(?:script|style|textarea|title)$/i,at=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),l=at(1),Xt=at(2),Yt=at(3),M=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),yt=new WeakMap,k=R.createTreeWalker(R,129);function wt(i,t){if(!nt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ft!==void 0?ft.createHTML(t):t}var zt=(i,t)=>{let e=i.length-1,r=[],s,o=t===2?"<svg>":t===3?"<math>":"",n=j;for(let h=0;h<e;h++){let a=i[h],p,m,d=-1,S=0;for(;S<a.length&&(n.lastIndex=S,m=n.exec(a),m!==null);)S=n.lastIndex,n===j?m[1]==="!--"?n=_t:m[1]!==void 0?n=gt:m[2]!==void 0?(St.test(m[2])&&(s=RegExp("</"+m[2],"g")),n=C):m[3]!==void 0&&(n=C):n===C?m[0]===">"?(n=s??j,d=-1):m[1]===void 0?d=-2:(d=n.lastIndex-m[2].length,p=m[1],n=m[3]===void 0?C:m[3]==='"'?$t:vt):n===$t||n===vt?n=C:n===_t||n===gt?n=j:(n=C,s=void 0);let A=n===C&&i[h+1].startsWith("/>")?" ":"";o+=n===j?a+Lt:d>=0?(r.push(p),a.slice(0,d)+bt+a.slice(d)+E+A):a+E+(d===-2?h:A)}return[wt(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},q=class i{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,n=0,h=t.length-1,a=this.parts,[p,m]=zt(t,e);if(this.el=i.createElement(p,r),k.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=k.nextNode())!==null&&a.length<h;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(bt)){let S=m[n++],A=s.getAttribute(d).split(E),W=/([.?@])?(.*)/.exec(S);a.push({type:1,index:o,name:W[2],strings:A,ctor:W[1]==="."?et:W[1]==="?"?rt:W[1]==="@"?st:H}),s.removeAttribute(d)}else d.startsWith(E)&&(a.push({type:6,index:o}),s.removeAttribute(d));if(St.test(s.tagName)){let d=s.textContent.split(E),S=d.length-1;if(S>0){s.textContent=F?F.emptyScript:"";for(let A=0;A<S;A++)s.append(d[A],D()),k.nextNode(),a.push({type:2,index:++o});s.append(d[S],D())}}}else if(s.nodeType===8)if(s.data===xt)a.push({type:2,index:o});else{let d=-1;for(;(d=s.data.indexOf(E,d+1))!==-1;)a.push({type:7,index:o}),d+=E.length-1}o++}}static createElement(t,e){let r=R.createElement("template");return r.innerHTML=t,r}};function P(i,t,e=i,r){if(t===M)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl,o=L(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=P(i,s._$AS(i,t.values),s,r)),t}var tt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??R).importNode(e,!0);k.currentNode=s;let o=k.nextNode(),n=0,h=0,a=r[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new z(o,o.nextSibling,this,t):a.type===1?p=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(p=new it(o,this,t)),this._$AV.push(p),a=r[++h]}n!==a?.index&&(o=k.nextNode(),n++)}return k.currentNode=R,s}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},z=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=P(this,t,e),L(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==M&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):qt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(R.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=q.createElement(wt(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{let o=new tt(s,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=yt.get(t.strings);return e===void 0&&yt.set(t.strings,e=new q(t)),e}k(t){nt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,s=0;for(let o of t)s===e.length?e.push(r=new i(this.O(D()),this.O(D()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=mt(t).nextSibling;mt(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=u}_$AI(t,e=this,r,s){let o=this.strings,n=!1;if(o===void 0)t=P(this,t,e,0),n=!L(t)||t!==this._$AH&&t!==M,n&&(this._$AH=t);else{let h=t,a,p;for(t=o[0],a=0;a<o.length-1;a++)p=P(this,h[r+a],e,a),p===M&&(p=this._$AH[a]),n||=!L(p)||p!==this._$AH[a],p===u?t=u:t!==u&&(t+=(p??"")+o[a+1]),this._$AH[a]=p}n&&!s&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},et=class extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},rt=class extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},st=class extends H{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=P(this,t,e,0)??u)===M)return;let r=this._$AH,s=t===u&&r!==u||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==u&&(r===u||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},it=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}};var Wt=ot.litHtmlPolyfillSupport;Wt?.(q,z),(ot.litHtmlVersions??=[]).push("3.3.2");var At=(i,t,e)=>{let r=e?.renderBefore??t,s=r._$litPart$;if(s===void 0){let o=e?.renderBefore??null;r._$litPart$=s=new z(t.insertBefore(D(),o),o,void 0,e??{})}return s._$AI(i),s};var lt=globalThis,f=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=At(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};f._$litElement$=!0,f.finalized=!0,lt.litElementHydrateSupport?.({LitElement:f});var Bt=lt.litElementPolyfillSupport;Bt?.({LitElement:f});(lt.litElementVersions??=[]).push("4.2.2");var y=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var Vt={attribute:!0,type:String,converter:O,reflect:!1,hasChanged:K},Jt=(i=Vt,t,e)=>{let{kind:r,metadata:s}=e,o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),r==="accessor"){let{name:n}=e;return{set(h){let a=t.get.call(this);t.set.call(this,h),this.requestUpdate(n,a,i,!0,h)},init(h){return h!==void 0&&this.C(n,void 0,i,h),h}}}if(r==="setter"){let{name:n}=e;return function(h){let a=this[n];t.call(this,h),this.requestUpdate(n,a,i,!0,h)}}throw Error("Unsupported decorator location: "+r)};function _(i){return(t,e)=>typeof e=="object"?Jt(i,t,e):((r,s,o)=>{let n=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}function g(i){return _({...i,state:!0,attribute:!1})}async function Et(i){return i.callWS({type:"ambience/areas/list"})}async function Ct(i,t){return i.callWS({type:"ambience/area/get",area_id:t})}async function G(i,t,e){return i.callWS({type:"ambience/area/save",area_id:t,config:e})}async function kt(i,t){return i.callWS({type:"ambience/area/delete",area_id:t})}async function Rt(i){return i.callWS({type:"ambience/matchers/list"})}var b=class extends f{constructor(){super(...arguments);this._areas=[];this._newId="";this._newName="";this._error=""}connectedCallback(){super.connectedCallback(),this._refresh()}async _refresh(){try{this._areas=await Et(this.hass)}catch(e){this._error=String(e)}}async _add(){this._error="";let e=this._newId.trim(),r=this._newName.trim()||e;if(!e){this._error="Area ID is required.";return}try{await G(this.hass,e,{name:r,scenes:[],matchers:[],rules:[]}),this._newId="",this._newName="",await this._refresh()}catch(s){this._error=s.message||String(s)}}async _delete(e){if(confirm(`Delete area ${e}?`))try{await kt(this.hass,e),await this._refresh()}catch(r){this._error=r.message||String(r)}}_open(e){this.dispatchEvent(new CustomEvent("open-area",{detail:{areaId:e},bubbles:!0,composed:!0}))}render(){return l`
      <div class="toolbar">
        <input
          type="text"
          placeholder="area_id (e.g. living_room)"
          .value=${this._newId}
          @input=${e=>this._newId=e.target.value}
        />
        <input
          type="text"
          placeholder="Display name (optional)"
          .value=${this._newName}
          @input=${e=>this._newName=e.target.value}
        />
        <button @click=${this._add}>Add area</button>
      </div>

      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?l`<p class="empty">No areas configured yet.</p>`:l`
            <ul>
              ${this._areas.map(e=>l`
                  <li>
                    <span class="name" @click=${()=>this._open(e.area_id)}>
                      ${e.name} <small>(${e.area_id})</small>
                    </span>
                    <button class="secondary" @click=${()=>this._delete(e.area_id)}>
                      Delete
                    </button>
                  </li>
                `)}
            </ul>
          `}
    `}};b.styles=$`
    :host {
      display: block;
      padding: 1rem;
      max-width: 60rem;
      margin: 0 auto;
    }
    .toolbar {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    input[type="text"] {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
    }
    .name {
      cursor: pointer;
    }
    .name:hover {
      text-decoration: underline;
    }
    .error {
      color: var(--error-color, #d32f2f);
      margin-top: 0.5rem;
    }
  `,c([_({attribute:!1})],b.prototype,"hass",2),c([g()],b.prototype,"_areas",2),c([g()],b.prototype,"_newId",2),c([g()],b.prototype,"_newName",2),c([g()],b.prototype,"_error",2),b=c([y("ambience-areas-list")],b);var T=class extends f{constructor(){super(...arguments);this.rules=[]}_emit(e,r){this.dispatchEvent(new CustomEvent(e,{detail:r,bubbles:!0,composed:!0}))}render(){return this.rules.length===0?l`
        <p class="empty">No rules yet.</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          + Add rule
        </button>
      `:l`
      <ul>
        ${this.rules.map((e,r)=>l`
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
    `}};T.styles=$`
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
  `,c([_({attribute:!1})],T.prototype,"rules",2),T=c([y("ambience-rules-list")],T);var x=class extends f{constructor(){super(...arguments);this.open=!1;this.rule=null;this.scenes=[];this.activeMatchers=[];this._draft=null}willUpdate(e){e.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_setScene(e){if(!this._draft)return;let r={...this._draft.when};e===""?r.scene=null:r.scene=e,this._draft={...this._draft,when:r}}_setPredicate(e,r){if(!this._draft)return;let s={...this._draft.when};r.trim()===""?delete s[e]:s[e]=r,this._draft={...this._draft,when:s}}_addActionSlot(){if(!this._draft)return;let e={action:"set_light",targets:{}};this._draft={...this._draft,actions:[...this._draft.actions,e]}}_save(){this._draft&&this.dispatchEvent(new CustomEvent("save-rule",{detail:this._draft,bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){return this._draft?l`
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
          ${this.scenes.map(e=>l`
              <option value=${e} ?selected=${this._draft.when.scene===e}>
                ${e}
              </option>
            `)}
        </select>

        ${this.activeMatchers.map(e=>l`
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
        ${this._draft.actions.length===0?l`<p style="color: var(--secondary-text-color, #888)">No actions yet.</p>`:this._draft.actions.map((e,r)=>l`
                <p>
                  ${r+1}. ${e.action} on
                  ${Object.keys(e.targets).length} target(s)
                </p>
              `)}
        <button class="secondary" @click=${this._addActionSlot}>+ Add action</button>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._save}>Save rule</button>
        </div>
      </div>
    `:l``}};x.styles=$`
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
  `,c([_({type:Boolean,reflect:!0})],x.prototype,"open",2),c([_({attribute:!1})],x.prototype,"rule",2),c([_({attribute:!1})],x.prototype,"scenes",2),c([_({attribute:!1})],x.prototype,"activeMatchers",2),c([g()],x.prototype,"_draft",2),x=c([y("ambience-rule-editor")],x);var v=class extends f{constructor(){super(...arguments);this.areaId="";this._config=null;this._matchers=[];this._tab="scenes";this._error="";this._saved=!1;this._editingRuleIdx=null}async connectedCallback(){super.connectedCallback(),await this._load()}async _load(){try{let[e,r]=await Promise.all([Ct(this.hass,this.areaId),Rt(this.hass)]);this._config=e,this._matchers=r}catch(e){this._error=e.message||String(e)}}_setTab(e){this._tab=e,this._saved=!1,this._error=""}_addScene(){this._config&&(this._config={...this._config,scenes:[...this._config.scenes,""]})}_updateScene(e,r){if(!this._config)return;let s=[...this._config.scenes];s[e]=r,this._config={...this._config,scenes:s}}_removeScene(e){if(!this._config)return;let r=this._config.scenes.filter((s,o)=>o!==e);this._config={...this._config,scenes:r}}_toggleMatcher(e,r){if(!this._config)return;let s=new Set(this._config.matchers);r?s.add(e):s.delete(e),this._config={...this._config,matchers:[...s]}}async _save(){if(this._config){this._error="",this._saved=!1;try{await G(this.hass,this.areaId,this._config),this._saved=!0}catch(e){this._error=e.message||String(e)}}}render(){return this._config?l`
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
        ${this._error?l`<span class="error">${this._error}</span>`:""}
        ${this._saved?l`<span class="saved">Saved.</span>`:""}
      </div>

      <ambience-rule-editor
        ?open=${this._editingRuleIdx!==null}
        .rule=${this._editingRule}
        .scenes=${this._config.scenes}
        .activeMatchers=${this._activeMatcherInfos}
        @save-rule=${this._saveRule}
        @cancel-rule=${this._cancelRule}
      ></ambience-rule-editor>
    `:l`<p>Loading…</p>`}_renderScenes(){return l`
      <div class="field">
        <label>Display name</label>
        <input
          type="text"
          .value=${this._config.name}
          @input=${e=>{this._config={...this._config,name:e.target.value}}}
        />
      </div>
      <h3>Scenes</h3>
      ${this._config.scenes.map((e,r)=>l`
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
    `}_renderMatchers(){return l`
      <h3>Matchers</h3>
      <p>Select which matchers can be used in this area's rule predicates.</p>
      ${this._matchers.map(e=>l`
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
    `}_renderRules(){return l`
      <h3>Rules</h3>
      <p>Rules are evaluated in order — the first match wins.</p>
      <ambience-rules-list
        .rules=${this._config.rules}
        @add-rule=${this._addRule}
        @delete-rule=${this._deleteRule}
        @move-rule=${this._moveRule}
        @edit-rule=${this._editRule}
      ></ambience-rules-list>
    `}_addRule(){if(!this._config)return;let e={when:{scene:null},actions:[]};this._config={...this._config,rules:[...this._config.rules,e]},this._editingRuleIdx=this._config.rules.length-1}_editRule(e){this._editingRuleIdx=e.detail.index}_saveRule(e){if(!this._config||this._editingRuleIdx===null)return;let r=[...this._config.rules];r[this._editingRuleIdx]=e.detail,this._config={...this._config,rules:r},this._editingRuleIdx=null}_cancelRule(){this._editingRuleIdx=null}get _editingRule(){return this._editingRuleIdx===null||!this._config?null:this._config.rules[this._editingRuleIdx]??null}get _activeMatcherInfos(){if(!this._config)return[];let e=new Set(this._config.matchers);return this._matchers.filter(r=>e.has(r.name))}_deleteRule(e){if(!this._config)return;let r=this._config.rules.filter((s,o)=>o!==e.detail.index);this._config={...this._config,rules:r}}_moveRule(e){if(!this._config)return;let{index:r,delta:s}=e.detail,o=r+s;if(o<0||o>=this._config.rules.length)return;let n=[...this._config.rules];[n[r],n[o]]=[n[o],n[r]],this._config={...this._config,rules:n}}};v.styles=$`
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
  `,c([_({attribute:!1})],v.prototype,"hass",2),c([_()],v.prototype,"areaId",2),c([g()],v.prototype,"_config",2),c([g()],v.prototype,"_matchers",2),c([g()],v.prototype,"_tab",2),c([g()],v.prototype,"_error",2),c([g()],v.prototype,"_saved",2),c([g()],v.prototype,"_editingRuleIdx",2),v=c([y("ambience-area-editor")],v);var I=class extends f{constructor(){super(...arguments);this._route={kind:"areas"}}render(){return l`
      <header>
        <h1>Ambience</h1>
        ${this._route.kind==="area"?l`<button @click=${()=>this._openAreas()}>← All areas</button>`:""}
      </header>
      ${this._renderRoute()}
    `}_renderRoute(){return this._route.kind==="areas"?l`
        <ambience-areas-list
          .hass=${this.hass}
          @open-area=${e=>this._openArea(e.detail.areaId)}
        ></ambience-areas-list>
      `:l`
      <ambience-area-editor
        .hass=${this.hass}
        .areaId=${this._route.areaId}
      ></ambience-area-editor>
    `}_openArea(e){this._route={kind:"area",areaId:e}}_openAreas(){this._route={kind:"areas"}}};I.styles=$`
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
  `,c([_({attribute:!1})],I.prototype,"hass",2),c([g()],I.prototype,"_route",2),I=c([y("ambience-panel")],I);export{I as AmbiencePanel};
