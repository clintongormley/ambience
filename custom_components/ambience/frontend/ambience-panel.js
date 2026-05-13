/* Ambience panel — bundled output. Do not edit by hand. */
var kt=Object.defineProperty;var Pt=Object.getOwnPropertyDescriptor;var d=(i,t,e,r)=>{for(var s=r>1?void 0:r?Pt(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(t,e,s):n(s))||s);return r&&s&&kt(t,e,s),s};var W=globalThis,z=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Z=Symbol(),at=new WeakMap,T=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(z&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=at.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&at.set(e,t))}return t}toString(){return this.cssText}},ct=i=>new T(typeof i=="string"?i:i+"",void 0,Z),S=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new T(e,i,Z)},ht=(i,t)=>{if(z)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),s=W.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},G=z?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return ct(e)})(i):i;var{is:Ht,defineProperty:Mt,getOwnPropertyDescriptor:Rt,getOwnPropertyNames:Tt,getOwnPropertySymbols:Ut,getPrototypeOf:It}=Object,B=globalThis,lt=B.trustedTypes,Ot=lt?lt.emptyScript:"",Nt=B.reactiveElementPolyfillSupport,U=(i,t)=>i,I={toAttribute(i,t){switch(t){case Boolean:i=i?Ot:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},V=(i,t)=>!Ht(i,t),dt={attribute:!0,type:String,converter:I,reflect:!1,useDefault:!1,hasChanged:V};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=dt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Mt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){let{get:s,set:o}=Rt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){let c=s?.call(this);o?.call(this,n),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??dt}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;let t=It(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){let e=this.properties,r=[...Tt(e),...Ut(e)];for(let s of r)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let s of r)e.unshift(G(s))}else t!==void 0&&e.push(G(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ht(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:I).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){let r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let o=r.getPropertyOptions(s),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:I;this._$Em=s;let c=n.fromAttribute(e,o.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(t,e,r,s=!1,o){if(t!==void 0){let n=this.constructor;if(s===!1&&(o=this[t]),r??=n.getPropertyOptions(t),!((r.hasChanged??V)(o,e)||r.useDefault&&r.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:o},n){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,o]of r){let{wrapped:n}=o,c=this[s];n!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,o,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[U("elementProperties")]=new Map,y[U("finalized")]=new Map,Nt?.({ReactiveElement:y}),(B.reactiveElementVersions??=[]).push("2.1.2");var st=globalThis,pt=i=>i,K=st.trustedTypes,ut=K?K.createPolicy("lit-html",{createHTML:i=>i}):void 0,vt="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,yt="?"+A,jt=`<${yt}>`,C=document,N=()=>C.createComment(""),j=i=>i===null||typeof i!="object"&&typeof i!="function",it=Array.isArray,Dt=i=>it(i)||typeof i?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mt=/-->/g,ft=/>/g,E=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_t=/'/g,gt=/"/g,bt=/^(?:script|style|textarea|title)$/i,ot=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),l=ot(1),Gt=ot(2),Qt=ot(3),k=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),$t=new WeakMap,w=C.createTreeWalker(C,129);function xt(i,t){if(!it(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ut!==void 0?ut.createHTML(t):t}var Lt=(i,t)=>{let e=i.length-1,r=[],s,o=t===2?"<svg>":t===3?"<math>":"",n=O;for(let c=0;c<e;c++){let a=i[c],p,m,h=-1,v=0;for(;v<a.length&&(n.lastIndex=v,m=n.exec(a),m!==null);)v=n.lastIndex,n===O?m[1]==="!--"?n=mt:m[1]!==void 0?n=ft:m[2]!==void 0?(bt.test(m[2])&&(s=RegExp("</"+m[2],"g")),n=E):m[3]!==void 0&&(n=E):n===E?m[0]===">"?(n=s??O,h=-1):m[1]===void 0?h=-2:(h=n.lastIndex-m[2].length,p=m[1],n=m[3]===void 0?E:m[3]==='"'?gt:_t):n===gt||n===_t?n=E:n===mt||n===ft?n=O:(n=E,s=void 0);let x=n===E&&i[c+1].startsWith("/>")?" ":"";o+=n===O?a+jt:h>=0?(r.push(p),a.slice(0,h)+vt+a.slice(h)+A+x):a+A+(h===-2?c:x)}return[xt(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},D=class i{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,n=0,c=t.length-1,a=this.parts,[p,m]=Lt(t,e);if(this.el=i.createElement(p,r),w.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=w.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let h of s.getAttributeNames())if(h.endsWith(vt)){let v=m[n++],x=s.getAttribute(h).split(A),q=/([.?@])?(.*)/.exec(v);a.push({type:1,index:o,name:q[2],strings:x,ctor:q[1]==="."?Y:q[1]==="?"?tt:q[1]==="@"?et:M}),s.removeAttribute(h)}else h.startsWith(A)&&(a.push({type:6,index:o}),s.removeAttribute(h));if(bt.test(s.tagName)){let h=s.textContent.split(A),v=h.length-1;if(v>0){s.textContent=K?K.emptyScript:"";for(let x=0;x<v;x++)s.append(h[x],N()),w.nextNode(),a.push({type:2,index:++o});s.append(h[v],N())}}}else if(s.nodeType===8)if(s.data===yt)a.push({type:2,index:o});else{let h=-1;for(;(h=s.data.indexOf(A,h+1))!==-1;)a.push({type:7,index:o}),h+=A.length-1}o++}}static createElement(t,e){let r=C.createElement("template");return r.innerHTML=t,r}};function H(i,t,e=i,r){if(t===k)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl,o=j(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=H(i,s._$AS(i,t.values),s,r)),t}var X=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??C).importNode(e,!0);w.currentNode=s;let o=w.nextNode(),n=0,c=0,a=r[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new L(o,o.nextSibling,this,t):a.type===1?p=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(p=new rt(o,this,t)),this._$AV.push(p),a=r[++c]}n!==a?.index&&(o=w.nextNode(),n++)}return w.currentNode=C,s}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},L=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=H(this,t,e),j(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==k&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Dt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&j(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=D.createElement(xt(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{let o=new X(s,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=$t.get(t.strings);return e===void 0&&$t.set(t.strings,e=new D(t)),e}k(t){it(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,s=0;for(let o of t)s===e.length?e.push(r=new i(this.O(N()),this.O(N()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=pt(t).nextSibling;pt(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=u}_$AI(t,e=this,r,s){let o=this.strings,n=!1;if(o===void 0)t=H(this,t,e,0),n=!j(t)||t!==this._$AH&&t!==k,n&&(this._$AH=t);else{let c=t,a,p;for(t=o[0],a=0;a<o.length-1;a++)p=H(this,c[r+a],e,a),p===k&&(p=this._$AH[a]),n||=!j(p)||p!==this._$AH[a],p===u?t=u:t!==u&&(t+=(p??"")+o[a+1]),this._$AH[a]=p}n&&!s&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Y=class extends M{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},tt=class extends M{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},et=class extends M{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=H(this,t,e,0)??u)===k)return;let r=this._$AH,s=t===u&&r!==u||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==u&&(r===u||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},rt=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){H(this,t)}};var qt=st.litHtmlPolyfillSupport;qt?.(D,L),(st.litHtmlVersions??=[]).push("3.3.2");var At=(i,t,e)=>{let r=e?.renderBefore??t,s=r._$litPart$;if(s===void 0){let o=e?.renderBefore??null;r._$litPart$=s=new L(t.insertBefore(N(),o),o,void 0,e??{})}return s._$AI(i),s};var nt=globalThis,_=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=At(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return k}};_._$litElement$=!0,_.finalized=!0,nt.litElementHydrateSupport?.({LitElement:_});var Wt=nt.litElementPolyfillSupport;Wt?.({LitElement:_});(nt.litElementVersions??=[]).push("4.2.2");var R=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var zt={attribute:!0,type:String,converter:I,reflect:!1,hasChanged:V},Bt=(i=zt,t,e)=>{let{kind:r,metadata:s}=e,o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),r==="accessor"){let{name:n}=e;return{set(c){let a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,i,!0,c)},init(c){return c!==void 0&&this.C(n,void 0,i,c),c}}}if(r==="setter"){let{name:n}=e;return function(c){let a=this[n];t.call(this,c),this.requestUpdate(n,a,i,!0,c)}}throw Error("Unsupported decorator location: "+r)};function b(i){return(t,e)=>typeof e=="object"?Bt(i,t,e):((r,s,o)=>{let n=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}function f(i){return b({...i,state:!0,attribute:!1})}async function St(i){return i.callWS({type:"ambience/areas/list"})}async function Et(i,t){return i.callWS({type:"ambience/area/get",area_id:t})}async function J(i,t,e){return i.callWS({type:"ambience/area/save",area_id:t,config:e})}async function wt(i,t){return i.callWS({type:"ambience/area/delete",area_id:t})}async function Ct(i){return i.callWS({type:"ambience/matchers/list"})}var $=class extends _{constructor(){super(...arguments);this._areas=[];this._newId="";this._newName="";this._error=""}connectedCallback(){super.connectedCallback(),this._refresh()}async _refresh(){try{this._areas=await St(this.hass)}catch(e){this._error=String(e)}}async _add(){this._error="";let e=this._newId.trim(),r=this._newName.trim()||e;if(!e){this._error="Area ID is required.";return}try{await J(this.hass,e,{name:r,scenes:[],matchers:[],rules:[]}),this._newId="",this._newName="",await this._refresh()}catch(s){this._error=s.message||String(s)}}async _delete(e){if(confirm(`Delete area ${e}?`))try{await wt(this.hass,e),await this._refresh()}catch(r){this._error=r.message||String(r)}}_open(e){this.dispatchEvent(new CustomEvent("open-area",{detail:{areaId:e},bubbles:!0,composed:!0}))}render(){return l`
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
    `}};$.styles=S`
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
  `,d([b({attribute:!1})],$.prototype,"hass",2),d([f()],$.prototype,"_areas",2),d([f()],$.prototype,"_newId",2),d([f()],$.prototype,"_newName",2),d([f()],$.prototype,"_error",2),$=d([R("ambience-areas-list")],$);var g=class extends _{constructor(){super(...arguments);this.areaId="";this._config=null;this._matchers=[];this._tab="scenes";this._error="";this._saved=!1}async connectedCallback(){super.connectedCallback(),await this._load()}async _load(){try{let[e,r]=await Promise.all([Et(this.hass,this.areaId),Ct(this.hass)]);this._config=e,this._matchers=r}catch(e){this._error=e.message||String(e)}}_setTab(e){this._tab=e,this._saved=!1,this._error=""}_addScene(){this._config&&(this._config={...this._config,scenes:[...this._config.scenes,""]})}_updateScene(e,r){if(!this._config)return;let s=[...this._config.scenes];s[e]=r,this._config={...this._config,scenes:s}}_removeScene(e){if(!this._config)return;let r=this._config.scenes.filter((s,o)=>o!==e);this._config={...this._config,scenes:r}}_toggleMatcher(e,r){if(!this._config)return;let s=new Set(this._config.matchers);r?s.add(e):s.delete(e),this._config={...this._config,matchers:[...s]}}async _save(){if(this._config){this._error="",this._saved=!1;try{await J(this.hass,this.areaId,this._config),this._saved=!0}catch(e){this._error=e.message||String(e)}}}render(){return this._config?l`
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
      <p>
        Rules editor is the next step (Task 12).
        ${this._config.rules.length} rule(s) currently configured.
      </p>
    `}};g.styles=S`
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
  `,d([b({attribute:!1})],g.prototype,"hass",2),d([b()],g.prototype,"areaId",2),d([f()],g.prototype,"_config",2),d([f()],g.prototype,"_matchers",2),d([f()],g.prototype,"_tab",2),d([f()],g.prototype,"_error",2),d([f()],g.prototype,"_saved",2),g=d([R("ambience-area-editor")],g);var P=class extends _{constructor(){super(...arguments);this._route={kind:"areas"}}render(){return l`
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
    `}_openArea(e){this._route={kind:"area",areaId:e}}_openAreas(){this._route={kind:"areas"}}};P.styles=S`
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
  `,d([b({attribute:!1})],P.prototype,"hass",2),d([f()],P.prototype,"_route",2),P=d([R("ambience-panel")],P);export{P as AmbiencePanel};
