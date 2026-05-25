/* Ambience panel — bundled output. Do not edit by hand. */
var Nt=Object.defineProperty;var Rt=Object.getOwnPropertyDescriptor;var d=(n,s,e,t)=>{for(var r=t>1?void 0:t?Rt(s,e):s,i=n.length-1,a;i>=0;i--)(a=n[i])&&(r=(t?a(s,e,r):a(r))||r);return t&&r&&Nt(s,e,r),r};var ge=globalThis,_e=ge.ShadowRoot&&(ge.ShadyCSS===void 0||ge.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ie=Symbol(),Ye=new WeakMap,ie=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==Ie)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(_e&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=Ye.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&Ye.set(e,s))}return s}toString(){return this.cssText}},Xe=n=>new ie(typeof n=="string"?n:n+"",void 0,Ie),g=(n,...s)=>{let e=n.length===1?n[0]:s.reduce((t,r,i)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+n[i+1],n[0]);return new ie(e,n,Ie)},Ze=(n,s)=>{if(_e)n.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),r=ge.litNonce;r!==void 0&&t.setAttribute("nonce",r),t.textContent=e.cssText,n.appendChild(t)}},Ne=_e?n=>n:n=>n instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return Xe(e)})(n):n;var{is:Mt,defineProperty:Ot,getOwnPropertyDescriptor:zt,getOwnPropertyNames:Ft,getOwnPropertySymbols:jt,getPrototypeOf:Wt}=Object,ve=globalThis,Qe=ve.trustedTypes,Ut=Qe?Qe.emptyScript:"",Gt=ve.reactiveElementPolyfillSupport,ne=(n,s)=>n,ae={toAttribute(n,s){switch(s){case Boolean:n=n?Ut:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,s){let e=n;switch(s){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},ye=(n,s)=>!Mt(n,s),et={attribute:!0,type:String,converter:ae,reflect:!1,useDefault:!1,hasChanged:ye};Symbol.metadata??=Symbol("metadata"),ve.litPropertyMetadata??=new WeakMap;var T=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=et){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),r=this.getPropertyDescriptor(s,t,e);r!==void 0&&Ot(this.prototype,s,r)}}static getPropertyDescriptor(s,e,t){let{get:r,set:i}=zt(this.prototype,s)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){let h=r?.call(this);i?.call(this,a),this.requestUpdate(s,h,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??et}static _$Ei(){if(this.hasOwnProperty(ne("elementProperties")))return;let s=Wt(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(ne("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ne("properties"))){let e=this.properties,t=[...Ft(e),...jt(e)];for(let r of t)this.createProperty(r,e[r])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let r=this._$Eu(e,t);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let r of t)e.unshift(Ne(r))}else s!==void 0&&e.push(Ne(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ze(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),r=this.constructor._$Eu(s,t);if(r!==void 0&&t.reflect===!0){let i=(t.converter?.toAttribute!==void 0?t.converter:ae).toAttribute(e,t.type);this._$Em=s,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(s,e){let t=this.constructor,r=t._$Eh.get(s);if(r!==void 0&&this._$Em!==r){let i=t.getPropertyOptions(r),a=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:ae;this._$Em=r;let h=a.fromAttribute(e,i.type);this[r]=h??this._$Ej?.get(r)??h,this._$Em=null}}requestUpdate(s,e,t,r=!1,i){if(s!==void 0){let a=this.constructor;if(r===!1&&(i=this[s]),t??=a.getPropertyOptions(s),!((t.hasChanged??ye)(i,e)||t.useDefault&&t.reflect&&i===this._$Ej?.get(s)&&!this.hasAttribute(a._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:r,wrapped:i},a){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,a??e??this[s]),i!==!0||a!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),r===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[r,i]of t){let{wrapped:a}=i,h=this[r];a!==!0||this._$AL.has(r)||h===void 0||this.C(r,void 0,i,h)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};T.elementStyles=[],T.shadowRootOptions={mode:"open"},T[ne("elementProperties")]=new Map,T[ne("finalized")]=new Map,Gt?.({ReactiveElement:T}),(ve.reactiveElementVersions??=[]).push("2.1.2");var We=globalThis,tt=n=>n,be=We.trustedTypes,rt=be?be.createPolicy("lit-html",{createHTML:n=>n}):void 0,lt="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,dt="?"+O,qt=`<${dt}>`,V=document,le=()=>V.createComment(""),de=n=>n===null||typeof n!="object"&&typeof n!="function",Ue=Array.isArray,Bt=n=>Ue(n)||typeof n?.[Symbol.iterator]=="function",Re=`[ 	
\f\r]`,oe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,st=/-->/g,it=/>/g,q=RegExp(`>|${Re}(?:([^\\s"'>=/]+)(${Re}*=${Re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),nt=/'/g,at=/"/g,ht=/^(?:script|style|textarea|title)$/i,Ge=n=>(s,...e)=>({_$litType$:n,strings:s,values:e}),l=Ge(1),Lr=Ge(2),Tr=Ge(3),K=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ot=new WeakMap,B=V.createTreeWalker(V,129);function ut(n,s){if(!Ue(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return rt!==void 0?rt.createHTML(s):s}var Vt=(n,s)=>{let e=n.length-1,t=[],r,i=s===2?"<svg>":s===3?"<math>":"",a=oe;for(let h=0;h<e;h++){let c=n[h],f,v,y=-1,L=0;for(;L<c.length&&(a.lastIndex=L,v=a.exec(c),v!==null);)L=a.lastIndex,a===oe?v[1]==="!--"?a=st:v[1]!==void 0?a=it:v[2]!==void 0?(ht.test(v[2])&&(r=RegExp("</"+v[2],"g")),a=q):v[3]!==void 0&&(a=q):a===q?v[0]===">"?(a=r??oe,y=-1):v[1]===void 0?y=-2:(y=a.lastIndex-v[2].length,f=v[1],a=v[3]===void 0?q:v[3]==='"'?at:nt):a===at||a===nt?a=q:a===st||a===it?a=oe:(a=q,r=void 0);let M=a===q&&n[h+1].startsWith("/>")?" ":"";i+=a===oe?c+qt:y>=0?(t.push(f),c.slice(0,y)+lt+c.slice(y)+O+M):c+O+(y===-2?h:M)}return[ut(n,i+(n[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},he=class n{constructor({strings:s,_$litType$:e},t){let r;this.parts=[];let i=0,a=0,h=s.length-1,c=this.parts,[f,v]=Vt(s,e);if(this.el=n.createElement(f,t),B.currentNode=this.el.content,e===2||e===3){let y=this.el.content.firstChild;y.replaceWith(...y.childNodes)}for(;(r=B.nextNode())!==null&&c.length<h;){if(r.nodeType===1){if(r.hasAttributes())for(let y of r.getAttributeNames())if(y.endsWith(lt)){let L=v[a++],M=r.getAttribute(y).split(O),fe=/([.?@])?(.*)/.exec(L);c.push({type:1,index:i,name:fe[2],strings:M,ctor:fe[1]==="."?Oe:fe[1]==="?"?ze:fe[1]==="@"?Fe:ee}),r.removeAttribute(y)}else y.startsWith(O)&&(c.push({type:6,index:i}),r.removeAttribute(y));if(ht.test(r.tagName)){let y=r.textContent.split(O),L=y.length-1;if(L>0){r.textContent=be?be.emptyScript:"";for(let M=0;M<L;M++)r.append(y[M],le()),B.nextNode(),c.push({type:2,index:++i});r.append(y[L],le())}}}else if(r.nodeType===8)if(r.data===dt)c.push({type:2,index:i});else{let y=-1;for(;(y=r.data.indexOf(O,y+1))!==-1;)c.push({type:7,index:i}),y+=O.length-1}i++}}static createElement(s,e){let t=V.createElement("template");return t.innerHTML=s,t}};function Q(n,s,e=n,t){if(s===K)return s;let r=t!==void 0?e._$Co?.[t]:e._$Cl,i=de(s)?void 0:s._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(n),r._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=r:e._$Cl=r),r!==void 0&&(s=Q(n,r._$AS(n,s.values),r,t)),s}var Me=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,r=(s?.creationScope??V).importNode(e,!0);B.currentNode=r;let i=B.nextNode(),a=0,h=0,c=t[0];for(;c!==void 0;){if(a===c.index){let f;c.type===2?f=new ue(i,i.nextSibling,this,s):c.type===1?f=new c.ctor(i,c.name,c.strings,this,s):c.type===6&&(f=new je(i,this,s)),this._$AV.push(f),c=t[++h]}a!==c?.index&&(i=B.nextNode(),a++)}return B.currentNode=V,r}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},ue=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=Q(this,s,e),de(s)?s===b||s==null||s===""?(this._$AH!==b&&this._$AR(),this._$AH=b):s!==this._$AH&&s!==K&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):Bt(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==b&&de(this._$AH)?this._$AA.nextSibling.data=s:this.T(V.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,r=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=he.createElement(ut(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===r)this._$AH.p(e);else{let i=new Me(r,this),a=i.u(this.options);i.p(e),this.T(a),this._$AH=i}}_$AC(s){let e=ot.get(s.strings);return e===void 0&&ot.set(s.strings,e=new he(s)),e}k(s){Ue(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,r=0;for(let i of s)r===e.length?e.push(t=new n(this.O(le()),this.O(le()),this,this.options)):t=e[r],t._$AI(i),r++;r<e.length&&(this._$AR(t&&t._$AB.nextSibling,r),e.length=r)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=tt(s).nextSibling;tt(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},ee=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,r,i){this.type=1,this._$AH=b,this._$AN=void 0,this.element=s,this.name=e,this._$AM=r,this.options=i,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=b}_$AI(s,e=this,t,r){let i=this.strings,a=!1;if(i===void 0)s=Q(this,s,e,0),a=!de(s)||s!==this._$AH&&s!==K,a&&(this._$AH=s);else{let h=s,c,f;for(s=i[0],c=0;c<i.length-1;c++)f=Q(this,h[t+c],e,c),f===K&&(f=this._$AH[c]),a||=!de(f)||f!==this._$AH[c],f===b?s=b:s!==b&&(s+=(f??"")+i[c+1]),this._$AH[c]=f}a&&!r&&this.j(s)}j(s){s===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},Oe=class extends ee{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===b?void 0:s}},ze=class extends ee{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==b)}},Fe=class extends ee{constructor(s,e,t,r,i){super(s,e,t,r,i),this.type=5}_$AI(s,e=this){if((s=Q(this,s,e,0)??b)===K)return;let t=this._$AH,r=s===b&&t!==b||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,i=s!==b&&(t===b||r);r&&this.element.removeEventListener(this.name,this,t),i&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},je=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){Q(this,s)}};var Kt=We.litHtmlPolyfillSupport;Kt?.(he,ue),(We.litHtmlVersions??=[]).push("3.3.2");var ct=(n,s,e)=>{let t=e?.renderBefore??s,r=t._$litPart$;if(r===void 0){let i=e?.renderBefore??null;t._$litPart$=r=new ue(s.insertBefore(le(),i),i,void 0,e??{})}return r._$AI(n),r};var qe=globalThis,p=class extends T{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=ct(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}};p._$litElement$=!0,p.finalized=!0,qe.litElementHydrateSupport?.({LitElement:p});var Jt=qe.litElementPolyfillSupport;Jt?.({LitElement:p});(qe.litElementVersions??=[]).push("4.2.2");var _=n=>(s,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(n,s)}):customElements.define(n,s)};var Yt={attribute:!0,type:String,converter:ae,reflect:!1,hasChanged:ye},Xt=(n=Yt,s,e)=>{let{kind:t,metadata:r}=e,i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),t==="setter"&&((n=Object.create(n)).wrapped=!0),i.set(e.name,n),t==="accessor"){let{name:a}=e;return{set(h){let c=s.get.call(this);s.set.call(this,h),this.requestUpdate(a,c,n,!0,h)},init(h){return h!==void 0&&this.C(a,void 0,n,h),h}}}if(t==="setter"){let{name:a}=e;return function(h){let c=this[a];s.call(this,h),this.requestUpdate(a,c,n,!0,h)}}throw Error("Unsupported decorator location: "+t)};function u(n){return(s,e)=>typeof e=="object"?Xt(n,s,e):((t,r,i)=>{let a=r.hasOwnProperty(i);return r.constructor.createProperty(i,t),a?Object.getOwnPropertyDescriptor(r,i):void 0})(n,s,e)}function m(n){return u({...n,state:!0,attribute:!1})}function C(n,s,e){let t=n?.localize?.(s);return t&&t!==s?t:e}function Be(n){let s=n.replaceAll("_"," ").toLowerCase();return s.charAt(0).toUpperCase()+s.slice(1)}function te(n,s){return C(n,`component.ambience.matcher.${s}`,Be(s))}function mt(n,s){return C(n,`component.ambience.action.${s}`,Be(s))}function re(n,s){return C(n,`component.ambience.anchor.${s}`,Be(s))}function J(n,s,e){let t=e[s]?.label;if(t)return t;let r=s.charAt(0).toUpperCase()+s.slice(1);return C(n,`component.ambience.time_of_day_period.${s}`,r)}function o(n,s,e){return C(n,`component.ambience.${s}`,e)}var Zt=["mon","tue","wed","thu","fri","sat","sun"],Qt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function we(n,s){return C(n,`component.ambience.weekday.${Zt[s]}`,Qt[s]??String(s))}var er={weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"};function ke(n,s){return C(n,`component.ambience.day_item.${s}`,er[s]??s)}var tr=["January","February","March","April","May","June","July","August","September","October","November","December"];function se(n,s){return C(n,`component.ambience.month.${s}`,tr[s-1]??String(s))}var rr={"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"};function xe(n,s){return C(n,`component.ambience.weather_condition.${s}`,rr[s]??s)}var sr={temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"};function ce(n,s){return C(n,`component.ambience.weather_attr.${s}`,sr[s]??s)}var ir={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},nr={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},ar={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function Ve(n,s,e){if(s==="humidity")return"%";let t=ar[s];if(t){let a=e?.attributes?.[t];if(typeof a=="string"&&a)return a}let r=nr[s],i=n?.config?.unit_system;return r&&i&&typeof i[r]=="string"?i[r]:ir[s]??""}var or={is:"is",is_not:"is not",and:"AND",or:"OR",not:"NOT"};function x(n,s){return C(n,`component.ambience.state_op.${s}`,or[s]??s)}var lr=["ha-input","ha-textfield","ha-form"],dr=["ha-input","ha-textfield"];function pt(){for(let n of dr)if(customElements.get(n))return n;return null}function z(n,s){for(let e of lr)customElements.get(e)||customElements.whenDefined(e).then(()=>n.requestUpdate())}async function ft(n){return n.callWS({type:"ambience/areas/list"})}async function gt(n,s){return n.callWS({type:"ambience/area/get",area_id:s})}async function _t(n,s,e){return n.callWS({type:"ambience/area/save",area_id:s,config:e})}async function Ee(n){return n.callWS({type:"ambience/matchers/list"})}async function vt(n){return n.callWS({type:"ambience/actions/list"})}async function Se(n){return n.callWS({type:"ambience/time_of_day_periods/list"})}async function yt(n,s,e){return n.callWS({type:"ambience/time_of_day_periods/save",custom:s,hidden:e})}async function Ce(n){return n.callWS({type:"ambience/matchers/enabled/list"})}async function bt(n,s){return n.callWS({type:"ambience/matchers/enabled/save",enabled:s})}async function He(n){return n.callWS({type:"ambience/matchers/day/config/list"})}async function $t(n,s,e){return n.callWS({type:"ambience/matchers/day/config/save",workday_sensor:s,workday_calendar:e})}async function Pe(n){return n.callWS({type:"ambience/matchers/weather/config/list"})}async function wt(n,s,e){return n.callWS({type:"ambience/matchers/weather/config/save",entity:s,groups:e})}async function kt(n,s){return n.callWS({type:"ambience/state/known_states",entity_id:s})}function Le(n,s="New rule"){if(n.name&&n.name.trim())return n.name;let e=n.when?.scene;return typeof e=="string"&&e.trim()?e:s}function Te(n,s,e){return s==null?o(e.hass,"ui.summary_any_paren","(any)"):n==="time_of_day"?De(s,e):n==="day"?hr(s,e):n==="weather"?mr(s,e):n==="state"?pr(s,e):String(s)}function hr(n,s={}){if(n===null)return o(s.hass,"day_summary.any","any");let e=n.include??[],t=n.exclude??[],r=e.length===0?o(s.hass,"day_summary.any_day","any day"):e.map(a=>xt(a,s)).join(", ");if(t.length===0)return r;let i=o(s.hass,"day_summary.except","except");return`${r} (${i} ${t.map(a=>xt(a,s)).join(", ")})`}function xt(n,s){switch(n.kind){case"weekday":return n.days.map(e=>we(s.hass,e)).join("/");case"day_of_month":return`${o(s.hass,"day_summary.day_prefix","day")} ${n.days}`;case"date":return`${se(s.hass,n.month)} ${n.day}`;case"date_range":return`${se(s.hass,n.from.month)} ${n.from.day} \u2192 ${se(s.hass,n.to.month)} ${n.to.day}`;case"last_day":return o(s.hass,"day_summary.last_day","last day");case"workday":return o(s.hass,"day_summary.workday","workday");case"holiday":return o(s.hass,"day_summary.holiday","holiday");case"first_workday":return o(s.hass,"day_summary.first_workday","first workday");case"last_workday":return o(s.hass,"day_summary.last_workday","last workday")}}var ur={"<":"<","<=":"\u2264",">":">",">=":"\u2265"};function cr(n){return n.split(/[\s_-]+/).filter(s=>s!=="").map(s=>s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()).join(" ")}function mr(n,s={}){if(n===null)return o(s.hass,"ui.summary_any","any");let e=new Map((s.weatherGroups??[]).map(a=>[a.id,a.label])),t=(n.groups??[]).map(a=>e.get(a)??cr(a)).join("/"),r=(n.thresholds??[]).map(a=>`${ce(s.hass,a.attribute)} ${ur[a.op]??a.op} ${a.value}`).join(", "),i=[t,r].filter(a=>a!=="");return i.length===0?o(s.hass,"ui.summary_any","any"):i.join(", ")}function pr(n,s={}){return n==null?o(s.hass,"ui.summary_any","any"):Ae(n,s)}function Ae(n,s){if(n.kind==="is"||n.kind==="is_not"){let e=n.kind==="is"?x(s.hass,"is"):x(s.hass,"is_not"),t=n.states.join("/"),i=`${n.attribute?`${n.entity_id}.${n.attribute}`:n.entity_id} ${e} ${t}`;return n.for&&gr(n.for)?`${i} ${o(s.hass,"ui.for_prefix","for")} \u2265${_r(n.for)}`:i}if(n.kind==="and"||n.kind==="or"){let e=` ${x(s.hass,n.kind)} `;return n.items.map(t=>fr(t,s)).join(e)}return n.kind==="not"?`${x(s.hass,"not")} (${Ae(n.item,s)})`:""}function fr(n,s){return n.kind==="and"||n.kind==="or"?`(${Ae(n,s)})`:Ae(n,s)}function gr(n){return n.h>0||n.m>0||n.s>0}function _r(n){let s=[];return n.h&&s.push(`${n.h}h`),n.m&&s.push(`${n.m}m`),n.s&&s.push(`${n.s}s`),s.length?s.join(" "):"0s"}function De(n,s){if(n===null)return o(s.hass,"ui.summary_any","any");let e=Array.isArray(n)?n:[n],t=s.periods?.custom??{};return e.map(r=>"period"in r?J(s.hass,r.period,t):`${Et(r.from,s)} \u2192 ${Et(r.to,s)}`).join(", ")}function Et(n,s){if(n.kind==="time")return`${String(n.hh).padStart(2,"0")}:${String(n.mm).padStart(2,"0")}`;let e=re(s.hass,n.anchor);if(n.offset_min===0)return e;let t=Math.abs(n.offset_min),r=t%60===0?`${t/60}${o(s.hass,"ui.unit_hour_abbr","h")}`:`${t}${o(s.hass,"ui.unit_min_abbr","m")}`;return`${e}${n.offset_min<0?"-":"+"}${r}`}function St(n,s,e){let t=mt(e.hass,n.action),r=s?.domains?.[0]??o(e.hass,"ui.target_noun","target"),i=n.entity_ids.length,a;i===0?a=o(e.hass,"ui.no_targets","(no targets)"):i===1?a=`1 ${r}`:a=`${i} ${r}s`;let h={};for(let f of s?.target_params??[])f.unit&&(h[f.name]=f.unit);let c=Object.entries(n.params).filter(([,f])=>f!=null&&f!=="").map(([f,v])=>`${f} ${v}${h[f]??""}`).join(", ");return c?`${t}: ${a}, ${c}`:`${t}: ${a}`}var k=class extends p{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this._dragFrom=null;this._dragOver=null}_emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_summary(e){let t=new Map((this.matchers??[]).map(c=>[c.name,c.priority])),r=Object.keys(e.when).filter(c=>e.when[c]!=null&&(c==="scene"||!this.enabledMatchers||this.enabledMatchers.includes(c))).sort((c,f)=>(t.get(c)??1/0)-(t.get(f)??1/0)),i=r.length===0?o(this.hass,"ui.summary_any","any"):r.map(c=>`${te(this.hass,c)}: ${Te(c,e.when[c],{hass:this.hass,periods:this.periods,weatherGroups:this.weatherConfig?.groups})}`).join(", "),a=e.actions.length,h=a===1?o(this.hass,"ui.action_singular","action"):o(this.hass,"ui.action_plural","actions");return`${i} \xB7 ${a} ${h}`}_onDragStart(e){this._dragFrom=e}_onDragOver(e,t){this._dragFrom===null||t===this._dragFrom||(e.preventDefault(),this._dragOver=t)}_onDrop(e){let t=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(t===null||t===e)&&this._emit("reorder-rules",{from:t,to:e})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(e,t){let r=t.name||o(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(e+1));window.confirm(o(this.hass,"ui.confirm_delete",'Delete "{name}"?').replace("{name}",r))&&this._emit("delete-rule",{index:e})}render(){return this.rules.length===0?l`
        <p class="empty">${o(this.hass,"ui.no_rules_yet","No rules yet.")}</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          ${o(this.hass,"ui.add_rule","+ Add rule")}
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
              ${this.autoSort?"":l`<span class="handle" title=${o(this.hass,"ui.drag_to_reorder","Drag to reorder")}>⠿</span>`}
              <span class="idx">${t+1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${()=>this._emit("edit-rule",{index:t})}
                >
                  ${Le(e,o(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(t+1)))}
                </div>
                <div class="summary">${this._summary(e)}</div>
              </div>
              <button
                @click=${()=>this._emit("duplicate-rule",{index:t})}
                title=${o(this.hass,"ui.duplicate","Duplicate")}
              >
                ⧉
              </button>
              <button
                @click=${()=>this._confirmDelete(t,e)}
                title=${o(this.hass,"ui.title_delete","Delete")}
              >
                🗑
              </button>
            </li>
          `)}
      </ul>
      <button class="add" @click=${()=>this._emit("add-rule",{})}>
        ${o(this.hass,"ui.add_rule","+ Add rule")}
      </button>
    `}};k.styles=g`
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
  `,d([u({attribute:!1})],k.prototype,"rules",2),d([u({type:Boolean})],k.prototype,"autoSort",2),d([u({attribute:!1})],k.prototype,"periods",2),d([u({attribute:!1})],k.prototype,"weatherConfig",2),d([u({attribute:!1})],k.prototype,"hass",2),d([u({attribute:!1})],k.prototype,"enabledMatchers",2),d([u({attribute:!1})],k.prototype,"matchers",2),d([m()],k.prototype,"_dragFrom",2),d([m()],k.prototype,"_dragOver",2),k=d([_("ambience-rules-list")],k);function Ct(n,s,e){if(!n||!n.entities||!s)return[];let t=n.entities,r=n.devices??{};return Object.values(t).filter(i=>!!(i.area_id===s||i.device_id&&r[i.device_id]?.area_id===s)).filter(i=>e.includes(i.entity_id.split(".")[0])).map(i=>i.entity_id).sort()}var H=class extends p{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=e=>{this._open&&(e.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=e=>{e.stopPropagation();let t=e.detail.value?.scene??"";this._emit(t.trim()===""?null:t)};this._sceneComputeLabel=e=>e.name==="scene"?o(this.hass,"ui.scene_name","Scene name"):e.name}connectedCallback(){super.connectedCallback(),z(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(e){e.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(t=>({value:t,label:t})),custom_value:!0,mode:"dropdown"}}}])}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target.value;this._emit(t.trim()===""?null:t),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(e){e.key==="Escape"&&this._open&&(this._open=!1,e.stopPropagation())}_toggle(e){e.preventDefault(),this._open=!this._open}_select(e,t){t.preventDefault(),this._emit(e),this._open=!1}render(){if(customElements.get("ha-form")){let e={scene:this.value??""};return l`
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
          placeholder=${o(this.hass,"ui.scene_name","Scene name")}
          .value=${this.value??""}
          @input=${this._onInput}
          @focus=${this._onFocus}
          @keydown=${this._onKeyDown}
        />
        <button
          class="toggle"
          type="button"
          tabindex="-1"
          aria-label=${o(this.hass,"ui.show_scene_suggestions","Show scene suggestions")}
          @mousedown=${this._toggle}
        >
          ▼
        </button>
      </div>
      ${this._open?l`
            <div class="menu" role="listbox">
              ${this.suggestions.length===0?l`<div class="empty">
                    ${o(this.hass,"ui.no_scenes_yet","No scenes yet \u2014 type to create one")}
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
    `}};H.styles=g`
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
  `,d([u({attribute:!1})],H.prototype,"hass",2),d([u()],H.prototype,"value",2),d([u({attribute:!1})],H.prototype,"suggestions",2),d([m()],H.prototype,"_schema",2),d([m()],H.prototype,"_open",2),H=d([_("ambience-scene-combobox")],H);var vr=["dawn","sunrise","noon","sunset","dusk","midnight"],Y=class extends p{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onKindChange(e){let t=e.target.value;t!==this.value.kind&&(t==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let t=e.target.value,[r,i]=t.split(":").map(a=>parseInt(a,10));Number.isNaN(r)||Number.isNaN(i)||this._emit({kind:"time",hh:r,mm:i})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let t=e.target.value;this._emit({kind:"sun",anchor:t,offset_min:this.value.offset_min})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let t=parseInt(e.target.value,10);Number.isNaN(t)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:t})}_renderTime(e){let t=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return l`<input type="time" .value=${t} @input=${this._onTimeChange} />`}_renderSun(e){let t=yr(e.offset_min,this.hass);return l`
      <select @change=${this._onAnchorChange}>
        ${vr.map(r=>l`<option value=${r} ?selected=${r===e.anchor}>${re(this.hass,r)}</option>`)}
      </select>
      <input
        type="number"
        step="1"
        placeholder=${o(this.hass,"ui.offset_placeholder","\xB1min, e.g. -30")}
        .value=${String(e.offset_min)}
        @input=${this._onOffsetChange}
      />
      <span class="offset-hint">${t}</span>
    `}render(){return l`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>${o(this.hass,"ui.endpoint_time","Time")}</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>${o(this.hass,"ui.endpoint_sun","Sun")}</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};Y.styles=g`
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
  `,d([u({attribute:!1})],Y.prototype,"hass",2),d([u({attribute:!1})],Y.prototype,"value",2),Y=d([_("ambience-time-endpoint")],Y);function yr(n,s){if(n===0)return"";let e=Math.abs(n),t=n<0?"\u2212":"+";if(e%60===0){let r=e/60,i=r===1?o(s,"ui.unit_hour","hour"):o(s,"ui.unit_hours","hours");return`${t}${r} ${i}`}return`${t}${e} ${o(s,"ui.unit_min","min")}`}var me={kind:"any"},Ht={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},P=class extends p{constructor(){super(...arguments);this.value=null;this._entries=[me];this._openIdx=0}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[me]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(t=>{let r=this._entries[this._openIdx];if(!r)return;let i=r.kind==="any"?"__any__":r.kind==="range"?"__custom__":r.period;t.value!==i&&(t.value=i)})}_predicateToEntries(e){return e===null?[me]:(Array.isArray(e)?e:[e]).map(r=>"period"in r?{kind:"period",period:r.period}:{kind:"range",from:r.from,to:r.to})}_emit(e){let t=e.filter(i=>i.kind!=="any").map(i=>i.kind==="period"?{period:i.period}:{from:i.from,to:i.to}),r=t.length===0?null:t.length===1?t[0]:t;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let e=Object.keys(this.periods.builtins),t=Object.keys(this.periods.custom).filter(i=>!(i in this.periods.builtins)),r=new Set(this.periods.hidden);return[...e.filter(i=>!r.has(i)),...t]}_onSelectChange(e,t){let r=t.target.value,i=[...this._entries];r==="__any__"?i[e]=me:r==="__custom__"?i[e]={kind:"range",...Ht}:i[e]={kind:"period",period:r},this._entries=i,this._emit(i)}_onRangeChange(e,t,r){r.stopPropagation();let i=this._entries[e];if(!i||i.kind!=="range")return;let a=[...this._entries];a[e]={...i,[t]:r.detail.value},this._entries=a,this._emit(a)}_onRemove(e){let t=this._entries.filter((r,i)=>i!==e);this._entries=t.length===0?[me]:t,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...Ht}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,t){let r;return e.kind==="any"?r=o(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?r=De({period:e.period},{hass:this.hass,periods:this.periods}):r=De({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),l`
      <div class="summary-chip" @click=${()=>this._onChipClick(t)}>
        <span class="chip-label">${r}</span>
        ${this._entries.length>1?l`<button class="remove" @click=${i=>{i.stopPropagation(),this._onRemove(t)}} title=${o(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,t,r){let i=this._effectiveIds(),a=this.periods?.custom??{};return l`
      <div class="entry">
        <div class="entry-header">
          <select @change=${h=>this._onSelectChange(t,h)}>
            ${r?l`<option value="__any__">${o(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${o(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${i.map(h=>l`<option value=${h}>
                ${J(this.hass,h,a)}${a[h]&&!this.periods?.builtins[h]?o(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?l`<button class="remove" @click=${()=>this._onRemove(t)} title=${o(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${e.kind==="range"?l`
              <div class="range-row">
                <label>${o(this.hass,"ui.from_label","From")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.from}
                  @value-changed=${h=>this._onRangeChange(t,"from",h)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${o(this.hass,"ui.to_label","To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${h=>this._onRangeChange(t,"to",h)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(r=>r.kind!=="any"),t=this._entries.length>1;return l`
      ${this._entries.map((r,i)=>t&&i!==this._openIdx?this._renderChip(r,i):this._renderEntry(r,i,i===0))}
      ${e?l`<button class="add-btn" @click=${this._onAdd}>${o(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};P.styles=g`
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
  `,d([u({attribute:!1})],P.prototype,"value",2),d([u({attribute:!1})],P.prototype,"periods",2),d([u({attribute:!1})],P.prototype,"hass",2),d([m()],P.prototype,"_entries",2),d([m()],P.prototype,"_openIdx",2),P=d([_("ambience-time-of-day-input")],P);function Pt(n){if(typeof n!="string")return!1;let s=n.split(",").map(e=>e.trim()).filter(e=>e!=="");if(s.length===0)return!1;for(let e of s)if(e.includes("-")){let t=e.split("-").map(a=>a.trim());if(t.length!==2||!/^\d+$/.test(t[0])||!/^\d+$/.test(t[1]))return!1;let r=Number(t[0]),i=Number(t[1]);if(!(r>=1&&r<=i&&i<=31))return!1}else{if(!/^\d+$/.test(e))return!1;let t=Number(e);if(!(t>=1&&t<=31))return!1}return!0}var Ke=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],br=new Set(["workday","holiday"]),$r=new Set(["first_workday","last_workday"]),wr=[31,29,31,30,31,30,31,31,30,31,30,31];function pe(n){return wr[n-1]??31}function Je(n){switch(n){case"weekday":return{kind:n,days:[]};case"day_of_month":return{kind:n,days:""};case"date":return{kind:n,month:1,day:1};case"date_range":return{kind:n,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:n}}}var F=class extends p{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?o(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return o(this.hass,"ui.field_kind","Kind");case"days":return o(this.hass,"ui.field_days_of_month","Days of month");case"month":return o(this.hass,"ui.field_month","Month");case"day":return o(this.hass,"ui.field_day","Day");case"from_month":return o(this.hass,"ui.field_from_month","From month");case"from_day":return o(this.hass,"ui.field_from_day","From day");case"to_month":return o(this.hass,"ui.field_to_month","To month");case"to_day":return o(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let t=e.include.length===0&&e.exclude.length===0;this.value=t?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_addItem(e,t){let r=this._current();r[e]=[...r[e],Je(t)],this._emit(r)}_removeItem(e,t){let r=this._current();r[e]=r[e].filter((i,a)=>a!==t),this._emit(r)}_updateItem(e,t,r){let i=this._current();i[e]=i[e].map((a,h)=>h===t?r:a),this._emit(i)}_kindDisabled(e){return!!(br.has(e)&&!this.dayConfig.workday_sensor||$r.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:Ke.map(e=>({value:e,label:ke(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:se(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:pe(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,t){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(t.days??"")}:e}_setDatePart(e,t,r){let i=Number(r);if(!Number.isFinite(i)||i<1)return e;if(e.kind==="date"){let{month:a,day:h}=e;return t==="month"&&(a=i),t==="day"&&(h=i),{kind:"date",month:a,day:Math.min(h,pe(a))}}if(e.kind==="date_range"){let a={...e.from},h={...e.to};return t==="from_month"&&(a.month=i),t==="from_day"&&(a.day=i),t==="to_month"&&(h.month=i),t==="to_day"&&(h.day=i),a.day=Math.min(a.day,pe(a.month)),h.day=Math.min(h.day,pe(h.month)),{kind:"date_range",from:a,to:h}}return e}_onKindForm(e,t,r){let i=r.kind;if(!i){this._removeItem(e,t);return}if(this._kindDisabled(i))return;let a=this._current()[e][t];a&&a.kind===i||this._updateItem(e,t,Je(i))}_dayOfMonthError(e){return e.trim()===""||Pt(e)?null:o(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(e,t,r,i){this._updateItem(e,t,this._bodyPatch(r,i))}_renderWeekday(e,t,r){return l`${[0,1,2,3,4,5,6].map(i=>l`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${r.days.includes(i)}
          @change=${a=>{let c=a.target.checked?[...r.days,i].sort((f,v)=>f-v):r.days.filter(f=>f!==i);this._updateItem(e,t,{kind:"weekday",days:c})}}
        />${we(this.hass,i)}
      </label>
    `)}`}_renderKindPicker(e,t,r){return customElements.get("ha-form")?l`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:r.kind}}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${i=>{i.stopPropagation(),this._onKindForm(e,t,i.detail.value)}}
      ></ha-form>`:l`
      <select
        class="kind"
        .value=${r.kind}
        @change=${i=>{let a=i.target.value;this._kindDisabled(a)||a===r.kind||this._updateItem(e,t,Je(a))}}
      >
        ${Ke.map(i=>l`<option value=${i} ?disabled=${this._kindDisabled(i)}>${ke(this.hass,i)}</option>`)}
      </select>
    `}_renderItemBody(e,t,r){if(r.kind==="weekday")return this._renderWeekday(e,t,r);if(customElements.get("ha-form")){if(r.kind==="date")return this._renderDateRow(e,t,r,"month","day",r.month,r.day);if(r.kind==="date_range")return l`
          ${this._renderDateRow(e,t,r,"from_month","from_day",r.from.month,r.from.day)}
          ${this._renderDateRow(e,t,r,"to_month","to_day",r.to.month,r.to.day)}
        `;let i=this._bodySchema(r);if(!i)return l``;let a=r.kind==="day_of_month"?this._dayOfMonthError(r.days):null;return l`<ha-form
        .hass=${this.hass}
        .schema=${i}
        .data=${this._bodyData(r)}
        .error=${a?{days:a}:void 0}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${h=>{h.stopPropagation(),this._onBodyForm(e,t,r,h.detail.value)}}
      ></ha-form>`}return this._renderNativeBody(e,t,r)}_renderDateRow(e,t,r,i,a,h,c){let f=(v,y)=>{this._updateItem(e,t,this._setDatePart(r,v,y[v]))};return l`
      <div class="date-row">
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:i,required:!0,selector:this._monthSelector()}]}
          .data=${{[i]:String(h)}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${v=>{v.stopPropagation(),f(i,v.detail.value)}}
        ></ha-form>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:a,required:!0,selector:this._daySelector(h)}]}
          .data=${{[a]:c}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${v=>{v.stopPropagation(),f(a,v.detail.value)}}
        ></ha-form>
      </div>
    `}_renderNativeBody(e,t,r){if(r.kind==="day_of_month"){let h=this._dayOfMonthError(r.days);return l`<input
        type="text" placeholder=${o(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${r.days}
        @change=${c=>this._updateItem(e,t,this._bodyPatch(r,{days:c.target.value}))}
      />${h?l`<div class="field-error">${h}</div>`:""}`}let i=(h,c)=>l`
      <input type="number" min="1" max="12" .value=${String(c)}
        @change=${f=>this._updateItem(e,t,this._setDatePart(r,h,f.target.value))} />
    `,a=(h,c,f)=>l`
      <input type="number" min="1" max=${String(pe(c))} .value=${String(f)}
        @change=${v=>this._updateItem(e,t,this._setDatePart(r,h,v.target.value))} />
    `;return r.kind==="date"?l`${i("month",r.month)} / ${a("day",r.month,r.day)}`:r.kind==="date_range"?l`
        <span>${o(this.hass,"ui.from","from")}</span>
        ${i("from_month",r.from.month)} / ${a("from_day",r.from.month,r.from.day)}
        <span>${o(this.hass,"ui.to","to")}</span>
        ${i("to_month",r.to.month)} / ${a("to_day",r.to.month,r.to.day)}
      `:l``}_renderAddPicker(e){let t=e==="include"?o(this.hass,"ui.add_include_item","+ Add include item"):o(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let r=()=>t;return l`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${r}
        @value-changed=${i=>{i.stopPropagation();let a=i.detail.value.kind;a&&!this._kindDisabled(a)&&this._addItem(e,a)}}
      ></ha-form>`}return l`
      <select
        .value=${""}
        @change=${r=>{let i=r.target.value;i&&(this._addItem(e,i),r.target.value="")}}
      >
        <option value="">${t}</option>
        ${Ke.map(r=>l`<option value=${r} ?disabled=${this._kindDisabled(r)}>${ke(this.hass,r)}</option>`)}
      </select>
    `}_renderItem(e,t,r){return l`
      <div class="item">
        ${this._renderKindPicker(e,t,r)}
        <div class="body">${this._renderItemBody(e,t,r)}</div>
        <button class="remove" title=${o(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(e,t)}>✕</button>
      </div>
    `}_renderSection(e,t){return l`
      <div class="section">
        <h4>${e==="include"?o(this.hass,"ui.include","Include"):o(this.hass,"ui.exclude","Exclude")}</h4>
        ${t.length===0&&e==="include"?l`<div class="hint">${o(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${t.map((r,i)=>this._renderItem(e,i,r))}
        ${this._renderAddPicker(e)}
      </div>
    `}render(){let{include:e,exclude:t}=this._current();return l`
      ${this._renderSection("include",e)}
      ${this._renderSection("exclude",t)}
    `}};F.styles=g`
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
  `,d([u({attribute:!1})],F.prototype,"hass",2),d([u({attribute:!1})],F.prototype,"value",2),d([u({attribute:!1})],F.prototype,"dayConfig",2),F=d([_("ambience-day-predicate-input")],F);var At=["temperature","apparent_temperature","humidity","wind_speed","pressure"],Lt=["<","<=",">",">="],Tt={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},D=class extends p{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(e){let t=e.groups.length===0&&e.thresholds.length===0;this.value=t?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setGroups(e){this._emit({...this._current(),groups:e})}_addThreshold(){let e=this._current();e.thresholds=[...e.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(e)}_updateThreshold(e,t){let r=this._current();r.thresholds=r.thresholds.map((i,a)=>a===e?t:i),this._emit(r)}_removeThreshold(e){let t=this._current();t.thresholds=t.thresholds.filter((r,i)=>i!==e),this._emit(t)}_attributeSchema(e){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:At.map(t=>({value:t,label:ce(this.hass,t)}))}}}]}_opSchema(e){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:Lt.map(t=>({value:t,label:Tt[t]}))}}}]}_entityState(){let e=this.weatherEntity;return e?this.hass?.states?.[e]:void 0}_valueSchema(e,t){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:Ve(this.hass,t,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(e=>({value:e.id,label:e.label}))}}}]}_renderGroups(e){return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{groups:e}}
        .computeLabel=${()=>""}
        @value-changed=${t=>{t.stopPropagation(),this._setGroups(t.detail.value.groups??[])}}
      ></ha-form>`:l`${this.groups.map(t=>l`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${e.includes(t.id)}
          @change=${r=>{let i=r.target.checked;this._setGroups(i?[...e,t.id]:e.filter(a=>a!==t.id))}} />${t.label}
      </label>`)}`}_renderAttributeSelect(e,t){return customElements.get("ha-form")?l`<ha-form
        class="attr-form"
        .hass=${this.hass}
        .schema=${this._attributeSchema(e)}
        .data=${{attribute:t.attribute}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation();let i=r.detail.value.attribute;i&&this._updateThreshold(e,{...t,attribute:i})}}
      ></ha-form>`:l`<select
      @change=${r=>this._updateThreshold(e,{...t,attribute:r.target.value})}>
      ${At.map(r=>l`<option value=${r} ?selected=${r===t.attribute}>${ce(this.hass,r)}</option>`)}
    </select>`}_renderOpSelect(e,t){return customElements.get("ha-form")?l`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(e)}
        .data=${{op:t.op}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation();let i=r.detail.value.op;i&&this._updateThreshold(e,{...t,op:i})}}
      ></ha-form>`:l`<select
      @change=${r=>this._updateThreshold(e,{...t,op:r.target.value})}>
      ${Lt.map(r=>l`<option value=${r} ?selected=${r===t.op}>${Tt[r]}</option>`)}
    </select>`}_renderValueInput(e,t){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(e,t.attribute)}
        .data=${{value:t.value}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation();let a=i.detail.value.value;typeof a=="number"&&Number.isFinite(a)&&this._updateThreshold(e,{...t,value:a})}}
      ></ha-form>`;let r=Ve(this.hass,t.attribute,this._entityState());return l`<span class="value-wrap">
      <input type="number" .value=${String(t.value)}
        @change=${i=>{let a=Number(i.target.value);Number.isFinite(a)&&this._updateThreshold(e,{...t,value:a})}} />
      <span class="unit">${r}</span>
    </span>`}_renderThreshold(e,t){return l`
      <div class="threshold">
        ${this._renderAttributeSelect(e,t)}
        ${this._renderOpSelect(e,t)}
        ${this._renderValueInput(e,t)}
        <button class="remove" title=${o(this.hass,"ui.remove","Remove")} @click=${()=>this._removeThreshold(e)}>✕</button>
      </div>
    `}render(){let{groups:e,thresholds:t}=this._current();return l`
      <div class="section">
        <h4>${o(this.hass,"ui.groups","Groups")}</h4>
        ${this._renderGroups(e)}
      </div>
      <div class="section">
        <h4>${o(this.hass,"ui.thresholds","Thresholds")}</h4>
        ${t.map((r,i)=>this._renderThreshold(i,r))}
        <button class="add" @click=${()=>this._addThreshold()}>${o(this.hass,"ui.add_threshold","+ Add threshold")}</button>
      </div>
    `}};D.styles=g`
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
  `,d([u({attribute:!1})],D.prototype,"hass",2),d([u({attribute:!1})],D.prototype,"value",2),d([u({attribute:!1})],D.prototype,"groups",2),d([u({attribute:!1})],D.prototype,"weatherEntity",2),D=d([_("ambience-weather-predicate-input")],D);var j=class extends p{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[]}async updated(e){if(e.has("value")){let r=e.get("value")?.entity_id,i=this.value.entity_id;if(i&&i!==r&&this.hass)try{let a=await kt(this.hass,i);this._knownStates=a.states}catch{this._knownStates=[]}}}_normalize(e){let t={...e};return t.attribute===""&&(t.attribute=null),t.for&&t.for.h===0&&t.for.m===0&&t.for.s===0&&(t.for=null),t}_emit(e){let t=this._normalize(e);this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_setEntity(e){this._emit({...this.value,entity_id:e,states:[],attribute:null})}_setAttribute(e){this._emit({...this.value,attribute:e})}_setOp(e){this._emit({...this.value,kind:e})}_setStates(e){this._emit({...this.value,states:e})}_setValueAt(e,t){let r=this.value.states.slice();t===""?r.splice(e,1):r[e]=t,this._setStates(r)}_addValue(e){e&&this._setStates([...this.value.states,e])}_removeValueAt(e){let t=this.value.states.slice();t.splice(e,1),this._setStates(t)}_setForDuration(e){this._emit({...this.value,for:e})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_attributeSchema(){return[{name:"attribute",selector:{text:{}}}]}_opSchema(){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:[{value:"is",label:x(this.hass,"is")},{value:"is_not",label:x(this.hass,"is_not")}]}}}]}_valueSchema(){return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:this._knownStates.map(e=>({value:e,label:e}))}}}]}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let e=this.value.for??{h:0,m:0,s:0};return{duration:{hours:e.h,minutes:e.m,seconds:e.s}}}_setForFromHaForm(e){this._setForDuration({h:e?.hours??0,m:e?.minutes??0,s:e?.seconds??0})}_renderEntity(){return customElements.get("ha-form")?l`<ha-form
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
        .data=${{attribute:e}}
        .computeLabel=${()=>""}
        @value-changed=${t=>{t.stopPropagation(),this._setAttribute(t.detail.value.attribute??"")}}
      ></ha-form>`:l`<input
      data-field="attribute"
      type="text"
      placeholder=${o(this.hass,"ui.state_attribute_placeholder","leave blank to compare state")}
      .value=${e}
      @change=${t=>this._setAttribute(t.target.value)}
    />`}_renderOp(){return customElements.get("ha-form")?l`<ha-form
        class="op-form"
        data-field="op"
        .hass=${this.hass}
        .schema=${this._opSchema()}
        .data=${{op:this.value.kind}}
        .computeLabel=${()=>""}
        @value-changed=${e=>{e.stopPropagation();let t=e.detail.value.op;t&&this._setOp(t)}}
      ></ha-form>`:l`<select
      data-field="op"
      @change=${e=>this._setOp(e.target.value)}>
      <option value="is" ?selected=${this.value.kind==="is"}>is</option>
      <option value="is_not" ?selected=${this.value.kind==="is_not"}>is not</option>
    </select>`}_renderValueRow(e,t){let r=t===-1,i=r?a=>this._addValue(a):a=>this._setValueAt(t,a);return customElements.get("ha-form")?l`
        <div class="value-row" data-row=${t}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${{value:e}}
            .computeLabel=${()=>""}
            @value-changed=${a=>{a.stopPropagation(),i(a.detail.value.value??"")}}
          ></ha-form>
        </div>
      `:l`
      <div class="value-row" data-row=${t}>
        <input type="text" .value=${e}
          placeholder=${r?o(this.hass,"ui.state_add_value","+ Add state"):""}
          @change=${a=>i(a.target.value)} />
      </div>
    `}_renderForRow(){if(customElements.get("ha-form"))return l`<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${this._forSchema()}
        .data=${this._forData()}
        .computeLabel=${()=>""}
        @value-changed=${t=>{t.stopPropagation(),this._setForFromHaForm(t.detail.value.duration)}}
      ></ha-form>`;let e=this.value.for??{h:0,m:0,s:0};return l`
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
    `}render(){return l`
      <section class="field">
        <label class="field-label">${o(this.hass,"ui.state_entity","Entity")}</label>
        ${this._renderEntity()}
      </section>
      <section class="field">
        <label class="field-label">
          ${o(this.hass,"ui.state_attribute_label","Attribute (optional)")}
        </label>
        ${this._renderAttribute()}
      </section>
      <section class="field">
        <div class="op-row">
          ${this._renderOp()}
        </div>
        <label class="field-label">${o(this.hass,"ui.state_label","State")}</label>
        <div class="value-list">
          ${this.value.states.map((e,t)=>this._renderValueRow(e,t))}
          ${this._renderValueRow("",-1)}
        </div>
      </section>
      <section class="field">
        <label class="field-label">${o(this.hass,"ui.state_for","For (optional)")}</label>
        ${this._renderForRow()}
      </section>
    `}};j.styles=g`
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
  `,d([u({attribute:!1})],j.prototype,"hass",2),d([u({attribute:!1})],j.prototype,"value",2),d([m()],j.prototype,"_knownStates",2),j=d([_("ambience-state-expr-atom")],j);var W=class extends p{constructor(){super(...arguments);this.path=[]}_emit(e,t={}){this.dispatchEvent(new CustomEvent(e,{detail:{path:this.path,...t},bubbles:!0,composed:!0}))}_emitAt(e,t,r={}){this.dispatchEvent(new CustomEvent(t,{detail:{path:e,...r},bubbles:!0,composed:!0}))}_renderAtomCard(e){return l`
      <ambience-state-expr-atom
        .hass=${this.hass}
        .value=${e}
        @value-changed=${t=>{t.stopPropagation(),this._emit("node-change",{value:t.detail.value})}}
      ></ambience-state-expr-atom>
    `}_renderChildRow(e,t){let r=e.kind==="not",i=r?e.item:e,a=[...this.path,t];return l`
      <div class="child-row">
        <div class="child-actions">
          <button class="not-toggle ${r?"on":""}"
            title=${o(this.hass,"ui.state_not_toggle","Negate (NOT)")}
            @click=${()=>this._emitAt(a,"node-toggle-not")}>${x(this.hass,"not")}</button>
          <button title=${o(this.hass,"ui.state_wrap","Wrap in group")}
            @click=${()=>this._emitAt(a,"node-wrap",{op:"and"})}>(…)</button>
          <button title=${o(this.hass,"ui.remove","Remove")}
            @click=${()=>this._emitAt(a,"node-remove")}>✕</button>
        </div>
        <div class="child-body">
          <ambience-state-expr-node
            .hass=${this.hass}
            .value=${i}
            .path=${a}
          ></ambience-state-expr-node>
        </div>
      </div>
    `}_renderGroup(e){return l`
      <div class="group">
        <div class="group-header">
          <select class="group-op"
            @change=${t=>this._emit("node-set-op",{op:t.target.value})}>
            <option value="and" ?selected=${e.kind==="and"}>${x(this.hass,"and")}</option>
            <option value="or"  ?selected=${e.kind==="or"} >${x(this.hass,"or")}</option>
          </select>
        </div>
        <div class="group-children">
          ${e.items.map((t,r)=>this._renderChildRow(t,r))}
        </div>
        <div class="actions">
          <button @click=${()=>this._emit("node-add-child")}>
            + ${o(this.hass,"ui.state_add_condition","Add condition")}
          </button>
        </div>
      </div>
    `}render(){let e=this.value.kind==="not"?this.value.item:this.value;return e.kind==="and"||e.kind==="or"?this._renderGroup(e):this._renderAtomCard(e)}};W.styles=g`
    :host { display: block; }
    .group {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.5rem; margin: 0.25rem 0;
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
    .group-children { display: flex; flex-direction: column; gap: 0.25rem; padding-left: 1rem; }
    .child-row { display: flex; gap: 0.5rem; align-items: flex-start; }
    .child-body { flex: 1; min-width: 0; }
    .child-actions { display: flex; gap: 0.25rem; padding-top: 0.25rem; }
    .child-actions button, .actions button {
      background: transparent; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.15rem 0.4rem; cursor: pointer;
      font-size: 0.85em; color: inherit;
    }
    .child-actions .not-toggle.on {
      background: var(--warning-color, #ffd);
      border-color: var(--warning-color, #cc9);
    }
    .actions { display: flex; gap: 0.25rem; margin-top: 0.5rem; }
  `,d([u({attribute:!1})],W.prototype,"hass",2),d([u({attribute:!1})],W.prototype,"value",2),d([u({attribute:!1})],W.prototype,"path",2),W=d([_("ambience-state-expr-node")],W);var X=class extends p{constructor(){super(...arguments);this.value=null;this._onNodeChange=e=>{e.stopPropagation(),this._replaceAt(e.detail.path,e.detail.value)};this._onNodeRemove=e=>{e.stopPropagation(),this._removeAt(e.detail.path)};this._onNodeWrap=e=>{e.stopPropagation(),this._wrapAt(e.detail.path,e.detail.op)};this._onNodeAddChild=e=>{e.stopPropagation(),this._addChildAt(e.detail.path,"is")};this._onNodeToggleNot=e=>{e.stopPropagation(),this._toggleNotAt(e.detail.path)};this._onNodeSetOp=e=>{e.stopPropagation(),this._setGroupOpAt(e.detail.path,e.detail.op)}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp)}_emit(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._emit(this._emptyAtom())}_replaceAt(e,t){let r=this._patch(this.value,e,()=>t);this._emit(r)}_removeAt(e){if(e.length===0){this._emit(null);return}let t=this._patch(this.value,e,()=>null);this._emit(t)}_wrapAt(e,t){let r=this._patch(this.value,e,i=>i&&{kind:t,items:[i]});this._emit(r)}_addChildAt(e,t){let r=this._patch(this.value,e,i=>i&&(i.kind==="and"||i.kind==="or")?{...i,items:[...i.items,this._emptyAtom()]}:i);this._emit(r)}_toggleNotAt(e){let t=this._patch(this.value,e,r=>r&&(r.kind==="not"?r.item:{kind:"not",item:r}));this._emit(t)}_setGroupOpAt(e,t){let r=this._patch(this.value,e,i=>i&&(i.kind==="and"||i.kind==="or")?{...i,kind:t}:i);this._emit(r)}_patch(e,t,r){if(t.length===0)return r(e);if(e==null)return e;let[i,...a]=t;if(e.kind==="and"||e.kind==="or"){let h=e.items.slice(),c=this._patch(h[i],a,r);return c===null?h.splice(i,1):h[i]=c,h.length===0?null:h.length===1?h[0]:{...e,items:h}}if(e.kind==="not"){let h=this._patch(e.item,t,r);return h==null?null:{kind:"not",item:h}}return e}_addAtRoot(){let e=this.value;if(e==null){this._addFirstAtom();return}if(e.kind==="and"||e.kind==="or"){this._addChildAt([],"is");return}this._emit({kind:"and",items:[e,this._emptyAtom()]})}_renderRootToolbar(){let e=this.value?.kind==="not";return l`
      <div class="root-toolbar">
        <button class="not-toggle ${e?"on":""}"
          title=${o(this.hass,"ui.state_not_toggle","Negate (NOT)")}
          @click=${()=>this._toggleNotAt([])}>${o(this.hass,"ui.state_op_not","NOT")}</button>
        <button class="wrap"
          title=${o(this.hass,"ui.state_wrap","Wrap in group")}
          @click=${()=>this._wrapAt([],"and")}>(…)</button>
        <button class="remove"
          title=${o(this.hass,"ui.state_clear","Clear")}
          @click=${()=>this._removeAt([])}>✕</button>
      </div>
    `}render(){return this.value==null?l`
        <div class="empty">
          <button @click=${()=>this._addFirstAtom()}>
            + ${o(this.hass,"ui.state_add_first","Add condition")}
          </button>
        </div>
      `:l`
      ${this._renderRootToolbar()}
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${this.value}
        .path=${[]}
      ></ambience-state-expr-node>
      <button class="root-add" @click=${()=>this._addAtRoot()}>
        + ${o(this.hass,"ui.state_add_condition","Add condition")}
      </button>
    `}};X.styles=g`
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
    .root-toolbar {
      display: flex; justify-content: flex-end; gap: 0.25rem;
      margin-bottom: 0.25rem;
    }
    .root-toolbar button {
      background: transparent; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.15rem 0.4rem; cursor: pointer;
      font-size: 0.85em; color: inherit;
    }
    .root-toolbar .not-toggle.on {
      background: var(--warning-color, #ffd);
      border-color: var(--warning-color, #cc9);
    }
    .root-add {
      display: block; margin-top: 0.5rem;
      background: transparent; border: 1px dashed var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.25rem 0.75rem; cursor: pointer;
      color: inherit; width: 100%; text-align: center;
    }
  `,d([u({attribute:!1})],X.prototype,"hass",2),d([u({attribute:!1})],X.prototype,"value",2),X=d([_("ambience-state-predicate-input")],X);var E=class extends p{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onText(e){let t=e.target.value;this._emit(t.trim()===""?null:t)}render(){return this.matcher.input==="time_of_day"?l`
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
        placeholder=${o(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};E.styles=g`
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
  `,d([u({attribute:!1})],E.prototype,"matcher",2),d([u({attribute:!1})],E.prototype,"value",2),d([u({attribute:!1})],E.prototype,"sceneSuggestions",2),d([u({attribute:!1})],E.prototype,"periods",2),d([u({attribute:!1})],E.prototype,"dayConfig",2),d([u({attribute:!1})],E.prototype,"weatherConfig",2),d([u({attribute:!1})],E.prototype,"hass",2),E=d([_("ambience-matcher-input")],E);var U=class extends p{constructor(){super(...arguments);this.entities=[];this.value=[]}connectedCallback(){super.connectedCallback(),z(this,this.hass)}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let e=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this.entities}}}];return l`
      <ha-form
        .hass=${this.hass}
        .schema=${e}
        .data=${{entity_ids:this.value}}
        .computeLabel=${()=>""}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,t){let r=new Set(this.value);t?r.add(e):r.delete(e),this._emit(this.entities.filter(i=>r.has(i)))}_renderFallback(){return this.entities.length===0?l`<p class="empty">${o(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:l`
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
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};U.styles=g`
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
  `,d([u({attribute:!1})],U.prototype,"hass",2),d([u({attribute:!1})],U.prototype,"entities",2),d([u({attribute:!1})],U.prototype,"value",2),U=d([_("ambience-target-picker")],U);var $=class extends p{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._open=null;this._showError=!1;this._onNameInput=e=>{this._setName(e.target.value)}}connectedCallback(){super.connectedCallback(),z(this,this.hass)}willUpdate(e){e.has("rule")&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null,this._open=null,this._showError=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"}))return l`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
        </div>
      `;let r=Le(this._draft,o(this.hass,"ui.new_rule","New rule"));return l`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${r}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let t=pt();return t==="ha-input"?l`<ha-input label=${o(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:t==="ha-textfield"?l`<ha-textfield label=${o(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:l`<input type="text" .value=${e} @input=${this._onNameInput} />`}_isOpen(e){return this._open===null?!1:e.kind==="name"&&this._open.kind==="name"?!0:e.kind==="matcher"&&this._open.kind==="matcher"?e.id===this._open.id:e.kind==="action"&&this._open.kind==="action"?e.idx===this._open.idx:!1}_validationError(e){if(e===null||e.kind==="name"||e.kind==="matcher")return null;let t=this._draft?.actions[e.idx];if(!t)return null;if(t.entity_ids.length===0)return o(this.hass,"ui.at_least_one_target","At least one target is required.");let r=this.availableActions.find(i=>i.name===t.action);if(!r)return null;for(let i of r.target_params){if(!i.required)continue;let a=t.params[i.name];if(a==null||a==="")return o(this.hass,"ui.param_required","{param} is required.").replace("{param}",this._paramLabel(i.name))}return null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){this._tryCloseCurrent();return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let t of e.composedPath())if(t instanceof Element&&(t.classList.contains("slot")||t.classList.contains("actions-bar")))return;this._tryCloseCurrent()}_setPredicate(e,t){if(!this._draft)return;let r={...this._draft.when};t==null?delete r[e]:r[e]=t,this._draft={...this._draft,when:r}}_renderMatcherRow(e){let t=this._draft.when[e.name]??null,r=this._isOpen({kind:"matcher",id:e.name}),i=e.input==="scene_combobox";if(r&&i)return l`
        <div class="slot combobox-slot expanded" data-slot-id=${e.name}>
          <ambience-matcher-input
            .hass=${this.hass}
            .matcher=${e}
            .value=${t}
            .sceneSuggestions=${this.sceneSuggestions}
            .periods=${this.periods}
            .dayConfig=${this.dayConfig}
            .weatherConfig=${this.weatherConfig}
            @value-changed=${h=>this._setPredicate(e.name,h.detail.value)}
          ></ambience-matcher-input>
        </div>
      `;let a=Te(e.name,t,{hass:this.hass,periods:this.periods});return l`
      <div class="slot ${r?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"matcher",id:e.name})}>
          <span class="summary-label"><strong>${te(this.hass,e.name)}:</strong> ${a}</span>
        </div>
        ${r?l`
          <div class="body">
            <ambience-matcher-input
              .hass=${this.hass}
              .matcher=${e}
              .value=${t}
              .sceneSuggestions=${this.sceneSuggestions}
              .periods=${this.periods}
              .dayConfig=${this.dayConfig}
              .weatherConfig=${this.weatherConfig}
              @value-changed=${h=>this._setPredicate(e.name,h.detail.value)}
            ></ambience-matcher-input>
          </div>
        `:""}
      </div>
    `}_addActionSlot(){if(!this._draft)return;let e={action:"set_light",entity_ids:[],params:{}},t=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,e]},this._open={kind:"action",idx:t}}_updateActionAt(e,t){if(!this._draft)return;let r=this._draft.actions.map((i,a)=>a===e?t(i):i);this._draft={...this._draft,actions:r}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((t,r)=>r!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,t){this._updateActionAt(e,r=>({...r,entity_ids:t}))}_paramLabel(e){let t=e.replaceAll("_"," ").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}_updateActionParam(e,t,r){this._updateActionAt(e,i=>{let a={...i.params},h=r;if(t.type==="int"?h=r===""?void 0:parseInt(r,10):t.type==="number"?h=r===""?void 0:parseFloat(r):t.type==="boolean"&&(h=r==="true"),typeof h=="number"&&Number.isFinite(h)){let c=h;typeof t.min=="number"&&c<t.min&&(c=t.min),typeof t.max=="number"&&c>t.max&&(c=t.max),h=c}return h===void 0?delete a[t.name]:a[t.name]=h,{...i,params:a}})}_renderActionParams(e,t,r){let i=r?.target_params??[];return l`
      ${i.map(a=>l`
        <div class="param-row">
          <label>${this._paramLabel(a.name)}${a.required?" *":""}</label>
          <div class="param-input">
            <input
              type=${a.type==="int"||a.type==="number"?"number":"text"}
              placeholder=${a.description??""}
              .value=${String(t.params[a.name]??"")}
              min=${a.min??""}
              max=${a.max??""}
              @input=${h=>this._updateActionParam(e,a,h.target.value)}
            />
            ${a.unit?l`<span class="param-unit">${a.unit}</span>`:""}
          </div>
        </div>
      `)}
    `}_renderActionRow(e,t){let r=this.availableActions.find(c=>c.name===e.action),i=this._isOpen({kind:"action",idx:t}),a=St(e,r,{hass:this.hass}),h=Ct(this.hass,this.areaId,r?.domains??[]);return l`
      <div class="slot ${i?"expanded":"collapsed"}" data-slot-id="action-${t}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:t})}>
          <span class="summary-label">${a}</span>
          <button class="remove" @click=${c=>{c.stopPropagation(),this._deleteAction(t)}} title=${o(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${i?l`
          <div class="body">
            <label>${o(this.hass,"ui.target","Target")}</label>
            <ambience-target-picker
              .hass=${this.hass}
              .entities=${h}
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

        <h3>${o(this.hass,"ui.when_heading","When")}</h3>
        ${this.matchers.map(e=>this._renderMatcherRow(e))}

        <h3>${o(this.hass,"ui.actions_heading","Actions")}</h3>
        ${this._draft.actions.map((e,t)=>this._renderActionRow(e,t))}
        <button class="secondary add-action" @click=${this._addActionSlot}>${o(this.hass,"ui.add_action","+ Add action")}</button>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>${o(this.hass,"ui.cancel","Cancel")}</button>
          <button class="primary" @click=${this._save}>${o(this.hass,"ui.save_rule","Save rule")}</button>
        </div>
      </div>
    `:l``}};$.styles=g`
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
  `,d([u({type:Boolean,reflect:!0})],$.prototype,"open",2),d([u({attribute:!1})],$.prototype,"rule",2),d([u({attribute:!1})],$.prototype,"matchers",2),d([u({attribute:!1})],$.prototype,"sceneSuggestions",2),d([u({attribute:!1})],$.prototype,"periods",2),d([u({attribute:!1})],$.prototype,"dayConfig",2),d([u({attribute:!1})],$.prototype,"weatherConfig",2),d([u({attribute:!1})],$.prototype,"availableActions",2),d([u({attribute:!1})],$.prototype,"hass",2),d([u({attribute:!1})],$.prototype,"areaId",2),d([m()],$.prototype,"_draft",2),d([m()],$.prototype,"_open",2),d([m()],$.prototype,"_showError",2),$=d([_("ambience-rule-editor")],$);var w=class extends p{constructor(){super(...arguments);this._areas=[];this._matchers=[];this._actions=[];this._configs=new Map;this._expanded=new Set;this._error="";this._editing=null;this._enabledMatchers=new Set}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await this._refreshAreas(),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}async _loadStatic(){try{let[e,t,r,i,a,h]=await Promise.all([Ee(this.hass),vt(this.hass),Se(this.hass),Ce(this.hass),He(this.hass),Pe(this.hass)]);if(!this.isConnected)return;this._matchers=e,this._actions=t,this._periods=r,this._enabledMatchers=new Set(i.enabled),this._dayConfig=a,this._weatherConfig=h}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await ft(this.hass),t=new Map;if(await Promise.all(e.map(async r=>{t.set(r.area_id,this._normalize(await gt(this.hass,r.area_id)))})),!this.isConnected)return;this._areas=e,this._configs=t}catch(e){this._error=e.message||String(e)}}_normalize(e){return{rules:e.rules??[],auto_sort:e.auto_sort??!0}}async _subscribe(){let e=await this.hass.connection.subscribeEvents(t=>{if(t.data.action==="remove"){let r=t.data.area_id,i=new Set(this._expanded);i.delete(r),this._expanded=i,this._editing?.areaId===r&&(this._editing=null)}this._refreshAreas()},"area_registry_updated");this.isConnected?this._unsub=e:e()}_setConfig(e,t){let r=new Map(this._configs);r.set(e,t),this._configs=r}async _mutate(e,t){let r=this._configs.get(e);this._setConfig(e,t),this._error="";try{let{config:i}=await _t(this.hass,e,t);this._setConfig(e,this._normalize(i))}catch(i){r&&this._setConfig(e,r),this._error=i.message||String(i)}}_toggleExpand(e){let t=new Set(this._expanded);t.has(e)?t.delete(e):t.add(e),this._expanded=t}_toggleAutoSort(e,t){let r=this._configs.get(e);r&&this._mutate(e,{...r,auto_sort:t})}_addRule(e){let t=this._configs.get(e);t&&(this._editing={areaId:e,index:t.rules.length,isNew:!0})}_editRule(e,t){this._editing={areaId:e,index:t.detail.index,isNew:!1}}_duplicateRule(e,t){let r=this._configs.get(e);if(!r)return;let i=r.rules[t.detail.index];if(!i)return;let a=JSON.parse(JSON.stringify(i)),h=[...r.rules];h.splice(t.detail.index+1,0,a),this._mutate(e,{...r,rules:h})}_deleteRule(e,t){let r=this._configs.get(e);if(!r)return;let i=r.rules.filter((a,h)=>h!==t.detail.index);this._mutate(e,{...r,rules:i})}_reorderRules(e,t){let r=this._configs.get(e);if(!r)return;let{from:i,to:a}=t.detail,h=[...r.rules],[c]=h.splice(i,1);h.splice(a,0,c),this._mutate(e,{...r,rules:h})}_saveRule(e){let t=this._editing;if(this._editing=null,!t)return;let r=this._configs.get(t.areaId);if(!r)return;let i=[...r.rules];t.isNew?i.push(e.detail):i[t.index]=e.detail,this._mutate(t.areaId,{...r,rules:i})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._configs.get(this._editing.areaId)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let e=this._configs.get(this._editing.areaId);if(!e)return[];let t=new Set;for(let r of e.rules){let i=r.when.scene;typeof i=="string"&&i&&t.add(i)}return[...t].sort((r,i)=>r.toLowerCase().localeCompare(i.toLowerCase()))}get _editorMatchers(){return this._editing?this._matchers.filter(e=>e.name==="scene"||e.toggleable&&this._enabledMatchers.has(e.name)).slice().sort((e,t)=>e.priority-t.priority):[]}_summary(e){let t=e.rules.length;if(t===0)return o(this.hass,"ui.not_configured","not configured");let r=t===1?o(this.hass,"ui.rule_singular","rule"):o(this.hass,"ui.rule_plural","rules");return`${t} ${r}`}render(){return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${this._areas.length===0?l`<p class="empty">${o(this.hass,"ui.no_areas","No areas found in Home Assistant.")}</p>`:l`<ul>
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
        .dayConfig=${this._dayConfig}
        .weatherConfig=${this._weatherConfig}
        .availableActions=${this._actions}
        @save-rule=${this._saveRule}
        @cancel-rule=${this._cancelRule}
      ></ambience-rule-editor>
    `}_renderArea(e){let t=this._configs.get(e.area_id);if(!t)return l``;let r=this._expanded.has(e.area_id);return l`
      <li>
        <div
          class="area-header"
          @click=${()=>this._toggleExpand(e.area_id)}
        >
          <span class="chevron ${r?"open":""}">▶</span>
          <span class="area-name">${e.name}</span>
          <span class="area-summary">${this._summary(t)}</span>
        </div>
        ${r?l`
              <div class="area-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!t.auto_sort}
                    @change=${i=>this._toggleAutoSort(e.area_id,!i.target.checked)}
                  />
                  ${o(this.hass,"ui.order_rules_manually","Order rules manually")}
                </label>
                <ambience-rules-list
                  .rules=${t.rules}
                  .autoSort=${t.auto_sort}
                  .periods=${this._periods}
                  .weatherConfig=${this._weatherConfig}
                  .enabledMatchers=${[...this._enabledMatchers]}
                  .matchers=${this._matchers}
                  .hass=${this.hass}
                  @add-rule=${()=>this._addRule(e.area_id)}
                  @edit-rule=${i=>this._editRule(e.area_id,i)}
                  @duplicate-rule=${i=>this._duplicateRule(e.area_id,i)}
                  @delete-rule=${i=>this._deleteRule(e.area_id,i)}
                  @reorder-rules=${i=>this._reorderRules(e.area_id,i)}
                ></ambience-rules-list>
              </div>
            `:""}
      </li>
    `}};w.styles=g`
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
  `,d([u({attribute:!1})],w.prototype,"hass",2),d([m()],w.prototype,"_areas",2),d([m()],w.prototype,"_matchers",2),d([m()],w.prototype,"_actions",2),d([m()],w.prototype,"_periods",2),d([m()],w.prototype,"_dayConfig",2),d([m()],w.prototype,"_weatherConfig",2),d([m()],w.prototype,"_configs",2),d([m()],w.prototype,"_expanded",2),d([m()],w.prototype,"_error",2),d([m()],w.prototype,"_editing",2),d([m()],w.prototype,"_enabledMatchers",2),w=d([_("ambience-areas-list")],w);var A=class extends p{constructor(){super(...arguments);this.matcherName="";this.matcherDescription="";this.enabled=!1;this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}_onToggle(e){e.stopPropagation();let t=e.target.checked;this.dispatchEvent(new CustomEvent("enable-changed",{detail:{enabled:t},bubbles:!0,composed:!0}))}render(){let e=te(this.hass,this.matcherName);return l`
      <div class="card">
        <header @click=${this._toggleExpand}>
          <span class="chevron ${this._expanded?"open":""}">▶</span>
          <label>
            <div class="name">${e}</div>
            <div class="description">${this.matcherDescription}</div>
          </label>
          <input
            class="enable"
            type="checkbox"
            .checked=${this.enabled}
            @click=${t=>t.stopPropagation()}
            @change=${this._onToggle}
          />
        </header>
        <div
          class="body ${this.enabled?"":"disabled"} ${this._expanded?"":"collapsed"}"
        >
          <slot></slot>
        </div>
      </div>
    `}};A.styles=g`
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
    .enable {
      flex: 0 0 auto;
    }
    .body {
      padding: 1rem;
    }
    .body.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    .body.collapsed {
      display: none;
    }
  `,d([u({attribute:!1})],A.prototype,"hass",2),d([u()],A.prototype,"matcherName",2),d([u()],A.prototype,"matcherDescription",2),d([u({type:Boolean})],A.prototype,"enabled",2),d([m()],A.prototype,"_expanded",2),A=d([_("ambience-matcher-card")],A);var kr=/^[a-z][a-z0-9_]*$/;function xr(n){return n.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var S=class extends p{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._label=this.initial.label??"",this._def=this.initial}_onLabelInput(e){this._label=e.target.value}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_validate(e){if(!this.existingId){if(!this._label.trim())return o(this.hass,"ui.error_enter_name","Please enter a name.");if(!e)return o(this.hass,"ui.error_start_letter","Name must start with a letter.");if(!kr.test(e))return o(this.hass,"ui.error_start_letter","Name must start with a letter.");if(this.takenIds.has(e))return o(this.hass,"ui.error_name_exists","A period with this name already exists. Choose a different name.")}return""}_onSave(){let e=this.existingId??xr(this._label),t=this._validate(e);if(t){this._error=t,this.performUpdate();return}let r={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:e,definition:r},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){let e=this.existingId?o(this.hass,"ui.period_modal_edit_title",'Edit "{name}"').replace("{name}",this.initial?.label??this.existingId):o(this.hass,"ui.period_modal_add_title","Add custom period");return l`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <div class="field">
          <label for="label">${o(this.hass,"ui.name","Name")}</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput} placeholder=${o(this.hass,"ui.name_placeholder","e.g. Wind down")} />
        </div>
        <div class="row">
          <label style="min-width: 3em;">${o(this.hass,"ui.from_label","From")}</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
        </div>
        <div class="row">
          <label style="min-width: 3em;">${o(this.hass,"ui.to_label","To")}</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
        </div>
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>${o(this.hass,"ui.cancel","Cancel")}</button>
          <button @click=${this._onSave}>${o(this.hass,"ui.save","Save")}</button>
        </div>
      </div>
    `}};S.styles=g`
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
  `,d([u({attribute:!1})],S.prototype,"hass",2),d([u({attribute:!1})],S.prototype,"existingId",2),d([u({attribute:!1})],S.prototype,"initial",2),d([u({attribute:!1})],S.prototype,"takenIds",2),d([m()],S.prototype,"_label",2),d([m()],S.prototype,"_def",2),d([m()],S.prototype,"_error",2),S=d([_("ambience-period-edit-modal")],S);function Dt(n,s){if(n.kind==="time")return`${String(n.hh).padStart(2,"0")}:${String(n.mm).padStart(2,"0")}`;let e=re(s,n.anchor);if(n.offset_min===0)return e;let t=Math.abs(n.offset_min),r=t%60===0?`${t/60}${o(s,"ui.unit_hour_abbr","h")}`:`${t}${o(s,"ui.unit_min_abbr","m")}`;return`${e}${n.offset_min<0?"-":"+"}${r}`}function It(n,s){return`${Dt(n.from,s)} \u2192 ${Dt(n.to,s)}`}var I=class extends p{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await Se(this.hass)}async _saveState(e){let t=await yt(this.hass,e,this._view.hidden);this._warnings=t.warnings,await this._reload()}_onEdit(e,t){this._modal={mode:"edit",id:e,initial:t}}async _onDelete(e){let t={...this._view.custom};delete t[e],await this._saveState(t)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:t,definition:r}=e.detail,i={...this._view.custom,[t]:r};this._modal={mode:"closed"},await this._saveState(i)}_onModalCancel(){this._modal={mode:"closed"}}_renderBuiltinRow(e,t,r){return l`
      <div class="row ${r?"overridden":""}">
        <span class="name">${J(this.hass,e,{})}</span>
        <span class="def">${It(t,this.hass)}</span>
        <span class="badge">${o(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${r?"":l`<button class="icon" title=${o(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(e,t)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(e,t){return l`
      <div class="row custom">
        <span class="name">${J(this.hass,e,this._view.custom)}</span>
        <span class="def">${It(t,this.hass)}</span>
        <span class="badge">${o(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${o(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e,t)}>✎</button>
          <button class="icon" title=${o(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e)}>✕</button>
        </span>
      </div>
    `}render(){let e=this._view.custom;return l`
      <header>
        <h2>${o(this.hass,"ui.periods_heading","Periods")}</h2>
      </header>
      ${this._warnings.length?l`<div class="warnings">
            <strong>${o(this.hass,"ui.period_warning_prefix","Warning:")}</strong> ${o(this.hass,"ui.period_warning_text","some rules now reference missing periods:")}
            <ul>
              ${this._warnings.map(t=>l`<li>${t.area_id} / "${t.rule_name}" → ${t.missing_period}</li>`)}
            </ul>
          </div>`:""}
      ${Object.entries(this._view.builtins).map(([t,r])=>{let i=e[t];return l`
          ${this._renderBuiltinRow(t,r,i!=null)}
          ${i!=null?this._renderCustomRow(t,i):""}
        `})}
      ${Object.entries(e).filter(([t])=>!(t in this._view.builtins)).map(([t,r])=>this._renderCustomRow(t,r))}
      <button class="add" @click=${this._onAdd}>${o(this.hass,"ui.add_custom_period","+ Add custom period")}</button>
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
    `}};I.styles=g`
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
  `,d([u({attribute:!1})],I.prototype,"hass",2),d([m()],I.prototype,"_view",2),d([m()],I.prototype,"_modal",2),d([m()],I.prototype,"_warnings",2),I=d([_("ambience-time-of-day-config")],I);var G=class extends p{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await He(this.hass)}async _save(e){this._config=e;let t=await $t(this.hass,e.workday_sensor,e.workday_calendar);this._warnings=t.warnings??[]}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=[{name:"workday_sensor",selector:{entity:{integration:"workday",domain:"binary_sensor"}}}],t=[{name:"workday_calendar",selector:{entity:{integration:"workday",domain:"calendar"}}}];return l`
      <div class="row">
        <label>${o(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${e}
          .data=${{workday_sensor:this._config.workday_sensor??""}}
          .computeLabel=${()=>""}
          @value-changed=${r=>{r.stopPropagation(),this._onSensorChange({detail:{value:r.detail.value?.workday_sensor||null}})}}
        ></ha-form>
      </div>
      <div class="row">
        <label>${o(this.hass,"ui.workday_calendar","Workday calendar")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${t}
          .data=${{workday_calendar:this._config.workday_calendar??""}}
          .computeLabel=${()=>""}
          @value-changed=${r=>{r.stopPropagation(),this._onCalendarChange({detail:{value:r.detail.value?.workday_calendar||null}})}}
        ></ha-form>
      </div>
      ${this._warnings.length?l`
        <div class="warnings">
          <strong>${o(this.hass,"ui.day_warning_prefix","Warning:")}</strong> ${o(this.hass,"ui.day_warning_text","rules now reference unconfigured entities:")}
          <ul>
            ${this._warnings.map(r=>l`<li>${r.area_id} / "${r.rule_name}" → ${r.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};G.styles=g`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,d([u({attribute:!1})],G.prototype,"hass",2),d([m()],G.prototype,"_config",2),d([m()],G.prototype,"_warnings",2),G=d([_("ambience-day-config")],G);var Er=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],N=class extends p{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._warnings=[];this._expanded=new Set}async connectedCallback(){super.connectedCallback(),this._config=await Pe(this.hass)}async _persist(){let e=await wt(this.hass,this._config.entity,this._config.groups);this._warnings=e.warnings??[]}_onEntityChange(e){this._config={...this._config,entity:e.detail.value||null},this._persist()}_nextGroupId(e){let t=new Set(e.map(r=>r.id));for(let r=1;r<=e.length+1;r++){let i=`group_${r}`;if(!t.has(i))return i}return`group_${e.length+1}`}_addGroup(){let e=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:e,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,e]),this._persist()}_toggleExpand(e){let t=new Set(this._expanded);t.has(e)?t.delete(e):t.add(e),this._expanded=t}_updateGroup(e,t){this._config={...this._config,groups:this._config.groups.map((r,i)=>i===e?{...r,...t}:r)},this._persist()}_removeGroup(e){let t=this._config.groups[e];if(this._config={...this._config,groups:this._config.groups.filter((r,i)=>i!==e)},t){let r=new Set(this._expanded);r.delete(t.id),this._expanded=r}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:Er.map(e=>({value:e,label:xe(this.hass,e)}))}}}]}_renderConditions(e,t){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:t.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),this._updateGroup(e,{conditions:i.detail.value.conditions??[]})}}
      ></ha-form>`;let r=t.conditions.map(i=>xe(this.hass,i));return l`<span class="conditions-list">${r.join(", ")}</span>`}_renderGroup(e,t){let r=this._expanded.has(t.id),i=t.conditions.map(a=>xe(this.hass,a)).join(", ");return l`
      <div class="group">
        <div class="group-header" @click=${()=>this._toggleExpand(t.id)}>
          <span class="chevron ${r?"open":""}">▶</span>
          <span class="label">${t.label}</span>
          <span class="codes">${i}</span>
          <button
            class="icon"
            title=${o(this.hass,"ui.title_delete","Delete")}
            @click=${a=>{a.stopPropagation(),this._removeGroup(e)}}
          >✕</button>
        </div>
        ${r?l`<div class="body" @click=${a=>a.stopPropagation()}>
              <input
                .value=${t.label}
                aria-label=${t.label}
                @change=${a=>this._updateGroup(e,{label:a.target.value})}
              />
              ${this._renderConditions(e,t)}
            </div>`:""}
      </div>
    `}render(){let e=[{name:"entity",selector:{entity:{domain:"weather"}}}];return l`
      <div class="row">
        <label class="section">${o(this.hass,"ui.weather_entity","Weather entity")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${e}
          .data=${{entity:this._config.entity??""}}
          .computeLabel=${()=>""}
          @value-changed=${t=>{t.stopPropagation(),this._onEntityChange({detail:{value:t.detail.value?.entity||null}})}}
        ></ha-form>
      </div>

      <h4>${o(this.hass,"ui.groups","Groups")}</h4>
      ${this._config.groups.map((t,r)=>this._renderGroup(r,t))}
      <button class="add" @click=${()=>this._addGroup()}>
        ${o(this.hass,"ui.add_group","+ Add group")}
      </button>

      ${this._warnings.length?l`
        <div class="warnings">
          <strong>${o(this.hass,"ui.day_warning_prefix","Warning:")}</strong>
          ${o(this.hass,"ui.weather_warning_text","rules now reference an unconfigured weather entity:")}
          <ul>${this._warnings.map(t=>l`<li>${t.area_id} / "${t.rule_name}" → ${t.reason}</li>`)}</ul>
        </div>
      `:""}
    `}};N.styles=g`
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
  `,d([u({attribute:!1})],N.prototype,"hass",2),d([m()],N.prototype,"_config",2),d([m()],N.prototype,"_warnings",2),d([m()],N.prototype,"_expanded",2),N=d([_("ambience-weather-config")],N);var R=class extends p{constructor(){super(...arguments);this._matchers=[];this._enabled=new Set;this._error=""}async connectedCallback(){super.connectedCallback();try{let[e,t]=await Promise.all([Ee(this.hass),Ce(this.hass)]);this._matchers=e,this._enabled=new Set(t.enabled)}catch(e){this._error=e.message||String(e)}}async _onToggle(e,t){let r=new Set(this._enabled);t?r.add(e):r.delete(e),this._enabled=r;try{let i=this._matchers.filter(a=>a.toggleable&&r.has(a.name)).map(a=>a.name);await bt(this.hass,i)}catch(i){this._error=i.message||String(i)}}render(){let e=this._matchers.filter(t=>t.toggleable).slice().sort((t,r)=>t.priority-r.priority);return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${e.map(t=>l`
        <ambience-matcher-card
          .hass=${this.hass}
          .matcherName=${t.name}
          .matcherDescription=${t.description}
          .enabled=${this._enabled.has(t.name)}
          @enable-changed=${r=>{r.stopPropagation(),this._onToggle(t.name,r.detail.enabled)}}
        >
          ${t.name==="time_of_day"?l`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`:t.name==="day"?l`<ambience-day-config .hass=${this.hass}></ambience-day-config>`:t.name==="weather"?l`<ambience-weather-config .hass=${this.hass}></ambience-weather-config>`:l``}
        </ambience-matcher-card>
      `)}
    `}};R.styles=g`
    :host { display: block; padding: 1rem; max-width: 60rem; margin: 0 auto; }
    .error { color: var(--error-color, #d32f2f); }
  `,d([u({attribute:!1})],R.prototype,"hass",2),d([m()],R.prototype,"_matchers",2),d([m()],R.prototype,"_enabled",2),d([m()],R.prototype,"_error",2),R=d([_("ambience-configuration-view")],R);var Z=class extends p{constructor(){super(...arguments);this._view="areas"}connectedCallback(){super.connectedCallback(),z(this)}render(){return l`
      <header>
        <h1>${o(this.hass,"ui.panel_title","Ambience")}</h1>
        <nav>
          <button
            class=${this._view==="areas"?"active":""}
            @click=${()=>{this._view="areas"}}
          >${o(this.hass,"ui.tab_areas","Areas")}</button>
          <button
            class=${this._view==="configuration"?"active":""}
            @click=${()=>{this._view="configuration"}}
          >${o(this.hass,"ui.tab_configuration","Configuration")}</button>
        </nav>
      </header>
      ${this._view==="areas"?l`<ambience-areas-list .hass=${this.hass}></ambience-areas-list>`:l`<ambience-configuration-view .hass=${this.hass}></ambience-configuration-view>`}
    `}};Z.styles=g`
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
  `,d([u({attribute:!1})],Z.prototype,"hass",2),d([m()],Z.prototype,"_view",2),Z=d([_("ambience-panel")],Z);export{Z as AmbiencePanel};
