/* Ambience — bundled output. Do not edit by hand. */
var Fn=Object.defineProperty;var On=Object.getOwnPropertyDescriptor;var u=(t,n,e,r)=>{for(var i=r>1?void 0:r?On(n,e):n,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(r?a(n,e,i):a(i))||i);return r&&i&&Fn(n,e,i),i};var dt=globalThis,ct=dt.ShadowRoot&&(dt.ShadyCSS===void 0||dt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ut=Symbol(),Rr=new WeakMap,ze=class{constructor(n,e,r){if(this._$cssResult$=!0,r!==Ut)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(ct&&n===void 0){let r=e!==void 0&&e.length===1;r&&(n=Rr.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),r&&Rr.set(e,n))}return n}toString(){return this.cssText}},Hr=t=>new ze(typeof t=="string"?t:t+"",void 0,Ut),y=(t,...n)=>{let e=t.length===1?t[0]:n.reduce((r,i,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new ze(e,t,Ut)},Dr=(t,n)=>{if(ct)t.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let r=document.createElement("style"),i=dt.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,t.appendChild(r)}},Gt=ct?t=>t:t=>t instanceof CSSStyleSheet?(n=>{let e="";for(let r of n.cssRules)e+=r.cssText;return Hr(e)})(t):t;var{is:Nn,defineProperty:Mn,getOwnPropertyDescriptor:In,getOwnPropertyNames:jn,getOwnPropertySymbols:zn,getPrototypeOf:Wn}=Object,ut=globalThis,Fr=ut.trustedTypes,Un=Fr?Fr.emptyScript:"",Gn=ut.reactiveElementPolyfillSupport,We=(t,n)=>t,Ue={toAttribute(t,n){switch(n){case Boolean:t=t?Un:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,n){let e=t;switch(n){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},ht=(t,n)=>!Nn(t,n),Or={attribute:!0,type:String,converter:Ue,reflect:!1,useDefault:!1,hasChanged:ht};Symbol.metadata??=Symbol("metadata"),ut.litPropertyMetadata??=new WeakMap;var te=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Or){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(n,r,e);i!==void 0&&Mn(this.prototype,n,i)}}static getPropertyDescriptor(n,e,r){let{get:i,set:s}=In(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);s?.call(this,a),this.requestUpdate(n,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Or}static _$Ei(){if(this.hasOwnProperty(We("elementProperties")))return;let n=Wn(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(We("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(We("properties"))){let e=this.properties,r=[...jn(e),...zn(e)];for(let i of r)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let r=new Set(n.flat(1/0).reverse());for(let i of r)e.unshift(Gt(i))}else n!==void 0&&e.push(Gt(n));return e}static _$Eu(n,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(n.set(r,this[r]),delete this[r]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Dr(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,r){this._$AK(n,r)}_$ET(n,e){let r=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:Ue).toAttribute(e,r.type);this._$Em=n,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(n,e){let r=this.constructor,i=r._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Ue;this._$Em=i;let o=a.fromAttribute(e,s.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(n,e,r,i=!1,s){if(n!==void 0){let a=this.constructor;if(i===!1&&(s=this[n]),r??=a.getPropertyOptions(n),!((r.hasChanged??ht)(s,e)||r.useDefault&&r.reflect&&s===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,r))))return;this.C(n,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:r,reflect:i,wrapped:s},a){r&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),s!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||r||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:a}=s,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,s,o)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw n=!1,this._$EM(),r}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};te.elementStyles=[],te.shadowRootOptions={mode:"open"},te[We("elementProperties")]=new Map,te[We("finalized")]=new Map,Gn?.({ReactiveElement:te}),(ut.reactiveElementVersions??=[]).push("2.1.2");var Jt=globalThis,Nr=t=>t,pt=Jt.trustedTypes,Mr=pt?pt.createPolicy("lit-html",{createHTML:t=>t}):void 0,Gr="$lit$",de=`lit$${Math.random().toFixed(9).slice(2)}$`,Br="?"+de,Bn=`<${Br}>`,ye=document,Be=()=>ye.createComment(""),qe=t=>t===null||typeof t!="object"&&typeof t!="function",Xt=Array.isArray,qn=t=>Xt(t)||typeof t?.[Symbol.iterator]=="function",Bt=`[ 	
\f\r]`,Ge=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ir=/-->/g,jr=/>/g,ve=RegExp(`>|${Bt}(?:([^\\s"'>=/]+)(${Bt}*=${Bt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),zr=/'/g,Wr=/"/g,qr=/^(?:script|style|textarea|title)$/i,Zt=t=>(n,...e)=>({_$litType$:t,strings:n,values:e}),l=Zt(1),$l=Zt(2),wl=Zt(3),be=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),Ur=new WeakMap,_e=ye.createTreeWalker(ye,129);function Yr(t,n){if(!Xt(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Mr!==void 0?Mr.createHTML(n):n}var Yn=(t,n)=>{let e=t.length-1,r=[],i,s=n===2?"<svg>":n===3?"<math>":"",a=Ge;for(let o=0;o<e;o++){let c=t[o],h,p,f=-1,v=0;for(;v<c.length&&(a.lastIndex=v,p=a.exec(c),p!==null);)v=a.lastIndex,a===Ge?p[1]==="!--"?a=Ir:p[1]!==void 0?a=jr:p[2]!==void 0?(qr.test(p[2])&&(i=RegExp("</"+p[2],"g")),a=ve):p[3]!==void 0&&(a=ve):a===ve?p[0]===">"?(a=i??Ge,f=-1):p[1]===void 0?f=-2:(f=a.lastIndex-p[2].length,h=p[1],a=p[3]===void 0?ve:p[3]==='"'?Wr:zr):a===Wr||a===zr?a=ve:a===Ir||a===jr?a=Ge:(a=ve,i=void 0);let b=a===ve&&t[o+1].startsWith("/>")?" ":"";s+=a===Ge?c+Bn:f>=0?(r.push(h),c.slice(0,f)+Gr+c.slice(f)+de+b):c+de+(f===-2?o:b)}return[Yr(t,s+(t[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),r]},Ye=class t{constructor({strings:n,_$litType$:e},r){let i;this.parts=[];let s=0,a=0,o=n.length-1,c=this.parts,[h,p]=Yn(n,e);if(this.el=t.createElement(h,r),_e.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(i=_e.nextNode())!==null&&c.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let f of i.getAttributeNames())if(f.endsWith(Gr)){let v=p[a++],b=i.getAttribute(f).split(de),k=/([.?@])?(.*)/.exec(v);c.push({type:1,index:s,name:k[2],strings:b,ctor:k[1]==="."?Yt:k[1]==="?"?Kt:k[1]==="@"?Vt:Le}),i.removeAttribute(f)}else f.startsWith(de)&&(c.push({type:6,index:s}),i.removeAttribute(f));if(qr.test(i.tagName)){let f=i.textContent.split(de),v=f.length-1;if(v>0){i.textContent=pt?pt.emptyScript:"";for(let b=0;b<v;b++)i.append(f[b],Be()),_e.nextNode(),c.push({type:2,index:++s});i.append(f[v],Be())}}}else if(i.nodeType===8)if(i.data===Br)c.push({type:2,index:s});else{let f=-1;for(;(f=i.data.indexOf(de,f+1))!==-1;)c.push({type:7,index:s}),f+=de.length-1}s++}}static createElement(n,e){let r=ye.createElement("template");return r.innerHTML=n,r}};function Te(t,n,e=t,r){if(n===be)return n;let i=r!==void 0?e._$Co?.[r]:e._$Cl,s=qe(n)?void 0:n._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(t),i._$AT(t,e,r)),r!==void 0?(e._$Co??=[])[r]=i:e._$Cl=i),i!==void 0&&(n=Te(t,i._$AS(t,n.values),i,r)),n}var qt=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:r}=this._$AD,i=(n?.creationScope??ye).importNode(e,!0);_e.currentNode=i;let s=_e.nextNode(),a=0,o=0,c=r[0];for(;c!==void 0;){if(a===c.index){let h;c.type===2?h=new Ke(s,s.nextSibling,this,n):c.type===1?h=new c.ctor(s,c.name,c.strings,this,n):c.type===6&&(h=new Qt(s,this,n)),this._$AV.push(h),c=r[++o]}a!==c?.index&&(s=_e.nextNode(),a++)}return _e.currentNode=ye,i}p(n){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(n,r,e),e+=r.strings.length-2):r._$AI(n[e])),e++}},Ke=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,r,i){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=Te(this,n,e),qe(n)?n===T||n==null||n===""?(this._$AH!==T&&this._$AR(),this._$AH=T):n!==this._$AH&&n!==be&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):qn(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==T&&qe(this._$AH)?this._$AA.nextSibling.data=n:this.T(ye.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:r}=n,i=typeof r=="number"?this._$AC(n):(r.el===void 0&&(r.el=Ye.createElement(Yr(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(e);else{let s=new qt(i,this),a=s.u(this.options);s.p(e),this.T(a),this._$AH=s}}_$AC(n){let e=Ur.get(n.strings);return e===void 0&&Ur.set(n.strings,e=new Ye(n)),e}k(n){Xt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,i=0;for(let s of n)i===e.length?e.push(r=new t(this.O(Be()),this.O(Be()),this,this.options)):r=e[i],r._$AI(s),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let r=Nr(n).nextSibling;Nr(n).remove(),n=r}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Le=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,r,i,s){this.type=1,this._$AH=T,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=T}_$AI(n,e=this,r,i){let s=this.strings,a=!1;if(s===void 0)n=Te(this,n,e,0),a=!qe(n)||n!==this._$AH&&n!==be,a&&(this._$AH=n);else{let o=n,c,h;for(n=s[0],c=0;c<s.length-1;c++)h=Te(this,o[r+c],e,c),h===be&&(h=this._$AH[c]),a||=!qe(h)||h!==this._$AH[c],h===T?n=T:n!==T&&(n+=(h??"")+s[c+1]),this._$AH[c]=h}a&&!i&&this.j(n)}j(n){n===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Yt=class extends Le{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===T?void 0:n}},Kt=class extends Le{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==T)}},Vt=class extends Le{constructor(n,e,r,i,s){super(n,e,r,i,s),this.type=5}_$AI(n,e=this){if((n=Te(this,n,e,0)??T)===be)return;let r=this._$AH,i=n===T&&r!==T||n.capture!==r.capture||n.once!==r.once||n.passive!==r.passive,s=n!==T&&(r===T||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Qt=class{constructor(n,e,r){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(n){Te(this,n)}};var Kn=Jt.litHtmlPolyfillSupport;Kn?.(Ye,Ke),(Jt.litHtmlVersions??=[]).push("3.3.2");var Kr=(t,n,e)=>{let r=e?.renderBefore??n,i=r._$litPart$;if(i===void 0){let s=e?.renderBefore??null;r._$litPart$=i=new Ke(n.insertBefore(Be(),s),s,void 0,e??{})}return i._$AI(t),i};var er=globalThis,_=class extends te{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Kr(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return be}};_._$litElement$=!0,_.finalized=!0,er.litElementHydrateSupport?.({LitElement:_});var Vn=er.litElementPolyfillSupport;Vn?.({LitElement:_});(er.litElementVersions??=[]).push("4.2.2");var $=t=>(n,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(t,n)}):customElements.define(t,n)};var Qn={attribute:!0,type:String,converter:Ue,reflect:!1,hasChanged:ht},Jn=(t=Qn,n,e)=>{let{kind:r,metadata:i}=e,s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(e.name,t),r==="accessor"){let{name:a}=e;return{set(o){let c=n.get.call(this);n.set.call(this,o),this.requestUpdate(a,c,t,!0,o)},init(o){return o!==void 0&&this.C(a,void 0,t,o),o}}}if(r==="setter"){let{name:a}=e;return function(o){let c=this[a];n.call(this,o),this.requestUpdate(a,c,t,!0,o)}}throw Error("Unsupported decorator location: "+r)};function m(t){return(n,e)=>typeof e=="object"?Jn(t,n,e):((r,i,s)=>{let a=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),a?Object.getOwnPropertyDescriptor(i,s):void 0})(t,n,e)}function g(t){return m({...t,state:!0,attribute:!1})}function Vr(t,n){try{customElements.define(t,n)}catch{}}function q(t,n,e){let r=t?.localize?.(n);return r&&r!==n?r:e}function Ae(t){let n=t.replaceAll("_"," ").toLowerCase();return n.charAt(0).toUpperCase()+n.slice(1)}function tr(t){return Ae(t)}function Y(t,n){return q(t,`component.ambience.matcher.${n}`,tr(n))}function ft(t,n){return q(t,`component.ambience.action.${n}`,tr(n))}function Pe(t,n){return q(t,`component.ambience.anchor.${n}`,tr(n))}function $e(t,n,e){let r=e[n]?.label;if(r)return r;let i=n.charAt(0).toUpperCase()+n.slice(1);return q(t,`component.ambience.time_of_day_period.${n}`,i)}function d(t,n,e){return q(t,`component.ambience.${n}`,e)}var Xn=["mon","tue","wed","thu","fri","sat","sun"],Zn=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function gt(t,n){return q(t,`component.ambience.weekday.${Xn[n]}`,Zn[n]??String(n))}var es={weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"};function vt(t,n){return q(t,`component.ambience.day_item.${n}`,es[n]??n)}var ts=["January","February","March","April","May","June","July","August","September","October","November","December"];function Re(t,n){return q(t,`component.ambience.month.${n}`,ts[n-1]??String(n))}var rs={"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"};function _t(t,n){return q(t,`component.ambience.weather_condition.${n}`,rs[n]??n)}var is={temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"};function Ve(t,n){return q(t,`component.ambience.weather_attr.${n}`,is[n]??n)}var ns={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},ss={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},as={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function rr(t,n,e){if(n==="humidity")return"%";let r=as[n];if(r){let a=e?.attributes?.[r];if(typeof a=="string"&&a)return a}let i=ss[n],s=t?.config?.unit_system;return i&&s&&typeof s[i]=="string"?s[i]:ns[n]??""}var os={is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"};function K(t,n){return q(t,`component.ambience.state_op.${n}`,os[n]??n)}var ls=import.meta.url.slice(0,import.meta.url.lastIndexOf("/")+1);function Qr(t){return ls+t}function Jr(t={}){let n=t.title??"Ambience",e=t.dark?"dark_logo":"logo",r=Qr(`${e}.png`),i=Qr(`${e}@2x.png`);return l`<img
    class="ambience-logo"
    src=${r}
    srcset="${r} 1x, ${i} 2x"
    alt=${n}
  />`}var ds=["ha-input","ha-textfield","ha-form"],cs=["ha-input","ha-textfield"];function Xr(){for(let t of cs)if(customElements.get(t))return t;return null}function ce(t,n){for(let e of ds)customElements.get(e)||customElements.whenDefined(e).then(()=>t.requestUpdate())}var ir=[{id:"red",label:"Red",hex:"#f44336"},{id:"pink",label:"Pink",hex:"#e91e63"},{id:"purple",label:"Purple",hex:"#9c27b0"},{id:"deep-purple",label:"Deep purple",hex:"#673ab7"},{id:"indigo",label:"Indigo",hex:"#3f51b5"},{id:"blue",label:"Blue",hex:"#2196f3"},{id:"light-blue",label:"Light blue",hex:"#03a9f4"},{id:"cyan",label:"Cyan",hex:"#00bcd4"},{id:"teal",label:"Teal",hex:"#009688"},{id:"green",label:"Green",hex:"#4caf50"},{id:"light-green",label:"Light green",hex:"#8bc34a"},{id:"lime",label:"Lime",hex:"#cddc39"},{id:"yellow",label:"Yellow",hex:"#ffeb3b"},{id:"amber",label:"Amber",hex:"#ffc107"},{id:"orange",label:"Orange",hex:"#ff9800"},{id:"deep-orange",label:"Deep orange",hex:"#ff5722"},{id:"brown",label:"Brown",hex:"#795548"},{id:"grey",label:"Grey",hex:"#9e9e9e"},{id:"blue-grey",label:"Blue grey",hex:"#607d8b"}];function nr(t){if(t)return ir.find(n=>n.id===t)?.hex}function us(t){let n=t.replace("#",""),e=parseInt(n.slice(0,2),16)/255,r=parseInt(n.slice(2,4),16)/255,i=parseInt(n.slice(4,6),16)/255,s=o=>o<=.03928?o/12.92:((o+.055)/1.055)**2.4;return .2126*s(e)+.7152*s(r)+.0722*s(i)>.5?"#000000":"#ffffff"}function yt(t){let n=nr(t);return n?`background:${n};color:${us(n)}`:""}var bt=y`
  .group-swatch {
    flex: 0 0 auto;
    width: var(--group-swatch-size, 2rem);
    height: var(--group-swatch-size, 2rem);
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--secondary-background-color, #e0e0e0);
    color: var(--secondary-text-color, #555);
  }
  .group-swatch ha-icon {
    --mdc-icon-size: var(--group-swatch-icon-size, 20px);
  }
`;function He(t,n){return l`<span class="group-swatch" style=${yt(t)}>
    ${n?l`<ha-icon icon=${n}></ha-icon>`:""}
  </span>`}function Q(t){return t.kind==="house"?"house":`${t.kind}:${t.id}`}function Zr(t,n){if(!n||n.entity==null)return[...t];let e=Array.isArray(n.entity)?n.entity:[n.entity];if(e.length===0)return[...t];let r=new Set,i=!1;for(let s of e){if(!s||typeof s!="object")continue;let a=s.domain;if(a==null){i=!0;continue}if(Array.isArray(a))for(let o of a)typeof o=="string"&&r.add(o);else typeof a=="string"&&r.add(a)}return i||r.size===0?[...t]:t.filter(s=>{let a=s.indexOf(".");return a<0?!1:r.has(s.slice(0,a))})}function $t(t,n,e=[]){let r=t;if(!r?.entities)return[];let i=r.entities,s=r.devices??{},a=r.areas??{},o=n.kind==="area"?new Set([n.id]):n.kind==="floor"?new Set(Object.values(a).filter(h=>h.floor_id===n.id).map(h=>h.area_id)):null,c=h=>{let p=h.area_id??(h.device_id?s[h.device_id]?.area_id??null:null);return p==null?!1:o===null?!0:o.has(p)};return Object.values(i).filter(c).filter(h=>e.length===0||e.includes(h.entity_id.split(".")[0])).map(h=>h.entity_id).sort()}function Qe(t){let{priority:n,pinned:e,shadowed_by:r,...i}=t;return i}async function wt(t){return t.callWS({type:"ambience/areas/list"})}async function xt(t,n){return t.callWS({type:"ambience/area/get",area_id:n})}async function ei(t,n,e){return t.callWS({type:"ambience/area/save",area_id:n,config:e})}async function kt(t){return t.callWS({type:"ambience/floors/list"})}async function Et(t,n){return t.callWS({type:"ambience/floor/get",floor_id:n})}async function ti(t,n,e){return t.callWS({type:"ambience/floor/save",floor_id:n,config:e})}async function St(t){return t.callWS({type:"ambience/house/get"})}async function ri(t,n){return t.callWS({type:"ambience/house/save",config:n})}async function Ct(t){return t.callWS({type:"ambience/matchers/list"})}async function Je(t){return t.callWS({type:"ambience/exposed_actions/list"})}async function ii(t,n){return t.callWS({type:"ambience/exposed_actions/save",actions:n})}async function ni(t){return t.callWS({type:"ambience/services/list"})}async function De(t,n){return t.callWS({type:"ambience/services/get_schema",service:n})}function si(t){return t.kind==="area"?{area_id:t.id}:t.kind==="floor"?{floor_id:t.id}:{house:!0}}async function ai(t,n,e){let r={type:"ambience/apply",...si(n)};return e!==void 0&&(r.group_id=e),t.callWS(r)}async function oi(t,n,e){return t.callWS({type:"ambience/rule/run_actions",rule_index:e,...si(n)})}async function Tt(t){return t.callWS({type:"ambience/time_of_day_periods/list"})}async function li(t,n,e){return t.callWS({type:"ambience/time_of_day_periods/save",custom:n,hidden:e})}async function Lt(t){return t.callWS({type:"ambience/matchers/day/config/list"})}async function di(t,n,e){return t.callWS({type:"ambience/matchers/day/config/save",workday_sensor:n,workday_calendar:e})}async function At(t){return t.callWS({type:"ambience/matchers/weather/config/list"})}async function ci(t,n,e){return t.callWS({type:"ambience/matchers/weather/config/save",entity:n,groups:e})}async function ui(t,n){return t.callWS({type:"ambience/state/known_states",entity_id:n})}async function hi(t){return t.callWS({type:"ambience/switch_defaults/list"})}async function pi(t){return t.callWS({type:"ambience/switches/list"})}async function sr(t,n,e){return t.callWS({type:"ambience/switch_defaults/save",name:n,auto_on_delay_seconds:e})}async function mi(t,n,e){return t.callWS({type:"ambience/house/switch/save",name:n,auto_on_delay_seconds:e})}async function fi(t,n,e,r){return t.callWS({type:"ambience/floor/switch/save",floor_id:n,name:e,auto_on_delay_seconds:r})}async function gi(t,n,e,r){return t.callWS({type:"ambience/area/switch/save",area_id:n,name:e,auto_on_delay_seconds:r})}async function vi(t,n,e,r){let i={type:"ambience/auto_triggers/set",scope_kind:n,enabled:r};return e!=null&&(i.scope_id=e),t.callWS(i)}async function Pt(t){return(await t.callWS({type:"ambience/groups/list"})).groups}async function _i(t,n){return t.callWS({type:"ambience/groups/save",groups:n})}async function yi(t,n){return t.callWS({type:"ambience/groups/delete",group_id:n})}async function ar(t){return(await t.callWS({type:"ambience/traces/list"})).traces}async function bi(t,n){return t.callWS({type:"ambience/script/referenced_entities",script:n})}async function $i(t,n,e){let r={type:"ambience/auto_triggers/list",scope_kind:n};return e!=null&&(r.scope_id=e),t.callWS(r)}async function wi(t,n,e,r,i){let s={type:"ambience/auto_triggers/set_trigger",scope_kind:n,key:r,enabled:i};return e!=null&&(s.scope_id=e),t.callWS(s)}function ur(t,n,e){if(n&&e){let r=e[n]?.fields?.[t];if(r&&typeof r=="object"){let i=r.name;if(typeof i=="string"&&i)return i}}return Ze(t)}function Rt(t,n="New rule"){return t.name&&t.name.trim()?t.name:n}function Xe(t,n,e){return n==null?d(e.hass,"ui.summary_any_paren","(any)"):t==="time_of_day"?Dt(n,e):t==="day"?fs(n,e):t==="weather"?_s(n,e):t==="sun"?ys(n,e):t==="state"?hr(n,e):t==="script"?ps(n,e):t==="people"?ms(n,e):t==="template"?hs(n,e):String(n)}function hs(t,n={}){return t===null?d(n.hass,"ui.summary_any_paren","(any)"):typeof t!="object"||typeof t.template!="string"?String(t):t.template}function ps(t,n={}){if(t===null)return d(n.hass,"ui.summary_any_paren","(any)");if(typeof t!="object"||t===null||typeof t.script!="string")return String(t);let e=t.args??{},r=Object.keys(e).sort();if(r.length===0)return t.script;let i=r.map(s=>`${s}=${e[s]}`).join(", ");return`${t.script}(${i})`}function or(t,n){let r=t.hass?.states?.[n]?.attributes?.friendly_name;if(typeof r=="string"&&r)return r;let i=n.indexOf("."),s=i>=0?n.slice(i+1):n;return s.charAt(0).toUpperCase()+s.slice(1)}function xi(t,n){return t==="home"?d(n.hass,"people_summary.home","Home"):or(n,t)}function ms(t,n={}){if(t==null)return d(n.hass,"ui.summary_any","any");let e=t.where??"home";if(Array.isArray(t.who)&&t.who.length===1){let a=or(n,t.who[0]),c=t.quant==="nobody"!=!!t.negate?d(n.hass,"people_summary.is_not_at","is not at"):d(n.hass,"people_summary.is_at","is at"),h=`${a} ${c} ${xi(e,n)}`;return t.for&&dr(t.for)?`${h} ${d(n.hass,"ui.for_prefix","for")} \u2265${cr(t.for)}`:h}let r;if(Array.isArray(t.who)){let a=t.quant??"any",o=a==="any"?d(n.hass,"ui.people_mode_any","Any of:"):a==="everyone"?d(n.hass,"ui.people_mode_all","All of:"):d(n.hass,"ui.people_mode_none","None of:"),c=t.who.map(h=>or(n,h)).join(", ");r=`${o} (${c})`}else{let a=t.quant??"everyone";r=a==="nobody"?d(n.hass,"ui.people_mode_nobody","Nobody"):a==="any"?d(n.hass,"ui.people_mode_anybody","Anybody"):d(n.hass,"ui.people_mode_everybody","Everybody")}let i=t.negate?d(n.hass,"people_summary.is_not_at","is not at"):d(n.hass,"people_summary.is_at","is at"),s=`${r} ${i} ${xi(e,n)}`;return t.for&&dr(t.for)?`${s} ${d(n.hass,"ui.for_prefix","for")} \u2265${cr(t.for)}`:s}function fs(t,n={}){if(t===null)return d(n.hass,"day_summary.any","any");let e=t.include??[],r=t.exclude??[],i=e.length===0?d(n.hass,"day_summary.any_day","any day"):e.map(a=>ki(a,n)).join(", ");if(r.length===0)return i;let s=d(n.hass,"day_summary.except","except");return`${i} (${s} ${r.map(a=>ki(a,n)).join(", ")})`}function ki(t,n){switch(t.kind){case"weekday":return t.days.map(e=>gt(n.hass,e)).join("/");case"day_of_month":return`${d(n.hass,"day_summary.day_prefix","Day")} ${t.days}`;case"date":return`${Re(n.hass,t.month)} ${t.day}`;case"date_range":return`${Re(n.hass,t.from.month)} ${t.from.day} \u2192 ${Re(n.hass,t.to.month)} ${t.to.day}`;case"last_day":return d(n.hass,"day_summary.last_day","Last day");case"workday":return d(n.hass,"day_summary.workday","Workday");case"holiday":return d(n.hass,"day_summary.holiday","Holiday");case"first_workday":return d(n.hass,"day_summary.first_workday","First workday");case"last_workday":return d(n.hass,"day_summary.last_workday","Last workday")}}var gs={"<":"<","<=":"\u2264",">":">",">=":"\u2265"};function Ze(t){return Ae(t)}function et(t){return typeof t=="string"?t:typeof t=="number"||typeof t=="boolean"?String(t):JSON.stringify(t)}function Ht(t){if(!(!t||typeof t!="object")){for(let n of Object.values(t))if(n&&typeof n=="object"){let e=n.unit_of_measurement;if(typeof e=="string"&&e)return e}}}function vs(t){return t.split(/[\s_-]+/).filter(n=>n!=="").map(n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()).join(" ")}function _s(t,n={}){if(t===null)return d(n.hass,"ui.summary_any","any");let e=new Map((n.weatherGroups??[]).map(a=>[a.id,a.label])),r=(t.groups??[]).map(a=>e.get(a)??vs(a)).join("/"),i=(t.thresholds??[]).map(a=>`${Ve(n.hass,a.attribute)} ${gs[a.op]??a.op} ${a.value}`).join(", "),s=[r,i].filter(a=>a!=="");return s.length===0?d(n.hass,"ui.summary_any","any"):s.join(", ")}function ys(t,n={}){if(t===null)return d(n.hass,"ui.summary_any","any");let e=[],r=t.elevation;r&&(r.min!=null&&r.max!=null?e.push(`${r.min}\xB0\u2013${r.max}\xB0`):r.min!=null?e.push(`\u2265${r.min}\xB0`):r.max!=null&&e.push(`\u2264${r.max}\xB0`));let i=t.azimuth;if(i){i.sectors?.length&&e.push(i.sectors.join("/"));for(let s of i.ranges??[])e.push(`${s.from}\xB0\u2013${s.to}\xB0`)}return e.length===0?d(n.hass,"ui.summary_any","any"):e.join(", ")}function bs(t,n){let r=t.hass?.states?.[n]?.attributes?.friendly_name;return typeof r=="string"&&r?r:n}function hr(t,n={}){return t==null?d(n.hass,"ui.summary_any","any"):lr(t,n)}function lr(t,n){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<="){let e=K(n.hass,t.kind),i=t.kind!=="is"&&t.kind!=="is_not"?t.states[0]??"":t.states.join("/"),s=bs(n,t.entity_id),o=`${t.attribute?`${s}.${t.attribute}`:s} ${e} ${i}`;return t.for&&dr(t.for)?`${o} ${d(n.hass,"ui.for_prefix","for")} \u2265${cr(t.for)}`:o}if(t.kind==="and"||t.kind==="or"){let e=` ${K(n.hass,t.kind)} `;return t.items.map(r=>Ei(r,n)).join(e)}return t.kind==="not"?`${K(n.hass,"not")} ${Ei(t.item,n)}`:""}function Ei(t,n){return t.kind==="and"||t.kind==="or"?`(${lr(t,n)})`:lr(t,n)}function dr(t){return t.h>0||t.m>0||t.s>0}function cr(t){let n=[];return t.h&&n.push(`${t.h}h`),t.m&&n.push(`${t.m}m`),t.s&&n.push(`${t.s}s`),n.length?n.join(" "):"0s"}function Dt(t,n){if(t===null)return d(n.hass,"ui.summary_any","any");let e=Array.isArray(t)?t:[t],r=n.periods?.custom??{};return e.map(i=>"period"in i?$e(n.hass,i.period,r):`${Si(i.from,n)} \u2192 ${Si(i.to,n)}`).join(", ")}function Si(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=Pe(n.hass,t.anchor);if(t.offset_min===0)return e;let r=Math.abs(t.offset_min),i=r%60===0?`${r/60}${d(n.hass,"ui.unit_hour_abbr","h")}`:`${r}${d(n.hass,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${i}`}function $s(t,n){let e=n.exposedActions?.find(r=>r.id===t.service);return e?.label&&e.label.trim()?e.label:ft(n.hass,t.service)}function ws(t,n){let e=t.service.indexOf(".");return e>0?t.service.slice(0,e):d(n.hass,"ui.target_noun","target")}function Ci(t,n){let e=$s(t,n),r=ws(t,n),i=t.entity_ids.length,s;i===0?s=d(n.hass,"ui.no_targets","(no targets)"):i===1?s=`1 ${r}`:s=`${i} ${r}s`;let a=Object.entries(t.params).filter(([,o])=>o!=null&&o!=="").map(([o,c])=>`${ur(o,t.service,n.schemas)}: ${et(c)}`).join(", ");return a?`${e}: ${s}, ${a}`:`${e}: ${s}`}var Fe=class{constructor(n,e){this.host=n;this.onReorder=e;this.from=null;this.over=null;n.addController(this)}hostDisconnected(){this._reset()}start(n,e,r){this.from=n,e?.dataTransfer&&r&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setDragImage(r,16,16)),this.host.requestUpdate()}dragOver(n,e){this.from===null||e===this.from||(n.preventDefault(),this.over!==e&&(this.over=e,this.host.requestUpdate()))}drop(n){let e=this.from;this._reset(),!(e===null||e===n)&&this.onReorder(e,n)}end(){this._reset()}_reset(){let n=this.from!==null||this.over!==null;this.from=null,this.over=null,n&&this.host.requestUpdate()}};var O=class extends _{constructor(){super(...arguments);this.rules=[];this.availableActions=[];this.schemas={};this.groups=[];this.filterGroup="";this._drag=new Fe(this,(e,r)=>this._emit("reorder-rules",{from:e,to:r}));this._expanded=new Set}_renderSectionHeader(e){return l`<div class="group-section-header" style=${yt(e.color)}>
      ${e.icon?l`<ha-icon icon=${e.icon}></ha-icon>`:""}
      <span>${e.name}</span>
      <button
        class="apply-group"
        @click=${r=>{r.stopPropagation(),this._emit("apply-group",{groupId:e.id})}}
        title=${d(this.hass,"ui.apply_group","Apply this group")}
      >
        ▶
      </button>
      <button
        class="traces-btn"
        title=${d(this.hass,"ui.view_traces","View traces")}
        aria-label=${d(this.hass,"ui.view_traces","View traces")}
        @click=${r=>{r.stopPropagation(),this._emit("show-traces",{group:e.id})}}
      ><ha-icon icon="mdi:history"></ha-icon></button>
    </div>`}_sections(){let e=this.rules.map((i,s)=>[s,i]);if(this.filterGroup!=="")return[{group:this.groups.find(i=>i.id===this.filterGroup),rows:e.filter(([,i])=>i.group===this.filterGroup)}];let r=new Map;for(let[i,s]of e){let a=r.get(s.group)??[];a.push([i,s]),r.set(s.group,a)}return[...r.entries()].map(([i,s])=>({group:this.groups.find(a=>a.id===i),rows:s})).sort((i,s)=>(i.group?.name??"").localeCompare(s.group?.name??""))}_emit(e,r){this.dispatchEvent(new CustomEvent(e,{detail:r,bubbles:!0,composed:!0}))}_whenKeys(e){let r=new Map((this.matchers??[]).map(i=>[i.name,i.priority]));return Object.keys(e.when).filter(i=>e.when[i]!=null).sort((i,s)=>(r.get(s)??-1/0)-(r.get(i)??-1/0))}_whenSummary(e){let r=this._whenKeys(e);return r.length===0?d(this.hass,"ui.summary_any","any"):r.map((i,s)=>{let a=Y(this.hass,i),o=Xe(i,e.when[i],{hass:this.hass,periods:this.periods,weatherGroups:this.weatherConfig?.groups});return l`${s===0?"":", "}<strong>${a}:</strong> ${o}`})}_whenStacked(e){let r=this._whenKeys(e);return r.length===0?l`<div class="matcher-line">${d(this.hass,"ui.summary_any","any")}</div>`:r.map(i=>{let s=Y(this.hass,i),a=Xe(i,e.when[i],{hass:this.hass,periods:this.periods,weatherGroups:this.weatherConfig?.groups});return l`<div class="matcher-line"><strong>${s}:</strong> ${a}</div>`})}_actionCountLabel(e){let r=e.actions.length,i=r===1?d(this.hass,"ui.action_singular","action"):d(this.hass,"ui.action_plural","actions");return`${r} ${i}`}_toggleRule(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):r.add(e),this._expanded=r}_entityName(e){let i=this.hass?.states?.[e]?.attributes?.friendly_name;return typeof i=="string"&&i?i:e}_actionParamsString(e){return Object.entries(e.params).filter(([,r])=>r!=null&&r!=="").map(([r,i])=>`${ur(r,e.service,this.schemas)}: ${et(i)}`).join(", ")}_actionLabel(e){let r=this.availableActions.find(i=>i.id===e.service);return r?.label&&r.label.trim()?r.label:ft(this.hass,e.service)}_confirmDelete(e,r,i){let s=r.name||d(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(i));window.confirm(d(this.hass,"ui.confirm_delete",'Delete "{name}"?').replace("{name}",s))&&this._emit("delete-rule",{index:e})}_renderRow(e,r,i){let s=d(this.hass,"ui.unpin","Unpin (return to automatic order)");return l`
      <li
        class="${this._drag.over===e?"drag-over ":""}${r.enabled===!1?"disabled":""}"
        draggable="true"
        @dragstart=${()=>this._drag.start(e)}
        @dragover=${a=>this._drag.dragOver(a,e)}
        @drop=${()=>this._drag.drop(e)}
        @dragend=${()=>this._drag.end()}
      >
        <span class="lead">
          ${r.pinned?l`<button
                class="pin"
                title=${s}
                aria-label=${s}
                @click=${a=>{a.stopPropagation(),this._emit("unpin-rule",{index:e})}}
              >📌</button>`:l`<span class="handle" title=${d(this.hass,"ui.drag_to_reorder","Drag to reorder")}>⠿</span>`}
        </span>
        <span class="idx">${i}</span>
        <span class="warn-slot">
          ${r.shadowed_by!=null&&r.enabled!==!1?l`<span
                class="shadow-warning"
                title=${d(this.hass,"ui.shadowed","Never fires \u2014 shadowed by an earlier rule.")}
              >⚠️</span>`:""}
        </span>
        <div class="body" @click=${()=>this._toggleRule(e)}>
          <div class="name">
            ${Rt(r,d(this.hass,"ui.rule_n","Rule {n}").replace("{n}",String(i)))}
          </div>
          <div class="summary">
            ${this._expanded.has(e)?"":l`${this._whenSummary(r)} · <span class="action-count">${this._actionCountLabel(r)}</span>`}
          </div>
          ${this._expanded.has(e)?l`
                <div class="rule-detail">
                  ${this._whenStacked(r)}
                  ${r.actions.length===0?"":l`<div class="actions-detail">
                        ${r.actions.map(a=>{let o=this._actionParamsString(a),c=this._actionLabel(a),h=o?`${c} \xB7 ${o}`:c;return l`
                            <div class="actions-detail-item">
                              <div class="action-header">${h}</div>
                              ${a.entity_ids.length===0?l`<div class="no-targets">${d(this.hass,"ui.no_targets","(no targets)")}</div>`:l`<ul class="entity-list">
                                    ${a.entity_ids.map(p=>l`<li>${this._entityName(p)}</li>`)}
                                  </ul>`}
                            </div>
                          `})}
                      </div>`}
                </div>
              `:""}
        </div>
        <button
          class="toggle"
          @click=${a=>{a.stopPropagation(),this._emit("toggle-rule-enabled",{index:e,enabled:r.enabled===!1})}}
          title=${r.enabled===!1?d(this.hass,"ui.enable_rule","Enable rule"):d(this.hass,"ui.disable_rule","Disable rule")}
          aria-label=${r.enabled===!1?d(this.hass,"ui.enable_rule","Enable rule"):d(this.hass,"ui.disable_rule","Disable rule")}
        >
          <ha-icon icon=${r.enabled===!1?"mdi:toggle-switch-off-outline":"mdi:toggle-switch"}></ha-icon>
        </button>
        <button
          @click=${a=>{a.stopPropagation(),this._emit("edit-rule",{index:e})}}
          title=${d(this.hass,"ui.edit","Edit")}
        >
          ✎
        </button>
        <button
          @click=${a=>{a.stopPropagation(),this._emit("duplicate-rule",{index:e})}}
          title=${d(this.hass,"ui.duplicate","Duplicate")}
        >
          ⧉
        </button>
        <button
          class="run"
          @click=${a=>{a.stopPropagation(),this._emit("run-rule-actions",{index:e})}}
          title=${d(this.hass,"ui.run_actions","Run actions")}
        >
          ▶
        </button>
        <button
          @click=${a=>{a.stopPropagation(),this._confirmDelete(e,r,i)}}
          title=${d(this.hass,"ui.title_delete","Delete")}
        >
          🗑
        </button>
      </li>
    `}render(){if(this.rules.length===0)return l`
        <p class="empty">${d(this.hass,"ui.no_rules_yet","No rules yet.")}</p>
        <button class="add" @click=${()=>this._emit("add-rule",{})}>
          ${d(this.hass,"ui.add_rule","+ Add rule")}
        </button>
      `;let e=this._sections().filter(i=>i.rows.length>0),r=this.groups.length>0;return l`
      ${e.map(i=>l`
          <div class="group-section">
            ${r&&i.group?this._renderSectionHeader(i.group):""}
            <ul>
              ${i.rows.map(([s,a],o)=>this._renderRow(s,a,o+1))}
            </ul>
          </div>
        `)}
      <button class="add" @click=${()=>this._emit("add-rule",{})}>
        ${d(this.hass,"ui.add_rule","+ Add rule")}
      </button>
    `}};O.styles=y`
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
    li.disabled .body,
    li.disabled .idx {
      opacity: 0.5;
    }
    .toggle {
      padding: 0.25rem 0.5rem;
    }
    .toggle ha-icon {
      --mdc-icon-size: 20px;
    }
    .handle {
      cursor: grab;
      color: var(--secondary-text-color, #888);
      user-select: none;
    }
    .idx {
      font-family: monospace;
      color: var(--secondary-text-color, #888);
      margin-right: 0.25rem;
      /* Wide enough for two digits — we don't expect >99 rules. */
      min-width: 1.4em;
      text-align: right;
    }
    .body {
      flex: 1;
      cursor: pointer;
    }
    .name {
      font-weight: 600;
    }
    .summary {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .rule-detail {
      margin-top: 0.35rem;
      padding-left: 0.75rem;
      border-left: 2px solid var(--divider-color, #e0e0e0);
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .matcher-line {
      padding: 0.05rem 0;
      /* Wrap continuation lines indented to align under the matcher body
         (after the bold "Matcher:" label). */
      padding-left: 1.25rem;
      text-indent: -1.25rem;
    }
    .actions-detail {
      margin-top: 0.35rem;
      padding-top: 0.35rem;
      border-top: 1px dashed var(--divider-color, #e0e0e0);
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
    /* The lead slot holds either the drag handle (unpinned) or the pin button
       (pinned) — one fixed width, so swapping them never shifts the row. */
    .lead {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 1.5em;
    }
    /* Fixed-width slot for the shadow warning so the title aligns whether or
       not a row is shadowed. */
    .warn-slot {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      flex: 0 0 1.4em;
    }
    .pin {
      padding: 0;
    }
    .shadow-warning {
      color: var(--error-color, #db4437);
      cursor: help;
      line-height: 1;
    }
    /* Full-width coloured bar before each group's rules. The colour + text
       colour are set inline per group; this rule carries layout + the neutral
       fallback used when a group has no colour. */
    .group-section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      box-sizing: border-box;
      padding: 0.4rem 0.75rem;
      margin: 0.75rem 0 0.5rem 0;
      border-radius: 4px;
      font-weight: 600;
      background: var(--secondary-background-color, #e0e0e0);
      color: var(--primary-text-color, #212121);
    }
    .group-section:first-of-type .group-section-header {
      margin-top: 0;
    }
    .group-section-header ha-icon {
      --mdc-icon-size: 20px;
    }
    .group-section-header .apply-group {
      margin-left: auto;
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      padding: 0 0.25rem;
      line-height: 1;
    }
    .traces-btn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 0 0.25rem;
      display: inline-flex;
      align-items: center;
    }
    .traces-btn ha-icon {
      --mdc-icon-size: 18px;
    }
  `,u([m({attribute:!1})],O.prototype,"rules",2),u([m({attribute:!1})],O.prototype,"periods",2),u([m({attribute:!1})],O.prototype,"weatherConfig",2),u([m({attribute:!1})],O.prototype,"hass",2),u([m({attribute:!1})],O.prototype,"matchers",2),u([m({attribute:!1})],O.prototype,"availableActions",2),u([m({attribute:!1})],O.prototype,"schemas",2),u([m({attribute:!1})],O.prototype,"groups",2),u([m({attribute:!1})],O.prototype,"filterGroup",2),u([g()],O.prototype,"_expanded",2),O=u([$("ambience-rules-list")],O);function Ti(t,n){let e=t.trim();if(e==="")return null;let r=Number(e);return isNaN(r)?null:r<=0?n?0:null:Math.max(10,Math.round(r))}function Li(t){return Ti(t,!1)}function Ai(t){return Ti(t,!0)}function Pi(t,n){return"reapply_seconds"in t?t.reapply_seconds??0:n}function Ri(t){return t%60===0?`${t/60} min`:t<60?`${t} sec`:`${Math.floor(t/60)} min ${t%60} sec`}var J=class extends _{constructor(){super(...arguments);this.entities=[];this.value=[];this.target=null;this.label=" "}_filteredEntities(){return Zr(this.entities,this.target)}connectedCallback(){super.connectedCallback(),ce(this,this.hass)}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let r=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this._filteredEntities()}}}],i=this.label;return l`
      <ha-form
        .hass=${this.hass}
        .schema=${r}
        .data=${{entity_ids:this.value}}
        .computeLabel=${()=>i}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,r){let i=new Set(this.value);r?i.add(e):i.delete(e),this._emit(this._filteredEntities().filter(s=>i.has(s)))}_renderFallback(){let e=this._filteredEntities();return e.length===0?l`<p class="empty">${d(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:l`
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
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};J.styles=y`
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
  `,u([m({attribute:!1})],J.prototype,"hass",2),u([m({attribute:!1})],J.prototype,"entities",2),u([m({attribute:!1})],J.prototype,"value",2),u([m({attribute:!1})],J.prototype,"target",2),u([m()],J.prototype,"label",2),J=u([$("ambience-target-picker")],J);var N=class extends _{constructor(){super(...arguments);this.entityIds=[];this.params={};this._schema=void 0;this._schemaError=null;this._exposedMissing=!1;this._formSchema=[];this._perFieldSchemas={};this._schemaServiceId=null;this._onTargetChanged=e=>{e.stopPropagation(),this._emit("entity-ids-changed",{entityIds:e.detail.value})};this._onFieldInput=e=>r=>{r.stopPropagation();let i=r.target,s={...this.params,[e]:i.value};this._emit("params-changed",{params:s})};this._onHaFormChanged=e=>{e.stopPropagation(),this._emit("params-changed",{params:{...this.params,...e.detail.value}})}}connectedCallback(){super.connectedCallback(),ce(this,this.hass)}willUpdate(e){if((e.has("exposed")&&e.get("exposed")?.id!==this.exposed?.id||e.has("hass")&&this._schema===void 0)&&this._loadSchema(),(e.has("exposed")||e.has("_schema"))&&(this._formSchema=this._buildFormSchema()),e.has("_formSchema")||e.has("_schema")||e.has("exposed")){let r={};for(let i of this._formSchema)r[i.name]=[i];this._perFieldSchemas=r}}async _loadSchema(){if(this.exposed===void 0&&this.hass){this._exposedMissing=!0,this._schema=null,this._schemaServiceId=null;return}let e=this.exposed?.id;if(!e||!this.hass){this._exposedMissing=!1,this._schema=void 0,this._schemaServiceId=null;return}this._exposedMissing=!1,this._schemaServiceId=e,this._schemaError=null,this._schema=void 0;try{let r=await De(this.hass,e);if(this._schemaServiceId!==e)return;this._schema=r}catch(r){if(this._schemaServiceId!==e)return;this._schema=null,this._schemaError=r instanceof Error?r.message:String(r)}}_buildFormSchema(){let e=this._schema,r=this.exposed;if(!e||!r)return[];let i=new Set(r.visible_fields??[]),s=[];for(let[a,o]of Object.entries(e.fields))i.has(a)&&s.push({name:a,selector:o.selector??{text:{}},required:!!o.required,description:typeof o.description=="string"&&o.description?o.description:void 0});return s}updated(e){super.updated?.(e),e.has("_schema")&&this.dispatchEvent(new CustomEvent("target-mode-changed",{detail:{hasTarget:this.hasTarget()},bubbles:!0,composed:!0}))}_hasTarget(){let e=this._schema?.target??null;return!e||typeof e!="object"?!1:Object.keys(e).length>0}hasTarget(){return this._schema===void 0?!1:this._hasTarget()}_scopeEntities(){return!this.scope||!this.hass?[]:$t(this.hass,this.scope,[])}_renderTargetPicker(){if(!this._hasTarget())return"";let e=this._scopeEntities(),r=this._schema?.target??null,i=d(this.hass,"ui.target","Target");return l`
      <div class="target-picker field-row">
        <div class="field-header">
          <span class="field-label">${i}</span>
        </div>
        <ambience-target-picker
          .hass=${this.hass}
          .entities=${e}
          .target=${r}
          .value=${this.entityIds}
          .label=${" "}
          @value-changed=${this._onTargetChanged}
        ></ambience-target-picker>
      </div>
    `}_humanizeFieldLabel(e){let r=this._schema?.fields[e];return r?.name?r.name:Ze(e)}_clearField(e){if(!(e in this.params))return;let r={...this.params};delete r[e],this._emit("params-changed",{params:r})}_extraParamKeys(){let e=new Set;for(let r of this._formSchema)e.add(r.name);for(let r of Object.keys(this.exposed?.defaults??{}))e.add(r);return Object.keys(this.params).filter(r=>!e.has(r))}_clearExtraParams(){let e=new Set(this._extraParamKeys());if(e.size===0)return;let r={};for(let[i,s]of Object.entries(this.params))e.has(i)||(r[i]=s);this._emit("params-changed",{params:r})}_fieldData(e){return e in this.params?{[e]:this.params[e]}:{}}_defaultHintSuffix(e){let r=this.exposed?.defaults??{};if(!(e.name in r))return"";let i=Ht(e.selector);return` (Default: ${et(r[e.name])}${i?` ${i}`:""})`}_hasUserOverride(e){return e in this.params}_renderExtraParamsNotice(){let e=this._extraParamKeys();if(e.length===0)return"";let r=e.join(", ");return l`
      <div class="extra-params-notice" data-extra-params>
        <span>
          ${d(this.hass,"ui.extra_fields_prefix","Extra fields:")} ${r}.
          ${d(this.hass,"ui.extra_fields_hint","These fields aren't currently exposed but will still be sent.")}
        </span>
        <button data-remove-extras @click=${()=>this._clearExtraParams()}>
          ${d(this.hass,"ui.remove","Remove")}
        </button>
      </div>
    `}_renderFieldsForm(){let e=this._formSchema,r=this._renderExtraParamsNotice();return e.length===0?r===""?"":l`<div class="fields-form">${r}</div>`:customElements.get("ha-form")?l`
        <div class="fields-form">
          ${e.map(i=>{let s=this._perFieldSchemas[i.name]??[i],a=this._fieldData(i.name),o=this._defaultHintSuffix(i);return l`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <span class="field-label">${this._humanizeFieldLabel(i.name)}${i.required?" *":""}</span>${o?l`<span class="field-default-hint">${o}</span>`:""}
                  </span>
                  ${this._hasUserOverride(i.name)?l`<button
                        class="field-clear"
                        data-clear=${i.name}
                        @click=${()=>this._clearField(i.name)}
                        title="Clear"
                      >✕</button>`:""}
                </div>
                <ha-form
                  .hass=${this.hass}
                  .schema=${s}
                  .data=${a}
                  .computeLabel=${()=>""}
                  @value-changed=${this._onHaFormChanged}
                ></ha-form>
              </div>
            `})}
          ${r}
        </div>
      `:l`
      <div class="fields-form">
        ${e.map(i=>{let s=this._fieldData(i.name),a=i.name in s?String(s[i.name]??""):"",o=this._defaultHintSuffix(i);return l`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <label class="field-label">${this._humanizeFieldLabel(i.name)}${i.required?" *":""}</label>${o?l`<span class="field-default-hint">${o}</span>`:""}
                  </span>
                  ${this._hasUserOverride(i.name)?l`<button
                        class="field-clear"
                        data-clear=${i.name}
                        @click=${()=>this._clearField(i.name)}
                        title="Clear"
                      >✕</button>`:""}
                </div>
                <input
                  type="text"
                  data-field=${i.name}
                  .value=${a}
                  @input=${this._onFieldInput(i.name)}
                />
              </div>
            `})}
        ${r}
      </div>
    `}_emit(e,r){this.dispatchEvent(new CustomEvent(e,{detail:r,bubbles:!0,composed:!0}))}render(){if(this._schema===null)return this._exposedMissing?l`
          <div class="schema-error">
            ${d(this.hass,"ui.service_not_exposed","Service no longer exposed; configure it in Settings \u2192 Actions or remove this action.")}
          </div>
        `:l`
        <div class="schema-error">
          ${this._schemaError??d(this.hass,"ui.service_unavailable","Service not available in this HA instance.")}
        </div>
      `;if(this._schema===void 0)return l`<div>${d(this.hass,"ui.loading","Loading\u2026")}</div>`;let e=this._renderTargetPicker(),r=this._renderFieldsForm();return e===""&&r===""?l`<div class="no-params">${d(this.hass,"ui.action_no_parameters","This action has no configurable fields.")}</div>`:l`${e}${r}`}};N.styles=y`
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
    .field-header {
      display: flex;
      align-items: center;
      margin: 0.5rem 0 0.25rem 0;
    }
    .field-label-group {
      flex: 1;
    }
    .field-label {
      font-weight: 600;
    }
    .field-clear {
      flex: 0 0 auto;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color, #888);
      font-size: 1rem;
      padding: 0 0.25rem;
      line-height: 1;
    }
    .field-clear:hover {
      color: var(--error-color, #c62828);
    }
    .field-default-hint {
      font-size: 0.85rem;
      color: var(--secondary-text-color, #888);
      font-style: italic;
    }
    .extra-params-notice {
      margin-top: 0.5rem;
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--warning-color, #cc9);
      background: var(--warning-color, #ffd);
      border-radius: 4px;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .extra-params-notice button {
      background: transparent;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      cursor: pointer;
      padding: 0.15rem 0.5rem;
      font: inherit;
      color: inherit;
    }
  `,u([m({attribute:!1})],N.prototype,"hass",2),u([m({attribute:!1})],N.prototype,"scope",2),u([m({attribute:!1})],N.prototype,"exposed",2),u([m({attribute:!1})],N.prototype,"entityIds",2),u([m({attribute:!1})],N.prototype,"params",2),u([g()],N.prototype,"_schema",2),u([g()],N.prototype,"_schemaError",2),u([g()],N.prototype,"_exposedMissing",2),u([g()],N.prototype,"_formSchema",2),u([g()],N.prototype,"_perFieldSchemas",2),N=u([$("ambience-action-slot")],N);function Ki(t){return typeof t>"u"||t===null}function xs(t){return typeof t=="object"&&t!==null}function ks(t){return Array.isArray(t)?t:Ki(t)?[]:[t]}function Es(t,n){var e,r,i,s;if(n)for(s=Object.keys(n),e=0,r=s.length;e<r;e+=1)i=s[e],t[i]=n[i];return t}function Ss(t,n){var e="",r;for(r=0;r<n;r+=1)e+=t;return e}function Cs(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var Ts=Ki,Ls=xs,As=ks,Ps=Ss,Rs=Cs,Hs=Es,R={isNothing:Ts,isObject:Ls,toArray:As,repeat:Ps,isNegativeZero:Rs,extend:Hs};function Vi(t,n){var e="",r=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(e+='in "'+t.mark.name+'" '),e+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!n&&t.mark.snippet&&(e+=`

`+t.mark.snippet),r+" "+e):r}function rt(t,n){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=n,this.message=Vi(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}rt.prototype=Object.create(Error.prototype);rt.prototype.constructor=rt;rt.prototype.toString=function(n){return this.name+": "+Vi(this,n)};var I=rt;function pr(t,n,e,r,i){var s="",a="",o=Math.floor(i/2)-1;return r-n>o&&(s=" ... ",n=r-o+s.length),e-r>o&&(a=" ...",e=r+o-a.length),{str:s+t.slice(n,e).replace(/\t/g,"\u2192")+a,pos:r-n+s.length}}function mr(t,n){return R.repeat(" ",n-t.length)+t}function Ds(t,n){if(n=Object.create(n||null),!t.buffer)return null;n.maxLength||(n.maxLength=79),typeof n.indent!="number"&&(n.indent=1),typeof n.linesBefore!="number"&&(n.linesBefore=3),typeof n.linesAfter!="number"&&(n.linesAfter=2);for(var e=/\r?\n|\r|\0/g,r=[0],i=[],s,a=-1;s=e.exec(t.buffer);)i.push(s.index),r.push(s.index+s[0].length),t.position<=s.index&&a<0&&(a=r.length-2);a<0&&(a=r.length-1);var o="",c,h,p=Math.min(t.line+n.linesAfter,i.length).toString().length,f=n.maxLength-(n.indent+p+3);for(c=1;c<=n.linesBefore&&!(a-c<0);c++)h=pr(t.buffer,r[a-c],i[a-c],t.position-(r[a]-r[a-c]),f),o=R.repeat(" ",n.indent)+mr((t.line-c+1).toString(),p)+" | "+h.str+`
`+o;for(h=pr(t.buffer,r[a],i[a],t.position,f),o+=R.repeat(" ",n.indent)+mr((t.line+1).toString(),p)+" | "+h.str+`
`,o+=R.repeat("-",n.indent+p+3+h.pos)+`^
`,c=1;c<=n.linesAfter&&!(a+c>=i.length);c++)h=pr(t.buffer,r[a+c],i[a+c],t.position-(r[a]-r[a+c]),f),o+=R.repeat(" ",n.indent)+mr((t.line+c+1).toString(),p)+" | "+h.str+`
`;return o.replace(/\n$/,"")}var Fs=Ds,Os=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Ns=["scalar","sequence","mapping"];function Ms(t){var n={};return t!==null&&Object.keys(t).forEach(function(e){t[e].forEach(function(r){n[String(r)]=e})}),n}function Is(t,n){if(n=n||{},Object.keys(n).forEach(function(e){if(Os.indexOf(e)===-1)throw new I('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.options=n,this.tag=t,this.kind=n.kind||null,this.resolve=n.resolve||function(){return!0},this.construct=n.construct||function(e){return e},this.instanceOf=n.instanceOf||null,this.predicate=n.predicate||null,this.represent=n.represent||null,this.representName=n.representName||null,this.defaultStyle=n.defaultStyle||null,this.multi=n.multi||!1,this.styleAliases=Ms(n.styleAliases||null),Ns.indexOf(this.kind)===-1)throw new I('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var D=Is;function Hi(t,n){var e=[];return t[n].forEach(function(r){var i=e.length;e.forEach(function(s,a){s.tag===r.tag&&s.kind===r.kind&&s.multi===r.multi&&(i=a)}),e[i]=r}),e}function js(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},n,e;function r(i){i.multi?(t.multi[i.kind].push(i),t.multi.fallback.push(i)):t[i.kind][i.tag]=t.fallback[i.tag]=i}for(n=0,e=arguments.length;n<e;n+=1)arguments[n].forEach(r);return t}function gr(t){return this.extend(t)}gr.prototype.extend=function(n){var e=[],r=[];if(n instanceof D)r.push(n);else if(Array.isArray(n))r=r.concat(n);else if(n&&(Array.isArray(n.implicit)||Array.isArray(n.explicit)))n.implicit&&(e=e.concat(n.implicit)),n.explicit&&(r=r.concat(n.explicit));else throw new I("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.forEach(function(s){if(!(s instanceof D))throw new I("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new I("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new I("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),r.forEach(function(s){if(!(s instanceof D))throw new I("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var i=Object.create(gr.prototype);return i.implicit=(this.implicit||[]).concat(e),i.explicit=(this.explicit||[]).concat(r),i.compiledImplicit=Hi(i,"implicit"),i.compiledExplicit=Hi(i,"explicit"),i.compiledTypeMap=js(i.compiledImplicit,i.compiledExplicit),i};var zs=gr,Ws=new D("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),Us=new D("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),Gs=new D("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),Bs=new zs({explicit:[Ws,Us,Gs]});function qs(t){if(t===null)return!0;var n=t.length;return n===1&&t==="~"||n===4&&(t==="null"||t==="Null"||t==="NULL")}function Ys(){return null}function Ks(t){return t===null}var Vs=new D("tag:yaml.org,2002:null",{kind:"scalar",resolve:qs,construct:Ys,predicate:Ks,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function Qs(t){if(t===null)return!1;var n=t.length;return n===4&&(t==="true"||t==="True"||t==="TRUE")||n===5&&(t==="false"||t==="False"||t==="FALSE")}function Js(t){return t==="true"||t==="True"||t==="TRUE"}function Xs(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var Zs=new D("tag:yaml.org,2002:bool",{kind:"scalar",resolve:Qs,construct:Js,predicate:Xs,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function ea(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function ta(t){return 48<=t&&t<=55}function ra(t){return 48<=t&&t<=57}function ia(t){if(t===null)return!1;var n=t.length,e=0,r=!1,i;if(!n)return!1;if(i=t[e],(i==="-"||i==="+")&&(i=t[++e]),i==="0"){if(e+1===n)return!0;if(i=t[++e],i==="b"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(i!=="0"&&i!=="1")return!1;r=!0}return r&&i!=="_"}if(i==="x"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(!ea(t.charCodeAt(e)))return!1;r=!0}return r&&i!=="_"}if(i==="o"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(!ta(t.charCodeAt(e)))return!1;r=!0}return r&&i!=="_"}}if(i==="_")return!1;for(;e<n;e++)if(i=t[e],i!=="_"){if(!ra(t.charCodeAt(e)))return!1;r=!0}return!(!r||i==="_")}function na(t){var n=t,e=1,r;if(n.indexOf("_")!==-1&&(n=n.replace(/_/g,"")),r=n[0],(r==="-"||r==="+")&&(r==="-"&&(e=-1),n=n.slice(1),r=n[0]),n==="0")return 0;if(r==="0"){if(n[1]==="b")return e*parseInt(n.slice(2),2);if(n[1]==="x")return e*parseInt(n.slice(2),16);if(n[1]==="o")return e*parseInt(n.slice(2),8)}return e*parseInt(n,10)}function sa(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!R.isNegativeZero(t)}var aa=new D("tag:yaml.org,2002:int",{kind:"scalar",resolve:ia,construct:na,predicate:sa,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),oa=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function la(t){return!(t===null||!oa.test(t)||t[t.length-1]==="_")}function da(t){var n,e;return n=t.replace(/_/g,"").toLowerCase(),e=n[0]==="-"?-1:1,"+-".indexOf(n[0])>=0&&(n=n.slice(1)),n===".inf"?e===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:n===".nan"?NaN:e*parseFloat(n,10)}var ca=/^[-+]?[0-9]+e/;function ua(t,n){var e;if(isNaN(t))switch(n){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(n){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(n){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(R.isNegativeZero(t))return"-0.0";return e=t.toString(10),ca.test(e)?e.replace("e",".e"):e}function ha(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||R.isNegativeZero(t))}var pa=new D("tag:yaml.org,2002:float",{kind:"scalar",resolve:la,construct:da,predicate:ha,represent:ua,defaultStyle:"lowercase"}),ma=Bs.extend({implicit:[Vs,Zs,aa,pa]}),fa=ma,Qi=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Ji=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function ga(t){return t===null?!1:Qi.exec(t)!==null||Ji.exec(t)!==null}function va(t){var n,e,r,i,s,a,o,c=0,h=null,p,f,v;if(n=Qi.exec(t),n===null&&(n=Ji.exec(t)),n===null)throw new Error("Date resolve error");if(e=+n[1],r=+n[2]-1,i=+n[3],!n[4])return new Date(Date.UTC(e,r,i));if(s=+n[4],a=+n[5],o=+n[6],n[7]){for(c=n[7].slice(0,3);c.length<3;)c+="0";c=+c}return n[9]&&(p=+n[10],f=+(n[11]||0),h=(p*60+f)*6e4,n[9]==="-"&&(h=-h)),v=new Date(Date.UTC(e,r,i,s,a,o,c)),h&&v.setTime(v.getTime()-h),v}function _a(t){return t.toISOString()}var ya=new D("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:ga,construct:va,instanceOf:Date,represent:_a});function ba(t){return t==="<<"||t===null}var $a=new D("tag:yaml.org,2002:merge",{kind:"scalar",resolve:ba}),$r=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function wa(t){if(t===null)return!1;var n,e,r=0,i=t.length,s=$r;for(e=0;e<i;e++)if(n=s.indexOf(t.charAt(e)),!(n>64)){if(n<0)return!1;r+=6}return r%8===0}function xa(t){var n,e,r=t.replace(/[\r\n=]/g,""),i=r.length,s=$r,a=0,o=[];for(n=0;n<i;n++)n%4===0&&n&&(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)),a=a<<6|s.indexOf(r.charAt(n));return e=i%4*6,e===0?(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)):e===18?(o.push(a>>10&255),o.push(a>>2&255)):e===12&&o.push(a>>4&255),new Uint8Array(o)}function ka(t){var n="",e=0,r,i,s=t.length,a=$r;for(r=0;r<s;r++)r%3===0&&r&&(n+=a[e>>18&63],n+=a[e>>12&63],n+=a[e>>6&63],n+=a[e&63]),e=(e<<8)+t[r];return i=s%3,i===0?(n+=a[e>>18&63],n+=a[e>>12&63],n+=a[e>>6&63],n+=a[e&63]):i===2?(n+=a[e>>10&63],n+=a[e>>4&63],n+=a[e<<2&63],n+=a[64]):i===1&&(n+=a[e>>2&63],n+=a[e<<4&63],n+=a[64],n+=a[64]),n}function Ea(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var Sa=new D("tag:yaml.org,2002:binary",{kind:"scalar",resolve:wa,construct:xa,predicate:Ea,represent:ka}),Ca=Object.prototype.hasOwnProperty,Ta=Object.prototype.toString;function La(t){if(t===null)return!0;var n=[],e,r,i,s,a,o=t;for(e=0,r=o.length;e<r;e+=1){if(i=o[e],a=!1,Ta.call(i)!=="[object Object]")return!1;for(s in i)if(Ca.call(i,s))if(!a)a=!0;else return!1;if(!a)return!1;if(n.indexOf(s)===-1)n.push(s);else return!1}return!0}function Aa(t){return t!==null?t:[]}var Pa=new D("tag:yaml.org,2002:omap",{kind:"sequence",resolve:La,construct:Aa}),Ra=Object.prototype.toString;function Ha(t){if(t===null)return!0;var n,e,r,i,s,a=t;for(s=new Array(a.length),n=0,e=a.length;n<e;n+=1){if(r=a[n],Ra.call(r)!=="[object Object]"||(i=Object.keys(r),i.length!==1))return!1;s[n]=[i[0],r[i[0]]]}return!0}function Da(t){if(t===null)return[];var n,e,r,i,s,a=t;for(s=new Array(a.length),n=0,e=a.length;n<e;n+=1)r=a[n],i=Object.keys(r),s[n]=[i[0],r[i[0]]];return s}var Fa=new D("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:Ha,construct:Da}),Oa=Object.prototype.hasOwnProperty;function Na(t){if(t===null)return!0;var n,e=t;for(n in e)if(Oa.call(e,n)&&e[n]!==null)return!1;return!0}function Ma(t){return t!==null?t:{}}var Ia=new D("tag:yaml.org,2002:set",{kind:"mapping",resolve:Na,construct:Ma}),Xi=fa.extend({implicit:[ya,$a],explicit:[Sa,Pa,Fa,Ia]}),he=Object.prototype.hasOwnProperty,Ft=1,Zi=2,en=3,Ot=4,fr=1,ja=2,Di=3,za=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Wa=/[\x85\u2028\u2029]/,Ua=/[,\[\]\{\}]/,tn=/^(?:!|!!|![a-z\-]+!)$/i,rn=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Fi(t){return Object.prototype.toString.call(t)}function X(t){return t===10||t===13}function xe(t){return t===9||t===32}function j(t){return t===9||t===32||t===10||t===13}function Ne(t){return t===44||t===91||t===93||t===123||t===125}function Ga(t){var n;return 48<=t&&t<=57?t-48:(n=t|32,97<=n&&n<=102?n-97+10:-1)}function Ba(t){return t===120?2:t===117?4:t===85?8:0}function qa(t){return 48<=t&&t<=57?t-48:-1}function Oi(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"\x85":t===95?"\xA0":t===76?"\u2028":t===80?"\u2029":""}function Ya(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function nn(t,n,e){n==="__proto__"?Object.defineProperty(t,n,{configurable:!0,enumerable:!0,writable:!0,value:e}):t[n]=e}var sn=new Array(256),an=new Array(256);for(we=0;we<256;we++)sn[we]=Oi(we)?1:0,an[we]=Oi(we);var we;function Ka(t,n){this.input=t,this.filename=n.filename||null,this.schema=n.schema||Xi,this.onWarning=n.onWarning||null,this.legacy=n.legacy||!1,this.json=n.json||!1,this.listener=n.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function on(t,n){var e={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return e.snippet=Fs(e),new I(n,e)}function w(t,n){throw on(t,n)}function Nt(t,n){t.onWarning&&t.onWarning.call(null,on(t,n))}var Ni={YAML:function(n,e,r){var i,s,a;n.version!==null&&w(n,"duplication of %YAML directive"),r.length!==1&&w(n,"YAML directive accepts exactly one argument"),i=/^([0-9]+)\.([0-9]+)$/.exec(r[0]),i===null&&w(n,"ill-formed argument of the YAML directive"),s=parseInt(i[1],10),a=parseInt(i[2],10),s!==1&&w(n,"unacceptable YAML version of the document"),n.version=r[0],n.checkLineBreaks=a<2,a!==1&&a!==2&&Nt(n,"unsupported YAML version of the document")},TAG:function(n,e,r){var i,s;r.length!==2&&w(n,"TAG directive accepts exactly two arguments"),i=r[0],s=r[1],tn.test(i)||w(n,"ill-formed tag handle (first argument) of the TAG directive"),he.call(n.tagMap,i)&&w(n,'there is a previously declared suffix for "'+i+'" tag handle'),rn.test(s)||w(n,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{w(n,"tag prefix is malformed: "+s)}n.tagMap[i]=s}};function ue(t,n,e,r){var i,s,a,o;if(n<e){if(o=t.input.slice(n,e),r)for(i=0,s=o.length;i<s;i+=1)a=o.charCodeAt(i),a===9||32<=a&&a<=1114111||w(t,"expected valid JSON character");else za.test(o)&&w(t,"the stream contains non-printable characters");t.result+=o}}function Mi(t,n,e,r){var i,s,a,o;for(R.isObject(e)||w(t,"cannot merge mappings; the provided source object is unacceptable"),i=Object.keys(e),a=0,o=i.length;a<o;a+=1)s=i[a],he.call(n,s)||(nn(n,s,e[s]),r[s]=!0)}function Me(t,n,e,r,i,s,a,o,c){var h,p;if(Array.isArray(i))for(i=Array.prototype.slice.call(i),h=0,p=i.length;h<p;h+=1)Array.isArray(i[h])&&w(t,"nested arrays are not supported inside keys"),typeof i=="object"&&Fi(i[h])==="[object Object]"&&(i[h]="[object Object]");if(typeof i=="object"&&Fi(i)==="[object Object]"&&(i="[object Object]"),i=String(i),n===null&&(n={}),r==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(h=0,p=s.length;h<p;h+=1)Mi(t,n,s[h],e);else Mi(t,n,s,e);else!t.json&&!he.call(e,i)&&he.call(n,i)&&(t.line=a||t.line,t.lineStart=o||t.lineStart,t.position=c||t.position,w(t,"duplicated mapping key")),nn(n,i,s),delete e[i];return n}function wr(t){var n;n=t.input.charCodeAt(t.position),n===10?t.position++:n===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):w(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function P(t,n,e){for(var r=0,i=t.input.charCodeAt(t.position);i!==0;){for(;xe(i);)i===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),i=t.input.charCodeAt(++t.position);if(n&&i===35)do i=t.input.charCodeAt(++t.position);while(i!==10&&i!==13&&i!==0);if(X(i))for(wr(t),i=t.input.charCodeAt(t.position),r++,t.lineIndent=0;i===32;)t.lineIndent++,i=t.input.charCodeAt(++t.position);else break}return e!==-1&&r!==0&&t.lineIndent<e&&Nt(t,"deficient indentation"),r}function jt(t){var n=t.position,e;return e=t.input.charCodeAt(n),!!((e===45||e===46)&&e===t.input.charCodeAt(n+1)&&e===t.input.charCodeAt(n+2)&&(n+=3,e=t.input.charCodeAt(n),e===0||j(e)))}function xr(t,n){n===1?t.result+=" ":n>1&&(t.result+=R.repeat(`
`,n-1))}function Va(t,n,e){var r,i,s,a,o,c,h,p,f=t.kind,v=t.result,b;if(b=t.input.charCodeAt(t.position),j(b)||Ne(b)||b===35||b===38||b===42||b===33||b===124||b===62||b===39||b===34||b===37||b===64||b===96||(b===63||b===45)&&(i=t.input.charCodeAt(t.position+1),j(i)||e&&Ne(i)))return!1;for(t.kind="scalar",t.result="",s=a=t.position,o=!1;b!==0;){if(b===58){if(i=t.input.charCodeAt(t.position+1),j(i)||e&&Ne(i))break}else if(b===35){if(r=t.input.charCodeAt(t.position-1),j(r))break}else{if(t.position===t.lineStart&&jt(t)||e&&Ne(b))break;if(X(b))if(c=t.line,h=t.lineStart,p=t.lineIndent,P(t,!1,-1),t.lineIndent>=n){o=!0,b=t.input.charCodeAt(t.position);continue}else{t.position=a,t.line=c,t.lineStart=h,t.lineIndent=p;break}}o&&(ue(t,s,a,!1),xr(t,t.line-c),s=a=t.position,o=!1),xe(b)||(a=t.position+1),b=t.input.charCodeAt(++t.position)}return ue(t,s,a,!1),t.result?!0:(t.kind=f,t.result=v,!1)}function Qa(t,n){var e,r,i;if(e=t.input.charCodeAt(t.position),e!==39)return!1;for(t.kind="scalar",t.result="",t.position++,r=i=t.position;(e=t.input.charCodeAt(t.position))!==0;)if(e===39)if(ue(t,r,t.position,!0),e=t.input.charCodeAt(++t.position),e===39)r=t.position,t.position++,i=t.position;else return!0;else X(e)?(ue(t,r,i,!0),xr(t,P(t,!1,n)),r=i=t.position):t.position===t.lineStart&&jt(t)?w(t,"unexpected end of the document within a single quoted scalar"):(t.position++,i=t.position);w(t,"unexpected end of the stream within a single quoted scalar")}function Ja(t,n){var e,r,i,s,a,o;if(o=t.input.charCodeAt(t.position),o!==34)return!1;for(t.kind="scalar",t.result="",t.position++,e=r=t.position;(o=t.input.charCodeAt(t.position))!==0;){if(o===34)return ue(t,e,t.position,!0),t.position++,!0;if(o===92){if(ue(t,e,t.position,!0),o=t.input.charCodeAt(++t.position),X(o))P(t,!1,n);else if(o<256&&sn[o])t.result+=an[o],t.position++;else if((a=Ba(o))>0){for(i=a,s=0;i>0;i--)o=t.input.charCodeAt(++t.position),(a=Ga(o))>=0?s=(s<<4)+a:w(t,"expected hexadecimal character");t.result+=Ya(s),t.position++}else w(t,"unknown escape sequence");e=r=t.position}else X(o)?(ue(t,e,r,!0),xr(t,P(t,!1,n)),e=r=t.position):t.position===t.lineStart&&jt(t)?w(t,"unexpected end of the document within a double quoted scalar"):(t.position++,r=t.position)}w(t,"unexpected end of the stream within a double quoted scalar")}function Xa(t,n){var e=!0,r,i,s,a=t.tag,o,c=t.anchor,h,p,f,v,b,k=Object.create(null),x,S,B,C;if(C=t.input.charCodeAt(t.position),C===91)p=93,b=!1,o=[];else if(C===123)p=125,b=!0,o={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=o),C=t.input.charCodeAt(++t.position);C!==0;){if(P(t,!0,n),C=t.input.charCodeAt(t.position),C===p)return t.position++,t.tag=a,t.anchor=c,t.kind=b?"mapping":"sequence",t.result=o,!0;e?C===44&&w(t,"expected the node content, but found ','"):w(t,"missed comma between flow collection entries"),S=x=B=null,f=v=!1,C===63&&(h=t.input.charCodeAt(t.position+1),j(h)&&(f=v=!0,t.position++,P(t,!0,n))),r=t.line,i=t.lineStart,s=t.position,Ie(t,n,Ft,!1,!0),S=t.tag,x=t.result,P(t,!0,n),C=t.input.charCodeAt(t.position),(v||t.line===r)&&C===58&&(f=!0,C=t.input.charCodeAt(++t.position),P(t,!0,n),Ie(t,n,Ft,!1,!0),B=t.result),b?Me(t,o,k,S,x,B,r,i,s):f?o.push(Me(t,null,k,S,x,B,r,i,s)):o.push(x),P(t,!0,n),C=t.input.charCodeAt(t.position),C===44?(e=!0,C=t.input.charCodeAt(++t.position)):e=!1}w(t,"unexpected end of the stream within a flow collection")}function Za(t,n){var e,r,i=fr,s=!1,a=!1,o=n,c=0,h=!1,p,f;if(f=t.input.charCodeAt(t.position),f===124)r=!1;else if(f===62)r=!0;else return!1;for(t.kind="scalar",t.result="";f!==0;)if(f=t.input.charCodeAt(++t.position),f===43||f===45)fr===i?i=f===43?Di:ja:w(t,"repeat of a chomping mode identifier");else if((p=qa(f))>=0)p===0?w(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):a?w(t,"repeat of an indentation width identifier"):(o=n+p-1,a=!0);else break;if(xe(f)){do f=t.input.charCodeAt(++t.position);while(xe(f));if(f===35)do f=t.input.charCodeAt(++t.position);while(!X(f)&&f!==0)}for(;f!==0;){for(wr(t),t.lineIndent=0,f=t.input.charCodeAt(t.position);(!a||t.lineIndent<o)&&f===32;)t.lineIndent++,f=t.input.charCodeAt(++t.position);if(!a&&t.lineIndent>o&&(o=t.lineIndent),X(f)){c++;continue}if(t.lineIndent<o){i===Di?t.result+=R.repeat(`
`,s?1+c:c):i===fr&&s&&(t.result+=`
`);break}for(r?xe(f)?(h=!0,t.result+=R.repeat(`
`,s?1+c:c)):h?(h=!1,t.result+=R.repeat(`
`,c+1)):c===0?s&&(t.result+=" "):t.result+=R.repeat(`
`,c):t.result+=R.repeat(`
`,s?1+c:c),s=!0,a=!0,c=0,e=t.position;!X(f)&&f!==0;)f=t.input.charCodeAt(++t.position);ue(t,e,t.position,!1)}return!0}function Ii(t,n){var e,r=t.tag,i=t.anchor,s=[],a,o=!1,c;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=s),c=t.input.charCodeAt(t.position);c!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,w(t,"tab characters must not be used in indentation")),!(c!==45||(a=t.input.charCodeAt(t.position+1),!j(a))));){if(o=!0,t.position++,P(t,!0,-1)&&t.lineIndent<=n){s.push(null),c=t.input.charCodeAt(t.position);continue}if(e=t.line,Ie(t,n,en,!1,!0),s.push(t.result),P(t,!0,-1),c=t.input.charCodeAt(t.position),(t.line===e||t.lineIndent>n)&&c!==0)w(t,"bad indentation of a sequence entry");else if(t.lineIndent<n)break}return o?(t.tag=r,t.anchor=i,t.kind="sequence",t.result=s,!0):!1}function eo(t,n,e){var r,i,s,a,o,c,h=t.tag,p=t.anchor,f={},v=Object.create(null),b=null,k=null,x=null,S=!1,B=!1,C;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=f),C=t.input.charCodeAt(t.position);C!==0;){if(!S&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,w(t,"tab characters must not be used in indentation")),r=t.input.charCodeAt(t.position+1),s=t.line,(C===63||C===58)&&j(r))C===63?(S&&(Me(t,f,v,b,k,null,a,o,c),b=k=x=null),B=!0,S=!0,i=!0):S?(S=!1,i=!0):w(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,C=r;else{if(a=t.line,o=t.lineStart,c=t.position,!Ie(t,e,Zi,!1,!0))break;if(t.line===s){for(C=t.input.charCodeAt(t.position);xe(C);)C=t.input.charCodeAt(++t.position);if(C===58)C=t.input.charCodeAt(++t.position),j(C)||w(t,"a whitespace character is expected after the key-value separator within a block mapping"),S&&(Me(t,f,v,b,k,null,a,o,c),b=k=x=null),B=!0,S=!1,i=!1,b=t.tag,k=t.result;else if(B)w(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=h,t.anchor=p,!0}else if(B)w(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=h,t.anchor=p,!0}if((t.line===s||t.lineIndent>n)&&(S&&(a=t.line,o=t.lineStart,c=t.position),Ie(t,n,Ot,!0,i)&&(S?k=t.result:x=t.result),S||(Me(t,f,v,b,k,x,a,o,c),b=k=x=null),P(t,!0,-1),C=t.input.charCodeAt(t.position)),(t.line===s||t.lineIndent>n)&&C!==0)w(t,"bad indentation of a mapping entry");else if(t.lineIndent<n)break}return S&&Me(t,f,v,b,k,null,a,o,c),B&&(t.tag=h,t.anchor=p,t.kind="mapping",t.result=f),B}function to(t){var n,e=!1,r=!1,i,s,a;if(a=t.input.charCodeAt(t.position),a!==33)return!1;if(t.tag!==null&&w(t,"duplication of a tag property"),a=t.input.charCodeAt(++t.position),a===60?(e=!0,a=t.input.charCodeAt(++t.position)):a===33?(r=!0,i="!!",a=t.input.charCodeAt(++t.position)):i="!",n=t.position,e){do a=t.input.charCodeAt(++t.position);while(a!==0&&a!==62);t.position<t.length?(s=t.input.slice(n,t.position),a=t.input.charCodeAt(++t.position)):w(t,"unexpected end of the stream within a verbatim tag")}else{for(;a!==0&&!j(a);)a===33&&(r?w(t,"tag suffix cannot contain exclamation marks"):(i=t.input.slice(n-1,t.position+1),tn.test(i)||w(t,"named tag handle cannot contain such characters"),r=!0,n=t.position+1)),a=t.input.charCodeAt(++t.position);s=t.input.slice(n,t.position),Ua.test(s)&&w(t,"tag suffix cannot contain flow indicator characters")}s&&!rn.test(s)&&w(t,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{w(t,"tag name is malformed: "+s)}return e?t.tag=s:he.call(t.tagMap,i)?t.tag=t.tagMap[i]+s:i==="!"?t.tag="!"+s:i==="!!"?t.tag="tag:yaml.org,2002:"+s:w(t,'undeclared tag handle "'+i+'"'),!0}function ro(t){var n,e;if(e=t.input.charCodeAt(t.position),e!==38)return!1;for(t.anchor!==null&&w(t,"duplication of an anchor property"),e=t.input.charCodeAt(++t.position),n=t.position;e!==0&&!j(e)&&!Ne(e);)e=t.input.charCodeAt(++t.position);return t.position===n&&w(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(n,t.position),!0}function io(t){var n,e,r;if(r=t.input.charCodeAt(t.position),r!==42)return!1;for(r=t.input.charCodeAt(++t.position),n=t.position;r!==0&&!j(r)&&!Ne(r);)r=t.input.charCodeAt(++t.position);return t.position===n&&w(t,"name of an alias node must contain at least one character"),e=t.input.slice(n,t.position),he.call(t.anchorMap,e)||w(t,'unidentified alias "'+e+'"'),t.result=t.anchorMap[e],P(t,!0,-1),!0}function Ie(t,n,e,r,i){var s,a,o,c=1,h=!1,p=!1,f,v,b,k,x,S;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,s=a=o=Ot===e||en===e,r&&P(t,!0,-1)&&(h=!0,t.lineIndent>n?c=1:t.lineIndent===n?c=0:t.lineIndent<n&&(c=-1)),c===1)for(;to(t)||ro(t);)P(t,!0,-1)?(h=!0,o=s,t.lineIndent>n?c=1:t.lineIndent===n?c=0:t.lineIndent<n&&(c=-1)):o=!1;if(o&&(o=h||i),(c===1||Ot===e)&&(Ft===e||Zi===e?x=n:x=n+1,S=t.position-t.lineStart,c===1?o&&(Ii(t,S)||eo(t,S,x))||Xa(t,x)?p=!0:(a&&Za(t,x)||Qa(t,x)||Ja(t,x)?p=!0:io(t)?(p=!0,(t.tag!==null||t.anchor!==null)&&w(t,"alias node should not have any properties")):Va(t,x,Ft===e)&&(p=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):c===0&&(p=o&&Ii(t,S))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&w(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),f=0,v=t.implicitTypes.length;f<v;f+=1)if(k=t.implicitTypes[f],k.resolve(t.result)){t.result=k.construct(t.result),t.tag=k.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(he.call(t.typeMap[t.kind||"fallback"],t.tag))k=t.typeMap[t.kind||"fallback"][t.tag];else for(k=null,b=t.typeMap.multi[t.kind||"fallback"],f=0,v=b.length;f<v;f+=1)if(t.tag.slice(0,b[f].tag.length)===b[f].tag){k=b[f];break}k||w(t,"unknown tag !<"+t.tag+">"),t.result!==null&&k.kind!==t.kind&&w(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+k.kind+'", not "'+t.kind+'"'),k.resolve(t.result,t.tag)?(t.result=k.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):w(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||p}function no(t){var n=t.position,e,r,i,s=!1,a;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(a=t.input.charCodeAt(t.position))!==0&&(P(t,!0,-1),a=t.input.charCodeAt(t.position),!(t.lineIndent>0||a!==37));){for(s=!0,a=t.input.charCodeAt(++t.position),e=t.position;a!==0&&!j(a);)a=t.input.charCodeAt(++t.position);for(r=t.input.slice(e,t.position),i=[],r.length<1&&w(t,"directive name must not be less than one character in length");a!==0;){for(;xe(a);)a=t.input.charCodeAt(++t.position);if(a===35){do a=t.input.charCodeAt(++t.position);while(a!==0&&!X(a));break}if(X(a))break;for(e=t.position;a!==0&&!j(a);)a=t.input.charCodeAt(++t.position);i.push(t.input.slice(e,t.position))}a!==0&&wr(t),he.call(Ni,r)?Ni[r](t,r,i):Nt(t,'unknown document directive "'+r+'"')}if(P(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,P(t,!0,-1)):s&&w(t,"directives end mark is expected"),Ie(t,t.lineIndent-1,Ot,!1,!0),P(t,!0,-1),t.checkLineBreaks&&Wa.test(t.input.slice(n,t.position))&&Nt(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&jt(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,P(t,!0,-1));return}if(t.position<t.length-1)w(t,"end of the stream or a document separator is expected");else return}function ln(t,n){t=String(t),n=n||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var e=new Ka(t,n),r=t.indexOf("\0");for(r!==-1&&(e.position=r,w(e,"null byte is not allowed in input")),e.input+="\0";e.input.charCodeAt(e.position)===32;)e.lineIndent+=1,e.position+=1;for(;e.position<e.length-1;)no(e);return e.documents}function so(t,n,e){n!==null&&typeof n=="object"&&typeof e>"u"&&(e=n,n=null);var r=ln(t,e);if(typeof n!="function")return r;for(var i=0,s=r.length;i<s;i+=1)n(r[i])}function ao(t,n){var e=ln(t,n);if(e.length!==0){if(e.length===1)return e[0];throw new I("expected a single document in the stream, but found more")}}var oo=so,lo=ao,dn={loadAll:oo,load:lo},cn=Object.prototype.toString,un=Object.prototype.hasOwnProperty,kr=65279,co=9,it=10,uo=13,ho=32,po=33,mo=34,vr=35,fo=37,go=38,vo=39,_o=42,hn=44,yo=45,Mt=58,bo=61,$o=62,wo=63,xo=64,pn=91,mn=93,ko=96,fn=123,Eo=124,gn=125,F={};F[0]="\\0";F[7]="\\a";F[8]="\\b";F[9]="\\t";F[10]="\\n";F[11]="\\v";F[12]="\\f";F[13]="\\r";F[27]="\\e";F[34]='\\"';F[92]="\\\\";F[133]="\\N";F[160]="\\_";F[8232]="\\L";F[8233]="\\P";var So=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],Co=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function To(t,n){var e,r,i,s,a,o,c;if(n===null)return{};for(e={},r=Object.keys(n),i=0,s=r.length;i<s;i+=1)a=r[i],o=String(n[a]),a.slice(0,2)==="!!"&&(a="tag:yaml.org,2002:"+a.slice(2)),c=t.compiledTypeMap.fallback[a],c&&un.call(c.styleAliases,o)&&(o=c.styleAliases[o]),e[a]=o;return e}function Lo(t){var n,e,r;if(n=t.toString(16).toUpperCase(),t<=255)e="x",r=2;else if(t<=65535)e="u",r=4;else if(t<=4294967295)e="U",r=8;else throw new I("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+e+R.repeat("0",r-n.length)+n}var Ao=1,nt=2;function Po(t){this.schema=t.schema||Xi,this.indent=Math.max(1,t.indent||2),this.noArrayIndent=t.noArrayIndent||!1,this.skipInvalid=t.skipInvalid||!1,this.flowLevel=R.isNothing(t.flowLevel)?-1:t.flowLevel,this.styleMap=To(this.schema,t.styles||null),this.sortKeys=t.sortKeys||!1,this.lineWidth=t.lineWidth||80,this.noRefs=t.noRefs||!1,this.noCompatMode=t.noCompatMode||!1,this.condenseFlow=t.condenseFlow||!1,this.quotingType=t.quotingType==='"'?nt:Ao,this.forceQuotes=t.forceQuotes||!1,this.replacer=typeof t.replacer=="function"?t.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function ji(t,n){for(var e=R.repeat(" ",n),r=0,i=-1,s="",a,o=t.length;r<o;)i=t.indexOf(`
`,r),i===-1?(a=t.slice(r),r=o):(a=t.slice(r,i+1),r=i+1),a.length&&a!==`
`&&(s+=e),s+=a;return s}function _r(t,n){return`
`+R.repeat(" ",t.indent*n)}function Ro(t,n){var e,r,i;for(e=0,r=t.implicitTypes.length;e<r;e+=1)if(i=t.implicitTypes[e],i.resolve(n))return!0;return!1}function It(t){return t===ho||t===co}function st(t){return 32<=t&&t<=126||161<=t&&t<=55295&&t!==8232&&t!==8233||57344<=t&&t<=65533&&t!==kr||65536<=t&&t<=1114111}function zi(t){return st(t)&&t!==kr&&t!==uo&&t!==it}function Wi(t,n,e){var r=zi(t),i=r&&!It(t);return(e?r:r&&t!==hn&&t!==pn&&t!==mn&&t!==fn&&t!==gn)&&t!==vr&&!(n===Mt&&!i)||zi(n)&&!It(n)&&t===vr||n===Mt&&i}function Ho(t){return st(t)&&t!==kr&&!It(t)&&t!==yo&&t!==wo&&t!==Mt&&t!==hn&&t!==pn&&t!==mn&&t!==fn&&t!==gn&&t!==vr&&t!==go&&t!==_o&&t!==po&&t!==Eo&&t!==bo&&t!==$o&&t!==vo&&t!==mo&&t!==fo&&t!==xo&&t!==ko}function Do(t){return!It(t)&&t!==Mt}function tt(t,n){var e=t.charCodeAt(n),r;return e>=55296&&e<=56319&&n+1<t.length&&(r=t.charCodeAt(n+1),r>=56320&&r<=57343)?(e-55296)*1024+r-56320+65536:e}function vn(t){var n=/^\n* /;return n.test(t)}var _n=1,yr=2,yn=3,bn=4,Oe=5;function Fo(t,n,e,r,i,s,a,o){var c,h=0,p=null,f=!1,v=!1,b=r!==-1,k=-1,x=Ho(tt(t,0))&&Do(tt(t,t.length-1));if(n||a)for(c=0;c<t.length;h>=65536?c+=2:c++){if(h=tt(t,c),!st(h))return Oe;x=x&&Wi(h,p,o),p=h}else{for(c=0;c<t.length;h>=65536?c+=2:c++){if(h=tt(t,c),h===it)f=!0,b&&(v=v||c-k-1>r&&t[k+1]!==" ",k=c);else if(!st(h))return Oe;x=x&&Wi(h,p,o),p=h}v=v||b&&c-k-1>r&&t[k+1]!==" "}return!f&&!v?x&&!a&&!i(t)?_n:s===nt?Oe:yr:e>9&&vn(t)?Oe:a?s===nt?Oe:yr:v?bn:yn}function Oo(t,n,e,r,i){t.dump=(function(){if(n.length===0)return t.quotingType===nt?'""':"''";if(!t.noCompatMode&&(So.indexOf(n)!==-1||Co.test(n)))return t.quotingType===nt?'"'+n+'"':"'"+n+"'";var s=t.indent*Math.max(1,e),a=t.lineWidth===-1?-1:Math.max(Math.min(t.lineWidth,40),t.lineWidth-s),o=r||t.flowLevel>-1&&e>=t.flowLevel;function c(h){return Ro(t,h)}switch(Fo(n,o,t.indent,a,c,t.quotingType,t.forceQuotes&&!r,i)){case _n:return n;case yr:return"'"+n.replace(/'/g,"''")+"'";case yn:return"|"+Ui(n,t.indent)+Gi(ji(n,s));case bn:return">"+Ui(n,t.indent)+Gi(ji(No(n,a),s));case Oe:return'"'+Mo(n)+'"';default:throw new I("impossible error: invalid scalar style")}})()}function Ui(t,n){var e=vn(t)?String(n):"",r=t[t.length-1]===`
`,i=r&&(t[t.length-2]===`
`||t===`
`),s=i?"+":r?"":"-";return e+s+`
`}function Gi(t){return t[t.length-1]===`
`?t.slice(0,-1):t}function No(t,n){for(var e=/(\n+)([^\n]*)/g,r=(function(){var h=t.indexOf(`
`);return h=h!==-1?h:t.length,e.lastIndex=h,Bi(t.slice(0,h),n)})(),i=t[0]===`
`||t[0]===" ",s,a;a=e.exec(t);){var o=a[1],c=a[2];s=c[0]===" ",r+=o+(!i&&!s&&c!==""?`
`:"")+Bi(c,n),i=s}return r}function Bi(t,n){if(t===""||t[0]===" ")return t;for(var e=/ [^ ]/g,r,i=0,s,a=0,o=0,c="";r=e.exec(t);)o=r.index,o-i>n&&(s=a>i?a:o,c+=`
`+t.slice(i,s),i=s+1),a=o;return c+=`
`,t.length-i>n&&a>i?c+=t.slice(i,a)+`
`+t.slice(a+1):c+=t.slice(i),c.slice(1)}function Mo(t){for(var n="",e=0,r,i=0;i<t.length;e>=65536?i+=2:i++)e=tt(t,i),r=F[e],!r&&st(e)?(n+=t[i],e>=65536&&(n+=t[i+1])):n+=r||Lo(e);return n}function Io(t,n,e){var r="",i=t.tag,s,a,o;for(s=0,a=e.length;s<a;s+=1)o=e[s],t.replacer&&(o=t.replacer.call(e,String(s),o)),(re(t,n,o,!1,!1)||typeof o>"u"&&re(t,n,null,!1,!1))&&(r!==""&&(r+=","+(t.condenseFlow?"":" ")),r+=t.dump);t.tag=i,t.dump="["+r+"]"}function qi(t,n,e,r){var i="",s=t.tag,a,o,c;for(a=0,o=e.length;a<o;a+=1)c=e[a],t.replacer&&(c=t.replacer.call(e,String(a),c)),(re(t,n+1,c,!0,!0,!1,!0)||typeof c>"u"&&re(t,n+1,null,!0,!0,!1,!0))&&((!r||i!=="")&&(i+=_r(t,n)),t.dump&&it===t.dump.charCodeAt(0)?i+="-":i+="- ",i+=t.dump);t.tag=s,t.dump=i||"[]"}function jo(t,n,e){var r="",i=t.tag,s=Object.keys(e),a,o,c,h,p;for(a=0,o=s.length;a<o;a+=1)p="",r!==""&&(p+=", "),t.condenseFlow&&(p+='"'),c=s[a],h=e[c],t.replacer&&(h=t.replacer.call(e,c,h)),re(t,n,c,!1,!1)&&(t.dump.length>1024&&(p+="? "),p+=t.dump+(t.condenseFlow?'"':"")+":"+(t.condenseFlow?"":" "),re(t,n,h,!1,!1)&&(p+=t.dump,r+=p));t.tag=i,t.dump="{"+r+"}"}function zo(t,n,e,r){var i="",s=t.tag,a=Object.keys(e),o,c,h,p,f,v;if(t.sortKeys===!0)a.sort();else if(typeof t.sortKeys=="function")a.sort(t.sortKeys);else if(t.sortKeys)throw new I("sortKeys must be a boolean or a function");for(o=0,c=a.length;o<c;o+=1)v="",(!r||i!=="")&&(v+=_r(t,n)),h=a[o],p=e[h],t.replacer&&(p=t.replacer.call(e,h,p)),re(t,n+1,h,!0,!0,!0)&&(f=t.tag!==null&&t.tag!=="?"||t.dump&&t.dump.length>1024,f&&(t.dump&&it===t.dump.charCodeAt(0)?v+="?":v+="? "),v+=t.dump,f&&(v+=_r(t,n)),re(t,n+1,p,!0,f)&&(t.dump&&it===t.dump.charCodeAt(0)?v+=":":v+=": ",v+=t.dump,i+=v));t.tag=s,t.dump=i||"{}"}function Yi(t,n,e){var r,i,s,a,o,c;for(i=e?t.explicitTypes:t.implicitTypes,s=0,a=i.length;s<a;s+=1)if(o=i[s],(o.instanceOf||o.predicate)&&(!o.instanceOf||typeof n=="object"&&n instanceof o.instanceOf)&&(!o.predicate||o.predicate(n))){if(e?o.multi&&o.representName?t.tag=o.representName(n):t.tag=o.tag:t.tag="?",o.represent){if(c=t.styleMap[o.tag]||o.defaultStyle,cn.call(o.represent)==="[object Function]")r=o.represent(n,c);else if(un.call(o.represent,c))r=o.represent[c](n,c);else throw new I("!<"+o.tag+'> tag resolver accepts not "'+c+'" style');t.dump=r}return!0}return!1}function re(t,n,e,r,i,s,a){t.tag=null,t.dump=e,Yi(t,e,!1)||Yi(t,e,!0);var o=cn.call(t.dump),c=r,h;r&&(r=t.flowLevel<0||t.flowLevel>n);var p=o==="[object Object]"||o==="[object Array]",f,v;if(p&&(f=t.duplicates.indexOf(e),v=f!==-1),(t.tag!==null&&t.tag!=="?"||v||t.indent!==2&&n>0)&&(i=!1),v&&t.usedDuplicates[f])t.dump="*ref_"+f;else{if(p&&v&&!t.usedDuplicates[f]&&(t.usedDuplicates[f]=!0),o==="[object Object]")r&&Object.keys(t.dump).length!==0?(zo(t,n,t.dump,i),v&&(t.dump="&ref_"+f+t.dump)):(jo(t,n,t.dump),v&&(t.dump="&ref_"+f+" "+t.dump));else if(o==="[object Array]")r&&t.dump.length!==0?(t.noArrayIndent&&!a&&n>0?qi(t,n-1,t.dump,i):qi(t,n,t.dump,i),v&&(t.dump="&ref_"+f+t.dump)):(Io(t,n,t.dump),v&&(t.dump="&ref_"+f+" "+t.dump));else if(o==="[object String]")t.tag!=="?"&&Oo(t,t.dump,n,s,c);else{if(o==="[object Undefined]")return!1;if(t.skipInvalid)return!1;throw new I("unacceptable kind of an object to dump "+o)}t.tag!==null&&t.tag!=="?"&&(h=encodeURI(t.tag[0]==="!"?t.tag.slice(1):t.tag).replace(/!/g,"%21"),t.tag[0]==="!"?h="!"+h:h.slice(0,18)==="tag:yaml.org,2002:"?h="!!"+h.slice(18):h="!<"+h+">",t.dump=h+" "+t.dump)}return!0}function Wo(t,n){var e=[],r=[],i,s;for(br(t,e,r),i=0,s=r.length;i<s;i+=1)n.duplicates.push(e[r[i]]);n.usedDuplicates=new Array(s)}function br(t,n,e){var r,i,s;if(t!==null&&typeof t=="object")if(i=n.indexOf(t),i!==-1)e.indexOf(i)===-1&&e.push(i);else if(n.push(t),Array.isArray(t))for(i=0,s=t.length;i<s;i+=1)br(t[i],n,e);else for(r=Object.keys(t),i=0,s=r.length;i<s;i+=1)br(t[r[i]],n,e)}function Uo(t,n){n=n||{};var e=new Po(n);e.noRefs||Wo(t,e);var r=t;return e.replacer&&(r=e.replacer.call({"":r},"",r)),re(e,0,r,!0,!0)?e.dump+`
`:""}var Go=Uo,Bo={dump:Go};function Er(t,n){return function(){throw new Error("Function yaml."+t+" is removed in js-yaml 4. Use yaml."+n+" instead, which is now safe by default.")}}var $n=dn.load,Vd=dn.loadAll,zt=Bo.dump;var Qd=Er("safeLoad","load"),Jd=Er("safeLoadAll","loadAll"),Xd=Er("safeDump","dump");var W=class extends _{constructor(){super(...arguments);this.value=null;this._mode="form";this._yamlText="";this._yamlError=null;this._suggested=[];this._suggestedFor=null}willUpdate(e){if(super.willUpdate?.(e),e.has("value")){this._mode==="form"&&(this._yamlText=zt(this.value??{}));let r=this.value&&typeof this.value=="object"?this.value.script:null;this._loadSuggestions(r)}}connectedCallback(){super.connectedCallback(),this._yamlText=zt(this.value??{});let e=this.value&&typeof this.value=="object"?this.value.script:null,r=this._fieldsFor(e);e&&(!r||Object.keys(r).length===0)&&(this._mode="yaml");let i=this.value&&typeof this.value=="object"?this.value.script:null;this._loadSuggestions(i)}async _loadSuggestions(e){if(e!==this._suggestedFor&&(this._suggestedFor=e,this._suggested=[],!(!e||!this.hass)))try{let{entities:r}=await bi(this.hass,e);this._suggestedFor===e&&(this._suggested=r)}catch{}}_setMode(e){e==="form"&&this._yamlError!==null||(e==="yaml"&&(this._yamlText=zt(this.value??{})),this._mode=e)}_onYamlInput(e){this._yamlText=e;let r;try{r=$n(e)}catch(c){this._yamlError=c.message;return}if(r==null){this._yamlError=null,this._emit(null);return}if(typeof r!="object"||Array.isArray(r)){this._yamlError="Expected an object";return}let i=r,s=i.script;if(typeof s!="string"||!s.startsWith("script.")){this._yamlError="`script` must be a 'script.<name>' string";return}let a=i.args;if(a!==void 0&&(typeof a!="object"||Array.isArray(a)||a===null)){this._yamlError="`args` must be an object if present";return}let o=i.triggers;if(o!==void 0&&(!Array.isArray(o)||!o.every(c=>typeof c=="string"))){this._yamlError="`triggers` must be a list of entity_id strings if present";return}this._yamlError=null,this._emit({script:s,args:a??{},triggers:o})}_emit(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_scriptIds(){let e=this.hass?.services;return Object.keys(e?.script??{}).sort().map(i=>`script.${i}`)}_label(e){let i=this.hass?.states?.[e]?.attributes?.friendly_name;return typeof i=="string"&&i?i:e}_fieldsFor(e){if(!e)return;let r=e.replace(/^script\./,"");return this.hass?.services?.script?.[r]?.fields}_defaultArgs(e){let r=this._fieldsFor(e)??{},i={};for(let[s,a]of Object.entries(r))a&&Object.prototype.hasOwnProperty.call(a,"default")&&(i[s]=a.default);return i}_pickerSchema(){return[{name:"script",selector:{select:{mode:"dropdown",options:this._scriptIds().map(e=>({value:e,label:this._label(e)}))}}}]}_pickScript(e){if(!e){this._emit(null);return}this._emit({script:e,args:this._defaultArgs(e)})}_argsSchema(){let e=this._fieldsFor(this.value&&typeof this.value=="object"?this.value.script:null);return e?Object.entries(e).map(([r,i])=>({name:r,required:i.required,description:i.description?{suffix:i.description}:void 0,selector:i.selector??{text:{}}})):[]}_updateArgs(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:e,triggers:this.value.triggers})}get _triggers(){return this.value&&typeof this.value=="object"&&this.value.triggers||[]}_setTriggers(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:this.value.args,triggers:e})}_addTrigger(e){this._triggers.includes(e)||this._setTriggers([...this._triggers,e])}_removeTrigger(e){this._setTriggers(this._triggers.filter(r=>r!==e))}render(){let e=this.value&&typeof this.value=="object"?this.value.script:null,r=this._argsSchema(),i=(this.value&&typeof this.value=="object"?this.value.args:{})??{},s=r.length>0;return l`
      <div class="section">
        <h4>${d(this.hass,"ui.script","Script")}</h4>
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
          >${d(this.hass,"ui.form","Form")}</button>
          <button
            type="button"
            class=${this._mode==="yaml"?"active":""}
            @click=${()=>this._setMode("yaml")}
          >${d(this.hass,"ui.yaml","YAML")}</button>
        </div>
      `:""}
      ${e&&this._mode==="form"&&s?l`
        <div class="section args">
          <h4>${d(this.hass,"ui.arguments","Arguments")}</h4>
          ${this._renderArgs(r,i)}
        </div>
      `:""}
      ${e?this._renderTriggers():""}
      ${e&&this._mode==="yaml"?this._renderYaml():""}
    `}_renderTriggers(){let e=this._triggers,r=this._suggested.filter(i=>!e.includes(i));return l`
      <div class="section triggers">
        <h4>${d(this.hass,"ui.script_triggers","Triggers")}</h4>
        <p class="help">
          ${d(this.hass,"ui.script_triggers_help","Re-evaluate this rule when these entities change. A script is opaque, so templated references may be missed \u2014 add any it depends on.")}
        </p>
        <div class="chips">
          ${e.length===0?l`<span class="muted">${d(this.hass,"ui.script_triggers_none","No triggers")}</span>`:e.map(i=>l`<span class="chip" data-test=${`trigger-${i}`}>
                  ${i}
                  <button type="button" class="x" title="Remove" @click=${()=>this._removeTrigger(i)}>×</button>
                </span>`)}
        </div>
        ${r.length?l`<div class="suggested">
              <span class="muted">${d(this.hass,"ui.script_triggers_suggested","Suggested:")}</span>
              ${r.map(i=>l`<button
                  type="button"
                  class="chip add"
                  data-test=${`suggest-${i}`}
                  @click=${()=>this._addTrigger(i)}
                >+ ${i}</button>`)}
            </div>`:""}
      </div>
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
            @change=${a=>{let o=a.target.value,c={...r,[i.name]:o};this._updateArgs(c)}}
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
    </select>`}};W.styles=y`
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
    .chips { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
    .chip {
      display: inline-flex; align-items: center; gap: 0.3rem;
      background: var(--secondary-background-color, #eee);
      color: var(--primary-text-color, inherit);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 12px; padding: 0.15rem 0.5rem; font-size: 0.85em;
    }
    .chip .x { background: none; border: none; cursor: pointer; color: inherit; font-size: 1em; line-height: 1; padding: 0; }
    .chip.add { cursor: pointer; }
    .suggested { margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
    .help { font-size: 0.8em; color: var(--secondary-text-color, #777); margin: 0 0 0.4rem 0; }
    .muted { color: var(--secondary-text-color, #777); font-size: 0.85em; }
  `,u([m({attribute:!1})],W.prototype,"hass",2),u([m({attribute:!1})],W.prototype,"value",2),u([g()],W.prototype,"_mode",2),u([g()],W.prototype,"_yamlText",2),u([g()],W.prototype,"_yamlError",2),u([g()],W.prototype,"_suggested",2),u([g()],W.prototype,"_suggestedFor",2),W=u([$("ambience-script-predicate-input")],W);var qo=["dawn","sunrise","noon","sunset","dusk","midnight"],ke=class extends _{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onKindChange(e){let r=e.target.value;r!==this.value.kind&&(r==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let r=e.target.value,[i,s]=r.split(":").map(a=>parseInt(a,10));Number.isNaN(i)||Number.isNaN(s)||this._emit({kind:"time",hh:i,mm:s})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let r=e.target.value;this._emit({kind:"sun",anchor:r,offset_min:this.value.offset_min})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let r=parseInt(e.target.value,10);Number.isNaN(r)||this._emit({kind:"sun",anchor:this.value.anchor,offset_min:r})}_renderTime(e){let r=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return l`<input type="time" .value=${r} @input=${this._onTimeChange} />`}_renderSun(e){let r=Yo(e.offset_min,this.hass);return l`
      <select @change=${this._onAnchorChange}>
        ${qo.map(i=>l`<option value=${i} ?selected=${i===e.anchor}>${Pe(this.hass,i)}</option>`)}
      </select>
      <input
        type="number"
        step="1"
        placeholder=${d(this.hass,"ui.offset_placeholder","\xB1min, e.g. -30")}
        .value=${String(e.offset_min)}
        @input=${this._onOffsetChange}
      />
      <span class="offset-hint">${r}</span>
    `}render(){return l`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>${d(this.hass,"ui.endpoint_time","Time")}</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>${d(this.hass,"ui.endpoint_sun","Sun")}</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};ke.styles=y`
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
  `,u([m({attribute:!1})],ke.prototype,"hass",2),u([m({attribute:!1})],ke.prototype,"value",2),ke=u([$("ambience-time-endpoint")],ke);function Yo(t,n){if(t===0)return"";let e=Math.abs(t),r=t<0?"\u2212":"+";if(e%60===0){let i=e/60,s=i===1?d(n,"ui.unit_hour","hour"):d(n,"ui.unit_hours","hours");return`${r}${i} ${s}`}return`${r}${e} ${d(n,"ui.unit_min","min")}`}var at={kind:"any"},wn={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},Z=class extends _{constructor(){super(...arguments);this.value=null;this._entries=[at];this._openIdx=0}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[at]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(r=>{let i=this._entries[this._openIdx];if(!i)return;let s=i.kind==="any"?"__any__":i.kind==="range"?"__custom__":i.period;r.value!==s&&(r.value=s)})}_predicateToEntries(e){return e===null?[at]:(Array.isArray(e)?e:[e]).map(i=>"period"in i?{kind:"period",period:i.period}:{kind:"range",from:i.from,to:i.to})}_emit(e){let r=e.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),i=r.length===0?null:r.length===1?r[0]:r;this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:i},bubbles:!0,composed:!0}))}_effectiveIds(){if(!this.periods)return[];let e=Object.keys(this.periods.builtins),r=Object.keys(this.periods.custom).filter(s=>!(s in this.periods.builtins)),i=new Set(this.periods.hidden);return[...e.filter(s=>!i.has(s)),...r]}_onSelectChange(e,r){let i=r.target.value,s=[...this._entries];i==="__any__"?s[e]=at:i==="__custom__"?s[e]={kind:"range",...wn}:s[e]={kind:"period",period:i},this._entries=s,this._emit(s)}_onRangeChange(e,r,i){i.stopPropagation();let s=this._entries[e];if(!s||s.kind!=="range")return;let a=[...this._entries];a[e]={...s,[r]:i.detail.value},this._entries=a,this._emit(a)}_onRemove(e){let r=this._entries.filter((i,s)=>s!==e);this._entries=r.length===0?[at]:r,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...wn}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,r){let i;return e.kind==="any"?i=d(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?i=Dt({period:e.period},{hass:this.hass,periods:this.periods}):i=Dt({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),l`
      <div class="summary-chip" @click=${()=>this._onChipClick(r)}>
        <span class="chip-label">${i}</span>
        ${this._entries.length>1?l`<button class="remove" @click=${s=>{s.stopPropagation(),this._onRemove(r)}} title=${d(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,r,i){let s=this._effectiveIds(),a=this.periods?.custom??{};return l`
      <div class="entry">
        <div class="entry-header">
          <select @change=${o=>this._onSelectChange(r,o)}>
            ${i?l`<option value="__any__">${d(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${d(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${s.map(o=>l`<option value=${o}>
                ${$e(this.hass,o,a)}${a[o]&&!this.periods?.builtins[o]?d(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?l`<button class="remove" @click=${()=>this._onRemove(r)} title=${d(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${e.kind==="range"?l`
              <div class="range-row">
                <label>${d(this.hass,"ui.from_label","From")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.from}
                  @value-changed=${o=>this._onRangeChange(r,"from",o)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${d(this.hass,"ui.to_label","To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${o=>this._onRangeChange(r,"to",o)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(i=>i.kind!=="any"),r=this._entries.length>1;return l`
      ${this._entries.map((i,s)=>r&&s!==this._openIdx?this._renderChip(i,s):this._renderEntry(i,s,s===0))}
      ${e?l`<button class="add-btn" @click=${this._onAdd}>${d(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};Z.styles=y`
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
  `,u([m({attribute:!1})],Z.prototype,"value",2),u([m({attribute:!1})],Z.prototype,"periods",2),u([m({attribute:!1})],Z.prototype,"hass",2),u([g()],Z.prototype,"_entries",2),u([g()],Z.prototype,"_openIdx",2),Z=u([$("ambience-time-of-day-input")],Z);function xn(t){if(typeof t!="string")return!1;let n=t.split(",").map(e=>e.trim()).filter(e=>e!=="");if(n.length===0)return!1;for(let e of n)if(e.includes("-")){let r=e.split("-").map(a=>a.trim());if(r.length!==2||!/^\d+$/.test(r[0])||!/^\d+$/.test(r[1]))return!1;let i=Number(r[0]),s=Number(r[1]);if(!(i>=1&&i<=s&&s<=31))return!1}else{if(!/^\d+$/.test(e))return!1;let r=Number(e);if(!(r>=1&&r<=31))return!1}return!0}var Sr=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Ko=new Set(["workday","holiday"]),Vo=new Set(["first_workday","last_workday"]),Qo=[31,29,31,30,31,30,31,31,30,31,30,31];function ot(t){return Qo[t-1]??31}function Cr(t){switch(t){case"weekday":return{kind:t,days:[]};case"day_of_month":return{kind:t,days:""};case"date":return{kind:t,month:1,day:1};case"date_range":return{kind:t,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:t}}}var pe=class extends _{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?d(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return d(this.hass,"ui.field_kind","Kind");case"days":return d(this.hass,"ui.field_days_of_month","Days of month");case"month":return d(this.hass,"ui.field_month","Month");case"day":return d(this.hass,"ui.field_day","Day");case"from_month":return d(this.hass,"ui.field_from_month","From month");case"from_day":return d(this.hass,"ui.field_from_day","From day");case"to_month":return d(this.hass,"ui.field_to_month","To month");case"to_day":return d(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let r=e.include.length===0&&e.exclude.length===0;this.value=r?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_addItem(e,r){let i=this._current();i[e]=[...i[e],Cr(r)],this._emit(i)}_removeItem(e,r){let i=this._current();i[e]=i[e].filter((s,a)=>a!==r),this._emit(i)}_updateItem(e,r,i){let s=this._current();s[e]=s[e].map((a,o)=>o===r?i:a),this._emit(s)}_kindDisabled(e){return!!(Ko.has(e)&&!this.dayConfig.workday_sensor||Vo.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:Sr.map(e=>({value:e,label:vt(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:Re(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:ot(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,r){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(r.days??"")}:e}_setDatePart(e,r,i){let s=Number(i);if(!Number.isFinite(s)||s<1)return e;if(e.kind==="date"){let{month:a,day:o}=e;return r==="month"&&(a=s),r==="day"&&(o=s),{kind:"date",month:a,day:Math.min(o,ot(a))}}if(e.kind==="date_range"){let a={...e.from},o={...e.to};return r==="from_month"&&(a.month=s),r==="from_day"&&(a.day=s),r==="to_month"&&(o.month=s),r==="to_day"&&(o.day=s),a.day=Math.min(a.day,ot(a.month)),o.day=Math.min(o.day,ot(o.month)),{kind:"date_range",from:a,to:o}}return e}_onKindForm(e,r,i){let s=i.kind;if(!s){this._removeItem(e,r);return}if(this._kindDisabled(s))return;let a=this._current()[e][r];a&&a.kind===s||this._updateItem(e,r,Cr(s))}_dayOfMonthError(e){return e.trim()===""||xn(e)?null:d(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(e,r,i,s){this._updateItem(e,r,this._bodyPatch(i,s))}_renderWeekday(e,r,i){return l`${[0,1,2,3,4,5,6].map(s=>l`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${i.days.includes(s)}
          @change=${a=>{let c=a.target.checked?[...i.days,s].sort((h,p)=>h-p):i.days.filter(h=>h!==s);this._updateItem(e,r,{kind:"weekday",days:c})}}
        />${gt(this.hass,s)}
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
        @change=${s=>{let a=s.target.value;this._kindDisabled(a)||a===i.kind||this._updateItem(e,r,Cr(a))}}
      >
        ${Sr.map(s=>l`<option value=${s} ?disabled=${this._kindDisabled(s)}>${vt(this.hass,s)}</option>`)}
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
      ></ha-form>`}return this._renderNativeBody(e,r,i)}_renderDateRow(e,r,i,s,a,o,c){let h=(p,f)=>{this._updateItem(e,r,this._setDatePart(i,p,f[p]))};return l`
      <div class="date-row">
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:s,required:!0,selector:this._monthSelector()}]}
          .data=${{[s]:String(o)}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${p=>{p.stopPropagation(),h(s,p.detail.value)}}
        ></ha-form>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:a,required:!0,selector:this._daySelector(o)}]}
          .data=${{[a]:c}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${p=>{p.stopPropagation(),h(a,p.detail.value)}}
        ></ha-form>
      </div>
    `}_renderNativeBody(e,r,i){if(i.kind==="day_of_month"){let o=this._dayOfMonthError(i.days);return l`<input
        type="text" placeholder=${d(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${i.days}
        @change=${c=>this._updateItem(e,r,this._bodyPatch(i,{days:c.target.value}))}
      />${o?l`<div class="field-error">${o}</div>`:""}`}let s=(o,c)=>l`
      <input type="number" min="1" max="12" .value=${String(c)}
        @change=${h=>this._updateItem(e,r,this._setDatePart(i,o,h.target.value))} />
    `,a=(o,c,h)=>l`
      <input type="number" min="1" max=${String(ot(c))} .value=${String(h)}
        @change=${p=>this._updateItem(e,r,this._setDatePart(i,o,p.target.value))} />
    `;return i.kind==="date"?l`${s("month",i.month)} / ${a("day",i.month,i.day)}`:i.kind==="date_range"?l`
        <span>${d(this.hass,"ui.from","from")}</span>
        ${s("from_month",i.from.month)} / ${a("from_day",i.from.month,i.from.day)}
        <span>${d(this.hass,"ui.to","to")}</span>
        ${s("to_month",i.to.month)} / ${a("to_day",i.to.month,i.to.day)}
      `:l``}_renderAddPicker(e){let r=e==="include"?d(this.hass,"ui.add_include_item","+ Add include item"):d(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let i=()=>r;return l`<ha-form
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
        ${Sr.map(i=>l`<option value=${i} ?disabled=${this._kindDisabled(i)}>${vt(this.hass,i)}</option>`)}
      </select>
    `}_renderItem(e,r,i){return l`
      <div class="item">
        ${this._renderKindPicker(e,r,i)}
        <div class="body">${this._renderItemBody(e,r,i)}</div>
        <button class="remove" title=${d(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(e,r)}>✕</button>
      </div>
    `}_renderSection(e,r){return l`
      <div class="section">
        <h4>${e==="include"?d(this.hass,"ui.include","Include"):d(this.hass,"ui.exclude","Exclude")}</h4>
        ${r.length===0&&e==="include"?l`<div class="hint">${d(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${r.map((i,s)=>this._renderItem(e,s,i))}
        ${this._renderAddPicker(e)}
      </div>
    `}render(){let{include:e,exclude:r}=this._current();return l`
      ${this._renderSection("include",e)}
      ${this._renderSection("exclude",r)}
    `}};pe.styles=y`
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
      padding: 0.15rem 0.4rem 0.15rem 0;
      cursor: pointer;
    }
  `,u([m({attribute:!1})],pe.prototype,"hass",2),u([m({attribute:!1})],pe.prototype,"value",2),u([m({attribute:!1})],pe.prototype,"dayConfig",2),pe=u([$("ambience-day-predicate-input")],pe);var kn=["temperature","apparent_temperature","humidity","wind_speed","pressure"],En=["<","<=",">",">="],Sn={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},ie=class extends _{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(e){let r=e.groups.length===0&&e.thresholds.length===0;this.value=r?null:e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setGroups(e){this._emit({...this._current(),groups:e})}_addThreshold(){let e=this._current();e.thresholds=[...e.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(e)}_updateThreshold(e,r){let i=this._current();i.thresholds=i.thresholds.map((s,a)=>a===e?r:s),this._emit(i)}_removeThreshold(e){let r=this._current();r.thresholds=r.thresholds.filter((i,s)=>s!==e),this._emit(r)}_attributeSchema(e){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:kn.map(r=>({value:r,label:Ve(this.hass,r)}))}}}]}_opSchema(e){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:En.map(r=>({value:r,label:Sn[r]}))}}}]}_entityState(){let e=this.weatherEntity;return e?this.hass?.states?.[e]:void 0}_valueSchema(e,r){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:rr(this.hass,r,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(e=>({value:e.id,label:e.label}))}}}]}_renderGroups(e){return customElements.get("ha-form")?l`<ha-form
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
      ${kn.map(i=>l`<option value=${i} ?selected=${i===r.attribute}>${Ve(this.hass,i)}</option>`)}
    </select>`}_renderOpSelect(e,r){return customElements.get("ha-form")?l`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(e)}
        .data=${{op:r.op}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation();let s=i.detail.value.op;s&&this._updateThreshold(e,{...r,op:s})}}
      ></ha-form>`:l`<select
      @change=${i=>this._updateThreshold(e,{...r,op:i.target.value})}>
      ${En.map(i=>l`<option value=${i} ?selected=${i===r.op}>${Sn[i]}</option>`)}
    </select>`}_renderValueInput(e,r){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(e,r.attribute)}
        .data=${{value:r.value}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let a=s.detail.value.value;typeof a=="number"&&Number.isFinite(a)&&this._updateThreshold(e,{...r,value:a})}}
      ></ha-form>`;let i=rr(this.hass,r.attribute,this._entityState());return l`<span class="value-wrap">
      <input type="number" .value=${String(r.value)}
        @change=${s=>{let a=Number(s.target.value);Number.isFinite(a)&&this._updateThreshold(e,{...r,value:a})}} />
      <span class="unit">${i}</span>
    </span>`}_renderThreshold(e,r){return l`
      <div class="threshold">
        ${this._renderAttributeSelect(e,r)}
        ${this._renderOpSelect(e,r)}
        ${this._renderValueInput(e,r)}
        <button class="remove" title=${d(this.hass,"ui.remove","Remove")} @click=${()=>this._removeThreshold(e)}>✕</button>
      </div>
    `}render(){let{groups:e,thresholds:r}=this._current();return l`
      <div class="section">
        <h4>${d(this.hass,"ui.groups","Groups")}</h4>
        ${this._renderGroups(e)}
      </div>
      <div class="section">
        <h4>${d(this.hass,"ui.thresholds","Thresholds")}</h4>
        ${r.map((i,s)=>this._renderThreshold(s,i))}
        <button class="add" @click=${()=>this._addThreshold()}>${d(this.hass,"ui.add_threshold","+ Add threshold")}</button>
      </div>
    `}};ie.styles=y`
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
  `,u([m({attribute:!1})],ie.prototype,"hass",2),u([m({attribute:!1})],ie.prototype,"value",2),u([m({attribute:!1})],ie.prototype,"groups",2),u([m({attribute:!1})],ie.prototype,"weatherEntity",2),ie=u([$("ambience-weather-predicate-input")],ie);var Jo=["NW","N","NE","W",null,"E","SW","S","SE"],Ee=class extends _{constructor(){super(...arguments);this.value=null}_current(){let e=this.value?.azimuth?.ranges??[];return{elevation:this.value?.elevation??null,sectors:[...this.value?.azimuth?.sectors??[]],range:e.length?{...e[0]}:null}}_emit(e){let r={};e.elevation&&(e.elevation.min!=null||e.elevation.max!=null)&&(r.elevation=e.elevation);let i={};e.sectors.length&&(i.sectors=e.sectors),e.range&&(i.ranges=[e.range]),(i.sectors||i.ranges)&&(r.azimuth=i),this.value=r.elevation||r.azimuth?r:null,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setElevation(e){this._emit({...this._current(),elevation:e})}_setSectors(e){this._emit({...this._current(),sectors:e})}_setRange(e){this._emit({...this._current(),range:e})}_mode(e){return!e||e.min==null&&e.max==null?"any":e.min!=null&&e.max!=null?"between":e.min!=null?"above":"below"}_onModeChange(e,r){let i=r?.min??0,s=r?.max??0;e==="any"?this._setElevation(null):e==="above"?this._setElevation({min:i}):e==="below"?this._setElevation({max:s}):this._setElevation({min:i,max:s})}_toggleSector(e,r,i){this._setSectors(i?[...e,r]:e.filter(s=>s!==r))}_renderSectors(e){return l`<div class="sectors">${Jo.map(r=>r===null?l`<span class="spacer"></span>`:l`<label>
            <input type="checkbox" .checked=${e.includes(r)}
              @change=${i=>this._toggleSector(e,r,i.target.checked)} />${r}
          </label>`)}</div>`}_renderElevation(e){let r=this._mode(e),i=["any","above","below","between"],s={any:d(this.hass,"ui.sun.any","Any"),above:d(this.hass,"ui.sun.above","Above"),below:d(this.hass,"ui.sun.below","Below"),between:d(this.hass,"ui.sun.between","Between")};return l`
      <div class="row">
        <select @change=${a=>this._onModeChange(a.target.value,e)}>
          ${i.map(a=>l`<option value=${a} ?selected=${a===r}>${s[a]}</option>`)}
        </select>
        ${r==="above"||r==="between"?l`<input type="number" class="min" .value=${String(e?.min??0)}
              @change=${a=>this._setElevation({...r==="between"?{max:e?.max??0}:{},min:Number(a.target.value)})} /><span class="deg">°</span>`:""}
        ${r==="below"||r==="between"?l`<input type="number" class="max" .value=${String(e?.max??0)}
              @change=${a=>this._setElevation({...r==="between"?{min:e?.min??0}:{},max:Number(a.target.value)})} /><span class="deg">°</span>`:""}
      </div>
    `}_renderCustomRange(e){return l`
      <label class="custom-range">
        <input type="checkbox" class="custom-range-toggle" .checked=${e!==null}
          @change=${r=>this._setRange(r.target.checked?{from:0,to:0}:null)} />
        ${d(this.hass,"ui.sun.custom_range","Custom range")}
      </label>
      ${e===null?"":l`<div class="row range-row">
            <input type="number" class="from" .value=${String(e.from)}
              @change=${r=>this._setRange({...e,from:Number(r.target.value)})} />
            <span class="deg">°–</span>
            <input type="number" class="to" .value=${String(e.to)}
              @change=${r=>this._setRange({...e,to:Number(r.target.value)})} />
            <span class="deg">°</span>
          </div>`}
    `}render(){let{elevation:e,sectors:r,range:i}=this._current();return l`
      <div class="section">
        <h4>${d(this.hass,"ui.sun.elevation","Elevation")}</h4>
        ${this._renderElevation(e)}
      </div>
      <div class="section">
        <h4>${d(this.hass,"ui.sun.azimuth","Azimuth")}</h4>
        ${this._renderSectors(r)}
        ${this._renderCustomRange(i)}
      </div>
    `}};Ee.styles=y`
    :host { display: block; }
    .section { margin-bottom: 1rem; }
    .section h4 { margin: 0 0 0.5rem 0; font-size: 0.95em; }
    .row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem; }
    select, input[type="number"] {
      padding: 0.25rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
    }
    .deg { color: var(--secondary-text-color, #888); font-size: 0.9em; }
    .sectors {
      display: grid;
      /* Equal-width columns so every checkbox lines up vertically; left-aligned
         content keeps each checkbox flush at the start of its column. */
      grid-template-columns: repeat(3, 4rem);
      gap: 0.4rem 0.5rem;
      justify-items: start;
      width: max-content;
    }
    .sectors label {
      display: inline-flex; align-items: center; gap: 0.3rem; margin: 0;
    }
    .custom-range {
      display: inline-flex; align-items: center; gap: 0.3rem;
      margin: 0.75rem 0 0.4rem;
    }
  `,u([m({attribute:!1})],Ee.prototype,"hass",2),u([m({attribute:!1})],Ee.prototype,"value",2),Ee=u([$("ambience-sun-predicate-input")],Ee);var H=class extends _{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[]}async updated(e){if(e.has("value")){let i=e.get("value")?.entity_id,s=this.value.entity_id;if(s&&s!==i&&this.hass)try{let a=await ui(this.hass,s);this._knownStates=a.states}catch{this._knownStates=[]}}}_normalize(e){let r={...e};return r.attribute===""&&(r.attribute=null),r.for&&r.for.h===0&&r.for.m===0&&r.for.s===0&&(r.for=null),r}_emit(e){let r=this._normalize(e);this.value=r,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r},bubbles:!0,composed:!0}))}_autoFlipOp(e){let r=this._isNumericTargetFor(e),i=this._isNumericOp(e.kind);return r&&!i?{...e,kind:">"}:!r&&i?{...e,kind:"is"}:e}_setEntity(e){this._emit(this._autoFlipOp({...this.value,entity_id:e,states:[],attribute:null}))}_setAttribute(e){this._emit(this._autoFlipOp({...this.value,attribute:e}))}_setOp(e){this._emit({...this.value,kind:e})}_setStates(e){this._emit({...this.value,states:e})}_setValueAt(e,r){if(this._isNumericOp(this.value.kind)){this._setStates([r]);return}let i=this.value.states.slice();r===""?i.splice(e,1):i[e]=r,this._setStates(i)}_addValue(e){e&&this._setStates([...this.value.states,e])}_removeValueAt(e){let r=this.value.states.slice();r.splice(e,1),this._setStates(r)}_setForDuration(e){this._emit({...this.value,for:e})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(e){if(!e)return[];let i=this.hass?.states?.[e]?.attributes;return i?Object.keys(i).sort():[]}_attributeSchema(){let e=this._knownAttributesFor(this.value.entity_id);return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:H._STATE_SENTINEL,label:H._STATE_SENTINEL},...e.map(r=>({value:r,label:r}))]}}}]}_attributeData(){let e=this.value.attribute;return e?{attribute:e}:{attribute:H._STATE_SENTINEL}}_setAttributeFromHaForm(e){e===H._STATE_SENTINEL?this._setAttribute(""):this._setAttribute(e)}_isNumericOp(e){return H._NUMERIC_OPS.includes(e)}_isNumericTargetFor(e){let i=this.hass?.states?.[e.entity_id];if(!i)return!1;if(e.attribute)return typeof i.attributes?.[e.attribute]=="number";let s=i.state;return typeof s!="string"||s===""||s==="unknown"||s==="unavailable"?!1:Number.isFinite(Number(s))}_opSchema(){let e=this._isNumericTargetFor(this.value)?[...H._NUMERIC_OPS]:["is","is_not"];return e.includes(this.value.kind)||e.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:e.map(r=>({value:r,label:K(this.hass,r)}))}}}]}_currentAttributeValue(){return this.value.attribute?this.hass?.states?.[this.value.entity_id]?.attributes?.[this.value.attribute]:void 0}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let e;if(this.value.attribute){let r=this._currentAttributeValue();e=r==null?[]:[String(r)]}else e=this._knownStates;return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:e.map(r=>({value:r,label:r}))}}}]}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let e=this.value.for??{h:0,m:0,s:0};return{duration:{hours:e.h,minutes:e.m,seconds:e.s}}}_setForFromHaForm(e){this._setForDuration({h:e?.hours??0,m:e?.minutes??0,s:e?.seconds??0})}_renderEntity(){return customElements.get("ha-form")?l`<ha-form
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
      placeholder=${d(this.hass,"ui.state_attribute_placeholder","leave blank to compare state")}
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
    </select>`}_renderValueRow(e,r){let i=r===-1,s=i?c=>this._addValue(c):c=>this._setValueAt(r,c),a=this._isNumericOp(this.value.kind),o=a?{value:e===""?void 0:Number(e)}:{value:e};return customElements.get("ha-form")?l`
        <div class="value-row" data-row=${r}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${o}
            .computeLabel=${()=>""}
            @value-changed=${c=>{c.stopPropagation();let h=c.detail.value.value;s(h==null?"":String(h))}}
          ></ha-form>
        </div>
      `:l`
      <div class="value-row" data-row=${r}>
        <input type=${a?"number":"text"} .value=${e}
          placeholder=${i?d(this.hass,"ui.state_add_value","+ Add state"):""}
          @change=${c=>s(c.target.value)} />
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
          ${this._isNumericOp(this.value.kind)?this._renderValueRow(this.value.states[0]??"",0):l`
                ${this.value.states.map((e,r)=>this._renderValueRow(e,r))}
                ${this._renderValueRow("",-1)}
              `}
        </div>
      </section>
      <section class="field">
        <label class="field-label">${d(this.hass,"ui.state_for","For (optional)")}</label>
        ${this._renderForRow()}
      </section>
    `}};H.styles=y`
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
  `,H._STATE_SENTINEL="State",H._NUMERIC_OPS=[">",">=","<","<="],u([m({attribute:!1})],H.prototype,"hass",2),u([m({attribute:!1})],H.prototype,"value",2),u([g()],H.prototype,"_knownStates",2),H=u([$("ambience-state-expr-atom")],H);function Tr(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,r)=>e===n[r])}var U=class extends _{constructor(){super(...arguments);this.path=[];this._dragOver=!1;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(e,r={}){this.dispatchEvent(new CustomEvent(e,{detail:{path:this.path,...r},bubbles:!0,composed:!0}))}_atomIsComplete(e){return!!e.entity_id&&e.states.some(r=>r!=="")}_isErrorTarget(){return Tr(this.path,this.errorPath)}_onDragStart(e){if(this.path.length===0){e.preventDefault();return}let r=e.target;if(r&&r.closest("button, select, input, textarea, ha-form")){e.preventDefault();return}e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("application/x-ambience-path",JSON.stringify(this.path)))}_onDragOver(e){this.path.length!==0&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._dragOver=!0)}_onDragLeave(e){e.stopPropagation(),this._dragOver=!1}_onDrop(e){if(this.path.length===0||(e.preventDefault(),e.stopPropagation(),this._dragOver=!1,!e.dataTransfer))return;let r=e.dataTransfer.getData("application/x-ambience-path");if(!r)return;let i;try{i=JSON.parse(r)}catch{return}!Array.isArray(i)||i.every(s=>typeof s=="number")===!1||Tr(i,this.path)||this.dispatchEvent(new CustomEvent("node-move",{detail:{from:i,to:this.path},bubbles:!0,composed:!0}))}_renderAtomCard(e,r){let i=this._atomIsComplete(e),s=Tr(this.path,this.openPath),a=i?hr(e,{hass:this.hass}):d(this.hass,"ui.state_new_condition","(new condition)");return l`
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
            @click=${o=>{o.stopPropagation(),this._emit("node-toggle-not")}}>${K(this.hass,"not")}</button>
          <span class="summary ${i?"":"placeholder"}">${a}</span>
          <button class="wrap"
            title=${d(this.hass,"ui.state_wrap","Wrap in group")}
            @click=${o=>{o.stopPropagation(),this._emit("node-wrap")}}>(…)</button>
          <button class="remove"
            title=${d(this.hass,"ui.remove","Remove")}
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
            <option value="and" ?selected=${e.kind==="and"}>${K(this.hass,"and")}</option>
            <option value="or"  ?selected=${e.kind==="or"} >${K(this.hass,"or")}</option>
          </select>
          <button class="unwrap"
            title=${d(this.hass,"ui.state_unwrap_group","Remove these parens (promote children to parent)")}
            @click=${()=>this._emit("node-unwrap")}>✕</button>
        </div>
        <div class="group-children">
          ${e.items.map((r,i)=>this._renderChildRow(r,i))}
        </div>
        <div class="actions">
          <button @click=${()=>this._emit("node-add-child")}>
            + ${d(this.hass,"ui.state_add_condition","Add condition")}
          </button>
        </div>
      </div>
    `}render(){let e=this.value.kind==="not",r=e?this.value.item:this.value;return r.kind==="and"||r.kind==="or"?this._renderGroupWithExternalNot(r,e):this._renderAtomCard(r,e)}_renderGroupWithExternalNot(e,r){let i=this.path.length===0;return l`
      <div class="group-wrap">
        ${i?"":l`<button class="not-toggle external ${r?"on":""}"
          title=${d(this.hass,"ui.state_not_toggle","Negate (NOT)")}
          @click=${()=>this._emit("node-toggle-not")}>${K(this.hass,"not")}</button>`}
        ${this._renderGroup(e)}
      </div>
    `}};U.styles=y`
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
  `,u([m({attribute:!1})],U.prototype,"hass",2),u([m({attribute:!1})],U.prototype,"value",2),u([m({attribute:!1})],U.prototype,"path",2),u([g()],U.prototype,"_dragOver",2),u([m({attribute:!1})],U.prototype,"openPath",2),u([m({attribute:!1})],U.prototype,"errorPath",2),u([m({attribute:!1})],U.prototype,"errorMessage",2),U=u([$("ambience-state-expr-node")],U);function Lr(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,r)=>e===n[r])}var ne=class extends _{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._onNodeMove=e=>{e.stopPropagation(),this._moveAt(e.detail.from,e.detail.to)};this._onNodeChange=e=>{e.stopPropagation(),this._replaceAt(e.detail.path,e.detail.value)};this._onNodeRemove=e=>{e.stopPropagation(),this._removeAt(e.detail.path)};this._onNodeWrap=e=>{e.stopPropagation(),this._wrapAt(e.detail.path)};this._onNodeAddChild=e=>{e.stopPropagation(),this._addChildAt(e.detail.path,"is")};this._onNodeToggleNot=e=>{e.stopPropagation(),this._toggleNotAt(e.detail.path)};this._onNodeSetOp=e=>{e.stopPropagation(),this._setGroupOpAt(e.detail.path,e.detail.op)};this._onNodeUnwrap=e=>{e.stopPropagation(),this._unwrapAt(e.detail.path)};this._onNodeOpen=e=>{if(e.stopPropagation(),this._openPath!==null){let r=this._atomAt(this._openPath);if(r&&this._atomError(r)!==null){this._showError=!0;return}}this._openPath!==null&&Lr(this._openPath,e.detail.path)?this._openPath=null:this._openPath=e.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-move",this._onNodeMove)}_emit(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(e,r){let i=this._patch(this.value,e,()=>r);this._emit(i)}_removeAt(e){if(e.length===0){this._emit(null);return}let r=this._patch(this.value,e,()=>null);this._emit(r)}_wrapAt(e){let r=null;if(e.length>0){let a=this._nodeAt(e.slice(0,-1));a&&(a.kind==="and"||a.kind==="or")&&(r=a.kind)}let i=r==="and"?"or":"and",s=this._patch(this.value,e,a=>a&&{kind:i,items:[a]});this._emit(s)}_nodeAt(e){return this._walkNode(this.value,e)}_moveAt(e,r){if(this._isPrefix(e,r)||e.length===0||r.length===0)return;let i=this._nodeAt(e);if(!i)return;let s=this._rewriteForMove(this.value,[],e,r,i);this._emit(s)}_isPrefix(e,r){return e.length>r.length?!1:e.every((i,s)=>i===r[s])}_rewriteForMove(e,r,i,s,a){if(!e)return e;if(e.kind==="not"){let v=this._rewriteForMove(e.item,r,i,s,a);return v==null?null:{kind:"not",item:v}}if(e.kind!=="and"&&e.kind!=="or")return e;let o=i.slice(0,-1),c=s.slice(0,-1),h=Lr(r,o),p=Lr(r,c),f=[];if(e.items.forEach((v,b)=>{let k=[...r,b];if(h&&b===i[i.length-1])return;let x=this._rewriteForMove(v,k,i,s,a);x!==null&&f.push(x)}),p){let v=s[s.length-1];f.splice(v,0,a)}return f.length===0?null:{...e,items:f}}_walkNode(e,r){return e?e.kind==="not"?this._walkNode(e.item,r):r.length===0?e:e.kind==="and"||e.kind==="or"?this._walkNode(e.items[r[0]]??null,r.slice(1)):null:null}_addChildAt(e,r){let i=null,s=this._patch(this.value,e,a=>{if(a&&(a.kind==="and"||a.kind==="or")){let o=[...a.items,this._emptyAtom()];return i=[...e,o.length-1],{...a,items:o}}return a});i!==null&&(this._openPath=i),this._emit(s)}_toggleNotAt(e){let r=this._patch(this.value,e,i=>i&&(i.kind==="not"?i.item:{kind:"not",item:i}));this._emit(r)}_setGroupOpAt(e,r){let i=this._patch(this.value,e,s=>{if(!s)return s;let a=null;if(s.kind==="and"||s.kind==="or")a=s;else if(s.kind==="not"){let o=s.item;(o.kind==="and"||o.kind==="or")&&(a=o)}return a?{kind:r,items:a.items}:s});this._emit(i)}_patch(e,r,i){if(r.length===0)return i(e);if(e==null)return e;let[s,...a]=r;if(e.kind==="and"||e.kind==="or"){let o=e.items.length,c=e.items.slice(),h=this._patch(c[s],a,i);if(h===null?c.splice(s,1):c[s]=h,c.length<o){if(c.length===0)return null;if(c.length===1)return c[0]}return{...e,items:c}}if(e.kind==="not"){let o=this._patch(e.item,r,i);return o==null?null:{kind:"not",item:o}}return e}_atomAt(e){return this._walk(this.value,e)}_walk(e,r){return e?e.kind==="not"?this._walk(e.item,r):r.length===0?e.kind==="and"||e.kind==="or"?null:e:e.kind==="and"||e.kind==="or"?this._walk(e.items[r[0]]??null,r.slice(1)):null:null}_atomError(e){if(!e.entity_id)return d(this.hass,"ui.state_err_entity","Entity is required");if(e.kind!=="is"&&e.kind!=="is_not"){let i=e.states[0];if(!i)return d(this.hass,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(i)))return d(this.hass,"ui.state_err_numeric","Value must be a number")}else if(!e.states.some(i=>i!==""))return d(this.hass,"ui.state_err_state","State is required");return null}_unwrapAt(e){if(e.length===0){let a=this.value;if(!a)return;let o=a.kind==="not"?a.item:a;(o.kind==="and"||o.kind==="or")&&(o.items.length===1?this._emit(o.items[0]):this._emit(null));return}let r=e.slice(0,-1),i=e[e.length-1],s=this._patch(this.value,r,a=>{if(!a||a.kind!=="and"&&a.kind!=="or")return a;let o=a.items.slice(),c=o[i],h=null;if(c.kind==="and"||c.kind==="or")h=c;else if(c.kind==="not"){let p=c.item;(p.kind==="and"||p.kind==="or")&&(h=p)}return h?(o.splice(i,1,...h.items),{...a,items:o}):a});this._emit(s)}willUpdate(e){if(e.has("value")){let r=this.value;if(r&&this._openPath===null&&r.kind!=="and"&&r.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let i=this._atomAt(this._openPath);(!i||this._atomError(i)===null)&&(this._showError=!1)}}}_addAtRoot(){let e=this.value;if(e==null){this._addFirstAtom();return}if(e.kind==="and"||e.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[e,this._emptyAtom()]})}_setOpen(e){this._openPath=e}render(){if(this.value==null)return l`
        <div class="empty">
          <button @click=${()=>this._addFirstAtom()}>
            + ${d(this.hass,"ui.state_add_first","Add condition")}
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
          + ${d(this.hass,"ui.state_add_condition","Add condition")}
        </button>
      `:""}
    `}};ne.styles=y`
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
  `,u([m({attribute:!1})],ne.prototype,"hass",2),u([m({attribute:!1})],ne.prototype,"value",2),u([g()],ne.prototype,"_openPath",2),u([g()],ne.prototype,"_showError",2),ne=u([$("ambience-state-predicate-input")],ne);var Cn=["everybody","anybody","nobody","any","all","none"],Tn=new Set(["any","all","none"]),Ar={everybody:"everyone",anybody:"any",nobody:"nobody",any:"any",all:"everyone",none:"nobody"},Se=class extends _{constructor(){super(...arguments);this.value=null;this._lastSelected=[]}_statesMap(){return this.hass?.states??{}}_entitiesOfDomain(e){let r=this._statesMap(),i=`${e}.`;return Object.keys(r).filter(s=>s.startsWith(i)).sort().map(s=>({id:s,name:r[s]?.attributes?.friendly_name??s}))}_persons(){return this._entitiesOfDomain("person")}_zones(){return this._entitiesOfDomain("zone")}_cur(){return this.value??{}}_who(){return this.value?.who??[]}_hasWhoKey(){return this.value!=null&&Array.isArray(this.value.who)}_mode(){if(this._hasWhoKey())switch(this._cur().quant??"any"){case"any":return"any";case"everyone":return"all";case"nobody":return"none"}switch(this._cur().quant??"everyone"){case"nobody":return"nobody";case"any":return"anybody";default:return"everybody"}}_hasFor(e){return!!e&&(e.h!==0||e.m!==0||e.s!==0)}_isNegativeQuant(){return Ar[this._mode()]==="nobody"}_effectiveNegate(){return!this._isNegativeQuant()&&!!this._cur().negate}_emitMode(e){let r=this._cur(),i=r.where??"home",s={quant:Ar[e],where:i};r.negate&&Ar[e]!=="nobody"&&(s.negate=!0),Tn.has(e)&&(this._hasWhoKey()?s.who=[...this._who()]:this._lastSelected.length>0?s.who=[...this._lastSelected]:s.who=this._persons().map(a=>a.id)),this._hasFor(r.for)&&(s.for=r.for),this._emit(s)}_emit(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_setMode(e){this._emitMode(e)}_setWhere(e){let r=this._cur(),i={quant:r.quant??"everyone",where:e};this._effectiveNegate()&&(i.negate=!0),this._hasWhoKey()&&(i.who=[...this._who()]),this._hasFor(r.for)&&(i.for=r.for),this._emit(i)}_setNegate(e){let r=this._cur(),i={quant:r.quant??"everyone",where:r.where??"home"};e&&(i.negate=!0),this._hasWhoKey()&&(i.who=[...this._who()]),this._hasFor(r.for)&&(i.for=r.for),this._emit(i)}_togglePerson(e,r){let i=r?[...this._who(),e]:this._who().filter(o=>o!==e);i.length>0&&(this._lastSelected=[...i]);let s=this._cur(),a={quant:s.quant??"any",where:s.where??"home",who:i};this._effectiveNegate()&&(a.negate=!0),this._hasFor(s.for)&&(a.for=s.for),this._emit(a)}_setFor(e){let r=this._cur(),i={quant:r.quant??"everyone",where:r.where??"home"};this._effectiveNegate()&&(i.negate=!0),this._hasWhoKey()&&(i.who=[...this._who()]),this._hasFor(e)&&(i.for=e),this._emit(i)}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let e=this._cur().for??{h:0,m:0,s:0};return{duration:{hours:e.h,minutes:e.m,seconds:e.s}}}_setForFromHaForm(e){this._setFor({h:e?.hours??0,m:e?.minutes??0,s:e?.seconds??0})}_modeLabel(e){switch(e){case"everybody":return d(this.hass,"ui.people_mode_everybody","Everybody");case"anybody":return d(this.hass,"ui.people_mode_anybody","Anybody");case"nobody":return d(this.hass,"ui.people_mode_nobody","Nobody");case"any":return d(this.hass,"ui.people_mode_any","Any of:");case"all":return d(this.hass,"ui.people_mode_all","All of:");case"none":return d(this.hass,"ui.people_mode_none","None of:")}}_renderMode(e){if(customElements.get("ha-form")){let r=[{name:"mode",required:!0,selector:{select:{mode:"dropdown",options:Cn.map(i=>({value:i,label:this._modeLabel(i)}))}}}];return l`<ha-form
        class="mode"
        .hass=${this.hass}
        .schema=${r}
        .data=${{mode:e}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),i.detail.value.mode&&this._setMode(i.detail.value.mode)}}
      ></ha-form>`}return l`<select
      class="mode"
      @change=${r=>this._setMode(r.target.value)}
    >
      ${Cn.map(r=>l`<option value=${r} ?selected=${r===e}>${this._modeLabel(r)}</option>`)}
    </select>`}_renderPeople(){let e=this._persons();if(e.length===0)return l`<div class="hint">${d(this.hass,"ui.people_none_tracked","No people tracked")}</div>`;let r=this._who();return l`<div class="people-list">
      ${e.map(i=>l`<label class="person-pill">
        <input
          type="checkbox"
          .checked=${r.includes(i.id)}
          @change=${s=>this._togglePerson(i.id,s.target.checked)}
        />${i.name}
      </label>`)}
    </div>
    <div class="field-error">${r.length===0?d(this.hass,"ui.people_select_one","Select at least one person"):""}</div>`}_renderNegate(e){let r=[{value:"false",label:d(this.hass,"ui.people_is_at","Is at")},{value:"true",label:d(this.hass,"ui.people_is_not_at","Is not at")}],i=s=>this._setNegate(s==="true");if(customElements.get("ha-form")){let s=[{name:"negate",required:!0,selector:{select:{mode:"dropdown",options:r}}}];return l`<ha-form
        class="negate"
        .hass=${this.hass}
        .schema=${s}
        .data=${{negate:e?"true":"false"}}
        .computeLabel=${()=>""}
        @value-changed=${a=>{a.stopPropagation(),a.detail.value.negate!=null&&i(a.detail.value.negate)}}
      ></ha-form>`}return l`<select
      class="negate"
      @change=${s=>i(s.target.value)}
    >
      ${r.map(s=>l`<option value=${s.value} ?selected=${s.value===(e?"true":"false")}>${s.label}</option>`)}
    </select>`}_renderWhere(e){let r=this._zones().filter(s=>s.id!=="zone.home"),i=[{value:"home",label:d(this.hass,"ui.people_where_home","Home")},...r.map(s=>({value:s.id,label:s.name}))];if(customElements.get("ha-form")){let s=[{name:"where",required:!0,selector:{select:{mode:"dropdown",options:i}}}];return l`<ha-form
        class="where"
        .hass=${this.hass}
        .schema=${s}
        .data=${{where:e}}
        .computeLabel=${()=>""}
        @value-changed=${a=>{a.stopPropagation(),a.detail.value.where&&this._setWhere(a.detail.value.where)}}
      ></ha-form>`}return l`<select
      class="where"
      @change=${s=>this._setWhere(s.target.value)}
    >
      ${i.map(s=>l`<option value=${s.value} ?selected=${s.value===e}>${s.label}</option>`)}
    </select>`}_renderFor(){if(customElements.get("ha-form"))return l`<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${this._forSchema()}
        .data=${this._forData()}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setForFromHaForm(r.detail.value.duration)}}
      ></ha-form>`;let e=this._cur().for??{h:0,m:0,s:0};return l`<div class="for-row" data-field="for">
      <input type="number" min="0" .value=${String(e.h)}
        @change=${r=>this._setFor({...e,h:Number(r.target.value)||0})} />
      <span>:</span>
      <input type="number" min="0" .value=${String(e.m)}
        @change=${r=>this._setFor({...e,m:Number(r.target.value)||0})} />
      <span>:</span>
      <input type="number" min="0" .value=${String(e.s)}
        @change=${r=>this._setFor({...e,s:Number(r.target.value)||0})} />
    </div>`}render(){let r=this._cur().where??"home",i=this._mode(),s=!this._isNegativeQuant(),a=this._effectiveNegate();return l`
      <div class="row">${this._renderMode(i)}</div>
      ${Tn.has(i)?this._renderPeople():""}
      <div class="row">
        ${s?this._renderNegate(a):l`<span class="label negate-static">${d(this.hass,"ui.people_is_at_static","is at")}</span>`}
        ${this._renderWhere(r)}
      </div>
      <div class="row">
        <span class="label">${d(this.hass,"ui.people_for","for")}</span>
        ${this._renderFor()}
      </div>
    `}};Se.styles=y`
    :host { display: block; }
    .row {
      display: flex; flex-wrap: wrap; align-items: center;
      gap: 0.5rem; margin-bottom: 0.6rem;
    }
    .label {
      color: var(--secondary-text-color, #888); font-size: 0.9em;
    }
    .people-list {
      display: flex; flex-direction: column; align-items: flex-start;
      gap: 0.3rem; margin-bottom: 0.6rem;
    }
    .hint { color: var(--secondary-text-color, #888); font-size: 0.85em; }
    .field-error {
      width: 100%; color: var(--error-color, #d32f2f); font-size: 0.85em; margin-top: 0.2rem;
      min-height: 1.2em;
    }
    select, input[type="number"], input[type="text"] {
      padding: 0.25rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
    label.person-pill {
      display: inline-flex; align-items: center; gap: 0.25rem;
      padding: 0.15rem 0; cursor: pointer;
    }
    .for-row { display: flex; gap: 0.25rem; align-items: center; }
    .for-row input[type='number'] { width: 3.5rem; }
  `,u([m({attribute:!1})],Se.prototype,"hass",2),u([m({attribute:!1})],Se.prototype,"value",2),Se=u([$("ambience-people-predicate-input")],Se);var Xo=new Set(["1","true","yes","on","enable"]);function Ln(t){return t==null?!1:typeof t=="boolean"?t:typeof t=="number"?t!==0:typeof t=="string"?Xo.has(t.toLowerCase().trim()):!1}function Zo(t){if(t!==null&&typeof t=="object")try{return JSON.stringify(t)}catch{return String(t)}return String(t)}var me=class extends _{constructor(){super(...arguments);this.value=null;this._preview=null;this._debounceMs=250;this._gen=0}_template(){return this.value&&typeof this.value=="object"?this.value.template:""}willUpdate(e){if(!e.has("value")&&!e.has("hass"))return;let r=this._template(),i=this.hass?.connection;r===this._activeTemplate&&i===this._activeConn||(this._activeTemplate=r,this._activeConn=i,this._scheduleRender())}disconnectedCallback(){super.disconnectedCallback(),this._teardown()}_teardown(){this._debounceTimer!=null&&(clearTimeout(this._debounceTimer),this._debounceTimer=void 0),this._unsub&&(this._unsub(),this._unsub=void 0)}_scheduleRender(){this._teardown();let e=this._template();if(!e.trim()||!this.hass?.connection?.subscribeMessage){this._setPreview(null);return}let r=++this._gen;this._debounceTimer=setTimeout(()=>this._subscribe(e,r),this._debounceMs)}async _subscribe(e,r){let i=this.hass?.connection;if(i?.subscribeMessage)try{let s=await i.subscribeMessage(a=>{r===this._gen&&this._setPreview(a.error!=null?{error:a.error}:{value:Zo(a.result),truthy:Ln(a.result)})},{type:"render_template",template:e,report_errors:!0});if(r!==this._gen){s();return}this._unsub=s}catch(s){if(r!==this._gen)return;this._setPreview({error:s?.message??String(s)})}}_setPreview(e){this._preview=e,this._emitValidity(e!=null&&"error"in e?e.error:null)}_emitValidity(e){this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_onInput(e){let r=e.target.value,i=r.trim()===""?null:{template:r};this.value=i,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:i},bubbles:!0,composed:!0}))}_renderPreview(){let e=this._preview;return e==null?"":"error"in e?l`<div class="preview error">
        <div class="body">
          <span class="label">Result</span><span class="value">${e.error}</span>
        </div>
      </div>`:l`<div class="preview">
      <div class="body">
        <span class="label">Result</span><span class="value">${e.value}</span>
      </div>
      <span class="bool ${e.truthy?"true":"false"}"
        >${e.truthy?"true \u2014 matches":"false \u2014 no match"}</span
      >
    </div>`}render(){return l`
      <textarea
        spellcheck="false"
        .value=${this._template()}
        placeholder="{{ is_state('binary_sensor.guests','on') }}"
        @input=${this._onInput}
      ></textarea>
      ${this._renderPreview()}
    `}};me.styles=y`
    :host {
      display: block;
    }
    textarea {
      width: 100%;
      box-sizing: border-box;
      min-height: 4.5rem;
      padding: 0.5rem;
      font-family: var(--code-font-family, monospace);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
      resize: vertical;
    }
    .preview {
      margin-top: 0.5rem;
      border-radius: 4px;
      overflow: hidden;
      background: var(--secondary-background-color, #f5f5f5);
      font-family: var(--code-font-family, monospace);
      font-size: 0.9em;
    }
    .preview .body {
      padding: 0.5rem;
    }
    .preview .label {
      display: block;
      font-family: var(--primary-font-family, inherit);
      font-size: 0.8em;
      color: var(--secondary-text-color, #888);
      margin-bottom: 0.25rem;
    }
    /* pre-wrap only on the value text, so multi-line results are preserved
       without the surrounding markup whitespace leaking into the layout. */
    .preview .value {
      white-space: pre-wrap;
      word-break: break-word;
    }
    .preview.error .value {
      color: var(--error-color, #d32f2f);
    }
    /* Full-width status bar flush to the box edges at the bottom. */
    .preview .bool {
      display: block;
      text-align: center;
      padding: 0.3rem;
      font-family: var(--primary-font-family, inherit);
      font-size: 0.85em;
      color: var(--text-primary-color, #fff);
    }
    .preview .bool.true {
      background: var(--success-color, var(--label-badge-green, #43a047));
    }
    .preview .bool.false {
      background: var(--secondary-text-color, #888);
    }
  `,u([m({attribute:!1})],me.prototype,"value",2),u([m({attribute:!1})],me.prototype,"hass",2),u([g()],me.prototype,"_preview",2),me=u([$("ambience-template-predicate-input")],me);var V=class extends _{constructor(){super(...arguments);this.value=null}_emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_onText(e){let r=e.target.value;this._emit(r.trim()===""?null:r)}render(){return this.matcher.input==="time_of_day"?l`
        <ambience-time-of-day-input
          .value=${this.value}
          .periods=${this.periods}
          .hass=${this.hass}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-time-of-day-input>
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
      `:this.matcher.input==="sun_predicate"?l`
        <ambience-sun-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-sun-predicate-input>
      `:this.matcher.input==="template_predicate"?l`
        <ambience-template-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-template-predicate-input>
      `:this.matcher.input==="state_predicate"?l`
        <ambience-state-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-state-predicate-input>
      `:this.matcher.input==="people_predicate"?l`
        <ambience-people-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-people-predicate-input>
      `:l`
      <input
        type="text"
        placeholder=${d(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `}};V.styles=y`
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
  `,u([m({attribute:!1})],V.prototype,"matcher",2),u([m({attribute:!1})],V.prototype,"value",2),u([m({attribute:!1})],V.prototype,"periods",2),u([m({attribute:!1})],V.prototype,"dayConfig",2),u([m({attribute:!1})],V.prototype,"weatherConfig",2),u([m({attribute:!1})],V.prototype,"hass",2),V=u([$("ambience-matcher-input")],V);function el(t){return t!=null&&typeof t=="object"&&Array.isArray(t.who)&&t.who.length===0}function tl(t){return t==="people"?{quant:"everyone",where:"home"}:null}function An(t,n){return!!t&&!!n&&Q(t)===Q(n)}var E=class extends _{constructor(){super(...arguments);this.open=!1;this.rule=null;this.matchers=[];this.availableActions=[];this.groups=[];this.schemas={};this.scopes=[];this.autoEditScope=!1;this._draft=null;this._open=null;this._showError=!1;this._serviceHasTarget=new Map;this._matcherError=new Map;this._onNameInput=e=>{this._setName(e.target.value)};this._onDestinationChange=e=>{this._setDestination(Number(e.target.value))};this._onDestinationChangeHaForm=e=>{e.stopPropagation(),this._setDestination(Number(e.detail.value.destination))};this._onAddMatcher=e=>{let r=e.target,i=r.value;r.value="",this._addMatcher(i)};this._onAddMatcherHaForm=e=>{e.stopPropagation();let r=e.detail.value.add;r!==E._ADD_MATCHER_PLACEHOLDER&&this._addMatcher(r)};this._onAddAction=e=>{let r=e.target,i=r.value;r.value="",this._addActionSlot(i)};this._onAddActionHaForm=e=>{e.stopPropagation();let r=e.detail.value.add;r!==E._ADD_ACTION_PLACEHOLDER&&this._addActionSlot(r)}}_onMatcherInvalid(e,r){r?this._matcherError.set(e,r):this._matcherError.delete(e)}connectedCallback(){super.connectedCallback(),ce(this,this.hass)}willUpdate(e){e.has("open")&&this.open&&(this._draft=this.rule?JSON.parse(JSON.stringify(this.rule)):null,this._scope=this.scope,this._open=this.autoEditScope&&this.scopes.length>0?{kind:"destination"}:null,this._showError=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_setDestination(e){let r=this.scopes[e];if(!r||!this._draft||(this._scope=r.scope,!this.hass))return;let i=new Set($t(this.hass,this._scope,[]));this._draft={...this._draft,actions:this._draft.actions.map(s=>({...s,entity_ids:s.entity_ids.filter(a=>i.has(a))}))}}_renderDestination(){if(this.scopes.length===0)return"";let e=Math.max(0,this.scopes.findIndex(r=>An(r.scope,this._scope)));return customElements.get("ha-form")?this._renderDestinationHaForm(e):l`
      <div class="destination">
        <label>${d(this.hass,"ui.destination","Destination")}</label>
        <select
          .value=${String(e)}
          @change=${this._onDestinationChange}
        >
          ${this.scopes.map((r,i)=>l`<option value=${i} ?selected=${i===e}>${r.label}</option>`)}
        </select>
      </div>
    `}_renderDestinationHaForm(e){let r=[{name:"destination",required:!0,selector:{select:{mode:"dropdown",options:this.scopes.map((i,s)=>({value:String(s),label:i.label}))}}}];return l`
      <div class="destination">
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{destination:String(e)}}
          .computeLabel=${()=>d(this.hass,"ui.destination","Destination")}
          @value-changed=${this._onDestinationChangeHaForm}
        ></ha-form>
      </div>
    `}_renderDestinationSlot(){if(this.scopes.length===0)return"";if(this._isOpen({kind:"destination"}))return l`
        <div class="slot destination-slot expanded" data-slot-id="destination">
          ${this._renderDestination()}
        </div>
      `;let e=this.scopes.find(r=>An(r.scope,this._scope))??this.scopes[0];return l`
      <div class="slot collapsed" data-slot-id="destination">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"destination"})}>
          <span class="summary-label"><strong>${d(this.hass,"ui.destination","Destination")}:</strong> ${e?.label??""}</span>
        </div>
      </div>
    `}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"}))return l`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
        </div>
      `;let i=Rt(this._draft,d(this.hass,"ui.new_rule","New rule"));return l`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${i}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let r=Xr();return r==="ha-input"?l`<ha-input label=${d(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:r==="ha-textfield"?l`<ha-textfield label=${d(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:l`<input type="text" .value=${e} @input=${this._onNameInput} />`}_setGroup(e){!this._draft||!e||e===this._draft.group||(this._draft={...Qe(this._draft),group:e})}_renderGroupSlot(){if(this.groups.length===0)return"";let e=[...this.groups].sort((s,a)=>s.name.localeCompare(a.name)),r=this._draft.group||e[0].id,i=this.groups.find(s=>s.id===r)??e[0];return this._isOpen({kind:"group"})?l`
        <div class="slot group-slot expanded" data-slot-id="group">
          <div class="group-menu" role="listbox">
            ${e.map(s=>l`<button
                class="group-option"
                role="option"
                aria-selected=${s.id===r}
                @click=${()=>{this._setGroup(s.id),this._open=null}}
              >
                ${He(s.color,s.icon)}
                <span class="group-name">${s.name}</span>
              </button>`)}
          </div>
        </div>
      `:l`
      <div class="slot collapsed" data-slot-id="group">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"group"})}>
          <strong>${d(this.hass,"ui.group","Group")}:</strong>
          ${He(i.color,i.icon)}
          <span class="group-name">${i.name}</span>
        </div>
      </div>
    `}_isOpen(e){let r=this._open;return r===null||r.kind!==e.kind?!1:e.kind==="matcher"&&r.kind==="matcher"?e.id===r.id:e.kind==="action"&&r.kind==="action"?e.idx===r.idx:!0}_validationError(e){if(e===null||e.kind==="name"||e.kind==="group"||e.kind==="destination")return null;if(e.kind==="matcher"){let s=this._draft?.when[e.id];return el(s)?d(this.hass,"ui.people_select_one","Select at least one person"):this._matcherError.has(e.id)?d(this.hass,"ui.condition_error","Fix the error in this condition before continuing"):null}let r=this._draft?.actions[e.idx];if(!r)return null;let i=this._serviceHasTarget.get(r.service);return r.entity_ids.length===0&&i===!0?d(this.hass,"ui.at_least_one_target","At least one target is required."):null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){if(this._validationError(e)!==null){this._showError=!0;return}this._open=null,this._showError=!1;return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let r of e.composedPath())if(r instanceof Element&&(r.classList.contains("slot")||r.classList.contains("actions-bar")||r.classList.contains("add-matcher")||r.classList.contains("add-action")))return;this._tryCloseCurrent()}_setPredicate(e,r){if(!this._draft)return;let i={...this._draft.when};r==null?delete i[e]:i[e]=r,this._draft={...this._draft,when:i}}_renderMatcherRow(e){let r=this._draft.when[e.name]??null,i=this._isOpen({kind:"matcher",id:e.name}),s=Xe(e.name,r,{hass:this.hass,periods:this.periods});return l`
      <div class="slot ${i?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"matcher",id:e.name})}>
          <span class="summary-label"><strong>${Y(this.hass,e.name)}:</strong> ${s}</span>
          <button
            class="remove"
            @click=${a=>{a.stopPropagation(),this._removeMatcher(e.name)}}
            title=${d(this.hass,"ui.remove_condition","Remove condition")}
          >✕</button>
        </div>
        ${i?l`
          <div class="body">
            <ambience-matcher-input
              .hass=${this.hass}
              .matcher=${e}
              .value=${r}
              .periods=${this.periods}
              .dayConfig=${this.dayConfig}
              .weatherConfig=${this.weatherConfig}
              @value-changed=${a=>this._setPredicate(e.name,a.detail.value)}
              @render-invalid-changed=${a=>this._onMatcherInvalid(e.name,a.detail.error)}
            ></ambience-matcher-input>

            ${this._showError&&this._validationError({kind:"matcher",id:e.name})?l`
              <div class="error">${this._validationError({kind:"matcher",id:e.name})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_visibleMatchers(){if(!this._draft)return[];let e=this._draft.when;return this.matchers.filter(r=>r.name in e&&e[r.name]!=null||this._open?.kind==="matcher"&&this._open.id===r.name)}_unusedMatchers(){let e=new Set(this._visibleMatchers().map(r=>r.name));return this.matchers.filter(r=>!e.has(r.name)).sort((r,i)=>Y(this.hass,r.name).localeCompare(Y(this.hass,i.name)))}_addMatcher(e){if(!e||this._open!==null&&!this._tryCloseCurrent())return;let r=tl(e);r!=null&&this._draft&&!(e in this._draft.when)&&(this._draft={...this._draft,when:{...this._draft.when,[e]:r}}),this._open={kind:"matcher",id:e},this._showError=!1}_removeMatcher(e){if(!this._draft)return;let r={...this._draft.when};delete r[e],this._draft={...this._draft,when:r},this._matcherError.delete(e),this._open?.kind==="matcher"&&this._open.id===e&&(this._open=null,this._showError=!1)}_renderAddMatcher(){let e=this._unusedMatchers();return e.length===0?"":customElements.get("ha-form")?this._renderAddMatcherHaForm(e):l`
      <div class="add-matcher">
        <select class="add-matcher" @change=${this._onAddMatcher}>
          <option value="">${d(this.hass,"ui.add_condition","+ Add condition\u2026")}</option>
          ${e.map(r=>l`<option value=${r.name}>${Y(this.hass,r.name)}</option>`)}
        </select>
      </div>
    `}_renderAddMatcherHaForm(e){let r=d(this.hass,"ui.add_condition","+ Add condition\u2026"),i=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:E._ADD_MATCHER_PLACEHOLDER,label:r},...e.map(s=>({value:s.name,label:Y(this.hass,s.name)}))]}}}];return l`
      <div class="add-matcher">
        <ha-form
          .hass=${this.hass}
          .schema=${i}
          .data=${{add:E._ADD_MATCHER_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddMatcherHaForm}
        ></ha-form>
      </div>
    `}_addActionSlot(e){if(!this._draft||!e||this._open!==null&&!this._tryCloseCurrent())return;let r={service:e,entity_ids:[],params:{}},i=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,r]},this._open={kind:"action",idx:i},this._showError=!1}_actionOptionLabel(e){return e.label&&e.label.trim()?e.label:e.id}_renderAddAction(){return this.availableActions.length===0?l`
        <p class="add-action-empty">
          ${d(this.hass,"ui.no_exposed_actions","Add services in Settings \u2192 Actions.")}
        </p>
      `:customElements.get("ha-form")?this._renderAddActionHaForm():l`
      <div class="add-action">
        <select class="add-action" @change=${this._onAddAction}>
          <option value="">${d(this.hass,"ui.add_action","+ Add action\u2026")}</option>
          ${this.availableActions.map(e=>l`
            <option value=${e.id}>${this._actionOptionLabel(e)}</option>
          `)}
        </select>
      </div>
    `}_renderAddActionHaForm(){let e=d(this.hass,"ui.add_action","+ Add action\u2026"),r=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:E._ADD_ACTION_PLACEHOLDER,label:e},...this.availableActions.map(i=>({value:i.id,label:this._actionOptionLabel(i)}))]}}}];return l`
      <div class="add-action">
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{add:E._ADD_ACTION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddActionHaForm}
        ></ha-form>
      </div>
    `}_updateActionAt(e,r){if(!this._draft)return;let i=this._draft.actions.map((s,a)=>a===e?r(s):s);this._draft={...this._draft,actions:i}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((r,i)=>i!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,r){this._updateActionAt(e,i=>({...i,entity_ids:r}))}_setActionParams(e,r){this._updateActionAt(e,i=>({...i,params:r}))}_onTargetModeChanged(e,r){this._serviceHasTarget.get(e)!==r&&(this._serviceHasTarget=new Map(this._serviceHasTarget).set(e,r))}_setReapplyOverride(e,r){let i=Ai(r);this._updateActionAt(e,s=>{if(i===null){let{reapply_seconds:a,...o}=s;return o}return{...s,reapply_seconds:i}})}_renderReapplyOverride(e,r,i){if(i<=0)return l``;let s="reapply_seconds"in e?String(e.reapply_seconds):"";return l`
      <div class="reapply-override">
        <label for="reapply-override-${r}">
          ${d(this.hass,"ui.reapply_seconds_label","Re-apply every (seconds)")}
        </label>
        <input
          id="reapply-override-${r}"
          type="number"
          min="0"
          data-reapply-override
          placeholder=${String(i)}
          .value=${s}
          @input=${a=>{a.stopPropagation(),this._setReapplyOverride(r,a.target.value)}}
        />
        <span class="reapply-unit">${d(this.hass,"ui.reapply_seconds_unit","s")}</span>
      </div>
    `}_renderActionRow(e,r){let i=this.availableActions.find(p=>p.id===e.service),s=i?.reapply_seconds??0,a=this._isOpen({kind:"action",idx:r}),o=Ci(e,{hass:this.hass,exposedActions:this.availableActions,schemas:this.schemas}),c=Pi(e,s),h=s>0&&c>0;return l`
      <div class="slot ${a?"expanded":"collapsed"}" data-slot-id="action-${r}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:r})}>
          <span class="summary-label">${o}</span>
          ${h?l`<span class="reapply-badge" data-reapply-badge>↺ ${c}s</span>`:""}
          <button class="remove" @click=${p=>{p.stopPropagation(),this._deleteAction(r)}} title=${d(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${a?l`
          <div class="body">
            <ambience-action-slot
              .hass=${this.hass}
              .scope=${this._scope}
              .exposed=${i}
              .entityIds=${e.entity_ids}
              .params=${e.params}
              @entity-ids-changed=${p=>{p.stopPropagation(),this._setActionTargets(r,p.detail.entityIds)}}
              @params-changed=${p=>{p.stopPropagation(),this._setActionParams(r,p.detail.params)}}
              @target-mode-changed=${p=>{p.stopPropagation(),this._onTargetModeChanged(e.service,p.detail.hasTarget)}}
            ></ambience-action-slot>

            ${this._renderReapplyOverride(e,r,s)}

            ${this._showError&&this._validationError({kind:"action",idx:r})?l`
              <div class="error">${this._validationError({kind:"action",idx:r})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_save(){if(!this._draft)return;for(let r of Object.keys(this._draft.when))if(this._draft.when[r]!=null&&this._validationError({kind:"matcher",id:r})!==null){this._showError=!0,this._open={kind:"matcher",id:r};return}for(let r=0;r<this._draft.actions.length;r++)if(this._validationError({kind:"action",idx:r})!==null){this._showError=!0,this._open={kind:"action",idx:r};return}let e=Object.fromEntries(Object.entries(this._draft.when).filter(([,r])=>r!=null));this.dispatchEvent(new CustomEvent("save-rule",{detail:{rule:{...this._draft,when:e},scope:this._scope},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-rule",{bubbles:!0,composed:!0}))}render(){if(!this._draft)return l``;let e=this._visibleMatchers();return l`
      <div class="modal" @click=${this._onModalClick}>
        <div class="content">
          ${this._renderNameSlot()}
          ${this._renderGroupSlot()}
          ${this._renderDestinationSlot()}

          <h3>${d(this.hass,"ui.when_heading","When")}</h3>
          ${e.map(r=>this._renderMatcherRow(r))}
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
    `}};E.styles=[bt,y`
    :host {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 100;
      align-items: stretch; justify-content: center;
      --group-swatch-size: 1.75rem;
      --group-swatch-icon-size: 18px;
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
    /* min-width:0 lets the flex item shrink below its content's intrinsic
       width; overflow-wrap breaks long unbreakable tokens (e.g. a template
       string) so the summary wraps instead of overflowing the panel. */
    .summary-label { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    .slot.expanded .summary {
      background: var(--secondary-background-color, #f5f5f5);
    }
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
    .reapply-override {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px dotted var(--divider-color, #eee);
      font-size: 0.9rem;
      flex-wrap: wrap;
    }
    .reapply-override label {
      flex: 0 0 auto;
      color: var(--secondary-text-color, #888);
    }
    .reapply-override input[data-reapply-override] {
      width: 5rem;
      box-sizing: border-box;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      background: transparent;
      color: var(--primary-text-color, inherit);
      font: inherit;
    }
    .reapply-override .reapply-unit {
      color: var(--secondary-text-color, #888);
      flex: 0 0 auto;
    }
    .reapply-badge {
      font-size: 0.75rem;
      background: var(--secondary-background-color, #f5f5f5);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 3px;
      color: var(--secondary-text-color, #888);
      padding: 0.1rem 0.35rem;
      white-space: nowrap;
      flex: 0 0 auto;
    }
    .error {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      margin-top: 0.5rem;
      padding: 0.3rem 0;
    }
    .destination {
      margin-bottom: 0.75rem;
    }
    .destination label {
      display: block;
      color: var(--secondary-text-color, #888);
      font-size: 0.9em;
    }
    /* Group field: colour-coded swatch + icon (shell from groupSwatchStyles),
       matching the rules-list filter. */
    .group-name { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    .group-menu { display: flex; flex-direction: column; gap: 0.15rem; padding: 0.35rem; }
    .group-option {
      display: flex; align-items: center; gap: 0.6rem; width: 100%;
      min-height: 40px; box-sizing: border-box;
      padding: 0.3rem 0.5rem; border: 0; border-radius: 6px;
      background: none; color: var(--primary-text-color, inherit);
      cursor: pointer; font: inherit; font-size: 1rem; text-align: left;
    }
    .group-option:hover { background: var(--secondary-background-color, #f5f5f5); }
    .group-option[aria-selected="true"] {
      background: var(--secondary-background-color, #eee); font-weight: 600;
    }
  `],E._ADD_MATCHER_PLACEHOLDER="__add_matcher__",E._ADD_ACTION_PLACEHOLDER="__add_action__",u([m({type:Boolean,reflect:!0})],E.prototype,"open",2),u([m({attribute:!1})],E.prototype,"rule",2),u([m({attribute:!1})],E.prototype,"matchers",2),u([m({attribute:!1})],E.prototype,"periods",2),u([m({attribute:!1})],E.prototype,"dayConfig",2),u([m({attribute:!1})],E.prototype,"weatherConfig",2),u([m({attribute:!1})],E.prototype,"availableActions",2),u([m({attribute:!1})],E.prototype,"groups",2),u([m({attribute:!1})],E.prototype,"schemas",2),u([m({attribute:!1})],E.prototype,"hass",2),u([m({attribute:!1})],E.prototype,"scope",2),u([m({attribute:!1})],E.prototype,"scopes",2),u([m({type:Boolean})],E.prototype,"autoEditScope",2),u([g()],E.prototype,"_draft",2),u([g()],E.prototype,"_scope",2),u([g()],E.prototype,"_open",2),u([g()],E.prototype,"_showError",2),u([g()],E.prototype,"_serviceHasTarget",2),E=u([$("ambience-rule-editor")],E);var rl={sunrise:"Sunrise",sunset:"Sunset",noon:"Noon",midnight:"Midnight",dawn:"Dawn",dusk:"Dusk"},z=class extends _{constructor(){super(...arguments);this.rules=[];this._open=!1;this._triggers=[];this._opaque=!1;this._loading=!1;this._error=""}willUpdate(e){super.willUpdate?.(e),this._open&&(e.has("_open")||e.has("rules")||e.has("scope"))&&this._load()}get _scopeId(){return this.scope.kind==="house"?null:this.scope.id}async _load(){this._loading=!0,this._error="";try{let e=await $i(this.hass,this.scope.kind,this._scopeId);this._triggers=e.triggers,this._opaque=e.opaque}catch(e){this._error=e.message||String(e)}finally{this._loading=!1}}_toggleOpen(){this._open=!this._open}async _onToggle(e,r){this._triggers=this._triggers.map(i=>i.key===e.key?{...i,enabled:r}:i);try{await wi(this.hass,this.scope.kind,this._scopeId,e.key,r)}catch(i){this._triggers=this._triggers.map(s=>s.key===e.key?{...s,enabled:!r}:s),this._error=i.message||String(i)}}_entityName(e){let r=this.hass?.states?.[e]?.attributes?.friendly_name;return typeof r=="string"&&r?r:e}_sortLabel(e){return e.kind==="entity"?this._entityName(e.entity_id).toLowerCase():e.kind}get _sortedTriggers(){let e=this._triggers.filter(i=>i.kind==="entity").slice().sort((i,s)=>this._sortLabel(i).localeCompare(this._sortLabel(s))),r=this._triggers.filter(i=>i.kind!=="entity");return[...e,...r]}_sunPart(e){let r=d(this.hass,`anchor.${e.anchor}`,rl[e.anchor]??e.anchor);return e.offset===0?r:`${r} ${e.offset>0?"+":""}${e.offset} min`}_label(e){switch(e.kind){case"entity":return l`<span class="label"
          >${this._entityName(e.entity_id)}<span class="eid">${e.entity_id}</span></span
        >`;case"time":{let r=e.clocks.map(i=>`${String(i.hour).padStart(2,"0")}:${String(i.minute).padStart(2,"0")}`);return e.date_rollover&&r.push(d(this.hass,"ui.auto_trigger_date_rollover","Local midnight (date rollover)")),e.has_time&&r.push(d(this.hass,"ui.auto_trigger_periodic","periodic re-check")),l`<span class="label"
          ><strong>${d(this.hass,"ui.auto_trigger_group_time","Time")}:</strong>
          ${r.join(", ")}</span
        >`}case"sun":{let r=e.suns.map(i=>this._sunPart(i));return l`<span class="label"
          ><strong>${d(this.hass,"ui.auto_trigger_group_sun","Sun")}:</strong>
          ${r.join(", ")}</span
        >`}case"reapply":return l`<span class="label"
          ><strong>${d(this.hass,"ui.auto_trigger_reapply","Re-apply")}:</strong>
          ${d(this.hass,"ui.auto_trigger_every","every")}
          ${Ri(e.interval_seconds)}</span
        >`}}render(){return l`
      <div class="header" data-test="auto-triggers-header" @click=${this._toggleOpen}>
        <span class="chevron ${this._open?"open":""}">▶</span>
        <span>${d(this.hass,"ui.auto_triggers_section","Auto-triggers")}</span>
      </div>
      ${this._open?this._renderBody():""}
    `}_renderBody(){return this._error?l`<div class="error">${this._error}</div>`:this._loading&&this._triggers.length===0?l`<div class="empty">${d(this.hass,"ui.loading","Loading\u2026")}</div>`:l`
      ${this._opaque?l`<div class="note">
            ${d(this.hass,"ui.auto_triggers_opaque_note","A script rule is opaque \u2014 some watches may be missing. Declare them in the rule's Triggers field.")}
          </div>`:""}
      ${this._triggers.length===0?l`<div class="empty">
            ${d(this.hass,"ui.auto_triggers_none","No automatic triggers.")}
          </div>`:l`<ul>
            ${this._sortedTriggers.map(e=>e.kind==="reapply"?l`<li class="readonly" data-test=${`trigger-ro-${e.key}`}>
                    ↺ ${this._label(e)}
                  </li>`:l`<li>
                    <input
                      type="checkbox"
                      data-test=${`trigger-cb-${e.key}`}
                      .checked=${e.enabled}
                      @change=${r=>this._onToggle(e,r.target.checked)}
                    />
                    ${this._label(e)}
                  </li>`)}
          </ul>`}
    `}};z.styles=y`
    :host {
      display: block;
      margin-top: 0.75rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 0 0.3rem 0;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9em;
      color: var(--secondary-text-color, #888);
    }
    .chevron {
      width: 1em;
      transition: transform 0.1s;
    }
    .chevron.open {
      transform: rotate(90deg);
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0 0 0.25rem 1.3rem;
    }
    li {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      padding: 0.2rem 0;
    }
    li.readonly {
      color: var(--secondary-text-color, #888);
      font-style: italic;
    }
    .label {
      flex: 1;
    }
    .eid {
      color: var(--secondary-text-color, #888);
      font-size: 0.8em;
      margin-left: 0.4rem;
    }
    .empty,
    .note,
    .error {
      color: var(--secondary-text-color, #888);
      font-size: 0.85em;
      padding: 0.25rem 0 0.25rem 1.3rem;
    }
    .error {
      color: var(--error-color, #d32f2f);
    }
    .note {
      font-style: italic;
    }
  `,u([m({attribute:!1})],z.prototype,"hass",2),u([m({attribute:!1})],z.prototype,"scope",2),u([m({attribute:!1})],z.prototype,"rules",2),u([g()],z.prototype,"_open",2),u([g()],z.prototype,"_triggers",2),u([g()],z.prototype,"_opaque",2),u([g()],z.prototype,"_loading",2),u([g()],z.prototype,"_error",2),z=u([$("ambience-auto-triggers-section")],z);var Pn=y`
  .eval { border: 1px solid var(--divider-color, #444); border-radius: 8px; padding: 0.7rem 0.9rem; }
  .eval .top { display: flex; align-items: baseline; gap: 0.5rem; }
  .eval .cause { flex: 1; font-family: monospace; font-size: 0.85rem; }
  .eval .ts { color: var(--secondary-text-color, #888); font-size: 0.75rem; }
  .outcome { font-size: 0.72rem; text-transform: uppercase; padding: 1px 7px; border-radius: 4px;
    background: var(--secondary-background-color, #333); color: var(--secondary-text-color, #aaa); }
  .outcome.acted { background: var(--success-color, #4caf50); color: #fff; }
  .outcome.reapplied { background: var(--info-color, #2196f3); color: #fff; }
  .won { margin-top: 0.4rem; }
  .won .name { color: var(--success-color, #4caf50); font-weight: 600; }
  .action-summary { margin-top: 0.2rem; font-family: monospace; font-size: 0.82rem;
    color: var(--secondary-text-color, #bbb); }
  .action-summary .n { color: var(--secondary-text-color, #888); }
  .why-toggle { background: none; border: none; color: var(--primary-color, #03a9f4); cursor: pointer;
    padding: 0.3rem 0; font-size: 0.82rem; }
  .why { margin-top: 0.6rem; padding: 0.2rem 0 0.2rem 0.9rem;
    border-left: 2px solid var(--divider-color, #444); }
  .section + .section { margin-top: 1.25rem; }
  .section-title { font-size: 0.95rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--primary-text-color, #fff); margin-bottom: 0.5rem; }
  .rules { font-family: monospace; font-size: 0.8rem; line-height: 1.7; }
  .rule.won { color: var(--success-color, #4caf50); }
  .rule.skipped { opacity: 0.5; }
  .pred.pass { color: var(--success-color, #4caf50); }
  .pred.fail { color: var(--error-color, #e57373); }
  .pred .dim { color: var(--secondary-text-color, #888); }
  .action-block { font-family: monospace; font-size: 0.8rem; line-height: 1.6; margin-bottom: 0.3rem; }
  .action-head { color: var(--primary-text-color, #ddd); }
  .action-block .entity { padding-left: 1rem; color: var(--secondary-text-color, #aaa); }
`;function il(t){return t.kind==="entity"?`${t.entity_id} ${t.old} \u2192 ${t.new}`:t.detail?`${Ae(t.kind)} ${t.detail}`:Ae(t.kind)}function nl(t){let n=t.params&&Object.keys(t.params).length?` ${JSON.stringify(t.params)}`:"";return`${t.service}${n}`}function sl(t){return t.reduce((n,e)=>n+(e.entity_ids?.length??0),0)}function al(t){return t.evaluated?l`
    <div class="rule ${t.matched?"won":""}">rule #${t.index} ${t.name??"\u2014"}: ${t.matched?"WON":"no"}</div>
    ${t.predicates.map(n=>l`
        <div class="pred ${n.passed?"pass":"fail"}" style="padding-left:1rem">
          ${n.passed?"\u2713":"\u2717"} ${n.matcher_key}${n.detail?l` <span class="dim">[${n.detail}]</span>`:T}
        </div>`)}
  `:l`<div class="rule skipped">rule #${t.index} ${t.name??"\u2014"}: not evaluated</div>`}function Rn(t,n,e){let r=t.actions.map(a=>a.service).join(", "),i=sl(t.actions),s=t.explanation!==null||t.actions.length>0;return l`
    <div class="eval">
      <div class="top">
        <span class="outcome ${t.outcome}">${t.outcome.replace(/_/g," ")}</span>
        <span class="cause">${il(t.cause)}</span>
        <span class="ts">${t.timestamp?new Date(t.timestamp).toLocaleTimeString():""}</span>
      </div>
      ${t.winner_name?l`<div class="won">Won: <span class="name">${t.winner_name}</span></div>`:T}
      ${t.actions.length?l`<div class="action-summary">→ ${r}
            ${i?l`<span class="n">· ${i} ${i===1?"entity":"entities"}</span>`:T}</div>`:T}
      ${s?l`<button class="why-toggle" @click=${e}>
            ${n?"\u25BE Hide details":t.explanation?t.winner_name?`\u25B8 Why this rule won (${t.explanation.rules.length} rules)`:`\u25B8 Why nothing matched (${t.explanation.rules.length} rules)`:"\u25B8 Details"}
          </button>`:T}
      ${n?ol(t):T}
    </div>
  `}function ol(t){return l`
    <div class="why">
      ${t.explanation?l`<div class="section">
            <div class="section-title">Rule evaluation</div>
            <div class="rules">${t.explanation.rules.map(n=>al(n))}</div>
          </div>`:T}
      ${t.actions.length?l`<div class="section">
            <div class="section-title">Actions taken</div>
            ${t.actions.map(n=>l`<div class="action-block">
                <div class="action-head">${nl(n)}</div>
                ${(n.entity_ids??[]).map(e=>l`<div class="entity">${e}</div>`)}
              </div>`)}
          </div>`:T}
    </div>
  `}var M=class extends _{constructor(){super(...arguments);this.group="";this.groupName=null;this.open=!1;this._records=[];this._expanded=new Set;this._loading=!0;this._error="";this._hasNew=!1}connectedCallback(){super.connectedCallback(),this._poll=setInterval(()=>this._checkNew(),5e3)}disconnectedCallback(){super.disconnectedCallback(),this._poll&&clearInterval(this._poll)}updated(e){this.open&&(e.has("open")||e.has("group")||e.has("scope"))&&this._load()}_mine(e){return e.filter(r=>r.scope_kind===this.scope.scope_kind&&r.scope_id===this.scope.scope_id&&r.group===this.group)}async _load(){this._error="",this._loading=!0,this._hasNew=!1,this._expanded=new Set;try{let e=await ar(this.hass);if(!this.isConnected)return;this._records=this._mine(e),this._loading=!1}catch(e){this._error=e.message||String(e),this._loading=!1}}async _checkNew(){if(!(!this.open||!this.isConnected||document.visibilityState!=="visible"))try{let r=this._mine(await ar(this.hass))[0]?.timestamp??null,i=this._records[0]?.timestamp??null;r&&(!i||r>i)&&(this._hasNew=!0)}catch{}}_toggle(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):r.add(e),this._expanded=r}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){if(!this.open)return T;let e=this.groupName??this.group;return l`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>${e}</h3>
          <button class="refresh ${this._hasNew?"has-new":""}" @click=${()=>this._load()}>
            ${this._hasNew?"\u25CF New traces \u2014 refresh":"Refresh"}
          </button>
          <button class="close" @click=${this._onClose} aria-label="Close">✕</button>
        </div>
        <div class="body">
          ${this._error?l`<p class="error">${this._error}</p>`:this._loading?l`<p class="empty">Loading…</p>`:this._records.length===0?l`<p class="empty">No traces for this group yet.</p>`:l`<div class="list">${this._records.map((r,i)=>{let s=`${r.event_id??i}|${r.timestamp??""}`;return Rn(r,this._expanded.has(s),()=>this._toggle(s))})}</div>`}
        </div>
      </div>
    `}};M.styles=[Pn,y`
      :host {
        display: none;
        position: fixed; inset: 0;
        align-items: center; justify-content: center;
        background: rgba(0,0,0,0.45); z-index: 1000;
      }
      :host([open]) {
        display: flex;
      }
      .modal {
        background: var(--card-background-color, #fff);
        border-radius: 8px; padding: 1.5rem;
        max-width: 640px; width: 90%; max-height: 80vh;
        display: flex; flex-direction: column; gap: 1rem;
        overflow: hidden;
      }
      .header {
        display: flex; align-items: center; gap: 0.5rem;
      }
      .header h3 { margin: 0; flex: 1; }
      .refresh {
        padding: 0.25rem 0.75rem; cursor: pointer;
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 4px; background: none; color: inherit;
        font-size: 0.85rem;
      }
      .refresh.has-new {
        border-color: var(--primary-color, #03a9f4);
        color: var(--primary-color, #03a9f4);
        font-weight: 600;
      }
      .close {
        padding: 0.25rem 0.5rem; cursor: pointer;
        border: none; background: none; font-size: 1.2rem;
        color: var(--secondary-text-color, #888);
        line-height: 1;
      }
      .body { overflow-y: auto; flex: 1; }
      .list { display: flex; flex-direction: column; gap: 0.5rem; }
      .empty { color: var(--secondary-text-color, #888); font-size: 0.9rem; margin: 0; }
      .error { color: var(--error-color, #c00); font-size: 0.9rem; margin: 0; }
    `],u([m({attribute:!1})],M.prototype,"hass",2),u([m({attribute:!1})],M.prototype,"scope",2),u([m()],M.prototype,"group",2),u([m()],M.prototype,"groupName",2),u([m({type:Boolean,reflect:!0})],M.prototype,"open",2),u([g()],M.prototype,"_records",2),u([g()],M.prototype,"_expanded",2),u([g()],M.prototype,"_loading",2),u([g()],M.prototype,"_error",2),u([g()],M.prototype,"_hasNew",2),M=u([$("ambience-traces-modal")],M);function Wt(t){return{rules:t.rules??[]}}var Pr=1024;function ll(t,n,e){if(t!==void 0&&n!==void 0)return Math.floor((t+n)/2);let r=e.map(i=>i.priority??0);return t===void 0&&n===void 0?Pr:t===void 0?Math.max(...r)+Pr:Math.min(...r)-Pr}var L=class extends _{constructor(){super(...arguments);this._areas=[];this._floors=[];this._areaConfigs=new Map;this._floorConfigs=new Map;this._house={rules:[]};this._switchEntityIds=new Map;this._matchers=[];this._actions=[];this._groups=[];this._schemas={};this._expanded=new Set;this._error="";this._editing=null;this._viewingTraces=null;this._filterGroup="";this._filterOpen=!1;this._onExposedActionsChanged=async()=>{try{let e=await Je(this.hass);if(!this.isConnected)return;this._actions=e,await this._refreshSchemas(e)}catch{}}}async _refreshSchemas(e){let r=await Promise.all(e.map(async s=>{try{let a=await De(this.hass,s.id);return[s.id,a]}catch{return[s.id,null]}}));if(!this.isConnected)return;let i={};for(let[s,a]of r)a&&(i[s]=a);this._schemas=i}async connectedCallback(){super.connectedCallback(),window.addEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),await this._loadStatic(),await Promise.all([this._refreshAreas(),this._refreshFloors(),this._refreshHouse(),this._refreshSwitches()]),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),this._unsubArea?.(),this._unsubArea=void 0,this._unsubFloor?.(),this._unsubFloor=void 0}async _loadStatic(){try{let[e,r,i,s,a,o]=await Promise.all([Ct(this.hass),Je(this.hass),Tt(this.hass),Lt(this.hass),At(this.hass),Pt(this.hass)]);if(!this.isConnected)return;this._matchers=e,this._actions=r,this._periods=i,this._dayConfig=s,this._weatherConfig=a,this._groups=o,await this._refreshSchemas(r)}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await wt(this.hass),r=this._areaConfigs,i=new Map;if(await Promise.all(e.map(async s=>{let a=r.get(s.area_id);if(a){i.set(s.area_id,a);return}i.set(s.area_id,Wt(await xt(this.hass,s.area_id)))})),!this.isConnected)return;this._areas=e,this._areaConfigs=i}catch(e){this._error=e.message||String(e)}}async _refreshFloors(){try{let e=(await kt(this.hass)).slice().sort((s,a)=>s.name.localeCompare(a.name)),r=this._floorConfigs,i=new Map;if(await Promise.all(e.map(async s=>{let a=r.get(s.floor_id);if(a){i.set(s.floor_id,a);return}i.set(s.floor_id,Wt(await Et(this.hass,s.floor_id)))})),!this.isConnected)return;this._floors=e,this._floorConfigs=i}catch(e){this._error=e.message||String(e)}}async _refreshHouse(){try{let e=Wt(await St(this.hass));if(!this.isConnected)return;this._house=e}catch(e){this._error=e.message||String(e)}}async _refreshSwitches(){try{let e=await pi(this.hass);if(!this.isConnected)return;this._switchEntityIds=new Map(e.map(r=>{let i=r.scope_kind==="house"?{kind:"house"}:{kind:r.scope_kind,id:r.scope_id};return[Q(i),r.entity_id]}))}catch(e){this._error=e.message||String(e)}}async _subscribe(){let e=this.hass.connection.subscribeEvents(a=>{if(a.data.action==="remove"){let o=a.data.area_id,c=new Set(this._expanded);c.delete(`area:${o}`),this._expanded=c,this._editing?.scope.kind==="area"&&this._editing.scope.id===o&&(this._editing=null)}this._refreshAreas(),a.data.action!=="update"&&this._refreshSwitches()},"area_registry_updated"),r=this.hass.connection.subscribeEvents(a=>{if(a.data.action==="remove"){let o=a.data.floor_id,c=new Set(this._expanded);c.delete(`floor:${o}`),this._expanded=c,this._editing?.scope.kind==="floor"&&this._editing.scope.id===o&&(this._editing=null)}this._refreshFloors(),a.data.action!=="update"&&this._refreshSwitches()},"floor_registry_updated"),[i,s]=await Promise.all([e,r]);this.isConnected?(this._unsubArea=i,this._unsubFloor=s):(i(),s())}_getConfig(e){return e.kind==="house"?this._house:e.kind==="area"?this._areaConfigs.get(e.id):this._floorConfigs.get(e.id)}_setConfig(e,r){if(e.kind==="house")this._house=r;else if(e.kind==="area"){let i=new Map(this._areaConfigs);i.set(e.id,r),this._areaConfigs=i}else{let i=new Map(this._floorConfigs);i.set(e.id,r),this._floorConfigs=i}}async _mutate(e,r){let i=this._getConfig(e);this._setConfig(e,r),this._error="";try{let s;return e.kind==="house"?s=await ri(this.hass,r):e.kind==="area"?s=await ei(this.hass,e.id,r):s=await ti(this.hass,e.id,r),this._setConfig(e,Wt(s.config)),!0}catch(s){return i&&this._setConfig(e,i),this._error=s.message||String(s),!1}}_toggleExpand(e){let r=Q(e),i=new Set(this._expanded);i.has(r)?i.delete(r):i.add(r),this._expanded=i}_addRule(e){let r=this._getConfig(e);r&&(this._editing={scope:e,index:r.rules.length,isNew:!0})}_editRule(e,r){this._editing={scope:e,index:r.detail.index,isNew:!1}}_duplicateRule(e,r){let i=this._getConfig(e);if(!i)return;let s=i.rules[r.detail.index];if(!s)return;let a=Qe(JSON.parse(JSON.stringify(s)));this._editing={scope:e,index:i.rules.length,isNew:!0,seed:a}}_deleteRule(e,r){let i=this._getConfig(e);if(!i)return;let s=i.rules.filter((a,o)=>o!==r.detail.index);this._mutate(e,{...i,rules:s})}_reorderRules(e,r){let i=this._getConfig(e);if(!i)return;let{from:s,to:a}=r.detail,o=i.rules[s];if(!o||i.rules[a]?.group!==o.group)return;let c=[...i.rules];c.splice(s,1),c.splice(a,0,o);let h=x=>c[x]&&c[x].group===o.group,p=a-1;for(;p>=0&&!h(p);)p--;let f=a+1;for(;f<c.length&&!h(f);)f++;let v=p>=0?c[p].priority:void 0,b=f<c.length?c[f].priority:void 0,k=ll(v,b,i.rules.filter(x=>x.group===o.group));c[a]={...o,priority:k,pinned:!0},this._mutate(e,{...i,rules:c})}_unpinRule(e,r){let i=this._getConfig(e);if(!i)return;let s=i.rules.map((a,o)=>o===r.detail.index?{...a,pinned:!1}:a);this._mutate(e,{...i,rules:s})}_toggleRuleEnabled(e,r){let i=this._getConfig(e);if(!i)return;let s=i.rules.map((a,o)=>{if(o!==r.detail.index)return a;if(r.detail.enabled){let c={...a};return delete c.enabled,c}return{...a,enabled:!1}});this._mutate(e,{...i,rules:s})}async _saveRule(e){let r=this._editing;if(this._editing=null,!r)return;let{rule:i,scope:s}=e.detail;if(Q(s)===Q(r.scope)){let h=this._getConfig(s);if(!h)return;let p=[...h.rules];r.isNew?p.push(i):p[r.index]=i,await this._mutate(s,{...h,rules:p});return}let a=Qe(i),o=this._getConfig(s);if(!o)return;if(await this._mutate(s,{...o,rules:[...o.rules,a]})&&!r.isNew){let h=this._getConfig(r.scope);if(h){let p=h.rules.filter((f,v)=>v!==r.index);await this._mutate(r.scope,{...h,rules:p})}}}async _callApi(e){this._error="";try{await e()}catch(r){this._error=r.message||String(r)}}_applyRules(e,r){return this._callApi(()=>ai(this.hass,e,r))}_runRuleActions(e,r){return this._callApi(()=>oi(this.hass,e,r.detail.index))}_cancelRule(){this._editing=null}_showTraces(e,r){let i=this._groups.find(s=>s.id===r);this._viewingTraces={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},group:r,groupName:i?.name??null}}_selectFilter(e){this._filterGroup=e,this._filterOpen=!1}_renderFilterEntry(e){return e===null?l`
        ${He(void 0,"mdi:filter-variant")}
        <span class="group-name">${d(this.hass,"ui.all_groups","All groups")}</span>
      `:l`
      ${He(e.color,e.icon)}
      <span class="group-name">${e.name}</span>
    `}_renderFilter(){if(this._groups.length<=1)return"";let e=[...this._groups].sort((i,s)=>i.name.localeCompare(s.name)),r=this._groups.find(i=>i.id===this._filterGroup)??null;return l`
      <div class="group-filter-row">
        <span class="group-filter-label">${d(this.hass,"ui.filter_by_group","Filter by group")}</span>
        <div class="group-filter">
          <button
            class="group-filter-trigger"
            aria-haspopup="listbox"
            aria-expanded=${this._filterOpen}
            @click=${()=>{this._filterOpen=!this._filterOpen}}
          >
            ${this._renderFilterEntry(r)}
            <ha-icon class="caret" icon="mdi:menu-down"></ha-icon>
          </button>
          ${this._filterOpen?l`
                <div class="group-filter-backdrop" @click=${()=>{this._filterOpen=!1}}></div>
                <div class="group-filter-menu" role="listbox">
                  <button
                    class="group-filter-option"
                    role="option"
                    aria-selected=${this._filterGroup===""}
                    @click=${()=>this._selectFilter("")}
                  >
                    ${this._renderFilterEntry(null)}
                  </button>
                  ${e.map(i=>l`<button
                      class="group-filter-option"
                      role="option"
                      aria-selected=${this._filterGroup===i.id}
                      @click=${()=>this._selectFilter(i.id)}
                    >
                      ${this._renderFilterEntry(i)}
                    </button>`)}
                </div>
              `:""}
        </div>
      </div>
    `}_defaultGroupId(){return this._filterGroup!==""?this._filterGroup:[...this._groups].sort((r,i)=>r.name.localeCompare(i.name))[0]?.id??""}get _editingRule(){return this._editing?this._editing.seed?this._editing.seed:this._editing.isNew?{when:{},actions:[],group:this._defaultGroupId()}:this._getConfig(this._editing.scope)?.rules[this._editing.index]??null:null}get _editorMatchers(){return this._editing?this._matchers.slice().sort((e,r)=>r.priority-e.priority):[]}get _scopeOptions(){let e=d(this.hass,"ui.scope_floor_prefix","Floor: "),r=d(this.hass,"ui.scope_area_prefix","Area: ");return[{scope:{kind:"house"},label:d(this.hass,"ui.scope_global","Global")},...this._floors.map(i=>({scope:{kind:"floor",id:i.floor_id},label:`${e}${i.name}`})),...this._areas.map(i=>({scope:{kind:"area",id:i.area_id},label:`${r}${i.name}`}))]}_summary(e){if(e.rules.length===0)return d(this.hass,"ui.not_configured","not configured");let r=this._filterGroup===""?e.rules.length:e.rules.filter(s=>s.group===this._filterGroup).length,i=r===1?d(this.hass,"ui.rule_singular","rule"):d(this.hass,"ui.rule_plural","rules");return`${r} ${i}`}render(){let e=d(this.hass,"ui.scope_floor_prefix","Floor: "),r=d(this.hass,"ui.scope_area_prefix","Area: ");return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${this._renderFilter()}
      <ul>
        ${this._renderScopeRow({kind:"house"},d(this.hass,"ui.scope_global","Global"),this._house,"house")}
        ${this._floors.map(i=>{let s=this._floorConfigs.get(i.floor_id);return s?this._renderScopeRow({kind:"floor",id:i.floor_id},`${e}${i.name}`,s,"floor"):l``})}
        ${this._areas.length===0?l`<li>
              <p class="empty">
                ${d(this.hass,"ui.no_areas","No areas found in Home Assistant.")}
              </p>
            </li>`:this._areas.map(i=>{let s=this._areaConfigs.get(i.area_id);return s?this._renderScopeRow({kind:"area",id:i.area_id},`${r}${i.name}`,s,"area"):l``})}
      </ul>

      <ambience-rule-editor
        ?open=${this._editing!==null}
        .hass=${this.hass}
        .scope=${this._editing?this._editing.scope:void 0}
        .scopes=${this._scopeOptions}
        .autoEditScope=${!!this._editing?.seed}
        .rule=${this._editingRule}
        .matchers=${this._editorMatchers}
        .periods=${this._periods}
        .dayConfig=${this._dayConfig}
        .weatherConfig=${this._weatherConfig}
        .availableActions=${this._actions}
        .schemas=${this._schemas}
        .groups=${this._groups}
        @save-rule=${this._saveRule}
        @cancel-rule=${this._cancelRule}
      ></ambience-rule-editor>
      <ambience-traces-modal
        ?open=${this._viewingTraces!==null}
        .hass=${this.hass}
        .scope=${this._viewingTraces?.scope??{scope_kind:"house",scope_id:null}}
        .group=${this._viewingTraces?.group??""}
        .groupName=${this._viewingTraces?.groupName??null}
        @close=${()=>{this._viewingTraces=null}}
      ></ambience-traces-modal>
    `}_renderScopeRow(e,r,i,s){let a=this._expanded.has(Q(e)),o=e.kind==="house"?"":e.id;return l`
      <li
        class="scope-row ${s}"
        data-id=${o}
      >
        <div class="scope-header" @click=${()=>this._toggleExpand(e)}>
          <span class="chevron ${a?"open":""}">▶</span>
          <span class="scope-name">${r}</span>
          <span class="scope-summary">${this._summary(i)}</span>
          ${this._renderScopeSwitch(e)}
          <button
            class="apply-scope"
            data-test="apply-scope"
            title=${d(this.hass,"ui.apply_rules","Apply rules")}
            @click=${c=>{c.stopPropagation(),this._applyRules(e)}}
          >
            ${d(this.hass,"ui.apply_rules","Apply rules")}
          </button>
        </div>
        ${a?l`
              <div class="scope-body">
                <ambience-rules-list
                  .rules=${i.rules}
                  .periods=${this._periods}
                  .weatherConfig=${this._weatherConfig}
                  .matchers=${this._matchers}
                  .availableActions=${this._actions}
                  .schemas=${this._schemas}
                  .groups=${this._groups}
                  .filterGroup=${this._filterGroup}
                  .hass=${this.hass}
                  @add-rule=${()=>this._addRule(e)}
                  @edit-rule=${c=>this._editRule(e,c)}
                  @duplicate-rule=${c=>this._duplicateRule(e,c)}
                  @delete-rule=${c=>this._deleteRule(e,c)}
                  @reorder-rules=${c=>this._reorderRules(e,c)}
                  @unpin-rule=${c=>this._unpinRule(e,c)}
                  @toggle-rule-enabled=${c=>this._toggleRuleEnabled(e,c)}
                  @run-rule-actions=${c=>this._runRuleActions(e,c)}
                  @apply-group=${c=>this._applyRules(e,c.detail.groupId)}
                  @show-traces=${c=>this._showTraces(e,c.detail.group)}
                ></ambience-rules-list>
                <ambience-auto-triggers-section
                  .hass=${this.hass}
                  .scope=${e}
                  .rules=${i.rules}
                ></ambience-auto-triggers-section>
              </div>
            `:""}
      </li>
    `}_renderScopeSwitch(e){let r=this._switchEntityIds.get(Q(e));if(!r)return"";let i=this.hass.states?.[r]?.state==="on",s=o=>o.stopPropagation(),a=o=>{o.stopPropagation(),this.hass.callService?.("switch",i?"turn_off":"turn_on",{entity_id:r})};return customElements.get("ha-switch")?l`<ha-switch
        class="scope-switch"
        data-test="scope-switch"
        .checked=${i}
        @click=${s}
        @change=${a}
      ></ha-switch>`:l`<input
      class="scope-switch"
      data-test="scope-switch"
      type="checkbox"
      .checked=${i}
      @click=${s}
      @change=${a}
    />`}};L.styles=[bt,y`
    :host {
      display: block;
      padding: 1rem;
      /* Reading-column cap for the sidebar panel; the card overrides this var
         so it fills whatever width the user gives the card. */
      max-width: var(--ambience-content-max-width, 60rem);
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
    .scope-switch {
      flex: 0 0 auto;
      margin-left: 0.5rem;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }
    .apply-scope {
      background: transparent;
      border: 1px solid var(--divider-color, #c0c0c0);
      border-radius: 4px;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      padding: 0.2rem 0.5rem;
      font-size: 0.85em;
      white-space: nowrap;
      flex: 0 0 auto;
    }
    .scope-body {
      padding: 0.5rem 1rem 1rem 1rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .group-filter-row {
      display: flex; align-items: center; gap: 0.75rem;
      margin: 0 0 1.25rem 0;
    }
    .group-filter-label {
      font-size: 0.95rem; font-weight: 500;
      color: var(--secondary-text-color, #888);
    }
    .group-filter { position: relative; min-width: 18rem; }
    /* Trigger keeps a stable height regardless of the selection (the swatch is
       always present), so picking a group never resizes the control. */
    .group-filter-trigger {
      display: flex; align-items: center; gap: 0.65rem; width: 100%;
      min-height: 48px; box-sizing: border-box;
      padding: 0.4rem 0.6rem 0.4rem 0.5rem;
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 8px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      cursor: pointer; font: inherit; font-size: 1rem;
    }
    .group-filter-trigger:hover { background: var(--secondary-background-color, #f5f5f5); }
    .group-filter-trigger .group-name { flex: 1; text-align: left; }
    .group-filter-trigger .caret { color: var(--secondary-text-color, #888); flex: 0 0 auto; }
    /* Transparent full-screen catcher so any outside click closes the menu. */
    .group-filter-backdrop { position: fixed; inset: 0; z-index: 10; }
    .group-filter-menu {
      position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 11;
      max-height: 60vh; overflow-y: auto;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
      padding: 0.35rem;
    }
    .group-filter-option {
      display: flex; align-items: center; gap: 0.65rem; width: 100%;
      min-height: 44px; box-sizing: border-box;
      padding: 0.4rem 0.6rem; border: 0; border-radius: 6px;
      background: none; color: var(--primary-text-color, #212121);
      cursor: pointer; font: inherit; font-size: 1rem; text-align: left;
    }
    .group-filter-option:hover { background: var(--secondary-background-color, #f5f5f5); }
    .group-filter-option[aria-selected="true"] {
      background: var(--secondary-background-color, #eee); font-weight: 600;
    }
    /* Swatch shell + sizing come from groupSwatchStyles (2rem default); it is
       always present so rows and the trigger keep a consistent height. */
    .group-name { flex: 1; }
  `],u([m({attribute:!1})],L.prototype,"hass",2),u([g()],L.prototype,"_areas",2),u([g()],L.prototype,"_floors",2),u([g()],L.prototype,"_areaConfigs",2),u([g()],L.prototype,"_floorConfigs",2),u([g()],L.prototype,"_house",2),u([g()],L.prototype,"_switchEntityIds",2),u([g()],L.prototype,"_matchers",2),u([g()],L.prototype,"_actions",2),u([g()],L.prototype,"_groups",2),u([g()],L.prototype,"_schemas",2),u([g()],L.prototype,"_periods",2),u([g()],L.prototype,"_dayConfig",2),u([g()],L.prototype,"_weatherConfig",2),u([g()],L.prototype,"_expanded",2),u([g()],L.prototype,"_error",2),u([g()],L.prototype,"_editing",2),u([g()],L.prototype,"_viewingTraces",2),u([g()],L.prototype,"_filterGroup",2),u([g()],L.prototype,"_filterOpen",2),L=u([$("ambience-scopes-view")],L);var ee=class extends _{constructor(){super(...arguments);this._groups=[];this._error="";this._editing=null;this._modalError=""}async connectedCallback(){super.connectedCallback();try{this._groups=await Pt(this.hass)}catch(e){this._error=e.message||String(e)}}_sorted(){return[...this._groups].sort((e,r)=>e.name.localeCompare(r.name))}_validate(e){let r=e.name.trim();if(r==="")return d(this.hass,"ui.group_name_blank_error","Group names can't be empty.");let i=r.toLocaleLowerCase();return this._groups.some(a=>a.id!==e.id&&a.name.trim().toLocaleLowerCase()===i)?d(this.hass,"ui.group_name_duplicate_error","Two groups can't have the same name."):""}_openEditor(e){this._editing={...e},this._modalError=""}_addGroup(){let e=crypto.randomUUID().replace(/-/g,"");this._editing={id:e,name:""},this._modalError=""}_closeModal(){this._editing=null,this._modalError=""}_patchDraft(e){this._editing&&(this._editing={...this._editing,...e})}_onName(e){this._patchDraft({name:e.target.value})}_onIcon(e){this._patchDraft({icon:e||void 0})}_onColor(e){this._patchDraft({color:e})}_save(){if(!this._editing)return;let e=this._validate(this._editing);if(e){this._modalError=e;return}let r={...this._editing,name:this._editing.name.trim()},i=this._groups.some(s=>s.id===r.id);this._groups=i?this._groups.map(s=>s.id===r.id?r:s):[...this._groups,r],this._closeModal(),_i(this.hass,this._groups).catch(s=>{this._error=s.message||String(s)})}_deleteGroup(){if(!this._editing)return;let e=this._editing.id;if(this._groups.length<=1){this._modalError=d(this.hass,"ui.group_delete_blocked_last","You can't delete the last group.");return}let r=this._groups;this._groups=this._groups.filter(i=>i.id!==e),yi(this.hass,e).then(()=>this._closeModal()).catch(i=>{this._groups=r;let s=i.code;this._modalError=s==="group_in_use"?d(this.hass,"ui.group_delete_blocked_in_use","This group still has rules \u2014 move or delete them first."):i.message||String(i)})}_renderIconField(){return customElements.get("ha-icon-picker")?l`<ha-icon-picker
        .hass=${this.hass}
        .value=${this._editing.icon??""}
        @value-changed=${e=>{e.stopPropagation(),this._onIcon(e.detail.value)}}
      ></ha-icon-picker>`:l`<input
      class="icon-input"
      .value=${this._editing.icon??""}
      placeholder=${d(this.hass,"ui.group_icon","Icon")}
      @change=${e=>this._onIcon(e.target.value)}
    />`}_renderSwatches(){let e=this._editing.color;return l`
      <div class="swatches">
        ${ir.map(r=>l`<button
            type="button"
            class="swatch ${e===r.id?"selected":""}"
            style=${`background: ${r.hex}`}
            title=${r.label}
            aria-label=${r.label}
            aria-pressed=${e===r.id}
            @click=${()=>this._onColor(r.id)}
          ></button>`)}
        <button
          type="button"
          class="swatch none ${e==null?"selected":""}"
          title=${d(this.hass,"ui.group_color_none","No colour")}
          aria-label=${d(this.hass,"ui.group_color_none","No colour")}
          aria-pressed=${e==null}
          @click=${()=>this._onColor(void 0)}
        >✕</button>
      </div>
    `}_renderModal(){if(!this._editing)return"";let e=this._groups.some(i=>i.id===this._editing.id),r=e?d(this.hass,"ui.group_edit_title","Edit group"):d(this.hass,"ui.group_add_title","Add group");return l`
      <div
        class="overlay"
        @click=${i=>{i.target.classList.contains("overlay")&&this._closeModal()}}
      >
        <div class="modal">
          <div class="modal-header">
            <h3>${r}</h3>
            <button
              class="close"
              title=${d(this.hass,"ui.cancel","Cancel")}
              aria-label=${d(this.hass,"ui.cancel","Cancel")}
              @click=${()=>this._closeModal()}
            >✕</button>
          </div>
          <div class="modal-content">
            <label>${d(this.hass,"ui.group_name_placeholder","Group name")}</label>
            <input
              class="name"
              .value=${this._editing.name}
              placeholder=${d(this.hass,"ui.group_name_placeholder","Group name")}
              aria-label=${d(this.hass,"ui.group_name_placeholder","Group name")}
              @input=${this._onName}
            />

            <label>${d(this.hass,"ui.group_icon","Icon")}</label>
            ${this._renderIconField()}

            <label>${d(this.hass,"ui.group_color","Colour")}</label>
            ${this._renderSwatches()}

            ${this._modalError?l`<p class="modal-error">${this._modalError}</p>`:""}
          </div>
          <div class="modal-footer">
            ${e?l`<button class="delete" @click=${()=>this._deleteGroup()}>
                  ${d(this.hass,"ui.title_delete","Delete")}
                </button>`:l`<span></span>`}
            <div class="right">
              <button class="primary" @click=${()=>this._save()}>
                ${d(this.hass,"ui.group_save","Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    `}render(){return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      <div class="list">
        ${this._sorted().map(e=>{let r=nr(e.color);return l`<button class="group-row" @click=${()=>this._openEditor(e)}>
            <span class="row-icon">${e.icon?l`<ha-icon icon=${e.icon}></ha-icon>`:""}</span>
            <span class="row-swatch ${r?"":"none"}" style=${r?`background: ${r}`:""}></span>
            <span class="row-name">${e.name}</span>
          </button>`})}
      </div>
      <button class="add" @click=${()=>this._addGroup()}>
        ${d(this.hass,"ui.group_add","+ Add group")}
      </button>
      ${this._renderModal()}
    `}};ee.styles=y`
    :host { display: block; }
    .list {
      display: flex; flex-direction: column;
      margin-bottom: 0.75rem;
    }
    button.group-row {
      display: flex; align-items: center; gap: 1rem;
      width: 100%; text-align: left;
      background: none; border: none; border-top: 1px solid var(--divider-color, #e0e0e0);
      padding: 0.75rem 0.5rem; cursor: pointer; color: inherit; font: inherit;
    }
    button.group-row:last-of-type { border-bottom: 1px solid var(--divider-color, #e0e0e0); }
    .row-icon {
      flex: 0 0 1.5rem; display: inline-flex; justify-content: center;
      color: var(--secondary-text-color, #555);
    }
    .row-icon ha-icon { --mdc-icon-size: 24px; }
    .row-swatch {
      flex: 0 0 auto; width: 1.75rem; height: 1.75rem; border-radius: 8px;
      background: var(--secondary-background-color, #e0e0e0);
    }
    .row-swatch.none { background: transparent; border: 1px dashed var(--divider-color, #ccc); }
    .row-name { flex: 1; }
    button.add {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border: none;
      padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;
    }
    .error { color: var(--error-color, #d32f2f); }

    /* Modal overlay (mirrors ambience-rule-editor) */
    .overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 100;
      display: flex; align-items: center; justify-content: center;
    }
    .modal {
      background: var(--card-background-color, #fff); color: inherit;
      width: 90%; max-width: 28rem;
      max-height: 90vh; overflow-y: auto;
      border-radius: 6px;
      display: flex; flex-direction: column;
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .modal-header h3 { margin: 0; }
    .modal-content { padding: 1.5rem; }
    .modal-footer {
      display: flex; justify-content: space-between; gap: 0.5rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .modal-footer .right { display: flex; gap: 0.5rem; }
    label {
      display: block; font-weight: 600; margin: 0.75rem 0 0.25rem 0;
    }
    input.name, input.icon-input {
      width: 100%; box-sizing: border-box; padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
    }
    .swatches {
      display: grid; grid-template-columns: repeat(auto-fill, 2rem);
      gap: 0.4rem; margin-top: 0.25rem;
    }
    button.swatch {
      width: 2rem; height: 2rem; padding: 0;
      border: 2px solid transparent; border-radius: 50%;
      cursor: pointer;
    }
    button.swatch.selected {
      border-color: var(--primary-text-color, #000);
      box-shadow: 0 0 0 1px var(--card-background-color, #fff);
    }
    button.swatch.none {
      background: var(--secondary-background-color, #e0e0e0);
      color: var(--secondary-text-color, #888);
      border: 1px dashed var(--divider-color, #ccc);
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 0.7em;
    }
    button.close {
      background: none; border: none; cursor: pointer;
      color: var(--secondary-text-color, #888); font-size: 1.2em;
      padding: 0; line-height: 1;
    }
    button {
      padding: 0.5rem 1rem; border: 0; border-radius: 4px; cursor: pointer;
    }
    .modal-footer .primary {
      background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff);
    }
    .modal-footer .delete {
      background: transparent; color: var(--error-color, #d32f2f);
      border: 1px solid var(--error-color, #d32f2f);
    }
    .modal-error {
      color: var(--error-color, #d32f2f); margin-top: 0.75rem; font-size: 0.9em;
    }
  `,u([m({attribute:!1})],ee.prototype,"hass",2),u([g()],ee.prototype,"_groups",2),u([g()],ee.prototype,"_error",2),u([g()],ee.prototype,"_editing",2),u([g()],ee.prototype,"_modalError",2),ee=u([$("ambience-groups-settings")],ee);function dl(t){return t.kind==="house"?"house":`${t.kind}-${t.id}`}var se=class extends _{constructor(){super(...arguments);this._defaults={name:"Ambience",auto_on_delay_seconds:7200};this._rows=[];this._error=""}async connectedCallback(){super.connectedCallback();try{let[e,r,i,s]=await Promise.all([hi(this.hass),wt(this.hass),kt(this.hass),St(this.hass)]);this._defaults=e;let a={kind:"house",id:null,name:d(this.hass,"ui.settings_ambience_house_row","Global"),scopePrefix:"Global",override:this._toOverride(s.switch),expanded:!1,autoTriggersEnabled:s.auto_triggers_enabled??!0},o=i.slice().sort((x,S)=>x.name.localeCompare(S.name)),c=await Promise.all(o.map(x=>Et(this.hass,x.floor_id))),h=d(this.hass,"ui.settings_ambience_floor_prefix","Floor: "),p=o.map((x,S)=>({kind:"floor",id:x.floor_id,name:`${h}${x.name}`,scopePrefix:x.name,override:this._toOverride(c[S].switch),expanded:!1,autoTriggersEnabled:c[S].auto_triggers_enabled??!0})),f=r.slice().sort((x,S)=>x.name.localeCompare(S.name)),v=await Promise.all(f.map(x=>xt(this.hass,x.area_id))),b=d(this.hass,"ui.settings_ambience_area_prefix","Area: "),k=f.map((x,S)=>({kind:"area",id:x.area_id,name:`${b}${x.name}`,scopePrefix:x.name,override:this._toOverride(v[S].switch),expanded:!1,autoTriggersEnabled:v[S].auto_triggers_enabled??!0}));this._rows=[a,...p,...k]}catch(e){this._error=e.message||String(e)}}_toOverride(e){return{name:e?.name??null,auto_on_delay_seconds:e?.auto_on_delay_seconds??null}}async _safeSave(e){try{await e(),this._error=""}catch(r){this._error=r.message||String(r)}}_onDefaultName(e){let r=e.target.value.trim();r&&(this._defaults={...this._defaults,name:r},this._safeSave(()=>sr(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds)))}_onDefaultDelay(e){let r=e.target.value;r===""||!Number.isFinite(Number(r))||Number(r)<0||(this._defaults={...this._defaults,auto_on_delay_seconds:Math.floor(Number(r))},this._safeSave(()=>sr(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds)))}_toggle(e){this._rows=this._rows.map((r,i)=>i===e?{...r,expanded:!r.expanded}:r)}_saveRow(e){let{name:r,auto_on_delay_seconds:i}=e.override;this._safeSave(()=>e.kind==="house"?mi(this.hass,r,i):e.kind==="floor"?fi(this.hass,e.id,r,i):gi(this.hass,e.id,r,i))}_onOverrideName(e,r){let i=r.target.value.trim(),s=i===""?null:i;this._rows=this._rows.map((a,o)=>o===e?{...a,override:{...a.override,name:s}}:a),this._saveRow(this._rows[e])}_onOverrideDelay(e,r){let i=r.target.value;if(i!==""&&(!Number.isFinite(Number(i))||Number(i)<0))return;let s=i===""?null:Math.floor(Number(i));this._rows=this._rows.map((a,o)=>o===e?{...a,override:{...a.override,auto_on_delay_seconds:s}}:a),this._saveRow(this._rows[e])}_reset(e){this._rows=this._rows.map((r,i)=>i===e?{...r,override:{name:null,auto_on_delay_seconds:null}}:r),this._saveRow(this._rows[e])}_onAutoTriggers(e,r){this._rows=this._rows.map((s,a)=>a===e?{...s,autoTriggersEnabled:r}:s);let i=this._rows[e];this._safeSave(()=>vi(this.hass,i.kind,i.id,r))}_defaultDisplayName(e){return`${e.scopePrefix} ${this._defaults.name}`}render(){return l`
      ${this._error?l`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:""}

      <div class="card">
        <h3>${d(this.hass,"ui.settings_ambience_defaults_card","Defaults")}</h3>
        <div class="row">
          <label>${d(this.hass,"ui.settings_ambience_field_name","Switch name")}</label>
          <input data-test="defaults-name" type="text" .value=${this._defaults.name} @change=${e=>this._onDefaultName(e)} />
        </div>
        <div class="row">
          <label>${d(this.hass,"ui.settings_ambience_field_delay","Auto-on delay (seconds)")}</label>
          <input data-test="defaults-delay-seconds" type="number" min="0" .value=${String(this._defaults.auto_on_delay_seconds)} @change=${e=>this._onDefaultDelay(e)} />
          <div class="help">${d(this.hass,"ui.settings_ambience_delay_help","0 = never auto-on")}</div>
        </div>
      </div>

      <div class="card">
        <h3>${d(this.hass,"ui.settings_ambience_overrides_card","Per-scope overrides")}</h3>
        ${this._rows.map((e,r)=>{let i=dl(e);return l`
            <div class="scope-row" data-test="scope-row">
              <div class="scope-header" data-test="expand" @click=${()=>this._toggle(r)}>
                <span class="chevron ${e.expanded?"open":""}">▶</span>
                <div class="scope-name">${e.name}</div>
              </div>
              ${e.expanded?l`
                <div class="scope-body">
                  <div class="row">
                    <label>${d(this.hass,"ui.settings_ambience_field_name","Switch name")}</label>
                    <input data-test=${`override-name-${i}`} type="text" .value=${e.override.name??""} placeholder=${this._defaultDisplayName(e)} @change=${s=>this._onOverrideName(r,s)} />
                  </div>
                  <div class="row">
                    <label>${d(this.hass,"ui.settings_ambience_field_delay","Auto-on delay (seconds)")}</label>
                    <input data-test=${`override-delay-${i}`} type="number" min="0" .value=${e.override.auto_on_delay_seconds===null?"":String(e.override.auto_on_delay_seconds)} placeholder=${String(this._defaults.auto_on_delay_seconds)} @change=${s=>this._onOverrideDelay(r,s)} />
                  </div>
                  <div class="row">
                    <label>${d(this.hass,"ui.settings_ambience_auto_triggers","Automatic triggers")}</label>
                    <input
                      data-test=${`auto-triggers-${i}`}
                      type="checkbox"
                      .checked=${e.autoTriggersEnabled}
                      @change=${s=>this._onAutoTriggers(r,s.target.checked)}
                    />
                  </div>
                  <button class="reset" data-test=${`reset-${i}`} @click=${()=>this._reset(r)}>${d(this.hass,"ui.settings_ambience_reset_to_defaults","Reset to defaults")}</button>
                </div>
              `:""}
            </div>
          `})}
      </div>

      <div class="card">
        <h3>${d(this.hass,"ui.settings_tab_groups","Rule groups")}</h3>
        <ambience-groups-settings .hass=${this.hass}></ambience-groups-settings>
      </div>
    `}};se.styles=y`
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
  `,u([m({attribute:!1})],se.prototype,"hass",2),u([g()],se.prototype,"_defaults",2),u([g()],se.prototype,"_rows",2),u([g()],se.prototype,"_error",2),se=u([$("ambience-ambience-settings")],se);var ae=class extends _{constructor(){super(...arguments);this.matcherName="";this.matcherDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let e=Y(this.hass,this.matcherName);return l`
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
    `}};ae.styles=y`
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
  `,u([m({attribute:!1})],ae.prototype,"hass",2),u([m()],ae.prototype,"matcherName",2),u([m()],ae.prototype,"matcherDescription",2),u([g()],ae.prototype,"_expanded",2),ae=u([$("ambience-matcher-card")],ae);function je(t){return t.scope_kind==="house"?"House":t.scope_kind==="floor"?`Floor: ${t.scope_id??""}`:t.scope_id??""}var cl=/^[a-z][a-z0-9_]*$/;function ul(t){return t.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var G=class extends _{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._label=this.initial.label??"",this._def=this.initial}_onLabelInput(e){this._label=e.target.value}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_validate(e){if(!this.existingId){if(!this._label.trim())return d(this.hass,"ui.error_enter_name","Please enter a name.");if(!e)return d(this.hass,"ui.error_start_letter","Name must start with a letter.");if(!cl.test(e))return d(this.hass,"ui.error_start_letter","Name must start with a letter.");if(this.takenIds.has(e))return d(this.hass,"ui.error_name_exists","A period with this name already exists. Choose a different name.")}return""}_onSave(){let e=this.existingId??ul(this._label),r=this._validate(e);if(r){this._error=r,this.performUpdate();return}let i={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:e,definition:i},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){let e=this.existingId?d(this.hass,"ui.period_modal_edit_title",'Edit "{name}"').replace("{name}",this.initial?.label??this.existingId):d(this.hass,"ui.period_modal_add_title","Add custom period");return l`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${e}</h3>
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
    `}};G.styles=y`
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
  `,u([m({attribute:!1})],G.prototype,"hass",2),u([m({attribute:!1})],G.prototype,"existingId",2),u([m({attribute:!1})],G.prototype,"initial",2),u([m({attribute:!1})],G.prototype,"takenIds",2),u([g()],G.prototype,"_label",2),u([g()],G.prototype,"_def",2),u([g()],G.prototype,"_error",2),G=u([$("ambience-period-edit-modal")],G);function Hn(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=Pe(n,t.anchor);if(t.offset_min===0)return e;let r=Math.abs(t.offset_min),i=r%60===0?`${r/60}${d(n,"ui.unit_hour_abbr","h")}`:`${r}${d(n,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${i}`}function Dn(t,n){return`${Hn(t.from,n)} \u2192 ${Hn(t.to,n)}`}var oe=class extends _{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await Tt(this.hass)}async _saveState(e){let r=await li(this.hass,e,this._view.hidden);this._warnings=r.warnings,await this._reload()}_onEdit(e,r){this._modal={mode:"edit",id:e,initial:r}}async _onDelete(e){let r={...this._view.custom};delete r[e],await this._saveState(r)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:r,definition:i}=e.detail,s={...this._view.custom,[r]:i};this._modal={mode:"closed"},await this._saveState(s)}_onModalCancel(){this._modal={mode:"closed"}}_renderBuiltinRow(e,r,i){return l`
      <div class="row ${i?"overridden":""}">
        <span class="name">${$e(this.hass,e,{})}</span>
        <span class="def">${Dn(r,this.hass)}</span>
        <span class="badge">${d(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${i?"":l`<button class="icon" title=${d(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(e,r)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(e,r){return l`
      <div class="row custom">
        <span class="name">${$e(this.hass,e,this._view.custom)}</span>
        <span class="def">${Dn(r,this.hass)}</span>
        <span class="badge">${d(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${d(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e,r)}>✎</button>
          <button class="icon" title=${d(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e)}>✕</button>
        </span>
      </div>
    `}render(){let e=this._view.custom;return l`
      <header>
        <h2>${d(this.hass,"ui.periods_heading","Periods")}</h2>
      </header>
      ${this._warnings.length?l`<div class="warnings">
            <strong>${d(this.hass,"ui.period_warning_prefix","Warning:")}</strong> ${d(this.hass,"ui.period_warning_text","some rules now reference missing periods:")}
            <ul>
              ${this._warnings.map(r=>l`<li>${je(r)} / "${r.rule_name}" → ${r.missing_period}</li>`)}
            </ul>
          </div>`:""}
      ${Object.entries(this._view.builtins).map(([r,i])=>{let s=e[r];return l`
          ${this._renderBuiltinRow(r,i,s!=null)}
          ${s!=null?this._renderCustomRow(r,s):""}
        `})}
      ${Object.entries(e).filter(([r])=>!(r in this._view.builtins)).map(([r,i])=>this._renderCustomRow(r,i))}
      <button class="add" @click=${this._onAdd}>${d(this.hass,"ui.add_custom_period","+ Add custom period")}</button>
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
    `}};oe.styles=y`
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
  `,u([m({attribute:!1})],oe.prototype,"hass",2),u([g()],oe.prototype,"_view",2),u([g()],oe.prototype,"_modal",2),u([g()],oe.prototype,"_warnings",2),oe=u([$("ambience-time-of-day-config")],oe);var fe=class extends _{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await Lt(this.hass)}async _save(e){this._config=e;let r=await di(this.hass,e.workday_sensor,e.workday_calendar);this._warnings=r.warnings??[]}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=[{name:"workday_sensor",selector:{entity:{integration:"workday",domain:"binary_sensor"}}}],r=[{name:"workday_calendar",selector:{entity:{integration:"workday",domain:"calendar"}}}];return l`
      <div class="row">
        <label>${d(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${e}
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
      ${this._warnings.length?l`
        <div class="warnings">
          <strong>${d(this.hass,"ui.day_warning_prefix","Warning:")}</strong> ${d(this.hass,"ui.day_warning_text","rules now reference unconfigured entities:")}
          <ul>
            ${this._warnings.map(i=>l`<li>${je(i)} / "${i.rule_name}" → ${i.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};fe.styles=y`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,u([m({attribute:!1})],fe.prototype,"hass",2),u([g()],fe.prototype,"_config",2),u([g()],fe.prototype,"_warnings",2),fe=u([$("ambience-day-config")],fe);var hl=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],le=class extends _{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._warnings=[];this._expanded=new Set}async connectedCallback(){super.connectedCallback(),this._config=await At(this.hass)}async _persist(){let e=await ci(this.hass,this._config.entity,this._config.groups);this._warnings=e.warnings??[]}_onEntityChange(e){this._config={...this._config,entity:e.detail.value||null},this._persist()}_nextGroupId(e){let r=new Set(e.map(i=>i.id));for(let i=1;i<=e.length+1;i++){let s=`group_${i}`;if(!r.has(s))return s}return`group_${e.length+1}`}_addGroup(){let e=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:e,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,e]),this._persist()}_toggleExpand(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):r.add(e),this._expanded=r}_updateGroup(e,r){this._config={...this._config,groups:this._config.groups.map((i,s)=>s===e?{...i,...r}:i)},this._persist()}_removeGroup(e){let r=this._config.groups[e];if(this._config={...this._config,groups:this._config.groups.filter((i,s)=>s!==e)},r){let i=new Set(this._expanded);i.delete(r.id),this._expanded=i}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:hl.map(e=>({value:e,label:_t(this.hass,e)}))}}}]}_renderConditions(e,r){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:r.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation(),this._updateGroup(e,{conditions:s.detail.value.conditions??[]})}}
      ></ha-form>`;let i=r.conditions.map(s=>_t(this.hass,s));return l`<span class="conditions-list">${i.join(", ")}</span>`}_renderGroup(e,r){let i=this._expanded.has(r.id),s=r.conditions.map(a=>_t(this.hass,a)).join(", ");return l`
      <div class="group">
        <div class="group-header" @click=${()=>this._toggleExpand(r.id)}>
          <span class="chevron ${i?"open":""}">▶</span>
          <span class="label">${r.label}</span>
          <span class="codes">${s}</span>
          <button
            class="icon"
            title=${d(this.hass,"ui.title_delete","Delete")}
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
        <label class="section">${d(this.hass,"ui.weather_entity","Weather entity")}</label>
        <ha-form
          .hass=${this.hass}
          .schema=${e}
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

      ${this._warnings.length?l`
        <div class="warnings">
          <strong>${d(this.hass,"ui.day_warning_prefix","Warning:")}</strong>
          ${d(this.hass,"ui.weather_warning_text","rules now reference an unconfigured weather entity:")}
          <ul>${this._warnings.map(r=>l`<li>${je(r)} / "${r.rule_name}" → ${r.reason}</li>`)}</ul>
        </div>
      `:""}
    `}};le.styles=y`
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
  `,u([m({attribute:!1})],le.prototype,"hass",2),u([g()],le.prototype,"_config",2),u([g()],le.prototype,"_warnings",2),u([g()],le.prototype,"_expanded",2),le=u([$("ambience-weather-config")],le);var pl=new Set(["time_of_day","day","weather"]),ge=class extends _{constructor(){super(...arguments);this._matchers=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._matchers=await Ct(this.hass)}catch(e){this._error=e.message||String(e)}}render(){let e=this._matchers.filter(r=>pl.has(r.name)).slice().sort((r,i)=>i.priority-r.priority);return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${e.map(r=>l`
        <ambience-matcher-card .hass=${this.hass} .matcherName=${r.name} .matcherDescription=${r.description}>
          ${r.name==="time_of_day"?l`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`:r.name==="day"?l`<ambience-day-config .hass=${this.hass}></ambience-day-config>`:r.name==="weather"?l`<ambience-weather-config .hass=${this.hass}></ambience-weather-config>`:l``}
        </ambience-matcher-card>
      `)}
    `}};ge.styles=y`
    :host { display: block; }
    .error { color: var(--error-color, #d32f2f); }
  `,u([m({attribute:!1})],ge.prototype,"hass",2),u([g()],ge.prototype,"_matchers",2),u([g()],ge.prototype,"_error",2),ge=u([$("ambience-matchers-settings")],ge);function fl(t){let n=t.indexOf("."),e=n===-1?"":t.slice(0,n),i=(n===-1?t:t.slice(n+1)).replaceAll("_"," ").trim().toLowerCase(),s=e.replaceAll("_"," ").trim().toLowerCase(),a=i?i.split(" "):[],o=s?s.split(" "):[],c=o.length>0&&o.every(p=>a.includes(p)),h=!s||c?i:`${i} ${s}`;return h.charAt(0).toUpperCase()+h.slice(1)}var A=class extends _{constructor(){super(...arguments);this._actions=[];this._services=[];this._schemas={};this._fieldSchemas={};this._addSchema=[];this._serviceById=new Map;this._availableServices=[];this._expanded=new Set;this._adding=!1;this._warnings=[];this._loadError=null;this._saveError=null;this._loaded=!1;this._editingDefault=null;this._editingOriginalValue=void 0;this._editingOriginalHad=!1;this._drag=new Fe(this,(e,r)=>{let i=[...this._actions],[s]=i.splice(e,1);i.splice(r,0,s),this._actions=i,this._autoSave()});this._onDocPointerDown=e=>{let r=e.composedPath();this._collapseAddFormOnClickAway(r),this._cancelEditingDefaultOnClickAway(r)}}_collapseAddFormOnClickAway(e){if(!this._adding)return;let r=this.shadowRoot?.querySelector(".add-row"),i=!!r&&e.includes(r),s=e.some(a=>a instanceof Element&&A._OVERLAY_TAG_RE.test(a.localName));!i&&!s&&(this._adding=!1)}_cancelEditingDefaultOnClickAway(e){if(this._editingDefault===null)return;let r=this.shadowRoot?.querySelector(`.field-row-editor[data-editing-key="${this._editingDefault}"]`);(!r||!e.includes(r))&&this._cancelEditingDefault()}connectedCallback(){super.connectedCallback(),document.addEventListener("pointerdown",this._onDocPointerDown),customElements.get("ha-service-picker")||customElements.whenDefined("ha-service-picker").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._onDocPointerDown)}_startEditingDefault(e,r){let s=this._actions.find(a=>a.id===e)?.defaults??{};this._editingOriginalHad=r in s,this._editingOriginalValue=s[r],this._editingDefault=`${e}:${r}`}_saveEditingDefault(){this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1,this._autoSave()}_cancelEditingDefault(){let e=this._editingDefault;if(e){let r=e.indexOf(":"),i=e.slice(0,r),s=e.slice(r+1);this._actions=this._actions.map(a=>{if(a.id!==i)return a;let o={...a.defaults??{}};return this._editingOriginalHad?o[s]=this._editingOriginalValue:delete o[s],{...a,defaults:o}})}this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1}async firstUpdated(){await this._reload()}willUpdate(e){if(e.has("_actions")||e.has("_schemas")){let r={};for(let i of this._actions){let s=this._schemas[i.id];if(s)for(let[a,o]of Object.entries(s.fields))r[`${i.id}:${a}`]=[{name:a,selector:o.selector??{text:{}},required:!1}]}this._fieldSchemas=r}if(e.has("_services")&&(this._serviceById=new Map(this._services.map(r=>[r.id,r]))),e.has("_actions")||e.has("_services")){let r=new Set(this._actions.map(i=>i.id));this._availableServices=this._services.filter(i=>!r.has(i.id)),this._addSchema=[{name:"service",selector:{select:{options:this._availableServices.map(i=>({value:i.id,label:this._addOptionLabel(i.id)})),custom_value:!0,mode:"dropdown",sort:!0}}}]}}async _reload(){this._loadError=null;try{let[e,r]=await Promise.all([Je(this.hass),ni(this.hass)]);this._actions=e,this._services=r}catch(e){this._loadError=e instanceof Error?e.message:String(e);return}await Promise.all(this._actions.map(e=>this._ensureSchema(e.id))),this._loaded=!0}async _ensureSchema(e){if(!(e in this._schemas))try{let r=await De(this.hass,e);this._schemas={...this._schemas,[e]:r}}catch{this._schemas={...this._schemas,[e]:null}}}_setShowInEditor(e,r,i){this._actions=this._actions.map(s=>{if(s.id!==e)return s;let a=new Set(s.visible_fields??[]);return i?a.add(r):a.delete(r),{...s,visible_fields:[...a]}}),this._autoSave()}_setDefault(e,r,i){this._actions=this._actions.map(s=>s.id!==e?s:{...s,defaults:{...s.defaults??{},[r]:i}})}_clearDefault(e,r){this._actions=this._actions.map(i=>{if(i.id!==e)return i;let s={...i.defaults??{}};return delete s[r],{...i,defaults:s}})}_setLabel(e,r){this._actions=this._actions.map(i=>i.id===e?{...i,label:r}:i)}_setReapplyEnabled(e,r){this._actions=this._actions.map(i=>{if(i.id!==e)return i;if(!r){let{reapply_seconds:s,...a}=i;return a}return{...i,reapply_seconds:300}}),this._autoSave()}_setReapplySeconds(e,r){let i=Li(r);i!==null&&(this._actions=this._actions.map(s=>s.id!==e?s:{...s,reapply_seconds:i}),this._autoSave())}_toggleExpand(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):(r.add(e),this._ensureSchema(e)),this._expanded=r}async _addService(e){e&&this._services.some(r=>r.id===e)&&(this._actions.some(r=>r.id===e)||(await this._ensureSchema(e),this._actions=[...this._actions,{id:e,label:this._labelForService(e),visible_fields:[],defaults:{}}],this._expanded=new Set([...this._expanded,e]),this._adding=!1,this._autoSave()))}_removeService(e){this._actions=this._actions.filter(i=>i.id!==e);let r=new Set(this._expanded);r.delete(e),this._expanded=r,this._autoSave()}async _autoSave(){this._saveError=null,this._warnings=[];try{let e=await ii(this.hass,this._actions);this._warnings=e.warnings??[],window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"))}catch(e){this._saveError=e instanceof Error?e.message:String(e)}}render(){return this._loadError!==null?l`
        <div class="error">${this._loadError}</div>
        <button @click=${()=>this._reload()}>${d(this.hass,"ui.retry","Retry")}</button>
      `:this._loaded?l`
      <section>
        ${this._renderWarnings()}
        ${this._saveError?l`<div class="error">${this._saveError}</div>`:""}
        ${this._actions.map((e,r)=>this._renderCard(e,r))}
        ${this._renderAdd()}
      </section>
    `:l`<div>${d(this.hass,"ui.loading","Loading\u2026")}</div>`}_renderCard(e,r){let i=this._schemas[e.id],s=this._expanded.has(e.id);return l`
      <div
        class="card ${this._drag.over===r?"drag-over":""} ${this._drag.from===r?"dragging":""}"
        data-card
        data-service=${e.id}
        @dragover=${a=>this._drag.dragOver(a,r)}
        @drop=${()=>this._drag.drop(r)}
        @dragend=${()=>this._drag.end()}
      >
        <div
          class="card-header"
          data-toggle
          @click=${a=>{a.target.closest("ha-input, input, button.remove, .drag-handle")||this._toggleExpand(e.id)}}
        >
          <span
            class="drag-handle"
            data-drag-handle
            draggable="true"
            title=${d(this.hass,"ui.drag_to_reorder","Drag to reorder")}
            @dragstart=${a=>this._drag.start(r,a,a.currentTarget.closest(".card"))}
            @click=${a=>a.stopPropagation()}
          >⠿</span>
          <span class="toggle-arrow">${s?"\u25BE":"\u25B8"}</span>
          ${s?l`
                <strong>${e.id}</strong>
                <ha-input
                  class="header-label-input"
                  data-label-input
                  placeholder=${d(this.hass,"ui.action_label_placeholder","Label (optional)")}
                  .value=${e.label}
                  @input=${a=>{a.stopPropagation(),this._setLabel(e.id,a.target.value)}}
                  @blur=${()=>void this._autoSave()}
                  @click=${a=>a.stopPropagation()}
                ></ha-input>
              `:e.label?l`
                  <span class="header-label-display">${e.label}</span>
                  <span class="header-service-id">(${e.id})</span>
                `:l`<strong class="standalone">${e.id}</strong>`}
          <button
            class="remove"
            data-remove
            title=${d(this.hass,"ui.remove","Remove")}
            @click=${a=>{a.stopPropagation(),this._removeService(e.id)}}
          >✖</button>
        </div>
        ${s?this._renderBody(e,i):""}
      </div>
    `}_renderBody(e,r){return l`
      <div class="body">
        ${this._renderFieldsSection(e,r)}
        ${this._renderReapplyRow(e)}
      </div>
    `}_renderFieldsSection(e,r){if(r===null)return l`<p class="body-help warning">
        ${d(this.hass,"ui.service_unavailable","Service not available in this HA instance.")}
      </p>`;if(r===void 0)return l`<p class="body-help">${d(this.hass,"ui.loading","Loading\u2026")}</p>`;let i=Object.entries(r.fields).slice().sort(([s],[a])=>s.localeCompare(a));return i.length===0?l`<p class="body-help">
        ${d(this.hass,"ui.service_has_no_fields","This service has no fields.")}
      </p>`:l`
      <p class="body-help">
        ${d(this.hass,"ui.actions_field_help","Tick a checkbox to make a field editable per rule. Set a default to pre-fill it.")}
      </p>
      ${i.map(([s,a])=>this._renderFieldRow(e,s,a))}
    `}_formatDefaultSummary(e){return e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}_defaultUnitSuffix(e,r){let i=this._schemas[e]?.fields?.[r];if(!i||typeof i!="object")return"";let s=Ht(i.selector);return s?` ${s}`:""}_renderFieldRow(e,r,i){let s=(e.visible_fields??[]).includes(r),a=r in(e.defaults??{}),o=`${e.id}:${r}`,c=this._editingDefault===o;return l`
      <div class="field-row">
        <!-- Row 1: [checkbox] [name] [default summary] -->
        <div class="field-row-main">
          <div class="checkbox-cell">
            <input
              type="checkbox"
              data-show-in-editor=${r}
              title="Show in rule editor"
              .checked=${s}
              @change=${h=>this._setShowInEditor(e.id,r,h.target.checked)}
            />
          </div>
          <span class="name">
            ${i.name||Ze(r)}
            ${i.name?l` <small class="field-id">(${r})</small>`:""}
            ${i.description?l` <small>— ${i.description}</small>`:""}
          </span>
          <div class="summary-cell">
            ${c?l`<span class="summary-cell-editing">Editing…</span>`:a?l`<button
                    class="default-summary"
                    data-default-summary=${r}
                    @click=${h=>{h.stopPropagation(),this._startEditingDefault(e.id,r)}}
                  >Default: ${this._formatDefaultSummary((e.defaults??{})[r])}${this._defaultUnitSuffix(e.id,r)}</button>`:l`<button
                    class="set-default-btn"
                    data-set-default=${r}
                    @click=${h=>{h.stopPropagation(),this._startEditingDefault(e.id,r)}}
                  >+ ${d(this.hass,"ui.set_default","Set default")}</button>`}
          </div>
        </div>
        <!-- Row 2: full editor (only when editing) -->
        ${c?l`<div
              class="field-row-editor"
              data-editing-key=${o}
            >
              <div class="editor-line">
                <div class="default-editor">${this._renderDefaultEditor(e,r,i)}</div>
                <button
                  class="clear-default"
                  data-clear-default=${r}
                  title=${d(this.hass,"ui.clear_default","Clear default")}
                  @click=${h=>{h.stopPropagation(),this._clearDefault(e.id,r),this._saveEditingDefault()}}
                >✕</button>
              </div>
              <div class="editor-actions">
                <button
                  class="cancel-default"
                  data-cancel-default=${r}
                  @click=${h=>{h.stopPropagation(),this._cancelEditingDefault()}}
                >${d(this.hass,"ui.cancel","Cancel")}</button>
                <button
                  class="save-default"
                  data-save-default=${r}
                  @click=${h=>{h.stopPropagation(),this._saveEditingDefault()}}
                >${d(this.hass,"ui.save","Save")}</button>
              </div>
            </div>`:""}
      </div>
    `}_renderDefaultEditor(e,r,i){let s=e.defaults?.[r],a=this._fieldSchemas[`${e.id}:${r}`]??[];return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${a}
        .data=${{[r]:s??""}}
        .computeLabel=${()=>""}
        @value-changed=${o=>{o.stopPropagation(),this._setDefault(e.id,r,o.detail.value[r])}}
      ></ha-form>`:l`<input
      data-default-value=${r}
      .value=${s==null?"":String(s)}
      @input=${o=>this._setDefault(e.id,r,o.target.value)}
    />`}_renderReapplyRow(e){let r=typeof e.reapply_seconds=="number"&&e.reapply_seconds>0,i=r?String(e.reapply_seconds):"";return l`
      <div class="reapply-row">
        <input
          id="reapply-enable-${e.id}"
          type="checkbox"
          data-reapply-enable
          .checked=${r}
          @change=${s=>{this._setReapplyEnabled(e.id,s.target.checked)}}
        />
        <label for="reapply-enable-${e.id}">
          ${d(this.hass,"ui.reapply_enable_label","Re-apply periodically")}
        </label>
        ${r?l`
          <input
            id="reapply-${e.id}"
            type="number"
            min="10"
            data-reapply-input
            aria-label=${d(this.hass,"ui.reapply_seconds_label","Re-apply every (seconds)")}
            .value=${i}
            @input=${s=>{this._setReapplySeconds(e.id,s.target.value)}}
          />
          <span class="reapply-unit">
            ${d(this.hass,"ui.reapply_seconds_unit","s")}
          </span>
        `:""}
      </div>
    `}_renderAdd(){return this._adding?l`<div class="add-row">
      ${this._renderAddPicker()}
      <button data-action="cancel-add" @click=${()=>{this._adding=!1}}>
        ${d(this.hass,"ui.cancel","Cancel")}
      </button>
    </div>`:l`<div class="add-row">
        <button class="add" data-action="add" @click=${()=>{this._adding=!0}}>
          + ${d(this.hass,"ui.add_action_button","Add action")}
        </button>
      </div>`}_labelForService(e){return this._serviceById.get(e)?.name?.trim()||fl(e)}_addOptionLabel(e){return`${this._labelForService(e)} (${e})`}_renderAddPicker(){return customElements.get("ha-service-picker")?l`<ha-service-picker
        class="add-picker"
        data-add-service-picker
        .hass=${this.hass}
        @value-changed=${e=>{e.stopPropagation();let r=e.detail.value;r&&this._addService(r)}}
      ></ha-service-picker>`:customElements.get("ha-form")?l`<ha-form
        class="add-picker"
        data-add-service-form
        .hass=${this.hass}
        .schema=${this._addSchema}
        .data=${{service:""}}
        .computeLabel=${()=>d(this.hass,"ui.pick_service","Pick a service")}
        @value-changed=${e=>{e.stopPropagation();let r=e.detail.value.service;r&&this._addService(r)}}
      ></ha-form>`:l`<select
      data-add-service
      @change=${e=>this._addService(e.target.value)}
    >
      <option value="">— ${d(this.hass,"ui.pick_service","Pick a service")} —</option>
      ${this._availableServices.map(e=>l`<option value=${e.id}>${this._addOptionLabel(e.id)}</option>`)}
    </select>`}_renderWarnings(){return this._warnings.length===0?"":l`<ul class="warning">
      ${this._warnings.map(e=>l`<li>
          ${e.scope_kind}${e.scope_id?`/${e.scope_id}`:""}${e.rule_name?l` — <em>${e.rule_name}</em>`:""}: ${e.reason}
        </li>`)}
    </ul>`}};A.styles=y`
    :host { display: block; }
    .card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      margin-bottom: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: var(--card-background-color, #fff);
    }
    .card.drag-over {
      border-color: var(--primary-color, #03a9f4);
    }
    .card.dragging {
      opacity: 0.4;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    .drag-handle {
      flex: 0 0 auto;
      cursor: grab;
      color: var(--secondary-text-color, #888);
      user-select: none;
      font-size: 1rem;
      line-height: 1;
    }
    .drag-handle:active {
      cursor: grabbing;
    }
    .card-header:hover .drag-handle {
      color: var(--primary-text-color, inherit);
    }
    .card-header:hover .toggle-arrow {
      color: var(--primary-color, #03a9f4);
    }
    .toggle-arrow {
      flex: 0 0 auto;
      font-size: 0.95rem;
      color: var(--primary-text-color, inherit);
      user-select: none;
    }
    .card-header strong {
      flex: 0 0 auto;
      font-family: var(--code-font-family, monospace);
      font-size: 0.9rem;
    }
    /* Standalone service id (no label set): fill the row so the ✕ button
       gets pushed to the far right, matching the labelled-card layout. */
    .card-header strong.standalone {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* Collapsed: label (primary) + "(service.id)" (secondary, monospace) */
    .header-label-display {
      flex: 0 0 auto;
      font-weight: 600;
      color: var(--primary-text-color, inherit);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .header-service-id {
      flex: 1;
      font-family: var(--code-font-family, monospace);
      font-size: 0.85rem;
      color: var(--secondary-text-color, #888);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* ha-input for the label when expanded */
    .header-label-input {
      flex: 1;
      /* Prevent click-on-input from propagating to the header toggle */
    }
    .card-header button.remove {
      flex: 0 0 auto;
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
      /* Indent so field names align under the service id in the header.
         Arrow glyph (≈1ch) + gap (0.5rem) ≈ 1.5rem total. */
      padding-left: 1.5rem;
    }
    .body-help {
      font-size: 0.85rem;
      color: var(--secondary-text-color, #888);
      margin: 0 0 0.5rem 0;
    }
    /* Two-row field layout */
    .field-row {
      padding: 0.35rem 0;
      border-bottom: 1px dotted var(--divider-color, #eee);
    }
    .field-row:last-child { border-bottom: none; }
    .field-row-main {
      display: grid;
      grid-template-columns: min-content 1fr auto;
      gap: 0.5rem;
      align-items: center;
    }
    .field-row-main .checkbox-cell {
      display: flex;
      align-items: center;
    }
    .field-row-main .name {
      color: var(--primary-text-color, inherit);
    }
    .field-row-main .name small {
      color: var(--secondary-text-color, #888);
      font-weight: normal;
    }
    .field-row-main .summary-cell {
      justify-self: start;
    }
    /* The collapsed-summary pill / set-default button */
    .set-default-btn {
      background: transparent;
      border: 1px dashed var(--divider-color, #ccc);
      color: var(--secondary-text-color, #888);
      cursor: pointer;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      font: inherit;
      font-size: 0.85rem;
    }
    button.default-summary {
      background: var(--secondary-background-color, #f5f5f5);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 3px;
      color: var(--primary-text-color, inherit);
      cursor: pointer;
      font: inherit;
      font-size: 0.85rem;
      padding: 0.2rem 0.5rem;
      white-space: nowrap;
    }
    button.default-summary:hover {
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }
    /* Row 2: the full editor — thin bordered box, no filled background */
    .field-row-editor {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: transparent;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 4px;
      margin: 0.5rem 0;
    }
    .field-row-editor .editor-line {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .field-row-editor .editor-line .default-editor {
      flex: 1;
    }
    .field-row-editor .editor-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.4rem;
    }
    .field-row-editor button.clear-default {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color, #888);
      font-size: 1rem;
      padding: 0 0.25rem;
      line-height: 1;
      flex: 0 0 auto;
    }
    .field-row-editor button.clear-default:hover {
      color: var(--error-color, #c62828);
    }
    .field-row-editor button.save-default {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
      padding: 0.2rem 0.5rem;
      font-size: 0.85rem;
      flex: 0 0 auto;
    }
    .field-row-editor button.cancel-default {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color, #888);
      padding: 0.2rem 0.3rem;
      font-size: 0.85rem;
      flex: 0 0 auto;
      text-decoration: underline;
    }
    .field-row-editor button.cancel-default:hover {
      color: var(--primary-text-color, inherit);
    }
    .summary-cell-editing {
      color: var(--secondary-text-color, #888);
      font-size: 0.85rem;
      font-style: italic;
    }
    .field-row input[data-default-value] {
      width: 100%;
      box-sizing: border-box;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      background: transparent;
      color: var(--primary-text-color, inherit);
      font: inherit;
    }
    .reapply-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0;
      margin-top: 0.25rem;
      border-top: 1px dotted var(--divider-color, #eee);
      font-size: 0.9rem;
      /* Reserve the height of the seconds input so the row doesn't grow when
         the field appears/disappears as the checkbox is toggled. */
      min-height: 2rem;
    }
    .reapply-row label {
      color: var(--primary-text-color, inherit);
      flex: 0 0 auto;
    }
    .reapply-row input[data-reapply-input] {
      width: 5rem;
      box-sizing: border-box;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      background: transparent;
      color: var(--primary-text-color, inherit);
      font: inherit;
    }
    .reapply-row .reapply-unit {
      color: var(--secondary-text-color, #888);
      flex: 0 0 auto;
    }
    .add-row {
      margin: 0.75rem 0;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    /* Let the HA-native picker (ha-service-picker / ha-form) fill the row so
       its dropdown aligns under a full-width field rather than a narrow one. */
    .add-row .add-picker {
      flex: 1;
      min-width: 0;
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
    /* Primary "Add action" button — filled blue, matching the rules list. */
    button.add {
      background: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
  `,A._OVERLAY_TAG_RE=/vaadin|combo-box|overlay|listbox|menu|mwc-|md-/i,u([m({attribute:!1})],A.prototype,"hass",2),u([g()],A.prototype,"_actions",2),u([g()],A.prototype,"_services",2),u([g()],A.prototype,"_schemas",2),u([g()],A.prototype,"_fieldSchemas",2),u([g()],A.prototype,"_addSchema",2),u([g()],A.prototype,"_expanded",2),u([g()],A.prototype,"_adding",2),u([g()],A.prototype,"_warnings",2),u([g()],A.prototype,"_loadError",2),u([g()],A.prototype,"_saveError",2),u([g()],A.prototype,"_loaded",2),u([g()],A.prototype,"_editingDefault",2),u([g()],A.prototype,"_editingOriginalValue",2),u([g()],A.prototype,"_editingOriginalHad",2),A=u([$("ambience-actions-settings")],A);var Ce=class extends _{constructor(){super(...arguments);this._tab="ambience"}render(){return l`
      <nav>
        <button class=${this._tab==="ambience"?"active":""} @click=${()=>{this._tab="ambience"}}>${d(this.hass,"ui.settings_tab_ambience","Ambience")}</button>
        <button class=${this._tab==="matchers"?"active":""} @click=${()=>{this._tab="matchers"}}>${d(this.hass,"ui.settings_tab_matchers","Matchers")}</button>
        <button class=${this._tab==="actions"?"active":""} @click=${()=>{this._tab="actions"}}>${d(this.hass,"ui.settings_tab_actions","Actions")}</button>
      </nav>
      ${this._tab==="ambience"?l`<ambience-ambience-settings .hass=${this.hass}></ambience-ambience-settings>`:this._tab==="matchers"?l`<ambience-matchers-settings .hass=${this.hass}></ambience-matchers-settings>`:l`<ambience-actions-settings .hass=${this.hass}></ambience-actions-settings>`}
    `}};Ce.styles=y`
    :host { display: block; padding: 1rem; max-width: var(--ambience-content-max-width, 60rem); margin: 0 auto; }
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
  `,u([m({attribute:!1})],Ce.prototype,"hass",2),u([g()],Ce.prototype,"_tab",2),Ce=u([$("ambience-settings-view")],Ce);var lt=class extends _{constructor(){super(...arguments);this._view="areas"}static{this.styles=y`
    :host {
      display: block;
      height: 100%;
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
      flex: 1;
      display: flex;
      align-items: center;
      /* visually replaced by the logo; keep for document outline only */
      font-size: 0;
    }
    h1 .ambience-logo {
      display: block;
      height: 2rem;
      width: auto;
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
  `}connectedCallback(){super.connectedCallback(),ce(this)}render(){return l`
      <header>
        <h1>
          ${Jr({dark:!!this.hass.themes?.darkMode,title:d(this.hass,"ui.panel_title","Ambience")})}
        </h1>
        <nav>
          <button
            class=${this._view==="areas"?"active":""}
            @click=${()=>{this._view="areas"}}
          >${d(this.hass,"ui.tab_areas","Areas")}</button>
          <button
            class=${this._view==="settings"?"active":""}
            @click=${()=>{this._view="settings"}}
          >${d(this.hass,"ui.tab_settings","Settings")}</button>
        </nav>
      </header>
      ${this._view==="areas"?l`<ambience-scopes-view .hass=${this.hass}></ambience-scopes-view>`:l`<ambience-settings-view .hass=${this.hass}></ambience-settings-view>`}
    `}};u([m({attribute:!1})],lt.prototype,"hass",2),u([g()],lt.prototype,"_view",2);Vr("ambience-frontend",lt);export{lt as AmbienceFrontend};
