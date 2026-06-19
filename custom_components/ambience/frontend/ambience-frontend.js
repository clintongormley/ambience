/* Ambience — bundled output. Do not edit by hand. */
var Yo=Object.defineProperty;var Qo=Object.getOwnPropertyDescriptor;var u=(t,n,e,i)=>{for(var r=i>1?void 0:i?Qo(n,e):n,s=t.length-1,o;s>=0;s--)(o=t[s])&&(r=(i?o(n,e,r):o(r))||r);return i&&r&&Yo(n,e,r),r};var ti=globalThis,ii=ti.ShadowRoot&&(ti.ShadyCSS===void 0||ti.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,or=Symbol(),Xr=new WeakMap,kt=class{constructor(n,e,i){if(this._$cssResult$=!0,i!==or)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(ii&&n===void 0){let i=e!==void 0&&e.length===1;i&&(n=Xr.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&Xr.set(e,n))}return n}toString(){return this.cssText}},Zr=t=>new kt(typeof t=="string"?t:t+"",void 0,or),y=(t,...n)=>{let e=t.length===1?t[0]:n.reduce((i,r,s)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[s+1],t[0]);return new kt(e,t,or)},en=(t,n)=>{if(ii)t.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let i=document.createElement("style"),r=ti.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,t.appendChild(i)}},ar=ii?t=>t:t=>t instanceof CSSStyleSheet?(n=>{let e="";for(let i of n.cssRules)e+=i.cssText;return Zr(e)})(t):t;var{is:Jo,defineProperty:Xo,getOwnPropertyDescriptor:Zo,getOwnPropertyNames:ea,getOwnPropertySymbols:ta,getPrototypeOf:ia}=Object,ri=globalThis,tn=ri.trustedTypes,ra=tn?tn.emptyScript:"",na=ri.reactiveElementPolyfillSupport,Et=(t,n)=>t,Ct={toAttribute(t,n){switch(n){case Boolean:t=t?ra:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,n){let e=t;switch(n){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},ni=(t,n)=>!Jo(t,n),rn={attribute:!0,type:String,converter:Ct,reflect:!1,useDefault:!1,hasChanged:ni};Symbol.metadata??=Symbol("metadata"),ri.litPropertyMetadata??=new WeakMap;var _e=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=rn){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(n,i,e);r!==void 0&&Xo(this.prototype,n,r)}}static getPropertyDescriptor(n,e,i){let{get:r,set:s}=Zo(this.prototype,n)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){let a=r?.call(this);s?.call(this,o),this.requestUpdate(n,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??rn}static _$Ei(){if(this.hasOwnProperty(Et("elementProperties")))return;let n=ia(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Et("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Et("properties"))){let e=this.properties,i=[...ea(e),...ta(e)];for(let r of i)this.createProperty(r,e[r])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let r of i)e.unshift(ar(r))}else n!==void 0&&e.push(ar(n));return e}static _$Eu(n,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return en(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,i){this._$AK(n,i)}_$ET(n,e){let i=this.constructor.elementProperties.get(n),r=this.constructor._$Eu(n,i);if(r!==void 0&&i.reflect===!0){let s=(i.converter?.toAttribute!==void 0?i.converter:Ct).toAttribute(e,i.type);this._$Em=n,s==null?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(n,e){let i=this.constructor,r=i._$Eh.get(n);if(r!==void 0&&this._$Em!==r){let s=i.getPropertyOptions(r),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Ct;this._$Em=r;let a=o.fromAttribute(e,s.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(n,e,i,r=!1,s){if(n!==void 0){let o=this.constructor;if(r===!1&&(s=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??ni)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:i,reflect:r,wrapped:s},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??e??this[n]),s!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(e=void 0),this._$AL.set(n,e)),r===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,s]of this._$Ep)this[r]=s;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,s]of i){let{wrapped:o}=s,a=this[r];o!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,s,a)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};_e.elementStyles=[],_e.shadowRootOptions={mode:"open"},_e[Et("elementProperties")]=new Map,_e[Et("finalized")]=new Map,na?.({ReactiveElement:_e}),(ri.reactiveElementVersions??=[]).push("2.1.2");var dr=globalThis,nn=t=>t,si=dr.trustedTypes,sn=si?si.createPolicy("lit-html",{createHTML:t=>t}):void 0,cr="$lit$",ve=`lit$${Math.random().toFixed(9).slice(2)}$`,ur="?"+ve,sa=`<${ur}>`,Ve=document,Tt=()=>Ve.createComment(""),Lt=t=>t===null||typeof t!="object"&&typeof t!="function",hr=Array.isArray,un=t=>hr(t)||typeof t?.[Symbol.iterator]=="function",lr=`[ 	
\f\r]`,St=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,on=/-->/g,an=/>/g,We=RegExp(`>|${lr}(?:([^\\s"'>=/]+)(${lr}*=${lr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ln=/'/g,dn=/"/g,hn=/^(?:script|style|textarea|title)$/i,pr=t=>(n,...e)=>({_$litType$:t,strings:n,values:e}),d=pr(1),ru=pr(2),nu=pr(3),Q=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),cn=new WeakMap,Be=Ve.createTreeWalker(Ve,129);function pn(t,n){if(!hr(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return sn!==void 0?sn.createHTML(n):n}var mn=(t,n)=>{let e=t.length-1,i=[],r,s=n===2?"<svg>":n===3?"<math>":"",o=St;for(let a=0;a<e;a++){let c=t[a],h,p,f=-1,_=0;for(;_<c.length&&(o.lastIndex=_,p=o.exec(c),p!==null);)_=o.lastIndex,o===St?p[1]==="!--"?o=on:p[1]!==void 0?o=an:p[2]!==void 0?(hn.test(p[2])&&(r=RegExp("</"+p[2],"g")),o=We):p[3]!==void 0&&(o=We):o===We?p[0]===">"?(o=r??St,f=-1):p[1]===void 0?f=-2:(f=o.lastIndex-p[2].length,h=p[1],o=p[3]===void 0?We:p[3]==='"'?dn:ln):o===dn||o===ln?o=We:o===on||o===an?o=St:(o=We,r=void 0);let v=o===We&&t[a+1].startsWith("/>")?" ":"";s+=o===St?c+sa:f>=0?(i.push(h),c.slice(0,f)+cr+c.slice(f)+ve+v):c+ve+(f===-2?a:v)}return[pn(t,s+(t[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},Pt=class t{constructor({strings:n,_$litType$:e},i){let r;this.parts=[];let s=0,o=0,a=n.length-1,c=this.parts,[h,p]=mn(n,e);if(this.el=t.createElement(h,i),Be.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(r=Be.nextNode())!==null&&c.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(let f of r.getAttributeNames())if(f.endsWith(cr)){let _=p[o++],v=r.getAttribute(f).split(ve),x=/([.?@])?(.*)/.exec(_);c.push({type:1,index:s,name:x[2],strings:v,ctor:x[1]==="."?ai:x[1]==="?"?li:x[1]==="@"?di:Ke}),r.removeAttribute(f)}else f.startsWith(ve)&&(c.push({type:6,index:s}),r.removeAttribute(f));if(hn.test(r.tagName)){let f=r.textContent.split(ve),_=f.length-1;if(_>0){r.textContent=si?si.emptyScript:"";for(let v=0;v<_;v++)r.append(f[v],Tt()),Be.nextNode(),c.push({type:2,index:++s});r.append(f[_],Tt())}}}else if(r.nodeType===8)if(r.data===ur)c.push({type:2,index:s});else{let f=-1;for(;(f=r.data.indexOf(ve,f+1))!==-1;)c.push({type:7,index:s}),f+=ve.length-1}s++}}static createElement(n,e){let i=Ve.createElement("template");return i.innerHTML=n,i}};function qe(t,n,e=t,i){if(n===Q)return n;let r=i!==void 0?e._$Co?.[i]:e._$Cl,s=Lt(n)?void 0:n._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),s===void 0?r=void 0:(r=new s(t),r._$AT(t,e,i)),i!==void 0?(e._$Co??=[])[i]=r:e._$Cl=r),r!==void 0&&(n=qe(t,r._$AS(t,n.values),r,i)),n}var oi=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:i}=this._$AD,r=(n?.creationScope??Ve).importNode(e,!0);Be.currentNode=r;let s=Be.nextNode(),o=0,a=0,c=i[0];for(;c!==void 0;){if(o===c.index){let h;c.type===2?h=new st(s,s.nextSibling,this,n):c.type===1?h=new c.ctor(s,c.name,c.strings,this,n):c.type===6&&(h=new ci(s,this,n)),this._$AV.push(h),c=i[++a]}o!==c?.index&&(s=Be.nextNode(),o++)}return Be.currentNode=Ve,r}p(n){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,e),e+=i.strings.length-2):i._$AI(n[e])),e++}},st=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,i,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=qe(this,n,e),Lt(n)?n===$||n==null||n===""?(this._$AH!==$&&this._$AR(),this._$AH=$):n!==this._$AH&&n!==Q&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):un(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==$&&Lt(this._$AH)?this._$AA.nextSibling.data=n:this.T(Ve.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:i}=n,r=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=Pt.createElement(pn(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{let s=new oi(r,this),o=s.u(this.options);s.p(e),this.T(o),this._$AH=s}}_$AC(n){let e=cn.get(n.strings);return e===void 0&&cn.set(n.strings,e=new Pt(n)),e}k(n){hr(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,r=0;for(let s of n)r===e.length?e.push(i=new t(this.O(Tt()),this.O(Tt()),this,this.options)):i=e[r],i._$AI(s),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let i=nn(n).nextSibling;nn(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Ke=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,i,r,s){this.type=1,this._$AH=$,this._$AN=void 0,this.element=n,this.name=e,this._$AM=r,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=$}_$AI(n,e=this,i,r){let s=this.strings,o=!1;if(s===void 0)n=qe(this,n,e,0),o=!Lt(n)||n!==this._$AH&&n!==Q,o&&(this._$AH=n);else{let a=n,c,h;for(n=s[0],c=0;c<s.length-1;c++)h=qe(this,a[i+c],e,c),h===Q&&(h=this._$AH[c]),o||=!Lt(h)||h!==this._$AH[c],h===$?n=$:n!==$&&(n+=(h??"")+s[c+1]),this._$AH[c]=h}o&&!r&&this.j(n)}j(n){n===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},ai=class extends Ke{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===$?void 0:n}},li=class extends Ke{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==$)}},di=class extends Ke{constructor(n,e,i,r,s){super(n,e,i,r,s),this.type=5}_$AI(n,e=this){if((n=qe(this,n,e,0)??$)===Q)return;let i=this._$AH,r=n===$&&i!==$||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,s=n!==$&&(i===$||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},ci=class{constructor(n,e,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){qe(this,n)}},fn={M:cr,P:ve,A:ur,C:1,L:mn,R:oi,D:un,V:qe,I:st,H:Ke,N:li,U:di,B:ai,F:ci},oa=dr.litHtmlPolyfillSupport;oa?.(Pt,st),(dr.litHtmlVersions??=[]).push("3.3.2");var gn=(t,n,e)=>{let i=e?.renderBefore??n,r=i._$litPart$;if(r===void 0){let s=e?.renderBefore??null;i._$litPart$=r=new st(n.insertBefore(Tt(),s),s,void 0,e??{})}return r._$AI(t),r};var mr=globalThis,b=class extends _e{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=gn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Q}};b._$litElement$=!0,b.finalized=!0,mr.litElementHydrateSupport?.({LitElement:b});var aa=mr.litElementPolyfillSupport;aa?.({LitElement:b});(mr.litElementVersions??=[]).push("4.2.2");var w=t=>(n,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(t,n)}):customElements.define(t,n)};var la={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:ni},da=(t=la,n,e)=>{let{kind:i,metadata:r}=e,s=globalThis.litPropertyMetadata.get(r);if(s===void 0&&globalThis.litPropertyMetadata.set(r,s=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(e.name,t),i==="accessor"){let{name:o}=e;return{set(a){let c=n.get.call(this);n.set.call(this,a),this.requestUpdate(o,c,t,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,t,a),a}}}if(i==="setter"){let{name:o}=e;return function(a){let c=this[o];n.call(this,a),this.requestUpdate(o,c,t,!0,a)}}throw Error("Unsupported decorator location: "+i)};function m(t){return(n,e)=>typeof e=="object"?da(t,n,e):((i,r,s)=>{let o=r.hasOwnProperty(s);return r.constructor.createProperty(s,i),o?Object.getOwnPropertyDescriptor(r,s):void 0})(t,n,e)}function g(t){return m({...t,state:!0,attribute:!1})}function _n(t,n){try{customElements.define(t,n)}catch{}}var ca=["ha-input","ha-textfield","ha-form"],ua=["ha-input","ha-textfield"];function vn(){for(let t of ua)if(customElements.get(t))return t;return null}function ee(t){let n=new WeakRef(t);for(let e of ca)customElements.get(e)||customElements.whenDefined(e).then(()=>n.deref()?.requestUpdate())}var Rt={en:{time_of_day_period:{dawn:"Dawn",morning:"Morning",afternoon:"Afternoon",evening:"Evening",nighttime:"Nighttime",daytime:"Daytime"},weekday:{mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",sun:"Sun"},day_item:{weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"},lux_range:{dark:"Dark",dim:"Dim",normal:"Normal",bright:"Bright",very_bright:"Very bright"},condition:{time_of_day:"Time of day",state:"Entity state",script:"Script",sun:"Sun",template:"Template",lux:"Lux",unavailable:"Unavailable"},action:{},anchor:{dawn:"Dawn",sunrise:"Sunrise",noon:"Noon",sunset:"Sunset",dusk:"Dusk",midnight:"Midnight"},ui:{panel_title:"Ambience",tab_settings:"Settings",settings_tab_ambience:"Advanced",settings_tab_conditions:"Conditions",settings_tab_actions:"Actions",settings_ambience_pause_card:"Scope-level pause switch",settings_ambience_field_name:"Switch name",settings_ambience_field_pause:"Pause for",settings_reapply_enable_label:"Reapply scenes after inactivity",settings_reapply_interval_label:"Reapply after",unit_minutes:"minutes",help:"Help",help_pause_switch:"Create a switch entity per area/floor/house that pauses Ambience for that scope when turned off.",help_switch_name:"The name used for the per-scope pause switch entities.",help_pause_for:"When a scope's switch is turned off, auto-resume after this many minutes. 0 = stays paused until turned back on.",help_reapply_toggle:"Check the scenes for a scope/category after inactivity and reapply the winning scene, in case any action had previously failed, such as a light not turning off.",help_reapply_after:"Reapply scenes that haven't been updated for this many minutes.",settings_expose_group:"Expose to voice assistants",settings_expose_assist:"Assist",settings_expose_google:"Google Assistant",settings_expose_alexa:"Alexa",help_expose:"Expose the per-scope pause switches to the selected voice assistants so you can pause/resume Ambience by voice. Google Assistant and Alexa require Home Assistant Cloud or a manual setup.",help_actions_tab:"Actions are the service calls a scene runs. Define them here so scenes can reuse them.",help_show_in_scene_editor:"Show this field in the scene editor so each scene can set it. Leave off to send a fixed default instead.",help_set_default:"A value sent automatically when the action runs. Scenes can override it if the field is also shown in the editor.",help_conditions_tab:"Conditions are the inputs scenes match on (time of day, presence, weather, \u2026). A scene wins when all its conditions pass.",help_categories_tab:"Categories let one scope have several independent winners at once \u2014 one scene wins per category.",no_areas:"No areas found in Home Assistant.",not_configured:"not configured",scene_singular:"scene",scene_plural:"scenes",all_categories:"All categories",add_category:"Add category\u2026",loading:"Loading\u2026",any_placeholder:"(any)",include:"Include",exclude:"Exclude",empty_all_days:"(empty \u2192 all days)",add_include_item:"+ Add include item",add_exclude_item:"+ Add exclude item",from:"from",to:"to",remove:"Remove",day_of_month_placeholder:"e.g. 1-10, 15",workday_sensor:"Workday sensor",workday_calendar:"Workday calendar",periods_heading:"Periods",badge_builtin:"builtin",badge_custom:"custom",add_custom_period:"+ Add custom period",lux_heading:"Lux ranges",add_custom_lux_range:"+ Add custom lux range",lux_modal_add_title:"Add custom lux range",lux_modal_edit_title:'Edit "{name}"',lux_min_label:"Min (lx)",lux_max_label:"Max (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"is",occupancy_is_not:"is not",lux_any:"Any of",lux_all:"All of",title_edit:"Edit",title_delete:"Delete",new_scene:"New scene",name_optional:"Name (optional)",category:"Category",scope:"Scope",when_heading:"When",actions_heading:"Actions",target:"Target",remove_action:"Remove action",add_action:"+ Add action\u2026",remove_condition:"Remove condition",add_condition:"+ Add condition\u2026",add_action_button:"Add action",cancel:"Cancel",save:"Save",save_scene:"Save scene",at_least_one_target:"At least one target is required.",condition_error:"Fix the error in this condition before continuing",no_scenes_yet:"No scenes yet.",add_scene:"+ Add scene",summary_any:"any",summary_any_paren:"(any)",summary_always:"Always",no_targets:"(no targets)",target_noun:"target",action_singular:"action",action_plural:"actions",scene_n:"Scene {n}",drag_to_reorder:"Drag to reorder",unpin:"Unpin (return to automatic order)",enable_scene:"Enable scene",disable_scene:"Disable scene",shadowed:"Never fires \u2014 shadowed by an earlier scene.",problem_missing:"Missing in Home Assistant:",problem_overlap:"Controlled by multiple groups:",problem_config:"Configuration problems:",problems_count:"{n} scene(s) have problems",badge_needs_workday_sensor:"needs a workday sensor",badge_needs_workday_calendar:"needs a workday calendar",badge_needs_weather_entity:"needs a weather entity",badge_missing_weather_group:"missing weather group {id}",badge_missing_period:"missing period {id}",badge_missing_lux_range:"missing lux range {id}",badge_unexposed_action:"action {id} not exposed",edit:"Edit",duplicate:"Duplicate",run_actions:"Run actions",run:"Run",auto_triggers_section:"Auto-triggers",auto_triggers_none:"No automatic triggers.",auto_triggers_opaque_note:"A script scene is opaque \u2014 some watches may be missing. Declare them in the scene's Triggers field.",auto_trigger_group_time:"Time",auto_trigger_group_sun:"Sun",auto_trigger_date_rollover:"Local midnight (date rollover)",auto_trigger_periodic:"periodic re-check",more_actions:"More actions",scene_actions:"Scene actions",error_enter_name:"Please enter a name.",error_start_letter:"Name must start with a letter.",error_name_exists:"An entry with this name already exists. Choose a different name.",period_modal_add_title:"Add custom period",period_modal_edit_title:'Edit "{name}"',name:"Name",name_placeholder:"e.g. Wind down",lux_name_placeholder:"e.g. Gloomy",lux_error_need_bound:"Enter a min, a max, or both.",lux_error_negative:"Bounds must be 0 or greater.",lux_error_order:"Min must be less than max.",from_label:"From",to_label:"To",any_time:"Any time",custom_range:"Custom range",custom_suffix:" (custom)",add_time_range:"+ add another time range",endpoint_time:"Time",endpoint_sun:"Sun",offset_placeholder:"Offset",clamp_none:"\u2014",clamp_not_before:"not before",clamp_not_after:"not after",unit_hour:"hour",unit_hours:"hours",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"No matching entities in this area.",field_kind:"Kind",field_days_of_month:"Days of month",field_month:"Month",field_day:"Day",field_from_month:"From month",field_from_day:"From day",field_to_month:"To month",field_to_day:"To day",day_spec_error:"Use days 1\u201331 and ranges like 1-10, separated by commas",title_override:"Override",thresholds:"Thresholds",add_threshold:"+ Add threshold",weather_entity:"Weather entity",groups:"Groups",add_group:"+ Add group",sun:{elevation:"Elevation",azimuth:"Azimuth",any:"Any",above:"Above",below:"Below",between:"Between",custom_range:"Custom range"},arguments:"Arguments",form:"Form",script:"Script",yaml:"YAML",settings_tab_categories:"Categories",category_add:"+ Add category",category_name_placeholder:"Category name",category_icon:"Icon",category_color:"Colour",category_name_blank_error:"Category names can't be empty.",category_name_duplicate_error:"Two categories can't have the same name.",category_delete_blocked_last:"You can't delete the last category.",category_delete_blocked_in_use:"This category still has scenes \u2014 move or delete them first.",category_edit_title:"Edit category",category_add_title:"Add category",category_color_none:"No colour",category_save:"Save",view_traces:"View traces",pause_scope:"Pause this scope",resume_scope:"Resume now",close:"Close",pick_service:"Pick a service",retry:"Retry",action_label_placeholder:"Label (optional)",action_no_parameters:"This action has no configurable fields.",actions_field_help_show:"Tick a checkbox to make a field editable per scene.",actions_field_help_default:"Set a default to pre-fill it.",clear_default:"Clear default",set_default:"Set default",default_prefix:"Default: ",editing:"Editing\u2026",show_in_scene_editor:"Show in scene editor",extra_fields_prefix:"Extra fields:",extra_fields_hint:"These fields aren't currently exposed but will still be sent.",service_has_no_fields:"This service has no fields.",service_unavailable:"Service not available in this HA instance.",service_not_exposed:"Service no longer exposed; configure it in Settings \u2192 Actions or remove this action.",occupancy_any:"Any of",occupancy_all:"All of",occupancy_detected:"Detected",occupancy_clear:"Clear",occupancy_for:"for",day_pick_weekday:"Pick at least one day of the week.",state_sentinel:"State",invalid_datetime:"Enter a valid date and time.",simulate_title:"Simulate",simulate_when_hint:"drives sun, time-of-day, weekday & workday",simulate_inputs_heading:"Inputs this category depends on",simulate_button:"Simulate",reset_to_now:"Reset to now",reset_to_live:"Reset to live",true_label:"True",false_label:"False",for_at_least:"at least",for_less_than:"less than",for_label:"For",duration_held_hint:"How long it has held this state (h:m:s)",away:"Away",home:"Home",refresh:"Refresh",new_traces_refresh:"New traces \u2014 refresh",clear_traces:"Clear",download_diagnostics:"Download diagnostics",no_traces_yet:"No traces for this category yet.",yaml_expect_object:"Expected an object",yaml_script_string:"`script` must be a 'script.<name>' string",yaml_args_object:"`args` must be an object if present",yaml_triggers_list:"`triggers` must be a list of entity_id strings if present",template_result:"Result",template_truthy:"true \u2014 matches",template_falsy:"false \u2014 no match",conditions_hint_body:"Configure Workday and Weather in Conditions to use them in your scene conditions.",conditions_hint_body_weather:"Configure Weather in Conditions to use it in your scene conditions.",conditions_hint_body_workday:"Configure Workday in Conditions to use it in your scene conditions.",conditions_hint_cta:"Configure conditions",conditions_hint_title:"Optional: set up Workday & Weather",conditions_hint_title_weather:"Optional: set up Weather",conditions_hint_title_workday:"Optional: set up Workday",dismiss:"Dismiss",for_prefix:"for",name_duplicate:"A scene with this name already exists in this category.",no_actions_body:"Ambience can't apply anything until you expose at least one action \u2014 scenes need actions to run.",no_actions_cta:"Set up actions",no_actions_title:"Set up an action to get started",no_exposed_actions:"Add services in Settings \u2192 Actions.",people_for:"for",people_is_at:"Is at",people_is_at_static:"is at",people_is_not_at:"Is not at",people_mode_all:"All of:",people_mode_any:"Any of:",people_mode_anybody:"Anybody",people_mode_everybody:"Everybody",people_mode_nobody:"Nobody",people_mode_none:"None of:",people_none_tracked:"No people tracked",people_select_one:"Select at least one person",unavailable_select_one:"Select at least one entity",people_where_home:"Home",scope_house:"House",script_triggers:"Triggers",script_triggers_help:"Re-evaluate this scene when these entities change. A script is opaque, so templated references may be missed \u2014 add any it depends on.",script_triggers_none:"No triggers",simulate:"Simulate",state_add_condition:"Add condition",state_add_first:"Add condition",state_add_value:"+ Add state",state_attribute_placeholder:"leave blank to compare state",state_entity:"Entity",state_err_entity:"Entity is required",state_err_incomplete:"This condition is incomplete",state_err_numeric:"Value must be a number",state_err_state:"State is required",state_err_value:"Value is required",state_for:"For (optional)",state_new_condition:"(new condition)",state_not_toggle:"Negate (NOT)",state_op_header:"Comparison",state_unwrap_group:"Remove these parens (promote children to parent)",state_value_label:"Value",state_where:"Where",state_wrap:"Wrap in group",show_more_info:"Show more info",cause_has_time:"Periodic time check",cause_switch:"Switch turned on",cause_manual:"Manual apply",cause_startup:"Startup",cause_reloaded:"Reloaded",cause_simulated:"Simulation",cause_clock:"Time of day",cause_sun:"Sun position",cause_reapply:"Reapply",outcome_label_acted:"applied",outcome_label_no_op:"blocked",outcome_label_debounced:"unchanged",outcome_label_no_match:"no match",outcome_label_skipped:"skipped",count_action_one:"{n} action",count_action_other:"{n} actions",count_entity_one:"{n} entity",count_entity_other:"{n} entities",winner_default:"The matching scene",outcome_summary_acted_all_skipped:"{winner} matched \u2014 {skipped_phrase} skipped (not exposed); nothing applied.",outcome_summary_acted_entities:"Applied {winner} \u2014 {acts} on {entities}.{tail}",outcome_summary_acted:"Applied {winner} \u2014 {acts}.{tail}",outcome_summary_skipped_tail:" ({skipped} skipped \u2014 not exposed)",outcome_summary_no_op:"{winner} matched but has no actions \u2014 it blocks lower scenes from applying. Nothing changed.",outcome_summary_debounced:"{winner} matched, but it's already applied \u2014 nothing was re-sent.",outcome_summary_no_match:"No scene matched \u2014 nothing applied.",outcome_summary_skipped_switch_off:"Skipped \u2014 the category switch is off.",outcome_summary_skipped_scope_disabled:"Skipped \u2014 the scope is disabled.",outcome_summary_skipped_unavailable:"Skipped \u2014 the triggering entity went unavailable; devices left as they are."},blocker_summary:{block:"Block",block_mid:"block",until:"until",while:"while",while_lead:"While",or:"or",and:"and",always:"always"},day_summary:{any:"any",any_day:"any day",except:"except",day_prefix:"day",last_day:"last day",workday:"workday",holiday:"holiday",first_workday:"first workday",last_workday:"last workday"},month:{1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"},weather_condition:{"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"},weather_attr:{temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"},state_op:{is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"}},es:{ui:{close:"Cerrar",cancel:"Cancelar",save:"Guardar"}}},qu=Rt.en;function ha(t){let n=t?.language?.toLowerCase().split(/[-_]/)[0];return n&&n in Rt?n:"en"}function yn(t,n){return n?t.replace(/\{(\w+)\}/g,(e,i)=>i in n?n[i]:e):t}function pa(t,n){let e="component.ambience.";if(!n.startsWith(e))return;let i=n.slice(e.length).split("."),r=a=>{let c=a;for(let h of i){if(c===null||typeof c!="object")return;c=c[h]}return typeof c=="string"?c:void 0},s=ha(t),o=Rt[s];if(o){let a=r(o);if(a!==void 0)return a}if(s!=="en"){let a=Rt.en;if(a)return r(a)}}function te(t,n,e,i){let r=i?Object.entries(i).flat():[],s=t?.localize?.(n,...r);if(s&&s!==n)return s;let o=pa(t,n);return yn(o!==void 0?o:e,i)}function F(t){let n=t.replaceAll("_"," ").toLowerCase();return n.charAt(0).toUpperCase()+n.slice(1)}function fr(t){return F(t)}function hi(t){let n=t.indexOf("."),e=n===-1?"":t.slice(0,n),r=(n===-1?t:t.slice(n+1)).replaceAll("_"," ").trim().toLowerCase(),s=e.replaceAll("_"," ").trim().toLowerCase(),o=r?r.split(" "):[],a=s?s.split(" "):[],c=a.length>0&&a.every(p=>o.includes(p)),h=!s||c?r:`${r} ${s}`;return h.charAt(0).toUpperCase()+h.slice(1)}function ot(t,n,e){let i=n?.find(r=>r.id===t);return i?.label?.trim()?i.label:e()}function ma(t){return t.replace(/_/g," ").replace(/\bid\b/g,"ID").replace(/\bip\b/g,"IP").replace(/\bmac\b/g,"MAC").replace(/\bgps\b/g,"GPS").replace(/^\w/,n=>n.toUpperCase())}function pi(t,n,e){let i=t?.formatEntityAttributeName;if(i&&n){let r=i(n,e);if(r)return r}return ma(e)}function at(t,n,e,i){if(!n)return i;let r=t;if(e){let s=r?.formatEntityAttributeValue;if(s){let o=s(n,e,i);if(o)return o}}else{let s=r?.formatEntityState;if(s){let o=s(n,i);if(o)return o}}return i}function q(t,n){return te(t,`component.ambience.condition.${n}`,fr(n))}function mi(t,n){return te(t,`component.ambience.action.${n}`,fr(n))}function ke(t,n){return te(t,`component.ambience.anchor.${n}`,fr(n))}function Ee(t,n,e){let i=e[n]?.label;return i||te(t,`component.ambience.time_of_day_period.${n}`,F(n))}function lt(t,n,e){let i=e[n]?.label;return i||te(t,`component.ambience.lux_range.${n}`,F(n))}function l(t,n,e,i){return te(t,`component.ambience.${n}`,e,i)}var fa=["mon","tue","wed","thu","fri","sat","sun"];function fi(t,n){let e=fa[n];return te(t,`component.ambience.weekday.${e}`,e??String(n))}function gi(t,n){return te(t,`component.ambience.day_item.${n}`,F(n))}function dt(t,n){return te(t,`component.ambience.month.${n}`,String(n))}function ct(t,n){return te(t,`component.ambience.weather_condition.${n}`,F(n))}function At(t,n){return te(t,`component.ambience.weather_attr.${n}`,F(n))}var ga={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},_a={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},va={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function gr(t,n,e){if(n==="humidity")return"%";let i=va[n];if(i){let o=e?.attributes?.[i];if(typeof o=="string"&&o)return o}let r=_a[n],s=t?.config?.unit_system;return r&&s&&typeof s[r]=="string"?s[r]:ga[n]??""}function C(t,n){let e=n,i=e?.translation_key;if(i){let r=e?.translation_placeholders??{},s=`component.ambience.exceptions.${i}`,o=t?.localize?.(s,...Object.entries(r).flat());if(o&&o!==s)return o}return e?.message?e.message:n instanceof Error?n.message:String(n)}function ie(t,n){return te(t,`component.ambience.state_op.${n}`,n)}var ya=import.meta.url.slice(0,import.meta.url.lastIndexOf("/")+1);function bn(t){return ya+t}function wn(t,n,e){let i=e.title??"Ambience",r=e.dark?`dark_${t}`:t,s=bn(`${r}.png`),o=bn(`${r}@2x.png`);return d`<img
    class=${n}
    src=${s}
    srcset="${s} 1x, ${o} 2x"
    alt=${i}
  />`}function xn(t={}){return wn("logo","ambience-logo",t)}function $n(t={}){return wn("icon","ambience-icon",t)}var kn="ambience-filter-category",En="ambience-expanded-scopes",Cn="ambience-collapsed-categories",Sn="ambience-conditions-hint-dismissed";function _i(){try{return window.localStorage.getItem(kn)??""}catch{return""}}function Tn(t){try{window.localStorage.setItem(kn,t)}catch{}}function Ln(){try{let t=window.localStorage.getItem(En);if(!t)return[];let n=JSON.parse(t);return Array.isArray(n)?n.filter(e=>typeof e=="string"):[]}catch{return[]}}function Pn(t){try{window.localStorage.setItem(En,JSON.stringify(t))}catch{}}function Rn(){try{let t=window.localStorage.getItem(Cn);if(!t)return[];let n=JSON.parse(t);return Array.isArray(n)?n.filter(e=>typeof e=="string"):[]}catch{return[]}}function An(t){try{window.localStorage.setItem(Cn,JSON.stringify(t))}catch{}}function Dn(){try{return window.localStorage.getItem(Sn)==="1"}catch{return!1}}function Hn(){try{window.localStorage.setItem(Sn,"1")}catch{}}async function On(t){return t.callWS({type:"ambience/areas/list"})}async function vi(t,n){return t.callWS({type:"ambience/area/get",area_id:n})}async function Nn(t,n,e){return t.callWS({type:"ambience/area/save",area_id:n,config:e})}async function In(t){return t.callWS({type:"ambience/floors/list"})}async function yi(t,n){return t.callWS({type:"ambience/floor/get",floor_id:n})}async function Fn(t,n,e){return t.callWS({type:"ambience/floor/save",floor_id:n,config:e})}async function bi(t){return t.callWS({type:"ambience/house/get"})}async function Mn(t,n){return t.callWS({type:"ambience/house/save",config:n})}async function wi(t){return t.callWS({type:"ambience/conditions/list"})}async function jn(t,n,e,i){let r={type:"ambience/auto_triggers/list",scope_kind:n};return e!=null&&(r.scope_id=e),i!=null&&(r.category=i),t.callWS(r)}async function Dt(t){return t.callWS({type:"ambience/exposed_actions/list"})}async function zn(t,n){return t.callWS({type:"ambience/exposed_actions/save",actions:n})}async function Un(t){return t.callWS({type:"ambience/services/list"})}async function Ce(t,n){return t.callWS({type:"ambience/services/get_schema",service:n})}function _r(t){return t.kind==="area"?{area_id:t.id}:t.kind==="floor"?{floor_id:t.id}:{house:!0}}async function Wn(t,n,e){let i={type:"ambience/apply",..._r(n)};return e!==void 0&&(i.category_id=e),t.callWS(i)}async function Bn(t,n,e){return t.callWS({type:"ambience/scene/run_actions",scene_index:e,..._r(n)})}async function xi(t){return t.callWS({type:"ambience/time_of_day_periods/list"})}async function Vn(t,n,e){return t.callWS({type:"ambience/time_of_day_periods/save",custom:n,hidden:e})}async function $i(t){return t.callWS({type:"ambience/lux_ranges/list"})}async function qn(t,n,e){return t.callWS({type:"ambience/lux_ranges/save",custom:n,hidden:e})}async function Ht(t){return t.callWS({type:"ambience/conditions/day/config/list"})}async function Kn(t,n,e){return t.callWS({type:"ambience/conditions/day/config/save",workday_sensor:n,workday_calendar:e})}async function Ot(t){return t.callWS({type:"ambience/conditions/weather/config/list"})}async function Gn(t,n,e){return t.callWS({type:"ambience/conditions/weather/config/save",entity:n,groups:e})}async function vr(t,n){return t.callWS({type:"ambience/state/known_states",entity_id:n})}async function yr(t,n,e){return t.callWS({type:"ambience/state/known_attribute_values",entity_id:n,attribute:e})}async function Yn(t){return t.callWS({type:"ambience/switch_defaults/list"})}async function Qn(t){return t.callWS({type:"ambience/switches/list"})}async function Jn(t,n,e){return t.callWS({type:"ambience/set_scope_enabled",..._r(n),enabled:e})}async function Xn(t,n,e,i){return t.callWS({type:"ambience/switch_defaults/save",name:n,auto_on_delay_seconds:e,create_switches:i})}async function Zn(t){return t.callWS({type:"ambience/reapply/list"})}async function es(t,n,e){return t.callWS({type:"ambience/reapply/save",enabled:n,interval_seconds:e})}async function ts(t){return t.callWS({type:"ambience/exposed_assistants/list"})}async function is(t,n,e,i){return t.callWS({type:"ambience/exposed_assistants/save",expose_assist:n,expose_google:e,expose_alexa:i})}async function Ge(t){return(await t.callWS({type:"ambience/categories/list"})).categories}async function rs(t,n){await t.callWS({type:"ambience/categories/save",categories:n})}async function ns(t,n){await t.callWS({type:"ambience/categories/delete",category_id:n})}async function br(t){return(await t.callWS({type:"ambience/traces/list"})).traces}async function ss(t){await t.callWS({type:"ambience/traces/clear"})}async function os(t,n,e){let i=await t.callWS({type:"ambience/diagnostics/scope",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e}),r=`ambience-${n.scope_kind}-${n.scope_id??"house"}-${e}.json`,s=new Blob([JSON.stringify(i,null,2)],{type:"application/json"}),o=URL.createObjectURL(s),a=document.createElement("a");a.href=o,a.download=r,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(o),1e4)}async function as(t,n,e){return t.callWS({type:"ambience/simulate/inputs",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e})}async function ls(t,n,e,i,r,s){return(await t.callWS({type:"ambience/simulate",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e,now:i,overrides:r,verdicts:s})).result}var wr=[{id:"red",label:"Red",hex:"#f44336"},{id:"pink",label:"Pink",hex:"#e91e63"},{id:"purple",label:"Purple",hex:"#9c27b0"},{id:"deep-purple",label:"Deep purple",hex:"#673ab7"},{id:"indigo",label:"Indigo",hex:"#3f51b5"},{id:"blue",label:"Blue",hex:"#2196f3"},{id:"light-blue",label:"Light blue",hex:"#03a9f4"},{id:"cyan",label:"Cyan",hex:"#00bcd4"},{id:"teal",label:"Teal",hex:"#009688"},{id:"green",label:"Green",hex:"#4caf50"},{id:"light-green",label:"Light green",hex:"#8bc34a"},{id:"lime",label:"Lime",hex:"#cddc39"},{id:"yellow",label:"Yellow",hex:"#ffeb3b"},{id:"amber",label:"Amber",hex:"#ffc107"},{id:"orange",label:"Orange",hex:"#ff9800"},{id:"deep-orange",label:"Deep orange",hex:"#ff5722"},{id:"brown",label:"Brown",hex:"#795548"},{id:"grey",label:"Grey",hex:"#9e9e9e"},{id:"blue-grey",label:"Blue grey",hex:"#607d8b"}];function xr(t){if(t)return wr.find(n=>n.id===t)?.hex}function ba(t){let n=t.replace("#",""),e=parseInt(n.slice(0,2),16)/255,i=parseInt(n.slice(2,4),16)/255,r=parseInt(n.slice(4,6),16)/255,s=a=>a<=.03928?a/12.92:((a+.055)/1.055)**2.4;return .2126*s(e)+.7152*s(i)+.0722*s(r)>.5?"#000000":"#ffffff"}function ki(t){let n=xr(t);return n?`background:${n};color:${ba(n)}`:""}var Ei=y`
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
`;function ut(t,n){return d`<span class="category-swatch" style=${ki(t)}>
    ${n?d`<ha-icon icon=${n}></ha-icon>`:""}
  </span>`}var oe=class extends b{constructor(){super(...arguments);this._categories=[];this._sortedCategories=[];this._filterCategory=_i();this._open=!1;this._loaded=!1;this._onCategoriesChanged=async()=>{try{await this._fetchCategories()}catch{}};this._onDocClick=e=>{this._open&&!e.composedPath().includes(this)&&(this._open=!1)}}async _fetchCategories(){let e=await Ge(this.hass);this.isConnected&&(this._categories=e,this._filterCategory&&!e.some(i=>i.id===this._filterCategory)&&this._select(""))}async connectedCallback(){super.connectedCallback(),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("click",this._onDocClick);try{await this._fetchCategories()}catch{}finally{this.isConnected&&(this._loaded=!0)}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("click",this._onDocClick)}willUpdate(e){e.has("_categories")&&(this._sortedCategories=[...this._categories].sort((i,r)=>i.name.localeCompare(r.name)))}_select(e){this._filterCategory=e,Tn(e),this._open=!1,this.dispatchEvent(new CustomEvent("ambience-filter-changed",{detail:{category:e},bubbles:!0,composed:!0}))}_openSettings(){this._open=!1,this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:"categories"},bubbles:!0,composed:!0}))}_renderEntry(e){return e===null?d`
        ${ut(void 0,"mdi:filter-variant")}
        <span class="category-name"
          >${l(this.hass,"ui.all_categories","All categories")}</span
        >
      `:d`
      ${ut(e.color,e.icon)}
      <span class="category-name">${e.name}</span>
    `}_renderAddCategory(e){return d`
      <button
        class="category-filter-add${e?" category-filter-add--footer":""}"
        @click=${()=>this._openSettings()}
      >
        <ha-icon icon="mdi:plus"></ha-icon>
        <span class="category-name"
          >${l(this.hass,"ui.add_category","Add category\u2026")}</span
        >
      </button>
    `}render(){if(!this._loaded)return d``;if(this._categories.length<=1)return this._renderAddCategory(!1);let e=this._sortedCategories,i=this._categories.find(r=>r.id===this._filterCategory)??null;return d`
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
        ${this._open?d`
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
                  ${e.map(r=>d`<button
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
            `:$}
      </div>
    `}};oe.styles=[Ei,y`
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
    `],u([m({attribute:!1})],oe.prototype,"hass",2),u([g()],oe.prototype,"_categories",2),u([g()],oe.prototype,"_filterCategory",2),u([g()],oe.prototype,"_open",2),u([g()],oe.prototype,"_loaded",2),oe=u([w("ambience-category-filter")],oe);var ye={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ci=t=>(...n)=>({_$litDirective$:t,values:n}),ht=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,i){this._$Ct=n,this._$AM=e,this._$Ci=i}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:wa}=fn,ds=t=>t;var us=t=>t.strings===void 0,cs=()=>document.createComment(""),pt=(t,n,e)=>{let i=t._$AA.parentNode,r=n===void 0?t._$AB:n._$AA;if(e===void 0){let s=i.insertBefore(cs(),r),o=i.insertBefore(cs(),r);e=new wa(s,o,t,t.options)}else{let s=e._$AB.nextSibling,o=e._$AM,a=o!==t;if(a){let c;e._$AQ?.(t),e._$AM=t,e._$AP!==void 0&&(c=t._$AU)!==o._$AU&&e._$AP(c)}if(s!==r||a){let c=e._$AA;for(;c!==s;){let h=ds(c).nextSibling;ds(i).insertBefore(c,r),c=h}}}return e},Se=(t,n,e=t)=>(t._$AI(n,e),t),xa={},Si=(t,n=xa)=>t._$AH=n,hs=t=>t._$AH,Ti=t=>{t._$AR(),t._$AA.remove()};var ps=(t,n,e)=>{let i=new Map;for(let r=n;r<=e;r++)i.set(t[r],r);return i},ms=Ci(class extends ht{constructor(t){if(super(t),t.type!==ye.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,n,e){let i;e===void 0?e=n:n!==void 0&&(i=n);let r=[],s=[],o=0;for(let a of t)r[o]=i?i(a,o):o,s[o]=e(a,o),o++;return{values:s,keys:r}}render(t,n,e){return this.dt(t,n,e).values}update(t,[n,e,i]){let r=hs(t),{values:s,keys:o}=this.dt(n,e,i);if(!Array.isArray(r))return this.ut=o,s;let a=this.ut??=[],c=[],h,p,f=0,_=r.length-1,v=0,x=s.length-1;for(;f<=_&&v<=x;)if(r[f]===null)f++;else if(r[_]===null)_--;else if(a[f]===o[v])c[v]=Se(r[f],s[v]),f++,v++;else if(a[_]===o[x])c[x]=Se(r[_],s[x]),_--,x--;else if(a[f]===o[x])c[x]=Se(r[f],s[x]),pt(t,c[x+1],r[f]),f++,x--;else if(a[_]===o[v])c[v]=Se(r[_],s[v]),pt(t,r[f],r[_]),_--,v++;else if(h===void 0&&(h=ps(o,v,x),p=ps(a,f,_)),h.has(a[f]))if(h.has(a[_])){let E=p.get(o[v]),P=E!==void 0?r[E]:null;if(P===null){let Y=pt(t,r[f]);Se(Y,s[v]),c[v]=Y}else c[v]=Se(P,s[v]),pt(t,r[f],P),r[E]=null;v++}else Ti(r[_]),_--;else Ti(r[f]),f++;for(;v<=x;){let E=pt(t,c[x+1]);Se(E,s[v]),c[v++]=E}for(;f<=_;){let E=r[f++];E!==null&&Ti(E)}return this.ut=o,Si(t,c),Q}});function O(t){return t.kind==="house"?"house":`${t.kind}:${t.id}`}function fs(t,n){return`${O(t)}\0${n}`}function Nt(t,n){return fs(t,n)}function Li(t,n){return fs(t,n)}function gs(t,n){if(!n||n.entity==null)return[...t];let e=Array.isArray(n.entity)?n.entity:[n.entity];if(e.length===0)return[...t];let i=new Set,r=!1;for(let s of e){if(!s||typeof s!="object")continue;let o=s.domain;if(o==null){r=!0;continue}if(Array.isArray(o))for(let a of o)typeof a=="string"&&i.add(a);else typeof o=="string"&&i.add(o)}return r||i.size===0?[...t]:t.filter(s=>{let o=s.indexOf(".");return o<0?!1:i.has(s.slice(0,o))})}function Pi(t,n,e=[]){let i=t;if(!i?.entities)return[];let r=i.entities,s=i.devices??{},o=i.areas??{},a=n.kind==="area"?new Set([n.id]):n.kind==="floor"?new Set(Object.values(o).filter(h=>h.floor_id===n.id).map(h=>h.area_id)):null,c=h=>{let p=h.area_id??(h.device_id?s[h.device_id]?.area_id??null:null);return p==null?!1:a===null?!0:a.has(p)};return Object.values(r).filter(c).filter(h=>e.length===0||e.includes(h.entity_id.split(".")[0])).map(h=>h.entity_id).sort()}var $r=Ci(class extends ht{constructor(t){if(super(t),t.type!==ye.PROPERTY&&t.type!==ye.ATTRIBUTE&&t.type!==ye.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!us(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[n]){if(n===Q||n===$)return n;let e=t.element,i=t.name;if(t.type===ye.PROPERTY){if(n===e[i])return Q}else if(t.type===ye.BOOLEAN_ATTRIBUTE){if(!!n===e.hasAttribute(i))return Q}else if(t.type===ye.ATTRIBUTE&&e.getAttribute(i)===n+"")return Q;return Si(t),n}});function Ri(t){let{checked:n,dataTest:e,onChange:i,className:r,onClick:s,disabled:o}=t;return customElements.get("ha-switch")?d`<ha-switch
      class=${r??$}
      data-test=${e}
      ?disabled=${o??!1}
      .checked=${$r(n)}
      @click=${s}
      @change=${i}
    ></ha-switch>`:d`<input
    class=${r??$}
    data-test=${e}
    type="checkbox"
    ?disabled=${o??!1}
    .checked=${$r(n)}
    @click=${s}
    @change=${i}
  />`}function It(t){let{priority:n,pinned:e,shadowed_by:i,...r}=t;return r}function _s(t,n){if(n<0||n>=t.length)return[];let e=new Set(t[n].entity_ids??[]),i=new Set;return t.forEach((r,s)=>{if(s!==n)for(let o of r.entity_ids??[])e.has(o)||i.add(o)}),[...i]}var kr={house:"mdi:home",floor:"mdi:layers",area:"mdi:texture-box"};function Ft(t,n){return t.kind==="house"?kr.house:t.kind==="floor"?n?.floors?.[t.id]?.icon||kr.floor:n?.areas?.[t.id]?.icon||kr.area}function Ai(t){if(t.enabled===!1)return{severity:null,missing:[],overlap:[],shadowed:!1,configIssues:[]};let n=t.missing_entities??[],e=t.overlap_entities??[],i=t.config_issues??[],r=t.shadowed_by!=null;return{severity:n.length>0||i.length>0?"error":e.length>0||r?"warning":null,missing:n,overlap:e,shadowed:r,configIssues:i}}function vs(t){let n=null;for(let e of t){let i=Ai(e).severity;if(i==="error")return"error";i==="warning"&&(n="warning")}return n}function ys(t){return t.filter(n=>Ai(n).severity!=null).length}var $a={missing_workday_sensor:["ui.badge_needs_workday_sensor","needs a workday sensor"],missing_workday_calendar:["ui.badge_needs_workday_calendar","needs a workday calendar"],missing_weather_entity:["ui.badge_needs_weather_entity","needs a weather entity"],missing_weather_group:["ui.badge_missing_weather_group","missing weather group {id}"],missing_period:["ui.badge_missing_period","missing period {id}"],missing_lux_range:["ui.badge_missing_lux_range","missing lux range {id}"],unexposed_action:["ui.badge_unexposed_action","action {id} not exposed"]};function bs(t,n){let e=$a[n.kind];return(e?l(t,e[0],e[1]):n.kind).replace("{id}",n.ref)}var mt=null;function Di(t,n){let e=vs(n);if(!e)return"";let i=ys(n),r=l(t,"ui.problems_count","{n} scene(s) have problems").replace("{n}",String(i));return d`<ambience-problem-flag
    .severity=${e}
    .details=${[r]}
    .summary=${r}
  ></ambience-problem-flag>`}var be=class extends b{constructor(){super(...arguments);this.severity="warning";this.details=[];this.summary="";this._open=!1;this._onDocClick=e=>{this._open&&!e.composedPath().includes(this)&&this._setOpen(!1)}}disconnectedCallback(){this._open&&this._setOpen(!1),super.disconnectedCallback()}_setOpen(e){e?(mt&&mt!==this&&mt._setOpen(!1),mt=this,document.addEventListener("click",this._onDocClick,!0)):(mt===this&&(mt=null),document.removeEventListener("click",this._onDocClick,!0)),this._open=e}_toggle(e){e.stopPropagation(),this._setOpen(!this._open)}render(){return d`
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
      ${this._open?d`<div
            class="details"
            role="tooltip"
            @click=${e=>e.stopPropagation()}
          >
            ${this.details.map(e=>d`<div>${e}</div>`)}
          </div>`:""}
    `}};be.styles=y`
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
  `,u([m()],be.prototype,"severity",2),u([m({attribute:!1})],be.prototype,"details",2),u([m()],be.prototype,"summary",2),u([g()],be.prototype,"_open",2),be=u([w("ambience-problem-flag")],be);function ae(t){return t.enabled===!1?{scenes:t.scenes??[],enabled:!1}:{scenes:t.scenes??[]}}function M(){return(t,n)=>{let e=Symbol(String(n));Object.defineProperty(t,n,{get(){return this[e]},set(i){Object.is(this[e],i)||(this[e]=i,this._host?.requestUpdate())},configurable:!0,enumerable:!0})}}var D=class{constructor(n){this._host=n;this.areas=[];this.floors=[];this.areaConfigs=new Map;this.floorConfigs=new Map;this.house={scenes:[]};this.switchEntityIds=new Map;this.areasLoaded=!1;this.conditions=[];this.actions=[];this.categories=[];this.schemas={};this.staticLoaded=!1;this.error="";this._onExposedActionsChanged=async()=>{try{let n=await Dt(this._hass);if(!this._host.isConnected)return;this.actions=n,await this._refreshSchemas(n),await this.reloadConfigs()}catch{}};this._onCategoriesChanged=async()=>{try{let n=await Ge(this._hass);if(!this._host.isConnected)return;this.categories=n}catch{}};this._onConditionsChanged=async()=>{try{let[n,e]=await Promise.all([Ht(this._hass),Ot(this._hass)]);if(!this._host.isConnected)return;this.dayConfig=n,this.weatherConfig=e}catch{}};n.addController(this)}get _hass(){return this._host.hass}hostConnected(){window.addEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("ambience-conditions-changed",this._onConditionsChanged),this._tick=setInterval(()=>{for(let n of this.switchEntityIds.values())if(this._hass.states?.[n]?.state==="off"){this._host.requestUpdate();return}},1e3)}hostDisconnected(){window.removeEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("ambience-conditions-changed",this._onConditionsChanged),this._tick&&clearInterval(this._tick),this._tick=void 0,this._unsubArea?.(),this._unsubArea=void 0,this._unsubFloor?.(),this._unsubFloor=void 0,this._unsubEntity?.(),this._unsubEntity=void 0}async subscribe(n){let e=this._hass.connection.subscribeEvents(c=>{c.data.action==="remove"&&n({kind:"area",id:c.data.area_id}),this.refreshAreas(),c.data.action!=="update"&&this.refreshSwitches()},"area_registry_updated"),i=this._hass.connection.subscribeEvents(c=>{c.data.action==="remove"&&n({kind:"floor",id:c.data.floor_id}),this.refreshFloors(),c.data.action!=="update"&&this.refreshSwitches()},"floor_registry_updated"),r=this._hass.connection.subscribeEvents(c=>{c.data.action!=="update"&&c.data.entity_id.startsWith("switch.")&&this.refreshSwitches()},"entity_registry_updated"),[s,o,a]=await Promise.all([e,i,r]);this._host.isConnected?(this._unsubArea=s,this._unsubFloor=o,this._unsubEntity=a):(s(),o(),a())}async loadStatic(){try{let[n,e,i,r,s,o,a]=await Promise.all([wi(this._hass),Dt(this._hass),xi(this._hass),$i(this._hass),Ht(this._hass),Ot(this._hass),Ge(this._hass)]);if(!this._host.isConnected)return;this.conditions=n,this.actions=e,this.periods=i,this.luxRanges=r,this.dayConfig=s,this.weatherConfig=o,this.categories=a,this.staticLoaded=!0,await this._refreshSchemas(e)}catch(n){this.error=C(this._hass,n)}}async _refreshSchemas(n){let e=await Promise.all(n.map(async r=>{try{let s=await Ce(this._hass,r.id);return[r.id,s]}catch{return[r.id,null]}}));if(!this._host.isConnected)return;let i={};for(let[r,s]of e)s&&(i[r]=s);this.schemas=i}async refreshAreas(){try{let n=await On(this._hass),e=this.areaConfigs,i=new Map;if(await Promise.all(n.map(async r=>{let s=e.get(r.area_id);if(s){i.set(r.area_id,s);return}i.set(r.area_id,ae(await vi(this._hass,r.area_id)))})),!this._host.isConnected)return;this.areas=n,this.areaConfigs=i}catch(n){this.error=C(this._hass,n)}finally{this._host.isConnected&&(this.areasLoaded=!0)}}async refreshFloors(){try{let n=(await In(this._hass)).slice().sort((r,s)=>r.name.localeCompare(s.name)),e=this.floorConfigs,i=new Map;if(await Promise.all(n.map(async r=>{let s=e.get(r.floor_id);if(s){i.set(r.floor_id,s);return}i.set(r.floor_id,ae(await yi(this._hass,r.floor_id)))})),!this._host.isConnected)return;this.floors=n,this.floorConfigs=i}catch(n){this.error=C(this._hass,n)}}async refreshHouse(){try{let n=ae(await bi(this._hass));if(!this._host.isConnected)return;this.house=n}catch(n){this.error=C(this._hass,n)}}async reloadConfigs(){let[n,e,i]=await Promise.all([Promise.all(this.areas.map(async r=>[r.area_id,ae(await vi(this._hass,r.area_id))])),Promise.all(this.floors.map(async r=>[r.floor_id,ae(await yi(this._hass,r.floor_id))])),bi(this._hass)]);this._host.isConnected&&(this.areaConfigs=new Map(n),this.floorConfigs=new Map(e),this.house=ae(i))}async refreshSwitches(){try{let n=await Qn(this._hass);if(!this._host.isConnected)return;this.switchEntityIds=new Map(n.map(e=>{let i=e.scope_kind==="house"?{kind:"house"}:{kind:e.scope_kind,id:e.scope_id};return[O(i),e.entity_id]}))}catch(n){this.error=C(this._hass,n)}}getConfig(n){return n.kind==="house"?this.house:n.kind==="area"?this.areaConfigs.get(n.id):this.floorConfigs.get(n.id)}setConfig(n,e){if(n.kind==="house")this.house=e;else if(n.kind==="area"){let i=new Map(this.areaConfigs);i.set(n.id,e),this.areaConfigs=i}else{let i=new Map(this.floorConfigs);i.set(n.id,e),this.floorConfigs=i}}async mutate(n,e){let i=this.getConfig(n);this.setConfig(n,e),this.error="";try{let r;return n.kind==="house"?r=await Mn(this._hass,e):n.kind==="area"?r=await Nn(this._hass,n.id,e):r=await Fn(this._hass,n.id,e),this.setConfig(n,ae(r.config)),!0}catch(r){return i&&this.setConfig(n,i),this.error=C(this._hass,r),!1}}async reloadScope(n){try{let e;if(n.kind==="house"?e=ae(await bi(this._hass)):n.kind==="area"?e=ae(await vi(this._hass,n.id)):e=ae(await yi(this._hass,n.id)),!this._host.isConnected)return;this.setConfig(n,e)}catch(e){this.error=C(this._hass,e)}}};u([M()],D.prototype,"areas",2),u([M()],D.prototype,"floors",2),u([M()],D.prototype,"areaConfigs",2),u([M()],D.prototype,"floorConfigs",2),u([M()],D.prototype,"house",2),u([M()],D.prototype,"switchEntityIds",2),u([M()],D.prototype,"areasLoaded",2),u([M()],D.prototype,"conditions",2),u([M()],D.prototype,"actions",2),u([M()],D.prototype,"categories",2),u([M()],D.prototype,"schemas",2),u([M()],D.prototype,"periods",2),u([M()],D.prototype,"luxRanges",2),u([M()],D.prototype,"dayConfig",2),u([M()],D.prototype,"weatherConfig",2),u([M()],D.prototype,"staticLoaded",2),u([M()],D.prototype,"error",2);var le=class extends b{constructor(){super(...arguments);this.items=[];this.muted=!1;this._open=!1;this._onKeydown=e=>{e.key==="Escape"&&this._open&&(this._open=!1)}}_triggerLabel(){return this.label??l(this.hass,"ui.more_actions","More actions")}_select(e,i){i.stopPropagation(),this._open=!1,this.dispatchEvent(new CustomEvent("menu-action",{detail:{id:e},bubbles:!0,composed:!0}))}_renderItems(){return this.items.map(e=>d`
        ${e.dividerBefore?d`<div class="kebab-divider" role="separator"></div>`:$}
        <button
          class="kebab-item ${e.danger?"danger":""}"
          role="menuitem"
          data-action=${e.id}
          @click=${i=>this._select(e.id,i)}
        >
          <ha-icon icon=${e.icon}></ha-icon>
          <span class="kebab-label">${e.label}</span>
        </button>
      `)}_renderTrigger(e){return d`
      <button
        class="kebab-trigger"
        aria-label=${this._triggerLabel()}
        aria-haspopup="menu"
        aria-expanded=${e}
        @click=${i=>{i.stopPropagation(),this._open=!this._open}}
      >
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
      </button>
    `}_renderMenu(){return d`
      ${this._renderTrigger(this._open)}
      ${this._open?d`
            <div
              class="kebab-backdrop"
              @click=${e=>{e.stopPropagation(),this._open=!1}}
            ></div>
            <div class="kebab-menu" role="menu">${this._renderItems()}</div>
          `:$}
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this._onKeydown)}disconnectedCallback(){this.removeEventListener("keydown",this._onKeydown),super.disconnectedCallback()}render(){return this._renderMenu()}};le.styles=y`
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
  `,u([m({attribute:!1})],le.prototype,"items",2),u([m({attribute:!1})],le.prototype,"hass",2),u([m()],le.prototype,"label",2),u([m({type:Boolean,reflect:!0})],le.prototype,"muted",2),u([g()],le.prototype,"_open",2),le=u([w("ambience-kebab-menu")],le);function ka(t){return t.style.pointerEvents="none",t.style.willChange="transform",()=>{t.style.pointerEvents="",t.style.willChange="",t.style.transform=""}}function Hi(t,n,e={}){let i=t.pointerId;try{t.target?.setPointerCapture?.(i)}catch{}let r=e.follow??null,s=t.clientX,o=t.clientY,a=r?ka(r):null,c=_=>{_.pointerId===i&&(n.onMove(_.clientX,_.clientY),r&&(r.style.transform=`translate(${_.clientX-s}px, ${_.clientY-o}px)`))},h=_=>{_.pointerId===i&&(f(),n.onEnd(_.clientX,_.clientY))},p=_=>{_.pointerId===i&&(f(),n.onCancel())},f=()=>{window.removeEventListener("pointermove",c,!0),window.removeEventListener("pointerup",h,!0),window.removeEventListener("pointercancel",p,!0),a?.()};return window.addEventListener("pointermove",c,!0),window.addEventListener("pointerup",h,!0),window.addEventListener("pointercancel",p,!0),f}function Oi(t,n){let e=document.elementFromPoint?.(t,n)??null;if(!e)return null;for(;e.shadowRoot;){let i=e.shadowRoot.elementFromPoint?.(t,n);if(!i||i===e)break;e=i}return e}var ft=class{constructor(n,e,i={}){this.host=n;this.onReorder=e;this.from=null;this.over=null;this.moved=!1;this._cancelDrag=null;this._locate=i.locate??((r,s)=>this._domLocate(r,s)),n.addController(this)}hostDisconnected(){this._reset()}start(n,e){if(!e.isPrimary||e.button>0)return;this._reset(),this.from=n,this.moved=!1,this.host.requestUpdate();let i=e.target?.closest("[data-drag-index]");this._cancelDrag=Hi(e,{onMove:(r,s)=>this._hover(this._locate(r,s)),onEnd:(r,s)=>this.drop(this._locate(r,s)),onCancel:()=>this.end()},{follow:i})}_hover(n){if(this.from===null)return;let e=n===null||n===this.from?null:n;e!==null&&(this.moved=!0),this.over!==e&&(this.over=e,this.host.requestUpdate())}drop(n){let e=this.from;this._reset(),!(e===null||n===null||e===n)&&this.onReorder(e,n)}end(){this._reset()}_domLocate(n,e){let i=this.host.renderRoot,s=(i?.elementFromPoint?i.elementFromPoint(n,e):Oi(n,e))?.closest?.("[data-drag-index]");if(!s)return null;let o=Number(s.getAttribute("data-drag-index"));return Number.isNaN(o)?null:o}_reset(){this._cancelDrag?.(),this._cancelDrag=null;let n=this.from!==null||this.over!==null;this.from=null,this.over=null,n&&this.host.requestUpdate()}};var Ea={light:"mdi:lightbulb",switch:"mdi:toggle-switch-variant",binary_sensor:"mdi:motion-sensor",sensor:"mdi:eye",person:"mdi:account",device_tracker:"mdi:account",climate:"mdi:thermostat",cover:"mdi:window-shutter",media_player:"mdi:cast",lock:"mdi:lock",fan:"mdi:fan",weather:"mdi:weather-partly-cloudy",input_boolean:"mdi:toggle-switch",event:"mdi:eye-check",script:"mdi:script-text",template:"mdi:code-braces"},Er="mdi:eye";function j(t,n){let e=t?.states?.[n]?.attributes?.friendly_name;return typeof e=="string"&&e?e:n}function Ca(t,n){let e=t?.states?.[n]?.attributes?.icon;if(typeof e=="string"&&e)return e;let i=n.split(".")[0];return Ea[i]??Er}function Mt(t,n){let e=t?.states?.[n];return e&&customElements.get("ha-state-icon")?d`<ha-state-icon class="row-icon" .hass=${t} .stateObj=${e}></ha-state-icon>`:d`<ha-icon class="row-icon" icon=${Ca(t,n)}></ha-icon>`}var ws=y`
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
`;function T(t,n){t.dispatchEvent(new CustomEvent("value-changed",{detail:{value:n},bubbles:!0,composed:!0}))}var Sa=[{name:"duration",selector:{duration:{enable_day:!1}}}];function jt(t){return!!t&&(t.h!==0||t.m!==0||t.s!==0)}function gt(t,n){return jt(t)&&n==="less_than"?"less_than":void 0}function zt(t){return t==="less_than"?"<":"\u2265"}var Te=class extends b{constructor(){super(...arguments);this.value=null;this.mode="at_least"}willUpdate(e){(e.has("hass")||this._modeSchema===void 0)&&(this._modeSchema=[{name:"for_mode",required:!0,selector:{select:{mode:"dropdown",options:this._modeOptions()}}}])}get _d(){return this.value??{h:0,m:0,s:0}}_emit(e,i){this.value=e,this.mode=i,T(this,{...e,mode:i})}_setDuration(e){this._emit(e,this.mode)}_setMode(e){this._emit(this._d,e)}_modeOptions(){return[{value:"at_least",label:l(this.hass,"ui.for_at_least","at least")},{value:"less_than",label:l(this.hass,"ui.for_less_than","less than")}]}_renderMode(){if(customElements.get("ha-form"))return d`<ha-form
        class="for-mode"
        .hass=${this.hass}
        .schema=${this._modeSchema}
        .data=${{for_mode:this.mode}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),i.detail.value.for_mode&&this._setMode(i.detail.value.for_mode)}}
      ></ha-form>`;let e=this._modeOptions();return d`<select
      class="for-mode"
      @change=${i=>this._setMode(i.target.value)}
    >
      ${e.map(i=>d`<option value=${i.value} ?selected=${i.value===this.mode}>${i.label}</option>`)}
    </select>`}render(){if(customElements.get("ha-form")){let r=this._d;return d`${this._renderMode()}<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${Sa}
        .data=${{duration:{hours:r.h,minutes:r.m,seconds:r.s}}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.duration;this._setDuration({h:o?.hours??0,m:o?.minutes??0,s:o?.seconds??0})}}
      ></ha-form>`}let e=this._d,i=r=>d`<input type="number" min="0" step="1"
      .value=${String(e[r])}
      @change=${s=>this._setDuration({...e,[r]:Math.max(0,Math.trunc(Number(s.target.value)||0))})} />`;return d`${this._renderMode()}<div class="for-row" data-field="for">
      ${i("h")}<span>:</span>${i("m")}<span>:</span>${i("s")}
    </div>`}};Te.styles=y`
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
  `,u([m({attribute:!1})],Te.prototype,"hass",2),u([m({attribute:!1})],Te.prototype,"value",2),u([m({attribute:!1})],Te.prototype,"mode",2),Te=u([w("ambience-for-duration")],Te);function Bt(t,n,e){if(n&&e){let i=e[n]?.fields?.[t];if(i&&typeof i=="object"){let r=i.name;if(typeof r=="string"&&r)return r}}return F(t)}function Fi(t,n="New scene"){return t.name?.trim()?t.name:n}function _t(t,n,e){return n==null?l(e.hass,"ui.summary_any_paren","(any)"):t==="time_of_day"?zi(n,e):t==="day"?Ra(n,e):t==="weather"?Na(n,e):t==="sun"?Ia(n,e):t==="state"?Pr(n,e):t==="script"?La(n,e):t==="people"?Pa(n,e):t==="occupancy"?Fa(n,e):t==="unavailable"?Wa(n,e):t==="lux"?Ba(n,e):t==="template"?Ta(n,e):String(n)}function Ta(t,n={}){return t===null?l(n.hass,"ui.summary_any_paren","(any)"):typeof t!="object"||typeof t.template!="string"?String(t):t.template}function La(t,n={}){if(t===null)return l(n.hass,"ui.summary_any_paren","(any)");if(typeof t!="object"||typeof t.script!="string")return String(t);let e=Ut(n,t.script),i=t.args??{},r=Object.keys(i).sort();if(r.length===0)return e;let s=r.map(o=>`${Tr(n.hass,t.script,o)}: ${Le(n.hass,i[o])}`).join(", ");return`${e} (${s})`}function Tr(t,n,e){let i=n.replace(/^script\./,""),s=t?.services?.script?.[i]?.fields?.[e]?.name;return typeof s=="string"&&s?s:F(e)}function Ut(t,n){let i=t.hass?.states?.[n]?.attributes?.friendly_name;if(typeof i=="string"&&i)return i;let r=n.indexOf("."),s=r>=0?n.slice(r+1):n;return s.charAt(0).toUpperCase()+s.slice(1)}function xs(t,n){return t==="home"?l(n.hass,"people_summary.home","Home"):Ut(n,t)}function Pa(t,n={}){if(t==null)return l(n.hass,"ui.summary_any","any");let e=t.where??"home";if(Array.isArray(t.who)&&t.who.length===1){let o=Ut(n,t.who[0]),c=t.quant==="nobody"!=!!t.negate?l(n.hass,"people_summary.is_not_at","is not at"):l(n.hass,"people_summary.is_at","is at"),h=`${o} ${c} ${xs(e,n)}`;return t.for&&Wt(t.for)?`${h} ${l(n.hass,"ui.for_prefix","for")} ${zt(t.for_mode)}${Ii(t.for)}`:h}let i;if(Array.isArray(t.who)){let o=t.quant??"any",a=o==="any"?l(n.hass,"ui.people_mode_any","Any of:"):o==="everyone"?l(n.hass,"ui.people_mode_all","All of:"):l(n.hass,"ui.people_mode_none","None of:"),c=t.who.map(h=>Ut(n,h)).join(", ");i=`${a} (${c})`}else{let o=t.quant??"everyone";i=o==="nobody"?l(n.hass,"ui.people_mode_nobody","Nobody"):o==="any"?l(n.hass,"ui.people_mode_anybody","Anybody"):l(n.hass,"ui.people_mode_everybody","Everybody")}let r=t.negate?l(n.hass,"people_summary.is_not_at","is not at"):l(n.hass,"people_summary.is_at","is at"),s=`${i} ${r} ${xs(e,n)}`;return t.for&&Wt(t.for)?`${s} ${l(n.hass,"ui.for_prefix","for")} ${zt(t.for_mode)}${Ii(t.for)}`:s}function Ra(t,n={}){if(t===null)return l(n.hass,"day_summary.any","any");let e=t.include??[],i=t.exclude??[],r=e.length===0?l(n.hass,"day_summary.any_day","any day"):e.map(o=>$s(o,n)).join(", ");if(i.length===0)return r;let s=l(n.hass,"day_summary.except","except");return`${r} (${s} ${i.map(o=>$s(o,n)).join(", ")})`}function $s(t,n){switch(t.kind){case"weekday":return t.days.map(e=>fi(n.hass,e)).join("/");case"day_of_month":return`${l(n.hass,"day_summary.day_prefix","Day")} ${t.days}`;case"date":return`${dt(n.hass,t.month)} ${t.day}`;case"date_range":return`${dt(n.hass,t.from.month)} ${t.from.day} \u2192 ${dt(n.hass,t.to.month)} ${t.to.day}`;case"last_day":return l(n.hass,"day_summary.last_day","Last day");case"workday":return l(n.hass,"day_summary.workday","Workday");case"holiday":return l(n.hass,"day_summary.holiday","Holiday");case"first_workday":return l(n.hass,"day_summary.first_workday","First workday");case"last_workday":return l(n.hass,"day_summary.last_workday","Last workday")}}function Aa(t){return typeof t=="string"?t:typeof t=="number"||typeof t=="boolean"?String(t):JSON.stringify(t)}var Da=["entity_id","device_id","area_id","label_id","floor_id"],ks=2;function Ha(t){if(!t||typeof t!="object"||Array.isArray(t))return null;let n=t;if(!Object.keys(n).every(r=>Da.includes(r)))return null;let e=n.entity_id,i=typeof e=="string"?[e]:Array.isArray(e)?e.filter(r=>typeof r=="string"):[];return i.length?i:null}function Le(t,n){let e=Ha(n);if(!e)return Aa(n);let i=e.slice(0,ks).map(o=>Ut({hass:t},o)),r=e.length-ks;return`[${r>0?`${i.join(", ")} +${r} more`:i.join(", ")}]`}function Mi(t){if(!(!t||typeof t!="object")){for(let n of Object.values(t))if(n&&typeof n=="object"){let e=n.unit_of_measurement;if(typeof e=="string"&&e)return e}}}function Oa(t){return t.split(/[\s_-]+/).filter(n=>n!=="").map(n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()).join(" ")}function Na(t,n={}){if(t===null)return l(n.hass,"ui.summary_any","any");let e=new Map((n.weatherGroups??[]).map(o=>[o.id,o.label])),i=(t.groups??[]).map(o=>e.get(o)??Oa(o)).join("/"),r=(t.thresholds??[]).map(o=>`${At(n.hass,o.attribute)} ${ie(n.hass,o.op)} ${o.value}`).join(", "),s=[i,r].filter(o=>o!=="");return s.length===0?l(n.hass,"ui.summary_any","any"):s.join(", ")}function Ia(t,n={}){if(t===null)return l(n.hass,"ui.summary_any","any");let e=[],i=t.elevation;i&&(i.min!=null&&i.max!=null?e.push(`${i.min}\xB0\u2013${i.max}\xB0`):i.min!=null?e.push(`\u2265${i.min}\xB0`):i.max!=null&&e.push(`\u2264${i.max}\xB0`));let r=t.azimuth;if(r){r.sectors?.length&&e.push(r.sectors.join("/"));for(let s of r.ranges??[])e.push(`${s.from}\xB0\u2013${s.to}\xB0`)}return e.length===0?l(n.hass,"ui.summary_any","any"):e.join(", ")}function Ls(t,n){return j(t.hass,n)}function ji(t,n){return Ls({hass:t},n)}function Fa(t,n={}){if(t==null||!t.sensors?.length)return l(n.hass,"ui.summary_any","any");let e=t.sensors.map(o=>j(n.hass,o)),i=t.occupied===!1?l(n.hass,"occupancy_summary.clear","clear"):l(n.hass,"occupancy_summary.detected","detected"),r=t.negate?`${l(n.hass,"occupancy_summary.not","not")} `:"",s;return e.length===1?s=`${e[0]} is ${r}${i}`:s=`${t.quant==="all"?l(n.hass,"occupancy_summary.all_of","all of"):l(n.hass,"occupancy_summary.any_of","any of")} (${e.join(", ")}) ${r}${i}`,t.for&&Wt(t.for)?`${s} ${l(n.hass,"ui.for_prefix","for")} ${zt(t.for_mode)}${Ii(t.for)}`:s}function Ma(t,n){if(n==null||typeof n!="object")return!1;if(t==="occupancy")return!!n.negate;if(t==="people"){let e=n;return!!e.negate&&Array.isArray(e.who)&&e.who.length===1}return!1}function ja(t){return{...t,negate:!1}}function Cr(t){if(t.kind==="and"||t.kind==="or"){let n=t.items.map(Cr);return n.length===1?n[0]:{...t,items:n}}return t.kind==="not"?{...t,item:Cr(t.item)}:t}function Es(t){if(t.kind==="is_not")return t.for&&Wt(t.for)?null:{...t,kind:"is"};if(t.kind==="not"){let n=t.item.kind;if(n==="is"||n===">"||n===">="||n==="<"||n==="<=")return t.item}return null}function za(t){let n=Cr(t);if(n.kind==="and"){let i=[],r=[];for(let o of n.items){let a=Es(o);a?r.push(a):i.push(o)}return{guard:i.length===0?null:i.length===1?i[0]:{kind:"and",items:i},releases:r}}let e=Es(n);return e?{guard:null,releases:[e]}:n.kind==="not"?{guard:null,releases:[n.item]}:{guard:n,releases:[]}}var Ua=new Set(["occupancy","people","state","lux","unavailable","script","template","day","time_of_day","weather"]);function Ni(t,n,e){let i=_t(t,n,e);return Ua.has(t)?i:`${q(e.hass,t)}: ${i}`}function Ps(t,n={}){let e=l(n.hass,"blocker_summary.block","Block"),i=Object.keys(t.when).filter(f=>t.when[f]!=null);if(n.priorities){let f=n.priorities;i=i.sort((_,v)=>{let x=f.get(_),E=f.get(v);return x===void 0&&E===void 0?0:(E??-1/0)-(x??-1/0)})}let r=[],s=[];for(let f of i){let _=t.when[f];if(f==="state"){let{guard:v,releases:x}=za(_);v&&s.push(Ni("state",v,n));for(let E of x)r.push(Ni("state",E,n));continue}Ma(f,_)?r.push(Ni(f,ja(_),n)):s.push(Ni(f,_,n))}let o=l(n.hass,"blocker_summary.until","until"),a=` ${l(n.hass,"blocker_summary.or","or")} `,c=` ${l(n.hass,"blocker_summary.and","and")} `,h=r.join(a),p=s.join(c);if(r.length&&s.length){let f=l(n.hass,"blocker_summary.while_lead","While"),_=l(n.hass,"blocker_summary.block_mid","block");return`${f} ${p}, ${_} ${o} ${h}`}if(r.length)return`${e} ${o} ${h}`;if(s.length){let f=l(n.hass,"blocker_summary.while","while");return`${e} ${f} ${p}`}return`${e} ${l(n.hass,"blocker_summary.always","always")}`}function Wa(t,n={}){if(t==null||!t.entities?.length)return l(n.hass,"ui.summary_any","any");let e=t.entities.map(s=>j(n.hass,s)),i=l(n.hass,"unavailable_summary.unavailable","unavailable");return e.length===1?`${e[0]} ${i}`:`${l(n.hass,"unavailable_summary.any_of","any of")} (${e.join(", ")}) ${i}`}function Lr(t,n,e="any lux"){return t!=null&&n!=null?`${t}\u2013${n} lx`:n!=null?`<${n} lx`:t!=null?`\u2265${t} lx`:e}function Ba(t,n={}){if(t==null||!t.sensors?.length)return l(n.hass,"ui.summary_any","any");let e=t.sensors.map(s=>j(n.hass,s)),i=t.range!=null?lt(n.hass,t.range,n.luxRanges?.custom??{}):Lr(t.min,t.max);return e.length===1?`${e[0]} ${i}`:`${t.quant==="all"?l(n.hass,"lux_summary.all_of","all of"):l(n.hass,"lux_summary.any_of","any of")} (${e.join(", ")}) ${i}`}function Pr(t,n={}){return t==null?l(n.hass,"ui.summary_any","any"):Sr(t,n)}function Cs(t,n,e){let i=ie(n.hass,t.kind),r=Ls(n,t.entity_id),s=n.hass?.states?.[t.entity_id],a=t.kind!=="is"&&t.kind!=="is_not"?t.states[0]??"":t.states.map(f=>at(n.hass,s,t.attribute,f)).join("/"),c=t.attribute?`${r}.${pi(n.hass,s,t.attribute)}`:r,h=e?`${ie(n.hass,"not")} `:"",p=`${c} ${i} ${h}${a}`;return t.for&&Wt(t.for)?`${p} ${l(n.hass,"ui.for_prefix","for")} ${zt(t.for_mode)}${Ii(t.for)}`:p}function Sr(t,n){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<=")return Cs(t,n,!1);if(t.kind==="and"||t.kind==="or"){let e=` ${ie(n.hass,t.kind)} `;return t.items.map(i=>Ss(i,n)).join(e)}if(t.kind==="not"){let e=t.item;return e.kind==="is"?Cs(e,n,!0):`${ie(n.hass,"not")} ${Ss(e,n)}`}return""}function Ss(t,n){return t.kind==="and"||t.kind==="or"?`(${Sr(t,n)})`:Sr(t,n)}function Wt(t){return t.h>0||t.m>0||t.s>0}function Ii(t){let n=[];return t.h&&n.push(`${t.h}h`),t.m&&n.push(`${t.m}m`),t.s&&n.push(`${t.s}s`),n.length?n.join(" "):"0s"}function zi(t,n){if(t===null)return l(n.hass,"ui.summary_any","any");let e=Array.isArray(t)?t:[t],i=n.periods?.custom??{};return e.map(r=>"period"in r?Ee(n.hass,r.period,i):`${Ts(r.from,n)} \u2192 ${Ts(r.to,n)}`).join(", ")}function Ts(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=ke(n.hass,t.anchor),i=e;if(t.offset_min!==0){let r=Math.abs(t.offset_min),s=r%60===0?`${r/60}${l(n.hass,"ui.unit_hour_abbr","h")}`:`${r}${l(n.hass,"ui.unit_min_abbr","m")}`;i=`${e}${t.offset_min<0?"-":"+"}${s}`}if(t.clamp){let r=t.clamp.dir==="not_before"?l(n.hass,"ui.clamp_not_before","not before"):l(n.hass,"ui.clamp_not_after","not after"),s=`${String(t.clamp.hh).padStart(2,"0")}:${String(t.clamp.mm).padStart(2,"0")}`;i=`${i} (${r} ${s})`}return i}function Va(t,n){return ot(t.service,n.exposedActions,()=>mi(n.hass,t.service))}function qa(t,n){let e=new Set;for(let i of t.entity_ids){let r=i.indexOf(".");r>0&&e.add(i.slice(0,r))}return e.size===1?[...e][0]:l(n.hass,"ui.target_noun","target")}function Rs(t,n){let e=Va(t,n),i=qa(t,n),r=t.entity_ids.length,s;r===0?s=l(n.hass,"ui.no_targets","(no targets)"):r===1?s=`1 ${i}`:s=`${r} ${i}s`;let o=Object.entries(t.params).filter(([,a])=>a!=null&&a!=="").map(([a,c])=>`${Bt(a,t.service,n.schemas)}: ${Le(n.hass,c)}`).join(", ");return o?`${e}: ${s}, ${o}`:`${e}: ${s}`}var z=class extends b{constructor(){super(...arguments);this.scenes=[];this.availableActions=[];this.schemas={};this.categories=[];this.filterCategory="";this.collapsedCategories=[];this._drag=new ft(this,(e,i)=>this._emit("reorder-scenes",{from:e,to:i}));this._expanded=new Set}willUpdate(e){e.has("scenes")&&(this._expanded=new Set)}_renderSectionHeader(e,i,r){return d`<div
      class="category-section-header"
      style=${ki(e.color)}
      @click=${()=>this._emit("toggle-category-collapse",{categoryId:e.id})}
    >
      <span class="category-chevron ${i?"open":""}" aria-hidden="true">▶</span>
      ${e.icon?d`<ha-icon icon=${e.icon}></ha-icon>`:""}
      <span>${e.name}</span>
      ${Di(this.hass,r.map(([,s])=>s))}
      <ambience-kebab-menu
        class="category-kebab"
        .hass=${this.hass}
        @click=${s=>s.stopPropagation()}
        .items=${[{id:"run",label:l(this.hass,"ui.run","Run"),icon:"mdi:play"},{id:"traces",label:l(this.hass,"ui.view_traces","View traces"),icon:"mdi:transit-connection-variant"},{id:"simulate",label:l(this.hass,"ui.simulate","Simulate"),icon:"mdi:flask-outline"},{id:"auto",label:l(this.hass,"ui.auto_triggers_section","Auto-triggers"),icon:"mdi:flash-auto"}]}
        @menu-action=${s=>this._onCategoryMenu(e,s.detail.id)}
      ></ambience-kebab-menu>
    </div>`}_sections(){let e=this.scenes.map((r,s)=>[s,r]);if(this.filterCategory!=="")return[{category:this.categories.find(r=>r.id===this.filterCategory),rows:e.filter(([,r])=>r.category===this.filterCategory)}];let i=new Map;for(let[r,s]of e){let o=i.get(s.category)??[];o.push([r,s]),i.set(s.category,o)}return[...i.entries()].map(([r,s])=>({category:this.categories.find(o=>o.id===r),rows:s})).sort((r,s)=>(r.category?.name??"").localeCompare(s.category?.name??""))}_emit(e,i){this.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}_priorityMap(){let e=this.conditions;return(!this._priorityOfCache||this._priorityOfCache.src!==e)&&(this._priorityOfCache={src:e,map:new Map((e??[]).map(i=>[i.name,i.priority]))}),this._priorityOfCache.map}_whenKeys(e){let i=this._priorityMap();return Object.keys(e.when).filter(r=>e.when[r]!=null).sort((r,s)=>(i.get(s)??-1/0)-(i.get(r)??-1/0))}_whenSummary(e){let i=this._whenKeys(e);return i.length===0?l(this.hass,"ui.summary_always","Always"):i.map((r,s)=>{let o=q(this.hass,r),a=_t(r,e.when[r],{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups});return d`${s===0?"":", "}<strong>${o}:</strong> ${a}`})}_blockerSummary(e){return Ps(e,{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups,priorities:this._priorityMap()})}_whenStacked(e){let i=this._whenKeys(e);return i.length===0?d`<div class="condition-line">
        ${l(this.hass,"ui.summary_always","Always")}
      </div>`:i.map(r=>{let s=q(this.hass,r),o=_t(r,e.when[r],{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups});return d`<div class="condition-line">
        <strong>${s}:</strong> ${o}
      </div>`})}_actionCountLabel(e){let i=e.actions.length,r=i===1?l(this.hass,"ui.action_singular","action"):l(this.hass,"ui.action_plural","actions");return`${i} ${r}`}_toggleScene(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}_entityName(e){return j(this.hass,e)}_actionParamsString(e){return Object.entries(e.params).filter(([,i])=>i!=null&&i!=="").map(([i,r])=>`${Bt(i,e.service,this.schemas)}: ${Le(this.hass,r)}`).join(", ")}_actionLabel(e){return ot(e.service,this.availableActions,()=>mi(this.hass,e.service))}_onCategoryMenu(e,i){i==="run"?this._emit("apply-category",{categoryId:e.id}):i==="traces"?this._emit("show-traces",{category:e.id}):i==="simulate"?this._emit("show-simulator",{category:e.id}):i==="auto"&&this._emit("show-auto-triggers",{category:e.id})}_onSceneMenu(e,i){i==="edit"?this._emit("edit-scene",{index:e}):i==="duplicate"?this._emit("duplicate-scene",{index:e}):i==="run"?this._emit("run-scene-actions",{index:e}):i==="delete"&&this._emit("delete-scene",{index:e})}_problemFlag(e){let i=Ai(e);if(!i.severity)return"";let r=[];return i.shadowed&&r.push(l(this.hass,"ui.shadowed","Never fires \u2014 shadowed by an earlier scene.")),i.missing.length&&r.push(`${l(this.hass,"ui.problem_missing","Missing in Home Assistant:")} ${i.missing.join(", ")}`),i.overlap.length&&r.push(`${l(this.hass,"ui.problem_overlap","Controlled by multiple groups:")} ${i.overlap.join(", ")}`),i.configIssues.length&&r.push(`${l(this.hass,"ui.problem_config","Configuration problems:")} ${i.configIssues.map(s=>bs(this.hass,s)).join(", ")}`),d`<ambience-problem-flag
      .severity=${i.severity}
      .details=${r}
      .summary=${r.join(`
`)}
    ></ambience-problem-flag>`}_renderRow(e,i,r){let s=l(this.hass,"ui.unpin","Unpin (return to automatic order)"),o=i.enabled===!1,a=o?l(this.hass,"ui.enable_scene","Enable scene"):l(this.hass,"ui.disable_scene","Disable scene");return d`
      <li
        data-drag-index=${e}
        class="${this._drag.over===e?"drag-over ":""}${this._drag.from===e?"dragging ":""}${o?"disabled":""}"
      >
        <span class="lead">
          ${i.pinned?d`<button
                class="pin"
                title=${s}
                aria-label=${s}
                @pointerdown=${c=>this._drag.start(e,c)}
                @click=${c=>{if(c.stopPropagation(),this._drag.moved){this._drag.moved=!1;return}this._emit("unpin-scene",{index:e})}}
              >
                📌
              </button>`:d`<span
                class="handle"
                title=${l(this.hass,"ui.drag_to_reorder","Drag to reorder")}
                @pointerdown=${c=>this._drag.start(e,c)}
                >⠿</span
              >`}
        </span>
        <span class="idx">${r}</span>
        <span class="warn-slot">${this._problemFlag(i)}</span>
        <div class="body" @click=${()=>this._toggleScene(e)}>
          <div class="name">
            ${Fi(i,l(this.hass,"ui.scene_n","Scene {n}").replace("{n}",String(r)))}
          </div>
          <div class="summary">
            ${this._expanded.has(e)?"":i.actions.length===0?this._blockerSummary(i):d`${this._whenSummary(i)} ·
                    <span class="action-count"
                      >${this._actionCountLabel(i)}</span
                    >`}
          </div>
          ${this._expanded.has(e)?d`
                <div class="scene-detail">
                  ${this._whenStacked(i)}
                  ${i.actions.length===0?d`<div class="noop-detail">
                        ${this._blockerSummary(i)}
                      </div>`:d`<div class="actions-detail">
                        ${i.actions.map(c=>{let h=this._actionParamsString(c),p=this._actionLabel(c),f=h?`${p} \xB7 ${h}`:p;return d`
                            <div class="actions-detail-item">
                              <div class="action-header">${f}</div>
                              ${c.entity_ids.length===0?d`<div class="no-targets">
                                    ${l(this.hass,"ui.no_targets","(no targets)")}
                                  </div>`:d`<ul class="entity-list">
                                    ${c.entity_ids.map(_=>d`<li>${this._entityName(_)}</li>`)}
                                  </ul>`}
                            </div>
                          `})}
                      </div>`}
                </div>
              `:""}
        </div>
        <button
          class="toggle"
          @click=${c=>{c.stopPropagation(),this._emit("toggle-scene-enabled",{index:e,enabled:o})}}
          title=${a}
          aria-label=${a}
        >
          <ha-icon
            icon=${o?"mdi:toggle-switch-off-outline":"mdi:toggle-switch"}
          ></ha-icon>
        </button>
        <ambience-kebab-menu
          class="row-kebab"
          .hass=${this.hass}
          .label=${l(this.hass,"ui.scene_actions","Scene actions")}
          .items=${[{id:"edit",label:l(this.hass,"ui.edit","Edit"),icon:"mdi:pencil"},{id:"duplicate",label:l(this.hass,"ui.duplicate","Duplicate"),icon:"mdi:content-duplicate"},{id:"run",label:l(this.hass,"ui.run_actions","Run actions"),icon:"mdi:play"},{id:"delete",label:l(this.hass,"ui.title_delete","Delete"),icon:"mdi:delete",danger:!0,dividerBefore:!0}]}
          @menu-action=${c=>this._onSceneMenu(e,c.detail.id)}
        ></ambience-kebab-menu>
      </li>
    `}render(){let e=this._sections().filter(r=>r.rows.length>0);if(e.length===0){let r=this.filterCategory?{category:this.filterCategory}:{};return d`
        <p class="empty">
          ${l(this.hass,"ui.no_scenes_yet","No scenes yet.")}
        </p>
        <button class="add" @click=${()=>this._emit("add-scene",r)}>
          ${l(this.hass,"ui.add_scene","+ Add scene")}
        </button>
      `}let i=this.categories.length>0;return d`
      ${e.map(r=>{let s=!!r.category&&this.collapsedCategories.includes(r.category.id);return d`
          <div class="category-section">
            ${i&&r.category?this._renderSectionHeader(r.category,!s,r.rows):""}
            ${s?"":d`
                  <ul>
                    ${r.rows.map(([o,a],c)=>this._renderRow(o,a,c+1))}
                  </ul>
                  <button
                    class="add"
                    @click=${()=>this._emit("add-scene",{category:r.category?.id})}
                  >
                    ${l(this.hass,"ui.add_scene","+ Add scene")}
                  </button>
                `}
          </div>
        `})}
    `}};z.styles=y`
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
  `,u([m({attribute:!1})],z.prototype,"scenes",2),u([m({attribute:!1})],z.prototype,"periods",2),u([m({attribute:!1})],z.prototype,"luxRanges",2),u([m({attribute:!1})],z.prototype,"weatherConfig",2),u([m({attribute:!1})],z.prototype,"hass",2),u([m({attribute:!1})],z.prototype,"conditions",2),u([m({attribute:!1})],z.prototype,"availableActions",2),u([m({attribute:!1})],z.prototype,"schemas",2),u([m({attribute:!1})],z.prototype,"categories",2),u([m({attribute:!1})],z.prototype,"filterCategory",2),u([m({attribute:!1})],z.prototype,"collapsedCategories",2),u([g()],z.prototype,"_expanded",2),z=u([w("ambience-scenes-list")],z);var de=class extends b{constructor(){super(...arguments);this.entities=[];this.value=[];this.target=null;this.label=" "}_filteredEntities(){return gs(this.entities,this.target)}connectedCallback(){super.connectedCallback(),ee(this)}_emit(e){T(this,e)}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let i=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this._filteredEntities()}}}],r=this.label;return d`
      <ha-form
        .hass=${this.hass}
        .schema=${i}
        .data=${{entity_ids:this.value}}
        .computeLabel=${()=>r}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,i){let r=new Set(this.value);i?r.add(e):r.delete(e),this._emit(this._filteredEntities().filter(s=>r.has(s)))}_renderFallback(){let e=this._filteredEntities();return e.length===0?d`<p class="empty">${l(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:d`
      <div class="checkboxes">
        ${e.map(i=>d`
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
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};de.styles=y`
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
  `,u([m({attribute:!1})],de.prototype,"hass",2),u([m({attribute:!1})],de.prototype,"entities",2),u([m({attribute:!1})],de.prototype,"value",2),u([m({attribute:!1})],de.prototype,"target",2),u([m()],de.prototype,"label",2),de=u([w("ambience-target-picker")],de);var W=class extends b{constructor(){super(...arguments);this.entityIds=[];this.params={};this.excludeEntities=[];this._schema=void 0;this._schemaError=null;this._exposedMissing=!1;this._formSchema=[];this._perFieldSchemas={};this._schemaServiceId=null;this._onTargetChanged=e=>{e.stopPropagation(),this._emit("entity-ids-changed",{entityIds:e.detail.value})};this._onFieldInput=e=>i=>{i.stopPropagation();let r=i.target,s={...this.params,[e]:r.value};this._emit("params-changed",{params:s})};this._onHaFormChanged=e=>{e.stopPropagation(),this._emit("params-changed",{params:{...this.params,...e.detail.value}})}}connectedCallback(){super.connectedCallback(),ee(this)}willUpdate(e){if((e.has("exposed")&&e.get("exposed")?.id!==this.exposed?.id||e.has("hass")&&this._schema===void 0&&this._schemaServiceId!==this.exposed?.id)&&this._loadSchema(),(e.has("exposed")||e.has("_schema"))&&(this._formSchema=this._buildFormSchema()),e.has("_formSchema")||e.has("_schema")||e.has("exposed")){let i={};for(let r of this._formSchema)i[r.name]=[r];this._perFieldSchemas=i}}async _loadSchema(){if(this.exposed===void 0&&this.hass){this._exposedMissing=!0,this._schema=null,this._schemaServiceId=null;return}let e=this.exposed?.id;if(!e||!this.hass){this._exposedMissing=!1,this._schema=void 0,this._schemaServiceId=null;return}this._exposedMissing=!1,this._schemaServiceId=e,this._schemaError=null,this._schema=void 0;try{let i=await Ce(this.hass,e);if(this._schemaServiceId!==e)return;this._schema=i}catch(i){if(this._schemaServiceId!==e)return;this._schema=null,this._schemaError=i instanceof Error?i.message:String(i)}}_buildFormSchema(){let e=this._schema,i=this.exposed;if(!e||!i)return[];let r=new Set(i.visible_fields??[]),s=[];for(let[o,a]of Object.entries(e.fields))r.has(o)&&s.push({name:o,selector:a.selector??{text:{}},required:!!a.required,description:typeof a.description=="string"&&a.description?a.description:void 0});return s}updated(e){super.updated?.(e),e.has("_schema")&&this.dispatchEvent(new CustomEvent("target-mode-changed",{detail:{hasTarget:this.hasTarget()},bubbles:!0,composed:!0}))}_hasTarget(){let e=this._schema?.target??null;return!e||typeof e!="object"?!1:Object.keys(e).length>0}hasTarget(){return this._schema===void 0?!1:this._hasTarget()}_scopeEntities(){return!this.scope||!this.hass?[]:Pi(this.hass,this.scope,[])}_renderTargetPicker(){if(!this._hasTarget())return"";let e=new Set(this.excludeEntities),i=this._scopeEntities().filter(o=>!e.has(o)),r=this._schema?.target??null,s=l(this.hass,"ui.target","Target");return d`
      <div class="target-picker field-row">
        <div class="field-header">
          <span class="field-label">${s}</span>
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
    `}_humanizeFieldLabel(e){let i=this._schema?.fields[e];return i?.name?i.name:F(e)}_clearField(e){if(!(e in this.params))return;let i={...this.params};delete i[e],this._emit("params-changed",{params:i})}_extraParamKeys(){let e=new Set;for(let i of this._formSchema)e.add(i.name);for(let i of Object.keys(this.exposed?.defaults??{}))e.add(i);return Object.keys(this.params).filter(i=>!e.has(i))}_clearExtraParams(){let e=new Set(this._extraParamKeys());if(e.size===0)return;let i={};for(let[r,s]of Object.entries(this.params))e.has(r)||(i[r]=s);this._emit("params-changed",{params:i})}_fieldData(e){return e in this.params?{[e]:this.params[e]}:{}}_defaultHintSuffix(e){let i=this.exposed?.defaults??{};if(!(e.name in i))return"";let r=Mi(e.selector),s=Le(this.hass,i[e.name]);return` (${l(this.hass,"ui.default_prefix","Default: ")}${s}${r?` ${r}`:""})`}_hasUserOverride(e){return e in this.params}_renderExtraParamsNotice(){let e=this._extraParamKeys();if(e.length===0)return"";let i=e.join(", ");return d`
      <div class="extra-params-notice" data-extra-params>
        <span>
          ${l(this.hass,"ui.extra_fields_prefix","Extra fields:")} ${i}.
          ${l(this.hass,"ui.extra_fields_hint","These fields aren't currently exposed but will still be sent.")}
        </span>
        <button data-remove-extras @click=${()=>this._clearExtraParams()}>
          ${l(this.hass,"ui.remove","Remove")}
        </button>
      </div>
    `}_renderFieldsForm(){let e=this._formSchema,i=this._renderExtraParamsNotice();return e.length===0?i===""?"":d`<div class="fields-form">${i}</div>`:customElements.get("ha-form")?d`
        <div class="fields-form">
          ${e.map(r=>{let s=this._perFieldSchemas[r.name]??[r],o=this._fieldData(r.name),a=this._defaultHintSuffix(r);return d`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <span class="field-label">${this._humanizeFieldLabel(r.name)}${r.required?" *":""}</span>${a?d`<span class="field-default-hint">${a}</span>`:""}
                  </span>
                  ${this._hasUserOverride(r.name)?d`<button
                        class="field-clear"
                        data-clear=${r.name}
                        @click=${()=>this._clearField(r.name)}
                        title=${l(this.hass,"ui.clear_default","Clear default")}
                      >✕</button>`:""}
                </div>
                <ha-form
                  .hass=${this.hass}
                  .schema=${s}
                  .data=${o}
                  .computeLabel=${()=>""}
                  @value-changed=${this._onHaFormChanged}
                ></ha-form>
              </div>
            `})}
          ${i}
        </div>
      `:d`
      <div class="fields-form">
        ${e.map(r=>{let s=this._fieldData(r.name),o=r.name in s?String(s[r.name]??""):"",a=this._defaultHintSuffix(r);return d`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <label class="field-label">${this._humanizeFieldLabel(r.name)}${r.required?" *":""}</label>${a?d`<span class="field-default-hint">${a}</span>`:""}
                  </span>
                  ${this._hasUserOverride(r.name)?d`<button
                        class="field-clear"
                        data-clear=${r.name}
                        @click=${()=>this._clearField(r.name)}
                        title=${l(this.hass,"ui.clear_default","Clear default")}
                      >✕</button>`:""}
                </div>
                <input
                  type="text"
                  data-field=${r.name}
                  .value=${o}
                  @input=${this._onFieldInput(r.name)}
                />
              </div>
            `})}
        ${i}
      </div>
    `}_emit(e,i){this.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}render(){if(this._schema===null)return this._exposedMissing?d`
          <div class="schema-error">
            ${l(this.hass,"ui.service_not_exposed","Service no longer exposed; configure it in Settings \u2192 Actions or remove this action.")}
          </div>
        `:d`
        <div class="schema-error">
          ${this._schemaError??l(this.hass,"ui.service_unavailable","Service not available in this HA instance.")}
        </div>
      `;if(this._schema===void 0)return d`<div>${l(this.hass,"ui.loading","Loading\u2026")}</div>`;let e=this._renderTargetPicker(),i=this._renderFieldsForm();return e===""&&i===""?d`<div class="no-params">${l(this.hass,"ui.action_no_parameters","This action has no configurable fields.")}</div>`:d`${e}${i}`}};W.styles=y`
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
  `,u([m({attribute:!1})],W.prototype,"hass",2),u([m({attribute:!1})],W.prototype,"scope",2),u([m({attribute:!1})],W.prototype,"exposed",2),u([m({attribute:!1})],W.prototype,"entityIds",2),u([m({attribute:!1})],W.prototype,"params",2),u([m({attribute:!1})],W.prototype,"excludeEntities",2),u([g()],W.prototype,"_schema",2),u([g()],W.prototype,"_schemaError",2),u([g()],W.prototype,"_exposedMissing",2),u([g()],W.prototype,"_formSchema",2),u([g()],W.prototype,"_perFieldSchemas",2),W=u([w("ambience-action-slot")],W);function Ks(t){return typeof t>"u"||t===null}function Ka(t){return typeof t=="object"&&t!==null}function Ga(t){return Array.isArray(t)?t:Ks(t)?[]:[t]}function Ya(t,n){var e,i,r,s;if(n)for(s=Object.keys(n),e=0,i=s.length;e<i;e+=1)r=s[e],t[r]=n[r];return t}function Qa(t,n){var e="",i;for(i=0;i<n;i+=1)e+=t;return e}function Ja(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var Xa=Ks,Za=Ka,el=Ga,tl=Qa,il=Ja,rl=Ya,N={isNothing:Xa,isObject:Za,toArray:el,repeat:tl,isNegativeZero:il,extend:rl};function Gs(t,n){var e="",i=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(e+='in "'+t.mark.name+'" '),e+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!n&&t.mark.snippet&&(e+=`

`+t.mark.snippet),i+" "+e):i}function qt(t,n){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=n,this.message=Gs(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}qt.prototype=Object.create(Error.prototype);qt.prototype.constructor=qt;qt.prototype.toString=function(n){return this.name+": "+Gs(this,n)};var J=qt;function Rr(t,n,e,i,r){var s="",o="",a=Math.floor(r/2)-1;return i-n>a&&(s=" ... ",n=i-a+s.length),e-i>a&&(o=" ...",e=i+a-o.length),{str:s+t.slice(n,e).replace(/\t/g,"\u2192")+o,pos:i-n+s.length}}function Ar(t,n){return N.repeat(" ",n-t.length)+t}function nl(t,n){if(n=Object.create(n||null),!t.buffer)return null;n.maxLength||(n.maxLength=79),typeof n.indent!="number"&&(n.indent=1),typeof n.linesBefore!="number"&&(n.linesBefore=3),typeof n.linesAfter!="number"&&(n.linesAfter=2);for(var e=/\r?\n|\r|\0/g,i=[0],r=[],s,o=-1;s=e.exec(t.buffer);)r.push(s.index),i.push(s.index+s[0].length),t.position<=s.index&&o<0&&(o=i.length-2);o<0&&(o=i.length-1);var a="",c,h,p=Math.min(t.line+n.linesAfter,r.length).toString().length,f=n.maxLength-(n.indent+p+3);for(c=1;c<=n.linesBefore&&!(o-c<0);c++)h=Rr(t.buffer,i[o-c],r[o-c],t.position-(i[o]-i[o-c]),f),a=N.repeat(" ",n.indent)+Ar((t.line-c+1).toString(),p)+" | "+h.str+`
`+a;for(h=Rr(t.buffer,i[o],r[o],t.position,f),a+=N.repeat(" ",n.indent)+Ar((t.line+1).toString(),p)+" | "+h.str+`
`,a+=N.repeat("-",n.indent+p+3+h.pos)+`^
`,c=1;c<=n.linesAfter&&!(o+c>=r.length);c++)h=Rr(t.buffer,i[o+c],r[o+c],t.position-(i[o]-i[o+c]),f),a+=N.repeat(" ",n.indent)+Ar((t.line+c+1).toString(),p)+" | "+h.str+`
`;return a.replace(/\n$/,"")}var sl=nl,ol=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],al=["scalar","sequence","mapping"];function ll(t){var n={};return t!==null&&Object.keys(t).forEach(function(e){t[e].forEach(function(i){n[String(i)]=e})}),n}function dl(t,n){if(n=n||{},Object.keys(n).forEach(function(e){if(ol.indexOf(e)===-1)throw new J('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.options=n,this.tag=t,this.kind=n.kind||null,this.resolve=n.resolve||function(){return!0},this.construct=n.construct||function(e){return e},this.instanceOf=n.instanceOf||null,this.predicate=n.predicate||null,this.represent=n.represent||null,this.representName=n.representName||null,this.defaultStyle=n.defaultStyle||null,this.multi=n.multi||!1,this.styleAliases=ll(n.styleAliases||null),al.indexOf(this.kind)===-1)throw new J('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var B=dl;function As(t,n){var e=[];return t[n].forEach(function(i){var r=e.length;e.forEach(function(s,o){s.tag===i.tag&&s.kind===i.kind&&s.multi===i.multi&&(r=o)}),e[r]=i}),e}function cl(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},n,e;function i(r){r.multi?(t.multi[r.kind].push(r),t.multi.fallback.push(r)):t[r.kind][r.tag]=t.fallback[r.tag]=r}for(n=0,e=arguments.length;n<e;n+=1)arguments[n].forEach(i);return t}function Hr(t){return this.extend(t)}Hr.prototype.extend=function(n){var e=[],i=[];if(n instanceof B)i.push(n);else if(Array.isArray(n))i=i.concat(n);else if(n&&(Array.isArray(n.implicit)||Array.isArray(n.explicit)))n.implicit&&(e=e.concat(n.implicit)),n.explicit&&(i=i.concat(n.explicit));else throw new J("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.forEach(function(s){if(!(s instanceof B))throw new J("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new J("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new J("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),i.forEach(function(s){if(!(s instanceof B))throw new J("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var r=Object.create(Hr.prototype);return r.implicit=(this.implicit||[]).concat(e),r.explicit=(this.explicit||[]).concat(i),r.compiledImplicit=As(r,"implicit"),r.compiledExplicit=As(r,"explicit"),r.compiledTypeMap=cl(r.compiledImplicit,r.compiledExplicit),r};var ul=Hr,hl=new B("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),pl=new B("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),ml=new B("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),fl=new ul({explicit:[hl,pl,ml]});function gl(t){if(t===null)return!0;var n=t.length;return n===1&&t==="~"||n===4&&(t==="null"||t==="Null"||t==="NULL")}function _l(){return null}function vl(t){return t===null}var yl=new B("tag:yaml.org,2002:null",{kind:"scalar",resolve:gl,construct:_l,predicate:vl,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function bl(t){if(t===null)return!1;var n=t.length;return n===4&&(t==="true"||t==="True"||t==="TRUE")||n===5&&(t==="false"||t==="False"||t==="FALSE")}function wl(t){return t==="true"||t==="True"||t==="TRUE"}function xl(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var $l=new B("tag:yaml.org,2002:bool",{kind:"scalar",resolve:bl,construct:wl,predicate:xl,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function kl(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function El(t){return 48<=t&&t<=55}function Cl(t){return 48<=t&&t<=57}function Sl(t){if(t===null)return!1;var n=t.length,e=0,i=!1,r;if(!n)return!1;if(r=t[e],(r==="-"||r==="+")&&(r=t[++e]),r==="0"){if(e+1===n)return!0;if(r=t[++e],r==="b"){for(e++;e<n;e++)if(r=t[e],r!=="_"){if(r!=="0"&&r!=="1")return!1;i=!0}return i&&r!=="_"}if(r==="x"){for(e++;e<n;e++)if(r=t[e],r!=="_"){if(!kl(t.charCodeAt(e)))return!1;i=!0}return i&&r!=="_"}if(r==="o"){for(e++;e<n;e++)if(r=t[e],r!=="_"){if(!El(t.charCodeAt(e)))return!1;i=!0}return i&&r!=="_"}}if(r==="_")return!1;for(;e<n;e++)if(r=t[e],r!=="_"){if(!Cl(t.charCodeAt(e)))return!1;i=!0}return!(!i||r==="_")}function Tl(t){var n=t,e=1,i;if(n.indexOf("_")!==-1&&(n=n.replace(/_/g,"")),i=n[0],(i==="-"||i==="+")&&(i==="-"&&(e=-1),n=n.slice(1),i=n[0]),n==="0")return 0;if(i==="0"){if(n[1]==="b")return e*parseInt(n.slice(2),2);if(n[1]==="x")return e*parseInt(n.slice(2),16);if(n[1]==="o")return e*parseInt(n.slice(2),8)}return e*parseInt(n,10)}function Ll(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!N.isNegativeZero(t)}var Pl=new B("tag:yaml.org,2002:int",{kind:"scalar",resolve:Sl,construct:Tl,predicate:Ll,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Rl=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Al(t){return!(t===null||!Rl.test(t)||t[t.length-1]==="_")}function Dl(t){var n,e;return n=t.replace(/_/g,"").toLowerCase(),e=n[0]==="-"?-1:1,"+-".indexOf(n[0])>=0&&(n=n.slice(1)),n===".inf"?e===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:n===".nan"?NaN:e*parseFloat(n,10)}var Hl=/^[-+]?[0-9]+e/;function Ol(t,n){var e;if(isNaN(t))switch(n){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(n){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(n){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(N.isNegativeZero(t))return"-0.0";return e=t.toString(10),Hl.test(e)?e.replace("e",".e"):e}function Nl(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||N.isNegativeZero(t))}var Il=new B("tag:yaml.org,2002:float",{kind:"scalar",resolve:Al,construct:Dl,predicate:Nl,represent:Ol,defaultStyle:"lowercase"}),Fl=fl.extend({implicit:[yl,$l,Pl,Il]}),Ml=Fl,Ys=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Qs=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function jl(t){return t===null?!1:Ys.exec(t)!==null||Qs.exec(t)!==null}function zl(t){var n,e,i,r,s,o,a,c=0,h=null,p,f,_;if(n=Ys.exec(t),n===null&&(n=Qs.exec(t)),n===null)throw new Error("Date resolve error");if(e=+n[1],i=+n[2]-1,r=+n[3],!n[4])return new Date(Date.UTC(e,i,r));if(s=+n[4],o=+n[5],a=+n[6],n[7]){for(c=n[7].slice(0,3);c.length<3;)c+="0";c=+c}return n[9]&&(p=+n[10],f=+(n[11]||0),h=(p*60+f)*6e4,n[9]==="-"&&(h=-h)),_=new Date(Date.UTC(e,i,r,s,o,a,c)),h&&_.setTime(_.getTime()-h),_}function Ul(t){return t.toISOString()}var Wl=new B("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:jl,construct:zl,instanceOf:Date,represent:Ul});function Bl(t){return t==="<<"||t===null}var Vl=new B("tag:yaml.org,2002:merge",{kind:"scalar",resolve:Bl}),Mr=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function ql(t){if(t===null)return!1;var n,e,i=0,r=t.length,s=Mr;for(e=0;e<r;e++)if(n=s.indexOf(t.charAt(e)),!(n>64)){if(n<0)return!1;i+=6}return i%8===0}function Kl(t){var n,e,i=t.replace(/[\r\n=]/g,""),r=i.length,s=Mr,o=0,a=[];for(n=0;n<r;n++)n%4===0&&n&&(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)),o=o<<6|s.indexOf(i.charAt(n));return e=r%4*6,e===0?(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)):e===18?(a.push(o>>10&255),a.push(o>>2&255)):e===12&&a.push(o>>4&255),new Uint8Array(a)}function Gl(t){var n="",e=0,i,r,s=t.length,o=Mr;for(i=0;i<s;i++)i%3===0&&i&&(n+=o[e>>18&63],n+=o[e>>12&63],n+=o[e>>6&63],n+=o[e&63]),e=(e<<8)+t[i];return r=s%3,r===0?(n+=o[e>>18&63],n+=o[e>>12&63],n+=o[e>>6&63],n+=o[e&63]):r===2?(n+=o[e>>10&63],n+=o[e>>4&63],n+=o[e<<2&63],n+=o[64]):r===1&&(n+=o[e>>2&63],n+=o[e<<4&63],n+=o[64],n+=o[64]),n}function Yl(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var Ql=new B("tag:yaml.org,2002:binary",{kind:"scalar",resolve:ql,construct:Kl,predicate:Yl,represent:Gl}),Jl=Object.prototype.hasOwnProperty,Xl=Object.prototype.toString;function Zl(t){if(t===null)return!0;var n=[],e,i,r,s,o,a=t;for(e=0,i=a.length;e<i;e+=1){if(r=a[e],o=!1,Xl.call(r)!=="[object Object]")return!1;for(s in r)if(Jl.call(r,s))if(!o)o=!0;else return!1;if(!o)return!1;if(n.indexOf(s)===-1)n.push(s);else return!1}return!0}function ed(t){return t!==null?t:[]}var td=new B("tag:yaml.org,2002:omap",{kind:"sequence",resolve:Zl,construct:ed}),id=Object.prototype.toString;function rd(t){if(t===null)return!0;var n,e,i,r,s,o=t;for(s=new Array(o.length),n=0,e=o.length;n<e;n+=1){if(i=o[n],id.call(i)!=="[object Object]"||(r=Object.keys(i),r.length!==1))return!1;s[n]=[r[0],i[r[0]]]}return!0}function nd(t){if(t===null)return[];var n,e,i,r,s,o=t;for(s=new Array(o.length),n=0,e=o.length;n<e;n+=1)i=o[n],r=Object.keys(i),s[n]=[r[0],i[r[0]]];return s}var sd=new B("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:rd,construct:nd}),od=Object.prototype.hasOwnProperty;function ad(t){if(t===null)return!0;var n,e=t;for(n in e)if(od.call(e,n)&&e[n]!==null)return!1;return!0}function ld(t){return t!==null?t:{}}var dd=new B("tag:yaml.org,2002:set",{kind:"mapping",resolve:ad,construct:ld}),Js=Ml.extend({implicit:[Wl,Vl],explicit:[Ql,td,sd,dd]}),Re=Object.prototype.hasOwnProperty,Ui=1,Xs=2,Zs=3,Wi=4,Dr=1,cd=2,Ds=3,ud=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,hd=/[\x85\u2028\u2029]/,pd=/[,\[\]\{\}]/,eo=/^(?:!|!!|![a-z\-]+!)$/i,to=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Hs(t){return Object.prototype.toString.call(t)}function ce(t){return t===10||t===13}function Qe(t){return t===9||t===32}function X(t){return t===9||t===32||t===10||t===13}function yt(t){return t===44||t===91||t===93||t===123||t===125}function md(t){var n;return 48<=t&&t<=57?t-48:(n=t|32,97<=n&&n<=102?n-97+10:-1)}function fd(t){return t===120?2:t===117?4:t===85?8:0}function gd(t){return 48<=t&&t<=57?t-48:-1}function Os(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"\x85":t===95?"\xA0":t===76?"\u2028":t===80?"\u2029":""}function _d(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function io(t,n,e){n==="__proto__"?Object.defineProperty(t,n,{configurable:!0,enumerable:!0,writable:!0,value:e}):t[n]=e}var ro=new Array(256),no=new Array(256);for(Ye=0;Ye<256;Ye++)ro[Ye]=Os(Ye)?1:0,no[Ye]=Os(Ye);var Ye;function vd(t,n){this.input=t,this.filename=n.filename||null,this.schema=n.schema||Js,this.onWarning=n.onWarning||null,this.legacy=n.legacy||!1,this.json=n.json||!1,this.listener=n.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function so(t,n){var e={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return e.snippet=sl(e),new J(n,e)}function k(t,n){throw so(t,n)}function Bi(t,n){t.onWarning&&t.onWarning.call(null,so(t,n))}var Ns={YAML:function(n,e,i){var r,s,o;n.version!==null&&k(n,"duplication of %YAML directive"),i.length!==1&&k(n,"YAML directive accepts exactly one argument"),r=/^([0-9]+)\.([0-9]+)$/.exec(i[0]),r===null&&k(n,"ill-formed argument of the YAML directive"),s=parseInt(r[1],10),o=parseInt(r[2],10),s!==1&&k(n,"unacceptable YAML version of the document"),n.version=i[0],n.checkLineBreaks=o<2,o!==1&&o!==2&&Bi(n,"unsupported YAML version of the document")},TAG:function(n,e,i){var r,s;i.length!==2&&k(n,"TAG directive accepts exactly two arguments"),r=i[0],s=i[1],eo.test(r)||k(n,"ill-formed tag handle (first argument) of the TAG directive"),Re.call(n.tagMap,r)&&k(n,'there is a previously declared suffix for "'+r+'" tag handle'),to.test(s)||k(n,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{k(n,"tag prefix is malformed: "+s)}n.tagMap[r]=s}};function Pe(t,n,e,i){var r,s,o,a;if(n<e){if(a=t.input.slice(n,e),i)for(r=0,s=a.length;r<s;r+=1)o=a.charCodeAt(r),o===9||32<=o&&o<=1114111||k(t,"expected valid JSON character");else ud.test(a)&&k(t,"the stream contains non-printable characters");t.result+=a}}function Is(t,n,e,i){var r,s,o,a;for(N.isObject(e)||k(t,"cannot merge mappings; the provided source object is unacceptable"),r=Object.keys(e),o=0,a=r.length;o<a;o+=1)s=r[o],Re.call(n,s)||(io(n,s,e[s]),i[s]=!0)}function bt(t,n,e,i,r,s,o,a,c){var h,p;if(Array.isArray(r))for(r=Array.prototype.slice.call(r),h=0,p=r.length;h<p;h+=1)Array.isArray(r[h])&&k(t,"nested arrays are not supported inside keys"),typeof r=="object"&&Hs(r[h])==="[object Object]"&&(r[h]="[object Object]");if(typeof r=="object"&&Hs(r)==="[object Object]"&&(r="[object Object]"),r=String(r),n===null&&(n={}),i==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(h=0,p=s.length;h<p;h+=1)Is(t,n,s[h],e);else Is(t,n,s,e);else!t.json&&!Re.call(e,r)&&Re.call(n,r)&&(t.line=o||t.line,t.lineStart=a||t.lineStart,t.position=c||t.position,k(t,"duplicated mapping key")),io(n,r,s),delete e[r];return n}function jr(t){var n;n=t.input.charCodeAt(t.position),n===10?t.position++:n===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):k(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function H(t,n,e){for(var i=0,r=t.input.charCodeAt(t.position);r!==0;){for(;Qe(r);)r===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),r=t.input.charCodeAt(++t.position);if(n&&r===35)do r=t.input.charCodeAt(++t.position);while(r!==10&&r!==13&&r!==0);if(ce(r))for(jr(t),r=t.input.charCodeAt(t.position),i++,t.lineIndent=0;r===32;)t.lineIndent++,r=t.input.charCodeAt(++t.position);else break}return e!==-1&&i!==0&&t.lineIndent<e&&Bi(t,"deficient indentation"),i}function Ki(t){var n=t.position,e;return e=t.input.charCodeAt(n),!!((e===45||e===46)&&e===t.input.charCodeAt(n+1)&&e===t.input.charCodeAt(n+2)&&(n+=3,e=t.input.charCodeAt(n),e===0||X(e)))}function zr(t,n){n===1?t.result+=" ":n>1&&(t.result+=N.repeat(`
`,n-1))}function yd(t,n,e){var i,r,s,o,a,c,h,p,f=t.kind,_=t.result,v;if(v=t.input.charCodeAt(t.position),X(v)||yt(v)||v===35||v===38||v===42||v===33||v===124||v===62||v===39||v===34||v===37||v===64||v===96||(v===63||v===45)&&(r=t.input.charCodeAt(t.position+1),X(r)||e&&yt(r)))return!1;for(t.kind="scalar",t.result="",s=o=t.position,a=!1;v!==0;){if(v===58){if(r=t.input.charCodeAt(t.position+1),X(r)||e&&yt(r))break}else if(v===35){if(i=t.input.charCodeAt(t.position-1),X(i))break}else{if(t.position===t.lineStart&&Ki(t)||e&&yt(v))break;if(ce(v))if(c=t.line,h=t.lineStart,p=t.lineIndent,H(t,!1,-1),t.lineIndent>=n){a=!0,v=t.input.charCodeAt(t.position);continue}else{t.position=o,t.line=c,t.lineStart=h,t.lineIndent=p;break}}a&&(Pe(t,s,o,!1),zr(t,t.line-c),s=o=t.position,a=!1),Qe(v)||(o=t.position+1),v=t.input.charCodeAt(++t.position)}return Pe(t,s,o,!1),t.result?!0:(t.kind=f,t.result=_,!1)}function bd(t,n){var e,i,r;if(e=t.input.charCodeAt(t.position),e!==39)return!1;for(t.kind="scalar",t.result="",t.position++,i=r=t.position;(e=t.input.charCodeAt(t.position))!==0;)if(e===39)if(Pe(t,i,t.position,!0),e=t.input.charCodeAt(++t.position),e===39)i=t.position,t.position++,r=t.position;else return!0;else ce(e)?(Pe(t,i,r,!0),zr(t,H(t,!1,n)),i=r=t.position):t.position===t.lineStart&&Ki(t)?k(t,"unexpected end of the document within a single quoted scalar"):(t.position++,r=t.position);k(t,"unexpected end of the stream within a single quoted scalar")}function wd(t,n){var e,i,r,s,o,a;if(a=t.input.charCodeAt(t.position),a!==34)return!1;for(t.kind="scalar",t.result="",t.position++,e=i=t.position;(a=t.input.charCodeAt(t.position))!==0;){if(a===34)return Pe(t,e,t.position,!0),t.position++,!0;if(a===92){if(Pe(t,e,t.position,!0),a=t.input.charCodeAt(++t.position),ce(a))H(t,!1,n);else if(a<256&&ro[a])t.result+=no[a],t.position++;else if((o=fd(a))>0){for(r=o,s=0;r>0;r--)a=t.input.charCodeAt(++t.position),(o=md(a))>=0?s=(s<<4)+o:k(t,"expected hexadecimal character");t.result+=_d(s),t.position++}else k(t,"unknown escape sequence");e=i=t.position}else ce(a)?(Pe(t,e,i,!0),zr(t,H(t,!1,n)),e=i=t.position):t.position===t.lineStart&&Ki(t)?k(t,"unexpected end of the document within a double quoted scalar"):(t.position++,i=t.position)}k(t,"unexpected end of the stream within a double quoted scalar")}function xd(t,n){var e=!0,i,r,s,o=t.tag,a,c=t.anchor,h,p,f,_,v,x=Object.create(null),E,P,Y,L;if(L=t.input.charCodeAt(t.position),L===91)p=93,v=!1,a=[];else if(L===123)p=125,v=!0,a={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=a),L=t.input.charCodeAt(++t.position);L!==0;){if(H(t,!0,n),L=t.input.charCodeAt(t.position),L===p)return t.position++,t.tag=o,t.anchor=c,t.kind=v?"mapping":"sequence",t.result=a,!0;e?L===44&&k(t,"expected the node content, but found ','"):k(t,"missed comma between flow collection entries"),P=E=Y=null,f=_=!1,L===63&&(h=t.input.charCodeAt(t.position+1),X(h)&&(f=_=!0,t.position++,H(t,!0,n))),i=t.line,r=t.lineStart,s=t.position,wt(t,n,Ui,!1,!0),P=t.tag,E=t.result,H(t,!0,n),L=t.input.charCodeAt(t.position),(_||t.line===i)&&L===58&&(f=!0,L=t.input.charCodeAt(++t.position),H(t,!0,n),wt(t,n,Ui,!1,!0),Y=t.result),v?bt(t,a,x,P,E,Y,i,r,s):f?a.push(bt(t,null,x,P,E,Y,i,r,s)):a.push(E),H(t,!0,n),L=t.input.charCodeAt(t.position),L===44?(e=!0,L=t.input.charCodeAt(++t.position)):e=!1}k(t,"unexpected end of the stream within a flow collection")}function $d(t,n){var e,i,r=Dr,s=!1,o=!1,a=n,c=0,h=!1,p,f;if(f=t.input.charCodeAt(t.position),f===124)i=!1;else if(f===62)i=!0;else return!1;for(t.kind="scalar",t.result="";f!==0;)if(f=t.input.charCodeAt(++t.position),f===43||f===45)Dr===r?r=f===43?Ds:cd:k(t,"repeat of a chomping mode identifier");else if((p=gd(f))>=0)p===0?k(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):o?k(t,"repeat of an indentation width identifier"):(a=n+p-1,o=!0);else break;if(Qe(f)){do f=t.input.charCodeAt(++t.position);while(Qe(f));if(f===35)do f=t.input.charCodeAt(++t.position);while(!ce(f)&&f!==0)}for(;f!==0;){for(jr(t),t.lineIndent=0,f=t.input.charCodeAt(t.position);(!o||t.lineIndent<a)&&f===32;)t.lineIndent++,f=t.input.charCodeAt(++t.position);if(!o&&t.lineIndent>a&&(a=t.lineIndent),ce(f)){c++;continue}if(t.lineIndent<a){r===Ds?t.result+=N.repeat(`
`,s?1+c:c):r===Dr&&s&&(t.result+=`
`);break}for(i?Qe(f)?(h=!0,t.result+=N.repeat(`
`,s?1+c:c)):h?(h=!1,t.result+=N.repeat(`
`,c+1)):c===0?s&&(t.result+=" "):t.result+=N.repeat(`
`,c):t.result+=N.repeat(`
`,s?1+c:c),s=!0,o=!0,c=0,e=t.position;!ce(f)&&f!==0;)f=t.input.charCodeAt(++t.position);Pe(t,e,t.position,!1)}return!0}function Fs(t,n){var e,i=t.tag,r=t.anchor,s=[],o,a=!1,c;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=s),c=t.input.charCodeAt(t.position);c!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,k(t,"tab characters must not be used in indentation")),!(c!==45||(o=t.input.charCodeAt(t.position+1),!X(o))));){if(a=!0,t.position++,H(t,!0,-1)&&t.lineIndent<=n){s.push(null),c=t.input.charCodeAt(t.position);continue}if(e=t.line,wt(t,n,Zs,!1,!0),s.push(t.result),H(t,!0,-1),c=t.input.charCodeAt(t.position),(t.line===e||t.lineIndent>n)&&c!==0)k(t,"bad indentation of a sequence entry");else if(t.lineIndent<n)break}return a?(t.tag=i,t.anchor=r,t.kind="sequence",t.result=s,!0):!1}function kd(t,n,e){var i,r,s,o,a,c,h=t.tag,p=t.anchor,f={},_=Object.create(null),v=null,x=null,E=null,P=!1,Y=!1,L;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=f),L=t.input.charCodeAt(t.position);L!==0;){if(!P&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,k(t,"tab characters must not be used in indentation")),i=t.input.charCodeAt(t.position+1),s=t.line,(L===63||L===58)&&X(i))L===63?(P&&(bt(t,f,_,v,x,null,o,a,c),v=x=E=null),Y=!0,P=!0,r=!0):P?(P=!1,r=!0):k(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,L=i;else{if(o=t.line,a=t.lineStart,c=t.position,!wt(t,e,Xs,!1,!0))break;if(t.line===s){for(L=t.input.charCodeAt(t.position);Qe(L);)L=t.input.charCodeAt(++t.position);if(L===58)L=t.input.charCodeAt(++t.position),X(L)||k(t,"a whitespace character is expected after the key-value separator within a block mapping"),P&&(bt(t,f,_,v,x,null,o,a,c),v=x=E=null),Y=!0,P=!1,r=!1,v=t.tag,x=t.result;else if(Y)k(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=h,t.anchor=p,!0}else if(Y)k(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=h,t.anchor=p,!0}if((t.line===s||t.lineIndent>n)&&(P&&(o=t.line,a=t.lineStart,c=t.position),wt(t,n,Wi,!0,r)&&(P?x=t.result:E=t.result),P||(bt(t,f,_,v,x,E,o,a,c),v=x=E=null),H(t,!0,-1),L=t.input.charCodeAt(t.position)),(t.line===s||t.lineIndent>n)&&L!==0)k(t,"bad indentation of a mapping entry");else if(t.lineIndent<n)break}return P&&bt(t,f,_,v,x,null,o,a,c),Y&&(t.tag=h,t.anchor=p,t.kind="mapping",t.result=f),Y}function Ed(t){var n,e=!1,i=!1,r,s,o;if(o=t.input.charCodeAt(t.position),o!==33)return!1;if(t.tag!==null&&k(t,"duplication of a tag property"),o=t.input.charCodeAt(++t.position),o===60?(e=!0,o=t.input.charCodeAt(++t.position)):o===33?(i=!0,r="!!",o=t.input.charCodeAt(++t.position)):r="!",n=t.position,e){do o=t.input.charCodeAt(++t.position);while(o!==0&&o!==62);t.position<t.length?(s=t.input.slice(n,t.position),o=t.input.charCodeAt(++t.position)):k(t,"unexpected end of the stream within a verbatim tag")}else{for(;o!==0&&!X(o);)o===33&&(i?k(t,"tag suffix cannot contain exclamation marks"):(r=t.input.slice(n-1,t.position+1),eo.test(r)||k(t,"named tag handle cannot contain such characters"),i=!0,n=t.position+1)),o=t.input.charCodeAt(++t.position);s=t.input.slice(n,t.position),pd.test(s)&&k(t,"tag suffix cannot contain flow indicator characters")}s&&!to.test(s)&&k(t,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{k(t,"tag name is malformed: "+s)}return e?t.tag=s:Re.call(t.tagMap,r)?t.tag=t.tagMap[r]+s:r==="!"?t.tag="!"+s:r==="!!"?t.tag="tag:yaml.org,2002:"+s:k(t,'undeclared tag handle "'+r+'"'),!0}function Cd(t){var n,e;if(e=t.input.charCodeAt(t.position),e!==38)return!1;for(t.anchor!==null&&k(t,"duplication of an anchor property"),e=t.input.charCodeAt(++t.position),n=t.position;e!==0&&!X(e)&&!yt(e);)e=t.input.charCodeAt(++t.position);return t.position===n&&k(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(n,t.position),!0}function Sd(t){var n,e,i;if(i=t.input.charCodeAt(t.position),i!==42)return!1;for(i=t.input.charCodeAt(++t.position),n=t.position;i!==0&&!X(i)&&!yt(i);)i=t.input.charCodeAt(++t.position);return t.position===n&&k(t,"name of an alias node must contain at least one character"),e=t.input.slice(n,t.position),Re.call(t.anchorMap,e)||k(t,'unidentified alias "'+e+'"'),t.result=t.anchorMap[e],H(t,!0,-1),!0}function wt(t,n,e,i,r){var s,o,a,c=1,h=!1,p=!1,f,_,v,x,E,P;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,s=o=a=Wi===e||Zs===e,i&&H(t,!0,-1)&&(h=!0,t.lineIndent>n?c=1:t.lineIndent===n?c=0:t.lineIndent<n&&(c=-1)),c===1)for(;Ed(t)||Cd(t);)H(t,!0,-1)?(h=!0,a=s,t.lineIndent>n?c=1:t.lineIndent===n?c=0:t.lineIndent<n&&(c=-1)):a=!1;if(a&&(a=h||r),(c===1||Wi===e)&&(Ui===e||Xs===e?E=n:E=n+1,P=t.position-t.lineStart,c===1?a&&(Fs(t,P)||kd(t,P,E))||xd(t,E)?p=!0:(o&&$d(t,E)||bd(t,E)||wd(t,E)?p=!0:Sd(t)?(p=!0,(t.tag!==null||t.anchor!==null)&&k(t,"alias node should not have any properties")):yd(t,E,Ui===e)&&(p=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):c===0&&(p=a&&Fs(t,P))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&k(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),f=0,_=t.implicitTypes.length;f<_;f+=1)if(x=t.implicitTypes[f],x.resolve(t.result)){t.result=x.construct(t.result),t.tag=x.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(Re.call(t.typeMap[t.kind||"fallback"],t.tag))x=t.typeMap[t.kind||"fallback"][t.tag];else for(x=null,v=t.typeMap.multi[t.kind||"fallback"],f=0,_=v.length;f<_;f+=1)if(t.tag.slice(0,v[f].tag.length)===v[f].tag){x=v[f];break}x||k(t,"unknown tag !<"+t.tag+">"),t.result!==null&&x.kind!==t.kind&&k(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+x.kind+'", not "'+t.kind+'"'),x.resolve(t.result,t.tag)?(t.result=x.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):k(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||p}function Td(t){var n=t.position,e,i,r,s=!1,o;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(o=t.input.charCodeAt(t.position))!==0&&(H(t,!0,-1),o=t.input.charCodeAt(t.position),!(t.lineIndent>0||o!==37));){for(s=!0,o=t.input.charCodeAt(++t.position),e=t.position;o!==0&&!X(o);)o=t.input.charCodeAt(++t.position);for(i=t.input.slice(e,t.position),r=[],i.length<1&&k(t,"directive name must not be less than one character in length");o!==0;){for(;Qe(o);)o=t.input.charCodeAt(++t.position);if(o===35){do o=t.input.charCodeAt(++t.position);while(o!==0&&!ce(o));break}if(ce(o))break;for(e=t.position;o!==0&&!X(o);)o=t.input.charCodeAt(++t.position);r.push(t.input.slice(e,t.position))}o!==0&&jr(t),Re.call(Ns,i)?Ns[i](t,i,r):Bi(t,'unknown document directive "'+i+'"')}if(H(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,H(t,!0,-1)):s&&k(t,"directives end mark is expected"),wt(t,t.lineIndent-1,Wi,!1,!0),H(t,!0,-1),t.checkLineBreaks&&hd.test(t.input.slice(n,t.position))&&Bi(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&Ki(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,H(t,!0,-1));return}if(t.position<t.length-1)k(t,"end of the stream or a document separator is expected");else return}function oo(t,n){t=String(t),n=n||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var e=new vd(t,n),i=t.indexOf("\0");for(i!==-1&&(e.position=i,k(e,"null byte is not allowed in input")),e.input+="\0";e.input.charCodeAt(e.position)===32;)e.lineIndent+=1,e.position+=1;for(;e.position<e.length-1;)Td(e);return e.documents}function Ld(t,n,e){n!==null&&typeof n=="object"&&typeof e>"u"&&(e=n,n=null);var i=oo(t,e);if(typeof n!="function")return i;for(var r=0,s=i.length;r<s;r+=1)n(i[r])}function Pd(t,n){var e=oo(t,n);if(e.length!==0){if(e.length===1)return e[0];throw new J("expected a single document in the stream, but found more")}}var Rd=Ld,Ad=Pd,ao={loadAll:Rd,load:Ad},lo=Object.prototype.toString,co=Object.prototype.hasOwnProperty,Ur=65279,Dd=9,Kt=10,Hd=13,Od=32,Nd=33,Id=34,Or=35,Fd=37,Md=38,jd=39,zd=42,uo=44,Ud=45,Vi=58,Wd=61,Bd=62,Vd=63,qd=64,ho=91,po=93,Kd=96,mo=123,Gd=124,fo=125,V={};V[0]="\\0";V[7]="\\a";V[8]="\\b";V[9]="\\t";V[10]="\\n";V[11]="\\v";V[12]="\\f";V[13]="\\r";V[27]="\\e";V[34]='\\"';V[92]="\\\\";V[133]="\\N";V[160]="\\_";V[8232]="\\L";V[8233]="\\P";var Yd=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],Qd=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function Jd(t,n){var e,i,r,s,o,a,c;if(n===null)return{};for(e={},i=Object.keys(n),r=0,s=i.length;r<s;r+=1)o=i[r],a=String(n[o]),o.slice(0,2)==="!!"&&(o="tag:yaml.org,2002:"+o.slice(2)),c=t.compiledTypeMap.fallback[o],c&&co.call(c.styleAliases,a)&&(a=c.styleAliases[a]),e[o]=a;return e}function Xd(t){var n,e,i;if(n=t.toString(16).toUpperCase(),t<=255)e="x",i=2;else if(t<=65535)e="u",i=4;else if(t<=4294967295)e="U",i=8;else throw new J("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+e+N.repeat("0",i-n.length)+n}var Zd=1,Gt=2;function ec(t){this.schema=t.schema||Js,this.indent=Math.max(1,t.indent||2),this.noArrayIndent=t.noArrayIndent||!1,this.skipInvalid=t.skipInvalid||!1,this.flowLevel=N.isNothing(t.flowLevel)?-1:t.flowLevel,this.styleMap=Jd(this.schema,t.styles||null),this.sortKeys=t.sortKeys||!1,this.lineWidth=t.lineWidth||80,this.noRefs=t.noRefs||!1,this.noCompatMode=t.noCompatMode||!1,this.condenseFlow=t.condenseFlow||!1,this.quotingType=t.quotingType==='"'?Gt:Zd,this.forceQuotes=t.forceQuotes||!1,this.replacer=typeof t.replacer=="function"?t.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Ms(t,n){for(var e=N.repeat(" ",n),i=0,r=-1,s="",o,a=t.length;i<a;)r=t.indexOf(`
`,i),r===-1?(o=t.slice(i),i=a):(o=t.slice(i,r+1),i=r+1),o.length&&o!==`
`&&(s+=e),s+=o;return s}function Nr(t,n){return`
`+N.repeat(" ",t.indent*n)}function tc(t,n){var e,i,r;for(e=0,i=t.implicitTypes.length;e<i;e+=1)if(r=t.implicitTypes[e],r.resolve(n))return!0;return!1}function qi(t){return t===Od||t===Dd}function Yt(t){return 32<=t&&t<=126||161<=t&&t<=55295&&t!==8232&&t!==8233||57344<=t&&t<=65533&&t!==Ur||65536<=t&&t<=1114111}function js(t){return Yt(t)&&t!==Ur&&t!==Hd&&t!==Kt}function zs(t,n,e){var i=js(t),r=i&&!qi(t);return(e?i:i&&t!==uo&&t!==ho&&t!==po&&t!==mo&&t!==fo)&&t!==Or&&!(n===Vi&&!r)||js(n)&&!qi(n)&&t===Or||n===Vi&&r}function ic(t){return Yt(t)&&t!==Ur&&!qi(t)&&t!==Ud&&t!==Vd&&t!==Vi&&t!==uo&&t!==ho&&t!==po&&t!==mo&&t!==fo&&t!==Or&&t!==Md&&t!==zd&&t!==Nd&&t!==Gd&&t!==Wd&&t!==Bd&&t!==jd&&t!==Id&&t!==Fd&&t!==qd&&t!==Kd}function rc(t){return!qi(t)&&t!==Vi}function Vt(t,n){var e=t.charCodeAt(n),i;return e>=55296&&e<=56319&&n+1<t.length&&(i=t.charCodeAt(n+1),i>=56320&&i<=57343)?(e-55296)*1024+i-56320+65536:e}function go(t){var n=/^\n* /;return n.test(t)}var _o=1,Ir=2,vo=3,yo=4,vt=5;function nc(t,n,e,i,r,s,o,a){var c,h=0,p=null,f=!1,_=!1,v=i!==-1,x=-1,E=ic(Vt(t,0))&&rc(Vt(t,t.length-1));if(n||o)for(c=0;c<t.length;h>=65536?c+=2:c++){if(h=Vt(t,c),!Yt(h))return vt;E=E&&zs(h,p,a),p=h}else{for(c=0;c<t.length;h>=65536?c+=2:c++){if(h=Vt(t,c),h===Kt)f=!0,v&&(_=_||c-x-1>i&&t[x+1]!==" ",x=c);else if(!Yt(h))return vt;E=E&&zs(h,p,a),p=h}_=_||v&&c-x-1>i&&t[x+1]!==" "}return!f&&!_?E&&!o&&!r(t)?_o:s===Gt?vt:Ir:e>9&&go(t)?vt:o?s===Gt?vt:Ir:_?yo:vo}function sc(t,n,e,i,r){t.dump=(function(){if(n.length===0)return t.quotingType===Gt?'""':"''";if(!t.noCompatMode&&(Yd.indexOf(n)!==-1||Qd.test(n)))return t.quotingType===Gt?'"'+n+'"':"'"+n+"'";var s=t.indent*Math.max(1,e),o=t.lineWidth===-1?-1:Math.max(Math.min(t.lineWidth,40),t.lineWidth-s),a=i||t.flowLevel>-1&&e>=t.flowLevel;function c(h){return tc(t,h)}switch(nc(n,a,t.indent,o,c,t.quotingType,t.forceQuotes&&!i,r)){case _o:return n;case Ir:return"'"+n.replace(/'/g,"''")+"'";case vo:return"|"+Us(n,t.indent)+Ws(Ms(n,s));case yo:return">"+Us(n,t.indent)+Ws(Ms(oc(n,o),s));case vt:return'"'+ac(n)+'"';default:throw new J("impossible error: invalid scalar style")}})()}function Us(t,n){var e=go(t)?String(n):"",i=t[t.length-1]===`
`,r=i&&(t[t.length-2]===`
`||t===`
`),s=r?"+":i?"":"-";return e+s+`
`}function Ws(t){return t[t.length-1]===`
`?t.slice(0,-1):t}function oc(t,n){for(var e=/(\n+)([^\n]*)/g,i=(function(){var h=t.indexOf(`
`);return h=h!==-1?h:t.length,e.lastIndex=h,Bs(t.slice(0,h),n)})(),r=t[0]===`
`||t[0]===" ",s,o;o=e.exec(t);){var a=o[1],c=o[2];s=c[0]===" ",i+=a+(!r&&!s&&c!==""?`
`:"")+Bs(c,n),r=s}return i}function Bs(t,n){if(t===""||t[0]===" ")return t;for(var e=/ [^ ]/g,i,r=0,s,o=0,a=0,c="";i=e.exec(t);)a=i.index,a-r>n&&(s=o>r?o:a,c+=`
`+t.slice(r,s),r=s+1),o=a;return c+=`
`,t.length-r>n&&o>r?c+=t.slice(r,o)+`
`+t.slice(o+1):c+=t.slice(r),c.slice(1)}function ac(t){for(var n="",e=0,i,r=0;r<t.length;e>=65536?r+=2:r++)e=Vt(t,r),i=V[e],!i&&Yt(e)?(n+=t[r],e>=65536&&(n+=t[r+1])):n+=i||Xd(e);return n}function lc(t,n,e){var i="",r=t.tag,s,o,a;for(s=0,o=e.length;s<o;s+=1)a=e[s],t.replacer&&(a=t.replacer.call(e,String(s),a)),(we(t,n,a,!1,!1)||typeof a>"u"&&we(t,n,null,!1,!1))&&(i!==""&&(i+=","+(t.condenseFlow?"":" ")),i+=t.dump);t.tag=r,t.dump="["+i+"]"}function Vs(t,n,e,i){var r="",s=t.tag,o,a,c;for(o=0,a=e.length;o<a;o+=1)c=e[o],t.replacer&&(c=t.replacer.call(e,String(o),c)),(we(t,n+1,c,!0,!0,!1,!0)||typeof c>"u"&&we(t,n+1,null,!0,!0,!1,!0))&&((!i||r!=="")&&(r+=Nr(t,n)),t.dump&&Kt===t.dump.charCodeAt(0)?r+="-":r+="- ",r+=t.dump);t.tag=s,t.dump=r||"[]"}function dc(t,n,e){var i="",r=t.tag,s=Object.keys(e),o,a,c,h,p;for(o=0,a=s.length;o<a;o+=1)p="",i!==""&&(p+=", "),t.condenseFlow&&(p+='"'),c=s[o],h=e[c],t.replacer&&(h=t.replacer.call(e,c,h)),we(t,n,c,!1,!1)&&(t.dump.length>1024&&(p+="? "),p+=t.dump+(t.condenseFlow?'"':"")+":"+(t.condenseFlow?"":" "),we(t,n,h,!1,!1)&&(p+=t.dump,i+=p));t.tag=r,t.dump="{"+i+"}"}function cc(t,n,e,i){var r="",s=t.tag,o=Object.keys(e),a,c,h,p,f,_;if(t.sortKeys===!0)o.sort();else if(typeof t.sortKeys=="function")o.sort(t.sortKeys);else if(t.sortKeys)throw new J("sortKeys must be a boolean or a function");for(a=0,c=o.length;a<c;a+=1)_="",(!i||r!=="")&&(_+=Nr(t,n)),h=o[a],p=e[h],t.replacer&&(p=t.replacer.call(e,h,p)),we(t,n+1,h,!0,!0,!0)&&(f=t.tag!==null&&t.tag!=="?"||t.dump&&t.dump.length>1024,f&&(t.dump&&Kt===t.dump.charCodeAt(0)?_+="?":_+="? "),_+=t.dump,f&&(_+=Nr(t,n)),we(t,n+1,p,!0,f)&&(t.dump&&Kt===t.dump.charCodeAt(0)?_+=":":_+=": ",_+=t.dump,r+=_));t.tag=s,t.dump=r||"{}"}function qs(t,n,e){var i,r,s,o,a,c;for(r=e?t.explicitTypes:t.implicitTypes,s=0,o=r.length;s<o;s+=1)if(a=r[s],(a.instanceOf||a.predicate)&&(!a.instanceOf||typeof n=="object"&&n instanceof a.instanceOf)&&(!a.predicate||a.predicate(n))){if(e?a.multi&&a.representName?t.tag=a.representName(n):t.tag=a.tag:t.tag="?",a.represent){if(c=t.styleMap[a.tag]||a.defaultStyle,lo.call(a.represent)==="[object Function]")i=a.represent(n,c);else if(co.call(a.represent,c))i=a.represent[c](n,c);else throw new J("!<"+a.tag+'> tag resolver accepts not "'+c+'" style');t.dump=i}return!0}return!1}function we(t,n,e,i,r,s,o){t.tag=null,t.dump=e,qs(t,e,!1)||qs(t,e,!0);var a=lo.call(t.dump),c=i,h;i&&(i=t.flowLevel<0||t.flowLevel>n);var p=a==="[object Object]"||a==="[object Array]",f,_;if(p&&(f=t.duplicates.indexOf(e),_=f!==-1),(t.tag!==null&&t.tag!=="?"||_||t.indent!==2&&n>0)&&(r=!1),_&&t.usedDuplicates[f])t.dump="*ref_"+f;else{if(p&&_&&!t.usedDuplicates[f]&&(t.usedDuplicates[f]=!0),a==="[object Object]")i&&Object.keys(t.dump).length!==0?(cc(t,n,t.dump,r),_&&(t.dump="&ref_"+f+t.dump)):(dc(t,n,t.dump),_&&(t.dump="&ref_"+f+" "+t.dump));else if(a==="[object Array]")i&&t.dump.length!==0?(t.noArrayIndent&&!o&&n>0?Vs(t,n-1,t.dump,r):Vs(t,n,t.dump,r),_&&(t.dump="&ref_"+f+t.dump)):(lc(t,n,t.dump),_&&(t.dump="&ref_"+f+" "+t.dump));else if(a==="[object String]")t.tag!=="?"&&sc(t,t.dump,n,s,c);else{if(a==="[object Undefined]")return!1;if(t.skipInvalid)return!1;throw new J("unacceptable kind of an object to dump "+a)}t.tag!==null&&t.tag!=="?"&&(h=encodeURI(t.tag[0]==="!"?t.tag.slice(1):t.tag).replace(/!/g,"%21"),t.tag[0]==="!"?h="!"+h:h.slice(0,18)==="tag:yaml.org,2002:"?h="!!"+h.slice(18):h="!<"+h+">",t.dump=h+" "+t.dump)}return!0}function uc(t,n){var e=[],i=[],r,s;for(Fr(t,e,i),r=0,s=i.length;r<s;r+=1)n.duplicates.push(e[i[r]]);n.usedDuplicates=new Array(s)}function Fr(t,n,e){var i,r,s;if(t!==null&&typeof t=="object")if(r=n.indexOf(t),r!==-1)e.indexOf(r)===-1&&e.push(r);else if(n.push(t),Array.isArray(t))for(r=0,s=t.length;r<s;r+=1)Fr(t[r],n,e);else for(i=Object.keys(t),r=0,s=i.length;r<s;r+=1)Fr(t[i[r]],n,e)}function hc(t,n){n=n||{};var e=new ec(n);e.noRefs||uc(t,e);var i=t;return e.replacer&&(i=e.replacer.call({"":i},"",i)),we(e,0,i,!0,!0)?e.dump+`
`:""}var pc=hc,mc={dump:pc};function Wr(t,n){return function(){throw new Error("Function yaml."+t+" is removed in js-yaml 4. Use yaml."+n+" instead, which is now safe by default.")}}var bo=ao.load,Vp=ao.loadAll,Gi=mc.dump;var qp=Wr("safeLoad","load"),Kp=Wr("safeLoadAll","loadAll"),Gp=Wr("safeDump","dump");var ue=class extends b{constructor(){super(...arguments);this.value=null;this._mode="form";this._yamlText="";this._yamlError=null;this._computeFieldLabel=e=>Tr(this.hass,this._picked??"",e.name);this._computeFieldHelper=e=>{let r=this._currentFields()?.[e.name]?.description;return typeof r=="string"?r:""}}willUpdate(e){super.willUpdate?.(e),e.has("value")&&this._mode==="form"&&(this._yamlText=Gi(this.value??{}))}connectedCallback(){super.connectedCallback(),this._yamlText=Gi(this.value??{})}_setMode(e){e==="form"&&this._yamlError!==null||(e==="yaml"&&(this._yamlText=Gi(this.value??{})),this._mode=e)}_onYamlInput(e){this._yamlText=e;let i;try{i=bo(e)}catch(c){this._yamlError=c.message;return}if(i==null){this._yamlError=null,this._emit(null);return}if(typeof i!="object"||Array.isArray(i)){this._yamlError=l(this.hass,"ui.yaml_expect_object","Expected an object");return}let r=i,s=r.script;if(typeof s!="string"||!s.startsWith("script.")){this._yamlError=l(this.hass,"ui.yaml_script_string","`script` must be a 'script.<name>' string");return}let o=r.args;if(o!==void 0&&(typeof o!="object"||Array.isArray(o)||o===null)){this._yamlError=l(this.hass,"ui.yaml_args_object","`args` must be an object if present");return}let a=r.triggers;if(a!==void 0&&(!Array.isArray(a)||!a.every(c=>typeof c=="string"))){this._yamlError=l(this.hass,"ui.yaml_triggers_list","`triggers` must be a list of entity_id strings if present");return}this._yamlError=null,this._emit({script:s,args:o??{},triggers:a})}_emit(e){this.value=e,T(this,this.value)}_scriptIds(){let e=this.hass?.services;return Object.keys(e?.script??{}).sort().map(r=>`script.${r}`)}_label(e){return j(this.hass,e)}_fieldsFor(e){if(!e)return;let i=e.replace(/^script\./,"");return this.hass?.services?.script?.[i]?.fields}get _picked(){return this.value&&typeof this.value=="object"?this.value.script:null}_currentFields(){return this._fieldsFor(this._picked)}_defaultArgs(e){let i=this._fieldsFor(e)??{},r={};for(let[s,o]of Object.entries(i))o&&Object.hasOwn(o,"default")&&(r[s]=o.default);return r}_pickerSchema(){return[{name:"script",selector:{select:{mode:"dropdown",options:this._scriptIds().map(e=>({value:e,label:this._label(e)}))}}}]}_pickScript(e){if(!e){this._emit(null);return}this._emit({script:e,args:this._defaultArgs(e)})}_argsSchema(){let e=this._currentFields();return e?Object.entries(e).map(([i,r])=>({name:i,required:r.required,selector:r.selector??{text:{}}})):[]}_updateArgs(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:e,triggers:this.value.triggers})}get _triggers(){return this.value&&typeof this.value=="object"&&this.value.triggers||[]}_setTriggers(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:this.value.args,triggers:e})}_removeTrigger(e){this._setTriggers(this._triggers.filter(i=>i!==e))}_addTrigger(e){this._triggers.includes(e)||this._setTriggers([...this._triggers,e])}render(){let e=this._picked,i=this._argsSchema(),r=(this.value&&typeof this.value=="object"?this.value.args:{})??{},s=i.length>0;return d`
      <div class="section">
        <h4>${l(this.hass,"ui.script","Script")}</h4>
        ${this._renderPicker(e)}
      </div>
      ${e?d`
        <div class="tabs">
          <button
            type="button"
            ?disabled=${this._yamlError!==null}
            title=${this._yamlError??""}
            class=${this._mode==="form"?"active":""}
            @click=${()=>this._setMode("form")}
          >${l(this.hass,"ui.form","Form")}</button>
          <button
            type="button"
            class=${this._mode==="yaml"?"active":""}
            @click=${()=>this._setMode("yaml")}
          >${l(this.hass,"ui.yaml","YAML")}</button>
        </div>
      `:""}
      ${e&&this._mode==="form"&&s?d`
        <div class="section args">
          <h4>${l(this.hass,"ui.arguments","Arguments")}</h4>
          ${this._renderArgs(i,r)}
        </div>
      `:""}
      ${e&&this._mode==="form"?this._renderTriggers():""}
      ${e&&this._mode==="yaml"?this._renderYaml():""}
    `}_renderTriggers(){let e=this._triggers;return d`
      <div class="section triggers">
        <h4>${l(this.hass,"ui.script_triggers","Triggers")}</h4>
        <p class="help">
          ${l(this.hass,"ui.script_triggers_help","Re-evaluate this scene when these entities change. A script is opaque, so templated references may be missed \u2014 add any it depends on.")}
        </p>
        ${this._renderTriggerPicker(e)}
      </div>
    `}_renderTriggerPicker(e){if(customElements.get("ha-form")){let i=[{name:"triggers",selector:{entity:{multiple:!0}}}];return d`<ha-form
        .hass=${this.hass}
        .schema=${i}
        .data=${{triggers:e}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setTriggers(r.detail.value.triggers??[])}}
      ></ha-form>`}return d`
      <div class="chips">
        ${e.length===0?d`<span class="muted">${l(this.hass,"ui.script_triggers_none","No triggers")}</span>`:e.map(i=>d`<span class="chip" data-test=${`trigger-${i}`}>
                ${i}
                <button type="button" class="x" title=${l(this.hass,"ui.remove","Remove")} @click=${()=>this._removeTrigger(i)}>×</button>
              </span>`)}
      </div>
      <input
        data-test="trigger-add-input"
        placeholder="entity_id"
        @change=${i=>{let r=i.target,s=r.value.trim();s&&this._addTrigger(s),r.value=""}}
      />
    `}_renderYaml(){let e=i=>{i.stopPropagation();let r=i.target.value??i.detail?.value??"";this._onYamlInput(r)};return customElements.get("ha-code-editor")?d`
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
    `}_renderArgs(e,i){return customElements.get("ha-form")?d`<ha-form
        .hass=${this.hass}
        .schema=${e}
        .data=${i}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${r=>{r.stopPropagation(),this._updateArgs(r.detail.value)}}
      ></ha-form>`:d`${e.map(r=>{let s=i[r.name];return d`
        <label style="display:block;margin-bottom:0.4rem;">
          <span style="display:inline-block;min-width:8em;">${r.name}</span>
          <input
            .value=${s==null?"":String(s)}
            @change=${o=>{let a=o.target.value,c={...i,[r.name]:a};this._updateArgs(c)}}
          />
        </label>
      `})}`}_renderPicker(e){return customElements.get("ha-form")?d`<ha-form
        .hass=${this.hass}
        .schema=${this._pickerSchema()}
        .data=${{script:e??""}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),this._pickScript(i.detail.value.script||null)}}
      ></ha-form>`:d`<select
      @change=${i=>this._pickScript(i.target.value||null)}>
      <option value="" ?selected=${!e}>(none)</option>
      ${this._scriptIds().map(i=>d`<option value=${i} ?selected=${i===e}>${this._label(i)}</option>`)}
    </select>`}};ue.styles=y`
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
  `,u([m({attribute:!1})],ue.prototype,"hass",2),u([m({attribute:!1})],ue.prototype,"value",2),u([g()],ue.prototype,"_mode",2),u([g()],ue.prototype,"_yamlText",2),u([g()],ue.prototype,"_yamlError",2),ue=u([w("ambience-script-predicate-input")],ue);var fc=["dawn","sunrise","noon","sunset","dusk","midnight"],Je=class extends b{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){T(this,e)}_onKindChange(e){let i=e.target.value;i!==this.value.kind&&(i==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let i=e.target.value,[r,s]=i.split(":").map(o=>parseInt(o,10));Number.isNaN(r)||Number.isNaN(s)||this._emit({kind:"time",hh:r,mm:s})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let i=e.target.value;this._emit({...this.value,anchor:i})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let i=e.target.value.trim(),r=i===""?0:parseInt(i,10);Number.isNaN(r)||this._emit({...this.value,offset_min:r})}_onClampDirChange(e){if(this.value.kind!=="sun")return;let i=e.target.value;if(i===""){this._emit({kind:"sun",anchor:this.value.anchor,offset_min:this.value.offset_min});return}let r=this.value.clamp??gc();this._emit({...this.value,clamp:{dir:i,hh:r.hh,mm:r.mm}})}_onClampTimeChange(e){if(this.value.kind!=="sun"||!this.value.clamp)return;let i=e.target.value,[r,s]=i.split(":").map(o=>parseInt(o,10));Number.isNaN(r)||Number.isNaN(s)||this._emit({...this.value,clamp:{dir:this.value.clamp.dir,hh:r,mm:s}})}_renderTime(e){let i=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return d`<input type="time" .value=${i} @input=${this._onTimeChange} />`}_renderSun(e){let i=_c(e.offset_min,this.hass),r=e.clamp?.dir??"",s=e.clamp?`${String(e.clamp.hh).padStart(2,"0")}:${String(e.clamp.mm).padStart(2,"0")}`:"";return d`
      <div class="sun">
        <div class="row">
          <select @change=${this._onAnchorChange}>
            ${fc.map(o=>d`<option value=${o} ?selected=${o===e.anchor}>${ke(this.hass,o)}</option>`)}
          </select>
          <input
            type="number"
            step="1"
            placeholder=${l(this.hass,"ui.offset_placeholder","Offset")}
            .value=${e.offset_min===0?"":String(e.offset_min)}
            @input=${this._onOffsetChange}
          />
          <span class="offset-hint">${i}</span>
        </div>
        <div class="row">
          <select @change=${this._onClampDirChange}>
            <option value="" ?selected=${r===""}>${l(this.hass,"ui.clamp_none","\u2014")}</option>
            <option value="not_before" ?selected=${r==="not_before"}>${l(this.hass,"ui.clamp_not_before","not before")}</option>
            <option value="not_after" ?selected=${r==="not_after"}>${l(this.hass,"ui.clamp_not_after","not after")}</option>
          </select>
          ${e.clamp?d`<input type="time" .value=${s} @input=${this._onClampTimeChange} />`:""}
        </div>
      </div>
    `}render(){return d`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>${l(this.hass,"ui.endpoint_time","Time")}</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>${l(this.hass,"ui.endpoint_sun","Sun")}</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};Je.styles=y`
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
  `,u([m({attribute:!1})],Je.prototype,"hass",2),u([m({attribute:!1})],Je.prototype,"value",2),Je=u([w("ambience-time-endpoint")],Je);function gc(){let t=new Date;return{hh:t.getHours(),mm:t.getMinutes()}}function _c(t,n){if(t===0)return"";let e=Math.abs(t),i=t<0?"\u2212":"+";if(e%60===0){let r=e/60,s=r===1?l(n,"ui.unit_hour","hour"):l(n,"ui.unit_hours","hours");return`${i}${r} ${s}`}return`${i}${e} ${l(n,"ui.unit_min","min")}`}function Yi(t,n){if(!t)return[];let e=Object.keys(t.builtins??{}),i=n?e.slice().sort(n):e,r=new Set(t.hidden??[]),s=Object.keys(t.custom??{}).filter(o=>!(o in(t.builtins??{})));return[...i.filter(o=>!r.has(o)),...s]}var he=class extends b{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._error=""}static{this.styles=y`
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
  `}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){try{this._view=await this._list(),this._error=""}catch(e){this._error=C(this.hass,e)}}async _saveState(e){try{await this._save(e,this._view.hidden),this._error=""}catch(i){return this._error=C(this.hass,i),!1}return await this._reload(),!0}_onEdit(e,i){this._modal={mode:"edit",id:e,initial:i}}async _onDelete(e){let i={...this._view.custom};delete i[e],await this._saveState(i)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:i,definition:r}=e.detail;await this._saveState({...this._view.custom,[i]:r})&&(this._modal={mode:"closed"})}_onModalCancel(){this._modal={mode:"closed"}}_takenIds(){return new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}_renderBuiltinRow(e,i,r){return d`
      <div class="row ${r?"overridden":""}">
        <span class="name">${this._label(e,{})}</span>
        <span class="def">${this._formatDef(i)}</span>
        <span class="badge">${l(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${r?"":d`<button class="icon" title=${l(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(e,i)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(e,i){return d`
      <div class="row custom">
        <span class="name">${this._label(e,this._view.custom)}</span>
        <span class="def">${this._formatDef(i)}</span>
        <span class="badge">${l(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${l(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e,i)}>✎</button>
          <button class="icon" title=${l(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e)}>✕</button>
        </span>
      </div>
    `}render(){let e=this._view.custom,[i,r]=this._headingKey(),[s,o]=this._addKey();return d`
      <header>
        <h2>${l(this.hass,i,r)}</h2>
      </header>
      ${this._error?d`<p class="error">${this._error}</p>`:""}
      ${Object.entries(this._view.builtins).map(([a,c])=>{let h=e[a];return d`
          ${this._renderBuiltinRow(a,c,h!=null)}
          ${h!=null?this._renderCustomRow(a,h):""}
        `})}
      ${Object.entries(e).filter(([a])=>!(a in this._view.builtins)).map(([a,c])=>this._renderCustomRow(a,c))}
      <button class="add" @click=${this._onAdd}>${l(this.hass,s,o)}</button>
      ${this._renderModal()}
    `}};u([m({attribute:!1})],he.prototype,"hass",2),u([g()],he.prototype,"_view",2),u([g()],he.prototype,"_modal",2),u([g()],he.prototype,"_error",2);var Qt={kind:"any"},wo={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},xo=["daytime","dawn","morning","afternoon","evening","nighttime"];function vc(t,n){let e=xo.indexOf(t),i=xo.indexOf(n);return e===-1&&i===-1?0:e===-1?1:i===-1?-1:e-i}var pe=class extends b{constructor(){super(...arguments);this.value=null;this._entries=[Qt];this._openIdx=0}willUpdate(e){e.has("value")&&this.value!==this._lastEmitted&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[Qt]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(i=>{let r=this._entries[this._openIdx];if(!r)return;let s=r.kind==="any"?"__any__":r.kind==="range"?"__custom__":r.period;i.value!==s&&(i.value=s)})}_predicateToEntries(e){return e===null?[Qt]:(Array.isArray(e)?e:[e]).map(r=>"period"in r?{kind:"period",period:r.period}:{kind:"range",from:r.from,to:r.to})}_emit(e){let i=e.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),r=i.length===0?null:i.length===1?i[0]:i;this._lastEmitted=r,this.value=r,T(this,r)}_effectiveIds(){return Yi(this.periods,vc)}_onSelectChange(e,i){let r=i.target.value,s=[...this._entries];r==="__any__"?s[e]=Qt:r==="__custom__"?s[e]={kind:"range",...wo}:s[e]={kind:"period",period:r},this._entries=s,this._emit(s)}_onRangeChange(e,i,r){r.stopPropagation();let s=this._entries[e];if(s?.kind!=="range")return;let o=[...this._entries];o[e]={...s,[i]:r.detail.value},this._entries=o,this._emit(o)}_onRemove(e){let i=this._entries.filter((r,s)=>s!==e);this._entries=i.length===0?[Qt]:i,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...wo}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,i){let r;return e.kind==="any"?r=l(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?r=zi({period:e.period},{hass:this.hass,periods:this.periods}):r=zi({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),d`
      <div class="summary-chip" @click=${()=>this._onChipClick(i)}>
        <span class="chip-label">${r}</span>
        ${this._entries.length>1?d`<button class="remove" @click=${s=>{s.stopPropagation(),this._onRemove(i)}} title=${l(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,i,r){let s=this._effectiveIds(),o=this.periods?.custom??{};return d`
      <div class="entry">
        <div class="entry-header">
          <select @change=${a=>this._onSelectChange(i,a)}>
            ${r?d`<option value="__any__">${l(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${l(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${s.map(a=>d`<option value=${a}>
                ${Ee(this.hass,a,o)}${o[a]&&!this.periods?.builtins[a]?l(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?d`<button class="remove" @click=${()=>this._onRemove(i)} title=${l(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${e.kind==="range"?d`
              <div class="range-row">
                <label>${l(this.hass,"ui.from_label","From")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.from}
                  @value-changed=${a=>this._onRangeChange(i,"from",a)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${l(this.hass,"ui.to_label","To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${a=>this._onRangeChange(i,"to",a)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(r=>r.kind!=="any"),i=this._entries.length>1;return d`
      ${this._entries.map((r,s)=>i&&s!==this._openIdx?this._renderChip(r,s):this._renderEntry(r,s,s===0))}
      ${e?d`<button class="add-btn" @click=${this._onAdd}>${l(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};pe.styles=y`
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
  `,u([m({attribute:!1})],pe.prototype,"value",2),u([m({attribute:!1})],pe.prototype,"periods",2),u([m({attribute:!1})],pe.prototype,"hass",2),u([g()],pe.prototype,"_entries",2),u([g()],pe.prototype,"_openIdx",2),pe=u([w("ambience-time-of-day-input")],pe);function Xe(t,n,e,i,r,s){return customElements.get("ha-form")?d`<ha-form
      class=${n}
      .hass=${t}
      .schema=${[{name:e,required:!0,selector:{select:{mode:"dropdown",options:r}}}]}
      .data=${{[e]:i}}
      .computeLabel=${()=>""}
      @value-changed=${a=>{a.stopPropagation();let c=a.detail.value[e];c&&s(c)}}
    ></ha-form>`:d`<select
    class=${n}
    @change=${o=>s(o.target.value)}
  >
    ${r.map(o=>d`<option value=${o.value} ?selected=${o.value===i}>${o.label}</option>`)}
  </select>`}function xt(t,n,e,i,r){return customElements.get("ha-form")?d`<ha-form
      class="field"
      data-field="sensors"
      .hass=${t}
      .schema=${n}
      .data=${{sensors:e}}
      .computeLabel=${()=>""}
      @value-changed=${s=>{s.stopPropagation(),r(s.detail.value.sensors??[])}}
    ></ha-form>`:d`<input
    class="field"
    data-field="sensors"
    type="text"
    placeholder=${i}
    .value=${e.join(", ")}
    @change=${s=>r(s.target.value.split(",").map(o=>o.trim()).filter(o=>o!==""))}
  />`}function Jt(t,n,e,i,r,s){return customElements.get("ha-form")?d`<ha-form
      .hass=${t}
      .schema=${[{name:n,selector:i}]}
      .data=${{[n]:e??""}}
      .computeLabel=${()=>""}
      @value-changed=${a=>{a.stopPropagation(),s(a.detail.value[n]||null)}}
    ></ha-form>`:d`<input
    type="text"
    placeholder=${r}
    .value=${e??""}
    @change=${o=>s(o.target.value||null)}
  />`}var Br="__custom__";function $o(t,n){if(t==null||typeof t!="object")return null;let e=t;if(typeof e.range=="string")return null;let{min:i,max:r}=e;return typeof i=="number"&&i<0||typeof r=="number"&&r<0?l(n,"ui.lux_error_negative","Bounds must be 0 or greater."):typeof i=="number"&&typeof r=="number"&&i>=r?l(n,"ui.lux_error_order","Min must be less than max."):null}var Ae=class extends b{constructor(){super(...arguments);this.value=null}_cur(){return this.value??{sensors:[],range:this._defaultRangeId()}}_sensors(){return this._cur().sensors??[]}_showQuant(){return this._sensors().length>1}_effectiveRangeIds(){return Yi(this.luxRanges)}_defaultRangeId(){return this._effectiveRangeIds()[0]??"dark"}_isCustom(e){return e.range==null}_build(e){let i={...this._cur(),...e},r={sensors:i.sensors??[]};return this._isCustom(i)?(i.min!=null&&(r.min=i.min),i.max!=null&&(r.max=i.max)):r.range=i.range??this._defaultRangeId(),i.quant==="all"&&(r.quant="all"),r}_emit(e){this.value=e,T(this,e)}_setSensors(e){this._emit(this._build({sensors:e}))}_setQuant(e){this._emit(this._build({quant:e}))}_setBand(e){if(e===Br){let i=this._cur();this._emit(this._build({range:void 0,min:i.min??0,max:i.max}))}else this._emit(this._build({range:e,min:void 0,max:void 0}))}_setMin(e){this._emit(this._build({min:e}))}_setMax(e){this._emit(this._build({max:e}))}_sensorSchema(){return[{name:"sensors",selector:{entity:{domain:"sensor",device_class:["illuminance"],multiple:!0}}}]}_renderSensors(){return xt(this.hass,this._sensorSchema(),this._sensors(),"sensor.a, sensor.b",e=>this._setSensors(e))}_renderBand(e){let i=this._isCustom(e),r=[...this._effectiveRangeIds().map(a=>({value:a,label:lt(this.hass,a,this.luxRanges?.custom??{})})),{value:Br,label:l(this.hass,"ui.custom_range","Custom range")}],s=Xe(this.hass,"band","band",i?Br:e.range??this._defaultRangeId(),r,a=>this._setBand(a));if(!i)return s;let o=a=>a==null?"":String(a);return d`${s}
      <span class="band-row" data-field="band-custom">
        <input
          type="number" min="0" step="1" data-field="min"
          placeholder=${l(this.hass,"ui.lux_min_placeholder","0")}
          .value=${o(e.min)}
          @change=${a=>{let c=a.target.value;this._setMin(c===""?void 0:Number(c))}}
        />
        <span>–</span>
        <input
          type="number" min="0" step="1" data-field="max"
          placeholder=${l(this.hass,"ui.lux_max_placeholder","\u221E")}
          .value=${o(e.max)}
          @change=${a=>{let c=a.target.value;this._setMax(c===""?void 0:Number(c))}}
        />
        <span class="label">lx</span>
      </span>`}_renderQuant(e){return Xe(this.hass,"quant","quant",e,[{value:"any",label:l(this.hass,"ui.lux_any","Any of")},{value:"all",label:l(this.hass,"ui.lux_all","All of")}],i=>this._setQuant(i))}render(){let e=this._cur(),i=e.quant==="all"?"all":"any";return d`
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._showQuant()?this._renderQuant(i):""}
        ${this._renderBand(e)}
      </div>
    `}};Ae.styles=y`
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
  `,u([m({attribute:!1})],Ae.prototype,"hass",2),u([m({attribute:!1})],Ae.prototype,"value",2),u([m({attribute:!1})],Ae.prototype,"luxRanges",2),Ae=u([w("ambience-lux-input")],Ae);function Vr(t){if(typeof t!="string")return!1;let n=t.split(",").map(e=>e.trim()).filter(e=>e!=="");if(n.length===0)return!1;for(let e of n)if(e.includes("-")){let i=e.split("-").map(o=>o.trim());if(i.length!==2||!/^\d+$/.test(i[0])||!/^\d+$/.test(i[1]))return!1;let r=Number(i[0]),s=Number(i[1]);if(!(r>=1&&r<=s&&s<=31))return!1}else{if(!/^\d+$/.test(e))return!1;let i=Number(e);if(!(i>=1&&i<=31))return!1}return!0}var qr=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],yc=new Set(["workday","holiday"]),bc=new Set(["first_workday","last_workday"]),wc=[31,29,31,30,31,30,31,31,30,31,30,31];function Xt(t){return wc[t-1]??31}function Kr(t){switch(t){case"weekday":return{kind:t,days:[]};case"day_of_month":return{kind:t,days:""};case"date":return{kind:t,month:1,day:1};case"date_range":return{kind:t,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:t}}}function ko(t,n){if(t==null||typeof t!="object")return null;let e=t;for(let i of[e.include,e.exclude])if(Array.isArray(i))for(let r of i){let s=r;if(s?.kind==="weekday"&&(!Array.isArray(s.days)||s.days.length===0))return l(n,"ui.day_pick_weekday","Pick at least one day of the week.");if(s?.kind==="day_of_month"&&(typeof s.days!="string"||!Vr(s.days)))return l(n,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}return null}var De=class extends b{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?l(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return l(this.hass,"ui.field_kind","Kind");case"days":return l(this.hass,"ui.field_days_of_month","Days of month");case"month":return l(this.hass,"ui.field_month","Month");case"day":return l(this.hass,"ui.field_day","Day");case"from_month":return l(this.hass,"ui.field_from_month","From month");case"from_day":return l(this.hass,"ui.field_from_day","From day");case"to_month":return l(this.hass,"ui.field_to_month","To month");case"to_day":return l(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let i=e.include.length===0&&e.exclude.length===0;this.value=i?null:e,T(this,this.value)}_addItem(e,i){let r=this._current();r[e]=[...r[e],Kr(i)],this._emit(r)}_removeItem(e,i){let r=this._current();r[e]=r[e].filter((s,o)=>o!==i),this._emit(r)}_updateItem(e,i,r){let s=this._current();s[e]=s[e].map((o,a)=>a===i?r:o),this._emit(s)}_kindDisabled(e){return!!(yc.has(e)&&!this.dayConfig.workday_sensor||bc.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:qr.map(e=>({value:e,label:gi(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:dt(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:Xt(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,i){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(i.days??"")}:e}_setDatePart(e,i,r){let s=Number(r);if(!Number.isFinite(s)||s<1)return e;if(i.endsWith("month")&&(s=Math.min(s,12)),e.kind==="date"){let{month:o,day:a}=e;return i==="month"&&(o=s),i==="day"&&(a=s),{kind:"date",month:o,day:Math.min(a,Xt(o))}}if(e.kind==="date_range"){let o={...e.from},a={...e.to};return i==="from_month"&&(o.month=s),i==="from_day"&&(o.day=s),i==="to_month"&&(a.month=s),i==="to_day"&&(a.day=s),o.day=Math.min(o.day,Xt(o.month)),a.day=Math.min(a.day,Xt(a.month)),{kind:"date_range",from:o,to:a}}return e}_onKindForm(e,i,r){let s=r.kind;if(!s){this._removeItem(e,i);return}if(this._kindDisabled(s))return;let o=this._current()[e][i];o&&o.kind===s||this._updateItem(e,i,Kr(s))}_dayOfMonthError(e){return e.trim()===""||Vr(e)?null:l(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(e,i,r,s){this._updateItem(e,i,this._bodyPatch(r,s))}_renderWeekday(e,i,r){return d`${[0,1,2,3,4,5,6].map(s=>d`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${r.days.includes(s)}
          @change=${o=>{let c=o.target.checked?[...r.days,s].sort((h,p)=>h-p):r.days.filter(h=>h!==s);this._updateItem(e,i,{kind:"weekday",days:c})}}
        />${fi(this.hass,s)}
      </label>
    `)}`}_renderKindPicker(e,i,r){return customElements.get("ha-form")?d`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:r.kind}}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${s=>{s.stopPropagation(),this._onKindForm(e,i,s.detail.value)}}
      ></ha-form>`:d`
      <select
        class="kind"
        @change=${s=>{let o=s.target.value;this._kindDisabled(o)||o===r.kind||this._updateItem(e,i,Kr(o))}}
      >
        ${qr.map(s=>d`<option value=${s} ?selected=${s===r.kind} ?disabled=${this._kindDisabled(s)}>${gi(this.hass,s)}</option>`)}
      </select>
    `}_renderItemBody(e,i,r){if(r.kind==="weekday")return this._renderWeekday(e,i,r);if(customElements.get("ha-form")){if(r.kind==="date")return this._renderDateRow(e,i,r,"month","day",r.month,r.day);if(r.kind==="date_range")return d`
          ${this._renderDateRow(e,i,r,"from_month","from_day",r.from.month,r.from.day)}
          ${this._renderDateRow(e,i,r,"to_month","to_day",r.to.month,r.to.day)}
        `;let s=this._bodySchema(r);if(!s)return d``;let o=r.kind==="day_of_month"?this._dayOfMonthError(r.days):null;return d`<ha-form
        .hass=${this.hass}
        .schema=${s}
        .data=${this._bodyData(r)}
        .error=${o?{days:o}:void 0}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${a=>{a.stopPropagation(),this._onBodyForm(e,i,r,a.detail.value)}}
      ></ha-form>`}return this._renderNativeBody(e,i,r)}_renderDateRow(e,i,r,s,o,a,c){let h=(p,f)=>{this._updateItem(e,i,this._setDatePart(r,p,f[p]))};return d`
      <div class="date-row">
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:s,required:!0,selector:this._monthSelector()}]}
          .data=${{[s]:String(a)}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${p=>{p.stopPropagation(),h(s,p.detail.value)}}
        ></ha-form>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:o,required:!0,selector:this._daySelector(a)}]}
          .data=${{[o]:c}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${p=>{p.stopPropagation(),h(o,p.detail.value)}}
        ></ha-form>
      </div>
    `}_renderNativeBody(e,i,r){if(r.kind==="day_of_month"){let a=this._dayOfMonthError(r.days);return d`<input
        type="text" placeholder=${l(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${r.days}
        @change=${c=>this._updateItem(e,i,this._bodyPatch(r,{days:c.target.value}))}
      />${a?d`<div class="field-error">${a}</div>`:""}`}let s=(a,c)=>d`
      <input type="number" min="1" max="12" .value=${String(c)}
        @change=${h=>this._updateItem(e,i,this._setDatePart(r,a,h.target.value))} />
    `,o=(a,c,h)=>d`
      <input type="number" min="1" max=${String(Xt(c))} .value=${String(h)}
        @change=${p=>this._updateItem(e,i,this._setDatePart(r,a,p.target.value))} />
    `;return r.kind==="date"?d`${s("month",r.month)} / ${o("day",r.month,r.day)}`:r.kind==="date_range"?d`
        <span>${l(this.hass,"ui.from","from")}</span>
        ${s("from_month",r.from.month)} / ${o("from_day",r.from.month,r.from.day)}
        <span>${l(this.hass,"ui.to","to")}</span>
        ${s("to_month",r.to.month)} / ${o("to_day",r.to.month,r.to.day)}
      `:d``}_renderAddPicker(e){let i=e==="include"?l(this.hass,"ui.add_include_item","+ Add include item"):l(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let r=()=>i;return d`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${r}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.kind;o&&!this._kindDisabled(o)&&this._addItem(e,o)}}
      ></ha-form>`}return d`
      <select
        .value=${""}
        @change=${r=>{let s=r.target.value;s&&(this._addItem(e,s),r.target.value="")}}
      >
        <option value="">${i}</option>
        ${qr.map(r=>d`<option value=${r} ?disabled=${this._kindDisabled(r)}>${gi(this.hass,r)}</option>`)}
      </select>
    `}_renderItem(e,i,r){return d`
      <div class="item">
        ${this._renderKindPicker(e,i,r)}
        <div class="body">${this._renderItemBody(e,i,r)}</div>
        <button class="remove" title=${l(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(e,i)}>✕</button>
      </div>
    `}_renderSection(e,i){return d`
      <div class="section">
        <h4>${e==="include"?l(this.hass,"ui.include","Include"):l(this.hass,"ui.exclude","Exclude")}</h4>
        ${i.length===0&&e==="include"?d`<div class="hint">${l(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${i.map((r,s)=>this._renderItem(e,s,r))}
        ${this._renderAddPicker(e)}
      </div>
    `}render(){let{include:e,exclude:i}=this._current();return d`
      ${this._renderSection("include",e)}
      ${this._renderSection("exclude",i)}
    `}};De.styles=y`
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
  `,u([m({attribute:!1})],De.prototype,"hass",2),u([m({attribute:!1})],De.prototype,"value",2),u([m({attribute:!1})],De.prototype,"dayConfig",2),De=u([w("ambience-day-predicate-input")],De);var Eo=["temperature","apparent_temperature","humidity","wind_speed","pressure"],Co=["<","<=",">",">="],So={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},xe=class extends b{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(e){let i=e.groups.length===0&&e.thresholds.length===0;this.value=i?null:e,T(this,this.value)}_setGroups(e){this._emit({...this._current(),groups:e})}_addThreshold(){let e=this._current();e.thresholds=[...e.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(e)}_updateThreshold(e,i){let r=this._current();r.thresholds=r.thresholds.map((s,o)=>o===e?i:s),this._emit(r)}_removeThreshold(e){let i=this._current();i.thresholds=i.thresholds.filter((r,s)=>s!==e),this._emit(i)}_attributeSchema(e){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:Eo.map(i=>({value:i,label:At(this.hass,i)}))}}}]}_opSchema(e){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:Co.map(i=>({value:i,label:So[i]}))}}}]}_entityState(){let e=this.weatherEntity;return e?this.hass?.states?.[e]:void 0}_valueSchema(e,i){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:gr(this.hass,i,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(e=>({value:e.id,label:e.label}))}}}]}_renderGroups(e){return customElements.get("ha-form")?d`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{groups:e}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),this._setGroups(i.detail.value.groups??[])}}
      ></ha-form>`:d`${this.groups.map(i=>d`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${e.includes(i.id)}
          @change=${r=>{let s=r.target.checked;this._setGroups(s?[...e,i.id]:e.filter(o=>o!==i.id))}} />${i.label}
      </label>`)}`}_renderAttributeSelect(e,i){return customElements.get("ha-form")?d`<ha-form
        class="attr-form"
        .hass=${this.hass}
        .schema=${this._attributeSchema(e)}
        .data=${{attribute:i.attribute}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation();let s=r.detail.value.attribute;s&&this._updateThreshold(e,{...i,attribute:s})}}
      ></ha-form>`:d`<select
      @change=${r=>this._updateThreshold(e,{...i,attribute:r.target.value})}>
      ${Eo.map(r=>d`<option value=${r} ?selected=${r===i.attribute}>${At(this.hass,r)}</option>`)}
    </select>`}_renderOpSelect(e,i){return customElements.get("ha-form")?d`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(e)}
        .data=${{op:i.op}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation();let s=r.detail.value.op;s&&this._updateThreshold(e,{...i,op:s})}}
      ></ha-form>`:d`<select
      @change=${r=>this._updateThreshold(e,{...i,op:r.target.value})}>
      ${Co.map(r=>d`<option value=${r} ?selected=${r===i.op}>${So[r]}</option>`)}
    </select>`}_renderValueInput(e,i){if(customElements.get("ha-form"))return d`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(e,i.attribute)}
        .data=${{value:i.value}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.value;typeof o=="number"&&Number.isFinite(o)&&this._updateThreshold(e,{...i,value:o})}}
      ></ha-form>`;let r=gr(this.hass,i.attribute,this._entityState());return d`<span class="value-wrap">
      <input type="number" .value=${String(i.value)}
        @change=${s=>{let o=Number(s.target.value);Number.isFinite(o)&&this._updateThreshold(e,{...i,value:o})}} />
      <span class="unit">${r}</span>
    </span>`}_renderThreshold(e,i){return d`
      <div class="threshold">
        ${this._renderAttributeSelect(e,i)}
        ${this._renderOpSelect(e,i)}
        ${this._renderValueInput(e,i)}
        <button class="remove" title=${l(this.hass,"ui.remove","Remove")} @click=${()=>this._removeThreshold(e)}>✕</button>
      </div>
    `}render(){let{groups:e,thresholds:i}=this._current();return d`
      <div class="section">
        <h4>${l(this.hass,"ui.groups","Groups")}</h4>
        ${this._renderGroups(e)}
      </div>
      <div class="section">
        <h4>${l(this.hass,"ui.thresholds","Thresholds")}</h4>
        ${i.map((r,s)=>this._renderThreshold(s,r))}
        <button class="add" @click=${()=>this._addThreshold()}>${l(this.hass,"ui.add_threshold","+ Add threshold")}</button>
      </div>
    `}};xe.styles=y`
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
  `,u([m({attribute:!1})],xe.prototype,"hass",2),u([m({attribute:!1})],xe.prototype,"value",2),u([m({attribute:!1})],xe.prototype,"groups",2),u([m({attribute:!1})],xe.prototype,"weatherEntity",2),xe=u([w("ambience-weather-predicate-input")],xe);var xc=["NW","N","NE","W",null,"E","SW","S","SE"],Ze=class extends b{constructor(){super(...arguments);this.value=null}_current(){let e=this.value?.azimuth?.ranges??[];return{elevation:this.value?.elevation??null,sectors:[...this.value?.azimuth?.sectors??[]],range:e.length?{...e[0]}:null}}_emit(e){let i={};e.elevation&&(e.elevation.min!=null||e.elevation.max!=null)&&(i.elevation=e.elevation);let r={};e.sectors.length&&(r.sectors=e.sectors),e.range&&(r.ranges=[e.range]),(r.sectors||r.ranges)&&(i.azimuth=r),this.value=i.elevation||i.azimuth?i:null,T(this,this.value)}_setElevation(e){this._emit({...this._current(),elevation:e})}_setSectors(e){this._emit({...this._current(),sectors:e})}_setRange(e){this._emit({...this._current(),range:e})}_mode(e){return!e||e.min==null&&e.max==null?"any":e.min!=null&&e.max!=null?"between":e.min!=null?"above":"below"}_onModeChange(e,i){let r=i?.min??0,s=i?.max??0;e==="any"?this._setElevation(null):e==="above"?this._setElevation({min:r}):e==="below"?this._setElevation({max:s}):this._setElevation({min:r,max:s})}_toggleSector(e,i,r){this._setSectors(r?[...e,i]:e.filter(s=>s!==i))}_renderSectors(e){return d`<div class="sectors">${xc.map(i=>i===null?d`<span class="spacer"></span>`:d`<label>
            <input type="checkbox" .checked=${e.includes(i)}
              @change=${r=>this._toggleSector(e,i,r.target.checked)} />${i}
          </label>`)}</div>`}_renderElevation(e){let i=this._mode(e),r=["any","above","below","between"],s={any:l(this.hass,"ui.sun.any","Any"),above:l(this.hass,"ui.sun.above","Above"),below:l(this.hass,"ui.sun.below","Below"),between:l(this.hass,"ui.sun.between","Between")};return d`
      <div class="row">
        <select @change=${o=>this._onModeChange(o.target.value,e)}>
          ${r.map(o=>d`<option value=${o} ?selected=${o===i}>${s[o]}</option>`)}
        </select>
        ${i==="above"||i==="between"?d`<input type="number" class="min" .value=${String(e?.min??0)}
              @change=${o=>this._setElevation({...i==="between"?{max:e?.max??0}:{},min:Number(o.target.value)})} /><span class="deg">°</span>`:""}
        ${i==="below"||i==="between"?d`<input type="number" class="max" .value=${String(e?.max??0)}
              @change=${o=>this._setElevation({...i==="between"?{min:e?.min??0}:{},max:Number(o.target.value)})} /><span class="deg">°</span>`:""}
      </div>
    `}_renderCustomRange(e){return d`
      <label class="custom-range">
        <input type="checkbox" class="custom-range-toggle" .checked=${e!==null}
          @change=${i=>this._setRange(i.target.checked?{from:0,to:0}:null)} />
        ${l(this.hass,"ui.sun.custom_range","Custom range")}
      </label>
      ${e===null?"":d`<div class="row range-row">
            <input type="number" class="from" .value=${String(e.from)}
              @change=${i=>this._setRange({...e,from:Number(i.target.value)})} />
            <span class="deg">°–</span>
            <input type="number" class="to" .value=${String(e.to)}
              @change=${i=>this._setRange({...e,to:Number(i.target.value)})} />
            <span class="deg">°</span>
          </div>`}
    `}render(){let{elevation:e,sectors:i,range:r}=this._current();return d`
      <div class="section">
        <h4>${l(this.hass,"ui.sun.elevation","Elevation")}</h4>
        ${this._renderElevation(e)}
      </div>
      <div class="section">
        <h4>${l(this.hass,"ui.sun.azimuth","Azimuth")}</h4>
        ${this._renderSectors(i)}
        ${this._renderCustomRange(r)}
      </div>
    `}};Ze.styles=y`
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
  `,u([m({attribute:!1})],Ze.prototype,"hass",2),u([m({attribute:!1})],Ze.prototype,"value",2),Ze=u([w("ambience-sun-predicate-input")],Ze);function $t(t){return t?.states??{}}function Gr(t,n){let e=`${n}.`;return Object.keys($t(t)).filter(i=>i.startsWith(e)).sort().map(i=>({id:i,name:j(t,i)}))}var U=class extends b{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[];this._knownAttributeValues=[];this._entitySeq=0}async updated(e){if(!e.has("value"))return;let i=e.get("value"),{entity_id:r,attribute:s}=this.value;if(r&&r!==i?.entity_id&&this.hass)try{let o=(await vr(this.hass,r)).states;this.value.entity_id===r&&(this._knownStates=o)}catch{this.value.entity_id===r&&(this._knownStates=[])}if(r!==i?.entity_id||s!==i?.attribute)if(r&&s&&this.hass)try{let o=(await yr(this.hass,r,s)).values;this.value.entity_id===r&&this.value.attribute===s&&(this._knownAttributeValues=o)}catch{this.value.entity_id===r&&this.value.attribute===s&&(this._knownAttributeValues=[])}else this._knownAttributeValues.length&&(this._knownAttributeValues=[])}_normalize(e){let i={...e};return i.attribute===""&&(i.attribute=null),i.for&&i.for.h===0&&i.for.m===0&&i.for.s===0&&(i.for=null),gt(i.for,i.for_mode)||delete i.for_mode,i}_emit(e){let i=this._normalize(e);this.value=i,T(this,i)}_autoFlipOp(e){let i=this._isNumericTargetFor(e),r=this._isNumericOp(e.kind);return!i&&r?{...e,kind:"is"}:i&&!r&&!this._isNumericTargetFor(this.value)?{...e,kind:">"}:e}async _setEntity(e){let i=++this._entitySeq,r=this._entityHasAttribute(e,this.value.attribute)?this.value.attribute:null,s=await this._supportedValues(e,r,this.value.states);i===this._entitySeq&&this._emit(this._autoFlipOp({...this.value,entity_id:e,attribute:r,states:s}))}_entityHasAttribute(e,i){return i?this._knownAttributesFor(e).includes(i):!1}async _supportedValues(e,i,r){if(!e||r.length===0||!this.hass)return[];try{let s=new Set(i?(await yr(this.hass,e,i)).values:(await vr(this.hass,e)).states);return r.filter(o=>s.has(o))}catch{return[]}}_setAttribute(e){this._emit(this._autoFlipOp({...this.value,attribute:e}))}_setOp(e){let i=this._isNumericOp(e)===this._isNumericOp(this.value.kind)?this.value.states:[];this._emit({...this.value,kind:e,states:i})}_setStates(e){this._emit({...this.value,states:e})}_setValueAt(e,i){if(this._isNumericOp(this.value.kind)){this._setStates([i]);return}let r=this.value.states.slice();i===""?r.splice(e,1):r[e]=i,this._setStates(r)}_addValue(e){e&&this._setStates([...this.value.states,e])}_removeValueAt(e){let i=this.value.states.slice();i.splice(e,1),this._setStates(i)}_setForDuration(e){if(e===null){this._emit({...this.value,for:null,for_mode:null});return}let{mode:i,...r}=e;this._emit({...this.value,for:r,for_mode:i})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(e){if(!e)return[];let i=$t(this.hass)[e]?.attributes;return i?Object.keys(i).sort():[]}_attrLabelMaps(){let e=this._knownAttributesFor(this.value.entity_id),r=`${this.hass?.language??""}|${this.value.entity_id}|${e.join(",")}`;if(this._attrMapsCache?.key===r)return this._attrMapsCache.maps;let s=$t(this.hass)[this.value.entity_id],o=new Map,a=new Map;for(let h of e){let p=pi(this.hass,s,h);o.set(h,p),a.set(p,h)}let c={keyToLabel:o,labelToKey:a};return this._attrMapsCache={key:r,maps:c},c}_attributeSchema(){let{keyToLabel:e}=this._attrLabelMaps();return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:U._STATE_SENTINEL,label:l(this.hass,"ui.state_sentinel","State")},...[...e.values()].map(i=>({value:i,label:i}))]}}}]}_attributeData(){let e=this.value.attribute;if(!e)return{attribute:U._STATE_SENTINEL};let{keyToLabel:i}=this._attrLabelMaps();return{attribute:i.get(e)??e}}_setAttributeFromHaForm(e){if(e===U._STATE_SENTINEL){this._setAttribute("");return}let{labelToKey:i}=this._attrLabelMaps();this._setAttribute(i.get(e)??e)}_isNumericOp(e){return U._NUMERIC_OPS.includes(e)}_isNumericTargetFor(e){let i=$t(this.hass)[e.entity_id];if(!i)return!1;if(e.attribute)return typeof i.attributes?.[e.attribute]=="number";let r=i.state;return typeof r!="string"||r===""||r==="unknown"||r==="unavailable"?!1:Number.isFinite(Number(r))}_opSchema(){let e=this._isNumericTargetFor(this.value)?[...U._NUMERIC_OPS,"is","is_not"]:["is","is_not"];return e.includes(this.value.kind)||e.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:e.map(i=>({value:i,label:ie(this.hass,i)}))}}}]}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let{rawToLabel:e}=this._valueLabelMaps();return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:[...e.values()].map(i=>({value:i,label:i}))}}}]}_rawValueOptions(){return this.value.attribute?this._knownAttributeValues:this._knownStates}_valueLabelMaps(){let e=this.value.attribute,i=this._rawValueOptions(),s=`${this.hass?.language??""}|${this.value.entity_id}|${e??""}|${i.join(",")}`;if(this._valueMapsCache?.key===s)return this._valueMapsCache.maps;let o=$t(this.hass)[this.value.entity_id],a=new Map,c=new Map;for(let p of i){let f=at(this.hass,o,e,p);a.set(p,f),c.set(f,p)}let h={rawToLabel:a,labelToRaw:c};return this._valueMapsCache={key:s,maps:h},h}_valueDisplay(e){return this._valueLabelMaps().rawToLabel.get(e)??e}_labelToRaw(e){return this._valueLabelMaps().labelToRaw.get(e)??e}_setValueFromHaForm(e,i){this._setValueAt(e,this._labelToRaw(i))}_addValueFromHaForm(e){this._addValue(this._labelToRaw(e))}_renderEntity(){return customElements.get("ha-form")?d`<ha-form
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
        @value-changed=${i=>{i.stopPropagation(),this._setAttributeFromHaForm(i.detail.value.attribute??"")}}
      ></ha-form>`:d`<input
      data-field="attribute"
      type="text"
      placeholder=${l(this.hass,"ui.state_attribute_placeholder","leave blank to compare state")}
      .value=${e}
      @change=${i=>this._setAttribute(i.target.value)}
    />`}_renderOp(){return customElements.get("ha-form")?d`<ha-form
        class="op-form"
        data-field="op"
        .hass=${this.hass}
        .schema=${this._opSchema()}
        .data=${{op:this.value.kind}}
        .computeLabel=${()=>""}
        @value-changed=${e=>{e.stopPropagation();let i=e.detail.value.op;i&&this._setOp(i)}}
      ></ha-form>`:d`<select
      data-field="op"
      @change=${e=>this._setOp(e.target.value)}>
      <option value="is" ?selected=${this.value.kind==="is"}>is</option>
      <option value="is_not" ?selected=${this.value.kind==="is_not"}>is not</option>
    </select>`}_renderValueRow(e,i){let r=i===-1,s=r?c=>this._addValue(c):c=>this._setValueAt(i,c),o=this._isNumericOp(this.value.kind),a=o?{value:e===""?void 0:Number(e)}:{value:this._valueDisplay(e)};return customElements.get("ha-form")?d`
        <div class="value-row" data-row=${i}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${a}
            .computeLabel=${()=>""}
            @value-changed=${c=>{c.stopPropagation();let h=c.detail.value.value,p=h==null?"":String(h);o?s(p):r?this._addValueFromHaForm(p):this._setValueFromHaForm(i,p)}}
          ></ha-form>
        </div>
      `:d`
      <div class="value-row" data-row=${i}>
        <input type=${o?"number":"text"} .value=${e}
          placeholder=${r?l(this.hass,"ui.state_add_value","+ Add state"):""}
          @change=${c=>s(c.target.value)} />
      </div>
    `}_renderForRow(){return d`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this.value.for??null}
      .mode=${this.value.for_mode??"at_least"}
      @value-changed=${e=>{e.stopPropagation(),this._setForDuration(e.detail.value)}}
    ></ambience-for-duration>`}render(){return d`
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
          ${this._isNumericOp(this.value.kind)?this._renderValueRow(this.value.states[0]??"",0):d`
                ${this.value.states.map((e,i)=>this._renderValueRow(e,i))}
                ${this._renderValueRow("",-1)}
              `}
        </div>
      </section>
      <section class="field">
        <label class="field-label">${l(this.hass,"ui.state_for","For (optional)")}</label>
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
  `,U._STATE_SENTINEL="State",U._NUMERIC_OPS=[">",">=","<","<="],u([m({attribute:!1})],U.prototype,"hass",2),u([m({attribute:!1})],U.prototype,"value",2),u([g()],U.prototype,"_knownStates",2),u([g()],U.prototype,"_knownAttributeValues",2),U=u([w("ambience-state-expr-atom")],U);function Qi(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,i)=>e===n[i])}var Z=class extends b{constructor(){super(...arguments);this.path=[];this.dragOverPath=null;this.dragOverPos=null;this.dragFromPath=null;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(e,i={}){this.dispatchEvent(new CustomEvent(e,{detail:{path:this.path,...i},bubbles:!0,composed:!0}))}_atomIsComplete(e){return!!e.entity_id&&e.states.some(i=>i!=="")}_isErrorTarget(){return Qi(this.path,this.errorPath)}_isDropTarget(){return Qi(this.path,this.dragOverPath)}_dropPos(){return this._isDropTarget()?this.dragOverPos:null}_isDragging(){return Qi(this.path,this.dragFromPath)}_onDragHandleDown(e){this.path.length!==0&&(!e.isPrimary||e.button>0||(e.stopPropagation(),this.dispatchEvent(new CustomEvent("node-drag-start",{detail:{path:this.path,pointer:e},bubbles:!0,composed:!0}))))}_dragHandle(){return this.path.length===0?"":d`<span
      class="drag-handle"
      title=${l(this.hass,"ui.drag_to_reorder","Drag to reorder")}
      @pointerdown=${this._onDragHandleDown}
      @click=${e=>e.stopPropagation()}
      >⠿</span
    >`}_notToggle(e){return d`<button class="not-toggle ${e?"on":""}"
      title=${l(this.hass,"ui.state_not_toggle","Negate (NOT)")}
      @click=${i=>{i.stopPropagation(),this._emit("node-toggle-not")}}>${ie(this.hass,"not")}</button>`}_renderAtomCard(e,i){let r=this._atomIsComplete(e),s=Qi(this.path,this.openPath),o=r?Pr(e,{hass:this.hass}):l(this.hass,"ui.state_new_condition","(new condition)");return d`
      <div class="atom-card ${s?"expanded":"collapsed"} ${this._dropPos()==="into"?"drag-over":""} ${this._isDragging()?"dragging":""}">
        <div class="atom-header"
          @click=${()=>this._emit("node-open")}>
          ${this._dragHandle()}
          ${this._notToggle(i)}
          <span class="summary ${r?"":"placeholder"}">${o}</span>
          <button class="wrap"
            title=${l(this.hass,"ui.state_wrap","Wrap in group")}
            @click=${a=>{a.stopPropagation(),this._emit("node-wrap")}}>(…)</button>
          <button class="remove"
            title=${l(this.hass,"ui.remove","Remove")}
            @click=${a=>{a.stopPropagation(),this._emit("node-remove")}}>✕</button>
        </div>
        ${s?d`
          <div class="atom-body">
            <ambience-state-expr-atom
              .hass=${this.hass}
              .value=${e}
              @value-changed=${a=>{a.stopPropagation();let c=a.detail.value,h=i?{kind:"not",item:c}:c;this._emit("node-change",{value:h})}}
            ></ambience-state-expr-atom>
            ${this._isErrorTarget()&&this.errorMessage?d`<div class="atom-error">${this.errorMessage}</div>`:""}
          </div>
        `:""}
      </div>
    `}_renderChildRow(e,i){let r=[...this.path,i];return d`
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
    `}_renderGroup(e,i){return d`
      <div class="group ${this._dropPos()==="into"?"drag-over":""} ${this._isDragging()?"dragging":""}">
        <div class="group-header">
          ${this._dragHandle()}
          ${this._notToggle(i)}
          <select class="group-op"
            @change=${r=>this._emit("node-set-op",{op:r.target.value})}>
            <option value="and" ?selected=${e.kind==="and"}>${ie(this.hass,"and")}</option>
            <option value="or"  ?selected=${e.kind==="or"} >${ie(this.hass,"or")}</option>
          </select>
          <button class="unwrap"
            title=${l(this.hass,"ui.state_unwrap_group","Remove these parens (promote children to parent)")}
            @click=${()=>this._emit("node-unwrap")}>✕</button>
        </div>
        <div class="group-children">
          ${e.items.map((r,s)=>this._renderChildRow(r,s))}
        </div>
        <div class="actions">
          <button @click=${()=>this._emit("node-add-child")}>
            + ${l(this.hass,"ui.state_add_condition","Add condition")}
          </button>
        </div>
      </div>
    `}render(){let e=this.value.kind==="not",i=e?this.value.item:this.value,r=i.kind==="and"||i.kind==="or"?this._renderGroup(i,e):this._renderAtomCard(i,e),s=this._dropPos();return d`
      ${s==="before"?d`<div class="drop-line before"></div>`:""}
      ${r}
      ${s==="after"?d`<div class="drop-line after"></div>`:""}
    `}};Z.styles=y`
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
  `,u([m({attribute:!1})],Z.prototype,"hass",2),u([m({attribute:!1})],Z.prototype,"value",2),u([m({attribute:!1})],Z.prototype,"path",2),u([m({attribute:!1})],Z.prototype,"dragOverPath",2),u([m({attribute:!1})],Z.prototype,"dragOverPos",2),u([m({attribute:!1})],Z.prototype,"dragFromPath",2),u([m({attribute:!1})],Z.prototype,"openPath",2),u([m({attribute:!1})],Z.prototype,"errorPath",2),u([m({attribute:!1})],Z.prototype,"errorMessage",2),Z=u([w("ambience-state-expr-node")],Z);function Zt(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,i)=>e===n[i])}function Ji(t){return t&&t.kind==="not"?t.item:t}var $c=new Set(["is","is_not",">",">=","<","<=","and","or","not"]);function To(t,n){if(!t.entity_id)return l(n,"ui.state_err_entity","Entity is required");let e=Array.isArray(t.states)?t.states:[];if(t.kind!=="is"&&t.kind!=="is_not"){let r=e[0];if(typeof r!="string"||!r.trim())return l(n,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(r)))return l(n,"ui.state_err_numeric","Value must be a number")}else if(!e.some(r=>r!==""))return l(n,"ui.state_err_state","State is required");return null}function Xi(t,n){if(!t||typeof t!="object")return null;if(t.kind==="not"){let e=t.item;return e?Xi(e,n):l(n,"ui.state_err_incomplete","This condition is incomplete")}if(t.kind==="and"||t.kind==="or"){let e=t.items;if(!Array.isArray(e)||e.length===0)return l(n,"ui.state_err_incomplete","This condition is incomplete");for(let i of e){let r=Xi(i,n);if(r!==null)return r}return null}return To(t,n)}function Lo(t,n){if(t==null||typeof t!="object")return null;let e=t.kind;return typeof e!="string"||!$c.has(e)?null:Xi(t,n)}var re=class extends b{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._dragFrom=null;this._dragOverPath=null;this._dragOverPos=null;this._cancelDrag=null;this._onNodeDragStart=e=>{e.stopPropagation(),this._startDrag(e.detail.path,e.detail.pointer)};this._onNodeChange=e=>{e.stopPropagation();let{path:i,value:r}=e.detail;if(this._isEmptyAtom(r)){let s=this._atomAt(i);if(s&&!this._isEmptyAtom(s)){this._openPath=null,this._removeAt(i);return}}this._replaceAt(i,r)};this._onNodeRemove=e=>{e.stopPropagation(),this._removeAt(e.detail.path)};this._onNodeWrap=e=>{e.stopPropagation(),this._wrapAt(e.detail.path)};this._onNodeAddChild=e=>{e.stopPropagation(),this._addChildAt(e.detail.path,"is")};this._onNodeToggleNot=e=>{e.stopPropagation(),this._toggleNotAt(e.detail.path)};this._onNodeSetOp=e=>{e.stopPropagation(),this._setGroupOpAt(e.detail.path,e.detail.op)};this._onNodeUnwrap=e=>{e.stopPropagation(),this._unwrapAt(e.detail.path)};this._onNodeOpen=e=>{if(e.stopPropagation(),this._openPath!==null){let i=this._atomAt(this._openPath);if(i&&this._atomError(i)!==null){this._showError=!0;return}}this._openPath!==null&&Zt(this._openPath,e.detail.path)?this._openPath=null:this._openPath=e.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-drag-start",this._onNodeDragStart)}disconnectedCallback(){super.disconnectedCallback(),this._endDrag()}_emit(e){this.value=e,T(this,e)}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(e,i){let r=this._patch(this.value,e,()=>i);this._emit(r)}_removeAt(e){if(this._openPath=null,e.length===0){this._emit(null);return}let i=this._patch(this.value,e,()=>null);this._emit(i)}_wrapAt(e){let i=null;if(e.length>0){let o=this._nodeAt(e.slice(0,-1));o&&(o.kind==="and"||o.kind==="or")&&(i=o.kind)}let r=i==="and"?"or":"and",s=this._patch(this.value,e,o=>o&&{kind:r,items:[o]});this._emit(s)}_nodeAt(e){return this._walkNode(this.value,e)}_moveRelative(e,i){let r=this._resolveInsertion(e,i);r&&this._emit(this._rewriteInsert(this.value,[],e,r.destParent,r.insert,r.source))}_resolveInsertion(e,i){if(e.length===0||Zt(e,i.path))return null;let r=this._nodeAt(e);if(!r)return null;if(i.pos==="into"){let o=Ji(this._nodeAt(i.path));return!o||o.kind!=="and"&&o.kind!=="or"||this._isPrefix(e,i.path)?null:{destParent:i.path,insert:{kind:"into"},source:r}}if(i.path.length===0)return null;let s=i.path.slice(0,-1);return this._isPrefix(e,s)?null:{destParent:s,insert:{kind:i.pos,index:i.path[i.path.length-1]},source:r}}_isPrefix(e,i){return e.length>i.length?!1:e.every((r,s)=>r===i[s])}_rewriteInsert(e,i,r,s,o,a){if(!e)return e;if(e.kind==="not"){let _=this._rewriteInsert(e.item,i,r,s,o,a);return _==null?null:{kind:"not",item:_}}if(e.kind!=="and"&&e.kind!=="or")return e;let c=Zt(i,r.slice(0,-1)),h=Zt(i,s),p=[],f=-1;if(e.items.forEach((_,v)=>{if(c&&v===r[r.length-1])return;let x=this._rewriteInsert(_,[...i,v],r,s,o,a);x!==null&&(p.push(x),h&&o.kind!=="into"&&v===o.index&&(f=p.length-1))}),h){let _=o.kind==="into"||f<0?p.length:o.kind==="before"?f:f+1;p.splice(_,0,a)}return p.length===0?null:{...e,items:p}}_startDrag(e,i){this._endDrag(),this._dragFrom=e,this._dragOverPath=null,this._dragOverPos=null;let r=i.target?.closest(".atom-card, .group");this._cancelDrag=Hi(i,{onMove:(s,o)=>{let a=this._locateDropAt(s,o),c=a!==null&&this._resolveInsertion(e,a)!==null,h=c?a.path:null,p=c?a.pos:null;(!(Zt(h,this._dragOverPath)||h===null&&this._dragOverPath===null)||p!==this._dragOverPos)&&(this._dragOverPath=h,this._dragOverPos=p)},onEnd:(s,o)=>{let a=this._locateDropAt(s,o);a&&this._moveRelative(e,a),this._endDrag()},onCancel:()=>this._endDrag()},{follow:r})}_endDrag(){this._cancelDrag?.(),this._cancelDrag=null,this._dragFrom=null,this._dragOverPath=null,this._dragOverPos=null}_nodeElementAt(e,i){let r=Oi(e,i);for(;r;){if(r instanceof Element&&r.localName==="ambience-state-expr-node")return r;let s=r.parentNode;s?r=s:r instanceof ShadowRoot?r=r.host:r=null}return null}_locateDropAt(e,i){let r=this._nodeElementAt(e,i),s=r?.path;if(!r||!s)return null;let o=this._nodeAt([...s]),a=Ji(o),c=!!a&&(a.kind==="and"||a.kind==="or"),h=this._zoneFor(r.getBoundingClientRect(),i,{isGroup:c,isRoot:s.length===0});return h?{path:[...s],pos:h}:null}_zoneFor(e,i,r){if(r.isRoot)return r.isGroup?"into":null;if(r.isGroup){let s=Math.min(8,e.height/3);return i<e.top+s?"before":i>e.bottom-s?"after":"into"}return i<e.top+e.height/2?"before":"after"}_walkNode(e,i){return e?e.kind==="not"?this._walkNode(e.item,i):i.length===0?e:e.kind==="and"||e.kind==="or"?this._walkNode(e.items[i[0]]??null,i.slice(1)):null:null}_addChildAt(e,i){let r=null,s=this._patch(this.value,e,o=>{if(o&&(o.kind==="and"||o.kind==="or")){let a=[...o.items,this._emptyAtom()];return r=[...e,a.length-1],{...o,items:a}}return o});r!==null&&(this._openPath=r),this._emit(s)}_toggleNotAt(e){let i=this._patch(this.value,e,r=>r&&(r.kind==="not"?r.item:{kind:"not",item:r}));this._emit(i)}_setGroupOpAt(e,i){let r=this._patch(this.value,e,s=>{if(!s)return s;let o=null;if(s.kind==="and"||s.kind==="or")o=s;else if(s.kind==="not"){let a=s.item;(a.kind==="and"||a.kind==="or")&&(o=a)}return o?{kind:i,items:o.items}:s});this._emit(r)}_patch(e,i,r){if(i.length===0)return r(e);if(e==null)return e;let[s,...o]=i;if(e.kind==="and"||e.kind==="or"){let a=e.items.length,c=e.items.slice(),h=this._patch(c[s],o,r);if(h===null?c.splice(s,1):c[s]=h,c.length<a){if(c.length===0)return null;if(c.length===1)return c[0]}return{...e,items:c}}if(e.kind==="not"){let a=this._patch(e.item,i,r);return a==null?null:{kind:"not",item:a}}return e}_isEmptyAtom(e){if(e.kind==="not")return this._isEmptyAtom(e.item);if(e.kind==="and"||e.kind==="or")return!1;let i=e;return!i.entity_id&&i.states.every(r=>r==="")&&!i.attribute&&!i.for}_atomAt(e){return this._walk(this.value,e)}_walk(e,i){return e?e.kind==="not"?this._walk(e.item,i):i.length===0?e.kind==="and"||e.kind==="or"?null:e:e.kind==="and"||e.kind==="or"?this._walk(e.items[i[0]]??null,i.slice(1)):null:null}_treeError(e=this.value){return Xi(e,this.hass)}_emitValidity(){let e=this._treeError();this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_atomError(e){return To(e,this.hass)}_unwrapAt(e){if(this._openPath=null,e.length===0){let o=this.value;if(!o)return;let a=Ji(o);(a.kind==="and"||a.kind==="or")&&(a.items.length===1?this._emit(a.items[0]):this._emit(null));return}let i=e.slice(0,-1),r=e[e.length-1],s=this._patch(this.value,i,o=>{if(!o||o.kind!=="and"&&o.kind!=="or")return o;let a=o.items.slice(),c=a[r],h=null;if(c.kind==="and"||c.kind==="or")h=c;else if(c.kind==="not"){let p=c.item;(p.kind==="and"||p.kind==="or")&&(h=p)}return h?(a.splice(r,1,...h.items),{...o,items:a}):o});this._emit(s)}willUpdate(e){if(e.has("value")){let i=this.value;if(i&&this._openPath===null&&i.kind!=="and"&&i.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let r=this._atomAt(this._openPath);(!r||this._atomError(r)===null)&&(this._showError=!1)}this._emitValidity()}}_addAtRoot(){let e=this.value;if(e==null){this._addFirstAtom();return}if(e.kind==="and"||e.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[e,this._emptyAtom()]})}_setOpen(e){this._openPath=e}render(){if(this.value==null)return d`
        <div class="empty">
          <button @click=${()=>this._addFirstAtom()}>
            + ${l(this.hass,"ui.state_add_first","Add condition")}
          </button>
        </div>
      `;let e=this._showError&&this._openPath!==null?(()=>{let s=this._atomAt(this._openPath);return s?this._atomError(s):null})():null,i=Ji(this.value),r=i.kind!=="and"&&i.kind!=="or";return d`
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
      ${r?d`
        <button class="root-add" @click=${()=>this._addAtRoot()}>
          + ${l(this.hass,"ui.state_add_condition","Add condition")}
        </button>
      `:""}
    `}};re.styles=y`
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
  `,u([m({attribute:!1})],re.prototype,"hass",2),u([m({attribute:!1})],re.prototype,"value",2),u([g()],re.prototype,"_openPath",2),u([g()],re.prototype,"_showError",2),u([g()],re.prototype,"_dragFrom",2),u([g()],re.prototype,"_dragOverPath",2),u([g()],re.prototype,"_dragOverPos",2),re=u([w("ambience-state-predicate-input")],re);var Po=["everybody","anybody","nobody","any","all","none"],Ro=new Set(["any","all","none"]),Yr={everybody:"everyone",anybody:"any",nobody:"nobody",any:"any",all:"everyone",none:"nobody"},et=class extends b{constructor(){super(...arguments);this.value=null;this._lastSelected=[]}_persons(){return Gr(this.hass,"person")}_zones(){return Gr(this.hass,"zone")}_cur(){return this.value??{}}_who(){return this.value?.who??[]}_hasWhoKey(){return this.value!=null&&Array.isArray(this.value.who)}_mode(){if(this._hasWhoKey())switch(this._cur().quant??"any"){case"any":return"any";case"everyone":return"all";case"nobody":return"none"}switch(this._cur().quant??"everyone"){case"nobody":return"nobody";case"any":return"anybody";default:return"everybody"}}_applyFor(e,i,r){if(jt(i)){e.for=i;let s=gt(i,r);s&&(e.for_mode=s)}}_isNegativeQuant(){return Yr[this._mode()]==="nobody"}_effectiveNegate(){return!this._isNegativeQuant()&&!!this._cur().negate}_emitMode(e){let i=this._cur(),r=i.where??"home",s={quant:Yr[e],where:r};i.negate&&Yr[e]!=="nobody"&&(s.negate=!0),Ro.has(e)&&(this._hasWhoKey()?s.who=[...this._who()]:this._lastSelected.length>0?s.who=[...this._lastSelected]:s.who=this._persons().map(o=>o.id)),this._applyFor(s,i.for,i.for_mode),this._emit(s)}_emit(e){this.value=e,T(this,e)}_setMode(e){this._emitMode(e)}_setWhere(e){let i=this._cur(),r={quant:i.quant??"everyone",where:e};this._effectiveNegate()&&(r.negate=!0),this._hasWhoKey()&&(r.who=[...this._who()]),this._applyFor(r,i.for,i.for_mode),this._emit(r)}_setNegate(e){let i=this._cur(),r={quant:i.quant??"everyone",where:i.where??"home"};e&&(r.negate=!0),this._hasWhoKey()&&(r.who=[...this._who()]),this._applyFor(r,i.for,i.for_mode),this._emit(r)}_togglePerson(e,i){let r=i?[...this._who(),e]:this._who().filter(a=>a!==e);r.length>0&&(this._lastSelected=[...r]);let s=this._cur(),o={quant:s.quant??"any",where:s.where??"home",who:r};this._effectiveNegate()&&(o.negate=!0),this._applyFor(o,s.for,s.for_mode),this._emit(o)}_setFor(e){let{mode:i,...r}=e,s=this._cur(),o={quant:s.quant??"everyone",where:s.where??"home"};this._effectiveNegate()&&(o.negate=!0),this._hasWhoKey()&&(o.who=[...this._who()]),this._applyFor(o,r,i??"at_least"),this._emit(o)}_modeLabel(e){switch(e){case"everybody":return l(this.hass,"ui.people_mode_everybody","Everybody");case"anybody":return l(this.hass,"ui.people_mode_anybody","Anybody");case"nobody":return l(this.hass,"ui.people_mode_nobody","Nobody");case"any":return l(this.hass,"ui.people_mode_any","Any of:");case"all":return l(this.hass,"ui.people_mode_all","All of:");case"none":return l(this.hass,"ui.people_mode_none","None of:")}}_renderMode(e){if(customElements.get("ha-form")){let i=[{name:"mode",required:!0,selector:{select:{mode:"dropdown",options:Po.map(r=>({value:r,label:this._modeLabel(r)}))}}}];return d`<ha-form
        class="mode"
        .hass=${this.hass}
        .schema=${i}
        .data=${{mode:e}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),r.detail.value.mode&&this._setMode(r.detail.value.mode)}}
      ></ha-form>`}return d`<select
      class="mode"
      @change=${i=>this._setMode(i.target.value)}
    >
      ${Po.map(i=>d`<option value=${i} ?selected=${i===e}>${this._modeLabel(i)}</option>`)}
    </select>`}_renderPeople(){let e=this._persons();if(e.length===0)return d`<div class="hint">${l(this.hass,"ui.people_none_tracked","No people tracked")}</div>`;let i=this._who();return d`<div class="people-list">
      ${e.map(r=>d`<label class="person-pill">
        <input
          type="checkbox"
          .checked=${i.includes(r.id)}
          @change=${s=>this._togglePerson(r.id,s.target.checked)}
        />${r.name}
      </label>`)}
    </div>
    <div class="field-error">${i.length===0?l(this.hass,"ui.people_select_one","Select at least one person"):""}</div>`}_renderNegate(e){let i=[{value:"false",label:l(this.hass,"ui.people_is_at","Is at")},{value:"true",label:l(this.hass,"ui.people_is_not_at","Is not at")}],r=s=>this._setNegate(s==="true");if(customElements.get("ha-form")){let s=[{name:"negate",required:!0,selector:{select:{mode:"dropdown",options:i}}}];return d`<ha-form
        class="negate"
        .hass=${this.hass}
        .schema=${s}
        .data=${{negate:e?"true":"false"}}
        .computeLabel=${()=>""}
        @value-changed=${o=>{o.stopPropagation(),o.detail.value.negate!=null&&r(o.detail.value.negate)}}
      ></ha-form>`}return d`<select
      class="negate"
      @change=${s=>r(s.target.value)}
    >
      ${i.map(s=>d`<option value=${s.value} ?selected=${s.value===(e?"true":"false")}>${s.label}</option>`)}
    </select>`}_renderWhere(e){let i=this._zones().filter(s=>s.id!=="zone.home"),r=[{value:"home",label:l(this.hass,"ui.people_where_home","Home")},...i.map(s=>({value:s.id,label:s.name}))];if(customElements.get("ha-form")){let s=[{name:"where",required:!0,selector:{select:{mode:"dropdown",options:r}}}];return d`<ha-form
        class="where"
        .hass=${this.hass}
        .schema=${s}
        .data=${{where:e}}
        .computeLabel=${()=>""}
        @value-changed=${o=>{o.stopPropagation(),o.detail.value.where&&this._setWhere(o.detail.value.where)}}
      ></ha-form>`}return d`<select
      class="where"
      @change=${s=>this._setWhere(s.target.value)}
    >
      ${r.map(s=>d`<option value=${s.value} ?selected=${s.value===e}>${s.label}</option>`)}
    </select>`}_renderFor(){return d`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this._cur().for??null}
      .mode=${this._cur().for_mode??"at_least"}
      @value-changed=${e=>{e.stopPropagation(),this._setFor(e.detail.value)}}
    ></ambience-for-duration>`}render(){let i=this._cur().where??"home",r=this._mode(),s=!this._isNegativeQuant(),o=this._effectiveNegate();return d`
      <div class="row">${this._renderMode(r)}</div>
      ${Ro.has(r)?this._renderPeople():""}
      <div class="row">
        ${s?this._renderNegate(o):d`<span class="label negate-static">${l(this.hass,"ui.people_is_at_static","is at")}</span>`}
        ${this._renderWhere(i)}
      </div>
      <div class="row">
        <span class="label">${l(this.hass,"ui.people_for","for")}</span>
        ${this._renderFor()}
      </div>
    `}};et.styles=y`
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
  `,u([m({attribute:!1})],et.prototype,"hass",2),u([m({attribute:!1})],et.prototype,"value",2),et=u([w("ambience-people-predicate-input")],et);var tt=class extends b{constructor(){super(...arguments);this.value=null}_cur(){return this.value??{sensors:[]}}_sensors(){return this._cur().sensors??[]}_showQuant(){return this._sensors().length>1}_build(e){let i={...this._cur(),...e},r={sensors:i.sensors??[]};if(i.occupied===!1&&(r.occupied=!1),i.quant==="all"&&(r.quant="all"),jt(i.for)){r.for=i.for;let s=gt(i.for,i.for_mode);s&&(r.for_mode=s)}return i.negate===!0&&(r.negate=!0),r}_emit(e){this.value=e,T(this,e)}_setSensors(e){this._emit(this._build({sensors:e}))}_setOccupied(e){this._emit(this._build({occupied:e}))}_setNegate(e){this._emit(this._build({negate:e}))}_setQuant(e){this._emit(this._build({quant:e}))}_setFor(e){let{mode:i,...r}=e;this._emit(this._build({for:r,for_mode:i??"at_least"}))}_sensorSchema(){return[{name:"sensors",selector:{entity:{domain:"binary_sensor",device_class:["occupancy","presence","motion"],multiple:!0}}}]}_renderSensors(){return xt(this.hass,this._sensorSchema(),this._sensors(),"binary_sensor.a, binary_sensor.b",e=>this._setSensors(e))}_renderNegate(e){return Xe(this.hass,"negate","negate",e?"is_not":"is",[{value:"is",label:l(this.hass,"ui.occupancy_is","is")},{value:"is_not",label:l(this.hass,"ui.occupancy_is_not","is not")}],i=>this._setNegate(i==="is_not"))}_renderOccupied(e){return Xe(this.hass,"state","state",e?"occupied":"vacant",[{value:"occupied",label:l(this.hass,"ui.occupancy_detected","Detected")},{value:"vacant",label:l(this.hass,"ui.occupancy_clear","Clear")}],i=>this._setOccupied(i==="occupied"))}_renderQuant(e){return Xe(this.hass,"quant","quant",e,[{value:"any",label:l(this.hass,"ui.occupancy_any","Any of")},{value:"all",label:l(this.hass,"ui.occupancy_all","All of")}],i=>this._setQuant(i))}_renderFor(){return d`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this._cur().for??null}
      .mode=${this._cur().for_mode??"at_least"}
      @value-changed=${e=>{e.stopPropagation(),this._setFor(e.detail.value)}}
    ></ambience-for-duration>`}render(){let e=this._cur(),i=e.occupied!==!1,r=e.negate===!0,s=e.quant==="all"?"all":"any";return d`
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._renderNegate(r)}
        ${this._renderOccupied(i)}
        ${this._showQuant()?this._renderQuant(s):""}
      </div>
      <div class="row">
        <span class="label">${l(this.hass,"ui.occupancy_for","for")}</span>
        ${this._renderFor()}
      </div>
    `}};tt.styles=y`
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
  `,u([m({attribute:!1})],tt.prototype,"hass",2),u([m({attribute:!1})],tt.prototype,"value",2),tt=u([w("ambience-occupancy-predicate-input")],tt);function Ao(t,n){if(t==null)return null;let e=t.entities;return!Array.isArray(e)||e.length===0?l(n,"ui.unavailable_select_one","Select at least one entity"):null}var kc=[{name:"sensors",selector:{entity:{multiple:!0}}}],it=class extends b{constructor(){super(...arguments);this.value=null}_entities(){return this.value?.entities??[]}_setEntities(e){let i=e.length?{entities:e}:null;this.value=i,T(this,i)}render(){return d`
      <div class="row">
        ${xt(this.hass,kc,this._entities(),"binary_sensor.a, light.b",e=>this._setEntities(e))}
      </div>
    `}};it.styles=y`
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
  `,u([m({attribute:!1})],it.prototype,"hass",2),u([m({attribute:!1})],it.prototype,"value",2),it=u([w("ambience-unavailable-predicate-input")],it);var Ec=new Set(["1","true","yes","on","enable"]);function Do(t){return t==null?!1:typeof t=="boolean"?t:typeof t=="number"?t!==0:typeof t=="string"?Ec.has(t.toLowerCase().trim()):!1}function Cc(t){if(t!==null&&typeof t=="object")try{return JSON.stringify(t)}catch{return String(t)}return String(t)}var He=class extends b{constructor(){super(...arguments);this.value=null;this._preview=null;this._debounceMs=250;this._gen=0}_template(){return this.value&&typeof this.value=="object"?this.value.template:""}willUpdate(e){if(!e.has("value")&&!e.has("hass"))return;let i=this._template(),r=this.hass?.connection;i===this._activeTemplate&&r===this._activeConn||(this._activeTemplate=i,this._activeConn=r,this._scheduleRender())}disconnectedCallback(){super.disconnectedCallback(),this._teardown()}_teardown(){this._debounceTimer!=null&&(clearTimeout(this._debounceTimer),this._debounceTimer=void 0),this._unsub&&(this._unsub(),this._unsub=void 0)}_scheduleRender(){this._teardown();let e=this._template();if(!e.trim()||!this.hass?.connection?.subscribeMessage){this._setPreview(null);return}let i=++this._gen;this._debounceTimer=setTimeout(()=>this._subscribe(e,i),this._debounceMs)}async _subscribe(e,i){let r=this.hass?.connection;if(r?.subscribeMessage)try{let s=await r.subscribeMessage(o=>{i===this._gen&&this._setPreview(o.error!=null?{error:o.error}:{value:Cc(o.result),truthy:Do(o.result)})},{type:"render_template",template:e,report_errors:!0});if(i!==this._gen){s();return}this._unsub=s}catch(s){if(i!==this._gen)return;this._setPreview({error:s?.message??String(s)})}}_setPreview(e){this._preview=e,this._emitValidity(e!=null&&"error"in e?e.error:null)}_emitValidity(e){this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_onInput(e){let i=e.target.value,r=i.trim()===""?null:{template:i};this.value=r,T(this,r)}_renderPreview(){let e=this._preview;return e==null?"":"error"in e?d`<div class="preview error">
        <div class="body">
          <span class="label">${l(this.hass,"ui.template_result","Result")}</span><span class="value">${e.error}</span>
        </div>
      </div>`:d`<div class="preview">
      <div class="body">
        <span class="label">${l(this.hass,"ui.template_result","Result")}</span><span class="value">${e.value}</span>
      </div>
      <span class="bool ${e.truthy?"true":"false"}"
        >${e.truthy?l(this.hass,"ui.template_truthy","true \u2014 matches"):l(this.hass,"ui.template_falsy","false \u2014 no match")}</span
      >
    </div>`}render(){return d`
      <textarea
        spellcheck="false"
        .value=${this._template()}
        placeholder="{{ is_state('binary_sensor.guests','on') }}"
        @input=${this._onInput}
      ></textarea>
      ${this._renderPreview()}
    `}};He.styles=y`
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
  `,u([m({attribute:!1})],He.prototype,"value",2),u([m({attribute:!1})],He.prototype,"hass",2),u([g()],He.prototype,"_preview",2),He=u([w("ambience-template-predicate-input")],He);var ne=class extends b{constructor(){super(...arguments);this.value=null;this._onChild=e=>{e.stopPropagation(),this._emit(e.detail.value)}}_emit(e){T(this,e)}_onText(e){let i=e.target.value;this._emit(i.trim()===""?null:i)}render(){return this.condition.input==="time_of_day"?d`
        <ambience-time-of-day-input
          .value=${this.value}
          .periods=${this.periods}
          .hass=${this.hass}
          @value-changed=${this._onChild}
        ></ambience-time-of-day-input>
      `:this.condition.input==="script_predicate"?d`
        <ambience-script-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-script-predicate-input>
      `:this.condition.input==="day_predicate"?d`
        <ambience-day-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .dayConfig=${this.dayConfig??{workday_sensor:null,workday_calendar:null}}
          @value-changed=${this._onChild}
        ></ambience-day-predicate-input>
      `:this.condition.input==="weather_predicate"?d`
        <ambience-weather-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          .groups=${this.weatherConfig?.groups??[]}
          .weatherEntity=${this.weatherConfig?.entity??void 0}
          @value-changed=${this._onChild}
        ></ambience-weather-predicate-input>
      `:this.condition.input==="sun_predicate"?d`
        <ambience-sun-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-sun-predicate-input>
      `:this.condition.input==="template_predicate"?d`
        <ambience-template-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-template-predicate-input>
      `:this.condition.input==="state_predicate"?d`
        <ambience-state-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-state-predicate-input>
      `:this.condition.input==="people_predicate"?d`
        <ambience-people-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-people-predicate-input>
      `:this.condition.input==="lux"?d`
        <ambience-lux-input
          .hass=${this.hass}
          .value=${this.value}
          .luxRanges=${this.luxRanges}
          @value-changed=${this._onChild}
        ></ambience-lux-input>
      `:this.condition.input==="occupancy_predicate"?d`
        <ambience-occupancy-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-occupancy-predicate-input>
      `:this.condition.input==="unavailable_predicate"?d`
        <ambience-unavailable-predicate-input
          .hass=${this.hass}
          .value=${this.value}
          @value-changed=${this._onChild}
        ></ambience-unavailable-predicate-input>
      `:d`
      <input
        type="text"
        placeholder=${l(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.condition.predicate_help}</div>
    `}};ne.styles=y`
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
  `,u([m({attribute:!1})],ne.prototype,"condition",2),u([m({attribute:!1})],ne.prototype,"value",2),u([m({attribute:!1})],ne.prototype,"periods",2),u([m({attribute:!1})],ne.prototype,"luxRanges",2),u([m({attribute:!1})],ne.prototype,"dayConfig",2),u([m({attribute:!1})],ne.prototype,"weatherConfig",2),u([m({attribute:!1})],ne.prototype,"hass",2),ne=u([w("ambience-condition-input")],ne);function Sc(t){return t!=null&&typeof t=="object"&&Array.isArray(t.who)&&t.who.length===0}function Tc(t){return t==="people"?{quant:"everyone",where:"home"}:null}function Ho(t,n){return!!t&&!!n&&O(t)===O(n)}var Lc={state:Lo,day:ko,lux:$o,unavailable:Ao},S=class extends b{constructor(){super(...arguments);this.open=!1;this.scene=null;this.conditions=[];this.availableActions=[];this.categories=[];this.schemas={};this.scopes=[];this.takenNames=new Map;this.saveError="";this._draft=null;this._open=null;this._showError=!1;this._addOrder=[];this._serviceHasTarget=new Map;this._conditionError=new Map;this._onNameInput=e=>{this._setName(e.target.value)};this._onAddCondition=e=>{let i=e.target,r=i.value;i.value="",this._addCondition(r)};this._onAddConditionHaForm=e=>{e.stopPropagation();let i=e.detail.value.add;i!==S._ADD_CONDITION_PLACEHOLDER&&this._addCondition(i)};this._onAddAction=e=>{let i=e.target,r=i.value;i.value="",this._addActionSlot(r)};this._onAddActionHaForm=e=>{e.stopPropagation();let i=e.detail.value.add;i!==S._ADD_ACTION_PLACEHOLDER&&this._addActionSlot(i)}}_onConditionInvalid(e,i){i?this._conditionError.set(e,i):this._conditionError.delete(e)}connectedCallback(){super.connectedCallback(),ee(this)}willUpdate(e){e.has("open")&&this.open&&(this._draft=this.scene?JSON.parse(JSON.stringify(this.scene)):null,this._scope=this.scope,this._open=null,this._showError=!1,this._addOrder=[],this._conditionError=new Map)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_setDestination(e){let i=this.scopes[e];if(!i||!this._draft||(this._scope=i.scope,!this.hass))return;let r=new Set(Pi(this.hass,this._scope,[]));this._draft={...this._draft,actions:this._draft.actions.map(s=>({...s,entity_ids:s.entity_ids.filter(o=>r.has(o))}))}}_renderDestination(){return d`
      <div class="scope-menu" role="listbox">
        ${this.scopes.map((e,i)=>d`<button
            class="scope-option"
            role="option"
            aria-selected=${Ho(e.scope,this._scope)}
            @click=${()=>{this._setDestination(i),this._open=null}}
          >
            <ha-icon class="scope-icon" icon=${Ft(e.scope,this.hass)}></ha-icon>
            <span class="scope-name">${e.label}</span>
          </button>`)}
      </div>
    `}_renderDestinationSlot(){if(this.scopes.length===0)return"";if(this._isOpen({kind:"destination"}))return d`
        <div class="slot destination-slot expanded" data-slot-id="destination">
          ${this._renderDestination()}
        </div>
      `;let e=this.scopes.find(i=>Ho(i.scope,this._scope))??this.scopes[0];return d`
      <div class="slot collapsed" data-slot-id="destination">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"destination"})}>
          <strong>${l(this.hass,"ui.scope","Scope")}:</strong>
          <ha-icon class="scope-icon" icon=${Ft(e.scope,this.hass)}></ha-icon>
          <span class="scope-name">${e.label}</span>
        </div>
      </div>
    `}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"})){let s=this._showError?this._nameError():null;return d`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
          ${s?d`<div class="error">${s}</div>`:""}
        </div>
      `}let r=Fi(this._draft,l(this.hass,"ui.new_scene","New scene"));return d`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${r}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let i=vn();return i==="ha-input"?d`<ha-input label=${l(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:i==="ha-textfield"?d`<ha-textfield label=${l(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:d`<input type="text" .value=${e} @input=${this._onNameInput} />`}_setCategory(e){!this._draft||!e||e===this._draft.category||(this._draft={...It(this._draft),category:e})}_renderCategorySlot(){if(this.categories.length===0)return"";let e=[...this.categories].sort((s,o)=>s.name.localeCompare(o.name)),i=this._effectiveCategoryId(),r=this.categories.find(s=>s.id===i)??e[0];return this._isOpen({kind:"category"})?d`
        <div class="slot category-slot expanded" data-slot-id="category">
          <div class="category-menu" role="listbox">
            ${e.map(s=>d`<button
                class="category-option"
                role="option"
                aria-selected=${s.id===i}
                @click=${()=>{this._setCategory(s.id),this._open=null}}
              >
                ${ut(s.color,s.icon)}
                <span class="category-name">${s.name}</span>
              </button>`)}
          </div>
        </div>
      `:d`
      <div class="slot collapsed" data-slot-id="category">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"category"})}>
          <strong>${l(this.hass,"ui.category","Category")}:</strong>
          ${ut(r.color,r.icon)}
          <span class="category-name">${r.name}</span>
        </div>
      </div>
    `}_isOpen(e){let i=this._open;return i===null||i.kind!==e.kind?!1:e.kind==="condition"&&i.kind==="condition"?e.id===i.id:e.kind==="action"&&i.kind==="action"?e.idx===i.idx:!0}_effectiveCategoryId(){return this._draft?.category?this._draft.category:[...this.categories].sort((i,r)=>i.name.localeCompare(r.name))[0]?.id??""}_nameError(){let e=this._draft?.name?.trim().toLowerCase();if(!e||!this._scope)return null;let i=Li(this._scope,this._effectiveCategoryId());return this.takenNames.get(i)?.has(e)?l(this.hass,"ui.name_duplicate","A scene with this name already exists in this category."):null}_validationError(e){if(e===null||e.kind==="category"||e.kind==="destination")return null;if(e.kind==="name")return this._nameError();if(e.kind==="condition"){let s=this._draft?.when[e.id];if(Sc(s))return l(this.hass,"ui.people_select_one","Select at least one person");let o=Lc[e.id]?.(s,this.hass);return o||(this._conditionError.has(e.id)?l(this.hass,"ui.condition_error","Fix the error in this condition before continuing"):null)}let i=this._draft?.actions[e.idx];if(!i)return null;let r=this._serviceHasTarget.get(i.service);return i.entity_ids.length===0&&r===!0?l(this.hass,"ui.at_least_one_target","At least one target is required."):null}_leaveBlockingError(e){return e?.kind==="name"?null:this._validationError(e)}_tryCloseCurrent(){return this._open===null?!0:this._leaveBlockingError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){if(this._leaveBlockingError(e)!==null){this._showError=!0;return}this._open=null,this._showError=!1;return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let i of e.composedPath())if(i instanceof Element&&(i.classList.contains("slot")||i.classList.contains("actions-bar")||i.classList.contains("add-condition")||i.classList.contains("add-action")))return;this._tryCloseCurrent()}_setPredicate(e,i){if(!this._draft)return;let r={...this._draft.when};i==null?delete r[e]:r[e]=i,this._draft={...this._draft,when:r}}_renderConditionRow(e){let i=this._draft.when[e.name]??null,r=this._isOpen({kind:"condition",id:e.name}),s=_t(e.name,i,{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges});return d`
      <div class="slot ${r?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"condition",id:e.name})}>
          <span class="summary-label"><strong>${q(this.hass,e.name)}:</strong> ${s}</span>
          <button
            class="remove"
            @click=${o=>{o.stopPropagation(),this._removeCondition(e.name)}}
            title=${l(this.hass,"ui.remove_condition","Remove condition")}
          >✕</button>
        </div>
        ${r?d`
          <div class="body">
            <ambience-condition-input
              .hass=${this.hass}
              .condition=${e}
              .value=${i}
              .periods=${this.periods}
              .luxRanges=${this.luxRanges}
              .dayConfig=${this.dayConfig}
              .weatherConfig=${this.weatherConfig}
              @value-changed=${o=>this._setPredicate(e.name,o.detail.value)}
              @render-invalid-changed=${o=>this._onConditionInvalid(e.name,o.detail.error)}
            ></ambience-condition-input>

            ${this._showError&&this._validationError({kind:"condition",id:e.name})?d`
              <div class="error">${this._validationError({kind:"condition",id:e.name})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_visibleConditions(){if(!this._draft)return[];let e=this._draft.when,i=this.conditions.filter(a=>a.name in e&&e[a.name]!=null||this._open?.kind==="condition"&&this._open.id===a.name),r=new Set(this._addOrder),s=i.filter(a=>!r.has(a.name)),o=this._addOrder.map(a=>i.find(c=>c.name===a)).filter(a=>a!=null);return[...s,...o]}_unusedConditions(){let e=new Set(this._visibleConditions().map(i=>i.name));return this.conditions.filter(i=>!e.has(i.name)).sort((i,r)=>q(this.hass,i.name).localeCompare(q(this.hass,r.name)))}_addCondition(e){if(!e||this._open!==null&&!this._tryCloseCurrent())return;let i=Tc(e);i!=null&&this._draft&&!(e in this._draft.when)&&(this._draft={...this._draft,when:{...this._draft.when,[e]:i}}),this._addOrder=[...this._addOrder.filter(r=>r!==e),e],this._open={kind:"condition",id:e},this._showError=!1}_removeCondition(e){if(!this._draft)return;let i={...this._draft.when};delete i[e],this._draft={...this._draft,when:i},this._conditionError.delete(e),this._open?.kind==="condition"&&this._open.id===e&&(this._open=null,this._showError=!1)}_conditionDisabled(e){return e==="weather"&&!this.weatherConfig?.entity}_renderAddCondition(){let e=this._unusedConditions();return e.length===0?"":customElements.get("ha-form")?this._renderAddConditionHaForm(e):d`
      <div class="add-condition">
        <select class="add-condition" @change=${this._onAddCondition}>
          <option value="">${l(this.hass,"ui.add_condition","+ Add condition\u2026")}</option>
          ${e.map(i=>d`<option value=${i.name} ?disabled=${this._conditionDisabled(i.name)}>${q(this.hass,i.name)}</option>`)}
        </select>
      </div>
    `}_renderAddConditionHaForm(e){let i=l(this.hass,"ui.add_condition","+ Add condition\u2026"),r=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_CONDITION_PLACEHOLDER,label:i},...e.map(s=>({value:s.name,label:q(this.hass,s.name),disabled:this._conditionDisabled(s.name)}))]}}}];return d`
      <div class="add-condition">
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{add:S._ADD_CONDITION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddConditionHaForm}
        ></ha-form>
      </div>
    `}_addActionSlot(e){if(!this._draft||!e||this._open!==null&&!this._tryCloseCurrent())return;let i={service:e,entity_ids:[],params:{}},r=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,i]},this._open={kind:"action",idx:r},this._showError=!1}_actionOptionLabel(e){return e.label?.trim()?e.label:e.id}_renderAddAction(){return this.availableActions.length===0?d`
        <p class="add-action-empty">
          ${l(this.hass,"ui.no_exposed_actions","Add services in Settings \u2192 Actions.")}
        </p>
      `:customElements.get("ha-form")?this._renderAddActionHaForm():d`
      <div class="add-action">
        <select class="add-action" @change=${this._onAddAction}>
          <option value="">${l(this.hass,"ui.add_action","+ Add action\u2026")}</option>
          ${this.availableActions.map(e=>d`
            <option value=${e.id}>${this._actionOptionLabel(e)}</option>
          `)}
        </select>
      </div>
    `}_renderAddActionHaForm(){let e=l(this.hass,"ui.add_action","+ Add action\u2026"),i=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_ACTION_PLACEHOLDER,label:e},...this.availableActions.map(r=>({value:r.id,label:this._actionOptionLabel(r)}))]}}}];return d`
      <div class="add-action">
        <ha-form
          .hass=${this.hass}
          .schema=${i}
          .data=${{add:S._ADD_ACTION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddActionHaForm}
        ></ha-form>
      </div>
    `}_updateActionAt(e,i){if(!this._draft)return;let r=this._draft.actions.map((s,o)=>o===e?i(s):s);this._draft={...this._draft,actions:r}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((i,r)=>r!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,i){this._updateActionAt(e,r=>({...r,entity_ids:i}))}_setActionParams(e,i){this._updateActionAt(e,r=>({...r,params:i}))}_onTargetModeChanged(e,i){this._serviceHasTarget.get(e)!==i&&(this._serviceHasTarget=new Map(this._serviceHasTarget).set(e,i))}_renderActionRow(e,i){let r=this.availableActions.find(a=>a.id===e.service),s=this._isOpen({kind:"action",idx:i}),o=Rs(e,{hass:this.hass,exposedActions:this.availableActions,schemas:this.schemas});return d`
      <div class="slot ${s?"expanded":"collapsed"}" data-slot-id="action-${i}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:i})}>
          <span class="summary-label">${o}</span>
          <button class="remove" @click=${a=>{a.stopPropagation(),this._deleteAction(i)}} title=${l(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${s?d`
          <div class="body">
            <ambience-action-slot
              .hass=${this.hass}
              .scope=${this._scope}
              .exposed=${r}
              .entityIds=${e.entity_ids}
              .excludeEntities=${_s(this._draft?.actions??[],i)}
              .params=${e.params}
              @entity-ids-changed=${a=>{a.stopPropagation(),this._setActionTargets(i,a.detail.entityIds)}}
              @params-changed=${a=>{a.stopPropagation(),this._setActionParams(i,a.detail.params)}}
              @target-mode-changed=${a=>{a.stopPropagation(),this._onTargetModeChanged(e.service,a.detail.hasTarget)}}
            ></ambience-action-slot>

            ${this._showError&&this._validationError({kind:"action",idx:i})?d`
              <div class="error">${this._validationError({kind:"action",idx:i})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_save(){if(!this._draft)return;if(this._nameError()!==null){this._showError=!0,this._open={kind:"name"};return}for(let i of Object.keys(this._draft.when))if(this._draft.when[i]!=null&&this._validationError({kind:"condition",id:i})!==null){this._showError=!0,this._open={kind:"condition",id:i};return}for(let i=0;i<this._draft.actions.length;i++)if(this._validationError({kind:"action",idx:i})!==null){this._showError=!0,this._open={kind:"action",idx:i};return}let e=Object.fromEntries(Object.entries(this._draft.when).filter(([,i])=>i!=null));this.dispatchEvent(new CustomEvent("save-scene",{detail:{scene:{...this._draft,when:e},scope:this._scope},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-scene",{bubbles:!0,composed:!0}))}render(){if(!this._draft)return d``;let e=this._visibleConditions();return d`
      <div class="modal" @click=${this._onModalClick}>
        <div class="content">
          ${this._renderNameSlot()}
          ${this._renderCategorySlot()}
          ${this._renderDestinationSlot()}

          <h3>${l(this.hass,"ui.when_heading","When")}</h3>
          ${e.map(i=>this._renderConditionRow(i))}
          ${this._renderAddCondition()}

          <h3>${l(this.hass,"ui.actions_heading","Actions")}</h3>
          ${this._draft.actions.map((i,r)=>this._renderActionRow(i,r))}
          ${this._renderAddAction()}
        </div>

        <div class="actions-bar">
          ${this.saveError?d`<div class="error save-error">${this.saveError}</div>`:""}
          <button class="secondary" @click=${this._cancel}>${l(this.hass,"ui.cancel","Cancel")}</button>
          <button class="primary" @click=${this._save}>${l(this.hass,"ui.save_scene","Save scene")}</button>
        </div>
      </div>
    `}};S.styles=[Ei,y`
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
  `],S._ADD_CONDITION_PLACEHOLDER="__add_condition__",S._ADD_ACTION_PLACEHOLDER="__add_action__",u([m({type:Boolean,reflect:!0})],S.prototype,"open",2),u([m({attribute:!1})],S.prototype,"scene",2),u([m({attribute:!1})],S.prototype,"conditions",2),u([m({attribute:!1})],S.prototype,"periods",2),u([m({attribute:!1})],S.prototype,"luxRanges",2),u([m({attribute:!1})],S.prototype,"dayConfig",2),u([m({attribute:!1})],S.prototype,"weatherConfig",2),u([m({attribute:!1})],S.prototype,"availableActions",2),u([m({attribute:!1})],S.prototype,"categories",2),u([m({attribute:!1})],S.prototype,"schemas",2),u([m({attribute:!1})],S.prototype,"hass",2),u([m({attribute:!1})],S.prototype,"scope",2),u([m({attribute:!1})],S.prototype,"scopes",2),u([m({attribute:!1})],S.prototype,"takenNames",2),u([m({attribute:!1})],S.prototype,"saveError",2),u([g()],S.prototype,"_draft",2),u([g()],S.prototype,"_scope",2),u([g()],S.prototype,"_open",2),u([g()],S.prototype,"_showError",2),u([g()],S.prototype,"_addOrder",2),u([g()],S.prototype,"_serviceHasTarget",2),S=u([w("ambience-scene-editor")],S);function Pc(t,n,e,i){return n==="time_of_day"?Ee(t,e,i):n==="weather"?ct(t,e):e}var er=y`
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
`;function Oo(t,n){t.stopPropagation(),t.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:n},bubbles:!0,composed:!0}))}function Qr(t,n,e){let i=r=>{(r.key==="Enter"||r.key===" ")&&!r.repeat&&(r.preventDefault(),Oo(r,n))};return d`<span
    class="entity-link"
    role="button"
    tabindex="0"
    title=${l(t,"ui.show_more_info","Show more info")}
    @click=${r=>Oo(r,n)}
    @keydown=${i}
    >${e}</span
  >`}function No(t,n){return Qr(t,n,ji(t,n))}var Rc=new Set(["occupancy","people","lux","state"]);function Ac(t,n,e,i,r){let s=Pc(t,n,e,i);if(!r?.length||!Rc.has(n))return s;let o=[],a=r.map(p=>({id:p,name:ji(t,p)})).sort((p,f)=>f.name.length-p.name.length);for(let{id:p,name:f}of a)for(let _=0;_<=s.length;){let v=s.indexOf(f,_);if(v===-1)break;let x=v+f.length;if(!o.some(E=>v<E.end&&E.start<x)){o.push({start:v,end:x,id:p,name:f});break}_=v+1}if(o.length===0)return s;o.sort((p,f)=>p.start-f.start);let c=[],h=0;for(let p of o)p.start>h&&c.push(s.slice(h,p.start)),c.push(Qr(t,p.id,p.name)),h=p.end;return h<s.length&&c.push(s.slice(h)),d`${c}`}var Dc={has_time:["ui.cause_has_time","Periodic time check"],switch:["ui.cause_switch","Switch turned on"],manual:["ui.cause_manual","Manual apply"],startup:["ui.cause_startup","Startup"],reloaded:["ui.cause_reloaded","Reloaded"],simulated:["ui.cause_simulated","Simulation"]},Hc={clock:["ui.cause_clock","Time of day"],sun:["ui.cause_sun","Sun position"],reapply:["ui.cause_reapply","Reapply"]};function me(t){return t??"?"}function Io(t,n){if(n.kind==="entity")return`${n.entity_id} ${me(n.old)} \u2192 ${me(n.new)}`;if(n.kind==="duration")return n.entity_id?`${n.entity_id} ${me(n.new)} for ${me(n.detail)}`:`${me(n.new)} for ${me(n.detail)}`;let e=Dc[n.kind];if(e)return l(t,e[0],e[1]);let i=Hc[n.kind],r=i?l(t,i[0],i[1]):F(n.kind);return n.detail?`${r} ${n.detail}`:r}function Oc(t,n){if(!tr(n)||!n.entity_id)return d`${Io(t,n)}`;let e=Qr(t,n.entity_id,n.entity_id);return n.kind==="duration"?d`${e} ${me(n.new)} for ${me(n.detail)}`:d`${e} ${me(n.old)} → ${me(n.new)}`}function tr(t){return t.kind==="entity"||t.kind==="duration"&&!!t.entity_id}function Fo(t,n){let e=t.entity_id?n?.states?.[t.entity_id]:void 0,i=r=>r===null?"?":at(n,e,null,r);return{old:i(t.old),new:i(t.new)}}function Nc(t,n){if(!tr(t))return Io(n,t);let e=t.entity_id?ji(n,t.entity_id):"?",i=Fo(t,n);return t.kind==="duration"?`${e}: ${i.new} for ${t.detail??"?"}`:`${e}: ${i.old} \u2192 ${i.new}`}function Ic(t,n){if(!tr(t)||!t.entity_id)return d`${Nc(t,n)}`;let e=No(n,t.entity_id),i=Fo(t,n);return t.kind==="duration"?d`${e}: ${i.new} for ${t.detail??"?"}`:d`${e}: ${i.old} → ${i.new}`}var Fc={acted:["ui.outcome_label_acted","applied"],no_op:["ui.outcome_label_no_op","blocked"],debounced:["ui.outcome_label_debounced","unchanged"],no_match:["ui.outcome_label_no_match","no match"],skipped_switch_off:["ui.outcome_label_skipped","skipped"],skipped_scope_disabled:["ui.outcome_label_skipped","skipped"],skipped_unavailable:["ui.outcome_label_skipped","skipped"]};function Mc(t,n){let e=Fc[n];return e?l(t,e[0],e[1]):n.replace(/_/g," ")}function Zi(t,n,e,i,r,s){return n===1?l(t,e,r,{n:String(n)}):l(t,i,s,{n:String(n)})}function Mo(t,n){let e=n.winner_name??l(t,"ui.winner_default","The matching scene");switch(n.outcome){case"acted":{let i=n.actions.filter(h=>!h.unexposed),r=n.actions.length-i.length;if(i.length===0&&r){let h=Zi(t,r,"ui.count_action_one","ui.count_action_other","{n} action","{n} actions");return l(t,"ui.outcome_summary_acted_all_skipped","{winner} matched \u2014 {skipped_phrase} skipped (not exposed); nothing applied.",{winner:e,skipped_phrase:h})}let s=Zi(t,i.length,"ui.count_action_one","ui.count_action_other","{n} action","{n} actions"),o=zo(i),a=r?l(t,"ui.outcome_summary_skipped_tail"," ({skipped} skipped \u2014 not exposed)",{skipped:String(r)}):"",c=Zi(t,o,"ui.count_entity_one","ui.count_entity_other","{n} entity","{n} entities");return o?l(t,"ui.outcome_summary_acted_entities","Applied {winner} \u2014 {acts} on {entities}.{tail}",{winner:e,acts:s,entities:c,tail:a}):l(t,"ui.outcome_summary_acted","Applied {winner} \u2014 {acts}.{tail}",{winner:e,acts:s,tail:a})}case"no_op":return l(t,"ui.outcome_summary_no_op","{winner} matched but has no actions \u2014 it blocks lower scenes from applying. Nothing changed.",{winner:e});case"debounced":return l(t,"ui.outcome_summary_debounced","{winner} matched, but it's already applied \u2014 nothing was re-sent.",{winner:e});case"no_match":return l(t,"ui.outcome_summary_no_match","No scene matched \u2014 nothing applied.");case"skipped_switch_off":return l(t,"ui.outcome_summary_skipped_switch_off","Skipped \u2014 the category switch is off.");case"skipped_scope_disabled":return l(t,"ui.outcome_summary_skipped_scope_disabled","Skipped \u2014 the scope is disabled.");case"skipped_unavailable":return l(t,"ui.outcome_summary_skipped_unavailable","Skipped \u2014 the triggering entity went unavailable; devices left as they are.");default:return""}}function jo(t,n){return ot(t,n,()=>hi(t))}function jc(t,n,e,i){let r=Object.entries(t.params??{}).filter(([,o])=>o!=null&&o!=="").map(([o,a])=>`${Bt(o,t.service,e)}: ${Le(n,a)}`).join(", "),s=jo(t.service,i);return r?`${s} \xB7 ${r}`:s}function zo(t){return t.reduce((n,e)=>n+(e.entity_ids?.length??0),0)}function zc(t){return t==="skipped_switch_off"||t==="skipped_scope_disabled"||t==="skipped_unavailable"}function Uc(t,n,e){let i=t.index+1;return t.disabled?d`<div class="scene disabled">Scene #${i} ${t.name??"\u2014"}: disabled</div>`:t.evaluated?d`
    <div class="scene ${t.matched?"won":""}">Scene #${i} ${t.name??"\u2014"}: ${t.matched?"\u2713 matched":"\u2717 no match"}</div>
    ${t.predicates.map(r=>d`
        <div class="pred ${r.passed?"pass":"fail"}" style="padding-left:1rem">
          ${r.passed?"\u2713":"\u2717"} ${q(n,r.condition_key)}${r.detail?d` <span class="dim">[${Ac(n,r.condition_key,r.detail,e,r.entity_ids)}]</span>`:$}
        </div>`)}
  `:d`<div class="scene skipped">Scene #${i} ${t.name??"\u2014"}: not reached</div>`}function ir(t,n,e,i,r,s={},o){let a=t.actions.filter(_=>!_.unexposed),c=a.map(_=>jo(_.service,o)).join(", "),h=zo(a),p=t.explanation!==null||t.actions.length>0||zc(t.outcome),f=_=>{(_.key==="Enter"||_.key===" ")&&!_.repeat&&(_.preventDefault(),e())};return d`
    <div class="eval">
      <div
        class="outcome ${t.outcome}${p?" clickable":""}"
        role=${p?"button":$}
        tabindex=${p?"0":$}
        aria-expanded=${p?n:$}
        @click=${p?e:void 0}
        @keydown=${p?f:void 0}
      >
        <span class="label">${Mc(i,t.outcome)}</span>
        <span class="ts">${t.timestamp?new Date(t.timestamp).toLocaleTimeString():""}</span>
      </div>
      <div class="eval-body">
        <div class="cause-line">Trigger: ${Ic(t.cause,i)}</div>
        ${t.winner_name?d`<div class="won">Won: <span class="name">${t.winner_name}</span></div>`:$}
        ${a.length?d`<div class="action-summary">→ ${c}
              ${h?d`<span class="n">· ${Zi(i,h,"ui.count_entity_one","ui.count_entity_other","{n} entity","{n} entities")}</span>`:$}</div>`:n?$:d`<div class="action-summary">${Mo(i,t)}</div>`}
      </div>
      ${n?Wc(t,i,r,s,o):$}
    </div>
  `}function Wc(t,n,e,i,r){let s=Mo(n,t),o=tr(t.cause);return d`
    <div class="why">
      ${o?d`<div class="raw-trigger">Trigger: ${Oc(n,t.cause)}</div>`:$}
      ${s?d`<div class="outcome-summary">${s}</div>`:$}
      ${t.explanation?d`<div class="section">
            <div class="section-title">Scene evaluation</div>
            <div class="scenes">${t.explanation.scenes.map(a=>Uc(a,n,i))}</div>
          </div>`:$}
      ${t.actions.length?d`<div class="section">
            <div class="section-title">Actions taken</div>
            ${t.actions.map(a=>d`<div class="action-block ${a.unexposed?"unexposed":""}">
                <div class="action-head">
                  ${jc(a,n,e,r)}${a.unexposed?d`<span class="skipped-tag"> — skipped (not exposed)</span>`:$}
                </div>
                ${(a.entity_ids??[]).map(c=>d`<div class="entity">${No(n,c)}</div>`)}
              </div>`)}
          </div>`:$}
    </div>
  `}var Oe=class{constructor(n,e){this._onKeydown=n=>{this._host.open&&n.key==="Escape"&&this._close()};this._onBackdrop=()=>{this._host.open&&this._close()};this._host=n,this._close=e,n.addController(this)}hostConnected(){document.addEventListener("keydown",this._onKeydown),this._host.addEventListener("click",this._onBackdrop)}hostDisconnected(){document.removeEventListener("keydown",this._onKeydown),this._host.removeEventListener("click",this._onBackdrop)}};var I=class extends b{constructor(){super();this.exposedActions=[];this.category="";this.categoryName=null;this.open=!1;this._records=[];this._schemas={};this._expanded=new Set;this._loading=!0;this._error="";this._hasNew=!1;new Oe(this,()=>this._onClose())}disconnectedCallback(){super.disconnectedCallback(),this._stopPoll()}_startPoll(){this._poll||(this._poll=setInterval(()=>this._checkNew(),5e3))}_stopPoll(){this._poll&&(clearInterval(this._poll),this._poll=void 0)}updated(e){e.has("open")&&(this.open?this._startPoll():this._stopPoll()),this.open&&(e.has("open")||e.has("category")||e.has("scope"))&&this._load()}_mine(e){return e.filter(i=>i.scope_kind===this.scope.scope_kind&&i.scope_id===this.scope.scope_id&&i.category===this.category)}async _load(){this._error="",this._loading=!0,this._hasNew=!1,this._expanded=new Set;try{let e=await br(this.hass);if(!this.isConnected)return;this._records=this._mine(e),this._loading=!1,this._loadSchemas()}catch(e){this._error=C(this.hass,e),this._loading=!1}}async _loadSchemas(){let e=[...new Set(this._records.flatMap(s=>s.actions.map(o=>o.service)))].filter(s=>!(s in this._schemas));if(e.length===0)return;let i=await Promise.all(e.map(async s=>{try{return[s,await Ce(this.hass,s)]}catch{return null}}));if(!this.isConnected)return;let r={...this._schemas};for(let s of i)s&&(r[s[0]]=s[1]);this._schemas=r}async _checkNew(){if(!(!this.open||!this.isConnected||document.visibilityState!=="visible"))try{let i=this._mine(await br(this.hass))[0]?.timestamp??null,r=this._records[0]?.timestamp??null;i&&(!r||i>r)&&(this._hasNew=!0)}catch{}}_toggle(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}async _download(){try{await os(this.hass,this.scope,this.category)}catch(e){this._error=C(this.hass,e)}}async _clear(){try{await ss(this.hass),await this._load()}catch(e){this._error=C(this.hass,e)}}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){if(!this.open)return $;let e=this.categoryName??this.category;return d`
      <div class="modal" role="dialog" aria-modal="true" @click=${i=>i.stopPropagation()}>
        <div class="header">
          <h3>${e}</h3>
          <button class="refresh ${this._hasNew?"has-new":""}" @click=${()=>this._load()}>
            ${this._hasNew?`\u25CF ${l(this.hass,"ui.new_traces_refresh","New traces \u2014 refresh")}`:l(this.hass,"ui.refresh","Refresh")}
          </button>
          <button class="clear" @click=${this._clear}>
            ${l(this.hass,"ui.clear_traces","Clear")}
          </button>
          <button class="download" @click=${this._download}>
            ${l(this.hass,"ui.download_diagnostics","Download diagnostics")}
          </button>
          <button class="close" @click=${this._onClose} aria-label=${l(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          ${this._error?d`<p class="error">${this._error}</p>`:this._loading?d`<p class="empty">${l(this.hass,"ui.loading","Loading\u2026")}</p>`:this._records.length===0?d`<p class="empty">${l(this.hass,"ui.no_traces_yet","No traces for this category yet.")}</p>`:d`<div class="list">${this._records.map((i,r)=>{let s=`${i.event_id??r}|${i.timestamp??""}`;return ir(i,this._expanded.has(s),()=>this._toggle(s),this.hass,this._schemas,this.periods?.custom??{},this.exposedActions)})}</div>`}
        </div>
      </div>
    `}};I.styles=[er,y`
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
      .refresh, .download, .clear {
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
    `],u([m({attribute:!1})],I.prototype,"hass",2),u([m({attribute:!1})],I.prototype,"periods",2),u([m({attribute:!1})],I.prototype,"exposedActions",2),u([m({attribute:!1})],I.prototype,"scope",2),u([m()],I.prototype,"category",2),u([m()],I.prototype,"categoryName",2),u([m({type:Boolean,reflect:!0})],I.prototype,"open",2),u([g()],I.prototype,"_records",2),u([g()],I.prototype,"_schemas",2),u([g()],I.prototype,"_expanded",2),u([g()],I.prototype,"_loading",2),u([g()],I.prototype,"_error",2),u([g()],I.prototype,"_hasNew",2),I=u([w("ambience-traces-modal")],I);var Bc={time:"mdi:clock-outline",sun:"mdi:weather-sunny"},K=class extends b{constructor(){super(...arguments);this.categoryName="";this.scenes=[];this.open=!1;this._triggers=[];this._opaque=!1;this._loading=!1;this._error="";this._loadSeq=0}willUpdate(e){super.willUpdate?.(e);let i=e.has("open")||e.has("scope")||e.has("category");this.open&&(i||e.has("scenes"))&&(i&&(this._triggers=[],this._opaque=!1),this._load())}get _scopeId(){return this.scope.kind==="house"?null:this.scope.id}async _load(){let e=++this._loadSeq;this._loading=!0,this._error="";try{let i=await jn(this.hass,this.scope.kind,this._scopeId,this.category);if(e!==this._loadSeq)return;this._triggers=i.triggers,this._opaque=i.opaque}catch(i){if(e!==this._loadSeq)return;this._error=C(this.hass,i)}finally{e===this._loadSeq&&(this._loading=!1)}}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_openMoreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_entityName(e){return j(this.hass,e)}get _sortedTriggers(){let e=s=>this._entityName(s.entity_id).toLowerCase(),i=this._triggers.filter(s=>s.kind==="entity").sort((s,o)=>e(s).localeCompare(e(o))),r=this._triggers.filter(s=>s.kind!=="entity");return[...i,...r]}_sunPart(e){let i=ke(this.hass,e.anchor);if(e.offset===0)return i;let r=l(this.hass,"ui.unit_min","min");return`${i} ${e.offset>0?"+":""}${e.offset} ${r}`}_rowContent(e){switch(e.kind){case"entity":return{title:this._entityName(e.entity_id),detail:e.entity_id};case"time":{let i=e.clocks.map(r=>`${String(r.hour).padStart(2,"0")}:${String(r.minute).padStart(2,"0")}`);return e.date_rollover&&i.push(l(this.hass,"ui.auto_trigger_date_rollover","Local midnight (date rollover)")),e.has_time&&i.push(l(this.hass,"ui.auto_trigger_periodic","periodic re-check")),{title:l(this.hass,"ui.auto_trigger_group_time","Time"),detail:i.join(", ")}}case"sun":return{title:l(this.hass,"ui.auto_trigger_group_sun","Sun"),detail:e.suns.map(i=>this._sunPart(i)).join(", ")}}}_renderRowIcon(e){return e.kind==="entity"?Mt(this.hass,e.entity_id):d`<ha-icon
      class="row-icon"
      icon=${Bc[e.kind]??Er}
    ></ha-icon>`}_moreInfoEntity(e){return e.kind==="entity"?e.entity_id:e.kind==="sun"&&this.hass?.states?.["sun.sun"]?"sun.sun":null}_renderRow(e){let{title:i,detail:r}=this._rowContent(e),s=this._moreInfoEntity(e);return d`
      <li
        data-test=${`trigger-ro-${e.key}`}
        class=${s?"clickable":""}
        role=${s?"button":$}
        tabindex=${s?"0":$}
        @click=${s?()=>this._openMoreInfo(s):$}
        @keydown=${s?o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),this._openMoreInfo(s))}:$}
      >
        ${this._renderRowIcon(e)}
        <div class="row-text">
          <div class="row-title">${i}</div>
          ${r?d`<div class="row-detail">${r}</div>`:""}
        </div>
      </li>
    `}render(){if(!this.open)return $;let e=l(this.hass,"ui.auto_triggers_section","Auto-triggers");return d`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>${e}${this.categoryName?` \u2014 ${this.categoryName}`:""}</h3>
          <button class="close" @click=${this._close} aria-label=${l(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">${this._renderBody()}</div>
      </div>
    `}_renderBody(){return this._error?d`<div class="error">${this._error}</div>`:this._loading&&this._triggers.length===0?d`<div class="empty">${l(this.hass,"ui.loading","Loading\u2026")}</div>`:d`
      ${this._opaque?d`<div class="note">
            ${l(this.hass,"ui.auto_triggers_opaque_note","A script scene is opaque \u2014 some watches may be missing. Declare them in the scene's Triggers field.")}
          </div>`:""}
      ${this._triggers.length===0?d`<div class="empty">
            ${l(this.hass,"ui.auto_triggers_none","No automatic triggers.")}
          </div>`:d`<ul>
            ${this._sortedTriggers.map(e=>this._renderRow(e))}
          </ul>`}
    `}};K.styles=y`
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
  `,u([m({attribute:!1})],K.prototype,"hass",2),u([m({attribute:!1})],K.prototype,"scope",2),u([m()],K.prototype,"category",2),u([m()],K.prototype,"categoryName",2),u([m({attribute:!1})],K.prototype,"scenes",2),u([m({type:Boolean,reflect:!0})],K.prototype,"open",2),u([g()],K.prototype,"_triggers",2),u([g()],K.prototype,"_opaque",2),u([g()],K.prototype,"_loading",2),u([g()],K.prototype,"_error",2),K=u([w("ambience-auto-triggers-modal")],K);function Uo(t,n){return n==="not_home"?l(t,"ui.away","Away"):n==="home"?l(t,"ui.home","Home"):F(n)}function Wo(t){return{state:t.live_state??"",attributes:Object.fromEntries(t.attributes.map(n=>[n.name,n.live_value==null?"":String(n.live_value)])),for:{h:0,m:0,s:0}}}function rr(t){return String(t).padStart(2,"0")}function Bo(t){return`${t.getFullYear()}-${rr(t.getMonth()+1)}-${rr(t.getDate())}`}function Vo(t){return`${rr(t.getHours())}:${rr(t.getMinutes())}`}var R=class extends b{constructor(){super();this.exposedActions=[];this.category="";this.categoryName=null;this.open=!1;this._knobs=[];this._hasTime=!1;this._loading=!0;this._error="";this._values={};this._verdicts={};this._date="";this._time="";this._result=null;this._expanded=!1;new Oe(this,()=>this._onClose())}updated(e){this.open&&(e.has("open")||e.has("category")||e.has("scope"))&&this._load()}_vkey(e){return`${e.condition}:${e.key}`}async _load(){this._error="",this._loading=!0,this._result=null,this._expanded=!1;let e=new Date;this._date=Bo(e),this._time=Vo(e);try{let i=await as(this.hass,this.scope,this.category);if(!this.isConnected)return;this._knobs=i.knobs,this._hasTime=i.has_time;let r={},s={};for(let o of i.knobs)o.kind==="entity"?r[o.entity_id]=Wo(o):s[this._vkey(o)]=o.live_value;this._values=r,this._verdicts=s,this._loading=!1}catch(i){this._error=C(this.hass,i),this._loading=!1}}_setState(e,i){this._values={...this._values,[e]:{...this._values[e],state:i}}}_setAttr(e,i,r){let s=this._values[e];this._values={...this._values,[e]:{...s,attributes:{...s.attributes,[i]:r}}}}_setFor(e,i,r){let s=this._values[e],o=Number.isFinite(r)&&r>0?Math.trunc(r):0;this._values={...this._values,[e]:{...s,for:{...s.for,[i]:o}}}}_setVerdict(e,i){this._verdicts={...this._verdicts,[e]:i}}_resetWhen(){let e=new Date;this._date=Bo(e),this._time=Vo(e)}_resetEntity(e){this._values={...this._values,[e.entity_id]:Wo(e)}}_resetVerdict(e){this._verdicts={...this._verdicts,[this._vkey(e)]:e.live_value}}_buildOverrides(){let e={};for(let i of this._knobs){if(i.kind!=="entity")continue;let r=this._values[i.entity_id];if(!r)continue;let s={};for(let a of i.attributes){let c=r.attributes[a.name];if(!(c===void 0||c===""))if(a.control==="number"){let h=Number(c);Number.isNaN(h)||(s[a.name]=h)}else s[a.name]=c}let o={attributes:s};r.state!==""&&(o.state=r.state),(r.for.h||r.for.m||r.for.s)&&(o.for=r.for),(o.state!==void 0||o.for!==void 0||Object.keys(s).length>0)&&(e[i.entity_id]=o)}return e}_buildVerdicts(){let e={};for(let i of this._knobs)i.kind==="verdict"&&(e[i.condition]||(e[i.condition]={}),e[i.condition][i.key]=this._verdicts[this._vkey(i)]??i.live_value);return e}async _run(){this._error="";let e=new Date(`${this._date}T${this._time}`);if(!this._date||!this._time||Number.isNaN(e.getTime())){this._error=l(this.hass,"ui.invalid_datetime","Enter a valid date and time.");return}let i=e.toISOString();try{this._result=await ls(this.hass,this.scope,this.category,i,this._buildOverrides(),this._buildVerdicts()),this._expanded=!1}catch(r){this._error=C(this.hass,r)}}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?d`
      <div class="modal" role="dialog" aria-modal="true" @click=${e=>e.stopPropagation()}>
        <div class="header">
          <h3>${l(this.hass,"ui.simulate_title","Simulate")} · ${this.categoryName??this.category}</h3>
          <button class="close" @click=${this._onClose} aria-label=${l(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          ${this._error?d`<p class="error">${this._error}</p>`:$}
          ${this._loading?d`<p>${l(this.hass,"ui.loading","Loading\u2026")}</p>`:d`
            ${this._hasTime?d`
              <p class="sec-title">${l(this.hass,"ui.when_heading","When")}</p>
              <div class="when">
                <input type="date" .value=${this._date}
                  @change=${e=>this._date=e.target.value} />
                <input type="time" .value=${this._time}
                  @change=${e=>this._time=e.target.value} />
                <button class="reset" title=${l(this.hass,"ui.reset_to_now","Reset to now")} aria-label=${l(this.hass,"ui.reset_to_now","Reset to now")}
                  @click=${()=>this._resetWhen()}>↺</button>
                <span class="hint">${l(this.hass,"ui.simulate_when_hint","drives sun, time-of-day, weekday & workday")}</span>
              </div>`:$}
            ${this._knobs.length?d`
              <p class="sec-title">${l(this.hass,"ui.simulate_inputs_heading","Inputs this category depends on")}</p>
              ${this._knobs.map(e=>e.kind==="entity"?this._renderEntity(e):this._renderVerdict(e))}`:$}
            <div class="run-row"><button class="runbtn" @click=${()=>void this._run()}>${l(this.hass,"ui.simulate_button","Simulate")} ▸</button></div>
            ${this._result?d`<div class="result">${ir(this._result,this._expanded,()=>this._expanded=!this._expanded,this.hass,void 0,this.periods?.custom??{},this.exposedActions)}</div>`:$}
          `}
        </div>
      </div>`:$}_renderEntity(e){let i=this._values[e.entity_id],r=e.attributes.length>0;return d`
      <div class="row ${r?"has-attrs":""}">
        ${Mt(this.hass,e.entity_id)}
        <div class="row-text">
          <div class="row-title">${j(this.hass,e.entity_id)}</div>
          <div class="row-detail">${e.entity_id}</div>
        </div>
        <div class="row-ctrl">
          ${this._renderControl(e,i?.state??"")}
          ${this._renderFor(e,i?.for??{h:0,m:0,s:0})}
          <button class="reset" data-reset=${e.entity_id} title=${l(this.hass,"ui.reset_to_live","Reset to live")}
            @click=${()=>this._resetEntity(e)}>↺</button>
        </div>
      </div>
      ${e.attributes.map((s,o)=>d`
        <div class="row attr ${o===e.attributes.length-1?"last-attr":""}">
          <div class="row-text"><div class="row-title">${Uo(this.hass,s.name)}</div></div>
          <div class="row-ctrl">
            <input class=${s.control==="number"?"num":""}
              type=${s.control==="number"?"number":"text"}
              data-attr=${`${e.entity_id}:${s.name}`}
              .value=${i?.attributes[s.name]??""}
              @input=${a=>this._setAttr(e.entity_id,s.name,a.target.value)} />
            <button class="reset" title=${l(this.hass,"ui.reset_to_live","Reset to live")}
              @click=${()=>this._resetEntity(e)}>↺</button>
          </div>
        </div>`)}
    `}_renderControl(e,i){if(e.control==="select")return d`<select data-entity=${e.entity_id} .value=${i}
        @change=${s=>this._setState(e.entity_id,s.target.value)}>
        ${(e.options??[i]).map(s=>d`<option value=${s} ?selected=${s===i}>${Uo(this.hass,s)}</option>`)}
      </select>`;let r=e.control==="number"?"number":"text";return d`<input class=${e.control==="number"?"num":""} type=${r} data-entity=${e.entity_id}
      .value=${i}
      @input=${s=>this._setState(e.entity_id,s.target.value)} />`}_renderFor(e,i){let r={h:"hours",m:"minutes",s:"seconds"},s=j(this.hass,e.entity_id),o=a=>d`<input class="for-num" type="number" min="0"
      aria-label=${`${s} \u2014 held for, ${r[a]}`}
      data-for=${`${e.entity_id}:${a}`} .value=${String(i[a])}
      @change=${c=>this._setFor(e.entity_id,a,Number(c.target.value))} />`;return d`<span class="for-ctrl" title=${l(this.hass,"ui.duration_held_hint","How long it has held this state (h:m:s)")}>
      <span class="for-label">${l(this.hass,"ui.for_label","For")}</span>${o("h")}<span>:</span>${o("m")}<span>:</span>${o("s")}
    </span>`}_renderVerdict(e){let i=this._vkey(e),r=this._verdicts[i]??e.live_value,s=e.entity_id?j(this.hass,e.entity_id):e.label,o=e.entity_id?Mt(this.hass,e.entity_id):d`<ha-icon class="row-icon" icon="mdi:code-braces"></ha-icon>`;return d`
      <div class="row">
        ${o}
        <div class="row-text">
          <div class="row-title">${s}</div>
          ${e.entity_id?d`<div class="row-detail">${e.entity_id}</div>`:$}
        </div>
        <div class="row-ctrl">
          <select data-verdict=${i} .value=${String(r)}
            @change=${a=>this._setVerdict(i,a.target.value==="true")}>
            <option value="true" ?selected=${r}>${l(this.hass,"ui.true_label","True")}</option>
            <option value="false" ?selected=${!r}>${l(this.hass,"ui.false_label","False")}</option>
          </select>
          <button class="reset" title=${l(this.hass,"ui.reset_to_live","Reset to live")} @click=${()=>this._resetVerdict(e)}>↺</button>
        </div>
      </div>`}};R.styles=[er,ws,y`
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
    `],u([m({attribute:!1})],R.prototype,"hass",2),u([m({attribute:!1})],R.prototype,"periods",2),u([m({attribute:!1})],R.prototype,"exposedActions",2),u([m({attribute:!1})],R.prototype,"scope",2),u([m()],R.prototype,"category",2),u([m()],R.prototype,"categoryName",2),u([m({type:Boolean,reflect:!0})],R.prototype,"open",2),u([g()],R.prototype,"_knobs",2),u([g()],R.prototype,"_hasTime",2),u([g()],R.prototype,"_loading",2),u([g()],R.prototype,"_error",2),u([g()],R.prototype,"_values",2),u([g()],R.prototype,"_verdicts",2),u([g()],R.prototype,"_date",2),u([g()],R.prototype,"_time",2),u([g()],R.prototype,"_result",2),u([g()],R.prototype,"_expanded",2),R=u([w("ambience-simulator-modal")],R);function Vc(t){let n=Math.floor(t/3600),e=Math.floor(t%3600/60),i=t%60,r=s=>String(s).padStart(2,"0");return n>0?`${n}:${r(e)}:${r(i)}`:`${e}:${r(i)}`}var Jr=1024;function qc(t,n,e){if(t!==void 0&&n!==void 0)return Math.floor((t+n)/2);let i=e.map(r=>r.priority??0);return t===void 0&&n===void 0?Jr:t===void 0?Math.max(...i)+Jr:Math.min(...i)-Jr}var G=class extends b{constructor(){super(...arguments);this._store=new D(this);this._expanded=new Set(Ln());this._collapsedCategories=new Set(Rn());this._conditionsHintDismissed=!1;this._editing=null;this._sceneEditorError="";this._savingScene=!1;this._viewingTraces=null;this._viewingSimulator=null;this._autoTriggers=null;this._autoTriggerScenesMemo=null;this.filterCategory=""}async connectedCallback(){super.connectedCallback(),this._conditionsHintDismissed=Dn(),await this._store.loadStatic(),await Promise.all([this._store.refreshAreas(),this._store.refreshFloors(),this._store.refreshHouse(),this._store.refreshSwitches()]),await this._store.subscribe(e=>this._onScopeRemoved(e))}_onScopeRemoved(e){let i=O(e),r=new Set(this._expanded);r.delete(i),this._setExpanded(r);let s=Nt(e,"");this._setCollapsedCategories(new Set([...this._collapsedCategories].filter(o=>!o.startsWith(s)))),this._editing&&O(this._editing.scope)===i&&(this._editing=null)}willUpdate(e){e.has("filterCategory")&&e.get("filterCategory")!==void 0&&this._onFilterCategoryChanged()}_onFilterCategoryChanged(){let e=this.filterCategory;if(e==="")return;let i=new Set(this._expanded),r=new Set(this._collapsedCategories),s=!1,o=!1;for(let a of this._orderedScopeRows()){let c=O(a.scope);this._matchingSceneCount(a.cfg)===0&&i.delete(c)&&(s=!0),r.delete(Nt(a.scope,e))&&(o=!0)}s&&this._setExpanded(i),o&&this._setCollapsedCategories(r)}_setExpanded(e){this._expanded=e,Pn([...e])}_toggleExpand(e){let i=O(e),r=new Set(this._expanded);r.has(i)?r.delete(i):r.add(i),this._setExpanded(r)}_setCollapsedCategories(e){this._collapsedCategories=e,An([...e])}_toggleCategoryCollapse(e,i){let r=Nt(e,i.detail.categoryId),s=new Set(this._collapsedCategories);s.has(r)?s.delete(r):s.add(r),this._setCollapsedCategories(s)}_collapsedCategoriesFor(e){return this._store.categories.map(i=>i.id).filter(i=>this._collapsedCategories.has(Nt(e,i)))}_addScene(e,i){let r=this._store.getConfig(e);r&&(this._sceneEditorError="",this._editing={scope:e,index:r.scenes.length,isNew:!0,category:i})}_editScene(e,i){this._sceneEditorError="",this._editing={scope:e,index:i.detail.index,isNew:!1}}_duplicateScene(e,i){let r=this._store.getConfig(e);if(!r)return;let s=r.scenes[i.detail.index];if(!s)return;let o=It(JSON.parse(JSON.stringify(s)));this._sceneEditorError="",this._editing={scope:e,index:r.scenes.length,isNew:!0,seed:o}}_deleteScene(e,i){let r=this._store.getConfig(e);if(!r)return;let s=r.scenes.filter((o,a)=>a!==i.detail.index);this._store.mutate(e,{...r,scenes:s})}_reorderScenes(e,i){let r=this._store.getConfig(e);if(!r)return;let{from:s,to:o}=i.detail,a=r.scenes[s];if(!a||r.scenes[o]?.category!==a.category)return;let c=[...r.scenes];c.splice(s,1),c.splice(o,0,a);let h=E=>c[E]&&c[E].category===a.category,p=o-1;for(;p>=0&&!h(p);)p--;let f=o+1;for(;f<c.length&&!h(f);)f++;let _=p>=0?c[p].priority:void 0,v=f<c.length?c[f].priority:void 0,x=qc(_,v,r.scenes.filter(E=>E.category===a.category));c[o]={...a,priority:x,pinned:!0},this._store.mutate(e,{...r,scenes:c})}_unpinScene(e,i){let r=this._store.getConfig(e);if(!r)return;let s=r.scenes.map((o,a)=>a===i.detail.index?{...o,pinned:!1}:o);this._store.mutate(e,{...r,scenes:s})}_toggleSceneEnabled(e,i){let r=this._store.getConfig(e);if(!r)return;let s=r.scenes.map((o,a)=>{if(a!==i.detail.index)return o;if(i.detail.enabled){let c={...o};return delete c.enabled,c}return{...o,enabled:!1}});this._store.mutate(e,{...r,scenes:s})}async _saveScene(e){if(this._savingScene)return;let i=this._editing;if(!i)return;let{scene:r,scope:s}=e.detail;this._savingScene=!0,this._sceneEditorError="";try{if(O(s)===O(i.scope)){let h=this._store.getConfig(s);if(!h)return;let p=[...h.scenes];i.isNew?p.push(r):p[i.index]=r,await this._store.mutate(s,{...h,scenes:p})?this._editing=null:this._sceneEditorError=this._takeError();return}let o=It(r),a=this._store.getConfig(s);if(!a)return;if(!await this._store.mutate(s,{...a,scenes:[...a.scenes,o]})){this._sceneEditorError=this._takeError();return}if(this._editing=null,!i.isNew){let h=this._store.getConfig(i.scope);if(h){let p=h.scenes.filter((f,_)=>_!==i.index);await this._store.mutate(i.scope,{...h,scenes:p})}}}finally{this._savingScene=!1}}_takeError(){let e=this._store.error;return this._store.error="",e}async _callApi(e){this._store.error="";try{await e()}catch(i){this._store.error=C(this.hass,i)}}_applyScenes(e,i){return this._callApi(()=>Wn(this.hass,e,i))}_runSceneActions(e,i){return this._callApi(()=>Bn(this.hass,e,i.detail.index))}_cancelScene(){this._sceneEditorError="",this._editing=null}_onScopeMenu(e,i){i==="run"&&this._applyScenes(e)}_showAutoTriggers(e,i){let r=this._store.categories.find(s=>s.id===i);this._autoTriggers={scope:e,category:i,categoryName:r?.name??null}}_autoTriggerScenes(){if(!this._autoTriggers)return[];let e=this._store.getConfig(this._autoTriggers.scope)?.scenes,{category:i}=this._autoTriggers,r=this._autoTriggerScenesMemo;if(r&&r.source===e&&r.category===i)return r.filtered;let s=(e??[]).filter(o=>o.category===i);return this._autoTriggerScenesMemo={source:e,category:i,filtered:s},s}_showTraces(e,i){let r=this._store.categories.find(s=>s.id===i);this._viewingTraces={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:i,categoryName:r?.name??null}}_showSimulator(e,i){let r=this._store.categories.find(s=>s.id===i);this._viewingSimulator={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:i,categoryName:r?.name??null}}_defaultCategoryId(){return this.filterCategory!==""?this.filterCategory:[...this._store.categories].sort((i,r)=>i.name.localeCompare(r.name))[0]?.id??""}get _editingScene(){return this._editing?this._editing.seed?this._editing.seed:this._editing.isNew?{when:{},actions:[],category:this._editing.category??this._defaultCategoryId()}:this._store.getConfig(this._editing.scope)?.scenes[this._editing.index]??null:null}get _editorConditions(){return this._editing?this._store.conditions.slice().sort((e,i)=>i.priority-e.priority):[]}get _takenSceneNames(){let e=new Map,i=this._editing,r=(s,o)=>{if(!o)return;let a=!!i&&!i.isNew&&O(i.scope)===O(s);o.scenes.forEach((c,h)=>{if(a&&h===i.index)return;let p=c.name?.trim().toLowerCase();if(!p)return;let f=Li(s,c.category),_=e.get(f);_||(_=new Set,e.set(f,_)),_.add(p)})};r({kind:"house"},this._store.house);for(let s of this._store.floors)r({kind:"floor",id:s.floor_id},this._store.floorConfigs.get(s.floor_id));for(let s of this._store.areas)r({kind:"area",id:s.area_id},this._store.areaConfigs.get(s.area_id));return e}get _scopeOptions(){return[{scope:{kind:"house"},label:l(this.hass,"ui.scope_house","House")},...this._store.floors.map(e=>({scope:{kind:"floor",id:e.floor_id},label:e.name})),...this._store.areas.map(e=>({scope:{kind:"area",id:e.area_id},label:e.name}))]}_matchingSceneCount(e){return this.filterCategory===""?e.scenes.length:e.scenes.filter(i=>i.category===this.filterCategory).length}_summary(e){if(e.scenes.length===0)return l(this.hass,"ui.not_configured","not configured");let i=this._matchingSceneCount(e),r=i===1?l(this.hass,"ui.scene_singular","scene"):l(this.hass,"ui.scene_plural","scenes");return`${i} ${r}`}get _weatherUnconfigured(){return!this._store.weatherConfig||this._store.weatherConfig.entity==null}get _workdayUnconfigured(){let e=this._store.dayConfig;return!e||e.workday_sensor==null&&e.workday_calendar==null}get _conditionsUnconfigured(){return this._weatherUnconfigured||this._workdayUnconfigured}_conditionsHintText(){let e=this._weatherUnconfigured,i=this._workdayUnconfigured;return e&&i?{title:l(this.hass,"ui.conditions_hint_title","Optional: set up Workday & Weather"),body:l(this.hass,"ui.conditions_hint_body","Configure Workday and Weather in Conditions to use them in your scene conditions.")}:i?{title:l(this.hass,"ui.conditions_hint_title_workday","Optional: set up Workday"),body:l(this.hass,"ui.conditions_hint_body_workday","Configure Workday in Conditions to use it in your scene conditions.")}:{title:l(this.hass,"ui.conditions_hint_title_weather","Optional: set up Weather"),body:l(this.hass,"ui.conditions_hint_body_weather","Configure Weather in Conditions to use it in your scene conditions.")}}_openSettings(e){this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:e},bubbles:!0,composed:!0}))}_dismissConditionsHint(){this._conditionsHintDismissed=!0,Hn()}_renderBanners(){if(!this._store.staticLoaded)return"";if(this._store.actions.length===0)return d`
        <div class="banner banner-required" data-test="no-actions-banner" role="alert">
          <ha-icon class="banner-icon" icon="mdi:alert-circle-outline"></ha-icon>
          <div class="banner-text">
            <strong
              >${l(this.hass,"ui.no_actions_title","Set up an action to get started")}</strong
            >
            <span
              >${l(this.hass,"ui.no_actions_body","Ambience can't apply anything until you expose at least one action \u2014 scenes need actions to run.")}</span
            >
          </div>
          <button
            class="banner-cta"
            data-test="setup-actions-btn"
            @click=${()=>this._openSettings("actions")}
          >
            ${l(this.hass,"ui.no_actions_cta","Set up actions")}
          </button>
        </div>
      `;if(!this._conditionsHintDismissed&&this._conditionsUnconfigured){let{title:e,body:i}=this._conditionsHintText();return d`
        <div class="banner banner-hint" data-test="conditions-hint-banner">
          <ha-icon class="banner-icon" icon="mdi:lightbulb-on-outline"></ha-icon>
          <div class="banner-text">
            <strong>${e}</strong>
            <span>${i}</span>
          </div>
          <button
            class="banner-cta"
            data-test="setup-conditions-btn"
            @click=${()=>this._openSettings("conditions")}
          >
            ${l(this.hass,"ui.conditions_hint_cta","Configure conditions")}
          </button>
          <button
            class="banner-dismiss"
            data-test="dismiss-conditions-hint"
            title=${l(this.hass,"ui.dismiss","Dismiss")}
            aria-label=${l(this.hass,"ui.dismiss","Dismiss")}
            @click=${()=>this._dismissConditionsHint()}
          >
            ✕
          </button>
        </div>
      `}return""}_orderedScopeRows(){let e=[{scope:{kind:"house"},name:l(this.hass,"ui.scope_house","House"),cfg:this._store.house,rowClass:"house"}];for(let s of this._store.floors){let o=this._store.floorConfigs.get(s.floor_id);o&&e.push({scope:{kind:"floor",id:s.floor_id},name:s.name,cfg:o,rowClass:"floor"})}for(let s of this._store.areas){let o=this._store.areaConfigs.get(s.area_id);o&&e.push({scope:{kind:"area",id:s.area_id},name:s.name,cfg:o,rowClass:"area"})}let i=[],r=[];for(let s of e)(s.cfg.enabled===!1?r:i).push(s);return[...i,...r]}_isSwitchedOff(e){let i=this._store.switchEntityIds.get(O(e));return i?this.hass.states?.[i]?.state==="off":!1}_renderAreasPlaceholder(){return this._store.areasLoaded?!this._store.error&&this._store.areas.length===0?d`<li>
        <p class="empty">
          ${l(this.hass,"ui.no_areas","No areas found in Home Assistant.")}
        </p>
      </li>`:"":d`<li>
        <p class="empty" data-test="areas-loading">
          <span class="spinner" aria-hidden="true"></span>
          ${l(this.hass,"ui.loading","Loading\u2026")}
        </p>
      </li>`}render(){return d`
      ${this._store.error?d`<p class="error">${this._store.error}</p>`:""}
      ${this._renderBanners()}
      <ul>
        ${ms(this._orderedScopeRows(),e=>O(e.scope),e=>this._renderScopeRow(e.scope,e.name,e.cfg,e.rowClass))}
        ${this._renderAreasPlaceholder()}
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
    `}_renderScopeRow(e,i,r,s){let o=this._expanded.has(O(e)),a=e.kind==="house"?"":e.id,c=this._isSwitchedOff(e)?"off":this._matchingSceneCount(r)===0?"empty":"",h=r.enabled===!1;return d`
      <li class="scope-row ${s} ${h?"scope-disabled":""}" data-id=${a}>
        <div
          class="scope-header ${o?"open":""} ${c}"
          @click=${()=>this._toggleExpand(e)}
        >
          <span class="chevron ${o?"open":""}">▶</span>
          <ha-icon class="scope-icon" icon=${Ft(e,this.hass)}></ha-icon>
          <span class="scope-name">${i}</span>
          ${Di(this.hass,r.scenes)}
          <span class="scope-summary">${this._summary(r)}</span>
          ${this._renderPauseIcon(e,r)}
          ${this._renderScopeSwitch(e,r)}
          <ambience-kebab-menu
            data-test="scope-kebab"
            ?muted=${c==="off"||h}
            .hass=${this.hass}
            .items=${[{id:"run",label:l(this.hass,"ui.run","Run"),icon:"mdi:play"}]}
            @menu-action=${p=>this._onScopeMenu(e,p.detail.id)}
            @click=${p=>p.stopPropagation()}
          ></ambience-kebab-menu>
        </div>
        ${o?d`
              <div class="scope-body">
                <ambience-scenes-list
                  .scenes=${r.scenes}
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
                  @show-simulator=${p=>this._showSimulator(e,p.detail.category)}
                  @show-auto-triggers=${p=>this._showAutoTriggers(e,p.detail.category)}
                ></ambience-scenes-list>
              </div>
            `:""}
      </li>
    `}_pauseRemaining(e){let i=this.hass.states?.[e],r=i?.attributes?.off_at,s=Number(i?.attributes?.auto_on_delay_seconds??0);if(!r||!s)return 0;let o=(Date.now()-new Date(r).getTime())/1e3;return Math.max(0,Math.round(s-o))}_renderPauseIcon(e,i){if(i.enabled===!1)return"";let r=this._store.switchEntityIds.get(O(e));if(!r)return"";let s=this.hass.states?.[r]?.state==="off",o=c=>{c.stopPropagation(),this.hass.callService?.("switch",s?"turn_on":"turn_off",{entity_id:r})};if(!s)return d`<button
        class="scope-pause"
        data-test="scope-pause"
        title=${l(this.hass,"ui.pause_scope","Pause this scope")}
        @click=${o}
      >
        <ha-icon icon="mdi:timer-outline"></ha-icon>
      </button>`;let a=this._pauseRemaining(r);return d`<button
      class="scope-pause paused"
      data-test="scope-pause"
      title=${l(this.hass,"ui.resume_scope","Resume now")}
      @click=${o}
    >
      <ha-icon icon="mdi:timer"></ha-icon>
      <span class="countdown">${Vc(a)}</span>
    </button>`}_renderScopeSwitch(e,i){let r=i.enabled!==!1;return Ri({checked:r,dataTest:"scope-switch",onChange:async a=>{a.stopPropagation();try{await Jn(this.hass,e,!r),await Promise.all([this._store.reloadScope(e),this._store.refreshSwitches()])}catch(c){this._store.error=C(this.hass,c)}},className:"scope-switch",onClick:a=>a.stopPropagation()})}};G.styles=[y`
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
    `],u([m({attribute:!1})],G.prototype,"hass",2),u([g()],G.prototype,"_expanded",2),u([g()],G.prototype,"_collapsedCategories",2),u([g()],G.prototype,"_conditionsHintDismissed",2),u([g()],G.prototype,"_editing",2),u([g()],G.prototype,"_sceneEditorError",2),u([g()],G.prototype,"_viewingTraces",2),u([g()],G.prototype,"_viewingSimulator",2),u([g()],G.prototype,"_autoTriggers",2),u([m({attribute:!1})],G.prototype,"filterCategory",2),G=u([w("ambience-scopes-view")],G);var Ne=class extends b{constructor(){super(...arguments);this.text="";this._open=!1;this._onDocClick=e=>{e.composedPath().includes(this)||this._close()};this._onKeydown=e=>{e.key==="Escape"&&this._close()}}_toggle(e){e.stopPropagation(),this._open?this._close():this._openPopover()}_openPopover(){this._open=!0,document.addEventListener("click",this._onDocClick,!0),document.addEventListener("keydown",this._onKeydown)}_close(){this._open&&(this._open=!1,document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown),this.renderRoot.querySelector(".trigger")?.focus())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown)}render(){return d`
      <button
        class="trigger"
        data-test="help-trigger"
        aria-label=${l(this.hass,"ui.help","Help")}
        aria-expanded=${this._open}
        @click=${e=>this._toggle(e)}
      >
        ?
      </button>
      ${this._open?d`<div class="popover" role="dialog" data-test="help-popover">
            <slot>${this.text}</slot>
          </div>`:""}
    `}};Ne.styles=y`
    :host {
      position: relative;
      display: inline-flex;
      vertical-align: middle;
    }
    button.trigger {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.15em;
      height: 1.15em;
      border-radius: 50%;
      border: 1px solid var(--secondary-text-color, #888);
      color: var(--secondary-text-color, #888);
      font-size: 0.8em;
      font-weight: 700;
      line-height: 1;
    }
    button.trigger:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
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
  `,u([m({attribute:!1})],Ne.prototype,"hass",2),u([m()],Ne.prototype,"text",2),u([g()],Ne.prototype,"_open",2),Ne=u([w("ambience-help")],Ne);var Kc=[{field:"expose_assist",labelKey:"ui.settings_expose_assist",label:"Assist",dataTest:"expose-assist"},{field:"expose_google",labelKey:"ui.settings_expose_google",label:"Google Assistant",dataTest:"expose-google"},{field:"expose_alexa",labelKey:"ui.settings_expose_alexa",label:"Alexa",dataTest:"expose-alexa"}],fe=class extends b{constructor(){super(...arguments);this._defaults={name:"Ambience",auto_on_delay_seconds:0,create_switches:!1};this._reapply={enabled:!1,interval_seconds:3600};this._exposed={expose_assist:!0,expose_google:!1,expose_alexa:!1};this._error=""}async connectedCallback(){super.connectedCallback();try{this._defaults=await Yn(this.hass),this._reapply=await Zn(this.hass),this._exposed=await ts(this.hass)}catch(e){this._error=C(this.hass,e)}}async _safeSave(e){try{await e(),this._error=""}catch(i){this._error=C(this.hass,i)}}_saveDefaults(){this._safeSave(()=>Xn(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds,this._defaults.create_switches))}_onCreateSwitches(e){this._defaults={...this._defaults,create_switches:e.target.checked},this._saveDefaults()}_onDefaultName(e){let i=e.target,r=i.value.trim();if(!r){i.value=this._defaults.name;return}this._defaults={...this._defaults,name:r},this._saveDefaults()}_onPauseMinutes(e){let i=e.target,r=Math.floor(Number(i.value));if(i.value===""||!Number.isFinite(r)||r<0){i.value=String(Math.round(this._defaults.auto_on_delay_seconds/60));return}this._defaults={...this._defaults,auto_on_delay_seconds:r*60},this._saveDefaults()}_saveReapply(){this._safeSave(()=>es(this.hass,this._reapply.enabled,this._reapply.interval_seconds))}_onReapplyEnabled(e){this._reapply={...this._reapply,enabled:e.target.checked},this._saveReapply()}_onReapplyMinutes(e){let i=e.target,r=Math.floor(Number(i.value));if(i.value===""||!Number.isFinite(r)||r<1){i.value=String(Math.round(this._reapply.interval_seconds/60));return}this._reapply={...this._reapply,interval_seconds:r*60},this._saveReapply()}_saveExposed(){this._safeSave(()=>is(this.hass,this._exposed.expose_assist,this._exposed.expose_google,this._exposed.expose_alexa))}_onExpose(e,i){this._exposed={...this._exposed,[e]:i.target.checked},this._saveExposed()}_renderToggle(e,i,r,s=!1){return Ri({checked:e,dataTest:i,onChange:r,disabled:s})}render(){return d`
      ${this._error?d`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:""}

      <div class="card">
        <div class="row toggle-row">
          <label>
            ${l(this.hass,"ui.settings_ambience_pause_card","Scope-level pause switch")}
            <ambience-help
              .hass=${this.hass}
              .text=${l(this.hass,"ui.help_pause_switch","Create a switch entity per area/floor/house that pauses Ambience for that scope when turned off.")}
            ></ambience-help>
          </label>
          ${this._renderToggle(this._defaults.create_switches,"pause-switch-enabled",e=>this._onCreateSwitches(e))}
        </div>
        <div class="row">
          <label>
            ${l(this.hass,"ui.settings_ambience_field_name","Switch name")}
            <ambience-help
              .hass=${this.hass}
              .text=${l(this.hass,"ui.help_switch_name","The name used for the per-scope pause switch entities.")}
            ></ambience-help>
          </label>
          <input
            data-test="defaults-name"
            type="text"
            ?disabled=${!this._defaults.create_switches}
            .value=${this._defaults.name}
            @change=${e=>this._onDefaultName(e)}
          />
        </div>
        <div class="row">
          <label>
            ${l(this.hass,"ui.settings_ambience_field_pause","Pause for")}
            <ambience-help
              .hass=${this.hass}
              .text=${l(this.hass,"ui.help_pause_for","When a scope's switch is turned off, auto-resume after this many minutes. 0 = stays paused until turned back on.")}
            ></ambience-help>
          </label>
          <input
            data-test="pause-for-minutes"
            type="number"
            min="0"
            ?disabled=${!this._defaults.create_switches}
            .value=${String(Math.round(this._defaults.auto_on_delay_seconds/60))}
            @change=${e=>this._onPauseMinutes(e)}
          />
          <span class="unit"
            >${l(this.hass,"ui.unit_minutes","minutes")}</span
          >
        </div>
        <div class="row toggle-row" style="margin-top:1.5rem">
          <label style="flex:1 1 auto">
            ${l(this.hass,"ui.settings_expose_group","Expose to voice assistants")}
            <ambience-help
              .hass=${this.hass}
              .text=${l(this.hass,"ui.help_expose","Expose the per-scope pause switches to the selected voice assistants so you can pause/resume Ambience by voice. Google Assistant and Alexa require Home Assistant Cloud or a manual setup.")}
            ></ambience-help>
          </label>
        </div>
        ${Kc.map(e=>d`
            <div class="row">
              <label>${l(this.hass,e.labelKey,e.label)}</label>
              ${this._renderToggle(this._exposed[e.field],e.dataTest,i=>this._onExpose(e.field,i),!this._defaults.create_switches)}
            </div>
          `)}
      </div>

      <div class="card">
        <div class="row toggle-row">
          <label>
            ${l(this.hass,"ui.settings_reapply_enable_label","Reapply scenes after inactivity")}
            <ambience-help
              .hass=${this.hass}
              .text=${l(this.hass,"ui.help_reapply_toggle","Check the scenes for a scope/category after inactivity and reapply the winning scene, in case any action had previously failed, such as a light not turning off.")}
            ></ambience-help>
          </label>
          ${this._renderToggle(this._reapply.enabled,"reapply-enabled",e=>this._onReapplyEnabled(e))}
        </div>
        <div class="row">
          <label>
            ${l(this.hass,"ui.settings_reapply_interval_label","Reapply after")}
            <ambience-help
              .hass=${this.hass}
              .text=${l(this.hass,"ui.help_reapply_after","Reapply scenes that haven't been updated for this many minutes.")}
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
            >${l(this.hass,"ui.unit_minutes","minutes")}</span
          >
        </div>
      </div>
    `}};fe.styles=y`
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
      font-weight: 600;
      /* Label column is a fixed half-width so the fields beside it line up. */
      flex: 0 0 50%;
    }
    .toggle-row {
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      padding-bottom: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .toggle-row label {
      font-weight: 700;
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
  `,u([m({attribute:!1})],fe.prototype,"hass",2),u([g()],fe.prototype,"_defaults",2),u([g()],fe.prototype,"_reapply",2),u([g()],fe.prototype,"_exposed",2),u([g()],fe.prototype,"_error",2),fe=u([w("ambience-ambience-settings")],fe);function qo(){let t=globalThis.crypto;if(t?.randomUUID)return t.randomUUID().replace(/-/g,"");if(t?.getRandomValues){let n=t.getRandomValues(new Uint8Array(16));return Array.from(n,e=>e.toString(16).padStart(2,"0")).join("")}return Array.from({length:4},()=>Math.floor(Math.random()*4294967296).toString(16).padStart(8,"0")).join("")}var ge=class extends b{constructor(){super(...arguments);this._categories=[];this._error="";this._editing=null;this._modalError=""}async connectedCallback(){super.connectedCallback();try{this._categories=await Ge(this.hass)}catch(e){this._error=C(this.hass,e)}}_sorted(){return[...this._categories].sort((e,i)=>e.name.localeCompare(i.name))}_validate(e){let i=e.name.trim();if(i==="")return l(this.hass,"ui.category_name_blank_error","Category names can't be empty.");let r=i.toLocaleLowerCase();return this._categories.some(o=>o.id!==e.id&&o.name.trim().toLocaleLowerCase()===r)?l(this.hass,"ui.category_name_duplicate_error","Two categories can't have the same name."):""}_openEditor(e){this._editing={...e},this._modalError=""}_addCategory(){let e=qo();this._editing={id:e,name:""},this._modalError=""}_closeModal(){this._editing=null,this._modalError=""}_patchDraft(e){this._editing&&(this._editing={...this._editing,...e})}_onName(e){this._patchDraft({name:e.target.value})}_onIcon(e){this._patchDraft({icon:e||void 0})}_onColor(e){this._patchDraft({color:e})}_save(){if(!this._editing)return;let e=this._validate(this._editing);if(e){this._modalError=e;return}let i={...this._editing,name:this._editing.name.trim()},r=this._categories.some(s=>s.id===i.id);this._categories=r?this._categories.map(s=>s.id===i.id?i:s):[...this._categories,i],this._closeModal(),rs(this.hass,this._categories).then(()=>{window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(s=>{this._error=C(this.hass,s)})}_deleteCategory(){if(!this._editing)return;let e=this._editing.id;if(this._categories.length<=1){this._modalError=l(this.hass,"ui.category_delete_blocked_last","You can't delete the last category.");return}let i=this._categories;this._categories=this._categories.filter(r=>r.id!==e),ns(this.hass,e).then(()=>{this._closeModal(),window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(r=>{this._categories=i;let s=r.code;s==="category_in_use"?this._modalError=l(this.hass,"ui.category_delete_blocked_in_use","This category still has scenes \u2014 move or delete them first."):s==="category_last"?this._modalError=l(this.hass,"ui.category_delete_blocked_last","You can't delete the last category."):this._modalError=C(this.hass,r)})}_renderIconField(){return customElements.get("ha-icon-picker")?d`<ha-icon-picker
        .hass=${this.hass}
        .value=${this._editing.icon??""}
        @value-changed=${e=>{e.stopPropagation(),this._onIcon(e.detail.value)}}
      ></ha-icon-picker>`:d`<input
      class="icon-input"
      .value=${this._editing.icon??""}
      placeholder=${l(this.hass,"ui.category_icon","Icon")}
      @change=${e=>this._onIcon(e.target.value)}
    />`}_renderSwatches(){let e=this._editing.color;return d`
      <div class="swatches">
        ${wr.map(i=>d`<button
            type="button"
            class="swatch ${e===i.id?"selected":""}"
            style=${`background: ${i.hex}`}
            title=${i.label}
            aria-label=${i.label}
            aria-pressed=${e===i.id}
            @click=${()=>this._onColor(i.id)}
          ></button>`)}
        <button
          type="button"
          class="swatch none ${e==null?"selected":""}"
          title=${l(this.hass,"ui.category_color_none","No colour")}
          aria-label=${l(this.hass,"ui.category_color_none","No colour")}
          aria-pressed=${e==null}
          @click=${()=>this._onColor(void 0)}
        >✕</button>
      </div>
    `}_renderModal(){if(!this._editing)return"";let e=this._categories.some(r=>r.id===this._editing.id),i=e?l(this.hass,"ui.category_edit_title","Edit category"):l(this.hass,"ui.category_add_title","Add category");return d`
      <div
        class="overlay"
        @click=${r=>{r.target.classList.contains("overlay")&&this._closeModal()}}
      >
        <div class="modal">
          <div class="modal-header">
            <h3>${i}</h3>
            <button
              class="close"
              title=${l(this.hass,"ui.cancel","Cancel")}
              aria-label=${l(this.hass,"ui.cancel","Cancel")}
              @click=${()=>this._closeModal()}
            >✕</button>
          </div>
          <div class="modal-content">
            <label>${l(this.hass,"ui.category_name_placeholder","Category name")}</label>
            <input
              class="name"
              .value=${this._editing.name}
              placeholder=${l(this.hass,"ui.category_name_placeholder","Category name")}
              aria-label=${l(this.hass,"ui.category_name_placeholder","Category name")}
              @input=${this._onName}
            />

            <label>${l(this.hass,"ui.category_icon","Icon")}</label>
            ${this._renderIconField()}

            <label>${l(this.hass,"ui.category_color","Colour")}</label>
            ${this._renderSwatches()}

            ${this._modalError?d`<p class="modal-error">${this._modalError}</p>`:""}
          </div>
          <div class="modal-footer">
            ${e?d`<button class="delete" @click=${()=>this._deleteCategory()}>
                  ${l(this.hass,"ui.title_delete","Delete")}
                </button>`:d`<span></span>`}
            <div class="right">
              <button class="primary" @click=${()=>this._save()}>
                ${l(this.hass,"ui.category_save","Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    `}render(){return d`
      ${this._error?d`<p class="error">${this._error}</p>`:""}
      <div class="list">
        ${this._sorted().map(e=>{let i=xr(e.color);return d`<button class="category-row" @click=${()=>this._openEditor(e)}>
            <span class="row-icon">${e.icon?d`<ha-icon icon=${e.icon}></ha-icon>`:""}</span>
            <span class="row-swatch ${i?"":"none"}" style=${i?`background: ${i}`:""}></span>
            <span class="row-name">${e.name}</span>
          </button>`})}
      </div>
      <div class="add-row">
        <button class="add" @click=${()=>this._addCategory()}>
          ${l(this.hass,"ui.category_add","+ Add category")}
        </button>
        <ambience-help .hass=${this.hass} .text=${l(this.hass,"ui.help_categories_tab","Categories let one scope have several independent winners at once \u2014 one scene wins per category.")}></ambience-help>
      </div>
      ${this._renderModal()}
    `}};ge.styles=y`
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
  `,u([m({attribute:!1})],ge.prototype,"hass",2),u([g()],ge.prototype,"_categories",2),u([g()],ge.prototype,"_error",2),u([g()],ge.prototype,"_editing",2),u([g()],ge.prototype,"_modalError",2),ge=u([w("ambience-categories-settings")],ge);var $e=class extends b{constructor(){super(...arguments);this.conditionName="";this.conditionDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let e=q(this.hass,this.conditionName);return d`
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
    `}};$e.styles=y`
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
  `,u([m({attribute:!1})],$e.prototype,"hass",2),u([m()],$e.prototype,"conditionName",2),u([m()],$e.prototype,"conditionDescription",2),u([g()],$e.prototype,"_expanded",2),$e=u([w("ambience-condition-card")],$e);var Gc=/^[a-z][a-z0-9_]*$/;function Yc(t){return t.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var ei=y`
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
`,se=class extends b{constructor(){super(...arguments);this.takenIds=new Set;this._label="";this._error=""}static{this.styles=ei}connectedCallback(){super.connectedCallback(),this._label=this._initialLabel()??""}_onLabelInput(e){this._label=e.target.value}_validateName(e){return this.existingId?"":this._label.trim()?!e||!Gc.test(e)?l(this.hass,"ui.error_start_letter","Name must start with a letter."):this.takenIds.has(e)?l(this.hass,"ui.error_name_exists","An entry with this name already exists. Choose a different name."):"":l(this.hass,"ui.error_enter_name","Please enter a name.")}_onSave(){let e=this.existingId??Yc(this._label),i=this._validateName(e)||this._validateDef();if(i){this._error=i,this.performUpdate();return}this.dispatchEvent(new CustomEvent(this._saveEvent,{detail:{id:e,definition:this._buildDefinition()},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent(this._cancelEvent,{bubbles:!0,composed:!0}))}render(){let e=this.existingId?this._editTitleTemplate().replace("{name}",this._initialLabel()??this.existingId):this._addTitle();return d`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <div class="field">
          <label for="label">${l(this.hass,"ui.name","Name")}</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput}
            placeholder=${this._namePlaceholder()} />
        </div>
        ${this._renderFields()}
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>${l(this.hass,"ui.cancel","Cancel")}</button>
          <button @click=${this._onSave}>${l(this.hass,"ui.save","Save")}</button>
        </div>
      </div>
    `}};u([m({attribute:!1})],se.prototype,"hass",2),u([m({attribute:!1})],se.prototype,"existingId",2),u([m({attribute:!1})],se.prototype,"takenIds",2),u([g()],se.prototype,"_label",2),u([g()],se.prototype,"_error",2);var rt=class extends se{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this._def=this.initial}connectedCallback(){super.connectedCallback(),this._def=this.initial}get _saveEvent(){return"period-save"}get _cancelEvent(){return"period-cancel"}_addTitle(){return l(this.hass,"ui.period_modal_add_title","Add custom period")}_editTitleTemplate(){return l(this.hass,"ui.period_modal_edit_title",'Edit "{name}"')}_namePlaceholder(){return l(this.hass,"ui.name_placeholder","e.g. Wind down")}_initialLabel(){return this.initial.label}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_renderFields(){return d`
      <div class="row">
        <label style="min-width: 3em;">${l(this.hass,"ui.from_label","From")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
      </div>
      <div class="row">
        <label style="min-width: 3em;">${l(this.hass,"ui.to_label","To")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
      </div>
    `}_validateDef(){return""}_buildDefinition(){return{from:this._def.from,to:this._def.to,label:this._label.trim()||null}}};rt.styles=[ei,y`
      .row { display: flex; align-items: center; gap: 0.5rem; }
    `],u([m({attribute:!1})],rt.prototype,"initial",2),u([g()],rt.prototype,"_def",2),rt=u([w("ambience-period-edit-modal")],rt);function Ko(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=ke(n,t.anchor);if(t.offset_min===0)return e;let i=Math.abs(t.offset_min),r=i%60===0?`${i/60}${l(n,"ui.unit_hour_abbr","h")}`:`${i}${l(n,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${r}`}var nr=class extends he{_list(){return xi(this.hass)}async _save(n,e){await Vn(this.hass,n,e)}_label(n,e){return Ee(this.hass,n,e)}_formatDef(n){return`${Ko(n.from,this.hass)} \u2192 ${Ko(n.to,this.hass)}`}_headingKey(){return["ui.periods_heading","Periods"]}_addKey(){return["ui.add_custom_period","+ Add custom period"]}_renderModal(){let n=this._modal;return n.mode==="edit"?d`<ambience-period-edit-modal
        .hass=${this.hass}
        .existingId=${n.id}
        .initial=${n.initial}
        .takenIds=${this._takenIds()}
        @period-save=${this._onModalSave}
        @period-cancel=${this._onModalCancel}
      ></ambience-period-edit-modal>`:n.mode==="add"?d`<ambience-period-edit-modal
        .hass=${this.hass}
        .takenIds=${this._takenIds()}
        @period-save=${this._onModalSave}
        @period-cancel=${this._onModalCancel}
      ></ambience-period-edit-modal>`:d``}};nr=u([w("ambience-time-of-day-config")],nr);var Ie=class extends se{constructor(){super(...arguments);this.initial={min:0,max:100,label:null};this._min=null;this._max=null}connectedCallback(){super.connectedCallback(),this._min=this.initial.min??null,this._max=this.initial.max??null}get _saveEvent(){return"lux-range-save"}get _cancelEvent(){return"lux-range-cancel"}_addTitle(){return l(this.hass,"ui.lux_modal_add_title","Add custom lux range")}_editTitleTemplate(){return l(this.hass,"ui.lux_modal_edit_title",'Edit "{name}"')}_namePlaceholder(){return l(this.hass,"ui.lux_name_placeholder","e.g. Gloomy")}_initialLabel(){return this.initial.label}_onMinInput(e){let i=e.target.value;this._min=i===""?null:Number(i)}_onMaxInput(e){let i=e.target.value;this._max=i===""?null:Number(i)}_renderFields(){return d`
      <div class="row">
        <div class="field">
          <label for="min">${l(this.hass,"ui.lux_min_label","Min (lx)")}</label>
          <input id="min" type="number" min="0" step="1" .value=${this._min==null?"":String(this._min)}
            @input=${this._onMinInput} placeholder=${l(this.hass,"ui.lux_min_placeholder","0")} />
        </div>
        <div class="field">
          <label for="max">${l(this.hass,"ui.lux_max_label","Max (lx)")}</label>
          <input id="max" type="number" min="0" step="1" .value=${this._max==null?"":String(this._max)}
            @input=${this._onMaxInput} placeholder=${l(this.hass,"ui.lux_max_placeholder","\u221E")} />
        </div>
      </div>
    `}_validateDef(){return this._min==null&&this._max==null?l(this.hass,"ui.lux_error_need_bound","Enter a min, a max, or both."):this._min!=null&&this._min<0||this._max!=null&&this._max<0?l(this.hass,"ui.lux_error_negative","Bounds must be 0 or greater."):this._min!=null&&this._max!=null&&this._min>=this._max?l(this.hass,"ui.lux_error_order","Min must be less than max."):""}_buildDefinition(){let e={label:this._label.trim()||null};return this._min!=null&&(e.min=this._min),this._max!=null&&(e.max=this._max),e}};Ie.styles=[ei,y`
      .row { display: flex; gap: 1rem; }
      .row .field { flex: 1; }
    `],u([m({attribute:!1})],Ie.prototype,"initial",2),u([g()],Ie.prototype,"_min",2),u([g()],Ie.prototype,"_max",2),Ie=u([w("ambience-lux-edit-modal")],Ie);var sr=class extends he{_list(){return $i(this.hass)}async _save(n,e){await qn(this.hass,n,e)}_label(n,e){return lt(this.hass,n,e)}_formatDef(n){return Lr(n.min,n.max,"any")}_headingKey(){return["ui.lux_heading","Lux ranges"]}_addKey(){return["ui.add_custom_lux_range","+ Add custom lux range"]}_renderModal(){let n=this._modal;return n.mode==="edit"?d`<ambience-lux-edit-modal
        .hass=${this.hass}
        .existingId=${n.id}
        .initial=${n.initial}
        .takenIds=${this._takenIds()}
        @lux-range-save=${this._onModalSave}
        @lux-range-cancel=${this._onModalCancel}
      ></ambience-lux-edit-modal>`:n.mode==="add"?d`<ambience-lux-edit-modal
        .hass=${this.hass}
        .takenIds=${this._takenIds()}
        @lux-range-save=${this._onModalSave}
        @lux-range-cancel=${this._onModalCancel}
      ></ambience-lux-edit-modal>`:d``}};sr=u([w("ambience-lux-config")],sr);var Fe=class extends b{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._error=""}async connectedCallback(){super.connectedCallback(),ee(this);try{this._config=await Ht(this.hass)}catch(e){this._error=C(this.hass,e)}}async _save(e){this._config=e;try{await Kn(this.hass,e.workday_sensor,e.workday_calendar),this._error=""}catch(i){this._error=C(this.hass,i);return}window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=this._error?d`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:"";return d`
      ${e}
      <div class="row">
        <label>${l(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        ${Jt(this.hass,"workday_sensor",this._config.workday_sensor,{entity:{integration:"workday",domain:"binary_sensor"}},"binary_sensor.workday",i=>this._onSensorChange({detail:{value:i}}))}
      </div>
      <div class="row">
        <label>${l(this.hass,"ui.workday_calendar","Workday calendar")}</label>
        ${Jt(this.hass,"workday_calendar",this._config.workday_calendar,{entity:{integration:"workday",domain:"calendar"}},"calendar.workday",i=>this._onCalendarChange({detail:{value:i}}))}
      </div>
    `}};Fe.styles=y`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
  `,u([m({attribute:!1})],Fe.prototype,"hass",2),u([g()],Fe.prototype,"_config",2),u([g()],Fe.prototype,"_error",2),Fe=u([w("ambience-day-config")],Fe);var Qc=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],Me=class extends b{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._expanded=new Set}async connectedCallback(){super.connectedCallback(),ee(this),this._config=await Ot(this.hass)}async _persist(){await Gn(this.hass,this._config.entity,this._config.groups),window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onEntityChange(e){this._config={...this._config,entity:e.detail.value||null},this._persist()}_nextGroupId(e){let i=new Set(e.map(r=>r.id));for(let r=1;r<=e.length+1;r++){let s=`group_${r}`;if(!i.has(s))return s}return`group_${e.length+1}`}_addGroup(){let e=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:e,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,e]),this._persist()}_toggleExpand(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}_updateGroup(e,i){this._config={...this._config,groups:this._config.groups.map((r,s)=>s===e?{...r,...i}:r)},this._persist()}_removeGroup(e){let i=this._config.groups[e];if(this._config={...this._config,groups:this._config.groups.filter((r,s)=>s!==e)},i){let r=new Set(this._expanded);r.delete(i.id),this._expanded=r}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:Qc.map(e=>({value:e,label:ct(this.hass,e)}))}}}]}_renderConditions(e,i){if(customElements.get("ha-form"))return d`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:i.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation(),this._updateGroup(e,{conditions:s.detail.value.conditions??[]})}}
      ></ha-form>`;let r=i.conditions.map(s=>ct(this.hass,s));return d`<span class="conditions-list">${r.join(", ")}</span>`}_renderGroup(e,i){let r=this._expanded.has(i.id),s=i.conditions.map(o=>ct(this.hass,o)).join(", ");return d`
      <div class="group">
        <div class="group-header" @click=${()=>this._toggleExpand(i.id)}>
          <span class="chevron ${r?"open":""}">▶</span>
          <span class="label">${i.label}</span>
          <span class="codes">${s}</span>
          <button
            class="icon"
            title=${l(this.hass,"ui.title_delete","Delete")}
            @click=${o=>{o.stopPropagation(),this._removeGroup(e)}}
          >✕</button>
        </div>
        ${r?d`<div class="body" @click=${o=>o.stopPropagation()}>
              <input
                .value=${i.label}
                aria-label=${i.label}
                @change=${o=>this._updateGroup(e,{label:o.target.value})}
              />
              ${this._renderConditions(e,i)}
            </div>`:""}
      </div>
    `}render(){return d`
      <div class="row">
        <label class="section">${l(this.hass,"ui.weather_entity","Weather entity")}</label>
        ${Jt(this.hass,"entity",this._config.entity,{entity:{domain:"weather"}},"weather.home",e=>this._onEntityChange({detail:{value:e}}))}
      </div>

      <h4>${l(this.hass,"ui.groups","Groups")}</h4>
      ${this._config.groups.map((e,i)=>this._renderGroup(i,e))}
      <button class="add" @click=${()=>this._addGroup()}>
        ${l(this.hass,"ui.add_group","+ Add group")}
      </button>
    `}};Me.styles=y`
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
  `,u([m({attribute:!1})],Me.prototype,"hass",2),u([g()],Me.prototype,"_config",2),u([g()],Me.prototype,"_expanded",2),Me=u([w("ambience-weather-config")],Me);var Go={time_of_day:t=>d`<ambience-time-of-day-config .hass=${t}></ambience-time-of-day-config>`,lux:t=>d`<ambience-lux-config .hass=${t}></ambience-lux-config>`,day:t=>d`<ambience-day-config .hass=${t}></ambience-day-config>`,weather:t=>d`<ambience-weather-config .hass=${t}></ambience-weather-config>`},Jc=new Set(Object.keys(Go)),je=class extends b{constructor(){super(...arguments);this._conditions=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._conditions=await wi(this.hass)}catch(e){this._error=C(this.hass,e)}}render(){let e=this._conditions.filter(i=>Jc.has(i.name)).slice().sort((i,r)=>r.priority-i.priority);return d`
      <div class="tab-heading">
        <span>${l(this.hass,"ui.settings_tab_conditions","Conditions")}</span>
        <ambience-help .hass=${this.hass} .text=${l(this.hass,"ui.help_conditions_tab","Conditions are the inputs scenes match on (time of day, presence, weather, \u2026). A scene wins when all its conditions pass.")}></ambience-help>
      </div>
      ${this._error?d`<p class="error">${this._error}</p>`:""}
      ${e.map(i=>d`
        <ambience-condition-card .hass=${this.hass} .conditionName=${i.name} .conditionDescription=${i.description}>
          ${Go[i.name]?.(this.hass)??d``}
        </ambience-condition-card>
      `)}
    `}};je.styles=y`
    :host { display: block; }
    .error { color: var(--error-color, #d32f2f); }
    .tab-heading {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }
  `,u([m({attribute:!1})],je.prototype,"hass",2),u([g()],je.prototype,"_conditions",2),u([g()],je.prototype,"_error",2),je=u([w("ambience-conditions-settings")],je);var A=class extends b{constructor(){super(...arguments);this._actions=[];this._services=[];this._schemas={};this._fieldSchemas={};this._addSchema=[];this._serviceById=new Map;this._availableServices=[];this._expanded=new Set;this._adding=!1;this._loadError=null;this._saveError=null;this._loaded=!1;this._editingDefault=null;this._editingOriginalValue=void 0;this._editingOriginalHad=!1;this._drag=new ft(this,(e,i)=>{let r=[...this._actions],[s]=r.splice(e,1);r.splice(i,0,s),this._actions=r,this._autoSave()});this._onDocPointerDown=e=>{if(!this._adding&&this._editingDefault===null)return;let i=e.composedPath(),r=i.some(s=>s instanceof Element&&A._OVERLAY_TAG_RE.test(s.localName));this._collapseAddFormOnClickAway(i,r),this._cancelEditingDefaultOnClickAway(i,r)}}_collapseAddFormOnClickAway(e,i){if(!this._adding)return;let r=this.shadowRoot?.querySelector(".add-row");!(!!r&&e.includes(r))&&!i&&(this._adding=!1)}_cancelEditingDefaultOnClickAway(e,i){if(this._editingDefault===null)return;let r=this.shadowRoot?.querySelector(`.field-row-editor[data-editing-key="${this._editingDefault}"]`);(!r||!e.includes(r))&&!i&&this._cancelEditingDefault()}connectedCallback(){super.connectedCallback(),document.addEventListener("pointerdown",this._onDocPointerDown),customElements.get("ha-service-picker")||customElements.whenDefined("ha-service-picker").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._onDocPointerDown)}_startEditingDefault(e,i){let s=this._actions.find(o=>o.id===e)?.defaults??{};this._editingOriginalHad=i in s,this._editingOriginalValue=s[i],this._editingDefault=`${e}:${i}`}_saveEditingDefault(){this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1,this._autoSave()}_cancelEditingDefault(){let e=this._editingDefault;if(e){let i=e.indexOf(":"),r=e.slice(0,i),s=e.slice(i+1);this._actions=this._actions.map(o=>{if(o.id!==r)return o;let a={...o.defaults??{}};return this._editingOriginalHad?a[s]=this._editingOriginalValue:delete a[s],{...o,defaults:a}})}this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1}async firstUpdated(){await this._reload()}willUpdate(e){if(e.has("_actions")||e.has("_schemas")){let i={};for(let r of this._actions){let s=this._schemas[r.id];if(s)for(let[o,a]of Object.entries(s.fields))i[`${r.id}:${o}`]=[{name:o,selector:a.selector??{text:{}},required:!1}]}this._fieldSchemas=i}if(e.has("_services")&&(this._serviceById=new Map(this._services.map(i=>[i.id,i]))),e.has("_actions")||e.has("_services")){let i=new Set(this._actions.map(r=>r.id));this._availableServices=this._services.filter(r=>!i.has(r.id)),this._addSchema=[{name:"service",selector:{select:{options:this._availableServices.map(r=>({value:r.id,label:this._addOptionLabel(r.id)})),custom_value:!0,mode:"dropdown",sort:!0}}}]}}async _reload(){this._loadError=null;try{let[e,i]=await Promise.all([Dt(this.hass),Un(this.hass)]);this._actions=e,this._services=i}catch(e){this._loadError=e instanceof Error?e.message:String(e);return}await Promise.all(this._actions.map(e=>this._ensureSchema(e.id))),this._loaded=!0}async _ensureSchema(e){if(!(e in this._schemas))try{let i=await Ce(this.hass,e);this._schemas={...this._schemas,[e]:i}}catch{this._schemas={...this._schemas,[e]:null}}}_setShowInEditor(e,i,r){this._actions=this._actions.map(s=>{if(s.id!==e)return s;let o=new Set(s.visible_fields??[]);return r?o.add(i):o.delete(i),{...s,visible_fields:[...o]}}),this._autoSave()}_setDefault(e,i,r){this._actions=this._actions.map(s=>s.id!==e?s:{...s,defaults:{...s.defaults??{},[i]:r}})}_clearDefault(e,i){this._actions=this._actions.map(r=>{if(r.id!==e)return r;let s={...r.defaults??{}};return delete s[i],{...r,defaults:s}})}_setLabel(e,i){this._actions=this._actions.map(r=>r.id===e?{...r,label:i}:r)}_toggleExpand(e){this._expanded.has(e)?this._expanded=new Set:(this._expanded=new Set([e]),this._ensureSchema(e))}async _addService(e){if(e&&this._services.some(i=>i.id===e)){if(this._actions.some(i=>i.id===e)){this._expanded=new Set([e]),this._adding=!1;return}await this._ensureSchema(e),this._actions=[...this._actions,{id:e,label:this._labelForService(e),visible_fields:[],defaults:{}}],this._expanded=new Set([e]),this._adding=!1,this._autoSave()}}_removeService(e){this._actions=this._actions.filter(r=>r.id!==e);let i=new Set(this._expanded);i.delete(e),this._expanded=i,this._autoSave()}async _autoSave(){this._saveError=null;try{await zn(this.hass,this._actions),window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"))}catch(e){this._saveError=e instanceof Error?e.message:String(e)}}render(){return this._loadError!==null?d`
        <div class="error">${this._loadError}</div>
        <button @click=${()=>this._reload()}>${l(this.hass,"ui.retry","Retry")}</button>
      `:this._loaded?d`
      <section>
        <div class="section-heading">
          <span>${l(this.hass,"ui.settings_tab_actions","Actions")}</span>
          <ambience-help .hass=${this.hass} .text=${l(this.hass,"ui.help_actions_tab","Actions are the service calls a scene runs. Define them here so scenes can reuse them.")}></ambience-help>
        </div>
        ${this._saveError?d`<div class="error">${this._saveError}</div>`:""}
        ${this._actions.map((e,i)=>this._renderCard(e,i))}
        ${this._renderAdd()}
      </section>
    `:d`<div>${l(this.hass,"ui.loading","Loading\u2026")}</div>`}_renderCard(e,i){let r=this._schemas[e.id],s=this._expanded.has(e.id);return d`
      <div
        class="card ${this._drag.over===i?"drag-over":""} ${this._drag.from===i?"dragging":""}"
        data-card
        data-service=${e.id}
        data-drag-index=${i}
      >
        <div
          class="card-header"
          data-toggle
          @click=${o=>{o.target.closest("ha-input, input, button.remove, .drag-handle")||this._toggleExpand(e.id)}}
        >
          <span
            class="drag-handle"
            data-drag-handle
            title=${l(this.hass,"ui.drag_to_reorder","Drag to reorder")}
            @pointerdown=${o=>this._drag.start(i,o)}
            @click=${o=>o.stopPropagation()}
          >⠿</span>
          <span class="toggle-arrow">${s?"\u25BE":"\u25B8"}</span>
          ${s?d`
                <strong>${e.id}</strong>
                <ha-input
                  class="header-label-input"
                  data-label-input
                  placeholder=${l(this.hass,"ui.action_label_placeholder","Label (optional)")}
                  .value=${e.label}
                  @input=${o=>{o.stopPropagation(),this._setLabel(e.id,o.target.value)}}
                  @blur=${()=>void this._autoSave()}
                  @click=${o=>o.stopPropagation()}
                ></ha-input>
              `:e.label?d`
                  <span class="header-label-display">${e.label}</span>
                  <span class="header-service-id">(${e.id})</span>
                `:d`<strong class="standalone">${e.id}</strong>`}
          <button
            class="remove"
            data-remove
            title=${l(this.hass,"ui.remove","Remove")}
            @click=${o=>{o.stopPropagation(),this._removeService(e.id)}}
          >✖</button>
        </div>
        ${s?this._renderBody(e,r):""}
      </div>
    `}_renderBody(e,i){return d`
      <div class="body">
        ${this._renderFieldsSection(e,i)}
      </div>
    `}_renderFieldsSection(e,i){if(i===null)return d`<p class="body-help warning">
        ${l(this.hass,"ui.service_unavailable","Service not available in this HA instance.")}
      </p>`;if(i===void 0)return d`<p class="body-help">${l(this.hass,"ui.loading","Loading\u2026")}</p>`;let r=Object.entries(i.fields).slice().sort(([s],[o])=>s.localeCompare(o));return r.length===0?d`<p class="body-help">
        ${l(this.hass,"ui.service_has_no_fields","This service has no fields.")}
      </p>`:d`
      <p class="body-help">
        ${l(this.hass,"ui.actions_field_help_show","Tick a checkbox to make a field editable per scene.")}
        <ambience-help .hass=${this.hass} .text=${l(this.hass,"ui.help_show_in_scene_editor","Show this field in the scene editor so each scene can set it. Leave off to send a fixed default instead.")}></ambience-help>
        ${l(this.hass,"ui.actions_field_help_default","Set a default to pre-fill it.")}
        <ambience-help .hass=${this.hass} .text=${l(this.hass,"ui.help_set_default","A value sent automatically when the action runs. Scenes can override it if the field is also shown in the editor.")}></ambience-help>
      </p>
      ${r.map(([s,o])=>this._renderFieldRow(e,s,o))}
    `}_formatDefaultSummary(e){return e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}_defaultUnitSuffix(e,i){let r=this._schemas[e]?.fields?.[i];if(!r||typeof r!="object")return"";let s=Mi(r.selector);return s?` ${s}`:""}_renderFieldRow(e,i,r){let s=(e.visible_fields??[]).includes(i),o=i in(e.defaults??{}),a=`${e.id}:${i}`,c=this._editingDefault===a;return d`
      <div class="field-row">
        <!-- Row 1: [checkbox] [name] [default summary] -->
        <div class="field-row-main">
          <div class="checkbox-cell">
            <input
              type="checkbox"
              data-show-in-editor=${i}
              title=${l(this.hass,"ui.show_in_scene_editor","Show in scene editor")}
              .checked=${s}
              @change=${h=>this._setShowInEditor(e.id,i,h.target.checked)}
            />
          </div>
          <span class="name">
            ${r.name||F(i)}
            ${r.name?d` <small class="field-id">(${i})</small>`:""}
            ${r.description?d` <small>— ${r.description}</small>`:""}
          </span>
          <div class="summary-cell">
            ${c?d`<span class="summary-cell-editing">${l(this.hass,"ui.editing","Editing\u2026")}</span>`:o?d`<button
                    class="default-summary"
                    data-default-summary=${i}
                    @click=${h=>{h.stopPropagation(),this._startEditingDefault(e.id,i)}}
                  >${l(this.hass,"ui.default_prefix","Default: ")}${this._formatDefaultSummary(e.defaults?.[i])}${this._defaultUnitSuffix(e.id,i)}</button>`:d`<button
                    class="set-default-btn"
                    data-set-default=${i}
                    @click=${h=>{h.stopPropagation(),this._startEditingDefault(e.id,i)}}
                  >+ ${l(this.hass,"ui.set_default","Set default")}</button>`}
          </div>
        </div>
        <!-- Row 2: full editor (only when editing) -->
        ${c?d`<div
              class="field-row-editor"
              data-editing-key=${a}
            >
              <div class="editor-line">
                <div class="default-editor">${this._renderDefaultEditor(e,i,r)}</div>
                <button
                  class="clear-default"
                  data-clear-default=${i}
                  title=${l(this.hass,"ui.clear_default","Clear default")}
                  @click=${h=>{h.stopPropagation(),this._clearDefault(e.id,i),this._saveEditingDefault()}}
                >✕</button>
              </div>
              <div class="editor-actions">
                <button
                  class="cancel-default"
                  data-cancel-default=${i}
                  @click=${h=>{h.stopPropagation(),this._cancelEditingDefault()}}
                >${l(this.hass,"ui.cancel","Cancel")}</button>
                <button
                  class="save-default"
                  data-save-default=${i}
                  @click=${h=>{h.stopPropagation(),this._saveEditingDefault()}}
                >${l(this.hass,"ui.save","Save")}</button>
              </div>
            </div>`:""}
      </div>
    `}_renderDefaultEditor(e,i,r){let s=e.defaults?.[i],o=this._fieldSchemas[`${e.id}:${i}`]??[];return customElements.get("ha-form")?d`<ha-form
        .hass=${this.hass}
        .schema=${o}
        .data=${{[i]:s??""}}
        .computeLabel=${()=>""}
        @value-changed=${a=>{a.stopPropagation(),this._setDefault(e.id,i,a.detail.value[i])}}
      ></ha-form>`:d`<input
      data-default-value=${i}
      .value=${s==null?"":String(s)}
      @input=${a=>this._setDefault(e.id,i,a.target.value)}
    />`}_renderAdd(){return this._adding?d`<div class="add-row">
      ${this._renderAddPicker()}
      <button data-action="cancel-add" @click=${()=>{this._adding=!1}}>
        ${l(this.hass,"ui.cancel","Cancel")}
      </button>
    </div>`:d`<div class="add-row">
        <button class="add" data-action="add" @click=${()=>{this._adding=!0}}>
          + ${l(this.hass,"ui.add_action_button","Add action")}
        </button>
      </div>`}_labelForService(e){return this._serviceById.get(e)?.name?.trim()||hi(e)}_addOptionLabel(e){return`${this._labelForService(e)} (${e})`}_renderAddPicker(){return customElements.get("ha-service-picker")?d`<ha-service-picker
        class="add-picker"
        data-add-service-picker
        .hass=${this.hass}
        @value-changed=${e=>{e.stopPropagation();let i=e.detail.value;i&&this._addService(i)}}
      ></ha-service-picker>`:customElements.get("ha-form")?d`<ha-form
        class="add-picker"
        data-add-service-form
        .hass=${this.hass}
        .schema=${this._addSchema}
        .data=${{service:""}}
        .computeLabel=${()=>l(this.hass,"ui.pick_service","Pick a service")}
        @value-changed=${e=>{e.stopPropagation();let i=e.detail.value.service;i&&this._addService(i)}}
      ></ha-form>`:d`<select
      data-add-service
      @change=${e=>this._addService(e.target.value)}
    >
      <option value="">— ${l(this.hass,"ui.pick_service","Pick a service")} —</option>
      ${this._availableServices.map(e=>d`<option value=${e.id}>${this._addOptionLabel(e.id)}</option>`)}
    </select>`}};A.styles=y`
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
  `,A._OVERLAY_TAG_RE=/vaadin|combo-box|overlay|listbox|menu|mwc-|md-/i,u([m({attribute:!1})],A.prototype,"hass",2),u([g()],A.prototype,"_actions",2),u([g()],A.prototype,"_services",2),u([g()],A.prototype,"_schemas",2),u([g()],A.prototype,"_fieldSchemas",2),u([g()],A.prototype,"_addSchema",2),u([g()],A.prototype,"_expanded",2),u([g()],A.prototype,"_adding",2),u([g()],A.prototype,"_loadError",2),u([g()],A.prototype,"_saveError",2),u([g()],A.prototype,"_loaded",2),u([g()],A.prototype,"_editingDefault",2),u([g()],A.prototype,"_editingOriginalValue",2),u([g()],A.prototype,"_editingOriginalHad",2),A=u([w("ambience-actions-settings")],A);var ze=class extends b{constructor(){super(...arguments);this._tab="categories"}willUpdate(e){e.has("initialTab")&&this.initialTab&&(this._tab=this.initialTab)}render(){return d`
      <nav>
        <button class=${this._tab==="categories"?"active":""} @click=${()=>{this._tab="categories"}}>
          <ha-icon icon="mdi:shape-outline"></ha-icon>${l(this.hass,"ui.settings_tab_categories","Categories")}
        </button>
        <button class=${this._tab==="conditions"?"active":""} @click=${()=>{this._tab="conditions"}}>
          <ha-icon icon="mdi:filter-variant"></ha-icon>${l(this.hass,"ui.settings_tab_conditions","Conditions")}
        </button>
        <button class=${this._tab==="actions"?"active":""} @click=${()=>{this._tab="actions"}}>
          <ha-icon icon="mdi:flash"></ha-icon>${l(this.hass,"ui.settings_tab_actions","Actions")}
        </button>
        <button class=${this._tab==="ambience"?"active":""} @click=${()=>{this._tab="ambience"}}>
          <ha-icon icon="mdi:home-lightbulb"></ha-icon>${l(this.hass,"ui.settings_tab_ambience","Advanced")}
        </button>
      </nav>
      <div class="content">
        ${this._tab==="categories"?d`<ambience-categories-settings .hass=${this.hass}></ambience-categories-settings>`:this._tab==="conditions"?d`<ambience-conditions-settings .hass=${this.hass}></ambience-conditions-settings>`:this._tab==="actions"?d`<ambience-actions-settings .hass=${this.hass}></ambience-actions-settings>`:d`<ambience-ambience-settings .hass=${this.hass}></ambience-ambience-settings>`}
      </div>
    `}};ze.styles=y`
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
  `,u([m({attribute:!1})],ze.prototype,"hass",2),u([m({attribute:!1})],ze.prototype,"initialTab",2),u([g()],ze.prototype,"_tab",2),ze=u([w("ambience-settings-view")],ze);var Ue=class extends b{constructor(){super();this.open=!1;new Oe(this,()=>this._close())}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?d`
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        @click=${e=>e.stopPropagation()}
      >
        <div class="header">
          <h3>${l(this.hass,"ui.tab_settings","Settings")}</h3>
          <button class="close" @click=${this._close} aria-label=${l(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          <ambience-settings-view
            .hass=${this.hass}
            .initialTab=${this.initialTab}
          ></ambience-settings-view>
        </div>
      </div>
    `:$}};Ue.styles=y`
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
  `,u([m({attribute:!1})],Ue.prototype,"hass",2),u([m({type:Boolean,reflect:!0})],Ue.prototype,"open",2),u([m({attribute:!1})],Ue.prototype,"initialTab",2),Ue=u([w("ambience-settings-modal")],Ue);var nt=class extends b{constructor(){super(...arguments);this._settingsOpen=!1;this._filterCategory=_i();this._onOpenSettings=e=>{let i=e.detail?.tab;this._settingsTab=i,this._settingsOpen=!0};this._onFilterChanged=e=>{this._filterCategory=e.detail?.category??"",e.stopPropagation()}}static{this.styles=y`
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
  `}connectedCallback(){super.connectedCallback(),ee(this),this.addEventListener("ambience-open-settings",this._onOpenSettings),this.addEventListener("ambience-filter-changed",this._onFilterChanged)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("ambience-open-settings",this._onOpenSettings),this.removeEventListener("ambience-filter-changed",this._onFilterChanged)}render(){let e={dark:!!this.hass.themes?.darkMode,title:l(this.hass,"ui.panel_title","Ambience")};return d`
      <header>
        <div class="bar">
          <h1 class="brand">
            ${xn(e)}
            ${$n(e)}
          </h1>
          <ambience-category-filter .hass=${this.hass}></ambience-category-filter>
          <button
            class="settings-btn"
            @click=${()=>{this._settingsTab=void 0,this._settingsOpen=!0}}
            aria-label=${l(this.hass,"ui.tab_settings","Settings")}
            title=${l(this.hass,"ui.tab_settings","Settings")}
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
    `}};u([m({attribute:!1})],nt.prototype,"hass",2),u([g()],nt.prototype,"_settingsOpen",2),u([g()],nt.prototype,"_settingsTab",2),u([g()],nt.prototype,"_filterCategory",2);_n("ambience-frontend",nt);export{nt as AmbienceFrontend};
