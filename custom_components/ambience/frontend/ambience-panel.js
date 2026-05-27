/* Ambience panel — bundled output. Do not edit by hand. */
var qt=Object.defineProperty;var Bt=Object.getOwnPropertyDescriptor;var h=(n,s,e,t)=>{for(var r=t>1?void 0:t?Bt(s,e):s,i=n.length-1,a;i>=0;i--)(a=n[i])&&(r=(t?a(s,e,r):a(r))||r);return t&&r&&qt(s,e,r),r};var ge=globalThis,_e=ge.ShadowRoot&&(ge.ShadyCSS===void 0||ge.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ne=Symbol(),et=new WeakMap,ne=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==Ne)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(_e&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=et.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&et.set(e,s))}return s}toString(){return this.cssText}},tt=n=>new ne(typeof n=="string"?n:n+"",void 0,Ne),g=(n,...s)=>{let e=n.length===1?n[0]:s.reduce((t,r,i)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+n[i+1],n[0]);return new ne(e,n,Ne)},rt=(n,s)=>{if(_e)n.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),r=ge.litNonce;r!==void 0&&t.setAttribute("nonce",r),t.textContent=e.cssText,n.appendChild(t)}},Ae=_e?n=>n:n=>n instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return tt(e)})(n):n;var{is:Kt,defineProperty:Vt,getOwnPropertyDescriptor:Jt,getOwnPropertyNames:Yt,getOwnPropertySymbols:Xt,getPrototypeOf:Zt}=Object,ve=globalThis,st=ve.trustedTypes,Qt=st?st.emptyScript:"",er=ve.reactiveElementPolyfillSupport,ae=(n,s)=>n,oe={toAttribute(n,s){switch(s){case Boolean:n=n?Qt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,s){let e=n;switch(s){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},ye=(n,s)=>!Kt(n,s),it={attribute:!0,type:String,converter:oe,reflect:!1,useDefault:!1,hasChanged:ye};Symbol.metadata??=Symbol("metadata"),ve.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=it){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),r=this.getPropertyDescriptor(s,t,e);r!==void 0&&Vt(this.prototype,s,r)}}static getPropertyDescriptor(s,e,t){let{get:r,set:i}=Jt(this.prototype,s)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){let d=r?.call(this);i?.call(this,a),this.requestUpdate(s,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??it}static _$Ei(){if(this.hasOwnProperty(ae("elementProperties")))return;let s=Zt(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(ae("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ae("properties"))){let e=this.properties,t=[...Yt(e),...Xt(e)];for(let r of t)this.createProperty(r,e[r])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let r=this._$Eu(e,t);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let r of t)e.unshift(Ae(r))}else s!==void 0&&e.push(Ae(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rt(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),r=this.constructor._$Eu(s,t);if(r!==void 0&&t.reflect===!0){let i=(t.converter?.toAttribute!==void 0?t.converter:oe).toAttribute(e,t.type);this._$Em=s,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(s,e){let t=this.constructor,r=t._$Eh.get(s);if(r!==void 0&&this._$Em!==r){let i=t.getPropertyOptions(r),a=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:oe;this._$Em=r;let d=a.fromAttribute(e,i.type);this[r]=d??this._$Ej?.get(r)??d,this._$Em=null}}requestUpdate(s,e,t,r=!1,i){if(s!==void 0){let a=this.constructor;if(r===!1&&(i=this[s]),t??=a.getPropertyOptions(s),!((t.hasChanged??ye)(i,e)||t.useDefault&&t.reflect&&i===this._$Ej?.get(s)&&!this.hasAttribute(a._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:r,wrapped:i},a){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,a??e??this[s]),i!==!0||a!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),r===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[r,i]of t){let{wrapped:a}=i,d=this[r];a!==!0||this._$AL.has(r)||d===void 0||this.C(r,void 0,i,d)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[ae("elementProperties")]=new Map,A[ae("finalized")]=new Map,er?.({ReactiveElement:A}),(ve.reactiveElementVersions??=[]).push("2.1.2");var je=globalThis,nt=n=>n,be=je.trustedTypes,at=be?be.createPolicy("lit-html",{createHTML:n=>n}):void 0,ct="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,pt="?"+z,tr=`<${pt}>`,J=document,de=()=>J.createComment(""),he=n=>n===null||typeof n!="object"&&typeof n!="function",We=Array.isArray,rr=n=>We(n)||typeof n?.[Symbol.iterator]=="function",Ie=`[ 	
\f\r]`,le=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ot=/-->/g,lt=/>/g,K=RegExp(`>|${Ie}(?:([^\\s"'>=/]+)(${Ie}*=${Ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),dt=/'/g,ht=/"/g,mt=/^(?:script|style|textarea|title)$/i,Ue=n=>(s,...e)=>({_$litType$:n,strings:s,values:e}),o=Ue(1),jr=Ue(2),Wr=Ue(3),Y=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),ut=new WeakMap,V=J.createTreeWalker(J,129);function ft(n,s){if(!We(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return at!==void 0?at.createHTML(s):s}var sr=(n,s)=>{let e=n.length-1,t=[],r,i=s===2?"<svg>":s===3?"<math>":"",a=le;for(let d=0;d<e;d++){let u=n[d],p,_,y=-1,x=0;for(;x<u.length&&(a.lastIndex=x,_=a.exec(u),_!==null);)x=a.lastIndex,a===le?_[1]==="!--"?a=ot:_[1]!==void 0?a=lt:_[2]!==void 0?(mt.test(_[2])&&(r=RegExp("</"+_[2],"g")),a=K):_[3]!==void 0&&(a=K):a===K?_[0]===">"?(a=r??le,y=-1):_[1]===void 0?y=-2:(y=a.lastIndex-_[2].length,p=_[1],a=_[3]===void 0?K:_[3]==='"'?ht:dt):a===ht||a===dt?a=K:a===ot||a===lt?a=le:(a=K,r=void 0);let L=a===K&&n[d+1].startsWith("/>")?" ":"";i+=a===le?u+tr:y>=0?(t.push(p),u.slice(0,y)+ct+u.slice(y)+z+L):u+z+(y===-2?d:L)}return[ft(n,i+(n[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},ue=class n{constructor({strings:s,_$litType$:e},t){let r;this.parts=[];let i=0,a=0,d=s.length-1,u=this.parts,[p,_]=sr(s,e);if(this.el=n.createElement(p,t),V.currentNode=this.el.content,e===2||e===3){let y=this.el.content.firstChild;y.replaceWith(...y.childNodes)}for(;(r=V.nextNode())!==null&&u.length<d;){if(r.nodeType===1){if(r.hasAttributes())for(let y of r.getAttributeNames())if(y.endsWith(ct)){let x=_[a++],L=r.getAttribute(y).split(z),ee=/([.?@])?(.*)/.exec(x);u.push({type:1,index:i,name:ee[2],strings:L,ctor:ee[1]==="."?Re:ee[1]==="?"?Oe:ee[1]==="@"?Fe:re}),r.removeAttribute(y)}else y.startsWith(z)&&(u.push({type:6,index:i}),r.removeAttribute(y));if(mt.test(r.tagName)){let y=r.textContent.split(z),x=y.length-1;if(x>0){r.textContent=be?be.emptyScript:"";for(let L=0;L<x;L++)r.append(y[L],de()),V.nextNode(),u.push({type:2,index:++i});r.append(y[x],de())}}}else if(r.nodeType===8)if(r.data===pt)u.push({type:2,index:i});else{let y=-1;for(;(y=r.data.indexOf(z,y+1))!==-1;)u.push({type:7,index:i}),y+=z.length-1}i++}}static createElement(s,e){let t=J.createElement("template");return t.innerHTML=s,t}};function te(n,s,e=n,t){if(s===Y)return s;let r=t!==void 0?e._$Co?.[t]:e._$Cl,i=he(s)?void 0:s._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(n),r._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=r:e._$Cl=r),r!==void 0&&(s=te(n,r._$AS(n,s.values),r,t)),s}var Me=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,r=(s?.creationScope??J).importNode(e,!0);V.currentNode=r;let i=V.nextNode(),a=0,d=0,u=t[0];for(;u!==void 0;){if(a===u.index){let p;u.type===2?p=new ce(i,i.nextSibling,this,s):u.type===1?p=new u.ctor(i,u.name,u.strings,this,s):u.type===6&&(p=new ze(i,this,s)),this._$AV.push(p),u=t[++d]}a!==u?.index&&(i=V.nextNode(),a++)}return V.currentNode=J,r}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},ce=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,r){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=te(this,s,e),he(s)?s===w||s==null||s===""?(this._$AH!==w&&this._$AR(),this._$AH=w):s!==this._$AH&&s!==Y&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):rr(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==w&&he(this._$AH)?this._$AA.nextSibling.data=s:this.T(J.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,r=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=ue.createElement(ft(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===r)this._$AH.p(e);else{let i=new Me(r,this),a=i.u(this.options);i.p(e),this.T(a),this._$AH=i}}_$AC(s){let e=ut.get(s.strings);return e===void 0&&ut.set(s.strings,e=new ue(s)),e}k(s){We(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,r=0;for(let i of s)r===e.length?e.push(t=new n(this.O(de()),this.O(de()),this,this.options)):t=e[r],t._$AI(i),r++;r<e.length&&(this._$AR(t&&t._$AB.nextSibling,r),e.length=r)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=nt(s).nextSibling;nt(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},re=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,r,i){this.type=1,this._$AH=w,this._$AN=void 0,this.element=s,this.name=e,this._$AM=r,this.options=i,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=w}_$AI(s,e=this,t,r){let i=this.strings,a=!1;if(i===void 0)s=te(this,s,e,0),a=!he(s)||s!==this._$AH&&s!==Y,a&&(this._$AH=s);else{let d=s,u,p;for(s=i[0],u=0;u<i.length-1;u++)p=te(this,d[t+u],e,u),p===Y&&(p=this._$AH[u]),a||=!he(p)||p!==this._$AH[u],p===w?s=w:s!==w&&(s+=(p??"")+i[u+1]),this._$AH[u]=p}a&&!r&&this.j(s)}j(s){s===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},Re=class extends re{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===w?void 0:s}},Oe=class extends re{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==w)}},Fe=class extends re{constructor(s,e,t,r,i){super(s,e,t,r,i),this.type=5}_$AI(s,e=this){if((s=te(this,s,e,0)??w)===Y)return;let t=this._$AH,r=s===w&&t!==w||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,i=s!==w&&(t===w||r);r&&this.element.removeEventListener(this.name,this,t),i&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},ze=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){te(this,s)}};var ir=je.litHtmlPolyfillSupport;ir?.(ue,ce),(je.litHtmlVersions??=[]).push("3.3.2");var gt=(n,s,e)=>{let t=e?.renderBefore??s,r=t._$litPart$;if(r===void 0){let i=e?.renderBefore??null;t._$litPart$=r=new ce(s.insertBefore(de(),i),i,void 0,e??{})}return r._$AI(n),r};var Ge=globalThis,f=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=gt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Y}};f._$litElement$=!0,f.finalized=!0,Ge.litElementHydrateSupport?.({LitElement:f});var nr=Ge.litElementPolyfillSupport;nr?.({LitElement:f});(Ge.litElementVersions??=[]).push("4.2.2");var v=n=>(s,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(n,s)}):customElements.define(n,s)};var ar={attribute:!0,type:String,converter:oe,reflect:!1,hasChanged:ye},or=(n=ar,s,e)=>{let{kind:t,metadata:r}=e,i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),t==="setter"&&((n=Object.create(n)).wrapped=!0),i.set(e.name,n),t==="accessor"){let{name:a}=e;return{set(d){let u=s.get.call(this);s.set.call(this,d),this.requestUpdate(a,u,n,!0,d)},init(d){return d!==void 0&&this.C(a,void 0,n,d),d}}}if(t==="setter"){let{name:a}=e;return function(d){let u=this[a];s.call(this,d),this.requestUpdate(a,u,n,!0,d)}}throw Error("Unsupported decorator location: "+t)};function c(n){return(s,e)=>typeof e=="object"?or(n,s,e):((t,r,i)=>{let a=r.hasOwnProperty(i);return r.constructor.createProperty(i,t),a?Object.getOwnPropertyDescriptor(r,i):void 0})(n,s,e)}function m(n){return c({...n,state:!0,attribute:!1})}function H(n,s,e){let t=n?.localize?.(s);return t&&t!==s?t:e}function qe(n){let s=n.replaceAll("_"," ").toLowerCase();return s.charAt(0).toUpperCase()+s.slice(1)}function j(n,s){return H(n,`component.ambience.matcher.${s}`,qe(s))}function _t(n,s){return H(n,`component.ambience.action.${s}`,qe(s))}function se(n,s){return H(n,`component.ambience.anchor.${s}`,qe(s))}function X(n,s,e){let t=e[s]?.label;if(t)return t;let r=s.charAt(0).toUpperCase()+s.slice(1);return H(n,`component.ambience.time_of_day_period.${s}`,r)}function l(n,s,e){return H(n,`component.ambience.${s}`,e)}var lr=["mon","tue","wed","thu","fri","sat","sun"],dr=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function we(n,s){return H(n,`component.ambience.weekday.${lr[s]}`,dr[s]??String(s))}var hr={weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"};function ke(n,s){return H(n,`component.ambience.day_item.${s}`,hr[s]??s)}var ur=["January","February","March","April","May","June","July","August","September","October","November","December"];function ie(n,s){return H(n,`component.ambience.month.${s}`,ur[s-1]??String(s))}var cr={"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"};function xe(n,s){return H(n,`component.ambience.weather_condition.${s}`,cr[s]??s)}var pr={temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"};function pe(n,s){return H(n,`component.ambience.weather_attr.${s}`,pr[s]??s)}var mr={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},fr={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},gr={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function Be(n,s,e){if(s==="humidity")return"%";let t=gr[s];if(t){let a=e?.attributes?.[t];if(typeof a=="string"&&a)return a}let r=fr[s],i=n?.config?.unit_system;return r&&i&&typeof i[r]=="string"?i[r]:mr[s]??""}var _r={is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"};function T(n,s){return H(n,`component.ambience.state_op.${s}`,_r[s]??s)}var vr=["ha-input","ha-textfield","ha-form"],yr=["ha-input","ha-textfield"];function vt(){for(let n of yr)if(customElements.get(n))return n;return null}function W(n,s){for(let e of vr)customElements.get(e)||customElements.whenDefined(e).then(()=>n.requestUpdate())}async function yt(n){return n.callWS({type:"ambience/areas/list"})}async function bt(n,s){return n.callWS({type:"ambience/area/get",area_id:s})}async function $t(n,s,e){return n.callWS({type:"ambience/area/save",area_id:s,config:e})}async function wt(n){return n.callWS({type:"ambience/floors/list"})}async function kt(n,s){return n.callWS({type:"ambience/floor/get",floor_id:s})}async function xt(n,s,e){return n.callWS({type:"ambience/floor/save",floor_id:s,config:e})}async function St(n){return n.callWS({type:"ambience/house/get"})}async function Et(n,s){return n.callWS({type:"ambience/house/save",config:s})}async function Se(n){return n.callWS({type:"ambience/matchers/list"})}async function Ct(n){return n.callWS({type:"ambience/actions/list"})}async function Ee(n){return n.callWS({type:"ambience/time_of_day_periods/list"})}async function Pt(n,s,e){return n.callWS({type:"ambience/time_of_day_periods/save",custom:s,hidden:e})}async function Ce(n){return n.callWS({type:"ambience/matchers/day/config/list"})}async function Lt(n,s,e){return n.callWS({type:"ambience/matchers/day/config/save",workday_sensor:s,workday_calendar:e})}async function Pe(n){return n.callWS({type:"ambience/matchers/weather/config/list"})}async function Ht(n,s,e){return n.callWS({type:"ambience/matchers/weather/config/save",entity:s,groups:e})}async function Tt(n,s){return n.callWS({type:"ambience/state/known_states",entity_id:s})}function Le(n,s="New rule"){return n.name&&n.name.trim()?n.name:s}function He(n,s,e){return s==null?l(e.hass,"ui.summary_any_paren","(any)"):n==="time_of_day"?Te(s,e):n==="day"?br(s,e):n==="weather"?kr(s,e):n==="state"?Ve(s,e):String(s)}function br(n,s={}){if(n===null)return l(s.hass,"day_summary.any","any");let e=n.include??[],t=n.exclude??[],r=e.length===0?l(s.hass,"day_summary.any_day","any day"):e.map(a=>Dt(a,s)).join(", ");if(t.length===0)return r;let i=l(s.hass,"day_summary.except","except");return`${r} (${i} ${t.map(a=>Dt(a,s)).join(", ")})`}function Dt(n,s){switch(n.kind){case"weekday":return n.days.map(e=>we(s.hass,e)).join("/");case"day_of_month":return`${l(s.hass,"day_summary.day_prefix","day")} ${n.days}`;case"date":return`${ie(s.hass,n.month)} ${n.day}`;case"date_range":return`${ie(s.hass,n.from.month)} ${n.from.day} \u2192 ${ie(s.hass,n.to.month)} ${n.to.day}`;case"last_day":return l(s.hass,"day_summary.last_day","last day");case"workday":return l(s.hass,"day_summary.workday","workday");case"holiday":return l(s.hass,"day_summary.holiday","holiday");case"first_workday":return l(s.hass,"day_summary.first_workday","first workday");case"last_workday":return l(s.hass,"day_summary.last_workday","last workday")}}var $r={"<":"<","<=":"\u2264",">":">",">=":"\u2265"};function wr(n){return n.split(/[\s_-]+/).filter(s=>s!=="").map(s=>s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()).join(" ")}function kr(n,s={}){if(n===null)return l(s.hass,"ui.summary_any","any");let e=new Map((s.weatherGroups??[]).map(a=>[a.id,a.label])),t=(n.groups??[]).map(a=>e.get(a)??wr(a)).join("/"),r=(n.thresholds??[]).map(a=>`${pe(s.hass,a.attribute)} ${$r[a.op]??a.op} ${a.value}`).join(", "),i=[t,r].filter(a=>a!=="");return i.length===0?l(s.hass,"ui.summary_any","any"):i.join(", ")}function xr(n,s){let t=n.hass?.states?.[s]?.attributes?.friendly_name;return typeof t=="string"&&t?t:s}function Ve(n,s={}){return n==null?l(s.hass,"ui.summary_any","any"):Ke(n,s)}function Ke(n,s){if(n.kind==="is"||n.kind==="is_not"||n.kind===">"||n.kind===">="||n.kind==="<"||n.kind==="<="){let e=T(s.hass,n.kind),r=n.kind!=="is"&&n.kind!=="is_not"?n.states[0]??"":n.states.join("/"),i=xr(s,n.entity_id),d=`${n.attribute?`${i}.${n.attribute}`:i} ${e} ${r}`;return n.for&&Sr(n.for)?`${d} ${l(s.hass,"ui.for_prefix","for")} \u2265${Er(n.for)}`:d}if(n.kind==="and"||n.kind==="or"){let e=` ${T(s.hass,n.kind)} `;return n.items.map(t=>Nt(t,s)).join(e)}return n.kind==="not"?`${T(s.hass,"not")} ${Nt(n.item,s)}`:""}function Nt(n,s){return n.kind==="and"||n.kind==="or"?`(${Ke(n,s)})`:Ke(n,s)}function Sr(n){return n.h>0||n.m>0||n.s>0}function Er(n){let s=[];return n.h&&s.push(`${n.h}h`),n.m&&s.push(`${n.m}m`),n.s&&s.push(`${n.s}s`),s.length?s.join(" "):"0s"}function Te(n,s){if(n===null)return l(s.hass,"ui.summary_any","any");let e=Array.isArray(n)?n:[n],t=s.periods?.custom??{};return e.map(r=>"period"in r?X(s.hass,r.period,t):`${At(r.from,s)} \u2192 ${At(r.to,s)}`).join(", ")}function At(n,s){if(n.kind==="time")return`${String(n.hh).padStart(2,"0")}:${String(n.mm).padStart(2,"0")}`;let e=se(s.hass,n.anchor);if(n.offset_min===0)return e;let t=Math.abs(n.offset_min),r=t%60===0?`${t/60}${l(s.hass,"ui.unit_hour_abbr","h")}`:`${t}${l(s.hass,"ui.unit_min_abbr","m")}`;return`${e}${n.offset_min<0?"-":"+"}${r}`}function It(n,s,e){let t=_t(e.hass,n.action),r=s?.domains?.[0]??l(e.hass,"ui.target_noun","target"),i=n.entity_ids.length,a;i===0?a=l(e.hass,"ui.no_targets","(no targets)"):i===1?a=`1 ${r}`:a=`${i} ${r}s`;let d={};for(let p of s?.target_params??[])p.unit&&(d[p.name]=p.unit);let u=Object.entries(n.params).filter(([,p])=>p!=null&&p!=="").map(([p,_])=>`${p} ${_}${d[p]??""}`).join(", ");return u?`${t}: ${a}, ${u}`:`${t}: ${a}`}var S=class extends f{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_summary(e){let t=new Map((this.matchers??[]).map(u=>[u.name,u.priority])),r=Object.keys(e.when).filter(u=>e.when[u]!=null).sort((u,p)=>(t.get(u)??1/0)-(t.get(p)??1/0)),i=r.length===0?l(this.hass,"ui.summary_any","any"):r.map(u=>`${j(this.hass,u)}: ${He(u,e.when[u],{hass:this.hass,periods:this.periods,weatherGroups:this.weatherConfig?.groups})}`).join(", "),a=e.actions.length,d=a===1?l(this.hass,"ui.action_singular","action"):l(this.hass,"ui.action_plural","actions");return`${i} \xB7 ${a} ${d}`}_onDragStart(e){this._dragFrom=e}_onDragOver(e,t){this._dragFrom===null||t===this._dragFrom||(e.preventDefault(),this._dragOver=t)}_onDrop(e){let t=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(t===null||t===e)&&this._emit("reorder-rules",{from:t,to:e})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(e,t){let r=t.name||l(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(e+1));window.confirm(l(this.hass,"ui.confirm_delete",'Delete "{name}"?').replace("{name}",r))&&this._emit("delete-rule",{index:e})}render(){return this.rules.length===0?o`
        <p class="empty">${l(this.hass,"ui.no_rules_yet","No rules yet.")}</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          ${l(this.hass,"ui.add_rule","+ Add rule")}
        </button>
      `:o`
      <ul>
        ${this.rules.map((e,t)=>o`
            <li
              class=${this._dragOver===t?"drag-over":""}
              draggable=${!this.autoSort}
              @dragstart=${()=>this._onDragStart(t)}
              @dragover=${r=>this._onDragOver(r,t)}
              @drop=${()=>this._onDrop(t)}
              @dragend=${this._onDragEnd}
            >
              ${this.autoSort?"":o`<span class="handle" title=${l(this.hass,"ui.drag_to_reorder","Drag to reorder")}>⠿</span>`}
              <span class="idx">${t+1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${()=>this._emit("edit-rule",{index:t})}
                >
                  ${Le(e,l(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(t+1)))}
                </div>
                <div class="summary">${this._summary(e)}</div>
              </div>
              <button
                @click=${()=>this._emit("duplicate-rule",{index:t})}
                title=${l(this.hass,"ui.duplicate","Duplicate")}
              >
                ⧉
              </button>
              <button
                @click=${()=>this._confirmDelete(t,e)}
                title=${l(this.hass,"ui.title_delete","Delete")}
              >
                🗑
              </button>
            </li>
          `)}
      </ul>
      <button class="add" @click=${()=>this._emit("add-rule",{})}>
        ${l(this.hass,"ui.add_rule","+ Add rule")}
      </button>
    `}};S.styles=g`
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
  `,h([c({attribute:!1})],S.prototype,"rules",2),h([c({type:Boolean})],S.prototype,"autoSort",2),h([c({attribute:!1})],S.prototype,"periods",2),h([c({attribute:!1})],S.prototype,"weatherConfig",2),h([c({attribute:!1})],S.prototype,"hass",2),h([c({attribute:!1})],S.prototype,"matchers",2),h([m()],S.prototype,"_dragFrom",2),h([m()],S.prototype,"_dragOver",2),S=h([v("ambience-rules-list")],S);function Mt(n,s,e){let t=n;if(!t?.entities)return[];let r=t.entities,i=t.devices??{},a=t.areas??{},d=s.kind==="area"?new Set([s.id]):s.kind==="floor"?new Set(Object.values(a).filter(p=>p.floor_id===s.id).map(p=>p.area_id)):null,u=p=>{let _=p.area_id??(p.device_id?i[p.device_id]?.area_id??null:null);return _==null?!1:d===null?!0:d.has(_)};return Object.values(r).filter(u).filter(p=>e.includes(p.entity_id.split(".")[0])).map(p=>p.entity_id).sort()}var D=class extends f{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=e=>{this._open&&(e.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=e=>{e.stopPropagation();let t=e.detail.value?.scene??"";this._emit(t.trim()===""?null:t)};this._sceneComputeLabel=e=>e.name==="scene"?l(this.hass,"ui.scene_name","Scene name"):e.name}connectedCallback(){super.connectedCallback(),W(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(e){e.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(t=>({value:t,label:t})),custom_value:!0,mode:"dropdown"}}}])}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target.value;this._emit(t.trim()===""?null:t),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(e){e.key==="Escape"&&this._open&&(this._open=!1,e.stopPropagation())}_toggle(e){e.preventDefault(),this._open=!this._open}_select(e,t){t.preventDefault(),this._emit(e),this._open=!1}render(){if(customElements.get("ha-form")){let e={scene:this.value??""};return o`
        <ha-form
          .hass=${this.hass}
          .schema=${this._schema}
          .data=${e}
          .computeLabel=${this._sceneComputeLabel}
          @value-changed=${this._onHaFormValueChanged}
        ></ha-form>
      `}return o`
      <div class="control">
        <input
          type="text"
          placeholder=${l(this.hass,"ui.scene_name","Scene name")}
          .value=${this.value??""}
          @input=${this._onInput}
          @focus=${this._onFocus}
          @keydown=${this._onKeyDown}
        />
        <button
          class="toggle"
          type="button"
          tabindex="-1"
          aria-label=${l(this.hass,"ui.show_scene_suggestions","Show scene suggestions")}
          @mousedown=${this._toggle}
        >
          ▼
        </button>
      </div>
      ${this._open?o`
            <div class="menu" role="listbox">
              ${this.suggestions.length===0?o`<div class="empty">
                    ${l(this.hass,"ui.no_scenes_yet","No scenes yet \u2014 type to create one")}
                  </div>`:this.suggestions.map(e=>o`
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
    `}};D.styles=g`
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
  `,h([c({attribute:!1})],D.prototype,"hass",2),h([c()],D.prototype,"value",2),h([c({attribute:!1})],D.prototype,"suggestions",2),h([m()],D.prototype,"_schema",2),h([m()],D.prototype,"_open",2),D=h([v("ambience-scene-combobox")],D);var Cr=["dawn","sunrise","noon","sunset","dusk","midnight"],Z=class extends f{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onKindChange(e){let t=e.target.value;t!==this.value.kind&&(t==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let t=e.target.value,[r,i]=t.split(":").map(a=>parseInt(a,10));Number.isNaN(r)||Number.isNaN(i)||this._emit({kind:"time",hh:r,mm:i})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let t=e.target.value;this._emit({kind:"sun",anchor:t,offset_min:this.value.offset_min})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let t=parseInt(e.target.value,10);Number.isNaN(t)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:t})}_renderTime(e){let t=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return o`<input type="time" .value=${t} @input=${this._onTimeChange} />`}_renderSun(e){let t=Pr(e.offset_min,this.hass);return o`
      <select @change=${this._onAnchorChange}>
        ${Cr.map(r=>o`<option value=${r} ?selected=${r===e.anchor}>${se(this.hass,r)}</option>`)}
      </select>
      <input
        type="number"
        step="1"
        placeholder=${l(this.hass,"ui.offset_placeholder","\xB1min, e.g. -30")}
        .value=${String(e.offset_min)}
        @input=${this._onOffsetChange}
      />
      <span class="offset-hint">${t}</span>
    `}render(){return o`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>${l(this.hass,"ui.endpoint_time","Time")}</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>${l(this.hass,"ui.endpoint_sun","Sun")}</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};Z.styles=g`
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
  `,h([c({attribute:!1})],Z.prototype,"hass",2),h([c({attribute:!1})],Z.prototype,"value",2),Z=h([v("ambience-time-endpoint")],Z);function Pr(n,s){if(n===0)return"";let e=Math.abs(n),t=n<0?"\u2212":"+";if(e%60===0){let r=e/60,i=r===1?l(s,"ui.unit_hour","hour"):l(s,"ui.unit_hours","hours");return`${t}${r} ${i}`}return`${t}${e} ${l(s,"ui.unit_min","min")}`}var me={kind:"any"},Rt={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},N=class extends f{constructor(){super(...arguments);this.value=null;this._entries=[me];this._openIdx=0}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[me]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(t=>{let r=this._entries[this._openIdx];if(!r)return;let i=r.kind==="any"?"__any__":r.kind==="range"?"__custom__":r.period;t.value!==i&&(t.value=i)})}_predicateToEntries(e){return e===null?[me]:(Array.isArray(e)?e:[e]).map(r=>"period"in r?{kind:"period",period:r.period}:{kind:"range",from:r.from,to:r.to})}_emit(e){let t=e.filter(i=>i.kind!=="any").map(i=>i.kind==="period"?{period:i.period}:{from:i.from,to:i.to}),r=t.length===0?null:t.length===1?t[0]:t;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let e=Object.keys(this.periods.builtins),t=Object.keys(this.periods.custom).filter(i=>!(i in this.periods.builtins)),r=new Set(this.periods.hidden);return[...e.filter(i=>!r.has(i)),...t]}_onSelectChange(e,t){let r=t.target.value,i=[...this._entries];r==="__any__"?i[e]=me:r==="__custom__"?i[e]={kind:"range",...Rt}:i[e]={kind:"period",period:r},this._entries=i,this._emit(i)}_onRangeChange(e,t,r){r.stopPropagation();let i=this._entries[e];if(!i||i.kind!=="range")return;let a=[...this._entries];a[e]={...i,[t]:r.detail.value},this._entries=a,this._emit(a)}_onRemove(e){let t=this._entries.filter((r,i)=>i!==e);this._entries=t.length===0?[me]:t,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...Rt}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,t){let r;return e.kind==="any"?r=l(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?r=Te({period:e.period},{hass:this.hass,periods:this.periods}):r=Te({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),o`
      <div class="summary-chip" @click=${()=>this._onChipClick(t)}>
        <span class="chip-label">${r}</span>
        ${this._entries.length>1?o`<button class="remove" @click=${i=>{i.stopPropagation(),this._onRemove(t)}} title=${l(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,t,r){let i=this._effectiveIds(),a=this.periods?.custom??{};return o`
      <div class="entry">
        <div class="entry-header">
          <select @change=${d=>this._onSelectChange(t,d)}>
            ${r?o`<option value="__any__">${l(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${l(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${i.map(d=>o`<option value=${d}>
                ${X(this.hass,d,a)}${a[d]&&!this.periods?.builtins[d]?l(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?o`<button class="remove" @click=${()=>this._onRemove(t)} title=${l(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${e.kind==="range"?o`
              <div class="range-row">
                <label>${l(this.hass,"ui.from_label","From")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.from}
                  @value-changed=${d=>this._onRangeChange(t,"from",d)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${l(this.hass,"ui.to_label","To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${d=>this._onRangeChange(t,"to",d)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(r=>r.kind!=="any"),t=this._entries.length>1;return o`
      ${this._entries.map((r,i)=>t&&i!==this._openIdx?this._renderChip(r,i):this._renderEntry(r,i,i===0))}
      ${e?o`<button class="add-btn" @click=${this._onAdd}>${l(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};N.styles=g`
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
  `,h([c({attribute:!1})],N.prototype,"value",2),h([c({attribute:!1})],N.prototype,"periods",2),h([c({attribute:!1})],N.prototype,"hass",2),h([m()],N.prototype,"_entries",2),h([m()],N.prototype,"_openIdx",2),N=h([v("ambience-time-of-day-input")],N);function Ot(n){if(typeof n!="string")return!1;let s=n.split(",").map(e=>e.trim()).filter(e=>e!=="");if(s.length===0)return!1;for(let e of s)if(e.includes("-")){let t=e.split("-").map(a=>a.trim());if(t.length!==2||!/^\d+$/.test(t[0])||!/^\d+$/.test(t[1]))return!1;let r=Number(t[0]),i=Number(t[1]);if(!(r>=1&&r<=i&&i<=31))return!1}else{if(!/^\d+$/.test(e))return!1;let t=Number(e);if(!(t>=1&&t<=31))return!1}return!0}var Je=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Lr=new Set(["workday","holiday"]),Hr=new Set(["first_workday","last_workday"]),Tr=[31,29,31,30,31,30,31,31,30,31,30,31];function fe(n){return Tr[n-1]??31}function Ye(n){switch(n){case"weekday":return{kind:n,days:[]};case"day_of_month":return{kind:n,days:""};case"date":return{kind:n,month:1,day:1};case"date_range":return{kind:n,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:n}}}var U=class extends f{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?l(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return l(this.hass,"ui.field_kind","Kind");case"days":return l(this.hass,"ui.field_days_of_month","Days of month");case"month":return l(this.hass,"ui.field_month","Month");case"day":return l(this.hass,"ui.field_day","Day");case"from_month":return l(this.hass,"ui.field_from_month","From month");case"from_day":return l(this.hass,"ui.field_from_day","From day");case"to_month":return l(this.hass,"ui.field_to_month","To month");case"to_day":return l(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let t=e.include.length===0&&e.exclude.length===0;this.value=t?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_addItem(e,t){let r=this._current();r[e]=[...r[e],Ye(t)],this._emit(r)}_removeItem(e,t){let r=this._current();r[e]=r[e].filter((i,a)=>a!==t),this._emit(r)}_updateItem(e,t,r){let i=this._current();i[e]=i[e].map((a,d)=>d===t?r:a),this._emit(i)}_kindDisabled(e){return!!(Lr.has(e)&&!this.dayConfig.workday_sensor||Hr.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:Je.map(e=>({value:e,label:ke(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:ie(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:fe(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,t){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(t.days??"")}:e}_setDatePart(e,t,r){let i=Number(r);if(!Number.isFinite(i)||i<1)return e;if(e.kind==="date"){let{month:a,day:d}=e;return t==="month"&&(a=i),t==="day"&&(d=i),{kind:"date",month:a,day:Math.min(d,fe(a))}}if(e.kind==="date_range"){let a={...e.from},d={...e.to};return t==="from_month"&&(a.month=i),t==="from_day"&&(a.day=i),t==="to_month"&&(d.month=i),t==="to_day"&&(d.day=i),a.day=Math.min(a.day,fe(a.month)),d.day=Math.min(d.day,fe(d.month)),{kind:"date_range",from:a,to:d}}return e}_onKindForm(e,t,r){let i=r.kind;if(!i){this._removeItem(e,t);return}if(this._kindDisabled(i))return;let a=this._current()[e][t];a&&a.kind===i||this._updateItem(e,t,Ye(i))}_dayOfMonthError(e){return e.trim()===""||Ot(e)?null:l(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(e,t,r,i){this._updateItem(e,t,this._bodyPatch(r,i))}_renderWeekday(e,t,r){return o`${[0,1,2,3,4,5,6].map(i=>o`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${r.days.includes(i)}
          @change=${a=>{let u=a.target.checked?[...r.days,i].sort((p,_)=>p-_):r.days.filter(p=>p!==i);this._updateItem(e,t,{kind:"weekday",days:u})}}
        />${we(this.hass,i)}
      </label>
    `)}`}_renderKindPicker(e,t,r){return customElements.get("ha-form")?o`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:r.kind}}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${i=>{i.stopPropagation(),this._onKindForm(e,t,i.detail.value)}}
      ></ha-form>`:o`
      <select
        class="kind"
        .value=${r.kind}
        @change=${i=>{let a=i.target.value;this._kindDisabled(a)||a===r.kind||this._updateItem(e,t,Ye(a))}}
      >
        ${Je.map(i=>o`<option value=${i} ?disabled=${this._kindDisabled(i)}>${ke(this.hass,i)}</option>`)}
      </select>
    `}_renderItemBody(e,t,r){if(r.kind==="weekday")return this._renderWeekday(e,t,r);if(customElements.get("ha-form")){if(r.kind==="date")return this._renderDateRow(e,t,r,"month","day",r.month,r.day);if(r.kind==="date_range")return o`
          ${this._renderDateRow(e,t,r,"from_month","from_day",r.from.month,r.from.day)}
          ${this._renderDateRow(e,t,r,"to_month","to_day",r.to.month,r.to.day)}
        `;let i=this._bodySchema(r);if(!i)return o``;let a=r.kind==="day_of_month"?this._dayOfMonthError(r.days):null;return o`<ha-form
        .hass=${this.hass}
        .schema=${i}
        .data=${this._bodyData(r)}
        .error=${a?{days:a}:void 0}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${d=>{d.stopPropagation(),this._onBodyForm(e,t,r,d.detail.value)}}
      ></ha-form>`}return this._renderNativeBody(e,t,r)}_renderDateRow(e,t,r,i,a,d,u){let p=(_,y)=>{this._updateItem(e,t,this._setDatePart(r,_,y[_]))};return o`
      <div class="date-row">
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:i,required:!0,selector:this._monthSelector()}]}
          .data=${{[i]:String(d)}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${_=>{_.stopPropagation(),p(i,_.detail.value)}}
        ></ha-form>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:a,required:!0,selector:this._daySelector(d)}]}
          .data=${{[a]:u}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${_=>{_.stopPropagation(),p(a,_.detail.value)}}
        ></ha-form>
      </div>
    `}_renderNativeBody(e,t,r){if(r.kind==="day_of_month"){let d=this._dayOfMonthError(r.days);return o`<input
        type="text" placeholder=${l(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${r.days}
        @change=${u=>this._updateItem(e,t,this._bodyPatch(r,{days:u.target.value}))}
      />${d?o`<div class="field-error">${d}</div>`:""}`}let i=(d,u)=>o`
      <input type="number" min="1" max="12" .value=${String(u)}
        @change=${p=>this._updateItem(e,t,this._setDatePart(r,d,p.target.value))} />
    `,a=(d,u,p)=>o`
      <input type="number" min="1" max=${String(fe(u))} .value=${String(p)}
        @change=${_=>this._updateItem(e,t,this._setDatePart(r,d,_.target.value))} />
    `;return r.kind==="date"?o`${i("month",r.month)} / ${a("day",r.month,r.day)}`:r.kind==="date_range"?o`
        <span>${l(this.hass,"ui.from","from")}</span>
        ${i("from_month",r.from.month)} / ${a("from_day",r.from.month,r.from.day)}
        <span>${l(this.hass,"ui.to","to")}</span>
        ${i("to_month",r.to.month)} / ${a("to_day",r.to.month,r.to.day)}
      `:o``}_renderAddPicker(e){let t=e==="include"?l(this.hass,"ui.add_include_item","+ Add include item"):l(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let r=()=>t;return o`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${r}
        @value-changed=${i=>{i.stopPropagation();let a=i.detail.value.kind;a&&!this._kindDisabled(a)&&this._addItem(e,a)}}
      ></ha-form>`}return o`
      <select
        .value=${""}
        @change=${r=>{let i=r.target.value;i&&(this._addItem(e,i),r.target.value="")}}
      >
        <option value="">${t}</option>
        ${Je.map(r=>o`<option value=${r} ?disabled=${this._kindDisabled(r)}>${ke(this.hass,r)}</option>`)}
      </select>
    `}_renderItem(e,t,r){return o`
      <div class="item">
        ${this._renderKindPicker(e,t,r)}
        <div class="body">${this._renderItemBody(e,t,r)}</div>
        <button class="remove" title=${l(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(e,t)}>✕</button>
      </div>
    `}_renderSection(e,t){return o`
      <div class="section">
        <h4>${e==="include"?l(this.hass,"ui.include","Include"):l(this.hass,"ui.exclude","Exclude")}</h4>
        ${t.length===0&&e==="include"?o`<div class="hint">${l(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${t.map((r,i)=>this._renderItem(e,i,r))}
        ${this._renderAddPicker(e)}
      </div>
    `}render(){let{include:e,exclude:t}=this._current();return o`
      ${this._renderSection("include",e)}
      ${this._renderSection("exclude",t)}
    `}};U.styles=g`
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
  `,h([c({attribute:!1})],U.prototype,"hass",2),h([c({attribute:!1})],U.prototype,"value",2),h([c({attribute:!1})],U.prototype,"dayConfig",2),U=h([v("ambience-day-predicate-input")],U);var Ft=["temperature","apparent_temperature","humidity","wind_speed","pressure"],zt=["<","<=",">",">="],jt={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},I=class extends f{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(e){let t=e.groups.length===0&&e.thresholds.length===0;this.value=t?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setGroups(e){this._emit({...this._current(),groups:e})}_addThreshold(){let e=this._current();e.thresholds=[...e.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(e)}_updateThreshold(e,t){let r=this._current();r.thresholds=r.thresholds.map((i,a)=>a===e?t:i),this._emit(r)}_removeThreshold(e){let t=this._current();t.thresholds=t.thresholds.filter((r,i)=>i!==e),this._emit(t)}_attributeSchema(e){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:Ft.map(t=>({value:t,label:pe(this.hass,t)}))}}}]}_opSchema(e){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:zt.map(t=>({value:t,label:jt[t]}))}}}]}_entityState(){let e=this.weatherEntity;return e?this.hass?.states?.[e]:void 0}_valueSchema(e,t){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:Be(this.hass,t,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(e=>({value:e.id,label:e.label}))}}}]}_renderGroups(e){return customElements.get("ha-form")?o`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{groups:e}}
        .computeLabel=${()=>""}
        @value-changed=${t=>{t.stopPropagation(),this._setGroups(t.detail.value.groups??[])}}
      ></ha-form>`:o`${this.groups.map(t=>o`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${e.includes(t.id)}
          @change=${r=>{let i=r.target.checked;this._setGroups(i?[...e,t.id]:e.filter(a=>a!==t.id))}} />${t.label}
      </label>`)}`}_renderAttributeSelect(e,t){return customElements.get("ha-form")?o`<ha-form
        class="attr-form"
        .hass=${this.hass}
        .schema=${this._attributeSchema(e)}
        .data=${{attribute:t.attribute}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation();let i=r.detail.value.attribute;i&&this._updateThreshold(e,{...t,attribute:i})}}
      ></ha-form>`:o`<select
      @change=${r=>this._updateThreshold(e,{...t,attribute:r.target.value})}>
      ${Ft.map(r=>o`<option value=${r} ?selected=${r===t.attribute}>${pe(this.hass,r)}</option>`)}
    </select>`}_renderOpSelect(e,t){return customElements.get("ha-form")?o`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(e)}
        .data=${{op:t.op}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation();let i=r.detail.value.op;i&&this._updateThreshold(e,{...t,op:i})}}
      ></ha-form>`:o`<select
      @change=${r=>this._updateThreshold(e,{...t,op:r.target.value})}>
      ${zt.map(r=>o`<option value=${r} ?selected=${r===t.op}>${jt[r]}</option>`)}
    </select>`}_renderValueInput(e,t){if(customElements.get("ha-form"))return o`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(e,t.attribute)}
        .data=${{value:t.value}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation();let a=i.detail.value.value;typeof a=="number"&&Number.isFinite(a)&&this._updateThreshold(e,{...t,value:a})}}
      ></ha-form>`;let r=Be(this.hass,t.attribute,this._entityState());return o`<span class="value-wrap">
      <input type="number" .value=${String(t.value)}
        @change=${i=>{let a=Number(i.target.value);Number.isFinite(a)&&this._updateThreshold(e,{...t,value:a})}} />
      <span class="unit">${r}</span>
    </span>`}_renderThreshold(e,t){return o`
      <div class="threshold">
        ${this._renderAttributeSelect(e,t)}
        ${this._renderOpSelect(e,t)}
        ${this._renderValueInput(e,t)}
        <button class="remove" title=${l(this.hass,"ui.remove","Remove")} @click=${()=>this._removeThreshold(e)}>✕</button>
      </div>
    `}render(){let{groups:e,thresholds:t}=this._current();return o`
      <div class="section">
        <h4>${l(this.hass,"ui.groups","Groups")}</h4>
        ${this._renderGroups(e)}
      </div>
      <div class="section">
        <h4>${l(this.hass,"ui.thresholds","Thresholds")}</h4>
        ${t.map((r,i)=>this._renderThreshold(i,r))}
        <button class="add" @click=${()=>this._addThreshold()}>${l(this.hass,"ui.add_threshold","+ Add threshold")}</button>
      </div>
    `}};I.styles=g`
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
  `,h([c({attribute:!1})],I.prototype,"hass",2),h([c({attribute:!1})],I.prototype,"value",2),h([c({attribute:!1})],I.prototype,"groups",2),h([c({attribute:!1})],I.prototype,"weatherEntity",2),I=h([v("ambience-weather-predicate-input")],I);var k=class extends f{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[]}async updated(e){if(e.has("value")){let r=e.get("value")?.entity_id,i=this.value.entity_id;if(i&&i!==r&&this.hass)try{let a=await Tt(this.hass,i);this._knownStates=a.states}catch{this._knownStates=[]}}}_normalize(e){let t={...e};return t.attribute===""&&(t.attribute=null),t.for&&t.for.h===0&&t.for.m===0&&t.for.s===0&&(t.for=null),t}_emit(e){let t=this._normalize(e);this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_autoFlipOp(e){let t=this._isNumericTargetFor(e),r=this._isNumericOp(e.kind);return t&&!r?{...e,kind:">"}:!t&&r?{...e,kind:"is"}:e}_setEntity(e){this._emit(this._autoFlipOp({...this.value,entity_id:e,states:[],attribute:null}))}_setAttribute(e){this._emit(this._autoFlipOp({...this.value,attribute:e}))}_setOp(e){this._emit({...this.value,kind:e})}_setStates(e){this._emit({...this.value,states:e})}_setValueAt(e,t){if(this._isNumericOp(this.value.kind)){this._setStates([t]);return}let r=this.value.states.slice();t===""?r.splice(e,1):r[e]=t,this._setStates(r)}_addValue(e){e&&this._setStates([...this.value.states,e])}_removeValueAt(e){let t=this.value.states.slice();t.splice(e,1),this._setStates(t)}_setForDuration(e){this._emit({...this.value,for:e})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(e){if(!e)return[];let r=this.hass?.states?.[e]?.attributes;return r?Object.keys(r).sort():[]}_attributeSchema(){let e=this._knownAttributesFor(this.value.entity_id);return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:k._STATE_SENTINEL,label:k._STATE_SENTINEL},...e.map(t=>({value:t,label:t}))]}}}]}_attributeData(){let e=this.value.attribute;return e?{attribute:e}:{attribute:k._STATE_SENTINEL}}_setAttributeFromHaForm(e){e===k._STATE_SENTINEL?this._setAttribute(""):this._setAttribute(e)}_isNumericOp(e){return k._NUMERIC_OPS.includes(e)}_isNumericTargetFor(e){let r=this.hass?.states?.[e.entity_id];if(!r)return!1;if(e.attribute)return typeof r.attributes?.[e.attribute]=="number";let i=r.state;return typeof i!="string"||i===""||i==="unknown"||i==="unavailable"?!1:Number.isFinite(Number(i))}_opSchema(){let e=this._isNumericTargetFor(this.value)?[...k._NUMERIC_OPS]:["is","is_not"];return e.includes(this.value.kind)||e.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:e.map(t=>({value:t,label:T(this.hass,t)}))}}}]}_currentAttributeValue(){return this.value.attribute?this.hass?.states?.[this.value.entity_id]?.attributes?.[this.value.attribute]:void 0}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let e;if(this.value.attribute){let t=this._currentAttributeValue();e=t==null?[]:[String(t)]}else e=this._knownStates;return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:e.map(t=>({value:t,label:t}))}}}]}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let e=this.value.for??{h:0,m:0,s:0};return{duration:{hours:e.h,minutes:e.m,seconds:e.s}}}_setForFromHaForm(e){this._setForDuration({h:e?.hours??0,m:e?.minutes??0,s:e?.seconds??0})}_renderEntity(){return customElements.get("ha-form")?o`<ha-form
        data-field="entity"
        .hass=${this.hass}
        .schema=${this._entitySchema()}
        .data=${{entity_id:this.value.entity_id}}
        .computeLabel=${()=>""}
        @value-changed=${e=>{e.stopPropagation(),this._setEntity(e.detail.value.entity_id??"")}}
      ></ha-form>`:o`<input
      data-field="entity"
      type="text"
      .value=${this.value.entity_id}
      @change=${e=>this._setEntity(e.target.value)}
    />`}_renderAttribute(){let e=this.value.attribute??"";return customElements.get("ha-form")?o`<ha-form
        data-field="attribute"
        .hass=${this.hass}
        .schema=${this._attributeSchema()}
        .data=${this._attributeData()}
        .computeLabel=${()=>""}
        @value-changed=${t=>{t.stopPropagation(),this._setAttributeFromHaForm(t.detail.value.attribute??"")}}
      ></ha-form>`:o`<input
      data-field="attribute"
      type="text"
      placeholder=${l(this.hass,"ui.state_attribute_placeholder","leave blank to compare state")}
      .value=${e}
      @change=${t=>this._setAttribute(t.target.value)}
    />`}_renderOp(){return customElements.get("ha-form")?o`<ha-form
        class="op-form"
        data-field="op"
        .hass=${this.hass}
        .schema=${this._opSchema()}
        .data=${{op:this.value.kind}}
        .computeLabel=${()=>""}
        @value-changed=${e=>{e.stopPropagation();let t=e.detail.value.op;t&&this._setOp(t)}}
      ></ha-form>`:o`<select
      data-field="op"
      @change=${e=>this._setOp(e.target.value)}>
      <option value="is" ?selected=${this.value.kind==="is"}>is</option>
      <option value="is_not" ?selected=${this.value.kind==="is_not"}>is not</option>
    </select>`}_renderValueRow(e,t){let r=t===-1,i=r?u=>this._addValue(u):u=>this._setValueAt(t,u),a=this._isNumericOp(this.value.kind),d=a?{value:e===""?void 0:Number(e)}:{value:e};return customElements.get("ha-form")?o`
        <div class="value-row" data-row=${t}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${d}
            .computeLabel=${()=>""}
            @value-changed=${u=>{u.stopPropagation();let p=u.detail.value.value;i(p==null?"":String(p))}}
          ></ha-form>
        </div>
      `:o`
      <div class="value-row" data-row=${t}>
        <input type=${a?"number":"text"} .value=${e}
          placeholder=${r?l(this.hass,"ui.state_add_value","+ Add state"):""}
          @change=${u=>i(u.target.value)} />
      </div>
    `}_renderForRow(){if(customElements.get("ha-form"))return o`<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${this._forSchema()}
        .data=${this._forData()}
        .computeLabel=${()=>""}
        @value-changed=${t=>{t.stopPropagation(),this._setForFromHaForm(t.detail.value.duration)}}
      ></ha-form>`;let e=this.value.for??{h:0,m:0,s:0};return o`
      <div class="for-row" data-field="for">
        <input type="number" min="0" .value=${String(e.h)}
          @change=${t=>this._setForDuration({...e,h:Number(t.target.value)||0})} />
        <span>:</span>
        <input type="number" min="0" .value=${String(e.m)}
          @change=${t=>this._setForDuration({...e,m:Number(t.target.value)||0})} />
        <span>:</span>
        <input type="number" min="0" .value=${String(e.s)}
          @change=${t=>this._setForDuration({...e,s:Number(t.target.value)||0})} />
      </div>
    `}render(){return o`
      <section class="field">
        <label class="field-label">${l(this.hass,"ui.state_entity","Entity")}</label>
        ${this._renderEntity()}
      </section>
      <section class="field where-op-row">
        <div class="where-cell">
          <label class="field-label">${l(this.hass,"ui.state_where","Where")}</label>
          ${this._renderAttribute()}
        </div>
        <div class="op-cell">
          <label class="field-label">${l(this.hass,"ui.state_op_header","Comparison")}</label>
          ${this._renderOp()}
        </div>
      </section>
      <section class="field">
        <label class="field-label">
          ${l(this.hass,"ui.state_value_label","Value")}
        </label>
        <div class="value-list">
          ${this._isNumericOp(this.value.kind)?this._renderValueRow(this.value.states[0]??"",0):o`
                ${this.value.states.map((e,t)=>this._renderValueRow(e,t))}
                ${this._renderValueRow("",-1)}
              `}
        </div>
      </section>
      <section class="field">
        <label class="field-label">${l(this.hass,"ui.state_for","For (optional)")}</label>
        ${this._renderForRow()}
      </section>
    `}};k.styles=g`
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
  `,k._STATE_SENTINEL="State",k._NUMERIC_OPS=[">",">=","<","<="],h([c({attribute:!1})],k.prototype,"hass",2),h([c({attribute:!1})],k.prototype,"value",2),h([m()],k.prototype,"_knownStates",2),k=h([v("ambience-state-expr-atom")],k);function Xe(n,s){return n===null||s===null||n.length!==s.length?!1:n.every((e,t)=>e===s[t])}var E=class extends f{constructor(){super(...arguments);this.path=[];this._dragOver=!1;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(e,t={}){this.dispatchEvent(new CustomEvent(e,{detail:{path:this.path,...t},bubbles:!0,composed:!0}))}_atomIsComplete(e){return!!e.entity_id&&e.states.some(t=>t!=="")}_isErrorTarget(){return Xe(this.path,this.errorPath)}_onDragStart(e){if(this.path.length===0){e.preventDefault();return}let t=e.target;if(t&&t.closest("button, select, input, textarea, ha-form")){e.preventDefault();return}e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("application/x-ambience-path",JSON.stringify(this.path)))}_onDragOver(e){this.path.length!==0&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._dragOver=!0)}_onDragLeave(e){e.stopPropagation(),this._dragOver=!1}_onDrop(e){if(this.path.length===0||(e.preventDefault(),e.stopPropagation(),this._dragOver=!1,!e.dataTransfer))return;let t=e.dataTransfer.getData("application/x-ambience-path");if(!t)return;let r;try{r=JSON.parse(t)}catch{return}!Array.isArray(r)||r.every(i=>typeof i=="number")===!1||Xe(r,this.path)||this.dispatchEvent(new CustomEvent("node-move",{detail:{from:r,to:this.path},bubbles:!0,composed:!0}))}_renderAtomCard(e,t){let r=this._atomIsComplete(e),i=Xe(this.path,this.openPath),a=r?Ve(e,{hass:this.hass}):l(this.hass,"ui.state_new_condition","(new condition)");return o`
      <div class="atom-card ${i?"expanded":"collapsed"} ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}>
        <div class="atom-header"
          draggable=${this.path.length>0}
          @dragstart=${this._onDragStart}
          @click=${()=>this._emit("node-open")}>
          <button class="not-toggle ${t?"on":""}"
            title=${l(this.hass,"ui.state_not_toggle","Negate (NOT)")}
            @click=${d=>{d.stopPropagation(),this._emit("node-toggle-not")}}>${T(this.hass,"not")}</button>
          <span class="summary ${r?"":"placeholder"}">${a}</span>
          <button class="wrap"
            title=${l(this.hass,"ui.state_wrap","Wrap in group")}
            @click=${d=>{d.stopPropagation(),this._emit("node-wrap")}}>(…)</button>
          <button class="remove"
            title=${l(this.hass,"ui.remove","Remove")}
            @click=${d=>{d.stopPropagation(),this._emit("node-remove")}}>✕</button>
        </div>
        ${i?o`
          <div class="atom-body">
            <ambience-state-expr-atom
              .hass=${this.hass}
              .value=${e}
              @value-changed=${d=>{d.stopPropagation(),this._emit("node-change",{value:d.detail.value})}}
            ></ambience-state-expr-atom>
            ${this._isErrorTarget()&&this.errorMessage?o`<div class="atom-error">${this.errorMessage}</div>`:""}
          </div>
        `:""}
      </div>
    `}_renderChildRow(e,t){let r=[...this.path,t];return o`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${e}
        .path=${r}
        .openPath=${this.openPath}
        .errorPath=${this.errorPath}
        .errorMessage=${this.errorMessage}
      ></ambience-state-expr-node>
    `}_renderGroup(e){return o`
      <div class="group ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}>
        <div class="group-header"
          draggable=${this.path.length>0}
          @dragstart=${this._onDragStart}>
          <select class="group-op"
            @change=${t=>this._emit("node-set-op",{op:t.target.value})}>
            <option value="and" ?selected=${e.kind==="and"}>${T(this.hass,"and")}</option>
            <option value="or"  ?selected=${e.kind==="or"} >${T(this.hass,"or")}</option>
          </select>
          <button class="unwrap"
            title=${l(this.hass,"ui.state_unwrap_group","Remove these parens (promote children to parent)")}
            @click=${()=>this._emit("node-unwrap")}>✕</button>
        </div>
        <div class="group-children">
          ${e.items.map((t,r)=>this._renderChildRow(t,r))}
        </div>
        <div class="actions">
          <button @click=${()=>this._emit("node-add-child")}>
            + ${l(this.hass,"ui.state_add_condition","Add condition")}
          </button>
        </div>
      </div>
    `}render(){let e=this.value.kind==="not",t=e?this.value.item:this.value;return t.kind==="and"||t.kind==="or"?this._renderGroupWithExternalNot(t,e):this._renderAtomCard(t,e)}_renderGroupWithExternalNot(e,t){let r=this.path.length===0;return o`
      <div class="group-wrap">
        ${r?"":o`<button class="not-toggle external ${t?"on":""}"
          title=${l(this.hass,"ui.state_not_toggle","Negate (NOT)")}
          @click=${()=>this._emit("node-toggle-not")}>${T(this.hass,"not")}</button>`}
        ${this._renderGroup(e)}
      </div>
    `}};E.styles=g`
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
  `,h([c({attribute:!1})],E.prototype,"hass",2),h([c({attribute:!1})],E.prototype,"value",2),h([c({attribute:!1})],E.prototype,"path",2),h([m()],E.prototype,"_dragOver",2),h([c({attribute:!1})],E.prototype,"openPath",2),h([c({attribute:!1})],E.prototype,"errorPath",2),h([c({attribute:!1})],E.prototype,"errorMessage",2),E=h([v("ambience-state-expr-node")],E);function Ze(n,s){return n===null||s===null||n.length!==s.length?!1:n.every((e,t)=>e===s[t])}var M=class extends f{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._onNodeMove=e=>{e.stopPropagation(),this._moveAt(e.detail.from,e.detail.to)};this._onNodeChange=e=>{e.stopPropagation(),this._replaceAt(e.detail.path,e.detail.value)};this._onNodeRemove=e=>{e.stopPropagation(),this._removeAt(e.detail.path)};this._onNodeWrap=e=>{e.stopPropagation(),this._wrapAt(e.detail.path)};this._onNodeAddChild=e=>{e.stopPropagation(),this._addChildAt(e.detail.path,"is")};this._onNodeToggleNot=e=>{e.stopPropagation(),this._toggleNotAt(e.detail.path)};this._onNodeSetOp=e=>{e.stopPropagation(),this._setGroupOpAt(e.detail.path,e.detail.op)};this._onNodeUnwrap=e=>{e.stopPropagation(),this._unwrapAt(e.detail.path)};this._onNodeOpen=e=>{if(e.stopPropagation(),this._openPath!==null){let t=this._atomAt(this._openPath);if(t&&this._atomError(t)!==null){this._showError=!0;return}}this._openPath!==null&&Ze(this._openPath,e.detail.path)?this._openPath=null:this._openPath=e.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-move",this._onNodeMove)}_emit(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(e,t){let r=this._patch(this.value,e,()=>t);this._emit(r)}_removeAt(e){if(e.length===0){this._emit(null);return}let t=this._patch(this.value,e,()=>null);this._emit(t)}_wrapAt(e){let t=null;if(e.length>0){let a=this._nodeAt(e.slice(0,-1));a&&(a.kind==="and"||a.kind==="or")&&(t=a.kind)}let r=t==="and"?"or":"and",i=this._patch(this.value,e,a=>a&&{kind:r,items:[a]});this._emit(i)}_nodeAt(e){return this._walkNode(this.value,e)}_moveAt(e,t){if(this._isPrefix(e,t)||e.length===0||t.length===0)return;let r=this._nodeAt(e);if(!r)return;let i=this._rewriteForMove(this.value,[],e,t,r);this._emit(i)}_isPrefix(e,t){return e.length>t.length?!1:e.every((r,i)=>r===t[i])}_rewriteForMove(e,t,r,i,a){if(!e)return e;if(e.kind==="not"){let x=this._rewriteForMove(e.item,t,r,i,a);return x==null?null:{kind:"not",item:x}}if(e.kind!=="and"&&e.kind!=="or")return e;let d=r.slice(0,-1),u=i.slice(0,-1),p=Ze(t,d),_=Ze(t,u),y=[];if(e.items.forEach((x,L)=>{let ee=[...t,L];if(p&&L===r[r.length-1])return;let Qe=this._rewriteForMove(x,ee,r,i,a);Qe!==null&&y.push(Qe)}),_){let x=i[i.length-1];y.splice(x,0,a)}return y.length===0?null:{...e,items:y}}_walkNode(e,t){return e?e.kind==="not"?this._walkNode(e.item,t):t.length===0?e:e.kind==="and"||e.kind==="or"?this._walkNode(e.items[t[0]]??null,t.slice(1)):null:null}_addChildAt(e,t){let r=null,i=this._patch(this.value,e,a=>{if(a&&(a.kind==="and"||a.kind==="or")){let d=[...a.items,this._emptyAtom()];return r=[...e,d.length-1],{...a,items:d}}return a});r!==null&&(this._openPath=r),this._emit(i)}_toggleNotAt(e){let t=this._patch(this.value,e,r=>r&&(r.kind==="not"?r.item:{kind:"not",item:r}));this._emit(t)}_setGroupOpAt(e,t){let r=this._patch(this.value,e,i=>{if(!i)return i;let a=null;if(i.kind==="and"||i.kind==="or")a=i;else if(i.kind==="not"){let d=i.item;(d.kind==="and"||d.kind==="or")&&(a=d)}return a?{kind:t,items:a.items}:i});this._emit(r)}_patch(e,t,r){if(t.length===0)return r(e);if(e==null)return e;let[i,...a]=t;if(e.kind==="and"||e.kind==="or"){let d=e.items.length,u=e.items.slice(),p=this._patch(u[i],a,r);if(p===null?u.splice(i,1):u[i]=p,u.length<d){if(u.length===0)return null;if(u.length===1)return u[0]}return{...e,items:u}}if(e.kind==="not"){let d=this._patch(e.item,t,r);return d==null?null:{kind:"not",item:d}}return e}_atomAt(e){return this._walk(this.value,e)}_walk(e,t){return e?e.kind==="not"?this._walk(e.item,t):t.length===0?e.kind==="and"||e.kind==="or"?null:e:e.kind==="and"||e.kind==="or"?this._walk(e.items[t[0]]??null,t.slice(1)):null:null}_atomError(e){if(!e.entity_id)return l(this.hass,"ui.state_err_entity","Entity is required");if(e.kind!=="is"&&e.kind!=="is_not"){let r=e.states[0];if(!r)return l(this.hass,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(r)))return l(this.hass,"ui.state_err_numeric","Value must be a number")}else if(!e.states.some(r=>r!==""))return l(this.hass,"ui.state_err_state","State is required");return null}_unwrapAt(e){if(e.length===0){let a=this.value;if(!a)return;let d=a.kind==="not"?a.item:a;(d.kind==="and"||d.kind==="or")&&(d.items.length===1?this._emit(d.items[0]):this._emit(null));return}let t=e.slice(0,-1),r=e[e.length-1],i=this._patch(this.value,t,a=>{if(!a||a.kind!=="and"&&a.kind!=="or")return a;let d=a.items.slice(),u=d[r],p=null;if(u.kind==="and"||u.kind==="or")p=u;else if(u.kind==="not"){let _=u.item;(_.kind==="and"||_.kind==="or")&&(p=_)}return p?(d.splice(r,1,...p.items),{...a,items:d}):a});this._emit(i)}willUpdate(e){if(e.has("value")){let t=this.value;if(t&&this._openPath===null&&t.kind!=="and"&&t.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let r=this._atomAt(this._openPath);(!r||this._atomError(r)===null)&&(this._showError=!1)}}}_addAtRoot(){let e=this.value;if(e==null){this._addFirstAtom();return}if(e.kind==="and"||e.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[e,this._emptyAtom()]})}_setOpen(e){this._openPath=e}render(){if(this.value==null)return o`
        <div class="empty">
          <button @click=${()=>this._addFirstAtom()}>
            + ${l(this.hass,"ui.state_add_first","Add condition")}
          </button>
        </div>
      `;let e=this._showError&&this._openPath!==null?(()=>{let i=this._atomAt(this._openPath);return i?this._atomError(i):null})():null,t=this.value.kind==="not"?this.value.item:this.value,r=t.kind!=="and"&&t.kind!=="or";return o`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${this.value}
        .path=${[]}
        .openPath=${this._openPath}
        .errorPath=${e?this._openPath:null}
        .errorMessage=${e}
      ></ambience-state-expr-node>
      ${r?o`
        <button class="root-add" @click=${()=>this._addAtRoot()}>
          + ${l(this.hass,"ui.state_add_condition","Add condition")}
        </button>
      `:""}
    `}};M.styles=g`
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
  `,h([c({attribute:!1})],M.prototype,"hass",2),h([c({attribute:!1})],M.prototype,"value",2),h([m()],M.prototype,"_openPath",2),h([m()],M.prototype,"_showError",2),M=h([v("ambience-state-predicate-input")],M);var C=class extends f{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onText(e){let t=e.target.value;this._emit(t.trim()===""?null:t)}render(){return this.matcher.input==="time_of_day"?o`
        <ambience-time-of-day-input
          .value=${this.value}
          .periods=${this.periods}
          .hass=${this.hass}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-time-of-day-input>
      `:this.matcher.input==="scene_combobox"?o`
        <ambience-scene-combobox
          .hass=${this.hass}
          .value=${this.value??null}
          .suggestions=${this.sceneSuggestions}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-scene-combobox>
      `:this.matcher.input==="day_predicate"?o`
        <ambience-day-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .dayConfig=${this.dayConfig??{workday_sensor:null,workday_calendar:null}}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-day-predicate-input>
      `:this.matcher.input==="weather_predicate"?o`
        <ambience-weather-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .groups=${this.weatherConfig?.groups??[]}
          .weatherEntity=${this.weatherConfig?.entity??void 0}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-weather-predicate-input>
      `:this.matcher.input==="state_predicate"?o`
        <ambience-state-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-state-predicate-input>
      `:o`
      <input
        type="text"
        placeholder=${l(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};C.styles=g`
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
  `,h([c({attribute:!1})],C.prototype,"matcher",2),h([c({attribute:!1})],C.prototype,"value",2),h([c({attribute:!1})],C.prototype,"sceneSuggestions",2),h([c({attribute:!1})],C.prototype,"periods",2),h([c({attribute:!1})],C.prototype,"dayConfig",2),h([c({attribute:!1})],C.prototype,"weatherConfig",2),h([c({attribute:!1})],C.prototype,"hass",2),C=h([v("ambience-matcher-input")],C);var G=class extends f{constructor(){super(...arguments);this.entities=[];this.value=[]}connectedCallback(){super.connectedCallback(),W(this,this.hass)}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let e=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this.entities}}}];return o`
      <ha-form
        .hass=${this.hass}
        .schema=${e}
        .data=${{entity_ids:this.value}}
        .computeLabel=${()=>""}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,t){let r=new Set(this.value);t?r.add(e):r.delete(e),this._emit(this.entities.filter(i=>r.has(i)))}_renderFallback(){return this.entities.length===0?o`<p class="empty">${l(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:o`
      <div class="checkboxes">
        ${this.entities.map(e=>o`
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
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};G.styles=g`
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
  `,h([c({attribute:!1})],G.prototype,"hass",2),h([c({attribute:!1})],G.prototype,"entities",2),h([c({attribute:!1})],G.prototype,"value",2),G=h([v("ambience-target-picker")],G);var b=class extends f{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._open=null;this._showError=!1;this._onNameInput=e=>{this._setName(e.target.value)};this._onAddMatcher=e=>{let t=e.target,r=t.value;t.value="",this._addMatcher(r)};this._onAddMatcherHaForm=e=>{e.stopPropagation();let t=e.detail.value.add;t!==b._ADD_MATCHER_PLACEHOLDER&&this._addMatcher(t)}}connectedCallback(){super.connectedCallback(),W(this,this.hass)}willUpdate(e){e.has("open")&&this.open&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null,this._open=null,this._showError=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"}))return o`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
        </div>
      `;let r=Le(this._draft,l(this.hass,"ui.new_rule","New rule"));return o`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${r}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let t=vt();return t==="ha-input"?o`<ha-input label=${l(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:t==="ha-textfield"?o`<ha-textfield label=${l(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:o`<input type="text" .value=${e} @input=${this._onNameInput} />`}_isOpen(e){return this._open===null?!1:e.kind==="name"&&this._open.kind==="name"?!0:e.kind==="matcher"&&this._open.kind==="matcher"?e.id===this._open.id:e.kind==="action"&&this._open.kind==="action"?e.idx===this._open.idx:!1}_validationError(e){if(e===null||e.kind==="name"||e.kind==="matcher")return null;let t=this._draft?.actions[e.idx];if(!t)return null;if(t.entity_ids.length===0)return l(this.hass,"ui.at_least_one_target","At least one target is required.");let r=this.availableActions.find(i=>i.name===t.action);if(!r)return null;for(let i of r.target_params){if(!i.required)continue;let a=t.params[i.name];if(a==null||a==="")return l(this.hass,"ui.param_required","{param} is required.").replace("{param}",this._paramLabel(i.name))}return null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){this._tryCloseCurrent();return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let t of e.composedPath())if(t instanceof Element&&(t.classList.contains("slot")||t.classList.contains("actions-bar")||t.classList.contains("add-matcher")))return;this._tryCloseCurrent()}_setPredicate(e,t){if(!this._draft)return;let r={...this._draft.when};t==null?delete r[e]:r[e]=t,this._draft={...this._draft,when:r}}_renderMatcherRow(e){let t=this._draft.when[e.name]??null,r=this._isOpen({kind:"matcher",id:e.name}),i=e.input==="scene_combobox";if(r&&i)return o`
        <div class="slot combobox-slot expanded" data-slot-id=${e.name}>
          <ambience-matcher-input
            .hass=${this.hass}
            .matcher=${e}
            .value=${t}
            .sceneSuggestions=${this.sceneSuggestions}
            .periods=${this.periods}
            .dayConfig=${this.dayConfig}
            .weatherConfig=${this.weatherConfig}
            @value-changed=${d=>this._setPredicate(e.name,d.detail.value)}
          ></ambience-matcher-input>
        </div>
      `;let a=He(e.name,t,{hass:this.hass,periods:this.periods});return o`
      <div class="slot ${r?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"matcher",id:e.name})}>
          <span class="summary-label"><strong>${j(this.hass,e.name)}:</strong> ${a}</span>
          <button
            class="remove"
            @click=${d=>{d.stopPropagation(),this._removeMatcher(e.name)}}
            title=${l(this.hass,"ui.remove_condition","Remove condition")}
          >✕</button>
        </div>
        ${r?o`
          <div class="body">
            <ambience-matcher-input
              .hass=${this.hass}
              .matcher=${e}
              .value=${t}
              .sceneSuggestions=${this.sceneSuggestions}
              .periods=${this.periods}
              .dayConfig=${this.dayConfig}
              .weatherConfig=${this.weatherConfig}
              @value-changed=${d=>this._setPredicate(e.name,d.detail.value)}
            ></ambience-matcher-input>
          </div>
        `:""}
      </div>
    `}_visibleMatchers(){if(!this._draft)return[];let e=this._draft.when;return this.matchers.filter(t=>t.name in e&&e[t.name]!=null||this._open?.kind==="matcher"&&this._open.id===t.name)}_unusedMatchers(){let e=new Set(this._visibleMatchers().map(t=>t.name));return this.matchers.filter(t=>!e.has(t.name))}_addMatcher(e){e&&(this._open!==null&&!this._tryCloseCurrent()||(this._open={kind:"matcher",id:e},this._showError=!1))}_removeMatcher(e){if(!this._draft)return;let t={...this._draft.when};delete t[e],this._draft={...this._draft,when:t},this._open?.kind==="matcher"&&this._open.id===e&&(this._open=null,this._showError=!1)}_renderAddMatcher(){let e=this._unusedMatchers();return e.length===0?"":customElements.get("ha-form")?this._renderAddMatcherHaForm(e):o`
      <div class="add-matcher">
        <select class="add-matcher" @change=${this._onAddMatcher}>
          <option value="">${l(this.hass,"ui.add_condition","+ Add condition\u2026")}</option>
          ${e.map(t=>o`<option value=${t.name}>${j(this.hass,t.name)}</option>`)}
        </select>
      </div>
    `}_renderAddMatcherHaForm(e){let t=l(this.hass,"ui.add_condition","+ Add condition\u2026"),r=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:b._ADD_MATCHER_PLACEHOLDER,label:t},...e.map(i=>({value:i.name,label:j(this.hass,i.name)}))]}}}];return o`
      <div class="add-matcher">
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{add:b._ADD_MATCHER_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddMatcherHaForm}
        ></ha-form>
      </div>
    `}_addActionSlot(){if(!this._draft)return;let e={action:"set_light",entity_ids:[],params:{}},t=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,e]},this._open={kind:"action",idx:t}}_updateActionAt(e,t){if(!this._draft)return;let r=this._draft.actions.map((i,a)=>a===e?t(i):i);this._draft={...this._draft,actions:r}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((t,r)=>r!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,t){this._updateActionAt(e,r=>({...r,entity_ids:t}))}_paramLabel(e){let t=e.replaceAll("_"," ").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}_updateActionParam(e,t,r){this._updateActionAt(e,i=>{let a={...i.params},d=r;if(t.type==="int"?d=r===""?void 0:parseInt(r,10):t.type==="number"?d=r===""?void 0:parseFloat(r):t.type==="boolean"&&(d=r==="true"),typeof d=="number"&&Number.isFinite(d)){let u=d;typeof t.min=="number"&&u<t.min&&(u=t.min),typeof t.max=="number"&&u>t.max&&(u=t.max),d=u}return d===void 0?delete a[t.name]:a[t.name]=d,{...i,params:a}})}_renderActionParams(e,t,r){let i=r?.target_params??[];return o`
      ${i.map(a=>o`
        <div class="param-row">
          <label>${this._paramLabel(a.name)}${a.required?" *":""}</label>
          <div class="param-input">
            <input
              type=${a.type==="int"||a.type==="number"?"number":"text"}
              placeholder=${a.description??""}
              .value=${String(t.params[a.name]??"")}
              min=${a.min??""}
              max=${a.max??""}
              @input=${d=>this._updateActionParam(e,a,d.target.value)}
            />
            ${a.unit?o`<span class="param-unit">${a.unit}</span>`:""}
          </div>
        </div>
      `)}
    `}_renderActionRow(e,t){let r=this.availableActions.find(u=>u.name===e.action),i=this._isOpen({kind:"action",idx:t}),a=It(e,r,{hass:this.hass}),d=this.scope?Mt(this.hass,this.scope,r?.domains??[]):[];return o`
      <div class="slot ${i?"expanded":"collapsed"}" data-slot-id="action-${t}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:t})}>
          <span class="summary-label">${a}</span>
          <button class="remove" @click=${u=>{u.stopPropagation(),this._deleteAction(t)}} title=${l(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${i?o`
          <div class="body">
            <label>${l(this.hass,"ui.target","Target")}</label>
            <ambience-target-picker
              .hass=${this.hass}
              .entities=${d}
              .value=${e.entity_ids}
              @value-changed=${u=>{u.stopPropagation(),this._setActionTargets(t,u.detail.value)}}
            ></ambience-target-picker>

            ${this._renderActionParams(t,e,r)}

            ${this._showError&&this._validationError({kind:"action",idx:t})?o`
              <div class="error">${this._validationError({kind:"action",idx:t})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_save(){if(!this._draft)return;let e=Object.fromEntries(Object.entries(this._draft.when).filter(([,t])=>t!=null));this.dispatchEvent(new CustomEvent("save-rule",{detail:{...this._draft,when:e},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){if(!this._draft)return o``;let e=this._visibleMatchers();return o`
      <div class="modal" @click=${this._onModalClick}>
        <div class="content">
          ${this._renderNameSlot()}

          <h3>${l(this.hass,"ui.when_heading","When")}</h3>
          ${e.map(t=>this._renderMatcherRow(t))}
          ${this._renderAddMatcher()}

          <h3>${l(this.hass,"ui.actions_heading","Actions")}</h3>
          ${this._draft.actions.map((t,r)=>this._renderActionRow(t,r))}
          <button class="secondary add-action" @click=${this._addActionSlot}>${l(this.hass,"ui.add_action","+ Add action")}</button>
        </div>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>${l(this.hass,"ui.cancel","Cancel")}</button>
          <button class="primary" @click=${this._save}>${l(this.hass,"ui.save_rule","Save rule")}</button>
        </div>
      </div>
    `}};b.styles=g`
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
  `,b._ADD_MATCHER_PLACEHOLDER="__add_matcher__",h([c({type:Boolean,reflect:!0})],b.prototype,"open",2),h([c({attribute:!1})],b.prototype,"rule",2),h([c({attribute:!1})],b.prototype,"matchers",2),h([c({attribute:!1})],b.prototype,"sceneSuggestions",2),h([c({attribute:!1})],b.prototype,"periods",2),h([c({attribute:!1})],b.prototype,"dayConfig",2),h([c({attribute:!1})],b.prototype,"weatherConfig",2),h([c({attribute:!1})],b.prototype,"availableActions",2),h([c({attribute:!1})],b.prototype,"hass",2),h([c({attribute:!1})],b.prototype,"scope",2),h([m()],b.prototype,"_draft",2),h([m()],b.prototype,"_open",2),h([m()],b.prototype,"_showError",2),b=h([v("ambience-rule-editor")],b);function Wt(n){return n.kind==="house"?"house":`${n.kind}:${n.id}`}function De(n){return{rules:n.rules??[],auto_sort:n.auto_sort??!0}}var $=class extends f{constructor(){super(...arguments);this._areas=[];this._floors=[];this._areaConfigs=new Map;this._floorConfigs=new Map;this._house={rules:[],auto_sort:!0};this._matchers=[];this._actions=[];this._expanded=new Set;this._sectionsExpanded=new Set;this._error="";this._editing=null}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await Promise.all([this._refreshAreas(),this._refreshFloors(),this._refreshHouse()]),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubArea?.(),this._unsubArea=void 0,this._unsubFloor?.(),this._unsubFloor=void 0}async _loadStatic(){try{let[e,t,r,i,a]=await Promise.all([Se(this.hass),Ct(this.hass),Ee(this.hass),Ce(this.hass),Pe(this.hass)]);if(!this.isConnected)return;this._matchers=e,this._actions=t,this._periods=r,this._dayConfig=i,this._weatherConfig=a}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await yt(this.hass),t=this._areaConfigs,r=new Map;if(await Promise.all(e.map(async i=>{let a=t.get(i.area_id);if(a){r.set(i.area_id,a);return}r.set(i.area_id,De(await bt(this.hass,i.area_id)))})),!this.isConnected)return;this._areas=e,this._areaConfigs=r}catch(e){this._error=e.message||String(e)}}async _refreshFloors(){try{let e=(await wt(this.hass)).slice().sort((i,a)=>i.name.localeCompare(a.name)),t=this._floorConfigs,r=new Map;if(await Promise.all(e.map(async i=>{let a=t.get(i.floor_id);if(a){r.set(i.floor_id,a);return}r.set(i.floor_id,De(await kt(this.hass,i.floor_id)))})),!this.isConnected)return;this._floors=e,this._floorConfigs=r}catch(e){this._error=e.message||String(e)}}async _refreshHouse(){try{let e=De(await St(this.hass));if(!this.isConnected)return;this._house=e}catch(e){this._error=e.message||String(e)}}async _subscribe(){let e=this.hass.connection.subscribeEvents(a=>{if(a.data.action==="remove"){let d=a.data.area_id,u=new Set(this._expanded);u.delete(`area:${d}`),this._expanded=u,this._editing?.scope.kind==="area"&&this._editing.scope.id===d&&(this._editing=null)}this._refreshAreas()},"area_registry_updated"),t=this.hass.connection.subscribeEvents(a=>{if(a.data.action==="remove"){let d=a.data.floor_id,u=new Set(this._expanded);u.delete(`floor:${d}`),this._expanded=u,this._editing?.scope.kind==="floor"&&this._editing.scope.id===d&&(this._editing=null)}this._refreshFloors()},"floor_registry_updated"),[r,i]=await Promise.all([e,t]);this.isConnected?(this._unsubArea=r,this._unsubFloor=i):(r(),i())}_getConfig(e){return e.kind==="house"?this._house:e.kind==="area"?this._areaConfigs.get(e.id):this._floorConfigs.get(e.id)}_setConfig(e,t){if(e.kind==="house")this._house=t;else if(e.kind==="area"){let r=new Map(this._areaConfigs);r.set(e.id,t),this._areaConfigs=r}else{let r=new Map(this._floorConfigs);r.set(e.id,t),this._floorConfigs=r}}async _mutate(e,t){let r=this._getConfig(e);this._setConfig(e,t),this._error="";try{let i;e.kind==="house"?i=await Et(this.hass,t):e.kind==="area"?i=await $t(this.hass,e.id,t):i=await xt(this.hass,e.id,t),this._setConfig(e,De(i.config))}catch(i){r&&this._setConfig(e,r),this._error=i.message||String(i)}}_toggleExpand(e){let t=Wt(e),r=new Set(this._expanded);r.has(t)?r.delete(t):r.add(t),this._expanded=r}_toggleSection(e){let t=new Set(this._sectionsExpanded);t.has(e)?t.delete(e):t.add(e),this._sectionsExpanded=t}_toggleAutoSort(e,t){let r=this._getConfig(e);r&&this._mutate(e,{...r,auto_sort:t})}_addRule(e){let t=this._getConfig(e);t&&(this._editing={scope:e,index:t.rules.length,isNew:!0})}_editRule(e,t){this._editing={scope:e,index:t.detail.index,isNew:!1}}_duplicateRule(e,t){let r=this._getConfig(e);if(!r)return;let i=r.rules[t.detail.index];if(!i)return;let a=JSON.parse(JSON.stringify(i)),d=[...r.rules];d.splice(t.detail.index+1,0,a),this._mutate(e,{...r,rules:d})}_deleteRule(e,t){let r=this._getConfig(e);if(!r)return;let i=r.rules.filter((a,d)=>d!==t.detail.index);this._mutate(e,{...r,rules:i})}_reorderRules(e,t){let r=this._getConfig(e);if(!r)return;let{from:i,to:a}=t.detail,d=[...r.rules],[u]=d.splice(i,1);d.splice(a,0,u),this._mutate(e,{...r,rules:d})}_saveRule(e){let t=this._editing;if(this._editing=null,!t)return;let r=this._getConfig(t.scope);if(!r)return;let i=[...r.rules];t.isNew?i.push(e.detail):i[t.index]=e.detail,this._mutate(t.scope,{...r,rules:i})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._getConfig(this._editing.scope)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let e=this._getConfig(this._editing.scope);if(!e)return[];let t=new Set;for(let r of e.rules){let i=r.when.scene;typeof i=="string"&&i&&t.add(i)}return[...t].sort((r,i)=>r.toLowerCase().localeCompare(i.toLowerCase()))}get _editorMatchers(){return this._editing?this._matchers.slice().sort((e,t)=>e.priority-t.priority):[]}_summary(e){let t=e.rules.length;if(t===0)return l(this.hass,"ui.not_configured","not configured");let r=t===1?l(this.hass,"ui.rule_singular","rule"):l(this.hass,"ui.rule_plural","rules");return`${t} ${r}`}render(){return o`
      ${this._error?o`<p class="error">${this._error}</p>`:""}
      ${this._renderHouseSection()}
      ${this._floors.length>0?this._renderFloorsSection():""}
      ${this._renderAreasSection()}

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
    `}_renderSectionHeader(e,t){let r=this._sectionsExpanded.has(e);return o`
      <div
        class="section-header"
        data-section=${e}
        @click=${()=>this._toggleSection(e)}
      >
        <span class="section-chevron ${r?"open":""}">▶</span>
        <span>${t}</span>
      </div>
    `}_renderHouseSection(){let e=this._sectionsExpanded.has("house"),t={kind:"house"};return o`
      <section data-section="house">
        ${this._renderSectionHeader("house",l(this.hass,"ui.section_house","House"))}
        ${e?o`<ul>${this._renderScopeRow(t,l(this.hass,"ui.section_house","House"),this._house,"house")}</ul>`:""}
      </section>
    `}_renderFloorsSection(){let e=this._sectionsExpanded.has("floors");return o`
      <section data-section="floors">
        ${this._renderSectionHeader("floors",l(this.hass,"ui.section_floors","Floors"))}
        ${e?o`<ul>
              ${this._floors.map(t=>{let r=this._floorConfigs.get(t.floor_id);return r?this._renderScopeRow({kind:"floor",id:t.floor_id},t.name,r,"floor"):o``})}
            </ul>`:""}
      </section>
    `}_renderAreasSection(){let e=this._sectionsExpanded.has("areas");return o`
      <section data-section="areas">
        ${this._renderSectionHeader("areas",l(this.hass,"ui.section_areas","Areas"))}
        ${e?this._areas.length===0?o`<p class="empty">
                ${l(this.hass,"ui.no_areas","No areas found in Home Assistant.")}
              </p>`:o`<ul>
                ${this._areas.map(t=>{let r=this._areaConfigs.get(t.area_id);return r?this._renderScopeRow({kind:"area",id:t.area_id},t.name,r,"area"):o``})}
              </ul>`:""}
      </section>
    `}_renderScopeRow(e,t,r,i){let a=this._expanded.has(Wt(e)),d=e.kind==="house"?"":e.id;return o`
      <li
        class="scope-row ${i}"
        data-id=${d}
      >
        <div class="scope-header" @click=${()=>this._toggleExpand(e)}>
          <span class="chevron ${a?"open":""}">▶</span>
          <span class="scope-name">${t}</span>
          <span class="scope-summary">${this._summary(r)}</span>
        </div>
        ${a?o`
              <div class="scope-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!r.auto_sort}
                    @change=${u=>this._toggleAutoSort(e,!u.target.checked)}
                  />
                  ${l(this.hass,"ui.order_rules_manually","Order rules manually")}
                </label>
                <ambience-rules-list
                  .rules=${r.rules}
                  .autoSort=${r.auto_sort}
                  .periods=${this._periods}
                  .weatherConfig=${this._weatherConfig}
                  .matchers=${this._matchers}
                  .hass=${this.hass}
                  @add-rule=${()=>this._addRule(e)}
                  @edit-rule=${u=>this._editRule(e,u)}
                  @duplicate-rule=${u=>this._duplicateRule(e,u)}
                  @delete-rule=${u=>this._deleteRule(e,u)}
                  @reorder-rules=${u=>this._reorderRules(e,u)}
                ></ambience-rules-list>
              </div>
            `:""}
      </li>
    `}};$.styles=g`
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
    section {
      margin-bottom: 1rem;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.25rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 1.05rem;
      color: var(--primary-text-color, inherit);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .section-chevron {
      width: 1em;
      color: var(--secondary-text-color, #888);
      transition: transform 0.1s;
    }
    .section-chevron.open {
      transform: rotate(90deg);
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 0 0;
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
  `,h([c({attribute:!1})],$.prototype,"hass",2),h([m()],$.prototype,"_areas",2),h([m()],$.prototype,"_floors",2),h([m()],$.prototype,"_areaConfigs",2),h([m()],$.prototype,"_floorConfigs",2),h([m()],$.prototype,"_house",2),h([m()],$.prototype,"_matchers",2),h([m()],$.prototype,"_actions",2),h([m()],$.prototype,"_periods",2),h([m()],$.prototype,"_dayConfig",2),h([m()],$.prototype,"_weatherConfig",2),h([m()],$.prototype,"_expanded",2),h([m()],$.prototype,"_sectionsExpanded",2),h([m()],$.prototype,"_error",2),h([m()],$.prototype,"_editing",2),$=h([v("ambience-scopes-view")],$);var R=class extends f{constructor(){super(...arguments);this.matcherName="";this.matcherDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let e=j(this.hass,this.matcherName);return o`
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
    `}};R.styles=g`
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
  `,h([c({attribute:!1})],R.prototype,"hass",2),h([c()],R.prototype,"matcherName",2),h([c()],R.prototype,"matcherDescription",2),h([m()],R.prototype,"_expanded",2),R=h([v("ambience-matcher-card")],R);var Dr=/^[a-z][a-z0-9_]*$/;function Nr(n){return n.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var P=class extends f{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._label=this.initial.label??"",this._def=this.initial}_onLabelInput(e){this._label=e.target.value}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_validate(e){if(!this.existingId){if(!this._label.trim())return l(this.hass,"ui.error_enter_name","Please enter a name.");if(!e)return l(this.hass,"ui.error_start_letter","Name must start with a letter.");if(!Dr.test(e))return l(this.hass,"ui.error_start_letter","Name must start with a letter.");if(this.takenIds.has(e))return l(this.hass,"ui.error_name_exists","A period with this name already exists. Choose a different name.")}return""}_onSave(){let e=this.existingId??Nr(this._label),t=this._validate(e);if(t){this._error=t,this.performUpdate();return}let r={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:e,definition:r},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){let e=this.existingId?l(this.hass,"ui.period_modal_edit_title",'Edit "{name}"').replace("{name}",this.initial?.label??this.existingId):l(this.hass,"ui.period_modal_add_title","Add custom period");return o`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <div class="field">
          <label for="label">${l(this.hass,"ui.name","Name")}</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput} placeholder=${l(this.hass,"ui.name_placeholder","e.g. Wind down")} />
        </div>
        <div class="row">
          <label style="min-width: 3em;">${l(this.hass,"ui.from_label","From")}</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
        </div>
        <div class="row">
          <label style="min-width: 3em;">${l(this.hass,"ui.to_label","To")}</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
        </div>
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>${l(this.hass,"ui.cancel","Cancel")}</button>
          <button @click=${this._onSave}>${l(this.hass,"ui.save","Save")}</button>
        </div>
      </div>
    `}};P.styles=g`
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
  `,h([c({attribute:!1})],P.prototype,"hass",2),h([c({attribute:!1})],P.prototype,"existingId",2),h([c({attribute:!1})],P.prototype,"initial",2),h([c({attribute:!1})],P.prototype,"takenIds",2),h([m()],P.prototype,"_label",2),h([m()],P.prototype,"_def",2),h([m()],P.prototype,"_error",2),P=h([v("ambience-period-edit-modal")],P);function Ut(n,s){if(n.kind==="time")return`${String(n.hh).padStart(2,"0")}:${String(n.mm).padStart(2,"0")}`;let e=se(s,n.anchor);if(n.offset_min===0)return e;let t=Math.abs(n.offset_min),r=t%60===0?`${t/60}${l(s,"ui.unit_hour_abbr","h")}`:`${t}${l(s,"ui.unit_min_abbr","m")}`;return`${e}${n.offset_min<0?"-":"+"}${r}`}function Gt(n,s){return`${Ut(n.from,s)} \u2192 ${Ut(n.to,s)}`}var O=class extends f{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await Ee(this.hass)}async _saveState(e){let t=await Pt(this.hass,e,this._view.hidden);this._warnings=t.warnings,await this._reload()}_onEdit(e,t){this._modal={mode:"edit",id:e,initial:t}}async _onDelete(e){let t={...this._view.custom};delete t[e],await this._saveState(t)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:t,definition:r}=e.detail,i={...this._view.custom,[t]:r};this._modal={mode:"closed"},await this._saveState(i)}_onModalCancel(){this._modal={mode:"closed"}}_renderBuiltinRow(e,t,r){return o`
      <div class="row ${r?"overridden":""}">
        <span class="name">${X(this.hass,e,{})}</span>
        <span class="def">${Gt(t,this.hass)}</span>
        <span class="badge">${l(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${r?"":o`<button class="icon" title=${l(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(e,t)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(e,t){return o`
      <div class="row custom">
        <span class="name">${X(this.hass,e,this._view.custom)}</span>
        <span class="def">${Gt(t,this.hass)}</span>
        <span class="badge">${l(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${l(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e,t)}>✎</button>
          <button class="icon" title=${l(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e)}>✕</button>
        </span>
      </div>
    `}render(){let e=this._view.custom;return o`
      <header>
        <h2>${l(this.hass,"ui.periods_heading","Periods")}</h2>
      </header>
      ${this._warnings.length?o`<div class="warnings">
            <strong>${l(this.hass,"ui.period_warning_prefix","Warning:")}</strong> ${l(this.hass,"ui.period_warning_text","some rules now reference missing periods:")}
            <ul>
              ${this._warnings.map(t=>o`<li>${t.area_id} / "${t.rule_name}" → ${t.missing_period}</li>`)}
            </ul>
          </div>`:""}
      ${Object.entries(this._view.builtins).map(([t,r])=>{let i=e[t];return o`
          ${this._renderBuiltinRow(t,r,i!=null)}
          ${i!=null?this._renderCustomRow(t,i):""}
        `})}
      ${Object.entries(e).filter(([t])=>!(t in this._view.builtins)).map(([t,r])=>this._renderCustomRow(t,r))}
      <button class="add" @click=${this._onAdd}>${l(this.hass,"ui.add_custom_period","+ Add custom period")}</button>
      ${this._modal.mode==="edit"?o`<ambience-period-edit-modal
            .hass=${this.hass}
            .existingId=${this._modal.id}
            .initial=${this._modal.initial}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:this._modal.mode==="add"?o`<ambience-period-edit-modal
            .hass=${this.hass}
            .takenIds=${new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`:""}
    `}};O.styles=g`
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
  `,h([c({attribute:!1})],O.prototype,"hass",2),h([m()],O.prototype,"_view",2),h([m()],O.prototype,"_modal",2),h([m()],O.prototype,"_warnings",2),O=h([v("ambience-time-of-day-config")],O);var q=class extends f{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await Ce(this.hass)}async _save(e){this._config=e;let t=await Lt(this.hass,e.workday_sensor,e.workday_calendar);this._warnings=t.warnings??[]}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=[{name:"workday_sensor",selector:{entity:{integration:"workday",domain:"binary_sensor"}}}],t=[{name:"workday_calendar",selector:{entity:{integration:"workday",domain:"calendar"}}}];return o`
      <div class="row">
        <label>${l(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${e}
          .data=${{workday_sensor:this._config.workday_sensor??""}}
          .computeLabel=${()=>""}
          @value-changed=${r=>{r.stopPropagation(),this._onSensorChange({detail:{value:r.detail.value?.workday_sensor||null}})}}
        ></ha-form>
      </div>
      <div class="row">
        <label>${l(this.hass,"ui.workday_calendar","Workday calendar")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${t}
          .data=${{workday_calendar:this._config.workday_calendar??""}}
          .computeLabel=${()=>""}
          @value-changed=${r=>{r.stopPropagation(),this._onCalendarChange({detail:{value:r.detail.value?.workday_calendar||null}})}}
        ></ha-form>
      </div>
      ${this._warnings.length?o`
        <div class="warnings">
          <strong>${l(this.hass,"ui.day_warning_prefix","Warning:")}</strong> ${l(this.hass,"ui.day_warning_text","rules now reference unconfigured entities:")}
          <ul>
            ${this._warnings.map(r=>o`<li>${r.area_id} / "${r.rule_name}" → ${r.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};q.styles=g`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,h([c({attribute:!1})],q.prototype,"hass",2),h([m()],q.prototype,"_config",2),h([m()],q.prototype,"_warnings",2),q=h([v("ambience-day-config")],q);var Ar=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],F=class extends f{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._warnings=[];this._expanded=new Set}async connectedCallback(){super.connectedCallback(),this._config=await Pe(this.hass)}async _persist(){let e=await Ht(this.hass,this._config.entity,this._config.groups);this._warnings=e.warnings??[]}_onEntityChange(e){this._config={...this._config,entity:e.detail.value||null},this._persist()}_nextGroupId(e){let t=new Set(e.map(r=>r.id));for(let r=1;r<=e.length+1;r++){let i=`group_${r}`;if(!t.has(i))return i}return`group_${e.length+1}`}_addGroup(){let e=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:e,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,e]),this._persist()}_toggleExpand(e){let t=new Set(this._expanded);t.has(e)?t.delete(e):t.add(e),this._expanded=t}_updateGroup(e,t){this._config={...this._config,groups:this._config.groups.map((r,i)=>i===e?{...r,...t}:r)},this._persist()}_removeGroup(e){let t=this._config.groups[e];if(this._config={...this._config,groups:this._config.groups.filter((r,i)=>i!==e)},t){let r=new Set(this._expanded);r.delete(t.id),this._expanded=r}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:Ar.map(e=>({value:e,label:xe(this.hass,e)}))}}}]}_renderConditions(e,t){if(customElements.get("ha-form"))return o`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:t.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),this._updateGroup(e,{conditions:i.detail.value.conditions??[]})}}
      ></ha-form>`;let r=t.conditions.map(i=>xe(this.hass,i));return o`<span class="conditions-list">${r.join(", ")}</span>`}_renderGroup(e,t){let r=this._expanded.has(t.id),i=t.conditions.map(a=>xe(this.hass,a)).join(", ");return o`
      <div class="group">
        <div class="group-header" @click=${()=>this._toggleExpand(t.id)}>
          <span class="chevron ${r?"open":""}">▶</span>
          <span class="label">${t.label}</span>
          <span class="codes">${i}</span>
          <button
            class="icon"
            title=${l(this.hass,"ui.title_delete","Delete")}
            @click=${a=>{a.stopPropagation(),this._removeGroup(e)}}
          >✕</button>
        </div>
        ${r?o`<div class="body" @click=${a=>a.stopPropagation()}>
              <input
                .value=${t.label}
                aria-label=${t.label}
                @change=${a=>this._updateGroup(e,{label:a.target.value})}
              />
              ${this._renderConditions(e,t)}
            </div>`:""}
      </div>
    `}render(){let e=[{name:"entity",selector:{entity:{domain:"weather"}}}];return o`
      <div class="row">
        <label class="section">${l(this.hass,"ui.weather_entity","Weather entity")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${e}
          .data=${{entity:this._config.entity??""}}
          .computeLabel=${()=>""}
          @value-changed=${t=>{t.stopPropagation(),this._onEntityChange({detail:{value:t.detail.value?.entity||null}})}}
        ></ha-form>
      </div>

      <h4>${l(this.hass,"ui.groups","Groups")}</h4>
      ${this._config.groups.map((t,r)=>this._renderGroup(r,t))}
      <button class="add" @click=${()=>this._addGroup()}>
        ${l(this.hass,"ui.add_group","+ Add group")}
      </button>

      ${this._warnings.length?o`
        <div class="warnings">
          <strong>${l(this.hass,"ui.day_warning_prefix","Warning:")}</strong>
          ${l(this.hass,"ui.weather_warning_text","rules now reference an unconfigured weather entity:")}
          <ul>${this._warnings.map(t=>o`<li>${t.area_id} / "${t.rule_name}" → ${t.reason}</li>`)}</ul>
        </div>
      `:""}
    `}};F.styles=g`
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
  `,h([c({attribute:!1})],F.prototype,"hass",2),h([m()],F.prototype,"_config",2),h([m()],F.prototype,"_warnings",2),h([m()],F.prototype,"_expanded",2),F=h([v("ambience-weather-config")],F);var Ir=new Set(["time_of_day","day","weather"]),B=class extends f{constructor(){super(...arguments);this._matchers=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._matchers=await Se(this.hass)}catch(e){this._error=e.message||String(e)}}render(){let e=this._matchers.filter(t=>Ir.has(t.name)).slice().sort((t,r)=>t.priority-r.priority);return o`
      ${this._error?o`<p class="error">${this._error}</p>`:""}
      ${e.map(t=>o`
        <ambience-matcher-card
          .hass=${this.hass}
          .matcherName=${t.name}
          .matcherDescription=${t.description}
        >
          ${t.name==="time_of_day"?o`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`:t.name==="day"?o`<ambience-day-config .hass=${this.hass}></ambience-day-config>`:t.name==="weather"?o`<ambience-weather-config .hass=${this.hass}></ambience-weather-config>`:o``}
        </ambience-matcher-card>
      `)}
    `}};B.styles=g`
    :host { display: block; padding: 1rem; max-width: 60rem; margin: 0 auto; }
    .error { color: var(--error-color, #d32f2f); }
  `,h([c({attribute:!1})],B.prototype,"hass",2),h([m()],B.prototype,"_matchers",2),h([m()],B.prototype,"_error",2),B=h([v("ambience-configuration-view")],B);var Q=class extends f{constructor(){super(...arguments);this._view="areas"}connectedCallback(){super.connectedCallback(),W(this)}render(){return o`
      <header>
        <h1>${l(this.hass,"ui.panel_title","Ambience")}</h1>
        <nav>
          <button
            class=${this._view==="areas"?"active":""}
            @click=${()=>{this._view="areas"}}
          >${l(this.hass,"ui.tab_areas","Areas")}</button>
          <button
            class=${this._view==="configuration"?"active":""}
            @click=${()=>{this._view="configuration"}}
          >${l(this.hass,"ui.tab_configuration","Configuration")}</button>
        </nav>
      </header>
      ${this._view==="areas"?o`<ambience-scopes-view .hass=${this.hass}></ambience-scopes-view>`:o`<ambience-configuration-view .hass=${this.hass}></ambience-configuration-view>`}
    `}};Q.styles=g`
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
  `,h([c({attribute:!1})],Q.prototype,"hass",2),h([m()],Q.prototype,"_view",2),Q=h([v("ambience-panel")],Q);export{Q as AmbiencePanel};
