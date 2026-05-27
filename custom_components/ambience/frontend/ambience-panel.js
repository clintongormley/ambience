/* Ambience panel — bundled output. Do not edit by hand. */
var vi=Object.defineProperty;var yi=Object.getOwnPropertyDescriptor;var c=(e,i,t,r)=>{for(var n=r>1?void 0:r?yi(i,t):i,s=e.length-1,a;s>=0;s--)(a=e[s])&&(n=(r?a(i,t,n):a(n))||n);return r&&n&&vi(i,t,n),n};var We=globalThis,Be=We.ShadowRoot&&(We.ShadyCSS===void 0||We.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ht=Symbol(),Gt=new WeakMap,Ce=class{constructor(i,t,r){if(this._$cssResult$=!0,r!==ht)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=t}get styleSheet(){let i=this.o,t=this.t;if(Be&&i===void 0){let r=t!==void 0&&t.length===1;r&&(i=Gt.get(t)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),r&&Gt.set(t,i))}return i}toString(){return this.cssText}},Yt=e=>new Ce(typeof e=="string"?e:e+"",void 0,ht),$=(e,...i)=>{let t=e.length===1?e[0]:i.reduce((r,n,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+e[s+1],e[0]);return new Ce(t,e,ht)},qt=(e,i)=>{if(Be)e.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of i){let r=document.createElement("style"),n=We.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=t.cssText,e.appendChild(r)}},pt=Be?e=>e:e=>e instanceof CSSStyleSheet?(i=>{let t="";for(let r of i.cssRules)t+=r.cssText;return Yt(t)})(e):e;var{is:bi,defineProperty:$i,getOwnPropertyDescriptor:xi,getOwnPropertyNames:wi,getOwnPropertySymbols:ki,getPrototypeOf:Ei}=Object,Ge=globalThis,Kt=Ge.trustedTypes,Si=Kt?Kt.emptyScript:"",Ci=Ge.reactiveElementPolyfillSupport,Ae=(e,i)=>e,Te={toAttribute(e,i){switch(i){case Boolean:e=e?Si:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,i){let t=e;switch(i){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},Ye=(e,i)=>!bi(e,i),Vt={attribute:!0,type:String,converter:Te,reflect:!1,useDefault:!1,hasChanged:Ye};Symbol.metadata??=Symbol("metadata"),Ge.litPropertyMetadata??=new WeakMap;var K=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,t=Vt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(i,t),!t.noAccessor){let r=Symbol(),n=this.getPropertyDescriptor(i,r,t);n!==void 0&&$i(this.prototype,i,n)}}static getPropertyDescriptor(i,t,r){let{get:n,set:s}=xi(this.prototype,i)??{get(){return this[t]},set(a){this[t]=a}};return{get:n,set(a){let o=n?.call(this);s?.call(this,a),this.requestUpdate(i,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??Vt}static _$Ei(){if(this.hasOwnProperty(Ae("elementProperties")))return;let i=Ei(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(Ae("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ae("properties"))){let t=this.properties,r=[...wi(t),...ki(t)];for(let n of r)this.createProperty(n,t[n])}let i=this[Symbol.metadata];if(i!==null){let t=litPropertyMetadata.get(i);if(t!==void 0)for(let[r,n]of t)this.elementProperties.set(r,n)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let n=this._$Eu(t,r);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let t=[];if(Array.isArray(i)){let r=new Set(i.flat(1/0).reverse());for(let n of r)t.unshift(pt(n))}else i!==void 0&&t.push(pt(i));return t}static _$Eu(i,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(i.set(r,this[r]),delete this[r]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return qt(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,t,r){this._$AK(i,r)}_$ET(i,t){let r=this.constructor.elementProperties.get(i),n=this.constructor._$Eu(i,r);if(n!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:Te).toAttribute(t,r.type);this._$Em=i,s==null?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(i,t){let r=this.constructor,n=r._$Eh.get(i);if(n!==void 0&&this._$Em!==n){let s=r.getPropertyOptions(n),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Te;this._$Em=n;let o=a.fromAttribute(t,s.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(i,t,r,n=!1,s){if(i!==void 0){let a=this.constructor;if(n===!1&&(s=this[i]),r??=a.getPropertyOptions(i),!((r.hasChanged??Ye)(s,t)||r.useDefault&&r.reflect&&s===this._$Ej?.get(i)&&!this.hasAttribute(a._$Eu(i,r))))return;this.C(i,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,t,{useDefault:r,reflect:n,wrapped:s},a){r&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,a??t??this[i]),s!==!0||a!==void 0)||(this._$AL.has(i)||(this.hasUpdated||r||(t=void 0),this._$AL.set(i,t)),n===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,s]of this._$Ep)this[n]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[n,s]of r){let{wrapped:a}=s,o=this[n];a!==!0||this._$AL.has(n)||o===void 0||this.C(n,void 0,s,o)}}let i=!1,t=this._$AL;try{i=this.shouldUpdate(t),i?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw i=!1,this._$EM(),r}i&&this._$AE(t)}willUpdate(i){}_$AE(i){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(i){}firstUpdated(i){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[Ae("elementProperties")]=new Map,K[Ae("finalized")]=new Map,Ci?.({ReactiveElement:K}),(Ge.reactiveElementVersions??=[]).push("2.1.2");var bt=globalThis,Jt=e=>e,qe=bt.trustedTypes,Qt=qe?qe.createPolicy("lit-html",{createHTML:e=>e}):void 0,ir="$lit$",te=`lit$${Math.random().toFixed(9).slice(2)}$`,nr="?"+te,Ai=`<${nr}>`,he=document,Ne=()=>he.createComment(""),De=e=>e===null||typeof e!="object"&&typeof e!="function",$t=Array.isArray,Ti=e=>$t(e)||typeof e?.[Symbol.iterator]=="function",mt=`[ 	
\f\r]`,Le=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Xt=/-->/g,Zt=/>/g,de=RegExp(`>|${mt}(?:([^\\s"'>=/]+)(${mt}*=${mt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),er=/'/g,tr=/"/g,sr=/^(?:script|style|textarea|title)$/i,xt=e=>(i,...t)=>({_$litType$:e,strings:i,values:t}),u=xt(1),Ma=xt(2),Ra=xt(3),pe=Symbol.for("lit-noChange"),L=Symbol.for("lit-nothing"),rr=new WeakMap,ce=he.createTreeWalker(he,129);function ar(e,i){if(!$t(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Qt!==void 0?Qt.createHTML(i):i}var Li=(e,i)=>{let t=e.length-1,r=[],n,s=i===2?"<svg>":i===3?"<math>":"",a=Le;for(let o=0;o<t;o++){let l=e[o],h,m,p=-1,g=0;for(;g<l.length&&(a.lastIndex=g,m=a.exec(l),m!==null);)g=a.lastIndex,a===Le?m[1]==="!--"?a=Xt:m[1]!==void 0?a=Zt:m[2]!==void 0?(sr.test(m[2])&&(n=RegExp("</"+m[2],"g")),a=de):m[3]!==void 0&&(a=de):a===de?m[0]===">"?(a=n??Le,p=-1):m[1]===void 0?p=-2:(p=a.lastIndex-m[2].length,h=m[1],a=m[3]===void 0?de:m[3]==='"'?tr:er):a===tr||a===er?a=de:a===Xt||a===Zt?a=Le:(a=de,n=void 0);let _=a===de&&e[o+1].startsWith("/>")?" ":"";s+=a===Le?l+Ai:p>=0?(r.push(h),l.slice(0,p)+ir+l.slice(p)+te+_):l+te+(p===-2?o:_)}return[ar(e,s+(e[t]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),r]},Oe=class e{constructor({strings:i,_$litType$:t},r){let n;this.parts=[];let s=0,a=0,o=i.length-1,l=this.parts,[h,m]=Li(i,t);if(this.el=e.createElement(h,r),ce.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(n=ce.nextNode())!==null&&l.length<o;){if(n.nodeType===1){if(n.hasAttributes())for(let p of n.getAttributeNames())if(p.endsWith(ir)){let g=m[a++],_=n.getAttribute(p).split(te),w=/([.?@])?(.*)/.exec(g);l.push({type:1,index:s,name:w[2],strings:_,ctor:w[1]==="."?gt:w[1]==="?"?_t:w[1]==="@"?vt:be}),n.removeAttribute(p)}else p.startsWith(te)&&(l.push({type:6,index:s}),n.removeAttribute(p));if(sr.test(n.tagName)){let p=n.textContent.split(te),g=p.length-1;if(g>0){n.textContent=qe?qe.emptyScript:"";for(let _=0;_<g;_++)n.append(p[_],Ne()),ce.nextNode(),l.push({type:2,index:++s});n.append(p[g],Ne())}}}else if(n.nodeType===8)if(n.data===nr)l.push({type:2,index:s});else{let p=-1;for(;(p=n.data.indexOf(te,p+1))!==-1;)l.push({type:7,index:s}),p+=te.length-1}s++}}static createElement(i,t){let r=he.createElement("template");return r.innerHTML=i,r}};function ye(e,i,t=e,r){if(i===pe)return i;let n=r!==void 0?t._$Co?.[r]:t._$Cl,s=De(i)?void 0:i._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),s===void 0?n=void 0:(n=new s(e),n._$AT(e,t,r)),r!==void 0?(t._$Co??=[])[r]=n:t._$Cl=n),n!==void 0&&(i=ye(e,n._$AS(e,i.values),n,r)),i}var ft=class{constructor(i,t){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:t},parts:r}=this._$AD,n=(i?.creationScope??he).importNode(t,!0);ce.currentNode=n;let s=ce.nextNode(),a=0,o=0,l=r[0];for(;l!==void 0;){if(a===l.index){let h;l.type===2?h=new Fe(s,s.nextSibling,this,i):l.type===1?h=new l.ctor(s,l.name,l.strings,this,i):l.type===6&&(h=new yt(s,this,i)),this._$AV.push(h),l=r[++o]}a!==l?.index&&(s=ce.nextNode(),a++)}return ce.currentNode=he,n}p(i){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(i,r,t),t+=r.strings.length-2):r._$AI(i[t])),t++}},Fe=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,t,r,n){this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=i,this._$AB=t,this._$AM=r,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,t=this._$AM;return t!==void 0&&i?.nodeType===11&&(i=t.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,t=this){i=ye(this,i,t),De(i)?i===L||i==null||i===""?(this._$AH!==L&&this._$AR(),this._$AH=L):i!==this._$AH&&i!==pe&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):Ti(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==L&&De(this._$AH)?this._$AA.nextSibling.data=i:this.T(he.createTextNode(i)),this._$AH=i}$(i){let{values:t,_$litType$:r}=i,n=typeof r=="number"?this._$AC(i):(r.el===void 0&&(r.el=Oe.createElement(ar(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===n)this._$AH.p(t);else{let s=new ft(n,this),a=s.u(this.options);s.p(t),this.T(a),this._$AH=s}}_$AC(i){let t=rr.get(i.strings);return t===void 0&&rr.set(i.strings,t=new Oe(i)),t}k(i){$t(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,n=0;for(let s of i)n===t.length?t.push(r=new e(this.O(Ne()),this.O(Ne()),this,this.options)):r=t[n],r._$AI(s),n++;n<t.length&&(this._$AR(r&&r._$AB.nextSibling,n),t.length=n)}_$AR(i=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);i!==this._$AB;){let r=Jt(i).nextSibling;Jt(i).remove(),i=r}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},be=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,t,r,n,s){this.type=1,this._$AH=L,this._$AN=void 0,this.element=i,this.name=t,this._$AM=n,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=L}_$AI(i,t=this,r,n){let s=this.strings,a=!1;if(s===void 0)i=ye(this,i,t,0),a=!De(i)||i!==this._$AH&&i!==pe,a&&(this._$AH=i);else{let o=i,l,h;for(i=s[0],l=0;l<s.length-1;l++)h=ye(this,o[r+l],t,l),h===pe&&(h=this._$AH[l]),a||=!De(h)||h!==this._$AH[l],h===L?i=L:i!==L&&(i+=(h??"")+s[l+1]),this._$AH[l]=h}a&&!n&&this.j(i)}j(i){i===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},gt=class extends be{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===L?void 0:i}},_t=class extends be{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==L)}},vt=class extends be{constructor(i,t,r,n,s){super(i,t,r,n,s),this.type=5}_$AI(i,t=this){if((i=ye(this,i,t,0)??L)===pe)return;let r=this._$AH,n=i===L&&r!==L||i.capture!==r.capture||i.once!==r.once||i.passive!==r.passive,s=i!==L&&(r===L||n);n&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},yt=class{constructor(i,t,r){this.element=i,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(i){ye(this,i)}};var Ni=bt.litHtmlPolyfillSupport;Ni?.(Oe,Fe),(bt.litHtmlVersions??=[]).push("3.3.2");var or=(e,i,t)=>{let r=t?.renderBefore??i,n=r._$litPart$;if(n===void 0){let s=t?.renderBefore??null;r._$litPart$=n=new Fe(i.insertBefore(Ne(),s),s,void 0,t??{})}return n._$AI(e),n};var wt=globalThis,b=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=or(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return pe}};b._$litElement$=!0,b.finalized=!0,wt.litElementHydrateSupport?.({LitElement:b});var Di=wt.litElementPolyfillSupport;Di?.({LitElement:b});(wt.litElementVersions??=[]).push("4.2.2");var x=e=>(i,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(e,i)}):customElements.define(e,i)};var Oi={attribute:!0,type:String,converter:Te,reflect:!1,hasChanged:Ye},Fi=(e=Oi,i,t)=>{let{kind:r,metadata:n}=t,s=globalThis.litPropertyMetadata.get(n);if(s===void 0&&globalThis.litPropertyMetadata.set(n,s=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(t.name,e),r==="accessor"){let{name:a}=t;return{set(o){let l=i.get.call(this);i.set.call(this,o),this.requestUpdate(a,l,e,!0,o)},init(o){return o!==void 0&&this.C(a,void 0,e,o),o}}}if(r==="setter"){let{name:a}=t;return function(o){let l=this[a];i.call(this,o),this.requestUpdate(a,l,e,!0,o)}}throw Error("Unsupported decorator location: "+r)};function f(e){return(i,t)=>typeof t=="object"?Fi(e,i,t):((r,n,s)=>{let a=n.hasOwnProperty(s);return n.constructor.createProperty(s,r),a?Object.getOwnPropertyDescriptor(n,s):void 0})(e,i,t)}function v(e){return f({...e,state:!0,attribute:!1})}function z(e,i,t){let r=e?.localize?.(i);return r&&r!==i?r:t}function kt(e){let i=e.replaceAll("_"," ").toLowerCase();return i.charAt(0).toUpperCase()+i.slice(1)}function re(e,i){return z(e,`component.ambience.matcher.${i}`,kt(i))}function lr(e,i){return z(e,`component.ambience.action.${i}`,kt(i))}function $e(e,i){return z(e,`component.ambience.anchor.${i}`,kt(i))}function me(e,i,t){let r=t[i]?.label;if(r)return r;let n=i.charAt(0).toUpperCase()+i.slice(1);return z(e,`component.ambience.time_of_day_period.${i}`,n)}function d(e,i,t){return z(e,`component.ambience.${i}`,t)}var Ii=["mon","tue","wed","thu","fri","sat","sun"],Pi=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Ve(e,i){return z(e,`component.ambience.weekday.${Ii[i]}`,Pi[i]??String(i))}var Hi={weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"};function Je(e,i){return z(e,`component.ambience.day_item.${i}`,Hi[i]??i)}var Mi=["January","February","March","April","May","June","July","August","September","October","November","December"];function xe(e,i){return z(e,`component.ambience.month.${i}`,Mi[i-1]??String(i))}var Ri={"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"};function Qe(e,i){return z(e,`component.ambience.weather_condition.${i}`,Ri[i]??i)}var ji={temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"};function Ie(e,i){return z(e,`component.ambience.weather_attr.${i}`,ji[i]??i)}var Ui={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},zi={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},Wi={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function Et(e,i,t){if(i==="humidity")return"%";let r=Wi[i];if(r){let a=t?.attributes?.[r];if(typeof a=="string"&&a)return a}let n=zi[i],s=e?.config?.unit_system;return n&&s&&typeof s[n]=="string"?s[n]:Ui[i]??""}var Bi={is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"};function W(e,i){return z(e,`component.ambience.state_op.${i}`,Bi[i]??i)}var Gi=["ha-input","ha-textfield","ha-form"],Yi=["ha-input","ha-textfield"];function ur(){for(let e of Yi)if(customElements.get(e))return e;return null}function ie(e,i){for(let t of Gi)customElements.get(t)||customElements.whenDefined(t).then(()=>e.requestUpdate())}async function dr(e){return e.callWS({type:"ambience/areas/list"})}async function cr(e,i){return e.callWS({type:"ambience/area/get",area_id:i})}async function hr(e,i,t){return e.callWS({type:"ambience/area/save",area_id:i,config:t})}async function Xe(e){return e.callWS({type:"ambience/matchers/list"})}async function pr(e){return e.callWS({type:"ambience/actions/list"})}async function Ze(e){return e.callWS({type:"ambience/time_of_day_periods/list"})}async function mr(e,i,t){return e.callWS({type:"ambience/time_of_day_periods/save",custom:i,hidden:t})}async function et(e){return e.callWS({type:"ambience/matchers/day/config/list"})}async function fr(e,i,t){return e.callWS({type:"ambience/matchers/day/config/save",workday_sensor:i,workday_calendar:t})}async function tt(e){return e.callWS({type:"ambience/matchers/weather/config/list"})}async function gr(e,i,t){return e.callWS({type:"ambience/matchers/weather/config/save",entity:i,groups:t})}async function _r(e,i){return e.callWS({type:"ambience/state/known_states",entity_id:i})}function rt(e,i="New rule"){return e.name&&e.name.trim()?e.name:i}function it(e,i,t){return i==null?d(t.hass,"ui.summary_any_paren","(any)"):e==="time_of_day"?nt(i,t):e==="day"?Ki(i,t):e==="weather"?Qi(i,t):e==="state"?Ct(i,t):e==="script"?qi(i,t):String(i)}function qi(e,i={}){if(e===null)return d(i.hass,"ui.summary_any_paren","(any)");if(typeof e!="object"||e===null||typeof e.script!="string")return String(e);let t=e.args??{},r=Object.keys(t).sort();if(r.length===0)return e.script;let n=r.map(s=>`${s}=${t[s]}`).join(", ");return`${e.script}(${n})`}function Ki(e,i={}){if(e===null)return d(i.hass,"day_summary.any","any");let t=e.include??[],r=e.exclude??[],n=t.length===0?d(i.hass,"day_summary.any_day","any day"):t.map(a=>vr(a,i)).join(", ");if(r.length===0)return n;let s=d(i.hass,"day_summary.except","except");return`${n} (${s} ${r.map(a=>vr(a,i)).join(", ")})`}function vr(e,i){switch(e.kind){case"weekday":return e.days.map(t=>Ve(i.hass,t)).join("/");case"day_of_month":return`${d(i.hass,"day_summary.day_prefix","day")} ${e.days}`;case"date":return`${xe(i.hass,e.month)} ${e.day}`;case"date_range":return`${xe(i.hass,e.from.month)} ${e.from.day} \u2192 ${xe(i.hass,e.to.month)} ${e.to.day}`;case"last_day":return d(i.hass,"day_summary.last_day","last day");case"workday":return d(i.hass,"day_summary.workday","workday");case"holiday":return d(i.hass,"day_summary.holiday","holiday");case"first_workday":return d(i.hass,"day_summary.first_workday","first workday");case"last_workday":return d(i.hass,"day_summary.last_workday","last workday")}}var Vi={"<":"<","<=":"\u2264",">":">",">=":"\u2265"};function Ji(e){return e.split(/[\s_-]+/).filter(i=>i!=="").map(i=>i.charAt(0).toUpperCase()+i.slice(1).toLowerCase()).join(" ")}function Qi(e,i={}){if(e===null)return d(i.hass,"ui.summary_any","any");let t=new Map((i.weatherGroups??[]).map(a=>[a.id,a.label])),r=(e.groups??[]).map(a=>t.get(a)??Ji(a)).join("/"),n=(e.thresholds??[]).map(a=>`${Ie(i.hass,a.attribute)} ${Vi[a.op]??a.op} ${a.value}`).join(", "),s=[r,n].filter(a=>a!=="");return s.length===0?d(i.hass,"ui.summary_any","any"):s.join(", ")}function Xi(e,i){let r=e.hass?.states?.[i]?.attributes?.friendly_name;return typeof r=="string"&&r?r:i}function Ct(e,i={}){return e==null?d(i.hass,"ui.summary_any","any"):St(e,i)}function St(e,i){if(e.kind==="is"||e.kind==="is_not"||e.kind===">"||e.kind===">="||e.kind==="<"||e.kind==="<="){let t=W(i.hass,e.kind),n=e.kind!=="is"&&e.kind!=="is_not"?e.states[0]??"":e.states.join("/"),s=Xi(i,e.entity_id),o=`${e.attribute?`${s}.${e.attribute}`:s} ${t} ${n}`;return e.for&&Zi(e.for)?`${o} ${d(i.hass,"ui.for_prefix","for")} \u2265${en(e.for)}`:o}if(e.kind==="and"||e.kind==="or"){let t=` ${W(i.hass,e.kind)} `;return e.items.map(r=>yr(r,i)).join(t)}return e.kind==="not"?`${W(i.hass,"not")} ${yr(e.item,i)}`:""}function yr(e,i){return e.kind==="and"||e.kind==="or"?`(${St(e,i)})`:St(e,i)}function Zi(e){return e.h>0||e.m>0||e.s>0}function en(e){let i=[];return e.h&&i.push(`${e.h}h`),e.m&&i.push(`${e.m}m`),e.s&&i.push(`${e.s}s`),i.length?i.join(" "):"0s"}function nt(e,i){if(e===null)return d(i.hass,"ui.summary_any","any");let t=Array.isArray(e)?e:[e],r=i.periods?.custom??{};return t.map(n=>"period"in n?me(i.hass,n.period,r):`${br(n.from,i)} \u2192 ${br(n.to,i)}`).join(", ")}function br(e,i){if(e.kind==="time")return`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;let t=$e(i.hass,e.anchor);if(e.offset_min===0)return t;let r=Math.abs(e.offset_min),n=r%60===0?`${r/60}${d(i.hass,"ui.unit_hour_abbr","h")}`:`${r}${d(i.hass,"ui.unit_min_abbr","m")}`;return`${t}${e.offset_min<0?"-":"+"}${n}`}function $r(e,i,t){let r=lr(t.hass,e.action),n=i?.domains?.[0]??d(t.hass,"ui.target_noun","target"),s=e.entity_ids.length,a;s===0?a=d(t.hass,"ui.no_targets","(no targets)"):s===1?a=`1 ${n}`:a=`${s} ${n}s`;let o={};for(let h of i?.target_params??[])h.unit&&(o[h.name]=h.unit);let l=Object.entries(e.params).filter(([,h])=>h!=null&&h!=="").map(([h,m])=>`${h} ${m}${o[h]??""}`).join(", ");return l?`${r}: ${a}, ${l}`:`${r}: ${a}`}var H=class extends b{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(t,r){this.dispatchEvent(new CustomEvent(t,{detail:r,bubbles:!0,composed:!0}))}_summary(t){let r=new Map((this.matchers??[]).map(l=>[l.name,l.priority])),n=Object.keys(t.when).filter(l=>t.when[l]!=null).sort((l,h)=>(r.get(l)??1/0)-(r.get(h)??1/0)),s=n.length===0?d(this.hass,"ui.summary_any","any"):n.map(l=>`${re(this.hass,l)}: ${it(l,t.when[l],{hass:this.hass,periods:this.periods,weatherGroups:this.weatherConfig?.groups})}`).join(", "),a=t.actions.length,o=a===1?d(this.hass,"ui.action_singular","action"):d(this.hass,"ui.action_plural","actions");return`${s} \xB7 ${a} ${o}`}_onDragStart(t){this._dragFrom=t}_onDragOver(t,r){this._dragFrom===null||r===this._dragFrom||(t.preventDefault(),this._dragOver=r)}_onDrop(t){let r=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(r===null||r===t)&&this._emit("reorder-rules",{from:r,to:t})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(t,r){let n=r.name||d(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(t+1));window.confirm(d(this.hass,"ui.confirm_delete",'Delete "{name}"?').replace("{name}",n))&&this._emit("delete-rule",{index:t})}render(){return this.rules.length===0?u`
        <p class="empty">${d(this.hass,"ui.no_rules_yet","No rules yet.")}</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          ${d(this.hass,"ui.add_rule","+ Add rule")}
        </button>
      `:u`
      <ul>
        ${this.rules.map((t,r)=>u`
            <li
              class=${this._dragOver===r?"drag-over":""}
              draggable=${!this.autoSort}
              @dragstart=${()=>this._onDragStart(r)}
              @dragover=${n=>this._onDragOver(n,r)}
              @drop=${()=>this._onDrop(r)}
              @dragend=${this._onDragEnd}
            >
              ${this.autoSort?"":u`<span class="handle" title=${d(this.hass,"ui.drag_to_reorder","Drag to reorder")}>⠿</span>`}
              <span class="idx">${r+1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${()=>this._emit("edit-rule",{index:r})}
                >
                  ${rt(t,d(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(r+1)))}
                </div>
                <div class="summary">${this._summary(t)}</div>
              </div>
              <button
                @click=${()=>this._emit("duplicate-rule",{index:r})}
                title=${d(this.hass,"ui.duplicate","Duplicate")}
              >
                ⧉
              </button>
              <button
                @click=${()=>this._confirmDelete(r,t)}
                title=${d(this.hass,"ui.title_delete","Delete")}
              >
                🗑
              </button>
            </li>
          `)}
      </ul>
      <button class="add" @click=${()=>this._emit("add-rule",{})}>
        ${d(this.hass,"ui.add_rule","+ Add rule")}
      </button>
    `}};H.styles=$`
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
  `,c([f({attribute:!1})],H.prototype,"rules",2),c([f({type:Boolean})],H.prototype,"autoSort",2),c([f({attribute:!1})],H.prototype,"periods",2),c([f({attribute:!1})],H.prototype,"weatherConfig",2),c([f({attribute:!1})],H.prototype,"hass",2),c([f({attribute:!1})],H.prototype,"matchers",2),c([v()],H.prototype,"_dragFrom",2),c([v()],H.prototype,"_dragOver",2),H=c([x("ambience-rules-list")],H);function xr(e,i,t){if(!e||!e.entities||!i)return[];let r=e.entities,n=e.devices??{};return Object.values(r).filter(s=>!!(s.area_id===i||s.device_id&&n[s.device_id]?.area_id===i)).filter(s=>t.includes(s.entity_id.split(".")[0])).map(s=>s.entity_id).sort()}var B=class extends b{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=t=>{this._open&&(t.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=t=>{t.stopPropagation();let r=t.detail.value?.scene??"";this._emit(r.trim()===""?null:r)};this._sceneComputeLabel=t=>t.name==="scene"?d(this.hass,"ui.scene_name","Scene name"):t.name}connectedCallback(){super.connectedCallback(),ie(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(t){t.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(r=>({value:r,label:r})),custom_value:!0,mode:"dropdown"}}}])}_emit(t){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_onInput(t){let r=t.target.value;this._emit(r.trim()===""?null:r),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(t){t.key==="Escape"&&this._open&&(this._open=!1,t.stopPropagation())}_toggle(t){t.preventDefault(),this._open=!this._open}_select(t,r){r.preventDefault(),this._emit(t),this._open=!1}render(){if(customElements.get("ha-form")){let t={scene:this.value??""};return u`
        <ha-form
          .hass=${this.hass}
          .schema=${this._schema}
          .data=${t}
          .computeLabel=${this._sceneComputeLabel}
          @value-changed=${this._onHaFormValueChanged}
        ></ha-form>
      `}return u`
      <div class="control">
        <input
          type="text"
          placeholder=${d(this.hass,"ui.scene_name","Scene name")}
          .value=${this.value??""}
          @input=${this._onInput}
          @focus=${this._onFocus}
          @keydown=${this._onKeyDown}
        />
        <button
          class="toggle"
          type="button"
          tabindex="-1"
          aria-label=${d(this.hass,"ui.show_scene_suggestions","Show scene suggestions")}
          @mousedown=${this._toggle}
        >
          ▼
        </button>
      </div>
      ${this._open?u`
            <div class="menu" role="listbox">
              ${this.suggestions.length===0?u`<div class="empty">
                    ${d(this.hass,"ui.no_scenes_yet","No scenes yet \u2014 type to create one")}
                  </div>`:this.suggestions.map(t=>u`
                      <div
                        class="item ${t===this.value?"selected":""}"
                        role="option"
                        @mousedown=${r=>this._select(t,r)}
                      >
                        ${t}
                      </div>
                    `)}
            </div>
          `:""}
    `}};B.styles=$`
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
  `,c([f({attribute:!1})],B.prototype,"hass",2),c([f()],B.prototype,"value",2),c([f({attribute:!1})],B.prototype,"suggestions",2),c([v()],B.prototype,"_schema",2),c([v()],B.prototype,"_open",2),B=c([x("ambience-scene-combobox")],B);function Mr(e){return typeof e>"u"||e===null}function tn(e){return typeof e=="object"&&e!==null}function rn(e){return Array.isArray(e)?e:Mr(e)?[]:[e]}function nn(e,i){var t,r,n,s;if(i)for(s=Object.keys(i),t=0,r=s.length;t<r;t+=1)n=s[t],e[n]=i[n];return e}function sn(e,i){var t="",r;for(r=0;r<i;r+=1)t+=e;return t}function an(e){return e===0&&Number.NEGATIVE_INFINITY===1/e}var on=Mr,ln=tn,un=rn,dn=sn,cn=an,hn=nn,T={isNothing:on,isObject:ln,toArray:un,repeat:dn,isNegativeZero:cn,extend:hn};function Rr(e,i){var t="",r=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(t+='in "'+e.mark.name+'" '),t+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!i&&e.mark.snippet&&(t+=`

`+e.mark.snippet),r+" "+t):r}function He(e,i){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=i,this.message=Rr(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}He.prototype=Object.create(Error.prototype);He.prototype.constructor=He;He.prototype.toString=function(i){return this.name+": "+Rr(this,i)};var I=He;function At(e,i,t,r,n){var s="",a="",o=Math.floor(n/2)-1;return r-i>o&&(s=" ... ",i=r-o+s.length),t-r>o&&(a=" ...",t=r+o-a.length),{str:s+e.slice(i,t).replace(/\t/g,"\u2192")+a,pos:r-i+s.length}}function Tt(e,i){return T.repeat(" ",i-e.length)+e}function pn(e,i){if(i=Object.create(i||null),!e.buffer)return null;i.maxLength||(i.maxLength=79),typeof i.indent!="number"&&(i.indent=1),typeof i.linesBefore!="number"&&(i.linesBefore=3),typeof i.linesAfter!="number"&&(i.linesAfter=2);for(var t=/\r?\n|\r|\0/g,r=[0],n=[],s,a=-1;s=t.exec(e.buffer);)n.push(s.index),r.push(s.index+s[0].length),e.position<=s.index&&a<0&&(a=r.length-2);a<0&&(a=r.length-1);var o="",l,h,m=Math.min(e.line+i.linesAfter,n.length).toString().length,p=i.maxLength-(i.indent+m+3);for(l=1;l<=i.linesBefore&&!(a-l<0);l++)h=At(e.buffer,r[a-l],n[a-l],e.position-(r[a]-r[a-l]),p),o=T.repeat(" ",i.indent)+Tt((e.line-l+1).toString(),m)+" | "+h.str+`
`+o;for(h=At(e.buffer,r[a],n[a],e.position,p),o+=T.repeat(" ",i.indent)+Tt((e.line+1).toString(),m)+" | "+h.str+`
`,o+=T.repeat("-",i.indent+m+3+h.pos)+`^
`,l=1;l<=i.linesAfter&&!(a+l>=n.length);l++)h=At(e.buffer,r[a+l],n[a+l],e.position-(r[a]-r[a+l]),p),o+=T.repeat(" ",i.indent)+Tt((e.line+l+1).toString(),m)+" | "+h.str+`
`;return o.replace(/\n$/,"")}var mn=pn,fn=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],gn=["scalar","sequence","mapping"];function _n(e){var i={};return e!==null&&Object.keys(e).forEach(function(t){e[t].forEach(function(r){i[String(r)]=t})}),i}function vn(e,i){if(i=i||{},Object.keys(i).forEach(function(t){if(fn.indexOf(t)===-1)throw new I('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=i,this.tag=e,this.kind=i.kind||null,this.resolve=i.resolve||function(){return!0},this.construct=i.construct||function(t){return t},this.instanceOf=i.instanceOf||null,this.predicate=i.predicate||null,this.represent=i.represent||null,this.representName=i.representName||null,this.defaultStyle=i.defaultStyle||null,this.multi=i.multi||!1,this.styleAliases=_n(i.styleAliases||null),gn.indexOf(this.kind)===-1)throw new I('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}var D=vn;function wr(e,i){var t=[];return e[i].forEach(function(r){var n=t.length;t.forEach(function(s,a){s.tag===r.tag&&s.kind===r.kind&&s.multi===r.multi&&(n=a)}),t[n]=r}),t}function yn(){var e={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},i,t;function r(n){n.multi?(e.multi[n.kind].push(n),e.multi.fallback.push(n)):e[n.kind][n.tag]=e.fallback[n.tag]=n}for(i=0,t=arguments.length;i<t;i+=1)arguments[i].forEach(r);return e}function Nt(e){return this.extend(e)}Nt.prototype.extend=function(i){var t=[],r=[];if(i instanceof D)r.push(i);else if(Array.isArray(i))r=r.concat(i);else if(i&&(Array.isArray(i.implicit)||Array.isArray(i.explicit)))i.implicit&&(t=t.concat(i.implicit)),i.explicit&&(r=r.concat(i.explicit));else throw new I("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");t.forEach(function(s){if(!(s instanceof D))throw new I("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new I("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new I("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),r.forEach(function(s){if(!(s instanceof D))throw new I("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var n=Object.create(Nt.prototype);return n.implicit=(this.implicit||[]).concat(t),n.explicit=(this.explicit||[]).concat(r),n.compiledImplicit=wr(n,"implicit"),n.compiledExplicit=wr(n,"explicit"),n.compiledTypeMap=yn(n.compiledImplicit,n.compiledExplicit),n};var bn=Nt,$n=new D("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return e!==null?e:""}}),xn=new D("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return e!==null?e:[]}}),wn=new D("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return e!==null?e:{}}}),kn=new bn({explicit:[$n,xn,wn]});function En(e){if(e===null)return!0;var i=e.length;return i===1&&e==="~"||i===4&&(e==="null"||e==="Null"||e==="NULL")}function Sn(){return null}function Cn(e){return e===null}var An=new D("tag:yaml.org,2002:null",{kind:"scalar",resolve:En,construct:Sn,predicate:Cn,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function Tn(e){if(e===null)return!1;var i=e.length;return i===4&&(e==="true"||e==="True"||e==="TRUE")||i===5&&(e==="false"||e==="False"||e==="FALSE")}function Ln(e){return e==="true"||e==="True"||e==="TRUE"}function Nn(e){return Object.prototype.toString.call(e)==="[object Boolean]"}var Dn=new D("tag:yaml.org,2002:bool",{kind:"scalar",resolve:Tn,construct:Ln,predicate:Nn,represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function On(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function Fn(e){return 48<=e&&e<=55}function In(e){return 48<=e&&e<=57}function Pn(e){if(e===null)return!1;var i=e.length,t=0,r=!1,n;if(!i)return!1;if(n=e[t],(n==="-"||n==="+")&&(n=e[++t]),n==="0"){if(t+1===i)return!0;if(n=e[++t],n==="b"){for(t++;t<i;t++)if(n=e[t],n!=="_"){if(n!=="0"&&n!=="1")return!1;r=!0}return r&&n!=="_"}if(n==="x"){for(t++;t<i;t++)if(n=e[t],n!=="_"){if(!On(e.charCodeAt(t)))return!1;r=!0}return r&&n!=="_"}if(n==="o"){for(t++;t<i;t++)if(n=e[t],n!=="_"){if(!Fn(e.charCodeAt(t)))return!1;r=!0}return r&&n!=="_"}}if(n==="_")return!1;for(;t<i;t++)if(n=e[t],n!=="_"){if(!In(e.charCodeAt(t)))return!1;r=!0}return!(!r||n==="_")}function Hn(e){var i=e,t=1,r;if(i.indexOf("_")!==-1&&(i=i.replace(/_/g,"")),r=i[0],(r==="-"||r==="+")&&(r==="-"&&(t=-1),i=i.slice(1),r=i[0]),i==="0")return 0;if(r==="0"){if(i[1]==="b")return t*parseInt(i.slice(2),2);if(i[1]==="x")return t*parseInt(i.slice(2),16);if(i[1]==="o")return t*parseInt(i.slice(2),8)}return t*parseInt(i,10)}function Mn(e){return Object.prototype.toString.call(e)==="[object Number]"&&e%1===0&&!T.isNegativeZero(e)}var Rn=new D("tag:yaml.org,2002:int",{kind:"scalar",resolve:Pn,construct:Hn,predicate:Mn,represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),jn=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Un(e){return!(e===null||!jn.test(e)||e[e.length-1]==="_")}function zn(e){var i,t;return i=e.replace(/_/g,"").toLowerCase(),t=i[0]==="-"?-1:1,"+-".indexOf(i[0])>=0&&(i=i.slice(1)),i===".inf"?t===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:i===".nan"?NaN:t*parseFloat(i,10)}var Wn=/^[-+]?[0-9]+e/;function Bn(e,i){var t;if(isNaN(e))switch(i){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(i){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(i){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(T.isNegativeZero(e))return"-0.0";return t=e.toString(10),Wn.test(t)?t.replace("e",".e"):t}function Gn(e){return Object.prototype.toString.call(e)==="[object Number]"&&(e%1!==0||T.isNegativeZero(e))}var Yn=new D("tag:yaml.org,2002:float",{kind:"scalar",resolve:Un,construct:zn,predicate:Gn,represent:Bn,defaultStyle:"lowercase"}),qn=kn.extend({implicit:[An,Dn,Rn,Yn]}),Kn=qn,jr=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Ur=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Vn(e){return e===null?!1:jr.exec(e)!==null||Ur.exec(e)!==null}function Jn(e){var i,t,r,n,s,a,o,l=0,h=null,m,p,g;if(i=jr.exec(e),i===null&&(i=Ur.exec(e)),i===null)throw new Error("Date resolve error");if(t=+i[1],r=+i[2]-1,n=+i[3],!i[4])return new Date(Date.UTC(t,r,n));if(s=+i[4],a=+i[5],o=+i[6],i[7]){for(l=i[7].slice(0,3);l.length<3;)l+="0";l=+l}return i[9]&&(m=+i[10],p=+(i[11]||0),h=(m*60+p)*6e4,i[9]==="-"&&(h=-h)),g=new Date(Date.UTC(t,r,n,s,a,o,l)),h&&g.setTime(g.getTime()-h),g}function Qn(e){return e.toISOString()}var Xn=new D("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:Vn,construct:Jn,instanceOf:Date,represent:Qn});function Zn(e){return e==="<<"||e===null}var es=new D("tag:yaml.org,2002:merge",{kind:"scalar",resolve:Zn}),Pt=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function ts(e){if(e===null)return!1;var i,t,r=0,n=e.length,s=Pt;for(t=0;t<n;t++)if(i=s.indexOf(e.charAt(t)),!(i>64)){if(i<0)return!1;r+=6}return r%8===0}function rs(e){var i,t,r=e.replace(/[\r\n=]/g,""),n=r.length,s=Pt,a=0,o=[];for(i=0;i<n;i++)i%4===0&&i&&(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)),a=a<<6|s.indexOf(r.charAt(i));return t=n%4*6,t===0?(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)):t===18?(o.push(a>>10&255),o.push(a>>2&255)):t===12&&o.push(a>>4&255),new Uint8Array(o)}function is(e){var i="",t=0,r,n,s=e.length,a=Pt;for(r=0;r<s;r++)r%3===0&&r&&(i+=a[t>>18&63],i+=a[t>>12&63],i+=a[t>>6&63],i+=a[t&63]),t=(t<<8)+e[r];return n=s%3,n===0?(i+=a[t>>18&63],i+=a[t>>12&63],i+=a[t>>6&63],i+=a[t&63]):n===2?(i+=a[t>>10&63],i+=a[t>>4&63],i+=a[t<<2&63],i+=a[64]):n===1&&(i+=a[t>>2&63],i+=a[t<<4&63],i+=a[64],i+=a[64]),i}function ns(e){return Object.prototype.toString.call(e)==="[object Uint8Array]"}var ss=new D("tag:yaml.org,2002:binary",{kind:"scalar",resolve:ts,construct:rs,predicate:ns,represent:is}),as=Object.prototype.hasOwnProperty,os=Object.prototype.toString;function ls(e){if(e===null)return!0;var i=[],t,r,n,s,a,o=e;for(t=0,r=o.length;t<r;t+=1){if(n=o[t],a=!1,os.call(n)!=="[object Object]")return!1;for(s in n)if(as.call(n,s))if(!a)a=!0;else return!1;if(!a)return!1;if(i.indexOf(s)===-1)i.push(s);else return!1}return!0}function us(e){return e!==null?e:[]}var ds=new D("tag:yaml.org,2002:omap",{kind:"sequence",resolve:ls,construct:us}),cs=Object.prototype.toString;function hs(e){if(e===null)return!0;var i,t,r,n,s,a=e;for(s=new Array(a.length),i=0,t=a.length;i<t;i+=1){if(r=a[i],cs.call(r)!=="[object Object]"||(n=Object.keys(r),n.length!==1))return!1;s[i]=[n[0],r[n[0]]]}return!0}function ps(e){if(e===null)return[];var i,t,r,n,s,a=e;for(s=new Array(a.length),i=0,t=a.length;i<t;i+=1)r=a[i],n=Object.keys(r),s[i]=[n[0],r[n[0]]];return s}var ms=new D("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:hs,construct:ps}),fs=Object.prototype.hasOwnProperty;function gs(e){if(e===null)return!0;var i,t=e;for(i in t)if(fs.call(t,i)&&t[i]!==null)return!1;return!0}function _s(e){return e!==null?e:{}}var vs=new D("tag:yaml.org,2002:set",{kind:"mapping",resolve:gs,construct:_s}),zr=Kn.extend({implicit:[Xn,es],explicit:[ss,ds,ms,vs]}),se=Object.prototype.hasOwnProperty,st=1,Wr=2,Br=3,at=4,Lt=1,ys=2,kr=3,bs=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,$s=/[\x85\u2028\u2029]/,xs=/[,\[\]\{\}]/,Gr=/^(?:!|!!|![a-z\-]+!)$/i,Yr=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Er(e){return Object.prototype.toString.call(e)}function G(e){return e===10||e===13}function ge(e){return e===9||e===32}function P(e){return e===9||e===32||e===10||e===13}function ke(e){return e===44||e===91||e===93||e===123||e===125}function ws(e){var i;return 48<=e&&e<=57?e-48:(i=e|32,97<=i&&i<=102?i-97+10:-1)}function ks(e){return e===120?2:e===117?4:e===85?8:0}function Es(e){return 48<=e&&e<=57?e-48:-1}function Sr(e){return e===48?"\0":e===97?"\x07":e===98?"\b":e===116||e===9?"	":e===110?`
`:e===118?"\v":e===102?"\f":e===114?"\r":e===101?"\x1B":e===32?" ":e===34?'"':e===47?"/":e===92?"\\":e===78?"\x85":e===95?"\xA0":e===76?"\u2028":e===80?"\u2029":""}function Ss(e){return e<=65535?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}function qr(e,i,t){i==="__proto__"?Object.defineProperty(e,i,{configurable:!0,enumerable:!0,writable:!0,value:t}):e[i]=t}var Kr=new Array(256),Vr=new Array(256);for(fe=0;fe<256;fe++)Kr[fe]=Sr(fe)?1:0,Vr[fe]=Sr(fe);var fe;function Cs(e,i){this.input=e,this.filename=i.filename||null,this.schema=i.schema||zr,this.onWarning=i.onWarning||null,this.legacy=i.legacy||!1,this.json=i.json||!1,this.listener=i.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Jr(e,i){var t={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return t.snippet=mn(t),new I(i,t)}function y(e,i){throw Jr(e,i)}function ot(e,i){e.onWarning&&e.onWarning.call(null,Jr(e,i))}var Cr={YAML:function(i,t,r){var n,s,a;i.version!==null&&y(i,"duplication of %YAML directive"),r.length!==1&&y(i,"YAML directive accepts exactly one argument"),n=/^([0-9]+)\.([0-9]+)$/.exec(r[0]),n===null&&y(i,"ill-formed argument of the YAML directive"),s=parseInt(n[1],10),a=parseInt(n[2],10),s!==1&&y(i,"unacceptable YAML version of the document"),i.version=r[0],i.checkLineBreaks=a<2,a!==1&&a!==2&&ot(i,"unsupported YAML version of the document")},TAG:function(i,t,r){var n,s;r.length!==2&&y(i,"TAG directive accepts exactly two arguments"),n=r[0],s=r[1],Gr.test(n)||y(i,"ill-formed tag handle (first argument) of the TAG directive"),se.call(i.tagMap,n)&&y(i,'there is a previously declared suffix for "'+n+'" tag handle'),Yr.test(s)||y(i,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{y(i,"tag prefix is malformed: "+s)}i.tagMap[n]=s}};function ne(e,i,t,r){var n,s,a,o;if(i<t){if(o=e.input.slice(i,t),r)for(n=0,s=o.length;n<s;n+=1)a=o.charCodeAt(n),a===9||32<=a&&a<=1114111||y(e,"expected valid JSON character");else bs.test(o)&&y(e,"the stream contains non-printable characters");e.result+=o}}function Ar(e,i,t,r){var n,s,a,o;for(T.isObject(t)||y(e,"cannot merge mappings; the provided source object is unacceptable"),n=Object.keys(t),a=0,o=n.length;a<o;a+=1)s=n[a],se.call(i,s)||(qr(i,s,t[s]),r[s]=!0)}function Ee(e,i,t,r,n,s,a,o,l){var h,m;if(Array.isArray(n))for(n=Array.prototype.slice.call(n),h=0,m=n.length;h<m;h+=1)Array.isArray(n[h])&&y(e,"nested arrays are not supported inside keys"),typeof n=="object"&&Er(n[h])==="[object Object]"&&(n[h]="[object Object]");if(typeof n=="object"&&Er(n)==="[object Object]"&&(n="[object Object]"),n=String(n),i===null&&(i={}),r==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(h=0,m=s.length;h<m;h+=1)Ar(e,i,s[h],t);else Ar(e,i,s,t);else!e.json&&!se.call(t,n)&&se.call(i,n)&&(e.line=a||e.line,e.lineStart=o||e.lineStart,e.position=l||e.position,y(e,"duplicated mapping key")),qr(i,n,s),delete t[n];return i}function Ht(e){var i;i=e.input.charCodeAt(e.position),i===10?e.position++:i===13?(e.position++,e.input.charCodeAt(e.position)===10&&e.position++):y(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function A(e,i,t){for(var r=0,n=e.input.charCodeAt(e.position);n!==0;){for(;ge(n);)n===9&&e.firstTabInLine===-1&&(e.firstTabInLine=e.position),n=e.input.charCodeAt(++e.position);if(i&&n===35)do n=e.input.charCodeAt(++e.position);while(n!==10&&n!==13&&n!==0);if(G(n))for(Ht(e),n=e.input.charCodeAt(e.position),r++,e.lineIndent=0;n===32;)e.lineIndent++,n=e.input.charCodeAt(++e.position);else break}return t!==-1&&r!==0&&e.lineIndent<t&&ot(e,"deficient indentation"),r}function dt(e){var i=e.position,t;return t=e.input.charCodeAt(i),!!((t===45||t===46)&&t===e.input.charCodeAt(i+1)&&t===e.input.charCodeAt(i+2)&&(i+=3,t=e.input.charCodeAt(i),t===0||P(t)))}function Mt(e,i){i===1?e.result+=" ":i>1&&(e.result+=T.repeat(`
`,i-1))}function As(e,i,t){var r,n,s,a,o,l,h,m,p=e.kind,g=e.result,_;if(_=e.input.charCodeAt(e.position),P(_)||ke(_)||_===35||_===38||_===42||_===33||_===124||_===62||_===39||_===34||_===37||_===64||_===96||(_===63||_===45)&&(n=e.input.charCodeAt(e.position+1),P(n)||t&&ke(n)))return!1;for(e.kind="scalar",e.result="",s=a=e.position,o=!1;_!==0;){if(_===58){if(n=e.input.charCodeAt(e.position+1),P(n)||t&&ke(n))break}else if(_===35){if(r=e.input.charCodeAt(e.position-1),P(r))break}else{if(e.position===e.lineStart&&dt(e)||t&&ke(_))break;if(G(_))if(l=e.line,h=e.lineStart,m=e.lineIndent,A(e,!1,-1),e.lineIndent>=i){o=!0,_=e.input.charCodeAt(e.position);continue}else{e.position=a,e.line=l,e.lineStart=h,e.lineIndent=m;break}}o&&(ne(e,s,a,!1),Mt(e,e.line-l),s=a=e.position,o=!1),ge(_)||(a=e.position+1),_=e.input.charCodeAt(++e.position)}return ne(e,s,a,!1),e.result?!0:(e.kind=p,e.result=g,!1)}function Ts(e,i){var t,r,n;if(t=e.input.charCodeAt(e.position),t!==39)return!1;for(e.kind="scalar",e.result="",e.position++,r=n=e.position;(t=e.input.charCodeAt(e.position))!==0;)if(t===39)if(ne(e,r,e.position,!0),t=e.input.charCodeAt(++e.position),t===39)r=e.position,e.position++,n=e.position;else return!0;else G(t)?(ne(e,r,n,!0),Mt(e,A(e,!1,i)),r=n=e.position):e.position===e.lineStart&&dt(e)?y(e,"unexpected end of the document within a single quoted scalar"):(e.position++,n=e.position);y(e,"unexpected end of the stream within a single quoted scalar")}function Ls(e,i){var t,r,n,s,a,o;if(o=e.input.charCodeAt(e.position),o!==34)return!1;for(e.kind="scalar",e.result="",e.position++,t=r=e.position;(o=e.input.charCodeAt(e.position))!==0;){if(o===34)return ne(e,t,e.position,!0),e.position++,!0;if(o===92){if(ne(e,t,e.position,!0),o=e.input.charCodeAt(++e.position),G(o))A(e,!1,i);else if(o<256&&Kr[o])e.result+=Vr[o],e.position++;else if((a=ks(o))>0){for(n=a,s=0;n>0;n--)o=e.input.charCodeAt(++e.position),(a=ws(o))>=0?s=(s<<4)+a:y(e,"expected hexadecimal character");e.result+=Ss(s),e.position++}else y(e,"unknown escape sequence");t=r=e.position}else G(o)?(ne(e,t,r,!0),Mt(e,A(e,!1,i)),t=r=e.position):e.position===e.lineStart&&dt(e)?y(e,"unexpected end of the document within a double quoted scalar"):(e.position++,r=e.position)}y(e,"unexpected end of the stream within a double quoted scalar")}function Ns(e,i){var t=!0,r,n,s,a=e.tag,o,l=e.anchor,h,m,p,g,_,w=Object.create(null),E,C,U,k;if(k=e.input.charCodeAt(e.position),k===91)m=93,_=!1,o=[];else if(k===123)m=125,_=!0,o={};else return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=o),k=e.input.charCodeAt(++e.position);k!==0;){if(A(e,!0,i),k=e.input.charCodeAt(e.position),k===m)return e.position++,e.tag=a,e.anchor=l,e.kind=_?"mapping":"sequence",e.result=o,!0;t?k===44&&y(e,"expected the node content, but found ','"):y(e,"missed comma between flow collection entries"),C=E=U=null,p=g=!1,k===63&&(h=e.input.charCodeAt(e.position+1),P(h)&&(p=g=!0,e.position++,A(e,!0,i))),r=e.line,n=e.lineStart,s=e.position,Se(e,i,st,!1,!0),C=e.tag,E=e.result,A(e,!0,i),k=e.input.charCodeAt(e.position),(g||e.line===r)&&k===58&&(p=!0,k=e.input.charCodeAt(++e.position),A(e,!0,i),Se(e,i,st,!1,!0),U=e.result),_?Ee(e,o,w,C,E,U,r,n,s):p?o.push(Ee(e,null,w,C,E,U,r,n,s)):o.push(E),A(e,!0,i),k=e.input.charCodeAt(e.position),k===44?(t=!0,k=e.input.charCodeAt(++e.position)):t=!1}y(e,"unexpected end of the stream within a flow collection")}function Ds(e,i){var t,r,n=Lt,s=!1,a=!1,o=i,l=0,h=!1,m,p;if(p=e.input.charCodeAt(e.position),p===124)r=!1;else if(p===62)r=!0;else return!1;for(e.kind="scalar",e.result="";p!==0;)if(p=e.input.charCodeAt(++e.position),p===43||p===45)Lt===n?n=p===43?kr:ys:y(e,"repeat of a chomping mode identifier");else if((m=Es(p))>=0)m===0?y(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):a?y(e,"repeat of an indentation width identifier"):(o=i+m-1,a=!0);else break;if(ge(p)){do p=e.input.charCodeAt(++e.position);while(ge(p));if(p===35)do p=e.input.charCodeAt(++e.position);while(!G(p)&&p!==0)}for(;p!==0;){for(Ht(e),e.lineIndent=0,p=e.input.charCodeAt(e.position);(!a||e.lineIndent<o)&&p===32;)e.lineIndent++,p=e.input.charCodeAt(++e.position);if(!a&&e.lineIndent>o&&(o=e.lineIndent),G(p)){l++;continue}if(e.lineIndent<o){n===kr?e.result+=T.repeat(`
`,s?1+l:l):n===Lt&&s&&(e.result+=`
`);break}for(r?ge(p)?(h=!0,e.result+=T.repeat(`
`,s?1+l:l)):h?(h=!1,e.result+=T.repeat(`
`,l+1)):l===0?s&&(e.result+=" "):e.result+=T.repeat(`
`,l):e.result+=T.repeat(`
`,s?1+l:l),s=!0,a=!0,l=0,t=e.position;!G(p)&&p!==0;)p=e.input.charCodeAt(++e.position);ne(e,t,e.position,!1)}return!0}function Tr(e,i){var t,r=e.tag,n=e.anchor,s=[],a,o=!1,l;if(e.firstTabInLine!==-1)return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=s),l=e.input.charCodeAt(e.position);l!==0&&(e.firstTabInLine!==-1&&(e.position=e.firstTabInLine,y(e,"tab characters must not be used in indentation")),!(l!==45||(a=e.input.charCodeAt(e.position+1),!P(a))));){if(o=!0,e.position++,A(e,!0,-1)&&e.lineIndent<=i){s.push(null),l=e.input.charCodeAt(e.position);continue}if(t=e.line,Se(e,i,Br,!1,!0),s.push(e.result),A(e,!0,-1),l=e.input.charCodeAt(e.position),(e.line===t||e.lineIndent>i)&&l!==0)y(e,"bad indentation of a sequence entry");else if(e.lineIndent<i)break}return o?(e.tag=r,e.anchor=n,e.kind="sequence",e.result=s,!0):!1}function Os(e,i,t){var r,n,s,a,o,l,h=e.tag,m=e.anchor,p={},g=Object.create(null),_=null,w=null,E=null,C=!1,U=!1,k;if(e.firstTabInLine!==-1)return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=p),k=e.input.charCodeAt(e.position);k!==0;){if(!C&&e.firstTabInLine!==-1&&(e.position=e.firstTabInLine,y(e,"tab characters must not be used in indentation")),r=e.input.charCodeAt(e.position+1),s=e.line,(k===63||k===58)&&P(r))k===63?(C&&(Ee(e,p,g,_,w,null,a,o,l),_=w=E=null),U=!0,C=!0,n=!0):C?(C=!1,n=!0):y(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,k=r;else{if(a=e.line,o=e.lineStart,l=e.position,!Se(e,t,Wr,!1,!0))break;if(e.line===s){for(k=e.input.charCodeAt(e.position);ge(k);)k=e.input.charCodeAt(++e.position);if(k===58)k=e.input.charCodeAt(++e.position),P(k)||y(e,"a whitespace character is expected after the key-value separator within a block mapping"),C&&(Ee(e,p,g,_,w,null,a,o,l),_=w=E=null),U=!0,C=!1,n=!1,_=e.tag,w=e.result;else if(U)y(e,"can not read an implicit mapping pair; a colon is missed");else return e.tag=h,e.anchor=m,!0}else if(U)y(e,"can not read a block mapping entry; a multiline key may not be an implicit key");else return e.tag=h,e.anchor=m,!0}if((e.line===s||e.lineIndent>i)&&(C&&(a=e.line,o=e.lineStart,l=e.position),Se(e,i,at,!0,n)&&(C?w=e.result:E=e.result),C||(Ee(e,p,g,_,w,E,a,o,l),_=w=E=null),A(e,!0,-1),k=e.input.charCodeAt(e.position)),(e.line===s||e.lineIndent>i)&&k!==0)y(e,"bad indentation of a mapping entry");else if(e.lineIndent<i)break}return C&&Ee(e,p,g,_,w,null,a,o,l),U&&(e.tag=h,e.anchor=m,e.kind="mapping",e.result=p),U}function Fs(e){var i,t=!1,r=!1,n,s,a;if(a=e.input.charCodeAt(e.position),a!==33)return!1;if(e.tag!==null&&y(e,"duplication of a tag property"),a=e.input.charCodeAt(++e.position),a===60?(t=!0,a=e.input.charCodeAt(++e.position)):a===33?(r=!0,n="!!",a=e.input.charCodeAt(++e.position)):n="!",i=e.position,t){do a=e.input.charCodeAt(++e.position);while(a!==0&&a!==62);e.position<e.length?(s=e.input.slice(i,e.position),a=e.input.charCodeAt(++e.position)):y(e,"unexpected end of the stream within a verbatim tag")}else{for(;a!==0&&!P(a);)a===33&&(r?y(e,"tag suffix cannot contain exclamation marks"):(n=e.input.slice(i-1,e.position+1),Gr.test(n)||y(e,"named tag handle cannot contain such characters"),r=!0,i=e.position+1)),a=e.input.charCodeAt(++e.position);s=e.input.slice(i,e.position),xs.test(s)&&y(e,"tag suffix cannot contain flow indicator characters")}s&&!Yr.test(s)&&y(e,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{y(e,"tag name is malformed: "+s)}return t?e.tag=s:se.call(e.tagMap,n)?e.tag=e.tagMap[n]+s:n==="!"?e.tag="!"+s:n==="!!"?e.tag="tag:yaml.org,2002:"+s:y(e,'undeclared tag handle "'+n+'"'),!0}function Is(e){var i,t;if(t=e.input.charCodeAt(e.position),t!==38)return!1;for(e.anchor!==null&&y(e,"duplication of an anchor property"),t=e.input.charCodeAt(++e.position),i=e.position;t!==0&&!P(t)&&!ke(t);)t=e.input.charCodeAt(++e.position);return e.position===i&&y(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(i,e.position),!0}function Ps(e){var i,t,r;if(r=e.input.charCodeAt(e.position),r!==42)return!1;for(r=e.input.charCodeAt(++e.position),i=e.position;r!==0&&!P(r)&&!ke(r);)r=e.input.charCodeAt(++e.position);return e.position===i&&y(e,"name of an alias node must contain at least one character"),t=e.input.slice(i,e.position),se.call(e.anchorMap,t)||y(e,'unidentified alias "'+t+'"'),e.result=e.anchorMap[t],A(e,!0,-1),!0}function Se(e,i,t,r,n){var s,a,o,l=1,h=!1,m=!1,p,g,_,w,E,C;if(e.listener!==null&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,s=a=o=at===t||Br===t,r&&A(e,!0,-1)&&(h=!0,e.lineIndent>i?l=1:e.lineIndent===i?l=0:e.lineIndent<i&&(l=-1)),l===1)for(;Fs(e)||Is(e);)A(e,!0,-1)?(h=!0,o=s,e.lineIndent>i?l=1:e.lineIndent===i?l=0:e.lineIndent<i&&(l=-1)):o=!1;if(o&&(o=h||n),(l===1||at===t)&&(st===t||Wr===t?E=i:E=i+1,C=e.position-e.lineStart,l===1?o&&(Tr(e,C)||Os(e,C,E))||Ns(e,E)?m=!0:(a&&Ds(e,E)||Ts(e,E)||Ls(e,E)?m=!0:Ps(e)?(m=!0,(e.tag!==null||e.anchor!==null)&&y(e,"alias node should not have any properties")):As(e,E,st===t)&&(m=!0,e.tag===null&&(e.tag="?")),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):l===0&&(m=o&&Tr(e,C))),e.tag===null)e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);else if(e.tag==="?"){for(e.result!==null&&e.kind!=="scalar"&&y(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),p=0,g=e.implicitTypes.length;p<g;p+=1)if(w=e.implicitTypes[p],w.resolve(e.result)){e.result=w.construct(e.result),e.tag=w.tag,e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);break}}else if(e.tag!=="!"){if(se.call(e.typeMap[e.kind||"fallback"],e.tag))w=e.typeMap[e.kind||"fallback"][e.tag];else for(w=null,_=e.typeMap.multi[e.kind||"fallback"],p=0,g=_.length;p<g;p+=1)if(e.tag.slice(0,_[p].tag.length)===_[p].tag){w=_[p];break}w||y(e,"unknown tag !<"+e.tag+">"),e.result!==null&&w.kind!==e.kind&&y(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+w.kind+'", not "'+e.kind+'"'),w.resolve(e.result,e.tag)?(e.result=w.construct(e.result,e.tag),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):y(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return e.listener!==null&&e.listener("close",e),e.tag!==null||e.anchor!==null||m}function Hs(e){var i=e.position,t,r,n,s=!1,a;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);(a=e.input.charCodeAt(e.position))!==0&&(A(e,!0,-1),a=e.input.charCodeAt(e.position),!(e.lineIndent>0||a!==37));){for(s=!0,a=e.input.charCodeAt(++e.position),t=e.position;a!==0&&!P(a);)a=e.input.charCodeAt(++e.position);for(r=e.input.slice(t,e.position),n=[],r.length<1&&y(e,"directive name must not be less than one character in length");a!==0;){for(;ge(a);)a=e.input.charCodeAt(++e.position);if(a===35){do a=e.input.charCodeAt(++e.position);while(a!==0&&!G(a));break}if(G(a))break;for(t=e.position;a!==0&&!P(a);)a=e.input.charCodeAt(++e.position);n.push(e.input.slice(t,e.position))}a!==0&&Ht(e),se.call(Cr,r)?Cr[r](e,r,n):ot(e,'unknown document directive "'+r+'"')}if(A(e,!0,-1),e.lineIndent===0&&e.input.charCodeAt(e.position)===45&&e.input.charCodeAt(e.position+1)===45&&e.input.charCodeAt(e.position+2)===45?(e.position+=3,A(e,!0,-1)):s&&y(e,"directives end mark is expected"),Se(e,e.lineIndent-1,at,!1,!0),A(e,!0,-1),e.checkLineBreaks&&$s.test(e.input.slice(i,e.position))&&ot(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&dt(e)){e.input.charCodeAt(e.position)===46&&(e.position+=3,A(e,!0,-1));return}if(e.position<e.length-1)y(e,"end of the stream or a document separator is expected");else return}function Qr(e,i){e=String(e),i=i||{},e.length!==0&&(e.charCodeAt(e.length-1)!==10&&e.charCodeAt(e.length-1)!==13&&(e+=`
`),e.charCodeAt(0)===65279&&(e=e.slice(1)));var t=new Cs(e,i),r=e.indexOf("\0");for(r!==-1&&(t.position=r,y(t,"null byte is not allowed in input")),t.input+="\0";t.input.charCodeAt(t.position)===32;)t.lineIndent+=1,t.position+=1;for(;t.position<t.length-1;)Hs(t);return t.documents}function Ms(e,i,t){i!==null&&typeof i=="object"&&typeof t>"u"&&(t=i,i=null);var r=Qr(e,t);if(typeof i!="function")return r;for(var n=0,s=r.length;n<s;n+=1)i(r[n])}function Rs(e,i){var t=Qr(e,i);if(t.length!==0){if(t.length===1)return t[0];throw new I("expected a single document in the stream, but found more")}}var js=Ms,Us=Rs,Xr={loadAll:js,load:Us},Zr=Object.prototype.toString,ei=Object.prototype.hasOwnProperty,Rt=65279,zs=9,Me=10,Ws=13,Bs=32,Gs=33,Ys=34,Dt=35,qs=37,Ks=38,Vs=39,Js=42,ti=44,Qs=45,lt=58,Xs=61,Zs=62,ea=63,ta=64,ri=91,ii=93,ra=96,ni=123,ia=124,si=125,O={};O[0]="\\0";O[7]="\\a";O[8]="\\b";O[9]="\\t";O[10]="\\n";O[11]="\\v";O[12]="\\f";O[13]="\\r";O[27]="\\e";O[34]='\\"';O[92]="\\\\";O[133]="\\N";O[160]="\\_";O[8232]="\\L";O[8233]="\\P";var na=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],sa=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function aa(e,i){var t,r,n,s,a,o,l;if(i===null)return{};for(t={},r=Object.keys(i),n=0,s=r.length;n<s;n+=1)a=r[n],o=String(i[a]),a.slice(0,2)==="!!"&&(a="tag:yaml.org,2002:"+a.slice(2)),l=e.compiledTypeMap.fallback[a],l&&ei.call(l.styleAliases,o)&&(o=l.styleAliases[o]),t[a]=o;return t}function oa(e){var i,t,r;if(i=e.toString(16).toUpperCase(),e<=255)t="x",r=2;else if(e<=65535)t="u",r=4;else if(e<=4294967295)t="U",r=8;else throw new I("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+t+T.repeat("0",r-i.length)+i}var la=1,Re=2;function ua(e){this.schema=e.schema||zr,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=T.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=aa(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType=e.quotingType==='"'?Re:la,this.forceQuotes=e.forceQuotes||!1,this.replacer=typeof e.replacer=="function"?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Lr(e,i){for(var t=T.repeat(" ",i),r=0,n=-1,s="",a,o=e.length;r<o;)n=e.indexOf(`
`,r),n===-1?(a=e.slice(r),r=o):(a=e.slice(r,n+1),r=n+1),a.length&&a!==`
`&&(s+=t),s+=a;return s}function Ot(e,i){return`
`+T.repeat(" ",e.indent*i)}function da(e,i){var t,r,n;for(t=0,r=e.implicitTypes.length;t<r;t+=1)if(n=e.implicitTypes[t],n.resolve(i))return!0;return!1}function ut(e){return e===Bs||e===zs}function je(e){return 32<=e&&e<=126||161<=e&&e<=55295&&e!==8232&&e!==8233||57344<=e&&e<=65533&&e!==Rt||65536<=e&&e<=1114111}function Nr(e){return je(e)&&e!==Rt&&e!==Ws&&e!==Me}function Dr(e,i,t){var r=Nr(e),n=r&&!ut(e);return(t?r:r&&e!==ti&&e!==ri&&e!==ii&&e!==ni&&e!==si)&&e!==Dt&&!(i===lt&&!n)||Nr(i)&&!ut(i)&&e===Dt||i===lt&&n}function ca(e){return je(e)&&e!==Rt&&!ut(e)&&e!==Qs&&e!==ea&&e!==lt&&e!==ti&&e!==ri&&e!==ii&&e!==ni&&e!==si&&e!==Dt&&e!==Ks&&e!==Js&&e!==Gs&&e!==ia&&e!==Xs&&e!==Zs&&e!==Vs&&e!==Ys&&e!==qs&&e!==ta&&e!==ra}function ha(e){return!ut(e)&&e!==lt}function Pe(e,i){var t=e.charCodeAt(i),r;return t>=55296&&t<=56319&&i+1<e.length&&(r=e.charCodeAt(i+1),r>=56320&&r<=57343)?(t-55296)*1024+r-56320+65536:t}function ai(e){var i=/^\n* /;return i.test(e)}var oi=1,Ft=2,li=3,ui=4,we=5;function pa(e,i,t,r,n,s,a,o){var l,h=0,m=null,p=!1,g=!1,_=r!==-1,w=-1,E=ca(Pe(e,0))&&ha(Pe(e,e.length-1));if(i||a)for(l=0;l<e.length;h>=65536?l+=2:l++){if(h=Pe(e,l),!je(h))return we;E=E&&Dr(h,m,o),m=h}else{for(l=0;l<e.length;h>=65536?l+=2:l++){if(h=Pe(e,l),h===Me)p=!0,_&&(g=g||l-w-1>r&&e[w+1]!==" ",w=l);else if(!je(h))return we;E=E&&Dr(h,m,o),m=h}g=g||_&&l-w-1>r&&e[w+1]!==" "}return!p&&!g?E&&!a&&!n(e)?oi:s===Re?we:Ft:t>9&&ai(e)?we:a?s===Re?we:Ft:g?ui:li}function ma(e,i,t,r,n){e.dump=(function(){if(i.length===0)return e.quotingType===Re?'""':"''";if(!e.noCompatMode&&(na.indexOf(i)!==-1||sa.test(i)))return e.quotingType===Re?'"'+i+'"':"'"+i+"'";var s=e.indent*Math.max(1,t),a=e.lineWidth===-1?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-s),o=r||e.flowLevel>-1&&t>=e.flowLevel;function l(h){return da(e,h)}switch(pa(i,o,e.indent,a,l,e.quotingType,e.forceQuotes&&!r,n)){case oi:return i;case Ft:return"'"+i.replace(/'/g,"''")+"'";case li:return"|"+Or(i,e.indent)+Fr(Lr(i,s));case ui:return">"+Or(i,e.indent)+Fr(Lr(fa(i,a),s));case we:return'"'+ga(i)+'"';default:throw new I("impossible error: invalid scalar style")}})()}function Or(e,i){var t=ai(e)?String(i):"",r=e[e.length-1]===`
`,n=r&&(e[e.length-2]===`
`||e===`
`),s=n?"+":r?"":"-";return t+s+`
`}function Fr(e){return e[e.length-1]===`
`?e.slice(0,-1):e}function fa(e,i){for(var t=/(\n+)([^\n]*)/g,r=(function(){var h=e.indexOf(`
`);return h=h!==-1?h:e.length,t.lastIndex=h,Ir(e.slice(0,h),i)})(),n=e[0]===`
`||e[0]===" ",s,a;a=t.exec(e);){var o=a[1],l=a[2];s=l[0]===" ",r+=o+(!n&&!s&&l!==""?`
`:"")+Ir(l,i),n=s}return r}function Ir(e,i){if(e===""||e[0]===" ")return e;for(var t=/ [^ ]/g,r,n=0,s,a=0,o=0,l="";r=t.exec(e);)o=r.index,o-n>i&&(s=a>n?a:o,l+=`
`+e.slice(n,s),n=s+1),a=o;return l+=`
`,e.length-n>i&&a>n?l+=e.slice(n,a)+`
`+e.slice(a+1):l+=e.slice(n),l.slice(1)}function ga(e){for(var i="",t=0,r,n=0;n<e.length;t>=65536?n+=2:n++)t=Pe(e,n),r=O[t],!r&&je(t)?(i+=e[n],t>=65536&&(i+=e[n+1])):i+=r||oa(t);return i}function _a(e,i,t){var r="",n=e.tag,s,a,o;for(s=0,a=t.length;s<a;s+=1)o=t[s],e.replacer&&(o=e.replacer.call(t,String(s),o)),(V(e,i,o,!1,!1)||typeof o>"u"&&V(e,i,null,!1,!1))&&(r!==""&&(r+=","+(e.condenseFlow?"":" ")),r+=e.dump);e.tag=n,e.dump="["+r+"]"}function Pr(e,i,t,r){var n="",s=e.tag,a,o,l;for(a=0,o=t.length;a<o;a+=1)l=t[a],e.replacer&&(l=e.replacer.call(t,String(a),l)),(V(e,i+1,l,!0,!0,!1,!0)||typeof l>"u"&&V(e,i+1,null,!0,!0,!1,!0))&&((!r||n!=="")&&(n+=Ot(e,i)),e.dump&&Me===e.dump.charCodeAt(0)?n+="-":n+="- ",n+=e.dump);e.tag=s,e.dump=n||"[]"}function va(e,i,t){var r="",n=e.tag,s=Object.keys(t),a,o,l,h,m;for(a=0,o=s.length;a<o;a+=1)m="",r!==""&&(m+=", "),e.condenseFlow&&(m+='"'),l=s[a],h=t[l],e.replacer&&(h=e.replacer.call(t,l,h)),V(e,i,l,!1,!1)&&(e.dump.length>1024&&(m+="? "),m+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),V(e,i,h,!1,!1)&&(m+=e.dump,r+=m));e.tag=n,e.dump="{"+r+"}"}function ya(e,i,t,r){var n="",s=e.tag,a=Object.keys(t),o,l,h,m,p,g;if(e.sortKeys===!0)a.sort();else if(typeof e.sortKeys=="function")a.sort(e.sortKeys);else if(e.sortKeys)throw new I("sortKeys must be a boolean or a function");for(o=0,l=a.length;o<l;o+=1)g="",(!r||n!=="")&&(g+=Ot(e,i)),h=a[o],m=t[h],e.replacer&&(m=e.replacer.call(t,h,m)),V(e,i+1,h,!0,!0,!0)&&(p=e.tag!==null&&e.tag!=="?"||e.dump&&e.dump.length>1024,p&&(e.dump&&Me===e.dump.charCodeAt(0)?g+="?":g+="? "),g+=e.dump,p&&(g+=Ot(e,i)),V(e,i+1,m,!0,p)&&(e.dump&&Me===e.dump.charCodeAt(0)?g+=":":g+=": ",g+=e.dump,n+=g));e.tag=s,e.dump=n||"{}"}function Hr(e,i,t){var r,n,s,a,o,l;for(n=t?e.explicitTypes:e.implicitTypes,s=0,a=n.length;s<a;s+=1)if(o=n[s],(o.instanceOf||o.predicate)&&(!o.instanceOf||typeof i=="object"&&i instanceof o.instanceOf)&&(!o.predicate||o.predicate(i))){if(t?o.multi&&o.representName?e.tag=o.representName(i):e.tag=o.tag:e.tag="?",o.represent){if(l=e.styleMap[o.tag]||o.defaultStyle,Zr.call(o.represent)==="[object Function]")r=o.represent(i,l);else if(ei.call(o.represent,l))r=o.represent[l](i,l);else throw new I("!<"+o.tag+'> tag resolver accepts not "'+l+'" style');e.dump=r}return!0}return!1}function V(e,i,t,r,n,s,a){e.tag=null,e.dump=t,Hr(e,t,!1)||Hr(e,t,!0);var o=Zr.call(e.dump),l=r,h;r&&(r=e.flowLevel<0||e.flowLevel>i);var m=o==="[object Object]"||o==="[object Array]",p,g;if(m&&(p=e.duplicates.indexOf(t),g=p!==-1),(e.tag!==null&&e.tag!=="?"||g||e.indent!==2&&i>0)&&(n=!1),g&&e.usedDuplicates[p])e.dump="*ref_"+p;else{if(m&&g&&!e.usedDuplicates[p]&&(e.usedDuplicates[p]=!0),o==="[object Object]")r&&Object.keys(e.dump).length!==0?(ya(e,i,e.dump,n),g&&(e.dump="&ref_"+p+e.dump)):(va(e,i,e.dump),g&&(e.dump="&ref_"+p+" "+e.dump));else if(o==="[object Array]")r&&e.dump.length!==0?(e.noArrayIndent&&!a&&i>0?Pr(e,i-1,e.dump,n):Pr(e,i,e.dump,n),g&&(e.dump="&ref_"+p+e.dump)):(_a(e,i,e.dump),g&&(e.dump="&ref_"+p+" "+e.dump));else if(o==="[object String]")e.tag!=="?"&&ma(e,e.dump,i,s,l);else{if(o==="[object Undefined]")return!1;if(e.skipInvalid)return!1;throw new I("unacceptable kind of an object to dump "+o)}e.tag!==null&&e.tag!=="?"&&(h=encodeURI(e.tag[0]==="!"?e.tag.slice(1):e.tag).replace(/!/g,"%21"),e.tag[0]==="!"?h="!"+h:h.slice(0,18)==="tag:yaml.org,2002:"?h="!!"+h.slice(18):h="!<"+h+">",e.dump=h+" "+e.dump)}return!0}function ba(e,i){var t=[],r=[],n,s;for(It(e,t,r),n=0,s=r.length;n<s;n+=1)i.duplicates.push(t[r[n]]);i.usedDuplicates=new Array(s)}function It(e,i,t){var r,n,s;if(e!==null&&typeof e=="object")if(n=i.indexOf(e),n!==-1)t.indexOf(n)===-1&&t.push(n);else if(i.push(e),Array.isArray(e))for(n=0,s=e.length;n<s;n+=1)It(e[n],i,t);else for(r=Object.keys(e),n=0,s=r.length;n<s;n+=1)It(e[r[n]],i,t)}function $a(e,i){i=i||{};var t=new ua(i);t.noRefs||ba(e,t);var r=e;return t.replacer&&(r=t.replacer.call({"":r},"",r)),V(t,0,r,!0,!0)?t.dump+`
`:""}var xa=$a,wa={dump:xa};function jt(e,i){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+i+" instead, which is now safe by default.")}}var di=Xr.load,Bo=Xr.loadAll,ct=wa.dump;var Go=jt("safeLoad","load"),Yo=jt("safeLoadAll","loadAll"),qo=jt("safeDump","dump");var Y=class extends b{constructor(){super(...arguments);this.value=null;this._mode="form";this._yamlText="";this._yamlError=null}willUpdate(t){super.willUpdate?.(t),t.has("value")&&this._mode==="form"&&(this._yamlText=ct(this.value??{}))}connectedCallback(){super.connectedCallback(),this._yamlText=ct(this.value??{});let t=this.value&&typeof this.value=="object"?this.value.script:null,r=this._fieldsFor(t);t&&(!r||Object.keys(r).length===0)&&(this._mode="yaml")}_setMode(t){t==="form"&&this._yamlError!==null||(t==="yaml"&&(this._yamlText=ct(this.value??{})),this._mode=t)}_onYamlInput(t){this._yamlText=t;let r;try{r=di(t)}catch(o){this._yamlError=o.message;return}if(r==null){this._yamlError=null,this._emit(null);return}if(typeof r!="object"||Array.isArray(r)){this._yamlError="Expected an object";return}let n=r,s=n.script;if(typeof s!="string"||!s.startsWith("script.")){this._yamlError="`script` must be a 'script.<name>' string";return}let a=n.args;if(a!==void 0&&(typeof a!="object"||Array.isArray(a)||a===null)){this._yamlError="`args` must be an object if present";return}this._yamlError=null,this._emit({script:s,args:a??{}})}_emit(t){this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_scriptIds(){let t=this.hass?.services;return Object.keys(t?.script??{}).sort().map(n=>`script.${n}`)}_label(t){let n=this.hass?.states?.[t]?.attributes?.friendly_name;return typeof n=="string"&&n?n:t}_fieldsFor(t){if(!t)return;let r=t.replace(/^script\./,"");return this.hass?.services?.script?.[r]?.fields}_defaultArgs(t){let r=this._fieldsFor(t)??{},n={};for(let[s,a]of Object.entries(r))a&&Object.prototype.hasOwnProperty.call(a,"default")&&(n[s]=a.default);return n}_pickerSchema(){return[{name:"script",selector:{select:{mode:"dropdown",options:this._scriptIds().map(t=>({value:t,label:this._label(t)}))}}}]}_pickScript(t){if(!t){this._emit(null);return}this._emit({script:t,args:this._defaultArgs(t)})}_argsSchema(){let t=this._fieldsFor(this.value&&typeof this.value=="object"?this.value.script:null);return t?Object.entries(t).map(([r,n])=>({name:r,required:n.required,description:n.description?{suffix:n.description}:void 0,selector:n.selector??{text:{}}})):[]}_updateArgs(t){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:t})}render(){let t=this.value&&typeof this.value=="object"?this.value.script:null,r=this._argsSchema(),n=(this.value&&typeof this.value=="object"?this.value.args:{})??{},s=r.length>0;return u`
      <div class="section">
        <h4>${d(this.hass,"ui.script","Script")}</h4>
        ${this._renderPicker(t)}
      </div>
      ${t?u`
        <div class="tabs">
          <button
            type="button"
            ?disabled=${!s||this._yamlError!==null}
            title=${this._yamlError??""}
            class=${this._mode==="form"?"active":""}
            @click=${()=>this._setMode("form")}
          >${d(this.hass,"ui.form","Form")}</button>
          <button
            type="button"
            class=${this._mode==="yaml"?"active":""}
            @click=${()=>this._setMode("yaml")}
          >${d(this.hass,"ui.yaml","YAML")}</button>
        </div>
      `:""}
      ${t&&this._mode==="form"&&s?u`
        <div class="section args">
          <h4>${d(this.hass,"ui.arguments","Arguments")}</h4>
          ${this._renderArgs(r,n)}
        </div>
      `:""}
      ${t&&this._mode==="yaml"?this._renderYaml():""}
    `}_renderYaml(){let t=r=>{let n=r.target.value??r.detail?.value??"";this._onYamlInput(n)};return customElements.get("ha-code-editor")?u`
        <ha-code-editor mode="yaml" .value=${this._yamlText} @value-changed=${t}></ha-code-editor>
        ${this._yamlError?u`<div class="error">${this._yamlError}</div>`:""}
      `:u`
      <textarea
        rows="6"
        style="width:100%;font-family:monospace;"
        .value=${this._yamlText}
        @input=${t}
      ></textarea>
      ${this._yamlError?u`<div class="error">${this._yamlError}</div>`:""}
    `}_renderArgs(t,r){return customElements.get("ha-form")?u`<ha-form
        .hass=${this.hass}
        .schema=${t}
        .data=${r}
        @value-changed=${n=>{n.stopPropagation(),this._updateArgs(n.detail.value)}}
      ></ha-form>`:u`${t.map(n=>{let s=r[n.name];return u`
        <label style="display:block;margin-bottom:0.4rem;">
          <span style="display:inline-block;min-width:8em;">${n.name}</span>
          <input
            .value=${s==null?"":String(s)}
            @change=${a=>{let o=a.target.value,l={...r,[n.name]:o};this._updateArgs(l)}}
          />
        </label>
      `})}`}_renderPicker(t){return customElements.get("ha-form")?u`<ha-form
        .hass=${this.hass}
        .schema=${this._pickerSchema()}
        .data=${{script:t??""}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._pickScript(r.detail.value.script||null)}}
      ></ha-form>`:u`<select
      @change=${r=>this._pickScript(r.target.value||null)}>
      <option value="" ?selected=${!t}>(none)</option>
      ${this._scriptIds().map(r=>u`<option value=${r} ?selected=${r===t}>${this._label(r)}</option>`)}
    </select>`}};Y.styles=$`
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
  `,c([f({attribute:!1})],Y.prototype,"hass",2),c([f({attribute:!1})],Y.prototype,"value",2),c([v()],Y.prototype,"_mode",2),c([v()],Y.prototype,"_yamlText",2),c([v()],Y.prototype,"_yamlError",2),Y=c([x("ambience-script-predicate-input")],Y);var ka=["dawn","sunrise","noon","sunset","dusk","midnight"],_e=class extends b{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(t){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_onKindChange(t){let r=t.target.value;r!==this.value.kind&&(r==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(t){if(this.value.kind!=="time")return;let r=t.target.value,[n,s]=r.split(":").map(a=>parseInt(a,10));Number.isNaN(n)||Number.isNaN(s)||this._emit({kind:"time",hh:n,mm:s})}_onAnchorChange(t){if(this.value.kind!=="sun")return;let r=t.target.value;this._emit({kind:"sun",anchor:r,offset_min:this.value.offset_min})}_onOffsetChange(t){if(this.value.kind!=="sun")return;let r=parseInt(t.target.value,10);Number.isNaN(r)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:r})}_renderTime(t){let r=`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;return u`<input type="time" .value=${r} @input=${this._onTimeChange} />`}_renderSun(t){let r=Ea(t.offset_min,this.hass);return u`
      <select @change=${this._onAnchorChange}>
        ${ka.map(n=>u`<option value=${n} ?selected=${n===t.anchor}>${$e(this.hass,n)}</option>`)}
      </select>
      <input
        type="number"
        step="1"
        placeholder=${d(this.hass,"ui.offset_placeholder","\xB1min, e.g. -30")}
        .value=${String(t.offset_min)}
        @input=${this._onOffsetChange}
      />
      <span class="offset-hint">${r}</span>
    `}render(){return u`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>${d(this.hass,"ui.endpoint_time","Time")}</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>${d(this.hass,"ui.endpoint_sun","Sun")}</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};_e.styles=$`
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
  `,c([f({attribute:!1})],_e.prototype,"hass",2),c([f({attribute:!1})],_e.prototype,"value",2),_e=c([x("ambience-time-endpoint")],_e);function Ea(e,i){if(e===0)return"";let t=Math.abs(e),r=e<0?"\u2212":"+";if(t%60===0){let n=t/60,s=n===1?d(i,"ui.unit_hour","hour"):d(i,"ui.unit_hours","hours");return`${r}${n} ${s}`}return`${r}${t} ${d(i,"ui.unit_min","min")}`}var Ue={kind:"any"},ci={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},q=class extends b{constructor(){super(...arguments);this.value=null;this._entries=[Ue];this._openIdx=0}willUpdate(t){t.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[Ue]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(r=>{let n=this._entries[this._openIdx];if(!n)return;let s=n.kind==="any"?"__any__":n.kind==="range"?"__custom__":n.period;r.value!==s&&(r.value=s)})}_predicateToEntries(t){return t===null?[Ue]:(Array.isArray(t)?t:[t]).map(n=>"period"in n?{kind:"period",period:n.period}:{kind:"range",from:n.from,to:n.to})}_emit(t){let r=t.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),n=r.length===0?null:r.length===1?r[0]:r;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:n},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let t=Object.keys(this.periods.builtins),r=Object.keys(this.periods.custom).filter(s=>!(s in this.periods.builtins)),n=new Set(this.periods.hidden);return[...t.filter(s=>!n.has(s)),...r]}_onSelectChange(t,r){let n=r.target.value,s=[...this._entries];n==="__any__"?s[t]=Ue:n==="__custom__"?s[t]={kind:"range",...ci}:s[t]={kind:"period",period:n},this._entries=s,this._emit(s)}_onRangeChange(t,r,n){n.stopPropagation();let s=this._entries[t];if(!s||s.kind!=="range")return;let a=[...this._entries];a[t]={...s,[r]:n.detail.value},this._entries=a,this._emit(a)}_onRemove(t){let r=this._entries.filter((n,s)=>s!==t);this._entries=r.length===0?[Ue]:r,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):t<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let t=[...this._entries,{kind:"range",...ci}];this._entries=t,this._openIdx=t.length-1,this._emit(t)}_onChipClick(t){this._openIdx=t}_renderChip(t,r){let n;return t.kind==="any"?n=d(this.hass,"ui.any_placeholder","(any)"):t.kind==="period"?n=nt({period:t.period},{hass:this.hass,periods:this.periods}):n=nt({from:t.from,to:t.to},{hass:this.hass,periods:this.periods}),u`
      <div class="summary-chip" @click=${()=>this._onChipClick(r)}>
        <span class="chip-label">${n}</span>
        ${this._entries.length>1?u`<button class="remove" @click=${s=>{s.stopPropagation(),this._onRemove(r)}} title=${d(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(t,r,n){let s=this._effectiveIds(),a=this.periods?.custom??{};return u`
      <div class="entry">
        <div class="entry-header">
          <select @change=${o=>this._onSelectChange(r,o)}>
            ${n?u`<option value="__any__">${d(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${d(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${s.map(o=>u`<option value=${o}>
                ${me(this.hass,o,a)}${a[o]&&!this.periods?.builtins[o]?d(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?u`<button class="remove" @click=${()=>this._onRemove(r)} title=${d(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${t.kind==="range"?u`
              <div class="range-row">
                <label>${d(this.hass,"ui.from_label","From")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${t.from}
                  @value-changed=${o=>this._onRangeChange(r,"from",o)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${d(this.hass,"ui.to_label","To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${t.to}
                  @value-changed=${o=>this._onRangeChange(r,"to",o)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let t=this._entries.some(n=>n.kind!=="any"),r=this._entries.length>1;return u`
      ${this._entries.map((n,s)=>r&&s!==this._openIdx?this._renderChip(n,s):this._renderEntry(n,s,s===0))}
      ${t?u`<button class="add-btn" @click=${this._onAdd}>${d(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};q.styles=$`
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
  `,c([f({attribute:!1})],q.prototype,"value",2),c([f({attribute:!1})],q.prototype,"periods",2),c([f({attribute:!1})],q.prototype,"hass",2),c([v()],q.prototype,"_entries",2),c([v()],q.prototype,"_openIdx",2),q=c([x("ambience-time-of-day-input")],q);function hi(e){if(typeof e!="string")return!1;let i=e.split(",").map(t=>t.trim()).filter(t=>t!=="");if(i.length===0)return!1;for(let t of i)if(t.includes("-")){let r=t.split("-").map(a=>a.trim());if(r.length!==2||!/^\d+$/.test(r[0])||!/^\d+$/.test(r[1]))return!1;let n=Number(r[0]),s=Number(r[1]);if(!(n>=1&&n<=s&&s<=31))return!1}else{if(!/^\d+$/.test(t))return!1;let r=Number(t);if(!(r>=1&&r<=31))return!1}return!0}var Ut=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Sa=new Set(["workday","holiday"]),Ca=new Set(["first_workday","last_workday"]),Aa=[31,29,31,30,31,30,31,31,30,31,30,31];function ze(e){return Aa[e-1]??31}function zt(e){switch(e){case"weekday":return{kind:e,days:[]};case"day_of_month":return{kind:e,days:""};case"date":return{kind:e,month:1,day:1};case"date_range":return{kind:e,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:e}}}var ae=class extends b{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=t=>t.name==="days"?d(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=t=>{switch(t.name){case"kind":return d(this.hass,"ui.field_kind","Kind");case"days":return d(this.hass,"ui.field_days_of_month","Days of month");case"month":return d(this.hass,"ui.field_month","Month");case"day":return d(this.hass,"ui.field_day","Day");case"from_month":return d(this.hass,"ui.field_from_month","From month");case"from_day":return d(this.hass,"ui.field_from_day","From day");case"to_month":return d(this.hass,"ui.field_to_month","To month");case"to_day":return d(this.hass,"ui.field_to_day","To day");default:return t.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(t){let r=t.include.length===0&&t.exclude.length===0;this.value=r?null:t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_addItem(t,r){let n=this._current();n[t]=[...n[t],zt(r)],this._emit(n)}_removeItem(t,r){let n=this._current();n[t]=n[t].filter((s,a)=>a!==r),this._emit(n)}_updateItem(t,r,n){let s=this._current();s[t]=s[t].map((a,o)=>o===r?n:a),this._emit(s)}_kindDisabled(t){return!!(Sa.has(t)&&!this.dayConfig.workday_sensor||Ca.has(t)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:Ut.map(t=>({value:t,label:Je(this.hass,t),disabled:this._kindDisabled(t)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(t=>({value:String(t),label:xe(this.hass,t)}))}}}_daySelector(t){return{number:{min:1,max:ze(t),mode:"box"}}}_bodySchema(t){return t.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(t){return t.kind==="day_of_month"?{days:t.days}:{}}_bodyPatch(t,r){return t.kind==="day_of_month"?{kind:"day_of_month",days:String(r.days??"")}:t}_setDatePart(t,r,n){let s=Number(n);if(!Number.isFinite(s)||s<1)return t;if(t.kind==="date"){let{month:a,day:o}=t;return r==="month"&&(a=s),r==="day"&&(o=s),{kind:"date",month:a,day:Math.min(o,ze(a))}}if(t.kind==="date_range"){let a={...t.from},o={...t.to};return r==="from_month"&&(a.month=s),r==="from_day"&&(a.day=s),r==="to_month"&&(o.month=s),r==="to_day"&&(o.day=s),a.day=Math.min(a.day,ze(a.month)),o.day=Math.min(o.day,ze(o.month)),{kind:"date_range",from:a,to:o}}return t}_onKindForm(t,r,n){let s=n.kind;if(!s){this._removeItem(t,r);return}if(this._kindDisabled(s))return;let a=this._current()[t][r];a&&a.kind===s||this._updateItem(t,r,zt(s))}_dayOfMonthError(t){return t.trim()===""||hi(t)?null:d(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(t,r,n,s){this._updateItem(t,r,this._bodyPatch(n,s))}_renderWeekday(t,r,n){return u`${[0,1,2,3,4,5,6].map(s=>u`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${n.days.includes(s)}
          @change=${a=>{let l=a.target.checked?[...n.days,s].sort((h,m)=>h-m):n.days.filter(h=>h!==s);this._updateItem(t,r,{kind:"weekday",days:l})}}
        />${Ve(this.hass,s)}
      </label>
    `)}`}_renderKindPicker(t,r,n){return customElements.get("ha-form")?u`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:n.kind}}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${s=>{s.stopPropagation(),this._onKindForm(t,r,s.detail.value)}}
      ></ha-form>`:u`
      <select
        class="kind"
        .value=${n.kind}
        @change=${s=>{let a=s.target.value;this._kindDisabled(a)||a===n.kind||this._updateItem(t,r,zt(a))}}
      >
        ${Ut.map(s=>u`<option value=${s} ?disabled=${this._kindDisabled(s)}>${Je(this.hass,s)}</option>`)}
      </select>
    `}_renderItemBody(t,r,n){if(n.kind==="weekday")return this._renderWeekday(t,r,n);if(customElements.get("ha-form")){if(n.kind==="date")return this._renderDateRow(t,r,n,"month","day",n.month,n.day);if(n.kind==="date_range")return u`
          ${this._renderDateRow(t,r,n,"from_month","from_day",n.from.month,n.from.day)}
          ${this._renderDateRow(t,r,n,"to_month","to_day",n.to.month,n.to.day)}
        `;let s=this._bodySchema(n);if(!s)return u``;let a=n.kind==="day_of_month"?this._dayOfMonthError(n.days):null;return u`<ha-form
        .hass=${this.hass}
        .schema=${s}
        .data=${this._bodyData(n)}
        .error=${a?{days:a}:void 0}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${o=>{o.stopPropagation(),this._onBodyForm(t,r,n,o.detail.value)}}
      ></ha-form>`}return this._renderNativeBody(t,r,n)}_renderDateRow(t,r,n,s,a,o,l){let h=(m,p)=>{this._updateItem(t,r,this._setDatePart(n,m,p[m]))};return u`
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
    `}_renderNativeBody(t,r,n){if(n.kind==="day_of_month"){let o=this._dayOfMonthError(n.days);return u`<input
        type="text" placeholder=${d(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${n.days}
        @change=${l=>this._updateItem(t,r,this._bodyPatch(n,{days:l.target.value}))}
      />${o?u`<div class="field-error">${o}</div>`:""}`}let s=(o,l)=>u`
      <input type="number" min="1" max="12" .value=${String(l)}
        @change=${h=>this._updateItem(t,r,this._setDatePart(n,o,h.target.value))} />
    `,a=(o,l,h)=>u`
      <input type="number" min="1" max=${String(ze(l))} .value=${String(h)}
        @change=${m=>this._updateItem(t,r,this._setDatePart(n,o,m.target.value))} />
    `;return n.kind==="date"?u`${s("month",n.month)} / ${a("day",n.month,n.day)}`:n.kind==="date_range"?u`
        <span>${d(this.hass,"ui.from","from")}</span>
        ${s("from_month",n.from.month)} / ${a("from_day",n.from.month,n.from.day)}
        <span>${d(this.hass,"ui.to","to")}</span>
        ${s("to_month",n.to.month)} / ${a("to_day",n.to.month,n.to.day)}
      `:u``}_renderAddPicker(t){let r=t==="include"?d(this.hass,"ui.add_include_item","+ Add include item"):d(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let n=()=>r;return u`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${n}
        @value-changed=${s=>{s.stopPropagation();let a=s.detail.value.kind;a&&!this._kindDisabled(a)&&this._addItem(t,a)}}
      ></ha-form>`}return u`
      <select
        .value=${""}
        @change=${n=>{let s=n.target.value;s&&(this._addItem(t,s),n.target.value="")}}
      >
        <option value="">${r}</option>
        ${Ut.map(n=>u`<option value=${n} ?disabled=${this._kindDisabled(n)}>${Je(this.hass,n)}</option>`)}
      </select>
    `}_renderItem(t,r,n){return u`
      <div class="item">
        ${this._renderKindPicker(t,r,n)}
        <div class="body">${this._renderItemBody(t,r,n)}</div>
        <button class="remove" title=${d(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(t,r)}>✕</button>
      </div>
    `}_renderSection(t,r){return u`
      <div class="section">
        <h4>${t==="include"?d(this.hass,"ui.include","Include"):d(this.hass,"ui.exclude","Exclude")}</h4>
        ${r.length===0&&t==="include"?u`<div class="hint">${d(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${r.map((n,s)=>this._renderItem(t,s,n))}
        ${this._renderAddPicker(t)}
      </div>
    `}render(){let{include:t,exclude:r}=this._current();return u`
      ${this._renderSection("include",t)}
      ${this._renderSection("exclude",r)}
    `}};ae.styles=$`
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
  `,c([f({attribute:!1})],ae.prototype,"hass",2),c([f({attribute:!1})],ae.prototype,"value",2),c([f({attribute:!1})],ae.prototype,"dayConfig",2),ae=c([x("ambience-day-predicate-input")],ae);var pi=["temperature","apparent_temperature","humidity","wind_speed","pressure"],mi=["<","<=",">",">="],fi={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},J=class extends b{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(t){let r=t.groups.length===0&&t.thresholds.length===0;this.value=r?null:t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setGroups(t){this._emit({...this._current(),groups:t})}_addThreshold(){let t=this._current();t.thresholds=[...t.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(t)}_updateThreshold(t,r){let n=this._current();n.thresholds=n.thresholds.map((s,a)=>a===t?r:s),this._emit(n)}_removeThreshold(t){let r=this._current();r.thresholds=r.thresholds.filter((n,s)=>s!==t),this._emit(r)}_attributeSchema(t){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:pi.map(r=>({value:r,label:Ie(this.hass,r)}))}}}]}_opSchema(t){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:mi.map(r=>({value:r,label:fi[r]}))}}}]}_entityState(){let t=this.weatherEntity;return t?this.hass?.states?.[t]:void 0}_valueSchema(t,r){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:Et(this.hass,r,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(t=>({value:t.id,label:t.label}))}}}]}_renderGroups(t){return customElements.get("ha-form")?u`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{groups:t}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setGroups(r.detail.value.groups??[])}}
      ></ha-form>`:u`${this.groups.map(r=>u`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${t.includes(r.id)}
          @change=${n=>{let s=n.target.checked;this._setGroups(s?[...t,r.id]:t.filter(a=>a!==r.id))}} />${r.label}
      </label>`)}`}_renderAttributeSelect(t,r){return customElements.get("ha-form")?u`<ha-form
        class="attr-form"
        .hass=${this.hass}
        .schema=${this._attributeSchema(t)}
        .data=${{attribute:r.attribute}}
        .computeLabel=${()=>""}
        @value-changed=${n=>{n.stopPropagation();let s=n.detail.value.attribute;s&&this._updateThreshold(t,{...r,attribute:s})}}
      ></ha-form>`:u`<select
      @change=${n=>this._updateThreshold(t,{...r,attribute:n.target.value})}>
      ${pi.map(n=>u`<option value=${n} ?selected=${n===r.attribute}>${Ie(this.hass,n)}</option>`)}
    </select>`}_renderOpSelect(t,r){return customElements.get("ha-form")?u`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(t)}
        .data=${{op:r.op}}
        .computeLabel=${()=>""}
        @value-changed=${n=>{n.stopPropagation();let s=n.detail.value.op;s&&this._updateThreshold(t,{...r,op:s})}}
      ></ha-form>`:u`<select
      @change=${n=>this._updateThreshold(t,{...r,op:n.target.value})}>
      ${mi.map(n=>u`<option value=${n} ?selected=${n===r.op}>${fi[n]}</option>`)}
    </select>`}_renderValueInput(t,r){if(customElements.get("ha-form"))return u`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(t,r.attribute)}
        .data=${{value:r.value}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let a=s.detail.value.value;typeof a=="number"&&Number.isFinite(a)&&this._updateThreshold(t,{...r,value:a})}}
      ></ha-form>`;let n=Et(this.hass,r.attribute,this._entityState());return u`<span class="value-wrap">
      <input type="number" .value=${String(r.value)}
        @change=${s=>{let a=Number(s.target.value);Number.isFinite(a)&&this._updateThreshold(t,{...r,value:a})}} />
      <span class="unit">${n}</span>
    </span>`}_renderThreshold(t,r){return u`
      <div class="threshold">
        ${this._renderAttributeSelect(t,r)}
        ${this._renderOpSelect(t,r)}
        ${this._renderValueInput(t,r)}
        <button class="remove" title=${d(this.hass,"ui.remove","Remove")} @click=${()=>this._removeThreshold(t)}>✕</button>
      </div>
    `}render(){let{groups:t,thresholds:r}=this._current();return u`
      <div class="section">
        <h4>${d(this.hass,"ui.groups","Groups")}</h4>
        ${this._renderGroups(t)}
      </div>
      <div class="section">
        <h4>${d(this.hass,"ui.thresholds","Thresholds")}</h4>
        ${r.map((n,s)=>this._renderThreshold(s,n))}
        <button class="add" @click=${()=>this._addThreshold()}>${d(this.hass,"ui.add_threshold","+ Add threshold")}</button>
      </div>
    `}};J.styles=$`
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
  `,c([f({attribute:!1})],J.prototype,"hass",2),c([f({attribute:!1})],J.prototype,"value",2),c([f({attribute:!1})],J.prototype,"groups",2),c([f({attribute:!1})],J.prototype,"weatherEntity",2),J=c([x("ambience-weather-predicate-input")],J);var N=class extends b{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[]}async updated(t){if(t.has("value")){let n=t.get("value")?.entity_id,s=this.value.entity_id;if(s&&s!==n&&this.hass)try{let a=await _r(this.hass,s);this._knownStates=a.states}catch{this._knownStates=[]}}}_normalize(t){let r={...t};return r.attribute===""&&(r.attribute=null),r.for&&r.for.h===0&&r.for.m===0&&r.for.s===0&&(r.for=null),r}_emit(t){let r=this._normalize(t);this.value=r,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r},bubbles:!0,composed:!0}))}_autoFlipOp(t){let r=this._isNumericTargetFor(t),n=this._isNumericOp(t.kind);return r&&!n?{...t,kind:">"}:!r&&n?{...t,kind:"is"}:t}_setEntity(t){this._emit(this._autoFlipOp({...this.value,entity_id:t,states:[],attribute:null}))}_setAttribute(t){this._emit(this._autoFlipOp({...this.value,attribute:t}))}_setOp(t){this._emit({...this.value,kind:t})}_setStates(t){this._emit({...this.value,states:t})}_setValueAt(t,r){if(this._isNumericOp(this.value.kind)){this._setStates([r]);return}let n=this.value.states.slice();r===""?n.splice(t,1):n[t]=r,this._setStates(n)}_addValue(t){t&&this._setStates([...this.value.states,t])}_removeValueAt(t){let r=this.value.states.slice();r.splice(t,1),this._setStates(r)}_setForDuration(t){this._emit({...this.value,for:t})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(t){if(!t)return[];let n=this.hass?.states?.[t]?.attributes;return n?Object.keys(n).sort():[]}_attributeSchema(){let t=this._knownAttributesFor(this.value.entity_id);return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:N._STATE_SENTINEL,label:N._STATE_SENTINEL},...t.map(r=>({value:r,label:r}))]}}}]}_attributeData(){let t=this.value.attribute;return t?{attribute:t}:{attribute:N._STATE_SENTINEL}}_setAttributeFromHaForm(t){t===N._STATE_SENTINEL?this._setAttribute(""):this._setAttribute(t)}_isNumericOp(t){return N._NUMERIC_OPS.includes(t)}_isNumericTargetFor(t){let n=this.hass?.states?.[t.entity_id];if(!n)return!1;if(t.attribute)return typeof n.attributes?.[t.attribute]=="number";let s=n.state;return typeof s!="string"||s===""||s==="unknown"||s==="unavailable"?!1:Number.isFinite(Number(s))}_opSchema(){let t=this._isNumericTargetFor(this.value)?[...N._NUMERIC_OPS]:["is","is_not"];return t.includes(this.value.kind)||t.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:t.map(r=>({value:r,label:W(this.hass,r)}))}}}]}_currentAttributeValue(){return this.value.attribute?this.hass?.states?.[this.value.entity_id]?.attributes?.[this.value.attribute]:void 0}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let t;if(this.value.attribute){let r=this._currentAttributeValue();t=r==null?[]:[String(r)]}else t=this._knownStates;return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:t.map(r=>({value:r,label:r}))}}}]}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let t=this.value.for??{h:0,m:0,s:0};return{duration:{hours:t.h,minutes:t.m,seconds:t.s}}}_setForFromHaForm(t){this._setForDuration({h:t?.hours??0,m:t?.minutes??0,s:t?.seconds??0})}_renderEntity(){return customElements.get("ha-form")?u`<ha-form
        data-field="entity"
        .hass=${this.hass}
        .schema=${this._entitySchema()}
        .data=${{entity_id:this.value.entity_id}}
        .computeLabel=${()=>""}
        @value-changed=${t=>{t.stopPropagation(),this._setEntity(t.detail.value.entity_id??"")}}
      ></ha-form>`:u`<input
      data-field="entity"
      type="text"
      .value=${this.value.entity_id}
      @change=${t=>this._setEntity(t.target.value)}
    />`}_renderAttribute(){let t=this.value.attribute??"";return customElements.get("ha-form")?u`<ha-form
        data-field="attribute"
        .hass=${this.hass}
        .schema=${this._attributeSchema()}
        .data=${this._attributeData()}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setAttributeFromHaForm(r.detail.value.attribute??"")}}
      ></ha-form>`:u`<input
      data-field="attribute"
      type="text"
      placeholder=${d(this.hass,"ui.state_attribute_placeholder","leave blank to compare state")}
      .value=${t}
      @change=${r=>this._setAttribute(r.target.value)}
    />`}_renderOp(){return customElements.get("ha-form")?u`<ha-form
        class="op-form"
        data-field="op"
        .hass=${this.hass}
        .schema=${this._opSchema()}
        .data=${{op:this.value.kind}}
        .computeLabel=${()=>""}
        @value-changed=${t=>{t.stopPropagation();let r=t.detail.value.op;r&&this._setOp(r)}}
      ></ha-form>`:u`<select
      data-field="op"
      @change=${t=>this._setOp(t.target.value)}>
      <option value="is" ?selected=${this.value.kind==="is"}>is</option>
      <option value="is_not" ?selected=${this.value.kind==="is_not"}>is not</option>
    </select>`}_renderValueRow(t,r){let n=r===-1,s=n?l=>this._addValue(l):l=>this._setValueAt(r,l),a=this._isNumericOp(this.value.kind),o=a?{value:t===""?void 0:Number(t)}:{value:t};return customElements.get("ha-form")?u`
        <div class="value-row" data-row=${r}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${o}
            .computeLabel=${()=>""}
            @value-changed=${l=>{l.stopPropagation();let h=l.detail.value.value;s(h==null?"":String(h))}}
          ></ha-form>
        </div>
      `:u`
      <div class="value-row" data-row=${r}>
        <input type=${a?"number":"text"} .value=${t}
          placeholder=${n?d(this.hass,"ui.state_add_value","+ Add state"):""}
          @change=${l=>s(l.target.value)} />
      </div>
    `}_renderForRow(){if(customElements.get("ha-form"))return u`<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${this._forSchema()}
        .data=${this._forData()}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setForFromHaForm(r.detail.value.duration)}}
      ></ha-form>`;let t=this.value.for??{h:0,m:0,s:0};return u`
      <div class="for-row" data-field="for">
        <input type="number" min="0" .value=${String(t.h)}
          @change=${r=>this._setForDuration({...t,h:Number(r.target.value)||0})} />
        <span>:</span>
        <input type="number" min="0" .value=${String(t.m)}
          @change=${r=>this._setForDuration({...t,m:Number(r.target.value)||0})} />
        <span>:</span>
        <input type="number" min="0" .value=${String(t.s)}
          @change=${r=>this._setForDuration({...t,s:Number(r.target.value)||0})} />
      </div>
    `}render(){return u`
      <section class="field">
        <label class="field-label">${d(this.hass,"ui.state_entity","Entity")}</label>
        ${this._renderEntity()}
      </section>
      <section class="field where-op-row">
        <div class="where-cell">
          <label class="field-label">${d(this.hass,"ui.state_where","Where")}</label>
          ${this._renderAttribute()}
        </div>
        <div class="op-cell">
          <label class="field-label">${d(this.hass,"ui.state_op_header","Comparison")}</label>
          ${this._renderOp()}
        </div>
      </section>
      <section class="field">
        <label class="field-label">
          ${d(this.hass,"ui.state_value_label","Value")}
        </label>
        <div class="value-list">
          ${this._isNumericOp(this.value.kind)?this._renderValueRow(this.value.states[0]??"",0):u`
                ${this.value.states.map((t,r)=>this._renderValueRow(t,r))}
                ${this._renderValueRow("",-1)}
              `}
        </div>
      </section>
      <section class="field">
        <label class="field-label">${d(this.hass,"ui.state_for","For (optional)")}</label>
        ${this._renderForRow()}
      </section>
    `}};N.styles=$`
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
  `,N._STATE_SENTINEL="State",N._NUMERIC_OPS=[">",">=","<","<="],c([f({attribute:!1})],N.prototype,"hass",2),c([f({attribute:!1})],N.prototype,"value",2),c([v()],N.prototype,"_knownStates",2),N=c([x("ambience-state-expr-atom")],N);function Wt(e,i){return e===null||i===null||e.length!==i.length?!1:e.every((t,r)=>t===i[r])}var M=class extends b{constructor(){super(...arguments);this.path=[];this._dragOver=!1;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(t,r={}){this.dispatchEvent(new CustomEvent(t,{detail:{path:this.path,...r},bubbles:!0,composed:!0}))}_atomIsComplete(t){return!!t.entity_id&&t.states.some(r=>r!=="")}_isErrorTarget(){return Wt(this.path,this.errorPath)}_onDragStart(t){if(this.path.length===0){t.preventDefault();return}let r=t.target;if(r&&r.closest("button, select, input, textarea, ha-form")){t.preventDefault();return}t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("application/x-ambience-path",JSON.stringify(this.path)))}_onDragOver(t){this.path.length!==0&&(t.preventDefault(),t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.dropEffect="move"),this._dragOver=!0)}_onDragLeave(t){t.stopPropagation(),this._dragOver=!1}_onDrop(t){if(this.path.length===0||(t.preventDefault(),t.stopPropagation(),this._dragOver=!1,!t.dataTransfer))return;let r=t.dataTransfer.getData("application/x-ambience-path");if(!r)return;let n;try{n=JSON.parse(r)}catch{return}!Array.isArray(n)||n.every(s=>typeof s=="number")===!1||Wt(n,this.path)||this.dispatchEvent(new CustomEvent("node-move",{detail:{from:n,to:this.path},bubbles:!0,composed:!0}))}_renderAtomCard(t,r){let n=this._atomIsComplete(t),s=Wt(this.path,this.openPath),a=n?Ct(t,{hass:this.hass}):d(this.hass,"ui.state_new_condition","(new condition)");return u`
      <div class="atom-card ${s?"expanded":"collapsed"} ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}>
        <div class="atom-header"
          draggable=${this.path.length>0}
          @dragstart=${this._onDragStart}
          @click=${()=>this._emit("node-open")}>
          <button class="not-toggle ${r?"on":""}"
            title=${d(this.hass,"ui.state_not_toggle","Negate (NOT)")}
            @click=${o=>{o.stopPropagation(),this._emit("node-toggle-not")}}>${W(this.hass,"not")}</button>
          <span class="summary ${n?"":"placeholder"}">${a}</span>
          <button class="wrap"
            title=${d(this.hass,"ui.state_wrap","Wrap in group")}
            @click=${o=>{o.stopPropagation(),this._emit("node-wrap")}}>(…)</button>
          <button class="remove"
            title=${d(this.hass,"ui.remove","Remove")}
            @click=${o=>{o.stopPropagation(),this._emit("node-remove")}}>✕</button>
        </div>
        ${s?u`
          <div class="atom-body">
            <ambience-state-expr-atom
              .hass=${this.hass}
              .value=${t}
              @value-changed=${o=>{o.stopPropagation(),this._emit("node-change",{value:o.detail.value})}}
            ></ambience-state-expr-atom>
            ${this._isErrorTarget()&&this.errorMessage?u`<div class="atom-error">${this.errorMessage}</div>`:""}
          </div>
        `:""}
      </div>
    `}_renderChildRow(t,r){let n=[...this.path,r];return u`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${t}
        .path=${n}
        .openPath=${this.openPath}
        .errorPath=${this.errorPath}
        .errorMessage=${this.errorMessage}
      ></ambience-state-expr-node>
    `}_renderGroup(t){return u`
      <div class="group ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}>
        <div class="group-header"
          draggable=${this.path.length>0}
          @dragstart=${this._onDragStart}>
          <select class="group-op"
            @change=${r=>this._emit("node-set-op",{op:r.target.value})}>
            <option value="and" ?selected=${t.kind==="and"}>${W(this.hass,"and")}</option>
            <option value="or"  ?selected=${t.kind==="or"} >${W(this.hass,"or")}</option>
          </select>
          <button class="unwrap"
            title=${d(this.hass,"ui.state_unwrap_group","Remove these parens (promote children to parent)")}
            @click=${()=>this._emit("node-unwrap")}>✕</button>
        </div>
        <div class="group-children">
          ${t.items.map((r,n)=>this._renderChildRow(r,n))}
        </div>
        <div class="actions">
          <button @click=${()=>this._emit("node-add-child")}>
            + ${d(this.hass,"ui.state_add_condition","Add condition")}
          </button>
        </div>
      </div>
    `}render(){let t=this.value.kind==="not",r=t?this.value.item:this.value;return r.kind==="and"||r.kind==="or"?this._renderGroupWithExternalNot(r,t):this._renderAtomCard(r,t)}_renderGroupWithExternalNot(t,r){let n=this.path.length===0;return u`
      <div class="group-wrap">
        ${n?"":u`<button class="not-toggle external ${r?"on":""}"
          title=${d(this.hass,"ui.state_not_toggle","Negate (NOT)")}
          @click=${()=>this._emit("node-toggle-not")}>${W(this.hass,"not")}</button>`}
        ${this._renderGroup(t)}
      </div>
    `}};M.styles=$`
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
  `,c([f({attribute:!1})],M.prototype,"hass",2),c([f({attribute:!1})],M.prototype,"value",2),c([f({attribute:!1})],M.prototype,"path",2),c([v()],M.prototype,"_dragOver",2),c([f({attribute:!1})],M.prototype,"openPath",2),c([f({attribute:!1})],M.prototype,"errorPath",2),c([f({attribute:!1})],M.prototype,"errorMessage",2),M=c([x("ambience-state-expr-node")],M);function Bt(e,i){return e===null||i===null||e.length!==i.length?!1:e.every((t,r)=>t===i[r])}var Q=class extends b{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._onNodeMove=t=>{t.stopPropagation(),this._moveAt(t.detail.from,t.detail.to)};this._onNodeChange=t=>{t.stopPropagation(),this._replaceAt(t.detail.path,t.detail.value)};this._onNodeRemove=t=>{t.stopPropagation(),this._removeAt(t.detail.path)};this._onNodeWrap=t=>{t.stopPropagation(),this._wrapAt(t.detail.path)};this._onNodeAddChild=t=>{t.stopPropagation(),this._addChildAt(t.detail.path,"is")};this._onNodeToggleNot=t=>{t.stopPropagation(),this._toggleNotAt(t.detail.path)};this._onNodeSetOp=t=>{t.stopPropagation(),this._setGroupOpAt(t.detail.path,t.detail.op)};this._onNodeUnwrap=t=>{t.stopPropagation(),this._unwrapAt(t.detail.path)};this._onNodeOpen=t=>{if(t.stopPropagation(),this._openPath!==null){let r=this._atomAt(this._openPath);if(r&&this._atomError(r)!==null){this._showError=!0;return}}this._openPath!==null&&Bt(this._openPath,t.detail.path)?this._openPath=null:this._openPath=t.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-move",this._onNodeMove)}_emit(t){this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(t,r){let n=this._patch(this.value,t,()=>r);this._emit(n)}_removeAt(t){if(t.length===0){this._emit(null);return}let r=this._patch(this.value,t,()=>null);this._emit(r)}_wrapAt(t){let r=null;if(t.length>0){let a=this._nodeAt(t.slice(0,-1));a&&(a.kind==="and"||a.kind==="or")&&(r=a.kind)}let n=r==="and"?"or":"and",s=this._patch(this.value,t,a=>a&&{kind:n,items:[a]});this._emit(s)}_nodeAt(t){return this._walkNode(this.value,t)}_moveAt(t,r){if(this._isPrefix(t,r)||t.length===0||r.length===0)return;let n=this._nodeAt(t);if(!n)return;let s=this._rewriteForMove(this.value,[],t,r,n);this._emit(s)}_isPrefix(t,r){return t.length>r.length?!1:t.every((n,s)=>n===r[s])}_rewriteForMove(t,r,n,s,a){if(!t)return t;if(t.kind==="not"){let g=this._rewriteForMove(t.item,r,n,s,a);return g==null?null:{kind:"not",item:g}}if(t.kind!=="and"&&t.kind!=="or")return t;let o=n.slice(0,-1),l=s.slice(0,-1),h=Bt(r,o),m=Bt(r,l),p=[];if(t.items.forEach((g,_)=>{let w=[...r,_];if(h&&_===n[n.length-1])return;let E=this._rewriteForMove(g,w,n,s,a);E!==null&&p.push(E)}),m){let g=s[s.length-1];p.splice(g,0,a)}return p.length===0?null:{...t,items:p}}_walkNode(t,r){return t?t.kind==="not"?this._walkNode(t.item,r):r.length===0?t:t.kind==="and"||t.kind==="or"?this._walkNode(t.items[r[0]]??null,r.slice(1)):null:null}_addChildAt(t,r){let n=null,s=this._patch(this.value,t,a=>{if(a&&(a.kind==="and"||a.kind==="or")){let o=[...a.items,this._emptyAtom()];return n=[...t,o.length-1],{...a,items:o}}return a});n!==null&&(this._openPath=n),this._emit(s)}_toggleNotAt(t){let r=this._patch(this.value,t,n=>n&&(n.kind==="not"?n.item:{kind:"not",item:n}));this._emit(r)}_setGroupOpAt(t,r){let n=this._patch(this.value,t,s=>{if(!s)return s;let a=null;if(s.kind==="and"||s.kind==="or")a=s;else if(s.kind==="not"){let o=s.item;(o.kind==="and"||o.kind==="or")&&(a=o)}return a?{kind:r,items:a.items}:s});this._emit(n)}_patch(t,r,n){if(r.length===0)return n(t);if(t==null)return t;let[s,...a]=r;if(t.kind==="and"||t.kind==="or"){let o=t.items.length,l=t.items.slice(),h=this._patch(l[s],a,n);if(h===null?l.splice(s,1):l[s]=h,l.length<o){if(l.length===0)return null;if(l.length===1)return l[0]}return{...t,items:l}}if(t.kind==="not"){let o=this._patch(t.item,r,n);return o==null?null:{kind:"not",item:o}}return t}_atomAt(t){return this._walk(this.value,t)}_walk(t,r){return t?t.kind==="not"?this._walk(t.item,r):r.length===0?t.kind==="and"||t.kind==="or"?null:t:t.kind==="and"||t.kind==="or"?this._walk(t.items[r[0]]??null,r.slice(1)):null:null}_atomError(t){if(!t.entity_id)return d(this.hass,"ui.state_err_entity","Entity is required");if(t.kind!=="is"&&t.kind!=="is_not"){let n=t.states[0];if(!n)return d(this.hass,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(n)))return d(this.hass,"ui.state_err_numeric","Value must be a number")}else if(!t.states.some(n=>n!==""))return d(this.hass,"ui.state_err_state","State is required");return null}_unwrapAt(t){if(t.length===0){let a=this.value;if(!a)return;let o=a.kind==="not"?a.item:a;(o.kind==="and"||o.kind==="or")&&(o.items.length===1?this._emit(o.items[0]):this._emit(null));return}let r=t.slice(0,-1),n=t[t.length-1],s=this._patch(this.value,r,a=>{if(!a||a.kind!=="and"&&a.kind!=="or")return a;let o=a.items.slice(),l=o[n],h=null;if(l.kind==="and"||l.kind==="or")h=l;else if(l.kind==="not"){let m=l.item;(m.kind==="and"||m.kind==="or")&&(h=m)}return h?(o.splice(n,1,...h.items),{...a,items:o}):a});this._emit(s)}willUpdate(t){if(t.has("value")){let r=this.value;if(r&&this._openPath===null&&r.kind!=="and"&&r.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let n=this._atomAt(this._openPath);(!n||this._atomError(n)===null)&&(this._showError=!1)}}}_addAtRoot(){let t=this.value;if(t==null){this._addFirstAtom();return}if(t.kind==="and"||t.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[t,this._emptyAtom()]})}_setOpen(t){this._openPath=t}render(){if(this.value==null)return u`
        <div class="empty">
          <button @click=${()=>this._addFirstAtom()}>
            + ${d(this.hass,"ui.state_add_first","Add condition")}
          </button>
        </div>
      `;let t=this._showError&&this._openPath!==null?(()=>{let s=this._atomAt(this._openPath);return s?this._atomError(s):null})():null,r=this.value.kind==="not"?this.value.item:this.value,n=r.kind!=="and"&&r.kind!=="or";return u`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${this.value}
        .path=${[]}
        .openPath=${this._openPath}
        .errorPath=${t?this._openPath:null}
        .errorMessage=${t}
      ></ambience-state-expr-node>
      ${n?u`
        <button class="root-add" @click=${()=>this._addAtRoot()}>
          + ${d(this.hass,"ui.state_add_condition","Add condition")}
        </button>
      `:""}
    `}};Q.styles=$`
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
  `,c([f({attribute:!1})],Q.prototype,"hass",2),c([f({attribute:!1})],Q.prototype,"value",2),c([v()],Q.prototype,"_openPath",2),c([v()],Q.prototype,"_showError",2),Q=c([x("ambience-state-predicate-input")],Q);var R=class extends b{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(t){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_onText(t){let r=t.target.value;this._emit(r.trim()===""?null:r)}render(){return this.matcher.input==="time_of_day"?u`
        <ambience-time-of-day-input
          .value=${this.value}
          .periods=${this.periods}
          .hass=${this.hass}
          @value-changed=${t=>{t.stopPropagation(),this._emit(t.detail.value)}}
        ></ambience-time-of-day-input>
      `:this.matcher.input==="scene_combobox"?u`
        <ambience-scene-combobox
          .hass=${this.hass}
          .value=${this.value??null}
          .suggestions=${this.sceneSuggestions}
          @value-changed=${t=>{t.stopPropagation(),this._emit(t.detail.value)}}
        ></ambience-scene-combobox>
      `:this.matcher.input==="script_predicate"?u`
        <ambience-script-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${t=>{t.stopPropagation(),this._emit(t.detail.value)}}
        ></ambience-script-predicate-input>
      `:this.matcher.input==="day_predicate"?u`
        <ambience-day-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .dayConfig=${this.dayConfig??{workday_sensor:null,workday_calendar:null}}
          @value-changed=${t=>{t.stopPropagation(),this._emit(t.detail.value)}}
        ></ambience-day-predicate-input>
      `:this.matcher.input==="weather_predicate"?u`
        <ambience-weather-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .groups=${this.weatherConfig?.groups??[]}
          .weatherEntity=${this.weatherConfig?.entity??void 0}
          @value-changed=${t=>{t.stopPropagation(),this._emit(t.detail.value)}}
        ></ambience-weather-predicate-input>
      `:this.matcher.input==="state_predicate"?u`
        <ambience-state-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${t=>{t.stopPropagation(),this._emit(t.detail.value)}}
        ></ambience-state-predicate-input>
      `:u`
      <input
        type="text"
        placeholder=${d(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};R.styles=$`
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
  `,c([f({attribute:!1})],R.prototype,"matcher",2),c([f({attribute:!1})],R.prototype,"value",2),c([f({attribute:!1})],R.prototype,"sceneSuggestions",2),c([f({attribute:!1})],R.prototype,"periods",2),c([f({attribute:!1})],R.prototype,"dayConfig",2),c([f({attribute:!1})],R.prototype,"weatherConfig",2),c([f({attribute:!1})],R.prototype,"hass",2),R=c([x("ambience-matcher-input")],R);var oe=class extends b{constructor(){super(...arguments);this.entities=[];this.value=[]}connectedCallback(){super.connectedCallback(),ie(this,this.hass)}_emit(t){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_onHaFormChange(t){t.stopPropagation(),this._emit(t.detail.value.entity_ids??[])}_renderHaForm(){let t=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this.entities}}}];return u`
      <ha-form
        .hass=${this.hass}
        .schema=${t}
        .data=${{entity_ids:this.value}}
        .computeLabel=${()=>""}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(t,r){let n=new Set(this.value);r?n.add(t):n.delete(t),this._emit(this.entities.filter(s=>n.has(s)))}_renderFallback(){return this.entities.length===0?u`<p class="empty">${d(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:u`
      <div class="checkboxes">
        ${this.entities.map(t=>u`
            <label>
              <input
                type="checkbox"
                .checked=${this.value.includes(t)}
                @change=${r=>this._toggle(t,r.target.checked)}
              />
              ${t}
            </label>
          `)}
      </div>
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};oe.styles=$`
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
  `,c([f({attribute:!1})],oe.prototype,"hass",2),c([f({attribute:!1})],oe.prototype,"entities",2),c([f({attribute:!1})],oe.prototype,"value",2),oe=c([x("ambience-target-picker")],oe);var S=class extends b{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._open=null;this._showError=!1;this._onNameInput=t=>{this._setName(t.target.value)};this._onAddMatcher=t=>{let r=t.target,n=r.value;r.value="",this._addMatcher(n)};this._onAddMatcherHaForm=t=>{t.stopPropagation();let r=t.detail.value.add;r!==S._ADD_MATCHER_PLACEHOLDER&&this._addMatcher(r)}}connectedCallback(){super.connectedCallback(),ie(this,this.hass)}willUpdate(t){t.has("open")&&this.open&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null,this._open=null,this._showError=!1)}_setName(t){this._draft&&(this._draft={...this._draft,name:t||void 0})}_renderNameSlot(){let t=this._draft.name??"";if(this._isOpen({kind:"name"}))return u`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(t)}
        </div>
      `;let n=rt(this._draft,d(this.hass,"ui.new_rule","New rule"));return u`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${n}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(t){let r=ur();return r==="ha-input"?u`<ha-input label=${d(this.hass,"ui.name_optional","Name (optional)")} .value=${t} @input=${this._onNameInput}></ha-input>`:r==="ha-textfield"?u`<ha-textfield label=${d(this.hass,"ui.name_optional","Name (optional)")} .value=${t} @input=${this._onNameInput}></ha-textfield>`:u`<input type="text" .value=${t} @input=${this._onNameInput} />`}_isOpen(t){return this._open===null?!1:t.kind==="name"&&this._open.kind==="name"?!0:t.kind==="matcher"&&this._open.kind==="matcher"?t.id===this._open.id:t.kind==="action"&&this._open.kind==="action"?t.idx===this._open.idx:!1}_validationError(t){if(t===null||t.kind==="name"||t.kind==="matcher")return null;let r=this._draft?.actions[t.idx];if(!r)return null;if(r.entity_ids.length===0)return d(this.hass,"ui.at_least_one_target","At least one target is required.");let n=this.availableActions.find(s=>s.name===r.action);if(!n)return null;for(let s of n.target_params){if(!s.required)continue;let a=r.params[s.name];if(a==null||a==="")return d(this.hass,"ui.param_required","{param} is required.").replace("{param}",this._paramLabel(s.name))}return null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(t){if(this._isOpen(t)){this._tryCloseCurrent();return}this._open!==null&&!this._tryCloseCurrent()||(this._open=t,this._showError=!1)}_onModalClick(t){for(let r of t.composedPath())if(r instanceof Element&&(r.classList.contains("slot")||r.classList.contains("actions-bar")||r.classList.contains("add-matcher")))return;this._tryCloseCurrent()}_setPredicate(t,r){if(!this._draft)return;let n={...this._draft.when};r==null?delete n[t]:n[t]=r,this._draft={...this._draft,when:n}}_renderMatcherRow(t){let r=this._draft.when[t.name]??null,n=this._isOpen({kind:"matcher",id:t.name}),s=t.input==="scene_combobox";if(n&&s)return u`
        <div class="slot combobox-slot expanded" data-slot-id=${t.name}>
          <ambience-matcher-input
            .hass=${this.hass}
            .matcher=${t}
            .value=${r}
            .sceneSuggestions=${this.sceneSuggestions}
            .periods=${this.periods}
            .dayConfig=${this.dayConfig}
            .weatherConfig=${this.weatherConfig}
            @value-changed=${o=>this._setPredicate(t.name,o.detail.value)}
          ></ambience-matcher-input>
        </div>
      `;let a=it(t.name,r,{hass:this.hass,periods:this.periods});return u`
      <div class="slot ${n?"expanded":"collapsed"}" data-slot-id=${t.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"matcher",id:t.name})}>
          <span class="summary-label"><strong>${re(this.hass,t.name)}:</strong> ${a}</span>
          <button
            class="remove"
            @click=${o=>{o.stopPropagation(),this._removeMatcher(t.name)}}
            title=${d(this.hass,"ui.remove_condition","Remove condition")}
          >✕</button>
        </div>
        ${n?u`
          <div class="body">
            <ambience-matcher-input
              .hass=${this.hass}
              .matcher=${t}
              .value=${r}
              .sceneSuggestions=${this.sceneSuggestions}
              .periods=${this.periods}
              .dayConfig=${this.dayConfig}
              .weatherConfig=${this.weatherConfig}
              @value-changed=${o=>this._setPredicate(t.name,o.detail.value)}
            ></ambience-matcher-input>
          </div>
        `:""}
      </div>
    `}_visibleMatchers(){if(!this._draft)return[];let t=this._draft.when;return this.matchers.filter(r=>r.name in t&&t[r.name]!=null||this._open?.kind==="matcher"&&this._open.id===r.name)}_unusedMatchers(){let t=new Set(this._visibleMatchers().map(r=>r.name));return this.matchers.filter(r=>!t.has(r.name))}_addMatcher(t){t&&(this._open!==null&&!this._tryCloseCurrent()||(this._open={kind:"matcher",id:t},this._showError=!1))}_removeMatcher(t){if(!this._draft)return;let r={...this._draft.when};delete r[t],this._draft={...this._draft,when:r},this._open?.kind==="matcher"&&this._open.id===t&&(this._open=null,this._showError=!1)}_renderAddMatcher(){let t=this._unusedMatchers();return t.length===0?"":customElements.get("ha-form")?this._renderAddMatcherHaForm(t):u`
      <div class="add-matcher">
        <select class="add-matcher" @change=${this._onAddMatcher}>
          <option value="">${d(this.hass,"ui.add_condition","+ Add condition\u2026")}</option>
          ${t.map(r=>u`<option value=${r.name}>${re(this.hass,r.name)}</option>`)}
        </select>
      </div>
    `}_renderAddMatcherHaForm(t){let r=d(this.hass,"ui.add_condition","+ Add condition\u2026"),n=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_MATCHER_PLACEHOLDER,label:r},...t.map(s=>({value:s.name,label:re(this.hass,s.name)}))]}}}];return u`
      <div class="add-matcher">
        <ha-form
          .hass=${this.hass}
          .schema=${n}
          .data=${{add:S._ADD_MATCHER_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddMatcherHaForm}
        ></ha-form>
      </div>
    `}_addActionSlot(){if(!this._draft)return;let t={action:"set_light",entity_ids:[],params:{}},r=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,t]},this._open={kind:"action",idx:r}}_updateActionAt(t,r){if(!this._draft)return;let n=this._draft.actions.map((s,a)=>a===t?r(s):s);this._draft={...this._draft,actions:n}}_deleteAction(t){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((r,n)=>n!==t)},this._open?.kind==="action"&&this._open.idx===t&&(this._open=null))}_setActionTargets(t,r){this._updateActionAt(t,n=>({...n,entity_ids:r}))}_paramLabel(t){let r=t.replaceAll("_"," ").toLowerCase();return r.charAt(0).toUpperCase()+r.slice(1)}_updateActionParam(t,r,n){this._updateActionAt(t,s=>{let a={...s.params},o=n;if(r.type==="int"?o=n===""?void 0:parseInt(n,10):r.type==="number"?o=n===""?void 0:parseFloat(n):r.type==="boolean"&&(o=n==="true"),typeof o=="number"&&Number.isFinite(o)){let l=o;typeof r.min=="number"&&l<r.min&&(l=r.min),typeof r.max=="number"&&l>r.max&&(l=r.max),o=l}return o===void 0?delete a[r.name]:a[r.name]=o,{...s,params:a}})}_renderActionParams(t,r,n){let s=n?.target_params??[];return u`
      ${s.map(a=>u`
        <div class="param-row">
          <label>${this._paramLabel(a.name)}${a.required?" *":""}</label>
          <div class="param-input">
            <input
              type=${a.type==="int"||a.type==="number"?"number":"text"}
              placeholder=${a.description??""}
              .value=${String(r.params[a.name]??"")}
              min=${a.min??""}
              max=${a.max??""}
              @input=${o=>this._updateActionParam(t,a,o.target.value)}
            />
            ${a.unit?u`<span class="param-unit">${a.unit}</span>`:""}
          </div>
        </div>
      `)}
    `}_renderActionRow(t,r){let n=this.availableActions.find(l=>l.name===t.action),s=this._isOpen({kind:"action",idx:r}),a=$r(t,n,{hass:this.hass}),o=xr(this.hass,this.areaId,n?.domains??[]);return u`
      <div class="slot ${s?"expanded":"collapsed"}" data-slot-id="action-${r}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:r})}>
          <span class="summary-label">${a}</span>
          <button class="remove" @click=${l=>{l.stopPropagation(),this._deleteAction(r)}} title=${d(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${s?u`
          <div class="body">
            <label>${d(this.hass,"ui.target","Target")}</label>
            <ambience-target-picker
              .hass=${this.hass}
              .entities=${o}
              .value=${t.entity_ids}
              @value-changed=${l=>{l.stopPropagation(),this._setActionTargets(r,l.detail.value)}}
            ></ambience-target-picker>

            ${this._renderActionParams(r,t,n)}

            ${this._showError&&this._validationError({kind:"action",idx:r})?u`
              <div class="error">${this._validationError({kind:"action",idx:r})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_save(){if(!this._draft)return;let t=Object.fromEntries(Object.entries(this._draft.when).filter(([,r])=>r!=null));this.dispatchEvent(new CustomEvent("save-rule",{detail:{...this._draft,when:t},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){if(!this._draft)return u``;let t=this._visibleMatchers();return u`
      <div class="modal" @click=${this._onModalClick}>
        <div class="content">
          ${this._renderNameSlot()}

          <h3>${d(this.hass,"ui.when_heading","When")}</h3>
          ${t.map(r=>this._renderMatcherRow(r))}
          ${this._renderAddMatcher()}

          <h3>${d(this.hass,"ui.actions_heading","Actions")}</h3>
          ${this._draft.actions.map((r,n)=>this._renderActionRow(r,n))}
          <button class="secondary add-action" @click=${this._addActionSlot}>${d(this.hass,"ui.add_action","+ Add action")}</button>
        </div>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>${d(this.hass,"ui.cancel","Cancel")}</button>
          <button class="primary" @click=${this._save}>${d(this.hass,"ui.save_rule","Save rule")}</button>
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
    select.add-matcher {
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
  `,S._ADD_MATCHER_PLACEHOLDER="__add_matcher__",c([f({type:Boolean,reflect:!0})],S.prototype,"open",2),c([f({attribute:!1})],S.prototype,"rule",2),c([f({attribute:!1})],S.prototype,"matchers",2),c([f({attribute:!1})],S.prototype,"sceneSuggestions",2),c([f({attribute:!1})],S.prototype,"periods",2),c([f({attribute:!1})],S.prototype,"dayConfig",2),c([f({attribute:!1})],S.prototype,"weatherConfig",2),c([f({attribute:!1})],S.prototype,"availableActions",2),c([f({attribute:!1})],S.prototype,"hass",2),c([f({attribute:!1})],S.prototype,"areaId",2),c([v()],S.prototype,"_draft",2),c([v()],S.prototype,"_open",2),c([v()],S.prototype,"_showError",2),S=c([x("ambience-rule-editor")],S);var F=class extends b{constructor(){super(...arguments);this._areas=[];this._matchers=[];this._actions=[];this._configs=new Map;this._expanded=new Set;this._error="";this._editing=null}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await this._refreshAreas(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _loadStatic(){try{let[t,r,n,s,a]=await Promise.all([Xe(this.hass),pr(this.hass),Ze(this.hass),et(this.hass),tt(this.hass)]);if(!this.isConnected)return;this._matchers=t,this._actions=r,this._periods=n,this._dayConfig=s,this._weatherConfig=a}catch(t){this._error=t.message||String(t)}}async _refreshAreas(){try{let t=await dr(this.hass),r=this._configs,n=new Map;if(await Promise.all(t.map(async s=>{let a=r.get(s.area_id);if(a){n.set(s.area_id,a);return}n.set(s.area_id,this._normalize(await cr(this.hass,s.area_id)))})),!this.isConnected)return;this._areas=t,this._configs=n}catch(t){this._error=t.message||String(t)}}_normalize(t){return{rules:t.rules??[],auto_sort:t.auto_sort??!0}}async _subscribe(){let t=await this.hass.connection.subscribeEvents(r=>{if(r.data.action==="remove"){let n=r.data.area_id,s=new Set(this._expanded);s.delete(n),this._expanded=s,this._editing?.areaId===n&&(this._editing=null)}this._refreshAreas()},"area_registry_updated");this.isConnected?this._unsub=t:t()}_setConfig(t,r){let n=new Map(this._configs);n.set(t,r),this._configs=n}async _mutate(t,r){let n=this._configs.get(t);this._setConfig(t,r),this._error="";try{let{config:s}=await hr(this.hass,t,r);this._setConfig(t,this._normalize(s))}catch(s){n&&this._setConfig(t,n),this._error=s.message||String(s)}}_toggleExpand(t){let r=new Set(this._expanded);r.has(t)?r.delete(t):r.add(t),this._expanded=r}_toggleAutoSort(t,r){let n=this._configs.get(t);n&&this._mutate(t,{...n,auto_sort:r})}_addRule(t){let r=this._configs.get(t);r&&(this._editing={areaId:t,index:r.rules.length,isNew:!0})}_editRule(t,r){this._editing={areaId:t,index:r.detail.index,isNew:!1}}_duplicateRule(t,r){let n=this._configs.get(t);if(!n)return;let s=n.rules[r.detail.index];if(!s)return;let a=JSON.parse(JSON.stringify(s)),o=[...n.rules];o.splice(r.detail.index+1,0,a),this._mutate(t,{...n,rules:o})}_deleteRule(t,r){let n=this._configs.get(t);if(!n)return;let s=n.rules.filter((a,o)=>o!==r.detail.index);this._mutate(t,{...n,rules:s})}_reorderRules(t,r){let n=this._configs.get(t);if(!n)return;let{from:s,to:a}=r.detail,o=[...n.rules],[l]=o.splice(s,1);o.splice(a,0,l),this._mutate(t,{...n,rules:o})}_saveRule(t){let r=this._editing;if(this._editing=null,!r)return;let n=this._configs.get(r.areaId);if(!n)return;let s=[...n.rules];r.isNew?s.push(t.detail):s[r.index]=t.detail,this._mutate(r.areaId,{...n,rules:s})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._configs.get(this._editing.areaId)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let t=this._configs.get(this._editing.areaId);if(!t)return[];let r=new Set;for(let n of t.rules){let s=n.when.scene;typeof s=="string"&&s&&r.add(s)}return[...r].sort((n,s)=>n.toLowerCase().localeCompare(s.toLowerCase()))}get _editorMatchers(){return this._editing?this._matchers.slice().sort((t,r)=>t.priority-r.priority):[]}_summary(t){let r=t.rules.length;if(r===0)return d(this.hass,"ui.not_configured","not configured");let n=r===1?d(this.hass,"ui.rule_singular","rule"):d(this.hass,"ui.rule_plural","rules");return`${r} ${n}`}render(){return u`
      ${this._error?u`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?u`<p class="empty">${d(this.hass,"ui.no_areas","No areas found in Home Assistant.")}</p>`:u`<ul>
            ${this._areas.map(t=>this._renderArea(t))}
          </ul>`}

      <ambience-rule-editor
        ?open=${this._editing!==null}
        .hass=${this.hass}
        .areaId=${this._editing?.areaId}
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
    `}_renderArea(t){let r=this._configs.get(t.area_id);if(!r)return u``;let n=this._expanded.has(t.area_id);return u`
      <li>
        <div
          class="area-header"
          @click=${()=>this._toggleExpand(t.area_id)}
        >
          <span class="chevron ${n?"open":""}">▶</span>
          <span class="area-name">${t.name}</span>
          <span class="area-summary">${this._summary(r)}</span>
        </div>
        ${n?u`
              <div class="area-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!r.auto_sort}
                    @change=${s=>this._toggleAutoSort(t.area_id,!s.target.checked)}
                  />
                  ${d(this.hass,"ui.order_rules_manually","Order rules manually")}
                </label>
                <ambience-rules-list
                  .rules=${r.rules}
                  .autoSort=${r.auto_sort}
                  .periods=${this._periods}
                  .weatherConfig=${this._weatherConfig}
                  .matchers=${this._matchers}
                  .hass=${this.hass}
                  @add-rule=${()=>this._addRule(t.area_id)}
                  @edit-rule=${s=>this._editRule(t.area_id,s)}
                  @duplicate-rule=${s=>this._duplicateRule(t.area_id,s)}
                  @delete-rule=${s=>this._deleteRule(t.area_id,s)}
                  @reorder-rules=${s=>this._reorderRules(t.area_id,s)}
                ></ambience-rules-list>
              </div>
            `:""}
      </li>
    `}};F.styles=$`
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
  `,c([f({attribute:!1})],F.prototype,"hass",2),c([v()],F.prototype,"_areas",2),c([v()],F.prototype,"_matchers",2),c([v()],F.prototype,"_actions",2),c([v()],F.prototype,"_periods",2),c([v()],F.prototype,"_dayConfig",2),c([v()],F.prototype,"_weatherConfig",2),c([v()],F.prototype,"_configs",2),c([v()],F.prototype,"_expanded",2),c([v()],F.prototype,"_error",2),c([v()],F.prototype,"_editing",2),F=c([x("ambience-areas-list")],F);var X=class extends b{constructor(){super(...arguments);this.matcherName="";this.matcherDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let t=re(this.hass,this.matcherName);return u`
      <div class="card">
        <header @click=${this._toggleExpand}>
          <span class="chevron ${this._expanded?"open":""}">▶</span>
          <label>
            <div class="name">${t}</div>
            <div class="description">${this.matcherDescription}</div>
          </label>
        </header>
        <div class="body ${this._expanded?"":"collapsed"}">
          <slot></slot>
        </div>
      </div>
    `}};X.styles=$`
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
  `,c([f({attribute:!1})],X.prototype,"hass",2),c([f()],X.prototype,"matcherName",2),c([f()],X.prototype,"matcherDescription",2),c([v()],X.prototype,"_expanded",2),X=c([x("ambience-matcher-card")],X);var Ta=/^[a-z][a-z0-9_]*$/;function La(e){return e.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var j=class extends b{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._label=this.initial.label??"",this._def=this.initial}_onLabelInput(t){this._label=t.target.value}_onFromChange(t){t.stopPropagation(),this._def={...this._def,from:t.detail.value}}_onToChange(t){t.stopPropagation(),this._def={...this._def,to:t.detail.value}}_validate(t){if(!this.existingId){if(!this._label.trim())return d(this.hass,"ui.error_enter_name","Please enter a name.");if(!t)return d(this.hass,"ui.error_start_letter","Name must start with a letter.");if(!Ta.test(t))return d(this.hass,"ui.error_start_letter","Name must start with a letter.");if(this.takenIds.has(t))return d(this.hass,"ui.error_name_exists","A period with this name already exists. Choose a different name.")}return""}_onSave(){let t=this.existingId??La(this._label),r=this._validate(t);if(r){this._error=r,this.performUpdate();return}let n={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:t,definition:n},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){let t=this.existingId?d(this.hass,"ui.period_modal_edit_title",'Edit "{name}"').replace("{name}",this.initial?.label??this.existingId):d(this.hass,"ui.period_modal_add_title","Add custom period");return u`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${t}</h3>
        <div class="field">
          <label for="label">${d(this.hass,"ui.name","Name")}</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput} placeholder=${d(this.hass,"ui.name_placeholder","e.g. Wind down")} />
        </div>
        <div class="row">
          <label style="min-width: 3em;">${d(this.hass,"ui.from_label","From")}</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
        </div>
        <div class="row">
          <label style="min-width: 3em;">${d(this.hass,"ui.to_label","To")}</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
        </div>
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>${d(this.hass,"ui.cancel","Cancel")}</button>
          <button @click=${this._onSave}>${d(this.hass,"ui.save","Save")}</button>
        </div>
      </div>
    `}};j.styles=$`
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
  `,c([f({attribute:!1})],j.prototype,"hass",2),c([f({attribute:!1})],j.prototype,"existingId",2),c([f({attribute:!1})],j.prototype,"initial",2),c([f({attribute:!1})],j.prototype,"takenIds",2),c([v()],j.prototype,"_label",2),c([v()],j.prototype,"_def",2),c([v()],j.prototype,"_error",2),j=c([x("ambience-period-edit-modal")],j);function gi(e,i){if(e.kind==="time")return`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;let t=$e(i,e.anchor);if(e.offset_min===0)return t;let r=Math.abs(e.offset_min),n=r%60===0?`${r/60}${d(i,"ui.unit_hour_abbr","h")}`:`${r}${d(i,"ui.unit_min_abbr","m")}`;return`${t}${e.offset_min<0?"-":"+"}${n}`}function _i(e,i){return`${gi(e.from,i)} \u2192 ${gi(e.to,i)}`}var Z=class extends b{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await Ze(this.hass)}async _saveState(t){let r=await mr(this.hass,t,this._view.hidden);this._warnings=r.warnings,await this._reload()}_onEdit(t,r){this._modal={mode:"edit",id:t,initial:r}}async _onDelete(t){let r={...this._view.custom};delete r[t],await this._saveState(r)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(t){t.stopPropagation();let{id:r,definition:n}=t.detail,s={...this._view.custom,[r]:n};this._modal={mode:"closed"},await this._saveState(s)}_onModalCancel(){this._modal={mode:"closed"}}_renderBuiltinRow(t,r,n){return u`
      <div class="row ${n?"overridden":""}">
        <span class="name">${me(this.hass,t,{})}</span>
        <span class="def">${_i(r,this.hass)}</span>
        <span class="badge">${d(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${n?"":u`<button class="icon" title=${d(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(t,r)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(t,r){return u`
      <div class="row custom">
        <span class="name">${me(this.hass,t,this._view.custom)}</span>
        <span class="def">${_i(r,this.hass)}</span>
        <span class="badge">${d(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${d(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(t,r)}>✎</button>
          <button class="icon" title=${d(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(t)}>✕</button>
        </span>
      </div>
    `}render(){let t=this._view.custom;return u`
      <header>
        <h2>${d(this.hass,"ui.periods_heading","Periods")}</h2>
      </header>
      ${this._warnings.length?u`<div class="warnings">
            <strong>${d(this.hass,"ui.period_warning_prefix","Warning:")}</strong> ${d(this.hass,"ui.period_warning_text","some rules now reference missing periods:")}
            <ul>
              ${this._warnings.map(r=>u`<li>${r.area_id} / "${r.rule_name}" → ${r.missing_period}</li>`)}
            </ul>
          </div>`:""}
      ${Object.entries(this._view.builtins).map(([r,n])=>{let s=t[r];return u`
          ${this._renderBuiltinRow(r,n,s!=null)}
          ${s!=null?this._renderCustomRow(r,s):""}
        `})}
      ${Object.entries(t).filter(([r])=>!(r in this._view.builtins)).map(([r,n])=>this._renderCustomRow(r,n))}
      <button class="add" @click=${this._onAdd}>${d(this.hass,"ui.add_custom_period","+ Add custom period")}</button>
      ${this._modal.mode==="edit"?u`<ambience-period-edit-modal
            .hass=${this.hass}
            .existingId=${this._modal.id}
            .initial=${this._modal.initial}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:this._modal.mode==="add"?u`<ambience-period-edit-modal
            .hass=${this.hass}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:""}
    `}};Z.styles=$`
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
  `,c([f({attribute:!1})],Z.prototype,"hass",2),c([v()],Z.prototype,"_view",2),c([v()],Z.prototype,"_modal",2),c([v()],Z.prototype,"_warnings",2),Z=c([x("ambience-time-of-day-config")],Z);var le=class extends b{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await et(this.hass)}async _save(t){this._config=t;let r=await fr(this.hass,t.workday_sensor,t.workday_calendar);this._warnings=r.warnings??[]}_onSensorChange(t){this._save({...this._config,workday_sensor:t.detail.value||null})}_onCalendarChange(t){this._save({...this._config,workday_calendar:t.detail.value||null})}render(){let t=[{name:"workday_sensor",selector:{entity:{integration:"workday",domain:"binary_sensor"}}}],r=[{name:"workday_calendar",selector:{entity:{integration:"workday",domain:"calendar"}}}];return u`
      <div class="row">
        <label>${d(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${t}
          .data=${{workday_sensor:this._config.workday_sensor??""}}
          .computeLabel=${()=>""}
          @value-changed=${n=>{n.stopPropagation(),this._onSensorChange({detail:{value:n.detail.value?.workday_sensor||null}})}}
        ></ha-form>
      </div>
      <div class="row">
        <label>${d(this.hass,"ui.workday_calendar","Workday calendar")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{workday_calendar:this._config.workday_calendar??""}}
          .computeLabel=${()=>""}
          @value-changed=${n=>{n.stopPropagation(),this._onCalendarChange({detail:{value:n.detail.value?.workday_calendar||null}})}}
        ></ha-form>
      </div>
      ${this._warnings.length?u`
        <div class="warnings">
          <strong>${d(this.hass,"ui.day_warning_prefix","Warning:")}</strong> ${d(this.hass,"ui.day_warning_text","rules now reference unconfigured entities:")}
          <ul>
            ${this._warnings.map(n=>u`<li>${n.area_id} / "${n.rule_name}" → ${n.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};le.styles=$`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,c([f({attribute:!1})],le.prototype,"hass",2),c([v()],le.prototype,"_config",2),c([v()],le.prototype,"_warnings",2),le=c([x("ambience-day-config")],le);var Na=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],ee=class extends b{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._warnings=[];this._expanded=new Set}async connectedCallback(){super.connectedCallback(),this._config=await tt(this.hass)}async _persist(){let t=await gr(this.hass,this._config.entity,this._config.groups);this._warnings=t.warnings??[]}_onEntityChange(t){this._config={...this._config,entity:t.detail.value||null},this._persist()}_nextGroupId(t){let r=new Set(t.map(n=>n.id));for(let n=1;n<=t.length+1;n++){let s=`group_${n}`;if(!r.has(s))return s}return`group_${t.length+1}`}_addGroup(){let t=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:t,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,t]),this._persist()}_toggleExpand(t){let r=new Set(this._expanded);r.has(t)?r.delete(t):r.add(t),this._expanded=r}_updateGroup(t,r){this._config={...this._config,groups:this._config.groups.map((n,s)=>s===t?{...n,...r}:n)},this._persist()}_removeGroup(t){let r=this._config.groups[t];if(this._config={...this._config,groups:this._config.groups.filter((n,s)=>s!==t)},r){let n=new Set(this._expanded);n.delete(r.id),this._expanded=n}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:Na.map(t=>({value:t,label:Qe(this.hass,t)}))}}}]}_renderConditions(t,r){if(customElements.get("ha-form"))return u`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:r.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation(),this._updateGroup(t,{conditions:s.detail.value.conditions??[]})}}
      ></ha-form>`;let n=r.conditions.map(s=>Qe(this.hass,s));return u`<span class="conditions-list">${n.join(", ")}</span>`}_renderGroup(t,r){let n=this._expanded.has(r.id),s=r.conditions.map(a=>Qe(this.hass,a)).join(", ");return u`
      <div class="group">
        <div class="group-header" @click=${()=>this._toggleExpand(r.id)}>
          <span class="chevron ${n?"open":""}">▶</span>
          <span class="label">${r.label}</span>
          <span class="codes">${s}</span>
          <button
            class="icon"
            title=${d(this.hass,"ui.title_delete","Delete")}
            @click=${a=>{a.stopPropagation(),this._removeGroup(t)}}
          >✕</button>
        </div>
        ${n?u`<div class="body" @click=${a=>a.stopPropagation()}>
              <input
                .value=${r.label}
                aria-label=${r.label}
                @change=${a=>this._updateGroup(t,{label:a.target.value})}
              />
              ${this._renderConditions(t,r)}
            </div>`:""}
      </div>
    `}render(){let t=[{name:"entity",selector:{entity:{domain:"weather"}}}];return u`
      <div class="row">
        <label class="section">${d(this.hass,"ui.weather_entity","Weather entity")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${t}
          .data=${{entity:this._config.entity??""}}
          .computeLabel=${()=>""}
          @value-changed=${r=>{r.stopPropagation(),this._onEntityChange({detail:{value:r.detail.value?.entity||null}})}}
        ></ha-form>
      </div>

      <h4>${d(this.hass,"ui.groups","Groups")}</h4>
      ${this._config.groups.map((r,n)=>this._renderGroup(n,r))}
      <button class="add" @click=${()=>this._addGroup()}>
        ${d(this.hass,"ui.add_group","+ Add group")}
      </button>

      ${this._warnings.length?u`
        <div class="warnings">
          <strong>${d(this.hass,"ui.day_warning_prefix","Warning:")}</strong>
          ${d(this.hass,"ui.weather_warning_text","rules now reference an unconfigured weather entity:")}
          <ul>${this._warnings.map(r=>u`<li>${r.area_id} / "${r.rule_name}" → ${r.reason}</li>`)}</ul>
        </div>
      `:""}
    `}};ee.styles=$`
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
  `,c([f({attribute:!1})],ee.prototype,"hass",2),c([v()],ee.prototype,"_config",2),c([v()],ee.prototype,"_warnings",2),c([v()],ee.prototype,"_expanded",2),ee=c([x("ambience-weather-config")],ee);var Da=new Set(["time_of_day","day","weather"]),ue=class extends b{constructor(){super(...arguments);this._matchers=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._matchers=await Xe(this.hass)}catch(t){this._error=t.message||String(t)}}render(){let t=this._matchers.filter(r=>Da.has(r.name)).slice().sort((r,n)=>r.priority-n.priority);return u`
      ${this._error?u`<p class="error">${this._error}</p>`:""}
      ${t.map(r=>u`
        <ambience-matcher-card
          .hass=${this.hass}
          .matcherName=${r.name}
          .matcherDescription=${r.description}
        >
          ${r.name==="time_of_day"?u`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`:r.name==="day"?u`<ambience-day-config .hass=${this.hass}></ambience-day-config>`:r.name==="weather"?u`<ambience-weather-config .hass=${this.hass}></ambience-weather-config>`:u``}
        </ambience-matcher-card>
      `)}
    `}};ue.styles=$`
    :host { display: block; padding: 1rem; max-width: 60rem; margin: 0 auto; }
    .error { color: var(--error-color, #d32f2f); }
  `,c([f({attribute:!1})],ue.prototype,"hass",2),c([v()],ue.prototype,"_matchers",2),c([v()],ue.prototype,"_error",2),ue=c([x("ambience-configuration-view")],ue);var ve=class extends b{constructor(){super(...arguments);this._view="areas"}connectedCallback(){super.connectedCallback(),ie(this)}render(){return u`
      <header>
        <h1>${d(this.hass,"ui.panel_title","Ambience")}</h1>
        <nav>
          <button
            class=${this._view==="areas"?"active":""}
            @click=${()=>{this._view="areas"}}
          >${d(this.hass,"ui.tab_areas","Areas")}</button>
          <button
            class=${this._view==="configuration"?"active":""}
            @click=${()=>{this._view="configuration"}}
          >${d(this.hass,"ui.tab_configuration","Configuration")}</button>
        </nav>
      </header>
      ${this._view==="areas"?u`<ambience-areas-list .hass=${this.hass}></ambience-areas-list>`:u`<ambience-configuration-view .hass=${this.hass}></ambience-configuration-view>`}
    `}};ve.styles=$`
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
  `,c([f({attribute:!1})],ve.prototype,"hass",2),c([v()],ve.prototype,"_view",2),ve=c([x("ambience-panel")],ve);export{ve as AmbiencePanel};
