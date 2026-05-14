/* Ambience panel — bundled output. Do not edit by hand. */
var It=Object.defineProperty;var Ht=Object.getOwnPropertyDescriptor;var o=(n,r,t,e)=>{for(var s=e>1?void 0:e?Ht(r,t):r,i=n.length-1,a;i>=0;i--)(a=n[i])&&(s=(e?a(r,t,s):a(s))||s);return e&&s&&It(r,t,s),s};var K=globalThis,V=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,st=Symbol(),gt=new WeakMap,j=class{constructor(r,t,e){if(this._$cssResult$=!0,e!==st)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=t}get styleSheet(){let r=this.o,t=this.t;if(V&&r===void 0){let e=t!==void 0&&t.length===1;e&&(r=gt.get(t)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),e&&gt.set(t,r))}return r}toString(){return this.cssText}},ft=n=>new j(typeof n=="string"?n:n+"",void 0,st),v=(n,...r)=>{let t=n.length===1?n[0]:r.reduce((e,s,i)=>e+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[i+1],n[0]);return new j(t,n,st)},_t=(n,r)=>{if(V)n.adoptedStyleSheets=r.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of r){let e=document.createElement("style"),s=K.litNonce;s!==void 0&&e.setAttribute("nonce",s),e.textContent=t.cssText,n.appendChild(e)}},it=V?n=>n:n=>n instanceof CSSStyleSheet?(r=>{let t="";for(let e of r.cssRules)t+=e.cssText;return ft(t)})(n):n;var{is:Nt,defineProperty:Ot,getOwnPropertyDescriptor:Ut,getOwnPropertyNames:jt,getOwnPropertySymbols:Dt,getPrototypeOf:zt}=Object,Z=globalThis,vt=Z.trustedTypes,Lt=vt?vt.emptyScript:"",qt=Z.reactiveElementPolyfillSupport,D=(n,r)=>n,z={toAttribute(n,r){switch(r){case Boolean:n=n?Lt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,r){let t=n;switch(r){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},G=(n,r)=>!Nt(n,r),bt={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:G};Symbol.metadata??=Symbol("metadata"),Z.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,t=bt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(r,t),!t.noAccessor){let e=Symbol(),s=this.getPropertyDescriptor(r,e,t);s!==void 0&&Ot(this.prototype,r,s)}}static getPropertyDescriptor(r,t,e){let{get:s,set:i}=Ut(this.prototype,r)??{get(){return this[t]},set(a){this[t]=a}};return{get:s,set(a){let l=s?.call(this);i?.call(this,a),this.requestUpdate(r,l,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??bt}static _$Ei(){if(this.hasOwnProperty(D("elementProperties")))return;let r=zt(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(D("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(D("properties"))){let t=this.properties,e=[...jt(t),...Dt(t)];for(let s of e)this.createProperty(s,t[s])}let r=this[Symbol.metadata];if(r!==null){let t=litPropertyMetadata.get(r);if(t!==void 0)for(let[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let s=this._$Eu(t,e);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let t=[];if(Array.isArray(r)){let e=new Set(r.flat(1/0).reverse());for(let s of e)t.unshift(it(s))}else r!==void 0&&t.push(it(r));return t}static _$Eu(r,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(r.set(e,this[e]),delete this[e]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _t(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,t,e){this._$AK(r,e)}_$ET(r,t){let e=this.constructor.elementProperties.get(r),s=this.constructor._$Eu(r,e);if(s!==void 0&&e.reflect===!0){let i=(e.converter?.toAttribute!==void 0?e.converter:z).toAttribute(t,e.type);this._$Em=r,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(r,t){let e=this.constructor,s=e._$Eh.get(r);if(s!==void 0&&this._$Em!==s){let i=e.getPropertyOptions(s),a=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:z;this._$Em=s;let l=a.fromAttribute(t,i.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(r,t,e,s=!1,i){if(r!==void 0){let a=this.constructor;if(s===!1&&(i=this[r]),e??=a.getPropertyOptions(r),!((e.hasChanged??G)(i,t)||e.useDefault&&e.reflect&&i===this._$Ej?.get(r)&&!this.hasAttribute(a._$Eu(r,e))))return;this.C(r,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,t,{useDefault:e,reflect:s,wrapped:i},a){e&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,a??t??this[r]),i!==!0||a!==void 0)||(this._$AL.has(r)||(this.hasUpdated||e||(t=void 0),this._$AL.set(r,t)),s===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[s,i]of e){let{wrapped:a}=i,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,i,l)}}let r=!1,t=this._$AL;try{r=this.shouldUpdate(t),r?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw r=!1,this._$EM(),e}r&&this._$AE(t)}willUpdate(r){}_$AE(r){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(r){}firstUpdated(r){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[D("elementProperties")]=new Map,S[D("finalized")]=new Map,qt?.({ReactiveElement:S}),(Z.reactiveElementVersions??=[]).push("2.1.2");var ht=globalThis,yt=n=>n,Q=ht.trustedTypes,$t=Q?Q.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ct="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,kt="?"+k,Bt=`<${kt}>`,T=document,q=()=>T.createComment(""),B=n=>n===null||typeof n!="object"&&typeof n!="function",ut=Array.isArray,Wt=n=>ut(n)||typeof n?.[Symbol.iterator]=="function",nt=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xt=/-->/g,wt=/>/g,M=RegExp(`>|${nt}(?:([^\\s"'>=/]+)(${nt}*=${nt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),St=/'/g,Et=/"/g,Rt=/^(?:script|style|textarea|title)$/i,pt=n=>(r,...t)=>({_$litType$:n,strings:r,values:t}),c=pt(1),ee=pt(2),re=pt(3),I=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),At=new WeakMap,P=T.createTreeWalker(T,129);function Mt(n,r){if(!ut(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return $t!==void 0?$t.createHTML(r):r}var Ft=(n,r)=>{let t=n.length-1,e=[],s,i=r===2?"<svg>":r===3?"<math>":"",a=L;for(let l=0;l<t;l++){let d=n[l],h,f,m=-1,w=0;for(;w<d.length&&(a.lastIndex=w,f=a.exec(d),f!==null);)w=a.lastIndex,a===L?f[1]==="!--"?a=xt:f[1]!==void 0?a=wt:f[2]!==void 0?(Rt.test(f[2])&&(s=RegExp("</"+f[2],"g")),a=M):f[3]!==void 0&&(a=M):a===M?f[0]===">"?(a=s??L,m=-1):f[1]===void 0?m=-2:(m=a.lastIndex-f[2].length,h=f[1],a=f[3]===void 0?M:f[3]==='"'?Et:St):a===Et||a===St?a=M:a===xt||a===wt?a=L:(a=M,s=void 0);let C=a===M&&n[l+1].startsWith("/>")?" ":"";i+=a===L?d+Bt:m>=0?(e.push(h),d.slice(0,m)+Ct+d.slice(m)+k+C):d+k+(m===-2?l:C)}return[Mt(n,i+(n[t]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),e]},W=class n{constructor({strings:r,_$litType$:t},e){let s;this.parts=[];let i=0,a=0,l=r.length-1,d=this.parts,[h,f]=Ft(r,t);if(this.el=n.createElement(h,e),P.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(s=P.nextNode())!==null&&d.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let m of s.getAttributeNames())if(m.endsWith(Ct)){let w=f[a++],C=s.getAttribute(m).split(k),J=/([.?@])?(.*)/.exec(w);d.push({type:1,index:i,name:J[2],strings:C,ctor:J[1]==="."?ot:J[1]==="?"?lt:J[1]==="@"?ct:U}),s.removeAttribute(m)}else m.startsWith(k)&&(d.push({type:6,index:i}),s.removeAttribute(m));if(Rt.test(s.tagName)){let m=s.textContent.split(k),w=m.length-1;if(w>0){s.textContent=Q?Q.emptyScript:"";for(let C=0;C<w;C++)s.append(m[C],q()),P.nextNode(),d.push({type:2,index:++i});s.append(m[w],q())}}}else if(s.nodeType===8)if(s.data===kt)d.push({type:2,index:i});else{let m=-1;for(;(m=s.data.indexOf(k,m+1))!==-1;)d.push({type:7,index:i}),m+=k.length-1}i++}}static createElement(r,t){let e=T.createElement("template");return e.innerHTML=r,e}};function O(n,r,t=n,e){if(r===I)return r;let s=e!==void 0?t._$Co?.[e]:t._$Cl,i=B(r)?void 0:r._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(n),s._$AT(n,t,e)),e!==void 0?(t._$Co??=[])[e]=s:t._$Cl=s),s!==void 0&&(r=O(n,s._$AS(n,r.values),s,e)),r}var at=class{constructor(r,t){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:t},parts:e}=this._$AD,s=(r?.creationScope??T).importNode(t,!0);P.currentNode=s;let i=P.nextNode(),a=0,l=0,d=e[0];for(;d!==void 0;){if(a===d.index){let h;d.type===2?h=new F(i,i.nextSibling,this,r):d.type===1?h=new d.ctor(i,d.name,d.strings,this,r):d.type===6&&(h=new dt(i,this,r)),this._$AV.push(h),d=e[++l]}a!==d?.index&&(i=P.nextNode(),a++)}return P.currentNode=T,s}p(r){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(r,e,t),t+=e.strings.length-2):e._$AI(r[t])),t++}},F=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,t,e,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=r,this._$AB=t,this._$AM=e,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,t=this._$AM;return t!==void 0&&r?.nodeType===11&&(r=t.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,t=this){r=O(this,r,t),B(r)?r===_||r==null||r===""?(this._$AH!==_&&this._$AR(),this._$AH=_):r!==this._$AH&&r!==I&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Wt(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==_&&B(this._$AH)?this._$AA.nextSibling.data=r:this.T(T.createTextNode(r)),this._$AH=r}$(r){let{values:t,_$litType$:e}=r,s=typeof e=="number"?this._$AC(r):(e.el===void 0&&(e.el=W.createElement(Mt(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===s)this._$AH.p(t);else{let i=new at(s,this),a=i.u(this.options);i.p(t),this.T(a),this._$AH=i}}_$AC(r){let t=At.get(r.strings);return t===void 0&&At.set(r.strings,t=new W(r)),t}k(r){ut(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,s=0;for(let i of r)s===t.length?t.push(e=new n(this.O(q()),this.O(q()),this,this.options)):e=t[s],e._$AI(i),s++;s<t.length&&(this._$AR(e&&e._$AB.nextSibling,s),t.length=s)}_$AR(r=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);r!==this._$AB;){let e=yt(r).nextSibling;yt(r).remove(),r=e}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},U=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,t,e,s,i){this.type=1,this._$AH=_,this._$AN=void 0,this.element=r,this.name=t,this._$AM=s,this.options=i,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=_}_$AI(r,t=this,e,s){let i=this.strings,a=!1;if(i===void 0)r=O(this,r,t,0),a=!B(r)||r!==this._$AH&&r!==I,a&&(this._$AH=r);else{let l=r,d,h;for(r=i[0],d=0;d<i.length-1;d++)h=O(this,l[e+d],t,d),h===I&&(h=this._$AH[d]),a||=!B(h)||h!==this._$AH[d],h===_?r=_:r!==_&&(r+=(h??"")+i[d+1]),this._$AH[d]=h}a&&!s&&this.j(r)}j(r){r===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},ot=class extends U{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===_?void 0:r}},lt=class extends U{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==_)}},ct=class extends U{constructor(r,t,e,s,i){super(r,t,e,s,i),this.type=5}_$AI(r,t=this){if((r=O(this,r,t,0)??_)===I)return;let e=this._$AH,s=r===_&&e!==_||r.capture!==e.capture||r.once!==e.once||r.passive!==e.passive,i=r!==_&&(e===_||s);s&&this.element.removeEventListener(this.name,this,e),i&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},dt=class{constructor(r,t,e){this.element=r,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(r){O(this,r)}};var Jt=ht.litHtmlPolyfillSupport;Jt?.(W,F),(ht.litHtmlVersions??=[]).push("3.3.2");var Pt=(n,r,t)=>{let e=t?.renderBefore??r,s=e._$litPart$;if(s===void 0){let i=t?.renderBefore??null;e._$litPart$=s=new F(r.insertBefore(q(),i),i,void 0,t??{})}return s._$AI(n),s};var mt=globalThis,g=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=Pt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}};g._$litElement$=!0,g.finalized=!0,mt.litElementHydrateSupport?.({LitElement:g});var Kt=mt.litElementPolyfillSupport;Kt?.({LitElement:g});(mt.litElementVersions??=[]).push("4.2.2");var b=n=>(r,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(n,r)}):customElements.define(n,r)};var Vt={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:G},Zt=(n=Vt,r,t)=>{let{kind:e,metadata:s}=t,i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),e==="setter"&&((n=Object.create(n)).wrapped=!0),i.set(t.name,n),e==="accessor"){let{name:a}=t;return{set(l){let d=r.get.call(this);r.set.call(this,l),this.requestUpdate(a,d,n,!0,l)},init(l){return l!==void 0&&this.C(a,void 0,n,l),l}}}if(e==="setter"){let{name:a}=t;return function(l){let d=this[a];r.call(this,l),this.requestUpdate(a,d,n,!0,l)}}throw Error("Unsupported decorator location: "+e)};function u(n){return(r,t)=>typeof t=="object"?Zt(n,r,t):((e,s,i)=>{let a=s.hasOwnProperty(i);return s.constructor.createProperty(i,e),a?Object.getOwnPropertyDescriptor(s,i):void 0})(n,r,t)}function p(n){return u({...n,state:!0,attribute:!1})}async function Tt(n){return n.callWS({type:"ambience/areas/list"})}async function Y(n,r){return n.callWS({type:"ambience/area/get",area_id:r})}async function tt(n,r,t){return n.callWS({type:"ambience/area/save",area_id:r,config:t})}async function et(n){return n.callWS({type:"ambience/matchers/list"})}async function rt(n){return n.callWS({type:"ambience/actions/list"})}var E=class extends g{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}_summary(t){let e=Object.keys(t.when).filter(a=>t.when[a]!=null),s=e.length===0?"any":e.map(a=>`${a}=${String(t.when[a])}`).join(", "),i=t.actions.length;return`${s} \xB7 ${i} action${i===1?"":"s"}`}_onDragStart(t){this._dragFrom=t}_onDragOver(t,e){this._dragFrom===null||e===this._dragFrom||(t.preventDefault(),this._dragOver=e)}_onDrop(t){let e=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(e===null||e===t)&&this._emit("reorder-rules",{from:e,to:t})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(t,e){let s=e.name||`Rule ${t+1}`;window.confirm(`Delete "${s}"?`)&&this._emit("delete-rule",{index:t})}render(){return this.rules.length===0?c`
        <p class="empty">No rules yet.</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          + Add rule
        </button>
      `:c`
      <ul>
        ${this.rules.map((t,e)=>c`
            <li
              class=${this._dragOver===e?"drag-over":""}
              draggable=${!this.autoSort}
              @dragstart=${()=>this._onDragStart(e)}
              @dragover=${s=>this._onDragOver(s,e)}
              @drop=${()=>this._onDrop(e)}
              @dragend=${this._onDragEnd}
            >
              ${this.autoSort?"":c`<span class="handle" title="Drag to reorder">⠿</span>`}
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
  `,o([u({attribute:!1})],E.prototype,"rules",2),o([u({type:Boolean})],E.prototype,"autoSort",2),o([p()],E.prototype,"_dragFrom",2),o([p()],E.prototype,"_dragOver",2),E=o([b("ambience-rules-list")],E);var H=class extends g{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._listId=`scene-suggestions-${Math.random().toString(36).slice(2)}`}_onInput(t){let e=t.target.value;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e.trim()===""?null:e},bubbles:!0,composed:!0}))}render(){return c`
      <input
        type="text"
        list=${this._listId}
        placeholder="(any scene)"
        .value=${this.value??""}
        @input=${this._onInput}
      />
      <datalist id=${this._listId}>
        ${this.suggestions.map(t=>c`<option value=${t}></option>`)}
      </datalist>
    `}};H.styles=v`
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
  `,o([u()],H.prototype,"value",2),o([u({attribute:!1})],H.prototype,"suggestions",2),H=o([b("ambience-scene-combobox")],H);var R=class extends g{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(t){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_onText(t){let e=t.target.value;this._emit(e.trim()===""?null:e)}render(){return this.matcher.input==="scene_combobox"?c`
        <ambience-scene-combobox
          .value=${this.value??null}
          .suggestions=${this.sceneSuggestions}
          @value-changed=${t=>{t.stopPropagation(),this._emit(t.detail.value)}}
        ></ambience-scene-combobox>
      `:c`
      <input
        type="text"
        placeholder="(any)"
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};R.styles=v`
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
  `,o([u({attribute:!1})],R.prototype,"matcher",2),o([u({attribute:!1})],R.prototype,"value",2),o([u({attribute:!1})],R.prototype,"sceneSuggestions",2),R=o([b("ambience-matcher-input")],R);var x=class extends g{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null}willUpdate(t){t.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null)}_setName(t){this._draft&&(this._draft={...this._draft,name:t||void 0})}_setPredicate(t,e){if(!this._draft)return;let s={...this._draft.when};e==null?delete s[t]:s[t]=e,this._draft={...this._draft,when:s}}_addActionSlot(){if(!this._draft)return;let t={action:"set_light",targets:{}};this._draft={...this._draft,actions:[...this._draft.actions,t]}}_updateActionAt(t,e){if(!this._draft)return;let s=this._draft.actions.map((i,a)=>a===t?e(i):i);this._draft={...this._draft,actions:s}}_changeActionType(t,e){this._updateActionAt(t,()=>({action:e,targets:{}}))}_deleteAction(t){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((e,s)=>s!==t)})}_addTarget(t){this._updateActionAt(t,e=>{let s=this.availableActions.find(a=>a.name===e.action),i={};return s?.target_params.forEach(a=>{"default"in a&&(i[a.name]=a.default)}),{...e,targets:{...e.targets,"":i}}})}_updateTargetId(t,e,s){this._updateActionAt(t,i=>{if(e===s)return i;let a={...i.targets};return a[s]=a[e],delete a[e],{...i,targets:a}})}_updateTargetParam(t,e,s,i){this._updateActionAt(t,a=>{let l={...a.targets},d={...l[e]??{}},h=i;return s.type==="int"?h=i===""?void 0:parseInt(i,10):s.type==="number"?h=i===""?void 0:parseFloat(i):s.type==="boolean"&&(h=i==="true"),h===void 0?delete d[s.name]:d[s.name]=h,l[e]=d,{...a,targets:l}})}_deleteTarget(t,e){this._updateActionAt(t,s=>{let i={...s.targets};return delete i[e],{...s,targets:i}})}_renderTargets(t,e){let s=this.availableActions.find(l=>l.name===e.action),i=s?.target_params??[],a=Object.entries(e.targets);return a.length===0?c`<p
        style="color: var(--secondary-text-color, #888); margin: 0.5rem 0;"
      >
        No targets yet.
      </p>`:c`
      ${a.map(([l,d])=>c`
          <div
            style="display: grid; grid-template-columns: 1fr ${"1fr ".repeat(i.length)}auto; gap: 0.5rem; margin: 0.5rem 0; align-items: end;"
          >
            <div>
              <label>entity_id</label>
              <input
                type="text"
                .value=${l}
                placeholder="${s?.domains?.[0]??"domain"}.example"
                @change=${h=>this._updateTargetId(t,l,h.target.value)}
              />
            </div>
            ${i.map(h=>c`
                <div>
                  <label>${h.name}${h.required?" *":""}</label>
                  <input
                    type=${h.type==="int"||h.type==="number"?"number":"text"}
                    .value=${String(d[h.name]??"")}
                    min=${h.min??""}
                    max=${h.max??""}
                    @input=${f=>this._updateTargetParam(t,l,h,f.target.value)}
                  />
                </div>
              `)}
            <button
              class="secondary"
              @click=${()=>this._deleteTarget(t,l)}
              title="Remove target"
            >
              ×
            </button>
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
        ${this.matchers.map(t=>c`
            <label>${t.name==="scene"?"Scene":t.name}</label>
            <ambience-matcher-input
              .matcher=${t}
              .value=${this._draft.when[t.name]??null}
              .sceneSuggestions=${this.sceneSuggestions}
              @value-changed=${e=>this._setPredicate(t.name,e.detail.value)}
            ></ambience-matcher-input>
          `)}

        <h3>Actions</h3>
        ${this._draft.actions.map((t,e)=>c`
            <div
              style="border: 1px solid var(--divider-color, #e0e0e0); border-radius: 4px; padding: 0.75rem; margin-bottom: 0.5rem;"
            >
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <select
                  @change=${s=>this._changeActionType(e,s.target.value)}
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
    `:c``}};x.styles=v`
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
  `,o([u({type:Boolean,reflect:!0})],x.prototype,"open",2),o([u({attribute:!1})],x.prototype,"rule",2),o([u({attribute:!1})],x.prototype,"matchers",2),o([u({attribute:!1})],x.prototype,"sceneSuggestions",2),o([u({attribute:!1})],x.prototype,"availableActions",2),o([p()],x.prototype,"_draft",2),x=o([b("ambience-rule-editor")],x);var A=class extends g{constructor(){super(...arguments);this.open=!1;this.matchers=[];this.selected=[];this._draft=new Set}willUpdate(t){(t.has("selected")||t.has("open"))&&this.open&&(this._draft=new Set(this.selected))}_toggle(t,e){let s=new Set(this._draft);e?s.add(t):s.delete(t),this._draft=s}_apply(){this.dispatchEvent(new CustomEvent("apply-matchers",{detail:{matchers:[...this._draft]},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-matchers",{bubbles:!0,composed:!0}))}render(){let t=this.matchers.filter(e=>e.toggleable);return c`
      <div class="modal">
        <h2>Matchers</h2>
        <p class="intro">
          Select which matchers can be used in this area's rule predicates.
        </p>
        ${t.map(e=>c`
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
    `}};A.styles=v`
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
  `,o([u({type:Boolean,reflect:!0})],A.prototype,"open",2),o([u({attribute:!1})],A.prototype,"matchers",2),o([u({attribute:!1})],A.prototype,"selected",2),o([p()],A.prototype,"_draft",2),A=o([b("ambience-matchers-modal")],A);var $=class extends g{constructor(){super(...arguments);this._areas=[];this._matchers=[];this._actions=[];this._configs=new Map;this._expanded=new Set;this._error="";this._editing=null;this._matchersModalArea=null}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await this._refreshAreas(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _loadStatic(){try{let[t,e]=await Promise.all([et(this.hass),rt(this.hass)]);if(!this.isConnected)return;this._matchers=t,this._actions=e}catch(t){this._error=t.message||String(t)}}async _refreshAreas(){try{let t=await Tt(this.hass),e=new Map;if(await Promise.all(t.map(async s=>{e.set(s.area_id,await Y(this.hass,s.area_id))})),!this.isConnected)return;this._areas=t,this._configs=e}catch(t){this._error=t.message||String(t)}}async _subscribe(){let t=await this.hass.connection.subscribeEvents(e=>{if(e.data.action==="remove"){let s=e.data.area_id,i=new Set(this._expanded);i.delete(s),this._expanded=i,this._editing?.areaId===s&&(this._editing=null),this._matchersModalArea===s&&(this._matchersModalArea=null)}this._refreshAreas()},"area_registry_updated");this.isConnected?this._unsub=t:t()}_setConfig(t,e){let s=new Map(this._configs);s.set(t,e),this._configs=s}async _mutate(t,e){let s=this._configs.get(t);this._setConfig(t,e),this._error="";try{let{config:i}=await tt(this.hass,t,e);this._setConfig(t,i)}catch(i){s&&this._setConfig(t,s),this._error=i.message||String(i)}}_toggleExpand(t){let e=new Set(this._expanded);e.has(t)?e.delete(t):e.add(t),this._expanded=e}_openMatchersModal(t){this._matchersModalArea=t}_applyMatchers(t){let e=this._matchersModalArea;if(this._matchersModalArea=null,!e)return;let s=this._configs.get(e);s&&this._mutate(e,{...s,matchers:t.detail.matchers})}_toggleAutoSort(t,e){let s=this._configs.get(t);s&&this._mutate(t,{...s,auto_sort:e})}_addRule(t){let e=this._configs.get(t);e&&(this._editing={areaId:t,index:e.rules.length,isNew:!0})}_editRule(t,e){this._editing={areaId:t,index:e.detail.index,isNew:!1}}_duplicateRule(t,e){let s=this._configs.get(t);if(!s)return;let i=s.rules[e.detail.index];if(!i)return;let a=JSON.parse(JSON.stringify(i)),l=[...s.rules];l.splice(e.detail.index+1,0,a),this._mutate(t,{...s,rules:l})}_deleteRule(t,e){let s=this._configs.get(t);if(!s)return;let i=s.rules.filter((a,l)=>l!==e.detail.index);this._mutate(t,{...s,rules:i})}_reorderRules(t,e){let s=this._configs.get(t);if(!s)return;let{from:i,to:a}=e.detail,l=[...s.rules],[d]=l.splice(i,1);l.splice(a,0,d),this._mutate(t,{...s,rules:l})}_saveRule(t){let e=this._editing;if(this._editing=null,!e)return;let s=this._configs.get(e.areaId);if(!s)return;let i=[...s.rules];e.isNew?i.push(t.detail):i[e.index]=t.detail,this._mutate(e.areaId,{...s,rules:i})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._configs.get(this._editing.areaId)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let t=this._configs.get(this._editing.areaId);if(!t)return[];let e=new Set;for(let s of t.rules){let i=s.when.scene;typeof i=="string"&&i&&e.add(i)}return[...e].sort((s,i)=>s.toLowerCase().localeCompare(i.toLowerCase()))}get _editorMatchers(){if(!this._editing)return[];let t=this._configs.get(this._editing.areaId);if(!t)return[];let e=this._matchers.find(i=>i.name==="scene"),s=this._matchers.filter(i=>t.matchers.includes(i.name));return e?[e,...s]:s}_summary(t){if(t.rules.length===0&&t.matchers.length===0)return"not configured";let e=t.rules.length,s=t.matchers.length;return`${e} rule${e===1?"":"s"} \xB7 ${s} matcher${s===1?"":"s"}`}render(){return c`
      ${this._error?c`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?c`<p class="empty">No areas found in Home Assistant.</p>`:c`<ul>
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
    `}_renderArea(t){let e=this._configs.get(t.area_id);if(!e)return c``;let s=this._expanded.has(t.area_id);return c`
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
        ${s?c`
              <div class="area-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${e.auto_sort}
                    @change=${i=>this._toggleAutoSort(t.area_id,i.target.checked)}
                  />
                  Auto-sort rules
                </label>
                <ambience-rules-list
                  .rules=${e.rules}
                  ?autoSort=${e.auto_sort}
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
  `,o([u({attribute:!1})],$.prototype,"hass",2),o([p()],$.prototype,"_areas",2),o([p()],$.prototype,"_matchers",2),o([p()],$.prototype,"_actions",2),o([p()],$.prototype,"_configs",2),o([p()],$.prototype,"_expanded",2),o([p()],$.prototype,"_error",2),o([p()],$.prototype,"_editing",2),o([p()],$.prototype,"_matchersModalArea",2),$=o([b("ambience-areas-list")],$);var y=class extends g{constructor(){super(...arguments);this.areaId="";this._config=null;this._matchers=[];this._tab="scenes";this._error="";this._saved=!1;this._editingRuleIdx=null;this._isNewRule=!1;this._availableActions=[]}async connectedCallback(){super.connectedCallback(),await this._load(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _subscribe(){let t=await this.hass.connection.subscribeEvents(e=>{e.data.action==="remove"&&e.data.area_id===this.areaId&&this.dispatchEvent(new CustomEvent("close-area",{bubbles:!0,composed:!0}))},"area_registry_updated");this.isConnected?this._unsub=t:t()}async _load(){try{let[t,e,s]=await Promise.all([Y(this.hass,this.areaId),et(this.hass),rt(this.hass)]);this._config=t,this._matchers=e,this._availableActions=s}catch(t){this._error=t.message||String(t)}}_setTab(t){this._tab=t,this._saved=!1,this._error=""}_addScene(){this._config&&(this._config={...this._config,scenes:[...this._config.scenes,""]})}_updateScene(t,e){if(!this._config)return;let s=[...this._config.scenes];s[t]=e,this._config={...this._config,scenes:s}}_removeScene(t){if(!this._config)return;let e=this._config.scenes.filter((s,i)=>i!==t);this._config={...this._config,scenes:e}}_toggleMatcher(t,e){if(!this._config)return;let s=new Set(this._config.matchers);e?s.add(t):s.delete(t),this._config={...this._config,matchers:[...s]}}async _save(){if(this._config){this._error="",this._saved=!1;try{await tt(this.hass,this.areaId,this._config),this._saved=!0}catch(t){this._error=t.message||String(t)}}}render(){return this._config?c`
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
      ${this._config.scenes.map((t,e)=>c`
          <div class="row">
            <input
              type="text"
              .value=${t}
              @input=${s=>this._updateScene(e,s.target.value)}
            />
            <button class="secondary" @click=${()=>this._removeScene(e)}>×</button>
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
              @change=${e=>this._toggleMatcher(t.name,e.target.checked)}
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
    `}_addRule(){if(!this._config)return;let t={when:{scene:null},actions:[]};this._config={...this._config,rules:[...this._config.rules,t]},this._editingRuleIdx=this._config.rules.length-1,this._isNewRule=!0}_editRule(t){this._editingRuleIdx=t.detail.index,this._isNewRule=!1}_saveRule(t){if(!this._config||this._editingRuleIdx===null)return;let e=[...this._config.rules];e[this._editingRuleIdx]=t.detail,this._config={...this._config,rules:e},this._editingRuleIdx=null,this._isNewRule=!1}_cancelRule(){if(this._isNewRule&&this._config&&this._editingRuleIdx!==null){let t=this._config.rules.filter((e,s)=>s!==this._editingRuleIdx);this._config={...this._config,rules:t}}this._editingRuleIdx=null,this._isNewRule=!1}get _editingRule(){return this._editingRuleIdx===null||!this._config?null:this._config.rules[this._editingRuleIdx]??null}get _activeMatcherInfos(){if(!this._config)return[];let t=new Set(this._config.matchers);return this._matchers.filter(e=>t.has(e.name))}_deleteRule(t){if(!this._config)return;let e=this._config.rules.filter((s,i)=>i!==t.detail.index);this._config={...this._config,rules:e}}_moveRule(t){if(!this._config)return;let{index:e,delta:s}=t.detail,i=e+s;if(i<0||i>=this._config.rules.length)return;let a=[...this._config.rules];[a[e],a[i]]=[a[i],a[e]],this._config={...this._config,rules:a}}};y.styles=v`
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
  `,o([u({attribute:!1})],y.prototype,"hass",2),o([u()],y.prototype,"areaId",2),o([p()],y.prototype,"_config",2),o([p()],y.prototype,"_matchers",2),o([p()],y.prototype,"_tab",2),o([p()],y.prototype,"_error",2),o([p()],y.prototype,"_saved",2),o([p()],y.prototype,"_editingRuleIdx",2),o([p()],y.prototype,"_isNewRule",2),o([p()],y.prototype,"_availableActions",2),y=o([b("ambience-area-editor")],y);var N=class extends g{constructor(){super(...arguments);this._route={kind:"areas"}}render(){return c`
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
        @close-area=${()=>this._openAreas()}
      ></ambience-area-editor>
    `}_openArea(t){this._route={kind:"area",areaId:t}}_openAreas(){this._route={kind:"areas"}}};N.styles=v`
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
  `,o([u({attribute:!1})],N.prototype,"hass",2),o([p()],N.prototype,"_route",2),N=o([b("ambience-panel")],N);export{N as AmbiencePanel};
