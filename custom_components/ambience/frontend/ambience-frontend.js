/* Ambience — bundled output. Do not edit by hand. */
var Ta=Object.defineProperty;var Aa=Object.getOwnPropertyDescriptor;var c=(t,r,e,i)=>{for(var n=i>1?void 0:i?Aa(r,e):r,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(i?o(r,e,n):o(n))||n);return i&&n&&Ta(r,e,n),n};var ui=globalThis,hi=ui.ShadowRoot&&(ui.ShadyCSS===void 0||ui.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,br=Symbol(),bn=new WeakMap,At=class{constructor(r,e,i){if(this._$cssResult$=!0,i!==br)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(hi&&r===void 0){let i=e!==void 0&&e.length===1;i&&(r=bn.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),i&&bn.set(e,r))}return r}toString(){return this.cssText}},wn=t=>new At(typeof t=="string"?t:t+"",void 0,br),y=(t,...r)=>{let e=t.length===1?t[0]:r.reduce((i,n,s)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[s+1],t[0]);return new At(e,t,br)},xn=(t,r)=>{if(hi)t.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let i=document.createElement("style"),n=ui.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=e.cssText,t.appendChild(i)}},wr=hi?t=>t:t=>t instanceof CSSStyleSheet?(r=>{let e="";for(let i of r.cssRules)e+=i.cssText;return wn(e)})(t):t;var{is:Pa,defineProperty:Ra,getOwnPropertyDescriptor:Da,getOwnPropertyNames:Ha,getOwnPropertySymbols:Na,getPrototypeOf:Ia}=Object,pi=globalThis,$n=pi.trustedTypes,Oa=$n?$n.emptyScript:"",Fa=pi.reactiveElementPolyfillSupport,Pt=(t,r)=>t,Rt={toAttribute(t,r){switch(r){case Boolean:t=t?Oa:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,r){let e=t;switch(r){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},mi=(t,r)=>!Pa(t,r),kn={attribute:!0,type:String,converter:Rt,reflect:!1,useDefault:!1,hasChanged:mi};Symbol.metadata??=Symbol("metadata"),pi.litPropertyMetadata??=new WeakMap;var be=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=kn){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let i=Symbol(),n=this.getPropertyDescriptor(r,i,e);n!==void 0&&Ra(this.prototype,r,n)}}static getPropertyDescriptor(r,e,i){let{get:n,set:s}=Da(this.prototype,r)??{get(){return this[e]},set(o){this[e]=o}};return{get:n,set(o){let l=n?.call(this);s?.call(this,o),this.requestUpdate(r,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??kn}static _$Ei(){if(this.hasOwnProperty(Pt("elementProperties")))return;let r=Ia(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(Pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Pt("properties"))){let e=this.properties,i=[...Ha(e),...Na(e)];for(let n of i)this.createProperty(n,e[n])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[i,n]of e)this.elementProperties.set(i,n)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let n=this._$Eu(e,i);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let i=new Set(r.flat(1/0).reverse());for(let n of i)e.unshift(wr(n))}else r!==void 0&&e.push(wr(r));return e}static _$Eu(r,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(r.set(i,this[i]),delete this[i]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xn(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,i){this._$AK(r,i)}_$ET(r,e){let i=this.constructor.elementProperties.get(r),n=this.constructor._$Eu(r,i);if(n!==void 0&&i.reflect===!0){let s=(i.converter?.toAttribute!==void 0?i.converter:Rt).toAttribute(e,i.type);this._$Em=r,s==null?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(r,e){let i=this.constructor,n=i._$Eh.get(r);if(n!==void 0&&this._$Em!==n){let s=i.getPropertyOptions(n),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Rt;this._$Em=n;let l=o.fromAttribute(e,s.type);this[n]=l??this._$Ej?.get(n)??l,this._$Em=null}}requestUpdate(r,e,i,n=!1,s){if(r!==void 0){let o=this.constructor;if(n===!1&&(s=this[r]),i??=o.getPropertyOptions(r),!((i.hasChanged??mi)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(r)&&!this.hasAttribute(o._$Eu(r,i))))return;this.C(r,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:i,reflect:n,wrapped:s},o){i&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,o??e??this[r]),s!==!0||o!==void 0)||(this._$AL.has(r)||(this.hasUpdated||i||(e=void 0),this._$AL.set(r,e)),n===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,s]of this._$Ep)this[n]=s;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[n,s]of i){let{wrapped:o}=s,l=this[n];o!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,s,l)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw r=!1,this._$EM(),i}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};be.elementStyles=[],be.shadowRootOptions={mode:"open"},be[Pt("elementProperties")]=new Map,be[Pt("finalized")]=new Map,Fa?.({ReactiveElement:be}),(pi.reactiveElementVersions??=[]).push("2.1.2");var $r=globalThis,Cn=t=>t,fi=$r.trustedTypes,En=fi?fi.createPolicy("lit-html",{createHTML:t=>t}):void 0,kr="$lit$",we=`lit$${Math.random().toFixed(9).slice(2)}$`,Cr="?"+we,Ma=`<${Cr}>`,et=document,Ht=()=>et.createComment(""),Nt=t=>t===null||typeof t!="object"&&typeof t!="function",Er=Array.isArray,Rn=t=>Er(t)||typeof t?.[Symbol.iterator]=="function",xr=`[ 	
\f\r]`,Dt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Sn=/-->/g,Ln=/>/g,Xe=RegExp(`>|${xr}(?:([^\\s"'>=/]+)(${xr}*=${xr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Tn=/'/g,An=/"/g,Dn=/^(?:script|style|textarea|title)$/i,Sr=t=>(r,...e)=>({_$litType$:t,strings:r,values:e}),d=Sr(1),Bu=Sr(2),qu=Sr(3),X=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Pn=new WeakMap,Ze=et.createTreeWalker(et,129);function Hn(t,r){if(!Er(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return En!==void 0?En.createHTML(r):r}var Nn=(t,r)=>{let e=t.length-1,i=[],n,s=r===2?"<svg>":r===3?"<math>":"",o=Dt;for(let l=0;l<e;l++){let u=t[l],h,p,f=-1,_=0;for(;_<u.length&&(o.lastIndex=_,p=o.exec(u),p!==null);)_=o.lastIndex,o===Dt?p[1]==="!--"?o=Sn:p[1]!==void 0?o=Ln:p[2]!==void 0?(Dn.test(p[2])&&(n=RegExp("</"+p[2],"g")),o=Xe):p[3]!==void 0&&(o=Xe):o===Xe?p[0]===">"?(o=n??Dt,f=-1):p[1]===void 0?f=-2:(f=o.lastIndex-p[2].length,h=p[1],o=p[3]===void 0?Xe:p[3]==='"'?An:Tn):o===An||o===Tn?o=Xe:o===Sn||o===Ln?o=Dt:(o=Xe,n=void 0);let v=o===Xe&&t[l+1].startsWith("/>")?" ":"";s+=o===Dt?u+Ma:f>=0?(i.push(h),u.slice(0,f)+kr+u.slice(f)+we+v):u+we+(f===-2?l:v)}return[Hn(t,s+(t[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),i]},It=class t{constructor({strings:r,_$litType$:e},i){let n;this.parts=[];let s=0,o=0,l=r.length-1,u=this.parts,[h,p]=Nn(r,e);if(this.el=t.createElement(h,i),Ze.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(n=Ze.nextNode())!==null&&u.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(let f of n.getAttributeNames())if(f.endsWith(kr)){let _=p[o++],v=n.getAttribute(f).split(we),x=/([.?@])?(.*)/.exec(_);u.push({type:1,index:s,name:x[2],strings:v,ctor:x[1]==="."?_i:x[1]==="?"?vi:x[1]==="@"?yi:it}),n.removeAttribute(f)}else f.startsWith(we)&&(u.push({type:6,index:s}),n.removeAttribute(f));if(Dn.test(n.tagName)){let f=n.textContent.split(we),_=f.length-1;if(_>0){n.textContent=fi?fi.emptyScript:"";for(let v=0;v<_;v++)n.append(f[v],Ht()),Ze.nextNode(),u.push({type:2,index:++s});n.append(f[_],Ht())}}}else if(n.nodeType===8)if(n.data===Cr)u.push({type:2,index:s});else{let f=-1;for(;(f=n.data.indexOf(we,f+1))!==-1;)u.push({type:7,index:s}),f+=we.length-1}s++}}static createElement(r,e){let i=et.createElement("template");return i.innerHTML=r,i}};function tt(t,r,e=t,i){if(r===X)return r;let n=i!==void 0?e._$Co?.[i]:e._$Cl,s=Nt(r)?void 0:r._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),s===void 0?n=void 0:(n=new s(t),n._$AT(t,e,i)),i!==void 0?(e._$Co??=[])[i]=n:e._$Cl=n),n!==void 0&&(r=tt(t,n._$AS(t,r.values),n,i)),r}var gi=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:i}=this._$AD,n=(r?.creationScope??et).importNode(e,!0);Ze.currentNode=n;let s=Ze.nextNode(),o=0,l=0,u=i[0];for(;u!==void 0;){if(o===u.index){let h;u.type===2?h=new ht(s,s.nextSibling,this,r):u.type===1?h=new u.ctor(s,u.name,u.strings,this,r):u.type===6&&(h=new bi(s,this,r)),this._$AV.push(h),u=i[++l]}o!==u?.index&&(s=Ze.nextNode(),o++)}return Ze.currentNode=et,n}p(r){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(r,i,e),e+=i.strings.length-2):i._$AI(r[e])),e++}},ht=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,i,n){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=tt(this,r,e),Nt(r)?r===$||r==null||r===""?(this._$AH!==$&&this._$AR(),this._$AH=$):r!==this._$AH&&r!==X&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Rn(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==$&&Nt(this._$AH)?this._$AA.nextSibling.data=r:this.T(et.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:i}=r,n=typeof i=="number"?this._$AC(r):(i.el===void 0&&(i.el=It.createElement(Hn(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{let s=new gi(n,this),o=s.u(this.options);s.p(e),this.T(o),this._$AH=s}}_$AC(r){let e=Pn.get(r.strings);return e===void 0&&Pn.set(r.strings,e=new It(r)),e}k(r){Er(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,n=0;for(let s of r)n===e.length?e.push(i=new t(this.O(Ht()),this.O(Ht()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let i=Cn(r).nextSibling;Cn(r).remove(),r=i}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},it=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,i,n,s){this.type=1,this._$AH=$,this._$AN=void 0,this.element=r,this.name=e,this._$AM=n,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=$}_$AI(r,e=this,i,n){let s=this.strings,o=!1;if(s===void 0)r=tt(this,r,e,0),o=!Nt(r)||r!==this._$AH&&r!==X,o&&(this._$AH=r);else{let l=r,u,h;for(r=s[0],u=0;u<s.length-1;u++)h=tt(this,l[i+u],e,u),h===X&&(h=this._$AH[u]),o||=!Nt(h)||h!==this._$AH[u],h===$?r=$:r!==$&&(r+=(h??"")+s[u+1]),this._$AH[u]=h}o&&!n&&this.j(r)}j(r){r===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},_i=class extends it{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===$?void 0:r}},vi=class extends it{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==$)}},yi=class extends it{constructor(r,e,i,n,s){super(r,e,i,n,s),this.type=5}_$AI(r,e=this){if((r=tt(this,r,e,0)??$)===X)return;let i=this._$AH,n=r===$&&i!==$||r.capture!==i.capture||r.once!==i.once||r.passive!==i.passive,s=r!==$&&(i===$||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},bi=class{constructor(r,e,i){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(r){tt(this,r)}},In={M:kr,P:we,A:Cr,C:1,L:Nn,R:gi,D:Rn,V:tt,I:ht,H:it,N:vi,U:yi,B:_i,F:bi},ja=$r.litHtmlPolyfillSupport;ja?.(It,ht),($r.litHtmlVersions??=[]).push("3.3.2");var On=(t,r,e)=>{let i=e?.renderBefore??r,n=i._$litPart$;if(n===void 0){let s=e?.renderBefore??null;i._$litPart$=n=new ht(r.insertBefore(Ht(),s),s,void 0,e??{})}return n._$AI(t),n};var Lr=globalThis,b=class extends be{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=On(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return X}};b._$litElement$=!0,b.finalized=!0,Lr.litElementHydrateSupport?.({LitElement:b});var za=Lr.litElementPolyfillSupport;za?.({LitElement:b});(Lr.litElementVersions??=[]).push("4.2.2");var w=t=>(r,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(t,r)}):customElements.define(t,r)};var Ua={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:mi},Wa=(t=Ua,r,e)=>{let{kind:i,metadata:n}=e,s=globalThis.litPropertyMetadata.get(n);if(s===void 0&&globalThis.litPropertyMetadata.set(n,s=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(e.name,t),i==="accessor"){let{name:o}=e;return{set(l){let u=r.get.call(this);r.set.call(this,l),this.requestUpdate(o,u,t,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,t,l),l}}}if(i==="setter"){let{name:o}=e;return function(l){let u=this[o];r.call(this,l),this.requestUpdate(o,u,t,!0,l)}}throw Error("Unsupported decorator location: "+i)};function m(t){return(r,e)=>typeof e=="object"?Wa(t,r,e):((i,n,s)=>{let o=n.hasOwnProperty(s);return n.constructor.createProperty(s,i),o?Object.getOwnPropertyDescriptor(n,s):void 0})(t,r,e)}function g(t){return m({...t,state:!0,attribute:!1})}function Fn(t,r){try{customElements.define(t,r)}catch{}}var Ba=["ha-input","ha-textfield","ha-form"],qa=["ha-input","ha-textfield"];function Mn(){for(let t of qa)if(customElements.get(t))return t;return null}function re(t){let r=new WeakRef(t);for(let e of Ba)customElements.get(e)||customElements.whenDefined(e).then(()=>r.deref()?.requestUpdate())}var Ot={en:{time_of_day_period:{dawn:"Dawn",morning:"Morning",afternoon:"Afternoon",evening:"Evening",nighttime:"Nighttime",daytime:"Daytime"},weekday:{mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",sun:"Sun"},day_item:{weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"},lux_range:{dark:"Dark",dim:"Dim",normal:"Normal",bright:"Bright",very_bright:"Very bright"},category_color:{red:"Red",pink:"Pink",purple:"Purple","deep-purple":"Deep purple",indigo:"Indigo",blue:"Blue","light-blue":"Light blue",cyan:"Cyan",teal:"Teal",green:"Green","light-green":"Light green",lime:"Lime",yellow:"Yellow",amber:"Amber",orange:"Orange","deep-orange":"Deep orange",brown:"Brown",grey:"Grey","blue-grey":"Blue grey"},condition:{time_of_day:"Time of day",state:"Entity state",script:"Script",sun:"Sun",template:"Template",lux:"Lux",unavailable:"Unavailable"},action:{},anchor:{dawn:"Dawn",sunrise:"Sunrise",noon:"Noon",sunset:"Sunset",dusk:"Dusk",midnight:"Midnight"},ui:{panel_title:"Ambience",card_load_failed:"Ambience card failed to load \u2014 check the connection and refresh.",tab_settings:"Settings",settings_tab_ambience:"Advanced",settings_tab_conditions:"Conditions",settings_tab_actions:"Actions",settings_tab_import:"AI",import_intro:"Download your AI bundle, give it to an AI with the Ambience skill, then paste the block it returns below.",import_download_bundle:"Download AI bundle",import_placeholder:"Paste the YAML or JSON import block here",import_preview:"Preview",import_target:"Target",import_new_category:"New category to create",import_unknown_categories:"Unknown categories (create them first)",import_adds:"Add",import_updates:"Update",import_removes:"Remove",import_confirm:"Import",import_done:"Imported successfully.",settings_ambience_field_name:"Switch name",settings_ambience_field_pause:"Pause for",settings_reapply_enable_label:"Re-run all scenes after inactivity",settings_reapply_interval_label:"Re-run after",apply_on_every_match:"Apply on every match",help_apply_on_every_match:"When on, Ambience re-applies this scene's actions every time it wins its scope/category, not just the first time it becomes the active scene.",unit_minutes:"minutes",help:"Help",help_switch_name:"The name used for the per-scope pause switch entities.",help_pause_for:"When a scope's switch is turned off, auto-resume after this many minutes. 0 = stays paused until turned back on.",help_reapply_toggle:"Re-run the scenes for a scope/category after inactivity and re-apply the winning scene, in case any action had previously failed, such as a light not turning off.",help_reapply_after:"Re-run scenes that haven't been updated for this many minutes.",settings_expose_group:"Expose to voice assistants",settings_expose_assist:"Assist",settings_expose_google:"Google Assistant",settings_expose_alexa:"Alexa",help_expose:"Expose the per-scope pause switches to the selected voice assistants so you can pause/resume Ambience by voice. Google Assistant and Alexa require Home Assistant Cloud or a manual setup.",help_actions_tab:"Actions are the service calls a scene runs. Define them here so scenes can reuse them.",help_show_in_scene_editor:"Show this field in the scene editor so each scene can set it. Leave off to send a fixed default instead.",help_set_default:"A value sent automatically when the action runs. Scenes can override it if the field is also shown in the editor.",help_conditions_tab:"Conditions are the inputs scenes match on (time of day, presence, weather, \u2026). A scene wins when all its conditions pass.",help_categories_tab:"Categories let one scope have several independent winners at once \u2014 one scene wins per category.",no_areas:"No areas found in Home Assistant.",not_configured:"not configured",scene_singular:"scene",scene_plural:"scenes",all_categories:"All categories",add_category:"Add category\u2026",loading:"Loading\u2026",any_placeholder:"(any)",include:"Include",exclude:"Exclude",empty_all_days:"(empty \u2192 all days)",add_include_item:"+ Add include item",add_exclude_item:"+ Add exclude item",from:"from",to:"to",remove:"Remove",day_of_month_placeholder:"e.g. 1-10, 15",workday_sensor:"Workday sensor",workday_calendar:"Workday calendar",periods_heading:"Periods",badge_builtin:"builtin",badge_custom:"custom",add_custom_period:"+ Add custom period",lux_heading:"Lux ranges",add_custom_lux_range:"+ Add custom lux range",lux_modal_add_title:"Add custom lux range",lux_modal_edit_title:'Edit "{name}"',lux_min_label:"Min (lx)",lux_max_label:"Max (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"is",occupancy_is_not:"is not",lux_any:"Any of",lux_all:"All of",lux_is:"is",lux_is_not:"is not",title_edit:"Edit",title_delete:"Delete",new_scene:"New scene",new_scene_default:"New scene",name_optional:"Name (optional)",category:"Category",scope:"Scope",when_heading:"When",actions_heading:"Actions",target:"Target",remove_action:"Remove action",add_action:"+ Add action\u2026",remove_condition:"Remove condition",add_condition:"+ Add condition\u2026",add_description:"+ Add description",description:"Description",add_action_button:"Add action",cancel:"Cancel",save:"Save",save_scene:"Save scene",at_least_one_target:"At least one target is required.",condition_error:"Fix the error in this condition before continuing",no_scenes_yet:"No scenes yet.",add_scene:"+ Add scene",summary_any:"any",summary_any_paren:"(any)",summary_always:"Always",no_targets:"(no targets)",target_noun:"target",action_singular:"action",action_plural:"actions",scene_n:"Scene {n}",drag_to_reorder:"Drag to reorder",unpin:"Unpin (return to automatic order)",enable_scene:"Enable scene",disable_scene:"Disable scene",shadowed:"Never fires \u2014 shadowed by an earlier scene.",problem_missing:"Missing or disabled in Home Assistant:",problem_overlap:"Controlled by multiple groups:",problem_config:"Configuration problems:",problems_count:"{n} scene(s) have problems",badge_needs_workday_sensor:"needs a workday sensor",badge_needs_workday_calendar:"needs a workday calendar",badge_needs_weather_entity:"needs a weather entity",badge_missing_weather_group:"missing weather group {id}",badge_missing_period:"missing period {id}",badge_missing_lux_range:"missing lux range {id}",badge_unexposed_action:"action {id} not exposed",edit:"Edit",duplicate:"Duplicate",run_actions:"Run actions",run:"Run",auto_triggers_section:"Auto-triggers",auto_triggers_none:"No automatic triggers.",auto_triggers_opaque_note:"A script scene is opaque \u2014 some watches may be missing. Declare them in the scene's Triggers field.",auto_trigger_group_time:"Time",auto_trigger_group_sun:"Sun",auto_trigger_date_rollover:"Local midnight (date rollover)",auto_trigger_periodic:"periodic re-check",more_actions:"More actions",scene_actions:"Scene actions",error_enter_name:"Please enter a name.",error_start_letter:"Name must start with a letter.",error_name_exists:"An entry with this name already exists. Choose a different name.",period_modal_add_title:"Add custom period",period_modal_edit_title:'Edit "{name}"',name:"Name",name_placeholder:"e.g. Wind down",lux_name_placeholder:"e.g. Gloomy",lux_error_need_bound:"Enter a min, a max, or both.",lux_error_negative:"Bounds must be 0 or greater.",lux_error_order:"Min must be less than max.",from_label:"From",to_label:"To",any_time:"Any time",custom_range:"Custom range",custom_suffix:" (custom)",add_time_range:"+ add another time range",endpoint_time:"Time",endpoint_sun:"Sun",offset_placeholder:"Offset",clamp_none:"\u2014",clamp_not_before:"not before",clamp_not_after:"not after",unit_hour:"hour",unit_hours:"hours",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"No matching entities in this area.",field_kind:"Kind",field_days_of_month:"Days of month",field_month:"Month",field_day:"Day",field_from_month:"From month",field_from_day:"From day",field_to_month:"To month",field_to_day:"To day",day_spec_error:"Use days 1\u201331 and ranges like 1-10, separated by commas",title_override:"Override",thresholds:"Thresholds",add_threshold:"+ Add threshold",weather_entity:"Weather entity",groups:"Groups",add_group:"+ Add group",sun:{elevation:"Elevation",azimuth:"Azimuth",any:"Any",above:"Above",below:"Below",between:"Between",custom_range:"Custom range"},arguments:"Arguments",form:"Form",script:"Script",yaml:"YAML",settings_tab_categories:"Categories",category_add:"+ Add category",category_name_placeholder:"Category name",category_icon:"Icon",category_color:"Colour",category_name_blank_error:"Category names can't be empty.",category_name_duplicate_error:"Two categories can't have the same name.",category_delete_blocked_last:"You can't delete the last category.",category_delete_blocked_in_use:"This category still has scenes \u2014 move or delete them first.",category_edit_title:"Edit category",category_add_title:"Add category",category_color_none:"No colour",category_save:"Save",view_traces:"View traces",pause_scope:"Pause this scope",resume_scope:"Resume now",close:"Close",pick_service:"Pick a service",retry:"Retry",action_label_placeholder:"Label (optional)",action_no_parameters:"This action has no configurable fields.",actions_field_help_show:"Tick a checkbox to make a field editable per scene.",actions_field_help_default:"Set a default to pre-fill it.",clear_default:"Clear default",set_default:"Set default",default_prefix:"Default: ",editing:"Editing\u2026",show_in_scene_editor:"Show in scene editor",extra_fields_prefix:"Extra fields:",extra_fields_hint:"These fields aren't currently exposed but will still be sent.",service_has_no_fields:"This service has no fields.",service_unavailable:"Service not available in this HA instance.",action_unavailable:"Action no longer available; configure it in Settings \u2192 Actions or remove this action.",raw_config_action:"Action",raw_config_targets:"Targets",raw_config_params:"Parameters",occupancy_any:"Any of",occupancy_all:"All of",occupancy_detected:"Detected",occupancy_clear:"Clear",occupancy_for:"for",day_pick_weekday:"Pick at least one day of the week.",state_sentinel:"State",invalid_datetime:"Enter a valid date and time.",simulate_title:"Simulate",simulate_when_hint:"drives sun, time-of-day, weekday & workday",simulate_inputs_heading:"Inputs this category depends on",simulate_button:"Simulate",reset_to_now:"Reset to now",reset_to_live:"Reset to live",true_label:"True",false_label:"False",for_at_least:"at least",for_less_than:"less than",for_label:"For",duration_held_hint:"How long it has held this state (h:m:s)",away:"Away",home:"Home",refresh:"Refresh",new_traces_refresh:"New traces \u2014 refresh",clear_traces:"Clear",download_diagnostics:"Download diagnostics",no_traces_yet:"No traces for this category yet.",yaml_expect_object:"Expected an object",yaml_script_string:"`script` must be a 'script.<name>' string",yaml_args_object:"`args` must be an object if present",yaml_triggers_list:"`triggers` must be a list of entity_id strings if present",template_result:"Result",template_truthy:"true \u2014 matches",template_falsy:"false \u2014 no match",conditions_hint_body:"Configure Workday and Weather in Conditions to use them in your scene conditions.",conditions_hint_body_weather:"Configure Weather in Conditions to use it in your scene conditions.",conditions_hint_body_workday:"Configure Workday in Conditions to use it in your scene conditions.",conditions_hint_cta:"Configure conditions",conditions_hint_title:"Optional: set up Workday & Weather",conditions_hint_title_weather:"Optional: set up Weather",conditions_hint_title_workday:"Optional: set up Workday",dismiss:"Dismiss",fado_notice_title:"Recommended: install Fado Light Fader",fado_notice_body:"Fado adds smooth light fading for brightness, color, and color temperature \u2014 with automatic brightness restoration, UI autoconfiguration, and native transitions. It's a Home Assistant default HACS integration.",fado_notice_cta:"Install via HACS",for_prefix:"for",name_duplicate:"A scene with this name already exists in this category.",no_exposed_actions:"Add services in Settings \u2192 Actions.",people_for:"for",people_is_at:"Is at",people_is_at_static:"is at",people_is_not_at:"Is not at",people_mode_all:"All of:",people_mode_any:"Any of:",people_mode_anybody:"Anybody",people_mode_everybody:"Everybody",people_mode_nobody:"Nobody",people_mode_none:"None of:",people_none_tracked:"No people tracked",people_select_one:"Select at least one person",unavailable_select_one:"Select at least one entity",people_where_home:"Home",scope_house:"House",history_nothing_to_undo:"Nothing to undo",history_nothing_to_redo:"Nothing to redo",history_undo_tooltip:"Undo: {change}",history_redo_tooltip:"Redo: {change}",history_untitled:"Untitled",history_action_add:'Added scene "{scene}" in {scope}',history_action_edit:'Edited scene "{scene}" in {scope}',history_action_delete:'Deleted scene "{scene}" in {scope}',history_action_reorder:"Reordered scenes in {scope}",history_action_unpin:'Unpinned scene "{scene}" in {scope}',history_action_toggle:'Toggled scene "{scene}" in {scope}',history_conflict_body:"Another tab changed the scenes in this scope while you were editing.",history_conflict_overwrite:"Overwrite theirs",history_conflict_load:"Load theirs",script_triggers:"Triggers",script_triggers_help:"Re-evaluate this scene when these entities change. A script is opaque, so templated references may be missed \u2014 add any it depends on.",script_triggers_none:"No triggers",simulate:"Simulate",state_add_condition:"Add clause",state_add_first:"Add clause",state_add_value:"+ Add state",state_attribute_placeholder:"leave blank to compare state",state_entity:"Entity",state_err_entity:"Entity is required",state_err_incomplete:"This condition is incomplete",state_err_numeric:"Value must be a number",state_err_state:"State is required",state_err_value:"Value is required",state_for:"For (optional)",state_new_condition:"(new condition)",state_not_toggle:"Negate (NOT)",state_op_header:"Comparison",state_unwrap_group:"Remove these parens (promote children to parent)",state_value_label:"Value",state_where:"Where",state_wrap:"Wrap in group",state_wrap_group:"Wrap these clauses in parentheses",show_more_info:"Show more info",cause_has_time:"Periodic time check",cause_switch:"Switch turned on",cause_manual:"Manual apply",cause_startup:"Startup",cause_reloaded:"Reloaded",cause_simulated:"Simulation",cause_clock:"Time of day",cause_sun:"Sun position",cause_reapply:"Re-run",cause_duration_for:"for",outcome_label_acted:"applied",outcome_label_no_op:"blocked",outcome_label_debounced:"unchanged",outcome_label_no_match:"no match",outcome_label_skipped:"skipped",count_action_one:"{n} action",count_action_other:"{n} actions",count_entity_one:"{n} entity",count_entity_other:"{n} entities",winner_default:"The matching scene",outcome_summary_acted_all_skipped:"{winner} matched \u2014 {skipped_phrase} skipped (not exposed); nothing applied.",outcome_summary_acted_entities:"Applied {winner} \u2014 {acts} on {entities}.{tail}",outcome_summary_acted:"Applied {winner} \u2014 {acts}.{tail}",outcome_summary_skipped_tail:" ({skipped} skipped \u2014 not exposed)",outcome_summary_no_op:"{winner} matched but has no actions \u2014 it blocks lower scenes from applying. Nothing changed.",outcome_summary_debounced:"{winner} matched, but it's already applied \u2014 nothing was re-sent.",outcome_summary_no_match:"No scene matched \u2014 nothing applied.",outcome_summary_skipped_switch_off:"Skipped \u2014 the scope's pause switch is off.",outcome_summary_skipped_scope_disabled:"Skipped \u2014 the scope is disabled.",outcome_summary_skipped_unavailable:"Skipped \u2014 the triggering entity went unavailable; devices left as they are.",section_scene_evaluation:"Scene evaluation",section_actions_taken:"Actions taken",trigger_prefix:"Trigger: ",trace_won_prefix:"Won: ",skipped_not_exposed:" \u2014 skipped (not exposed)",trace_scene_prefix:"Scene #",trace_scene_disabled:"disabled",trace_scene_not_reached:"not reached",trace_scene_matched:"\u2713 matched",trace_scene_no_match:"\u2717 no match",scene_live:"Live now \u2014 this scene currently matches and is applied",scene_applied_stale:"Still applied \u2014 this scene's actions are in effect but it no longer matches"},blocker_summary:{block:"Block",block_mid:"block",until:"until",while:"while",while_lead:"While",or:"or",and:"and",always:"always"},day_summary:{any:"any",any_day:"any day",except:"except",day_prefix:"day",last_day:"last day",workday:"workday",holiday:"holiday",first_workday:"first workday",last_workday:"last workday"},month:{1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"},weather_condition:{"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"},weather_attr:{temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"},state_op:{is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"}},es:{time_of_day_period:{dawn:"Amanecer",morning:"Ma\xF1ana",afternoon:"Tarde",evening:"Atardecer",nighttime:"Noche",daytime:"D\xEDa"},weekday:{mon:"Lun",tue:"Mar",wed:"Mi\xE9",thu:"Jue",fri:"Vie",sat:"S\xE1b",sun:"Dom"},day_item:{weekday:"D\xEDa de la semana",day_of_month:"D\xEDa del mes",date:"Fecha (anual)",date_range:"Rango de fechas (anual)",last_day:"\xDAltimo d\xEDa del mes",workday:"D\xEDa laborable",holiday:"Festivo",first_workday:"Primer d\xEDa laborable del mes",last_workday:"\xDAltimo d\xEDa laborable del mes"},lux_range:{dark:"Oscuro",dim:"Tenue",normal:"Normal",bright:"Brillante",very_bright:"Muy brillante"},category_color:{red:"Rojo",pink:"Rosa",purple:"Morado","deep-purple":"Morado oscuro",indigo:"\xCDndigo",blue:"Azul","light-blue":"Azul claro",cyan:"Cian",teal:"Verde azulado",green:"Verde","light-green":"Verde claro",lime:"Lima",yellow:"Amarillo",amber:"\xC1mbar",orange:"Naranja","deep-orange":"Naranja oscuro",brown:"Marr\xF3n",grey:"Gris","blue-grey":"Gris azulado"},condition:{time_of_day:"Hora del d\xEDa",state:"Estado de entidad",script:"Script",sun:"Sol",template:"Plantilla",lux:"Lux",unavailable:"No disponible"},action:{},anchor:{dawn:"Amanecer",sunrise:"Salida del sol",noon:"Mediod\xEDa",sunset:"Puesta del sol",dusk:"Crep\xFAsculo",midnight:"Medianoche"},ui:{panel_title:"Ambience",card_load_failed:"No se pudo cargar la tarjeta Ambience \u2014 comprueba la conexi\xF3n y actualiza.",tab_settings:"Ajustes",settings_tab_ambience:"Avanzado",settings_tab_conditions:"Condiciones",settings_tab_actions:"Acciones",settings_tab_import:"IA",import_intro:"Descarga tu paquete de IA, d\xE1selo a una IA con la skill de Ambience y luego pega aqu\xED el bloque que devuelva.",import_download_bundle:"Descargar paquete de IA",import_placeholder:"Pega aqu\xED el bloque de importaci\xF3n YAML o JSON",import_preview:"Vista previa",import_target:"Destino",import_new_category:"Nueva categor\xEDa a crear",import_unknown_categories:"Categor\xEDas desconocidas (cr\xE9alas primero)",import_adds:"A\xF1adir",import_updates:"Actualizar",import_removes:"Eliminar",import_confirm:"Importar",import_done:"Importado correctamente.",settings_ambience_field_name:"Nombre del interruptor",settings_ambience_field_pause:"Pausar durante",settings_reapply_enable_label:"Volver a ejecutar todas las escenas tras inactividad",settings_reapply_interval_label:"Volver a ejecutar despu\xE9s de",apply_on_every_match:"Aplicar en cada coincidencia",help_apply_on_every_match:"Cuando est\xE1 activado, Ambience vuelve a aplicar las acciones de esta escena cada vez que gana su \xE1mbito/categor\xEDa, no solo la primera vez que se activa.",unit_minutes:"minutos",help:"Ayuda",help_switch_name:"El nombre utilizado para las entidades de interruptor de pausa por \xE1mbito.",help_pause_for:"Cuando se apaga el interruptor de un \xE1mbito, se reanuda autom\xE1ticamente tras este n\xFAmero de minutos. 0 = permanece pausado hasta que se vuelva a encender.",help_reapply_toggle:"Vuelve a ejecutar las escenas de un \xE1mbito/categor\xEDa tras la inactividad y vuelve a aplicar la escena ganadora, por si alguna acci\xF3n hab\xEDa fallado anteriormente, como una luz que no se apag\xF3.",help_reapply_after:"Volver a ejecutar escenas que no se han actualizado durante este n\xFAmero de minutos.",settings_expose_group:"Exponer a asistentes de voz",settings_expose_assist:"Assist",settings_expose_google:"Google Assistant",settings_expose_alexa:"Alexa",help_expose:"Expone los interruptores de pausa por \xE1mbito a los asistentes de voz seleccionados para poder pausar/reanudar Ambience por voz. Google Assistant y Alexa requieren Home Assistant Cloud o una configuraci\xF3n manual.",help_actions_tab:"Las acciones son las llamadas de servicio que ejecuta una escena. Def\xEDnelas aqu\xED para que las escenas puedan reutilizarlas.",help_show_in_scene_editor:"Muestra este campo en el editor de escenas para que cada escena pueda configurarlo. Desact\xEDvalo para enviar un valor predeterminado fijo.",help_set_default:"Un valor enviado autom\xE1ticamente cuando se ejecuta la acci\xF3n. Las escenas pueden anularlo si el campo tambi\xE9n se muestra en el editor.",help_conditions_tab:"Las condiciones son las entradas con las que coinciden las escenas (hora del d\xEDa, presencia, tiempo, \u2026). Una escena gana cuando todas sus condiciones se cumplen.",help_categories_tab:"Las categor\xEDas permiten que un \xE1mbito tenga varios ganadores independientes a la vez: una escena gana por categor\xEDa.",no_areas:"No se encontraron \xE1reas en Home Assistant.",not_configured:"no configurado",scene_singular:"escena",scene_plural:"escenas",all_categories:"Todas las categor\xEDas",add_category:"A\xF1adir categor\xEDa\u2026",loading:"Cargando\u2026",any_placeholder:"(cualquiera)",include:"Incluir",exclude:"Excluir",empty_all_days:"(vac\xEDo \u2192 todos los d\xEDas)",add_include_item:"+ A\xF1adir elemento incluido",add_exclude_item:"+ A\xF1adir elemento excluido",from:"desde",to:"hasta",remove:"Eliminar",day_of_month_placeholder:"p. ej. 1-10, 15",workday_sensor:"Sensor de d\xEDas laborables",workday_calendar:"Calendario de d\xEDas laborables",periods_heading:"Per\xEDodos",badge_builtin:"integrado",badge_custom:"personalizado",add_custom_period:"+ A\xF1adir per\xEDodo personalizado",lux_heading:"Rangos de lux",add_custom_lux_range:"+ A\xF1adir rango de lux personalizado",lux_modal_add_title:"A\xF1adir rango de lux personalizado",lux_modal_edit_title:'Editar "{name}"',lux_min_label:"M\xEDn (lx)",lux_max_label:"M\xE1x (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"es",occupancy_is_not:"no es",lux_any:"Cualquiera de",lux_all:"Todos de",lux_is:"es",lux_is_not:"no es",title_edit:"Editar",title_delete:"Eliminar",new_scene:"Nueva escena",new_scene_default:"Nueva escena",name_optional:"Nombre (opcional)",category:"Categor\xEDa",scope:"\xC1mbito",when_heading:"Cu\xE1ndo",actions_heading:"Acciones",target:"Objetivo",remove_action:"Eliminar acci\xF3n",add_action:"+ A\xF1adir acci\xF3n\u2026",remove_condition:"Eliminar condici\xF3n",add_condition:"+ A\xF1adir condici\xF3n\u2026",add_description:"+ A\xF1adir descripci\xF3n",description:"Descripci\xF3n",add_action_button:"A\xF1adir acci\xF3n",cancel:"Cancelar",save:"Guardar",save_scene:"Guardar escena",at_least_one_target:"Se requiere al menos un objetivo.",condition_error:"Corrige el error en esta condici\xF3n antes de continuar",no_scenes_yet:"A\xFAn no hay escenas.",add_scene:"+ A\xF1adir escena",summary_any:"cualquiera",summary_any_paren:"(cualquiera)",summary_always:"Siempre",no_targets:"(sin objetivos)",target_noun:"objetivo",action_singular:"acci\xF3n",action_plural:"acciones",scene_n:"Escena {n}",drag_to_reorder:"Arrastrar para reordenar",unpin:"Desanclar (volver al orden autom\xE1tico)",enable_scene:"Activar escena",disable_scene:"Desactivar escena",shadowed:"Nunca se activa \u2014 eclipsada por una escena anterior.",problem_missing:"Faltante o deshabilitada en Home Assistant:",problem_overlap:"Controlado por varios grupos:",problem_config:"Problemas de configuraci\xF3n:",problems_count:"{n} escena(s) tienen problemas",badge_needs_workday_sensor:"necesita un sensor de d\xEDas laborables",badge_needs_workday_calendar:"necesita un calendario de d\xEDas laborables",badge_needs_weather_entity:"necesita una entidad meteorol\xF3gica",badge_missing_weather_group:"falta el grupo meteorol\xF3gico {id}",badge_missing_period:"falta el per\xEDodo {id}",badge_missing_lux_range:"falta el rango de lux {id}",badge_unexposed_action:"acci\xF3n {id} no expuesta",edit:"Editar",duplicate:"Duplicar",run_actions:"Ejecutar acciones",run:"Ejecutar",auto_triggers_section:"Disparadores autom\xE1ticos",auto_triggers_none:"Sin disparadores autom\xE1ticos.",auto_triggers_opaque_note:"Una escena de script es opaca \u2014 puede que falten algunas observaciones. Declara las que sean necesarias en el campo Disparadores de la escena.",auto_trigger_group_time:"Hora",auto_trigger_group_sun:"Sol",auto_trigger_date_rollover:"Medianoche local (cambio de fecha)",auto_trigger_periodic:"revisi\xF3n peri\xF3dica",more_actions:"M\xE1s acciones",scene_actions:"Acciones de la escena",error_enter_name:"Por favor, introduce un nombre.",error_start_letter:"El nombre debe comenzar con una letra.",error_name_exists:"Ya existe una entrada con este nombre. Elige un nombre diferente.",period_modal_add_title:"A\xF1adir per\xEDodo personalizado",period_modal_edit_title:'Editar "{name}"',name:"Nombre",name_placeholder:"p. ej. Descanso nocturno",lux_name_placeholder:"p. ej. Sombr\xEDo",lux_error_need_bound:"Introduce un m\xEDnimo, un m\xE1ximo o ambos.",lux_error_negative:"Los l\xEDmites deben ser 0 o mayores.",lux_error_order:"El m\xEDnimo debe ser menor que el m\xE1ximo.",from_label:"Desde",to_label:"Hasta",any_time:"Cualquier hora",custom_range:"Rango personalizado",custom_suffix:" (personalizado)",add_time_range:"+ a\xF1adir otro rango de tiempo",endpoint_time:"Hora",endpoint_sun:"Sol",offset_placeholder:"Desplazamiento",clamp_none:"\u2014",clamp_not_before:"no antes de",clamp_not_after:"no despu\xE9s de",unit_hour:"hora",unit_hours:"horas",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"No hay entidades coincidentes en esta \xE1rea.",field_kind:"Tipo",field_days_of_month:"D\xEDas del mes",field_month:"Mes",field_day:"D\xEDa",field_from_month:"Mes de inicio",field_from_day:"D\xEDa de inicio",field_to_month:"Mes de fin",field_to_day:"D\xEDa de fin",day_spec_error:"Usa d\xEDas del 1 al 31 y rangos como 1-10, separados por comas",title_override:"Anular",thresholds:"Umbrales",add_threshold:"+ A\xF1adir umbral",weather_entity:"Entidad meteorol\xF3gica",groups:"Grupos",add_group:"+ A\xF1adir grupo",sun:{elevation:"Elevaci\xF3n",azimuth:"Acimut",any:"Cualquiera",above:"Por encima",below:"Por debajo",between:"Entre",custom_range:"Rango personalizado"},arguments:"Argumentos",form:"Formulario",script:"Script",yaml:"YAML",settings_tab_categories:"Categor\xEDas",category_add:"+ A\xF1adir categor\xEDa",category_name_placeholder:"Nombre de categor\xEDa",category_icon:"Icono",category_color:"Color",category_name_blank_error:"Los nombres de categor\xEDa no pueden estar vac\xEDos.",category_name_duplicate_error:"Dos categor\xEDas no pueden tener el mismo nombre.",category_delete_blocked_last:"No puedes eliminar la \xFAltima categor\xEDa.",category_delete_blocked_in_use:"Esta categor\xEDa a\xFAn tiene escenas \u2014 mu\xE9velas o elim\xEDnalas primero.",category_edit_title:"Editar categor\xEDa",category_add_title:"A\xF1adir categor\xEDa",category_color_none:"Sin color",category_save:"Guardar",view_traces:"Ver trazas",pause_scope:"Pausar este \xE1mbito",resume_scope:"Reanudar ahora",close:"Cerrar",pick_service:"Seleccionar un servicio",retry:"Reintentar",action_label_placeholder:"Etiqueta (opcional)",action_no_parameters:"Esta acci\xF3n no tiene campos configurables.",actions_field_help_show:"Marca una casilla para hacer que un campo sea editable por escena.",actions_field_help_default:"Establece un valor predeterminado para rellenarlo previamente.",clear_default:"Borrar predeterminado",set_default:"Establecer predeterminado",default_prefix:"Predeterminado: ",editing:"Editando\u2026",show_in_scene_editor:"Mostrar en el editor de escenas",extra_fields_prefix:"Campos adicionales:",extra_fields_hint:"Estos campos no est\xE1n expuestos actualmente pero se enviar\xE1n igualmente.",service_has_no_fields:"Este servicio no tiene campos.",service_unavailable:"Servicio no disponible en esta instancia de HA.",action_unavailable:"La acci\xF3n ya no est\xE1 disponible; config\xFArala en Ajustes \u2192 Acciones o elimina esta acci\xF3n.",raw_config_action:"Acci\xF3n",raw_config_targets:"Objetivos",raw_config_params:"Par\xE1metros",occupancy_any:"Cualquiera de",occupancy_all:"Todos de",occupancy_detected:"Detectado",occupancy_clear:"Libre",occupancy_for:"durante",day_pick_weekday:"Selecciona al menos un d\xEDa de la semana.",state_sentinel:"Estado",invalid_datetime:"Introduce una fecha y hora v\xE1lidas.",simulate_title:"Simular",simulate_when_hint:"controla el sol, la hora del d\xEDa, el d\xEDa de la semana y los d\xEDas laborables",simulate_inputs_heading:"Entradas de las que depende esta categor\xEDa",simulate_button:"Simular",reset_to_now:"Restablecer a ahora",reset_to_live:"Restablecer a en vivo",true_label:"Verdadero",false_label:"Falso",for_at_least:"al menos",for_less_than:"menos de",for_label:"Durante",duration_held_hint:"Cu\xE1nto tiempo ha mantenido este estado (h:m:s)",away:"Fuera",home:"Casa",refresh:"Actualizar",new_traces_refresh:"Nuevas trazas \u2014 actualizar",clear_traces:"Borrar",download_diagnostics:"Descargar diagn\xF3sticos",no_traces_yet:"A\xFAn no hay trazas para esta categor\xEDa.",yaml_expect_object:"Se esperaba un objeto",yaml_script_string:"`script` debe ser una cadena 'script.<nombre>'",yaml_args_object:"`args` debe ser un objeto si est\xE1 presente",yaml_triggers_list:"`triggers` debe ser una lista de cadenas entity_id si est\xE1 presente",template_result:"Resultado",template_truthy:"verdadero \u2014 coincide",template_falsy:"falso \u2014 no coincide",conditions_hint_body:"Configura D\xEDas laborables y Tiempo en Condiciones para usarlos en las condiciones de tus escenas.",conditions_hint_body_weather:"Configura Tiempo en Condiciones para usarlo en las condiciones de tus escenas.",conditions_hint_body_workday:"Configura D\xEDas laborables en Condiciones para usarlos en las condiciones de tus escenas.",conditions_hint_cta:"Configurar condiciones",conditions_hint_title:"Opcional: configurar D\xEDas laborables y Tiempo",conditions_hint_title_weather:"Opcional: configurar Tiempo",conditions_hint_title_workday:"Opcional: configurar D\xEDas laborables",dismiss:"Descartar",fado_notice_title:"Recomendado: instalar Fado Light Fader",fado_notice_body:"Fado a\xF1ade atenuaci\xF3n suave de luces para brillo, color y temperatura de color, con restauraci\xF3n autom\xE1tica del brillo, autoconfiguraci\xF3n por interfaz y transiciones nativas. Es una integraci\xF3n HACS predeterminada de Home Assistant.",fado_notice_cta:"Instalar con HACS",for_prefix:"durante",name_duplicate:"Ya existe una escena con este nombre en esta categor\xEDa.",no_exposed_actions:"A\xF1ade servicios en Ajustes \u2192 Acciones.",people_for:"durante",people_is_at:"Est\xE1 en",people_is_at_static:"est\xE1 en",people_is_not_at:"No est\xE1 en",people_mode_all:"Todos:",people_mode_any:"Cualquiera de:",people_mode_anybody:"Cualquiera",people_mode_everybody:"Todos",people_mode_nobody:"Nadie",people_mode_none:"Ninguno de:",people_none_tracked:"No hay personas rastreadas",people_select_one:"Selecciona al menos una persona",unavailable_select_one:"Selecciona al menos una entidad",people_where_home:"Casa",scope_house:"Casa",history_nothing_to_undo:"Nada que deshacer",history_nothing_to_redo:"Nada que rehacer",history_undo_tooltip:"Deshacer: {change}",history_redo_tooltip:"Rehacer: {change}",history_untitled:"Sin t\xEDtulo",history_action_add:'Escena "{scene}" a\xF1adida en {scope}',history_action_edit:'Escena "{scene}" editada en {scope}',history_action_delete:'Escena "{scene}" eliminada en {scope}',history_action_reorder:"Escenas reordenadas en {scope}",history_action_unpin:'Escena "{scene}" desfijada en {scope}',history_action_toggle:'Escena "{scene}" activada/desactivada en {scope}',history_conflict_body:"Otra pesta\xF1a cambi\xF3 las escenas de este \xE1mbito mientras editabas.",history_conflict_overwrite:"Sobrescribir las suyas",history_conflict_load:"Cargar las suyas",script_triggers:"Disparadores",script_triggers_help:"Reeval\xFAa esta escena cuando cambien estas entidades. Un script es opaco, por lo que pueden perderse referencias en plantillas \u2014 a\xF1ade las que dependan de \xE9l.",script_triggers_none:"Sin disparadores",simulate:"Simular",state_add_condition:"A\xF1adir cl\xE1usula",state_add_first:"A\xF1adir cl\xE1usula",state_add_value:"+ A\xF1adir estado",state_attribute_placeholder:"dejar en blanco para comparar el estado",state_entity:"Entidad",state_err_entity:"La entidad es obligatoria",state_err_incomplete:"Esta condici\xF3n est\xE1 incompleta",state_err_numeric:"El valor debe ser un n\xFAmero",state_err_state:"El estado es obligatorio",state_err_value:"El valor es obligatorio",state_for:"Durante (opcional)",state_new_condition:"(nueva condici\xF3n)",state_not_toggle:"Negar (NO)",state_op_header:"Comparaci\xF3n",state_unwrap_group:"Eliminar estos par\xE9ntesis (promover hijos al padre)",state_value_label:"Valor",state_where:"Donde",state_wrap:"Envolver en grupo",state_wrap_group:"Envolver estas cl\xE1usulas entre par\xE9ntesis",show_more_info:"Mostrar m\xE1s informaci\xF3n",cause_has_time:"Comprobaci\xF3n peri\xF3dica de hora",cause_switch:"Interruptor activado",cause_manual:"Aplicaci\xF3n manual",cause_startup:"Inicio",cause_reloaded:"Recargado",cause_simulated:"Simulaci\xF3n",cause_clock:"Hora del d\xEDa",cause_sun:"Posici\xF3n del sol",cause_reapply:"Volver a ejecutar",cause_duration_for:"durante",outcome_label_acted:"aplicado",outcome_label_no_op:"bloqueado",outcome_label_debounced:"sin cambios",outcome_label_no_match:"sin coincidencia",outcome_label_skipped:"omitido",count_action_one:"{n} acci\xF3n",count_action_other:"{n} acciones",count_entity_one:"{n} entidad",count_entity_other:"{n} entidades",winner_default:"La escena coincidente",outcome_summary_acted_all_skipped:"{winner} coincidi\xF3 \u2014 {skipped_phrase} omitido (no expuesto); nada aplicado.",outcome_summary_acted_entities:"Aplicado {winner} \u2014 {acts} en {entities}.{tail}",outcome_summary_acted:"Aplicado {winner} \u2014 {acts}.{tail}",outcome_summary_skipped_tail:" ({skipped} omitidos \u2014 no expuestos)",outcome_summary_no_op:"{winner} coincidi\xF3 pero no tiene acciones \u2014 bloquea que se apliquen escenas inferiores. Nada cambi\xF3.",outcome_summary_debounced:"{winner} coincidi\xF3, pero ya est\xE1 aplicado \u2014 no se reenvi\xF3 nada.",outcome_summary_no_match:"Ninguna escena coincidi\xF3 \u2014 nada aplicado.",outcome_summary_skipped_switch_off:"Omitido \u2014 el interruptor de pausa del \xE1mbito est\xE1 apagado.",outcome_summary_skipped_scope_disabled:"Omitido \u2014 el \xE1mbito est\xE1 desactivado.",outcome_summary_skipped_unavailable:"Omitido \u2014 la entidad que dispar\xF3 qued\xF3 no disponible; los dispositivos se dejaron como estaban.",section_scene_evaluation:"Evaluaci\xF3n de escenas",section_actions_taken:"Acciones realizadas",trigger_prefix:"Disparador: ",trace_won_prefix:"Gan\xF3: ",skipped_not_exposed:" \u2014 omitido (no expuesto)",trace_scene_prefix:"Escena n.\xBA ",trace_scene_disabled:"desactivada",trace_scene_not_reached:"no alcanzada",trace_scene_matched:"\u2713 coincide",trace_scene_no_match:"\u2717 sin coincidencia",scene_live:"Activa ahora \u2014 esta escena coincide y est\xE1 aplicada",scene_applied_stale:"Sigue aplicada \u2014 las acciones de esta escena est\xE1n en efecto pero ya no coincide"},blocker_summary:{block:"Bloquear",block_mid:"bloquear",until:"hasta",while:"mientras",while_lead:"Mientras",or:"o",and:"y",always:"siempre"},day_summary:{any:"cualquiera",any_day:"cualquier d\xEDa",except:"excepto",day_prefix:"d\xEDa",last_day:"\xFAltimo d\xEDa",workday:"d\xEDa laborable",holiday:"festivo",first_workday:"primer d\xEDa laborable",last_workday:"\xFAltimo d\xEDa laborable"},month:{1:"Enero",2:"Febrero",3:"Marzo",4:"Abril",5:"Mayo",6:"Junio",7:"Julio",8:"Agosto",9:"Septiembre",10:"Octubre",11:"Noviembre",12:"Diciembre"},weather_condition:{"clear-night":"Despejado (noche)",cloudy:"Nublado",fog:"Niebla",hail:"Granizo",lightning:"Tormenta el\xE9ctrica","lightning-rainy":"Tormenta con lluvia",partlycloudy:"Parcialmente nublado",pouring:"Lluvia intensa",rainy:"Lluvioso",snowy:"Nevado","snowy-rainy":"Nieve con lluvia",sunny:"Soleado",windy:"Ventoso","windy-variant":"Ventoso (variante)",exceptional:"Excepcional"},weather_attr:{temperature:"Temperatura",apparent_temperature:"Temperatura aparente",humidity:"Humedad",wind_speed:"Velocidad del viento",pressure:"Presi\xF3n"},state_op:{is:"es",is_not:"no es",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"Y",or:"O",and_not:"Y NO",or_not:"O NO",not:"NO"}}},Dh=Ot.en;function Va(t){let r=t?.language?.toLowerCase().split(/[-_]/)[0];return r&&r in Ot?r:"en"}function jn(t,r){return r?t.replace(/\{(\w+)\}/g,(e,i)=>i in r?r[i]:e):t}function zn(t,r){let e=t;for(let i of r){if(e===null||typeof e!="object")return;e=e[i]}return typeof e=="string"?e:void 0}function Ka(t,r){let e="component.ambience.";if(!r.startsWith(e))return;let i=r.slice(e.length).split("."),n=Va(t),s=Ot[n];if(s){let o=zn(s,i);if(o!==void 0)return o}if(n!=="en"){let o=Ot.en;if(o)return zn(o,i)}}function Z(t,r,e,i){let n=i?Object.entries(i).flat():[],s=t?.localize?.(r,...n);if(s&&s!==r)return s;let o=Ka(t,r);return jn(o!==void 0?o:e,i)}function z(t){let r=t.replaceAll("_"," ").toLowerCase();return r.charAt(0).toUpperCase()+r.slice(1)}function Tr(t){return z(t)}function xi(t){let r=t.indexOf("."),e=r===-1?"":t.slice(0,r),n=(r===-1?t:t.slice(r+1)).replaceAll("_"," ").trim().toLowerCase(),s=e.replaceAll("_"," ").trim().toLowerCase(),o=n?n.split(" "):[],l=s?s.split(" "):[],u=l.length>0&&l.every(p=>o.includes(p)),h=!s||u?n:`${n} ${s}`;return h.charAt(0).toUpperCase()+h.slice(1)}function pt(t,r,e){let i=r?.find(n=>n.id===t);return i?.label?.trim()?i.label:e()}function Ga(t){return t.replace(/_/g," ").replace(/\bid\b/g,"ID").replace(/\bip\b/g,"IP").replace(/\bmac\b/g,"MAC").replace(/\bgps\b/g,"GPS").replace(/^\w/,r=>r.toUpperCase())}function $i(t,r,e){let i=t?.formatEntityAttributeName;if(i&&r){let n=i(r,e);if(n)return n}return Ga(e)}function Ae(t,r,e,i){if(!r)return i;let n=t;if(e){let s=n?.formatEntityAttributeValue;if(s){let o=s(r,e,i);if(o)return o}}else{let s=n?.formatEntityState;if(s){let o=s(r,i);if(o)return o}}return i}function G(t,r){return Z(t,`component.ambience.condition.${r}`,Tr(r))}function ki(t,r){return Z(t,`component.ambience.action.${r}`,Tr(r))}function Pe(t,r){return Z(t,`component.ambience.anchor.${r}`,Tr(r))}function de(t,r,e){let i=e[r]?.label;return i||Z(t,`component.ambience.time_of_day_period.${r}`,z(r))}function Re(t,r,e){let i=e[r]?.label;return i||Z(t,`component.ambience.lux_range.${r}`,z(r))}function Un(t,r,e){return Z(t,`component.ambience.category_color.${r}`,e)}function a(t,r,e,i){return Z(t,`component.ambience.${r}`,e,i)}var Ya=["mon","tue","wed","thu","fri","sat","sun"];function Ci(t,r){let e=Ya[r];return Z(t,`component.ambience.weekday.${e}`,e??String(r))}function Ei(t,r){return Z(t,`component.ambience.day_item.${r}`,z(r))}function mt(t,r){return Z(t,`component.ambience.month.${r}`,String(r))}function ft(t,r){return Z(t,`component.ambience.weather_condition.${r}`,z(r))}function Ft(t,r){return Z(t,`component.ambience.weather_attr.${r}`,z(r))}var Qa={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},Ja={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},Xa={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function Ar(t,r,e){if(r==="humidity")return"%";let i=Xa[r];if(i){let o=e?.attributes?.[i];if(typeof o=="string"&&o)return o}let n=Ja[r],s=t?.config?.unit_system;return n&&s&&typeof s[n]=="string"?s[n]:Qa[r]??""}function E(t,r){let e=r,i=e?.translation_key;if(i){let n=e?.translation_placeholders??{},s=Z(t,`component.ambience.exceptions.${i}`,"",n);if(s)return s}return e?.message?e.message:r instanceof Error?r.message:String(r)}function U(t,r){return Z(t,`component.ambience.state_op.${r}`,r)}var Za=import.meta.url.slice(0,import.meta.url.lastIndexOf("/")+1);function Wn(t){return Za+t}function Bn(t,r,e){let i=e.title??"Ambience",n=e.dark?`dark_${t}`:t,s=Wn(`${n}.png`),o=Wn(`${n}@2x.png`);return d`<img
    class=${r}
    src=${s}
    srcset="${s} 1x, ${o} 2x"
    alt=${i}
  />`}function qn(t={}){return Bn("logo","ambience-logo",t)}function Vn(t={}){return Bn("icon","ambience-icon",t)}var Kn="ambience-filter-category",Gn="ambience-expanded-scopes",Yn="ambience-collapsed-categories",Qn="ambience-conditions-hint-dismissed",Jn="ambience-fado-notice-dismissed";function Si(){try{return window.localStorage.getItem(Kn)??""}catch{return""}}function Xn(t){try{window.localStorage.setItem(Kn,t)}catch{}}function Zn(){try{let t=window.localStorage.getItem(Gn);if(!t)return[];let r=JSON.parse(t);return Array.isArray(r)?r.filter(e=>typeof e=="string"):[]}catch{return[]}}function es(t){try{window.localStorage.setItem(Gn,JSON.stringify(t))}catch{}}function ts(){try{let t=window.localStorage.getItem(Yn);if(!t)return[];let r=JSON.parse(t);return Array.isArray(r)?r.filter(e=>typeof e=="string"):[]}catch{return[]}}function is(t){try{window.localStorage.setItem(Yn,JSON.stringify(t))}catch{}}function rs(t,r){if(!r)return!1;try{return window.localStorage.getItem(t)===r}catch{return!1}}function ns(t,r){if(r)try{window.localStorage.setItem(t,r)}catch{}}function ss(t){return rs(Qn,t)}function os(t){ns(Qn,t)}function as(t){return rs(Jn,t)}function ls(t){ns(Jn,t)}async function ds(t){return t.callWS({type:"ambience/areas/list"})}async function Mt(t,r){return t.callWS({type:"ambience/area/get",area_id:r})}async function Pr(t,r,e,i){return t.callWS({type:"ambience/area/save",area_id:r,config:e,...i?{change:i}:{}})}async function cs(t){return t.callWS({type:"ambience/floors/list"})}async function jt(t,r){return t.callWS({type:"ambience/floor/get",floor_id:r})}async function Rr(t,r,e,i){return t.callWS({type:"ambience/floor/save",floor_id:r,config:e,...i?{change:i}:{}})}async function zt(t){return t.callWS({type:"ambience/house/get"})}async function Dr(t,r,e){return t.callWS({type:"ambience/house/save",config:r,...e?{change:e}:{}})}async function Li(t){return t.callWS({type:"ambience/conditions/list"})}async function Ti(t){return(await t.callWS({type:"ambience/install_id"})).install_id}async function us(t,r,e,i){let n={type:"ambience/auto_triggers/list",scope_kind:r};return e!=null&&(n.scope_id=e),i!=null&&(n.category=i),t.callWS(n)}async function Ut(t){return t.callWS({type:"ambience/exposed_actions/list"})}async function hs(t,r){return t.callWS({type:"ambience/exposed_actions/save",actions:r})}async function ps(t){return t.callWS({type:"ambience/services/list"})}async function De(t,r){return t.callWS({type:"ambience/services/get_schema",service:r})}function Hr(t){return t.kind==="area"?{area_id:t.id}:t.kind==="floor"?{floor_id:t.id}:{house:!0}}async function ms(t,r,e){let i={type:"ambience/apply",...Hr(r)};return e!==void 0&&(i.category_id=e),t.callWS(i)}async function fs(t,r,e){return t.callWS({type:"ambience/scene/run_actions",scene_index:e,...Hr(r)})}async function Ai(t){return t.callWS({type:"ambience/time_of_day_periods/list"})}async function gs(t,r,e){return t.callWS({type:"ambience/time_of_day_periods/save",custom:r,hidden:e})}async function Pi(t){return t.callWS({type:"ambience/lux_ranges/list"})}async function _s(t,r,e){return t.callWS({type:"ambience/lux_ranges/save",custom:r,hidden:e})}async function Wt(t){return t.callWS({type:"ambience/conditions/day/config/list"})}async function vs(t,r,e){return t.callWS({type:"ambience/conditions/day/config/save",workday_sensor:r,workday_calendar:e})}async function Bt(t){return t.callWS({type:"ambience/conditions/weather/config/list"})}async function ys(t,r,e){return t.callWS({type:"ambience/conditions/weather/config/save",entity:r,groups:e})}async function Nr(t,r){return t.callWS({type:"ambience/state/known_states",entity_id:r})}async function Ir(t,r,e){return t.callWS({type:"ambience/state/known_attribute_values",entity_id:r,attribute:e})}async function bs(t){return t.callWS({type:"ambience/switch_defaults/list"})}async function ws(t){return t.callWS({type:"ambience/switches/list"})}async function xs(t,r,e){return t.callWS({type:"ambience/set_scope_enabled",...Hr(r),enabled:e})}async function $s(t,r,e){return t.callWS({type:"ambience/switch_defaults/save",name:r,auto_on_delay_seconds:e})}async function ks(t){return t.callWS({type:"ambience/reapply/list"})}async function Cs(t,r,e){return t.callWS({type:"ambience/reapply/save",enabled:r,interval_seconds:e})}async function Es(t){return t.callWS({type:"ambience/exposed_assistants/list"})}async function Ss(t,r,e,i){return t.callWS({type:"ambience/exposed_assistants/save",expose_assist:r,expose_google:e,expose_alexa:i})}async function xe(t){return(await t.callWS({type:"ambience/categories/list"})).categories}async function Ri(t,r){await t.callWS({type:"ambience/categories/save",categories:r})}async function Ls(t,r){await t.callWS({type:"ambience/categories/delete",category_id:r})}async function Or(t){return(await t.callWS({type:"ambience/traces/list"})).traces}async function Ts(t){await t.callWS({type:"ambience/traces/clear"})}async function As(t,r){let e=t.connection;if(!e.subscribeMessage)return()=>{};try{return await e.subscribeMessage(r,{type:"ambience/live/subscribe"})}catch{return()=>{}}}async function Ps(t,r){let e=t.connection;if(!e.subscribeMessage)return()=>{};try{return await e.subscribeMessage(r,{type:"ambience/history/subscribe"})}catch{return()=>{}}}async function Rs(t){return t.callWS({type:"ambience/history/undo"})}async function Ds(t){return t.callWS({type:"ambience/history/redo"})}function Hs(t,r){let e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),i=URL.createObjectURL(e),n=document.createElement("a");n.href=i,n.download=r,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(i),1e4)}async function Ns(t,r,e){let i=await t.callWS({type:"ambience/diagnostics/scope",scope_kind:r.scope_kind,scope_id:r.scope_id,category:e});Hs(i,`ambience-${r.scope_kind}-${r.scope_id??"house"}-${e}.json`)}async function el(t){return t.callWS({type:"ambience/ai_bundle"})}async function Is(t){Hs(await el(t),"ambience-ai-bundle.json")}async function Os(t,r){await t.callWS({type:"ambience/validate",config:r})}async function Fs(t,r){return r.kind==="area"?Mt(t,r.id):r.kind==="floor"?jt(t,r.id):zt(t)}async function Ms(t,r,e,i){return r.kind==="area"?Pr(t,r.id,e,i):r.kind==="floor"?Rr(t,r.id,e,i):Dr(t,e,i)}async function js(t,r,e){return t.callWS({type:"ambience/simulate/inputs",scope_kind:r.scope_kind,scope_id:r.scope_id,category:e})}async function zs(t,r,e,i,n,s){return(await t.callWS({type:"ambience/simulate",scope_kind:r.scope_kind,scope_id:r.scope_id,category:e,now:i,overrides:n,verdicts:s})).result}var Fr=[{id:"red",label:"Red",hex:"#f44336"},{id:"pink",label:"Pink",hex:"#e91e63"},{id:"purple",label:"Purple",hex:"#9c27b0"},{id:"deep-purple",label:"Deep purple",hex:"#673ab7"},{id:"indigo",label:"Indigo",hex:"#3f51b5"},{id:"blue",label:"Blue",hex:"#2196f3"},{id:"light-blue",label:"Light blue",hex:"#03a9f4"},{id:"cyan",label:"Cyan",hex:"#00bcd4"},{id:"teal",label:"Teal",hex:"#009688"},{id:"green",label:"Green",hex:"#4caf50"},{id:"light-green",label:"Light green",hex:"#8bc34a"},{id:"lime",label:"Lime",hex:"#cddc39"},{id:"yellow",label:"Yellow",hex:"#ffeb3b"},{id:"amber",label:"Amber",hex:"#ffc107"},{id:"orange",label:"Orange",hex:"#ff9800"},{id:"deep-orange",label:"Deep orange",hex:"#ff5722"},{id:"brown",label:"Brown",hex:"#795548"},{id:"grey",label:"Grey",hex:"#9e9e9e"},{id:"blue-grey",label:"Blue grey",hex:"#607d8b"}];function Mr(t){if(t)return Fr.find(r=>r.id===t)?.hex}function tl(t){let r=t.replace("#",""),e=parseInt(r.slice(0,2),16)/255,i=parseInt(r.slice(2,4),16)/255,n=parseInt(r.slice(4,6),16)/255,s=l=>l<=.03928?l/12.92:((l+.055)/1.055)**2.4;return .2126*s(e)+.7152*s(i)+.0722*s(n)>.5?"#000000":"#ffffff"}function Di(t){let r=Mr(t);return r?`background:${r};color:${tl(r)}`:""}var Hi=y`
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
`;function gt(t,r){return d`<span class="category-swatch" style=${Di(t)}>
    ${r?d`<ha-icon icon=${r}></ha-icon>`:""}
  </span>`}var ce=class extends b{constructor(){super(...arguments);this._categories=[];this._sortedCategories=[];this._filterCategory=Si();this._open=!1;this._loaded=!1;this._onCategoriesChanged=async()=>{try{await this._fetchCategories()}catch{}};this._onDocClick=e=>{this._open&&!e.composedPath().includes(this)&&(this._open=!1)}}async _fetchCategories(){let e=await xe(this.hass);this.isConnected&&(this._categories=e,this._filterCategory&&!e.some(i=>i.id===this._filterCategory)&&this._select(""))}async connectedCallback(){super.connectedCallback(),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("click",this._onDocClick);try{await this._fetchCategories()}catch{}finally{this.isConnected&&(this._loaded=!0)}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("click",this._onDocClick)}willUpdate(e){e.has("_categories")&&(this._sortedCategories=[...this._categories].sort((i,n)=>i.name.localeCompare(n.name)))}_select(e){this._filterCategory=e,Xn(e),this._open=!1,this.dispatchEvent(new CustomEvent("ambience-filter-changed",{detail:{category:e},bubbles:!0,composed:!0}))}_openSettings(){this._open=!1,this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:"categories"},bubbles:!0,composed:!0}))}_renderEntry(e){return e===null?d`
        ${gt(void 0,"mdi:filter-variant")}
        <span class="category-name"
          >${a(this.hass,"ui.all_categories","All categories")}</span
        >
      `:d`
      ${gt(e.color,e.icon)}
      <span class="category-name">${e.name}</span>
    `}_renderAddCategory(e){return d`
      <button
        class="category-filter-add${e?" category-filter-add--footer":""}"
        @click=${()=>this._openSettings()}
      >
        <ha-icon icon="mdi:plus"></ha-icon>
        <span class="category-name"
          >${a(this.hass,"ui.add_category","Add category\u2026")}</span
        >
      </button>
    `}render(){if(!this._loaded)return d``;if(this._categories.length<=1)return this._renderAddCategory(!1);let e=this._sortedCategories,i=this._categories.find(n=>n.id===this._filterCategory)??null;return d`
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
                  ${e.map(n=>d`<button
                        class="category-filter-option"
                        role="option"
                        aria-selected=${this._filterCategory===n.id}
                        @click=${()=>this._select(n.id)}
                      >
                        ${this._renderEntry(n)}
                      </button>`)}
                </div>
                ${this._renderAddCategory(!0)}
              </div>
            `:$}
      </div>
    `}};ce.styles=[Hi,y`
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
    `],c([m({attribute:!1})],ce.prototype,"hass",2),c([g()],ce.prototype,"_categories",2),c([g()],ce.prototype,"_filterCategory",2),c([g()],ce.prototype,"_open",2),c([g()],ce.prototype,"_loaded",2),ce=c([w("ambience-category-filter")],ce);var $e={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ni=t=>(...r)=>({_$litDirective$:t,values:r}),_t=class{constructor(r){}get _$AU(){return this._$AM._$AU}_$AT(r,e,i){this._$Ct=r,this._$AM=e,this._$Ci=i}_$AS(r,e){return this.update(r,e)}update(r,e){return this.render(...e)}};var{I:il}=In,Us=t=>t;var Bs=t=>t.strings===void 0,Ws=()=>document.createComment(""),vt=(t,r,e)=>{let i=t._$AA.parentNode,n=r===void 0?t._$AB:r._$AA;if(e===void 0){let s=i.insertBefore(Ws(),n),o=i.insertBefore(Ws(),n);e=new il(s,o,t,t.options)}else{let s=e._$AB.nextSibling,o=e._$AM,l=o!==t;if(l){let u;e._$AQ?.(t),e._$AM=t,e._$AP!==void 0&&(u=t._$AU)!==o._$AU&&e._$AP(u)}if(s!==n||l){let u=e._$AA;for(;u!==s;){let h=Us(u).nextSibling;Us(i).insertBefore(u,n),u=h}}}return e},He=(t,r,e=t)=>(t._$AI(r,e),t),rl={},Ii=(t,r=rl)=>t._$AH=r,qs=t=>t._$AH,Oi=t=>{t._$AR(),t._$AA.remove()};var Vs=(t,r,e)=>{let i=new Map;for(let n=r;n<=e;n++)i.set(t[n],n);return i},Ks=Ni(class extends _t{constructor(t){if(super(t),t.type!==$e.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,r,e){let i;e===void 0?e=r:r!==void 0&&(i=r);let n=[],s=[],o=0;for(let l of t)n[o]=i?i(l,o):o,s[o]=e(l,o),o++;return{values:s,keys:n}}render(t,r,e){return this.dt(t,r,e).values}update(t,[r,e,i]){let n=qs(t),{values:s,keys:o}=this.dt(r,e,i);if(!Array.isArray(n))return this.ut=o,s;let l=this.ut??=[],u=[],h,p,f=0,_=n.length-1,v=0,x=s.length-1;for(;f<=_&&v<=x;)if(n[f]===null)f++;else if(n[_]===null)_--;else if(l[f]===o[v])u[v]=He(n[f],s[v]),f++,v++;else if(l[_]===o[x])u[x]=He(n[_],s[x]),_--,x--;else if(l[f]===o[x])u[x]=He(n[f],s[x]),vt(t,u[x+1],n[f]),f++,x--;else if(l[_]===o[v])u[v]=He(n[_],s[v]),vt(t,n[f],n[_]),_--,v++;else if(h===void 0&&(h=Vs(o,v,x),p=Vs(l,f,_)),h.has(l[f]))if(h.has(l[_])){let C=p.get(o[v]),A=C!==void 0?n[C]:null;if(A===null){let J=vt(t,n[f]);He(J,s[v]),u[v]=J}else u[v]=He(A,s[v]),vt(t,n[f],A),n[C]=null;v++}else Oi(n[_]),_--;else Oi(n[f]),f++;for(;v<=x;){let C=vt(t,u[x+1]);He(C,s[v]),u[v++]=C}for(;f<=_;){let C=n[f++];C!==null&&Oi(C)}return this.ut=o,Ii(t,u),X}});function Fi(t,r){let e=t.entities?.[r];return e?e.area_id!=null?e.area_id:e.device_id?t.devices?.[e.device_id]?.area_id??null:null:null}function R(t){return t.kind==="house"?"house":`${t.kind}:${t.id}`}function Mi(t,r){return r==null?{kind:"house"}:{kind:t,id:r}}function Gs(t,r){return`${R(t)}\0${r}`}function ke(t,r){return Gs(t,r)}function ji(t,r){return Gs(t,r)}function Ys(t,r){if(!r||r.entity==null)return[...t];let e=Array.isArray(r.entity)?r.entity:[r.entity];if(e.length===0)return[...t];let i=new Set,n=!1;for(let s of e){if(!s||typeof s!="object")continue;let o=s.domain;if(o==null){n=!0;continue}if(Array.isArray(o))for(let l of o)typeof l=="string"&&i.add(l);else typeof o=="string"&&i.add(o)}return n||i.size===0?[...t]:t.filter(s=>{let o=s.indexOf(".");return o<0?!1:i.has(s.slice(0,o))})}function zi(t,r,e=[]){let i=t;if(!i?.entities)return[];let n=i.entities,s=i.areas??{},o=r.kind==="area"?new Set([r.id]):r.kind==="floor"?new Set(Object.values(s).filter(u=>u.floor_id===r.id).map(u=>u.area_id)):null,l=u=>{let h=Fi(i,u.entity_id);return h==null?!1:o===null?!0:o.has(h)};return Object.values(n).filter(l).filter(u=>u.platform!=="ambience").filter(u=>e.length===0||e.includes(u.entity_id.split(".")[0])).map(u=>u.entity_id).sort()}var jr=Ni(class extends _t{constructor(t){if(super(t),t.type!==$e.PROPERTY&&t.type!==$e.ATTRIBUTE&&t.type!==$e.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Bs(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[r]){if(r===X||r===$)return r;let e=t.element,i=t.name;if(t.type===$e.PROPERTY){if(r===e[i])return X}else if(t.type===$e.BOOLEAN_ATTRIBUTE){if(!!r===e.hasAttribute(i))return X}else if(t.type===$e.ATTRIBUTE&&e.getAttribute(i)===r+"")return X;return Ii(t),r}});function yt(t){let{checked:r,dataTest:e,onChange:i,className:n,onClick:s,disabled:o}=t;return customElements.get("ha-switch")?d`<ha-switch
      class=${n??$}
      data-test=${e}
      ?disabled=${o??!1}
      .checked=${jr(r)}
      @click=${s}
      @change=${i}
    ></ha-switch>`:d`<input
    class=${n??$}
    data-test=${e}
    type="checkbox"
    ?disabled=${o??!1}
    .checked=${jr(r)}
    @click=${s}
    @change=${i}
  />`}function qt(t){let{priority:r,pinned:e,shadowed_by:i,...n}=t;return n}function Qs(t,r){if(r<0||r>=t.length)return[];let e=new Set(t[r].entity_ids??[]),i=new Set;return t.forEach((n,s)=>{if(s!==r)for(let o of n.entity_ids??[])e.has(o)||i.add(o)}),[...i]}var zr={house:"mdi:home",floor:"mdi:layers",area:"mdi:texture-box"};function Vt(t,r){return t.kind==="house"?zr.house:t.kind==="floor"?r?.floors?.[t.id]?.icon||zr.floor:r?.areas?.[t.id]?.icon||zr.area}var Ui=y`
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
    text-decoration: none;
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
`;function Wi(t){if(t.enabled===!1)return{severity:null,missing:[],overlap:[],shadowed:!1,configIssues:[]};let r=t.missing_entities??[],e=t.overlap_entities??[],i=t.config_issues??[],n=t.shadowed_by!=null;return{severity:r.length>0||i.length>0?"error":e.length>0||n?"warning":null,missing:r,overlap:e,shadowed:n,configIssues:i}}function Js(t){let r=null;for(let e of t){let i=Wi(e).severity;if(i==="error")return"error";i==="warning"&&(r="warning")}return r}function Xs(t){return t.filter(r=>Wi(r).severity!=null).length}var nl={missing_workday_sensor:["ui.badge_needs_workday_sensor","needs a workday sensor"],missing_workday_calendar:["ui.badge_needs_workday_calendar","needs a workday calendar"],missing_weather_entity:["ui.badge_needs_weather_entity","needs a weather entity"],missing_weather_group:["ui.badge_missing_weather_group","missing weather group {id}"],missing_period:["ui.badge_missing_period","missing period {id}"],missing_lux_range:["ui.badge_missing_lux_range","missing lux range {id}"],unexposed_action:["ui.badge_unexposed_action","action {id} not exposed"]};function Zs(t,r){let e=nl[r.kind];return(e?a(t,e[0],e[1]):r.kind).replace("{id}",r.ref)}var bt=null;function Bi(t,r){let e=Js(r);if(!e)return"";let i=Xs(r),n=a(t,"ui.problems_count","{n} scene(s) have problems").replace("{n}",String(i));return d`<ambience-problem-flag
    .severity=${e}
    .details=${[n]}
    .summary=${n}
  ></ambience-problem-flag>`}var Ce=class extends b{constructor(){super(...arguments);this.severity="warning";this.details=[];this.summary="";this._open=!1;this._onDocClick=e=>{this._open&&!e.composedPath().includes(this)&&this._setOpen(!1)}}disconnectedCallback(){this._open&&this._setOpen(!1),super.disconnectedCallback()}_setOpen(e){e?(bt&&bt!==this&&bt._setOpen(!1),bt=this,document.addEventListener("click",this._onDocClick,!0)):(bt===this&&(bt=null),document.removeEventListener("click",this._onDocClick,!0)),this._open=e}_toggle(e){e.stopPropagation(),this._setOpen(!this._open)}render(){return d`
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
    `}};Ce.styles=y`
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
  `,c([m()],Ce.prototype,"severity",2),c([m({attribute:!1})],Ce.prototype,"details",2),c([m()],Ce.prototype,"summary",2),c([g()],Ce.prototype,"_open",2),Ce=c([w("ambience-problem-flag")],Ce);function ae(t){return t.enabled===!1?{scenes:t.scenes??[],enabled:!1}:{scenes:t.scenes??[]}}function D(){return(t,r)=>{let e=Symbol(String(r));Object.defineProperty(t,r,{get(){return this[e]},set(i){Object.is(this[e],i)||(this[e]=i,this._host?.requestUpdate())},configurable:!0,enumerable:!0})}}var P=class{constructor(r){this._host=r;this.areas=[];this.floors=[];this.areaConfigs=new Map;this.floorConfigs=new Map;this.house={scenes:[]};this.switchEntityIds=new Map;this.live=new Map;this.areasLoaded=!1;this.conditions=[];this.actions=[];this.categories=[];this.schemas={};this.installId=null;this.staticLoaded=!1;this.error="";this.canUndo=!1;this.canRedo=!1;this.undoAction=null;this.redoAction=null;this.staleScopes=[];this._onExposedActionsChanged=async()=>{try{let r=await Ut(this._hass);if(!this._host.isConnected)return;this.actions=r,await this._refreshSchemas(r),await this.reloadConfigs()}catch{}};this._onCategoriesChanged=async()=>{try{let r=await xe(this._hass);if(!this._host.isConnected)return;this.categories=r}catch{}};this._onConditionsChanged=async()=>{try{let[r,e]=await Promise.all([Wt(this._hass),Bt(this._hass)]);if(!this._host.isConnected)return;this.dayConfig=r,this.weatherConfig=e}catch{}};r.addController(this)}get _hass(){return this._host.hass}hostConnected(){window.addEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("ambience-conditions-changed",this._onConditionsChanged),this._tick=setInterval(()=>{for(let r of this.switchEntityIds.values())if(this._hass.states?.[r]?.state==="off"){this._host.requestUpdate();return}},1e3)}hostDisconnected(){window.removeEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("ambience-conditions-changed",this._onConditionsChanged),this._tick&&clearInterval(this._tick),this._tick=void 0,this._unsubArea?.(),this._unsubArea=void 0,this._unsubFloor?.(),this._unsubFloor=void 0,this._unsubEntity?.(),this._unsubEntity=void 0,this._unsubLive?.(),this._unsubLive=void 0,this._unsubHistory?.(),this._unsubHistory=void 0}async subscribe(r,e){this._isScopeLocked=e;let i=this._hass.connection.subscribeEvents(v=>{v.data.action==="remove"&&r({kind:"area",id:v.data.area_id}),this.refreshAreas(),v.data.action!=="update"&&this.refreshSwitches()},"area_registry_updated"),n=this._hass.connection.subscribeEvents(v=>{v.data.action==="remove"&&r({kind:"floor",id:v.data.floor_id}),this.refreshFloors(),v.data.action!=="update"&&this.refreshSwitches()},"floor_registry_updated"),s=this._hass.connection.subscribeEvents(v=>{v.data.action!=="update"&&v.data.entity_id.startsWith("switch.")&&this.refreshSwitches()},"entity_registry_updated"),o=As(this._hass,v=>this._onLive(v)),l=Ps(this._hass,v=>this._onHistory(v)),[u,h,p,f,_]=await Promise.all([i,n,s,o,l]);this._host.isConnected?(this._unsubArea=u,this._unsubFloor=h,this._unsubEntity=p,this._unsubLive=f,this._unsubHistory=_):(u(),h(),p(),f(),_())}_onLive(r){let e=(i,n)=>{let s=ke(Mi(n.scope_kind,n.scope_id),n.category);i.set(s,{matched:n.matched,applied:n.applied})};if(r.type==="snapshot"){let i=new Map;for(let n of r.units)e(i,n);this.live=i}else{let i=new Map(this.live);e(i,r),this.live=i}}async loadStatic(){try{let[r,e,i,n,s,o,l,u]=await Promise.all([Li(this._hass),Ut(this._hass),Ai(this._hass),Pi(this._hass),Wt(this._hass),Bt(this._hass),xe(this._hass),Ti(this._hass)]);if(!this._host.isConnected)return;this.installId=u,this.conditions=r,this.actions=e,this.periods=i,this.luxRanges=n,this.dayConfig=s,this.weatherConfig=o,this.categories=l,this.staticLoaded=!0,await this._refreshSchemas(e)}catch(r){this.error=E(this._hass,r)}}async _refreshSchemas(r){let e=await Promise.all(r.map(async n=>{try{let s=await De(this._hass,n.id);return[n.id,s]}catch{return[n.id,null]}}));if(!this._host.isConnected)return;let i={};for(let[n,s]of e)s&&(i[n]=s);this.schemas=i}async refreshAreas(){try{let r=await ds(this._hass),e=this.areaConfigs,i=new Map;if(await Promise.all(r.map(async n=>{let s=e.get(n.area_id);if(s){i.set(n.area_id,s);return}i.set(n.area_id,ae(await Mt(this._hass,n.area_id)))})),!this._host.isConnected)return;this.areas=r,this.areaConfigs=i}catch(r){this.error=E(this._hass,r)}finally{this._host.isConnected&&(this.areasLoaded=!0)}}async refreshFloors(){try{let r=(await cs(this._hass)).slice().sort((n,s)=>n.name.localeCompare(s.name)),e=this.floorConfigs,i=new Map;if(await Promise.all(r.map(async n=>{let s=e.get(n.floor_id);if(s){i.set(n.floor_id,s);return}i.set(n.floor_id,ae(await jt(this._hass,n.floor_id)))})),!this._host.isConnected)return;this.floors=r,this.floorConfigs=i}catch(r){this.error=E(this._hass,r)}}async refreshHouse(){try{let r=ae(await zt(this._hass));if(!this._host.isConnected)return;this.house=r}catch(r){this.error=E(this._hass,r)}}async reloadConfigs(){let[r,e,i]=await Promise.all([Promise.all(this.areas.map(async n=>[n.area_id,ae(await Mt(this._hass,n.area_id))])),Promise.all(this.floors.map(async n=>[n.floor_id,ae(await jt(this._hass,n.floor_id))])),zt(this._hass)]);this._host.isConnected&&(this.areaConfigs=new Map(r),this.floorConfigs=new Map(e),this.house=ae(i))}async refreshSwitches(){try{let r=await ws(this._hass);if(!this._host.isConnected)return;this.switchEntityIds=new Map(r.map(e=>{let i=e.scope_kind==="house"?{kind:"house"}:{kind:e.scope_kind,id:e.scope_id};return[R(i),e.entity_id]}))}catch(r){this.error=E(this._hass,r)}}getConfig(r){return r.kind==="house"?this.house:r.kind==="area"?this.areaConfigs.get(r.id):this.floorConfigs.get(r.id)}setConfig(r,e){if(r.kind==="house")this.house=e;else if(r.kind==="area"){let i=new Map(this.areaConfigs);i.set(r.id,e),this.areaConfigs=i}else{let i=new Map(this.floorConfigs);i.set(r.id,e),this.floorConfigs=i}}async mutate(r,e,i){let n=this.getConfig(r);this.setConfig(r,e),this.error="";try{let s;return r.kind==="house"?s=await Dr(this._hass,e,i):r.kind==="area"?s=await Pr(this._hass,r.id,e,i):s=await Rr(this._hass,r.id,e,i),this.setConfig(r,ae(s.config)),!0}catch(s){return n&&this.setConfig(r,n),this.error=E(this._hass,s),!1}}async reloadScope(r){try{let e;if(r.kind==="house"?e=ae(await zt(this._hass)):r.kind==="area"?e=ae(await Mt(this._hass,r.id)):e=ae(await jt(this._hass,r.id)),!this._host.isConnected)return;this.setConfig(r,e)}catch(e){this.error=E(this._hass,e)}}_applyHistoryResult(r){!r.ok||!r.config||r.scope_kind===void 0||this.setConfig(Mi(r.scope_kind,r.scope_id??null),ae(r.config))}async undo(){this.error="";try{this._applyHistoryResult(await Rs(this._hass))}catch(r){this.error=E(this._hass,r)}}async redo(){this.error="";try{this._applyHistoryResult(await Ds(this._hass))}catch(r){this.error=E(this._hass,r)}}_onHistory(r){if(this.canUndo=r.can_undo,this.canRedo=r.can_redo,this.undoAction=r.undo,this.redoAction=r.redo,!r.changed_scope)return;let e=Mi(r.changed_scope.scope_kind,r.changed_scope.scope_id);if(r.is_self){this.clearStale(e);return}this._isScopeLocked?.(e)?this._markStale(e):this.reloadScope(e)}isScopeStale(r){let e=R(r);return this.staleScopes.some(i=>R(i)===e)}_markStale(r){this.isScopeStale(r)||(this.staleScopes=[...this.staleScopes,r])}clearStale(r){if(!this.isScopeStale(r))return;let e=R(r);this.staleScopes=this.staleScopes.filter(i=>R(i)!==e)}async refreshStaleScope(r){this.clearStale(r),await this.reloadScope(r)}};c([D()],P.prototype,"areas",2),c([D()],P.prototype,"floors",2),c([D()],P.prototype,"areaConfigs",2),c([D()],P.prototype,"floorConfigs",2),c([D()],P.prototype,"house",2),c([D()],P.prototype,"switchEntityIds",2),c([D()],P.prototype,"live",2),c([D()],P.prototype,"areasLoaded",2),c([D()],P.prototype,"conditions",2),c([D()],P.prototype,"actions",2),c([D()],P.prototype,"categories",2),c([D()],P.prototype,"schemas",2),c([D()],P.prototype,"periods",2),c([D()],P.prototype,"luxRanges",2),c([D()],P.prototype,"dayConfig",2),c([D()],P.prototype,"weatherConfig",2),c([D()],P.prototype,"installId",2),c([D()],P.prototype,"staticLoaded",2),c([D()],P.prototype,"error",2),c([D()],P.prototype,"canUndo",2),c([D()],P.prototype,"canRedo",2),c([D()],P.prototype,"undoAction",2),c([D()],P.prototype,"redoAction",2),c([D()],P.prototype,"staleScopes",2);var Ee=class extends b{constructor(){super(...arguments);this.text="";this.multiline=!1;this._open=!1;this._onDocClick=e=>{e.composedPath().includes(this)||this._close()};this._onKeydown=e=>{e.key==="Escape"&&this._close()}}_toggle(e){e.stopPropagation(),this._open?this._close():this._openPopover()}_openPopover(){this._open=!0,document.addEventListener("click",this._onDocClick,!0),document.addEventListener("keydown",this._onKeydown)}_close(){this._open&&(this._open=!1,document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown),this.renderRoot.querySelector(".trigger")?.focus())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown)}render(){return d`
      <button
        class="trigger"
        data-test="help-trigger"
        aria-label=${a(this.hass,"ui.help","Help")}
        aria-expanded=${this._open}
        @click=${e=>this._toggle(e)}
      >
        ?
      </button>
      ${this._open?d`<div
              class="popover${this.multiline?" multiline":""}"
              role="dialog"
              data-test="help-popover"
            ><slot>${this.text}</slot></div>`:""}
    `}};Ee.styles=y`
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
      /* Colour is overridable via --ambience-help-trigger-color so a caller can
         darken the "?" to match adjacent text; defaults to the muted grey. */
      border: 1px solid var(--ambience-help-trigger-color, var(--secondary-text-color, #888));
      color: var(--ambience-help-trigger-color, var(--secondary-text-color, #888));
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
    .popover.multiline {
      white-space: pre-wrap;
    }
  `,c([m({attribute:!1})],Ee.prototype,"hass",2),c([m()],Ee.prototype,"text",2),c([m({type:Boolean})],Ee.prototype,"multiline",2),c([g()],Ee.prototype,"_open",2),Ee=c([w("ambience-help")],Ee);var ue=class extends b{constructor(){super(...arguments);this.items=[];this.muted=!1;this._open=!1;this._onKeydown=e=>{e.key==="Escape"&&this._open&&(this._open=!1)}}_triggerLabel(){return this.label??a(this.hass,"ui.more_actions","More actions")}_select(e,i){i.stopPropagation(),this._open=!1,this.dispatchEvent(new CustomEvent("menu-action",{detail:{id:e},bubbles:!0,composed:!0}))}_renderItems(){return this.items.map(e=>d`
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
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this._onKeydown)}disconnectedCallback(){this.removeEventListener("keydown",this._onKeydown),super.disconnectedCallback()}render(){return this._renderMenu()}};ue.styles=y`
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
  `,c([m({attribute:!1})],ue.prototype,"items",2),c([m({attribute:!1})],ue.prototype,"hass",2),c([m()],ue.prototype,"label",2),c([m({type:Boolean,reflect:!0})],ue.prototype,"muted",2),c([g()],ue.prototype,"_open",2),ue=c([w("ambience-kebab-menu")],ue);var Ne=class extends b{constructor(){super(...arguments);this.kind="matched";this.label="";this._open=!1;this._onDocClick=e=>{e.composedPath().includes(this)||this._close()};this._onKeydown=e=>{e.key==="Escape"&&this._close()}}_toggle(e){e.stopPropagation(),this._open?this._close():this._openPopover()}_openPopover(){this._open=!0,document.addEventListener("click",this._onDocClick,!0),document.addEventListener("keydown",this._onKeydown)}_close(){this._open&&(this._open=!1,document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown)}render(){return d`
      <button
        type="button"
        class="dot ${this.kind}"
        aria-label=${this.label}
        aria-expanded=${this._open}
        @click=${e=>this._toggle(e)}
      ></button>
      ${this._open?d`<div class="popover" role="tooltip" @click=${e=>e.stopPropagation()}>
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
  `,c([m()],Ne.prototype,"kind",2),c([m()],Ne.prototype,"label",2),c([g()],Ne.prototype,"_open",2),Ne=c([w("ambience-live-dot")],Ne);function sl(t){return t.style.pointerEvents="none",t.style.willChange="transform",()=>{t.style.pointerEvents="",t.style.willChange="",t.style.transform=""}}function qi(t,r,e={}){let i=t.pointerId;try{t.target?.setPointerCapture?.(i)}catch{}let n=e.follow??null,s=t.clientX,o=t.clientY,l=n?sl(n):null,u=_=>{_.pointerId===i&&(r.onMove(_.clientX,_.clientY),n&&(n.style.transform=`translate(${_.clientX-s}px, ${_.clientY-o}px)`))},h=_=>{_.pointerId===i&&(f(),r.onEnd(_.clientX,_.clientY))},p=_=>{_.pointerId===i&&(f(),r.onCancel())},f=()=>{window.removeEventListener("pointermove",u,!0),window.removeEventListener("pointerup",h,!0),window.removeEventListener("pointercancel",p,!0),l?.()};return window.addEventListener("pointermove",u,!0),window.addEventListener("pointerup",h,!0),window.addEventListener("pointercancel",p,!0),f}function Vi(t,r){let e=document.elementFromPoint?.(t,r)??null;if(!e)return null;for(;e.shadowRoot;){let i=e.shadowRoot.elementFromPoint?.(t,r);if(!i||i===e)break;e=i}return e}var wt=class{constructor(r,e,i={}){this.host=r;this.onReorder=e;this.from=null;this.over=null;this.moved=!1;this._cancelDrag=null;this._locate=i.locate??((n,s)=>this._domLocate(n,s)),r.addController(this)}hostDisconnected(){this._reset()}start(r,e){if(!e.isPrimary||e.button>0)return;this._reset(),this.from=r,this.moved=!1,this.host.requestUpdate();let i=e.target?.closest("[data-drag-index]");this._cancelDrag=qi(e,{onMove:(n,s)=>this._hover(this._locate(n,s)),onEnd:(n,s)=>this.drop(this._locate(n,s)),onCancel:()=>this.end()},{follow:i})}_hover(r){if(this.from===null)return;let e=r===null||r===this.from?null:r;e!==null&&(this.moved=!0),this.over!==e&&(this.over=e,this.host.requestUpdate())}drop(r){let e=this.from;this._reset(),!(e===null||r===null||e===r)&&this.onReorder(e,r)}end(){this._reset()}_domLocate(r,e){let i=this.host.renderRoot,s=(i?.elementFromPoint?i.elementFromPoint(r,e):Vi(r,e))?.closest?.("[data-drag-index]");if(!s)return null;let o=Number(s.getAttribute("data-drag-index"));return Number.isNaN(o)?null:o}_reset(){this._cancelDrag?.(),this._cancelDrag=null;let r=this.from!==null||this.over!==null;this.from=null,this.over=null,r&&this.host.requestUpdate()}};var ol={light:"mdi:lightbulb",switch:"mdi:toggle-switch-variant",binary_sensor:"mdi:motion-sensor",sensor:"mdi:eye",person:"mdi:account",device_tracker:"mdi:account",climate:"mdi:thermostat",cover:"mdi:window-shutter",media_player:"mdi:cast",lock:"mdi:lock",fan:"mdi:fan",weather:"mdi:weather-partly-cloudy",input_boolean:"mdi:toggle-switch",event:"mdi:eye-check",script:"mdi:script-text",template:"mdi:code-braces"},Ur="mdi:eye";function M(t,r){let e=t?.states?.[r]?.attributes?.friendly_name;return typeof e=="string"&&e?e:r}function al(t,r){let e=t?.states?.[r]?.attributes?.icon;if(typeof e=="string"&&e)return e;let i=r.split(".")[0];return ol[i]??Ur}function Kt(t,r){let e=t?.states?.[r];return e&&customElements.get("ha-state-icon")?d`<ha-state-icon class="row-icon" .hass=${t} .stateObj=${e}></ha-state-icon>`:d`<ha-icon class="row-icon" icon=${al(t,r)}></ha-icon>`}var eo=y`
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
`;function to(t){return t.normalize("NFC").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean)}function ll(t,r){let e=to(t),i=to(r);if(i.length===0)return!0;for(let n=0;n+i.length<=e.length;n++)if(i.every((s,o)=>e[n+o]===s))return!0;return!1}function io(t,r){let e=M(t,r);if(!t)return e;let i=Fi(t,r),n=i?t.areas?.[i]?.name??"":"";return!n||ll(e,n)?e:`${n} \xB7 ${e}`}function L(t,r){t.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r},bubbles:!0,composed:!0}))}var dl=[{name:"duration",selector:{duration:{enable_day:!1}}}];function Gt(t){return!!t&&(t.h!==0||t.m!==0||t.s!==0)}function xt(t,r){return Gt(t)&&r==="less_than"?"less_than":void 0}function Yt(t){return t==="less_than"?"<":"\u2265"}var Ie=class extends b{constructor(){super(...arguments);this.value=null;this.mode="at_least"}willUpdate(e){(e.has("hass")||this._modeSchema===void 0)&&(this._modeSchema=[{name:"for_mode",required:!0,selector:{select:{mode:"dropdown",options:this._modeOptions()}}}])}get _d(){return this.value??{h:0,m:0,s:0}}_emit(e,i){this.value=e,this.mode=i,L(this,{...e,mode:i})}_setDuration(e){this._emit(e,this.mode)}_setMode(e){this._emit(this._d,e)}_modeOptions(){return[{value:"at_least",label:a(this.hass,"ui.for_at_least","at least")},{value:"less_than",label:a(this.hass,"ui.for_less_than","less than")}]}_renderMode(){if(customElements.get("ha-form"))return d`<ha-form
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
    </select>`}render(){if(customElements.get("ha-form")){let n=this._d;return d`${this._renderMode()}<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${dl}
        .data=${{duration:{hours:n.h,minutes:n.m,seconds:n.s}}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.duration;this._setDuration({h:o?.hours??0,m:o?.minutes??0,s:o?.seconds??0})}}
      ></ha-form>`}let e=this._d,i=n=>d`<input type="number" min="0" step="1"
      .value=${String(e[n])}
      @change=${s=>this._setDuration({...e,[n]:Math.max(0,Math.trunc(Number(s.target.value)||0))})} />`;return d`${this._renderMode()}<div class="for-row" data-field="for">
      ${i("h")}<span>:</span>${i("m")}<span>:</span>${i("s")}
    </div>`}};Ie.styles=y`
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
  `,c([m({attribute:!1})],Ie.prototype,"hass",2),c([m({attribute:!1})],Ie.prototype,"value",2),c([m({attribute:!1})],Ie.prototype,"mode",2),Ie=c([w("ambience-for-duration")],Ie);function Zt(t,r,e){if(r&&e){let i=e[r]?.fields?.[t];if(i&&typeof i=="object"){let n=i.name;if(typeof n=="string"&&n)return n}}return z(t)}function Ji(t,r,e){return t.name?.trim()?t.name:r??a(e,"ui.new_scene_default","New scene")}function kt(t,r,e){return r==null?a(e.hass,"ui.summary_any_paren","(any)"):t==="time_of_day"?er(r,e):t==="day"?pl(r,e):t==="weather"?_l(r,e):t==="sun"?vl(r,e):t==="state"?Qr(r,e):t==="script"?ul(r,e):t==="people"?hl(r,e):t==="occupancy"?yl(r,e):t==="unavailable"?Cl(r,e):t==="lux"?El(r,e):t==="template"?cl(r,e):String(r)}function cl(t,r={}){return t===null?a(r.hass,"ui.summary_any_paren","(any)"):typeof t!="object"||typeof t.template!="string"?String(t):t.template}function ul(t,r={}){if(t===null)return a(r.hass,"ui.summary_any_paren","(any)");if(typeof t!="object"||typeof t.script!="string")return String(t);let e=Jt(r,t.script),i=t.args??{},n=Object.keys(i).sort();if(n.length===0)return e;let s=n.map(o=>`${Vr(r.hass,t.script,o)}: ${Oe(r.hass,i[o])}`).join(", ");return`${e} (${s})`}function Vr(t,r,e){let i=r.replace(/^script\./,""),s=t?.services?.script?.[i]?.fields?.[e]?.name;return typeof s=="string"&&s?s:z(e)}function Jt(t,r){let i=t.hass?.states?.[r]?.attributes?.friendly_name;if(typeof i=="string"&&i)return i;let n=r.indexOf("."),s=n>=0?r.slice(n+1):r;return s.charAt(0).toUpperCase()+s.slice(1)}function ro(t,r){return t==="home"?a(r.hass,"people_summary.home","Home"):Jt(r,t)}function hl(t,r={}){if(t==null)return a(r.hass,"ui.summary_any","any");let e=t.where??"home";if(Array.isArray(t.who)&&t.who.length===1){let o=Jt(r,t.who[0]),u=t.quant==="nobody"!=!!t.negate?a(r.hass,"people_summary.is_not_at","is not at"):a(r.hass,"people_summary.is_at","is at"),h=`${o} ${u} ${ro(e,r)}`;return t.for&&Xt(t.for)?`${h} ${a(r.hass,"ui.for_prefix","for")} ${Yt(t.for_mode)}${Qi(t.for)}`:h}let i;if(Array.isArray(t.who)){let o=t.quant??"any",l=o==="any"?a(r.hass,"ui.people_mode_any","Any of:"):o==="everyone"?a(r.hass,"ui.people_mode_all","All of:"):a(r.hass,"ui.people_mode_none","None of:"),u=t.who.map(h=>Jt(r,h)).join(", ");i=`${l} (${u})`}else{let o=t.quant??"everyone";i=o==="nobody"?a(r.hass,"ui.people_mode_nobody","Nobody"):o==="any"?a(r.hass,"ui.people_mode_anybody","Anybody"):a(r.hass,"ui.people_mode_everybody","Everybody")}let n=t.negate?a(r.hass,"people_summary.is_not_at","is not at"):a(r.hass,"people_summary.is_at","is at"),s=`${i} ${n} ${ro(e,r)}`;return t.for&&Xt(t.for)?`${s} ${a(r.hass,"ui.for_prefix","for")} ${Yt(t.for_mode)}${Qi(t.for)}`:s}function pl(t,r={}){if(t===null)return a(r.hass,"day_summary.any","any");let e=t.include??[],i=t.exclude??[],n=e.length===0?a(r.hass,"day_summary.any_day","any day"):e.map(o=>no(o,r)).join(", ");if(i.length===0)return n;let s=a(r.hass,"day_summary.except","except");return`${n} (${s} ${i.map(o=>no(o,r)).join(", ")})`}function no(t,r){switch(t.kind){case"weekday":return t.days.map(e=>Ci(r.hass,e)).join("/");case"day_of_month":return`${a(r.hass,"day_summary.day_prefix","Day")} ${t.days}`;case"date":return`${mt(r.hass,t.month)} ${t.day}`;case"date_range":return`${mt(r.hass,t.from.month)} ${t.from.day} \u2192 ${mt(r.hass,t.to.month)} ${t.to.day}`;case"last_day":return a(r.hass,"day_summary.last_day","Last day");case"workday":return a(r.hass,"day_summary.workday","Workday");case"holiday":return a(r.hass,"day_summary.holiday","Holiday");case"first_workday":return a(r.hass,"day_summary.first_workday","First workday");case"last_workday":return a(r.hass,"day_summary.last_workday","Last workday")}}function Kr(t){return typeof t=="string"?t:typeof t=="number"||typeof t=="boolean"?String(t):JSON.stringify(t)}var ml=["entity_id","device_id","area_id","label_id","floor_id"],so=2;function fl(t){if(!t||typeof t!="object"||Array.isArray(t))return null;let r=t;if(!Object.keys(r).every(n=>ml.includes(n)))return null;let e=r.entity_id,i=typeof e=="string"?[e]:Array.isArray(e)?e.filter(n=>typeof n=="string"):[];return i.length?i:null}function Oe(t,r){let e=fl(r);if(!e)return Kr(r);let i=e.slice(0,so).map(o=>Jt({hass:t},o)),n=e.length-so;return`[${n>0?`${i.join(", ")} +${n} more`:i.join(", ")}]`}function Xi(t){if(!(!t||typeof t!="object")){for(let r of Object.values(t))if(r&&typeof r=="object"){let e=r.unit_of_measurement;if(typeof e=="string"&&e)return e}}}function gl(t){return t.split(/[\s_-]+/).filter(r=>r!=="").map(r=>r.charAt(0).toUpperCase()+r.slice(1).toLowerCase()).join(" ")}function _l(t,r={}){if(t===null)return a(r.hass,"ui.summary_any","any");let e=new Map((r.weatherGroups??[]).map(o=>[o.id,o.label])),i=(t.groups??[]).map(o=>e.get(o)??gl(o)).join("/"),n=(t.thresholds??[]).map(o=>`${Ft(r.hass,o.attribute)} ${U(r.hass,o.op)} ${o.value}`).join(", "),s=[i,n].filter(o=>o!=="");return s.length===0?a(r.hass,"ui.summary_any","any"):s.join(", ")}function vl(t,r={}){if(t===null)return a(r.hass,"ui.summary_any","any");let e=[],i=t.elevation;i&&(i.min!=null&&i.max!=null?e.push(`${i.min}\xB0\u2013${i.max}\xB0`):i.min!=null?e.push(`\u2265${i.min}\xB0`):i.max!=null&&e.push(`\u2264${i.max}\xB0`));let n=t.azimuth;if(n){n.sectors?.length&&e.push(n.sectors.join("/"));for(let s of n.ranges??[])e.push(`${s.from}\xB0\u2013${s.to}\xB0`)}return e.length===0?a(r.hass,"ui.summary_any","any"):e.join(", ")}function Zi(t,r){return io(t.hass,r)}function Gr(t,r,e,i,n={}){let s=n.negate?`${a(t.hass,`${r}.not`,"not")} `:"";if(e.length===1)return`${e[0]} ${a(t.hass,`${r}.is`,"is")} ${s}${i}`;let o=n.all===!0,l=o?a(t.hass,`${r}.all_of`,"All of"):a(t.hass,`${r}.any_of`,"Any of"),u=o?a(t.hass,`${r}.are`,"are"):a(t.hass,`${r}.is`,"is");return`${l} (${e.join(", ")}) ${u} ${s}${i}`}function yl(t,r={}){if(t==null||!t.sensors?.length)return a(r.hass,"ui.summary_any","any");let e=t.sensors.map(s=>Zi(r,s)),i=t.occupied===!1?a(r.hass,"occupancy_summary.clear","clear"):a(r.hass,"occupancy_summary.detected","detected"),n=Gr(r,"occupancy_summary",e,i,{all:t.quant==="all",negate:t.negate});return t.for&&Xt(t.for)?`${n} ${a(r.hass,"ui.for_prefix","for")} ${Yt(t.for_mode)}${Qi(t.for)}`:n}function bl(t,r){if(r==null||typeof r!="object")return!1;if(t==="occupancy"||t==="lux")return!!r.negate;if(t==="people"){let e=r;return!!e.negate&&Array.isArray(e.who)&&e.who.length===1}return!1}function wl(t){return{...t,negate:!1}}function Wr(t){if(t.kind==="and"||t.kind==="or"){let r=t.items.map(Wr);return r.length===1?r[0]:{...t,items:r}}return t.kind==="not"?{...t,item:Wr(t.item)}:t}function Qt(t){if(t.kind==="is_not")return t.for&&Xt(t.for)?null:{...t,kind:"is"};if(t.kind==="not"){let r=t.item.kind;return r==="is"||r===">"||r===">="||r==="<"||r==="<="||r==="and"||r==="or"?t.item:null}if(t.kind==="or"){let r=[];for(let e of t.items){let i=Qt(e);if(!i)return null;r.push(i)}return r.length===1?r[0]:{kind:"and",items:r}}return null}function xl(t,r){let e=$t("state",t,r);return(t.kind==="and"||t.kind==="or")&&t.items.length>1?`(${e})`:e}function Ki(t,r,e){let i=[],n=[];for(let p of t.items){let f=Qt(p);f?n.push(f):i.push(p)}let s=` ${U(r.hass,"or")} `,o=i.map(p=>Br(p,r)).join(s),l="";if(n.length){let p=n.length===1?n[0]:{kind:"and",items:n};l=`${a(r.hass,"blocker_summary.until","until")} ${xl(p,r)}`}let u=[o,l].filter(p=>p!=="").join(s),h=i.length+(n.length?1:0);return e&&h>1?`(${u})`:u}function Gi(t,r){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<=")return Yi(t,r,!1);if(t.kind==="and"){let e=` ${U(r.hass,"and")} `;return t.items.map(i=>Br(i,r)).join(e)}if(t.kind==="or")return Ki(t,r,!1);if(t.kind==="not"){let e=t.item;return e.kind==="is"?Yi(e,r,!0):`${U(r.hass,"not")} ${Br(e,r)}`}return""}function Br(t,r){return t.kind==="or"?Ki(t,r,!0):t.kind==="and"?`(${Gi(t,r)})`:Gi(t,r)}function $l(t,r,e){let i=Wr(t);if(i.kind==="and"){let s=[],o=[];for(let h of i.items){let p=Qt(h);p?o.push(p):s.push(h)}let l=[];if(s.length>0){let h=s.length===1?s[0]:{kind:"and",items:s};l=[h.kind==="or"?Ki(h,r,!e):Gi(h,r)]}let u=o.map(h=>$t("state",h,r));return{guards:l,releases:u}}if(i.kind==="or"){let s=Qt(i);return s?{guards:[],releases:[$t("state",s,r)]}:{guards:[Ki(i,r,!e)],releases:[]}}let n=Qt(i);return n?{guards:[],releases:[$t("state",n,r)]}:{guards:[Gi(i,r)],releases:[]}}var kl=new Set(["occupancy","people","state","lux","unavailable","script","template","day","time_of_day","weather"]);function $t(t,r,e){let i=kt(t,r,e);return kl.has(t)?i:`${G(e.hass,t)}: ${i}`}function lo(t,r={}){let e=a(r.hass,"blocker_summary.block","Block"),i=Object.keys(t.when).filter(f=>t.when[f]!=null);if(r.priorities){let f=r.priorities;i=i.sort((_,v)=>{let x=f.get(_),C=f.get(v);return x===void 0&&C===void 0?0:(C??-1/0)-(x??-1/0)})}let n=[],s=[];for(let f of i){let _=t.when[f];if(f==="state"){let v=$l(_,r,i.length===1);s.push(...v.guards),n.push(...v.releases);continue}bl(f,_)?n.push($t(f,wl(_),r)):s.push($t(f,_,r))}let o=a(r.hass,"blocker_summary.until","until"),l=` ${a(r.hass,"blocker_summary.or","or")} `,u=` ${a(r.hass,"blocker_summary.and","and")} `,h=n.join(l),p=s.join(u);if(n.length&&s.length){let f=a(r.hass,"blocker_summary.while_lead","While"),_=a(r.hass,"blocker_summary.block_mid","block");return`${f} ${p}, ${_} ${o} ${h}`}if(n.length)return`${e} ${o} ${h}`;if(s.length){let f=a(r.hass,"blocker_summary.while","while");return`${e} ${f} ${p}`}return`${e} ${a(r.hass,"blocker_summary.always","always")}`}function Cl(t,r={}){if(t==null||!t.entities?.length)return a(r.hass,"ui.summary_any","any");let e=t.entities.map(n=>Zi(r,n)),i=a(r.hass,"unavailable_summary.unavailable","unavailable");return Gr(r,"unavailable_summary",e,i)}function Yr(t,r,e="any lux"){return t!=null&&r!=null?`${t}\u2013${r} lx`:r!=null?`<${r} lx`:t!=null?`\u2265${t} lx`:e}function El(t,r={}){if(t==null||!t.sensors?.length)return a(r.hass,"ui.summary_any","any");let e=t.sensors.map(n=>Zi(r,n)),i=t.range!=null?Re(r.hass,t.range,r.luxRanges?.custom??{}):Yr(t.min,t.max);return Gr(r,"lux_summary",e,i,{all:t.quant==="all",negate:t.negate})}function Qr(t,r={}){return t==null?a(r.hass,"ui.summary_any","any"):qr(t,r)}function Yi(t,r,e){let i=U(r.hass,t.kind),n=Zi(r,t.entity_id),s=r.hass?.states?.[t.entity_id],l=t.kind!=="is"&&t.kind!=="is_not"?t.states[0]??"":t.states.map(f=>Ae(r.hass,s,t.attribute,f)).join("/"),u=t.attribute?`${n}.${$i(r.hass,s,t.attribute)}`:n,h=e?`${U(r.hass,"not")} `:"",p=`${u} ${i} ${h}${l}`;return t.for&&Xt(t.for)?`${p} ${a(r.hass,"ui.for_prefix","for")} ${Yt(t.for_mode)}${Qi(t.for)}`:p}function qr(t,r){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<=")return Yi(t,r,!1);if(t.kind==="and"||t.kind==="or"){let e=` ${U(r.hass,t.kind)} `;return t.items.map(i=>oo(i,r)).join(e)}if(t.kind==="not"){let e=t.item;return e.kind==="is"?Yi(e,r,!0):`${U(r.hass,"not")} ${oo(e,r)}`}return""}function oo(t,r){return t.kind==="and"||t.kind==="or"?`(${qr(t,r)})`:qr(t,r)}function Xt(t){return t.h>0||t.m>0||t.s>0}function Qi(t){let r=[];return t.h&&r.push(`${t.h}h`),t.m&&r.push(`${t.m}m`),t.s&&r.push(`${t.s}s`),r.length?r.join(" "):"0s"}function er(t,r){if(t===null)return a(r.hass,"ui.summary_any","any");let e=Array.isArray(t)?t:[t],i=r.periods?.custom??{};return e.map(n=>"period"in n?de(r.hass,n.period,i):`${ao(n.from,r)} \u2192 ${ao(n.to,r)}`).join(", ")}function ao(t,r){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=Pe(r.hass,t.anchor),i=e;if(t.offset_min!==0){let n=Math.abs(t.offset_min),s=n%60===0?`${n/60}${a(r.hass,"ui.unit_hour_abbr","h")}`:`${n}${a(r.hass,"ui.unit_min_abbr","m")}`;i=`${e}${t.offset_min<0?"-":"+"}${s}`}if(t.clamp){let n=t.clamp.dir==="not_before"?a(r.hass,"ui.clamp_not_before","not before"):a(r.hass,"ui.clamp_not_after","not after"),s=`${String(t.clamp.hh).padStart(2,"0")}:${String(t.clamp.mm).padStart(2,"0")}`;i=`${i} (${n} ${s})`}return i}function Sl(t,r){return pt(t.service,r.exposedActions,()=>r.schemas?.[t.service]?.name?.trim()||ki(r.hass,t.service))}function Ll(t,r){let e=new Set;for(let i of t.entity_ids){let n=i.indexOf(".");n>0&&e.add(i.slice(0,n))}return e.size===1?[...e][0]:a(r.hass,"ui.target_noun","target")}function co(t,r){let e=Sl(t,r),i=Ll(t,r),n=t.entity_ids.length,s;n===0?s=a(r.hass,"ui.no_targets","(no targets)"):n===1?s=`1 ${i}`:s=`${n} ${i}s`;let o=Object.entries(t.params).filter(([,l])=>l!=null&&l!=="").map(([l,u])=>`${Zt(l,t.service,r.schemas)}: ${Oe(r.hass,u)}`).join(", ");return o?`${e}: ${s}, ${o}`:`${e}: ${s}`}var I=class extends b{constructor(){super(...arguments);this.scenes=[];this.availableActions=[];this.schemas={};this.categories=[];this.filterCategory="";this.collapsedCategories=[];this.liveSuppressed=!1;this._drag=new wt(this,(e,i)=>this._emit("reorder-scenes",{from:e,to:i}));this._expanded=new Set}willUpdate(e){e.has("scenes")&&(this._expanded=new Set)}_renderSectionHeader(e,i,n){return d`<div
      class="category-section-header"
      style=${Di(e.color)}
      @click=${()=>this._emit("toggle-category-collapse",{categoryId:e.id})}
    >
      <span class="category-chevron ${i?"open":""}" aria-hidden="true">▶</span>
      ${e.icon?d`<ha-icon icon=${e.icon}></ha-icon>`:""}
      <span>${e.name}</span>
      ${Bi(this.hass,n.map(([,s])=>s))}
      <ambience-kebab-menu
        class="category-kebab"
        .hass=${this.hass}
        @click=${s=>s.stopPropagation()}
        .items=${[{id:"run",label:a(this.hass,"ui.run","Run"),icon:"mdi:play"},{id:"traces",label:a(this.hass,"ui.view_traces","View traces"),icon:"mdi:transit-connection-variant"},{id:"simulate",label:a(this.hass,"ui.simulate","Simulate"),icon:"mdi:flask-outline"},{id:"auto",label:a(this.hass,"ui.auto_triggers_section","Auto-triggers"),icon:"mdi:flash-auto"}]}
        @menu-action=${s=>this._onCategoryMenu(e,s.detail.id)}
      ></ambience-kebab-menu>
    </div>`}_sections(){let e=this.scenes.map((n,s)=>[s,n]);if(this.filterCategory!=="")return[{category:this.categories.find(n=>n.id===this.filterCategory),rows:e.filter(([,n])=>n.category===this.filterCategory)}];let i=new Map;for(let[n,s]of e){let o=i.get(s.category)??[];o.push([n,s]),i.set(s.category,o)}return[...i.entries()].map(([n,s])=>({category:this.categories.find(o=>o.id===n),rows:s})).sort((n,s)=>(n.category?.name??"").localeCompare(s.category?.name??""))}_emit(e,i){this.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}_priorityMap(){let e=this.conditions;return(!this._priorityOfCache||this._priorityOfCache.src!==e)&&(this._priorityOfCache={src:e,map:new Map((e??[]).map(i=>[i.name,i.priority]))}),this._priorityOfCache.map}_whenKeys(e){let i=this._priorityMap();return Object.keys(e.when).filter(n=>e.when[n]!=null).sort((n,s)=>(i.get(s)??-1/0)-(i.get(n)??-1/0))}_whenSummary(e){let i=this._whenKeys(e);return i.length===0?a(this.hass,"ui.summary_always","Always"):i.map((n,s)=>{let o=G(this.hass,n),l=kt(n,e.when[n],{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups});return d`${s===0?"":", "}<strong>${o}:</strong> ${l}`})}_blockerSummary(e){return lo(e,{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups,priorities:this._priorityMap()})}_whenStacked(e){let i=this._whenKeys(e);return i.length===0?d`<div class="condition-line">
        ${a(this.hass,"ui.summary_always","Always")}
      </div>`:i.map(n=>{let s=G(this.hass,n),o=kt(n,e.when[n],{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups});return d`<div class="condition-line">
        <strong>${s}:</strong> ${o}
      </div>`})}_actionCountLabel(e){let i=e.actions.length,n=i===1?a(this.hass,"ui.action_singular","action"):a(this.hass,"ui.action_plural","actions");return`${i} ${n}`}_toggleScene(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}_entityName(e){return M(this.hass,e)}_actionParamsString(e){return Object.entries(e.params).filter(([,i])=>i!=null&&i!=="").map(([i,n])=>`${Zt(i,e.service,this.schemas)}: ${Oe(this.hass,n)}`).join(", ")}_actionLabel(e){return pt(e.service,this.availableActions,()=>this.schemas[e.service]?.name?.trim()||ki(this.hass,e.service))}_onCategoryMenu(e,i){i==="run"?this._emit("apply-category",{categoryId:e.id}):i==="traces"?this._emit("show-traces",{category:e.id}):i==="simulate"?this._emit("show-simulator",{category:e.id}):i==="auto"&&this._emit("show-auto-triggers",{category:e.id})}_onSceneMenu(e,i){i==="edit"?this._emit("edit-scene",{index:e}):i==="duplicate"?this._emit("duplicate-scene",{index:e}):i==="run"?this._emit("run-scene-actions",{index:e}):i==="delete"&&this._emit("delete-scene",{index:e})}_liveDot(e,i){if(this.liveSuppressed||!this.scope||!this.live)return"";let n=this.live.get(ke(this.scope,i.category));if(!n)return"";if(n.matched===e){let s=a(this.hass,"ui.scene_live","Live now \u2014 this scene currently matches and is applied");return d`<ambience-live-dot kind="matched" .label=${s}></ambience-live-dot>`}if(n.applied===e){let s=a(this.hass,"ui.scene_applied_stale","Still applied \u2014 this scene's actions are in effect but it no longer matches");return d`<ambience-live-dot kind="stale" .label=${s}></ambience-live-dot>`}return""}_problemFlag(e){let i=Wi(e);if(!i.severity)return"";let n=[];return i.shadowed&&n.push(a(this.hass,"ui.shadowed","Never fires \u2014 shadowed by an earlier scene.")),i.missing.length&&n.push(`${a(this.hass,"ui.problem_missing","Missing or disabled in Home Assistant:")} ${i.missing.join(", ")}`),i.overlap.length&&n.push(`${a(this.hass,"ui.problem_overlap","Controlled by multiple groups:")} ${i.overlap.join(", ")}`),i.configIssues.length&&n.push(`${a(this.hass,"ui.problem_config","Configuration problems:")} ${i.configIssues.map(s=>Zs(this.hass,s)).join(", ")}`),d`<ambience-problem-flag
      .severity=${i.severity}
      .details=${n}
      .summary=${n.join(`
`)}
    ></ambience-problem-flag>`}_renderRow(e,i,n){let s=a(this.hass,"ui.unpin","Unpin (return to automatic order)"),o=i.enabled===!1,l=o?a(this.hass,"ui.enable_scene","Enable scene"):a(this.hass,"ui.disable_scene","Disable scene"),u=!!i.description?.trim();return d`
      <li
        data-drag-index=${e}
        class="${this._drag.over===e?"drag-over ":""}${this._drag.from===e?"dragging ":""}${o?"disabled":""}"
      >
        <span class="lead">
          ${i.pinned?d`<button
                class="pin"
                title=${s}
                aria-label=${s}
                @pointerdown=${h=>this._drag.start(e,h)}
                @click=${h=>{if(h.stopPropagation(),this._drag.moved){this._drag.moved=!1;return}this._emit("unpin-scene",{index:e})}}
              >
                📌
              </button>`:d`<span
                class="handle"
                title=${a(this.hass,"ui.drag_to_reorder","Drag to reorder")}
                @pointerdown=${h=>this._drag.start(e,h)}
                >⠿</span
              >`}
        </span>
        <span class="idx">${n}</span>
        <span class="warn-slot">${this._problemFlag(i)||this._liveDot(e,i)}</span>
        <div class="body" @click=${()=>this._toggleScene(e)}>
          <div class="name">
            ${Ji(i,a(this.hass,"ui.scene_n","Scene {n}").replace("{n}",String(n)))}
            ${u&&!this._expanded.has(e)?d`<ambience-help
                    class="name-help"
                    .hass=${this.hass}
                    multiline
                    .text=${i.description}
                  ></ambience-help>`:""}
          </div>
          <div class="summary">
            ${this._expanded.has(e)?"":i.actions.length===0?this._blockerSummary(i):d`${this._whenSummary(i)} ·
                    <span class="action-count"
                      >${this._actionCountLabel(i)}</span
                    >${i.apply==="always"?d` ·
                          <span class="apply-every" data-test="apply-every"
                            >${a(this.hass,"ui.apply_on_every_match","Apply on every match")}</span
                          >`:""}`}
          </div>
          ${this._expanded.has(e)?d`
                <div class="scene-detail">
                  ${u?d`<div class="scene-description">${i.description}</div>`:""}
                  ${this._whenStacked(i)}
                  ${i.actions.length===0?d`<div class="noop-detail">
                        ${this._blockerSummary(i)}
                      </div>`:d`<div class="actions-detail">
                        ${i.actions.map(h=>{let p=this._actionParamsString(h),f=this._actionLabel(h),_=p?`${f} \xB7 ${p}`:f;return d`
                            <div class="actions-detail-item">
                              <div class="action-header">${_}</div>
                              ${h.entity_ids.length===0?d`<div class="no-targets">
                                    ${a(this.hass,"ui.no_targets","(no targets)")}
                                  </div>`:d`<ul class="entity-list">
                                    ${h.entity_ids.map(v=>d`<li>${this._entityName(v)}</li>`)}
                                  </ul>`}
                            </div>
                          `})}
                      </div>
                      ${i.apply==="always"?d`<div class="apply-every-detail" data-test="apply-every-detail">
                            ${a(this.hass,"ui.apply_on_every_match","Apply on every match")}
                          </div>`:""}`}
                </div>
              `:""}
        </div>
        <button
          class="toggle"
          @click=${h=>{h.stopPropagation(),this._emit("toggle-scene-enabled",{index:e,enabled:o})}}
          title=${l}
          aria-label=${l}
        >
          <ha-icon
            icon=${o?"mdi:toggle-switch-off-outline":"mdi:toggle-switch"}
          ></ha-icon>
        </button>
        <ambience-kebab-menu
          class="row-kebab"
          .hass=${this.hass}
          .label=${a(this.hass,"ui.scene_actions","Scene actions")}
          .items=${[{id:"edit",label:a(this.hass,"ui.edit","Edit"),icon:"mdi:pencil"},{id:"duplicate",label:a(this.hass,"ui.duplicate","Duplicate"),icon:"mdi:content-duplicate"},{id:"run",label:a(this.hass,"ui.run_actions","Run actions"),icon:"mdi:play"},{id:"delete",label:a(this.hass,"ui.title_delete","Delete"),icon:"mdi:delete",danger:!0,dividerBefore:!0}]}
          @menu-action=${h=>this._onSceneMenu(e,h.detail.id)}
        ></ambience-kebab-menu>
      </li>
    `}render(){let e=this._sections().filter(n=>n.rows.length>0);if(e.length===0){let n=this.filterCategory?{category:this.filterCategory}:{};return d`
        <p class="empty">
          ${a(this.hass,"ui.no_scenes_yet","No scenes yet.")}
        </p>
        <button class="add" @click=${()=>this._emit("add-scene",n)}>
          ${a(this.hass,"ui.add_scene","+ Add scene")}
        </button>
      `}let i=this.categories.length>0;return d`
      ${e.map(n=>{let s=!!n.category&&this.collapsedCategories.includes(n.category.id);return d`
          <div class="category-section">
            ${i&&n.category?this._renderSectionHeader(n.category,!s,n.rows):""}
            ${s?"":d`
                  <ul>
                    ${n.rows.map(([o,l],u)=>this._renderRow(o,l,u+1))}
                  </ul>
                  <button
                    class="add"
                    @click=${()=>this._emit("add-scene",{category:n.category?.id})}
                  >
                    ${a(this.hass,"ui.add_scene","+ Add scene")}
                  </button>
                `}
          </div>
        `})}
    `}};I.styles=y`
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
  `,c([m({attribute:!1})],I.prototype,"scenes",2),c([m({attribute:!1})],I.prototype,"periods",2),c([m({attribute:!1})],I.prototype,"luxRanges",2),c([m({attribute:!1})],I.prototype,"weatherConfig",2),c([m({attribute:!1})],I.prototype,"hass",2),c([m({attribute:!1})],I.prototype,"conditions",2),c([m({attribute:!1})],I.prototype,"availableActions",2),c([m({attribute:!1})],I.prototype,"schemas",2),c([m({attribute:!1})],I.prototype,"categories",2),c([m({attribute:!1})],I.prototype,"filterCategory",2),c([m({attribute:!1})],I.prototype,"collapsedCategories",2),c([m({attribute:!1})],I.prototype,"scope",2),c([m({attribute:!1})],I.prototype,"live",2),c([m({attribute:!1})],I.prototype,"liveSuppressed",2),c([g()],I.prototype,"_expanded",2),I=c([w("ambience-scenes-list")],I);var he=class extends b{constructor(){super(...arguments);this.entities=[];this.value=[];this.target=null;this.label=" "}_filteredEntities(){return Ys(this.entities,this.target)}connectedCallback(){super.connectedCallback(),re(this)}_emit(e){L(this,e)}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let i=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this._filteredEntities()}}}],n=this.label;return d`
      <ha-form
        .hass=${this.hass}
        .schema=${i}
        .data=${{entity_ids:this.value}}
        .computeLabel=${()=>n}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,i){let n=new Set(this.value);i?n.add(e):n.delete(e),this._emit(this._filteredEntities().filter(s=>n.has(s)))}_renderFallback(){let e=this._filteredEntities();return e.length===0?d`<p class="empty">${a(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:d`
      <div class="checkboxes">
        ${e.map(i=>d`
            <label>
              <input
                type="checkbox"
                .checked=${this.value.includes(i)}
                @change=${n=>this._toggle(i,n.target.checked)}
              />
              ${i}
            </label>
          `)}
      </div>
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};he.styles=y`
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
  `,c([m({attribute:!1})],he.prototype,"hass",2),c([m({attribute:!1})],he.prototype,"entities",2),c([m({attribute:!1})],he.prototype,"value",2),c([m({attribute:!1})],he.prototype,"target",2),c([m()],he.prototype,"label",2),he=c([w("ambience-target-picker")],he);var W=class extends b{constructor(){super(...arguments);this.entityIds=[];this.params={};this.excludeEntities=[];this._schema=void 0;this._schemaError=null;this._exposedMissing=!1;this._formSchema=[];this._perFieldSchemas={};this._schemaServiceId=null;this._onTargetChanged=e=>{e.stopPropagation(),this._emit("entity-ids-changed",{entityIds:e.detail.value})};this._onFieldInput=e=>i=>{i.stopPropagation();let n=i.target,s={...this.params,[e]:n.value};this._emit("params-changed",{params:s})};this._onHaFormChanged=e=>{e.stopPropagation(),this._emit("params-changed",{params:{...this.params,...e.detail.value}})}}connectedCallback(){super.connectedCallback(),re(this)}willUpdate(e){if((e.has("exposed")&&e.get("exposed")?.id!==this.exposed?.id||e.has("hass")&&this._schema===void 0&&this._schemaServiceId!==this.exposed?.id)&&this._loadSchema(),(e.has("exposed")||e.has("_schema"))&&(this._formSchema=this._buildFormSchema()),e.has("_formSchema")||e.has("_schema")||e.has("exposed")){let i={};for(let n of this._formSchema)i[n.name]=[n];this._perFieldSchemas=i}}async _loadSchema(){if(this.exposed===void 0&&this.hass){this._exposedMissing=!0,this._schema=null,this._schemaServiceId=null;return}let e=this.exposed?.id;if(!e||!this.hass){this._exposedMissing=!1,this._schema=void 0,this._schemaServiceId=null;return}this._exposedMissing=!1,this._schemaServiceId=e,this._schemaError=null,this._schema=void 0;try{let i=await De(this.hass,e);if(this._schemaServiceId!==e)return;this._schema=i}catch(i){if(this._schemaServiceId!==e)return;this._schema=null,this._schemaError=E(this.hass,i)}}_buildFormSchema(){let e=this._schema,i=this.exposed;if(!e||!i)return[];let n=new Set(i.visible_fields??[]),s=[];for(let[o,l]of Object.entries(e.fields))n.has(o)&&s.push({name:o,selector:l.selector??{text:{}},required:!!l.required,description:typeof l.description=="string"&&l.description?l.description:void 0});return s}updated(e){super.updated?.(e),e.has("_schema")&&this.dispatchEvent(new CustomEvent("target-mode-changed",{detail:{hasTarget:this.hasTarget()},bubbles:!0,composed:!0}))}_hasTarget(){let e=this._schema?.target??null;return!e||typeof e!="object"?!1:Object.keys(e).length>0}hasTarget(){return this._schema===void 0?!1:this._hasTarget()}_scopeEntities(){return!this.scope||!this.hass?[]:zi(this.hass,this.scope,[])}_renderTargetPicker(){if(!this._hasTarget())return"";let e=new Set(this.excludeEntities),i=this._scopeEntities().filter(o=>!e.has(o)),n=this._schema?.target??null,s=a(this.hass,"ui.target","Target");return d`
      <div class="target-picker field-row">
        <div class="field-header">
          <span class="field-label">${s}</span>
        </div>
        <ambience-target-picker
          .hass=${this.hass}
          .entities=${i}
          .target=${n}
          .value=${this.entityIds}
          .label=${" "}
          @value-changed=${this._onTargetChanged}
        ></ambience-target-picker>
      </div>
    `}_humanizeFieldLabel(e){let i=this._schema?.fields[e];return i?.name?i.name:z(e)}_clearField(e){if(!(e in this.params))return;let i={...this.params};delete i[e],this._emit("params-changed",{params:i})}_extraParamKeys(){let e=new Set;for(let i of this._formSchema)e.add(i.name);for(let i of Object.keys(this.exposed?.defaults??{}))e.add(i);return Object.keys(this.params).filter(i=>!e.has(i))}_clearExtraParams(){let e=new Set(this._extraParamKeys());if(e.size===0)return;let i={};for(let[n,s]of Object.entries(this.params))e.has(n)||(i[n]=s);this._emit("params-changed",{params:i})}_fieldData(e){return e in this.params?{[e]:this.params[e]}:{}}_defaultHintSuffix(e){let i=this.exposed?.defaults??{};if(!(e.name in i))return"";let n=Xi(e.selector),s=Oe(this.hass,i[e.name]);return` (${a(this.hass,"ui.default_prefix","Default: ")}${s}${n?` ${n}`:""})`}_hasUserOverride(e){return e in this.params}_renderExtraParamsNotice(){let e=this._extraParamKeys();if(e.length===0)return"";let i=e.join(", ");return d`
      <div class="extra-params-notice" data-extra-params>
        <span>
          ${a(this.hass,"ui.extra_fields_prefix","Extra fields:")} ${i}.
          ${a(this.hass,"ui.extra_fields_hint","These fields aren't currently exposed but will still be sent.")}
        </span>
        <button data-remove-extras @click=${()=>this._clearExtraParams()}>
          ${a(this.hass,"ui.remove","Remove")}
        </button>
      </div>
    `}_renderFieldsForm(){let e=this._formSchema,i=this._renderExtraParamsNotice();return e.length===0?i===""?"":d`<div class="fields-form">${i}</div>`:customElements.get("ha-form")?d`
        <div class="fields-form">
          ${e.map(n=>{let s=this._perFieldSchemas[n.name]??[n],o=this._fieldData(n.name),l=this._defaultHintSuffix(n);return d`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <span class="field-label">${this._humanizeFieldLabel(n.name)}${n.required?" *":""}</span>${l?d`<span class="field-default-hint">${l}</span>`:""}
                  </span>
                  ${this._hasUserOverride(n.name)?d`<button
                        class="field-clear"
                        data-clear=${n.name}
                        @click=${()=>this._clearField(n.name)}
                        title=${a(this.hass,"ui.clear_default","Clear default")}
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
        ${e.map(n=>{let s=this._fieldData(n.name),o=n.name in s?String(s[n.name]??""):"",l=this._defaultHintSuffix(n);return d`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <label class="field-label">${this._humanizeFieldLabel(n.name)}${n.required?" *":""}</label>${l?d`<span class="field-default-hint">${l}</span>`:""}
                  </span>
                  ${this._hasUserOverride(n.name)?d`<button
                        class="field-clear"
                        data-clear=${n.name}
                        @click=${()=>this._clearField(n.name)}
                        title=${a(this.hass,"ui.clear_default","Clear default")}
                      >✕</button>`:""}
                </div>
                <input
                  type="text"
                  data-field=${n.name}
                  .value=${o}
                  @input=${this._onFieldInput(n.name)}
                />
              </div>
            `})}
        ${i}
      </div>
    `}_emit(e,i){this.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}_renderRawConfig(){let e=this.service??this.exposed?.id;if(!e)return"";let i=Object.entries(this.params??{});return d`
      <dl class="raw-config" data-raw-config>
        <div class="raw-row">
          <dt>${a(this.hass,"ui.raw_config_action","Action")}:</dt>
          <dd>${e}</dd>
        </div>
        ${this.entityIds.length?d`<div class="raw-row">
                <dt>${a(this.hass,"ui.raw_config_targets","Targets")}:</dt>
                <dd>${this.entityIds.join(", ")}</dd>
              </div>`:""}
        ${i.length?d`<div class="raw-row">
                <dt>${a(this.hass,"ui.raw_config_params","Parameters")}:</dt>
                <dd>${i.map(([n,s])=>`${n}: ${s==null?"":Kr(s)}`).join(", ")}</dd>
              </div>`:""}
      </dl>
    `}render(){if(this._schema===null){let n=this._exposedMissing?a(this.hass,"ui.action_unavailable","Action no longer available; configure it in Settings \u2192 Actions or remove this action."):this._schemaError??a(this.hass,"ui.service_unavailable","Service not available in this HA instance.");return d`
        <div class="schema-error">${n}</div>
        ${this._renderRawConfig()}
      `}if(this._schema===void 0)return d`<div>${a(this.hass,"ui.loading","Loading\u2026")}</div>`;let e=this._renderTargetPicker(),i=this._renderFieldsForm();return e===""&&i===""?d`<div class="no-params">${a(this.hass,"ui.action_no_parameters","This action has no configurable fields.")}</div>`:d`${e}${i}`}};W.styles=y`
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
  `,c([m({attribute:!1})],W.prototype,"hass",2),c([m({attribute:!1})],W.prototype,"scope",2),c([m({attribute:!1})],W.prototype,"exposed",2),c([m({attribute:!1})],W.prototype,"service",2),c([m({attribute:!1})],W.prototype,"entityIds",2),c([m({attribute:!1})],W.prototype,"params",2),c([m({attribute:!1})],W.prototype,"excludeEntities",2),c([g()],W.prototype,"_schema",2),c([g()],W.prototype,"_schemaError",2),c([g()],W.prototype,"_exposedMissing",2),c([g()],W.prototype,"_formSchema",2),c([g()],W.prototype,"_perFieldSchemas",2),W=c([w("ambience-action-slot")],W);function Eo(t){return typeof t>"u"||t===null}function Tl(t){return typeof t=="object"&&t!==null}function Al(t){return Array.isArray(t)?t:Eo(t)?[]:[t]}function Pl(t,r){var e,i,n,s;if(r)for(s=Object.keys(r),e=0,i=s.length;e<i;e+=1)n=s[e],t[n]=r[n];return t}function Rl(t,r){var e="",i;for(i=0;i<r;i+=1)e+=t;return e}function Dl(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var Hl=Eo,Nl=Tl,Il=Al,Ol=Rl,Fl=Dl,Ml=Pl,F={isNothing:Hl,isObject:Nl,toArray:Il,repeat:Ol,isNegativeZero:Fl,extend:Ml};function So(t,r){var e="",i=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(e+='in "'+t.mark.name+'" '),e+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!r&&t.mark.snippet&&(e+=`

`+t.mark.snippet),i+" "+e):i}function ti(t,r){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=r,this.message=So(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}ti.prototype=Object.create(Error.prototype);ti.prototype.constructor=ti;ti.prototype.toString=function(r){return this.name+": "+So(this,r)};var ee=ti;function Jr(t,r,e,i,n){var s="",o="",l=Math.floor(n/2)-1;return i-r>l&&(s=" ... ",r=i-l+s.length),e-i>l&&(o=" ...",e=i+l-o.length),{str:s+t.slice(r,e).replace(/\t/g,"\u2192")+o,pos:i-r+s.length}}function Xr(t,r){return F.repeat(" ",r-t.length)+t}function jl(t,r){if(r=Object.create(r||null),!t.buffer)return null;r.maxLength||(r.maxLength=79),typeof r.indent!="number"&&(r.indent=1),typeof r.linesBefore!="number"&&(r.linesBefore=3),typeof r.linesAfter!="number"&&(r.linesAfter=2);for(var e=/\r?\n|\r|\0/g,i=[0],n=[],s,o=-1;s=e.exec(t.buffer);)n.push(s.index),i.push(s.index+s[0].length),t.position<=s.index&&o<0&&(o=i.length-2);o<0&&(o=i.length-1);var l="",u,h,p=Math.min(t.line+r.linesAfter,n.length).toString().length,f=r.maxLength-(r.indent+p+3);for(u=1;u<=r.linesBefore&&!(o-u<0);u++)h=Jr(t.buffer,i[o-u],n[o-u],t.position-(i[o]-i[o-u]),f),l=F.repeat(" ",r.indent)+Xr((t.line-u+1).toString(),p)+" | "+h.str+`
`+l;for(h=Jr(t.buffer,i[o],n[o],t.position,f),l+=F.repeat(" ",r.indent)+Xr((t.line+1).toString(),p)+" | "+h.str+`
`,l+=F.repeat("-",r.indent+p+3+h.pos)+`^
`,u=1;u<=r.linesAfter&&!(o+u>=n.length);u++)h=Jr(t.buffer,i[o+u],n[o+u],t.position-(i[o]-i[o+u]),f),l+=F.repeat(" ",r.indent)+Xr((t.line+u+1).toString(),p)+" | "+h.str+`
`;return l.replace(/\n$/,"")}var zl=jl,Ul=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Wl=["scalar","sequence","mapping"];function Bl(t){var r={};return t!==null&&Object.keys(t).forEach(function(e){t[e].forEach(function(i){r[String(i)]=e})}),r}function ql(t,r){if(r=r||{},Object.keys(r).forEach(function(e){if(Ul.indexOf(e)===-1)throw new ee('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.options=r,this.tag=t,this.kind=r.kind||null,this.resolve=r.resolve||function(){return!0},this.construct=r.construct||function(e){return e},this.instanceOf=r.instanceOf||null,this.predicate=r.predicate||null,this.represent=r.represent||null,this.representName=r.representName||null,this.defaultStyle=r.defaultStyle||null,this.multi=r.multi||!1,this.styleAliases=Bl(r.styleAliases||null),Wl.indexOf(this.kind)===-1)throw new ee('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var q=ql;function uo(t,r){var e=[];return t[r].forEach(function(i){var n=e.length;e.forEach(function(s,o){s.tag===i.tag&&s.kind===i.kind&&s.multi===i.multi&&(n=o)}),e[n]=i}),e}function Vl(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},r,e;function i(n){n.multi?(t.multi[n.kind].push(n),t.multi.fallback.push(n)):t[n.kind][n.tag]=t.fallback[n.tag]=n}for(r=0,e=arguments.length;r<e;r+=1)arguments[r].forEach(i);return t}function en(t){return this.extend(t)}en.prototype.extend=function(r){var e=[],i=[];if(r instanceof q)i.push(r);else if(Array.isArray(r))i=i.concat(r);else if(r&&(Array.isArray(r.implicit)||Array.isArray(r.explicit)))r.implicit&&(e=e.concat(r.implicit)),r.explicit&&(i=i.concat(r.explicit));else throw new ee("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.forEach(function(s){if(!(s instanceof q))throw new ee("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new ee("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new ee("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),i.forEach(function(s){if(!(s instanceof q))throw new ee("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var n=Object.create(en.prototype);return n.implicit=(this.implicit||[]).concat(e),n.explicit=(this.explicit||[]).concat(i),n.compiledImplicit=uo(n,"implicit"),n.compiledExplicit=uo(n,"explicit"),n.compiledTypeMap=Vl(n.compiledImplicit,n.compiledExplicit),n};var Kl=en,Gl=new q("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),Yl=new q("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),Ql=new q("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),Jl=new Kl({explicit:[Gl,Yl,Ql]});function Xl(t){if(t===null)return!0;var r=t.length;return r===1&&t==="~"||r===4&&(t==="null"||t==="Null"||t==="NULL")}function Zl(){return null}function ed(t){return t===null}var td=new q("tag:yaml.org,2002:null",{kind:"scalar",resolve:Xl,construct:Zl,predicate:ed,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function id(t){if(t===null)return!1;var r=t.length;return r===4&&(t==="true"||t==="True"||t==="TRUE")||r===5&&(t==="false"||t==="False"||t==="FALSE")}function rd(t){return t==="true"||t==="True"||t==="TRUE"}function nd(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var sd=new q("tag:yaml.org,2002:bool",{kind:"scalar",resolve:id,construct:rd,predicate:nd,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function od(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function ad(t){return 48<=t&&t<=55}function ld(t){return 48<=t&&t<=57}function dd(t){if(t===null)return!1;var r=t.length,e=0,i=!1,n;if(!r)return!1;if(n=t[e],(n==="-"||n==="+")&&(n=t[++e]),n==="0"){if(e+1===r)return!0;if(n=t[++e],n==="b"){for(e++;e<r;e++)if(n=t[e],n!=="_"){if(n!=="0"&&n!=="1")return!1;i=!0}return i&&n!=="_"}if(n==="x"){for(e++;e<r;e++)if(n=t[e],n!=="_"){if(!od(t.charCodeAt(e)))return!1;i=!0}return i&&n!=="_"}if(n==="o"){for(e++;e<r;e++)if(n=t[e],n!=="_"){if(!ad(t.charCodeAt(e)))return!1;i=!0}return i&&n!=="_"}}if(n==="_")return!1;for(;e<r;e++)if(n=t[e],n!=="_"){if(!ld(t.charCodeAt(e)))return!1;i=!0}return!(!i||n==="_")}function cd(t){var r=t,e=1,i;if(r.indexOf("_")!==-1&&(r=r.replace(/_/g,"")),i=r[0],(i==="-"||i==="+")&&(i==="-"&&(e=-1),r=r.slice(1),i=r[0]),r==="0")return 0;if(i==="0"){if(r[1]==="b")return e*parseInt(r.slice(2),2);if(r[1]==="x")return e*parseInt(r.slice(2),16);if(r[1]==="o")return e*parseInt(r.slice(2),8)}return e*parseInt(r,10)}function ud(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!F.isNegativeZero(t)}var hd=new q("tag:yaml.org,2002:int",{kind:"scalar",resolve:dd,construct:cd,predicate:ud,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),pd=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function md(t){return!(t===null||!pd.test(t)||t[t.length-1]==="_")}function fd(t){var r,e;return r=t.replace(/_/g,"").toLowerCase(),e=r[0]==="-"?-1:1,"+-".indexOf(r[0])>=0&&(r=r.slice(1)),r===".inf"?e===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:r===".nan"?NaN:e*parseFloat(r,10)}var gd=/^[-+]?[0-9]+e/;function _d(t,r){var e;if(isNaN(t))switch(r){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(r){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(r){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(F.isNegativeZero(t))return"-0.0";return e=t.toString(10),gd.test(e)?e.replace("e",".e"):e}function vd(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||F.isNegativeZero(t))}var yd=new q("tag:yaml.org,2002:float",{kind:"scalar",resolve:md,construct:fd,predicate:vd,represent:_d,defaultStyle:"lowercase"}),bd=Jl.extend({implicit:[td,sd,hd,yd]}),wd=bd,Lo=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),To=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function xd(t){return t===null?!1:Lo.exec(t)!==null||To.exec(t)!==null}function $d(t){var r,e,i,n,s,o,l,u=0,h=null,p,f,_;if(r=Lo.exec(t),r===null&&(r=To.exec(t)),r===null)throw new Error("Date resolve error");if(e=+r[1],i=+r[2]-1,n=+r[3],!r[4])return new Date(Date.UTC(e,i,n));if(s=+r[4],o=+r[5],l=+r[6],r[7]){for(u=r[7].slice(0,3);u.length<3;)u+="0";u=+u}return r[9]&&(p=+r[10],f=+(r[11]||0),h=(p*60+f)*6e4,r[9]==="-"&&(h=-h)),_=new Date(Date.UTC(e,i,n,s,o,l,u)),h&&_.setTime(_.getTime()-h),_}function kd(t){return t.toISOString()}var Cd=new q("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:xd,construct:$d,instanceOf:Date,represent:kd});function Ed(t){return t==="<<"||t===null}var Sd=new q("tag:yaml.org,2002:merge",{kind:"scalar",resolve:Ed}),on=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function Ld(t){if(t===null)return!1;var r,e,i=0,n=t.length,s=on;for(e=0;e<n;e++)if(r=s.indexOf(t.charAt(e)),!(r>64)){if(r<0)return!1;i+=6}return i%8===0}function Td(t){var r,e,i=t.replace(/[\r\n=]/g,""),n=i.length,s=on,o=0,l=[];for(r=0;r<n;r++)r%4===0&&r&&(l.push(o>>16&255),l.push(o>>8&255),l.push(o&255)),o=o<<6|s.indexOf(i.charAt(r));return e=n%4*6,e===0?(l.push(o>>16&255),l.push(o>>8&255),l.push(o&255)):e===18?(l.push(o>>10&255),l.push(o>>2&255)):e===12&&l.push(o>>4&255),new Uint8Array(l)}function Ad(t){var r="",e=0,i,n,s=t.length,o=on;for(i=0;i<s;i++)i%3===0&&i&&(r+=o[e>>18&63],r+=o[e>>12&63],r+=o[e>>6&63],r+=o[e&63]),e=(e<<8)+t[i];return n=s%3,n===0?(r+=o[e>>18&63],r+=o[e>>12&63],r+=o[e>>6&63],r+=o[e&63]):n===2?(r+=o[e>>10&63],r+=o[e>>4&63],r+=o[e<<2&63],r+=o[64]):n===1&&(r+=o[e>>2&63],r+=o[e<<4&63],r+=o[64],r+=o[64]),r}function Pd(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var Rd=new q("tag:yaml.org,2002:binary",{kind:"scalar",resolve:Ld,construct:Td,predicate:Pd,represent:Ad}),Dd=Object.prototype.hasOwnProperty,Hd=Object.prototype.toString;function Nd(t){if(t===null)return!0;var r=[],e,i,n,s,o,l=t;for(e=0,i=l.length;e<i;e+=1){if(n=l[e],o=!1,Hd.call(n)!=="[object Object]")return!1;for(s in n)if(Dd.call(n,s))if(!o)o=!0;else return!1;if(!o)return!1;if(r.indexOf(s)===-1)r.push(s);else return!1}return!0}function Id(t){return t!==null?t:[]}var Od=new q("tag:yaml.org,2002:omap",{kind:"sequence",resolve:Nd,construct:Id}),Fd=Object.prototype.toString;function Md(t){if(t===null)return!0;var r,e,i,n,s,o=t;for(s=new Array(o.length),r=0,e=o.length;r<e;r+=1){if(i=o[r],Fd.call(i)!=="[object Object]"||(n=Object.keys(i),n.length!==1))return!1;s[r]=[n[0],i[n[0]]]}return!0}function jd(t){if(t===null)return[];var r,e,i,n,s,o=t;for(s=new Array(o.length),r=0,e=o.length;r<e;r+=1)i=o[r],n=Object.keys(i),s[r]=[n[0],i[n[0]]];return s}var zd=new q("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:Md,construct:jd}),Ud=Object.prototype.hasOwnProperty;function Wd(t){if(t===null)return!0;var r,e=t;for(r in e)if(Ud.call(e,r)&&e[r]!==null)return!1;return!0}function Bd(t){return t!==null?t:{}}var qd=new q("tag:yaml.org,2002:set",{kind:"mapping",resolve:Wd,construct:Bd}),Ao=wd.extend({implicit:[Cd,Sd],explicit:[Rd,Od,zd,qd]}),Me=Object.prototype.hasOwnProperty,tr=1,Po=2,Ro=3,ir=4,Zr=1,Vd=2,ho=3,Kd=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Gd=/[\x85\u2028\u2029]/,Yd=/[,\[\]\{\}]/,Do=/^(?:!|!!|![a-z\-]+!)$/i,Ho=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function po(t){return Object.prototype.toString.call(t)}function pe(t){return t===10||t===13}function nt(t){return t===9||t===32}function te(t){return t===9||t===32||t===10||t===13}function Et(t){return t===44||t===91||t===93||t===123||t===125}function Qd(t){var r;return 48<=t&&t<=57?t-48:(r=t|32,97<=r&&r<=102?r-97+10:-1)}function Jd(t){return t===120?2:t===117?4:t===85?8:0}function Xd(t){return 48<=t&&t<=57?t-48:-1}function mo(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"\x85":t===95?"\xA0":t===76?"\u2028":t===80?"\u2029":""}function Zd(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function No(t,r,e){r==="__proto__"?Object.defineProperty(t,r,{configurable:!0,enumerable:!0,writable:!0,value:e}):t[r]=e}var Io=new Array(256),Oo=new Array(256);for(rt=0;rt<256;rt++)Io[rt]=mo(rt)?1:0,Oo[rt]=mo(rt);var rt;function ec(t,r){this.input=t,this.filename=r.filename||null,this.schema=r.schema||Ao,this.onWarning=r.onWarning||null,this.legacy=r.legacy||!1,this.json=r.json||!1,this.listener=r.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Fo(t,r){var e={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return e.snippet=zl(e),new ee(r,e)}function k(t,r){throw Fo(t,r)}function rr(t,r){t.onWarning&&t.onWarning.call(null,Fo(t,r))}var fo={YAML:function(r,e,i){var n,s,o;r.version!==null&&k(r,"duplication of %YAML directive"),i.length!==1&&k(r,"YAML directive accepts exactly one argument"),n=/^([0-9]+)\.([0-9]+)$/.exec(i[0]),n===null&&k(r,"ill-formed argument of the YAML directive"),s=parseInt(n[1],10),o=parseInt(n[2],10),s!==1&&k(r,"unacceptable YAML version of the document"),r.version=i[0],r.checkLineBreaks=o<2,o!==1&&o!==2&&rr(r,"unsupported YAML version of the document")},TAG:function(r,e,i){var n,s;i.length!==2&&k(r,"TAG directive accepts exactly two arguments"),n=i[0],s=i[1],Do.test(n)||k(r,"ill-formed tag handle (first argument) of the TAG directive"),Me.call(r.tagMap,n)&&k(r,'there is a previously declared suffix for "'+n+'" tag handle'),Ho.test(s)||k(r,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{k(r,"tag prefix is malformed: "+s)}r.tagMap[n]=s}};function Fe(t,r,e,i){var n,s,o,l;if(r<e){if(l=t.input.slice(r,e),i)for(n=0,s=l.length;n<s;n+=1)o=l.charCodeAt(n),o===9||32<=o&&o<=1114111||k(t,"expected valid JSON character");else Kd.test(l)&&k(t,"the stream contains non-printable characters");t.result+=l}}function go(t,r,e,i){var n,s,o,l;for(F.isObject(e)||k(t,"cannot merge mappings; the provided source object is unacceptable"),n=Object.keys(e),o=0,l=n.length;o<l;o+=1)s=n[o],Me.call(r,s)||(No(r,s,e[s]),i[s]=!0)}function St(t,r,e,i,n,s,o,l,u){var h,p;if(Array.isArray(n))for(n=Array.prototype.slice.call(n),h=0,p=n.length;h<p;h+=1)Array.isArray(n[h])&&k(t,"nested arrays are not supported inside keys"),typeof n=="object"&&po(n[h])==="[object Object]"&&(n[h]="[object Object]");if(typeof n=="object"&&po(n)==="[object Object]"&&(n="[object Object]"),n=String(n),r===null&&(r={}),i==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(h=0,p=s.length;h<p;h+=1)go(t,r,s[h],e);else go(t,r,s,e);else!t.json&&!Me.call(e,n)&&Me.call(r,n)&&(t.line=o||t.line,t.lineStart=l||t.lineStart,t.position=u||t.position,k(t,"duplicated mapping key")),No(r,n,s),delete e[n];return r}function an(t){var r;r=t.input.charCodeAt(t.position),r===10?t.position++:r===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):k(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function O(t,r,e){for(var i=0,n=t.input.charCodeAt(t.position);n!==0;){for(;nt(n);)n===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),n=t.input.charCodeAt(++t.position);if(r&&n===35)do n=t.input.charCodeAt(++t.position);while(n!==10&&n!==13&&n!==0);if(pe(n))for(an(t),n=t.input.charCodeAt(t.position),i++,t.lineIndent=0;n===32;)t.lineIndent++,n=t.input.charCodeAt(++t.position);else break}return e!==-1&&i!==0&&t.lineIndent<e&&rr(t,"deficient indentation"),i}function or(t){var r=t.position,e;return e=t.input.charCodeAt(r),!!((e===45||e===46)&&e===t.input.charCodeAt(r+1)&&e===t.input.charCodeAt(r+2)&&(r+=3,e=t.input.charCodeAt(r),e===0||te(e)))}function ln(t,r){r===1?t.result+=" ":r>1&&(t.result+=F.repeat(`
`,r-1))}function tc(t,r,e){var i,n,s,o,l,u,h,p,f=t.kind,_=t.result,v;if(v=t.input.charCodeAt(t.position),te(v)||Et(v)||v===35||v===38||v===42||v===33||v===124||v===62||v===39||v===34||v===37||v===64||v===96||(v===63||v===45)&&(n=t.input.charCodeAt(t.position+1),te(n)||e&&Et(n)))return!1;for(t.kind="scalar",t.result="",s=o=t.position,l=!1;v!==0;){if(v===58){if(n=t.input.charCodeAt(t.position+1),te(n)||e&&Et(n))break}else if(v===35){if(i=t.input.charCodeAt(t.position-1),te(i))break}else{if(t.position===t.lineStart&&or(t)||e&&Et(v))break;if(pe(v))if(u=t.line,h=t.lineStart,p=t.lineIndent,O(t,!1,-1),t.lineIndent>=r){l=!0,v=t.input.charCodeAt(t.position);continue}else{t.position=o,t.line=u,t.lineStart=h,t.lineIndent=p;break}}l&&(Fe(t,s,o,!1),ln(t,t.line-u),s=o=t.position,l=!1),nt(v)||(o=t.position+1),v=t.input.charCodeAt(++t.position)}return Fe(t,s,o,!1),t.result?!0:(t.kind=f,t.result=_,!1)}function ic(t,r){var e,i,n;if(e=t.input.charCodeAt(t.position),e!==39)return!1;for(t.kind="scalar",t.result="",t.position++,i=n=t.position;(e=t.input.charCodeAt(t.position))!==0;)if(e===39)if(Fe(t,i,t.position,!0),e=t.input.charCodeAt(++t.position),e===39)i=t.position,t.position++,n=t.position;else return!0;else pe(e)?(Fe(t,i,n,!0),ln(t,O(t,!1,r)),i=n=t.position):t.position===t.lineStart&&or(t)?k(t,"unexpected end of the document within a single quoted scalar"):(t.position++,n=t.position);k(t,"unexpected end of the stream within a single quoted scalar")}function rc(t,r){var e,i,n,s,o,l;if(l=t.input.charCodeAt(t.position),l!==34)return!1;for(t.kind="scalar",t.result="",t.position++,e=i=t.position;(l=t.input.charCodeAt(t.position))!==0;){if(l===34)return Fe(t,e,t.position,!0),t.position++,!0;if(l===92){if(Fe(t,e,t.position,!0),l=t.input.charCodeAt(++t.position),pe(l))O(t,!1,r);else if(l<256&&Io[l])t.result+=Oo[l],t.position++;else if((o=Jd(l))>0){for(n=o,s=0;n>0;n--)l=t.input.charCodeAt(++t.position),(o=Qd(l))>=0?s=(s<<4)+o:k(t,"expected hexadecimal character");t.result+=Zd(s),t.position++}else k(t,"unknown escape sequence");e=i=t.position}else pe(l)?(Fe(t,e,i,!0),ln(t,O(t,!1,r)),e=i=t.position):t.position===t.lineStart&&or(t)?k(t,"unexpected end of the document within a double quoted scalar"):(t.position++,i=t.position)}k(t,"unexpected end of the stream within a double quoted scalar")}function nc(t,r){var e=!0,i,n,s,o=t.tag,l,u=t.anchor,h,p,f,_,v,x=Object.create(null),C,A,J,T;if(T=t.input.charCodeAt(t.position),T===91)p=93,v=!1,l=[];else if(T===123)p=125,v=!0,l={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=l),T=t.input.charCodeAt(++t.position);T!==0;){if(O(t,!0,r),T=t.input.charCodeAt(t.position),T===p)return t.position++,t.tag=o,t.anchor=u,t.kind=v?"mapping":"sequence",t.result=l,!0;e?T===44&&k(t,"expected the node content, but found ','"):k(t,"missed comma between flow collection entries"),A=C=J=null,f=_=!1,T===63&&(h=t.input.charCodeAt(t.position+1),te(h)&&(f=_=!0,t.position++,O(t,!0,r))),i=t.line,n=t.lineStart,s=t.position,Lt(t,r,tr,!1,!0),A=t.tag,C=t.result,O(t,!0,r),T=t.input.charCodeAt(t.position),(_||t.line===i)&&T===58&&(f=!0,T=t.input.charCodeAt(++t.position),O(t,!0,r),Lt(t,r,tr,!1,!0),J=t.result),v?St(t,l,x,A,C,J,i,n,s):f?l.push(St(t,null,x,A,C,J,i,n,s)):l.push(C),O(t,!0,r),T=t.input.charCodeAt(t.position),T===44?(e=!0,T=t.input.charCodeAt(++t.position)):e=!1}k(t,"unexpected end of the stream within a flow collection")}function sc(t,r){var e,i,n=Zr,s=!1,o=!1,l=r,u=0,h=!1,p,f;if(f=t.input.charCodeAt(t.position),f===124)i=!1;else if(f===62)i=!0;else return!1;for(t.kind="scalar",t.result="";f!==0;)if(f=t.input.charCodeAt(++t.position),f===43||f===45)Zr===n?n=f===43?ho:Vd:k(t,"repeat of a chomping mode identifier");else if((p=Xd(f))>=0)p===0?k(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):o?k(t,"repeat of an indentation width identifier"):(l=r+p-1,o=!0);else break;if(nt(f)){do f=t.input.charCodeAt(++t.position);while(nt(f));if(f===35)do f=t.input.charCodeAt(++t.position);while(!pe(f)&&f!==0)}for(;f!==0;){for(an(t),t.lineIndent=0,f=t.input.charCodeAt(t.position);(!o||t.lineIndent<l)&&f===32;)t.lineIndent++,f=t.input.charCodeAt(++t.position);if(!o&&t.lineIndent>l&&(l=t.lineIndent),pe(f)){u++;continue}if(t.lineIndent<l){n===ho?t.result+=F.repeat(`
`,s?1+u:u):n===Zr&&s&&(t.result+=`
`);break}for(i?nt(f)?(h=!0,t.result+=F.repeat(`
`,s?1+u:u)):h?(h=!1,t.result+=F.repeat(`
`,u+1)):u===0?s&&(t.result+=" "):t.result+=F.repeat(`
`,u):t.result+=F.repeat(`
`,s?1+u:u),s=!0,o=!0,u=0,e=t.position;!pe(f)&&f!==0;)f=t.input.charCodeAt(++t.position);Fe(t,e,t.position,!1)}return!0}function _o(t,r){var e,i=t.tag,n=t.anchor,s=[],o,l=!1,u;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=s),u=t.input.charCodeAt(t.position);u!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,k(t,"tab characters must not be used in indentation")),!(u!==45||(o=t.input.charCodeAt(t.position+1),!te(o))));){if(l=!0,t.position++,O(t,!0,-1)&&t.lineIndent<=r){s.push(null),u=t.input.charCodeAt(t.position);continue}if(e=t.line,Lt(t,r,Ro,!1,!0),s.push(t.result),O(t,!0,-1),u=t.input.charCodeAt(t.position),(t.line===e||t.lineIndent>r)&&u!==0)k(t,"bad indentation of a sequence entry");else if(t.lineIndent<r)break}return l?(t.tag=i,t.anchor=n,t.kind="sequence",t.result=s,!0):!1}function oc(t,r,e){var i,n,s,o,l,u,h=t.tag,p=t.anchor,f={},_=Object.create(null),v=null,x=null,C=null,A=!1,J=!1,T;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=f),T=t.input.charCodeAt(t.position);T!==0;){if(!A&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,k(t,"tab characters must not be used in indentation")),i=t.input.charCodeAt(t.position+1),s=t.line,(T===63||T===58)&&te(i))T===63?(A&&(St(t,f,_,v,x,null,o,l,u),v=x=C=null),J=!0,A=!0,n=!0):A?(A=!1,n=!0):k(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,T=i;else{if(o=t.line,l=t.lineStart,u=t.position,!Lt(t,e,Po,!1,!0))break;if(t.line===s){for(T=t.input.charCodeAt(t.position);nt(T);)T=t.input.charCodeAt(++t.position);if(T===58)T=t.input.charCodeAt(++t.position),te(T)||k(t,"a whitespace character is expected after the key-value separator within a block mapping"),A&&(St(t,f,_,v,x,null,o,l,u),v=x=C=null),J=!0,A=!1,n=!1,v=t.tag,x=t.result;else if(J)k(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=h,t.anchor=p,!0}else if(J)k(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=h,t.anchor=p,!0}if((t.line===s||t.lineIndent>r)&&(A&&(o=t.line,l=t.lineStart,u=t.position),Lt(t,r,ir,!0,n)&&(A?x=t.result:C=t.result),A||(St(t,f,_,v,x,C,o,l,u),v=x=C=null),O(t,!0,-1),T=t.input.charCodeAt(t.position)),(t.line===s||t.lineIndent>r)&&T!==0)k(t,"bad indentation of a mapping entry");else if(t.lineIndent<r)break}return A&&St(t,f,_,v,x,null,o,l,u),J&&(t.tag=h,t.anchor=p,t.kind="mapping",t.result=f),J}function ac(t){var r,e=!1,i=!1,n,s,o;if(o=t.input.charCodeAt(t.position),o!==33)return!1;if(t.tag!==null&&k(t,"duplication of a tag property"),o=t.input.charCodeAt(++t.position),o===60?(e=!0,o=t.input.charCodeAt(++t.position)):o===33?(i=!0,n="!!",o=t.input.charCodeAt(++t.position)):n="!",r=t.position,e){do o=t.input.charCodeAt(++t.position);while(o!==0&&o!==62);t.position<t.length?(s=t.input.slice(r,t.position),o=t.input.charCodeAt(++t.position)):k(t,"unexpected end of the stream within a verbatim tag")}else{for(;o!==0&&!te(o);)o===33&&(i?k(t,"tag suffix cannot contain exclamation marks"):(n=t.input.slice(r-1,t.position+1),Do.test(n)||k(t,"named tag handle cannot contain such characters"),i=!0,r=t.position+1)),o=t.input.charCodeAt(++t.position);s=t.input.slice(r,t.position),Yd.test(s)&&k(t,"tag suffix cannot contain flow indicator characters")}s&&!Ho.test(s)&&k(t,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{k(t,"tag name is malformed: "+s)}return e?t.tag=s:Me.call(t.tagMap,n)?t.tag=t.tagMap[n]+s:n==="!"?t.tag="!"+s:n==="!!"?t.tag="tag:yaml.org,2002:"+s:k(t,'undeclared tag handle "'+n+'"'),!0}function lc(t){var r,e;if(e=t.input.charCodeAt(t.position),e!==38)return!1;for(t.anchor!==null&&k(t,"duplication of an anchor property"),e=t.input.charCodeAt(++t.position),r=t.position;e!==0&&!te(e)&&!Et(e);)e=t.input.charCodeAt(++t.position);return t.position===r&&k(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(r,t.position),!0}function dc(t){var r,e,i;if(i=t.input.charCodeAt(t.position),i!==42)return!1;for(i=t.input.charCodeAt(++t.position),r=t.position;i!==0&&!te(i)&&!Et(i);)i=t.input.charCodeAt(++t.position);return t.position===r&&k(t,"name of an alias node must contain at least one character"),e=t.input.slice(r,t.position),Me.call(t.anchorMap,e)||k(t,'unidentified alias "'+e+'"'),t.result=t.anchorMap[e],O(t,!0,-1),!0}function Lt(t,r,e,i,n){var s,o,l,u=1,h=!1,p=!1,f,_,v,x,C,A;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,s=o=l=ir===e||Ro===e,i&&O(t,!0,-1)&&(h=!0,t.lineIndent>r?u=1:t.lineIndent===r?u=0:t.lineIndent<r&&(u=-1)),u===1)for(;ac(t)||lc(t);)O(t,!0,-1)?(h=!0,l=s,t.lineIndent>r?u=1:t.lineIndent===r?u=0:t.lineIndent<r&&(u=-1)):l=!1;if(l&&(l=h||n),(u===1||ir===e)&&(tr===e||Po===e?C=r:C=r+1,A=t.position-t.lineStart,u===1?l&&(_o(t,A)||oc(t,A,C))||nc(t,C)?p=!0:(o&&sc(t,C)||ic(t,C)||rc(t,C)?p=!0:dc(t)?(p=!0,(t.tag!==null||t.anchor!==null)&&k(t,"alias node should not have any properties")):tc(t,C,tr===e)&&(p=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):u===0&&(p=l&&_o(t,A))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&k(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),f=0,_=t.implicitTypes.length;f<_;f+=1)if(x=t.implicitTypes[f],x.resolve(t.result)){t.result=x.construct(t.result),t.tag=x.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(Me.call(t.typeMap[t.kind||"fallback"],t.tag))x=t.typeMap[t.kind||"fallback"][t.tag];else for(x=null,v=t.typeMap.multi[t.kind||"fallback"],f=0,_=v.length;f<_;f+=1)if(t.tag.slice(0,v[f].tag.length)===v[f].tag){x=v[f];break}x||k(t,"unknown tag !<"+t.tag+">"),t.result!==null&&x.kind!==t.kind&&k(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+x.kind+'", not "'+t.kind+'"'),x.resolve(t.result,t.tag)?(t.result=x.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):k(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||p}function cc(t){var r=t.position,e,i,n,s=!1,o;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(o=t.input.charCodeAt(t.position))!==0&&(O(t,!0,-1),o=t.input.charCodeAt(t.position),!(t.lineIndent>0||o!==37));){for(s=!0,o=t.input.charCodeAt(++t.position),e=t.position;o!==0&&!te(o);)o=t.input.charCodeAt(++t.position);for(i=t.input.slice(e,t.position),n=[],i.length<1&&k(t,"directive name must not be less than one character in length");o!==0;){for(;nt(o);)o=t.input.charCodeAt(++t.position);if(o===35){do o=t.input.charCodeAt(++t.position);while(o!==0&&!pe(o));break}if(pe(o))break;for(e=t.position;o!==0&&!te(o);)o=t.input.charCodeAt(++t.position);n.push(t.input.slice(e,t.position))}o!==0&&an(t),Me.call(fo,i)?fo[i](t,i,n):rr(t,'unknown document directive "'+i+'"')}if(O(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,O(t,!0,-1)):s&&k(t,"directives end mark is expected"),Lt(t,t.lineIndent-1,ir,!1,!0),O(t,!0,-1),t.checkLineBreaks&&Gd.test(t.input.slice(r,t.position))&&rr(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&or(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,O(t,!0,-1));return}if(t.position<t.length-1)k(t,"end of the stream or a document separator is expected");else return}function Mo(t,r){t=String(t),r=r||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var e=new ec(t,r),i=t.indexOf("\0");for(i!==-1&&(e.position=i,k(e,"null byte is not allowed in input")),e.input+="\0";e.input.charCodeAt(e.position)===32;)e.lineIndent+=1,e.position+=1;for(;e.position<e.length-1;)cc(e);return e.documents}function uc(t,r,e){r!==null&&typeof r=="object"&&typeof e>"u"&&(e=r,r=null);var i=Mo(t,e);if(typeof r!="function")return i;for(var n=0,s=i.length;n<s;n+=1)r(i[n])}function hc(t,r){var e=Mo(t,r);if(e.length!==0){if(e.length===1)return e[0];throw new ee("expected a single document in the stream, but found more")}}var pc=uc,mc=hc,jo={loadAll:pc,load:mc},zo=Object.prototype.toString,Uo=Object.prototype.hasOwnProperty,dn=65279,fc=9,ii=10,gc=13,_c=32,vc=33,yc=34,tn=35,bc=37,wc=38,xc=39,$c=42,Wo=44,kc=45,nr=58,Cc=61,Ec=62,Sc=63,Lc=64,Bo=91,qo=93,Tc=96,Vo=123,Ac=124,Ko=125,V={};V[0]="\\0";V[7]="\\a";V[8]="\\b";V[9]="\\t";V[10]="\\n";V[11]="\\v";V[12]="\\f";V[13]="\\r";V[27]="\\e";V[34]='\\"';V[92]="\\\\";V[133]="\\N";V[160]="\\_";V[8232]="\\L";V[8233]="\\P";var Pc=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],Rc=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function Dc(t,r){var e,i,n,s,o,l,u;if(r===null)return{};for(e={},i=Object.keys(r),n=0,s=i.length;n<s;n+=1)o=i[n],l=String(r[o]),o.slice(0,2)==="!!"&&(o="tag:yaml.org,2002:"+o.slice(2)),u=t.compiledTypeMap.fallback[o],u&&Uo.call(u.styleAliases,l)&&(l=u.styleAliases[l]),e[o]=l;return e}function Hc(t){var r,e,i;if(r=t.toString(16).toUpperCase(),t<=255)e="x",i=2;else if(t<=65535)e="u",i=4;else if(t<=4294967295)e="U",i=8;else throw new ee("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+e+F.repeat("0",i-r.length)+r}var Nc=1,ri=2;function Ic(t){this.schema=t.schema||Ao,this.indent=Math.max(1,t.indent||2),this.noArrayIndent=t.noArrayIndent||!1,this.skipInvalid=t.skipInvalid||!1,this.flowLevel=F.isNothing(t.flowLevel)?-1:t.flowLevel,this.styleMap=Dc(this.schema,t.styles||null),this.sortKeys=t.sortKeys||!1,this.lineWidth=t.lineWidth||80,this.noRefs=t.noRefs||!1,this.noCompatMode=t.noCompatMode||!1,this.condenseFlow=t.condenseFlow||!1,this.quotingType=t.quotingType==='"'?ri:Nc,this.forceQuotes=t.forceQuotes||!1,this.replacer=typeof t.replacer=="function"?t.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function vo(t,r){for(var e=F.repeat(" ",r),i=0,n=-1,s="",o,l=t.length;i<l;)n=t.indexOf(`
`,i),n===-1?(o=t.slice(i),i=l):(o=t.slice(i,n+1),i=n+1),o.length&&o!==`
`&&(s+=e),s+=o;return s}function rn(t,r){return`
`+F.repeat(" ",t.indent*r)}function Oc(t,r){var e,i,n;for(e=0,i=t.implicitTypes.length;e<i;e+=1)if(n=t.implicitTypes[e],n.resolve(r))return!0;return!1}function sr(t){return t===_c||t===fc}function ni(t){return 32<=t&&t<=126||161<=t&&t<=55295&&t!==8232&&t!==8233||57344<=t&&t<=65533&&t!==dn||65536<=t&&t<=1114111}function yo(t){return ni(t)&&t!==dn&&t!==gc&&t!==ii}function bo(t,r,e){var i=yo(t),n=i&&!sr(t);return(e?i:i&&t!==Wo&&t!==Bo&&t!==qo&&t!==Vo&&t!==Ko)&&t!==tn&&!(r===nr&&!n)||yo(r)&&!sr(r)&&t===tn||r===nr&&n}function Fc(t){return ni(t)&&t!==dn&&!sr(t)&&t!==kc&&t!==Sc&&t!==nr&&t!==Wo&&t!==Bo&&t!==qo&&t!==Vo&&t!==Ko&&t!==tn&&t!==wc&&t!==$c&&t!==vc&&t!==Ac&&t!==Cc&&t!==Ec&&t!==xc&&t!==yc&&t!==bc&&t!==Lc&&t!==Tc}function Mc(t){return!sr(t)&&t!==nr}function ei(t,r){var e=t.charCodeAt(r),i;return e>=55296&&e<=56319&&r+1<t.length&&(i=t.charCodeAt(r+1),i>=56320&&i<=57343)?(e-55296)*1024+i-56320+65536:e}function Go(t){var r=/^\n* /;return r.test(t)}var Yo=1,nn=2,Qo=3,Jo=4,Ct=5;function jc(t,r,e,i,n,s,o,l){var u,h=0,p=null,f=!1,_=!1,v=i!==-1,x=-1,C=Fc(ei(t,0))&&Mc(ei(t,t.length-1));if(r||o)for(u=0;u<t.length;h>=65536?u+=2:u++){if(h=ei(t,u),!ni(h))return Ct;C=C&&bo(h,p,l),p=h}else{for(u=0;u<t.length;h>=65536?u+=2:u++){if(h=ei(t,u),h===ii)f=!0,v&&(_=_||u-x-1>i&&t[x+1]!==" ",x=u);else if(!ni(h))return Ct;C=C&&bo(h,p,l),p=h}_=_||v&&u-x-1>i&&t[x+1]!==" "}return!f&&!_?C&&!o&&!n(t)?Yo:s===ri?Ct:nn:e>9&&Go(t)?Ct:o?s===ri?Ct:nn:_?Jo:Qo}function zc(t,r,e,i,n){t.dump=(function(){if(r.length===0)return t.quotingType===ri?'""':"''";if(!t.noCompatMode&&(Pc.indexOf(r)!==-1||Rc.test(r)))return t.quotingType===ri?'"'+r+'"':"'"+r+"'";var s=t.indent*Math.max(1,e),o=t.lineWidth===-1?-1:Math.max(Math.min(t.lineWidth,40),t.lineWidth-s),l=i||t.flowLevel>-1&&e>=t.flowLevel;function u(h){return Oc(t,h)}switch(jc(r,l,t.indent,o,u,t.quotingType,t.forceQuotes&&!i,n)){case Yo:return r;case nn:return"'"+r.replace(/'/g,"''")+"'";case Qo:return"|"+wo(r,t.indent)+xo(vo(r,s));case Jo:return">"+wo(r,t.indent)+xo(vo(Uc(r,o),s));case Ct:return'"'+Wc(r)+'"';default:throw new ee("impossible error: invalid scalar style")}})()}function wo(t,r){var e=Go(t)?String(r):"",i=t[t.length-1]===`
`,n=i&&(t[t.length-2]===`
`||t===`
`),s=n?"+":i?"":"-";return e+s+`
`}function xo(t){return t[t.length-1]===`
`?t.slice(0,-1):t}function Uc(t,r){for(var e=/(\n+)([^\n]*)/g,i=(function(){var h=t.indexOf(`
`);return h=h!==-1?h:t.length,e.lastIndex=h,$o(t.slice(0,h),r)})(),n=t[0]===`
`||t[0]===" ",s,o;o=e.exec(t);){var l=o[1],u=o[2];s=u[0]===" ",i+=l+(!n&&!s&&u!==""?`
`:"")+$o(u,r),n=s}return i}function $o(t,r){if(t===""||t[0]===" ")return t;for(var e=/ [^ ]/g,i,n=0,s,o=0,l=0,u="";i=e.exec(t);)l=i.index,l-n>r&&(s=o>n?o:l,u+=`
`+t.slice(n,s),n=s+1),o=l;return u+=`
`,t.length-n>r&&o>n?u+=t.slice(n,o)+`
`+t.slice(o+1):u+=t.slice(n),u.slice(1)}function Wc(t){for(var r="",e=0,i,n=0;n<t.length;e>=65536?n+=2:n++)e=ei(t,n),i=V[e],!i&&ni(e)?(r+=t[n],e>=65536&&(r+=t[n+1])):r+=i||Hc(e);return r}function Bc(t,r,e){var i="",n=t.tag,s,o,l;for(s=0,o=e.length;s<o;s+=1)l=e[s],t.replacer&&(l=t.replacer.call(e,String(s),l)),(Se(t,r,l,!1,!1)||typeof l>"u"&&Se(t,r,null,!1,!1))&&(i!==""&&(i+=","+(t.condenseFlow?"":" ")),i+=t.dump);t.tag=n,t.dump="["+i+"]"}function ko(t,r,e,i){var n="",s=t.tag,o,l,u;for(o=0,l=e.length;o<l;o+=1)u=e[o],t.replacer&&(u=t.replacer.call(e,String(o),u)),(Se(t,r+1,u,!0,!0,!1,!0)||typeof u>"u"&&Se(t,r+1,null,!0,!0,!1,!0))&&((!i||n!=="")&&(n+=rn(t,r)),t.dump&&ii===t.dump.charCodeAt(0)?n+="-":n+="- ",n+=t.dump);t.tag=s,t.dump=n||"[]"}function qc(t,r,e){var i="",n=t.tag,s=Object.keys(e),o,l,u,h,p;for(o=0,l=s.length;o<l;o+=1)p="",i!==""&&(p+=", "),t.condenseFlow&&(p+='"'),u=s[o],h=e[u],t.replacer&&(h=t.replacer.call(e,u,h)),Se(t,r,u,!1,!1)&&(t.dump.length>1024&&(p+="? "),p+=t.dump+(t.condenseFlow?'"':"")+":"+(t.condenseFlow?"":" "),Se(t,r,h,!1,!1)&&(p+=t.dump,i+=p));t.tag=n,t.dump="{"+i+"}"}function Vc(t,r,e,i){var n="",s=t.tag,o=Object.keys(e),l,u,h,p,f,_;if(t.sortKeys===!0)o.sort();else if(typeof t.sortKeys=="function")o.sort(t.sortKeys);else if(t.sortKeys)throw new ee("sortKeys must be a boolean or a function");for(l=0,u=o.length;l<u;l+=1)_="",(!i||n!=="")&&(_+=rn(t,r)),h=o[l],p=e[h],t.replacer&&(p=t.replacer.call(e,h,p)),Se(t,r+1,h,!0,!0,!0)&&(f=t.tag!==null&&t.tag!=="?"||t.dump&&t.dump.length>1024,f&&(t.dump&&ii===t.dump.charCodeAt(0)?_+="?":_+="? "),_+=t.dump,f&&(_+=rn(t,r)),Se(t,r+1,p,!0,f)&&(t.dump&&ii===t.dump.charCodeAt(0)?_+=":":_+=": ",_+=t.dump,n+=_));t.tag=s,t.dump=n||"{}"}function Co(t,r,e){var i,n,s,o,l,u;for(n=e?t.explicitTypes:t.implicitTypes,s=0,o=n.length;s<o;s+=1)if(l=n[s],(l.instanceOf||l.predicate)&&(!l.instanceOf||typeof r=="object"&&r instanceof l.instanceOf)&&(!l.predicate||l.predicate(r))){if(e?l.multi&&l.representName?t.tag=l.representName(r):t.tag=l.tag:t.tag="?",l.represent){if(u=t.styleMap[l.tag]||l.defaultStyle,zo.call(l.represent)==="[object Function]")i=l.represent(r,u);else if(Uo.call(l.represent,u))i=l.represent[u](r,u);else throw new ee("!<"+l.tag+'> tag resolver accepts not "'+u+'" style');t.dump=i}return!0}return!1}function Se(t,r,e,i,n,s,o){t.tag=null,t.dump=e,Co(t,e,!1)||Co(t,e,!0);var l=zo.call(t.dump),u=i,h;i&&(i=t.flowLevel<0||t.flowLevel>r);var p=l==="[object Object]"||l==="[object Array]",f,_;if(p&&(f=t.duplicates.indexOf(e),_=f!==-1),(t.tag!==null&&t.tag!=="?"||_||t.indent!==2&&r>0)&&(n=!1),_&&t.usedDuplicates[f])t.dump="*ref_"+f;else{if(p&&_&&!t.usedDuplicates[f]&&(t.usedDuplicates[f]=!0),l==="[object Object]")i&&Object.keys(t.dump).length!==0?(Vc(t,r,t.dump,n),_&&(t.dump="&ref_"+f+t.dump)):(qc(t,r,t.dump),_&&(t.dump="&ref_"+f+" "+t.dump));else if(l==="[object Array]")i&&t.dump.length!==0?(t.noArrayIndent&&!o&&r>0?ko(t,r-1,t.dump,n):ko(t,r,t.dump,n),_&&(t.dump="&ref_"+f+t.dump)):(Bc(t,r,t.dump),_&&(t.dump="&ref_"+f+" "+t.dump));else if(l==="[object String]")t.tag!=="?"&&zc(t,t.dump,r,s,u);else{if(l==="[object Undefined]")return!1;if(t.skipInvalid)return!1;throw new ee("unacceptable kind of an object to dump "+l)}t.tag!==null&&t.tag!=="?"&&(h=encodeURI(t.tag[0]==="!"?t.tag.slice(1):t.tag).replace(/!/g,"%21"),t.tag[0]==="!"?h="!"+h:h.slice(0,18)==="tag:yaml.org,2002:"?h="!!"+h.slice(18):h="!<"+h+">",t.dump=h+" "+t.dump)}return!0}function Kc(t,r){var e=[],i=[],n,s;for(sn(t,e,i),n=0,s=i.length;n<s;n+=1)r.duplicates.push(e[i[n]]);r.usedDuplicates=new Array(s)}function sn(t,r,e){var i,n,s;if(t!==null&&typeof t=="object")if(n=r.indexOf(t),n!==-1)e.indexOf(n)===-1&&e.push(n);else if(r.push(t),Array.isArray(t))for(n=0,s=t.length;n<s;n+=1)sn(t[n],r,e);else for(i=Object.keys(t),n=0,s=i.length;n<s;n+=1)sn(t[i[n]],r,e)}function Gc(t,r){r=r||{};var e=new Ic(r);e.noRefs||Kc(t,e);var i=t;return e.replacer&&(i=e.replacer.call({"":i},"",i)),Se(e,0,i,!0,!0)?e.dump+`
`:""}var Yc=Gc,Qc={dump:Yc};function cn(t,r){return function(){throw new Error("Function yaml."+t+" is removed in js-yaml 4. Use yaml."+r+" instead, which is now safe by default.")}}var ar=jo.load,Jm=jo.loadAll,lr=Qc.dump;var Xm=cn("safeLoad","load"),Zm=cn("safeLoadAll","loadAll"),ef=cn("safeDump","dump");var me=class extends b{constructor(){super(...arguments);this.value=null;this._mode="form";this._yamlText="";this._yamlError=null;this._computeFieldLabel=e=>Vr(this.hass,this._picked??"",e.name);this._computeFieldHelper=e=>{let n=this._currentFields()?.[e.name]?.description;return typeof n=="string"?n:""}}willUpdate(e){super.willUpdate?.(e),e.has("value")&&this._mode==="form"&&(this._yamlText=lr(this.value??{}))}connectedCallback(){super.connectedCallback(),this._yamlText=lr(this.value??{})}_setMode(e){e==="form"&&this._yamlError!==null||(e==="yaml"&&(this._yamlText=lr(this.value??{})),this._mode=e)}_onYamlInput(e){this._yamlText=e;let i;try{i=ar(e)}catch(u){this._yamlError=u.message;return}if(i==null){this._yamlError=null,this._emit(null);return}if(typeof i!="object"||Array.isArray(i)){this._yamlError=a(this.hass,"ui.yaml_expect_object","Expected an object");return}let n=i,s=n.script;if(typeof s!="string"||!s.startsWith("script.")){this._yamlError=a(this.hass,"ui.yaml_script_string","`script` must be a 'script.<name>' string");return}let o=n.args;if(o!==void 0&&(typeof o!="object"||Array.isArray(o)||o===null)){this._yamlError=a(this.hass,"ui.yaml_args_object","`args` must be an object if present");return}let l=n.triggers;if(l!==void 0&&(!Array.isArray(l)||!l.every(u=>typeof u=="string"))){this._yamlError=a(this.hass,"ui.yaml_triggers_list","`triggers` must be a list of entity_id strings if present");return}this._yamlError=null,this._emit({script:s,args:o??{},triggers:l})}_emit(e){this.value=e,L(this,this.value)}_scriptIds(){let e=this.hass?.services;return Object.keys(e?.script??{}).sort().map(n=>`script.${n}`)}_label(e){return M(this.hass,e)}_fieldsFor(e){if(!e)return;let i=e.replace(/^script\./,"");return this.hass?.services?.script?.[i]?.fields}get _picked(){return this.value&&typeof this.value=="object"?this.value.script:null}_currentFields(){return this._fieldsFor(this._picked)}_defaultArgs(e){let i=this._fieldsFor(e)??{},n={};for(let[s,o]of Object.entries(i))o&&Object.hasOwn(o,"default")&&(n[s]=o.default);return n}_pickerSchema(){return[{name:"script",selector:{select:{mode:"dropdown",options:this._scriptIds().map(e=>({value:e,label:this._label(e)}))}}}]}_pickScript(e){if(!e){this._emit(null);return}this._emit({script:e,args:this._defaultArgs(e)})}_argsSchema(){let e=this._currentFields();return e?Object.entries(e).map(([i,n])=>({name:i,required:n.required,selector:n.selector??{text:{}}})):[]}_updateArgs(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:e,triggers:this.value.triggers})}get _triggers(){return this.value&&typeof this.value=="object"&&this.value.triggers||[]}_setTriggers(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:this.value.args,triggers:e})}_removeTrigger(e){this._setTriggers(this._triggers.filter(i=>i!==e))}_addTrigger(e){this._triggers.includes(e)||this._setTriggers([...this._triggers,e])}render(){let e=this._picked,i=this._argsSchema(),n=(this.value&&typeof this.value=="object"?this.value.args:{})??{},s=i.length>0;return d`
      <div class="section">
        <h4>${a(this.hass,"ui.script","Script")}</h4>
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
          >${a(this.hass,"ui.form","Form")}</button>
          <button
            type="button"
            class=${this._mode==="yaml"?"active":""}
            @click=${()=>this._setMode("yaml")}
          >${a(this.hass,"ui.yaml","YAML")}</button>
        </div>
      `:""}
      ${e&&this._mode==="form"&&s?d`
        <div class="section args">
          <h4>${a(this.hass,"ui.arguments","Arguments")}</h4>
          ${this._renderArgs(i,n)}
        </div>
      `:""}
      ${e&&this._mode==="form"?this._renderTriggers():""}
      ${e&&this._mode==="yaml"?this._renderYaml():""}
    `}_renderTriggers(){let e=this._triggers;return d`
      <div class="section triggers">
        <h4>${a(this.hass,"ui.script_triggers","Triggers")}</h4>
        <p class="help">
          ${a(this.hass,"ui.script_triggers_help","Re-evaluate this scene when these entities change. A script is opaque, so templated references may be missed \u2014 add any it depends on.")}
        </p>
        ${this._renderTriggerPicker(e)}
      </div>
    `}_renderTriggerPicker(e){if(customElements.get("ha-form")){let i=[{name:"triggers",selector:{entity:{multiple:!0}}}];return d`<ha-form
        .hass=${this.hass}
        .schema=${i}
        .data=${{triggers:e}}
        .computeLabel=${()=>""}
        @value-changed=${n=>{n.stopPropagation(),this._setTriggers(n.detail.value.triggers??[])}}
      ></ha-form>`}return d`
      <div class="chips">
        ${e.length===0?d`<span class="muted">${a(this.hass,"ui.script_triggers_none","No triggers")}</span>`:e.map(i=>d`<span class="chip" data-test=${`trigger-${i}`}>
                ${i}
                <button type="button" class="x" title=${a(this.hass,"ui.remove","Remove")} @click=${()=>this._removeTrigger(i)}>×</button>
              </span>`)}
      </div>
      <input
        data-test="trigger-add-input"
        placeholder="entity_id"
        @change=${i=>{let n=i.target,s=n.value.trim();s&&this._addTrigger(s),n.value=""}}
      />
    `}_renderYaml(){let e=i=>{i.stopPropagation();let n=i.target.value??i.detail?.value??"";this._onYamlInput(n)};return customElements.get("ha-code-editor")?d`
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
        @value-changed=${n=>{n.stopPropagation(),this._updateArgs(n.detail.value)}}
      ></ha-form>`:d`${e.map(n=>{let s=i[n.name];return d`
        <label style="display:block;margin-bottom:0.4rem;">
          <span style="display:inline-block;min-width:8em;">${n.name}</span>
          <input
            .value=${s==null?"":String(s)}
            @change=${o=>{let l=o.target.value,u={...i,[n.name]:l};this._updateArgs(u)}}
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
    </select>`}};me.styles=y`
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
  `,c([m({attribute:!1})],me.prototype,"hass",2),c([m({attribute:!1})],me.prototype,"value",2),c([g()],me.prototype,"_mode",2),c([g()],me.prototype,"_yamlText",2),c([g()],me.prototype,"_yamlError",2),me=c([w("ambience-script-predicate-input")],me);var Jc=["dawn","sunrise","noon","sunset","dusk","midnight"],st=class extends b{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){L(this,e)}_onKindChange(e){let i=e.target.value;i!==this.value.kind&&(i==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let i=e.target.value,[n,s]=i.split(":").map(o=>parseInt(o,10));Number.isNaN(n)||Number.isNaN(s)||this._emit({kind:"time",hh:n,mm:s})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let i=e.target.value;this._emit({...this.value,anchor:i})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let i=e.target.value.trim(),n=i===""?0:parseInt(i,10);Number.isNaN(n)||this._emit({...this.value,offset_min:n})}_onClampDirChange(e){if(this.value.kind!=="sun")return;let i=e.target.value;if(i===""){this._emit({kind:"sun",anchor:this.value.anchor,offset_min:this.value.offset_min});return}let n=this.value.clamp??Xc();this._emit({...this.value,clamp:{dir:i,hh:n.hh,mm:n.mm}})}_onClampTimeChange(e){if(this.value.kind!=="sun"||!this.value.clamp)return;let i=e.target.value,[n,s]=i.split(":").map(o=>parseInt(o,10));Number.isNaN(n)||Number.isNaN(s)||this._emit({...this.value,clamp:{dir:this.value.clamp.dir,hh:n,mm:s}})}_renderTime(e){let i=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return d`<input type="time" .value=${i} @input=${this._onTimeChange} />`}_renderSun(e){let i=Zc(e.offset_min,this.hass),n=e.clamp?.dir??"",s=e.clamp?`${String(e.clamp.hh).padStart(2,"0")}:${String(e.clamp.mm).padStart(2,"0")}`:"";return d`
      <div class="sun">
        <div class="row">
          <select @change=${this._onAnchorChange}>
            ${Jc.map(o=>d`<option value=${o} ?selected=${o===e.anchor}>${Pe(this.hass,o)}</option>`)}
          </select>
          <input
            type="number"
            step="1"
            placeholder=${a(this.hass,"ui.offset_placeholder","Offset")}
            .value=${e.offset_min===0?"":String(e.offset_min)}
            @input=${this._onOffsetChange}
          />
          <span class="offset-hint">${i}</span>
        </div>
        <div class="row">
          <select @change=${this._onClampDirChange}>
            <option value="" ?selected=${n===""}>${a(this.hass,"ui.clamp_none","\u2014")}</option>
            <option value="not_before" ?selected=${n==="not_before"}>${a(this.hass,"ui.clamp_not_before","not before")}</option>
            <option value="not_after" ?selected=${n==="not_after"}>${a(this.hass,"ui.clamp_not_after","not after")}</option>
          </select>
          ${e.clamp?d`<input type="time" .value=${s} @input=${this._onClampTimeChange} />`:""}
        </div>
      </div>
    `}render(){return d`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>${a(this.hass,"ui.endpoint_time","Time")}</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>${a(this.hass,"ui.endpoint_sun","Sun")}</option>
      </select>
      ${this.value.kind==="time"?this._renderTime(this.value):this._renderSun(this.value)}
    `}};st.styles=y`
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
  `,c([m({attribute:!1})],st.prototype,"hass",2),c([m({attribute:!1})],st.prototype,"value",2),st=c([w("ambience-time-endpoint")],st);function Xc(){let t=new Date;return{hh:t.getHours(),mm:t.getMinutes()}}function Zc(t,r){if(t===0)return"";let e=Math.abs(t),i=t<0?"\u2212":"+";if(e%60===0){let n=e/60,s=n===1?a(r,"ui.unit_hour","hour"):a(r,"ui.unit_hours","hours");return`${i}${n} ${s}`}return`${i}${e} ${a(r,"ui.unit_min","min")}`}function dr(t,r){if(!t)return[];let e=Object.keys(t.builtins??{}),i=r?e.slice().sort(r):e,n=new Set(t.hidden??[]),s=Object.keys(t.custom??{}).filter(o=>!(o in(t.builtins??{})));return[...i.filter(o=>!n.has(o)),...s]}var fe=class extends b{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._error=""}static{this.styles=y`
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
  `}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){try{this._view=await this._list(),this._error=""}catch(e){this._error=E(this.hass,e)}}async _saveState(e){try{await this._save(e,this._view.hidden),this._error=""}catch(i){return this._error=E(this.hass,i),!1}return await this._reload(),!0}_onEdit(e,i){this._modal={mode:"edit",id:e,initial:i}}async _onDelete(e){let i={...this._view.custom};delete i[e],await this._saveState(i)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:i,definition:n}=e.detail;await this._saveState({...this._view.custom,[i]:n})&&(this._modal={mode:"closed"})}_onModalCancel(){this._modal={mode:"closed"}}_takenIds(){return new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}_renderBuiltinRow(e,i,n){return d`
      <div class="row ${n?"overridden":""}">
        <span class="name">${this._label(e,{})}</span>
        <span class="def">${this._formatDef(i)}</span>
        <span class="badge">${a(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${n?"":d`<button class="icon" title=${a(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(e,i)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(e,i){return d`
      <div class="row custom">
        <span class="name">${this._label(e,this._view.custom)}</span>
        <span class="def">${this._formatDef(i)}</span>
        <span class="badge">${a(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${a(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e,i)}>✎</button>
          <button class="icon" title=${a(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e)}>✕</button>
        </span>
      </div>
    `}render(){let e=this._view.custom,[i,n]=this._headingKey(),[s,o]=this._addKey();return d`
      <header>
        <h2>${a(this.hass,i,n)}</h2>
      </header>
      ${this._error?d`<p class="error">${this._error}</p>`:""}
      ${Object.entries(this._view.builtins).map(([l,u])=>{let h=e[l];return d`
          ${this._renderBuiltinRow(l,u,h!=null)}
          ${h!=null?this._renderCustomRow(l,h):""}
        `})}
      ${Object.entries(e).filter(([l])=>!(l in this._view.builtins)).map(([l,u])=>this._renderCustomRow(l,u))}
      <button class="add" @click=${this._onAdd}>${a(this.hass,s,o)}</button>
      ${this._renderModal()}
    `}};c([m({attribute:!1})],fe.prototype,"hass",2),c([g()],fe.prototype,"_view",2),c([g()],fe.prototype,"_modal",2),c([g()],fe.prototype,"_error",2);var si={kind:"any"},Xo={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},Zo=["daytime","dawn","morning","afternoon","evening","nighttime"];function eu(t,r){let e=Zo.indexOf(t),i=Zo.indexOf(r);return e===-1&&i===-1?0:e===-1?1:i===-1?-1:e-i}var ge=class extends b{constructor(){super(...arguments);this.value=null;this._entries=[si];this._openIdx=0}willUpdate(e){e.has("value")&&this.value!==this._lastEmitted&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[si]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(i=>{let n=this._entries[this._openIdx];if(!n)return;let s=n.kind==="any"?"__any__":n.kind==="range"?"__custom__":n.period;i.value!==s&&(i.value=s)})}_predicateToEntries(e){return e===null?[si]:(Array.isArray(e)?e:[e]).map(n=>"period"in n?{kind:"period",period:n.period}:{kind:"range",from:n.from,to:n.to})}_emit(e){let i=e.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),n=i.length===0?null:i.length===1?i[0]:i;this._lastEmitted=n,this.value=n,L(this,n)}_effectiveIds(){return dr(this.periods,eu)}_onSelectChange(e,i){let n=i.target.value,s=[...this._entries];n==="__any__"?s[e]=si:n==="__custom__"?s[e]={kind:"range",...Xo}:s[e]={kind:"period",period:n},this._entries=s,this._emit(s)}_onRangeChange(e,i,n){n.stopPropagation();let s=this._entries[e];if(s?.kind!=="range")return;let o=[...this._entries];o[e]={...s,[i]:n.detail.value},this._entries=o,this._emit(o)}_onRemove(e){let i=this._entries.filter((n,s)=>s!==e);this._entries=i.length===0?[si]:i,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...Xo}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,i){let n;return e.kind==="any"?n=a(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?n=er({period:e.period},{hass:this.hass,periods:this.periods}):n=er({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),d`
      <div class="summary-chip" @click=${()=>this._onChipClick(i)}>
        <span class="chip-label">${n}</span>
        ${this._entries.length>1?d`<button class="remove" @click=${s=>{s.stopPropagation(),this._onRemove(i)}} title=${a(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,i,n){let s=this._effectiveIds(),o=this.periods?.custom??{};return d`
      <div class="entry">
        <div class="entry-header">
          <select @change=${l=>this._onSelectChange(i,l)}>
            ${n?d`<option value="__any__">${a(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${a(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${s.map(l=>d`<option value=${l}>
                ${de(this.hass,l,o)}${o[l]&&!this.periods?.builtins[l]?a(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?d`<button class="remove" @click=${()=>this._onRemove(i)} title=${a(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${e.kind==="range"?d`
              <div class="range-row">
                <label>${a(this.hass,"ui.from_label","From")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.from}
                  @value-changed=${l=>this._onRangeChange(i,"from",l)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${a(this.hass,"ui.to_label","To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${l=>this._onRangeChange(i,"to",l)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(n=>n.kind!=="any"),i=this._entries.length>1;return d`
      ${this._entries.map((n,s)=>i&&s!==this._openIdx?this._renderChip(n,s):this._renderEntry(n,s,s===0))}
      ${e?d`<button class="add-btn" @click=${this._onAdd}>${a(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};ge.styles=y`
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
  `,c([m({attribute:!1})],ge.prototype,"value",2),c([m({attribute:!1})],ge.prototype,"periods",2),c([m({attribute:!1})],ge.prototype,"hass",2),c([g()],ge.prototype,"_entries",2),c([g()],ge.prototype,"_openIdx",2),ge=c([w("ambience-time-of-day-input")],ge);function je(t,r,e,i,n,s){return customElements.get("ha-form")?d`<ha-form
      class=${r}
      .hass=${t}
      .schema=${[{name:e,required:!0,selector:{select:{mode:"dropdown",options:n}}}]}
      .data=${{[e]:i}}
      .computeLabel=${()=>""}
      @value-changed=${l=>{l.stopPropagation();let u=l.detail.value[e];u&&s(u)}}
    ></ha-form>`:d`<select
    class=${r}
    @change=${o=>s(o.target.value)}
  >
    ${n.map(o=>d`<option value=${o.value} ?selected=${o.value===i}>${o.label}</option>`)}
  </select>`}function Tt(t,r,e,i,n){return customElements.get("ha-form")?d`<ha-form
      class="field"
      data-field="sensors"
      .hass=${t}
      .schema=${r}
      .data=${{sensors:e}}
      .computeLabel=${()=>""}
      @value-changed=${s=>{s.stopPropagation(),n(s.detail.value.sensors??[])}}
    ></ha-form>`:d`<input
    class="field"
    data-field="sensors"
    type="text"
    placeholder=${i}
    .value=${e.join(", ")}
    @change=${s=>n(s.target.value.split(",").map(o=>o.trim()).filter(o=>o!==""))}
  />`}function oi(t,r,e,i,n,s){return customElements.get("ha-form")?d`<ha-form
      .hass=${t}
      .schema=${[{name:r,selector:i}]}
      .data=${{[r]:e??""}}
      .computeLabel=${()=>""}
      @value-changed=${l=>{l.stopPropagation(),s(l.detail.value[r]||null)}}
    ></ha-form>`:d`<input
    type="text"
    placeholder=${n}
    .value=${e??""}
    @change=${o=>s(o.target.value||null)}
  />`}var un="__custom__";function ea(t,r){if(t==null||typeof t!="object")return null;let e=t;if(typeof e.range=="string")return null;let{min:i,max:n}=e;return typeof i=="number"&&i<0||typeof n=="number"&&n<0?a(r,"ui.lux_error_negative","Bounds must be 0 or greater."):typeof i=="number"&&typeof n=="number"&&i>=n?a(r,"ui.lux_error_order","Min must be less than max."):null}var ze=class extends b{constructor(){super(...arguments);this.value=null}_cur(){return this.value??{sensors:[],range:this._defaultRangeId()}}_sensors(){return this._cur().sensors??[]}_showQuant(){return this._sensors().length>1}_effectiveRangeIds(){return dr(this.luxRanges)}_defaultRangeId(){return this._effectiveRangeIds()[0]??"dark"}_isCustom(e){return e.range==null}_build(e){let i={...this._cur(),...e},n={sensors:i.sensors??[]};return this._isCustom(i)?(i.min!=null&&(n.min=i.min),i.max!=null&&(n.max=i.max)):n.range=i.range??this._defaultRangeId(),i.quant==="all"&&(n.quant="all"),i.negate===!0&&(n.negate=!0),n}_emit(e){this.value=e,L(this,e)}_setSensors(e){this._emit(this._build({sensors:e}))}_setQuant(e){this._emit(this._build({quant:e}))}_setNegate(e){this._emit(this._build({negate:e}))}_setBand(e){if(e===un){let i=this._cur();this._emit(this._build({range:void 0,min:i.min??0,max:i.max}))}else this._emit(this._build({range:e,min:void 0,max:void 0}))}_setMin(e){this._emit(this._build({min:e}))}_setMax(e){this._emit(this._build({max:e}))}_sensorSchema(){return[{name:"sensors",selector:{entity:{domain:"sensor",device_class:["illuminance"],multiple:!0}}}]}_renderSensors(){return Tt(this.hass,this._sensorSchema(),this._sensors(),"sensor.a, sensor.b",e=>this._setSensors(e))}_renderBand(e){let i=this._isCustom(e),n=[...this._effectiveRangeIds().map(l=>({value:l,label:Re(this.hass,l,this.luxRanges?.custom??{})})),{value:un,label:a(this.hass,"ui.custom_range","Custom range")}],s=je(this.hass,"band","band",i?un:e.range??this._defaultRangeId(),n,l=>this._setBand(l));if(!i)return s;let o=l=>l==null?"":String(l);return d`${s}
      <span class="band-row" data-field="band-custom">
        <input
          type="number" min="0" step="1" data-field="min"
          placeholder=${a(this.hass,"ui.lux_min_placeholder","0")}
          .value=${o(e.min)}
          @change=${l=>{let u=l.target.value;this._setMin(u===""?void 0:Number(u))}}
        />
        <span>–</span>
        <input
          type="number" min="0" step="1" data-field="max"
          placeholder=${a(this.hass,"ui.lux_max_placeholder","\u221E")}
          .value=${o(e.max)}
          @change=${l=>{let u=l.target.value;this._setMax(u===""?void 0:Number(u))}}
        />
        <span class="label">lx</span>
      </span>`}_renderQuant(e){return je(this.hass,"quant","quant",e,[{value:"any",label:a(this.hass,"ui.lux_any","Any of")},{value:"all",label:a(this.hass,"ui.lux_all","All of")}],i=>this._setQuant(i))}_renderNegate(e){return je(this.hass,"negate","negate",e?"is_not":"is",[{value:"is",label:a(this.hass,"ui.lux_is","is")},{value:"is_not",label:a(this.hass,"ui.lux_is_not","is not")}],i=>this._setNegate(i==="is_not"))}render(){let e=this._cur(),i=e.quant==="all"?"all":"any",n=e.negate===!0;return d`
      ${this._showQuant()?d`<div class="row">${this._renderQuant(i)}</div>`:""}
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._renderNegate(n)}
        ${this._renderBand(e)}
      </div>
    `}};ze.styles=y`
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
  `,c([m({attribute:!1})],ze.prototype,"hass",2),c([m({attribute:!1})],ze.prototype,"value",2),c([m({attribute:!1})],ze.prototype,"luxRanges",2),ze=c([w("ambience-lux-input")],ze);function hn(t){if(typeof t!="string")return!1;let r=t.split(",").map(e=>e.trim()).filter(e=>e!=="");if(r.length===0)return!1;for(let e of r)if(e.includes("-")){let i=e.split("-").map(o=>o.trim());if(i.length!==2||!/^\d+$/.test(i[0])||!/^\d+$/.test(i[1]))return!1;let n=Number(i[0]),s=Number(i[1]);if(!(n>=1&&n<=s&&s<=31))return!1}else{if(!/^\d+$/.test(e))return!1;let i=Number(e);if(!(i>=1&&i<=31))return!1}return!0}var pn=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],tu=new Set(["workday","holiday"]),iu=new Set(["first_workday","last_workday"]),ru=[31,29,31,30,31,30,31,31,30,31,30,31];function ai(t){return ru[t-1]??31}function mn(t){switch(t){case"weekday":return{kind:t,days:[]};case"day_of_month":return{kind:t,days:""};case"date":return{kind:t,month:1,day:1};case"date_range":return{kind:t,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:t}}}function ta(t,r){if(t==null||typeof t!="object")return null;let e=t;for(let i of[e.include,e.exclude])if(Array.isArray(i))for(let n of i){let s=n;if(s?.kind==="weekday"&&(!Array.isArray(s.days)||s.days.length===0))return a(r,"ui.day_pick_weekday","Pick at least one day of the week.");if(s?.kind==="day_of_month"&&(typeof s.days!="string"||!hn(s.days)))return a(r,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}return null}var Ue=class extends b{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?a(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return a(this.hass,"ui.field_kind","Kind");case"days":return a(this.hass,"ui.field_days_of_month","Days of month");case"month":return a(this.hass,"ui.field_month","Month");case"day":return a(this.hass,"ui.field_day","Day");case"from_month":return a(this.hass,"ui.field_from_month","From month");case"from_day":return a(this.hass,"ui.field_from_day","From day");case"to_month":return a(this.hass,"ui.field_to_month","To month");case"to_day":return a(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let i=e.include.length===0&&e.exclude.length===0;this.value=i?null:e,L(this,this.value)}_addItem(e,i){let n=this._current();n[e]=[...n[e],mn(i)],this._emit(n)}_removeItem(e,i){let n=this._current();n[e]=n[e].filter((s,o)=>o!==i),this._emit(n)}_updateItem(e,i,n){let s=this._current();s[e]=s[e].map((o,l)=>l===i?n:o),this._emit(s)}_kindDisabled(e){return!!(tu.has(e)&&!this.dayConfig.workday_sensor||iu.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:pn.map(e=>({value:e,label:Ei(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:mt(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:ai(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,i){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(i.days??"")}:e}_setDatePart(e,i,n){let s=Number(n);if(!Number.isFinite(s)||s<1)return e;if(i.endsWith("month")&&(s=Math.min(s,12)),e.kind==="date"){let{month:o,day:l}=e;return i==="month"&&(o=s),i==="day"&&(l=s),{kind:"date",month:o,day:Math.min(l,ai(o))}}if(e.kind==="date_range"){let o={...e.from},l={...e.to};return i==="from_month"&&(o.month=s),i==="from_day"&&(o.day=s),i==="to_month"&&(l.month=s),i==="to_day"&&(l.day=s),o.day=Math.min(o.day,ai(o.month)),l.day=Math.min(l.day,ai(l.month)),{kind:"date_range",from:o,to:l}}return e}_onKindForm(e,i,n){let s=n.kind;if(!s){this._removeItem(e,i);return}if(this._kindDisabled(s))return;let o=this._current()[e][i];o&&o.kind===s||this._updateItem(e,i,mn(s))}_dayOfMonthError(e){return e.trim()===""||hn(e)?null:a(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(e,i,n,s){this._updateItem(e,i,this._bodyPatch(n,s))}_renderWeekday(e,i,n){return d`${[0,1,2,3,4,5,6].map(s=>d`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${n.days.includes(s)}
          @change=${o=>{let u=o.target.checked?[...n.days,s].sort((h,p)=>h-p):n.days.filter(h=>h!==s);this._updateItem(e,i,{kind:"weekday",days:u})}}
        />${Ci(this.hass,s)}
      </label>
    `)}`}_renderKindPicker(e,i,n){return customElements.get("ha-form")?d`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:n.kind}}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${s=>{s.stopPropagation(),this._onKindForm(e,i,s.detail.value)}}
      ></ha-form>`:d`
      <select
        class="kind"
        @change=${s=>{let o=s.target.value;this._kindDisabled(o)||o===n.kind||this._updateItem(e,i,mn(o))}}
      >
        ${pn.map(s=>d`<option value=${s} ?selected=${s===n.kind} ?disabled=${this._kindDisabled(s)}>${Ei(this.hass,s)}</option>`)}
      </select>
    `}_renderItemBody(e,i,n){if(n.kind==="weekday")return this._renderWeekday(e,i,n);if(customElements.get("ha-form")){if(n.kind==="date")return this._renderDateRow(e,i,n,"month","day",n.month,n.day);if(n.kind==="date_range")return d`
          ${this._renderDateRow(e,i,n,"from_month","from_day",n.from.month,n.from.day)}
          ${this._renderDateRow(e,i,n,"to_month","to_day",n.to.month,n.to.day)}
        `;let s=this._bodySchema(n);if(!s)return d``;let o=n.kind==="day_of_month"?this._dayOfMonthError(n.days):null;return d`<ha-form
        .hass=${this.hass}
        .schema=${s}
        .data=${this._bodyData(n)}
        .error=${o?{days:o}:void 0}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${l=>{l.stopPropagation(),this._onBodyForm(e,i,n,l.detail.value)}}
      ></ha-form>`}return this._renderNativeBody(e,i,n)}_renderDateRow(e,i,n,s,o,l,u){let h=(p,f)=>{this._updateItem(e,i,this._setDatePart(n,p,f[p]))};return d`
      <div class="date-row">
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:s,required:!0,selector:this._monthSelector()}]}
          .data=${{[s]:String(l)}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${p=>{p.stopPropagation(),h(s,p.detail.value)}}
        ></ha-form>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:o,required:!0,selector:this._daySelector(l)}]}
          .data=${{[o]:u}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${p=>{p.stopPropagation(),h(o,p.detail.value)}}
        ></ha-form>
      </div>
    `}_renderNativeBody(e,i,n){if(n.kind==="day_of_month"){let l=this._dayOfMonthError(n.days);return d`<input
        type="text" placeholder=${a(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${n.days}
        @change=${u=>this._updateItem(e,i,this._bodyPatch(n,{days:u.target.value}))}
      />${l?d`<div class="field-error">${l}</div>`:""}`}let s=(l,u)=>d`
      <input type="number" min="1" max="12" .value=${String(u)}
        @change=${h=>this._updateItem(e,i,this._setDatePart(n,l,h.target.value))} />
    `,o=(l,u,h)=>d`
      <input type="number" min="1" max=${String(ai(u))} .value=${String(h)}
        @change=${p=>this._updateItem(e,i,this._setDatePart(n,l,p.target.value))} />
    `;return n.kind==="date"?d`${s("month",n.month)} / ${o("day",n.month,n.day)}`:n.kind==="date_range"?d`
        <span>${a(this.hass,"ui.from","from")}</span>
        ${s("from_month",n.from.month)} / ${o("from_day",n.from.month,n.from.day)}
        <span>${a(this.hass,"ui.to","to")}</span>
        ${s("to_month",n.to.month)} / ${o("to_day",n.to.month,n.to.day)}
      `:d``}_renderAddPicker(e){let i=e==="include"?a(this.hass,"ui.add_include_item","+ Add include item"):a(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let n=()=>i;return d`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${n}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.kind;o&&!this._kindDisabled(o)&&this._addItem(e,o)}}
      ></ha-form>`}return d`
      <select
        .value=${""}
        @change=${n=>{let s=n.target.value;s&&(this._addItem(e,s),n.target.value="")}}
      >
        <option value="">${i}</option>
        ${pn.map(n=>d`<option value=${n} ?disabled=${this._kindDisabled(n)}>${Ei(this.hass,n)}</option>`)}
      </select>
    `}_renderItem(e,i,n){return d`
      <div class="item">
        ${this._renderKindPicker(e,i,n)}
        <div class="body">${this._renderItemBody(e,i,n)}</div>
        <button class="remove" title=${a(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(e,i)}>✕</button>
      </div>
    `}_renderSection(e,i){return d`
      <div class="section">
        <h4>${e==="include"?a(this.hass,"ui.include","Include"):a(this.hass,"ui.exclude","Exclude")}</h4>
        ${i.length===0&&e==="include"?d`<div class="hint">${a(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${i.map((n,s)=>this._renderItem(e,s,n))}
        ${this._renderAddPicker(e)}
      </div>
    `}render(){let{include:e,exclude:i}=this._current();return d`
      ${this._renderSection("include",e)}
      ${this._renderSection("exclude",i)}
    `}};Ue.styles=y`
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
  `,c([m({attribute:!1})],Ue.prototype,"hass",2),c([m({attribute:!1})],Ue.prototype,"value",2),c([m({attribute:!1})],Ue.prototype,"dayConfig",2),Ue=c([w("ambience-day-predicate-input")],Ue);var ia=["temperature","apparent_temperature","humidity","wind_speed","pressure"],ra=["<","<=",">",">="],na={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},Le=class extends b{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(e){let i=e.groups.length===0&&e.thresholds.length===0;this.value=i?null:e,L(this,this.value)}_setGroups(e){this._emit({...this._current(),groups:e})}_addThreshold(){let e=this._current();e.thresholds=[...e.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(e)}_updateThreshold(e,i){let n=this._current();n.thresholds=n.thresholds.map((s,o)=>o===e?i:s),this._emit(n)}_removeThreshold(e){let i=this._current();i.thresholds=i.thresholds.filter((n,s)=>s!==e),this._emit(i)}_attributeSchema(e){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:ia.map(i=>({value:i,label:Ft(this.hass,i)}))}}}]}_opSchema(e){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:ra.map(i=>({value:i,label:na[i]}))}}}]}_entityState(){let e=this.weatherEntity;return e?this.hass?.states?.[e]:void 0}_valueSchema(e,i){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:Ar(this.hass,i,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(e=>({value:e.id,label:e.label}))}}}]}_renderGroups(e){return customElements.get("ha-form")?d`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{groups:e}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),this._setGroups(i.detail.value.groups??[])}}
      ></ha-form>`:d`${this.groups.map(i=>d`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${e.includes(i.id)}
          @change=${n=>{let s=n.target.checked;this._setGroups(s?[...e,i.id]:e.filter(o=>o!==i.id))}} />${i.label}
      </label>`)}`}_renderAttributeSelect(e,i){return customElements.get("ha-form")?d`<ha-form
        class="attr-form"
        .hass=${this.hass}
        .schema=${this._attributeSchema(e)}
        .data=${{attribute:i.attribute}}
        .computeLabel=${()=>""}
        @value-changed=${n=>{n.stopPropagation();let s=n.detail.value.attribute;s&&this._updateThreshold(e,{...i,attribute:s})}}
      ></ha-form>`:d`<select
      @change=${n=>this._updateThreshold(e,{...i,attribute:n.target.value})}>
      ${ia.map(n=>d`<option value=${n} ?selected=${n===i.attribute}>${Ft(this.hass,n)}</option>`)}
    </select>`}_renderOpSelect(e,i){return customElements.get("ha-form")?d`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(e)}
        .data=${{op:i.op}}
        .computeLabel=${()=>""}
        @value-changed=${n=>{n.stopPropagation();let s=n.detail.value.op;s&&this._updateThreshold(e,{...i,op:s})}}
      ></ha-form>`:d`<select
      @change=${n=>this._updateThreshold(e,{...i,op:n.target.value})}>
      ${ra.map(n=>d`<option value=${n} ?selected=${n===i.op}>${na[n]}</option>`)}
    </select>`}_renderValueInput(e,i){if(customElements.get("ha-form"))return d`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(e,i.attribute)}
        .data=${{value:i.value}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.value;typeof o=="number"&&Number.isFinite(o)&&this._updateThreshold(e,{...i,value:o})}}
      ></ha-form>`;let n=Ar(this.hass,i.attribute,this._entityState());return d`<span class="value-wrap">
      <input type="number" .value=${String(i.value)}
        @change=${s=>{let o=Number(s.target.value);Number.isFinite(o)&&this._updateThreshold(e,{...i,value:o})}} />
      <span class="unit">${n}</span>
    </span>`}_renderThreshold(e,i){return d`
      <div class="threshold">
        ${this._renderAttributeSelect(e,i)}
        ${this._renderOpSelect(e,i)}
        ${this._renderValueInput(e,i)}
        <button class="remove" title=${a(this.hass,"ui.remove","Remove")} @click=${()=>this._removeThreshold(e)}>✕</button>
      </div>
    `}render(){let{groups:e,thresholds:i}=this._current();return d`
      <div class="section">
        <h4>${a(this.hass,"ui.groups","Groups")}</h4>
        ${this._renderGroups(e)}
      </div>
      <div class="section">
        <h4>${a(this.hass,"ui.thresholds","Thresholds")}</h4>
        ${i.map((n,s)=>this._renderThreshold(s,n))}
        <button class="add" @click=${()=>this._addThreshold()}>${a(this.hass,"ui.add_threshold","+ Add threshold")}</button>
      </div>
    `}};Le.styles=y`
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
  `,c([m({attribute:!1})],Le.prototype,"hass",2),c([m({attribute:!1})],Le.prototype,"value",2),c([m({attribute:!1})],Le.prototype,"groups",2),c([m({attribute:!1})],Le.prototype,"weatherEntity",2),Le=c([w("ambience-weather-predicate-input")],Le);var nu=["NW","N","NE","W",null,"E","SW","S","SE"],ot=class extends b{constructor(){super(...arguments);this.value=null}_current(){let e=this.value?.azimuth?.ranges??[];return{elevation:this.value?.elevation??null,sectors:[...this.value?.azimuth?.sectors??[]],range:e.length?{...e[0]}:null}}_emit(e){let i={};e.elevation&&(e.elevation.min!=null||e.elevation.max!=null)&&(i.elevation=e.elevation);let n={};e.sectors.length&&(n.sectors=e.sectors),e.range&&(n.ranges=[e.range]),(n.sectors||n.ranges)&&(i.azimuth=n),this.value=i.elevation||i.azimuth?i:null,L(this,this.value)}_setElevation(e){this._emit({...this._current(),elevation:e})}_setSectors(e){this._emit({...this._current(),sectors:e})}_setRange(e){this._emit({...this._current(),range:e})}_mode(e){return!e||e.min==null&&e.max==null?"any":e.min!=null&&e.max!=null?"between":e.min!=null?"above":"below"}_onModeChange(e,i){let n=i?.min??0,s=i?.max??0;e==="any"?this._setElevation(null):e==="above"?this._setElevation({min:n}):e==="below"?this._setElevation({max:s}):this._setElevation({min:n,max:s})}_toggleSector(e,i,n){this._setSectors(n?[...e,i]:e.filter(s=>s!==i))}_renderSectors(e){return d`<div class="sectors">${nu.map(i=>i===null?d`<span class="spacer"></span>`:d`<label>
            <input type="checkbox" .checked=${e.includes(i)}
              @change=${n=>this._toggleSector(e,i,n.target.checked)} />${i}
          </label>`)}</div>`}_renderElevation(e){let i=this._mode(e),n=["any","above","below","between"],s={any:a(this.hass,"ui.sun.any","Any"),above:a(this.hass,"ui.sun.above","Above"),below:a(this.hass,"ui.sun.below","Below"),between:a(this.hass,"ui.sun.between","Between")};return d`
      <div class="row">
        <select @change=${o=>this._onModeChange(o.target.value,e)}>
          ${n.map(o=>d`<option value=${o} ?selected=${o===i}>${s[o]}</option>`)}
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
        ${a(this.hass,"ui.sun.custom_range","Custom range")}
      </label>
      ${e===null?"":d`<div class="row range-row">
            <input type="number" class="from" .value=${String(e.from)}
              @change=${i=>this._setRange({...e,from:Number(i.target.value)})} />
            <span class="deg">°–</span>
            <input type="number" class="to" .value=${String(e.to)}
              @change=${i=>this._setRange({...e,to:Number(i.target.value)})} />
            <span class="deg">°</span>
          </div>`}
    `}render(){let{elevation:e,sectors:i,range:n}=this._current();return d`
      <div class="section">
        <h4>${a(this.hass,"ui.sun.elevation","Elevation")}</h4>
        ${this._renderElevation(e)}
      </div>
      <div class="section">
        <h4>${a(this.hass,"ui.sun.azimuth","Azimuth")}</h4>
        ${this._renderSectors(i)}
        ${this._renderCustomRange(n)}
      </div>
    `}};ot.styles=y`
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
  `,c([m({attribute:!1})],ot.prototype,"hass",2),c([m({attribute:!1})],ot.prototype,"value",2),ot=c([w("ambience-sun-predicate-input")],ot);function We(t){return t?.states??{}}function fn(t,r){let e=`${r}.`;return Object.keys(We(t)).filter(i=>i.startsWith(e)).sort().map(i=>({id:i,name:M(t,i)}))}var B=class extends b{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[];this._knownAttributeValues=[];this._entitySeq=0}async updated(e){if(!e.has("value"))return;let i=e.get("value"),{entity_id:n,attribute:s}=this.value;if(n&&n!==i?.entity_id&&this.hass)try{let o=(await Nr(this.hass,n)).states;this.value.entity_id===n&&(this._knownStates=o)}catch{this.value.entity_id===n&&(this._knownStates=[])}if(n!==i?.entity_id||s!==i?.attribute)if(n&&s&&this.hass)try{let o=(await Ir(this.hass,n,s)).values;this.value.entity_id===n&&this.value.attribute===s&&(this._knownAttributeValues=o)}catch{this.value.entity_id===n&&this.value.attribute===s&&(this._knownAttributeValues=[])}else this._knownAttributeValues.length&&(this._knownAttributeValues=[])}_normalize(e){let i={...e};return i.attribute===""&&(i.attribute=null),i.for&&i.for.h===0&&i.for.m===0&&i.for.s===0&&(i.for=null),xt(i.for,i.for_mode)||delete i.for_mode,i}_emit(e){let i=this._normalize(e);this.value=i,L(this,i)}_autoFlipOp(e){let i=this._isNumericTargetFor(e),n=this._isNumericOp(e.kind);return!i&&n?{...e,kind:"is"}:i&&!n&&!this._isNumericTargetFor(this.value)?{...e,kind:">"}:e}async _setEntity(e){let i=++this._entitySeq,n=this._entityHasAttribute(e,this.value.attribute)?this.value.attribute:null,s=await this._supportedValues(e,n,this.value.states);i===this._entitySeq&&this._emit(this._autoFlipOp({...this.value,entity_id:e,attribute:n,states:s}))}_entityHasAttribute(e,i){return i?this._knownAttributesFor(e).includes(i):!1}async _supportedValues(e,i,n){if(!e||n.length===0||!this.hass)return[];try{let s=new Set(i?(await Ir(this.hass,e,i)).values:(await Nr(this.hass,e)).states);return n.filter(o=>s.has(o))}catch{return[]}}_setAttribute(e){this._emit(this._autoFlipOp({...this.value,attribute:e}))}_setOp(e){let i=this._isNumericOp(e)===this._isNumericOp(this.value.kind)?this.value.states:[];this._emit({...this.value,kind:e,states:i})}_setStates(e){this._emit({...this.value,states:e})}_setValueAt(e,i){if(this._isNumericOp(this.value.kind)){this._setStates([i]);return}let n=this.value.states.slice();i===""?n.splice(e,1):n[e]=i,this._setStates(n)}_addValue(e){e&&this._setStates([...this.value.states,e])}_removeValueAt(e){let i=this.value.states.slice();i.splice(e,1),this._setStates(i)}_setForDuration(e){if(e===null){this._emit({...this.value,for:null,for_mode:null});return}let{mode:i,...n}=e;this._emit({...this.value,for:n,for_mode:i})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(e){if(!e)return[];let i=We(this.hass)[e]?.attributes;return i?Object.keys(i).sort():[]}_attrLabelMaps(){let e=this._knownAttributesFor(this.value.entity_id),n=`${this.hass?.language??""}|${this.value.entity_id}|${e.join(",")}`;if(this._attrMapsCache?.key===n)return this._attrMapsCache.maps;let s=We(this.hass)[this.value.entity_id],o=new Map,l=new Map;for(let h of e){let p=$i(this.hass,s,h);o.set(h,p),l.set(p,h)}let u={keyToLabel:o,labelToKey:l};return this._attrMapsCache={key:n,maps:u},u}_attributeSchema(){let{keyToLabel:e}=this._attrLabelMaps();return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:B._STATE_SENTINEL,label:a(this.hass,"ui.state_sentinel","State")},...[...e.values()].map(i=>({value:i,label:i}))]}}}]}_attributeData(){let e=this.value.attribute;if(!e)return{attribute:B._STATE_SENTINEL};let{keyToLabel:i}=this._attrLabelMaps();return{attribute:i.get(e)??e}}_setAttributeFromHaForm(e){if(e===B._STATE_SENTINEL){this._setAttribute("");return}let{labelToKey:i}=this._attrLabelMaps();this._setAttribute(i.get(e)??e)}_isNumericOp(e){return B._NUMERIC_OPS.includes(e)}_isNumericTargetFor(e){let i=We(this.hass)[e.entity_id];if(!i)return!1;if(e.attribute)return typeof i.attributes?.[e.attribute]=="number";let n=i.state;return typeof n!="string"||n===""||n==="unknown"||n==="unavailable"?!1:Number.isFinite(Number(n))}_opSchema(){let e=this._isNumericTargetFor(this.value)?[...B._NUMERIC_OPS,"is","is_not"]:["is","is_not"];return e.includes(this.value.kind)||e.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:e.map(i=>({value:i,label:U(this.hass,i)}))}}}]}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let{rawToLabel:e}=this._valueLabelMaps();return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:[...e.values()].map(i=>({value:i,label:i}))}}}]}_rawValueOptions(){return this.value.attribute?this._knownAttributeValues:this._knownStates}_valueLabelMaps(){let e=this.value.attribute,i=this._rawValueOptions(),s=`${this.hass?.language??""}|${this.value.entity_id}|${e??""}|${i.join(",")}`;if(this._valueMapsCache?.key===s)return this._valueMapsCache.maps;let o=We(this.hass)[this.value.entity_id],l=new Map,u=new Map;for(let p of i){let f=Ae(this.hass,o,e,p);l.set(p,f),u.set(f,p)}let h={rawToLabel:l,labelToRaw:u};return this._valueMapsCache={key:s,maps:h},h}_valueDisplay(e){return this._valueLabelMaps().rawToLabel.get(e)??e}_labelToRaw(e){return this._valueLabelMaps().labelToRaw.get(e)??e}_setValueFromHaForm(e,i){this._setValueAt(e,this._labelToRaw(i))}_addValueFromHaForm(e){this._addValue(this._labelToRaw(e))}_renderEntity(){return customElements.get("ha-form")?d`<ha-form
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
      placeholder=${a(this.hass,"ui.state_attribute_placeholder","leave blank to compare state")}
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
      <option value="is" ?selected=${this.value.kind==="is"}>${U(this.hass,"is")}</option>
      <option value="is_not" ?selected=${this.value.kind==="is_not"}>${U(this.hass,"is_not")}</option>
    </select>`}_renderValueRow(e,i){let n=i===-1,s=n?u=>this._addValue(u):u=>this._setValueAt(i,u),o=this._isNumericOp(this.value.kind),l=o?{value:e===""?void 0:Number(e)}:{value:this._valueDisplay(e)};return customElements.get("ha-form")?d`
        <div class="value-row" data-row=${i}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${l}
            .computeLabel=${()=>""}
            @value-changed=${u=>{u.stopPropagation();let h=u.detail.value.value,p=h==null?"":String(h);o?s(p):n?this._addValueFromHaForm(p):this._setValueFromHaForm(i,p)}}
          ></ha-form>
        </div>
      `:d`
      <div class="value-row" data-row=${i}>
        <input type=${o?"number":"text"} .value=${e}
          placeholder=${n?a(this.hass,"ui.state_add_value","+ Add state"):""}
          @change=${u=>s(u.target.value)} />
      </div>
    `}_renderForRow(){return d`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this.value.for??null}
      .mode=${this.value.for_mode??"at_least"}
      @value-changed=${e=>{e.stopPropagation(),this._setForDuration(e.detail.value)}}
    ></ambience-for-duration>`}render(){return d`
      <section class="field">
        <label class="field-label">${a(this.hass,"ui.state_entity","Entity")}</label>
        ${this._renderEntity()}
      </section>
      <section class="field where-op-row">
        <div class="where-cell">
          <label class="field-label">${a(this.hass,"ui.state_where","Where")}</label>
          ${this._renderAttribute()}
        </div>
        <div class="op-cell">
          <label class="field-label">${a(this.hass,"ui.state_op_header","Comparison")}</label>
          ${this._renderOp()}
        </div>
      </section>
      <section class="field">
        <label class="field-label">
          ${a(this.hass,"ui.state_value_label","Value")}
        </label>
        <div class="value-list">
          ${this._isNumericOp(this.value.kind)?this._renderValueRow(this.value.states[0]??"",0):d`
                ${this.value.states.map((e,i)=>this._renderValueRow(e,i))}
                ${this._renderValueRow("",-1)}
              `}
        </div>
      </section>
      <section class="field">
        <label class="field-label">${a(this.hass,"ui.state_for","For (optional)")}</label>
        ${this._renderForRow()}
      </section>
    `}};B.styles=y`
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
  `,B._STATE_SENTINEL="State",B._NUMERIC_OPS=[">",">=","<","<="],c([m({attribute:!1})],B.prototype,"hass",2),c([m({attribute:!1})],B.prototype,"value",2),c([g()],B.prototype,"_knownStates",2),c([g()],B.prototype,"_knownAttributeValues",2),B=c([w("ambience-state-expr-atom")],B);function cr(t,r){return t===null||r===null||t.length!==r.length?!1:t.every((e,i)=>e===r[i])}var ie=class extends b{constructor(){super(...arguments);this.path=[];this.dragOverPath=null;this.dragOverPos=null;this.dragFromPath=null;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(e,i={}){this.dispatchEvent(new CustomEvent(e,{detail:{path:this.path,...i},bubbles:!0,composed:!0}))}_atomIsComplete(e){return!!e.entity_id&&e.states.some(i=>i!=="")}_isErrorTarget(){return cr(this.path,this.errorPath)}_isDropTarget(){return cr(this.path,this.dragOverPath)}_dropPos(){return this._isDropTarget()?this.dragOverPos:null}_isDragging(){return cr(this.path,this.dragFromPath)}_onDragHandleDown(e){this.path.length!==0&&(!e.isPrimary||e.button>0||(e.stopPropagation(),this.dispatchEvent(new CustomEvent("node-drag-start",{detail:{path:this.path,pointer:e},bubbles:!0,composed:!0}))))}_dragHandle(){return this.path.length===0?"":d`<span
      class="drag-handle"
      title=${a(this.hass,"ui.drag_to_reorder","Drag to reorder")}
      @pointerdown=${this._onDragHandleDown}
      @click=${e=>e.stopPropagation()}
      >⠿</span
    >`}_notToggle(e){return d`<button class="not-toggle ${e?"on":""}"
      title=${a(this.hass,"ui.state_not_toggle","Negate (NOT)")}
      @click=${i=>{i.stopPropagation(),this._emit("node-toggle-not")}}>${U(this.hass,"not")}</button>`}_renderAtomCard(e,i){let n=this._atomIsComplete(e),s=cr(this.path,this.openPath),o=n?Qr(e,{hass:this.hass}):a(this.hass,"ui.state_new_condition","(new condition)");return d`
      <div class="atom-card ${s?"expanded":"collapsed"} ${this._dropPos()==="into"?"drag-over":""} ${this._isDragging()?"dragging":""}">
        <div class="atom-header"
          @click=${()=>this._emit("node-open")}>
          ${this._dragHandle()}
          ${this._notToggle(i)}
          <span class="summary ${n?"":"placeholder"}">${o}</span>
          <button class="wrap"
            title=${a(this.hass,"ui.state_wrap","Wrap in group")}
            @click=${l=>{l.stopPropagation(),this._emit("node-wrap")}}>(…)</button>
          <button class="remove"
            title=${a(this.hass,"ui.remove","Remove")}
            @click=${l=>{l.stopPropagation(),this._emit("node-remove")}}>✕</button>
        </div>
        ${s?d`
          <div class="atom-body">
            <ambience-state-expr-atom
              .hass=${this.hass}
              .value=${e}
              @value-changed=${l=>{l.stopPropagation();let u=l.detail.value,h=i?{kind:"not",item:u}:u;this._emit("node-change",{value:h})}}
            ></ambience-state-expr-atom>
            ${this._isErrorTarget()&&this.errorMessage?d`<div class="atom-error">${this.errorMessage}</div>`:""}
          </div>
        `:""}
      </div>
    `}_renderChildRow(e,i){let n=[...this.path,i];return d`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${e}
        .path=${n}
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
            @change=${n=>this._emit("node-set-op",{op:n.target.value})}>
            <option value="and" ?selected=${e.kind==="and"}>${U(this.hass,"and")}</option>
            <option value="or"  ?selected=${e.kind==="or"} >${U(this.hass,"or")}</option>
          </select>
          <button class="wrap"
            title=${a(this.hass,"ui.state_wrap_group","Wrap these clauses in parentheses")}
            @click=${n=>{n.stopPropagation(),this._emit("node-wrap")}}>(…)</button>
          <button class="unwrap"
            title=${a(this.hass,"ui.state_unwrap_group","Remove these parens (promote children to parent)")}
            @click=${()=>this._emit("node-unwrap")}>✕</button>
        </div>
        <div class="group-children">
          ${e.items.map((n,s)=>this._renderChildRow(n,s))}
        </div>
        <div class="actions">
          <button @click=${()=>this._emit("node-add-child")}>
            + ${a(this.hass,"ui.state_add_condition","Add clause")}
          </button>
        </div>
      </div>
    `}render(){let e=this.value.kind==="not",i=e?this.value.item:this.value,n=i.kind==="and"||i.kind==="or"?this._renderGroup(i,e):this._renderAtomCard(i,e),s=this._dropPos();return d`
      ${s==="before"?d`<div class="drop-line before"></div>`:""}
      ${n}
      ${s==="after"?d`<div class="drop-line after"></div>`:""}
    `}};ie.styles=y`
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
  `,c([m({attribute:!1})],ie.prototype,"hass",2),c([m({attribute:!1})],ie.prototype,"value",2),c([m({attribute:!1})],ie.prototype,"path",2),c([m({attribute:!1})],ie.prototype,"dragOverPath",2),c([m({attribute:!1})],ie.prototype,"dragOverPos",2),c([m({attribute:!1})],ie.prototype,"dragFromPath",2),c([m({attribute:!1})],ie.prototype,"openPath",2),c([m({attribute:!1})],ie.prototype,"errorPath",2),c([m({attribute:!1})],ie.prototype,"errorMessage",2),ie=c([w("ambience-state-expr-node")],ie);function li(t,r){return t===null||r===null||t.length!==r.length?!1:t.every((e,i)=>e===r[i])}function di(t){return t&&t.kind==="not"?t.item:t}var su=new Set(["is","is_not",">",">=","<","<=","and","or","not"]);function sa(t,r){if(!t.entity_id)return a(r,"ui.state_err_entity","Entity is required");let e=Array.isArray(t.states)?t.states:[];if(t.kind!=="is"&&t.kind!=="is_not"){let n=e[0];if(typeof n!="string"||!n.trim())return a(r,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(n)))return a(r,"ui.state_err_numeric","Value must be a number")}else if(!e.some(n=>n!==""))return a(r,"ui.state_err_state","State is required");return null}function ur(t,r){if(!t||typeof t!="object")return null;if(t.kind==="not"){let e=t.item;return e?ur(e,r):a(r,"ui.state_err_incomplete","This condition is incomplete")}if(t.kind==="and"||t.kind==="or"){let e=t.items;if(!Array.isArray(e)||e.length===0)return a(r,"ui.state_err_incomplete","This condition is incomplete");for(let i of e){let n=ur(i,r);if(n!==null)return n}return null}return sa(t,r)}function oa(t,r){if(t==null||typeof t!="object")return null;let e=t.kind;return typeof e!="string"||!su.has(e)?null:ur(t,r)}var ne=class extends b{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._dragFrom=null;this._dragOverPath=null;this._dragOverPos=null;this._cancelDrag=null;this._onNodeDragStart=e=>{e.stopPropagation(),this._startDrag(e.detail.path,e.detail.pointer)};this._onNodeChange=e=>{e.stopPropagation();let{path:i,value:n}=e.detail;if(this._isEmptyAtom(n)){let s=this._atomAt(i);if(s&&!this._isEmptyAtom(s)){this._openPath=null,this._removeAt(i);return}}this._replaceAt(i,n)};this._onNodeRemove=e=>{e.stopPropagation(),this._removeAt(e.detail.path)};this._onNodeWrap=e=>{e.stopPropagation(),this._wrapAt(e.detail.path)};this._onNodeAddChild=e=>{e.stopPropagation(),this._addChildAt(e.detail.path,"is")};this._onNodeToggleNot=e=>{e.stopPropagation(),this._toggleNotAt(e.detail.path)};this._onNodeSetOp=e=>{e.stopPropagation(),this._setGroupOpAt(e.detail.path,e.detail.op)};this._onNodeUnwrap=e=>{e.stopPropagation(),this._unwrapAt(e.detail.path)};this._onNodeOpen=e=>{if(e.stopPropagation(),this._openPath!==null){let i=this._atomAt(this._openPath);if(i&&this._atomError(i)!==null){this._showError=!0;return}}this._openPath!==null&&li(this._openPath,e.detail.path)?this._openPath=null:this._openPath=e.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-drag-start",this._onNodeDragStart)}disconnectedCallback(){super.disconnectedCallback(),this._endDrag()}_emit(e){this.value=e,L(this,e)}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(e,i){let n=this._patch(this.value,e,()=>i);this._emit(n)}_removeAt(e){if(this._openPath=null,e.length===0){this._emit(null);return}let i=this._patch(this.value,e,()=>null);this._emit(i)}_wrapAt(e){let i=this._nodeAt(e),n="and";if(i&&(i.kind==="and"||i.kind==="or"))n=i.kind==="and"?"or":"and";else if(e.length>0){let o=this._nodeAt(e.slice(0,-1));o&&(o.kind==="and"||o.kind==="or")&&(n=o.kind==="and"?"or":"and")}let s=this._patch(this.value,e,o=>o&&{kind:n,items:[o]});this._emit(s)}_nodeAt(e){return this._walkNode(this.value,e)}_moveRelative(e,i){let n=this._resolveInsertion(e,i);n&&this._emit(this._rewriteInsert(this.value,[],e,n.destParent,n.insert,n.source))}_resolveInsertion(e,i){if(e.length===0||li(e,i.path))return null;let n=this._nodeAt(e);if(!n)return null;if(i.pos==="into"){let o=di(this._nodeAt(i.path));return!o||o.kind!=="and"&&o.kind!=="or"||this._isPrefix(e,i.path)?null:{destParent:i.path,insert:{kind:"into"},source:n}}if(i.path.length===0)return null;let s=i.path.slice(0,-1);return this._isPrefix(e,s)?null:{destParent:s,insert:{kind:i.pos,index:i.path[i.path.length-1]},source:n}}_isPrefix(e,i){return e.length>i.length?!1:e.every((n,s)=>n===i[s])}_rewriteInsert(e,i,n,s,o,l){if(!e)return e;if(e.kind==="not"){let _=this._rewriteInsert(e.item,i,n,s,o,l);return _==null?null:{kind:"not",item:_}}if(e.kind!=="and"&&e.kind!=="or")return e;let u=li(i,n.slice(0,-1)),h=li(i,s),p=[],f=-1;if(e.items.forEach((_,v)=>{if(u&&v===n[n.length-1])return;let x=this._rewriteInsert(_,[...i,v],n,s,o,l);x!==null&&(p.push(x),h&&o.kind!=="into"&&v===o.index&&(f=p.length-1))}),h){let _=o.kind==="into"||f<0?p.length:o.kind==="before"?f:f+1;p.splice(_,0,l)}return p.length===0?null:{...e,items:p}}_startDrag(e,i){this._endDrag(),this._dragFrom=e,this._dragOverPath=null,this._dragOverPos=null;let n=i.target?.closest(".atom-card, .group");this._cancelDrag=qi(i,{onMove:(s,o)=>{let l=this._locateDropAt(s,o),u=l!==null&&this._resolveInsertion(e,l)!==null,h=u?l.path:null,p=u?l.pos:null;(!(li(h,this._dragOverPath)||h===null&&this._dragOverPath===null)||p!==this._dragOverPos)&&(this._dragOverPath=h,this._dragOverPos=p)},onEnd:(s,o)=>{let l=this._locateDropAt(s,o);l&&this._moveRelative(e,l),this._endDrag()},onCancel:()=>this._endDrag()},{follow:n})}_endDrag(){this._cancelDrag?.(),this._cancelDrag=null,this._dragFrom=null,this._dragOverPath=null,this._dragOverPos=null}_nodeElementAt(e,i){let n=Vi(e,i);for(;n;){if(n instanceof Element&&n.localName==="ambience-state-expr-node")return n;let s=n.parentNode;s?n=s:n instanceof ShadowRoot?n=n.host:n=null}return null}_locateDropAt(e,i){let n=this._nodeElementAt(e,i),s=n?.path;if(!n||!s)return null;let o=this._nodeAt([...s]),l=di(o),u=!!l&&(l.kind==="and"||l.kind==="or"),h=this._zoneFor(n.getBoundingClientRect(),i,{isGroup:u,isRoot:s.length===0});return h?{path:[...s],pos:h}:null}_zoneFor(e,i,n){if(n.isRoot)return n.isGroup?"into":null;if(n.isGroup){let s=Math.min(8,e.height/3);return i<e.top+s?"before":i>e.bottom-s?"after":"into"}return i<e.top+e.height/2?"before":"after"}_walkNode(e,i){return e?e.kind==="not"?this._walkNode(e.item,i):i.length===0?e:e.kind==="and"||e.kind==="or"?this._walkNode(e.items[i[0]]??null,i.slice(1)):null:null}_addChildAt(e,i){let n=null,s=this._patch(this.value,e,o=>{if(!o)return o;let l=o.kind==="not",u=di(o);if(u.kind==="and"||u.kind==="or"){let h=[...u.items,this._emptyAtom()];n=[...e,h.length-1];let p={...u,items:h};return l?{kind:"not",item:p}:p}return o});n!==null&&(this._openPath=n),this._emit(s)}_toggleNotAt(e){let i=this._patch(this.value,e,n=>n&&(n.kind==="not"?n.item:{kind:"not",item:n}));this._emit(i)}_setGroupOpAt(e,i){let n=this._patch(this.value,e,s=>{if(!s)return s;let o=null;if(s.kind==="and"||s.kind==="or")o=s;else if(s.kind==="not"){let l=s.item;(l.kind==="and"||l.kind==="or")&&(o=l)}return o?{kind:i,items:o.items}:s});this._emit(n)}_patch(e,i,n){if(i.length===0)return n(e);if(e==null)return e;let[s,...o]=i;if(e.kind==="and"||e.kind==="or"){let l=e.items.length,u=e.items.slice(),h=this._patch(u[s],o,n);if(h===null?u.splice(s,1):u[s]=h,u.length<l){if(u.length===0)return null;if(u.length===1)return u[0]}return{...e,items:u}}if(e.kind==="not"){let l=this._patch(e.item,i,n);return l==null?null:{kind:"not",item:l}}return e}_isEmptyAtom(e){if(e.kind==="not")return this._isEmptyAtom(e.item);if(e.kind==="and"||e.kind==="or")return!1;let i=e;return!i.entity_id&&i.states.every(n=>n==="")&&!i.attribute&&!i.for}_atomAt(e){return this._walk(this.value,e)}_walk(e,i){return e?e.kind==="not"?this._walk(e.item,i):i.length===0?e.kind==="and"||e.kind==="or"?null:e:e.kind==="and"||e.kind==="or"?this._walk(e.items[i[0]]??null,i.slice(1)):null:null}_treeError(e=this.value){return ur(e,this.hass)}_emitValidity(){let e=this._treeError();this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_atomError(e){return sa(e,this.hass)}_unwrapAt(e){if(this._openPath=null,e.length===0){let o=this.value;if(!o)return;let l=di(o);(l.kind==="and"||l.kind==="or")&&(l.items.length===1?this._emit(l.items[0]):this._emit(null));return}let i=e.slice(0,-1),n=e[e.length-1],s=this._patch(this.value,i,o=>{if(!o||o.kind!=="and"&&o.kind!=="or")return o;let l=o.items.slice(),u=l[n],h=null;if(u.kind==="and"||u.kind==="or")h=u;else if(u.kind==="not"){let p=u.item;(p.kind==="and"||p.kind==="or")&&(h=p)}return h?(l.splice(n,1,...h.items),{...o,items:l}):o});this._emit(s)}willUpdate(e){if(e.has("value")){let i=this.value;if(i&&this._openPath===null&&i.kind!=="and"&&i.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let n=this._atomAt(this._openPath);(!n||this._atomError(n)===null)&&(this._showError=!1)}this._emitValidity()}}_addAtRoot(){let e=this.value;if(e==null){this._addFirstAtom();return}if(e.kind==="and"||e.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[e,this._emptyAtom()]})}_setOpen(e){this._openPath=e}render(){if(this.value==null)return d`
        <div class="empty">
          <button @click=${()=>this._addFirstAtom()}>
            + ${a(this.hass,"ui.state_add_first","Add clause")}
          </button>
        </div>
      `;let e=this._showError&&this._openPath!==null?(()=>{let s=this._atomAt(this._openPath);return s?this._atomError(s):null})():null,i=di(this.value),n=i.kind!=="and"&&i.kind!=="or";return d`
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
      ${n?d`
        <button class="root-add" @click=${()=>this._addAtRoot()}>
          + ${a(this.hass,"ui.state_add_condition","Add clause")}
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
  `,c([m({attribute:!1})],ne.prototype,"hass",2),c([m({attribute:!1})],ne.prototype,"value",2),c([g()],ne.prototype,"_openPath",2),c([g()],ne.prototype,"_showError",2),c([g()],ne.prototype,"_dragFrom",2),c([g()],ne.prototype,"_dragOverPath",2),c([g()],ne.prototype,"_dragOverPos",2),ne=c([w("ambience-state-predicate-input")],ne);var aa=["everybody","anybody","nobody","any","all","none"],la=new Set(["any","all","none"]),gn={everybody:"everyone",anybody:"any",nobody:"nobody",any:"any",all:"everyone",none:"nobody"},at=class extends b{constructor(){super(...arguments);this.value=null;this._lastSelected=[]}_persons(){return fn(this.hass,"person")}_zones(){return fn(this.hass,"zone")}_cur(){return this.value??{}}_who(){return this.value?.who??[]}_hasWhoKey(){return this.value!=null&&Array.isArray(this.value.who)}_mode(){if(this._hasWhoKey())switch(this._cur().quant??"any"){case"any":return"any";case"everyone":return"all";case"nobody":return"none"}switch(this._cur().quant??"everyone"){case"nobody":return"nobody";case"any":return"anybody";default:return"everybody"}}_applyFor(e,i,n){if(Gt(i)){e.for=i;let s=xt(i,n);s&&(e.for_mode=s)}}_isNegativeQuant(){return gn[this._mode()]==="nobody"}_effectiveNegate(){return!this._isNegativeQuant()&&!!this._cur().negate}_emitMode(e){let i=this._cur(),n=i.where??"home",s={quant:gn[e],where:n};i.negate&&gn[e]!=="nobody"&&(s.negate=!0),la.has(e)&&(this._hasWhoKey()?s.who=[...this._who()]:this._lastSelected.length>0?s.who=[...this._lastSelected]:s.who=this._persons().map(o=>o.id)),this._applyFor(s,i.for,i.for_mode),this._emit(s)}_emit(e){this.value=e,L(this,e)}_setMode(e){this._emitMode(e)}_setWhere(e){let i=this._cur(),n={quant:i.quant??"everyone",where:e};this._effectiveNegate()&&(n.negate=!0),this._hasWhoKey()&&(n.who=[...this._who()]),this._applyFor(n,i.for,i.for_mode),this._emit(n)}_setNegate(e){let i=this._cur(),n={quant:i.quant??"everyone",where:i.where??"home"};e&&(n.negate=!0),this._hasWhoKey()&&(n.who=[...this._who()]),this._applyFor(n,i.for,i.for_mode),this._emit(n)}_togglePerson(e,i){let n=i?[...this._who(),e]:this._who().filter(l=>l!==e);n.length>0&&(this._lastSelected=[...n]);let s=this._cur(),o={quant:s.quant??"any",where:s.where??"home",who:n};this._effectiveNegate()&&(o.negate=!0),this._applyFor(o,s.for,s.for_mode),this._emit(o)}_setFor(e){let{mode:i,...n}=e,s=this._cur(),o={quant:s.quant??"everyone",where:s.where??"home"};this._effectiveNegate()&&(o.negate=!0),this._hasWhoKey()&&(o.who=[...this._who()]),this._applyFor(o,n,i??"at_least"),this._emit(o)}_modeLabel(e){switch(e){case"everybody":return a(this.hass,"ui.people_mode_everybody","Everybody");case"anybody":return a(this.hass,"ui.people_mode_anybody","Anybody");case"nobody":return a(this.hass,"ui.people_mode_nobody","Nobody");case"any":return a(this.hass,"ui.people_mode_any","Any of:");case"all":return a(this.hass,"ui.people_mode_all","All of:");case"none":return a(this.hass,"ui.people_mode_none","None of:")}}_renderMode(e){if(customElements.get("ha-form")){let i=[{name:"mode",required:!0,selector:{select:{mode:"dropdown",options:aa.map(n=>({value:n,label:this._modeLabel(n)}))}}}];return d`<ha-form
        class="mode"
        .hass=${this.hass}
        .schema=${i}
        .data=${{mode:e}}
        .computeLabel=${()=>""}
        @value-changed=${n=>{n.stopPropagation(),n.detail.value.mode&&this._setMode(n.detail.value.mode)}}
      ></ha-form>`}return d`<select
      class="mode"
      @change=${i=>this._setMode(i.target.value)}
    >
      ${aa.map(i=>d`<option value=${i} ?selected=${i===e}>${this._modeLabel(i)}</option>`)}
    </select>`}_renderPeople(){let e=this._persons();if(e.length===0)return d`<div class="hint">${a(this.hass,"ui.people_none_tracked","No people tracked")}</div>`;let i=this._who();return d`<div class="people-list">
      ${e.map(n=>d`<label class="person-pill">
        <input
          type="checkbox"
          .checked=${i.includes(n.id)}
          @change=${s=>this._togglePerson(n.id,s.target.checked)}
        />${n.name}
      </label>`)}
    </div>
    <div class="field-error">${i.length===0?a(this.hass,"ui.people_select_one","Select at least one person"):""}</div>`}_renderNegate(e){let i=[{value:"false",label:a(this.hass,"ui.people_is_at","Is at")},{value:"true",label:a(this.hass,"ui.people_is_not_at","Is not at")}],n=s=>this._setNegate(s==="true");if(customElements.get("ha-form")){let s=[{name:"negate",required:!0,selector:{select:{mode:"dropdown",options:i}}}];return d`<ha-form
        class="negate"
        .hass=${this.hass}
        .schema=${s}
        .data=${{negate:e?"true":"false"}}
        .computeLabel=${()=>""}
        @value-changed=${o=>{o.stopPropagation(),o.detail.value.negate!=null&&n(o.detail.value.negate)}}
      ></ha-form>`}return d`<select
      class="negate"
      @change=${s=>n(s.target.value)}
    >
      ${i.map(s=>d`<option value=${s.value} ?selected=${s.value===(e?"true":"false")}>${s.label}</option>`)}
    </select>`}_renderWhere(e){let i=this._zones().filter(s=>s.id!=="zone.home"),n=[{value:"home",label:a(this.hass,"ui.people_where_home","Home")},...i.map(s=>({value:s.id,label:s.name}))];if(customElements.get("ha-form")){let s=[{name:"where",required:!0,selector:{select:{mode:"dropdown",options:n}}}];return d`<ha-form
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
      ${n.map(s=>d`<option value=${s.value} ?selected=${s.value===e}>${s.label}</option>`)}
    </select>`}_renderFor(){return d`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this._cur().for??null}
      .mode=${this._cur().for_mode??"at_least"}
      @value-changed=${e=>{e.stopPropagation(),this._setFor(e.detail.value)}}
    ></ambience-for-duration>`}render(){let i=this._cur().where??"home",n=this._mode(),s=!this._isNegativeQuant(),o=this._effectiveNegate();return d`
      <div class="row">${this._renderMode(n)}</div>
      ${la.has(n)?this._renderPeople():""}
      <div class="row">
        ${s?this._renderNegate(o):d`<span class="label negate-static">${a(this.hass,"ui.people_is_at_static","is at")}</span>`}
        ${this._renderWhere(i)}
      </div>
      <div class="row">
        <span class="label">${a(this.hass,"ui.people_for","for")}</span>
        ${this._renderFor()}
      </div>
    `}};at.styles=y`
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
  `,c([m({attribute:!1})],at.prototype,"hass",2),c([m({attribute:!1})],at.prototype,"value",2),at=c([w("ambience-people-predicate-input")],at);var lt=class extends b{constructor(){super(...arguments);this.value=null}_cur(){return this.value??{sensors:[]}}_sensors(){return this._cur().sensors??[]}_showQuant(){return this._sensors().length>1}_build(e){let i={...this._cur(),...e},n={sensors:i.sensors??[]};if(i.occupied===!1&&(n.occupied=!1),i.quant==="all"&&(n.quant="all"),Gt(i.for)){n.for=i.for;let s=xt(i.for,i.for_mode);s&&(n.for_mode=s)}return i.negate===!0&&(n.negate=!0),n}_emit(e){this.value=e,L(this,e)}_setSensors(e){this._emit(this._build({sensors:e}))}_setOccupied(e){this._emit(this._build({occupied:e}))}_setNegate(e){this._emit(this._build({negate:e}))}_setQuant(e){this._emit(this._build({quant:e}))}_setFor(e){let{mode:i,...n}=e;this._emit(this._build({for:n,for_mode:i??"at_least"}))}_sensorSchema(){return[{name:"sensors",selector:{entity:{domain:"binary_sensor",device_class:["occupancy","presence","motion"],multiple:!0}}}]}_renderSensors(){return Tt(this.hass,this._sensorSchema(),this._sensors(),"binary_sensor.a, binary_sensor.b",e=>this._setSensors(e))}_renderNegate(e){return je(this.hass,"negate","negate",e?"is_not":"is",[{value:"is",label:a(this.hass,"ui.occupancy_is","is")},{value:"is_not",label:a(this.hass,"ui.occupancy_is_not","is not")}],i=>this._setNegate(i==="is_not"))}_renderOccupied(e){return je(this.hass,"state","state",e?"occupied":"vacant",[{value:"occupied",label:a(this.hass,"ui.occupancy_detected","Detected")},{value:"vacant",label:a(this.hass,"ui.occupancy_clear","Clear")}],i=>this._setOccupied(i==="occupied"))}_renderQuant(e){return je(this.hass,"quant","quant",e,[{value:"any",label:a(this.hass,"ui.occupancy_any","Any of")},{value:"all",label:a(this.hass,"ui.occupancy_all","All of")}],i=>this._setQuant(i))}_renderFor(){return d`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this._cur().for??null}
      .mode=${this._cur().for_mode??"at_least"}
      @value-changed=${e=>{e.stopPropagation(),this._setFor(e.detail.value)}}
    ></ambience-for-duration>`}render(){let e=this._cur(),i=e.occupied!==!1,n=e.negate===!0,s=e.quant==="all"?"all":"any";return d`
      ${this._showQuant()?d`<div class="row">${this._renderQuant(s)}</div>`:""}
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._renderNegate(n)}
        ${this._renderOccupied(i)}
      </div>
      <div class="row">
        <span class="label">${a(this.hass,"ui.occupancy_for","for")}</span>
        ${this._renderFor()}
      </div>
    `}};lt.styles=y`
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
  `,c([m({attribute:!1})],lt.prototype,"hass",2),c([m({attribute:!1})],lt.prototype,"value",2),lt=c([w("ambience-occupancy-predicate-input")],lt);function da(t,r){if(t==null)return null;let e=t.entities;return!Array.isArray(e)||e.length===0?a(r,"ui.unavailable_select_one","Select at least one entity"):null}var ou=[{name:"sensors",selector:{entity:{multiple:!0}}}],dt=class extends b{constructor(){super(...arguments);this.value=null}_entities(){return this.value?.entities??[]}_setEntities(e){let i=e.length?{entities:e}:null;this.value=i,L(this,i)}render(){return d`
      <div class="row">
        ${Tt(this.hass,ou,this._entities(),"binary_sensor.a, light.b",e=>this._setEntities(e))}
      </div>
    `}};dt.styles=y`
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
  `,c([m({attribute:!1})],dt.prototype,"hass",2),c([m({attribute:!1})],dt.prototype,"value",2),dt=c([w("ambience-unavailable-predicate-input")],dt);var au=new Set(["1","true","yes","on","enable"]);function ca(t){return t==null?!1:typeof t=="boolean"?t:typeof t=="number"?t!==0:typeof t=="string"?au.has(t.toLowerCase().trim()):!1}function lu(t){if(t!==null&&typeof t=="object")try{return JSON.stringify(t)}catch{return String(t)}return String(t)}var Be=class extends b{constructor(){super(...arguments);this.value=null;this._preview=null;this._debounceMs=250;this._gen=0}_template(){return this.value&&typeof this.value=="object"?this.value.template:""}willUpdate(e){if(!e.has("value")&&!e.has("hass"))return;let i=this._template(),n=this.hass?.connection;i===this._activeTemplate&&n===this._activeConn||(this._activeTemplate=i,this._activeConn=n,this._scheduleRender())}disconnectedCallback(){super.disconnectedCallback(),this._teardown()}_teardown(){this._debounceTimer!=null&&(clearTimeout(this._debounceTimer),this._debounceTimer=void 0),this._unsub&&(this._unsub(),this._unsub=void 0)}_scheduleRender(){this._teardown();let e=this._template();if(!e.trim()||!this.hass?.connection?.subscribeMessage){this._setPreview(null);return}let i=++this._gen;this._debounceTimer=setTimeout(()=>this._subscribe(e,i),this._debounceMs)}async _subscribe(e,i){let n=this.hass?.connection;if(n?.subscribeMessage)try{let s=await n.subscribeMessage(o=>{i===this._gen&&this._setPreview(o.error!=null?{error:o.error}:{value:lu(o.result),truthy:ca(o.result)})},{type:"render_template",template:e,report_errors:!0});if(i!==this._gen){s();return}this._unsub=s}catch(s){if(i!==this._gen)return;this._setPreview({error:s?.message??String(s)})}}_setPreview(e){this._preview=e,this._emitValidity(e!=null&&"error"in e?e.error:null)}_emitValidity(e){this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_onInput(e){let i=e.target.value,n=i.trim()===""?null:{template:i};this.value=n,L(this,n)}_renderPreview(){let e=this._preview;return e==null?"":"error"in e?d`<div class="preview error">
        <div class="body">
          <span class="label">${a(this.hass,"ui.template_result","Result")}</span><span class="value">${e.error}</span>
        </div>
      </div>`:d`<div class="preview">
      <div class="body">
        <span class="label">${a(this.hass,"ui.template_result","Result")}</span><span class="value">${e.value}</span>
      </div>
      <span class="bool ${e.truthy?"true":"false"}"
        >${e.truthy?a(this.hass,"ui.template_truthy","true \u2014 matches"):a(this.hass,"ui.template_falsy","false \u2014 no match")}</span
      >
    </div>`}render(){return d`
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
  `,c([m({attribute:!1})],Be.prototype,"value",2),c([m({attribute:!1})],Be.prototype,"hass",2),c([g()],Be.prototype,"_preview",2),Be=c([w("ambience-template-predicate-input")],Be);var se=class extends b{constructor(){super(...arguments);this.value=null;this._onChild=e=>{e.stopPropagation(),this._emit(e.detail.value)}}_emit(e){L(this,e)}_onText(e){let i=e.target.value;this._emit(i.trim()===""?null:i)}render(){return this.condition.input==="time_of_day"?d`
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
        placeholder=${a(this.hass,"ui.any_placeholder","(any)")}
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
  `,c([m({attribute:!1})],se.prototype,"condition",2),c([m({attribute:!1})],se.prototype,"value",2),c([m({attribute:!1})],se.prototype,"periods",2),c([m({attribute:!1})],se.prototype,"luxRanges",2),c([m({attribute:!1})],se.prototype,"dayConfig",2),c([m({attribute:!1})],se.prototype,"weatherConfig",2),c([m({attribute:!1})],se.prototype,"hass",2),se=c([w("ambience-condition-input")],se);function du(t){return t!=null&&typeof t=="object"&&Array.isArray(t.who)&&t.who.length===0}function cu(t){return t==="people"?{quant:"everyone",where:"home"}:null}function ua(t,r){return!!t&&!!r&&R(t)===R(r)}var uu={state:oa,day:ta,lux:ea,unavailable:da},S=class extends b{constructor(){super(...arguments);this.open=!1;this.scene=null;this.conditions=[];this.availableActions=[];this.categories=[];this.schemas={};this.scopes=[];this.takenNames=new Map;this.saveError="";this.scopeChangedElsewhere=!1;this._staleAcknowledged=!1;this._draft=null;this._open=null;this._showError=!1;this._addOrder=[];this._serviceHasTarget=new Map;this._conditionError=new Map;this._onNameInput=e=>{this._setName(e.target.value)};this._onDescriptionInput=e=>{this._setDescription(e.target.value)};this._onDescriptionHaForm=e=>{e.stopPropagation(),this._setDescription(e.detail.value.description??"")};this._descriptionLabel=()=>a(this.hass,"ui.description","Description");this._onAddCondition=e=>{let i=e.target,n=i.value;i.value="",this._addCondition(n)};this._onAddConditionHaForm=e=>{e.stopPropagation();let i=e.detail.value.add;i!==S._ADD_CONDITION_PLACEHOLDER&&this._addCondition(i)};this._onAddAction=e=>{let i=e.target,n=i.value;i.value="",this._addActionSlot(n)};this._onAddActionHaForm=e=>{e.stopPropagation();let i=e.detail.value.add;i!==S._ADD_ACTION_PLACEHOLDER&&this._addActionSlot(i)};this._onApplyToggle=e=>{if(!this._draft)return;let i={...this._draft};e.target.checked?i.apply="always":delete i.apply,this._draft=i}}_onConditionInvalid(e,i){i?this._conditionError.set(e,i):this._conditionError.delete(e)}connectedCallback(){super.connectedCallback(),re(this)}willUpdate(e){e.has("open")&&this.open&&(this._draft=this.scene?JSON.parse(JSON.stringify(this.scene)):null,this._scope=this.scope,this._open=null,this._showError=!1,this._addOrder=[],this._conditionError=new Map,this._staleAcknowledged=!1),e.has("scopeChangedElsewhere")&&!this.scopeChangedElsewhere&&(this._staleAcknowledged=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_setDestination(e){let i=this.scopes[e];if(!i||!this._draft||(this._scope=i.scope,!this.hass))return;let n=new Set(zi(this.hass,this._scope,[]));this._draft={...this._draft,actions:this._draft.actions.map(s=>({...s,entity_ids:s.entity_ids.filter(o=>n.has(o))}))}}_renderDestination(){return d`
      <div class="scope-menu" role="listbox">
        ${this.scopes.map((e,i)=>d`<button
            class="scope-option"
            role="option"
            aria-selected=${ua(e.scope,this._scope)}
            @click=${()=>{this._setDestination(i),this._open=null}}
          >
            <ha-icon class="scope-icon" icon=${Vt(e.scope,this.hass)}></ha-icon>
            <span class="scope-name">${e.label}</span>
          </button>`)}
      </div>
    `}_renderDestinationSlot(){if(this.scopes.length===0)return"";if(this._isOpen({kind:"destination"}))return d`
        <div class="slot destination-slot expanded" data-slot-id="destination">
          ${this._renderDestination()}
        </div>
      `;let e=this.scopes.find(i=>ua(i.scope,this._scope))??this.scopes[0];return d`
      <div class="slot collapsed" data-slot-id="destination">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"destination"})}>
          <strong>${a(this.hass,"ui.scope","Scope")}:</strong>
          <ha-icon class="scope-icon" icon=${Vt(e.scope,this.hass)}></ha-icon>
          <span class="scope-name">${e.label}</span>
        </div>
      </div>
    `}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"})){let s=this._showError?this._nameError():null;return d`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
          ${s?d`<div class="error">${s}</div>`:""}
        </div>
      `}let n=Ji(this._draft,a(this.hass,"ui.new_scene","New scene"));return d`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${n}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let i=Mn();return i==="ha-input"?d`<ha-input label=${a(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:i==="ha-textfield"?d`<ha-textfield label=${a(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:d`<input type="text" .value=${e} @input=${this._onNameInput} />`}_setDescription(e){this._draft&&(this._draft={...this._draft,description:e.trim()?e:void 0})}_renderDescriptionHaForm(e){return d`
      <ha-form
        .hass=${this.hass}
        .schema=${S._DESCRIPTION_SCHEMA}
        .data=${{description:e}}
        .computeLabel=${this._descriptionLabel}
        @value-changed=${this._onDescriptionHaForm}
      ></ha-form>
    `}_renderDescriptionEditor(e){return customElements.get("ha-form")?this._renderDescriptionHaForm(e):d`<textarea
      class="description-input"
      .value=${e}
      autofocus
      rows="3"
      placeholder=${a(this.hass,"ui.description","Description")}
      @input=${this._onDescriptionInput}
    ></textarea>`}_renderDescriptionSlot(){let e=this._draft.description??"";return this._isOpen({kind:"description"})?d`
        <div class="slot description-slot expanded" data-slot-id="description">
          ${this._renderDescriptionEditor(e)}
        </div>
      `:e.trim()?d`
        <div class="slot collapsed" data-slot-id="description">
          <div class="summary" @click=${()=>this._toggleSlot({kind:"description"})}>
            <span class="summary-label description-text">${e}</span>
          </div>
        </div>
      `:d`
      <div class="add-description-row" data-slot-id="description">
        <button class="add-description" @click=${()=>this._toggleSlot({kind:"description"})}>
          ${a(this.hass,"ui.add_description","+ Add description")}
        </button>
      </div>
    `}_setCategory(e){!this._draft||!e||e===this._draft.category||(this._draft={...qt(this._draft),category:e})}_renderCategorySlot(){if(this.categories.length===0)return"";let e=[...this.categories].sort((s,o)=>s.name.localeCompare(o.name)),i=this._effectiveCategoryId(),n=this.categories.find(s=>s.id===i)??e[0];return this._isOpen({kind:"category"})?d`
        <div class="slot category-slot expanded" data-slot-id="category">
          <div class="category-menu" role="listbox">
            ${e.map(s=>d`<button
                class="category-option"
                role="option"
                aria-selected=${s.id===i}
                @click=${()=>{this._setCategory(s.id),this._open=null}}
              >
                ${gt(s.color,s.icon)}
                <span class="category-name">${s.name}</span>
              </button>`)}
          </div>
        </div>
      `:d`
      <div class="slot collapsed" data-slot-id="category">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"category"})}>
          <strong>${a(this.hass,"ui.category","Category")}:</strong>
          ${gt(n.color,n.icon)}
          <span class="category-name">${n.name}</span>
        </div>
      </div>
    `}_isOpen(e){let i=this._open;return i===null||i.kind!==e.kind?!1:e.kind==="condition"&&i.kind==="condition"?e.id===i.id:e.kind==="action"&&i.kind==="action"?e.idx===i.idx:!0}_effectiveCategoryId(){return this._draft?.category?this._draft.category:[...this.categories].sort((i,n)=>i.name.localeCompare(n.name))[0]?.id??""}_nameError(){let e=this._draft?.name?.trim().toLowerCase();if(!e||!this._scope)return null;let i=ji(this._scope,this._effectiveCategoryId());return this.takenNames.get(i)?.has(e)?a(this.hass,"ui.name_duplicate","A scene with this name already exists in this category."):null}_validationError(e){if(e===null||e.kind==="category"||e.kind==="destination"||e.kind==="description")return null;if(e.kind==="name")return this._nameError();if(e.kind==="condition"){let s=this._draft?.when[e.id];if(du(s))return a(this.hass,"ui.people_select_one","Select at least one person");let o=uu[e.id]?.(s,this.hass);return o||(this._conditionError.has(e.id)?a(this.hass,"ui.condition_error","Fix the error in this condition before continuing"):null)}let i=this._draft?.actions[e.idx];if(!i)return null;let n=this._serviceHasTarget.get(i.service);return i.entity_ids.length===0&&n===!0?a(this.hass,"ui.at_least_one_target","At least one target is required."):null}_leaveBlockingError(e){return e?.kind==="name"?null:this._validationError(e)}_tryCloseCurrent(){return this._open===null?!0:this._leaveBlockingError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){if(this._leaveBlockingError(e)!==null){this._showError=!0;return}this._open=null,this._showError=!1;return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let i of e.composedPath())if(i instanceof Element&&(i.classList.contains("slot")||i.classList.contains("actions-bar")||i.classList.contains("add-condition")||i.classList.contains("add-action")||i.classList.contains("add-description")))return;this._tryCloseCurrent()}_setPredicate(e,i){if(!this._draft)return;let n={...this._draft.when};i==null?delete n[e]:n[e]=i,this._draft={...this._draft,when:n}}_renderConditionRow(e){let i=this._draft.when[e.name]??null,n=this._isOpen({kind:"condition",id:e.name}),s=kt(e.name,i,{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges});return d`
      <div class="slot ${n?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"condition",id:e.name})}>
          <span class="summary-label"><strong>${G(this.hass,e.name)}:</strong> ${s}</span>
          <button
            class="remove"
            @click=${o=>{o.stopPropagation(),this._removeCondition(e.name)}}
            title=${a(this.hass,"ui.remove_condition","Remove condition")}
          >✕</button>
        </div>
        ${n?d`
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
    `}_visibleConditions(){if(!this._draft)return[];let e=this._draft.when,i=this.conditions.filter(l=>l.name in e&&e[l.name]!=null||this._open?.kind==="condition"&&this._open.id===l.name),n=new Set(this._addOrder),s=i.filter(l=>!n.has(l.name)),o=this._addOrder.map(l=>i.find(u=>u.name===l)).filter(l=>l!=null);return[...s,...o]}_unusedConditions(){let e=new Set(this._visibleConditions().map(i=>i.name));return this.conditions.filter(i=>!e.has(i.name)).sort((i,n)=>G(this.hass,i.name).localeCompare(G(this.hass,n.name)))}_addCondition(e){if(!e||this._open!==null&&!this._tryCloseCurrent())return;let i=cu(e);i!=null&&this._draft&&!(e in this._draft.when)&&(this._draft={...this._draft,when:{...this._draft.when,[e]:i}}),this._addOrder=[...this._addOrder.filter(n=>n!==e),e],this._open={kind:"condition",id:e},this._showError=!1}_removeCondition(e){if(!this._draft)return;let i={...this._draft.when};delete i[e],this._draft={...this._draft,when:i},this._conditionError.delete(e),this._open?.kind==="condition"&&this._open.id===e&&(this._open=null,this._showError=!1)}_conditionDisabled(e){return e==="weather"&&!this.weatherConfig?.entity}_renderAddCondition(){let e=this._unusedConditions();return e.length===0?"":customElements.get("ha-form")?this._renderAddConditionHaForm(e):d`
      <div class="add-condition">
        <select class="add-condition" @change=${this._onAddCondition}>
          <option value="">${a(this.hass,"ui.add_condition","+ Add condition\u2026")}</option>
          ${e.map(i=>d`<option value=${i.name} ?disabled=${this._conditionDisabled(i.name)}>${G(this.hass,i.name)}</option>`)}
        </select>
      </div>
    `}_renderAddConditionHaForm(e){let i=a(this.hass,"ui.add_condition","+ Add condition\u2026"),n=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_CONDITION_PLACEHOLDER,label:i},...e.map(s=>({value:s.name,label:G(this.hass,s.name),disabled:this._conditionDisabled(s.name)}))]}}}];return d`
      <div class="add-condition">
        <ha-form
          .hass=${this.hass}
          .schema=${n}
          .data=${{add:S._ADD_CONDITION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddConditionHaForm}
        ></ha-form>
      </div>
    `}_addActionSlot(e){if(!this._draft||!e||this._open!==null&&!this._tryCloseCurrent())return;let i={service:e,entity_ids:[],params:{}},n=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,i]},this._open={kind:"action",idx:n},this._showError=!1}_actionOptionLabel(e){return e.label?.trim()?e.label:this.schemas[e.id]?.name?.trim()||e.id}_renderAddAction(){return this.availableActions.length===0?d`
        <p class="add-action-empty">
          ${a(this.hass,"ui.no_exposed_actions","Add services in Settings \u2192 Actions.")}
        </p>
      `:customElements.get("ha-form")?this._renderAddActionHaForm():d`
      <div class="add-action">
        <select class="add-action" @change=${this._onAddAction}>
          <option value="">${a(this.hass,"ui.add_action","+ Add action\u2026")}</option>
          ${this.availableActions.map(e=>d`
            <option value=${e.id}>${this._actionOptionLabel(e)}</option>
          `)}
        </select>
      </div>
    `}_renderAddActionHaForm(){let e=a(this.hass,"ui.add_action","+ Add action\u2026"),i=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_ACTION_PLACEHOLDER,label:e},...this.availableActions.map(n=>({value:n.id,label:this._actionOptionLabel(n)}))]}}}];return d`
      <div class="add-action">
        <ha-form
          .hass=${this.hass}
          .schema=${i}
          .data=${{add:S._ADD_ACTION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddActionHaForm}
        ></ha-form>
      </div>
    `}_renderApply(){return d`
      <div class="apply-control">
        <label>
          ${a(this.hass,"ui.apply_on_every_match","Apply on every match")}
          <ambience-help
            .hass=${this.hass}
            .text=${a(this.hass,"ui.help_apply_on_every_match","When on, Ambience re-applies this scene's actions every time it wins its scope/category, not just the first time it becomes the active scene.")}
          ></ambience-help>
        </label>
        ${yt({checked:this._draft.apply==="always",dataTest:"apply-on-every-match",onChange:this._onApplyToggle})}
      </div>
    `}_updateActionAt(e,i){if(!this._draft)return;let n=this._draft.actions.map((s,o)=>o===e?i(s):s);this._draft={...this._draft,actions:n}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((i,n)=>n!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,i){this._updateActionAt(e,n=>({...n,entity_ids:i}))}_setActionParams(e,i){this._updateActionAt(e,n=>({...n,params:i}))}_onTargetModeChanged(e,i){this._serviceHasTarget.get(e)!==i&&(this._serviceHasTarget=new Map(this._serviceHasTarget).set(e,i))}_renderActionRow(e,i){let n=this.availableActions.find(u=>u.id===e.service),s=this._isOpen({kind:"action",idx:i}),o=co(e,{hass:this.hass,exposedActions:this.availableActions,schemas:this.schemas}),l=n===void 0?a(this.hass,"ui.action_unavailable","Action no longer available; configure it in Settings \u2192 Actions or remove this action."):null;return d`
      <div class="slot ${s?"expanded":"collapsed"}" data-slot-id="action-${i}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:i})}>
          ${l?d`<ambience-problem-flag
                  .severity=${"error"}
                  .summary=${l}
                  .details=${[l]}
                ></ambience-problem-flag>`:""}
          <span class="summary-label">${o}</span>
          <button class="remove" @click=${u=>{u.stopPropagation(),this._deleteAction(i)}} title=${a(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${s?d`
          <div class="body">
            <ambience-action-slot
              .hass=${this.hass}
              .scope=${this._scope}
              .service=${e.service}
              .exposed=${n}
              .entityIds=${e.entity_ids}
              .excludeEntities=${Qs(this._draft?.actions??[],i)}
              .params=${e.params}
              @entity-ids-changed=${u=>{u.stopPropagation(),this._setActionTargets(i,u.detail.entityIds)}}
              @params-changed=${u=>{u.stopPropagation(),this._setActionParams(i,u.detail.params)}}
              @target-mode-changed=${u=>{u.stopPropagation(),this._onTargetModeChanged(e.service,u.detail.hasTarget)}}
            ></ambience-action-slot>

            ${this._showError&&this._validationError({kind:"action",idx:i})?d`
              <div class="error">${this._validationError({kind:"action",idx:i})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_save(){if(!this._draft)return;if(this._nameError()!==null){this._showError=!0,this._open={kind:"name"};return}for(let i of Object.keys(this._draft.when))if(this._draft.when[i]!=null&&this._validationError({kind:"condition",id:i})!==null){this._showError=!0,this._open={kind:"condition",id:i};return}for(let i=0;i<this._draft.actions.length;i++)if(this._validationError({kind:"action",idx:i})!==null){this._showError=!0,this._open={kind:"action",idx:i};return}let e=Object.fromEntries(Object.entries(this._draft.when).filter(([,i])=>i!=null));this.dispatchEvent(new CustomEvent("save-scene",{detail:{scene:{...this._draft,when:e},scope:this._scope},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-scene",{bubbles:!0,composed:!0}))}_overwriteTheirs(){this._staleAcknowledged=!0}_loadTheirs(){this._cancel()}_renderConflictDialog(){return!this.scopeChangedElsewhere||this._staleAcknowledged?"":d`
      <div class="conflict-backdrop" @click=${e=>e.stopPropagation()}>
        <div class="conflict-dialog" role="alertdialog" aria-modal="true">
          <p>
            ${a(this.hass,"ui.history_conflict_body","Another tab changed the scenes in this scope while you were editing.")}
          </p>
          <div class="conflict-actions">
            <button class="secondary conflict-load" @click=${this._loadTheirs}>
              ${a(this.hass,"ui.history_conflict_load","Load theirs")}
            </button>
            <button class="primary conflict-overwrite" @click=${this._overwriteTheirs}>
              ${a(this.hass,"ui.history_conflict_overwrite","Overwrite theirs")}
            </button>
          </div>
        </div>
      </div>
    `}render(){if(!this._draft)return d``;let e=this._visibleConditions();return d`
      <div class="modal" @click=${this._onModalClick}>
        <div class="content">
          ${this._renderNameSlot()}
          ${this._renderCategorySlot()}
          ${this._renderDestinationSlot()}
          ${this._renderDescriptionSlot()}

          <h3>${a(this.hass,"ui.when_heading","When")}</h3>
          ${e.map(i=>this._renderConditionRow(i))}
          ${this._renderAddCondition()}

          <h3>${a(this.hass,"ui.actions_heading","Actions")}</h3>
          ${this._draft.actions.map((i,n)=>this._renderActionRow(i,n))}
          ${this._renderAddAction()}
          ${this._renderApply()}
        </div>

        <div class="actions-bar">
          ${this.saveError?d`<div class="error save-error">${this.saveError}</div>`:""}
          <button class="secondary" @click=${this._cancel}>${a(this.hass,"ui.cancel","Cancel")}</button>
          <button class="primary" @click=${this._save}>${a(this.hass,"ui.save_scene","Save scene")}</button>
        </div>
        ${this._renderConflictDialog()}
      </div>
    `}};S.styles=[Hi,y`
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
  `],S._DESCRIPTION_SCHEMA=[{name:"description",selector:{text:{multiline:!0}}}],S._ADD_CONDITION_PLACEHOLDER="__add_condition__",S._ADD_ACTION_PLACEHOLDER="__add_action__",c([m({type:Boolean,reflect:!0})],S.prototype,"open",2),c([m({attribute:!1})],S.prototype,"scene",2),c([m({attribute:!1})],S.prototype,"conditions",2),c([m({attribute:!1})],S.prototype,"periods",2),c([m({attribute:!1})],S.prototype,"luxRanges",2),c([m({attribute:!1})],S.prototype,"dayConfig",2),c([m({attribute:!1})],S.prototype,"weatherConfig",2),c([m({attribute:!1})],S.prototype,"availableActions",2),c([m({attribute:!1})],S.prototype,"categories",2),c([m({attribute:!1})],S.prototype,"schemas",2),c([m({attribute:!1})],S.prototype,"hass",2),c([m({attribute:!1})],S.prototype,"scope",2),c([m({attribute:!1})],S.prototype,"scopes",2),c([m({attribute:!1})],S.prototype,"takenNames",2),c([m({attribute:!1})],S.prototype,"saveError",2),c([m({attribute:!1})],S.prototype,"scopeChangedElsewhere",2),c([g()],S.prototype,"_staleAcknowledged",2),c([g()],S.prototype,"_draft",2),c([g()],S.prototype,"_scope",2),c([g()],S.prototype,"_open",2),c([g()],S.prototype,"_showError",2),c([g()],S.prototype,"_addOrder",2),c([g()],S.prototype,"_serviceHasTarget",2),S=c([w("ambience-scene-editor")],S);function hu(t,r,e,i){return r==="time_of_day"?de(t,e,i):r==="weather"?ft(t,e):e}var pr=y`
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
`;function ha(t,r){t.stopPropagation(),t.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:r},bubbles:!0,composed:!0}))}function _n(t,r,e){let i=n=>{(n.key==="Enter"||n.key===" ")&&!n.repeat&&(n.preventDefault(),ha(n,r))};return d`<span
    class="entity-link"
    role="button"
    tabindex="0"
    title=${a(t,"ui.show_more_info","Show more info")}
    @click=${n=>ha(n,r)}
    @keydown=${i}
    >${e}</span
  >`}function pa(t,r){return _n(t,r,M(t,r))}var pu=new Set(["occupancy","people","lux","state"]);function mu(t,r,e,i,n){let s=hu(t,r,e,i);if(!n?.length||!pu.has(r))return s;let o=[],l=n.map(p=>({id:p,name:M(t,p)})).sort((p,f)=>f.name.length-p.name.length);for(let{id:p,name:f}of l)for(let _=0;_<=s.length;){let v=s.indexOf(f,_);if(v===-1)break;let x=v+f.length;if(!o.some(C=>v<C.end&&C.start<x)){o.push({start:v,end:x,id:p,name:f});break}_=v+1}if(o.length===0)return s;o.sort((p,f)=>p.start-f.start);let u=[],h=0;for(let p of o)p.start>h&&u.push(s.slice(h,p.start)),u.push(_n(t,p.id,p.name)),h=p.end;return h<s.length&&u.push(s.slice(h)),d`${u}`}var fu={has_time:["ui.cause_has_time","Periodic time check"],switch:["ui.cause_switch","Switch turned on"],manual:["ui.cause_manual","Manual apply"],startup:["ui.cause_startup","Startup"],reloaded:["ui.cause_reloaded","Reloaded"],simulated:["ui.cause_simulated","Simulation"]},gu={clock:["ui.cause_clock","Time of day"],sun:["ui.cause_sun","Sun position"],reapply:["ui.cause_reapply","Re-run"]};function _e(t){return t??"?"}function ma(t,r){if(r.kind==="entity")return`${r.entity_id} ${_e(r.old)} \u2192 ${_e(r.new)}`;if(r.kind==="duration"){let s=a(t,"ui.cause_duration_for","for");return r.entity_id?`${r.entity_id} ${_e(r.new)} ${s} ${_e(r.detail)}`:`${_e(r.new)} ${s} ${_e(r.detail)}`}let e=fu[r.kind];if(e)return a(t,e[0],e[1]);let i=gu[r.kind],n=i?a(t,i[0],i[1]):z(r.kind);return r.detail?`${n} ${r.detail}`:n}function _u(t,r){if(!mr(r)||!r.entity_id)return d`${ma(t,r)}`;let e=_n(t,r.entity_id,r.entity_id);return r.kind==="duration"?d`${e} ${_e(r.new)} ${a(t,"ui.cause_duration_for","for")} ${_e(r.detail)}`:d`${e} ${_e(r.old)} → ${_e(r.new)}`}function mr(t){return t.kind==="entity"||t.kind==="duration"&&!!t.entity_id}function fa(t,r){let e=t.entity_id?r?.states?.[t.entity_id]:void 0,i=n=>n===null?"?":Ae(r,e,null,n);return{old:i(t.old),new:i(t.new)}}function vu(t,r){if(!mr(t))return ma(r,t);let e=t.entity_id?M(r,t.entity_id):"?",i=fa(t,r);return t.kind==="duration"?`${e}: ${i.new} ${a(r,"ui.cause_duration_for","for")} ${t.detail??"?"}`:`${e}: ${i.old} \u2192 ${i.new}`}function yu(t,r){if(!mr(t)||!t.entity_id)return d`${vu(t,r)}`;let e=pa(r,t.entity_id),i=fa(t,r);return t.kind==="duration"?d`${e}: ${i.new} ${a(r,"ui.cause_duration_for","for")} ${t.detail??"?"}`:d`${e}: ${i.old} → ${i.new}`}var bu={acted:["ui.outcome_label_acted","applied"],no_op:["ui.outcome_label_no_op","blocked"],debounced:["ui.outcome_label_debounced","unchanged"],no_match:["ui.outcome_label_no_match","no match"],skipped_switch_off:["ui.outcome_label_skipped","skipped"],skipped_scope_disabled:["ui.outcome_label_skipped","skipped"],skipped_unavailable:["ui.outcome_label_skipped","skipped"]};function wu(t,r){let e=bu[r];return e?a(t,e[0],e[1]):r.replace(/_/g," ")}function hr(t,r,e,i,n,s){return r===1?a(t,e,n,{n:String(r)}):a(t,i,s,{n:String(r)})}function ga(t,r){let e=r.winner_name??a(t,"ui.winner_default","The matching scene");switch(r.outcome){case"acted":{let i=r.actions.filter(h=>!h.unexposed),n=r.actions.length-i.length;if(i.length===0&&n){let h=hr(t,n,"ui.count_action_one","ui.count_action_other","{n} action","{n} actions");return a(t,"ui.outcome_summary_acted_all_skipped","{winner} matched \u2014 {skipped_phrase} skipped (not exposed); nothing applied.",{winner:e,skipped_phrase:h})}let s=hr(t,i.length,"ui.count_action_one","ui.count_action_other","{n} action","{n} actions"),o=va(i),l=n?a(t,"ui.outcome_summary_skipped_tail"," ({skipped} skipped \u2014 not exposed)",{skipped:String(n)}):"",u=hr(t,o,"ui.count_entity_one","ui.count_entity_other","{n} entity","{n} entities");return o?a(t,"ui.outcome_summary_acted_entities","Applied {winner} \u2014 {acts} on {entities}.{tail}",{winner:e,acts:s,entities:u,tail:l}):a(t,"ui.outcome_summary_acted","Applied {winner} \u2014 {acts}.{tail}",{winner:e,acts:s,tail:l})}case"no_op":return a(t,"ui.outcome_summary_no_op","{winner} matched but has no actions \u2014 it blocks lower scenes from applying. Nothing changed.",{winner:e});case"debounced":return a(t,"ui.outcome_summary_debounced","{winner} matched, but it's already applied \u2014 nothing was re-sent.",{winner:e});case"no_match":return a(t,"ui.outcome_summary_no_match","No scene matched \u2014 nothing applied.");case"skipped_switch_off":return a(t,"ui.outcome_summary_skipped_switch_off","Skipped \u2014 the scope's pause switch is off.");case"skipped_scope_disabled":return a(t,"ui.outcome_summary_skipped_scope_disabled","Skipped \u2014 the scope is disabled.");case"skipped_unavailable":return a(t,"ui.outcome_summary_skipped_unavailable","Skipped \u2014 the triggering entity went unavailable; devices left as they are.");default:return""}}function _a(t,r,e){return pt(t,r,()=>e?.[t]?.name?.trim()||xi(t))}function xu(t,r,e,i){let n=Object.entries(t.params??{}).filter(([,o])=>o!=null&&o!=="").map(([o,l])=>`${Zt(o,t.service,e)}: ${Oe(r,l)}`).join(", "),s=_a(t.service,i,e);return n?`${s} \xB7 ${n}`:s}function va(t){return t.reduce((r,e)=>r+(e.entity_ids?.length??0),0)}function $u(t){return t==="skipped_switch_off"||t==="skipped_scope_disabled"||t==="skipped_unavailable"}function ku(t,r,e){let i=t.index+1,n=a(r,"ui.trace_scene_prefix","Scene #");return t.disabled?d`<div class="scene disabled">${n}${i} ${t.name??"\u2014"}: ${a(r,"ui.trace_scene_disabled","disabled")}</div>`:t.evaluated?d`
    <div class="scene ${t.matched?"won":""}">${n}${i} ${t.name??"\u2014"}: ${t.matched?a(r,"ui.trace_scene_matched","\u2713 matched"):a(r,"ui.trace_scene_no_match","\u2717 no match")}</div>
    ${t.predicates.map(s=>d`
        <div class="pred ${s.passed?"pass":"fail"}" style="padding-left:1rem">
          ${s.passed?"\u2713":"\u2717"} ${G(r,s.condition_key)}${s.detail?d` <span class="dim">[${mu(r,s.condition_key,s.detail,e,s.entity_ids)}]</span>`:$}
        </div>`)}
  `:d`<div class="scene skipped">${n}${i} ${t.name??"\u2014"}: ${a(r,"ui.trace_scene_not_reached","not reached")}</div>`}function fr(t,r,e,i,n,s={},o){let l=t.actions.filter(_=>!_.unexposed),u=l.map(_=>_a(_.service,o,n)).join(", "),h=va(l),p=t.explanation!==null||t.actions.length>0||$u(t.outcome),f=_=>{(_.key==="Enter"||_.key===" ")&&!_.repeat&&(_.preventDefault(),e())};return d`
    <div class="eval">
      <div
        class="outcome ${t.outcome}${p?" clickable":""}"
        role=${p?"button":$}
        tabindex=${p?"0":$}
        aria-expanded=${p?r:$}
        @click=${p?e:void 0}
        @keydown=${p?f:void 0}
      >
        <span class="label">${wu(i,t.outcome)}</span>
        <span class="ts">${t.timestamp?new Date(t.timestamp).toLocaleTimeString():""}</span>
      </div>
      <div class="eval-body">
        <div class="cause-line">${a(i,"ui.trigger_prefix","Trigger: ")}${yu(t.cause,i)}</div>
        ${t.winner_name?d`<div class="won">${a(i,"ui.trace_won_prefix","Won: ")}<span class="name">${t.winner_name}</span></div>`:$}
        ${l.length?d`<div class="action-summary">→ ${u}
              ${h?d`<span class="n">· ${hr(i,h,"ui.count_entity_one","ui.count_entity_other","{n} entity","{n} entities")}</span>`:$}</div>`:r?$:d`<div class="action-summary">${ga(i,t)}</div>`}
      </div>
      ${r?Cu(t,i,n,s,o):$}
    </div>
  `}function Cu(t,r,e,i,n){let s=ga(r,t),o=mr(t.cause);return d`
    <div class="why">
      ${o?d`<div class="raw-trigger">${a(r,"ui.trigger_prefix","Trigger: ")}${_u(r,t.cause)}</div>`:$}
      ${s?d`<div class="outcome-summary">${s}</div>`:$}
      ${t.explanation?d`<div class="section">
            <div class="section-title">${a(r,"ui.section_scene_evaluation","Scene evaluation")}</div>
            <div class="scenes">${t.explanation.scenes.map(l=>ku(l,r,i))}</div>
          </div>`:$}
      ${t.actions.length?d`<div class="section">
            <div class="section-title">${a(r,"ui.section_actions_taken","Actions taken")}</div>
            ${t.actions.map(l=>d`<div class="action-block ${l.unexposed?"unexposed":""}">
                <div class="action-head">
                  ${xu(l,r,e,n)}${l.unexposed?d`<span class="skipped-tag">${a(r,"ui.skipped_not_exposed"," \u2014 skipped (not exposed)")}</span>`:$}
                </div>
                ${(l.entity_ids??[]).map(u=>d`<div class="entity">${pa(r,u)}</div>`)}
              </div>`)}
          </div>`:$}
    </div>
  `}var qe=class{constructor(r,e){this._onKeydown=r=>{this._host.open&&r.key==="Escape"&&this._close()};this._onBackdrop=()=>{this._host.open&&this._close()};this._host=r,this._close=e,r.addController(this)}hostConnected(){document.addEventListener("keydown",this._onKeydown),this._host.addEventListener("click",this._onBackdrop)}hostDisconnected(){document.removeEventListener("keydown",this._onKeydown),this._host.removeEventListener("click",this._onBackdrop)}};var j=class extends b{constructor(){super();this.exposedActions=[];this.category="";this.categoryName=null;this.open=!1;this._records=[];this._schemas={};this._expanded=new Set;this._loading=!0;this._error="";this._hasNew=!1;new qe(this,()=>this._onClose())}disconnectedCallback(){super.disconnectedCallback(),this._stopPoll()}_startPoll(){this._poll||(this._poll=setInterval(()=>this._checkNew(),5e3))}_stopPoll(){this._poll&&(clearInterval(this._poll),this._poll=void 0)}updated(e){e.has("open")&&(this.open?this._startPoll():this._stopPoll()),this.open&&(e.has("open")||e.has("category")||e.has("scope"))&&this._load()}_mine(e){return e.filter(i=>i.scope_kind===this.scope.scope_kind&&i.scope_id===this.scope.scope_id&&i.category===this.category)}async _load(){this._error="",this._loading=!0,this._hasNew=!1,this._expanded=new Set;try{let e=await Or(this.hass);if(!this.isConnected)return;this._records=this._mine(e),this._loading=!1,this._loadSchemas()}catch(e){this._error=E(this.hass,e),this._loading=!1}}async _loadSchemas(){let e=[...new Set(this._records.flatMap(s=>s.actions.map(o=>o.service)))].filter(s=>!(s in this._schemas));if(e.length===0)return;let i=await Promise.all(e.map(async s=>{try{return[s,await De(this.hass,s)]}catch{return null}}));if(!this.isConnected)return;let n={...this._schemas};for(let s of i)s&&(n[s[0]]=s[1]);this._schemas=n}async _checkNew(){if(!(!this.open||!this.isConnected||document.visibilityState!=="visible"))try{let i=this._mine(await Or(this.hass))[0]?.timestamp??null,n=this._records[0]?.timestamp??null;i&&(!n||i>n)&&(this._hasNew=!0)}catch{}}_toggle(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}async _download(){try{await Ns(this.hass,this.scope,this.category)}catch(e){this._error=E(this.hass,e)}}async _clear(){try{await Ts(this.hass),await this._load()}catch(e){this._error=E(this.hass,e)}}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){if(!this.open)return $;let e=this.categoryName??this.category;return d`
      <div class="modal" role="dialog" aria-modal="true" @click=${i=>i.stopPropagation()}>
        <div class="header">
          <h3>${e}</h3>
          <button class="refresh ${this._hasNew?"has-new":""}" @click=${()=>this._load()}>
            ${this._hasNew?`\u25CF ${a(this.hass,"ui.new_traces_refresh","New traces \u2014 refresh")}`:a(this.hass,"ui.refresh","Refresh")}
          </button>
          <button class="clear" @click=${this._clear}>
            ${a(this.hass,"ui.clear_traces","Clear")}
          </button>
          <button class="download" @click=${this._download}>
            ${a(this.hass,"ui.download_diagnostics","Download diagnostics")}
          </button>
          <button class="close" @click=${this._onClose} aria-label=${a(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          ${this._error?d`<p class="error">${this._error}</p>`:this._loading?d`<p class="empty">${a(this.hass,"ui.loading","Loading\u2026")}</p>`:this._records.length===0?d`<p class="empty">${a(this.hass,"ui.no_traces_yet","No traces for this category yet.")}</p>`:d`<div class="list">${this._records.map((i,n)=>{let s=`${i.event_id??n}|${i.timestamp??""}`;return fr(i,this._expanded.has(s),()=>this._toggle(s),this.hass,this._schemas,this.periods?.custom??{},this.exposedActions)})}</div>`}
        </div>
      </div>
    `}};j.styles=[pr,y`
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
    `],c([m({attribute:!1})],j.prototype,"hass",2),c([m({attribute:!1})],j.prototype,"periods",2),c([m({attribute:!1})],j.prototype,"exposedActions",2),c([m({attribute:!1})],j.prototype,"scope",2),c([m()],j.prototype,"category",2),c([m()],j.prototype,"categoryName",2),c([m({type:Boolean,reflect:!0})],j.prototype,"open",2),c([g()],j.prototype,"_records",2),c([g()],j.prototype,"_schemas",2),c([g()],j.prototype,"_expanded",2),c([g()],j.prototype,"_loading",2),c([g()],j.prototype,"_error",2),c([g()],j.prototype,"_hasNew",2),j=c([w("ambience-traces-modal")],j);var Eu={time:"mdi:clock-outline",sun:"mdi:weather-sunny"},Y=class extends b{constructor(){super(...arguments);this.categoryName="";this.scenes=[];this.open=!1;this._triggers=[];this._opaque=!1;this._loading=!1;this._error="";this._loadSeq=0}willUpdate(e){super.willUpdate?.(e);let i=e.has("open")||e.has("scope")||e.has("category");this.open&&(i||e.has("scenes"))&&(i&&(this._triggers=[],this._opaque=!1),this._load())}get _scopeId(){return this.scope.kind==="house"?null:this.scope.id}async _load(){let e=++this._loadSeq;this._loading=!0,this._error="";try{let i=await us(this.hass,this.scope.kind,this._scopeId,this.category);if(e!==this._loadSeq)return;this._triggers=i.triggers,this._opaque=i.opaque}catch(i){if(e!==this._loadSeq)return;this._error=E(this.hass,i)}finally{e===this._loadSeq&&(this._loading=!1)}}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_openMoreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_entityName(e){return M(this.hass,e)}get _sortedTriggers(){let e=s=>this._entityName(s.entity_id).toLowerCase(),i=this._triggers.filter(s=>s.kind==="entity").sort((s,o)=>e(s).localeCompare(e(o))),n=this._triggers.filter(s=>s.kind!=="entity");return[...i,...n]}_sunPart(e){let i=Pe(this.hass,e.anchor);if(e.offset===0)return i;let n=a(this.hass,"ui.unit_min","min");return`${i} ${e.offset>0?"+":""}${e.offset} ${n}`}_rowContent(e){switch(e.kind){case"entity":return{title:this._entityName(e.entity_id),detail:e.entity_id};case"time":{let i=e.clocks.map(n=>`${String(n.hour).padStart(2,"0")}:${String(n.minute).padStart(2,"0")}`);return e.date_rollover&&i.push(a(this.hass,"ui.auto_trigger_date_rollover","Local midnight (date rollover)")),e.has_time&&i.push(a(this.hass,"ui.auto_trigger_periodic","periodic re-check")),{title:a(this.hass,"ui.auto_trigger_group_time","Time"),detail:i.join(", ")}}case"sun":return{title:a(this.hass,"ui.auto_trigger_group_sun","Sun"),detail:e.suns.map(i=>this._sunPart(i)).join(", ")}}}_renderRowIcon(e){return e.kind==="entity"?Kt(this.hass,e.entity_id):d`<ha-icon
      class="row-icon"
      icon=${Eu[e.kind]??Ur}
    ></ha-icon>`}_moreInfoEntity(e){return e.kind==="entity"?e.entity_id:e.kind==="sun"&&this.hass?.states?.["sun.sun"]?"sun.sun":null}_renderRow(e){let{title:i,detail:n}=this._rowContent(e),s=this._moreInfoEntity(e);return d`
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
          ${n?d`<div class="row-detail">${n}</div>`:""}
        </div>
      </li>
    `}render(){if(!this.open)return $;let e=a(this.hass,"ui.auto_triggers_section","Auto-triggers");return d`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>${e}${this.categoryName?` \u2014 ${this.categoryName}`:""}</h3>
          <button class="close" @click=${this._close} aria-label=${a(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">${this._renderBody()}</div>
      </div>
    `}_renderBody(){return this._error?d`<div class="error">${this._error}</div>`:this._loading&&this._triggers.length===0?d`<div class="empty">${a(this.hass,"ui.loading","Loading\u2026")}</div>`:d`
      ${this._opaque?d`<div class="note">
            ${a(this.hass,"ui.auto_triggers_opaque_note","A script scene is opaque \u2014 some watches may be missing. Declare them in the scene's Triggers field.")}
          </div>`:""}
      ${this._triggers.length===0?d`<div class="empty">
            ${a(this.hass,"ui.auto_triggers_none","No automatic triggers.")}
          </div>`:d`<ul>
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
  `,c([m({attribute:!1})],Y.prototype,"hass",2),c([m({attribute:!1})],Y.prototype,"scope",2),c([m()],Y.prototype,"category",2),c([m()],Y.prototype,"categoryName",2),c([m({attribute:!1})],Y.prototype,"scenes",2),c([m({type:Boolean,reflect:!0})],Y.prototype,"open",2),c([g()],Y.prototype,"_triggers",2),c([g()],Y.prototype,"_opaque",2),c([g()],Y.prototype,"_loading",2),c([g()],Y.prototype,"_error",2),Y=c([w("ambience-auto-triggers-modal")],Y);function ya(t,r){return r==="not_home"?a(t,"ui.away","Away"):r==="home"?a(t,"ui.home","Home"):z(r)}function ba(t){return{state:t.live_state??"",attributes:Object.fromEntries(t.attributes.map(r=>[r.name,r.live_value==null?"":String(r.live_value)])),for:{h:0,m:0,s:0}}}function gr(t){return String(t).padStart(2,"0")}function wa(t){return`${t.getFullYear()}-${gr(t.getMonth()+1)}-${gr(t.getDate())}`}function xa(t){return`${gr(t.getHours())}:${gr(t.getMinutes())}`}var N=class extends b{constructor(){super();this.exposedActions=[];this.category="";this.categoryName=null;this.open=!1;this._knobs=[];this._hasTime=!1;this._loading=!0;this._error="";this._values={};this._verdicts={};this._date="";this._time="";this._result=null;this._expanded=!1;new qe(this,()=>this._onClose())}updated(e){this.open&&(e.has("open")||e.has("category")||e.has("scope"))&&this._load()}_vkey(e){return`${e.condition}:${e.key}`}async _load(){this._error="",this._loading=!0,this._result=null,this._expanded=!1;let e=new Date;this._date=wa(e),this._time=xa(e);try{let i=await js(this.hass,this.scope,this.category);if(!this.isConnected)return;this._knobs=i.knobs,this._hasTime=i.has_time;let n={},s={};for(let o of i.knobs)o.kind==="entity"?n[o.entity_id]=ba(o):s[this._vkey(o)]=o.live_value;this._values=n,this._verdicts=s,this._loading=!1}catch(i){this._error=E(this.hass,i),this._loading=!1}}_setState(e,i){this._values={...this._values,[e]:{...this._values[e],state:i}}}_setAttr(e,i,n){let s=this._values[e];this._values={...this._values,[e]:{...s,attributes:{...s.attributes,[i]:n}}}}_setFor(e,i,n){let s=this._values[e],o=Number.isFinite(n)&&n>0?Math.trunc(n):0;this._values={...this._values,[e]:{...s,for:{...s.for,[i]:o}}}}_setVerdict(e,i){this._verdicts={...this._verdicts,[e]:i}}_resetWhen(){let e=new Date;this._date=wa(e),this._time=xa(e)}_resetEntity(e){this._values={...this._values,[e.entity_id]:ba(e)}}_resetVerdict(e){this._verdicts={...this._verdicts,[this._vkey(e)]:e.live_value}}_buildOverrides(){let e={};for(let i of this._knobs){if(i.kind!=="entity")continue;let n=this._values[i.entity_id];if(!n)continue;let s={};for(let l of i.attributes){let u=n.attributes[l.name];if(!(u===void 0||u===""))if(l.control==="number"){let h=Number(u);Number.isNaN(h)||(s[l.name]=h)}else s[l.name]=u}let o={attributes:s};n.state!==""&&(o.state=n.state),(n.for.h||n.for.m||n.for.s)&&(o.for=n.for),(o.state!==void 0||o.for!==void 0||Object.keys(s).length>0)&&(e[i.entity_id]=o)}return e}_buildVerdicts(){let e={};for(let i of this._knobs)i.kind==="verdict"&&(e[i.condition]||(e[i.condition]={}),e[i.condition][i.key]=this._verdicts[this._vkey(i)]??i.live_value);return e}async _run(){this._error="";let e=new Date(`${this._date}T${this._time}`);if(!this._date||!this._time||Number.isNaN(e.getTime())){this._error=a(this.hass,"ui.invalid_datetime","Enter a valid date and time.");return}let i=e.toISOString();try{this._result=await zs(this.hass,this.scope,this.category,i,this._buildOverrides(),this._buildVerdicts()),this._expanded=!1}catch(n){this._error=E(this.hass,n)}}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?d`
      <div class="modal" role="dialog" aria-modal="true" @click=${e=>e.stopPropagation()}>
        <div class="header">
          <h3>${a(this.hass,"ui.simulate_title","Simulate")} · ${this.categoryName??this.category}</h3>
          <button class="close" @click=${this._onClose} aria-label=${a(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          ${this._error?d`<p class="error">${this._error}</p>`:$}
          ${this._loading?d`<p>${a(this.hass,"ui.loading","Loading\u2026")}</p>`:d`
            ${this._hasTime?d`
              <p class="sec-title">${a(this.hass,"ui.when_heading","When")}</p>
              <div class="when">
                <input type="date" .value=${this._date}
                  @change=${e=>this._date=e.target.value} />
                <input type="time" .value=${this._time}
                  @change=${e=>this._time=e.target.value} />
                <button class="reset" title=${a(this.hass,"ui.reset_to_now","Reset to now")} aria-label=${a(this.hass,"ui.reset_to_now","Reset to now")}
                  @click=${()=>this._resetWhen()}>↺</button>
                <span class="hint">${a(this.hass,"ui.simulate_when_hint","drives sun, time-of-day, weekday & workday")}</span>
              </div>`:$}
            ${this._knobs.length?d`
              <p class="sec-title">${a(this.hass,"ui.simulate_inputs_heading","Inputs this category depends on")}</p>
              ${this._knobs.map(e=>e.kind==="entity"?this._renderEntity(e):this._renderVerdict(e))}`:$}
            <div class="run-row"><button class="runbtn" @click=${()=>void this._run()}>${a(this.hass,"ui.simulate_button","Simulate")} ▸</button></div>
            ${this._result?d`<div class="result">${fr(this._result,this._expanded,()=>this._expanded=!this._expanded,this.hass,void 0,this.periods?.custom??{},this.exposedActions)}</div>`:$}
          `}
        </div>
      </div>`:$}_renderEntity(e){let i=this._values[e.entity_id],n=e.attributes.length>0;return d`
      <div class="row ${n?"has-attrs":""}">
        ${Kt(this.hass,e.entity_id)}
        <div class="row-text">
          <div class="row-title">${M(this.hass,e.entity_id)}</div>
          <div class="row-detail">${e.entity_id}</div>
        </div>
        <div class="row-ctrl">
          ${this._renderControl(e,i?.state??"")}
          ${this._renderFor(e,i?.for??{h:0,m:0,s:0})}
          <button class="reset" data-reset=${e.entity_id} title=${a(this.hass,"ui.reset_to_live","Reset to live")}
            @click=${()=>this._resetEntity(e)}>↺</button>
        </div>
      </div>
      ${e.attributes.map((s,o)=>d`
        <div class="row attr ${o===e.attributes.length-1?"last-attr":""}">
          <div class="row-text"><div class="row-title">${ya(this.hass,s.name)}</div></div>
          <div class="row-ctrl">
            ${this._renderAttrControl(e,s,i?.attributes[s.name]??"")}
            <button class="reset" title=${a(this.hass,"ui.reset_to_live","Reset to live")}
              @click=${()=>this._resetEntity(e)}>↺</button>
          </div>
        </div>`)}
    `}_renderAttrControl(e,i,n){let s=o=>this._setAttr(e.entity_id,i.name,o.target.value);if(i.control==="select"){let o=We(this.hass)[e.entity_id];return d`<select data-attr=${`${e.entity_id}:${i.name}`} .value=${n} @change=${s}>
        ${(i.options??[n]).map(l=>d`<option value=${l} ?selected=${l===n}>${Ae(this.hass,o,i.name,l)}</option>`)}
      </select>`}return d`<input class=${i.control==="number"?"num":""}
      type=${i.control==="number"?"number":"text"}
      data-attr=${`${e.entity_id}:${i.name}`}
      .value=${n}
      @input=${s} />`}_renderControl(e,i){if(e.control==="select")return d`<select data-entity=${e.entity_id} .value=${i}
        @change=${s=>this._setState(e.entity_id,s.target.value)}>
        ${(e.options??[i]).map(s=>d`<option value=${s} ?selected=${s===i}>${ya(this.hass,s)}</option>`)}
      </select>`;let n=e.control==="number"?"number":"text";return d`<input class=${e.control==="number"?"num":""} type=${n} data-entity=${e.entity_id}
      .value=${i}
      @input=${s=>this._setState(e.entity_id,s.target.value)} />`}_renderFor(e,i){let n={h:"hours",m:"minutes",s:"seconds"},s=M(this.hass,e.entity_id),o=l=>d`<input class="for-num" type="number" min="0"
      aria-label=${`${s} \u2014 held for, ${n[l]}`}
      data-for=${`${e.entity_id}:${l}`} .value=${String(i[l])}
      @change=${u=>this._setFor(e.entity_id,l,Number(u.target.value))} />`;return d`<span class="for-ctrl" title=${a(this.hass,"ui.duration_held_hint","How long it has held this state (h:m:s)")}>
      <span class="for-label">${a(this.hass,"ui.for_label","For")}</span>${o("h")}<span>:</span>${o("m")}<span>:</span>${o("s")}
    </span>`}_renderVerdict(e){let i=this._vkey(e),n=this._verdicts[i]??e.live_value,s=e.entity_id?M(this.hass,e.entity_id):e.label,o=e.entity_id?Kt(this.hass,e.entity_id):d`<ha-icon class="row-icon" icon="mdi:code-braces"></ha-icon>`;return d`
      <div class="row">
        ${o}
        <div class="row-text">
          <div class="row-title">${s}</div>
          ${e.entity_id?d`<div class="row-detail">${e.entity_id}</div>`:$}
        </div>
        <div class="row-ctrl">
          <select data-verdict=${i} .value=${String(n)}
            @change=${l=>this._setVerdict(i,l.target.value==="true")}>
            <option value="true" ?selected=${n}>${a(this.hass,"ui.true_label","True")}</option>
            <option value="false" ?selected=${!n}>${a(this.hass,"ui.false_label","False")}</option>
          </select>
          <button class="reset" title=${a(this.hass,"ui.reset_to_live","Reset to live")} @click=${()=>this._resetVerdict(e)}>↺</button>
        </div>
      </div>`}};N.styles=[pr,eo,y`
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
    `],c([m({attribute:!1})],N.prototype,"hass",2),c([m({attribute:!1})],N.prototype,"periods",2),c([m({attribute:!1})],N.prototype,"exposedActions",2),c([m({attribute:!1})],N.prototype,"scope",2),c([m()],N.prototype,"category",2),c([m()],N.prototype,"categoryName",2),c([m({type:Boolean,reflect:!0})],N.prototype,"open",2),c([g()],N.prototype,"_knobs",2),c([g()],N.prototype,"_hasTime",2),c([g()],N.prototype,"_loading",2),c([g()],N.prototype,"_error",2),c([g()],N.prototype,"_values",2),c([g()],N.prototype,"_verdicts",2),c([g()],N.prototype,"_date",2),c([g()],N.prototype,"_time",2),c([g()],N.prototype,"_result",2),c([g()],N.prototype,"_expanded",2),N=c([w("ambience-simulator-modal")],N);function Su(t){let r=Math.floor(t/3600),e=Math.floor(t%3600/60),i=t%60,n=s=>String(s).padStart(2,"0");return r>0?`${r}:${n(e)}:${n(i)}`:`${e}:${n(i)}`}var vn=1024;function Lu(t,r,e){if(t!==void 0&&r!==void 0)return Math.floor((t+r)/2);let i=e.map(n=>n.priority??0);return t===void 0&&r===void 0?vn:t===void 0?Math.max(...i)+vn:Math.min(...i)-vn}var Q=class extends b{constructor(){super(...arguments);this._store=new P(this);this._onKeyDown=e=>{if(this._editing!==null||this._viewingTraces!==null||this._viewingSimulator!==null||this._autoTriggers!==null)return;let n=(typeof e.composedPath=="function"?e.composedPath():[])[0]??e.target,s=n?.tagName?.toLowerCase();s==="input"||s==="textarea"||n?.isContentEditable||e.key.toLowerCase()!=="z"||!(e.ctrlKey||e.metaKey)||(e.preventDefault(),e.shiftKey?this._store.canRedo&&this._store.redo():this._store.canUndo&&this._store.undo())};this._expanded=new Set(Zn());this._collapsedCategories=new Set(ts());this._conditionsHintDismissed=!1;this._editing=null;this._sceneEditorError="";this._savingScene=!1;this._viewingTraces=null;this._viewingSimulator=null;this._autoTriggers=null;this._autoTriggerScenesMemo=null;this.filterCategory="";this._scopeIsEditing=e=>this._editing!==null&&R(this._editing.scope)===R(e)}async connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeyDown),await this._store.loadStatic(),this._conditionsHintDismissed=ss(this._store.installId),await Promise.all([this._store.refreshAreas(),this._store.refreshFloors(),this._store.refreshHouse(),this._store.refreshSwitches()]),await this._store.subscribe(e=>this._onScopeRemoved(e),this._scopeIsEditing)}disconnectedCallback(){window.removeEventListener("keydown",this._onKeyDown),super.disconnectedCallback()}_onScopeRemoved(e){let i=R(e),n=new Set(this._expanded);n.delete(i),this._setExpanded(n);let s=ke(e,"");this._setCollapsedCategories(new Set([...this._collapsedCategories].filter(o=>!o.startsWith(s)))),this._store.clearStale(e),this._editing&&R(this._editing.scope)===i&&(this._editing=null)}willUpdate(e){if(e.has("filterCategory")&&e.get("filterCategory")!==void 0&&this._onFilterCategoryChanged(),e.has("_editing")){let i=e.get("_editing");i!=null&&(this._editing===null||R(this._editing.scope)!==R(i.scope))&&this._store.isScopeStale(i.scope)&&this._store.refreshStaleScope(i.scope)}}_onFilterCategoryChanged(){let e=this.filterCategory;if(e==="")return;let i=new Set(this._expanded),n=new Set(this._collapsedCategories),s=!1,o=!1;for(let l of this._orderedScopeRows()){let u=R(l.scope);this._matchingSceneCount(l.cfg)===0&&i.delete(u)&&(s=!0),n.delete(ke(l.scope,e))&&(o=!0)}s&&this._setExpanded(i),o&&this._setCollapsedCategories(n)}_setExpanded(e){this._expanded=e,es([...e])}_toggleExpand(e){let i=R(e),n=new Set(this._expanded);n.has(i)?n.delete(i):n.add(i),this._setExpanded(n)}_setCollapsedCategories(e){this._collapsedCategories=e,is([...e])}_toggleCategoryCollapse(e,i){let n=ke(e,i.detail.categoryId),s=new Set(this._collapsedCategories);s.has(n)?s.delete(n):s.add(n),this._setCollapsedCategories(s)}_collapsedCategoriesFor(e){return this._store.categories.map(i=>i.id).filter(i=>this._collapsedCategories.has(ke(e,i)))}_addScene(e,i){let n=this._store.getConfig(e);n&&(this._sceneEditorError="",this._editing={scope:e,index:n.scenes.length,isNew:!0,category:i})}_editScene(e,i){this._sceneEditorError="",this._editing={scope:e,index:i.detail.index,isNew:!1}}_duplicateScene(e,i){let n=this._store.getConfig(e);if(!n)return;let s=n.scenes[i.detail.index];if(!s)return;let o=qt(JSON.parse(JSON.stringify(s)));this._sceneEditorError="",this._editing={scope:e,index:n.scenes.length,isNew:!0,seed:o}}_deleteScene(e,i){let n=this._store.getConfig(e);if(!n)return;let s=n.scenes.filter((o,l)=>l!==i.detail.index);this._store.mutate(e,{...n,scenes:s},{action:"delete",scene_name:n.scenes[i.detail.index]?.name??null})}_reorderScenes(e,i){let n=this._store.getConfig(e);if(!n)return;let{from:s,to:o}=i.detail,l=n.scenes[s];if(!l||n.scenes[o]?.category!==l.category)return;let u=[...n.scenes];u.splice(s,1),u.splice(o,0,l);let h=C=>u[C]&&u[C].category===l.category,p=o-1;for(;p>=0&&!h(p);)p--;let f=o+1;for(;f<u.length&&!h(f);)f++;let _=p>=0?u[p].priority:void 0,v=f<u.length?u[f].priority:void 0,x=Lu(_,v,n.scenes.filter(C=>C.category===l.category));u[o]={...l,priority:x,pinned:!0},this._store.mutate(e,{...n,scenes:u},{action:"reorder",scene_name:l.name??null})}_unpinScene(e,i){let n=this._store.getConfig(e);if(!n)return;let s=n.scenes.map((o,l)=>l===i.detail.index?{...o,pinned:!1}:o);this._store.mutate(e,{...n,scenes:s},{action:"unpin",scene_name:n.scenes[i.detail.index]?.name??null})}_toggleSceneEnabled(e,i){let n=this._store.getConfig(e);if(!n)return;let s=n.scenes.map((o,l)=>{if(l!==i.detail.index)return o;if(i.detail.enabled){let u={...o};return delete u.enabled,u}return{...o,enabled:!1}});this._store.mutate(e,{...n,scenes:s},{action:"toggle",scene_name:n.scenes[i.detail.index]?.name??null})}async _saveScene(e){if(this._savingScene)return;let i=this._editing;if(!i)return;let{scene:n,scope:s}=e.detail;this._savingScene=!0,this._sceneEditorError="";try{if(R(s)===R(i.scope)){let h=this._store.getConfig(s);if(!h)return;let p=[...h.scenes];i.isNew?p.push(n):p[i.index]=n,await this._store.mutate(s,{...h,scenes:p},{action:i.isNew?"add":"edit",scene_name:n.name??null})?this._editing=null:this._sceneEditorError=this._takeError();return}let o=qt(n),l=this._store.getConfig(s);if(!l)return;if(!await this._store.mutate(s,{...l,scenes:[...l.scenes,o]},{action:"add",scene_name:n.name??null})){this._sceneEditorError=this._takeError();return}if(this._editing=null,!i.isNew){let h=this._store.getConfig(i.scope);if(h){let p=h.scenes.filter((f,_)=>_!==i.index);await this._store.mutate(i.scope,{...h,scenes:p},{action:"delete",scene_name:n.name??null})}}}finally{this._savingScene=!1}}_takeError(){let e=this._store.error;return this._store.error="",e}async _callApi(e){this._store.error="";try{await e()}catch(i){this._store.error=E(this.hass,i)}}_applyScenes(e,i){return this._callApi(()=>ms(this.hass,e,i))}_runSceneActions(e,i){return this._callApi(()=>fs(this.hass,e,i.detail.index))}_cancelScene(){this._sceneEditorError="",this._editing=null}_onScopeMenu(e,i){i==="run"&&this._applyScenes(e)}_showAutoTriggers(e,i){let n=this._store.categories.find(s=>s.id===i);this._autoTriggers={scope:e,category:i,categoryName:n?.name??null}}_autoTriggerScenes(){if(!this._autoTriggers)return[];let e=this._store.getConfig(this._autoTriggers.scope)?.scenes,{category:i}=this._autoTriggers,n=this._autoTriggerScenesMemo;if(n&&n.source===e&&n.category===i)return n.filtered;let s=(e??[]).filter(o=>o.category===i);return this._autoTriggerScenesMemo={source:e,category:i,filtered:s},s}_showTraces(e,i){let n=this._store.categories.find(s=>s.id===i);this._viewingTraces={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:i,categoryName:n?.name??null}}_showSimulator(e,i){let n=this._store.categories.find(s=>s.id===i);this._viewingSimulator={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:i,categoryName:n?.name??null}}_defaultCategoryId(){return this.filterCategory!==""?this.filterCategory:[...this._store.categories].sort((i,n)=>i.name.localeCompare(n.name))[0]?.id??""}get _editingScene(){return this._editing?this._editing.seed?this._editing.seed:this._editing.isNew?{when:{},actions:[],category:this._editing.category??this._defaultCategoryId()}:this._store.getConfig(this._editing.scope)?.scenes[this._editing.index]??null:null}get _editorConditions(){return this._editing?this._store.conditions.slice().sort((e,i)=>i.priority-e.priority):[]}get _takenSceneNames(){let e=new Map,i=this._editing,n=(s,o)=>{if(!o)return;let l=!!i&&!i.isNew&&R(i.scope)===R(s);o.scenes.forEach((u,h)=>{if(l&&h===i.index)return;let p=u.name?.trim().toLowerCase();if(!p)return;let f=ji(s,u.category),_=e.get(f);_||(_=new Set,e.set(f,_)),_.add(p)})};n({kind:"house"},this._store.house);for(let s of this._store.floors)n({kind:"floor",id:s.floor_id},this._store.floorConfigs.get(s.floor_id));for(let s of this._store.areas)n({kind:"area",id:s.area_id},this._store.areaConfigs.get(s.area_id));return e}get _scopeOptions(){return[{scope:{kind:"house"},label:a(this.hass,"ui.scope_house","House")},...this._store.floors.map(e=>({scope:{kind:"floor",id:e.floor_id},label:e.name})),...this._store.areas.map(e=>({scope:{kind:"area",id:e.area_id},label:e.name}))]}_matchingSceneCount(e){return this.filterCategory===""?e.scenes.length:e.scenes.filter(i=>i.category===this.filterCategory).length}_summary(e){if(e.scenes.length===0)return a(this.hass,"ui.not_configured","not configured");let i=this._matchingSceneCount(e),n=i===1?a(this.hass,"ui.scene_singular","scene"):a(this.hass,"ui.scene_plural","scenes");return`${i} ${n}`}get _weatherUnconfigured(){return!this._store.weatherConfig||this._store.weatherConfig.entity==null}get _workdayUnconfigured(){let e=this._store.dayConfig;return!e||e.workday_sensor==null&&e.workday_calendar==null}get _conditionsUnconfigured(){return this._weatherUnconfigured||this._workdayUnconfigured}_conditionsHintText(){let e=this._weatherUnconfigured,i=this._workdayUnconfigured;return e&&i?{title:a(this.hass,"ui.conditions_hint_title","Optional: set up Workday & Weather"),body:a(this.hass,"ui.conditions_hint_body","Configure Workday and Weather in Conditions to use them in your scene conditions.")}:i?{title:a(this.hass,"ui.conditions_hint_title_workday","Optional: set up Workday"),body:a(this.hass,"ui.conditions_hint_body_workday","Configure Workday in Conditions to use it in your scene conditions.")}:{title:a(this.hass,"ui.conditions_hint_title_weather","Optional: set up Weather"),body:a(this.hass,"ui.conditions_hint_body_weather","Configure Weather in Conditions to use it in your scene conditions.")}}_openSettings(e){this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:e},bubbles:!0,composed:!0}))}_dismissConditionsHint(){this._conditionsHintDismissed=!0,os(this._store.installId)}_renderBanners(){if(!this._store.staticLoaded)return"";if(!this._conditionsHintDismissed&&this._conditionsUnconfigured){let{title:e,body:i}=this._conditionsHintText();return d`
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
            ${a(this.hass,"ui.conditions_hint_cta","Configure conditions")}
          </button>
          <button
            class="banner-dismiss"
            data-test="dismiss-conditions-hint"
            title=${a(this.hass,"ui.dismiss","Dismiss")}
            aria-label=${a(this.hass,"ui.dismiss","Dismiss")}
            @click=${()=>this._dismissConditionsHint()}
          >
            ✕
          </button>
        </div>
      `}return""}_orderedScopeRows(){let e=[{scope:{kind:"house"},name:a(this.hass,"ui.scope_house","House"),cfg:this._store.house,rowClass:"house"}];for(let s of this._store.floors){let o=this._store.floorConfigs.get(s.floor_id);o&&e.push({scope:{kind:"floor",id:s.floor_id},name:s.name,cfg:o,rowClass:"floor"})}for(let s of this._store.areas){let o=this._store.areaConfigs.get(s.area_id);o&&e.push({scope:{kind:"area",id:s.area_id},name:s.name,cfg:o,rowClass:"area"})}let i=[],n=[];for(let s of e)(s.cfg.enabled===!1?n:i).push(s);return[...i,...n]}_isSwitchedOff(e){let i=this._store.switchEntityIds.get(R(e));return i?this.hass.states?.[i]?.state==="off":!1}_renderAreasPlaceholder(){return this._store.areasLoaded?!this._store.error&&this._store.areas.length===0?d`<li>
        <p class="empty">
          ${a(this.hass,"ui.no_areas","No areas found in Home Assistant.")}
        </p>
      </li>`:"":d`<li>
        <p class="empty" data-test="areas-loading">
          <span class="spinner" aria-hidden="true"></span>
          ${a(this.hass,"ui.loading","Loading\u2026")}
        </p>
      </li>`}_scopeName(e){return e.scope_kind==="house"?a(this.hass,"ui.scope_house","House"):e.scope_kind==="area"?this._store.areas.find(i=>i.area_id===e.scope_id)?.name??e.scope_id??"":this._store.floors.find(i=>i.floor_id===e.scope_id)?.name??e.scope_id??""}_historyLabel(e){if(!e)return"";let i=this._scopeName(e),n=e.scene_name?.trim()?e.scene_name:a(this.hass,"ui.history_untitled","Untitled");return a(this.hass,`ui.history_action_${e.action}`,e.action,{scene:n,scope:i})}_historyButtonLabel(e){let i=e==="undo",n=i?this._store.canUndo:this._store.canRedo,s=i?this._store.undoAction:this._store.redoAction;return n?a(this.hass,`ui.history_${e}_tooltip`,i?"Undo: {change}":"Redo: {change}",{change:this._historyLabel(s)}):a(this.hass,`ui.history_nothing_to_${e}`,i?"Nothing to undo":"Nothing to redo")}_renderHistoryButton(e){let i=e==="undo",n=i?this._store.canUndo:this._store.canRedo,s=this._historyButtonLabel(e);return d`
      <ha-icon-button
        .disabled=${!n}
        .label=${s}
        @click=${()=>i?this._store.undo():this._store.redo()}
      >
        <ha-icon icon=${i?"mdi:undo":"mdi:redo"}></ha-icon>
      </ha-icon-button>
    `}_historyCaption(){return this._store.canUndo?this._historyButtonLabel("undo"):this._store.canRedo?this._historyButtonLabel("redo"):""}_editingScopeIsStale(){return this._editing!==null&&this._store.isScopeStale(this._editing.scope)}render(){let e=this._historyCaption();return d`
      <div class="undo-toolbar">
        <span class="undo-caption" title=${e}>${e}</span>
        ${this._renderHistoryButton("undo")}${this._renderHistoryButton("redo")}
      </div>
      ${this._store.error?d`<p class="error">${this._store.error}</p>`:""}
      ${this._renderBanners()}
      <ul>
        ${Ks(this._orderedScopeRows(),i=>R(i.scope),i=>this._renderScopeRow(i.scope,i.name,i.cfg,i.rowClass))}
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
    `}_renderScopeRow(e,i,n,s){let o=this._expanded.has(R(e)),l=e.kind==="house"?"":e.id,u=this._isSwitchedOff(e)?"off":this._matchingSceneCount(n)===0?"empty":"",h=n.enabled===!1;return d`
      <li class="scope-row ${s} ${h?"scope-disabled":""}" data-id=${l}>
        <div
          class="scope-header ${o?"open":""} ${u}"
          @click=${()=>this._toggleExpand(e)}
        >
          <span class="chevron ${o?"open":""}">▶</span>
          <ha-icon class="scope-icon" icon=${Vt(e,this.hass)}></ha-icon>
          <span class="scope-name">${i}</span>
          ${Bi(this.hass,n.scenes)}
          <span class="scope-summary">${this._summary(n)}</span>
          ${this._renderPauseIcon(e,n)}
          ${this._renderScopeSwitch(e,n)}
          <ambience-kebab-menu
            data-test="scope-kebab"
            ?muted=${u==="off"||h}
            .hass=${this.hass}
            .items=${[{id:"run",label:a(this.hass,"ui.run","Run"),icon:"mdi:play"}]}
            @menu-action=${p=>this._onScopeMenu(e,p.detail.id)}
            @click=${p=>p.stopPropagation()}
          ></ambience-kebab-menu>
        </div>
        ${o?d`
              <div class="scope-body">
                <ambience-scenes-list
                  .scenes=${n.scenes}
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
                  @show-simulator=${p=>this._showSimulator(e,p.detail.category)}
                  @show-auto-triggers=${p=>this._showAutoTriggers(e,p.detail.category)}
                ></ambience-scenes-list>
              </div>
            `:""}
      </li>
    `}_pauseRemaining(e){let i=this.hass.states?.[e],n=i?.attributes?.off_at,s=Number(i?.attributes?.auto_on_delay_seconds??0);if(!n||!s)return 0;let o=(Date.now()-new Date(n).getTime())/1e3;return Math.max(0,Math.round(s-o))}_renderPauseIcon(e,i){if(i.enabled===!1)return"";let n=this._store.switchEntityIds.get(R(e));if(!n)return"";let s=this.hass.states?.[n]?.state==="off",o=u=>{u.stopPropagation(),this.hass.callService?.("switch",s?"turn_on":"turn_off",{entity_id:n})};if(!s)return d`<button
        class="scope-pause"
        data-test="scope-pause"
        title=${a(this.hass,"ui.pause_scope","Pause this scope")}
        @click=${o}
      >
        <ha-icon icon="mdi:timer-outline"></ha-icon>
      </button>`;let l=this._pauseRemaining(n);return d`<button
      class="scope-pause paused"
      data-test="scope-pause"
      title=${a(this.hass,"ui.resume_scope","Resume now")}
      @click=${o}
    >
      <ha-icon icon="mdi:timer"></ha-icon>
      <span class="countdown">${Su(l)}</span>
    </button>`}_renderScopeSwitch(e,i){let n=i.enabled!==!1;return yt({checked:n,dataTest:"scope-switch",onChange:async l=>{l.stopPropagation();try{await xs(this.hass,e,!n),await Promise.all([this._store.reloadScope(e),this._store.refreshSwitches()])}catch(u){this._store.error=E(this.hass,u)}},className:"scope-switch",onClick:l=>l.stopPropagation()})}};Q.styles=[Ui,y`
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
    `],c([m({attribute:!1})],Q.prototype,"hass",2),c([g()],Q.prototype,"_expanded",2),c([g()],Q.prototype,"_collapsedCategories",2),c([g()],Q.prototype,"_conditionsHintDismissed",2),c([g()],Q.prototype,"_editing",2),c([g()],Q.prototype,"_sceneEditorError",2),c([g()],Q.prototype,"_viewingTraces",2),c([g()],Q.prototype,"_viewingSimulator",2),c([g()],Q.prototype,"_autoTriggers",2),c([m({attribute:!1})],Q.prototype,"filterCategory",2),Q=c([w("ambience-scopes-view")],Q);var Tu=[{field:"expose_assist",labelKey:"ui.settings_expose_assist",label:"Assist",dataTest:"expose-assist"},{field:"expose_google",labelKey:"ui.settings_expose_google",label:"Google Assistant",dataTest:"expose-google"},{field:"expose_alexa",labelKey:"ui.settings_expose_alexa",label:"Alexa",dataTest:"expose-alexa"}],ve=class extends b{constructor(){super(...arguments);this._defaults={name:"Ambience",auto_on_delay_seconds:0};this._reapply={enabled:!1,interval_seconds:3600};this._exposed={expose_assist:!0,expose_google:!1,expose_alexa:!1};this._error=""}async connectedCallback(){super.connectedCallback();try{this._defaults=await bs(this.hass),this._reapply=await ks(this.hass),this._exposed=await Es(this.hass)}catch(e){this._error=E(this.hass,e)}}async _safeSave(e){try{await e(),this._error=""}catch(i){this._error=E(this.hass,i)}}_saveDefaults(){this._safeSave(()=>$s(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds))}_onDefaultName(e){let i=e.target,n=i.value.trim();if(!n){i.value=this._defaults.name;return}this._defaults={...this._defaults,name:n},this._saveDefaults()}_onPauseMinutes(e){let i=e.target,n=Math.floor(Number(i.value));if(i.value===""||!Number.isFinite(n)||n<0){i.value=String(Math.round(this._defaults.auto_on_delay_seconds/60));return}this._defaults={...this._defaults,auto_on_delay_seconds:n*60},this._saveDefaults()}_saveReapply(){this._safeSave(()=>Cs(this.hass,this._reapply.enabled,this._reapply.interval_seconds))}_onReapplyEnabled(e){this._reapply={...this._reapply,enabled:e.target.checked},this._saveReapply()}_onReapplyMinutes(e){let i=e.target,n=Math.floor(Number(i.value));if(i.value===""||!Number.isFinite(n)||n<1){i.value=String(Math.round(this._reapply.interval_seconds/60));return}this._reapply={...this._reapply,interval_seconds:n*60},this._saveReapply()}_saveExposed(){this._safeSave(()=>Ss(this.hass,this._exposed.expose_assist,this._exposed.expose_google,this._exposed.expose_alexa))}_onExpose(e,i){this._exposed={...this._exposed,[e]:i.target.checked},this._saveExposed()}_renderToggle(e,i,n,s=!1){return yt({checked:e,dataTest:i,onChange:n,disabled:s})}render(){return d`
      ${this._error?d`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:""}

      <div class="card">
        <div class="row">
          <label>
            ${a(this.hass,"ui.settings_ambience_field_name","Switch name")}
            <ambience-help
              .hass=${this.hass}
              .text=${a(this.hass,"ui.help_switch_name","The name used for the per-scope pause switch entities.")}
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
            ${a(this.hass,"ui.settings_ambience_field_pause","Pause for")}
            <ambience-help
              .hass=${this.hass}
              .text=${a(this.hass,"ui.help_pause_for","When a scope's switch is turned off, auto-resume after this many minutes. 0 = stays paused until turned back on.")}
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
            >${a(this.hass,"ui.unit_minutes","minutes")}</span
          >
        </div>
        <div class="expose-group" data-test="expose-group">
          <div class="expose-heading">
            ${a(this.hass,"ui.settings_expose_group","Expose to voice assistants")}
            <ambience-help
              .hass=${this.hass}
              .text=${a(this.hass,"ui.help_expose","Expose the per-scope pause switches to the selected voice assistants so you can pause/resume Ambience by voice. Google Assistant and Alexa require Home Assistant Cloud or a manual setup.")}
            ></ambience-help>
          </div>
          <div class="expose-rows">
            ${Tu.map(e=>d`
                <div class="row">
                  <label>${a(this.hass,e.labelKey,e.label)}</label>
                  ${this._renderToggle(this._exposed[e.field],e.dataTest,i=>this._onExpose(e.field,i))}
                </div>
              `)}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="row toggle-row">
          <label>
            ${a(this.hass,"ui.settings_reapply_enable_label","Re-run all scenes after inactivity")}
            <ambience-help
              .hass=${this.hass}
              .text=${a(this.hass,"ui.help_reapply_toggle","Re-run the scenes for a scope/category after inactivity and re-apply the winning scene, in case any action had previously failed, such as a light not turning off.")}
            ></ambience-help>
          </label>
          ${this._renderToggle(this._reapply.enabled,"reapply-enabled",e=>this._onReapplyEnabled(e))}
        </div>
        <div class="row">
          <label>
            ${a(this.hass,"ui.settings_reapply_interval_label","Re-run after")}
            <ambience-help
              .hass=${this.hass}
              .text=${a(this.hass,"ui.help_reapply_after","Re-run scenes that haven't been updated for this many minutes.")}
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
            >${a(this.hass,"ui.unit_minutes","minutes")}</span
          >
        </div>
      </div>
    `}};ve.styles=y`
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
  `,c([m({attribute:!1})],ve.prototype,"hass",2),c([g()],ve.prototype,"_defaults",2),c([g()],ve.prototype,"_reapply",2),c([g()],ve.prototype,"_exposed",2),c([g()],ve.prototype,"_error",2),ve=c([w("ambience-ambience-settings")],ve);function $a(){let t=globalThis.crypto;if(t?.randomUUID)return t.randomUUID().replace(/-/g,"");if(t?.getRandomValues){let r=t.getRandomValues(new Uint8Array(16));return Array.from(r,e=>e.toString(16).padStart(2,"0")).join("")}return Array.from({length:4},()=>Math.floor(Math.random()*4294967296).toString(16).padStart(8,"0")).join("")}var ye=class extends b{constructor(){super(...arguments);this._categories=[];this._error="";this._editing=null;this._modalError=""}async connectedCallback(){super.connectedCallback();try{this._categories=await xe(this.hass)}catch(e){this._error=E(this.hass,e)}}_sorted(){return[...this._categories].sort((e,i)=>e.name.localeCompare(i.name))}_validate(e){let i=e.name.trim();if(i==="")return a(this.hass,"ui.category_name_blank_error","Category names can't be empty.");let n=i.toLocaleLowerCase();return this._categories.some(o=>o.id!==e.id&&o.name.trim().toLocaleLowerCase()===n)?a(this.hass,"ui.category_name_duplicate_error","Two categories can't have the same name."):""}_openEditor(e){this._editing={...e},this._modalError=""}_addCategory(){let e=$a();this._editing={id:e,name:""},this._modalError=""}_closeModal(){this._editing=null,this._modalError=""}_patchDraft(e){this._editing&&(this._editing={...this._editing,...e})}_onName(e){this._patchDraft({name:e.target.value})}_onIcon(e){this._patchDraft({icon:e||void 0})}_onColor(e){this._patchDraft({color:e})}_save(){if(!this._editing)return;let e=this._validate(this._editing);if(e){this._modalError=e;return}let i={...this._editing,name:this._editing.name.trim()},n=this._categories.some(s=>s.id===i.id);this._categories=n?this._categories.map(s=>s.id===i.id?i:s):[...this._categories,i],this._closeModal(),Ri(this.hass,this._categories).then(()=>{window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(s=>{this._error=E(this.hass,s)})}_deleteCategory(){if(!this._editing)return;let e=this._editing.id;if(this._categories.length<=1){this._modalError=a(this.hass,"ui.category_delete_blocked_last","You can't delete the last category.");return}let i=this._categories;this._categories=this._categories.filter(n=>n.id!==e),Ls(this.hass,e).then(()=>{this._closeModal(),window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(n=>{this._categories=i;let s=n.code;s==="category_in_use"?this._modalError=a(this.hass,"ui.category_delete_blocked_in_use","This category still has scenes \u2014 move or delete them first."):s==="category_last"?this._modalError=a(this.hass,"ui.category_delete_blocked_last","You can't delete the last category."):this._modalError=E(this.hass,n)})}_renderIconField(){return customElements.get("ha-icon-picker")?d`<ha-icon-picker
        .hass=${this.hass}
        .value=${this._editing.icon??""}
        @value-changed=${e=>{e.stopPropagation(),this._onIcon(e.detail.value)}}
      ></ha-icon-picker>`:d`<input
      class="icon-input"
      .value=${this._editing.icon??""}
      placeholder=${a(this.hass,"ui.category_icon","Icon")}
      @change=${e=>this._onIcon(e.target.value)}
    />`}_renderSwatches(){let e=this._editing.color;return d`
      <div class="swatches">
        ${Fr.map(i=>{let n=Un(this.hass,i.id,i.label);return d`<button
            type="button"
            class="swatch ${e===i.id?"selected":""}"
            style=${`background: ${i.hex}`}
            title=${n}
            aria-label=${n}
            aria-pressed=${e===i.id}
            @click=${()=>this._onColor(i.id)}
          ></button>`})}
        <button
          type="button"
          class="swatch none ${e==null?"selected":""}"
          title=${a(this.hass,"ui.category_color_none","No colour")}
          aria-label=${a(this.hass,"ui.category_color_none","No colour")}
          aria-pressed=${e==null}
          @click=${()=>this._onColor(void 0)}
        >✕</button>
      </div>
    `}_renderModal(){if(!this._editing)return"";let e=this._categories.some(n=>n.id===this._editing.id),i=e?a(this.hass,"ui.category_edit_title","Edit category"):a(this.hass,"ui.category_add_title","Add category");return d`
      <div
        class="overlay"
        @click=${n=>{n.target.classList.contains("overlay")&&this._closeModal()}}
      >
        <div class="modal">
          <div class="modal-header">
            <h3>${i}</h3>
            <button
              class="close"
              title=${a(this.hass,"ui.cancel","Cancel")}
              aria-label=${a(this.hass,"ui.cancel","Cancel")}
              @click=${()=>this._closeModal()}
            >✕</button>
          </div>
          <div class="modal-content">
            <label>${a(this.hass,"ui.category_name_placeholder","Category name")}</label>
            <input
              class="name"
              .value=${this._editing.name}
              placeholder=${a(this.hass,"ui.category_name_placeholder","Category name")}
              aria-label=${a(this.hass,"ui.category_name_placeholder","Category name")}
              @input=${this._onName}
            />

            <label>${a(this.hass,"ui.category_icon","Icon")}</label>
            ${this._renderIconField()}

            <label>${a(this.hass,"ui.category_color","Colour")}</label>
            ${this._renderSwatches()}

            ${this._modalError?d`<p class="modal-error">${this._modalError}</p>`:""}
          </div>
          <div class="modal-footer">
            ${e?d`<button class="delete" @click=${()=>this._deleteCategory()}>
                  ${a(this.hass,"ui.title_delete","Delete")}
                </button>`:d`<span></span>`}
            <div class="right">
              <button class="primary" @click=${()=>this._save()}>
                ${a(this.hass,"ui.category_save","Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    `}render(){return d`
      ${this._error?d`<p class="error">${this._error}</p>`:""}
      <div class="list">
        ${this._sorted().map(e=>{let i=Mr(e.color);return d`<button class="category-row" @click=${()=>this._openEditor(e)}>
            <span class="row-icon">${e.icon?d`<ha-icon icon=${e.icon}></ha-icon>`:""}</span>
            <span class="row-swatch ${i?"":"none"}" style=${i?`background: ${i}`:""}></span>
            <span class="row-name">${e.name}</span>
          </button>`})}
      </div>
      <div class="add-row">
        <button class="add" @click=${()=>this._addCategory()}>
          ${a(this.hass,"ui.category_add","+ Add category")}
        </button>
        <ambience-help .hass=${this.hass} .text=${a(this.hass,"ui.help_categories_tab","Categories let one scope have several independent winners at once \u2014 one scene wins per category.")}></ambience-help>
      </div>
      ${this._renderModal()}
    `}};ye.styles=y`
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
  `,c([m({attribute:!1})],ye.prototype,"hass",2),c([g()],ye.prototype,"_categories",2),c([g()],ye.prototype,"_error",2),c([g()],ye.prototype,"_editing",2),c([g()],ye.prototype,"_modalError",2),ye=c([w("ambience-categories-settings")],ye);var Te=class extends b{constructor(){super(...arguments);this.conditionName="";this.conditionDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let e=G(this.hass,this.conditionName);return d`
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
    `}};Te.styles=y`
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
  `,c([m({attribute:!1})],Te.prototype,"hass",2),c([m()],Te.prototype,"conditionName",2),c([m()],Te.prototype,"conditionDescription",2),c([g()],Te.prototype,"_expanded",2),Te=c([w("ambience-condition-card")],Te);var Au=/^[a-z][a-z0-9_]*$/;function Pu(t){return t.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var ci=y`
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
`,le=class extends b{constructor(){super(...arguments);this.takenIds=new Set;this._label="";this._error=""}static{this.styles=ci}connectedCallback(){super.connectedCallback(),this._label=this._initialLabel()??""}_onLabelInput(e){this._label=e.target.value}_validateName(e){return this.existingId?"":this._label.trim()?!e||!Au.test(e)?a(this.hass,"ui.error_start_letter","Name must start with a letter."):this.takenIds.has(e)?a(this.hass,"ui.error_name_exists","An entry with this name already exists. Choose a different name."):"":a(this.hass,"ui.error_enter_name","Please enter a name.")}_onSave(){let e=this.existingId??Pu(this._label),i=this._validateName(e)||this._validateDef();if(i){this._error=i,this.performUpdate();return}this.dispatchEvent(new CustomEvent(this._saveEvent,{detail:{id:e,definition:this._buildDefinition()},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent(this._cancelEvent,{bubbles:!0,composed:!0}))}render(){let e=this.existingId?this._editTitleTemplate().replace("{name}",this._initialLabel()??this.existingId):this._addTitle();return d`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <div class="field">
          <label for="label">${a(this.hass,"ui.name","Name")}</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput}
            placeholder=${this._namePlaceholder()} />
        </div>
        ${this._renderFields()}
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>${a(this.hass,"ui.cancel","Cancel")}</button>
          <button @click=${this._onSave}>${a(this.hass,"ui.save","Save")}</button>
        </div>
      </div>
    `}};c([m({attribute:!1})],le.prototype,"hass",2),c([m({attribute:!1})],le.prototype,"existingId",2),c([m({attribute:!1})],le.prototype,"takenIds",2),c([g()],le.prototype,"_label",2),c([g()],le.prototype,"_error",2);var ct=class extends le{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this._def=this.initial}connectedCallback(){super.connectedCallback(),this._def=this.initial}get _saveEvent(){return"period-save"}get _cancelEvent(){return"period-cancel"}_addTitle(){return a(this.hass,"ui.period_modal_add_title","Add custom period")}_editTitleTemplate(){return a(this.hass,"ui.period_modal_edit_title",'Edit "{name}"')}_namePlaceholder(){return a(this.hass,"ui.name_placeholder","e.g. Wind down")}_initialLabel(){return this.initial.label??(this.existingId?de(this.hass,this.existingId,{}):null)}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_renderFields(){return d`
      <div class="row">
        <label style="min-width: 3em;">${a(this.hass,"ui.from_label","From")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
      </div>
      <div class="row">
        <label style="min-width: 3em;">${a(this.hass,"ui.to_label","To")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
      </div>
    `}_validateDef(){return""}_buildDefinition(){return{from:this._def.from,to:this._def.to,label:this._label.trim()||null}}};ct.styles=[ci,y`
      .row { display: flex; align-items: center; gap: 0.5rem; }
    `],c([m({attribute:!1})],ct.prototype,"initial",2),c([g()],ct.prototype,"_def",2),ct=c([w("ambience-period-edit-modal")],ct);function ka(t,r){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=Pe(r,t.anchor);if(t.offset_min===0)return e;let i=Math.abs(t.offset_min),n=i%60===0?`${i/60}${a(r,"ui.unit_hour_abbr","h")}`:`${i}${a(r,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${n}`}var _r=class extends fe{_list(){return Ai(this.hass)}async _save(r,e){await gs(this.hass,r,e)}_label(r,e){return de(this.hass,r,e)}_formatDef(r){return`${ka(r.from,this.hass)} \u2192 ${ka(r.to,this.hass)}`}_headingKey(){return["ui.periods_heading","Periods"]}_addKey(){return["ui.add_custom_period","+ Add custom period"]}_renderModal(){let r=this._modal;return r.mode==="edit"?d`<ambience-period-edit-modal
        .hass=${this.hass}
        .existingId=${r.id}
        .initial=${r.initial}
        .takenIds=${this._takenIds()}
        @period-save=${this._onModalSave}
        @period-cancel=${this._onModalCancel}
      ></ambience-period-edit-modal>`:r.mode==="add"?d`<ambience-period-edit-modal
        .hass=${this.hass}
        .takenIds=${this._takenIds()}
        @period-save=${this._onModalSave}
        @period-cancel=${this._onModalCancel}
      ></ambience-period-edit-modal>`:d``}};_r=c([w("ambience-time-of-day-config")],_r);var Ve=class extends le{constructor(){super(...arguments);this.initial={min:0,max:100,label:null};this._min=null;this._max=null}connectedCallback(){super.connectedCallback(),this._min=this.initial.min??null,this._max=this.initial.max??null}get _saveEvent(){return"lux-range-save"}get _cancelEvent(){return"lux-range-cancel"}_addTitle(){return a(this.hass,"ui.lux_modal_add_title","Add custom lux range")}_editTitleTemplate(){return a(this.hass,"ui.lux_modal_edit_title",'Edit "{name}"')}_namePlaceholder(){return a(this.hass,"ui.lux_name_placeholder","e.g. Gloomy")}_initialLabel(){return this.initial.label??(this.existingId?Re(this.hass,this.existingId,{}):null)}_onMinInput(e){let i=e.target.value;this._min=i===""?null:Number(i)}_onMaxInput(e){let i=e.target.value;this._max=i===""?null:Number(i)}_renderFields(){return d`
      <div class="row">
        <div class="field">
          <label for="min">${a(this.hass,"ui.lux_min_label","Min (lx)")}</label>
          <input id="min" type="number" min="0" step="1" .value=${this._min==null?"":String(this._min)}
            @input=${this._onMinInput} placeholder=${a(this.hass,"ui.lux_min_placeholder","0")} />
        </div>
        <div class="field">
          <label for="max">${a(this.hass,"ui.lux_max_label","Max (lx)")}</label>
          <input id="max" type="number" min="0" step="1" .value=${this._max==null?"":String(this._max)}
            @input=${this._onMaxInput} placeholder=${a(this.hass,"ui.lux_max_placeholder","\u221E")} />
        </div>
      </div>
    `}_validateDef(){return this._min==null&&this._max==null?a(this.hass,"ui.lux_error_need_bound","Enter a min, a max, or both."):this._min!=null&&this._min<0||this._max!=null&&this._max<0?a(this.hass,"ui.lux_error_negative","Bounds must be 0 or greater."):this._min!=null&&this._max!=null&&this._min>=this._max?a(this.hass,"ui.lux_error_order","Min must be less than max."):""}_buildDefinition(){let e={label:this._label.trim()||null};return this._min!=null&&(e.min=this._min),this._max!=null&&(e.max=this._max),e}};Ve.styles=[ci,y`
      .row { display: flex; gap: 1rem; }
      .row .field { flex: 1; }
    `],c([m({attribute:!1})],Ve.prototype,"initial",2),c([g()],Ve.prototype,"_min",2),c([g()],Ve.prototype,"_max",2),Ve=c([w("ambience-lux-edit-modal")],Ve);var vr=class extends fe{_list(){return Pi(this.hass)}async _save(r,e){await _s(this.hass,r,e)}_label(r,e){return Re(this.hass,r,e)}_formatDef(r){return Yr(r.min,r.max,"any")}_headingKey(){return["ui.lux_heading","Lux ranges"]}_addKey(){return["ui.add_custom_lux_range","+ Add custom lux range"]}_renderModal(){let r=this._modal;return r.mode==="edit"?d`<ambience-lux-edit-modal
        .hass=${this.hass}
        .existingId=${r.id}
        .initial=${r.initial}
        .takenIds=${this._takenIds()}
        @lux-range-save=${this._onModalSave}
        @lux-range-cancel=${this._onModalCancel}
      ></ambience-lux-edit-modal>`:r.mode==="add"?d`<ambience-lux-edit-modal
        .hass=${this.hass}
        .takenIds=${this._takenIds()}
        @lux-range-save=${this._onModalSave}
        @lux-range-cancel=${this._onModalCancel}
      ></ambience-lux-edit-modal>`:d``}};vr=c([w("ambience-lux-config")],vr);var Ke=class extends b{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._error=""}async connectedCallback(){super.connectedCallback(),re(this);try{this._config=await Wt(this.hass)}catch(e){this._error=E(this.hass,e)}}async _save(e){this._config=e;try{await vs(this.hass,e.workday_sensor,e.workday_calendar),this._error=""}catch(i){this._error=E(this.hass,i);return}window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=this._error?d`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:"";return d`
      ${e}
      <div class="row">
        <label>${a(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        ${oi(this.hass,"workday_sensor",this._config.workday_sensor,{entity:{integration:"workday",domain:"binary_sensor"}},"binary_sensor.workday",i=>this._onSensorChange({detail:{value:i}}))}
      </div>
      <div class="row">
        <label>${a(this.hass,"ui.workday_calendar","Workday calendar")}</label>
        ${oi(this.hass,"workday_calendar",this._config.workday_calendar,{entity:{integration:"workday",domain:"calendar"}},"calendar.workday",i=>this._onCalendarChange({detail:{value:i}}))}
      </div>
    `}};Ke.styles=y`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
  `,c([m({attribute:!1})],Ke.prototype,"hass",2),c([g()],Ke.prototype,"_config",2),c([g()],Ke.prototype,"_error",2),Ke=c([w("ambience-day-config")],Ke);var Ru=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],Ge=class extends b{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._expanded=new Set}async connectedCallback(){super.connectedCallback(),re(this),this._config=await Bt(this.hass)}async _persist(){await ys(this.hass,this._config.entity,this._config.groups),window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onEntityChange(e){this._config={...this._config,entity:e.detail.value||null},this._persist()}_nextGroupId(e){let i=new Set(e.map(n=>n.id));for(let n=1;n<=e.length+1;n++){let s=`group_${n}`;if(!i.has(s))return s}return`group_${e.length+1}`}_addGroup(){let e=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:e,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,e]),this._persist()}_toggleExpand(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}_updateGroup(e,i){this._config={...this._config,groups:this._config.groups.map((n,s)=>s===e?{...n,...i}:n)},this._persist()}_removeGroup(e){let i=this._config.groups[e];if(this._config={...this._config,groups:this._config.groups.filter((n,s)=>s!==e)},i){let n=new Set(this._expanded);n.delete(i.id),this._expanded=n}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:Ru.map(e=>({value:e,label:ft(this.hass,e)}))}}}]}_renderConditions(e,i){if(customElements.get("ha-form"))return d`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:i.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation(),this._updateGroup(e,{conditions:s.detail.value.conditions??[]})}}
      ></ha-form>`;let n=i.conditions.map(s=>ft(this.hass,s));return d`<span class="conditions-list">${n.join(", ")}</span>`}_renderGroup(e,i){let n=this._expanded.has(i.id),s=i.conditions.map(o=>ft(this.hass,o)).join(", ");return d`
      <div class="group">
        <div class="group-header" @click=${()=>this._toggleExpand(i.id)}>
          <span class="chevron ${n?"open":""}">▶</span>
          <span class="label">${i.label}</span>
          <span class="codes">${s}</span>
          <button
            class="icon"
            title=${a(this.hass,"ui.title_delete","Delete")}
            @click=${o=>{o.stopPropagation(),this._removeGroup(e)}}
          >✕</button>
        </div>
        ${n?d`<div class="body" @click=${o=>o.stopPropagation()}>
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
        <label class="section">${a(this.hass,"ui.weather_entity","Weather entity")}</label>
        ${oi(this.hass,"entity",this._config.entity,{entity:{domain:"weather"}},"weather.home",e=>this._onEntityChange({detail:{value:e}}))}
      </div>

      <h4>${a(this.hass,"ui.groups","Groups")}</h4>
      ${this._config.groups.map((e,i)=>this._renderGroup(i,e))}
      <button class="add" @click=${()=>this._addGroup()}>
        ${a(this.hass,"ui.add_group","+ Add group")}
      </button>
    `}};Ge.styles=y`
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
  `,c([m({attribute:!1})],Ge.prototype,"hass",2),c([g()],Ge.prototype,"_config",2),c([g()],Ge.prototype,"_expanded",2),Ge=c([w("ambience-weather-config")],Ge);var Ca={time_of_day:t=>d`<ambience-time-of-day-config .hass=${t}></ambience-time-of-day-config>`,lux:t=>d`<ambience-lux-config .hass=${t}></ambience-lux-config>`,day:t=>d`<ambience-day-config .hass=${t}></ambience-day-config>`,weather:t=>d`<ambience-weather-config .hass=${t}></ambience-weather-config>`},Du=new Set(Object.keys(Ca)),Ye=class extends b{constructor(){super(...arguments);this._conditions=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._conditions=await Li(this.hass)}catch(e){this._error=E(this.hass,e)}}render(){let e=this._conditions.filter(i=>Du.has(i.name)).slice().sort((i,n)=>n.priority-i.priority);return d`
      <div class="tab-heading">
        <span>${a(this.hass,"ui.settings_tab_conditions","Conditions")}</span>
        <ambience-help .hass=${this.hass} .text=${a(this.hass,"ui.help_conditions_tab","Conditions are the inputs scenes match on (time of day, presence, weather, \u2026). A scene wins when all its conditions pass.")}></ambience-help>
      </div>
      ${this._error?d`<p class="error">${this._error}</p>`:""}
      ${e.map(i=>d`
        <ambience-condition-card .hass=${this.hass} .conditionName=${i.name} .conditionDescription=${i.description}>
          ${Ca[i.name]?.(this.hass)??d``}
        </ambience-condition-card>
      `)}
    `}};Ye.styles=y`
    :host { display: block; }
    .error { color: var(--error-color, #d32f2f); }
    .tab-heading {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }
  `,c([m({attribute:!1})],Ye.prototype,"hass",2),c([g()],Ye.prototype,"_conditions",2),c([g()],Ye.prototype,"_error",2),Ye=c([w("ambience-conditions-settings")],Ye);function Ea(t,r){let e=t?.config?.components;return Array.isArray(e)&&e.includes(r)}var Hu="fado",Nu="https://my.home-assistant.io/redirect/hacs_repository/?owner=clintongormley&repository=ha-fado",H=class extends b{constructor(){super(...arguments);this._actions=[];this._services=[];this._schemas={};this._fieldSchemas={};this._addSchema=[];this._serviceById=new Map;this._availableServices=[];this._expanded=new Set;this._adding=!1;this._loadError=null;this._saveError=null;this._loaded=!1;this._fadoNoticeDismissed=!1;this._installId=null;this._editingDefault=null;this._editingOriginalValue=void 0;this._editingOriginalHad=!1;this._drag=new wt(this,(e,i)=>{let n=[...this._actions],[s]=n.splice(e,1);n.splice(i,0,s),this._actions=n,this._autoSave()});this._onDocPointerDown=e=>{if(!this._adding&&this._editingDefault===null)return;let i=e.composedPath(),n=i.some(s=>s instanceof Element&&H._OVERLAY_TAG_RE.test(s.localName));this._collapseAddFormOnClickAway(i,n),this._cancelEditingDefaultOnClickAway(i,n)}}_collapseAddFormOnClickAway(e,i){if(!this._adding)return;let n=this.shadowRoot?.querySelector(".add-row");!(!!n&&e.includes(n))&&!i&&(this._adding=!1)}_cancelEditingDefaultOnClickAway(e,i){if(this._editingDefault===null)return;let n=this.shadowRoot?.querySelector(`.field-row-editor[data-editing-key="${this._editingDefault}"]`);(!n||!e.includes(n))&&!i&&this._cancelEditingDefault()}connectedCallback(){super.connectedCallback(),document.addEventListener("pointerdown",this._onDocPointerDown),customElements.get("ha-service-picker")||customElements.whenDefined("ha-service-picker").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._onDocPointerDown)}_startEditingDefault(e,i){let s=this._actions.find(o=>o.id===e)?.defaults??{};this._editingOriginalHad=i in s,this._editingOriginalValue=s[i],this._editingDefault=`${e}:${i}`}_saveEditingDefault(){this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1,this._autoSave()}_cancelEditingDefault(){let e=this._editingDefault;if(e){let i=e.indexOf(":"),n=e.slice(0,i),s=e.slice(i+1);this._actions=this._actions.map(o=>{if(o.id!==n)return o;let l={...o.defaults??{}};return this._editingOriginalHad?l[s]=this._editingOriginalValue:delete l[s],{...o,defaults:l}})}this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1}async firstUpdated(){await this._reload()}willUpdate(e){if(e.has("_actions")||e.has("_schemas")){let i={};for(let n of this._actions){let s=this._schemas[n.id];if(s)for(let[o,l]of Object.entries(s.fields))i[`${n.id}:${o}`]=[{name:o,selector:l.selector??{text:{}},required:!1}]}this._fieldSchemas=i}if(e.has("_services")&&(this._serviceById=new Map(this._services.map(i=>[i.id,i]))),e.has("_actions")||e.has("_services")){let i=new Set(this._actions.map(n=>n.id));this._availableServices=this._services.filter(n=>!i.has(n.id)),this._addSchema=[{name:"service",selector:{select:{options:this._availableServices.map(n=>({value:n.id,label:this._addOptionLabel(n.id)})),custom_value:!0,mode:"dropdown",sort:!0}}}]}}async _reload(){this._loadError=null;try{let[e,i,n]=await Promise.all([Ut(this.hass),ps(this.hass),Ti(this.hass)]);this._actions=e,this._services=i,this._installId=n,this._fadoNoticeDismissed=as(n)}catch(e){this._loadError=E(this.hass,e);return}await Promise.all(this._actions.map(e=>this._ensureSchema(e.id))),this._loaded=!0}async _ensureSchema(e){if(!(e in this._schemas))try{let i=await De(this.hass,e);this._schemas={...this._schemas,[e]:i}}catch{this._schemas={...this._schemas,[e]:null}}}_setShowInEditor(e,i,n){this._actions=this._actions.map(s=>{if(s.id!==e)return s;let o=new Set(s.visible_fields??[]);return n?o.add(i):o.delete(i),{...s,visible_fields:[...o]}}),this._autoSave()}_setDefault(e,i,n){this._actions=this._actions.map(s=>s.id!==e?s:{...s,defaults:{...s.defaults??{},[i]:n}})}_clearDefault(e,i){this._actions=this._actions.map(n=>{if(n.id!==e)return n;let s={...n.defaults??{}};return delete s[i],{...n,defaults:s}})}_setLabel(e,i){this._actions=this._actions.map(n=>n.id===e?{...n,label:i}:n)}_toggleExpand(e){this._expanded.has(e)?this._expanded=new Set:(this._expanded=new Set([e]),this._ensureSchema(e))}async _addService(e){if(e&&this._services.some(i=>i.id===e)){if(this._actions.some(i=>i.id===e)){this._expanded=new Set([e]),this._adding=!1;return}await this._ensureSchema(e),this._actions=[...this._actions,{id:e,label:this._labelForService(e),visible_fields:[],defaults:{}}],this._expanded=new Set([e]),this._adding=!1,this._autoSave()}}_removeService(e){this._actions=this._actions.filter(n=>n.id!==e);let i=new Set(this._expanded);i.delete(e),this._expanded=i,this._autoSave()}async _autoSave(){this._saveError=null;try{await hs(this.hass,this._actions),window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"))}catch(e){this._saveError=E(this.hass,e)}}render(){return this._loadError!==null?d`
        <div class="error">${this._loadError}</div>
        <button @click=${()=>this._reload()}>${a(this.hass,"ui.retry","Retry")}</button>
      `:this._loaded?d`
      <section>
        <div class="section-heading">
          <span>${a(this.hass,"ui.settings_tab_actions","Actions")}</span>
          <ambience-help .hass=${this.hass} .text=${a(this.hass,"ui.help_actions_tab","Actions are the service calls a scene runs. Define them here so scenes can reuse them.")}></ambience-help>
        </div>
        ${this._renderFadoNotice()}
        ${this._saveError?d`<div class="error">${this._saveError}</div>`:""}
        ${this._actions.map((e,i)=>this._renderCard(e,i))}
        ${this._renderAdd()}
      </section>
    `:d`<div>${a(this.hass,"ui.loading","Loading\u2026")}</div>`}_renderFadoNotice(){return this._fadoNoticeDismissed||Ea(this.hass,Hu)?"":d`
      <div class="banner banner-hint" data-test="fado-notice">
        <ha-icon class="banner-icon" icon="mdi:lightbulb-on-outline"></ha-icon>
        <div class="banner-text">
          <strong>${a(this.hass,"ui.fado_notice_title","Recommended: install Fado Light Fader")}</strong>
          <span>${a(this.hass,"ui.fado_notice_body","Fado adds smooth light fading for brightness, color, and color temperature \u2014 with automatic brightness restoration, UI autoconfiguration, and native transitions. It's a Home Assistant default HACS integration.")}</span>
        </div>
        <a
          class="banner-cta"
          data-test="fado-notice-cta"
          href=${Nu}
          target="_blank"
          rel="noopener noreferrer"
        >${a(this.hass,"ui.fado_notice_cta","Install via HACS")}</a>
        <button
          class="banner-dismiss"
          data-test="dismiss-fado-notice"
          title=${a(this.hass,"ui.dismiss","Dismiss")}
          aria-label=${a(this.hass,"ui.dismiss","Dismiss")}
          @click=${()=>this._dismissFadoNotice()}
        >✕</button>
      </div>
    `}_dismissFadoNotice(){this._fadoNoticeDismissed=!0,ls(this._installId)}_renderCard(e,i){let n=this._schemas[e.id],s=this._expanded.has(e.id);return d`
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
            title=${a(this.hass,"ui.drag_to_reorder","Drag to reorder")}
            @pointerdown=${o=>this._drag.start(i,o)}
            @click=${o=>o.stopPropagation()}
          >⠿</span>
          <span class="toggle-arrow">${s?"\u25BE":"\u25B8"}</span>
          ${s?d`
                <strong>${e.id}</strong>
                <ha-input
                  class="header-label-input"
                  data-label-input
                  placeholder=${a(this.hass,"ui.action_label_placeholder","Label (optional)")}
                  .value=${e.label}
                  @input=${o=>{o.stopPropagation(),this._setLabel(e.id,o.target.value)}}
                  @keydown=${o=>{o.key==="Enter"&&(o.preventDefault(),o.stopPropagation(),o.currentTarget.blur(),this._autoSave(),this._expanded=new Set)}}
                  @blur=${()=>void this._autoSave()}
                  @click=${o=>o.stopPropagation()}
                ></ha-input>
              `:d`
                <span class="header-label-display">${e.label?.trim()||this._labelForService(e.id)}</span>
                <span class="header-service-id">(${e.id})</span>
              `}
          <button
            class="remove"
            data-remove
            title=${a(this.hass,"ui.remove","Remove")}
            @click=${o=>{o.stopPropagation(),this._removeService(e.id)}}
          >✖</button>
        </div>
        ${s?this._renderBody(e,n):""}
      </div>
    `}_renderBody(e,i){return d`
      <div class="body">
        ${this._renderFieldsSection(e,i)}
      </div>
    `}_renderFieldsSection(e,i){if(i===null)return d`<p class="body-help warning">
        ${a(this.hass,"ui.service_unavailable","Service not available in this HA instance.")}
      </p>`;if(i===void 0)return d`<p class="body-help">${a(this.hass,"ui.loading","Loading\u2026")}</p>`;let n=Object.entries(i.fields).slice().sort(([s],[o])=>s.localeCompare(o));return n.length===0?d`<p class="body-help">
        ${a(this.hass,"ui.service_has_no_fields","This service has no fields.")}
      </p>`:d`
      <p class="body-help">
        ${a(this.hass,"ui.actions_field_help_show","Tick a checkbox to make a field editable per scene.")}
        <ambience-help .hass=${this.hass} .text=${a(this.hass,"ui.help_show_in_scene_editor","Show this field in the scene editor so each scene can set it. Leave off to send a fixed default instead.")}></ambience-help>
        ${a(this.hass,"ui.actions_field_help_default","Set a default to pre-fill it.")}
        <ambience-help .hass=${this.hass} .text=${a(this.hass,"ui.help_set_default","A value sent automatically when the action runs. Scenes can override it if the field is also shown in the editor.")}></ambience-help>
      </p>
      ${n.map(([s,o])=>this._renderFieldRow(e,s,o))}
    `}_formatDefaultSummary(e){return e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}_defaultUnitSuffix(e,i){let n=this._schemas[e]?.fields?.[i];if(!n||typeof n!="object")return"";let s=Xi(n.selector);return s?` ${s}`:""}_renderFieldRow(e,i,n){let s=(e.visible_fields??[]).includes(i),o=i in(e.defaults??{}),l=`${e.id}:${i}`,u=this._editingDefault===l;return d`
      <div class="field-row">
        <!-- Row 1: [checkbox] [name] [default summary] -->
        <div class="field-row-main">
          <div class="checkbox-cell">
            <input
              type="checkbox"
              data-show-in-editor=${i}
              title=${a(this.hass,"ui.show_in_scene_editor","Show in scene editor")}
              .checked=${s}
              @change=${h=>this._setShowInEditor(e.id,i,h.target.checked)}
            />
          </div>
          <span class="name">
            ${n.name||z(i)}
            ${n.name?d` <small class="field-id">(${i})</small>`:""}
            ${n.description?d` <small>— ${n.description}</small>`:""}
          </span>
          <div class="summary-cell">
            ${u?d`<span class="summary-cell-editing">${a(this.hass,"ui.editing","Editing\u2026")}</span>`:o?d`<button
                    class="default-summary"
                    data-default-summary=${i}
                    @click=${h=>{h.stopPropagation(),this._startEditingDefault(e.id,i)}}
                  >${a(this.hass,"ui.default_prefix","Default: ")}${this._formatDefaultSummary(e.defaults?.[i])}${this._defaultUnitSuffix(e.id,i)}</button>`:d`<button
                    class="set-default-btn"
                    data-set-default=${i}
                    @click=${h=>{h.stopPropagation(),this._startEditingDefault(e.id,i)}}
                  >+ ${a(this.hass,"ui.set_default","Set default")}</button>`}
          </div>
        </div>
        <!-- Row 2: full editor (only when editing) -->
        ${u?d`<div
              class="field-row-editor"
              data-editing-key=${l}
            >
              <div class="editor-line">
                <div class="default-editor">${this._renderDefaultEditor(e,i,n)}</div>
                <button
                  class="clear-default"
                  data-clear-default=${i}
                  title=${a(this.hass,"ui.clear_default","Clear default")}
                  @click=${h=>{h.stopPropagation(),this._clearDefault(e.id,i),this._saveEditingDefault()}}
                >✕</button>
              </div>
              <div class="editor-actions">
                <button
                  class="cancel-default"
                  data-cancel-default=${i}
                  @click=${h=>{h.stopPropagation(),this._cancelEditingDefault()}}
                >${a(this.hass,"ui.cancel","Cancel")}</button>
                <button
                  class="save-default"
                  data-save-default=${i}
                  @click=${h=>{h.stopPropagation(),this._saveEditingDefault()}}
                >${a(this.hass,"ui.save","Save")}</button>
              </div>
            </div>`:""}
      </div>
    `}_renderDefaultEditor(e,i,n){let s=e.defaults?.[i],o=this._fieldSchemas[`${e.id}:${i}`]??[];return customElements.get("ha-form")?d`<ha-form
        .hass=${this.hass}
        .schema=${o}
        .data=${{[i]:s??""}}
        .computeLabel=${()=>""}
        @value-changed=${l=>{l.stopPropagation(),this._setDefault(e.id,i,l.detail.value[i])}}
      ></ha-form>`:d`<input
      data-default-value=${i}
      .value=${s==null?"":String(s)}
      @input=${l=>this._setDefault(e.id,i,l.target.value)}
    />`}_renderAdd(){return this._adding?d`<div class="add-row">
      ${this._renderAddPicker()}
      <button data-action="cancel-add" @click=${()=>{this._adding=!1}}>
        ${a(this.hass,"ui.cancel","Cancel")}
      </button>
    </div>`:d`<div class="add-row">
        <button class="add" data-action="add" @click=${()=>{this._adding=!0}}>
          + ${a(this.hass,"ui.add_action_button","Add action")}
        </button>
      </div>`}_labelForService(e){return this._serviceById.get(e)?.name?.trim()||xi(e)}_addOptionLabel(e){return`${this._labelForService(e)} (${e})`}_renderAddPicker(){return customElements.get("ha-service-picker")?d`<ha-service-picker
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
        .computeLabel=${()=>a(this.hass,"ui.pick_service","Pick a service")}
        @value-changed=${e=>{e.stopPropagation();let i=e.detail.value.service;i&&this._addService(i)}}
      ></ha-form>`:d`<select
      data-add-service
      @change=${e=>this._addService(e.target.value)}
    >
      <option value="">— ${a(this.hass,"ui.pick_service","Pick a service")} —</option>
      ${this._availableServices.map(e=>d`<option value=${e.id}>${this._addOptionLabel(e.id)}</option>`)}
    </select>`}};H.styles=[Ui,y`
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
  `],H._OVERLAY_TAG_RE=/vaadin|combo-box|overlay|listbox|menu|mwc-|md-/i,c([m({attribute:!1})],H.prototype,"hass",2),c([g()],H.prototype,"_actions",2),c([g()],H.prototype,"_services",2),c([g()],H.prototype,"_schemas",2),c([g()],H.prototype,"_fieldSchemas",2),c([g()],H.prototype,"_addSchema",2),c([g()],H.prototype,"_expanded",2),c([g()],H.prototype,"_adding",2),c([g()],H.prototype,"_loadError",2),c([g()],H.prototype,"_saveError",2),c([g()],H.prototype,"_loaded",2),c([g()],H.prototype,"_fadoNoticeDismissed",2),c([g()],H.prototype,"_editingDefault",2),c([g()],H.prototype,"_editingOriginalValue",2),c([g()],H.prototype,"_editingOriginalHad",2),H=c([w("ambience-actions-settings")],H);var K=class extends Error{constructor(r){super(r),this.name="ImportError"}};function yr(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function Iu(t){if(!yr(t))throw new K("`scope` must be an object with a `kind`.");let r=t.kind;if(r==="house")return{kind:"house"};if(r==="area"||r==="floor"){if(typeof t.id!="string"||t.id==="")throw new K(`A ${r} scope needs a non-empty \`id\`.`);return{kind:r,id:t.id}}throw new K("`scope.kind` must be one of: area, floor, house.")}function Ou(t){if(!Array.isArray(t))throw new K("`scenes` must be a list.");return t.map((r,e)=>{if(!yr(r))throw new K(`Scene ${e+1} must be an object.`);if(typeof r.category!="string"||r.category==="")throw new K(`Scene ${e+1} is missing a \`category\`.`);return r})}function Fu(t){if(t!==void 0){if(!yr(t)||typeof t.id!="string"||t.id==="")throw new K("`category` must be an object with a non-empty `id`.");return t}}function Sa(t){let r;try{r=ar(t)}catch(n){throw new K(`Could not parse YAML/JSON: ${n.message}`)}if(!yr(r))throw new K("Import must be a YAML/JSON object (an `ambience_import` block).");let e=Number(r.ambience_import);if(r.ambience_import===void 0||!Number.isFinite(e)||e<1)throw new K("Missing or invalid `ambience_import` marker \u2014 is this an Ambience import block?");if(e>1)throw new K(`This is import format v${e}, but this Ambience only understands v1 \u2014 update Ambience.`);let i=r.mode??"merge";if(i!=="merge"&&i!=="replace")throw new K("`mode` must be `merge` or `replace`.");return{ambience_import:e,scope:Iu(r.scope),category:Fu(r.category),mode:i,scenes:Ou(r.scenes)}}function yn(t){return`${t.category}\0${(t.name??"").trim().toLowerCase()}`}function La(t,r,e){let i=new Set(e.map(v=>v.id)),n=t.category?.id,s=t.category&&!i.has(t.category.id)?t.category:null,o=new Set(i);n&&o.add(n);let l=[...new Set(t.scenes.map(v=>v.category).filter(v=>!o.has(v)))],u=r.scenes??[],h=[],p=[],f=[],_;if(t.mode==="replace"){let v=new Set(t.scenes.map(x=>x.category));for(let x of u)v.has(x.category)&&f.push(x.name??"(unnamed)");_=u.filter(x=>!v.has(x.category));for(let x of t.scenes)h.push(x.name??"(unnamed)"),_.push(x)}else{_=u.map(x=>({...x}));let v=new Map(_.map((x,C)=>[yn(x),C]));for(let x of t.scenes){let A=(x.name??"").trim()!==""?v.get(yn(x)):void 0;A!==void 0?(_[A]=x,p.push(x.name??"(unnamed)")):(v.set(yn(x),_.length),_.push(x),h.push(x.name??"(unnamed)"))}}return{scope:t.scope,mode:t.mode,newCategory:s,unknownCategories:l,adds:h,updates:p,removes:f,resultConfig:{...r,scenes:_}}}var oe=class extends b{constructor(){super(...arguments);this.text="";this.error=null;this.preview=null;this.categories=[];this.busy=!1;this.done=null}async _download(){try{await Is(this.hass)}catch(e){this.error=E(this.hass,e)}}_onInput(e){this.text=e.target.value,this.error=null,this.done=null,this.preview=null}async _doPreview(){this.done=null;try{let e=Sa(this.text),[i,n]=await Promise.all([Fs(this.hass,e.scope),xe(this.hass)]);this.categories=n,this.preview=La(e,i,n),this.error=null}catch(e){this.preview=null,this.error=e instanceof K?e.message:E(this.hass,e)}}async _confirm(){let e=this.preview;if(!(!e||e.unknownCategories.length>0||this.busy)){this.busy=!0;try{await Os(this.hass,e.resultConfig),e.newCategory&&await Ri(this.hass,[...this.categories,e.newCategory]),await Ms(this.hass,e.scope,e.resultConfig,{action:"import",scene_name:null}),this.done=a(this.hass,"ui.import_done","Imported successfully."),this.preview=null,this.text=""}catch(i){this.error=E(this.hass,i)}finally{this.busy=!1}}}_list(e,i){return i.length===0?$:d`<div>${e}<ul>${i.map(n=>d`<li>${n}</li>`)}</ul></div>`}_renderPreview(e){let i=e.scope.kind==="house"?e.scope.kind:`${e.scope.kind} ${e.scope.id}`;return d`
      <div class="preview-panel">
        <div class="target">${a(this.hass,"ui.import_target","Target")}: ${i} · ${e.mode}</div>
        ${e.newCategory?d`<div class="new-category">${a(this.hass,"ui.import_new_category","New category to create")}: ${e.newCategory.name}</div>`:$}
        ${e.unknownCategories.length>0?d`<div class="error unknown">${a(this.hass,"ui.import_unknown_categories","Unknown categories (create them first)")}: ${e.unknownCategories.join(", ")}</div>`:$}
        ${this._list(a(this.hass,"ui.import_adds","Add"),e.adds)}
        ${this._list(a(this.hass,"ui.import_updates","Update"),e.updates)}
        ${this._list(a(this.hass,"ui.import_removes","Remove"),e.removes)}
        <button
          class="confirm"
          ?disabled=${this.busy||e.unknownCategories.length>0}
          @click=${()=>this._confirm()}
        >
          ${a(this.hass,"ui.import_confirm","Import")}
        </button>
      </div>
    `}render(){return d`
      <div class="intro">
        ${a(this.hass,"ui.import_intro","Download your AI bundle, give it to an AI with the Ambience skill, then paste the block it returns below.")}
      </div>
      <button class="download" @click=${()=>this._download()}>
        ${a(this.hass,"ui.import_download_bundle","Download AI bundle")}
      </button>
      <textarea
        class="block"
        .value=${this.text}
        @input=${this._onInput}
        placeholder=${a(this.hass,"ui.import_placeholder","Paste the YAML or JSON import block here")}
      ></textarea>
      <div>
        <button class="preview" @click=${()=>this._doPreview()}>
          ${a(this.hass,"ui.import_preview","Preview")}
        </button>
      </div>
      ${this.error?d`<div class="error">${this.error}</div>`:$}
      ${this.preview?this._renderPreview(this.preview):$}
      ${this.done?d`<div class="done">${this.done}</div>`:$}
    `}};oe.styles=y`
    :host { display: block; }
    .intro { color: var(--secondary-text-color, #666); margin-bottom: 0.75rem; }
    textarea.block {
      width: 100%; box-sizing: border-box; min-height: 12rem;
      font-family: var(--code-font-family, monospace); font-size: 0.85rem;
      background: var(--secondary-background-color, #f5f5f5); color: inherit;
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 6px;
      padding: 0.5rem; margin: 0.5rem 0;
    }
    button {
      background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff);
      border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font: inherit;
    }
    button[disabled] { opacity: 0.5; cursor: not-allowed; }
    button.download { background: var(--secondary-background-color, #e0e0e0); color: inherit; }
    .preview-panel {
      margin-top: 1rem; padding: 0.75rem;
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 6px;
    }
    .preview-panel ul { margin: 0.25rem 0 0.5rem 1.25rem; }
    .new-category { color: var(--primary-color, #03a9f4); }
    .error { color: var(--error-color, #d32f2f); margin-top: 0.5rem; }
    .done { color: var(--success-color, #43a047); margin-top: 0.5rem; }
    .target { color: var(--secondary-text-color, #666); margin-bottom: 0.5rem; }
  `,c([m({attribute:!1})],oe.prototype,"hass",2),c([g()],oe.prototype,"text",2),c([g()],oe.prototype,"error",2),c([g()],oe.prototype,"preview",2),c([g()],oe.prototype,"categories",2),c([g()],oe.prototype,"busy",2),c([g()],oe.prototype,"done",2),oe=c([w("ambience-import-config")],oe);var Qe=class extends b{constructor(){super(...arguments);this._tab="categories"}willUpdate(e){e.has("initialTab")&&this.initialTab&&(this._tab=this.initialTab)}render(){return d`
      <nav>
        <button class=${this._tab==="categories"?"active":""} @click=${()=>{this._tab="categories"}}>
          <ha-icon icon="mdi:shape-outline"></ha-icon>${a(this.hass,"ui.settings_tab_categories","Categories")}
        </button>
        <button class=${this._tab==="conditions"?"active":""} @click=${()=>{this._tab="conditions"}}>
          <ha-icon icon="mdi:filter-variant"></ha-icon>${a(this.hass,"ui.settings_tab_conditions","Conditions")}
        </button>
        <button class=${this._tab==="actions"?"active":""} @click=${()=>{this._tab="actions"}}>
          <ha-icon icon="mdi:flash"></ha-icon>${a(this.hass,"ui.settings_tab_actions","Actions")}
        </button>
        <button class=${this._tab==="import"?"active":""} @click=${()=>{this._tab="import"}}>
          <ha-icon icon="mdi:creation"></ha-icon>${a(this.hass,"ui.settings_tab_import","AI")}
        </button>
        <button class=${this._tab==="ambience"?"active":""} @click=${()=>{this._tab="ambience"}}>
          <ha-icon icon="mdi:home-lightbulb"></ha-icon>${a(this.hass,"ui.settings_tab_ambience","Advanced")}
        </button>
      </nav>
      <div class="content">
        ${this._tab==="categories"?d`<ambience-categories-settings .hass=${this.hass}></ambience-categories-settings>`:this._tab==="conditions"?d`<ambience-conditions-settings .hass=${this.hass}></ambience-conditions-settings>`:this._tab==="actions"?d`<ambience-actions-settings .hass=${this.hass}></ambience-actions-settings>`:this._tab==="import"?d`<ambience-import-config .hass=${this.hass}></ambience-import-config>`:d`<ambience-ambience-settings .hass=${this.hass}></ambience-ambience-settings>`}
      </div>
    `}};Qe.styles=y`
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
  `,c([m({attribute:!1})],Qe.prototype,"hass",2),c([m({attribute:!1})],Qe.prototype,"initialTab",2),c([g()],Qe.prototype,"_tab",2),Qe=c([w("ambience-settings-view")],Qe);var Je=class extends b{constructor(){super();this.open=!1;new qe(this,()=>this._close())}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?d`
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        @click=${e=>e.stopPropagation()}
      >
        <div class="header">
          <h3>${a(this.hass,"ui.tab_settings","Settings")}</h3>
          <button class="close" @click=${this._close} aria-label=${a(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          <ambience-settings-view
            .hass=${this.hass}
            .initialTab=${this.initialTab}
          ></ambience-settings-view>
        </div>
      </div>
    `:$}};Je.styles=y`
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
  `,c([m({attribute:!1})],Je.prototype,"hass",2),c([m({type:Boolean,reflect:!0})],Je.prototype,"open",2),c([m({attribute:!1})],Je.prototype,"initialTab",2),Je=c([w("ambience-settings-modal")],Je);var ut=class extends b{constructor(){super(...arguments);this._settingsOpen=!1;this._filterCategory=Si();this._onOpenSettings=e=>{let i=e.detail?.tab;this._settingsTab=i,this._settingsOpen=!0};this._onFilterChanged=e=>{this._filterCategory=e.detail?.category??"",e.stopPropagation()}}static{this.styles=y`
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
  `}connectedCallback(){super.connectedCallback(),re(this),this.addEventListener("ambience-open-settings",this._onOpenSettings),this.addEventListener("ambience-filter-changed",this._onFilterChanged)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("ambience-open-settings",this._onOpenSettings),this.removeEventListener("ambience-filter-changed",this._onFilterChanged)}render(){let e={dark:!!this.hass.themes?.darkMode,title:a(this.hass,"ui.panel_title","Ambience")};return d`
      <header>
        <div class="bar">
          <h1 class="brand">
            ${qn(e)}
            ${Vn(e)}
          </h1>
          <ambience-category-filter .hass=${this.hass}></ambience-category-filter>
          <button
            class="settings-btn"
            @click=${()=>{this._settingsTab=void 0,this._settingsOpen=!0}}
            aria-label=${a(this.hass,"ui.tab_settings","Settings")}
            title=${a(this.hass,"ui.tab_settings","Settings")}
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
    `}};c([m({attribute:!1})],ut.prototype,"hass",2),c([g()],ut.prototype,"_settingsOpen",2),c([g()],ut.prototype,"_settingsTab",2),c([g()],ut.prototype,"_filterCategory",2);Fn("ambience-frontend",ut);export{ut as AmbienceFrontend};
