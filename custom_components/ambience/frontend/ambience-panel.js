/* Ambience panel — bundled output. Do not edit by hand. */
var Pt=Object.defineProperty;var Tt=Object.getOwnPropertyDescriptor;var h=(i,e,t,r)=>{for(var s=r>1?void 0:r?Tt(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&Pt(e,t,s),s};var B=globalThis,F=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol(),ct=new WeakMap,N=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==Q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(F&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=ct.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&ct.set(t,e))}return e}toString(){return this.cssText}},dt=i=>new N(typeof i=="string"?i:i+"",void 0,Q),$=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new N(t,i,Q)},ht=(i,e)=>{if(F)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),s=B.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=t.cssText,i.appendChild(r)}},X=F?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return dt(t)})(i):i;var{is:It,defineProperty:Ht,getOwnPropertyDescriptor:Nt,getOwnPropertyNames:Ut,getOwnPropertySymbols:Ot,getPrototypeOf:jt}=Object,J=globalThis,pt=J.trustedTypes,Dt=pt?pt.emptyScript:"",Lt=J.reactiveElementPolyfillSupport,U=(i,e)=>i,O={toAttribute(i,e){switch(e){case Boolean:i=i?Dt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},K=(i,e)=>!It(i,e),ut={attribute:!0,type:String,converter:O,reflect:!1,useDefault:!1,hasChanged:K};Symbol.metadata??=Symbol("metadata"),J.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ut){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(e,r,t);s!==void 0&&Ht(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){let{get:s,set:n}=Nt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let l=s?.call(this);n?.call(this,o),this.requestUpdate(e,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ut}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;let e=jt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){let t=this.properties,r=[...Ut(t),...Ot(t)];for(let s of r)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,s]of t)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let s=this._$Eu(t,r);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let s of r)t.unshift(X(s))}else e!==void 0&&t.push(X(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ht(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(s!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute!==void 0?r.converter:O).toAttribute(t,r.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){let r=this.constructor,s=r._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let n=r.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:O;this._$Em=s;let l=o.fromAttribute(t,n.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(e,t,r,s=!1,n){if(e!==void 0){let o=this.constructor;if(s===!1&&(n=this[e]),r??=o.getPropertyOptions(e),!((r.hasChanged??K)(n,t)||r.useDefault&&r.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,n]of r){let{wrapped:o}=n,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[U("elementProperties")]=new Map,S[U("finalized")]=new Map,Lt?.({ReactiveElement:S}),(J.reactiveElementVersions??=[]).push("2.1.2");var nt=globalThis,mt=i=>i,V=nt.trustedTypes,ft=V?V.createPolicy("lit-html",{createHTML:i=>i}):void 0,bt="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,xt="?"+E,qt=`<${xt}>`,R=document,D=()=>R.createComment(""),L=i=>i===null||typeof i!="object"&&typeof i!="function",ot=Array.isArray,zt=i=>ot(i)||typeof i?.[Symbol.iterator]=="function",Y=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_t=/-->/g,gt=/>/g,C=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vt=/'/g,$t=/"/g,At=/^(?:script|style|textarea|title)$/i,at=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),c=at(1),Yt=at(2),te=at(3),M=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),yt=new WeakMap,k=R.createTreeWalker(R,129);function St(i,e){if(!ot(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ft!==void 0?ft.createHTML(e):e}var Wt=(i,e)=>{let t=i.length-1,r=[],s,n=e===2?"<svg>":e===3?"<math>":"",o=j;for(let l=0;l<t;l++){let a=i[l],d,u,p=-1,A=0;for(;A<a.length&&(o.lastIndex=A,u=o.exec(a),u!==null);)A=o.lastIndex,o===j?u[1]==="!--"?o=_t:u[1]!==void 0?o=gt:u[2]!==void 0?(At.test(u[2])&&(s=RegExp("</"+u[2],"g")),o=C):u[3]!==void 0&&(o=C):o===C?u[0]===">"?(o=s??j,p=-1):u[1]===void 0?p=-2:(p=o.lastIndex-u[2].length,d=u[1],o=u[3]===void 0?C:u[3]==='"'?$t:vt):o===$t||o===vt?o=C:o===_t||o===gt?o=j:(o=C,s=void 0);let w=o===C&&i[l+1].startsWith("/>")?" ":"";n+=o===j?a+qt:p>=0?(r.push(d),a.slice(0,p)+bt+a.slice(p)+E+w):a+E+(p===-2?l:w)}return[St(i,n+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},q=class i{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let n=0,o=0,l=e.length-1,a=this.parts,[d,u]=Wt(e,t);if(this.el=i.createElement(d,r),k.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=k.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let p of s.getAttributeNames())if(p.endsWith(bt)){let A=u[o++],w=s.getAttribute(p).split(E),W=/([.?@])?(.*)/.exec(A);a.push({type:1,index:n,name:W[2],strings:w,ctor:W[1]==="."?et:W[1]==="?"?rt:W[1]==="@"?st:I}),s.removeAttribute(p)}else p.startsWith(E)&&(a.push({type:6,index:n}),s.removeAttribute(p));if(At.test(s.tagName)){let p=s.textContent.split(E),A=p.length-1;if(A>0){s.textContent=V?V.emptyScript:"";for(let w=0;w<A;w++)s.append(p[w],D()),k.nextNode(),a.push({type:2,index:++n});s.append(p[A],D())}}}else if(s.nodeType===8)if(s.data===xt)a.push({type:2,index:n});else{let p=-1;for(;(p=s.data.indexOf(E,p+1))!==-1;)a.push({type:7,index:n}),p+=E.length-1}n++}}static createElement(e,t){let r=R.createElement("template");return r.innerHTML=e,r}};function T(i,e,t=i,r){if(e===M)return e;let s=r!==void 0?t._$Co?.[r]:t._$Cl,n=L(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,t,r)),r!==void 0?(t._$Co??=[])[r]=s:t._$Cl=s),s!==void 0&&(e=T(i,s._$AS(i,e.values),s,r)),e}var tt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,s=(e?.creationScope??R).importNode(t,!0);k.currentNode=s;let n=k.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new z(n,n.nextSibling,this,e):a.type===1?d=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(d=new it(n,this,e)),this._$AV.push(d),a=r[++l]}o!==a?.index&&(n=k.nextNode(),o++)}return k.currentNode=R,s}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},z=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=T(this,e,t),L(e)?e===m||e==null||e===""?(this._$AH!==m&&this._$AR(),this._$AH=m):e!==this._$AH&&e!==M&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):zt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==m&&L(this._$AH)?this._$AA.nextSibling.data=e:this.T(R.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,s=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=q.createElement(St(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(t);else{let n=new tt(s,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=yt.get(e.strings);return t===void 0&&yt.set(e.strings,t=new q(e)),t}k(e){ot(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,s=0;for(let n of e)s===t.length?t.push(r=new i(this.O(D()),this.O(D()),this,this.options)):r=t[s],r._$AI(n),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=mt(e).nextSibling;mt(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},I=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,n){this.type=1,this._$AH=m,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=m}_$AI(e,t=this,r,s){let n=this.strings,o=!1;if(n===void 0)e=T(this,e,t,0),o=!L(e)||e!==this._$AH&&e!==M,o&&(this._$AH=e);else{let l=e,a,d;for(e=n[0],a=0;a<n.length-1;a++)d=T(this,l[r+a],t,a),d===M&&(d=this._$AH[a]),o||=!L(d)||d!==this._$AH[a],d===m?e=m:e!==m&&(e+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(e)}j(e){e===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},et=class extends I{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===m?void 0:e}},rt=class extends I{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==m)}},st=class extends I{constructor(e,t,r,s,n){super(e,t,r,s,n),this.type=5}_$AI(e,t=this){if((e=T(this,e,t,0)??m)===M)return;let r=this._$AH,s=e===m&&r!==m||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,n=e!==m&&(r===m||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},it=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){T(this,e)}};var Bt=nt.litHtmlPolyfillSupport;Bt?.(q,z),(nt.litHtmlVersions??=[]).push("3.3.2");var wt=(i,e,t)=>{let r=t?.renderBefore??e,s=r._$litPart$;if(s===void 0){let n=t?.renderBefore??null;r._$litPart$=s=new z(e.insertBefore(D(),n),n,void 0,t??{})}return s._$AI(i),s};var lt=globalThis,g=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=wt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};g._$litElement$=!0,g.finalized=!0,lt.litElementHydrateSupport?.({LitElement:g});var Ft=lt.litElementPolyfillSupport;Ft?.({LitElement:g});(lt.litElementVersions??=[]).push("4.2.2");var b=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};var Jt={attribute:!0,type:String,converter:O,reflect:!1,hasChanged:K},Kt=(i=Jt,e,t)=>{let{kind:r,metadata:s}=t,n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(t.name,i),r==="accessor"){let{name:o}=t;return{set(l){let a=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,a,i,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(r==="setter"){let{name:o}=t;return function(l){let a=this[o];e.call(this,l),this.requestUpdate(o,a,i,!0,l)}}throw Error("Unsupported decorator location: "+r)};function _(i){return(e,t)=>typeof t=="object"?Kt(i,e,t):((r,s,n)=>{let o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,e,t)}function f(i){return _({...i,state:!0,attribute:!1})}async function Et(i){return i.callWS({type:"ambience/areas/list"})}async function Ct(i,e){return i.callWS({type:"ambience/area/get",area_id:e})}async function G(i,e,t){return i.callWS({type:"ambience/area/save",area_id:e,config:t})}async function kt(i,e){return i.callWS({type:"ambience/area/delete",area_id:e})}async function Rt(i){return i.callWS({type:"ambience/matchers/list"})}async function Mt(i){return i.callWS({type:"ambience/actions/list"})}var x=class extends g{constructor(){super(...arguments);this._areas=[];this._newId="";this._newName="";this._error=""}connectedCallback(){super.connectedCallback(),this._refresh()}async _refresh(){try{this._areas=await Et(this.hass)}catch(t){this._error=String(t)}}async _add(){this._error="";let t=this._newId.trim(),r=this._newName.trim()||t;if(!t){this._error="Area ID is required.";return}try{await G(this.hass,t,{name:r,scenes:[],matchers:[],rules:[]}),this._newId="",this._newName="",await this._refresh()}catch(s){this._error=s.message||String(s)}}async _delete(t){if(confirm(`Delete area ${t}?`))try{await kt(this.hass,t),await this._refresh()}catch(r){this._error=r.message||String(r)}}_open(t){this.dispatchEvent(new CustomEvent("open-area",{detail:{areaId:t},bubbles:!0,composed:!0}))}render(){return c`
      <div class="toolbar">
        <input
          type="text"
          placeholder="area_id (e.g. living_room)"
          .value=${this._newId}
          @input=${t=>this._newId=t.target.value}
        />
        <input
          type="text"
          placeholder="Display name (optional)"
          .value=${this._newName}
          @input=${t=>this._newName=t.target.value}
        />
        <button @click=${this._add}>Add area</button>
      </div>

      ${this._error?c`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?c`<p class="empty">No areas configured yet.</p>`:c`
            <ul>
              ${this._areas.map(t=>c`
                  <li>
                    <span class="name" @click=${()=>this._open(t.area_id)}>
                      ${t.name} <small>(${t.area_id})</small>
                    </span>
                    <button class="secondary" @click=${()=>this._delete(t.area_id)}>
                      Delete
                    </button>
                  </li>
                `)}
            </ul>
          `}
    `}};x.styles=$`
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
  `,h([_({attribute:!1})],x.prototype,"hass",2),h([f()],x.prototype,"_areas",2),h([f()],x.prototype,"_newId",2),h([f()],x.prototype,"_newName",2),h([f()],x.prototype,"_error",2),x=h([b("ambience-areas-list")],x);var H=class extends g{constructor(){super(...arguments);this.rules=[]}_emit(t,r){this.dispatchEvent(new CustomEvent(t,{detail:r,bubbles:!0,composed:!0}))}render(){return this.rules.length===0?c`
        <p class="empty">No rules yet.</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          + Add rule
        </button>
      `:c`
      <ul>
        ${this.rules.map((t,r)=>c`
            <li>
              <span class="idx">${r+1}</span>
              <div style="flex: 1">
                <div class="name" @click=${()=>this._emit("edit-rule",{index:r})}>
                  ${t.name||`Rule ${r+1}`}
                </div>
                <div class="summary">
                  scene=${t.when.scene??"*"},
                  actions=${t.actions.length}
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
    `}};H.styles=$`
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
  `,h([_({attribute:!1})],H.prototype,"rules",2),H=h([b("ambience-rules-list")],H);var y=class extends g{constructor(){super(...arguments);this.open=!1;this.rule=null;this.scenes=[];this.activeMatchers=[];this.availableActions=[];this._draft=null}willUpdate(t){t.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null)}_setName(t){this._draft&&(this._draft={...this._draft,name:t||void 0})}_setScene(t){if(!this._draft)return;let r={...this._draft.when};t===""?r.scene=null:r.scene=t,this._draft={...this._draft,when:r}}_setPredicate(t,r){if(!this._draft)return;let s={...this._draft.when};r.trim()===""?delete s[t]:s[t]=r,this._draft={...this._draft,when:s}}_addActionSlot(){if(!this._draft)return;let t={action:"set_light",targets:{}};this._draft={...this._draft,actions:[...this._draft.actions,t]}}_updateActionAt(t,r){if(!this._draft)return;let s=this._draft.actions.map((n,o)=>o===t?r(n):n);this._draft={...this._draft,actions:s}}_changeActionType(t,r){this._updateActionAt(t,()=>({action:r,targets:{}}))}_deleteAction(t){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((r,s)=>s!==t)})}_addTarget(t){this._updateActionAt(t,r=>{let s=this.availableActions.find(o=>o.name===r.action),n={};return s?.target_params.forEach(o=>{"default"in o&&(n[o.name]=o.default)}),{...r,targets:{...r.targets,"":n}}})}_updateTargetId(t,r,s){this._updateActionAt(t,n=>{if(r===s)return n;let o={...n.targets};return o[s]=o[r],delete o[r],{...n,targets:o}})}_updateTargetParam(t,r,s,n){this._updateActionAt(t,o=>{let l={...o.targets},a={...l[r]??{}},d=n;return s.type==="int"?d=n===""?void 0:parseInt(n,10):s.type==="number"?d=n===""?void 0:parseFloat(n):s.type==="boolean"&&(d=n==="true"),d===void 0?delete a[s.name]:a[s.name]=d,l[r]=a,{...o,targets:l}})}_deleteTarget(t,r){this._updateActionAt(t,s=>{let n={...s.targets};return delete n[r],{...s,targets:n}})}_renderTargets(t,r){let s=this.availableActions.find(l=>l.name===r.action),n=s?.target_params??[],o=Object.entries(r.targets);return o.length===0?c`<p style="color: var(--secondary-text-color, #888); margin: 0.5rem 0;">No targets yet.</p>`:c`
      ${o.map(([l,a])=>c`
          <div style="display: grid; grid-template-columns: 1fr ${"1fr ".repeat(n.length)}auto; gap: 0.5rem; margin: 0.5rem 0; align-items: end;">
            <div>
              <label>entity_id</label>
              <input
                type="text"
                .value=${l}
                placeholder="${s?.domains?.[0]??"domain"}.example"
                @change=${d=>this._updateTargetId(t,l,d.target.value)}
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
                    @input=${u=>this._updateTargetParam(t,l,d,u.target.value)}
                  />
                </div>
              `)}
            <button
              class="secondary"
              @click=${()=>this._deleteTarget(t,l)}
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
          @input=${t=>this._setName(t.target.value)}
        />

        <h3>When</h3>

        <label>Scene</label>
        <select
          @change=${t=>this._setScene(t.target.value)}
        >
          <option value="" ?selected=${this._draft.when.scene==null}>
            (any scene)
          </option>
          ${this.scenes.map(t=>c`
              <option value=${t} ?selected=${this._draft.when.scene===t}>
                ${t}
              </option>
            `)}
        </select>

        ${this.activeMatchers.map(t=>c`
            <label>${t.name}</label>
            <input
              type="text"
              placeholder="(any)"
              .value=${String(this._draft.when[t.name]??"")}
              @input=${r=>this._setPredicate(t.name,r.target.value)}
            />
            <div class="help">${t.predicate_help}</div>
          `)}

        <h3>Actions</h3>
        ${this._draft.actions.map((t,r)=>c`
            <div style="border: 1px solid var(--divider-color, #e0e0e0); border-radius: 4px; padding: 0.75rem; margin-bottom: 0.5rem;">
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <select
                  @change=${s=>this._changeActionType(r,s.target.value)}
                >
                  ${this.availableActions.map(s=>c`
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
    `:c``}};y.styles=$`
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
  `,h([_({type:Boolean,reflect:!0})],y.prototype,"open",2),h([_({attribute:!1})],y.prototype,"rule",2),h([_({attribute:!1})],y.prototype,"scenes",2),h([_({attribute:!1})],y.prototype,"activeMatchers",2),h([_({attribute:!1})],y.prototype,"availableActions",2),h([f()],y.prototype,"_draft",2),y=h([b("ambience-rule-editor")],y);var v=class extends g{constructor(){super(...arguments);this.areaId="";this._config=null;this._matchers=[];this._tab="scenes";this._error="";this._saved=!1;this._editingRuleIdx=null;this._isNewRule=!1;this._availableActions=[]}async connectedCallback(){super.connectedCallback(),await this._load()}async _load(){try{let[t,r,s]=await Promise.all([Ct(this.hass,this.areaId),Rt(this.hass),Mt(this.hass)]);this._config=t,this._matchers=r,this._availableActions=s}catch(t){this._error=t.message||String(t)}}_setTab(t){this._tab=t,this._saved=!1,this._error=""}_addScene(){this._config&&(this._config={...this._config,scenes:[...this._config.scenes,""]})}_updateScene(t,r){if(!this._config)return;let s=[...this._config.scenes];s[t]=r,this._config={...this._config,scenes:s}}_removeScene(t){if(!this._config)return;let r=this._config.scenes.filter((s,n)=>n!==t);this._config={...this._config,scenes:r}}_toggleMatcher(t,r){if(!this._config)return;let s=new Set(this._config.matchers);r?s.add(t):s.delete(t),this._config={...this._config,matchers:[...s]}}async _save(){if(this._config){this._error="",this._saved=!1;try{await G(this.hass,this.areaId,this._config),this._saved=!0}catch(t){this._error=t.message||String(t)}}}render(){return this._config?c`
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
      <div class="field">
        <label>Display name</label>
        <input
          type="text"
          .value=${this._config.name}
          @input=${t=>{this._config={...this._config,name:t.target.value}}}
        />
      </div>
      <h3>Scenes</h3>
      ${this._config.scenes.map((t,r)=>c`
          <div class="row">
            <input
              type="text"
              .value=${t}
              @input=${s=>this._updateScene(r,s.target.value)}
            />
            <button class="secondary" @click=${()=>this._removeScene(r)}>×</button>
          </div>
        `)}
      <button class="secondary" @click=${this._addScene}>+ Add scene</button>
    `}_renderMatchers(){return c`
      <h3>Matchers</h3>
      <p>Select which matchers can be used in this area's rule predicates.</p>
      ${this._matchers.map(t=>c`
          <div class="matcher-row">
            <input
              type="checkbox"
              .checked=${this._config.matchers.includes(t.name)}
              @change=${r=>this._toggleMatcher(t.name,r.target.checked)}
            />
            <div class="matcher-meta">
              <div class="matcher-name">${t.name}</div>
              <div>${t.description}</div>
              <div class="matcher-help">${t.predicate_help}</div>
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
    `}_addRule(){if(!this._config)return;let t={when:{scene:null},actions:[]};this._config={...this._config,rules:[...this._config.rules,t]},this._editingRuleIdx=this._config.rules.length-1,this._isNewRule=!0}_editRule(t){this._editingRuleIdx=t.detail.index,this._isNewRule=!1}_saveRule(t){if(!this._config||this._editingRuleIdx===null)return;let r=[...this._config.rules];r[this._editingRuleIdx]=t.detail,this._config={...this._config,rules:r},this._editingRuleIdx=null,this._isNewRule=!1}_cancelRule(){if(this._isNewRule&&this._config&&this._editingRuleIdx!==null){let t=this._config.rules.filter((r,s)=>s!==this._editingRuleIdx);this._config={...this._config,rules:t}}this._editingRuleIdx=null,this._isNewRule=!1}get _editingRule(){return this._editingRuleIdx===null||!this._config?null:this._config.rules[this._editingRuleIdx]??null}get _activeMatcherInfos(){if(!this._config)return[];let t=new Set(this._config.matchers);return this._matchers.filter(r=>t.has(r.name))}_deleteRule(t){if(!this._config)return;let r=this._config.rules.filter((s,n)=>n!==t.detail.index);this._config={...this._config,rules:r}}_moveRule(t){if(!this._config)return;let{index:r,delta:s}=t.detail,n=r+s;if(n<0||n>=this._config.rules.length)return;let o=[...this._config.rules];[o[r],o[n]]=[o[n],o[r]],this._config={...this._config,rules:o}}};v.styles=$`
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
  `,h([_({attribute:!1})],v.prototype,"hass",2),h([_()],v.prototype,"areaId",2),h([f()],v.prototype,"_config",2),h([f()],v.prototype,"_matchers",2),h([f()],v.prototype,"_tab",2),h([f()],v.prototype,"_error",2),h([f()],v.prototype,"_saved",2),h([f()],v.prototype,"_editingRuleIdx",2),h([f()],v.prototype,"_isNewRule",2),h([f()],v.prototype,"_availableActions",2),v=h([b("ambience-area-editor")],v);var P=class extends g{constructor(){super(...arguments);this._route={kind:"areas"}}render(){return c`
      <header>
        <h1>Ambience</h1>
        ${this._route.kind==="area"?c`<button @click=${()=>this._openAreas()}>← All areas</button>`:""}
      </header>
      ${this._renderRoute()}
    `}_renderRoute(){return this._route.kind==="areas"?c`
        <ambience-areas-list
          .hass=${this.hass}
          @open-area=${t=>this._openArea(t.detail.areaId)}
        ></ambience-areas-list>
      `:c`
      <ambience-area-editor
        .hass=${this.hass}
        .areaId=${this._route.areaId}
      ></ambience-area-editor>
    `}_openArea(t){this._route={kind:"area",areaId:t}}_openAreas(){this._route={kind:"areas"}}};P.styles=$`
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
  `,h([_({attribute:!1})],P.prototype,"hass",2),h([f()],P.prototype,"_route",2),P=h([b("ambience-panel")],P);export{P as AmbiencePanel};
