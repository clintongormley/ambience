/* Ambience — bundled output. Do not edit by hand. */
var ia=Object.defineProperty;var na=Object.getOwnPropertyDescriptor;var u=(t,n,e,r)=>{for(var i=r>1?void 0:r?na(n,e):n,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(r?a(n,e,i):a(i))||i);return r&&i&&ia(n,e,i),i};var It=globalThis,Mt=It.ShadowRoot&&(It.ShadyCSS===void 0||It.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Hr=Symbol(),Ci=new WeakMap,ut=class{constructor(n,e,r){if(this._$cssResult$=!0,r!==Hr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(Mt&&n===void 0){let r=e!==void 0&&e.length===1;r&&(n=Ci.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),r&&Ci.set(e,n))}return n}toString(){return this.cssText}},Ti=t=>new ut(typeof t=="string"?t:t+"",void 0,Hr),v=(t,...n)=>{let e=t.length===1?t[0]:n.reduce((r,i,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new ut(e,t,Hr)},Li=(t,n)=>{if(Mt)t.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let r=document.createElement("style"),i=It.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,t.appendChild(r)}},Nr=Mt?t=>t:t=>t instanceof CSSStyleSheet?(n=>{let e="";for(let r of n.cssRules)e+=r.cssText;return Ti(e)})(t):t;var{is:sa,defineProperty:aa,getOwnPropertyDescriptor:oa,getOwnPropertyNames:la,getOwnPropertySymbols:da,getPrototypeOf:ca}=Object,jt=globalThis,Ri=jt.trustedTypes,ua=Ri?Ri.emptyScript:"",ha=jt.reactiveElementPolyfillSupport,ht=(t,n)=>t,pt={toAttribute(t,n){switch(n){case Boolean:t=t?ua:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,n){let e=t;switch(n){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},zt=(t,n)=>!sa(t,n),Pi={attribute:!0,type:String,converter:pt,reflect:!1,useDefault:!1,hasChanged:zt};Symbol.metadata??=Symbol("metadata"),jt.litPropertyMetadata??=new WeakMap;var le=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Pi){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(n,r,e);i!==void 0&&aa(this.prototype,n,i)}}static getPropertyDescriptor(n,e,r){let{get:i,set:s}=oa(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);s?.call(this,a),this.requestUpdate(n,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Pi}static _$Ei(){if(this.hasOwnProperty(ht("elementProperties")))return;let n=ca(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ht("properties"))){let e=this.properties,r=[...la(e),...da(e)];for(let i of r)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let r=new Set(n.flat(1/0).reverse());for(let i of r)e.unshift(Nr(i))}else n!==void 0&&e.push(Nr(n));return e}static _$Eu(n,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(n.set(r,this[r]),delete this[r]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Li(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,r){this._$AK(n,r)}_$ET(n,e){let r=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:pt).toAttribute(e,r.type);this._$Em=n,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(n,e){let r=this.constructor,i=r._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:pt;this._$Em=i;let o=a.fromAttribute(e,s.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(n,e,r,i=!1,s){if(n!==void 0){let a=this.constructor;if(i===!1&&(s=this[n]),r??=a.getPropertyOptions(n),!((r.hasChanged??zt)(s,e)||r.useDefault&&r.reflect&&s===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,r))))return;this.C(n,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:r,reflect:i,wrapped:s},a){r&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),s!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||r||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:a}=s,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,s,o)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw n=!1,this._$EM(),r}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};le.elementStyles=[],le.shadowRootOptions={mode:"open"},le[ht("elementProperties")]=new Map,le[ht("finalized")]=new Map,ha?.({ReactiveElement:le}),(jt.reactiveElementVersions??=[]).push("2.1.2");var Fr=globalThis,Di=t=>t,Wt=Fr.trustedTypes,Ai=Wt?Wt.createPolicy("lit-html",{createHTML:t=>t}):void 0,Ir="$lit$",de=`lit$${Math.random().toFixed(9).slice(2)}$`,Mr="?"+de,pa=`<${Mr}>`,Oe=document,ft=()=>Oe.createComment(""),gt=t=>t===null||typeof t!="object"&&typeof t!="function",jr=Array.isArray,Mi=t=>jr(t)||typeof t?.[Symbol.iterator]=="function",Or=`[ 	
\f\r]`,mt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Hi=/-->/g,Ni=/>/g,He=RegExp(`>|${Or}(?:([^\\s"'>=/]+)(${Or}*=${Or}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Oi=/'/g,Fi=/"/g,ji=/^(?:script|style|textarea|title)$/i,zr=t=>(n,...e)=>({_$litType$:t,strings:n,values:e}),l=zr(1),rc=zr(2),ic=zr(3),B=Symbol.for("lit-noChange"),k=Symbol.for("lit-nothing"),Ii=new WeakMap,Ne=Oe.createTreeWalker(Oe,129);function zi(t,n){if(!jr(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ai!==void 0?Ai.createHTML(n):n}var Wi=(t,n)=>{let e=t.length-1,r=[],i,s=n===2?"<svg>":n===3?"<math>":"",a=mt;for(let o=0;o<e;o++){let c=t[o],h,p,f=-1,_=0;for(;_<c.length&&(a.lastIndex=_,p=a.exec(c),p!==null);)_=a.lastIndex,a===mt?p[1]==="!--"?a=Hi:p[1]!==void 0?a=Ni:p[2]!==void 0?(ji.test(p[2])&&(i=RegExp("</"+p[2],"g")),a=He):p[3]!==void 0&&(a=He):a===He?p[0]===">"?(a=i??mt,f=-1):p[1]===void 0?f=-2:(f=a.lastIndex-p[2].length,h=p[1],a=p[3]===void 0?He:p[3]==='"'?Fi:Oi):a===Fi||a===Oi?a=He:a===Hi||a===Ni?a=mt:(a=He,i=void 0);let y=a===He&&t[o+1].startsWith("/>")?" ":"";s+=a===mt?c+pa:f>=0?(r.push(h),c.slice(0,f)+Ir+c.slice(f)+de+y):c+de+(f===-2?o:y)}return[zi(t,s+(t[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),r]},_t=class t{constructor({strings:n,_$litType$:e},r){let i;this.parts=[];let s=0,a=0,o=n.length-1,c=this.parts,[h,p]=Wi(n,e);if(this.el=t.createElement(h,r),Ne.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(i=Ne.nextNode())!==null&&c.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let f of i.getAttributeNames())if(f.endsWith(Ir)){let _=p[a++],y=i.getAttribute(f).split(de),$=/([.?@])?(.*)/.exec(_);c.push({type:1,index:s,name:$[2],strings:y,ctor:$[1]==="."?Bt:$[1]==="?"?qt:$[1]==="@"?Vt:Ie}),i.removeAttribute(f)}else f.startsWith(de)&&(c.push({type:6,index:s}),i.removeAttribute(f));if(ji.test(i.tagName)){let f=i.textContent.split(de),_=f.length-1;if(_>0){i.textContent=Wt?Wt.emptyScript:"";for(let y=0;y<_;y++)i.append(f[y],ft()),Ne.nextNode(),c.push({type:2,index:++s});i.append(f[_],ft())}}}else if(i.nodeType===8)if(i.data===Mr)c.push({type:2,index:s});else{let f=-1;for(;(f=i.data.indexOf(de,f+1))!==-1;)c.push({type:7,index:s}),f+=de.length-1}s++}}static createElement(n,e){let r=Oe.createElement("template");return r.innerHTML=n,r}};function Fe(t,n,e=t,r){if(n===B)return n;let i=r!==void 0?e._$Co?.[r]:e._$Cl,s=gt(n)?void 0:n._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(t),i._$AT(t,e,r)),r!==void 0?(e._$Co??=[])[r]=i:e._$Cl=i),i!==void 0&&(n=Fe(t,i._$AS(t,n.values),i,r)),n}var Ut=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:r}=this._$AD,i=(n?.creationScope??Oe).importNode(e,!0);Ne.currentNode=i;let s=Ne.nextNode(),a=0,o=0,c=r[0];for(;c!==void 0;){if(a===c.index){let h;c.type===2?h=new Qe(s,s.nextSibling,this,n):c.type===1?h=new c.ctor(s,c.name,c.strings,this,n):c.type===6&&(h=new Kt(s,this,n)),this._$AV.push(h),c=r[++o]}a!==c?.index&&(s=Ne.nextNode(),a++)}return Ne.currentNode=Oe,i}p(n){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(n,r,e),e+=r.strings.length-2):r._$AI(n[e])),e++}},Qe=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,r,i){this.type=2,this._$AH=k,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=Fe(this,n,e),gt(n)?n===k||n==null||n===""?(this._$AH!==k&&this._$AR(),this._$AH=k):n!==this._$AH&&n!==B&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Mi(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==k&&gt(this._$AH)?this._$AA.nextSibling.data=n:this.T(Oe.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:r}=n,i=typeof r=="number"?this._$AC(n):(r.el===void 0&&(r.el=_t.createElement(zi(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(e);else{let s=new Ut(i,this),a=s.u(this.options);s.p(e),this.T(a),this._$AH=s}}_$AC(n){let e=Ii.get(n.strings);return e===void 0&&Ii.set(n.strings,e=new _t(n)),e}k(n){jr(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,i=0;for(let s of n)i===e.length?e.push(r=new t(this.O(ft()),this.O(ft()),this,this.options)):r=e[i],r._$AI(s),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let r=Di(n).nextSibling;Di(n).remove(),n=r}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Ie=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,r,i,s){this.type=1,this._$AH=k,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=k}_$AI(n,e=this,r,i){let s=this.strings,a=!1;if(s===void 0)n=Fe(this,n,e,0),a=!gt(n)||n!==this._$AH&&n!==B,a&&(this._$AH=n);else{let o=n,c,h;for(n=s[0],c=0;c<s.length-1;c++)h=Fe(this,o[r+c],e,c),h===B&&(h=this._$AH[c]),a||=!gt(h)||h!==this._$AH[c],h===k?n=k:n!==k&&(n+=(h??"")+s[c+1]),this._$AH[c]=h}a&&!i&&this.j(n)}j(n){n===k?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Bt=class extends Ie{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===k?void 0:n}},qt=class extends Ie{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==k)}},Vt=class extends Ie{constructor(n,e,r,i,s){super(n,e,r,i,s),this.type=5}_$AI(n,e=this){if((n=Fe(this,n,e,0)??k)===B)return;let r=this._$AH,i=n===k&&r!==k||n.capture!==r.capture||n.once!==r.once||n.passive!==r.passive,s=n!==k&&(r===k||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Kt=class{constructor(n,e,r){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(n){Fe(this,n)}},Ui={M:Ir,P:de,A:Mr,C:1,L:Wi,R:Ut,D:Mi,V:Fe,I:Qe,H:Ie,N:qt,U:Vt,B:Bt,F:Kt},ma=Fr.litHtmlPolyfillSupport;ma?.(_t,Qe),(Fr.litHtmlVersions??=[]).push("3.3.2");var Bi=(t,n,e)=>{let r=e?.renderBefore??n,i=r._$litPart$;if(i===void 0){let s=e?.renderBefore??null;r._$litPart$=i=new Qe(n.insertBefore(ft(),s),s,void 0,e??{})}return i._$AI(t),i};var Wr=globalThis,b=class extends le{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Bi(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}};b._$litElement$=!0,b.finalized=!0,Wr.litElementHydrateSupport?.({LitElement:b});var fa=Wr.litElementPolyfillSupport;fa?.({LitElement:b});(Wr.litElementVersions??=[]).push("4.2.2");var x=t=>(n,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(t,n)}):customElements.define(t,n)};var ga={attribute:!0,type:String,converter:pt,reflect:!1,hasChanged:zt},_a=(t=ga,n,e)=>{let{kind:r,metadata:i}=e,s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(e.name,t),r==="accessor"){let{name:a}=e;return{set(o){let c=n.get.call(this);n.set.call(this,o),this.requestUpdate(a,c,t,!0,o)},init(o){return o!==void 0&&this.C(a,void 0,t,o),o}}}if(r==="setter"){let{name:a}=e;return function(o){let c=this[a];n.call(this,o),this.requestUpdate(a,c,t,!0,o)}}throw Error("Unsupported decorator location: "+r)};function m(t){return(n,e)=>typeof e=="object"?_a(t,n,e):((r,i,s)=>{let a=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),a?Object.getOwnPropertyDescriptor(i,s):void 0})(t,n,e)}function g(t){return m({...t,state:!0,attribute:!1})}function qi(t,n){try{customElements.define(t,n)}catch{}}var va=["ha-input","ha-textfield","ha-form"],ya=["ha-input","ha-textfield"];function Vi(){for(let t of ya)if(customElements.get(t))return t;return null}function _e(t,n){for(let e of va)customElements.get(e)||customElements.whenDefined(e).then(()=>t.requestUpdate())}var Ki={time_of_day_period:{morning:"Morning",afternoon:"Afternoon",evening:"Evening",nighttime:"Nighttime",daytime:"Daytime"},weekday:{mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",sun:"Sun"},day_item:{weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"},lux_range:{dark:"Dark",dim:"Dim",normal:"Normal",bright:"Bright",very_bright:"Very bright"},condition:{time_of_day:"Time of day",state:"Entity state",script:"Script",sun:"Sun",template:"Template",lux:"Lux"},action:{},anchor:{dawn:"Dawn",sunrise:"Sunrise",noon:"Noon",sunset:"Sunset",dusk:"Dusk",midnight:"Midnight"},ui:{panel_title:"Ambience",tab_settings:"Settings",settings_tab_ambience:"Ambience",settings_tab_conditions:"Conditions",settings_tab_actions:"Actions",settings_ambience_defaults_card:"Defaults",settings_ambience_field_name:"Switch name",settings_ambience_field_delay:"Auto-on delay (seconds)",settings_ambience_delay_help:"0 = never auto-on",settings_ambience_actions_placeholder:"No action settings yet",no_areas:"No areas found in Home Assistant.",not_configured:"not configured",scene_singular:"scene",scene_plural:"scenes",all_categories:"All categories",add_category:"Add category\u2026",loading:"Loading\u2026",any_placeholder:"(any)",include:"Include",exclude:"Exclude",empty_all_days:"(empty \u2192 all days)",add_include_item:"+ Add include item",add_exclude_item:"+ Add exclude item",from:"from",to:"to",remove:"Remove",day_of_month_placeholder:"e.g. 1-10, 15",workday_sensor:"Workday sensor",workday_calendar:"Workday calendar",day_warning_prefix:"Warning:",day_warning_text:"scenes now reference unconfigured entities:",periods_heading:"Periods",reset_all_to_defaults:"Reset all to defaults",badge_builtin:"builtin",badge_builtin_edited:"builtin, edited",badge_custom:"custom",badge_hidden:"hidden",hidden_marker:"(hidden)",period_warning_prefix:"Warning:",period_warning_text:"some scenes now reference missing periods:",add_custom_period:"+ Add custom period",lux_heading:"Lux ranges",lux_warning_text:"some scenes now reference missing lux ranges:",add_custom_lux_range:"+ Add custom lux range",lux_modal_add_title:"Add custom lux range",lux_modal_edit_title:'Edit "{name}"',lux_min_label:"Min (lx)",lux_max_label:"Max (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",any_lux:"Any lux",occupancy_is:"is",occupancy_is_not:"is not",lux_any:"Any of",lux_all:"All of",title_edit:"Edit",title_revert:"Revert to default",title_delete:"Delete",title_restore:"Restore",reset_confirm:"This will clear {custom} custom period(s) and restore {hidden} hidden built-in(s). Continue?",new_scene:"New scene",name_optional:"Name (optional)",category:"Category",scope:"Scope",when_heading:"When",actions_heading:"Actions",target:"Target",remove_action:"Remove action",add_action:"+ Add action\u2026",remove_condition:"Remove condition",add_condition:"+ Add condition\u2026",add_action_button:"Add action",cancel:"Cancel",save:"Save",save_scene:"Save scene",at_least_one_target:"At least one target is required.",condition_error:"Fix the error in this condition before continuing",param_required:"{param} is required.",no_scenes_yet:"No scenes yet.",add_scene:"+ Add scene",summary_any:"any",summary_any_paren:"(any)",no_targets:"(no targets)",target_noun:"target",action_singular:"action",action_plural:"actions",noop_prefix:"NOOP",scene_n:"Scene {n}",drag_to_reorder:"Drag to reorder",unpin:"Unpin (return to automatic order)",enable_scene:"Enable scene",disable_scene:"Disable scene",shadowed:"Never fires \u2014 shadowed by an earlier scene.",edit:"Edit",duplicate:"Duplicate",run_actions:"Run actions",run:"Run",auto_triggers_section:"Auto-triggers",auto_triggers_none:"No automatic triggers.",auto_triggers_opaque_note:"A script scene is opaque \u2014 some watches may be missing. Declare them in the scene's Triggers field.",auto_trigger_group_time:"Time",auto_trigger_group_sun:"Sun",auto_trigger_date_rollover:"Local midnight (date rollover)",auto_trigger_periodic:"periodic re-check",auto_trigger_reapply:"Re-apply",auto_trigger_every:"every",more_actions:"More actions",scene_actions:"Scene actions",error_enter_name:"Please enter a name.",error_start_letter:"Name must start with a letter.",error_name_exists:"An entry with this name already exists. Choose a different name.",period_modal_add_title:"Add custom period",period_modal_edit_title:'Edit "{name}"',name:"Name",name_placeholder:"e.g. Wind down",lux_name_placeholder:"e.g. Gloomy",lux_error_need_bound:"Enter a min, a max, or both.",lux_error_negative:"Bounds must be 0 or greater.",lux_error_order:"Min must be less than max.",from_label:"From",to_label:"To",any_time:"Any time",custom_range:"Custom range",custom_suffix:" (custom)",add_time_range:"+ add another time range",endpoint_time:"Time",endpoint_sun:"Sun",offset_placeholder:"Offset",clamp_none:"\u2014",clamp_not_before:"not before",clamp_not_after:"not after",unit_hour:"hour",unit_hours:"hours",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"No matching entities in this area.",field_kind:"Kind",field_days_of_month:"Days of month",field_month:"Month",field_day:"Day",field_from_month:"From month",field_from_day:"From day",field_to_month:"To month",field_to_day:"To day",day_spec_error:"Use days 1\u201331 and ranges like 1-10, separated by commas",title_override:"Override",conditions:"Conditions",thresholds:"Thresholds",add_threshold:"+ Add threshold",weather_entity:"Weather entity",weather_warning_text:"scenes now reference an unconfigured weather entity:",groups:"Groups",add_group:"+ Add group",sun:{elevation:"Elevation",azimuth:"Azimuth",any:"Any",above:"Above",below:"Below",between:"Between",custom_range:"Custom range"},arguments:"Arguments",form:"Form",script:"Script",yaml:"YAML",script_entity:"Script",pick_script:"\u2014 select a script \u2014",script_not_found_prefix:"Script",script_not_found_suffix:"not found. It may have been removed.",script_no_parameters:"This script has no parameters.",script_required:"Please pick a script.",no_script_chosen:"(not selected)",yaml_must_be_object:"Top-level value must be a mapping.",invalid_yaml:"Invalid YAML.",reapply_enable_label:"Re-apply periodically",reapply_seconds_label:"Re-apply every (seconds)",reapply_seconds_unit:"s",settings_tab_categories:"Scene categories",category_add:"+ Add category",category_name_placeholder:"Category name",category_icon:"Icon",category_color:"Colour",category_name_blank_error:"Category names can't be empty.",category_name_duplicate_error:"Two categories can't have the same name.",category_delete_blocked_last:"You can't delete the last category.",category_delete_blocked_in_use:"This category still has scenes \u2014 move or delete them first.",category_edit_title:"Edit category",category_add_title:"Add category",category_color_none:"No colour",category_save:"Save",view_traces:"View traces",pause_scope:"Pause this scope",resume_scope:"Resume now"},day_summary:{any:"any",any_day:"any day",except:"except",day_prefix:"day",last_day:"last day",workday:"workday",holiday:"holiday",first_workday:"first workday",last_workday:"last workday"},month:{1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"},weather_condition:{"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"},weather_attr:{temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"}};function ba(t){let n="component.ambience.";if(!t.startsWith(n))return;let e=t.slice(n.length).split("."),r=Ki;for(let i of e){if(r===null||typeof r!="object")return;r=r[i]}return typeof r=="string"?r:void 0}function Q(t,n,e){let r=t?.localize?.(n);if(r&&r!==n)return r;let i=ba(n);return i!==void 0?i:e}function ce(t){let n=t.replaceAll("_"," ").toLowerCase();return n.charAt(0).toUpperCase()+n.slice(1)}function Ur(t){return ce(t)}function vt(t){let n=t.indexOf("."),e=n===-1?"":t.slice(0,n),i=(n===-1?t:t.slice(n+1)).replaceAll("_"," ").trim().toLowerCase(),s=e.replaceAll("_"," ").trim().toLowerCase(),a=i?i.split(" "):[],o=s?s.split(" "):[],c=o.length>0&&o.every(p=>a.includes(p)),h=!s||c?i:`${i} ${s}`;return h.charAt(0).toUpperCase()+h.slice(1)}function xa(t){return t.replace(/_/g," ").replace(/\bid\b/g,"ID").replace(/\bip\b/g,"IP").replace(/\bmac\b/g,"MAC").replace(/\bgps\b/g,"GPS").replace(/^\w/,n=>n.toUpperCase())}function Gt(t,n,e){let r=t?.formatEntityAttributeName;if(r&&n){let i=r(n,e);if(i)return i}return xa(e)}function Qt(t,n,e,r){if(!n)return r;let i=t;if(e){let s=i?.formatEntityAttributeValue;if(s){let a=s(n,e,r);if(a)return a}}else{let s=i?.formatEntityState;if(s){let a=s(n,r);if(a)return a}}return r}function Y(t,n){return Q(t,`component.ambience.condition.${n}`,Ur(n))}function Jt(t,n){return Q(t,`component.ambience.action.${n}`,Ur(n))}function ve(t,n){return Q(t,`component.ambience.anchor.${n}`,Ur(n))}function ye(t,n,e){let r=e[n]?.label;if(r)return r;let i=n.charAt(0).toUpperCase()+n.slice(1);return Q(t,`component.ambience.time_of_day_period.${n}`,i)}function Je(t,n,e){let r=e[n]?.label;return r||Q(t,`component.ambience.lux_range.${n}`,ce(n))}function d(t,n,e){return Q(t,`component.ambience.${n}`,e)}var wa=["mon","tue","wed","thu","fri","sat","sun"],$a=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Xt(t,n){return Q(t,`component.ambience.weekday.${wa[n]}`,$a[n]??String(n))}var ka={weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"};function Zt(t,n){return Q(t,`component.ambience.day_item.${n}`,ka[n]??n)}var Ea=["January","February","March","April","May","June","July","August","September","October","November","December"];function Xe(t,n){return Q(t,`component.ambience.month.${n}`,Ea[n-1]??String(n))}var Sa={"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"};function Ze(t,n){return Q(t,`component.ambience.weather_condition.${n}`,Sa[n]??n)}var Ca={temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"};function yt(t,n){return Q(t,`component.ambience.weather_attr.${n}`,Ca[n]??n)}var Ta={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},La={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},Ra={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function Br(t,n,e){if(n==="humidity")return"%";let r=Ra[n];if(r){let a=e?.attributes?.[r];if(typeof a=="string"&&a)return a}let i=La[n],s=t?.config?.unit_system;return i&&s&&typeof s[i]=="string"?s[i]:Ta[n]??""}var Pa={is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"};function J(t,n){return Q(t,`component.ambience.state_op.${n}`,Pa[n]??n)}var Da=import.meta.url.slice(0,import.meta.url.lastIndexOf("/")+1);function Yi(t){return Da+t}function Gi(t,n,e){let r=e.title??"Ambience",i=e.dark?`dark_${t}`:t,s=Yi(`${i}.png`),a=Yi(`${i}@2x.png`);return l`<img
    class=${n}
    src=${s}
    srcset="${s} 1x, ${a} 2x"
    alt=${r}
  />`}function Qi(t={}){return Gi("logo","ambience-logo",t)}function Ji(t={}){return Gi("icon","ambience-icon",t)}var Xi="ambience-filter-category",Zi="ambience-expanded-scopes",en="ambience-conditions-hint-dismissed";function er(){try{return window.localStorage.getItem(Xi)??""}catch{return""}}function tn(t){try{window.localStorage.setItem(Xi,t)}catch{}}function rn(){try{let t=window.localStorage.getItem(Zi);if(!t)return[];let n=JSON.parse(t);return Array.isArray(n)?n.filter(e=>typeof e=="string"):[]}catch{return[]}}function nn(t){try{window.localStorage.setItem(Zi,JSON.stringify(t))}catch{}}function sn(){try{return window.localStorage.getItem(en)==="1"}catch{return!1}}function an(){try{window.localStorage.setItem(en,"1")}catch{}}async function on(t){return t.callWS({type:"ambience/areas/list"})}async function qr(t,n){return t.callWS({type:"ambience/area/get",area_id:n})}async function ln(t,n,e){return t.callWS({type:"ambience/area/save",area_id:n,config:e})}async function dn(t){return t.callWS({type:"ambience/floors/list"})}async function Vr(t,n){return t.callWS({type:"ambience/floor/get",floor_id:n})}async function cn(t,n,e){return t.callWS({type:"ambience/floor/save",floor_id:n,config:e})}async function Kr(t){return t.callWS({type:"ambience/house/get"})}async function un(t,n){return t.callWS({type:"ambience/house/save",config:n})}async function tr(t){return t.callWS({type:"ambience/conditions/list"})}async function hn(t,n,e){let r={type:"ambience/auto_triggers/list",scope_kind:n};return e!=null&&(r.scope_id=e),t.callWS(r)}async function bt(t){return t.callWS({type:"ambience/exposed_actions/list"})}async function pn(t,n){return t.callWS({type:"ambience/exposed_actions/save",actions:n})}async function mn(t){return t.callWS({type:"ambience/services/list"})}async function be(t,n){return t.callWS({type:"ambience/services/get_schema",service:n})}function Yr(t){return t.kind==="area"?{area_id:t.id}:t.kind==="floor"?{floor_id:t.id}:{house:!0}}async function fn(t,n,e){let r={type:"ambience/apply",...Yr(n)};return e!==void 0&&(r.category_id=e),t.callWS(r)}async function gn(t,n,e){return t.callWS({type:"ambience/scene/run_actions",scene_index:e,...Yr(n)})}async function rr(t){return t.callWS({type:"ambience/time_of_day_periods/list"})}async function _n(t,n,e){return t.callWS({type:"ambience/time_of_day_periods/save",custom:n,hidden:e})}async function ir(t){return t.callWS({type:"ambience/lux_ranges/list"})}async function vn(t,n,e){return t.callWS({type:"ambience/lux_ranges/save",custom:n,hidden:e})}async function xt(t){return t.callWS({type:"ambience/conditions/day/config/list"})}async function yn(t,n,e){return t.callWS({type:"ambience/conditions/day/config/save",workday_sensor:n,workday_calendar:e})}async function wt(t){return t.callWS({type:"ambience/conditions/weather/config/list"})}async function bn(t,n,e){return t.callWS({type:"ambience/conditions/weather/config/save",entity:n,groups:e})}async function Gr(t,n){return t.callWS({type:"ambience/state/known_states",entity_id:n})}async function Qr(t,n,e){return t.callWS({type:"ambience/state/known_attribute_values",entity_id:n,attribute:e})}async function xn(t){return t.callWS({type:"ambience/switch_defaults/list"})}async function wn(t){return t.callWS({type:"ambience/switches/list"})}async function $n(t,n,e){return t.callWS({type:"ambience/set_scope_enabled",...Yr(n),enabled:e})}async function Jr(t,n,e){return t.callWS({type:"ambience/switch_defaults/save",name:n,auto_on_delay_seconds:e})}async function Me(t){return(await t.callWS({type:"ambience/categories/list"})).categories}async function kn(t,n){return t.callWS({type:"ambience/categories/save",categories:n})}async function En(t,n){return t.callWS({type:"ambience/categories/delete",category_id:n})}async function Xr(t){return(await t.callWS({type:"ambience/traces/list"})).traces}async function Sn(t,n,e){return t.callWS({type:"ambience/simulate/inputs",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e})}async function Cn(t,n,e,r,i,s){return(await t.callWS({type:"ambience/simulate",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e,now:r,overrides:i,verdicts:s})).result}var Zr=[{id:"red",label:"Red",hex:"#f44336"},{id:"pink",label:"Pink",hex:"#e91e63"},{id:"purple",label:"Purple",hex:"#9c27b0"},{id:"deep-purple",label:"Deep purple",hex:"#673ab7"},{id:"indigo",label:"Indigo",hex:"#3f51b5"},{id:"blue",label:"Blue",hex:"#2196f3"},{id:"light-blue",label:"Light blue",hex:"#03a9f4"},{id:"cyan",label:"Cyan",hex:"#00bcd4"},{id:"teal",label:"Teal",hex:"#009688"},{id:"green",label:"Green",hex:"#4caf50"},{id:"light-green",label:"Light green",hex:"#8bc34a"},{id:"lime",label:"Lime",hex:"#cddc39"},{id:"yellow",label:"Yellow",hex:"#ffeb3b"},{id:"amber",label:"Amber",hex:"#ffc107"},{id:"orange",label:"Orange",hex:"#ff9800"},{id:"deep-orange",label:"Deep orange",hex:"#ff5722"},{id:"brown",label:"Brown",hex:"#795548"},{id:"grey",label:"Grey",hex:"#9e9e9e"},{id:"blue-grey",label:"Blue grey",hex:"#607d8b"}];function ei(t){if(t)return Zr.find(n=>n.id===t)?.hex}function Aa(t){let n=t.replace("#",""),e=parseInt(n.slice(0,2),16)/255,r=parseInt(n.slice(2,4),16)/255,i=parseInt(n.slice(4,6),16)/255,s=o=>o<=.03928?o/12.92:((o+.055)/1.055)**2.4;return .2126*s(e)+.7152*s(r)+.0722*s(i)>.5?"#000000":"#ffffff"}function nr(t){let n=ei(t);return n?`background:${n};color:${Aa(n)}`:""}var sr=v`
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
`;function et(t,n){return l`<span class="category-swatch" style=${nr(t)}>
    ${n?l`<ha-icon icon=${n}></ha-icon>`:""}
  </span>`}var te=class extends b{constructor(){super(...arguments);this._categories=[];this._sortedCategories=[];this._filterCategory=er();this._open=!1;this._loaded=!1;this._onCategoriesChanged=async()=>{try{await this._fetchCategories()}catch{}};this._onDocClick=e=>{this._open&&!e.composedPath().includes(this)&&(this._open=!1)}}async _fetchCategories(){let e=await Me(this.hass);this.isConnected&&(this._categories=e,this._filterCategory&&!e.some(r=>r.id===this._filterCategory)&&this._select(""))}async connectedCallback(){super.connectedCallback(),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("click",this._onDocClick);try{await this._fetchCategories()}catch{}finally{this.isConnected&&(this._loaded=!0)}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("click",this._onDocClick)}willUpdate(e){e.has("_categories")&&(this._sortedCategories=[...this._categories].sort((r,i)=>r.name.localeCompare(i.name)))}_select(e){this._filterCategory=e,tn(e),this._open=!1,this.dispatchEvent(new CustomEvent("ambience-filter-changed",{detail:{category:e},bubbles:!0,composed:!0}))}_openSettings(){this._open=!1,this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:"ambience"},bubbles:!0,composed:!0}))}_renderEntry(e){return e===null?l`
        ${et(void 0,"mdi:filter-variant")}
        <span class="category-name"
          >${d(this.hass,"ui.all_categories","All categories")}</span
        >
      `:l`
      ${et(e.color,e.icon)}
      <span class="category-name">${e.name}</span>
    `}_renderAddCategory(e){return l`
      <button
        class="category-filter-add${e?" category-filter-add--footer":""}"
        @click=${()=>this._openSettings()}
      >
        <ha-icon icon="mdi:plus"></ha-icon>
        <span class="category-name"
          >${d(this.hass,"ui.add_category","Add category\u2026")}</span
        >
      </button>
    `}render(){if(!this._loaded)return l``;if(this._categories.length<=1)return this._renderAddCategory(!1);let e=this._sortedCategories,r=this._categories.find(i=>i.id===this._filterCategory)??null;return l`
      <div class="category-filter">
        <button
          class="category-filter-trigger"
          aria-haspopup="listbox"
          aria-expanded=${this._open}
          @click=${()=>{this._open=!this._open}}
        >
          ${this._renderEntry(r)}
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
                  ${e.map(i=>l`<button
                        class="category-filter-option"
                        role="option"
                        aria-selected=${this._filterCategory===i.id}
                        @click=${()=>this._select(i.id)}
                      >
                        ${this._renderEntry(i)}
                      </button>`)}
                </div>
                ${this._renderAddCategory(!0)}
              </div>
            `:k}
      </div>
    `}};te.styles=[sr,v`
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
    `],u([m({attribute:!1})],te.prototype,"hass",2),u([g()],te.prototype,"_categories",2),u([g()],te.prototype,"_filterCategory",2),u([g()],te.prototype,"_open",2),u([g()],te.prototype,"_loaded",2),te=u([x("ambience-category-filter")],te);var ue={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ar=t=>(...n)=>({_$litDirective$:t,values:n}),tt=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,r){this._$Ct=n,this._$AM=e,this._$Ci=r}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:Ha}=Ui,Tn=t=>t;var Rn=t=>t.strings===void 0,Ln=()=>document.createComment(""),rt=(t,n,e)=>{let r=t._$AA.parentNode,i=n===void 0?t._$AB:n._$AA;if(e===void 0){let s=r.insertBefore(Ln(),i),a=r.insertBefore(Ln(),i);e=new Ha(s,a,t,t.options)}else{let s=e._$AB.nextSibling,a=e._$AM,o=a!==t;if(o){let c;e._$AQ?.(t),e._$AM=t,e._$AP!==void 0&&(c=t._$AU)!==a._$AU&&e._$AP(c)}if(s!==i||o){let c=e._$AA;for(;c!==s;){let h=Tn(c).nextSibling;Tn(r).insertBefore(c,i),c=h}}}return e},xe=(t,n,e=t)=>(t._$AI(n,e),t),Na={},or=(t,n=Na)=>t._$AH=n,Pn=t=>t._$AH,lr=t=>{t._$AR(),t._$AA.remove()};var ti=ar(class extends tt{constructor(t){if(super(t),t.type!==ue.PROPERTY&&t.type!==ue.ATTRIBUTE&&t.type!==ue.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Rn(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[n]){if(n===B||n===k)return n;let e=t.element,r=t.name;if(t.type===ue.PROPERTY){if(n===e[r])return B}else if(t.type===ue.BOOLEAN_ATTRIBUTE){if(!!n===e.hasAttribute(r))return B}else if(t.type===ue.ATTRIBUTE&&e.getAttribute(r)===n+"")return B;return or(t),n}});var Dn=(t,n,e)=>{let r=new Map;for(let i=n;i<=e;i++)r.set(t[i],i);return r},An=ar(class extends tt{constructor(t){if(super(t),t.type!==ue.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,n,e){let r;e===void 0?e=n:n!==void 0&&(r=n);let i=[],s=[],a=0;for(let o of t)i[a]=r?r(o,a):a,s[a]=e(o,a),a++;return{values:s,keys:i}}render(t,n,e){return this.dt(t,n,e).values}update(t,[n,e,r]){let i=Pn(t),{values:s,keys:a}=this.dt(n,e,r);if(!Array.isArray(i))return this.ut=a,s;let o=this.ut??=[],c=[],h,p,f=0,_=i.length-1,y=0,$=s.length-1;for(;f<=_&&y<=$;)if(i[f]===null)f++;else if(i[_]===null)_--;else if(o[f]===a[y])c[y]=xe(i[f],s[y]),f++,y++;else if(o[_]===a[$])c[$]=xe(i[_],s[$]),_--,$--;else if(o[f]===a[$])c[$]=xe(i[f],s[$]),rt(t,c[$+1],i[f]),f++,$--;else if(o[_]===a[y])c[y]=xe(i[_],s[y]),rt(t,i[f],i[_]),_--,y++;else if(h===void 0&&(h=Dn(a,y,$),p=Dn(o,f,_)),h.has(o[f]))if(h.has(o[_])){let E=p.get(a[y]),R=E!==void 0?i[E]:null;if(R===null){let U=rt(t,i[f]);xe(U,s[y]),c[y]=U}else c[y]=xe(R,s[y]),rt(t,i[f],R),i[E]=null;y++}else lr(i[_]),_--;else lr(i[f]),f++;for(;y<=$;){let E=rt(t,c[$+1]);xe(E,s[y]),c[y++]=E}for(;f<=_;){let E=i[f++];E!==null&&lr(E)}return this.ut=a,or(t,c),B}});function W(t){return t.kind==="house"?"house":`${t.kind}:${t.id}`}function dr(t,n){return`${W(t)}\0${n}`}function Hn(t,n){if(!n||n.entity==null)return[...t];let e=Array.isArray(n.entity)?n.entity:[n.entity];if(e.length===0)return[...t];let r=new Set,i=!1;for(let s of e){if(!s||typeof s!="object")continue;let a=s.domain;if(a==null){i=!0;continue}if(Array.isArray(a))for(let o of a)typeof o=="string"&&r.add(o);else typeof a=="string"&&r.add(a)}return i||r.size===0?[...t]:t.filter(s=>{let a=s.indexOf(".");return a<0?!1:r.has(s.slice(0,a))})}function cr(t,n,e=[]){let r=t;if(!r?.entities)return[];let i=r.entities,s=r.devices??{},a=r.areas??{},o=n.kind==="area"?new Set([n.id]):n.kind==="floor"?new Set(Object.values(a).filter(h=>h.floor_id===n.id).map(h=>h.area_id)):null,c=h=>{let p=h.area_id??(h.device_id?s[h.device_id]?.area_id??null:null);return p==null?!1:o===null?!0:o.has(p)};return Object.values(i).filter(c).filter(h=>e.length===0||e.includes(h.entity_id.split(".")[0])).map(h=>h.entity_id).sort()}function $t(t){let{priority:n,pinned:e,shadowed_by:r,...i}=t;return i}function Nn(t,n){if(n<0||n>=t.length)return[];let e=new Set(t[n].entity_ids??[]),r=new Set;return t.forEach((i,s)=>{if(s!==n)for(let a of i.entity_ids??[])e.has(a)||r.add(a)}),[...r]}var ri={house:"mdi:home",floor:"mdi:layers",area:"mdi:texture-box"};function kt(t,n){return t.kind==="house"?ri.house:t.kind==="floor"?n?.floors?.[t.id]?.icon||ri.floor:n?.areas?.[t.id]?.icon||ri.area}var he=class extends b{constructor(){super(...arguments);this.items=[];this._open=!1;this._onKeydown=e=>{e.key==="Escape"&&this._open&&(this._open=!1)}}_triggerLabel(){return this.label??d(this.hass,"ui.more_actions","More actions")}_select(e,r){r.stopPropagation(),this._open=!1,this.dispatchEvent(new CustomEvent("menu-action",{detail:{id:e},bubbles:!0,composed:!0}))}_renderItems(){return this.items.map(e=>l`
        ${e.dividerBefore?l`<div class="kebab-divider" role="separator"></div>`:k}
        <button
          class="kebab-item ${e.danger?"danger":""}"
          role="menuitem"
          data-action=${e.id}
          @click=${r=>this._select(e.id,r)}
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
        @click=${r=>{r.stopPropagation(),this._open=!this._open}}
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
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this._onKeydown)}disconnectedCallback(){this.removeEventListener("keydown",this._onKeydown),super.disconnectedCallback()}render(){return this._renderMenu()}};he.styles=v`
    :host { position: relative; display: inline-flex; flex: 0 0 auto; }
    .kebab-trigger {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; padding: 0;
      border: 0; border-radius: 50%; background: none;
      color: var(--kebab-trigger-color, var(--secondary-text-color, #888));
      cursor: pointer; font: inherit;
    }
    .kebab-trigger:hover { background: var(--secondary-background-color, #f5f5f5); }
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
  `,u([m({attribute:!1})],he.prototype,"items",2),u([m({attribute:!1})],he.prototype,"hass",2),u([m()],he.prototype,"label",2),u([g()],he.prototype,"_open",2),he=u([x("ambience-kebab-menu")],he);function Oa(t){return t.style.pointerEvents="none",t.style.willChange="transform",()=>{t.style.pointerEvents="",t.style.willChange="",t.style.transform=""}}function ur(t,n,e={}){let r=t.pointerId;try{t.target?.setPointerCapture?.(r)}catch{}let i=e.follow??null,s=t.clientX,a=t.clientY,o=i?Oa(i):null,c=_=>{_.pointerId===r&&(n.onMove(_.clientX,_.clientY),i&&(i.style.transform=`translate(${_.clientX-s}px, ${_.clientY-a}px)`))},h=_=>{_.pointerId===r&&(f(),n.onEnd(_.clientX,_.clientY))},p=_=>{_.pointerId===r&&(f(),n.onCancel())},f=()=>{window.removeEventListener("pointermove",c,!0),window.removeEventListener("pointerup",h,!0),window.removeEventListener("pointercancel",p,!0),o?.()};return window.addEventListener("pointermove",c,!0),window.addEventListener("pointerup",h,!0),window.addEventListener("pointercancel",p,!0),f}function hr(t,n){let e=document.elementFromPoint?.(t,n)??null;if(!e)return null;for(;e.shadowRoot;){let r=e.shadowRoot.elementFromPoint?.(t,n);if(!r||r===e)break;e=r}return e}var it=class{constructor(n,e,r={}){this.host=n;this.onReorder=e;this.from=null;this.over=null;this.moved=!1;this._cancelDrag=null;this._locate=r.locate??((i,s)=>this._domLocate(i,s)),n.addController(this)}hostDisconnected(){this._reset()}start(n,e){if(!e.isPrimary||e.button>0)return;this._reset(),this.from=n,this.moved=!1,this.host.requestUpdate();let r=e.target?.closest("[data-drag-index]");this._cancelDrag=ur(e,{onMove:(i,s)=>this._hover(this._locate(i,s)),onEnd:(i,s)=>this.drop(this._locate(i,s)),onCancel:()=>this.end()},{follow:r})}_hover(n){if(this.from===null)return;let e=n===null||n===this.from?null:n;e!==null&&(this.moved=!0),this.over!==e&&(this.over=e,this.host.requestUpdate())}drop(n){let e=this.from;this._reset(),!(e===null||n===null||e===n)&&this.onReorder(e,n)}end(){this._reset()}_domLocate(n,e){let r=this.host.renderRoot,s=(r?.elementFromPoint?r.elementFromPoint(n,e):hr(n,e))?.closest?.("[data-drag-index]");if(!s)return null;let a=Number(s.getAttribute("data-drag-index"));return Number.isNaN(a)?null:a}_reset(){this._cancelDrag?.(),this._cancelDrag=null;let n=this.from!==null||this.over!==null;this.from=null,this.over=null,n&&this.host.requestUpdate()}};var Fa={light:"mdi:lightbulb",switch:"mdi:toggle-switch-variant",binary_sensor:"mdi:motion-sensor",sensor:"mdi:eye",person:"mdi:account",device_tracker:"mdi:account",climate:"mdi:thermostat",cover:"mdi:window-shutter",media_player:"mdi:cast",lock:"mdi:lock",fan:"mdi:fan",weather:"mdi:weather-partly-cloudy",input_boolean:"mdi:toggle-switch",event:"mdi:eye-check",script:"mdi:script-text",template:"mdi:code-braces"},ii="mdi:eye";function O(t,n){let e=t?.states?.[n]?.attributes?.friendly_name;return typeof e=="string"&&e?e:n}function Ia(t,n){let e=t?.states?.[n]?.attributes?.icon;if(typeof e=="string"&&e)return e;let r=n.split(".")[0];return Fa[r]??ii}function Et(t,n){let e=t?.states?.[n];return e&&customElements.get("ha-state-icon")?l`<ha-state-icon class="row-icon" .hass=${t} .stateObj=${e}></ha-state-icon>`:l`<ha-icon class="row-icon" icon=${Ia(t,n)}></ha-icon>`}var On=v`
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
`;function Ct(t,n,e){if(n&&e){let r=e[n]?.fields?.[t];if(r&&typeof r=="object"){let i=r.name;if(typeof i=="string"&&i)return i}}return nt(t)}function fr(t,n="New scene"){return t.name?.trim()?t.name:n}function Tt(t,n,e){return n==null?d(e.hass,"ui.summary_any_paren","(any)"):t==="time_of_day"?_r(n,e):t==="day"?Wa(n,e):t==="weather"?Ya(n,e):t==="sun"?Ga(n,e):t==="state"?oi(n,e):t==="script"?ja(n,e):t==="people"?za(n,e):t==="occupancy"?Qa(n,e):t==="lux"?Ja(n,e):t==="template"?Ma(n,e):String(n)}function Ma(t,n={}){return t===null?d(n.hass,"ui.summary_any_paren","(any)"):typeof t!="object"||typeof t.template!="string"?String(t):t.template}function ja(t,n={}){if(t===null)return d(n.hass,"ui.summary_any_paren","(any)");if(typeof t!="object"||typeof t.script!="string")return String(t);let e=St(n,t.script),r=t.args??{},i=Object.keys(r).sort();if(i.length===0)return e;let s=i.map(a=>`${si(n.hass,t.script,a)}: ${we(n.hass,r[a])}`).join(", ");return`${e} (${s})`}function si(t,n,e){let r=n.replace(/^script\./,""),s=t?.services?.script?.[r]?.fields?.[e]?.name;return typeof s=="string"&&s?s:nt(e)}function St(t,n){let r=t.hass?.states?.[n]?.attributes?.friendly_name;if(typeof r=="string"&&r)return r;let i=n.indexOf("."),s=i>=0?n.slice(i+1):n;return s.charAt(0).toUpperCase()+s.slice(1)}function Fn(t,n){return t==="home"?d(n.hass,"people_summary.home","Home"):St(n,t)}function za(t,n={}){if(t==null)return d(n.hass,"ui.summary_any","any");let e=t.where??"home";if(Array.isArray(t.who)&&t.who.length===1){let a=St(n,t.who[0]),c=t.quant==="nobody"!=!!t.negate?d(n.hass,"people_summary.is_not_at","is not at"):d(n.hass,"people_summary.is_at","is at"),h=`${a} ${c} ${Fn(e,n)}`;return t.for&&pr(t.for)?`${h} ${d(n.hass,"ui.for_prefix","for")} \u2265${mr(t.for)}`:h}let r;if(Array.isArray(t.who)){let a=t.quant??"any",o=a==="any"?d(n.hass,"ui.people_mode_any","Any of:"):a==="everyone"?d(n.hass,"ui.people_mode_all","All of:"):d(n.hass,"ui.people_mode_none","None of:"),c=t.who.map(h=>St(n,h)).join(", ");r=`${o} (${c})`}else{let a=t.quant??"everyone";r=a==="nobody"?d(n.hass,"ui.people_mode_nobody","Nobody"):a==="any"?d(n.hass,"ui.people_mode_anybody","Anybody"):d(n.hass,"ui.people_mode_everybody","Everybody")}let i=t.negate?d(n.hass,"people_summary.is_not_at","is not at"):d(n.hass,"people_summary.is_at","is at"),s=`${r} ${i} ${Fn(e,n)}`;return t.for&&pr(t.for)?`${s} ${d(n.hass,"ui.for_prefix","for")} \u2265${mr(t.for)}`:s}function Wa(t,n={}){if(t===null)return d(n.hass,"day_summary.any","any");let e=t.include??[],r=t.exclude??[],i=e.length===0?d(n.hass,"day_summary.any_day","any day"):e.map(a=>In(a,n)).join(", ");if(r.length===0)return i;let s=d(n.hass,"day_summary.except","except");return`${i} (${s} ${r.map(a=>In(a,n)).join(", ")})`}function In(t,n){switch(t.kind){case"weekday":return t.days.map(e=>Xt(n.hass,e)).join("/");case"day_of_month":return`${d(n.hass,"day_summary.day_prefix","Day")} ${t.days}`;case"date":return`${Xe(n.hass,t.month)} ${t.day}`;case"date_range":return`${Xe(n.hass,t.from.month)} ${t.from.day} \u2192 ${Xe(n.hass,t.to.month)} ${t.to.day}`;case"last_day":return d(n.hass,"day_summary.last_day","Last day");case"workday":return d(n.hass,"day_summary.workday","Workday");case"holiday":return d(n.hass,"day_summary.holiday","Holiday");case"first_workday":return d(n.hass,"day_summary.first_workday","First workday");case"last_workday":return d(n.hass,"day_summary.last_workday","Last workday")}}var Ua={"<":"<","<=":"\u2264",">":">",">=":"\u2265"};function nt(t){return ce(t)}function Ba(t){return typeof t=="string"?t:typeof t=="number"||typeof t=="boolean"?String(t):JSON.stringify(t)}var qa=["entity_id","device_id","area_id","label_id","floor_id"],Mn=2;function Va(t){if(!t||typeof t!="object"||Array.isArray(t))return null;let n=t;if(!Object.keys(n).every(i=>qa.includes(i)))return null;let e=n.entity_id,r=typeof e=="string"?[e]:Array.isArray(e)?e.filter(i=>typeof i=="string"):[];return r.length?r:null}function we(t,n){let e=Va(n);if(!e)return Ba(n);let r=e.slice(0,Mn).map(a=>St({hass:t},a)),i=e.length-Mn;return`[${i>0?`${r.join(", ")} +${i} more`:r.join(", ")}]`}function gr(t){if(!(!t||typeof t!="object")){for(let n of Object.values(t))if(n&&typeof n=="object"){let e=n.unit_of_measurement;if(typeof e=="string"&&e)return e}}}function Ka(t){return t.split(/[\s_-]+/).filter(n=>n!=="").map(n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()).join(" ")}function Ya(t,n={}){if(t===null)return d(n.hass,"ui.summary_any","any");let e=new Map((n.weatherGroups??[]).map(a=>[a.id,a.label])),r=(t.groups??[]).map(a=>e.get(a)??Ka(a)).join("/"),i=(t.thresholds??[]).map(a=>`${yt(n.hass,a.attribute)} ${Ua[a.op]??a.op} ${a.value}`).join(", "),s=[r,i].filter(a=>a!=="");return s.length===0?d(n.hass,"ui.summary_any","any"):s.join(", ")}function Ga(t,n={}){if(t===null)return d(n.hass,"ui.summary_any","any");let e=[],r=t.elevation;r&&(r.min!=null&&r.max!=null?e.push(`${r.min}\xB0\u2013${r.max}\xB0`):r.min!=null?e.push(`\u2265${r.min}\xB0`):r.max!=null&&e.push(`\u2264${r.max}\xB0`));let i=t.azimuth;if(i){i.sectors?.length&&e.push(i.sectors.join("/"));for(let s of i.ranges??[])e.push(`${s.from}\xB0\u2013${s.to}\xB0`)}return e.length===0?d(n.hass,"ui.summary_any","any"):e.join(", ")}function Un(t,n){return O(t.hass,n)}function Bn(t,n){return Un({hass:t},n)}function Qa(t,n={}){if(t==null||!t.sensors?.length)return d(n.hass,"ui.summary_any","any");let e=t.sensors.map(a=>O(n.hass,a)),r=t.occupied===!1?d(n.hass,"occupancy_summary.clear","clear"):d(n.hass,"occupancy_summary.detected","detected"),i=t.negate?`${d(n.hass,"occupancy_summary.not","not")} `:"",s;return e.length===1?s=`${e[0]} is ${i}${r}`:s=`${t.quant==="all"?d(n.hass,"occupancy_summary.all_of","all of"):d(n.hass,"occupancy_summary.any_of","any of")} (${e.join(", ")}) ${i}${r}`,t.for&&pr(t.for)?`${s} ${d(n.hass,"ui.for_prefix","for")} \u2265${mr(t.for)}`:s}function ai(t,n,e="any lux"){return t!=null&&n!=null?`${t}\u2013${n} lx`:n!=null?`<${n} lx`:t!=null?`\u2265${t} lx`:e}function Ja(t,n={}){if(t==null||!t.sensors?.length)return d(n.hass,"ui.summary_any","any");let e=t.sensors.map(s=>O(n.hass,s)),r=t.range!=null?Je(n.hass,t.range,n.luxRanges?.custom??{}):ai(t.min,t.max);return e.length===1?`${e[0]} ${r}`:`${t.quant==="all"?d(n.hass,"lux_summary.all_of","all of"):d(n.hass,"lux_summary.any_of","any of")} (${e.join(", ")}) ${r}`}function oi(t,n={}){return t==null?d(n.hass,"ui.summary_any","any"):ni(t,n)}function jn(t,n,e){let r=J(n.hass,t.kind),i=Un(n,t.entity_id),s=n.hass?.states?.[t.entity_id],o=t.kind!=="is"&&t.kind!=="is_not"?t.states[0]??"":t.states.map(f=>Qt(n.hass,s,t.attribute,f)).join("/"),c=t.attribute?`${i}.${Gt(n.hass,s,t.attribute)}`:i,h=e?`${J(n.hass,"not")} `:"",p=`${c} ${r} ${h}${o}`;return t.for&&pr(t.for)?`${p} ${d(n.hass,"ui.for_prefix","for")} \u2265${mr(t.for)}`:p}function ni(t,n){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<=")return jn(t,n,!1);if(t.kind==="and"||t.kind==="or"){let e=` ${J(n.hass,t.kind)} `;return t.items.map(r=>zn(r,n)).join(e)}if(t.kind==="not"){let e=t.item;return e.kind==="is"?jn(e,n,!0):`${J(n.hass,"not")} ${zn(e,n)}`}return""}function zn(t,n){return t.kind==="and"||t.kind==="or"?`(${ni(t,n)})`:ni(t,n)}function pr(t){return t.h>0||t.m>0||t.s>0}function mr(t){let n=[];return t.h&&n.push(`${t.h}h`),t.m&&n.push(`${t.m}m`),t.s&&n.push(`${t.s}s`),n.length?n.join(" "):"0s"}function _r(t,n){if(t===null)return d(n.hass,"ui.summary_any","any");let e=Array.isArray(t)?t:[t],r=n.periods?.custom??{};return e.map(i=>"period"in i?ye(n.hass,i.period,r):`${Wn(i.from,n)} \u2192 ${Wn(i.to,n)}`).join(", ")}function Wn(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=ve(n.hass,t.anchor),r=e;if(t.offset_min!==0){let i=Math.abs(t.offset_min),s=i%60===0?`${i/60}${d(n.hass,"ui.unit_hour_abbr","h")}`:`${i}${d(n.hass,"ui.unit_min_abbr","m")}`;r=`${e}${t.offset_min<0?"-":"+"}${s}`}if(t.clamp){let i=t.clamp.dir==="not_before"?d(n.hass,"ui.clamp_not_before","not before"):d(n.hass,"ui.clamp_not_after","not after"),s=`${String(t.clamp.hh).padStart(2,"0")}:${String(t.clamp.mm).padStart(2,"0")}`;r=`${r} (${i} ${s})`}return r}function Xa(t,n){let e=n.exposedActions?.find(r=>r.id===t.service);return e?.label?.trim()?e.label:Jt(n.hass,t.service)}function Za(t,n){let e=new Set;for(let r of t.entity_ids){let i=r.indexOf(".");i>0&&e.add(r.slice(0,i))}return e.size===1?[...e][0]:d(n.hass,"ui.target_noun","target")}function qn(t,n){let e=Xa(t,n),r=Za(t,n),i=t.entity_ids.length,s;i===0?s=d(n.hass,"ui.no_targets","(no targets)"):i===1?s=`1 ${r}`:s=`${i} ${r}s`;let a=Object.entries(t.params).filter(([,o])=>o!=null&&o!=="").map(([o,c])=>`${Ct(o,t.service,n.schemas)}: ${we(n.hass,c)}`).join(", ");return a?`${e}: ${s}, ${a}`:`${e}: ${s}`}var F=class extends b{constructor(){super(...arguments);this.scenes=[];this.availableActions=[];this.schemas={};this.categories=[];this.filterCategory="";this._drag=new it(this,(e,r)=>this._emit("reorder-scenes",{from:e,to:r}));this._expanded=new Set}_renderSectionHeader(e){return l`<div
      class="category-section-header"
      style=${nr(e.color)}
    >
      ${e.icon?l`<ha-icon icon=${e.icon}></ha-icon>`:""}
      <span>${e.name}</span>
      <ambience-kebab-menu
        class="category-kebab"
        .hass=${this.hass}
        .items=${[{id:"run",label:d(this.hass,"ui.run","Run"),icon:"mdi:play"},{id:"traces",label:d(this.hass,"ui.view_traces","View traces"),icon:"mdi:transit-connection-variant"},{id:"simulate",label:d(this.hass,"ui.simulate","Simulate"),icon:"mdi:flask-outline"}]}
        @menu-action=${r=>this._onCategoryMenu(e,r.detail.id)}
      ></ambience-kebab-menu>
    </div>`}_sections(){let e=this.scenes.map((i,s)=>[s,i]);if(this.filterCategory!=="")return[{category:this.categories.find(i=>i.id===this.filterCategory),rows:e.filter(([,i])=>i.category===this.filterCategory)}];let r=new Map;for(let[i,s]of e){let a=r.get(s.category)??[];a.push([i,s]),r.set(s.category,a)}return[...r.entries()].map(([i,s])=>({category:this.categories.find(a=>a.id===i),rows:s})).sort((i,s)=>(i.category?.name??"").localeCompare(s.category?.name??""))}_emit(e,r){this.dispatchEvent(new CustomEvent(e,{detail:r,bubbles:!0,composed:!0}))}_priorityMap(){let e=this.conditions;return(!this._priorityOfCache||this._priorityOfCache.src!==e)&&(this._priorityOfCache={src:e,map:new Map((e??[]).map(r=>[r.name,r.priority]))}),this._priorityOfCache.map}_whenKeys(e){let r=this._priorityMap();return Object.keys(e.when).filter(i=>e.when[i]!=null).sort((i,s)=>(r.get(s)??-1/0)-(r.get(i)??-1/0))}_whenSummary(e){let r=this._whenKeys(e);return r.length===0?d(this.hass,"ui.summary_any","any"):r.map((i,s)=>{let a=Y(this.hass,i),o=Tt(i,e.when[i],{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups});return l`${s===0?"":", "}<strong>${a}:</strong> ${o}`})}_whenStacked(e){let r=this._whenKeys(e);return r.length===0?l`<div class="condition-line">
        ${d(this.hass,"ui.summary_any","any")}
      </div>`:r.map(i=>{let s=Y(this.hass,i),a=Tt(i,e.when[i],{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups});return l`<div class="condition-line">
        <strong>${s}:</strong> ${a}
      </div>`})}_actionCountLabel(e){let r=e.actions.length,i=r===1?d(this.hass,"ui.action_singular","action"):d(this.hass,"ui.action_plural","actions"),s=`${r} ${i}`;return r===0?`${d(this.hass,"ui.noop_prefix","NOOP")} - ${s}`:s}_toggleScene(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):r.add(e),this._expanded=r}_entityName(e){return O(this.hass,e)}_actionParamsString(e){return Object.entries(e.params).filter(([,r])=>r!=null&&r!=="").map(([r,i])=>`${Ct(r,e.service,this.schemas)}: ${we(this.hass,i)}`).join(", ")}_actionLabel(e){let r=this.availableActions.find(i=>i.id===e.service);return r?.label?.trim()?r.label:Jt(this.hass,e.service)}_onCategoryMenu(e,r){r==="run"?this._emit("apply-category",{categoryId:e.id}):r==="traces"?this._emit("show-traces",{category:e.id}):r==="simulate"&&this._emit("show-simulator",{category:e.id})}_onSceneMenu(e,r){r==="edit"?this._emit("edit-scene",{index:e}):r==="duplicate"?this._emit("duplicate-scene",{index:e}):r==="run"?this._emit("run-scene-actions",{index:e}):r==="delete"&&this._emit("delete-scene",{index:e})}_renderRow(e,r,i){let s=d(this.hass,"ui.unpin","Unpin (return to automatic order)"),a=r.enabled===!1,o=a?d(this.hass,"ui.enable_scene","Enable scene"):d(this.hass,"ui.disable_scene","Disable scene");return l`
      <li
        data-drag-index=${e}
        class="${this._drag.over===e?"drag-over ":""}${this._drag.from===e?"dragging ":""}${a?"disabled":""}"
      >
        <span class="lead">
          ${r.pinned?l`<button
                class="pin"
                title=${s}
                aria-label=${s}
                @pointerdown=${c=>this._drag.start(e,c)}
                @click=${c=>{if(c.stopPropagation(),this._drag.moved){this._drag.moved=!1;return}this._emit("unpin-scene",{index:e})}}
              >
                📌
              </button>`:l`<span
                class="handle"
                title=${d(this.hass,"ui.drag_to_reorder","Drag to reorder")}
                @pointerdown=${c=>this._drag.start(e,c)}
                >⠿</span
              >`}
        </span>
        <span class="idx">${i}</span>
        <span class="warn-slot">
          ${r.shadowed_by!=null&&!a?l`<span
                class="shadow-warning"
                title=${d(this.hass,"ui.shadowed","Never fires \u2014 shadowed by an earlier scene.")}
                >⚠️</span
              >`:""}
        </span>
        <div class="body" @click=${()=>this._toggleScene(e)}>
          <div class="name">
            ${fr(r,d(this.hass,"ui.scene_n","Scene {n}").replace("{n}",String(i)))}
          </div>
          <div class="summary">
            ${this._expanded.has(e)?"":l`${this._whenSummary(r)} ·
                  <span class="action-count"
                    >${this._actionCountLabel(r)}</span
                  >`}
          </div>
          ${this._expanded.has(e)?l`
                <div class="scene-detail">
                  ${this._whenStacked(r)}
                  ${r.actions.length===0?l`<div class="noop-detail">
                        ${this._actionCountLabel(r)}
                      </div>`:l`<div class="actions-detail">
                        ${r.actions.map(c=>{let h=this._actionParamsString(c),p=this._actionLabel(c),f=h?`${p} \xB7 ${h}`:p;return l`
                            <div class="actions-detail-item">
                              <div class="action-header">${f}</div>
                              ${c.entity_ids.length===0?l`<div class="no-targets">
                                    ${d(this.hass,"ui.no_targets","(no targets)")}
                                  </div>`:l`<ul class="entity-list">
                                    ${c.entity_ids.map(_=>l`<li>${this._entityName(_)}</li>`)}
                                  </ul>`}
                            </div>
                          `})}
                      </div>`}
                </div>
              `:""}
        </div>
        <button
          class="toggle"
          @click=${c=>{c.stopPropagation(),this._emit("toggle-scene-enabled",{index:e,enabled:a})}}
          title=${o}
          aria-label=${o}
        >
          <ha-icon
            icon=${a?"mdi:toggle-switch-off-outline":"mdi:toggle-switch"}
          ></ha-icon>
        </button>
        <ambience-kebab-menu
          class="row-kebab"
          .hass=${this.hass}
          .label=${d(this.hass,"ui.scene_actions","Scene actions")}
          .items=${[{id:"edit",label:d(this.hass,"ui.edit","Edit"),icon:"mdi:pencil"},{id:"duplicate",label:d(this.hass,"ui.duplicate","Duplicate"),icon:"mdi:content-duplicate"},{id:"run",label:d(this.hass,"ui.run_actions","Run actions"),icon:"mdi:play"},{id:"delete",label:d(this.hass,"ui.title_delete","Delete"),icon:"mdi:delete",danger:!0,dividerBefore:!0}]}
          @menu-action=${c=>this._onSceneMenu(e,c.detail.id)}
        ></ambience-kebab-menu>
      </li>
    `}render(){let e=this._sections().filter(i=>i.rows.length>0);if(e.length===0){let i=this.filterCategory?{category:this.filterCategory}:{};return l`
        <p class="empty">
          ${d(this.hass,"ui.no_scenes_yet","No scenes yet.")}
        </p>
        <button class="add" @click=${()=>this._emit("add-scene",i)}>
          ${d(this.hass,"ui.add_scene","+ Add scene")}
        </button>
      `}let r=this.categories.length>0;return l`
      ${e.map(i=>l`
          <div class="category-section">
            ${r&&i.category?this._renderSectionHeader(i.category):""}
            <ul>
              ${i.rows.map(([s,a],o)=>this._renderRow(s,a,o+1))}
            </ul>
            <button
              class="add"
              @click=${()=>this._emit("add-scene",{category:i.category?.id})}
            >
              ${d(this.hass,"ui.add_scene","+ Add scene")}
            </button>
          </div>
        `)}
    `}};F.styles=v`
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
      font-family: monospace;
      color: var(--secondary-text-color, #888);
      margin-right: 0.25rem;
      /* Wide enough for two digits — we don't expect >99 scenes. */
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
    .scene-detail {
      margin-top: 0.35rem;
      padding-left: 0.75rem;
      border-left: 2px solid var(--divider-color, #e0e0e0);
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
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
      /* The pin doubles as the grab handle (tap = unpin, drag = reorder), so it
         needs the same grab cursor and touch-pan suppression as .handle. */
      cursor: grab;
      touch-action: none;
    }
    .pin:active {
      cursor: grabbing;
    }
    .shadow-warning {
      color: var(--error-color, #db4437);
      cursor: help;
      line-height: 1;
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
  `,u([m({attribute:!1})],F.prototype,"scenes",2),u([m({attribute:!1})],F.prototype,"periods",2),u([m({attribute:!1})],F.prototype,"luxRanges",2),u([m({attribute:!1})],F.prototype,"weatherConfig",2),u([m({attribute:!1})],F.prototype,"hass",2),u([m({attribute:!1})],F.prototype,"conditions",2),u([m({attribute:!1})],F.prototype,"availableActions",2),u([m({attribute:!1})],F.prototype,"schemas",2),u([m({attribute:!1})],F.prototype,"categories",2),u([m({attribute:!1})],F.prototype,"filterCategory",2),u([g()],F.prototype,"_expanded",2),F=u([x("ambience-scenes-list")],F);function Vn(t,n){let e=t.trim();if(e==="")return null;let r=Number(e);return Number.isNaN(r)?null:r<=0?n?0:null:Math.max(10,Math.round(r))}function Kn(t){return Vn(t,!1)}function Yn(t){return Vn(t,!0)}function Gn(t,n){return"reapply_seconds"in t?t.reapply_seconds??0:n}function Qn(t){return t%60===0?`${t/60} min`:t<60?`${t} sec`:`${Math.floor(t/60)} min ${t%60} sec`}function L(t,n){t.dispatchEvent(new CustomEvent("value-changed",{detail:{value:n},bubbles:!0,composed:!0}))}var re=class extends b{constructor(){super(...arguments);this.entities=[];this.value=[];this.target=null;this.label=" "}_filteredEntities(){return Hn(this.entities,this.target)}connectedCallback(){super.connectedCallback(),_e(this,this.hass)}_emit(e){L(this,e)}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let r=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this._filteredEntities()}}}],i=this.label;return l`
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
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};re.styles=v`
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
  `,u([m({attribute:!1})],re.prototype,"hass",2),u([m({attribute:!1})],re.prototype,"entities",2),u([m({attribute:!1})],re.prototype,"value",2),u([m({attribute:!1})],re.prototype,"target",2),u([m()],re.prototype,"label",2),re=u([x("ambience-target-picker")],re);var I=class extends b{constructor(){super(...arguments);this.entityIds=[];this.params={};this.excludeEntities=[];this._schema=void 0;this._schemaError=null;this._exposedMissing=!1;this._formSchema=[];this._perFieldSchemas={};this._schemaServiceId=null;this._onTargetChanged=e=>{e.stopPropagation(),this._emit("entity-ids-changed",{entityIds:e.detail.value})};this._onFieldInput=e=>r=>{r.stopPropagation();let i=r.target,s={...this.params,[e]:i.value};this._emit("params-changed",{params:s})};this._onHaFormChanged=e=>{e.stopPropagation(),this._emit("params-changed",{params:{...this.params,...e.detail.value}})}}connectedCallback(){super.connectedCallback(),_e(this,this.hass)}willUpdate(e){if((e.has("exposed")&&e.get("exposed")?.id!==this.exposed?.id||e.has("hass")&&this._schema===void 0)&&this._loadSchema(),(e.has("exposed")||e.has("_schema"))&&(this._formSchema=this._buildFormSchema()),e.has("_formSchema")||e.has("_schema")||e.has("exposed")){let r={};for(let i of this._formSchema)r[i.name]=[i];this._perFieldSchemas=r}}async _loadSchema(){if(this.exposed===void 0&&this.hass){this._exposedMissing=!0,this._schema=null,this._schemaServiceId=null;return}let e=this.exposed?.id;if(!e||!this.hass){this._exposedMissing=!1,this._schema=void 0,this._schemaServiceId=null;return}this._exposedMissing=!1,this._schemaServiceId=e,this._schemaError=null,this._schema=void 0;try{let r=await be(this.hass,e);if(this._schemaServiceId!==e)return;this._schema=r}catch(r){if(this._schemaServiceId!==e)return;this._schema=null,this._schemaError=r instanceof Error?r.message:String(r)}}_buildFormSchema(){let e=this._schema,r=this.exposed;if(!e||!r)return[];let i=new Set(r.visible_fields??[]),s=[];for(let[a,o]of Object.entries(e.fields))i.has(a)&&s.push({name:a,selector:o.selector??{text:{}},required:!!o.required,description:typeof o.description=="string"&&o.description?o.description:void 0});return s}updated(e){super.updated?.(e),e.has("_schema")&&this.dispatchEvent(new CustomEvent("target-mode-changed",{detail:{hasTarget:this.hasTarget()},bubbles:!0,composed:!0}))}_hasTarget(){let e=this._schema?.target??null;return!e||typeof e!="object"?!1:Object.keys(e).length>0}hasTarget(){return this._schema===void 0?!1:this._hasTarget()}_scopeEntities(){return!this.scope||!this.hass?[]:cr(this.hass,this.scope,[])}_renderTargetPicker(){if(!this._hasTarget())return"";let e=new Set(this.excludeEntities),r=this._scopeEntities().filter(a=>!e.has(a)),i=this._schema?.target??null,s=d(this.hass,"ui.target","Target");return l`
      <div class="target-picker field-row">
        <div class="field-header">
          <span class="field-label">${s}</span>
        </div>
        <ambience-target-picker
          .hass=${this.hass}
          .entities=${r}
          .target=${i}
          .value=${this.entityIds}
          .label=${" "}
          @value-changed=${this._onTargetChanged}
        ></ambience-target-picker>
      </div>
    `}_humanizeFieldLabel(e){let r=this._schema?.fields[e];return r?.name?r.name:nt(e)}_clearField(e){if(!(e in this.params))return;let r={...this.params};delete r[e],this._emit("params-changed",{params:r})}_extraParamKeys(){let e=new Set;for(let r of this._formSchema)e.add(r.name);for(let r of Object.keys(this.exposed?.defaults??{}))e.add(r);return Object.keys(this.params).filter(r=>!e.has(r))}_clearExtraParams(){let e=new Set(this._extraParamKeys());if(e.size===0)return;let r={};for(let[i,s]of Object.entries(this.params))e.has(i)||(r[i]=s);this._emit("params-changed",{params:r})}_fieldData(e){return e in this.params?{[e]:this.params[e]}:{}}_defaultHintSuffix(e){let r=this.exposed?.defaults??{};if(!(e.name in r))return"";let i=gr(e.selector);return` (Default: ${we(this.hass,r[e.name])}${i?` ${i}`:""})`}_hasUserOverride(e){return e in this.params}_renderExtraParamsNotice(){let e=this._extraParamKeys();if(e.length===0)return"";let r=e.join(", ");return l`
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
      `;if(this._schema===void 0)return l`<div>${d(this.hass,"ui.loading","Loading\u2026")}</div>`;let e=this._renderTargetPicker(),r=this._renderFieldsForm();return e===""&&r===""?l`<div class="no-params">${d(this.hass,"ui.action_no_parameters","This action has no configurable fields.")}</div>`:l`${e}${r}`}};I.styles=v`
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
  `,u([m({attribute:!1})],I.prototype,"hass",2),u([m({attribute:!1})],I.prototype,"scope",2),u([m({attribute:!1})],I.prototype,"exposed",2),u([m({attribute:!1})],I.prototype,"entityIds",2),u([m({attribute:!1})],I.prototype,"params",2),u([m({attribute:!1})],I.prototype,"excludeEntities",2),u([g()],I.prototype,"_schema",2),u([g()],I.prototype,"_schemaError",2),u([g()],I.prototype,"_exposedMissing",2),u([g()],I.prototype,"_formSchema",2),u([g()],I.prototype,"_perFieldSchemas",2),I=u([x("ambience-action-slot")],I);function hs(t){return typeof t>"u"||t===null}function eo(t){return typeof t=="object"&&t!==null}function to(t){return Array.isArray(t)?t:hs(t)?[]:[t]}function ro(t,n){var e,r,i,s;if(n)for(s=Object.keys(n),e=0,r=s.length;e<r;e+=1)i=s[e],t[i]=n[i];return t}function io(t,n){var e="",r;for(r=0;r<n;r+=1)e+=t;return e}function no(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var so=hs,ao=eo,oo=to,lo=io,co=no,uo=ro,H={isNothing:so,isObject:ao,toArray:oo,repeat:lo,isNegativeZero:co,extend:uo};function ps(t,n){var e="",r=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(e+='in "'+t.mark.name+'" '),e+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!n&&t.mark.snippet&&(e+=`

`+t.mark.snippet),r+" "+e):r}function Rt(t,n){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=n,this.message=ps(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}Rt.prototype=Object.create(Error.prototype);Rt.prototype.constructor=Rt;Rt.prototype.toString=function(n){return this.name+": "+ps(this,n)};var q=Rt;function li(t,n,e,r,i){var s="",a="",o=Math.floor(i/2)-1;return r-n>o&&(s=" ... ",n=r-o+s.length),e-r>o&&(a=" ...",e=r+o-a.length),{str:s+t.slice(n,e).replace(/\t/g,"\u2192")+a,pos:r-n+s.length}}function di(t,n){return H.repeat(" ",n-t.length)+t}function ho(t,n){if(n=Object.create(n||null),!t.buffer)return null;n.maxLength||(n.maxLength=79),typeof n.indent!="number"&&(n.indent=1),typeof n.linesBefore!="number"&&(n.linesBefore=3),typeof n.linesAfter!="number"&&(n.linesAfter=2);for(var e=/\r?\n|\r|\0/g,r=[0],i=[],s,a=-1;s=e.exec(t.buffer);)i.push(s.index),r.push(s.index+s[0].length),t.position<=s.index&&a<0&&(a=r.length-2);a<0&&(a=r.length-1);var o="",c,h,p=Math.min(t.line+n.linesAfter,i.length).toString().length,f=n.maxLength-(n.indent+p+3);for(c=1;c<=n.linesBefore&&!(a-c<0);c++)h=li(t.buffer,r[a-c],i[a-c],t.position-(r[a]-r[a-c]),f),o=H.repeat(" ",n.indent)+di((t.line-c+1).toString(),p)+" | "+h.str+`
`+o;for(h=li(t.buffer,r[a],i[a],t.position,f),o+=H.repeat(" ",n.indent)+di((t.line+1).toString(),p)+" | "+h.str+`
`,o+=H.repeat("-",n.indent+p+3+h.pos)+`^
`,c=1;c<=n.linesAfter&&!(a+c>=i.length);c++)h=li(t.buffer,r[a+c],i[a+c],t.position-(r[a]-r[a+c]),f),o+=H.repeat(" ",n.indent)+di((t.line+c+1).toString(),p)+" | "+h.str+`
`;return o.replace(/\n$/,"")}var po=ho,mo=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],fo=["scalar","sequence","mapping"];function go(t){var n={};return t!==null&&Object.keys(t).forEach(function(e){t[e].forEach(function(r){n[String(r)]=e})}),n}function _o(t,n){if(n=n||{},Object.keys(n).forEach(function(e){if(mo.indexOf(e)===-1)throw new q('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.options=n,this.tag=t,this.kind=n.kind||null,this.resolve=n.resolve||function(){return!0},this.construct=n.construct||function(e){return e},this.instanceOf=n.instanceOf||null,this.predicate=n.predicate||null,this.represent=n.represent||null,this.representName=n.representName||null,this.defaultStyle=n.defaultStyle||null,this.multi=n.multi||!1,this.styleAliases=go(n.styleAliases||null),fo.indexOf(this.kind)===-1)throw new q('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var M=_o;function Jn(t,n){var e=[];return t[n].forEach(function(r){var i=e.length;e.forEach(function(s,a){s.tag===r.tag&&s.kind===r.kind&&s.multi===r.multi&&(i=a)}),e[i]=r}),e}function vo(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},n,e;function r(i){i.multi?(t.multi[i.kind].push(i),t.multi.fallback.push(i)):t[i.kind][i.tag]=t.fallback[i.tag]=i}for(n=0,e=arguments.length;n<e;n+=1)arguments[n].forEach(r);return t}function ui(t){return this.extend(t)}ui.prototype.extend=function(n){var e=[],r=[];if(n instanceof M)r.push(n);else if(Array.isArray(n))r=r.concat(n);else if(n&&(Array.isArray(n.implicit)||Array.isArray(n.explicit)))n.implicit&&(e=e.concat(n.implicit)),n.explicit&&(r=r.concat(n.explicit));else throw new q("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.forEach(function(s){if(!(s instanceof M))throw new q("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new q("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new q("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),r.forEach(function(s){if(!(s instanceof M))throw new q("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var i=Object.create(ui.prototype);return i.implicit=(this.implicit||[]).concat(e),i.explicit=(this.explicit||[]).concat(r),i.compiledImplicit=Jn(i,"implicit"),i.compiledExplicit=Jn(i,"explicit"),i.compiledTypeMap=vo(i.compiledImplicit,i.compiledExplicit),i};var yo=ui,bo=new M("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),xo=new M("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),wo=new M("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),$o=new yo({explicit:[bo,xo,wo]});function ko(t){if(t===null)return!0;var n=t.length;return n===1&&t==="~"||n===4&&(t==="null"||t==="Null"||t==="NULL")}function Eo(){return null}function So(t){return t===null}var Co=new M("tag:yaml.org,2002:null",{kind:"scalar",resolve:ko,construct:Eo,predicate:So,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function To(t){if(t===null)return!1;var n=t.length;return n===4&&(t==="true"||t==="True"||t==="TRUE")||n===5&&(t==="false"||t==="False"||t==="FALSE")}function Lo(t){return t==="true"||t==="True"||t==="TRUE"}function Ro(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var Po=new M("tag:yaml.org,2002:bool",{kind:"scalar",resolve:To,construct:Lo,predicate:Ro,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function Do(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function Ao(t){return 48<=t&&t<=55}function Ho(t){return 48<=t&&t<=57}function No(t){if(t===null)return!1;var n=t.length,e=0,r=!1,i;if(!n)return!1;if(i=t[e],(i==="-"||i==="+")&&(i=t[++e]),i==="0"){if(e+1===n)return!0;if(i=t[++e],i==="b"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(i!=="0"&&i!=="1")return!1;r=!0}return r&&i!=="_"}if(i==="x"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(!Do(t.charCodeAt(e)))return!1;r=!0}return r&&i!=="_"}if(i==="o"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(!Ao(t.charCodeAt(e)))return!1;r=!0}return r&&i!=="_"}}if(i==="_")return!1;for(;e<n;e++)if(i=t[e],i!=="_"){if(!Ho(t.charCodeAt(e)))return!1;r=!0}return!(!r||i==="_")}function Oo(t){var n=t,e=1,r;if(n.indexOf("_")!==-1&&(n=n.replace(/_/g,"")),r=n[0],(r==="-"||r==="+")&&(r==="-"&&(e=-1),n=n.slice(1),r=n[0]),n==="0")return 0;if(r==="0"){if(n[1]==="b")return e*parseInt(n.slice(2),2);if(n[1]==="x")return e*parseInt(n.slice(2),16);if(n[1]==="o")return e*parseInt(n.slice(2),8)}return e*parseInt(n,10)}function Fo(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!H.isNegativeZero(t)}var Io=new M("tag:yaml.org,2002:int",{kind:"scalar",resolve:No,construct:Oo,predicate:Fo,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Mo=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function jo(t){return!(t===null||!Mo.test(t)||t[t.length-1]==="_")}function zo(t){var n,e;return n=t.replace(/_/g,"").toLowerCase(),e=n[0]==="-"?-1:1,"+-".indexOf(n[0])>=0&&(n=n.slice(1)),n===".inf"?e===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:n===".nan"?NaN:e*parseFloat(n,10)}var Wo=/^[-+]?[0-9]+e/;function Uo(t,n){var e;if(isNaN(t))switch(n){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(n){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(n){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(H.isNegativeZero(t))return"-0.0";return e=t.toString(10),Wo.test(e)?e.replace("e",".e"):e}function Bo(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||H.isNegativeZero(t))}var qo=new M("tag:yaml.org,2002:float",{kind:"scalar",resolve:jo,construct:zo,predicate:Bo,represent:Uo,defaultStyle:"lowercase"}),Vo=$o.extend({implicit:[Co,Po,Io,qo]}),Ko=Vo,ms=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),fs=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Yo(t){return t===null?!1:ms.exec(t)!==null||fs.exec(t)!==null}function Go(t){var n,e,r,i,s,a,o,c=0,h=null,p,f,_;if(n=ms.exec(t),n===null&&(n=fs.exec(t)),n===null)throw new Error("Date resolve error");if(e=+n[1],r=+n[2]-1,i=+n[3],!n[4])return new Date(Date.UTC(e,r,i));if(s=+n[4],a=+n[5],o=+n[6],n[7]){for(c=n[7].slice(0,3);c.length<3;)c+="0";c=+c}return n[9]&&(p=+n[10],f=+(n[11]||0),h=(p*60+f)*6e4,n[9]==="-"&&(h=-h)),_=new Date(Date.UTC(e,r,i,s,a,o,c)),h&&_.setTime(_.getTime()-h),_}function Qo(t){return t.toISOString()}var Jo=new M("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:Yo,construct:Go,instanceOf:Date,represent:Qo});function Xo(t){return t==="<<"||t===null}var Zo=new M("tag:yaml.org,2002:merge",{kind:"scalar",resolve:Xo}),gi=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function el(t){if(t===null)return!1;var n,e,r=0,i=t.length,s=gi;for(e=0;e<i;e++)if(n=s.indexOf(t.charAt(e)),!(n>64)){if(n<0)return!1;r+=6}return r%8===0}function tl(t){var n,e,r=t.replace(/[\r\n=]/g,""),i=r.length,s=gi,a=0,o=[];for(n=0;n<i;n++)n%4===0&&n&&(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)),a=a<<6|s.indexOf(r.charAt(n));return e=i%4*6,e===0?(o.push(a>>16&255),o.push(a>>8&255),o.push(a&255)):e===18?(o.push(a>>10&255),o.push(a>>2&255)):e===12&&o.push(a>>4&255),new Uint8Array(o)}function rl(t){var n="",e=0,r,i,s=t.length,a=gi;for(r=0;r<s;r++)r%3===0&&r&&(n+=a[e>>18&63],n+=a[e>>12&63],n+=a[e>>6&63],n+=a[e&63]),e=(e<<8)+t[r];return i=s%3,i===0?(n+=a[e>>18&63],n+=a[e>>12&63],n+=a[e>>6&63],n+=a[e&63]):i===2?(n+=a[e>>10&63],n+=a[e>>4&63],n+=a[e<<2&63],n+=a[64]):i===1&&(n+=a[e>>2&63],n+=a[e<<4&63],n+=a[64],n+=a[64]),n}function il(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var nl=new M("tag:yaml.org,2002:binary",{kind:"scalar",resolve:el,construct:tl,predicate:il,represent:rl}),sl=Object.prototype.hasOwnProperty,al=Object.prototype.toString;function ol(t){if(t===null)return!0;var n=[],e,r,i,s,a,o=t;for(e=0,r=o.length;e<r;e+=1){if(i=o[e],a=!1,al.call(i)!=="[object Object]")return!1;for(s in i)if(sl.call(i,s))if(!a)a=!0;else return!1;if(!a)return!1;if(n.indexOf(s)===-1)n.push(s);else return!1}return!0}function ll(t){return t!==null?t:[]}var dl=new M("tag:yaml.org,2002:omap",{kind:"sequence",resolve:ol,construct:ll}),cl=Object.prototype.toString;function ul(t){if(t===null)return!0;var n,e,r,i,s,a=t;for(s=new Array(a.length),n=0,e=a.length;n<e;n+=1){if(r=a[n],cl.call(r)!=="[object Object]"||(i=Object.keys(r),i.length!==1))return!1;s[n]=[i[0],r[i[0]]]}return!0}function hl(t){if(t===null)return[];var n,e,r,i,s,a=t;for(s=new Array(a.length),n=0,e=a.length;n<e;n+=1)r=a[n],i=Object.keys(r),s[n]=[i[0],r[i[0]]];return s}var pl=new M("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:ul,construct:hl}),ml=Object.prototype.hasOwnProperty;function fl(t){if(t===null)return!0;var n,e=t;for(n in e)if(ml.call(e,n)&&e[n]!==null)return!1;return!0}function gl(t){return t!==null?t:{}}var _l=new M("tag:yaml.org,2002:set",{kind:"mapping",resolve:fl,construct:gl}),gs=Ko.extend({implicit:[Jo,Zo],explicit:[nl,dl,pl,_l]}),ke=Object.prototype.hasOwnProperty,vr=1,_s=2,vs=3,yr=4,ci=1,vl=2,Xn=3,yl=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,bl=/[\x85\u2028\u2029]/,xl=/[,\[\]\{\}]/,ys=/^(?:!|!!|![a-z\-]+!)$/i,bs=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Zn(t){return Object.prototype.toString.call(t)}function ie(t){return t===10||t===13}function ze(t){return t===9||t===32}function V(t){return t===9||t===32||t===10||t===13}function at(t){return t===44||t===91||t===93||t===123||t===125}function wl(t){var n;return 48<=t&&t<=57?t-48:(n=t|32,97<=n&&n<=102?n-97+10:-1)}function $l(t){return t===120?2:t===117?4:t===85?8:0}function kl(t){return 48<=t&&t<=57?t-48:-1}function es(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"\x85":t===95?"\xA0":t===76?"\u2028":t===80?"\u2029":""}function El(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function xs(t,n,e){n==="__proto__"?Object.defineProperty(t,n,{configurable:!0,enumerable:!0,writable:!0,value:e}):t[n]=e}var ws=new Array(256),$s=new Array(256);for(je=0;je<256;je++)ws[je]=es(je)?1:0,$s[je]=es(je);var je;function Sl(t,n){this.input=t,this.filename=n.filename||null,this.schema=n.schema||gs,this.onWarning=n.onWarning||null,this.legacy=n.legacy||!1,this.json=n.json||!1,this.listener=n.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function ks(t,n){var e={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return e.snippet=po(e),new q(n,e)}function w(t,n){throw ks(t,n)}function br(t,n){t.onWarning&&t.onWarning.call(null,ks(t,n))}var ts={YAML:function(n,e,r){var i,s,a;n.version!==null&&w(n,"duplication of %YAML directive"),r.length!==1&&w(n,"YAML directive accepts exactly one argument"),i=/^([0-9]+)\.([0-9]+)$/.exec(r[0]),i===null&&w(n,"ill-formed argument of the YAML directive"),s=parseInt(i[1],10),a=parseInt(i[2],10),s!==1&&w(n,"unacceptable YAML version of the document"),n.version=r[0],n.checkLineBreaks=a<2,a!==1&&a!==2&&br(n,"unsupported YAML version of the document")},TAG:function(n,e,r){var i,s;r.length!==2&&w(n,"TAG directive accepts exactly two arguments"),i=r[0],s=r[1],ys.test(i)||w(n,"ill-formed tag handle (first argument) of the TAG directive"),ke.call(n.tagMap,i)&&w(n,'there is a previously declared suffix for "'+i+'" tag handle'),bs.test(s)||w(n,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{w(n,"tag prefix is malformed: "+s)}n.tagMap[i]=s}};function $e(t,n,e,r){var i,s,a,o;if(n<e){if(o=t.input.slice(n,e),r)for(i=0,s=o.length;i<s;i+=1)a=o.charCodeAt(i),a===9||32<=a&&a<=1114111||w(t,"expected valid JSON character");else yl.test(o)&&w(t,"the stream contains non-printable characters");t.result+=o}}function rs(t,n,e,r){var i,s,a,o;for(H.isObject(e)||w(t,"cannot merge mappings; the provided source object is unacceptable"),i=Object.keys(e),a=0,o=i.length;a<o;a+=1)s=i[a],ke.call(n,s)||(xs(n,s,e[s]),r[s]=!0)}function ot(t,n,e,r,i,s,a,o,c){var h,p;if(Array.isArray(i))for(i=Array.prototype.slice.call(i),h=0,p=i.length;h<p;h+=1)Array.isArray(i[h])&&w(t,"nested arrays are not supported inside keys"),typeof i=="object"&&Zn(i[h])==="[object Object]"&&(i[h]="[object Object]");if(typeof i=="object"&&Zn(i)==="[object Object]"&&(i="[object Object]"),i=String(i),n===null&&(n={}),r==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(h=0,p=s.length;h<p;h+=1)rs(t,n,s[h],e);else rs(t,n,s,e);else!t.json&&!ke.call(e,i)&&ke.call(n,i)&&(t.line=a||t.line,t.lineStart=o||t.lineStart,t.position=c||t.position,w(t,"duplicated mapping key")),xs(n,i,s),delete e[i];return n}function _i(t){var n;n=t.input.charCodeAt(t.position),n===10?t.position++:n===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):w(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function D(t,n,e){for(var r=0,i=t.input.charCodeAt(t.position);i!==0;){for(;ze(i);)i===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),i=t.input.charCodeAt(++t.position);if(n&&i===35)do i=t.input.charCodeAt(++t.position);while(i!==10&&i!==13&&i!==0);if(ie(i))for(_i(t),i=t.input.charCodeAt(t.position),r++,t.lineIndent=0;i===32;)t.lineIndent++,i=t.input.charCodeAt(++t.position);else break}return e!==-1&&r!==0&&t.lineIndent<e&&br(t,"deficient indentation"),r}function $r(t){var n=t.position,e;return e=t.input.charCodeAt(n),!!((e===45||e===46)&&e===t.input.charCodeAt(n+1)&&e===t.input.charCodeAt(n+2)&&(n+=3,e=t.input.charCodeAt(n),e===0||V(e)))}function vi(t,n){n===1?t.result+=" ":n>1&&(t.result+=H.repeat(`
`,n-1))}function Cl(t,n,e){var r,i,s,a,o,c,h,p,f=t.kind,_=t.result,y;if(y=t.input.charCodeAt(t.position),V(y)||at(y)||y===35||y===38||y===42||y===33||y===124||y===62||y===39||y===34||y===37||y===64||y===96||(y===63||y===45)&&(i=t.input.charCodeAt(t.position+1),V(i)||e&&at(i)))return!1;for(t.kind="scalar",t.result="",s=a=t.position,o=!1;y!==0;){if(y===58){if(i=t.input.charCodeAt(t.position+1),V(i)||e&&at(i))break}else if(y===35){if(r=t.input.charCodeAt(t.position-1),V(r))break}else{if(t.position===t.lineStart&&$r(t)||e&&at(y))break;if(ie(y))if(c=t.line,h=t.lineStart,p=t.lineIndent,D(t,!1,-1),t.lineIndent>=n){o=!0,y=t.input.charCodeAt(t.position);continue}else{t.position=a,t.line=c,t.lineStart=h,t.lineIndent=p;break}}o&&($e(t,s,a,!1),vi(t,t.line-c),s=a=t.position,o=!1),ze(y)||(a=t.position+1),y=t.input.charCodeAt(++t.position)}return $e(t,s,a,!1),t.result?!0:(t.kind=f,t.result=_,!1)}function Tl(t,n){var e,r,i;if(e=t.input.charCodeAt(t.position),e!==39)return!1;for(t.kind="scalar",t.result="",t.position++,r=i=t.position;(e=t.input.charCodeAt(t.position))!==0;)if(e===39)if($e(t,r,t.position,!0),e=t.input.charCodeAt(++t.position),e===39)r=t.position,t.position++,i=t.position;else return!0;else ie(e)?($e(t,r,i,!0),vi(t,D(t,!1,n)),r=i=t.position):t.position===t.lineStart&&$r(t)?w(t,"unexpected end of the document within a single quoted scalar"):(t.position++,i=t.position);w(t,"unexpected end of the stream within a single quoted scalar")}function Ll(t,n){var e,r,i,s,a,o;if(o=t.input.charCodeAt(t.position),o!==34)return!1;for(t.kind="scalar",t.result="",t.position++,e=r=t.position;(o=t.input.charCodeAt(t.position))!==0;){if(o===34)return $e(t,e,t.position,!0),t.position++,!0;if(o===92){if($e(t,e,t.position,!0),o=t.input.charCodeAt(++t.position),ie(o))D(t,!1,n);else if(o<256&&ws[o])t.result+=$s[o],t.position++;else if((a=$l(o))>0){for(i=a,s=0;i>0;i--)o=t.input.charCodeAt(++t.position),(a=wl(o))>=0?s=(s<<4)+a:w(t,"expected hexadecimal character");t.result+=El(s),t.position++}else w(t,"unknown escape sequence");e=r=t.position}else ie(o)?($e(t,e,r,!0),vi(t,D(t,!1,n)),e=r=t.position):t.position===t.lineStart&&$r(t)?w(t,"unexpected end of the document within a double quoted scalar"):(t.position++,r=t.position)}w(t,"unexpected end of the stream within a double quoted scalar")}function Rl(t,n){var e=!0,r,i,s,a=t.tag,o,c=t.anchor,h,p,f,_,y,$=Object.create(null),E,R,U,C;if(C=t.input.charCodeAt(t.position),C===91)p=93,y=!1,o=[];else if(C===123)p=125,y=!0,o={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=o),C=t.input.charCodeAt(++t.position);C!==0;){if(D(t,!0,n),C=t.input.charCodeAt(t.position),C===p)return t.position++,t.tag=a,t.anchor=c,t.kind=y?"mapping":"sequence",t.result=o,!0;e?C===44&&w(t,"expected the node content, but found ','"):w(t,"missed comma between flow collection entries"),R=E=U=null,f=_=!1,C===63&&(h=t.input.charCodeAt(t.position+1),V(h)&&(f=_=!0,t.position++,D(t,!0,n))),r=t.line,i=t.lineStart,s=t.position,lt(t,n,vr,!1,!0),R=t.tag,E=t.result,D(t,!0,n),C=t.input.charCodeAt(t.position),(_||t.line===r)&&C===58&&(f=!0,C=t.input.charCodeAt(++t.position),D(t,!0,n),lt(t,n,vr,!1,!0),U=t.result),y?ot(t,o,$,R,E,U,r,i,s):f?o.push(ot(t,null,$,R,E,U,r,i,s)):o.push(E),D(t,!0,n),C=t.input.charCodeAt(t.position),C===44?(e=!0,C=t.input.charCodeAt(++t.position)):e=!1}w(t,"unexpected end of the stream within a flow collection")}function Pl(t,n){var e,r,i=ci,s=!1,a=!1,o=n,c=0,h=!1,p,f;if(f=t.input.charCodeAt(t.position),f===124)r=!1;else if(f===62)r=!0;else return!1;for(t.kind="scalar",t.result="";f!==0;)if(f=t.input.charCodeAt(++t.position),f===43||f===45)ci===i?i=f===43?Xn:vl:w(t,"repeat of a chomping mode identifier");else if((p=kl(f))>=0)p===0?w(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):a?w(t,"repeat of an indentation width identifier"):(o=n+p-1,a=!0);else break;if(ze(f)){do f=t.input.charCodeAt(++t.position);while(ze(f));if(f===35)do f=t.input.charCodeAt(++t.position);while(!ie(f)&&f!==0)}for(;f!==0;){for(_i(t),t.lineIndent=0,f=t.input.charCodeAt(t.position);(!a||t.lineIndent<o)&&f===32;)t.lineIndent++,f=t.input.charCodeAt(++t.position);if(!a&&t.lineIndent>o&&(o=t.lineIndent),ie(f)){c++;continue}if(t.lineIndent<o){i===Xn?t.result+=H.repeat(`
`,s?1+c:c):i===ci&&s&&(t.result+=`
`);break}for(r?ze(f)?(h=!0,t.result+=H.repeat(`
`,s?1+c:c)):h?(h=!1,t.result+=H.repeat(`
`,c+1)):c===0?s&&(t.result+=" "):t.result+=H.repeat(`
`,c):t.result+=H.repeat(`
`,s?1+c:c),s=!0,a=!0,c=0,e=t.position;!ie(f)&&f!==0;)f=t.input.charCodeAt(++t.position);$e(t,e,t.position,!1)}return!0}function is(t,n){var e,r=t.tag,i=t.anchor,s=[],a,o=!1,c;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=s),c=t.input.charCodeAt(t.position);c!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,w(t,"tab characters must not be used in indentation")),!(c!==45||(a=t.input.charCodeAt(t.position+1),!V(a))));){if(o=!0,t.position++,D(t,!0,-1)&&t.lineIndent<=n){s.push(null),c=t.input.charCodeAt(t.position);continue}if(e=t.line,lt(t,n,vs,!1,!0),s.push(t.result),D(t,!0,-1),c=t.input.charCodeAt(t.position),(t.line===e||t.lineIndent>n)&&c!==0)w(t,"bad indentation of a sequence entry");else if(t.lineIndent<n)break}return o?(t.tag=r,t.anchor=i,t.kind="sequence",t.result=s,!0):!1}function Dl(t,n,e){var r,i,s,a,o,c,h=t.tag,p=t.anchor,f={},_=Object.create(null),y=null,$=null,E=null,R=!1,U=!1,C;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=f),C=t.input.charCodeAt(t.position);C!==0;){if(!R&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,w(t,"tab characters must not be used in indentation")),r=t.input.charCodeAt(t.position+1),s=t.line,(C===63||C===58)&&V(r))C===63?(R&&(ot(t,f,_,y,$,null,a,o,c),y=$=E=null),U=!0,R=!0,i=!0):R?(R=!1,i=!0):w(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,C=r;else{if(a=t.line,o=t.lineStart,c=t.position,!lt(t,e,_s,!1,!0))break;if(t.line===s){for(C=t.input.charCodeAt(t.position);ze(C);)C=t.input.charCodeAt(++t.position);if(C===58)C=t.input.charCodeAt(++t.position),V(C)||w(t,"a whitespace character is expected after the key-value separator within a block mapping"),R&&(ot(t,f,_,y,$,null,a,o,c),y=$=E=null),U=!0,R=!1,i=!1,y=t.tag,$=t.result;else if(U)w(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=h,t.anchor=p,!0}else if(U)w(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=h,t.anchor=p,!0}if((t.line===s||t.lineIndent>n)&&(R&&(a=t.line,o=t.lineStart,c=t.position),lt(t,n,yr,!0,i)&&(R?$=t.result:E=t.result),R||(ot(t,f,_,y,$,E,a,o,c),y=$=E=null),D(t,!0,-1),C=t.input.charCodeAt(t.position)),(t.line===s||t.lineIndent>n)&&C!==0)w(t,"bad indentation of a mapping entry");else if(t.lineIndent<n)break}return R&&ot(t,f,_,y,$,null,a,o,c),U&&(t.tag=h,t.anchor=p,t.kind="mapping",t.result=f),U}function Al(t){var n,e=!1,r=!1,i,s,a;if(a=t.input.charCodeAt(t.position),a!==33)return!1;if(t.tag!==null&&w(t,"duplication of a tag property"),a=t.input.charCodeAt(++t.position),a===60?(e=!0,a=t.input.charCodeAt(++t.position)):a===33?(r=!0,i="!!",a=t.input.charCodeAt(++t.position)):i="!",n=t.position,e){do a=t.input.charCodeAt(++t.position);while(a!==0&&a!==62);t.position<t.length?(s=t.input.slice(n,t.position),a=t.input.charCodeAt(++t.position)):w(t,"unexpected end of the stream within a verbatim tag")}else{for(;a!==0&&!V(a);)a===33&&(r?w(t,"tag suffix cannot contain exclamation marks"):(i=t.input.slice(n-1,t.position+1),ys.test(i)||w(t,"named tag handle cannot contain such characters"),r=!0,n=t.position+1)),a=t.input.charCodeAt(++t.position);s=t.input.slice(n,t.position),xl.test(s)&&w(t,"tag suffix cannot contain flow indicator characters")}s&&!bs.test(s)&&w(t,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{w(t,"tag name is malformed: "+s)}return e?t.tag=s:ke.call(t.tagMap,i)?t.tag=t.tagMap[i]+s:i==="!"?t.tag="!"+s:i==="!!"?t.tag="tag:yaml.org,2002:"+s:w(t,'undeclared tag handle "'+i+'"'),!0}function Hl(t){var n,e;if(e=t.input.charCodeAt(t.position),e!==38)return!1;for(t.anchor!==null&&w(t,"duplication of an anchor property"),e=t.input.charCodeAt(++t.position),n=t.position;e!==0&&!V(e)&&!at(e);)e=t.input.charCodeAt(++t.position);return t.position===n&&w(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(n,t.position),!0}function Nl(t){var n,e,r;if(r=t.input.charCodeAt(t.position),r!==42)return!1;for(r=t.input.charCodeAt(++t.position),n=t.position;r!==0&&!V(r)&&!at(r);)r=t.input.charCodeAt(++t.position);return t.position===n&&w(t,"name of an alias node must contain at least one character"),e=t.input.slice(n,t.position),ke.call(t.anchorMap,e)||w(t,'unidentified alias "'+e+'"'),t.result=t.anchorMap[e],D(t,!0,-1),!0}function lt(t,n,e,r,i){var s,a,o,c=1,h=!1,p=!1,f,_,y,$,E,R;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,s=a=o=yr===e||vs===e,r&&D(t,!0,-1)&&(h=!0,t.lineIndent>n?c=1:t.lineIndent===n?c=0:t.lineIndent<n&&(c=-1)),c===1)for(;Al(t)||Hl(t);)D(t,!0,-1)?(h=!0,o=s,t.lineIndent>n?c=1:t.lineIndent===n?c=0:t.lineIndent<n&&(c=-1)):o=!1;if(o&&(o=h||i),(c===1||yr===e)&&(vr===e||_s===e?E=n:E=n+1,R=t.position-t.lineStart,c===1?o&&(is(t,R)||Dl(t,R,E))||Rl(t,E)?p=!0:(a&&Pl(t,E)||Tl(t,E)||Ll(t,E)?p=!0:Nl(t)?(p=!0,(t.tag!==null||t.anchor!==null)&&w(t,"alias node should not have any properties")):Cl(t,E,vr===e)&&(p=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):c===0&&(p=o&&is(t,R))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&w(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),f=0,_=t.implicitTypes.length;f<_;f+=1)if($=t.implicitTypes[f],$.resolve(t.result)){t.result=$.construct(t.result),t.tag=$.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(ke.call(t.typeMap[t.kind||"fallback"],t.tag))$=t.typeMap[t.kind||"fallback"][t.tag];else for($=null,y=t.typeMap.multi[t.kind||"fallback"],f=0,_=y.length;f<_;f+=1)if(t.tag.slice(0,y[f].tag.length)===y[f].tag){$=y[f];break}$||w(t,"unknown tag !<"+t.tag+">"),t.result!==null&&$.kind!==t.kind&&w(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+$.kind+'", not "'+t.kind+'"'),$.resolve(t.result,t.tag)?(t.result=$.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):w(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||p}function Ol(t){var n=t.position,e,r,i,s=!1,a;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(a=t.input.charCodeAt(t.position))!==0&&(D(t,!0,-1),a=t.input.charCodeAt(t.position),!(t.lineIndent>0||a!==37));){for(s=!0,a=t.input.charCodeAt(++t.position),e=t.position;a!==0&&!V(a);)a=t.input.charCodeAt(++t.position);for(r=t.input.slice(e,t.position),i=[],r.length<1&&w(t,"directive name must not be less than one character in length");a!==0;){for(;ze(a);)a=t.input.charCodeAt(++t.position);if(a===35){do a=t.input.charCodeAt(++t.position);while(a!==0&&!ie(a));break}if(ie(a))break;for(e=t.position;a!==0&&!V(a);)a=t.input.charCodeAt(++t.position);i.push(t.input.slice(e,t.position))}a!==0&&_i(t),ke.call(ts,r)?ts[r](t,r,i):br(t,'unknown document directive "'+r+'"')}if(D(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,D(t,!0,-1)):s&&w(t,"directives end mark is expected"),lt(t,t.lineIndent-1,yr,!1,!0),D(t,!0,-1),t.checkLineBreaks&&bl.test(t.input.slice(n,t.position))&&br(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&$r(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,D(t,!0,-1));return}if(t.position<t.length-1)w(t,"end of the stream or a document separator is expected");else return}function Es(t,n){t=String(t),n=n||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var e=new Sl(t,n),r=t.indexOf("\0");for(r!==-1&&(e.position=r,w(e,"null byte is not allowed in input")),e.input+="\0";e.input.charCodeAt(e.position)===32;)e.lineIndent+=1,e.position+=1;for(;e.position<e.length-1;)Ol(e);return e.documents}function Fl(t,n,e){n!==null&&typeof n=="object"&&typeof e>"u"&&(e=n,n=null);var r=Es(t,e);if(typeof n!="function")return r;for(var i=0,s=r.length;i<s;i+=1)n(r[i])}function Il(t,n){var e=Es(t,n);if(e.length!==0){if(e.length===1)return e[0];throw new q("expected a single document in the stream, but found more")}}var Ml=Fl,jl=Il,Ss={loadAll:Ml,load:jl},Cs=Object.prototype.toString,Ts=Object.prototype.hasOwnProperty,yi=65279,zl=9,Pt=10,Wl=13,Ul=32,Bl=33,ql=34,hi=35,Vl=37,Kl=38,Yl=39,Gl=42,Ls=44,Ql=45,xr=58,Jl=61,Xl=62,Zl=63,ed=64,Rs=91,Ps=93,td=96,Ds=123,rd=124,As=125,j={};j[0]="\\0";j[7]="\\a";j[8]="\\b";j[9]="\\t";j[10]="\\n";j[11]="\\v";j[12]="\\f";j[13]="\\r";j[27]="\\e";j[34]='\\"';j[92]="\\\\";j[133]="\\N";j[160]="\\_";j[8232]="\\L";j[8233]="\\P";var id=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],nd=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function sd(t,n){var e,r,i,s,a,o,c;if(n===null)return{};for(e={},r=Object.keys(n),i=0,s=r.length;i<s;i+=1)a=r[i],o=String(n[a]),a.slice(0,2)==="!!"&&(a="tag:yaml.org,2002:"+a.slice(2)),c=t.compiledTypeMap.fallback[a],c&&Ts.call(c.styleAliases,o)&&(o=c.styleAliases[o]),e[a]=o;return e}function ad(t){var n,e,r;if(n=t.toString(16).toUpperCase(),t<=255)e="x",r=2;else if(t<=65535)e="u",r=4;else if(t<=4294967295)e="U",r=8;else throw new q("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+e+H.repeat("0",r-n.length)+n}var od=1,Dt=2;function ld(t){this.schema=t.schema||gs,this.indent=Math.max(1,t.indent||2),this.noArrayIndent=t.noArrayIndent||!1,this.skipInvalid=t.skipInvalid||!1,this.flowLevel=H.isNothing(t.flowLevel)?-1:t.flowLevel,this.styleMap=sd(this.schema,t.styles||null),this.sortKeys=t.sortKeys||!1,this.lineWidth=t.lineWidth||80,this.noRefs=t.noRefs||!1,this.noCompatMode=t.noCompatMode||!1,this.condenseFlow=t.condenseFlow||!1,this.quotingType=t.quotingType==='"'?Dt:od,this.forceQuotes=t.forceQuotes||!1,this.replacer=typeof t.replacer=="function"?t.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function ns(t,n){for(var e=H.repeat(" ",n),r=0,i=-1,s="",a,o=t.length;r<o;)i=t.indexOf(`
`,r),i===-1?(a=t.slice(r),r=o):(a=t.slice(r,i+1),r=i+1),a.length&&a!==`
`&&(s+=e),s+=a;return s}function pi(t,n){return`
`+H.repeat(" ",t.indent*n)}function dd(t,n){var e,r,i;for(e=0,r=t.implicitTypes.length;e<r;e+=1)if(i=t.implicitTypes[e],i.resolve(n))return!0;return!1}function wr(t){return t===Ul||t===zl}function At(t){return 32<=t&&t<=126||161<=t&&t<=55295&&t!==8232&&t!==8233||57344<=t&&t<=65533&&t!==yi||65536<=t&&t<=1114111}function ss(t){return At(t)&&t!==yi&&t!==Wl&&t!==Pt}function as(t,n,e){var r=ss(t),i=r&&!wr(t);return(e?r:r&&t!==Ls&&t!==Rs&&t!==Ps&&t!==Ds&&t!==As)&&t!==hi&&!(n===xr&&!i)||ss(n)&&!wr(n)&&t===hi||n===xr&&i}function cd(t){return At(t)&&t!==yi&&!wr(t)&&t!==Ql&&t!==Zl&&t!==xr&&t!==Ls&&t!==Rs&&t!==Ps&&t!==Ds&&t!==As&&t!==hi&&t!==Kl&&t!==Gl&&t!==Bl&&t!==rd&&t!==Jl&&t!==Xl&&t!==Yl&&t!==ql&&t!==Vl&&t!==ed&&t!==td}function ud(t){return!wr(t)&&t!==xr}function Lt(t,n){var e=t.charCodeAt(n),r;return e>=55296&&e<=56319&&n+1<t.length&&(r=t.charCodeAt(n+1),r>=56320&&r<=57343)?(e-55296)*1024+r-56320+65536:e}function Hs(t){var n=/^\n* /;return n.test(t)}var Ns=1,mi=2,Os=3,Fs=4,st=5;function hd(t,n,e,r,i,s,a,o){var c,h=0,p=null,f=!1,_=!1,y=r!==-1,$=-1,E=cd(Lt(t,0))&&ud(Lt(t,t.length-1));if(n||a)for(c=0;c<t.length;h>=65536?c+=2:c++){if(h=Lt(t,c),!At(h))return st;E=E&&as(h,p,o),p=h}else{for(c=0;c<t.length;h>=65536?c+=2:c++){if(h=Lt(t,c),h===Pt)f=!0,y&&(_=_||c-$-1>r&&t[$+1]!==" ",$=c);else if(!At(h))return st;E=E&&as(h,p,o),p=h}_=_||y&&c-$-1>r&&t[$+1]!==" "}return!f&&!_?E&&!a&&!i(t)?Ns:s===Dt?st:mi:e>9&&Hs(t)?st:a?s===Dt?st:mi:_?Fs:Os}function pd(t,n,e,r,i){t.dump=(function(){if(n.length===0)return t.quotingType===Dt?'""':"''";if(!t.noCompatMode&&(id.indexOf(n)!==-1||nd.test(n)))return t.quotingType===Dt?'"'+n+'"':"'"+n+"'";var s=t.indent*Math.max(1,e),a=t.lineWidth===-1?-1:Math.max(Math.min(t.lineWidth,40),t.lineWidth-s),o=r||t.flowLevel>-1&&e>=t.flowLevel;function c(h){return dd(t,h)}switch(hd(n,o,t.indent,a,c,t.quotingType,t.forceQuotes&&!r,i)){case Ns:return n;case mi:return"'"+n.replace(/'/g,"''")+"'";case Os:return"|"+os(n,t.indent)+ls(ns(n,s));case Fs:return">"+os(n,t.indent)+ls(ns(md(n,a),s));case st:return'"'+fd(n)+'"';default:throw new q("impossible error: invalid scalar style")}})()}function os(t,n){var e=Hs(t)?String(n):"",r=t[t.length-1]===`
`,i=r&&(t[t.length-2]===`
`||t===`
`),s=i?"+":r?"":"-";return e+s+`
`}function ls(t){return t[t.length-1]===`
`?t.slice(0,-1):t}function md(t,n){for(var e=/(\n+)([^\n]*)/g,r=(function(){var h=t.indexOf(`
`);return h=h!==-1?h:t.length,e.lastIndex=h,ds(t.slice(0,h),n)})(),i=t[0]===`
`||t[0]===" ",s,a;a=e.exec(t);){var o=a[1],c=a[2];s=c[0]===" ",r+=o+(!i&&!s&&c!==""?`
`:"")+ds(c,n),i=s}return r}function ds(t,n){if(t===""||t[0]===" ")return t;for(var e=/ [^ ]/g,r,i=0,s,a=0,o=0,c="";r=e.exec(t);)o=r.index,o-i>n&&(s=a>i?a:o,c+=`
`+t.slice(i,s),i=s+1),a=o;return c+=`
`,t.length-i>n&&a>i?c+=t.slice(i,a)+`
`+t.slice(a+1):c+=t.slice(i),c.slice(1)}function fd(t){for(var n="",e=0,r,i=0;i<t.length;e>=65536?i+=2:i++)e=Lt(t,i),r=j[e],!r&&At(e)?(n+=t[i],e>=65536&&(n+=t[i+1])):n+=r||ad(e);return n}function gd(t,n,e){var r="",i=t.tag,s,a,o;for(s=0,a=e.length;s<a;s+=1)o=e[s],t.replacer&&(o=t.replacer.call(e,String(s),o)),(pe(t,n,o,!1,!1)||typeof o>"u"&&pe(t,n,null,!1,!1))&&(r!==""&&(r+=","+(t.condenseFlow?"":" ")),r+=t.dump);t.tag=i,t.dump="["+r+"]"}function cs(t,n,e,r){var i="",s=t.tag,a,o,c;for(a=0,o=e.length;a<o;a+=1)c=e[a],t.replacer&&(c=t.replacer.call(e,String(a),c)),(pe(t,n+1,c,!0,!0,!1,!0)||typeof c>"u"&&pe(t,n+1,null,!0,!0,!1,!0))&&((!r||i!=="")&&(i+=pi(t,n)),t.dump&&Pt===t.dump.charCodeAt(0)?i+="-":i+="- ",i+=t.dump);t.tag=s,t.dump=i||"[]"}function _d(t,n,e){var r="",i=t.tag,s=Object.keys(e),a,o,c,h,p;for(a=0,o=s.length;a<o;a+=1)p="",r!==""&&(p+=", "),t.condenseFlow&&(p+='"'),c=s[a],h=e[c],t.replacer&&(h=t.replacer.call(e,c,h)),pe(t,n,c,!1,!1)&&(t.dump.length>1024&&(p+="? "),p+=t.dump+(t.condenseFlow?'"':"")+":"+(t.condenseFlow?"":" "),pe(t,n,h,!1,!1)&&(p+=t.dump,r+=p));t.tag=i,t.dump="{"+r+"}"}function vd(t,n,e,r){var i="",s=t.tag,a=Object.keys(e),o,c,h,p,f,_;if(t.sortKeys===!0)a.sort();else if(typeof t.sortKeys=="function")a.sort(t.sortKeys);else if(t.sortKeys)throw new q("sortKeys must be a boolean or a function");for(o=0,c=a.length;o<c;o+=1)_="",(!r||i!=="")&&(_+=pi(t,n)),h=a[o],p=e[h],t.replacer&&(p=t.replacer.call(e,h,p)),pe(t,n+1,h,!0,!0,!0)&&(f=t.tag!==null&&t.tag!=="?"||t.dump&&t.dump.length>1024,f&&(t.dump&&Pt===t.dump.charCodeAt(0)?_+="?":_+="? "),_+=t.dump,f&&(_+=pi(t,n)),pe(t,n+1,p,!0,f)&&(t.dump&&Pt===t.dump.charCodeAt(0)?_+=":":_+=": ",_+=t.dump,i+=_));t.tag=s,t.dump=i||"{}"}function us(t,n,e){var r,i,s,a,o,c;for(i=e?t.explicitTypes:t.implicitTypes,s=0,a=i.length;s<a;s+=1)if(o=i[s],(o.instanceOf||o.predicate)&&(!o.instanceOf||typeof n=="object"&&n instanceof o.instanceOf)&&(!o.predicate||o.predicate(n))){if(e?o.multi&&o.representName?t.tag=o.representName(n):t.tag=o.tag:t.tag="?",o.represent){if(c=t.styleMap[o.tag]||o.defaultStyle,Cs.call(o.represent)==="[object Function]")r=o.represent(n,c);else if(Ts.call(o.represent,c))r=o.represent[c](n,c);else throw new q("!<"+o.tag+'> tag resolver accepts not "'+c+'" style');t.dump=r}return!0}return!1}function pe(t,n,e,r,i,s,a){t.tag=null,t.dump=e,us(t,e,!1)||us(t,e,!0);var o=Cs.call(t.dump),c=r,h;r&&(r=t.flowLevel<0||t.flowLevel>n);var p=o==="[object Object]"||o==="[object Array]",f,_;if(p&&(f=t.duplicates.indexOf(e),_=f!==-1),(t.tag!==null&&t.tag!=="?"||_||t.indent!==2&&n>0)&&(i=!1),_&&t.usedDuplicates[f])t.dump="*ref_"+f;else{if(p&&_&&!t.usedDuplicates[f]&&(t.usedDuplicates[f]=!0),o==="[object Object]")r&&Object.keys(t.dump).length!==0?(vd(t,n,t.dump,i),_&&(t.dump="&ref_"+f+t.dump)):(_d(t,n,t.dump),_&&(t.dump="&ref_"+f+" "+t.dump));else if(o==="[object Array]")r&&t.dump.length!==0?(t.noArrayIndent&&!a&&n>0?cs(t,n-1,t.dump,i):cs(t,n,t.dump,i),_&&(t.dump="&ref_"+f+t.dump)):(gd(t,n,t.dump),_&&(t.dump="&ref_"+f+" "+t.dump));else if(o==="[object String]")t.tag!=="?"&&pd(t,t.dump,n,s,c);else{if(o==="[object Undefined]")return!1;if(t.skipInvalid)return!1;throw new q("unacceptable kind of an object to dump "+o)}t.tag!==null&&t.tag!=="?"&&(h=encodeURI(t.tag[0]==="!"?t.tag.slice(1):t.tag).replace(/!/g,"%21"),t.tag[0]==="!"?h="!"+h:h.slice(0,18)==="tag:yaml.org,2002:"?h="!!"+h.slice(18):h="!<"+h+">",t.dump=h+" "+t.dump)}return!0}function yd(t,n){var e=[],r=[],i,s;for(fi(t,e,r),i=0,s=r.length;i<s;i+=1)n.duplicates.push(e[r[i]]);n.usedDuplicates=new Array(s)}function fi(t,n,e){var r,i,s;if(t!==null&&typeof t=="object")if(i=n.indexOf(t),i!==-1)e.indexOf(i)===-1&&e.push(i);else if(n.push(t),Array.isArray(t))for(i=0,s=t.length;i<s;i+=1)fi(t[i],n,e);else for(r=Object.keys(t),i=0,s=r.length;i<s;i+=1)fi(t[r[i]],n,e)}function bd(t,n){n=n||{};var e=new ld(n);e.noRefs||yd(t,e);var r=t;return e.replacer&&(r=e.replacer.call({"":r},"",r)),pe(e,0,r,!0,!0)?e.dump+`
`:""}var xd=bd,wd={dump:xd};function bi(t,n){return function(){throw new Error("Function yaml."+t+" is removed in js-yaml 4. Use yaml."+n+" instead, which is now safe by default.")}}var Is=Ss.load,yh=Ss.loadAll,kr=wd.dump;var bh=bi("safeLoad","load"),xh=bi("safeLoadAll","loadAll"),wh=bi("safeDump","dump");var ne=class extends b{constructor(){super(...arguments);this.value=null;this._mode="form";this._yamlText="";this._yamlError=null;this._computeFieldLabel=e=>si(this.hass,this._picked??"",e.name);this._computeFieldHelper=e=>{let i=this._currentFields()?.[e.name]?.description;return typeof i=="string"?i:""}}willUpdate(e){super.willUpdate?.(e),e.has("value")&&this._mode==="form"&&(this._yamlText=kr(this.value??{}))}connectedCallback(){super.connectedCallback(),this._yamlText=kr(this.value??{})}_setMode(e){e==="form"&&this._yamlError!==null||(e==="yaml"&&(this._yamlText=kr(this.value??{})),this._mode=e)}_onYamlInput(e){this._yamlText=e;let r;try{r=Is(e)}catch(c){this._yamlError=c.message;return}if(r==null){this._yamlError=null,this._emit(null);return}if(typeof r!="object"||Array.isArray(r)){this._yamlError="Expected an object";return}let i=r,s=i.script;if(typeof s!="string"||!s.startsWith("script.")){this._yamlError="`script` must be a 'script.<name>' string";return}let a=i.args;if(a!==void 0&&(typeof a!="object"||Array.isArray(a)||a===null)){this._yamlError="`args` must be an object if present";return}let o=i.triggers;if(o!==void 0&&(!Array.isArray(o)||!o.every(c=>typeof c=="string"))){this._yamlError="`triggers` must be a list of entity_id strings if present";return}this._yamlError=null,this._emit({script:s,args:a??{},triggers:o})}_emit(e){this.value=e,L(this,this.value)}_scriptIds(){let e=this.hass?.services;return Object.keys(e?.script??{}).sort().map(i=>`script.${i}`)}_label(e){return O(this.hass,e)}_fieldsFor(e){if(!e)return;let r=e.replace(/^script\./,"");return this.hass?.services?.script?.[r]?.fields}get _picked(){return this.value&&typeof this.value=="object"?this.value.script:null}_currentFields(){return this._fieldsFor(this._picked)}_defaultArgs(e){let r=this._fieldsFor(e)??{},i={};for(let[s,a]of Object.entries(r))a&&Object.hasOwn(a,"default")&&(i[s]=a.default);return i}_pickerSchema(){return[{name:"script",selector:{select:{mode:"dropdown",options:this._scriptIds().map(e=>({value:e,label:this._label(e)}))}}}]}_pickScript(e){if(!e){this._emit(null);return}this._emit({script:e,args:this._defaultArgs(e)})}_argsSchema(){let e=this._currentFields();return e?Object.entries(e).map(([r,i])=>({name:r,required:i.required,selector:i.selector??{text:{}}})):[]}_updateArgs(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:e,triggers:this.value.triggers})}get _triggers(){return this.value&&typeof this.value=="object"&&this.value.triggers||[]}_setTriggers(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:this.value.args,triggers:e})}_removeTrigger(e){this._setTriggers(this._triggers.filter(r=>r!==e))}_addTrigger(e){this._triggers.includes(e)||this._setTriggers([...this._triggers,e])}render(){let e=this._picked,r=this._argsSchema(),i=(this.value&&typeof this.value=="object"?this.value.args:{})??{},s=r.length>0;return l`
      <div class="section">
        <h4>${d(this.hass,"ui.script","Script")}</h4>
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
      ${e&&this._mode==="form"?this._renderTriggers():""}
      ${e&&this._mode==="yaml"?this._renderYaml():""}
    `}_renderTriggers(){let e=this._triggers;return l`
      <div class="section triggers">
        <h4>${d(this.hass,"ui.script_triggers","Triggers")}</h4>
        <p class="help">
          ${d(this.hass,"ui.script_triggers_help","Re-evaluate this scene when these entities change. A script is opaque, so templated references may be missed \u2014 add any it depends on.")}
        </p>
        ${this._renderTriggerPicker(e)}
      </div>
    `}_renderTriggerPicker(e){if(customElements.get("ha-form")){let r=[{name:"triggers",selector:{entity:{multiple:!0}}}];return l`<ha-form
        .hass=${this.hass}
        .schema=${r}
        .data=${{triggers:e}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),this._setTriggers(i.detail.value.triggers??[])}}
      ></ha-form>`}return l`
      <div class="chips">
        ${e.length===0?l`<span class="muted">${d(this.hass,"ui.script_triggers_none","No triggers")}</span>`:e.map(r=>l`<span class="chip" data-test=${`trigger-${r}`}>
                ${r}
                <button type="button" class="x" title="Remove" @click=${()=>this._removeTrigger(r)}>×</button>
              </span>`)}
      </div>
      <input
        data-test="trigger-add-input"
        placeholder="entity_id"
        @change=${r=>{let i=r.target,s=i.value.trim();s&&this._addTrigger(s),i.value=""}}
      />
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
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
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
    </select>`}};ne.styles=v`
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
  `,u([m({attribute:!1})],ne.prototype,"hass",2),u([m({attribute:!1})],ne.prototype,"value",2),u([g()],ne.prototype,"_mode",2),u([g()],ne.prototype,"_yamlText",2),u([g()],ne.prototype,"_yamlError",2),ne=u([x("ambience-script-predicate-input")],ne);var $d=["dawn","sunrise","noon","sunset","dusk","midnight"],We=class extends b{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){L(this,e)}_onKindChange(e){let r=e.target.value;r!==this.value.kind&&(r==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let r=e.target.value,[i,s]=r.split(":").map(a=>parseInt(a,10));Number.isNaN(i)||Number.isNaN(s)||this._emit({kind:"time",hh:i,mm:s})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let r=e.target.value;this._emit({...this.value,anchor:r})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let r=e.target.value.trim(),i=r===""?0:parseInt(r,10);Number.isNaN(i)||this._emit({...this.value,offset_min:i})}_onClampDirChange(e){if(this.value.kind!=="sun")return;let r=e.target.value;if(r===""){this._emit({kind:"sun",anchor:this.value.anchor,offset_min:this.value.offset_min});return}let i=this.value.clamp??kd();this._emit({...this.value,clamp:{dir:r,hh:i.hh,mm:i.mm}})}_onClampTimeChange(e){if(this.value.kind!=="sun"||!this.value.clamp)return;let r=e.target.value,[i,s]=r.split(":").map(a=>parseInt(a,10));Number.isNaN(i)||Number.isNaN(s)||this._emit({...this.value,clamp:{dir:this.value.clamp.dir,hh:i,mm:s}})}_renderTime(e){let r=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return l`<input type="time" .value=${r} @input=${this._onTimeChange} />`}_renderSun(e){let r=Ed(e.offset_min,this.hass),i=e.clamp?.dir??"",s=e.clamp?`${String(e.clamp.hh).padStart(2,"0")}:${String(e.clamp.mm).padStart(2,"0")}`:"";return l`
      <div class="sun">
        <div class="row">
          <select @change=${this._onAnchorChange}>
            ${$d.map(a=>l`<option value=${a} ?selected=${a===e.anchor}>${ve(this.hass,a)}</option>`)}
          </select>
          <input
            type="number"
            step="1"
            placeholder=${d(this.hass,"ui.offset_placeholder","Offset")}
            .value=${e.offset_min===0?"":String(e.offset_min)}
            @input=${this._onOffsetChange}
          />
          <span class="offset-hint">${r}</span>
        </div>
        <div class="row">
          <select @change=${this._onClampDirChange}>
            <option value="" ?selected=${i===""}>${d(this.hass,"ui.clamp_none","\u2014")}</option>
            <option value="not_before" ?selected=${i==="not_before"}>${d(this.hass,"ui.clamp_not_before","not before")}</option>
            <option value="not_after" ?selected=${i==="not_after"}>${d(this.hass,"ui.clamp_not_after","not after")}</option>
          </select>
          ${e.clamp?l`<input type="time" .value=${s} @input=${this._onClampTimeChange} />`:""}
        </div>
      </div>
    `}render(){return l`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>${d(this.hass,"ui.endpoint_time","Time")}</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>${d(this.hass,"ui.endpoint_sun","Sun")}</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};We.styles=v`
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
  `,u([m({attribute:!1})],We.prototype,"hass",2),u([m({attribute:!1})],We.prototype,"value",2),We=u([x("ambience-time-endpoint")],We);function kd(){let t=new Date;return{hh:t.getHours(),mm:t.getMinutes()}}function Ed(t,n){if(t===0)return"";let e=Math.abs(t),r=t<0?"\u2212":"+";if(e%60===0){let i=e/60,s=i===1?d(n,"ui.unit_hour","hour"):d(n,"ui.unit_hours","hours");return`${r}${i} ${s}`}return`${r}${e} ${d(n,"ui.unit_min","min")}`}function dt(t){return t.scope_kind==="house"?"House":t.scope_kind==="floor"?`Floor: ${t.scope_id??""}`:t.scope_id??""}function Er(t,n){if(!t)return[];let e=Object.keys(t.builtins??{}),r=n?e.slice().sort(n):e,i=new Set(t.hidden??[]),s=Object.keys(t.custom??{}).filter(a=>!(a in(t.builtins??{})));return[...r.filter(a=>!i.has(a)),...s]}var se=class extends b{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}static{this.styles=v`
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
    .warnings {
      background: var(--warning-color, #ffd); border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-bottom: 1rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await this._list()}async _saveState(e){let r=await this._save(e,this._view.hidden);this._warnings=r.warnings,await this._reload()}_onEdit(e,r){this._modal={mode:"edit",id:e,initial:r}}async _onDelete(e){let r={...this._view.custom};delete r[e],await this._saveState(r)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:r,definition:i}=e.detail;this._modal={mode:"closed"},await this._saveState({...this._view.custom,[r]:i})}_onModalCancel(){this._modal={mode:"closed"}}_takenIds(){return new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}_renderBuiltinRow(e,r,i){return l`
      <div class="row ${i?"overridden":""}">
        <span class="name">${this._label(e,{})}</span>
        <span class="def">${this._formatDef(r)}</span>
        <span class="badge">${d(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${i?"":l`<button class="icon" title=${d(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(e,r)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(e,r){return l`
      <div class="row custom">
        <span class="name">${this._label(e,this._view.custom)}</span>
        <span class="def">${this._formatDef(r)}</span>
        <span class="badge">${d(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${d(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e,r)}>✎</button>
          <button class="icon" title=${d(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e)}>✕</button>
        </span>
      </div>
    `}render(){let e=this._view.custom,[r,i]=this._headingKey(),[s,a]=this._addKey(),[o,c]=this._warningTextKey();return l`
      <header>
        <h2>${d(this.hass,r,i)}</h2>
      </header>
      ${this._warnings.length?l`<div class="warnings">
            <strong>${d(this.hass,"ui.period_warning_prefix","Warning:")}</strong> ${d(this.hass,o,c)}
            <ul>
              ${this._warnings.map(h=>l`<li>${dt(h)} / "${h.scene_name}" → ${h.missing_id}</li>`)}
            </ul>
          </div>`:""}
      ${Object.entries(this._view.builtins).map(([h,p])=>{let f=e[h];return l`
          ${this._renderBuiltinRow(h,p,f!=null)}
          ${f!=null?this._renderCustomRow(h,f):""}
        `})}
      ${Object.entries(e).filter(([h])=>!(h in this._view.builtins)).map(([h,p])=>this._renderCustomRow(h,p))}
      <button class="add" @click=${this._onAdd}>${d(this.hass,s,a)}</button>
      ${this._renderModal()}
    `}};u([m({attribute:!1})],se.prototype,"hass",2),u([g()],se.prototype,"_view",2),u([g()],se.prototype,"_modal",2),u([g()],se.prototype,"_warnings",2);var Ht={kind:"any"},Ms={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},js=["daytime","morning","afternoon","evening","nighttime"];function Sd(t,n){let e=js.indexOf(t),r=js.indexOf(n);return e===-1&&r===-1?0:e===-1?1:r===-1?-1:e-r}var ae=class extends b{constructor(){super(...arguments);this.value=null;this._entries=[Ht];this._openIdx=0}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[Ht]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(r=>{let i=this._entries[this._openIdx];if(!i)return;let s=i.kind==="any"?"__any__":i.kind==="range"?"__custom__":i.period;r.value!==s&&(r.value=s)})}_predicateToEntries(e){return e===null?[Ht]:(Array.isArray(e)?e:[e]).map(i=>"period"in i?{kind:"period",period:i.period}:{kind:"range",from:i.from,to:i.to})}_emit(e){let r=e.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),i=r.length===0?null:r.length===1?r[0]:r;L(this,i)}_effectiveIds(){return Er(this.periods,Sd)}_onSelectChange(e,r){let i=r.target.value,s=[...this._entries];i==="__any__"?s[e]=Ht:i==="__custom__"?s[e]={kind:"range",...Ms}:s[e]={kind:"period",period:i},this._entries=s,this._emit(s)}_onRangeChange(e,r,i){i.stopPropagation();let s=this._entries[e];if(s?.kind!=="range")return;let a=[...this._entries];a[e]={...s,[r]:i.detail.value},this._entries=a,this._emit(a)}_onRemove(e){let r=this._entries.filter((i,s)=>s!==e);this._entries=r.length===0?[Ht]:r,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...Ms}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,r){let i;return e.kind==="any"?i=d(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?i=_r({period:e.period},{hass:this.hass,periods:this.periods}):i=_r({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),l`
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
                ${ye(this.hass,o,a)}${a[o]&&!this.periods?.builtins[o]?d(this.hass,"ui.custom_suffix"," (custom)"):""}
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
    `}};ae.styles=v`
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
  `,u([m({attribute:!1})],ae.prototype,"value",2),u([m({attribute:!1})],ae.prototype,"periods",2),u([m({attribute:!1})],ae.prototype,"hass",2),u([g()],ae.prototype,"_entries",2),u([g()],ae.prototype,"_openIdx",2),ae=u([x("ambience-time-of-day-input")],ae);function Ue(t,n,e,r,i,s){return customElements.get("ha-form")?l`<ha-form
      class=${n}
      .hass=${t}
      .schema=${[{name:e,required:!0,selector:{select:{mode:"dropdown",options:i}}}]}
      .data=${{[e]:r}}
      .computeLabel=${()=>""}
      @value-changed=${o=>{o.stopPropagation();let c=o.detail.value[e];c&&s(c)}}
    ></ha-form>`:l`<select
    class=${n}
    @change=${a=>s(a.target.value)}
  >
    ${i.map(a=>l`<option value=${a.value} ?selected=${a.value===r}>${a.label}</option>`)}
  </select>`}function Sr(t,n,e,r,i){return customElements.get("ha-form")?l`<ha-form
      class="field"
      data-field="sensors"
      .hass=${t}
      .schema=${n}
      .data=${{sensors:e}}
      .computeLabel=${()=>""}
      @value-changed=${s=>{s.stopPropagation(),i(s.detail.value.sensors??[])}}
    ></ha-form>`:l`<input
    class="field"
    data-field="sensors"
    type="text"
    placeholder=${r}
    .value=${e.join(", ")}
    @change=${s=>i(s.target.value.split(",").map(a=>a.trim()).filter(a=>a!==""))}
  />`}var xi="__custom__",Ee=class extends b{constructor(){super(...arguments);this.value=null}_cur(){return this.value??{sensors:[],range:this._defaultRangeId()}}_sensors(){return this._cur().sensors??[]}_showQuant(){return this._sensors().length>1}_effectiveRangeIds(){return Er(this.luxRanges)}_defaultRangeId(){return this._effectiveRangeIds()[0]??"dark"}_isCustom(e){return e.range==null}_build(e){let r={...this._cur(),...e},i={sensors:r.sensors??[]};return this._isCustom(r)?(r.min!=null&&(i.min=r.min),r.max!=null&&(i.max=r.max)):i.range=r.range??this._defaultRangeId(),r.quant==="all"&&(i.quant="all"),i}_emit(e){this.value=e,L(this,e)}_setSensors(e){this._emit(this._build({sensors:e}))}_setQuant(e){this._emit(this._build({quant:e}))}_setBand(e){if(e===xi){let r=this._cur();this._emit(this._build({range:void 0,min:r.min??0,max:r.max}))}else this._emit(this._build({range:e,min:void 0,max:void 0}))}_setMin(e){this._emit(this._build({min:e}))}_setMax(e){this._emit(this._build({max:e}))}_sensorSchema(){return[{name:"sensors",selector:{entity:{domain:"sensor",device_class:["illuminance"],multiple:!0}}}]}_renderSensors(){return Sr(this.hass,this._sensorSchema(),this._sensors(),"sensor.a, sensor.b",e=>this._setSensors(e))}_renderBand(e){let r=this._isCustom(e),i=[...this._effectiveRangeIds().map(o=>({value:o,label:Je(this.hass,o,this.luxRanges?.custom??{})})),{value:xi,label:d(this.hass,"ui.custom_range","Custom range")}],s=Ue(this.hass,"band","band",r?xi:e.range??this._defaultRangeId(),i,o=>this._setBand(o));if(!r)return s;let a=o=>o==null?"":String(o);return l`${s}
      <span class="band-row" data-field="band-custom">
        <input
          type="number" min="0" step="1" data-field="min"
          placeholder=${d(this.hass,"ui.lux_min_placeholder","0")}
          .value=${a(e.min)}
          @change=${o=>{let c=o.target.value;this._setMin(c===""?void 0:Number(c))}}
        />
        <span>–</span>
        <input
          type="number" min="0" step="1" data-field="max"
          placeholder=${d(this.hass,"ui.lux_max_placeholder","\u221E")}
          .value=${a(e.max)}
          @change=${o=>{let c=o.target.value;this._setMax(c===""?void 0:Number(c))}}
        />
        <span class="label">lx</span>
      </span>`}_renderQuant(e){return Ue(this.hass,"quant","quant",e,[{value:"any",label:d(this.hass,"ui.lux_any","Any of")},{value:"all",label:d(this.hass,"ui.lux_all","All of")}],r=>this._setQuant(r))}render(){let e=this._cur(),r=e.quant==="all"?"all":"any";return l`
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._showQuant()?this._renderQuant(r):""}
        ${this._renderBand(e)}
      </div>
    `}};Ee.styles=v`
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
  `,u([m({attribute:!1})],Ee.prototype,"hass",2),u([m({attribute:!1})],Ee.prototype,"value",2),u([m({attribute:!1})],Ee.prototype,"luxRanges",2),Ee=u([x("ambience-lux-input")],Ee);function zs(t){if(typeof t!="string")return!1;let n=t.split(",").map(e=>e.trim()).filter(e=>e!=="");if(n.length===0)return!1;for(let e of n)if(e.includes("-")){let r=e.split("-").map(a=>a.trim());if(r.length!==2||!/^\d+$/.test(r[0])||!/^\d+$/.test(r[1]))return!1;let i=Number(r[0]),s=Number(r[1]);if(!(i>=1&&i<=s&&s<=31))return!1}else{if(!/^\d+$/.test(e))return!1;let r=Number(e);if(!(r>=1&&r<=31))return!1}return!0}var wi=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Cd=new Set(["workday","holiday"]),Td=new Set(["first_workday","last_workday"]),Ld=[31,29,31,30,31,30,31,31,30,31,30,31];function Nt(t){return Ld[t-1]??31}function $i(t){switch(t){case"weekday":return{kind:t,days:[]};case"day_of_month":return{kind:t,days:""};case"date":return{kind:t,month:1,day:1};case"date_range":return{kind:t,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:t}}}var Se=class extends b{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?d(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return d(this.hass,"ui.field_kind","Kind");case"days":return d(this.hass,"ui.field_days_of_month","Days of month");case"month":return d(this.hass,"ui.field_month","Month");case"day":return d(this.hass,"ui.field_day","Day");case"from_month":return d(this.hass,"ui.field_from_month","From month");case"from_day":return d(this.hass,"ui.field_from_day","From day");case"to_month":return d(this.hass,"ui.field_to_month","To month");case"to_day":return d(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let r=e.include.length===0&&e.exclude.length===0;this.value=r?null:e,L(this,this.value)}_addItem(e,r){let i=this._current();i[e]=[...i[e],$i(r)],this._emit(i)}_removeItem(e,r){let i=this._current();i[e]=i[e].filter((s,a)=>a!==r),this._emit(i)}_updateItem(e,r,i){let s=this._current();s[e]=s[e].map((a,o)=>o===r?i:a),this._emit(s)}_kindDisabled(e){return!!(Cd.has(e)&&!this.dayConfig.workday_sensor||Td.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:wi.map(e=>({value:e,label:Zt(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:Xe(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:Nt(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,r){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(r.days??"")}:e}_setDatePart(e,r,i){let s=Number(i);if(!Number.isFinite(s)||s<1)return e;if(e.kind==="date"){let{month:a,day:o}=e;return r==="month"&&(a=s),r==="day"&&(o=s),{kind:"date",month:a,day:Math.min(o,Nt(a))}}if(e.kind==="date_range"){let a={...e.from},o={...e.to};return r==="from_month"&&(a.month=s),r==="from_day"&&(a.day=s),r==="to_month"&&(o.month=s),r==="to_day"&&(o.day=s),a.day=Math.min(a.day,Nt(a.month)),o.day=Math.min(o.day,Nt(o.month)),{kind:"date_range",from:a,to:o}}return e}_onKindForm(e,r,i){let s=i.kind;if(!s){this._removeItem(e,r);return}if(this._kindDisabled(s))return;let a=this._current()[e][r];a&&a.kind===s||this._updateItem(e,r,$i(s))}_dayOfMonthError(e){return e.trim()===""||zs(e)?null:d(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(e,r,i,s){this._updateItem(e,r,this._bodyPatch(i,s))}_renderWeekday(e,r,i){return l`${[0,1,2,3,4,5,6].map(s=>l`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${i.days.includes(s)}
          @change=${a=>{let c=a.target.checked?[...i.days,s].sort((h,p)=>h-p):i.days.filter(h=>h!==s);this._updateItem(e,r,{kind:"weekday",days:c})}}
        />${Xt(this.hass,s)}
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
        @change=${s=>{let a=s.target.value;this._kindDisabled(a)||a===i.kind||this._updateItem(e,r,$i(a))}}
      >
        ${wi.map(s=>l`<option value=${s} ?disabled=${this._kindDisabled(s)}>${Zt(this.hass,s)}</option>`)}
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
      <input type="number" min="1" max=${String(Nt(c))} .value=${String(h)}
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
        ${wi.map(i=>l`<option value=${i} ?disabled=${this._kindDisabled(i)}>${Zt(this.hass,i)}</option>`)}
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
    `}};Se.styles=v`
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
  `,u([m({attribute:!1})],Se.prototype,"hass",2),u([m({attribute:!1})],Se.prototype,"value",2),u([m({attribute:!1})],Se.prototype,"dayConfig",2),Se=u([x("ambience-day-predicate-input")],Se);var Ws=["temperature","apparent_temperature","humidity","wind_speed","pressure"],Us=["<","<=",">",">="],Bs={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},me=class extends b{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(e){let r=e.groups.length===0&&e.thresholds.length===0;this.value=r?null:e,L(this,this.value)}_setGroups(e){this._emit({...this._current(),groups:e})}_addThreshold(){let e=this._current();e.thresholds=[...e.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(e)}_updateThreshold(e,r){let i=this._current();i.thresholds=i.thresholds.map((s,a)=>a===e?r:s),this._emit(i)}_removeThreshold(e){let r=this._current();r.thresholds=r.thresholds.filter((i,s)=>s!==e),this._emit(r)}_attributeSchema(e){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:Ws.map(r=>({value:r,label:yt(this.hass,r)}))}}}]}_opSchema(e){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:Us.map(r=>({value:r,label:Bs[r]}))}}}]}_entityState(){let e=this.weatherEntity;return e?this.hass?.states?.[e]:void 0}_valueSchema(e,r){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:Br(this.hass,r,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(e=>({value:e.id,label:e.label}))}}}]}_renderGroups(e){return customElements.get("ha-form")?l`<ha-form
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
      ${Ws.map(i=>l`<option value=${i} ?selected=${i===r.attribute}>${yt(this.hass,i)}</option>`)}
    </select>`}_renderOpSelect(e,r){return customElements.get("ha-form")?l`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(e)}
        .data=${{op:r.op}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation();let s=i.detail.value.op;s&&this._updateThreshold(e,{...r,op:s})}}
      ></ha-form>`:l`<select
      @change=${i=>this._updateThreshold(e,{...r,op:i.target.value})}>
      ${Us.map(i=>l`<option value=${i} ?selected=${i===r.op}>${Bs[i]}</option>`)}
    </select>`}_renderValueInput(e,r){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(e,r.attribute)}
        .data=${{value:r.value}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let a=s.detail.value.value;typeof a=="number"&&Number.isFinite(a)&&this._updateThreshold(e,{...r,value:a})}}
      ></ha-form>`;let i=Br(this.hass,r.attribute,this._entityState());return l`<span class="value-wrap">
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
    `}};me.styles=v`
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
  `,u([m({attribute:!1})],me.prototype,"hass",2),u([m({attribute:!1})],me.prototype,"value",2),u([m({attribute:!1})],me.prototype,"groups",2),u([m({attribute:!1})],me.prototype,"weatherEntity",2),me=u([x("ambience-weather-predicate-input")],me);var Rd=["NW","N","NE","W",null,"E","SW","S","SE"],Be=class extends b{constructor(){super(...arguments);this.value=null}_current(){let e=this.value?.azimuth?.ranges??[];return{elevation:this.value?.elevation??null,sectors:[...this.value?.azimuth?.sectors??[]],range:e.length?{...e[0]}:null}}_emit(e){let r={};e.elevation&&(e.elevation.min!=null||e.elevation.max!=null)&&(r.elevation=e.elevation);let i={};e.sectors.length&&(i.sectors=e.sectors),e.range&&(i.ranges=[e.range]),(i.sectors||i.ranges)&&(r.azimuth=i),this.value=r.elevation||r.azimuth?r:null,L(this,this.value)}_setElevation(e){this._emit({...this._current(),elevation:e})}_setSectors(e){this._emit({...this._current(),sectors:e})}_setRange(e){this._emit({...this._current(),range:e})}_mode(e){return!e||e.min==null&&e.max==null?"any":e.min!=null&&e.max!=null?"between":e.min!=null?"above":"below"}_onModeChange(e,r){let i=r?.min??0,s=r?.max??0;e==="any"?this._setElevation(null):e==="above"?this._setElevation({min:i}):e==="below"?this._setElevation({max:s}):this._setElevation({min:i,max:s})}_toggleSector(e,r,i){this._setSectors(i?[...e,r]:e.filter(s=>s!==r))}_renderSectors(e){return l`<div class="sectors">${Rd.map(r=>r===null?l`<span class="spacer"></span>`:l`<label>
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
    `}};Be.styles=v`
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
  `,u([m({attribute:!1})],Be.prototype,"hass",2),u([m({attribute:!1})],Be.prototype,"value",2),Be=u([x("ambience-sun-predicate-input")],Be);function ct(t){return t?.states??{}}function ki(t,n){let e=`${n}.`;return Object.keys(ct(t)).filter(r=>r.startsWith(e)).sort().map(r=>({id:r,name:O(t,r)}))}var N=class extends b{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[];this._knownAttributeValues=[];this._entitySeq=0}async updated(e){if(!e.has("value"))return;let r=e.get("value"),i=this.value.entity_id;if(i&&i!==r?.entity_id&&this.hass)try{this._knownStates=(await Gr(this.hass,i)).states}catch{this._knownStates=[]}let s=this.value.attribute;if(i!==r?.entity_id||s!==r?.attribute)if(i&&s&&this.hass)try{this._knownAttributeValues=(await Qr(this.hass,i,s)).values}catch{this._knownAttributeValues=[]}else this._knownAttributeValues.length&&(this._knownAttributeValues=[])}_normalize(e){let r={...e};return r.attribute===""&&(r.attribute=null),r.for&&r.for.h===0&&r.for.m===0&&r.for.s===0&&(r.for=null),r}_emit(e){let r=this._normalize(e);this.value=r,L(this,r)}_autoFlipOp(e){let r=this._isNumericTargetFor(e),i=this._isNumericOp(e.kind);return r&&!i?{...e,kind:">"}:!r&&i?{...e,kind:"is"}:e}async _setEntity(e){let r=++this._entitySeq,i=this._entityHasAttribute(e,this.value.attribute)?this.value.attribute:null,s=await this._supportedValues(e,i,this.value.states);r===this._entitySeq&&this._emit(this._autoFlipOp({...this.value,entity_id:e,attribute:i,states:s}))}_entityHasAttribute(e,r){return r?this._knownAttributesFor(e).includes(r):!1}async _supportedValues(e,r,i){if(!e||i.length===0||!this.hass)return[];try{let s=new Set(r?(await Qr(this.hass,e,r)).values:(await Gr(this.hass,e)).states);return i.filter(a=>s.has(a))}catch{return[]}}_setAttribute(e){this._emit(this._autoFlipOp({...this.value,attribute:e}))}_setOp(e){this._emit({...this.value,kind:e})}_setStates(e){this._emit({...this.value,states:e})}_setValueAt(e,r){if(this._isNumericOp(this.value.kind)){this._setStates([r]);return}let i=this.value.states.slice();r===""?i.splice(e,1):i[e]=r,this._setStates(i)}_addValue(e){e&&this._setStates([...this.value.states,e])}_removeValueAt(e){let r=this.value.states.slice();r.splice(e,1),this._setStates(r)}_setForDuration(e){this._emit({...this.value,for:e})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(e){if(!e)return[];let r=ct(this.hass)[e]?.attributes;return r?Object.keys(r).sort():[]}_attrLabelMaps(){let e=this._knownAttributesFor(this.value.entity_id),i=`${this.hass?.language??""}|${this.value.entity_id}|${e.join(",")}`;if(this._attrMapsCache?.key===i)return this._attrMapsCache.maps;let s=ct(this.hass)[this.value.entity_id],a=new Map,o=new Map;for(let h of e){let p=Gt(this.hass,s,h);a.set(h,p),o.set(p,h)}let c={keyToLabel:a,labelToKey:o};return this._attrMapsCache={key:i,maps:c},c}_attributeSchema(){let{keyToLabel:e}=this._attrLabelMaps();return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:N._STATE_SENTINEL,label:N._STATE_SENTINEL},...[...e.values()].map(r=>({value:r,label:r}))]}}}]}_attributeData(){let e=this.value.attribute;if(!e)return{attribute:N._STATE_SENTINEL};let{keyToLabel:r}=this._attrLabelMaps();return{attribute:r.get(e)??e}}_setAttributeFromHaForm(e){if(e===N._STATE_SENTINEL){this._setAttribute("");return}let{labelToKey:r}=this._attrLabelMaps();this._setAttribute(r.get(e)??e)}_isNumericOp(e){return N._NUMERIC_OPS.includes(e)}_isNumericTargetFor(e){let r=ct(this.hass)[e.entity_id];if(!r)return!1;if(e.attribute)return typeof r.attributes?.[e.attribute]=="number";let i=r.state;return typeof i!="string"||i===""||i==="unknown"||i==="unavailable"?!1:Number.isFinite(Number(i))}_opSchema(){let e=this._isNumericTargetFor(this.value)?[...N._NUMERIC_OPS]:["is","is_not"];return e.includes(this.value.kind)||e.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:e.map(r=>({value:r,label:J(this.hass,r)}))}}}]}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let{rawToLabel:e}=this._valueLabelMaps();return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:[...e.values()].map(r=>({value:r,label:r}))}}}]}_rawValueOptions(){return this.value.attribute?this._knownAttributeValues:this._knownStates}_valueLabelMaps(){let e=this.value.attribute,r=this._rawValueOptions(),s=`${this.hass?.language??""}|${this.value.entity_id}|${e??""}|${r.join(",")}`;if(this._valueMapsCache?.key===s)return this._valueMapsCache.maps;let a=ct(this.hass)[this.value.entity_id],o=new Map,c=new Map;for(let p of r){let f=Qt(this.hass,a,e,p);o.set(p,f),c.set(f,p)}let h={rawToLabel:o,labelToRaw:c};return this._valueMapsCache={key:s,maps:h},h}_valueDisplay(e){return this._valueLabelMaps().rawToLabel.get(e)??e}_labelToRaw(e){return this._valueLabelMaps().labelToRaw.get(e)??e}_setValueFromHaForm(e,r){this._setValueAt(e,this._labelToRaw(r))}_addValueFromHaForm(e){this._addValue(this._labelToRaw(e))}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let e=this.value.for??{h:0,m:0,s:0};return{duration:{hours:e.h,minutes:e.m,seconds:e.s}}}_setForFromHaForm(e){this._setForDuration({h:e?.hours??0,m:e?.minutes??0,s:e?.seconds??0})}_renderEntity(){return customElements.get("ha-form")?l`<ha-form
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
    </select>`}_renderValueRow(e,r){let i=r===-1,s=i?c=>this._addValue(c):c=>this._setValueAt(r,c),a=this._isNumericOp(this.value.kind),o=a?{value:e===""?void 0:Number(e)}:{value:this._valueDisplay(e)};return customElements.get("ha-form")?l`
        <div class="value-row" data-row=${r}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${o}
            .computeLabel=${()=>""}
            @value-changed=${c=>{c.stopPropagation();let h=c.detail.value.value,p=h==null?"":String(h);a?s(p):i?this._addValueFromHaForm(p):this._setValueFromHaForm(r,p)}}
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
    `}};N.styles=v`
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
  `,N._STATE_SENTINEL="State",N._NUMERIC_OPS=[">",">=","<","<="],u([m({attribute:!1})],N.prototype,"hass",2),u([m({attribute:!1})],N.prototype,"value",2),u([g()],N.prototype,"_knownStates",2),u([g()],N.prototype,"_knownAttributeValues",2),N=u([x("ambience-state-expr-atom")],N);function Cr(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,r)=>e===n[r])}var G=class extends b{constructor(){super(...arguments);this.path=[];this.dragOverPath=null;this.dragFromPath=null;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(e,r={}){this.dispatchEvent(new CustomEvent(e,{detail:{path:this.path,...r},bubbles:!0,composed:!0}))}_atomIsComplete(e){return!!e.entity_id&&e.states.some(r=>r!=="")}_isErrorTarget(){return Cr(this.path,this.errorPath)}_isDropTarget(){return Cr(this.path,this.dragOverPath)}_isDragging(){return Cr(this.path,this.dragFromPath)}_onDragHandleDown(e){this.path.length!==0&&(!e.isPrimary||e.button>0||(e.stopPropagation(),this.dispatchEvent(new CustomEvent("node-drag-start",{detail:{path:this.path,pointer:e},bubbles:!0,composed:!0}))))}_dragHandle(){return this.path.length===0?"":l`<span
      class="drag-handle"
      title=${d(this.hass,"ui.drag_to_reorder","Drag to reorder")}
      @pointerdown=${this._onDragHandleDown}
      @click=${e=>e.stopPropagation()}
      >⠿</span
    >`}_renderAtomCard(e,r){let i=this._atomIsComplete(e),s=Cr(this.path,this.openPath),a=i?oi(e,{hass:this.hass}):d(this.hass,"ui.state_new_condition","(new condition)");return l`
      <div class="atom-card ${s?"expanded":"collapsed"} ${this._isDropTarget()?"drag-over":""} ${this._isDragging()?"dragging":""}">
        <div class="atom-header"
          @click=${()=>this._emit("node-open")}>
          ${this._dragHandle()}
          <button class="not-toggle ${r?"on":""}"
            title=${d(this.hass,"ui.state_not_toggle","Negate (NOT)")}
            @click=${o=>{o.stopPropagation(),this._emit("node-toggle-not")}}>${J(this.hass,"not")}</button>
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
              @value-changed=${o=>{o.stopPropagation();let c=o.detail.value,h=r?{kind:"not",item:c}:c;this._emit("node-change",{value:h})}}
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
        .dragOverPath=${this.dragOverPath}
        .dragFromPath=${this.dragFromPath}
        .errorPath=${this.errorPath}
        .errorMessage=${this.errorMessage}
      ></ambience-state-expr-node>
    `}_renderGroup(e){return l`
      <div class="group ${this._isDropTarget()?"drag-over":""} ${this._isDragging()?"dragging":""}">
        <div class="group-header">
          ${this._dragHandle()}
          <select class="group-op"
            @change=${r=>this._emit("node-set-op",{op:r.target.value})}>
            <option value="and" ?selected=${e.kind==="and"}>${J(this.hass,"and")}</option>
            <option value="or"  ?selected=${e.kind==="or"} >${J(this.hass,"or")}</option>
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
          @click=${()=>this._emit("node-toggle-not")}>${J(this.hass,"not")}</button>`}
        ${this._renderGroup(e)}
      </div>
    `}};G.styles=v`
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
  `,u([m({attribute:!1})],G.prototype,"hass",2),u([m({attribute:!1})],G.prototype,"value",2),u([m({attribute:!1})],G.prototype,"path",2),u([m({attribute:!1})],G.prototype,"dragOverPath",2),u([m({attribute:!1})],G.prototype,"dragFromPath",2),u([m({attribute:!1})],G.prototype,"openPath",2),u([m({attribute:!1})],G.prototype,"errorPath",2),u([m({attribute:!1})],G.prototype,"errorMessage",2),G=u([x("ambience-state-expr-node")],G);function Ot(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,r)=>e===n[r])}var Pd=new Set(["is","is_not",">",">=","<","<=","and","or","not"]);function qs(t,n){if(!t.entity_id)return d(n,"ui.state_err_entity","Entity is required");let e=Array.isArray(t.states)?t.states:[];if(t.kind!=="is"&&t.kind!=="is_not"){let i=e[0];if(typeof i!="string"||!i.trim())return d(n,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(i)))return d(n,"ui.state_err_numeric","Value must be a number")}else if(!e.some(i=>i!==""))return d(n,"ui.state_err_state","State is required");return null}function Tr(t,n){if(!t||typeof t!="object")return null;if(t.kind==="not"){let e=t.item;return e?Tr(e,n):d(n,"ui.state_err_incomplete","This condition is incomplete")}if(t.kind==="and"||t.kind==="or"){let e=t.items;if(!Array.isArray(e)||e.length===0)return d(n,"ui.state_err_incomplete","This condition is incomplete");for(let r of e){let i=Tr(r,n);if(i!==null)return i}return null}return qs(t,n)}function Vs(t,n){if(t==null||typeof t!="object")return null;let e=t.kind;return typeof e!="string"||!Pd.has(e)?null:Tr(t,n)}var Z=class extends b{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._dragFrom=null;this._dragOverPath=null;this._cancelDrag=null;this._onNodeDragStart=e=>{e.stopPropagation(),this._startDrag(e.detail.path,e.detail.pointer)};this._onNodeChange=e=>{e.stopPropagation();let{path:r,value:i}=e.detail;if(this._isEmptyAtom(i)){let s=this._atomAt(r);if(s&&!this._isEmptyAtom(s)){this._openPath=null,this._removeAt(r);return}}this._replaceAt(r,i)};this._onNodeRemove=e=>{e.stopPropagation(),this._removeAt(e.detail.path)};this._onNodeWrap=e=>{e.stopPropagation(),this._wrapAt(e.detail.path)};this._onNodeAddChild=e=>{e.stopPropagation(),this._addChildAt(e.detail.path,"is")};this._onNodeToggleNot=e=>{e.stopPropagation(),this._toggleNotAt(e.detail.path)};this._onNodeSetOp=e=>{e.stopPropagation(),this._setGroupOpAt(e.detail.path,e.detail.op)};this._onNodeUnwrap=e=>{e.stopPropagation(),this._unwrapAt(e.detail.path)};this._onNodeOpen=e=>{if(e.stopPropagation(),this._openPath!==null){let r=this._atomAt(this._openPath);if(r&&this._atomError(r)!==null){this._showError=!0;return}}this._openPath!==null&&Ot(this._openPath,e.detail.path)?this._openPath=null:this._openPath=e.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-drag-start",this._onNodeDragStart)}disconnectedCallback(){super.disconnectedCallback(),this._endDrag()}_emit(e){this.value=e,L(this,e)}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(e,r){let i=this._patch(this.value,e,()=>r);this._emit(i)}_removeAt(e){if(e.length===0){this._emit(null);return}let r=this._patch(this.value,e,()=>null);this._emit(r)}_wrapAt(e){let r=null;if(e.length>0){let a=this._nodeAt(e.slice(0,-1));a&&(a.kind==="and"||a.kind==="or")&&(r=a.kind)}let i=r==="and"?"or":"and",s=this._patch(this.value,e,a=>a&&{kind:i,items:[a]});this._emit(s)}_nodeAt(e){return this._walkNode(this.value,e)}_moveAt(e,r){if(this._isPrefix(e,r)||e.length===0||r.length===0)return;let i=this._nodeAt(e);if(!i)return;let s=this._rewriteForMove(this.value,[],e,r,i);this._emit(s)}_isPrefix(e,r){return e.length>r.length?!1:e.every((i,s)=>i===r[s])}_rewriteForMove(e,r,i,s,a){if(!e)return e;if(e.kind==="not"){let _=this._rewriteForMove(e.item,r,i,s,a);return _==null?null:{kind:"not",item:_}}if(e.kind!=="and"&&e.kind!=="or")return e;let o=i.slice(0,-1),c=s.slice(0,-1),h=Ot(r,o),p=Ot(r,c),f=[];if(e.items.forEach((_,y)=>{let $=[...r,y];if(h&&y===i[i.length-1])return;let E=this._rewriteForMove(_,$,i,s,a);E!==null&&f.push(E)}),p){let _=s[s.length-1];f.splice(_,0,a)}return f.length===0?null:{...e,items:f}}_startDrag(e,r){this._endDrag(),this._dragFrom=e,this._dragOverPath=null;let i=r.target?.closest(".atom-card, .group");this._cancelDrag=ur(r,{onMove:(s,a)=>{let o=this._locatePathAt(s,a),c=this._isDroppable(e,o)?o:null;(c===null?this._dragOverPath!==null:!Ot(c,this._dragOverPath))&&(this._dragOverPath=c)},onEnd:(s,a)=>{let o=this._locatePathAt(s,a);this._isDroppable(e,o)&&this._moveAt(e,o),this._endDrag()},onCancel:()=>this._endDrag()},{follow:i})}_endDrag(){this._cancelDrag?.(),this._cancelDrag=null,this._dragFrom=null,this._dragOverPath=null}_isDroppable(e,r){return r!==null&&r.length>0&&!Ot(e,r)&&!this._isPrefix(e,r)}_locatePathAt(e,r){let i=hr(e,r);for(;i;){if(i instanceof Element&&i.localName==="ambience-state-expr-node"){let a=i.path;return a?[...a]:null}let s=i.parentNode;s?i=s:i instanceof ShadowRoot?i=i.host:i=null}return null}_walkNode(e,r){return e?e.kind==="not"?this._walkNode(e.item,r):r.length===0?e:e.kind==="and"||e.kind==="or"?this._walkNode(e.items[r[0]]??null,r.slice(1)):null:null}_addChildAt(e,r){let i=null,s=this._patch(this.value,e,a=>{if(a&&(a.kind==="and"||a.kind==="or")){let o=[...a.items,this._emptyAtom()];return i=[...e,o.length-1],{...a,items:o}}return a});i!==null&&(this._openPath=i),this._emit(s)}_toggleNotAt(e){let r=this._patch(this.value,e,i=>i&&(i.kind==="not"?i.item:{kind:"not",item:i}));this._emit(r)}_setGroupOpAt(e,r){let i=this._patch(this.value,e,s=>{if(!s)return s;let a=null;if(s.kind==="and"||s.kind==="or")a=s;else if(s.kind==="not"){let o=s.item;(o.kind==="and"||o.kind==="or")&&(a=o)}return a?{kind:r,items:a.items}:s});this._emit(i)}_patch(e,r,i){if(r.length===0)return i(e);if(e==null)return e;let[s,...a]=r;if(e.kind==="and"||e.kind==="or"){let o=e.items.length,c=e.items.slice(),h=this._patch(c[s],a,i);if(h===null?c.splice(s,1):c[s]=h,c.length<o){if(c.length===0)return null;if(c.length===1)return c[0]}return{...e,items:c}}if(e.kind==="not"){let o=this._patch(e.item,r,i);return o==null?null:{kind:"not",item:o}}return e}_isEmptyAtom(e){if(e.kind==="not")return this._isEmptyAtom(e.item);if(e.kind==="and"||e.kind==="or")return!1;let r=e;return!r.entity_id&&r.states.every(i=>i==="")&&!r.attribute&&!r.for}_atomAt(e){return this._walk(this.value,e)}_walk(e,r){return e?e.kind==="not"?this._walk(e.item,r):r.length===0?e.kind==="and"||e.kind==="or"?null:e:e.kind==="and"||e.kind==="or"?this._walk(e.items[r[0]]??null,r.slice(1)):null:null}_treeError(e=this.value){return Tr(e,this.hass)}_emitValidity(){let e=this._treeError();this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_atomError(e){return qs(e,this.hass)}_unwrapAt(e){if(e.length===0){let a=this.value;if(!a)return;let o=a.kind==="not"?a.item:a;(o.kind==="and"||o.kind==="or")&&(o.items.length===1?this._emit(o.items[0]):this._emit(null));return}let r=e.slice(0,-1),i=e[e.length-1],s=this._patch(this.value,r,a=>{if(!a||a.kind!=="and"&&a.kind!=="or")return a;let o=a.items.slice(),c=o[i],h=null;if(c.kind==="and"||c.kind==="or")h=c;else if(c.kind==="not"){let p=c.item;(p.kind==="and"||p.kind==="or")&&(h=p)}return h?(o.splice(i,1,...h.items),{...a,items:o}):a});this._emit(s)}willUpdate(e){if(e.has("value")){let r=this.value;if(r&&this._openPath===null&&r.kind!=="and"&&r.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let i=this._atomAt(this._openPath);(!i||this._atomError(i)===null)&&(this._showError=!1)}this._emitValidity()}}_addAtRoot(){let e=this.value;if(e==null){this._addFirstAtom();return}if(e.kind==="and"||e.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[e,this._emptyAtom()]})}_setOpen(e){this._openPath=e}render(){if(this.value==null)return l`
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
        .dragOverPath=${this._dragOverPath}
        .dragFromPath=${this._dragFrom}
        .errorPath=${e?this._openPath:null}
        .errorMessage=${e}
      ></ambience-state-expr-node>
      ${i?l`
        <button class="root-add" @click=${()=>this._addAtRoot()}>
          + ${d(this.hass,"ui.state_add_condition","Add condition")}
        </button>
      `:""}
    `}};Z.styles=v`
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
  `,u([m({attribute:!1})],Z.prototype,"hass",2),u([m({attribute:!1})],Z.prototype,"value",2),u([g()],Z.prototype,"_openPath",2),u([g()],Z.prototype,"_showError",2),u([g()],Z.prototype,"_dragFrom",2),u([g()],Z.prototype,"_dragOverPath",2),Z=u([x("ambience-state-predicate-input")],Z);var Ks=["everybody","anybody","nobody","any","all","none"],Ys=new Set(["any","all","none"]),Ei={everybody:"everyone",anybody:"any",nobody:"nobody",any:"any",all:"everyone",none:"nobody"},qe=class extends b{constructor(){super(...arguments);this.value=null;this._lastSelected=[]}_persons(){return ki(this.hass,"person")}_zones(){return ki(this.hass,"zone")}_cur(){return this.value??{}}_who(){return this.value?.who??[]}_hasWhoKey(){return this.value!=null&&Array.isArray(this.value.who)}_mode(){if(this._hasWhoKey())switch(this._cur().quant??"any"){case"any":return"any";case"everyone":return"all";case"nobody":return"none"}switch(this._cur().quant??"everyone"){case"nobody":return"nobody";case"any":return"anybody";default:return"everybody"}}_hasFor(e){return!!e&&(e.h!==0||e.m!==0||e.s!==0)}_isNegativeQuant(){return Ei[this._mode()]==="nobody"}_effectiveNegate(){return!this._isNegativeQuant()&&!!this._cur().negate}_emitMode(e){let r=this._cur(),i=r.where??"home",s={quant:Ei[e],where:i};r.negate&&Ei[e]!=="nobody"&&(s.negate=!0),Ys.has(e)&&(this._hasWhoKey()?s.who=[...this._who()]:this._lastSelected.length>0?s.who=[...this._lastSelected]:s.who=this._persons().map(a=>a.id)),this._hasFor(r.for)&&(s.for=r.for),this._emit(s)}_emit(e){this.value=e,L(this,e)}_setMode(e){this._emitMode(e)}_setWhere(e){let r=this._cur(),i={quant:r.quant??"everyone",where:e};this._effectiveNegate()&&(i.negate=!0),this._hasWhoKey()&&(i.who=[...this._who()]),this._hasFor(r.for)&&(i.for=r.for),this._emit(i)}_setNegate(e){let r=this._cur(),i={quant:r.quant??"everyone",where:r.where??"home"};e&&(i.negate=!0),this._hasWhoKey()&&(i.who=[...this._who()]),this._hasFor(r.for)&&(i.for=r.for),this._emit(i)}_togglePerson(e,r){let i=r?[...this._who(),e]:this._who().filter(o=>o!==e);i.length>0&&(this._lastSelected=[...i]);let s=this._cur(),a={quant:s.quant??"any",where:s.where??"home",who:i};this._effectiveNegate()&&(a.negate=!0),this._hasFor(s.for)&&(a.for=s.for),this._emit(a)}_setFor(e){let r=this._cur(),i={quant:r.quant??"everyone",where:r.where??"home"};this._effectiveNegate()&&(i.negate=!0),this._hasWhoKey()&&(i.who=[...this._who()]),this._hasFor(e)&&(i.for=e),this._emit(i)}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let e=this._cur().for??{h:0,m:0,s:0};return{duration:{hours:e.h,minutes:e.m,seconds:e.s}}}_setForFromHaForm(e){this._setFor({h:e?.hours??0,m:e?.minutes??0,s:e?.seconds??0})}_modeLabel(e){switch(e){case"everybody":return d(this.hass,"ui.people_mode_everybody","Everybody");case"anybody":return d(this.hass,"ui.people_mode_anybody","Anybody");case"nobody":return d(this.hass,"ui.people_mode_nobody","Nobody");case"any":return d(this.hass,"ui.people_mode_any","Any of:");case"all":return d(this.hass,"ui.people_mode_all","All of:");case"none":return d(this.hass,"ui.people_mode_none","None of:")}}_renderMode(e){if(customElements.get("ha-form")){let r=[{name:"mode",required:!0,selector:{select:{mode:"dropdown",options:Ks.map(i=>({value:i,label:this._modeLabel(i)}))}}}];return l`<ha-form
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
      ${Ks.map(r=>l`<option value=${r} ?selected=${r===e}>${this._modeLabel(r)}</option>`)}
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
      ${Ys.has(i)?this._renderPeople():""}
      <div class="row">
        ${s?this._renderNegate(a):l`<span class="label negate-static">${d(this.hass,"ui.people_is_at_static","is at")}</span>`}
        ${this._renderWhere(r)}
      </div>
      <div class="row">
        <span class="label">${d(this.hass,"ui.people_for","for")}</span>
        ${this._renderFor()}
      </div>
    `}};qe.styles=v`
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
  `,u([m({attribute:!1})],qe.prototype,"hass",2),u([m({attribute:!1})],qe.prototype,"value",2),qe=u([x("ambience-people-predicate-input")],qe);var Ve=class extends b{constructor(){super(...arguments);this.value=null}_cur(){return this.value??{sensors:[]}}_sensors(){return this._cur().sensors??[]}_showQuant(){return this._sensors().length>1}_hasFor(e){return!!e&&(e.h!==0||e.m!==0||e.s!==0)}_build(e){let r={...this._cur(),...e},i={sensors:r.sensors??[]};return r.occupied===!1&&(i.occupied=!1),r.quant==="all"&&(i.quant="all"),this._hasFor(r.for)&&(i.for=r.for),r.negate===!0&&(i.negate=!0),i}_emit(e){this.value=e,L(this,e)}_setSensors(e){this._emit(this._build({sensors:e}))}_setOccupied(e){this._emit(this._build({occupied:e}))}_setNegate(e){this._emit(this._build({negate:e}))}_setQuant(e){this._emit(this._build({quant:e}))}_setFor(e){this._emit(this._build({for:e}))}_sensorSchema(){return[{name:"sensors",selector:{entity:{domain:"binary_sensor",device_class:["occupancy","presence","motion"],multiple:!0}}}]}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let e=this._cur().for??{h:0,m:0,s:0};return{duration:{hours:e.h,minutes:e.m,seconds:e.s}}}_setForFromHaForm(e){this._setFor({h:e?.hours??0,m:e?.minutes??0,s:e?.seconds??0})}_renderSensors(){return Sr(this.hass,this._sensorSchema(),this._sensors(),"binary_sensor.a, binary_sensor.b",e=>this._setSensors(e))}_renderNegate(e){return Ue(this.hass,"negate","negate",e?"is_not":"is",[{value:"is",label:d(this.hass,"ui.occupancy_is","is")},{value:"is_not",label:d(this.hass,"ui.occupancy_is_not","is not")}],r=>this._setNegate(r==="is_not"))}_renderOccupied(e){return Ue(this.hass,"state","state",e?"occupied":"vacant",[{value:"occupied",label:d(this.hass,"ui.occupancy_detected","Detected")},{value:"vacant",label:d(this.hass,"ui.occupancy_clear","Clear")}],r=>this._setOccupied(r==="occupied"))}_renderQuant(e){return Ue(this.hass,"quant","quant",e,[{value:"any",label:d(this.hass,"ui.occupancy_any","Any of")},{value:"all",label:d(this.hass,"ui.occupancy_all","All of")}],r=>this._setQuant(r))}_renderFor(){if(customElements.get("ha-form"))return l`<ha-form
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
    </div>`}render(){let e=this._cur(),r=e.occupied!==!1,i=e.negate===!0,s=e.quant==="all"?"all":"any";return l`
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._renderNegate(i)}
        ${this._renderOccupied(r)}
        ${this._showQuant()?this._renderQuant(s):""}
      </div>
      <div class="row">
        <span class="label">${d(this.hass,"ui.occupancy_for","for")}</span>
        ${this._renderFor()}
      </div>
    `}};Ve.styles=v`
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
  `,u([m({attribute:!1})],Ve.prototype,"hass",2),u([m({attribute:!1})],Ve.prototype,"value",2),Ve=u([x("ambience-occupancy-predicate-input")],Ve);var Dd=new Set(["1","true","yes","on","enable"]);function Gs(t){return t==null?!1:typeof t=="boolean"?t:typeof t=="number"?t!==0:typeof t=="string"?Dd.has(t.toLowerCase().trim()):!1}function Ad(t){if(t!==null&&typeof t=="object")try{return JSON.stringify(t)}catch{return String(t)}return String(t)}var Ce=class extends b{constructor(){super(...arguments);this.value=null;this._preview=null;this._debounceMs=250;this._gen=0}_template(){return this.value&&typeof this.value=="object"?this.value.template:""}willUpdate(e){if(!e.has("value")&&!e.has("hass"))return;let r=this._template(),i=this.hass?.connection;r===this._activeTemplate&&i===this._activeConn||(this._activeTemplate=r,this._activeConn=i,this._scheduleRender())}disconnectedCallback(){super.disconnectedCallback(),this._teardown()}_teardown(){this._debounceTimer!=null&&(clearTimeout(this._debounceTimer),this._debounceTimer=void 0),this._unsub&&(this._unsub(),this._unsub=void 0)}_scheduleRender(){this._teardown();let e=this._template();if(!e.trim()||!this.hass?.connection?.subscribeMessage){this._setPreview(null);return}let r=++this._gen;this._debounceTimer=setTimeout(()=>this._subscribe(e,r),this._debounceMs)}async _subscribe(e,r){let i=this.hass?.connection;if(i?.subscribeMessage)try{let s=await i.subscribeMessage(a=>{r===this._gen&&this._setPreview(a.error!=null?{error:a.error}:{value:Ad(a.result),truthy:Gs(a.result)})},{type:"render_template",template:e,report_errors:!0});if(r!==this._gen){s();return}this._unsub=s}catch(s){if(r!==this._gen)return;this._setPreview({error:s?.message??String(s)})}}_setPreview(e){this._preview=e,this._emitValidity(e!=null&&"error"in e?e.error:null)}_emitValidity(e){this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_onInput(e){let r=e.target.value,i=r.trim()===""?null:{template:r};this.value=i,L(this,i)}_renderPreview(){let e=this._preview;return e==null?"":"error"in e?l`<div class="preview error">
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
    `}};Ce.styles=v`
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
  `,u([m({attribute:!1})],Ce.prototype,"value",2),u([m({attribute:!1})],Ce.prototype,"hass",2),u([g()],Ce.prototype,"_preview",2),Ce=u([x("ambience-template-predicate-input")],Ce);var X=class extends b{constructor(){super(...arguments);this.value=null}_emit(e){L(this,e)}_onText(e){let r=e.target.value;this._emit(r.trim()===""?null:r)}render(){return this.condition.input==="time_of_day"?l`
        <ambience-time-of-day-input
          .value=${this.value}
          .periods=${this.periods}
          .hass=${this.hass}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-time-of-day-input>
      `:this.condition.input==="script_predicate"?l`
        <ambience-script-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-script-predicate-input>
      `:this.condition.input==="day_predicate"?l`
        <ambience-day-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .dayConfig=${this.dayConfig??{workday_sensor:null,workday_calendar:null}}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-day-predicate-input>
      `:this.condition.input==="weather_predicate"?l`
        <ambience-weather-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .groups=${this.weatherConfig?.groups??[]}
          .weatherEntity=${this.weatherConfig?.entity??void 0}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-weather-predicate-input>
      `:this.condition.input==="sun_predicate"?l`
        <ambience-sun-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-sun-predicate-input>
      `:this.condition.input==="template_predicate"?l`
        <ambience-template-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-template-predicate-input>
      `:this.condition.input==="state_predicate"?l`
        <ambience-state-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-state-predicate-input>
      `:this.condition.input==="people_predicate"?l`
        <ambience-people-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-people-predicate-input>
      `:this.condition.input==="lux"?l`
        <ambience-lux-input
          .hass=${this.hass}
          .value=${this.value}
          .luxRanges=${this.luxRanges}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-lux-input>
      `:this.condition.input==="occupancy_predicate"?l`
        <ambience-occupancy-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value)}}
        ></ambience-occupancy-predicate-input>
      `:l`
      <input
        type="text"
        placeholder=${d(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.condition.predicate_help}</div>
    `}};X.styles=v`
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
  `,u([m({attribute:!1})],X.prototype,"condition",2),u([m({attribute:!1})],X.prototype,"value",2),u([m({attribute:!1})],X.prototype,"periods",2),u([m({attribute:!1})],X.prototype,"luxRanges",2),u([m({attribute:!1})],X.prototype,"dayConfig",2),u([m({attribute:!1})],X.prototype,"weatherConfig",2),u([m({attribute:!1})],X.prototype,"hass",2),X=u([x("ambience-condition-input")],X);function Hd(t){return t!=null&&typeof t=="object"&&Array.isArray(t.who)&&t.who.length===0}function Nd(t){return t==="people"?{quant:"everyone",where:"home"}:null}function Qs(t,n){return!!t&&!!n&&W(t)===W(n)}var S=class extends b{constructor(){super(...arguments);this.open=!1;this.scene=null;this.conditions=[];this.availableActions=[];this.categories=[];this.schemas={};this.scopes=[];this.takenNames=new Map;this.saveError="";this._draft=null;this._open=null;this._showError=!1;this._addOrder=[];this._serviceHasTarget=new Map;this._conditionError=new Map;this._onNameInput=e=>{this._setName(e.target.value)};this._onAddCondition=e=>{let r=e.target,i=r.value;r.value="",this._addCondition(i)};this._onAddConditionHaForm=e=>{e.stopPropagation();let r=e.detail.value.add;r!==S._ADD_CONDITION_PLACEHOLDER&&this._addCondition(r)};this._onAddAction=e=>{let r=e.target,i=r.value;r.value="",this._addActionSlot(i)};this._onAddActionHaForm=e=>{e.stopPropagation();let r=e.detail.value.add;r!==S._ADD_ACTION_PLACEHOLDER&&this._addActionSlot(r)}}_onConditionInvalid(e,r){r?this._conditionError.set(e,r):this._conditionError.delete(e)}connectedCallback(){super.connectedCallback(),_e(this,this.hass)}willUpdate(e){e.has("open")&&this.open&&(this._draft=this.scene?JSON.parse(JSON.stringify(this.scene)):null,this._scope=this.scope,this._open=null,this._showError=!1,this._addOrder=[])}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_setDestination(e){let r=this.scopes[e];if(!r||!this._draft||(this._scope=r.scope,!this.hass))return;let i=new Set(cr(this.hass,this._scope,[]));this._draft={...this._draft,actions:this._draft.actions.map(s=>({...s,entity_ids:s.entity_ids.filter(a=>i.has(a))}))}}_renderDestination(){return l`
      <div class="scope-menu" role="listbox">
        ${this.scopes.map((e,r)=>l`<button
            class="scope-option"
            role="option"
            aria-selected=${Qs(e.scope,this._scope)}
            @click=${()=>{this._setDestination(r),this._open=null}}
          >
            <ha-icon class="scope-icon" icon=${kt(e.scope,this.hass)}></ha-icon>
            <span class="scope-name">${e.label}</span>
          </button>`)}
      </div>
    `}_renderDestinationSlot(){if(this.scopes.length===0)return"";if(this._isOpen({kind:"destination"}))return l`
        <div class="slot destination-slot expanded" data-slot-id="destination">
          ${this._renderDestination()}
        </div>
      `;let e=this.scopes.find(r=>Qs(r.scope,this._scope))??this.scopes[0];return l`
      <div class="slot collapsed" data-slot-id="destination">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"destination"})}>
          <strong>${d(this.hass,"ui.scope","Scope")}:</strong>
          <ha-icon class="scope-icon" icon=${kt(e.scope,this.hass)}></ha-icon>
          <span class="scope-name">${e.label}</span>
        </div>
      </div>
    `}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"})){let s=this._showError?this._nameError():null;return l`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
          ${s?l`<div class="error">${s}</div>`:""}
        </div>
      `}let i=fr(this._draft,d(this.hass,"ui.new_scene","New scene"));return l`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${i}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let r=Vi();return r==="ha-input"?l`<ha-input label=${d(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:r==="ha-textfield"?l`<ha-textfield label=${d(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:l`<input type="text" .value=${e} @input=${this._onNameInput} />`}_setCategory(e){!this._draft||!e||e===this._draft.category||(this._draft={...$t(this._draft),category:e})}_renderCategorySlot(){if(this.categories.length===0)return"";let e=[...this.categories].sort((s,a)=>s.name.localeCompare(a.name)),r=this._effectiveCategoryId(),i=this.categories.find(s=>s.id===r)??e[0];return this._isOpen({kind:"category"})?l`
        <div class="slot category-slot expanded" data-slot-id="category">
          <div class="category-menu" role="listbox">
            ${e.map(s=>l`<button
                class="category-option"
                role="option"
                aria-selected=${s.id===r}
                @click=${()=>{this._setCategory(s.id),this._open=null}}
              >
                ${et(s.color,s.icon)}
                <span class="category-name">${s.name}</span>
              </button>`)}
          </div>
        </div>
      `:l`
      <div class="slot collapsed" data-slot-id="category">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"category"})}>
          <strong>${d(this.hass,"ui.category","Category")}:</strong>
          ${et(i.color,i.icon)}
          <span class="category-name">${i.name}</span>
        </div>
      </div>
    `}_isOpen(e){let r=this._open;return r===null||r.kind!==e.kind?!1:e.kind==="condition"&&r.kind==="condition"?e.id===r.id:e.kind==="action"&&r.kind==="action"?e.idx===r.idx:!0}_effectiveCategoryId(){return this._draft?.category?this._draft.category:[...this.categories].sort((r,i)=>r.name.localeCompare(i.name))[0]?.id??""}_nameError(){let e=this._draft?.name?.trim().toLowerCase();if(!e||!this._scope)return null;let r=dr(this._scope,this._effectiveCategoryId());return this.takenNames.get(r)?.has(e)?d(this.hass,"ui.name_duplicate","A scene with this name already exists in this category."):null}_validationError(e){if(e===null||e.kind==="category"||e.kind==="destination")return null;if(e.kind==="name")return this._nameError();if(e.kind==="condition"){let s=this._draft?.when[e.id];if(Hd(s))return d(this.hass,"ui.people_select_one","Select at least one person");let a=Vs(s,this.hass);return a||(this._conditionError.has(e.id)?d(this.hass,"ui.condition_error","Fix the error in this condition before continuing"):null)}let r=this._draft?.actions[e.idx];if(!r)return null;let i=this._serviceHasTarget.get(r.service);return r.entity_ids.length===0&&i===!0?d(this.hass,"ui.at_least_one_target","At least one target is required."):null}_leaveBlockingError(e){return e?.kind==="name"?null:this._validationError(e)}_tryCloseCurrent(){return this._open===null?!0:this._leaveBlockingError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){if(this._leaveBlockingError(e)!==null){this._showError=!0;return}this._open=null,this._showError=!1;return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let r of e.composedPath())if(r instanceof Element&&(r.classList.contains("slot")||r.classList.contains("actions-bar")||r.classList.contains("add-condition")||r.classList.contains("add-action")))return;this._tryCloseCurrent()}_setPredicate(e,r){if(!this._draft)return;let i={...this._draft.when};r==null?delete i[e]:i[e]=r,this._draft={...this._draft,when:i}}_renderConditionRow(e){let r=this._draft.when[e.name]??null,i=this._isOpen({kind:"condition",id:e.name}),s=Tt(e.name,r,{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges});return l`
      <div class="slot ${i?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"condition",id:e.name})}>
          <span class="summary-label"><strong>${Y(this.hass,e.name)}:</strong> ${s}</span>
          <button
            class="remove"
            @click=${a=>{a.stopPropagation(),this._removeCondition(e.name)}}
            title=${d(this.hass,"ui.remove_condition","Remove condition")}
          >✕</button>
        </div>
        ${i?l`
          <div class="body">
            <ambience-condition-input
              .hass=${this.hass}
              .condition=${e}
              .value=${r}
              .periods=${this.periods}
              .luxRanges=${this.luxRanges}
              .dayConfig=${this.dayConfig}
              .weatherConfig=${this.weatherConfig}
              @value-changed=${a=>this._setPredicate(e.name,a.detail.value)}
              @render-invalid-changed=${a=>this._onConditionInvalid(e.name,a.detail.error)}
            ></ambience-condition-input>

            ${this._showError&&this._validationError({kind:"condition",id:e.name})?l`
              <div class="error">${this._validationError({kind:"condition",id:e.name})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_visibleConditions(){if(!this._draft)return[];let e=this._draft.when,r=this.conditions.filter(o=>o.name in e&&e[o.name]!=null||this._open?.kind==="condition"&&this._open.id===o.name),i=new Set(this._addOrder),s=r.filter(o=>!i.has(o.name)),a=this._addOrder.map(o=>r.find(c=>c.name===o)).filter(o=>o!=null);return[...s,...a]}_unusedConditions(){let e=new Set(this._visibleConditions().map(r=>r.name));return this.conditions.filter(r=>!e.has(r.name)).sort((r,i)=>Y(this.hass,r.name).localeCompare(Y(this.hass,i.name)))}_addCondition(e){if(!e||this._open!==null&&!this._tryCloseCurrent())return;let r=Nd(e);r!=null&&this._draft&&!(e in this._draft.when)&&(this._draft={...this._draft,when:{...this._draft.when,[e]:r}}),this._addOrder=[...this._addOrder.filter(i=>i!==e),e],this._open={kind:"condition",id:e},this._showError=!1}_removeCondition(e){if(!this._draft)return;let r={...this._draft.when};delete r[e],this._draft={...this._draft,when:r},this._conditionError.delete(e),this._open?.kind==="condition"&&this._open.id===e&&(this._open=null,this._showError=!1)}_conditionDisabled(e){return e==="weather"&&!this.weatherConfig?.entity}_renderAddCondition(){let e=this._unusedConditions();return e.length===0?"":customElements.get("ha-form")?this._renderAddConditionHaForm(e):l`
      <div class="add-condition">
        <select class="add-condition" @change=${this._onAddCondition}>
          <option value="">${d(this.hass,"ui.add_condition","+ Add condition\u2026")}</option>
          ${e.map(r=>l`<option value=${r.name} ?disabled=${this._conditionDisabled(r.name)}>${Y(this.hass,r.name)}</option>`)}
        </select>
      </div>
    `}_renderAddConditionHaForm(e){let r=d(this.hass,"ui.add_condition","+ Add condition\u2026"),i=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_CONDITION_PLACEHOLDER,label:r},...e.map(s=>({value:s.name,label:Y(this.hass,s.name),disabled:this._conditionDisabled(s.name)}))]}}}];return l`
      <div class="add-condition">
        <ha-form
          .hass=${this.hass}
          .schema=${i}
          .data=${{add:S._ADD_CONDITION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddConditionHaForm}
        ></ha-form>
      </div>
    `}_addActionSlot(e){if(!this._draft||!e||this._open!==null&&!this._tryCloseCurrent())return;let r={service:e,entity_ids:[],params:{}},i=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,r]},this._open={kind:"action",idx:i},this._showError=!1}_actionOptionLabel(e){return e.label?.trim()?e.label:e.id}_renderAddAction(){return this.availableActions.length===0?l`
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
    `}_renderAddActionHaForm(){let e=d(this.hass,"ui.add_action","+ Add action\u2026"),r=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_ACTION_PLACEHOLDER,label:e},...this.availableActions.map(i=>({value:i.id,label:this._actionOptionLabel(i)}))]}}}];return l`
      <div class="add-action">
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{add:S._ADD_ACTION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddActionHaForm}
        ></ha-form>
      </div>
    `}_updateActionAt(e,r){if(!this._draft)return;let i=this._draft.actions.map((s,a)=>a===e?r(s):s);this._draft={...this._draft,actions:i}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((r,i)=>i!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,r){this._updateActionAt(e,i=>({...i,entity_ids:r}))}_setActionParams(e,r){this._updateActionAt(e,i=>({...i,params:r}))}_onTargetModeChanged(e,r){this._serviceHasTarget.get(e)!==r&&(this._serviceHasTarget=new Map(this._serviceHasTarget).set(e,r))}_setReapplyOverride(e,r){let i=Yn(r);this._updateActionAt(e,s=>{if(i===null){let{reapply_seconds:a,...o}=s;return o}return{...s,reapply_seconds:i}})}_renderReapplyOverride(e,r,i){if(i<=0)return l``;let s="reapply_seconds"in e?String(e.reapply_seconds):"";return l`
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
    `}_renderActionRow(e,r){let i=this.availableActions.find(p=>p.id===e.service),s=i?.reapply_seconds??0,a=this._isOpen({kind:"action",idx:r}),o=qn(e,{hass:this.hass,exposedActions:this.availableActions,schemas:this.schemas}),c=Gn(e,s),h=s>0&&c>0;return l`
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
              .excludeEntities=${Nn(this._draft?.actions??[],r)}
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
    `}_save(){if(!this._draft)return;if(this._nameError()!==null){this._showError=!0,this._open={kind:"name"};return}for(let r of Object.keys(this._draft.when))if(this._draft.when[r]!=null&&this._validationError({kind:"condition",id:r})!==null){this._showError=!0,this._open={kind:"condition",id:r};return}for(let r=0;r<this._draft.actions.length;r++)if(this._validationError({kind:"action",idx:r})!==null){this._showError=!0,this._open={kind:"action",idx:r};return}let e=Object.fromEntries(Object.entries(this._draft.when).filter(([,r])=>r!=null));this.dispatchEvent(new CustomEvent("save-scene",{detail:{scene:{...this._draft,when:e},scope:this._scope},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-scene",{bubbles:!0,composed:!0}))}render(){if(!this._draft)return l``;let e=this._visibleConditions();return l`
      <div class="modal" @click=${this._onModalClick}>
        <div class="content">
          ${this._renderNameSlot()}
          ${this._renderCategorySlot()}
          ${this._renderDestinationSlot()}

          <h3>${d(this.hass,"ui.when_heading","When")}</h3>
          ${e.map(r=>this._renderConditionRow(r))}
          ${this._renderAddCondition()}

          <h3>${d(this.hass,"ui.actions_heading","Actions")}</h3>
          ${this._draft.actions.map((r,i)=>this._renderActionRow(r,i))}
          ${this._renderAddAction()}
        </div>

        <div class="actions-bar">
          ${this.saveError?l`<div class="error save-error">${this.saveError}</div>`:""}
          <button class="secondary" @click=${this._cancel}>${d(this.hass,"ui.cancel","Cancel")}</button>
          <button class="primary" @click=${this._save}>${d(this.hass,"ui.save_scene","Save scene")}</button>
        </div>
      </div>
    `}};S.styles=[sr,v`
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
  `],S._ADD_CONDITION_PLACEHOLDER="__add_condition__",S._ADD_ACTION_PLACEHOLDER="__add_action__",u([m({type:Boolean,reflect:!0})],S.prototype,"open",2),u([m({attribute:!1})],S.prototype,"scene",2),u([m({attribute:!1})],S.prototype,"conditions",2),u([m({attribute:!1})],S.prototype,"periods",2),u([m({attribute:!1})],S.prototype,"luxRanges",2),u([m({attribute:!1})],S.prototype,"dayConfig",2),u([m({attribute:!1})],S.prototype,"weatherConfig",2),u([m({attribute:!1})],S.prototype,"availableActions",2),u([m({attribute:!1})],S.prototype,"categories",2),u([m({attribute:!1})],S.prototype,"schemas",2),u([m({attribute:!1})],S.prototype,"hass",2),u([m({attribute:!1})],S.prototype,"scope",2),u([m({attribute:!1})],S.prototype,"scopes",2),u([m({attribute:!1})],S.prototype,"takenNames",2),u([m({attribute:!1})],S.prototype,"saveError",2),u([g()],S.prototype,"_draft",2),u([g()],S.prototype,"_scope",2),u([g()],S.prototype,"_open",2),u([g()],S.prototype,"_showError",2),u([g()],S.prototype,"_addOrder",2),u([g()],S.prototype,"_serviceHasTarget",2),S=u([x("ambience-scene-editor")],S);function Od(t,n,e){return n==="time_of_day"?ye(t,e,{}):n==="weather"?Ze(t,e):e}var Lr=v`
  .eval { border: 1px solid var(--divider-color, #444); border-radius: 8px; padding: 0.7rem 0.9rem; }
  .eval .top { display: flex; align-items: baseline; gap: 0.5rem; }
  .eval .cause { flex: 1; font-family: monospace; font-size: 0.85rem; }
  .eval .ts { color: var(--secondary-text-color, #888); font-size: 0.75rem; }
  .outcome { font-size: 0.72rem; text-transform: uppercase; padding: 1px 7px; border-radius: 4px;
    background: var(--secondary-background-color, #333); color: var(--secondary-text-color, #aaa); }
  .outcome.acted { background: var(--success-color, #4caf50); color: #fff; }
  .outcome.reapplied { background: var(--info-color, #2196f3); color: #fff; }
  .outcome.debounced { background: var(--warning-color, #ff9800); color: #fff; }
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
  .scenes { font-family: monospace; font-size: 0.8rem; line-height: 1.7; }
  .scene.won { color: var(--success-color, #4caf50); }
  .scene.skipped { opacity: 0.5; }
  .pred.pass { color: var(--success-color, #4caf50); }
  .pred.fail { color: var(--error-color, #e57373); }
  .pred .dim { color: var(--secondary-text-color, #888); }
  .action-block { font-family: monospace; font-size: 0.8rem; line-height: 1.6; margin-bottom: 0.3rem; }
  .action-head { color: var(--primary-text-color, #ddd); }
  .action-block .entity { padding-left: 1rem; color: var(--secondary-text-color, #aaa); }
`;function Fd(t){return t.kind==="entity"?`${t.entity_id} ${t.old} \u2192 ${t.new}`:t.detail?`${ce(t.kind)} ${t.detail}`:ce(t.kind)}function Id(t,n,e){let r=Object.entries(t.params??{}).filter(([,s])=>s!=null&&s!=="").map(([s,a])=>`${Ct(s,t.service,e)}: ${we(n,a)}`).join(", "),i=vt(t.service);return r?`${i} \xB7 ${r}`:i}function Md(t){return t.reduce((n,e)=>n+(e.entity_ids?.length??0),0)}function jd(t,n){let e=t.index+1;return t.disabled?l`<div class="scene disabled">Scene #${e} ${t.name??"\u2014"}: disabled</div>`:t.evaluated?l`
    <div class="scene ${t.matched?"won":""}">Scene #${e} ${t.name??"\u2014"}: ${t.matched?"WON":"no"}</div>
    ${t.predicates.map(r=>l`
        <div class="pred ${r.passed?"pass":"fail"}" style="padding-left:1rem">
          ${r.passed?"\u2713":"\u2717"} ${Y(n,r.condition_key)}${r.detail?l` <span class="dim">[${Od(n,r.condition_key,r.detail)}]</span>`:k}
        </div>`)}
  `:l`<div class="scene skipped">Scene #${e} ${t.name??"\u2014"}: not evaluated</div>`}function Rr(t,n,e,r,i){let s=t.actions.map(c=>vt(c.service)).join(", "),a=Md(t.actions),o=t.explanation!==null||t.actions.length>0;return l`
    <div class="eval">
      <div class="top">
        <span class="outcome ${t.outcome}">${t.outcome.replace(/_/g," ")}</span>
        <span class="cause">${Fd(t.cause)}</span>
        <span class="ts">${t.timestamp?new Date(t.timestamp).toLocaleTimeString():""}</span>
      </div>
      ${t.winner_name?l`<div class="won">Won: <span class="name">${t.winner_name}</span></div>`:k}
      ${t.actions.length?l`<div class="action-summary">→ ${s}
            ${a?l`<span class="n">· ${a} ${a===1?"entity":"entities"}</span>`:k}</div>`:k}
      ${o?l`<button class="why-toggle" @click=${e}>
            ${n?"\u25BE Hide details":t.explanation?t.winner_name?`\u25B8 Why this scene won (${t.explanation.scenes.length} scenes)`:`\u25B8 Why nothing matched (${t.explanation.scenes.length} scenes)`:"\u25B8 Details"}
          </button>`:k}
      ${n?zd(t,r,i):k}
    </div>
  `}function zd(t,n,e){return l`
    <div class="why">
      ${t.explanation?l`<div class="section">
            <div class="section-title">Scene evaluation</div>
            <div class="scenes">${t.explanation.scenes.map(r=>jd(r,n))}</div>
          </div>`:k}
      ${t.actions.length?l`<div class="section">
            <div class="section-title">Actions taken</div>
            ${t.actions.map(r=>l`<div class="action-block">
                <div class="action-head">${Id(r,n,e)}</div>
                ${(r.entity_ids??[]).map(i=>l`<div class="entity">${Bn(n,i)}</div>`)}
              </div>`)}
          </div>`:k}
    </div>
  `}var z=class extends b{constructor(){super(...arguments);this.category="";this.categoryName=null;this.open=!1;this._records=[];this._schemas={};this._expanded=new Set;this._loading=!0;this._error="";this._hasNew=!1}connectedCallback(){super.connectedCallback(),this._poll=setInterval(()=>this._checkNew(),5e3)}disconnectedCallback(){super.disconnectedCallback(),this._poll&&clearInterval(this._poll)}updated(e){this.open&&(e.has("open")||e.has("category")||e.has("scope"))&&this._load()}_mine(e){return e.filter(r=>r.scope_kind===this.scope.scope_kind&&r.scope_id===this.scope.scope_id&&r.category===this.category)}async _load(){this._error="",this._loading=!0,this._hasNew=!1,this._expanded=new Set;try{let e=await Xr(this.hass);if(!this.isConnected)return;this._records=this._mine(e),this._loading=!1,this._loadSchemas()}catch(e){this._error=e.message||String(e),this._loading=!1}}async _loadSchemas(){let e=[...new Set(this._records.flatMap(s=>s.actions.map(a=>a.service)))].filter(s=>!(s in this._schemas));if(e.length===0)return;let r=await Promise.all(e.map(async s=>{try{return[s,await be(this.hass,s)]}catch{return null}}));if(!this.isConnected)return;let i={...this._schemas};for(let s of r)s&&(i[s[0]]=s[1]);this._schemas=i}async _checkNew(){if(!(!this.open||!this.isConnected||document.visibilityState!=="visible"))try{let r=this._mine(await Xr(this.hass))[0]?.timestamp??null,i=this._records[0]?.timestamp??null;r&&(!i||r>i)&&(this._hasNew=!0)}catch{}}_toggle(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):r.add(e),this._expanded=r}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){if(!this.open)return k;let e=this.categoryName??this.category;return l`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>${e}</h3>
          <button class="refresh ${this._hasNew?"has-new":""}" @click=${()=>this._load()}>
            ${this._hasNew?"\u25CF New traces \u2014 refresh":"Refresh"}
          </button>
          <button class="close" @click=${this._onClose} aria-label="Close">✕</button>
        </div>
        <div class="body">
          ${this._error?l`<p class="error">${this._error}</p>`:this._loading?l`<p class="empty">Loading…</p>`:this._records.length===0?l`<p class="empty">No traces for this category yet.</p>`:l`<div class="list">${this._records.map((r,i)=>{let s=`${r.event_id??i}|${r.timestamp??""}`;return Rr(r,this._expanded.has(s),()=>this._toggle(s),this.hass,this._schemas)})}</div>`}
        </div>
      </div>
    `}};z.styles=[Lr,v`
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
    `],u([m({attribute:!1})],z.prototype,"hass",2),u([m({attribute:!1})],z.prototype,"scope",2),u([m()],z.prototype,"category",2),u([m()],z.prototype,"categoryName",2),u([m({type:Boolean,reflect:!0})],z.prototype,"open",2),u([g()],z.prototype,"_records",2),u([g()],z.prototype,"_schemas",2),u([g()],z.prototype,"_expanded",2),u([g()],z.prototype,"_loading",2),u([g()],z.prototype,"_error",2),u([g()],z.prototype,"_hasNew",2),z=u([x("ambience-traces-modal")],z);var Wd={time:"mdi:clock-outline",sun:"mdi:weather-sunny",reapply:"mdi:refresh"},K=class extends b{constructor(){super(...arguments);this.scopeName="";this.scenes=[];this.open=!1;this._triggers=[];this._opaque=!1;this._loading=!1;this._error=""}willUpdate(e){super.willUpdate?.(e),this.open&&(e.has("open")||e.has("scenes")||e.has("scope"))&&this._load()}get _scopeId(){return this.scope.kind==="house"?null:this.scope.id}async _load(){this._loading=!0,this._error="";try{let e=await hn(this.hass,this.scope.kind,this._scopeId);this._triggers=e.triggers,this._opaque=e.opaque}catch(e){this._error=e.message||String(e)}finally{this._loading=!1}}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_openMoreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_entityName(e){return O(this.hass,e)}get _sortedTriggers(){let e=s=>this._entityName(s.entity_id).toLowerCase(),r=this._triggers.filter(s=>s.kind==="entity").sort((s,a)=>e(s).localeCompare(e(a))),i=this._triggers.filter(s=>s.kind!=="entity");return[...r,...i]}_sunPart(e){let r=ve(this.hass,e.anchor);return e.offset===0?r:`${r} ${e.offset>0?"+":""}${e.offset} min`}_rowContent(e){switch(e.kind){case"entity":return{title:this._entityName(e.entity_id),detail:e.entity_id};case"time":{let r=e.clocks.map(i=>`${String(i.hour).padStart(2,"0")}:${String(i.minute).padStart(2,"0")}`);return e.date_rollover&&r.push(d(this.hass,"ui.auto_trigger_date_rollover","Local midnight (date rollover)")),e.has_time&&r.push(d(this.hass,"ui.auto_trigger_periodic","periodic re-check")),{title:d(this.hass,"ui.auto_trigger_group_time","Time"),detail:r.join(", ")}}case"sun":return{title:d(this.hass,"ui.auto_trigger_group_sun","Sun"),detail:e.suns.map(r=>this._sunPart(r)).join(", ")};case"reapply":return{title:d(this.hass,"ui.auto_trigger_reapply","Re-apply"),detail:`${d(this.hass,"ui.auto_trigger_every","every")} ${Qn(e.interval_seconds)}`}}}_renderRowIcon(e){return e.kind==="entity"?Et(this.hass,e.entity_id):l`<ha-icon
      class="row-icon"
      icon=${Wd[e.kind]??ii}
    ></ha-icon>`}_moreInfoEntity(e){return e.kind==="entity"?e.entity_id:e.kind==="sun"&&this.hass?.states?.["sun.sun"]?"sun.sun":null}_renderRow(e){let{title:r,detail:i}=this._rowContent(e),s=this._moreInfoEntity(e);return l`
      <li
        data-test=${`trigger-ro-${e.key}`}
        class=${s?"clickable":""}
        role=${s?"button":k}
        tabindex=${s?"0":k}
        @click=${s?()=>this._openMoreInfo(s):k}
        @keydown=${s?a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),this._openMoreInfo(s))}:k}
      >
        ${this._renderRowIcon(e)}
        <div class="row-text">
          <div class="row-title">${r}</div>
          ${i?l`<div class="row-detail">${i}</div>`:""}
        </div>
      </li>
    `}render(){if(!this.open)return k;let e=d(this.hass,"ui.auto_triggers_section","Auto-triggers");return l`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>${e}${this.scopeName?` \u2014 ${this.scopeName}`:""}</h3>
          <button class="close" @click=${this._close} aria-label="Close">✕</button>
        </div>
        <div class="body">${this._renderBody()}</div>
      </div>
    `}_renderBody(){return this._error?l`<div class="error">${this._error}</div>`:this._loading&&this._triggers.length===0?l`<div class="empty">${d(this.hass,"ui.loading","Loading\u2026")}</div>`:l`
      ${this._opaque?l`<div class="note">
            ${d(this.hass,"ui.auto_triggers_opaque_note","A script scene is opaque \u2014 some watches may be missing. Declare them in the scene's Triggers field.")}
          </div>`:""}
      ${this._triggers.length===0?l`<div class="empty">
            ${d(this.hass,"ui.auto_triggers_none","No automatic triggers.")}
          </div>`:l`<ul>
            ${this._sortedTriggers.map(e=>this._renderRow(e))}
          </ul>`}
    `}};K.styles=v`
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
  `,u([m({attribute:!1})],K.prototype,"hass",2),u([m({attribute:!1})],K.prototype,"scope",2),u([m()],K.prototype,"scopeName",2),u([m({attribute:!1})],K.prototype,"scenes",2),u([m({type:Boolean,reflect:!0})],K.prototype,"open",2),u([g()],K.prototype,"_triggers",2),u([g()],K.prototype,"_opaque",2),u([g()],K.prototype,"_loading",2),u([g()],K.prototype,"_error",2),K=u([x("ambience-auto-triggers-modal")],K);var Ud={not_home:"Away",home:"Home"};function Js(t){return Ud[t]??ce(t)}function Xs(t){return{state:t.live_state??"",attributes:Object.fromEntries(t.attributes.map(n=>[n.name,n.live_value==null?"":String(n.live_value)])),for:{h:0,m:0,s:0}}}function Pr(t){return String(t).padStart(2,"0")}function Zs(t){return`${t.getFullYear()}-${Pr(t.getMonth()+1)}-${Pr(t.getDate())}`}function ea(t){return`${Pr(t.getHours())}:${Pr(t.getMinutes())}`}var A=class extends b{constructor(){super(...arguments);this.category="";this.categoryName=null;this.open=!1;this._knobs=[];this._hasTime=!1;this._loading=!0;this._error="";this._values={};this._verdicts={};this._date="";this._time="";this._result=null;this._expanded=!1}updated(e){this.open&&(e.has("open")||e.has("category")||e.has("scope"))&&this._load()}_vkey(e){return`${e.condition}:${e.key}`}async _load(){this._error="",this._loading=!0,this._result=null,this._expanded=!1;let e=new Date;this._date=Zs(e),this._time=ea(e);try{let r=await Sn(this.hass,this.scope,this.category);if(!this.isConnected)return;this._knobs=r.knobs,this._hasTime=r.has_time;let i={},s={};for(let a of r.knobs)a.kind==="entity"?i[a.entity_id]=Xs(a):s[this._vkey(a)]=a.live_value;this._values=i,this._verdicts=s,this._loading=!1}catch(r){this._error=r.message||String(r),this._loading=!1}}_setState(e,r){this._values={...this._values,[e]:{...this._values[e],state:r}}}_setAttr(e,r,i){let s=this._values[e];this._values={...this._values,[e]:{...s,attributes:{...s.attributes,[r]:i}}}}_setFor(e,r,i){let s=this._values[e],a=Number.isFinite(i)&&i>0?Math.trunc(i):0;this._values={...this._values,[e]:{...s,for:{...s.for,[r]:a}}}}_setVerdict(e,r){this._verdicts={...this._verdicts,[e]:r}}_resetWhen(){let e=new Date;this._date=Zs(e),this._time=ea(e)}_resetEntity(e){this._values={...this._values,[e.entity_id]:Xs(e)}}_resetVerdict(e){this._verdicts={...this._verdicts,[this._vkey(e)]:e.live_value}}_buildOverrides(){let e={};for(let r of this._knobs){if(r.kind!=="entity")continue;let i=this._values[r.entity_id];if(!i)continue;let s={};for(let o of r.attributes){let c=i.attributes[o.name];if(!(c===void 0||c===""))if(o.control==="number"){let h=Number(c);Number.isNaN(h)||(s[o.name]=h)}else s[o.name]=c}let a={attributes:s};i.state!==""&&(a.state=i.state),(i.for.h||i.for.m||i.for.s)&&(a.for=i.for),(a.state!==void 0||a.for!==void 0||Object.keys(s).length>0)&&(e[r.entity_id]=a)}return e}_buildVerdicts(){let e={};for(let r of this._knobs)r.kind==="verdict"&&(e[r.condition]||(e[r.condition]={}),e[r.condition][r.key]=this._verdicts[this._vkey(r)]??r.live_value);return e}async _run(){this._error="";let e=new Date(`${this._date}T${this._time}`).toISOString();try{this._result=await Cn(this.hass,this.scope,this.category,e,this._buildOverrides(),this._buildVerdicts()),this._expanded=!1}catch(r){this._error=r.message||String(r)}}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?l`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>Simulate · ${this.categoryName??this.category}</h3>
          <button class="close" @click=${this._onClose} aria-label="Close">✕</button>
        </div>
        <div class="body">
          ${this._error?l`<p class="error">${this._error}</p>`:k}
          ${this._loading?l`<p>Loading…</p>`:l`
            ${this._hasTime?l`
              <p class="sec-title">When</p>
              <div class="when">
                <input type="date" .value=${this._date}
                  @change=${e=>this._date=e.target.value} />
                <input type="time" .value=${this._time}
                  @change=${e=>this._time=e.target.value} />
                <button class="reset" title="Reset to now" aria-label="Reset to now"
                  @click=${()=>this._resetWhen()}>↺</button>
                <span class="hint">drives sun, time-of-day, weekday &amp; workday</span>
              </div>`:k}
            ${this._knobs.length?l`
              <p class="sec-title">Inputs this category depends on</p>
              ${this._knobs.map(e=>e.kind==="entity"?this._renderEntity(e):this._renderVerdict(e))}`:k}
            <div class="run-row"><button class="runbtn" @click=${()=>void this._run()}>Simulate ▸</button></div>
            ${this._result?l`<div class="result">${Rr(this._result,this._expanded,()=>this._expanded=!this._expanded)}</div>`:k}
          `}
        </div>
      </div>`:k}_renderEntity(e){let r=this._values[e.entity_id],i=e.attributes.length>0;return l`
      <div class="row ${i?"has-attrs":""}">
        ${Et(this.hass,e.entity_id)}
        <div class="row-text">
          <div class="row-title">${O(this.hass,e.entity_id)}</div>
          <div class="row-detail">${e.entity_id}</div>
        </div>
        <div class="row-ctrl">
          ${this._renderControl(e,r?.state??"")}
          ${this._renderFor(e,r?.for??{h:0,m:0,s:0})}
          <button class="reset" data-reset=${e.entity_id} title="Reset to live"
            @click=${()=>this._resetEntity(e)}>↺</button>
        </div>
      </div>
      ${e.attributes.map((s,a)=>l`
        <div class="row attr ${a===e.attributes.length-1?"last-attr":""}">
          <div class="row-text"><div class="row-title">${Js(s.name)}</div></div>
          <div class="row-ctrl">
            <input class=${s.control==="number"?"num":""}
              type=${s.control==="number"?"number":"text"}
              data-attr=${`${e.entity_id}:${s.name}`}
              .value=${r?.attributes[s.name]??""}
              @input=${o=>this._setAttr(e.entity_id,s.name,o.target.value)} />
            <button class="reset" title="Reset to live"
              @click=${()=>this._resetEntity(e)}>↺</button>
          </div>
        </div>`)}
    `}_renderControl(e,r){if(e.control==="select")return l`<select data-entity=${e.entity_id} .value=${r}
        @change=${s=>this._setState(e.entity_id,s.target.value)}>
        ${(e.options??[r]).map(s=>l`<option value=${s} ?selected=${s===r}>${Js(s)}</option>`)}
      </select>`;let i=e.control==="number"?"number":"text";return l`<input class=${e.control==="number"?"num":""} type=${i} data-entity=${e.entity_id}
      .value=${r}
      @input=${s=>this._setState(e.entity_id,s.target.value)} />`}_renderFor(e,r){let i={h:"hours",m:"minutes",s:"seconds"},s=O(this.hass,e.entity_id),a=o=>l`<input class="for-num" type="number" min="0"
      aria-label=${`${s} \u2014 held for, ${i[o]}`}
      data-for=${`${e.entity_id}:${o}`} .value=${String(r[o])}
      @change=${c=>this._setFor(e.entity_id,o,Number(c.target.value))} />`;return l`<span class="for-ctrl" title="How long it has held this state (h:m:s)">
      <span class="for-label">For</span>${a("h")}<span>:</span>${a("m")}<span>:</span>${a("s")}
    </span>`}_renderVerdict(e){let r=this._vkey(e),i=this._verdicts[r]??e.live_value,s=e.entity_id?O(this.hass,e.entity_id):e.label,a=e.entity_id?Et(this.hass,e.entity_id):l`<ha-icon class="row-icon" icon="mdi:code-braces"></ha-icon>`;return l`
      <div class="row">
        ${a}
        <div class="row-text">
          <div class="row-title">${s}</div>
          ${e.entity_id?l`<div class="row-detail">${e.entity_id}</div>`:k}
        </div>
        <div class="row-ctrl">
          <select data-verdict=${r} .value=${String(i)}
            @change=${o=>this._setVerdict(r,o.target.value==="true")}>
            <option value="true" ?selected=${i}>True</option>
            <option value="false" ?selected=${!i}>False</option>
          </select>
          <button class="reset" title="Reset to live" @click=${()=>this._resetVerdict(e)}>↺</button>
        </div>
      </div>`}};A.styles=[Lr,On,v`
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
      .run-row { display: flex; justify-content: flex-end; margin-top: 0.6rem; }
      .error { color: var(--error-color, #c00); font-size: 0.9rem; }
      .result { margin-top: 1rem; }
    `],u([m({attribute:!1})],A.prototype,"hass",2),u([m({attribute:!1})],A.prototype,"scope",2),u([m()],A.prototype,"category",2),u([m()],A.prototype,"categoryName",2),u([m({type:Boolean,reflect:!0})],A.prototype,"open",2),u([g()],A.prototype,"_knobs",2),u([g()],A.prototype,"_hasTime",2),u([g()],A.prototype,"_loading",2),u([g()],A.prototype,"_error",2),u([g()],A.prototype,"_values",2),u([g()],A.prototype,"_verdicts",2),u([g()],A.prototype,"_date",2),u([g()],A.prototype,"_time",2),u([g()],A.prototype,"_result",2),u([g()],A.prototype,"_expanded",2),A=u([x("ambience-simulator-modal")],A);function Bd(t){let n=Math.floor(t/3600),e=Math.floor(t%3600/60),r=t%60,i=s=>String(s).padStart(2,"0");return n>0?`${n}:${i(e)}:${i(r)}`:`${e}:${i(r)}`}function Ke(t){return t.enabled===!1?{scenes:t.scenes??[],enabled:!1}:{scenes:t.scenes??[]}}var Si=1024;function qd(t,n,e){if(t!==void 0&&n!==void 0)return Math.floor((t+n)/2);let r=e.map(i=>i.priority??0);return t===void 0&&n===void 0?Si:t===void 0?Math.max(...r)+Si:Math.min(...r)-Si}var T=class extends b{constructor(){super(...arguments);this._areas=[];this._floors=[];this._areaConfigs=new Map;this._floorConfigs=new Map;this._house={scenes:[]};this._switchEntityIds=new Map;this._conditions=[];this._actions=[];this._categories=[];this._schemas={};this._expanded=new Set(rn());this._error="";this._staticLoaded=!1;this._conditionsHintDismissed=!1;this._editing=null;this._sceneEditorError="";this._savingScene=!1;this._viewingTraces=null;this._viewingSimulator=null;this._autoTriggers=null;this.filterCategory="";this._onExposedActionsChanged=async()=>{try{let e=await bt(this.hass);if(!this.isConnected)return;this._actions=e,await this._refreshSchemas(e)}catch{}};this._onCategoriesChanged=async()=>{try{let e=await Me(this.hass);if(!this.isConnected)return;this._categories=e}catch{}};this._onConditionsChanged=async()=>{try{let[e,r]=await Promise.all([xt(this.hass),wt(this.hass)]);if(!this.isConnected)return;this._dayConfig=e,this._weatherConfig=r}catch{}}}async _refreshSchemas(e){let r=await Promise.all(e.map(async s=>{try{let a=await be(this.hass,s.id);return[s.id,a]}catch{return[s.id,null]}}));if(!this.isConnected)return;let i={};for(let[s,a]of r)a&&(i[s]=a);this._schemas=i}async connectedCallback(){super.connectedCallback(),this._conditionsHintDismissed=sn(),window.addEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("ambience-conditions-changed",this._onConditionsChanged),this._tick=setInterval(()=>{for(let e of this._switchEntityIds.values())if(this.hass.states?.[e]?.state==="off"){this.requestUpdate();return}},1e3),await this._loadStatic(),await Promise.all([this._refreshAreas(),this._refreshFloors(),this._refreshHouse(),this._refreshSwitches()]),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._tick&&clearInterval(this._tick),this._tick=void 0,window.removeEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("ambience-conditions-changed",this._onConditionsChanged),this._unsubArea?.(),this._unsubArea=void 0,this._unsubFloor?.(),this._unsubFloor=void 0}async _loadStatic(){try{let[e,r,i,s,a,o,c]=await Promise.all([tr(this.hass),bt(this.hass),rr(this.hass),ir(this.hass),xt(this.hass),wt(this.hass),Me(this.hass)]);if(!this.isConnected)return;this._conditions=e,this._actions=r,this._periods=i,this._luxRanges=s,this._dayConfig=a,this._weatherConfig=o,this._categories=c,this._staticLoaded=!0,await this._refreshSchemas(r)}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await on(this.hass),r=this._areaConfigs,i=new Map;if(await Promise.all(e.map(async s=>{let a=r.get(s.area_id);if(a){i.set(s.area_id,a);return}i.set(s.area_id,Ke(await qr(this.hass,s.area_id)))})),!this.isConnected)return;this._areas=e,this._areaConfigs=i}catch(e){this._error=e.message||String(e)}}async _refreshFloors(){try{let e=(await dn(this.hass)).slice().sort((s,a)=>s.name.localeCompare(a.name)),r=this._floorConfigs,i=new Map;if(await Promise.all(e.map(async s=>{let a=r.get(s.floor_id);if(a){i.set(s.floor_id,a);return}i.set(s.floor_id,Ke(await Vr(this.hass,s.floor_id)))})),!this.isConnected)return;this._floors=e,this._floorConfigs=i}catch(e){this._error=e.message||String(e)}}async _refreshHouse(){try{let e=Ke(await Kr(this.hass));if(!this.isConnected)return;this._house=e}catch(e){this._error=e.message||String(e)}}async _refreshSwitches(){try{let e=await wn(this.hass);if(!this.isConnected)return;this._switchEntityIds=new Map(e.map(r=>{let i=r.scope_kind==="house"?{kind:"house"}:{kind:r.scope_kind,id:r.scope_id};return[W(i),r.entity_id]}))}catch(e){this._error=e.message||String(e)}}async _subscribe(){let e=this.hass.connection.subscribeEvents(a=>{if(a.data.action==="remove"){let o=a.data.area_id,c=new Set(this._expanded);c.delete(`area:${o}`),this._setExpanded(c),this._editing?.scope.kind==="area"&&this._editing.scope.id===o&&(this._editing=null)}this._refreshAreas(),a.data.action!=="update"&&this._refreshSwitches()},"area_registry_updated"),r=this.hass.connection.subscribeEvents(a=>{if(a.data.action==="remove"){let o=a.data.floor_id,c=new Set(this._expanded);c.delete(`floor:${o}`),this._setExpanded(c),this._editing?.scope.kind==="floor"&&this._editing.scope.id===o&&(this._editing=null)}this._refreshFloors(),a.data.action!=="update"&&this._refreshSwitches()},"floor_registry_updated"),[i,s]=await Promise.all([e,r]);this.isConnected?(this._unsubArea=i,this._unsubFloor=s):(i(),s())}_getConfig(e){return e.kind==="house"?this._house:e.kind==="area"?this._areaConfigs.get(e.id):this._floorConfigs.get(e.id)}_setConfig(e,r){if(e.kind==="house")this._house=r;else if(e.kind==="area"){let i=new Map(this._areaConfigs);i.set(e.id,r),this._areaConfigs=i}else{let i=new Map(this._floorConfigs);i.set(e.id,r),this._floorConfigs=i}}async _mutate(e,r){let i=this._getConfig(e);this._setConfig(e,r),this._error="";try{let s;return e.kind==="house"?s=await un(this.hass,r):e.kind==="area"?s=await ln(this.hass,e.id,r):s=await cn(this.hass,e.id,r),this._setConfig(e,Ke(s.config)),!0}catch(s){return i&&this._setConfig(e,i),this._error=s.message||String(s),!1}}_setExpanded(e){this._expanded=e,nn([...e])}_toggleExpand(e){let r=W(e),i=new Set(this._expanded);i.has(r)?i.delete(r):i.add(r),this._setExpanded(i)}_addScene(e,r){let i=this._getConfig(e);i&&(this._sceneEditorError="",this._editing={scope:e,index:i.scenes.length,isNew:!0,category:r})}_editScene(e,r){this._sceneEditorError="",this._editing={scope:e,index:r.detail.index,isNew:!1}}_duplicateScene(e,r){let i=this._getConfig(e);if(!i)return;let s=i.scenes[r.detail.index];if(!s)return;let a=$t(JSON.parse(JSON.stringify(s)));this._sceneEditorError="",this._editing={scope:e,index:i.scenes.length,isNew:!0,seed:a}}_deleteScene(e,r){let i=this._getConfig(e);if(!i)return;let s=i.scenes.filter((a,o)=>o!==r.detail.index);this._mutate(e,{...i,scenes:s})}_reorderScenes(e,r){let i=this._getConfig(e);if(!i)return;let{from:s,to:a}=r.detail,o=i.scenes[s];if(!o||i.scenes[a]?.category!==o.category)return;let c=[...i.scenes];c.splice(s,1),c.splice(a,0,o);let h=E=>c[E]&&c[E].category===o.category,p=a-1;for(;p>=0&&!h(p);)p--;let f=a+1;for(;f<c.length&&!h(f);)f++;let _=p>=0?c[p].priority:void 0,y=f<c.length?c[f].priority:void 0,$=qd(_,y,i.scenes.filter(E=>E.category===o.category));c[a]={...o,priority:$,pinned:!0},this._mutate(e,{...i,scenes:c})}_unpinScene(e,r){let i=this._getConfig(e);if(!i)return;let s=i.scenes.map((a,o)=>o===r.detail.index?{...a,pinned:!1}:a);this._mutate(e,{...i,scenes:s})}_toggleSceneEnabled(e,r){let i=this._getConfig(e);if(!i)return;let s=i.scenes.map((a,o)=>{if(o!==r.detail.index)return a;if(r.detail.enabled){let c={...a};return delete c.enabled,c}return{...a,enabled:!1}});this._mutate(e,{...i,scenes:s})}async _saveScene(e){if(this._savingScene)return;let r=this._editing;if(!r)return;let{scene:i,scope:s}=e.detail;this._savingScene=!0,this._sceneEditorError="";try{if(W(s)===W(r.scope)){let h=this._getConfig(s);if(!h)return;let p=[...h.scenes];r.isNew?p.push(i):p[r.index]=i,await this._mutate(s,{...h,scenes:p})?this._editing=null:this._sceneEditorError=this._takeError();return}let a=$t(i),o=this._getConfig(s);if(!o)return;if(!await this._mutate(s,{...o,scenes:[...o.scenes,a]})){this._sceneEditorError=this._takeError();return}if(this._editing=null,!r.isNew){let h=this._getConfig(r.scope);if(h){let p=h.scenes.filter((f,_)=>_!==r.index);await this._mutate(r.scope,{...h,scenes:p})}}}finally{this._savingScene=!1}}_takeError(){let e=this._error;return this._error="",e}async _callApi(e){this._error="";try{await e()}catch(r){this._error=r.message||String(r)}}_applyScenes(e,r){return this._callApi(()=>fn(this.hass,e,r))}_runSceneActions(e,r){return this._callApi(()=>gn(this.hass,e,r.detail.index))}_cancelScene(){this._sceneEditorError="",this._editing=null}_onScopeMenu(e,r,i,s){s==="run"?this._applyScenes(e):s==="auto"&&(this._autoTriggers={scope:e,name:r})}_showTraces(e,r){let i=this._categories.find(s=>s.id===r);this._viewingTraces={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:r,categoryName:i?.name??null}}_showSimulator(e,r){let i=this._categories.find(s=>s.id===r);this._viewingSimulator={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:r,categoryName:i?.name??null}}_defaultCategoryId(){return this.filterCategory!==""?this.filterCategory:[...this._categories].sort((r,i)=>r.name.localeCompare(i.name))[0]?.id??""}get _editingScene(){return this._editing?this._editing.seed?this._editing.seed:this._editing.isNew?{when:{},actions:[],category:this._editing.category??this._defaultCategoryId()}:this._getConfig(this._editing.scope)?.scenes[this._editing.index]??null:null}get _editorConditions(){return this._editing?this._conditions.slice().sort((e,r)=>r.priority-e.priority):[]}get _takenSceneNames(){let e=new Map,r=this._editing,i=(s,a)=>{if(!a)return;let o=!!r&&!r.isNew&&W(r.scope)===W(s);a.scenes.forEach((c,h)=>{if(o&&h===r.index)return;let p=c.name?.trim().toLowerCase();if(!p)return;let f=dr(s,c.category),_=e.get(f);_||(_=new Set,e.set(f,_)),_.add(p)})};i({kind:"house"},this._house);for(let s of this._floors)i({kind:"floor",id:s.floor_id},this._floorConfigs.get(s.floor_id));for(let s of this._areas)i({kind:"area",id:s.area_id},this._areaConfigs.get(s.area_id));return e}get _scopeOptions(){return[{scope:{kind:"house"},label:d(this.hass,"ui.scope_house","House")},...this._floors.map(e=>({scope:{kind:"floor",id:e.floor_id},label:e.name})),...this._areas.map(e=>({scope:{kind:"area",id:e.area_id},label:e.name}))]}_matchingSceneCount(e){return this.filterCategory===""?e.scenes.length:e.scenes.filter(r=>r.category===this.filterCategory).length}_summary(e){if(e.scenes.length===0)return d(this.hass,"ui.not_configured","not configured");let r=this._matchingSceneCount(e),i=r===1?d(this.hass,"ui.scene_singular","scene"):d(this.hass,"ui.scene_plural","scenes");return`${r} ${i}`}get _weatherUnconfigured(){return!this._weatherConfig||this._weatherConfig.entity==null}get _workdayUnconfigured(){let e=this._dayConfig;return!e||e.workday_sensor==null&&e.workday_calendar==null}get _conditionsUnconfigured(){return this._weatherUnconfigured||this._workdayUnconfigured}_conditionsHintText(){let e=this._weatherUnconfigured,r=this._workdayUnconfigured;return e&&r?{title:d(this.hass,"ui.conditions_hint_title","Optional: set up Workday & Weather"),body:d(this.hass,"ui.conditions_hint_body","Configure Workday and Weather in Conditions to use them in your scene conditions.")}:r?{title:d(this.hass,"ui.conditions_hint_title_workday","Optional: set up Workday"),body:d(this.hass,"ui.conditions_hint_body_workday","Configure Workday in Conditions to use it in your scene conditions.")}:{title:d(this.hass,"ui.conditions_hint_title_weather","Optional: set up Weather"),body:d(this.hass,"ui.conditions_hint_body_weather","Configure Weather in Conditions to use it in your scene conditions.")}}_openSettings(e){this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:e},bubbles:!0,composed:!0}))}_dismissConditionsHint(){this._conditionsHintDismissed=!0,an()}_renderBanners(){if(!this._staticLoaded)return"";if(this._actions.length===0)return l`
        <div class="banner banner-required" data-test="no-actions-banner" role="alert">
          <ha-icon class="banner-icon" icon="mdi:alert-circle-outline"></ha-icon>
          <div class="banner-text">
            <strong
              >${d(this.hass,"ui.no_actions_title","Set up an action to get started")}</strong
            >
            <span
              >${d(this.hass,"ui.no_actions_body","Ambience can't apply anything until you expose at least one action \u2014 scenes need actions to run.")}</span
            >
          </div>
          <button
            class="banner-cta"
            data-test="setup-actions-btn"
            @click=${()=>this._openSettings("actions")}
          >
            ${d(this.hass,"ui.no_actions_cta","Set up actions")}
          </button>
        </div>
      `;if(!this._conditionsHintDismissed&&this._conditionsUnconfigured){let{title:e,body:r}=this._conditionsHintText();return l`
        <div class="banner banner-hint" data-test="conditions-hint-banner">
          <ha-icon class="banner-icon" icon="mdi:lightbulb-on-outline"></ha-icon>
          <div class="banner-text">
            <strong>${e}</strong>
            <span>${r}</span>
          </div>
          <button
            class="banner-cta"
            data-test="setup-conditions-btn"
            @click=${()=>this._openSettings("conditions")}
          >
            ${d(this.hass,"ui.conditions_hint_cta","Configure conditions")}
          </button>
          <button
            class="banner-dismiss"
            data-test="dismiss-conditions-hint"
            title=${d(this.hass,"ui.dismiss","Dismiss")}
            aria-label=${d(this.hass,"ui.dismiss","Dismiss")}
            @click=${()=>this._dismissConditionsHint()}
          >
            ✕
          </button>
        </div>
      `}return""}_orderedScopeRows(){let e=[{scope:{kind:"house"},name:d(this.hass,"ui.scope_house","House"),cfg:this._house,rowClass:"house"}];for(let s of this._floors){let a=this._floorConfigs.get(s.floor_id);a&&e.push({scope:{kind:"floor",id:s.floor_id},name:s.name,cfg:a,rowClass:"floor"})}for(let s of this._areas){let a=this._areaConfigs.get(s.area_id);a&&e.push({scope:{kind:"area",id:s.area_id},name:s.name,cfg:a,rowClass:"area"})}let r=[],i=[];for(let s of e)(s.cfg.enabled===!1?i:r).push(s);return[...r,...i]}_isSwitchedOff(e){let r=this._switchEntityIds.get(W(e));return r?this.hass.states?.[r]?.state==="off":!1}render(){return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${this._renderBanners()}
      <ul>
        ${An(this._orderedScopeRows(),e=>W(e.scope),e=>this._renderScopeRow(e.scope,e.name,e.cfg,e.rowClass))}
        ${this._areas.length===0?l`<li>
              <p class="empty">
                ${d(this.hass,"ui.no_areas","No areas found in Home Assistant.")}
              </p>
            </li>`:""}
      </ul>

      <ambience-scene-editor
        ?open=${this._editing!==null}
        .hass=${this.hass}
        .scope=${this._editing?this._editing.scope:void 0}
        .scopes=${this._scopeOptions}
        .takenNames=${this._takenSceneNames}
        .saveError=${this._sceneEditorError}
        .scene=${this._editingScene}
        .conditions=${this._editorConditions}
        .periods=${this._periods}
        .luxRanges=${this._luxRanges}
        .dayConfig=${this._dayConfig}
        .weatherConfig=${this._weatherConfig}
        .availableActions=${this._actions}
        .schemas=${this._schemas}
        .categories=${this._categories}
        @save-scene=${this._saveScene}
        @cancel-scene=${this._cancelScene}
      ></ambience-scene-editor>
      <ambience-traces-modal
        ?open=${this._viewingTraces!==null}
        .hass=${this.hass}
        .scope=${this._viewingTraces?.scope??{scope_kind:"house",scope_id:null}}
        .category=${this._viewingTraces?.category??""}
        .categoryName=${this._viewingTraces?.categoryName??null}
        @close=${()=>{this._viewingTraces=null}}
      ></ambience-traces-modal>
      <ambience-auto-triggers-modal
        ?open=${this._autoTriggers!==null}
        .hass=${this.hass}
        .scope=${this._autoTriggers?.scope??{kind:"house"}}
        .scopeName=${this._autoTriggers?.name??""}
        .scenes=${this._autoTriggers?this._getConfig(this._autoTriggers.scope)?.scenes??[]:[]}
        @close=${()=>{this._autoTriggers=null}}
      ></ambience-auto-triggers-modal>
      <ambience-simulator-modal
        ?open=${this._viewingSimulator!==null}
        .hass=${this.hass}
        .scope=${this._viewingSimulator?.scope??{scope_kind:"house",scope_id:null}}
        .category=${this._viewingSimulator?.category??""}
        .categoryName=${this._viewingSimulator?.categoryName??null}
        @close=${()=>{this._viewingSimulator=null}}
      ></ambience-simulator-modal>
    `}_renderScopeRow(e,r,i,s){let a=this._expanded.has(W(e)),o=e.kind==="house"?"":e.id,c=this._isSwitchedOff(e)?"off":this._matchingSceneCount(i)===0?"empty":"",h=i.enabled===!1;return l`
      <li class="scope-row ${s} ${h?"scope-disabled":""}" data-id=${o}>
        <div
          class="scope-header ${a?"open":""} ${c}"
          @click=${()=>this._toggleExpand(e)}
        >
          <span class="chevron ${a?"open":""}">▶</span>
          <ha-icon class="scope-icon" icon=${kt(e,this.hass)}></ha-icon>
          <span class="scope-name">${r}</span>
          <span class="scope-summary">${this._summary(i)}</span>
          ${this._renderPauseIcon(e,i)}
          ${this._renderScopeSwitch(e,i)}
          <ambience-kebab-menu
            data-test="scope-kebab"
            .hass=${this.hass}
            .items=${[{id:"run",label:d(this.hass,"ui.run","Run"),icon:"mdi:play"},{id:"auto",label:d(this.hass,"ui.auto_triggers_section","Auto-triggers"),icon:"mdi:flash-auto"}]}
            @menu-action=${p=>this._onScopeMenu(e,r,i,p.detail.id)}
            @click=${p=>p.stopPropagation()}
          ></ambience-kebab-menu>
        </div>
        ${a?l`
              <div class="scope-body">
                <ambience-scenes-list
                  .scenes=${i.scenes}
                  .periods=${this._periods}
                  .luxRanges=${this._luxRanges}
                  .weatherConfig=${this._weatherConfig}
                  .conditions=${this._conditions}
                  .availableActions=${this._actions}
                  .schemas=${this._schemas}
                  .categories=${this._categories}
                  .filterCategory=${this.filterCategory}
                  .hass=${this.hass}
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
                  @show-simulator=${p=>this._showSimulator(e,p.detail.category)}
                ></ambience-scenes-list>
              </div>
            `:""}
      </li>
    `}_pauseRemaining(e){let r=this.hass.states?.[e],i=r?.attributes?.off_at,s=Number(r?.attributes?.auto_on_delay_seconds??0);if(!i||!s)return 0;let a=(Date.now()-new Date(i).getTime())/1e3;return Math.max(0,Math.round(s-a))}_renderPauseIcon(e,r){if(r.enabled===!1)return"";let i=this._switchEntityIds.get(W(e));if(!i)return"";let s=this.hass.states?.[i]?.state==="off",a=c=>{c.stopPropagation(),this.hass.callService?.("switch",s?"turn_on":"turn_off",{entity_id:i})};if(!s)return l`<button
        class="scope-pause"
        data-test="scope-pause"
        title=${d(this.hass,"ui.pause_scope","Pause this scope")}
        @click=${a}
      >
        <ha-icon icon="mdi:timer-outline"></ha-icon>
      </button>`;let o=this._pauseRemaining(i);return l`<button
      class="scope-pause paused"
      data-test="scope-pause"
      title=${d(this.hass,"ui.resume_scope","Resume now")}
      @click=${a}
    >
      <ha-icon icon="mdi:timer"></ha-icon>
      <span class="countdown">${Bd(o)}</span>
    </button>`}_renderScopeSwitch(e,r){let i=r.enabled!==!1,s=o=>o.stopPropagation(),a=async o=>{o.stopPropagation();try{await $n(this.hass,e,!i),await this._reloadScope(e)}catch(c){this._error=c.message||String(c)}};return customElements.get("ha-switch")?l`<ha-switch
        class="scope-switch"
        data-test="scope-switch"
        .checked=${ti(i)}
        @click=${s}
        @change=${a}
      ></ha-switch>`:l`<input
      class="scope-switch"
      data-test="scope-switch"
      type="checkbox"
      .checked=${ti(i)}
      @click=${s}
      @change=${a}
    />`}async _reloadScope(e){try{let r;if(e.kind==="house"?r=Ke(await Kr(this.hass)):e.kind==="area"?r=Ke(await qr(this.hass,e.id)):r=Ke(await Vr(this.hass,e.id)),!this.isConnected)return;this._setConfig(e,r)}catch(r){this._error=r.message||String(r)}}};T.styles=[v`
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
      .banner-required {
        border-color: var(--warning-color, #ffa600);
        background: color-mix(in srgb, var(--warning-color, #ffa600) 12%, var(--card-background-color, #fff));
      }
      .banner-required .banner-icon {
        color: var(--warning-color, #ffa600);
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
      .banner-text strong {
        font-weight: 600;
      }
      .banner-text span {
        font-size: 0.9rem;
        color: var(--secondary-text-color, #888);
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
      }
      .banner-dismiss {
        flex: 0 0 auto;
        align-self: flex-start;
        background: transparent;
        border: none;
        color: var(--secondary-text-color, #888);
        cursor: pointer;
        font-size: 1rem;
        line-height: 1;
        padding: 0.15rem 0.3rem;
      }
      .banner-dismiss:hover {
        color: var(--primary-text-color, inherit);
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
       contents harder — while leaving the switch fully lit to re-enable. */
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
      .scope-header.off .scope-summary,
      .scope-header.off ambience-kebab-menu {
        opacity: 0.4;
      }
      /* Permanently disabled scope: dim its kebab menu to signal the state.
       Opacity only — the menu stays fully clickable. */
      .scope-disabled ambience-kebab-menu {
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
        text-align: left;
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
    `],u([m({attribute:!1})],T.prototype,"hass",2),u([g()],T.prototype,"_areas",2),u([g()],T.prototype,"_floors",2),u([g()],T.prototype,"_areaConfigs",2),u([g()],T.prototype,"_floorConfigs",2),u([g()],T.prototype,"_house",2),u([g()],T.prototype,"_switchEntityIds",2),u([g()],T.prototype,"_conditions",2),u([g()],T.prototype,"_actions",2),u([g()],T.prototype,"_categories",2),u([g()],T.prototype,"_schemas",2),u([g()],T.prototype,"_periods",2),u([g()],T.prototype,"_luxRanges",2),u([g()],T.prototype,"_dayConfig",2),u([g()],T.prototype,"_weatherConfig",2),u([g()],T.prototype,"_expanded",2),u([g()],T.prototype,"_error",2),u([g()],T.prototype,"_staticLoaded",2),u([g()],T.prototype,"_conditionsHintDismissed",2),u([g()],T.prototype,"_editing",2),u([g()],T.prototype,"_sceneEditorError",2),u([g()],T.prototype,"_viewingTraces",2),u([g()],T.prototype,"_viewingSimulator",2),u([g()],T.prototype,"_autoTriggers",2),u([m({attribute:!1})],T.prototype,"filterCategory",2),T=u([x("ambience-scopes-view")],T);var oe=class extends b{constructor(){super(...arguments);this._categories=[];this._error="";this._editing=null;this._modalError=""}async connectedCallback(){super.connectedCallback();try{this._categories=await Me(this.hass)}catch(e){this._error=e.message||String(e)}}_sorted(){return[...this._categories].sort((e,r)=>e.name.localeCompare(r.name))}_validate(e){let r=e.name.trim();if(r==="")return d(this.hass,"ui.category_name_blank_error","Category names can't be empty.");let i=r.toLocaleLowerCase();return this._categories.some(a=>a.id!==e.id&&a.name.trim().toLocaleLowerCase()===i)?d(this.hass,"ui.category_name_duplicate_error","Two categories can't have the same name."):""}_openEditor(e){this._editing={...e},this._modalError=""}_addCategory(){let e=crypto.randomUUID().replace(/-/g,"");this._editing={id:e,name:""},this._modalError=""}_closeModal(){this._editing=null,this._modalError=""}_patchDraft(e){this._editing&&(this._editing={...this._editing,...e})}_onName(e){this._patchDraft({name:e.target.value})}_onIcon(e){this._patchDraft({icon:e||void 0})}_onColor(e){this._patchDraft({color:e})}_save(){if(!this._editing)return;let e=this._validate(this._editing);if(e){this._modalError=e;return}let r={...this._editing,name:this._editing.name.trim()},i=this._categories.some(s=>s.id===r.id);this._categories=i?this._categories.map(s=>s.id===r.id?r:s):[...this._categories,r],this._closeModal(),kn(this.hass,this._categories).then(()=>{window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(s=>{this._error=s.message||String(s)})}_deleteCategory(){if(!this._editing)return;let e=this._editing.id;if(this._categories.length<=1){this._modalError=d(this.hass,"ui.category_delete_blocked_last","You can't delete the last category.");return}let r=this._categories;this._categories=this._categories.filter(i=>i.id!==e),En(this.hass,e).then(()=>{this._closeModal(),window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(i=>{this._categories=r;let s=i.code;s==="category_in_use"?this._modalError=d(this.hass,"ui.category_delete_blocked_in_use","This category still has scenes \u2014 move or delete them first."):s==="category_last"?this._modalError=d(this.hass,"ui.category_delete_blocked_last","You can't delete the last category."):this._modalError=i.message||String(i)})}_renderIconField(){return customElements.get("ha-icon-picker")?l`<ha-icon-picker
        .hass=${this.hass}
        .value=${this._editing.icon??""}
        @value-changed=${e=>{e.stopPropagation(),this._onIcon(e.detail.value)}}
      ></ha-icon-picker>`:l`<input
      class="icon-input"
      .value=${this._editing.icon??""}
      placeholder=${d(this.hass,"ui.category_icon","Icon")}
      @change=${e=>this._onIcon(e.target.value)}
    />`}_renderSwatches(){let e=this._editing.color;return l`
      <div class="swatches">
        ${Zr.map(r=>l`<button
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
          title=${d(this.hass,"ui.category_color_none","No colour")}
          aria-label=${d(this.hass,"ui.category_color_none","No colour")}
          aria-pressed=${e==null}
          @click=${()=>this._onColor(void 0)}
        >✕</button>
      </div>
    `}_renderModal(){if(!this._editing)return"";let e=this._categories.some(i=>i.id===this._editing.id),r=e?d(this.hass,"ui.category_edit_title","Edit category"):d(this.hass,"ui.category_add_title","Add category");return l`
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
            <label>${d(this.hass,"ui.category_name_placeholder","Category name")}</label>
            <input
              class="name"
              .value=${this._editing.name}
              placeholder=${d(this.hass,"ui.category_name_placeholder","Category name")}
              aria-label=${d(this.hass,"ui.category_name_placeholder","Category name")}
              @input=${this._onName}
            />

            <label>${d(this.hass,"ui.category_icon","Icon")}</label>
            ${this._renderIconField()}

            <label>${d(this.hass,"ui.category_color","Colour")}</label>
            ${this._renderSwatches()}

            ${this._modalError?l`<p class="modal-error">${this._modalError}</p>`:""}
          </div>
          <div class="modal-footer">
            ${e?l`<button class="delete" @click=${()=>this._deleteCategory()}>
                  ${d(this.hass,"ui.title_delete","Delete")}
                </button>`:l`<span></span>`}
            <div class="right">
              <button class="primary" @click=${()=>this._save()}>
                ${d(this.hass,"ui.category_save","Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    `}render(){return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      <div class="list">
        ${this._sorted().map(e=>{let r=ei(e.color);return l`<button class="category-row" @click=${()=>this._openEditor(e)}>
            <span class="row-icon">${e.icon?l`<ha-icon icon=${e.icon}></ha-icon>`:""}</span>
            <span class="row-swatch ${r?"":"none"}" style=${r?`background: ${r}`:""}></span>
            <span class="row-name">${e.name}</span>
          </button>`})}
      </div>
      <button class="add" @click=${()=>this._addCategory()}>
        ${d(this.hass,"ui.category_add","+ Add category")}
      </button>
      ${this._renderModal()}
    `}};oe.styles=v`
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
  `,u([m({attribute:!1})],oe.prototype,"hass",2),u([g()],oe.prototype,"_categories",2),u([g()],oe.prototype,"_error",2),u([g()],oe.prototype,"_editing",2),u([g()],oe.prototype,"_modalError",2),oe=u([x("ambience-categories-settings")],oe);var Te=class extends b{constructor(){super(...arguments);this._defaults={name:"Ambience",auto_on_delay_seconds:7200};this._error=""}async connectedCallback(){super.connectedCallback();try{this._defaults=await xn(this.hass)}catch(e){this._error=e.message||String(e)}}async _safeSave(e){try{await e(),this._error=""}catch(r){this._error=r.message||String(r)}}_onDefaultName(e){let r=e.target.value.trim();r&&(this._defaults={...this._defaults,name:r},this._safeSave(()=>Jr(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds)))}_onDefaultDelay(e){let r=e.target.value;r===""||!Number.isFinite(Number(r))||Number(r)<0||(this._defaults={...this._defaults,auto_on_delay_seconds:Math.floor(Number(r))},this._safeSave(()=>Jr(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds)))}render(){return l`
      ${this._error?l`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:""}

      <div class="card">
        <h3>
          ${d(this.hass,"ui.settings_ambience_defaults_card","Defaults")}
        </h3>
        <div class="row">
          <label
            >${d(this.hass,"ui.settings_ambience_field_name","Switch name")}</label
          >
          <input
            data-test="defaults-name"
            type="text"
            .value=${this._defaults.name}
            @change=${e=>this._onDefaultName(e)}
          />
        </div>
        <div class="row">
          <label
            >${d(this.hass,"ui.settings_ambience_field_delay","Auto-on delay (seconds)")}</label
          >
          <input
            data-test="defaults-delay-seconds"
            type="number"
            min="0"
            .value=${String(this._defaults.auto_on_delay_seconds)}
            @change=${e=>this._onDefaultDelay(e)}
          />
          <div class="help">
            ${d(this.hass,"ui.settings_ambience_delay_help","0 = never auto-on")}
          </div>
        </div>
      </div>

      <div class="card">
        <h3>
          ${d(this.hass,"ui.settings_tab_categories","Scene categories")}
        </h3>
        <ambience-categories-settings
          .hass=${this.hass}
        ></ambience-categories-settings>
      </div>
    `}};Te.styles=v`
    :host {
      display: block;
    }
    .card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      margin-bottom: 1rem;
      padding: 1rem;
    }
    h3 {
      margin: 0 0 0.75rem;
    }
    .row {
      margin-bottom: 0.75rem;
    }
    label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .help {
      color: var(--secondary-text-color, #888);
      font-size: 0.85em;
      margin-top: 0.25rem;
    }
    input[type="text"],
    input[type="number"] {
      width: 100%;
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, inherit);
    }
  `,u([m({attribute:!1})],Te.prototype,"hass",2),u([g()],Te.prototype,"_defaults",2),u([g()],Te.prototype,"_error",2),Te=u([x("ambience-ambience-settings")],Te);var fe=class extends b{constructor(){super(...arguments);this.conditionName="";this.conditionDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let e=Y(this.hass,this.conditionName);return l`
      <div class="card">
        <header @click=${this._toggleExpand}>
          <span class="chevron ${this._expanded?"open":""}">▶</span>
          <label>
            <div class="name">${e}</div>
            <div class="description">${this.conditionDescription}</div>
          </label>
        </header>
        <div class="body ${this._expanded?"":"collapsed"}">
          <slot></slot>
        </div>
      </div>
    `}};fe.styles=v`
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
  `,u([m({attribute:!1})],fe.prototype,"hass",2),u([m()],fe.prototype,"conditionName",2),u([m()],fe.prototype,"conditionDescription",2),u([g()],fe.prototype,"_expanded",2),fe=u([x("ambience-condition-card")],fe);var Vd=/^[a-z][a-z0-9_]*$/;function Kd(t){return t.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var Ft=v`
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
`,ee=class extends b{constructor(){super(...arguments);this.takenIds=new Set;this._label="";this._error=""}static{this.styles=Ft}connectedCallback(){super.connectedCallback(),this._label=this._initialLabel()??""}_onLabelInput(e){this._label=e.target.value}_validateName(e){return this.existingId?"":this._label.trim()?!e||!Vd.test(e)?d(this.hass,"ui.error_start_letter","Name must start with a letter."):this.takenIds.has(e)?d(this.hass,"ui.error_name_exists","An entry with this name already exists. Choose a different name."):"":d(this.hass,"ui.error_enter_name","Please enter a name.")}_onSave(){let e=this.existingId??Kd(this._label),r=this._validateName(e)||this._validateDef();if(r){this._error=r,this.performUpdate();return}this.dispatchEvent(new CustomEvent(this._saveEvent,{detail:{id:e,definition:this._buildDefinition()},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent(this._cancelEvent,{bubbles:!0,composed:!0}))}render(){let e=this.existingId?this._editTitleTemplate().replace("{name}",this._initialLabel()??this.existingId):this._addTitle();return l`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <div class="field">
          <label for="label">${d(this.hass,"ui.name","Name")}</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput}
            placeholder=${this._namePlaceholder()} />
        </div>
        ${this._renderFields()}
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>${d(this.hass,"ui.cancel","Cancel")}</button>
          <button @click=${this._onSave}>${d(this.hass,"ui.save","Save")}</button>
        </div>
      </div>
    `}};u([m({attribute:!1})],ee.prototype,"hass",2),u([m({attribute:!1})],ee.prototype,"existingId",2),u([m({attribute:!1})],ee.prototype,"takenIds",2),u([g()],ee.prototype,"_label",2),u([g()],ee.prototype,"_error",2);var Ye=class extends ee{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this._def=this.initial}connectedCallback(){super.connectedCallback(),this._def=this.initial}get _saveEvent(){return"period-save"}get _cancelEvent(){return"period-cancel"}_addTitle(){return d(this.hass,"ui.period_modal_add_title","Add custom period")}_editTitleTemplate(){return d(this.hass,"ui.period_modal_edit_title",'Edit "{name}"')}_namePlaceholder(){return d(this.hass,"ui.name_placeholder","e.g. Wind down")}_initialLabel(){return this.initial.label}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_renderFields(){return l`
      <div class="row">
        <label style="min-width: 3em;">${d(this.hass,"ui.from_label","From")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
      </div>
      <div class="row">
        <label style="min-width: 3em;">${d(this.hass,"ui.to_label","To")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
      </div>
    `}_validateDef(){return""}_buildDefinition(){return{from:this._def.from,to:this._def.to,label:this._label.trim()||null}}};Ye.styles=[Ft,v`
      .row { display: flex; align-items: center; gap: 0.5rem; }
    `],u([m({attribute:!1})],Ye.prototype,"initial",2),u([g()],Ye.prototype,"_def",2),Ye=u([x("ambience-period-edit-modal")],Ye);function ta(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=ve(n,t.anchor);if(t.offset_min===0)return e;let r=Math.abs(t.offset_min),i=r%60===0?`${r/60}${d(n,"ui.unit_hour_abbr","h")}`:`${r}${d(n,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${i}`}var Dr=class extends se{_list(){return rr(this.hass)}_save(n,e){return _n(this.hass,n,e)}_label(n,e){return ye(this.hass,n,e)}_formatDef(n){return`${ta(n.from,this.hass)} \u2192 ${ta(n.to,this.hass)}`}_headingKey(){return["ui.periods_heading","Periods"]}_addKey(){return["ui.add_custom_period","+ Add custom period"]}_warningTextKey(){return["ui.period_warning_text","some scenes now reference missing periods:"]}_renderModal(){let n=this._modal;return n.mode==="edit"?l`<ambience-period-edit-modal
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
      ></ambience-period-edit-modal>`:l``}};Dr=u([x("ambience-time-of-day-config")],Dr);var Le=class extends ee{constructor(){super(...arguments);this.initial={min:0,max:100,label:null};this._min=null;this._max=null}connectedCallback(){super.connectedCallback(),this._min=this.initial.min??null,this._max=this.initial.max??null}get _saveEvent(){return"lux-range-save"}get _cancelEvent(){return"lux-range-cancel"}_addTitle(){return d(this.hass,"ui.lux_modal_add_title","Add custom lux range")}_editTitleTemplate(){return d(this.hass,"ui.lux_modal_edit_title",'Edit "{name}"')}_namePlaceholder(){return d(this.hass,"ui.lux_name_placeholder","e.g. Gloomy")}_initialLabel(){return this.initial.label}_onMinInput(e){let r=e.target.value;this._min=r===""?null:Number(r)}_onMaxInput(e){let r=e.target.value;this._max=r===""?null:Number(r)}_renderFields(){return l`
      <div class="row">
        <div class="field">
          <label for="min">${d(this.hass,"ui.lux_min_label","Min (lx)")}</label>
          <input id="min" type="number" min="0" step="1" .value=${this._min==null?"":String(this._min)}
            @input=${this._onMinInput} placeholder=${d(this.hass,"ui.lux_min_placeholder","0")} />
        </div>
        <div class="field">
          <label for="max">${d(this.hass,"ui.lux_max_label","Max (lx)")}</label>
          <input id="max" type="number" min="0" step="1" .value=${this._max==null?"":String(this._max)}
            @input=${this._onMaxInput} placeholder=${d(this.hass,"ui.lux_max_placeholder","\u221E")} />
        </div>
      </div>
    `}_validateDef(){return this._min==null&&this._max==null?d(this.hass,"ui.lux_error_need_bound","Enter a min, a max, or both."):this._min!=null&&this._min<0||this._max!=null&&this._max<0?d(this.hass,"ui.lux_error_negative","Bounds must be 0 or greater."):this._min!=null&&this._max!=null&&this._min>=this._max?d(this.hass,"ui.lux_error_order","Min must be less than max."):""}_buildDefinition(){let e={label:this._label.trim()||null};return this._min!=null&&(e.min=this._min),this._max!=null&&(e.max=this._max),e}};Le.styles=[Ft,v`
      .row { display: flex; gap: 1rem; }
      .row .field { flex: 1; }
    `],u([m({attribute:!1})],Le.prototype,"initial",2),u([g()],Le.prototype,"_min",2),u([g()],Le.prototype,"_max",2),Le=u([x("ambience-lux-edit-modal")],Le);var Ar=class extends se{_list(){return ir(this.hass)}_save(n,e){return vn(this.hass,n,e)}_label(n,e){return Je(this.hass,n,e)}_formatDef(n){return ai(n.min,n.max,"any")}_headingKey(){return["ui.lux_heading","Lux ranges"]}_addKey(){return["ui.add_custom_lux_range","+ Add custom lux range"]}_warningTextKey(){return["ui.lux_warning_text","some scenes now reference missing lux ranges:"]}_renderModal(){let n=this._modal;return n.mode==="edit"?l`<ambience-lux-edit-modal
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
      ></ambience-lux-edit-modal>`:l``}};Ar=u([x("ambience-lux-config")],Ar);var Re=class extends b{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await xt(this.hass)}async _save(e){this._config=e;let r=await yn(this.hass,e.workday_sensor,e.workday_calendar);this._warnings=r.warnings??[],window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=[{name:"workday_sensor",selector:{entity:{integration:"workday",domain:"binary_sensor"}}}],r=[{name:"workday_calendar",selector:{entity:{integration:"workday",domain:"calendar"}}}];return l`
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
          <strong>${d(this.hass,"ui.day_warning_prefix","Warning:")}</strong> ${d(this.hass,"ui.day_warning_text","scenes now reference unconfigured entities:")}
          <ul>
            ${this._warnings.map(i=>l`<li>${dt(i)} / "${i.scene_name}" → ${i.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};Re.styles=v`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,u([m({attribute:!1})],Re.prototype,"hass",2),u([g()],Re.prototype,"_config",2),u([g()],Re.prototype,"_warnings",2),Re=u([x("ambience-day-config")],Re);var Yd=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],ge=class extends b{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._warnings=[];this._expanded=new Set}async connectedCallback(){super.connectedCallback(),this._config=await wt(this.hass)}async _persist(){let e=await bn(this.hass,this._config.entity,this._config.groups);this._warnings=e.warnings??[],window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onEntityChange(e){this._config={...this._config,entity:e.detail.value||null},this._persist()}_nextGroupId(e){let r=new Set(e.map(i=>i.id));for(let i=1;i<=e.length+1;i++){let s=`group_${i}`;if(!r.has(s))return s}return`group_${e.length+1}`}_addGroup(){let e=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:e,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,e]),this._persist()}_toggleExpand(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):r.add(e),this._expanded=r}_updateGroup(e,r){this._config={...this._config,groups:this._config.groups.map((i,s)=>s===e?{...i,...r}:i)},this._persist()}_removeGroup(e){let r=this._config.groups[e];if(this._config={...this._config,groups:this._config.groups.filter((i,s)=>s!==e)},r){let i=new Set(this._expanded);i.delete(r.id),this._expanded=i}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:Yd.map(e=>({value:e,label:Ze(this.hass,e)}))}}}]}_renderConditions(e,r){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:r.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation(),this._updateGroup(e,{conditions:s.detail.value.conditions??[]})}}
      ></ha-form>`;let i=r.conditions.map(s=>Ze(this.hass,s));return l`<span class="conditions-list">${i.join(", ")}</span>`}_renderGroup(e,r){let i=this._expanded.has(r.id),s=r.conditions.map(a=>Ze(this.hass,a)).join(", ");return l`
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
          ${d(this.hass,"ui.weather_warning_text","scenes now reference an unconfigured weather entity:")}
          <ul>${this._warnings.map(r=>l`<li>${dt(r)} / "${r.scene_name}" → ${r.reason}</li>`)}</ul>
        </div>
      `:""}
    `}};ge.styles=v`
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
  `,u([m({attribute:!1})],ge.prototype,"hass",2),u([g()],ge.prototype,"_config",2),u([g()],ge.prototype,"_warnings",2),u([g()],ge.prototype,"_expanded",2),ge=u([x("ambience-weather-config")],ge);var ra={time_of_day:t=>l`<ambience-time-of-day-config .hass=${t}></ambience-time-of-day-config>`,lux:t=>l`<ambience-lux-config .hass=${t}></ambience-lux-config>`,day:t=>l`<ambience-day-config .hass=${t}></ambience-day-config>`,weather:t=>l`<ambience-weather-config .hass=${t}></ambience-weather-config>`},Gd=new Set(Object.keys(ra)),Pe=class extends b{constructor(){super(...arguments);this._conditions=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._conditions=await tr(this.hass)}catch(e){this._error=e.message||String(e)}}render(){let e=this._conditions.filter(r=>Gd.has(r.name)).slice().sort((r,i)=>i.priority-r.priority);return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${e.map(r=>l`
        <ambience-condition-card .hass=${this.hass} .conditionName=${r.name} .conditionDescription=${r.description}>
          ${ra[r.name]?.(this.hass)??l``}
        </ambience-condition-card>
      `)}
    `}};Pe.styles=v`
    :host { display: block; }
    .error { color: var(--error-color, #d32f2f); }
  `,u([m({attribute:!1})],Pe.prototype,"hass",2),u([g()],Pe.prototype,"_conditions",2),u([g()],Pe.prototype,"_error",2),Pe=u([x("ambience-conditions-settings")],Pe);var P=class extends b{constructor(){super(...arguments);this._actions=[];this._services=[];this._schemas={};this._fieldSchemas={};this._addSchema=[];this._serviceById=new Map;this._availableServices=[];this._expanded=new Set;this._adding=!1;this._warnings=[];this._loadError=null;this._saveError=null;this._loaded=!1;this._editingDefault=null;this._editingOriginalValue=void 0;this._editingOriginalHad=!1;this._drag=new it(this,(e,r)=>{let i=[...this._actions],[s]=i.splice(e,1);i.splice(r,0,s),this._actions=i,this._autoSave()});this._onDocPointerDown=e=>{let r=e.composedPath();this._collapseAddFormOnClickAway(r),this._cancelEditingDefaultOnClickAway(r)}}_collapseAddFormOnClickAway(e){if(!this._adding)return;let r=this.shadowRoot?.querySelector(".add-row"),i=!!r&&e.includes(r),s=e.some(a=>a instanceof Element&&P._OVERLAY_TAG_RE.test(a.localName));!i&&!s&&(this._adding=!1)}_cancelEditingDefaultOnClickAway(e){if(this._editingDefault===null)return;let r=this.shadowRoot?.querySelector(`.field-row-editor[data-editing-key="${this._editingDefault}"]`);(!r||!e.includes(r))&&this._cancelEditingDefault()}connectedCallback(){super.connectedCallback(),document.addEventListener("pointerdown",this._onDocPointerDown),customElements.get("ha-service-picker")||customElements.whenDefined("ha-service-picker").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._onDocPointerDown)}_startEditingDefault(e,r){let s=this._actions.find(a=>a.id===e)?.defaults??{};this._editingOriginalHad=r in s,this._editingOriginalValue=s[r],this._editingDefault=`${e}:${r}`}_saveEditingDefault(){this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1,this._autoSave()}_cancelEditingDefault(){let e=this._editingDefault;if(e){let r=e.indexOf(":"),i=e.slice(0,r),s=e.slice(r+1);this._actions=this._actions.map(a=>{if(a.id!==i)return a;let o={...a.defaults??{}};return this._editingOriginalHad?o[s]=this._editingOriginalValue:delete o[s],{...a,defaults:o}})}this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1}async firstUpdated(){await this._reload()}willUpdate(e){if(e.has("_actions")||e.has("_schemas")){let r={};for(let i of this._actions){let s=this._schemas[i.id];if(s)for(let[a,o]of Object.entries(s.fields))r[`${i.id}:${a}`]=[{name:a,selector:o.selector??{text:{}},required:!1}]}this._fieldSchemas=r}if(e.has("_services")&&(this._serviceById=new Map(this._services.map(r=>[r.id,r]))),e.has("_actions")||e.has("_services")){let r=new Set(this._actions.map(i=>i.id));this._availableServices=this._services.filter(i=>!r.has(i.id)),this._addSchema=[{name:"service",selector:{select:{options:this._availableServices.map(i=>({value:i.id,label:this._addOptionLabel(i.id)})),custom_value:!0,mode:"dropdown",sort:!0}}}]}}async _reload(){this._loadError=null;try{let[e,r]=await Promise.all([bt(this.hass),mn(this.hass)]);this._actions=e,this._services=r}catch(e){this._loadError=e instanceof Error?e.message:String(e);return}await Promise.all(this._actions.map(e=>this._ensureSchema(e.id))),this._loaded=!0}async _ensureSchema(e){if(!(e in this._schemas))try{let r=await be(this.hass,e);this._schemas={...this._schemas,[e]:r}}catch{this._schemas={...this._schemas,[e]:null}}}_setShowInEditor(e,r,i){this._actions=this._actions.map(s=>{if(s.id!==e)return s;let a=new Set(s.visible_fields??[]);return i?a.add(r):a.delete(r),{...s,visible_fields:[...a]}}),this._autoSave()}_setDefault(e,r,i){this._actions=this._actions.map(s=>s.id!==e?s:{...s,defaults:{...s.defaults??{},[r]:i}})}_clearDefault(e,r){this._actions=this._actions.map(i=>{if(i.id!==e)return i;let s={...i.defaults??{}};return delete s[r],{...i,defaults:s}})}_setLabel(e,r){this._actions=this._actions.map(i=>i.id===e?{...i,label:r}:i)}_setReapplyEnabled(e,r){this._actions=this._actions.map(i=>{if(i.id!==e)return i;if(!r){let{reapply_seconds:s,...a}=i;return a}return{...i,reapply_seconds:300}}),this._autoSave()}_setReapplySeconds(e,r){let i=Kn(r);i!==null&&(this._actions=this._actions.map(s=>s.id!==e?s:{...s,reapply_seconds:i}),this._autoSave())}_toggleExpand(e){this._expanded.has(e)?this._expanded=new Set:(this._expanded=new Set([e]),this._ensureSchema(e))}async _addService(e){e&&this._services.some(r=>r.id===e)&&(this._actions.some(r=>r.id===e)||(await this._ensureSchema(e),this._actions=[...this._actions,{id:e,label:this._labelForService(e),visible_fields:[],defaults:{}}],this._expanded=new Set([e]),this._adding=!1,this._autoSave()))}_removeService(e){this._actions=this._actions.filter(i=>i.id!==e);let r=new Set(this._expanded);r.delete(e),this._expanded=r,this._autoSave()}async _autoSave(){this._saveError=null,this._warnings=[];try{let e=await pn(this.hass,this._actions);this._warnings=e.warnings??[],window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"))}catch(e){this._saveError=e instanceof Error?e.message:String(e)}}render(){return this._loadError!==null?l`
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
        data-drag-index=${r}
      >
        <div
          class="card-header"
          data-toggle
          @click=${a=>{a.target.closest("ha-input, input, button.remove, .drag-handle")||this._toggleExpand(e.id)}}
        >
          <span
            class="drag-handle"
            data-drag-handle
            title=${d(this.hass,"ui.drag_to_reorder","Drag to reorder")}
            @pointerdown=${a=>this._drag.start(r,a)}
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
        ${d(this.hass,"ui.actions_field_help","Tick a checkbox to make a field editable per scene. Set a default to pre-fill it.")}
      </p>
      ${i.map(([s,a])=>this._renderFieldRow(e,s,a))}
    `}_formatDefaultSummary(e){return e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}_defaultUnitSuffix(e,r){let i=this._schemas[e]?.fields?.[r];if(!i||typeof i!="object")return"";let s=gr(i.selector);return s?` ${s}`:""}_renderFieldRow(e,r,i){let s=(e.visible_fields??[]).includes(r),a=r in(e.defaults??{}),o=`${e.id}:${r}`,c=this._editingDefault===o;return l`
      <div class="field-row">
        <!-- Row 1: [checkbox] [name] [default summary] -->
        <div class="field-row-main">
          <div class="checkbox-cell">
            <input
              type="checkbox"
              data-show-in-editor=${r}
              title="Show in scene editor"
              .checked=${s}
              @change=${h=>this._setShowInEditor(e.id,r,h.target.checked)}
            />
          </div>
          <span class="name">
            ${i.name||nt(r)}
            ${i.name?l` <small class="field-id">(${r})</small>`:""}
            ${i.description?l` <small>— ${i.description}</small>`:""}
          </span>
          <div class="summary-cell">
            ${c?l`<span class="summary-cell-editing">Editing…</span>`:a?l`<button
                    class="default-summary"
                    data-default-summary=${r}
                    @click=${h=>{h.stopPropagation(),this._startEditingDefault(e.id,r)}}
                  >Default: ${this._formatDefaultSummary(e.defaults?.[r])}${this._defaultUnitSuffix(e.id,r)}</button>`:l`<button
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
      </div>`}_labelForService(e){return this._serviceById.get(e)?.name?.trim()||vt(e)}_addOptionLabel(e){return`${this._labelForService(e)} (${e})`}_renderAddPicker(){return customElements.get("ha-service-picker")?l`<ha-service-picker
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
          ${e.scope_kind}${e.scope_id?`/${e.scope_id}`:""}${e.scene_name?l` — <em>${e.scene_name}</em>`:""}: ${e.reason}
        </li>`)}
    </ul>`}};P.styles=v`
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
    /* Primary "Add action" button — filled blue, matching the scenes list. */
    button.add {
      background: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
  `,P._OVERLAY_TAG_RE=/vaadin|combo-box|overlay|listbox|menu|mwc-|md-/i,u([m({attribute:!1})],P.prototype,"hass",2),u([g()],P.prototype,"_actions",2),u([g()],P.prototype,"_services",2),u([g()],P.prototype,"_schemas",2),u([g()],P.prototype,"_fieldSchemas",2),u([g()],P.prototype,"_addSchema",2),u([g()],P.prototype,"_expanded",2),u([g()],P.prototype,"_adding",2),u([g()],P.prototype,"_warnings",2),u([g()],P.prototype,"_loadError",2),u([g()],P.prototype,"_saveError",2),u([g()],P.prototype,"_loaded",2),u([g()],P.prototype,"_editingDefault",2),u([g()],P.prototype,"_editingOriginalValue",2),u([g()],P.prototype,"_editingOriginalHad",2),P=u([x("ambience-actions-settings")],P);var De=class extends b{constructor(){super(...arguments);this._tab="ambience"}willUpdate(e){e.has("initialTab")&&this.initialTab&&(this._tab=this.initialTab)}render(){return l`
      <nav>
        <button class=${this._tab==="ambience"?"active":""} @click=${()=>{this._tab="ambience"}}>
          <ha-icon icon="mdi:home-lightbulb"></ha-icon>${d(this.hass,"ui.settings_tab_ambience","Ambience")}
        </button>
        <button class=${this._tab==="conditions"?"active":""} @click=${()=>{this._tab="conditions"}}>
          <ha-icon icon="mdi:filter-variant"></ha-icon>${d(this.hass,"ui.settings_tab_conditions","Conditions")}
        </button>
        <button class=${this._tab==="actions"?"active":""} @click=${()=>{this._tab="actions"}}>
          <ha-icon icon="mdi:flash"></ha-icon>${d(this.hass,"ui.settings_tab_actions","Actions")}
        </button>
      </nav>
      <div class="content">
        ${this._tab==="ambience"?l`<ambience-ambience-settings .hass=${this.hass}></ambience-ambience-settings>`:this._tab==="conditions"?l`<ambience-conditions-settings .hass=${this.hass}></ambience-conditions-settings>`:l`<ambience-actions-settings .hass=${this.hass}></ambience-actions-settings>`}
      </div>
    `}};De.styles=v`
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
  `,u([m({attribute:!1})],De.prototype,"hass",2),u([m({attribute:!1})],De.prototype,"initialTab",2),u([g()],De.prototype,"_tab",2),De=u([x("ambience-settings-view")],De);var Ae=class extends b{constructor(){super(...arguments);this.open=!1;this._onKeydown=e=>{this.open&&e.key==="Escape"&&this._close()};this._onBackdrop=()=>{this.open&&this._close()}}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeydown),this.addEventListener("click",this._onBackdrop)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKeydown),this.removeEventListener("click",this._onBackdrop)}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?l`
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        @click=${e=>e.stopPropagation()}
      >
        <div class="header">
          <h3>${d(this.hass,"ui.tab_settings","Settings")}</h3>
          <button class="close" @click=${this._close} aria-label="Close">✕</button>
        </div>
        <div class="body">
          <ambience-settings-view
            .hass=${this.hass}
            .initialTab=${this.initialTab}
          ></ambience-settings-view>
        </div>
      </div>
    `:k}};Ae.styles=v`
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
  `,u([m({attribute:!1})],Ae.prototype,"hass",2),u([m({type:Boolean,reflect:!0})],Ae.prototype,"open",2),u([m({attribute:!1})],Ae.prototype,"initialTab",2),Ae=u([x("ambience-settings-modal")],Ae);var Ge=class extends b{constructor(){super(...arguments);this._settingsOpen=!1;this._filterCategory=er();this._onOpenSettings=e=>{let r=e.detail?.tab;this._settingsTab=r,this._settingsOpen=!0};this._onFilterChanged=e=>{this._filterCategory=e.detail?.category??"",e.stopPropagation()}}static{this.styles=v`
    :host {
      display: block;
      height: 100%;
      /* Scroll container for the sticky header below. In the panel the outer
       host is 100vh; making this the scroller lets the header pin to the top. */
      overflow: auto;
      background: var(--primary-background-color, #fafafa);
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
      background: var(--primary-background-color, #fafafa);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      /* Establish a containment context so the logo/icon swap can respond to
       the header's own width regardless of the surrounding panel/card. */
      container-type: inline-size;
    }
    /* Header contents are capped to the content width and centred, tracking the
     same reading-column cap as the body below (the card overrides this var to
     fill its width). The filter is the only in-flow child so it centres at the
     bar midpoint; the logo and cog are absolutely positioned at the edges so
     they never shift the centre. */
    .bar {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: var(--ambience-content-max-width, 60rem);
      margin: 0 auto;
      padding: 0.75rem 1rem;
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
  `}connectedCallback(){super.connectedCallback(),_e(this),this.addEventListener("ambience-open-settings",this._onOpenSettings),this.addEventListener("ambience-filter-changed",this._onFilterChanged)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("ambience-open-settings",this._onOpenSettings),this.removeEventListener("ambience-filter-changed",this._onFilterChanged)}render(){let e={dark:!!this.hass.themes?.darkMode,title:d(this.hass,"ui.panel_title","Ambience")};return l`
      <header>
        <div class="bar">
          <h1 class="brand">
            ${Qi(e)}
            ${Ji(e)}
          </h1>
          <ambience-category-filter .hass=${this.hass}></ambience-category-filter>
          <button
            class="settings-btn"
            @click=${()=>{this._settingsTab=void 0,this._settingsOpen=!0}}
            aria-label=${d(this.hass,"ui.tab_settings","Settings")}
            title=${d(this.hass,"ui.tab_settings","Settings")}
          ><ha-icon icon="mdi:cog"></ha-icon></button>
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
    `}};u([m({attribute:!1})],Ge.prototype,"hass",2),u([g()],Ge.prototype,"_settingsOpen",2),u([g()],Ge.prototype,"_settingsTab",2),u([g()],Ge.prototype,"_filterCategory",2);qi("ambience-frontend",Ge);export{Ge as AmbienceFrontend};
