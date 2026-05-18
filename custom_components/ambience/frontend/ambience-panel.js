/* Ambience panel — bundled output. Do not edit by hand. */
var Ie=Object.defineProperty;var ze=Object.getOwnPropertyDescriptor;var l=(n,r,e,t)=>{for(var s=t>1?void 0:t?ze(r,e):r,i=n.length-1,o;i>=0;i--)(o=n[i])&&(s=(t?o(r,e,s):o(s))||s);return t&&s&&Ie(r,e,s),s};var K=globalThis,V=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ee=Symbol(),pe=new WeakMap,D=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==ee)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(V&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=pe.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&pe.set(e,r))}return r}toString(){return this.cssText}},me=n=>new D(typeof n=="string"?n:n+"",void 0,ee),v=(n,...r)=>{let e=n.length===1?n[0]:r.reduce((t,s,i)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[i+1],n[0]);return new D(e,n,ee)},fe=(n,r)=>{if(V)n.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),s=K.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,n.appendChild(t)}},te=V?n=>n:n=>n instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return me(e)})(n):n;var{is:Le,defineProperty:qe,getOwnPropertyDescriptor:Fe,getOwnPropertyNames:Be,getOwnPropertySymbols:We,getPrototypeOf:Ke}=Object,J=globalThis,ge=J.trustedTypes,Ve=ge?ge.emptyScript:"",Je=J.reactiveElementPolyfillSupport,j=(n,r)=>n,I={toAttribute(n,r){switch(r){case Boolean:n=n?Ve:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,r){let e=n;switch(r){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},X=(n,r)=>!Le(n,r),_e={attribute:!0,type:String,converter:I,reflect:!1,useDefault:!1,hasChanged:X};Symbol.metadata??=Symbol("metadata"),J.litPropertyMetadata??=new WeakMap;var E=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=_e){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(r,t,e);s!==void 0&&qe(this.prototype,r,s)}}static getPropertyDescriptor(r,e,t){let{get:s,set:i}=Fe(this.prototype,r)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let a=s?.call(this);i?.call(this,o),this.requestUpdate(r,a,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??_e}static _$Ei(){if(this.hasOwnProperty(j("elementProperties")))return;let r=Ke(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(j("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(j("properties"))){let e=this.properties,t=[...Be(e),...We(e)];for(let s of t)this.createProperty(s,e[s])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let s of t)e.unshift(te(s))}else r!==void 0&&e.push(te(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fe(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),s=this.constructor._$Eu(r,t);if(s!==void 0&&t.reflect===!0){let i=(t.converter?.toAttribute!==void 0?t.converter:I).toAttribute(e,t.type);this._$Em=r,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(r,e){let t=this.constructor,s=t._$Eh.get(r);if(s!==void 0&&this._$Em!==s){let i=t.getPropertyOptions(s),o=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:I;this._$Em=s;let a=o.fromAttribute(e,i.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(r,e,t,s=!1,i){if(r!==void 0){let o=this.constructor;if(s===!1&&(i=this[r]),t??=o.getPropertyOptions(r),!((t.hasChanged??X)(i,e)||t.useDefault&&t.reflect&&i===this._$Ej?.get(r)&&!this.hasAttribute(o._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:s,wrapped:i},o){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,o??e??this[r]),i!==!0||o!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),s===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,i]of t){let{wrapped:o}=i,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,i,a)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[j("elementProperties")]=new Map,E[j("finalized")]=new Map,Je?.({ReactiveElement:E}),(J.reactiveElementVersions??=[]).push("2.1.2");var le=globalThis,ve=n=>n,Z=le.trustedTypes,ye=Z?Z.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ae="$lit$",H=`lit$${Math.random().toFixed(9).slice(2)}$`,Ce="?"+H,Xe=`<${Ce}>`,R=document,L=()=>R.createComment(""),q=n=>n===null||typeof n!="object"&&typeof n!="function",ce=Array.isArray,Ze=n=>ce(n)||typeof n?.[Symbol.iterator]=="function",re=`[ 	
\f\r]`,z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,be=/-->/g,$e=/>/g,P=RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),xe=/'/g,we=/"/g,Se=/^(?:script|style|textarea|title)$/i,de=n=>(r,...e)=>({_$litType$:n,strings:r,values:e}),d=de(1),dt=de(2),ht=de(3),M=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ee=new WeakMap,T=R.createTreeWalker(R,129);function ke(n,r){if(!ce(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return ye!==void 0?ye.createHTML(r):r}var Ge=(n,r)=>{let e=n.length-1,t=[],s,i=r===2?"<svg>":r===3?"<math>":"",o=z;for(let a=0;a<e;a++){let c=n[a],h,g,p=-1,w=0;for(;w<c.length&&(o.lastIndex=w,g=o.exec(c),g!==null);)w=o.lastIndex,o===z?g[1]==="!--"?o=be:g[1]!==void 0?o=$e:g[2]!==void 0?(Se.test(g[2])&&(s=RegExp("</"+g[2],"g")),o=P):g[3]!==void 0&&(o=P):o===P?g[0]===">"?(o=s??z,p=-1):g[1]===void 0?p=-2:(p=o.lastIndex-g[2].length,h=g[1],o=g[3]===void 0?P:g[3]==='"'?we:xe):o===we||o===xe?o=P:o===be||o===$e?o=z:(o=P,s=void 0);let k=o===P&&n[a+1].startsWith("/>")?" ":"";i+=o===z?c+Xe:p>=0?(t.push(h),c.slice(0,p)+Ae+c.slice(p)+H+k):c+H+(p===-2?a:k)}return[ke(n,i+(n[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},F=class n{constructor({strings:r,_$litType$:e},t){let s;this.parts=[];let i=0,o=0,a=r.length-1,c=this.parts,[h,g]=Ge(r,e);if(this.el=n.createElement(h,t),T.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=T.nextNode())!==null&&c.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let p of s.getAttributeNames())if(p.endsWith(Ae)){let w=g[o++],k=s.getAttribute(p).split(H),W=/([.?@])?(.*)/.exec(w);c.push({type:1,index:i,name:W[2],strings:k,ctor:W[1]==="."?ie:W[1]==="?"?ne:W[1]==="@"?oe:O}),s.removeAttribute(p)}else p.startsWith(H)&&(c.push({type:6,index:i}),s.removeAttribute(p));if(Se.test(s.tagName)){let p=s.textContent.split(H),w=p.length-1;if(w>0){s.textContent=Z?Z.emptyScript:"";for(let k=0;k<w;k++)s.append(p[k],L()),T.nextNode(),c.push({type:2,index:++i});s.append(p[w],L())}}}else if(s.nodeType===8)if(s.data===Ce)c.push({type:2,index:i});else{let p=-1;for(;(p=s.data.indexOf(H,p+1))!==-1;)c.push({type:7,index:i}),p+=H.length-1}i++}}static createElement(r,e){let t=R.createElement("template");return t.innerHTML=r,t}};function N(n,r,e=n,t){if(r===M)return r;let s=t!==void 0?e._$Co?.[t]:e._$Cl,i=q(r)?void 0:r._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(n),s._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(r=N(n,s._$AS(n,r.values),s,t)),r}var se=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,s=(r?.creationScope??R).importNode(e,!0);T.currentNode=s;let i=T.nextNode(),o=0,a=0,c=t[0];for(;c!==void 0;){if(o===c.index){let h;c.type===2?h=new B(i,i.nextSibling,this,r):c.type===1?h=new c.ctor(i,c.name,c.strings,this,r):c.type===6&&(h=new ae(i,this,r)),this._$AV.push(h),c=t[++a]}o!==c?.index&&(i=T.nextNode(),o++)}return T.currentNode=R,s}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},B=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=N(this,r,e),q(r)?r===_||r==null||r===""?(this._$AH!==_&&this._$AR(),this._$AH=_):r!==this._$AH&&r!==M&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Ze(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==_&&q(this._$AH)?this._$AA.nextSibling.data=r:this.T(R.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,s=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=F.createElement(ke(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let i=new se(s,this),o=i.u(this.options);i.p(e),this.T(o),this._$AH=i}}_$AC(r){let e=Ee.get(r.strings);return e===void 0&&Ee.set(r.strings,e=new F(r)),e}k(r){ce(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let i of r)s===e.length?e.push(t=new n(this.O(L()),this.O(L()),this,this.options)):t=e[s],t._$AI(i),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=ve(r).nextSibling;ve(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,s,i){this.type=1,this._$AH=_,this._$AN=void 0,this.element=r,this.name=e,this._$AM=s,this.options=i,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=_}_$AI(r,e=this,t,s){let i=this.strings,o=!1;if(i===void 0)r=N(this,r,e,0),o=!q(r)||r!==this._$AH&&r!==M,o&&(this._$AH=r);else{let a=r,c,h;for(r=i[0],c=0;c<i.length-1;c++)h=N(this,a[t+c],e,c),h===M&&(h=this._$AH[c]),o||=!q(h)||h!==this._$AH[c],h===_?r=_:r!==_&&(r+=(h??"")+i[c+1]),this._$AH[c]=h}o&&!s&&this.j(r)}j(r){r===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},ie=class extends O{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===_?void 0:r}},ne=class extends O{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==_)}},oe=class extends O{constructor(r,e,t,s,i){super(r,e,t,s,i),this.type=5}_$AI(r,e=this){if((r=N(this,r,e,0)??_)===M)return;let t=this._$AH,s=r===_&&t!==_||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,i=r!==_&&(t===_||s);s&&this.element.removeEventListener(this.name,this,t),i&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},ae=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){N(this,r)}};var Qe=le.litHtmlPolyfillSupport;Qe?.(F,B),(le.litHtmlVersions??=[]).push("3.3.2");var He=(n,r,e)=>{let t=e?.renderBefore??r,s=t._$litPart$;if(s===void 0){let i=e?.renderBefore??null;t._$litPart$=s=new B(r.insertBefore(L(),i),i,void 0,e??{})}return s._$AI(n),s};var he=globalThis,m=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=He(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};m._$litElement$=!0,m.finalized=!0,he.litElementHydrateSupport?.({LitElement:m});var Ye=he.litElementPolyfillSupport;Ye?.({LitElement:m});(he.litElementVersions??=[]).push("4.2.2");var y=n=>(r,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(n,r)}):customElements.define(n,r)};var et={attribute:!0,type:String,converter:I,reflect:!1,hasChanged:X},tt=(n=et,r,e)=>{let{kind:t,metadata:s}=e,i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),t==="setter"&&((n=Object.create(n)).wrapped=!0),i.set(e.name,n),t==="accessor"){let{name:o}=e;return{set(a){let c=r.get.call(this);r.set.call(this,a),this.requestUpdate(o,c,n,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,n,a),a}}}if(t==="setter"){let{name:o}=e;return function(a){let c=this[o];r.call(this,a),this.requestUpdate(o,c,n,!0,a)}}throw Error("Unsupported decorator location: "+t)};function u(n){return(r,e)=>typeof e=="object"?tt(n,r,e):((t,s,i)=>{let o=s.hasOwnProperty(i);return s.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(s,i):void 0})(n,r,e)}function f(n){return u({...n,state:!0,attribute:!1})}var Re=["ha-combo-box","ha-input","ha-textfield"],rt=["ha-input","ha-textfield"];function Me(){for(let n of rt)if(customElements.get(n))return n;return null}var Q=null,Pe=!1,st=["ha-combo-box","ha-textfield","ha-input","ha-form","ha-select","ha-listbox","ha-entity-picker","ha-selector","ha-selector-text","ha-selector-select","ha-md-textfield","ha-md-select","ha-md-outlined-text-field","ha-md-outlined-select","ha-md-autocomplete","ha-md-list","ha-md-list-item","ha-md-menu","ha-md-menu-item","ha-dialog","ha-card"];function ue(n){return Q||(Q=(async()=>{if(Re.every(t=>customElements.get(t)))return;try{let t=await import("custom-card-helpers");if(typeof t.loadCardHelpers=="function"){let s=await t.loadCardHelpers();if(await Te(s,"custom-card-helpers"))return}}catch(t){console.warn("ambience: dynamic import of 'custom-card-helpers' failed; falling back to legacy loader probes",t)}let r=it(n),e=n&&typeof n=="object"?Object.keys(n).filter(t=>/load|helper|card|form|element|register/i.test(t)):[];console.log("ambience: probing for HA component loaders \u2192",Object.fromEntries(r.map(t=>[t.name,t.fn?"found":"\u2014"])),"components registered (broad probe):",Object.fromEntries(st.map(t=>[t,!!customElements.get(t)])),"hass-object keys matching /load|helper|card|form|element|register/i:",e);for(let{name:t,fn:s}of r){if(typeof s!="function")continue;let i;try{i=await s()}catch(o){console.warn(`ambience: ${t}() threw`,o);continue}if(!i?.createCardElement){console.warn(`ambience: ${t}() returned no createCardElement`);continue}if(await Te(i,t))return}console.warn("ambience: every load strategy was tried; HA form components are still not in the custom-element registry. Panel will use self-contained fallback widgets. Please report this with the probe output above and your HA version.")})(),Q)}async function Te(n,r){let e=["entities","tile","thermostat","weather-forecast","markdown"];for(let t of e){try{await(await n.createCardElement({type:t,entities:[]})).constructor?.getConfigElement?.()}catch(s){console.debug(`ambience: ${r} + ${t} card editor failed`,s)}if(customElements.get("ha-combo-box"))return console.log(`ambience: HA components loaded via ${r} + ${t} card editor`),!0}return!1}function it(n){let r=window,e=document.querySelector("home-assistant"),t=e?.shadowRoot?.querySelector("home-assistant-main"),s=n;return[{name:"window.loadCardHelpers",fn:r.loadCardHelpers?.bind(r)},{name:"hass.loadCardHelpers",fn:s?.loadCardHelpers?.bind(s)},{name:"<home-assistant>.loadCardHelpers",fn:e?.loadCardHelpers?.bind(e)},{name:"<home-assistant-main>.loadCardHelpers",fn:t?.loadCardHelpers?.bind(t)}]}function Y(n,r){for(let e of Re)customElements.get(e)||customElements.whenDefined(e).then(()=>n.requestUpdate());Pe||(Pe=!0,ue(r))}async function Ne(n){return n.callWS({type:"ambience/areas/list"})}async function Oe(n,r){return n.callWS({type:"ambience/area/get",area_id:r})}async function Ue(n,r,e){return n.callWS({type:"ambience/area/save",area_id:r,config:e})}async function De(n){return n.callWS({type:"ambience/matchers/list"})}async function je(n){return n.callWS({type:"ambience/actions/list"})}var A=class extends m{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_summary(e){let t=Object.keys(e.when).filter(o=>e.when[o]!=null),s=t.length===0?"any":t.map(o=>`${o}=${String(e.when[o])}`).join(", "),i=e.actions.length;return`${s} \xB7 ${i} action${i===1?"":"s"}`}_onDragStart(e){this._dragFrom=e}_onDragOver(e,t){this._dragFrom===null||t===this._dragFrom||(e.preventDefault(),this._dragOver=t)}_onDrop(e){let t=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(t===null||t===e)&&this._emit("reorder-rules",{from:t,to:e})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(e,t){let s=t.name||`Rule ${e+1}`;window.confirm(`Delete "${s}"?`)&&this._emit("delete-rule",{index:e})}render(){return this.rules.length===0?d`
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
              @dragover=${s=>this._onDragOver(s,t)}
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
  `,l([u({attribute:!1})],A.prototype,"rules",2),l([u({type:Boolean})],A.prototype,"autoSort",2),l([f()],A.prototype,"_dragFrom",2),l([f()],A.prototype,"_dragOver",2),A=l([y("ambience-rules-list")],A);var x=class extends m{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=e=>{this._open&&(e.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=e=>{e.stopPropagation();let t=e.detail.value?.scene??"";this._emit(t.trim()===""?null:t)}}connectedCallback(){super.connectedCallback(),Y(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(e){e.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(t=>({value:t,label:t})),custom_value:!0,mode:"dropdown"}}}])}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target.value;this._emit(t.trim()===""?null:t),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(e){e.key==="Escape"&&this._open&&(this._open=!1,e.stopPropagation())}_toggle(e){e.preventDefault(),this._open=!this._open}_select(e,t){t.preventDefault(),this._emit(e),this._open=!1}render(){if(customElements.get("ha-form")){let e={scene:this.value??""};return d`
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
    `}};x.styles=v`
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
  `,l([u({attribute:!1})],x.prototype,"hass",2),l([u()],x.prototype,"value",2),l([u({attribute:!1})],x.prototype,"suggestions",2),l([f()],x.prototype,"_schema",2),l([f()],x.prototype,"_open",2),x=l([y("ambience-scene-combobox")],x);var C=class extends m{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onText(e){let t=e.target.value;this._emit(t.trim()===""?null:t)}render(){return this.matcher.input==="scene_combobox"?d`
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
    `}};C.styles=v`
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
  `,l([u({attribute:!1})],C.prototype,"matcher",2),l([u({attribute:!1})],C.prototype,"value",2),l([u({attribute:!1})],C.prototype,"sceneSuggestions",2),l([u({attribute:!1})],C.prototype,"hass",2),C=l([y("ambience-matcher-input")],C);var $=class extends m{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._onNameInput=e=>{this._setName(e.target.value)}}connectedCallback(){super.connectedCallback(),Y(this)}willUpdate(e){e.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_renderNameField(){let e=this._draft.name??"",t=Me();return t==="ha-input"?d`
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
    `}_setPredicate(e,t){if(!this._draft)return;let s={...this._draft.when};t==null?delete s[e]:s[e]=t,this._draft={...this._draft,when:s}}_addActionSlot(){if(!this._draft)return;let e={action:"set_light",targets:{}};this._draft={...this._draft,actions:[...this._draft.actions,e]}}_updateActionAt(e,t){if(!this._draft)return;let s=this._draft.actions.map((i,o)=>o===e?t(i):i);this._draft={...this._draft,actions:s}}_changeActionType(e,t){this._updateActionAt(e,()=>({action:t,targets:{}}))}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((t,s)=>s!==e)})}_addTarget(e){this._updateActionAt(e,t=>{let s=this.availableActions.find(o=>o.name===t.action),i={};return s?.target_params.forEach(o=>{"default"in o&&(i[o.name]=o.default)}),{...t,targets:{...t.targets,"":i}}})}_updateTargetId(e,t,s){this._updateActionAt(e,i=>{if(t===s)return i;let o={...i.targets};return o[s]=o[t],delete o[t],{...i,targets:o}})}_updateTargetParam(e,t,s,i){this._updateActionAt(e,o=>{let a={...o.targets},c={...a[t]??{}},h=i;return s.type==="int"?h=i===""?void 0:parseInt(i,10):s.type==="number"?h=i===""?void 0:parseFloat(i):s.type==="boolean"&&(h=i==="true"),h===void 0?delete c[s.name]:c[s.name]=h,a[t]=c,{...o,targets:a}})}_deleteTarget(e,t){this._updateActionAt(e,s=>{let i={...s.targets};return delete i[t],{...s,targets:i}})}_renderTargets(e,t){let s=this.availableActions.find(a=>a.name===t.action),i=s?.target_params??[],o=Object.entries(t.targets);return o.length===0?d`<p
        style="color: var(--secondary-text-color, #888); margin: 0.5rem 0;"
      >
        No targets yet.
      </p>`:d`
      ${o.map(([a,c])=>d`
          <div
            style="display: grid; grid-template-columns: 1fr ${"1fr ".repeat(i.length)}auto; gap: 0.5rem; margin: 0.5rem 0; align-items: end;"
          >
            <div>
              <label>entity_id</label>
              <input
                type="text"
                .value=${a}
                placeholder="${s?.domains?.[0]??"domain"}.example"
                @change=${h=>this._updateTargetId(e,a,h.target.value)}
              />
            </div>
            ${i.map(h=>d`
                <div>
                  <label>${h.name}${h.required?" *":""}</label>
                  <input
                    type=${h.type==="int"||h.type==="number"?"number":"text"}
                    .value=${String(c[h.name]??"")}
                    min=${h.min??""}
                    max=${h.max??""}
                    @input=${g=>this._updateTargetParam(e,a,h,g.target.value)}
                  />
                </div>
              `)}
            <button
              class="secondary"
              @click=${()=>this._deleteTarget(e,a)}
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
                  @change=${s=>this._changeActionType(t,s.target.value)}
                >
                  ${this.availableActions.map(s=>d`
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
    `:d``}};$.styles=v`
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
  `,l([u({type:Boolean,reflect:!0})],$.prototype,"open",2),l([u({attribute:!1})],$.prototype,"rule",2),l([u({attribute:!1})],$.prototype,"matchers",2),l([u({attribute:!1})],$.prototype,"sceneSuggestions",2),l([u({attribute:!1})],$.prototype,"availableActions",2),l([u({attribute:!1})],$.prototype,"hass",2),l([f()],$.prototype,"_draft",2),$=l([y("ambience-rule-editor")],$);var S=class extends m{constructor(){super(...arguments);this.open=!1;this.matchers=[];this.selected=[];this._draft=new Set}willUpdate(e){(e.has("selected")||e.has("open"))&&this.open&&(this._draft=new Set(this.selected))}_toggle(e,t){let s=new Set(this._draft);t?s.add(e):s.delete(e),this._draft=s}_apply(){this.dispatchEvent(new CustomEvent("apply-matchers",{detail:{matchers:[...this._draft]},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-matchers",{bubbles:!0,composed:!0}))}render(){let e=this.matchers.filter(t=>t.toggleable);return d`
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
                @change=${s=>this._toggle(t.name,s.target.checked)}
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
  `,l([u({type:Boolean,reflect:!0})],S.prototype,"open",2),l([u({attribute:!1})],S.prototype,"matchers",2),l([u({attribute:!1})],S.prototype,"selected",2),l([f()],S.prototype,"_draft",2),S=l([y("ambience-matchers-modal")],S);var b=class extends m{constructor(){super(...arguments);this._areas=[];this._matchers=[];this._actions=[];this._configs=new Map;this._expanded=new Set;this._error="";this._editing=null;this._matchersModalArea=null}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await this._refreshAreas(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _loadStatic(){try{let[e,t]=await Promise.all([De(this.hass),je(this.hass)]);if(!this.isConnected)return;this._matchers=e,this._actions=t}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await Ne(this.hass),t=new Map;if(await Promise.all(e.map(async s=>{t.set(s.area_id,this._normalize(await Oe(this.hass,s.area_id)))})),!this.isConnected)return;this._areas=e,this._configs=t}catch(e){this._error=e.message||String(e)}}_normalize(e){return{matchers:e.matchers??[],rules:e.rules??[],auto_sort:e.auto_sort??!0}}async _subscribe(){let e=await this.hass.connection.subscribeEvents(t=>{if(t.data.action==="remove"){let s=t.data.area_id,i=new Set(this._expanded);i.delete(s),this._expanded=i,this._editing?.areaId===s&&(this._editing=null),this._matchersModalArea===s&&(this._matchersModalArea=null)}this._refreshAreas()},"area_registry_updated");this.isConnected?this._unsub=e:e()}_setConfig(e,t){let s=new Map(this._configs);s.set(e,t),this._configs=s}async _mutate(e,t){let s=this._configs.get(e);this._setConfig(e,t),this._error="";try{let{config:i}=await Ue(this.hass,e,t);this._setConfig(e,this._normalize(i))}catch(i){s&&this._setConfig(e,s),this._error=i.message||String(i)}}_toggleExpand(e){let t=new Set(this._expanded);t.has(e)?t.delete(e):t.add(e),this._expanded=t}_openMatchersModal(e){this._matchersModalArea=e}_applyMatchers(e){let t=this._matchersModalArea;if(this._matchersModalArea=null,!t)return;let s=this._configs.get(t);s&&this._mutate(t,{...s,matchers:e.detail.matchers})}_toggleAutoSort(e,t){let s=this._configs.get(e);s&&this._mutate(e,{...s,auto_sort:t})}_addRule(e){let t=this._configs.get(e);t&&(this._editing={areaId:e,index:t.rules.length,isNew:!0})}_editRule(e,t){this._editing={areaId:e,index:t.detail.index,isNew:!1}}_duplicateRule(e,t){let s=this._configs.get(e);if(!s)return;let i=s.rules[t.detail.index];if(!i)return;let o=JSON.parse(JSON.stringify(i)),a=[...s.rules];a.splice(t.detail.index+1,0,o),this._mutate(e,{...s,rules:a})}_deleteRule(e,t){let s=this._configs.get(e);if(!s)return;let i=s.rules.filter((o,a)=>a!==t.detail.index);this._mutate(e,{...s,rules:i})}_reorderRules(e,t){let s=this._configs.get(e);if(!s)return;let{from:i,to:o}=t.detail,a=[...s.rules],[c]=a.splice(i,1);a.splice(o,0,c),this._mutate(e,{...s,rules:a})}_saveRule(e){let t=this._editing;if(this._editing=null,!t)return;let s=this._configs.get(t.areaId);if(!s)return;let i=[...s.rules];t.isNew?i.push(e.detail):i[t.index]=e.detail,this._mutate(t.areaId,{...s,rules:i})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._configs.get(this._editing.areaId)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let e=this._configs.get(this._editing.areaId);if(!e)return[];let t=new Set;for(let s of e.rules){let i=s.when.scene;typeof i=="string"&&i&&t.add(i)}return[...t].sort((s,i)=>s.toLowerCase().localeCompare(i.toLowerCase()))}get _editorMatchers(){if(!this._editing)return[];let e=this._configs.get(this._editing.areaId);if(!e)return[];let t=this._matchers.find(i=>i.name==="scene"),s=this._matchers.filter(i=>e.matchers.includes(i.name));return t?[t,...s]:s}_summary(e){if(e.rules.length===0&&e.matchers.length===0)return"not configured";let t=e.rules.length,s=e.matchers.length;return`${t} rule${t===1?"":"s"} \xB7 ${s} matcher${s===1?"":"s"}`}render(){return d`
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
    `}_renderArea(e){let t=this._configs.get(e.area_id);if(!t)return d``;let s=this._expanded.has(e.area_id);return d`
      <li>
        <div
          class="area-header"
          @click=${()=>this._toggleExpand(e.area_id)}
        >
          <span class="chevron ${s?"open":""}">▶</span>
          <span class="area-name">${e.name}</span>
          <span class="area-summary">${this._summary(t)}</span>
          <button
            class="cog"
            title="Matchers"
            @click=${i=>{i.stopPropagation(),this._openMatchersModal(e.area_id)}}
          >
            ⚙
          </button>
        </div>
        ${s?d`
              <div class="area-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!t.auto_sort}
                    @change=${i=>this._toggleAutoSort(e.area_id,!i.target.checked)}
                  />
                  Order rules manually
                </label>
                <ambience-rules-list
                  .rules=${t.rules}
                  .autoSort=${t.auto_sort}
                  @add-rule=${()=>this._addRule(e.area_id)}
                  @edit-rule=${i=>this._editRule(e.area_id,i)}
                  @duplicate-rule=${i=>this._duplicateRule(e.area_id,i)}
                  @delete-rule=${i=>this._deleteRule(e.area_id,i)}
                  @reorder-rules=${i=>this._reorderRules(e.area_id,i)}
                ></ambience-rules-list>
              </div>
            `:""}
      </li>
    `}};b.styles=v`
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
  `,l([u({attribute:!1})],b.prototype,"hass",2),l([f()],b.prototype,"_areas",2),l([f()],b.prototype,"_matchers",2),l([f()],b.prototype,"_actions",2),l([f()],b.prototype,"_configs",2),l([f()],b.prototype,"_expanded",2),l([f()],b.prototype,"_error",2),l([f()],b.prototype,"_editing",2),l([f()],b.prototype,"_matchersModalArea",2),b=l([y("ambience-areas-list")],b);var U=class extends m{connectedCallback(){super.connectedCallback(),ue()}render(){return d`
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
  `,l([u({attribute:!1})],U.prototype,"hass",2),U=l([y("ambience-panel")],U);export{U as AmbiencePanel};
