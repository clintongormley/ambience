/* Ambience panel — bundled output. Do not edit by hand. */
var Ge=Object.defineProperty;var Ye=Object.getOwnPropertyDescriptor;var a=(n,r,e,t)=>{for(var i=t>1?void 0:t?Ye(r,e):r,s=n.length-1,o;s>=0;s--)(o=n[s])&&(i=(t?o(r,e,i):o(i))||i);return t&&i&&Ge(r,e,i),i};var Z=globalThis,Q=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ae=Symbol(),be=new WeakMap,q=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(Q&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=be.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&be.set(e,r))}return r}toString(){return this.cssText}},$e=n=>new q(typeof n=="string"?n:n+"",void 0,ae),g=(n,...r)=>{let e=n.length===1?n[0]:r.reduce((t,i,s)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[s+1],n[0]);return new q(e,n,ae)},we=(n,r)=>{if(Q)n.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),i=Z.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,n.appendChild(t)}},le=Q?n=>n:n=>n instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return $e(e)})(n):n;var{is:Ze,defineProperty:Qe,getOwnPropertyDescriptor:et,getOwnPropertyNames:tt,getOwnPropertySymbols:rt,getPrototypeOf:it}=Object,ee=globalThis,xe=ee.trustedTypes,st=xe?xe.emptyScript:"",nt=ee.reactiveElementPolyfillSupport,F=(n,r)=>n,W={toAttribute(n,r){switch(r){case Boolean:n=n?st:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,r){let e=n;switch(r){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},te=(n,r)=>!Ze(n,r),Ee={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:te};Symbol.metadata??=Symbol("metadata"),ee.litPropertyMetadata??=new WeakMap;var C=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=Ee){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(r,t,e);i!==void 0&&Qe(this.prototype,r,i)}}static getPropertyDescriptor(r,e,t){let{get:i,set:s}=et(this.prototype,r)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let l=i?.call(this);s?.call(this,o),this.requestUpdate(r,l,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??Ee}static _$Ei(){if(this.hasOwnProperty(F("elementProperties")))return;let r=it(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(F("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(F("properties"))){let e=this.properties,t=[...tt(e),...rt(e)];for(let i of t)this.createProperty(i,e[i])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let i of t)e.unshift(le(i))}else r!==void 0&&e.push(le(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return we(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),i=this.constructor._$Eu(r,t);if(i!==void 0&&t.reflect===!0){let s=(t.converter?.toAttribute!==void 0?t.converter:W).toAttribute(e,t.type);this._$Em=r,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(r,e){let t=this.constructor,i=t._$Eh.get(r);if(i!==void 0&&this._$Em!==i){let s=t.getPropertyOptions(i),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:W;this._$Em=i;let l=o.fromAttribute(e,s.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(r,e,t,i=!1,s){if(r!==void 0){let o=this.constructor;if(i===!1&&(s=this[r]),t??=o.getPropertyOptions(r),!((t.hasChanged??te)(s,e)||t.useDefault&&t.reflect&&s===this._$Ej?.get(r)&&!this.hasAttribute(o._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:i,wrapped:s},o){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,o??e??this[r]),s!==!0||o!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),i===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,s]of t){let{wrapped:o}=s,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,s,l)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};C.elementStyles=[],C.shadowRootOptions={mode:"open"},C[F("elementProperties")]=new Map,C[F("finalized")]=new Map,nt?.({ReactiveElement:C}),(ee.reactiveElementVersions??=[]).push("2.1.2");var fe=globalThis,ke=n=>n,re=fe.trustedTypes,Se=re?re.createPolicy("lit-html",{createHTML:n=>n}):void 0,Re="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,Ne="?"+R,ot=`<${Ne}>`,M=document,V=()=>M.createComment(""),K=n=>n===null||typeof n!="object"&&typeof n!="function",ge=Array.isArray,at=n=>ge(n)||typeof n?.[Symbol.iterator]=="function",de=`[ 	
\f\r]`,B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ce=/-->/g,Ae=/>/g,N=RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Pe=/'/g,He=/"/g,Oe=/^(?:script|style|textarea|title)$/i,ve=n=>(r,...e)=>({_$litType$:n,strings:r,values:e}),d=ve(1),Et=ve(2),kt=ve(3),D=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),Te=new WeakMap,O=M.createTreeWalker(M,129);function Me(n,r){if(!ge(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Se!==void 0?Se.createHTML(r):r}var lt=(n,r)=>{let e=n.length-1,t=[],i,s=r===2?"<svg>":r===3?"<math>":"",o=B;for(let l=0;l<e;l++){let c=n[l],u,_,f=-1,S=0;for(;S<c.length&&(o.lastIndex=S,_=o.exec(c),_!==null);)S=o.lastIndex,o===B?_[1]==="!--"?o=Ce:_[1]!==void 0?o=Ae:_[2]!==void 0?(Oe.test(_[2])&&(i=RegExp("</"+_[2],"g")),o=N):_[3]!==void 0&&(o=N):o===N?_[0]===">"?(o=i??B,f=-1):_[1]===void 0?f=-2:(f=o.lastIndex-_[2].length,u=_[1],o=_[3]===void 0?N:_[3]==='"'?He:Pe):o===He||o===Pe?o=N:o===Ce||o===Ae?o=B:(o=N,i=void 0);let T=o===N&&n[l+1].startsWith("/>")?" ":"";s+=o===B?c+ot:f>=0?(t.push(u),c.slice(0,f)+Re+c.slice(f)+R+T):c+R+(f===-2?l:T)}return[Me(n,s+(n[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},J=class n{constructor({strings:r,_$litType$:e},t){let i;this.parts=[];let s=0,o=0,l=r.length-1,c=this.parts,[u,_]=lt(r,e);if(this.el=n.createElement(u,t),O.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(i=O.nextNode())!==null&&c.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let f of i.getAttributeNames())if(f.endsWith(Re)){let S=_[o++],T=i.getAttribute(f).split(R),Y=/([.?@])?(.*)/.exec(S);c.push({type:1,index:s,name:Y[2],strings:T,ctor:Y[1]==="."?he:Y[1]==="?"?ue:Y[1]==="@"?pe:z}),i.removeAttribute(f)}else f.startsWith(R)&&(c.push({type:6,index:s}),i.removeAttribute(f));if(Oe.test(i.tagName)){let f=i.textContent.split(R),S=f.length-1;if(S>0){i.textContent=re?re.emptyScript:"";for(let T=0;T<S;T++)i.append(f[T],V()),O.nextNode(),c.push({type:2,index:++s});i.append(f[S],V())}}}else if(i.nodeType===8)if(i.data===Ne)c.push({type:2,index:s});else{let f=-1;for(;(f=i.data.indexOf(R,f+1))!==-1;)c.push({type:7,index:s}),f+=R.length-1}s++}}static createElement(r,e){let t=M.createElement("template");return t.innerHTML=r,t}};function U(n,r,e=n,t){if(r===D)return r;let i=t!==void 0?e._$Co?.[t]:e._$Cl,s=K(r)?void 0:r._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(n),i._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(r=U(n,i._$AS(n,r.values),i,t)),r}var ce=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,i=(r?.creationScope??M).importNode(e,!0);O.currentNode=i;let s=O.nextNode(),o=0,l=0,c=t[0];for(;c!==void 0;){if(o===c.index){let u;c.type===2?u=new X(s,s.nextSibling,this,r):c.type===1?u=new c.ctor(s,c.name,c.strings,this,r):c.type===6&&(u=new me(s,this,r)),this._$AV.push(u),c=t[++l]}o!==c?.index&&(s=O.nextNode(),o++)}return O.currentNode=M,i}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},X=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,i){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=U(this,r,e),K(r)?r===y||r==null||r===""?(this._$AH!==y&&this._$AR(),this._$AH=y):r!==this._$AH&&r!==D&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):at(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==y&&K(this._$AH)?this._$AA.nextSibling.data=r:this.T(M.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,i=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=J.createElement(Me(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let s=new ce(i,this),o=s.u(this.options);s.p(e),this.T(o),this._$AH=s}}_$AC(r){let e=Te.get(r.strings);return e===void 0&&Te.set(r.strings,e=new J(r)),e}k(r){ge(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let s of r)i===e.length?e.push(t=new n(this.O(V()),this.O(V()),this,this.options)):t=e[i],t._$AI(s),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=ke(r).nextSibling;ke(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,i,s){this.type=1,this._$AH=y,this._$AN=void 0,this.element=r,this.name=e,this._$AM=i,this.options=s,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=y}_$AI(r,e=this,t,i){let s=this.strings,o=!1;if(s===void 0)r=U(this,r,e,0),o=!K(r)||r!==this._$AH&&r!==D,o&&(this._$AH=r);else{let l=r,c,u;for(r=s[0],c=0;c<s.length-1;c++)u=U(this,l[t+c],e,c),u===D&&(u=this._$AH[c]),o||=!K(u)||u!==this._$AH[c],u===y?r=y:r!==y&&(r+=(u??"")+s[c+1]),this._$AH[c]=u}o&&!i&&this.j(r)}j(r){r===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},he=class extends z{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===y?void 0:r}},ue=class extends z{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==y)}},pe=class extends z{constructor(r,e,t,i,s){super(r,e,t,i,s),this.type=5}_$AI(r,e=this){if((r=U(this,r,e,0)??y)===D)return;let t=this._$AH,i=r===y&&t!==y||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,s=r!==y&&(t===y||i);i&&this.element.removeEventListener(this.name,this,t),s&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},me=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){U(this,r)}};var dt=fe.litHtmlPolyfillSupport;dt?.(J,X),(fe.litHtmlVersions??=[]).push("3.3.2");var De=(n,r,e)=>{let t=e?.renderBefore??r,i=t._$litPart$;if(i===void 0){let s=e?.renderBefore??null;t._$litPart$=i=new X(r.insertBefore(V(),s),s,void 0,e??{})}return i._$AI(n),i};var _e=globalThis,m=class extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=De(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return D}};m._$litElement$=!0,m.finalized=!0,_e.litElementHydrateSupport?.({LitElement:m});var ct=_e.litElementPolyfillSupport;ct?.({LitElement:m});(_e.litElementVersions??=[]).push("4.2.2");var v=n=>(r,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(n,r)}):customElements.define(n,r)};var ht={attribute:!0,type:String,converter:W,reflect:!1,hasChanged:te},ut=(n=ht,r,e)=>{let{kind:t,metadata:i}=e,s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),t==="setter"&&((n=Object.create(n)).wrapped=!0),s.set(e.name,n),t==="accessor"){let{name:o}=e;return{set(l){let c=r.get.call(this);r.set.call(this,l),this.requestUpdate(o,c,n,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,n,l),l}}}if(t==="setter"){let{name:o}=e;return function(l){let c=this[o];r.call(this,l),this.requestUpdate(o,c,n,!0,l)}}throw Error("Unsupported decorator location: "+t)};function h(n){return(r,e)=>typeof e=="object"?ut(n,r,e):((t,i,s)=>{let o=i.hasOwnProperty(s);return i.constructor.createProperty(s,t),o?Object.getOwnPropertyDescriptor(i,s):void 0})(n,r,e)}function p(n){return h({...n,state:!0,attribute:!1})}var Ue=["ha-combo-box","ha-input","ha-textfield"],pt=["ha-input","ha-textfield"];function ze(){for(let n of pt)if(customElements.get(n))return n;return null}var se=null,je=!1,mt=["ha-combo-box","ha-textfield","ha-input","ha-form","ha-select","ha-listbox","ha-entity-picker","ha-selector","ha-selector-text","ha-selector-select","ha-md-textfield","ha-md-select","ha-md-outlined-text-field","ha-md-outlined-select","ha-md-autocomplete","ha-md-list","ha-md-list-item","ha-md-menu","ha-md-menu-item","ha-dialog","ha-card"];function ye(n){return se||(se=(async()=>{if(Ue.every(t=>customElements.get(t)))return;try{let t=await import("custom-card-helpers");if(typeof t.loadCardHelpers=="function"){let i=await t.loadCardHelpers();if(await Ie(i,"custom-card-helpers"))return}}catch(t){console.warn("ambience: dynamic import of 'custom-card-helpers' failed; falling back to legacy loader probes",t)}let r=ft(n),e=n&&typeof n=="object"?Object.keys(n).filter(t=>/load|helper|card|form|element|register/i.test(t)):[];console.log("ambience: probing for HA component loaders \u2192",Object.fromEntries(r.map(t=>[t.name,t.fn?"found":"\u2014"])),"components registered (broad probe):",Object.fromEntries(mt.map(t=>[t,!!customElements.get(t)])),"hass-object keys matching /load|helper|card|form|element|register/i:",e);for(let{name:t,fn:i}of r){if(typeof i!="function")continue;let s;try{s=await i()}catch(o){console.warn(`ambience: ${t}() threw`,o);continue}if(!s?.createCardElement){console.warn(`ambience: ${t}() returned no createCardElement`);continue}if(await Ie(s,t))return}console.warn("ambience: every load strategy was tried; HA form components are still not in the custom-element registry. Panel will use self-contained fallback widgets. Please report this with the probe output above and your HA version.")})(),se)}async function Ie(n,r){let e=["entities","tile","thermostat","weather-forecast","markdown"];for(let t of e){try{await(await n.createCardElement({type:t,entities:[]})).constructor?.getConfigElement?.()}catch(i){console.debug(`ambience: ${r} + ${t} card editor failed`,i)}if(customElements.get("ha-combo-box"))return console.log(`ambience: HA components loaded via ${r} + ${t} card editor`),!0}return!1}function ft(n){let r=window,e=document.querySelector("home-assistant"),t=e?.shadowRoot?.querySelector("home-assistant-main"),i=n;return[{name:"window.loadCardHelpers",fn:r.loadCardHelpers?.bind(r)},{name:"hass.loadCardHelpers",fn:i?.loadCardHelpers?.bind(i)},{name:"<home-assistant>.loadCardHelpers",fn:e?.loadCardHelpers?.bind(e)},{name:"<home-assistant-main>.loadCardHelpers",fn:t?.loadCardHelpers?.bind(t)}]}function ne(n,r){for(let e of Ue)customElements.get(e)||customElements.whenDefined(e).then(()=>n.requestUpdate());je||(je=!0,ye(r))}async function Le(n){return n.callWS({type:"ambience/areas/list"})}async function qe(n,r){return n.callWS({type:"ambience/area/get",area_id:r})}async function Fe(n,r,e){return n.callWS({type:"ambience/area/save",area_id:r,config:e})}async function We(n){return n.callWS({type:"ambience/matchers/list"})}async function Be(n){return n.callWS({type:"ambience/actions/list"})}async function oe(n){return n.callWS({type:"ambience/time_of_day_periods/list"})}async function Ve(n,r,e){return n.callWS({type:"ambience/time_of_day_periods/save",custom:r,hidden:e})}async function Ke(n){return n.callWS({type:"ambience/time_of_day_periods/reset"})}function j(n,r,e){let t=e[r]?.label;if(t)return t;let i=`component.ambience.time_of_day_period.${r}`,s=n?.localize?.(i);return s&&s!==i?s:r.charAt(0).toUpperCase()+r.slice(1)}var x=class extends m{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_summary(e){let t=this.periods?.custom??{},i=Object.keys(e.when).filter(l=>e.when[l]!=null),s=i.length===0?"any":i.map(l=>`${l}=${this._describeValue(l,e.when[l],t)}`).join(", "),o=e.actions.length;return`${s} \xB7 ${o} action${o===1?"":"s"}`}_describeValue(e,t,i){return e==="time_of_day"?this._describeTimeOfDay(t,i):String(t)}_describeTimeOfDay(e,t){return e===null?"any":(Array.isArray(e)?e:[e]).map(s=>{if("period"in s)return j(this.hass,s.period,t);let o=l=>{if(l.kind==="time")return`${String(l.hh??0).padStart(2,"0")}:${String(l.mm??0).padStart(2,"0")}`;let c=Math.abs(l.offset_min??0),u=c%60===0?`${c/60}h`:`${c}m`;return`${l.anchor}${(l.offset_min??0)<0?"-":"+"}${u==="0h"?"":u}`};return`${o(s.from)}\u2192${o(s.to)}`}).join(", ")}_onDragStart(e){this._dragFrom=e}_onDragOver(e,t){this._dragFrom===null||t===this._dragFrom||(e.preventDefault(),this._dragOver=t)}_onDrop(e){let t=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(t===null||t===e)&&this._emit("reorder-rules",{from:t,to:e})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(e,t){let i=t.name||`Rule ${e+1}`;window.confirm(`Delete "${i}"?`)&&this._emit("delete-rule",{index:e})}render(){return this.rules.length===0?d`
        <p class="empty">No rules yet.</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          + Add rule
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
              ${this.autoSort?"":d`<span class="handle" title="Drag to reorder">⠿</span>`}
              <span class="idx">${t+1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${()=>this._emit("edit-rule",{index:t})}
                >
                  ${e.name||`Rule ${t+1}`}
                </div>
                <div class="summary">${this._summary(e)}</div>
              </div>
              <button
                @click=${()=>this._emit("duplicate-rule",{index:t})}
                title="Duplicate"
              >
                ⧉
              </button>
              <button
                @click=${()=>this._confirmDelete(t,e)}
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
  `,a([h({attribute:!1})],x.prototype,"rules",2),a([h({type:Boolean})],x.prototype,"autoSort",2),a([h({attribute:!1})],x.prototype,"periods",2),a([h({attribute:!1})],x.prototype,"hass",2),a([p()],x.prototype,"_dragFrom",2),a([p()],x.prototype,"_dragOver",2),x=a([v("ambience-rules-list")],x);var E=class extends m{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=e=>{this._open&&(e.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=e=>{e.stopPropagation();let t=e.detail.value?.scene??"";this._emit(t.trim()===""?null:t)}}connectedCallback(){super.connectedCallback(),ne(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(e){e.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(t=>({value:t,label:t})),custom_value:!0,mode:"dropdown"}}}])}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target.value;this._emit(t.trim()===""?null:t),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(e){e.key==="Escape"&&this._open&&(this._open=!1,e.stopPropagation())}_toggle(e){e.preventDefault(),this._open=!this._open}_select(e,t){t.preventDefault(),this._emit(e),this._open=!1}render(){if(customElements.get("ha-form")){let e={scene:this.value??""};return d`
        <ha-form
          .hass=${this.hass}
          .schema=${this._schema}
          .data=${e}
          @value-changed=${this._onHaFormValueChanged}
        ></ha-form>
      `}return d`
      <div class="control">
        <input
          type="text"
          placeholder="(any scene)"
          .value=${this.value??""}
          @input=${this._onInput}
          @focus=${this._onFocus}
          @keydown=${this._onKeyDown}
        />
        <button
          class="toggle"
          type="button"
          tabindex="-1"
          aria-label="Show scene suggestions"
          @mousedown=${this._toggle}
        >
          ▼
        </button>
      </div>
      ${this._open?d`
            <div class="menu" role="listbox">
              ${this.suggestions.length===0?d`<div class="empty">
                    No scenes yet — type to create one
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
    `}};E.styles=g`
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
  `,a([h({attribute:!1})],E.prototype,"hass",2),a([h()],E.prototype,"value",2),a([h({attribute:!1})],E.prototype,"suggestions",2),a([p()],E.prototype,"_schema",2),a([p()],E.prototype,"_open",2),E=a([v("ambience-scene-combobox")],E);var gt=["sunrise","noon","sunset","midnight","dawn","dusk"],L=class extends m{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onKindChange(e){let t=e.target.value;t!==this.value.kind&&(t==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let t=e.target.value,[i,s]=t.split(":").map(o=>parseInt(o,10));Number.isNaN(i)||Number.isNaN(s)||this._emit({kind:"time",hh:i,mm:s})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let t=e.target.value;this._emit({kind:"sun",anchor:t,offset_min:this.value.offset_min})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let t=parseInt(e.target.value,10);Number.isNaN(t)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:t})}_renderTime(e){let t=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return d`<input type="time" .value=${t} @input=${this._onTimeChange} />`}_renderSun(e){let t=e.offset_min===0?"":e.offset_min%60===0?`${e.offset_min/60}h`:`${e.offset_min}m`;return d`
      <select @change=${this._onAnchorChange}>
        ${gt.map(i=>d`<option value=${i} ?selected=${i===e.anchor}>${i}</option>`)}
      </select>
      <input
        type="number"
        step="1"
        .value=${String(e.offset_min)}
        @input=${this._onOffsetChange}
      />
      <span class="offset-hint">${t}</span>
    `}render(){return d`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>Time</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>Sun</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};L.styles=g`
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
  `,a([h({attribute:!1})],L.prototype,"value",2),L=a([v("ambience-time-endpoint")],L);var G={kind:"any"},Je={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},A=class extends m{constructor(){super(...arguments);this.value=null;this._entries=[G]}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[G]))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach((t,i)=>{let s=this._entries[i];if(!s)return;let o=s.kind==="any"?"__any__":s.kind==="range"?"__custom__":s.period;t.value!==o&&(t.value=o)})}_predicateToEntries(e){return e===null?[G]:(Array.isArray(e)?e:[e]).map(i=>"period"in i?{kind:"period",period:i.period}:{kind:"range",from:i.from,to:i.to})}_emit(e){let t=e.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),i=t.length===0?null:t.length===1?t[0]:t;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:i},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let e=Object.keys(this.periods.builtins),t=Object.keys(this.periods.custom).filter(s=>!(s in this.periods.builtins)),i=new Set(this.periods.hidden);return[...e.filter(s=>!i.has(s)),...t]}_onSelectChange(e,t){let i=t.target.value,s=[...this._entries];i==="__any__"?s[e]=G:i==="__custom__"?s[e]={kind:"range",...Je}:s[e]={kind:"period",period:i},this._entries=s,this._emit(s)}_onRangeChange(e,t,i){i.stopPropagation();let s=this._entries[e];if(!s||s.kind!=="range")return;let o=[...this._entries];o[e]={...s,[t]:i.detail.value},this._entries=o,this._emit(o)}_onRemove(e){let t=this._entries.filter((i,s)=>s!==e);this._entries=t.length===0?[G]:t,this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...Je}];this._entries=e,this._emit(e)}_renderEntry(e,t,i){let s=this._effectiveIds(),o=this.periods?.custom??{};return d`
      <div class="entry">
        <div class="entry-header">
          <select @change=${l=>this._onSelectChange(t,l)}>
            ${i?d`<option value="__any__">Any time</option>`:""}
            <option value="__custom__">Custom range</option>
            <option disabled>──────</option>
            ${s.map(l=>d`<option value=${l}>
                ${j(this.hass,l,o)}${o[l]&&!this.periods?.builtins[l]?" (custom)":""}
              </option>`)}
          </select>
          ${this._entries.length>1?d`<button class="remove" @click=${()=>this._onRemove(t)} title="Remove">✕</button>`:""}
        </div>
        ${e.kind==="range"?d`
              <div class="range-row">
                <label>From</label>
                <ambience-time-endpoint
                  .value=${e.from}
                  @value-changed=${l=>this._onRangeChange(t,"from",l)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>To</label>
                <ambience-time-endpoint
                  .value=${e.to}
                  @value-changed=${l=>this._onRangeChange(t,"to",l)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(t=>t.kind!=="any");return d`
      ${this._entries.map((t,i)=>this._renderEntry(t,i,i===0))}
      ${e?d`<button class="add-btn" @click=${this._onAdd}>+ add another time range</button>`:""}
    `}};A.styles=g`
    :host { display: block; }
    .entry {
      display: flex; flex-direction: column; gap: 0.5rem;
      padding: 0.5rem; border: 1px solid var(--divider-color, #ddd);
      border-radius: 4px; margin-bottom: 0.5rem;
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
  `,a([h({attribute:!1})],A.prototype,"value",2),a([h({attribute:!1})],A.prototype,"periods",2),a([h({attribute:!1})],A.prototype,"hass",2),a([p()],A.prototype,"_entries",2),A=a([v("ambience-time-of-day-input")],A);var k=class extends m{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onText(e){let t=e.target.value;this._emit(t.trim()===""?null:t)}render(){return this.matcher.input==="time_of_day"?d`
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
      `:d`
      <input
        type="text"
        placeholder="(any)"
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};k.styles=g`
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
  `,a([h({attribute:!1})],k.prototype,"matcher",2),a([h({attribute:!1})],k.prototype,"value",2),a([h({attribute:!1})],k.prototype,"sceneSuggestions",2),a([h({attribute:!1})],k.prototype,"periods",2),a([h({attribute:!1})],k.prototype,"hass",2),k=a([v("ambience-matcher-input")],k);var $=class extends m{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._onNameInput=e=>{this._setName(e.target.value)}}connectedCallback(){super.connectedCallback(),ne(this)}willUpdate(e){e.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_renderNameField(){let e=this._draft.name??"",t=ze();return t==="ha-input"?d`
        <ha-input
          label="Name (optional)"
          .value=${e}
          @input=${this._onNameInput}
        ></ha-input>
      `:t==="ha-textfield"?d`
        <ha-textfield
          label="Name (optional)"
          .value=${e}
          @input=${this._onNameInput}
        ></ha-textfield>
      `:d`
      <label>Name (optional)</label>
      <input
        type="text"
        .value=${e}
        @input=${this._onNameInput}
      />
    `}_setPredicate(e,t){if(!this._draft)return;let i={...this._draft.when};t==null?delete i[e]:i[e]=t,this._draft={...this._draft,when:i}}_addActionSlot(){if(!this._draft)return;let e={action:"set_light",targets:{}};this._draft={...this._draft,actions:[...this._draft.actions,e]}}_updateActionAt(e,t){if(!this._draft)return;let i=this._draft.actions.map((s,o)=>o===e?t(s):s);this._draft={...this._draft,actions:i}}_changeActionType(e,t){this._updateActionAt(e,()=>({action:t,targets:{}}))}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((t,i)=>i!==e)})}_addTarget(e){this._updateActionAt(e,t=>{let i=this.availableActions.find(o=>o.name===t.action),s={};return i?.target_params.forEach(o=>{"default"in o&&(s[o.name]=o.default)}),{...t,targets:{...t.targets,"":s}}})}_updateTargetId(e,t,i){this._updateActionAt(e,s=>{if(t===i)return s;let o={...s.targets};return o[i]=o[t],delete o[t],{...s,targets:o}})}_updateTargetParam(e,t,i,s){this._updateActionAt(e,o=>{let l={...o.targets},c={...l[t]??{}},u=s;return i.type==="int"?u=s===""?void 0:parseInt(s,10):i.type==="number"?u=s===""?void 0:parseFloat(s):i.type==="boolean"&&(u=s==="true"),u===void 0?delete c[i.name]:c[i.name]=u,l[t]=c,{...o,targets:l}})}_deleteTarget(e,t){this._updateActionAt(e,i=>{let s={...i.targets};return delete s[t],{...i,targets:s}})}_renderTargets(e,t){let i=this.availableActions.find(l=>l.name===t.action),s=i?.target_params??[],o=Object.entries(t.targets);return o.length===0?d`<p
        style="color: var(--secondary-text-color, #888); margin: 0.5rem 0;"
      >
        No targets yet.
      </p>`:d`
      ${o.map(([l,c])=>d`
          <div
            style="display: grid; grid-template-columns: 1fr ${"1fr ".repeat(s.length)}auto; gap: 0.5rem; margin: 0.5rem 0; align-items: end;"
          >
            <div>
              <label>entity_id</label>
              <input
                type="text"
                .value=${l}
                placeholder="${i?.domains?.[0]??"domain"}.example"
                @change=${u=>this._updateTargetId(e,l,u.target.value)}
              />
            </div>
            ${s.map(u=>d`
                <div>
                  <label>${u.name}${u.required?" *":""}</label>
                  <input
                    type=${u.type==="int"||u.type==="number"?"number":"text"}
                    .value=${String(c[u.name]??"")}
                    min=${u.min??""}
                    max=${u.max??""}
                    @input=${_=>this._updateTargetParam(e,l,u,_.target.value)}
                  />
                </div>
              `)}
            <button
              class="secondary"
              @click=${()=>this._deleteTarget(e,l)}
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
        ${this.matchers.map(e=>d`
            <label>${e.name==="scene"?"Scene":e.name}</label>
            <ambience-matcher-input
              .hass=${this.hass}
              .matcher=${e}
              .value=${this._draft.when[e.name]??null}
              .sceneSuggestions=${this.sceneSuggestions}
              .periods=${this.periods}
              @value-changed=${t=>this._setPredicate(e.name,t.detail.value)}
            ></ambience-matcher-input>
          `)}

        <h3>Actions</h3>
        ${this._draft.actions.map((e,t)=>d`
            <div
              style="border: 1px solid var(--divider-color, #e0e0e0); border-radius: 4px; padding: 0.75rem; margin-bottom: 0.5rem;"
            >
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <select
                  @change=${i=>this._changeActionType(t,i.target.value)}
                >
                  ${this.availableActions.map(i=>d`
                      <option
                        value=${i.name}
                        ?selected=${e.action===i.name}
                      >
                        ${i.name}
                      </option>
                    `)}
                </select>
                <button
                  class="secondary"
                  style="margin-left: auto"
                  @click=${()=>this._deleteAction(t)}
                >
                  Remove action
                </button>
              </div>

              ${this._renderTargets(t,e)}

              <button
                class="secondary"
                @click=${()=>this._addTarget(t)}
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
    `:d``}};$.styles=g`
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
  `,a([h({type:Boolean,reflect:!0})],$.prototype,"open",2),a([h({attribute:!1})],$.prototype,"rule",2),a([h({attribute:!1})],$.prototype,"matchers",2),a([h({attribute:!1})],$.prototype,"sceneSuggestions",2),a([h({attribute:!1})],$.prototype,"periods",2),a([h({attribute:!1})],$.prototype,"availableActions",2),a([h({attribute:!1})],$.prototype,"hass",2),a([p()],$.prototype,"_draft",2),$=a([v("ambience-rule-editor")],$);var P=class extends m{constructor(){super(...arguments);this.open=!1;this.matchers=[];this.selected=[];this._draft=new Set}willUpdate(e){(e.has("selected")||e.has("open"))&&this.open&&(this._draft=new Set(this.selected))}_toggle(e,t){let i=new Set(this._draft);t?i.add(e):i.delete(e),this._draft=i}_apply(){this.dispatchEvent(new CustomEvent("apply-matchers",{detail:{matchers:[...this._draft]},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-matchers",{bubbles:!0,composed:!0}))}render(){let e=this.matchers.filter(t=>t.toggleable);return d`
      <div class="modal">
        <h2>Matchers</h2>
        <p class="intro">
          Select which matchers can be used in this area's rule predicates.
        </p>
        ${e.map(t=>d`
            <label class="matcher-row">
              <input
                type="checkbox"
                .checked=${this._draft.has(t.name)}
                @change=${i=>this._toggle(t.name,i.target.checked)}
              />
              <div class="matcher-meta">
                <div class="matcher-name">${t.name}</div>
                <div>${t.description}</div>
                <div class="matcher-help">${t.predicate_help}</div>
              </div>
            </label>
          `)}
        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._apply}>Apply</button>
        </div>
      </div>
    `}};P.styles=g`
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
  `,a([h({type:Boolean,reflect:!0})],P.prototype,"open",2),a([h({attribute:!1})],P.prototype,"matchers",2),a([h({attribute:!1})],P.prototype,"selected",2),a([p()],P.prototype,"_draft",2),P=a([v("ambience-matchers-modal")],P);var b=class extends m{constructor(){super(...arguments);this._areas=[];this._matchers=[];this._actions=[];this._configs=new Map;this._expanded=new Set;this._error="";this._editing=null;this._matchersModalArea=null}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await this._refreshAreas(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _loadStatic(){try{let[e,t,i]=await Promise.all([We(this.hass),Be(this.hass),oe(this.hass)]);if(!this.isConnected)return;this._matchers=e,this._actions=t,this._periods=i}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await Le(this.hass),t=new Map;if(await Promise.all(e.map(async i=>{t.set(i.area_id,this._normalize(await qe(this.hass,i.area_id)))})),!this.isConnected)return;this._areas=e,this._configs=t}catch(e){this._error=e.message||String(e)}}_normalize(e){return{matchers:e.matchers??[],rules:e.rules??[],auto_sort:e.auto_sort??!0}}async _subscribe(){let e=await this.hass.connection.subscribeEvents(t=>{if(t.data.action==="remove"){let i=t.data.area_id,s=new Set(this._expanded);s.delete(i),this._expanded=s,this._editing?.areaId===i&&(this._editing=null),this._matchersModalArea===i&&(this._matchersModalArea=null)}this._refreshAreas()},"area_registry_updated");this.isConnected?this._unsub=e:e()}_setConfig(e,t){let i=new Map(this._configs);i.set(e,t),this._configs=i}async _mutate(e,t){let i=this._configs.get(e);this._setConfig(e,t),this._error="";try{let{config:s}=await Fe(this.hass,e,t);this._setConfig(e,this._normalize(s))}catch(s){i&&this._setConfig(e,i),this._error=s.message||String(s)}}_toggleExpand(e){let t=new Set(this._expanded);t.has(e)?t.delete(e):t.add(e),this._expanded=t}_openMatchersModal(e){this._matchersModalArea=e}_applyMatchers(e){let t=this._matchersModalArea;if(this._matchersModalArea=null,!t)return;let i=this._configs.get(t);i&&this._mutate(t,{...i,matchers:e.detail.matchers})}_toggleAutoSort(e,t){let i=this._configs.get(e);i&&this._mutate(e,{...i,auto_sort:t})}_addRule(e){let t=this._configs.get(e);t&&(this._editing={areaId:e,index:t.rules.length,isNew:!0})}_editRule(e,t){this._editing={areaId:e,index:t.detail.index,isNew:!1}}_duplicateRule(e,t){let i=this._configs.get(e);if(!i)return;let s=i.rules[t.detail.index];if(!s)return;let o=JSON.parse(JSON.stringify(s)),l=[...i.rules];l.splice(t.detail.index+1,0,o),this._mutate(e,{...i,rules:l})}_deleteRule(e,t){let i=this._configs.get(e);if(!i)return;let s=i.rules.filter((o,l)=>l!==t.detail.index);this._mutate(e,{...i,rules:s})}_reorderRules(e,t){let i=this._configs.get(e);if(!i)return;let{from:s,to:o}=t.detail,l=[...i.rules],[c]=l.splice(s,1);l.splice(o,0,c),this._mutate(e,{...i,rules:l})}_saveRule(e){let t=this._editing;if(this._editing=null,!t)return;let i=this._configs.get(t.areaId);if(!i)return;let s=[...i.rules];t.isNew?s.push(e.detail):s[t.index]=e.detail,this._mutate(t.areaId,{...i,rules:s})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._configs.get(this._editing.areaId)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let e=this._configs.get(this._editing.areaId);if(!e)return[];let t=new Set;for(let i of e.rules){let s=i.when.scene;typeof s=="string"&&s&&t.add(s)}return[...t].sort((i,s)=>i.toLowerCase().localeCompare(s.toLowerCase()))}get _editorMatchers(){if(!this._editing)return[];let e=this._configs.get(this._editing.areaId);if(!e)return[];let t=this._matchers.find(s=>s.name==="scene"),i=this._matchers.filter(s=>e.matchers.includes(s.name));return t?[t,...i]:i}_summary(e){if(e.rules.length===0&&e.matchers.length===0)return"not configured";let t=e.rules.length,i=e.matchers.length;return`${t} rule${t===1?"":"s"} \xB7 ${i} matcher${i===1?"":"s"}`}render(){return d`
      ${this._error?d`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?d`<p class="empty">No areas found in Home Assistant.</p>`:d`<ul>
            ${this._areas.map(e=>this._renderArea(e))}
          </ul>`}

      <ambience-rule-editor
        ?open=${this._editing!==null}
        .hass=${this.hass}
        .rule=${this._editingRule}
        .matchers=${this._editorMatchers}
        .sceneSuggestions=${this._sceneSuggestions}
        .periods=${this._periods}
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
    `}_renderArea(e){let t=this._configs.get(e.area_id);if(!t)return d``;let i=this._expanded.has(e.area_id);return d`
      <li>
        <div
          class="area-header"
          @click=${()=>this._toggleExpand(e.area_id)}
        >
          <span class="chevron ${i?"open":""}">▶</span>
          <span class="area-name">${e.name}</span>
          <span class="area-summary">${this._summary(t)}</span>
          <button
            class="cog"
            title="Matchers"
            @click=${s=>{s.stopPropagation(),this._openMatchersModal(e.area_id)}}
          >
            ⚙
          </button>
        </div>
        ${i?d`
              <div class="area-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!t.auto_sort}
                    @change=${s=>this._toggleAutoSort(e.area_id,!s.target.checked)}
                  />
                  Order rules manually
                </label>
                <ambience-rules-list
                  .rules=${t.rules}
                  .autoSort=${t.auto_sort}
                  .periods=${this._periods}
                  .hass=${this.hass}
                  @add-rule=${()=>this._addRule(e.area_id)}
                  @edit-rule=${s=>this._editRule(e.area_id,s)}
                  @duplicate-rule=${s=>this._duplicateRule(e.area_id,s)}
                  @delete-rule=${s=>this._deleteRule(e.area_id,s)}
                  @reorder-rules=${s=>this._reorderRules(e.area_id,s)}
                ></ambience-rules-list>
              </div>
            `:""}
      </li>
    `}};b.styles=g`
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
  `,a([h({attribute:!1})],b.prototype,"hass",2),a([p()],b.prototype,"_areas",2),a([p()],b.prototype,"_matchers",2),a([p()],b.prototype,"_actions",2),a([p()],b.prototype,"_periods",2),a([p()],b.prototype,"_configs",2),a([p()],b.prototype,"_expanded",2),a([p()],b.prototype,"_error",2),a([p()],b.prototype,"_editing",2),a([p()],b.prototype,"_matchersModalArea",2),b=a([v("ambience-areas-list")],b);var vt=/^[a-z][a-z0-9_]*$/,w=class extends m{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._id="";this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._id=this.existingId??"",this._label=this.initial.label??"",this._def=this.initial}_onIdInput(e){this._id=e.target.value}_onLabelInput(e){this._label=e.target.value}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_validate(){if(!this.existingId){if(!vt.test(this._id))return"Id must be lowercase, start with a letter, and contain only letters, digits, and underscores.";if(this.takenIds.has(this._id))return"An id already exists with this name. To shadow a built-in, use Edit on the built-in row."}return""}_onSave(){let e=this._validate();if(e){this._error=e,this.performUpdate();return}let t=this.existingId??this._id,i={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:t,definition:i},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){return d`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${this.existingId?`Edit ${this.existingId}`:"Add custom period"}</h3>
        ${this.existingId?"":d`
          <div class="field">
            <label for="id">Id</label>
            <input id="id" type="text" .value=${this._id} @input=${this._onIdInput} placeholder="e.g. wind_down" />
          </div>`}
        <div class="field">
          <label for="label">Label (display name)</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput} placeholder="e.g. Wind down" />
        </div>
        <div class="row">
          <label style="min-width: 3em;">From</label>
          <ambience-time-endpoint .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
        </div>
        <div class="row">
          <label style="min-width: 3em;">To</label>
          <ambience-time-endpoint .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
        </div>
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>Cancel</button>
          <button @click=${this._onSave}>Save</button>
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
  `,a([h({attribute:!1})],w.prototype,"existingId",2),a([h({attribute:!1})],w.prototype,"initial",2),a([h({attribute:!1})],w.prototype,"takenIds",2),a([p()],w.prototype,"_id",2),a([p()],w.prototype,"_label",2),a([p()],w.prototype,"_def",2),a([p()],w.prototype,"_error",2),w=a([v("ambience-period-edit-modal")],w);function Xe(n){if(n.kind==="time")return`${String(n.hh).padStart(2,"0")}:${String(n.mm).padStart(2,"0")}`;if(n.offset_min===0)return n.anchor;let r=Math.abs(n.offset_min),e=r%60===0?`${r/60}h`:`${r}m`;return`${n.anchor}${n.offset_min<0?"-":"+"}${e}`}function _t(n){return`${Xe(n.from)} \u2192 ${Xe(n.to)}`}var H=class extends m{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await oe(this.hass)}_effective(){let e=new Set(this._view.hidden),t=[];for(let[i,s]of Object.entries(this._view.builtins)){if(e.has(i))continue;let o=this._view.custom[i];o?t.push({id:i,defn:o,provenance:"builtin-edited"}):t.push({id:i,defn:s,provenance:"builtin"})}for(let[i,s]of Object.entries(this._view.custom))i in this._view.builtins||t.push({id:i,defn:s,provenance:"custom"});return t}async _saveState(e,t){let i=await Ve(this.hass,e,t);this._warnings=i.warnings,await this._reload()}_onEdit(e,t){this._modal={mode:"edit",id:e,initial:t}}async _onDelete(e){if(e in this._view.builtins){let i={...this._view.custom};delete i[e],await this._saveState(i,[...this._view.hidden,e])}else{let i={...this._view.custom};delete i[e],await this._saveState(i,this._view.hidden)}}async _onRevertEdited(e){let t={...this._view.custom};delete t[e],await this._saveState(t,this._view.hidden)}async _onRevertHidden(e){await this._saveState(this._view.custom,this._view.hidden.filter(t=>t!==e))}async _onResetAll(){let e=Object.keys(this._view.custom).length,t=this._view.hidden.length,i=`This will clear ${e} custom period(s) and restore ${t} hidden built-in(s). Continue?`;confirm(i)&&(await Ke(this.hass),this._warnings=[],await this._reload())}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:t,definition:i}=e.detail,s={...this._view.custom,[t]:i},o=this._view.hidden.filter(l=>l!==t);this._modal={mode:"closed"},await this._saveState(s,o)}_onModalCancel(){this._modal={mode:"closed"}}_renderRow(e){let t=this._view.custom,i=e.provenance==="builtin-edited",s=e.provenance==="custom";return d`
      <div class="row">
        <span class="name">${j(this.hass,e.id,t)}</span>
        <span class="def">${_t(e.defn)}</span>
        <span class="badge">${e.provenance==="builtin"?"builtin":e.provenance==="builtin-edited"?"builtin, edited":"custom"}</span>
        <span class="actions">
          <button class="icon" title="Edit" @click=${()=>this._onEdit(e.id,e.defn)}>✎</button>
          ${i?d`<button class="icon" title="Revert to default" @click=${()=>this._onRevertEdited(e.id)}>↺</button>`:""}
          ${s||e.provenance==="builtin"||i?d`<button class="icon" title="Delete" @click=${()=>this._onDelete(e.id)}>✕</button>`:""}
        </span>
      </div>
    `}_renderHiddenRow(e){return d`
      <div class="row">
        <span class="name">${j(this.hass,e,{})}</span>
        <span class="def">(hidden)</span>
        <span class="badge">hidden</span>
        <span class="actions">
          <button class="icon" title="Restore" @click=${()=>this._onRevertHidden(e)}>↺</button>
        </span>
      </div>
    `}render(){let e=this._effective();return d`
      <header>
        <h2>Periods</h2>
        <button @click=${this._onResetAll}>Reset all to defaults</button>
      </header>
      ${this._warnings.length?d`<div class="warnings">
            <strong>Warning:</strong> some rules now reference missing periods:
            <ul>
              ${this._warnings.map(t=>d`<li>${t.area_id} / "${t.rule_name}" → ${t.missing_period}</li>`)}
            </ul>
          </div>`:""}
      ${e.map(t=>this._renderRow(t))}
      ${this._view.hidden.map(t=>this._renderHiddenRow(t))}
      <button class="add" @click=${this._onAdd}>+ Add custom period</button>
      ${this._modal.mode==="edit"?d`<ambience-period-edit-modal
            .existingId=${this._modal.id}
            .initial=${this._modal.initial}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:this._modal.mode==="add"?d`<ambience-period-edit-modal
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:""}
    `}};H.styles=g`
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
  `,a([h({attribute:!1})],H.prototype,"hass",2),a([p()],H.prototype,"_view",2),a([p()],H.prototype,"_modal",2),a([p()],H.prototype,"_warnings",2),H=a([v("ambience-periods-view")],H);var I=class extends m{constructor(){super(...arguments);this._view="areas"}connectedCallback(){super.connectedCallback(),ye()}render(){return d`
      <header>
        <h1>Ambience</h1>
        <nav>
          <button
            class=${this._view==="areas"?"active":""}
            @click=${()=>{this._view="areas"}}
          >Areas</button>
          <button
            class=${this._view==="periods"?"active":""}
            @click=${()=>{this._view="periods"}}
          >Periods</button>
        </nav>
      </header>
      ${this._view==="areas"?d`<ambience-areas-list .hass=${this.hass}></ambience-areas-list>`:d`<ambience-periods-view .hass=${this.hass}></ambience-periods-view>`}
    `}};I.styles=g`
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
  `,a([h({attribute:!1})],I.prototype,"hass",2),a([p()],I.prototype,"_view",2),I=a([v("ambience-panel")],I);export{I as AmbiencePanel};
