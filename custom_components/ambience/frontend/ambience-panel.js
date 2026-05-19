/* Ambience panel — bundled output. Do not edit by hand. */
var it=Object.defineProperty;var rt=Object.getOwnPropertyDescriptor;var a=(n,i,e,t)=>{for(var r=t>1?void 0:t?rt(i,e):i,s=n.length-1,o;s>=0;s--)(o=n[s])&&(r=(t?o(i,e,r):o(r))||r);return t&&r&&it(i,e,r),r};var ee=globalThis,te=ee.ShadowRoot&&(ee.ShadyCSS===void 0||ee.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),Ee=new WeakMap,W=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(te&&i===void 0){let t=e!==void 0&&e.length===1;t&&(i=Ee.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&Ee.set(e,i))}return i}toString(){return this.cssText}},Ce=n=>new W(typeof n=="string"?n:n+"",void 0,pe),m=(n,...i)=>{let e=n.length===1?n[0]:i.reduce((t,r,s)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+n[s+1],n[0]);return new W(e,n,pe)},Se=(n,i)=>{if(te)n.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let t=document.createElement("style"),r=ee.litNonce;r!==void 0&&t.setAttribute("nonce",r),t.textContent=e.cssText,n.appendChild(t)}},ue=te?n=>n:n=>n instanceof CSSStyleSheet?(i=>{let e="";for(let t of i.cssRules)e+=t.cssText;return Ce(e)})(n):n;var{is:st,defineProperty:nt,getOwnPropertyDescriptor:ot,getOwnPropertyNames:at,getOwnPropertySymbols:lt,getPrototypeOf:dt}=Object,ie=globalThis,Ae=ie.trustedTypes,ct=Ae?Ae.emptyScript:"",ht=ie.reactiveElementPolyfillSupport,B=(n,i)=>n,V={toAttribute(n,i){switch(i){case Boolean:n=n?ct:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,i){let e=n;switch(i){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},re=(n,i)=>!st(n,i),Pe={attribute:!0,type:String,converter:V,reflect:!1,useDefault:!1,hasChanged:re};Symbol.metadata??=Symbol("metadata"),ie.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=Pe){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let t=Symbol(),r=this.getPropertyDescriptor(i,t,e);r!==void 0&&nt(this.prototype,i,r)}}static getPropertyDescriptor(i,e,t){let{get:r,set:s}=ot(this.prototype,i)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){let d=r?.call(this);s?.call(this,o),this.requestUpdate(i,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??Pe}static _$Ei(){if(this.hasOwnProperty(B("elementProperties")))return;let i=dt(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(B("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(B("properties"))){let e=this.properties,t=[...at(e),...lt(e)];for(let r of t)this.createProperty(r,e[r])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let r=this._$Eu(e,t);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let t=new Set(i.flat(1/0).reverse());for(let r of t)e.unshift(ue(r))}else i!==void 0&&e.push(ue(i));return e}static _$Eu(i,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Se(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){let t=this.constructor.elementProperties.get(i),r=this.constructor._$Eu(i,t);if(r!==void 0&&t.reflect===!0){let s=(t.converter?.toAttribute!==void 0?t.converter:V).toAttribute(e,t.type);this._$Em=i,s==null?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(i,e){let t=this.constructor,r=t._$Eh.get(i);if(r!==void 0&&this._$Em!==r){let s=t.getPropertyOptions(r),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:V;this._$Em=r;let d=o.fromAttribute(e,s.type);this[r]=d??this._$Ej?.get(r)??d,this._$Em=null}}requestUpdate(i,e,t,r=!1,s){if(i!==void 0){let o=this.constructor;if(r===!1&&(s=this[i]),t??=o.getPropertyOptions(i),!((t.hasChanged??re)(s,e)||t.useDefault&&t.reflect&&s===this._$Ej?.get(i)&&!this.hasAttribute(o._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:r,wrapped:s},o){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,o??e??this[i]),s!==!0||o!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),r===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,s]of this._$Ep)this[r]=s;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[r,s]of t){let{wrapped:o}=s,d=this[r];o!==!0||this._$AL.has(r)||d===void 0||this.C(r,void 0,s,d)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[B("elementProperties")]=new Map,A[B("finalized")]=new Map,ht?.({ReactiveElement:A}),(ie.reactiveElementVersions??=[]).push("2.1.2");var ye=globalThis,He=n=>n,se=ye.trustedTypes,Te=se?se.createPolicy("lit-html",{createHTML:n=>n}):void 0,De="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,Le="?"+R,pt=`<${Le}>`,D=document,J=()=>D.createComment(""),X=n=>n===null||typeof n!="object"&&typeof n!="function",$e=Array.isArray,ut=n=>$e(n)||typeof n?.[Symbol.iterator]=="function",me=`[ 	
\f\r]`,K=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Re=/-->/g,Ie=/>/g,O=RegExp(`>|${me}(?:([^\\s"'>=/]+)(${me}*=${me}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Me=/'/g,Oe=/"/g,je=/^(?:script|style|textarea|title)$/i,xe=n=>(i,...e)=>({_$litType$:n,strings:i,values:e}),l=xe(1),Tt=xe(2),Rt=xe(3),L=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ne=new WeakMap,N=D.createTreeWalker(D,129);function Ue(n,i){if(!$e(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Te!==void 0?Te.createHTML(i):i}var mt=(n,i)=>{let e=n.length-1,t=[],r,s=i===2?"<svg>":i===3?"<math>":"",o=K;for(let d=0;d<e;d++){let c=n[d],v,b,f=-1,S=0;for(;S<c.length&&(o.lastIndex=S,b=o.exec(c),b!==null);)S=o.lastIndex,o===K?b[1]==="!--"?o=Re:b[1]!==void 0?o=Ie:b[2]!==void 0?(je.test(b[2])&&(r=RegExp("</"+b[2],"g")),o=O):b[3]!==void 0&&(o=O):o===O?b[0]===">"?(o=r??K,f=-1):b[1]===void 0?f=-2:(f=o.lastIndex-b[2].length,v=b[1],o=b[3]===void 0?O:b[3]==='"'?Oe:Me):o===Oe||o===Me?o=O:o===Re||o===Ie?o=K:(o=O,r=void 0);let T=o===O&&n[d+1].startsWith("/>")?" ":"";s+=o===K?c+pt:f>=0?(t.push(v),c.slice(0,f)+De+c.slice(f)+R+T):c+R+(f===-2?d:T)}return[Ue(n,s+(n[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),t]},G=class n{constructor({strings:i,_$litType$:e},t){let r;this.parts=[];let s=0,o=0,d=i.length-1,c=this.parts,[v,b]=mt(i,e);if(this.el=n.createElement(v,t),N.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(r=N.nextNode())!==null&&c.length<d;){if(r.nodeType===1){if(r.hasAttributes())for(let f of r.getAttributeNames())if(f.endsWith(De)){let S=b[o++],T=r.getAttribute(f).split(R),Q=/([.?@])?(.*)/.exec(S);c.push({type:1,index:s,name:Q[2],strings:T,ctor:Q[1]==="."?ge:Q[1]==="?"?ve:Q[1]==="@"?_e:q}),r.removeAttribute(f)}else f.startsWith(R)&&(c.push({type:6,index:s}),r.removeAttribute(f));if(je.test(r.tagName)){let f=r.textContent.split(R),S=f.length-1;if(S>0){r.textContent=se?se.emptyScript:"";for(let T=0;T<S;T++)r.append(f[T],J()),N.nextNode(),c.push({type:2,index:++s});r.append(f[S],J())}}}else if(r.nodeType===8)if(r.data===Le)c.push({type:2,index:s});else{let f=-1;for(;(f=r.data.indexOf(R,f+1))!==-1;)c.push({type:7,index:s}),f+=R.length-1}s++}}static createElement(i,e){let t=D.createElement("template");return t.innerHTML=i,t}};function F(n,i,e=n,t){if(i===L)return i;let r=t!==void 0?e._$Co?.[t]:e._$Cl,s=X(i)?void 0:i._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),s===void 0?r=void 0:(r=new s(n),r._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=r:e._$Cl=r),r!==void 0&&(i=F(n,r._$AS(n,i.values),r,t)),i}var fe=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:t}=this._$AD,r=(i?.creationScope??D).importNode(e,!0);N.currentNode=r;let s=N.nextNode(),o=0,d=0,c=t[0];for(;c!==void 0;){if(o===c.index){let v;c.type===2?v=new Y(s,s.nextSibling,this,i):c.type===1?v=new c.ctor(s,c.name,c.strings,this,i):c.type===6&&(v=new be(s,this,i)),this._$AV.push(v),c=t[++d]}o!==c?.index&&(s=N.nextNode(),o++)}return N.currentNode=D,r}p(i){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}},Y=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,t,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=t,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=F(this,i,e),X(i)?i===_||i==null||i===""?(this._$AH!==_&&this._$AR(),this._$AH=_):i!==this._$AH&&i!==L&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):ut(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==_&&X(this._$AH)?this._$AA.nextSibling.data=i:this.T(D.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:t}=i,r=typeof t=="number"?this._$AC(i):(t.el===void 0&&(t.el=G.createElement(Ue(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===r)this._$AH.p(e);else{let s=new fe(r,this),o=s.u(this.options);s.p(e),this.T(o),this._$AH=s}}_$AC(i){let e=Ne.get(i.strings);return e===void 0&&Ne.set(i.strings,e=new G(i)),e}k(i){$e(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,r=0;for(let s of i)r===e.length?e.push(t=new n(this.O(J()),this.O(J()),this,this.options)):t=e[r],t._$AI(s),r++;r<e.length&&(this._$AR(t&&t._$AB.nextSibling,r),e.length=r)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let t=He(i).nextSibling;He(i).remove(),i=t}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},q=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,t,r,s){this.type=1,this._$AH=_,this._$AN=void 0,this.element=i,this.name=e,this._$AM=r,this.options=s,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=_}_$AI(i,e=this,t,r){let s=this.strings,o=!1;if(s===void 0)i=F(this,i,e,0),o=!X(i)||i!==this._$AH&&i!==L,o&&(this._$AH=i);else{let d=i,c,v;for(i=s[0],c=0;c<s.length-1;c++)v=F(this,d[t+c],e,c),v===L&&(v=this._$AH[c]),o||=!X(v)||v!==this._$AH[c],v===_?i=_:i!==_&&(i+=(v??"")+s[c+1]),this._$AH[c]=v}o&&!r&&this.j(i)}j(i){i===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},ge=class extends q{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===_?void 0:i}},ve=class extends q{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==_)}},_e=class extends q{constructor(i,e,t,r,s){super(i,e,t,r,s),this.type=5}_$AI(i,e=this){if((i=F(this,i,e,0)??_)===L)return;let t=this._$AH,r=i===_&&t!==_||i.capture!==t.capture||i.once!==t.once||i.passive!==t.passive,s=i!==_&&(t===_||r);r&&this.element.removeEventListener(this.name,this,t),s&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},be=class{constructor(i,e,t){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(i){F(this,i)}};var ft=ye.litHtmlPolyfillSupport;ft?.(G,Y),(ye.litHtmlVersions??=[]).push("3.3.2");var ze=(n,i,e)=>{let t=e?.renderBefore??i,r=t._$litPart$;if(r===void 0){let s=e?.renderBefore??null;t._$litPart$=r=new Y(i.insertBefore(J(),s),s,void 0,e??{})}return r._$AI(n),r};var we=globalThis,u=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=ze(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};u._$litElement$=!0,u.finalized=!0,we.litElementHydrateSupport?.({LitElement:u});var gt=we.litElementPolyfillSupport;gt?.({LitElement:u});(we.litElementVersions??=[]).push("4.2.2");var g=n=>(i,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(n,i)}):customElements.define(n,i)};var vt={attribute:!0,type:String,converter:V,reflect:!1,hasChanged:re},_t=(n=vt,i,e)=>{let{kind:t,metadata:r}=e,s=globalThis.litPropertyMetadata.get(r);if(s===void 0&&globalThis.litPropertyMetadata.set(r,s=new Map),t==="setter"&&((n=Object.create(n)).wrapped=!0),s.set(e.name,n),t==="accessor"){let{name:o}=e;return{set(d){let c=i.get.call(this);i.set.call(this,d),this.requestUpdate(o,c,n,!0,d)},init(d){return d!==void 0&&this.C(o,void 0,n,d),d}}}if(t==="setter"){let{name:o}=e;return function(d){let c=this[o];i.call(this,d),this.requestUpdate(o,c,n,!0,d)}}throw Error("Unsupported decorator location: "+t)};function h(n){return(i,e)=>typeof e=="object"?_t(n,i,e):((t,r,s)=>{let o=r.hasOwnProperty(s);return r.constructor.createProperty(s,t),o?Object.getOwnPropertyDescriptor(r,s):void 0})(n,i,e)}function p(n){return h({...n,state:!0,attribute:!1})}var bt=["ha-input","ha-textfield","ha-form"],yt=["ha-input","ha-textfield"];function Fe(){for(let n of yt)if(customElements.get(n))return n;return null}function I(n,i){for(let e of bt)customElements.get(e)||customElements.whenDefined(e).then(()=>n.requestUpdate())}async function qe(n){return n.callWS({type:"ambience/areas/list"})}async function We(n,i){return n.callWS({type:"ambience/area/get",area_id:i})}async function Be(n,i,e){return n.callWS({type:"ambience/area/save",area_id:i,config:e})}async function Ve(n){return n.callWS({type:"ambience/matchers/list"})}async function Ke(n){return n.callWS({type:"ambience/actions/list"})}async function oe(n){return n.callWS({type:"ambience/time_of_day_periods/list"})}async function Je(n,i,e){return n.callWS({type:"ambience/time_of_day_periods/save",custom:i,hidden:e})}async function Xe(n){return n.callWS({type:"ambience/time_of_day_periods/reset"})}function ae(n,i,e){let t=n?.localize?.(i);return t&&t!==i?t:e}function ke(n){let i=n.replaceAll("_"," ").toLowerCase();return i.charAt(0).toUpperCase()+i.slice(1)}function le(n,i){return ae(n,`component.ambience.matcher.${i}`,ke(i))}function Ge(n,i){return ae(n,`component.ambience.action.${i}`,ke(i))}function de(n,i){return ae(n,`component.ambience.anchor.${i}`,ke(i))}function j(n,i,e){let t=e[i]?.label;if(t)return t;let r=i.charAt(0).toUpperCase()+i.slice(1);return ae(n,`component.ambience.time_of_day_period.${i}`,r)}function ce(n,i,e){return i==null?"(any)":n==="time_of_day"?he(i,e):String(i)}function he(n,i){if(n===null)return"any";let e=Array.isArray(n)?n:[n],t=i.periods?.custom??{};return e.map(r=>"period"in r?j(i.hass,r.period,t):`${Ye(r.from,i)}\u2192${Ye(r.to,i)}`).join(", ")}function Ye(n,i){if(n.kind==="time")return`${String(n.hh).padStart(2,"0")}:${String(n.mm).padStart(2,"0")}`;let e=de(i.hass,n.anchor);if(n.offset_min===0)return e;let t=Math.abs(n.offset_min),r=t%60===0?`${t/60}h`:`${t}m`;return`${e}${n.offset_min<0?"-":"+"}${r}`}function Ze(n,i,e){let t=Ge(e.hass,n.action),r=i?.domains?.[0]??"target",s=n.entity_ids.length,o;s===0?o="(no targets)":s===1?o=`1 ${r}`:o=`${s} ${r}s`;let d=Object.entries(n.params).filter(([,c])=>c!=null&&c!=="").map(([c,v])=>`${c} ${v}`).join(", ");return d?`${t}: ${o}, ${d}`:`${t}: ${o}`}var w=class extends u{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_summary(e){let t=Object.keys(e.when).filter(o=>e.when[o]!=null),r=t.length===0?"any":t.map(o=>`${le(this.hass,o)}: ${ce(o,e.when[o],{hass:this.hass,periods:this.periods})}`).join(", "),s=e.actions.length;return`${r} \xB7 ${s} action${s===1?"":"s"}`}_onDragStart(e){this._dragFrom=e}_onDragOver(e,t){this._dragFrom===null||t===this._dragFrom||(e.preventDefault(),this._dragOver=t)}_onDrop(e){let t=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(t===null||t===e)&&this._emit("reorder-rules",{from:t,to:e})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(e,t){let r=t.name||`Rule ${e+1}`;window.confirm(`Delete "${r}"?`)&&this._emit("delete-rule",{index:e})}render(){return this.rules.length===0?l`
        <p class="empty">No rules yet.</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          + Add rule
        </button>
      `:l`
      <ul>
        ${this.rules.map((e,t)=>l`
            <li
              class=${this._dragOver===t?"drag-over":""}
              draggable=${!this.autoSort}
              @dragstart=${()=>this._onDragStart(t)}
              @dragover=${r=>this._onDragOver(r,t)}
              @drop=${()=>this._onDrop(t)}
              @dragend=${this._onDragEnd}
            >
              ${this.autoSort?"":l`<span class="handle" title="Drag to reorder">⠿</span>`}
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
    `}};w.styles=m`
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
  `,a([h({attribute:!1})],w.prototype,"rules",2),a([h({type:Boolean})],w.prototype,"autoSort",2),a([h({attribute:!1})],w.prototype,"periods",2),a([h({attribute:!1})],w.prototype,"hass",2),a([p()],w.prototype,"_dragFrom",2),a([p()],w.prototype,"_dragOver",2),w=a([g("ambience-rules-list")],w);function Qe(n,i,e){if(!n||!n.entities||!i)return[];let t=n.entities,r=n.devices??{};return Object.values(t).filter(s=>!!(s.area_id===i||s.device_id&&r[s.device_id]?.area_id===i)).filter(s=>e.includes(s.entity_id.split(".")[0])).map(s=>s.entity_id).sort()}var k=class extends u{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=e=>{this._open&&(e.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=e=>{e.stopPropagation();let t=e.detail.value?.scene??"";this._emit(t.trim()===""?null:t)}}connectedCallback(){super.connectedCallback(),I(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(e){e.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(t=>({value:t,label:t})),custom_value:!0,mode:"dropdown"}}}])}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target.value;this._emit(t.trim()===""?null:t),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(e){e.key==="Escape"&&this._open&&(this._open=!1,e.stopPropagation())}_toggle(e){e.preventDefault(),this._open=!this._open}_select(e,t){t.preventDefault(),this._emit(e),this._open=!1}render(){if(customElements.get("ha-form")){let e={scene:this.value??""};return l`
        <ha-form
          .hass=${this.hass}
          .schema=${this._schema}
          .data=${e}
          .computeLabel=${$t}
          @value-changed=${this._onHaFormValueChanged}
        ></ha-form>
      `}return l`
      <div class="control">
        <input
          type="text"
          placeholder="Scene name"
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
      ${this._open?l`
            <div class="menu" role="listbox">
              ${this.suggestions.length===0?l`<div class="empty">
                    No scenes yet — type to create one
                  </div>`:this.suggestions.map(e=>l`
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
    `}};k.styles=m`
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
  `,a([h({attribute:!1})],k.prototype,"hass",2),a([h()],k.prototype,"value",2),a([h({attribute:!1})],k.prototype,"suggestions",2),a([p()],k.prototype,"_schema",2),a([p()],k.prototype,"_open",2),k=a([g("ambience-scene-combobox")],k);function $t(n){return n.name==="scene"?"Scene name":n.name}var xt=["dawn","sunrise","noon","sunset","dusk","midnight"],U=class extends u{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onKindChange(e){let t=e.target.value;t!==this.value.kind&&(t==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let t=e.target.value,[r,s]=t.split(":").map(o=>parseInt(o,10));Number.isNaN(r)||Number.isNaN(s)||this._emit({kind:"time",hh:r,mm:s})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let t=e.target.value;this._emit({kind:"sun",anchor:t,offset_min:this.value.offset_min})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let t=parseInt(e.target.value,10);Number.isNaN(t)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:t})}_renderTime(e){let t=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return l`<input type="time" .value=${t} @input=${this._onTimeChange} />`}_renderSun(e){let t=wt(e.offset_min);return l`
      <select @change=${this._onAnchorChange}>
        ${xt.map(r=>l`<option value=${r} ?selected=${r===e.anchor}>${de(this.hass,r)}</option>`)}
      </select>
      <input
        type="number"
        step="1"
        placeholder="±min, e.g. -30"
        .value=${String(e.offset_min)}
        @input=${this._onOffsetChange}
      />
      <span class="offset-hint">${t}</span>
    `}render(){return l`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>Time</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>Sun</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};U.styles=m`
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
  `,a([h({attribute:!1})],U.prototype,"hass",2),a([h({attribute:!1})],U.prototype,"value",2),U=a([g("ambience-time-endpoint")],U);function wt(n){if(n===0)return"";let i=Math.abs(n),e=n<0?"\u2212":"+";if(i%60===0){let t=i/60;return`${e}${t} ${t===1?"hour":"hours"}`}return`${e}${i} min`}var Z={kind:"any"},et={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},E=class extends u{constructor(){super(...arguments);this.value=null;this._entries=[Z];this._openIdx=0}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[Z]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(t=>{let r=this._entries[this._openIdx];if(!r)return;let s=r.kind==="any"?"__any__":r.kind==="range"?"__custom__":r.period;t.value!==s&&(t.value=s)})}_predicateToEntries(e){return e===null?[Z]:(Array.isArray(e)?e:[e]).map(r=>"period"in r?{kind:"period",period:r.period}:{kind:"range",from:r.from,to:r.to})}_emit(e){let t=e.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),r=t.length===0?null:t.length===1?t[0]:t;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let e=Object.keys(this.periods.builtins),t=Object.keys(this.periods.custom).filter(s=>!(s in this.periods.builtins)),r=new Set(this.periods.hidden);return[...e.filter(s=>!r.has(s)),...t]}_onSelectChange(e,t){let r=t.target.value,s=[...this._entries];r==="__any__"?s[e]=Z:r==="__custom__"?s[e]={kind:"range",...et}:s[e]={kind:"period",period:r},this._entries=s,this._emit(s)}_onRangeChange(e,t,r){r.stopPropagation();let s=this._entries[e];if(!s||s.kind!=="range")return;let o=[...this._entries];o[e]={...s,[t]:r.detail.value},this._entries=o,this._emit(o)}_onRemove(e){let t=this._entries.filter((r,s)=>s!==e);this._entries=t.length===0?[Z]:t,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...et}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,t){let r;return e.kind==="any"?r="(any)":e.kind==="period"?r=he({period:e.period},{hass:this.hass,periods:this.periods}):r=he({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),l`
      <div class="summary-chip" @click=${()=>this._onChipClick(t)}>
        <span class="chip-label">${r}</span>
        ${this._entries.length>1?l`<button class="remove" @click=${s=>{s.stopPropagation(),this._onRemove(t)}} title="Remove">✕</button>`:""}
      </div>
    `}_renderEntry(e,t,r){let s=this._effectiveIds(),o=this.periods?.custom??{};return l`
      <div class="entry">
        <div class="entry-header">
          <select @change=${d=>this._onSelectChange(t,d)}>
            ${r?l`<option value="__any__">Any time</option>`:""}
            <option value="__custom__">Custom range</option>
            <option disabled>──────</option>
            ${s.map(d=>l`<option value=${d}>
                ${j(this.hass,d,o)}${o[d]&&!this.periods?.builtins[d]?" (custom)":""}
              </option>`)}
          </select>
          ${this._entries.length>1?l`<button class="remove" @click=${()=>this._onRemove(t)} title="Remove">✕</button>`:""}
        </div>
        ${e.kind==="range"?l`
              <div class="range-row">
                <label>From</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.from}
                  @value-changed=${d=>this._onRangeChange(t,"from",d)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>To</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${d=>this._onRangeChange(t,"to",d)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(r=>r.kind!=="any"),t=this._entries.length>1;return l`
      ${this._entries.map((r,s)=>t&&s!==this._openIdx?this._renderChip(r,s):this._renderEntry(r,s,s===0))}
      ${e?l`<button class="add-btn" @click=${this._onAdd}>+ add another time range</button>`:""}
    `}};E.styles=m`
    :host { display: block; }
    .entry {
      display: flex; flex-direction: column; gap: 0.5rem;
      margin-bottom: 0.5rem;
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
    .summary-chip {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
      cursor: pointer;
    }
    .summary-chip:hover { border-color: var(--primary-color, #03a9f4); }
    .chip-label { flex: 1; }
  `,a([h({attribute:!1})],E.prototype,"value",2),a([h({attribute:!1})],E.prototype,"periods",2),a([h({attribute:!1})],E.prototype,"hass",2),a([p()],E.prototype,"_entries",2),a([p()],E.prototype,"_openIdx",2),E=a([g("ambience-time-of-day-input")],E);var C=class extends u{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onText(e){let t=e.target.value;this._emit(t.trim()===""?null:t)}render(){return this.matcher.input==="time_of_day"?l`
        <ambience-time-of-day-input
          .value=${this.value}
          .periods=${this.periods}
          .hass=${this.hass}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-time-of-day-input>
      `:this.matcher.input==="scene_combobox"?l`
        <ambience-scene-combobox
          .hass=${this.hass}
          .value=${this.value??null}
          .suggestions=${this.sceneSuggestions}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-scene-combobox>
      `:l`
      <input
        type="text"
        placeholder="(any)"
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};C.styles=m`
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
  `,a([h({attribute:!1})],C.prototype,"matcher",2),a([h({attribute:!1})],C.prototype,"value",2),a([h({attribute:!1})],C.prototype,"sceneSuggestions",2),a([h({attribute:!1})],C.prototype,"periods",2),a([h({attribute:!1})],C.prototype,"hass",2),C=a([g("ambience-matcher-input")],C);var M=class extends u{constructor(){super(...arguments);this.entities=[];this.value=[]}connectedCallback(){super.connectedCallback(),I(this,this.hass)}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let e=[{name:"entity_ids",label:"",selector:{entity:{multiple:!0,include_entities:this.entities}}}];return l`
      <ha-form
        .hass=${this.hass}
        .schema=${e}
        .data=${{entity_ids:this.value}}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,t){let r=new Set(this.value);t?r.add(e):r.delete(e),this._emit(this.entities.filter(s=>r.has(s)))}_renderFallback(){return this.entities.length===0?l`<p class="empty">No matching entities in this area.</p>`:l`
      <div class="checkboxes">
        ${this.entities.map(e=>l`
            <label>
              <input
                type="checkbox"
                .checked=${this.value.includes(e)}
                @change=${t=>this._toggle(e,t.target.checked)}
              />
              ${e}
            </label>
          `)}
      </div>
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};M.styles=m`
    :host { display: block; }
    .empty {
      color: var(--secondary-text-color, #888);
      font-style: italic;
      padding: 0.5rem 0;
    }
    .checkboxes {
      display: flex; flex-direction: column; gap: 0.25rem;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
    }
    label {
      display: flex; align-items: center; gap: 0.5rem;
      cursor: pointer;
      padding: 0.25rem;
    }
    label:hover { background: var(--secondary-background-color, #f5f5f5); }
  `,a([h({attribute:!1})],M.prototype,"hass",2),a([h({attribute:!1})],M.prototype,"entities",2),a([h({attribute:!1})],M.prototype,"value",2),M=a([g("ambience-target-picker")],M);var y=class extends u{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._open=null;this._showError=!1;this._onNameInput=e=>{this._setName(e.target.value)}}connectedCallback(){super.connectedCallback(),I(this,this.hass)}willUpdate(e){e.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null,this._open=null,this._showError=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_renderNameSlot(){let e=this._draft.name??"";return this._isOpen({kind:"name"})?l`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
        </div>
      `:l`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${e||"New rule"}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let t=Fe();return t==="ha-input"?l`<ha-input label="Name (optional)" .value=${e} @input=${this._onNameInput}></ha-input>`:t==="ha-textfield"?l`<ha-textfield label="Name (optional)" .value=${e} @input=${this._onNameInput}></ha-textfield>`:l`<input type="text" .value=${e} @input=${this._onNameInput} />`}_isOpen(e){return this._open===null?!1:e.kind==="name"&&this._open.kind==="name"?!0:e.kind==="matcher"&&this._open.kind==="matcher"?e.id===this._open.id:e.kind==="action"&&this._open.kind==="action"?e.idx===this._open.idx:!1}_validationError(e){if(e===null||e.kind==="name"||e.kind==="matcher")return null;let t=this._draft?.actions[e.idx];if(!t)return null;if(t.entity_ids.length===0)return"At least one target is required.";let r=this.availableActions.find(s=>s.name===t.action);if(!r)return null;for(let s of r.target_params){if(!s.required)continue;let o=t.params[s.name];if(o==null||o==="")return`${this._paramLabel(s.name)} is required.`}return null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){this._tryCloseCurrent();return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let t of e.composedPath())if(t instanceof Element&&(t.classList.contains("slot")||t.classList.contains("actions-bar")))return;this._tryCloseCurrent()}_setPredicate(e,t){if(!this._draft)return;let r={...this._draft.when};t==null?delete r[e]:r[e]=t,this._draft={...this._draft,when:r}}_renderMatcherRow(e){let t=this._draft.when[e.name]??null,r=this._isOpen({kind:"matcher",id:e.name}),s=e.input==="scene_combobox";if(r&&s)return l`
        <div class="slot combobox-slot expanded" data-slot-id=${e.name}>
          <ambience-matcher-input
            .hass=${this.hass}
            .matcher=${e}
            .value=${t}
            .sceneSuggestions=${this.sceneSuggestions}
            .periods=${this.periods}
            @value-changed=${d=>this._setPredicate(e.name,d.detail.value)}
          ></ambience-matcher-input>
        </div>
      `;let o=ce(e.name,t,{hass:this.hass,periods:this.periods});return l`
      <div class="slot ${r?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"matcher",id:e.name})}>
          <span class="summary-label"><strong>${le(this.hass,e.name)}:</strong> ${o}</span>
        </div>
        ${r?l`
          <div class="body">
            <ambience-matcher-input
              .hass=${this.hass}
              .matcher=${e}
              .value=${t}
              .sceneSuggestions=${this.sceneSuggestions}
              .periods=${this.periods}
              @value-changed=${d=>this._setPredicate(e.name,d.detail.value)}
            ></ambience-matcher-input>
          </div>
        `:""}
      </div>
    `}_addActionSlot(){if(!this._draft)return;let e={action:"set_light",entity_ids:[],params:{}},t=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,e]},this._open={kind:"action",idx:t}}_updateActionAt(e,t){if(!this._draft)return;let r=this._draft.actions.map((s,o)=>o===e?t(s):s);this._draft={...this._draft,actions:r}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((t,r)=>r!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,t){this._updateActionAt(e,r=>({...r,entity_ids:t}))}_paramLabel(e){let t=e.replaceAll("_"," ").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}_updateActionParam(e,t,r){this._updateActionAt(e,s=>{let o={...s.params},d=r;if(t.type==="int"?d=r===""?void 0:parseInt(r,10):t.type==="number"?d=r===""?void 0:parseFloat(r):t.type==="boolean"&&(d=r==="true"),typeof d=="number"&&Number.isFinite(d)){let c=d;typeof t.min=="number"&&c<t.min&&(c=t.min),typeof t.max=="number"&&c>t.max&&(c=t.max),d=c}return d===void 0?delete o[t.name]:o[t.name]=d,{...s,params:o}})}_renderActionParams(e,t,r){let s=r?.target_params??[];return l`
      ${s.map(o=>l`
        <div class="param-row">
          <label>${this._paramLabel(o.name)}${o.required?" *":""}</label>
          <div class="param-input">
            <input
              type=${o.type==="int"||o.type==="number"?"number":"text"}
              placeholder=${o.description??""}
              .value=${String(t.params[o.name]??"")}
              min=${o.min??""}
              max=${o.max??""}
              @input=${d=>this._updateActionParam(e,o,d.target.value)}
            />
            ${o.unit?l`<span class="param-unit">${o.unit}</span>`:""}
          </div>
        </div>
      `)}
    `}_renderActionRow(e,t){let r=this.availableActions.find(c=>c.name===e.action),s=this._isOpen({kind:"action",idx:t}),o=Ze(e,r,{hass:this.hass}),d=Qe(this.hass,this.areaId,r?.domains??[]);return l`
      <div class="slot ${s?"expanded":"collapsed"}" data-slot-id="action-${t}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:t})}>
          <span class="summary-label">${o}</span>
          <button class="remove" @click=${c=>{c.stopPropagation(),this._deleteAction(t)}} title="Remove action">✕</button>
        </div>
        ${s?l`
          <div class="body">
            <label>Target</label>
            <ambience-target-picker
              .hass=${this.hass}
              .entities=${d}
              .value=${e.entity_ids}
              @value-changed=${c=>{c.stopPropagation(),this._setActionTargets(t,c.detail.value)}}
            ></ambience-target-picker>

            ${this._renderActionParams(t,e,r)}

            ${this._showError&&this._validationError({kind:"action",idx:t})?l`
              <div class="error">${this._validationError({kind:"action",idx:t})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_save(){this._draft&&this.dispatchEvent(new CustomEvent("save-rule",{detail:this._draft,bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){return this._draft?l`
      <div class="modal" @click=${this._onModalClick}>
        ${this._renderNameSlot()}

        <h3>When</h3>
        ${this.matchers.map(e=>this._renderMatcherRow(e))}

        <h3>Actions</h3>
        ${this._draft.actions.map((e,t)=>this._renderActionRow(e,t))}
        <button class="secondary add-action" @click=${this._addActionSlot}>+ Add action</button>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._save}>Save rule</button>
        </div>
      </div>
    `:l``}};y.styles=m`
    :host {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 100;
      align-items: center; justify-content: center;
    }
    :host([open]) { display: flex; }
    .modal {
      background: var(--card-background-color, #fff); color: inherit;
      border-radius: 8px; padding: 1.5rem;
      width: 90%; max-width: 40rem; max-height: 90vh; overflow-y: auto;
    }
    h3 {
      margin: 1.5rem 0 0.5rem 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      padding-bottom: 0.25rem;
    }
    label {
      display: block; font-weight: 600; margin: 0.5rem 0 0.25rem 0;
    }
    input, select {
      width: 100%; box-sizing: border-box; padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
    }
    .slot {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    .summary {
      padding: 0.6rem 0.75rem;
      cursor: pointer;
      display: flex; align-items: center;
      gap: 0.5rem;
    }
    .summary:hover { background: var(--secondary-background-color, #f5f5f5); }
    .summary-label { flex: 1; }
    .slot.expanded .summary {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .slot.combobox-slot.expanded,
    .slot.name-slot.expanded {
      border: none;
      padding: 0;
      margin-bottom: 0.5rem;
    }
    .body {
      padding: 0.75rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .actions-bar {
      display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;
    }
    button {
      padding: 0.5rem 1rem; border: 0; border-radius: 4px; cursor: pointer;
    }
    .primary { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); }
    .secondary {
      background: transparent; color: var(--primary-text-color, inherit);
      border: 1px solid var(--divider-color, #ccc);
    }
    .remove {
      background: none; border: none; color: var(--secondary-text-color, #888);
      cursor: pointer; font-size: 1.1em;
      padding: 0; width: auto;
    }
    .param-input {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .param-input input {
      flex: 1;
    }
    .param-unit {
      color: var(--secondary-text-color, #888);
      font-size: 0.9em;
      min-width: 1.5em;
    }
    .error {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      margin-top: 0.5rem;
      padding: 0.3rem 0;
    }
  `,a([h({type:Boolean,reflect:!0})],y.prototype,"open",2),a([h({attribute:!1})],y.prototype,"rule",2),a([h({attribute:!1})],y.prototype,"matchers",2),a([h({attribute:!1})],y.prototype,"sceneSuggestions",2),a([h({attribute:!1})],y.prototype,"periods",2),a([h({attribute:!1})],y.prototype,"availableActions",2),a([h({attribute:!1})],y.prototype,"hass",2),a([h({attribute:!1})],y.prototype,"areaId",2),a([p()],y.prototype,"_draft",2),a([p()],y.prototype,"_open",2),a([p()],y.prototype,"_showError",2),y=a([g("ambience-rule-editor")],y);var P=class extends u{constructor(){super(...arguments);this.open=!1;this.matchers=[];this.selected=[];this._draft=new Set}willUpdate(e){(e.has("selected")||e.has("open"))&&this.open&&(this._draft=new Set(this.selected))}_toggle(e,t){let r=new Set(this._draft);t?r.add(e):r.delete(e),this._draft=r}_apply(){this.dispatchEvent(new CustomEvent("apply-matchers",{detail:{matchers:[...this._draft]},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-matchers",{bubbles:!0,composed:!0}))}render(){let e=this.matchers.filter(t=>t.toggleable);return l`
      <div class="modal">
        <h2>Matchers</h2>
        <p class="intro">
          Select which matchers can be used in this area's rule predicates.
        </p>
        ${e.map(t=>l`
            <label class="matcher-row">
              <input
                type="checkbox"
                .checked=${this._draft.has(t.name)}
                @change=${r=>this._toggle(t.name,r.target.checked)}
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
    `}};P.styles=m`
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
  `,a([h({type:Boolean,reflect:!0})],P.prototype,"open",2),a([h({attribute:!1})],P.prototype,"matchers",2),a([h({attribute:!1})],P.prototype,"selected",2),a([p()],P.prototype,"_draft",2),P=a([g("ambience-matchers-modal")],P);var $=class extends u{constructor(){super(...arguments);this._areas=[];this._matchers=[];this._actions=[];this._configs=new Map;this._expanded=new Set;this._error="";this._editing=null;this._matchersModalArea=null}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await this._refreshAreas(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _loadStatic(){try{let[e,t,r]=await Promise.all([Ve(this.hass),Ke(this.hass),oe(this.hass)]);if(!this.isConnected)return;this._matchers=e,this._actions=t,this._periods=r}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await qe(this.hass),t=new Map;if(await Promise.all(e.map(async r=>{t.set(r.area_id,this._normalize(await We(this.hass,r.area_id)))})),!this.isConnected)return;this._areas=e,this._configs=t}catch(e){this._error=e.message||String(e)}}_normalize(e){return{matchers:e.matchers??[],rules:e.rules??[],auto_sort:e.auto_sort??!0}}async _subscribe(){let e=await this.hass.connection.subscribeEvents(t=>{if(t.data.action==="remove"){let r=t.data.area_id,s=new Set(this._expanded);s.delete(r),this._expanded=s,this._editing?.areaId===r&&(this._editing=null),this._matchersModalArea===r&&(this._matchersModalArea=null)}this._refreshAreas()},"area_registry_updated");this.isConnected?this._unsub=e:e()}_setConfig(e,t){let r=new Map(this._configs);r.set(e,t),this._configs=r}async _mutate(e,t){let r=this._configs.get(e);this._setConfig(e,t),this._error="";try{let{config:s}=await Be(this.hass,e,t);this._setConfig(e,this._normalize(s))}catch(s){r&&this._setConfig(e,r),this._error=s.message||String(s)}}_toggleExpand(e){let t=new Set(this._expanded);t.has(e)?t.delete(e):t.add(e),this._expanded=t}_openMatchersModal(e){this._matchersModalArea=e}_applyMatchers(e){let t=this._matchersModalArea;if(this._matchersModalArea=null,!t)return;let r=this._configs.get(t);r&&this._mutate(t,{...r,matchers:e.detail.matchers})}_toggleAutoSort(e,t){let r=this._configs.get(e);r&&this._mutate(e,{...r,auto_sort:t})}_addRule(e){let t=this._configs.get(e);t&&(this._editing={areaId:e,index:t.rules.length,isNew:!0})}_editRule(e,t){this._editing={areaId:e,index:t.detail.index,isNew:!1}}_duplicateRule(e,t){let r=this._configs.get(e);if(!r)return;let s=r.rules[t.detail.index];if(!s)return;let o=JSON.parse(JSON.stringify(s)),d=[...r.rules];d.splice(t.detail.index+1,0,o),this._mutate(e,{...r,rules:d})}_deleteRule(e,t){let r=this._configs.get(e);if(!r)return;let s=r.rules.filter((o,d)=>d!==t.detail.index);this._mutate(e,{...r,rules:s})}_reorderRules(e,t){let r=this._configs.get(e);if(!r)return;let{from:s,to:o}=t.detail,d=[...r.rules],[c]=d.splice(s,1);d.splice(o,0,c),this._mutate(e,{...r,rules:d})}_saveRule(e){let t=this._editing;if(this._editing=null,!t)return;let r=this._configs.get(t.areaId);if(!r)return;let s=[...r.rules];t.isNew?s.push(e.detail):s[t.index]=e.detail,this._mutate(t.areaId,{...r,rules:s})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._configs.get(this._editing.areaId)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let e=this._configs.get(this._editing.areaId);if(!e)return[];let t=new Set;for(let r of e.rules){let s=r.when.scene;typeof s=="string"&&s&&t.add(s)}return[...t].sort((r,s)=>r.toLowerCase().localeCompare(s.toLowerCase()))}get _editorMatchers(){if(!this._editing)return[];let e=this._configs.get(this._editing.areaId);if(!e)return[];let t=this._matchers.find(s=>s.name==="scene"),r=this._matchers.filter(s=>e.matchers.includes(s.name));return t?[t,...r]:r}_summary(e){if(e.rules.length===0&&e.matchers.length===0)return"not configured";let t=e.rules.length,r=e.matchers.length;return`${t} rule${t===1?"":"s"} \xB7 ${r} matcher${r===1?"":"s"}`}render(){return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?l`<p class="empty">No areas found in Home Assistant.</p>`:l`<ul>
            ${this._areas.map(e=>this._renderArea(e))}
          </ul>`}

      <ambience-rule-editor
        ?open=${this._editing!==null}
        .hass=${this.hass}
        .areaId=${this._editing?.areaId}
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
    `}_renderArea(e){let t=this._configs.get(e.area_id);if(!t)return l``;let r=this._expanded.has(e.area_id);return l`
      <li>
        <div
          class="area-header"
          @click=${()=>this._toggleExpand(e.area_id)}
        >
          <span class="chevron ${r?"open":""}">▶</span>
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
        ${r?l`
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
    `}};$.styles=m`
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
  `,a([h({attribute:!1})],$.prototype,"hass",2),a([p()],$.prototype,"_areas",2),a([p()],$.prototype,"_matchers",2),a([p()],$.prototype,"_actions",2),a([p()],$.prototype,"_periods",2),a([p()],$.prototype,"_configs",2),a([p()],$.prototype,"_expanded",2),a([p()],$.prototype,"_error",2),a([p()],$.prototype,"_editing",2),a([p()],$.prototype,"_matchersModalArea",2),$=a([g("ambience-areas-list")],$);var kt=/^[a-z][a-z0-9_]*$/,x=class extends u{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._id="";this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._id=this.existingId??"",this._label=this.initial.label??"",this._def=this.initial}_onIdInput(e){this._id=e.target.value}_onLabelInput(e){this._label=e.target.value}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_validate(){if(!this.existingId){if(!kt.test(this._id))return"Id must be lowercase, start with a letter, and contain only letters, digits, and underscores.";if(this.takenIds.has(this._id))return"An id already exists with this name. To shadow a built-in, use Edit on the built-in row."}return""}_onSave(){let e=this._validate();if(e){this._error=e,this.performUpdate();return}let t=this.existingId??this._id,r={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:t,definition:r},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){return l`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${this.existingId?`Edit ${this.existingId}`:"Add custom period"}</h3>
        ${this.existingId?"":l`
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
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
        </div>
        <div class="row">
          <label style="min-width: 3em;">To</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
        </div>
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>Cancel</button>
          <button @click=${this._onSave}>Save</button>
        </div>
      </div>
    `}};x.styles=m`
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
  `,a([h({attribute:!1})],x.prototype,"hass",2),a([h({attribute:!1})],x.prototype,"existingId",2),a([h({attribute:!1})],x.prototype,"initial",2),a([h({attribute:!1})],x.prototype,"takenIds",2),a([p()],x.prototype,"_id",2),a([p()],x.prototype,"_label",2),a([p()],x.prototype,"_def",2),a([p()],x.prototype,"_error",2),x=a([g("ambience-period-edit-modal")],x);function tt(n){if(n.kind==="time")return`${String(n.hh).padStart(2,"0")}:${String(n.mm).padStart(2,"0")}`;if(n.offset_min===0)return n.anchor;let i=Math.abs(n.offset_min),e=i%60===0?`${i/60}h`:`${i}m`;return`${n.anchor}${n.offset_min<0?"-":"+"}${e}`}function Et(n){return`${tt(n.from)} \u2192 ${tt(n.to)}`}var H=class extends u{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await oe(this.hass)}_effective(){let e=new Set(this._view.hidden),t=[];for(let[r,s]of Object.entries(this._view.builtins)){if(e.has(r))continue;let o=this._view.custom[r];o?t.push({id:r,defn:o,provenance:"builtin-edited"}):t.push({id:r,defn:s,provenance:"builtin"})}for(let[r,s]of Object.entries(this._view.custom))r in this._view.builtins||t.push({id:r,defn:s,provenance:"custom"});return t}async _saveState(e,t){let r=await Je(this.hass,e,t);this._warnings=r.warnings,await this._reload()}_onEdit(e,t){this._modal={mode:"edit",id:e,initial:t}}async _onDelete(e){if(e in this._view.builtins){let r={...this._view.custom};delete r[e],await this._saveState(r,[...this._view.hidden,e])}else{let r={...this._view.custom};delete r[e],await this._saveState(r,this._view.hidden)}}async _onRevertEdited(e){let t={...this._view.custom};delete t[e],await this._saveState(t,this._view.hidden)}async _onRevertHidden(e){await this._saveState(this._view.custom,this._view.hidden.filter(t=>t!==e))}async _onResetAll(){let e=Object.keys(this._view.custom).length,t=this._view.hidden.length,r=`This will clear ${e} custom period(s) and restore ${t} hidden built-in(s). Continue?`;confirm(r)&&(await Xe(this.hass),this._warnings=[],await this._reload())}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:t,definition:r}=e.detail,s={...this._view.custom,[t]:r},o=this._view.hidden.filter(d=>d!==t);this._modal={mode:"closed"},await this._saveState(s,o)}_onModalCancel(){this._modal={mode:"closed"}}_renderRow(e){let t=this._view.custom,r=e.provenance==="builtin-edited",s=e.provenance==="custom";return l`
      <div class="row">
        <span class="name">${j(this.hass,e.id,t)}</span>
        <span class="def">${Et(e.defn)}</span>
        <span class="badge">${e.provenance==="builtin"?"builtin":e.provenance==="builtin-edited"?"builtin, edited":"custom"}</span>
        <span class="actions">
          <button class="icon" title="Edit" @click=${()=>this._onEdit(e.id,e.defn)}>✎</button>
          ${r?l`<button class="icon" title="Revert to default" @click=${()=>this._onRevertEdited(e.id)}>↺</button>`:""}
          ${s||e.provenance==="builtin"||r?l`<button class="icon" title="Delete" @click=${()=>this._onDelete(e.id)}>✕</button>`:""}
        </span>
      </div>
    `}_renderHiddenRow(e){return l`
      <div class="row">
        <span class="name">${j(this.hass,e,{})}</span>
        <span class="def">(hidden)</span>
        <span class="badge">hidden</span>
        <span class="actions">
          <button class="icon" title="Restore" @click=${()=>this._onRevertHidden(e)}>↺</button>
        </span>
      </div>
    `}render(){let e=this._effective();return l`
      <header>
        <h2>Periods</h2>
        <button @click=${this._onResetAll}>Reset all to defaults</button>
      </header>
      ${this._warnings.length?l`<div class="warnings">
            <strong>Warning:</strong> some rules now reference missing periods:
            <ul>
              ${this._warnings.map(t=>l`<li>${t.area_id} / "${t.rule_name}" → ${t.missing_period}</li>`)}
            </ul>
          </div>`:""}
      ${e.map(t=>this._renderRow(t))}
      ${this._view.hidden.map(t=>this._renderHiddenRow(t))}
      <button class="add" @click=${this._onAdd}>+ Add custom period</button>
      ${this._modal.mode==="edit"?l`<ambience-period-edit-modal
            .existingId=${this._modal.id}
            .initial=${this._modal.initial}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:this._modal.mode==="add"?l`<ambience-period-edit-modal
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:""}
    `}};H.styles=m`
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
  `,a([h({attribute:!1})],H.prototype,"hass",2),a([p()],H.prototype,"_view",2),a([p()],H.prototype,"_modal",2),a([p()],H.prototype,"_warnings",2),H=a([g("ambience-periods-view")],H);var z=class extends u{constructor(){super(...arguments);this._view="areas"}connectedCallback(){super.connectedCallback(),I(this)}render(){return l`
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
      ${this._view==="areas"?l`<ambience-areas-list .hass=${this.hass}></ambience-areas-list>`:l`<ambience-periods-view .hass=${this.hass}></ambience-periods-view>`}
    `}};z.styles=m`
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
  `,a([h({attribute:!1})],z.prototype,"hass",2),a([p()],z.prototype,"_view",2),z=a([g("ambience-panel")],z);export{z as AmbiencePanel};
