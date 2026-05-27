/* Ambience panel — bundled output. Do not edit by hand. */
var Oi=Object.defineProperty;var Di=Object.getOwnPropertyDescriptor;var c=(t,n,e,r)=>{for(var i=r>1?void 0:r?Di(n,e):n,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(r?a(n,e,i):a(i))||i);return r&&i&&Oi(n,e,i),i};var Ve=globalThis,Je=Ve.ShadowRoot&&(Ve.ShadyCSS===void 0||Ve.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Et=Symbol(),sr=new WeakMap,Ne=class{constructor(n,e,r){if(this._$cssResult$=!0,r!==Et)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(Je&&n===void 0){let r=e!==void 0&&e.length===1;r&&(n=sr.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),r&&sr.set(e,n))}return n}toString(){return this.cssText}},ar=t=>new Ne(typeof t=="string"?t:t+"",void 0,Et),$=(t,...n)=>{let e=t.length===1?t[0]:n.reduce((r,i,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new Ne(e,t,Et)},or=(t,n)=>{if(Je)t.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let r=document.createElement("style"),i=Ve.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,t.appendChild(r)}},Ct=Je?t=>t:t=>t instanceof CSSStyleSheet?(n=>{let e="";for(let r of n.cssRules)e+=r.cssText;return ar(e)})(t):t;var{is:Hi,defineProperty:Ri,getOwnPropertyDescriptor:Mi,getOwnPropertyNames:ji,getOwnPropertySymbols:Ui,getPrototypeOf:zi}=Object,Qe=globalThis,lr=Qe.trustedTypes,Wi=lr?lr.emptyScript:"",Bi=Qe.reactiveElementPolyfillSupport,Ie=(t,n)=>t,Oe={toAttribute(t,n){switch(n){case Boolean:t=t?Wi:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,n){let e=t;switch(n){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},Xe=(t,n)=>!Hi(t,n),dr={attribute:!0,type:String,converter:Oe,reflect:!1,useDefault:!1,hasChanged:Xe};Symbol.metadata??=Symbol("metadata"),Qe.litPropertyMetadata??=new WeakMap;var J=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=dr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(n,r,e);i!==void 0&&Ri(this.prototype,n,i)}}static getPropertyDescriptor(n,e,r){let{get:i,set:s}=Mi(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);s?.call(this,a),this.requestUpdate(n,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??dr}static _$Ei(){if(this.hasOwnProperty(Ie("elementProperties")))return;let n=zi(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Ie("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ie("properties"))){let e=this.properties,r=[...ji(e),...Ui(e)];for(let i of r)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let r=new Set(n.flat(1/0).reverse());for(let i of r)e.unshift(Ct(i))}else n!==void 0&&e.push(Ct(n));return e}static _$Eu(n,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(n.set(r,this[r]),delete this[r]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return or(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,r){this._$AK(n,r)}_$ET(n,e){let r=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:Oe).toAttribute(e,r.type);this._$Em=n,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(n,e){let r=this.constructor,i=r._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Oe;this._$Em=i;let o=a.fromAttribute(e,s.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(n,e,r,i=!1,s){if(n!==void 0){let a=this.constructor;if(i===!1&&(s=this[n]),r??=a.getPropertyOptions(n),!((r.hasChanged??Xe)(s,e)||r.useDefault&&r.reflect&&s===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,r))))return;this.C(n,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:r,reflect:i,wrapped:s},a){r&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),s!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||r||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:a}=s,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,s,o)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw n=!1,this._$EM(),r}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[Ie("elementProperties")]=new Map,J[Ie("finalized")]=new Map,Bi?.({ReactiveElement:J}),(Qe.reactiveElementVersions??=[]).push("2.1.2");var Nt=globalThis,ur=t=>t,Ze=Nt.trustedTypes,cr=Ze?Ze.createPolicy("lit-html",{createHTML:t=>t}):void 0,_r="$lit$",se=`lit$${Math.random().toFixed(9).slice(2)}$`,vr="?"+se,Yi=`<${vr}>`,fe=document,He=()=>fe.createComment(""),Re=t=>t===null||typeof t!="object"&&typeof t!="function",It=Array.isArray,Gi=t=>It(t)||typeof t?.[Symbol.iterator]=="function",St=`[ 	
\f\r]`,De=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,hr=/-->/g,pr=/>/g,pe=RegExp(`>|${St}(?:([^\\s"'>=/]+)(${St}*=${St}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),mr=/'/g,fr=/"/g,yr=/^(?:script|style|textarea|title)$/i,Ot=t=>(n,...e)=>({_$litType$:t,strings:n,values:e}),d=Ot(1),io=Ot(2),no=Ot(3),ge=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),gr=new WeakMap,me=fe.createTreeWalker(fe,129);function br(t,n){if(!It(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return cr!==void 0?cr.createHTML(n):n}var qi=(t,n)=>{let e=t.length-1,r=[],i,s=n===2?"<svg>":n===3?"<math>":"",a=De;for(let o=0;o<e;o++){let l=t[o],h,m,p=-1,_=0;for(;_<l.length&&(a.lastIndex=_,m=a.exec(l),m!==null);)_=a.lastIndex,a===De?m[1]==="!--"?a=hr:m[1]!==void 0?a=pr:m[2]!==void 0?(yr.test(m[2])&&(i=RegExp("</"+m[2],"g")),a=pe):m[3]!==void 0&&(a=pe):a===pe?m[0]===">"?(a=i??De,p=-1):m[1]===void 0?p=-2:(p=a.lastIndex-m[2].length,h=m[1],a=m[3]===void 0?pe:m[3]==='"'?fr:mr):a===fr||a===mr?a=pe:a===hr||a===pr?a=De:(a=pe,i=void 0);let v=a===pe&&t[o+1].startsWith("/>")?" ":"";s+=a===De?l+Yi:p>=0?(r.push(h),l.slice(0,p)+_r+l.slice(p)+se+v):l+se+(p===-2?o:v)}return[br(t,s+(t[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),r]},Me=class t{constructor({strings:n,_$litType$:e},r){let i;this.parts=[];let s=0,a=0,o=n.length-1,l=this.parts,[h,m]=qi(n,e);if(this.el=t.createElement(h,r),me.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=me.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(_r)){let _=m[a++],v=i.getAttribute(p).split(se),k=/([.?@])?(.*)/.exec(_);l.push({type:1,index:s,name:k[2],strings:v,ctor:k[1]==="."?Lt:k[1]==="?"?Tt:k[1]==="@"?Ft:ke}),i.removeAttribute(p)}else p.startsWith(se)&&(l.push({type:6,index:s}),i.removeAttribute(p));if(yr.test(i.tagName)){let p=i.textContent.split(se),_=p.length-1;if(_>0){i.textContent=Ze?Ze.emptyScript:"";for(let v=0;v<_;v++)i.append(p[v],He()),me.nextNode(),l.push({type:2,index:++s});i.append(p[_],He())}}}else if(i.nodeType===8)if(i.data===vr)l.push({type:2,index:s});else{let p=-1;for(;(p=i.data.indexOf(se,p+1))!==-1;)l.push({type:7,index:s}),p+=se.length-1}s++}}static createElement(n,e){let r=fe.createElement("template");return r.innerHTML=n,r}};function we(t,n,e=t,r){if(n===ge)return n;let i=r!==void 0?e._$Co?.[r]:e._$Cl,s=Re(n)?void 0:n._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(t),i._$AT(t,e,r)),r!==void 0?(e._$Co??=[])[r]=i:e._$Cl=i),i!==void 0&&(n=we(t,i._$AS(t,n.values),i,r)),n}var At=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:r}=this._$AD,i=(n?.creationScope??fe).importNode(e,!0);me.currentNode=i;let s=me.nextNode(),a=0,o=0,l=r[0];for(;l!==void 0;){if(a===l.index){let h;l.type===2?h=new je(s,s.nextSibling,this,n):l.type===1?h=new l.ctor(s,l.name,l.strings,this,n):l.type===6&&(h=new Pt(s,this,n)),this._$AV.push(h),l=r[++o]}a!==l?.index&&(s=me.nextNode(),a++)}return me.currentNode=fe,i}p(n){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(n,r,e),e+=r.strings.length-2):r._$AI(n[e])),e++}},je=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,r,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=we(this,n,e),Re(n)?n===F||n==null||n===""?(this._$AH!==F&&this._$AR(),this._$AH=F):n!==this._$AH&&n!==ge&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Gi(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==F&&Re(this._$AH)?this._$AA.nextSibling.data=n:this.T(fe.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:r}=n,i=typeof r=="number"?this._$AC(n):(r.el===void 0&&(r.el=Me.createElement(br(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(e);else{let s=new At(i,this),a=s.u(this.options);s.p(e),this.T(a),this._$AH=s}}_$AC(n){let e=gr.get(n.strings);return e===void 0&&gr.set(n.strings,e=new Me(n)),e}k(n){It(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,i=0;for(let s of n)i===e.length?e.push(r=new t(this.O(He()),this.O(He()),this,this.options)):r=e[i],r._$AI(s),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let r=ur(n).nextSibling;ur(n).remove(),n=r}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},ke=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,r,i,s){this.type=1,this._$AH=F,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=F}_$AI(n,e=this,r,i){let s=this.strings,a=!1;if(s===void 0)n=we(this,n,e,0),a=!Re(n)||n!==this._$AH&&n!==ge,a&&(this._$AH=n);else{let o=n,l,h;for(n=s[0],l=0;l<s.length-1;l++)h=we(this,o[r+l],e,l),h===ge&&(h=this._$AH[l]),a||=!Re(h)||h!==this._$AH[l],h===F?n=F:n!==F&&(n+=(h??"")+s[l+1]),this._$AH[l]=h}a&&!i&&this.j(n)}j(n){n===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Lt=class extends ke{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===F?void 0:n}},Tt=class extends ke{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==F)}},Ft=class extends ke{constructor(n,e,r,i,s){super(n,e,r,i,s),this.type=5}_$AI(n,e=this){if((n=we(this,n,e,0)??F)===ge)return;let r=this._$AH,i=n===F&&r!==F||n.capture!==r.capture||n.once!==r.once||n.passive!==r.passive,s=n!==F&&(r===F||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Pt=class{constructor(n,e,r){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(n){we(this,n)}};var Ki=Nt.litHtmlPolyfillSupport;Ki?.(Me,je),(Nt.litHtmlVersions??=[]).push("3.3.2");var $r=(t,n,e)=>{let r=e?.renderBefore??n,i=r._$litPart$;if(i===void 0){let s=e?.renderBefore??null;r._$litPart$=i=new je(n.insertBefore(He(),s),s,void 0,e??{})}return i._$AI(t),i};var Dt=globalThis,y=class extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=$r(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ge}};y._$litElement$=!0,y.finalized=!0,Dt.litElementHydrateSupport?.({LitElement:y});var Vi=Dt.litElementPolyfillSupport;Vi?.({LitElement:y});(Dt.litElementVersions??=[]).push("4.2.2");var x=t=>(n,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(t,n)}):customElements.define(t,n)};var Ji={attribute:!0,type:String,converter:Oe,reflect:!1,hasChanged:Xe},Qi=(t=Ji,n,e)=>{let{kind:r,metadata:i}=e,s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(e.name,t),r==="accessor"){let{name:a}=e;return{set(o){let l=n.get.call(this);n.set.call(this,o),this.requestUpdate(a,l,t,!0,o)},init(o){return o!==void 0&&this.C(a,void 0,t,o),o}}}if(r==="setter"){let{name:a}=e;return function(o){let l=this[a];n.call(this,o),this.requestUpdate(a,l,t,!0,o)}}throw Error("Unsupported decorator location: "+r)};function f(t){return(n,e)=>typeof e=="object"?Qi(t,n,e):((r,i,s)=>{let a=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),a?Object.getOwnPropertyDescriptor(i,s):void 0})(t,n,e)}function g(t){return f({...t,state:!0,attribute:!1})}function W(t,n,e){let r=t?.localize?.(n);return r&&r!==n?r:e}function Ht(t){let n=t.replaceAll("_"," ").toLowerCase();return n.charAt(0).toUpperCase()+n.slice(1)}function ae(t,n){return W(t,`component.ambience.matcher.${n}`,Ht(n))}function oe(t,n){return W(t,`component.ambience.action.${n}`,Ht(n))}function Ee(t,n){return W(t,`component.ambience.anchor.${n}`,Ht(n))}function _e(t,n,e){let r=e[n]?.label;if(r)return r;let i=n.charAt(0).toUpperCase()+n.slice(1);return W(t,`component.ambience.time_of_day_period.${n}`,i)}function u(t,n,e){return W(t,`component.ambience.${n}`,e)}var Xi=["mon","tue","wed","thu","fri","sat","sun"],Zi=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function tt(t,n){return W(t,`component.ambience.weekday.${Xi[n]}`,Zi[n]??String(n))}var en={weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"};function rt(t,n){return W(t,`component.ambience.day_item.${n}`,en[n]??n)}var tn=["January","February","March","April","May","June","July","August","September","October","November","December"];function Ce(t,n){return W(t,`component.ambience.month.${n}`,tn[n-1]??String(n))}var rn={"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"};function it(t,n){return W(t,`component.ambience.weather_condition.${n}`,rn[n]??n)}var nn={temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"};function Ue(t,n){return W(t,`component.ambience.weather_attr.${n}`,nn[n]??n)}var sn={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},an={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},on={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function Rt(t,n,e){if(n==="humidity")return"%";let r=on[n];if(r){let a=e?.attributes?.[r];if(typeof a=="string"&&a)return a}let i=an[n],s=t?.config?.unit_system;return i&&s&&typeof s[i]=="string"?s[i]:sn[n]??""}var ln={is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"};function B(t,n){return W(t,`component.ambience.state_op.${n}`,ln[n]??n)}var dn=["ha-input","ha-textfield","ha-form"],un=["ha-input","ha-textfield"];function xr(){for(let t of un)if(customElements.get(t))return t;return null}function Y(t,n){for(let e of dn)customElements.get(e)||customElements.whenDefined(e).then(()=>t.requestUpdate())}async function nt(t){return t.callWS({type:"ambience/areas/list"})}async function st(t,n){return t.callWS({type:"ambience/area/get",area_id:n})}async function wr(t,n,e){return t.callWS({type:"ambience/area/save",area_id:n,config:e})}async function at(t){return t.callWS({type:"ambience/floors/list"})}async function ot(t,n){return t.callWS({type:"ambience/floor/get",floor_id:n})}async function kr(t,n,e){return t.callWS({type:"ambience/floor/save",floor_id:n,config:e})}async function lt(t){return t.callWS({type:"ambience/house/get"})}async function Er(t,n){return t.callWS({type:"ambience/house/save",config:n})}async function dt(t){return t.callWS({type:"ambience/matchers/list"})}async function Cr(t){return t.callWS({type:"ambience/actions/list"})}async function ut(t){return t.callWS({type:"ambience/time_of_day_periods/list"})}async function Sr(t,n,e){return t.callWS({type:"ambience/time_of_day_periods/save",custom:n,hidden:e})}async function ct(t){return t.callWS({type:"ambience/matchers/day/config/list"})}async function Ar(t,n,e){return t.callWS({type:"ambience/matchers/day/config/save",workday_sensor:n,workday_calendar:e})}async function ht(t){return t.callWS({type:"ambience/matchers/weather/config/list"})}async function Lr(t,n,e){return t.callWS({type:"ambience/matchers/weather/config/save",entity:n,groups:e})}async function Tr(t,n){return t.callWS({type:"ambience/state/known_states",entity_id:n})}async function Fr(t){return t.callWS({type:"ambience/switch_defaults/list"})}async function Mt(t,n,e){return t.callWS({type:"ambience/switch_defaults/save",name:n,auto_on_delay_seconds:e})}async function Pr(t,n,e){return t.callWS({type:"ambience/house/switch/save",name:n,auto_on_delay_seconds:e})}async function Nr(t,n,e,r){return t.callWS({type:"ambience/floor/switch/save",floor_id:n,name:e,auto_on_delay_seconds:r})}async function Ir(t,n,e,r){return t.callWS({type:"ambience/area/switch/save",area_id:n,name:e,auto_on_delay_seconds:r})}function pt(t,n="New rule"){return t.name&&t.name.trim()?t.name:n}function mt(t,n,e){return n==null?u(e.hass,"ui.summary_any_paren","(any)"):t==="time_of_day"?ft(n,e):t==="day"?hn(n,e):t==="weather"?fn(n,e):t==="state"?Ut(n,e):t==="script"?cn(n,e):String(n)}function cn(t,n={}){if(t===null)return u(n.hass,"ui.summary_any_paren","(any)");if(typeof t!="object"||t===null||typeof t.script!="string")return String(t);let e=t.args??{},r=Object.keys(e).sort();if(r.length===0)return t.script;let i=r.map(s=>`${s}=${e[s]}`).join(", ");return`${t.script}(${i})`}function hn(t,n={}){if(t===null)return u(n.hass,"day_summary.any","any");let e=t.include??[],r=t.exclude??[],i=e.length===0?u(n.hass,"day_summary.any_day","any day"):e.map(a=>Or(a,n)).join(", ");if(r.length===0)return i;let s=u(n.hass,"day_summary.except","except");return`${i} (${s} ${r.map(a=>Or(a,n)).join(", ")})`}function Or(t,n){switch(t.kind){case"weekday":return t.days.map(e=>tt(n.hass,e)).join("/");case"day_of_month":return`${u(n.hass,"day_summary.day_prefix","day")} ${t.days}`;case"date":return`${Ce(n.hass,t.month)} ${t.day}`;case"date_range":return`${Ce(n.hass,t.from.month)} ${t.from.day} \u2192 ${Ce(n.hass,t.to.month)} ${t.to.day}`;case"last_day":return u(n.hass,"day_summary.last_day","last day");case"workday":return u(n.hass,"day_summary.workday","workday");case"holiday":return u(n.hass,"day_summary.holiday","holiday");case"first_workday":return u(n.hass,"day_summary.first_workday","first workday");case"last_workday":return u(n.hass,"day_summary.last_workday","last workday")}}var pn={"<":"<","<=":"\u2264",">":">",">=":"\u2265"};function mn(t){return t.split(/[\s_-]+/).filter(n=>n!=="").map(n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()).join(" ")}function fn(t,n={}){if(t===null)return u(n.hass,"ui.summary_any","any");let e=new Map((n.weatherGroups??[]).map(a=>[a.id,a.label])),r=(t.groups??[]).map(a=>e.get(a)??mn(a)).join("/"),i=(t.thresholds??[]).map(a=>`${Ue(n.hass,a.attribute)} ${pn[a.op]??a.op} ${a.value}`).join(", "),s=[r,i].filter(a=>a!=="");return s.length===0?u(n.hass,"ui.summary_any","any"):s.join(", ")}function gn(t,n){let r=t.hass?.states?.[n]?.attributes?.friendly_name;return typeof r=="string"&&r?r:n}function Ut(t,n={}){return t==null?u(n.hass,"ui.summary_any","any"):jt(t,n)}function jt(t,n){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<="){let e=B(n.hass,t.kind),i=t.kind!=="is"&&t.kind!=="is_not"?t.states[0]??"":t.states.join("/"),s=gn(n,t.entity_id),o=`${t.attribute?`${s}.${t.attribute}`:s} ${e} ${i}`;return t.for&&_n(t.for)?`${o} ${u(n.hass,"ui.for_prefix","for")} \u2265${vn(t.for)}`:o}if(t.kind==="and"||t.kind==="or"){let e=` ${B(n.hass,t.kind)} `;return t.items.map(r=>Dr(r,n)).join(e)}return t.kind==="not"?`${B(n.hass,"not")} ${Dr(t.item,n)}`:""}function Dr(t,n){return t.kind==="and"||t.kind==="or"?`(${jt(t,n)})`:jt(t,n)}function _n(t){return t.h>0||t.m>0||t.s>0}function vn(t){let n=[];return t.h&&n.push(`${t.h}h`),t.m&&n.push(`${t.m}m`),t.s&&n.push(`${t.s}s`),n.length?n.join(" "):"0s"}function ft(t,n){if(t===null)return u(n.hass,"ui.summary_any","any");let e=Array.isArray(t)?t:[t],r=n.periods?.custom??{};return e.map(i=>"period"in i?_e(n.hass,i.period,r):`${Hr(i.from,n)} \u2192 ${Hr(i.to,n)}`).join(", ")}function Hr(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=Ee(n.hass,t.anchor);if(t.offset_min===0)return e;let r=Math.abs(t.offset_min),i=r%60===0?`${r/60}${u(n.hass,"ui.unit_hour_abbr","h")}`:`${r}${u(n.hass,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${i}`}function Rr(t,n,e){let r=oe(e.hass,t.action);if(t.action==="script"||n?.kind==="script")return yn(t,r,e);let i=n?.domains?.[0]??u(e.hass,"ui.target_noun","target"),s=t.entity_ids.length,a;s===0?a=u(e.hass,"ui.no_targets","(no targets)"):s===1?a=`1 ${i}`:a=`${s} ${i}s`;let o={};for(let h of n?.target_params??[])h.unit&&(o[h.name]=h.unit);let l=Object.entries(t.params).filter(([,h])=>h!=null&&h!=="").map(([h,m])=>`${h} ${m}${o[h]??""}`).join(", ");return l?`${r}: ${a}, ${l}`:`${r}: ${a}`}function yn(t,n,e){let r=t.script??u(e.hass,"ui.no_script_chosen","(not selected)"),i=t.entity_ids.length,s=u(e.hass,"ui.target_noun","target"),a;i===0?a="":i===1?a=`1 ${s}`:a=`${i} ${s}s`;let o=Object.entries(t.params).filter(([,h])=>h!=null&&h!=="").map(([h,m])=>`${h}=${m}`).join(", "),l=[r,a,o].filter(h=>h!=="");return`${n}: ${l.join(", ")}`}var O=class extends y{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this.availableActions=[];this._dragFrom=null;this._dragOver=null;this._expandedActions=new Set}_emit(e,r){this.dispatchEvent(new CustomEvent(e,{detail:r,bubbles:!0,composed:!0}))}_whenSummary(e){let r=new Map((this.matchers??[]).map(s=>[s.name,s.priority])),i=Object.keys(e.when).filter(s=>e.when[s]!=null).sort((s,a)=>(r.get(s)??1/0)-(r.get(a)??1/0));return i.length===0?u(this.hass,"ui.summary_any","any"):i.map(s=>`${ae(this.hass,s)}: ${mt(s,e.when[s],{hass:this.hass,periods:this.periods,weatherGroups:this.weatherConfig?.groups})}`).join(", ")}_actionCountLabel(e){let r=e.actions.length,i=r===1?u(this.hass,"ui.action_singular","action"):u(this.hass,"ui.action_plural","actions");return`${r} ${i}`}_toggleActions(e){let r=new Set(this._expandedActions);r.has(e)?r.delete(e):r.add(e),this._expandedActions=r}_entityName(e){let i=this.hass?.states?.[e]?.attributes?.friendly_name;return typeof i=="string"&&i?i:e}_actionParamsString(e,r){let i={};for(let s of r?.target_params??[])s.unit&&(i[s.name]=s.unit);return Object.entries(e.params).filter(([,s])=>s!=null&&s!=="").map(([s,a])=>`${s} ${a}${i[s]??""}`).join(", ")}_onDragStart(e){this._dragFrom=e}_onDragOver(e,r){this._dragFrom===null||r===this._dragFrom||(e.preventDefault(),this._dragOver=r)}_onDrop(e){let r=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(r===null||r===e)&&this._emit("reorder-rules",{from:r,to:e})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(e,r){let i=r.name||u(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(e+1));window.confirm(u(this.hass,"ui.confirm_delete",'Delete "{name}"?').replace("{name}",i))&&this._emit("delete-rule",{index:e})}render(){return this.rules.length===0?d`
        <p class="empty">${u(this.hass,"ui.no_rules_yet","No rules yet.")}</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          ${u(this.hass,"ui.add_rule","+ Add rule")}
        </button>
      `:d`
      <ul>
        ${this.rules.map((e,r)=>d`
            <li
              class=${this._dragOver===r?"drag-over":""}
              draggable=${!this.autoSort}
              @dragstart=${()=>this._onDragStart(r)}
              @dragover=${i=>this._onDragOver(i,r)}
              @drop=${()=>this._onDrop(r)}
              @dragend=${this._onDragEnd}
            >
              ${this.autoSort?"":d`<span class="handle" title=${u(this.hass,"ui.drag_to_reorder","Drag to reorder")}>⠿</span>`}
              <span class="idx">${r+1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${()=>this._emit("edit-rule",{index:r})}
                >
                  ${pt(e,u(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(r+1)))}
                </div>
                <div class="summary">
                  ${this._whenSummary(e)} ·
                  <span
                    class="action-count"
                    @click=${()=>this._toggleActions(r)}
                  >${this._actionCountLabel(e)}</span>
                </div>
                ${this._expandedActions.has(r)?d`
                      <div class="actions-detail">
                        ${e.actions.map(i=>{let s=this.availableActions.find(l=>l.name===i.action),a=this._actionParamsString(i,s),o=a?`${oe(this.hass,i.action)} \xB7 ${a}`:oe(this.hass,i.action);return d`
                            <div class="actions-detail-item">
                              <div class="action-header">${o}</div>
                              ${i.entity_ids.length===0?d`<div class="no-targets">${u(this.hass,"ui.no_targets","(no targets)")}</div>`:d`<ul class="entity-list">
                                    ${i.entity_ids.map(l=>d`<li>${this._entityName(l)}</li>`)}
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
    `}};O.styles=$`
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
  `,c([f({attribute:!1})],O.prototype,"rules",2),c([f({type:Boolean})],O.prototype,"autoSort",2),c([f({attribute:!1})],O.prototype,"periods",2),c([f({attribute:!1})],O.prototype,"weatherConfig",2),c([f({attribute:!1})],O.prototype,"hass",2),c([f({attribute:!1})],O.prototype,"matchers",2),c([f({attribute:!1})],O.prototype,"availableActions",2),c([g()],O.prototype,"_dragFrom",2),c([g()],O.prototype,"_dragOver",2),c([g()],O.prototype,"_expandedActions",2),O=c([x("ambience-rules-list")],O);function gt(t,n,e){let r=t;if(!r?.entities)return[];let i=r.entities,s=r.devices??{},a=r.areas??{},o=n.kind==="area"?new Set([n.id]):n.kind==="floor"?new Set(Object.values(a).filter(h=>h.floor_id===n.id).map(h=>h.area_id)):null,l=h=>{let m=h.area_id??(h.device_id?s[h.device_id]?.area_id??null:null);return m==null?!1:o===null?!0:o.has(m)};return Object.values(i).filter(l).filter(h=>e.includes(h.entity_id.split(".")[0])).map(h=>h.entity_id).sort()}var G=class extends y{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=e=>{this._open&&(e.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=e=>{e.stopPropagation();let r=e.detail.value?.scene??"";this._emit(r.trim()===""?null:r)};this._sceneComputeLabel=e=>e.name==="scene"?u(this.hass,"ui.scene_name","Scene name"):e.name}connectedCallback(){super.connectedCallback(),Y(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(e){e.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(r=>({value:r,label:r})),custom_value:!0,mode:"dropdown"}}}])}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onInput(e){let r=e.target.value;this._emit(r.trim()===""?null:r),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(e){e.key==="Escape"&&this._open&&(this._open=!1,e.stopPropagation())}_toggle(e){e.preventDefault(),this._open=!this._open}_select(e,r){r.preventDefault(),this._emit(e),this._open=!1}render(){if(customElements.get("ha-form")){let e={scene:this.value??""};return d`
        <ha-form
          .hass=${this.hass}
          .schema=${this._schema}
          .data=${e}
          .computeLabel=${this._sceneComputeLabel}
          @value-changed=${this._onHaFormValueChanged}
        ></ha-form>
      `}return d`
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
      ${this._open?d`
            <div class="menu" role="listbox">
              ${this.suggestions.length===0?d`<div class="empty">
                    ${u(this.hass,"ui.no_scenes_yet","No scenes yet \u2014 type to create one")}
                  </div>`:this.suggestions.map(e=>d`
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
    `}};G.styles=$`
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
  `,c([f({attribute:!1})],G.prototype,"hass",2),c([f()],G.prototype,"value",2),c([f({attribute:!1})],G.prototype,"suggestions",2),c([g()],G.prototype,"_schema",2),c([g()],G.prototype,"_open",2),G=c([x("ambience-scene-combobox")],G);function ei(t){return typeof t>"u"||t===null}function bn(t){return typeof t=="object"&&t!==null}function $n(t){return Array.isArray(t)?t:ei(t)?[]:[t]}function xn(t,n){var e,r,i,s;if(n)for(s=Object.keys(n),e=0,r=s.length;e<r;e+=1)i=s[e],t[i]=n[i];return t}function wn(t,n){var e="",r;for(r=0;r<n;r+=1)e+=t;return e}function kn(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var En=ei,Cn=bn,Sn=$n,An=wn,Ln=kn,Tn=xn,L={isNothing:En,isObject:Cn,toArray:Sn,repeat:An,isNegativeZero:Ln,extend:Tn};function ti(t,n){var e="",r=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(e+='in "'+t.mark.name+'" '),e+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!n&&t.mark.snippet&&(e+=`

`+t.mark.snippet),r+" "+e):r}function We(t,n){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=n,this.message=ti(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}We.prototype=Object.create(Error.prototype);We.prototype.constructor=We;We.prototype.toString=function(n){return this.name+": "+ti(this,n)};var D=We;function zt(t,n,e,r,i){var s="",a="",o=Math.floor(i/2)-1;return r-n>o&&(s=" ... ",n=r-o+s.length),e-r>o&&(a=" ...",e=r+o-a.length),{str:s+t.slice(n,e).replace(/\t/g,"\u2192")+a,pos:r-n+s.length}}function Wt(t,n){return L.repeat(" ",n-t.length)+t}function Fn(t,n){if(n=Object.create(n||null),!t.buffer)return null;n.maxLength||(n.maxLength=79),typeof n.indent!="number"&&(n.indent=1),typeof n.linesBefore!="number"&&(n.linesBefore=3),typeof n.linesAfter!="number"&&(n.linesAfter=2);for(var e=/\r?\n|\r|\0/g,r=[0],i=[],s,a=-1;s=e.exec(t.buffer);)i.push(s.index),r.push(s.index+s[0].length),t.position<=s.index&&a<0&&(a=r.length-2);a<0&&(a=r.length-1);var o="",l,h,m=Math.min(t.line+n.linesAfter,i.length).toString().length,p=n.maxLength-(n.indent+m+3);for(l=1;l<=n.linesBefore&&!(a-l<0);l++)h=zt(t.buffer,r[a-l],i[a-l],t.position-(r[a]-r[a-l]),p),o=L.repeat(" ",n.indent)+Wt((t.line-l+1).toString(),m)+" | "+h.str+`
`+o;for(h=zt(t.buffer,r[a],i[a],t.position,p),o+=L.repeat(" ",n.indent)+Wt((t.line+1).toString(),m)+" | "+h.str+`
`,o+=L.repeat("-",n.indent+m+3+h.pos)+`^
`,l=1;l<=n.linesAfter&&!(a+l>=i.length);l++)h=zt(t.buffer,r[a+l],i[a+l],t.position-(r[a]-r[a+l]),p),o+=L.repeat(" ",n.indent)+Wt((t.line+l+1).toString(),m)+" | "+h.str+`
`;return o.replace(/\n$/,"")}var Pn=Fn,Nn=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],In=["scalar","sequence","mapping"];function On(t){var n={};return t!==null&&Object.keys(t).forEach(function(e){t[e].forEach(function(r){n[String(r)]=e})}),n}function Dn(t,n){if(n=n||{},Object.keys(n).forEach(function(e){if(Nn.indexOf(e)===-1)throw new D('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.options=n,this.tag=t,this.kind=n.kind||null,this.resolve=n.resolve||function(){return!0},this.construct=n.construct||function(e){return e},this.instanceOf=n.instanceOf||null,this.predicate=n.predicate||null,this.represent=n.represent||null,this.representName=n.representName||null,this.defaultStyle=n.defaultStyle||null,this.multi=n.multi||!1,this.styleAliases=On(n.styleAliases||null),In.indexOf(this.kind)===-1)throw new D('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var N=Dn;function Mr(t,n){var e=[];return t[n].forEach(function(r){var i=e.length;e.forEach(function(s,a){s.tag===r.tag&&s.kind===r.kind&&s.multi===r.multi&&(i=a)}),e[i]=r}),e}function Hn(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},n,e;function r(i){i.multi?(t.multi[i.kind].push(i),t.multi.fallback.push(i)):t[i.kind][i.tag]=t.fallback[i.tag]=i}for(n=0,e=arguments.length;n<e;n+=1)arguments[n].forEach(r);return t}function Yt(t){return this.extend(t)}Yt.prototype.extend=function(n){var e=[],r=[];if(n instanceof N)r.push(n);else if(Array.isArray(n))r=r.concat(n);else if(n&&(Array.isArray(n.implicit)||Array.isArray(n.explicit)))n.implicit&&(e=e.concat(n.implicit)),n.explicit&&(r=r.concat(n.explicit));else throw new D("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.forEach(function(s){if(!(s instanceof N))throw new D("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new D("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new D("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),r.forEach(function(s){if(!(s instanceof N))throw new D("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var i=Object.create(Yt.prototype);return i.implicit=(this.implicit||[]).concat(e),i.explicit=(this.explicit||[]).concat(r),i.compiledImplicit=Mr(i,"implicit"),i.compiledExplicit=Mr(i,"explicit"),i.compiledTypeMap=Hn(i.compiledImplicit,i.compiledExplicit),i};var Rn=Yt,Mn=new N("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),jn=new N("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),Un=new N("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),zn=new Rn({explicit:[Mn,jn,Un]});function Wn(t){if(t===null)return!0;var n=t.length;return n===1&&t==="~"||n===4&&(t==="null"||t==="Null"||t==="NULL")}function Bn(){return null}function Yn(t){return t===null}var Gn=new N("tag:yaml.org,2002:null",{kind:"scalar",resolve:Wn,construct:Bn,predicate:Yn,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function qn(t){if(t===null)return!1;var n=t.length;return n===4&&(t==="true"||t==="True"||t==="TRUE")||n===5&&(t==="false"||t==="False"||t==="FALSE")}function Kn(t){return t==="true"||t==="True"||t==="TRUE"}function Vn(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var Jn=new N("tag:yaml.org,2002:bool",{kind:"scalar",resolve:qn,construct:Kn,predicate:Vn,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function Qn(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function Xn(t){return 48<=t&&t<=55}function Zn(t){return 48<=t&&t<=57}function es(t){if(t===null)return!1;var n=t.length,e=0,r=!1,i;if(!n)return!1;if(i=t[e],(i==="-"||i==="+")&&(i=t[++e]),i==="0"){if(e+1===n)return!0;if(i=t[++e],i==="b"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(i!=="0"&&i!=="1")return!1;r=!0}return r&&i!=="_"}if(i==="x"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(!Qn(t.charCodeAt(e)))return!1;r=!0}return r&&i!=="_"}if(i==="o"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(!Xn(t.charCodeAt(e)))return!1;r=!0}return r&&i!=="_"}}if(i==="_")return!1;for(;e<n;e++)if(i=t[e],i!=="_"){if(!Zn(t.charCodeAt(e)))return!1;r=!0}return!(!r||i==="_")}function ts(t){var n=t,e=1,r;if(n.indexOf("_")!==-1&&(n=n.replace(/_/g,"")),r=n[0],(r==="-"||r==="+")&&(r==="-"&&(e=-1),n=n.slice(1),r=n[0]),n==="0")return 0;if(r==="0"){if(n[1]==="b")return e*parseInt(n.slice(2),2);if(n[1]==="x")return e*parseInt(n.slice(2),16);if(n[1]==="o")return e*parseInt(n.slice(2),8)}return e*parseInt(n,10)}function rs(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!L.isNegativeZero(t)}var is=new N("tag:yaml.org,2002:int",{kind:"scalar",resolve:es,construct:ts,predicate:rs,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),ns=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function ss(t){return!(t===null||!ns.test(t)||t[t.length-1]==="_")}function as(t){var n,e;return n=t.replace(/_/g,"").toLowerCase(),e=n[0]==="-"?-1:1,"+-".indexOf(n[0])>=0&&(n=n.slice(1)),n===".inf"?e===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:n===".nan"?NaN:e*parseFloat(n,10)}var os=/^[-+]?[0-9]+e/;function ls(t,n){var e;if(isNaN(t))switch(n){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(n){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(n){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(L.isNegativeZero(t))return"-0.0";return e=t.toString(10),os.test(e)?e.replace("e",".e"):e}function ds(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||L.isNegativeZero(t))}var us=new N("tag:yaml.org,2002:float",{kind:"scalar",resolve:ss,construct:as,predicate:ds,represent:ls,defaultStyle:"lowercase"}),cs=zn.extend({implicit:[Gn,Jn,is,us]}),hs=cs,ri=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),ii=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function ps(t){return t===null?!1:ri.exec(t)!==null||ii.exec(t)!==null}function ms(t){var n,e,r,i,s,a,o,l=0,h=null,m,p,_;if(n=ri.exec(t),n===null&&(n=ii.exec(t)),n===null)throw new Error("Date resolve error");if(e=+n[1],r=+n[2]-1,i=+n[3],!n[4])return new Date(Date.UTC(e,r,i));if(s=+n[4],a=+n[5],o=+n[6],n[7]){for(l=n[7].slice(0,3);l.length<3;)l+="0";l=+l}return n[9]&&(m=+n[10],p=+(n[11]||0),h=(m*60+p)*6e4,n[9]==="-"&&(h=-h)),_=new Date(Date.UTC(e,r,i,s,a,o,l)),h&&_.setTime(_.getTime()-h),_}function fs(t){return t.toISOString()}var gs=new N("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:ps,construct:ms,instanceOf:Date,represent:fs});function _s(t){return t==="<<"||t===null}var vs=new N("tag:yaml.org,2002:merge",{kind:"scalar",resolve:_s}),Jt=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function ys(t){if(t===null)return!1;var n,e,r=0,i=t.length,s=Jt;for(e=0;e<i;e++)if(n=s.indexOf(t.charAt(e)),!(n>64)){if(n<0)return!1;r+=6}return r%8===0}function bs(t){var n,e,r=t.replace(/[\r\n=]/g,""),i=r.length,s=Jt,a=0,o=[];for(n=0;n<i;n++)n%4===0&&n&&(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)),a=a<<6|s.indexOf(r.charAt(n));return e=i%4*6,e===0?(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)):e===18?(o.push(a>>10&255),o.push(a>>2&255)):e===12&&o.push(a>>4&255),new Uint8Array(o)}function $s(t){var n="",e=0,r,i,s=t.length,a=Jt;for(r=0;r<s;r++)r%3===0&&r&&(n+=a[e>>18&63],n+=a[e>>12&63],n+=a[e>>6&63],n+=a[e&63]),e=(e<<8)+t[r];return i=s%3,i===0?(n+=a[e>>18&63],n+=a[e>>12&63],n+=a[e>>6&63],n+=a[e&63]):i===2?(n+=a[e>>10&63],n+=a[e>>4&63],n+=a[e<<2&63],n+=a[64]):i===1&&(n+=a[e>>2&63],n+=a[e<<4&63],n+=a[64],n+=a[64]),n}function xs(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var ws=new N("tag:yaml.org,2002:binary",{kind:"scalar",resolve:ys,construct:bs,predicate:xs,represent:$s}),ks=Object.prototype.hasOwnProperty,Es=Object.prototype.toString;function Cs(t){if(t===null)return!0;var n=[],e,r,i,s,a,o=t;for(e=0,r=o.length;e<r;e+=1){if(i=o[e],a=!1,Es.call(i)!=="[object Object]")return!1;for(s in i)if(ks.call(i,s))if(!a)a=!0;else return!1;if(!a)return!1;if(n.indexOf(s)===-1)n.push(s);else return!1}return!0}function Ss(t){return t!==null?t:[]}var As=new N("tag:yaml.org,2002:omap",{kind:"sequence",resolve:Cs,construct:Ss}),Ls=Object.prototype.toString;function Ts(t){if(t===null)return!0;var n,e,r,i,s,a=t;for(s=new Array(a.length),n=0,e=a.length;n<e;n+=1){if(r=a[n],Ls.call(r)!=="[object Object]"||(i=Object.keys(r),i.length!==1))return!1;s[n]=[i[0],r[i[0]]]}return!0}function Fs(t){if(t===null)return[];var n,e,r,i,s,a=t;for(s=new Array(a.length),n=0,e=a.length;n<e;n+=1)r=a[n],i=Object.keys(r),s[n]=[i[0],r[i[0]]];return s}var Ps=new N("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:Ts,construct:Fs}),Ns=Object.prototype.hasOwnProperty;function Is(t){if(t===null)return!0;var n,e=t;for(n in e)if(Ns.call(e,n)&&e[n]!==null)return!1;return!0}function Os(t){return t!==null?t:{}}var Ds=new N("tag:yaml.org,2002:set",{kind:"mapping",resolve:Is,construct:Os}),ni=hs.extend({implicit:[gs,vs],explicit:[ws,As,Ps,Ds]}),de=Object.prototype.hasOwnProperty,_t=1,si=2,ai=3,vt=4,Bt=1,Hs=2,jr=3,Rs=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Ms=/[\x85\u2028\u2029]/,js=/[,\[\]\{\}]/,oi=/^(?:!|!!|![a-z\-]+!)$/i,li=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Ur(t){return Object.prototype.toString.call(t)}function q(t){return t===10||t===13}function ye(t){return t===9||t===32}function H(t){return t===9||t===32||t===10||t===13}function Ae(t){return t===44||t===91||t===93||t===123||t===125}function Us(t){var n;return 48<=t&&t<=57?t-48:(n=t|32,97<=n&&n<=102?n-97+10:-1)}function zs(t){return t===120?2:t===117?4:t===85?8:0}function Ws(t){return 48<=t&&t<=57?t-48:-1}function zr(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"\x85":t===95?"\xA0":t===76?"\u2028":t===80?"\u2029":""}function Bs(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function di(t,n,e){n==="__proto__"?Object.defineProperty(t,n,{configurable:!0,enumerable:!0,writable:!0,value:e}):t[n]=e}var ui=new Array(256),ci=new Array(256);for(ve=0;ve<256;ve++)ui[ve]=zr(ve)?1:0,ci[ve]=zr(ve);var ve;function Ys(t,n){this.input=t,this.filename=n.filename||null,this.schema=n.schema||ni,this.onWarning=n.onWarning||null,this.legacy=n.legacy||!1,this.json=n.json||!1,this.listener=n.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function hi(t,n){var e={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return e.snippet=Pn(e),new D(n,e)}function b(t,n){throw hi(t,n)}function yt(t,n){t.onWarning&&t.onWarning.call(null,hi(t,n))}var Wr={YAML:function(n,e,r){var i,s,a;n.version!==null&&b(n,"duplication of %YAML directive"),r.length!==1&&b(n,"YAML directive accepts exactly one argument"),i=/^([0-9]+)\.([0-9]+)$/.exec(r[0]),i===null&&b(n,"ill-formed argument of the YAML directive"),s=parseInt(i[1],10),a=parseInt(i[2],10),s!==1&&b(n,"unacceptable YAML version of the document"),n.version=r[0],n.checkLineBreaks=a<2,a!==1&&a!==2&&yt(n,"unsupported YAML version of the document")},TAG:function(n,e,r){var i,s;r.length!==2&&b(n,"TAG directive accepts exactly two arguments"),i=r[0],s=r[1],oi.test(i)||b(n,"ill-formed tag handle (first argument) of the TAG directive"),de.call(n.tagMap,i)&&b(n,'there is a previously declared suffix for "'+i+'" tag handle'),li.test(s)||b(n,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{b(n,"tag prefix is malformed: "+s)}n.tagMap[i]=s}};function le(t,n,e,r){var i,s,a,o;if(n<e){if(o=t.input.slice(n,e),r)for(i=0,s=o.length;i<s;i+=1)a=o.charCodeAt(i),a===9||32<=a&&a<=1114111||b(t,"expected valid JSON character");else Rs.test(o)&&b(t,"the stream contains non-printable characters");t.result+=o}}function Br(t,n,e,r){var i,s,a,o;for(L.isObject(e)||b(t,"cannot merge mappings; the provided source object is unacceptable"),i=Object.keys(e),a=0,o=i.length;a<o;a+=1)s=i[a],de.call(n,s)||(di(n,s,e[s]),r[s]=!0)}function Le(t,n,e,r,i,s,a,o,l){var h,m;if(Array.isArray(i))for(i=Array.prototype.slice.call(i),h=0,m=i.length;h<m;h+=1)Array.isArray(i[h])&&b(t,"nested arrays are not supported inside keys"),typeof i=="object"&&Ur(i[h])==="[object Object]"&&(i[h]="[object Object]");if(typeof i=="object"&&Ur(i)==="[object Object]"&&(i="[object Object]"),i=String(i),n===null&&(n={}),r==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(h=0,m=s.length;h<m;h+=1)Br(t,n,s[h],e);else Br(t,n,s,e);else!t.json&&!de.call(e,i)&&de.call(n,i)&&(t.line=a||t.line,t.lineStart=o||t.lineStart,t.position=l||t.position,b(t,"duplicated mapping key")),di(n,i,s),delete e[i];return n}function Qt(t){var n;n=t.input.charCodeAt(t.position),n===10?t.position++:n===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):b(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function A(t,n,e){for(var r=0,i=t.input.charCodeAt(t.position);i!==0;){for(;ye(i);)i===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),i=t.input.charCodeAt(++t.position);if(n&&i===35)do i=t.input.charCodeAt(++t.position);while(i!==10&&i!==13&&i!==0);if(q(i))for(Qt(t),i=t.input.charCodeAt(t.position),r++,t.lineIndent=0;i===32;)t.lineIndent++,i=t.input.charCodeAt(++t.position);else break}return e!==-1&&r!==0&&t.lineIndent<e&&yt(t,"deficient indentation"),r}function xt(t){var n=t.position,e;return e=t.input.charCodeAt(n),!!((e===45||e===46)&&e===t.input.charCodeAt(n+1)&&e===t.input.charCodeAt(n+2)&&(n+=3,e=t.input.charCodeAt(n),e===0||H(e)))}function Xt(t,n){n===1?t.result+=" ":n>1&&(t.result+=L.repeat(`
`,n-1))}function Gs(t,n,e){var r,i,s,a,o,l,h,m,p=t.kind,_=t.result,v;if(v=t.input.charCodeAt(t.position),H(v)||Ae(v)||v===35||v===38||v===42||v===33||v===124||v===62||v===39||v===34||v===37||v===64||v===96||(v===63||v===45)&&(i=t.input.charCodeAt(t.position+1),H(i)||e&&Ae(i)))return!1;for(t.kind="scalar",t.result="",s=a=t.position,o=!1;v!==0;){if(v===58){if(i=t.input.charCodeAt(t.position+1),H(i)||e&&Ae(i))break}else if(v===35){if(r=t.input.charCodeAt(t.position-1),H(r))break}else{if(t.position===t.lineStart&&xt(t)||e&&Ae(v))break;if(q(v))if(l=t.line,h=t.lineStart,m=t.lineIndent,A(t,!1,-1),t.lineIndent>=n){o=!0,v=t.input.charCodeAt(t.position);continue}else{t.position=a,t.line=l,t.lineStart=h,t.lineIndent=m;break}}o&&(le(t,s,a,!1),Xt(t,t.line-l),s=a=t.position,o=!1),ye(v)||(a=t.position+1),v=t.input.charCodeAt(++t.position)}return le(t,s,a,!1),t.result?!0:(t.kind=p,t.result=_,!1)}function qs(t,n){var e,r,i;if(e=t.input.charCodeAt(t.position),e!==39)return!1;for(t.kind="scalar",t.result="",t.position++,r=i=t.position;(e=t.input.charCodeAt(t.position))!==0;)if(e===39)if(le(t,r,t.position,!0),e=t.input.charCodeAt(++t.position),e===39)r=t.position,t.position++,i=t.position;else return!0;else q(e)?(le(t,r,i,!0),Xt(t,A(t,!1,n)),r=i=t.position):t.position===t.lineStart&&xt(t)?b(t,"unexpected end of the document within a single quoted scalar"):(t.position++,i=t.position);b(t,"unexpected end of the stream within a single quoted scalar")}function Ks(t,n){var e,r,i,s,a,o;if(o=t.input.charCodeAt(t.position),o!==34)return!1;for(t.kind="scalar",t.result="",t.position++,e=r=t.position;(o=t.input.charCodeAt(t.position))!==0;){if(o===34)return le(t,e,t.position,!0),t.position++,!0;if(o===92){if(le(t,e,t.position,!0),o=t.input.charCodeAt(++t.position),q(o))A(t,!1,n);else if(o<256&&ui[o])t.result+=ci[o],t.position++;else if((a=zs(o))>0){for(i=a,s=0;i>0;i--)o=t.input.charCodeAt(++t.position),(a=Us(o))>=0?s=(s<<4)+a:b(t,"expected hexadecimal character");t.result+=Bs(s),t.position++}else b(t,"unknown escape sequence");e=r=t.position}else q(o)?(le(t,e,r,!0),Xt(t,A(t,!1,n)),e=r=t.position):t.position===t.lineStart&&xt(t)?b(t,"unexpected end of the document within a double quoted scalar"):(t.position++,r=t.position)}b(t,"unexpected end of the stream within a double quoted scalar")}function Vs(t,n){var e=!0,r,i,s,a=t.tag,o,l=t.anchor,h,m,p,_,v,k=Object.create(null),w,C,z,E;if(E=t.input.charCodeAt(t.position),E===91)m=93,v=!1,o=[];else if(E===123)m=125,v=!0,o={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=o),E=t.input.charCodeAt(++t.position);E!==0;){if(A(t,!0,n),E=t.input.charCodeAt(t.position),E===m)return t.position++,t.tag=a,t.anchor=l,t.kind=v?"mapping":"sequence",t.result=o,!0;e?E===44&&b(t,"expected the node content, but found ','"):b(t,"missed comma between flow collection entries"),C=w=z=null,p=_=!1,E===63&&(h=t.input.charCodeAt(t.position+1),H(h)&&(p=_=!0,t.position++,A(t,!0,n))),r=t.line,i=t.lineStart,s=t.position,Te(t,n,_t,!1,!0),C=t.tag,w=t.result,A(t,!0,n),E=t.input.charCodeAt(t.position),(_||t.line===r)&&E===58&&(p=!0,E=t.input.charCodeAt(++t.position),A(t,!0,n),Te(t,n,_t,!1,!0),z=t.result),v?Le(t,o,k,C,w,z,r,i,s):p?o.push(Le(t,null,k,C,w,z,r,i,s)):o.push(w),A(t,!0,n),E=t.input.charCodeAt(t.position),E===44?(e=!0,E=t.input.charCodeAt(++t.position)):e=!1}b(t,"unexpected end of the stream within a flow collection")}function Js(t,n){var e,r,i=Bt,s=!1,a=!1,o=n,l=0,h=!1,m,p;if(p=t.input.charCodeAt(t.position),p===124)r=!1;else if(p===62)r=!0;else return!1;for(t.kind="scalar",t.result="";p!==0;)if(p=t.input.charCodeAt(++t.position),p===43||p===45)Bt===i?i=p===43?jr:Hs:b(t,"repeat of a chomping mode identifier");else if((m=Ws(p))>=0)m===0?b(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):a?b(t,"repeat of an indentation width identifier"):(o=n+m-1,a=!0);else break;if(ye(p)){do p=t.input.charCodeAt(++t.position);while(ye(p));if(p===35)do p=t.input.charCodeAt(++t.position);while(!q(p)&&p!==0)}for(;p!==0;){for(Qt(t),t.lineIndent=0,p=t.input.charCodeAt(t.position);(!a||t.lineIndent<o)&&p===32;)t.lineIndent++,p=t.input.charCodeAt(++t.position);if(!a&&t.lineIndent>o&&(o=t.lineIndent),q(p)){l++;continue}if(t.lineIndent<o){i===jr?t.result+=L.repeat(`
`,s?1+l:l):i===Bt&&s&&(t.result+=`
`);break}for(r?ye(p)?(h=!0,t.result+=L.repeat(`
`,s?1+l:l)):h?(h=!1,t.result+=L.repeat(`
`,l+1)):l===0?s&&(t.result+=" "):t.result+=L.repeat(`
`,l):t.result+=L.repeat(`
`,s?1+l:l),s=!0,a=!0,l=0,e=t.position;!q(p)&&p!==0;)p=t.input.charCodeAt(++t.position);le(t,e,t.position,!1)}return!0}function Yr(t,n){var e,r=t.tag,i=t.anchor,s=[],a,o=!1,l;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=s),l=t.input.charCodeAt(t.position);l!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,b(t,"tab characters must not be used in indentation")),!(l!==45||(a=t.input.charCodeAt(t.position+1),!H(a))));){if(o=!0,t.position++,A(t,!0,-1)&&t.lineIndent<=n){s.push(null),l=t.input.charCodeAt(t.position);continue}if(e=t.line,Te(t,n,ai,!1,!0),s.push(t.result),A(t,!0,-1),l=t.input.charCodeAt(t.position),(t.line===e||t.lineIndent>n)&&l!==0)b(t,"bad indentation of a sequence entry");else if(t.lineIndent<n)break}return o?(t.tag=r,t.anchor=i,t.kind="sequence",t.result=s,!0):!1}function Qs(t,n,e){var r,i,s,a,o,l,h=t.tag,m=t.anchor,p={},_=Object.create(null),v=null,k=null,w=null,C=!1,z=!1,E;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=p),E=t.input.charCodeAt(t.position);E!==0;){if(!C&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,b(t,"tab characters must not be used in indentation")),r=t.input.charCodeAt(t.position+1),s=t.line,(E===63||E===58)&&H(r))E===63?(C&&(Le(t,p,_,v,k,null,a,o,l),v=k=w=null),z=!0,C=!0,i=!0):C?(C=!1,i=!0):b(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,E=r;else{if(a=t.line,o=t.lineStart,l=t.position,!Te(t,e,si,!1,!0))break;if(t.line===s){for(E=t.input.charCodeAt(t.position);ye(E);)E=t.input.charCodeAt(++t.position);if(E===58)E=t.input.charCodeAt(++t.position),H(E)||b(t,"a whitespace character is expected after the key-value separator within a block mapping"),C&&(Le(t,p,_,v,k,null,a,o,l),v=k=w=null),z=!0,C=!1,i=!1,v=t.tag,k=t.result;else if(z)b(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=h,t.anchor=m,!0}else if(z)b(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=h,t.anchor=m,!0}if((t.line===s||t.lineIndent>n)&&(C&&(a=t.line,o=t.lineStart,l=t.position),Te(t,n,vt,!0,i)&&(C?k=t.result:w=t.result),C||(Le(t,p,_,v,k,w,a,o,l),v=k=w=null),A(t,!0,-1),E=t.input.charCodeAt(t.position)),(t.line===s||t.lineIndent>n)&&E!==0)b(t,"bad indentation of a mapping entry");else if(t.lineIndent<n)break}return C&&Le(t,p,_,v,k,null,a,o,l),z&&(t.tag=h,t.anchor=m,t.kind="mapping",t.result=p),z}function Xs(t){var n,e=!1,r=!1,i,s,a;if(a=t.input.charCodeAt(t.position),a!==33)return!1;if(t.tag!==null&&b(t,"duplication of a tag property"),a=t.input.charCodeAt(++t.position),a===60?(e=!0,a=t.input.charCodeAt(++t.position)):a===33?(r=!0,i="!!",a=t.input.charCodeAt(++t.position)):i="!",n=t.position,e){do a=t.input.charCodeAt(++t.position);while(a!==0&&a!==62);t.position<t.length?(s=t.input.slice(n,t.position),a=t.input.charCodeAt(++t.position)):b(t,"unexpected end of the stream within a verbatim tag")}else{for(;a!==0&&!H(a);)a===33&&(r?b(t,"tag suffix cannot contain exclamation marks"):(i=t.input.slice(n-1,t.position+1),oi.test(i)||b(t,"named tag handle cannot contain such characters"),r=!0,n=t.position+1)),a=t.input.charCodeAt(++t.position);s=t.input.slice(n,t.position),js.test(s)&&b(t,"tag suffix cannot contain flow indicator characters")}s&&!li.test(s)&&b(t,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{b(t,"tag name is malformed: "+s)}return e?t.tag=s:de.call(t.tagMap,i)?t.tag=t.tagMap[i]+s:i==="!"?t.tag="!"+s:i==="!!"?t.tag="tag:yaml.org,2002:"+s:b(t,'undeclared tag handle "'+i+'"'),!0}function Zs(t){var n,e;if(e=t.input.charCodeAt(t.position),e!==38)return!1;for(t.anchor!==null&&b(t,"duplication of an anchor property"),e=t.input.charCodeAt(++t.position),n=t.position;e!==0&&!H(e)&&!Ae(e);)e=t.input.charCodeAt(++t.position);return t.position===n&&b(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(n,t.position),!0}function ea(t){var n,e,r;if(r=t.input.charCodeAt(t.position),r!==42)return!1;for(r=t.input.charCodeAt(++t.position),n=t.position;r!==0&&!H(r)&&!Ae(r);)r=t.input.charCodeAt(++t.position);return t.position===n&&b(t,"name of an alias node must contain at least one character"),e=t.input.slice(n,t.position),de.call(t.anchorMap,e)||b(t,'unidentified alias "'+e+'"'),t.result=t.anchorMap[e],A(t,!0,-1),!0}function Te(t,n,e,r,i){var s,a,o,l=1,h=!1,m=!1,p,_,v,k,w,C;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,s=a=o=vt===e||ai===e,r&&A(t,!0,-1)&&(h=!0,t.lineIndent>n?l=1:t.lineIndent===n?l=0:t.lineIndent<n&&(l=-1)),l===1)for(;Xs(t)||Zs(t);)A(t,!0,-1)?(h=!0,o=s,t.lineIndent>n?l=1:t.lineIndent===n?l=0:t.lineIndent<n&&(l=-1)):o=!1;if(o&&(o=h||i),(l===1||vt===e)&&(_t===e||si===e?w=n:w=n+1,C=t.position-t.lineStart,l===1?o&&(Yr(t,C)||Qs(t,C,w))||Vs(t,w)?m=!0:(a&&Js(t,w)||qs(t,w)||Ks(t,w)?m=!0:ea(t)?(m=!0,(t.tag!==null||t.anchor!==null)&&b(t,"alias node should not have any properties")):Gs(t,w,_t===e)&&(m=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):l===0&&(m=o&&Yr(t,C))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&b(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),p=0,_=t.implicitTypes.length;p<_;p+=1)if(k=t.implicitTypes[p],k.resolve(t.result)){t.result=k.construct(t.result),t.tag=k.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(de.call(t.typeMap[t.kind||"fallback"],t.tag))k=t.typeMap[t.kind||"fallback"][t.tag];else for(k=null,v=t.typeMap.multi[t.kind||"fallback"],p=0,_=v.length;p<_;p+=1)if(t.tag.slice(0,v[p].tag.length)===v[p].tag){k=v[p];break}k||b(t,"unknown tag !<"+t.tag+">"),t.result!==null&&k.kind!==t.kind&&b(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+k.kind+'", not "'+t.kind+'"'),k.resolve(t.result,t.tag)?(t.result=k.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):b(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||m}function ta(t){var n=t.position,e,r,i,s=!1,a;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(a=t.input.charCodeAt(t.position))!==0&&(A(t,!0,-1),a=t.input.charCodeAt(t.position),!(t.lineIndent>0||a!==37));){for(s=!0,a=t.input.charCodeAt(++t.position),e=t.position;a!==0&&!H(a);)a=t.input.charCodeAt(++t.position);for(r=t.input.slice(e,t.position),i=[],r.length<1&&b(t,"directive name must not be less than one character in length");a!==0;){for(;ye(a);)a=t.input.charCodeAt(++t.position);if(a===35){do a=t.input.charCodeAt(++t.position);while(a!==0&&!q(a));break}if(q(a))break;for(e=t.position;a!==0&&!H(a);)a=t.input.charCodeAt(++t.position);i.push(t.input.slice(e,t.position))}a!==0&&Qt(t),de.call(Wr,r)?Wr[r](t,r,i):yt(t,'unknown document directive "'+r+'"')}if(A(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,A(t,!0,-1)):s&&b(t,"directives end mark is expected"),Te(t,t.lineIndent-1,vt,!1,!0),A(t,!0,-1),t.checkLineBreaks&&Ms.test(t.input.slice(n,t.position))&&yt(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&xt(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,A(t,!0,-1));return}if(t.position<t.length-1)b(t,"end of the stream or a document separator is expected");else return}function pi(t,n){t=String(t),n=n||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var e=new Ys(t,n),r=t.indexOf("\0");for(r!==-1&&(e.position=r,b(e,"null byte is not allowed in input")),e.input+="\0";e.input.charCodeAt(e.position)===32;)e.lineIndent+=1,e.position+=1;for(;e.position<e.length-1;)ta(e);return e.documents}function ra(t,n,e){n!==null&&typeof n=="object"&&typeof e>"u"&&(e=n,n=null);var r=pi(t,e);if(typeof n!="function")return r;for(var i=0,s=r.length;i<s;i+=1)n(r[i])}function ia(t,n){var e=pi(t,n);if(e.length!==0){if(e.length===1)return e[0];throw new D("expected a single document in the stream, but found more")}}var na=ra,sa=ia,mi={loadAll:na,load:sa},fi=Object.prototype.toString,gi=Object.prototype.hasOwnProperty,Zt=65279,aa=9,Be=10,oa=13,la=32,da=33,ua=34,Gt=35,ca=37,ha=38,pa=39,ma=42,_i=44,fa=45,bt=58,ga=61,_a=62,va=63,ya=64,vi=91,yi=93,ba=96,bi=123,$a=124,$i=125,I={};I[0]="\\0";I[7]="\\a";I[8]="\\b";I[9]="\\t";I[10]="\\n";I[11]="\\v";I[12]="\\f";I[13]="\\r";I[27]="\\e";I[34]='\\"';I[92]="\\\\";I[133]="\\N";I[160]="\\_";I[8232]="\\L";I[8233]="\\P";var xa=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],wa=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function ka(t,n){var e,r,i,s,a,o,l;if(n===null)return{};for(e={},r=Object.keys(n),i=0,s=r.length;i<s;i+=1)a=r[i],o=String(n[a]),a.slice(0,2)==="!!"&&(a="tag:yaml.org,2002:"+a.slice(2)),l=t.compiledTypeMap.fallback[a],l&&gi.call(l.styleAliases,o)&&(o=l.styleAliases[o]),e[a]=o;return e}function Ea(t){var n,e,r;if(n=t.toString(16).toUpperCase(),t<=255)e="x",r=2;else if(t<=65535)e="u",r=4;else if(t<=4294967295)e="U",r=8;else throw new D("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+e+L.repeat("0",r-n.length)+n}var Ca=1,Ye=2;function Sa(t){this.schema=t.schema||ni,this.indent=Math.max(1,t.indent||2),this.noArrayIndent=t.noArrayIndent||!1,this.skipInvalid=t.skipInvalid||!1,this.flowLevel=L.isNothing(t.flowLevel)?-1:t.flowLevel,this.styleMap=ka(this.schema,t.styles||null),this.sortKeys=t.sortKeys||!1,this.lineWidth=t.lineWidth||80,this.noRefs=t.noRefs||!1,this.noCompatMode=t.noCompatMode||!1,this.condenseFlow=t.condenseFlow||!1,this.quotingType=t.quotingType==='"'?Ye:Ca,this.forceQuotes=t.forceQuotes||!1,this.replacer=typeof t.replacer=="function"?t.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Gr(t,n){for(var e=L.repeat(" ",n),r=0,i=-1,s="",a,o=t.length;r<o;)i=t.indexOf(`
`,r),i===-1?(a=t.slice(r),r=o):(a=t.slice(r,i+1),r=i+1),a.length&&a!==`
`&&(s+=e),s+=a;return s}function qt(t,n){return`
`+L.repeat(" ",t.indent*n)}function Aa(t,n){var e,r,i;for(e=0,r=t.implicitTypes.length;e<r;e+=1)if(i=t.implicitTypes[e],i.resolve(n))return!0;return!1}function $t(t){return t===la||t===aa}function Ge(t){return 32<=t&&t<=126||161<=t&&t<=55295&&t!==8232&&t!==8233||57344<=t&&t<=65533&&t!==Zt||65536<=t&&t<=1114111}function qr(t){return Ge(t)&&t!==Zt&&t!==oa&&t!==Be}function Kr(t,n,e){var r=qr(t),i=r&&!$t(t);return(e?r:r&&t!==_i&&t!==vi&&t!==yi&&t!==bi&&t!==$i)&&t!==Gt&&!(n===bt&&!i)||qr(n)&&!$t(n)&&t===Gt||n===bt&&i}function La(t){return Ge(t)&&t!==Zt&&!$t(t)&&t!==fa&&t!==va&&t!==bt&&t!==_i&&t!==vi&&t!==yi&&t!==bi&&t!==$i&&t!==Gt&&t!==ha&&t!==ma&&t!==da&&t!==$a&&t!==ga&&t!==_a&&t!==pa&&t!==ua&&t!==ca&&t!==ya&&t!==ba}function Ta(t){return!$t(t)&&t!==bt}function ze(t,n){var e=t.charCodeAt(n),r;return e>=55296&&e<=56319&&n+1<t.length&&(r=t.charCodeAt(n+1),r>=56320&&r<=57343)?(e-55296)*1024+r-56320+65536:e}function xi(t){var n=/^\n* /;return n.test(t)}var wi=1,Kt=2,ki=3,Ei=4,Se=5;function Fa(t,n,e,r,i,s,a,o){var l,h=0,m=null,p=!1,_=!1,v=r!==-1,k=-1,w=La(ze(t,0))&&Ta(ze(t,t.length-1));if(n||a)for(l=0;l<t.length;h>=65536?l+=2:l++){if(h=ze(t,l),!Ge(h))return Se;w=w&&Kr(h,m,o),m=h}else{for(l=0;l<t.length;h>=65536?l+=2:l++){if(h=ze(t,l),h===Be)p=!0,v&&(_=_||l-k-1>r&&t[k+1]!==" ",k=l);else if(!Ge(h))return Se;w=w&&Kr(h,m,o),m=h}_=_||v&&l-k-1>r&&t[k+1]!==" "}return!p&&!_?w&&!a&&!i(t)?wi:s===Ye?Se:Kt:e>9&&xi(t)?Se:a?s===Ye?Se:Kt:_?Ei:ki}function Pa(t,n,e,r,i){t.dump=(function(){if(n.length===0)return t.quotingType===Ye?'""':"''";if(!t.noCompatMode&&(xa.indexOf(n)!==-1||wa.test(n)))return t.quotingType===Ye?'"'+n+'"':"'"+n+"'";var s=t.indent*Math.max(1,e),a=t.lineWidth===-1?-1:Math.max(Math.min(t.lineWidth,40),t.lineWidth-s),o=r||t.flowLevel>-1&&e>=t.flowLevel;function l(h){return Aa(t,h)}switch(Fa(n,o,t.indent,a,l,t.quotingType,t.forceQuotes&&!r,i)){case wi:return n;case Kt:return"'"+n.replace(/'/g,"''")+"'";case ki:return"|"+Vr(n,t.indent)+Jr(Gr(n,s));case Ei:return">"+Vr(n,t.indent)+Jr(Gr(Na(n,a),s));case Se:return'"'+Ia(n)+'"';default:throw new D("impossible error: invalid scalar style")}})()}function Vr(t,n){var e=xi(t)?String(n):"",r=t[t.length-1]===`
`,i=r&&(t[t.length-2]===`
`||t===`
`),s=i?"+":r?"":"-";return e+s+`
`}function Jr(t){return t[t.length-1]===`
`?t.slice(0,-1):t}function Na(t,n){for(var e=/(\n+)([^\n]*)/g,r=(function(){var h=t.indexOf(`
`);return h=h!==-1?h:t.length,e.lastIndex=h,Qr(t.slice(0,h),n)})(),i=t[0]===`
`||t[0]===" ",s,a;a=e.exec(t);){var o=a[1],l=a[2];s=l[0]===" ",r+=o+(!i&&!s&&l!==""?`
`:"")+Qr(l,n),i=s}return r}function Qr(t,n){if(t===""||t[0]===" ")return t;for(var e=/ [^ ]/g,r,i=0,s,a=0,o=0,l="";r=e.exec(t);)o=r.index,o-i>n&&(s=a>i?a:o,l+=`
`+t.slice(i,s),i=s+1),a=o;return l+=`
`,t.length-i>n&&a>i?l+=t.slice(i,a)+`
`+t.slice(a+1):l+=t.slice(i),l.slice(1)}function Ia(t){for(var n="",e=0,r,i=0;i<t.length;e>=65536?i+=2:i++)e=ze(t,i),r=I[e],!r&&Ge(e)?(n+=t[i],e>=65536&&(n+=t[i+1])):n+=r||Ea(e);return n}function Oa(t,n,e){var r="",i=t.tag,s,a,o;for(s=0,a=e.length;s<a;s+=1)o=e[s],t.replacer&&(o=t.replacer.call(e,String(s),o)),(Q(t,n,o,!1,!1)||typeof o>"u"&&Q(t,n,null,!1,!1))&&(r!==""&&(r+=","+(t.condenseFlow?"":" ")),r+=t.dump);t.tag=i,t.dump="["+r+"]"}function Xr(t,n,e,r){var i="",s=t.tag,a,o,l;for(a=0,o=e.length;a<o;a+=1)l=e[a],t.replacer&&(l=t.replacer.call(e,String(a),l)),(Q(t,n+1,l,!0,!0,!1,!0)||typeof l>"u"&&Q(t,n+1,null,!0,!0,!1,!0))&&((!r||i!=="")&&(i+=qt(t,n)),t.dump&&Be===t.dump.charCodeAt(0)?i+="-":i+="- ",i+=t.dump);t.tag=s,t.dump=i||"[]"}function Da(t,n,e){var r="",i=t.tag,s=Object.keys(e),a,o,l,h,m;for(a=0,o=s.length;a<o;a+=1)m="",r!==""&&(m+=", "),t.condenseFlow&&(m+='"'),l=s[a],h=e[l],t.replacer&&(h=t.replacer.call(e,l,h)),Q(t,n,l,!1,!1)&&(t.dump.length>1024&&(m+="? "),m+=t.dump+(t.condenseFlow?'"':"")+":"+(t.condenseFlow?"":" "),Q(t,n,h,!1,!1)&&(m+=t.dump,r+=m));t.tag=i,t.dump="{"+r+"}"}function Ha(t,n,e,r){var i="",s=t.tag,a=Object.keys(e),o,l,h,m,p,_;if(t.sortKeys===!0)a.sort();else if(typeof t.sortKeys=="function")a.sort(t.sortKeys);else if(t.sortKeys)throw new D("sortKeys must be a boolean or a function");for(o=0,l=a.length;o<l;o+=1)_="",(!r||i!=="")&&(_+=qt(t,n)),h=a[o],m=e[h],t.replacer&&(m=t.replacer.call(e,h,m)),Q(t,n+1,h,!0,!0,!0)&&(p=t.tag!==null&&t.tag!=="?"||t.dump&&t.dump.length>1024,p&&(t.dump&&Be===t.dump.charCodeAt(0)?_+="?":_+="? "),_+=t.dump,p&&(_+=qt(t,n)),Q(t,n+1,m,!0,p)&&(t.dump&&Be===t.dump.charCodeAt(0)?_+=":":_+=": ",_+=t.dump,i+=_));t.tag=s,t.dump=i||"{}"}function Zr(t,n,e){var r,i,s,a,o,l;for(i=e?t.explicitTypes:t.implicitTypes,s=0,a=i.length;s<a;s+=1)if(o=i[s],(o.instanceOf||o.predicate)&&(!o.instanceOf||typeof n=="object"&&n instanceof o.instanceOf)&&(!o.predicate||o.predicate(n))){if(e?o.multi&&o.representName?t.tag=o.representName(n):t.tag=o.tag:t.tag="?",o.represent){if(l=t.styleMap[o.tag]||o.defaultStyle,fi.call(o.represent)==="[object Function]")r=o.represent(n,l);else if(gi.call(o.represent,l))r=o.represent[l](n,l);else throw new D("!<"+o.tag+'> tag resolver accepts not "'+l+'" style');t.dump=r}return!0}return!1}function Q(t,n,e,r,i,s,a){t.tag=null,t.dump=e,Zr(t,e,!1)||Zr(t,e,!0);var o=fi.call(t.dump),l=r,h;r&&(r=t.flowLevel<0||t.flowLevel>n);var m=o==="[object Object]"||o==="[object Array]",p,_;if(m&&(p=t.duplicates.indexOf(e),_=p!==-1),(t.tag!==null&&t.tag!=="?"||_||t.indent!==2&&n>0)&&(i=!1),_&&t.usedDuplicates[p])t.dump="*ref_"+p;else{if(m&&_&&!t.usedDuplicates[p]&&(t.usedDuplicates[p]=!0),o==="[object Object]")r&&Object.keys(t.dump).length!==0?(Ha(t,n,t.dump,i),_&&(t.dump="&ref_"+p+t.dump)):(Da(t,n,t.dump),_&&(t.dump="&ref_"+p+" "+t.dump));else if(o==="[object Array]")r&&t.dump.length!==0?(t.noArrayIndent&&!a&&n>0?Xr(t,n-1,t.dump,i):Xr(t,n,t.dump,i),_&&(t.dump="&ref_"+p+t.dump)):(Oa(t,n,t.dump),_&&(t.dump="&ref_"+p+" "+t.dump));else if(o==="[object String]")t.tag!=="?"&&Pa(t,t.dump,n,s,l);else{if(o==="[object Undefined]")return!1;if(t.skipInvalid)return!1;throw new D("unacceptable kind of an object to dump "+o)}t.tag!==null&&t.tag!=="?"&&(h=encodeURI(t.tag[0]==="!"?t.tag.slice(1):t.tag).replace(/!/g,"%21"),t.tag[0]==="!"?h="!"+h:h.slice(0,18)==="tag:yaml.org,2002:"?h="!!"+h.slice(18):h="!<"+h+">",t.dump=h+" "+t.dump)}return!0}function Ra(t,n){var e=[],r=[],i,s;for(Vt(t,e,r),i=0,s=r.length;i<s;i+=1)n.duplicates.push(e[r[i]]);n.usedDuplicates=new Array(s)}function Vt(t,n,e){var r,i,s;if(t!==null&&typeof t=="object")if(i=n.indexOf(t),i!==-1)e.indexOf(i)===-1&&e.push(i);else if(n.push(t),Array.isArray(t))for(i=0,s=t.length;i<s;i+=1)Vt(t[i],n,e);else for(r=Object.keys(t),i=0,s=r.length;i<s;i+=1)Vt(t[r[i]],n,e)}function Ma(t,n){n=n||{};var e=new Sa(n);e.noRefs||Ra(t,e);var r=t;return e.replacer&&(r=e.replacer.call({"":r},"",r)),Q(e,0,r,!0,!0)?e.dump+`
`:""}var ja=Ma,Ua={dump:ja};function er(t,n){return function(){throw new Error("Function yaml."+t+" is removed in js-yaml 4. Use yaml."+n+" instead, which is now safe by default.")}}var Ci=mi.load,dl=mi.loadAll,wt=Ua.dump;var ul=er("safeLoad","load"),cl=er("safeLoadAll","loadAll"),hl=er("safeDump","dump");var K=class extends y{constructor(){super(...arguments);this.value=null;this._mode="form";this._yamlText="";this._yamlError=null}willUpdate(e){super.willUpdate?.(e),e.has("value")&&this._mode==="form"&&(this._yamlText=wt(this.value??{}))}connectedCallback(){super.connectedCallback(),this._yamlText=wt(this.value??{});let e=this.value&&typeof this.value=="object"?this.value.script:null,r=this._fieldsFor(e);e&&(!r||Object.keys(r).length===0)&&(this._mode="yaml")}_setMode(e){e==="form"&&this._yamlError!==null||(e==="yaml"&&(this._yamlText=wt(this.value??{})),this._mode=e)}_onYamlInput(e){this._yamlText=e;let r;try{r=Ci(e)}catch(o){this._yamlError=o.message;return}if(r==null){this._yamlError=null,this._emit(null);return}if(typeof r!="object"||Array.isArray(r)){this._yamlError="Expected an object";return}let i=r,s=i.script;if(typeof s!="string"||!s.startsWith("script.")){this._yamlError="`script` must be a 'script.<name>' string";return}let a=i.args;if(a!==void 0&&(typeof a!="object"||Array.isArray(a)||a===null)){this._yamlError="`args` must be an object if present";return}this._yamlError=null,this._emit({script:s,args:a??{}})}_emit(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_scriptIds(){let e=this.hass?.services;return Object.keys(e?.script??{}).sort().map(i=>`script.${i}`)}_label(e){let i=this.hass?.states?.[e]?.attributes?.friendly_name;return typeof i=="string"&&i?i:e}_fieldsFor(e){if(!e)return;let r=e.replace(/^script\./,"");return this.hass?.services?.script?.[r]?.fields}_defaultArgs(e){let r=this._fieldsFor(e)??{},i={};for(let[s,a]of Object.entries(r))a&&Object.prototype.hasOwnProperty.call(a,"default")&&(i[s]=a.default);return i}_pickerSchema(){return[{name:"script",selector:{select:{mode:"dropdown",options:this._scriptIds().map(e=>({value:e,label:this._label(e)}))}}}]}_pickScript(e){if(!e){this._emit(null);return}this._emit({script:e,args:this._defaultArgs(e)})}_argsSchema(){let e=this._fieldsFor(this.value&&typeof this.value=="object"?this.value.script:null);return e?Object.entries(e).map(([r,i])=>({name:r,required:i.required,description:i.description?{suffix:i.description}:void 0,selector:i.selector??{text:{}}})):[]}_updateArgs(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:e})}render(){let e=this.value&&typeof this.value=="object"?this.value.script:null,r=this._argsSchema(),i=(this.value&&typeof this.value=="object"?this.value.args:{})??{},s=r.length>0;return d`
      <div class="section">
        <h4>${u(this.hass,"ui.script","Script")}</h4>
        ${this._renderPicker(e)}
      </div>
      ${e?d`
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
      ${e&&this._mode==="form"&&s?d`
        <div class="section args">
          <h4>${u(this.hass,"ui.arguments","Arguments")}</h4>
          ${this._renderArgs(r,i)}
        </div>
      `:""}
      ${e&&this._mode==="yaml"?this._renderYaml():""}
    `}_renderYaml(){let e=r=>{let i=r.target.value??r.detail?.value??"";this._onYamlInput(i)};return customElements.get("ha-code-editor")?d`
        <ha-code-editor mode="yaml" .value=${this._yamlText} @value-changed=${e}></ha-code-editor>
        ${this._yamlError?d`<div class="error">${this._yamlError}</div>`:""}
      `:d`
      <textarea
        rows="6"
        style="width:100%;font-family:monospace;"
        .value=${this._yamlText}
        @input=${e}
      ></textarea>
      ${this._yamlError?d`<div class="error">${this._yamlError}</div>`:""}
    `}_renderArgs(e,r){return customElements.get("ha-form")?d`<ha-form
        .hass=${this.hass}
        .schema=${e}
        .data=${r}
        @value-changed=${i=>{i.stopPropagation(),this._updateArgs(i.detail.value)}}
      ></ha-form>`:d`${e.map(i=>{let s=r[i.name];return d`
        <label style="display:block;margin-bottom:0.4rem;">
          <span style="display:inline-block;min-width:8em;">${i.name}</span>
          <input
            .value=${s==null?"":String(s)}
            @change=${a=>{let o=a.target.value,l={...r,[i.name]:o};this._updateArgs(l)}}
          />
        </label>
      `})}`}_renderPicker(e){return customElements.get("ha-form")?d`<ha-form
        .hass=${this.hass}
        .schema=${this._pickerSchema()}
        .data=${{script:e??""}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._pickScript(r.detail.value.script||null)}}
      ></ha-form>`:d`<select
      @change=${r=>this._pickScript(r.target.value||null)}>
      <option value="" ?selected=${!e}>(none)</option>
      ${this._scriptIds().map(r=>d`<option value=${r} ?selected=${r===e}>${this._label(r)}</option>`)}
    </select>`}};K.styles=$`
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
  `,c([f({attribute:!1})],K.prototype,"hass",2),c([f({attribute:!1})],K.prototype,"value",2),c([g()],K.prototype,"_mode",2),c([g()],K.prototype,"_yamlText",2),c([g()],K.prototype,"_yamlError",2),K=c([x("ambience-script-predicate-input")],K);var za=["dawn","sunrise","noon","sunset","dusk","midnight"],be=class extends y{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onKindChange(e){let r=e.target.value;r!==this.value.kind&&(r==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let r=e.target.value,[i,s]=r.split(":").map(a=>parseInt(a,10));Number.isNaN(i)||Number.isNaN(s)||this._emit({kind:"time",hh:i,mm:s})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let r=e.target.value;this._emit({kind:"sun",anchor:r,offset_min:this.value.offset_min})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let r=parseInt(e.target.value,10);Number.isNaN(r)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:r})}_renderTime(e){let r=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return d`<input type="time" .value=${r} @input=${this._onTimeChange} />`}_renderSun(e){let r=Wa(e.offset_min,this.hass);return d`
      <select @change=${this._onAnchorChange}>
        ${za.map(i=>d`<option value=${i} ?selected=${i===e.anchor}>${Ee(this.hass,i)}</option>`)}
      </select>
      <input
        type="number"
        step="1"
        placeholder=${u(this.hass,"ui.offset_placeholder","\xB1min, e.g. -30")}
        .value=${String(e.offset_min)}
        @input=${this._onOffsetChange}
      />
      <span class="offset-hint">${r}</span>
    `}render(){return d`
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
  `,c([f({attribute:!1})],be.prototype,"hass",2),c([f({attribute:!1})],be.prototype,"value",2),be=c([x("ambience-time-endpoint")],be);function Wa(t,n){if(t===0)return"";let e=Math.abs(t),r=t<0?"\u2212":"+";if(e%60===0){let i=e/60,s=i===1?u(n,"ui.unit_hour","hour"):u(n,"ui.unit_hours","hours");return`${r}${i} ${s}`}return`${r}${e} ${u(n,"ui.unit_min","min")}`}var qe={kind:"any"},Si={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},V=class extends y{constructor(){super(...arguments);this.value=null;this._entries=[qe];this._openIdx=0}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[qe]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(r=>{let i=this._entries[this._openIdx];if(!i)return;let s=i.kind==="any"?"__any__":i.kind==="range"?"__custom__":i.period;r.value!==s&&(r.value=s)})}_predicateToEntries(e){return e===null?[qe]:(Array.isArray(e)?e:[e]).map(i=>"period"in i?{kind:"period",period:i.period}:{kind:"range",from:i.from,to:i.to})}_emit(e){let r=e.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),i=r.length===0?null:r.length===1?r[0]:r;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:i},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let e=Object.keys(this.periods.builtins),r=Object.keys(this.periods.custom).filter(s=>!(s in this.periods.builtins)),i=new Set(this.periods.hidden);return[...e.filter(s=>!i.has(s)),...r]}_onSelectChange(e,r){let i=r.target.value,s=[...this._entries];i==="__any__"?s[e]=qe:i==="__custom__"?s[e]={kind:"range",...Si}:s[e]={kind:"period",period:i},this._entries=s,this._emit(s)}_onRangeChange(e,r,i){i.stopPropagation();let s=this._entries[e];if(!s||s.kind!=="range")return;let a=[...this._entries];a[e]={...s,[r]:i.detail.value},this._entries=a,this._emit(a)}_onRemove(e){let r=this._entries.filter((i,s)=>s!==e);this._entries=r.length===0?[qe]:r,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...Si}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,r){let i;return e.kind==="any"?i=u(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?i=ft({period:e.period},{hass:this.hass,periods:this.periods}):i=ft({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),d`
      <div class="summary-chip" @click=${()=>this._onChipClick(r)}>
        <span class="chip-label">${i}</span>
        ${this._entries.length>1?d`<button class="remove" @click=${s=>{s.stopPropagation(),this._onRemove(r)}} title=${u(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,r,i){let s=this._effectiveIds(),a=this.periods?.custom??{};return d`
      <div class="entry">
        <div class="entry-header">
          <select @change=${o=>this._onSelectChange(r,o)}>
            ${i?d`<option value="__any__">${u(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${u(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${s.map(o=>d`<option value=${o}>
                ${_e(this.hass,o,a)}${a[o]&&!this.periods?.builtins[o]?u(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?d`<button class="remove" @click=${()=>this._onRemove(r)} title=${u(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${e.kind==="range"?d`
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
    `}render(){let e=this._entries.some(i=>i.kind!=="any"),r=this._entries.length>1;return d`
      ${this._entries.map((i,s)=>r&&s!==this._openIdx?this._renderChip(i,s):this._renderEntry(i,s,s===0))}
      ${e?d`<button class="add-btn" @click=${this._onAdd}>${u(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};V.styles=$`
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
  `,c([f({attribute:!1})],V.prototype,"value",2),c([f({attribute:!1})],V.prototype,"periods",2),c([f({attribute:!1})],V.prototype,"hass",2),c([g()],V.prototype,"_entries",2),c([g()],V.prototype,"_openIdx",2),V=c([x("ambience-time-of-day-input")],V);function Ai(t){if(typeof t!="string")return!1;let n=t.split(",").map(e=>e.trim()).filter(e=>e!=="");if(n.length===0)return!1;for(let e of n)if(e.includes("-")){let r=e.split("-").map(a=>a.trim());if(r.length!==2||!/^\d+$/.test(r[0])||!/^\d+$/.test(r[1]))return!1;let i=Number(r[0]),s=Number(r[1]);if(!(i>=1&&i<=s&&s<=31))return!1}else{if(!/^\d+$/.test(e))return!1;let r=Number(e);if(!(r>=1&&r<=31))return!1}return!0}var tr=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Ba=new Set(["workday","holiday"]),Ya=new Set(["first_workday","last_workday"]),Ga=[31,29,31,30,31,30,31,31,30,31,30,31];function Ke(t){return Ga[t-1]??31}function rr(t){switch(t){case"weekday":return{kind:t,days:[]};case"day_of_month":return{kind:t,days:""};case"date":return{kind:t,month:1,day:1};case"date_range":return{kind:t,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:t}}}var ue=class extends y{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?u(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return u(this.hass,"ui.field_kind","Kind");case"days":return u(this.hass,"ui.field_days_of_month","Days of month");case"month":return u(this.hass,"ui.field_month","Month");case"day":return u(this.hass,"ui.field_day","Day");case"from_month":return u(this.hass,"ui.field_from_month","From month");case"from_day":return u(this.hass,"ui.field_from_day","From day");case"to_month":return u(this.hass,"ui.field_to_month","To month");case"to_day":return u(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let r=e.include.length===0&&e.exclude.length===0;this.value=r?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_addItem(e,r){let i=this._current();i[e]=[...i[e],rr(r)],this._emit(i)}_removeItem(e,r){let i=this._current();i[e]=i[e].filter((s,a)=>a!==r),this._emit(i)}_updateItem(e,r,i){let s=this._current();s[e]=s[e].map((a,o)=>o===r?i:a),this._emit(s)}_kindDisabled(e){return!!(Ba.has(e)&&!this.dayConfig.workday_sensor||Ya.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:tr.map(e=>({value:e,label:rt(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:Ce(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:Ke(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,r){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(r.days??"")}:e}_setDatePart(e,r,i){let s=Number(i);if(!Number.isFinite(s)||s<1)return e;if(e.kind==="date"){let{month:a,day:o}=e;return r==="month"&&(a=s),r==="day"&&(o=s),{kind:"date",month:a,day:Math.min(o,Ke(a))}}if(e.kind==="date_range"){let a={...e.from},o={...e.to};return r==="from_month"&&(a.month=s),r==="from_day"&&(a.day=s),r==="to_month"&&(o.month=s),r==="to_day"&&(o.day=s),a.day=Math.min(a.day,Ke(a.month)),o.day=Math.min(o.day,Ke(o.month)),{kind:"date_range",from:a,to:o}}return e}_onKindForm(e,r,i){let s=i.kind;if(!s){this._removeItem(e,r);return}if(this._kindDisabled(s))return;let a=this._current()[e][r];a&&a.kind===s||this._updateItem(e,r,rr(s))}_dayOfMonthError(e){return e.trim()===""||Ai(e)?null:u(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(e,r,i,s){this._updateItem(e,r,this._bodyPatch(i,s))}_renderWeekday(e,r,i){return d`${[0,1,2,3,4,5,6].map(s=>d`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${i.days.includes(s)}
          @change=${a=>{let l=a.target.checked?[...i.days,s].sort((h,m)=>h-m):i.days.filter(h=>h!==s);this._updateItem(e,r,{kind:"weekday",days:l})}}
        />${tt(this.hass,s)}
      </label>
    `)}`}_renderKindPicker(e,r,i){return customElements.get("ha-form")?d`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:i.kind}}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${s=>{s.stopPropagation(),this._onKindForm(e,r,s.detail.value)}}
      ></ha-form>`:d`
      <select
        class="kind"
        .value=${i.kind}
        @change=${s=>{let a=s.target.value;this._kindDisabled(a)||a===i.kind||this._updateItem(e,r,rr(a))}}
      >
        ${tr.map(s=>d`<option value=${s} ?disabled=${this._kindDisabled(s)}>${rt(this.hass,s)}</option>`)}
      </select>
    `}_renderItemBody(e,r,i){if(i.kind==="weekday")return this._renderWeekday(e,r,i);if(customElements.get("ha-form")){if(i.kind==="date")return this._renderDateRow(e,r,i,"month","day",i.month,i.day);if(i.kind==="date_range")return d`
          ${this._renderDateRow(e,r,i,"from_month","from_day",i.from.month,i.from.day)}
          ${this._renderDateRow(e,r,i,"to_month","to_day",i.to.month,i.to.day)}
        `;let s=this._bodySchema(i);if(!s)return d``;let a=i.kind==="day_of_month"?this._dayOfMonthError(i.days):null;return d`<ha-form
        .hass=${this.hass}
        .schema=${s}
        .data=${this._bodyData(i)}
        .error=${a?{days:a}:void 0}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${o=>{o.stopPropagation(),this._onBodyForm(e,r,i,o.detail.value)}}
      ></ha-form>`}return this._renderNativeBody(e,r,i)}_renderDateRow(e,r,i,s,a,o,l){let h=(m,p)=>{this._updateItem(e,r,this._setDatePart(i,m,p[m]))};return d`
      <div class="date-row">
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:s,required:!0,selector:this._monthSelector()}]}
          .data=${{[s]:String(o)}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${m=>{m.stopPropagation(),h(s,m.detail.value)}}
        ></ha-form>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:a,required:!0,selector:this._daySelector(o)}]}
          .data=${{[a]:l}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${m=>{m.stopPropagation(),h(a,m.detail.value)}}
        ></ha-form>
      </div>
    `}_renderNativeBody(e,r,i){if(i.kind==="day_of_month"){let o=this._dayOfMonthError(i.days);return d`<input
        type="text" placeholder=${u(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${i.days}
        @change=${l=>this._updateItem(e,r,this._bodyPatch(i,{days:l.target.value}))}
      />${o?d`<div class="field-error">${o}</div>`:""}`}let s=(o,l)=>d`
      <input type="number" min="1" max="12" .value=${String(l)}
        @change=${h=>this._updateItem(e,r,this._setDatePart(i,o,h.target.value))} />
    `,a=(o,l,h)=>d`
      <input type="number" min="1" max=${String(Ke(l))} .value=${String(h)}
        @change=${m=>this._updateItem(e,r,this._setDatePart(i,o,m.target.value))} />
    `;return i.kind==="date"?d`${s("month",i.month)} / ${a("day",i.month,i.day)}`:i.kind==="date_range"?d`
        <span>${u(this.hass,"ui.from","from")}</span>
        ${s("from_month",i.from.month)} / ${a("from_day",i.from.month,i.from.day)}
        <span>${u(this.hass,"ui.to","to")}</span>
        ${s("to_month",i.to.month)} / ${a("to_day",i.to.month,i.to.day)}
      `:d``}_renderAddPicker(e){let r=e==="include"?u(this.hass,"ui.add_include_item","+ Add include item"):u(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let i=()=>r;return d`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${i}
        @value-changed=${s=>{s.stopPropagation();let a=s.detail.value.kind;a&&!this._kindDisabled(a)&&this._addItem(e,a)}}
      ></ha-form>`}return d`
      <select
        .value=${""}
        @change=${i=>{let s=i.target.value;s&&(this._addItem(e,s),i.target.value="")}}
      >
        <option value="">${r}</option>
        ${tr.map(i=>d`<option value=${i} ?disabled=${this._kindDisabled(i)}>${rt(this.hass,i)}</option>`)}
      </select>
    `}_renderItem(e,r,i){return d`
      <div class="item">
        ${this._renderKindPicker(e,r,i)}
        <div class="body">${this._renderItemBody(e,r,i)}</div>
        <button class="remove" title=${u(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(e,r)}>✕</button>
      </div>
    `}_renderSection(e,r){return d`
      <div class="section">
        <h4>${e==="include"?u(this.hass,"ui.include","Include"):u(this.hass,"ui.exclude","Exclude")}</h4>
        ${r.length===0&&e==="include"?d`<div class="hint">${u(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${r.map((i,s)=>this._renderItem(e,s,i))}
        ${this._renderAddPicker(e)}
      </div>
    `}render(){let{include:e,exclude:r}=this._current();return d`
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
  `,c([f({attribute:!1})],ue.prototype,"hass",2),c([f({attribute:!1})],ue.prototype,"value",2),c([f({attribute:!1})],ue.prototype,"dayConfig",2),ue=c([x("ambience-day-predicate-input")],ue);var Li=["temperature","apparent_temperature","humidity","wind_speed","pressure"],Ti=["<","<=",">",">="],Fi={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},X=class extends y{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(e){let r=e.groups.length===0&&e.thresholds.length===0;this.value=r?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setGroups(e){this._emit({...this._current(),groups:e})}_addThreshold(){let e=this._current();e.thresholds=[...e.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(e)}_updateThreshold(e,r){let i=this._current();i.thresholds=i.thresholds.map((s,a)=>a===e?r:s),this._emit(i)}_removeThreshold(e){let r=this._current();r.thresholds=r.thresholds.filter((i,s)=>s!==e),this._emit(r)}_attributeSchema(e){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:Li.map(r=>({value:r,label:Ue(this.hass,r)}))}}}]}_opSchema(e){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:Ti.map(r=>({value:r,label:Fi[r]}))}}}]}_entityState(){let e=this.weatherEntity;return e?this.hass?.states?.[e]:void 0}_valueSchema(e,r){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:Rt(this.hass,r,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(e=>({value:e.id,label:e.label}))}}}]}_renderGroups(e){return customElements.get("ha-form")?d`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{groups:e}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setGroups(r.detail.value.groups??[])}}
      ></ha-form>`:d`${this.groups.map(r=>d`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${e.includes(r.id)}
          @change=${i=>{let s=i.target.checked;this._setGroups(s?[...e,r.id]:e.filter(a=>a!==r.id))}} />${r.label}
      </label>`)}`}_renderAttributeSelect(e,r){return customElements.get("ha-form")?d`<ha-form
        class="attr-form"
        .hass=${this.hass}
        .schema=${this._attributeSchema(e)}
        .data=${{attribute:r.attribute}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation();let s=i.detail.value.attribute;s&&this._updateThreshold(e,{...r,attribute:s})}}
      ></ha-form>`:d`<select
      @change=${i=>this._updateThreshold(e,{...r,attribute:i.target.value})}>
      ${Li.map(i=>d`<option value=${i} ?selected=${i===r.attribute}>${Ue(this.hass,i)}</option>`)}
    </select>`}_renderOpSelect(e,r){return customElements.get("ha-form")?d`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(e)}
        .data=${{op:r.op}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation();let s=i.detail.value.op;s&&this._updateThreshold(e,{...r,op:s})}}
      ></ha-form>`:d`<select
      @change=${i=>this._updateThreshold(e,{...r,op:i.target.value})}>
      ${Ti.map(i=>d`<option value=${i} ?selected=${i===r.op}>${Fi[i]}</option>`)}
    </select>`}_renderValueInput(e,r){if(customElements.get("ha-form"))return d`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(e,r.attribute)}
        .data=${{value:r.value}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let a=s.detail.value.value;typeof a=="number"&&Number.isFinite(a)&&this._updateThreshold(e,{...r,value:a})}}
      ></ha-form>`;let i=Rt(this.hass,r.attribute,this._entityState());return d`<span class="value-wrap">
      <input type="number" .value=${String(r.value)}
        @change=${s=>{let a=Number(s.target.value);Number.isFinite(a)&&this._updateThreshold(e,{...r,value:a})}} />
      <span class="unit">${i}</span>
    </span>`}_renderThreshold(e,r){return d`
      <div class="threshold">
        ${this._renderAttributeSelect(e,r)}
        ${this._renderOpSelect(e,r)}
        ${this._renderValueInput(e,r)}
        <button class="remove" title=${u(this.hass,"ui.remove","Remove")} @click=${()=>this._removeThreshold(e)}>✕</button>
      </div>
    `}render(){let{groups:e,thresholds:r}=this._current();return d`
      <div class="section">
        <h4>${u(this.hass,"ui.groups","Groups")}</h4>
        ${this._renderGroups(e)}
      </div>
      <div class="section">
        <h4>${u(this.hass,"ui.thresholds","Thresholds")}</h4>
        ${r.map((i,s)=>this._renderThreshold(s,i))}
        <button class="add" @click=${()=>this._addThreshold()}>${u(this.hass,"ui.add_threshold","+ Add threshold")}</button>
      </div>
    `}};X.styles=$`
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
  `,c([f({attribute:!1})],X.prototype,"hass",2),c([f({attribute:!1})],X.prototype,"value",2),c([f({attribute:!1})],X.prototype,"groups",2),c([f({attribute:!1})],X.prototype,"weatherEntity",2),X=c([x("ambience-weather-predicate-input")],X);var P=class extends y{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[]}async updated(e){if(e.has("value")){let i=e.get("value")?.entity_id,s=this.value.entity_id;if(s&&s!==i&&this.hass)try{let a=await Tr(this.hass,s);this._knownStates=a.states}catch{this._knownStates=[]}}}_normalize(e){let r={...e};return r.attribute===""&&(r.attribute=null),r.for&&r.for.h===0&&r.for.m===0&&r.for.s===0&&(r.for=null),r}_emit(e){let r=this._normalize(e);this.value=r,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r},bubbles:!0,composed:!0}))}_autoFlipOp(e){let r=this._isNumericTargetFor(e),i=this._isNumericOp(e.kind);return r&&!i?{...e,kind:">"}:!r&&i?{...e,kind:"is"}:e}_setEntity(e){this._emit(this._autoFlipOp({...this.value,entity_id:e,states:[],attribute:null}))}_setAttribute(e){this._emit(this._autoFlipOp({...this.value,attribute:e}))}_setOp(e){this._emit({...this.value,kind:e})}_setStates(e){this._emit({...this.value,states:e})}_setValueAt(e,r){if(this._isNumericOp(this.value.kind)){this._setStates([r]);return}let i=this.value.states.slice();r===""?i.splice(e,1):i[e]=r,this._setStates(i)}_addValue(e){e&&this._setStates([...this.value.states,e])}_removeValueAt(e){let r=this.value.states.slice();r.splice(e,1),this._setStates(r)}_setForDuration(e){this._emit({...this.value,for:e})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(e){if(!e)return[];let i=this.hass?.states?.[e]?.attributes;return i?Object.keys(i).sort():[]}_attributeSchema(){let e=this._knownAttributesFor(this.value.entity_id);return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:P._STATE_SENTINEL,label:P._STATE_SENTINEL},...e.map(r=>({value:r,label:r}))]}}}]}_attributeData(){let e=this.value.attribute;return e?{attribute:e}:{attribute:P._STATE_SENTINEL}}_setAttributeFromHaForm(e){e===P._STATE_SENTINEL?this._setAttribute(""):this._setAttribute(e)}_isNumericOp(e){return P._NUMERIC_OPS.includes(e)}_isNumericTargetFor(e){let i=this.hass?.states?.[e.entity_id];if(!i)return!1;if(e.attribute)return typeof i.attributes?.[e.attribute]=="number";let s=i.state;return typeof s!="string"||s===""||s==="unknown"||s==="unavailable"?!1:Number.isFinite(Number(s))}_opSchema(){let e=this._isNumericTargetFor(this.value)?[...P._NUMERIC_OPS]:["is","is_not"];return e.includes(this.value.kind)||e.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:e.map(r=>({value:r,label:B(this.hass,r)}))}}}]}_currentAttributeValue(){return this.value.attribute?this.hass?.states?.[this.value.entity_id]?.attributes?.[this.value.attribute]:void 0}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let e;if(this.value.attribute){let r=this._currentAttributeValue();e=r==null?[]:[String(r)]}else e=this._knownStates;return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:e.map(r=>({value:r,label:r}))}}}]}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let e=this.value.for??{h:0,m:0,s:0};return{duration:{hours:e.h,minutes:e.m,seconds:e.s}}}_setForFromHaForm(e){this._setForDuration({h:e?.hours??0,m:e?.minutes??0,s:e?.seconds??0})}_renderEntity(){return customElements.get("ha-form")?d`<ha-form
        data-field="entity"
        .hass=${this.hass}
        .schema=${this._entitySchema()}
        .data=${{entity_id:this.value.entity_id}}
        .computeLabel=${()=>""}
        @value-changed=${e=>{e.stopPropagation(),this._setEntity(e.detail.value.entity_id??"")}}
      ></ha-form>`:d`<input
      data-field="entity"
      type="text"
      .value=${this.value.entity_id}
      @change=${e=>this._setEntity(e.target.value)}
    />`}_renderAttribute(){let e=this.value.attribute??"";return customElements.get("ha-form")?d`<ha-form
        data-field="attribute"
        .hass=${this.hass}
        .schema=${this._attributeSchema()}
        .data=${this._attributeData()}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setAttributeFromHaForm(r.detail.value.attribute??"")}}
      ></ha-form>`:d`<input
      data-field="attribute"
      type="text"
      placeholder=${u(this.hass,"ui.state_attribute_placeholder","leave blank to compare state")}
      .value=${e}
      @change=${r=>this._setAttribute(r.target.value)}
    />`}_renderOp(){return customElements.get("ha-form")?d`<ha-form
        class="op-form"
        data-field="op"
        .hass=${this.hass}
        .schema=${this._opSchema()}
        .data=${{op:this.value.kind}}
        .computeLabel=${()=>""}
        @value-changed=${e=>{e.stopPropagation();let r=e.detail.value.op;r&&this._setOp(r)}}
      ></ha-form>`:d`<select
      data-field="op"
      @change=${e=>this._setOp(e.target.value)}>
      <option value="is" ?selected=${this.value.kind==="is"}>is</option>
      <option value="is_not" ?selected=${this.value.kind==="is_not"}>is not</option>
    </select>`}_renderValueRow(e,r){let i=r===-1,s=i?l=>this._addValue(l):l=>this._setValueAt(r,l),a=this._isNumericOp(this.value.kind),o=a?{value:e===""?void 0:Number(e)}:{value:e};return customElements.get("ha-form")?d`
        <div class="value-row" data-row=${r}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${o}
            .computeLabel=${()=>""}
            @value-changed=${l=>{l.stopPropagation();let h=l.detail.value.value;s(h==null?"":String(h))}}
          ></ha-form>
        </div>
      `:d`
      <div class="value-row" data-row=${r}>
        <input type=${a?"number":"text"} .value=${e}
          placeholder=${i?u(this.hass,"ui.state_add_value","+ Add state"):""}
          @change=${l=>s(l.target.value)} />
      </div>
    `}_renderForRow(){if(customElements.get("ha-form"))return d`<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${this._forSchema()}
        .data=${this._forData()}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setForFromHaForm(r.detail.value.duration)}}
      ></ha-form>`;let e=this.value.for??{h:0,m:0,s:0};return d`
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
    `}render(){return d`
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
          ${this._isNumericOp(this.value.kind)?this._renderValueRow(this.value.states[0]??"",0):d`
                ${this.value.states.map((e,r)=>this._renderValueRow(e,r))}
                ${this._renderValueRow("",-1)}
              `}
        </div>
      </section>
      <section class="field">
        <label class="field-label">${u(this.hass,"ui.state_for","For (optional)")}</label>
        ${this._renderForRow()}
      </section>
    `}};P.styles=$`
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
  `,P._STATE_SENTINEL="State",P._NUMERIC_OPS=[">",">=","<","<="],c([f({attribute:!1})],P.prototype,"hass",2),c([f({attribute:!1})],P.prototype,"value",2),c([g()],P.prototype,"_knownStates",2),P=c([x("ambience-state-expr-atom")],P);function ir(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,r)=>e===n[r])}var R=class extends y{constructor(){super(...arguments);this.path=[];this._dragOver=!1;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(e,r={}){this.dispatchEvent(new CustomEvent(e,{detail:{path:this.path,...r},bubbles:!0,composed:!0}))}_atomIsComplete(e){return!!e.entity_id&&e.states.some(r=>r!=="")}_isErrorTarget(){return ir(this.path,this.errorPath)}_onDragStart(e){if(this.path.length===0){e.preventDefault();return}let r=e.target;if(r&&r.closest("button, select, input, textarea, ha-form")){e.preventDefault();return}e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("application/x-ambience-path",JSON.stringify(this.path)))}_onDragOver(e){this.path.length!==0&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._dragOver=!0)}_onDragLeave(e){e.stopPropagation(),this._dragOver=!1}_onDrop(e){if(this.path.length===0||(e.preventDefault(),e.stopPropagation(),this._dragOver=!1,!e.dataTransfer))return;let r=e.dataTransfer.getData("application/x-ambience-path");if(!r)return;let i;try{i=JSON.parse(r)}catch{return}!Array.isArray(i)||i.every(s=>typeof s=="number")===!1||ir(i,this.path)||this.dispatchEvent(new CustomEvent("node-move",{detail:{from:i,to:this.path},bubbles:!0,composed:!0}))}_renderAtomCard(e,r){let i=this._atomIsComplete(e),s=ir(this.path,this.openPath),a=i?Ut(e,{hass:this.hass}):u(this.hass,"ui.state_new_condition","(new condition)");return d`
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
            @click=${o=>{o.stopPropagation(),this._emit("node-toggle-not")}}>${B(this.hass,"not")}</button>
          <span class="summary ${i?"":"placeholder"}">${a}</span>
          <button class="wrap"
            title=${u(this.hass,"ui.state_wrap","Wrap in group")}
            @click=${o=>{o.stopPropagation(),this._emit("node-wrap")}}>(…)</button>
          <button class="remove"
            title=${u(this.hass,"ui.remove","Remove")}
            @click=${o=>{o.stopPropagation(),this._emit("node-remove")}}>✕</button>
        </div>
        ${s?d`
          <div class="atom-body">
            <ambience-state-expr-atom
              .hass=${this.hass}
              .value=${e}
              @value-changed=${o=>{o.stopPropagation(),this._emit("node-change",{value:o.detail.value})}}
            ></ambience-state-expr-atom>
            ${this._isErrorTarget()&&this.errorMessage?d`<div class="atom-error">${this.errorMessage}</div>`:""}
          </div>
        `:""}
      </div>
    `}_renderChildRow(e,r){let i=[...this.path,r];return d`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${e}
        .path=${i}
        .openPath=${this.openPath}
        .errorPath=${this.errorPath}
        .errorMessage=${this.errorMessage}
      ></ambience-state-expr-node>
    `}_renderGroup(e){return d`
      <div class="group ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}>
        <div class="group-header"
          draggable=${this.path.length>0}
          @dragstart=${this._onDragStart}>
          <select class="group-op"
            @change=${r=>this._emit("node-set-op",{op:r.target.value})}>
            <option value="and" ?selected=${e.kind==="and"}>${B(this.hass,"and")}</option>
            <option value="or"  ?selected=${e.kind==="or"} >${B(this.hass,"or")}</option>
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
    `}render(){let e=this.value.kind==="not",r=e?this.value.item:this.value;return r.kind==="and"||r.kind==="or"?this._renderGroupWithExternalNot(r,e):this._renderAtomCard(r,e)}_renderGroupWithExternalNot(e,r){let i=this.path.length===0;return d`
      <div class="group-wrap">
        ${i?"":d`<button class="not-toggle external ${r?"on":""}"
          title=${u(this.hass,"ui.state_not_toggle","Negate (NOT)")}
          @click=${()=>this._emit("node-toggle-not")}>${B(this.hass,"not")}</button>`}
        ${this._renderGroup(e)}
      </div>
    `}};R.styles=$`
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
  `,c([f({attribute:!1})],R.prototype,"hass",2),c([f({attribute:!1})],R.prototype,"value",2),c([f({attribute:!1})],R.prototype,"path",2),c([g()],R.prototype,"_dragOver",2),c([f({attribute:!1})],R.prototype,"openPath",2),c([f({attribute:!1})],R.prototype,"errorPath",2),c([f({attribute:!1})],R.prototype,"errorMessage",2),R=c([x("ambience-state-expr-node")],R);function nr(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,r)=>e===n[r])}var Z=class extends y{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._onNodeMove=e=>{e.stopPropagation(),this._moveAt(e.detail.from,e.detail.to)};this._onNodeChange=e=>{e.stopPropagation(),this._replaceAt(e.detail.path,e.detail.value)};this._onNodeRemove=e=>{e.stopPropagation(),this._removeAt(e.detail.path)};this._onNodeWrap=e=>{e.stopPropagation(),this._wrapAt(e.detail.path)};this._onNodeAddChild=e=>{e.stopPropagation(),this._addChildAt(e.detail.path,"is")};this._onNodeToggleNot=e=>{e.stopPropagation(),this._toggleNotAt(e.detail.path)};this._onNodeSetOp=e=>{e.stopPropagation(),this._setGroupOpAt(e.detail.path,e.detail.op)};this._onNodeUnwrap=e=>{e.stopPropagation(),this._unwrapAt(e.detail.path)};this._onNodeOpen=e=>{if(e.stopPropagation(),this._openPath!==null){let r=this._atomAt(this._openPath);if(r&&this._atomError(r)!==null){this._showError=!0;return}}this._openPath!==null&&nr(this._openPath,e.detail.path)?this._openPath=null:this._openPath=e.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-move",this._onNodeMove)}_emit(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(e,r){let i=this._patch(this.value,e,()=>r);this._emit(i)}_removeAt(e){if(e.length===0){this._emit(null);return}let r=this._patch(this.value,e,()=>null);this._emit(r)}_wrapAt(e){let r=null;if(e.length>0){let a=this._nodeAt(e.slice(0,-1));a&&(a.kind==="and"||a.kind==="or")&&(r=a.kind)}let i=r==="and"?"or":"and",s=this._patch(this.value,e,a=>a&&{kind:i,items:[a]});this._emit(s)}_nodeAt(e){return this._walkNode(this.value,e)}_moveAt(e,r){if(this._isPrefix(e,r)||e.length===0||r.length===0)return;let i=this._nodeAt(e);if(!i)return;let s=this._rewriteForMove(this.value,[],e,r,i);this._emit(s)}_isPrefix(e,r){return e.length>r.length?!1:e.every((i,s)=>i===r[s])}_rewriteForMove(e,r,i,s,a){if(!e)return e;if(e.kind==="not"){let _=this._rewriteForMove(e.item,r,i,s,a);return _==null?null:{kind:"not",item:_}}if(e.kind!=="and"&&e.kind!=="or")return e;let o=i.slice(0,-1),l=s.slice(0,-1),h=nr(r,o),m=nr(r,l),p=[];if(e.items.forEach((_,v)=>{let k=[...r,v];if(h&&v===i[i.length-1])return;let w=this._rewriteForMove(_,k,i,s,a);w!==null&&p.push(w)}),m){let _=s[s.length-1];p.splice(_,0,a)}return p.length===0?null:{...e,items:p}}_walkNode(e,r){return e?e.kind==="not"?this._walkNode(e.item,r):r.length===0?e:e.kind==="and"||e.kind==="or"?this._walkNode(e.items[r[0]]??null,r.slice(1)):null:null}_addChildAt(e,r){let i=null,s=this._patch(this.value,e,a=>{if(a&&(a.kind==="and"||a.kind==="or")){let o=[...a.items,this._emptyAtom()];return i=[...e,o.length-1],{...a,items:o}}return a});i!==null&&(this._openPath=i),this._emit(s)}_toggleNotAt(e){let r=this._patch(this.value,e,i=>i&&(i.kind==="not"?i.item:{kind:"not",item:i}));this._emit(r)}_setGroupOpAt(e,r){let i=this._patch(this.value,e,s=>{if(!s)return s;let a=null;if(s.kind==="and"||s.kind==="or")a=s;else if(s.kind==="not"){let o=s.item;(o.kind==="and"||o.kind==="or")&&(a=o)}return a?{kind:r,items:a.items}:s});this._emit(i)}_patch(e,r,i){if(r.length===0)return i(e);if(e==null)return e;let[s,...a]=r;if(e.kind==="and"||e.kind==="or"){let o=e.items.length,l=e.items.slice(),h=this._patch(l[s],a,i);if(h===null?l.splice(s,1):l[s]=h,l.length<o){if(l.length===0)return null;if(l.length===1)return l[0]}return{...e,items:l}}if(e.kind==="not"){let o=this._patch(e.item,r,i);return o==null?null:{kind:"not",item:o}}return e}_atomAt(e){return this._walk(this.value,e)}_walk(e,r){return e?e.kind==="not"?this._walk(e.item,r):r.length===0?e.kind==="and"||e.kind==="or"?null:e:e.kind==="and"||e.kind==="or"?this._walk(e.items[r[0]]??null,r.slice(1)):null:null}_atomError(e){if(!e.entity_id)return u(this.hass,"ui.state_err_entity","Entity is required");if(e.kind!=="is"&&e.kind!=="is_not"){let i=e.states[0];if(!i)return u(this.hass,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(i)))return u(this.hass,"ui.state_err_numeric","Value must be a number")}else if(!e.states.some(i=>i!==""))return u(this.hass,"ui.state_err_state","State is required");return null}_unwrapAt(e){if(e.length===0){let a=this.value;if(!a)return;let o=a.kind==="not"?a.item:a;(o.kind==="and"||o.kind==="or")&&(o.items.length===1?this._emit(o.items[0]):this._emit(null));return}let r=e.slice(0,-1),i=e[e.length-1],s=this._patch(this.value,r,a=>{if(!a||a.kind!=="and"&&a.kind!=="or")return a;let o=a.items.slice(),l=o[i],h=null;if(l.kind==="and"||l.kind==="or")h=l;else if(l.kind==="not"){let m=l.item;(m.kind==="and"||m.kind==="or")&&(h=m)}return h?(o.splice(i,1,...h.items),{...a,items:o}):a});this._emit(s)}willUpdate(e){if(e.has("value")){let r=this.value;if(r&&this._openPath===null&&r.kind!=="and"&&r.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let i=this._atomAt(this._openPath);(!i||this._atomError(i)===null)&&(this._showError=!1)}}}_addAtRoot(){let e=this.value;if(e==null){this._addFirstAtom();return}if(e.kind==="and"||e.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[e,this._emptyAtom()]})}_setOpen(e){this._openPath=e}render(){if(this.value==null)return d`
        <div class="empty">
          <button @click=${()=>this._addFirstAtom()}>
            + ${u(this.hass,"ui.state_add_first","Add condition")}
          </button>
        </div>
      `;let e=this._showError&&this._openPath!==null?(()=>{let s=this._atomAt(this._openPath);return s?this._atomError(s):null})():null,r=this.value.kind==="not"?this.value.item:this.value,i=r.kind!=="and"&&r.kind!=="or";return d`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${this.value}
        .path=${[]}
        .openPath=${this._openPath}
        .errorPath=${e?this._openPath:null}
        .errorMessage=${e}
      ></ambience-state-expr-node>
      ${i?d`
        <button class="root-add" @click=${()=>this._addAtRoot()}>
          + ${u(this.hass,"ui.state_add_condition","Add condition")}
        </button>
      `:""}
    `}};Z.styles=$`
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
  `,c([f({attribute:!1})],Z.prototype,"hass",2),c([f({attribute:!1})],Z.prototype,"value",2),c([g()],Z.prototype,"_openPath",2),c([g()],Z.prototype,"_showError",2),Z=c([x("ambience-state-predicate-input")],Z);var M=class extends y{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onText(e){let r=e.target.value;this._emit(r.trim()===""?null:r)}render(){return this.matcher.input==="time_of_day"?d`
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
      `:this.matcher.input==="script_predicate"?d`
        <ambience-script-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-script-predicate-input>
      `:this.matcher.input==="day_predicate"?d`
        <ambience-day-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .dayConfig=${this.dayConfig??{workday_sensor:null,workday_calendar:null}}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-day-predicate-input>
      `:this.matcher.input==="weather_predicate"?d`
        <ambience-weather-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .groups=${this.weatherConfig?.groups??[]}
          .weatherEntity=${this.weatherConfig?.entity??void 0}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-weather-predicate-input>
      `:this.matcher.input==="state_predicate"?d`
        <ambience-state-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-state-predicate-input>
      `:d`
      <input
        type="text"
        placeholder=${u(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};M.styles=$`
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
  `,c([f({attribute:!1})],M.prototype,"matcher",2),c([f({attribute:!1})],M.prototype,"value",2),c([f({attribute:!1})],M.prototype,"sceneSuggestions",2),c([f({attribute:!1})],M.prototype,"periods",2),c([f({attribute:!1})],M.prototype,"dayConfig",2),c([f({attribute:!1})],M.prototype,"weatherConfig",2),c([f({attribute:!1})],M.prototype,"hass",2),M=c([x("ambience-matcher-input")],M);var ee=class extends y{constructor(){super(...arguments);this.entities=[];this.value=[];this.label=" "}connectedCallback(){super.connectedCallback(),Y(this,this.hass)}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let e=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this.entities}}}],r=this.label;return d`
      <ha-form
        .hass=${this.hass}
        .schema=${e}
        .data=${{entity_ids:this.value}}
        .computeLabel=${()=>r}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,r){let i=new Set(this.value);r?i.add(e):i.delete(e),this._emit(this.entities.filter(s=>i.has(s)))}_renderFallback(){return this.entities.length===0?d`<p class="empty">${u(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:d`
      <div class="checkboxes">
        ${this.entities.map(e=>d`
            <label>
              <input
                type="checkbox"
                .checked=${this.value.includes(e)}
                @change=${r=>this._toggle(e,r.target.checked)}
              />
              ${e}
            </label>
          `)}
      </div>
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};ee.styles=$`
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
  `,c([f({attribute:!1})],ee.prototype,"hass",2),c([f({attribute:!1})],ee.prototype,"entities",2),c([f({attribute:!1})],ee.prototype,"value",2),c([f()],ee.prototype,"label",2),ee=c([x("ambience-target-picker")],ee);var j=class extends y{constructor(){super(...arguments);this.entityIds=[];this.params={};this._mode="ui";this._yamlError=null;this._onScriptPicked=e=>{e.stopPropagation();let i=e.target.value;i&&this._emit("script-changed",{script:i})};this._onScriptPickedHaForm=e=>{e.stopPropagation();let r=e.detail.value?.script??"";r&&this._emit("script-changed",{script:r})};this._onTargetChanged=e=>{e.stopPropagation(),this._emit("entity-ids-changed",{entityIds:e.detail.value})};this._onFieldInput=e=>r=>{r.stopPropagation();let i=r.target,s={...this.params,[e]:i.value};this._emit("params-changed",{params:s})};this._onFieldsHaFormChanged=e=>{e.stopPropagation(),this._emit("params-changed",{params:{...this.params,...e.detail.value}})};this._onYamlInput=e=>{e.stopPropagation();let i=e.target.value,s;try{s=JSON.parse(i)}catch(m){this._yamlError=m instanceof Error?m.message:String(m);return}if(s===null||typeof s!="object"||Array.isArray(s)){this._yamlError=u(this.hass,"ui.yaml_must_be_object","Top-level value must be a mapping.");return}this._yamlError=null;let a=s,{entity_id:o,...l}=a,h=Array.isArray(o)?o.filter(m=>typeof m=="string"):typeof o=="string"?[o]:[];this._emit("entity-ids-changed",{entityIds:h}),this._emit("params-changed",{params:l})};this._onHaYamlChanged=e=>{if(e.stopPropagation(),e.detail.isValid===!1){this._yamlError=u(this.hass,"ui.invalid_yaml","Invalid YAML.");return}let r=e.detail.value;if(r===null||typeof r!="object"||Array.isArray(r)){this._yamlError=u(this.hass,"ui.yaml_must_be_object","Top-level value must be a mapping.");return}this._yamlError=null;let i=r,{entity_id:s,...a}=i,o=Array.isArray(s)?s.filter(l=>typeof l=="string"):typeof s=="string"?[s]:[];this._emit("entity-ids-changed",{entityIds:o}),this._emit("params-changed",{params:a})}}connectedCallback(){super.connectedCallback(),Y(this,this.hass)}_scriptMeta(){if(!this.script)return;let e=this.script.includes(".")?this.script.split(".").slice(1).join("."):this.script;return this.hass?.services?.script?.[e]}_emit(e,r){this.dispatchEvent(new CustomEvent(e,{detail:r,bubbles:!0,composed:!0}))}_renderScriptPicker(){let e=u(this.hass,"ui.script_entity","Script");if(customElements.get("ha-form")){let i=[{name:"script",selector:{entity:{filter:{domain:"script"}}}}];return d`
        <div class="script-picker">
          <ha-form
            .hass=${this.hass}
            .schema=${i}
            .data=${{script:this.script??""}}
            .computeLabel=${()=>e}
            @value-changed=${this._onScriptPickedHaForm}
          ></ha-form>
        </div>
      `}let r=this._scriptCandidates();return r.length===0?d`
        <div class="script-picker">
          <label>${e}</label>
          <input
            type="text"
            placeholder="script.foo"
            .value=${this.script??""}
            @change=${this._onScriptPicked}
          />
        </div>
      `:d`
      <div class="script-picker">
        <label>${e}</label>
        <select @change=${this._onScriptPicked}>
          <option value="">${u(this.hass,"ui.pick_script","\u2014 select a script \u2014")}</option>
          ${r.map(i=>d`
            <option value=${i} ?selected=${i===this.script}>${i}</option>
          `)}
        </select>
      </div>
    `}_scriptCandidates(){let e=this.hass?.services?.script;if(e)return Object.keys(e).map(i=>`script.${i}`).sort();let r=this.hass?.entities;return r?Object.keys(r).filter(i=>i.startsWith("script.")).sort():[]}_setMode(e){this._mode=e,this._yamlError=null}_renderModeToggle(){return d`
      <div class="mode-toggle">
        <button
          class=${this._mode==="ui"?"active":""}
          @click=${()=>this._setMode("ui")}
        >UI</button>
        <button
          class=${this._mode==="yaml"?"active":""}
          @click=${()=>this._setMode("yaml")}
        >YAML</button>
      </div>
    `}_targetEntities(e){let r=e.target?.entity?.domain,i;if(Array.isArray(r))i=r;else if(typeof r=="string")i=[r];else{let s=this.hass?.entities,a=new Set;for(let o of Object.keys(s??{})){let l=o.split(".")[0];l&&a.add(l)}i=[...a]}return this.scope?gt(this.hass,this.scope,i):[]}_renderTargetPicker(e){if(!e.target||Object.keys(e.target).length===0)return"";let r=this._targetEntities(e),i=u(this.hass,"ui.target","Target");return d`
      <div class="target-picker">
        <ambience-target-picker
          .hass=${this.hass}
          .entities=${r}
          .value=${this.entityIds}
          .label=${i}
          @value-changed=${this._onTargetChanged}
        ></ambience-target-picker>
      </div>
    `}_fieldLabel(e,r){if(r.name)return r.name;let i=e.replaceAll("_"," ").toLowerCase();return i.charAt(0).toUpperCase()+i.slice(1)}_renderFieldsForm(e){let r=e.fields;if(!r||Object.keys(r).length===0)return"";if(customElements.get("ha-form")){let i=Object.entries(r).map(([a,o])=>({name:a,required:!!o.required,default:o.default,description:{suggested_value:o.default},selector:o.selector??{text:{}}})),s={};for(let[a,o]of Object.entries(r))s[a]=this.params[a]??o.default??"";return d`
        <div class="fields-form">
          <ha-form
            .hass=${this.hass}
            .schema=${i}
            .data=${s}
            @value-changed=${this._onFieldsHaFormChanged}
          ></ha-form>
        </div>
      `}return d`
      <div class="fields-form">
        ${Object.entries(r).map(([i,s])=>d`
          <div class="field-row">
            <label>${this._fieldLabel(i,s)}${s.required?" *":""}</label>
            <input
              type="text"
              placeholder=${s.description??""}
              .value=${String(this.params[i]??"")}
              @input=${this._onFieldInput(i)}
            />
          </div>
        `)}
      </div>
    `}_renderUiMode(){if(!this.script)return"";let e=this._scriptMeta();if(!e)return d`
        <div class="not-found">
          ${u(this.hass,"ui.script_not_found_prefix","Script")}
          <code>${this.script}</code>
          ${u(this.hass,"ui.script_not_found_suffix","not found. It may have been removed.")}
        </div>
        ${this._renderYamlEditor()}
      `;let r=this._renderTargetPicker(e),i=this._renderFieldsForm(e);return r===""&&i===""?d`<div class="no-params">${u(this.hass,"ui.script_no_parameters","This script has no parameters.")}</div>`:d`${r}${i}`}_combinedObject(){let e={...this.params};return this.entityIds.length>0&&(e.entity_id=this.entityIds),e}_serializeYaml(){return JSON.stringify(this._combinedObject(),null,2)}_renderYamlEditor(){return customElements.get("ha-yaml-editor")?d`
        <ha-yaml-editor
          .hass=${this.hass}
          .defaultValue=${this._combinedObject()}
          @value-changed=${this._onHaYamlChanged}
        ></ha-yaml-editor>
        ${this._yamlError?d`<div class="yaml-error">${this._yamlError}</div>`:""}
      `:d`
      <textarea
        spellcheck="false"
        .value=${this._serializeYaml()}
        @input=${this._onYamlInput}
      ></textarea>
      ${this._yamlError?d`<div class="yaml-error">${this._yamlError}</div>`:""}
    `}render(){return d`
      ${this._renderScriptPicker()}
      ${this._renderModeToggle()}
      ${this._mode==="ui"?this._renderUiMode():this._renderYamlEditor()}
    `}};j.styles=$`
    :host { display: block; }
    .script-picker {
      margin-bottom: 0.5rem;
    }
    label {
      display: block; font-weight: 600; margin: 0.5rem 0 0.25rem 0;
    }
    .mode-toggle {
      display: inline-flex;
      gap: 0;
      margin: 0.5rem 0;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      overflow: hidden;
    }
    .mode-toggle button {
      padding: 0.3rem 0.75rem;
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font: inherit;
    }
    .mode-toggle button.active {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .target-picker, .fields-form {
      margin-top: 0.5rem;
    }
    .not-found {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      padding: 0.3rem 0;
    }
    .yaml-error {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      padding: 0.3rem 0;
    }
    .no-params {
      color: var(--secondary-text-color, #888);
      font-style: italic;
      padding: 0.5rem 0;
    }
    input, select, textarea {
      width: 100%; box-sizing: border-box; padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
      font: inherit;
    }
    textarea {
      min-height: 8rem;
      font-family: monospace;
    }
    .field-row {
      margin-bottom: 0.5rem;
    }
  `,c([f({attribute:!1})],j.prototype,"hass",2),c([f({attribute:!1})],j.prototype,"scope",2),c([f()],j.prototype,"script",2),c([f({attribute:!1})],j.prototype,"entityIds",2),c([f({attribute:!1})],j.prototype,"params",2),c([g()],j.prototype,"_mode",2),c([g()],j.prototype,"_yamlError",2),j=c([x("ambience-script-action-slot")],j);var S=class extends y{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._open=null;this._showError=!1;this._onNameInput=e=>{this._setName(e.target.value)};this._onAddMatcher=e=>{let r=e.target,i=r.value;r.value="",this._addMatcher(i)};this._onAddMatcherHaForm=e=>{e.stopPropagation();let r=e.detail.value.add;r!==S._ADD_MATCHER_PLACEHOLDER&&this._addMatcher(r)};this._onAddAction=e=>{let r=e.target,i=r.value;r.value="",this._addActionSlot(i)};this._onAddActionHaForm=e=>{e.stopPropagation();let r=e.detail.value.add;r!==S._ADD_ACTION_PLACEHOLDER&&this._addActionSlot(r)}}connectedCallback(){super.connectedCallback(),Y(this,this.hass)}willUpdate(e){e.has("open")&&this.open&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null,this._open=null,this._showError=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"}))return d`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
        </div>
      `;let i=pt(this._draft,u(this.hass,"ui.new_rule","New rule"));return d`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${i}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let r=xr();return r==="ha-input"?d`<ha-input label=${u(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:r==="ha-textfield"?d`<ha-textfield label=${u(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:d`<input type="text" .value=${e} @input=${this._onNameInput} />`}_isOpen(e){return this._open===null?!1:e.kind==="name"&&this._open.kind==="name"?!0:e.kind==="matcher"&&this._open.kind==="matcher"?e.id===this._open.id:e.kind==="action"&&this._open.kind==="action"?e.idx===this._open.idx:!1}_validationError(e){if(e===null||e.kind==="name"||e.kind==="matcher")return null;let r=this._draft?.actions[e.idx];if(!r)return null;let i=this.availableActions.find(s=>s.name===r.action);if(i?.kind==="script"||r.action==="script")return this._validateScriptAction(r);if(r.entity_ids.length===0)return u(this.hass,"ui.at_least_one_target","At least one target is required.");if(!i)return null;for(let s of i.target_params){if(!s.required)continue;let a=r.params[s.name];if(a==null||a==="")return u(this.hass,"ui.param_required","{param} is required.").replace("{param}",this._paramLabel(s.name))}return null}_validateScriptAction(e){let r=e.script;if(!r||!r.startsWith("script."))return u(this.hass,"ui.script_required","Please pick a script.");let i=r.split(".").slice(1).join("."),a=this.hass?.services?.script?.[i];if(!a?.fields)return null;for(let[o,l]of Object.entries(a.fields)){if(!l.required)continue;let h=e.params[o];if(h==null||h==="")return u(this.hass,"ui.param_required","{param} is required.").replace("{param}",this._paramLabel(o))}return null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){this._open=null,this._showError=!1;return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let r of e.composedPath())if(r instanceof Element&&(r.classList.contains("slot")||r.classList.contains("actions-bar")||r.classList.contains("add-matcher")||r.classList.contains("add-action")))return;this._tryCloseCurrent()}_setPredicate(e,r){if(!this._draft)return;let i={...this._draft.when};r==null?delete i[e]:i[e]=r,this._draft={...this._draft,when:i}}_renderMatcherRow(e){let r=this._draft.when[e.name]??null,i=this._isOpen({kind:"matcher",id:e.name}),s=e.input==="scene_combobox";if(i&&s)return d`
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
      `;let a=mt(e.name,r,{hass:this.hass,periods:this.periods});return d`
      <div class="slot ${i?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"matcher",id:e.name})}>
          <span class="summary-label"><strong>${ae(this.hass,e.name)}:</strong> ${a}</span>
          <button
            class="remove"
            @click=${o=>{o.stopPropagation(),this._removeMatcher(e.name)}}
            title=${u(this.hass,"ui.remove_condition","Remove condition")}
          >✕</button>
        </div>
        ${i?d`
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
    `}_visibleMatchers(){if(!this._draft)return[];let e=this._draft.when;return this.matchers.filter(r=>r.name in e&&e[r.name]!=null||this._open?.kind==="matcher"&&this._open.id===r.name)}_unusedMatchers(){let e=new Set(this._visibleMatchers().map(r=>r.name));return this.matchers.filter(r=>!e.has(r.name))}_addMatcher(e){e&&(this._open!==null&&!this._tryCloseCurrent()||(this._open={kind:"matcher",id:e},this._showError=!1))}_removeMatcher(e){if(!this._draft)return;let r={...this._draft.when};delete r[e],this._draft={...this._draft,when:r},this._open?.kind==="matcher"&&this._open.id===e&&(this._open=null,this._showError=!1)}_renderAddMatcher(){let e=this._unusedMatchers();return e.length===0?"":customElements.get("ha-form")?this._renderAddMatcherHaForm(e):d`
      <div class="add-matcher">
        <select class="add-matcher" @change=${this._onAddMatcher}>
          <option value="">${u(this.hass,"ui.add_condition","+ Add condition\u2026")}</option>
          ${e.map(r=>d`<option value=${r.name}>${ae(this.hass,r.name)}</option>`)}
        </select>
      </div>
    `}_renderAddMatcherHaForm(e){let r=u(this.hass,"ui.add_condition","+ Add condition\u2026"),i=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_MATCHER_PLACEHOLDER,label:r},...e.map(s=>({value:s.name,label:ae(this.hass,s.name)}))]}}}];return d`
      <div class="add-matcher">
        <ha-form
          .hass=${this.hass}
          .schema=${i}
          .data=${{add:S._ADD_MATCHER_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddMatcherHaForm}
        ></ha-form>
      </div>
    `}_addActionSlot(e){if(!this._draft||!e||this._open!==null&&!this._tryCloseCurrent())return;let r={action:e,entity_ids:[],params:{}},i=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,r]},this._open={kind:"action",idx:i},this._showError=!1}_renderAddAction(){return this.availableActions.length===0?"":customElements.get("ha-form")?this._renderAddActionHaForm():d`
      <div class="add-action">
        <select class="add-action" @change=${this._onAddAction}>
          <option value="">${u(this.hass,"ui.add_action","+ Add action\u2026")}</option>
          ${this.availableActions.map(e=>d`
            <option value=${e.name}>${oe(this.hass,e.name)}</option>
          `)}
        </select>
      </div>
    `}_renderAddActionHaForm(){let e=u(this.hass,"ui.add_action","+ Add action\u2026"),r=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_ACTION_PLACEHOLDER,label:e},...this.availableActions.map(i=>({value:i.name,label:oe(this.hass,i.name)}))]}}}];return d`
      <div class="add-action">
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{add:S._ADD_ACTION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddActionHaForm}
        ></ha-form>
      </div>
    `}_updateActionAt(e,r){if(!this._draft)return;let i=this._draft.actions.map((s,a)=>a===e?r(s):s);this._draft={...this._draft,actions:i}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((r,i)=>i!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,r){this._updateActionAt(e,i=>({...i,entity_ids:r}))}_paramLabel(e){let r=e.replaceAll("_"," ").toLowerCase();return r.charAt(0).toUpperCase()+r.slice(1)}_updateActionParam(e,r,i){this._updateActionAt(e,s=>{let a={...s.params},o=i;if(r.type==="int"?o=i===""?void 0:parseInt(i,10):r.type==="number"?o=i===""?void 0:parseFloat(i):r.type==="boolean"&&(o=i==="true"),typeof o=="number"&&Number.isFinite(o)){let l=o;typeof r.min=="number"&&l<r.min&&(l=r.min),typeof r.max=="number"&&l>r.max&&(l=r.max),o=l}return o===void 0?delete a[r.name]:a[r.name]=o,{...s,params:a}})}_renderActionParams(e,r,i){let s=i?.target_params??[];return d`
      ${s.map(a=>d`
        <div class="param-row">
          <label>${this._paramLabel(a.name)}${a.required?" *":""}</label>
          <div class="param-input">
            <input
              type=${a.type==="int"||a.type==="number"?"number":"text"}
              placeholder=${a.description??""}
              .value=${String(r.params[a.name]??"")}
              min=${a.min??""}
              max=${a.max??""}
              @input=${o=>this._updateActionParam(e,a,o.target.value)}
            />
            ${a.unit?d`<span class="param-unit">${a.unit}</span>`:""}
          </div>
        </div>
      `)}
    `}_renderActionRow(e,r){let i=this.availableActions.find(l=>l.name===e.action),s=this._isOpen({kind:"action",idx:r}),a=Rr(e,i,{hass:this.hass}),o=i?.kind==="script"||e.action==="script";return d`
      <div class="slot ${s?"expanded":"collapsed"}" data-slot-id="action-${r}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:r})}>
          <span class="summary-label">${a}</span>
          <button class="remove" @click=${l=>{l.stopPropagation(),this._deleteAction(r)}} title=${u(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${s?d`
          <div class="body">
            ${o?this._renderScriptBody(r,e):this._renderStandardBody(r,e,i)}

            ${this._showError&&this._validationError({kind:"action",idx:r})?d`
              <div class="error">${this._validationError({kind:"action",idx:r})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_renderStandardBody(e,r,i){let s=this.scope?gt(this.hass,this.scope,i?.domains??[]):[];return d`
      <label>${u(this.hass,"ui.target","Target")}</label>
      <ambience-target-picker
        .hass=${this.hass}
        .entities=${s}
        .value=${r.entity_ids}
        @value-changed=${a=>{a.stopPropagation(),this._setActionTargets(e,a.detail.value)}}
      ></ambience-target-picker>

      ${this._renderActionParams(e,r,i)}
    `}_renderScriptBody(e,r){return d`
      <ambience-script-action-slot
        .hass=${this.hass}
        .scope=${this.scope}
        .script=${r.script}
        .entityIds=${r.entity_ids}
        .params=${r.params}
        @script-changed=${i=>{i.stopPropagation(),this._setActionScript(e,i.detail.script)}}
        @entity-ids-changed=${i=>{i.stopPropagation(),this._setActionTargets(e,i.detail.entityIds)}}
        @params-changed=${i=>{i.stopPropagation(),this._setActionParams(e,i.detail.params)}}
      ></ambience-script-action-slot>
    `}_setActionScript(e,r){this._updateActionAt(e,i=>({...i,script:r,entity_ids:[],params:{}}))}_setActionParams(e,r){this._updateActionAt(e,i=>({...i,params:r}))}_save(){if(!this._draft)return;let e=Object.fromEntries(Object.entries(this._draft.when).filter(([,r])=>r!=null));this.dispatchEvent(new CustomEvent("save-rule",{detail:{...this._draft,when:e},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){if(!this._draft)return d``;let e=this._visibleMatchers();return d`
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
    `}};S.styles=$`
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
  `,S._ADD_MATCHER_PLACEHOLDER="__add_matcher__",S._ADD_ACTION_PLACEHOLDER="__add_action__",c([f({type:Boolean,reflect:!0})],S.prototype,"open",2),c([f({attribute:!1})],S.prototype,"rule",2),c([f({attribute:!1})],S.prototype,"matchers",2),c([f({attribute:!1})],S.prototype,"sceneSuggestions",2),c([f({attribute:!1})],S.prototype,"periods",2),c([f({attribute:!1})],S.prototype,"dayConfig",2),c([f({attribute:!1})],S.prototype,"weatherConfig",2),c([f({attribute:!1})],S.prototype,"availableActions",2),c([f({attribute:!1})],S.prototype,"hass",2),c([f({attribute:!1})],S.prototype,"scope",2),c([g()],S.prototype,"_draft",2),c([g()],S.prototype,"_open",2),c([g()],S.prototype,"_showError",2),S=c([x("ambience-rule-editor")],S);function Pi(t){return t.kind==="house"?"house":`${t.kind}:${t.id}`}function kt(t){return{rules:t.rules??[],auto_sort:t.auto_sort??!0}}var T=class extends y{constructor(){super(...arguments);this._areas=[];this._floors=[];this._areaConfigs=new Map;this._floorConfigs=new Map;this._house={rules:[],auto_sort:!0};this._matchers=[];this._actions=[];this._expanded=new Set;this._error="";this._editing=null}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await Promise.all([this._refreshAreas(),this._refreshFloors(),this._refreshHouse()]),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubArea?.(),this._unsubArea=void 0,this._unsubFloor?.(),this._unsubFloor=void 0}async _loadStatic(){try{let[e,r,i,s,a]=await Promise.all([dt(this.hass),Cr(this.hass),ut(this.hass),ct(this.hass),ht(this.hass)]);if(!this.isConnected)return;this._matchers=e,this._actions=r,this._periods=i,this._dayConfig=s,this._weatherConfig=a}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await nt(this.hass),r=this._areaConfigs,i=new Map;if(await Promise.all(e.map(async s=>{let a=r.get(s.area_id);if(a){i.set(s.area_id,a);return}i.set(s.area_id,kt(await st(this.hass,s.area_id)))})),!this.isConnected)return;this._areas=e,this._areaConfigs=i}catch(e){this._error=e.message||String(e)}}async _refreshFloors(){try{let e=(await at(this.hass)).slice().sort((s,a)=>s.name.localeCompare(a.name)),r=this._floorConfigs,i=new Map;if(await Promise.all(e.map(async s=>{let a=r.get(s.floor_id);if(a){i.set(s.floor_id,a);return}i.set(s.floor_id,kt(await ot(this.hass,s.floor_id)))})),!this.isConnected)return;this._floors=e,this._floorConfigs=i}catch(e){this._error=e.message||String(e)}}async _refreshHouse(){try{let e=kt(await lt(this.hass));if(!this.isConnected)return;this._house=e}catch(e){this._error=e.message||String(e)}}async _subscribe(){let e=this.hass.connection.subscribeEvents(a=>{if(a.data.action==="remove"){let o=a.data.area_id,l=new Set(this._expanded);l.delete(`area:${o}`),this._expanded=l,this._editing?.scope.kind==="area"&&this._editing.scope.id===o&&(this._editing=null)}this._refreshAreas()},"area_registry_updated"),r=this.hass.connection.subscribeEvents(a=>{if(a.data.action==="remove"){let o=a.data.floor_id,l=new Set(this._expanded);l.delete(`floor:${o}`),this._expanded=l,this._editing?.scope.kind==="floor"&&this._editing.scope.id===o&&(this._editing=null)}this._refreshFloors()},"floor_registry_updated"),[i,s]=await Promise.all([e,r]);this.isConnected?(this._unsubArea=i,this._unsubFloor=s):(i(),s())}_getConfig(e){return e.kind==="house"?this._house:e.kind==="area"?this._areaConfigs.get(e.id):this._floorConfigs.get(e.id)}_setConfig(e,r){if(e.kind==="house")this._house=r;else if(e.kind==="area"){let i=new Map(this._areaConfigs);i.set(e.id,r),this._areaConfigs=i}else{let i=new Map(this._floorConfigs);i.set(e.id,r),this._floorConfigs=i}}async _mutate(e,r){let i=this._getConfig(e);this._setConfig(e,r),this._error="";try{let s;e.kind==="house"?s=await Er(this.hass,r):e.kind==="area"?s=await wr(this.hass,e.id,r):s=await kr(this.hass,e.id,r),this._setConfig(e,kt(s.config))}catch(s){i&&this._setConfig(e,i),this._error=s.message||String(s)}}_toggleExpand(e){let r=Pi(e),i=new Set(this._expanded);i.has(r)?i.delete(r):i.add(r),this._expanded=i}_toggleAutoSort(e,r){let i=this._getConfig(e);i&&this._mutate(e,{...i,auto_sort:r})}_addRule(e){let r=this._getConfig(e);r&&(this._editing={scope:e,index:r.rules.length,isNew:!0})}_editRule(e,r){this._editing={scope:e,index:r.detail.index,isNew:!1}}_duplicateRule(e,r){let i=this._getConfig(e);if(!i)return;let s=i.rules[r.detail.index];if(!s)return;let a=JSON.parse(JSON.stringify(s)),o=[...i.rules];o.splice(r.detail.index+1,0,a),this._mutate(e,{...i,rules:o})}_deleteRule(e,r){let i=this._getConfig(e);if(!i)return;let s=i.rules.filter((a,o)=>o!==r.detail.index);this._mutate(e,{...i,rules:s})}_reorderRules(e,r){let i=this._getConfig(e);if(!i)return;let{from:s,to:a}=r.detail,o=[...i.rules],[l]=o.splice(s,1);o.splice(a,0,l),this._mutate(e,{...i,rules:o})}_saveRule(e){let r=this._editing;if(this._editing=null,!r)return;let i=this._getConfig(r.scope);if(!i)return;let s=[...i.rules];r.isNew?s.push(e.detail):s[r.index]=e.detail,this._mutate(r.scope,{...i,rules:s})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._getConfig(this._editing.scope)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let e=this._getConfig(this._editing.scope);if(!e)return[];let r=new Set;for(let i of e.rules){let s=i.when.scene;typeof s=="string"&&s&&r.add(s)}return[...r].sort((i,s)=>i.toLowerCase().localeCompare(s.toLowerCase()))}get _editorMatchers(){return this._editing?this._matchers.slice().sort((e,r)=>e.priority-r.priority):[]}_summary(e){let r=e.rules.length;if(r===0)return u(this.hass,"ui.not_configured","not configured");let i=r===1?u(this.hass,"ui.rule_singular","rule"):u(this.hass,"ui.rule_plural","rules");return`${r} ${i}`}render(){let e=u(this.hass,"ui.scope_floor_prefix","Floor: "),r=u(this.hass,"ui.scope_area_prefix","Area: ");return d`
      ${this._error?d`<p class="error">${this._error}</p>`:""}
      <ul>
        ${this._renderScopeRow({kind:"house"},u(this.hass,"ui.scope_global","Global"),this._house,"house")}
        ${this._floors.map(i=>{let s=this._floorConfigs.get(i.floor_id);return s?this._renderScopeRow({kind:"floor",id:i.floor_id},`${e}${i.name}`,s,"floor"):d``})}
        ${this._areas.length===0?d`<li>
              <p class="empty">
                ${u(this.hass,"ui.no_areas","No areas found in Home Assistant.")}
              </p>
            </li>`:this._areas.map(i=>{let s=this._areaConfigs.get(i.area_id);return s?this._renderScopeRow({kind:"area",id:i.area_id},`${r}${i.name}`,s,"area"):d``})}
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
    `}_renderScopeRow(e,r,i,s){let a=this._expanded.has(Pi(e)),o=e.kind==="house"?"":e.id;return d`
      <li
        class="scope-row ${s}"
        data-id=${o}
      >
        <div class="scope-header" @click=${()=>this._toggleExpand(e)}>
          <span class="chevron ${a?"open":""}">▶</span>
          <span class="scope-name">${r}</span>
          <span class="scope-summary">${this._summary(i)}</span>
        </div>
        ${a?d`
              <div class="scope-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!i.auto_sort}
                    @change=${l=>this._toggleAutoSort(e,!l.target.checked)}
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
                  @edit-rule=${l=>this._editRule(e,l)}
                  @duplicate-rule=${l=>this._duplicateRule(e,l)}
                  @delete-rule=${l=>this._deleteRule(e,l)}
                  @reorder-rules=${l=>this._reorderRules(e,l)}
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
  `,c([f({attribute:!1})],T.prototype,"hass",2),c([g()],T.prototype,"_areas",2),c([g()],T.prototype,"_floors",2),c([g()],T.prototype,"_areaConfigs",2),c([g()],T.prototype,"_floorConfigs",2),c([g()],T.prototype,"_house",2),c([g()],T.prototype,"_matchers",2),c([g()],T.prototype,"_actions",2),c([g()],T.prototype,"_periods",2),c([g()],T.prototype,"_dayConfig",2),c([g()],T.prototype,"_weatherConfig",2),c([g()],T.prototype,"_expanded",2),c([g()],T.prototype,"_error",2),c([g()],T.prototype,"_editing",2),T=c([x("ambience-scopes-view")],T);function qa(t){return t.kind==="house"?"house":`${t.kind}-${t.id}`}var te=class extends y{constructor(){super(...arguments);this._defaults={name:"Ambience",auto_on_delay_seconds:7200};this._rows=[];this._error=""}async connectedCallback(){super.connectedCallback();try{let[e,r,i,s]=await Promise.all([Fr(this.hass),nt(this.hass),at(this.hass),lt(this.hass)]);this._defaults=e;let a={kind:"house",id:null,name:u(this.hass,"ui.settings_ambience_house_row","Global"),scopePrefix:"Global",override:this._toOverride(s.switch),expanded:!1},o=i.slice().sort((w,C)=>w.name.localeCompare(C.name)),l=await Promise.all(o.map(w=>ot(this.hass,w.floor_id))),h=u(this.hass,"ui.settings_ambience_floor_prefix","Floor: "),m=o.map((w,C)=>({kind:"floor",id:w.floor_id,name:`${h}${w.name}`,scopePrefix:w.name,override:this._toOverride(l[C].switch),expanded:!1})),p=r.slice().sort((w,C)=>w.name.localeCompare(C.name)),_=await Promise.all(p.map(w=>st(this.hass,w.area_id))),v=u(this.hass,"ui.settings_ambience_area_prefix","Area: "),k=p.map((w,C)=>({kind:"area",id:w.area_id,name:`${v}${w.name}`,scopePrefix:w.name,override:this._toOverride(_[C].switch),expanded:!1}));this._rows=[a,...m,...k]}catch(e){this._error=e.message||String(e)}}_toOverride(e){return{name:e?.name??null,auto_on_delay_seconds:e?.auto_on_delay_seconds??null}}async _safeSave(e){try{await e(),this._error=""}catch(r){this._error=r.message||String(r)}}_onDefaultName(e){let r=e.target.value.trim();r&&(this._defaults={...this._defaults,name:r},this._safeSave(()=>Mt(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds)))}_onDefaultDelay(e){let r=e.target.value;r===""||!Number.isFinite(Number(r))||Number(r)<0||(this._defaults={...this._defaults,auto_on_delay_seconds:Math.floor(Number(r))},this._safeSave(()=>Mt(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds)))}_toggle(e){this._rows=this._rows.map((r,i)=>i===e?{...r,expanded:!r.expanded}:r)}_saveRow(e){let{name:r,auto_on_delay_seconds:i}=e.override;this._safeSave(()=>e.kind==="house"?Pr(this.hass,r,i):e.kind==="floor"?Nr(this.hass,e.id,r,i):Ir(this.hass,e.id,r,i))}_onOverrideName(e,r){let i=r.target.value.trim(),s=i===""?null:i;this._rows=this._rows.map((a,o)=>o===e?{...a,override:{...a.override,name:s}}:a),this._saveRow(this._rows[e])}_onOverrideDelay(e,r){let i=r.target.value;if(i!==""&&(!Number.isFinite(Number(i))||Number(i)<0))return;let s=i===""?null:Math.floor(Number(i));this._rows=this._rows.map((a,o)=>o===e?{...a,override:{...a.override,auto_on_delay_seconds:s}}:a),this._saveRow(this._rows[e])}_reset(e){this._rows=this._rows.map((r,i)=>i===e?{...r,override:{name:null,auto_on_delay_seconds:null}}:r),this._saveRow(this._rows[e])}_defaultDisplayName(e){return`${e.scopePrefix} ${this._defaults.name}`}render(){return d`
      ${this._error?d`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:""}

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
        ${this._rows.map((e,r)=>{let i=qa(e);return d`
            <div class="scope-row" data-test="scope-row">
              <div class="scope-header" data-test="expand" @click=${()=>this._toggle(r)}>
                <span class="chevron ${e.expanded?"open":""}">▶</span>
                <div class="scope-name">${e.name}</div>
              </div>
              ${e.expanded?d`
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
    `}};te.styles=$`
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
  `,c([f({attribute:!1})],te.prototype,"hass",2),c([g()],te.prototype,"_defaults",2),c([g()],te.prototype,"_rows",2),c([g()],te.prototype,"_error",2),te=c([x("ambience-ambience-settings")],te);var re=class extends y{constructor(){super(...arguments);this.matcherName="";this.matcherDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let e=ae(this.hass,this.matcherName);return d`
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
    `}};re.styles=$`
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
  `,c([f({attribute:!1})],re.prototype,"hass",2),c([f()],re.prototype,"matcherName",2),c([f()],re.prototype,"matcherDescription",2),c([g()],re.prototype,"_expanded",2),re=c([x("ambience-matcher-card")],re);function Fe(t){return t.scope_kind==="house"?"House":t.scope_kind==="floor"?`Floor: ${t.scope_id??""}`:t.scope_id??""}var Ka=/^[a-z][a-z0-9_]*$/;function Va(t){return t.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var U=class extends y{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._label=this.initial.label??"",this._def=this.initial}_onLabelInput(e){this._label=e.target.value}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_validate(e){if(!this.existingId){if(!this._label.trim())return u(this.hass,"ui.error_enter_name","Please enter a name.");if(!e)return u(this.hass,"ui.error_start_letter","Name must start with a letter.");if(!Ka.test(e))return u(this.hass,"ui.error_start_letter","Name must start with a letter.");if(this.takenIds.has(e))return u(this.hass,"ui.error_name_exists","A period with this name already exists. Choose a different name.")}return""}_onSave(){let e=this.existingId??Va(this._label),r=this._validate(e);if(r){this._error=r,this.performUpdate();return}let i={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:e,definition:i},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){let e=this.existingId?u(this.hass,"ui.period_modal_edit_title",'Edit "{name}"').replace("{name}",this.initial?.label??this.existingId):u(this.hass,"ui.period_modal_add_title","Add custom period");return d`
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
  `,c([f({attribute:!1})],U.prototype,"hass",2),c([f({attribute:!1})],U.prototype,"existingId",2),c([f({attribute:!1})],U.prototype,"initial",2),c([f({attribute:!1})],U.prototype,"takenIds",2),c([g()],U.prototype,"_label",2),c([g()],U.prototype,"_def",2),c([g()],U.prototype,"_error",2),U=c([x("ambience-period-edit-modal")],U);function Ni(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=Ee(n,t.anchor);if(t.offset_min===0)return e;let r=Math.abs(t.offset_min),i=r%60===0?`${r/60}${u(n,"ui.unit_hour_abbr","h")}`:`${r}${u(n,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${i}`}function Ii(t,n){return`${Ni(t.from,n)} \u2192 ${Ni(t.to,n)}`}var ie=class extends y{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await ut(this.hass)}async _saveState(e){let r=await Sr(this.hass,e,this._view.hidden);this._warnings=r.warnings,await this._reload()}_onEdit(e,r){this._modal={mode:"edit",id:e,initial:r}}async _onDelete(e){let r={...this._view.custom};delete r[e],await this._saveState(r)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:r,definition:i}=e.detail,s={...this._view.custom,[r]:i};this._modal={mode:"closed"},await this._saveState(s)}_onModalCancel(){this._modal={mode:"closed"}}_renderBuiltinRow(e,r,i){return d`
      <div class="row ${i?"overridden":""}">
        <span class="name">${_e(this.hass,e,{})}</span>
        <span class="def">${Ii(r,this.hass)}</span>
        <span class="badge">${u(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${i?"":d`<button class="icon" title=${u(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(e,r)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(e,r){return d`
      <div class="row custom">
        <span class="name">${_e(this.hass,e,this._view.custom)}</span>
        <span class="def">${Ii(r,this.hass)}</span>
        <span class="badge">${u(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${u(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e,r)}>✎</button>
          <button class="icon" title=${u(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e)}>✕</button>
        </span>
      </div>
    `}render(){let e=this._view.custom;return d`
      <header>
        <h2>${u(this.hass,"ui.periods_heading","Periods")}</h2>
      </header>
      ${this._warnings.length?d`<div class="warnings">
            <strong>${u(this.hass,"ui.period_warning_prefix","Warning:")}</strong> ${u(this.hass,"ui.period_warning_text","some rules now reference missing periods:")}
            <ul>
              ${this._warnings.map(r=>d`<li>${Fe(r)} / "${r.rule_name}" → ${r.missing_period}</li>`)}
            </ul>
          </div>`:""}
      ${Object.entries(this._view.builtins).map(([r,i])=>{let s=e[r];return d`
          ${this._renderBuiltinRow(r,i,s!=null)}
          ${s!=null?this._renderCustomRow(r,s):""}
        `})}
      ${Object.entries(e).filter(([r])=>!(r in this._view.builtins)).map(([r,i])=>this._renderCustomRow(r,i))}
      <button class="add" @click=${this._onAdd}>${u(this.hass,"ui.add_custom_period","+ Add custom period")}</button>
      ${this._modal.mode==="edit"?d`<ambience-period-edit-modal
            .hass=${this.hass}
            .existingId=${this._modal.id}
            .initial=${this._modal.initial}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:this._modal.mode==="add"?d`<ambience-period-edit-modal
            .hass=${this.hass}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:""}
    `}};ie.styles=$`
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
  `,c([f({attribute:!1})],ie.prototype,"hass",2),c([g()],ie.prototype,"_view",2),c([g()],ie.prototype,"_modal",2),c([g()],ie.prototype,"_warnings",2),ie=c([x("ambience-time-of-day-config")],ie);var ce=class extends y{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await ct(this.hass)}async _save(e){this._config=e;let r=await Ar(this.hass,e.workday_sensor,e.workday_calendar);this._warnings=r.warnings??[]}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=[{name:"workday_sensor",selector:{entity:{integration:"workday",domain:"binary_sensor"}}}],r=[{name:"workday_calendar",selector:{entity:{integration:"workday",domain:"calendar"}}}];return d`
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
      ${this._warnings.length?d`
        <div class="warnings">
          <strong>${u(this.hass,"ui.day_warning_prefix","Warning:")}</strong> ${u(this.hass,"ui.day_warning_text","rules now reference unconfigured entities:")}
          <ul>
            ${this._warnings.map(i=>d`<li>${Fe(i)} / "${i.rule_name}" → ${i.reason}</li>`)}
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
  `,c([f({attribute:!1})],ce.prototype,"hass",2),c([g()],ce.prototype,"_config",2),c([g()],ce.prototype,"_warnings",2),ce=c([x("ambience-day-config")],ce);var Ja=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],ne=class extends y{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._warnings=[];this._expanded=new Set}async connectedCallback(){super.connectedCallback(),this._config=await ht(this.hass)}async _persist(){let e=await Lr(this.hass,this._config.entity,this._config.groups);this._warnings=e.warnings??[]}_onEntityChange(e){this._config={...this._config,entity:e.detail.value||null},this._persist()}_nextGroupId(e){let r=new Set(e.map(i=>i.id));for(let i=1;i<=e.length+1;i++){let s=`group_${i}`;if(!r.has(s))return s}return`group_${e.length+1}`}_addGroup(){let e=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:e,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,e]),this._persist()}_toggleExpand(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):r.add(e),this._expanded=r}_updateGroup(e,r){this._config={...this._config,groups:this._config.groups.map((i,s)=>s===e?{...i,...r}:i)},this._persist()}_removeGroup(e){let r=this._config.groups[e];if(this._config={...this._config,groups:this._config.groups.filter((i,s)=>s!==e)},r){let i=new Set(this._expanded);i.delete(r.id),this._expanded=i}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:Ja.map(e=>({value:e,label:it(this.hass,e)}))}}}]}_renderConditions(e,r){if(customElements.get("ha-form"))return d`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:r.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation(),this._updateGroup(e,{conditions:s.detail.value.conditions??[]})}}
      ></ha-form>`;let i=r.conditions.map(s=>it(this.hass,s));return d`<span class="conditions-list">${i.join(", ")}</span>`}_renderGroup(e,r){let i=this._expanded.has(r.id),s=r.conditions.map(a=>it(this.hass,a)).join(", ");return d`
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
        ${i?d`<div class="body" @click=${a=>a.stopPropagation()}>
              <input
                .value=${r.label}
                aria-label=${r.label}
                @change=${a=>this._updateGroup(e,{label:a.target.value})}
              />
              ${this._renderConditions(e,r)}
            </div>`:""}
      </div>
    `}render(){let e=[{name:"entity",selector:{entity:{domain:"weather"}}}];return d`
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

      ${this._warnings.length?d`
        <div class="warnings">
          <strong>${u(this.hass,"ui.day_warning_prefix","Warning:")}</strong>
          ${u(this.hass,"ui.weather_warning_text","rules now reference an unconfigured weather entity:")}
          <ul>${this._warnings.map(r=>d`<li>${Fe(r)} / "${r.rule_name}" → ${r.reason}</li>`)}</ul>
        </div>
      `:""}
    `}};ne.styles=$`
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
  `,c([f({attribute:!1})],ne.prototype,"hass",2),c([g()],ne.prototype,"_config",2),c([g()],ne.prototype,"_warnings",2),c([g()],ne.prototype,"_expanded",2),ne=c([x("ambience-weather-config")],ne);var Qa=new Set(["time_of_day","day","weather"]),he=class extends y{constructor(){super(...arguments);this._matchers=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._matchers=await dt(this.hass)}catch(e){this._error=e.message||String(e)}}render(){let e=this._matchers.filter(r=>Qa.has(r.name)).slice().sort((r,i)=>r.priority-i.priority);return d`
      ${this._error?d`<p class="error">${this._error}</p>`:""}
      ${e.map(r=>d`
        <ambience-matcher-card .hass=${this.hass} .matcherName=${r.name} .matcherDescription=${r.description}>
          ${r.name==="time_of_day"?d`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`:r.name==="day"?d`<ambience-day-config .hass=${this.hass}></ambience-day-config>`:r.name==="weather"?d`<ambience-weather-config .hass=${this.hass}></ambience-weather-config>`:d``}
        </ambience-matcher-card>
      `)}
    `}};he.styles=$`
    :host { display: block; }
    .error { color: var(--error-color, #d32f2f); }
  `,c([f({attribute:!1})],he.prototype,"hass",2),c([g()],he.prototype,"_matchers",2),c([g()],he.prototype,"_error",2),he=c([x("ambience-matchers-settings")],he);var Pe=class extends y{render(){return d`<div class="placeholder">${u(this.hass,"ui.settings_ambience_actions_placeholder","No action settings yet")}</div>`}};Pe.styles=$`
    :host { display: block; }
    .placeholder {
      padding: 1.5rem;
      color: var(--secondary-text-color, #888);
      text-align: center;
      border: 1px dashed var(--divider-color, #e0e0e0);
      border-radius: 6px;
    }
  `,c([f({attribute:!1})],Pe.prototype,"hass",2),Pe=c([x("ambience-actions-settings")],Pe);var $e=class extends y{constructor(){super(...arguments);this._tab="ambience"}render(){return d`
      <nav>
        <button class=${this._tab==="ambience"?"active":""} @click=${()=>{this._tab="ambience"}}>${u(this.hass,"ui.settings_tab_ambience","Ambience")}</button>
        <button class=${this._tab==="matchers"?"active":""} @click=${()=>{this._tab="matchers"}}>${u(this.hass,"ui.settings_tab_matchers","Matchers")}</button>
        <button class=${this._tab==="actions"?"active":""} @click=${()=>{this._tab="actions"}}>${u(this.hass,"ui.settings_tab_actions","Actions")}</button>
      </nav>
      ${this._tab==="ambience"?d`<ambience-ambience-settings .hass=${this.hass}></ambience-ambience-settings>`:this._tab==="matchers"?d`<ambience-matchers-settings .hass=${this.hass}></ambience-matchers-settings>`:d`<ambience-actions-settings .hass=${this.hass}></ambience-actions-settings>`}
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
  `,c([f({attribute:!1})],$e.prototype,"hass",2),c([g()],$e.prototype,"_tab",2),$e=c([x("ambience-settings-view")],$e);var xe=class extends y{constructor(){super(...arguments);this._view="areas"}connectedCallback(){super.connectedCallback(),Y(this)}render(){return d`
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
      ${this._view==="areas"?d`<ambience-scopes-view .hass=${this.hass}></ambience-scopes-view>`:d`<ambience-settings-view .hass=${this.hass}></ambience-settings-view>`}
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
  `,c([f({attribute:!1})],xe.prototype,"hass",2),c([g()],xe.prototype,"_view",2),xe=c([x("ambience-panel")],xe);export{xe as AmbiencePanel};
