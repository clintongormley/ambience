/* Ambience panel — bundled output. Do not edit by hand. */
var Ci=Object.defineProperty;var Ai=Object.getOwnPropertyDescriptor;var c=(e,n,t,r)=>{for(var i=r>1?void 0:r?Ai(n,t):n,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(n,t,i):a(i))||i);return r&&i&&Ci(n,t,i),i};var Ge=globalThis,qe=Ge.ShadowRoot&&(Ge.ShadyCSS===void 0||Ge.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_t=Symbol(),Jt=new WeakMap,Te=class{constructor(n,t,r){if(this._$cssResult$=!0,r!==_t)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=t}get styleSheet(){let n=this.o,t=this.t;if(qe&&n===void 0){let r=t!==void 0&&t.length===1;r&&(n=Jt.get(t)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),r&&Jt.set(t,n))}return n}toString(){return this.cssText}},Qt=e=>new Te(typeof e=="string"?e:e+"",void 0,_t),$=(e,...n)=>{let t=e.length===1?e[0]:n.reduce((r,i,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new Te(t,e,_t)},Xt=(e,n)=>{if(qe)e.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of n){let r=document.createElement("style"),i=Ge.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=t.cssText,e.appendChild(r)}},vt=qe?e=>e:e=>e instanceof CSSStyleSheet?(n=>{let t="";for(let r of n.cssRules)t+=r.cssText;return Qt(t)})(e):e;var{is:Li,defineProperty:Ti,getOwnPropertyDescriptor:Fi,getOwnPropertyNames:Ii,getOwnPropertySymbols:Pi,getPrototypeOf:Oi}=Object,Ke=globalThis,Zt=Ke.trustedTypes,Ni=Zt?Zt.emptyScript:"",Di=Ke.reactiveElementPolyfillSupport,Fe=(e,n)=>e,Ie={toAttribute(e,n){switch(n){case Boolean:e=e?Ni:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,n){let t=e;switch(n){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},Ve=(e,n)=>!Li(e,n),er={attribute:!0,type:String,converter:Ie,reflect:!1,useDefault:!1,hasChanged:Ve};Symbol.metadata??=Symbol("metadata"),Ke.litPropertyMetadata??=new WeakMap;var J=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,t=er){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(n,t),!t.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(n,r,t);i!==void 0&&Ti(this.prototype,n,i)}}static getPropertyDescriptor(n,t,r){let{get:i,set:s}=Fi(this.prototype,n)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){let o=i?.call(this);s?.call(this,a),this.requestUpdate(n,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??er}static _$Ei(){if(this.hasOwnProperty(Fe("elementProperties")))return;let n=Oi(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Fe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Fe("properties"))){let t=this.properties,r=[...Ii(t),...Pi(t)];for(let i of r)this.createProperty(i,t[i])}let n=this[Symbol.metadata];if(n!==null){let t=litPropertyMetadata.get(n);if(t!==void 0)for(let[r,i]of t)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let i=this._$Eu(t,r);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let t=[];if(Array.isArray(n)){let r=new Set(n.flat(1/0).reverse());for(let i of r)t.unshift(vt(i))}else n!==void 0&&t.push(vt(n));return t}static _$Eu(n,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(n.set(r,this[r]),delete this[r]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Xt(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,t,r){this._$AK(n,r)}_$ET(n,t){let r=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:Ie).toAttribute(t,r.type);this._$Em=n,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(n,t){let r=this.constructor,i=r._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Ie;this._$Em=i;let o=a.fromAttribute(t,s.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(n,t,r,i=!1,s){if(n!==void 0){let a=this.constructor;if(i===!1&&(s=this[n]),r??=a.getPropertyOptions(n),!((r.hasChanged??Ve)(s,t)||r.useDefault&&r.reflect&&s===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,r))))return;this.C(n,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,t,{useDefault:r,reflect:i,wrapped:s},a){r&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??t??this[n]),s!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||r||(t=void 0),this._$AL.set(n,t)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:a}=s,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,s,o)}}let n=!1,t=this._$AL;try{n=this.shouldUpdate(t),n?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw n=!1,this._$EM(),r}n&&this._$AE(t)}willUpdate(n){}_$AE(n){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(n){}firstUpdated(n){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[Fe("elementProperties")]=new Map,J[Fe("finalized")]=new Map,Di?.({ReactiveElement:J}),(Ke.reactiveElementVersions??=[]).push("2.1.2");var Et=globalThis,tr=e=>e,Je=Et.trustedTypes,rr=Je?Je.createPolicy("lit-html",{createHTML:e=>e}):void 0,lr="$lit$",ne=`lit$${Math.random().toFixed(9).slice(2)}$`,ur="?"+ne,Hi=`<${ur}>`,me=document,Oe=()=>me.createComment(""),Ne=e=>e===null||typeof e!="object"&&typeof e!="function",St=Array.isArray,Mi=e=>St(e)||typeof e?.[Symbol.iterator]=="function",yt=`[ 	
\f\r]`,Pe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ir=/-->/g,nr=/>/g,he=RegExp(`>|${yt}(?:([^\\s"'>=/]+)(${yt}*=${yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),sr=/'/g,ar=/"/g,dr=/^(?:script|style|textarea|title)$/i,Ct=e=>(n,...t)=>({_$litType$:e,strings:n,values:t}),u=Ct(1),Ka=Ct(2),Va=Ct(3),fe=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),or=new WeakMap,pe=me.createTreeWalker(me,129);function cr(e,n){if(!St(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return rr!==void 0?rr.createHTML(n):n}var Ri=(e,n)=>{let t=e.length-1,r=[],i,s=n===2?"<svg>":n===3?"<math>":"",a=Pe;for(let o=0;o<t;o++){let l=e[o],h,m,p=-1,g=0;for(;g<l.length&&(a.lastIndex=g,m=a.exec(l),m!==null);)g=a.lastIndex,a===Pe?m[1]==="!--"?a=ir:m[1]!==void 0?a=nr:m[2]!==void 0?(dr.test(m[2])&&(i=RegExp("</"+m[2],"g")),a=he):m[3]!==void 0&&(a=he):a===he?m[0]===">"?(a=i??Pe,p=-1):m[1]===void 0?p=-2:(p=a.lastIndex-m[2].length,h=m[1],a=m[3]===void 0?he:m[3]==='"'?ar:sr):a===ar||a===sr?a=he:a===ir||a===nr?a=Pe:(a=he,i=void 0);let v=a===he&&e[o+1].startsWith("/>")?" ":"";s+=a===Pe?l+Hi:p>=0?(r.push(h),l.slice(0,p)+lr+l.slice(p)+ne+v):l+ne+(p===-2?o:v)}return[cr(e,s+(e[t]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),r]},De=class e{constructor({strings:n,_$litType$:t},r){let i;this.parts=[];let s=0,a=0,o=n.length-1,l=this.parts,[h,m]=Ri(n,t);if(this.el=e.createElement(h,r),pe.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=pe.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(lr)){let g=m[a++],v=i.getAttribute(p).split(ne),w=/([.?@])?(.*)/.exec(g);l.push({type:1,index:s,name:w[2],strings:v,ctor:w[1]==="."?$t:w[1]==="?"?xt:w[1]==="@"?wt:xe}),i.removeAttribute(p)}else p.startsWith(ne)&&(l.push({type:6,index:s}),i.removeAttribute(p));if(dr.test(i.tagName)){let p=i.textContent.split(ne),g=p.length-1;if(g>0){i.textContent=Je?Je.emptyScript:"";for(let v=0;v<g;v++)i.append(p[v],Oe()),pe.nextNode(),l.push({type:2,index:++s});i.append(p[g],Oe())}}}else if(i.nodeType===8)if(i.data===ur)l.push({type:2,index:s});else{let p=-1;for(;(p=i.data.indexOf(ne,p+1))!==-1;)l.push({type:7,index:s}),p+=ne.length-1}s++}}static createElement(n,t){let r=me.createElement("template");return r.innerHTML=n,r}};function $e(e,n,t=e,r){if(n===fe)return n;let i=r!==void 0?t._$Co?.[r]:t._$Cl,s=Ne(n)?void 0:n._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(e),i._$AT(e,t,r)),r!==void 0?(t._$Co??=[])[r]=i:t._$Cl=i),i!==void 0&&(n=$e(e,i._$AS(e,n.values),i,r)),n}var bt=class{constructor(n,t){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:t},parts:r}=this._$AD,i=(n?.creationScope??me).importNode(t,!0);pe.currentNode=i;let s=pe.nextNode(),a=0,o=0,l=r[0];for(;l!==void 0;){if(a===l.index){let h;l.type===2?h=new He(s,s.nextSibling,this,n):l.type===1?h=new l.ctor(s,l.name,l.strings,this,n):l.type===6&&(h=new kt(s,this,n)),this._$AV.push(h),l=r[++o]}a!==l?.index&&(s=pe.nextNode(),a++)}return pe.currentNode=me,i}p(n){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(n,r,t),t+=r.strings.length-2):r._$AI(n[t])),t++}},He=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,t,r,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=n,this._$AB=t,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,t=this._$AM;return t!==void 0&&n?.nodeType===11&&(n=t.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,t=this){n=$e(this,n,t),Ne(n)?n===F||n==null||n===""?(this._$AH!==F&&this._$AR(),this._$AH=F):n!==this._$AH&&n!==fe&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Mi(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==F&&Ne(this._$AH)?this._$AA.nextSibling.data=n:this.T(me.createTextNode(n)),this._$AH=n}$(n){let{values:t,_$litType$:r}=n,i=typeof r=="number"?this._$AC(n):(r.el===void 0&&(r.el=De.createElement(cr(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(t);else{let s=new bt(i,this),a=s.u(this.options);s.p(t),this.T(a),this._$AH=s}}_$AC(n){let t=or.get(n.strings);return t===void 0&&or.set(n.strings,t=new De(n)),t}k(n){St(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,i=0;for(let s of n)i===t.length?t.push(r=new e(this.O(Oe()),this.O(Oe()),this,this.options)):r=t[i],r._$AI(s),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(n=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);n!==this._$AB;){let r=tr(n).nextSibling;tr(n).remove(),n=r}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},xe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,t,r,i,s){this.type=1,this._$AH=F,this._$AN=void 0,this.element=n,this.name=t,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=F}_$AI(n,t=this,r,i){let s=this.strings,a=!1;if(s===void 0)n=$e(this,n,t,0),a=!Ne(n)||n!==this._$AH&&n!==fe,a&&(this._$AH=n);else{let o=n,l,h;for(n=s[0],l=0;l<s.length-1;l++)h=$e(this,o[r+l],t,l),h===fe&&(h=this._$AH[l]),a||=!Ne(h)||h!==this._$AH[l],h===F?n=F:n!==F&&(n+=(h??"")+s[l+1]),this._$AH[l]=h}a&&!i&&this.j(n)}j(n){n===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},$t=class extends xe{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===F?void 0:n}},xt=class extends xe{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==F)}},wt=class extends xe{constructor(n,t,r,i,s){super(n,t,r,i,s),this.type=5}_$AI(n,t=this){if((n=$e(this,n,t,0)??F)===fe)return;let r=this._$AH,i=n===F&&r!==F||n.capture!==r.capture||n.once!==r.once||n.passive!==r.passive,s=n!==F&&(r===F||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},kt=class{constructor(n,t,r){this.element=n,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(n){$e(this,n)}};var ji=Et.litHtmlPolyfillSupport;ji?.(De,He),(Et.litHtmlVersions??=[]).push("3.3.2");var hr=(e,n,t)=>{let r=t?.renderBefore??n,i=r._$litPart$;if(i===void 0){let s=t?.renderBefore??null;r._$litPart$=i=new He(n.insertBefore(Oe(),s),s,void 0,t??{})}return i._$AI(e),i};var At=globalThis,b=class extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=hr(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return fe}};b._$litElement$=!0,b.finalized=!0,At.litElementHydrateSupport?.({LitElement:b});var Ui=At.litElementPolyfillSupport;Ui?.({LitElement:b});(At.litElementVersions??=[]).push("4.2.2");var x=e=>(n,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(e,n)}):customElements.define(e,n)};var zi={attribute:!0,type:String,converter:Ie,reflect:!1,hasChanged:Ve},Wi=(e=zi,n,t)=>{let{kind:r,metadata:i}=t,s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(t.name,e),r==="accessor"){let{name:a}=t;return{set(o){let l=n.get.call(this);n.set.call(this,o),this.requestUpdate(a,l,e,!0,o)},init(o){return o!==void 0&&this.C(a,void 0,e,o),o}}}if(r==="setter"){let{name:a}=t;return function(o){let l=this[a];n.call(this,o),this.requestUpdate(a,l,e,!0,o)}}throw Error("Unsupported decorator location: "+r)};function f(e){return(n,t)=>typeof t=="object"?Wi(e,n,t):((r,i,s)=>{let a=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),a?Object.getOwnPropertyDescriptor(i,s):void 0})(e,n,t)}function _(e){return f({...e,state:!0,attribute:!1})}function W(e,n,t){let r=e?.localize?.(n);return r&&r!==n?r:t}function Lt(e){let n=e.replaceAll("_"," ").toLowerCase();return n.charAt(0).toUpperCase()+n.slice(1)}function se(e,n){return W(e,`component.ambience.matcher.${n}`,Lt(n))}function ae(e,n){return W(e,`component.ambience.action.${n}`,Lt(n))}function we(e,n){return W(e,`component.ambience.anchor.${n}`,Lt(n))}function ge(e,n,t){let r=t[n]?.label;if(r)return r;let i=n.charAt(0).toUpperCase()+n.slice(1);return W(e,`component.ambience.time_of_day_period.${n}`,i)}function d(e,n,t){return W(e,`component.ambience.${n}`,t)}var Bi=["mon","tue","wed","thu","fri","sat","sun"],Yi=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Xe(e,n){return W(e,`component.ambience.weekday.${Bi[n]}`,Yi[n]??String(n))}var Gi={weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"};function Ze(e,n){return W(e,`component.ambience.day_item.${n}`,Gi[n]??n)}var qi=["January","February","March","April","May","June","July","August","September","October","November","December"];function ke(e,n){return W(e,`component.ambience.month.${n}`,qi[n-1]??String(n))}var Ki={"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"};function et(e,n){return W(e,`component.ambience.weather_condition.${n}`,Ki[n]??n)}var Vi={temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"};function Me(e,n){return W(e,`component.ambience.weather_attr.${n}`,Vi[n]??n)}var Ji={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},Qi={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},Xi={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function Tt(e,n,t){if(n==="humidity")return"%";let r=Xi[n];if(r){let a=t?.attributes?.[r];if(typeof a=="string"&&a)return a}let i=Qi[n],s=e?.config?.unit_system;return i&&s&&typeof s[i]=="string"?s[i]:Ji[n]??""}var Zi={is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"};function B(e,n){return W(e,`component.ambience.state_op.${n}`,Zi[n]??n)}var en=["ha-input","ha-textfield","ha-form"],tn=["ha-input","ha-textfield"];function pr(){for(let e of tn)if(customElements.get(e))return e;return null}function Y(e,n){for(let t of en)customElements.get(t)||customElements.whenDefined(t).then(()=>e.requestUpdate())}async function mr(e){return e.callWS({type:"ambience/areas/list"})}async function fr(e,n){return e.callWS({type:"ambience/area/get",area_id:n})}async function gr(e,n,t){return e.callWS({type:"ambience/area/save",area_id:n,config:t})}async function _r(e){return e.callWS({type:"ambience/floors/list"})}async function vr(e,n){return e.callWS({type:"ambience/floor/get",floor_id:n})}async function yr(e,n,t){return e.callWS({type:"ambience/floor/save",floor_id:n,config:t})}async function br(e){return e.callWS({type:"ambience/house/get"})}async function $r(e,n){return e.callWS({type:"ambience/house/save",config:n})}async function tt(e){return e.callWS({type:"ambience/matchers/list"})}async function xr(e){return e.callWS({type:"ambience/actions/list"})}async function rt(e){return e.callWS({type:"ambience/time_of_day_periods/list"})}async function wr(e,n,t){return e.callWS({type:"ambience/time_of_day_periods/save",custom:n,hidden:t})}async function it(e){return e.callWS({type:"ambience/matchers/day/config/list"})}async function kr(e,n,t){return e.callWS({type:"ambience/matchers/day/config/save",workday_sensor:n,workday_calendar:t})}async function nt(e){return e.callWS({type:"ambience/matchers/weather/config/list"})}async function Er(e,n,t){return e.callWS({type:"ambience/matchers/weather/config/save",entity:n,groups:t})}async function Sr(e,n){return e.callWS({type:"ambience/state/known_states",entity_id:n})}function st(e,n="New rule"){return e.name&&e.name.trim()?e.name:n}function at(e,n,t){return n==null?d(t.hass,"ui.summary_any_paren","(any)"):e==="time_of_day"?ot(n,t):e==="day"?nn(n,t):e==="weather"?on(n,t):e==="state"?It(n,t):e==="script"?rn(n,t):String(n)}function rn(e,n={}){if(e===null)return d(n.hass,"ui.summary_any_paren","(any)");if(typeof e!="object"||e===null||typeof e.script!="string")return String(e);let t=e.args??{},r=Object.keys(t).sort();if(r.length===0)return e.script;let i=r.map(s=>`${s}=${t[s]}`).join(", ");return`${e.script}(${i})`}function nn(e,n={}){if(e===null)return d(n.hass,"day_summary.any","any");let t=e.include??[],r=e.exclude??[],i=t.length===0?d(n.hass,"day_summary.any_day","any day"):t.map(a=>Cr(a,n)).join(", ");if(r.length===0)return i;let s=d(n.hass,"day_summary.except","except");return`${i} (${s} ${r.map(a=>Cr(a,n)).join(", ")})`}function Cr(e,n){switch(e.kind){case"weekday":return e.days.map(t=>Xe(n.hass,t)).join("/");case"day_of_month":return`${d(n.hass,"day_summary.day_prefix","day")} ${e.days}`;case"date":return`${ke(n.hass,e.month)} ${e.day}`;case"date_range":return`${ke(n.hass,e.from.month)} ${e.from.day} \u2192 ${ke(n.hass,e.to.month)} ${e.to.day}`;case"last_day":return d(n.hass,"day_summary.last_day","last day");case"workday":return d(n.hass,"day_summary.workday","workday");case"holiday":return d(n.hass,"day_summary.holiday","holiday");case"first_workday":return d(n.hass,"day_summary.first_workday","first workday");case"last_workday":return d(n.hass,"day_summary.last_workday","last workday")}}var sn={"<":"<","<=":"\u2264",">":">",">=":"\u2265"};function an(e){return e.split(/[\s_-]+/).filter(n=>n!=="").map(n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()).join(" ")}function on(e,n={}){if(e===null)return d(n.hass,"ui.summary_any","any");let t=new Map((n.weatherGroups??[]).map(a=>[a.id,a.label])),r=(e.groups??[]).map(a=>t.get(a)??an(a)).join("/"),i=(e.thresholds??[]).map(a=>`${Me(n.hass,a.attribute)} ${sn[a.op]??a.op} ${a.value}`).join(", "),s=[r,i].filter(a=>a!=="");return s.length===0?d(n.hass,"ui.summary_any","any"):s.join(", ")}function ln(e,n){let r=e.hass?.states?.[n]?.attributes?.friendly_name;return typeof r=="string"&&r?r:n}function It(e,n={}){return e==null?d(n.hass,"ui.summary_any","any"):Ft(e,n)}function Ft(e,n){if(e.kind==="is"||e.kind==="is_not"||e.kind===">"||e.kind===">="||e.kind==="<"||e.kind==="<="){let t=B(n.hass,e.kind),i=e.kind!=="is"&&e.kind!=="is_not"?e.states[0]??"":e.states.join("/"),s=ln(n,e.entity_id),o=`${e.attribute?`${s}.${e.attribute}`:s} ${t} ${i}`;return e.for&&un(e.for)?`${o} ${d(n.hass,"ui.for_prefix","for")} \u2265${dn(e.for)}`:o}if(e.kind==="and"||e.kind==="or"){let t=` ${B(n.hass,e.kind)} `;return e.items.map(r=>Ar(r,n)).join(t)}return e.kind==="not"?`${B(n.hass,"not")} ${Ar(e.item,n)}`:""}function Ar(e,n){return e.kind==="and"||e.kind==="or"?`(${Ft(e,n)})`:Ft(e,n)}function un(e){return e.h>0||e.m>0||e.s>0}function dn(e){let n=[];return e.h&&n.push(`${e.h}h`),e.m&&n.push(`${e.m}m`),e.s&&n.push(`${e.s}s`),n.length?n.join(" "):"0s"}function ot(e,n){if(e===null)return d(n.hass,"ui.summary_any","any");let t=Array.isArray(e)?e:[e],r=n.periods?.custom??{};return t.map(i=>"period"in i?ge(n.hass,i.period,r):`${Lr(i.from,n)} \u2192 ${Lr(i.to,n)}`).join(", ")}function Lr(e,n){if(e.kind==="time")return`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;let t=we(n.hass,e.anchor);if(e.offset_min===0)return t;let r=Math.abs(e.offset_min),i=r%60===0?`${r/60}${d(n.hass,"ui.unit_hour_abbr","h")}`:`${r}${d(n.hass,"ui.unit_min_abbr","m")}`;return`${t}${e.offset_min<0?"-":"+"}${i}`}function Tr(e,n,t){let r=ae(t.hass,e.action);if(e.action==="script"||n?.kind==="script")return cn(e,r,t);let i=n?.domains?.[0]??d(t.hass,"ui.target_noun","target"),s=e.entity_ids.length,a;s===0?a=d(t.hass,"ui.no_targets","(no targets)"):s===1?a=`1 ${i}`:a=`${s} ${i}s`;let o={};for(let h of n?.target_params??[])h.unit&&(o[h.name]=h.unit);let l=Object.entries(e.params).filter(([,h])=>h!=null&&h!=="").map(([h,m])=>`${h} ${m}${o[h]??""}`).join(", ");return l?`${r}: ${a}, ${l}`:`${r}: ${a}`}function cn(e,n,t){let r=e.script??d(t.hass,"ui.no_script_chosen","(not selected)"),i=e.entity_ids.length,s=d(t.hass,"ui.target_noun","target"),a;i===0?a="":i===1?a=`1 ${s}`:a=`${i} ${s}s`;let o=Object.entries(e.params).filter(([,h])=>h!=null&&h!=="").map(([h,m])=>`${h}=${m}`).join(", "),l=[r,a,o].filter(h=>h!=="");return`${n}: ${l.join(", ")}`}var N=class extends b{constructor(){super(...arguments);this.rules=[];this.autoSort=!0;this.availableActions=[];this._dragFrom=null;this._dragOver=null;this._expandedActions=new Set}_emit(t,r){this.dispatchEvent(new CustomEvent(t,{detail:r,bubbles:!0,composed:!0}))}_whenSummary(t){let r=new Map((this.matchers??[]).map(s=>[s.name,s.priority])),i=Object.keys(t.when).filter(s=>t.when[s]!=null).sort((s,a)=>(r.get(s)??1/0)-(r.get(a)??1/0));return i.length===0?d(this.hass,"ui.summary_any","any"):i.map(s=>`${se(this.hass,s)}: ${at(s,t.when[s],{hass:this.hass,periods:this.periods,weatherGroups:this.weatherConfig?.groups})}`).join(", ")}_actionCountLabel(t){let r=t.actions.length,i=r===1?d(this.hass,"ui.action_singular","action"):d(this.hass,"ui.action_plural","actions");return`${r} ${i}`}_toggleActions(t){let r=new Set(this._expandedActions);r.has(t)?r.delete(t):r.add(t),this._expandedActions=r}_entityName(t){let i=this.hass?.states?.[t]?.attributes?.friendly_name;return typeof i=="string"&&i?i:t}_actionParamsString(t,r){let i={};for(let s of r?.target_params??[])s.unit&&(i[s.name]=s.unit);return Object.entries(t.params).filter(([,s])=>s!=null&&s!=="").map(([s,a])=>`${s} ${a}${i[s]??""}`).join(", ")}_onDragStart(t){this._dragFrom=t}_onDragOver(t,r){this._dragFrom===null||r===this._dragFrom||(t.preventDefault(),this._dragOver=r)}_onDrop(t){let r=this._dragFrom;this._dragFrom=null,this._dragOver=null,!(r===null||r===t)&&this._emit("reorder-rules",{from:r,to:t})}_onDragEnd(){this._dragFrom=null,this._dragOver=null}_confirmDelete(t,r){let i=r.name||d(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(t+1));window.confirm(d(this.hass,"ui.confirm_delete",'Delete "{name}"?').replace("{name}",i))&&this._emit("delete-rule",{index:t})}render(){return this.rules.length===0?u`
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
              @dragover=${i=>this._onDragOver(i,r)}
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
                  ${st(t,d(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(r+1)))}
                </div>
                <div class="summary">
                  ${this._whenSummary(t)} ·
                  <span
                    class="action-count"
                    @click=${()=>this._toggleActions(r)}
                  >${this._actionCountLabel(t)}</span>
                </div>
                ${this._expandedActions.has(r)?u`
                      <div class="actions-detail">
                        ${t.actions.map(i=>{let s=this.availableActions.find(l=>l.name===i.action),a=this._actionParamsString(i,s),o=a?`${ae(this.hass,i.action)} \xB7 ${a}`:ae(this.hass,i.action);return u`
                            <div class="actions-detail-item">
                              <div class="action-header">${o}</div>
                              ${i.entity_ids.length===0?u`<div class="no-targets">${d(this.hass,"ui.no_targets","(no targets)")}</div>`:u`<ul class="entity-list">
                                    ${i.entity_ids.map(l=>u`<li>${this._entityName(l)}</li>`)}
                                  </ul>`}
                            </div>
                          `})}
                      </div>
                    `:""}
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
  `,c([f({attribute:!1})],N.prototype,"rules",2),c([f({type:Boolean})],N.prototype,"autoSort",2),c([f({attribute:!1})],N.prototype,"periods",2),c([f({attribute:!1})],N.prototype,"weatherConfig",2),c([f({attribute:!1})],N.prototype,"hass",2),c([f({attribute:!1})],N.prototype,"matchers",2),c([f({attribute:!1})],N.prototype,"availableActions",2),c([_()],N.prototype,"_dragFrom",2),c([_()],N.prototype,"_dragOver",2),c([_()],N.prototype,"_expandedActions",2),N=c([x("ambience-rules-list")],N);function lt(e,n,t){let r=e;if(!r?.entities)return[];let i=r.entities,s=r.devices??{},a=r.areas??{},o=n.kind==="area"?new Set([n.id]):n.kind==="floor"?new Set(Object.values(a).filter(h=>h.floor_id===n.id).map(h=>h.area_id)):null,l=h=>{let m=h.area_id??(h.device_id?s[h.device_id]?.area_id??null:null);return m==null?!1:o===null?!0:o.has(m)};return Object.values(i).filter(l).filter(h=>t.includes(h.entity_id.split(".")[0])).map(h=>h.entity_id).sort()}var G=class extends b{constructor(){super(...arguments);this.value=null;this.suggestions=[];this._schema=[];this._open=!1;this._onDocMousedown=t=>{this._open&&(t.composedPath().includes(this)||(this._open=!1))};this._onHaFormValueChanged=t=>{t.stopPropagation();let r=t.detail.value?.scene??"";this._emit(r.trim()===""?null:r)};this._sceneComputeLabel=t=>t.name==="scene"?d(this.hass,"ui.scene_name","Scene name"):t.name}connectedCallback(){super.connectedCallback(),Y(this,this.hass),document.addEventListener("mousedown",this._onDocMousedown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousedown",this._onDocMousedown)}willUpdate(t){t.has("suggestions")&&(this._schema=[{name:"scene",selector:{select:{options:this.suggestions.map(r=>({value:r,label:r})),custom_value:!0,mode:"dropdown"}}}])}_emit(t){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_onInput(t){let r=t.target.value;this._emit(r.trim()===""?null:r),this._open=!0}_onFocus(){this._open=!0}_onKeyDown(t){t.key==="Escape"&&this._open&&(this._open=!1,t.stopPropagation())}_toggle(t){t.preventDefault(),this._open=!this._open}_select(t,r){r.preventDefault(),this._emit(t),this._open=!1}render(){if(customElements.get("ha-form")){let t={scene:this.value??""};return u`
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
  `,c([f({attribute:!1})],G.prototype,"hass",2),c([f()],G.prototype,"value",2),c([f({attribute:!1})],G.prototype,"suggestions",2),c([_()],G.prototype,"_schema",2),c([_()],G.prototype,"_open",2),G=c([x("ambience-scene-combobox")],G);function Gr(e){return typeof e>"u"||e===null}function hn(e){return typeof e=="object"&&e!==null}function pn(e){return Array.isArray(e)?e:Gr(e)?[]:[e]}function mn(e,n){var t,r,i,s;if(n)for(s=Object.keys(n),t=0,r=s.length;t<r;t+=1)i=s[t],e[i]=n[i];return e}function fn(e,n){var t="",r;for(r=0;r<n;r+=1)t+=e;return t}function gn(e){return e===0&&Number.NEGATIVE_INFINITY===1/e}var _n=Gr,vn=hn,yn=pn,bn=fn,$n=gn,xn=mn,L={isNothing:_n,isObject:vn,toArray:yn,repeat:bn,isNegativeZero:$n,extend:xn};function qr(e,n){var t="",r=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(t+='in "'+e.mark.name+'" '),t+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!n&&e.mark.snippet&&(t+=`

`+e.mark.snippet),r+" "+t):r}function je(e,n){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=n,this.message=qr(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}je.prototype=Object.create(Error.prototype);je.prototype.constructor=je;je.prototype.toString=function(n){return this.name+": "+qr(this,n)};var D=je;function Pt(e,n,t,r,i){var s="",a="",o=Math.floor(i/2)-1;return r-n>o&&(s=" ... ",n=r-o+s.length),t-r>o&&(a=" ...",t=r+o-a.length),{str:s+e.slice(n,t).replace(/\t/g,"\u2192")+a,pos:r-n+s.length}}function Ot(e,n){return L.repeat(" ",n-e.length)+e}function wn(e,n){if(n=Object.create(n||null),!e.buffer)return null;n.maxLength||(n.maxLength=79),typeof n.indent!="number"&&(n.indent=1),typeof n.linesBefore!="number"&&(n.linesBefore=3),typeof n.linesAfter!="number"&&(n.linesAfter=2);for(var t=/\r?\n|\r|\0/g,r=[0],i=[],s,a=-1;s=t.exec(e.buffer);)i.push(s.index),r.push(s.index+s[0].length),e.position<=s.index&&a<0&&(a=r.length-2);a<0&&(a=r.length-1);var o="",l,h,m=Math.min(e.line+n.linesAfter,i.length).toString().length,p=n.maxLength-(n.indent+m+3);for(l=1;l<=n.linesBefore&&!(a-l<0);l++)h=Pt(e.buffer,r[a-l],i[a-l],e.position-(r[a]-r[a-l]),p),o=L.repeat(" ",n.indent)+Ot((e.line-l+1).toString(),m)+" | "+h.str+`
`+o;for(h=Pt(e.buffer,r[a],i[a],e.position,p),o+=L.repeat(" ",n.indent)+Ot((e.line+1).toString(),m)+" | "+h.str+`
`,o+=L.repeat("-",n.indent+m+3+h.pos)+`^
`,l=1;l<=n.linesAfter&&!(a+l>=i.length);l++)h=Pt(e.buffer,r[a+l],i[a+l],e.position-(r[a]-r[a+l]),p),o+=L.repeat(" ",n.indent)+Ot((e.line+l+1).toString(),m)+" | "+h.str+`
`;return o.replace(/\n$/,"")}var kn=wn,En=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Sn=["scalar","sequence","mapping"];function Cn(e){var n={};return e!==null&&Object.keys(e).forEach(function(t){e[t].forEach(function(r){n[String(r)]=t})}),n}function An(e,n){if(n=n||{},Object.keys(n).forEach(function(t){if(En.indexOf(t)===-1)throw new D('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=n,this.tag=e,this.kind=n.kind||null,this.resolve=n.resolve||function(){return!0},this.construct=n.construct||function(t){return t},this.instanceOf=n.instanceOf||null,this.predicate=n.predicate||null,this.represent=n.represent||null,this.representName=n.representName||null,this.defaultStyle=n.defaultStyle||null,this.multi=n.multi||!1,this.styleAliases=Cn(n.styleAliases||null),Sn.indexOf(this.kind)===-1)throw new D('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}var P=An;function Fr(e,n){var t=[];return e[n].forEach(function(r){var i=t.length;t.forEach(function(s,a){s.tag===r.tag&&s.kind===r.kind&&s.multi===r.multi&&(i=a)}),t[i]=r}),t}function Ln(){var e={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},n,t;function r(i){i.multi?(e.multi[i.kind].push(i),e.multi.fallback.push(i)):e[i.kind][i.tag]=e.fallback[i.tag]=i}for(n=0,t=arguments.length;n<t;n+=1)arguments[n].forEach(r);return e}function Dt(e){return this.extend(e)}Dt.prototype.extend=function(n){var t=[],r=[];if(n instanceof P)r.push(n);else if(Array.isArray(n))r=r.concat(n);else if(n&&(Array.isArray(n.implicit)||Array.isArray(n.explicit)))n.implicit&&(t=t.concat(n.implicit)),n.explicit&&(r=r.concat(n.explicit));else throw new D("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");t.forEach(function(s){if(!(s instanceof P))throw new D("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new D("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new D("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),r.forEach(function(s){if(!(s instanceof P))throw new D("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var i=Object.create(Dt.prototype);return i.implicit=(this.implicit||[]).concat(t),i.explicit=(this.explicit||[]).concat(r),i.compiledImplicit=Fr(i,"implicit"),i.compiledExplicit=Fr(i,"explicit"),i.compiledTypeMap=Ln(i.compiledImplicit,i.compiledExplicit),i};var Tn=Dt,Fn=new P("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return e!==null?e:""}}),In=new P("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return e!==null?e:[]}}),Pn=new P("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return e!==null?e:{}}}),On=new Tn({explicit:[Fn,In,Pn]});function Nn(e){if(e===null)return!0;var n=e.length;return n===1&&e==="~"||n===4&&(e==="null"||e==="Null"||e==="NULL")}function Dn(){return null}function Hn(e){return e===null}var Mn=new P("tag:yaml.org,2002:null",{kind:"scalar",resolve:Nn,construct:Dn,predicate:Hn,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function Rn(e){if(e===null)return!1;var n=e.length;return n===4&&(e==="true"||e==="True"||e==="TRUE")||n===5&&(e==="false"||e==="False"||e==="FALSE")}function jn(e){return e==="true"||e==="True"||e==="TRUE"}function Un(e){return Object.prototype.toString.call(e)==="[object Boolean]"}var zn=new P("tag:yaml.org,2002:bool",{kind:"scalar",resolve:Rn,construct:jn,predicate:Un,represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function Wn(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function Bn(e){return 48<=e&&e<=55}function Yn(e){return 48<=e&&e<=57}function Gn(e){if(e===null)return!1;var n=e.length,t=0,r=!1,i;if(!n)return!1;if(i=e[t],(i==="-"||i==="+")&&(i=e[++t]),i==="0"){if(t+1===n)return!0;if(i=e[++t],i==="b"){for(t++;t<n;t++)if(i=e[t],i!=="_"){if(i!=="0"&&i!=="1")return!1;r=!0}return r&&i!=="_"}if(i==="x"){for(t++;t<n;t++)if(i=e[t],i!=="_"){if(!Wn(e.charCodeAt(t)))return!1;r=!0}return r&&i!=="_"}if(i==="o"){for(t++;t<n;t++)if(i=e[t],i!=="_"){if(!Bn(e.charCodeAt(t)))return!1;r=!0}return r&&i!=="_"}}if(i==="_")return!1;for(;t<n;t++)if(i=e[t],i!=="_"){if(!Yn(e.charCodeAt(t)))return!1;r=!0}return!(!r||i==="_")}function qn(e){var n=e,t=1,r;if(n.indexOf("_")!==-1&&(n=n.replace(/_/g,"")),r=n[0],(r==="-"||r==="+")&&(r==="-"&&(t=-1),n=n.slice(1),r=n[0]),n==="0")return 0;if(r==="0"){if(n[1]==="b")return t*parseInt(n.slice(2),2);if(n[1]==="x")return t*parseInt(n.slice(2),16);if(n[1]==="o")return t*parseInt(n.slice(2),8)}return t*parseInt(n,10)}function Kn(e){return Object.prototype.toString.call(e)==="[object Number]"&&e%1===0&&!L.isNegativeZero(e)}var Vn=new P("tag:yaml.org,2002:int",{kind:"scalar",resolve:Gn,construct:qn,predicate:Kn,represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Jn=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Qn(e){return!(e===null||!Jn.test(e)||e[e.length-1]==="_")}function Xn(e){var n,t;return n=e.replace(/_/g,"").toLowerCase(),t=n[0]==="-"?-1:1,"+-".indexOf(n[0])>=0&&(n=n.slice(1)),n===".inf"?t===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:n===".nan"?NaN:t*parseFloat(n,10)}var Zn=/^[-+]?[0-9]+e/;function es(e,n){var t;if(isNaN(e))switch(n){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(n){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(n){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(L.isNegativeZero(e))return"-0.0";return t=e.toString(10),Zn.test(t)?t.replace("e",".e"):t}function ts(e){return Object.prototype.toString.call(e)==="[object Number]"&&(e%1!==0||L.isNegativeZero(e))}var rs=new P("tag:yaml.org,2002:float",{kind:"scalar",resolve:Qn,construct:Xn,predicate:ts,represent:es,defaultStyle:"lowercase"}),is=On.extend({implicit:[Mn,zn,Vn,rs]}),ns=is,Kr=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Vr=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function ss(e){return e===null?!1:Kr.exec(e)!==null||Vr.exec(e)!==null}function as(e){var n,t,r,i,s,a,o,l=0,h=null,m,p,g;if(n=Kr.exec(e),n===null&&(n=Vr.exec(e)),n===null)throw new Error("Date resolve error");if(t=+n[1],r=+n[2]-1,i=+n[3],!n[4])return new Date(Date.UTC(t,r,i));if(s=+n[4],a=+n[5],o=+n[6],n[7]){for(l=n[7].slice(0,3);l.length<3;)l+="0";l=+l}return n[9]&&(m=+n[10],p=+(n[11]||0),h=(m*60+p)*6e4,n[9]==="-"&&(h=-h)),g=new Date(Date.UTC(t,r,i,s,a,o,l)),h&&g.setTime(g.getTime()-h),g}function os(e){return e.toISOString()}var ls=new P("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:ss,construct:as,instanceOf:Date,represent:os});function us(e){return e==="<<"||e===null}var ds=new P("tag:yaml.org,2002:merge",{kind:"scalar",resolve:us}),Ut=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function cs(e){if(e===null)return!1;var n,t,r=0,i=e.length,s=Ut;for(t=0;t<i;t++)if(n=s.indexOf(e.charAt(t)),!(n>64)){if(n<0)return!1;r+=6}return r%8===0}function hs(e){var n,t,r=e.replace(/[\r\n=]/g,""),i=r.length,s=Ut,a=0,o=[];for(n=0;n<i;n++)n%4===0&&n&&(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)),a=a<<6|s.indexOf(r.charAt(n));return t=i%4*6,t===0?(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)):t===18?(o.push(a>>10&255),o.push(a>>2&255)):t===12&&o.push(a>>4&255),new Uint8Array(o)}function ps(e){var n="",t=0,r,i,s=e.length,a=Ut;for(r=0;r<s;r++)r%3===0&&r&&(n+=a[t>>18&63],n+=a[t>>12&63],n+=a[t>>6&63],n+=a[t&63]),t=(t<<8)+e[r];return i=s%3,i===0?(n+=a[t>>18&63],n+=a[t>>12&63],n+=a[t>>6&63],n+=a[t&63]):i===2?(n+=a[t>>10&63],n+=a[t>>4&63],n+=a[t<<2&63],n+=a[64]):i===1&&(n+=a[t>>2&63],n+=a[t<<4&63],n+=a[64],n+=a[64]),n}function ms(e){return Object.prototype.toString.call(e)==="[object Uint8Array]"}var fs=new P("tag:yaml.org,2002:binary",{kind:"scalar",resolve:cs,construct:hs,predicate:ms,represent:ps}),gs=Object.prototype.hasOwnProperty,_s=Object.prototype.toString;function vs(e){if(e===null)return!0;var n=[],t,r,i,s,a,o=e;for(t=0,r=o.length;t<r;t+=1){if(i=o[t],a=!1,_s.call(i)!=="[object Object]")return!1;for(s in i)if(gs.call(i,s))if(!a)a=!0;else return!1;if(!a)return!1;if(n.indexOf(s)===-1)n.push(s);else return!1}return!0}function ys(e){return e!==null?e:[]}var bs=new P("tag:yaml.org,2002:omap",{kind:"sequence",resolve:vs,construct:ys}),$s=Object.prototype.toString;function xs(e){if(e===null)return!0;var n,t,r,i,s,a=e;for(s=new Array(a.length),n=0,t=a.length;n<t;n+=1){if(r=a[n],$s.call(r)!=="[object Object]"||(i=Object.keys(r),i.length!==1))return!1;s[n]=[i[0],r[i[0]]]}return!0}function ws(e){if(e===null)return[];var n,t,r,i,s,a=e;for(s=new Array(a.length),n=0,t=a.length;n<t;n+=1)r=a[n],i=Object.keys(r),s[n]=[i[0],r[i[0]]];return s}var ks=new P("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:xs,construct:ws}),Es=Object.prototype.hasOwnProperty;function Ss(e){if(e===null)return!0;var n,t=e;for(n in t)if(Es.call(t,n)&&t[n]!==null)return!1;return!0}function Cs(e){return e!==null?e:{}}var As=new P("tag:yaml.org,2002:set",{kind:"mapping",resolve:Ss,construct:Cs}),Jr=ns.extend({implicit:[ls,ds],explicit:[fs,bs,ks,As]}),le=Object.prototype.hasOwnProperty,ut=1,Qr=2,Xr=3,dt=4,Nt=1,Ls=2,Ir=3,Ts=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Fs=/[\x85\u2028\u2029]/,Is=/[,\[\]\{\}]/,Zr=/^(?:!|!!|![a-z\-]+!)$/i,ei=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Pr(e){return Object.prototype.toString.call(e)}function q(e){return e===10||e===13}function ve(e){return e===9||e===32}function H(e){return e===9||e===32||e===10||e===13}function Se(e){return e===44||e===91||e===93||e===123||e===125}function Ps(e){var n;return 48<=e&&e<=57?e-48:(n=e|32,97<=n&&n<=102?n-97+10:-1)}function Os(e){return e===120?2:e===117?4:e===85?8:0}function Ns(e){return 48<=e&&e<=57?e-48:-1}function Or(e){return e===48?"\0":e===97?"\x07":e===98?"\b":e===116||e===9?"	":e===110?`
`:e===118?"\v":e===102?"\f":e===114?"\r":e===101?"\x1B":e===32?" ":e===34?'"':e===47?"/":e===92?"\\":e===78?"\x85":e===95?"\xA0":e===76?"\u2028":e===80?"\u2029":""}function Ds(e){return e<=65535?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}function ti(e,n,t){n==="__proto__"?Object.defineProperty(e,n,{configurable:!0,enumerable:!0,writable:!0,value:t}):e[n]=t}var ri=new Array(256),ii=new Array(256);for(_e=0;_e<256;_e++)ri[_e]=Or(_e)?1:0,ii[_e]=Or(_e);var _e;function Hs(e,n){this.input=e,this.filename=n.filename||null,this.schema=n.schema||Jr,this.onWarning=n.onWarning||null,this.legacy=n.legacy||!1,this.json=n.json||!1,this.listener=n.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function ni(e,n){var t={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return t.snippet=kn(t),new D(n,t)}function y(e,n){throw ni(e,n)}function ct(e,n){e.onWarning&&e.onWarning.call(null,ni(e,n))}var Nr={YAML:function(n,t,r){var i,s,a;n.version!==null&&y(n,"duplication of %YAML directive"),r.length!==1&&y(n,"YAML directive accepts exactly one argument"),i=/^([0-9]+)\.([0-9]+)$/.exec(r[0]),i===null&&y(n,"ill-formed argument of the YAML directive"),s=parseInt(i[1],10),a=parseInt(i[2],10),s!==1&&y(n,"unacceptable YAML version of the document"),n.version=r[0],n.checkLineBreaks=a<2,a!==1&&a!==2&&ct(n,"unsupported YAML version of the document")},TAG:function(n,t,r){var i,s;r.length!==2&&y(n,"TAG directive accepts exactly two arguments"),i=r[0],s=r[1],Zr.test(i)||y(n,"ill-formed tag handle (first argument) of the TAG directive"),le.call(n.tagMap,i)&&y(n,'there is a previously declared suffix for "'+i+'" tag handle'),ei.test(s)||y(n,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{y(n,"tag prefix is malformed: "+s)}n.tagMap[i]=s}};function oe(e,n,t,r){var i,s,a,o;if(n<t){if(o=e.input.slice(n,t),r)for(i=0,s=o.length;i<s;i+=1)a=o.charCodeAt(i),a===9||32<=a&&a<=1114111||y(e,"expected valid JSON character");else Ts.test(o)&&y(e,"the stream contains non-printable characters");e.result+=o}}function Dr(e,n,t,r){var i,s,a,o;for(L.isObject(t)||y(e,"cannot merge mappings; the provided source object is unacceptable"),i=Object.keys(t),a=0,o=i.length;a<o;a+=1)s=i[a],le.call(n,s)||(ti(n,s,t[s]),r[s]=!0)}function Ce(e,n,t,r,i,s,a,o,l){var h,m;if(Array.isArray(i))for(i=Array.prototype.slice.call(i),h=0,m=i.length;h<m;h+=1)Array.isArray(i[h])&&y(e,"nested arrays are not supported inside keys"),typeof i=="object"&&Pr(i[h])==="[object Object]"&&(i[h]="[object Object]");if(typeof i=="object"&&Pr(i)==="[object Object]"&&(i="[object Object]"),i=String(i),n===null&&(n={}),r==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(h=0,m=s.length;h<m;h+=1)Dr(e,n,s[h],t);else Dr(e,n,s,t);else!e.json&&!le.call(t,i)&&le.call(n,i)&&(e.line=a||e.line,e.lineStart=o||e.lineStart,e.position=l||e.position,y(e,"duplicated mapping key")),ti(n,i,s),delete t[i];return n}function zt(e){var n;n=e.input.charCodeAt(e.position),n===10?e.position++:n===13?(e.position++,e.input.charCodeAt(e.position)===10&&e.position++):y(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function A(e,n,t){for(var r=0,i=e.input.charCodeAt(e.position);i!==0;){for(;ve(i);)i===9&&e.firstTabInLine===-1&&(e.firstTabInLine=e.position),i=e.input.charCodeAt(++e.position);if(n&&i===35)do i=e.input.charCodeAt(++e.position);while(i!==10&&i!==13&&i!==0);if(q(i))for(zt(e),i=e.input.charCodeAt(e.position),r++,e.lineIndent=0;i===32;)e.lineIndent++,i=e.input.charCodeAt(++e.position);else break}return t!==-1&&r!==0&&e.lineIndent<t&&ct(e,"deficient indentation"),r}function mt(e){var n=e.position,t;return t=e.input.charCodeAt(n),!!((t===45||t===46)&&t===e.input.charCodeAt(n+1)&&t===e.input.charCodeAt(n+2)&&(n+=3,t=e.input.charCodeAt(n),t===0||H(t)))}function Wt(e,n){n===1?e.result+=" ":n>1&&(e.result+=L.repeat(`
`,n-1))}function Ms(e,n,t){var r,i,s,a,o,l,h,m,p=e.kind,g=e.result,v;if(v=e.input.charCodeAt(e.position),H(v)||Se(v)||v===35||v===38||v===42||v===33||v===124||v===62||v===39||v===34||v===37||v===64||v===96||(v===63||v===45)&&(i=e.input.charCodeAt(e.position+1),H(i)||t&&Se(i)))return!1;for(e.kind="scalar",e.result="",s=a=e.position,o=!1;v!==0;){if(v===58){if(i=e.input.charCodeAt(e.position+1),H(i)||t&&Se(i))break}else if(v===35){if(r=e.input.charCodeAt(e.position-1),H(r))break}else{if(e.position===e.lineStart&&mt(e)||t&&Se(v))break;if(q(v))if(l=e.line,h=e.lineStart,m=e.lineIndent,A(e,!1,-1),e.lineIndent>=n){o=!0,v=e.input.charCodeAt(e.position);continue}else{e.position=a,e.line=l,e.lineStart=h,e.lineIndent=m;break}}o&&(oe(e,s,a,!1),Wt(e,e.line-l),s=a=e.position,o=!1),ve(v)||(a=e.position+1),v=e.input.charCodeAt(++e.position)}return oe(e,s,a,!1),e.result?!0:(e.kind=p,e.result=g,!1)}function Rs(e,n){var t,r,i;if(t=e.input.charCodeAt(e.position),t!==39)return!1;for(e.kind="scalar",e.result="",e.position++,r=i=e.position;(t=e.input.charCodeAt(e.position))!==0;)if(t===39)if(oe(e,r,e.position,!0),t=e.input.charCodeAt(++e.position),t===39)r=e.position,e.position++,i=e.position;else return!0;else q(t)?(oe(e,r,i,!0),Wt(e,A(e,!1,n)),r=i=e.position):e.position===e.lineStart&&mt(e)?y(e,"unexpected end of the document within a single quoted scalar"):(e.position++,i=e.position);y(e,"unexpected end of the stream within a single quoted scalar")}function js(e,n){var t,r,i,s,a,o;if(o=e.input.charCodeAt(e.position),o!==34)return!1;for(e.kind="scalar",e.result="",e.position++,t=r=e.position;(o=e.input.charCodeAt(e.position))!==0;){if(o===34)return oe(e,t,e.position,!0),e.position++,!0;if(o===92){if(oe(e,t,e.position,!0),o=e.input.charCodeAt(++e.position),q(o))A(e,!1,n);else if(o<256&&ri[o])e.result+=ii[o],e.position++;else if((a=Os(o))>0){for(i=a,s=0;i>0;i--)o=e.input.charCodeAt(++e.position),(a=Ps(o))>=0?s=(s<<4)+a:y(e,"expected hexadecimal character");e.result+=Ds(s),e.position++}else y(e,"unknown escape sequence");t=r=e.position}else q(o)?(oe(e,t,r,!0),Wt(e,A(e,!1,n)),t=r=e.position):e.position===e.lineStart&&mt(e)?y(e,"unexpected end of the document within a double quoted scalar"):(e.position++,r=e.position)}y(e,"unexpected end of the stream within a double quoted scalar")}function Us(e,n){var t=!0,r,i,s,a=e.tag,o,l=e.anchor,h,m,p,g,v,w=Object.create(null),E,C,z,k;if(k=e.input.charCodeAt(e.position),k===91)m=93,v=!1,o=[];else if(k===123)m=125,v=!0,o={};else return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=o),k=e.input.charCodeAt(++e.position);k!==0;){if(A(e,!0,n),k=e.input.charCodeAt(e.position),k===m)return e.position++,e.tag=a,e.anchor=l,e.kind=v?"mapping":"sequence",e.result=o,!0;t?k===44&&y(e,"expected the node content, but found ','"):y(e,"missed comma between flow collection entries"),C=E=z=null,p=g=!1,k===63&&(h=e.input.charCodeAt(e.position+1),H(h)&&(p=g=!0,e.position++,A(e,!0,n))),r=e.line,i=e.lineStart,s=e.position,Ae(e,n,ut,!1,!0),C=e.tag,E=e.result,A(e,!0,n),k=e.input.charCodeAt(e.position),(g||e.line===r)&&k===58&&(p=!0,k=e.input.charCodeAt(++e.position),A(e,!0,n),Ae(e,n,ut,!1,!0),z=e.result),v?Ce(e,o,w,C,E,z,r,i,s):p?o.push(Ce(e,null,w,C,E,z,r,i,s)):o.push(E),A(e,!0,n),k=e.input.charCodeAt(e.position),k===44?(t=!0,k=e.input.charCodeAt(++e.position)):t=!1}y(e,"unexpected end of the stream within a flow collection")}function zs(e,n){var t,r,i=Nt,s=!1,a=!1,o=n,l=0,h=!1,m,p;if(p=e.input.charCodeAt(e.position),p===124)r=!1;else if(p===62)r=!0;else return!1;for(e.kind="scalar",e.result="";p!==0;)if(p=e.input.charCodeAt(++e.position),p===43||p===45)Nt===i?i=p===43?Ir:Ls:y(e,"repeat of a chomping mode identifier");else if((m=Ns(p))>=0)m===0?y(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):a?y(e,"repeat of an indentation width identifier"):(o=n+m-1,a=!0);else break;if(ve(p)){do p=e.input.charCodeAt(++e.position);while(ve(p));if(p===35)do p=e.input.charCodeAt(++e.position);while(!q(p)&&p!==0)}for(;p!==0;){for(zt(e),e.lineIndent=0,p=e.input.charCodeAt(e.position);(!a||e.lineIndent<o)&&p===32;)e.lineIndent++,p=e.input.charCodeAt(++e.position);if(!a&&e.lineIndent>o&&(o=e.lineIndent),q(p)){l++;continue}if(e.lineIndent<o){i===Ir?e.result+=L.repeat(`
`,s?1+l:l):i===Nt&&s&&(e.result+=`
`);break}for(r?ve(p)?(h=!0,e.result+=L.repeat(`
`,s?1+l:l)):h?(h=!1,e.result+=L.repeat(`
`,l+1)):l===0?s&&(e.result+=" "):e.result+=L.repeat(`
`,l):e.result+=L.repeat(`
`,s?1+l:l),s=!0,a=!0,l=0,t=e.position;!q(p)&&p!==0;)p=e.input.charCodeAt(++e.position);oe(e,t,e.position,!1)}return!0}function Hr(e,n){var t,r=e.tag,i=e.anchor,s=[],a,o=!1,l;if(e.firstTabInLine!==-1)return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=s),l=e.input.charCodeAt(e.position);l!==0&&(e.firstTabInLine!==-1&&(e.position=e.firstTabInLine,y(e,"tab characters must not be used in indentation")),!(l!==45||(a=e.input.charCodeAt(e.position+1),!H(a))));){if(o=!0,e.position++,A(e,!0,-1)&&e.lineIndent<=n){s.push(null),l=e.input.charCodeAt(e.position);continue}if(t=e.line,Ae(e,n,Xr,!1,!0),s.push(e.result),A(e,!0,-1),l=e.input.charCodeAt(e.position),(e.line===t||e.lineIndent>n)&&l!==0)y(e,"bad indentation of a sequence entry");else if(e.lineIndent<n)break}return o?(e.tag=r,e.anchor=i,e.kind="sequence",e.result=s,!0):!1}function Ws(e,n,t){var r,i,s,a,o,l,h=e.tag,m=e.anchor,p={},g=Object.create(null),v=null,w=null,E=null,C=!1,z=!1,k;if(e.firstTabInLine!==-1)return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=p),k=e.input.charCodeAt(e.position);k!==0;){if(!C&&e.firstTabInLine!==-1&&(e.position=e.firstTabInLine,y(e,"tab characters must not be used in indentation")),r=e.input.charCodeAt(e.position+1),s=e.line,(k===63||k===58)&&H(r))k===63?(C&&(Ce(e,p,g,v,w,null,a,o,l),v=w=E=null),z=!0,C=!0,i=!0):C?(C=!1,i=!0):y(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,k=r;else{if(a=e.line,o=e.lineStart,l=e.position,!Ae(e,t,Qr,!1,!0))break;if(e.line===s){for(k=e.input.charCodeAt(e.position);ve(k);)k=e.input.charCodeAt(++e.position);if(k===58)k=e.input.charCodeAt(++e.position),H(k)||y(e,"a whitespace character is expected after the key-value separator within a block mapping"),C&&(Ce(e,p,g,v,w,null,a,o,l),v=w=E=null),z=!0,C=!1,i=!1,v=e.tag,w=e.result;else if(z)y(e,"can not read an implicit mapping pair; a colon is missed");else return e.tag=h,e.anchor=m,!0}else if(z)y(e,"can not read a block mapping entry; a multiline key may not be an implicit key");else return e.tag=h,e.anchor=m,!0}if((e.line===s||e.lineIndent>n)&&(C&&(a=e.line,o=e.lineStart,l=e.position),Ae(e,n,dt,!0,i)&&(C?w=e.result:E=e.result),C||(Ce(e,p,g,v,w,E,a,o,l),v=w=E=null),A(e,!0,-1),k=e.input.charCodeAt(e.position)),(e.line===s||e.lineIndent>n)&&k!==0)y(e,"bad indentation of a mapping entry");else if(e.lineIndent<n)break}return C&&Ce(e,p,g,v,w,null,a,o,l),z&&(e.tag=h,e.anchor=m,e.kind="mapping",e.result=p),z}function Bs(e){var n,t=!1,r=!1,i,s,a;if(a=e.input.charCodeAt(e.position),a!==33)return!1;if(e.tag!==null&&y(e,"duplication of a tag property"),a=e.input.charCodeAt(++e.position),a===60?(t=!0,a=e.input.charCodeAt(++e.position)):a===33?(r=!0,i="!!",a=e.input.charCodeAt(++e.position)):i="!",n=e.position,t){do a=e.input.charCodeAt(++e.position);while(a!==0&&a!==62);e.position<e.length?(s=e.input.slice(n,e.position),a=e.input.charCodeAt(++e.position)):y(e,"unexpected end of the stream within a verbatim tag")}else{for(;a!==0&&!H(a);)a===33&&(r?y(e,"tag suffix cannot contain exclamation marks"):(i=e.input.slice(n-1,e.position+1),Zr.test(i)||y(e,"named tag handle cannot contain such characters"),r=!0,n=e.position+1)),a=e.input.charCodeAt(++e.position);s=e.input.slice(n,e.position),Is.test(s)&&y(e,"tag suffix cannot contain flow indicator characters")}s&&!ei.test(s)&&y(e,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{y(e,"tag name is malformed: "+s)}return t?e.tag=s:le.call(e.tagMap,i)?e.tag=e.tagMap[i]+s:i==="!"?e.tag="!"+s:i==="!!"?e.tag="tag:yaml.org,2002:"+s:y(e,'undeclared tag handle "'+i+'"'),!0}function Ys(e){var n,t;if(t=e.input.charCodeAt(e.position),t!==38)return!1;for(e.anchor!==null&&y(e,"duplication of an anchor property"),t=e.input.charCodeAt(++e.position),n=e.position;t!==0&&!H(t)&&!Se(t);)t=e.input.charCodeAt(++e.position);return e.position===n&&y(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(n,e.position),!0}function Gs(e){var n,t,r;if(r=e.input.charCodeAt(e.position),r!==42)return!1;for(r=e.input.charCodeAt(++e.position),n=e.position;r!==0&&!H(r)&&!Se(r);)r=e.input.charCodeAt(++e.position);return e.position===n&&y(e,"name of an alias node must contain at least one character"),t=e.input.slice(n,e.position),le.call(e.anchorMap,t)||y(e,'unidentified alias "'+t+'"'),e.result=e.anchorMap[t],A(e,!0,-1),!0}function Ae(e,n,t,r,i){var s,a,o,l=1,h=!1,m=!1,p,g,v,w,E,C;if(e.listener!==null&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,s=a=o=dt===t||Xr===t,r&&A(e,!0,-1)&&(h=!0,e.lineIndent>n?l=1:e.lineIndent===n?l=0:e.lineIndent<n&&(l=-1)),l===1)for(;Bs(e)||Ys(e);)A(e,!0,-1)?(h=!0,o=s,e.lineIndent>n?l=1:e.lineIndent===n?l=0:e.lineIndent<n&&(l=-1)):o=!1;if(o&&(o=h||i),(l===1||dt===t)&&(ut===t||Qr===t?E=n:E=n+1,C=e.position-e.lineStart,l===1?o&&(Hr(e,C)||Ws(e,C,E))||Us(e,E)?m=!0:(a&&zs(e,E)||Rs(e,E)||js(e,E)?m=!0:Gs(e)?(m=!0,(e.tag!==null||e.anchor!==null)&&y(e,"alias node should not have any properties")):Ms(e,E,ut===t)&&(m=!0,e.tag===null&&(e.tag="?")),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):l===0&&(m=o&&Hr(e,C))),e.tag===null)e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);else if(e.tag==="?"){for(e.result!==null&&e.kind!=="scalar"&&y(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),p=0,g=e.implicitTypes.length;p<g;p+=1)if(w=e.implicitTypes[p],w.resolve(e.result)){e.result=w.construct(e.result),e.tag=w.tag,e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);break}}else if(e.tag!=="!"){if(le.call(e.typeMap[e.kind||"fallback"],e.tag))w=e.typeMap[e.kind||"fallback"][e.tag];else for(w=null,v=e.typeMap.multi[e.kind||"fallback"],p=0,g=v.length;p<g;p+=1)if(e.tag.slice(0,v[p].tag.length)===v[p].tag){w=v[p];break}w||y(e,"unknown tag !<"+e.tag+">"),e.result!==null&&w.kind!==e.kind&&y(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+w.kind+'", not "'+e.kind+'"'),w.resolve(e.result,e.tag)?(e.result=w.construct(e.result,e.tag),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):y(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return e.listener!==null&&e.listener("close",e),e.tag!==null||e.anchor!==null||m}function qs(e){var n=e.position,t,r,i,s=!1,a;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);(a=e.input.charCodeAt(e.position))!==0&&(A(e,!0,-1),a=e.input.charCodeAt(e.position),!(e.lineIndent>0||a!==37));){for(s=!0,a=e.input.charCodeAt(++e.position),t=e.position;a!==0&&!H(a);)a=e.input.charCodeAt(++e.position);for(r=e.input.slice(t,e.position),i=[],r.length<1&&y(e,"directive name must not be less than one character in length");a!==0;){for(;ve(a);)a=e.input.charCodeAt(++e.position);if(a===35){do a=e.input.charCodeAt(++e.position);while(a!==0&&!q(a));break}if(q(a))break;for(t=e.position;a!==0&&!H(a);)a=e.input.charCodeAt(++e.position);i.push(e.input.slice(t,e.position))}a!==0&&zt(e),le.call(Nr,r)?Nr[r](e,r,i):ct(e,'unknown document directive "'+r+'"')}if(A(e,!0,-1),e.lineIndent===0&&e.input.charCodeAt(e.position)===45&&e.input.charCodeAt(e.position+1)===45&&e.input.charCodeAt(e.position+2)===45?(e.position+=3,A(e,!0,-1)):s&&y(e,"directives end mark is expected"),Ae(e,e.lineIndent-1,dt,!1,!0),A(e,!0,-1),e.checkLineBreaks&&Fs.test(e.input.slice(n,e.position))&&ct(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&mt(e)){e.input.charCodeAt(e.position)===46&&(e.position+=3,A(e,!0,-1));return}if(e.position<e.length-1)y(e,"end of the stream or a document separator is expected");else return}function si(e,n){e=String(e),n=n||{},e.length!==0&&(e.charCodeAt(e.length-1)!==10&&e.charCodeAt(e.length-1)!==13&&(e+=`
`),e.charCodeAt(0)===65279&&(e=e.slice(1)));var t=new Hs(e,n),r=e.indexOf("\0");for(r!==-1&&(t.position=r,y(t,"null byte is not allowed in input")),t.input+="\0";t.input.charCodeAt(t.position)===32;)t.lineIndent+=1,t.position+=1;for(;t.position<t.length-1;)qs(t);return t.documents}function Ks(e,n,t){n!==null&&typeof n=="object"&&typeof t>"u"&&(t=n,n=null);var r=si(e,t);if(typeof n!="function")return r;for(var i=0,s=r.length;i<s;i+=1)n(r[i])}function Vs(e,n){var t=si(e,n);if(t.length!==0){if(t.length===1)return t[0];throw new D("expected a single document in the stream, but found more")}}var Js=Ks,Qs=Vs,ai={loadAll:Js,load:Qs},oi=Object.prototype.toString,li=Object.prototype.hasOwnProperty,Bt=65279,Xs=9,Ue=10,Zs=13,ea=32,ta=33,ra=34,Ht=35,ia=37,na=38,sa=39,aa=42,ui=44,oa=45,ht=58,la=61,ua=62,da=63,ca=64,di=91,ci=93,ha=96,hi=123,pa=124,pi=125,O={};O[0]="\\0";O[7]="\\a";O[8]="\\b";O[9]="\\t";O[10]="\\n";O[11]="\\v";O[12]="\\f";O[13]="\\r";O[27]="\\e";O[34]='\\"';O[92]="\\\\";O[133]="\\N";O[160]="\\_";O[8232]="\\L";O[8233]="\\P";var ma=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],fa=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function ga(e,n){var t,r,i,s,a,o,l;if(n===null)return{};for(t={},r=Object.keys(n),i=0,s=r.length;i<s;i+=1)a=r[i],o=String(n[a]),a.slice(0,2)==="!!"&&(a="tag:yaml.org,2002:"+a.slice(2)),l=e.compiledTypeMap.fallback[a],l&&li.call(l.styleAliases,o)&&(o=l.styleAliases[o]),t[a]=o;return t}function _a(e){var n,t,r;if(n=e.toString(16).toUpperCase(),e<=255)t="x",r=2;else if(e<=65535)t="u",r=4;else if(e<=4294967295)t="U",r=8;else throw new D("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+t+L.repeat("0",r-n.length)+n}var va=1,ze=2;function ya(e){this.schema=e.schema||Jr,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=L.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=ga(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType=e.quotingType==='"'?ze:va,this.forceQuotes=e.forceQuotes||!1,this.replacer=typeof e.replacer=="function"?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Mr(e,n){for(var t=L.repeat(" ",n),r=0,i=-1,s="",a,o=e.length;r<o;)i=e.indexOf(`
`,r),i===-1?(a=e.slice(r),r=o):(a=e.slice(r,i+1),r=i+1),a.length&&a!==`
`&&(s+=t),s+=a;return s}function Mt(e,n){return`
`+L.repeat(" ",e.indent*n)}function ba(e,n){var t,r,i;for(t=0,r=e.implicitTypes.length;t<r;t+=1)if(i=e.implicitTypes[t],i.resolve(n))return!0;return!1}function pt(e){return e===ea||e===Xs}function We(e){return 32<=e&&e<=126||161<=e&&e<=55295&&e!==8232&&e!==8233||57344<=e&&e<=65533&&e!==Bt||65536<=e&&e<=1114111}function Rr(e){return We(e)&&e!==Bt&&e!==Zs&&e!==Ue}function jr(e,n,t){var r=Rr(e),i=r&&!pt(e);return(t?r:r&&e!==ui&&e!==di&&e!==ci&&e!==hi&&e!==pi)&&e!==Ht&&!(n===ht&&!i)||Rr(n)&&!pt(n)&&e===Ht||n===ht&&i}function $a(e){return We(e)&&e!==Bt&&!pt(e)&&e!==oa&&e!==da&&e!==ht&&e!==ui&&e!==di&&e!==ci&&e!==hi&&e!==pi&&e!==Ht&&e!==na&&e!==aa&&e!==ta&&e!==pa&&e!==la&&e!==ua&&e!==sa&&e!==ra&&e!==ia&&e!==ca&&e!==ha}function xa(e){return!pt(e)&&e!==ht}function Re(e,n){var t=e.charCodeAt(n),r;return t>=55296&&t<=56319&&n+1<e.length&&(r=e.charCodeAt(n+1),r>=56320&&r<=57343)?(t-55296)*1024+r-56320+65536:t}function mi(e){var n=/^\n* /;return n.test(e)}var fi=1,Rt=2,gi=3,_i=4,Ee=5;function wa(e,n,t,r,i,s,a,o){var l,h=0,m=null,p=!1,g=!1,v=r!==-1,w=-1,E=$a(Re(e,0))&&xa(Re(e,e.length-1));if(n||a)for(l=0;l<e.length;h>=65536?l+=2:l++){if(h=Re(e,l),!We(h))return Ee;E=E&&jr(h,m,o),m=h}else{for(l=0;l<e.length;h>=65536?l+=2:l++){if(h=Re(e,l),h===Ue)p=!0,v&&(g=g||l-w-1>r&&e[w+1]!==" ",w=l);else if(!We(h))return Ee;E=E&&jr(h,m,o),m=h}g=g||v&&l-w-1>r&&e[w+1]!==" "}return!p&&!g?E&&!a&&!i(e)?fi:s===ze?Ee:Rt:t>9&&mi(e)?Ee:a?s===ze?Ee:Rt:g?_i:gi}function ka(e,n,t,r,i){e.dump=(function(){if(n.length===0)return e.quotingType===ze?'""':"''";if(!e.noCompatMode&&(ma.indexOf(n)!==-1||fa.test(n)))return e.quotingType===ze?'"'+n+'"':"'"+n+"'";var s=e.indent*Math.max(1,t),a=e.lineWidth===-1?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-s),o=r||e.flowLevel>-1&&t>=e.flowLevel;function l(h){return ba(e,h)}switch(wa(n,o,e.indent,a,l,e.quotingType,e.forceQuotes&&!r,i)){case fi:return n;case Rt:return"'"+n.replace(/'/g,"''")+"'";case gi:return"|"+Ur(n,e.indent)+zr(Mr(n,s));case _i:return">"+Ur(n,e.indent)+zr(Mr(Ea(n,a),s));case Ee:return'"'+Sa(n)+'"';default:throw new D("impossible error: invalid scalar style")}})()}function Ur(e,n){var t=mi(e)?String(n):"",r=e[e.length-1]===`
`,i=r&&(e[e.length-2]===`
`||e===`
`),s=i?"+":r?"":"-";return t+s+`
`}function zr(e){return e[e.length-1]===`
`?e.slice(0,-1):e}function Ea(e,n){for(var t=/(\n+)([^\n]*)/g,r=(function(){var h=e.indexOf(`
`);return h=h!==-1?h:e.length,t.lastIndex=h,Wr(e.slice(0,h),n)})(),i=e[0]===`
`||e[0]===" ",s,a;a=t.exec(e);){var o=a[1],l=a[2];s=l[0]===" ",r+=o+(!i&&!s&&l!==""?`
`:"")+Wr(l,n),i=s}return r}function Wr(e,n){if(e===""||e[0]===" ")return e;for(var t=/ [^ ]/g,r,i=0,s,a=0,o=0,l="";r=t.exec(e);)o=r.index,o-i>n&&(s=a>i?a:o,l+=`
`+e.slice(i,s),i=s+1),a=o;return l+=`
`,e.length-i>n&&a>i?l+=e.slice(i,a)+`
`+e.slice(a+1):l+=e.slice(i),l.slice(1)}function Sa(e){for(var n="",t=0,r,i=0;i<e.length;t>=65536?i+=2:i++)t=Re(e,i),r=O[t],!r&&We(t)?(n+=e[i],t>=65536&&(n+=e[i+1])):n+=r||_a(t);return n}function Ca(e,n,t){var r="",i=e.tag,s,a,o;for(s=0,a=t.length;s<a;s+=1)o=t[s],e.replacer&&(o=e.replacer.call(t,String(s),o)),(Q(e,n,o,!1,!1)||typeof o>"u"&&Q(e,n,null,!1,!1))&&(r!==""&&(r+=","+(e.condenseFlow?"":" ")),r+=e.dump);e.tag=i,e.dump="["+r+"]"}function Br(e,n,t,r){var i="",s=e.tag,a,o,l;for(a=0,o=t.length;a<o;a+=1)l=t[a],e.replacer&&(l=e.replacer.call(t,String(a),l)),(Q(e,n+1,l,!0,!0,!1,!0)||typeof l>"u"&&Q(e,n+1,null,!0,!0,!1,!0))&&((!r||i!=="")&&(i+=Mt(e,n)),e.dump&&Ue===e.dump.charCodeAt(0)?i+="-":i+="- ",i+=e.dump);e.tag=s,e.dump=i||"[]"}function Aa(e,n,t){var r="",i=e.tag,s=Object.keys(t),a,o,l,h,m;for(a=0,o=s.length;a<o;a+=1)m="",r!==""&&(m+=", "),e.condenseFlow&&(m+='"'),l=s[a],h=t[l],e.replacer&&(h=e.replacer.call(t,l,h)),Q(e,n,l,!1,!1)&&(e.dump.length>1024&&(m+="? "),m+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),Q(e,n,h,!1,!1)&&(m+=e.dump,r+=m));e.tag=i,e.dump="{"+r+"}"}function La(e,n,t,r){var i="",s=e.tag,a=Object.keys(t),o,l,h,m,p,g;if(e.sortKeys===!0)a.sort();else if(typeof e.sortKeys=="function")a.sort(e.sortKeys);else if(e.sortKeys)throw new D("sortKeys must be a boolean or a function");for(o=0,l=a.length;o<l;o+=1)g="",(!r||i!=="")&&(g+=Mt(e,n)),h=a[o],m=t[h],e.replacer&&(m=e.replacer.call(t,h,m)),Q(e,n+1,h,!0,!0,!0)&&(p=e.tag!==null&&e.tag!=="?"||e.dump&&e.dump.length>1024,p&&(e.dump&&Ue===e.dump.charCodeAt(0)?g+="?":g+="? "),g+=e.dump,p&&(g+=Mt(e,n)),Q(e,n+1,m,!0,p)&&(e.dump&&Ue===e.dump.charCodeAt(0)?g+=":":g+=": ",g+=e.dump,i+=g));e.tag=s,e.dump=i||"{}"}function Yr(e,n,t){var r,i,s,a,o,l;for(i=t?e.explicitTypes:e.implicitTypes,s=0,a=i.length;s<a;s+=1)if(o=i[s],(o.instanceOf||o.predicate)&&(!o.instanceOf||typeof n=="object"&&n instanceof o.instanceOf)&&(!o.predicate||o.predicate(n))){if(t?o.multi&&o.representName?e.tag=o.representName(n):e.tag=o.tag:e.tag="?",o.represent){if(l=e.styleMap[o.tag]||o.defaultStyle,oi.call(o.represent)==="[object Function]")r=o.represent(n,l);else if(li.call(o.represent,l))r=o.represent[l](n,l);else throw new D("!<"+o.tag+'> tag resolver accepts not "'+l+'" style');e.dump=r}return!0}return!1}function Q(e,n,t,r,i,s,a){e.tag=null,e.dump=t,Yr(e,t,!1)||Yr(e,t,!0);var o=oi.call(e.dump),l=r,h;r&&(r=e.flowLevel<0||e.flowLevel>n);var m=o==="[object Object]"||o==="[object Array]",p,g;if(m&&(p=e.duplicates.indexOf(t),g=p!==-1),(e.tag!==null&&e.tag!=="?"||g||e.indent!==2&&n>0)&&(i=!1),g&&e.usedDuplicates[p])e.dump="*ref_"+p;else{if(m&&g&&!e.usedDuplicates[p]&&(e.usedDuplicates[p]=!0),o==="[object Object]")r&&Object.keys(e.dump).length!==0?(La(e,n,e.dump,i),g&&(e.dump="&ref_"+p+e.dump)):(Aa(e,n,e.dump),g&&(e.dump="&ref_"+p+" "+e.dump));else if(o==="[object Array]")r&&e.dump.length!==0?(e.noArrayIndent&&!a&&n>0?Br(e,n-1,e.dump,i):Br(e,n,e.dump,i),g&&(e.dump="&ref_"+p+e.dump)):(Ca(e,n,e.dump),g&&(e.dump="&ref_"+p+" "+e.dump));else if(o==="[object String]")e.tag!=="?"&&ka(e,e.dump,n,s,l);else{if(o==="[object Undefined]")return!1;if(e.skipInvalid)return!1;throw new D("unacceptable kind of an object to dump "+o)}e.tag!==null&&e.tag!=="?"&&(h=encodeURI(e.tag[0]==="!"?e.tag.slice(1):e.tag).replace(/!/g,"%21"),e.tag[0]==="!"?h="!"+h:h.slice(0,18)==="tag:yaml.org,2002:"?h="!!"+h.slice(18):h="!<"+h+">",e.dump=h+" "+e.dump)}return!0}function Ta(e,n){var t=[],r=[],i,s;for(jt(e,t,r),i=0,s=r.length;i<s;i+=1)n.duplicates.push(t[r[i]]);n.usedDuplicates=new Array(s)}function jt(e,n,t){var r,i,s;if(e!==null&&typeof e=="object")if(i=n.indexOf(e),i!==-1)t.indexOf(i)===-1&&t.push(i);else if(n.push(e),Array.isArray(e))for(i=0,s=e.length;i<s;i+=1)jt(e[i],n,t);else for(r=Object.keys(e),i=0,s=r.length;i<s;i+=1)jt(e[r[i]],n,t)}function Fa(e,n){n=n||{};var t=new ya(n);t.noRefs||Ta(e,t);var r=e;return t.replacer&&(r=t.replacer.call({"":r},"",r)),Q(t,0,r,!0,!0)?t.dump+`
`:""}var Ia=Fa,Pa={dump:Ia};function Yt(e,n){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+n+" instead, which is now safe by default.")}}var vi=ai.load,el=ai.loadAll,ft=Pa.dump;var tl=Yt("safeLoad","load"),rl=Yt("safeLoadAll","loadAll"),il=Yt("safeDump","dump");var K=class extends b{constructor(){super(...arguments);this.value=null;this._mode="form";this._yamlText="";this._yamlError=null}willUpdate(t){super.willUpdate?.(t),t.has("value")&&this._mode==="form"&&(this._yamlText=ft(this.value??{}))}connectedCallback(){super.connectedCallback(),this._yamlText=ft(this.value??{});let t=this.value&&typeof this.value=="object"?this.value.script:null,r=this._fieldsFor(t);t&&(!r||Object.keys(r).length===0)&&(this._mode="yaml")}_setMode(t){t==="form"&&this._yamlError!==null||(t==="yaml"&&(this._yamlText=ft(this.value??{})),this._mode=t)}_onYamlInput(t){this._yamlText=t;let r;try{r=vi(t)}catch(o){this._yamlError=o.message;return}if(r==null){this._yamlError=null,this._emit(null);return}if(typeof r!="object"||Array.isArray(r)){this._yamlError="Expected an object";return}let i=r,s=i.script;if(typeof s!="string"||!s.startsWith("script.")){this._yamlError="`script` must be a 'script.<name>' string";return}let a=i.args;if(a!==void 0&&(typeof a!="object"||Array.isArray(a)||a===null)){this._yamlError="`args` must be an object if present";return}this._yamlError=null,this._emit({script:s,args:a??{}})}_emit(t){this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_scriptIds(){let t=this.hass?.services;return Object.keys(t?.script??{}).sort().map(i=>`script.${i}`)}_label(t){let i=this.hass?.states?.[t]?.attributes?.friendly_name;return typeof i=="string"&&i?i:t}_fieldsFor(t){if(!t)return;let r=t.replace(/^script\./,"");return this.hass?.services?.script?.[r]?.fields}_defaultArgs(t){let r=this._fieldsFor(t)??{},i={};for(let[s,a]of Object.entries(r))a&&Object.prototype.hasOwnProperty.call(a,"default")&&(i[s]=a.default);return i}_pickerSchema(){return[{name:"script",selector:{select:{mode:"dropdown",options:this._scriptIds().map(t=>({value:t,label:this._label(t)}))}}}]}_pickScript(t){if(!t){this._emit(null);return}this._emit({script:t,args:this._defaultArgs(t)})}_argsSchema(){let t=this._fieldsFor(this.value&&typeof this.value=="object"?this.value.script:null);return t?Object.entries(t).map(([r,i])=>({name:r,required:i.required,description:i.description?{suffix:i.description}:void 0,selector:i.selector??{text:{}}})):[]}_updateArgs(t){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:t})}render(){let t=this.value&&typeof this.value=="object"?this.value.script:null,r=this._argsSchema(),i=(this.value&&typeof this.value=="object"?this.value.args:{})??{},s=r.length>0;return u`
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
          ${this._renderArgs(r,i)}
        </div>
      `:""}
      ${t&&this._mode==="yaml"?this._renderYaml():""}
    `}_renderYaml(){let t=r=>{let i=r.target.value??r.detail?.value??"";this._onYamlInput(i)};return customElements.get("ha-code-editor")?u`
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
        @value-changed=${i=>{i.stopPropagation(),this._updateArgs(i.detail.value)}}
      ></ha-form>`:u`${t.map(i=>{let s=r[i.name];return u`
        <label style="display:block;margin-bottom:0.4rem;">
          <span style="display:inline-block;min-width:8em;">${i.name}</span>
          <input
            .value=${s==null?"":String(s)}
            @change=${a=>{let o=a.target.value,l={...r,[i.name]:o};this._updateArgs(l)}}
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
  `,c([f({attribute:!1})],K.prototype,"hass",2),c([f({attribute:!1})],K.prototype,"value",2),c([_()],K.prototype,"_mode",2),c([_()],K.prototype,"_yamlText",2),c([_()],K.prototype,"_yamlError",2),K=c([x("ambience-script-predicate-input")],K);var Oa=["dawn","sunrise","noon","sunset","dusk","midnight"],ye=class extends b{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(t){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_onKindChange(t){let r=t.target.value;r!==this.value.kind&&(r==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(t){if(this.value.kind!=="time")return;let r=t.target.value,[i,s]=r.split(":").map(a=>parseInt(a,10));Number.isNaN(i)||Number.isNaN(s)||this._emit({kind:"time",hh:i,mm:s})}_onAnchorChange(t){if(this.value.kind!=="sun")return;let r=t.target.value;this._emit({kind:"sun",anchor:r,offset_min:this.value.offset_min})}_onOffsetChange(t){if(this.value.kind!=="sun")return;let r=parseInt(t.target.value,10);Number.isNaN(r)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:r})}_renderTime(t){let r=`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;return u`<input type="time" .value=${r} @input=${this._onTimeChange} />`}_renderSun(t){let r=Na(t.offset_min,this.hass);return u`
      <select @change=${this._onAnchorChange}>
        ${Oa.map(i=>u`<option value=${i} ?selected=${i===t.anchor}>${we(this.hass,i)}</option>`)}
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
    `}};ye.styles=$`
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
  `,c([f({attribute:!1})],ye.prototype,"hass",2),c([f({attribute:!1})],ye.prototype,"value",2),ye=c([x("ambience-time-endpoint")],ye);function Na(e,n){if(e===0)return"";let t=Math.abs(e),r=e<0?"\u2212":"+";if(t%60===0){let i=t/60,s=i===1?d(n,"ui.unit_hour","hour"):d(n,"ui.unit_hours","hours");return`${r}${i} ${s}`}return`${r}${t} ${d(n,"ui.unit_min","min")}`}var Be={kind:"any"},yi={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},V=class extends b{constructor(){super(...arguments);this.value=null;this._entries=[Be];this._openIdx=0}willUpdate(t){t.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[Be]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(r=>{let i=this._entries[this._openIdx];if(!i)return;let s=i.kind==="any"?"__any__":i.kind==="range"?"__custom__":i.period;r.value!==s&&(r.value=s)})}_predicateToEntries(t){return t===null?[Be]:(Array.isArray(t)?t:[t]).map(i=>"period"in i?{kind:"period",period:i.period}:{kind:"range",from:i.from,to:i.to})}_emit(t){let r=t.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),i=r.length===0?null:r.length===1?r[0]:r;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:i},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let t=Object.keys(this.periods.builtins),r=Object.keys(this.periods.custom).filter(s=>!(s in this.periods.builtins)),i=new Set(this.periods.hidden);return[...t.filter(s=>!i.has(s)),...r]}_onSelectChange(t,r){let i=r.target.value,s=[...this._entries];i==="__any__"?s[t]=Be:i==="__custom__"?s[t]={kind:"range",...yi}:s[t]={kind:"period",period:i},this._entries=s,this._emit(s)}_onRangeChange(t,r,i){i.stopPropagation();let s=this._entries[t];if(!s||s.kind!=="range")return;let a=[...this._entries];a[t]={...s,[r]:i.detail.value},this._entries=a,this._emit(a)}_onRemove(t){let r=this._entries.filter((i,s)=>s!==t);this._entries=r.length===0?[Be]:r,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):t<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let t=[...this._entries,{kind:"range",...yi}];this._entries=t,this._openIdx=t.length-1,this._emit(t)}_onChipClick(t){this._openIdx=t}_renderChip(t,r){let i;return t.kind==="any"?i=d(this.hass,"ui.any_placeholder","(any)"):t.kind==="period"?i=ot({period:t.period},{hass:this.hass,periods:this.periods}):i=ot({from:t.from,to:t.to},{hass:this.hass,periods:this.periods}),u`
      <div class="summary-chip" @click=${()=>this._onChipClick(r)}>
        <span class="chip-label">${i}</span>
        ${this._entries.length>1?u`<button class="remove" @click=${s=>{s.stopPropagation(),this._onRemove(r)}} title=${d(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(t,r,i){let s=this._effectiveIds(),a=this.periods?.custom??{};return u`
      <div class="entry">
        <div class="entry-header">
          <select @change=${o=>this._onSelectChange(r,o)}>
            ${i?u`<option value="__any__">${d(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${d(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${s.map(o=>u`<option value=${o}>
                ${ge(this.hass,o,a)}${a[o]&&!this.periods?.builtins[o]?d(this.hass,"ui.custom_suffix"," (custom)"):""}
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
    `}render(){let t=this._entries.some(i=>i.kind!=="any"),r=this._entries.length>1;return u`
      ${this._entries.map((i,s)=>r&&s!==this._openIdx?this._renderChip(i,s):this._renderEntry(i,s,s===0))}
      ${t?u`<button class="add-btn" @click=${this._onAdd}>${d(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
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
  `,c([f({attribute:!1})],V.prototype,"value",2),c([f({attribute:!1})],V.prototype,"periods",2),c([f({attribute:!1})],V.prototype,"hass",2),c([_()],V.prototype,"_entries",2),c([_()],V.prototype,"_openIdx",2),V=c([x("ambience-time-of-day-input")],V);function bi(e){if(typeof e!="string")return!1;let n=e.split(",").map(t=>t.trim()).filter(t=>t!=="");if(n.length===0)return!1;for(let t of n)if(t.includes("-")){let r=t.split("-").map(a=>a.trim());if(r.length!==2||!/^\d+$/.test(r[0])||!/^\d+$/.test(r[1]))return!1;let i=Number(r[0]),s=Number(r[1]);if(!(i>=1&&i<=s&&s<=31))return!1}else{if(!/^\d+$/.test(t))return!1;let r=Number(t);if(!(r>=1&&r<=31))return!1}return!0}var Gt=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Da=new Set(["workday","holiday"]),Ha=new Set(["first_workday","last_workday"]),Ma=[31,29,31,30,31,30,31,31,30,31,30,31];function Ye(e){return Ma[e-1]??31}function qt(e){switch(e){case"weekday":return{kind:e,days:[]};case"day_of_month":return{kind:e,days:""};case"date":return{kind:e,month:1,day:1};case"date_range":return{kind:e,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:e}}}var ue=class extends b{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=t=>t.name==="days"?d(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=t=>{switch(t.name){case"kind":return d(this.hass,"ui.field_kind","Kind");case"days":return d(this.hass,"ui.field_days_of_month","Days of month");case"month":return d(this.hass,"ui.field_month","Month");case"day":return d(this.hass,"ui.field_day","Day");case"from_month":return d(this.hass,"ui.field_from_month","From month");case"from_day":return d(this.hass,"ui.field_from_day","From day");case"to_month":return d(this.hass,"ui.field_to_month","To month");case"to_day":return d(this.hass,"ui.field_to_day","To day");default:return t.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(t){let r=t.include.length===0&&t.exclude.length===0;this.value=r?null:t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_addItem(t,r){let i=this._current();i[t]=[...i[t],qt(r)],this._emit(i)}_removeItem(t,r){let i=this._current();i[t]=i[t].filter((s,a)=>a!==r),this._emit(i)}_updateItem(t,r,i){let s=this._current();s[t]=s[t].map((a,o)=>o===r?i:a),this._emit(s)}_kindDisabled(t){return!!(Da.has(t)&&!this.dayConfig.workday_sensor||Ha.has(t)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:Gt.map(t=>({value:t,label:Ze(this.hass,t),disabled:this._kindDisabled(t)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(t=>({value:String(t),label:ke(this.hass,t)}))}}}_daySelector(t){return{number:{min:1,max:Ye(t),mode:"box"}}}_bodySchema(t){return t.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(t){return t.kind==="day_of_month"?{days:t.days}:{}}_bodyPatch(t,r){return t.kind==="day_of_month"?{kind:"day_of_month",days:String(r.days??"")}:t}_setDatePart(t,r,i){let s=Number(i);if(!Number.isFinite(s)||s<1)return t;if(t.kind==="date"){let{month:a,day:o}=t;return r==="month"&&(a=s),r==="day"&&(o=s),{kind:"date",month:a,day:Math.min(o,Ye(a))}}if(t.kind==="date_range"){let a={...t.from},o={...t.to};return r==="from_month"&&(a.month=s),r==="from_day"&&(a.day=s),r==="to_month"&&(o.month=s),r==="to_day"&&(o.day=s),a.day=Math.min(a.day,Ye(a.month)),o.day=Math.min(o.day,Ye(o.month)),{kind:"date_range",from:a,to:o}}return t}_onKindForm(t,r,i){let s=i.kind;if(!s){this._removeItem(t,r);return}if(this._kindDisabled(s))return;let a=this._current()[t][r];a&&a.kind===s||this._updateItem(t,r,qt(s))}_dayOfMonthError(t){return t.trim()===""||bi(t)?null:d(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(t,r,i,s){this._updateItem(t,r,this._bodyPatch(i,s))}_renderWeekday(t,r,i){return u`${[0,1,2,3,4,5,6].map(s=>u`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${i.days.includes(s)}
          @change=${a=>{let l=a.target.checked?[...i.days,s].sort((h,m)=>h-m):i.days.filter(h=>h!==s);this._updateItem(t,r,{kind:"weekday",days:l})}}
        />${Xe(this.hass,s)}
      </label>
    `)}`}_renderKindPicker(t,r,i){return customElements.get("ha-form")?u`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:i.kind}}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${s=>{s.stopPropagation(),this._onKindForm(t,r,s.detail.value)}}
      ></ha-form>`:u`
      <select
        class="kind"
        .value=${i.kind}
        @change=${s=>{let a=s.target.value;this._kindDisabled(a)||a===i.kind||this._updateItem(t,r,qt(a))}}
      >
        ${Gt.map(s=>u`<option value=${s} ?disabled=${this._kindDisabled(s)}>${Ze(this.hass,s)}</option>`)}
      </select>
    `}_renderItemBody(t,r,i){if(i.kind==="weekday")return this._renderWeekday(t,r,i);if(customElements.get("ha-form")){if(i.kind==="date")return this._renderDateRow(t,r,i,"month","day",i.month,i.day);if(i.kind==="date_range")return u`
          ${this._renderDateRow(t,r,i,"from_month","from_day",i.from.month,i.from.day)}
          ${this._renderDateRow(t,r,i,"to_month","to_day",i.to.month,i.to.day)}
        `;let s=this._bodySchema(i);if(!s)return u``;let a=i.kind==="day_of_month"?this._dayOfMonthError(i.days):null;return u`<ha-form
        .hass=${this.hass}
        .schema=${s}
        .data=${this._bodyData(i)}
        .error=${a?{days:a}:void 0}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${o=>{o.stopPropagation(),this._onBodyForm(t,r,i,o.detail.value)}}
      ></ha-form>`}return this._renderNativeBody(t,r,i)}_renderDateRow(t,r,i,s,a,o,l){let h=(m,p)=>{this._updateItem(t,r,this._setDatePart(i,m,p[m]))};return u`
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
    `}_renderNativeBody(t,r,i){if(i.kind==="day_of_month"){let o=this._dayOfMonthError(i.days);return u`<input
        type="text" placeholder=${d(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${i.days}
        @change=${l=>this._updateItem(t,r,this._bodyPatch(i,{days:l.target.value}))}
      />${o?u`<div class="field-error">${o}</div>`:""}`}let s=(o,l)=>u`
      <input type="number" min="1" max="12" .value=${String(l)}
        @change=${h=>this._updateItem(t,r,this._setDatePart(i,o,h.target.value))} />
    `,a=(o,l,h)=>u`
      <input type="number" min="1" max=${String(Ye(l))} .value=${String(h)}
        @change=${m=>this._updateItem(t,r,this._setDatePart(i,o,m.target.value))} />
    `;return i.kind==="date"?u`${s("month",i.month)} / ${a("day",i.month,i.day)}`:i.kind==="date_range"?u`
        <span>${d(this.hass,"ui.from","from")}</span>
        ${s("from_month",i.from.month)} / ${a("from_day",i.from.month,i.from.day)}
        <span>${d(this.hass,"ui.to","to")}</span>
        ${s("to_month",i.to.month)} / ${a("to_day",i.to.month,i.to.day)}
      `:u``}_renderAddPicker(t){let r=t==="include"?d(this.hass,"ui.add_include_item","+ Add include item"):d(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let i=()=>r;return u`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${i}
        @value-changed=${s=>{s.stopPropagation();let a=s.detail.value.kind;a&&!this._kindDisabled(a)&&this._addItem(t,a)}}
      ></ha-form>`}return u`
      <select
        .value=${""}
        @change=${i=>{let s=i.target.value;s&&(this._addItem(t,s),i.target.value="")}}
      >
        <option value="">${r}</option>
        ${Gt.map(i=>u`<option value=${i} ?disabled=${this._kindDisabled(i)}>${Ze(this.hass,i)}</option>`)}
      </select>
    `}_renderItem(t,r,i){return u`
      <div class="item">
        ${this._renderKindPicker(t,r,i)}
        <div class="body">${this._renderItemBody(t,r,i)}</div>
        <button class="remove" title=${d(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(t,r)}>✕</button>
      </div>
    `}_renderSection(t,r){return u`
      <div class="section">
        <h4>${t==="include"?d(this.hass,"ui.include","Include"):d(this.hass,"ui.exclude","Exclude")}</h4>
        ${r.length===0&&t==="include"?u`<div class="hint">${d(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${r.map((i,s)=>this._renderItem(t,s,i))}
        ${this._renderAddPicker(t)}
      </div>
    `}render(){let{include:t,exclude:r}=this._current();return u`
      ${this._renderSection("include",t)}
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
  `,c([f({attribute:!1})],ue.prototype,"hass",2),c([f({attribute:!1})],ue.prototype,"value",2),c([f({attribute:!1})],ue.prototype,"dayConfig",2),ue=c([x("ambience-day-predicate-input")],ue);var $i=["temperature","apparent_temperature","humidity","wind_speed","pressure"],xi=["<","<=",">",">="],wi={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},X=class extends b{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(t){let r=t.groups.length===0&&t.thresholds.length===0;this.value=r?null:t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setGroups(t){this._emit({...this._current(),groups:t})}_addThreshold(){let t=this._current();t.thresholds=[...t.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(t)}_updateThreshold(t,r){let i=this._current();i.thresholds=i.thresholds.map((s,a)=>a===t?r:s),this._emit(i)}_removeThreshold(t){let r=this._current();r.thresholds=r.thresholds.filter((i,s)=>s!==t),this._emit(r)}_attributeSchema(t){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:$i.map(r=>({value:r,label:Me(this.hass,r)}))}}}]}_opSchema(t){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:xi.map(r=>({value:r,label:wi[r]}))}}}]}_entityState(){let t=this.weatherEntity;return t?this.hass?.states?.[t]:void 0}_valueSchema(t,r){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:Tt(this.hass,r,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(t=>({value:t.id,label:t.label}))}}}]}_renderGroups(t){return customElements.get("ha-form")?u`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{groups:t}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setGroups(r.detail.value.groups??[])}}
      ></ha-form>`:u`${this.groups.map(r=>u`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${t.includes(r.id)}
          @change=${i=>{let s=i.target.checked;this._setGroups(s?[...t,r.id]:t.filter(a=>a!==r.id))}} />${r.label}
      </label>`)}`}_renderAttributeSelect(t,r){return customElements.get("ha-form")?u`<ha-form
        class="attr-form"
        .hass=${this.hass}
        .schema=${this._attributeSchema(t)}
        .data=${{attribute:r.attribute}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation();let s=i.detail.value.attribute;s&&this._updateThreshold(t,{...r,attribute:s})}}
      ></ha-form>`:u`<select
      @change=${i=>this._updateThreshold(t,{...r,attribute:i.target.value})}>
      ${$i.map(i=>u`<option value=${i} ?selected=${i===r.attribute}>${Me(this.hass,i)}</option>`)}
    </select>`}_renderOpSelect(t,r){return customElements.get("ha-form")?u`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(t)}
        .data=${{op:r.op}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation();let s=i.detail.value.op;s&&this._updateThreshold(t,{...r,op:s})}}
      ></ha-form>`:u`<select
      @change=${i=>this._updateThreshold(t,{...r,op:i.target.value})}>
      ${xi.map(i=>u`<option value=${i} ?selected=${i===r.op}>${wi[i]}</option>`)}
    </select>`}_renderValueInput(t,r){if(customElements.get("ha-form"))return u`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(t,r.attribute)}
        .data=${{value:r.value}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let a=s.detail.value.value;typeof a=="number"&&Number.isFinite(a)&&this._updateThreshold(t,{...r,value:a})}}
      ></ha-form>`;let i=Tt(this.hass,r.attribute,this._entityState());return u`<span class="value-wrap">
      <input type="number" .value=${String(r.value)}
        @change=${s=>{let a=Number(s.target.value);Number.isFinite(a)&&this._updateThreshold(t,{...r,value:a})}} />
      <span class="unit">${i}</span>
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
        ${r.map((i,s)=>this._renderThreshold(s,i))}
        <button class="add" @click=${()=>this._addThreshold()}>${d(this.hass,"ui.add_threshold","+ Add threshold")}</button>
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
  `,c([f({attribute:!1})],X.prototype,"hass",2),c([f({attribute:!1})],X.prototype,"value",2),c([f({attribute:!1})],X.prototype,"groups",2),c([f({attribute:!1})],X.prototype,"weatherEntity",2),X=c([x("ambience-weather-predicate-input")],X);var I=class extends b{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[]}async updated(t){if(t.has("value")){let i=t.get("value")?.entity_id,s=this.value.entity_id;if(s&&s!==i&&this.hass)try{let a=await Sr(this.hass,s);this._knownStates=a.states}catch{this._knownStates=[]}}}_normalize(t){let r={...t};return r.attribute===""&&(r.attribute=null),r.for&&r.for.h===0&&r.for.m===0&&r.for.s===0&&(r.for=null),r}_emit(t){let r=this._normalize(t);this.value=r,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r},bubbles:!0,composed:!0}))}_autoFlipOp(t){let r=this._isNumericTargetFor(t),i=this._isNumericOp(t.kind);return r&&!i?{...t,kind:">"}:!r&&i?{...t,kind:"is"}:t}_setEntity(t){this._emit(this._autoFlipOp({...this.value,entity_id:t,states:[],attribute:null}))}_setAttribute(t){this._emit(this._autoFlipOp({...this.value,attribute:t}))}_setOp(t){this._emit({...this.value,kind:t})}_setStates(t){this._emit({...this.value,states:t})}_setValueAt(t,r){if(this._isNumericOp(this.value.kind)){this._setStates([r]);return}let i=this.value.states.slice();r===""?i.splice(t,1):i[t]=r,this._setStates(i)}_addValue(t){t&&this._setStates([...this.value.states,t])}_removeValueAt(t){let r=this.value.states.slice();r.splice(t,1),this._setStates(r)}_setForDuration(t){this._emit({...this.value,for:t})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(t){if(!t)return[];let i=this.hass?.states?.[t]?.attributes;return i?Object.keys(i).sort():[]}_attributeSchema(){let t=this._knownAttributesFor(this.value.entity_id);return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:I._STATE_SENTINEL,label:I._STATE_SENTINEL},...t.map(r=>({value:r,label:r}))]}}}]}_attributeData(){let t=this.value.attribute;return t?{attribute:t}:{attribute:I._STATE_SENTINEL}}_setAttributeFromHaForm(t){t===I._STATE_SENTINEL?this._setAttribute(""):this._setAttribute(t)}_isNumericOp(t){return I._NUMERIC_OPS.includes(t)}_isNumericTargetFor(t){let i=this.hass?.states?.[t.entity_id];if(!i)return!1;if(t.attribute)return typeof i.attributes?.[t.attribute]=="number";let s=i.state;return typeof s!="string"||s===""||s==="unknown"||s==="unavailable"?!1:Number.isFinite(Number(s))}_opSchema(){let t=this._isNumericTargetFor(this.value)?[...I._NUMERIC_OPS]:["is","is_not"];return t.includes(this.value.kind)||t.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:t.map(r=>({value:r,label:B(this.hass,r)}))}}}]}_currentAttributeValue(){return this.value.attribute?this.hass?.states?.[this.value.entity_id]?.attributes?.[this.value.attribute]:void 0}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let t;if(this.value.attribute){let r=this._currentAttributeValue();t=r==null?[]:[String(r)]}else t=this._knownStates;return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:t.map(r=>({value:r,label:r}))}}}]}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let t=this.value.for??{h:0,m:0,s:0};return{duration:{hours:t.h,minutes:t.m,seconds:t.s}}}_setForFromHaForm(t){this._setForDuration({h:t?.hours??0,m:t?.minutes??0,s:t?.seconds??0})}_renderEntity(){return customElements.get("ha-form")?u`<ha-form
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
    </select>`}_renderValueRow(t,r){let i=r===-1,s=i?l=>this._addValue(l):l=>this._setValueAt(r,l),a=this._isNumericOp(this.value.kind),o=a?{value:t===""?void 0:Number(t)}:{value:t};return customElements.get("ha-form")?u`
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
          placeholder=${i?d(this.hass,"ui.state_add_value","+ Add state"):""}
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
    `}};I.styles=$`
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
  `,I._STATE_SENTINEL="State",I._NUMERIC_OPS=[">",">=","<","<="],c([f({attribute:!1})],I.prototype,"hass",2),c([f({attribute:!1})],I.prototype,"value",2),c([_()],I.prototype,"_knownStates",2),I=c([x("ambience-state-expr-atom")],I);function Kt(e,n){return e===null||n===null||e.length!==n.length?!1:e.every((t,r)=>t===n[r])}var M=class extends b{constructor(){super(...arguments);this.path=[];this._dragOver=!1;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(t,r={}){this.dispatchEvent(new CustomEvent(t,{detail:{path:this.path,...r},bubbles:!0,composed:!0}))}_atomIsComplete(t){return!!t.entity_id&&t.states.some(r=>r!=="")}_isErrorTarget(){return Kt(this.path,this.errorPath)}_onDragStart(t){if(this.path.length===0){t.preventDefault();return}let r=t.target;if(r&&r.closest("button, select, input, textarea, ha-form")){t.preventDefault();return}t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("application/x-ambience-path",JSON.stringify(this.path)))}_onDragOver(t){this.path.length!==0&&(t.preventDefault(),t.stopPropagation(),t.dataTransfer&&(t.dataTransfer.dropEffect="move"),this._dragOver=!0)}_onDragLeave(t){t.stopPropagation(),this._dragOver=!1}_onDrop(t){if(this.path.length===0||(t.preventDefault(),t.stopPropagation(),this._dragOver=!1,!t.dataTransfer))return;let r=t.dataTransfer.getData("application/x-ambience-path");if(!r)return;let i;try{i=JSON.parse(r)}catch{return}!Array.isArray(i)||i.every(s=>typeof s=="number")===!1||Kt(i,this.path)||this.dispatchEvent(new CustomEvent("node-move",{detail:{from:i,to:this.path},bubbles:!0,composed:!0}))}_renderAtomCard(t,r){let i=this._atomIsComplete(t),s=Kt(this.path,this.openPath),a=i?It(t,{hass:this.hass}):d(this.hass,"ui.state_new_condition","(new condition)");return u`
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
            @click=${o=>{o.stopPropagation(),this._emit("node-toggle-not")}}>${B(this.hass,"not")}</button>
          <span class="summary ${i?"":"placeholder"}">${a}</span>
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
    `}_renderChildRow(t,r){let i=[...this.path,r];return u`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${t}
        .path=${i}
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
            <option value="and" ?selected=${t.kind==="and"}>${B(this.hass,"and")}</option>
            <option value="or"  ?selected=${t.kind==="or"} >${B(this.hass,"or")}</option>
          </select>
          <button class="unwrap"
            title=${d(this.hass,"ui.state_unwrap_group","Remove these parens (promote children to parent)")}
            @click=${()=>this._emit("node-unwrap")}>✕</button>
        </div>
        <div class="group-children">
          ${t.items.map((r,i)=>this._renderChildRow(r,i))}
        </div>
        <div class="actions">
          <button @click=${()=>this._emit("node-add-child")}>
            + ${d(this.hass,"ui.state_add_condition","Add condition")}
          </button>
        </div>
      </div>
    `}render(){let t=this.value.kind==="not",r=t?this.value.item:this.value;return r.kind==="and"||r.kind==="or"?this._renderGroupWithExternalNot(r,t):this._renderAtomCard(r,t)}_renderGroupWithExternalNot(t,r){let i=this.path.length===0;return u`
      <div class="group-wrap">
        ${i?"":u`<button class="not-toggle external ${r?"on":""}"
          title=${d(this.hass,"ui.state_not_toggle","Negate (NOT)")}
          @click=${()=>this._emit("node-toggle-not")}>${B(this.hass,"not")}</button>`}
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
  `,c([f({attribute:!1})],M.prototype,"hass",2),c([f({attribute:!1})],M.prototype,"value",2),c([f({attribute:!1})],M.prototype,"path",2),c([_()],M.prototype,"_dragOver",2),c([f({attribute:!1})],M.prototype,"openPath",2),c([f({attribute:!1})],M.prototype,"errorPath",2),c([f({attribute:!1})],M.prototype,"errorMessage",2),M=c([x("ambience-state-expr-node")],M);function Vt(e,n){return e===null||n===null||e.length!==n.length?!1:e.every((t,r)=>t===n[r])}var Z=class extends b{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._onNodeMove=t=>{t.stopPropagation(),this._moveAt(t.detail.from,t.detail.to)};this._onNodeChange=t=>{t.stopPropagation(),this._replaceAt(t.detail.path,t.detail.value)};this._onNodeRemove=t=>{t.stopPropagation(),this._removeAt(t.detail.path)};this._onNodeWrap=t=>{t.stopPropagation(),this._wrapAt(t.detail.path)};this._onNodeAddChild=t=>{t.stopPropagation(),this._addChildAt(t.detail.path,"is")};this._onNodeToggleNot=t=>{t.stopPropagation(),this._toggleNotAt(t.detail.path)};this._onNodeSetOp=t=>{t.stopPropagation(),this._setGroupOpAt(t.detail.path,t.detail.op)};this._onNodeUnwrap=t=>{t.stopPropagation(),this._unwrapAt(t.detail.path)};this._onNodeOpen=t=>{if(t.stopPropagation(),this._openPath!==null){let r=this._atomAt(this._openPath);if(r&&this._atomError(r)!==null){this._showError=!0;return}}this._openPath!==null&&Vt(this._openPath,t.detail.path)?this._openPath=null:this._openPath=t.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-move",this._onNodeMove)}_emit(t){this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(t,r){let i=this._patch(this.value,t,()=>r);this._emit(i)}_removeAt(t){if(t.length===0){this._emit(null);return}let r=this._patch(this.value,t,()=>null);this._emit(r)}_wrapAt(t){let r=null;if(t.length>0){let a=this._nodeAt(t.slice(0,-1));a&&(a.kind==="and"||a.kind==="or")&&(r=a.kind)}let i=r==="and"?"or":"and",s=this._patch(this.value,t,a=>a&&{kind:i,items:[a]});this._emit(s)}_nodeAt(t){return this._walkNode(this.value,t)}_moveAt(t,r){if(this._isPrefix(t,r)||t.length===0||r.length===0)return;let i=this._nodeAt(t);if(!i)return;let s=this._rewriteForMove(this.value,[],t,r,i);this._emit(s)}_isPrefix(t,r){return t.length>r.length?!1:t.every((i,s)=>i===r[s])}_rewriteForMove(t,r,i,s,a){if(!t)return t;if(t.kind==="not"){let g=this._rewriteForMove(t.item,r,i,s,a);return g==null?null:{kind:"not",item:g}}if(t.kind!=="and"&&t.kind!=="or")return t;let o=i.slice(0,-1),l=s.slice(0,-1),h=Vt(r,o),m=Vt(r,l),p=[];if(t.items.forEach((g,v)=>{let w=[...r,v];if(h&&v===i[i.length-1])return;let E=this._rewriteForMove(g,w,i,s,a);E!==null&&p.push(E)}),m){let g=s[s.length-1];p.splice(g,0,a)}return p.length===0?null:{...t,items:p}}_walkNode(t,r){return t?t.kind==="not"?this._walkNode(t.item,r):r.length===0?t:t.kind==="and"||t.kind==="or"?this._walkNode(t.items[r[0]]??null,r.slice(1)):null:null}_addChildAt(t,r){let i=null,s=this._patch(this.value,t,a=>{if(a&&(a.kind==="and"||a.kind==="or")){let o=[...a.items,this._emptyAtom()];return i=[...t,o.length-1],{...a,items:o}}return a});i!==null&&(this._openPath=i),this._emit(s)}_toggleNotAt(t){let r=this._patch(this.value,t,i=>i&&(i.kind==="not"?i.item:{kind:"not",item:i}));this._emit(r)}_setGroupOpAt(t,r){let i=this._patch(this.value,t,s=>{if(!s)return s;let a=null;if(s.kind==="and"||s.kind==="or")a=s;else if(s.kind==="not"){let o=s.item;(o.kind==="and"||o.kind==="or")&&(a=o)}return a?{kind:r,items:a.items}:s});this._emit(i)}_patch(t,r,i){if(r.length===0)return i(t);if(t==null)return t;let[s,...a]=r;if(t.kind==="and"||t.kind==="or"){let o=t.items.length,l=t.items.slice(),h=this._patch(l[s],a,i);if(h===null?l.splice(s,1):l[s]=h,l.length<o){if(l.length===0)return null;if(l.length===1)return l[0]}return{...t,items:l}}if(t.kind==="not"){let o=this._patch(t.item,r,i);return o==null?null:{kind:"not",item:o}}return t}_atomAt(t){return this._walk(this.value,t)}_walk(t,r){return t?t.kind==="not"?this._walk(t.item,r):r.length===0?t.kind==="and"||t.kind==="or"?null:t:t.kind==="and"||t.kind==="or"?this._walk(t.items[r[0]]??null,r.slice(1)):null:null}_atomError(t){if(!t.entity_id)return d(this.hass,"ui.state_err_entity","Entity is required");if(t.kind!=="is"&&t.kind!=="is_not"){let i=t.states[0];if(!i)return d(this.hass,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(i)))return d(this.hass,"ui.state_err_numeric","Value must be a number")}else if(!t.states.some(i=>i!==""))return d(this.hass,"ui.state_err_state","State is required");return null}_unwrapAt(t){if(t.length===0){let a=this.value;if(!a)return;let o=a.kind==="not"?a.item:a;(o.kind==="and"||o.kind==="or")&&(o.items.length===1?this._emit(o.items[0]):this._emit(null));return}let r=t.slice(0,-1),i=t[t.length-1],s=this._patch(this.value,r,a=>{if(!a||a.kind!=="and"&&a.kind!=="or")return a;let o=a.items.slice(),l=o[i],h=null;if(l.kind==="and"||l.kind==="or")h=l;else if(l.kind==="not"){let m=l.item;(m.kind==="and"||m.kind==="or")&&(h=m)}return h?(o.splice(i,1,...h.items),{...a,items:o}):a});this._emit(s)}willUpdate(t){if(t.has("value")){let r=this.value;if(r&&this._openPath===null&&r.kind!=="and"&&r.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let i=this._atomAt(this._openPath);(!i||this._atomError(i)===null)&&(this._showError=!1)}}}_addAtRoot(){let t=this.value;if(t==null){this._addFirstAtom();return}if(t.kind==="and"||t.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[t,this._emptyAtom()]})}_setOpen(t){this._openPath=t}render(){if(this.value==null)return u`
        <div class="empty">
          <button @click=${()=>this._addFirstAtom()}>
            + ${d(this.hass,"ui.state_add_first","Add condition")}
          </button>
        </div>
      `;let t=this._showError&&this._openPath!==null?(()=>{let s=this._atomAt(this._openPath);return s?this._atomError(s):null})():null,r=this.value.kind==="not"?this.value.item:this.value,i=r.kind!=="and"&&r.kind!=="or";return u`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${this.value}
        .path=${[]}
        .openPath=${this._openPath}
        .errorPath=${t?this._openPath:null}
        .errorMessage=${t}
      ></ambience-state-expr-node>
      ${i?u`
        <button class="root-add" @click=${()=>this._addAtRoot()}>
          + ${d(this.hass,"ui.state_add_condition","Add condition")}
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
  `,c([f({attribute:!1})],Z.prototype,"hass",2),c([f({attribute:!1})],Z.prototype,"value",2),c([_()],Z.prototype,"_openPath",2),c([_()],Z.prototype,"_showError",2),Z=c([x("ambience-state-predicate-input")],Z);var R=class extends b{constructor(){super(...arguments);this.value=null;this.sceneSuggestions=[]}_emit(t){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_onText(t){let r=t.target.value;this._emit(r.trim()===""?null:r)}render(){return this.matcher.input==="time_of_day"?u`
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
  `,c([f({attribute:!1})],R.prototype,"matcher",2),c([f({attribute:!1})],R.prototype,"value",2),c([f({attribute:!1})],R.prototype,"sceneSuggestions",2),c([f({attribute:!1})],R.prototype,"periods",2),c([f({attribute:!1})],R.prototype,"dayConfig",2),c([f({attribute:!1})],R.prototype,"weatherConfig",2),c([f({attribute:!1})],R.prototype,"hass",2),R=c([x("ambience-matcher-input")],R);var ee=class extends b{constructor(){super(...arguments);this.entities=[];this.value=[];this.label=" "}connectedCallback(){super.connectedCallback(),Y(this,this.hass)}_emit(t){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_onHaFormChange(t){t.stopPropagation(),this._emit(t.detail.value.entity_ids??[])}_renderHaForm(){let t=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this.entities}}}],r=this.label;return u`
      <ha-form
        .hass=${this.hass}
        .schema=${t}
        .data=${{entity_ids:this.value}}
        .computeLabel=${()=>r}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(t,r){let i=new Set(this.value);r?i.add(t):i.delete(t),this._emit(this.entities.filter(s=>i.has(s)))}_renderFallback(){return this.entities.length===0?u`<p class="empty">${d(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:u`
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
  `,c([f({attribute:!1})],ee.prototype,"hass",2),c([f({attribute:!1})],ee.prototype,"entities",2),c([f({attribute:!1})],ee.prototype,"value",2),c([f()],ee.prototype,"label",2),ee=c([x("ambience-target-picker")],ee);var j=class extends b{constructor(){super(...arguments);this.entityIds=[];this.params={};this._mode="ui";this._yamlError=null;this._onScriptPicked=t=>{t.stopPropagation();let i=t.target.value;i&&this._emit("script-changed",{script:i})};this._onScriptPickedHaForm=t=>{t.stopPropagation();let r=t.detail.value?.script??"";r&&this._emit("script-changed",{script:r})};this._onTargetChanged=t=>{t.stopPropagation(),this._emit("entity-ids-changed",{entityIds:t.detail.value})};this._onFieldInput=t=>r=>{r.stopPropagation();let i=r.target,s={...this.params,[t]:i.value};this._emit("params-changed",{params:s})};this._onFieldsHaFormChanged=t=>{t.stopPropagation(),this._emit("params-changed",{params:{...this.params,...t.detail.value}})};this._onYamlInput=t=>{t.stopPropagation();let i=t.target.value,s;try{s=JSON.parse(i)}catch(m){this._yamlError=m instanceof Error?m.message:String(m);return}if(s===null||typeof s!="object"||Array.isArray(s)){this._yamlError=d(this.hass,"ui.yaml_must_be_object","Top-level value must be a mapping.");return}this._yamlError=null;let a=s,{entity_id:o,...l}=a,h=Array.isArray(o)?o.filter(m=>typeof m=="string"):typeof o=="string"?[o]:[];this._emit("entity-ids-changed",{entityIds:h}),this._emit("params-changed",{params:l})};this._onHaYamlChanged=t=>{if(t.stopPropagation(),t.detail.isValid===!1){this._yamlError=d(this.hass,"ui.invalid_yaml","Invalid YAML.");return}let r=t.detail.value;if(r===null||typeof r!="object"||Array.isArray(r)){this._yamlError=d(this.hass,"ui.yaml_must_be_object","Top-level value must be a mapping.");return}this._yamlError=null;let i=r,{entity_id:s,...a}=i,o=Array.isArray(s)?s.filter(l=>typeof l=="string"):typeof s=="string"?[s]:[];this._emit("entity-ids-changed",{entityIds:o}),this._emit("params-changed",{params:a})}}connectedCallback(){super.connectedCallback(),Y(this,this.hass)}_scriptMeta(){if(!this.script)return;let t=this.script.includes(".")?this.script.split(".").slice(1).join("."):this.script;return this.hass?.services?.script?.[t]}_emit(t,r){this.dispatchEvent(new CustomEvent(t,{detail:r,bubbles:!0,composed:!0}))}_renderScriptPicker(){let t=d(this.hass,"ui.script_entity","Script");if(customElements.get("ha-form")){let i=[{name:"script",selector:{entity:{filter:{domain:"script"}}}}];return u`
        <div class="script-picker">
          <ha-form
            .hass=${this.hass}
            .schema=${i}
            .data=${{script:this.script??""}}
            .computeLabel=${()=>t}
            @value-changed=${this._onScriptPickedHaForm}
          ></ha-form>
        </div>
      `}let r=this._scriptCandidates();return r.length===0?u`
        <div class="script-picker">
          <label>${t}</label>
          <input
            type="text"
            placeholder="script.foo"
            .value=${this.script??""}
            @change=${this._onScriptPicked}
          />
        </div>
      `:u`
      <div class="script-picker">
        <label>${t}</label>
        <select @change=${this._onScriptPicked}>
          <option value="">${d(this.hass,"ui.pick_script","\u2014 select a script \u2014")}</option>
          ${r.map(i=>u`
            <option value=${i} ?selected=${i===this.script}>${i}</option>
          `)}
        </select>
      </div>
    `}_scriptCandidates(){let t=this.hass?.services?.script;if(t)return Object.keys(t).map(i=>`script.${i}`).sort();let r=this.hass?.entities;return r?Object.keys(r).filter(i=>i.startsWith("script.")).sort():[]}_setMode(t){this._mode=t,this._yamlError=null}_renderModeToggle(){return u`
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
    `}_targetEntities(t){let r=t.target?.entity?.domain,i;if(Array.isArray(r))i=r;else if(typeof r=="string")i=[r];else{let s=this.hass?.entities,a=new Set;for(let o of Object.keys(s??{})){let l=o.split(".")[0];l&&a.add(l)}i=[...a]}return this.scope?lt(this.hass,this.scope,i):[]}_renderTargetPicker(t){if(!t.target||Object.keys(t.target).length===0)return"";let r=this._targetEntities(t),i=d(this.hass,"ui.target","Target");return u`
      <div class="target-picker">
        <ambience-target-picker
          .hass=${this.hass}
          .entities=${r}
          .value=${this.entityIds}
          .label=${i}
          @value-changed=${this._onTargetChanged}
        ></ambience-target-picker>
      </div>
    `}_fieldLabel(t,r){if(r.name)return r.name;let i=t.replaceAll("_"," ").toLowerCase();return i.charAt(0).toUpperCase()+i.slice(1)}_renderFieldsForm(t){let r=t.fields;if(!r||Object.keys(r).length===0)return"";if(customElements.get("ha-form")){let i=Object.entries(r).map(([a,o])=>({name:a,required:!!o.required,default:o.default,description:{suggested_value:o.default},selector:o.selector??{text:{}}})),s={};for(let[a,o]of Object.entries(r))s[a]=this.params[a]??o.default??"";return u`
        <div class="fields-form">
          <ha-form
            .hass=${this.hass}
            .schema=${i}
            .data=${s}
            @value-changed=${this._onFieldsHaFormChanged}
          ></ha-form>
        </div>
      `}return u`
      <div class="fields-form">
        ${Object.entries(r).map(([i,s])=>u`
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
    `}_renderUiMode(){if(!this.script)return"";let t=this._scriptMeta();if(!t)return u`
        <div class="not-found">
          ${d(this.hass,"ui.script_not_found_prefix","Script")}
          <code>${this.script}</code>
          ${d(this.hass,"ui.script_not_found_suffix","not found. It may have been removed.")}
        </div>
        ${this._renderYamlEditor()}
      `;let r=this._renderTargetPicker(t),i=this._renderFieldsForm(t);return r===""&&i===""?u`<div class="no-params">${d(this.hass,"ui.script_no_parameters","This script has no parameters.")}</div>`:u`${r}${i}`}_combinedObject(){let t={...this.params};return this.entityIds.length>0&&(t.entity_id=this.entityIds),t}_serializeYaml(){return JSON.stringify(this._combinedObject(),null,2)}_renderYamlEditor(){return customElements.get("ha-yaml-editor")?u`
        <ha-yaml-editor
          .hass=${this.hass}
          .defaultValue=${this._combinedObject()}
          @value-changed=${this._onHaYamlChanged}
        ></ha-yaml-editor>
        ${this._yamlError?u`<div class="yaml-error">${this._yamlError}</div>`:""}
      `:u`
      <textarea
        spellcheck="false"
        .value=${this._serializeYaml()}
        @input=${this._onYamlInput}
      ></textarea>
      ${this._yamlError?u`<div class="yaml-error">${this._yamlError}</div>`:""}
    `}render(){return u`
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
  `,c([f({attribute:!1})],j.prototype,"hass",2),c([f({attribute:!1})],j.prototype,"scope",2),c([f()],j.prototype,"script",2),c([f({attribute:!1})],j.prototype,"entityIds",2),c([f({attribute:!1})],j.prototype,"params",2),c([_()],j.prototype,"_mode",2),c([_()],j.prototype,"_yamlError",2),j=c([x("ambience-script-action-slot")],j);var S=class extends b{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.sceneSuggestions=[];this.availableActions=[];this._draft=null;this._open=null;this._showError=!1;this._onNameInput=t=>{this._setName(t.target.value)};this._onAddMatcher=t=>{let r=t.target,i=r.value;r.value="",this._addMatcher(i)};this._onAddMatcherHaForm=t=>{t.stopPropagation();let r=t.detail.value.add;r!==S._ADD_MATCHER_PLACEHOLDER&&this._addMatcher(r)};this._onAddAction=t=>{let r=t.target,i=r.value;r.value="",this._addActionSlot(i)};this._onAddActionHaForm=t=>{t.stopPropagation();let r=t.detail.value.add;r!==S._ADD_ACTION_PLACEHOLDER&&this._addActionSlot(r)}}connectedCallback(){super.connectedCallback(),Y(this,this.hass)}willUpdate(t){t.has("open")&&this.open&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null,this._open=null,this._showError=!1)}_setName(t){this._draft&&(this._draft={...this._draft,name:t||void 0})}_renderNameSlot(){let t=this._draft.name??"";if(this._isOpen({kind:"name"}))return u`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(t)}
        </div>
      `;let i=st(this._draft,d(this.hass,"ui.new_rule","New rule"));return u`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${i}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(t){let r=pr();return r==="ha-input"?u`<ha-input label=${d(this.hass,"ui.name_optional","Name (optional)")} .value=${t} @input=${this._onNameInput}></ha-input>`:r==="ha-textfield"?u`<ha-textfield label=${d(this.hass,"ui.name_optional","Name (optional)")} .value=${t} @input=${this._onNameInput}></ha-textfield>`:u`<input type="text" .value=${t} @input=${this._onNameInput} />`}_isOpen(t){return this._open===null?!1:t.kind==="name"&&this._open.kind==="name"?!0:t.kind==="matcher"&&this._open.kind==="matcher"?t.id===this._open.id:t.kind==="action"&&this._open.kind==="action"?t.idx===this._open.idx:!1}_validationError(t){if(t===null||t.kind==="name"||t.kind==="matcher")return null;let r=this._draft?.actions[t.idx];if(!r)return null;let i=this.availableActions.find(s=>s.name===r.action);if(i?.kind==="script"||r.action==="script")return this._validateScriptAction(r);if(r.entity_ids.length===0)return d(this.hass,"ui.at_least_one_target","At least one target is required.");if(!i)return null;for(let s of i.target_params){if(!s.required)continue;let a=r.params[s.name];if(a==null||a==="")return d(this.hass,"ui.param_required","{param} is required.").replace("{param}",this._paramLabel(s.name))}return null}_validateScriptAction(t){let r=t.script;if(!r||!r.startsWith("script."))return d(this.hass,"ui.script_required","Please pick a script.");let i=r.split(".").slice(1).join("."),a=this.hass?.services?.script?.[i];if(!a?.fields)return null;for(let[o,l]of Object.entries(a.fields)){if(!l.required)continue;let h=t.params[o];if(h==null||h==="")return d(this.hass,"ui.param_required","{param} is required.").replace("{param}",this._paramLabel(o))}return null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(t){if(this._isOpen(t)){this._open=null,this._showError=!1;return}this._open!==null&&!this._tryCloseCurrent()||(this._open=t,this._showError=!1)}_onModalClick(t){for(let r of t.composedPath())if(r instanceof Element&&(r.classList.contains("slot")||r.classList.contains("actions-bar")||r.classList.contains("add-matcher")||r.classList.contains("add-action")))return;this._tryCloseCurrent()}_setPredicate(t,r){if(!this._draft)return;let i={...this._draft.when};r==null?delete i[t]:i[t]=r,this._draft={...this._draft,when:i}}_renderMatcherRow(t){let r=this._draft.when[t.name]??null,i=this._isOpen({kind:"matcher",id:t.name}),s=t.input==="scene_combobox";if(i&&s)return u`
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
      `;let a=at(t.name,r,{hass:this.hass,periods:this.periods});return u`
      <div class="slot ${i?"expanded":"collapsed"}" data-slot-id=${t.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"matcher",id:t.name})}>
          <span class="summary-label"><strong>${se(this.hass,t.name)}:</strong> ${a}</span>
          <button
            class="remove"
            @click=${o=>{o.stopPropagation(),this._removeMatcher(t.name)}}
            title=${d(this.hass,"ui.remove_condition","Remove condition")}
          >✕</button>
        </div>
        ${i?u`
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
          ${t.map(r=>u`<option value=${r.name}>${se(this.hass,r.name)}</option>`)}
        </select>
      </div>
    `}_renderAddMatcherHaForm(t){let r=d(this.hass,"ui.add_condition","+ Add condition\u2026"),i=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_MATCHER_PLACEHOLDER,label:r},...t.map(s=>({value:s.name,label:se(this.hass,s.name)}))]}}}];return u`
      <div class="add-matcher">
        <ha-form
          .hass=${this.hass}
          .schema=${i}
          .data=${{add:S._ADD_MATCHER_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddMatcherHaForm}
        ></ha-form>
      </div>
    `}_addActionSlot(t){if(!this._draft||!t||this._open!==null&&!this._tryCloseCurrent())return;let r={action:t,entity_ids:[],params:{}},i=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,r]},this._open={kind:"action",idx:i},this._showError=!1}_renderAddAction(){return this.availableActions.length===0?"":customElements.get("ha-form")?this._renderAddActionHaForm():u`
      <div class="add-action">
        <select class="add-action" @change=${this._onAddAction}>
          <option value="">${d(this.hass,"ui.add_action","+ Add action\u2026")}</option>
          ${this.availableActions.map(t=>u`
            <option value=${t.name}>${ae(this.hass,t.name)}</option>
          `)}
        </select>
      </div>
    `}_renderAddActionHaForm(){let t=d(this.hass,"ui.add_action","+ Add action\u2026"),r=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_ACTION_PLACEHOLDER,label:t},...this.availableActions.map(i=>({value:i.name,label:ae(this.hass,i.name)}))]}}}];return u`
      <div class="add-action">
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{add:S._ADD_ACTION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddActionHaForm}
        ></ha-form>
      </div>
    `}_updateActionAt(t,r){if(!this._draft)return;let i=this._draft.actions.map((s,a)=>a===t?r(s):s);this._draft={...this._draft,actions:i}}_deleteAction(t){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((r,i)=>i!==t)},this._open?.kind==="action"&&this._open.idx===t&&(this._open=null))}_setActionTargets(t,r){this._updateActionAt(t,i=>({...i,entity_ids:r}))}_paramLabel(t){let r=t.replaceAll("_"," ").toLowerCase();return r.charAt(0).toUpperCase()+r.slice(1)}_updateActionParam(t,r,i){this._updateActionAt(t,s=>{let a={...s.params},o=i;if(r.type==="int"?o=i===""?void 0:parseInt(i,10):r.type==="number"?o=i===""?void 0:parseFloat(i):r.type==="boolean"&&(o=i==="true"),typeof o=="number"&&Number.isFinite(o)){let l=o;typeof r.min=="number"&&l<r.min&&(l=r.min),typeof r.max=="number"&&l>r.max&&(l=r.max),o=l}return o===void 0?delete a[r.name]:a[r.name]=o,{...s,params:a}})}_renderActionParams(t,r,i){let s=i?.target_params??[];return u`
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
    `}_renderActionRow(t,r){let i=this.availableActions.find(l=>l.name===t.action),s=this._isOpen({kind:"action",idx:r}),a=Tr(t,i,{hass:this.hass}),o=i?.kind==="script"||t.action==="script";return u`
      <div class="slot ${s?"expanded":"collapsed"}" data-slot-id="action-${r}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:r})}>
          <span class="summary-label">${a}</span>
          <button class="remove" @click=${l=>{l.stopPropagation(),this._deleteAction(r)}} title=${d(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${s?u`
          <div class="body">
            ${o?this._renderScriptBody(r,t):this._renderStandardBody(r,t,i)}

            ${this._showError&&this._validationError({kind:"action",idx:r})?u`
              <div class="error">${this._validationError({kind:"action",idx:r})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_renderStandardBody(t,r,i){let s=this.scope?lt(this.hass,this.scope,i?.domains??[]):[];return u`
      <label>${d(this.hass,"ui.target","Target")}</label>
      <ambience-target-picker
        .hass=${this.hass}
        .entities=${s}
        .value=${r.entity_ids}
        @value-changed=${a=>{a.stopPropagation(),this._setActionTargets(t,a.detail.value)}}
      ></ambience-target-picker>

      ${this._renderActionParams(t,r,i)}
    `}_renderScriptBody(t,r){return u`
      <ambience-script-action-slot
        .hass=${this.hass}
        .scope=${this.scope}
        .script=${r.script}
        .entityIds=${r.entity_ids}
        .params=${r.params}
        @script-changed=${i=>{i.stopPropagation(),this._setActionScript(t,i.detail.script)}}
        @entity-ids-changed=${i=>{i.stopPropagation(),this._setActionTargets(t,i.detail.entityIds)}}
        @params-changed=${i=>{i.stopPropagation(),this._setActionParams(t,i.detail.params)}}
      ></ambience-script-action-slot>
    `}_setActionScript(t,r){this._updateActionAt(t,i=>({...i,script:r,entity_ids:[],params:{}}))}_setActionParams(t,r){this._updateActionAt(t,i=>({...i,params:r}))}_save(){if(!this._draft)return;let t=Object.fromEntries(Object.entries(this._draft.when).filter(([,r])=>r!=null));this.dispatchEvent(new CustomEvent("save-rule",{detail:{...this._draft,when:t},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){if(!this._draft)return u``;let t=this._visibleMatchers();return u`
      <div class="modal" @click=${this._onModalClick}>
        <div class="content">
          ${this._renderNameSlot()}

          <h3>${d(this.hass,"ui.when_heading","When")}</h3>
          ${t.map(r=>this._renderMatcherRow(r))}
          ${this._renderAddMatcher()}

          <h3>${d(this.hass,"ui.actions_heading","Actions")}</h3>
          ${this._draft.actions.map((r,i)=>this._renderActionRow(r,i))}
          ${this._renderAddAction()}
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
  `,S._ADD_MATCHER_PLACEHOLDER="__add_matcher__",S._ADD_ACTION_PLACEHOLDER="__add_action__",c([f({type:Boolean,reflect:!0})],S.prototype,"open",2),c([f({attribute:!1})],S.prototype,"rule",2),c([f({attribute:!1})],S.prototype,"matchers",2),c([f({attribute:!1})],S.prototype,"sceneSuggestions",2),c([f({attribute:!1})],S.prototype,"periods",2),c([f({attribute:!1})],S.prototype,"dayConfig",2),c([f({attribute:!1})],S.prototype,"weatherConfig",2),c([f({attribute:!1})],S.prototype,"availableActions",2),c([f({attribute:!1})],S.prototype,"hass",2),c([f({attribute:!1})],S.prototype,"scope",2),c([_()],S.prototype,"_draft",2),c([_()],S.prototype,"_open",2),c([_()],S.prototype,"_showError",2),S=c([x("ambience-rule-editor")],S);function ki(e){return e.kind==="house"?"house":`${e.kind}:${e.id}`}function gt(e){return{rules:e.rules??[],auto_sort:e.auto_sort??!0}}var T=class extends b{constructor(){super(...arguments);this._areas=[];this._floors=[];this._areaConfigs=new Map;this._floorConfigs=new Map;this._house={rules:[],auto_sort:!0};this._matchers=[];this._actions=[];this._expanded=new Set;this._error="";this._editing=null}async connectedCallback(){super.connectedCallback(),await this._loadStatic(),await Promise.all([this._refreshAreas(),this._refreshFloors(),this._refreshHouse()]),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubArea?.(),this._unsubArea=void 0,this._unsubFloor?.(),this._unsubFloor=void 0}async _loadStatic(){try{let[t,r,i,s,a]=await Promise.all([tt(this.hass),xr(this.hass),rt(this.hass),it(this.hass),nt(this.hass)]);if(!this.isConnected)return;this._matchers=t,this._actions=r,this._periods=i,this._dayConfig=s,this._weatherConfig=a}catch(t){this._error=t.message||String(t)}}async _refreshAreas(){try{let t=await mr(this.hass),r=this._areaConfigs,i=new Map;if(await Promise.all(t.map(async s=>{let a=r.get(s.area_id);if(a){i.set(s.area_id,a);return}i.set(s.area_id,gt(await fr(this.hass,s.area_id)))})),!this.isConnected)return;this._areas=t,this._areaConfigs=i}catch(t){this._error=t.message||String(t)}}async _refreshFloors(){try{let t=(await _r(this.hass)).slice().sort((s,a)=>s.name.localeCompare(a.name)),r=this._floorConfigs,i=new Map;if(await Promise.all(t.map(async s=>{let a=r.get(s.floor_id);if(a){i.set(s.floor_id,a);return}i.set(s.floor_id,gt(await vr(this.hass,s.floor_id)))})),!this.isConnected)return;this._floors=t,this._floorConfigs=i}catch(t){this._error=t.message||String(t)}}async _refreshHouse(){try{let t=gt(await br(this.hass));if(!this.isConnected)return;this._house=t}catch(t){this._error=t.message||String(t)}}async _subscribe(){let t=this.hass.connection.subscribeEvents(a=>{if(a.data.action==="remove"){let o=a.data.area_id,l=new Set(this._expanded);l.delete(`area:${o}`),this._expanded=l,this._editing?.scope.kind==="area"&&this._editing.scope.id===o&&(this._editing=null)}this._refreshAreas()},"area_registry_updated"),r=this.hass.connection.subscribeEvents(a=>{if(a.data.action==="remove"){let o=a.data.floor_id,l=new Set(this._expanded);l.delete(`floor:${o}`),this._expanded=l,this._editing?.scope.kind==="floor"&&this._editing.scope.id===o&&(this._editing=null)}this._refreshFloors()},"floor_registry_updated"),[i,s]=await Promise.all([t,r]);this.isConnected?(this._unsubArea=i,this._unsubFloor=s):(i(),s())}_getConfig(t){return t.kind==="house"?this._house:t.kind==="area"?this._areaConfigs.get(t.id):this._floorConfigs.get(t.id)}_setConfig(t,r){if(t.kind==="house")this._house=r;else if(t.kind==="area"){let i=new Map(this._areaConfigs);i.set(t.id,r),this._areaConfigs=i}else{let i=new Map(this._floorConfigs);i.set(t.id,r),this._floorConfigs=i}}async _mutate(t,r){let i=this._getConfig(t);this._setConfig(t,r),this._error="";try{let s;t.kind==="house"?s=await $r(this.hass,r):t.kind==="area"?s=await gr(this.hass,t.id,r):s=await yr(this.hass,t.id,r),this._setConfig(t,gt(s.config))}catch(s){i&&this._setConfig(t,i),this._error=s.message||String(s)}}_toggleExpand(t){let r=ki(t),i=new Set(this._expanded);i.has(r)?i.delete(r):i.add(r),this._expanded=i}_toggleAutoSort(t,r){let i=this._getConfig(t);i&&this._mutate(t,{...i,auto_sort:r})}_addRule(t){let r=this._getConfig(t);r&&(this._editing={scope:t,index:r.rules.length,isNew:!0})}_editRule(t,r){this._editing={scope:t,index:r.detail.index,isNew:!1}}_duplicateRule(t,r){let i=this._getConfig(t);if(!i)return;let s=i.rules[r.detail.index];if(!s)return;let a=JSON.parse(JSON.stringify(s)),o=[...i.rules];o.splice(r.detail.index+1,0,a),this._mutate(t,{...i,rules:o})}_deleteRule(t,r){let i=this._getConfig(t);if(!i)return;let s=i.rules.filter((a,o)=>o!==r.detail.index);this._mutate(t,{...i,rules:s})}_reorderRules(t,r){let i=this._getConfig(t);if(!i)return;let{from:s,to:a}=r.detail,o=[...i.rules],[l]=o.splice(s,1);o.splice(a,0,l),this._mutate(t,{...i,rules:o})}_saveRule(t){let r=this._editing;if(this._editing=null,!r)return;let i=this._getConfig(r.scope);if(!i)return;let s=[...i.rules];r.isNew?s.push(t.detail):s[r.index]=t.detail,this._mutate(r.scope,{...i,rules:s})}_cancelRule(){this._editing=null}get _editingRule(){return this._editing?this._editing.isNew?{when:{},actions:[]}:this._getConfig(this._editing.scope)?.rules[this._editing.index]??null:null}get _sceneSuggestions(){if(!this._editing)return[];let t=this._getConfig(this._editing.scope);if(!t)return[];let r=new Set;for(let i of t.rules){let s=i.when.scene;typeof s=="string"&&s&&r.add(s)}return[...r].sort((i,s)=>i.toLowerCase().localeCompare(s.toLowerCase()))}get _editorMatchers(){return this._editing?this._matchers.slice().sort((t,r)=>t.priority-r.priority):[]}_summary(t){let r=t.rules.length;if(r===0)return d(this.hass,"ui.not_configured","not configured");let i=r===1?d(this.hass,"ui.rule_singular","rule"):d(this.hass,"ui.rule_plural","rules");return`${r} ${i}`}render(){let t=d(this.hass,"ui.scope_floor_prefix","Floor: "),r=d(this.hass,"ui.scope_area_prefix","Area: ");return u`
      ${this._error?u`<p class="error">${this._error}</p>`:""}
      <ul>
        ${this._renderScopeRow({kind:"house"},d(this.hass,"ui.scope_global","Global"),this._house,"house")}
        ${this._floors.map(i=>{let s=this._floorConfigs.get(i.floor_id);return s?this._renderScopeRow({kind:"floor",id:i.floor_id},`${t}${i.name}`,s,"floor"):u``})}
        ${this._areas.length===0?u`<li>
              <p class="empty">
                ${d(this.hass,"ui.no_areas","No areas found in Home Assistant.")}
              </p>
            </li>`:this._areas.map(i=>{let s=this._areaConfigs.get(i.area_id);return s?this._renderScopeRow({kind:"area",id:i.area_id},`${r}${i.name}`,s,"area"):u``})}
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
    `}_renderScopeRow(t,r,i,s){let a=this._expanded.has(ki(t)),o=t.kind==="house"?"":t.id;return u`
      <li
        class="scope-row ${s}"
        data-id=${o}
      >
        <div class="scope-header" @click=${()=>this._toggleExpand(t)}>
          <span class="chevron ${a?"open":""}">▶</span>
          <span class="scope-name">${r}</span>
          <span class="scope-summary">${this._summary(i)}</span>
        </div>
        ${a?u`
              <div class="scope-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!i.auto_sort}
                    @change=${l=>this._toggleAutoSort(t,!l.target.checked)}
                  />
                  ${d(this.hass,"ui.order_rules_manually","Order rules manually")}
                </label>
                <ambience-rules-list
                  .rules=${i.rules}
                  .autoSort=${i.auto_sort}
                  .periods=${this._periods}
                  .weatherConfig=${this._weatherConfig}
                  .matchers=${this._matchers}
                  .availableActions=${this._actions}
                  .hass=${this.hass}
                  @add-rule=${()=>this._addRule(t)}
                  @edit-rule=${l=>this._editRule(t,l)}
                  @duplicate-rule=${l=>this._duplicateRule(t,l)}
                  @delete-rule=${l=>this._deleteRule(t,l)}
                  @reorder-rules=${l=>this._reorderRules(t,l)}
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
  `,c([f({attribute:!1})],T.prototype,"hass",2),c([_()],T.prototype,"_areas",2),c([_()],T.prototype,"_floors",2),c([_()],T.prototype,"_areaConfigs",2),c([_()],T.prototype,"_floorConfigs",2),c([_()],T.prototype,"_house",2),c([_()],T.prototype,"_matchers",2),c([_()],T.prototype,"_actions",2),c([_()],T.prototype,"_periods",2),c([_()],T.prototype,"_dayConfig",2),c([_()],T.prototype,"_weatherConfig",2),c([_()],T.prototype,"_expanded",2),c([_()],T.prototype,"_error",2),c([_()],T.prototype,"_editing",2),T=c([x("ambience-scopes-view")],T);var te=class extends b{constructor(){super(...arguments);this.matcherName="";this.matcherDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let t=se(this.hass,this.matcherName);return u`
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
    `}};te.styles=$`
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
  `,c([f({attribute:!1})],te.prototype,"hass",2),c([f()],te.prototype,"matcherName",2),c([f()],te.prototype,"matcherDescription",2),c([_()],te.prototype,"_expanded",2),te=c([x("ambience-matcher-card")],te);function Le(e){return e.scope_kind==="house"?"House":e.scope_kind==="floor"?`Floor: ${e.scope_id??""}`:e.scope_id??""}var Ra=/^[a-z][a-z0-9_]*$/;function ja(e){return e.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var U=class extends b{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._label=this.initial.label??"",this._def=this.initial}_onLabelInput(t){this._label=t.target.value}_onFromChange(t){t.stopPropagation(),this._def={...this._def,from:t.detail.value}}_onToChange(t){t.stopPropagation(),this._def={...this._def,to:t.detail.value}}_validate(t){if(!this.existingId){if(!this._label.trim())return d(this.hass,"ui.error_enter_name","Please enter a name.");if(!t)return d(this.hass,"ui.error_start_letter","Name must start with a letter.");if(!Ra.test(t))return d(this.hass,"ui.error_start_letter","Name must start with a letter.");if(this.takenIds.has(t))return d(this.hass,"ui.error_name_exists","A period with this name already exists. Choose a different name.")}return""}_onSave(){let t=this.existingId??ja(this._label),r=this._validate(t);if(r){this._error=r,this.performUpdate();return}let i={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:t,definition:i},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){let t=this.existingId?d(this.hass,"ui.period_modal_edit_title",'Edit "{name}"').replace("{name}",this.initial?.label??this.existingId):d(this.hass,"ui.period_modal_add_title","Add custom period");return u`
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
  `,c([f({attribute:!1})],U.prototype,"hass",2),c([f({attribute:!1})],U.prototype,"existingId",2),c([f({attribute:!1})],U.prototype,"initial",2),c([f({attribute:!1})],U.prototype,"takenIds",2),c([_()],U.prototype,"_label",2),c([_()],U.prototype,"_def",2),c([_()],U.prototype,"_error",2),U=c([x("ambience-period-edit-modal")],U);function Ei(e,n){if(e.kind==="time")return`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;let t=we(n,e.anchor);if(e.offset_min===0)return t;let r=Math.abs(e.offset_min),i=r%60===0?`${r/60}${d(n,"ui.unit_hour_abbr","h")}`:`${r}${d(n,"ui.unit_min_abbr","m")}`;return`${t}${e.offset_min<0?"-":"+"}${i}`}function Si(e,n){return`${Ei(e.from,n)} \u2192 ${Ei(e.to,n)}`}var re=class extends b{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await rt(this.hass)}async _saveState(t){let r=await wr(this.hass,t,this._view.hidden);this._warnings=r.warnings,await this._reload()}_onEdit(t,r){this._modal={mode:"edit",id:t,initial:r}}async _onDelete(t){let r={...this._view.custom};delete r[t],await this._saveState(r)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(t){t.stopPropagation();let{id:r,definition:i}=t.detail,s={...this._view.custom,[r]:i};this._modal={mode:"closed"},await this._saveState(s)}_onModalCancel(){this._modal={mode:"closed"}}_renderBuiltinRow(t,r,i){return u`
      <div class="row ${i?"overridden":""}">
        <span class="name">${ge(this.hass,t,{})}</span>
        <span class="def">${Si(r,this.hass)}</span>
        <span class="badge">${d(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${i?"":u`<button class="icon" title=${d(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(t,r)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(t,r){return u`
      <div class="row custom">
        <span class="name">${ge(this.hass,t,this._view.custom)}</span>
        <span class="def">${Si(r,this.hass)}</span>
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
              ${this._warnings.map(r=>u`<li>${Le(r)} / "${r.rule_name}" → ${r.missing_period}</li>`)}
            </ul>
          </div>`:""}
      ${Object.entries(this._view.builtins).map(([r,i])=>{let s=t[r];return u`
          ${this._renderBuiltinRow(r,i,s!=null)}
          ${s!=null?this._renderCustomRow(r,s):""}
        `})}
      ${Object.entries(t).filter(([r])=>!(r in this._view.builtins)).map(([r,i])=>this._renderCustomRow(r,i))}
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
    `}};re.styles=$`
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
  `,c([f({attribute:!1})],re.prototype,"hass",2),c([_()],re.prototype,"_view",2),c([_()],re.prototype,"_modal",2),c([_()],re.prototype,"_warnings",2),re=c([x("ambience-time-of-day-config")],re);var de=class extends b{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await it(this.hass)}async _save(t){this._config=t;let r=await kr(this.hass,t.workday_sensor,t.workday_calendar);this._warnings=r.warnings??[]}_onSensorChange(t){this._save({...this._config,workday_sensor:t.detail.value||null})}_onCalendarChange(t){this._save({...this._config,workday_calendar:t.detail.value||null})}render(){let t=[{name:"workday_sensor",selector:{entity:{integration:"workday",domain:"binary_sensor"}}}],r=[{name:"workday_calendar",selector:{entity:{integration:"workday",domain:"calendar"}}}];return u`
      <div class="row">
        <label>${d(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${t}
          .data=${{workday_sensor:this._config.workday_sensor??""}}
          .computeLabel=${()=>""}
          @value-changed=${i=>{i.stopPropagation(),this._onSensorChange({detail:{value:i.detail.value?.workday_sensor||null}})}}
        ></ha-form>
      </div>
      <div class="row">
        <label>${d(this.hass,"ui.workday_calendar","Workday calendar")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{workday_calendar:this._config.workday_calendar??""}}
          .computeLabel=${()=>""}
          @value-changed=${i=>{i.stopPropagation(),this._onCalendarChange({detail:{value:i.detail.value?.workday_calendar||null}})}}
        ></ha-form>
      </div>
      ${this._warnings.length?u`
        <div class="warnings">
          <strong>${d(this.hass,"ui.day_warning_prefix","Warning:")}</strong> ${d(this.hass,"ui.day_warning_text","rules now reference unconfigured entities:")}
          <ul>
            ${this._warnings.map(i=>u`<li>${Le(i)} / "${i.rule_name}" → ${i.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};de.styles=$`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,c([f({attribute:!1})],de.prototype,"hass",2),c([_()],de.prototype,"_config",2),c([_()],de.prototype,"_warnings",2),de=c([x("ambience-day-config")],de);var Ua=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],ie=class extends b{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._warnings=[];this._expanded=new Set}async connectedCallback(){super.connectedCallback(),this._config=await nt(this.hass)}async _persist(){let t=await Er(this.hass,this._config.entity,this._config.groups);this._warnings=t.warnings??[]}_onEntityChange(t){this._config={...this._config,entity:t.detail.value||null},this._persist()}_nextGroupId(t){let r=new Set(t.map(i=>i.id));for(let i=1;i<=t.length+1;i++){let s=`group_${i}`;if(!r.has(s))return s}return`group_${t.length+1}`}_addGroup(){let t=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:t,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,t]),this._persist()}_toggleExpand(t){let r=new Set(this._expanded);r.has(t)?r.delete(t):r.add(t),this._expanded=r}_updateGroup(t,r){this._config={...this._config,groups:this._config.groups.map((i,s)=>s===t?{...i,...r}:i)},this._persist()}_removeGroup(t){let r=this._config.groups[t];if(this._config={...this._config,groups:this._config.groups.filter((i,s)=>s!==t)},r){let i=new Set(this._expanded);i.delete(r.id),this._expanded=i}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:Ua.map(t=>({value:t,label:et(this.hass,t)}))}}}]}_renderConditions(t,r){if(customElements.get("ha-form"))return u`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:r.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation(),this._updateGroup(t,{conditions:s.detail.value.conditions??[]})}}
      ></ha-form>`;let i=r.conditions.map(s=>et(this.hass,s));return u`<span class="conditions-list">${i.join(", ")}</span>`}_renderGroup(t,r){let i=this._expanded.has(r.id),s=r.conditions.map(a=>et(this.hass,a)).join(", ");return u`
      <div class="group">
        <div class="group-header" @click=${()=>this._toggleExpand(r.id)}>
          <span class="chevron ${i?"open":""}">▶</span>
          <span class="label">${r.label}</span>
          <span class="codes">${s}</span>
          <button
            class="icon"
            title=${d(this.hass,"ui.title_delete","Delete")}
            @click=${a=>{a.stopPropagation(),this._removeGroup(t)}}
          >✕</button>
        </div>
        ${i?u`<div class="body" @click=${a=>a.stopPropagation()}>
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
      ${this._config.groups.map((r,i)=>this._renderGroup(i,r))}
      <button class="add" @click=${()=>this._addGroup()}>
        ${d(this.hass,"ui.add_group","+ Add group")}
      </button>

      ${this._warnings.length?u`
        <div class="warnings">
          <strong>${d(this.hass,"ui.day_warning_prefix","Warning:")}</strong>
          ${d(this.hass,"ui.weather_warning_text","rules now reference an unconfigured weather entity:")}
          <ul>${this._warnings.map(r=>u`<li>${Le(r)} / "${r.rule_name}" → ${r.reason}</li>`)}</ul>
        </div>
      `:""}
    `}};ie.styles=$`
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
  `,c([f({attribute:!1})],ie.prototype,"hass",2),c([_()],ie.prototype,"_config",2),c([_()],ie.prototype,"_warnings",2),c([_()],ie.prototype,"_expanded",2),ie=c([x("ambience-weather-config")],ie);var za=new Set(["time_of_day","day","weather"]),ce=class extends b{constructor(){super(...arguments);this._matchers=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._matchers=await tt(this.hass)}catch(t){this._error=t.message||String(t)}}render(){let t=this._matchers.filter(r=>za.has(r.name)).slice().sort((r,i)=>r.priority-i.priority);return u`
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
    `}};ce.styles=$`
    :host { display: block; padding: 1rem; max-width: 60rem; margin: 0 auto; }
    .error { color: var(--error-color, #d32f2f); }
  `,c([f({attribute:!1})],ce.prototype,"hass",2),c([_()],ce.prototype,"_matchers",2),c([_()],ce.prototype,"_error",2),ce=c([x("ambience-configuration-view")],ce);var be=class extends b{constructor(){super(...arguments);this._view="areas"}connectedCallback(){super.connectedCallback(),Y(this)}render(){return u`
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
      ${this._view==="areas"?u`<ambience-scopes-view .hass=${this.hass}></ambience-scopes-view>`:u`<ambience-configuration-view .hass=${this.hass}></ambience-configuration-view>`}
    `}};be.styles=$`
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
  `,c([f({attribute:!1})],be.prototype,"hass",2),c([_()],be.prototype,"_view",2),be=c([x("ambience-panel")],be);export{be as AmbiencePanel};
