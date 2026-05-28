/* Ambience panel — bundled output. Do not edit by hand. */
var Ri=Object.defineProperty;var ji=Object.getOwnPropertyDescriptor;var c=(t,n,e,r)=>{for(var i=r>1?void 0:r?ji(n,e):n,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(r?a(n,e,i):a(i))||i);return r&&i&&Ri(n,e,i),i};var Ve=globalThis,Je=Ve.ShadowRoot&&(Ve.ShadyCSS===void 0||Ve.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,St=Symbol(),ar=new WeakMap,He=class{constructor(n,e,r){if(this._$cssResult$=!0,r!==St)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(Je&&n===void 0){let r=e!==void 0&&e.length===1;r&&(n=ar.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),r&&ar.set(e,n))}return n}toString(){return this.cssText}},or=t=>new He(typeof t=="string"?t:t+"",void 0,St),$=(t,...n)=>{let e=t.length===1?t[0]:n.reduce((r,i,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new He(e,t,St)},lr=(t,n)=>{if(Je)t.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let r=document.createElement("style"),i=Ve.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,t.appendChild(r)}},Ct=Je?t=>t:t=>t instanceof CSSStyleSheet?(n=>{let e="";for(let r of n.cssRules)e+=r.cssText;return or(e)})(t):t;var{is:zi,defineProperty:Ui,getOwnPropertyDescriptor:Wi,getOwnPropertyNames:Bi,getOwnPropertySymbols:Gi,getPrototypeOf:Yi}=Object,Qe=globalThis,dr=Qe.trustedTypes,qi=dr?dr.emptyScript:"",Ki=Qe.reactiveElementPolyfillSupport,De=(t,n)=>t,Pe={toAttribute(t,n){switch(n){case Boolean:t=t?qi:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,n){let e=t;switch(n){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},Xe=(t,n)=>!zi(t,n),ur={attribute:!0,type:String,converter:Pe,reflect:!1,useDefault:!1,hasChanged:Xe};Symbol.metadata??=Symbol("metadata"),Qe.litPropertyMetadata??=new WeakMap;var X=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=ur){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(n,r,e);i!==void 0&&Ui(this.prototype,n,i)}}static getPropertyDescriptor(n,e,r){let{get:i,set:s}=Wi(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);s?.call(this,a),this.requestUpdate(n,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??ur}static _$Ei(){if(this.hasOwnProperty(De("elementProperties")))return;let n=Yi(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(De("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(De("properties"))){let e=this.properties,r=[...Bi(e),...Gi(e)];for(let i of r)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let r=new Set(n.flat(1/0).reverse());for(let i of r)e.unshift(Ct(i))}else n!==void 0&&e.push(Ct(n));return e}static _$Eu(n,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(n.set(r,this[r]),delete this[r]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lr(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,r){this._$AK(n,r)}_$ET(n,e){let r=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:Pe).toAttribute(e,r.type);this._$Em=n,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(n,e){let r=this.constructor,i=r._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Pe;this._$Em=i;let o=a.fromAttribute(e,s.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(n,e,r,i=!1,s){if(n!==void 0){let a=this.constructor;if(i===!1&&(s=this[n]),r??=a.getPropertyOptions(n),!((r.hasChanged??Xe)(s,e)||r.useDefault&&r.reflect&&s===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,r))))return;this.C(n,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:r,reflect:i,wrapped:s},a){r&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),s!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||r||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:a}=s,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,s,o)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw n=!1,this._$EM(),r}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};X.elementStyles=[],X.shadowRootOptions={mode:"open"},X[De("elementProperties")]=new Map,X[De("finalized")]=new Map,Ki?.({ReactiveElement:X}),(Qe.reactiveElementVersions??=[]).push("2.1.2");var Pt=globalThis,cr=t=>t,Ze=Pt.trustedTypes,hr=Ze?Ze.createPolicy("lit-html",{createHTML:t=>t}):void 0,vr="$lit$",ae=`lit$${Math.random().toFixed(9).slice(2)}$`,yr="?"+ae,Vi=`<${yr}>`,fe=document,Ne=()=>fe.createComment(""),Ie=t=>t===null||typeof t!="object"&&typeof t!="function",Ot=Array.isArray,Ji=t=>Ot(t)||typeof t?.[Symbol.iterator]=="function",At=`[ 	
\f\r]`,Oe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pr=/-->/g,mr=/>/g,pe=RegExp(`>|${At}(?:([^\\s"'>=/]+)(${At}*=${At}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),fr=/'/g,gr=/"/g,br=/^(?:script|style|textarea|title)$/i,Nt=t=>(n,...e)=>({_$litType$:t,strings:n,values:e}),l=Nt(1),co=Nt(2),ho=Nt(3),ge=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),_r=new WeakMap,me=fe.createTreeWalker(fe,129);function $r(t,n){if(!Ot(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return hr!==void 0?hr.createHTML(n):n}var Qi=(t,n)=>{let e=t.length-1,r=[],i,s=n===2?"<svg>":n===3?"<math>":"",a=Oe;for(let o=0;o<e;o++){let d=t[o],h,f,p=-1,_=0;for(;_<d.length&&(a.lastIndex=_,f=a.exec(d),f!==null);)_=a.lastIndex,a===Oe?f[1]==="!--"?a=pr:f[1]!==void 0?a=mr:f[2]!==void 0?(br.test(f[2])&&(i=RegExp("</"+f[2],"g")),a=pe):f[3]!==void 0&&(a=pe):a===pe?f[0]===">"?(a=i??Oe,p=-1):f[1]===void 0?p=-2:(p=a.lastIndex-f[2].length,h=f[1],a=f[3]===void 0?pe:f[3]==='"'?gr:fr):a===gr||a===fr?a=pe:a===pr||a===mr?a=Oe:(a=pe,i=void 0);let v=a===pe&&t[o+1].startsWith("/>")?" ":"";s+=a===Oe?d+Vi:p>=0?(r.push(h),d.slice(0,p)+vr+d.slice(p)+ae+v):d+ae+(p===-2?o:v)}return[$r(t,s+(t[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),r]},Me=class t{constructor({strings:n,_$litType$:e},r){let i;this.parts=[];let s=0,a=0,o=n.length-1,d=this.parts,[h,f]=Qi(n,e);if(this.el=t.createElement(h,r),me.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=me.nextNode())!==null&&d.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(vr)){let _=f[a++],v=i.getAttribute(p).split(ae),k=/([.?@])?(.*)/.exec(_);d.push({type:1,index:s,name:k[2],strings:v,ctor:k[1]==="."?Tt:k[1]==="?"?Ft:k[1]==="@"?Ht:ke}),i.removeAttribute(p)}else p.startsWith(ae)&&(d.push({type:6,index:s}),i.removeAttribute(p));if(br.test(i.tagName)){let p=i.textContent.split(ae),_=p.length-1;if(_>0){i.textContent=Ze?Ze.emptyScript:"";for(let v=0;v<_;v++)i.append(p[v],Ne()),me.nextNode(),d.push({type:2,index:++s});i.append(p[_],Ne())}}}else if(i.nodeType===8)if(i.data===yr)d.push({type:2,index:s});else{let p=-1;for(;(p=i.data.indexOf(ae,p+1))!==-1;)d.push({type:7,index:s}),p+=ae.length-1}s++}}static createElement(n,e){let r=fe.createElement("template");return r.innerHTML=n,r}};function we(t,n,e=t,r){if(n===ge)return n;let i=r!==void 0?e._$Co?.[r]:e._$Cl,s=Ie(n)?void 0:n._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(t),i._$AT(t,e,r)),r!==void 0?(e._$Co??=[])[r]=i:e._$Cl=i),i!==void 0&&(n=we(t,i._$AS(t,n.values),i,r)),n}var Lt=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:r}=this._$AD,i=(n?.creationScope??fe).importNode(e,!0);me.currentNode=i;let s=me.nextNode(),a=0,o=0,d=r[0];for(;d!==void 0;){if(a===d.index){let h;d.type===2?h=new Re(s,s.nextSibling,this,n):d.type===1?h=new d.ctor(s,d.name,d.strings,this,n):d.type===6&&(h=new Dt(s,this,n)),this._$AV.push(h),d=r[++o]}a!==d?.index&&(s=me.nextNode(),a++)}return me.currentNode=fe,i}p(n){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(n,r,e),e+=r.strings.length-2):r._$AI(n[e])),e++}},Re=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,r,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=we(this,n,e),Ie(n)?n===F||n==null||n===""?(this._$AH!==F&&this._$AR(),this._$AH=F):n!==this._$AH&&n!==ge&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Ji(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==F&&Ie(this._$AH)?this._$AA.nextSibling.data=n:this.T(fe.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:r}=n,i=typeof r=="number"?this._$AC(n):(r.el===void 0&&(r.el=Me.createElement($r(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(e);else{let s=new Lt(i,this),a=s.u(this.options);s.p(e),this.T(a),this._$AH=s}}_$AC(n){let e=_r.get(n.strings);return e===void 0&&_r.set(n.strings,e=new Me(n)),e}k(n){Ot(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,i=0;for(let s of n)i===e.length?e.push(r=new t(this.O(Ne()),this.O(Ne()),this,this.options)):r=e[i],r._$AI(s),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let r=cr(n).nextSibling;cr(n).remove(),n=r}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},ke=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,r,i,s){this.type=1,this._$AH=F,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=F}_$AI(n,e=this,r,i){let s=this.strings,a=!1;if(s===void 0)n=we(this,n,e,0),a=!Ie(n)||n!==this._$AH&&n!==ge,a&&(this._$AH=n);else{let o=n,d,h;for(n=s[0],d=0;d<s.length-1;d++)h=we(this,o[r+d],e,d),h===ge&&(h=this._$AH[d]),a||=!Ie(h)||h!==this._$AH[d],h===F?n=F:n!==F&&(n+=(h??"")+s[d+1]),this._$AH[d]=h}a&&!i&&this.j(n)}j(n){n===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Tt=class extends ke{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===F?void 0:n}},Ft=class extends ke{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==F)}},Ht=class extends ke{constructor(n,e,r,i,s){super(n,e,r,i,s),this.type=5}_$AI(n,e=this){if((n=we(this,n,e,0)??F)===ge)return;let r=this._$AH,i=n===F&&r!==F||n.capture!==r.capture||n.once!==r.once||n.passive!==r.passive,s=n!==F&&(r===F||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Dt=class{constructor(n,e,r){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(n){we(this,n)}};var Xi=Pt.litHtmlPolyfillSupport;Xi?.(Me,Re),(Pt.litHtmlVersions??=[]).push("3.3.2");var xr=(t,n,e)=>{let r=e?.renderBefore??n,i=r._$litPart$;if(i===void 0){let s=e?.renderBefore??null;r._$litPart$=i=new Re(n.insertBefore(Ne(),s),s,void 0,e??{})}return i._$AI(t),i};var It=globalThis,y=class extends X{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=xr(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ge}};y._$litElement$=!0,y.finalized=!0,It.litElementHydrateSupport?.({LitElement:y});var Zi=It.litElementPolyfillSupport;Zi?.({LitElement:y});(It.litElementVersions??=[]).push("4.2.2");var x=t=>(n,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(t,n)}):customElements.define(t,n)};var en={attribute:!0,type:String,converter:Pe,reflect:!1,hasChanged:Xe},tn=(t=en,n,e)=>{let{kind:r,metadata:i}=e,s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(e.name,t),r==="accessor"){let{name:a}=e;return{set(o){let d=n.get.call(this);n.set.call(this,o),this.requestUpdate(a,d,t,!0,o)},init(o){return o!==void 0&&this.C(a,void 0,t,o),o}}}if(r==="setter"){let{name:a}=e;return function(o){let d=this[a];n.call(this,o),this.requestUpdate(a,d,t,!0,o)}}throw Error("Unsupported decorator location: "+r)};function m(t){return(n,e)=>typeof e=="object"?tn(t,n,e):((r,i,s)=>{let a=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),a?Object.getOwnPropertyDescriptor(i,s):void 0})(t,n,e)}function g(t){return m({...t,state:!0,attribute:!1})}function B(t,n,e){let r=t?.localize?.(n);return r&&r!==n?r:e}function Mt(t){let n=t.replaceAll("_"," ").toLowerCase();return n.charAt(0).toUpperCase()+n.slice(1)}function oe(t,n){return B(t,`component.ambience.matcher.${n}`,Mt(n))}function tt(t,n){return B(t,`component.ambience.action.${n}`,Mt(n))}function Ee(t,n){return B(t,`component.ambience.anchor.${n}`,Mt(n))}function _e(t,n,e){let r=e[n]?.label;if(r)return r;let i=n.charAt(0).toUpperCase()+n.slice(1);return B(t,`component.ambience.time_of_day_period.${n}`,i)}function u(t,n,e){return B(t,`component.ambience.${n}`,e)}var rn=["mon","tue","wed","thu","fri","sat","sun"],nn=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function rt(t,n){return B(t,`component.ambience.weekday.${rn[n]}`,nn[n]??String(n))}var sn={weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"};function it(t,n){return B(t,`component.ambience.day_item.${n}`,sn[n]??n)}var an=["January","February","March","April","May","June","July","August","September","October","November","December"];function Se(t,n){return B(t,`component.ambience.month.${n}`,an[n-1]??String(n))}var on={"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"};function nt(t,n){return B(t,`component.ambience.weather_condition.${n}`,on[n]??n)}var ln={temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"};function je(t,n){return B(t,`component.ambience.weather_attr.${n}`,ln[n]??n)}var dn={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},un={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},cn={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function Rt(t,n,e){if(n==="humidity")return"%";let r=cn[n];if(r){let a=e?.attributes?.[r];if(typeof a=="string"&&a)return a}let i=un[n],s=t?.config?.unit_system;return i&&s&&typeof s[i]=="string"?s[i]:dn[n]??""}var hn={is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"};function G(t,n){return B(t,`component.ambience.state_op.${n}`,hn[n]??n)}var pn=["ha-input","ha-textfield","ha-form"],mn=["ha-input","ha-textfield"];function wr(){for(let t of mn)if(customElements.get(t))return t;return null}function Y(t,n){for(let e of pn)customElements.get(e)||customElements.whenDefined(e).then(()=>t.requestUpdate())}async function st(t){return t.callWS({type:"ambience/areas/list"})}async function at(t,n){return t.callWS({type:"ambience/area/get",area_id:n})}async function kr(t,n,e){return t.callWS({type:"ambience/area/save",area_id:n,config:e})}async function ot(t){return t.callWS({type:"ambience/floors/list"})}async function lt(t,n){return t.callWS({type:"ambience/floor/get",floor_id:n})}async function Er(t,n,e){return t.callWS({type:"ambience/floor/save",floor_id:n,config:e})}async function dt(t){return t.callWS({type:"ambience/house/get"})}async function Sr(t,n){return t.callWS({type:"ambience/house/save",config:n})}async function ut(t){return t.callWS({type:"ambience/matchers/list"})}async function ze(t){return t.callWS({type:"ambience/exposed_actions/list"})}async function Cr(t,n){return t.callWS({type:"ambience/exposed_actions/save",actions:n})}async function Ar(t){return t.callWS({type:"ambience/services/list"})}async function ct(t,n){return t.callWS({type:"ambience/services/get_schema",service:n})}async function ht(t){return t.callWS({type:"ambience/time_of_day_periods/list"})}async function Lr(t,n,e){return t.callWS({type:"ambience/time_of_day_periods/save",custom:n,hidden:e})}async function pt(t){return t.callWS({type:"ambience/matchers/day/config/list"})}async function Tr(t,n,e){return t.callWS({type:"ambience/matchers/day/config/save",workday_sensor:n,workday_calendar:e})}async function mt(t){return t.callWS({type:"ambience/matchers/weather/config/list"})}async function Fr(t,n,e){return t.callWS({type:"ambience/matchers/weather/config/save",entity:n,groups:e})}async function Hr(t,n){return t.callWS({type:"ambience/state/known_states",entity_id:n})}async function Dr(t){return t.callWS({type:"ambience/switch_defaults/list"})}async function jt(t,n,e){return t.callWS({type:"ambience/switch_defaults/save",name:n,auto_on_delay_seconds:e})}async function Pr(t,n,e){return t.callWS({type:"ambience/house/switch/save",name:n,auto_on_delay_seconds:e})}async function Or(t,n,e,r){return t.callWS({type:"ambience/floor/switch/save",floor_id:n,name:e,auto_on_delay_seconds:r})}async function Nr(t,n,e,r){return t.callWS({type:"ambience/area/switch/save",area_id:n,name:e,auto_on_delay_seconds:r})}function ft(t,n="New rule"){return t.name&&t.name.trim()?t.name:n}function gt(t,n,e){return n==null?u(e.hass,"ui.summary_any_paren","(any)"):t==="time_of_day"?_t(n,e):t==="day"?gn(n,e):t==="weather"?bn(n,e):t==="state"?Ut(n,e):t==="script"?fn(n,e):String(n)}function fn(t,n={}){if(t===null)return u(n.hass,"ui.summary_any_paren","(any)");if(typeof t!="object"||t===null||typeof t.script!="string")return String(t);let e=t.args??{},r=Object.keys(e).sort();if(r.length===0)return t.script;let i=r.map(s=>`${s}=${e[s]}`).join(", ");return`${t.script}(${i})`}function gn(t,n={}){if(t===null)return u(n.hass,"day_summary.any","any");let e=t.include??[],r=t.exclude??[],i=e.length===0?u(n.hass,"day_summary.any_day","any day"):e.map(a=>Ir(a,n)).join(", ");if(r.length===0)return i;let s=u(n.hass,"day_summary.except","except");return`${i} (${s} ${r.map(a=>Ir(a,n)).join(", ")})`}function Ir(t,n){switch(t.kind){case"weekday":return t.days.map(e=>rt(n.hass,e)).join("/");case"day_of_month":return`${u(n.hass,"day_summary.day_prefix","day")} ${t.days}`;case"date":return`${Se(n.hass,t.month)} ${t.day}`;case"date_range":return`${Se(n.hass,t.from.month)} ${t.from.day} \u2192 ${Se(n.hass,t.to.month)} ${t.to.day}`;case"last_day":return u(n.hass,"day_summary.last_day","last day");case"workday":return u(n.hass,"day_summary.workday","workday");case"holiday":return u(n.hass,"day_summary.holiday","holiday");case"first_workday":return u(n.hass,"day_summary.first_workday","first workday");case"last_workday":return u(n.hass,"day_summary.last_workday","last workday")}}var _n={"<":"<","<=":"\u2264",">":">",">=":"\u2265"};function vn(t){let n=t.replaceAll("_"," ").toLowerCase();return n.charAt(0).toUpperCase()+n.slice(1)}function yn(t){return t.split(/[\s_-]+/).filter(n=>n!=="").map(n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()).join(" ")}function bn(t,n={}){if(t===null)return u(n.hass,"ui.summary_any","any");let e=new Map((n.weatherGroups??[]).map(a=>[a.id,a.label])),r=(t.groups??[]).map(a=>e.get(a)??yn(a)).join("/"),i=(t.thresholds??[]).map(a=>`${je(n.hass,a.attribute)} ${_n[a.op]??a.op} ${a.value}`).join(", "),s=[r,i].filter(a=>a!=="");return s.length===0?u(n.hass,"ui.summary_any","any"):s.join(", ")}function $n(t,n){let r=t.hass?.states?.[n]?.attributes?.friendly_name;return typeof r=="string"&&r?r:n}function Ut(t,n={}){return t==null?u(n.hass,"ui.summary_any","any"):zt(t,n)}function zt(t,n){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<="){let e=G(n.hass,t.kind),i=t.kind!=="is"&&t.kind!=="is_not"?t.states[0]??"":t.states.join("/"),s=$n(n,t.entity_id),o=`${t.attribute?`${s}.${t.attribute}`:s} ${e} ${i}`;return t.for&&xn(t.for)?`${o} ${u(n.hass,"ui.for_prefix","for")} \u2265${wn(t.for)}`:o}if(t.kind==="and"||t.kind==="or"){let e=` ${G(n.hass,t.kind)} `;return t.items.map(r=>Mr(r,n)).join(e)}return t.kind==="not"?`${G(n.hass,"not")} ${Mr(t.item,n)}`:""}function Mr(t,n){return t.kind==="and"||t.kind==="or"?`(${zt(t,n)})`:zt(t,n)}function xn(t){return t.h>0||t.m>0||t.s>0}function wn(t){let n=[];return t.h&&n.push(`${t.h}h`),t.m&&n.push(`${t.m}m`),t.s&&n.push(`${t.s}s`),n.length?n.join(" "):"0s"}function _t(t,n){if(t===null)return u(n.hass,"ui.summary_any","any");let e=Array.isArray(t)?t:[t],r=n.periods?.custom??{};return e.map(i=>"period"in i?_e(n.hass,i.period,r):`${Rr(i.from,n)} \u2192 ${Rr(i.to,n)}`).join(", ")}function Rr(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=Ee(n.hass,t.anchor);if(t.offset_min===0)return e;let r=Math.abs(t.offset_min),i=r%60===0?`${r/60}${u(n.hass,"ui.unit_hour_abbr","h")}`:`${r}${u(n.hass,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${i}`}function kn(t,n){let e=n.exposedActions?.find(r=>r.id===t.service);return e?.label&&e.label.trim()?e.label:tt(n.hass,t.service)}function En(t,n){let e=t.service.indexOf(".");return e>0?t.service.slice(0,e):u(n.hass,"ui.target_noun","target")}function jr(t,n){let e=kn(t,n),r=En(t,n),i=t.entity_ids.length,s;i===0?s=u(n.hass,"ui.no_targets","(no targets)"):i===1?s=`1 ${r}`:s=`${i} ${r}s`;let a=Object.entries(t.params).filter(([,o])=>o!=null&&o!=="").map(([o,d])=>`${vn(o)} ${d}`).join(", ");return a?`${e}: ${s}, ${a}`:`${e}: ${s}`}var N=class extends y{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this.availableActions=[];this._dragFrom=null;this._dragOver=null;this._expandedActions=new Set}_emit(e,r){this.dispatchEvent(new CustomEvent(e,{detail:r,bubbles:!0,composed:!0}))}_whenSummary(e){let r=new Map((this.matchers??[]).map(s=>[s.name,s.priority])),i=Object.keys(e.when).filter(s=>e.when[s]!=null).sort((s,a)=>(r.get(s)??1/0)-(r.get(a)??1/0));return i.length===0?u(this.hass,"ui.summary_any","any"):i.map(s=>`${oe(this.hass,s)}: ${gt(s,e.when[s],{hass:this.hass,periods:this.periods,weatherGroups:this.weatherConfig?.groups})}`).join(", ")}_actionCountLabel(e){let r=e.actions.length,i=r===1?u(this.hass,"ui.action_singular","action"):u(this.hass,"ui.action_plural","actions");return`${r} ${i}`}_toggleActions(e){let r=new Set(this._expandedActions);r.has(e)?r.delete(e):r.add(e),this._expandedActions=r}_entityName(e){let i=this.hass?.states?.[e]?.attributes?.friendly_name;return typeof i=="string"&&i?i:e}_actionParamsString(e){return Object.entries(e.params).filter(([,r])=>r!=null&&r!=="").map(([r,i])=>`${r} ${i}`).join(", ")}_actionLabel(e){let r=this.availableActions.find(i=>i.id===e.service);return r?.label&&r.label.trim()?r.label:tt(this.hass,e.service)}_onDragStart(e){this._dragFrom=e}_onDragOver(e,r){this._dragFrom===null||r===this._dragFrom||(e.preventDefault(),this._dragOver=r)}_onDrop(e){let r=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(r===null||r===e)&&this._emit("reorder-rules",{from:r,to:e})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(e,r){let i=r.name||u(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(e+1));window.confirm(u(this.hass,"ui.confirm_delete",'Delete "{name}"?').replace("{name}",i))&&this._emit("delete-rule",{index:e})}render(){return this.rules.length===0?l`
        <p class="empty">${u(this.hass,"ui.no_rules_yet","No rules yet.")}</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          ${u(this.hass,"ui.add_rule","+ Add rule")}
        </button>
      `:l`
      <ul>
        ${this.rules.map((e,r)=>l`
            <li
              class=${this._dragOver===r?"drag-over":""}
              draggable=${!this.autoSort}
              @dragstart=${()=>this._onDragStart(r)}
              @dragover=${i=>this._onDragOver(i,r)}
              @drop=${()=>this._onDrop(r)}
              @dragend=${this._onDragEnd}
            >
              ${this.autoSort?"":l`<span class="handle" title=${u(this.hass,"ui.drag_to_reorder","Drag to reorder")}>⠿</span>`}
              <span class="idx">${r+1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${()=>this._emit("edit-rule",{index:r})}
                >
                  ${ft(e,u(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(r+1)))}
                </div>
                <div class="summary">
                  ${this._whenSummary(e)} ·
                  <span
                    class="action-count"
                    @click=${()=>this._toggleActions(r)}
                  >${this._actionCountLabel(e)}</span>
                </div>
                ${this._expandedActions.has(r)?l`
                      <div class="actions-detail">
                        ${e.actions.map(i=>{let s=this._actionParamsString(i),a=this._actionLabel(i),o=s?`${a} \xB7 ${s}`:a;return l`
                            <div class="actions-detail-item">
                              <div class="action-header">${o}</div>
                              ${i.entity_ids.length===0?l`<div class="no-targets">${u(this.hass,"ui.no_targets","(no targets)")}</div>`:l`<ul class="entity-list">
                                    ${i.entity_ids.map(d=>l`<li>${this._entityName(d)}</li>`)}
                                  </ul>`}
                            </div>
                          `})}
                      </div>
                    `:""}
              </div>
              <button
                @click=${()=>this._emit("duplicate-rule",{index:r})}
                title=${u(this.hass,"ui.duplicate","Duplicate")}
              >
                ⧉
              </button>
              <button
                @click=${()=>this._confirmDelete(r,e)}
                title=${u(this.hass,"ui.title_delete","Delete")}
              >
                🗑
              </button>
            </li>
          `)}
      </ul>
      <button class="add" @click=${()=>this._emit("add-rule",{})}>
        ${u(this.hass,"ui.add_rule","+ Add rule")}
      </button>
    `}};N.styles=$`
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
    .action-count {
      cursor: pointer;
    }
    .action-count:hover {
      text-decoration: underline;
    }
    .actions-detail {
      margin-top: 0.25rem;
      padding-left: 0.75rem;
      border-left: 2px solid var(--divider-color, #e0e0e0);
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .actions-detail-item {
      padding: 0.15rem 0;
    }
    .actions-detail-item .action-header {
      color: var(--primary-text-color, #212121);
    }
    .entity-list {
      list-style: disc;
      padding-left: 1.25rem;
      margin: 0.1rem 0 0.25rem 0;
    }
    .entity-list li {
      padding: 0;
      margin: 0;
      border: 0;
      background: transparent;
      display: list-item;
    }
    .no-targets {
      font-style: italic;
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
  `,c([m({attribute:!1})],N.prototype,"rules",2),c([m({type:Boolean})],N.prototype,"autoSort",2),c([m({attribute:!1})],N.prototype,"periods",2),c([m({attribute:!1})],N.prototype,"weatherConfig",2),c([m({attribute:!1})],N.prototype,"hass",2),c([m({attribute:!1})],N.prototype,"matchers",2),c([m({attribute:!1})],N.prototype,"availableActions",2),c([g()],N.prototype,"_dragFrom",2),c([g()],N.prototype,"_dragOver",2),c([g()],N.prototype,"_expandedActions",2),N=c([x("ambience-rules-list")],N);function zr(t,n){if(!n||n.entity==null)return[...t];let e=Array.isArray(n.entity)?n.entity:[n.entity];if(e.length===0)return[...t];let r=new Set,i=!1;for(let s of e){if(!s||typeof s!="object")continue;let a=s.domain;if(a==null){i=!0;continue}if(Array.isArray(a))for(let o of a)typeof o=="string"&&r.add(o);else typeof a=="string"&&r.add(a)}return i||r.size===0?[...t]:t.filter(s=>{let a=s.indexOf(".");return a<0?!1:r.has(s.slice(0,a))})}function Ur(t,n,e=[]){let r=t;if(!r?.entities)return[];let i=r.entities,s=r.devices??{},a=r.areas??{},o=n.kind==="area"?new Set([n.id]):n.kind==="floor"?new Set(Object.values(a).filter(h=>h.floor_id===n.id).map(h=>h.area_id)):null,d=h=>{let f=h.area_id??(h.device_id?s[h.device_id]?.area_id??null:null);return f==null?!1:o===null?!0:o.has(f)};return Object.values(i).filter(d).filter(h=>e.length===0||e.includes(h.entity_id.split(".")[0])).map(h=>h.entity_id).sort()}var q=class extends y{constructor(){super(...arguments);this.entities=[];this.value=[];this.target=null;this.label=" "}_filteredEntities(){return zr(this.entities,this.target)}connectedCallback(){super.connectedCallback(),Y(this,this.hass)}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let r=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this._filteredEntities()}}}],i=this.label;return l`
      <ha-form
        .hass=${this.hass}
        .schema=${r}
        .data=${{entity_ids:this.value}}
        .computeLabel=${()=>i}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,r){let i=new Set(this.value);r?i.add(e):i.delete(e),this._emit(this._filteredEntities().filter(s=>i.has(s)))}_renderFallback(){let e=this._filteredEntities();return e.length===0?l`<p class="empty">${u(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:l`
      <div class="checkboxes">
        ${e.map(r=>l`
            <label>
              <input
                type="checkbox"
                .checked=${this.value.includes(r)}
                @change=${i=>this._toggle(r,i.target.checked)}
              />
              ${r}
            </label>
          `)}
      </div>
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};q.styles=$`
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
  `,c([m({attribute:!1})],q.prototype,"hass",2),c([m({attribute:!1})],q.prototype,"entities",2),c([m({attribute:!1})],q.prototype,"value",2),c([m({attribute:!1})],q.prototype,"target",2),c([m()],q.prototype,"label",2),q=c([x("ambience-target-picker")],q);function Sn(t){if(!t?.selector||typeof t.selector!="object")return;let n=t.selector;if("color_rgb"in n)return t.default??[255,255,255];if("color_rgbw"in n)return t.default??[255,255,255,0];if("color_rgbww"in n)return t.default??[255,255,255,0,0]}var I=class extends y{constructor(){super(...arguments);this.entityIds=[];this.params={};this._schema=void 0;this._schemaError=null;this._exposedMissing=!1;this._formSchema=[];this._schemaServiceId=null;this._onTargetChanged=e=>{e.stopPropagation(),this._emit("entity-ids-changed",{entityIds:e.detail.value})};this._onFieldInput=e=>r=>{r.stopPropagation();let i=r.target,s={...this.params,[e]:i.value};this._emit("params-changed",{params:s})};this._onHaFormChanged=e=>{e.stopPropagation(),this._emit("params-changed",{params:{...this.params,...e.detail.value}})}}connectedCallback(){super.connectedCallback(),Y(this,this.hass)}willUpdate(e){(e.has("exposed")&&e.get("exposed")?.id!==this.exposed?.id||e.has("hass")&&this._schema===void 0)&&this._loadSchema(),(e.has("exposed")||e.has("_schema"))&&(this._formSchema=this._buildFormSchema())}async _loadSchema(){if(this.exposed===void 0&&this.hass){this._exposedMissing=!0,this._schema=null,this._schemaServiceId=null;return}let e=this.exposed?.id;if(!e||!this.hass){this._exposedMissing=!1,this._schema=void 0,this._schemaServiceId=null;return}this._exposedMissing=!1,this._schemaServiceId=e,this._schemaError=null,this._schema=void 0;try{let r=await ct(this.hass,e);if(this._schemaServiceId!==e)return;this._schema=r}catch(r){if(this._schemaServiceId!==e)return;this._schema=null,this._schemaError=r instanceof Error?r.message:String(r)}}_buildFormSchema(){let e=this._schema,r=this.exposed;if(!e||!r)return[];let i=[];for(let s of r.visible_fields??[]){let a=e.fields[s];a&&i.push({name:s,selector:a.selector??{text:{}},required:!!a.required,description:typeof a.description=="string"&&a.description?a.description:void 0})}return i}updated(e){super.updated?.(e),e.has("_schema")&&this.dispatchEvent(new CustomEvent("target-mode-changed",{detail:{hasTarget:this.hasTarget()},bubbles:!0,composed:!0}))}_hasTarget(){let e=this._schema?.target??null;return!e||typeof e!="object"?!1:Object.keys(e).length>0}hasTarget(){return this._schema===void 0?!1:this._hasTarget()}_scopeEntities(){return!this.scope||!this.hass?[]:Ur(this.hass,this.scope,[])}_renderTargetPicker(){if(!this._hasTarget())return"";let e=this._scopeEntities(),r=this._schema?.target??null,i=u(this.hass,"ui.target","Target");return l`
      <div class="target-picker">
        <ambience-target-picker
          .hass=${this.hass}
          .entities=${e}
          .target=${r}
          .value=${this.entityIds}
          .label=${i}
          @value-changed=${this._onTargetChanged}
        ></ambience-target-picker>
      </div>
    `}_humanizeFieldLabel(e){let r=this._schema?.fields[e];if(r?.name)return r.name;let i=e.replaceAll("_"," ").toLowerCase();return i.charAt(0).toUpperCase()+i.slice(1)}_fieldLabel(e){return this._humanizeFieldLabel(e)}_renderFieldsForm(){let e=this._formSchema;if(e.length===0)return"";let r={};for(let i of e){if(i.name in this.params){r[i.name]=this.params[i.name];continue}let s=this._schema?.fields[i.name],a=Sn(s);a!==void 0&&(r[i.name]=a)}return customElements.get("ha-form")?l`
        <div class="fields-form">
          <ha-form
            .hass=${this.hass}
            .schema=${e}
            .data=${r}
            .computeLabel=${i=>this._humanizeFieldLabel(i.name)}
            @value-changed=${this._onHaFormChanged}
          ></ha-form>
        </div>
      `:l`
      <div class="fields-form">
        ${e.map(i=>l`
            <div class="field-row">
              <label>${this._fieldLabel(i.name)}${i.required?" *":""}</label>
              <input
                type="text"
                data-field=${i.name}
                .value=${String(this.params[i.name]??"")}
                @input=${this._onFieldInput(i.name)}
              />
            </div>
          `)}
      </div>
    `}_emit(e,r){this.dispatchEvent(new CustomEvent(e,{detail:r,bubbles:!0,composed:!0}))}render(){if(this._schema===null)return this._exposedMissing?l`
          <div class="schema-error">
            ${u(this.hass,"ui.service_not_exposed","Service no longer exposed; configure it in Settings \u2192 Actions or remove this action.")}
          </div>
        `:l`
        <div class="schema-error">
          ${this._schemaError??u(this.hass,"ui.service_unavailable","Service not available in this HA instance.")}
        </div>
      `;if(this._schema===void 0)return l`<div>${u(this.hass,"ui.loading","Loading\u2026")}</div>`;let e=this._renderTargetPicker(),r=this._renderFieldsForm();return e===""&&r===""?l`<div class="no-params">${u(this.hass,"ui.action_no_parameters","This action has no configurable fields.")}</div>`:l`${e}${r}`}};I.styles=$`
    :host { display: block; }
    label {
      display: block; font-weight: 600; margin: 0.5rem 0 0.25rem 0;
    }
    .target-picker, .fields-form {
      margin-top: 0.5rem;
    }
    .no-params {
      color: var(--secondary-text-color, #888);
      font-style: italic;
      padding: 0.5rem 0;
    }
    .schema-error {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      padding: 0.3rem 0;
    }
    input {
      width: 100%; box-sizing: border-box; padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
      font: inherit;
    }
    .field-row {
      margin-bottom: 0.5rem;
    }
  `,c([m({attribute:!1})],I.prototype,"hass",2),c([m({attribute:!1})],I.prototype,"scope",2),c([m({attribute:!1})],I.prototype,"exposed",2),c([m({attribute:!1})],I.prototype,"entityIds",2),c([m({attribute:!1})],I.prototype,"params",2),c([g()],I.prototype,"_schema",2),c([g()],I.prototype,"_schemaError",2),c([g()],I.prototype,"_exposedMissing",2),c([g()],I.prototype,"_formSchema",2),I=c([x("ambience-action-slot")],I);var K=class extends y{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=e=>{this._open&&(e.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=e=>{e.stopPropagation();let r=e.detail.value?.scene??"";this._emit(r.trim()===""?null:r)};this._sceneComputeLabel=e=>e.name==="scene"?u(this.hass,"ui.scene_name","Scene name"):e.name}connectedCallback(){super.connectedCallback(),Y(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(e){e.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(r=>({value:r,label:r})),custom_value:!0,mode:"dropdown"}}}])}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onInput(e){let r=e.target.value;this._emit(r.trim()===""?null:r),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(e){e.key==="Escape"&&this._open&&(this._open=!1,e.stopPropagation())}_toggle(e){e.preventDefault(),this._open=!this._open}_select(e,r){r.preventDefault(),this._emit(e),this._open=!1}render(){if(customElements.get("ha-form")){let e={scene:this.value??""};return l`
        <ha-form
          .hass=${this.hass}
          .schema=${this._schema}
          .data=${e}
          .computeLabel=${this._sceneComputeLabel}
          @value-changed=${this._onHaFormValueChanged}
        ></ha-form>
      `}return l`
      <div class="control">
        <input
          type="text"
          placeholder=${u(this.hass,"ui.scene_name","Scene name")}
          .value=${this.value??""}
          @input=${this._onInput}
          @focus=${this._onFocus}
          @keydown=${this._onKeyDown}
        />
        <button
          class="toggle"
          type="button"
          tabindex="-1"
          aria-label=${u(this.hass,"ui.show_scene_suggestions","Show scene suggestions")}
          @mousedown=${this._toggle}
        >
          ▼
        </button>
      </div>
      ${this._open?l`
            <div class="menu" role="listbox">
              ${this.suggestions.length===0?l`<div class="empty">
                    ${u(this.hass,"ui.no_scenes_yet","No scenes yet \u2014 type to create one")}
                  </div>`:this.suggestions.map(e=>l`
                      <div
                        class="item ${e===this.value?"selected":""}"
                        role="option"
                        @mousedown=${r=>this._select(e,r)}
                      >
                        ${e}
                      </div>
                    `)}
            </div>
          `:""}
    `}};K.styles=$`
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
  `,c([m({attribute:!1})],K.prototype,"hass",2),c([m()],K.prototype,"value",2),c([m({attribute:!1})],K.prototype,"suggestions",2),c([g()],K.prototype,"_schema",2),c([g()],K.prototype,"_open",2),K=c([x("ambience-scene-combobox")],K);function ni(t){return typeof t>"u"||t===null}function Cn(t){return typeof t=="object"&&t!==null}function An(t){return Array.isArray(t)?t:ni(t)?[]:[t]}function Ln(t,n){var e,r,i,s;if(n)for(s=Object.keys(n),e=0,r=s.length;e<r;e+=1)i=s[e],t[i]=n[i];return t}function Tn(t,n){var e="",r;for(r=0;r<n;r+=1)e+=t;return e}function Fn(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var Hn=ni,Dn=Cn,Pn=An,On=Tn,Nn=Fn,In=Ln,L={isNothing:Hn,isObject:Dn,toArray:Pn,repeat:On,isNegativeZero:Nn,extend:In};function si(t,n){var e="",r=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(e+='in "'+t.mark.name+'" '),e+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!n&&t.mark.snippet&&(e+=`

`+t.mark.snippet),r+" "+e):r}function We(t,n){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=n,this.message=si(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}We.prototype=Object.create(Error.prototype);We.prototype.constructor=We;We.prototype.toString=function(n){return this.name+": "+si(this,n)};var M=We;function Wt(t,n,e,r,i){var s="",a="",o=Math.floor(i/2)-1;return r-n>o&&(s=" ... ",n=r-o+s.length),e-r>o&&(a=" ...",e=r+o-a.length),{str:s+t.slice(n,e).replace(/\t/g,"\u2192")+a,pos:r-n+s.length}}function Bt(t,n){return L.repeat(" ",n-t.length)+t}function Mn(t,n){if(n=Object.create(n||null),!t.buffer)return null;n.maxLength||(n.maxLength=79),typeof n.indent!="number"&&(n.indent=1),typeof n.linesBefore!="number"&&(n.linesBefore=3),typeof n.linesAfter!="number"&&(n.linesAfter=2);for(var e=/\r?\n|\r|\0/g,r=[0],i=[],s,a=-1;s=e.exec(t.buffer);)i.push(s.index),r.push(s.index+s[0].length),t.position<=s.index&&a<0&&(a=r.length-2);a<0&&(a=r.length-1);var o="",d,h,f=Math.min(t.line+n.linesAfter,i.length).toString().length,p=n.maxLength-(n.indent+f+3);for(d=1;d<=n.linesBefore&&!(a-d<0);d++)h=Wt(t.buffer,r[a-d],i[a-d],t.position-(r[a]-r[a-d]),p),o=L.repeat(" ",n.indent)+Bt((t.line-d+1).toString(),f)+" | "+h.str+`
`+o;for(h=Wt(t.buffer,r[a],i[a],t.position,p),o+=L.repeat(" ",n.indent)+Bt((t.line+1).toString(),f)+" | "+h.str+`
`,o+=L.repeat("-",n.indent+f+3+h.pos)+`^
`,d=1;d<=n.linesAfter&&!(a+d>=i.length);d++)h=Wt(t.buffer,r[a+d],i[a+d],t.position-(r[a]-r[a+d]),p),o+=L.repeat(" ",n.indent)+Bt((t.line+d+1).toString(),f)+" | "+h.str+`
`;return o.replace(/\n$/,"")}var Rn=Mn,jn=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],zn=["scalar","sequence","mapping"];function Un(t){var n={};return t!==null&&Object.keys(t).forEach(function(e){t[e].forEach(function(r){n[String(r)]=e})}),n}function Wn(t,n){if(n=n||{},Object.keys(n).forEach(function(e){if(jn.indexOf(e)===-1)throw new M('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.options=n,this.tag=t,this.kind=n.kind||null,this.resolve=n.resolve||function(){return!0},this.construct=n.construct||function(e){return e},this.instanceOf=n.instanceOf||null,this.predicate=n.predicate||null,this.represent=n.represent||null,this.representName=n.representName||null,this.defaultStyle=n.defaultStyle||null,this.multi=n.multi||!1,this.styleAliases=Un(n.styleAliases||null),zn.indexOf(this.kind)===-1)throw new M('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var P=Wn;function Wr(t,n){var e=[];return t[n].forEach(function(r){var i=e.length;e.forEach(function(s,a){s.tag===r.tag&&s.kind===r.kind&&s.multi===r.multi&&(i=a)}),e[i]=r}),e}function Bn(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},n,e;function r(i){i.multi?(t.multi[i.kind].push(i),t.multi.fallback.push(i)):t[i.kind][i.tag]=t.fallback[i.tag]=i}for(n=0,e=arguments.length;n<e;n+=1)arguments[n].forEach(r);return t}function Yt(t){return this.extend(t)}Yt.prototype.extend=function(n){var e=[],r=[];if(n instanceof P)r.push(n);else if(Array.isArray(n))r=r.concat(n);else if(n&&(Array.isArray(n.implicit)||Array.isArray(n.explicit)))n.implicit&&(e=e.concat(n.implicit)),n.explicit&&(r=r.concat(n.explicit));else throw new M("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.forEach(function(s){if(!(s instanceof P))throw new M("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new M("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new M("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),r.forEach(function(s){if(!(s instanceof P))throw new M("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var i=Object.create(Yt.prototype);return i.implicit=(this.implicit||[]).concat(e),i.explicit=(this.explicit||[]).concat(r),i.compiledImplicit=Wr(i,"implicit"),i.compiledExplicit=Wr(i,"explicit"),i.compiledTypeMap=Bn(i.compiledImplicit,i.compiledExplicit),i};var Gn=Yt,Yn=new P("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),qn=new P("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),Kn=new P("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),Vn=new Gn({explicit:[Yn,qn,Kn]});function Jn(t){if(t===null)return!0;var n=t.length;return n===1&&t==="~"||n===4&&(t==="null"||t==="Null"||t==="NULL")}function Qn(){return null}function Xn(t){return t===null}var Zn=new P("tag:yaml.org,2002:null",{kind:"scalar",resolve:Jn,construct:Qn,predicate:Xn,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function es(t){if(t===null)return!1;var n=t.length;return n===4&&(t==="true"||t==="True"||t==="TRUE")||n===5&&(t==="false"||t==="False"||t==="FALSE")}function ts(t){return t==="true"||t==="True"||t==="TRUE"}function rs(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var is=new P("tag:yaml.org,2002:bool",{kind:"scalar",resolve:es,construct:ts,predicate:rs,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function ns(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function ss(t){return 48<=t&&t<=55}function as(t){return 48<=t&&t<=57}function os(t){if(t===null)return!1;var n=t.length,e=0,r=!1,i;if(!n)return!1;if(i=t[e],(i==="-"||i==="+")&&(i=t[++e]),i==="0"){if(e+1===n)return!0;if(i=t[++e],i==="b"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(i!=="0"&&i!=="1")return!1;r=!0}return r&&i!=="_"}if(i==="x"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(!ns(t.charCodeAt(e)))return!1;r=!0}return r&&i!=="_"}if(i==="o"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(!ss(t.charCodeAt(e)))return!1;r=!0}return r&&i!=="_"}}if(i==="_")return!1;for(;e<n;e++)if(i=t[e],i!=="_"){if(!as(t.charCodeAt(e)))return!1;r=!0}return!(!r||i==="_")}function ls(t){var n=t,e=1,r;if(n.indexOf("_")!==-1&&(n=n.replace(/_/g,"")),r=n[0],(r==="-"||r==="+")&&(r==="-"&&(e=-1),n=n.slice(1),r=n[0]),n==="0")return 0;if(r==="0"){if(n[1]==="b")return e*parseInt(n.slice(2),2);if(n[1]==="x")return e*parseInt(n.slice(2),16);if(n[1]==="o")return e*parseInt(n.slice(2),8)}return e*parseInt(n,10)}function ds(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!L.isNegativeZero(t)}var us=new P("tag:yaml.org,2002:int",{kind:"scalar",resolve:os,construct:ls,predicate:ds,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),cs=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function hs(t){return!(t===null||!cs.test(t)||t[t.length-1]==="_")}function ps(t){var n,e;return n=t.replace(/_/g,"").toLowerCase(),e=n[0]==="-"?-1:1,"+-".indexOf(n[0])>=0&&(n=n.slice(1)),n===".inf"?e===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:n===".nan"?NaN:e*parseFloat(n,10)}var ms=/^[-+]?[0-9]+e/;function fs(t,n){var e;if(isNaN(t))switch(n){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(n){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(n){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(L.isNegativeZero(t))return"-0.0";return e=t.toString(10),ms.test(e)?e.replace("e",".e"):e}function gs(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||L.isNegativeZero(t))}var _s=new P("tag:yaml.org,2002:float",{kind:"scalar",resolve:hs,construct:ps,predicate:gs,represent:fs,defaultStyle:"lowercase"}),vs=Vn.extend({implicit:[Zn,is,us,_s]}),ys=vs,ai=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),oi=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function bs(t){return t===null?!1:ai.exec(t)!==null||oi.exec(t)!==null}function $s(t){var n,e,r,i,s,a,o,d=0,h=null,f,p,_;if(n=ai.exec(t),n===null&&(n=oi.exec(t)),n===null)throw new Error("Date resolve error");if(e=+n[1],r=+n[2]-1,i=+n[3],!n[4])return new Date(Date.UTC(e,r,i));if(s=+n[4],a=+n[5],o=+n[6],n[7]){for(d=n[7].slice(0,3);d.length<3;)d+="0";d=+d}return n[9]&&(f=+n[10],p=+(n[11]||0),h=(f*60+p)*6e4,n[9]==="-"&&(h=-h)),_=new Date(Date.UTC(e,r,i,s,a,o,d)),h&&_.setTime(_.getTime()-h),_}function xs(t){return t.toISOString()}var ws=new P("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:bs,construct:$s,instanceOf:Date,represent:xs});function ks(t){return t==="<<"||t===null}var Es=new P("tag:yaml.org,2002:merge",{kind:"scalar",resolve:ks}),Qt=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function Ss(t){if(t===null)return!1;var n,e,r=0,i=t.length,s=Qt;for(e=0;e<i;e++)if(n=s.indexOf(t.charAt(e)),!(n>64)){if(n<0)return!1;r+=6}return r%8===0}function Cs(t){var n,e,r=t.replace(/[\r\n=]/g,""),i=r.length,s=Qt,a=0,o=[];for(n=0;n<i;n++)n%4===0&&n&&(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)),a=a<<6|s.indexOf(r.charAt(n));return e=i%4*6,e===0?(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)):e===18?(o.push(a>>10&255),o.push(a>>2&255)):e===12&&o.push(a>>4&255),new Uint8Array(o)}function As(t){var n="",e=0,r,i,s=t.length,a=Qt;for(r=0;r<s;r++)r%3===0&&r&&(n+=a[e>>18&63],n+=a[e>>12&63],n+=a[e>>6&63],n+=a[e&63]),e=(e<<8)+t[r];return i=s%3,i===0?(n+=a[e>>18&63],n+=a[e>>12&63],n+=a[e>>6&63],n+=a[e&63]):i===2?(n+=a[e>>10&63],n+=a[e>>4&63],n+=a[e<<2&63],n+=a[64]):i===1&&(n+=a[e>>2&63],n+=a[e<<4&63],n+=a[64],n+=a[64]),n}function Ls(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var Ts=new P("tag:yaml.org,2002:binary",{kind:"scalar",resolve:Ss,construct:Cs,predicate:Ls,represent:As}),Fs=Object.prototype.hasOwnProperty,Hs=Object.prototype.toString;function Ds(t){if(t===null)return!0;var n=[],e,r,i,s,a,o=t;for(e=0,r=o.length;e<r;e+=1){if(i=o[e],a=!1,Hs.call(i)!=="[object Object]")return!1;for(s in i)if(Fs.call(i,s))if(!a)a=!0;else return!1;if(!a)return!1;if(n.indexOf(s)===-1)n.push(s);else return!1}return!0}function Ps(t){return t!==null?t:[]}var Os=new P("tag:yaml.org,2002:omap",{kind:"sequence",resolve:Ds,construct:Ps}),Ns=Object.prototype.toString;function Is(t){if(t===null)return!0;var n,e,r,i,s,a=t;for(s=new Array(a.length),n=0,e=a.length;n<e;n+=1){if(r=a[n],Ns.call(r)!=="[object Object]"||(i=Object.keys(r),i.length!==1))return!1;s[n]=[i[0],r[i[0]]]}return!0}function Ms(t){if(t===null)return[];var n,e,r,i,s,a=t;for(s=new Array(a.length),n=0,e=a.length;n<e;n+=1)r=a[n],i=Object.keys(r),s[n]=[i[0],r[i[0]]];return s}var Rs=new P("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:Is,construct:Ms}),js=Object.prototype.hasOwnProperty;function zs(t){if(t===null)return!0;var n,e=t;for(n in e)if(js.call(e,n)&&e[n]!==null)return!1;return!0}function Us(t){return t!==null?t:{}}var Ws=new P("tag:yaml.org,2002:set",{kind:"mapping",resolve:zs,construct:Us}),li=ys.extend({implicit:[ws,Es],explicit:[Ts,Os,Rs,Ws]}),de=Object.prototype.hasOwnProperty,vt=1,di=2,ui=3,yt=4,Gt=1,Bs=2,Br=3,Gs=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Ys=/[\x85\u2028\u2029]/,qs=/[,\[\]\{\}]/,ci=/^(?:!|!!|![a-z\-]+!)$/i,hi=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Gr(t){return Object.prototype.toString.call(t)}function V(t){return t===10||t===13}function ye(t){return t===9||t===32}function R(t){return t===9||t===32||t===10||t===13}function Ae(t){return t===44||t===91||t===93||t===123||t===125}function Ks(t){var n;return 48<=t&&t<=57?t-48:(n=t|32,97<=n&&n<=102?n-97+10:-1)}function Vs(t){return t===120?2:t===117?4:t===85?8:0}function Js(t){return 48<=t&&t<=57?t-48:-1}function Yr(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"\x85":t===95?"\xA0":t===76?"\u2028":t===80?"\u2029":""}function Qs(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function pi(t,n,e){n==="__proto__"?Object.defineProperty(t,n,{configurable:!0,enumerable:!0,writable:!0,value:e}):t[n]=e}var mi=new Array(256),fi=new Array(256);for(ve=0;ve<256;ve++)mi[ve]=Yr(ve)?1:0,fi[ve]=Yr(ve);var ve;function Xs(t,n){this.input=t,this.filename=n.filename||null,this.schema=n.schema||li,this.onWarning=n.onWarning||null,this.legacy=n.legacy||!1,this.json=n.json||!1,this.listener=n.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function gi(t,n){var e={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return e.snippet=Rn(e),new M(n,e)}function b(t,n){throw gi(t,n)}function bt(t,n){t.onWarning&&t.onWarning.call(null,gi(t,n))}var qr={YAML:function(n,e,r){var i,s,a;n.version!==null&&b(n,"duplication of %YAML directive"),r.length!==1&&b(n,"YAML directive accepts exactly one argument"),i=/^([0-9]+)\.([0-9]+)$/.exec(r[0]),i===null&&b(n,"ill-formed argument of the YAML directive"),s=parseInt(i[1],10),a=parseInt(i[2],10),s!==1&&b(n,"unacceptable YAML version of the document"),n.version=r[0],n.checkLineBreaks=a<2,a!==1&&a!==2&&bt(n,"unsupported YAML version of the document")},TAG:function(n,e,r){var i,s;r.length!==2&&b(n,"TAG directive accepts exactly two arguments"),i=r[0],s=r[1],ci.test(i)||b(n,"ill-formed tag handle (first argument) of the TAG directive"),de.call(n.tagMap,i)&&b(n,'there is a previously declared suffix for "'+i+'" tag handle'),hi.test(s)||b(n,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{b(n,"tag prefix is malformed: "+s)}n.tagMap[i]=s}};function le(t,n,e,r){var i,s,a,o;if(n<e){if(o=t.input.slice(n,e),r)for(i=0,s=o.length;i<s;i+=1)a=o.charCodeAt(i),a===9||32<=a&&a<=1114111||b(t,"expected valid JSON character");else Gs.test(o)&&b(t,"the stream contains non-printable characters");t.result+=o}}function Kr(t,n,e,r){var i,s,a,o;for(L.isObject(e)||b(t,"cannot merge mappings; the provided source object is unacceptable"),i=Object.keys(e),a=0,o=i.length;a<o;a+=1)s=i[a],de.call(n,s)||(pi(n,s,e[s]),r[s]=!0)}function Le(t,n,e,r,i,s,a,o,d){var h,f;if(Array.isArray(i))for(i=Array.prototype.slice.call(i),h=0,f=i.length;h<f;h+=1)Array.isArray(i[h])&&b(t,"nested arrays are not supported inside keys"),typeof i=="object"&&Gr(i[h])==="[object Object]"&&(i[h]="[object Object]");if(typeof i=="object"&&Gr(i)==="[object Object]"&&(i="[object Object]"),i=String(i),n===null&&(n={}),r==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(h=0,f=s.length;h<f;h+=1)Kr(t,n,s[h],e);else Kr(t,n,s,e);else!t.json&&!de.call(e,i)&&de.call(n,i)&&(t.line=a||t.line,t.lineStart=o||t.lineStart,t.position=d||t.position,b(t,"duplicated mapping key")),pi(n,i,s),delete e[i];return n}function Xt(t){var n;n=t.input.charCodeAt(t.position),n===10?t.position++:n===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):b(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function A(t,n,e){for(var r=0,i=t.input.charCodeAt(t.position);i!==0;){for(;ye(i);)i===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),i=t.input.charCodeAt(++t.position);if(n&&i===35)do i=t.input.charCodeAt(++t.position);while(i!==10&&i!==13&&i!==0);if(V(i))for(Xt(t),i=t.input.charCodeAt(t.position),r++,t.lineIndent=0;i===32;)t.lineIndent++,i=t.input.charCodeAt(++t.position);else break}return e!==-1&&r!==0&&t.lineIndent<e&&bt(t,"deficient indentation"),r}function wt(t){var n=t.position,e;return e=t.input.charCodeAt(n),!!((e===45||e===46)&&e===t.input.charCodeAt(n+1)&&e===t.input.charCodeAt(n+2)&&(n+=3,e=t.input.charCodeAt(n),e===0||R(e)))}function Zt(t,n){n===1?t.result+=" ":n>1&&(t.result+=L.repeat(`
`,n-1))}function Zs(t,n,e){var r,i,s,a,o,d,h,f,p=t.kind,_=t.result,v;if(v=t.input.charCodeAt(t.position),R(v)||Ae(v)||v===35||v===38||v===42||v===33||v===124||v===62||v===39||v===34||v===37||v===64||v===96||(v===63||v===45)&&(i=t.input.charCodeAt(t.position+1),R(i)||e&&Ae(i)))return!1;for(t.kind="scalar",t.result="",s=a=t.position,o=!1;v!==0;){if(v===58){if(i=t.input.charCodeAt(t.position+1),R(i)||e&&Ae(i))break}else if(v===35){if(r=t.input.charCodeAt(t.position-1),R(r))break}else{if(t.position===t.lineStart&&wt(t)||e&&Ae(v))break;if(V(v))if(d=t.line,h=t.lineStart,f=t.lineIndent,A(t,!1,-1),t.lineIndent>=n){o=!0,v=t.input.charCodeAt(t.position);continue}else{t.position=a,t.line=d,t.lineStart=h,t.lineIndent=f;break}}o&&(le(t,s,a,!1),Zt(t,t.line-d),s=a=t.position,o=!1),ye(v)||(a=t.position+1),v=t.input.charCodeAt(++t.position)}return le(t,s,a,!1),t.result?!0:(t.kind=p,t.result=_,!1)}function ea(t,n){var e,r,i;if(e=t.input.charCodeAt(t.position),e!==39)return!1;for(t.kind="scalar",t.result="",t.position++,r=i=t.position;(e=t.input.charCodeAt(t.position))!==0;)if(e===39)if(le(t,r,t.position,!0),e=t.input.charCodeAt(++t.position),e===39)r=t.position,t.position++,i=t.position;else return!0;else V(e)?(le(t,r,i,!0),Zt(t,A(t,!1,n)),r=i=t.position):t.position===t.lineStart&&wt(t)?b(t,"unexpected end of the document within a single quoted scalar"):(t.position++,i=t.position);b(t,"unexpected end of the stream within a single quoted scalar")}function ta(t,n){var e,r,i,s,a,o;if(o=t.input.charCodeAt(t.position),o!==34)return!1;for(t.kind="scalar",t.result="",t.position++,e=r=t.position;(o=t.input.charCodeAt(t.position))!==0;){if(o===34)return le(t,e,t.position,!0),t.position++,!0;if(o===92){if(le(t,e,t.position,!0),o=t.input.charCodeAt(++t.position),V(o))A(t,!1,n);else if(o<256&&mi[o])t.result+=fi[o],t.position++;else if((a=Vs(o))>0){for(i=a,s=0;i>0;i--)o=t.input.charCodeAt(++t.position),(a=Ks(o))>=0?s=(s<<4)+a:b(t,"expected hexadecimal character");t.result+=Qs(s),t.position++}else b(t,"unknown escape sequence");e=r=t.position}else V(o)?(le(t,e,r,!0),Zt(t,A(t,!1,n)),e=r=t.position):t.position===t.lineStart&&wt(t)?b(t,"unexpected end of the document within a double quoted scalar"):(t.position++,r=t.position)}b(t,"unexpected end of the stream within a double quoted scalar")}function ra(t,n){var e=!0,r,i,s,a=t.tag,o,d=t.anchor,h,f,p,_,v,k=Object.create(null),w,S,W,E;if(E=t.input.charCodeAt(t.position),E===91)f=93,v=!1,o=[];else if(E===123)f=125,v=!0,o={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=o),E=t.input.charCodeAt(++t.position);E!==0;){if(A(t,!0,n),E=t.input.charCodeAt(t.position),E===f)return t.position++,t.tag=a,t.anchor=d,t.kind=v?"mapping":"sequence",t.result=o,!0;e?E===44&&b(t,"expected the node content, but found ','"):b(t,"missed comma between flow collection entries"),S=w=W=null,p=_=!1,E===63&&(h=t.input.charCodeAt(t.position+1),R(h)&&(p=_=!0,t.position++,A(t,!0,n))),r=t.line,i=t.lineStart,s=t.position,Te(t,n,vt,!1,!0),S=t.tag,w=t.result,A(t,!0,n),E=t.input.charCodeAt(t.position),(_||t.line===r)&&E===58&&(p=!0,E=t.input.charCodeAt(++t.position),A(t,!0,n),Te(t,n,vt,!1,!0),W=t.result),v?Le(t,o,k,S,w,W,r,i,s):p?o.push(Le(t,null,k,S,w,W,r,i,s)):o.push(w),A(t,!0,n),E=t.input.charCodeAt(t.position),E===44?(e=!0,E=t.input.charCodeAt(++t.position)):e=!1}b(t,"unexpected end of the stream within a flow collection")}function ia(t,n){var e,r,i=Gt,s=!1,a=!1,o=n,d=0,h=!1,f,p;if(p=t.input.charCodeAt(t.position),p===124)r=!1;else if(p===62)r=!0;else return!1;for(t.kind="scalar",t.result="";p!==0;)if(p=t.input.charCodeAt(++t.position),p===43||p===45)Gt===i?i=p===43?Br:Bs:b(t,"repeat of a chomping mode identifier");else if((f=Js(p))>=0)f===0?b(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):a?b(t,"repeat of an indentation width identifier"):(o=n+f-1,a=!0);else break;if(ye(p)){do p=t.input.charCodeAt(++t.position);while(ye(p));if(p===35)do p=t.input.charCodeAt(++t.position);while(!V(p)&&p!==0)}for(;p!==0;){for(Xt(t),t.lineIndent=0,p=t.input.charCodeAt(t.position);(!a||t.lineIndent<o)&&p===32;)t.lineIndent++,p=t.input.charCodeAt(++t.position);if(!a&&t.lineIndent>o&&(o=t.lineIndent),V(p)){d++;continue}if(t.lineIndent<o){i===Br?t.result+=L.repeat(`
`,s?1+d:d):i===Gt&&s&&(t.result+=`
`);break}for(r?ye(p)?(h=!0,t.result+=L.repeat(`
`,s?1+d:d)):h?(h=!1,t.result+=L.repeat(`
`,d+1)):d===0?s&&(t.result+=" "):t.result+=L.repeat(`
`,d):t.result+=L.repeat(`
`,s?1+d:d),s=!0,a=!0,d=0,e=t.position;!V(p)&&p!==0;)p=t.input.charCodeAt(++t.position);le(t,e,t.position,!1)}return!0}function Vr(t,n){var e,r=t.tag,i=t.anchor,s=[],a,o=!1,d;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=s),d=t.input.charCodeAt(t.position);d!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,b(t,"tab characters must not be used in indentation")),!(d!==45||(a=t.input.charCodeAt(t.position+1),!R(a))));){if(o=!0,t.position++,A(t,!0,-1)&&t.lineIndent<=n){s.push(null),d=t.input.charCodeAt(t.position);continue}if(e=t.line,Te(t,n,ui,!1,!0),s.push(t.result),A(t,!0,-1),d=t.input.charCodeAt(t.position),(t.line===e||t.lineIndent>n)&&d!==0)b(t,"bad indentation of a sequence entry");else if(t.lineIndent<n)break}return o?(t.tag=r,t.anchor=i,t.kind="sequence",t.result=s,!0):!1}function na(t,n,e){var r,i,s,a,o,d,h=t.tag,f=t.anchor,p={},_=Object.create(null),v=null,k=null,w=null,S=!1,W=!1,E;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=p),E=t.input.charCodeAt(t.position);E!==0;){if(!S&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,b(t,"tab characters must not be used in indentation")),r=t.input.charCodeAt(t.position+1),s=t.line,(E===63||E===58)&&R(r))E===63?(S&&(Le(t,p,_,v,k,null,a,o,d),v=k=w=null),W=!0,S=!0,i=!0):S?(S=!1,i=!0):b(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,E=r;else{if(a=t.line,o=t.lineStart,d=t.position,!Te(t,e,di,!1,!0))break;if(t.line===s){for(E=t.input.charCodeAt(t.position);ye(E);)E=t.input.charCodeAt(++t.position);if(E===58)E=t.input.charCodeAt(++t.position),R(E)||b(t,"a whitespace character is expected after the key-value separator within a block mapping"),S&&(Le(t,p,_,v,k,null,a,o,d),v=k=w=null),W=!0,S=!1,i=!1,v=t.tag,k=t.result;else if(W)b(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=h,t.anchor=f,!0}else if(W)b(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=h,t.anchor=f,!0}if((t.line===s||t.lineIndent>n)&&(S&&(a=t.line,o=t.lineStart,d=t.position),Te(t,n,yt,!0,i)&&(S?k=t.result:w=t.result),S||(Le(t,p,_,v,k,w,a,o,d),v=k=w=null),A(t,!0,-1),E=t.input.charCodeAt(t.position)),(t.line===s||t.lineIndent>n)&&E!==0)b(t,"bad indentation of a mapping entry");else if(t.lineIndent<n)break}return S&&Le(t,p,_,v,k,null,a,o,d),W&&(t.tag=h,t.anchor=f,t.kind="mapping",t.result=p),W}function sa(t){var n,e=!1,r=!1,i,s,a;if(a=t.input.charCodeAt(t.position),a!==33)return!1;if(t.tag!==null&&b(t,"duplication of a tag property"),a=t.input.charCodeAt(++t.position),a===60?(e=!0,a=t.input.charCodeAt(++t.position)):a===33?(r=!0,i="!!",a=t.input.charCodeAt(++t.position)):i="!",n=t.position,e){do a=t.input.charCodeAt(++t.position);while(a!==0&&a!==62);t.position<t.length?(s=t.input.slice(n,t.position),a=t.input.charCodeAt(++t.position)):b(t,"unexpected end of the stream within a verbatim tag")}else{for(;a!==0&&!R(a);)a===33&&(r?b(t,"tag suffix cannot contain exclamation marks"):(i=t.input.slice(n-1,t.position+1),ci.test(i)||b(t,"named tag handle cannot contain such characters"),r=!0,n=t.position+1)),a=t.input.charCodeAt(++t.position);s=t.input.slice(n,t.position),qs.test(s)&&b(t,"tag suffix cannot contain flow indicator characters")}s&&!hi.test(s)&&b(t,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{b(t,"tag name is malformed: "+s)}return e?t.tag=s:de.call(t.tagMap,i)?t.tag=t.tagMap[i]+s:i==="!"?t.tag="!"+s:i==="!!"?t.tag="tag:yaml.org,2002:"+s:b(t,'undeclared tag handle "'+i+'"'),!0}function aa(t){var n,e;if(e=t.input.charCodeAt(t.position),e!==38)return!1;for(t.anchor!==null&&b(t,"duplication of an anchor property"),e=t.input.charCodeAt(++t.position),n=t.position;e!==0&&!R(e)&&!Ae(e);)e=t.input.charCodeAt(++t.position);return t.position===n&&b(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(n,t.position),!0}function oa(t){var n,e,r;if(r=t.input.charCodeAt(t.position),r!==42)return!1;for(r=t.input.charCodeAt(++t.position),n=t.position;r!==0&&!R(r)&&!Ae(r);)r=t.input.charCodeAt(++t.position);return t.position===n&&b(t,"name of an alias node must contain at least one character"),e=t.input.slice(n,t.position),de.call(t.anchorMap,e)||b(t,'unidentified alias "'+e+'"'),t.result=t.anchorMap[e],A(t,!0,-1),!0}function Te(t,n,e,r,i){var s,a,o,d=1,h=!1,f=!1,p,_,v,k,w,S;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,s=a=o=yt===e||ui===e,r&&A(t,!0,-1)&&(h=!0,t.lineIndent>n?d=1:t.lineIndent===n?d=0:t.lineIndent<n&&(d=-1)),d===1)for(;sa(t)||aa(t);)A(t,!0,-1)?(h=!0,o=s,t.lineIndent>n?d=1:t.lineIndent===n?d=0:t.lineIndent<n&&(d=-1)):o=!1;if(o&&(o=h||i),(d===1||yt===e)&&(vt===e||di===e?w=n:w=n+1,S=t.position-t.lineStart,d===1?o&&(Vr(t,S)||na(t,S,w))||ra(t,w)?f=!0:(a&&ia(t,w)||ea(t,w)||ta(t,w)?f=!0:oa(t)?(f=!0,(t.tag!==null||t.anchor!==null)&&b(t,"alias node should not have any properties")):Zs(t,w,vt===e)&&(f=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):d===0&&(f=o&&Vr(t,S))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&b(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),p=0,_=t.implicitTypes.length;p<_;p+=1)if(k=t.implicitTypes[p],k.resolve(t.result)){t.result=k.construct(t.result),t.tag=k.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(de.call(t.typeMap[t.kind||"fallback"],t.tag))k=t.typeMap[t.kind||"fallback"][t.tag];else for(k=null,v=t.typeMap.multi[t.kind||"fallback"],p=0,_=v.length;p<_;p+=1)if(t.tag.slice(0,v[p].tag.length)===v[p].tag){k=v[p];break}k||b(t,"unknown tag !<"+t.tag+">"),t.result!==null&&k.kind!==t.kind&&b(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+k.kind+'", not "'+t.kind+'"'),k.resolve(t.result,t.tag)?(t.result=k.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):b(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||f}function la(t){var n=t.position,e,r,i,s=!1,a;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(a=t.input.charCodeAt(t.position))!==0&&(A(t,!0,-1),a=t.input.charCodeAt(t.position),!(t.lineIndent>0||a!==37));){for(s=!0,a=t.input.charCodeAt(++t.position),e=t.position;a!==0&&!R(a);)a=t.input.charCodeAt(++t.position);for(r=t.input.slice(e,t.position),i=[],r.length<1&&b(t,"directive name must not be less than one character in length");a!==0;){for(;ye(a);)a=t.input.charCodeAt(++t.position);if(a===35){do a=t.input.charCodeAt(++t.position);while(a!==0&&!V(a));break}if(V(a))break;for(e=t.position;a!==0&&!R(a);)a=t.input.charCodeAt(++t.position);i.push(t.input.slice(e,t.position))}a!==0&&Xt(t),de.call(qr,r)?qr[r](t,r,i):bt(t,'unknown document directive "'+r+'"')}if(A(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,A(t,!0,-1)):s&&b(t,"directives end mark is expected"),Te(t,t.lineIndent-1,yt,!1,!0),A(t,!0,-1),t.checkLineBreaks&&Ys.test(t.input.slice(n,t.position))&&bt(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&wt(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,A(t,!0,-1));return}if(t.position<t.length-1)b(t,"end of the stream or a document separator is expected");else return}function _i(t,n){t=String(t),n=n||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var e=new Xs(t,n),r=t.indexOf("\0");for(r!==-1&&(e.position=r,b(e,"null byte is not allowed in input")),e.input+="\0";e.input.charCodeAt(e.position)===32;)e.lineIndent+=1,e.position+=1;for(;e.position<e.length-1;)la(e);return e.documents}function da(t,n,e){n!==null&&typeof n=="object"&&typeof e>"u"&&(e=n,n=null);var r=_i(t,e);if(typeof n!="function")return r;for(var i=0,s=r.length;i<s;i+=1)n(r[i])}function ua(t,n){var e=_i(t,n);if(e.length!==0){if(e.length===1)return e[0];throw new M("expected a single document in the stream, but found more")}}var ca=da,ha=ua,vi={loadAll:ca,load:ha},yi=Object.prototype.toString,bi=Object.prototype.hasOwnProperty,er=65279,pa=9,Be=10,ma=13,fa=32,ga=33,_a=34,qt=35,va=37,ya=38,ba=39,$a=42,$i=44,xa=45,$t=58,wa=61,ka=62,Ea=63,Sa=64,xi=91,wi=93,Ca=96,ki=123,Aa=124,Ei=125,O={};O[0]="\\0";O[7]="\\a";O[8]="\\b";O[9]="\\t";O[10]="\\n";O[11]="\\v";O[12]="\\f";O[13]="\\r";O[27]="\\e";O[34]='\\"';O[92]="\\\\";O[133]="\\N";O[160]="\\_";O[8232]="\\L";O[8233]="\\P";var La=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],Ta=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function Fa(t,n){var e,r,i,s,a,o,d;if(n===null)return{};for(e={},r=Object.keys(n),i=0,s=r.length;i<s;i+=1)a=r[i],o=String(n[a]),a.slice(0,2)==="!!"&&(a="tag:yaml.org,2002:"+a.slice(2)),d=t.compiledTypeMap.fallback[a],d&&bi.call(d.styleAliases,o)&&(o=d.styleAliases[o]),e[a]=o;return e}function Ha(t){var n,e,r;if(n=t.toString(16).toUpperCase(),t<=255)e="x",r=2;else if(t<=65535)e="u",r=4;else if(t<=4294967295)e="U",r=8;else throw new M("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+e+L.repeat("0",r-n.length)+n}var Da=1,Ge=2;function Pa(t){this.schema=t.schema||li,this.indent=Math.max(1,t.indent||2),this.noArrayIndent=t.noArrayIndent||!1,this.skipInvalid=t.skipInvalid||!1,this.flowLevel=L.isNothing(t.flowLevel)?-1:t.flowLevel,this.styleMap=Fa(this.schema,t.styles||null),this.sortKeys=t.sortKeys||!1,this.lineWidth=t.lineWidth||80,this.noRefs=t.noRefs||!1,this.noCompatMode=t.noCompatMode||!1,this.condenseFlow=t.condenseFlow||!1,this.quotingType=t.quotingType==='"'?Ge:Da,this.forceQuotes=t.forceQuotes||!1,this.replacer=typeof t.replacer=="function"?t.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Jr(t,n){for(var e=L.repeat(" ",n),r=0,i=-1,s="",a,o=t.length;r<o;)i=t.indexOf(`
`,r),i===-1?(a=t.slice(r),r=o):(a=t.slice(r,i+1),r=i+1),a.length&&a!==`
`&&(s+=e),s+=a;return s}function Kt(t,n){return`
`+L.repeat(" ",t.indent*n)}function Oa(t,n){var e,r,i;for(e=0,r=t.implicitTypes.length;e<r;e+=1)if(i=t.implicitTypes[e],i.resolve(n))return!0;return!1}function xt(t){return t===fa||t===pa}function Ye(t){return 32<=t&&t<=126||161<=t&&t<=55295&&t!==8232&&t!==8233||57344<=t&&t<=65533&&t!==er||65536<=t&&t<=1114111}function Qr(t){return Ye(t)&&t!==er&&t!==ma&&t!==Be}function Xr(t,n,e){var r=Qr(t),i=r&&!xt(t);return(e?r:r&&t!==$i&&t!==xi&&t!==wi&&t!==ki&&t!==Ei)&&t!==qt&&!(n===$t&&!i)||Qr(n)&&!xt(n)&&t===qt||n===$t&&i}function Na(t){return Ye(t)&&t!==er&&!xt(t)&&t!==xa&&t!==Ea&&t!==$t&&t!==$i&&t!==xi&&t!==wi&&t!==ki&&t!==Ei&&t!==qt&&t!==ya&&t!==$a&&t!==ga&&t!==Aa&&t!==wa&&t!==ka&&t!==ba&&t!==_a&&t!==va&&t!==Sa&&t!==Ca}function Ia(t){return!xt(t)&&t!==$t}function Ue(t,n){var e=t.charCodeAt(n),r;return e>=55296&&e<=56319&&n+1<t.length&&(r=t.charCodeAt(n+1),r>=56320&&r<=57343)?(e-55296)*1024+r-56320+65536:e}function Si(t){var n=/^\n* /;return n.test(t)}var Ci=1,Vt=2,Ai=3,Li=4,Ce=5;function Ma(t,n,e,r,i,s,a,o){var d,h=0,f=null,p=!1,_=!1,v=r!==-1,k=-1,w=Na(Ue(t,0))&&Ia(Ue(t,t.length-1));if(n||a)for(d=0;d<t.length;h>=65536?d+=2:d++){if(h=Ue(t,d),!Ye(h))return Ce;w=w&&Xr(h,f,o),f=h}else{for(d=0;d<t.length;h>=65536?d+=2:d++){if(h=Ue(t,d),h===Be)p=!0,v&&(_=_||d-k-1>r&&t[k+1]!==" ",k=d);else if(!Ye(h))return Ce;w=w&&Xr(h,f,o),f=h}_=_||v&&d-k-1>r&&t[k+1]!==" "}return!p&&!_?w&&!a&&!i(t)?Ci:s===Ge?Ce:Vt:e>9&&Si(t)?Ce:a?s===Ge?Ce:Vt:_?Li:Ai}function Ra(t,n,e,r,i){t.dump=(function(){if(n.length===0)return t.quotingType===Ge?'""':"''";if(!t.noCompatMode&&(La.indexOf(n)!==-1||Ta.test(n)))return t.quotingType===Ge?'"'+n+'"':"'"+n+"'";var s=t.indent*Math.max(1,e),a=t.lineWidth===-1?-1:Math.max(Math.min(t.lineWidth,40),t.lineWidth-s),o=r||t.flowLevel>-1&&e>=t.flowLevel;function d(h){return Oa(t,h)}switch(Ma(n,o,t.indent,a,d,t.quotingType,t.forceQuotes&&!r,i)){case Ci:return n;case Vt:return"'"+n.replace(/'/g,"''")+"'";case Ai:return"|"+Zr(n,t.indent)+ei(Jr(n,s));case Li:return">"+Zr(n,t.indent)+ei(Jr(ja(n,a),s));case Ce:return'"'+za(n)+'"';default:throw new M("impossible error: invalid scalar style")}})()}function Zr(t,n){var e=Si(t)?String(n):"",r=t[t.length-1]===`
`,i=r&&(t[t.length-2]===`
`||t===`
`),s=i?"+":r?"":"-";return e+s+`
`}function ei(t){return t[t.length-1]===`
`?t.slice(0,-1):t}function ja(t,n){for(var e=/(\n+)([^\n]*)/g,r=(function(){var h=t.indexOf(`
`);return h=h!==-1?h:t.length,e.lastIndex=h,ti(t.slice(0,h),n)})(),i=t[0]===`
`||t[0]===" ",s,a;a=e.exec(t);){var o=a[1],d=a[2];s=d[0]===" ",r+=o+(!i&&!s&&d!==""?`
`:"")+ti(d,n),i=s}return r}function ti(t,n){if(t===""||t[0]===" ")return t;for(var e=/ [^ ]/g,r,i=0,s,a=0,o=0,d="";r=e.exec(t);)o=r.index,o-i>n&&(s=a>i?a:o,d+=`
`+t.slice(i,s),i=s+1),a=o;return d+=`
`,t.length-i>n&&a>i?d+=t.slice(i,a)+`
`+t.slice(a+1):d+=t.slice(i),d.slice(1)}function za(t){for(var n="",e=0,r,i=0;i<t.length;e>=65536?i+=2:i++)e=Ue(t,i),r=O[e],!r&&Ye(e)?(n+=t[i],e>=65536&&(n+=t[i+1])):n+=r||Ha(e);return n}function Ua(t,n,e){var r="",i=t.tag,s,a,o;for(s=0,a=e.length;s<a;s+=1)o=e[s],t.replacer&&(o=t.replacer.call(e,String(s),o)),(Z(t,n,o,!1,!1)||typeof o>"u"&&Z(t,n,null,!1,!1))&&(r!==""&&(r+=","+(t.condenseFlow?"":" ")),r+=t.dump);t.tag=i,t.dump="["+r+"]"}function ri(t,n,e,r){var i="",s=t.tag,a,o,d;for(a=0,o=e.length;a<o;a+=1)d=e[a],t.replacer&&(d=t.replacer.call(e,String(a),d)),(Z(t,n+1,d,!0,!0,!1,!0)||typeof d>"u"&&Z(t,n+1,null,!0,!0,!1,!0))&&((!r||i!=="")&&(i+=Kt(t,n)),t.dump&&Be===t.dump.charCodeAt(0)?i+="-":i+="- ",i+=t.dump);t.tag=s,t.dump=i||"[]"}function Wa(t,n,e){var r="",i=t.tag,s=Object.keys(e),a,o,d,h,f;for(a=0,o=s.length;a<o;a+=1)f="",r!==""&&(f+=", "),t.condenseFlow&&(f+='"'),d=s[a],h=e[d],t.replacer&&(h=t.replacer.call(e,d,h)),Z(t,n,d,!1,!1)&&(t.dump.length>1024&&(f+="? "),f+=t.dump+(t.condenseFlow?'"':"")+":"+(t.condenseFlow?"":" "),Z(t,n,h,!1,!1)&&(f+=t.dump,r+=f));t.tag=i,t.dump="{"+r+"}"}function Ba(t,n,e,r){var i="",s=t.tag,a=Object.keys(e),o,d,h,f,p,_;if(t.sortKeys===!0)a.sort();else if(typeof t.sortKeys=="function")a.sort(t.sortKeys);else if(t.sortKeys)throw new M("sortKeys must be a boolean or a function");for(o=0,d=a.length;o<d;o+=1)_="",(!r||i!=="")&&(_+=Kt(t,n)),h=a[o],f=e[h],t.replacer&&(f=t.replacer.call(e,h,f)),Z(t,n+1,h,!0,!0,!0)&&(p=t.tag!==null&&t.tag!=="?"||t.dump&&t.dump.length>1024,p&&(t.dump&&Be===t.dump.charCodeAt(0)?_+="?":_+="? "),_+=t.dump,p&&(_+=Kt(t,n)),Z(t,n+1,f,!0,p)&&(t.dump&&Be===t.dump.charCodeAt(0)?_+=":":_+=": ",_+=t.dump,i+=_));t.tag=s,t.dump=i||"{}"}function ii(t,n,e){var r,i,s,a,o,d;for(i=e?t.explicitTypes:t.implicitTypes,s=0,a=i.length;s<a;s+=1)if(o=i[s],(o.instanceOf||o.predicate)&&(!o.instanceOf||typeof n=="object"&&n instanceof o.instanceOf)&&(!o.predicate||o.predicate(n))){if(e?o.multi&&o.representName?t.tag=o.representName(n):t.tag=o.tag:t.tag="?",o.represent){if(d=t.styleMap[o.tag]||o.defaultStyle,yi.call(o.represent)==="[object Function]")r=o.represent(n,d);else if(bi.call(o.represent,d))r=o.represent[d](n,d);else throw new M("!<"+o.tag+'> tag resolver accepts not "'+d+'" style');t.dump=r}return!0}return!1}function Z(t,n,e,r,i,s,a){t.tag=null,t.dump=e,ii(t,e,!1)||ii(t,e,!0);var o=yi.call(t.dump),d=r,h;r&&(r=t.flowLevel<0||t.flowLevel>n);var f=o==="[object Object]"||o==="[object Array]",p,_;if(f&&(p=t.duplicates.indexOf(e),_=p!==-1),(t.tag!==null&&t.tag!=="?"||_||t.indent!==2&&n>0)&&(i=!1),_&&t.usedDuplicates[p])t.dump="*ref_"+p;else{if(f&&_&&!t.usedDuplicates[p]&&(t.usedDuplicates[p]=!0),o==="[object Object]")r&&Object.keys(t.dump).length!==0?(Ba(t,n,t.dump,i),_&&(t.dump="&ref_"+p+t.dump)):(Wa(t,n,t.dump),_&&(t.dump="&ref_"+p+" "+t.dump));else if(o==="[object Array]")r&&t.dump.length!==0?(t.noArrayIndent&&!a&&n>0?ri(t,n-1,t.dump,i):ri(t,n,t.dump,i),_&&(t.dump="&ref_"+p+t.dump)):(Ua(t,n,t.dump),_&&(t.dump="&ref_"+p+" "+t.dump));else if(o==="[object String]")t.tag!=="?"&&Ra(t,t.dump,n,s,d);else{if(o==="[object Undefined]")return!1;if(t.skipInvalid)return!1;throw new M("unacceptable kind of an object to dump "+o)}t.tag!==null&&t.tag!=="?"&&(h=encodeURI(t.tag[0]==="!"?t.tag.slice(1):t.tag).replace(/!/g,"%21"),t.tag[0]==="!"?h="!"+h:h.slice(0,18)==="tag:yaml.org,2002:"?h="!!"+h.slice(18):h="!<"+h+">",t.dump=h+" "+t.dump)}return!0}function Ga(t,n){var e=[],r=[],i,s;for(Jt(t,e,r),i=0,s=r.length;i<s;i+=1)n.duplicates.push(e[r[i]]);n.usedDuplicates=new Array(s)}function Jt(t,n,e){var r,i,s;if(t!==null&&typeof t=="object")if(i=n.indexOf(t),i!==-1)e.indexOf(i)===-1&&e.push(i);else if(n.push(t),Array.isArray(t))for(i=0,s=t.length;i<s;i+=1)Jt(t[i],n,e);else for(r=Object.keys(t),i=0,s=r.length;i<s;i+=1)Jt(t[r[i]],n,e)}function Ya(t,n){n=n||{};var e=new Pa(n);e.noRefs||Ga(t,e);var r=t;return e.replacer&&(r=e.replacer.call({"":r},"",r)),Z(e,0,r,!0,!0)?e.dump+`
`:""}var qa=Ya,Ka={dump:qa};function tr(t,n){return function(){throw new Error("Function yaml."+t+" is removed in js-yaml 4. Use yaml."+n+" instead, which is now safe by default.")}}var Ti=vi.load,Hl=vi.loadAll,kt=Ka.dump;var Dl=tr("safeLoad","load"),Pl=tr("safeLoadAll","loadAll"),Ol=tr("safeDump","dump");var J=class extends y{constructor(){super(...arguments);this.value=null;this._mode="form";this._yamlText="";this._yamlError=null}willUpdate(e){super.willUpdate?.(e),e.has("value")&&this._mode==="form"&&(this._yamlText=kt(this.value??{}))}connectedCallback(){super.connectedCallback(),this._yamlText=kt(this.value??{});let e=this.value&&typeof this.value=="object"?this.value.script:null,r=this._fieldsFor(e);e&&(!r||Object.keys(r).length===0)&&(this._mode="yaml")}_setMode(e){e==="form"&&this._yamlError!==null||(e==="yaml"&&(this._yamlText=kt(this.value??{})),this._mode=e)}_onYamlInput(e){this._yamlText=e;let r;try{r=Ti(e)}catch(o){this._yamlError=o.message;return}if(r==null){this._yamlError=null,this._emit(null);return}if(typeof r!="object"||Array.isArray(r)){this._yamlError="Expected an object";return}let i=r,s=i.script;if(typeof s!="string"||!s.startsWith("script.")){this._yamlError="`script` must be a 'script.<name>' string";return}let a=i.args;if(a!==void 0&&(typeof a!="object"||Array.isArray(a)||a===null)){this._yamlError="`args` must be an object if present";return}this._yamlError=null,this._emit({script:s,args:a??{}})}_emit(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_scriptIds(){let e=this.hass?.services;return Object.keys(e?.script??{}).sort().map(i=>`script.${i}`)}_label(e){let i=this.hass?.states?.[e]?.attributes?.friendly_name;return typeof i=="string"&&i?i:e}_fieldsFor(e){if(!e)return;let r=e.replace(/^script\./,"");return this.hass?.services?.script?.[r]?.fields}_defaultArgs(e){let r=this._fieldsFor(e)??{},i={};for(let[s,a]of Object.entries(r))a&&Object.prototype.hasOwnProperty.call(a,"default")&&(i[s]=a.default);return i}_pickerSchema(){return[{name:"script",selector:{select:{mode:"dropdown",options:this._scriptIds().map(e=>({value:e,label:this._label(e)}))}}}]}_pickScript(e){if(!e){this._emit(null);return}this._emit({script:e,args:this._defaultArgs(e)})}_argsSchema(){let e=this._fieldsFor(this.value&&typeof this.value=="object"?this.value.script:null);return e?Object.entries(e).map(([r,i])=>({name:r,required:i.required,description:i.description?{suffix:i.description}:void 0,selector:i.selector??{text:{}}})):[]}_updateArgs(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:e})}render(){let e=this.value&&typeof this.value=="object"?this.value.script:null,r=this._argsSchema(),i=(this.value&&typeof this.value=="object"?this.value.args:{})??{},s=r.length>0;return l`
      <div class="section">
        <h4>${u(this.hass,"ui.script","Script")}</h4>
        ${this._renderPicker(e)}
      </div>
      ${e?l`
        <div class="tabs">
          <button
            type="button"
            ?disabled=${!s||this._yamlError!==null}
            title=${this._yamlError??""}
            class=${this._mode==="form"?"active":""}
            @click=${()=>this._setMode("form")}
          >${u(this.hass,"ui.form","Form")}</button>
          <button
            type="button"
            class=${this._mode==="yaml"?"active":""}
            @click=${()=>this._setMode("yaml")}
          >${u(this.hass,"ui.yaml","YAML")}</button>
        </div>
      `:""}
      ${e&&this._mode==="form"&&s?l`
        <div class="section args">
          <h4>${u(this.hass,"ui.arguments","Arguments")}</h4>
          ${this._renderArgs(r,i)}
        </div>
      `:""}
      ${e&&this._mode==="yaml"?this._renderYaml():""}
    `}_renderYaml(){let e=r=>{let i=r.target.value??r.detail?.value??"";this._onYamlInput(i)};return customElements.get("ha-code-editor")?l`
        <ha-code-editor mode="yaml" .value=${this._yamlText} @value-changed=${e}></ha-code-editor>
        ${this._yamlError?l`<div class="error">${this._yamlError}</div>`:""}
      `:l`
      <textarea
        rows="6"
        style="width:100%;font-family:monospace;"
        .value=${this._yamlText}
        @input=${e}
      ></textarea>
      ${this._yamlError?l`<div class="error">${this._yamlError}</div>`:""}
    `}_renderArgs(e,r){return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${e}
        .data=${r}
        @value-changed=${i=>{i.stopPropagation(),this._updateArgs(i.detail.value)}}
      ></ha-form>`:l`${e.map(i=>{let s=r[i.name];return l`
        <label style="display:block;margin-bottom:0.4rem;">
          <span style="display:inline-block;min-width:8em;">${i.name}</span>
          <input
            .value=${s==null?"":String(s)}
            @change=${a=>{let o=a.target.value,d={...r,[i.name]:o};this._updateArgs(d)}}
          />
        </label>
      `})}`}_renderPicker(e){return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${this._pickerSchema()}
        .data=${{script:e??""}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._pickScript(r.detail.value.script||null)}}
      ></ha-form>`:l`<select
      @change=${r=>this._pickScript(r.target.value||null)}>
      <option value="" ?selected=${!e}>(none)</option>
      ${this._scriptIds().map(r=>l`<option value=${r} ?selected=${r===e}>${this._label(r)}</option>`)}
    </select>`}};J.styles=$`
    :host { display: block; }
    .section { margin-bottom: 1rem; }
    .section h4 { margin: 0 0 0.5rem 0; font-size: 0.95em; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
    .tabs button {
      background: transparent;
      border: 1px solid var(--divider-color, #ccc);
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      cursor: pointer;
      color: var(--primary-text-color, inherit);
    }
    .tabs button.active {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
    }
    .tabs button[disabled] { opacity: 0.4; cursor: not-allowed; }
    .error {
      color: var(--error-color, #d32f2f);
      font-size: 0.85em;
      margin-top: 0.25rem;
      white-space: pre-wrap;
    }
  `,c([m({attribute:!1})],J.prototype,"hass",2),c([m({attribute:!1})],J.prototype,"value",2),c([g()],J.prototype,"_mode",2),c([g()],J.prototype,"_yamlText",2),c([g()],J.prototype,"_yamlError",2),J=c([x("ambience-script-predicate-input")],J);var Va=["dawn","sunrise","noon","sunset","dusk","midnight"],be=class extends y{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onKindChange(e){let r=e.target.value;r!==this.value.kind&&(r==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let r=e.target.value,[i,s]=r.split(":").map(a=>parseInt(a,10));Number.isNaN(i)||Number.isNaN(s)||this._emit({kind:"time",hh:i,mm:s})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let r=e.target.value;this._emit({kind:"sun",anchor:r,offset_min:this.value.offset_min})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let r=parseInt(e.target.value,10);Number.isNaN(r)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:r})}_renderTime(e){let r=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return l`<input type="time" .value=${r} @input=${this._onTimeChange} />`}_renderSun(e){let r=Ja(e.offset_min,this.hass);return l`
      <select @change=${this._onAnchorChange}>
        ${Va.map(i=>l`<option value=${i} ?selected=${i===e.anchor}>${Ee(this.hass,i)}</option>`)}
      </select>
      <input
        type="number"
        step="1"
        placeholder=${u(this.hass,"ui.offset_placeholder","\xB1min, e.g. -30")}
        .value=${String(e.offset_min)}
        @input=${this._onOffsetChange}
      />
      <span class="offset-hint">${r}</span>
    `}render(){return l`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>${u(this.hass,"ui.endpoint_time","Time")}</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>${u(this.hass,"ui.endpoint_sun","Sun")}</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};be.styles=$`
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
  `,c([m({attribute:!1})],be.prototype,"hass",2),c([m({attribute:!1})],be.prototype,"value",2),be=c([x("ambience-time-endpoint")],be);function Ja(t,n){if(t===0)return"";let e=Math.abs(t),r=t<0?"\u2212":"+";if(e%60===0){let i=e/60,s=i===1?u(n,"ui.unit_hour","hour"):u(n,"ui.unit_hours","hours");return`${r}${i} ${s}`}return`${r}${e} ${u(n,"ui.unit_min","min")}`}var qe={kind:"any"},Fi={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},Q=class extends y{constructor(){super(...arguments);this.value=null;this._entries=[qe];this._openIdx=0}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[qe]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(r=>{let i=this._entries[this._openIdx];if(!i)return;let s=i.kind==="any"?"__any__":i.kind==="range"?"__custom__":i.period;r.value!==s&&(r.value=s)})}_predicateToEntries(e){return e===null?[qe]:(Array.isArray(e)?e:[e]).map(i=>"period"in i?{kind:"period",period:i.period}:{kind:"range",from:i.from,to:i.to})}_emit(e){let r=e.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),i=r.length===0?null:r.length===1?r[0]:r;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:i},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let e=Object.keys(this.periods.builtins),r=Object.keys(this.periods.custom).filter(s=>!(s in this.periods.builtins)),i=new Set(this.periods.hidden);return[...e.filter(s=>!i.has(s)),...r]}_onSelectChange(e,r){let i=r.target.value,s=[...this._entries];i==="__any__"?s[e]=qe:i==="__custom__"?s[e]={kind:"range",...Fi}:s[e]={kind:"period",period:i},this._entries=s,this._emit(s)}_onRangeChange(e,r,i){i.stopPropagation();let s=this._entries[e];if(!s||s.kind!=="range")return;let a=[...this._entries];a[e]={...s,[r]:i.detail.value},this._entries=a,this._emit(a)}_onRemove(e){let r=this._entries.filter((i,s)=>s!==e);this._entries=r.length===0?[qe]:r,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...Fi}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,r){let i;return e.kind==="any"?i=u(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?i=_t({period:e.period},{hass:this.hass,periods:this.periods}):i=_t({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),l`
      <div class="summary-chip" @click=${()=>this._onChipClick(r)}>
        <span class="chip-label">${i}</span>
        ${this._entries.length>1?l`<button class="remove" @click=${s=>{s.stopPropagation(),this._onRemove(r)}} title=${u(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,r,i){let s=this._effectiveIds(),a=this.periods?.custom??{};return l`
      <div class="entry">
        <div class="entry-header">
          <select @change=${o=>this._onSelectChange(r,o)}>
            ${i?l`<option value="__any__">${u(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${u(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${s.map(o=>l`<option value=${o}>
                ${_e(this.hass,o,a)}${a[o]&&!this.periods?.builtins[o]?u(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?l`<button class="remove" @click=${()=>this._onRemove(r)} title=${u(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${e.kind==="range"?l`
              <div class="range-row">
                <label>${u(this.hass,"ui.from_label","From")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.from}
                  @value-changed=${o=>this._onRangeChange(r,"from",o)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${u(this.hass,"ui.to_label","To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${o=>this._onRangeChange(r,"to",o)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(i=>i.kind!=="any"),r=this._entries.length>1;return l`
      ${this._entries.map((i,s)=>r&&s!==this._openIdx?this._renderChip(i,s):this._renderEntry(i,s,s===0))}
      ${e?l`<button class="add-btn" @click=${this._onAdd}>${u(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};Q.styles=$`
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
  `,c([m({attribute:!1})],Q.prototype,"value",2),c([m({attribute:!1})],Q.prototype,"periods",2),c([m({attribute:!1})],Q.prototype,"hass",2),c([g()],Q.prototype,"_entries",2),c([g()],Q.prototype,"_openIdx",2),Q=c([x("ambience-time-of-day-input")],Q);function Hi(t){if(typeof t!="string")return!1;let n=t.split(",").map(e=>e.trim()).filter(e=>e!=="");if(n.length===0)return!1;for(let e of n)if(e.includes("-")){let r=e.split("-").map(a=>a.trim());if(r.length!==2||!/^\d+$/.test(r[0])||!/^\d+$/.test(r[1]))return!1;let i=Number(r[0]),s=Number(r[1]);if(!(i>=1&&i<=s&&s<=31))return!1}else{if(!/^\d+$/.test(e))return!1;let r=Number(e);if(!(r>=1&&r<=31))return!1}return!0}var rr=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Qa=new Set(["workday","holiday"]),Xa=new Set(["first_workday","last_workday"]),Za=[31,29,31,30,31,30,31,31,30,31,30,31];function Ke(t){return Za[t-1]??31}function ir(t){switch(t){case"weekday":return{kind:t,days:[]};case"day_of_month":return{kind:t,days:""};case"date":return{kind:t,month:1,day:1};case"date_range":return{kind:t,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:t}}}var ue=class extends y{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?u(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return u(this.hass,"ui.field_kind","Kind");case"days":return u(this.hass,"ui.field_days_of_month","Days of month");case"month":return u(this.hass,"ui.field_month","Month");case"day":return u(this.hass,"ui.field_day","Day");case"from_month":return u(this.hass,"ui.field_from_month","From month");case"from_day":return u(this.hass,"ui.field_from_day","From day");case"to_month":return u(this.hass,"ui.field_to_month","To month");case"to_day":return u(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let r=e.include.length===0&&e.exclude.length===0;this.value=r?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_addItem(e,r){let i=this._current();i[e]=[...i[e],ir(r)],this._emit(i)}_removeItem(e,r){let i=this._current();i[e]=i[e].filter((s,a)=>a!==r),this._emit(i)}_updateItem(e,r,i){let s=this._current();s[e]=s[e].map((a,o)=>o===r?i:a),this._emit(s)}_kindDisabled(e){return!!(Qa.has(e)&&!this.dayConfig.workday_sensor||Xa.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:rr.map(e=>({value:e,label:it(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:Se(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:Ke(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,r){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(r.days??"")}:e}_setDatePart(e,r,i){let s=Number(i);if(!Number.isFinite(s)||s<1)return e;if(e.kind==="date"){let{month:a,day:o}=e;return r==="month"&&(a=s),r==="day"&&(o=s),{kind:"date",month:a,day:Math.min(o,Ke(a))}}if(e.kind==="date_range"){let a={...e.from},o={...e.to};return r==="from_month"&&(a.month=s),r==="from_day"&&(a.day=s),r==="to_month"&&(o.month=s),r==="to_day"&&(o.day=s),a.day=Math.min(a.day,Ke(a.month)),o.day=Math.min(o.day,Ke(o.month)),{kind:"date_range",from:a,to:o}}return e}_onKindForm(e,r,i){let s=i.kind;if(!s){this._removeItem(e,r);return}if(this._kindDisabled(s))return;let a=this._current()[e][r];a&&a.kind===s||this._updateItem(e,r,ir(s))}_dayOfMonthError(e){return e.trim()===""||Hi(e)?null:u(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(e,r,i,s){this._updateItem(e,r,this._bodyPatch(i,s))}_renderWeekday(e,r,i){return l`${[0,1,2,3,4,5,6].map(s=>l`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${i.days.includes(s)}
          @change=${a=>{let d=a.target.checked?[...i.days,s].sort((h,f)=>h-f):i.days.filter(h=>h!==s);this._updateItem(e,r,{kind:"weekday",days:d})}}
        />${rt(this.hass,s)}
      </label>
    `)}`}_renderKindPicker(e,r,i){return customElements.get("ha-form")?l`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:i.kind}}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${s=>{s.stopPropagation(),this._onKindForm(e,r,s.detail.value)}}
      ></ha-form>`:l`
      <select
        class="kind"
        .value=${i.kind}
        @change=${s=>{let a=s.target.value;this._kindDisabled(a)||a===i.kind||this._updateItem(e,r,ir(a))}}
      >
        ${rr.map(s=>l`<option value=${s} ?disabled=${this._kindDisabled(s)}>${it(this.hass,s)}</option>`)}
      </select>
    `}_renderItemBody(e,r,i){if(i.kind==="weekday")return this._renderWeekday(e,r,i);if(customElements.get("ha-form")){if(i.kind==="date")return this._renderDateRow(e,r,i,"month","day",i.month,i.day);if(i.kind==="date_range")return l`
          ${this._renderDateRow(e,r,i,"from_month","from_day",i.from.month,i.from.day)}
          ${this._renderDateRow(e,r,i,"to_month","to_day",i.to.month,i.to.day)}
        `;let s=this._bodySchema(i);if(!s)return l``;let a=i.kind==="day_of_month"?this._dayOfMonthError(i.days):null;return l`<ha-form
        .hass=${this.hass}
        .schema=${s}
        .data=${this._bodyData(i)}
        .error=${a?{days:a}:void 0}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${o=>{o.stopPropagation(),this._onBodyForm(e,r,i,o.detail.value)}}
      ></ha-form>`}return this._renderNativeBody(e,r,i)}_renderDateRow(e,r,i,s,a,o,d){let h=(f,p)=>{this._updateItem(e,r,this._setDatePart(i,f,p[f]))};return l`
      <div class="date-row">
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:s,required:!0,selector:this._monthSelector()}]}
          .data=${{[s]:String(o)}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${f=>{f.stopPropagation(),h(s,f.detail.value)}}
        ></ha-form>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:a,required:!0,selector:this._daySelector(o)}]}
          .data=${{[a]:d}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${f=>{f.stopPropagation(),h(a,f.detail.value)}}
        ></ha-form>
      </div>
    `}_renderNativeBody(e,r,i){if(i.kind==="day_of_month"){let o=this._dayOfMonthError(i.days);return l`<input
        type="text" placeholder=${u(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${i.days}
        @change=${d=>this._updateItem(e,r,this._bodyPatch(i,{days:d.target.value}))}
      />${o?l`<div class="field-error">${o}</div>`:""}`}let s=(o,d)=>l`
      <input type="number" min="1" max="12" .value=${String(d)}
        @change=${h=>this._updateItem(e,r,this._setDatePart(i,o,h.target.value))} />
    `,a=(o,d,h)=>l`
      <input type="number" min="1" max=${String(Ke(d))} .value=${String(h)}
        @change=${f=>this._updateItem(e,r,this._setDatePart(i,o,f.target.value))} />
    `;return i.kind==="date"?l`${s("month",i.month)} / ${a("day",i.month,i.day)}`:i.kind==="date_range"?l`
        <span>${u(this.hass,"ui.from","from")}</span>
        ${s("from_month",i.from.month)} / ${a("from_day",i.from.month,i.from.day)}
        <span>${u(this.hass,"ui.to","to")}</span>
        ${s("to_month",i.to.month)} / ${a("to_day",i.to.month,i.to.day)}
      `:l``}_renderAddPicker(e){let r=e==="include"?u(this.hass,"ui.add_include_item","+ Add include item"):u(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let i=()=>r;return l`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${i}
        @value-changed=${s=>{s.stopPropagation();let a=s.detail.value.kind;a&&!this._kindDisabled(a)&&this._addItem(e,a)}}
      ></ha-form>`}return l`
      <select
        .value=${""}
        @change=${i=>{let s=i.target.value;s&&(this._addItem(e,s),i.target.value="")}}
      >
        <option value="">${r}</option>
        ${rr.map(i=>l`<option value=${i} ?disabled=${this._kindDisabled(i)}>${it(this.hass,i)}</option>`)}
      </select>
    `}_renderItem(e,r,i){return l`
      <div class="item">
        ${this._renderKindPicker(e,r,i)}
        <div class="body">${this._renderItemBody(e,r,i)}</div>
        <button class="remove" title=${u(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(e,r)}>✕</button>
      </div>
    `}_renderSection(e,r){return l`
      <div class="section">
        <h4>${e==="include"?u(this.hass,"ui.include","Include"):u(this.hass,"ui.exclude","Exclude")}</h4>
        ${r.length===0&&e==="include"?l`<div class="hint">${u(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${r.map((i,s)=>this._renderItem(e,s,i))}
        ${this._renderAddPicker(e)}
      </div>
    `}render(){let{include:e,exclude:r}=this._current();return l`
      ${this._renderSection("include",e)}
      ${this._renderSection("exclude",r)}
    `}};ue.styles=$`
    :host { display: block; }
    .section { margin-bottom: 1rem; }
    .section h4 { margin: 0 0 0.5rem 0; font-size: 0.95em; }
    .hint { color: var(--secondary-text-color, #888); font-size: 0.85em; }
    .item {
      display: flex; align-items: flex-start; gap: 0.5rem;
      padding: 0.4rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; margin-bottom: 0.4rem;
      background: var(--card-background-color, #fff);
    }
    .item select, .item input[type="number"], .item input[type="text"] { padding: 0.25rem; }
    .item .kind { min-width: 12rem; }
    .item .body { flex: 1; display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: flex-start; }
    .item ha-form { display: block; flex: 1; }
    .date-row {
      display: flex; gap: 0.5rem; align-items: flex-start; width: 100%;
    }
    .date-row ha-form { flex: 1 1 8rem; }
    .field-error {
      width: 100%; color: var(--error-color, #d32f2f); font-size: 0.85em; margin-top: 0.2rem;
    }
    .remove {
      background: none; border: none; color: var(--secondary-text-color);
      cursor: pointer; font-size: 1em; padding: 0.25rem 0 0 0;
    }
    label.day-pill {
      display: inline-flex; align-items: center; gap: 0.25rem;
      padding: 0.15rem 0.4rem; border-radius: 3px;
      background: var(--secondary-background-color, #f5f5f5);
      cursor: pointer;
    }
  `,c([m({attribute:!1})],ue.prototype,"hass",2),c([m({attribute:!1})],ue.prototype,"value",2),c([m({attribute:!1})],ue.prototype,"dayConfig",2),ue=c([x("ambience-day-predicate-input")],ue);var Di=["temperature","apparent_temperature","humidity","wind_speed","pressure"],Pi=["<","<=",">",">="],Oi={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},ee=class extends y{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(e){let r=e.groups.length===0&&e.thresholds.length===0;this.value=r?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setGroups(e){this._emit({...this._current(),groups:e})}_addThreshold(){let e=this._current();e.thresholds=[...e.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(e)}_updateThreshold(e,r){let i=this._current();i.thresholds=i.thresholds.map((s,a)=>a===e?r:s),this._emit(i)}_removeThreshold(e){let r=this._current();r.thresholds=r.thresholds.filter((i,s)=>s!==e),this._emit(r)}_attributeSchema(e){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:Di.map(r=>({value:r,label:je(this.hass,r)}))}}}]}_opSchema(e){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:Pi.map(r=>({value:r,label:Oi[r]}))}}}]}_entityState(){let e=this.weatherEntity;return e?this.hass?.states?.[e]:void 0}_valueSchema(e,r){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:Rt(this.hass,r,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(e=>({value:e.id,label:e.label}))}}}]}_renderGroups(e){return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{groups:e}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setGroups(r.detail.value.groups??[])}}
      ></ha-form>`:l`${this.groups.map(r=>l`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${e.includes(r.id)}
          @change=${i=>{let s=i.target.checked;this._setGroups(s?[...e,r.id]:e.filter(a=>a!==r.id))}} />${r.label}
      </label>`)}`}_renderAttributeSelect(e,r){return customElements.get("ha-form")?l`<ha-form
        class="attr-form"
        .hass=${this.hass}
        .schema=${this._attributeSchema(e)}
        .data=${{attribute:r.attribute}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation();let s=i.detail.value.attribute;s&&this._updateThreshold(e,{...r,attribute:s})}}
      ></ha-form>`:l`<select
      @change=${i=>this._updateThreshold(e,{...r,attribute:i.target.value})}>
      ${Di.map(i=>l`<option value=${i} ?selected=${i===r.attribute}>${je(this.hass,i)}</option>`)}
    </select>`}_renderOpSelect(e,r){return customElements.get("ha-form")?l`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(e)}
        .data=${{op:r.op}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation();let s=i.detail.value.op;s&&this._updateThreshold(e,{...r,op:s})}}
      ></ha-form>`:l`<select
      @change=${i=>this._updateThreshold(e,{...r,op:i.target.value})}>
      ${Pi.map(i=>l`<option value=${i} ?selected=${i===r.op}>${Oi[i]}</option>`)}
    </select>`}_renderValueInput(e,r){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(e,r.attribute)}
        .data=${{value:r.value}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let a=s.detail.value.value;typeof a=="number"&&Number.isFinite(a)&&this._updateThreshold(e,{...r,value:a})}}
      ></ha-form>`;let i=Rt(this.hass,r.attribute,this._entityState());return l`<span class="value-wrap">
      <input type="number" .value=${String(r.value)}
        @change=${s=>{let a=Number(s.target.value);Number.isFinite(a)&&this._updateThreshold(e,{...r,value:a})}} />
      <span class="unit">${i}</span>
    </span>`}_renderThreshold(e,r){return l`
      <div class="threshold">
        ${this._renderAttributeSelect(e,r)}
        ${this._renderOpSelect(e,r)}
        ${this._renderValueInput(e,r)}
        <button class="remove" title=${u(this.hass,"ui.remove","Remove")} @click=${()=>this._removeThreshold(e)}>✕</button>
      </div>
    `}render(){let{groups:e,thresholds:r}=this._current();return l`
      <div class="section">
        <h4>${u(this.hass,"ui.groups","Groups")}</h4>
        ${this._renderGroups(e)}
      </div>
      <div class="section">
        <h4>${u(this.hass,"ui.thresholds","Thresholds")}</h4>
        ${r.map((i,s)=>this._renderThreshold(s,i))}
        <button class="add" @click=${()=>this._addThreshold()}>${u(this.hass,"ui.add_threshold","+ Add threshold")}</button>
      </div>
    `}};ee.styles=$`
    :host { display: block; }
    .section { margin-bottom: 1rem; }
    .section h4 { margin: 0 0 0.5rem 0; font-size: 0.95em; }
    /* ha-form-select carries extra bottom padding (for the helper/supporting
       text slot) while ha-form-number does not. flex-end aligns the OUTER
       box bottoms, which leaves the dropdowns' underlines sitting lower than
       the number's underline. Compensate by giving the dropdowns a matching
       margin-bottom, lifting their underlines up to meet the number's. */
    .threshold {
      display: flex; gap: 0.5rem; align-items: flex-end; margin-bottom: 0.4rem;
    }
    .threshold select, .threshold input { padding: 0.25rem; }
    .threshold ha-form { flex: 1; }
    /* Attribute names like "Apparent temperature" need room; comparators are
       single glyphs (<, ≤, >, ≥) and need very little. */
    .threshold .attr-form { flex: 2; }
    .threshold .op-form { flex: 0.5; }
    .threshold .attr-form,
    .threshold .op-form {
      margin-bottom: 2rem;
    }
    .threshold .value-wrap {
      display: inline-flex; align-items: center; gap: 0.25rem;
    }
    .threshold .unit {
      color: var(--secondary-text-color, #888);
      font-size: 0.9em;
      min-width: 2.5em;
    }
    .remove {
      background: none; border: none; color: var(--secondary-text-color);
      cursor: pointer; font-size: 1em; padding: 0;
      /* Sit next to the input area, lined up with the dropdowns' lifted
         underlines (which now have a 2rem margin-bottom). */
      margin-bottom: 2.4rem;
    }
    button.add {
      background: transparent; border: 1px dashed var(--divider-color, #ccc);
      padding: 0.4rem 0.75rem; border-radius: 4px; cursor: pointer;
      color: var(--primary-text-color, inherit);
    }
  `,c([m({attribute:!1})],ee.prototype,"hass",2),c([m({attribute:!1})],ee.prototype,"value",2),c([m({attribute:!1})],ee.prototype,"groups",2),c([m({attribute:!1})],ee.prototype,"weatherEntity",2),ee=c([x("ambience-weather-predicate-input")],ee);var H=class extends y{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[]}async updated(e){if(e.has("value")){let i=e.get("value")?.entity_id,s=this.value.entity_id;if(s&&s!==i&&this.hass)try{let a=await Hr(this.hass,s);this._knownStates=a.states}catch{this._knownStates=[]}}}_normalize(e){let r={...e};return r.attribute===""&&(r.attribute=null),r.for&&r.for.h===0&&r.for.m===0&&r.for.s===0&&(r.for=null),r}_emit(e){let r=this._normalize(e);this.value=r,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r},bubbles:!0,composed:!0}))}_autoFlipOp(e){let r=this._isNumericTargetFor(e),i=this._isNumericOp(e.kind);return r&&!i?{...e,kind:">"}:!r&&i?{...e,kind:"is"}:e}_setEntity(e){this._emit(this._autoFlipOp({...this.value,entity_id:e,states:[],attribute:null}))}_setAttribute(e){this._emit(this._autoFlipOp({...this.value,attribute:e}))}_setOp(e){this._emit({...this.value,kind:e})}_setStates(e){this._emit({...this.value,states:e})}_setValueAt(e,r){if(this._isNumericOp(this.value.kind)){this._setStates([r]);return}let i=this.value.states.slice();r===""?i.splice(e,1):i[e]=r,this._setStates(i)}_addValue(e){e&&this._setStates([...this.value.states,e])}_removeValueAt(e){let r=this.value.states.slice();r.splice(e,1),this._setStates(r)}_setForDuration(e){this._emit({...this.value,for:e})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(e){if(!e)return[];let i=this.hass?.states?.[e]?.attributes;return i?Object.keys(i).sort():[]}_attributeSchema(){let e=this._knownAttributesFor(this.value.entity_id);return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:H._STATE_SENTINEL,label:H._STATE_SENTINEL},...e.map(r=>({value:r,label:r}))]}}}]}_attributeData(){let e=this.value.attribute;return e?{attribute:e}:{attribute:H._STATE_SENTINEL}}_setAttributeFromHaForm(e){e===H._STATE_SENTINEL?this._setAttribute(""):this._setAttribute(e)}_isNumericOp(e){return H._NUMERIC_OPS.includes(e)}_isNumericTargetFor(e){let i=this.hass?.states?.[e.entity_id];if(!i)return!1;if(e.attribute)return typeof i.attributes?.[e.attribute]=="number";let s=i.state;return typeof s!="string"||s===""||s==="unknown"||s==="unavailable"?!1:Number.isFinite(Number(s))}_opSchema(){let e=this._isNumericTargetFor(this.value)?[...H._NUMERIC_OPS]:["is","is_not"];return e.includes(this.value.kind)||e.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:e.map(r=>({value:r,label:G(this.hass,r)}))}}}]}_currentAttributeValue(){return this.value.attribute?this.hass?.states?.[this.value.entity_id]?.attributes?.[this.value.attribute]:void 0}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let e;if(this.value.attribute){let r=this._currentAttributeValue();e=r==null?[]:[String(r)]}else e=this._knownStates;return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:e.map(r=>({value:r,label:r}))}}}]}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let e=this.value.for??{h:0,m:0,s:0};return{duration:{hours:e.h,minutes:e.m,seconds:e.s}}}_setForFromHaForm(e){this._setForDuration({h:e?.hours??0,m:e?.minutes??0,s:e?.seconds??0})}_renderEntity(){return customElements.get("ha-form")?l`<ha-form
        data-field="entity"
        .hass=${this.hass}
        .schema=${this._entitySchema()}
        .data=${{entity_id:this.value.entity_id}}
        .computeLabel=${()=>""}
        @value-changed=${e=>{e.stopPropagation(),this._setEntity(e.detail.value.entity_id??"")}}
      ></ha-form>`:l`<input
      data-field="entity"
      type="text"
      .value=${this.value.entity_id}
      @change=${e=>this._setEntity(e.target.value)}
    />`}_renderAttribute(){let e=this.value.attribute??"";return customElements.get("ha-form")?l`<ha-form
        data-field="attribute"
        .hass=${this.hass}
        .schema=${this._attributeSchema()}
        .data=${this._attributeData()}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setAttributeFromHaForm(r.detail.value.attribute??"")}}
      ></ha-form>`:l`<input
      data-field="attribute"
      type="text"
      placeholder=${u(this.hass,"ui.state_attribute_placeholder","leave blank to compare state")}
      .value=${e}
      @change=${r=>this._setAttribute(r.target.value)}
    />`}_renderOp(){return customElements.get("ha-form")?l`<ha-form
        class="op-form"
        data-field="op"
        .hass=${this.hass}
        .schema=${this._opSchema()}
        .data=${{op:this.value.kind}}
        .computeLabel=${()=>""}
        @value-changed=${e=>{e.stopPropagation();let r=e.detail.value.op;r&&this._setOp(r)}}
      ></ha-form>`:l`<select
      data-field="op"
      @change=${e=>this._setOp(e.target.value)}>
      <option value="is" ?selected=${this.value.kind==="is"}>is</option>
      <option value="is_not" ?selected=${this.value.kind==="is_not"}>is not</option>
    </select>`}_renderValueRow(e,r){let i=r===-1,s=i?d=>this._addValue(d):d=>this._setValueAt(r,d),a=this._isNumericOp(this.value.kind),o=a?{value:e===""?void 0:Number(e)}:{value:e};return customElements.get("ha-form")?l`
        <div class="value-row" data-row=${r}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${o}
            .computeLabel=${()=>""}
            @value-changed=${d=>{d.stopPropagation();let h=d.detail.value.value;s(h==null?"":String(h))}}
          ></ha-form>
        </div>
      `:l`
      <div class="value-row" data-row=${r}>
        <input type=${a?"number":"text"} .value=${e}
          placeholder=${i?u(this.hass,"ui.state_add_value","+ Add state"):""}
          @change=${d=>s(d.target.value)} />
      </div>
    `}_renderForRow(){if(customElements.get("ha-form"))return l`<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${this._forSchema()}
        .data=${this._forData()}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setForFromHaForm(r.detail.value.duration)}}
      ></ha-form>`;let e=this.value.for??{h:0,m:0,s:0};return l`
      <div class="for-row" data-field="for">
        <input type="number" min="0" .value=${String(e.h)}
          @change=${r=>this._setForDuration({...e,h:Number(r.target.value)||0})} />
        <span>:</span>
        <input type="number" min="0" .value=${String(e.m)}
          @change=${r=>this._setForDuration({...e,m:Number(r.target.value)||0})} />
        <span>:</span>
        <input type="number" min="0" .value=${String(e.s)}
          @change=${r=>this._setForDuration({...e,s:Number(r.target.value)||0})} />
      </div>
    `}render(){return l`
      <section class="field">
        <label class="field-label">${u(this.hass,"ui.state_entity","Entity")}</label>
        ${this._renderEntity()}
      </section>
      <section class="field where-op-row">
        <div class="where-cell">
          <label class="field-label">${u(this.hass,"ui.state_where","Where")}</label>
          ${this._renderAttribute()}
        </div>
        <div class="op-cell">
          <label class="field-label">${u(this.hass,"ui.state_op_header","Comparison")}</label>
          ${this._renderOp()}
        </div>
      </section>
      <section class="field">
        <label class="field-label">
          ${u(this.hass,"ui.state_value_label","Value")}
        </label>
        <div class="value-list">
          ${this._isNumericOp(this.value.kind)?this._renderValueRow(this.value.states[0]??"",0):l`
                ${this.value.states.map((e,r)=>this._renderValueRow(e,r))}
                ${this._renderValueRow("",-1)}
              `}
        </div>
      </section>
      <section class="field">
        <label class="field-label">${u(this.hass,"ui.state_for","For (optional)")}</label>
        ${this._renderForRow()}
      </section>
    `}};H.styles=$`
    :host { display: block; }
    .field { margin-bottom: 0.6rem; }
    .field-label {
      display: block;
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
      margin-bottom: 0.25rem;
    }
    .field ha-form { width: 100%; }
    .op-row { display: flex; gap: 0.5rem; align-items: flex-end; }
    .op-row .op-form { flex: 0 0 auto; min-width: 8rem; }
    .op-row .op-label { flex: 1; }
    /* HA-form-select carries extra bottom padding (helper-text slot) that
       smaller widgets lack. Lift the op so its underline matches. */
    .op-row .op-form { margin-bottom: 2rem; }
    /* Where + Comparison on one line. Where takes the wider share since
       it shows attribute names; Comparison is a short word/symbol. */
    .where-op-row { display: flex; gap: 0.5rem; align-items: flex-start; }
    .where-op-row .where-cell { flex: 2; min-width: 0; }
    .where-op-row .op-cell { flex: 1; min-width: 0; }
    .value-list { display: flex; flex-direction: column; gap: 0.4rem; }
    .value-row { display: flex; gap: 0.5rem; align-items: center; }
    .value-row ha-form { flex: 1; }
    /* jsdom-only native fallbacks */
    select, input[type="text"], input[type="number"] {
      padding: 0.25rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
    .for-row { display: flex; gap: 0.25rem; align-items: center; }
    .for-row input[type='number'] { width: 3.5rem; }
  `,H._STATE_SENTINEL="State",H._NUMERIC_OPS=[">",">=","<","<="],c([m({attribute:!1})],H.prototype,"hass",2),c([m({attribute:!1})],H.prototype,"value",2),c([g()],H.prototype,"_knownStates",2),H=c([x("ambience-state-expr-atom")],H);function nr(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,r)=>e===n[r])}var j=class extends y{constructor(){super(...arguments);this.path=[];this._dragOver=!1;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(e,r={}){this.dispatchEvent(new CustomEvent(e,{detail:{path:this.path,...r},bubbles:!0,composed:!0}))}_atomIsComplete(e){return!!e.entity_id&&e.states.some(r=>r!=="")}_isErrorTarget(){return nr(this.path,this.errorPath)}_onDragStart(e){if(this.path.length===0){e.preventDefault();return}let r=e.target;if(r&&r.closest("button, select, input, textarea, ha-form")){e.preventDefault();return}e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("application/x-ambience-path",JSON.stringify(this.path)))}_onDragOver(e){this.path.length!==0&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._dragOver=!0)}_onDragLeave(e){e.stopPropagation(),this._dragOver=!1}_onDrop(e){if(this.path.length===0||(e.preventDefault(),e.stopPropagation(),this._dragOver=!1,!e.dataTransfer))return;let r=e.dataTransfer.getData("application/x-ambience-path");if(!r)return;let i;try{i=JSON.parse(r)}catch{return}!Array.isArray(i)||i.every(s=>typeof s=="number")===!1||nr(i,this.path)||this.dispatchEvent(new CustomEvent("node-move",{detail:{from:i,to:this.path},bubbles:!0,composed:!0}))}_renderAtomCard(e,r){let i=this._atomIsComplete(e),s=nr(this.path,this.openPath),a=i?Ut(e,{hass:this.hass}):u(this.hass,"ui.state_new_condition","(new condition)");return l`
      <div class="atom-card ${s?"expanded":"collapsed"} ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}>
        <div class="atom-header"
          draggable=${this.path.length>0}
          @dragstart=${this._onDragStart}
          @click=${()=>this._emit("node-open")}>
          <button class="not-toggle ${r?"on":""}"
            title=${u(this.hass,"ui.state_not_toggle","Negate (NOT)")}
            @click=${o=>{o.stopPropagation(),this._emit("node-toggle-not")}}>${G(this.hass,"not")}</button>
          <span class="summary ${i?"":"placeholder"}">${a}</span>
          <button class="wrap"
            title=${u(this.hass,"ui.state_wrap","Wrap in group")}
            @click=${o=>{o.stopPropagation(),this._emit("node-wrap")}}>(…)</button>
          <button class="remove"
            title=${u(this.hass,"ui.remove","Remove")}
            @click=${o=>{o.stopPropagation(),this._emit("node-remove")}}>✕</button>
        </div>
        ${s?l`
          <div class="atom-body">
            <ambience-state-expr-atom
              .hass=${this.hass}
              .value=${e}
              @value-changed=${o=>{o.stopPropagation(),this._emit("node-change",{value:o.detail.value})}}
            ></ambience-state-expr-atom>
            ${this._isErrorTarget()&&this.errorMessage?l`<div class="atom-error">${this.errorMessage}</div>`:""}
          </div>
        `:""}
      </div>
    `}_renderChildRow(e,r){let i=[...this.path,r];return l`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${e}
        .path=${i}
        .openPath=${this.openPath}
        .errorPath=${this.errorPath}
        .errorMessage=${this.errorMessage}
      ></ambience-state-expr-node>
    `}_renderGroup(e){return l`
      <div class="group ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}>
        <div class="group-header"
          draggable=${this.path.length>0}
          @dragstart=${this._onDragStart}>
          <select class="group-op"
            @change=${r=>this._emit("node-set-op",{op:r.target.value})}>
            <option value="and" ?selected=${e.kind==="and"}>${G(this.hass,"and")}</option>
            <option value="or"  ?selected=${e.kind==="or"} >${G(this.hass,"or")}</option>
          </select>
          <button class="unwrap"
            title=${u(this.hass,"ui.state_unwrap_group","Remove these parens (promote children to parent)")}
            @click=${()=>this._emit("node-unwrap")}>✕</button>
        </div>
        <div class="group-children">
          ${e.items.map((r,i)=>this._renderChildRow(r,i))}
        </div>
        <div class="actions">
          <button @click=${()=>this._emit("node-add-child")}>
            + ${u(this.hass,"ui.state_add_condition","Add condition")}
          </button>
        </div>
      </div>
    `}render(){let e=this.value.kind==="not",r=e?this.value.item:this.value;return r.kind==="and"||r.kind==="or"?this._renderGroupWithExternalNot(r,e):this._renderAtomCard(r,e)}_renderGroupWithExternalNot(e,r){let i=this.path.length===0;return l`
      <div class="group-wrap">
        ${i?"":l`<button class="not-toggle external ${r?"on":""}"
          title=${u(this.hass,"ui.state_not_toggle","Negate (NOT)")}
          @click=${()=>this._emit("node-toggle-not")}>${G(this.hass,"not")}</button>`}
        ${this._renderGroup(e)}
      </div>
    `}};j.styles=$`
    :host { display: block; }
    .group-wrap {
      display: flex; align-items: flex-start; gap: 0.4rem;
      margin: 0.25rem 0;
    }
    .group-wrap > .group { flex: 1; min-width: 0; margin: 0; }
    /* External NOT on a group sits next to the card, scoping visually to
       the whole group. Tone-down when off (same treatment as the in-atom
       NOT toggle); loud when on. */
    .group-wrap > .not-toggle.external {
      background: transparent; border: 1px solid transparent;
      border-radius: 4px; padding: 0.1rem 0.35rem; margin-top: 0.4rem;
      cursor: pointer; font-size: 0.85em;
      color: var(--secondary-text-color, #888); opacity: 0.6;
    }
    .group-wrap > .not-toggle.external:hover {
      opacity: 1; border-color: var(--divider-color, #ccc);
    }
    .group-wrap > .not-toggle.external.on {
      background: var(--warning-color, #ffd);
      border-color: var(--warning-color, #cc9);
      color: inherit; opacity: 1; font-weight: 600;
    }
    .group {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.4rem; margin: 0.25rem 0;
      background: var(--secondary-background-color, transparent);
    }
    .group-header {
      display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .group-op {
      padding: 0.15rem 0.5rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
    /* Nested groups no longer indent — the bordered card already conveys
       hierarchy. This keeps the form full-width regardless of depth. */
    .group-children { display: flex; flex-direction: column; gap: 0.25rem; }
    .actions button {
      background: transparent; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.15rem 0.4rem; cursor: pointer;
      font-size: 0.85em; color: inherit;
    }
    .actions { display: flex; gap: 0.25rem; margin-top: 0.5rem; }

    .atom-card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
    }
    .atom-header {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.4rem 0.6rem; cursor: pointer; user-select: none;
    }
    .atom-card.expanded .atom-header { border-bottom: 1px solid var(--divider-color, #eee); }
    .atom-card.collapsed .atom-header:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .atom-header .summary {
      flex: 1; min-width: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .atom-header .summary.placeholder {
      color: var(--secondary-text-color, #888); font-style: italic;
    }
    .atom-header .remove {
      background: none; border: none; color: var(--secondary-text-color, #888);
      cursor: pointer; font-size: 1em; padding: 0 0.25rem;
    }
    .atom-header .not-toggle,
    .atom-header .wrap,
    .group-header .not-toggle,
    .group-header .wrap,
    .group-header .unwrap {
      background: transparent; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.1rem 0.35rem; cursor: pointer;
      font-size: 0.85em; color: inherit;
    }
    /* When NOT is OFF it's a quiet, low-contrast affordance — the
       border fades into the card and the label uses secondary text
       colour so it doesn't compete with the summary. */
    .atom-header .not-toggle,
    .group-header .not-toggle {
      border-color: transparent;
      color: var(--secondary-text-color, #888);
      opacity: 0.6;
    }
    .atom-header .not-toggle:hover,
    .group-header .not-toggle:hover {
      opacity: 1;
      border-color: var(--divider-color, #ccc);
    }
    /* Active state is loud — the negation is in effect, the user should
       see it at a glance. */
    .atom-header .not-toggle.on,
    .group-header .not-toggle.on {
      background: var(--warning-color, #ffd);
      border-color: var(--warning-color, #cc9);
      color: inherit;
      opacity: 1;
      font-weight: 600;
    }
    .group-header .unwrap {
      margin-left: auto;
      border: none; background: none; padding: 0 0.25rem;
      color: var(--secondary-text-color, #888); font-size: 1em;
    }
    .atom-body { padding: 0.5rem 0.75rem; }
    /* Drag-over highlight — applied to either an atom card or a group
       card. The active outline overrides the default border so the drop
       target is unmistakable. */
    .atom-card.drag-over,
    .group.drag-over {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -2px;
    }
    /* Hint that the header — and only the header — is grabbable. The
       summary text and empty padding inside the header pick up grab; the
       buttons keep their own cursor via the default cascade. */
    .atom-header[draggable="true"],
    .group-header[draggable="true"] { cursor: grab; }
    .atom-error {
      margin-top: 0.5rem;
      color: var(--error-color, #b71c1c);
      font-size: 0.9em;
    }
  `,c([m({attribute:!1})],j.prototype,"hass",2),c([m({attribute:!1})],j.prototype,"value",2),c([m({attribute:!1})],j.prototype,"path",2),c([g()],j.prototype,"_dragOver",2),c([m({attribute:!1})],j.prototype,"openPath",2),c([m({attribute:!1})],j.prototype,"errorPath",2),c([m({attribute:!1})],j.prototype,"errorMessage",2),j=c([x("ambience-state-expr-node")],j);function sr(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,r)=>e===n[r])}var te=class extends y{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._onNodeMove=e=>{e.stopPropagation(),this._moveAt(e.detail.from,e.detail.to)};this._onNodeChange=e=>{e.stopPropagation(),this._replaceAt(e.detail.path,e.detail.value)};this._onNodeRemove=e=>{e.stopPropagation(),this._removeAt(e.detail.path)};this._onNodeWrap=e=>{e.stopPropagation(),this._wrapAt(e.detail.path)};this._onNodeAddChild=e=>{e.stopPropagation(),this._addChildAt(e.detail.path,"is")};this._onNodeToggleNot=e=>{e.stopPropagation(),this._toggleNotAt(e.detail.path)};this._onNodeSetOp=e=>{e.stopPropagation(),this._setGroupOpAt(e.detail.path,e.detail.op)};this._onNodeUnwrap=e=>{e.stopPropagation(),this._unwrapAt(e.detail.path)};this._onNodeOpen=e=>{if(e.stopPropagation(),this._openPath!==null){let r=this._atomAt(this._openPath);if(r&&this._atomError(r)!==null){this._showError=!0;return}}this._openPath!==null&&sr(this._openPath,e.detail.path)?this._openPath=null:this._openPath=e.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-move",this._onNodeMove)}_emit(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(e,r){let i=this._patch(this.value,e,()=>r);this._emit(i)}_removeAt(e){if(e.length===0){this._emit(null);return}let r=this._patch(this.value,e,()=>null);this._emit(r)}_wrapAt(e){let r=null;if(e.length>0){let a=this._nodeAt(e.slice(0,-1));a&&(a.kind==="and"||a.kind==="or")&&(r=a.kind)}let i=r==="and"?"or":"and",s=this._patch(this.value,e,a=>a&&{kind:i,items:[a]});this._emit(s)}_nodeAt(e){return this._walkNode(this.value,e)}_moveAt(e,r){if(this._isPrefix(e,r)||e.length===0||r.length===0)return;let i=this._nodeAt(e);if(!i)return;let s=this._rewriteForMove(this.value,[],e,r,i);this._emit(s)}_isPrefix(e,r){return e.length>r.length?!1:e.every((i,s)=>i===r[s])}_rewriteForMove(e,r,i,s,a){if(!e)return e;if(e.kind==="not"){let _=this._rewriteForMove(e.item,r,i,s,a);return _==null?null:{kind:"not",item:_}}if(e.kind!=="and"&&e.kind!=="or")return e;let o=i.slice(0,-1),d=s.slice(0,-1),h=sr(r,o),f=sr(r,d),p=[];if(e.items.forEach((_,v)=>{let k=[...r,v];if(h&&v===i[i.length-1])return;let w=this._rewriteForMove(_,k,i,s,a);w!==null&&p.push(w)}),f){let _=s[s.length-1];p.splice(_,0,a)}return p.length===0?null:{...e,items:p}}_walkNode(e,r){return e?e.kind==="not"?this._walkNode(e.item,r):r.length===0?e:e.kind==="and"||e.kind==="or"?this._walkNode(e.items[r[0]]??null,r.slice(1)):null:null}_addChildAt(e,r){let i=null,s=this._patch(this.value,e,a=>{if(a&&(a.kind==="and"||a.kind==="or")){let o=[...a.items,this._emptyAtom()];return i=[...e,o.length-1],{...a,items:o}}return a});i!==null&&(this._openPath=i),this._emit(s)}_toggleNotAt(e){let r=this._patch(this.value,e,i=>i&&(i.kind==="not"?i.item:{kind:"not",item:i}));this._emit(r)}_setGroupOpAt(e,r){let i=this._patch(this.value,e,s=>{if(!s)return s;let a=null;if(s.kind==="and"||s.kind==="or")a=s;else if(s.kind==="not"){let o=s.item;(o.kind==="and"||o.kind==="or")&&(a=o)}return a?{kind:r,items:a.items}:s});this._emit(i)}_patch(e,r,i){if(r.length===0)return i(e);if(e==null)return e;let[s,...a]=r;if(e.kind==="and"||e.kind==="or"){let o=e.items.length,d=e.items.slice(),h=this._patch(d[s],a,i);if(h===null?d.splice(s,1):d[s]=h,d.length<o){if(d.length===0)return null;if(d.length===1)return d[0]}return{...e,items:d}}if(e.kind==="not"){let o=this._patch(e.item,r,i);return o==null?null:{kind:"not",item:o}}return e}_atomAt(e){return this._walk(this.value,e)}_walk(e,r){return e?e.kind==="not"?this._walk(e.item,r):r.length===0?e.kind==="and"||e.kind==="or"?null:e:e.kind==="and"||e.kind==="or"?this._walk(e.items[r[0]]??null,r.slice(1)):null:null}_atomError(e){if(!e.entity_id)return u(this.hass,"ui.state_err_entity","Entity is required");if(e.kind!=="is"&&e.kind!=="is_not"){let i=e.states[0];if(!i)return u(this.hass,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(i)))return u(this.hass,"ui.state_err_numeric","Value must be a number")}else if(!e.states.some(i=>i!==""))return u(this.hass,"ui.state_err_state","State is required");return null}_unwrapAt(e){if(e.length===0){let a=this.value;if(!a)return;let o=a.kind==="not"?a.item:a;(o.kind==="and"||o.kind==="or")&&(o.items.length===1?this._emit(o.items[0]):this._emit(null));return}let r=e.slice(0,-1),i=e[e.length-1],s=this._patch(this.value,r,a=>{if(!a||a.kind!=="and"&&a.kind!=="or")return a;let o=a.items.slice(),d=o[i],h=null;if(d.kind==="and"||d.kind==="or")h=d;else if(d.kind==="not"){let f=d.item;(f.kind==="and"||f.kind==="or")&&(h=f)}return h?(o.splice(i,1,...h.items),{...a,items:o}):a});this._emit(s)}willUpdate(e){if(e.has("value")){let r=this.value;if(r&&this._openPath===null&&r.kind!=="and"&&r.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let i=this._atomAt(this._openPath);(!i||this._atomError(i)===null)&&(this._showError=!1)}}}_addAtRoot(){let e=this.value;if(e==null){this._addFirstAtom();return}if(e.kind==="and"||e.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[e,this._emptyAtom()]})}_setOpen(e){this._openPath=e}render(){if(this.value==null)return l`
        <div class="empty">
          <button @click=${()=>this._addFirstAtom()}>
            + ${u(this.hass,"ui.state_add_first","Add condition")}
          </button>
        </div>
      `;let e=this._showError&&this._openPath!==null?(()=>{let s=this._atomAt(this._openPath);return s?this._atomError(s):null})():null,r=this.value.kind==="not"?this.value.item:this.value,i=r.kind!=="and"&&r.kind!=="or";return l`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${this.value}
        .path=${[]}
        .openPath=${this._openPath}
        .errorPath=${e?this._openPath:null}
        .errorMessage=${e}
      ></ambience-state-expr-node>
      ${i?l`
        <button class="root-add" @click=${()=>this._addAtRoot()}>
          + ${u(this.hass,"ui.state_add_condition","Add condition")}
        </button>
      `:""}
    `}};te.styles=$`
    :host { display: block; }
    .empty {
      border: 1px dashed var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.75rem; text-align: center;
      color: var(--secondary-text-color, #888);
    }
    .empty button {
      background: transparent; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.25rem 0.75rem; cursor: pointer;
      color: inherit;
    }
    .root-add {
      display: block; margin-top: 0.5rem;
      background: transparent; border: 1px dashed var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.25rem 0.75rem; cursor: pointer;
      color: inherit; width: 100%; text-align: center;
    }
  `,c([m({attribute:!1})],te.prototype,"hass",2),c([m({attribute:!1})],te.prototype,"value",2),c([g()],te.prototype,"_openPath",2),c([g()],te.prototype,"_showError",2),te=c([x("ambience-state-predicate-input")],te);var z=class extends y{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onText(e){let r=e.target.value;this._emit(r.trim()===""?null:r)}render(){return this.matcher.input==="time_of_day"?l`
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
      `:this.matcher.input==="script_predicate"?l`
        <ambience-script-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-script-predicate-input>
      `:this.matcher.input==="day_predicate"?l`
        <ambience-day-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .dayConfig=${this.dayConfig??{workday_sensor:null,workday_calendar:null}}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-day-predicate-input>
      `:this.matcher.input==="weather_predicate"?l`
        <ambience-weather-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .groups=${this.weatherConfig?.groups??[]}
          .weatherEntity=${this.weatherConfig?.entity??void 0}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-weather-predicate-input>
      `:this.matcher.input==="state_predicate"?l`
        <ambience-state-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-state-predicate-input>
      `:l`
      <input
        type="text"
        placeholder=${u(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};z.styles=$`
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
  `,c([m({attribute:!1})],z.prototype,"matcher",2),c([m({attribute:!1})],z.prototype,"value",2),c([m({attribute:!1})],z.prototype,"sceneSuggestions",2),c([m({attribute:!1})],z.prototype,"periods",2),c([m({attribute:!1})],z.prototype,"dayConfig",2),c([m({attribute:!1})],z.prototype,"weatherConfig",2),c([m({attribute:!1})],z.prototype,"hass",2),z=c([x("ambience-matcher-input")],z);var C=class extends y{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._open=null;this._showError=!1;this._serviceHasTarget=new Map;this._onNameInput=e=>{this._setName(e.target.value)};this._onAddMatcher=e=>{let r=e.target,i=r.value;r.value="",this._addMatcher(i)};this._onAddMatcherHaForm=e=>{e.stopPropagation();let r=e.detail.value.add;r!==C._ADD_MATCHER_PLACEHOLDER&&this._addMatcher(r)};this._onAddAction=e=>{let r=e.target,i=r.value;r.value="",this._addActionSlot(i)};this._onAddActionHaForm=e=>{e.stopPropagation();let r=e.detail.value.add;r!==C._ADD_ACTION_PLACEHOLDER&&this._addActionSlot(r)}}connectedCallback(){super.connectedCallback(),Y(this,this.hass)}willUpdate(e){e.has("open")&&this.open&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null,this._open=null,this._showError=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"}))return l`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
        </div>
      `;let i=ft(this._draft,u(this.hass,"ui.new_rule","New rule"));return l`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${i}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let r=wr();return r==="ha-input"?l`<ha-input label=${u(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:r==="ha-textfield"?l`<ha-textfield label=${u(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:l`<input type="text" .value=${e} @input=${this._onNameInput} />`}_isOpen(e){return this._open===null?!1:e.kind==="name"&&this._open.kind==="name"?!0:e.kind==="matcher"&&this._open.kind==="matcher"?e.id===this._open.id:e.kind==="action"&&this._open.kind==="action"?e.idx===this._open.idx:!1}_validationError(e){if(e===null||e.kind==="name"||e.kind==="matcher")return null;let r=this._draft?.actions[e.idx];if(!r)return null;let i=this._serviceHasTarget.get(r.service);return r.entity_ids.length===0&&i===!0?u(this.hass,"ui.at_least_one_target","At least one target is required."):null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){this._open=null,this._showError=!1;return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let r of e.composedPath())if(r instanceof Element&&(r.classList.contains("slot")||r.classList.contains("actions-bar")||r.classList.contains("add-matcher")||r.classList.contains("add-action")))return;this._tryCloseCurrent()}_setPredicate(e,r){if(!this._draft)return;let i={...this._draft.when};r==null?delete i[e]:i[e]=r,this._draft={...this._draft,when:i}}_renderMatcherRow(e){let r=this._draft.when[e.name]??null,i=this._isOpen({kind:"matcher",id:e.name}),s=e.input==="scene_combobox";if(i&&s)return l`
        <div class="slot combobox-slot expanded" data-slot-id=${e.name}>
          <ambience-matcher-input
            .hass=${this.hass}
            .matcher=${e}
            .value=${r}
            .sceneSuggestions=${this.sceneSuggestions}
            .periods=${this.periods}
            .dayConfig=${this.dayConfig}
            .weatherConfig=${this.weatherConfig}
            @value-changed=${o=>this._setPredicate(e.name,o.detail.value)}
          ></ambience-matcher-input>
        </div>
      `;let a=gt(e.name,r,{hass:this.hass,periods:this.periods});return l`
      <div class="slot ${i?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"matcher",id:e.name})}>
          <span class="summary-label"><strong>${oe(this.hass,e.name)}:</strong> ${a}</span>
          <button
            class="remove"
            @click=${o=>{o.stopPropagation(),this._removeMatcher(e.name)}}
            title=${u(this.hass,"ui.remove_condition","Remove condition")}
          >✕</button>
        </div>
        ${i?l`
          <div class="body">
            <ambience-matcher-input
              .hass=${this.hass}
              .matcher=${e}
              .value=${r}
              .sceneSuggestions=${this.sceneSuggestions}
              .periods=${this.periods}
              .dayConfig=${this.dayConfig}
              .weatherConfig=${this.weatherConfig}
              @value-changed=${o=>this._setPredicate(e.name,o.detail.value)}
            ></ambience-matcher-input>
          </div>
        `:""}
      </div>
    `}_visibleMatchers(){if(!this._draft)return[];let e=this._draft.when;return this.matchers.filter(r=>r.name in e&&e[r.name]!=null||this._open?.kind==="matcher"&&this._open.id===r.name)}_unusedMatchers(){let e=new Set(this._visibleMatchers().map(r=>r.name));return this.matchers.filter(r=>!e.has(r.name))}_addMatcher(e){e&&(this._open!==null&&!this._tryCloseCurrent()||(this._open={kind:"matcher",id:e},this._showError=!1))}_removeMatcher(e){if(!this._draft)return;let r={...this._draft.when};delete r[e],this._draft={...this._draft,when:r},this._open?.kind==="matcher"&&this._open.id===e&&(this._open=null,this._showError=!1)}_renderAddMatcher(){let e=this._unusedMatchers();return e.length===0?"":customElements.get("ha-form")?this._renderAddMatcherHaForm(e):l`
      <div class="add-matcher">
        <select class="add-matcher" @change=${this._onAddMatcher}>
          <option value="">${u(this.hass,"ui.add_condition","+ Add condition\u2026")}</option>
          ${e.map(r=>l`<option value=${r.name}>${oe(this.hass,r.name)}</option>`)}
        </select>
      </div>
    `}_renderAddMatcherHaForm(e){let r=u(this.hass,"ui.add_condition","+ Add condition\u2026"),i=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:C._ADD_MATCHER_PLACEHOLDER,label:r},...e.map(s=>({value:s.name,label:oe(this.hass,s.name)}))]}}}];return l`
      <div class="add-matcher">
        <ha-form
          .hass=${this.hass}
          .schema=${i}
          .data=${{add:C._ADD_MATCHER_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddMatcherHaForm}
        ></ha-form>
      </div>
    `}_addActionSlot(e){if(!this._draft||!e||this._open!==null&&!this._tryCloseCurrent())return;let r={service:e,entity_ids:[],params:{}},i=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,r]},this._open={kind:"action",idx:i},this._showError=!1}_actionOptionLabel(e){return e.label&&e.label.trim()?e.label:e.id}_renderAddAction(){return this.availableActions.length===0?l`
        <p class="add-action-empty">
          ${u(this.hass,"ui.no_exposed_actions","Add services in Settings \u2192 Actions.")}
        </p>
      `:customElements.get("ha-form")?this._renderAddActionHaForm():l`
      <div class="add-action">
        <select class="add-action" @change=${this._onAddAction}>
          <option value="">${u(this.hass,"ui.add_action","+ Add action\u2026")}</option>
          ${this.availableActions.map(e=>l`
            <option value=${e.id}>${this._actionOptionLabel(e)}</option>
          `)}
        </select>
      </div>
    `}_renderAddActionHaForm(){let e=u(this.hass,"ui.add_action","+ Add action\u2026"),r=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:C._ADD_ACTION_PLACEHOLDER,label:e},...this.availableActions.map(i=>({value:i.id,label:this._actionOptionLabel(i)}))]}}}];return l`
      <div class="add-action">
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{add:C._ADD_ACTION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddActionHaForm}
        ></ha-form>
      </div>
    `}_updateActionAt(e,r){if(!this._draft)return;let i=this._draft.actions.map((s,a)=>a===e?r(s):s);this._draft={...this._draft,actions:i}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((r,i)=>i!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,r){this._updateActionAt(e,i=>({...i,entity_ids:r}))}_setActionParams(e,r){this._updateActionAt(e,i=>({...i,params:r}))}_onTargetModeChanged(e,r){this._serviceHasTarget.get(e)!==r&&(this._serviceHasTarget=new Map(this._serviceHasTarget).set(e,r))}_renderActionRow(e,r){let i=this.availableActions.find(o=>o.id===e.service),s=this._isOpen({kind:"action",idx:r}),a=jr(e,{hass:this.hass,exposedActions:this.availableActions});return l`
      <div class="slot ${s?"expanded":"collapsed"}" data-slot-id="action-${r}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:r})}>
          <span class="summary-label">${a}</span>
          <button class="remove" @click=${o=>{o.stopPropagation(),this._deleteAction(r)}} title=${u(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${s?l`
          <div class="body">
            <ambience-action-slot
              .hass=${this.hass}
              .scope=${this.scope}
              .exposed=${i}
              .entityIds=${e.entity_ids}
              .params=${e.params}
              @entity-ids-changed=${o=>{o.stopPropagation(),this._setActionTargets(r,o.detail.entityIds)}}
              @params-changed=${o=>{o.stopPropagation(),this._setActionParams(r,o.detail.params)}}
              @target-mode-changed=${o=>{o.stopPropagation(),this._onTargetModeChanged(e.service,o.detail.hasTarget)}}
            ></ambience-action-slot>

            ${this._showError&&this._validationError({kind:"action",idx:r})?l`
              <div class="error">${this._validationError({kind:"action",idx:r})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_save(){if(!this._draft)return;let e=Object.fromEntries(Object.entries(this._draft.when).filter(([,r])=>r!=null));this.dispatchEvent(new CustomEvent("save-rule",{detail:{...this._draft,when:e},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){if(!this._draft)return l``;let e=this._visibleMatchers();return l`
      <div class="modal" @click=${this._onModalClick}>
        <div class="content">
          ${this._renderNameSlot()}

          <h3>${u(this.hass,"ui.when_heading","When")}</h3>
          ${e.map(r=>this._renderMatcherRow(r))}
          ${this._renderAddMatcher()}

          <h3>${u(this.hass,"ui.actions_heading","Actions")}</h3>
          ${this._draft.actions.map((r,i)=>this._renderActionRow(r,i))}
          ${this._renderAddAction()}
        </div>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>${u(this.hass,"ui.cancel","Cancel")}</button>
          <button class="primary" @click=${this._save}>${u(this.hass,"ui.save_rule","Save rule")}</button>
        </div>
      </div>
    `}};C.styles=$`
    :host {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 100;
      align-items: stretch; justify-content: center;
    }
    :host([open]) { display: flex; }
    .modal {
      background: var(--card-background-color, #fff); color: inherit;
      width: 90%; max-width: 40rem;
      height: 100vh; max-height: 100vh;
      display: flex; flex-direction: column;
    }
    .content {
      flex: 1; min-height: 0;
      overflow-y: auto;
      padding: 1.5rem;
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
      display: flex; justify-content: flex-end; gap: 0.5rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      flex-shrink: 0;
    }
    select.add-matcher, select.add-action {
      margin-top: 0.5rem;
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
    .add-action-empty {
      color: var(--secondary-text-color, #888);
      font-style: italic;
      margin: 0.5rem 0;
      padding: 0.5rem 0;
    }
    .error {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      margin-top: 0.5rem;
      padding: 0.3rem 0;
    }
  `,C._ADD_MATCHER_PLACEHOLDER="__add_matcher__",C._ADD_ACTION_PLACEHOLDER="__add_action__",c([m({type:Boolean,reflect:!0})],C.prototype,"open",2),c([m({attribute:!1})],C.prototype,"rule",2),c([m({attribute:!1})],C.prototype,"matchers",2),c([m({attribute:!1})],C.prototype,"sceneSuggestions",2),c([m({attribute:!1})],C.prototype,"periods",2),c([m({attribute:!1})],C.prototype,"dayConfig",2),c([m({attribute:!1})],C.prototype,"weatherConfig",2),c([m({attribute:!1})],C.prototype,"availableActions",2),c([m({attribute:!1})],C.prototype,"hass",2),c([m({attribute:!1})],C.prototype,"scope",2),c([g()],C.prototype,"_draft",2),c([g()],C.prototype,"_open",2),c([g()],C.prototype,"_showError",2),c([g()],C.prototype,"_serviceHasTarget",2),C=c([x("ambience-rule-editor")],C);function Ni(t){return t.kind==="house"?"house":`${t.kind}:${t.id}`}function Et(t){return{rules:t.rules??[],auto_sort:t.auto_sort??!0}}var T=class extends y{constructor(){super(...arguments);this._areas=[];this._floors=[];this._areaConfigs=new Map;this._floorConfigs=new Map;this._house={rules:[],auto_sort:!0};this._matchers=[];this._actions=[];this._expanded=new Set;this._error="";this._editing=null;this._onExposedActionsChanged=async()=>{try{let e=await ze(this.hass);if(!this.isConnected)return;this._actions=e}catch{}}}async connectedCallback(){super.connectedCallback(),window.addEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),await this._loadStatic(),await Promise.all([this._refreshAreas(),this._refreshFloors(),this._refreshHouse()]),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),this._unsubArea?.(),this._unsubArea=void 0,this._unsubFloor?.(),this._unsubFloor=void 0}async _loadStatic(){try{let[e,r,i,s,a]=await Promise.all([ut(this.hass),ze(this.hass),ht(this.hass),pt(this.hass),mt(this.hass)]);if(!this.isConnected)return;this._matchers=e,this._actions=r,this._periods=i,this._dayConfig=s,this._weatherConfig=a}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await st(this.hass),r=this._areaConfigs,i=new Map;if(await Promise.all(e.map(async s=>{let a=r.get(s.area_id);if(a){i.set(s.area_id,a);return}i.set(s.area_id,Et(await at(this.hass,s.area_id)))})),!this.isConnected)return;this._areas=e,this._areaConfigs=i}catch(e){this._error=e.message||String(e)}}async _refreshFloors(){try{let e=(await ot(this.hass)).slice().sort((s,a)=>s.name.localeCompare(a.name)),r=this._floorConfigs,i=new Map;if(await Promise.all(e.map(async s=>{let a=r.get(s.floor_id);if(a){i.set(s.floor_id,a);return}i.set(s.floor_id,Et(await lt(this.hass,s.floor_id)))})),!this.isConnected)return;this._floors=e,this._floorConfigs=i}catch(e){this._error=e.message||String(e)}}async _refreshHouse(){try{let e=Et(await dt(this.hass));if(!this.isConnected)return;this._house=e}catch(e){this._error=e.message||String(e)}}async _subscribe(){let e=this.hass.connection.subscribeEvents(a=>{if(a.data.action==="remove"){let o=a.data.area_id,d=new Set(this._expanded);d.delete(`area:${o}`),this._expanded=d,this._editing?.scope.kind==="area"&&this._editing.scope.id===o&&(this._editing=null)}this._refreshAreas()},"area_registry_updated"),r=this.hass.connection.subscribeEvents(a=>{if(a.data.action==="remove"){let o=a.data.floor_id,d=new Set(this._expanded);d.delete(`floor:${o}`),this._expanded=d,this._editing?.scope.kind==="floor"&&this._editing.scope.id===o&&(this._editing=null)}this._refreshFloors()},"floor_registry_updated"),[i,s]=await Promise.all([e,r]);this.isConnected?(this._unsubArea=i,this._unsubFloor=s):(i(),s())}_getConfig(e){return e.kind==="house"?this._house:e.kind==="area"?this._areaConfigs.get(e.id):this._floorConfigs.get(e.id)}_setConfig(e,r){if(e.kind==="house")this._house=r;else if(e.kind==="area"){let i=new Map(this._areaConfigs);i.set(e.id,r),this._areaConfigs=i}else{let i=new Map(this._floorConfigs);i.set(e.id,r),this._floorConfigs=i}}async _mutate(e,r){let i=this._getConfig(e);this._setConfig(e,r),this._error="";try{let s;e.kind==="house"?s=await Sr(this.hass,r):e.kind==="area"?s=await kr(this.hass,e.id,r):s=await Er(this.hass,e.id,r),this._setConfig(e,Et(s.config))}catch(s){i&&this._setConfig(e,i),this._error=s.message||String(s)}}_toggleExpand(e){let r=Ni(e),i=new Set(this._expanded);i.has(r)?i.delete(r):i.add(r),this._expanded=i}_toggleAutoSort(e,r){let i=this._getConfig(e);i&&this._mutate(e,{...i,auto_sort:r})}_addRule(e){let r=this._getConfig(e);r&&(this._editing={scope:e,index:r.rules.length,isNew:!0})}_editRule(e,r){this._editing={scope:e,index:r.detail.index,isNew:!1}}_duplicateRule(e,r){let i=this._getConfig(e);if(!i)return;let s=i.rules[r.detail.index];if(!s)return;let a=JSON.parse(JSON.stringify(s)),o=[...i.rules];o.splice(r.detail.index+1,0,a),this._mutate(e,{...i,rules:o})}_deleteRule(e,r){let i=this._getConfig(e);if(!i)return;let s=i.rules.filter((a,o)=>o!==r.detail.index);this._mutate(e,{...i,rules:s})}_reorderRules(e,r){let i=this._getConfig(e);if(!i)return;let{from:s,to:a}=r.detail,o=[...i.rules],[d]=o.splice(s,1);o.splice(a,0,d),this._mutate(e,{...i,rules:o})}_saveRule(e){let r=this._editing;if(this._editing=null,!r)return;let i=this._getConfig(r.scope);if(!i)return;let s=[...i.rules];r.isNew?s.push(e.detail):s[r.index]=e.detail,this._mutate(r.scope,{...i,rules:s})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._getConfig(this._editing.scope)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let e=this._getConfig(this._editing.scope);if(!e)return[];let r=new Set;for(let i of e.rules){let s=i.when.scene;typeof s=="string"&&s&&r.add(s)}return[...r].sort((i,s)=>i.toLowerCase().localeCompare(s.toLowerCase()))}get _editorMatchers(){return this._editing?this._matchers.slice().sort((e,r)=>e.priority-r.priority):[]}_summary(e){let r=e.rules.length;if(r===0)return u(this.hass,"ui.not_configured","not configured");let i=r===1?u(this.hass,"ui.rule_singular","rule"):u(this.hass,"ui.rule_plural","rules");return`${r} ${i}`}render(){let e=u(this.hass,"ui.scope_floor_prefix","Floor: "),r=u(this.hass,"ui.scope_area_prefix","Area: ");return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      <ul>
        ${this._renderScopeRow({kind:"house"},u(this.hass,"ui.scope_global","Global"),this._house,"house")}
        ${this._floors.map(i=>{let s=this._floorConfigs.get(i.floor_id);return s?this._renderScopeRow({kind:"floor",id:i.floor_id},`${e}${i.name}`,s,"floor"):l``})}
        ${this._areas.length===0?l`<li>
              <p class="empty">
                ${u(this.hass,"ui.no_areas","No areas found in Home Assistant.")}
              </p>
            </li>`:this._areas.map(i=>{let s=this._areaConfigs.get(i.area_id);return s?this._renderScopeRow({kind:"area",id:i.area_id},`${r}${i.name}`,s,"area"):l``})}
      </ul>

      <ambience-rule-editor
        ?open=${this._editing!==null}
        .hass=${this.hass}
        .scope=${this._editing?this._editing.scope:void 0}
        .rule=${this._editingRule}
        .matchers=${this._editorMatchers}
        .sceneSuggestions=${this._sceneSuggestions}
        .periods=${this._periods}
        .dayConfig=${this._dayConfig}
        .weatherConfig=${this._weatherConfig}
        .availableActions=${this._actions}
        @save-rule=${this._saveRule}
        @cancel-rule=${this._cancelRule}
      ></ambience-rule-editor>
    `}_renderScopeRow(e,r,i,s){let a=this._expanded.has(Ni(e)),o=e.kind==="house"?"":e.id;return l`
      <li
        class="scope-row ${s}"
        data-id=${o}
      >
        <div class="scope-header" @click=${()=>this._toggleExpand(e)}>
          <span class="chevron ${a?"open":""}">▶</span>
          <span class="scope-name">${r}</span>
          <span class="scope-summary">${this._summary(i)}</span>
        </div>
        ${a?l`
              <div class="scope-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!i.auto_sort}
                    @change=${d=>this._toggleAutoSort(e,!d.target.checked)}
                  />
                  ${u(this.hass,"ui.order_rules_manually","Order rules manually")}
                </label>
                <ambience-rules-list
                  .rules=${i.rules}
                  .autoSort=${i.auto_sort}
                  .periods=${this._periods}
                  .weatherConfig=${this._weatherConfig}
                  .matchers=${this._matchers}
                  .availableActions=${this._actions}
                  .hass=${this.hass}
                  @add-rule=${()=>this._addRule(e)}
                  @edit-rule=${d=>this._editRule(e,d)}
                  @duplicate-rule=${d=>this._duplicateRule(e,d)}
                  @delete-rule=${d=>this._deleteRule(e,d)}
                  @reorder-rules=${d=>this._reorderRules(e,d)}
                ></ambience-rules-list>
              </div>
            `:""}
      </li>
    `}};T.styles=$`
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
    li.scope-row {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
    }
    .scope-header {
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
    .scope-name {
      flex: 1;
      font-weight: 600;
    }
    .scope-summary {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .scope-body {
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
  `,c([m({attribute:!1})],T.prototype,"hass",2),c([g()],T.prototype,"_areas",2),c([g()],T.prototype,"_floors",2),c([g()],T.prototype,"_areaConfigs",2),c([g()],T.prototype,"_floorConfigs",2),c([g()],T.prototype,"_house",2),c([g()],T.prototype,"_matchers",2),c([g()],T.prototype,"_actions",2),c([g()],T.prototype,"_periods",2),c([g()],T.prototype,"_dayConfig",2),c([g()],T.prototype,"_weatherConfig",2),c([g()],T.prototype,"_expanded",2),c([g()],T.prototype,"_error",2),c([g()],T.prototype,"_editing",2),T=c([x("ambience-scopes-view")],T);function eo(t){return t.kind==="house"?"house":`${t.kind}-${t.id}`}var re=class extends y{constructor(){super(...arguments);this._defaults={name:"Ambience",auto_on_delay_seconds:7200};this._rows=[];this._error=""}async connectedCallback(){super.connectedCallback();try{let[e,r,i,s]=await Promise.all([Dr(this.hass),st(this.hass),ot(this.hass),dt(this.hass)]);this._defaults=e;let a={kind:"house",id:null,name:u(this.hass,"ui.settings_ambience_house_row","Global"),scopePrefix:"Global",override:this._toOverride(s.switch),expanded:!1},o=i.slice().sort((w,S)=>w.name.localeCompare(S.name)),d=await Promise.all(o.map(w=>lt(this.hass,w.floor_id))),h=u(this.hass,"ui.settings_ambience_floor_prefix","Floor: "),f=o.map((w,S)=>({kind:"floor",id:w.floor_id,name:`${h}${w.name}`,scopePrefix:w.name,override:this._toOverride(d[S].switch),expanded:!1})),p=r.slice().sort((w,S)=>w.name.localeCompare(S.name)),_=await Promise.all(p.map(w=>at(this.hass,w.area_id))),v=u(this.hass,"ui.settings_ambience_area_prefix","Area: "),k=p.map((w,S)=>({kind:"area",id:w.area_id,name:`${v}${w.name}`,scopePrefix:w.name,override:this._toOverride(_[S].switch),expanded:!1}));this._rows=[a,...f,...k]}catch(e){this._error=e.message||String(e)}}_toOverride(e){return{name:e?.name??null,auto_on_delay_seconds:e?.auto_on_delay_seconds??null}}async _safeSave(e){try{await e(),this._error=""}catch(r){this._error=r.message||String(r)}}_onDefaultName(e){let r=e.target.value.trim();r&&(this._defaults={...this._defaults,name:r},this._safeSave(()=>jt(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds)))}_onDefaultDelay(e){let r=e.target.value;r===""||!Number.isFinite(Number(r))||Number(r)<0||(this._defaults={...this._defaults,auto_on_delay_seconds:Math.floor(Number(r))},this._safeSave(()=>jt(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds)))}_toggle(e){this._rows=this._rows.map((r,i)=>i===e?{...r,expanded:!r.expanded}:r)}_saveRow(e){let{name:r,auto_on_delay_seconds:i}=e.override;this._safeSave(()=>e.kind==="house"?Pr(this.hass,r,i):e.kind==="floor"?Or(this.hass,e.id,r,i):Nr(this.hass,e.id,r,i))}_onOverrideName(e,r){let i=r.target.value.trim(),s=i===""?null:i;this._rows=this._rows.map((a,o)=>o===e?{...a,override:{...a.override,name:s}}:a),this._saveRow(this._rows[e])}_onOverrideDelay(e,r){let i=r.target.value;if(i!==""&&(!Number.isFinite(Number(i))||Number(i)<0))return;let s=i===""?null:Math.floor(Number(i));this._rows=this._rows.map((a,o)=>o===e?{...a,override:{...a.override,auto_on_delay_seconds:s}}:a),this._saveRow(this._rows[e])}_reset(e){this._rows=this._rows.map((r,i)=>i===e?{...r,override:{name:null,auto_on_delay_seconds:null}}:r),this._saveRow(this._rows[e])}_defaultDisplayName(e){return`${e.scopePrefix} ${this._defaults.name}`}render(){return l`
      ${this._error?l`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:""}

      <div class="card">
        <h3>${u(this.hass,"ui.settings_ambience_defaults_card","Defaults")}</h3>
        <div class="row">
          <label>${u(this.hass,"ui.settings_ambience_field_name","Switch name")}</label>
          <input data-test="defaults-name" type="text" .value=${this._defaults.name} @change=${e=>this._onDefaultName(e)} />
        </div>
        <div class="row">
          <label>${u(this.hass,"ui.settings_ambience_field_delay","Auto-on delay (seconds)")}</label>
          <input data-test="defaults-delay-seconds" type="number" min="0" .value=${String(this._defaults.auto_on_delay_seconds)} @change=${e=>this._onDefaultDelay(e)} />
          <div class="help">${u(this.hass,"ui.settings_ambience_delay_help","0 = never auto-on")}</div>
        </div>
      </div>

      <div class="card">
        <h3>${u(this.hass,"ui.settings_ambience_overrides_card","Per-scope overrides")}</h3>
        ${this._rows.map((e,r)=>{let i=eo(e);return l`
            <div class="scope-row" data-test="scope-row">
              <div class="scope-header" data-test="expand" @click=${()=>this._toggle(r)}>
                <span class="chevron ${e.expanded?"open":""}">▶</span>
                <div class="scope-name">${e.name}</div>
              </div>
              ${e.expanded?l`
                <div class="scope-body">
                  <div class="row">
                    <label>${u(this.hass,"ui.settings_ambience_field_name","Switch name")}</label>
                    <input data-test=${`override-name-${i}`} type="text" .value=${e.override.name??""} placeholder=${this._defaultDisplayName(e)} @change=${s=>this._onOverrideName(r,s)} />
                  </div>
                  <div class="row">
                    <label>${u(this.hass,"ui.settings_ambience_field_delay","Auto-on delay (seconds)")}</label>
                    <input data-test=${`override-delay-${i}`} type="number" min="0" .value=${e.override.auto_on_delay_seconds===null?"":String(e.override.auto_on_delay_seconds)} placeholder=${String(this._defaults.auto_on_delay_seconds)} @change=${s=>this._onOverrideDelay(r,s)} />
                  </div>
                  <button class="reset" data-test=${`reset-${i}`} @click=${()=>this._reset(r)}>${u(this.hass,"ui.settings_ambience_reset_to_defaults","Reset to defaults")}</button>
                </div>
              `:""}
            </div>
          `})}
      </div>
    `}};re.styles=$`
    :host { display: block; }
    .card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      margin-bottom: 1rem;
      padding: 1rem;
    }
    h3 { margin: 0 0 0.75rem; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .help { color: var(--secondary-text-color, #888); font-size: 0.85em; margin-top: 0.25rem; }
    input[type=text], input[type=number] {
      width: 100%;
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, inherit);
    }
    .scope-row {
      border-top: 1px solid var(--divider-color, #e0e0e0);
      padding: 0.6rem 0;
    }
    .scope-row:first-of-type { border-top: none; }
    .scope-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    .chevron {
      color: var(--secondary-text-color, #888);
      width: 0.8em;
      transition: transform 0.15s ease;
    }
    .chevron.open { transform: rotate(90deg); }
    .scope-name { flex: 1; font-weight: 600; }
    .scope-status { color: var(--secondary-text-color, #888); font-size: 0.85em; }
    .scope-body { padding: 0.5rem 0 0.5rem 1.3rem; }
    button.reset {
      background: transparent;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.3rem 0.7rem;
      cursor: pointer;
      color: var(--primary-text-color, inherit);
      margin-top: 0.5rem;
    }
  `,c([m({attribute:!1})],re.prototype,"hass",2),c([g()],re.prototype,"_defaults",2),c([g()],re.prototype,"_rows",2),c([g()],re.prototype,"_error",2),re=c([x("ambience-ambience-settings")],re);var ie=class extends y{constructor(){super(...arguments);this.matcherName="";this.matcherDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let e=oe(this.hass,this.matcherName);return l`
      <div class="card">
        <header @click=${this._toggleExpand}>
          <span class="chevron ${this._expanded?"open":""}">▶</span>
          <label>
            <div class="name">${e}</div>
            <div class="description">${this.matcherDescription}</div>
          </label>
        </header>
        <div class="body ${this._expanded?"":"collapsed"}">
          <slot></slot>
        </div>
      </div>
    `}};ie.styles=$`
    :host {
      display: block;
    }
    .card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      margin-bottom: 1rem;
    }
    header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer;
    }
    .chevron {
      color: var(--secondary-text-color, #888);
      font-size: 0.7em;
      transition: transform 0.15s ease;
      width: 0.8em;
      flex: 0 0 auto;
    }
    .chevron.open {
      transform: rotate(90deg);
    }
    header label {
      flex: 1;
      cursor: pointer;
    }
    .name {
      font-weight: 600;
    }
    .description {
      color: var(--secondary-text-color, #888);
      font-size: 0.9em;
    }
    .body {
      padding: 1rem;
    }
    .body.collapsed {
      display: none;
    }
  `,c([m({attribute:!1})],ie.prototype,"hass",2),c([m()],ie.prototype,"matcherName",2),c([m()],ie.prototype,"matcherDescription",2),c([g()],ie.prototype,"_expanded",2),ie=c([x("ambience-matcher-card")],ie);function Fe(t){return t.scope_kind==="house"?"House":t.scope_kind==="floor"?`Floor: ${t.scope_id??""}`:t.scope_id??""}var to=/^[a-z][a-z0-9_]*$/;function ro(t){return t.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var U=class extends y{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._label=this.initial.label??"",this._def=this.initial}_onLabelInput(e){this._label=e.target.value}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_validate(e){if(!this.existingId){if(!this._label.trim())return u(this.hass,"ui.error_enter_name","Please enter a name.");if(!e)return u(this.hass,"ui.error_start_letter","Name must start with a letter.");if(!to.test(e))return u(this.hass,"ui.error_start_letter","Name must start with a letter.");if(this.takenIds.has(e))return u(this.hass,"ui.error_name_exists","A period with this name already exists. Choose a different name.")}return""}_onSave(){let e=this.existingId??ro(this._label),r=this._validate(e);if(r){this._error=r,this.performUpdate();return}let i={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:e,definition:i},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){let e=this.existingId?u(this.hass,"ui.period_modal_edit_title",'Edit "{name}"').replace("{name}",this.initial?.label??this.existingId):u(this.hass,"ui.period_modal_add_title","Add custom period");return l`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <div class="field">
          <label for="label">${u(this.hass,"ui.name","Name")}</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput} placeholder=${u(this.hass,"ui.name_placeholder","e.g. Wind down")} />
        </div>
        <div class="row">
          <label style="min-width: 3em;">${u(this.hass,"ui.from_label","From")}</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
        </div>
        <div class="row">
          <label style="min-width: 3em;">${u(this.hass,"ui.to_label","To")}</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
        </div>
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>${u(this.hass,"ui.cancel","Cancel")}</button>
          <button @click=${this._onSave}>${u(this.hass,"ui.save","Save")}</button>
        </div>
      </div>
    `}};U.styles=$`
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
  `,c([m({attribute:!1})],U.prototype,"hass",2),c([m({attribute:!1})],U.prototype,"existingId",2),c([m({attribute:!1})],U.prototype,"initial",2),c([m({attribute:!1})],U.prototype,"takenIds",2),c([g()],U.prototype,"_label",2),c([g()],U.prototype,"_def",2),c([g()],U.prototype,"_error",2),U=c([x("ambience-period-edit-modal")],U);function Ii(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=Ee(n,t.anchor);if(t.offset_min===0)return e;let r=Math.abs(t.offset_min),i=r%60===0?`${r/60}${u(n,"ui.unit_hour_abbr","h")}`:`${r}${u(n,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${i}`}function Mi(t,n){return`${Ii(t.from,n)} \u2192 ${Ii(t.to,n)}`}var ne=class extends y{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await ht(this.hass)}async _saveState(e){let r=await Lr(this.hass,e,this._view.hidden);this._warnings=r.warnings,await this._reload()}_onEdit(e,r){this._modal={mode:"edit",id:e,initial:r}}async _onDelete(e){let r={...this._view.custom};delete r[e],await this._saveState(r)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:r,definition:i}=e.detail,s={...this._view.custom,[r]:i};this._modal={mode:"closed"},await this._saveState(s)}_onModalCancel(){this._modal={mode:"closed"}}_renderBuiltinRow(e,r,i){return l`
      <div class="row ${i?"overridden":""}">
        <span class="name">${_e(this.hass,e,{})}</span>
        <span class="def">${Mi(r,this.hass)}</span>
        <span class="badge">${u(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${i?"":l`<button class="icon" title=${u(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(e,r)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(e,r){return l`
      <div class="row custom">
        <span class="name">${_e(this.hass,e,this._view.custom)}</span>
        <span class="def">${Mi(r,this.hass)}</span>
        <span class="badge">${u(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${u(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e,r)}>✎</button>
          <button class="icon" title=${u(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e)}>✕</button>
        </span>
      </div>
    `}render(){let e=this._view.custom;return l`
      <header>
        <h2>${u(this.hass,"ui.periods_heading","Periods")}</h2>
      </header>
      ${this._warnings.length?l`<div class="warnings">
            <strong>${u(this.hass,"ui.period_warning_prefix","Warning:")}</strong> ${u(this.hass,"ui.period_warning_text","some rules now reference missing periods:")}
            <ul>
              ${this._warnings.map(r=>l`<li>${Fe(r)} / "${r.rule_name}" → ${r.missing_period}</li>`)}
            </ul>
          </div>`:""}
      ${Object.entries(this._view.builtins).map(([r,i])=>{let s=e[r];return l`
          ${this._renderBuiltinRow(r,i,s!=null)}
          ${s!=null?this._renderCustomRow(r,s):""}
        `})}
      ${Object.entries(e).filter(([r])=>!(r in this._view.builtins)).map(([r,i])=>this._renderCustomRow(r,i))}
      <button class="add" @click=${this._onAdd}>${u(this.hass,"ui.add_custom_period","+ Add custom period")}</button>
      ${this._modal.mode==="edit"?l`<ambience-period-edit-modal
            .hass=${this.hass}
            .existingId=${this._modal.id}
            .initial=${this._modal.initial}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:this._modal.mode==="add"?l`<ambience-period-edit-modal
            .hass=${this.hass}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:""}
    `}};ne.styles=$`
    :host { display: block; }
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    h2 { margin: 0; font-size: 1rem; font-weight: 600; }
    /* Fixed badge + actions columns so every row shares the same column
       boundaries (an override row has two icons, a built-in one — without fixed
       widths each row would size its own grid and the columns wouldn't align). */
    .row {
      display: grid; grid-template-columns: 1fr 2fr 5rem 4rem; align-items: center;
      gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid var(--divider-color, #eee);
    }
    .name { font-weight: 500; }
    .def { color: var(--secondary-text-color); font-family: monospace; font-size: 0.9em; }
    .row.overridden .name, .row.overridden .def {
      text-decoration: line-through; opacity: 0.55;
    }
    .badge {
      justify-self: end;
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
  `,c([m({attribute:!1})],ne.prototype,"hass",2),c([g()],ne.prototype,"_view",2),c([g()],ne.prototype,"_modal",2),c([g()],ne.prototype,"_warnings",2),ne=c([x("ambience-time-of-day-config")],ne);var ce=class extends y{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await pt(this.hass)}async _save(e){this._config=e;let r=await Tr(this.hass,e.workday_sensor,e.workday_calendar);this._warnings=r.warnings??[]}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=[{name:"workday_sensor",selector:{entity:{integration:"workday",domain:"binary_sensor"}}}],r=[{name:"workday_calendar",selector:{entity:{integration:"workday",domain:"calendar"}}}];return l`
      <div class="row">
        <label>${u(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${e}
          .data=${{workday_sensor:this._config.workday_sensor??""}}
          .computeLabel=${()=>""}
          @value-changed=${i=>{i.stopPropagation(),this._onSensorChange({detail:{value:i.detail.value?.workday_sensor||null}})}}
        ></ha-form>
      </div>
      <div class="row">
        <label>${u(this.hass,"ui.workday_calendar","Workday calendar")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{workday_calendar:this._config.workday_calendar??""}}
          .computeLabel=${()=>""}
          @value-changed=${i=>{i.stopPropagation(),this._onCalendarChange({detail:{value:i.detail.value?.workday_calendar||null}})}}
        ></ha-form>
      </div>
      ${this._warnings.length?l`
        <div class="warnings">
          <strong>${u(this.hass,"ui.day_warning_prefix","Warning:")}</strong> ${u(this.hass,"ui.day_warning_text","rules now reference unconfigured entities:")}
          <ul>
            ${this._warnings.map(i=>l`<li>${Fe(i)} / "${i.rule_name}" → ${i.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};ce.styles=$`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,c([m({attribute:!1})],ce.prototype,"hass",2),c([g()],ce.prototype,"_config",2),c([g()],ce.prototype,"_warnings",2),ce=c([x("ambience-day-config")],ce);var io=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],se=class extends y{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._warnings=[];this._expanded=new Set}async connectedCallback(){super.connectedCallback(),this._config=await mt(this.hass)}async _persist(){let e=await Fr(this.hass,this._config.entity,this._config.groups);this._warnings=e.warnings??[]}_onEntityChange(e){this._config={...this._config,entity:e.detail.value||null},this._persist()}_nextGroupId(e){let r=new Set(e.map(i=>i.id));for(let i=1;i<=e.length+1;i++){let s=`group_${i}`;if(!r.has(s))return s}return`group_${e.length+1}`}_addGroup(){let e=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:e,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,e]),this._persist()}_toggleExpand(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):r.add(e),this._expanded=r}_updateGroup(e,r){this._config={...this._config,groups:this._config.groups.map((i,s)=>s===e?{...i,...r}:i)},this._persist()}_removeGroup(e){let r=this._config.groups[e];if(this._config={...this._config,groups:this._config.groups.filter((i,s)=>s!==e)},r){let i=new Set(this._expanded);i.delete(r.id),this._expanded=i}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:io.map(e=>({value:e,label:nt(this.hass,e)}))}}}]}_renderConditions(e,r){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:r.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation(),this._updateGroup(e,{conditions:s.detail.value.conditions??[]})}}
      ></ha-form>`;let i=r.conditions.map(s=>nt(this.hass,s));return l`<span class="conditions-list">${i.join(", ")}</span>`}_renderGroup(e,r){let i=this._expanded.has(r.id),s=r.conditions.map(a=>nt(this.hass,a)).join(", ");return l`
      <div class="group">
        <div class="group-header" @click=${()=>this._toggleExpand(r.id)}>
          <span class="chevron ${i?"open":""}">▶</span>
          <span class="label">${r.label}</span>
          <span class="codes">${s}</span>
          <button
            class="icon"
            title=${u(this.hass,"ui.title_delete","Delete")}
            @click=${a=>{a.stopPropagation(),this._removeGroup(e)}}
          >✕</button>
        </div>
        ${i?l`<div class="body" @click=${a=>a.stopPropagation()}>
              <input
                .value=${r.label}
                aria-label=${r.label}
                @change=${a=>this._updateGroup(e,{label:a.target.value})}
              />
              ${this._renderConditions(e,r)}
            </div>`:""}
      </div>
    `}render(){let e=[{name:"entity",selector:{entity:{domain:"weather"}}}];return l`
      <div class="row">
        <label class="section">${u(this.hass,"ui.weather_entity","Weather entity")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${e}
          .data=${{entity:this._config.entity??""}}
          .computeLabel=${()=>""}
          @value-changed=${r=>{r.stopPropagation(),this._onEntityChange({detail:{value:r.detail.value?.entity||null}})}}
        ></ha-form>
      </div>

      <h4>${u(this.hass,"ui.groups","Groups")}</h4>
      ${this._config.groups.map((r,i)=>this._renderGroup(i,r))}
      <button class="add" @click=${()=>this._addGroup()}>
        ${u(this.hass,"ui.add_group","+ Add group")}
      </button>

      ${this._warnings.length?l`
        <div class="warnings">
          <strong>${u(this.hass,"ui.day_warning_prefix","Warning:")}</strong>
          ${u(this.hass,"ui.weather_warning_text","rules now reference an unconfigured weather entity:")}
          <ul>${this._warnings.map(r=>l`<li>${Fe(r)} / "${r.rule_name}" → ${r.reason}</li>`)}</ul>
        </div>
      `:""}
    `}};se.styles=$`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label.section { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    h4 { margin: 1rem 0 0.5rem 0; font-size: 0.95em; }
    .group {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.5rem 0.75rem;
      margin-bottom: 0.5rem;
    }
    .group-header {
      display: flex; gap: 0.5rem; align-items: center;
      cursor: pointer; user-select: none;
    }
    .chevron {
      color: var(--secondary-text-color, #888);
      font-size: 0.7em; transition: transform 0.15s ease;
      width: 0.8em; flex: 0 0 auto;
    }
    .chevron.open { transform: rotate(90deg); }
    .group-header .label { font-weight: 500; flex: 0 0 auto; min-width: 6rem; }
    .group-header .codes {
      flex: 1; color: var(--secondary-text-color, #888); font-size: 0.9em;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .body { padding: 0.5rem 0 0.25rem 1.5rem; }
    .body input {
      width: 100%; padding: 0.25rem 0.5rem; margin-bottom: 0.4rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
      box-sizing: border-box;
    }
    .conditions-list {
      display: block; color: var(--secondary-text-color, #888);
      font-size: 0.9em; padding: 0.15rem 0;
    }
    button.icon {
      background: none; border: none; padding: 0.2rem 0.4rem; cursor: pointer;
      color: var(--secondary-text-color); font-size: 1em;
      flex: 0 0 auto;
    }
    button.add {
      background: transparent; border: 1px dashed var(--divider-color, #ccc);
      padding: 0.4rem 0.75rem; border-radius: 4px; cursor: pointer;
      color: var(--primary-text-color, inherit);
    }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,c([m({attribute:!1})],se.prototype,"hass",2),c([g()],se.prototype,"_config",2),c([g()],se.prototype,"_warnings",2),c([g()],se.prototype,"_expanded",2),se=c([x("ambience-weather-config")],se);var no=new Set(["time_of_day","day","weather"]),he=class extends y{constructor(){super(...arguments);this._matchers=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._matchers=await ut(this.hass)}catch(e){this._error=e.message||String(e)}}render(){let e=this._matchers.filter(r=>no.has(r.name)).slice().sort((r,i)=>r.priority-i.priority);return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${e.map(r=>l`
        <ambience-matcher-card .hass=${this.hass} .matcherName=${r.name} .matcherDescription=${r.description}>
          ${r.name==="time_of_day"?l`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`:r.name==="day"?l`<ambience-day-config .hass=${this.hass}></ambience-day-config>`:r.name==="weather"?l`<ambience-weather-config .hass=${this.hass}></ambience-weather-config>`:l``}
        </ambience-matcher-card>
      `)}
    `}};he.styles=$`
    :host { display: block; }
    .error { color: var(--error-color, #d32f2f); }
  `,c([m({attribute:!1})],he.prototype,"hass",2),c([g()],he.prototype,"_matchers",2),c([g()],he.prototype,"_error",2),he=c([x("ambience-matchers-settings")],he);var D=class extends y{constructor(){super(...arguments);this._actions=[];this._services=[];this._schemas={};this._fieldSchemas={};this._expanded=new Set;this._adding=!1;this._warnings=[];this._loadError=null;this._saveError=null;this._saving=!1;this._loaded=!1}async firstUpdated(){await this._reload()}willUpdate(e){if(e.has("_actions")||e.has("_schemas")){let r={};for(let i of this._actions){let s=this._schemas[i.id];if(s)for(let[a,o]of Object.entries(s.fields))r[`${i.id}:${a}`]=[{name:a,selector:o.selector??{text:{}},required:!1}]}this._fieldSchemas=r}}async _reload(){this._loadError=null;try{let[e,r]=await Promise.all([ze(this.hass),Ar(this.hass)]);this._actions=e,this._services=r}catch(e){this._loadError=e instanceof Error?e.message:String(e);return}await Promise.all(this._actions.map(e=>this._ensureSchema(e.id))),this._loaded=!0}async _ensureSchema(e){if(!(e in this._schemas))try{let r=await ct(this.hass,e);this._schemas={...this._schemas,[e]:r}}catch{this._schemas={...this._schemas,[e]:null}}}_fieldMode(e,r){return r in(e.locked_values??{})?"locked":(e.visible_fields??[]).includes(r)?"visible":"hidden"}_setFieldMode(e,r,i){this._actions=this._actions.map(s=>{if(s.id!==e)return s;let a=new Set(s.visible_fields??[]),o={...s.locked_values??{}};return a.delete(r),delete o[r],i==="visible"&&a.add(r),i==="locked"&&(o[r]=o[r]??null),{...s,visible_fields:[...a],locked_values:o}})}_setLockedValue(e,r,i){this._actions=this._actions.map(s=>s.id!==e?s:{...s,locked_values:{...s.locked_values??{},[r]:i}})}_setLabel(e,r){this._actions=this._actions.map(i=>i.id===e?{...i,label:r}:i)}_toggleExpand(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):(r.add(e),this._ensureSchema(e)),this._expanded=r}async _addService(e){e&&(this._actions.some(r=>r.id===e)||(await this._ensureSchema(e),this._actions=[...this._actions,{id:e,label:"",visible_fields:[],locked_values:{}}],this._expanded=new Set([...this._expanded,e]),this._adding=!1))}_removeService(e){this._actions=this._actions.filter(i=>i.id!==e);let r=new Set(this._expanded);r.delete(e),this._expanded=r}async _save(){this._saving=!0,this._saveError=null,this._warnings=[];try{let e=await Cr(this.hass,this._actions);this._warnings=e.warnings??[],window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"))}catch(e){this._saveError=e instanceof Error?e.message:String(e),this._warnings=[]}finally{this._saving=!1}}render(){return this._loadError!==null?l`
        <div class="error">${this._loadError}</div>
        <button @click=${()=>this._reload()}>${u(this.hass,"ui.retry","Retry")}</button>
      `:this._loaded?l`
      <section>
        ${this._actions.map(e=>this._renderCard(e))}
        ${this._renderAdd()}
        ${this._renderWarnings()}
        ${this._saveError?l`<div class="error">${this._saveError}</div>`:""}
        <div class="actions">
          <button
            class="primary"
            data-action="save"
            ?disabled=${this._saving}
            @click=${()=>this._save()}
          >
            ${this._saving?u(this.hass,"ui.saving","Saving\u2026"):u(this.hass,"ui.save","Save")}
          </button>
        </div>
      </section>
    `:l`<div>${u(this.hass,"ui.loading","Loading\u2026")}</div>`}_renderCard(e){let r=this._schemas[e.id],i=this._expanded.has(e.id);return l`
      <div class="card" data-card data-service=${e.id}>
        <div class="card-header">
          <button class="toggle" data-toggle @click=${()=>this._toggleExpand(e.id)}>
            ${i?"\u25BE":"\u25B8"}
          </button>
          <strong>${e.id}</strong>
          <input
            type="text"
            placeholder=${u(this.hass,"ui.action_label_placeholder","Label (optional)")}
            .value=${e.label}
            @input=${s=>this._setLabel(e.id,s.target.value)}
          />
          <button
            class="remove"
            data-remove
            title=${u(this.hass,"ui.remove","Remove")}
            @click=${()=>this._removeService(e.id)}
          >✖</button>
        </div>
        ${i?this._renderBody(e,r):""}
      </div>
    `}_renderBody(e,r){if(r===null)return l`<div class="body warning">${u(this.hass,"ui.service_unavailable","Service not available in this HA instance.")}</div>`;if(r===void 0)return l`<div class="body">${u(this.hass,"ui.loading","Loading\u2026")}</div>`;let i=Object.entries(r.fields);return i.length===0?l`<div class="body">${u(this.hass,"ui.service_has_no_fields","This service has no fields.")}</div>`:l`
      <div class="body">
        ${i.map(([s,a])=>this._renderFieldRow(e,s,a))}
      </div>
    `}_humanizeFieldId(e){let r=e.replaceAll("_"," ").toLowerCase();return r.charAt(0).toUpperCase()+r.slice(1)}_renderFieldRow(e,r,i){let s=this._fieldMode(e,r);return l`
      <div class="field-row">
        <span class="name">
          ${i.name||this._humanizeFieldId(r)}
          ${i.name?l` <small class="field-id">(${r})</small>`:""}
          ${i.description?l` <small>— ${i.description}</small>`:""}
        </span>
        <select
          data-field-mode=${r}
          .value=${s}
          @change=${a=>this._setFieldMode(e.id,r,a.target.value)}
        >
          <option value="hidden" ?selected=${s==="hidden"}>${u(this.hass,"ui.field_hidden","Hidden")}</option>
          <option value="visible" ?selected=${s==="visible"}>${u(this.hass,"ui.field_visible","Visible")}</option>
          <option value="locked" ?selected=${s==="locked"}>${u(this.hass,"ui.field_locked","Locked")}</option>
        </select>
        ${s==="locked"?this._renderLockedValue(e,r,i):l`<span></span>`}
      </div>
    `}_renderLockedValue(e,r,i){let s=e.locked_values?.[r],a=this._fieldSchemas[`${e.id}:${r}`]??[];return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${a}
        .data=${{[r]:s??""}}
        .computeLabel=${()=>""}
        @value-changed=${o=>{o.stopPropagation(),this._setLockedValue(e.id,r,o.detail.value[r])}}
      ></ha-form>`:l`<input
      data-locked-value=${r}
      .value=${s==null?"":String(s)}
      @input=${o=>this._setLockedValue(e.id,r,o.target.value)}
    />`}_renderAdd(){if(!this._adding)return l`<div class="add-row">
        <button data-action="add" @click=${()=>{this._adding=!0}}>
          + ${u(this.hass,"ui.add_service","Add service")}
        </button>
      </div>`;let e=new Set(this._actions.map(i=>i.id)),r=this._services.filter(i=>!e.has(i.id));return l`<div class="add-row">
      <select
        data-add-service
        @change=${i=>this._addService(i.target.value)}
      >
        <option value="">— ${u(this.hass,"ui.pick_service","Pick a service")} —</option>
        ${r.map(i=>l`<option value=${i.id}>${i.id}${i.description?` \u2014 ${i.description}`:""}</option>`)}
      </select>
      <button data-action="cancel-add" @click=${()=>{this._adding=!1}}>
        ${u(this.hass,"ui.cancel","Cancel")}
      </button>
    </div>`}_renderWarnings(){return this._warnings.length===0?"":l`<ul class="warning">
      ${this._warnings.map(e=>l`<li>
          ${e.scope_kind}${e.scope_id?`/${e.scope_id}`:""}${e.rule_name?l` — <em>${e.rule_name}</em>`:""}: ${e.reason}
        </li>`)}
    </ul>`}};D.styles=$`
    :host { display: block; }
    .card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      margin-bottom: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: var(--card-background-color, #fff);
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .card-header button.toggle {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 0.95rem;
      color: var(--primary-text-color, inherit);
    }
    .card-header strong {
      flex: 0 0 auto;
      font-family: var(--code-font-family, monospace);
      font-size: 0.9rem;
    }
    .card-header input[type="text"] {
      flex: 1;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      background: transparent;
      color: var(--primary-text-color, inherit);
      font: inherit;
    }
    .card-header button.remove {
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      color: var(--secondary-text-color, #888);
      padding: 0.15rem 0.3rem;
      font-size: 0.9rem;
    }
    .card-header button.remove:hover { color: var(--error-color, #d33); }
    .body {
      margin-top: 0.5rem;
      border-top: 1px dashed var(--divider-color, #e0e0e0);
      padding-top: 0.5rem;
    }
    .field-row {
      display: grid;
      grid-template-columns: 1fr 7rem 1fr;
      gap: 0.5rem;
      align-items: center;
      padding: 0.25rem 0;
    }
    .field-row .name { color: var(--primary-text-color, inherit); }
    .field-row .name small {
      color: var(--secondary-text-color, #888);
      font-weight: normal;
    }
    .field-row input[data-locked-value] {
      width: 100%;
      box-sizing: border-box;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      background: transparent;
      color: var(--primary-text-color, inherit);
      font: inherit;
    }
    .add-row {
      margin: 0.75rem 0;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .actions {
      margin-top: 0.75rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .warning {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      margin: 0.5rem 0;
      list-style-position: inside;
    }
    .error {
      color: var(--error-color, #d33);
      margin: 0.5rem 0;
    }
    select, button {
      padding: 0.3rem 0.6rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      background: transparent;
      color: var(--primary-text-color, inherit);
      font: inherit;
      cursor: pointer;
    }
    button.primary {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    button.primary[disabled] { opacity: 0.6; cursor: progress; }
  `,c([m({attribute:!1})],D.prototype,"hass",2),c([g()],D.prototype,"_actions",2),c([g()],D.prototype,"_services",2),c([g()],D.prototype,"_schemas",2),c([g()],D.prototype,"_fieldSchemas",2),c([g()],D.prototype,"_expanded",2),c([g()],D.prototype,"_adding",2),c([g()],D.prototype,"_warnings",2),c([g()],D.prototype,"_loadError",2),c([g()],D.prototype,"_saveError",2),c([g()],D.prototype,"_saving",2),c([g()],D.prototype,"_loaded",2),D=c([x("ambience-actions-settings")],D);var $e=class extends y{constructor(){super(...arguments);this._tab="ambience"}render(){return l`
      <nav>
        <button class=${this._tab==="ambience"?"active":""} @click=${()=>{this._tab="ambience"}}>${u(this.hass,"ui.settings_tab_ambience","Ambience")}</button>
        <button class=${this._tab==="matchers"?"active":""} @click=${()=>{this._tab="matchers"}}>${u(this.hass,"ui.settings_tab_matchers","Matchers")}</button>
        <button class=${this._tab==="actions"?"active":""} @click=${()=>{this._tab="actions"}}>${u(this.hass,"ui.settings_tab_actions","Actions")}</button>
      </nav>
      ${this._tab==="ambience"?l`<ambience-ambience-settings .hass=${this.hass}></ambience-ambience-settings>`:this._tab==="matchers"?l`<ambience-matchers-settings .hass=${this.hass}></ambience-matchers-settings>`:l`<ambience-actions-settings .hass=${this.hass}></ambience-actions-settings>`}
    `}};$e.styles=$`
    :host { display: block; padding: 1rem; max-width: 60rem; margin: 0 auto; }
    nav { display: flex; gap: 0.25rem; margin-bottom: 1rem; }
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
  `,c([m({attribute:!1})],$e.prototype,"hass",2),c([g()],$e.prototype,"_tab",2),$e=c([x("ambience-settings-view")],$e);var xe=class extends y{constructor(){super(...arguments);this._view="areas"}connectedCallback(){super.connectedCallback(),Y(this)}render(){return l`
      <header>
        <h1>${u(this.hass,"ui.panel_title","Ambience")}</h1>
        <nav>
          <button
            class=${this._view==="areas"?"active":""}
            @click=${()=>{this._view="areas"}}
          >${u(this.hass,"ui.tab_areas","Areas")}</button>
          <button
            class=${this._view==="settings"?"active":""}
            @click=${()=>{this._view="settings"}}
          >${u(this.hass,"ui.tab_settings","Settings")}</button>
        </nav>
      </header>
      ${this._view==="areas"?l`<ambience-scopes-view .hass=${this.hass}></ambience-scopes-view>`:l`<ambience-settings-view .hass=${this.hass}></ambience-settings-view>`}
    `}};xe.styles=$`
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
  `,c([m({attribute:!1})],xe.prototype,"hass",2),c([g()],xe.prototype,"_view",2),xe=c([x("ambience-panel")],xe);export{xe as AmbiencePanel};
