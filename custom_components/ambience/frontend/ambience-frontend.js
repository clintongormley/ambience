/* Ambience — bundled output. Do not edit by hand. */
var ol=Object.defineProperty;var ll=Object.getOwnPropertyDescriptor;var c=(t,n,e,i)=>{for(var r=i>1?void 0:i?ll(n,e):n,a=t.length-1,s;a>=0;a--)(s=t[a])&&(r=(i?s(n,e,r):s(r))||r);return i&&r&&ol(n,e,r),r};var fi=globalThis,vi=fi.ShadowRoot&&(fi.ShadyCSS===void 0||fi.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,In=Symbol(),Fr=new WeakMap,Ht=class{constructor(n,e,i){if(this._$cssResult$=!0,i!==In)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(vi&&n===void 0){let i=e!==void 0&&e.length===1;i&&(n=Fr.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&Fr.set(e,n))}return n}toString(){return this.cssText}},jr=t=>new Ht(typeof t=="string"?t:t+"",void 0,In),y=(t,...n)=>{let e=t.length===1?t[0]:n.reduce((i,r,a)=>i+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[a+1],t[0]);return new Ht(e,t,In)},qr=(t,n)=>{if(vi)t.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let i=document.createElement("style"),r=fi.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,t.appendChild(i)}},Hn=vi?t=>t:t=>t instanceof CSSStyleSheet?(n=>{let e="";for(let i of n.cssRules)e+=i.cssText;return jr(e)})(t):t;var{is:dl,defineProperty:cl,getOwnPropertyDescriptor:ul,getOwnPropertyNames:hl,getOwnPropertySymbols:pl,getPrototypeOf:ml}=Object,yi=globalThis,Ur=yi.trustedTypes,_l=Ur?Ur.emptyScript:"",gl=yi.reactiveElementPolyfillSupport,Nt=(t,n)=>t,zt={toAttribute(t,n){switch(n){case Boolean:t=t?_l:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,n){let e=t;switch(n){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},bi=(t,n)=>!dl(t,n),Wr={attribute:!0,type:String,converter:zt,reflect:!1,useDefault:!1,hasChanged:bi};Symbol.metadata??=Symbol("metadata"),yi.litPropertyMetadata??=new WeakMap;var ke=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Wr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(n,i,e);r!==void 0&&cl(this.prototype,n,r)}}static getPropertyDescriptor(n,e,i){let{get:r,set:a}=ul(this.prototype,n)??{get(){return this[e]},set(s){this[e]=s}};return{get:r,set(s){let d=r?.call(this);a?.call(this,s),this.requestUpdate(n,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Wr}static _$Ei(){if(this.hasOwnProperty(Nt("elementProperties")))return;let n=ml(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Nt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Nt("properties"))){let e=this.properties,i=[...hl(e),...pl(e)];for(let r of i)this.createProperty(r,e[r])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let r of i)e.unshift(Hn(r))}else n!==void 0&&e.push(Hn(n));return e}static _$Eu(n,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return qr(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,i){this._$AK(n,i)}_$ET(n,e){let i=this.constructor.elementProperties.get(n),r=this.constructor._$Eu(n,i);if(r!==void 0&&i.reflect===!0){let a=(i.converter?.toAttribute!==void 0?i.converter:zt).toAttribute(e,i.type);this._$Em=n,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(n,e){let i=this.constructor,r=i._$Eh.get(n);if(r!==void 0&&this._$Em!==r){let a=i.getPropertyOptions(r),s=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:zt;this._$Em=r;let d=s.fromAttribute(e,a.type);this[r]=d??this._$Ej?.get(r)??d,this._$Em=null}}requestUpdate(n,e,i,r=!1,a){if(n!==void 0){let s=this.constructor;if(r===!1&&(a=this[n]),i??=s.getPropertyOptions(n),!((i.hasChanged??bi)(a,e)||i.useDefault&&i.reflect&&a===this._$Ej?.get(n)&&!this.hasAttribute(s._$Eu(n,i))))return;this.C(n,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:i,reflect:r,wrapped:a},s){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,s??e??this[n]),a!==!0||s!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(e=void 0),this._$AL.set(n,e)),r===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,a]of i){let{wrapped:s}=a,d=this[r];s!==!0||this._$AL.has(r)||d===void 0||this.C(r,void 0,a,d)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};ke.elementStyles=[],ke.shadowRootOptions={mode:"open"},ke[Nt("elementProperties")]=new Map,ke[Nt("finalized")]=new Map,gl?.({ReactiveElement:ke}),(yi.reactiveElementVersions??=[]).push("2.1.2");var zn=globalThis,Br=t=>t,wi=zn.trustedTypes,Vr=wi?wi.createPolicy("lit-html",{createHTML:t=>t}):void 0,On="$lit$",$e=`lit$${Math.random().toFixed(9).slice(2)}$`,Mn="?"+$e,fl=`<${Mn}>`,tt=document,Mt=()=>tt.createComment(""),Ft=t=>t===null||typeof t!="object"&&typeof t!="function",Fn=Array.isArray,Zr=t=>Fn(t)||typeof t?.[Symbol.iterator]=="function",Nn=`[ 	
\f\r]`,Ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Gr=/-->/g,Kr=/>/g,Xe=RegExp(`>|${Nn}(?:([^\\s"'>=/]+)(${Nn}*=${Nn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Yr=/'/g,Qr=/"/g,Xr=/^(?:script|style|textarea|title)$/i,jn=t=>(n,...e)=>({_$litType$:t,strings:n,values:e}),l=jn(1),Hh=jn(2),Nh=jn(3),Z=Symbol.for("lit-noChange"),k=Symbol.for("lit-nothing"),Jr=new WeakMap,et=tt.createTreeWalker(tt,129);function ea(t,n){if(!Fn(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Vr!==void 0?Vr.createHTML(n):n}var ta=(t,n)=>{let e=t.length-1,i=[],r,a=n===2?"<svg>":n===3?"<math>":"",s=Ot;for(let d=0;d<e;d++){let u=t[d],h,p,_=-1,f=0;for(;f<u.length&&(s.lastIndex=f,p=s.exec(u),p!==null);)f=s.lastIndex,s===Ot?p[1]==="!--"?s=Gr:p[1]!==void 0?s=Kr:p[2]!==void 0?(Xr.test(p[2])&&(r=RegExp("</"+p[2],"g")),s=Xe):p[3]!==void 0&&(s=Xe):s===Xe?p[0]===">"?(s=r??Ot,_=-1):p[1]===void 0?_=-2:(_=s.lastIndex-p[2].length,h=p[1],s=p[3]===void 0?Xe:p[3]==='"'?Qr:Yr):s===Qr||s===Yr?s=Xe:s===Gr||s===Kr?s=Ot:(s=Xe,r=void 0);let v=s===Xe&&t[d+1].startsWith("/>")?" ":"";a+=s===Ot?u+fl:_>=0?(i.push(h),u.slice(0,_)+On+u.slice(_)+$e+v):u+$e+(_===-2?d:v)}return[ea(t,a+(t[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},jt=class t{constructor({strings:n,_$litType$:e},i){let r;this.parts=[];let a=0,s=0,d=n.length-1,u=this.parts,[h,p]=ta(n,e);if(this.el=t.createElement(h,i),et.currentNode=this.el.content,e===2||e===3){let _=this.el.content.firstChild;_.replaceWith(..._.childNodes)}for(;(r=et.nextNode())!==null&&u.length<d;){if(r.nodeType===1){if(r.hasAttributes())for(let _ of r.getAttributeNames())if(_.endsWith(On)){let f=p[s++],v=r.getAttribute(_).split($e),x=/([.?@])?(.*)/.exec(f);u.push({type:1,index:a,name:x[2],strings:v,ctor:x[1]==="."?ki:x[1]==="?"?$i:x[1]==="@"?Si:nt}),r.removeAttribute(_)}else _.startsWith($e)&&(u.push({type:6,index:a}),r.removeAttribute(_));if(Xr.test(r.tagName)){let _=r.textContent.split($e),f=_.length-1;if(f>0){r.textContent=wi?wi.emptyScript:"";for(let v=0;v<f;v++)r.append(_[v],Mt()),et.nextNode(),u.push({type:2,index:++a});r.append(_[f],Mt())}}}else if(r.nodeType===8)if(r.data===Mn)u.push({type:2,index:a});else{let _=-1;for(;(_=r.data.indexOf($e,_+1))!==-1;)u.push({type:7,index:a}),_+=$e.length-1}a++}}static createElement(n,e){let i=tt.createElement("template");return i.innerHTML=n,i}};function it(t,n,e=t,i){if(n===Z)return n;let r=i!==void 0?e._$Co?.[i]:e._$Cl,a=Ft(n)?void 0:n._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),a===void 0?r=void 0:(r=new a(t),r._$AT(t,e,i)),i!==void 0?(e._$Co??=[])[i]=r:e._$Cl=r),r!==void 0&&(n=it(t,r._$AS(t,n.values),r,i)),n}var xi=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:i}=this._$AD,r=(n?.creationScope??tt).importNode(e,!0);et.currentNode=r;let a=et.nextNode(),s=0,d=0,u=i[0];for(;u!==void 0;){if(s===u.index){let h;u.type===2?h=new _t(a,a.nextSibling,this,n):u.type===1?h=new u.ctor(a,u.name,u.strings,this,n):u.type===6&&(h=new Ci(a,this,n)),this._$AV.push(h),u=i[++d]}s!==u?.index&&(a=et.nextNode(),s++)}return et.currentNode=tt,r}p(n){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,e),e+=i.strings.length-2):i._$AI(n[e])),e++}},_t=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,i,r){this.type=2,this._$AH=k,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=it(this,n,e),Ft(n)?n===k||n==null||n===""?(this._$AH!==k&&this._$AR(),this._$AH=k):n!==this._$AH&&n!==Z&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Zr(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==k&&Ft(this._$AH)?this._$AA.nextSibling.data=n:this.T(tt.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:i}=n,r=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=jt.createElement(ea(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{let a=new xi(r,this),s=a.u(this.options);a.p(e),this.T(s),this._$AH=a}}_$AC(n){let e=Jr.get(n.strings);return e===void 0&&Jr.set(n.strings,e=new jt(n)),e}k(n){Fn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,r=0;for(let a of n)r===e.length?e.push(i=new t(this.O(Mt()),this.O(Mt()),this,this.options)):i=e[r],i._$AI(a),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let i=Br(n).nextSibling;Br(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},nt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,i,r,a){this.type=1,this._$AH=k,this._$AN=void 0,this.element=n,this.name=e,this._$AM=r,this.options=a,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=k}_$AI(n,e=this,i,r){let a=this.strings,s=!1;if(a===void 0)n=it(this,n,e,0),s=!Ft(n)||n!==this._$AH&&n!==Z,s&&(this._$AH=n);else{let d=n,u,h;for(n=a[0],u=0;u<a.length-1;u++)h=it(this,d[i+u],e,u),h===Z&&(h=this._$AH[u]),s||=!Ft(h)||h!==this._$AH[u],h===k?n=k:n!==k&&(n+=(h??"")+a[u+1]),this._$AH[u]=h}s&&!r&&this.j(n)}j(n){n===k?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},ki=class extends nt{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===k?void 0:n}},$i=class extends nt{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==k)}},Si=class extends nt{constructor(n,e,i,r,a){super(n,e,i,r,a),this.type=5}_$AI(n,e=this){if((n=it(this,n,e,0)??k)===Z)return;let i=this._$AH,r=n===k&&i!==k||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,a=n!==k&&(i===k||r);r&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Ci=class{constructor(n,e,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){it(this,n)}},ia={M:On,P:$e,A:Mn,C:1,L:ta,R:xi,D:Zr,V:it,I:_t,H:nt,N:$i,U:Si,B:ki,F:Ci},vl=zn.litHtmlPolyfillSupport;vl?.(jt,_t),(zn.litHtmlVersions??=[]).push("3.3.2");var na=(t,n,e)=>{let i=e?.renderBefore??n,r=i._$litPart$;if(r===void 0){let a=e?.renderBefore??null;i._$litPart$=r=new _t(n.insertBefore(Mt(),a),a,void 0,e??{})}return r._$AI(t),r};var qn=globalThis,b=class extends ke{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=na(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Z}};b._$litElement$=!0,b.finalized=!0,qn.litElementHydrateSupport?.({LitElement:b});var yl=qn.litElementPolyfillSupport;yl?.({LitElement:b});(qn.litElementVersions??=[]).push("4.2.2");var w=t=>(n,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(t,n)}):customElements.define(t,n)};var bl={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:bi},wl=(t=bl,n,e)=>{let{kind:i,metadata:r}=e,a=globalThis.litPropertyMetadata.get(r);if(a===void 0&&globalThis.litPropertyMetadata.set(r,a=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),a.set(e.name,t),i==="accessor"){let{name:s}=e;return{set(d){let u=n.get.call(this);n.set.call(this,d),this.requestUpdate(s,u,t,!0,d)},init(d){return d!==void 0&&this.C(s,void 0,t,d),d}}}if(i==="setter"){let{name:s}=e;return function(d){let u=this[s];n.call(this,d),this.requestUpdate(s,u,t,!0,d)}}throw Error("Unsupported decorator location: "+i)};function m(t){return(n,e)=>typeof e=="object"?wl(t,n,e):((i,r,a)=>{let s=r.hasOwnProperty(a);return r.constructor.createProperty(a,i),s?Object.getOwnPropertyDescriptor(r,a):void 0})(t,n,e)}function g(t){return m({...t,state:!0,attribute:!1})}function Ai(t,n){try{customElements.define(t,n)}catch{}}var xl=["ha-input","ha-textfield","ha-form"],kl=["ha-input","ha-textfield"];function ra(){for(let t of kl)if(customElements.get(t))return t;return null}function ie(t){let n=new WeakRef(t);for(let e of xl)customElements.get(e)||customElements.whenDefined(e).then(()=>n.deref()?.requestUpdate())}var gt={en:{time_of_day_period:{dawn:"Dawn",morning:"Morning",afternoon:"Afternoon",evening:"Evening",nighttime:"Nighttime",daytime:"Daytime"},weekday:{mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",sun:"Sun"},day_item:{weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"},lux_range:{dark:"Dark",dim:"Dim",normal:"Normal",bright:"Bright",very_bright:"Very bright"},category_color:{red:"Red",pink:"Pink",purple:"Purple","deep-purple":"Deep purple",indigo:"Indigo",blue:"Blue","light-blue":"Light blue",cyan:"Cyan",teal:"Teal",green:"Green","light-green":"Light green",lime:"Lime",yellow:"Yellow",amber:"Amber",orange:"Orange","deep-orange":"Deep orange",brown:"Brown",grey:"Grey","blue-grey":"Blue grey"},condition:{time_of_day:"Time of day",state:"Entity state",script:"Script",sun:"Sun",template:"Template",lux:"Lux",unavailable:"Unavailable"},action:{},anchor:{dawn:"Dawn",sunrise:"Sunrise",noon:"Noon",sunset:"Sunset",dusk:"Dusk",midnight:"Midnight"},ui:{language_request:{message:"Your Home Assistant language is {language}, but {product} isn't translated into it yet.",action:"Request a translation \u2192",dismiss:"Dismiss"},panel_title:"Ambience",card_load_failed:"Ambience card failed to load \u2014 check the connection and refresh.",tab_settings:"Settings",settings_tab_ambience:"Advanced",settings_tab_conditions:"Conditions",settings_tab_actions:"Actions",settings_ambience_pause_card:"Scope-level pause switch",help_pause_switch:"Ambience creates a switch entity for every enabled area, floor, and house scope. Turning a scope's switch off pauses Ambience for that scope.",settings_tab_import:"AI",import_title:"Author & fix scenes with AI",import_beta:"Beta",import_mcp_title:"Author live with the MCP server",import_mcp_desc:"Install the MCP server for the fastest authoring and editing experience with Claude Code or Claude Desktop.",import_mcp_link:"Set up the MCP server",import_mcp_recommended:"Recommended",import_paste_title:"Alternatively, download and paste into any AI",import_help_link:"Install & usage guide",import_step1:"Install the skill or plugin once",import_step1_desc:"Add the Ambience AI pack to your AI to teach it about Ambience.",import_step2:"Download your AI bundle",import_step2_desc:"The bundle contains a snapshot of your areas, entities and exposed actions (location data redacted) for the AI to author against. Upload it to the AI with your request.",import_step3:"Upload the result",import_step3_desc:"Upload the YAML or JSON file the AI gives you. It will show you a preview before any changes are made, and you can always revert them with the Undo button.",import_download_bundle:"Download AI bundle",import_target:"Target",import_new_category:"New category to create",import_unknown_categories:"Unknown categories (create them first)",import_adds:"Add",import_updates:"Update",import_removes:"Remove",import_confirm:"Import",import_done:"Imported successfully.",import_feedback_title:"Can you do better than the AI?",import_feedback_body:"If the AI gives you bad advice, share its suggestion, your corrected version, and a short note on what was wrong \u2014 it's used to improve the cookbook the AI learns from.",import_feedback_link:"Report it on GitHub",settings_ambience_field_name:"Switch name",settings_ambience_field_pause:"Pause for",settings_reapply_enable_label:"Re-run all scenes after inactivity",settings_reapply_interval_label:"Re-run after",apply_on_every_match:"Apply on every match",help_apply_on_every_match:"When on, Ambience re-applies this scene's actions every time it wins its scope/category, not just the first time it becomes the active scene.",unit_minutes:"minutes",help:"Help",open_documentation:"Open documentation",read_documentation:"Read more",help_switch_name:"The name used for the per-scope pause switch entities.",help_pause_for:"When a scope's switch is turned off, auto-resume after this many minutes. 0 = stays paused until turned back on.",help_reapply_toggle:"Re-run the scenes for a scope/category after inactivity and re-apply the winning scene, in case any action had previously failed, such as a light not turning off.",help_reapply_after:"Re-run scenes that haven't been updated for this many minutes.",settings_expose_group:"Expose to voice assistants",settings_expose_assist:"Assist",settings_expose_google:"Google Assistant",settings_expose_alexa:"Alexa",help_expose:"Expose the per-scope pause switches to the selected voice assistants so you can pause/resume Ambience by voice. Google Assistant and Alexa require Home Assistant Cloud or a manual setup.",help_actions_tab:"Actions are the service calls a scene runs. Define them here so scenes can reuse them.",help_show_in_scene_editor:"Show this field in the scene editor so each scene can set it. Leave off to send a fixed default instead.",help_set_default:"A value sent automatically when the action runs. Scenes can override it if the field is also shown in the editor.",help_conditions_tab:"Conditions are the inputs scenes match on (time of day, presence, weather, \u2026). A scene wins when all its conditions pass.",help_categories_tab:"Categories let one scope have several independent winners at once \u2014 one scene wins per category.",no_areas:"No areas found in Home Assistant.",not_configured:"not configured",scene_singular:"scene",scene_plural:"scenes",all_categories:"All categories",add_category:"Add category\u2026",loading:"Loading\u2026",any_placeholder:"(any)",include:"Include",exclude:"Exclude",empty_all_days:"(empty \u2192 all days)",add_include_item:"+ Add include item",add_exclude_item:"+ Add exclude item",from:"from",to:"to",remove:"Remove",day_of_month_placeholder:"e.g. 1-10, 15",workday_sensor:"Workday sensor",workday_calendar:"Workday calendar",periods_heading:"Periods",badge_builtin:"builtin",badge_custom:"custom",add_custom_period:"+ Add custom period",lux_heading:"Lux ranges",add_custom_lux_range:"+ Add custom lux range",lux_modal_add_title:"Add custom lux range",lux_modal_edit_title:'Edit "{name}"',lux_min_label:"Min (lx)",lux_max_label:"Max (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"is",occupancy_is_not:"is not",lux_any:"Any of",lux_all:"All of",lux_is:"is",lux_is_not:"is not",title_edit:"Edit",title_delete:"Delete",new_scene:"New scene",new_scene_default:"New scene",name_optional:"Name (optional)",category:"Category",scope:"Scope",when_heading:"When",actions_heading:"Actions",target:"Target",remove_action:"Remove action",add_action:"+ Add action\u2026",remove_condition:"Remove condition",add_condition:"+ Add condition\u2026",add_description:"+ Add description",description:"Description",add_action_button:"Add action",cancel:"Cancel",save:"Save",save_scene:"Save scene",at_least_one_target:"At least one target is required.",condition_error:"Fix the error in this condition before continuing",no_scenes_yet:"No scenes yet.",add_scene:"+ Add scene",summary_any:"any",summary_any_paren:"(any)",summary_always:"Always",no_targets:"(no targets)",action_singular:"action",action_plural:"actions",scene_n:"Scene {n}",drag_to_reorder:"Drag to reorder",unpin:"Unpin (return to automatic order)",enable_scene:"Enable scene",disable_scene:"Disable scene",shadowed:"Never fires \u2014 shadowed by an earlier scene.",problem_missing:"Missing or disabled in Home Assistant:",problem_overlap:"Controlled by multiple groups:",problem_config:"Configuration problems:",problems_count:"{n} scene(s) have problems",badge_needs_workday_sensor:"needs a workday sensor",badge_needs_workday_calendar:"needs a workday calendar",badge_needs_weather_entity:"needs a weather entity",badge_missing_weather_group:"missing weather group {id}",badge_missing_period:"missing period {id}",badge_missing_lux_range:"missing lux range {id}",badge_unexposed_action:"action {id} not exposed",edit:"Edit",duplicate:"Duplicate",run_actions:"Run actions",run:"Run",auto_triggers_section:"Auto-triggers",auto_triggers_none:"No automatic triggers.",auto_triggers_opaque_note:"A script scene is opaque \u2014 some watches may be missing. Declare them in the scene's Triggers field.",auto_trigger_group_time:"Time",auto_trigger_group_sun:"Sun",auto_trigger_group_domain:"People list",auto_trigger_domain_membership:"{domains} added or removed",auto_trigger_date_rollover:"Local midnight (date rollover)",auto_trigger_periodic:"periodic re-check",more_actions:"More actions",scene_actions:"Scene actions",error_enter_name:"Please enter a name.",error_start_letter:"Name must start with a letter.",error_name_exists:"An entry with this name already exists. Choose a different name.",period_modal_add_title:"Add custom period",period_modal_edit_title:'Edit "{name}"',name:"Name",name_placeholder:"e.g. Wind down",lux_name_placeholder:"e.g. Gloomy",lux_error_need_bound:"Enter a min, a max, or both.",lux_error_negative:"Bounds must be 0 or greater.",lux_error_order:"Min must be less than max.",lux_error_not_integer:"Bounds must be whole numbers.",from_label:"From",to_label:"To",any_time:"Any time",custom_range:"Custom range",custom_suffix:" (custom)",add_time_range:"+ add another time range",endpoint_time:"Time",endpoint_sun:"Sun",offset_placeholder:"Offset",clamp_none:"\u2014",clamp_not_before:"not before",clamp_not_after:"not after",unit_hour:"hour",unit_hours:"hours",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"No matching entities in this area.",field_kind:"Kind",field_days_of_month:"Days of month",field_month:"Month",field_day:"Day",field_from_month:"From month",field_from_day:"From day",field_to_month:"To month",field_to_day:"To day",day_spec_error:"Use days 1\u201331 and ranges like 1-10, separated by commas",title_override:"Override",thresholds:"Thresholds",add_threshold:"+ Add threshold",weather_entity:"Weather entity",groups:"Groups",add_group:"+ Add group",sun:{elevation:"Elevation",azimuth:"Azimuth",any:"Any",above:"Above",below:"Below",between:"Between",custom_range:"Custom range"},arguments:"Arguments",form:"Form",script:"Script",yaml:"YAML",settings_tab_categories:"Categories",category_add:"+ Add category",category_name_placeholder:"Category name",category_icon:"Icon",category_color:"Colour",category_name_blank_error:"Category names can't be empty.",category_name_duplicate_error:"Two categories can't have the same name.",category_delete_blocked_last:"You can't delete the last category.",category_delete_blocked_in_use:"This category still has scenes \u2014 move or delete them first.",category_edit_title:"Edit category",category_add_title:"Add category",category_color_none:"No colour",category_save:"Save",view_traces:"View traces",pause_scope:"Pause this scope",resume_scope:"Resume now",close:"Close",pick_service:"Pick a service",retry:"Retry",action_label_placeholder:"Label (optional)",action_no_parameters:"This action has no configurable fields.",actions_field_help_show:"Tick a checkbox to make a field editable per scene.",actions_field_help_default:"Set a default to pre-fill it.",clear_default:"Clear default",set_default:"Set default",default_prefix:"Default: ",editing:"Editing\u2026",show_in_scene_editor:"Show in scene editor",extra_fields_prefix:"Extra fields:",extra_fields_hint:"These fields aren't currently exposed but will still be sent.",service_has_no_fields:"This service has no fields.",service_unavailable:"Service not available in this HA instance.",action_unavailable:"Action no longer available; configure it in Settings \u2192 Actions or remove this action.",raw_config_action:"Action",raw_config_targets:"Targets",raw_config_params:"Parameters",occupancy_any:"Any of",occupancy_all:"All of",occupancy_detected:"Detected",occupancy_clear:"Clear",occupancy_for:"for",day_pick_weekday:"Pick at least one day of the week.",state_sentinel:"State",invalid_datetime:"Enter a valid date and time.",simulate_title:"Simulate",simulate_when_hint:"drives sun, time-of-day, weekday & workday",simulate_sun_resolved:"\u2192 {time}",simulate_sun_undefined:"no {anchor} on this date",simulate_sun_unresolved:"This sun time can't be resolved for the selected date.",simulate_inputs_heading:"Inputs this category depends on",simulate_button:"Simulate",reset_to_now:"Reset to now",reset_to_live:"Reset to live",true_label:"True",false_label:"False",for_at_least:"at least",for_less_than:"less than",for_label:"For",duration_held_hint:"How long it has held this state (h:m:s)",away:"Away",home:"Home",refresh:"Refresh",new_traces_refresh:"New traces \u2014 refresh",clear_traces:"Clear",download_diagnostics:"Download diagnostics",no_traces_yet:"No traces for this category yet.",yaml_expect_object:"Expected an object",yaml_script_string:"`script` must be a 'script.<name>' string",yaml_args_object:"`args` must be an object if present",yaml_triggers_list:"`triggers` must be a list of entity_id strings if present",template_result:"Result",template_truthy:"true \u2014 matches",template_falsy:"false \u2014 no match",conditions_hint_body:"Configure Workday and Weather in Conditions to use them in your scene conditions.",conditions_hint_body_weather:"Configure Weather in Conditions to use it in your scene conditions.",conditions_hint_body_workday:"Configure Workday in Conditions to use it in your scene conditions.",conditions_hint_cta:"Configure conditions",conditions_hint_title:"Optional: set up Workday & Weather",conditions_hint_title_weather:"Optional: set up Weather",conditions_hint_title_workday:"Optional: set up Workday",dismiss:"Dismiss",fado_notice_title:"Recommended: install Fado Light Fader",fado_notice_body:"Fado adds smooth light fading for brightness, color, and color temperature \u2014 with automatic brightness restoration, UI autoconfiguration, and native transitions. It's in the Home Assistant Marketplace, and in HACS on older versions.",fado_notice_cta:"Install Fado",for_prefix:"for",name_duplicate:"A scene with this name already exists in this category.",no_exposed_actions:"Add services in Settings \u2192 Actions.",people_for:"for",people_is_at:"Is at",people_is_at_static:"is at",people_is_not_at:"Is not at",people_mode_all:"All of:",people_mode_any:"Any of:",people_mode_anybody:"Anybody",people_mode_everybody:"Everybody",people_mode_nobody:"Nobody",people_mode_none:"None of:",people_none_tracked:"No people tracked",people_select_one:"Select at least one person",unavailable_select_one:"Select at least one entity",people_where_home:"Home",scope_house:"House",history_nothing_to_undo:"Nothing to undo",history_nothing_to_redo:"Nothing to redo",history_undo_tooltip:"Undo: {change}",history_redo_tooltip:"Redo: {change}",history_untitled:"Untitled",history_action_add:'Added scene "{scene}" in {scope}',history_action_edit:'Edited scene "{scene}" in {scope}',history_action_delete:'Deleted scene "{scene}" in {scope}',history_action_reorder:"Reordered scenes in {scope}",history_action_unpin:'Unpinned scene "{scene}" in {scope}',history_action_toggle:'Toggled scene "{scene}" in {scope}',history_conflict_body:"Another tab changed the scenes in this scope while you were editing.",history_conflict_overwrite:"Overwrite theirs",history_conflict_load:"Load theirs",script_triggers:"Triggers",script_triggers_help:"Re-evaluate this scene when these entities change. A script is opaque, so templated references may be missed \u2014 add any it depends on.",script_triggers_none:"No triggers",simulate:"Simulate",state_add_condition:"Add clause",state_add_first:"Add clause",state_add_value:"+ Add state",state_attribute_placeholder:"leave blank to compare state",state_entity:"Entity",state_err_entity:"Entity is required",state_err_incomplete:"This condition is incomplete",state_err_numeric:"Value must be a number",state_err_state:"State is required",state_err_value:"Value is required",state_for:"For (optional)",state_new_condition:"(new condition)",state_not_toggle:"Negate (NOT)",state_op_header:"Comparison",state_unwrap_group:"Remove these parens (promote children to parent)",state_value_label:"Value",state_where:"Where",state_wrap:"Wrap in group",state_wrap_group:"Wrap these clauses in parentheses",show_more_info:"Show more info",cause_has_time:"Periodic time check",cause_switch:"Switch turned on",cause_manual:"Manual apply",cause_startup:"Startup",cause_reloaded:"Reloaded",cause_simulated:"Simulation",cause_clock:"Time of day",cause_sun:"Sun position",cause_reapply:"Re-run",cause_duration_for:"for",outcome_label_acted:"applied",outcome_label_no_op:"blocked",outcome_label_debounced:"unchanged",outcome_label_no_match:"no match",outcome_label_skipped:"skipped",count_action_one:"{n} action",count_action_other:"{n} actions",count_entity_one:"{n} entity",count_entity_other:"{n} entities",count_target_one:"{n} target",count_target_other:"{n} targets",count_domain_target_one:"{n} {domain}",count_domain_target_other:"{n} {domain}s",winner_default:"The matching scene",outcome_summary_acted_all_skipped:"{winner} matched \u2014 {skipped_phrase} skipped (not exposed); nothing applied.",outcome_summary_acted_entities:"Applied {winner} \u2014 {acts} on {entities}.{tail}",outcome_summary_acted:"Applied {winner} \u2014 {acts}.{tail}",outcome_summary_skipped_tail:" ({skipped} skipped \u2014 not exposed)",outcome_summary_no_op:"{winner} matched but has no actions \u2014 it blocks lower scenes from applying. Nothing changed.",outcome_summary_debounced:"{winner} matched, but it's already applied \u2014 nothing was re-sent.",outcome_summary_no_match:"No scene matched \u2014 nothing applied.",outcome_summary_skipped_switch_off:"Skipped \u2014 the scope's pause switch is off.",outcome_summary_skipped_scope_disabled:"Skipped \u2014 the scope is disabled.",outcome_summary_skipped_unavailable:"Skipped \u2014 the triggering entity went unavailable; devices left as they are.",section_scene_evaluation:"Scene evaluation",section_actions_taken:"Actions taken",trigger_prefix:"Trigger: ",trace_won_prefix:"Won: ",skipped_not_exposed:" \u2014 skipped (not exposed)",trace_scene_prefix:"Scene #",trace_scene_disabled:"disabled",trace_scene_not_reached:"not reached",trace_scene_matched:"\u2713 matched",trace_scene_no_match:"\u2717 no match",scene_live:"Live now \u2014 this scene currently matches and is applied",scene_applied_stale:"Still applied \u2014 this scene's actions are in effect but it no longer matches",version_update:{message:"Ambience {version} has been installed \u2014 reload to update.",reload:"Reload"}},blocker_summary:{block:"Block",block_mid:"block",until:"until",while:"while",while_lead:"While",or:"or",and:"and",always:"always"},day_summary:{any:"any",any_day:"any day",except:"except",day_prefix:"day",last_day:"last day",workday:"workday",holiday:"holiday",first_workday:"first workday",last_workday:"last workday",date:"{month} {day}"},people_summary:{home:"Home",is_at:"is at",is_not_at:"is not at"},occupancy_summary:{clear:"clear",detected:"detected"},unavailable_summary:{unavailable:"unavailable"},condition_summary:{is:"is",are:"are",not:"not",any_of:"Any of",all_of:"All of"},compass:{N:"N",NE:"NE",E:"E",SE:"SE",S:"S",SW:"SW",W:"W",NW:"NW"},month:{1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"},weather_condition:{"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"},weather_attr:{temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"},state_op:{is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"},trace_reason:{day_workday_sensor_unconfigured:"workday sensor not configured",day_workday_calendar_unconfigured:"workday calendar not configured",lux_range_missing:"lux range {range} no longer exists",lux_sensor_not_numeric:"{name} ({value}) does not report a number",period_missing:"time-of-day period {period} no longer exists",sun_not_configured:"the sun integration is not set up",sun_anchor_undefined:"{anchor} is undefined at this location today",weather_entity_unconfigured:"weather entity not configured",weather_group_missing:"weather group {group} no longer exists"},trace_detail:{not_found:"not found",unavailable:"unavailable",all_of:"all of:",any_of:"any of:",negate:"not",any_sensor:"any sensor (no constraint)",for_hold:"for {rel}{dur}",held:"held {dur}",not_held:"not held",no_people_tracked:"no people tracked",summary_home:"{n} of {total} home ({names})",summary_home_zero:"0 of {total} home",want:"want",quant_anyone:"anyone",quant_everyone:"everyone",quant_nobody:"nobody",where_home:"home",where_not_home:"not home",where_in:"in {zone}",where_not_in:"not in {zone}",loc_home:"home",loc_away:"away",loc_in:"in {zone}",loc_not_in:"not in {zone}",no_occupancy_sensors:"no occupancy sensors",summary_active:"{n} of {total} active ({names})",summary_active_zero:"0 of {total} active",no_lux_sensors:"no lux sensors",no_lux_readings:"no lux readings",unknown_range:"unknown lux range: {range}",want_band:"want {band}",is:"is {values}",is_not:"is not {values}",no_entities:"no entities",unavailable_any:"any unavailable",summary_unavailable:"{n} of {total} unavailable ({names})",summary_unavailable_zero:"0 of {total} unavailable",sun_prefix:"Sun",sun_elevation:"{deg}\xB0 elevation",sun_azimuth:"{deg}\xB0 azimuth ({sector})"}},es:{time_of_day_period:{dawn:"Amanecer",morning:"Ma\xF1ana",afternoon:"Tarde",evening:"Atardecer",nighttime:"Noche",daytime:"D\xEDa"},weekday:{mon:"Lun",tue:"Mar",wed:"Mi\xE9",thu:"Jue",fri:"Vie",sat:"S\xE1b",sun:"Dom"},day_item:{weekday:"D\xEDa de la semana",day_of_month:"D\xEDa del mes",date:"Fecha (anual)",date_range:"Rango de fechas (anual)",last_day:"\xDAltimo d\xEDa del mes",workday:"D\xEDa laborable",holiday:"Festivo",first_workday:"Primer d\xEDa laborable del mes",last_workday:"\xDAltimo d\xEDa laborable del mes"},lux_range:{dark:"Oscuro",dim:"Tenue",normal:"Normal",bright:"Brillante",very_bright:"Muy brillante"},category_color:{red:"Rojo",pink:"Rosa",purple:"Morado","deep-purple":"Morado oscuro",indigo:"\xCDndigo",blue:"Azul","light-blue":"Azul claro",cyan:"Cian",teal:"Verde azulado",green:"Verde","light-green":"Verde claro",lime:"Lima",yellow:"Amarillo",amber:"\xC1mbar",orange:"Naranja","deep-orange":"Naranja oscuro",brown:"Marr\xF3n",grey:"Gris","blue-grey":"Gris azulado"},condition:{time_of_day:"Hora del d\xEDa",state:"Estado de entidad",script:"Script",sun:"Sol",template:"Plantilla",lux:"Lux",unavailable:"No disponible"},action:{},anchor:{dawn:"Amanecer",sunrise:"Salida del sol",noon:"Mediod\xEDa",sunset:"Puesta del sol",dusk:"Crep\xFAsculo",midnight:"Medianoche"},ui:{language_request:{message:"El idioma de tu Home Assistant es {language}, pero {product} a\xFAn no est\xE1 traducido a ese idioma.",action:"Solicitar una traducci\xF3n \u2192",dismiss:"Descartar"},panel_title:"Ambience",card_load_failed:"No se pudo cargar la tarjeta Ambience \u2014 comprueba la conexi\xF3n y actualiza.",tab_settings:"Ajustes",settings_tab_ambience:"Avanzado",settings_tab_conditions:"Condiciones",settings_tab_actions:"Acciones",settings_ambience_pause_card:"Interruptor de pausa por \xE1mbito",help_pause_switch:"Ambience crea una entidad de interruptor para cada \xE1mbito de \xE1rea, planta y casa habilitado. Apagar el interruptor de un \xE1mbito pausa Ambience para ese \xE1mbito.",settings_tab_import:"IA",import_title:"Crea y arregla escenas con IA",import_beta:"Beta",import_mcp_title:"Crea escenas en vivo con el servidor MCP",import_mcp_desc:"Instala el servidor MCP para la forma m\xE1s r\xE1pida de crear y editar escenas, con Claude Code o Claude Desktop.",import_mcp_link:"Configura el servidor MCP",import_mcp_recommended:"Recomendado",import_paste_title:"Como alternativa, descarga y pega en cualquier IA",import_help_link:"Gu\xEDa de instalaci\xF3n y uso",import_step1:"Instala la skill o el plugin una vez",import_step1_desc:"A\xF1ade el paquete de IA de Ambience a tu IA para ense\xF1arle sobre Ambience.",import_step2:"Descarga tu paquete de IA",import_step2_desc:"El paquete contiene una instant\xE1nea de tus \xE1reas, entidades y acciones expuestas (datos de ubicaci\xF3n redactados) para que la IA cree sobre ellos. S\xFAbelo a la IA junto con tu petici\xF3n.",import_step3:"Sube el resultado",import_step3_desc:"Sube el archivo YAML o JSON que te d\xE9 la IA. Te mostrar\xE1 una vista previa antes de hacer cambios, y siempre puedes revertirlos con el bot\xF3n Deshacer.",import_download_bundle:"Descargar paquete de IA",import_target:"Destino",import_new_category:"Nueva categor\xEDa a crear",import_unknown_categories:"Categor\xEDas desconocidas (cr\xE9alas primero)",import_adds:"A\xF1adir",import_updates:"Actualizar",import_removes:"Eliminar",import_confirm:"Importar",import_done:"Importado correctamente.",import_feedback_title:"\xBFPuedes hacerlo mejor que la IA?",import_feedback_body:"Si la IA te da malos consejos, comparte su sugerencia, tu versi\xF3n corregida y una nota breve sobre qu\xE9 estaba mal \u2014 se usa para mejorar el recetario del que aprende la IA.",import_feedback_link:"Rep\xF3rtalo en GitHub",settings_ambience_field_name:"Nombre del interruptor",settings_ambience_field_pause:"Pausar durante",settings_reapply_enable_label:"Volver a ejecutar todas las escenas tras inactividad",settings_reapply_interval_label:"Volver a ejecutar despu\xE9s de",apply_on_every_match:"Aplicar en cada coincidencia",help_apply_on_every_match:"Cuando est\xE1 activado, Ambience vuelve a aplicar las acciones de esta escena cada vez que gana su \xE1mbito/categor\xEDa, no solo la primera vez que se activa.",unit_minutes:"minutos",help:"Ayuda",open_documentation:"Abrir documentaci\xF3n",read_documentation:"M\xE1s informaci\xF3n",help_switch_name:"El nombre utilizado para las entidades de interruptor de pausa por \xE1mbito.",help_pause_for:"Cuando se apaga el interruptor de un \xE1mbito, se reanuda autom\xE1ticamente tras este n\xFAmero de minutos. 0 = permanece pausado hasta que se vuelva a encender.",help_reapply_toggle:"Vuelve a ejecutar las escenas de un \xE1mbito/categor\xEDa tras la inactividad y vuelve a aplicar la escena ganadora, por si alguna acci\xF3n hab\xEDa fallado anteriormente, como una luz que no se apag\xF3.",help_reapply_after:"Volver a ejecutar escenas que no se han actualizado durante este n\xFAmero de minutos.",settings_expose_group:"Exponer a asistentes de voz",settings_expose_assist:"Assist",settings_expose_google:"Google Assistant",settings_expose_alexa:"Alexa",help_expose:"Expone los interruptores de pausa por \xE1mbito a los asistentes de voz seleccionados para poder pausar/reanudar Ambience por voz. Google Assistant y Alexa requieren Home Assistant Cloud o una configuraci\xF3n manual.",help_actions_tab:"Las acciones son las llamadas de servicio que ejecuta una escena. Def\xEDnelas aqu\xED para que las escenas puedan reutilizarlas.",help_show_in_scene_editor:"Muestra este campo en el editor de escenas para que cada escena pueda configurarlo. Desact\xEDvalo para enviar un valor predeterminado fijo.",help_set_default:"Un valor enviado autom\xE1ticamente cuando se ejecuta la acci\xF3n. Las escenas pueden anularlo si el campo tambi\xE9n se muestra en el editor.",help_conditions_tab:"Las condiciones son las entradas con las que coinciden las escenas (hora del d\xEDa, presencia, tiempo, \u2026). Una escena gana cuando todas sus condiciones se cumplen.",help_categories_tab:"Las categor\xEDas permiten que un \xE1mbito tenga varios ganadores independientes a la vez: una escena gana por categor\xEDa.",no_areas:"No se encontraron \xE1reas en Home Assistant.",not_configured:"no configurado",scene_singular:"escena",scene_plural:"escenas",all_categories:"Todas las categor\xEDas",add_category:"A\xF1adir categor\xEDa\u2026",loading:"Cargando\u2026",any_placeholder:"(cualquiera)",include:"Incluir",exclude:"Excluir",empty_all_days:"(vac\xEDo \u2192 todos los d\xEDas)",add_include_item:"+ A\xF1adir elemento incluido",add_exclude_item:"+ A\xF1adir elemento excluido",from:"desde",to:"hasta",remove:"Eliminar",day_of_month_placeholder:"p. ej. 1-10, 15",workday_sensor:"Sensor de d\xEDas laborables",workday_calendar:"Calendario de d\xEDas laborables",periods_heading:"Per\xEDodos",badge_builtin:"integrado",badge_custom:"personalizado",add_custom_period:"+ A\xF1adir per\xEDodo personalizado",lux_heading:"Rangos de lux",add_custom_lux_range:"+ A\xF1adir rango de lux personalizado",lux_modal_add_title:"A\xF1adir rango de lux personalizado",lux_modal_edit_title:'Editar "{name}"',lux_min_label:"M\xEDn (lx)",lux_max_label:"M\xE1x (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"es",occupancy_is_not:"no es",lux_any:"Cualquiera de",lux_all:"Todos de",lux_is:"es",lux_is_not:"no es",title_edit:"Editar",title_delete:"Eliminar",new_scene:"Nueva escena",new_scene_default:"Nueva escena",name_optional:"Nombre (opcional)",category:"Categor\xEDa",scope:"\xC1mbito",when_heading:"Cu\xE1ndo",actions_heading:"Acciones",target:"Objetivo",remove_action:"Eliminar acci\xF3n",add_action:"+ A\xF1adir acci\xF3n\u2026",remove_condition:"Eliminar condici\xF3n",add_condition:"+ A\xF1adir condici\xF3n\u2026",add_description:"+ A\xF1adir descripci\xF3n",description:"Descripci\xF3n",add_action_button:"A\xF1adir acci\xF3n",cancel:"Cancelar",save:"Guardar",save_scene:"Guardar escena",at_least_one_target:"Se requiere al menos un objetivo.",condition_error:"Corrige el error en esta condici\xF3n antes de continuar",no_scenes_yet:"A\xFAn no hay escenas.",add_scene:"+ A\xF1adir escena",summary_any:"cualquiera",summary_any_paren:"(cualquiera)",summary_always:"Siempre",no_targets:"(sin objetivos)",action_singular:"acci\xF3n",action_plural:"acciones",scene_n:"Escena {n}",drag_to_reorder:"Arrastrar para reordenar",unpin:"Desanclar (volver al orden autom\xE1tico)",enable_scene:"Activar escena",disable_scene:"Desactivar escena",shadowed:"Nunca se activa \u2014 eclipsada por una escena anterior.",problem_missing:"Faltante o deshabilitada en Home Assistant:",problem_overlap:"Controlado por varios grupos:",problem_config:"Problemas de configuraci\xF3n:",problems_count:"{n} escena(s) tienen problemas",badge_needs_workday_sensor:"necesita un sensor de d\xEDas laborables",badge_needs_workday_calendar:"necesita un calendario de d\xEDas laborables",badge_needs_weather_entity:"necesita una entidad meteorol\xF3gica",badge_missing_weather_group:"falta el grupo meteorol\xF3gico {id}",badge_missing_period:"falta el per\xEDodo {id}",badge_missing_lux_range:"falta el rango de lux {id}",badge_unexposed_action:"acci\xF3n {id} no expuesta",edit:"Editar",duplicate:"Duplicar",run_actions:"Ejecutar acciones",run:"Ejecutar",auto_triggers_section:"Disparadores autom\xE1ticos",auto_triggers_none:"Sin disparadores autom\xE1ticos.",auto_triggers_opaque_note:"Una escena de script es opaca \u2014 puede que falten algunas observaciones. Declara las que sean necesarias en el campo Disparadores de la escena.",auto_trigger_group_time:"Hora",auto_trigger_group_sun:"Sol",auto_trigger_group_domain:"Lista de personas",auto_trigger_domain_membership:"{domains} a\xF1adido o eliminado",auto_trigger_date_rollover:"Medianoche local (cambio de fecha)",auto_trigger_periodic:"revisi\xF3n peri\xF3dica",more_actions:"M\xE1s acciones",scene_actions:"Acciones de la escena",error_enter_name:"Por favor, introduce un nombre.",error_start_letter:"El nombre debe comenzar con una letra.",error_name_exists:"Ya existe una entrada con este nombre. Elige un nombre diferente.",period_modal_add_title:"A\xF1adir per\xEDodo personalizado",period_modal_edit_title:'Editar "{name}"',name:"Nombre",name_placeholder:"p. ej. Descanso nocturno",lux_name_placeholder:"p. ej. Sombr\xEDo",lux_error_need_bound:"Introduce un m\xEDnimo, un m\xE1ximo o ambos.",lux_error_negative:"Los l\xEDmites deben ser 0 o mayores.",lux_error_order:"El m\xEDnimo debe ser menor que el m\xE1ximo.",lux_error_not_integer:"Los l\xEDmites deben ser n\xFAmeros enteros.",from_label:"Desde",to_label:"Hasta",any_time:"Cualquier hora",custom_range:"Rango personalizado",custom_suffix:" (personalizado)",add_time_range:"+ a\xF1adir otro rango de tiempo",endpoint_time:"Hora",endpoint_sun:"Sol",offset_placeholder:"Desplazamiento",clamp_none:"\u2014",clamp_not_before:"no antes de",clamp_not_after:"no despu\xE9s de",unit_hour:"hora",unit_hours:"horas",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"No hay entidades coincidentes en esta \xE1rea.",field_kind:"Tipo",field_days_of_month:"D\xEDas del mes",field_month:"Mes",field_day:"D\xEDa",field_from_month:"Mes de inicio",field_from_day:"D\xEDa de inicio",field_to_month:"Mes de fin",field_to_day:"D\xEDa de fin",day_spec_error:"Usa d\xEDas del 1 al 31 y rangos como 1-10, separados por comas",title_override:"Anular",thresholds:"Umbrales",add_threshold:"+ A\xF1adir umbral",weather_entity:"Entidad meteorol\xF3gica",groups:"Grupos",add_group:"+ A\xF1adir grupo",sun:{elevation:"Elevaci\xF3n",azimuth:"Acimut",any:"Cualquiera",above:"Por encima",below:"Por debajo",between:"Entre",custom_range:"Rango personalizado"},arguments:"Argumentos",form:"Formulario",script:"Script",yaml:"YAML",settings_tab_categories:"Categor\xEDas",category_add:"+ A\xF1adir categor\xEDa",category_name_placeholder:"Nombre de categor\xEDa",category_icon:"Icono",category_color:"Color",category_name_blank_error:"Los nombres de categor\xEDa no pueden estar vac\xEDos.",category_name_duplicate_error:"Dos categor\xEDas no pueden tener el mismo nombre.",category_delete_blocked_last:"No puedes eliminar la \xFAltima categor\xEDa.",category_delete_blocked_in_use:"Esta categor\xEDa a\xFAn tiene escenas \u2014 mu\xE9velas o elim\xEDnalas primero.",category_edit_title:"Editar categor\xEDa",category_add_title:"A\xF1adir categor\xEDa",category_color_none:"Sin color",category_save:"Guardar",view_traces:"Ver trazas",pause_scope:"Pausar este \xE1mbito",resume_scope:"Reanudar ahora",close:"Cerrar",pick_service:"Seleccionar un servicio",retry:"Reintentar",action_label_placeholder:"Etiqueta (opcional)",action_no_parameters:"Esta acci\xF3n no tiene campos configurables.",actions_field_help_show:"Marca una casilla para hacer que un campo sea editable por escena.",actions_field_help_default:"Establece un valor predeterminado para rellenarlo previamente.",clear_default:"Borrar predeterminado",set_default:"Establecer predeterminado",default_prefix:"Predeterminado: ",editing:"Editando\u2026",show_in_scene_editor:"Mostrar en el editor de escenas",extra_fields_prefix:"Campos adicionales:",extra_fields_hint:"Estos campos no est\xE1n expuestos actualmente pero se enviar\xE1n igualmente.",service_has_no_fields:"Este servicio no tiene campos.",service_unavailable:"Servicio no disponible en esta instancia de HA.",action_unavailable:"La acci\xF3n ya no est\xE1 disponible; config\xFArala en Ajustes \u2192 Acciones o elimina esta acci\xF3n.",raw_config_action:"Acci\xF3n",raw_config_targets:"Objetivos",raw_config_params:"Par\xE1metros",occupancy_any:"Cualquiera de",occupancy_all:"Todos de",occupancy_detected:"Detectado",occupancy_clear:"Libre",occupancy_for:"durante",day_pick_weekday:"Selecciona al menos un d\xEDa de la semana.",state_sentinel:"Estado",invalid_datetime:"Introduce una fecha y hora v\xE1lidas.",simulate_title:"Simular",simulate_when_hint:"controla el sol, la hora del d\xEDa, el d\xEDa de la semana y los d\xEDas laborables",simulate_sun_resolved:"\u2192 {time}",simulate_sun_undefined:"sin {anchor} en esta fecha",simulate_sun_unresolved:"Esta hora solar no se puede resolver para la fecha seleccionada.",simulate_inputs_heading:"Entradas de las que depende esta categor\xEDa",simulate_button:"Simular",reset_to_now:"Restablecer a ahora",reset_to_live:"Restablecer a en vivo",true_label:"Verdadero",false_label:"Falso",for_at_least:"al menos",for_less_than:"menos de",for_label:"Durante",duration_held_hint:"Cu\xE1nto tiempo ha mantenido este estado (h:m:s)",away:"Fuera",home:"Casa",refresh:"Actualizar",new_traces_refresh:"Nuevas trazas \u2014 actualizar",clear_traces:"Borrar",download_diagnostics:"Descargar diagn\xF3sticos",no_traces_yet:"A\xFAn no hay trazas para esta categor\xEDa.",yaml_expect_object:"Se esperaba un objeto",yaml_script_string:"`script` debe ser una cadena 'script.<nombre>'",yaml_args_object:"`args` debe ser un objeto si est\xE1 presente",yaml_triggers_list:"`triggers` debe ser una lista de cadenas entity_id si est\xE1 presente",template_result:"Resultado",template_truthy:"verdadero \u2014 coincide",template_falsy:"falso \u2014 no coincide",conditions_hint_body:"Configura D\xEDas laborables y Tiempo en Condiciones para usarlos en las condiciones de tus escenas.",conditions_hint_body_weather:"Configura Tiempo en Condiciones para usarlo en las condiciones de tus escenas.",conditions_hint_body_workday:"Configura D\xEDas laborables en Condiciones para usarlos en las condiciones de tus escenas.",conditions_hint_cta:"Configurar condiciones",conditions_hint_title:"Opcional: configurar D\xEDas laborables y Tiempo",conditions_hint_title_weather:"Opcional: configurar Tiempo",conditions_hint_title_workday:"Opcional: configurar D\xEDas laborables",dismiss:"Descartar",fado_notice_title:"Recomendado: instalar Fado Light Fader",fado_notice_body:"Fado a\xF1ade atenuaci\xF3n suave de luces para brillo, color y temperatura de color, con restauraci\xF3n autom\xE1tica del brillo, autoconfiguraci\xF3n por interfaz y transiciones nativas. Est\xE1 en el Marketplace de Home Assistant y, en versiones anteriores, en HACS.",fado_notice_cta:"Instalar Fado",for_prefix:"durante",name_duplicate:"Ya existe una escena con este nombre en esta categor\xEDa.",no_exposed_actions:"A\xF1ade servicios en Ajustes \u2192 Acciones.",people_for:"durante",people_is_at:"Est\xE1 en",people_is_at_static:"est\xE1 en",people_is_not_at:"No est\xE1 en",people_mode_all:"Todos:",people_mode_any:"Cualquiera de:",people_mode_anybody:"Cualquiera",people_mode_everybody:"Todos",people_mode_nobody:"Nadie",people_mode_none:"Ninguno de:",people_none_tracked:"No hay personas rastreadas",people_select_one:"Selecciona al menos una persona",unavailable_select_one:"Selecciona al menos una entidad",people_where_home:"Casa",scope_house:"Casa",history_nothing_to_undo:"Nada que deshacer",history_nothing_to_redo:"Nada que rehacer",history_undo_tooltip:"Deshacer: {change}",history_redo_tooltip:"Rehacer: {change}",history_untitled:"Sin t\xEDtulo",history_action_add:'Escena "{scene}" a\xF1adida en {scope}',history_action_edit:'Escena "{scene}" editada en {scope}',history_action_delete:'Escena "{scene}" eliminada en {scope}',history_action_reorder:"Escenas reordenadas en {scope}",history_action_unpin:'Escena "{scene}" desfijada en {scope}',history_action_toggle:'Escena "{scene}" activada/desactivada en {scope}',history_conflict_body:"Otra pesta\xF1a cambi\xF3 las escenas de este \xE1mbito mientras editabas.",history_conflict_overwrite:"Sobrescribir las suyas",history_conflict_load:"Cargar las suyas",script_triggers:"Disparadores",script_triggers_help:"Reeval\xFAa esta escena cuando cambien estas entidades. Un script es opaco, por lo que pueden perderse referencias en plantillas \u2014 a\xF1ade las que dependan de \xE9l.",script_triggers_none:"Sin disparadores",simulate:"Simular",state_add_condition:"A\xF1adir cl\xE1usula",state_add_first:"A\xF1adir cl\xE1usula",state_add_value:"+ A\xF1adir estado",state_attribute_placeholder:"dejar en blanco para comparar el estado",state_entity:"Entidad",state_err_entity:"La entidad es obligatoria",state_err_incomplete:"Esta condici\xF3n est\xE1 incompleta",state_err_numeric:"El valor debe ser un n\xFAmero",state_err_state:"El estado es obligatorio",state_err_value:"El valor es obligatorio",state_for:"Durante (opcional)",state_new_condition:"(nueva condici\xF3n)",state_not_toggle:"Negar (NO)",state_op_header:"Comparaci\xF3n",state_unwrap_group:"Eliminar estos par\xE9ntesis (promover hijos al padre)",state_value_label:"Valor",state_where:"Donde",state_wrap:"Envolver en grupo",state_wrap_group:"Envolver estas cl\xE1usulas entre par\xE9ntesis",show_more_info:"Mostrar m\xE1s informaci\xF3n",cause_has_time:"Comprobaci\xF3n peri\xF3dica de hora",cause_switch:"Interruptor activado",cause_manual:"Aplicaci\xF3n manual",cause_startup:"Inicio",cause_reloaded:"Recargado",cause_simulated:"Simulaci\xF3n",cause_clock:"Hora del d\xEDa",cause_sun:"Posici\xF3n del sol",cause_reapply:"Volver a ejecutar",cause_duration_for:"durante",outcome_label_acted:"aplicado",outcome_label_no_op:"bloqueado",outcome_label_debounced:"sin cambios",outcome_label_no_match:"sin coincidencia",outcome_label_skipped:"omitido",count_action_one:"{n} acci\xF3n",count_action_other:"{n} acciones",count_entity_one:"{n} entidad",count_entity_other:"{n} entidades",count_target_one:"{n} objetivo",count_target_other:"{n} objetivos",count_domain_target_one:"{n} objetivo ({domain})",count_domain_target_other:"{n} objetivos ({domain})",winner_default:"La escena coincidente",outcome_summary_acted_all_skipped:"{winner} coincidi\xF3 \u2014 {skipped_phrase} omitido (no expuesto); nada aplicado.",outcome_summary_acted_entities:"Aplicado {winner} \u2014 {acts} en {entities}.{tail}",outcome_summary_acted:"Aplicado {winner} \u2014 {acts}.{tail}",outcome_summary_skipped_tail:" ({skipped} omitidos \u2014 no expuestos)",outcome_summary_no_op:"{winner} coincidi\xF3 pero no tiene acciones \u2014 bloquea que se apliquen escenas inferiores. Nada cambi\xF3.",outcome_summary_debounced:"{winner} coincidi\xF3, pero ya est\xE1 aplicado \u2014 no se reenvi\xF3 nada.",outcome_summary_no_match:"Ninguna escena coincidi\xF3 \u2014 nada aplicado.",outcome_summary_skipped_switch_off:"Omitido \u2014 el interruptor de pausa del \xE1mbito est\xE1 apagado.",outcome_summary_skipped_scope_disabled:"Omitido \u2014 el \xE1mbito est\xE1 desactivado.",outcome_summary_skipped_unavailable:"Omitido \u2014 la entidad que dispar\xF3 qued\xF3 no disponible; los dispositivos se dejaron como estaban.",section_scene_evaluation:"Evaluaci\xF3n de escenas",section_actions_taken:"Acciones realizadas",trigger_prefix:"Disparador: ",trace_won_prefix:"Gan\xF3: ",skipped_not_exposed:" \u2014 omitido (no expuesto)",trace_scene_prefix:"Escena n.\xBA ",trace_scene_disabled:"desactivada",trace_scene_not_reached:"no alcanzada",trace_scene_matched:"\u2713 coincide",trace_scene_no_match:"\u2717 sin coincidencia",scene_live:"Activa ahora \u2014 esta escena coincide y est\xE1 aplicada",scene_applied_stale:"Sigue aplicada \u2014 las acciones de esta escena est\xE1n en efecto pero ya no coincide",version_update:{message:"Se ha instalado Ambience {version}: recarga para actualizar.",reload:"Recargar"}},blocker_summary:{block:"Bloquear",block_mid:"bloquear",until:"hasta",while:"mientras",while_lead:"Mientras",or:"o",and:"y",always:"siempre"},day_summary:{any:"cualquiera",any_day:"cualquier d\xEDa",except:"excepto",day_prefix:"d\xEDa",last_day:"\xFAltimo d\xEDa",workday:"d\xEDa laborable",holiday:"festivo",first_workday:"primer d\xEDa laborable",last_workday:"\xFAltimo d\xEDa laborable",date:"{day} de {month}"},people_summary:{home:"casa",is_at:"est\xE1 en",is_not_at:"no est\xE1 en"},occupancy_summary:{clear:"libre",detected:"detectado"},unavailable_summary:{unavailable:"no disponible"},condition_summary:{is:"est\xE1",are:"est\xE1n",not:"no",any_of:"Cualquiera de",all_of:"Todos de"},compass:{N:"N",NE:"NE",E:"E",SE:"SE",S:"S",SW:"SO",W:"O",NW:"NO"},month:{1:"Enero",2:"Febrero",3:"Marzo",4:"Abril",5:"Mayo",6:"Junio",7:"Julio",8:"Agosto",9:"Septiembre",10:"Octubre",11:"Noviembre",12:"Diciembre"},weather_condition:{"clear-night":"Despejado (noche)",cloudy:"Nublado",fog:"Niebla",hail:"Granizo",lightning:"Tormenta el\xE9ctrica","lightning-rainy":"Tormenta con lluvia",partlycloudy:"Parcialmente nublado",pouring:"Lluvia intensa",rainy:"Lluvioso",snowy:"Nevado","snowy-rainy":"Nieve con lluvia",sunny:"Soleado",windy:"Ventoso","windy-variant":"Ventoso (variante)",exceptional:"Excepcional"},weather_attr:{temperature:"Temperatura",apparent_temperature:"Temperatura aparente",humidity:"Humedad",wind_speed:"Velocidad del viento",pressure:"Presi\xF3n"},state_op:{is:"es",is_not:"no es",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"Y",or:"O",and_not:"Y NO",or_not:"O NO",not:"NO"},trace_reason:{day_workday_sensor_unconfigured:"sensor de d\xEDa laborable no configurado",day_workday_calendar_unconfigured:"calendario de d\xEDas laborables no configurado",lux_range_missing:"el rango de lux {range} ya no existe",lux_sensor_not_numeric:"{name} ({value}) no informa un n\xFAmero",period_missing:"el periodo del d\xEDa {period} ya no existe",sun_not_configured:"la integraci\xF3n sun no est\xE1 configurada",sun_anchor_undefined:"{anchor} no est\xE1 definido hoy en esta ubicaci\xF3n",weather_entity_unconfigured:"entidad meteorol\xF3gica no configurada",weather_group_missing:"el grupo meteorol\xF3gico {group} ya no existe"},trace_detail:{not_found:"no encontrado",unavailable:"no disponible",all_of:"todos de:",any_of:"alguno de:",negate:"no",any_sensor:"cualquier sensor (sin restricci\xF3n)",for_hold:"durante {rel}{dur}",held:"mantenido {dur}",not_held:"no mantenido",no_people_tracked:"sin personas rastreadas",summary_home:"{n} de {total} en casa ({names})",summary_home_zero:"0 de {total} en casa",want:"requiere",quant_anyone:"cualquiera",quant_everyone:"todos",quant_nobody:"nadie",where_home:"en casa",where_not_home:"fuera de casa",where_in:"en {zone}",where_not_in:"fuera de {zone}",loc_home:"en casa",loc_away:"fuera",loc_in:"en {zone}",loc_not_in:"fuera de {zone}",no_occupancy_sensors:"sin sensores de ocupaci\xF3n",summary_active:"{n} de {total} activos ({names})",summary_active_zero:"0 de {total} activos",no_lux_sensors:"sin sensores de lux",no_lux_readings:"sin lecturas de lux",unknown_range:"rango de lux desconocido: {range}",want_band:"requiere {band}",is:"es {values}",is_not:"no es {values}",no_entities:"sin entidades",unavailable_any:"alguna no disponible",summary_unavailable:"{n} de {total} no disponibles ({names})",summary_unavailable_zero:"0 de {total} no disponibles",sun_prefix:"Sol",sun_elevation:"{deg}\xB0 de elevaci\xF3n",sun_azimuth:"{deg}\xB0 de azimut ({sector})"}},pt:{time_of_day_period:{dawn:"Madrugada",morning:"Manh\xE3",afternoon:"Tarde",evening:"Fim de tarde",nighttime:"Noite",daytime:"Dia"},weekday:{mon:"Seg",tue:"Ter",wed:"Qua",thu:"Qui",fri:"Sex",sat:"S\xE1b",sun:"Dom"},day_item:{weekday:"Dia da semana",day_of_month:"Dia do m\xEAs",date:"Data (anual)",date_range:"Intervalo de datas (anual)",last_day:"\xDAltimo dia do m\xEAs",workday:"Dia \xFAtil",holiday:"Feriado",first_workday:"Primeiro dia \xFAtil do m\xEAs",last_workday:"\xDAltimo dia \xFAtil do m\xEAs"},lux_range:{dark:"Escuro",dim:"Pouca luz",normal:"Normal",bright:"Claro",very_bright:"Muito claro"},category_color:{red:"Vermelho",pink:"Rosa",purple:"Roxo","deep-purple":"Roxo escuro",indigo:"\xCDndigo",blue:"Azul","light-blue":"Azul claro",cyan:"Ciano",teal:"Verde-azulado",green:"Verde","light-green":"Verde claro",lime:"Lima",yellow:"Amarelo",amber:"\xC2mbar",orange:"Laranja","deep-orange":"Laranja escuro",brown:"Castanho",grey:"Cinzento","blue-grey":"Cinzento azulado"},condition:{time_of_day:"Hora do dia",state:"Estado da entidade",script:"Script",sun:"Sol",template:"Template",lux:"Lux",unavailable:"Indispon\xEDvel"},action:{},anchor:{dawn:"Madrugada",sunrise:"Nascer do sol",noon:"Meio-dia",sunset:"P\xF4r do sol",dusk:"Anoitecer",midnight:"Meia-noite"},ui:{language_request:{message:"O idioma do seu Home Assistant \xE9 {language}, mas o {product} ainda n\xE3o est\xE1 traduzido para esse idioma.",action:"Pedir uma tradu\xE7\xE3o \u2192",dismiss:"Dispensar"},panel_title:"Ambience",card_load_failed:"N\xE3o foi poss\xEDvel carregar o cart\xE3o do Ambience \u2014 verifique a liga\xE7\xE3o e atualize.",tab_settings:"Defini\xE7\xF5es",settings_tab_ambience:"Avan\xE7ado",settings_tab_conditions:"Condi\xE7\xF5es",settings_tab_actions:"A\xE7\xF5es",settings_ambience_pause_card:"Interruptor de pausa ao n\xEDvel do \xE2mbito",help_pause_switch:"O Ambience cria uma entidade de interruptor para cada \xE2mbito de \xE1rea, piso e casa ativado. Desligar o interruptor de um \xE2mbito pausa o Ambience para esse \xE2mbito.",settings_tab_import:"IA",import_title:"Criar e corrigir cenas com IA",import_beta:"Beta",import_mcp_title:"Criar cenas ao vivo com o servidor MCP",import_mcp_desc:"Instale o servidor MCP para a forma mais r\xE1pida de criar e editar cenas, com o Claude Code ou o Claude Desktop.",import_mcp_link:"Configurar o servidor MCP",import_mcp_recommended:"Recomendado",import_paste_title:"Em alternativa, descarregue e cole em qualquer IA",import_help_link:"Guia de instala\xE7\xE3o e utiliza\xE7\xE3o",import_step1:"Instale a skill ou plugin",import_step1_desc:"Adicione o pacote de IA do Ambience \xE0 sua IA \u2014 um plugin do Claude Code, uma skill do claude.ai, ou um guia para colar em qualquer IA.",import_step2:"Transfira o seu pacote de IA",import_step2_desc:"Um instant\xE2neo das suas \xE1reas, entidades e a\xE7\xF5es expostas (dados de localiza\xE7\xE3o ocultados) para a IA usar como base. Forne\xE7a-o \xE0 IA juntamente com o seu pedido.",import_step3:"Carregue o resultado",import_step3_desc:"Carregue o ficheiro YAML ou JSON que a IA lhe der. \xC9 pr\xE9-visualizado antes de algo ser guardado.",import_download_bundle:"Transferir pacote de IA",import_target:"Alvo",import_new_category:"Nova categoria a criar",import_unknown_categories:"Categorias desconhecidas (crie-as primeiro)",import_adds:"Adicionar",import_updates:"Atualizar",import_removes:"Remover",import_confirm:"Importar",import_done:"Importado com sucesso.",import_feedback_title:"Consegue fazer melhor do que a IA?",import_feedback_body:"Se a IA lhe der maus conselhos, partilhe a sugest\xE3o dela, a sua vers\xE3o corrigida, e uma breve nota sobre o que estava errado \u2014 \xE9 usado para melhorar o livro de receitas com que a IA aprende.",import_feedback_link:"Comunicar no GitHub",settings_ambience_field_name:"Nome do interruptor",settings_ambience_field_pause:"Pausar durante",settings_reapply_enable_label:"Reexecutar todas as cenas ap\xF3s inatividade",settings_reapply_interval_label:"Reexecutar ap\xF3s",apply_on_every_match:"Aplicar em cada correspond\xEAncia",help_apply_on_every_match:"Quando ativado, o Ambience reaplica as a\xE7\xF5es desta cena sempre que ela vence o seu \xE2mbito/categoria, e n\xE3o apenas na primeira vez que se torna a cena ativa.",unit_minutes:"minutos",help:"Ajuda",open_documentation:"Abrir documenta\xE7\xE3o",read_documentation:"Ler mais",help_switch_name:"O nome usado para as entidades de interruptor de pausa de cada \xE2mbito.",help_pause_for:"Quando o interruptor de um \xE2mbito \xE9 desligado, retomar automaticamente ap\xF3s este n\xFAmero de minutos. 0 = permanece em pausa at\xE9 ser ligado novamente.",help_reapply_toggle:"Reexecutar as cenas de um \xE2mbito/categoria ap\xF3s inatividade e reaplicar a cena vencedora, caso alguma a\xE7\xE3o tenha falhado anteriormente, como uma luz que n\xE3o se desligou.",help_reapply_after:"Reexecutar cenas que n\xE3o s\xE3o atualizadas h\xE1 este n\xFAmero de minutos.",settings_expose_group:"Expor a assistentes de voz",settings_expose_assist:"Assist",settings_expose_google:"Google Assistant",settings_expose_alexa:"Alexa",help_expose:"Expor os interruptores de pausa de cada \xE2mbito aos assistentes de voz selecionados para poder pausar/retomar o Ambience por voz. O Google Assistant e a Alexa requerem o Home Assistant Cloud ou uma configura\xE7\xE3o manual.",help_actions_tab:"As a\xE7\xF5es s\xE3o as chamadas de servi\xE7o que uma cena executa. Defina-as aqui para que as cenas as possam reutilizar.",help_show_in_scene_editor:"Mostrar este campo no editor de cenas para que cada cena o possa definir. Deixe desativado para enviar antes um valor predefinido fixo.",help_set_default:"Um valor enviado automaticamente quando a a\xE7\xE3o \xE9 executada. As cenas podem substitu\xED-lo se o campo tamb\xE9m for mostrado no editor.",help_conditions_tab:"As condi\xE7\xF5es s\xE3o os dados de entrada com que as cenas correspondem (hora do dia, presen\xE7a, meteorologia, \u2026). Uma cena vence quando todas as suas condi\xE7\xF5es s\xE3o satisfeitas.",help_categories_tab:"As categorias permitem que um \xE2mbito tenha v\xE1rios vencedores independentes em simult\xE2neo \u2014 uma cena vence por categoria.",no_areas:"N\xE3o foram encontradas \xE1reas no Home Assistant.",not_configured:"n\xE3o configurado",scene_singular:"cena",scene_plural:"cenas",all_categories:"Todas as categorias",add_category:"Adicionar categoria\u2026",loading:"A carregar\u2026",any_placeholder:"(qualquer)",include:"Incluir",exclude:"Excluir",empty_all_days:"(vazio \u2192 todos os dias)",add_include_item:"+ Adicionar item a incluir",add_exclude_item:"+ Adicionar item a excluir",from:"de",to:"a",remove:"Remover",day_of_month_placeholder:"ex.: 1-10, 15",workday_sensor:"Sensor de dia \xFAtil",workday_calendar:"Calend\xE1rio de dias \xFAteis",periods_heading:"Per\xEDodos",badge_builtin:"incorporado",badge_custom:"personalizado",add_custom_period:"+ Adicionar per\xEDodo personalizado",lux_heading:"Intervalos de lux",add_custom_lux_range:"+ Adicionar intervalo de lux personalizado",lux_modal_add_title:"Adicionar intervalo de lux personalizado",lux_modal_edit_title:'Editar "{name}"',lux_min_label:"M\xEDn. (lx)",lux_max_label:"M\xE1x. (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"\xE9",occupancy_is_not:"n\xE3o \xE9",lux_any:"Qualquer um de",lux_all:"Todos de",lux_is:"\xE9",lux_is_not:"n\xE3o \xE9",title_edit:"Editar",title_delete:"Eliminar",new_scene:"Nova cena",new_scene_default:"Nova cena",name_optional:"Nome (opcional)",category:"Categoria",scope:"\xC2mbito",when_heading:"Quando",actions_heading:"A\xE7\xF5es",target:"Alvo",remove_action:"Remover a\xE7\xE3o",add_action:"+ Adicionar a\xE7\xE3o\u2026",remove_condition:"Remover condi\xE7\xE3o",add_condition:"+ Adicionar condi\xE7\xE3o\u2026",add_description:"+ Adicionar descri\xE7\xE3o",description:"Descri\xE7\xE3o",add_action_button:"Adicionar a\xE7\xE3o",cancel:"Cancelar",save:"Guardar",save_scene:"Guardar cena",at_least_one_target:"\xC9 necess\xE1rio pelo menos um alvo.",condition_error:"Corrija o erro nesta condi\xE7\xE3o antes de continuar",no_scenes_yet:"Ainda n\xE3o h\xE1 cenas.",add_scene:"+ Adicionar cena",summary_any:"qualquer",summary_any_paren:"(qualquer)",summary_always:"Sempre",no_targets:"(sem alvos)",action_singular:"a\xE7\xE3o",action_plural:"a\xE7\xF5es",scene_n:"Cena {n}",drag_to_reorder:"Arraste para reordenar",unpin:"Desafixar (voltar \xE0 ordem autom\xE1tica)",enable_scene:"Ativar cena",disable_scene:"Desativar cena",shadowed:"Nunca dispara \u2014 encoberta por uma cena anterior.",problem_missing:"Em falta ou desativada no Home Assistant:",problem_overlap:"Controlada por v\xE1rios grupos:",problem_config:"Problemas de configura\xE7\xE3o:",problems_count:"{n} cena(s) com problemas",badge_needs_workday_sensor:"precisa de um sensor de dia \xFAtil",badge_needs_workday_calendar:"precisa de um calend\xE1rio de dias \xFAteis",badge_needs_weather_entity:"precisa de uma entidade meteorol\xF3gica",badge_missing_weather_group:"grupo meteorol\xF3gico {id} em falta",badge_missing_period:"per\xEDodo {id} em falta",badge_missing_lux_range:"intervalo de lux {id} em falta",badge_unexposed_action:"a\xE7\xE3o {id} n\xE3o exposta",edit:"Editar",duplicate:"Duplicar",run_actions:"Executar a\xE7\xF5es",run:"Executar",auto_triggers_section:"Acionadores autom\xE1ticos",auto_triggers_none:"Sem acionadores autom\xE1ticos.",auto_triggers_opaque_note:"Uma cena de script \xE9 opaca \u2014 alguns acompanhamentos podem estar em falta. Declare-os no campo Acionadores da cena.",auto_trigger_group_time:"Hora",auto_trigger_group_sun:"Sol",auto_trigger_group_domain:"Lista de pessoas",auto_trigger_domain_membership:"{domains} adicionado ou removido",auto_trigger_date_rollover:"Meia-noite local (mudan\xE7a de data)",auto_trigger_periodic:"reverifica\xE7\xE3o peri\xF3dica",more_actions:"Mais a\xE7\xF5es",scene_actions:"A\xE7\xF5es da cena",error_enter_name:"Introduza um nome.",error_start_letter:"O nome tem de come\xE7ar por uma letra.",error_name_exists:"J\xE1 existe uma entrada com este nome. Escolha um nome diferente.",period_modal_add_title:"Adicionar per\xEDodo personalizado",period_modal_edit_title:'Editar "{name}"',name:"Nome",name_placeholder:"ex.: Relaxar",lux_name_placeholder:"ex.: Sombrio",lux_error_need_bound:"Introduza um m\xEDnimo, um m\xE1ximo, ou ambos.",lux_error_negative:"Os limites t\xEAm de ser 0 ou superiores.",lux_error_order:"O m\xEDnimo tem de ser inferior ao m\xE1ximo.",lux_error_not_integer:"Os limites t\xEAm de ser n\xFAmeros inteiros.",from_label:"De",to_label:"At\xE9",any_time:"Qualquer hora",custom_range:"Intervalo personalizado",custom_suffix:" (personalizado)",add_time_range:"+ adicionar outro intervalo de tempo",endpoint_time:"Hora",endpoint_sun:"Sol",offset_placeholder:"Desvio",clamp_none:"\u2014",clamp_not_before:"n\xE3o antes de",clamp_not_after:"n\xE3o depois de",unit_hour:"hora",unit_hours:"horas",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"N\xE3o h\xE1 entidades correspondentes nesta \xE1rea.",field_kind:"Tipo",field_days_of_month:"Dias do m\xEAs",field_month:"M\xEAs",field_day:"Dia",field_from_month:"Do m\xEAs",field_from_day:"Do dia",field_to_month:"Ao m\xEAs",field_to_day:"Ao dia",day_spec_error:"Use dias 1\u201331 e intervalos como 1-10, separados por v\xEDrgulas",title_override:"Substituir",thresholds:"Limiares",add_threshold:"+ Adicionar limiar",weather_entity:"Entidade meteorol\xF3gica",groups:"Grupos",add_group:"+ Adicionar grupo",sun:{elevation:"Eleva\xE7\xE3o",azimuth:"Azimute",any:"Qualquer",above:"Acima",below:"Abaixo",between:"Entre",custom_range:"Intervalo personalizado"},arguments:"Argumentos",form:"Formul\xE1rio",script:"Script",yaml:"YAML",settings_tab_categories:"Categorias",category_add:"+ Adicionar categoria",category_name_placeholder:"Nome da categoria",category_icon:"\xCDcone",category_color:"Cor",category_name_blank_error:"Os nomes das categorias n\xE3o podem estar vazios.",category_name_duplicate_error:"Duas categorias n\xE3o podem ter o mesmo nome.",category_delete_blocked_last:"N\xE3o pode eliminar a \xFAltima categoria.",category_delete_blocked_in_use:"Esta categoria ainda tem cenas \u2014 mova-as ou elimine-as primeiro.",category_edit_title:"Editar categoria",category_add_title:"Adicionar categoria",category_color_none:"Sem cor",category_save:"Guardar",view_traces:"Ver rastreios",pause_scope:"Pausar este \xE2mbito",resume_scope:"Retomar agora",close:"Fechar",pick_service:"Escolher um servi\xE7o",retry:"Tentar novamente",action_label_placeholder:"R\xF3tulo (opcional)",action_no_parameters:"Esta a\xE7\xE3o n\xE3o tem campos configur\xE1veis.",actions_field_help_show:"Marque uma caixa para tornar um campo edit\xE1vel por cena.",actions_field_help_default:"Defina um valor predefinido para o preencher previamente.",clear_default:"Limpar predefini\xE7\xE3o",set_default:"Definir predefini\xE7\xE3o",default_prefix:"Predefini\xE7\xE3o: ",editing:"A editar\u2026",show_in_scene_editor:"Mostrar no editor de cenas",extra_fields_prefix:"Campos extra:",extra_fields_hint:"Estes campos n\xE3o est\xE3o atualmente expostos mas ser\xE3o enviados na mesma.",service_has_no_fields:"Este servi\xE7o n\xE3o tem campos.",service_unavailable:"Servi\xE7o n\xE3o dispon\xEDvel nesta inst\xE2ncia do HA.",action_unavailable:"A\xE7\xE3o j\xE1 n\xE3o dispon\xEDvel; configure-a em Defini\xE7\xF5es \u2192 A\xE7\xF5es ou remova esta a\xE7\xE3o.",raw_config_action:"A\xE7\xE3o",raw_config_targets:"Alvos",raw_config_params:"Par\xE2metros",occupancy_any:"Qualquer um de",occupancy_all:"Todos de",occupancy_detected:"Detetado",occupancy_clear:"Livre",occupancy_for:"durante",day_pick_weekday:"Escolha pelo menos um dia da semana.",state_sentinel:"Estado",invalid_datetime:"Introduza uma data e hora v\xE1lidas.",simulate_title:"Simular",simulate_when_hint:"controla o sol, a hora do dia, o dia da semana e o dia \xFAtil",simulate_sun_resolved:"\u2192 {time}",simulate_sun_undefined:"sem {anchor} nesta data",simulate_sun_unresolved:"N\xE3o \xE9 poss\xEDvel resolver esta hora solar para a data selecionada.",simulate_inputs_heading:"Entradas de que esta categoria depende",simulate_button:"Simular",reset_to_now:"Repor para agora",reset_to_live:"Repor para o estado atual",true_label:"Verdadeiro",false_label:"Falso",for_at_least:"pelo menos",for_less_than:"menos de",for_label:"Durante",duration_held_hint:"H\xE1 quanto tempo mant\xE9m este estado (h:m:s)",away:"Fora",home:"Casa",refresh:"Atualizar",new_traces_refresh:"Novos rastreios \u2014 atualizar",clear_traces:"Limpar",download_diagnostics:"Transferir diagn\xF3sticos",no_traces_yet:"Ainda n\xE3o h\xE1 rastreios para esta categoria.",yaml_expect_object:"Esperava-se um objeto",yaml_script_string:"`script` tem de ser uma cadeia 'script.<name>'",yaml_args_object:"`args` tem de ser um objeto, se presente",yaml_triggers_list:"`triggers` tem de ser uma lista de cadeias entity_id, se presente",template_result:"Resultado",template_truthy:"verdadeiro \u2014 corresponde",template_falsy:"falso \u2014 sem correspond\xEAncia",conditions_hint_body:"Configure Dia \xFAtil e Meteorologia em Condi\xE7\xF5es para os usar nas condi\xE7\xF5es das suas cenas.",conditions_hint_body_weather:"Configure Meteorologia em Condi\xE7\xF5es para a usar nas condi\xE7\xF5es das suas cenas.",conditions_hint_body_workday:"Configure Dia \xFAtil em Condi\xE7\xF5es para o usar nas condi\xE7\xF5es das suas cenas.",conditions_hint_cta:"Configurar condi\xE7\xF5es",conditions_hint_title:"Opcional: configurar Dia \xFAtil e Meteorologia",conditions_hint_title_weather:"Opcional: configurar Meteorologia",conditions_hint_title_workday:"Opcional: configurar Dia \xFAtil",dismiss:"Dispensar",fado_notice_title:"Recomendado: instalar o Fado Light Fader",fado_notice_body:"O Fado adiciona transi\xE7\xF5es suaves de luz para brilho, cor e temperatura de cor \u2014 com restauro autom\xE1tico de brilho, autoconfigura\xE7\xE3o da interface, e transi\xE7\xF5es nativas. Est\xE1 no Marketplace do Home Assistant e, em vers\xF5es mais antigas, no HACS.",fado_notice_cta:"Instalar Fado",for_prefix:"durante",name_duplicate:"J\xE1 existe uma cena com este nome nesta categoria.",no_exposed_actions:"Adicione servi\xE7os em Defini\xE7\xF5es \u2192 A\xE7\xF5es.",people_for:"durante",people_is_at:"Est\xE1 em",people_is_at_static:"est\xE1 em",people_is_not_at:"N\xE3o est\xE1 em",people_mode_all:"Todos de:",people_mode_any:"Qualquer um de:",people_mode_anybody:"Qualquer pessoa",people_mode_everybody:"Todos",people_mode_nobody:"Ningu\xE9m",people_mode_none:"Nenhum de:",people_none_tracked:"N\xE3o h\xE1 pessoas monitorizadas",people_select_one:"Selecione pelo menos uma pessoa",unavailable_select_one:"Selecione pelo menos uma entidade",people_where_home:"Casa",scope_house:"Casa",history_nothing_to_undo:"Nada para anular",history_nothing_to_redo:"Nada para refazer",history_undo_tooltip:"Anular: {change}",history_redo_tooltip:"Refazer: {change}",history_untitled:"Sem t\xEDtulo",history_action_add:'Cena "{scene}" adicionada em {scope}',history_action_edit:'Cena "{scene}" editada em {scope}',history_action_delete:'Cena "{scene}" eliminada em {scope}',history_action_reorder:"Cenas reordenadas em {scope}",history_action_unpin:'Cena "{scene}" desafixada em {scope}',history_action_toggle:'Cena "{scene}" alternada em {scope}',history_conflict_body:"Outro separador alterou as cenas neste \xE2mbito enquanto estava a editar.",history_conflict_overwrite:"Substituir as deles",history_conflict_load:"Carregar as deles",script_triggers:"Acionadores",script_triggers_help:"Reavaliar esta cena quando estas entidades mudarem. Um script \xE9 opaco, pelo que refer\xEAncias em template podem passar despercebidas \u2014 adicione todas de que ele depende.",script_triggers_none:"Sem acionadores",simulate:"Simular",state_add_condition:"Adicionar cl\xE1usula",state_add_first:"Adicionar cl\xE1usula",state_add_value:"+ Adicionar estado",state_attribute_placeholder:"deixe em branco para comparar o estado",state_entity:"Entidade",state_err_entity:"A entidade \xE9 obrigat\xF3ria",state_err_incomplete:"Esta condi\xE7\xE3o est\xE1 incompleta",state_err_numeric:"O valor tem de ser um n\xFAmero",state_err_state:"O estado \xE9 obrigat\xF3rio",state_err_value:"O valor \xE9 obrigat\xF3rio",state_for:"Durante (opcional)",state_new_condition:"(nova condi\xE7\xE3o)",state_not_toggle:"Negar (N\xC3O)",state_op_header:"Compara\xE7\xE3o",state_unwrap_group:"Remover estes par\xEAnteses (promover os filhos ao n\xEDvel superior)",state_value_label:"Valor",state_where:"Onde",state_wrap:"Agrupar",state_wrap_group:"Envolver estas cl\xE1usulas em par\xEAnteses",show_more_info:"Mostrar mais informa\xE7\xE3o",cause_has_time:"Verifica\xE7\xE3o peri\xF3dica de tempo",cause_switch:"Interruptor ligado",cause_manual:"Aplica\xE7\xE3o manual",cause_startup:"Arranque",cause_reloaded:"Recarregado",cause_simulated:"Simula\xE7\xE3o",cause_clock:"Hora do dia",cause_sun:"Posi\xE7\xE3o do sol",cause_reapply:"Reexecu\xE7\xE3o",cause_duration_for:"durante",outcome_label_acted:"aplicada",outcome_label_no_op:"bloqueada",outcome_label_debounced:"inalterada",outcome_label_no_match:"sem correspond\xEAncia",outcome_label_skipped:"ignorada",count_action_one:"{n} a\xE7\xE3o",count_action_other:"{n} a\xE7\xF5es",count_entity_one:"{n} entidade",count_entity_other:"{n} entidades",count_target_one:"{n} alvo",count_target_other:"{n} alvos",count_domain_target_one:"{n} alvo ({domain})",count_domain_target_other:"{n} alvos ({domain})",winner_default:"A cena correspondente",outcome_summary_acted_all_skipped:"{winner} correspondeu \u2014 {skipped_phrase} ignorada(s) (n\xE3o expostas); nada foi aplicado.",outcome_summary_acted_entities:"{winner} aplicada \u2014 {acts} em {entities}.{tail}",outcome_summary_acted:"{winner} aplicada \u2014 {acts}.{tail}",outcome_summary_skipped_tail:" ({skipped} ignorada(s) \u2014 n\xE3o expostas)",outcome_summary_no_op:"{winner} correspondeu mas n\xE3o tem a\xE7\xF5es \u2014 impede a aplica\xE7\xE3o de cenas inferiores. Nada mudou.",outcome_summary_debounced:"{winner} correspondeu, mas j\xE1 est\xE1 aplicada \u2014 nada foi reenviado.",outcome_summary_no_match:"Nenhuma cena correspondeu \u2014 nada foi aplicado.",outcome_summary_skipped_switch_off:"Ignorado \u2014 o interruptor de pausa do \xE2mbito est\xE1 desligado.",outcome_summary_skipped_scope_disabled:"Ignorado \u2014 o \xE2mbito est\xE1 desativado.",outcome_summary_skipped_unavailable:"Ignorado \u2014 a entidade que acionou ficou indispon\xEDvel; os dispositivos foram deixados como est\xE3o.",section_scene_evaluation:"Avalia\xE7\xE3o da cena",section_actions_taken:"A\xE7\xF5es executadas",trigger_prefix:"Acionador: ",trace_won_prefix:"Vencedora: ",skipped_not_exposed:" \u2014 ignorada (n\xE3o exposta)",trace_scene_prefix:"Cena #",trace_scene_disabled:"desativada",trace_scene_not_reached:"n\xE3o alcan\xE7ada",trace_scene_matched:"\u2713 correspondeu",trace_scene_no_match:"\u2717 sem correspond\xEAncia",scene_live:"Ativa agora \u2014 esta cena corresponde atualmente e est\xE1 aplicada",scene_applied_stale:"Ainda aplicada \u2014 as a\xE7\xF5es desta cena est\xE3o em vigor mas j\xE1 n\xE3o corresponde",version_update:{message:"O Ambience {version} foi instalado \u2014 recarregue para atualizar.",reload:"Recarregar"}},blocker_summary:{block:"Bloquear",block_mid:"bloquear",until:"at\xE9",while:"enquanto",while_lead:"Enquanto",or:"ou",and:"e",always:"sempre"},day_summary:{any:"qualquer",any_day:"qualquer dia",except:"exceto",day_prefix:"dia",last_day:"\xFAltimo dia",workday:"dia \xFAtil",holiday:"feriado",first_workday:"primeiro dia \xFAtil",last_workday:"\xFAltimo dia \xFAtil",date:"{day} de {month}"},people_summary:{home:"casa",is_at:"est\xE1 em",is_not_at:"n\xE3o est\xE1 em"},occupancy_summary:{clear:"livre",detected:"detetado"},unavailable_summary:{unavailable:"indispon\xEDvel"},condition_summary:{is:"est\xE1",are:"est\xE3o",not:"n\xE3o",any_of:"Qualquer um de",all_of:"Todos de"},compass:{N:"N",NE:"NE",E:"E",SE:"SE",S:"S",SW:"SO",W:"O",NW:"NO"},month:{1:"Janeiro",2:"Fevereiro",3:"Mar\xE7o",4:"Abril",5:"Maio",6:"Junho",7:"Julho",8:"Agosto",9:"Setembro",10:"Outubro",11:"Novembro",12:"Dezembro"},weather_condition:{"clear-night":"C\xE9u limpo (noite)",cloudy:"Nublado",fog:"Nevoeiro",hail:"Granizo",lightning:"Trovoada","lightning-rainy":"Trovoada com chuva",partlycloudy:"Parcialmente nublado",pouring:"Chuva forte",rainy:"Chuvoso",snowy:"Neve","snowy-rainy":"Neve com chuva",sunny:"Sol",windy:"Vento","windy-variant":"Vento (variante)",exceptional:"Excecional"},weather_attr:{temperature:"Temperatura",apparent_temperature:"Temperatura aparente",humidity:"Humidade",wind_speed:"Velocidade do vento",pressure:"Press\xE3o"},state_op:{is:"\xE9",is_not:"n\xE3o \xE9",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"E",or:"OU",and_not:"E N\xC3O",or_not:"OU N\xC3O",not:"N\xC3O"},trace_reason:{day_workday_sensor_unconfigured:"sensor de dia \xFAtil n\xE3o configurado",day_workday_calendar_unconfigured:"calend\xE1rio de dias \xFAteis n\xE3o configurado",lux_range_missing:"o intervalo de lux {range} j\xE1 n\xE3o existe",lux_sensor_not_numeric:"{name} ({value}) n\xE3o reporta um n\xFAmero",period_missing:"o per\xEDodo do dia {period} j\xE1 n\xE3o existe",sun_not_configured:"a integra\xE7\xE3o sun n\xE3o est\xE1 configurada",sun_anchor_undefined:"{anchor} n\xE3o est\xE1 definido hoje nesta localiza\xE7\xE3o",weather_entity_unconfigured:"entidade meteorol\xF3gica n\xE3o configurada",weather_group_missing:"o grupo meteorol\xF3gico {group} j\xE1 n\xE3o existe"},trace_detail:{not_found:"n\xE3o encontrado",unavailable:"indispon\xEDvel",all_of:"todos de:",any_of:"algum de:",negate:"n\xE3o",any_sensor:"qualquer sensor (sem restri\xE7\xE3o)",for_hold:"durante {rel}{dur}",held:"mantido {dur}",not_held:"n\xE3o mantido",no_people_tracked:"sem pessoas seguidas",summary_home:"{n} de {total} em casa ({names})",summary_home_zero:"0 de {total} em casa",want:"requer",quant_anyone:"algu\xE9m",quant_everyone:"todos",quant_nobody:"ningu\xE9m",where_home:"em casa",where_not_home:"fora de casa",where_in:"em {zone}",where_not_in:"fora de {zone}",loc_home:"em casa",loc_away:"fora",loc_in:"em {zone}",loc_not_in:"fora de {zone}",no_occupancy_sensors:"sem sensores de ocupa\xE7\xE3o",summary_active:"{n} de {total} ativos ({names})",summary_active_zero:"0 de {total} ativos",no_lux_sensors:"sem sensores de lux",no_lux_readings:"sem leituras de lux",unknown_range:"intervalo de lux desconhecido: {range}",want_band:"requer {band}",is:"\xE9 {values}",is_not:"n\xE3o \xE9 {values}",no_entities:"sem entidades",unavailable_any:"alguma indispon\xEDvel",summary_unavailable:"{n} de {total} indispon\xEDveis ({names})",summary_unavailable_zero:"0 de {total} indispon\xEDveis",sun_prefix:"Sol",sun_elevation:"{deg}\xB0 de eleva\xE7\xE3o",sun_azimuth:"{deg}\xB0 de azimute ({sector})"}},fr:{time_of_day_period:{dawn:"Aube",morning:"Matin",afternoon:"Apr\xE8s-midi",evening:"Soir",nighttime:"Nuit",daytime:"Journ\xE9e"},weekday:{mon:"Lun",tue:"Mar",wed:"Mer",thu:"Jeu",fri:"Ven",sat:"Sam",sun:"Dim"},day_item:{weekday:"Jour de la semaine",day_of_month:"Jour du mois",date:"Date (annuelle)",date_range:"Plage de dates (annuelle)",last_day:"Dernier jour du mois",workday:"Jour ouvr\xE9",holiday:"Jour f\xE9ri\xE9",first_workday:"Premier jour ouvr\xE9 du mois",last_workday:"Dernier jour ouvr\xE9 du mois"},lux_range:{dark:"Sombre",dim:"Faible",normal:"Normal",bright:"Lumineux",very_bright:"Tr\xE8s lumineux"},category_color:{red:"Rouge",pink:"Rose",purple:"Violet","deep-purple":"Violet fonc\xE9",indigo:"Indigo",blue:"Bleu","light-blue":"Bleu clair",cyan:"Cyan",teal:"Sarcelle",green:"Vert","light-green":"Vert clair",lime:"Citron vert",yellow:"Jaune",amber:"Ambre",orange:"Orange","deep-orange":"Orange fonc\xE9",brown:"Marron",grey:"Gris","blue-grey":"Gris bleut\xE9"},condition:{time_of_day:"Moment de la journ\xE9e",state:"\xC9tat de l'entit\xE9",script:"Script",sun:"Soleil",template:"Mod\xE8le",lux:"Lux",unavailable:"Indisponible"},action:{},anchor:{dawn:"Aube",sunrise:"Lever du soleil",noon:"Midi",sunset:"Coucher du soleil",dusk:"Cr\xE9puscule",midnight:"Minuit"},ui:{language_request:{message:"La langue de votre Home Assistant est {language}, mais {product} n'est pas encore traduit dans cette langue.",action:"Demander une traduction \u2192",dismiss:"Ignorer"},panel_title:"Ambience",card_load_failed:"Le chargement de la carte Ambience a \xE9chou\xE9 \u2014 v\xE9rifiez la connexion et actualisez.",tab_settings:"Param\xE8tres",settings_tab_ambience:"Avanc\xE9",settings_tab_conditions:"Conditions",settings_tab_actions:"Actions",settings_ambience_pause_card:"Interrupteur de pause au niveau de la port\xE9e",help_pause_switch:"Ambience cr\xE9e une entit\xE9 interrupteur pour chaque port\xE9e zone, \xE9tage et maison activ\xE9e. \xC9teindre l'interrupteur d'une port\xE9e met Ambience en pause pour cette port\xE9e.",settings_tab_import:"IA",import_title:"Cr\xE9er et corriger des sc\xE8nes avec l'IA",import_beta:"B\xEAta",import_mcp_title:"Cr\xE9er en direct avec le serveur MCP",import_mcp_desc:"Installez le serveur MCP pour l'exp\xE9rience de cr\xE9ation et d'\xE9dition la plus rapide avec Claude Code ou Claude Desktop.",import_mcp_link:"Configurer le serveur MCP",import_mcp_recommended:"Recommand\xE9",import_paste_title:"Ou t\xE9l\xE9chargez et collez dans n'importe quelle IA",import_help_link:"Guide d'installation et d'utilisation",import_step1:"Installez la comp\xE9tence ou le plugin une fois",import_step1_desc:"Ajoutez le pack IA Ambience \xE0 votre IA pour lui apprendre Ambience.",import_step2:"T\xE9l\xE9chargez votre lot IA",import_step2_desc:"Le lot contient un instantan\xE9 de vos zones, entit\xE9s et actions expos\xE9es (donn\xE9es de localisation masqu\xE9es) que l'IA utilisera pour cr\xE9er. Envoyez-le \xE0 l'IA avec votre demande.",import_step3:"Envoyez le r\xE9sultat",import_step3_desc:"Envoyez le fichier YAML ou JSON fourni par l'IA. Un aper\xE7u s'affiche avant toute modification, et vous pouvez toujours les annuler avec le bouton Annuler.",import_download_bundle:"T\xE9l\xE9charger le lot IA",import_target:"Cible",import_new_category:"Nouvelle cat\xE9gorie \xE0 cr\xE9er",import_unknown_categories:"Cat\xE9gories inconnues (cr\xE9ez-les d'abord)",import_adds:"Ajouter",import_updates:"Mettre \xE0 jour",import_removes:"Supprimer",import_confirm:"Importer",import_done:"Import\xE9 avec succ\xE8s.",import_feedback_title:"Pouvez-vous faire mieux que l'IA ?",import_feedback_body:"Si l'IA vous donne un mauvais conseil, partagez sa suggestion, votre version corrig\xE9e et une br\xE8ve note sur ce qui n'allait pas \u2014 c'est utilis\xE9 pour am\xE9liorer le recueil dont l'IA s'inspire.",import_feedback_link:"Signalez-le sur GitHub",settings_ambience_field_name:"Nom de l'interrupteur",settings_ambience_field_pause:"Mettre en pause pendant",settings_reapply_enable_label:"R\xE9-ex\xE9cuter toutes les sc\xE8nes apr\xE8s inactivit\xE9",settings_reapply_interval_label:"R\xE9-ex\xE9cuter apr\xE8s",apply_on_every_match:"Appliquer \xE0 chaque correspondance",help_apply_on_every_match:"Lorsque cette option est activ\xE9e, Ambience r\xE9applique les actions de cette sc\xE8ne chaque fois qu'elle l'emporte dans sa port\xE9e/cat\xE9gorie, et pas seulement la premi\xE8re fois qu'elle devient la sc\xE8ne active.",unit_minutes:"minutes",help:"Aide",open_documentation:"Ouvrir la documentation",read_documentation:"En savoir plus",help_switch_name:"Le nom utilis\xE9 pour les entit\xE9s interrupteur de pause par port\xE9e.",help_pause_for:"Lorsque l'interrupteur d'une port\xE9e est \xE9teint, reprendre automatiquement apr\xE8s ce nombre de minutes. 0 = reste en pause jusqu'\xE0 ce qu'il soit rallum\xE9.",help_reapply_toggle:"R\xE9-ex\xE9cuter les sc\xE8nes d'une port\xE9e/cat\xE9gorie apr\xE8s inactivit\xE9 et r\xE9appliquer la sc\xE8ne gagnante, au cas o\xF9 une action aurait pr\xE9c\xE9demment \xE9chou\xE9, comme une lumi\xE8re qui ne s'est pas \xE9teinte.",help_reapply_after:"R\xE9-ex\xE9cuter les sc\xE8nes qui n'ont pas \xE9t\xE9 mises \xE0 jour depuis ce nombre de minutes.",settings_expose_group:"Exposer aux assistants vocaux",settings_expose_assist:"Assist",settings_expose_google:"Google Assistant",settings_expose_alexa:"Alexa",help_expose:"Exposer les interrupteurs de pause par port\xE9e aux assistants vocaux s\xE9lectionn\xE9s pour pouvoir mettre Ambience en pause/reprendre par la voix. Google Assistant et Alexa n\xE9cessitent Home Assistant Cloud ou une configuration manuelle.",help_actions_tab:"Les actions sont les appels de service qu'une sc\xE8ne ex\xE9cute. D\xE9finissez-les ici pour que les sc\xE8nes puissent les r\xE9utiliser.",help_show_in_scene_editor:"Afficher ce champ dans l'\xE9diteur de sc\xE8ne pour que chaque sc\xE8ne puisse le d\xE9finir. Laissez d\xE9sactiv\xE9 pour envoyer une valeur par d\xE9faut fixe \xE0 la place.",help_set_default:"Une valeur envoy\xE9e automatiquement lorsque l'action s'ex\xE9cute. Les sc\xE8nes peuvent la remplacer si le champ est aussi affich\xE9 dans l'\xE9diteur.",help_conditions_tab:"Les conditions sont les entr\xE9es sur lesquelles les sc\xE8nes correspondent (moment de la journ\xE9e, pr\xE9sence, m\xE9t\xE9o, \u2026). Une sc\xE8ne l'emporte lorsque toutes ses conditions sont satisfaites.",help_categories_tab:"Les cat\xE9gories permettent \xE0 une port\xE9e d'avoir plusieurs gagnants ind\xE9pendants \xE0 la fois \u2014 une sc\xE8ne l'emporte par cat\xE9gorie.",no_areas:"Aucune zone trouv\xE9e dans Home Assistant.",not_configured:"non configur\xE9",scene_singular:"sc\xE8ne",scene_plural:"sc\xE8nes",all_categories:"Toutes les cat\xE9gories",add_category:"Ajouter une cat\xE9gorie\u2026",loading:"Chargement\u2026",any_placeholder:"(indiff\xE9rent)",include:"Inclure",exclude:"Exclure",empty_all_days:"(vide \u2192 tous les jours)",add_include_item:"+ Ajouter un \xE9l\xE9ment \xE0 inclure",add_exclude_item:"+ Ajouter un \xE9l\xE9ment \xE0 exclure",from:"de",to:"\xE0",remove:"Supprimer",day_of_month_placeholder:"ex. 1-10, 15",workday_sensor:"Capteur de jour ouvr\xE9",workday_calendar:"Calendrier de jours ouvr\xE9s",periods_heading:"P\xE9riodes",badge_builtin:"int\xE9gr\xE9",badge_custom:"personnalis\xE9",add_custom_period:"+ Ajouter une p\xE9riode personnalis\xE9e",lux_heading:"Plages de lux",add_custom_lux_range:"+ Ajouter une plage de lux personnalis\xE9e",lux_modal_add_title:"Ajouter une plage de lux personnalis\xE9e",lux_modal_edit_title:"Modifier \xAB {name} \xBB",lux_min_label:"Min (lx)",lux_max_label:"Max (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"est",occupancy_is_not:"n'est pas",lux_any:"L'un de",lux_all:"Tous parmi",lux_is:"est",lux_is_not:"n'est pas",title_edit:"Modifier",title_delete:"Supprimer",new_scene:"Nouvelle sc\xE8ne",new_scene_default:"Nouvelle sc\xE8ne",name_optional:"Nom (facultatif)",category:"Cat\xE9gorie",scope:"Port\xE9e",when_heading:"Quand",actions_heading:"Actions",target:"Cible",remove_action:"Supprimer l'action",add_action:"+ Ajouter une action\u2026",remove_condition:"Supprimer la condition",add_condition:"+ Ajouter une condition\u2026",add_description:"+ Ajouter une description",description:"Description",add_action_button:"Ajouter une action",cancel:"Annuler",save:"Enregistrer",save_scene:"Enregistrer la sc\xE8ne",at_least_one_target:"Au moins une cible est requise.",condition_error:"Corrigez l'erreur dans cette condition avant de continuer",no_scenes_yet:"Aucune sc\xE8ne pour l'instant.",add_scene:"+ Ajouter une sc\xE8ne",summary_any:"indiff\xE9rent",summary_any_paren:"(indiff\xE9rent)",summary_always:"Toujours",no_targets:"(aucune cible)",action_singular:"action",action_plural:"actions",scene_n:"Sc\xE8ne {n}",drag_to_reorder:"Glisser pour r\xE9organiser",unpin:"D\xE9tacher (revenir \xE0 l'ordre automatique)",enable_scene:"Activer la sc\xE8ne",disable_scene:"D\xE9sactiver la sc\xE8ne",shadowed:"Ne se d\xE9clenche jamais \u2014 masqu\xE9e par une sc\xE8ne pr\xE9c\xE9dente.",problem_missing:"Manquante ou d\xE9sactiv\xE9e dans Home Assistant :",problem_overlap:"Contr\xF4l\xE9e par plusieurs groupes :",problem_config:"Probl\xE8mes de configuration :",problems_count:"{n} sc\xE8ne(s) pr\xE9sentent des probl\xE8mes",badge_needs_workday_sensor:"n\xE9cessite un capteur de jour ouvr\xE9",badge_needs_workday_calendar:"n\xE9cessite un calendrier de jours ouvr\xE9s",badge_needs_weather_entity:"n\xE9cessite une entit\xE9 m\xE9t\xE9o",badge_missing_weather_group:"groupe m\xE9t\xE9o {id} manquant",badge_missing_period:"p\xE9riode {id} manquante",badge_missing_lux_range:"plage de lux {id} manquante",badge_unexposed_action:"action {id} non expos\xE9e",edit:"Modifier",duplicate:"Dupliquer",run_actions:"Ex\xE9cuter les actions",run:"Ex\xE9cuter",auto_triggers_section:"D\xE9clencheurs automatiques",auto_triggers_none:"Aucun d\xE9clencheur automatique.",auto_triggers_opaque_note:"Une sc\xE8ne script est opaque \u2014 certaines surveillances peuvent manquer. D\xE9clarez-les dans le champ D\xE9clencheurs de la sc\xE8ne.",auto_trigger_group_time:"Heure",auto_trigger_group_sun:"Soleil",auto_trigger_group_domain:"Liste des personnes",auto_trigger_domain_membership:"{domains} ajout\xE9 ou supprim\xE9",auto_trigger_date_rollover:"Minuit local (changement de date)",auto_trigger_periodic:"re-v\xE9rification p\xE9riodique",more_actions:"Plus d'actions",scene_actions:"Actions de la sc\xE8ne",error_enter_name:"Veuillez saisir un nom.",error_start_letter:"Le nom doit commencer par une lettre.",error_name_exists:"Une entr\xE9e portant ce nom existe d\xE9j\xE0. Choisissez un autre nom.",period_modal_add_title:"Ajouter une p\xE9riode personnalis\xE9e",period_modal_edit_title:"Modifier \xAB {name} \xBB",name:"Nom",name_placeholder:"ex. D\xE9tente",lux_name_placeholder:"ex. Maussade",lux_error_need_bound:"Saisissez un min, un max, ou les deux.",lux_error_negative:"Les bornes doivent \xEAtre sup\xE9rieures ou \xE9gales \xE0 0.",lux_error_order:"Le min doit \xEAtre inf\xE9rieur au max.",lux_error_not_integer:"Les bornes doivent \xEAtre des nombres entiers.",from_label:"De",to_label:"\xC0",any_time:"N'importe quand",custom_range:"Plage personnalis\xE9e",custom_suffix:" (personnalis\xE9)",add_time_range:"+ ajouter une autre plage horaire",endpoint_time:"Heure",endpoint_sun:"Soleil",offset_placeholder:"D\xE9calage",clamp_none:"\u2014",clamp_not_before:"pas avant",clamp_not_after:"pas apr\xE8s",unit_hour:"heure",unit_hours:"heures",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"Aucune entit\xE9 correspondante dans cette zone.",field_kind:"Type",field_days_of_month:"Jours du mois",field_month:"Mois",field_day:"Jour",field_from_month:"Du mois",field_from_day:"Du jour",field_to_month:"Au mois",field_to_day:"Au jour",day_spec_error:"Utilisez les jours 1\u201331 et des plages comme 1-10, s\xE9par\xE9s par des virgules",title_override:"Remplacer",thresholds:"Seuils",add_threshold:"+ Ajouter un seuil",weather_entity:"Entit\xE9 m\xE9t\xE9o",groups:"Groupes",add_group:"+ Ajouter un groupe",sun:{elevation:"\xC9l\xE9vation",azimuth:"Azimut",any:"Indiff\xE9rent",above:"Au-dessus de",below:"En dessous de",between:"Entre",custom_range:"Plage personnalis\xE9e"},arguments:"Arguments",form:"Formulaire",script:"Script",yaml:"YAML",settings_tab_categories:"Cat\xE9gories",category_add:"+ Ajouter une cat\xE9gorie",category_name_placeholder:"Nom de la cat\xE9gorie",category_icon:"Ic\xF4ne",category_color:"Couleur",category_name_blank_error:"Les noms de cat\xE9gorie ne peuvent pas \xEAtre vides.",category_name_duplicate_error:"Deux cat\xE9gories ne peuvent pas avoir le m\xEAme nom.",category_delete_blocked_last:"Vous ne pouvez pas supprimer la derni\xE8re cat\xE9gorie.",category_delete_blocked_in_use:"Cette cat\xE9gorie contient encore des sc\xE8nes \u2014 d\xE9placez-les ou supprimez-les d'abord.",category_edit_title:"Modifier la cat\xE9gorie",category_add_title:"Ajouter une cat\xE9gorie",category_color_none:"Aucune couleur",category_save:"Enregistrer",view_traces:"Voir les traces",pause_scope:"Mettre cette port\xE9e en pause",resume_scope:"Reprendre maintenant",close:"Fermer",pick_service:"Choisir un service",retry:"R\xE9essayer",action_label_placeholder:"Libell\xE9 (facultatif)",action_no_parameters:"Cette action n'a aucun champ configurable.",actions_field_help_show:"Cochez une case pour rendre un champ modifiable par sc\xE8ne.",actions_field_help_default:"D\xE9finissez une valeur par d\xE9faut pour le pr\xE9remplir.",clear_default:"Effacer la valeur par d\xE9faut",set_default:"D\xE9finir la valeur par d\xE9faut",default_prefix:"Par d\xE9faut : ",editing:"Modification\u2026",show_in_scene_editor:"Afficher dans l'\xE9diteur de sc\xE8ne",extra_fields_prefix:"Champs suppl\xE9mentaires :",extra_fields_hint:"Ces champs ne sont pas expos\xE9s actuellement mais seront tout de m\xEAme envoy\xE9s.",service_has_no_fields:"Ce service n'a aucun champ.",service_unavailable:"Service non disponible dans cette instance HA.",action_unavailable:"Action non disponible ; configurez-la dans Param\xE8tres \u2192 Actions ou supprimez cette action.",raw_config_action:"Action",raw_config_targets:"Cibles",raw_config_params:"Param\xE8tres",occupancy_any:"L'un de",occupancy_all:"Tous parmi",occupancy_detected:"D\xE9tect\xE9",occupancy_clear:"Libre",occupancy_for:"pendant",day_pick_weekday:"Choisissez au moins un jour de la semaine.",state_sentinel:"\xC9tat",invalid_datetime:"Saisissez une date et une heure valides.",simulate_title:"Simuler",simulate_when_hint:"pilote le soleil, le moment de la journ\xE9e, le jour de la semaine et le jour ouvr\xE9",simulate_sun_resolved:"\u2192 {time}",simulate_sun_undefined:"pas de {anchor} \xE0 cette date",simulate_sun_unresolved:"Cette heure solaire ne peut pas \xEAtre r\xE9solue pour la date s\xE9lectionn\xE9e.",simulate_inputs_heading:"Entr\xE9es dont d\xE9pend cette cat\xE9gorie",simulate_button:"Simuler",reset_to_now:"R\xE9initialiser \xE0 maintenant",reset_to_live:"R\xE9initialiser au direct",true_label:"Vrai",false_label:"Faux",for_at_least:"au moins",for_less_than:"moins de",for_label:"Pendant",duration_held_hint:"Depuis combien de temps cet \xE9tat est maintenu (h:m:s)",away:"Absent",home:"\xC0 la maison",refresh:"Actualiser",new_traces_refresh:"Nouvelles traces \u2014 actualiser",clear_traces:"Effacer",download_diagnostics:"T\xE9l\xE9charger les diagnostics",no_traces_yet:"Aucune trace pour cette cat\xE9gorie pour l'instant.",yaml_expect_object:"Objet attendu",yaml_script_string:"`script` doit \xEAtre une cha\xEEne 'script.<name>'",yaml_args_object:"`args` doit \xEAtre un objet s'il est pr\xE9sent",yaml_triggers_list:"`triggers` doit \xEAtre une liste de cha\xEEnes entity_id s'il est pr\xE9sent",template_result:"R\xE9sultat",template_truthy:"true \u2014 correspond",template_falsy:"false \u2014 aucune correspondance",conditions_hint_body:"Configurez Jour ouvr\xE9 et M\xE9t\xE9o dans Conditions pour les utiliser dans les conditions de vos sc\xE8nes.",conditions_hint_body_weather:"Configurez M\xE9t\xE9o dans Conditions pour l'utiliser dans les conditions de vos sc\xE8nes.",conditions_hint_body_workday:"Configurez Jour ouvr\xE9 dans Conditions pour l'utiliser dans les conditions de vos sc\xE8nes.",conditions_hint_cta:"Configurer les conditions",conditions_hint_title:"Facultatif : configurer Jour ouvr\xE9 et M\xE9t\xE9o",conditions_hint_title_weather:"Facultatif : configurer M\xE9t\xE9o",conditions_hint_title_workday:"Facultatif : configurer Jour ouvr\xE9",dismiss:"Ignorer",fado_notice_title:"Recommand\xE9 : installer Fado Light Fader",fado_notice_body:"Fado ajoute un fondu de lumi\xE8re fluide pour la luminosit\xE9, la couleur et la temp\xE9rature de couleur \u2014 avec restauration automatique de la luminosit\xE9, autoconfiguration de l'interface et transitions natives. Fado se trouve dans le Marketplace de Home Assistant et, sur les versions plus anciennes, dans HACS.",fado_notice_cta:"Installer Fado",for_prefix:"pendant",name_duplicate:"Une sc\xE8ne portant ce nom existe d\xE9j\xE0 dans cette cat\xE9gorie.",no_exposed_actions:"Ajoutez des services dans Param\xE8tres \u2192 Actions.",people_for:"pendant",people_is_at:"Est \xE0",people_is_at_static:"est \xE0",people_is_not_at:"N'est pas \xE0",people_mode_all:"Tous parmi :",people_mode_any:"L'un de :",people_mode_anybody:"N'importe qui",people_mode_everybody:"Tout le monde",people_mode_nobody:"Personne",people_mode_none:"Aucun parmi :",people_none_tracked:"Aucune personne suivie",people_select_one:"S\xE9lectionnez au moins une personne",unavailable_select_one:"S\xE9lectionnez au moins une entit\xE9",people_where_home:"\xC0 la maison",scope_house:"Maison",history_nothing_to_undo:"Rien \xE0 annuler",history_nothing_to_redo:"Rien \xE0 r\xE9tablir",history_undo_tooltip:"Annuler : {change}",history_redo_tooltip:"R\xE9tablir : {change}",history_untitled:"Sans titre",history_action_add:"Sc\xE8ne \xAB {scene} \xBB ajout\xE9e dans {scope}",history_action_edit:"Sc\xE8ne \xAB {scene} \xBB modifi\xE9e dans {scope}",history_action_delete:"Sc\xE8ne \xAB {scene} \xBB supprim\xE9e dans {scope}",history_action_reorder:"Sc\xE8nes r\xE9organis\xE9es dans {scope}",history_action_unpin:"Sc\xE8ne \xAB {scene} \xBB d\xE9tach\xE9e dans {scope}",history_action_toggle:"Sc\xE8ne \xAB {scene} \xBB bascul\xE9e dans {scope}",history_conflict_body:"Un autre onglet a modifi\xE9 les sc\xE8nes de cette port\xE9e pendant que vous \xE9ditiez.",history_conflict_overwrite:"\xC9craser les leurs",history_conflict_load:"Charger les leurs",script_triggers:"D\xE9clencheurs",script_triggers_help:"R\xE9\xE9valuer cette sc\xE8ne lorsque ces entit\xE9s changent. Un script est opaque, donc les r\xE9f\xE9rences par mod\xE8le peuvent \xEAtre manqu\xE9es \u2014 ajoutez celles dont il d\xE9pend.",script_triggers_none:"Aucun d\xE9clencheur",simulate:"Simuler",state_add_condition:"Ajouter une clause",state_add_first:"Ajouter une clause",state_add_value:"+ Ajouter un \xE9tat",state_attribute_placeholder:"laisser vide pour comparer l'\xE9tat",state_entity:"Entit\xE9",state_err_entity:"L'entit\xE9 est requise",state_err_incomplete:"Cette condition est incompl\xE8te",state_err_numeric:"La valeur doit \xEAtre un nombre",state_err_state:"L'\xE9tat est requis",state_err_value:"La valeur est requise",state_for:"Pendant (facultatif)",state_new_condition:"(nouvelle condition)",state_not_toggle:"N\xE9gation (NON)",state_op_header:"Comparaison",state_unwrap_group:"Supprimer ces parenth\xE8ses (remonter les enfants au parent)",state_value_label:"Valeur",state_where:"O\xF9",state_wrap:"Regrouper",state_wrap_group:"Entourer ces clauses de parenth\xE8ses",show_more_info:"Afficher plus d'infos",cause_has_time:"V\xE9rification p\xE9riodique de l'heure",cause_switch:"Interrupteur allum\xE9",cause_manual:"Application manuelle",cause_startup:"D\xE9marrage",cause_reloaded:"Recharg\xE9",cause_simulated:"Simulation",cause_clock:"Moment de la journ\xE9e",cause_sun:"Position du soleil",cause_reapply:"R\xE9-ex\xE9cution",cause_duration_for:"pendant",outcome_label_acted:"appliqu\xE9",outcome_label_no_op:"bloqu\xE9",outcome_label_debounced:"inchang\xE9",outcome_label_no_match:"aucune correspondance",outcome_label_skipped:"ignor\xE9",count_action_one:"{n} action",count_action_other:"{n} actions",count_entity_one:"{n} entit\xE9",count_entity_other:"{n} entit\xE9s",count_target_one:"{n} cible",count_target_other:"{n} cibles",count_domain_target_one:"{n} cible ({domain})",count_domain_target_other:"{n} cibles ({domain})",winner_default:"La sc\xE8ne correspondante",outcome_summary_acted_all_skipped:"{winner} a correspondu \u2014 {skipped_phrase} ignor\xE9e(s) (non expos\xE9e(s)) ; rien appliqu\xE9.",outcome_summary_acted_entities:"{winner} appliqu\xE9 \u2014 {acts} sur {entities}.{tail}",outcome_summary_acted:"{winner} appliqu\xE9 \u2014 {acts}.{tail}",outcome_summary_skipped_tail:" ({skipped} ignor\xE9e(s) \u2014 non expos\xE9e(s))",outcome_summary_no_op:"{winner} a correspondu mais n'a aucune action \u2014 elle emp\xEAche les sc\xE8nes inf\xE9rieures de s'appliquer. Rien n'a chang\xE9.",outcome_summary_debounced:"{winner} a correspondu, mais elle est d\xE9j\xE0 appliqu\xE9e \u2014 rien n'a \xE9t\xE9 renvoy\xE9.",outcome_summary_no_match:"Aucune sc\xE8ne n'a correspondu \u2014 rien appliqu\xE9.",outcome_summary_skipped_switch_off:"Ignor\xE9 \u2014 l'interrupteur de pause de la port\xE9e est \xE9teint.",outcome_summary_skipped_scope_disabled:"Ignor\xE9 \u2014 la port\xE9e est d\xE9sactiv\xE9e.",outcome_summary_skipped_unavailable:"Ignor\xE9 \u2014 l'entit\xE9 d\xE9clencheuse est devenue indisponible ; les appareils restent en l'\xE9tat.",section_scene_evaluation:"\xC9valuation des sc\xE8nes",section_actions_taken:"Actions effectu\xE9es",trigger_prefix:"D\xE9clencheur : ",trace_won_prefix:"Gagnante : ",skipped_not_exposed:" \u2014 ignor\xE9e (non expos\xE9e)",trace_scene_prefix:"Sc\xE8ne n\xBA",trace_scene_disabled:"d\xE9sactiv\xE9e",trace_scene_not_reached:"non atteinte",trace_scene_matched:"\u2713 correspond",trace_scene_no_match:"\u2717 aucune correspondance",scene_live:"En direct \u2014 cette sc\xE8ne correspond actuellement et est appliqu\xE9e",scene_applied_stale:"Toujours appliqu\xE9e \u2014 les actions de cette sc\xE8ne sont en vigueur mais elle ne correspond plus",version_update:{message:"Ambience {version} a \xE9t\xE9 install\xE9 \u2014 actualisez pour mettre \xE0 jour.",reload:"Actualiser"}},blocker_summary:{block:"Bloquer",block_mid:"bloque",until:"jusqu'\xE0",while:"tant que",while_lead:"Tant que",or:"ou",and:"et",always:"toujours"},day_summary:{any:"indiff\xE9rent",any_day:"tous les jours",except:"sauf",day_prefix:"jour",last_day:"dernier jour",workday:"jour ouvr\xE9",holiday:"jour f\xE9ri\xE9",first_workday:"premier jour ouvr\xE9",last_workday:"dernier jour ouvr\xE9",date:"{day} {month}"},people_summary:{home:"la maison",is_at:"est \xE0",is_not_at:"n'est pas \xE0"},occupancy_summary:{clear:"libre",detected:"d\xE9tect\xE9"},unavailable_summary:{unavailable:"indisponible"},condition_summary:{is:"est",are:"sont",not:"non",any_of:"L'un de",all_of:"Tous parmi"},compass:{N:"N",NE:"NE",E:"E",SE:"SE",S:"S",SW:"SO",W:"O",NW:"NO"},month:{1:"Janvier",2:"F\xE9vrier",3:"Mars",4:"Avril",5:"Mai",6:"Juin",7:"Juillet",8:"Ao\xFBt",9:"Septembre",10:"Octobre",11:"Novembre",12:"D\xE9cembre"},weather_condition:{"clear-night":"D\xE9gag\xE9 (nuit)",cloudy:"Nuageux",fog:"Brouillard",hail:"Gr\xEAle",lightning:"Orage","lightning-rainy":"Orage pluvieux",partlycloudy:"Partiellement nuageux",pouring:"Pluie battante",rainy:"Pluvieux",snowy:"Neigeux","snowy-rainy":"Neige et pluie",sunny:"Ensoleill\xE9",windy:"Venteux","windy-variant":"Venteux (variante)",exceptional:"Exceptionnel"},weather_attr:{temperature:"Temp\xE9rature",apparent_temperature:"Temp\xE9rature ressentie",humidity:"Humidit\xE9",wind_speed:"Vitesse du vent",pressure:"Pression"},state_op:{is:"est",is_not:"n'est pas",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"ET",or:"OU",and_not:"ET NON",or_not:"OU NON",not:"NON"},trace_reason:{day_workday_sensor_unconfigured:"capteur de jour ouvr\xE9 non configur\xE9",day_workday_calendar_unconfigured:"calendrier des jours ouvr\xE9s non configur\xE9",lux_range_missing:"la plage de lux {range} n'existe plus",lux_sensor_not_numeric:"{name} ({value}) ne rapporte pas un nombre",period_missing:"la p\xE9riode de la journ\xE9e {period} n'existe plus",sun_not_configured:"l'int\xE9gration sun n'est pas configur\xE9e",sun_anchor_undefined:"{anchor} n'est pas d\xE9fini aujourd'hui \xE0 cet emplacement",weather_entity_unconfigured:"entit\xE9 m\xE9t\xE9o non configur\xE9e",weather_group_missing:"le groupe m\xE9t\xE9o {group} n'existe plus"},trace_detail:{not_found:"introuvable",unavailable:"indisponible",all_of:"tous parmi :",any_of:"l'un parmi :",negate:"non",any_sensor:"n'importe quel capteur (sans contrainte)",for_hold:"pendant {rel}{dur}",held:"maintenu {dur}",not_held:"non maintenu",no_people_tracked:"aucune personne suivie",summary_home:"{n} sur {total} \xE0 la maison ({names})",summary_home_zero:"0 sur {total} \xE0 la maison",want:"exige",quant_anyone:"quiconque",quant_everyone:"tout le monde",quant_nobody:"personne",where_home:"\xE0 la maison",where_not_home:"hors de la maison",where_in:"dans {zone}",where_not_in:"hors de {zone}",loc_home:"\xE0 la maison",loc_away:"absent",loc_in:"dans {zone}",loc_not_in:"hors de {zone}",no_occupancy_sensors:"aucun capteur de pr\xE9sence",summary_active:"{n} sur {total} actifs ({names})",summary_active_zero:"0 sur {total} actifs",no_lux_sensors:"aucun capteur de lux",no_lux_readings:"aucune mesure de lux",unknown_range:"plage de lux inconnue : {range}",want_band:"exige {band}",is:"est {values}",is_not:"n'est pas {values}",no_entities:"aucune entit\xE9",unavailable_any:"au moins une indisponible",summary_unavailable:"{n} sur {total} indisponibles ({names})",summary_unavailable_zero:"0 sur {total} indisponibles",sun_prefix:"Soleil",sun_elevation:"{deg}\xB0 d'\xE9l\xE9vation",sun_azimuth:"{deg}\xB0 d'azimut ({sector})"}},de:{time_of_day_period:{dawn:"Morgend\xE4mmerung",morning:"Morgen",afternoon:"Nachmittag",evening:"Abend",nighttime:"Nacht",daytime:"Tag"},weekday:{mon:"Mo",tue:"Di",wed:"Mi",thu:"Do",fri:"Fr",sat:"Sa",sun:"So"},day_item:{weekday:"Wochentag",day_of_month:"Tag im Monat",date:"Datum (j\xE4hrlich)",date_range:"Datumsbereich (j\xE4hrlich)",last_day:"Letzter Tag des Monats",workday:"Arbeitstag",holiday:"Feiertag",first_workday:"Erster Arbeitstag des Monats",last_workday:"Letzter Arbeitstag des Monats"},lux_range:{dark:"Dunkel",dim:"Gedimmt",normal:"Normal",bright:"Hell",very_bright:"Sehr hell"},category_color:{red:"Rot",pink:"Pink",purple:"Lila","deep-purple":"Dunkellila",indigo:"Indigo",blue:"Blau","light-blue":"Hellblau",cyan:"Cyan",teal:"Blaugr\xFCn",green:"Gr\xFCn","light-green":"Hellgr\xFCn",lime:"Limette",yellow:"Gelb",amber:"Bernstein",orange:"Orange","deep-orange":"Dunkelorange",brown:"Braun",grey:"Grau","blue-grey":"Blaugrau"},condition:{time_of_day:"Tageszeit",state:"Entit\xE4tszustand",script:"Skript",sun:"Sonne",template:"Template",lux:"Lux",unavailable:"Nicht verf\xFCgbar"},action:{},anchor:{dawn:"Morgend\xE4mmerung",sunrise:"Sonnenaufgang",noon:"Mittag",sunset:"Sonnenuntergang",dusk:"Abendd\xE4mmerung",midnight:"Mitternacht"},ui:{language_request:{message:"Die Sprache deines Home Assistant ist {language}, aber {product} ist darin noch nicht \xFCbersetzt.",action:"\xDCbersetzung anfragen \u2192",dismiss:"Ausblenden"},panel_title:"Ambience",card_load_failed:"Die Ambience-Karte konnte nicht geladen werden \u2014 pr\xFCfe die Verbindung und lade die Seite neu.",tab_settings:"Einstellungen",settings_tab_ambience:"Erweitert",settings_tab_conditions:"Bedingungen",settings_tab_actions:"Aktionen",settings_ambience_pause_card:"Pausenschalter pro Geltungsbereich",help_pause_switch:"Ambience erstellt f\xFCr jeden aktivierten Bereich, jede Etage und das Haus einen Schalter. Wird der Schalter eines Geltungsbereichs ausgeschaltet, pausiert Ambience f\xFCr diesen Geltungsbereich.",settings_tab_import:"KI",import_title:"Szenen mit KI erstellen & korrigieren",import_beta:"Beta",import_mcp_title:"Live mit dem MCP-Server erstellen",import_mcp_desc:"Installiere den MCP-Server f\xFCr das schnellste Erstellen und Bearbeiten mit Claude Code oder Claude Desktop.",import_mcp_link:"MCP-Server einrichten",import_mcp_recommended:"Empfohlen",import_paste_title:"Alternativ herunterladen und in eine beliebige KI einf\xFCgen",import_help_link:"Installations- & Nutzungsanleitung",import_step1:"Skill oder Plugin einmal installieren",import_step1_desc:"F\xFCge das Ambience-KI-Paket deiner KI hinzu, damit sie Ambience kennenlernt.",import_step2:"KI-Paket herunterladen",import_step2_desc:"Das Paket enth\xE4lt einen Schnappschuss deiner Bereiche, Entit\xE4ten und freigegebenen Aktionen (Standortdaten entfernt), auf dessen Basis die KI arbeitet. Lade es zusammen mit deiner Anfrage bei der KI hoch.",import_step3:"Ergebnis hochladen",import_step3_desc:"Lade die YAML- oder JSON-Datei hoch, die die KI dir gibt. Vor jeder \xC4nderung wird dir eine Vorschau angezeigt, und du kannst \xC4nderungen jederzeit mit \u201ER\xFCckg\xE4ngig\u201C zur\xFCcknehmen.",import_download_bundle:"KI-Paket herunterladen",import_target:"Ziel",import_new_category:"Neue Kategorie zum Anlegen",import_unknown_categories:"Unbekannte Kategorien (zuerst anlegen)",import_adds:"Hinzuf\xFCgen",import_updates:"Aktualisieren",import_removes:"Entfernen",import_confirm:"Importieren",import_done:"Erfolgreich importiert.",import_feedback_title:"Kannst du es besser als die KI?",import_feedback_body:"Wenn die KI dir schlechte Ratschl\xE4ge gibt, teile ihren Vorschlag, deine korrigierte Version und eine kurze Notiz, was falsch war \u2014 damit verbessern wir das Kochbuch, aus dem die KI lernt.",import_feedback_link:"Auf GitHub melden",settings_ambience_field_name:"Name des Schalters",settings_ambience_field_pause:"Pausieren f\xFCr",settings_reapply_enable_label:"Alle Szenen nach Inaktivit\xE4t erneut ausf\xFChren",settings_reapply_interval_label:"Erneut ausf\xFChren nach",apply_on_every_match:"Bei jedem Treffer anwenden",help_apply_on_every_match:"Wenn aktiviert, wendet Ambience die Aktionen dieser Szene jedes Mal erneut an, wenn sie in ihrem Geltungsbereich bzw. ihrer Kategorie gewinnt \u2014 nicht nur, wenn sie zum ersten Mal aktiv wird.",unit_minutes:"Minuten",help:"Hilfe",open_documentation:"Dokumentation \xF6ffnen",read_documentation:"Mehr erfahren",help_switch_name:"Der Name der Pausenschalter-Entit\xE4ten pro Geltungsbereich.",help_pause_for:"Wenn der Schalter eines Geltungsbereichs ausgeschaltet wird, wird er nach so vielen Minuten automatisch wieder aktiviert. 0 = bleibt pausiert, bis er wieder eingeschaltet wird.",help_reapply_toggle:"F\xFChrt die Szenen eines Geltungsbereichs bzw. einer Kategorie nach Inaktivit\xE4t erneut aus und wendet die gewinnende Szene erneut an, falls zuvor eine Aktion fehlgeschlagen ist, etwa wenn ein Licht nicht ausging.",help_reapply_after:"Szenen erneut ausf\xFChren, die seit so vielen Minuten nicht aktualisiert wurden.",settings_expose_group:"F\xFCr Sprachassistenten freigeben",settings_expose_assist:"Assist",settings_expose_google:"Google Assistant",settings_expose_alexa:"Alexa",help_expose:"Gibt die Pausenschalter pro Geltungsbereich f\xFCr die ausgew\xE4hlten Sprachassistenten frei, damit du Ambience per Sprache pausieren und fortsetzen kannst. Google Assistant und Alexa erfordern Home Assistant Cloud oder eine manuelle Einrichtung.",help_actions_tab:"Aktionen sind die Dienstaufrufe, die eine Szene ausf\xFChrt. Lege sie hier an, damit Szenen sie wiederverwenden k\xF6nnen.",help_show_in_scene_editor:"Zeigt dieses Feld im Szenen-Editor, damit jede Szene es setzen kann. Ausgeschaltet lassen, um stattdessen einen festen Standardwert zu senden.",help_set_default:"Ein Wert, der beim Ausf\xFChren der Aktion automatisch gesendet wird. Szenen k\xF6nnen ihn \xFCberschreiben, wenn das Feld auch im Editor angezeigt wird.",help_conditions_tab:"Bedingungen sind die Eingaben, auf die Szenen reagieren (Tageszeit, Anwesenheit, Wetter \u2026). Eine Szene gewinnt, wenn alle ihre Bedingungen erf\xFCllt sind.",help_categories_tab:"Kategorien erm\xF6glichen, dass ein Geltungsbereich mehrere unabh\xE4ngige Gewinner gleichzeitig hat \u2014 pro Kategorie gewinnt eine Szene.",no_areas:"In Home Assistant wurden keine Bereiche gefunden.",not_configured:"nicht konfiguriert",scene_singular:"Szene",scene_plural:"Szenen",all_categories:"Alle Kategorien",add_category:"Kategorie hinzuf\xFCgen\u2026",loading:"L\xE4dt\u2026",any_placeholder:"(beliebig)",include:"Einschlie\xDFen",exclude:"Ausschlie\xDFen",empty_all_days:"(leer \u2192 alle Tage)",add_include_item:"+ Einschluss hinzuf\xFCgen",add_exclude_item:"+ Ausschluss hinzuf\xFCgen",from:"von",to:"bis",remove:"Entfernen",day_of_month_placeholder:"z. B. 1-10, 15",workday_sensor:"Arbeitstag-Sensor",workday_calendar:"Arbeitstag-Kalender",periods_heading:"Zeitr\xE4ume",badge_builtin:"integriert",badge_custom:"benutzerdefiniert",add_custom_period:"+ Benutzerdefinierten Zeitraum hinzuf\xFCgen",lux_heading:"Lux-Bereiche",add_custom_lux_range:"+ Benutzerdefinierten Lux-Bereich hinzuf\xFCgen",lux_modal_add_title:"Benutzerdefinierten Lux-Bereich hinzuf\xFCgen",lux_modal_edit_title:"\u201E{name}\u201C bearbeiten",lux_min_label:"Min (lx)",lux_max_label:"Max (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"ist",occupancy_is_not:"ist nicht",lux_any:"Mindestens eines von",lux_all:"Alle von",lux_is:"ist",lux_is_not:"ist nicht",title_edit:"Bearbeiten",title_delete:"L\xF6schen",new_scene:"Neue Szene",new_scene_default:"Neue Szene",name_optional:"Name (optional)",category:"Kategorie",scope:"Geltungsbereich",when_heading:"Wann",actions_heading:"Aktionen",target:"Ziel",remove_action:"Aktion entfernen",add_action:"+ Aktion hinzuf\xFCgen\u2026",remove_condition:"Bedingung entfernen",add_condition:"+ Bedingung hinzuf\xFCgen\u2026",add_description:"+ Beschreibung hinzuf\xFCgen",description:"Beschreibung",add_action_button:"Aktion hinzuf\xFCgen",cancel:"Abbrechen",save:"Speichern",save_scene:"Szene speichern",at_least_one_target:"Mindestens ein Ziel ist erforderlich.",condition_error:"Behebe den Fehler in dieser Bedingung, bevor du fortf\xE4hrst",no_scenes_yet:"Noch keine Szenen.",add_scene:"+ Szene hinzuf\xFCgen",summary_any:"beliebig",summary_any_paren:"(beliebig)",summary_always:"Immer",no_targets:"(keine Ziele)",action_singular:"Aktion",action_plural:"Aktionen",scene_n:"Szene {n}",drag_to_reorder:"Zum Sortieren ziehen",unpin:"L\xF6sen (zur\xFCck zur automatischen Reihenfolge)",enable_scene:"Szene aktivieren",disable_scene:"Szene deaktivieren",shadowed:"Wird nie ausgel\xF6st \u2014 von einer fr\xFCheren Szene verdeckt.",problem_missing:"Fehlt oder ist in Home Assistant deaktiviert:",problem_overlap:"Von mehreren Gruppen gesteuert:",problem_config:"Konfigurationsprobleme:",problems_count:"{n} Szene(n) mit Problemen",badge_needs_workday_sensor:"ben\xF6tigt einen Arbeitstag-Sensor",badge_needs_workday_calendar:"ben\xF6tigt einen Arbeitstag-Kalender",badge_needs_weather_entity:"ben\xF6tigt eine Wetter-Entit\xE4t",badge_missing_weather_group:"Wettergruppe {id} fehlt",badge_missing_period:"Zeitraum {id} fehlt",badge_missing_lux_range:"Lux-Bereich {id} fehlt",badge_unexposed_action:"Aktion {id} nicht freigegeben",edit:"Bearbeiten",duplicate:"Duplizieren",run_actions:"Aktionen ausf\xFChren",run:"Ausf\xFChren",auto_triggers_section:"Automatische Ausl\xF6ser",auto_triggers_none:"Keine automatischen Ausl\xF6ser.",auto_triggers_opaque_note:"Eine Skript-Szene ist undurchsichtig \u2014 manche Beobachtungen fehlen eventuell. Deklariere sie im Feld \u201EAusl\xF6ser\u201C der Szene.",auto_trigger_group_time:"Zeit",auto_trigger_group_sun:"Sonne",auto_trigger_group_domain:"Personenliste",auto_trigger_domain_membership:"{domains} hinzugef\xFCgt oder entfernt",auto_trigger_date_rollover:"Lokale Mitternacht (Datumswechsel)",auto_trigger_periodic:"regelm\xE4\xDFige Pr\xFCfung",more_actions:"Weitere Aktionen",scene_actions:"Szenenaktionen",error_enter_name:"Bitte gib einen Namen ein.",error_start_letter:"Der Name muss mit einem Buchstaben beginnen.",error_name_exists:"Es gibt bereits einen Eintrag mit diesem Namen. W\xE4hle einen anderen Namen.",period_modal_add_title:"Benutzerdefinierten Zeitraum hinzuf\xFCgen",period_modal_edit_title:"\u201E{name}\u201C bearbeiten",name:"Name",name_placeholder:"z. B. Feierabend",lux_name_placeholder:"z. B. Tr\xFCb",lux_error_need_bound:"Gib ein Minimum, ein Maximum oder beides ein.",lux_error_negative:"Grenzwerte m\xFCssen 0 oder gr\xF6\xDFer sein.",lux_error_order:"Das Minimum muss kleiner als das Maximum sein.",lux_error_not_integer:"Grenzwerte m\xFCssen ganze Zahlen sein.",from_label:"Von",to_label:"Bis",any_time:"Jederzeit",custom_range:"Benutzerdefinierter Bereich",custom_suffix:" (benutzerdefiniert)",add_time_range:"+ weiteren Zeitbereich hinzuf\xFCgen",endpoint_time:"Uhrzeit",endpoint_sun:"Sonne",offset_placeholder:"Versatz",clamp_none:"\u2014",clamp_not_before:"nicht vor",clamp_not_after:"nicht nach",unit_hour:"Stunde",unit_hours:"Stunden",unit_min:"Min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"In diesem Bereich gibt es keine passenden Entit\xE4ten.",field_kind:"Art",field_days_of_month:"Tage des Monats",field_month:"Monat",field_day:"Tag",field_from_month:"Von Monat",field_from_day:"Von Tag",field_to_month:"Bis Monat",field_to_day:"Bis Tag",day_spec_error:"Verwende Tage von 1 bis 31 und Bereiche wie 1-10, durch Kommas getrennt",title_override:"\xDCberschreiben",thresholds:"Schwellenwerte",add_threshold:"+ Schwellenwert hinzuf\xFCgen",weather_entity:"Wetter-Entit\xE4t",groups:"Gruppen",add_group:"+ Gruppe hinzuf\xFCgen",sun:{elevation:"H\xF6he",azimuth:"Azimut",any:"Beliebig",above:"\xDCber",below:"Unter",between:"Zwischen",custom_range:"Benutzerdefiniert"},arguments:"Argumente",form:"Formular",script:"Skript",yaml:"YAML",settings_tab_categories:"Kategorien",category_add:"+ Kategorie hinzuf\xFCgen",category_name_placeholder:"Kategoriename",category_icon:"Symbol",category_color:"Farbe",category_name_blank_error:"Kategorienamen d\xFCrfen nicht leer sein.",category_name_duplicate_error:"Zwei Kategorien d\xFCrfen nicht denselben Namen haben.",category_delete_blocked_last:"Die letzte Kategorie kann nicht gel\xF6scht werden.",category_delete_blocked_in_use:"In dieser Kategorie gibt es noch Szenen \u2014 verschiebe oder l\xF6sche sie zuerst.",category_edit_title:"Kategorie bearbeiten",category_add_title:"Kategorie hinzuf\xFCgen",category_color_none:"Keine Farbe",category_save:"Speichern",view_traces:"Traces anzeigen",pause_scope:"Diesen Geltungsbereich pausieren",resume_scope:"Jetzt fortsetzen",close:"Schlie\xDFen",pick_service:"Dienst ausw\xE4hlen",retry:"Erneut versuchen",action_label_placeholder:"Bezeichnung (optional)",action_no_parameters:"Diese Aktion hat keine konfigurierbaren Felder.",actions_field_help_show:"Aktiviere das Kontrollk\xE4stchen, damit das Feld pro Szene bearbeitbar ist.",actions_field_help_default:"Lege einen Standardwert fest, um das Feld vorzubef\xFCllen.",clear_default:"Standardwert l\xF6schen",set_default:"Standardwert festlegen",default_prefix:"Standard: ",editing:"Wird bearbeitet\u2026",show_in_scene_editor:"Im Szenen-Editor anzeigen",extra_fields_prefix:"Zus\xE4tzliche Felder:",extra_fields_hint:"Diese Felder sind derzeit nicht freigegeben, werden aber trotzdem gesendet.",service_has_no_fields:"Dieser Dienst hat keine Felder.",service_unavailable:"Dienst ist in dieser Home-Assistant-Instanz nicht verf\xFCgbar.",action_unavailable:"Aktion nicht mehr verf\xFCgbar; konfiguriere sie unter Einstellungen \u2192 Aktionen oder entferne diese Aktion.",raw_config_action:"Aktion",raw_config_targets:"Ziele",raw_config_params:"Parameter",occupancy_any:"Mindestens eines von",occupancy_all:"Alle von",occupancy_detected:"Erkannt",occupancy_clear:"Frei",occupancy_for:"seit",day_pick_weekday:"W\xE4hle mindestens einen Wochentag.",state_sentinel:"Zustand",invalid_datetime:"Gib ein g\xFCltiges Datum und eine g\xFCltige Uhrzeit ein.",simulate_title:"Simulieren",simulate_when_hint:"steuert Sonne, Tageszeit, Wochentag & Arbeitstag",simulate_sun_resolved:"\u2192 {time}",simulate_sun_undefined:"{anchor} an diesem Datum nicht verf\xFCgbar",simulate_sun_unresolved:"Diese Sonnenzeit kann f\xFCr das gew\xE4hlte Datum nicht ermittelt werden.",simulate_inputs_heading:"Eingaben, von denen diese Kategorie abh\xE4ngt",simulate_button:"Simulieren",reset_to_now:"Auf jetzt zur\xFCcksetzen",reset_to_live:"Auf Live zur\xFCcksetzen",true_label:"Wahr",false_label:"Falsch",for_at_least:"mindestens",for_less_than:"weniger als",for_label:"Seit",duration_held_hint:"Wie lange dieser Zustand schon anh\xE4lt (h:m:s)",away:"Abwesend",home:"Zu Hause",refresh:"Aktualisieren",new_traces_refresh:"Neue Traces \u2014 aktualisieren",clear_traces:"Leeren",download_diagnostics:"Diagnose herunterladen",no_traces_yet:"F\xFCr diese Kategorie gibt es noch keine Traces.",yaml_expect_object:"Ein Objekt wurde erwartet",yaml_script_string:"`script` muss eine Zeichenkette 'script.<name>' sein",yaml_args_object:"`args` muss ein Objekt sein, falls vorhanden",yaml_triggers_list:"`triggers` muss eine Liste von entity_id-Zeichenketten sein, falls vorhanden",template_result:"Ergebnis",template_truthy:"wahr \u2014 trifft zu",template_falsy:"falsch \u2014 trifft nicht zu",conditions_hint_body:"Richte Arbeitstag und Wetter unter Bedingungen ein, um sie in den Szenenbedingungen zu verwenden.",conditions_hint_body_weather:"Richte Wetter unter Bedingungen ein, um es in den Szenenbedingungen zu verwenden.",conditions_hint_body_workday:"Richte Arbeitstag unter Bedingungen ein, um ihn in den Szenenbedingungen zu verwenden.",conditions_hint_cta:"Bedingungen einrichten",conditions_hint_title:"Optional: Arbeitstag & Wetter einrichten",conditions_hint_title_weather:"Optional: Wetter einrichten",conditions_hint_title_workday:"Optional: Arbeitstag einrichten",dismiss:"Ausblenden",fado_notice_title:"Empfohlen: Fado Light Fader installieren",fado_notice_body:"Fado erg\xE4nzt sanftes Dimmen f\xFCr Helligkeit, Farbe und Farbtemperatur \u2014 mit automatischer Helligkeitswiederherstellung, automatischer UI-Konfiguration und nativen \xDCberg\xE4ngen. Es ist im Home Assistant Marketplace verf\xFCgbar, in \xE4lteren Versionen in HACS.",fado_notice_cta:"Fado installieren",for_prefix:"seit",name_duplicate:"In dieser Kategorie gibt es bereits eine Szene mit diesem Namen.",no_exposed_actions:"F\xFCge Dienste unter Einstellungen \u2192 Aktionen hinzu.",people_for:"seit",people_is_at:"Ist:",people_is_at_static:"ist:",people_is_not_at:"Ist nicht:",people_mode_all:"Alle von:",people_mode_any:"Mindestens eine von:",people_mode_anybody:"Irgendjemand",people_mode_everybody:"Alle",people_mode_nobody:"Niemand",people_mode_none:"Keine von:",people_none_tracked:"Keine Personen erfasst",people_select_one:"W\xE4hle mindestens eine Person",unavailable_select_one:"W\xE4hle mindestens eine Entit\xE4t",people_where_home:"Zu Hause",scope_house:"Haus",history_nothing_to_undo:"Nichts zum R\xFCckg\xE4ngigmachen",history_nothing_to_redo:"Nichts zum Wiederholen",history_undo_tooltip:"R\xFCckg\xE4ngig: {change}",history_redo_tooltip:"Wiederholen: {change}",history_untitled:"Ohne Titel",history_action_add:"Szene \u201E{scene}\u201C in {scope} hinzugef\xFCgt",history_action_edit:"Szene \u201E{scene}\u201C in {scope} bearbeitet",history_action_delete:"Szene \u201E{scene}\u201C in {scope} gel\xF6scht",history_action_reorder:"Szenen in {scope} neu sortiert",history_action_unpin:"Szene \u201E{scene}\u201C in {scope} gel\xF6st",history_action_toggle:"Szene \u201E{scene}\u201C in {scope} umgeschaltet",history_conflict_body:"Ein anderer Tab hat die Szenen in diesem Geltungsbereich ge\xE4ndert, w\xE4hrend du bearbeitet hast.",history_conflict_overwrite:"Andere Version \xFCberschreiben",history_conflict_load:"Andere Version laden",script_triggers:"Ausl\xF6ser",script_triggers_help:"Diese Szene neu auswerten, wenn sich diese Entit\xE4ten \xE4ndern. Ein Skript ist undurchsichtig, daher k\xF6nnen Template-Verweise \xFCbersehen werden \u2014 f\xFCge alle hinzu, von denen es abh\xE4ngt.",script_triggers_none:"Keine Ausl\xF6ser",simulate:"Simulieren",state_add_condition:"Klausel hinzuf\xFCgen",state_add_first:"Klausel hinzuf\xFCgen",state_add_value:"+ Zustand hinzuf\xFCgen",state_attribute_placeholder:"leer lassen, um den Zustand zu vergleichen",state_entity:"Entit\xE4t",state_err_entity:"Entit\xE4t ist erforderlich",state_err_incomplete:"Diese Bedingung ist unvollst\xE4ndig",state_err_numeric:"Der Wert muss eine Zahl sein",state_err_state:"Zustand ist erforderlich",state_err_value:"Wert ist erforderlich",state_for:"Seit (optional)",state_new_condition:"(neue Bedingung)",state_not_toggle:"Negieren (NICHT)",state_op_header:"Vergleich",state_unwrap_group:"Diese Klammern entfernen (Kinder eine Ebene nach oben verschieben)",state_value_label:"Wert",state_where:"Wo",state_wrap:"In Gruppe fassen",state_wrap_group:"Diese Klauseln in Klammern setzen",show_more_info:"Mehr Infos anzeigen",cause_has_time:"Periodische Zeitpr\xFCfung",cause_switch:"Schalter eingeschaltet",cause_manual:"Manuell angewendet",cause_startup:"Start",cause_reloaded:"Neu geladen",cause_simulated:"Simulation",cause_clock:"Tageszeit",cause_sun:"Sonnenstand",cause_reapply:"Erneut ausgef\xFChrt",cause_duration_for:"seit",outcome_label_acted:"angewendet",outcome_label_no_op:"blockiert",outcome_label_debounced:"unver\xE4ndert",outcome_label_no_match:"kein Treffer",outcome_label_skipped:"\xFCbersprungen",count_action_one:"{n} Aktion",count_action_other:"{n} Aktionen",count_entity_one:"{n} Entit\xE4t",count_entity_other:"{n} Entit\xE4ten",count_target_one:"{n} Ziel",count_target_other:"{n} Ziele",count_domain_target_one:"{n} Ziel ({domain})",count_domain_target_other:"{n} Ziele ({domain})",winner_default:"Die passende Szene",outcome_summary_acted_all_skipped:"{winner} traf zu \u2014 {skipped_phrase} \xFCbersprungen (nicht freigegeben); nichts angewendet.",outcome_summary_acted_entities:"{winner} angewendet \u2014 {acts} auf {entities}.{tail}",outcome_summary_acted:"{winner} angewendet \u2014 {acts}.{tail}",outcome_summary_skipped_tail:" ({skipped} \xFCbersprungen \u2014 nicht freigegeben)",outcome_summary_no_op:"{winner} traf zu, hat aber keine Aktionen und blockiert damit niedrigere Szenen. Nichts ge\xE4ndert.",outcome_summary_debounced:"{winner} traf zu, ist aber bereits angewendet \u2014 nichts wurde erneut gesendet.",outcome_summary_no_match:"Keine Szene traf zu \u2014 nichts angewendet.",outcome_summary_skipped_switch_off:"\xDCbersprungen \u2014 der Pausenschalter des Geltungsbereichs ist aus.",outcome_summary_skipped_scope_disabled:"\xDCbersprungen \u2014 der Geltungsbereich ist deaktiviert.",outcome_summary_skipped_unavailable:"\xDCbersprungen \u2014 die ausl\xF6sende Entit\xE4t ist nicht verf\xFCgbar; Ger\xE4te bleiben, wie sie sind.",section_scene_evaluation:"Szenenauswertung",section_actions_taken:"Ausgef\xFChrte Aktionen",trigger_prefix:"Ausl\xF6ser: ",trace_won_prefix:"Gewonnen: ",skipped_not_exposed:" \u2014 \xFCbersprungen (nicht freigegeben)",trace_scene_prefix:"Szene #",trace_scene_disabled:"deaktiviert",trace_scene_not_reached:"nicht erreicht",trace_scene_matched:"\u2713 trifft zu",trace_scene_no_match:"\u2717 trifft nicht zu",scene_live:"Jetzt aktiv \u2014 diese Szene trifft zu und wird angewendet",scene_applied_stale:"Noch angewendet \u2014 die Aktionen dieser Szene sind wirksam, sie trifft aber nicht mehr zu",version_update:{message:"Ambience {version} wurde installiert \u2014 lade neu, um zu aktualisieren.",reload:"Neu laden"}},blocker_summary:{block:"Blockiert",block_mid:"blockiert",until:"bis",while:"w\xE4hrend",while_lead:"W\xE4hrend",or:"oder",and:"und",always:"immer"},day_summary:{any:"beliebig",any_day:"beliebiger Tag",except:"au\xDFer",day_prefix:"Tag",last_day:"letzter Tag",workday:"Arbeitstag",holiday:"Feiertag",first_workday:"erster Arbeitstag",last_workday:"letzter Arbeitstag",date:"{day}. {month}"},people_summary:{home:"zu Hause",is_at:"ist:",is_not_at:"ist nicht:"},occupancy_summary:{clear:"frei",detected:"erkannt"},unavailable_summary:{unavailable:"nicht verf\xFCgbar"},condition_summary:{is:"ist",are:"sind",not:"nicht",any_of:"Mindestens eines von",all_of:"Alle von"},compass:{N:"N",NE:"NO",E:"O",SE:"SO",S:"S",SW:"SW",W:"W",NW:"NW"},month:{1:"Januar",2:"Februar",3:"M\xE4rz",4:"April",5:"Mai",6:"Juni",7:"Juli",8:"August",9:"September",10:"Oktober",11:"November",12:"Dezember"},weather_condition:{"clear-night":"Klar (Nacht)",cloudy:"Bew\xF6lkt",fog:"Nebel",hail:"Hagel",lightning:"Gewitter","lightning-rainy":"Gewitter mit Regen",partlycloudy:"Teilweise bew\xF6lkt",pouring:"Starkregen",rainy:"Regen",snowy:"Schnee","snowy-rainy":"Schneeregen",sunny:"Sonnig",windy:"Windig","windy-variant":"Windig (Variante)",exceptional:"Au\xDFergew\xF6hnlich"},weather_attr:{temperature:"Temperatur",apparent_temperature:"Gef\xFChlte Temperatur",humidity:"Luftfeuchtigkeit",wind_speed:"Windgeschwindigkeit",pressure:"Luftdruck"},state_op:{is:"ist",is_not:"ist nicht",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"UND",or:"ODER",and_not:"UND NICHT",or_not:"ODER NICHT",not:"NICHT"},trace_reason:{day_workday_sensor_unconfigured:"Arbeitstag-Sensor nicht konfiguriert",day_workday_calendar_unconfigured:"Arbeitstag-Kalender nicht konfiguriert",lux_range_missing:"Lux-Bereich {range} existiert nicht mehr",lux_sensor_not_numeric:"{name} ({value}) liefert keine Zahl",period_missing:"Tageszeit-Zeitraum {period} existiert nicht mehr",sun_not_configured:"die Integration Sonne ist nicht eingerichtet",sun_anchor_undefined:"{anchor} ist an diesem Standort heute nicht definiert",weather_entity_unconfigured:"Wetter-Entit\xE4t nicht konfiguriert",weather_group_missing:"Wettergruppe {group} existiert nicht mehr"},trace_detail:{not_found:"nicht gefunden",unavailable:"nicht verf\xFCgbar",all_of:"alle von:",any_of:"mindestens eine von:",negate:"nicht",any_sensor:"beliebiger Sensor (keine Einschr\xE4nkung)",for_hold:"seit {rel}{dur}",held:"{dur} gehalten",not_held:"nicht gehalten",no_people_tracked:"keine Personen erfasst",summary_home:"{n} von {total} zu Hause ({names})",summary_home_zero:"0 von {total} zu Hause",want:"erwartet",quant_anyone:"irgendjemand",quant_everyone:"alle",quant_nobody:"niemand",where_home:"zu Hause",where_not_home:"nicht zu Hause",where_in:"in {zone}",where_not_in:"nicht in {zone}",loc_home:"zu Hause",loc_away:"abwesend",loc_in:"in {zone}",loc_not_in:"nicht in {zone}",no_occupancy_sensors:"keine Anwesenheitssensoren",summary_active:"{n} von {total} aktiv ({names})",summary_active_zero:"0 von {total} aktiv",no_lux_sensors:"keine Lux-Sensoren",no_lux_readings:"keine Lux-Messwerte",unknown_range:"unbekannter Lux-Bereich: {range}",want_band:"erwartet {band}",is:"ist {values}",is_not:"ist nicht {values}",no_entities:"keine Entit\xE4ten",unavailable_any:"mindestens eine nicht verf\xFCgbar",summary_unavailable:"{n} von {total} nicht verf\xFCgbar ({names})",summary_unavailable_zero:"0 von {total} nicht verf\xFCgbar",sun_prefix:"Sonne",sun_elevation:"{deg}\xB0 H\xF6he",sun_azimuth:"{deg}\xB0 Azimut ({sector})"}}};function $l(t){return t.toLowerCase().split(/[-_]/)[0]}function aa(t){let n=t.replace(/_/g,"-");return{code:n,base:$l(n)}}function Sl(t){let n=t?.language,e=[];if(n){let{code:i,base:r}=aa(n);i in gt&&e.push(i),r!==i&&r in gt&&e.push(r)}return e.includes("en")||e.push("en"),e}var Cl=new Set(["pt-BR"]);function sa(t){let n=t?.language;if(!n)return{available:!0,code:"",baseCode:""};let{code:e,base:i}=aa(n);return{available:e in gt||!Cl.has(e)&&i in gt,code:e,baseCode:i}}function oa(t){if(!t)return t;try{let n=new Intl.DisplayNames([t],{type:"language"}).of(t);if(n&&n!==t)return n}catch{}try{let n=new Intl.DisplayNames(["en"],{type:"language"}).of(t);if(n&&n!==t)return n}catch{}return t}function la(t,n){return n?t.replace(/\{(\w+)\}/g,(e,i)=>i in n?n[i]:e):t}function El(t,n){let e=t;for(let i of n){if(e===null||typeof e!="object")return;e=e[i]}return typeof e=="string"?e:void 0}function Al(t,n){let e="component.ambience.";if(!n.startsWith(e))return;let i=n.slice(e.length).split(".");for(let r of Sl(t)){let a=gt[r];if(!a)continue;let s=El(a,i);if(s!==void 0)return s}}function da(t,n,e){let i=e?Object.entries(e).flat():[],r=t?.localize?.(n,...i);if(r&&r!==n)return r;let a=Al(t,n);if(a!==void 0)return la(a,e)}function G(t,n,e,i){return da(t,n,i)??la(e,i)}function F(t){let n=t.replaceAll("_"," ").toLowerCase();return n.charAt(0).toUpperCase()+n.slice(1)}function Un(t){return F(t)}function Li(t){let n=t.indexOf("."),e=n===-1?"":t.slice(0,n),r=(n===-1?t:t.slice(n+1)).replaceAll("_"," ").trim().toLowerCase(),a=e.replaceAll("_"," ").trim().toLowerCase(),s=r?r.split(" "):[],d=a?a.split(" "):[],u=d.length>0&&d.every(p=>s.includes(p)),h=!a||u?r:`${r} ${a}`;return h.charAt(0).toUpperCase()+h.slice(1)}function ft(t,n,e){let i=n?.find(r=>r.id===t);return i?.label?.trim()?i.label:e()}function Ll(t){return t.replace(/_/g," ").replace(/\bid\b/g,"ID").replace(/\bip\b/g,"IP").replace(/\bmac\b/g,"MAC").replace(/\bgps\b/g,"GPS").replace(/^\w/,n=>n.toUpperCase())}function Ti(t,n,e){let i=t?.formatEntityAttributeName;if(i&&n){let r=i(n,e);if(r)return r}return Ll(e)}function De(t,n,e,i){if(!n)return i;let r=t;if(e){let a=r?.formatEntityAttributeValue;if(a){let s=a(n,e,i);if(s)return s}}else{let a=r?.formatEntityState;if(a){let s=a(n,i);if(s)return s}}return i}function K(t,n){return G(t,`component.ambience.condition.${n}`,Un(n))}function Pi(t,n){return G(t,`component.ambience.action.${n}`,Un(n))}function ne(t,n){return G(t,`component.ambience.anchor.${n}`,Un(n))}function he(t,n,e){let i=e[n]?.label;return i||G(t,`component.ambience.time_of_day_period.${n}`,F(n))}function Re(t,n,e){let i=e[n]?.label;return i||G(t,`component.ambience.lux_range.${n}`,F(n))}function ca(t,n,e){return G(t,`component.ambience.category_color.${n}`,e)}function o(t,n,e,i){return G(t,`component.ambience.${n}`,e,i)}function ua(t,n,e,i){return da(t,`component.ambience.${n}`,i)??e}var Tl=["mon","tue","wed","thu","fri","sat","sun"];function Di(t,n){let e=Tl[n];return G(t,`component.ambience.weekday.${e}`,e??String(n))}function Ri(t,n){return G(t,`component.ambience.day_item.${n}`,F(n))}function Ii(t,n){return G(t,`component.ambience.month.${n}`,String(n))}function vt(t,n){return G(t,`component.ambience.compass.${n}`,n)}function yt(t,n){return G(t,`component.ambience.weather_condition.${n}`,F(n))}function qt(t,n){return G(t,`component.ambience.weather_attr.${n}`,F(n))}var Pl={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},Dl={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},Rl={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function Wn(t,n,e){if(n==="humidity")return"%";let i=Rl[n];if(i){let s=e?.attributes?.[i];if(typeof s=="string"&&s)return s}let r=Dl[n],a=t?.config?.unit_system;return r&&a&&typeof a[r]=="string"?a[r]:Pl[n]??""}function C(t,n){let e=n,i=e?.translation_key;if(i){let r=e?.translation_placeholders??{},a=G(t,`component.ambience.exceptions.${i}`,"",r);if(a)return a}return e?.message?e.message:n instanceof Error?n.message:String(n)}function j(t,n){return G(t,`component.ambience.state_op.${n}`,n)}var Il=import.meta.url.slice(0,import.meta.url.lastIndexOf("/")+1);function ha(t){return Il+t}function pa(t,n,e){let i=e.title??"Ambience",r=e.dark?`dark_${t}`:t,a=ha(`${r}.png`),s=ha(`${r}@2x.png`);return l`<img
    class=${n}
    src=${a}
    srcset="${a} 1x, ${s} 2x"
    alt=${i}
  />`}function ma(t={}){return pa("logo","ambience-logo",t)}function _a(t={}){return pa("icon","ambience-icon",t)}var ga="ambience-filter-category",fa="ambience-expanded-scopes",va="ambience-collapsed-categories",ya="ambience-conditions-hint-dismissed",ba="ambience-fado-notice-dismissed";function Hi(){try{return window.localStorage.getItem(ga)??""}catch{return""}}function wa(t){try{window.localStorage.setItem(ga,t)}catch{}}function Bn(t){try{let n=window.localStorage.getItem(t);if(!n)return[];let e=JSON.parse(n);return Array.isArray(e)?e.filter(i=>typeof i=="string"):[]}catch{return[]}}function xa(){return Bn(fa)}function ka(t){try{window.localStorage.setItem(fa,JSON.stringify(t))}catch{}}function $a(){return Bn(va)}function Sa(t){try{window.localStorage.setItem(va,JSON.stringify(t))}catch{}}function Ca(t,n){if(!n)return!1;try{return window.localStorage.getItem(t)===n}catch{return!1}}function Ea(t,n){if(n)try{window.localStorage.setItem(t,n)}catch{}}function Aa(t){return Ca(ya,t)}function La(t){Ea(ya,t)}function Ta(t){return Ca(ba,t)}function Pa(t){Ea(ba,t)}var Da="ambience-lang-request-dismissed";function Ra(){return Bn(Da)}function Ia(t){return Ra().includes(t)}function Ha(t){try{let n=Ra();if(n.includes(t))return;window.localStorage.setItem(Da,JSON.stringify([...n,t]))}catch{}}async function Na(t){return t.callWS({type:"ambience/areas/list"})}async function Ut(t,n){return t.callWS({type:"ambience/area/get",area_id:n})}function Ni(t){return{scenes:t.scenes??[]}}async function Vn(t,n,e,i,r){return t.callWS({type:"ambience/area/save",area_id:n,config:Ni(e),...i?{change:i}:{},...r?.minimisePins?{minimise_pins:!0}:{}})}async function za(t){return t.callWS({type:"ambience/floors/list"})}async function Wt(t,n){return t.callWS({type:"ambience/floor/get",floor_id:n})}async function Gn(t,n,e,i,r){return t.callWS({type:"ambience/floor/save",floor_id:n,config:Ni(e),...i?{change:i}:{},...r?.minimisePins?{minimise_pins:!0}:{}})}async function Bt(t){return t.callWS({type:"ambience/house/get"})}async function Kn(t,n,e,i){return t.callWS({type:"ambience/house/save",config:Ni(n),...e?{change:e}:{},...i?.minimisePins?{minimise_pins:!0}:{}})}async function zi(t){return t.callWS({type:"ambience/conditions/list"})}async function Oi(t){return(await t.callWS({type:"ambience/install_id"})).install_id}async function Oa(t){return t.callWS({type:"ambience/frontend_version"})}async function Ma(t,n,e,i){let r={type:"ambience/auto_triggers/list",scope_kind:n};return e!=null&&(r.scope_id=e),i!=null&&(r.category=i),t.callWS(r)}async function Vt(t){return t.callWS({type:"ambience/exposed_actions/list"})}async function Fa(t,n){return t.callWS({type:"ambience/exposed_actions/save",actions:n})}async function ja(t){return t.callWS({type:"ambience/services/list"})}async function Ie(t,n){return t.callWS({type:"ambience/services/get_schema",service:n})}function Yn(t){return t.kind==="area"?{area_id:t.id}:t.kind==="floor"?{floor_id:t.id}:{house:!0}}async function qa(t,n,e){let i={type:"ambience/apply",...Yn(n)};return e!==void 0&&(i.category_id=e),t.callWS(i)}async function Ua(t,n,e){return t.callWS({type:"ambience/scene/run_actions",scene_index:e,...Yn(n)})}async function Mi(t){return t.callWS({type:"ambience/time_of_day_periods/list"})}async function Wa(t,n,e){return t.callWS({type:"ambience/time_of_day_periods/save",custom:n,hidden:e})}async function Fi(t){return t.callWS({type:"ambience/lux_ranges/list"})}async function Ba(t,n,e){return t.callWS({type:"ambience/lux_ranges/save",custom:n,hidden:e})}async function Gt(t){return t.callWS({type:"ambience/conditions/day/config/list"})}async function Va(t,n,e){return t.callWS({type:"ambience/conditions/day/config/save",workday_sensor:n,workday_calendar:e})}async function Kt(t){return t.callWS({type:"ambience/conditions/weather/config/list"})}async function Ga(t,n,e){return t.callWS({type:"ambience/conditions/weather/config/save",entity:n,groups:e})}async function Qn(t,n){return t.callWS({type:"ambience/state/known_states",entity_id:n})}async function Jn(t,n,e){return t.callWS({type:"ambience/state/known_attribute_values",entity_id:n,attribute:e})}async function Ka(t){return t.callWS({type:"ambience/switch_defaults/list"})}async function Ya(t){return t.callWS({type:"ambience/switches/list"})}async function Qa(t,n,e){return t.callWS({type:"ambience/set_scope_enabled",...Yn(n),enabled:e})}async function Ja(t,n,e){return t.callWS({type:"ambience/switch_defaults/save",name:n,auto_on_delay_seconds:e})}async function Za(t){return t.callWS({type:"ambience/reapply/list"})}async function Xa(t,n,e){return t.callWS({type:"ambience/reapply/save",enabled:n,interval_seconds:e})}async function es(t){return t.callWS({type:"ambience/exposed_assistants/list"})}async function ts(t,n,e,i){return t.callWS({type:"ambience/exposed_assistants/save",expose_assist:n,expose_google:e,expose_alexa:i})}async function Se(t){return(await t.callWS({type:"ambience/categories/list"})).categories}async function ji(t,n){await t.callWS({type:"ambience/categories/save",categories:n})}async function is(t,n){await t.callWS({type:"ambience/categories/delete",category_id:n})}async function Zn(t){return(await t.callWS({type:"ambience/traces/list"})).traces}async function ns(t){await t.callWS({type:"ambience/traces/clear"})}async function rs(t,n){let e=t.connection;if(!e.subscribeMessage)return()=>{};try{return await e.subscribeMessage(n,{type:"ambience/live/subscribe"})}catch{return()=>{}}}async function as(t,n){let e=t.connection;if(!e.subscribeMessage)return()=>{};try{return await e.subscribeMessage(n,{type:"ambience/history/subscribe"})}catch{return()=>{}}}async function ss(t){return t.callWS({type:"ambience/history/undo"})}async function os(t){return t.callWS({type:"ambience/history/redo"})}function ls(t,n){let e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),i=URL.createObjectURL(e),r=document.createElement("a");r.href=i,r.download=n,document.body.appendChild(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(i),1e4)}function Hl(t){return t.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}async function ds(t,n,e,i){let r=await t.callWS({type:"ambience/diagnostics/scope",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e}),a=Hl(i??"")||e;ls(r,`ambience-${n.scope_kind}-${n.scope_id??"house"}-${a}.json`)}async function Nl(t){return t.callWS({type:"ambience/ai_bundle"})}async function cs(t){ls(await Nl(t),"ambience-ai-bundle.json")}async function us(t,n){await t.callWS({type:"ambience/validate",config:Ni(n)})}async function hs(t,n){return n.kind==="area"?Ut(t,n.id):n.kind==="floor"?Wt(t,n.id):Bt(t)}async function ps(t,n,e,i,r){return n.kind==="area"?Vn(t,n.id,e,i,r):n.kind==="floor"?Gn(t,n.id,e,i,r):Kn(t,e,i,r)}async function ms(t,n,e){return t.callWS({type:"ambience/simulate/inputs",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e})}async function _s(t,n){return(await t.callWS({type:"ambience/simulate/sun_anchors",date:n})).anchors}async function gs(t,n,e,i,r,a,s){return t.callWS({type:"ambience/simulate",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e,now:i,overrides:r,verdicts:a,prev_applied:s})}var Xn=[{id:"red",label:"Red",hex:"#f44336"},{id:"pink",label:"Pink",hex:"#e91e63"},{id:"purple",label:"Purple",hex:"#9c27b0"},{id:"deep-purple",label:"Deep purple",hex:"#673ab7"},{id:"indigo",label:"Indigo",hex:"#3f51b5"},{id:"blue",label:"Blue",hex:"#2196f3"},{id:"light-blue",label:"Light blue",hex:"#03a9f4"},{id:"cyan",label:"Cyan",hex:"#00bcd4"},{id:"teal",label:"Teal",hex:"#009688"},{id:"green",label:"Green",hex:"#4caf50"},{id:"light-green",label:"Light green",hex:"#8bc34a"},{id:"lime",label:"Lime",hex:"#cddc39"},{id:"yellow",label:"Yellow",hex:"#ffeb3b"},{id:"amber",label:"Amber",hex:"#ffc107"},{id:"orange",label:"Orange",hex:"#ff9800"},{id:"deep-orange",label:"Deep orange",hex:"#ff5722"},{id:"brown",label:"Brown",hex:"#795548"},{id:"grey",label:"Grey",hex:"#9e9e9e"},{id:"blue-grey",label:"Blue grey",hex:"#607d8b"}];function er(t){if(t)return Xn.find(n=>n.id===t)?.hex}function zl(t){let n=t.replace("#",""),e=parseInt(n.slice(0,2),16)/255,i=parseInt(n.slice(2,4),16)/255,r=parseInt(n.slice(4,6),16)/255,a=d=>d<=.03928?d/12.92:((d+.055)/1.055)**2.4;return .2126*a(e)+.7152*a(i)+.0722*a(r)>.5?"#000000":"#ffffff"}function qi(t){let n=er(t);return n?`background:${n};color:${zl(n)}`:""}var Ui=y`
  .category-swatch {
    flex: 0 0 auto;
    width: var(--category-swatch-size, 2rem);
    height: var(--category-swatch-size, 2rem);
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--secondary-background-color, #e0e0e0);
    color: var(--secondary-text-color, #555);
  }
  .category-swatch ha-icon {
    --mdc-icon-size: var(--category-swatch-icon-size, 20px);
  }
`;function bt(t,n){return l`<span class="category-swatch" style=${qi(t)}>
    ${n?l`<ha-icon icon=${n}></ha-icon>`:""}
  </span>`}var pe=class extends b{constructor(){super(...arguments);this._categories=[];this._sortedCategories=[];this._filterCategory=Hi();this._open=!1;this._loaded=!1;this._onCategoriesChanged=async()=>{try{await this._fetchCategories()}catch{}};this._onDocClick=e=>{this._open&&!e.composedPath().includes(this)&&(this._open=!1)}}async _fetchCategories(){let e=await Se(this.hass);this.isConnected&&(this._categories=e,this._filterCategory&&!e.some(i=>i.id===this._filterCategory)&&this._select(""))}async connectedCallback(){super.connectedCallback(),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("click",this._onDocClick);try{await this._fetchCategories()}catch{}finally{this.isConnected&&(this._loaded=!0)}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("click",this._onDocClick)}willUpdate(e){e.has("_categories")&&(this._sortedCategories=[...this._categories].sort((i,r)=>i.name.localeCompare(r.name)))}_select(e){this._filterCategory=e,wa(e),this._open=!1,this.dispatchEvent(new CustomEvent("ambience-filter-changed",{detail:{category:e},bubbles:!0,composed:!0}))}_openSettings(){this._open=!1,this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:"categories"},bubbles:!0,composed:!0}))}_renderEntry(e){return e===null?l`
        ${bt(void 0,"mdi:filter-variant")}
        <span class="category-name"
          >${o(this.hass,"ui.all_categories","All categories")}</span
        >
      `:l`
      ${bt(e.color,e.icon)}
      <span class="category-name">${e.name}</span>
    `}_renderAddCategory(e){return l`
      <button
        class="category-filter-add${e?" category-filter-add--footer":""}"
        @click=${()=>this._openSettings()}
      >
        <ha-icon icon="mdi:plus"></ha-icon>
        <span class="category-name"
          >${o(this.hass,"ui.add_category","Add category\u2026")}</span
        >
      </button>
    `}render(){if(!this._loaded)return l``;if(this._categories.length<=1)return this._renderAddCategory(!1);let e=this._sortedCategories,i=this._categories.find(r=>r.id===this._filterCategory)??null;return l`
      <div class="category-filter">
        <button
          class="category-filter-trigger"
          aria-haspopup="listbox"
          aria-expanded=${this._open}
          @click=${()=>{this._open=!this._open}}
        >
          ${this._renderEntry(i)}
          <ha-icon class="caret" icon="mdi:menu-down"></ha-icon>
        </button>
        ${this._open?l`
              <div class="category-filter-menu">
                <div class="category-filter-options" role="listbox">
                  <button
                    class="category-filter-option"
                    role="option"
                    aria-selected=${this._filterCategory===""}
                    @click=${()=>this._select("")}
                  >
                    ${this._renderEntry(null)}
                  </button>
                  ${e.map(r=>l`<button
                        class="category-filter-option"
                        role="option"
                        aria-selected=${this._filterCategory===r.id}
                        @click=${()=>this._select(r.id)}
                      >
                        ${this._renderEntry(r)}
                      </button>`)}
                </div>
                ${this._renderAddCategory(!0)}
              </div>
            `:k}
      </div>
    `}};pe.styles=[Ui,y`
      :host {
        display: block;
      }
      .category-filter {
        position: relative;
        min-width: 18rem;
      }
      /* Trigger keeps a stable height regardless of the selection (the swatch is
       always present), so picking a category never resizes the control. */
      .category-filter-trigger {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        width: 100%;
        min-height: 48px;
        box-sizing: border-box;
        padding: 0.4rem 0.6rem 0.4rem 0.5rem;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #212121);
        cursor: pointer;
        font: inherit;
        font-size: 1rem;
      }
      .category-filter-trigger:hover {
        background: var(--secondary-background-color, #f5f5f5);
      }
      .category-filter-trigger .category-name {
        flex: 1;
        text-align: left;
      }
      .category-filter-trigger .caret {
        color: var(--secondary-text-color, #888);
        flex: 0 0 auto;
      }
      .category-filter-menu {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        z-index: 11;
        max-height: 60vh;
        overflow-y: auto;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
        padding: 0.35rem;
      }
      /* Shared row layout for the filter options and the add-category action. */
      .category-filter-option,
      .category-filter-add {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        width: 100%;
        min-height: 44px;
        box-sizing: border-box;
        padding: 0.4rem 0.6rem;
        border: 0;
        border-radius: 6px;
        background: none;
        cursor: pointer;
        font: inherit;
        font-size: 1rem;
        text-align: left;
      }
      .category-filter-option:hover,
      .category-filter-add:hover {
        background: var(--secondary-background-color, #f5f5f5);
      }
      .category-filter-option {
        color: var(--primary-text-color, #212121);
      }
      .category-filter-option[aria-selected="true"] {
        background: var(--secondary-background-color, #eee);
        font-weight: 600;
      }
      /* The add-category action uses the accent colour so it reads as an action,
       not a filter. The footer variant (inside the dropdown) adds a divider
       separating it from the options above. */
      .category-filter-add {
        color: var(--primary-color, #03a9f4);
      }
      .category-filter-add--footer {
        margin-top: 0.35rem;
        border-top: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 0 0 6px 6px;
      }
      .category-name {
        flex: 1;
      }
    `],c([m({attribute:!1})],pe.prototype,"hass",2),c([g()],pe.prototype,"_categories",2),c([g()],pe.prototype,"_filterCategory",2),c([g()],pe.prototype,"_open",2),c([g()],pe.prototype,"_loaded",2),pe=c([w("ambience-category-filter")],pe);var Ce={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Wi=t=>(...n)=>({_$litDirective$:t,values:n}),wt=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,i){this._$Ct=n,this._$AM=e,this._$Ci=i}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:Ol}=ia,fs=t=>t;var ys=t=>t.strings===void 0,vs=()=>document.createComment(""),xt=(t,n,e)=>{let i=t._$AA.parentNode,r=n===void 0?t._$AB:n._$AA;if(e===void 0){let a=i.insertBefore(vs(),r),s=i.insertBefore(vs(),r);e=new Ol(a,s,t,t.options)}else{let a=e._$AB.nextSibling,s=e._$AM,d=s!==t;if(d){let u;e._$AQ?.(t),e._$AM=t,e._$AP!==void 0&&(u=t._$AU)!==s._$AU&&e._$AP(u)}if(a!==r||d){let u=e._$AA;for(;u!==a;){let h=fs(u).nextSibling;fs(i).insertBefore(u,r),u=h}}}return e},He=(t,n,e=t)=>(t._$AI(n,e),t),Ml={},Bi=(t,n=Ml)=>t._$AH=n,bs=t=>t._$AH,Vi=t=>{t._$AR(),t._$AA.remove()};var ws=(t,n,e)=>{let i=new Map;for(let r=n;r<=e;r++)i.set(t[r],r);return i},xs=Wi(class extends wt{constructor(t){if(super(t),t.type!==Ce.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,n,e){let i;e===void 0?e=n:n!==void 0&&(i=n);let r=[],a=[],s=0;for(let d of t)r[s]=i?i(d,s):s,a[s]=e(d,s),s++;return{values:a,keys:r}}render(t,n,e){return this.dt(t,n,e).values}update(t,[n,e,i]){let r=bs(t),{values:a,keys:s}=this.dt(n,e,i);if(!Array.isArray(r))return this.ut=s,a;let d=this.ut??=[],u=[],h,p,_=0,f=r.length-1,v=0,x=a.length-1;for(;_<=f&&v<=x;)if(r[_]===null)_++;else if(r[f]===null)f--;else if(d[_]===s[v])u[v]=He(r[_],a[v]),_++,v++;else if(d[f]===s[x])u[x]=He(r[f],a[x]),f--,x--;else if(d[_]===s[x])u[x]=He(r[_],a[x]),xt(t,u[x+1],r[_]),_++,x--;else if(d[f]===s[v])u[v]=He(r[f],a[v]),xt(t,r[_],r[f]),f--,v++;else if(h===void 0&&(h=ws(s,v,x),p=ws(d,_,f)),h.has(d[_]))if(h.has(d[f])){let S=p.get(s[v]),D=S!==void 0?r[S]:null;if(D===null){let J=xt(t,r[_]);He(J,a[v]),u[v]=J}else u[v]=He(D,a[v]),xt(t,r[_],D),r[S]=null;v++}else Vi(r[f]),f--;else Vi(r[_]),_++;for(;v<=x;){let S=xt(t,u[x+1]);He(S,a[v]),u[v++]=S}for(;_<=f;){let S=r[_++];S!==null&&Vi(S)}return this.ut=s,Bi(t,u),Z}});function Gi(t,n){let e=t.entities?.[n];return e?e.area_id!=null?e.area_id:e.device_id?t.devices?.[e.device_id]?.area_id??null:null:null}function A(t){return t.kind==="house"?"house":`${t.kind}:${t.id}`}function Ki(t,n){return n==null?{kind:"house"}:{kind:t,id:n}}function ks(t,n){return`${A(t)}\0${n}`}function Ee(t,n){return ks(t,n)}function Yi(t,n){return ks(t,n)}function $s(t,n){if(!n||n.entity==null)return[...t];let e=Array.isArray(n.entity)?n.entity:[n.entity];if(e.length===0)return[...t];let i=new Set,r=!1;for(let a of e){if(!a||typeof a!="object")continue;let s=a.domain;if(s==null){r=!0;continue}if(Array.isArray(s))for(let d of s)typeof d=="string"&&i.add(d);else typeof s=="string"&&i.add(s)}return r||i.size===0?[...t]:t.filter(a=>{let s=a.indexOf(".");return s<0?!1:i.has(a.slice(0,s))})}function Qi(t,n,e=[]){let i=t;if(!i?.entities)return[];let r=i.entities,a=i.areas??{},s=n.kind==="area"?new Set([n.id]):n.kind==="floor"?new Set(Object.values(a).filter(u=>u.floor_id===n.id).map(u=>u.area_id)):null,d=u=>{let h=Gi(i,u.entity_id);return h==null?!1:s===null?!0:s.has(h)};return Object.values(r).filter(d).filter(u=>u.platform!=="ambience").filter(u=>e.length===0||e.includes(u.entity_id.split(".")[0])).map(u=>u.entity_id).sort()}var tr=Wi(class extends wt{constructor(t){if(super(t),t.type!==Ce.PROPERTY&&t.type!==Ce.ATTRIBUTE&&t.type!==Ce.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!ys(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[n]){if(n===Z||n===k)return n;let e=t.element,i=t.name;if(t.type===Ce.PROPERTY){if(n===e[i])return Z}else if(t.type===Ce.BOOLEAN_ATTRIBUTE){if(!!n===e.hasAttribute(i))return Z}else if(t.type===Ce.ATTRIBUTE&&e.getAttribute(i)===n+"")return Z;return Bi(t),n}});function kt(t){let{checked:n,dataTest:e,onChange:i,className:r,onClick:a,disabled:s}=t;return customElements.get("ha-switch")?l`<ha-switch
      class=${r??k}
      data-test=${e}
      ?disabled=${s??!1}
      .checked=${tr(n)}
      @click=${a}
      @change=${i}
    ></ha-switch>`:l`<input
    class=${r??k}
    data-test=${e}
    type="checkbox"
    ?disabled=${s??!1}
    .checked=${tr(n)}
    @click=${a}
    @change=${i}
  />`}function Yt(t){let{priority:n,pinned:e,shadowed_by:i,...r}=t;return r}function Ss(t,n){if(n<0||n>=t.length)return[];let e=new Set(t[n].entity_ids??[]),i=new Set;return t.forEach((r,a)=>{if(a!==n)for(let s of r.entity_ids??[])e.has(s)||i.add(s)}),[...i]}var ir={house:"mdi:home",floor:"mdi:layers",area:"mdi:texture-box"};function Qt(t,n){return t.kind==="house"?ir.house:t.kind==="floor"?n?.floors?.[t.id]?.icon||ir.floor:n?.areas?.[t.id]?.icon||ir.area}var Cs=y`
  .banner {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    margin: 0 0 1rem 0;
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 8px;
    background: var(--card-background-color, #fff);
  }
  .banner-icon {
    flex: 0 0 auto;
    margin-top: 0.1rem;
    --mdc-icon-size: 22px;
  }
  .banner-hint .banner-icon {
    color: var(--primary-color, #03a9f4);
  }
  .banner-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .banner-cta {
    flex: 0 0 auto;
    align-self: center;
    background: var(--primary-color, #03a9f4);
    border: 1px solid var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
    border-radius: 4px;
    padding: 0.45rem 0.9rem;
    font: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    white-space: nowrap;
    text-decoration: none;
  }
  .banner-dismiss {
    flex: 0 0 auto;
    align-self: flex-start;
    background: transparent;
    border: none;
    color: var(--secondary-text-color, #888);
    cursor: pointer;
    padding: 0.15rem 0.3rem;
  }
  .banner-dismiss:hover {
    color: var(--primary-text-color, inherit);
  }
`;var le=class extends b{constructor(){super(...arguments);this.icon="";this.ctaLabel="";this.ctaHref="";this.dismissLabel="";this.hint=!1;this.dismissible=!0}_onDismiss(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("banner-dismiss",{bubbles:!0,composed:!0}))}_onCta(){this.dispatchEvent(new CustomEvent("banner-cta",{bubbles:!0,composed:!0}))}_renderCta(){return this.ctaLabel?this.ctaHref?l`<a
        class="banner-cta"
        data-test="banner-cta"
        href=${this.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
      >${this.ctaLabel}</a>`:l`<button class="banner-cta" data-test="banner-cta" @click=${this._onCta}>
      ${this.ctaLabel}
    </button>`:k}render(){return l`
      <div class="banner ${this.hint?"banner-hint":""}">
        <ha-icon class="banner-icon" icon=${this.icon}></ha-icon>
        <div class="banner-text"><slot></slot></div>
        ${this._renderCta()}
        ${this.dismissible?l`<button
              class="banner-dismiss"
              data-test="banner-dismiss"
              title=${this.dismissLabel}
              aria-label=${this.dismissLabel}
              @click=${this._onDismiss}
            ><ha-icon icon="mdi:close"></ha-icon></button>`:k}
      </div>
    `}};le.styles=[Cs,y`
      :host {
        display: block;
      }
      ::slotted(strong) {
        font-weight: 600;
      }
      ::slotted(span) {
        font-size: 0.9rem;
        color: var(--secondary-text-color, #888);
      }
      .banner-dismiss ha-icon {
        --mdc-icon-size: 20px;
      }
    `],c([m()],le.prototype,"icon",2),c([m()],le.prototype,"ctaLabel",2),c([m()],le.prototype,"ctaHref",2),c([m()],le.prototype,"dismissLabel",2),c([m({type:Boolean})],le.prototype,"hint",2),c([m({type:Boolean})],le.prototype,"dismissible",2),le=c([w("ambience-banner")],le);var nr="https://github.com/clintongormley/ambience";function Es(t,n){let e=new URLSearchParams({labels:"translation",title:`Translation request: ${n} (${t})`,body:[`I'd like Ambience to be translated into: **${n}** (\`${t}\`).`,"","- [ ] I'm happy to review the translations"].join(`
`)});return`${nr}/issues/new?${e.toString()}`}var Fl="Ambience",rt=class extends b{constructor(){super(...arguments);this._visible=!1;this._href="";this._message="";this._actionLabel="";this._dismissLabel="";this._code="";this._dismissedCodes=new Set}willUpdate(e){if(!e.has("hass"))return;let i=sa(this.hass);if(i.available||this._dismissedCodes.has(i.code)||Ia(i.code)){this._visible=!1;return}this._code=i.code;let r=oa(i.code);this._href=Es(i.code,r),this._message=this._buildMessage(r),this._actionLabel=o(this.hass,"ui.language_request.action","Request a translation \u2192"),this._dismissLabel=o(this.hass,"ui.language_request.dismiss","Dismiss"),this._visible=!0}_dismiss(){this._dismissedCodes.add(this._code),Ha(this._code),this._visible=!1}_buildMessage(e){let r=o(this.hass,"ui.language_request.message","Your Home Assistant language is {language}, but {product} isn't translated into it yet.").split(/\{(language|product)\}/).map((a,s)=>s%2===0?a:l`<strong>${a==="language"?e:Fl}</strong>`);return l`<span class="message">${r}</span>`}render(){return this._visible?l`
      <ambience-banner
        data-test="language-banner"
        icon="mdi:translate"
        hint
        .ctaLabel=${this._actionLabel}
        .ctaHref=${this._href}
        .dismissLabel=${this._dismissLabel}
        @banner-dismiss=${this._dismiss}
      >${this._message}</ambience-banner>
    `:k}};rt.styles=y`
    :host {
      display: block;
    }
    /* The nudge is a single flowing sentence, slotted as ONE block so it wraps
       inline rather than stacking as separate items in the banner's column text
       area. Rendered at primary colour (overriding the banner's muted
       ::slotted(span) body style) since it is the banner's main message. */
    .message {
      font-size: 1rem;
      line-height: 1.4;
      color: var(--primary-text-color, #212121);
    }
  `,c([m({attribute:!1})],rt.prototype,"hass",2),c([g()],rt.prototype,"_visible",2),rt=c([w("ambience-language-banner")],rt);function Ji(t){if(t.enabled===!1)return{severity:null,missing:[],overlap:[],shadowed:!1,configIssues:[]};let n=t.missing_entities??[],e=t.overlap_entities??[],i=t.config_issues??[],r=t.shadowed_by!=null;return{severity:n.length>0||i.length>0?"error":e.length>0||r?"warning":null,missing:n,overlap:e,shadowed:r,configIssues:i}}function As(t){let n=null;for(let e of t){let i=Ji(e).severity;if(i==="error")return"error";i==="warning"&&(n="warning")}return n}function Ls(t){return t.filter(n=>Ji(n).severity!=null).length}var jl={missing_workday_sensor:["ui.badge_needs_workday_sensor","needs a workday sensor"],missing_workday_calendar:["ui.badge_needs_workday_calendar","needs a workday calendar"],missing_weather_entity:["ui.badge_needs_weather_entity","needs a weather entity"],missing_weather_group:["ui.badge_missing_weather_group","missing weather group {id}"],missing_period:["ui.badge_missing_period","missing period {id}"],missing_lux_range:["ui.badge_missing_lux_range","missing lux range {id}"],unexposed_action:["ui.badge_unexposed_action","action {id} not exposed"]};function Ts(t,n){let e=jl[n.kind];return(e?o(t,e[0],e[1]):n.kind).replace("{id}",n.ref)}var $t=null;function Zi(t,n){let e=As(n);if(!e)return"";let i=Ls(n),r=o(t,"ui.problems_count","{n} scene(s) have problems").replace("{n}",String(i));return l`<ambience-problem-flag
    .severity=${e}
    .details=${[r]}
    .summary=${r}
  ></ambience-problem-flag>`}var Ae=class extends b{constructor(){super(...arguments);this.severity="warning";this.details=[];this.summary="";this._open=!1;this._onDocClick=e=>{this._open&&!e.composedPath().includes(this)&&this._setOpen(!1)}}disconnectedCallback(){this._open&&this._setOpen(!1),super.disconnectedCallback()}_setOpen(e){e?($t&&$t!==this&&$t._setOpen(!1),$t=this,document.addEventListener("click",this._onDocClick,!0)):($t===this&&($t=null),document.removeEventListener("click",this._onDocClick,!0)),this._open=e}_toggle(e){e.stopPropagation(),this._setOpen(!this._open)}render(){return l`
      <button
        type="button"
        class="problem-flag ${this.severity}"
        data-severity=${this.severity}
        title=${this.summary}
        aria-label=${this.summary.replace(/\s+/g," ").trim()}
        aria-expanded=${this._open}
        @click=${this._toggle}
      >
        <ha-icon icon="mdi:exclamation-thick"></ha-icon>
      </button>
      ${this._open?l`<div
            class="details"
            role="tooltip"
            @click=${e=>e.stopPropagation()}
          >
            ${this.details.map(e=>l`<div>${e}</div>`)}
          </div>`:""}
    `}};Ae.styles=y`
    :host {
      position: relative;
      display: inline-flex;
    }
    .problem-flag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 18px;
      height: 18px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      cursor: pointer;
      line-height: 1;
      /* The nested mark inherits this as its fill — white reads on both the red
         error disc and the amber warning disc. */
      color: #fff;
      --mdc-icon-size: 13px;
    }
    .problem-flag.error {
      background: var(--error-color, #db4437);
    }
    .problem-flag.warning {
      background: var(--warning-color, #ffa600);
    }
    /* Hover/click land on the badge button, not the icon's shadow DOM. */
    .problem-flag ha-icon {
      pointer-events: none;
    }
    .details {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      z-index: 20;
      /* Grow to fit the content, but cap and wrap long entity ids (which have no
         natural break points) instead of overflowing the box. */
      width: max-content;
      max-width: min(22rem, 80vw);
      overflow-wrap: anywhere;
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border: 1px solid var(--divider-color, #e0e0e0);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
      font-size: 0.8rem;
      font-weight: 400;
      text-align: left;
      cursor: auto;
    }
    .details > div {
      padding: 0.1rem 0;
    }
  `,c([m()],Ae.prototype,"severity",2),c([m({attribute:!1})],Ae.prototype,"details",2),c([m()],Ae.prototype,"summary",2),c([g()],Ae.prototype,"_open",2),Ae=c([w("ambience-problem-flag")],Ae);function de(t){return t.enabled===!1?{scenes:t.scenes??[],enabled:!1}:{scenes:t.scenes??[]}}function rr(t){return(t?.scenes??[]).flatMap(n=>(n.actions??[]).flatMap(e=>e.entity_ids??[]))}function I(){return(t,n)=>{let e=Symbol(String(n));Object.defineProperty(t,n,{get(){return this[e]},set(i){Object.is(this[e],i)||(this[e]=i,this._host?.requestUpdate())},configurable:!0,enumerable:!0})}}var R=class{constructor(n){this._host=n;this.areas=[];this.floors=[];this.areaConfigs=new Map;this.floorConfigs=new Map;this.house={scenes:[]};this.switchEntityIds=new Map;this.live=new Map;this.areasLoaded=!1;this.conditions=[];this.actions=[];this.categories=[];this.schemas={};this.installId=null;this.staticLoaded=!1;this.error="";this.canUndo=!1;this.canRedo=!1;this.undoAction=null;this.redoAction=null;this.staleScopes=[];this._heldBackSharers=new Map;this._savesInFlight=new Map;this._rereadAfterSave=new Map;this._configGen=new Map;this._genSeq=0;this._onExposedActionsChanged=async()=>{try{let n=await Vt(this._hass);if(!this._host.isConnected)return;this.actions=n,await this._refreshSchemas(n),await this.reloadConfigs()}catch{}};this._onConfigImported=async()=>{try{await this.reloadConfigs()}catch{}};this._onCategoriesChanged=async()=>{try{let n=await Se(this._hass);if(!this._host.isConnected)return;this.categories=n}catch{}};this._onConditionsChanged=async()=>{try{let[n,e]=await Promise.all([Gt(this._hass),Kt(this._hass)]);if(!this._host.isConnected)return;this.dayConfig=n,this.weatherConfig=e}catch{}};n.addController(this)}get _hass(){return this._host.hass}hostConnected(){window.addEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("ambience-conditions-changed",this._onConditionsChanged),window.addEventListener("ambience-config-imported",this._onConfigImported),this._tick=setInterval(()=>{for(let n of this.switchEntityIds.values())if(this._hass.states?.[n]?.state==="off"){this._host.requestUpdate();return}},1e3)}hostDisconnected(){window.removeEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("ambience-conditions-changed",this._onConditionsChanged),window.removeEventListener("ambience-config-imported",this._onConfigImported),this._tick&&clearInterval(this._tick),this._tick=void 0,this._unsubArea?.(),this._unsubArea=void 0,this._unsubFloor?.(),this._unsubFloor=void 0,this._unsubEntity?.(),this._unsubEntity=void 0,this._unsubLive?.(),this._unsubLive=void 0,this._unsubHistory?.(),this._unsubHistory=void 0}async subscribe(n,e){this._isScopeLocked=e;let i=this._hass.connection.subscribeEvents(v=>{v.data.action==="remove"&&n({kind:"area",id:v.data.area_id}),this.refreshAreas(),v.data.action!=="update"&&this.refreshSwitches()},"area_registry_updated"),r=this._hass.connection.subscribeEvents(v=>{v.data.action==="remove"&&n({kind:"floor",id:v.data.floor_id}),this.refreshFloors(),v.data.action!=="update"&&this.refreshSwitches()},"floor_registry_updated"),a=this._hass.connection.subscribeEvents(v=>{v.data.action!=="update"&&v.data.entity_id.startsWith("switch.")&&this.refreshSwitches()},"entity_registry_updated"),s=rs(this._hass,v=>this._onLive(v)),d=as(this._hass,v=>this._onHistory(v)),[u,h,p,_,f]=await Promise.all([i,r,a,s,d]);this._host.isConnected?(this._unsubArea=u,this._unsubFloor=h,this._unsubEntity=p,this._unsubLive=_,this._unsubHistory=f):(u(),h(),p(),_(),f())}_onLive(n){let e=(i,r)=>{let a=Ee(Ki(r.scope_kind,r.scope_id),r.category);i.set(a,{matched:r.matched,applied:r.applied})};if(n.type==="snapshot"){let i=new Map;for(let r of n.units)e(i,r);this.live=i}else{let i=new Map(this.live);e(i,n),this.live=i}}async loadStatic(){try{let[n,e,i,r,a,s,d,u]=await Promise.all([zi(this._hass),Vt(this._hass),Mi(this._hass),Fi(this._hass),Gt(this._hass),Kt(this._hass),Se(this._hass),Oi(this._hass)]);if(!this._host.isConnected)return;this.installId=u,this.conditions=n,this.actions=e,this.periods=i,this.luxRanges=r,this.dayConfig=a,this.weatherConfig=s,this.categories=d,this.staticLoaded=!0,await this._refreshSchemas(e)}catch(n){this.error=C(this._hass,n)}}async _refreshSchemas(n){let e=await Promise.all(n.map(async r=>{try{let a=await Ie(this._hass,r.id);return[r.id,a]}catch{return[r.id,null]}}));if(!this._host.isConnected)return;let i={};for(let[r,a]of e)a&&(i[r]=a);this.schemas=i}async refreshAreas(){try{let n=await Na(this._hass),e=this.areaConfigs,i=new Map;if(await Promise.all(n.map(async r=>{let a=e.get(r.area_id);if(a){i.set(r.area_id,a);return}i.set(r.area_id,de(await Ut(this._hass,r.area_id)))})),!this._host.isConnected)return;this.areas=n,this.areaConfigs=i}catch(n){this.error=C(this._hass,n)}finally{this._host.isConnected&&(this.areasLoaded=!0)}}async refreshFloors(){try{let n=(await za(this._hass)).slice().sort((r,a)=>r.name.localeCompare(a.name)),e=this.floorConfigs,i=new Map;if(await Promise.all(n.map(async r=>{let a=e.get(r.floor_id);if(a){i.set(r.floor_id,a);return}i.set(r.floor_id,de(await Wt(this._hass,r.floor_id)))})),!this._host.isConnected)return;this.floors=n,this.floorConfigs=i}catch(n){this.error=C(this._hass,n)}}async refreshHouse(){try{let n=de(await Bt(this._hass));if(!this._host.isConnected)return;this.house=n}catch(n){this.error=C(this._hass,n)}}async reloadConfigs(){let[n,e,i]=await Promise.all([Promise.all(this.areas.map(async r=>[r.area_id,de(await Ut(this._hass,r.area_id))])),Promise.all(this.floors.map(async r=>[r.floor_id,de(await Wt(this._hass,r.floor_id))])),Bt(this._hass)]);this._host.isConnected&&(this.areaConfigs=new Map(n),this.floorConfigs=new Map(e),this.house=de(i))}async refreshSwitches(){try{let n=await Ya(this._hass);if(!this._host.isConnected)return;this.switchEntityIds=new Map(n.map(e=>{let i=e.scope_kind==="house"?{kind:"house"}:{kind:e.scope_kind,id:e.scope_id};return[A(i),e.entity_id]}))}catch(n){this.error=C(this._hass,n)}}getConfig(n){return n.kind==="house"?this.house:n.kind==="area"?this.areaConfigs.get(n.id):this.floorConfigs.get(n.id)}setConfig(n,e){if(n.kind==="house")this.house=e;else if(n.kind==="area"){let i=new Map(this.areaConfigs);i.set(n.id,e),this.areaConfigs=i}else{let i=new Map(this.floorConfigs);i.set(n.id,e),this.floorConfigs=i}}async mutate(n,e,i){let r=A(n),a=this.getConfig(n);this.setConfig(n,e);let s=this._heldBackSharers.delete(r);this._savesInFlight.set(r,(this._savesInFlight.get(r)??0)+1),this.error="";let d;try{let u;n.kind==="house"?u=await Kn(this._hass,e,i):n.kind==="area"?u=await Vn(this._hass,n.id,e,i):u=await Gn(this._hass,n.id,e,i),this._bumpGen(r),this.setConfig(n,de(u.config)),d=u.config}catch(u){return a&&this.setConfig(n,a),s&&this._rereadAfterSave.set(r,n),this.error=C(this._hass,u),this._saveSettled(n),!1}return await Promise.all([this._saveSettled(n),this._refreshSharers(n,a,d)]),!0}async _saveSettled(n){let e=A(n),i=(this._savesInFlight.get(e)??1)-1;if(i>0){this._savesInFlight.set(e,i);return}this._savesInFlight.delete(e),this._rereadAfterSave.delete(e)&&await this._refreshSharer(n)}_bumpGen(n){let e=++this._genSeq;return this._configGen.set(n,e),e}async reloadScope(n){let e=A(n);try{let i=this._bumpGen(e),r=await this._fetchScope(n);if(!this._host.isConnected||this._configGen.get(e)!==i)return;this.setConfig(n,r)}catch(i){this.error=C(this._hass,i)}}async _fetchScope(n){return n.kind==="house"?de(await Bt(this._hass)):n.kind==="area"?de(await Ut(this._hass,n.id)):de(await Wt(this._hass,n.id))}async _applyHistoryResult(n){if(!n.ok||!n.config||n.scope_kind===void 0)return;let e=Ki(n.scope_kind,n.scope_id??null),i=this.getConfig(e),r=A(e);this._bumpGen(r),this.setConfig(e,de(n.config)),this._heldBackSharers.delete(r),await this._refreshSharers(e,i,n.config)}async _refreshSharers(n,e,i){let r=e===void 0?null:new Set([...rr(e),...rr(i)]);if(r?.size===0)return;let a=A(n),d=[[{kind:"house"},this.house],...[...this.areaConfigs].map(([u,h])=>[{kind:"area",id:u},h]),...[...this.floorConfigs].map(([u,h])=>[{kind:"floor",id:u},h])].filter(([u])=>A(u)!==a).filter(([,u])=>!r||rr(u).some(h=>r.has(h))).map(([u])=>u);await Promise.all(d.map(u=>this._refreshSharer(u)))}async _refreshSharer(n){let e=A(n);try{if(this._savesInFlight.has(e)){this._rereadAfterSave.set(e,n);return}if(this._isScopeLocked?.(n)){this._heldBackSharers.set(e,n);return}let i=this._bumpGen(e),r=await this._fetchScope(n);if(!this._host.isConnected)return;if(this._savesInFlight.has(e)){this._rereadAfterSave.set(e,n);return}if(this._configGen.get(e)!==i)return;if(this._isScopeLocked?.(n)){this._heldBackSharers.set(e,n);return}this.setConfig(n,r)}catch{}}async _reloadChanged(n){let e=this.getConfig(n);await this.reloadScope(n),await this._refreshSharers(n,e,this.getConfig(n))}async undo(){this.error="";try{await this._applyHistoryResult(await ss(this._hass))}catch(n){this.error=C(this._hass,n)}}async redo(){this.error="";try{await this._applyHistoryResult(await os(this._hass))}catch(n){this.error=C(this._hass,n)}}_onHistory(n){if(this.canUndo=n.can_undo,this.canRedo=n.can_redo,this.undoAction=n.undo,this.redoAction=n.redo,!n.changed_scope)return;let e=Ki(n.changed_scope.scope_kind,n.changed_scope.scope_id);if(n.is_self){this.clearStale(e);return}this._isScopeLocked?.(e)?this._markStale(e):this._reloadChanged(e)}isScopeStale(n){let e=A(n);return this.staleScopes.some(i=>A(i)===e)}_markStale(n){this.isScopeStale(n)||(this.staleScopes=[...this.staleScopes,n])}clearStale(n){if(!this.isScopeStale(n))return;let e=A(n);this.staleScopes=this.staleScopes.filter(i=>A(i)!==e)}forgetScope(n){let e=A(n);this.clearStale(n),this._heldBackSharers.delete(e),this._rereadAfterSave.delete(e),this._configGen.delete(e)}async refreshStaleScope(n){this.clearStale(n),await this._reloadChanged(n)}async editorClosed(n){let e=this._heldBackSharers.delete(A(n));this.isScopeStale(n)?await this.refreshStaleScope(n):e&&await this._refreshSharer(n)}};c([I()],R.prototype,"areas",2),c([I()],R.prototype,"floors",2),c([I()],R.prototype,"areaConfigs",2),c([I()],R.prototype,"floorConfigs",2),c([I()],R.prototype,"house",2),c([I()],R.prototype,"switchEntityIds",2),c([I()],R.prototype,"live",2),c([I()],R.prototype,"areasLoaded",2),c([I()],R.prototype,"conditions",2),c([I()],R.prototype,"actions",2),c([I()],R.prototype,"categories",2),c([I()],R.prototype,"schemas",2),c([I()],R.prototype,"periods",2),c([I()],R.prototype,"luxRanges",2),c([I()],R.prototype,"dayConfig",2),c([I()],R.prototype,"weatherConfig",2),c([I()],R.prototype,"installId",2),c([I()],R.prototype,"staticLoaded",2),c([I()],R.prototype,"error",2),c([I()],R.prototype,"canUndo",2),c([I()],R.prototype,"canRedo",2),c([I()],R.prototype,"undoAction",2),c([I()],R.prototype,"redoAction",2),c([I()],R.prototype,"staleScopes",2);var Ps="https://clintongormley.github.io/ambience";function St(t){let n=t.replace(/^\/+|\/+$/g,"");return n?`${Ps}/${n}/`:`${Ps}/`}var ql={day:"day",state:"entity-state",lux:"lux",occupancy:"occupancy",people:"people",script:"script",sun:"sun",template:"template",time_of_day:"time-of-day",unavailable:"unavailable",weather:"weather"};function Xi(t){let n=ql[t];return n?`reference/conditions/${n}`:void 0}var Ds=l`<svg viewBox="0 0 24 24" aria-hidden="true">
  <path
    d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"
  ></path>
</svg>`,ce=class extends b{constructor(){super(...arguments);this.text="";this.multiline=!1;this.docPath="";this._open=!1;this._popStyle="";this._onDocClick=e=>{e.composedPath().includes(this)||this._close()};this._onKeydown=e=>{e.key==="Escape"&&this._close()};this._onViewportChange=()=>this._close()}_toggle(e){e.stopPropagation(),this._open?this._close():this._openPopover()}_positionPopover(){let e=this.renderRoot.querySelector(".trigger");if(!e)return;let i=e.getBoundingClientRect(),r=260,a=window.innerWidth||1024,s=window.innerHeight||768,d=Math.max(8,Math.min(i.left,a-r-8)),u=s-i.bottom,h=i.top,p=u<220&&h>u;this._popStyle=p?`top:${Math.round(i.top-6)}px;left:${Math.round(d)}px;transform:translateY(-100%);`:`top:${Math.round(i.bottom+6)}px;left:${Math.round(d)}px;`}_openPopover(){this._positionPopover(),this._open=!0,this._bindGlobals(!0)}_close(){this._open&&(this._open=!1,this._bindGlobals(!1),this.renderRoot.querySelector(".trigger")?.focus())}disconnectedCallback(){super.disconnectedCallback(),this._bindGlobals(!1)}_bindGlobals(e){e?(document.addEventListener("click",this._onDocClick,!0),document.addEventListener("keydown",this._onKeydown),window.addEventListener("scroll",this._onViewportChange,{capture:!0,passive:!0}),window.addEventListener("resize",this._onViewportChange)):(document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown),window.removeEventListener("scroll",this._onViewportChange,{capture:!0}),window.removeEventListener("resize",this._onViewportChange))}render(){if(!this.text&&!this.docPath)return k;if(!this.text){let i=o(this.hass,"ui.open_documentation","Open documentation");return l`
        <a
          class="trigger"
          data-test="help-doc-link"
          href=${St(this.docPath)}
          target="_blank"
          rel="noopener noreferrer"
          title=${i}
          aria-label=${i}
          @click=${r=>r.stopPropagation()}
        >${Ds}</a>
      `}let e=this.docPath?l`<a
          class="doc-link"
          data-test="help-doc-link"
          href=${St(this.docPath)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label=${o(this.hass,"ui.open_documentation","Open documentation")}
        >${o(this.hass,"ui.read_documentation","Read more")} →</a>`:"";return l`
      <button
        class="trigger"
        data-test="help-trigger"
        aria-label=${o(this.hass,"ui.help","Help")}
        aria-expanded=${this._open}
        @click=${i=>this._toggle(i)}
      >${Ds}</button>
      ${this._open?l`<div
              class="popover${this.multiline?" multiline":""}"
              role="dialog"
              data-test="help-popover"
              style=${this._popStyle}
            ><slot>${this.text}</slot>${e}</div>`:""}
    `}};ce.styles=y`
    :host {
      position: relative;
      display: inline-flex;
      vertical-align: middle;
    }
    /* The trigger is HA's standard help glyph (mdi:help-circle-outline). Size is
       overridable via --ambience-help-size (defaults to a text-relative size for
       inline use; the panel header bumps it to 24px to match HA's toolbar icons),
       colour via --ambience-help-trigger-color (defaults to the muted grey). */
    .trigger {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--ambience-help-size, 1.25em);
      height: var(--ambience-help-size, 1.25em);
      color: var(--ambience-help-trigger-color, var(--secondary-text-color, #888));
    }
    .trigger:hover {
      color: var(--primary-color, #03a9f4);
    }
    .trigger svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
      display: block;
    }
    .trigger:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
      border-radius: 50%;
    }
    /* Block so it sits on its own line below the help text (not jammed against
       the last word), with a divider rule for separation. */
    a.doc-link {
      display: block;
      margin-top: 0.55rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      line-height: 1.3;
      color: var(--primary-color, #03a9f4);
      text-decoration: none;
      font-weight: 500;
    }
    a.doc-link:hover {
      text-decoration: underline;
    }
    /* position: fixed (coordinates set in JS from the trigger's rect) so the
       popover escapes the settings modal's overflow:hidden instead of being
       clipped at its edge. */
    .popover {
      position: fixed;
      z-index: 1000;
      width: max-content;
      max-width: 260px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
      padding: 0.6rem 0.7rem;
      font-size: 0.85rem;
      font-weight: 400;
      line-height: 1.45;
      white-space: normal;
      text-align: left;
    }
    .popover.multiline {
      white-space: pre-wrap;
    }
  `,c([m({attribute:!1})],ce.prototype,"hass",2),c([m()],ce.prototype,"text",2),c([m({type:Boolean})],ce.prototype,"multiline",2),c([m()],ce.prototype,"docPath",2),c([g()],ce.prototype,"_open",2),c([g()],ce.prototype,"_popStyle",2),ce=c([w("ambience-help")],ce);var me=class extends b{constructor(){super(...arguments);this.items=[];this.muted=!1;this._open=!1;this._onKeydown=e=>{e.key==="Escape"&&this._open&&(this._open=!1)}}_triggerLabel(){return this.label??o(this.hass,"ui.more_actions","More actions")}_select(e,i){i.stopPropagation(),this._open=!1,this.dispatchEvent(new CustomEvent("menu-action",{detail:{id:e},bubbles:!0,composed:!0}))}_renderItems(){return this.items.map(e=>l`
        ${e.dividerBefore?l`<div class="kebab-divider" role="separator"></div>`:k}
        <button
          class="kebab-item ${e.danger?"danger":""}"
          role="menuitem"
          data-action=${e.id}
          @click=${i=>this._select(e.id,i)}
        >
          <ha-icon icon=${e.icon}></ha-icon>
          <span class="kebab-label">${e.label}</span>
        </button>
      `)}_renderTrigger(e){return l`
      <button
        class="kebab-trigger"
        aria-label=${this._triggerLabel()}
        aria-haspopup="menu"
        aria-expanded=${e}
        @click=${i=>{i.stopPropagation(),this._open=!this._open}}
      >
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
      </button>
    `}_renderMenu(){return l`
      ${this._renderTrigger(this._open)}
      ${this._open?l`
            <div
              class="kebab-backdrop"
              @click=${e=>{e.stopPropagation(),this._open=!1}}
            ></div>
            <div class="kebab-menu" role="menu">${this._renderItems()}</div>
          `:k}
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this._onKeydown)}disconnectedCallback(){this.removeEventListener("keydown",this._onKeydown),super.disconnectedCallback()}render(){return this._renderMenu()}};me.styles=y`
    :host { position: relative; display: inline-flex; flex: 0 0 auto; }
    .kebab-trigger {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; padding: 0;
      border: 0; border-radius: 50%; background: none;
      color: var(--kebab-trigger-color, var(--secondary-text-color, #888));
      cursor: pointer; font: inherit;
    }
    .kebab-trigger:hover { background: var(--secondary-background-color, #f5f5f5); }
    /* Muted: dim the trigger glyph only. The popup keeps full opacity so an
       open menu stays legible even on a disabled/off owner. */
    :host([muted]) .kebab-trigger { opacity: 0.4; }
    .kebab-backdrop { position: fixed; inset: 0; z-index: 10; }
    .kebab-menu {
      position: absolute; top: calc(100% + 4px); right: 0; z-index: 11;
      min-width: 12rem; max-height: 60vh; overflow-y: auto;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
      padding: 0.35rem;
    }
    .kebab-item {
      display: flex; align-items: center; gap: 0.75rem; width: 100%;
      min-height: 44px; box-sizing: border-box;
      padding: 0.4rem 0.75rem; border: 0; border-radius: 6px;
      background: none; color: var(--primary-text-color, #212121);
      cursor: pointer; font: inherit; font-size: 1rem; text-align: left;
    }
    .kebab-item:hover { background: var(--secondary-background-color, #f5f5f5); }
    .kebab-item.danger { color: var(--error-color, #db4437); }
    .kebab-item ha-icon { color: inherit; flex: 0 0 auto; }
    .kebab-divider {
      height: 1px; margin: 0.35rem 0;
      background: var(--divider-color, #e0e0e0);
    }
  `,c([m({attribute:!1})],me.prototype,"items",2),c([m({attribute:!1})],me.prototype,"hass",2),c([m()],me.prototype,"label",2),c([m({type:Boolean,reflect:!0})],me.prototype,"muted",2),c([g()],me.prototype,"_open",2),me=c([w("ambience-kebab-menu")],me);var Ne=class extends b{constructor(){super(...arguments);this.kind="matched";this.label="";this._open=!1;this._onDocClick=e=>{e.composedPath().includes(this)||this._close()};this._onKeydown=e=>{e.key==="Escape"&&this._close()}}_toggle(e){e.stopPropagation(),this._open?this._close():this._openPopover()}_openPopover(){this._open=!0,document.addEventListener("click",this._onDocClick,!0),document.addEventListener("keydown",this._onKeydown)}_close(){this._open&&(this._open=!1,document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown)}render(){return l`
      <button
        type="button"
        class="dot ${this.kind}"
        aria-label=${this.label}
        aria-expanded=${this._open}
        @click=${e=>this._toggle(e)}
      ></button>
      ${this._open?l`<div class="popover" role="tooltip" @click=${e=>e.stopPropagation()}>
            ${this.label}
          </div>`:""}
    `}};Ne.styles=y`
    :host {
      position: relative;
      display: inline-flex;
    }
    button.dot {
      all: unset;
      display: inline-block;
      box-sizing: border-box;
      cursor: pointer;
      width: 0.55em;
      height: 0.55em;
      border-radius: 50%;
    }
    button.dot:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    button.dot.matched {
      background: var(--success-color, #4caf50);
    }
    button.dot.stale {
      background: transparent;
      border: 1.5px solid var(--secondary-text-color, #888);
    }
    .popover {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      z-index: 30;
      width: max-content;
      max-width: 260px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
      padding: 0.6rem 0.7rem;
      font-size: 0.85rem;
      font-weight: 400;
      line-height: 1.45;
      white-space: normal;
      text-align: left;
    }
  `,c([m()],Ne.prototype,"kind",2),c([m()],Ne.prototype,"label",2),c([g()],Ne.prototype,"_open",2),Ne=c([w("ambience-live-dot")],Ne);function Ul(t){return t.style.pointerEvents="none",t.style.willChange="transform",()=>{t.style.pointerEvents="",t.style.willChange="",t.style.transform=""}}function en(t,n,e={}){let i=t.pointerId;try{t.target?.setPointerCapture?.(i)}catch{}let r=e.follow??null,a=t.clientX,s=t.clientY,d=r?Ul(r):null,u=f=>{f.pointerId===i&&(n.onMove(f.clientX,f.clientY),r&&(r.style.transform=`translate(${f.clientX-a}px, ${f.clientY-s}px)`))},h=f=>{f.pointerId===i&&(_(),n.onEnd(f.clientX,f.clientY))},p=f=>{f.pointerId===i&&(_(),n.onCancel())},_=()=>{window.removeEventListener("pointermove",u,!0),window.removeEventListener("pointerup",h,!0),window.removeEventListener("pointercancel",p,!0),d?.()};return window.addEventListener("pointermove",u,!0),window.addEventListener("pointerup",h,!0),window.addEventListener("pointercancel",p,!0),_}function tn(t,n){let e=document.elementFromPoint?.(t,n)??null;if(!e)return null;for(;e.shadowRoot;){let i=e.shadowRoot.elementFromPoint?.(t,n);if(!i||i===e)break;e=i}return e}var Ct=class{constructor(n,e,i={}){this.host=n;this.onReorder=e;this.from=null;this.over=null;this.moved=!1;this._cancelDrag=null;this._locate=i.locate??((r,a)=>this._domLocate(r,a)),n.addController(this)}hostDisconnected(){this._reset()}start(n,e){if(!e.isPrimary||e.button>0)return;this._reset(),this.from=n,this.moved=!1,this.host.requestUpdate();let i=e.target?.closest("[data-drag-index]");this._cancelDrag=en(e,{onMove:(r,a)=>this._hover(this._locate(r,a)),onEnd:(r,a)=>this.drop(this._locate(r,a)),onCancel:()=>this.end()},{follow:i})}_hover(n){if(this.from===null)return;let e=n===null||n===this.from?null:n;e!==null&&(this.moved=!0),this.over!==e&&(this.over=e,this.host.requestUpdate())}drop(n){let e=this.from;this._reset(),!(e===null||n===null||e===n)&&this.onReorder(e,n)}end(){this._reset()}_domLocate(n,e){let i=this.host.renderRoot,a=(i?.elementFromPoint?i.elementFromPoint(n,e):tn(n,e))?.closest?.("[data-drag-index]");if(!a)return null;let s=Number(a.getAttribute("data-drag-index"));return Number.isNaN(s)?null:s}_reset(){this._cancelDrag?.(),this._cancelDrag=null;let n=this.from!==null||this.over!==null;this.from=null,this.over=null,n&&this.host.requestUpdate()}};function Rs(t){return t.normalize("NFC").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean)}function Wl(t,n){let e=Rs(t),i=Rs(n);if(i.length===0)return!0;for(let r=0;r+i.length<=e.length;r++)if(i.every((a,s)=>e[r+s]===a))return!0;return!1}function at(t,n){let e=t?.states?.[n]?.attributes?.friendly_name;if(typeof e=="string"&&e)return e;let i=t?.entities?.[n];if(typeof i?.name=="string"&&i.name)return i.name;if(typeof i?.original_name=="string"&&i.original_name)return i.original_name;let r=i?.device_id?t?.devices?.[i.device_id]:void 0;return typeof r?.name_by_user=="string"&&r.name_by_user?r.name_by_user:typeof r?.name=="string"&&r.name?r.name:n}function Is(t,n){let e=at(t,n);if(!t)return e;let i=Gi(t,n),r=i?t.areas?.[i]?.name??"":"";return!r||Wl(e,r)?e:`${r} \xB7 ${e}`}function L(t,n){t.dispatchEvent(new CustomEvent("value-changed",{detail:{value:n},bubbles:!0,composed:!0}))}var Bl=[{name:"duration",selector:{duration:{enable_day:!1}}}];function Jt(t){return!!t&&(t.h!==0||t.m!==0||t.s!==0)}function Et(t,n){return Jt(t)&&n==="less_than"?"less_than":void 0}function Zt(t){return t==="less_than"?"<":"\u2265"}var ze=class extends b{constructor(){super(...arguments);this.value=null;this.mode="at_least"}willUpdate(e){(e.has("hass")||this._modeSchema===void 0)&&(this._modeSchema=[{name:"for_mode",required:!0,selector:{select:{mode:"dropdown",options:this._modeOptions()}}}])}get _d(){return this.value??{h:0,m:0,s:0}}_emit(e,i){this.value=e,this.mode=i,L(this,{...e,mode:i})}_setDuration(e){this._emit(e,this.mode)}_setMode(e){this._emit(this._d,e)}_modeOptions(){return[{value:"at_least",label:o(this.hass,"ui.for_at_least","at least")},{value:"less_than",label:o(this.hass,"ui.for_less_than","less than")}]}_renderMode(){if(customElements.get("ha-form"))return l`<ha-form
        class="for-mode"
        .hass=${this.hass}
        .schema=${this._modeSchema}
        .data=${{for_mode:this.mode}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),i.detail.value.for_mode&&this._setMode(i.detail.value.for_mode)}}
      ></ha-form>`;let e=this._modeOptions();return l`<select
      class="for-mode"
      @change=${i=>this._setMode(i.target.value)}
    >
      ${e.map(i=>l`<option value=${i.value} ?selected=${i.value===this.mode}>${i.label}</option>`)}
    </select>`}render(){if(customElements.get("ha-form")){let r=this._d;return l`${this._renderMode()}<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${Bl}
        .data=${{duration:{hours:r.h,minutes:r.m,seconds:r.s}}}
        .computeLabel=${()=>""}
        @value-changed=${a=>{a.stopPropagation();let s=a.detail.value.duration;this._setDuration({h:s?.hours??0,m:s?.minutes??0,s:s?.seconds??0})}}
      ></ha-form>`}let e=this._d,i=r=>l`<input type="number" min="0" step="1"
      .value=${String(e[r])}
      @change=${a=>this._setDuration({...e,[r]:Math.max(0,Math.trunc(Number(a.target.value)||0))})} />`;return l`${this._renderMode()}<div class="for-row" data-field="for">
      ${i("h")}<span>:</span>${i("m")}<span>:</span>${i("s")}
    </div>`}};ze.styles=y`
    /* flex-wrap lets the mode dropdown + the h:m:s duration widget stack
       onto a second line on a narrow (mobile) column instead of spilling
       past the form's right edge; on a wide column they stay side-by-side. */
    :host { display: flex; flex-wrap: wrap; align-items: center; gap: 0.25rem; }
    .for-row { display: flex; gap: 0.25rem; align-items: center; }
    .for-row input[type='number'] { width: 3.5rem; }
    select.for-mode {
      padding: 0.25rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
  `,c([m({attribute:!1})],ze.prototype,"hass",2),c([m({attribute:!1})],ze.prototype,"value",2),c([m({attribute:!1})],ze.prototype,"mode",2),ze=c([w("ambience-for-duration")],ze);function ii(t,n,e){if(n&&e){let i=e[n]?.fields?.[t];if(i&&typeof i=="object"){let r=i.name;if(typeof r=="string"&&r)return r}}return F(t)}function on(t,n,e){return t.name?.trim()?t.name:n??o(e,"ui.new_scene_default","New scene")}function Lt(t,n,e){return n==null?o(e.hass,"ui.summary_any_paren","(any)"):t==="time_of_day"?cn(n,e):t==="day"?Yl(n,e):t==="weather"?Xl(n,e):t==="sun"?ed(n,e):t==="state"?pr(n,e):t==="script"?Gl(n,e):t==="people"?Kl(n,e):t==="occupancy"?td(n,e):t==="unavailable"?od(n,e):t==="lux"?ld(n,e):t==="template"?Vl(n,e):String(n)}function Vl(t,n={}){return t===null?o(n.hass,"ui.summary_any_paren","(any)"):typeof t!="object"||typeof t.template!="string"?String(t):t.template}function Gl(t,n={}){if(t===null)return o(n.hass,"ui.summary_any_paren","(any)");if(typeof t!="object"||typeof t.script!="string")return String(t);let e=ei(n,t.script),i=t.args??{},r=Object.keys(i).sort();if(r.length===0)return e;let a=r.map(s=>`${dr(n.hass,t.script,s)}: ${Oe(n.hass,i[s])}`).join(", ");return`${e} (${a})`}function dr(t,n,e){let i=n.replace(/^script\./,""),a=t?.services?.script?.[i]?.fields?.[e]?.name;return typeof a=="string"&&a?a:F(e)}function ei(t,n){let i=t.hass?.states?.[n]?.attributes?.friendly_name;if(typeof i=="string"&&i)return i;let r=n.indexOf("."),a=r>=0?n.slice(r+1):n;return a.charAt(0).toUpperCase()+a.slice(1)}function Hs(t,n){return t==="home"?o(n.hass,"people_summary.home","Home"):ei(n,t)}function Kl(t,n={}){if(t==null)return o(n.hass,"ui.summary_any","any");let e=t.where??"home";if(Array.isArray(t.who)&&t.who.length===1){let s=ei(n,t.who[0]),u=t.quant==="nobody"!=!!t.negate?o(n.hass,"people_summary.is_not_at","is not at"):o(n.hass,"people_summary.is_at","is at"),h=`${s} ${u} ${Hs(e,n)}`;return t.for&&ti(t.for)?`${h} ${o(n.hass,"ui.for_prefix","for")} ${Zt(t.for_mode)}${sn(t.for)}`:h}let i;if(Array.isArray(t.who)){let s=t.quant??"any",d=s==="any"?o(n.hass,"ui.people_mode_any","Any of:"):s==="everyone"?o(n.hass,"ui.people_mode_all","All of:"):o(n.hass,"ui.people_mode_none","None of:"),u=t.who.map(h=>ei(n,h)).join(", ");i=`${d} (${u})`}else{let s=t.quant??"any";i=s==="nobody"?o(n.hass,"ui.people_mode_nobody","Nobody"):s==="any"?o(n.hass,"ui.people_mode_anybody","Anybody"):o(n.hass,"ui.people_mode_everybody","Everybody")}let r=t.negate?o(n.hass,"people_summary.is_not_at","is not at"):o(n.hass,"people_summary.is_at","is at"),a=`${i} ${r} ${Hs(e,n)}`;return t.for&&ti(t.for)?`${a} ${o(n.hass,"ui.for_prefix","for")} ${Zt(t.for_mode)}${sn(t.for)}`:a}function Yl(t,n={}){if(t===null)return o(n.hass,"day_summary.any","any");let e=t.include??[],i=t.exclude??[],r=e.length===0?o(n.hass,"day_summary.any_day","any day"):e.map(s=>Ns(s,n)).join(", ");if(i.length===0)return r;let a=o(n.hass,"day_summary.except","except");return`${r} (${a} ${i.map(s=>Ns(s,n)).join(", ")})`}function ar(t,n,e){return o(t,"day_summary.date","{month} {day}",{month:Ii(t,n),day:String(e)})}function Ns(t,n){switch(t.kind){case"weekday":return t.days.map(e=>Di(n.hass,e)).join("/");case"day_of_month":return`${o(n.hass,"day_summary.day_prefix","day")} ${t.days}`;case"date":return ar(n.hass,t.month,t.day);case"date_range":return`${ar(n.hass,t.from.month,t.from.day)} \u2192 ${ar(n.hass,t.to.month,t.to.day)}`;case"last_day":return o(n.hass,"day_summary.last_day","last day");case"workday":return o(n.hass,"day_summary.workday","workday");case"holiday":return o(n.hass,"day_summary.holiday","holiday");case"first_workday":return o(n.hass,"day_summary.first_workday","first workday");case"last_workday":return o(n.hass,"day_summary.last_workday","last workday")}}function cr(t){return typeof t=="string"?t:typeof t=="number"||typeof t=="boolean"?String(t):JSON.stringify(t)}var Ql=["entity_id","device_id","area_id","label_id","floor_id"],zs=2;function Jl(t){if(!t||typeof t!="object"||Array.isArray(t))return null;let n=t;if(!Object.keys(n).every(r=>Ql.includes(r)))return null;let e=n.entity_id,i=typeof e=="string"?[e]:Array.isArray(e)?e.filter(r=>typeof r=="string"):[];return i.length?i:null}function Oe(t,n){let e=Jl(n);if(!e)return cr(n);let i=e.slice(0,zs).map(s=>ei({hass:t},s)),r=e.length-zs;return`[${r>0?`${i.join(", ")} +${r} more`:i.join(", ")}]`}function ln(t){if(!(!t||typeof t!="object")){for(let n of Object.values(t))if(n&&typeof n=="object"){let e=n.unit_of_measurement;if(typeof e=="string"&&e)return e}}}function Zl(t){return t.split(/[\s_-]+/).filter(n=>n!=="").map(n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()).join(" ")}function Xl(t,n={}){if(t===null)return o(n.hass,"ui.summary_any","any");let e=new Map((n.weatherGroups??[]).map(s=>[s.id,s.label])),i=(t.groups??[]).map(s=>e.get(s)??Zl(s)).join("/"),r=(t.thresholds??[]).map(s=>`${qt(n.hass,s.attribute)} ${j(n.hass,s.op)} ${s.value}`).join(", "),a=[i,r].filter(s=>s!=="");return a.length===0?o(n.hass,"ui.summary_any","any"):a.join(", ")}function ed(t,n={}){if(t===null)return o(n.hass,"ui.summary_any","any");let e=[],i=t.elevation;i&&(i.min!=null&&i.max!=null?e.push(`${i.min}\xB0\u2013${i.max}\xB0`):i.min!=null?e.push(`\u2265${i.min}\xB0`):i.max!=null&&e.push(`\u2264${i.max}\xB0`));let r=t.azimuth;if(r){r.sectors?.length&&e.push(r.sectors.map(a=>vt(n.hass,a)).join("/"));for(let a of r.ranges??[])e.push(`${a.from}\xB0\u2013${a.to}\xB0`)}return e.length===0?o(n.hass,"ui.summary_any","any"):e.join(", ")}function dn(t,n){return Is(t.hass,n)}function ur(t,n,e,i={}){let r=i.negate?`${o(t.hass,"condition_summary.not","not")} `:"";if(n.length===1)return`${n[0]} ${o(t.hass,"condition_summary.is","is")} ${r}${e}`;let a=i.all===!0,s=a?o(t.hass,"condition_summary.all_of","All of"):o(t.hass,"condition_summary.any_of","Any of"),d=a?o(t.hass,"condition_summary.are","are"):o(t.hass,"condition_summary.is","is");return`${s} (${n.join(", ")}) ${d} ${r}${e}`}function td(t,n={}){if(t==null||!t.sensors?.length)return o(n.hass,"ui.summary_any","any");let e=t.sensors.map(a=>dn(n,a)),i=t.occupied===!1?o(n.hass,"occupancy_summary.clear","clear"):o(n.hass,"occupancy_summary.detected","detected"),r=ur(n,e,i,{all:t.quant==="all",negate:t.negate});return t.for&&ti(t.for)?`${r} ${o(n.hass,"ui.for_prefix","for")} ${Zt(t.for_mode)}${sn(t.for)}`:r}function id(t,n){if(n==null||typeof n!="object")return!1;if(t==="occupancy"||t==="lux")return!!n.negate;if(t==="people"){let e=n;return!!e.negate&&Array.isArray(e.who)&&e.who.length===1}return!1}function nd(t){return{...t,negate:!1}}function sr(t){if(t.kind==="and"||t.kind==="or"){let n=t.items.map(sr);return n.length===1?n[0]:{...t,items:n}}return t.kind==="not"?{...t,item:sr(t.item)}:t}function Xt(t){if(t.kind==="is_not")return t.for&&ti(t.for)?null:{...t,kind:"is"};if(t.kind==="not"){let n=t.item.kind;return n==="is"||n===">"||n===">="||n==="<"||n==="<="||n==="and"||n==="or"?t.item:null}if(t.kind==="or"){let n=[];for(let e of t.items){let i=Xt(e);if(!i)return null;n.push(i)}return n.length===1?n[0]:{kind:"and",items:n}}return null}function rd(t,n){let e=At("state",t,n);return(t.kind==="and"||t.kind==="or")&&t.items.length>1?`(${e})`:e}function nn(t,n,e){let i=[],r=[];for(let p of t.items){let _=Xt(p);_?r.push(_):i.push(p)}let a=` ${j(n.hass,"or")} `,s=i.map(p=>or(p,n)).join(a),d="";if(r.length){let p=r.length===1?r[0]:{kind:"and",items:r};d=`${o(n.hass,"blocker_summary.until","until")} ${rd(p,n)}`}let u=[s,d].filter(p=>p!=="").join(a),h=i.length+(r.length?1:0);return e&&h>1?`(${u})`:u}function rn(t,n){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<=")return an(t,n,!1);if(t.kind==="and"){let e=` ${j(n.hass,"and")} `;return t.items.map(i=>or(i,n)).join(e)}if(t.kind==="or")return nn(t,n,!1);if(t.kind==="not"){let e=t.item;return e.kind==="is"?an(e,n,!0):`${j(n.hass,"not")} ${or(e,n)}`}return""}function or(t,n){return t.kind==="or"?nn(t,n,!0):t.kind==="and"?`(${rn(t,n)})`:rn(t,n)}function ad(t,n,e){let i=sr(t);if(i.kind==="and"){let a=[],s=[];for(let h of i.items){let p=Xt(h);p?s.push(p):a.push(h)}let d=[];if(a.length>0){let h=a.length===1?a[0]:{kind:"and",items:a};d=[h.kind==="or"?nn(h,n,!e):rn(h,n)]}let u=s.map(h=>At("state",h,n));return{guards:d,releases:u}}if(i.kind==="or"){let a=Xt(i);return a?{guards:[],releases:[At("state",a,n)]}:{guards:[nn(i,n,!e)],releases:[]}}let r=Xt(i);return r?{guards:[],releases:[At("state",r,n)]}:{guards:[rn(i,n)],releases:[]}}var sd=new Set(["occupancy","people","state","lux","unavailable","script","template","day","time_of_day","weather"]);function At(t,n,e){let i=Lt(t,n,e);return sd.has(t)?i:`${K(e.hass,t)}: ${i}`}function Fs(t,n={}){let e=o(n.hass,"blocker_summary.block","Block"),i=Object.keys(t.when).filter(_=>t.when[_]!=null);if(n.priorities){let _=n.priorities;i=i.sort((f,v)=>{let x=_.get(f),S=_.get(v);return x===void 0&&S===void 0?0:(S??-1/0)-(x??-1/0)})}let r=[],a=[];for(let _ of i){let f=t.when[_];if(_==="state"){let v=ad(f,n,i.length===1);a.push(...v.guards),r.push(...v.releases);continue}id(_,f)?r.push(At(_,nd(f),n)):a.push(At(_,f,n))}let s=o(n.hass,"blocker_summary.until","until"),d=` ${o(n.hass,"blocker_summary.or","or")} `,u=` ${o(n.hass,"blocker_summary.and","and")} `,h=r.join(d),p=a.join(u);if(r.length&&a.length){let _=o(n.hass,"blocker_summary.while_lead","While"),f=o(n.hass,"blocker_summary.block_mid","block");return`${_} ${p}, ${f} ${s} ${h}`}if(r.length)return`${e} ${s} ${h}`;if(a.length){let _=o(n.hass,"blocker_summary.while","while");return`${e} ${_} ${p}`}return`${e} ${o(n.hass,"blocker_summary.always","always")}`}function od(t,n={}){if(t==null||!t.entities?.length)return o(n.hass,"ui.summary_any","any");let e=t.entities.map(r=>dn(n,r)),i=o(n.hass,"unavailable_summary.unavailable","unavailable");return ur(n,e,i)}function hr(t,n,e="any lux"){return t!=null&&n!=null?`${t}\u2013${n} lx`:n!=null?`<${n} lx`:t!=null?`\u2265${t} lx`:e}function ld(t,n={}){if(t==null||!t.sensors?.length)return o(n.hass,"ui.summary_any","any");let e=t.sensors.map(r=>dn(n,r)),i=t.range!=null?Re(n.hass,t.range,n.luxRanges?.custom??{}):hr(t.min,t.max);return ur(n,e,i,{all:t.quant==="all",negate:t.negate})}function pr(t,n={}){return t==null?o(n.hass,"ui.summary_any","any"):lr(t,n)}function an(t,n,e){let i=j(n.hass,t.kind),r=dn(n,t.entity_id),a=n.hass?.states?.[t.entity_id],d=t.kind!=="is"&&t.kind!=="is_not"?t.states[0]??"":t.states.map(_=>De(n.hass,a,t.attribute,_)).join("/"),u=t.attribute?`${r}.${Ti(n.hass,a,t.attribute)}`:r,h=e?`${j(n.hass,"not")} `:"",p=`${u} ${i} ${h}${d}`;return t.for&&ti(t.for)?`${p} ${o(n.hass,"ui.for_prefix","for")} ${Zt(t.for_mode)}${sn(t.for)}`:p}function lr(t,n){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<=")return an(t,n,!1);if(t.kind==="and"||t.kind==="or"){let e=` ${j(n.hass,t.kind)} `;return t.items.map(i=>Os(i,n)).join(e)}if(t.kind==="not"){let e=t.item;return e.kind==="is"?an(e,n,!0):`${j(n.hass,"not")} ${Os(e,n)}`}return""}function Os(t,n){return t.kind==="and"||t.kind==="or"?`(${lr(t,n)})`:lr(t,n)}function ti(t){return t.h>0||t.m>0||t.s>0}function sn(t){let n=[];return t.h&&n.push(`${t.h}h`),t.m&&n.push(`${t.m}m`),t.s&&n.push(`${t.s}s`),n.length?n.join(" "):"0s"}function cn(t,n){if(t===null)return o(n.hass,"ui.summary_any","any");let e=Array.isArray(t)?t:[t],i=n.periods?.custom??{};return e.map(r=>"period"in r?he(n.hass,r.period,i):`${Ms(r.from,n)} \u2192 ${Ms(r.to,n)}`).join(", ")}function Ms(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=ne(n.hass,t.anchor),i=e;if(t.offset_min!==0){let r=Math.abs(t.offset_min),a=r%60===0?`${r/60}${o(n.hass,"ui.unit_hour_abbr","h")}`:`${r}${o(n.hass,"ui.unit_min_abbr","m")}`;i=`${e}${t.offset_min<0?"-":"+"}${a}`}if(t.clamp){let r=t.clamp.dir==="not_before"?o(n.hass,"ui.clamp_not_before","not before"):o(n.hass,"ui.clamp_not_after","not after"),a=`${String(t.clamp.hh).padStart(2,"0")}:${String(t.clamp.mm).padStart(2,"0")}`;i=`${i} (${r} ${a})`}return i}function dd(t,n){return ft(t.service,n.exposedActions,()=>n.schemas?.[t.service]?.name?.trim()||Pi(n.hass,t.service))}function cd(t,n){let e=t.entity_ids.length;if(e===0)return o(n.hass,"ui.no_targets","(no targets)");let i=new Set;for(let a of t.entity_ids){let s=a.indexOf(".");s>0&&i.add(a.slice(0,s))}let r=String(e);if(i.size===1){let a=[...i][0];return e===1?o(n.hass,"ui.count_domain_target_one","{n} {domain}",{n:r,domain:a}):o(n.hass,"ui.count_domain_target_other","{n} {domain}s",{n:r,domain:a})}return e===1?o(n.hass,"ui.count_target_one","{n} target",{n:r}):o(n.hass,"ui.count_target_other","{n} targets",{n:r})}function js(t,n){let e=dd(t,n),i=cd(t,n),r=Object.entries(t.params).filter(([,a])=>a!=null&&a!=="").map(([a,s])=>`${ii(a,t.service,n.schemas)}: ${Oe(n.hass,s)}`).join(", ");return r?`${e}: ${i}, ${r}`:`${e}: ${i}`}var N=class extends b{constructor(){super(...arguments);this.scenes=[];this.availableActions=[];this.schemas={};this.categories=[];this.filterCategory="";this.collapsedCategories=[];this.liveSuppressed=!1;this._drag=new Ct(this,(e,i)=>this._emit("reorder-scenes",{from:e,to:i}));this._expanded=new Set}willUpdate(e){e.has("scenes")&&(this._expanded=new Set)}_renderSectionHeader(e,i,r){return l`<div
      class="category-section-header"
      style=${qi(e.color)}
      @click=${()=>this._emit("toggle-category-collapse",{categoryId:e.id})}
    >
      <span class="category-chevron ${i?"open":""}" aria-hidden="true">▶</span>
      ${e.icon?l`<ha-icon icon=${e.icon}></ha-icon>`:""}
      <span>${e.name}</span>
      ${Zi(this.hass,r.map(([,a])=>a))}
      <ambience-kebab-menu
        class="category-kebab"
        .hass=${this.hass}
        @click=${a=>a.stopPropagation()}
        .items=${[{id:"run",label:o(this.hass,"ui.run","Run"),icon:"mdi:play"},{id:"traces",label:o(this.hass,"ui.view_traces","View traces"),icon:"mdi:transit-connection-variant"},{id:"simulate",label:o(this.hass,"ui.simulate","Simulate"),icon:"mdi:flask-outline"},{id:"auto",label:o(this.hass,"ui.auto_triggers_section","Auto-triggers"),icon:"mdi:flash-auto"},{id:"download",label:o(this.hass,"ui.download_diagnostics","Download diagnostics"),icon:"mdi:download"}]}
        @menu-action=${a=>this._onCategoryMenu(e,a.detail.id)}
      ></ambience-kebab-menu>
    </div>`}_sections(){let e=this.scenes.map((r,a)=>[a,r]);if(this.filterCategory!=="")return[{category:this.categories.find(r=>r.id===this.filterCategory),rows:e.filter(([,r])=>r.category===this.filterCategory)}];let i=new Map;for(let[r,a]of e){let s=i.get(a.category)??[];s.push([r,a]),i.set(a.category,s)}return[...i.entries()].map(([r,a])=>({category:this.categories.find(s=>s.id===r),rows:a})).sort((r,a)=>(r.category?.name??"").localeCompare(a.category?.name??""))}_emit(e,i){this.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}_priorityMap(){let e=this.conditions;return(!this._priorityOfCache||this._priorityOfCache.src!==e)&&(this._priorityOfCache={src:e,map:new Map((e??[]).map(i=>[i.name,i.priority]))}),this._priorityOfCache.map}_whenKeys(e){let i=this._priorityMap();return Object.keys(e.when).filter(r=>e.when[r]!=null).sort((r,a)=>(i.get(a)??-1/0)-(i.get(r)??-1/0))}_whenSummary(e){let i=this._whenKeys(e);return i.length===0?o(this.hass,"ui.summary_always","Always"):i.map((r,a)=>{let s=K(this.hass,r),d=Lt(r,e.when[r],{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups});return l`${a===0?"":", "}<strong>${s}:</strong> ${d}`})}_blockerSummary(e){return Fs(e,{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups,priorities:this._priorityMap()})}_whenStacked(e){let i=this._whenKeys(e);return i.length===0?l`<div class="condition-line">
        ${o(this.hass,"ui.summary_always","Always")}
      </div>`:i.map(r=>{let a=K(this.hass,r),s=Lt(r,e.when[r],{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups});return l`<div class="condition-line">
        <strong>${a}:</strong> ${s}
      </div>`})}_actionCountLabel(e){let i=e.actions.length,r=i===1?o(this.hass,"ui.action_singular","action"):o(this.hass,"ui.action_plural","actions");return`${i} ${r}`}_toggleScene(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}_entityName(e){return at(this.hass,e)}_actionParamsString(e){return Object.entries(e.params).filter(([,i])=>i!=null&&i!=="").map(([i,r])=>`${ii(i,e.service,this.schemas)}: ${Oe(this.hass,r)}`).join(", ")}_actionLabel(e){return ft(e.service,this.availableActions,()=>this.schemas[e.service]?.name?.trim()||Pi(this.hass,e.service))}_onCategoryMenu(e,i){i==="run"?this._emit("apply-category",{categoryId:e.id}):i==="traces"?this._emit("show-traces",{category:e.id}):i==="simulate"?this._emit("show-simulator",{category:e.id}):i==="auto"?this._emit("show-auto-triggers",{category:e.id}):i==="download"&&this._emit("download-diagnostics",{category:e.id})}_onSceneMenu(e,i){i==="edit"?this._emit("edit-scene",{index:e}):i==="duplicate"?this._emit("duplicate-scene",{index:e}):i==="run"?this._emit("run-scene-actions",{index:e}):i==="delete"&&this._emit("delete-scene",{index:e})}_liveDot(e,i){if(this.liveSuppressed||!this.scope||!this.live)return"";let r=this.live.get(Ee(this.scope,i.category));if(!r)return"";if(r.matched===e){let a=o(this.hass,"ui.scene_live","Live now \u2014 this scene currently matches and is applied");return l`<ambience-live-dot kind="matched" .label=${a}></ambience-live-dot>`}if(r.applied===e){let a=o(this.hass,"ui.scene_applied_stale","Still applied \u2014 this scene's actions are in effect but it no longer matches");return l`<ambience-live-dot kind="stale" .label=${a}></ambience-live-dot>`}return""}_problemFlag(e){let i=Ji(e);if(!i.severity)return"";let r=[];return i.shadowed&&r.push(o(this.hass,"ui.shadowed","Never fires \u2014 shadowed by an earlier scene.")),i.missing.length&&r.push(`${o(this.hass,"ui.problem_missing","Missing or disabled in Home Assistant:")} ${i.missing.join(", ")}`),i.overlap.length&&r.push(`${o(this.hass,"ui.problem_overlap","Controlled by multiple groups:")} ${i.overlap.join(", ")}`),i.configIssues.length&&r.push(`${o(this.hass,"ui.problem_config","Configuration problems:")} ${i.configIssues.map(a=>Ts(this.hass,a)).join(", ")}`),l`<ambience-problem-flag
      .severity=${i.severity}
      .details=${r}
      .summary=${r.join(`
`)}
    ></ambience-problem-flag>`}_renderRow(e,i,r){let a=o(this.hass,"ui.unpin","Unpin (return to automatic order)"),s=i.enabled===!1,d=s?o(this.hass,"ui.enable_scene","Enable scene"):o(this.hass,"ui.disable_scene","Disable scene"),u=!!i.description?.trim();return l`
      <li
        data-drag-index=${e}
        class="${this._drag.over===e?"drag-over ":""}${this._drag.from===e?"dragging ":""}${s?"disabled":""}"
      >
        <span class="lead">
          ${i.pinned?l`<button
                class="pin"
                title=${a}
                aria-label=${a}
                @pointerdown=${h=>this._drag.start(e,h)}
                @click=${h=>{if(h.stopPropagation(),this._drag.moved){this._drag.moved=!1;return}this._emit("unpin-scene",{index:e})}}
              >
                📌
              </button>`:l`<span
                class="handle"
                title=${o(this.hass,"ui.drag_to_reorder","Drag to reorder")}
                @pointerdown=${h=>this._drag.start(e,h)}
                >⠿</span
              >`}
        </span>
        <span class="idx">${r}</span>
        <span class="warn-slot">${this._problemFlag(i)||this._liveDot(e,i)}</span>
        <div class="body" @click=${()=>this._toggleScene(e)}>
          <div class="name">
            ${on(i,o(this.hass,"ui.scene_n","Scene {n}").replace("{n}",String(r)))}
            ${u&&!this._expanded.has(e)?l`<ambience-help
                    class="name-help"
                    .hass=${this.hass}
                    multiline
                    .text=${i.description}
                  ></ambience-help>`:""}
          </div>
          <div class="summary">
            ${this._expanded.has(e)?"":i.actions.length===0?this._blockerSummary(i):l`${this._whenSummary(i)} ·
                    <span class="action-count"
                      >${this._actionCountLabel(i)}</span
                    >${i.apply==="always"?l` ·
                          <span class="apply-every" data-test="apply-every"
                            >${o(this.hass,"ui.apply_on_every_match","Apply on every match")}</span
                          >`:""}`}
          </div>
          ${this._expanded.has(e)?l`
                <div class="scene-detail">
                  ${u?l`<div class="scene-description">${i.description}</div>`:""}
                  ${this._whenStacked(i)}
                  ${i.actions.length===0?l`<div class="noop-detail">
                        ${this._blockerSummary(i)}
                      </div>`:l`<div class="actions-detail">
                        ${i.actions.map(h=>{let p=this._actionParamsString(h),_=this._actionLabel(h),f=p?`${_} \xB7 ${p}`:_;return l`
                            <div class="actions-detail-item">
                              <div class="action-header">${f}</div>
                              ${h.entity_ids.length===0?l`<div class="no-targets">
                                    ${o(this.hass,"ui.no_targets","(no targets)")}
                                  </div>`:l`<ul class="entity-list">
                                    ${h.entity_ids.map(v=>l`<li>${this._entityName(v)}</li>`)}
                                  </ul>`}
                            </div>
                          `})}
                      </div>
                      ${i.apply==="always"?l`<div class="apply-every-detail" data-test="apply-every-detail">
                            ${o(this.hass,"ui.apply_on_every_match","Apply on every match")}
                          </div>`:""}`}
                </div>
              `:""}
        </div>
        <button
          class="toggle"
          @click=${h=>{h.stopPropagation(),this._emit("toggle-scene-enabled",{index:e,enabled:s})}}
          title=${d}
          aria-label=${d}
        >
          <ha-icon
            icon=${s?"mdi:toggle-switch-off-outline":"mdi:toggle-switch"}
          ></ha-icon>
        </button>
        <ambience-kebab-menu
          class="row-kebab"
          .hass=${this.hass}
          .label=${o(this.hass,"ui.scene_actions","Scene actions")}
          .items=${[{id:"edit",label:o(this.hass,"ui.edit","Edit"),icon:"mdi:pencil"},{id:"duplicate",label:o(this.hass,"ui.duplicate","Duplicate"),icon:"mdi:content-duplicate"},{id:"run",label:o(this.hass,"ui.run_actions","Run actions"),icon:"mdi:play"},{id:"delete",label:o(this.hass,"ui.title_delete","Delete"),icon:"mdi:delete",danger:!0,dividerBefore:!0}]}
          @menu-action=${h=>this._onSceneMenu(e,h.detail.id)}
        ></ambience-kebab-menu>
      </li>
    `}render(){let e=this._sections().filter(r=>r.rows.length>0);if(e.length===0){let r=this.filterCategory?{category:this.filterCategory}:{};return l`
        <p class="empty">
          ${o(this.hass,"ui.no_scenes_yet","No scenes yet.")}
        </p>
        <button class="add" @click=${()=>this._emit("add-scene",r)}>
          ${o(this.hass,"ui.add_scene","+ Add scene")}
        </button>
      `}let i=this.categories.length>0;return l`
      ${e.map(r=>{let a=!!r.category&&this.collapsedCategories.includes(r.category.id);return l`
          <div class="category-section">
            ${i&&r.category?this._renderSectionHeader(r.category,!a,r.rows):""}
            ${a?"":l`
                  <ul>
                    ${r.rows.map(([s,d],u)=>this._renderRow(s,d,u+1))}
                  </ul>
                  <button
                    class="add"
                    @click=${()=>this._emit("add-scene",{category:r.category?.id})}
                  >
                    ${o(this.hass,"ui.add_scene","+ Add scene")}
                  </button>
                `}
          </div>
        `})}
    `}};N.styles=y`
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
      /* Top-align so the drag handle, number, toggle and kebab stay in line
         with the scene name when the card is expanded (the body grows tall with
         the condition summary + action detail); centering would float them down
         beside the action row. */
      align-items: flex-start;
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
    li.dragging {
      opacity: 0.8;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
      position: relative;
      z-index: 1000;
    }
    li.disabled .body,
    li.disabled .idx {
      opacity: 0.5;
    }
    .toggle {
      padding: 0.25rem 0.5rem;
    }
    .toggle ha-icon {
      --mdc-icon-size: 36px;
    }
    .handle {
      cursor: grab;
      color: var(--secondary-text-color, #888);
      user-select: none;
      /* The ⠿ glyph (not the whole lead slot) is the grab handle, so the pin
         button beside it stays tappable. touch-action:none suppresses the
         browser's touch panning so a drag on a phone reorders, not scrolls. */
      touch-action: none;
    }
    .handle:active {
      cursor: grabbing;
    }
    .idx {
      /* Tabular figures keep the number column aligned (the reason this was once
         monospace) while sharing the scene name's font and metrics, so the
         number, name and live dot sit on one line under the row's top
         alignment — no per-element nudging. */
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color, #888);
      margin-right: 0.25rem;
      /* Wide enough for two digits — we don't expect >99 scenes. */
      min-width: 1.4em;
      text-align: right;
    }
    .body {
      flex: 1;
      /* A flex item won't shrink below its content's intrinsic width unless
         min-width is overridden — without this, a long unbreakable token in the
         summary (e.g. an entity id like binary_sensor.bathroom_1_shower_presence)
         forces the body wider than the card, pushing the toggle + kebab off the
         right edge. overflow-wrap lets those tokens break so the text wraps
         inside the card instead of overflowing (it inherits to .name, .summary
         and the expanded detail below). */
      min-width: 0;
      overflow-wrap: anywhere;
      cursor: pointer;
    }
    .name {
      font-weight: 600;
    }
    /* The description "?" next to the scene name. */
    .name-help {
      /* Darker "?" so it reads against the bold (near-black) name rather than
         the muted grey the trigger defaults to. */
      --ambience-help-trigger-color: var(--primary-text-color, #212121);
      /* A space of breathing room from the name, and a small upward nudge so
         the circle sits centred on the capitals instead of a touch low. */
      margin-left: 0.35rem;
      position: relative;
      top: -0.08em;
    }
    .summary {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .scene-detail {
      margin-top: 0.35rem;
      padding-left: 0.75rem;
      border-left: 2px solid var(--divider-color, #e0e0e0);
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .scene-description {
      white-space: pre-wrap;
      color: var(--secondary-text-color, #888);
      margin-bottom: 0.5rem;
    }
    .condition-line {
      padding: 0.05rem 0;
      /* Wrap continuation lines indented to align under the condition body
         (after the bold "Condition:" label). */
      padding-left: 1.25rem;
      text-indent: -1.25rem;
    }
    .actions-detail,
    .noop-detail {
      margin-top: 0.35rem;
      padding-top: 0.35rem;
      border-top: 1px dashed var(--divider-color, #e0e0e0);
    }
    .noop-detail {
      font-style: italic;
    }
    .actions-detail-item {
      padding: 0.15rem 0;
    }
    .apply-every-detail {
      margin-top: 0.35rem;
      color: var(--secondary-text-color, #888);
      font-style: italic;
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
    /* Fixed-width slot shared by the shadow/problem warning and the live dot, so
       the scene title aligns whether or not a row has either. The warning flag
       takes precedence; the dot shows only when there's no warning. min-height
       keeps the dot (and flag) centred on the scene name rather than floating to
       the top of a tall expanded row. */
    .warn-slot {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      flex: 0 0 1.4em;
      min-height: 1.2em;
    }
    /* Nudge the live dot toward the scene name (the warning flag stays at the
       slot's left edge). */
    .warn-slot ambience-live-dot {
      margin-left: 0.3em;
    }
    .pin {
      padding: 0;
      /* The pin doubles as the grab handle (tap = unpin, drag = reorder), so it
         needs the same grab cursor and touch-pan suppression as .handle. */
      cursor: grab;
      touch-action: none;
    }
    .pin:active {
      cursor: grabbing;
    }
    .category-section-header ambience-problem-flag {
      margin-left: 0.25rem;
    }
    /* Full-width coloured bar before each category's scenes. The colour + text
       colour are set inline per category; this CSS rule carries layout + the neutral
       fallback used when a category has no colour. */
    .category-section-header {
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
      /* The whole bar toggles the section's collapse (the kebab stops its own
         clicks); show the affordance. */
      cursor: pointer;
    }
    /* Chevron mirrors the scope-header's: points right when collapsed, rotates
       to point down when the section is open. Inherits the bar's (auto-contrast)
       text colour. */
    .category-chevron {
      flex: 0 0 auto;
      width: 1em;
      font-size: 0.85em;
      color: currentColor;
      transition: transform 0.1s;
    }
    .category-chevron.open {
      transform: rotate(90deg);
    }
    .category-section:first-of-type .category-section-header {
      margin-top: 0;
    }
    .category-section-header ha-icon {
      --mdc-icon-size: 20px;
    }
    .category-kebab {
      margin-left: auto;
      --kebab-trigger-color: currentColor;
      /* Cancel the header's right padding so the kebab sits flush at the bar's
         right edge — aligning it with the scope-header and scene-row kebabs. */
      margin-right: -0.75rem;
    }
    .row-kebab {
      /* Cancel the row's right padding so the kebab sits flush at the card's
         right edge, vertically in line with the category and scope kebabs. The
         extra -1px compensates for the row card's 1px border (the category bar
         has none), so all three kebab columns align to the same pixel. */
      margin-right: calc(-1rem - 1px);
    }
  `,c([m({attribute:!1})],N.prototype,"scenes",2),c([m({attribute:!1})],N.prototype,"periods",2),c([m({attribute:!1})],N.prototype,"luxRanges",2),c([m({attribute:!1})],N.prototype,"weatherConfig",2),c([m({attribute:!1})],N.prototype,"hass",2),c([m({attribute:!1})],N.prototype,"conditions",2),c([m({attribute:!1})],N.prototype,"availableActions",2),c([m({attribute:!1})],N.prototype,"schemas",2),c([m({attribute:!1})],N.prototype,"categories",2),c([m({attribute:!1})],N.prototype,"filterCategory",2),c([m({attribute:!1})],N.prototype,"collapsedCategories",2),c([m({attribute:!1})],N.prototype,"scope",2),c([m({attribute:!1})],N.prototype,"live",2),c([m({attribute:!1})],N.prototype,"liveSuppressed",2),c([g()],N.prototype,"_expanded",2),N=c([w("ambience-scenes-list")],N);var _e=class extends b{constructor(){super(...arguments);this.entities=[];this.value=[];this.target=null;this.label=" "}_filteredEntities(){return $s(this.entities,this.target)}connectedCallback(){super.connectedCallback(),ie(this)}_emit(e){L(this,e)}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let i=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this._filteredEntities()}}}],r=this.label;return l`
      <ha-form
        .hass=${this.hass}
        .schema=${i}
        .data=${{entity_ids:this.value}}
        .computeLabel=${()=>r}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,i){let r=new Set(this.value);i?r.add(e):r.delete(e),this._emit(this._filteredEntities().filter(a=>r.has(a)))}_renderFallback(){let e=this._filteredEntities();return e.length===0?l`<p class="empty">${o(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:l`
      <div class="checkboxes">
        ${e.map(i=>l`
            <label>
              <input
                type="checkbox"
                .checked=${this.value.includes(i)}
                @change=${r=>this._toggle(i,r.target.checked)}
              />
              ${i}
            </label>
          `)}
      </div>
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};_e.styles=y`
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
  `,c([m({attribute:!1})],_e.prototype,"hass",2),c([m({attribute:!1})],_e.prototype,"entities",2),c([m({attribute:!1})],_e.prototype,"value",2),c([m({attribute:!1})],_e.prototype,"target",2),c([m()],_e.prototype,"label",2),_e=c([w("ambience-target-picker")],_e);var q=class extends b{constructor(){super(...arguments);this.entityIds=[];this.params={};this.excludeEntities=[];this._schema=void 0;this._schemaError=null;this._exposedMissing=!1;this._formSchema=[];this._perFieldSchemas={};this._schemaServiceId=null;this._onTargetChanged=e=>{e.stopPropagation(),this._emit("entity-ids-changed",{entityIds:e.detail.value})};this._onFieldInput=e=>i=>{i.stopPropagation();let r=i.target,a={...this.params,[e]:r.value};this._emit("params-changed",{params:a})};this._onHaFormChanged=e=>{e.stopPropagation(),this._emit("params-changed",{params:{...this.params,...e.detail.value}})}}connectedCallback(){super.connectedCallback(),ie(this)}willUpdate(e){if((e.has("exposed")&&e.get("exposed")?.id!==this.exposed?.id||e.has("hass")&&this._schema===void 0&&this._schemaServiceId!==this.exposed?.id)&&this._loadSchema(),(e.has("exposed")||e.has("_schema"))&&(this._formSchema=this._buildFormSchema()),e.has("_formSchema")||e.has("_schema")||e.has("exposed")){let i={};for(let r of this._formSchema)i[r.name]=[r];this._perFieldSchemas=i}}async _loadSchema(){if(this.exposed===void 0&&this.hass){this._exposedMissing=!0,this._schema=null,this._schemaServiceId=null;return}let e=this.exposed?.id;if(!e||!this.hass){this._exposedMissing=!1,this._schema=void 0,this._schemaServiceId=null;return}this._exposedMissing=!1,this._schemaServiceId=e,this._schemaError=null,this._schema=void 0;try{let i=await Ie(this.hass,e);if(this._schemaServiceId!==e)return;this._schema=i}catch(i){if(this._schemaServiceId!==e)return;this._schema=null,this._schemaError=C(this.hass,i)}}_buildFormSchema(){let e=this._schema,i=this.exposed;if(!e||!i)return[];let r=new Set(i.visible_fields??[]),a=[];for(let[s,d]of Object.entries(e.fields))r.has(s)&&a.push({name:s,selector:d.selector??{text:{}},required:!!d.required,description:typeof d.description=="string"&&d.description?d.description:void 0});return a}updated(e){super.updated?.(e),e.has("_schema")&&this.dispatchEvent(new CustomEvent("target-mode-changed",{detail:{hasTarget:this.hasTarget()},bubbles:!0,composed:!0}))}_hasTarget(){let e=this._schema?.target??null;return!e||typeof e!="object"?!1:Object.keys(e).length>0}hasTarget(){return this._schema===void 0?!1:this._hasTarget()}_scopeEntities(){return!this.scope||!this.hass?[]:Qi(this.hass,this.scope,[])}_renderTargetPicker(){if(!this._hasTarget())return"";let e=new Set(this.excludeEntities),i=this._scopeEntities().filter(s=>!e.has(s)),r=this._schema?.target??null,a=o(this.hass,"ui.target","Target");return l`
      <div class="target-picker field-row">
        <div class="field-header">
          <span class="field-label">${a}</span>
        </div>
        <ambience-target-picker
          .hass=${this.hass}
          .entities=${i}
          .target=${r}
          .value=${this.entityIds}
          .label=${" "}
          @value-changed=${this._onTargetChanged}
        ></ambience-target-picker>
      </div>
    `}_humanizeFieldLabel(e){let i=this._schema?.fields[e];return i?.name?i.name:F(e)}_clearField(e){if(!(e in this.params))return;let i={...this.params};delete i[e],this._emit("params-changed",{params:i})}_extraParamKeys(){let e=new Set;for(let i of this._formSchema)e.add(i.name);for(let i of Object.keys(this.exposed?.defaults??{}))e.add(i);return Object.keys(this.params).filter(i=>!e.has(i))}_clearExtraParams(){let e=new Set(this._extraParamKeys());if(e.size===0)return;let i={};for(let[r,a]of Object.entries(this.params))e.has(r)||(i[r]=a);this._emit("params-changed",{params:i})}_fieldData(e){return e in this.params?{[e]:this.params[e]}:{}}_defaultHintSuffix(e){let i=this.exposed?.defaults??{};if(!(e.name in i))return"";let r=ln(e.selector),a=Oe(this.hass,i[e.name]);return` (${o(this.hass,"ui.default_prefix","Default: ")}${a}${r?` ${r}`:""})`}_hasUserOverride(e){return e in this.params}_renderExtraParamsNotice(){let e=this._extraParamKeys();if(e.length===0)return"";let i=e.join(", ");return l`
      <div class="extra-params-notice" data-extra-params>
        <span>
          ${o(this.hass,"ui.extra_fields_prefix","Extra fields:")} ${i}.
          ${o(this.hass,"ui.extra_fields_hint","These fields aren't currently exposed but will still be sent.")}
        </span>
        <button data-remove-extras @click=${()=>this._clearExtraParams()}>
          ${o(this.hass,"ui.remove","Remove")}
        </button>
      </div>
    `}_renderFieldsForm(){let e=this._formSchema,i=this._renderExtraParamsNotice();return e.length===0?i===""?"":l`<div class="fields-form">${i}</div>`:customElements.get("ha-form")?l`
        <div class="fields-form">
          ${e.map(r=>{let a=this._perFieldSchemas[r.name]??[r],s=this._fieldData(r.name),d=this._defaultHintSuffix(r);return l`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <span class="field-label">${this._humanizeFieldLabel(r.name)}${r.required?" *":""}</span>${d?l`<span class="field-default-hint">${d}</span>`:""}
                  </span>
                  ${this._hasUserOverride(r.name)?l`<button
                        class="field-clear"
                        data-clear=${r.name}
                        @click=${()=>this._clearField(r.name)}
                        title=${o(this.hass,"ui.clear_default","Clear default")}
                      >✕</button>`:""}
                </div>
                <ha-form
                  .hass=${this.hass}
                  .schema=${a}
                  .data=${s}
                  .computeLabel=${()=>""}
                  @value-changed=${this._onHaFormChanged}
                ></ha-form>
              </div>
            `})}
          ${i}
        </div>
      `:l`
      <div class="fields-form">
        ${e.map(r=>{let a=this._fieldData(r.name),s=r.name in a?String(a[r.name]??""):"",d=this._defaultHintSuffix(r);return l`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <label class="field-label">${this._humanizeFieldLabel(r.name)}${r.required?" *":""}</label>${d?l`<span class="field-default-hint">${d}</span>`:""}
                  </span>
                  ${this._hasUserOverride(r.name)?l`<button
                        class="field-clear"
                        data-clear=${r.name}
                        @click=${()=>this._clearField(r.name)}
                        title=${o(this.hass,"ui.clear_default","Clear default")}
                      >✕</button>`:""}
                </div>
                <input
                  type="text"
                  data-field=${r.name}
                  .value=${s}
                  @input=${this._onFieldInput(r.name)}
                />
              </div>
            `})}
        ${i}
      </div>
    `}_emit(e,i){this.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}_renderRawConfig(){let e=this.service??this.exposed?.id;if(!e)return"";let i=Object.entries(this.params??{});return l`
      <dl class="raw-config" data-raw-config>
        <div class="raw-row">
          <dt>${o(this.hass,"ui.raw_config_action","Action")}:</dt>
          <dd>${e}</dd>
        </div>
        ${this.entityIds.length?l`<div class="raw-row">
                <dt>${o(this.hass,"ui.raw_config_targets","Targets")}:</dt>
                <dd>${this.entityIds.join(", ")}</dd>
              </div>`:""}
        ${i.length?l`<div class="raw-row">
                <dt>${o(this.hass,"ui.raw_config_params","Parameters")}:</dt>
                <dd>${i.map(([r,a])=>`${r}: ${a==null?"":cr(a)}`).join(", ")}</dd>
              </div>`:""}
      </dl>
    `}render(){if(this._schema===null){let r=this._exposedMissing?o(this.hass,"ui.action_unavailable","Action no longer available; configure it in Settings \u2192 Actions or remove this action."):this._schemaError??o(this.hass,"ui.service_unavailable","Service not available in this HA instance.");return l`
        <div class="schema-error">${r}</div>
        ${this._renderRawConfig()}
      `}if(this._schema===void 0)return l`<div>${o(this.hass,"ui.loading","Loading\u2026")}</div>`;let e=this._renderTargetPicker(),i=this._renderFieldsForm();return e===""&&i===""?l`<div class="no-params">${o(this.hass,"ui.action_no_parameters","This action has no configurable fields.")}</div>`:l`${e}${i}`}};q.styles=y`
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
    .raw-config {
      margin: 0.25rem 0 0.5rem 0;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--secondary-background-color, #f5f5f5);
      font-size: 0.85rem;
    }
    .raw-config .raw-row {
      display: flex;
      gap: 0.5rem;
      padding: 0.1rem 0;
    }
    .raw-config dt {
      flex: 0 0 auto;
      font-weight: 600;
      color: var(--secondary-text-color, #888);
    }
    .raw-config dd {
      margin: 0;
      overflow-wrap: anywhere;
      font-family: var(--code-font-family, monospace);
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
  `,c([m({attribute:!1})],q.prototype,"hass",2),c([m({attribute:!1})],q.prototype,"scope",2),c([m({attribute:!1})],q.prototype,"exposed",2),c([m({attribute:!1})],q.prototype,"service",2),c([m({attribute:!1})],q.prototype,"entityIds",2),c([m({attribute:!1})],q.prototype,"params",2),c([m({attribute:!1})],q.prototype,"excludeEntities",2),c([g()],q.prototype,"_schema",2),c([g()],q.prototype,"_schemaError",2),c([g()],q.prototype,"_exposedMissing",2),c([g()],q.prototype,"_formSchema",2),c([g()],q.prototype,"_perFieldSchemas",2),q=c([w("ambience-action-slot")],q);function no(t){return typeof t>"u"||t===null}function ud(t){return typeof t=="object"&&t!==null}function hd(t){return Array.isArray(t)?t:no(t)?[]:[t]}function pd(t,n){var e,i,r,a;if(n)for(a=Object.keys(n),e=0,i=a.length;e<i;e+=1)r=a[e],t[r]=n[r];return t}function md(t,n){var e="",i;for(i=0;i<n;i+=1)e+=t;return e}function _d(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var gd=no,fd=ud,vd=hd,yd=md,bd=_d,wd=pd,O={isNothing:gd,isObject:fd,toArray:vd,repeat:yd,isNegativeZero:bd,extend:wd};function ro(t,n){var e="",i=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(e+='in "'+t.mark.name+'" '),e+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!n&&t.mark.snippet&&(e+=`

`+t.mark.snippet),i+" "+e):i}function ri(t,n){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=n,this.message=ro(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}ri.prototype=Object.create(Error.prototype);ri.prototype.constructor=ri;ri.prototype.toString=function(n){return this.name+": "+ro(this,n)};var X=ri;function mr(t,n,e,i,r){var a="",s="",d=Math.floor(r/2)-1;return i-n>d&&(a=" ... ",n=i-d+a.length),e-i>d&&(s=" ...",e=i+d-s.length),{str:a+t.slice(n,e).replace(/\t/g,"\u2192")+s,pos:i-n+a.length}}function _r(t,n){return O.repeat(" ",n-t.length)+t}function xd(t,n){if(n=Object.create(n||null),!t.buffer)return null;n.maxLength||(n.maxLength=79),typeof n.indent!="number"&&(n.indent=1),typeof n.linesBefore!="number"&&(n.linesBefore=3),typeof n.linesAfter!="number"&&(n.linesAfter=2);for(var e=/\r?\n|\r|\0/g,i=[0],r=[],a,s=-1;a=e.exec(t.buffer);)r.push(a.index),i.push(a.index+a[0].length),t.position<=a.index&&s<0&&(s=i.length-2);s<0&&(s=i.length-1);var d="",u,h,p=Math.min(t.line+n.linesAfter,r.length).toString().length,_=n.maxLength-(n.indent+p+3);for(u=1;u<=n.linesBefore&&!(s-u<0);u++)h=mr(t.buffer,i[s-u],r[s-u],t.position-(i[s]-i[s-u]),_),d=O.repeat(" ",n.indent)+_r((t.line-u+1).toString(),p)+" | "+h.str+`
`+d;for(h=mr(t.buffer,i[s],r[s],t.position,_),d+=O.repeat(" ",n.indent)+_r((t.line+1).toString(),p)+" | "+h.str+`
`,d+=O.repeat("-",n.indent+p+3+h.pos)+`^
`,u=1;u<=n.linesAfter&&!(s+u>=r.length);u++)h=mr(t.buffer,i[s+u],r[s+u],t.position-(i[s]-i[s+u]),_),d+=O.repeat(" ",n.indent)+_r((t.line+u+1).toString(),p)+" | "+h.str+`
`;return d.replace(/\n$/,"")}var kd=xd,$d=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Sd=["scalar","sequence","mapping"];function Cd(t){var n={};return t!==null&&Object.keys(t).forEach(function(e){t[e].forEach(function(i){n[String(i)]=e})}),n}function Ed(t,n){if(n=n||{},Object.keys(n).forEach(function(e){if($d.indexOf(e)===-1)throw new X('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.options=n,this.tag=t,this.kind=n.kind||null,this.resolve=n.resolve||function(){return!0},this.construct=n.construct||function(e){return e},this.instanceOf=n.instanceOf||null,this.predicate=n.predicate||null,this.represent=n.represent||null,this.representName=n.representName||null,this.defaultStyle=n.defaultStyle||null,this.multi=n.multi||!1,this.styleAliases=Cd(n.styleAliases||null),Sd.indexOf(this.kind)===-1)throw new X('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var W=Ed;function qs(t,n){var e=[];return t[n].forEach(function(i){var r=e.length;e.forEach(function(a,s){a.tag===i.tag&&a.kind===i.kind&&a.multi===i.multi&&(r=s)}),e[r]=i}),e}function Ad(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},n,e;function i(r){r.multi?(t.multi[r.kind].push(r),t.multi.fallback.push(r)):t[r.kind][r.tag]=t.fallback[r.tag]=r}for(n=0,e=arguments.length;n<e;n+=1)arguments[n].forEach(i);return t}function fr(t){return this.extend(t)}fr.prototype.extend=function(n){var e=[],i=[];if(n instanceof W)i.push(n);else if(Array.isArray(n))i=i.concat(n);else if(n&&(Array.isArray(n.implicit)||Array.isArray(n.explicit)))n.implicit&&(e=e.concat(n.implicit)),n.explicit&&(i=i.concat(n.explicit));else throw new X("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.forEach(function(a){if(!(a instanceof W))throw new X("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(a.loadKind&&a.loadKind!=="scalar")throw new X("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(a.multi)throw new X("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),i.forEach(function(a){if(!(a instanceof W))throw new X("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var r=Object.create(fr.prototype);return r.implicit=(this.implicit||[]).concat(e),r.explicit=(this.explicit||[]).concat(i),r.compiledImplicit=qs(r,"implicit"),r.compiledExplicit=qs(r,"explicit"),r.compiledTypeMap=Ad(r.compiledImplicit,r.compiledExplicit),r};var Ld=fr,Td=new W("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),Pd=new W("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),Dd=new W("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),Rd=new Ld({explicit:[Td,Pd,Dd]});function Id(t){if(t===null)return!0;var n=t.length;return n===1&&t==="~"||n===4&&(t==="null"||t==="Null"||t==="NULL")}function Hd(){return null}function Nd(t){return t===null}var zd=new W("tag:yaml.org,2002:null",{kind:"scalar",resolve:Id,construct:Hd,predicate:Nd,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function Od(t){if(t===null)return!1;var n=t.length;return n===4&&(t==="true"||t==="True"||t==="TRUE")||n===5&&(t==="false"||t==="False"||t==="FALSE")}function Md(t){return t==="true"||t==="True"||t==="TRUE"}function Fd(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var jd=new W("tag:yaml.org,2002:bool",{kind:"scalar",resolve:Od,construct:Md,predicate:Fd,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function qd(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function Ud(t){return 48<=t&&t<=55}function Wd(t){return 48<=t&&t<=57}function Bd(t){if(t===null)return!1;var n=t.length,e=0,i=!1,r;if(!n)return!1;if(r=t[e],(r==="-"||r==="+")&&(r=t[++e]),r==="0"){if(e+1===n)return!0;if(r=t[++e],r==="b"){for(e++;e<n;e++)if(r=t[e],r!=="_"){if(r!=="0"&&r!=="1")return!1;i=!0}return i&&r!=="_"}if(r==="x"){for(e++;e<n;e++)if(r=t[e],r!=="_"){if(!qd(t.charCodeAt(e)))return!1;i=!0}return i&&r!=="_"}if(r==="o"){for(e++;e<n;e++)if(r=t[e],r!=="_"){if(!Ud(t.charCodeAt(e)))return!1;i=!0}return i&&r!=="_"}}if(r==="_")return!1;for(;e<n;e++)if(r=t[e],r!=="_"){if(!Wd(t.charCodeAt(e)))return!1;i=!0}return!(!i||r==="_")}function Vd(t){var n=t,e=1,i;if(n.indexOf("_")!==-1&&(n=n.replace(/_/g,"")),i=n[0],(i==="-"||i==="+")&&(i==="-"&&(e=-1),n=n.slice(1),i=n[0]),n==="0")return 0;if(i==="0"){if(n[1]==="b")return e*parseInt(n.slice(2),2);if(n[1]==="x")return e*parseInt(n.slice(2),16);if(n[1]==="o")return e*parseInt(n.slice(2),8)}return e*parseInt(n,10)}function Gd(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!O.isNegativeZero(t)}var Kd=new W("tag:yaml.org,2002:int",{kind:"scalar",resolve:Bd,construct:Vd,predicate:Gd,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Yd=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Qd(t){return!(t===null||!Yd.test(t)||t[t.length-1]==="_")}function Jd(t){var n,e;return n=t.replace(/_/g,"").toLowerCase(),e=n[0]==="-"?-1:1,"+-".indexOf(n[0])>=0&&(n=n.slice(1)),n===".inf"?e===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:n===".nan"?NaN:e*parseFloat(n,10)}var Zd=/^[-+]?[0-9]+e/;function Xd(t,n){var e;if(isNaN(t))switch(n){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(n){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(n){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(O.isNegativeZero(t))return"-0.0";return e=t.toString(10),Zd.test(e)?e.replace("e",".e"):e}function ec(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||O.isNegativeZero(t))}var tc=new W("tag:yaml.org,2002:float",{kind:"scalar",resolve:Qd,construct:Jd,predicate:ec,represent:Xd,defaultStyle:"lowercase"}),ic=Rd.extend({implicit:[zd,jd,Kd,tc]}),nc=ic,ao=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),so=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function rc(t){return t===null?!1:ao.exec(t)!==null||so.exec(t)!==null}function ac(t){var n,e,i,r,a,s,d,u=0,h=null,p,_,f;if(n=ao.exec(t),n===null&&(n=so.exec(t)),n===null)throw new Error("Date resolve error");if(e=+n[1],i=+n[2]-1,r=+n[3],!n[4])return new Date(Date.UTC(e,i,r));if(a=+n[4],s=+n[5],d=+n[6],n[7]){for(u=n[7].slice(0,3);u.length<3;)u+="0";u=+u}return n[9]&&(p=+n[10],_=+(n[11]||0),h=(p*60+_)*6e4,n[9]==="-"&&(h=-h)),f=new Date(Date.UTC(e,i,r,a,s,d,u)),h&&f.setTime(f.getTime()-h),f}function sc(t){return t.toISOString()}var oc=new W("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:rc,construct:ac,instanceOf:Date,represent:sc});function lc(t){return t==="<<"||t===null}var dc=new W("tag:yaml.org,2002:merge",{kind:"scalar",resolve:lc}),xr=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function cc(t){if(t===null)return!1;var n,e,i=0,r=t.length,a=xr;for(e=0;e<r;e++)if(n=a.indexOf(t.charAt(e)),!(n>64)){if(n<0)return!1;i+=6}return i%8===0}function uc(t){var n,e,i=t.replace(/[\r\n=]/g,""),r=i.length,a=xr,s=0,d=[];for(n=0;n<r;n++)n%4===0&&n&&(d.push(s>>16&255),d.push(s>>8&255),d.push(s&255)),s=s<<6|a.indexOf(i.charAt(n));return e=r%4*6,e===0?(d.push(s>>16&255),d.push(s>>8&255),d.push(s&255)):e===18?(d.push(s>>10&255),d.push(s>>2&255)):e===12&&d.push(s>>4&255),new Uint8Array(d)}function hc(t){var n="",e=0,i,r,a=t.length,s=xr;for(i=0;i<a;i++)i%3===0&&i&&(n+=s[e>>18&63],n+=s[e>>12&63],n+=s[e>>6&63],n+=s[e&63]),e=(e<<8)+t[i];return r=a%3,r===0?(n+=s[e>>18&63],n+=s[e>>12&63],n+=s[e>>6&63],n+=s[e&63]):r===2?(n+=s[e>>10&63],n+=s[e>>4&63],n+=s[e<<2&63],n+=s[64]):r===1&&(n+=s[e>>2&63],n+=s[e<<4&63],n+=s[64],n+=s[64]),n}function pc(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var mc=new W("tag:yaml.org,2002:binary",{kind:"scalar",resolve:cc,construct:uc,predicate:pc,represent:hc}),_c=Object.prototype.hasOwnProperty,gc=Object.prototype.toString;function fc(t){if(t===null)return!0;var n=[],e,i,r,a,s,d=t;for(e=0,i=d.length;e<i;e+=1){if(r=d[e],s=!1,gc.call(r)!=="[object Object]")return!1;for(a in r)if(_c.call(r,a))if(!s)s=!0;else return!1;if(!s)return!1;if(n.indexOf(a)===-1)n.push(a);else return!1}return!0}function vc(t){return t!==null?t:[]}var yc=new W("tag:yaml.org,2002:omap",{kind:"sequence",resolve:fc,construct:vc}),bc=Object.prototype.toString;function wc(t){if(t===null)return!0;var n,e,i,r,a,s=t;for(a=new Array(s.length),n=0,e=s.length;n<e;n+=1){if(i=s[n],bc.call(i)!=="[object Object]"||(r=Object.keys(i),r.length!==1))return!1;a[n]=[r[0],i[r[0]]]}return!0}function xc(t){if(t===null)return[];var n,e,i,r,a,s=t;for(a=new Array(s.length),n=0,e=s.length;n<e;n+=1)i=s[n],r=Object.keys(i),a[n]=[r[0],i[r[0]]];return a}var kc=new W("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:wc,construct:xc}),$c=Object.prototype.hasOwnProperty;function Sc(t){if(t===null)return!0;var n,e=t;for(n in e)if($c.call(e,n)&&e[n]!==null)return!1;return!0}function Cc(t){return t!==null?t:{}}var Ec=new W("tag:yaml.org,2002:set",{kind:"mapping",resolve:Sc,construct:Cc}),oo=nc.extend({implicit:[oc,dc],explicit:[mc,yc,kc,Ec]}),Fe=Object.prototype.hasOwnProperty,un=1,lo=2,co=3,hn=4,gr=1,Ac=2,Us=3,Lc=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Tc=/[\x85\u2028\u2029]/,Pc=/[,\[\]\{\}]/,uo=/^(?:!|!!|![a-z\-]+!)$/i,ho=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Ws(t){return Object.prototype.toString.call(t)}function ge(t){return t===10||t===13}function ot(t){return t===9||t===32}function ee(t){return t===9||t===32||t===10||t===13}function Pt(t){return t===44||t===91||t===93||t===123||t===125}function Dc(t){var n;return 48<=t&&t<=57?t-48:(n=t|32,97<=n&&n<=102?n-97+10:-1)}function Rc(t){return t===120?2:t===117?4:t===85?8:0}function Ic(t){return 48<=t&&t<=57?t-48:-1}function Bs(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"\x85":t===95?"\xA0":t===76?"\u2028":t===80?"\u2029":""}function Hc(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function po(t,n,e){n==="__proto__"?Object.defineProperty(t,n,{configurable:!0,enumerable:!0,writable:!0,value:e}):t[n]=e}var mo=new Array(256),_o=new Array(256);for(st=0;st<256;st++)mo[st]=Bs(st)?1:0,_o[st]=Bs(st);var st;function Nc(t,n){this.input=t,this.filename=n.filename||null,this.schema=n.schema||oo,this.onWarning=n.onWarning||null,this.legacy=n.legacy||!1,this.json=n.json||!1,this.listener=n.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function go(t,n){var e={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return e.snippet=kd(e),new X(n,e)}function $(t,n){throw go(t,n)}function pn(t,n){t.onWarning&&t.onWarning.call(null,go(t,n))}var Vs={YAML:function(n,e,i){var r,a,s;n.version!==null&&$(n,"duplication of %YAML directive"),i.length!==1&&$(n,"YAML directive accepts exactly one argument"),r=/^([0-9]+)\.([0-9]+)$/.exec(i[0]),r===null&&$(n,"ill-formed argument of the YAML directive"),a=parseInt(r[1],10),s=parseInt(r[2],10),a!==1&&$(n,"unacceptable YAML version of the document"),n.version=i[0],n.checkLineBreaks=s<2,s!==1&&s!==2&&pn(n,"unsupported YAML version of the document")},TAG:function(n,e,i){var r,a;i.length!==2&&$(n,"TAG directive accepts exactly two arguments"),r=i[0],a=i[1],uo.test(r)||$(n,"ill-formed tag handle (first argument) of the TAG directive"),Fe.call(n.tagMap,r)&&$(n,'there is a previously declared suffix for "'+r+'" tag handle'),ho.test(a)||$(n,"ill-formed tag prefix (second argument) of the TAG directive");try{a=decodeURIComponent(a)}catch{$(n,"tag prefix is malformed: "+a)}n.tagMap[r]=a}};function Me(t,n,e,i){var r,a,s,d;if(n<e){if(d=t.input.slice(n,e),i)for(r=0,a=d.length;r<a;r+=1)s=d.charCodeAt(r),s===9||32<=s&&s<=1114111||$(t,"expected valid JSON character");else Lc.test(d)&&$(t,"the stream contains non-printable characters");t.result+=d}}function Gs(t,n,e,i){var r,a,s,d;for(O.isObject(e)||$(t,"cannot merge mappings; the provided source object is unacceptable"),r=Object.keys(e),s=0,d=r.length;s<d;s+=1)a=r[s],Fe.call(n,a)||(po(n,a,e[a]),i[a]=!0)}function Dt(t,n,e,i,r,a,s,d,u){var h,p;if(Array.isArray(r))for(r=Array.prototype.slice.call(r),h=0,p=r.length;h<p;h+=1)Array.isArray(r[h])&&$(t,"nested arrays are not supported inside keys"),typeof r=="object"&&Ws(r[h])==="[object Object]"&&(r[h]="[object Object]");if(typeof r=="object"&&Ws(r)==="[object Object]"&&(r="[object Object]"),r=String(r),n===null&&(n={}),i==="tag:yaml.org,2002:merge")if(Array.isArray(a))for(h=0,p=a.length;h<p;h+=1)Gs(t,n,a[h],e);else Gs(t,n,a,e);else!t.json&&!Fe.call(e,r)&&Fe.call(n,r)&&(t.line=s||t.line,t.lineStart=d||t.lineStart,t.position=u||t.position,$(t,"duplicated mapping key")),po(n,r,a),delete e[r];return n}function kr(t){var n;n=t.input.charCodeAt(t.position),n===10?t.position++:n===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):$(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function z(t,n,e){for(var i=0,r=t.input.charCodeAt(t.position);r!==0;){for(;ot(r);)r===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),r=t.input.charCodeAt(++t.position);if(n&&r===35)do r=t.input.charCodeAt(++t.position);while(r!==10&&r!==13&&r!==0);if(ge(r))for(kr(t),r=t.input.charCodeAt(t.position),i++,t.lineIndent=0;r===32;)t.lineIndent++,r=t.input.charCodeAt(++t.position);else break}return e!==-1&&i!==0&&t.lineIndent<e&&pn(t,"deficient indentation"),i}function gn(t){var n=t.position,e;return e=t.input.charCodeAt(n),!!((e===45||e===46)&&e===t.input.charCodeAt(n+1)&&e===t.input.charCodeAt(n+2)&&(n+=3,e=t.input.charCodeAt(n),e===0||ee(e)))}function $r(t,n){n===1?t.result+=" ":n>1&&(t.result+=O.repeat(`
`,n-1))}function zc(t,n,e){var i,r,a,s,d,u,h,p,_=t.kind,f=t.result,v;if(v=t.input.charCodeAt(t.position),ee(v)||Pt(v)||v===35||v===38||v===42||v===33||v===124||v===62||v===39||v===34||v===37||v===64||v===96||(v===63||v===45)&&(r=t.input.charCodeAt(t.position+1),ee(r)||e&&Pt(r)))return!1;for(t.kind="scalar",t.result="",a=s=t.position,d=!1;v!==0;){if(v===58){if(r=t.input.charCodeAt(t.position+1),ee(r)||e&&Pt(r))break}else if(v===35){if(i=t.input.charCodeAt(t.position-1),ee(i))break}else{if(t.position===t.lineStart&&gn(t)||e&&Pt(v))break;if(ge(v))if(u=t.line,h=t.lineStart,p=t.lineIndent,z(t,!1,-1),t.lineIndent>=n){d=!0,v=t.input.charCodeAt(t.position);continue}else{t.position=s,t.line=u,t.lineStart=h,t.lineIndent=p;break}}d&&(Me(t,a,s,!1),$r(t,t.line-u),a=s=t.position,d=!1),ot(v)||(s=t.position+1),v=t.input.charCodeAt(++t.position)}return Me(t,a,s,!1),t.result?!0:(t.kind=_,t.result=f,!1)}function Oc(t,n){var e,i,r;if(e=t.input.charCodeAt(t.position),e!==39)return!1;for(t.kind="scalar",t.result="",t.position++,i=r=t.position;(e=t.input.charCodeAt(t.position))!==0;)if(e===39)if(Me(t,i,t.position,!0),e=t.input.charCodeAt(++t.position),e===39)i=t.position,t.position++,r=t.position;else return!0;else ge(e)?(Me(t,i,r,!0),$r(t,z(t,!1,n)),i=r=t.position):t.position===t.lineStart&&gn(t)?$(t,"unexpected end of the document within a single quoted scalar"):(t.position++,r=t.position);$(t,"unexpected end of the stream within a single quoted scalar")}function Mc(t,n){var e,i,r,a,s,d;if(d=t.input.charCodeAt(t.position),d!==34)return!1;for(t.kind="scalar",t.result="",t.position++,e=i=t.position;(d=t.input.charCodeAt(t.position))!==0;){if(d===34)return Me(t,e,t.position,!0),t.position++,!0;if(d===92){if(Me(t,e,t.position,!0),d=t.input.charCodeAt(++t.position),ge(d))z(t,!1,n);else if(d<256&&mo[d])t.result+=_o[d],t.position++;else if((s=Rc(d))>0){for(r=s,a=0;r>0;r--)d=t.input.charCodeAt(++t.position),(s=Dc(d))>=0?a=(a<<4)+s:$(t,"expected hexadecimal character");t.result+=Hc(a),t.position++}else $(t,"unknown escape sequence");e=i=t.position}else ge(d)?(Me(t,e,i,!0),$r(t,z(t,!1,n)),e=i=t.position):t.position===t.lineStart&&gn(t)?$(t,"unexpected end of the document within a double quoted scalar"):(t.position++,i=t.position)}$(t,"unexpected end of the stream within a double quoted scalar")}function Fc(t,n){var e=!0,i,r,a,s=t.tag,d,u=t.anchor,h,p,_,f,v,x=Object.create(null),S,D,J,T;if(T=t.input.charCodeAt(t.position),T===91)p=93,v=!1,d=[];else if(T===123)p=125,v=!0,d={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=d),T=t.input.charCodeAt(++t.position);T!==0;){if(z(t,!0,n),T=t.input.charCodeAt(t.position),T===p)return t.position++,t.tag=s,t.anchor=u,t.kind=v?"mapping":"sequence",t.result=d,!0;e?T===44&&$(t,"expected the node content, but found ','"):$(t,"missed comma between flow collection entries"),D=S=J=null,_=f=!1,T===63&&(h=t.input.charCodeAt(t.position+1),ee(h)&&(_=f=!0,t.position++,z(t,!0,n))),i=t.line,r=t.lineStart,a=t.position,Rt(t,n,un,!1,!0),D=t.tag,S=t.result,z(t,!0,n),T=t.input.charCodeAt(t.position),(f||t.line===i)&&T===58&&(_=!0,T=t.input.charCodeAt(++t.position),z(t,!0,n),Rt(t,n,un,!1,!0),J=t.result),v?Dt(t,d,x,D,S,J,i,r,a):_?d.push(Dt(t,null,x,D,S,J,i,r,a)):d.push(S),z(t,!0,n),T=t.input.charCodeAt(t.position),T===44?(e=!0,T=t.input.charCodeAt(++t.position)):e=!1}$(t,"unexpected end of the stream within a flow collection")}function jc(t,n){var e,i,r=gr,a=!1,s=!1,d=n,u=0,h=!1,p,_;if(_=t.input.charCodeAt(t.position),_===124)i=!1;else if(_===62)i=!0;else return!1;for(t.kind="scalar",t.result="";_!==0;)if(_=t.input.charCodeAt(++t.position),_===43||_===45)gr===r?r=_===43?Us:Ac:$(t,"repeat of a chomping mode identifier");else if((p=Ic(_))>=0)p===0?$(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):s?$(t,"repeat of an indentation width identifier"):(d=n+p-1,s=!0);else break;if(ot(_)){do _=t.input.charCodeAt(++t.position);while(ot(_));if(_===35)do _=t.input.charCodeAt(++t.position);while(!ge(_)&&_!==0)}for(;_!==0;){for(kr(t),t.lineIndent=0,_=t.input.charCodeAt(t.position);(!s||t.lineIndent<d)&&_===32;)t.lineIndent++,_=t.input.charCodeAt(++t.position);if(!s&&t.lineIndent>d&&(d=t.lineIndent),ge(_)){u++;continue}if(t.lineIndent<d){r===Us?t.result+=O.repeat(`
`,a?1+u:u):r===gr&&a&&(t.result+=`
`);break}for(i?ot(_)?(h=!0,t.result+=O.repeat(`
`,a?1+u:u)):h?(h=!1,t.result+=O.repeat(`
`,u+1)):u===0?a&&(t.result+=" "):t.result+=O.repeat(`
`,u):t.result+=O.repeat(`
`,a?1+u:u),a=!0,s=!0,u=0,e=t.position;!ge(_)&&_!==0;)_=t.input.charCodeAt(++t.position);Me(t,e,t.position,!1)}return!0}function Ks(t,n){var e,i=t.tag,r=t.anchor,a=[],s,d=!1,u;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=a),u=t.input.charCodeAt(t.position);u!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,$(t,"tab characters must not be used in indentation")),!(u!==45||(s=t.input.charCodeAt(t.position+1),!ee(s))));){if(d=!0,t.position++,z(t,!0,-1)&&t.lineIndent<=n){a.push(null),u=t.input.charCodeAt(t.position);continue}if(e=t.line,Rt(t,n,co,!1,!0),a.push(t.result),z(t,!0,-1),u=t.input.charCodeAt(t.position),(t.line===e||t.lineIndent>n)&&u!==0)$(t,"bad indentation of a sequence entry");else if(t.lineIndent<n)break}return d?(t.tag=i,t.anchor=r,t.kind="sequence",t.result=a,!0):!1}function qc(t,n,e){var i,r,a,s,d,u,h=t.tag,p=t.anchor,_={},f=Object.create(null),v=null,x=null,S=null,D=!1,J=!1,T;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=_),T=t.input.charCodeAt(t.position);T!==0;){if(!D&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,$(t,"tab characters must not be used in indentation")),i=t.input.charCodeAt(t.position+1),a=t.line,(T===63||T===58)&&ee(i))T===63?(D&&(Dt(t,_,f,v,x,null,s,d,u),v=x=S=null),J=!0,D=!0,r=!0):D?(D=!1,r=!0):$(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,T=i;else{if(s=t.line,d=t.lineStart,u=t.position,!Rt(t,e,lo,!1,!0))break;if(t.line===a){for(T=t.input.charCodeAt(t.position);ot(T);)T=t.input.charCodeAt(++t.position);if(T===58)T=t.input.charCodeAt(++t.position),ee(T)||$(t,"a whitespace character is expected after the key-value separator within a block mapping"),D&&(Dt(t,_,f,v,x,null,s,d,u),v=x=S=null),J=!0,D=!1,r=!1,v=t.tag,x=t.result;else if(J)$(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=h,t.anchor=p,!0}else if(J)$(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=h,t.anchor=p,!0}if((t.line===a||t.lineIndent>n)&&(D&&(s=t.line,d=t.lineStart,u=t.position),Rt(t,n,hn,!0,r)&&(D?x=t.result:S=t.result),D||(Dt(t,_,f,v,x,S,s,d,u),v=x=S=null),z(t,!0,-1),T=t.input.charCodeAt(t.position)),(t.line===a||t.lineIndent>n)&&T!==0)$(t,"bad indentation of a mapping entry");else if(t.lineIndent<n)break}return D&&Dt(t,_,f,v,x,null,s,d,u),J&&(t.tag=h,t.anchor=p,t.kind="mapping",t.result=_),J}function Uc(t){var n,e=!1,i=!1,r,a,s;if(s=t.input.charCodeAt(t.position),s!==33)return!1;if(t.tag!==null&&$(t,"duplication of a tag property"),s=t.input.charCodeAt(++t.position),s===60?(e=!0,s=t.input.charCodeAt(++t.position)):s===33?(i=!0,r="!!",s=t.input.charCodeAt(++t.position)):r="!",n=t.position,e){do s=t.input.charCodeAt(++t.position);while(s!==0&&s!==62);t.position<t.length?(a=t.input.slice(n,t.position),s=t.input.charCodeAt(++t.position)):$(t,"unexpected end of the stream within a verbatim tag")}else{for(;s!==0&&!ee(s);)s===33&&(i?$(t,"tag suffix cannot contain exclamation marks"):(r=t.input.slice(n-1,t.position+1),uo.test(r)||$(t,"named tag handle cannot contain such characters"),i=!0,n=t.position+1)),s=t.input.charCodeAt(++t.position);a=t.input.slice(n,t.position),Pc.test(a)&&$(t,"tag suffix cannot contain flow indicator characters")}a&&!ho.test(a)&&$(t,"tag name cannot contain such characters: "+a);try{a=decodeURIComponent(a)}catch{$(t,"tag name is malformed: "+a)}return e?t.tag=a:Fe.call(t.tagMap,r)?t.tag=t.tagMap[r]+a:r==="!"?t.tag="!"+a:r==="!!"?t.tag="tag:yaml.org,2002:"+a:$(t,'undeclared tag handle "'+r+'"'),!0}function Wc(t){var n,e;if(e=t.input.charCodeAt(t.position),e!==38)return!1;for(t.anchor!==null&&$(t,"duplication of an anchor property"),e=t.input.charCodeAt(++t.position),n=t.position;e!==0&&!ee(e)&&!Pt(e);)e=t.input.charCodeAt(++t.position);return t.position===n&&$(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(n,t.position),!0}function Bc(t){var n,e,i;if(i=t.input.charCodeAt(t.position),i!==42)return!1;for(i=t.input.charCodeAt(++t.position),n=t.position;i!==0&&!ee(i)&&!Pt(i);)i=t.input.charCodeAt(++t.position);return t.position===n&&$(t,"name of an alias node must contain at least one character"),e=t.input.slice(n,t.position),Fe.call(t.anchorMap,e)||$(t,'unidentified alias "'+e+'"'),t.result=t.anchorMap[e],z(t,!0,-1),!0}function Rt(t,n,e,i,r){var a,s,d,u=1,h=!1,p=!1,_,f,v,x,S,D;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,a=s=d=hn===e||co===e,i&&z(t,!0,-1)&&(h=!0,t.lineIndent>n?u=1:t.lineIndent===n?u=0:t.lineIndent<n&&(u=-1)),u===1)for(;Uc(t)||Wc(t);)z(t,!0,-1)?(h=!0,d=a,t.lineIndent>n?u=1:t.lineIndent===n?u=0:t.lineIndent<n&&(u=-1)):d=!1;if(d&&(d=h||r),(u===1||hn===e)&&(un===e||lo===e?S=n:S=n+1,D=t.position-t.lineStart,u===1?d&&(Ks(t,D)||qc(t,D,S))||Fc(t,S)?p=!0:(s&&jc(t,S)||Oc(t,S)||Mc(t,S)?p=!0:Bc(t)?(p=!0,(t.tag!==null||t.anchor!==null)&&$(t,"alias node should not have any properties")):zc(t,S,un===e)&&(p=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):u===0&&(p=d&&Ks(t,D))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&$(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),_=0,f=t.implicitTypes.length;_<f;_+=1)if(x=t.implicitTypes[_],x.resolve(t.result)){t.result=x.construct(t.result),t.tag=x.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(Fe.call(t.typeMap[t.kind||"fallback"],t.tag))x=t.typeMap[t.kind||"fallback"][t.tag];else for(x=null,v=t.typeMap.multi[t.kind||"fallback"],_=0,f=v.length;_<f;_+=1)if(t.tag.slice(0,v[_].tag.length)===v[_].tag){x=v[_];break}x||$(t,"unknown tag !<"+t.tag+">"),t.result!==null&&x.kind!==t.kind&&$(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+x.kind+'", not "'+t.kind+'"'),x.resolve(t.result,t.tag)?(t.result=x.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):$(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||p}function Vc(t){var n=t.position,e,i,r,a=!1,s;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(s=t.input.charCodeAt(t.position))!==0&&(z(t,!0,-1),s=t.input.charCodeAt(t.position),!(t.lineIndent>0||s!==37));){for(a=!0,s=t.input.charCodeAt(++t.position),e=t.position;s!==0&&!ee(s);)s=t.input.charCodeAt(++t.position);for(i=t.input.slice(e,t.position),r=[],i.length<1&&$(t,"directive name must not be less than one character in length");s!==0;){for(;ot(s);)s=t.input.charCodeAt(++t.position);if(s===35){do s=t.input.charCodeAt(++t.position);while(s!==0&&!ge(s));break}if(ge(s))break;for(e=t.position;s!==0&&!ee(s);)s=t.input.charCodeAt(++t.position);r.push(t.input.slice(e,t.position))}s!==0&&kr(t),Fe.call(Vs,i)?Vs[i](t,i,r):pn(t,'unknown document directive "'+i+'"')}if(z(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,z(t,!0,-1)):a&&$(t,"directives end mark is expected"),Rt(t,t.lineIndent-1,hn,!1,!0),z(t,!0,-1),t.checkLineBreaks&&Tc.test(t.input.slice(n,t.position))&&pn(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&gn(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,z(t,!0,-1));return}if(t.position<t.length-1)$(t,"end of the stream or a document separator is expected");else return}function fo(t,n){t=String(t),n=n||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var e=new Nc(t,n),i=t.indexOf("\0");for(i!==-1&&(e.position=i,$(e,"null byte is not allowed in input")),e.input+="\0";e.input.charCodeAt(e.position)===32;)e.lineIndent+=1,e.position+=1;for(;e.position<e.length-1;)Vc(e);return e.documents}function Gc(t,n,e){n!==null&&typeof n=="object"&&typeof e>"u"&&(e=n,n=null);var i=fo(t,e);if(typeof n!="function")return i;for(var r=0,a=i.length;r<a;r+=1)n(i[r])}function Kc(t,n){var e=fo(t,n);if(e.length!==0){if(e.length===1)return e[0];throw new X("expected a single document in the stream, but found more")}}var Yc=Gc,Qc=Kc,vo={loadAll:Yc,load:Qc},yo=Object.prototype.toString,bo=Object.prototype.hasOwnProperty,Sr=65279,Jc=9,ai=10,Zc=13,Xc=32,eu=33,tu=34,vr=35,iu=37,nu=38,ru=39,au=42,wo=44,su=45,mn=58,ou=61,lu=62,du=63,cu=64,xo=91,ko=93,uu=96,$o=123,hu=124,So=125,B={};B[0]="\\0";B[7]="\\a";B[8]="\\b";B[9]="\\t";B[10]="\\n";B[11]="\\v";B[12]="\\f";B[13]="\\r";B[27]="\\e";B[34]='\\"';B[92]="\\\\";B[133]="\\N";B[160]="\\_";B[8232]="\\L";B[8233]="\\P";var pu=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],mu=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function _u(t,n){var e,i,r,a,s,d,u;if(n===null)return{};for(e={},i=Object.keys(n),r=0,a=i.length;r<a;r+=1)s=i[r],d=String(n[s]),s.slice(0,2)==="!!"&&(s="tag:yaml.org,2002:"+s.slice(2)),u=t.compiledTypeMap.fallback[s],u&&bo.call(u.styleAliases,d)&&(d=u.styleAliases[d]),e[s]=d;return e}function gu(t){var n,e,i;if(n=t.toString(16).toUpperCase(),t<=255)e="x",i=2;else if(t<=65535)e="u",i=4;else if(t<=4294967295)e="U",i=8;else throw new X("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+e+O.repeat("0",i-n.length)+n}var fu=1,si=2;function vu(t){this.schema=t.schema||oo,this.indent=Math.max(1,t.indent||2),this.noArrayIndent=t.noArrayIndent||!1,this.skipInvalid=t.skipInvalid||!1,this.flowLevel=O.isNothing(t.flowLevel)?-1:t.flowLevel,this.styleMap=_u(this.schema,t.styles||null),this.sortKeys=t.sortKeys||!1,this.lineWidth=t.lineWidth||80,this.noRefs=t.noRefs||!1,this.noCompatMode=t.noCompatMode||!1,this.condenseFlow=t.condenseFlow||!1,this.quotingType=t.quotingType==='"'?si:fu,this.forceQuotes=t.forceQuotes||!1,this.replacer=typeof t.replacer=="function"?t.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Ys(t,n){for(var e=O.repeat(" ",n),i=0,r=-1,a="",s,d=t.length;i<d;)r=t.indexOf(`
`,i),r===-1?(s=t.slice(i),i=d):(s=t.slice(i,r+1),i=r+1),s.length&&s!==`
`&&(a+=e),a+=s;return a}function yr(t,n){return`
`+O.repeat(" ",t.indent*n)}function yu(t,n){var e,i,r;for(e=0,i=t.implicitTypes.length;e<i;e+=1)if(r=t.implicitTypes[e],r.resolve(n))return!0;return!1}function _n(t){return t===Xc||t===Jc}function oi(t){return 32<=t&&t<=126||161<=t&&t<=55295&&t!==8232&&t!==8233||57344<=t&&t<=65533&&t!==Sr||65536<=t&&t<=1114111}function Qs(t){return oi(t)&&t!==Sr&&t!==Zc&&t!==ai}function Js(t,n,e){var i=Qs(t),r=i&&!_n(t);return(e?i:i&&t!==wo&&t!==xo&&t!==ko&&t!==$o&&t!==So)&&t!==vr&&!(n===mn&&!r)||Qs(n)&&!_n(n)&&t===vr||n===mn&&r}function bu(t){return oi(t)&&t!==Sr&&!_n(t)&&t!==su&&t!==du&&t!==mn&&t!==wo&&t!==xo&&t!==ko&&t!==$o&&t!==So&&t!==vr&&t!==nu&&t!==au&&t!==eu&&t!==hu&&t!==ou&&t!==lu&&t!==ru&&t!==tu&&t!==iu&&t!==cu&&t!==uu}function wu(t){return!_n(t)&&t!==mn}function ni(t,n){var e=t.charCodeAt(n),i;return e>=55296&&e<=56319&&n+1<t.length&&(i=t.charCodeAt(n+1),i>=56320&&i<=57343)?(e-55296)*1024+i-56320+65536:e}function Co(t){var n=/^\n* /;return n.test(t)}var Eo=1,br=2,Ao=3,Lo=4,Tt=5;function xu(t,n,e,i,r,a,s,d){var u,h=0,p=null,_=!1,f=!1,v=i!==-1,x=-1,S=bu(ni(t,0))&&wu(ni(t,t.length-1));if(n||s)for(u=0;u<t.length;h>=65536?u+=2:u++){if(h=ni(t,u),!oi(h))return Tt;S=S&&Js(h,p,d),p=h}else{for(u=0;u<t.length;h>=65536?u+=2:u++){if(h=ni(t,u),h===ai)_=!0,v&&(f=f||u-x-1>i&&t[x+1]!==" ",x=u);else if(!oi(h))return Tt;S=S&&Js(h,p,d),p=h}f=f||v&&u-x-1>i&&t[x+1]!==" "}return!_&&!f?S&&!s&&!r(t)?Eo:a===si?Tt:br:e>9&&Co(t)?Tt:s?a===si?Tt:br:f?Lo:Ao}function ku(t,n,e,i,r){t.dump=(function(){if(n.length===0)return t.quotingType===si?'""':"''";if(!t.noCompatMode&&(pu.indexOf(n)!==-1||mu.test(n)))return t.quotingType===si?'"'+n+'"':"'"+n+"'";var a=t.indent*Math.max(1,e),s=t.lineWidth===-1?-1:Math.max(Math.min(t.lineWidth,40),t.lineWidth-a),d=i||t.flowLevel>-1&&e>=t.flowLevel;function u(h){return yu(t,h)}switch(xu(n,d,t.indent,s,u,t.quotingType,t.forceQuotes&&!i,r)){case Eo:return n;case br:return"'"+n.replace(/'/g,"''")+"'";case Ao:return"|"+Zs(n,t.indent)+Xs(Ys(n,a));case Lo:return">"+Zs(n,t.indent)+Xs(Ys($u(n,s),a));case Tt:return'"'+Su(n)+'"';default:throw new X("impossible error: invalid scalar style")}})()}function Zs(t,n){var e=Co(t)?String(n):"",i=t[t.length-1]===`
`,r=i&&(t[t.length-2]===`
`||t===`
`),a=r?"+":i?"":"-";return e+a+`
`}function Xs(t){return t[t.length-1]===`
`?t.slice(0,-1):t}function $u(t,n){for(var e=/(\n+)([^\n]*)/g,i=(function(){var h=t.indexOf(`
`);return h=h!==-1?h:t.length,e.lastIndex=h,eo(t.slice(0,h),n)})(),r=t[0]===`
`||t[0]===" ",a,s;s=e.exec(t);){var d=s[1],u=s[2];a=u[0]===" ",i+=d+(!r&&!a&&u!==""?`
`:"")+eo(u,n),r=a}return i}function eo(t,n){if(t===""||t[0]===" ")return t;for(var e=/ [^ ]/g,i,r=0,a,s=0,d=0,u="";i=e.exec(t);)d=i.index,d-r>n&&(a=s>r?s:d,u+=`
`+t.slice(r,a),r=a+1),s=d;return u+=`
`,t.length-r>n&&s>r?u+=t.slice(r,s)+`
`+t.slice(s+1):u+=t.slice(r),u.slice(1)}function Su(t){for(var n="",e=0,i,r=0;r<t.length;e>=65536?r+=2:r++)e=ni(t,r),i=B[e],!i&&oi(e)?(n+=t[r],e>=65536&&(n+=t[r+1])):n+=i||gu(e);return n}function Cu(t,n,e){var i="",r=t.tag,a,s,d;for(a=0,s=e.length;a<s;a+=1)d=e[a],t.replacer&&(d=t.replacer.call(e,String(a),d)),(Le(t,n,d,!1,!1)||typeof d>"u"&&Le(t,n,null,!1,!1))&&(i!==""&&(i+=","+(t.condenseFlow?"":" ")),i+=t.dump);t.tag=r,t.dump="["+i+"]"}function to(t,n,e,i){var r="",a=t.tag,s,d,u;for(s=0,d=e.length;s<d;s+=1)u=e[s],t.replacer&&(u=t.replacer.call(e,String(s),u)),(Le(t,n+1,u,!0,!0,!1,!0)||typeof u>"u"&&Le(t,n+1,null,!0,!0,!1,!0))&&((!i||r!=="")&&(r+=yr(t,n)),t.dump&&ai===t.dump.charCodeAt(0)?r+="-":r+="- ",r+=t.dump);t.tag=a,t.dump=r||"[]"}function Eu(t,n,e){var i="",r=t.tag,a=Object.keys(e),s,d,u,h,p;for(s=0,d=a.length;s<d;s+=1)p="",i!==""&&(p+=", "),t.condenseFlow&&(p+='"'),u=a[s],h=e[u],t.replacer&&(h=t.replacer.call(e,u,h)),Le(t,n,u,!1,!1)&&(t.dump.length>1024&&(p+="? "),p+=t.dump+(t.condenseFlow?'"':"")+":"+(t.condenseFlow?"":" "),Le(t,n,h,!1,!1)&&(p+=t.dump,i+=p));t.tag=r,t.dump="{"+i+"}"}function Au(t,n,e,i){var r="",a=t.tag,s=Object.keys(e),d,u,h,p,_,f;if(t.sortKeys===!0)s.sort();else if(typeof t.sortKeys=="function")s.sort(t.sortKeys);else if(t.sortKeys)throw new X("sortKeys must be a boolean or a function");for(d=0,u=s.length;d<u;d+=1)f="",(!i||r!=="")&&(f+=yr(t,n)),h=s[d],p=e[h],t.replacer&&(p=t.replacer.call(e,h,p)),Le(t,n+1,h,!0,!0,!0)&&(_=t.tag!==null&&t.tag!=="?"||t.dump&&t.dump.length>1024,_&&(t.dump&&ai===t.dump.charCodeAt(0)?f+="?":f+="? "),f+=t.dump,_&&(f+=yr(t,n)),Le(t,n+1,p,!0,_)&&(t.dump&&ai===t.dump.charCodeAt(0)?f+=":":f+=": ",f+=t.dump,r+=f));t.tag=a,t.dump=r||"{}"}function io(t,n,e){var i,r,a,s,d,u;for(r=e?t.explicitTypes:t.implicitTypes,a=0,s=r.length;a<s;a+=1)if(d=r[a],(d.instanceOf||d.predicate)&&(!d.instanceOf||typeof n=="object"&&n instanceof d.instanceOf)&&(!d.predicate||d.predicate(n))){if(e?d.multi&&d.representName?t.tag=d.representName(n):t.tag=d.tag:t.tag="?",d.represent){if(u=t.styleMap[d.tag]||d.defaultStyle,yo.call(d.represent)==="[object Function]")i=d.represent(n,u);else if(bo.call(d.represent,u))i=d.represent[u](n,u);else throw new X("!<"+d.tag+'> tag resolver accepts not "'+u+'" style');t.dump=i}return!0}return!1}function Le(t,n,e,i,r,a,s){t.tag=null,t.dump=e,io(t,e,!1)||io(t,e,!0);var d=yo.call(t.dump),u=i,h;i&&(i=t.flowLevel<0||t.flowLevel>n);var p=d==="[object Object]"||d==="[object Array]",_,f;if(p&&(_=t.duplicates.indexOf(e),f=_!==-1),(t.tag!==null&&t.tag!=="?"||f||t.indent!==2&&n>0)&&(r=!1),f&&t.usedDuplicates[_])t.dump="*ref_"+_;else{if(p&&f&&!t.usedDuplicates[_]&&(t.usedDuplicates[_]=!0),d==="[object Object]")i&&Object.keys(t.dump).length!==0?(Au(t,n,t.dump,r),f&&(t.dump="&ref_"+_+t.dump)):(Eu(t,n,t.dump),f&&(t.dump="&ref_"+_+" "+t.dump));else if(d==="[object Array]")i&&t.dump.length!==0?(t.noArrayIndent&&!s&&n>0?to(t,n-1,t.dump,r):to(t,n,t.dump,r),f&&(t.dump="&ref_"+_+t.dump)):(Cu(t,n,t.dump),f&&(t.dump="&ref_"+_+" "+t.dump));else if(d==="[object String]")t.tag!=="?"&&ku(t,t.dump,n,a,u);else{if(d==="[object Undefined]")return!1;if(t.skipInvalid)return!1;throw new X("unacceptable kind of an object to dump "+d)}t.tag!==null&&t.tag!=="?"&&(h=encodeURI(t.tag[0]==="!"?t.tag.slice(1):t.tag).replace(/!/g,"%21"),t.tag[0]==="!"?h="!"+h:h.slice(0,18)==="tag:yaml.org,2002:"?h="!!"+h.slice(18):h="!<"+h+">",t.dump=h+" "+t.dump)}return!0}function Lu(t,n){var e=[],i=[],r,a;for(wr(t,e,i),r=0,a=i.length;r<a;r+=1)n.duplicates.push(e[i[r]]);n.usedDuplicates=new Array(a)}function wr(t,n,e){var i,r,a;if(t!==null&&typeof t=="object")if(r=n.indexOf(t),r!==-1)e.indexOf(r)===-1&&e.push(r);else if(n.push(t),Array.isArray(t))for(r=0,a=t.length;r<a;r+=1)wr(t[r],n,e);else for(i=Object.keys(t),r=0,a=i.length;r<a;r+=1)wr(t[i[r]],n,e)}function Tu(t,n){n=n||{};var e=new vu(n);e.noRefs||Lu(t,e);var i=t;return e.replacer&&(i=e.replacer.call({"":i},"",i)),Le(e,0,i,!0,!0)?e.dump+`
`:""}var Pu=Tu,Du={dump:Pu};function Cr(t,n){return function(){throw new Error("Function yaml."+t+" is removed in js-yaml 4. Use yaml."+n+" instead, which is now safe by default.")}}var fn=vo.load,eg=vo.loadAll,vn=Du.dump;var tg=Cr("safeLoad","load"),ig=Cr("safeLoadAll","loadAll"),ng=Cr("safeDump","dump");var Ru={light:"mdi:lightbulb",switch:"mdi:toggle-switch-variant",binary_sensor:"mdi:motion-sensor",sensor:"mdi:eye",person:"mdi:account",device_tracker:"mdi:account",climate:"mdi:thermostat",cover:"mdi:window-shutter",media_player:"mdi:cast",lock:"mdi:lock",fan:"mdi:fan",weather:"mdi:weather-partly-cloudy",input_boolean:"mdi:toggle-switch",event:"mdi:eye-check",script:"mdi:script-text",template:"mdi:code-braces"},Er="mdi:eye";function je(t,n){let e=t?.states?.[n]?.attributes?.friendly_name;return typeof e=="string"&&e?e:n}function Iu(t,n){let e=t?.states?.[n]?.attributes?.icon;if(typeof e=="string"&&e)return e;let i=n.split(".")[0];return Ru[i]??Er}function li(t,n){let e=t?.states?.[n];return e&&customElements.get("ha-state-icon")?l`<ha-state-icon class="row-icon" .hass=${t} .stateObj=${e}></ha-state-icon>`:l`<ha-icon class="row-icon" icon=${Iu(t,n)}></ha-icon>`}var To=y`
  .row-icon {
    flex: 0 0 auto;
    color: var(--secondary-text-color, #888);
    --mdc-icon-size: 22px;
  }
  .row-text {
    flex: 1;
    min-width: 0;
  }
  .row-title {
    color: var(--primary-text-color, #212121);
  }
  .row-detail {
    color: var(--secondary-text-color, #888);
    font-size: 0.8em;
    margin-top: 0.1rem;
    word-break: break-word;
  }
`;var fe=class extends b{constructor(){super(...arguments);this.value=null;this._mode="form";this._yamlText="";this._yamlError=null;this._computeFieldLabel=e=>dr(this.hass,this._picked??"",e.name);this._computeFieldHelper=e=>{let r=this._currentFields()?.[e.name]?.description;return typeof r=="string"?r:""}}willUpdate(e){super.willUpdate?.(e),e.has("value")&&this._mode==="form"&&(this._yamlText=vn(this.value??{}))}connectedCallback(){super.connectedCallback(),this._yamlText=vn(this.value??{})}_setMode(e){e==="form"&&this._yamlError!==null||(e==="yaml"&&(this._yamlText=vn(this.value??{})),this._mode=e)}_onYamlInput(e){this._yamlText=e;let i;try{i=fn(e)}catch(u){this._yamlError=u.message;return}if(i==null){this._yamlError=null,this._emit(null);return}if(typeof i!="object"||Array.isArray(i)){this._yamlError=o(this.hass,"ui.yaml_expect_object","Expected an object");return}let r=i,a=r.script;if(typeof a!="string"||!a.startsWith("script.")){this._yamlError=o(this.hass,"ui.yaml_script_string","`script` must be a 'script.<name>' string");return}let s=r.args;if(s!==void 0&&(typeof s!="object"||Array.isArray(s)||s===null)){this._yamlError=o(this.hass,"ui.yaml_args_object","`args` must be an object if present");return}let d=r.triggers;if(d!==void 0&&(!Array.isArray(d)||!d.every(u=>typeof u=="string"))){this._yamlError=o(this.hass,"ui.yaml_triggers_list","`triggers` must be a list of entity_id strings if present");return}this._yamlError=null,this._emit({script:a,args:s??{},triggers:d})}_emit(e){this.value=e,L(this,this.value)}_scriptIds(){let e=this.hass?.services;return Object.keys(e?.script??{}).sort().map(r=>`script.${r}`)}_label(e){return je(this.hass,e)}_fieldsFor(e){if(!e)return;let i=e.replace(/^script\./,"");return this.hass?.services?.script?.[i]?.fields}get _picked(){return this.value&&typeof this.value=="object"?this.value.script:null}_currentFields(){return this._fieldsFor(this._picked)}_defaultArgs(e){let i=this._fieldsFor(e)??{},r={};for(let[a,s]of Object.entries(i))s&&Object.hasOwn(s,"default")&&(r[a]=s.default);return r}_pickerSchema(){return[{name:"script",selector:{select:{mode:"dropdown",options:this._scriptIds().map(e=>({value:e,label:this._label(e)}))}}}]}_pickScript(e){if(!e){this._emit(null);return}this._emit({script:e,args:this._defaultArgs(e)})}_argsSchema(){let e=this._currentFields();return e?Object.entries(e).map(([i,r])=>({name:i,required:r.required,selector:r.selector??{text:{}}})):[]}_updateArgs(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:e,triggers:this.value.triggers})}get _triggers(){return this.value&&typeof this.value=="object"&&this.value.triggers||[]}_setTriggers(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:this.value.args,triggers:e})}_removeTrigger(e){this._setTriggers(this._triggers.filter(i=>i!==e))}_addTrigger(e){this._triggers.includes(e)||this._setTriggers([...this._triggers,e])}render(){let e=this._picked,i=this._argsSchema(),r=(this.value&&typeof this.value=="object"?this.value.args:{})??{},a=i.length>0;return l`
      <div class="section">
        <h4>${o(this.hass,"ui.script","Script")}</h4>
        ${this._renderPicker(e)}
      </div>
      ${e?l`
        <div class="tabs">
          <button
            type="button"
            ?disabled=${this._yamlError!==null}
            title=${this._yamlError??""}
            class=${this._mode==="form"?"active":""}
            @click=${()=>this._setMode("form")}
          >${o(this.hass,"ui.form","Form")}</button>
          <button
            type="button"
            class=${this._mode==="yaml"?"active":""}
            @click=${()=>this._setMode("yaml")}
          >${o(this.hass,"ui.yaml","YAML")}</button>
        </div>
      `:""}
      ${e&&this._mode==="form"&&a?l`
        <div class="section args">
          <h4>${o(this.hass,"ui.arguments","Arguments")}</h4>
          ${this._renderArgs(i,r)}
        </div>
      `:""}
      ${e&&this._mode==="form"?this._renderTriggers():""}
      ${e&&this._mode==="yaml"?this._renderYaml():""}
    `}_renderTriggers(){let e=this._triggers;return l`
      <div class="section triggers">
        <h4>${o(this.hass,"ui.script_triggers","Triggers")}</h4>
        <p class="help">
          ${o(this.hass,"ui.script_triggers_help","Re-evaluate this scene when these entities change. A script is opaque, so templated references may be missed \u2014 add any it depends on.")}
        </p>
        ${this._renderTriggerPicker(e)}
      </div>
    `}_renderTriggerPicker(e){if(customElements.get("ha-form")){let i=[{name:"triggers",selector:{entity:{multiple:!0}}}];return l`<ha-form
        .hass=${this.hass}
        .schema=${i}
        .data=${{triggers:e}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setTriggers(r.detail.value.triggers??[])}}
      ></ha-form>`}return l`
      <div class="chips">
        ${e.length===0?l`<span class="muted">${o(this.hass,"ui.script_triggers_none","No triggers")}</span>`:e.map(i=>l`<span class="chip" data-test=${`trigger-${i}`}>
                ${i}
                <button type="button" class="x" title=${o(this.hass,"ui.remove","Remove")} @click=${()=>this._removeTrigger(i)}>×</button>
              </span>`)}
      </div>
      <input
        data-test="trigger-add-input"
        placeholder="entity_id"
        @change=${i=>{let r=i.target,a=r.value.trim();a&&this._addTrigger(a),r.value=""}}
      />
    `}_renderYaml(){let e=i=>{i.stopPropagation();let r=i.target.value??i.detail?.value??"";this._onYamlInput(r)};return customElements.get("ha-code-editor")?l`
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
    `}_renderArgs(e,i){return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${e}
        .data=${i}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${r=>{r.stopPropagation(),this._updateArgs(r.detail.value)}}
      ></ha-form>`:l`${e.map(r=>{let a=i[r.name];return l`
        <label style="display:block;margin-bottom:0.4rem;">
          <span style="display:inline-block;min-width:8em;">${r.name}</span>
          <input
            .value=${a==null?"":String(a)}
            @change=${s=>{let d=s.target.value,u={...i,[r.name]:d};this._updateArgs(u)}}
          />
        </label>
      `})}`}_renderPicker(e){return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${this._pickerSchema()}
        .data=${{script:e??""}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),this._pickScript(i.detail.value.script||null)}}
      ></ha-form>`:l`<select
      @change=${i=>this._pickScript(i.target.value||null)}>
      <option value="" ?selected=${!e}>(none)</option>
      ${this._scriptIds().map(i=>l`<option value=${i} ?selected=${i===e}>${this._label(i)}</option>`)}
    </select>`}};fe.styles=y`
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
    .help { font-size: 0.8em; color: var(--secondary-text-color, #777); margin: 0 0 0.4rem 0; }
    .muted { color: var(--secondary-text-color, #777); font-size: 0.85em; }
  `,c([m({attribute:!1})],fe.prototype,"hass",2),c([m({attribute:!1})],fe.prototype,"value",2),c([g()],fe.prototype,"_mode",2),c([g()],fe.prototype,"_yamlText",2),c([g()],fe.prototype,"_yamlError",2),fe=c([w("ambience-script-predicate-input")],fe);var Ar=["dawn","sunrise","noon","sunset","dusk","midnight"];function Lr(t){let n=t.trim(),e=n===""?0:parseInt(n,10);return Number.isNaN(e)?null:e}var lt=class extends b{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){L(this,e)}_onKindChange(e){let i=e.target.value;i!==this.value.kind&&(i==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let i=e.target.value,[r,a]=i.split(":").map(s=>parseInt(s,10));Number.isNaN(r)||Number.isNaN(a)||this._emit({kind:"time",hh:r,mm:a})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let i=e.target.value;this._emit({...this.value,anchor:i})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let i=Lr(e.target.value);i!==null&&this._emit({...this.value,offset_min:i})}_onClampDirChange(e){if(this.value.kind!=="sun")return;let i=e.target.value;if(i===""){this._emit({kind:"sun",anchor:this.value.anchor,offset_min:this.value.offset_min});return}let r=this.value.clamp??Hu();this._emit({...this.value,clamp:{dir:i,hh:r.hh,mm:r.mm}})}_onClampTimeChange(e){if(this.value.kind!=="sun"||!this.value.clamp)return;let i=e.target.value,[r,a]=i.split(":").map(s=>parseInt(s,10));Number.isNaN(r)||Number.isNaN(a)||this._emit({...this.value,clamp:{dir:this.value.clamp.dir,hh:r,mm:a}})}_renderTime(e){let i=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return l`<input type="time" .value=${i} @input=${this._onTimeChange} />`}_renderSun(e){let i=Tr(e.offset_min,this.hass),r=e.clamp?.dir??"",a=e.clamp?`${String(e.clamp.hh).padStart(2,"0")}:${String(e.clamp.mm).padStart(2,"0")}`:"";return l`
      <div class="sun">
        <div class="row">
          <select @change=${this._onAnchorChange}>
            ${Ar.map(s=>l`<option value=${s} ?selected=${s===e.anchor}>${ne(this.hass,s)}</option>`)}
          </select>
          <input
            type="number"
            step="1"
            placeholder=${o(this.hass,"ui.offset_placeholder","Offset")}
            .value=${e.offset_min===0?"":String(e.offset_min)}
            @input=${this._onOffsetChange}
          />
          <span class="offset-hint">${i}</span>
        </div>
        <div class="row">
          <select @change=${this._onClampDirChange}>
            <option value="" ?selected=${r===""}>${o(this.hass,"ui.clamp_none","\u2014")}</option>
            <option value="not_before" ?selected=${r==="not_before"}>${o(this.hass,"ui.clamp_not_before","not before")}</option>
            <option value="not_after" ?selected=${r==="not_after"}>${o(this.hass,"ui.clamp_not_after","not after")}</option>
          </select>
          ${e.clamp?l`<input type="time" .value=${a} @input=${this._onClampTimeChange} />`:""}
        </div>
      </div>
    `}render(){return l`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>${o(this.hass,"ui.endpoint_time","Time")}</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>${o(this.hass,"ui.endpoint_sun","Sun")}</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};lt.styles=y`
    :host {
      display: inline-flex;
      gap: 0.5rem;
      /* Top-align so the kind dropdown (e.g. "Sun") lines up with the first
         input row, not the vertical centre of the two-row sun editor. */
      align-items: flex-start;
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
    .sun {
      display: inline-flex;
      flex-direction: column;
      gap: 0.4rem;
      align-items: flex-start;
    }
    .row {
      display: inline-flex;
      gap: 0.5rem;
      align-items: center;
    }
  `,c([m({attribute:!1})],lt.prototype,"hass",2),c([m({attribute:!1})],lt.prototype,"value",2),lt=c([w("ambience-time-endpoint")],lt);function Hu(){let t=new Date;return{hh:t.getHours(),mm:t.getMinutes()}}function Tr(t,n){if(t===0)return"";let e=Math.abs(t),i=t<0?"\u2212":"+";if(e%60===0){let r=e/60,a=r===1?o(n,"ui.unit_hour","hour"):o(n,"ui.unit_hours","hours");return`${i}${r} ${a}`}return`${i}${e} ${o(n,"ui.unit_min","min")}`}function yn(t,n){if(!t)return[];let e=Object.keys(t.builtins??{}),i=n?e.slice().sort(n):e,r=new Set(t.hidden??[]),a=Object.keys(t.custom??{}).filter(s=>!(s in(t.builtins??{})));return[...i.filter(s=>!r.has(s)),...a]}var ve=class extends b{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._error=""}static{this.styles=y`
    :host { display: block; }
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    h2 { margin: 0; font-size: 1rem; font-weight: 600; }
    /* Fixed badge + actions columns so every row shares the same column
       boundaries (an override row has two icons, a built-in one). */
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
    .error { color: var(--error-color, #d32f2f); margin-bottom: 1rem; }
  `}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){try{this._view=await this._list(),this._error=""}catch(e){this._error=C(this.hass,e)}}async _saveState(e){try{await this._save(e,this._view.hidden),this._error=""}catch(i){return this._error=C(this.hass,i),!1}return await this._reload(),!0}_onEdit(e,i){this._modal={mode:"edit",id:e,initial:i}}async _onDelete(e){let i={...this._view.custom};delete i[e],await this._saveState(i)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:i,definition:r}=e.detail;await this._saveState({...this._view.custom,[i]:r})&&(this._modal={mode:"closed"})}_onModalCancel(){this._modal={mode:"closed"}}_takenIds(){return new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}_renderBuiltinRow(e,i,r){return l`
      <div class="row ${r?"overridden":""}">
        <span class="name">${this._label(e,{})}</span>
        <span class="def">${this._formatDef(i)}</span>
        <span class="badge">${o(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${r?"":l`<button class="icon" title=${o(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(e,i)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(e,i){return l`
      <div class="row custom">
        <span class="name">${this._label(e,this._view.custom)}</span>
        <span class="def">${this._formatDef(i)}</span>
        <span class="badge">${o(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${o(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e,i)}>✎</button>
          <button class="icon" title=${o(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e)}>✕</button>
        </span>
      </div>
    `}render(){let e=this._view.custom,[i,r]=this._headingKey(),[a,s]=this._addKey();return l`
      <header>
        <h2>${o(this.hass,i,r)}</h2>
      </header>
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${Object.entries(this._view.builtins).map(([d,u])=>{let h=e[d];return l`
          ${this._renderBuiltinRow(d,u,h!=null)}
          ${h!=null?this._renderCustomRow(d,h):""}
        `})}
      ${Object.entries(e).filter(([d])=>!(d in this._view.builtins)).map(([d,u])=>this._renderCustomRow(d,u))}
      <button class="add" @click=${this._onAdd}>${o(this.hass,a,s)}</button>
      ${this._renderModal()}
    `}};c([m({attribute:!1})],ve.prototype,"hass",2),c([g()],ve.prototype,"_view",2),c([g()],ve.prototype,"_modal",2),c([g()],ve.prototype,"_error",2);var di={kind:"any"},Po={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},Do=["daytime","dawn","morning","afternoon","evening","nighttime"];function Nu(t,n){let e=Do.indexOf(t),i=Do.indexOf(n);return e===-1&&i===-1?0:e===-1?1:i===-1?-1:e-i}var ye=class extends b{constructor(){super(...arguments);this.value=null;this._entries=[di];this._openIdx=0}willUpdate(e){e.has("value")&&this.value!==this._lastEmitted&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[di]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(i=>{let r=this._entries[this._openIdx];if(!r)return;let a=r.kind==="any"?"__any__":r.kind==="range"?"__custom__":r.period;i.value!==a&&(i.value=a)})}_predicateToEntries(e){return e===null?[di]:(Array.isArray(e)?e:[e]).map(r=>"period"in r?{kind:"period",period:r.period}:{kind:"range",from:r.from,to:r.to})}_emit(e){let i=e.filter(a=>a.kind!=="any").map(a=>a.kind==="period"?{period:a.period}:{from:a.from,to:a.to}),r=i.length===0?null:i.length===1?i[0]:i;this._lastEmitted=r,this.value=r,L(this,r)}_effectiveIds(){return yn(this.periods,Nu)}_onSelectChange(e,i){let r=i.target.value,a=[...this._entries];r==="__any__"?a[e]=di:r==="__custom__"?a[e]={kind:"range",...Po}:a[e]={kind:"period",period:r},this._entries=a,this._emit(a)}_onRangeChange(e,i,r){r.stopPropagation();let a=this._entries[e];if(a?.kind!=="range")return;let s=[...this._entries];s[e]={...a,[i]:r.detail.value},this._entries=s,this._emit(s)}_onRemove(e){let i=this._entries.filter((r,a)=>a!==e);this._entries=i.length===0?[di]:i,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...Po}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,i){let r;return e.kind==="any"?r=o(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?r=cn({period:e.period},{hass:this.hass,periods:this.periods}):r=cn({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),l`
      <div class="summary-chip" @click=${()=>this._onChipClick(i)}>
        <span class="chip-label">${r}</span>
        ${this._entries.length>1?l`<button class="remove" @click=${a=>{a.stopPropagation(),this._onRemove(i)}} title=${o(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,i,r){let a=this._effectiveIds(),s=this.periods?.custom??{};return l`
      <div class="entry">
        <div class="entry-header">
          <select @change=${d=>this._onSelectChange(i,d)}>
            ${r?l`<option value="__any__">${o(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${o(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${a.map(d=>l`<option value=${d}>
                ${he(this.hass,d,s)}${s[d]&&!this.periods?.builtins[d]?o(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?l`<button class="remove" @click=${()=>this._onRemove(i)} title=${o(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${e.kind==="range"?l`
              <div class="range-row">
                <label>${o(this.hass,"ui.from_label","From")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.from}
                  @value-changed=${d=>this._onRangeChange(i,"from",d)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${o(this.hass,"ui.to_label","To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${d=>this._onRangeChange(i,"to",d)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(r=>r.kind!=="any"),i=this._entries.length>1;return l`
      ${this._entries.map((r,a)=>i&&a!==this._openIdx?this._renderChip(r,a):this._renderEntry(r,a,a===0))}
      ${e?l`<button class="add-btn" @click=${this._onAdd}>${o(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};ye.styles=y`
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
    .range-row { display: flex; align-items: flex-start; gap: 0.5rem; }
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
  `,c([m({attribute:!1})],ye.prototype,"value",2),c([m({attribute:!1})],ye.prototype,"periods",2),c([m({attribute:!1})],ye.prototype,"hass",2),c([g()],ye.prototype,"_entries",2),c([g()],ye.prototype,"_openIdx",2),ye=c([w("ambience-time-of-day-input")],ye);function re(t,n,e,i,r){return customElements.get("ha-form")?l`<ha-form
      class=${n}
      .hass=${t}
      .schema=${[{name:n,required:!0,selector:{select:{mode:"dropdown",options:i}}}]}
      .data=${{[n]:e}}
      .computeLabel=${()=>""}
      @value-changed=${s=>{s.stopPropagation();let d=s.detail.value[n];d&&r(d)}}
    ></ha-form>`:l`<select
    class=${n}
    @change=${a=>r(a.target.value)}
  >
    ${i.map(a=>l`<option value=${a.value} ?selected=${a.value===e}>${a.label}</option>`)}
  </select>`}function It(t,n,e,i,r){return customElements.get("ha-form")?l`<ha-form
      class="field"
      data-field="sensors"
      .hass=${t}
      .schema=${n}
      .data=${{sensors:e}}
      .computeLabel=${()=>""}
      @value-changed=${a=>{a.stopPropagation(),r(a.detail.value.sensors??[])}}
    ></ha-form>`:l`<input
    class="field"
    data-field="sensors"
    type="text"
    placeholder=${i}
    .value=${e.join(", ")}
    @change=${a=>r(a.target.value.split(",").map(s=>s.trim()).filter(s=>s!==""))}
  />`}function ci(t,n,e,i,r,a){return customElements.get("ha-form")?l`<ha-form
      .hass=${t}
      .schema=${[{name:n,selector:i}]}
      .data=${{[n]:e??""}}
      .computeLabel=${()=>""}
      @value-changed=${d=>{d.stopPropagation(),a(d.detail.value[n]||null)}}
    ></ha-form>`:l`<input
    type="text"
    placeholder=${r}
    .value=${e??""}
    @change=${s=>a(s.target.value||null)}
  />`}function qe(t){return t?.states??{}}function bn(t){let n=t?.state;return typeof n=="string"&&n.trim()!==""&&Number.isFinite(Number(n))}function Pr(t,n){let e=`${n}.`;return Object.keys(qe(t)).filter(i=>i.startsWith(e)).sort().map(i=>({id:i,name:je(t,i)}))}var Dr="__custom__";function zu(t,n){return t.length===n.length&&t.every((e,i)=>e===n[i])}function Rr(t,n,e){return typeof t=="number"&&t<0||typeof n=="number"&&n<0?o(e,"ui.lux_error_negative","Bounds must be 0 or greater."):typeof t=="number"&&!Number.isInteger(t)||typeof n=="number"&&!Number.isInteger(n)?o(e,"ui.lux_error_not_integer","Bounds must be whole numbers."):typeof t=="number"&&typeof n=="number"&&t>=n?o(e,"ui.lux_error_order","Min must be less than max."):null}function Ro(t,n){if(t==null||typeof t!="object")return null;let e=t;return typeof e.range=="string"?null:Rr(e.min,e.max,n)}function Ou(t){let n=t?.attributes;return n?.device_class==="illuminance"||n?.unit_of_measurement==="lx"||n?.state_class==="measurement"?!0:bn(t)}var Ue=class extends b{constructor(){super(...arguments);this.value=null;this._candidatesOf=[];this._candidates=[];this._candidatesFresh=!1}_cur(){return this.value??{sensors:[],range:this._defaultRangeId()}}_sensors(){return this._cur().sensors??[]}_showQuant(){return this._sensors().length>1}_effectiveRangeIds(){return yn(this.luxRanges)}_defaultRangeId(){return this._effectiveRangeIds()[0]??"dark"}_isCustom(e){return e.range==null}_build(e){let i={...this._cur(),...e},r={sensors:i.sensors??[]};return this._isCustom(i)?(i.min!=null&&(r.min=i.min),i.max!=null&&(r.max=i.max)):r.range=i.range??this._defaultRangeId(),i.quant==="all"&&(r.quant="all"),i.negate===!0&&(r.negate=!0),r}_emit(e){this.value=e,L(this,e)}_setSensors(e){this._emit(e.length?this._build({sensors:e}):null)}_setQuant(e){this._emit(this._build({quant:e}))}_setNegate(e){this._emit(this._build({negate:e}))}_setBand(e){if(e===Dr){let i=this._cur();this._emit(this._build({range:void 0,min:i.min??0,max:i.max}))}else this._emit(this._build({range:e,min:void 0,max:void 0}))}_setMin(e){this._emit(this._build({min:e}))}_setMax(e){this._emit(this._build({max:e}))}_candidateIds(){let e=this.hass?.states,i=this._sensors();if(this._candidatesFresh&&this._candidatesFor===e&&zu(this._candidatesOf,i))return this._candidates;let r=new Set(i);for(let a of Object.keys(e??{}))a.startsWith("sensor.")&&Ou(e?.[a])&&r.add(a);return this._candidatesFor=e,this._candidatesOf=[...i],this._candidates=[...r].sort(),this._candidatesFresh=!0,this._candidates}_sensorSchema(){let e=this._candidateIds(),i={domain:"sensor",multiple:!0};return e.length&&(i.include_entities=e),[{name:"sensors",selector:{entity:i}}]}_renderSensors(){return It(this.hass,this._sensorSchema(),this._sensors(),"sensor.a, sensor.b",e=>this._setSensors(e))}_renderBand(e){let i=this._isCustom(e),r=[...this._effectiveRangeIds().map(d=>({value:d,label:Re(this.hass,d,this.luxRanges?.custom??{})})),{value:Dr,label:o(this.hass,"ui.custom_range","Custom range")}],a=re(this.hass,"band",i?Dr:e.range??this._defaultRangeId(),r,d=>this._setBand(d));if(!i)return a;let s=d=>d==null?"":String(d);return l`${a}
      <span class="band-row" data-field="band-custom">
        <input
          type="number" min="0" step="1" data-field="min"
          placeholder=${o(this.hass,"ui.lux_min_placeholder","0")}
          .value=${s(e.min)}
          @change=${d=>{let u=d.target.value;this._setMin(u===""?void 0:Number(u))}}
        />
        <span>–</span>
        <input
          type="number" min="0" step="1" data-field="max"
          placeholder=${o(this.hass,"ui.lux_max_placeholder","\u221E")}
          .value=${s(e.max)}
          @change=${d=>{let u=d.target.value;this._setMax(u===""?void 0:Number(u))}}
        />
        <span class="label">lx</span>
      </span>`}_renderQuant(e){return re(this.hass,"quant",e,[{value:"any",label:o(this.hass,"ui.lux_any","Any of")},{value:"all",label:o(this.hass,"ui.lux_all","All of")}],i=>this._setQuant(i))}_renderNegate(e){return re(this.hass,"negate",e?"is_not":"is",[{value:"is",label:o(this.hass,"ui.lux_is","is")},{value:"is_not",label:o(this.hass,"ui.lux_is_not","is not")}],i=>this._setNegate(i==="is_not"))}render(){let e=this._cur(),i=e.quant==="all"?"all":"any",r=e.negate===!0;return l`
      ${this._showQuant()?l`<div class="row">${this._renderQuant(i)}</div>`:""}
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._renderNegate(r)}
        ${this._renderBand(e)}
      </div>
    `}};Ue.styles=y`
    :host { display: block; }
    .row {
      display: flex; flex-wrap: wrap; align-items: center;
      gap: 0.5rem; margin-bottom: 0.6rem;
    }
    .label { color: var(--secondary-text-color, #888); font-size: 0.9em; }
    select, input[type="number"], input[type="text"] {
      padding: 0.25rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
    .field { width: 100%; }
    .band-row input[type='number'] { width: 5rem; }
  `,c([m({attribute:!1})],Ue.prototype,"hass",2),c([m({attribute:!1})],Ue.prototype,"value",2),c([m({attribute:!1})],Ue.prototype,"luxRanges",2),Ue=c([w("ambience-lux-input")],Ue);function Ir(t){if(typeof t!="string")return!1;let n=t.split(",").map(e=>e.trim()).filter(e=>e!=="");if(n.length===0)return!1;for(let e of n)if(e.includes("-")){let i=e.split("-").map(s=>s.trim());if(i.length!==2||!/^\d+$/.test(i[0])||!/^\d+$/.test(i[1]))return!1;let r=Number(i[0]),a=Number(i[1]);if(!(r>=1&&r<=a&&a<=31))return!1}else{if(!/^\d+$/.test(e))return!1;let i=Number(e);if(!(i>=1&&i<=31))return!1}return!0}var Hr=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Mu=new Set(["workday","holiday"]),Fu=new Set(["first_workday","last_workday"]),ju=[31,29,31,30,31,30,31,31,30,31,30,31];function ui(t){return ju[t-1]??31}function Nr(t){switch(t){case"weekday":return{kind:t,days:[]};case"day_of_month":return{kind:t,days:""};case"date":return{kind:t,month:1,day:1};case"date_range":return{kind:t,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:t}}}function Io(t,n){if(t==null||typeof t!="object")return null;let e=t;for(let i of[e.include,e.exclude])if(Array.isArray(i))for(let r of i){let a=r;if(a?.kind==="weekday"&&(!Array.isArray(a.days)||a.days.length===0))return o(n,"ui.day_pick_weekday","Pick at least one day of the week.");if(a?.kind==="day_of_month"&&(typeof a.days!="string"||!Ir(a.days)))return o(n,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}return null}var We=class extends b{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?o(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return o(this.hass,"ui.field_kind","Kind");case"days":return o(this.hass,"ui.field_days_of_month","Days of month");case"month":return o(this.hass,"ui.field_month","Month");case"day":return o(this.hass,"ui.field_day","Day");case"from_month":return o(this.hass,"ui.field_from_month","From month");case"from_day":return o(this.hass,"ui.field_from_day","From day");case"to_month":return o(this.hass,"ui.field_to_month","To month");case"to_day":return o(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let i=e.include.length===0&&e.exclude.length===0;this.value=i?null:e,L(this,this.value)}_addItem(e,i){let r=this._current();r[e]=[...r[e],Nr(i)],this._emit(r)}_removeItem(e,i){let r=this._current();r[e]=r[e].filter((a,s)=>s!==i),this._emit(r)}_updateItem(e,i,r){let a=this._current();a[e]=a[e].map((s,d)=>d===i?r:s),this._emit(a)}_kindDisabled(e){return!!(Mu.has(e)&&!this.dayConfig.workday_sensor||Fu.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:Hr.map(e=>({value:e,label:Ri(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:Ii(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:ui(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,i){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(i.days??"")}:e}_setDatePart(e,i,r){let a=Number(r);if(!Number.isFinite(a)||a<1)return e;if(i.endsWith("month")&&(a=Math.min(a,12)),e.kind==="date"){let{month:s,day:d}=e;return i==="month"&&(s=a),i==="day"&&(d=a),{kind:"date",month:s,day:Math.min(d,ui(s))}}if(e.kind==="date_range"){let s={...e.from},d={...e.to};return i==="from_month"&&(s.month=a),i==="from_day"&&(s.day=a),i==="to_month"&&(d.month=a),i==="to_day"&&(d.day=a),s.day=Math.min(s.day,ui(s.month)),d.day=Math.min(d.day,ui(d.month)),{kind:"date_range",from:s,to:d}}return e}_onKindForm(e,i,r){let a=r.kind;if(!a){this._removeItem(e,i);return}if(this._kindDisabled(a))return;let s=this._current()[e][i];s&&s.kind===a||this._updateItem(e,i,Nr(a))}_dayOfMonthError(e){return e.trim()===""||Ir(e)?null:o(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(e,i,r,a){this._updateItem(e,i,this._bodyPatch(r,a))}_renderWeekday(e,i,r){return l`${[0,1,2,3,4,5,6].map(a=>l`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${r.days.includes(a)}
          @change=${s=>{let u=s.target.checked?[...r.days,a].sort((h,p)=>h-p):r.days.filter(h=>h!==a);this._updateItem(e,i,{kind:"weekday",days:u})}}
        />${Di(this.hass,a)}
      </label>
    `)}`}_renderKindPicker(e,i,r){return customElements.get("ha-form")?l`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:r.kind}}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${a=>{a.stopPropagation(),this._onKindForm(e,i,a.detail.value)}}
      ></ha-form>`:l`
      <select
        class="kind"
        @change=${a=>{let s=a.target.value;this._kindDisabled(s)||s===r.kind||this._updateItem(e,i,Nr(s))}}
      >
        ${Hr.map(a=>l`<option value=${a} ?selected=${a===r.kind} ?disabled=${this._kindDisabled(a)}>${Ri(this.hass,a)}</option>`)}
      </select>
    `}_renderItemBody(e,i,r){if(r.kind==="weekday")return this._renderWeekday(e,i,r);if(customElements.get("ha-form")){if(r.kind==="date")return this._renderDateRow(e,i,r,"month","day",r.month,r.day);if(r.kind==="date_range")return l`
          ${this._renderDateRow(e,i,r,"from_month","from_day",r.from.month,r.from.day)}
          ${this._renderDateRow(e,i,r,"to_month","to_day",r.to.month,r.to.day)}
        `;let a=this._bodySchema(r);if(!a)return l``;let s=r.kind==="day_of_month"?this._dayOfMonthError(r.days):null;return l`<ha-form
        .hass=${this.hass}
        .schema=${a}
        .data=${this._bodyData(r)}
        .error=${s?{days:s}:void 0}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${d=>{d.stopPropagation(),this._onBodyForm(e,i,r,d.detail.value)}}
      ></ha-form>`}return this._renderNativeBody(e,i,r)}_renderDateRow(e,i,r,a,s,d,u){let h=(p,_)=>{this._updateItem(e,i,this._setDatePart(r,p,_[p]))};return l`
      <div class="date-row">
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:a,required:!0,selector:this._monthSelector()}]}
          .data=${{[a]:String(d)}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${p=>{p.stopPropagation(),h(a,p.detail.value)}}
        ></ha-form>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:s,required:!0,selector:this._daySelector(d)}]}
          .data=${{[s]:u}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${p=>{p.stopPropagation(),h(s,p.detail.value)}}
        ></ha-form>
      </div>
    `}_renderNativeBody(e,i,r){if(r.kind==="day_of_month"){let d=this._dayOfMonthError(r.days);return l`<input
        type="text" placeholder=${o(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${r.days}
        @change=${u=>this._updateItem(e,i,this._bodyPatch(r,{days:u.target.value}))}
      />${d?l`<div class="field-error">${d}</div>`:""}`}let a=(d,u)=>l`
      <input type="number" min="1" max="12" .value=${String(u)}
        @change=${h=>this._updateItem(e,i,this._setDatePart(r,d,h.target.value))} />
    `,s=(d,u,h)=>l`
      <input type="number" min="1" max=${String(ui(u))} .value=${String(h)}
        @change=${p=>this._updateItem(e,i,this._setDatePart(r,d,p.target.value))} />
    `;return r.kind==="date"?l`${a("month",r.month)} / ${s("day",r.month,r.day)}`:r.kind==="date_range"?l`
        <span>${o(this.hass,"ui.from","from")}</span>
        ${a("from_month",r.from.month)} / ${s("from_day",r.from.month,r.from.day)}
        <span>${o(this.hass,"ui.to","to")}</span>
        ${a("to_month",r.to.month)} / ${s("to_day",r.to.month,r.to.day)}
      `:l``}_renderAddPicker(e){let i=e==="include"?o(this.hass,"ui.add_include_item","+ Add include item"):o(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let r=()=>i;return l`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${r}
        @value-changed=${a=>{a.stopPropagation();let s=a.detail.value.kind;s&&!this._kindDisabled(s)&&this._addItem(e,s)}}
      ></ha-form>`}return l`
      <select
        .value=${""}
        @change=${r=>{let a=r.target.value;a&&(this._addItem(e,a),r.target.value="")}}
      >
        <option value="">${i}</option>
        ${Hr.map(r=>l`<option value=${r} ?disabled=${this._kindDisabled(r)}>${Ri(this.hass,r)}</option>`)}
      </select>
    `}_renderItem(e,i,r){return l`
      <div class="item">
        ${this._renderKindPicker(e,i,r)}
        <div class="body">${this._renderItemBody(e,i,r)}</div>
        <button class="remove" title=${o(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(e,i)}>✕</button>
      </div>
    `}_renderSection(e,i){return l`
      <div class="section">
        <h4>${e==="include"?o(this.hass,"ui.include","Include"):o(this.hass,"ui.exclude","Exclude")}</h4>
        ${i.length===0&&e==="include"?l`<div class="hint">${o(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${i.map((r,a)=>this._renderItem(e,a,r))}
        ${this._renderAddPicker(e)}
      </div>
    `}render(){let{include:e,exclude:i}=this._current();return l`
      ${this._renderSection("include",e)}
      ${this._renderSection("exclude",i)}
    `}};We.styles=y`
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
  `,c([m({attribute:!1})],We.prototype,"hass",2),c([m({attribute:!1})],We.prototype,"value",2),c([m({attribute:!1})],We.prototype,"dayConfig",2),We=c([w("ambience-day-predicate-input")],We);var Ho=["temperature","apparent_temperature","humidity","wind_speed","pressure"],No=["<","<=",">",">="],zo={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},Te=class extends b{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(e){let i=e.groups.length===0&&e.thresholds.length===0;this.value=i?null:e,L(this,this.value)}_setGroups(e){this._emit({...this._current(),groups:e})}_addThreshold(){let e=this._current();e.thresholds=[...e.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(e)}_updateThreshold(e,i){let r=this._current();r.thresholds=r.thresholds.map((a,s)=>s===e?i:a),this._emit(r)}_removeThreshold(e){let i=this._current();i.thresholds=i.thresholds.filter((r,a)=>a!==e),this._emit(i)}_attributeSchema(e){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:Ho.map(i=>({value:i,label:qt(this.hass,i)}))}}}]}_opSchema(e){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:No.map(i=>({value:i,label:zo[i]}))}}}]}_entityState(){let e=this.weatherEntity;return e?this.hass?.states?.[e]:void 0}_valueSchema(e,i){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:Wn(this.hass,i,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(e=>({value:e.id,label:e.label}))}}}]}_renderGroups(e){return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{groups:e}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),this._setGroups(i.detail.value.groups??[])}}
      ></ha-form>`:l`${this.groups.map(i=>l`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${e.includes(i.id)}
          @change=${r=>{let a=r.target.checked;this._setGroups(a?[...e,i.id]:e.filter(s=>s!==i.id))}} />${i.label}
      </label>`)}`}_renderAttributeSelect(e,i){return customElements.get("ha-form")?l`<ha-form
        class="attr-form"
        .hass=${this.hass}
        .schema=${this._attributeSchema(e)}
        .data=${{attribute:i.attribute}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation();let a=r.detail.value.attribute;a&&this._updateThreshold(e,{...i,attribute:a})}}
      ></ha-form>`:l`<select
      @change=${r=>this._updateThreshold(e,{...i,attribute:r.target.value})}>
      ${Ho.map(r=>l`<option value=${r} ?selected=${r===i.attribute}>${qt(this.hass,r)}</option>`)}
    </select>`}_renderOpSelect(e,i){return customElements.get("ha-form")?l`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(e)}
        .data=${{op:i.op}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation();let a=r.detail.value.op;a&&this._updateThreshold(e,{...i,op:a})}}
      ></ha-form>`:l`<select
      @change=${r=>this._updateThreshold(e,{...i,op:r.target.value})}>
      ${No.map(r=>l`<option value=${r} ?selected=${r===i.op}>${zo[r]}</option>`)}
    </select>`}_renderValueInput(e,i){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(e,i.attribute)}
        .data=${{value:i.value}}
        .computeLabel=${()=>""}
        @value-changed=${a=>{a.stopPropagation();let s=a.detail.value.value;typeof s=="number"&&Number.isFinite(s)&&this._updateThreshold(e,{...i,value:s})}}
      ></ha-form>`;let r=Wn(this.hass,i.attribute,this._entityState());return l`<span class="value-wrap">
      <input type="number" .value=${String(i.value)}
        @change=${a=>{let s=Number(a.target.value);Number.isFinite(s)&&this._updateThreshold(e,{...i,value:s})}} />
      <span class="unit">${r}</span>
    </span>`}_renderThreshold(e,i){return l`
      <div class="threshold">
        ${this._renderAttributeSelect(e,i)}
        ${this._renderOpSelect(e,i)}
        ${this._renderValueInput(e,i)}
        <button class="remove" title=${o(this.hass,"ui.remove","Remove")} @click=${()=>this._removeThreshold(e)}>✕</button>
      </div>
    `}render(){let{groups:e,thresholds:i}=this._current();return l`
      <div class="section">
        <h4>${o(this.hass,"ui.groups","Groups")}</h4>
        ${this._renderGroups(e)}
      </div>
      <div class="section">
        <h4>${o(this.hass,"ui.thresholds","Thresholds")}</h4>
        ${i.map((r,a)=>this._renderThreshold(a,r))}
        <button class="add" @click=${()=>this._addThreshold()}>${o(this.hass,"ui.add_threshold","+ Add threshold")}</button>
      </div>
    `}};Te.styles=y`
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
  `,c([m({attribute:!1})],Te.prototype,"hass",2),c([m({attribute:!1})],Te.prototype,"value",2),c([m({attribute:!1})],Te.prototype,"groups",2),c([m({attribute:!1})],Te.prototype,"weatherEntity",2),Te=c([w("ambience-weather-predicate-input")],Te);var qu=["NW","N","NE","W",null,"E","SW","S","SE"],dt=class extends b{constructor(){super(...arguments);this.value=null}_current(){let e=this.value?.azimuth?.ranges??[];return{elevation:this.value?.elevation??null,sectors:[...this.value?.azimuth?.sectors??[]],range:e.length?{...e[0]}:null}}_emit(e){let i={};e.elevation&&(e.elevation.min!=null||e.elevation.max!=null)&&(i.elevation=e.elevation);let r={};e.sectors.length&&(r.sectors=e.sectors),e.range&&(r.ranges=[e.range]),(r.sectors||r.ranges)&&(i.azimuth=r),this.value=i.elevation||i.azimuth?i:null,L(this,this.value)}_setElevation(e){this._emit({...this._current(),elevation:e})}_setSectors(e){this._emit({...this._current(),sectors:e})}_setRange(e){this._emit({...this._current(),range:e})}_mode(e){return!e||e.min==null&&e.max==null?"any":e.min!=null&&e.max!=null?"between":e.min!=null?"above":"below"}_onModeChange(e,i){let r=i?.min??0,a=i?.max??0;e==="any"?this._setElevation(null):e==="above"?this._setElevation({min:r}):e==="below"?this._setElevation({max:a}):this._setElevation({min:r,max:a})}_toggleSector(e,i,r){this._setSectors(r?[...e,i]:e.filter(a=>a!==i))}_renderSectors(e){return l`<div class="sectors">${qu.map(i=>i===null?l`<span class="spacer"></span>`:l`<label>
            <input type="checkbox" .checked=${e.includes(i)}
              @change=${r=>this._toggleSector(e,i,r.target.checked)} />${vt(this.hass,i)}
          </label>`)}</div>`}_renderElevation(e){let i=this._mode(e),r=["any","above","below","between"],a={any:o(this.hass,"ui.sun.any","Any"),above:o(this.hass,"ui.sun.above","Above"),below:o(this.hass,"ui.sun.below","Below"),between:o(this.hass,"ui.sun.between","Between")};return l`
      <div class="row">
        <select @change=${s=>this._onModeChange(s.target.value,e)}>
          ${r.map(s=>l`<option value=${s} ?selected=${s===i}>${a[s]}</option>`)}
        </select>
        ${i==="above"||i==="between"?l`<input type="number" class="min" .value=${String(e?.min??0)}
              @change=${s=>this._setElevation({...i==="between"?{max:e?.max??0}:{},min:Number(s.target.value)})} /><span class="deg">°</span>`:""}
        ${i==="below"||i==="between"?l`<input type="number" class="max" .value=${String(e?.max??0)}
              @change=${s=>this._setElevation({...i==="between"?{min:e?.min??0}:{},max:Number(s.target.value)})} /><span class="deg">°</span>`:""}
      </div>
    `}_renderCustomRange(e){return l`
      <label class="custom-range">
        <input type="checkbox" class="custom-range-toggle" .checked=${e!==null}
          @change=${i=>this._setRange(i.target.checked?{from:0,to:0}:null)} />
        ${o(this.hass,"ui.sun.custom_range","Custom range")}
      </label>
      ${e===null?"":l`<div class="row range-row">
            <input type="number" class="from" .value=${String(e.from)}
              @change=${i=>this._setRange({...e,from:Number(i.target.value)})} />
            <span class="deg">°–</span>
            <input type="number" class="to" .value=${String(e.to)}
              @change=${i=>this._setRange({...e,to:Number(i.target.value)})} />
            <span class="deg">°</span>
          </div>`}
    `}render(){let{elevation:e,sectors:i,range:r}=this._current();return l`
      <div class="section">
        <h4>${o(this.hass,"ui.sun.elevation","Elevation")}</h4>
        ${this._renderElevation(e)}
      </div>
      <div class="section">
        <h4>${o(this.hass,"ui.sun.azimuth","Azimuth")}</h4>
        ${this._renderSectors(i)}
        ${this._renderCustomRange(r)}
      </div>
    `}};dt.styles=y`
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
  `,c([m({attribute:!1})],dt.prototype,"hass",2),c([m({attribute:!1})],dt.prototype,"value",2),dt=c([w("ambience-sun-predicate-input")],dt);var U=class extends b{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[];this._knownAttributeValues=[];this._entitySeq=0}willUpdate(e){if(!e.has("value"))return;let i=e.get("value"),{entity_id:r,attribute:a}=this.value;(r!==i?.entity_id||a!==i?.attribute)&&!(r&&a&&this.hass)&&this._knownAttributeValues.length&&(this._knownAttributeValues=[])}async updated(e){if(!e.has("value"))return;let i=e.get("value"),{entity_id:r,attribute:a}=this.value;if(r&&r!==i?.entity_id&&this.hass)try{let s=(await Qn(this.hass,r)).states;this.value.entity_id===r&&(this._knownStates=s)}catch{this.value.entity_id===r&&(this._knownStates=[])}if((r!==i?.entity_id||a!==i?.attribute)&&r&&a&&this.hass)try{let s=(await Jn(this.hass,r,a)).values;this.value.entity_id===r&&this.value.attribute===a&&(this._knownAttributeValues=s)}catch{this.value.entity_id===r&&this.value.attribute===a&&(this._knownAttributeValues=[])}}_normalize(e){let i={...e};return i.attribute===""&&(i.attribute=null),i.for&&i.for.h===0&&i.for.m===0&&i.for.s===0&&(i.for=null),Et(i.for,i.for_mode)||delete i.for_mode,i}_emit(e){let i=this._normalize(e);this.value=i,L(this,i)}_autoFlipOp(e){let i=this._isNumericTargetFor(e),r=this._isNumericOp(e.kind);return!i&&r?{...e,kind:"is"}:i&&!r&&!this._isNumericTargetFor(this.value)?{...e,kind:">"}:e}async _setEntity(e){let i=++this._entitySeq,r=this._entityHasAttribute(e,this.value.attribute)?this.value.attribute:null,a=await this._supportedValues(e,r,this.value.states);i===this._entitySeq&&this._emit(this._autoFlipOp({...this.value,entity_id:e,attribute:r,states:a}))}_entityHasAttribute(e,i){return i?this._knownAttributesFor(e).includes(i):!1}async _supportedValues(e,i,r){if(!e||r.length===0||!this.hass)return[];try{let a=new Set(i?(await Jn(this.hass,e,i)).values:(await Qn(this.hass,e)).states);return r.filter(s=>a.has(s))}catch{return[]}}_setAttribute(e){this._emit(this._autoFlipOp({...this.value,attribute:e}))}_setOp(e){let i=this._isNumericOp(e)===this._isNumericOp(this.value.kind)?this.value.states:[];this._emit({...this.value,kind:e,states:i})}_setStates(e){this._emit({...this.value,states:e})}_setValueAt(e,i){if(this._isNumericOp(this.value.kind)){this._setStates([i]);return}let r=this.value.states.slice();i===""?r.splice(e,1):r[e]=i,this._setStates(r)}_addValue(e){e&&this._setStates([...this.value.states,e])}_removeValueAt(e){let i=this.value.states.slice();i.splice(e,1),this._setStates(i)}_setForDuration(e){if(e===null){this._emit({...this.value,for:null,for_mode:null});return}let{mode:i,...r}=e;this._emit({...this.value,for:r,for_mode:i})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(e){if(!e)return[];let i=qe(this.hass)[e]?.attributes;return i?Object.keys(i).sort():[]}_attrLabelMaps(){let e=this._knownAttributesFor(this.value.entity_id),r=`${this.hass?.language??""}|${this.value.entity_id}|${e.join(",")}`;if(this._attrMapsCache?.key===r)return this._attrMapsCache.maps;let a=qe(this.hass)[this.value.entity_id],s=new Map,d=new Map;for(let h of e){let p=Ti(this.hass,a,h);s.set(h,p),d.set(p,h)}let u={keyToLabel:s,labelToKey:d};return this._attrMapsCache={key:r,maps:u},u}_attributeSchema(){let{keyToLabel:e}=this._attrLabelMaps();return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:U._STATE_SENTINEL,label:o(this.hass,"ui.state_sentinel","State")},...[...e.values()].map(i=>({value:i,label:i}))]}}}]}_attributeData(){let e=this.value.attribute;if(!e)return{attribute:U._STATE_SENTINEL};let{keyToLabel:i}=this._attrLabelMaps();return{attribute:i.get(e)??e}}_setAttributeFromHaForm(e){if(e===U._STATE_SENTINEL){this._setAttribute("");return}let{labelToKey:i}=this._attrLabelMaps();this._setAttribute(i.get(e)??e)}_isNumericOp(e){return U._NUMERIC_OPS.includes(e)}_isNumericTargetFor(e){let i=qe(this.hass)[e.entity_id];return i?e.attribute?typeof i.attributes?.[e.attribute]=="number":bn(i):!1}_opSchema(){let e=this._isNumericTargetFor(this.value)?[...U._NUMERIC_OPS,"is","is_not"]:["is","is_not"];return e.includes(this.value.kind)||e.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:e.map(i=>({value:i,label:j(this.hass,i)}))}}}]}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let{rawToLabel:e}=this._valueLabelMaps();return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:[...e.values()].map(i=>({value:i,label:i}))}}}]}_rawValueOptions(){return this.value.attribute?this._knownAttributeValues:this._knownStates}_valueLabelMaps(){let e=this.value.attribute,i=this._rawValueOptions(),a=`${this.hass?.language??""}|${this.value.entity_id}|${e??""}|${i.join(",")}`;if(this._valueMapsCache?.key===a)return this._valueMapsCache.maps;let s=qe(this.hass)[this.value.entity_id],d=new Map,u=new Map;for(let p of i){let _=De(this.hass,s,e,p);d.set(p,_),u.set(_,p)}let h={rawToLabel:d,labelToRaw:u};return this._valueMapsCache={key:a,maps:h},h}_valueDisplay(e){return this._valueLabelMaps().rawToLabel.get(e)??e}_labelToRaw(e){return this._valueLabelMaps().labelToRaw.get(e)??e}_setValueFromHaForm(e,i){this._setValueAt(e,this._labelToRaw(i))}_addValueFromHaForm(e){this._addValue(this._labelToRaw(e))}_renderEntity(){return customElements.get("ha-form")?l`<ha-form
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
        @value-changed=${i=>{i.stopPropagation(),this._setAttributeFromHaForm(i.detail.value.attribute??"")}}
      ></ha-form>`:l`<input
      data-field="attribute"
      type="text"
      placeholder=${o(this.hass,"ui.state_attribute_placeholder","leave blank to compare state")}
      .value=${e}
      @change=${i=>this._setAttribute(i.target.value)}
    />`}_renderOp(){return customElements.get("ha-form")?l`<ha-form
        class="op-form"
        data-field="op"
        .hass=${this.hass}
        .schema=${this._opSchema()}
        .data=${{op:this.value.kind}}
        .computeLabel=${()=>""}
        @value-changed=${e=>{e.stopPropagation();let i=e.detail.value.op;i&&this._setOp(i)}}
      ></ha-form>`:l`<select
      data-field="op"
      @change=${e=>this._setOp(e.target.value)}>
      <option value="is" ?selected=${this.value.kind==="is"}>${j(this.hass,"is")}</option>
      <option value="is_not" ?selected=${this.value.kind==="is_not"}>${j(this.hass,"is_not")}</option>
    </select>`}_renderValueRow(e,i){let r=i===-1,a=r?u=>this._addValue(u):u=>this._setValueAt(i,u),s=this._isNumericOp(this.value.kind),d=s?{value:e===""?void 0:Number(e)}:{value:this._valueDisplay(e)};return customElements.get("ha-form")?l`
        <div class="value-row" data-row=${i}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${d}
            .computeLabel=${()=>""}
            @value-changed=${u=>{u.stopPropagation();let h=u.detail.value.value,p=h==null?"":String(h);s?a(p):r?this._addValueFromHaForm(p):this._setValueFromHaForm(i,p)}}
          ></ha-form>
        </div>
      `:l`
      <div class="value-row" data-row=${i}>
        <input type=${s?"number":"text"} .value=${e}
          placeholder=${r?o(this.hass,"ui.state_add_value","+ Add state"):""}
          @change=${u=>a(u.target.value)} />
      </div>
    `}_renderForRow(){return l`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this.value.for??null}
      .mode=${this.value.for_mode??"at_least"}
      @value-changed=${e=>{e.stopPropagation(),this._setForDuration(e.detail.value)}}
    ></ambience-for-duration>`}render(){return l`
      <section class="field">
        <label class="field-label">${o(this.hass,"ui.state_entity","Entity")}</label>
        ${this._renderEntity()}
      </section>
      <section class="field where-op-row">
        <div class="where-cell">
          <label class="field-label">${o(this.hass,"ui.state_where","Where")}</label>
          ${this._renderAttribute()}
        </div>
        <div class="op-cell">
          <label class="field-label">${o(this.hass,"ui.state_op_header","Comparison")}</label>
          ${this._renderOp()}
        </div>
      </section>
      <section class="field">
        <label class="field-label">
          ${o(this.hass,"ui.state_value_label","Value")}
        </label>
        <div class="value-list">
          ${this._isNumericOp(this.value.kind)?this._renderValueRow(this.value.states[0]??"",0):l`
                ${this.value.states.map((e,i)=>this._renderValueRow(e,i))}
                ${this._renderValueRow("",-1)}
              `}
        </div>
      </section>
      <section class="field">
        <label class="field-label">${o(this.hass,"ui.state_for","For (optional)")}</label>
        ${this._renderForRow()}
      </section>
    `}};U.styles=y`
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
  `,U._STATE_SENTINEL="State",U._NUMERIC_OPS=[">",">=","<","<="],c([m({attribute:!1})],U.prototype,"hass",2),c([m({attribute:!1})],U.prototype,"value",2),c([g()],U.prototype,"_knownStates",2),c([g()],U.prototype,"_knownAttributeValues",2),U=c([w("ambience-state-expr-atom")],U);function wn(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,i)=>e===n[i])}var te=class extends b{constructor(){super(...arguments);this.path=[];this.dragOverPath=null;this.dragOverPos=null;this.dragFromPath=null;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(e,i={}){this.dispatchEvent(new CustomEvent(e,{detail:{path:this.path,...i},bubbles:!0,composed:!0}))}_atomIsComplete(e){return!!e.entity_id&&e.states.some(i=>i!=="")}_isErrorTarget(){return wn(this.path,this.errorPath)}_isDropTarget(){return wn(this.path,this.dragOverPath)}_dropPos(){return this._isDropTarget()?this.dragOverPos:null}_isDragging(){return wn(this.path,this.dragFromPath)}_onDragHandleDown(e){this.path.length!==0&&(!e.isPrimary||e.button>0||(e.stopPropagation(),this.dispatchEvent(new CustomEvent("node-drag-start",{detail:{path:this.path,pointer:e},bubbles:!0,composed:!0}))))}_dragHandle(){return this.path.length===0?"":l`<span
      class="drag-handle"
      title=${o(this.hass,"ui.drag_to_reorder","Drag to reorder")}
      @pointerdown=${this._onDragHandleDown}
      @click=${e=>e.stopPropagation()}
      >⠿</span
    >`}_notToggle(e){return l`<button class="not-toggle ${e?"on":""}"
      title=${o(this.hass,"ui.state_not_toggle","Negate (NOT)")}
      @click=${i=>{i.stopPropagation(),this._emit("node-toggle-not")}}>${j(this.hass,"not")}</button>`}_renderAtomCard(e,i){let r=this._atomIsComplete(e),a=wn(this.path,this.openPath),s=r?pr(e,{hass:this.hass}):o(this.hass,"ui.state_new_condition","(new condition)");return l`
      <div class="atom-card ${a?"expanded":"collapsed"} ${this._dropPos()==="into"?"drag-over":""} ${this._isDragging()?"dragging":""}">
        <div class="atom-header"
          @click=${()=>this._emit("node-open")}>
          ${this._dragHandle()}
          ${this._notToggle(i)}
          <span class="summary ${r?"":"placeholder"}">${s}</span>
          <button class="wrap"
            title=${o(this.hass,"ui.state_wrap","Wrap in group")}
            @click=${d=>{d.stopPropagation(),this._emit("node-wrap")}}>(…)</button>
          <button class="remove"
            title=${o(this.hass,"ui.remove","Remove")}
            @click=${d=>{d.stopPropagation(),this._emit("node-remove")}}>✕</button>
        </div>
        ${a?l`
          <div class="atom-body">
            <ambience-state-expr-atom
              .hass=${this.hass}
              .value=${e}
              @value-changed=${d=>{d.stopPropagation();let u=d.detail.value,h=i?{kind:"not",item:u}:u;this._emit("node-change",{value:h})}}
            ></ambience-state-expr-atom>
            ${this._isErrorTarget()&&this.errorMessage?l`<div class="atom-error">${this.errorMessage}</div>`:""}
          </div>
        `:""}
      </div>
    `}_renderChildRow(e,i){let r=[...this.path,i];return l`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${e}
        .path=${r}
        .openPath=${this.openPath}
        .dragOverPath=${this.dragOverPath}
        .dragOverPos=${this.dragOverPos}
        .dragFromPath=${this.dragFromPath}
        .errorPath=${this.errorPath}
        .errorMessage=${this.errorMessage}
      ></ambience-state-expr-node>
    `}_renderGroup(e,i){return l`
      <div class="group ${this._dropPos()==="into"?"drag-over":""} ${this._isDragging()?"dragging":""}">
        <div class="group-header">
          ${this._dragHandle()}
          ${this._notToggle(i)}
          <select class="group-op"
            @change=${r=>this._emit("node-set-op",{op:r.target.value})}>
            <option value="and" ?selected=${e.kind==="and"}>${j(this.hass,"and")}</option>
            <option value="or"  ?selected=${e.kind==="or"} >${j(this.hass,"or")}</option>
          </select>
          <button class="wrap"
            title=${o(this.hass,"ui.state_wrap_group","Wrap these clauses in parentheses")}
            @click=${r=>{r.stopPropagation(),this._emit("node-wrap")}}>(…)</button>
          <button class="unwrap"
            title=${o(this.hass,"ui.state_unwrap_group","Remove these parens (promote children to parent)")}
            @click=${()=>this._emit("node-unwrap")}>✕</button>
        </div>
        <div class="group-children">
          ${e.items.map((r,a)=>this._renderChildRow(r,a))}
        </div>
        <div class="actions">
          <button @click=${()=>this._emit("node-add-child")}>
            + ${o(this.hass,"ui.state_add_condition","Add clause")}
          </button>
        </div>
      </div>
    `}render(){let e=this.value.kind==="not",i=e?this.value.item:this.value,r=i.kind==="and"||i.kind==="or"?this._renderGroup(i,e):this._renderAtomCard(i,e),a=this._dropPos();return l`
      ${a==="before"?l`<div class="drop-line before"></div>`:""}
      ${r}
      ${a==="after"?l`<div class="drop-line after"></div>`:""}
    `}};te.styles=y`
    :host { display: block; }
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
    /* Push the wrap + unwrap pair to the right edge of the header — the
       "(…)" wrap and "✕" unwrap sit together on the right, mirroring the
       atom card where the summary's flex:1 leaves wrap/remove on the right. */
    .group-header .wrap { margin-left: auto; }
    .group-header .unwrap {
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
    /* Insertion line for a before/after (sibling) drop — a thin bar with a
       leading dot, drawn just above/below the node. */
    .drop-line { position: relative; height: 0; margin: 1px 0; }
    .drop-line::before {
      content: ""; position: absolute; left: 0; right: 0; top: -1px;
      height: 3px; border-radius: 2px; background: var(--primary-color, #03a9f4);
    }
    .drop-line::after {
      content: ""; position: absolute; left: -2px; top: -3px;
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--primary-color, #03a9f4);
    }
    /* The node currently being dragged lifts (solid, with a shadow) as it
       tracks the pointer — matching the scene/action lists' dragged-item
       treatment. */
    .atom-card.dragging,
    .group.dragging {
      opacity: 0.8; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
      position: relative; z-index: 1000;
    }
    /* The drag handle (⠿) is the only grabbable part of a row. Pointer
       Events drive the drag (so it works on touch, unlike native HTML5
       DnD); touch-action:none stops the browser panning when a drag
       begins on a touchscreen, while the rest of the header still scrolls
       and clicks normally. */
    .drag-handle {
      flex: 0 0 auto;
      cursor: grab;
      touch-action: none;
      user-select: none;
      color: var(--secondary-text-color, #888);
      font-size: 1em; line-height: 1;
    }
    .drag-handle:active { cursor: grabbing; }
    .atom-error {
      margin-top: 0.5rem;
      color: var(--error-color, #b71c1c);
      font-size: 0.9em;
    }
  `,c([m({attribute:!1})],te.prototype,"hass",2),c([m({attribute:!1})],te.prototype,"value",2),c([m({attribute:!1})],te.prototype,"path",2),c([m({attribute:!1})],te.prototype,"dragOverPath",2),c([m({attribute:!1})],te.prototype,"dragOverPos",2),c([m({attribute:!1})],te.prototype,"dragFromPath",2),c([m({attribute:!1})],te.prototype,"openPath",2),c([m({attribute:!1})],te.prototype,"errorPath",2),c([m({attribute:!1})],te.prototype,"errorMessage",2),te=c([w("ambience-state-expr-node")],te);function hi(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,i)=>e===n[i])}function pi(t){return t&&t.kind==="not"?t.item:t}var Uu=new Set(["is","is_not",">",">=","<","<=","and","or","not"]);function Oo(t,n){if(!t.entity_id)return o(n,"ui.state_err_entity","Entity is required");let e=Array.isArray(t.states)?t.states:[];if(t.kind!=="is"&&t.kind!=="is_not"){let r=e[0];if(typeof r!="string"||!r.trim())return o(n,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(r)))return o(n,"ui.state_err_numeric","Value must be a number")}else if(!e.some(r=>r!==""))return o(n,"ui.state_err_state","State is required");return null}function xn(t,n){if(!t||typeof t!="object")return null;if(t.kind==="not"){let e=t.item;return e?xn(e,n):o(n,"ui.state_err_incomplete","This condition is incomplete")}if(t.kind==="and"||t.kind==="or"){let e=t.items;if(!Array.isArray(e)||e.length===0)return o(n,"ui.state_err_incomplete","This condition is incomplete");for(let i of e){let r=xn(i,n);if(r!==null)return r}return null}return Oo(t,n)}function Mo(t,n){if(t==null||typeof t!="object")return null;let e=t.kind;return typeof e!="string"||!Uu.has(e)?null:xn(t,n)}var ae=class extends b{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._dragFrom=null;this._dragOverPath=null;this._dragOverPos=null;this._cancelDrag=null;this._onNodeDragStart=e=>{e.stopPropagation(),this._startDrag(e.detail.path,e.detail.pointer)};this._onNodeChange=e=>{e.stopPropagation();let{path:i,value:r}=e.detail;if(this._isEmptyAtom(r)){let a=this._atomAt(i);if(a&&!this._isEmptyAtom(a)){this._openPath=null,this._removeAt(i);return}}this._replaceAt(i,r)};this._onNodeRemove=e=>{e.stopPropagation(),this._removeAt(e.detail.path)};this._onNodeWrap=e=>{e.stopPropagation(),this._wrapAt(e.detail.path)};this._onNodeAddChild=e=>{e.stopPropagation(),this._addChildAt(e.detail.path,"is")};this._onNodeToggleNot=e=>{e.stopPropagation(),this._toggleNotAt(e.detail.path)};this._onNodeSetOp=e=>{e.stopPropagation(),this._setGroupOpAt(e.detail.path,e.detail.op)};this._onNodeUnwrap=e=>{e.stopPropagation(),this._unwrapAt(e.detail.path)};this._onNodeOpen=e=>{if(e.stopPropagation(),this._openPath!==null){let i=this._atomAt(this._openPath);if(i&&this._atomError(i)!==null){this._showError=!0;return}}this._openPath!==null&&hi(this._openPath,e.detail.path)?this._openPath=null:this._openPath=e.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-drag-start",this._onNodeDragStart)}disconnectedCallback(){super.disconnectedCallback(),this._endDrag()}_emit(e){this.value=e,L(this,e)}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(e,i){let r=this._patch(this.value,e,()=>i);this._emit(r)}_removeAt(e){if(this._openPath=null,e.length===0){this._emit(null);return}let i=this._patch(this.value,e,()=>null);this._emit(i)}_wrapAt(e){let i=this._nodeAt(e),r="and";if(i&&(i.kind==="and"||i.kind==="or"))r=i.kind==="and"?"or":"and";else if(e.length>0){let s=this._nodeAt(e.slice(0,-1));s&&(s.kind==="and"||s.kind==="or")&&(r=s.kind==="and"?"or":"and")}let a=this._patch(this.value,e,s=>s&&{kind:r,items:[s]});this._emit(a)}_nodeAt(e){return this._walkNode(this.value,e)}_moveRelative(e,i){let r=this._resolveInsertion(e,i);r&&this._emit(this._rewriteInsert(this.value,[],e,r.destParent,r.insert,r.source))}_resolveInsertion(e,i){if(e.length===0||hi(e,i.path))return null;let r=this._nodeAt(e);if(!r)return null;if(i.pos==="into"){let s=pi(this._nodeAt(i.path));return!s||s.kind!=="and"&&s.kind!=="or"||this._isPrefix(e,i.path)?null:{destParent:i.path,insert:{kind:"into"},source:r}}if(i.path.length===0)return null;let a=i.path.slice(0,-1);return this._isPrefix(e,a)?null:{destParent:a,insert:{kind:i.pos,index:i.path[i.path.length-1]},source:r}}_isPrefix(e,i){return e.length>i.length?!1:e.every((r,a)=>r===i[a])}_rewriteInsert(e,i,r,a,s,d){if(!e)return e;if(e.kind==="not"){let f=this._rewriteInsert(e.item,i,r,a,s,d);return f==null?null:{kind:"not",item:f}}if(e.kind!=="and"&&e.kind!=="or")return e;let u=hi(i,r.slice(0,-1)),h=hi(i,a),p=[],_=-1;if(e.items.forEach((f,v)=>{if(u&&v===r[r.length-1])return;let x=this._rewriteInsert(f,[...i,v],r,a,s,d);x!==null&&(p.push(x),h&&s.kind!=="into"&&v===s.index&&(_=p.length-1))}),h){let f=s.kind==="into"||_<0?p.length:s.kind==="before"?_:_+1;p.splice(f,0,d)}return p.length===0?null:{...e,items:p}}_startDrag(e,i){this._endDrag(),this._dragFrom=e,this._dragOverPath=null,this._dragOverPos=null;let r=i.target?.closest(".atom-card, .group");this._cancelDrag=en(i,{onMove:(a,s)=>{let d=this._locateDropAt(a,s),u=d!==null&&this._resolveInsertion(e,d)!==null,h=u?d.path:null,p=u?d.pos:null;(!(hi(h,this._dragOverPath)||h===null&&this._dragOverPath===null)||p!==this._dragOverPos)&&(this._dragOverPath=h,this._dragOverPos=p)},onEnd:(a,s)=>{let d=this._locateDropAt(a,s);d&&this._moveRelative(e,d),this._endDrag()},onCancel:()=>this._endDrag()},{follow:r})}_endDrag(){this._cancelDrag?.(),this._cancelDrag=null,this._dragFrom=null,this._dragOverPath=null,this._dragOverPos=null}_nodeElementAt(e,i){let r=tn(e,i);for(;r;){if(r instanceof Element&&r.localName==="ambience-state-expr-node")return r;let a=r.parentNode;a?r=a:r instanceof ShadowRoot?r=r.host:r=null}return null}_locateDropAt(e,i){let r=this._nodeElementAt(e,i),a=r?.path;if(!r||!a)return null;let s=this._nodeAt([...a]),d=pi(s),u=!!d&&(d.kind==="and"||d.kind==="or"),h=this._zoneFor(r.getBoundingClientRect(),i,{isGroup:u,isRoot:a.length===0});return h?{path:[...a],pos:h}:null}_zoneFor(e,i,r){if(r.isRoot)return r.isGroup?"into":null;if(r.isGroup){let a=Math.min(8,e.height/3);return i<e.top+a?"before":i>e.bottom-a?"after":"into"}return i<e.top+e.height/2?"before":"after"}_walkNode(e,i){return e?e.kind==="not"?this._walkNode(e.item,i):i.length===0?e:e.kind==="and"||e.kind==="or"?this._walkNode(e.items[i[0]]??null,i.slice(1)):null:null}_addChildAt(e,i){let r=null,a=this._patch(this.value,e,s=>{if(!s)return s;let d=s.kind==="not",u=pi(s);if(u.kind==="and"||u.kind==="or"){let h=[...u.items,this._emptyAtom()];r=[...e,h.length-1];let p={...u,items:h};return d?{kind:"not",item:p}:p}return s});r!==null&&(this._openPath=r),this._emit(a)}_toggleNotAt(e){let i=this._patch(this.value,e,r=>r&&(r.kind==="not"?r.item:{kind:"not",item:r}));this._emit(i)}_setGroupOpAt(e,i){let r=this._patch(this.value,e,a=>{if(!a)return a;let s=a.kind==="not",d=s?a.item:a;if(d.kind!=="and"&&d.kind!=="or")return a;let u={kind:i,items:d.items};return s?{kind:"not",item:u}:u});this._emit(r)}_patch(e,i,r){if(i.length===0)return r(e);if(e==null)return e;let[a,...s]=i;if(e.kind==="and"||e.kind==="or"){let d=e.items.length,u=e.items.slice(),h=this._patch(u[a],s,r);if(h===null?u.splice(a,1):u[a]=h,u.length<d){if(u.length===0)return null;if(u.length===1)return u[0]}return{...e,items:u}}if(e.kind==="not"){let d=this._patch(e.item,i,r);return d==null?null:{kind:"not",item:d}}return e}_isEmptyAtom(e){if(e.kind==="not")return this._isEmptyAtom(e.item);if(e.kind==="and"||e.kind==="or")return!1;let i=e;return!i.entity_id&&i.states.every(r=>r==="")&&!i.attribute&&!i.for}_atomAt(e){return this._walk(this.value,e)}_walk(e,i){return e?e.kind==="not"?this._walk(e.item,i):i.length===0?e.kind==="and"||e.kind==="or"?null:e:e.kind==="and"||e.kind==="or"?this._walk(e.items[i[0]]??null,i.slice(1)):null:null}_treeError(e=this.value){return xn(e,this.hass)}_emitValidity(){let e=this._treeError();this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_atomError(e){return Oo(e,this.hass)}_unwrapAt(e){if(this._openPath=null,e.length===0){let s=this.value;if(!s)return;let d=pi(s);(d.kind==="and"||d.kind==="or")&&(d.items.length===1?this._emit(d.items[0]):this._emit(null));return}let i=e.slice(0,-1),r=e[e.length-1],a=this._patch(this.value,i,s=>{if(!s||s.kind!=="and"&&s.kind!=="or")return s;let d=s.items.slice(),u=d[r],h=null;if(u.kind==="and"||u.kind==="or")h=u;else if(u.kind==="not"){let p=u.item;(p.kind==="and"||p.kind==="or")&&(h=p)}return h?(d.splice(r,1,...h.items),{...s,items:d}):s});this._emit(a)}willUpdate(e){if(e.has("value")){let i=this.value;if(i&&this._openPath===null&&i.kind!=="and"&&i.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let r=this._atomAt(this._openPath);(!r||this._atomError(r)===null)&&(this._showError=!1)}this._emitValidity()}}_addAtRoot(){let e=this.value;if(e==null){this._addFirstAtom();return}if(e.kind==="and"||e.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[e,this._emptyAtom()]})}_setOpen(e){this._openPath=e}render(){if(this.value==null)return l`
        <div class="empty">
          <button @click=${()=>this._addFirstAtom()}>
            + ${o(this.hass,"ui.state_add_first","Add clause")}
          </button>
        </div>
      `;let e=this._showError&&this._openPath!==null?(()=>{let a=this._atomAt(this._openPath);return a?this._atomError(a):null})():null,i=pi(this.value),r=i.kind!=="and"&&i.kind!=="or";return l`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${this.value}
        .path=${[]}
        .openPath=${this._openPath}
        .dragOverPath=${this._dragOverPath}
        .dragOverPos=${this._dragOverPos}
        .dragFromPath=${this._dragFrom}
        .errorPath=${e?this._openPath:null}
        .errorMessage=${e}
      ></ambience-state-expr-node>
      ${r?l`
        <button class="root-add" @click=${()=>this._addAtRoot()}>
          + ${o(this.hass,"ui.state_add_condition","Add clause")}
        </button>
      `:""}
    `}};ae.styles=y`
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
  `,c([m({attribute:!1})],ae.prototype,"hass",2),c([m({attribute:!1})],ae.prototype,"value",2),c([g()],ae.prototype,"_openPath",2),c([g()],ae.prototype,"_showError",2),c([g()],ae.prototype,"_dragFrom",2),c([g()],ae.prototype,"_dragOverPath",2),c([g()],ae.prototype,"_dragOverPos",2),ae=c([w("ambience-state-predicate-input")],ae);var Wu=["everybody","anybody","nobody","any","all","none"],Fo=new Set(["any","all","none"]),zr={everybody:"everyone",anybody:"any",nobody:"nobody",any:"any",all:"everyone",none:"nobody"},ct=class extends b{constructor(){super(...arguments);this.value=null;this._lastSelected=[]}_persons(){return Pr(this.hass,"person")}_zones(){return Pr(this.hass,"zone")}_cur(){return this.value??{}}_who(){return this.value?.who??[]}_hasWhoKey(){return this.value!=null&&Array.isArray(this.value.who)}_defaultQuant(){return this.value==null?"everyone":"any"}_mode(){if(this._hasWhoKey())switch(this._cur().quant??"any"){case"any":return"any";case"everyone":return"all";case"nobody":return"none"}switch(this._cur().quant??this._defaultQuant()){case"nobody":return"nobody";case"any":return"anybody";default:return"everybody"}}_applyFor(e,i,r){if(Jt(i)){e.for=i;let a=Et(i,r);a&&(e.for_mode=a)}}_isNegativeQuant(){return zr[this._mode()]==="nobody"}_effectiveNegate(){return!this._isNegativeQuant()&&!!this._cur().negate}_emitMode(e){let i=this._cur(),r=i.where??"home",a={quant:zr[e],where:r};i.negate&&zr[e]!=="nobody"&&(a.negate=!0),Fo.has(e)&&(this._hasWhoKey()?a.who=[...this._who()]:this._lastSelected.length>0?a.who=[...this._lastSelected]:a.who=this._persons().map(s=>s.id)),this._applyFor(a,i.for,i.for_mode),this._emit(a)}_emit(e){this.value=e,L(this,e)}_setMode(e){this._emitMode(e)}_setWhere(e){let i=this._cur(),r={quant:i.quant??this._defaultQuant(),where:e};this._effectiveNegate()&&(r.negate=!0),this._hasWhoKey()&&(r.who=[...this._who()]),this._applyFor(r,i.for,i.for_mode),this._emit(r)}_setNegate(e){let i=this._cur(),r={quant:i.quant??this._defaultQuant(),where:i.where??"home"};e&&(r.negate=!0),this._hasWhoKey()&&(r.who=[...this._who()]),this._applyFor(r,i.for,i.for_mode),this._emit(r)}_togglePerson(e,i){let r=i?[...this._who(),e]:this._who().filter(d=>d!==e);r.length>0&&(this._lastSelected=[...r]);let a=this._cur(),s={quant:a.quant??"any",where:a.where??"home",who:r};this._effectiveNegate()&&(s.negate=!0),this._applyFor(s,a.for,a.for_mode),this._emit(s)}_setFor(e){let{mode:i,...r}=e,a=this._cur(),s={quant:a.quant??this._defaultQuant(),where:a.where??"home"};this._effectiveNegate()&&(s.negate=!0),this._hasWhoKey()&&(s.who=[...this._who()]),this._applyFor(s,r,i??"at_least"),this._emit(s)}_modeLabel(e){switch(e){case"everybody":return o(this.hass,"ui.people_mode_everybody","Everybody");case"anybody":return o(this.hass,"ui.people_mode_anybody","Anybody");case"nobody":return o(this.hass,"ui.people_mode_nobody","Nobody");case"any":return o(this.hass,"ui.people_mode_any","Any of:");case"all":return o(this.hass,"ui.people_mode_all","All of:");case"none":return o(this.hass,"ui.people_mode_none","None of:")}}_renderMode(e){return re(this.hass,"mode",e,Wu.map(i=>({value:i,label:this._modeLabel(i)})),i=>this._setMode(i))}_renderPeople(){let e=this._persons();if(e.length===0)return l`<div class="hint">${o(this.hass,"ui.people_none_tracked","No people tracked")}</div>`;let i=this._who();return l`<div class="people-list">
      ${e.map(r=>l`<label class="person-pill">
        <input
          type="checkbox"
          .checked=${i.includes(r.id)}
          @change=${a=>this._togglePerson(r.id,a.target.checked)}
        />${r.name}
      </label>`)}
    </div>
    <div class="field-error">${i.length===0?o(this.hass,"ui.people_select_one","Select at least one person"):""}</div>`}_renderNegate(e){return re(this.hass,"negate",e?"true":"false",[{value:"false",label:o(this.hass,"ui.people_is_at","Is at")},{value:"true",label:o(this.hass,"ui.people_is_not_at","Is not at")}],i=>this._setNegate(i==="true"))}_renderWhere(e){let i=this._zones().filter(r=>r.id!=="zone.home");return re(this.hass,"where",e,[{value:"home",label:o(this.hass,"ui.people_where_home","Home")},...i.map(r=>({value:r.id,label:r.name}))],r=>this._setWhere(r))}_renderFor(){return l`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this._cur().for??null}
      .mode=${this._cur().for_mode??"at_least"}
      @value-changed=${e=>{e.stopPropagation(),this._setFor(e.detail.value)}}
    ></ambience-for-duration>`}render(){let i=this._cur().where??"home",r=this._mode(),a=!this._isNegativeQuant(),s=this._effectiveNegate();return l`
      <div class="row">${this._renderMode(r)}</div>
      ${Fo.has(r)?this._renderPeople():""}
      <div class="row">
        ${a?this._renderNegate(s):l`<span class="label negate-static">${o(this.hass,"ui.people_is_at_static","is at")}</span>`}
        ${this._renderWhere(i)}
      </div>
      <div class="row">
        <span class="label">${o(this.hass,"ui.people_for","for")}</span>
        ${this._renderFor()}
      </div>
    `}};ct.styles=y`
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
  `,c([m({attribute:!1})],ct.prototype,"hass",2),c([m({attribute:!1})],ct.prototype,"value",2),ct=c([w("ambience-people-predicate-input")],ct);var ut=class extends b{constructor(){super(...arguments);this.value=null}_cur(){return this.value??{sensors:[]}}_sensors(){return this._cur().sensors??[]}_showQuant(){return this._sensors().length>1}_build(e){let i={...this._cur(),...e},r={sensors:i.sensors??[]};if(i.occupied===!1&&(r.occupied=!1),i.quant==="all"&&(r.quant="all"),Jt(i.for)){r.for=i.for;let a=Et(i.for,i.for_mode);a&&(r.for_mode=a)}return i.negate===!0&&(r.negate=!0),r}_emit(e){this.value=e,L(this,e)}_setSensors(e){this._emit(e.length?this._build({sensors:e}):null)}_setOccupied(e){this._emit(this._build({occupied:e}))}_setNegate(e){this._emit(this._build({negate:e}))}_setQuant(e){this._emit(this._build({quant:e}))}_setFor(e){let{mode:i,...r}=e;this._emit(this._build({for:r,for_mode:i??"at_least"}))}_sensorSchema(){return[{name:"sensors",selector:{entity:{domain:"binary_sensor",device_class:["occupancy","presence","motion"],multiple:!0}}}]}_renderSensors(){return It(this.hass,this._sensorSchema(),this._sensors(),"binary_sensor.a, binary_sensor.b",e=>this._setSensors(e))}_renderNegate(e){return re(this.hass,"negate",e?"is_not":"is",[{value:"is",label:o(this.hass,"ui.occupancy_is","is")},{value:"is_not",label:o(this.hass,"ui.occupancy_is_not","is not")}],i=>this._setNegate(i==="is_not"))}_renderOccupied(e){return re(this.hass,"state",e?"occupied":"vacant",[{value:"occupied",label:o(this.hass,"ui.occupancy_detected","Detected")},{value:"vacant",label:o(this.hass,"ui.occupancy_clear","Clear")}],i=>this._setOccupied(i==="occupied"))}_renderQuant(e){return re(this.hass,"quant",e,[{value:"any",label:o(this.hass,"ui.occupancy_any","Any of")},{value:"all",label:o(this.hass,"ui.occupancy_all","All of")}],i=>this._setQuant(i))}_renderFor(){return l`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this._cur().for??null}
      .mode=${this._cur().for_mode??"at_least"}
      @value-changed=${e=>{e.stopPropagation(),this._setFor(e.detail.value)}}
    ></ambience-for-duration>`}render(){let e=this._cur(),i=e.occupied!==!1,r=e.negate===!0,a=e.quant==="all"?"all":"any";return l`
      ${this._showQuant()?l`<div class="row">${this._renderQuant(a)}</div>`:""}
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._renderNegate(r)}
        ${this._renderOccupied(i)}
      </div>
      <div class="row">
        <span class="label">${o(this.hass,"ui.occupancy_for","for")}</span>
        ${this._renderFor()}
      </div>
    `}};ut.styles=y`
    :host { display: block; }
    .row {
      display: flex; flex-wrap: wrap; align-items: center;
      gap: 0.5rem; margin-bottom: 0.6rem;
    }
    .label { color: var(--secondary-text-color, #888); font-size: 0.9em; }
    select, input[type="number"], input[type="text"] {
      padding: 0.25rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
    .field { width: 100%; }
    .for-row { display: flex; gap: 0.25rem; align-items: center; }
    .for-row input[type='number'] { width: 3.5rem; }
  `,c([m({attribute:!1})],ut.prototype,"hass",2),c([m({attribute:!1})],ut.prototype,"value",2),ut=c([w("ambience-occupancy-predicate-input")],ut);function jo(t,n){if(t==null)return null;let e=t.entities;return!Array.isArray(e)||e.length===0?o(n,"ui.unavailable_select_one","Select at least one entity"):null}var Bu=[{name:"sensors",selector:{entity:{multiple:!0}}}],ht=class extends b{constructor(){super(...arguments);this.value=null}_entities(){return this.value?.entities??[]}_setEntities(e){let i=e.length?{entities:e}:null;this.value=i,L(this,i)}render(){return l`
      <div class="row">
        ${It(this.hass,Bu,this._entities(),"binary_sensor.a, light.b",e=>this._setEntities(e))}
      </div>
    `}};ht.styles=y`
    :host {
      display: block;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.6rem;
    }
    .field {
      width: 100%;
    }
    input[type="text"] {
      padding: 0.25rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
    }
  `,c([m({attribute:!1})],ht.prototype,"hass",2),c([m({attribute:!1})],ht.prototype,"value",2),ht=c([w("ambience-unavailable-predicate-input")],ht);var Vu=new Set(["1","true","yes","on","enable"]);function qo(t){return t==null?!1:typeof t=="boolean"?t:typeof t=="number"?t!==0:typeof t=="string"?Vu.has(t.toLowerCase().trim()):!1}function Gu(t){if(t!==null&&typeof t=="object")try{return JSON.stringify(t)}catch{return String(t)}return String(t)}var Be=class extends b{constructor(){super(...arguments);this.value=null;this._preview=null;this._debounceMs=250;this._gen=0}_template(){return this.value&&typeof this.value=="object"?this.value.template:""}willUpdate(e){if(!e.has("value")&&!e.has("hass"))return;let i=this._template(),r=this.hass?.connection;i===this._activeTemplate&&r===this._activeConn||(this._activeTemplate=i,this._activeConn=r,this._scheduleRender())}disconnectedCallback(){super.disconnectedCallback(),this._teardown()}_teardown(){this._debounceTimer!=null&&(clearTimeout(this._debounceTimer),this._debounceTimer=void 0),this._unsub&&(this._unsub(),this._unsub=void 0)}_scheduleRender(){this._teardown();let e=this._template();if(!e.trim()||!this.hass?.connection?.subscribeMessage){this._setPreview(null);return}let i=++this._gen;this._debounceTimer=setTimeout(()=>this._subscribe(e,i),this._debounceMs)}async _subscribe(e,i){let r=this.hass?.connection;if(r?.subscribeMessage)try{let a=await r.subscribeMessage(s=>{i===this._gen&&this._setPreview(s.error!=null?{error:s.error}:{value:Gu(s.result),truthy:qo(s.result)})},{type:"render_template",template:e,report_errors:!0});if(i!==this._gen){a();return}this._unsub=a}catch(a){if(i!==this._gen)return;this._setPreview({error:a?.message??String(a)})}}_setPreview(e){this._preview=e,this._emitValidity(e!=null&&"error"in e?e.error:null)}_emitValidity(e){this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_onInput(e){let i=e.target.value,r=i.trim()===""?null:{template:i};this.value=r,L(this,r)}_renderPreview(){let e=this._preview;return e==null?"":"error"in e?l`<div class="preview error">
        <div class="body">
          <span class="label">${o(this.hass,"ui.template_result","Result")}</span><span class="value">${e.error}</span>
        </div>
      </div>`:l`<div class="preview">
      <div class="body">
        <span class="label">${o(this.hass,"ui.template_result","Result")}</span><span class="value">${e.value}</span>
      </div>
      <span class="bool ${e.truthy?"true":"false"}"
        >${e.truthy?o(this.hass,"ui.template_truthy","true \u2014 matches"):o(this.hass,"ui.template_falsy","false \u2014 no match")}</span
      >
    </div>`}render(){return l`
      <textarea
        spellcheck="false"
        .value=${this._template()}
        placeholder="{{ is_state('binary_sensor.guests','on') }}"
        @input=${this._onInput}
      ></textarea>
      ${this._renderPreview()}
    `}};Be.styles=y`
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
  `,c([m({attribute:!1})],Be.prototype,"value",2),c([m({attribute:!1})],Be.prototype,"hass",2),c([g()],Be.prototype,"_preview",2),Be=c([w("ambience-template-predicate-input")],Be);var se=class extends b{constructor(){super(...arguments);this.value=null;this._onChild=e=>{e.stopPropagation(),this._emit(e.detail.value)}}_emit(e){L(this,e)}_onText(e){let i=e.target.value;this._emit(i.trim()===""?null:i)}render(){return this.condition.input==="time_of_day"?l`
        <ambience-time-of-day-input
          .value=${this.value}
          .periods=${this.periods}
          .hass=${this.hass}
          @value-changed=${this._onChild}
        ></ambience-time-of-day-input>
      `:this.condition.input==="script_predicate"?l`
        <ambience-script-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-script-predicate-input>
      `:this.condition.input==="day_predicate"?l`
        <ambience-day-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .dayConfig=${this.dayConfig??{workday_sensor:null,workday_calendar:null}}
          @value-changed=${this._onChild}
        ></ambience-day-predicate-input>
      `:this.condition.input==="weather_predicate"?l`
        <ambience-weather-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .groups=${this.weatherConfig?.groups??[]}
          .weatherEntity=${this.weatherConfig?.entity??void 0}
          @value-changed=${this._onChild}
        ></ambience-weather-predicate-input>
      `:this.condition.input==="sun_predicate"?l`
        <ambience-sun-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-sun-predicate-input>
      `:this.condition.input==="template_predicate"?l`
        <ambience-template-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-template-predicate-input>
      `:this.condition.input==="state_predicate"?l`
        <ambience-state-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-state-predicate-input>
      `:this.condition.input==="people_predicate"?l`
        <ambience-people-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-people-predicate-input>
      `:this.condition.input==="lux"?l`
        <ambience-lux-input
          .hass=${this.hass}
          .value=${this.value}
          .luxRanges=${this.luxRanges}
          @value-changed=${this._onChild}
        ></ambience-lux-input>
      `:this.condition.input==="occupancy_predicate"?l`
        <ambience-occupancy-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-occupancy-predicate-input>
      `:this.condition.input==="unavailable_predicate"?l`
        <ambience-unavailable-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-unavailable-predicate-input>
      `:l`
      <input
        type="text"
        placeholder=${o(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.condition.predicate_help}</div>
    `}};se.styles=y`
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
  `,c([m({attribute:!1})],se.prototype,"condition",2),c([m({attribute:!1})],se.prototype,"value",2),c([m({attribute:!1})],se.prototype,"periods",2),c([m({attribute:!1})],se.prototype,"luxRanges",2),c([m({attribute:!1})],se.prototype,"dayConfig",2),c([m({attribute:!1})],se.prototype,"weatherConfig",2),c([m({attribute:!1})],se.prototype,"hass",2),se=c([w("ambience-condition-input")],se);function Ku(t){return t!=null&&typeof t=="object"&&Array.isArray(t.who)&&t.who.length===0}function Yu(t){return t==="people"?{quant:"everyone",where:"home"}:null}function Uo(t,n){return!!t&&!!n&&A(t)===A(n)}var Qu={state:Mo,day:Io,lux:Ro,unavailable:jo},E=class extends b{constructor(){super(...arguments);this.open=!1;this.scene=null;this.conditions=[];this.availableActions=[];this.categories=[];this.schemas={};this.scopes=[];this.takenNames=new Map;this.saveError="";this.scopeChangedElsewhere=!1;this._staleAcknowledged=!1;this._draft=null;this._open=null;this._showError=!1;this._addOrder=[];this._serviceHasTarget=new Map;this._conditionError=new Map;this._onNameInput=e=>{this._setName(e.target.value)};this._onDescriptionInput=e=>{this._setDescription(e.target.value)};this._onDescriptionHaForm=e=>{e.stopPropagation(),this._setDescription(e.detail.value.description??"")};this._descriptionLabel=()=>o(this.hass,"ui.description","Description");this._onAddCondition=e=>{let i=e.target,r=i.value;i.value="",this._addCondition(r)};this._onAddConditionHaForm=e=>{e.stopPropagation();let i=e.detail.value.add;i!==E._ADD_CONDITION_PLACEHOLDER&&this._addCondition(i)};this._onAddAction=e=>{let i=e.target,r=i.value;i.value="",this._addActionSlot(r)};this._onAddActionHaForm=e=>{e.stopPropagation();let i=e.detail.value.add;i!==E._ADD_ACTION_PLACEHOLDER&&this._addActionSlot(i)};this._onApplyToggle=e=>{if(!this._draft)return;let i={...this._draft};e.target.checked?i.apply="always":delete i.apply,this._draft=i}}_onConditionInvalid(e,i){i?this._conditionError.set(e,i):this._conditionError.delete(e)}connectedCallback(){super.connectedCallback(),ie(this)}willUpdate(e){e.has("open")&&this.open&&(this._draft=this.scene?JSON.parse(JSON.stringify(this.scene)):null,this._scope=this.scope,this._open=null,this._showError=!1,this._addOrder=[],this._conditionError=new Map,this._staleAcknowledged=!1),e.has("scopeChangedElsewhere")&&!this.scopeChangedElsewhere&&(this._staleAcknowledged=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_setDestination(e){let i=this.scopes[e];if(!i||!this._draft||(this._scope=i.scope,!this.hass))return;let r=new Set(Qi(this.hass,this._scope,[]));this._draft={...this._draft,actions:this._draft.actions.map(a=>({...a,entity_ids:a.entity_ids.filter(s=>r.has(s))}))}}_renderDestination(){return l`
      <div class="scope-menu" role="listbox">
        ${this.scopes.map((e,i)=>l`<button
            class="scope-option"
            role="option"
            aria-selected=${Uo(e.scope,this._scope)}
            @click=${()=>{this._setDestination(i),this._open=null}}
          >
            <ha-icon class="scope-icon" icon=${Qt(e.scope,this.hass)}></ha-icon>
            <span class="scope-name">${e.label}</span>
          </button>`)}
      </div>
    `}_renderDestinationSlot(){if(this.scopes.length===0)return"";if(this._isOpen({kind:"destination"}))return l`
        <div class="slot destination-slot expanded" data-slot-id="destination">
          ${this._renderDestination()}
        </div>
      `;let e=this.scopes.find(i=>Uo(i.scope,this._scope))??this.scopes[0];return l`
      <div class="slot collapsed" data-slot-id="destination">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"destination"})}>
          <strong>${o(this.hass,"ui.scope","Scope")}:</strong>
          <ha-icon class="scope-icon" icon=${Qt(e.scope,this.hass)}></ha-icon>
          <span class="scope-name">${e.label}</span>
        </div>
      </div>
    `}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"})){let a=this._showError?this._nameError():null;return l`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
          ${a?l`<div class="error">${a}</div>`:""}
        </div>
      `}let r=on(this._draft,o(this.hass,"ui.new_scene","New scene"));return l`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${r}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let i=ra();return i==="ha-input"?l`<ha-input label=${o(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:i==="ha-textfield"?l`<ha-textfield label=${o(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:l`<input type="text" .value=${e} @input=${this._onNameInput} />`}_setDescription(e){this._draft&&(this._draft={...this._draft,description:e.trim()?e:void 0})}_renderDescriptionHaForm(e){return l`
      <ha-form
        .hass=${this.hass}
        .schema=${E._DESCRIPTION_SCHEMA}
        .data=${{description:e}}
        .computeLabel=${this._descriptionLabel}
        @value-changed=${this._onDescriptionHaForm}
      ></ha-form>
    `}_renderDescriptionEditor(e){return customElements.get("ha-form")?this._renderDescriptionHaForm(e):l`<textarea
      class="description-input"
      .value=${e}
      autofocus
      rows="3"
      placeholder=${o(this.hass,"ui.description","Description")}
      @input=${this._onDescriptionInput}
    ></textarea>`}_renderDescriptionSlot(){let e=this._draft.description??"";return this._isOpen({kind:"description"})?l`
        <div class="slot description-slot expanded" data-slot-id="description">
          ${this._renderDescriptionEditor(e)}
        </div>
      `:e.trim()?l`
        <div class="slot collapsed" data-slot-id="description">
          <div class="summary" @click=${()=>this._toggleSlot({kind:"description"})}>
            <span class="summary-label description-text">${e}</span>
          </div>
        </div>
      `:l`
      <div class="add-description-row" data-slot-id="description">
        <button class="add-description" @click=${()=>this._toggleSlot({kind:"description"})}>
          ${o(this.hass,"ui.add_description","+ Add description")}
        </button>
      </div>
    `}_setCategory(e){!this._draft||!e||e===this._draft.category||(this._draft={...Yt(this._draft),category:e})}_renderCategorySlot(){if(this.categories.length===0)return"";let e=[...this.categories].sort((a,s)=>a.name.localeCompare(s.name)),i=this._effectiveCategoryId(),r=this.categories.find(a=>a.id===i)??e[0];return this._isOpen({kind:"category"})?l`
        <div class="slot category-slot expanded" data-slot-id="category">
          <div class="category-menu" role="listbox">
            ${e.map(a=>l`<button
                class="category-option"
                role="option"
                aria-selected=${a.id===i}
                @click=${()=>{this._setCategory(a.id),this._open=null}}
              >
                ${bt(a.color,a.icon)}
                <span class="category-name">${a.name}</span>
              </button>`)}
          </div>
        </div>
      `:l`
      <div class="slot collapsed" data-slot-id="category">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"category"})}>
          <strong>${o(this.hass,"ui.category","Category")}:</strong>
          ${bt(r.color,r.icon)}
          <span class="category-name">${r.name}</span>
        </div>
      </div>
    `}_isOpen(e){let i=this._open;return i===null||i.kind!==e.kind?!1:e.kind==="condition"&&i.kind==="condition"?e.id===i.id:e.kind==="action"&&i.kind==="action"?e.idx===i.idx:!0}_effectiveCategoryId(){return this._draft?.category?this._draft.category:[...this.categories].sort((i,r)=>i.name.localeCompare(r.name))[0]?.id??""}_nameError(){let e=this._draft?.name?.trim().toLowerCase();if(!e||!this._scope)return null;let i=Yi(this._scope,this._effectiveCategoryId());return this.takenNames.get(i)?.has(e)?o(this.hass,"ui.name_duplicate","A scene with this name already exists in this category."):null}_validationError(e){if(e===null||e.kind==="category"||e.kind==="destination"||e.kind==="description")return null;if(e.kind==="name")return this._nameError();if(e.kind==="condition"){let a=this._draft?.when[e.id];if(Ku(a))return o(this.hass,"ui.people_select_one","Select at least one person");let s=Qu[e.id]?.(a,this.hass);return s||(this._conditionError.has(e.id)?o(this.hass,"ui.condition_error","Fix the error in this condition before continuing"):null)}let i=this._draft?.actions[e.idx];if(!i)return null;let r=this._serviceHasTarget.get(i.service);return i.entity_ids.length===0&&r===!0?o(this.hass,"ui.at_least_one_target","At least one target is required."):null}_leaveBlockingError(e){return e?.kind==="name"?null:this._validationError(e)}_tryCloseCurrent(){return this._open===null?!0:this._leaveBlockingError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){if(this._leaveBlockingError(e)!==null){this._showError=!0;return}this._open=null,this._showError=!1;return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let i of e.composedPath())if(i instanceof Element&&(i.classList.contains("slot")||i.classList.contains("actions-bar")||i.classList.contains("add-condition")||i.classList.contains("add-action")||i.classList.contains("add-description")))return;this._tryCloseCurrent()}_setPredicate(e,i){if(!this._draft)return;let r={...this._draft.when};i==null?delete r[e]:r[e]=i,this._draft={...this._draft,when:r}}_renderConditionRow(e){let i=this._draft.when[e.name]??null,r=this._isOpen({kind:"condition",id:e.name}),a=Lt(e.name,i,{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges});return l`
      <div class="slot ${r?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"condition",id:e.name})}>
          <span class="summary-label"><strong>${K(this.hass,e.name)}:</strong> ${a}</span>
          <ambience-help .hass=${this.hass} .docPath=${Xi(e.name)??""}></ambience-help>
          <button
            class="remove"
            @click=${s=>{s.stopPropagation(),this._removeCondition(e.name)}}
            title=${o(this.hass,"ui.remove_condition","Remove condition")}
          >✕</button>
        </div>
        ${r?l`
          <div class="body">
            <ambience-condition-input
              .hass=${this.hass}
              .condition=${e}
              .value=${i}
              .periods=${this.periods}
              .luxRanges=${this.luxRanges}
              .dayConfig=${this.dayConfig}
              .weatherConfig=${this.weatherConfig}
              @value-changed=${s=>this._setPredicate(e.name,s.detail.value)}
              @render-invalid-changed=${s=>this._onConditionInvalid(e.name,s.detail.error)}
            ></ambience-condition-input>

            ${this._showError&&this._validationError({kind:"condition",id:e.name})?l`
              <div class="error">${this._validationError({kind:"condition",id:e.name})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_visibleConditions(){if(!this._draft)return[];let e=this._draft.when,i=this.conditions.filter(d=>d.name in e&&e[d.name]!=null||this._open?.kind==="condition"&&this._open.id===d.name),r=new Set(this._addOrder),a=i.filter(d=>!r.has(d.name)),s=this._addOrder.map(d=>i.find(u=>u.name===d)).filter(d=>d!=null);return[...a,...s]}_unusedConditions(){let e=new Set(this._visibleConditions().map(i=>i.name));return this.conditions.filter(i=>!e.has(i.name)).sort((i,r)=>K(this.hass,i.name).localeCompare(K(this.hass,r.name)))}_addCondition(e){if(!e||this._open!==null&&!this._tryCloseCurrent())return;let i=Yu(e);i!=null&&this._draft&&!(e in this._draft.when)&&(this._draft={...this._draft,when:{...this._draft.when,[e]:i}}),this._addOrder=[...this._addOrder.filter(r=>r!==e),e],this._open={kind:"condition",id:e},this._showError=!1}_removeCondition(e){if(!this._draft)return;let i={...this._draft.when};delete i[e],this._draft={...this._draft,when:i},this._conditionError.delete(e),this._open?.kind==="condition"&&this._open.id===e&&(this._open=null,this._showError=!1)}_conditionDisabled(e){return e==="weather"&&!this.weatherConfig?.entity}_renderAddCondition(){let e=this._unusedConditions();return e.length===0?"":customElements.get("ha-form")?this._renderAddConditionHaForm(e):l`
      <div class="add-condition">
        <select class="add-condition" @change=${this._onAddCondition}>
          <option value="">${o(this.hass,"ui.add_condition","+ Add condition\u2026")}</option>
          ${e.map(i=>l`<option value=${i.name} ?disabled=${this._conditionDisabled(i.name)}>${K(this.hass,i.name)}</option>`)}
        </select>
      </div>
    `}_renderAddConditionHaForm(e){let i=o(this.hass,"ui.add_condition","+ Add condition\u2026"),r=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:E._ADD_CONDITION_PLACEHOLDER,label:i},...e.map(a=>({value:a.name,label:K(this.hass,a.name),disabled:this._conditionDisabled(a.name)}))]}}}];return l`
      <div class="add-condition">
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{add:E._ADD_CONDITION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddConditionHaForm}
        ></ha-form>
      </div>
    `}_addActionSlot(e){if(!this._draft||!e||this._open!==null&&!this._tryCloseCurrent())return;let i={service:e,entity_ids:[],params:{}},r=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,i]},this._open={kind:"action",idx:r},this._showError=!1}_actionOptionLabel(e){return e.label?.trim()?e.label:this.schemas[e.id]?.name?.trim()||e.id}_renderAddAction(){return this.availableActions.length===0?l`
        <p class="add-action-empty">
          ${o(this.hass,"ui.no_exposed_actions","Add services in Settings \u2192 Actions.")}
        </p>
      `:customElements.get("ha-form")?this._renderAddActionHaForm():l`
      <div class="add-action">
        <select class="add-action" @change=${this._onAddAction}>
          <option value="">${o(this.hass,"ui.add_action","+ Add action\u2026")}</option>
          ${this.availableActions.map(e=>l`
            <option value=${e.id}>${this._actionOptionLabel(e)}</option>
          `)}
        </select>
      </div>
    `}_renderAddActionHaForm(){let e=o(this.hass,"ui.add_action","+ Add action\u2026"),i=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:E._ADD_ACTION_PLACEHOLDER,label:e},...this.availableActions.map(r=>({value:r.id,label:this._actionOptionLabel(r)}))]}}}];return l`
      <div class="add-action">
        <ha-form
          .hass=${this.hass}
          .schema=${i}
          .data=${{add:E._ADD_ACTION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddActionHaForm}
        ></ha-form>
      </div>
    `}_renderApply(){return l`
      <div class="apply-control">
        <label>
          ${o(this.hass,"ui.apply_on_every_match","Apply on every match")}
          <ambience-help
            .hass=${this.hass}
            .text=${o(this.hass,"ui.help_apply_on_every_match","When on, Ambience re-applies this scene's actions every time it wins its scope/category, not just the first time it becomes the active scene.")}
            .docPath=${"reference/actions/apply-on-every-match"}
          ></ambience-help>
        </label>
        ${kt({checked:this._draft.apply==="always",dataTest:"apply-on-every-match",onChange:this._onApplyToggle})}
      </div>
    `}_updateActionAt(e,i){if(!this._draft)return;let r=this._draft.actions.map((a,s)=>s===e?i(a):a);this._draft={...this._draft,actions:r}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((i,r)=>r!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,i){this._updateActionAt(e,r=>({...r,entity_ids:i}))}_setActionParams(e,i){this._updateActionAt(e,r=>({...r,params:i}))}_onTargetModeChanged(e,i){this._serviceHasTarget.get(e)!==i&&(this._serviceHasTarget=new Map(this._serviceHasTarget).set(e,i))}_renderActionRow(e,i){let r=this.availableActions.find(u=>u.id===e.service),a=this._isOpen({kind:"action",idx:i}),s=js(e,{hass:this.hass,exposedActions:this.availableActions,schemas:this.schemas}),d=r===void 0?o(this.hass,"ui.action_unavailable","Action no longer available; configure it in Settings \u2192 Actions or remove this action."):null;return l`
      <div class="slot ${a?"expanded":"collapsed"}" data-slot-id="action-${i}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:i})}>
          ${d?l`<ambience-problem-flag
                  .severity=${"error"}
                  .summary=${d}
                  .details=${[d]}
                ></ambience-problem-flag>`:""}
          <span class="summary-label">${s}</span>
          <button class="remove" @click=${u=>{u.stopPropagation(),this._deleteAction(i)}} title=${o(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${a?l`
          <div class="body">
            <ambience-action-slot
              .hass=${this.hass}
              .scope=${this._scope}
              .service=${e.service}
              .exposed=${r}
              .entityIds=${e.entity_ids}
              .excludeEntities=${Ss(this._draft?.actions??[],i)}
              .params=${e.params}
              @entity-ids-changed=${u=>{u.stopPropagation(),this._setActionTargets(i,u.detail.entityIds)}}
              @params-changed=${u=>{u.stopPropagation(),this._setActionParams(i,u.detail.params)}}
              @target-mode-changed=${u=>{u.stopPropagation(),this._onTargetModeChanged(e.service,u.detail.hasTarget)}}
            ></ambience-action-slot>

            ${this._showError&&this._validationError({kind:"action",idx:i})?l`
              <div class="error">${this._validationError({kind:"action",idx:i})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_save(){if(!this._draft)return;if(this._nameError()!==null){this._showError=!0,this._open={kind:"name"};return}for(let i of Object.keys(this._draft.when))if(this._draft.when[i]!=null&&this._validationError({kind:"condition",id:i})!==null){this._showError=!0,this._open={kind:"condition",id:i};return}for(let i=0;i<this._draft.actions.length;i++)if(this._validationError({kind:"action",idx:i})!==null){this._showError=!0,this._open={kind:"action",idx:i};return}let e=Object.fromEntries(Object.entries(this._draft.when).filter(([,i])=>i!=null));this.dispatchEvent(new CustomEvent("save-scene",{detail:{scene:{...this._draft,when:e},scope:this._scope},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-scene",{bubbles:!0,composed:!0}))}_overwriteTheirs(){this._staleAcknowledged=!0}_loadTheirs(){this._cancel()}_renderConflictDialog(){return!this.scopeChangedElsewhere||this._staleAcknowledged?"":l`
      <div class="conflict-backdrop" @click=${e=>e.stopPropagation()}>
        <div class="conflict-dialog" role="alertdialog" aria-modal="true">
          <p>
            ${o(this.hass,"ui.history_conflict_body","Another tab changed the scenes in this scope while you were editing.")}
          </p>
          <div class="conflict-actions">
            <button class="secondary conflict-load" @click=${this._loadTheirs}>
              ${o(this.hass,"ui.history_conflict_load","Load theirs")}
            </button>
            <button class="primary conflict-overwrite" @click=${this._overwriteTheirs}>
              ${o(this.hass,"ui.history_conflict_overwrite","Overwrite theirs")}
            </button>
          </div>
        </div>
      </div>
    `}render(){if(!this._draft)return l``;let e=this._visibleConditions();return l`
      <div class="modal" @click=${this._onModalClick}>
        <div class="content">
          ${this._renderNameSlot()}
          ${this._renderCategorySlot()}
          ${this._renderDestinationSlot()}
          ${this._renderDescriptionSlot()}

          <h3>${o(this.hass,"ui.when_heading","When")}</h3>
          ${e.map(i=>this._renderConditionRow(i))}
          ${this._renderAddCondition()}

          <h3>${o(this.hass,"ui.actions_heading","Actions")}</h3>
          ${this._draft.actions.map((i,r)=>this._renderActionRow(i,r))}
          ${this._renderAddAction()}
          ${this._renderApply()}
        </div>

        <div class="actions-bar">
          ${this.saveError?l`<div class="error save-error">${this.saveError}</div>`:""}
          <button class="secondary" @click=${this._cancel}>${o(this.hass,"ui.cancel","Cancel")}</button>
          <button class="primary" @click=${this._save}>${o(this.hass,"ui.save_scene","Save scene")}</button>
        </div>
        ${this._renderConflictDialog()}
      </div>
    `}};E.styles=[Ui,y`
    :host {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 100;
      /* Centre the fixed-height modal so it leaves a little space above and
         below the viewport edges, matching the config (settings) modal. */
      align-items: center; justify-content: center;
      --category-swatch-size: 1.75rem;
      --category-swatch-icon-size: 18px;
    }
    :host([open]) { display: flex; }
    .modal {
      background: var(--card-background-color, #fff); color: inherit;
      width: 90%; max-width: 40rem;
      height: calc(100vh - 24px);
      display: flex; flex-direction: column;
      /* Positioning context for the conflict dialog overlay. */
      position: relative;
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
    input, select, textarea {
      width: 100%; box-sizing: border-box; padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
    }
    textarea.description-input {
      font: inherit; resize: vertical; min-height: 4rem;
    }
    /* Reset chrome so the description slot's expanded editor matches the
       borderless name-slot variant. */
    .slot.description-slot.expanded {
      border: none; padding: 0; margin-bottom: 0.5rem;
    }
    /* "+ Add description" link affordance (no field chrome). */
    .add-description-row { margin-bottom: 0.5rem; }
    .add-description {
      background: none; border: none; padding: 0.25rem 0;
      color: var(--primary-color, #03a9f4);
      cursor: pointer; font: inherit; font-size: 0.9rem; width: auto;
    }
    /* Read-only display preserves the description's line breaks. */
    .summary-label.description-text { white-space: pre-wrap; }
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
      display: flex; justify-content: flex-end; align-items: center; gap: 0.5rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      flex-shrink: 0;
    }
    /* Push the save error to the left so the Cancel/Save buttons stay right. */
    .actions-bar .save-error { margin-right: auto; margin-top: 0; }
    select.add-condition, select.add-action {
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
    /* Label on the left, switch on the right — mirrors the settings toggle rows. */
    .apply-control {
      display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
      margin-top: 1rem;
    }
    .apply-control label { margin: 0; }
    .error {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      margin-top: 0.5rem;
      padding: 0.3rem 0;
    }
    /* Blocking "changed in another tab" conflict dialog, overlaying the editor
       so the user must choose to overwrite or load the latest. */
    .conflict-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 1;
    }
    .conflict-dialog {
      background: var(--card-background-color, #fff);
      color: inherit;
      border: 1px solid var(--warning-color, #ffa600);
      border-radius: 8px;
      max-width: 22rem;
      padding: 1rem 1.25rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    }
    .conflict-dialog p {
      margin: 0 0 1rem 0;
    }
    .conflict-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
    /* Scope icon in the destination summary + option list — matches the
       scope-header icon (HA's area/floor icon, or a per-kind default). */
    .scope-icon {
      flex: 0 0 auto;
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color, #888);
      vertical-align: middle;
    }
    .scope-name { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    /* Scope picker: the option list shown directly when expanded, each with its
       scope icon. Mirrors the category menu (native/ha-form selects can't carry
       per-option icons, and HA's icon-capable lists churn across versions). */
    .scope-menu { display: flex; flex-direction: column; gap: 0.15rem; padding: 0.35rem; }
    .scope-option {
      display: flex; align-items: center; gap: 0.6rem; width: 100%;
      min-height: 40px; box-sizing: border-box;
      padding: 0.3rem 0.5rem; border: 0; border-radius: 6px;
      background: none; color: var(--primary-text-color, inherit);
      cursor: pointer; font: inherit; font-size: 1rem; text-align: left;
    }
    .scope-option:hover { background: var(--secondary-background-color, #f5f5f5); }
    .scope-option[aria-selected="true"] {
      background: var(--secondary-background-color, #eee); font-weight: 600;
    }
    /* Category field: colour-coded swatch + icon (shell from categorySwatchStyles),
       matching the scenes-list filter. */
    .category-name { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    .category-menu { display: flex; flex-direction: column; gap: 0.15rem; padding: 0.35rem; }
    .category-option {
      display: flex; align-items: center; gap: 0.6rem; width: 100%;
      min-height: 40px; box-sizing: border-box;
      padding: 0.3rem 0.5rem; border: 0; border-radius: 6px;
      background: none; color: var(--primary-text-color, inherit);
      cursor: pointer; font: inherit; font-size: 1rem; text-align: left;
    }
    .category-option:hover { background: var(--secondary-background-color, #f5f5f5); }
    .category-option[aria-selected="true"] {
      background: var(--secondary-background-color, #eee); font-weight: 600;
    }
  `],E._DESCRIPTION_SCHEMA=[{name:"description",selector:{text:{multiline:!0}}}],E._ADD_CONDITION_PLACEHOLDER="__add_condition__",E._ADD_ACTION_PLACEHOLDER="__add_action__",c([m({type:Boolean,reflect:!0})],E.prototype,"open",2),c([m({attribute:!1})],E.prototype,"scene",2),c([m({attribute:!1})],E.prototype,"conditions",2),c([m({attribute:!1})],E.prototype,"periods",2),c([m({attribute:!1})],E.prototype,"luxRanges",2),c([m({attribute:!1})],E.prototype,"dayConfig",2),c([m({attribute:!1})],E.prototype,"weatherConfig",2),c([m({attribute:!1})],E.prototype,"availableActions",2),c([m({attribute:!1})],E.prototype,"categories",2),c([m({attribute:!1})],E.prototype,"schemas",2),c([m({attribute:!1})],E.prototype,"hass",2),c([m({attribute:!1})],E.prototype,"scope",2),c([m({attribute:!1})],E.prototype,"scopes",2),c([m({attribute:!1})],E.prototype,"takenNames",2),c([m({attribute:!1})],E.prototype,"saveError",2),c([m({attribute:!1})],E.prototype,"scopeChangedElsewhere",2),c([g()],E.prototype,"_staleAcknowledged",2),c([g()],E.prototype,"_draft",2),c([g()],E.prototype,"_scope",2),c([g()],E.prototype,"_open",2),c([g()],E.prototype,"_showError",2),c([g()],E.prototype,"_addOrder",2),c([g()],E.prototype,"_serviceHasTarget",2),E=c([w("ambience-scene-editor")],E);function Ju(t,n,e,i){return n==="time_of_day"?he(t,e,i):n==="weather"?yt(t,e):e}var $n=y`
  .eval { border: 1px solid var(--divider-color, #444); border-radius: 8px; padding: 0.7rem 0.9rem; }
  .cause-line { font-family: monospace; font-size: 0.85rem; color: var(--secondary-text-color, #bbb); margin-top: 0.2rem; }
  .raw-trigger { font-family: monospace; font-size: 0.8rem; color: var(--secondary-text-color, #bbb); margin-bottom: 0.4rem; }
  /* Full-width status bar (was a lozenge): the label is centred across the bar,
     the timestamp pinned to the right; the whole bar is the expand/collapse hit area. */
  .outcome { position: relative; display: block; box-sizing: border-box; width: 100%;
    padding: 3px 5px; margin: 0 0 5px 0; text-align: center; font-weight: bold;
    font-size: 0.72rem; text-transform: uppercase; border-radius: 4px;
    background: var(--secondary-background-color, #333); color: var(--secondary-text-color, #aaa); }
  .outcome.clickable { cursor: pointer; }
  .outcome.clickable:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
  .outcome .ts { position: absolute; right: 5px; top: 50%; transform: translateY(-50%);
    font-weight: normal; font-size: 0.75rem; opacity: 0.85; }
  .outcome.acted { background: var(--success-color, #4caf50); color: #fff; }
  .outcome.debounced { background: var(--warning-color, #ff9800); color: #fff; }
  .won { margin-top: 0.4rem; }
  .won .name { color: var(--success-color, #4caf50); font-weight: 600; }
  .action-summary { margin-top: 0.2rem; font-family: monospace; font-size: 0.82rem;
    color: var(--secondary-text-color, #bbb); }
  .action-summary .n { color: var(--secondary-text-color, #888); }
  .why { margin-top: 0.6rem; padding: 0.2rem 0 0.2rem 0.9rem;
    border-left: 2px solid var(--divider-color, #444); }
  .outcome-summary { font-size: 0.85rem; color: var(--primary-text-color, #ddd);
    margin-bottom: 0.7rem; }
  .section + .section { margin-top: 1.25rem; }
  .section-title { font-size: 0.95rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--primary-text-color, #fff); margin-bottom: 0.5rem; }
  .scenes { font-family: monospace; font-size: 0.8rem; line-height: 1.7; }
  .scene.won { color: var(--success-color, #4caf50); }
  .scene.skipped { opacity: 0.5; }
  .pred.pass { color: var(--success-color, #4caf50); }
  .pred.fail { color: var(--error-color, #e57373); }
  .pred .dim { color: var(--secondary-text-color, #888); }
  .action-block { font-family: monospace; font-size: 0.8rem; line-height: 1.6; margin-bottom: 0.3rem; }
  .action-block.unexposed { opacity: 0.6; }
  .action-head { color: var(--primary-text-color, #ddd); }
  .skipped-tag { color: var(--error-color, #e57373); }
  .action-block .entity { padding-left: 1rem; color: var(--secondary-text-color, #aaa); }
  .entity-link { cursor: pointer; color: var(--primary-color, #03a9f4); }
  .entity-link:hover { text-decoration: underline; }
  .entity-link:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
`;function Wo(t,n){t.stopPropagation(),t.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:n},bubbles:!0,composed:!0}))}function Sn(t,n,e){let i=r=>{(r.key==="Enter"||r.key===" ")&&!r.repeat&&(r.preventDefault(),Wo(r,n))};return l`<span
    class="entity-link"
    role="button"
    tabindex="0"
    title=${o(t,"ui.show_more_info","Show more info")}
    @click=${r=>Wo(r,n)}
    @keydown=${i}
    >${e}</span
  >`}function Vo(t,n){return Sn(t,n,je(t,n))}var Zu=new Set(["occupancy","people","lux","state"]);function Xu(t,n,e,i){if(!i?.length||!Zu.has(n))return e;let r=[],a=i.map(u=>({id:u,name:je(t,u)})).sort((u,h)=>h.name.length-u.name.length);for(let{id:u,name:h}of a)for(let p=0;p<=e.length;){let _=e.indexOf(h,p);if(_===-1)break;let f=_+h.length;if(!r.some(v=>_<v.end&&v.start<f)){r.push({start:_,end:f,id:u,name:h});break}p=_+1}if(r.length===0)return e;r.sort((u,h)=>u.start-h.start);let s=[],d=0;for(let u of r)u.start>d&&s.push(e.slice(d,u.start)),s.push(Sn(t,u.id,u.name)),d=u.end;return d<e.length&&s.push(e.slice(d)),l`${s}`}var eh={has_time:["ui.cause_has_time","Periodic time check"],switch:["ui.cause_switch","Switch turned on"],manual:["ui.cause_manual","Manual apply"],startup:["ui.cause_startup","Startup"],reloaded:["ui.cause_reloaded","Reloaded"],simulated:["ui.cause_simulated","Simulation"]},th={clock:["ui.cause_clock","Time of day"],sun:["ui.cause_sun","Sun position"],reapply:["ui.cause_reapply","Re-run"]};function be(t){return t??"?"}function Go(t,n){if(n.kind==="entity")return`${n.entity_id} ${be(n.old)} \u2192 ${be(n.new)}`;if(n.kind==="duration"){let a=o(t,"ui.cause_duration_for","for");return n.entity_id?`${n.entity_id} ${be(n.new)} ${a} ${be(n.detail)}`:`${be(n.new)} ${a} ${be(n.detail)}`}let e=eh[n.kind];if(e)return o(t,e[0],e[1]);let i=th[n.kind],r=i?o(t,i[0],i[1]):F(n.kind);return n.detail?`${r} ${n.detail}`:r}function ih(t,n){if(!Cn(n)||!n.entity_id)return l`${Go(t,n)}`;let e=Sn(t,n.entity_id,n.entity_id);return n.kind==="duration"?l`${e} ${be(n.new)} ${o(t,"ui.cause_duration_for","for")} ${be(n.detail)}`:l`${e} ${be(n.old)} → ${be(n.new)}`}function Cn(t){return t.kind==="entity"||t.kind==="duration"&&!!t.entity_id}function Ko(t,n){let e=t.entity_id?n?.states?.[t.entity_id]:void 0,i=r=>r===null?"?":De(n,e,null,r);return{old:i(t.old),new:i(t.new)}}function nh(t,n){if(!Cn(t))return Go(n,t);let e=t.entity_id?je(n,t.entity_id):"?",i=Ko(t,n);return t.kind==="duration"?`${e}: ${i.new} ${o(n,"ui.cause_duration_for","for")} ${t.detail??"?"}`:`${e}: ${i.old} \u2192 ${i.new}`}function rh(t,n){if(!Cn(t)||!t.entity_id)return l`${nh(t,n)}`;let e=Vo(n,t.entity_id),i=Ko(t,n);return t.kind==="duration"?l`${e}: ${i.new} ${o(n,"ui.cause_duration_for","for")} ${t.detail??"?"}`:l`${e}: ${i.old} → ${i.new}`}var ah={acted:["ui.outcome_label_acted","applied"],no_op:["ui.outcome_label_no_op","blocked"],debounced:["ui.outcome_label_debounced","unchanged"],no_match:["ui.outcome_label_no_match","no match"],skipped_switch_off:["ui.outcome_label_skipped","skipped"],skipped_scope_disabled:["ui.outcome_label_skipped","skipped"],skipped_unavailable:["ui.outcome_label_skipped","skipped"]};function sh(t,n){let e=ah[n];return e?o(t,e[0],e[1]):n.replace(/_/g," ")}function kn(t,n,e,i,r,a){return n===1?o(t,e,r,{n:String(n)}):o(t,i,a,{n:String(n)})}function Yo(t,n){let e=n.winner_name??o(t,"ui.winner_default","The matching scene");switch(n.outcome){case"acted":{let i=n.actions.filter(h=>!h.unexposed),r=n.actions.length-i.length;if(i.length===0&&r){let h=kn(t,r,"ui.count_action_one","ui.count_action_other","{n} action","{n} actions");return o(t,"ui.outcome_summary_acted_all_skipped","{winner} matched \u2014 {skipped_phrase} skipped (not exposed); nothing applied.",{winner:e,skipped_phrase:h})}let a=kn(t,i.length,"ui.count_action_one","ui.count_action_other","{n} action","{n} actions"),s=Jo(i),d=r?o(t,"ui.outcome_summary_skipped_tail"," ({skipped} skipped \u2014 not exposed)",{skipped:String(r)}):"",u=kn(t,s,"ui.count_entity_one","ui.count_entity_other","{n} entity","{n} entities");return s?o(t,"ui.outcome_summary_acted_entities","Applied {winner} \u2014 {acts} on {entities}.{tail}",{winner:e,acts:a,entities:u,tail:d}):o(t,"ui.outcome_summary_acted","Applied {winner} \u2014 {acts}.{tail}",{winner:e,acts:a,tail:d})}case"no_op":return o(t,"ui.outcome_summary_no_op","{winner} matched but has no actions \u2014 it blocks lower scenes from applying. Nothing changed.",{winner:e});case"debounced":return o(t,"ui.outcome_summary_debounced","{winner} matched, but it's already applied \u2014 nothing was re-sent.",{winner:e});case"no_match":return o(t,"ui.outcome_summary_no_match","No scene matched \u2014 nothing applied.");case"skipped_switch_off":return o(t,"ui.outcome_summary_skipped_switch_off","Skipped \u2014 the scope's pause switch is off.");case"skipped_scope_disabled":return o(t,"ui.outcome_summary_skipped_scope_disabled","Skipped \u2014 the scope is disabled.");case"skipped_unavailable":return o(t,"ui.outcome_summary_skipped_unavailable","Skipped \u2014 the triggering entity went unavailable; devices left as they are.");default:return""}}function Qo(t,n,e){return ft(t,n,()=>e?.[t]?.name?.trim()||Li(t))}function oh(t,n,e,i){let r=Object.entries(t.params??{}).filter(([,s])=>s!=null&&s!=="").map(([s,d])=>`${ii(s,t.service,e)}: ${Oe(n,d)}`).join(", "),a=Qo(t.service,i,e);return r?`${a} \xB7 ${r}`:a}function Jo(t){return t.reduce((n,e)=>n+(e.entity_ids?.length??0),0)}function lh(t){return t==="skipped_switch_off"||t==="skipped_scope_disabled"||t==="skipped_unavailable"}function Bo(t,n,e){let i=n.detail??"";return n.detail_key?o(t,`trace_reason.${n.detail_key}`,i,n.detail_placeholders??{}):n.detail_segments?.length?dh(t,n.detail_segments):Ju(t,n.condition_key,i,e)}function dh(t,n){let e=n.map(i=>{if(i.k){let r=i.p?.sector?{...i.p,sector:vt(t,i.p.sector)}:i.p??{};return ua(t,`trace_detail.${i.k}`,i.t??"",r)}return i.e?Sn(t,i.e,i.t??i.e):i.t??""});return l`${e}`}function ch(t,n,e){let i=t.index+1,r=o(n,"ui.trace_scene_prefix","Scene #");return t.disabled?l`<div class="scene disabled">${r}${i} ${t.name??"\u2014"}: ${o(n,"ui.trace_scene_disabled","disabled")}</div>`:t.evaluated?l`
    <div class="scene ${t.matched?"won":""}">${r}${i} ${t.name??"\u2014"}: ${t.matched?o(n,"ui.trace_scene_matched","\u2713 matched"):o(n,"ui.trace_scene_no_match","\u2717 no match")}</div>
    ${t.predicates.map(a=>l`
        <div class="pred ${a.passed?"pass":"fail"}" style="padding-left:1rem">
          ${a.passed?"\u2713":"\u2717"} ${K(n,a.condition_key)}${a.detail?l` <span class="dim">[${!a.detail_key&&a.detail_segments?.length?Bo(n,a,e):Xu(n,a.condition_key,Bo(n,a,e),a.entity_ids)}]</span>`:k}
        </div>`)}
  `:l`<div class="scene skipped">${r}${i} ${t.name??"\u2014"}: ${o(n,"ui.trace_scene_not_reached","not reached")}</div>`}function En(t,n,e,i,r,a={},s){let d=t.actions.filter(f=>!f.unexposed),u=d.map(f=>Qo(f.service,s,r)).join(", "),h=Jo(d),p=t.explanation!==null||t.actions.length>0||lh(t.outcome),_=f=>{(f.key==="Enter"||f.key===" ")&&!f.repeat&&(f.preventDefault(),e())};return l`
    <div class="eval">
      <div
        class="outcome ${t.outcome}${p?" clickable":""}"
        role=${p?"button":k}
        tabindex=${p?"0":k}
        aria-expanded=${p?n:k}
        @click=${p?e:void 0}
        @keydown=${p?_:void 0}
      >
        <span class="label">${sh(i,t.outcome)}</span>
        <span class="ts">${t.timestamp?new Date(t.timestamp).toLocaleTimeString():""}</span>
      </div>
      <div class="eval-body">
        <div class="cause-line">${o(i,"ui.trigger_prefix","Trigger: ")}${rh(t.cause,i)}</div>
        ${t.winner_name?l`<div class="won">${o(i,"ui.trace_won_prefix","Won: ")}<span class="name">${t.winner_name}</span></div>`:k}
        ${d.length?l`<div class="action-summary">→ ${u}
              ${h?l`<span class="n">· ${kn(i,h,"ui.count_entity_one","ui.count_entity_other","{n} entity","{n} entities")}</span>`:k}</div>`:n?k:l`<div class="action-summary">${Yo(i,t)}</div>`}
      </div>
      ${n?uh(t,i,r,a,s):k}
    </div>
  `}function uh(t,n,e,i,r){let a=Yo(n,t),s=Cn(t.cause);return l`
    <div class="why">
      ${s?l`<div class="raw-trigger">${o(n,"ui.trigger_prefix","Trigger: ")}${ih(n,t.cause)}</div>`:k}
      ${a?l`<div class="outcome-summary">${a}</div>`:k}
      ${t.explanation?l`<div class="section">
            <div class="section-title">${o(n,"ui.section_scene_evaluation","Scene evaluation")}</div>
            <div class="scenes">${t.explanation.scenes.map(d=>ch(d,n,i))}</div>
          </div>`:k}
      ${t.actions.length?l`<div class="section">
            <div class="section-title">${o(n,"ui.section_actions_taken","Actions taken")}</div>
            ${t.actions.map(d=>l`<div class="action-block ${d.unexposed?"unexposed":""}">
                <div class="action-head">
                  ${oh(d,n,e,r)}${d.unexposed?l`<span class="skipped-tag">${o(n,"ui.skipped_not_exposed"," \u2014 skipped (not exposed)")}</span>`:k}
                </div>
                ${(d.entity_ids??[]).map(u=>l`<div class="entity">${Vo(n,u)}</div>`)}
              </div>`)}
          </div>`:k}
    </div>
  `}var Ve=class{constructor(n,e){this._onKeydown=n=>{this._host.open&&n.key==="Escape"&&this._close()};this._onBackdrop=()=>{this._host.open&&this._close()};this._host=n,this._close=e,n.addController(this)}hostConnected(){document.addEventListener("keydown",this._onKeydown),this._host.addEventListener("click",this._onBackdrop)}hostDisconnected(){document.removeEventListener("keydown",this._onKeydown),this._host.removeEventListener("click",this._onBackdrop)}};var M=class extends b{constructor(){super();this.exposedActions=[];this.category="";this.categoryName=null;this.open=!1;this._records=[];this._schemas={};this._expanded=new Set;this._loading=!0;this._error="";this._hasNew=!1;new Ve(this,()=>this._onClose())}disconnectedCallback(){super.disconnectedCallback(),this._stopPoll()}_startPoll(){this._poll||(this._poll=setInterval(()=>this._checkNew(),5e3))}_stopPoll(){this._poll&&(clearInterval(this._poll),this._poll=void 0)}_reloadTriggered(e){return this.open&&(e.has("open")||e.has("category")||e.has("scope"))}willUpdate(e){this._reloadTriggered(e)&&this._beginLoad()}updated(e){e.has("open")&&(this.open?this._startPoll():this._stopPoll()),this._reloadTriggered(e)&&this._fetch()}_mine(e){return e.filter(i=>i.scope_kind===this.scope.scope_kind&&i.scope_id===this.scope.scope_id&&i.category===this.category)}_beginLoad(){this._error="",this._loading=!0,this._hasNew=!1,this._expanded=new Set}async _fetch(){try{let e=await Zn(this.hass);if(!this.isConnected)return;this._records=this._mine(e),this._loading=!1,this._loadSchemas()}catch(e){this._error=C(this.hass,e),this._loading=!1}}_load(){return this._beginLoad(),this._fetch()}async _loadSchemas(){let e=[...new Set(this._records.flatMap(a=>a.actions.map(s=>s.service)))].filter(a=>!(a in this._schemas));if(e.length===0)return;let i=await Promise.all(e.map(async a=>{try{return[a,await Ie(this.hass,a)]}catch{return null}}));if(!this.isConnected)return;let r={...this._schemas};for(let a of i)a&&(r[a[0]]=a[1]);this._schemas=r}async _checkNew(){if(!(!this.open||!this.isConnected||document.visibilityState!=="visible"))try{let i=this._mine(await Zn(this.hass))[0]?.timestamp??null,r=this._records[0]?.timestamp??null;i&&(!r||i>r)&&(this._hasNew=!0)}catch{}}_toggle(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}async _clear(){try{await ns(this.hass),await this._load()}catch(e){this._error=C(this.hass,e)}}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){if(!this.open)return k;let e=this.categoryName??this.category;return l`
      <div class="modal" role="dialog" aria-modal="true" @click=${i=>i.stopPropagation()}>
        <div class="header">
          <h3>${e}</h3>
          <button class="refresh ${this._hasNew?"has-new":""}" @click=${()=>this._load()}>
            ${this._hasNew?`\u25CF ${o(this.hass,"ui.new_traces_refresh","New traces \u2014 refresh")}`:o(this.hass,"ui.refresh","Refresh")}
          </button>
          <button class="clear" @click=${this._clear}>
            ${o(this.hass,"ui.clear_traces","Clear")}
          </button>
          <button class="close" @click=${this._onClose} aria-label=${o(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          ${this._error?l`<p class="error">${this._error}</p>`:this._loading?l`<p class="empty">${o(this.hass,"ui.loading","Loading\u2026")}</p>`:this._records.length===0?l`<p class="empty">${o(this.hass,"ui.no_traces_yet","No traces for this category yet.")}</p>`:l`<div class="list">${this._records.map((i,r)=>{let a=`${i.event_id??r}|${i.timestamp??""}`;return En(i,this._expanded.has(a),()=>this._toggle(a),this.hass,this._schemas,this.periods?.custom??{},this.exposedActions)})}</div>`}
        </div>
      </div>
    `}};M.styles=[$n,y`
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
      .refresh, .clear {
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
    `],c([m({attribute:!1})],M.prototype,"hass",2),c([m({attribute:!1})],M.prototype,"periods",2),c([m({attribute:!1})],M.prototype,"exposedActions",2),c([m({attribute:!1})],M.prototype,"scope",2),c([m()],M.prototype,"category",2),c([m()],M.prototype,"categoryName",2),c([m({type:Boolean,reflect:!0})],M.prototype,"open",2),c([g()],M.prototype,"_records",2),c([g()],M.prototype,"_schemas",2),c([g()],M.prototype,"_expanded",2),c([g()],M.prototype,"_loading",2),c([g()],M.prototype,"_error",2),c([g()],M.prototype,"_hasNew",2),M=c([w("ambience-traces-modal")],M);var hh={time:"mdi:clock-outline",sun:"mdi:weather-sunny",domain:"mdi:account-multiple-plus"},Y=class extends b{constructor(){super(...arguments);this.categoryName="";this.scenes=[];this.open=!1;this._triggers=[];this._opaque=!1;this._loading=!1;this._error="";this._loadSeq=0}willUpdate(e){super.willUpdate?.(e);let i=e.has("open")||e.has("scope")||e.has("category");this.open&&(i||e.has("scenes"))&&(i&&(this._triggers=[],this._opaque=!1),this._load())}get _scopeId(){return this.scope.kind==="house"?null:this.scope.id}async _load(){let e=++this._loadSeq;this._loading=!0,this._error="";try{let i=await Ma(this.hass,this.scope.kind,this._scopeId,this.category);if(e!==this._loadSeq)return;this._triggers=i.triggers,this._opaque=i.opaque}catch(i){if(e!==this._loadSeq)return;this._error=C(this.hass,i)}finally{e===this._loadSeq&&(this._loading=!1)}}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_openMoreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_entityName(e){return at(this.hass,e)}get _sortedTriggers(){let e=a=>this._entityName(a.entity_id).toLowerCase(),i=this._triggers.filter(a=>a.kind==="entity").sort((a,s)=>e(a).localeCompare(e(s))),r=this._triggers.filter(a=>a.kind!=="entity");return[...i,...r]}_sunPart(e){let i=ne(this.hass,e.anchor);if(e.offset===0)return i;let r=o(this.hass,"ui.unit_min","min");return`${i} ${e.offset>0?"+":""}${e.offset} ${r}`}_rowContent(e){switch(e.kind){case"entity":return{title:this._entityName(e.entity_id),detail:e.entity_id};case"time":{let i=e.clocks.map(r=>`${String(r.hour).padStart(2,"0")}:${String(r.minute).padStart(2,"0")}`);return e.date_rollover&&i.push(o(this.hass,"ui.auto_trigger_date_rollover","Local midnight (date rollover)")),e.has_time&&i.push(o(this.hass,"ui.auto_trigger_periodic","periodic re-check")),{title:o(this.hass,"ui.auto_trigger_group_time","Time"),detail:i.join(", ")}}case"sun":return{title:o(this.hass,"ui.auto_trigger_group_sun","Sun"),detail:e.suns.map(i=>this._sunPart(i)).join(", ")};case"domain":return{title:o(this.hass,"ui.auto_trigger_group_domain","People list"),detail:o(this.hass,"ui.auto_trigger_domain_membership","{domains} added or removed",{domains:e.domains.join(", ")})}}}_renderRowIcon(e){return e.kind==="entity"?li(this.hass,e.entity_id):l`<ha-icon
      class="row-icon"
      icon=${hh[e.kind]??Er}
    ></ha-icon>`}_moreInfoEntity(e){return e.kind==="entity"?e.entity_id:e.kind==="sun"&&this.hass?.states?.["sun.sun"]?"sun.sun":null}_renderRow(e){let{title:i,detail:r}=this._rowContent(e),a=this._moreInfoEntity(e);return l`
      <li
        data-test=${`trigger-ro-${e.key}`}
        class=${a?"clickable":""}
        role=${a?"button":k}
        tabindex=${a?"0":k}
        @click=${a?()=>this._openMoreInfo(a):k}
        @keydown=${a?s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),this._openMoreInfo(a))}:k}
      >
        ${this._renderRowIcon(e)}
        <div class="row-text">
          <div class="row-title">${i}</div>
          ${r?l`<div class="row-detail">${r}</div>`:""}
        </div>
      </li>
    `}render(){if(!this.open)return k;let e=o(this.hass,"ui.auto_triggers_section","Auto-triggers");return l`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>${e}${this.categoryName?` \u2014 ${this.categoryName}`:""}</h3>
          <button class="close" @click=${this._close} aria-label=${o(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">${this._renderBody()}</div>
      </div>
    `}_renderBody(){return this._error?l`<div class="error">${this._error}</div>`:this._loading&&this._triggers.length===0?l`<div class="empty">${o(this.hass,"ui.loading","Loading\u2026")}</div>`:l`
      ${this._opaque?l`<div class="note">
            ${o(this.hass,"ui.auto_triggers_opaque_note","A script scene is opaque \u2014 some watches may be missing. Declare them in the scene's Triggers field.")}
          </div>`:""}
      ${this._triggers.length===0?l`<div class="empty">
            ${o(this.hass,"ui.auto_triggers_none","No automatic triggers.")}
          </div>`:l`<ul>
            ${this._sortedTriggers.map(e=>this._renderRow(e))}
          </ul>`}
    `}};Y.styles=y`
    :host {
      display: none;
      position: fixed;
      inset: 0;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.45);
      z-index: 1000;
    }
    :host([open]) {
      display: flex;
    }
    .modal {
      background: var(--card-background-color, #fff);
      border-radius: 8px;
      padding: 1.5rem;
      max-width: 640px;
      width: 90%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow: hidden;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .header h3 {
      margin: 0;
      flex: 1;
    }
    .close {
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 1.2rem;
      color: var(--secondary-text-color, #888);
      line-height: 1;
    }
    .body {
      overflow-y: auto;
      flex: 1;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.25rem;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    li:last-child {
      border-bottom: 0;
    }
    li.clickable {
      cursor: pointer;
    }
    li.clickable:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .row-icon {
      flex: 0 0 auto;
      color: var(--secondary-text-color, #888);
      --mdc-icon-size: 22px;
    }
    .row-text {
      flex: 1;
      min-width: 0;
    }
    .row-title {
      color: var(--primary-text-color, #212121);
    }
    .row-detail {
      color: var(--secondary-text-color, #888);
      font-size: 0.8em;
      margin-top: 0.1rem;
      word-break: break-word;
    }
    .empty,
    .note,
    .error {
      color: var(--secondary-text-color, #888);
      font-size: 0.85em;
      padding: 0.25rem 0;
    }
    .error {
      color: var(--error-color, #d32f2f);
    }
    .note {
      font-style: italic;
    }
  `,c([m({attribute:!1})],Y.prototype,"hass",2),c([m({attribute:!1})],Y.prototype,"scope",2),c([m()],Y.prototype,"category",2),c([m()],Y.prototype,"categoryName",2),c([m({attribute:!1})],Y.prototype,"scenes",2),c([m({type:Boolean,reflect:!0})],Y.prototype,"open",2),c([g()],Y.prototype,"_triggers",2),c([g()],Y.prototype,"_opaque",2),c([g()],Y.prototype,"_loading",2),c([g()],Y.prototype,"_error",2),Y=c([w("ambience-auto-triggers-modal")],Y);function Zo(t,n){return n==="not_home"?o(t,"ui.away","Away"):n==="home"?o(t,"ui.home","Home"):F(n)}function Xo(t){return{state:t.live_state??"",attributes:Object.fromEntries(t.attributes.map(n=>[n.name,n.live_value==null?"":String(n.live_value)])),for:{h:0,m:0,s:0}}}function Ln(t){return String(t).padStart(2,"0")}function An(t){return`${t.getFullYear()}-${Ln(t.getMonth()+1)}-${Ln(t.getDate())}`}function mi(t){return`${Ln(t.getHours())}:${Ln(t.getMinutes())}`}var P=class extends b{constructor(){super();this.exposedActions=[];this.category="";this.categoryName=null;this.open=!1;this._knobs=[];this._hasTime=!1;this._loading=!0;this._error="";this._values={};this._verdicts={};this._date="";this._time="";this._whenMode="time";this._anchor="sunset";this._offset=0;this._anchors=null;this._anchorsDate="";this._anchorsError="";this._results=[];this._appliedIndex=null;this._expanded=new Set;this._running=!1;this._runToken=0;new Ve(this,()=>this._onClose())}_reloadTriggered(e){return this.open&&(e.has("open")||e.has("category")||e.has("scope"))}willUpdate(e){this._reloadTriggered(e)&&this._beginLoad()}updated(e){this._reloadTriggered(e)&&this._fetch()}_vkey(e){return`${e.condition}:${e.key}`}_beginLoad(){this._error="",this._loading=!0,this._resetResults();let e=new Date;this._date=An(e),this._time=mi(e),this._whenMode="time",this._anchor="sunset",this._offset=0,this._anchors=null,this._anchorsDate="",this._anchorsError=""}async _fetch(){try{let e=await ms(this.hass,this.scope,this.category);if(!this.isConnected)return;this._knobs=e.knobs,this._hasTime=e.has_time;let i={},r={};for(let a of e.knobs)a.kind==="entity"?i[a.entity_id]=Xo(a):r[this._vkey(a)]=a.live_value;this._values=i,this._verdicts=r,this._loading=!1}catch(e){this._error=C(this.hass,e),this._loading=!1}}_setState(e,i){this._values={...this._values,[e]:{...this._values[e],state:i}}}_setAttr(e,i,r){let a=this._values[e];this._values={...this._values,[e]:{...a,attributes:{...a.attributes,[i]:r}}}}_setFor(e,i,r){let a=this._values[e],s=Number.isFinite(r)&&r>0?Math.trunc(r):0;this._values={...this._values,[e]:{...a,for:{...a.for,[i]:s}}}}_setVerdict(e,i){this._verdicts={...this._verdicts,[e]:i}}_resetWhen(){let e=new Date;this._date=An(e),this._time=mi(e),this._whenMode="time"}_setWhenMode(e){e!==this._whenMode&&(this._whenMode=e,e==="sun"&&this._fetchAnchors(this._date))}_setDate(e){this._date=e,this._whenMode==="sun"&&this._fetchAnchors(e)}_onOffsetInput(e){let i=Lr(e);i!==null&&(this._offset=i)}async _fetchAnchors(e){if(e&&!(this._anchorsDate===e&&this._anchors)){this._anchorsError="";try{let i=await _s(this.hass,e);if(!this.isConnected||this._date!==e)return;this._anchors=i,this._anchorsDate=e}catch(i){if(!this.isConnected||this._date!==e)return;this._anchors=null,this._anchorsError=C(this.hass,i)}}}_resolvedInstant(){if(this._anchorsDate!==this._date)return null;let e=this._anchors?.[this._anchor];return e?new Date(e).getTime()+this._offset*6e4:null}_renderSunReadout(){if(this._anchorsError)return l`<span class="hint err">${this._anchorsError}</span>`;if(!this._anchors||this._anchorsDate!==this._date)return k;if(this._anchors[this._anchor]===null)return l`<span class="hint">${o(this.hass,"ui.simulate_sun_undefined","no {anchor} on this date",{anchor:ne(this.hass,this._anchor)})}</span>`;let e=this._resolvedInstant();if(e===null||Number.isNaN(new Date(e).getTime()))return k;let i=this._anchors[this._anchor],r=new Date(e),a=An(r)===this._date?mi(r):`${An(r)} ${mi(r)}`,s=Tr(this._offset,this.hass);return l`<span class="hint">${ne(this.hass,this._anchor)} ${mi(new Date(i))}${s?l` ${s}`:""} ${o(this.hass,"ui.simulate_sun_resolved","\u2192 {time}",{time:a})}</span>`}_resetEntity(e){this._values={...this._values,[e.entity_id]:Xo(e)}}_resetVerdict(e){this._verdicts={...this._verdicts,[this._vkey(e)]:e.live_value}}_buildOverrides(){let e={};for(let i of this._knobs){if(i.kind!=="entity")continue;let r=this._values[i.entity_id];if(!r)continue;let a={};for(let d of i.attributes){let u=r.attributes[d.name];if(!(u===void 0||u===""))if(d.control==="number"){let h=Number(u);Number.isNaN(h)||(a[d.name]=h)}else a[d.name]=u}let s={attributes:a};r.state!==""&&(s.state=r.state),(r.for.h||r.for.m||r.for.s)&&(s.for=r.for),(s.state!==void 0||s.for!==void 0||Object.keys(a).length>0)&&(e[i.entity_id]=s)}return e}_buildVerdicts(){let e={};for(let i of this._knobs)i.kind==="verdict"&&(e[i.condition]||(e[i.condition]={}),e[i.condition][i.key]=this._verdicts[this._vkey(i)]??i.live_value);return e}_resolveNow(){if(this._whenMode==="sun"){let i=this._resolvedInstant();return i===null||Number.isNaN(new Date(i).getTime())?null:new Date(i).toISOString()}let e=new Date(`${this._date}T${this._time}`);return!this._date||!this._time||Number.isNaN(e.getTime())?null:e.toISOString()}async _run(){if(this._running)return;this._error="";let e=this._resolveNow();if(e===null){this._error=this._whenMode==="sun"?o(this.hass,"ui.simulate_sun_unresolved","This sun time can't be resolved for the selected date."):o(this.hass,"ui.invalid_datetime","Enter a valid date and time.");return}this._running=!0;let i=this._runToken;try{let r=await gs(this.hass,this.scope,this.category,e,this._buildOverrides(),this._buildVerdicts(),this._appliedIndex);if(i!==this._runToken)return;this._results=[...this._results,r.result],this._appliedIndex=r.applied_index}catch(r){if(i!==this._runToken)return;this._error=C(this.hass,r)}finally{i===this._runToken&&(this._running=!1)}}_clearHistory(){this._resetResults()}_resetResults(){this._results=[],this._appliedIndex=null,this._expanded=new Set,this._runToken++,this._running=!1}_toggle(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?l`
      <div class="modal" role="dialog" aria-modal="true" @click=${e=>e.stopPropagation()}>
        <div class="header">
          <h3>${o(this.hass,"ui.simulate_title","Simulate")} · ${this.categoryName??this.category}</h3>
          ${this._results.length?l`<button class="clear" @click=${()=>this._clearHistory()}>${o(this.hass,"ui.clear_traces","Clear")}</button>`:k}
          <button class="close" @click=${this._onClose} aria-label=${o(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          ${this._error?l`<p class="error">${this._error}</p>`:k}
          ${this._loading?l`<p>${o(this.hass,"ui.loading","Loading\u2026")}</p>`:l`
            ${this._hasTime?l`
              <p class="sec-title">${o(this.hass,"ui.when_heading","When")}</p>
              <div class="when">
                <input type="date" .value=${this._date}
                  @change=${e=>this._setDate(e.target.value)} />
                <select class="whenmode" .value=${this._whenMode}
                  @change=${e=>this._setWhenMode(e.target.value)}>
                  <option value="time" ?selected=${this._whenMode==="time"}>${o(this.hass,"ui.endpoint_time","Time")}</option>
                  <option value="sun" ?selected=${this._whenMode==="sun"}>${o(this.hass,"ui.endpoint_sun","Sun")}</option>
                </select>
                ${this._whenMode==="time"?l`<input type="time" .value=${this._time}
                        @change=${e=>this._time=e.target.value} />`:l`
                      <select class="anchor"
                        @change=${e=>this._anchor=e.target.value}>
                        ${Ar.map(e=>l`<option value=${e} ?selected=${e===this._anchor}>${ne(this.hass,e)}</option>`)}
                      </select>
                      <input class="num" type="number" step="1"
                        placeholder=${o(this.hass,"ui.offset_placeholder","Offset")}
                        .value=${this._offset===0?"":String(this._offset)}
                        @input=${e=>this._onOffsetInput(e.target.value)} />`}
                <button class="reset" title=${o(this.hass,"ui.reset_to_now","Reset to now")} aria-label=${o(this.hass,"ui.reset_to_now","Reset to now")}
                  @click=${()=>this._resetWhen()}>↺</button>
                ${this._whenMode==="sun"?this._renderSunReadout():l`<span class="hint">${o(this.hass,"ui.simulate_when_hint","drives sun, time-of-day, weekday & workday")}</span>`}
              </div>`:k}
            ${this._knobs.length?l`
              <p class="sec-title">${o(this.hass,"ui.simulate_inputs_heading","Inputs this category depends on")}</p>
              ${this._knobs.map(e=>e.kind==="entity"?this._renderEntity(e):this._renderVerdict(e))}`:k}
            <div class="run-row"><button class="runbtn" ?disabled=${this._running} @click=${()=>void this._run()}>${o(this.hass,"ui.simulate_button","Simulate")} ▸</button></div>
            ${this._results.length?l`<div class="results">${this._results.map((e,i)=>({u:e,key:`sim-${i}`})).reverse().map(({u:e,key:i})=>l`<div class="result">${En(e,this._expanded.has(i),()=>this._toggle(i),this.hass,void 0,this.periods?.custom??{},this.exposedActions)}</div>`)}</div>`:k}
          `}
        </div>
      </div>`:k}_entityName(e){return at(this.hass,e)}_renderEntity(e){let i=this._values[e.entity_id],r=e.attributes.length>0,a=this._entityName(e.entity_id);return l`
      <div class="row ${r?"has-attrs":""}">
        ${li(this.hass,e.entity_id)}
        <div class="row-text">
          <div class="row-title">${a}</div>
          <div class="row-detail">${e.entity_id}</div>
        </div>
        <div class="row-ctrl">
          ${this._renderControl(e,i?.state??"")}
          ${this._renderFor(e,i?.for??{h:0,m:0,s:0},a)}
          <button class="reset" data-reset=${e.entity_id} title=${o(this.hass,"ui.reset_to_live","Reset to live")}
            @click=${()=>this._resetEntity(e)}>↺</button>
        </div>
      </div>
      ${e.attributes.map((s,d)=>l`
        <div class="row attr ${d===e.attributes.length-1?"last-attr":""}">
          <div class="row-text"><div class="row-title">${Zo(this.hass,s.name)}</div></div>
          <div class="row-ctrl">
            ${this._renderAttrControl(e,s,i?.attributes[s.name]??"")}
            <button class="reset" title=${o(this.hass,"ui.reset_to_live","Reset to live")}
              @click=${()=>this._resetEntity(e)}>↺</button>
          </div>
        </div>`)}
    `}_renderAttrControl(e,i,r){let a=s=>this._setAttr(e.entity_id,i.name,s.target.value);if(i.control==="select"){let s=qe(this.hass)[e.entity_id];return l`<select data-attr=${`${e.entity_id}:${i.name}`} .value=${r} @change=${a}>
        ${(i.options??[r]).map(d=>l`<option value=${d} ?selected=${d===r}>${De(this.hass,s,i.name,d)}</option>`)}
      </select>`}return l`<input class=${i.control==="number"?"num":""}
      type=${i.control==="number"?"number":"text"}
      data-attr=${`${e.entity_id}:${i.name}`}
      .value=${r}
      @input=${a} />`}_renderControl(e,i){if(e.control==="select")return l`<select data-entity=${e.entity_id} .value=${i}
        @change=${a=>this._setState(e.entity_id,a.target.value)}>
        ${(e.options??[i]).map(a=>l`<option value=${a} ?selected=${a===i}>${Zo(this.hass,a)}</option>`)}
      </select>`;let r=e.control==="number"?"number":"text";return l`<input class=${e.control==="number"?"num":""} type=${r} data-entity=${e.entity_id}
      .value=${i}
      @input=${a=>this._setState(e.entity_id,a.target.value)} />`}_renderFor(e,i,r){let a={h:"hours",m:"minutes",s:"seconds"},s=d=>l`<input class="for-num" type="number" min="0"
      aria-label=${`${r} \u2014 held for, ${a[d]}`}
      data-for=${`${e.entity_id}:${d}`} .value=${String(i[d])}
      @change=${u=>this._setFor(e.entity_id,d,Number(u.target.value))} />`;return l`<span class="for-ctrl" title=${o(this.hass,"ui.duration_held_hint","How long it has held this state (h:m:s)")}>
      <span class="for-label">${o(this.hass,"ui.for_label","For")}</span>${s("h")}<span>:</span>${s("m")}<span>:</span>${s("s")}
    </span>`}_renderVerdict(e){let i=this._vkey(e),r=this._verdicts[i]??e.live_value,a=e.entity_id?this._entityName(e.entity_id):e.label,s=e.entity_id?li(this.hass,e.entity_id):l`<ha-icon class="row-icon" icon="mdi:code-braces"></ha-icon>`;return l`
      <div class="row">
        ${s}
        <div class="row-text">
          <div class="row-title">${a}</div>
          ${e.entity_id?l`<div class="row-detail">${e.entity_id}</div>`:k}
        </div>
        <div class="row-ctrl">
          <select data-verdict=${i} .value=${String(r)}
            @change=${d=>this._setVerdict(i,d.target.value==="true")}>
            <option value="true" ?selected=${r}>${o(this.hass,"ui.true_label","True")}</option>
            <option value="false" ?selected=${!r}>${o(this.hass,"ui.false_label","False")}</option>
          </select>
          <button class="reset" title=${o(this.hass,"ui.reset_to_live","Reset to live")} @click=${()=>this._resetVerdict(e)}>↺</button>
        </div>
      </div>`}};P.styles=[$n,To,y`
      :host { display: none; position: fixed; inset: 0; align-items: center;
        justify-content: center; background: rgba(0,0,0,0.45); z-index: 1000; }
      :host([open]) { display: flex; }
      .modal { background: var(--card-background-color, #fff); border-radius: 8px;
        padding: 1.5rem; max-width: 680px; width: 90%; max-height: 80vh;
        display: flex; flex-direction: column; gap: 0.5rem; overflow: hidden; }
      .header { display: flex; align-items: center; gap: 0.5rem; }
      .header h3 { margin: 0; flex: 1; }
      .close { padding: 0.25rem 0.5rem; cursor: pointer; border: none; background: none;
        font-size: 1.2rem; color: var(--secondary-text-color, #888); line-height: 1; }
      .body { overflow-y: auto; flex: 1; }
      .sec-title { font-size: 0.95rem; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.05em; color: var(--primary-text-color, #fff); margin: 0.9rem 0 0.4rem; }
      .when { display: flex; align-items: center; gap: 0.6rem; padding: 0.2rem 0 0.4rem; }
      .when .hint { color: var(--secondary-text-color, #999); font-size: 0.8em; }
      .when .hint.err { color: var(--error-color, #c00); }
      .when input.num { width: 5rem; text-align: right; }
      /* Native date/time inputs render a touch taller than <select>/text controls
         (their picker chrome), so the centred row grew when toggling Time↔Sun.
         Pin every When control to one border-box height so the row height is the
         same in both modes. */
      .when input, .when select { box-sizing: border-box; height: 30px; }
      /* Top-align so the icon and control line up with the entity name (first
         line), not floating between the name and the entity_id subtitle. */
      .row { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.55rem 0;
        border-bottom: 1px solid var(--divider-color, #e0e0e0); }
      .row-icon { margin-top: 1px; }
      .row-ctrl { margin-top: -2px; }
      .row.attr { border-bottom: 0; padding-top: 0.1rem; }
      /* the weather row + its attrs read as one unit (no inner dividers), with
         the divider restored after the last attribute to separate the category */
      .row.attr.last-attr { border-bottom: 1px solid var(--divider-color, #e0e0e0); }
      .row.has-attrs { border-bottom: 0; }
      .row-ctrl { display: flex; align-items: center; gap: 0.4rem; flex: 0 0 auto; }
      .reset { color: var(--secondary-text-color, #bbb); cursor: pointer; background: none;
        border: none; font-size: 1rem; line-height: 1; padding: 0 0.2rem; }
      select, input { background: var(--card-background-color, #fff); color: inherit;
        border: 1px solid var(--divider-color, #bbb); border-radius: 4px; padding: 4px 7px; font: inherit; }
      input.num { width: 96px; text-align: right; }
      .for-ctrl { display: inline-flex; align-items: center; gap: 0.15rem;
        color: var(--secondary-text-color, #888); font-size: 0.9em; }
      .for-label { margin-right: 0.15rem; }
      input.for-num { width: 2.6rem; text-align: right; padding: 4px 5px; }
      .attr .row-text { padding-left: 34px; color: var(--secondary-text-color, #777); }
      .runbtn { padding: 0.45rem 1.1rem; background: var(--primary-color, #03a9f4); color: #fff;
        border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
      .runbtn[disabled] { opacity: 0.6; cursor: default; }
      .run-row { display: flex; justify-content: flex-end; margin-top: 0.6rem; }
      .error { color: var(--error-color, #c00); font-size: 0.9rem; }
      .result { margin-top: 1rem; }
      .results { display: flex; flex-direction: column; gap: 0.75rem; }
      .clear { padding: 0.25rem 0.75rem; cursor: pointer;
        border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
        background: none; color: inherit; font-size: 0.85rem; }
      /* Narrow screens (HA mobile app): the state/For controls otherwise crush
         the entity name into a one-character-wide column. Let the row wrap and
         drop the controls onto their own full-width line, indented under the
         name (past the icon) so each input keeps its natural size. Uses a px
         breakpoint (not rem) so HA's 14px root doesn't shift where it fires. */
      @media (max-width: 600px) {
        .when { flex-wrap: wrap; }
        .row { flex-wrap: wrap; }
        /* border-box so the 34px indent lives INSIDE the 100% basis — with the
           default content-box the row would be 100%+34px and overflow the body
           horizontally (a phantom scrollbar the width of the icon column). */
        .row-ctrl { flex: 1 0 100%; box-sizing: border-box; flex-wrap: wrap;
          padding-left: 34px; margin-top: 0.35rem; }
      }
    `],c([m({attribute:!1})],P.prototype,"hass",2),c([m({attribute:!1})],P.prototype,"periods",2),c([m({attribute:!1})],P.prototype,"exposedActions",2),c([m({attribute:!1})],P.prototype,"scope",2),c([m()],P.prototype,"category",2),c([m()],P.prototype,"categoryName",2),c([m({type:Boolean,reflect:!0})],P.prototype,"open",2),c([g()],P.prototype,"_knobs",2),c([g()],P.prototype,"_hasTime",2),c([g()],P.prototype,"_loading",2),c([g()],P.prototype,"_error",2),c([g()],P.prototype,"_values",2),c([g()],P.prototype,"_verdicts",2),c([g()],P.prototype,"_date",2),c([g()],P.prototype,"_time",2),c([g()],P.prototype,"_whenMode",2),c([g()],P.prototype,"_anchor",2),c([g()],P.prototype,"_offset",2),c([g()],P.prototype,"_anchors",2),c([g()],P.prototype,"_anchorsDate",2),c([g()],P.prototype,"_anchorsError",2),c([g()],P.prototype,"_results",2),c([g()],P.prototype,"_appliedIndex",2),c([g()],P.prototype,"_expanded",2),c([g()],P.prototype,"_running",2),P=c([w("ambience-simulator-modal")],P);function ph(t){let n=Math.floor(t/3600),e=Math.floor(t%3600/60),i=t%60,r=a=>String(a).padStart(2,"0");return n>0?`${n}:${r(e)}:${r(i)}`:`${e}:${r(i)}`}var Or=1024;function mh(t,n,e){if(t!==void 0&&n!==void 0)return Math.floor((t+n)/2);let i=e.map(r=>r.priority??0);return t===void 0&&n===void 0?Or:t===void 0?Math.max(...i)+Or:Math.min(...i)-Or}var Q=class extends b{constructor(){super(...arguments);this._store=new R(this);this._onKeyDown=e=>{if(this._editing!==null||this._viewingTraces!==null||this._viewingSimulator!==null||this._autoTriggers!==null)return;let r=(typeof e.composedPath=="function"?e.composedPath():[])[0]??e.target,a=r?.tagName?.toLowerCase();a==="input"||a==="textarea"||r?.isContentEditable||e.key.toLowerCase()!=="z"||!(e.ctrlKey||e.metaKey)||(e.preventDefault(),e.shiftKey?this._store.canRedo&&this._store.redo():this._store.canUndo&&this._store.undo())};this._expanded=new Set(xa());this._collapsedCategories=new Set($a());this._conditionsHintDismissed=!1;this._editing=null;this._sceneEditorError="";this._savingScene=!1;this._viewingTraces=null;this._viewingSimulator=null;this._autoTriggers=null;this._autoTriggerScenesMemo=null;this.filterCategory="";this._scopeIsEditing=e=>this._editing!==null&&A(this._editing.scope)===A(e)}async connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeyDown),await this._store.loadStatic(),this._conditionsHintDismissed=Aa(this._store.installId),await Promise.all([this._store.refreshAreas(),this._store.refreshFloors(),this._store.refreshHouse(),this._store.refreshSwitches()]),await this._store.subscribe(e=>this._onScopeRemoved(e),this._scopeIsEditing)}disconnectedCallback(){window.removeEventListener("keydown",this._onKeyDown),super.disconnectedCallback()}_onScopeRemoved(e){let i=A(e),r=new Set(this._expanded);r.delete(i),this._setExpanded(r);let a=Ee(e,"");this._setCollapsedCategories(new Set([...this._collapsedCategories].filter(s=>!s.startsWith(a)))),this._store.forgetScope(e),this._editing&&A(this._editing.scope)===i&&(this._editing=null)}willUpdate(e){if(e.has("filterCategory")&&e.get("filterCategory")!==void 0&&this._onFilterCategoryChanged(),e.has("_editing")){let i=e.get("_editing");i!=null&&(this._editing===null||A(this._editing.scope)!==A(i.scope))&&this._store.editorClosed(i.scope)}}_onFilterCategoryChanged(){let e=this.filterCategory;if(e==="")return;let i=new Set(this._expanded),r=new Set(this._collapsedCategories),a=!1,s=!1;for(let d of this._orderedScopeRows()){let u=A(d.scope);this._matchingSceneCount(d.cfg)===0&&i.delete(u)&&(a=!0),r.delete(Ee(d.scope,e))&&(s=!0)}a&&this._setExpanded(i),s&&this._setCollapsedCategories(r)}_setExpanded(e){this._expanded=e,ka([...e])}_toggleExpand(e){let i=A(e),r=new Set(this._expanded);r.has(i)?r.delete(i):r.add(i),this._setExpanded(r)}_setCollapsedCategories(e){this._collapsedCategories=e,Sa([...e])}_toggleCategoryCollapse(e,i){let r=Ee(e,i.detail.categoryId),a=new Set(this._collapsedCategories);a.has(r)?a.delete(r):a.add(r),this._setCollapsedCategories(a)}_collapsedCategoriesFor(e){return this._store.categories.map(i=>i.id).filter(i=>this._collapsedCategories.has(Ee(e,i)))}_addScene(e,i){let r=this._store.getConfig(e);r&&(this._sceneEditorError="",this._editing={scope:e,index:r.scenes.length,isNew:!0,category:i})}_editScene(e,i){this._sceneEditorError="",this._editing={scope:e,index:i.detail.index,isNew:!1}}_duplicateScene(e,i){let r=this._store.getConfig(e);if(!r)return;let a=r.scenes[i.detail.index];if(!a)return;let s=Yt(JSON.parse(JSON.stringify(a)));this._sceneEditorError="",this._editing={scope:e,index:r.scenes.length,isNew:!0,seed:s}}_deleteScene(e,i){let r=this._store.getConfig(e);if(!r)return;let a=r.scenes.filter((s,d)=>d!==i.detail.index);this._store.mutate(e,{...r,scenes:a},{action:"delete",scene_name:r.scenes[i.detail.index]?.name??null})}_reorderScenes(e,i){let r=this._store.getConfig(e);if(!r)return;let{from:a,to:s}=i.detail,d=r.scenes[a];if(!d||r.scenes[s]?.category!==d.category)return;let u=[...r.scenes];u.splice(a,1),u.splice(s,0,d);let h=S=>u[S]&&u[S].category===d.category,p=s-1;for(;p>=0&&!h(p);)p--;let _=s+1;for(;_<u.length&&!h(_);)_++;let f=p>=0?u[p].priority:void 0,v=_<u.length?u[_].priority:void 0,x=mh(f,v,r.scenes.filter(S=>S.category===d.category));u[s]={...d,priority:x,pinned:!0},this._store.mutate(e,{...r,scenes:u},{action:"reorder",scene_name:d.name??null})}_unpinScene(e,i){let r=this._store.getConfig(e);if(!r)return;let a=r.scenes.map((s,d)=>d===i.detail.index?{...s,pinned:!1}:s);this._store.mutate(e,{...r,scenes:a},{action:"unpin",scene_name:r.scenes[i.detail.index]?.name??null})}_toggleSceneEnabled(e,i){let r=this._store.getConfig(e);if(!r)return;let a=r.scenes.map((s,d)=>{if(d!==i.detail.index)return s;if(i.detail.enabled){let u={...s};return delete u.enabled,u}return{...s,enabled:!1}});this._store.mutate(e,{...r,scenes:a},{action:"toggle",scene_name:r.scenes[i.detail.index]?.name??null})}async _saveScene(e){if(this._savingScene)return;let i=this._editing;if(!i)return;let{scene:r,scope:a}=e.detail;this._savingScene=!0,this._sceneEditorError="";try{if(A(a)===A(i.scope)){let h=this._store.getConfig(a);if(!h)return;let p=[...h.scenes];i.isNew?p.push(r):p[i.index]=r,await this._store.mutate(a,{...h,scenes:p},{action:i.isNew?"add":"edit",scene_name:r.name??null})?this._editing=null:this._sceneEditorError=this._takeError();return}let s=Yt(r),d=this._store.getConfig(a);if(!d)return;if(!await this._store.mutate(a,{...d,scenes:[...d.scenes,s]},{action:"add",scene_name:r.name??null})){this._sceneEditorError=this._takeError();return}if(this._editing=null,!i.isNew){let h=this._store.getConfig(i.scope);if(h){let p=h.scenes.filter((_,f)=>f!==i.index);await this._store.mutate(i.scope,{...h,scenes:p},{action:"delete",scene_name:r.name??null})}}}finally{this._savingScene=!1}}_takeError(){let e=this._store.error;return this._store.error="",e}async _callApi(e){this._store.error="";try{await e()}catch(i){this._store.error=C(this.hass,i)}}_applyScenes(e,i){return this._callApi(()=>qa(this.hass,e,i))}_runSceneActions(e,i){return this._callApi(()=>Ua(this.hass,e,i.detail.index))}_cancelScene(){this._sceneEditorError="",this._editing=null}_onScopeMenu(e,i){i==="run"&&this._applyScenes(e)}_showAutoTriggers(e,i){let r=this._store.categories.find(a=>a.id===i);this._autoTriggers={scope:e,category:i,categoryName:r?.name??null}}_autoTriggerScenes(){if(!this._autoTriggers)return[];let e=this._store.getConfig(this._autoTriggers.scope)?.scenes,{category:i}=this._autoTriggers,r=this._autoTriggerScenesMemo;if(r&&r.source===e&&r.category===i)return r.filtered;let a=(e??[]).filter(s=>s.category===i);return this._autoTriggerScenesMemo={source:e,category:i,filtered:a},a}_showTraces(e,i){let r=this._store.categories.find(a=>a.id===i);this._viewingTraces={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:i,categoryName:r?.name??null}}_downloadDiagnostics(e,i){let r={scope_kind:e.kind,scope_id:"id"in e?e.id:null},a=this._store.categories.find(s=>s.id===i)?.name;return this._callApi(()=>ds(this.hass,r,i,a))}_showSimulator(e,i){let r=this._store.categories.find(a=>a.id===i);this._viewingSimulator={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:i,categoryName:r?.name??null}}_defaultCategoryId(){return this.filterCategory!==""?this.filterCategory:[...this._store.categories].sort((i,r)=>i.name.localeCompare(r.name))[0]?.id??""}get _editingScene(){return this._editing?this._editing.seed?this._editing.seed:this._editing.isNew?{when:{},actions:[],category:this._editing.category??this._defaultCategoryId()}:this._store.getConfig(this._editing.scope)?.scenes[this._editing.index]??null:null}get _editorConditions(){return this._editing?this._store.conditions.slice().sort((e,i)=>i.priority-e.priority):[]}get _takenSceneNames(){let e=new Map,i=this._editing,r=(a,s)=>{if(!s)return;let d=!!i&&!i.isNew&&A(i.scope)===A(a);s.scenes.forEach((u,h)=>{if(d&&h===i.index)return;let p=u.name?.trim().toLowerCase();if(!p)return;let _=Yi(a,u.category),f=e.get(_);f||(f=new Set,e.set(_,f)),f.add(p)})};r({kind:"house"},this._store.house);for(let a of this._store.floors)r({kind:"floor",id:a.floor_id},this._store.floorConfigs.get(a.floor_id));for(let a of this._store.areas)r({kind:"area",id:a.area_id},this._store.areaConfigs.get(a.area_id));return e}get _scopeOptions(){return[{scope:{kind:"house"},label:o(this.hass,"ui.scope_house","House")},...this._store.floors.map(e=>({scope:{kind:"floor",id:e.floor_id},label:e.name})),...this._store.areas.map(e=>({scope:{kind:"area",id:e.area_id},label:e.name}))]}_matchingSceneCount(e){return this.filterCategory===""?e.scenes.length:e.scenes.filter(i=>i.category===this.filterCategory).length}_summary(e){if(e.scenes.length===0)return o(this.hass,"ui.not_configured","not configured");let i=this._matchingSceneCount(e),r=i===1?o(this.hass,"ui.scene_singular","scene"):o(this.hass,"ui.scene_plural","scenes");return`${i} ${r}`}get _weatherUnconfigured(){return!this._store.weatherConfig||this._store.weatherConfig.entity==null}get _workdayUnconfigured(){let e=this._store.dayConfig;return!e||e.workday_sensor==null&&e.workday_calendar==null}get _conditionsUnconfigured(){return this._weatherUnconfigured||this._workdayUnconfigured}_conditionsHintText(){let e=this._weatherUnconfigured,i=this._workdayUnconfigured;return e&&i?{title:o(this.hass,"ui.conditions_hint_title","Optional: set up Workday & Weather"),body:o(this.hass,"ui.conditions_hint_body","Configure Workday and Weather in Conditions to use them in your scene conditions.")}:i?{title:o(this.hass,"ui.conditions_hint_title_workday","Optional: set up Workday"),body:o(this.hass,"ui.conditions_hint_body_workday","Configure Workday in Conditions to use it in your scene conditions.")}:{title:o(this.hass,"ui.conditions_hint_title_weather","Optional: set up Weather"),body:o(this.hass,"ui.conditions_hint_body_weather","Configure Weather in Conditions to use it in your scene conditions.")}}_openSettings(e){this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:e},bubbles:!0,composed:!0}))}_dismissConditionsHint(){this._conditionsHintDismissed=!0,La(this._store.installId)}_renderBanners(){return this._store.staticLoaded?l`
      ${this._renderConditionsHint()}
      <ambience-language-banner .hass=${this.hass}></ambience-language-banner>
    `:""}_renderConditionsHint(){if(this._conditionsHintDismissed||!this._conditionsUnconfigured)return"";let{title:e,body:i}=this._conditionsHintText();return l`
      <ambience-banner
        data-test="conditions-hint-banner"
        icon="mdi:lightbulb-on-outline"
        hint
        .ctaLabel=${o(this.hass,"ui.conditions_hint_cta","Configure conditions")}
        .dismissLabel=${o(this.hass,"ui.dismiss","Dismiss")}
        @banner-cta=${()=>this._openSettings("conditions")}
        @banner-dismiss=${()=>this._dismissConditionsHint()}
      >
        <strong>${e}</strong>
        <span>${i}</span>
      </ambience-banner>
    `}_orderedScopeRows(){let e=[{scope:{kind:"house"},name:o(this.hass,"ui.scope_house","House"),cfg:this._store.house,rowClass:"house"}];for(let a of this._store.floors){let s=this._store.floorConfigs.get(a.floor_id);s&&e.push({scope:{kind:"floor",id:a.floor_id},name:a.name,cfg:s,rowClass:"floor"})}for(let a of this._store.areas){let s=this._store.areaConfigs.get(a.area_id);s&&e.push({scope:{kind:"area",id:a.area_id},name:a.name,cfg:s,rowClass:"area"})}let i=[],r=[];for(let a of e)(a.cfg.enabled===!1?r:i).push(a);return[...i,...r]}_isSwitchedOff(e){let i=this._store.switchEntityIds.get(A(e));return i?this.hass.states?.[i]?.state==="off":!1}_renderAreasPlaceholder(){return this._store.areasLoaded?!this._store.error&&this._store.areas.length===0?l`<li>
        <p class="empty">
          ${o(this.hass,"ui.no_areas","No areas found in Home Assistant.")}
        </p>
      </li>`:"":l`<li>
        <p class="empty" data-test="areas-loading">
          <span class="spinner" aria-hidden="true"></span>
          ${o(this.hass,"ui.loading","Loading\u2026")}
        </p>
      </li>`}_scopeName(e){return e.scope_kind==="house"?o(this.hass,"ui.scope_house","House"):e.scope_kind==="area"?this._store.areas.find(i=>i.area_id===e.scope_id)?.name??e.scope_id??"":this._store.floors.find(i=>i.floor_id===e.scope_id)?.name??e.scope_id??""}_historyLabel(e){if(!e)return"";let i=this._scopeName(e),r=e.scene_name?.trim()?e.scene_name:o(this.hass,"ui.history_untitled","Untitled");return o(this.hass,`ui.history_action_${e.action}`,e.action,{scene:r,scope:i})}_historyButtonLabel(e){let i=e==="undo",r=i?this._store.canUndo:this._store.canRedo,a=i?this._store.undoAction:this._store.redoAction;return r?o(this.hass,`ui.history_${e}_tooltip`,i?"Undo: {change}":"Redo: {change}",{change:this._historyLabel(a)}):o(this.hass,`ui.history_nothing_to_${e}`,i?"Nothing to undo":"Nothing to redo")}_renderHistoryButton(e){let i=e==="undo",r=i?this._store.canUndo:this._store.canRedo,a=this._historyButtonLabel(e);return l`
      <ha-icon-button
        .disabled=${!r}
        .label=${a}
        @click=${()=>i?this._store.undo():this._store.redo()}
      >
        <ha-icon icon=${i?"mdi:undo":"mdi:redo"}></ha-icon>
      </ha-icon-button>
    `}_historyCaption(){return this._store.canUndo?this._historyButtonLabel("undo"):this._store.canRedo?this._historyButtonLabel("redo"):""}_editingScopeIsStale(){return this._editing!==null&&this._store.isScopeStale(this._editing.scope)}render(){let e=this._historyCaption();return l`
      <div class="undo-toolbar">
        <span class="undo-caption" title=${e}>${e}</span>
        ${this._renderHistoryButton("undo")}${this._renderHistoryButton("redo")}
      </div>
      ${this._store.error?l`<p class="error">${this._store.error}</p>`:""}
      ${this._renderBanners()}
      <ul>
        ${xs(this._orderedScopeRows(),i=>A(i.scope),i=>this._renderScopeRow(i.scope,i.name,i.cfg,i.rowClass))}
        ${this._renderAreasPlaceholder()}
      </ul>

      <ambience-scene-editor
        ?open=${this._editing!==null}
        .hass=${this.hass}
        .scope=${this._editing?this._editing.scope:void 0}
        .scopes=${this._scopeOptions}
        .takenNames=${this._takenSceneNames}
        .saveError=${this._sceneEditorError}
        .scopeChangedElsewhere=${this._editingScopeIsStale()}
        .scene=${this._editingScene}
        .conditions=${this._editorConditions}
        .periods=${this._store.periods}
        .luxRanges=${this._store.luxRanges}
        .dayConfig=${this._store.dayConfig}
        .weatherConfig=${this._store.weatherConfig}
        .availableActions=${this._store.actions}
        .schemas=${this._store.schemas}
        .categories=${this._store.categories}
        @save-scene=${this._saveScene}
        @cancel-scene=${this._cancelScene}
      ></ambience-scene-editor>
      <ambience-traces-modal
        ?open=${this._viewingTraces!==null}
        .hass=${this.hass}
        .periods=${this._store.periods}
        .exposedActions=${this._store.actions}
        .scope=${this._viewingTraces?.scope??{scope_kind:"house",scope_id:null}}
        .category=${this._viewingTraces?.category??""}
        .categoryName=${this._viewingTraces?.categoryName??null}
        @close=${()=>{this._viewingTraces=null}}
      ></ambience-traces-modal>
      <ambience-auto-triggers-modal
        ?open=${this._autoTriggers!==null}
        .hass=${this.hass}
        .scope=${this._autoTriggers?.scope??{kind:"house"}}
        .category=${this._autoTriggers?.category}
        .categoryName=${this._autoTriggers?.categoryName??""}
        .scenes=${this._autoTriggerScenes()}
        @close=${()=>{this._autoTriggers=null}}
      ></ambience-auto-triggers-modal>
      <ambience-simulator-modal
        ?open=${this._viewingSimulator!==null}
        .hass=${this.hass}
        .periods=${this._store.periods}
        .exposedActions=${this._store.actions}
        .scope=${this._viewingSimulator?.scope??{scope_kind:"house",scope_id:null}}
        .category=${this._viewingSimulator?.category??""}
        .categoryName=${this._viewingSimulator?.categoryName??null}
        @close=${()=>{this._viewingSimulator=null}}
      ></ambience-simulator-modal>
    `}_renderScopeRow(e,i,r,a){let s=this._expanded.has(A(e)),d=e.kind==="house"?"":e.id,u=this._isSwitchedOff(e)?"off":this._matchingSceneCount(r)===0?"empty":"",h=r.enabled===!1;return l`
      <li class="scope-row ${a} ${h?"scope-disabled":""}" data-id=${d}>
        <div
          class="scope-header ${s?"open":""} ${u}"
          @click=${()=>this._toggleExpand(e)}
        >
          <span class="chevron ${s?"open":""}">▶</span>
          <ha-icon class="scope-icon" icon=${Qt(e,this.hass)}></ha-icon>
          <span class="scope-name">${i}</span>
          ${Zi(this.hass,r.scenes)}
          <span class="scope-summary">${this._summary(r)}</span>
          ${this._renderPauseIcon(e,r)}
          ${this._renderScopeSwitch(e,r)}
          <ambience-kebab-menu
            data-test="scope-kebab"
            ?muted=${u==="off"||h}
            .hass=${this.hass}
            .items=${[{id:"run",label:o(this.hass,"ui.run","Run"),icon:"mdi:play"}]}
            @menu-action=${p=>this._onScopeMenu(e,p.detail.id)}
            @click=${p=>p.stopPropagation()}
          ></ambience-kebab-menu>
        </div>
        ${s?l`
              <div class="scope-body">
                <ambience-scenes-list
                  .scenes=${r.scenes}
                  .scope=${e}
                  .live=${this._store.live}
                  .liveSuppressed=${h||this._isSwitchedOff(e)}
                  .periods=${this._store.periods}
                  .luxRanges=${this._store.luxRanges}
                  .weatherConfig=${this._store.weatherConfig}
                  .conditions=${this._store.conditions}
                  .availableActions=${this._store.actions}
                  .schemas=${this._store.schemas}
                  .categories=${this._store.categories}
                  .filterCategory=${this.filterCategory}
                  .collapsedCategories=${this._collapsedCategoriesFor(e)}
                  .hass=${this.hass}
                  @toggle-category-collapse=${p=>this._toggleCategoryCollapse(e,p)}
                  @add-scene=${p=>this._addScene(e,p.detail?.category)}
                  @edit-scene=${p=>this._editScene(e,p)}
                  @duplicate-scene=${p=>this._duplicateScene(e,p)}
                  @delete-scene=${p=>this._deleteScene(e,p)}
                  @reorder-scenes=${p=>this._reorderScenes(e,p)}
                  @unpin-scene=${p=>this._unpinScene(e,p)}
                  @toggle-scene-enabled=${p=>this._toggleSceneEnabled(e,p)}
                  @run-scene-actions=${p=>this._runSceneActions(e,p)}
                  @apply-category=${p=>this._applyScenes(e,p.detail.categoryId)}
                  @show-traces=${p=>this._showTraces(e,p.detail.category)}
                  @download-diagnostics=${p=>this._downloadDiagnostics(e,p.detail.category)}
                  @show-simulator=${p=>this._showSimulator(e,p.detail.category)}
                  @show-auto-triggers=${p=>this._showAutoTriggers(e,p.detail.category)}
                ></ambience-scenes-list>
              </div>
            `:""}
      </li>
    `}_pauseRemaining(e){let i=this.hass.states?.[e],r=i?.attributes?.off_at,a=Number(i?.attributes?.auto_on_delay_seconds??0);if(!r||!a)return 0;let s=(Date.now()-new Date(r).getTime())/1e3;return Math.max(0,Math.round(a-s))}_renderPauseIcon(e,i){if(i.enabled===!1)return"";let r=this._store.switchEntityIds.get(A(e));if(!r)return"";let a=this.hass.states?.[r]?.state==="off",s=u=>{u.stopPropagation(),this.hass.callService?.("switch",a?"turn_on":"turn_off",{entity_id:r})};if(!a)return l`<button
        class="scope-pause"
        data-test="scope-pause"
        title=${o(this.hass,"ui.pause_scope","Pause this scope")}
        @click=${s}
      >
        <ha-icon icon="mdi:timer-outline"></ha-icon>
      </button>`;let d=this._pauseRemaining(r);return l`<button
      class="scope-pause paused"
      data-test="scope-pause"
      title=${o(this.hass,"ui.resume_scope","Resume now")}
      @click=${s}
    >
      <ha-icon icon="mdi:timer"></ha-icon>
      <span class="countdown">${ph(d)}</span>
    </button>`}_renderScopeSwitch(e,i){let r=i.enabled!==!1;return kt({checked:r,dataTest:"scope-switch",onChange:async d=>{d.stopPropagation();try{await Qa(this.hass,e,!r),await Promise.all([this._store.reloadScope(e),this._store.refreshSwitches()])}catch(u){this._store.error=C(this.hass,u)}},className:"scope-switch",onClick:d=>d.stopPropagation()})}};Q.styles=[y`
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
      .spinner {
        display: inline-block;
        width: 1.1em;
        height: 1.1em;
        margin-right: 0.5em;
        vertical-align: -0.2em;
        border: 2px solid var(--divider-color, #e0e0e0);
        border-top-color: var(--primary-color, #03a9f4);
        border-radius: 50%;
        animation: ambience-spin 0.8s linear infinite;
      }
      @keyframes ambience-spin {
        to {
          transform: rotate(360deg);
        }
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
        /* A soft grey header strip. --secondary-background-color is the page
         backdrop (a fairly heavy grey); mixing it down toward the card colour
         gives the lighter section-header tint HA uses for similar dividers. */
        background: color-mix(
          in srgb,
          var(--secondary-background-color, #e0e0e0) 50%,
          var(--card-background-color, #fff)
        );
        /* Collapsed: round all corners to match the card. */
        border-radius: 4px;
      }
      /* Expanded: only the top corners round, so the grey header meets the white
       body below with a flush edge. */
      .scope-header.open {
        border-radius: 4px 4px 0 0;
      }
      /* Faded ("empty"): the scope is on but has no rules in the active category.
       Dim the glyphs + text so it recedes behind active scopes; the switch and
       kebab stay full-strength so the row is still operable. */
      .scope-header.empty .chevron,
      .scope-header.empty .scope-icon,
      .scope-header.empty .scope-name,
      .scope-header.empty .scope-summary {
        opacity: 0.5;
      }
      /* Disabled ("off"): the scope's switch is off. Read more emphatically
       disabled than the faded state — flatten the header tint and dim its
       contents harder — while leaving the switch fully lit to re-enable. The
       kebab dims too, but via its own "muted" attribute (see the row below)
       so the dim reaches only the trigger, not the open menu popup. */
      .scope-header.off {
        /* A barely-there grey (≈ #f8f8f8 on the default light theme) — paler
         than the active header so a disabled scope reads washed-out. */
        background: color-mix(
          in srgb,
          var(--secondary-background-color, #e0e0e0) 25%,
          var(--card-background-color, #fff)
        );
      }
      .scope-header.off .chevron,
      .scope-header.off .scope-icon,
      .scope-header.off .scope-name,
      .scope-header.off .scope-summary {
        opacity: 0.4;
      }
      .chevron {
        width: 1em;
        color: var(--secondary-text-color, #888);
        transition: transform 0.1s;
      }
      .chevron.open {
        transform: rotate(90deg);
      }
      /* Scope icon (HA's area/floor icon, or a per-kind default) sits between the
         chevron and the name, sized + coloured like the other header glyphs. */
      .scope-icon {
        flex: 0 0 auto;
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color, #888);
      }
      .scope-name {
        flex: 1;
        /* Same flex idiom as scenes-list .body: let the name shrink below its
           intrinsic width and break a long unbreakable scope name, so it can't
           force the header wider than the card and push the switch/kebab out. */
        min-width: 0;
        overflow-wrap: anywhere;
        text-align: left;
        font-weight: 600;
      }
      .scope-header ambience-problem-flag {
        margin-left: 0.25rem;
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
      .scope-pause {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--secondary-text-color);
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px;
      }
      .scope-pause.paused {
        color: var(--warning-color, #ffa600);
      }
      .scope-pause .countdown {
        font-variant-numeric: tabular-nums;
        font-size: 0.85em;
      }
      .scope-body {
        padding: 0.5rem 1rem 1rem 1rem;
        border-top: 1px solid var(--divider-color, #e0e0e0);
      }
      .undo-toolbar {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 8px;
      }
      /* Next-change caption: takes the free space and truncates, so the buttons
       stay pinned right and a long label never wraps the toolbar. Full text is
       on the span's title (desktop hover). */
      .undo-caption {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.85rem;
        color: var(--secondary-text-color, #888);
      }
    `],c([m({attribute:!1})],Q.prototype,"hass",2),c([g()],Q.prototype,"_expanded",2),c([g()],Q.prototype,"_collapsedCategories",2),c([g()],Q.prototype,"_conditionsHintDismissed",2),c([g()],Q.prototype,"_editing",2),c([g()],Q.prototype,"_sceneEditorError",2),c([g()],Q.prototype,"_viewingTraces",2),c([g()],Q.prototype,"_viewingSimulator",2),c([g()],Q.prototype,"_autoTriggers",2),c([m({attribute:!1})],Q.prototype,"filterCategory",2),Q=c([w("ambience-scopes-view")],Q);var _h=[{field:"expose_assist",labelKey:"ui.settings_expose_assist",label:"Assist",dataTest:"expose-assist"},{field:"expose_google",labelKey:"ui.settings_expose_google",label:"Google Assistant",dataTest:"expose-google"},{field:"expose_alexa",labelKey:"ui.settings_expose_alexa",label:"Alexa",dataTest:"expose-alexa"}],we=class extends b{constructor(){super(...arguments);this._defaults={name:"Ambience",auto_on_delay_seconds:0};this._reapply={enabled:!1,interval_seconds:3600};this._exposed={expose_assist:!0,expose_google:!1,expose_alexa:!1};this._error=""}async connectedCallback(){super.connectedCallback();try{this._defaults=await Ka(this.hass),this._reapply=await Za(this.hass),this._exposed=await es(this.hass)}catch(e){this._error=C(this.hass,e)}}async _safeSave(e){try{await e(),this._error=""}catch(i){this._error=C(this.hass,i)}}_saveDefaults(){this._safeSave(()=>Ja(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds))}_onDefaultName(e){let i=e.target,r=i.value.trim();if(!r){i.value=this._defaults.name;return}this._defaults={...this._defaults,name:r},this._saveDefaults()}_onPauseMinutes(e){let i=e.target,r=Math.floor(Number(i.value));if(i.value===""||!Number.isFinite(r)||r<0){i.value=String(Math.round(this._defaults.auto_on_delay_seconds/60));return}this._defaults={...this._defaults,auto_on_delay_seconds:r*60},this._saveDefaults()}_saveReapply(){this._safeSave(()=>Xa(this.hass,this._reapply.enabled,this._reapply.interval_seconds))}_onReapplyEnabled(e){this._reapply={...this._reapply,enabled:e.target.checked},this._saveReapply()}_onReapplyMinutes(e){let i=e.target,r=Math.floor(Number(i.value));if(i.value===""||!Number.isFinite(r)||r<1){i.value=String(Math.round(this._reapply.interval_seconds/60));return}this._reapply={...this._reapply,interval_seconds:r*60},this._saveReapply()}_saveExposed(){this._safeSave(()=>ts(this.hass,this._exposed.expose_assist,this._exposed.expose_google,this._exposed.expose_alexa))}_onExpose(e,i){this._exposed={...this._exposed,[e]:i.target.checked},this._saveExposed()}_renderToggle(e,i,r,a=!1){return kt({checked:e,dataTest:i,onChange:r,disabled:a})}render(){return l`
      ${this._error?l`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:""}

      <div class="card">
        <!-- Reuses .toggle-row purely for its section-header styling (bold label
             + divider); this header has no toggle (switches are always created). -->
        <div class="row toggle-row">
          <label>
            ${o(this.hass,"ui.settings_ambience_pause_card","Scope-level pause switch")}
            <ambience-help
              .hass=${this.hass}
              .text=${o(this.hass,"ui.help_pause_switch","Ambience creates a switch entity for every enabled area, floor, and house scope. Turning a scope's switch off pauses Ambience for that scope.")}
              .docPath=${"getting-started/step-8-pausing-and-disabling-scopes"}
            ></ambience-help>
          </label>
        </div>
        <div class="row">
          <label>
            ${o(this.hass,"ui.settings_ambience_field_name","Switch name")}
            <ambience-help
              .hass=${this.hass}
              .text=${o(this.hass,"ui.help_switch_name","The name used for the per-scope pause switch entities.")}
            ></ambience-help>
          </label>
          <input
            data-test="defaults-name"
            type="text"
            .value=${this._defaults.name}
            @change=${e=>this._onDefaultName(e)}
          />
        </div>
        <div class="row">
          <label>
            ${o(this.hass,"ui.settings_ambience_field_pause","Pause for")}
            <ambience-help
              .hass=${this.hass}
              .text=${o(this.hass,"ui.help_pause_for","When a scope's switch is turned off, auto-resume after this many minutes. 0 = stays paused until turned back on.")}
            ></ambience-help>
          </label>
          <input
            data-test="pause-for-minutes"
            type="number"
            min="0"
            .value=${String(Math.round(this._defaults.auto_on_delay_seconds/60))}
            @change=${e=>this._onPauseMinutes(e)}
          />
          <span class="unit"
            >${o(this.hass,"ui.unit_minutes","minutes")}</span
          >
        </div>
        <div class="expose-group" data-test="expose-group">
          <div class="expose-heading">
            ${o(this.hass,"ui.settings_expose_group","Expose to voice assistants")}
            <ambience-help
              .hass=${this.hass}
              .text=${o(this.hass,"ui.help_expose","Expose the per-scope pause switches to the selected voice assistants so you can pause/resume Ambience by voice. Google Assistant and Alexa require Home Assistant Cloud or a manual setup.")}
            ></ambience-help>
          </div>
          <div class="expose-rows">
            ${_h.map(e=>l`
                <div class="row">
                  <label>${o(this.hass,e.labelKey,e.label)}</label>
                  ${this._renderToggle(this._exposed[e.field],e.dataTest,i=>this._onExpose(e.field,i))}
                </div>
              `)}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="row toggle-row">
          <label>
            ${o(this.hass,"ui.settings_reapply_enable_label","Re-run all scenes after inactivity")}
            <ambience-help
              .hass=${this.hass}
              .text=${o(this.hass,"ui.help_reapply_toggle","Re-run the scenes for a scope/category after inactivity and re-apply the winning scene, in case any action had previously failed, such as a light not turning off.")}
            ></ambience-help>
          </label>
          ${this._renderToggle(this._reapply.enabled,"reapply-enabled",e=>this._onReapplyEnabled(e))}
        </div>
        <div class="row">
          <label>
            ${o(this.hass,"ui.settings_reapply_interval_label","Re-run after")}
            <ambience-help
              .hass=${this.hass}
              .text=${o(this.hass,"ui.help_reapply_after","Re-run scenes that haven't been updated for this many minutes.")}
            ></ambience-help>
          </label>
          <input
            data-test="reapply-interval-minutes"
            type="number"
            min="1"
            ?disabled=${!this._reapply.enabled}
            .value=${String(Math.round(this._reapply.interval_seconds/60))}
            @change=${e=>this._onReapplyMinutes(e)}
          />
          <span class="unit"
            >${o(this.hass,"ui.unit_minutes","minutes")}</span
          >
        </div>
      </div>
    `}};we.styles=y`
    :host {
      display: block;
    }
    .card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      /* White cards on a white dialog: a larger gap plus a faint lift make the
         two top-level sections read as clearly separate. */
      margin-bottom: 1.5rem;
      padding: 1rem;
      box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.08));
    }
    .card:last-child {
      margin-bottom: 0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }
    .row label {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      /* Field labels sit a notch lighter than the section headings so they
         stop competing with them. */
      font-weight: 500;
      /* Label column is a fixed half-width so the fields beside it line up. */
      flex: 0 0 50%;
    }
    /* A section header: the master toggle that gates the whole card. Larger and
       bold, with a divider beneath it. */
    .toggle-row {
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      padding-bottom: 0.75rem;
      margin-bottom: 0.9rem;
    }
    .toggle-row label {
      font-weight: 700;
      font-size: 1.05rem;
    }
    /* The voice-assistant controls form a sub-section nested under the pause
       switch: a quiet sub-heading above the toggle rows, whose label text is
       indented so the rows read as nested — while the switches stay on the same
       column as the controls in the rows above. */
    .expose-group {
      margin-top: 1rem;
    }
    .expose-heading {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--secondary-text-color, #8b919b);
      margin-bottom: 0.5rem;
    }
    .expose-rows .row:last-child {
      margin-bottom: 0;
    }
    .expose-rows label {
      /* Indent only the label text; keep the fixed 50% column so the switch
         lines up with the fields' control column above, not flush right. */
      box-sizing: border-box;
      padding-left: 1rem;
    }
    input[type="text"],
    input[type="number"] {
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, inherit);
    }
    input[type="text"] {
      /* Fill the remaining half beside the 50% label, on the same line. */
      flex: 1 1 auto;
      min-width: 0;
      box-sizing: border-box;
    }
    input[type="number"] {
      width: 5rem;
    }
    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .unit {
      margin-left: 0.4rem;
      color: var(--secondary-text-color, #888);
    }
  `,c([m({attribute:!1})],we.prototype,"hass",2),c([g()],we.prototype,"_defaults",2),c([g()],we.prototype,"_reapply",2),c([g()],we.prototype,"_exposed",2),c([g()],we.prototype,"_error",2),we=c([w("ambience-ambience-settings")],we);function el(){let t=globalThis.crypto;if(t?.randomUUID)return t.randomUUID().replace(/-/g,"");if(t?.getRandomValues){let n=t.getRandomValues(new Uint8Array(16));return Array.from(n,e=>e.toString(16).padStart(2,"0")).join("")}return Array.from({length:4},()=>Math.floor(Math.random()*4294967296).toString(16).padStart(8,"0")).join("")}var xe=class extends b{constructor(){super(...arguments);this._categories=[];this._error="";this._editing=null;this._modalError=""}async connectedCallback(){super.connectedCallback();try{this._categories=await Se(this.hass)}catch(e){this._error=C(this.hass,e)}}_sorted(){return[...this._categories].sort((e,i)=>e.name.localeCompare(i.name))}_validate(e){let i=e.name.trim();if(i==="")return o(this.hass,"ui.category_name_blank_error","Category names can't be empty.");let r=i.toLocaleLowerCase();return this._categories.some(s=>s.id!==e.id&&s.name.trim().toLocaleLowerCase()===r)?o(this.hass,"ui.category_name_duplicate_error","Two categories can't have the same name."):""}_openEditor(e){this._editing={...e},this._modalError=""}_addCategory(){let e=el();this._editing={id:e,name:""},this._modalError=""}_closeModal(){this._editing=null,this._modalError=""}_patchDraft(e){this._editing&&(this._editing={...this._editing,...e})}_onName(e){this._patchDraft({name:e.target.value})}_onIcon(e){this._patchDraft({icon:e||void 0})}_onColor(e){this._patchDraft({color:e})}_save(){if(!this._editing)return;let e=this._validate(this._editing);if(e){this._modalError=e;return}let i={...this._editing,name:this._editing.name.trim()},r=this._categories.some(s=>s.id===i.id),a=this._categories;this._categories=r?this._categories.map(s=>s.id===i.id?i:s):[...this._categories,i],this._closeModal(),ji(this.hass,this._categories).then(()=>{window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(s=>{this._categories=a,this._error=C(this.hass,s)})}_deleteCategory(){if(!this._editing)return;let e=this._editing.id;if(this._categories.length<=1){this._modalError=o(this.hass,"ui.category_delete_blocked_last","You can't delete the last category.");return}let i=this._categories;this._categories=this._categories.filter(r=>r.id!==e),is(this.hass,e).then(()=>{this._closeModal(),window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(r=>{this._categories=i;let a=r.code;a==="category_in_use"?this._modalError=o(this.hass,"ui.category_delete_blocked_in_use","This category still has scenes \u2014 move or delete them first."):a==="category_last"?this._modalError=o(this.hass,"ui.category_delete_blocked_last","You can't delete the last category."):this._modalError=C(this.hass,r)})}_renderIconField(){return customElements.get("ha-icon-picker")?l`<ha-icon-picker
        .hass=${this.hass}
        .value=${this._editing.icon??""}
        @value-changed=${e=>{e.stopPropagation(),this._onIcon(e.detail.value)}}
      ></ha-icon-picker>`:l`<input
      class="icon-input"
      .value=${this._editing.icon??""}
      placeholder=${o(this.hass,"ui.category_icon","Icon")}
      @change=${e=>this._onIcon(e.target.value)}
    />`}_renderSwatches(){let e=this._editing.color;return l`
      <div class="swatches">
        ${Xn.map(i=>{let r=ca(this.hass,i.id,i.label);return l`<button
            type="button"
            class="swatch ${e===i.id?"selected":""}"
            style=${`background: ${i.hex}`}
            title=${r}
            aria-label=${r}
            aria-pressed=${e===i.id}
            @click=${()=>this._onColor(i.id)}
          ></button>`})}
        <button
          type="button"
          class="swatch none ${e==null?"selected":""}"
          title=${o(this.hass,"ui.category_color_none","No colour")}
          aria-label=${o(this.hass,"ui.category_color_none","No colour")}
          aria-pressed=${e==null}
          @click=${()=>this._onColor(void 0)}
        >✕</button>
      </div>
    `}_renderModal(){if(!this._editing)return"";let e=this._categories.some(r=>r.id===this._editing.id),i=e?o(this.hass,"ui.category_edit_title","Edit category"):o(this.hass,"ui.category_add_title","Add category");return l`
      <div
        class="overlay"
        @click=${r=>{r.target.classList.contains("overlay")&&this._closeModal()}}
      >
        <div class="modal">
          <div class="modal-header">
            <h3>${i}</h3>
            <button
              class="close"
              title=${o(this.hass,"ui.cancel","Cancel")}
              aria-label=${o(this.hass,"ui.cancel","Cancel")}
              @click=${()=>this._closeModal()}
            >✕</button>
          </div>
          <div class="modal-content">
            <label>${o(this.hass,"ui.category_name_placeholder","Category name")}</label>
            <input
              class="name"
              .value=${this._editing.name}
              placeholder=${o(this.hass,"ui.category_name_placeholder","Category name")}
              aria-label=${o(this.hass,"ui.category_name_placeholder","Category name")}
              @input=${this._onName}
            />

            <label>${o(this.hass,"ui.category_icon","Icon")}</label>
            ${this._renderIconField()}

            <label>${o(this.hass,"ui.category_color","Colour")}</label>
            ${this._renderSwatches()}

            ${this._modalError?l`<p class="modal-error">${this._modalError}</p>`:""}
          </div>
          <div class="modal-footer">
            ${e?l`<button class="delete" @click=${()=>this._deleteCategory()}>
                  ${o(this.hass,"ui.title_delete","Delete")}
                </button>`:l`<span></span>`}
            <div class="right">
              <button class="primary" @click=${()=>this._save()}>
                ${o(this.hass,"ui.category_save","Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    `}render(){return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      <div class="list">
        ${this._sorted().map(e=>{let i=er(e.color);return l`<button class="category-row" @click=${()=>this._openEditor(e)}>
            <span class="row-icon">${e.icon?l`<ha-icon icon=${e.icon}></ha-icon>`:""}</span>
            <span class="row-swatch ${i?"":"none"}" style=${i?`background: ${i}`:""}></span>
            <span class="row-name">${e.name}</span>
          </button>`})}
      </div>
      <div class="add-row">
        <button class="add" @click=${()=>this._addCategory()}>
          ${o(this.hass,"ui.category_add","+ Add category")}
        </button>
        <ambience-help .hass=${this.hass} .text=${o(this.hass,"ui.help_categories_tab","Categories let one scope have several independent winners at once \u2014 one scene wins per category.")} .docPath=${"getting-started/step-1-scopes-and-categories"}></ambience-help>
      </div>
      ${this._renderModal()}
    `}};xe.styles=y`
    :host { display: block; }
    .list {
      display: flex; flex-direction: column;
      margin-bottom: 0.75rem;
    }
    button.category-row {
      display: flex; align-items: center; gap: 1rem;
      width: 100%; text-align: left;
      background: none; border: none; border-top: 1px solid var(--divider-color, #e0e0e0);
      padding: 0.75rem 0.5rem; cursor: pointer; color: inherit; font: inherit;
    }
    button.category-row:last-of-type { border-bottom: 1px solid var(--divider-color, #e0e0e0); }
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
    .add-row {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Modal overlay (mirrors ambience-scene-editor) */
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
  `,c([m({attribute:!1})],xe.prototype,"hass",2),c([g()],xe.prototype,"_categories",2),c([g()],xe.prototype,"_error",2),c([g()],xe.prototype,"_editing",2),c([g()],xe.prototype,"_modalError",2),xe=c([w("ambience-categories-settings")],xe);var Pe=class extends b{constructor(){super(...arguments);this.conditionName="";this.conditionDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let e=K(this.hass,this.conditionName);return l`
      <div class="card">
        <header @click=${this._toggleExpand}>
          <span class="chevron ${this._expanded?"open":""}">▶</span>
          <label>
            <div class="name">${e}</div>
            <div class="description">${this.conditionDescription}</div>
          </label>
          <ambience-help
            .hass=${this.hass}
            .docPath=${Xi(this.conditionName)??""}
          ></ambience-help>
        </header>
        <div class="body ${this._expanded?"":"collapsed"}">
          <slot></slot>
        </div>
      </div>
    `}};Pe.styles=y`
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
  `,c([m({attribute:!1})],Pe.prototype,"hass",2),c([m()],Pe.prototype,"conditionName",2),c([m()],Pe.prototype,"conditionDescription",2),c([g()],Pe.prototype,"_expanded",2),Pe=c([w("ambience-condition-card")],Pe);var gh=/^[a-z][a-z0-9_]*$/;function fh(t){return t.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var _i=y`
  :host {
    position: fixed; inset: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0, 0, 0, 0.45); z-index: 1000;
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
  input {
    padding: 0.5rem; border: 1px solid var(--divider-color, #ccc);
    border-radius: 4px; background: var(--card-background-color, #fff); color: inherit;
  }
  .error { color: var(--error-color, #c00); font-size: 0.85em; min-height: 1em; }
  .actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem; }
  button { padding: 0.5rem 1rem; cursor: pointer; }
`,ue=class extends b{constructor(){super(...arguments);this.takenIds=new Set;this._label="";this._error=""}static{this.styles=_i}connectedCallback(){super.connectedCallback(),this._label=this._initialLabel()??""}_onLabelInput(e){this._label=e.target.value}_validateName(e){return this.existingId?"":this._label.trim()?!e||!gh.test(e)?o(this.hass,"ui.error_start_letter","Name must start with a letter."):this.takenIds.has(e)?o(this.hass,"ui.error_name_exists","An entry with this name already exists. Choose a different name."):"":o(this.hass,"ui.error_enter_name","Please enter a name.")}_onSave(){let e=this.existingId??fh(this._label),i=this._validateName(e)||this._validateDef();if(i){this._error=i,this.performUpdate();return}this.dispatchEvent(new CustomEvent(this._saveEvent,{detail:{id:e,definition:this._buildDefinition()},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent(this._cancelEvent,{bubbles:!0,composed:!0}))}render(){let e=this.existingId?this._editTitleTemplate().replace("{name}",this._initialLabel()??this.existingId):this._addTitle();return l`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <div class="field">
          <label for="label">${o(this.hass,"ui.name","Name")}</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput}
            placeholder=${this._namePlaceholder()} />
        </div>
        ${this._renderFields()}
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>${o(this.hass,"ui.cancel","Cancel")}</button>
          <button @click=${this._onSave}>${o(this.hass,"ui.save","Save")}</button>
        </div>
      </div>
    `}};c([m({attribute:!1})],ue.prototype,"hass",2),c([m({attribute:!1})],ue.prototype,"existingId",2),c([m({attribute:!1})],ue.prototype,"takenIds",2),c([g()],ue.prototype,"_label",2),c([g()],ue.prototype,"_error",2);var pt=class extends ue{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this._def=this.initial}connectedCallback(){super.connectedCallback(),this._def=this.initial}get _saveEvent(){return"period-save"}get _cancelEvent(){return"period-cancel"}_addTitle(){return o(this.hass,"ui.period_modal_add_title","Add custom period")}_editTitleTemplate(){return o(this.hass,"ui.period_modal_edit_title",'Edit "{name}"')}_namePlaceholder(){return o(this.hass,"ui.name_placeholder","e.g. Wind down")}_initialLabel(){return this.initial.label??(this.existingId?he(this.hass,this.existingId,{}):null)}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_renderFields(){return l`
      <div class="row">
        <label style="min-width: 3em;">${o(this.hass,"ui.from_label","From")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
      </div>
      <div class="row">
        <label style="min-width: 3em;">${o(this.hass,"ui.to_label","To")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
      </div>
    `}_validateDef(){return""}_buildDefinition(){return{from:this._def.from,to:this._def.to,label:this._label.trim()||null}}};pt.styles=[_i,y`
      .row { display: flex; align-items: center; gap: 0.5rem; }
    `],c([m({attribute:!1})],pt.prototype,"initial",2),c([g()],pt.prototype,"_def",2),pt=c([w("ambience-period-edit-modal")],pt);function tl(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=ne(n,t.anchor);if(t.offset_min===0)return e;let i=Math.abs(t.offset_min),r=i%60===0?`${i/60}${o(n,"ui.unit_hour_abbr","h")}`:`${i}${o(n,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${r}`}var Tn=class extends ve{_list(){return Mi(this.hass)}async _save(n,e){await Wa(this.hass,n,e)}_label(n,e){return he(this.hass,n,e)}_formatDef(n){return`${tl(n.from,this.hass)} \u2192 ${tl(n.to,this.hass)}`}_headingKey(){return["ui.periods_heading","Periods"]}_addKey(){return["ui.add_custom_period","+ Add custom period"]}_renderModal(){let n=this._modal;return n.mode==="edit"?l`<ambience-period-edit-modal
        .hass=${this.hass}
        .existingId=${n.id}
        .initial=${n.initial}
        .takenIds=${this._takenIds()}
        @period-save=${this._onModalSave}
        @period-cancel=${this._onModalCancel}
      ></ambience-period-edit-modal>`:n.mode==="add"?l`<ambience-period-edit-modal
        .hass=${this.hass}
        .takenIds=${this._takenIds()}
        @period-save=${this._onModalSave}
        @period-cancel=${this._onModalCancel}
      ></ambience-period-edit-modal>`:l``}};Tn=c([w("ambience-time-of-day-config")],Tn);var Ge=class extends ue{constructor(){super(...arguments);this.initial={min:0,max:100,label:null};this._min=null;this._max=null}connectedCallback(){super.connectedCallback(),this._min=this.initial.min??null,this._max=this.initial.max??null}get _saveEvent(){return"lux-range-save"}get _cancelEvent(){return"lux-range-cancel"}_addTitle(){return o(this.hass,"ui.lux_modal_add_title","Add custom lux range")}_editTitleTemplate(){return o(this.hass,"ui.lux_modal_edit_title",'Edit "{name}"')}_namePlaceholder(){return o(this.hass,"ui.lux_name_placeholder","e.g. Gloomy")}_initialLabel(){return this.initial.label??(this.existingId?Re(this.hass,this.existingId,{}):null)}_onMinInput(e){let i=e.target.value;this._min=i===""?null:Number(i)}_onMaxInput(e){let i=e.target.value;this._max=i===""?null:Number(i)}_renderFields(){return l`
      <div class="row">
        <div class="field">
          <label for="min">${o(this.hass,"ui.lux_min_label","Min (lx)")}</label>
          <input id="min" type="number" min="0" step="1" .value=${this._min==null?"":String(this._min)}
            @input=${this._onMinInput} placeholder=${o(this.hass,"ui.lux_min_placeholder","0")} />
        </div>
        <div class="field">
          <label for="max">${o(this.hass,"ui.lux_max_label","Max (lx)")}</label>
          <input id="max" type="number" min="0" step="1" .value=${this._max==null?"":String(this._max)}
            @input=${this._onMaxInput} placeholder=${o(this.hass,"ui.lux_max_placeholder","\u221E")} />
        </div>
      </div>
    `}_validateDef(){return this._min==null&&this._max==null?o(this.hass,"ui.lux_error_need_bound","Enter a min, a max, or both."):Rr(this._min,this._max,this.hass)??""}_buildDefinition(){let e={label:this._label.trim()||null};return this._min!=null&&(e.min=this._min),this._max!=null&&(e.max=this._max),e}};Ge.styles=[_i,y`
      .row { display: flex; gap: 1rem; }
      .row .field { flex: 1; }
    `],c([m({attribute:!1})],Ge.prototype,"initial",2),c([g()],Ge.prototype,"_min",2),c([g()],Ge.prototype,"_max",2),Ge=c([w("ambience-lux-edit-modal")],Ge);var Pn=class extends ve{_list(){return Fi(this.hass)}async _save(n,e){await Ba(this.hass,n,e)}_label(n,e){return Re(this.hass,n,e)}_formatDef(n){return hr(n.min,n.max,"any")}_headingKey(){return["ui.lux_heading","Lux ranges"]}_addKey(){return["ui.add_custom_lux_range","+ Add custom lux range"]}_renderModal(){let n=this._modal;return n.mode==="edit"?l`<ambience-lux-edit-modal
        .hass=${this.hass}
        .existingId=${n.id}
        .initial=${n.initial}
        .takenIds=${this._takenIds()}
        @lux-range-save=${this._onModalSave}
        @lux-range-cancel=${this._onModalCancel}
      ></ambience-lux-edit-modal>`:n.mode==="add"?l`<ambience-lux-edit-modal
        .hass=${this.hass}
        .takenIds=${this._takenIds()}
        @lux-range-save=${this._onModalSave}
        @lux-range-cancel=${this._onModalCancel}
      ></ambience-lux-edit-modal>`:l``}};Pn=c([w("ambience-lux-config")],Pn);var Ke=class extends b{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._error=""}async connectedCallback(){super.connectedCallback(),ie(this);try{this._config=await Gt(this.hass)}catch(e){this._error=C(this.hass,e)}}async _save(e){this._config=e;try{await Va(this.hass,e.workday_sensor,e.workday_calendar),this._error=""}catch(i){this._error=C(this.hass,i);return}window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=this._error?l`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:"";return l`
      ${e}
      <div class="row">
        <label>${o(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        ${ci(this.hass,"workday_sensor",this._config.workday_sensor,{entity:{integration:"workday",domain:"binary_sensor"}},"binary_sensor.workday",i=>this._onSensorChange({detail:{value:i}}))}
      </div>
      <div class="row">
        <label>${o(this.hass,"ui.workday_calendar","Workday calendar")}</label>
        ${ci(this.hass,"workday_calendar",this._config.workday_calendar,{entity:{integration:"workday",domain:"calendar"}},"calendar.workday",i=>this._onCalendarChange({detail:{value:i}}))}
      </div>
    `}};Ke.styles=y`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
  `,c([m({attribute:!1})],Ke.prototype,"hass",2),c([g()],Ke.prototype,"_config",2),c([g()],Ke.prototype,"_error",2),Ke=c([w("ambience-day-config")],Ke);var vh=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],Ye=class extends b{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._expanded=new Set}async connectedCallback(){super.connectedCallback(),ie(this),this._config=await Kt(this.hass)}async _persist(){await Ga(this.hass,this._config.entity,this._config.groups),window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onEntityChange(e){this._config={...this._config,entity:e.detail.value||null},this._persist()}_nextGroupId(e){let i=new Set(e.map(r=>r.id));for(let r=1;r<=e.length+1;r++){let a=`group_${r}`;if(!i.has(a))return a}return`group_${e.length+1}`}_addGroup(){let e=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:e,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,e]),this._persist()}_toggleExpand(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}_updateGroup(e,i){this._config={...this._config,groups:this._config.groups.map((r,a)=>a===e?{...r,...i}:r)},this._persist()}_removeGroup(e){let i=this._config.groups[e];if(this._config={...this._config,groups:this._config.groups.filter((r,a)=>a!==e)},i){let r=new Set(this._expanded);r.delete(i.id),this._expanded=r}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:vh.map(e=>({value:e,label:yt(this.hass,e)}))}}}]}_renderConditions(e,i){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:i.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${a=>{a.stopPropagation(),this._updateGroup(e,{conditions:a.detail.value.conditions??[]})}}
      ></ha-form>`;let r=i.conditions.map(a=>yt(this.hass,a));return l`<span class="conditions-list">${r.join(", ")}</span>`}_renderGroup(e,i){let r=this._expanded.has(i.id),a=i.conditions.map(s=>yt(this.hass,s)).join(", ");return l`
      <div class="group">
        <div class="group-header" @click=${()=>this._toggleExpand(i.id)}>
          <span class="chevron ${r?"open":""}">▶</span>
          <span class="label">${i.label}</span>
          <span class="codes">${a}</span>
          <button
            class="icon"
            title=${o(this.hass,"ui.title_delete","Delete")}
            @click=${s=>{s.stopPropagation(),this._removeGroup(e)}}
          >✕</button>
        </div>
        ${r?l`<div class="body" @click=${s=>s.stopPropagation()}>
              <input
                .value=${i.label}
                aria-label=${i.label}
                @change=${s=>this._updateGroup(e,{label:s.target.value})}
              />
              ${this._renderConditions(e,i)}
            </div>`:""}
      </div>
    `}render(){return l`
      <div class="row">
        <label class="section">${o(this.hass,"ui.weather_entity","Weather entity")}</label>
        ${ci(this.hass,"entity",this._config.entity,{entity:{domain:"weather"}},"weather.home",e=>this._onEntityChange({detail:{value:e}}))}
      </div>

      <h4>${o(this.hass,"ui.groups","Groups")}</h4>
      ${this._config.groups.map((e,i)=>this._renderGroup(i,e))}
      <button class="add" @click=${()=>this._addGroup()}>
        ${o(this.hass,"ui.add_group","+ Add group")}
      </button>
    `}};Ye.styles=y`
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
  `,c([m({attribute:!1})],Ye.prototype,"hass",2),c([g()],Ye.prototype,"_config",2),c([g()],Ye.prototype,"_expanded",2),Ye=c([w("ambience-weather-config")],Ye);var il={time_of_day:t=>l`<ambience-time-of-day-config .hass=${t}></ambience-time-of-day-config>`,lux:t=>l`<ambience-lux-config .hass=${t}></ambience-lux-config>`,day:t=>l`<ambience-day-config .hass=${t}></ambience-day-config>`,weather:t=>l`<ambience-weather-config .hass=${t}></ambience-weather-config>`},yh=new Set(Object.keys(il)),Qe=class extends b{constructor(){super(...arguments);this._conditions=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._conditions=await zi(this.hass)}catch(e){this._error=C(this.hass,e)}}render(){let e=this._conditions.filter(i=>yh.has(i.name)).slice().sort((i,r)=>r.priority-i.priority);return l`
      <div class="tab-heading">
        <span>${o(this.hass,"ui.settings_tab_conditions","Conditions")}</span>
        <ambience-help .hass=${this.hass} .text=${o(this.hass,"ui.help_conditions_tab","Conditions are the inputs scenes match on (time of day, presence, weather, \u2026). A scene wins when all its conditions pass.")} .docPath=${"reference/conditions"}></ambience-help>
      </div>
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${e.map(i=>l`
        <ambience-condition-card .hass=${this.hass} .conditionName=${i.name} .conditionDescription=${i.description}>
          ${il[i.name]?.(this.hass)??l``}
        </ambience-condition-card>
      `)}
    `}};Qe.styles=y`
    :host { display: block; }
    .error { color: var(--error-color, #d32f2f); }
    .tab-heading {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }
  `,c([m({attribute:!1})],Qe.prototype,"hass",2),c([g()],Qe.prototype,"_conditions",2),c([g()],Qe.prototype,"_error",2),Qe=c([w("ambience-conditions-settings")],Qe);function nl(t,n){let e=t?.config?.components;return Array.isArray(e)&&e.includes(n)}var bh="fado",wh="https://my.home-assistant.io/redirect/hacs_repository/?owner=clintongormley&repository=ha-fado",H=class extends b{constructor(){super(...arguments);this._actions=[];this._services=[];this._schemas={};this._fieldSchemas={};this._addSchema=[];this._serviceById=new Map;this._availableServices=[];this._expanded=new Set;this._adding=!1;this._loadError=null;this._saveError=null;this._loaded=!1;this._fadoNoticeDismissed=!1;this._installId=null;this._editingDefault=null;this._editingOriginalValue=void 0;this._editingOriginalHad=!1;this._drag=new Ct(this,(e,i)=>{let r=[...this._actions],[a]=r.splice(e,1);r.splice(i,0,a),this._actions=r,this._autoSave()});this._onDocPointerDown=e=>{if(!this._adding&&this._editingDefault===null)return;let i=e.composedPath(),r=i.some(a=>a instanceof Element&&H._OVERLAY_TAG_RE.test(a.localName));this._collapseAddFormOnClickAway(i,r),this._cancelEditingDefaultOnClickAway(i,r)}}_collapseAddFormOnClickAway(e,i){if(!this._adding)return;let r=this.shadowRoot?.querySelector(".add-row");!(!!r&&e.includes(r))&&!i&&(this._adding=!1)}_cancelEditingDefaultOnClickAway(e,i){if(this._editingDefault===null)return;let r=this.shadowRoot?.querySelector(`.field-row-editor[data-editing-key="${this._editingDefault}"]`);(!r||!e.includes(r))&&!i&&this._cancelEditingDefault()}connectedCallback(){super.connectedCallback(),document.addEventListener("pointerdown",this._onDocPointerDown),customElements.get("ha-service-picker")||customElements.whenDefined("ha-service-picker").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._onDocPointerDown)}_startEditingDefault(e,i){let a=this._actions.find(s=>s.id===e)?.defaults??{};this._editingOriginalHad=i in a,this._editingOriginalValue=a[i],this._editingDefault=`${e}:${i}`}_saveEditingDefault(){this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1,this._autoSave()}_cancelEditingDefault(){let e=this._editingDefault;if(e){let i=e.indexOf(":"),r=e.slice(0,i),a=e.slice(i+1);this._actions=this._actions.map(s=>{if(s.id!==r)return s;let d={...s.defaults??{}};return this._editingOriginalHad?d[a]=this._editingOriginalValue:delete d[a],{...s,defaults:d}})}this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1}async firstUpdated(){await this._reload()}willUpdate(e){if(e.has("_actions")||e.has("_schemas")){let i={};for(let r of this._actions){let a=this._schemas[r.id];if(a)for(let[s,d]of Object.entries(a.fields))i[`${r.id}:${s}`]=[{name:s,selector:d.selector??{text:{}},required:!1}]}this._fieldSchemas=i}if(e.has("_services")&&(this._serviceById=new Map(this._services.map(i=>[i.id,i]))),e.has("_actions")||e.has("_services")){let i=new Set(this._actions.map(r=>r.id));this._availableServices=this._services.filter(r=>!i.has(r.id)),this._addSchema=[{name:"service",selector:{select:{options:this._availableServices.map(r=>({value:r.id,label:this._addOptionLabel(r.id)})),custom_value:!0,mode:"dropdown",sort:!0}}}]}}async _reload(){this._loadError=null;try{let[e,i,r]=await Promise.all([Vt(this.hass),ja(this.hass),Oi(this.hass)]);this._actions=e,this._services=i,this._installId=r,this._fadoNoticeDismissed=Ta(r)}catch(e){this._loadError=C(this.hass,e);return}await Promise.all(this._actions.map(e=>this._ensureSchema(e.id))),this._loaded=!0}async _ensureSchema(e){if(!(e in this._schemas))try{let i=await Ie(this.hass,e);this._schemas={...this._schemas,[e]:i}}catch{this._schemas={...this._schemas,[e]:null}}}_setShowInEditor(e,i,r){this._actions=this._actions.map(a=>{if(a.id!==e)return a;let s=new Set(a.visible_fields??[]);return r?s.add(i):s.delete(i),{...a,visible_fields:[...s]}}),this._autoSave()}_setDefault(e,i,r){this._actions=this._actions.map(a=>a.id!==e?a:{...a,defaults:{...a.defaults??{},[i]:r}})}_clearDefault(e,i){this._actions=this._actions.map(r=>{if(r.id!==e)return r;let a={...r.defaults??{}};return delete a[i],{...r,defaults:a}})}_setLabel(e,i){this._actions=this._actions.map(r=>r.id===e?{...r,label:i}:r)}_toggleExpand(e){this._expanded.has(e)?this._expanded=new Set:(this._expanded=new Set([e]),this._ensureSchema(e))}async _addService(e){if(e&&this._services.some(i=>i.id===e)){if(this._actions.some(i=>i.id===e)){this._expanded=new Set([e]),this._adding=!1;return}await this._ensureSchema(e),this._actions=[...this._actions,{id:e,label:this._labelForService(e),visible_fields:[],defaults:{}}],this._expanded=new Set([e]),this._adding=!1,this._autoSave()}}_removeService(e){this._actions=this._actions.filter(r=>r.id!==e);let i=new Set(this._expanded);i.delete(e),this._expanded=i,this._autoSave()}async _autoSave(){this._saveError=null;try{await Fa(this.hass,this._actions),window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"))}catch(e){this._saveError=C(this.hass,e)}}render(){return this._loadError!==null?l`
        <div class="error">${this._loadError}</div>
        <button @click=${()=>this._reload()}>${o(this.hass,"ui.retry","Retry")}</button>
      `:this._loaded?l`
      <section>
        <div class="section-heading">
          <span>${o(this.hass,"ui.settings_tab_actions","Actions")}</span>
          <ambience-help .hass=${this.hass} .text=${o(this.hass,"ui.help_actions_tab","Actions are the service calls a scene runs. Define them here so scenes can reuse them.")} .docPath=${"reference/actions"}></ambience-help>
        </div>
        ${this._renderFadoNotice()}
        ${this._saveError?l`<div class="error">${this._saveError}</div>`:""}
        ${this._actions.map((e,i)=>this._renderCard(e,i))}
        ${this._renderAdd()}
      </section>
    `:l`<div>${o(this.hass,"ui.loading","Loading\u2026")}</div>`}_renderFadoNotice(){return this._fadoNoticeDismissed||nl(this.hass,bh)?"":l`
      <ambience-banner
        data-test="fado-notice"
        icon="mdi:lightbulb-on-outline"
        hint
        .ctaLabel=${o(this.hass,"ui.fado_notice_cta","Install Fado")}
        .ctaHref=${wh}
        .dismissLabel=${o(this.hass,"ui.dismiss","Dismiss")}
        @banner-dismiss=${()=>this._dismissFadoNotice()}
      >
        <strong>${o(this.hass,"ui.fado_notice_title","Recommended: install Fado Light Fader")}</strong>
        <span>${o(this.hass,"ui.fado_notice_body","Fado adds smooth light fading for brightness, color, and color temperature \u2014 with automatic brightness restoration, UI autoconfiguration, and native transitions. It's in the Home Assistant Marketplace, and in HACS on older versions.")}</span>
      </ambience-banner>
    `}_dismissFadoNotice(){this._fadoNoticeDismissed=!0,Pa(this._installId)}_renderCard(e,i){let r=this._schemas[e.id],a=this._expanded.has(e.id);return l`
      <div
        class="card ${this._drag.over===i?"drag-over":""} ${this._drag.from===i?"dragging":""}"
        data-card
        data-service=${e.id}
        data-drag-index=${i}
      >
        <div
          class="card-header"
          data-toggle
          @click=${s=>{s.target.closest("ha-input, input, button.remove, .drag-handle")||this._toggleExpand(e.id)}}
        >
          <span
            class="drag-handle"
            data-drag-handle
            title=${o(this.hass,"ui.drag_to_reorder","Drag to reorder")}
            @pointerdown=${s=>this._drag.start(i,s)}
            @click=${s=>s.stopPropagation()}
          >⠿</span>
          <span class="toggle-arrow">${a?"\u25BE":"\u25B8"}</span>
          ${a?l`
                <strong>${e.id}</strong>
                <ha-input
                  class="header-label-input"
                  data-label-input
                  placeholder=${o(this.hass,"ui.action_label_placeholder","Label (optional)")}
                  .value=${e.label}
                  @input=${s=>{s.stopPropagation(),this._setLabel(e.id,s.target.value)}}
                  @keydown=${s=>{s.key==="Enter"&&(s.preventDefault(),s.stopPropagation(),s.currentTarget.blur(),this._autoSave(),this._expanded=new Set)}}
                  @blur=${()=>void this._autoSave()}
                  @click=${s=>s.stopPropagation()}
                ></ha-input>
              `:l`
                <span class="header-label-display">${e.label?.trim()||this._labelForService(e.id)}</span>
                <span class="header-service-id">(${e.id})</span>
              `}
          <button
            class="remove"
            data-remove
            title=${o(this.hass,"ui.remove","Remove")}
            @click=${s=>{s.stopPropagation(),this._removeService(e.id)}}
          >✖</button>
        </div>
        ${a?this._renderBody(e,r):""}
      </div>
    `}_renderBody(e,i){return l`
      <div class="body">
        ${this._renderFieldsSection(e,i)}
      </div>
    `}_renderFieldsSection(e,i){if(i===null)return l`<p class="body-help warning">
        ${o(this.hass,"ui.service_unavailable","Service not available in this HA instance.")}
      </p>`;if(i===void 0)return l`<p class="body-help">${o(this.hass,"ui.loading","Loading\u2026")}</p>`;let r=Object.entries(i.fields).slice().sort(([a],[s])=>a.localeCompare(s));return r.length===0?l`<p class="body-help">
        ${o(this.hass,"ui.service_has_no_fields","This service has no fields.")}
      </p>`:l`
      <p class="body-help">
        ${o(this.hass,"ui.actions_field_help_show","Tick a checkbox to make a field editable per scene.")}
        <ambience-help .hass=${this.hass} .text=${o(this.hass,"ui.help_show_in_scene_editor","Show this field in the scene editor so each scene can set it. Leave off to send a fixed default instead.")}></ambience-help>
        ${o(this.hass,"ui.actions_field_help_default","Set a default to pre-fill it.")}
        <ambience-help .hass=${this.hass} .text=${o(this.hass,"ui.help_set_default","A value sent automatically when the action runs. Scenes can override it if the field is also shown in the editor.")}></ambience-help>
      </p>
      ${r.map(([a,s])=>this._renderFieldRow(e,a,s))}
    `}_formatDefaultSummary(e){return e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}_defaultUnitSuffix(e,i){let r=this._schemas[e]?.fields?.[i];if(!r||typeof r!="object")return"";let a=ln(r.selector);return a?` ${a}`:""}_renderFieldRow(e,i,r){let a=(e.visible_fields??[]).includes(i),s=i in(e.defaults??{}),d=`${e.id}:${i}`,u=this._editingDefault===d;return l`
      <div class="field-row">
        <!-- Row 1: [checkbox] [name] [default summary] -->
        <div class="field-row-main">
          <div class="checkbox-cell">
            <input
              type="checkbox"
              data-show-in-editor=${i}
              title=${o(this.hass,"ui.show_in_scene_editor","Show in scene editor")}
              .checked=${a}
              @change=${h=>this._setShowInEditor(e.id,i,h.target.checked)}
            />
          </div>
          <span class="name">
            ${r.name||F(i)}
            ${r.name?l` <small class="field-id">(${i})</small>`:""}
            ${r.description?l` <small>— ${r.description}</small>`:""}
          </span>
          <div class="summary-cell">
            ${u?l`<span class="summary-cell-editing">${o(this.hass,"ui.editing","Editing\u2026")}</span>`:s?l`<button
                    class="default-summary"
                    data-default-summary=${i}
                    @click=${h=>{h.stopPropagation(),this._startEditingDefault(e.id,i)}}
                  >${o(this.hass,"ui.default_prefix","Default: ")}${this._formatDefaultSummary(e.defaults?.[i])}${this._defaultUnitSuffix(e.id,i)}</button>`:l`<button
                    class="set-default-btn"
                    data-set-default=${i}
                    @click=${h=>{h.stopPropagation(),this._startEditingDefault(e.id,i)}}
                  >+ ${o(this.hass,"ui.set_default","Set default")}</button>`}
          </div>
        </div>
        <!-- Row 2: full editor (only when editing) -->
        ${u?l`<div
              class="field-row-editor"
              data-editing-key=${d}
            >
              <div class="editor-line">
                <div class="default-editor">${this._renderDefaultEditor(e,i,r)}</div>
                <button
                  class="clear-default"
                  data-clear-default=${i}
                  title=${o(this.hass,"ui.clear_default","Clear default")}
                  @click=${h=>{h.stopPropagation(),this._clearDefault(e.id,i),this._saveEditingDefault()}}
                >✕</button>
              </div>
              <div class="editor-actions">
                <button
                  class="cancel-default"
                  data-cancel-default=${i}
                  @click=${h=>{h.stopPropagation(),this._cancelEditingDefault()}}
                >${o(this.hass,"ui.cancel","Cancel")}</button>
                <button
                  class="save-default"
                  data-save-default=${i}
                  @click=${h=>{h.stopPropagation(),this._saveEditingDefault()}}
                >${o(this.hass,"ui.save","Save")}</button>
              </div>
            </div>`:""}
      </div>
    `}_renderDefaultEditor(e,i,r){let a=e.defaults?.[i],s=this._fieldSchemas[`${e.id}:${i}`]??[];return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${s}
        .data=${{[i]:a??""}}
        .computeLabel=${()=>""}
        @value-changed=${d=>{d.stopPropagation(),this._setDefault(e.id,i,d.detail.value[i])}}
      ></ha-form>`:l`<input
      data-default-value=${i}
      .value=${a==null?"":String(a)}
      @input=${d=>this._setDefault(e.id,i,d.target.value)}
    />`}_renderAdd(){return this._adding?l`<div class="add-row">
      ${this._renderAddPicker()}
      <button data-action="cancel-add" @click=${()=>{this._adding=!1}}>
        ${o(this.hass,"ui.cancel","Cancel")}
      </button>
    </div>`:l`<div class="add-row">
        <button class="add" data-action="add" @click=${()=>{this._adding=!0}}>
          + ${o(this.hass,"ui.add_action_button","Add action")}
        </button>
      </div>`}_labelForService(e){return this._serviceById.get(e)?.name?.trim()||Li(e)}_addOptionLabel(e){return`${this._labelForService(e)} (${e})`}_renderAddPicker(){return customElements.get("ha-service-picker")?l`<ha-service-picker
        class="add-picker"
        data-add-service-picker
        .hass=${this.hass}
        @value-changed=${e=>{e.stopPropagation();let i=e.detail.value;i&&this._addService(i)}}
      ></ha-service-picker>`:customElements.get("ha-form")?l`<ha-form
        class="add-picker"
        data-add-service-form
        .hass=${this.hass}
        .schema=${this._addSchema}
        .data=${{service:""}}
        .computeLabel=${()=>o(this.hass,"ui.pick_service","Pick a service")}
        @value-changed=${e=>{e.stopPropagation();let i=e.detail.value.service;i&&this._addService(i)}}
      ></ha-form>`:l`<select
      data-add-service
      @change=${e=>this._addService(e.target.value)}
    >
      <option value="">— ${o(this.hass,"ui.pick_service","Pick a service")} —</option>
      ${this._availableServices.map(e=>l`<option value=${e.id}>${this._addOptionLabel(e.id)}</option>`)}
    </select>`}};H.styles=[y`
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
      opacity: 0.8;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
      position: relative;
      z-index: 1000;
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
      /* Pointer-Events drag handle: stop the browser from panning/scrolling
         when a drag begins on a touchscreen. */
      touch-action: none;
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
      /* Align the checkbox with the field name's first line, not the
         vertical centre of a multi-line label/description. */
      align-self: flex-start;
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
    /* Primary "Add action" button — filled blue, matching the scenes list. */
    button.add {
      background: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
    .section-heading {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }
  `],H._OVERLAY_TAG_RE=/vaadin|combo-box|overlay|listbox|menu|mwc-|md-/i,c([m({attribute:!1})],H.prototype,"hass",2),c([g()],H.prototype,"_actions",2),c([g()],H.prototype,"_services",2),c([g()],H.prototype,"_schemas",2),c([g()],H.prototype,"_fieldSchemas",2),c([g()],H.prototype,"_addSchema",2),c([g()],H.prototype,"_expanded",2),c([g()],H.prototype,"_adding",2),c([g()],H.prototype,"_loadError",2),c([g()],H.prototype,"_saveError",2),c([g()],H.prototype,"_loaded",2),c([g()],H.prototype,"_fadoNoticeDismissed",2),c([g()],H.prototype,"_editingDefault",2),c([g()],H.prototype,"_editingOriginalValue",2),c([g()],H.prototype,"_editingOriginalHad",2),H=c([w("ambience-actions-settings")],H);var V=class extends Error{constructor(n){super(n),this.name="ImportError"}};function Rn(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function xh(t){if(!Rn(t))throw new V("`scope` must be an object with a `kind`.");let n=t.kind;if(n==="house")return{kind:"house"};if(n==="area"||n==="floor"){if(typeof t.id!="string"||t.id==="")throw new V(`A ${n} scope needs a non-empty \`id\`.`);return{kind:n,id:t.id}}throw new V("`scope.kind` must be one of: area, floor, house.")}function kh(t){if(!Array.isArray(t))throw new V("`scenes` must be a list.");return t.map((n,e)=>{if(!Rn(n))throw new V(`Scene ${e+1} must be an object.`);if(typeof n.category!="string"||n.category==="")throw new V(`Scene ${e+1} is missing a \`category\`.`);return n})}function $h(t){if(t!==void 0){if(!Rn(t)||typeof t.id!="string"||t.id==="")throw new V("`category` must be an object with a non-empty `id`.");return t}}function rl(t){let n;try{n=fn(t)}catch(r){throw new V(`Could not parse YAML/JSON: ${r.message}`)}if(!Rn(n))throw new V("Import must be a YAML/JSON object (an `ambience_import` block).");let e=Number(n.ambience_import);if(n.ambience_import===void 0||!Number.isFinite(e)||e<1)throw new V("Missing or invalid `ambience_import` marker \u2014 is this an Ambience import block?");if(e>1)throw new V(`This is import format v${e}, but this Ambience only understands v1 \u2014 update Ambience.`);let i=n.mode??"merge";if(i!=="merge"&&i!=="replace")throw new V("`mode` must be `merge` or `replace`.");return{ambience_import:e,scope:xh(n.scope),category:$h(n.category),mode:i,scenes:kh(n.scenes)}}function Mr(t){return`${t.category}\0${(t.name??"").trim().toLowerCase()}`}function Dn(t){return t.name??"(unnamed)"}function al(t,n,e){let i=new Set(e.map(v=>v.id)),r=t.category?.id,a=t.category&&!i.has(t.category.id)?t.category:null,s=new Set(i);r&&s.add(r);let d=[...new Set(t.scenes.map(v=>v.category).filter(v=>!s.has(v)))],u=n.scenes??[],h=[],p=[],_=[],f;if(t.mode==="replace"){let v=new Set(t.scenes.map(x=>x.category));for(let x of u)v.has(x.category)&&_.push(Dn(x));f=u.filter(x=>!v.has(x.category));for(let x of t.scenes)h.push(Dn(x)),f.push(x)}else{f=u.map(x=>({...x}));let v=new Map(f.map((x,S)=>[Mr(x),S]));for(let x of t.scenes){let D=(x.name??"").trim()!==""?v.get(Mr(x)):void 0;D!==void 0?(f[D]=x,p.push(Dn(x))):(v.set(Mr(x),f.length),f.push(x),h.push(Dn(x)))}}return{scope:t.scope,mode:t.mode,newCategory:a,unknownCategories:d,adds:h,updates:p,removes:_,resultConfig:{...n,scenes:f}}}var Sh=St("reference/ai/mcp-server"),Ch=St("reference/ai/download-and-paste"),Eh=`${nr}/issues/new`,oe=class extends b{constructor(){super(...arguments);this.text="";this.error=null;this.preview=null;this.categories=[];this.busy=!1;this.done=null}async _download(){try{await cs(this.hass)}catch(e){this.error=C(this.hass,e)}}async _onFile(e){let i=e.target,r=i.files?.[0];if(i.value="",!!r){this.error=null,this.done=null,this.preview=null;try{this.text=await r.text()}catch(a){this.error=C(this.hass,a);return}await this._doPreview()}}async _doPreview(){this.done=null;try{let e=rl(this.text),[i,r]=await Promise.all([hs(this.hass,e.scope),Se(this.hass)]);this.categories=r,this.preview=al(e,i,r),this.error=null}catch(e){this.preview=null,this.error=e instanceof V?e.message:C(this.hass,e)}}async _confirm(){let e=this.preview;if(!(!e||e.unknownCategories.length>0||this.busy)){this.busy=!0;try{await us(this.hass,e.resultConfig),e.newCategory&&await ji(this.hass,[...this.categories,e.newCategory]),await ps(this.hass,e.scope,e.resultConfig,{action:"import",scene_name:null},{minimisePins:!0}),window.dispatchEvent(new CustomEvent("ambience-config-imported")),e.newCategory&&window.dispatchEvent(new CustomEvent("ambience-categories-changed")),this.done=o(this.hass,"ui.import_done","Imported successfully."),this.preview=null,this.text=""}catch(i){this.error=C(this.hass,i)}finally{this.busy=!1}}}_list(e,i){return i.length===0?k:l`<div>${e}<ul>${i.map(r=>l`<li>${r}</li>`)}</ul></div>`}_renderPreview(e){let i=e.scope.kind==="house"?e.scope.kind:`${e.scope.kind} ${e.scope.id}`;return l`
      <div class="preview-panel">
        <div class="target">${o(this.hass,"ui.import_target","Target")}: ${i} · ${e.mode}</div>
        ${e.newCategory?l`<div class="new-category">${o(this.hass,"ui.import_new_category","New category to create")}: ${e.newCategory.name}</div>`:k}
        ${e.unknownCategories.length>0?l`<div class="error unknown">${o(this.hass,"ui.import_unknown_categories","Unknown categories (create them first)")}: ${e.unknownCategories.join(", ")}</div>`:k}
        ${this._list(o(this.hass,"ui.import_adds","Add"),e.adds)}
        ${this._list(o(this.hass,"ui.import_updates","Update"),e.updates)}
        ${this._list(o(this.hass,"ui.import_removes","Remove"),e.removes)}
        <button
          class="confirm"
          ?disabled=${this.busy||e.unknownCategories.length>0}
          @click=${()=>this._confirm()}
        >
          ${o(this.hass,"ui.import_confirm","Import")}
        </button>
      </div>
    `}render(){return l`
      <div class="header">
        <span class="title">${o(this.hass,"ui.import_title","Author & fix scenes with AI")}</span>
        <span class="pill beta">${o(this.hass,"ui.import_beta","Beta")}</span>
      </div>
      <section class="path card">
        <div class="section-heading">
          <span>${o(this.hass,"ui.import_mcp_title","Author live with the MCP server")}</span>
          <span class="pill recommended"
            >${o(this.hass,"ui.import_mcp_recommended","Recommended")}</span
          >
        </div>
        <div class="section-body">
          <p>${o(this.hass,"ui.import_mcp_desc","Install the MCP server for the fastest authoring and editing experience with Claude Code or Claude Desktop.")}</p>
          <p>
            <a class="help-link" href=${Sh} target="_blank" rel="noopener noreferrer"
              >${o(this.hass,"ui.import_mcp_link","Set up the MCP server")}</a
            >
          </p>
        </div>
      </section>
      <hr class="path-divider" />
      <section class="path">
        <div class="section-heading">${o(this.hass,"ui.import_paste_title","Alternatively, download and paste into any AI")}</div>
        <ol class="steps">
        <li>
          <div class="step-title">${o(this.hass,"ui.import_step1","Install the skill or plugin once")}</div>
          <div class="step-body">
            ${o(this.hass,"ui.import_step1_desc","Add the Ambience AI pack to your AI to teach it about Ambience.")}
            <a class="help-link" href=${Ch} target="_blank" rel="noopener noreferrer"
              >${o(this.hass,"ui.import_help_link","Install & usage guide")}</a
            >
          </div>
        </li>
        <li>
          <div class="step-title">${o(this.hass,"ui.import_step2","Download your AI bundle")}</div>
          <div class="step-body">
            ${o(this.hass,"ui.import_step2_desc","The bundle contains a snapshot of your areas, entities and exposed actions (location data redacted) for the AI to author against. Upload it to the AI with your request.")}
          </div>
          <button class="download" @click=${()=>this._download()}>
            ${o(this.hass,"ui.import_download_bundle","Download AI bundle")}
          </button>
        </li>
        <li>
          <div class="step-title">${o(this.hass,"ui.import_step3","Upload the result")}</div>
          <div class="step-body">
            ${o(this.hass,"ui.import_step3_desc","Upload the YAML or JSON file the AI gives you. It will show you a preview before any changes are made, and you can always revert them with the Undo button.")}
          </div>
          <input
            class="file"
            type="file"
            accept=".yaml,.yml,.json,.txt"
            @change=${e=>this._onFile(e)}
          />
        </li>
      </ol>
      </section>
      ${this.error?l`<div class="error">${this.error}</div>`:k}
      ${this.preview?this._renderPreview(this.preview):k}
      ${this.done?l`<div class="done">${this.done}</div>`:k}
      <div class="feedback card">
        <div class="fb-title">${o(this.hass,"ui.import_feedback_title","Can you do better than the AI?")}</div>
        <div class="fb-body">
          ${o(this.hass,"ui.import_feedback_body","If the AI gives you bad advice, share its suggestion, your corrected version, and a short note on what was wrong \u2014 it's used to improve the cookbook the AI learns from.")}
          <a class="fb-link" href=${Eh} target="_blank" rel="noopener noreferrer"
            >${o(this.hass,"ui.import_feedback_link","Report it on GitHub")}</a
          >
        </div>
      </div>
    `}};oe.styles=y`
    :host { display: block; }
    .header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; }
    .header .title { font-size: 1.1rem; font-weight: 500; }
    .pill {
      font-size: 0.7rem; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase;
      padding: 0.05rem 0.4rem; border-radius: 999px;
      color: var(--text-primary-color, #fff);
    }
    .pill.beta { background: var(--label-badge-yellow, #f4b400); }
    .pill.recommended { background: var(--primary-color, #03a9f4); }
    .help-link { color: var(--primary-color, #03a9f4); }
    .section-heading {
      display: flex; align-items: center; gap: 0.5rem;
      font-weight: 600; margin: 0 0 0.75rem;
    }
    .section-body { color: var(--secondary-text-color, #666); }
    .section-body p { margin: 0; }
    .section-body p + p { margin-top: 0.5rem; }
    hr.path-divider {
      border: none; border-top: 1px solid var(--divider-color, #e0e0e0);
      margin: 1.75rem 0;
    }
    .card {
      padding: 0.75rem 1rem; border-radius: 6px;
      background: var(--secondary-background-color, #f5f5f5);
      border: 1px solid var(--divider-color, #e0e0e0);
    }
    .feedback { margin-top: 1.5rem; }
    .feedback .fb-title { font-weight: 600; margin-bottom: 0.25rem; }
    .feedback .fb-body { color: var(--secondary-text-color, #666); }
    .feedback a { color: var(--primary-color, #03a9f4); }
    ol.steps { margin: 0.25rem 0 0; padding-left: 1.5rem; }
    ol.steps > li { margin-bottom: 1.1rem; }
    ol.steps > li::marker { font-weight: 600; color: var(--primary-text-color, inherit); }
    .step-title { font-weight: 600; margin-bottom: 0.2rem; }
    .step-body { color: var(--secondary-text-color, #666); margin-bottom: 0.45rem; }
    input.file { font: inherit; max-width: 100%; }
    button {
      background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff);
      border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font: inherit;
    }
    button[disabled] { opacity: 0.5; cursor: not-allowed; }
    .preview-panel {
      margin-top: 1rem; padding: 0.75rem;
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 6px;
    }
    .preview-panel ul { margin: 0.25rem 0 0.5rem 1.25rem; }
    .new-category { color: var(--primary-color, #03a9f4); }
    .error { color: var(--error-color, #d32f2f); margin-top: 0.5rem; }
    .done { color: var(--success-color, #43a047); margin-top: 0.5rem; }
    .target { color: var(--secondary-text-color, #666); margin-bottom: 0.5rem; }
  `,c([m({attribute:!1})],oe.prototype,"hass",2),c([g()],oe.prototype,"text",2),c([g()],oe.prototype,"error",2),c([g()],oe.prototype,"preview",2),c([g()],oe.prototype,"categories",2),c([g()],oe.prototype,"busy",2),c([g()],oe.prototype,"done",2),oe=c([w("ambience-import-config")],oe);var Je=class extends b{constructor(){super(...arguments);this._tab="categories"}willUpdate(e){e.has("initialTab")&&this.initialTab&&(this._tab=this.initialTab)}render(){return l`
      <nav>
        <button class=${this._tab==="categories"?"active":""} @click=${()=>{this._tab="categories"}}>
          <ha-icon icon="mdi:shape-outline"></ha-icon>${o(this.hass,"ui.settings_tab_categories","Categories")}
        </button>
        <button class=${this._tab==="conditions"?"active":""} @click=${()=>{this._tab="conditions"}}>
          <ha-icon icon="mdi:filter-variant"></ha-icon>${o(this.hass,"ui.settings_tab_conditions","Conditions")}
        </button>
        <button class=${this._tab==="actions"?"active":""} @click=${()=>{this._tab="actions"}}>
          <ha-icon icon="mdi:flash"></ha-icon>${o(this.hass,"ui.settings_tab_actions","Actions")}
        </button>
        <button class=${this._tab==="import"?"active":""} @click=${()=>{this._tab="import"}}>
          <ha-icon icon="mdi:creation"></ha-icon>${o(this.hass,"ui.settings_tab_import","AI")}
        </button>
        <button class=${this._tab==="ambience"?"active":""} @click=${()=>{this._tab="ambience"}}>
          <ha-icon icon="mdi:home-lightbulb"></ha-icon>${o(this.hass,"ui.settings_tab_ambience","Advanced")}
        </button>
      </nav>
      <div class="content">
        ${this._tab==="categories"?l`<ambience-categories-settings .hass=${this.hass}></ambience-categories-settings>`:this._tab==="conditions"?l`<ambience-conditions-settings .hass=${this.hass}></ambience-conditions-settings>`:this._tab==="actions"?l`<ambience-actions-settings .hass=${this.hass}></ambience-actions-settings>`:this._tab==="import"?l`<ambience-import-config .hass=${this.hass}></ambience-import-config>`:l`<ambience-ambience-settings .hass=${this.hass}></ambience-ambience-settings>`}
      </div>
    `}};Je.styles=y`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }
    /* HA-style tab bar: icon + label, primary-coloured active tab with an
       underline indicator, a single divider beneath the whole row. */
    nav {
      display: flex;
      flex-shrink: 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    nav button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      padding: 0.85rem 1rem;
      cursor: pointer;
      color: var(--secondary-text-color, #727272);
      font-size: 0.95rem;
      font-weight: 500;
      white-space: nowrap;
    }
    nav button:hover {
      color: var(--primary-text-color, inherit);
    }
    nav button.active {
      color: var(--primary-color, #03a9f4);
      border-bottom-color: var(--primary-color, #03a9f4);
    }
    nav button ha-icon {
      --mdc-icon-size: 22px;
    }
    .content {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 1rem;
      max-width: var(--ambience-content-max-width, 60rem);
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
    }
  `,c([m({attribute:!1})],Je.prototype,"hass",2),c([m({attribute:!1})],Je.prototype,"initialTab",2),c([g()],Je.prototype,"_tab",2),Je=c([w("ambience-settings-view")],Je);var Ze=class extends b{constructor(){super();this.open=!1;new Ve(this,()=>this._close())}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?l`
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        @click=${e=>e.stopPropagation()}
      >
        <div class="header">
          <h3>${o(this.hass,"ui.tab_settings","Settings")}</h3>
          <button class="close" @click=${this._close} aria-label=${o(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          <ambience-settings-view
            .hass=${this.hass}
            .initialTab=${this.initialTab}
          ></ambience-settings-view>
        </div>
      </div>
    `:k}};Ze.styles=y`
    :host {
      display: none;
      position: fixed; inset: 0;
      align-items: center; justify-content: center;
      background: rgba(0, 0, 0, 0.45); z-index: 1000;
    }
    :host([open]) {
      display: flex;
    }
    .modal {
      background: var(--card-background-color, #fff);
      border-radius: 8px; padding: 1.5rem;
      max-width: 680px; width: 90%; height: 85vh;
      display: flex; flex-direction: column; gap: 1rem;
      overflow: hidden;
    }
    .header {
      display: flex; align-items: center; gap: 0.5rem;
    }
    .header h3 { margin: 0; flex: 1; }
    .close {
      padding: 0.25rem 0.5rem; cursor: pointer;
      border: none; background: none; font-size: 1.2rem;
      color: var(--secondary-text-color, #888);
      line-height: 1;
    }
    .body {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .body > ambience-settings-view { flex: 1; min-height: 0; }
  `,c([m({attribute:!1})],Ze.prototype,"hass",2),c([m({type:Boolean,reflect:!0})],Ze.prototype,"open",2),c([m({attribute:!1})],Ze.prototype,"initialTab",2),Ze=c([w("ambience-settings-modal")],Ze);function Ah(t){let n=t.indexOf("?");return n===-1?"":new URLSearchParams(t.slice(n+1)).get("fe")??""}var sl={runningFrontendHash(){return Ah(import.meta.url)}};var Lh={reload(){location.reload()}},gi=class extends b{constructor(){super(...arguments);this._serverVersion=null;this._checked=!1}static{this.styles=y`
    :host {
      display: block;
    }
    .message {
      font-size: 1rem;
      line-height: 1.4;
      color: var(--primary-text-color, #212121);
    }
  `}willUpdate(e){this._checked||!e.has("hass")||!this.hass||(this._checked=!0,this._check())}async _check(){let e=sl.runningFrontendHash();if(!(!e||!this.hass))try{let{hash:i,version:r}=await Oa(this.hass);if(!i||i==="missing"||i===e)return;this._serverVersion=r}catch{}}render(){if(this._serverVersion===null)return k;let e=o(this.hass,"ui.version_update.message","Ambience {version} has been installed \u2014 reload to update.",{version:this._serverVersion}),i=o(this.hass,"ui.version_update.reload","Reload");return l`
      <ambience-banner
        data-test="version-banner"
        icon="mdi:update"
        hint
        .dismissible=${!1}
        .ctaLabel=${i}
        @banner-cta=${()=>Lh.reload()}
      ><span class="message">${e}</span></ambience-banner>
    `}};c([m({attribute:!1})],gi.prototype,"hass",2),c([g()],gi.prototype,"_serverVersion",2);Ai("ambience-version-banner",gi);var mt=class extends b{constructor(){super(...arguments);this._settingsOpen=!1;this._filterCategory=Hi();this._onOpenSettings=e=>{let i=e.detail?.tab;this._settingsTab=i,this._settingsOpen=!0};this._onFilterChanged=e=>{this._filterCategory=e.detail?.category??"",e.stopPropagation()}}static{this.styles=y`
    :host {
      display: block;
      height: 100%;
      /* Scroll container for the sticky header below. In the panel the outer
       host is 100vh; making this the scroller lets the header pin to the top. */
      overflow: auto;
      background: var(--ha-panel-background, var(--primary-background-color, #fafafa));
      color: var(--primary-text-color, #1d1d1d);
      font-family: var(--primary-font-family, system-ui, sans-serif);
    }
    header {
      /* Pinned to the top while the content scrolls beneath it. The :host is the
       scroll container (see the :host rule below), so sticky resolves against it.
       An opaque background + z-index keep scrolled content from showing through. */
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--ha-panel-toolbar-background, var(--primary-background-color, #fafafa));
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      /* Establish a containment context so the logo/icon swap can respond to
       the header's own width regardless of the surrounding panel/card. */
      container-type: inline-size;
    }
    /* Header contents are capped to the content width and centred, tracking the
     same reading-column cap as the body below (the card overrides this var to
     fill its width). The in-flow group — the category filter plus the help (?)
     beside it — centres at the bar midpoint (so the filter sits a touch left of
     centre, balanced by the help on its right); the logo and cog are absolutely
     positioned at the edges so they never shift that centre. */
    .bar {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      /* Gap separates the category filter from the help (?) so it isn't jammed
         against the dropdown; the logo/cog are absolute, so it only spaces these
         two in-flow items. */
      gap: 0.6rem;
      max-width: var(--ambience-content-max-width, 60rem);
      margin: 0 auto;
      padding: 0.75rem 1rem;
    }
    /* Match HA's toolbar help icon size (the cog uses the same 24px). */
    .bar ambience-help {
      --ambience-help-size: 24px;
    }
    h1.brand {
      margin: 0;
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      /* visually replaced by the logo/icon; keep for document outline only */
      font-size: 0;
    }
    .brand .ambience-logo {
      display: block;
      height: 3rem;
      width: auto;
    }
    .brand .ambience-icon {
      display: none;
      height: 3rem;
      width: auto;
    }
    .settings-btn {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      border-radius: 50%;
      padding: 0.35rem;
      cursor: pointer;
      color: var(--secondary-text-color, #888);
      display: flex;
      align-items: center;
    }
    .settings-btn:hover {
      color: var(--primary-text-color, inherit);
      background: var(--secondary-background-color, #eee);
    }
    .settings-btn ha-icon {
      --mdc-icon-size: 24px;
    }
    /* Too narrow for the wordmark alongside the filter + cog: show the icon.
       The wordmark is pinned at the left (right edge ≈ 181px) and the filter is
       centred with a 18rem (≈252px) min-width, so the two collide once the
       header drops below ≈632px. Swap at 48rem (≈672px at HA's 14px root) to
       keep a ~20px gap before they touch. (NB rem here is ×14, not ×16.) */
    @container (max-width: 48rem) {
      .brand .ambience-logo {
        display: none;
      }
      .brand .ambience-icon {
        display: block;
      }
    }
  `}connectedCallback(){super.connectedCallback(),ie(this),this.addEventListener("ambience-open-settings",this._onOpenSettings),this.addEventListener("ambience-filter-changed",this._onFilterChanged)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("ambience-open-settings",this._onOpenSettings),this.removeEventListener("ambience-filter-changed",this._onFilterChanged)}render(){let e={dark:!!this.hass.themes?.darkMode,title:o(this.hass,"ui.panel_title","Ambience")};return l`
      <ambience-version-banner .hass=${this.hass}></ambience-version-banner>
      <header>
        <div class="bar">
          <h1 class="brand">
            ${ma(e)}
            ${_a(e)}
          </h1>
          <ambience-category-filter .hass=${this.hass}></ambience-category-filter>
          <button
            class="settings-btn"
            @click=${()=>{this._settingsTab=void 0,this._settingsOpen=!0}}
            aria-label=${o(this.hass,"ui.tab_settings","Settings")}
            title=${o(this.hass,"ui.tab_settings","Settings")}
          ><ha-icon icon="mdi:cog"></ha-icon></button>
          <ambience-help .hass=${this.hass} .docPath=${"getting-started"}></ambience-help>
        </div>
      </header>
      <ambience-scopes-view
        .hass=${this.hass}
        .filterCategory=${this._filterCategory}
      ></ambience-scopes-view>
      <ambience-settings-modal
        .hass=${this.hass}
        .initialTab=${this._settingsTab}
        ?open=${this._settingsOpen}
        @close=${()=>{this._settingsOpen=!1}}
      ></ambience-settings-modal>
    `}};c([m({attribute:!1})],mt.prototype,"hass",2),c([g()],mt.prototype,"_settingsOpen",2),c([g()],mt.prototype,"_settingsTab",2),c([g()],mt.prototype,"_filterCategory",2);Ai("ambience-frontend",mt);export{mt as AmbienceFrontend};
