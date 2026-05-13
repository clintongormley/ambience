/* Ambience panel — bundled output. Do not edit by hand. */
var Ct=Object.defineProperty;var wt=Object.getOwnPropertyDescriptor;var u=(i,t,e,s)=>{for(var r=s>1?void 0:s?wt(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Ct(t,e,r),r};var W=globalThis,z=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,J=Symbol(),nt=new WeakMap,O=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==J)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(z&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=nt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&nt.set(e,t))}return t}toString(){return this.cssText}},at=i=>new O(typeof i=="string"?i:i+"",void 0,J),b=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new O(e,i,J)},lt=(i,t)=>{if(z)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=W.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Z=z?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return at(e)})(i):i;var{is:Pt,defineProperty:Ht,getOwnPropertyDescriptor:kt,getOwnPropertyNames:Rt,getOwnPropertySymbols:Ut,getPrototypeOf:Ot}=Object,B=globalThis,ht=B.trustedTypes,Mt=ht?ht.emptyScript:"",Nt=B.reactiveElementPolyfillSupport,M=(i,t)=>i,N={toAttribute(i,t){switch(t){case Boolean:i=i?Mt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},V=(i,t)=>!Pt(i,t),ct={attribute:!0,type:String,converter:N,reflect:!1,useDefault:!1,hasChanged:V};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ct){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Ht(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:o}=kt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let l=r?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ct}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;let t=Ot(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){let e=this.properties,s=[...Rt(e),...Ut(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(Z(r))}else t!==void 0&&e.push(Z(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:N).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:N;this._$Em=r;let l=n.fromAttribute(e,o.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,s,r=!1,o){if(t!==void 0){let n=this.constructor;if(r===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??V)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:n}=o,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[M("elementProperties")]=new Map,y[M("finalized")]=new Map,Nt?.({ReactiveElement:y}),(B.reactiveElementVersions??=[]).push("2.1.2");var st=globalThis,pt=i=>i,K=st.trustedTypes,dt=K?K.createPolicy("lit-html",{createHTML:i=>i}):void 0,yt="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,gt="?"+A,Tt=`<${gt}>`,E=document,I=()=>E.createComment(""),j=i=>i===null||typeof i!="object"&&typeof i!="function",rt=Array.isArray,It=i=>rt(i)||typeof i?.[Symbol.iterator]=="function",G=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ut=/-->/g,mt=/>/g,S=RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ft=/'/g,_t=/"/g,vt=/^(?:script|style|textarea|title)$/i,it=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),m=it(1),Jt=it(2),Zt=it(3),C=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),$t=new WeakMap,x=E.createTreeWalker(E,129);function At(i,t){if(!rt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return dt!==void 0?dt.createHTML(t):t}var jt=(i,t)=>{let e=i.length-1,s=[],r,o=t===2?"<svg>":t===3?"<math>":"",n=T;for(let l=0;l<e;l++){let a=i[l],c,d,h=-1,$=0;for(;$<a.length&&(n.lastIndex=$,d=n.exec(a),d!==null);)$=n.lastIndex,n===T?d[1]==="!--"?n=ut:d[1]!==void 0?n=mt:d[2]!==void 0?(vt.test(d[2])&&(r=RegExp("</"+d[2],"g")),n=S):d[3]!==void 0&&(n=S):n===S?d[0]===">"?(n=r??T,h=-1):d[1]===void 0?h=-2:(h=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?S:d[3]==='"'?_t:ft):n===_t||n===ft?n=S:n===ut||n===mt?n=T:(n=S,r=void 0);let v=n===S&&i[l+1].startsWith("/>")?" ":"";o+=n===T?a+Tt:h>=0?(s.push(c),a.slice(0,h)+yt+a.slice(h)+A+v):a+A+(h===-2?l:v)}return[At(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},D=class i{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0,l=t.length-1,a=this.parts,[c,d]=jt(t,e);if(this.el=i.createElement(c,s),x.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=x.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let h of r.getAttributeNames())if(h.endsWith(yt)){let $=d[n++],v=r.getAttribute(h).split(A),L=/([.?@])?(.*)/.exec($);a.push({type:1,index:o,name:L[2],strings:v,ctor:L[1]==="."?X:L[1]==="?"?Y:L[1]==="@"?tt:R}),r.removeAttribute(h)}else h.startsWith(A)&&(a.push({type:6,index:o}),r.removeAttribute(h));if(vt.test(r.tagName)){let h=r.textContent.split(A),$=h.length-1;if($>0){r.textContent=K?K.emptyScript:"";for(let v=0;v<$;v++)r.append(h[v],I()),x.nextNode(),a.push({type:2,index:++o});r.append(h[$],I())}}}else if(r.nodeType===8)if(r.data===gt)a.push({type:2,index:o});else{let h=-1;for(;(h=r.data.indexOf(A,h+1))!==-1;)a.push({type:7,index:o}),h+=A.length-1}o++}}static createElement(t,e){let s=E.createElement("template");return s.innerHTML=t,s}};function k(i,t,e=i,s){if(t===C)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,o=j(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=k(i,r._$AS(i,t.values),r,s)),t}var Q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??E).importNode(e,!0);x.currentNode=r;let o=x.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let c;a.type===2?c=new q(o,o.nextSibling,this,t):a.type===1?c=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(c=new et(o,this,t)),this._$AV.push(c),a=s[++l]}n!==a?.index&&(o=x.nextNode(),n++)}return x.currentNode=E,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},q=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=k(this,t,e),j(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==C&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):It(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&j(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=D.createElement(At(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new Q(r,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=$t.get(t.strings);return e===void 0&&$t.set(t.strings,e=new D(t)),e}k(t){rt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let o of t)r===e.length?e.push(s=new i(this.O(I()),this.O(I()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=pt(t).nextSibling;pt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,r){let o=this.strings,n=!1;if(o===void 0)t=k(this,t,e,0),n=!j(t)||t!==this._$AH&&t!==C,n&&(this._$AH=t);else{let l=t,a,c;for(t=o[0],a=0;a<o.length-1;a++)c=k(this,l[s+a],e,a),c===C&&(c=this._$AH[a]),n||=!j(c)||c!==this._$AH[a],c===p?t=p:t!==p&&(t+=(c??"")+o[a+1]),this._$AH[a]=c}n&&!r&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},X=class extends R{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},Y=class extends R{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},tt=class extends R{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=k(this,t,e,0)??p)===C)return;let s=this._$AH,r=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==p&&(s===p||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},et=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){k(this,t)}};var Dt=st.litHtmlPolyfillSupport;Dt?.(D,q),(st.litHtmlVersions??=[]).push("3.3.2");var bt=(i,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let o=e?.renderBefore??null;s._$litPart$=r=new q(t.insertBefore(I(),o),o,void 0,e??{})}return r._$AI(i),r};var ot=globalThis,f=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=bt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};f._$litElement$=!0,f.finalized=!0,ot.litElementHydrateSupport?.({LitElement:f});var qt=ot.litElementPolyfillSupport;qt?.({LitElement:f});(ot.litElementVersions??=[]).push("4.2.2");var U=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var Lt={attribute:!0,type:String,converter:N,reflect:!1,hasChanged:V},Wt=(i=Lt,t,e)=>{let{kind:s,metadata:r}=e,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){let{name:n}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(s==="setter"){let{name:n}=e;return function(l){let a=this[n];t.call(this,l),this.requestUpdate(n,a,i,!0,l)}}throw Error("Unsupported decorator location: "+s)};function g(i){return(t,e)=>typeof e=="object"?Wt(i,t,e):((s,r,o)=>{let n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}function w(i){return g({...i,state:!0,attribute:!1})}async function St(i){return i.callWS({type:"ambience/areas/list"})}async function xt(i,t,e){return i.callWS({type:"ambience/area/save",area_id:t,config:e})}async function Et(i,t){return i.callWS({type:"ambience/area/delete",area_id:t})}var _=class extends f{constructor(){super(...arguments);this._areas=[];this._newId="";this._newName="";this._error=""}connectedCallback(){super.connectedCallback(),this._refresh()}async _refresh(){try{this._areas=await St(this.hass)}catch(e){this._error=String(e)}}async _add(){this._error="";let e=this._newId.trim(),s=this._newName.trim()||e;if(!e){this._error="Area ID is required.";return}try{await xt(this.hass,e,{name:s,scenes:[],matchers:[],rules:[]}),this._newId="",this._newName="",await this._refresh()}catch(r){this._error=r.message||String(r)}}async _delete(e){if(confirm(`Delete area ${e}?`))try{await Et(this.hass,e),await this._refresh()}catch(s){this._error=s.message||String(s)}}_open(e){this.dispatchEvent(new CustomEvent("open-area",{detail:{areaId:e},bubbles:!0,composed:!0}))}render(){return m`
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

      ${this._error?m`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?m`<p class="empty">No areas configured yet.</p>`:m`
            <ul>
              ${this._areas.map(e=>m`
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
    `}};_.styles=b`
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
  `,u([g({attribute:!1})],_.prototype,"hass",2),u([w()],_.prototype,"_areas",2),u([w()],_.prototype,"_newId",2),u([w()],_.prototype,"_newName",2),u([w()],_.prototype,"_error",2),_=u([U("ambience-areas-list")],_);var P=class extends f{constructor(){super(...arguments);this.areaId=""}render(){return m`<p>Area editor (placeholder) — areaId: ${this.areaId}</p>`}};P.styles=b`
    :host {
      display: block;
      padding: 1rem;
    }
  `,u([g({attribute:!1})],P.prototype,"hass",2),u([g()],P.prototype,"areaId",2),P=u([U("ambience-area-editor")],P);var H=class extends f{constructor(){super(...arguments);this._route={kind:"areas"}}render(){return m`
      <header>
        <h1>Ambience</h1>
        ${this._route.kind==="area"?m`<button @click=${()=>this._openAreas()}>← All areas</button>`:""}
      </header>
      ${this._renderRoute()}
    `}_renderRoute(){return this._route.kind==="areas"?m`
        <ambience-areas-list
          .hass=${this.hass}
          @open-area=${e=>this._openArea(e.detail.areaId)}
        ></ambience-areas-list>
      `:m`
      <ambience-area-editor
        .hass=${this.hass}
        .areaId=${this._route.areaId}
      ></ambience-area-editor>
    `}_openArea(e){this._route={kind:"area",areaId:e}}_openAreas(){this._route={kind:"areas"}}};H.styles=b`
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
  `,u([g({attribute:!1})],H.prototype,"hass",2),u([w()],H.prototype,"_route",2),H=u([U("ambience-panel")],H);export{H as AmbiencePanel};
