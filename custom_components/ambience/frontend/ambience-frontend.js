/* Ambience — bundled output. Do not edit by hand. */
var ms=Object.defineProperty;var fs=Object.getOwnPropertyDescriptor;var u=(t,n,e,r)=>{for(var i=r>1?void 0:r?fs(n,e):n,s=t.length-1,o;s>=0;s--)(o=t[s])&&(i=(r?o(n,e,i):o(i))||i);return r&&i&&ms(n,e,i),i};var kt=globalThis,St=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,or=Symbol(),Yr=new WeakMap,Xe=class{constructor(n,e,r){if(this._$cssResult$=!0,r!==or)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(St&&n===void 0){let r=e!==void 0&&e.length===1;r&&(n=Yr.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),r&&Yr.set(e,n))}return n}toString(){return this.cssText}},Vr=t=>new Xe(typeof t=="string"?t:t+"",void 0,or),y=(t,...n)=>{let e=t.length===1?t[0]:n.reduce((r,i,s)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new Xe(e,t,or)},Jr=(t,n)=>{if(St)t.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let r=document.createElement("style"),i=kt.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,t.appendChild(r)}},ar=St?t=>t:t=>t instanceof CSSStyleSheet?(n=>{let e="";for(let r of n.cssRules)e+=r.cssText;return Vr(e)})(t):t;var{is:gs,defineProperty:_s,getOwnPropertyDescriptor:vs,getOwnPropertyNames:ys,getOwnPropertySymbols:bs,getPrototypeOf:ws}=Object,Et=globalThis,Qr=Et.trustedTypes,$s=Qr?Qr.emptyScript:"",xs=Et.reactiveElementPolyfillSupport,Ze=(t,n)=>t,et={toAttribute(t,n){switch(n){case Boolean:t=t?$s:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,n){let e=t;switch(n){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},Ct=(t,n)=>!gs(t,n),Xr={attribute:!0,type:String,converter:et,reflect:!1,useDefault:!1,hasChanged:Ct};Symbol.metadata??=Symbol("metadata"),Et.litPropertyMetadata??=new WeakMap;var ie=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Xr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(n,r,e);i!==void 0&&_s(this.prototype,n,i)}}static getPropertyDescriptor(n,e,r){let{get:i,set:s}=vs(this.prototype,n)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let a=i?.call(this);s?.call(this,o),this.requestUpdate(n,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Xr}static _$Ei(){if(this.hasOwnProperty(Ze("elementProperties")))return;let n=ws(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Ze("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ze("properties"))){let e=this.properties,r=[...ys(e),...bs(e)];for(let i of r)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let r=new Set(n.flat(1/0).reverse());for(let i of r)e.unshift(ar(i))}else n!==void 0&&e.push(ar(n));return e}static _$Eu(n,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(n.set(r,this[r]),delete this[r]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Jr(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,r){this._$AK(n,r)}_$ET(n,e){let r=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:et).toAttribute(e,r.type);this._$Em=n,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(n,e){let r=this.constructor,i=r._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:et;this._$Em=i;let a=o.fromAttribute(e,s.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(n,e,r,i=!1,s){if(n!==void 0){let o=this.constructor;if(i===!1&&(s=this[n]),r??=o.getPropertyOptions(n),!((r.hasChanged??Ct)(s,e)||r.useDefault&&r.reflect&&s===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,r))))return;this.C(n,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:r,reflect:i,wrapped:s},o){r&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??e??this[n]),s!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||r||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:o}=s,a=this[i];o!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,s,a)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw n=!1,this._$EM(),r}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};ie.elementStyles=[],ie.shadowRootOptions={mode:"open"},ie[Ze("elementProperties")]=new Map,ie[Ze("finalized")]=new Map,xs?.({ReactiveElement:ie}),(Et.reactiveElementVersions??=[]).push("2.1.2");var dr=globalThis,Zr=t=>t,Tt=dr.trustedTypes,ei=Tt?Tt.createPolicy("lit-html",{createHTML:t=>t}):void 0,cr="$lit$",ne=`lit$${Math.random().toFixed(9).slice(2)}$`,ur="?"+ne,ks=`<${ur}>`,Ae=document,rt=()=>Ae.createComment(""),it=t=>t===null||typeof t!="object"&&typeof t!="function",hr=Array.isArray,oi=t=>hr(t)||typeof t?.[Symbol.iterator]=="function",lr=`[ 	
\f\r]`,tt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ti=/-->/g,ri=/>/g,Te=RegExp(`>|${lr}(?:([^\\s"'>=/]+)(${lr}*=${lr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ii=/'/g,ni=/"/g,ai=/^(?:script|style|textarea|title)$/i,pr=t=>(n,...e)=>({_$litType$:t,strings:n,values:e}),l=pr(1),hd=pr(2),pd=pr(3),se=Symbol.for("lit-noChange"),S=Symbol.for("lit-nothing"),si=new WeakMap,Le=Ae.createTreeWalker(Ae,129);function li(t,n){if(!hr(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return ei!==void 0?ei.createHTML(n):n}var di=(t,n)=>{let e=t.length-1,r=[],i,s=n===2?"<svg>":n===3?"<math>":"",o=tt;for(let a=0;a<e;a++){let c=t[a],h,f,p=-1,_=0;for(;_<c.length&&(o.lastIndex=_,f=o.exec(c),f!==null);)_=o.lastIndex,o===tt?f[1]==="!--"?o=ti:f[1]!==void 0?o=ri:f[2]!==void 0?(ai.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=Te):f[3]!==void 0&&(o=Te):o===Te?f[0]===">"?(o=i??tt,p=-1):f[1]===void 0?p=-2:(p=o.lastIndex-f[2].length,h=f[1],o=f[3]===void 0?Te:f[3]==='"'?ni:ii):o===ni||o===ii?o=Te:o===ti||o===ri?o=tt:(o=Te,i=void 0);let v=o===Te&&t[a+1].startsWith("/>")?" ":"";s+=o===tt?c+ks:p>=0?(r.push(h),c.slice(0,p)+cr+c.slice(p)+ne+v):c+ne+(p===-2?a:v)}return[li(t,s+(t[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),r]},nt=class t{constructor({strings:n,_$litType$:e},r){let i;this.parts=[];let s=0,o=0,a=n.length-1,c=this.parts,[h,f]=di(n,e);if(this.el=t.createElement(h,r),Le.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=Le.nextNode())!==null&&c.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(cr)){let _=f[o++],v=i.getAttribute(p).split(ne),x=/([.?@])?(.*)/.exec(_);c.push({type:1,index:s,name:x[2],strings:v,ctor:x[1]==="."?At:x[1]==="?"?Ht:x[1]==="@"?Nt:Ne}),i.removeAttribute(p)}else p.startsWith(ne)&&(c.push({type:6,index:s}),i.removeAttribute(p));if(ai.test(i.tagName)){let p=i.textContent.split(ne),_=p.length-1;if(_>0){i.textContent=Tt?Tt.emptyScript:"";for(let v=0;v<_;v++)i.append(p[v],rt()),Le.nextNode(),c.push({type:2,index:++s});i.append(p[_],rt())}}}else if(i.nodeType===8)if(i.data===ur)c.push({type:2,index:s});else{let p=-1;for(;(p=i.data.indexOf(ne,p+1))!==-1;)c.push({type:7,index:s}),p+=ne.length-1}s++}}static createElement(n,e){let r=Ae.createElement("template");return r.innerHTML=n,r}};function He(t,n,e=t,r){if(n===se)return n;let i=r!==void 0?e._$Co?.[r]:e._$Cl,s=it(n)?void 0:n._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(t),i._$AT(t,e,r)),r!==void 0?(e._$Co??=[])[r]=i:e._$Cl=i),i!==void 0&&(n=He(t,i._$AS(t,n.values),i,r)),n}var Lt=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:r}=this._$AD,i=(n?.creationScope??Ae).importNode(e,!0);Le.currentNode=i;let s=Le.nextNode(),o=0,a=0,c=r[0];for(;c!==void 0;){if(o===c.index){let h;c.type===2?h=new Ie(s,s.nextSibling,this,n):c.type===1?h=new c.ctor(s,c.name,c.strings,this,n):c.type===6&&(h=new Pt(s,this,n)),this._$AV.push(h),c=r[++a]}o!==c?.index&&(s=Le.nextNode(),o++)}return Le.currentNode=Ae,i}p(n){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(n,r,e),e+=r.strings.length-2):r._$AI(n[e])),e++}},Ie=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,r,i){this.type=2,this._$AH=S,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=He(this,n,e),it(n)?n===S||n==null||n===""?(this._$AH!==S&&this._$AR(),this._$AH=S):n!==this._$AH&&n!==se&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):oi(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==S&&it(this._$AH)?this._$AA.nextSibling.data=n:this.T(Ae.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:r}=n,i=typeof r=="number"?this._$AC(n):(r.el===void 0&&(r.el=nt.createElement(li(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(e);else{let s=new Lt(i,this),o=s.u(this.options);s.p(e),this.T(o),this._$AH=s}}_$AC(n){let e=si.get(n.strings);return e===void 0&&si.set(n.strings,e=new nt(n)),e}k(n){hr(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,i=0;for(let s of n)i===e.length?e.push(r=new t(this.O(rt()),this.O(rt()),this,this.options)):r=e[i],r._$AI(s),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let r=Zr(n).nextSibling;Zr(n).remove(),n=r}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Ne=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,r,i,s){this.type=1,this._$AH=S,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=S}_$AI(n,e=this,r,i){let s=this.strings,o=!1;if(s===void 0)n=He(this,n,e,0),o=!it(n)||n!==this._$AH&&n!==se,o&&(this._$AH=n);else{let a=n,c,h;for(n=s[0],c=0;c<s.length-1;c++)h=He(this,a[r+c],e,c),h===se&&(h=this._$AH[c]),o||=!it(h)||h!==this._$AH[c],h===S?n=S:n!==S&&(n+=(h??"")+s[c+1]),this._$AH[c]=h}o&&!i&&this.j(n)}j(n){n===S?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},At=class extends Ne{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===S?void 0:n}},Ht=class extends Ne{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==S)}},Nt=class extends Ne{constructor(n,e,r,i,s){super(n,e,r,i,s),this.type=5}_$AI(n,e=this){if((n=He(this,n,e,0)??S)===se)return;let r=this._$AH,i=n===S&&r!==S||n.capture!==r.capture||n.once!==r.once||n.passive!==r.passive,s=n!==S&&(r===S||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Pt=class{constructor(n,e,r){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(n){He(this,n)}},ci={M:cr,P:ne,A:ur,C:1,L:di,R:Lt,D:oi,V:He,I:Ie,H:Ne,N:Ht,U:Nt,B:At,F:Pt},Ss=dr.litHtmlPolyfillSupport;Ss?.(nt,Ie),(dr.litHtmlVersions??=[]).push("3.3.2");var ui=(t,n,e)=>{let r=e?.renderBefore??n,i=r._$litPart$;if(i===void 0){let s=e?.renderBefore??null;r._$litPart$=i=new Ie(n.insertBefore(rt(),s),s,void 0,e??{})}return i._$AI(t),i};var mr=globalThis,b=class extends ie{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=ui(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return se}};b._$litElement$=!0,b.finalized=!0,mr.litElementHydrateSupport?.({LitElement:b});var Es=mr.litElementPolyfillSupport;Es?.({LitElement:b});(mr.litElementVersions??=[]).push("4.2.2");var w=t=>(n,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(t,n)}):customElements.define(t,n)};var Cs={attribute:!0,type:String,converter:et,reflect:!1,hasChanged:Ct},Ts=(t=Cs,n,e)=>{let{kind:r,metadata:i}=e,s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(e.name,t),r==="accessor"){let{name:o}=e;return{set(a){let c=n.get.call(this);n.set.call(this,a),this.requestUpdate(o,c,t,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,t,a),a}}}if(r==="setter"){let{name:o}=e;return function(a){let c=this[o];n.call(this,a),this.requestUpdate(o,c,t,!0,a)}}throw Error("Unsupported decorator location: "+r)};function m(t){return(n,e)=>typeof e=="object"?Ts(t,n,e):((r,i,s)=>{let o=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),o?Object.getOwnPropertyDescriptor(i,s):void 0})(t,n,e)}function g(t){return m({...t,state:!0,attribute:!1})}function hi(t,n){try{customElements.define(t,n)}catch{}}var Ls=["ha-input","ha-textfield","ha-form"],As=["ha-input","ha-textfield"];function pi(){for(let t of As)if(customElements.get(t))return t;return null}function me(t,n){for(let e of Ls)customElements.get(e)||customElements.whenDefined(e).then(()=>t.requestUpdate())}var mi={time_of_day_period:{morning:"Morning",afternoon:"Afternoon",evening:"Evening",nighttime:"Nighttime",daytime:"Daytime"},weekday:{mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",sun:"Sun"},day_item:{weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"},condition:{time_of_day:"Time of day",state:"Entity state",script:"Script",sun:"Sun",template:"Template"},action:{},anchor:{dawn:"Dawn",sunrise:"Sunrise",noon:"Noon",sunset:"Sunset",dusk:"Dusk",midnight:"Midnight"},ui:{panel_title:"Ambience",tab_settings:"Settings",settings_tab_ambience:"Ambience",settings_tab_conditions:"Conditions",settings_tab_actions:"Actions",settings_ambience_defaults_card:"Defaults",settings_ambience_field_name:"Switch name",settings_ambience_field_delay:"Auto-on delay (seconds)",settings_ambience_delay_help:"0 = never auto-on",settings_ambience_actions_placeholder:"No action settings yet",no_areas:"No areas found in Home Assistant.",not_configured:"not configured",scene_singular:"scene",scene_plural:"scenes",filter_by_category:"Filter by category",all_categories:"All categories",loading:"Loading\u2026",any_placeholder:"(any)",include:"Include",exclude:"Exclude",empty_all_days:"(empty \u2192 all days)",add_include_item:"+ Add include item",add_exclude_item:"+ Add exclude item",from:"from",to:"to",remove:"Remove",day_of_month_placeholder:"e.g. 1-10, 15",workday_sensor:"Workday sensor",workday_calendar:"Workday calendar",day_warning_prefix:"Warning:",day_warning_text:"scenes now reference unconfigured entities:",periods_heading:"Periods",reset_all_to_defaults:"Reset all to defaults",badge_builtin:"builtin",badge_builtin_edited:"builtin, edited",badge_custom:"custom",badge_hidden:"hidden",hidden_marker:"(hidden)",period_warning_prefix:"Warning:",period_warning_text:"some scenes now reference missing periods:",add_custom_period:"+ Add custom period",title_edit:"Edit",title_revert:"Revert to default",title_delete:"Delete",title_restore:"Restore",reset_confirm:"This will clear {custom} custom period(s) and restore {hidden} hidden built-in(s). Continue?",new_scene:"New scene",name_optional:"Name (optional)",category:"Category",scope:"Scope",when_heading:"When",actions_heading:"Actions",target:"Target",remove_action:"Remove action",add_action:"+ Add action\u2026",remove_condition:"Remove condition",add_condition:"+ Add condition\u2026",add_action_button:"Add action",cancel:"Cancel",save:"Save",save_scene:"Save scene",at_least_one_target:"At least one target is required.",condition_error:"Fix the error in this condition before continuing",param_required:"{param} is required.",no_scenes_yet:"No scenes yet.",add_scene:"+ Add scene",summary_any:"any",summary_any_paren:"(any)",no_targets:"(no targets)",target_noun:"target",action_singular:"action",action_plural:"actions",noop_prefix:"NOOP",scene_n:"Scene {n}",drag_to_reorder:"Drag to reorder",unpin:"Unpin (return to automatic order)",enable_scene:"Enable scene",disable_scene:"Disable scene",shadowed:"Never fires \u2014 shadowed by an earlier scene.",edit:"Edit",duplicate:"Duplicate",run_actions:"Run actions",run:"Run",more_actions:"More actions",scene_actions:"Scene actions",error_enter_name:"Please enter a name.",error_start_letter:"Name must start with a letter.",error_name_exists:"A period with this name already exists. Choose a different name.",period_modal_add_title:"Add custom period",period_modal_edit_title:'Edit "{name}"',name:"Name",name_placeholder:"e.g. Wind down",from_label:"From",to_label:"To",any_time:"Any time",custom_range:"Custom range",custom_suffix:" (custom)",add_time_range:"+ add another time range",endpoint_time:"Time",endpoint_sun:"Sun",offset_placeholder:"Offset",clamp_none:"\u2014",clamp_not_before:"not before",clamp_not_after:"not after",unit_hour:"hour",unit_hours:"hours",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"No matching entities in this area.",field_kind:"Kind",field_days_of_month:"Days of month",field_month:"Month",field_day:"Day",field_from_month:"From month",field_from_day:"From day",field_to_month:"To month",field_to_day:"To day",day_spec_error:"Use days 1\u201331 and ranges like 1-10, separated by commas",title_override:"Override",conditions:"Conditions",thresholds:"Thresholds",add_threshold:"+ Add threshold",weather_entity:"Weather entity",weather_warning_text:"scenes now reference an unconfigured weather entity:",groups:"Groups",add_group:"+ Add group",sun:{elevation:"Elevation",azimuth:"Azimuth",any:"Any",above:"Above",below:"Below",between:"Between",custom_range:"Custom range"},arguments:"Arguments",form:"Form",script:"Script",yaml:"YAML",script_entity:"Script",pick_script:"\u2014 select a script \u2014",script_not_found_prefix:"Script",script_not_found_suffix:"not found. It may have been removed.",script_no_parameters:"This script has no parameters.",script_required:"Please pick a script.",no_script_chosen:"(not selected)",yaml_must_be_object:"Top-level value must be a mapping.",invalid_yaml:"Invalid YAML.",reapply_enable_label:"Re-apply periodically",reapply_seconds_label:"Re-apply every (seconds)",reapply_seconds_unit:"s",settings_tab_categories:"Scene categories",category_add:"+ Add category",category_name_placeholder:"Category name",category_icon:"Icon",category_color:"Colour",category_name_blank_error:"Category names can't be empty.",category_name_duplicate_error:"Two categories can't have the same name.",category_delete_blocked_last:"You can't delete the last category.",category_delete_blocked_in_use:"This category still has scenes \u2014 move or delete them first.",category_edit_title:"Edit category",category_add_title:"Add category",category_color_none:"No colour",category_save:"Save",view_traces:"View traces"},day_summary:{any:"any",any_day:"any day",except:"except",day_prefix:"day",last_day:"last day",workday:"workday",holiday:"holiday",first_workday:"first workday",last_workday:"last workday"},month:{1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"},weather_condition:{"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"},weather_attr:{temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"}};function Hs(t){let n="component.ambience.";if(!t.startsWith(n))return;let e=t.slice(n.length).split("."),r=mi;for(let i of e){if(r===null||typeof r!="object")return;r=r[i]}return typeof r=="string"?r:void 0}function V(t,n,e){let r=t?.localize?.(n);if(r&&r!==n)return r;let i=Hs(n);return i!==void 0?i:e}function fe(t){let n=t.replaceAll("_"," ").toLowerCase();return n.charAt(0).toUpperCase()+n.slice(1)}function fr(t){return fe(t)}function st(t){let n=t.indexOf("."),e=n===-1?"":t.slice(0,n),i=(n===-1?t:t.slice(n+1)).replaceAll("_"," ").trim().toLowerCase(),s=e.replaceAll("_"," ").trim().toLowerCase(),o=i?i.split(" "):[],a=s?s.split(" "):[],c=a.length>0&&a.every(f=>o.includes(f)),h=!s||c?i:`${i} ${s}`;return h.charAt(0).toUpperCase()+h.slice(1)}function q(t,n){return V(t,`component.ambience.condition.${n}`,fr(n))}function Ot(t,n){return V(t,`component.ambience.action.${n}`,fr(n))}function Me(t,n){return V(t,`component.ambience.anchor.${n}`,fr(n))}function oe(t,n,e){let r=e[n]?.label;if(r)return r;let i=n.charAt(0).toUpperCase()+n.slice(1);return V(t,`component.ambience.time_of_day_period.${n}`,i)}function d(t,n,e){return V(t,`component.ambience.${n}`,e)}var Ns=["mon","tue","wed","thu","fri","sat","sun"],Ps=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function Rt(t,n){return V(t,`component.ambience.weekday.${Ns[n]}`,Ps[n]??String(n))}var Ds={weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"};function Ft(t,n){return V(t,`component.ambience.day_item.${n}`,Ds[n]??n)}var Os=["January","February","March","April","May","June","July","August","September","October","November","December"];function je(t,n){return V(t,`component.ambience.month.${n}`,Os[n-1]??String(n))}var Rs={"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"};function ze(t,n){return V(t,`component.ambience.weather_condition.${n}`,Rs[n]??n)}var Fs={temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"};function ot(t,n){return V(t,`component.ambience.weather_attr.${n}`,Fs[n]??n)}var Is={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},Ms={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},js={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function gr(t,n,e){if(n==="humidity")return"%";let r=js[n];if(r){let o=e?.attributes?.[r];if(typeof o=="string"&&o)return o}let i=Ms[n],s=t?.config?.unit_system;return i&&s&&typeof s[i]=="string"?s[i]:Is[n]??""}var zs={is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"};function K(t,n){return V(t,`component.ambience.state_op.${n}`,zs[n]??n)}var Ws=import.meta.url.slice(0,import.meta.url.lastIndexOf("/")+1);function fi(t){return Ws+t}function gi(t={}){let n=t.title??"Ambience",e=t.dark?"dark_logo":"logo",r=fi(`${e}.png`),i=fi(`${e}@2x.png`);return l`<img
    class="ambience-logo"
    src=${r}
    srcset="${r} 1x, ${i} 2x"
    alt=${n}
  />`}var _i={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},vi=t=>(...n)=>({_$litDirective$:t,values:n}),It=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,r){this._$Ct=n,this._$AM=e,this._$Ci=r}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:Us}=ci,yi=t=>t;var bi=()=>document.createComment(""),We=(t,n,e)=>{let r=t._$AA.parentNode,i=n===void 0?t._$AB:n._$AA;if(e===void 0){let s=r.insertBefore(bi(),i),o=r.insertBefore(bi(),i);e=new Us(s,o,t,t.options)}else{let s=e._$AB.nextSibling,o=e._$AM,a=o!==t;if(a){let c;e._$AQ?.(t),e._$AM=t,e._$AP!==void 0&&(c=t._$AU)!==o._$AU&&e._$AP(c)}if(s!==i||a){let c=e._$AA;for(;c!==s;){let h=yi(c).nextSibling;yi(r).insertBefore(c,i),c=h}}}return e},ge=(t,n,e=t)=>(t._$AI(n,e),t),Bs={},wi=(t,n=Bs)=>t._$AH=n,$i=t=>t._$AH,Mt=t=>{t._$AR(),t._$AA.remove()};var xi=(t,n,e)=>{let r=new Map;for(let i=n;i<=e;i++)r.set(t[i],i);return r},ki=vi(class extends It{constructor(t){if(super(t),t.type!==_i.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,n,e){let r;e===void 0?e=n:n!==void 0&&(r=n);let i=[],s=[],o=0;for(let a of t)i[o]=r?r(a,o):o,s[o]=e(a,o),o++;return{values:s,keys:i}}render(t,n,e){return this.dt(t,n,e).values}update(t,[n,e,r]){let i=$i(t),{values:s,keys:o}=this.dt(n,e,r);if(!Array.isArray(i))return this.ut=o,s;let a=this.ut??=[],c=[],h,f,p=0,_=i.length-1,v=0,x=s.length-1;for(;p<=_&&v<=x;)if(i[p]===null)p++;else if(i[_]===null)_--;else if(a[p]===o[v])c[v]=ge(i[p],s[v]),p++,v++;else if(a[_]===o[x])c[x]=ge(i[_],s[x]),_--,x--;else if(a[p]===o[x])c[x]=ge(i[p],s[x]),We(t,c[x+1],i[p]),p++,x--;else if(a[_]===o[v])c[v]=ge(i[_],s[v]),We(t,i[p],i[_]),_--,v++;else if(h===void 0&&(h=xi(o,v,x),f=xi(a,p,_)),h.has(a[p]))if(h.has(a[_])){let k=f.get(o[v]),L=k!==void 0?i[k]:null;if(L===null){let W=We(t,i[p]);ge(W,s[v]),c[v]=W}else c[v]=ge(L,s[v]),We(t,i[p],L),i[k]=null;v++}else Mt(i[_]),_--;else Mt(i[p]),p++;for(;v<=x;){let k=We(t,c[x+1]);ge(k,s[v]),c[v++]=k}for(;p<=_;){let k=i[p++];k!==null&&Mt(k)}return this.ut=o,wi(t,c),se}});async function Si(t){return t.callWS({type:"ambience/areas/list"})}async function Ei(t,n){return t.callWS({type:"ambience/area/get",area_id:n})}async function Ci(t,n,e){return t.callWS({type:"ambience/area/save",area_id:n,config:e})}async function Ti(t){return t.callWS({type:"ambience/floors/list"})}async function Li(t,n){return t.callWS({type:"ambience/floor/get",floor_id:n})}async function Ai(t,n,e){return t.callWS({type:"ambience/floor/save",floor_id:n,config:e})}async function Hi(t){return t.callWS({type:"ambience/house/get"})}async function Ni(t,n){return t.callWS({type:"ambience/house/save",config:n})}async function jt(t){return t.callWS({type:"ambience/conditions/list"})}async function at(t){return t.callWS({type:"ambience/exposed_actions/list"})}async function Pi(t,n){return t.callWS({type:"ambience/exposed_actions/save",actions:n})}async function Di(t){return t.callWS({type:"ambience/services/list"})}async function _e(t,n){return t.callWS({type:"ambience/services/get_schema",service:n})}function Oi(t){return t.kind==="area"?{area_id:t.id}:t.kind==="floor"?{floor_id:t.id}:{house:!0}}async function Ri(t,n,e){let r={type:"ambience/apply",...Oi(n)};return e!==void 0&&(r.category_id=e),t.callWS(r)}async function Fi(t,n,e){return t.callWS({type:"ambience/scene/run_actions",scene_index:e,...Oi(n)})}async function zt(t){return t.callWS({type:"ambience/time_of_day_periods/list"})}async function Ii(t,n,e){return t.callWS({type:"ambience/time_of_day_periods/save",custom:n,hidden:e})}async function lt(t){return t.callWS({type:"ambience/conditions/day/config/list"})}async function Mi(t,n,e){return t.callWS({type:"ambience/conditions/day/config/save",workday_sensor:n,workday_calendar:e})}async function dt(t){return t.callWS({type:"ambience/conditions/weather/config/list"})}async function ji(t,n,e){return t.callWS({type:"ambience/conditions/weather/config/save",entity:n,groups:e})}async function zi(t,n){return t.callWS({type:"ambience/state/known_states",entity_id:n})}async function Wi(t,n,e){return t.callWS({type:"ambience/state/known_attribute_values",entity_id:n,attribute:e})}async function Ui(t){return t.callWS({type:"ambience/switch_defaults/list"})}async function Bi(t){return t.callWS({type:"ambience/switches/list"})}async function _r(t,n,e){return t.callWS({type:"ambience/switch_defaults/save",name:n,auto_on_delay_seconds:e})}async function ct(t){return(await t.callWS({type:"ambience/categories/list"})).categories}async function qi(t,n){return t.callWS({type:"ambience/categories/save",categories:n})}async function Ki(t,n){return t.callWS({type:"ambience/categories/delete",category_id:n})}async function vr(t){return(await t.callWS({type:"ambience/traces/list"})).traces}async function Gi(t,n,e){return t.callWS({type:"ambience/simulate/inputs",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e})}async function Yi(t,n,e,r,i,s){return(await t.callWS({type:"ambience/simulate",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e,now:r,overrides:i,verdicts:s})).result}var yr=[{id:"red",label:"Red",hex:"#f44336"},{id:"pink",label:"Pink",hex:"#e91e63"},{id:"purple",label:"Purple",hex:"#9c27b0"},{id:"deep-purple",label:"Deep purple",hex:"#673ab7"},{id:"indigo",label:"Indigo",hex:"#3f51b5"},{id:"blue",label:"Blue",hex:"#2196f3"},{id:"light-blue",label:"Light blue",hex:"#03a9f4"},{id:"cyan",label:"Cyan",hex:"#00bcd4"},{id:"teal",label:"Teal",hex:"#009688"},{id:"green",label:"Green",hex:"#4caf50"},{id:"light-green",label:"Light green",hex:"#8bc34a"},{id:"lime",label:"Lime",hex:"#cddc39"},{id:"yellow",label:"Yellow",hex:"#ffeb3b"},{id:"amber",label:"Amber",hex:"#ffc107"},{id:"orange",label:"Orange",hex:"#ff9800"},{id:"deep-orange",label:"Deep orange",hex:"#ff5722"},{id:"brown",label:"Brown",hex:"#795548"},{id:"grey",label:"Grey",hex:"#9e9e9e"},{id:"blue-grey",label:"Blue grey",hex:"#607d8b"}];function br(t){if(t)return yr.find(n=>n.id===t)?.hex}function qs(t){let n=t.replace("#",""),e=parseInt(n.slice(0,2),16)/255,r=parseInt(n.slice(2,4),16)/255,i=parseInt(n.slice(4,6),16)/255,s=a=>a<=.03928?a/12.92:((a+.055)/1.055)**2.4;return .2126*s(e)+.7152*s(r)+.0722*s(i)>.5?"#000000":"#ffffff"}function Wt(t){let n=br(t);return n?`background:${n};color:${qs(n)}`:""}var Ut=y`
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
`;function Ue(t,n){return l`<span class="category-swatch" style=${Wt(t)}>
    ${n?l`<ha-icon icon=${n}></ha-icon>`:""}
  </span>`}function j(t){return t.kind==="house"?"house":`${t.kind}:${t.id}`}function Bt(t,n){return`${j(t)}\0${n}`}function Vi(t,n){if(!n||n.entity==null)return[...t];let e=Array.isArray(n.entity)?n.entity:[n.entity];if(e.length===0)return[...t];let r=new Set,i=!1;for(let s of e){if(!s||typeof s!="object")continue;let o=s.domain;if(o==null){i=!0;continue}if(Array.isArray(o))for(let a of o)typeof a=="string"&&r.add(a);else typeof o=="string"&&r.add(o)}return i||r.size===0?[...t]:t.filter(s=>{let o=s.indexOf(".");return o<0?!1:r.has(s.slice(0,o))})}function qt(t,n,e=[]){let r=t;if(!r?.entities)return[];let i=r.entities,s=r.devices??{},o=r.areas??{},a=n.kind==="area"?new Set([n.id]):n.kind==="floor"?new Set(Object.values(o).filter(h=>h.floor_id===n.id).map(h=>h.area_id)):null,c=h=>{let f=h.area_id??(h.device_id?s[h.device_id]?.area_id??null:null);return f==null?!1:a===null?!0:a.has(f)};return Object.values(i).filter(c).filter(h=>e.length===0||e.includes(h.entity_id.split(".")[0])).map(h=>h.entity_id).sort()}function ut(t){let{priority:n,pinned:e,shadowed_by:r,...i}=t;return i}function Ji(t,n){if(n<0||n>=t.length)return[];let e=new Set(t[n].entity_ids??[]),r=new Set;return t.forEach((i,s)=>{if(s!==n)for(let o of i.entity_ids??[])e.has(o)||r.add(o)}),[...r]}var wr={house:"mdi:home",floor:"mdi:layers",area:"mdi:texture-box"};function ht(t,n){return t.kind==="house"?wr.house:t.kind==="floor"?n?.floors?.[t.id]?.icon||wr.floor:n?.areas?.[t.id]?.icon||wr.area}var ae=class extends b{constructor(){super(...arguments);this.items=[];this._open=!1;this._onKeydown=e=>{e.key==="Escape"&&this._open&&(this._open=!1)}}_triggerLabel(){return this.label??d(this.hass,"ui.more_actions","More actions")}_select(e,r){r.stopPropagation(),this._open=!1,this.dispatchEvent(new CustomEvent("menu-action",{detail:{id:e},bubbles:!0,composed:!0}))}_renderItems(){return this.items.map(e=>l`
        ${e.dividerBefore?l`<div class="kebab-divider" role="separator"></div>`:S}
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
          `:S}
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this._onKeydown)}disconnectedCallback(){this.removeEventListener("keydown",this._onKeydown),super.disconnectedCallback()}render(){return this._renderMenu()}};ae.styles=y`
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
  `,u([m({attribute:!1})],ae.prototype,"items",2),u([m({attribute:!1})],ae.prototype,"hass",2),u([m()],ae.prototype,"label",2),u([g()],ae.prototype,"_open",2),ae=u([w("ambience-kebab-menu")],ae);var Be=class{constructor(n,e){this.host=n;this.onReorder=e;this.from=null;this.over=null;n.addController(this)}hostDisconnected(){this._reset()}start(n,e,r){this.from=n,e?.dataTransfer&&r&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setDragImage(r,16,16)),this.host.requestUpdate()}dragOver(n,e){this.from===null||e===this.from||(n.preventDefault(),this.over!==e&&(this.over=e,this.host.requestUpdate()))}drop(n){let e=this.from;this._reset(),!(e===null||e===n)&&this.onReorder(e,n)}end(){this._reset()}_reset(){let n=this.from!==null||this.over!==null;this.from=null,this.over=null,n&&this.host.requestUpdate()}};var Ks={light:"mdi:lightbulb",switch:"mdi:toggle-switch-variant",binary_sensor:"mdi:motion-sensor",sensor:"mdi:eye",person:"mdi:account",device_tracker:"mdi:account",climate:"mdi:thermostat",cover:"mdi:window-shutter",media_player:"mdi:cast",lock:"mdi:lock",fan:"mdi:fan",weather:"mdi:weather-partly-cloudy",input_boolean:"mdi:toggle-switch",event:"mdi:eye-check",script:"mdi:script-text",template:"mdi:code-braces"},Gs="mdi:eye";function J(t,n){let e=t?.states?.[n]?.attributes?.friendly_name;return typeof e=="string"&&e?e:n}function Ys(t,n){let e=t?.states?.[n]?.attributes?.icon;if(typeof e=="string"&&e)return e;let r=n.split(".")[0];return Ks[r]??Gs}function $r(t,n){let e=t?.states?.[n];return e&&customElements.get("ha-state-icon")?l`<ha-state-icon class="row-icon" .hass=${t} .stateObj=${e}></ha-state-icon>`:l`<ha-icon class="row-icon" icon=${Ys(t,n)}></ha-icon>`}var Qi=y`
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
`;function mt(t,n,e){if(n&&e){let r=e[n]?.fields?.[t];if(r&&typeof r=="object"){let i=r.name;if(typeof i=="string"&&i)return i}}return qe(t)}function Kt(t,n="New scene"){return t.name?.trim()?t.name:n}function ft(t,n,e){return n==null?d(e.hass,"ui.summary_any_paren","(any)"):t==="time_of_day"?Yt(n,e):t==="day"?Xs(n,e):t==="weather"?no(n,e):t==="sun"?so(n,e):t==="state"?Cr(n,e):t==="script"?Js(n,e):t==="people"?Qs(n,e):t==="template"?Vs(n,e):String(n)}function Vs(t,n={}){return t===null?d(n.hass,"ui.summary_any_paren","(any)"):typeof t!="object"||typeof t.template!="string"?String(t):t.template}function Js(t,n={}){if(t===null)return d(n.hass,"ui.summary_any_paren","(any)");if(typeof t!="object"||typeof t.script!="string")return String(t);let e=pt(n,t.script),r=t.args??{},i=Object.keys(r).sort();if(i.length===0)return e;let s=i.map(o=>`${Er(n.hass,t.script,o)}: ${ve(n.hass,r[o])}`).join(", ");return`${e} (${s})`}function Er(t,n,e){let r=n.replace(/^script\./,""),s=t?.services?.script?.[r]?.fields?.[e]?.name;return typeof s=="string"&&s?s:qe(e)}function pt(t,n){let r=t.hass?.states?.[n]?.attributes?.friendly_name;if(typeof r=="string"&&r)return r;let i=n.indexOf("."),s=i>=0?n.slice(i+1):n;return s.charAt(0).toUpperCase()+s.slice(1)}function Xi(t,n){return t==="home"?d(n.hass,"people_summary.home","Home"):pt(n,t)}function Qs(t,n={}){if(t==null)return d(n.hass,"ui.summary_any","any");let e=t.where??"home";if(Array.isArray(t.who)&&t.who.length===1){let o=pt(n,t.who[0]),c=t.quant==="nobody"!=!!t.negate?d(n.hass,"people_summary.is_not_at","is not at"):d(n.hass,"people_summary.is_at","is at"),h=`${o} ${c} ${Xi(e,n)}`;return t.for&&kr(t.for)?`${h} ${d(n.hass,"ui.for_prefix","for")} \u2265${Sr(t.for)}`:h}let r;if(Array.isArray(t.who)){let o=t.quant??"any",a=o==="any"?d(n.hass,"ui.people_mode_any","Any of:"):o==="everyone"?d(n.hass,"ui.people_mode_all","All of:"):d(n.hass,"ui.people_mode_none","None of:"),c=t.who.map(h=>pt(n,h)).join(", ");r=`${a} (${c})`}else{let o=t.quant??"everyone";r=o==="nobody"?d(n.hass,"ui.people_mode_nobody","Nobody"):o==="any"?d(n.hass,"ui.people_mode_anybody","Anybody"):d(n.hass,"ui.people_mode_everybody","Everybody")}let i=t.negate?d(n.hass,"people_summary.is_not_at","is not at"):d(n.hass,"people_summary.is_at","is at"),s=`${r} ${i} ${Xi(e,n)}`;return t.for&&kr(t.for)?`${s} ${d(n.hass,"ui.for_prefix","for")} \u2265${Sr(t.for)}`:s}function Xs(t,n={}){if(t===null)return d(n.hass,"day_summary.any","any");let e=t.include??[],r=t.exclude??[],i=e.length===0?d(n.hass,"day_summary.any_day","any day"):e.map(o=>Zi(o,n)).join(", ");if(r.length===0)return i;let s=d(n.hass,"day_summary.except","except");return`${i} (${s} ${r.map(o=>Zi(o,n)).join(", ")})`}function Zi(t,n){switch(t.kind){case"weekday":return t.days.map(e=>Rt(n.hass,e)).join("/");case"day_of_month":return`${d(n.hass,"day_summary.day_prefix","Day")} ${t.days}`;case"date":return`${je(n.hass,t.month)} ${t.day}`;case"date_range":return`${je(n.hass,t.from.month)} ${t.from.day} \u2192 ${je(n.hass,t.to.month)} ${t.to.day}`;case"last_day":return d(n.hass,"day_summary.last_day","Last day");case"workday":return d(n.hass,"day_summary.workday","Workday");case"holiday":return d(n.hass,"day_summary.holiday","Holiday");case"first_workday":return d(n.hass,"day_summary.first_workday","First workday");case"last_workday":return d(n.hass,"day_summary.last_workday","Last workday")}}var Zs={"<":"<","<=":"\u2264",">":">",">=":"\u2265"};function qe(t){return fe(t)}function eo(t){return typeof t=="string"?t:typeof t=="number"||typeof t=="boolean"?String(t):JSON.stringify(t)}var to=["entity_id","device_id","area_id","label_id","floor_id"],en=2;function ro(t){if(!t||typeof t!="object"||Array.isArray(t))return null;let n=t;if(!Object.keys(n).every(i=>to.includes(i)))return null;let e=n.entity_id,r=typeof e=="string"?[e]:Array.isArray(e)?e.filter(i=>typeof i=="string"):[];return r.length?r:null}function ve(t,n){let e=ro(n);if(!e)return eo(n);let r=e.slice(0,en).map(o=>pt({hass:t},o)),i=e.length-en;return`[${i>0?`${r.join(", ")} +${i} more`:r.join(", ")}]`}function Gt(t){if(!(!t||typeof t!="object")){for(let n of Object.values(t))if(n&&typeof n=="object"){let e=n.unit_of_measurement;if(typeof e=="string"&&e)return e}}}function io(t){return t.split(/[\s_-]+/).filter(n=>n!=="").map(n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()).join(" ")}function no(t,n={}){if(t===null)return d(n.hass,"ui.summary_any","any");let e=new Map((n.weatherGroups??[]).map(o=>[o.id,o.label])),r=(t.groups??[]).map(o=>e.get(o)??io(o)).join("/"),i=(t.thresholds??[]).map(o=>`${ot(n.hass,o.attribute)} ${Zs[o.op]??o.op} ${o.value}`).join(", "),s=[r,i].filter(o=>o!=="");return s.length===0?d(n.hass,"ui.summary_any","any"):s.join(", ")}function so(t,n={}){if(t===null)return d(n.hass,"ui.summary_any","any");let e=[],r=t.elevation;r&&(r.min!=null&&r.max!=null?e.push(`${r.min}\xB0\u2013${r.max}\xB0`):r.min!=null?e.push(`\u2265${r.min}\xB0`):r.max!=null&&e.push(`\u2264${r.max}\xB0`));let i=t.azimuth;if(i){i.sectors?.length&&e.push(i.sectors.join("/"));for(let s of i.ranges??[])e.push(`${s.from}\xB0\u2013${s.to}\xB0`)}return e.length===0?d(n.hass,"ui.summary_any","any"):e.join(", ")}function sn(t,n){return J(t.hass,n)}function on(t,n){return sn({hass:t},n)}function Cr(t,n={}){return t==null?d(n.hass,"ui.summary_any","any"):xr(t,n)}function tn(t,n,e){let r=K(n.hass,t.kind),s=t.kind!=="is"&&t.kind!=="is_not"?t.states[0]??"":t.states.join("/"),o=sn(n,t.entity_id),a=t.attribute?`${o}.${t.attribute}`:o,c=e?`${K(n.hass,"not")} `:"",h=`${a} ${r} ${c}${s}`;return t.for&&kr(t.for)?`${h} ${d(n.hass,"ui.for_prefix","for")} \u2265${Sr(t.for)}`:h}function xr(t,n){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<=")return tn(t,n,!1);if(t.kind==="and"||t.kind==="or"){let e=` ${K(n.hass,t.kind)} `;return t.items.map(r=>rn(r,n)).join(e)}if(t.kind==="not"){let e=t.item;return e.kind==="is"?tn(e,n,!0):`${K(n.hass,"not")} ${rn(e,n)}`}return""}function rn(t,n){return t.kind==="and"||t.kind==="or"?`(${xr(t,n)})`:xr(t,n)}function kr(t){return t.h>0||t.m>0||t.s>0}function Sr(t){let n=[];return t.h&&n.push(`${t.h}h`),t.m&&n.push(`${t.m}m`),t.s&&n.push(`${t.s}s`),n.length?n.join(" "):"0s"}function Yt(t,n){if(t===null)return d(n.hass,"ui.summary_any","any");let e=Array.isArray(t)?t:[t],r=n.periods?.custom??{};return e.map(i=>"period"in i?oe(n.hass,i.period,r):`${nn(i.from,n)} \u2192 ${nn(i.to,n)}`).join(", ")}function nn(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=Me(n.hass,t.anchor),r=e;if(t.offset_min!==0){let i=Math.abs(t.offset_min),s=i%60===0?`${i/60}${d(n.hass,"ui.unit_hour_abbr","h")}`:`${i}${d(n.hass,"ui.unit_min_abbr","m")}`;r=`${e}${t.offset_min<0?"-":"+"}${s}`}if(t.clamp){let i=t.clamp.dir==="not_before"?d(n.hass,"ui.clamp_not_before","not before"):d(n.hass,"ui.clamp_not_after","not after"),s=`${String(t.clamp.hh).padStart(2,"0")}:${String(t.clamp.mm).padStart(2,"0")}`;r=`${r} (${i} ${s})`}return r}function oo(t,n){let e=n.exposedActions?.find(r=>r.id===t.service);return e?.label?.trim()?e.label:Ot(n.hass,t.service)}function ao(t,n){let e=t.service.indexOf(".");return e>0?t.service.slice(0,e):d(n.hass,"ui.target_noun","target")}function an(t,n){let e=oo(t,n),r=ao(t,n),i=t.entity_ids.length,s;i===0?s=d(n.hass,"ui.no_targets","(no targets)"):i===1?s=`1 ${r}`:s=`${i} ${r}s`;let o=Object.entries(t.params).filter(([,a])=>a!=null&&a!=="").map(([a,c])=>`${mt(a,t.service,n.schemas)}: ${ve(n.hass,c)}`).join(", ");return o?`${e}: ${s}, ${o}`:`${e}: ${s}`}var z=class extends b{constructor(){super(...arguments);this.scenes=[];this.availableActions=[];this.schemas={};this.categories=[];this.filterCategory="";this._drag=new Be(this,(e,r)=>this._emit("reorder-scenes",{from:e,to:r}));this._expanded=new Set}_renderSectionHeader(e){return l`<div
      class="category-section-header"
      style=${Wt(e.color)}
    >
      ${e.icon?l`<ha-icon icon=${e.icon}></ha-icon>`:""}
      <span>${e.name}</span>
      <ambience-kebab-menu
        class="category-kebab"
        .hass=${this.hass}
        .items=${[{id:"run",label:d(this.hass,"ui.run","Run"),icon:"mdi:play"},{id:"traces",label:d(this.hass,"ui.view_traces","View traces"),icon:"mdi:transit-connection-variant"},{id:"simulate",label:d(this.hass,"ui.simulate","Simulate"),icon:"mdi:flask-outline"}]}
        @menu-action=${r=>this._onCategoryMenu(e,r.detail.id)}
      ></ambience-kebab-menu>
    </div>`}_sections(){let e=this.scenes.map((i,s)=>[s,i]);if(this.filterCategory!=="")return[{category:this.categories.find(i=>i.id===this.filterCategory),rows:e.filter(([,i])=>i.category===this.filterCategory)}];let r=new Map;for(let[i,s]of e){let o=r.get(s.category)??[];o.push([i,s]),r.set(s.category,o)}return[...r.entries()].map(([i,s])=>({category:this.categories.find(o=>o.id===i),rows:s})).sort((i,s)=>(i.category?.name??"").localeCompare(s.category?.name??""))}_emit(e,r){this.dispatchEvent(new CustomEvent(e,{detail:r,bubbles:!0,composed:!0}))}_priorityMap(){let e=this.conditions;return(!this._priorityOfCache||this._priorityOfCache.src!==e)&&(this._priorityOfCache={src:e,map:new Map((e??[]).map(r=>[r.name,r.priority]))}),this._priorityOfCache.map}_whenKeys(e){let r=this._priorityMap();return Object.keys(e.when).filter(i=>e.when[i]!=null).sort((i,s)=>(r.get(s)??-1/0)-(r.get(i)??-1/0))}_whenSummary(e){let r=this._whenKeys(e);return r.length===0?d(this.hass,"ui.summary_any","any"):r.map((i,s)=>{let o=q(this.hass,i),a=ft(i,e.when[i],{hass:this.hass,periods:this.periods,weatherGroups:this.weatherConfig?.groups});return l`${s===0?"":", "}<strong>${o}:</strong> ${a}`})}_whenStacked(e){let r=this._whenKeys(e);return r.length===0?l`<div class="condition-line">
        ${d(this.hass,"ui.summary_any","any")}
      </div>`:r.map(i=>{let s=q(this.hass,i),o=ft(i,e.when[i],{hass:this.hass,periods:this.periods,weatherGroups:this.weatherConfig?.groups});return l`<div class="condition-line">
        <strong>${s}:</strong> ${o}
      </div>`})}_actionCountLabel(e){let r=e.actions.length,i=r===1?d(this.hass,"ui.action_singular","action"):d(this.hass,"ui.action_plural","actions"),s=`${r} ${i}`;return r===0?`${d(this.hass,"ui.noop_prefix","NOOP")} - ${s}`:s}_toggleScene(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):r.add(e),this._expanded=r}_entityName(e){return J(this.hass,e)}_actionParamsString(e){return Object.entries(e.params).filter(([,r])=>r!=null&&r!=="").map(([r,i])=>`${mt(r,e.service,this.schemas)}: ${ve(this.hass,i)}`).join(", ")}_actionLabel(e){let r=this.availableActions.find(i=>i.id===e.service);return r?.label?.trim()?r.label:Ot(this.hass,e.service)}_onCategoryMenu(e,r){r==="run"?this._emit("apply-category",{categoryId:e.id}):r==="traces"?this._emit("show-traces",{category:e.id}):r==="simulate"&&this._emit("show-simulator",{category:e.id})}_onSceneMenu(e,r){r==="edit"?this._emit("edit-scene",{index:e}):r==="duplicate"?this._emit("duplicate-scene",{index:e}):r==="run"?this._emit("run-scene-actions",{index:e}):r==="delete"&&this._emit("delete-scene",{index:e})}_renderRow(e,r,i){let s=d(this.hass,"ui.unpin","Unpin (return to automatic order)"),o=r.enabled===!1,a=o?d(this.hass,"ui.enable_scene","Enable scene"):d(this.hass,"ui.disable_scene","Disable scene");return l`
      <li
        class="${this._drag.over===e?"drag-over ":""}${o?"disabled":""}"
        draggable="true"
        @dragstart=${()=>this._drag.start(e)}
        @dragover=${c=>this._drag.dragOver(c,e)}
        @drop=${()=>this._drag.drop(e)}
        @dragend=${()=>this._drag.end()}
      >
        <span class="lead">
          ${r.pinned?l`<button
                class="pin"
                title=${s}
                aria-label=${s}
                @click=${c=>{c.stopPropagation(),this._emit("unpin-scene",{index:e})}}
              >
                📌
              </button>`:l`<span
                class="handle"
                title=${d(this.hass,"ui.drag_to_reorder","Drag to reorder")}
                >⠿</span
              >`}
        </span>
        <span class="idx">${i}</span>
        <span class="warn-slot">
          ${r.shadowed_by!=null&&!o?l`<span
                class="shadow-warning"
                title=${d(this.hass,"ui.shadowed","Never fires \u2014 shadowed by an earlier scene.")}
                >⚠️</span
              >`:""}
        </span>
        <div class="body" @click=${()=>this._toggleScene(e)}>
          <div class="name">
            ${Kt(r,d(this.hass,"ui.scene_n","Scene {n}").replace("{n}",String(i)))}
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
                  ${r.actions.length===0?"":l`<div class="actions-detail">
                        ${r.actions.map(c=>{let h=this._actionParamsString(c),f=this._actionLabel(c),p=h?`${f} \xB7 ${h}`:f;return l`
                            <div class="actions-detail-item">
                              <div class="action-header">${p}</div>
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
          .label=${d(this.hass,"ui.scene_actions","Scene actions")}
          .items=${[{id:"edit",label:d(this.hass,"ui.edit","Edit"),icon:"mdi:pencil"},{id:"duplicate",label:d(this.hass,"ui.duplicate","Duplicate"),icon:"mdi:content-duplicate"},{id:"run",label:d(this.hass,"ui.run_actions","Run actions"),icon:"mdi:play"},{id:"delete",label:d(this.hass,"ui.title_delete","Delete"),icon:"mdi:delete",danger:!0,dividerBefore:!0}]}
          @menu-action=${c=>this._onSceneMenu(e,c.detail.id)}
        ></ambience-kebab-menu>
      </li>
    `}render(){if(this.scenes.length===0)return l`
        <p class="empty">
          ${d(this.hass,"ui.no_scenes_yet","No scenes yet.")}
        </p>
        <button class="add" @click=${()=>this._emit("add-scene",{})}>
          ${d(this.hass,"ui.add_scene","+ Add scene")}
        </button>
      `;let e=this._sections().filter(i=>i.rows.length>0),r=this.categories.length>0;return l`
      ${e.map(i=>l`
          <div class="category-section">
            ${r&&i.category?this._renderSectionHeader(i.category):""}
            <ul>
              ${i.rows.map(([s,o],a)=>this._renderRow(s,o,a+1))}
            </ul>
          </div>
        `)}
      <button class="add" @click=${()=>this._emit("add-scene",{})}>
        ${d(this.hass,"ui.add_scene","+ Add scene")}
      </button>
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
  `,u([m({attribute:!1})],z.prototype,"scenes",2),u([m({attribute:!1})],z.prototype,"periods",2),u([m({attribute:!1})],z.prototype,"weatherConfig",2),u([m({attribute:!1})],z.prototype,"hass",2),u([m({attribute:!1})],z.prototype,"conditions",2),u([m({attribute:!1})],z.prototype,"availableActions",2),u([m({attribute:!1})],z.prototype,"schemas",2),u([m({attribute:!1})],z.prototype,"categories",2),u([m({attribute:!1})],z.prototype,"filterCategory",2),u([g()],z.prototype,"_expanded",2),z=u([w("ambience-scenes-list")],z);function ln(t,n){let e=t.trim();if(e==="")return null;let r=Number(e);return Number.isNaN(r)?null:r<=0?n?0:null:Math.max(10,Math.round(r))}function dn(t){return ln(t,!1)}function cn(t){return ln(t,!0)}function un(t,n){return"reapply_seconds"in t?t.reapply_seconds??0:n}function A(t,n){t.dispatchEvent(new CustomEvent("value-changed",{detail:{value:n},bubbles:!0,composed:!0}))}var X=class extends b{constructor(){super(...arguments);this.entities=[];this.value=[];this.target=null;this.label=" "}_filteredEntities(){return Vi(this.entities,this.target)}connectedCallback(){super.connectedCallback(),me(this,this.hass)}_emit(e){A(this,e)}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let r=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this._filteredEntities()}}}],i=this.label;return l`
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
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};X.styles=y`
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
  `,u([m({attribute:!1})],X.prototype,"hass",2),u([m({attribute:!1})],X.prototype,"entities",2),u([m({attribute:!1})],X.prototype,"value",2),u([m({attribute:!1})],X.prototype,"target",2),u([m()],X.prototype,"label",2),X=u([w("ambience-target-picker")],X);var R=class extends b{constructor(){super(...arguments);this.entityIds=[];this.params={};this.excludeEntities=[];this._schema=void 0;this._schemaError=null;this._exposedMissing=!1;this._formSchema=[];this._perFieldSchemas={};this._schemaServiceId=null;this._onTargetChanged=e=>{e.stopPropagation(),this._emit("entity-ids-changed",{entityIds:e.detail.value})};this._onFieldInput=e=>r=>{r.stopPropagation();let i=r.target,s={...this.params,[e]:i.value};this._emit("params-changed",{params:s})};this._onHaFormChanged=e=>{e.stopPropagation(),this._emit("params-changed",{params:{...this.params,...e.detail.value}})}}connectedCallback(){super.connectedCallback(),me(this,this.hass)}willUpdate(e){if((e.has("exposed")&&e.get("exposed")?.id!==this.exposed?.id||e.has("hass")&&this._schema===void 0)&&this._loadSchema(),(e.has("exposed")||e.has("_schema"))&&(this._formSchema=this._buildFormSchema()),e.has("_formSchema")||e.has("_schema")||e.has("exposed")){let r={};for(let i of this._formSchema)r[i.name]=[i];this._perFieldSchemas=r}}async _loadSchema(){if(this.exposed===void 0&&this.hass){this._exposedMissing=!0,this._schema=null,this._schemaServiceId=null;return}let e=this.exposed?.id;if(!e||!this.hass){this._exposedMissing=!1,this._schema=void 0,this._schemaServiceId=null;return}this._exposedMissing=!1,this._schemaServiceId=e,this._schemaError=null,this._schema=void 0;try{let r=await _e(this.hass,e);if(this._schemaServiceId!==e)return;this._schema=r}catch(r){if(this._schemaServiceId!==e)return;this._schema=null,this._schemaError=r instanceof Error?r.message:String(r)}}_buildFormSchema(){let e=this._schema,r=this.exposed;if(!e||!r)return[];let i=new Set(r.visible_fields??[]),s=[];for(let[o,a]of Object.entries(e.fields))i.has(o)&&s.push({name:o,selector:a.selector??{text:{}},required:!!a.required,description:typeof a.description=="string"&&a.description?a.description:void 0});return s}updated(e){super.updated?.(e),e.has("_schema")&&this.dispatchEvent(new CustomEvent("target-mode-changed",{detail:{hasTarget:this.hasTarget()},bubbles:!0,composed:!0}))}_hasTarget(){let e=this._schema?.target??null;return!e||typeof e!="object"?!1:Object.keys(e).length>0}hasTarget(){return this._schema===void 0?!1:this._hasTarget()}_scopeEntities(){return!this.scope||!this.hass?[]:qt(this.hass,this.scope,[])}_renderTargetPicker(){if(!this._hasTarget())return"";let e=new Set(this.excludeEntities),r=this._scopeEntities().filter(o=>!e.has(o)),i=this._schema?.target??null,s=d(this.hass,"ui.target","Target");return l`
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
    `}_humanizeFieldLabel(e){let r=this._schema?.fields[e];return r?.name?r.name:qe(e)}_clearField(e){if(!(e in this.params))return;let r={...this.params};delete r[e],this._emit("params-changed",{params:r})}_extraParamKeys(){let e=new Set;for(let r of this._formSchema)e.add(r.name);for(let r of Object.keys(this.exposed?.defaults??{}))e.add(r);return Object.keys(this.params).filter(r=>!e.has(r))}_clearExtraParams(){let e=new Set(this._extraParamKeys());if(e.size===0)return;let r={};for(let[i,s]of Object.entries(this.params))e.has(i)||(r[i]=s);this._emit("params-changed",{params:r})}_fieldData(e){return e in this.params?{[e]:this.params[e]}:{}}_defaultHintSuffix(e){let r=this.exposed?.defaults??{};if(!(e.name in r))return"";let i=Gt(e.selector);return` (Default: ${ve(this.hass,r[e.name])}${i?` ${i}`:""})`}_hasUserOverride(e){return e in this.params}_renderExtraParamsNotice(){let e=this._extraParamKeys();if(e.length===0)return"";let r=e.join(", ");return l`
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
          ${e.map(i=>{let s=this._perFieldSchemas[i.name]??[i],o=this._fieldData(i.name),a=this._defaultHintSuffix(i);return l`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <span class="field-label">${this._humanizeFieldLabel(i.name)}${i.required?" *":""}</span>${a?l`<span class="field-default-hint">${a}</span>`:""}
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
                  .data=${o}
                  .computeLabel=${()=>""}
                  @value-changed=${this._onHaFormChanged}
                ></ha-form>
              </div>
            `})}
          ${r}
        </div>
      `:l`
      <div class="fields-form">
        ${e.map(i=>{let s=this._fieldData(i.name),o=i.name in s?String(s[i.name]??""):"",a=this._defaultHintSuffix(i);return l`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <label class="field-label">${this._humanizeFieldLabel(i.name)}${i.required?" *":""}</label>${a?l`<span class="field-default-hint">${a}</span>`:""}
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
                  .value=${o}
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
      `;if(this._schema===void 0)return l`<div>${d(this.hass,"ui.loading","Loading\u2026")}</div>`;let e=this._renderTargetPicker(),r=this._renderFieldsForm();return e===""&&r===""?l`<div class="no-params">${d(this.hass,"ui.action_no_parameters","This action has no configurable fields.")}</div>`:l`${e}${r}`}};R.styles=y`
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
  `,u([m({attribute:!1})],R.prototype,"hass",2),u([m({attribute:!1})],R.prototype,"scope",2),u([m({attribute:!1})],R.prototype,"exposed",2),u([m({attribute:!1})],R.prototype,"entityIds",2),u([m({attribute:!1})],R.prototype,"params",2),u([m({attribute:!1})],R.prototype,"excludeEntities",2),u([g()],R.prototype,"_schema",2),u([g()],R.prototype,"_schemaError",2),u([g()],R.prototype,"_exposedMissing",2),u([g()],R.prototype,"_formSchema",2),u([g()],R.prototype,"_perFieldSchemas",2),R=u([w("ambience-action-slot")],R);function Cn(t){return typeof t>"u"||t===null}function lo(t){return typeof t=="object"&&t!==null}function co(t){return Array.isArray(t)?t:Cn(t)?[]:[t]}function uo(t,n){var e,r,i,s;if(n)for(s=Object.keys(n),e=0,r=s.length;e<r;e+=1)i=s[e],t[i]=n[i];return t}function ho(t,n){var e="",r;for(r=0;r<n;r+=1)e+=t;return e}function po(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var mo=Cn,fo=lo,go=co,_o=ho,vo=po,yo=uo,D={isNothing:mo,isObject:fo,toArray:go,repeat:_o,isNegativeZero:vo,extend:yo};function Tn(t,n){var e="",r=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(e+='in "'+t.mark.name+'" '),e+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!n&&t.mark.snippet&&(e+=`

`+t.mark.snippet),r+" "+e):r}function _t(t,n){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=n,this.message=Tn(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}_t.prototype=Object.create(Error.prototype);_t.prototype.constructor=_t;_t.prototype.toString=function(n){return this.name+": "+Tn(this,n)};var U=_t;function Tr(t,n,e,r,i){var s="",o="",a=Math.floor(i/2)-1;return r-n>a&&(s=" ... ",n=r-a+s.length),e-r>a&&(o=" ...",e=r+a-o.length),{str:s+t.slice(n,e).replace(/\t/g,"\u2192")+o,pos:r-n+s.length}}function Lr(t,n){return D.repeat(" ",n-t.length)+t}function bo(t,n){if(n=Object.create(n||null),!t.buffer)return null;n.maxLength||(n.maxLength=79),typeof n.indent!="number"&&(n.indent=1),typeof n.linesBefore!="number"&&(n.linesBefore=3),typeof n.linesAfter!="number"&&(n.linesAfter=2);for(var e=/\r?\n|\r|\0/g,r=[0],i=[],s,o=-1;s=e.exec(t.buffer);)i.push(s.index),r.push(s.index+s[0].length),t.position<=s.index&&o<0&&(o=r.length-2);o<0&&(o=r.length-1);var a="",c,h,f=Math.min(t.line+n.linesAfter,i.length).toString().length,p=n.maxLength-(n.indent+f+3);for(c=1;c<=n.linesBefore&&!(o-c<0);c++)h=Tr(t.buffer,r[o-c],i[o-c],t.position-(r[o]-r[o-c]),p),a=D.repeat(" ",n.indent)+Lr((t.line-c+1).toString(),f)+" | "+h.str+`
`+a;for(h=Tr(t.buffer,r[o],i[o],t.position,p),a+=D.repeat(" ",n.indent)+Lr((t.line+1).toString(),f)+" | "+h.str+`
`,a+=D.repeat("-",n.indent+f+3+h.pos)+`^
`,c=1;c<=n.linesAfter&&!(o+c>=i.length);c++)h=Tr(t.buffer,r[o+c],i[o+c],t.position-(r[o]-r[o+c]),p),a+=D.repeat(" ",n.indent)+Lr((t.line+c+1).toString(),f)+" | "+h.str+`
`;return a.replace(/\n$/,"")}var wo=bo,$o=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],xo=["scalar","sequence","mapping"];function ko(t){var n={};return t!==null&&Object.keys(t).forEach(function(e){t[e].forEach(function(r){n[String(r)]=e})}),n}function So(t,n){if(n=n||{},Object.keys(n).forEach(function(e){if($o.indexOf(e)===-1)throw new U('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.options=n,this.tag=t,this.kind=n.kind||null,this.resolve=n.resolve||function(){return!0},this.construct=n.construct||function(e){return e},this.instanceOf=n.instanceOf||null,this.predicate=n.predicate||null,this.represent=n.represent||null,this.representName=n.representName||null,this.defaultStyle=n.defaultStyle||null,this.multi=n.multi||!1,this.styleAliases=ko(n.styleAliases||null),xo.indexOf(this.kind)===-1)throw new U('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var F=So;function hn(t,n){var e=[];return t[n].forEach(function(r){var i=e.length;e.forEach(function(s,o){s.tag===r.tag&&s.kind===r.kind&&s.multi===r.multi&&(i=o)}),e[i]=r}),e}function Eo(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},n,e;function r(i){i.multi?(t.multi[i.kind].push(i),t.multi.fallback.push(i)):t[i.kind][i.tag]=t.fallback[i.tag]=i}for(n=0,e=arguments.length;n<e;n+=1)arguments[n].forEach(r);return t}function Hr(t){return this.extend(t)}Hr.prototype.extend=function(n){var e=[],r=[];if(n instanceof F)r.push(n);else if(Array.isArray(n))r=r.concat(n);else if(n&&(Array.isArray(n.implicit)||Array.isArray(n.explicit)))n.implicit&&(e=e.concat(n.implicit)),n.explicit&&(r=r.concat(n.explicit));else throw new U("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.forEach(function(s){if(!(s instanceof F))throw new U("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new U("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new U("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),r.forEach(function(s){if(!(s instanceof F))throw new U("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var i=Object.create(Hr.prototype);return i.implicit=(this.implicit||[]).concat(e),i.explicit=(this.explicit||[]).concat(r),i.compiledImplicit=hn(i,"implicit"),i.compiledExplicit=hn(i,"explicit"),i.compiledTypeMap=Eo(i.compiledImplicit,i.compiledExplicit),i};var Co=Hr,To=new F("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),Lo=new F("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),Ao=new F("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),Ho=new Co({explicit:[To,Lo,Ao]});function No(t){if(t===null)return!0;var n=t.length;return n===1&&t==="~"||n===4&&(t==="null"||t==="Null"||t==="NULL")}function Po(){return null}function Do(t){return t===null}var Oo=new F("tag:yaml.org,2002:null",{kind:"scalar",resolve:No,construct:Po,predicate:Do,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function Ro(t){if(t===null)return!1;var n=t.length;return n===4&&(t==="true"||t==="True"||t==="TRUE")||n===5&&(t==="false"||t==="False"||t==="FALSE")}function Fo(t){return t==="true"||t==="True"||t==="TRUE"}function Io(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var Mo=new F("tag:yaml.org,2002:bool",{kind:"scalar",resolve:Ro,construct:Fo,predicate:Io,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function jo(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function zo(t){return 48<=t&&t<=55}function Wo(t){return 48<=t&&t<=57}function Uo(t){if(t===null)return!1;var n=t.length,e=0,r=!1,i;if(!n)return!1;if(i=t[e],(i==="-"||i==="+")&&(i=t[++e]),i==="0"){if(e+1===n)return!0;if(i=t[++e],i==="b"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(i!=="0"&&i!=="1")return!1;r=!0}return r&&i!=="_"}if(i==="x"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(!jo(t.charCodeAt(e)))return!1;r=!0}return r&&i!=="_"}if(i==="o"){for(e++;e<n;e++)if(i=t[e],i!=="_"){if(!zo(t.charCodeAt(e)))return!1;r=!0}return r&&i!=="_"}}if(i==="_")return!1;for(;e<n;e++)if(i=t[e],i!=="_"){if(!Wo(t.charCodeAt(e)))return!1;r=!0}return!(!r||i==="_")}function Bo(t){var n=t,e=1,r;if(n.indexOf("_")!==-1&&(n=n.replace(/_/g,"")),r=n[0],(r==="-"||r==="+")&&(r==="-"&&(e=-1),n=n.slice(1),r=n[0]),n==="0")return 0;if(r==="0"){if(n[1]==="b")return e*parseInt(n.slice(2),2);if(n[1]==="x")return e*parseInt(n.slice(2),16);if(n[1]==="o")return e*parseInt(n.slice(2),8)}return e*parseInt(n,10)}function qo(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!D.isNegativeZero(t)}var Ko=new F("tag:yaml.org,2002:int",{kind:"scalar",resolve:Uo,construct:Bo,predicate:qo,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Go=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Yo(t){return!(t===null||!Go.test(t)||t[t.length-1]==="_")}function Vo(t){var n,e;return n=t.replace(/_/g,"").toLowerCase(),e=n[0]==="-"?-1:1,"+-".indexOf(n[0])>=0&&(n=n.slice(1)),n===".inf"?e===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:n===".nan"?NaN:e*parseFloat(n,10)}var Jo=/^[-+]?[0-9]+e/;function Qo(t,n){var e;if(isNaN(t))switch(n){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(n){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(n){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(D.isNegativeZero(t))return"-0.0";return e=t.toString(10),Jo.test(e)?e.replace("e",".e"):e}function Xo(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||D.isNegativeZero(t))}var Zo=new F("tag:yaml.org,2002:float",{kind:"scalar",resolve:Yo,construct:Vo,predicate:Xo,represent:Qo,defaultStyle:"lowercase"}),ea=Ho.extend({implicit:[Oo,Mo,Ko,Zo]}),ta=ea,Ln=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),An=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function ra(t){return t===null?!1:Ln.exec(t)!==null||An.exec(t)!==null}function ia(t){var n,e,r,i,s,o,a,c=0,h=null,f,p,_;if(n=Ln.exec(t),n===null&&(n=An.exec(t)),n===null)throw new Error("Date resolve error");if(e=+n[1],r=+n[2]-1,i=+n[3],!n[4])return new Date(Date.UTC(e,r,i));if(s=+n[4],o=+n[5],a=+n[6],n[7]){for(c=n[7].slice(0,3);c.length<3;)c+="0";c=+c}return n[9]&&(f=+n[10],p=+(n[11]||0),h=(f*60+p)*6e4,n[9]==="-"&&(h=-h)),_=new Date(Date.UTC(e,r,i,s,o,a,c)),h&&_.setTime(_.getTime()-h),_}function na(t){return t.toISOString()}var sa=new F("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:ra,construct:ia,instanceOf:Date,represent:na});function oa(t){return t==="<<"||t===null}var aa=new F("tag:yaml.org,2002:merge",{kind:"scalar",resolve:oa}),Rr=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function la(t){if(t===null)return!1;var n,e,r=0,i=t.length,s=Rr;for(e=0;e<i;e++)if(n=s.indexOf(t.charAt(e)),!(n>64)){if(n<0)return!1;r+=6}return r%8===0}function da(t){var n,e,r=t.replace(/[\r\n=]/g,""),i=r.length,s=Rr,o=0,a=[];for(n=0;n<i;n++)n%4===0&&n&&(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)),o=o<<6|s.indexOf(r.charAt(n));return e=i%4*6,e===0?(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)):e===18?(a.push(o>>10&255),a.push(o>>2&255)):e===12&&a.push(o>>4&255),new Uint8Array(a)}function ca(t){var n="",e=0,r,i,s=t.length,o=Rr;for(r=0;r<s;r++)r%3===0&&r&&(n+=o[e>>18&63],n+=o[e>>12&63],n+=o[e>>6&63],n+=o[e&63]),e=(e<<8)+t[r];return i=s%3,i===0?(n+=o[e>>18&63],n+=o[e>>12&63],n+=o[e>>6&63],n+=o[e&63]):i===2?(n+=o[e>>10&63],n+=o[e>>4&63],n+=o[e<<2&63],n+=o[64]):i===1&&(n+=o[e>>2&63],n+=o[e<<4&63],n+=o[64],n+=o[64]),n}function ua(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var ha=new F("tag:yaml.org,2002:binary",{kind:"scalar",resolve:la,construct:da,predicate:ua,represent:ca}),pa=Object.prototype.hasOwnProperty,ma=Object.prototype.toString;function fa(t){if(t===null)return!0;var n=[],e,r,i,s,o,a=t;for(e=0,r=a.length;e<r;e+=1){if(i=a[e],o=!1,ma.call(i)!=="[object Object]")return!1;for(s in i)if(pa.call(i,s))if(!o)o=!0;else return!1;if(!o)return!1;if(n.indexOf(s)===-1)n.push(s);else return!1}return!0}function ga(t){return t!==null?t:[]}var _a=new F("tag:yaml.org,2002:omap",{kind:"sequence",resolve:fa,construct:ga}),va=Object.prototype.toString;function ya(t){if(t===null)return!0;var n,e,r,i,s,o=t;for(s=new Array(o.length),n=0,e=o.length;n<e;n+=1){if(r=o[n],va.call(r)!=="[object Object]"||(i=Object.keys(r),i.length!==1))return!1;s[n]=[i[0],r[i[0]]]}return!0}function ba(t){if(t===null)return[];var n,e,r,i,s,o=t;for(s=new Array(o.length),n=0,e=o.length;n<e;n+=1)r=o[n],i=Object.keys(r),s[n]=[i[0],r[i[0]]];return s}var wa=new F("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:ya,construct:ba}),$a=Object.prototype.hasOwnProperty;function xa(t){if(t===null)return!0;var n,e=t;for(n in e)if($a.call(e,n)&&e[n]!==null)return!1;return!0}function ka(t){return t!==null?t:{}}var Sa=new F("tag:yaml.org,2002:set",{kind:"mapping",resolve:xa,construct:ka}),Hn=ta.extend({implicit:[sa,aa],explicit:[ha,_a,wa,Sa]}),be=Object.prototype.hasOwnProperty,Vt=1,Nn=2,Pn=3,Jt=4,Ar=1,Ea=2,pn=3,Ca=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Ta=/[\x85\u2028\u2029]/,La=/[,\[\]\{\}]/,Dn=/^(?:!|!!|![a-z\-]+!)$/i,On=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function mn(t){return Object.prototype.toString.call(t)}function Z(t){return t===10||t===13}function De(t){return t===9||t===32}function B(t){return t===9||t===32||t===10||t===13}function Ge(t){return t===44||t===91||t===93||t===123||t===125}function Aa(t){var n;return 48<=t&&t<=57?t-48:(n=t|32,97<=n&&n<=102?n-97+10:-1)}function Ha(t){return t===120?2:t===117?4:t===85?8:0}function Na(t){return 48<=t&&t<=57?t-48:-1}function fn(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"\x85":t===95?"\xA0":t===76?"\u2028":t===80?"\u2029":""}function Pa(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function Rn(t,n,e){n==="__proto__"?Object.defineProperty(t,n,{configurable:!0,enumerable:!0,writable:!0,value:e}):t[n]=e}var Fn=new Array(256),In=new Array(256);for(Pe=0;Pe<256;Pe++)Fn[Pe]=fn(Pe)?1:0,In[Pe]=fn(Pe);var Pe;function Da(t,n){this.input=t,this.filename=n.filename||null,this.schema=n.schema||Hn,this.onWarning=n.onWarning||null,this.legacy=n.legacy||!1,this.json=n.json||!1,this.listener=n.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Mn(t,n){var e={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return e.snippet=wo(e),new U(n,e)}function $(t,n){throw Mn(t,n)}function Qt(t,n){t.onWarning&&t.onWarning.call(null,Mn(t,n))}var gn={YAML:function(n,e,r){var i,s,o;n.version!==null&&$(n,"duplication of %YAML directive"),r.length!==1&&$(n,"YAML directive accepts exactly one argument"),i=/^([0-9]+)\.([0-9]+)$/.exec(r[0]),i===null&&$(n,"ill-formed argument of the YAML directive"),s=parseInt(i[1],10),o=parseInt(i[2],10),s!==1&&$(n,"unacceptable YAML version of the document"),n.version=r[0],n.checkLineBreaks=o<2,o!==1&&o!==2&&Qt(n,"unsupported YAML version of the document")},TAG:function(n,e,r){var i,s;r.length!==2&&$(n,"TAG directive accepts exactly two arguments"),i=r[0],s=r[1],Dn.test(i)||$(n,"ill-formed tag handle (first argument) of the TAG directive"),be.call(n.tagMap,i)&&$(n,'there is a previously declared suffix for "'+i+'" tag handle'),On.test(s)||$(n,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{$(n,"tag prefix is malformed: "+s)}n.tagMap[i]=s}};function ye(t,n,e,r){var i,s,o,a;if(n<e){if(a=t.input.slice(n,e),r)for(i=0,s=a.length;i<s;i+=1)o=a.charCodeAt(i),o===9||32<=o&&o<=1114111||$(t,"expected valid JSON character");else Ca.test(a)&&$(t,"the stream contains non-printable characters");t.result+=a}}function _n(t,n,e,r){var i,s,o,a;for(D.isObject(e)||$(t,"cannot merge mappings; the provided source object is unacceptable"),i=Object.keys(e),o=0,a=i.length;o<a;o+=1)s=i[o],be.call(n,s)||(Rn(n,s,e[s]),r[s]=!0)}function Ye(t,n,e,r,i,s,o,a,c){var h,f;if(Array.isArray(i))for(i=Array.prototype.slice.call(i),h=0,f=i.length;h<f;h+=1)Array.isArray(i[h])&&$(t,"nested arrays are not supported inside keys"),typeof i=="object"&&mn(i[h])==="[object Object]"&&(i[h]="[object Object]");if(typeof i=="object"&&mn(i)==="[object Object]"&&(i="[object Object]"),i=String(i),n===null&&(n={}),r==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(h=0,f=s.length;h<f;h+=1)_n(t,n,s[h],e);else _n(t,n,s,e);else!t.json&&!be.call(e,i)&&be.call(n,i)&&(t.line=o||t.line,t.lineStart=a||t.lineStart,t.position=c||t.position,$(t,"duplicated mapping key")),Rn(n,i,s),delete e[i];return n}function Fr(t){var n;n=t.input.charCodeAt(t.position),n===10?t.position++:n===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):$(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function N(t,n,e){for(var r=0,i=t.input.charCodeAt(t.position);i!==0;){for(;De(i);)i===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),i=t.input.charCodeAt(++t.position);if(n&&i===35)do i=t.input.charCodeAt(++t.position);while(i!==10&&i!==13&&i!==0);if(Z(i))for(Fr(t),i=t.input.charCodeAt(t.position),r++,t.lineIndent=0;i===32;)t.lineIndent++,i=t.input.charCodeAt(++t.position);else break}return e!==-1&&r!==0&&t.lineIndent<e&&Qt(t,"deficient indentation"),r}function er(t){var n=t.position,e;return e=t.input.charCodeAt(n),!!((e===45||e===46)&&e===t.input.charCodeAt(n+1)&&e===t.input.charCodeAt(n+2)&&(n+=3,e=t.input.charCodeAt(n),e===0||B(e)))}function Ir(t,n){n===1?t.result+=" ":n>1&&(t.result+=D.repeat(`
`,n-1))}function Oa(t,n,e){var r,i,s,o,a,c,h,f,p=t.kind,_=t.result,v;if(v=t.input.charCodeAt(t.position),B(v)||Ge(v)||v===35||v===38||v===42||v===33||v===124||v===62||v===39||v===34||v===37||v===64||v===96||(v===63||v===45)&&(i=t.input.charCodeAt(t.position+1),B(i)||e&&Ge(i)))return!1;for(t.kind="scalar",t.result="",s=o=t.position,a=!1;v!==0;){if(v===58){if(i=t.input.charCodeAt(t.position+1),B(i)||e&&Ge(i))break}else if(v===35){if(r=t.input.charCodeAt(t.position-1),B(r))break}else{if(t.position===t.lineStart&&er(t)||e&&Ge(v))break;if(Z(v))if(c=t.line,h=t.lineStart,f=t.lineIndent,N(t,!1,-1),t.lineIndent>=n){a=!0,v=t.input.charCodeAt(t.position);continue}else{t.position=o,t.line=c,t.lineStart=h,t.lineIndent=f;break}}a&&(ye(t,s,o,!1),Ir(t,t.line-c),s=o=t.position,a=!1),De(v)||(o=t.position+1),v=t.input.charCodeAt(++t.position)}return ye(t,s,o,!1),t.result?!0:(t.kind=p,t.result=_,!1)}function Ra(t,n){var e,r,i;if(e=t.input.charCodeAt(t.position),e!==39)return!1;for(t.kind="scalar",t.result="",t.position++,r=i=t.position;(e=t.input.charCodeAt(t.position))!==0;)if(e===39)if(ye(t,r,t.position,!0),e=t.input.charCodeAt(++t.position),e===39)r=t.position,t.position++,i=t.position;else return!0;else Z(e)?(ye(t,r,i,!0),Ir(t,N(t,!1,n)),r=i=t.position):t.position===t.lineStart&&er(t)?$(t,"unexpected end of the document within a single quoted scalar"):(t.position++,i=t.position);$(t,"unexpected end of the stream within a single quoted scalar")}function Fa(t,n){var e,r,i,s,o,a;if(a=t.input.charCodeAt(t.position),a!==34)return!1;for(t.kind="scalar",t.result="",t.position++,e=r=t.position;(a=t.input.charCodeAt(t.position))!==0;){if(a===34)return ye(t,e,t.position,!0),t.position++,!0;if(a===92){if(ye(t,e,t.position,!0),a=t.input.charCodeAt(++t.position),Z(a))N(t,!1,n);else if(a<256&&Fn[a])t.result+=In[a],t.position++;else if((o=Ha(a))>0){for(i=o,s=0;i>0;i--)a=t.input.charCodeAt(++t.position),(o=Aa(a))>=0?s=(s<<4)+o:$(t,"expected hexadecimal character");t.result+=Pa(s),t.position++}else $(t,"unknown escape sequence");e=r=t.position}else Z(a)?(ye(t,e,r,!0),Ir(t,N(t,!1,n)),e=r=t.position):t.position===t.lineStart&&er(t)?$(t,"unexpected end of the document within a double quoted scalar"):(t.position++,r=t.position)}$(t,"unexpected end of the stream within a double quoted scalar")}function Ia(t,n){var e=!0,r,i,s,o=t.tag,a,c=t.anchor,h,f,p,_,v,x=Object.create(null),k,L,W,C;if(C=t.input.charCodeAt(t.position),C===91)f=93,v=!1,a=[];else if(C===123)f=125,v=!0,a={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=a),C=t.input.charCodeAt(++t.position);C!==0;){if(N(t,!0,n),C=t.input.charCodeAt(t.position),C===f)return t.position++,t.tag=o,t.anchor=c,t.kind=v?"mapping":"sequence",t.result=a,!0;e?C===44&&$(t,"expected the node content, but found ','"):$(t,"missed comma between flow collection entries"),L=k=W=null,p=_=!1,C===63&&(h=t.input.charCodeAt(t.position+1),B(h)&&(p=_=!0,t.position++,N(t,!0,n))),r=t.line,i=t.lineStart,s=t.position,Ve(t,n,Vt,!1,!0),L=t.tag,k=t.result,N(t,!0,n),C=t.input.charCodeAt(t.position),(_||t.line===r)&&C===58&&(p=!0,C=t.input.charCodeAt(++t.position),N(t,!0,n),Ve(t,n,Vt,!1,!0),W=t.result),v?Ye(t,a,x,L,k,W,r,i,s):p?a.push(Ye(t,null,x,L,k,W,r,i,s)):a.push(k),N(t,!0,n),C=t.input.charCodeAt(t.position),C===44?(e=!0,C=t.input.charCodeAt(++t.position)):e=!1}$(t,"unexpected end of the stream within a flow collection")}function Ma(t,n){var e,r,i=Ar,s=!1,o=!1,a=n,c=0,h=!1,f,p;if(p=t.input.charCodeAt(t.position),p===124)r=!1;else if(p===62)r=!0;else return!1;for(t.kind="scalar",t.result="";p!==0;)if(p=t.input.charCodeAt(++t.position),p===43||p===45)Ar===i?i=p===43?pn:Ea:$(t,"repeat of a chomping mode identifier");else if((f=Na(p))>=0)f===0?$(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):o?$(t,"repeat of an indentation width identifier"):(a=n+f-1,o=!0);else break;if(De(p)){do p=t.input.charCodeAt(++t.position);while(De(p));if(p===35)do p=t.input.charCodeAt(++t.position);while(!Z(p)&&p!==0)}for(;p!==0;){for(Fr(t),t.lineIndent=0,p=t.input.charCodeAt(t.position);(!o||t.lineIndent<a)&&p===32;)t.lineIndent++,p=t.input.charCodeAt(++t.position);if(!o&&t.lineIndent>a&&(a=t.lineIndent),Z(p)){c++;continue}if(t.lineIndent<a){i===pn?t.result+=D.repeat(`
`,s?1+c:c):i===Ar&&s&&(t.result+=`
`);break}for(r?De(p)?(h=!0,t.result+=D.repeat(`
`,s?1+c:c)):h?(h=!1,t.result+=D.repeat(`
`,c+1)):c===0?s&&(t.result+=" "):t.result+=D.repeat(`
`,c):t.result+=D.repeat(`
`,s?1+c:c),s=!0,o=!0,c=0,e=t.position;!Z(p)&&p!==0;)p=t.input.charCodeAt(++t.position);ye(t,e,t.position,!1)}return!0}function vn(t,n){var e,r=t.tag,i=t.anchor,s=[],o,a=!1,c;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=s),c=t.input.charCodeAt(t.position);c!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,$(t,"tab characters must not be used in indentation")),!(c!==45||(o=t.input.charCodeAt(t.position+1),!B(o))));){if(a=!0,t.position++,N(t,!0,-1)&&t.lineIndent<=n){s.push(null),c=t.input.charCodeAt(t.position);continue}if(e=t.line,Ve(t,n,Pn,!1,!0),s.push(t.result),N(t,!0,-1),c=t.input.charCodeAt(t.position),(t.line===e||t.lineIndent>n)&&c!==0)$(t,"bad indentation of a sequence entry");else if(t.lineIndent<n)break}return a?(t.tag=r,t.anchor=i,t.kind="sequence",t.result=s,!0):!1}function ja(t,n,e){var r,i,s,o,a,c,h=t.tag,f=t.anchor,p={},_=Object.create(null),v=null,x=null,k=null,L=!1,W=!1,C;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=p),C=t.input.charCodeAt(t.position);C!==0;){if(!L&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,$(t,"tab characters must not be used in indentation")),r=t.input.charCodeAt(t.position+1),s=t.line,(C===63||C===58)&&B(r))C===63?(L&&(Ye(t,p,_,v,x,null,o,a,c),v=x=k=null),W=!0,L=!0,i=!0):L?(L=!1,i=!0):$(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,C=r;else{if(o=t.line,a=t.lineStart,c=t.position,!Ve(t,e,Nn,!1,!0))break;if(t.line===s){for(C=t.input.charCodeAt(t.position);De(C);)C=t.input.charCodeAt(++t.position);if(C===58)C=t.input.charCodeAt(++t.position),B(C)||$(t,"a whitespace character is expected after the key-value separator within a block mapping"),L&&(Ye(t,p,_,v,x,null,o,a,c),v=x=k=null),W=!0,L=!1,i=!1,v=t.tag,x=t.result;else if(W)$(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=h,t.anchor=f,!0}else if(W)$(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=h,t.anchor=f,!0}if((t.line===s||t.lineIndent>n)&&(L&&(o=t.line,a=t.lineStart,c=t.position),Ve(t,n,Jt,!0,i)&&(L?x=t.result:k=t.result),L||(Ye(t,p,_,v,x,k,o,a,c),v=x=k=null),N(t,!0,-1),C=t.input.charCodeAt(t.position)),(t.line===s||t.lineIndent>n)&&C!==0)$(t,"bad indentation of a mapping entry");else if(t.lineIndent<n)break}return L&&Ye(t,p,_,v,x,null,o,a,c),W&&(t.tag=h,t.anchor=f,t.kind="mapping",t.result=p),W}function za(t){var n,e=!1,r=!1,i,s,o;if(o=t.input.charCodeAt(t.position),o!==33)return!1;if(t.tag!==null&&$(t,"duplication of a tag property"),o=t.input.charCodeAt(++t.position),o===60?(e=!0,o=t.input.charCodeAt(++t.position)):o===33?(r=!0,i="!!",o=t.input.charCodeAt(++t.position)):i="!",n=t.position,e){do o=t.input.charCodeAt(++t.position);while(o!==0&&o!==62);t.position<t.length?(s=t.input.slice(n,t.position),o=t.input.charCodeAt(++t.position)):$(t,"unexpected end of the stream within a verbatim tag")}else{for(;o!==0&&!B(o);)o===33&&(r?$(t,"tag suffix cannot contain exclamation marks"):(i=t.input.slice(n-1,t.position+1),Dn.test(i)||$(t,"named tag handle cannot contain such characters"),r=!0,n=t.position+1)),o=t.input.charCodeAt(++t.position);s=t.input.slice(n,t.position),La.test(s)&&$(t,"tag suffix cannot contain flow indicator characters")}s&&!On.test(s)&&$(t,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{$(t,"tag name is malformed: "+s)}return e?t.tag=s:be.call(t.tagMap,i)?t.tag=t.tagMap[i]+s:i==="!"?t.tag="!"+s:i==="!!"?t.tag="tag:yaml.org,2002:"+s:$(t,'undeclared tag handle "'+i+'"'),!0}function Wa(t){var n,e;if(e=t.input.charCodeAt(t.position),e!==38)return!1;for(t.anchor!==null&&$(t,"duplication of an anchor property"),e=t.input.charCodeAt(++t.position),n=t.position;e!==0&&!B(e)&&!Ge(e);)e=t.input.charCodeAt(++t.position);return t.position===n&&$(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(n,t.position),!0}function Ua(t){var n,e,r;if(r=t.input.charCodeAt(t.position),r!==42)return!1;for(r=t.input.charCodeAt(++t.position),n=t.position;r!==0&&!B(r)&&!Ge(r);)r=t.input.charCodeAt(++t.position);return t.position===n&&$(t,"name of an alias node must contain at least one character"),e=t.input.slice(n,t.position),be.call(t.anchorMap,e)||$(t,'unidentified alias "'+e+'"'),t.result=t.anchorMap[e],N(t,!0,-1),!0}function Ve(t,n,e,r,i){var s,o,a,c=1,h=!1,f=!1,p,_,v,x,k,L;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,s=o=a=Jt===e||Pn===e,r&&N(t,!0,-1)&&(h=!0,t.lineIndent>n?c=1:t.lineIndent===n?c=0:t.lineIndent<n&&(c=-1)),c===1)for(;za(t)||Wa(t);)N(t,!0,-1)?(h=!0,a=s,t.lineIndent>n?c=1:t.lineIndent===n?c=0:t.lineIndent<n&&(c=-1)):a=!1;if(a&&(a=h||i),(c===1||Jt===e)&&(Vt===e||Nn===e?k=n:k=n+1,L=t.position-t.lineStart,c===1?a&&(vn(t,L)||ja(t,L,k))||Ia(t,k)?f=!0:(o&&Ma(t,k)||Ra(t,k)||Fa(t,k)?f=!0:Ua(t)?(f=!0,(t.tag!==null||t.anchor!==null)&&$(t,"alias node should not have any properties")):Oa(t,k,Vt===e)&&(f=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):c===0&&(f=a&&vn(t,L))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&$(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),p=0,_=t.implicitTypes.length;p<_;p+=1)if(x=t.implicitTypes[p],x.resolve(t.result)){t.result=x.construct(t.result),t.tag=x.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(be.call(t.typeMap[t.kind||"fallback"],t.tag))x=t.typeMap[t.kind||"fallback"][t.tag];else for(x=null,v=t.typeMap.multi[t.kind||"fallback"],p=0,_=v.length;p<_;p+=1)if(t.tag.slice(0,v[p].tag.length)===v[p].tag){x=v[p];break}x||$(t,"unknown tag !<"+t.tag+">"),t.result!==null&&x.kind!==t.kind&&$(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+x.kind+'", not "'+t.kind+'"'),x.resolve(t.result,t.tag)?(t.result=x.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):$(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||f}function Ba(t){var n=t.position,e,r,i,s=!1,o;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(o=t.input.charCodeAt(t.position))!==0&&(N(t,!0,-1),o=t.input.charCodeAt(t.position),!(t.lineIndent>0||o!==37));){for(s=!0,o=t.input.charCodeAt(++t.position),e=t.position;o!==0&&!B(o);)o=t.input.charCodeAt(++t.position);for(r=t.input.slice(e,t.position),i=[],r.length<1&&$(t,"directive name must not be less than one character in length");o!==0;){for(;De(o);)o=t.input.charCodeAt(++t.position);if(o===35){do o=t.input.charCodeAt(++t.position);while(o!==0&&!Z(o));break}if(Z(o))break;for(e=t.position;o!==0&&!B(o);)o=t.input.charCodeAt(++t.position);i.push(t.input.slice(e,t.position))}o!==0&&Fr(t),be.call(gn,r)?gn[r](t,r,i):Qt(t,'unknown document directive "'+r+'"')}if(N(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,N(t,!0,-1)):s&&$(t,"directives end mark is expected"),Ve(t,t.lineIndent-1,Jt,!1,!0),N(t,!0,-1),t.checkLineBreaks&&Ta.test(t.input.slice(n,t.position))&&Qt(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&er(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,N(t,!0,-1));return}if(t.position<t.length-1)$(t,"end of the stream or a document separator is expected");else return}function jn(t,n){t=String(t),n=n||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var e=new Da(t,n),r=t.indexOf("\0");for(r!==-1&&(e.position=r,$(e,"null byte is not allowed in input")),e.input+="\0";e.input.charCodeAt(e.position)===32;)e.lineIndent+=1,e.position+=1;for(;e.position<e.length-1;)Ba(e);return e.documents}function qa(t,n,e){n!==null&&typeof n=="object"&&typeof e>"u"&&(e=n,n=null);var r=jn(t,e);if(typeof n!="function")return r;for(var i=0,s=r.length;i<s;i+=1)n(r[i])}function Ka(t,n){var e=jn(t,n);if(e.length!==0){if(e.length===1)return e[0];throw new U("expected a single document in the stream, but found more")}}var Ga=qa,Ya=Ka,zn={loadAll:Ga,load:Ya},Wn=Object.prototype.toString,Un=Object.prototype.hasOwnProperty,Mr=65279,Va=9,vt=10,Ja=13,Qa=32,Xa=33,Za=34,Nr=35,el=37,tl=38,rl=39,il=42,Bn=44,nl=45,Xt=58,sl=61,ol=62,al=63,ll=64,qn=91,Kn=93,dl=96,Gn=123,cl=124,Yn=125,I={};I[0]="\\0";I[7]="\\a";I[8]="\\b";I[9]="\\t";I[10]="\\n";I[11]="\\v";I[12]="\\f";I[13]="\\r";I[27]="\\e";I[34]='\\"';I[92]="\\\\";I[133]="\\N";I[160]="\\_";I[8232]="\\L";I[8233]="\\P";var ul=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],hl=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function pl(t,n){var e,r,i,s,o,a,c;if(n===null)return{};for(e={},r=Object.keys(n),i=0,s=r.length;i<s;i+=1)o=r[i],a=String(n[o]),o.slice(0,2)==="!!"&&(o="tag:yaml.org,2002:"+o.slice(2)),c=t.compiledTypeMap.fallback[o],c&&Un.call(c.styleAliases,a)&&(a=c.styleAliases[a]),e[o]=a;return e}function ml(t){var n,e,r;if(n=t.toString(16).toUpperCase(),t<=255)e="x",r=2;else if(t<=65535)e="u",r=4;else if(t<=4294967295)e="U",r=8;else throw new U("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+e+D.repeat("0",r-n.length)+n}var fl=1,yt=2;function gl(t){this.schema=t.schema||Hn,this.indent=Math.max(1,t.indent||2),this.noArrayIndent=t.noArrayIndent||!1,this.skipInvalid=t.skipInvalid||!1,this.flowLevel=D.isNothing(t.flowLevel)?-1:t.flowLevel,this.styleMap=pl(this.schema,t.styles||null),this.sortKeys=t.sortKeys||!1,this.lineWidth=t.lineWidth||80,this.noRefs=t.noRefs||!1,this.noCompatMode=t.noCompatMode||!1,this.condenseFlow=t.condenseFlow||!1,this.quotingType=t.quotingType==='"'?yt:fl,this.forceQuotes=t.forceQuotes||!1,this.replacer=typeof t.replacer=="function"?t.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function yn(t,n){for(var e=D.repeat(" ",n),r=0,i=-1,s="",o,a=t.length;r<a;)i=t.indexOf(`
`,r),i===-1?(o=t.slice(r),r=a):(o=t.slice(r,i+1),r=i+1),o.length&&o!==`
`&&(s+=e),s+=o;return s}function Pr(t,n){return`
`+D.repeat(" ",t.indent*n)}function _l(t,n){var e,r,i;for(e=0,r=t.implicitTypes.length;e<r;e+=1)if(i=t.implicitTypes[e],i.resolve(n))return!0;return!1}function Zt(t){return t===Qa||t===Va}function bt(t){return 32<=t&&t<=126||161<=t&&t<=55295&&t!==8232&&t!==8233||57344<=t&&t<=65533&&t!==Mr||65536<=t&&t<=1114111}function bn(t){return bt(t)&&t!==Mr&&t!==Ja&&t!==vt}function wn(t,n,e){var r=bn(t),i=r&&!Zt(t);return(e?r:r&&t!==Bn&&t!==qn&&t!==Kn&&t!==Gn&&t!==Yn)&&t!==Nr&&!(n===Xt&&!i)||bn(n)&&!Zt(n)&&t===Nr||n===Xt&&i}function vl(t){return bt(t)&&t!==Mr&&!Zt(t)&&t!==nl&&t!==al&&t!==Xt&&t!==Bn&&t!==qn&&t!==Kn&&t!==Gn&&t!==Yn&&t!==Nr&&t!==tl&&t!==il&&t!==Xa&&t!==cl&&t!==sl&&t!==ol&&t!==rl&&t!==Za&&t!==el&&t!==ll&&t!==dl}function yl(t){return!Zt(t)&&t!==Xt}function gt(t,n){var e=t.charCodeAt(n),r;return e>=55296&&e<=56319&&n+1<t.length&&(r=t.charCodeAt(n+1),r>=56320&&r<=57343)?(e-55296)*1024+r-56320+65536:e}function Vn(t){var n=/^\n* /;return n.test(t)}var Jn=1,Dr=2,Qn=3,Xn=4,Ke=5;function bl(t,n,e,r,i,s,o,a){var c,h=0,f=null,p=!1,_=!1,v=r!==-1,x=-1,k=vl(gt(t,0))&&yl(gt(t,t.length-1));if(n||o)for(c=0;c<t.length;h>=65536?c+=2:c++){if(h=gt(t,c),!bt(h))return Ke;k=k&&wn(h,f,a),f=h}else{for(c=0;c<t.length;h>=65536?c+=2:c++){if(h=gt(t,c),h===vt)p=!0,v&&(_=_||c-x-1>r&&t[x+1]!==" ",x=c);else if(!bt(h))return Ke;k=k&&wn(h,f,a),f=h}_=_||v&&c-x-1>r&&t[x+1]!==" "}return!p&&!_?k&&!o&&!i(t)?Jn:s===yt?Ke:Dr:e>9&&Vn(t)?Ke:o?s===yt?Ke:Dr:_?Xn:Qn}function wl(t,n,e,r,i){t.dump=(function(){if(n.length===0)return t.quotingType===yt?'""':"''";if(!t.noCompatMode&&(ul.indexOf(n)!==-1||hl.test(n)))return t.quotingType===yt?'"'+n+'"':"'"+n+"'";var s=t.indent*Math.max(1,e),o=t.lineWidth===-1?-1:Math.max(Math.min(t.lineWidth,40),t.lineWidth-s),a=r||t.flowLevel>-1&&e>=t.flowLevel;function c(h){return _l(t,h)}switch(bl(n,a,t.indent,o,c,t.quotingType,t.forceQuotes&&!r,i)){case Jn:return n;case Dr:return"'"+n.replace(/'/g,"''")+"'";case Qn:return"|"+$n(n,t.indent)+xn(yn(n,s));case Xn:return">"+$n(n,t.indent)+xn(yn($l(n,o),s));case Ke:return'"'+xl(n)+'"';default:throw new U("impossible error: invalid scalar style")}})()}function $n(t,n){var e=Vn(t)?String(n):"",r=t[t.length-1]===`
`,i=r&&(t[t.length-2]===`
`||t===`
`),s=i?"+":r?"":"-";return e+s+`
`}function xn(t){return t[t.length-1]===`
`?t.slice(0,-1):t}function $l(t,n){for(var e=/(\n+)([^\n]*)/g,r=(function(){var h=t.indexOf(`
`);return h=h!==-1?h:t.length,e.lastIndex=h,kn(t.slice(0,h),n)})(),i=t[0]===`
`||t[0]===" ",s,o;o=e.exec(t);){var a=o[1],c=o[2];s=c[0]===" ",r+=a+(!i&&!s&&c!==""?`
`:"")+kn(c,n),i=s}return r}function kn(t,n){if(t===""||t[0]===" ")return t;for(var e=/ [^ ]/g,r,i=0,s,o=0,a=0,c="";r=e.exec(t);)a=r.index,a-i>n&&(s=o>i?o:a,c+=`
`+t.slice(i,s),i=s+1),o=a;return c+=`
`,t.length-i>n&&o>i?c+=t.slice(i,o)+`
`+t.slice(o+1):c+=t.slice(i),c.slice(1)}function xl(t){for(var n="",e=0,r,i=0;i<t.length;e>=65536?i+=2:i++)e=gt(t,i),r=I[e],!r&&bt(e)?(n+=t[i],e>=65536&&(n+=t[i+1])):n+=r||ml(e);return n}function kl(t,n,e){var r="",i=t.tag,s,o,a;for(s=0,o=e.length;s<o;s+=1)a=e[s],t.replacer&&(a=t.replacer.call(e,String(s),a)),(le(t,n,a,!1,!1)||typeof a>"u"&&le(t,n,null,!1,!1))&&(r!==""&&(r+=","+(t.condenseFlow?"":" ")),r+=t.dump);t.tag=i,t.dump="["+r+"]"}function Sn(t,n,e,r){var i="",s=t.tag,o,a,c;for(o=0,a=e.length;o<a;o+=1)c=e[o],t.replacer&&(c=t.replacer.call(e,String(o),c)),(le(t,n+1,c,!0,!0,!1,!0)||typeof c>"u"&&le(t,n+1,null,!0,!0,!1,!0))&&((!r||i!=="")&&(i+=Pr(t,n)),t.dump&&vt===t.dump.charCodeAt(0)?i+="-":i+="- ",i+=t.dump);t.tag=s,t.dump=i||"[]"}function Sl(t,n,e){var r="",i=t.tag,s=Object.keys(e),o,a,c,h,f;for(o=0,a=s.length;o<a;o+=1)f="",r!==""&&(f+=", "),t.condenseFlow&&(f+='"'),c=s[o],h=e[c],t.replacer&&(h=t.replacer.call(e,c,h)),le(t,n,c,!1,!1)&&(t.dump.length>1024&&(f+="? "),f+=t.dump+(t.condenseFlow?'"':"")+":"+(t.condenseFlow?"":" "),le(t,n,h,!1,!1)&&(f+=t.dump,r+=f));t.tag=i,t.dump="{"+r+"}"}function El(t,n,e,r){var i="",s=t.tag,o=Object.keys(e),a,c,h,f,p,_;if(t.sortKeys===!0)o.sort();else if(typeof t.sortKeys=="function")o.sort(t.sortKeys);else if(t.sortKeys)throw new U("sortKeys must be a boolean or a function");for(a=0,c=o.length;a<c;a+=1)_="",(!r||i!=="")&&(_+=Pr(t,n)),h=o[a],f=e[h],t.replacer&&(f=t.replacer.call(e,h,f)),le(t,n+1,h,!0,!0,!0)&&(p=t.tag!==null&&t.tag!=="?"||t.dump&&t.dump.length>1024,p&&(t.dump&&vt===t.dump.charCodeAt(0)?_+="?":_+="? "),_+=t.dump,p&&(_+=Pr(t,n)),le(t,n+1,f,!0,p)&&(t.dump&&vt===t.dump.charCodeAt(0)?_+=":":_+=": ",_+=t.dump,i+=_));t.tag=s,t.dump=i||"{}"}function En(t,n,e){var r,i,s,o,a,c;for(i=e?t.explicitTypes:t.implicitTypes,s=0,o=i.length;s<o;s+=1)if(a=i[s],(a.instanceOf||a.predicate)&&(!a.instanceOf||typeof n=="object"&&n instanceof a.instanceOf)&&(!a.predicate||a.predicate(n))){if(e?a.multi&&a.representName?t.tag=a.representName(n):t.tag=a.tag:t.tag="?",a.represent){if(c=t.styleMap[a.tag]||a.defaultStyle,Wn.call(a.represent)==="[object Function]")r=a.represent(n,c);else if(Un.call(a.represent,c))r=a.represent[c](n,c);else throw new U("!<"+a.tag+'> tag resolver accepts not "'+c+'" style');t.dump=r}return!0}return!1}function le(t,n,e,r,i,s,o){t.tag=null,t.dump=e,En(t,e,!1)||En(t,e,!0);var a=Wn.call(t.dump),c=r,h;r&&(r=t.flowLevel<0||t.flowLevel>n);var f=a==="[object Object]"||a==="[object Array]",p,_;if(f&&(p=t.duplicates.indexOf(e),_=p!==-1),(t.tag!==null&&t.tag!=="?"||_||t.indent!==2&&n>0)&&(i=!1),_&&t.usedDuplicates[p])t.dump="*ref_"+p;else{if(f&&_&&!t.usedDuplicates[p]&&(t.usedDuplicates[p]=!0),a==="[object Object]")r&&Object.keys(t.dump).length!==0?(El(t,n,t.dump,i),_&&(t.dump="&ref_"+p+t.dump)):(Sl(t,n,t.dump),_&&(t.dump="&ref_"+p+" "+t.dump));else if(a==="[object Array]")r&&t.dump.length!==0?(t.noArrayIndent&&!o&&n>0?Sn(t,n-1,t.dump,i):Sn(t,n,t.dump,i),_&&(t.dump="&ref_"+p+t.dump)):(kl(t,n,t.dump),_&&(t.dump="&ref_"+p+" "+t.dump));else if(a==="[object String]")t.tag!=="?"&&wl(t,t.dump,n,s,c);else{if(a==="[object Undefined]")return!1;if(t.skipInvalid)return!1;throw new U("unacceptable kind of an object to dump "+a)}t.tag!==null&&t.tag!=="?"&&(h=encodeURI(t.tag[0]==="!"?t.tag.slice(1):t.tag).replace(/!/g,"%21"),t.tag[0]==="!"?h="!"+h:h.slice(0,18)==="tag:yaml.org,2002:"?h="!!"+h.slice(18):h="!<"+h+">",t.dump=h+" "+t.dump)}return!0}function Cl(t,n){var e=[],r=[],i,s;for(Or(t,e,r),i=0,s=r.length;i<s;i+=1)n.duplicates.push(e[r[i]]);n.usedDuplicates=new Array(s)}function Or(t,n,e){var r,i,s;if(t!==null&&typeof t=="object")if(i=n.indexOf(t),i!==-1)e.indexOf(i)===-1&&e.push(i);else if(n.push(t),Array.isArray(t))for(i=0,s=t.length;i<s;i+=1)Or(t[i],n,e);else for(r=Object.keys(t),i=0,s=r.length;i<s;i+=1)Or(t[r[i]],n,e)}function Tl(t,n){n=n||{};var e=new gl(n);e.noRefs||Cl(t,e);var r=t;return e.replacer&&(r=e.replacer.call({"":r},"",r)),le(e,0,r,!0,!0)?e.dump+`
`:""}var Ll=Tl,Al={dump:Ll};function jr(t,n){return function(){throw new Error("Function yaml."+t+" is removed in js-yaml 4. Use yaml."+n+" instead, which is now safe by default.")}}var Zn=zn.load,uu=zn.loadAll,tr=Al.dump;var hu=jr("safeLoad","load"),pu=jr("safeLoadAll","loadAll"),mu=jr("safeDump","dump");var ee=class extends b{constructor(){super(...arguments);this.value=null;this._mode="form";this._yamlText="";this._yamlError=null;this._computeFieldLabel=e=>Er(this.hass,this._picked??"",e.name);this._computeFieldHelper=e=>{let i=this._currentFields()?.[e.name]?.description;return typeof i=="string"?i:""}}willUpdate(e){super.willUpdate?.(e),e.has("value")&&this._mode==="form"&&(this._yamlText=tr(this.value??{}))}connectedCallback(){super.connectedCallback(),this._yamlText=tr(this.value??{})}_setMode(e){e==="form"&&this._yamlError!==null||(e==="yaml"&&(this._yamlText=tr(this.value??{})),this._mode=e)}_onYamlInput(e){this._yamlText=e;let r;try{r=Zn(e)}catch(c){this._yamlError=c.message;return}if(r==null){this._yamlError=null,this._emit(null);return}if(typeof r!="object"||Array.isArray(r)){this._yamlError="Expected an object";return}let i=r,s=i.script;if(typeof s!="string"||!s.startsWith("script.")){this._yamlError="`script` must be a 'script.<name>' string";return}let o=i.args;if(o!==void 0&&(typeof o!="object"||Array.isArray(o)||o===null)){this._yamlError="`args` must be an object if present";return}let a=i.triggers;if(a!==void 0&&(!Array.isArray(a)||!a.every(c=>typeof c=="string"))){this._yamlError="`triggers` must be a list of entity_id strings if present";return}this._yamlError=null,this._emit({script:s,args:o??{},triggers:a})}_emit(e){this.value=e,A(this,this.value)}_scriptIds(){let e=this.hass?.services;return Object.keys(e?.script??{}).sort().map(i=>`script.${i}`)}_label(e){return J(this.hass,e)}_fieldsFor(e){if(!e)return;let r=e.replace(/^script\./,"");return this.hass?.services?.script?.[r]?.fields}get _picked(){return this.value&&typeof this.value=="object"?this.value.script:null}_currentFields(){return this._fieldsFor(this._picked)}_defaultArgs(e){let r=this._fieldsFor(e)??{},i={};for(let[s,o]of Object.entries(r))o&&Object.hasOwn(o,"default")&&(i[s]=o.default);return i}_pickerSchema(){return[{name:"script",selector:{select:{mode:"dropdown",options:this._scriptIds().map(e=>({value:e,label:this._label(e)}))}}}]}_pickScript(e){if(!e){this._emit(null);return}this._emit({script:e,args:this._defaultArgs(e)})}_argsSchema(){let e=this._currentFields();return e?Object.entries(e).map(([r,i])=>({name:r,required:i.required,selector:i.selector??{text:{}}})):[]}_updateArgs(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:e,triggers:this.value.triggers})}get _triggers(){return this.value&&typeof this.value=="object"&&this.value.triggers||[]}_setTriggers(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:this.value.args,triggers:e})}_removeTrigger(e){this._setTriggers(this._triggers.filter(r=>r!==e))}_addTrigger(e){this._triggers.includes(e)||this._setTriggers([...this._triggers,e])}render(){let e=this._picked,r=this._argsSchema(),i=(this.value&&typeof this.value=="object"?this.value.args:{})??{},s=r.length>0;return l`
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
            @change=${o=>{let a=o.target.value,c={...r,[i.name]:a};this._updateArgs(c)}}
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
    </select>`}};ee.styles=y`
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
  `,u([m({attribute:!1})],ee.prototype,"hass",2),u([m({attribute:!1})],ee.prototype,"value",2),u([g()],ee.prototype,"_mode",2),u([g()],ee.prototype,"_yamlText",2),u([g()],ee.prototype,"_yamlError",2),ee=u([w("ambience-script-predicate-input")],ee);var Hl=["dawn","sunrise","noon","sunset","dusk","midnight"],Oe=class extends b{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){A(this,e)}_onKindChange(e){let r=e.target.value;r!==this.value.kind&&(r==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let r=e.target.value,[i,s]=r.split(":").map(o=>parseInt(o,10));Number.isNaN(i)||Number.isNaN(s)||this._emit({kind:"time",hh:i,mm:s})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let r=e.target.value;this._emit({...this.value,anchor:r})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let r=e.target.value.trim(),i=r===""?0:parseInt(r,10);Number.isNaN(i)||this._emit({...this.value,offset_min:i})}_onClampDirChange(e){if(this.value.kind!=="sun")return;let r=e.target.value;if(r===""){this._emit({kind:"sun",anchor:this.value.anchor,offset_min:this.value.offset_min});return}let i=this.value.clamp??Nl();this._emit({...this.value,clamp:{dir:r,hh:i.hh,mm:i.mm}})}_onClampTimeChange(e){if(this.value.kind!=="sun"||!this.value.clamp)return;let r=e.target.value,[i,s]=r.split(":").map(o=>parseInt(o,10));Number.isNaN(i)||Number.isNaN(s)||this._emit({...this.value,clamp:{dir:this.value.clamp.dir,hh:i,mm:s}})}_renderTime(e){let r=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return l`<input type="time" .value=${r} @input=${this._onTimeChange} />`}_renderSun(e){let r=Pl(e.offset_min,this.hass),i=e.clamp?.dir??"",s=e.clamp?`${String(e.clamp.hh).padStart(2,"0")}:${String(e.clamp.mm).padStart(2,"0")}`:"";return l`
      <div class="sun">
        <div class="row">
          <select @change=${this._onAnchorChange}>
            ${Hl.map(o=>l`<option value=${o} ?selected=${o===e.anchor}>${Me(this.hass,o)}</option>`)}
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
    `}};Oe.styles=y`
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
  `,u([m({attribute:!1})],Oe.prototype,"hass",2),u([m({attribute:!1})],Oe.prototype,"value",2),Oe=u([w("ambience-time-endpoint")],Oe);function Nl(){let t=new Date;return{hh:t.getHours(),mm:t.getMinutes()}}function Pl(t,n){if(t===0)return"";let e=Math.abs(t),r=t<0?"\u2212":"+";if(e%60===0){let i=e/60,s=i===1?d(n,"ui.unit_hour","hour"):d(n,"ui.unit_hours","hours");return`${r}${i} ${s}`}return`${r}${e} ${d(n,"ui.unit_min","min")}`}var wt={kind:"any"},es={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},te=class extends b{constructor(){super(...arguments);this.value=null;this._entries=[wt];this._openIdx=0}willUpdate(e){e.has("value")&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[wt]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(r=>{let i=this._entries[this._openIdx];if(!i)return;let s=i.kind==="any"?"__any__":i.kind==="range"?"__custom__":i.period;r.value!==s&&(r.value=s)})}_predicateToEntries(e){return e===null?[wt]:(Array.isArray(e)?e:[e]).map(i=>"period"in i?{kind:"period",period:i.period}:{kind:"range",from:i.from,to:i.to})}_emit(e){let r=e.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),i=r.length===0?null:r.length===1?r[0]:r;A(this,i)}_effectiveIds(){if(!this.periods)return[];let e=Object.keys(this.periods.builtins),r=Object.keys(this.periods.custom).filter(s=>!(s in this.periods.builtins)),i=new Set(this.periods.hidden);return[...e.filter(s=>!i.has(s)),...r]}_onSelectChange(e,r){let i=r.target.value,s=[...this._entries];i==="__any__"?s[e]=wt:i==="__custom__"?s[e]={kind:"range",...es}:s[e]={kind:"period",period:i},this._entries=s,this._emit(s)}_onRangeChange(e,r,i){i.stopPropagation();let s=this._entries[e];if(s?.kind!=="range")return;let o=[...this._entries];o[e]={...s,[r]:i.detail.value},this._entries=o,this._emit(o)}_onRemove(e){let r=this._entries.filter((i,s)=>s!==e);this._entries=r.length===0?[wt]:r,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...es}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,r){let i;return e.kind==="any"?i=d(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?i=Yt({period:e.period},{hass:this.hass,periods:this.periods}):i=Yt({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),l`
      <div class="summary-chip" @click=${()=>this._onChipClick(r)}>
        <span class="chip-label">${i}</span>
        ${this._entries.length>1?l`<button class="remove" @click=${s=>{s.stopPropagation(),this._onRemove(r)}} title=${d(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,r,i){let s=this._effectiveIds(),o=this.periods?.custom??{};return l`
      <div class="entry">
        <div class="entry-header">
          <select @change=${a=>this._onSelectChange(r,a)}>
            ${i?l`<option value="__any__">${d(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${d(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${s.map(a=>l`<option value=${a}>
                ${oe(this.hass,a,o)}${o[a]&&!this.periods?.builtins[a]?d(this.hass,"ui.custom_suffix"," (custom)"):""}
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
                  @value-changed=${a=>this._onRangeChange(r,"from",a)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${d(this.hass,"ui.to_label","To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${a=>this._onRangeChange(r,"to",a)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(i=>i.kind!=="any"),r=this._entries.length>1;return l`
      ${this._entries.map((i,s)=>r&&s!==this._openIdx?this._renderChip(i,s):this._renderEntry(i,s,s===0))}
      ${e?l`<button class="add-btn" @click=${this._onAdd}>${d(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};te.styles=y`
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
  `,u([m({attribute:!1})],te.prototype,"value",2),u([m({attribute:!1})],te.prototype,"periods",2),u([m({attribute:!1})],te.prototype,"hass",2),u([g()],te.prototype,"_entries",2),u([g()],te.prototype,"_openIdx",2),te=u([w("ambience-time-of-day-input")],te);function ts(t){if(typeof t!="string")return!1;let n=t.split(",").map(e=>e.trim()).filter(e=>e!=="");if(n.length===0)return!1;for(let e of n)if(e.includes("-")){let r=e.split("-").map(o=>o.trim());if(r.length!==2||!/^\d+$/.test(r[0])||!/^\d+$/.test(r[1]))return!1;let i=Number(r[0]),s=Number(r[1]);if(!(i>=1&&i<=s&&s<=31))return!1}else{if(!/^\d+$/.test(e))return!1;let r=Number(e);if(!(r>=1&&r<=31))return!1}return!0}var zr=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Dl=new Set(["workday","holiday"]),Ol=new Set(["first_workday","last_workday"]),Rl=[31,29,31,30,31,30,31,31,30,31,30,31];function $t(t){return Rl[t-1]??31}function Wr(t){switch(t){case"weekday":return{kind:t,days:[]};case"day_of_month":return{kind:t,days:""};case"date":return{kind:t,month:1,day:1};case"date_range":return{kind:t,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:t}}}var we=class extends b{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?d(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return d(this.hass,"ui.field_kind","Kind");case"days":return d(this.hass,"ui.field_days_of_month","Days of month");case"month":return d(this.hass,"ui.field_month","Month");case"day":return d(this.hass,"ui.field_day","Day");case"from_month":return d(this.hass,"ui.field_from_month","From month");case"from_day":return d(this.hass,"ui.field_from_day","From day");case"to_month":return d(this.hass,"ui.field_to_month","To month");case"to_day":return d(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let r=e.include.length===0&&e.exclude.length===0;this.value=r?null:e,A(this,this.value)}_addItem(e,r){let i=this._current();i[e]=[...i[e],Wr(r)],this._emit(i)}_removeItem(e,r){let i=this._current();i[e]=i[e].filter((s,o)=>o!==r),this._emit(i)}_updateItem(e,r,i){let s=this._current();s[e]=s[e].map((o,a)=>a===r?i:o),this._emit(s)}_kindDisabled(e){return!!(Dl.has(e)&&!this.dayConfig.workday_sensor||Ol.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:zr.map(e=>({value:e,label:Ft(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:je(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:$t(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,r){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(r.days??"")}:e}_setDatePart(e,r,i){let s=Number(i);if(!Number.isFinite(s)||s<1)return e;if(e.kind==="date"){let{month:o,day:a}=e;return r==="month"&&(o=s),r==="day"&&(a=s),{kind:"date",month:o,day:Math.min(a,$t(o))}}if(e.kind==="date_range"){let o={...e.from},a={...e.to};return r==="from_month"&&(o.month=s),r==="from_day"&&(o.day=s),r==="to_month"&&(a.month=s),r==="to_day"&&(a.day=s),o.day=Math.min(o.day,$t(o.month)),a.day=Math.min(a.day,$t(a.month)),{kind:"date_range",from:o,to:a}}return e}_onKindForm(e,r,i){let s=i.kind;if(!s){this._removeItem(e,r);return}if(this._kindDisabled(s))return;let o=this._current()[e][r];o&&o.kind===s||this._updateItem(e,r,Wr(s))}_dayOfMonthError(e){return e.trim()===""||ts(e)?null:d(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(e,r,i,s){this._updateItem(e,r,this._bodyPatch(i,s))}_renderWeekday(e,r,i){return l`${[0,1,2,3,4,5,6].map(s=>l`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${i.days.includes(s)}
          @change=${o=>{let c=o.target.checked?[...i.days,s].sort((h,f)=>h-f):i.days.filter(h=>h!==s);this._updateItem(e,r,{kind:"weekday",days:c})}}
        />${Rt(this.hass,s)}
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
        @change=${s=>{let o=s.target.value;this._kindDisabled(o)||o===i.kind||this._updateItem(e,r,Wr(o))}}
      >
        ${zr.map(s=>l`<option value=${s} ?disabled=${this._kindDisabled(s)}>${Ft(this.hass,s)}</option>`)}
      </select>
    `}_renderItemBody(e,r,i){if(i.kind==="weekday")return this._renderWeekday(e,r,i);if(customElements.get("ha-form")){if(i.kind==="date")return this._renderDateRow(e,r,i,"month","day",i.month,i.day);if(i.kind==="date_range")return l`
          ${this._renderDateRow(e,r,i,"from_month","from_day",i.from.month,i.from.day)}
          ${this._renderDateRow(e,r,i,"to_month","to_day",i.to.month,i.to.day)}
        `;let s=this._bodySchema(i);if(!s)return l``;let o=i.kind==="day_of_month"?this._dayOfMonthError(i.days):null;return l`<ha-form
        .hass=${this.hass}
        .schema=${s}
        .data=${this._bodyData(i)}
        .error=${o?{days:o}:void 0}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${a=>{a.stopPropagation(),this._onBodyForm(e,r,i,a.detail.value)}}
      ></ha-form>`}return this._renderNativeBody(e,r,i)}_renderDateRow(e,r,i,s,o,a,c){let h=(f,p)=>{this._updateItem(e,r,this._setDatePart(i,f,p[f]))};return l`
      <div class="date-row">
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:s,required:!0,selector:this._monthSelector()}]}
          .data=${{[s]:String(a)}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${f=>{f.stopPropagation(),h(s,f.detail.value)}}
        ></ha-form>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:o,required:!0,selector:this._daySelector(a)}]}
          .data=${{[o]:c}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${f=>{f.stopPropagation(),h(o,f.detail.value)}}
        ></ha-form>
      </div>
    `}_renderNativeBody(e,r,i){if(i.kind==="day_of_month"){let a=this._dayOfMonthError(i.days);return l`<input
        type="text" placeholder=${d(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${i.days}
        @change=${c=>this._updateItem(e,r,this._bodyPatch(i,{days:c.target.value}))}
      />${a?l`<div class="field-error">${a}</div>`:""}`}let s=(a,c)=>l`
      <input type="number" min="1" max="12" .value=${String(c)}
        @change=${h=>this._updateItem(e,r,this._setDatePart(i,a,h.target.value))} />
    `,o=(a,c,h)=>l`
      <input type="number" min="1" max=${String($t(c))} .value=${String(h)}
        @change=${f=>this._updateItem(e,r,this._setDatePart(i,a,f.target.value))} />
    `;return i.kind==="date"?l`${s("month",i.month)} / ${o("day",i.month,i.day)}`:i.kind==="date_range"?l`
        <span>${d(this.hass,"ui.from","from")}</span>
        ${s("from_month",i.from.month)} / ${o("from_day",i.from.month,i.from.day)}
        <span>${d(this.hass,"ui.to","to")}</span>
        ${s("to_month",i.to.month)} / ${o("to_day",i.to.month,i.to.day)}
      `:l``}_renderAddPicker(e){let r=e==="include"?d(this.hass,"ui.add_include_item","+ Add include item"):d(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let i=()=>r;return l`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${i}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.kind;o&&!this._kindDisabled(o)&&this._addItem(e,o)}}
      ></ha-form>`}return l`
      <select
        .value=${""}
        @change=${i=>{let s=i.target.value;s&&(this._addItem(e,s),i.target.value="")}}
      >
        <option value="">${r}</option>
        ${zr.map(i=>l`<option value=${i} ?disabled=${this._kindDisabled(i)}>${Ft(this.hass,i)}</option>`)}
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
    `}};we.styles=y`
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
  `,u([m({attribute:!1})],we.prototype,"hass",2),u([m({attribute:!1})],we.prototype,"value",2),u([m({attribute:!1})],we.prototype,"dayConfig",2),we=u([w("ambience-day-predicate-input")],we);var rs=["temperature","apparent_temperature","humidity","wind_speed","pressure"],is=["<","<=",">",">="],ns={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},de=class extends b{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(e){let r=e.groups.length===0&&e.thresholds.length===0;this.value=r?null:e,A(this,this.value)}_setGroups(e){this._emit({...this._current(),groups:e})}_addThreshold(){let e=this._current();e.thresholds=[...e.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(e)}_updateThreshold(e,r){let i=this._current();i.thresholds=i.thresholds.map((s,o)=>o===e?r:s),this._emit(i)}_removeThreshold(e){let r=this._current();r.thresholds=r.thresholds.filter((i,s)=>s!==e),this._emit(r)}_attributeSchema(e){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:rs.map(r=>({value:r,label:ot(this.hass,r)}))}}}]}_opSchema(e){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:is.map(r=>({value:r,label:ns[r]}))}}}]}_entityState(){let e=this.weatherEntity;return e?this.hass?.states?.[e]:void 0}_valueSchema(e,r){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:gr(this.hass,r,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(e=>({value:e.id,label:e.label}))}}}]}_renderGroups(e){return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{groups:e}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setGroups(r.detail.value.groups??[])}}
      ></ha-form>`:l`${this.groups.map(r=>l`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${e.includes(r.id)}
          @change=${i=>{let s=i.target.checked;this._setGroups(s?[...e,r.id]:e.filter(o=>o!==r.id))}} />${r.label}
      </label>`)}`}_renderAttributeSelect(e,r){return customElements.get("ha-form")?l`<ha-form
        class="attr-form"
        .hass=${this.hass}
        .schema=${this._attributeSchema(e)}
        .data=${{attribute:r.attribute}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation();let s=i.detail.value.attribute;s&&this._updateThreshold(e,{...r,attribute:s})}}
      ></ha-form>`:l`<select
      @change=${i=>this._updateThreshold(e,{...r,attribute:i.target.value})}>
      ${rs.map(i=>l`<option value=${i} ?selected=${i===r.attribute}>${ot(this.hass,i)}</option>`)}
    </select>`}_renderOpSelect(e,r){return customElements.get("ha-form")?l`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(e)}
        .data=${{op:r.op}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation();let s=i.detail.value.op;s&&this._updateThreshold(e,{...r,op:s})}}
      ></ha-form>`:l`<select
      @change=${i=>this._updateThreshold(e,{...r,op:i.target.value})}>
      ${is.map(i=>l`<option value=${i} ?selected=${i===r.op}>${ns[i]}</option>`)}
    </select>`}_renderValueInput(e,r){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(e,r.attribute)}
        .data=${{value:r.value}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.value;typeof o=="number"&&Number.isFinite(o)&&this._updateThreshold(e,{...r,value:o})}}
      ></ha-form>`;let i=gr(this.hass,r.attribute,this._entityState());return l`<span class="value-wrap">
      <input type="number" .value=${String(r.value)}
        @change=${s=>{let o=Number(s.target.value);Number.isFinite(o)&&this._updateThreshold(e,{...r,value:o})}} />
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
    `}};de.styles=y`
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
  `,u([m({attribute:!1})],de.prototype,"hass",2),u([m({attribute:!1})],de.prototype,"value",2),u([m({attribute:!1})],de.prototype,"groups",2),u([m({attribute:!1})],de.prototype,"weatherEntity",2),de=u([w("ambience-weather-predicate-input")],de);var Fl=["NW","N","NE","W",null,"E","SW","S","SE"],Re=class extends b{constructor(){super(...arguments);this.value=null}_current(){let e=this.value?.azimuth?.ranges??[];return{elevation:this.value?.elevation??null,sectors:[...this.value?.azimuth?.sectors??[]],range:e.length?{...e[0]}:null}}_emit(e){let r={};e.elevation&&(e.elevation.min!=null||e.elevation.max!=null)&&(r.elevation=e.elevation);let i={};e.sectors.length&&(i.sectors=e.sectors),e.range&&(i.ranges=[e.range]),(i.sectors||i.ranges)&&(r.azimuth=i),this.value=r.elevation||r.azimuth?r:null,A(this,this.value)}_setElevation(e){this._emit({...this._current(),elevation:e})}_setSectors(e){this._emit({...this._current(),sectors:e})}_setRange(e){this._emit({...this._current(),range:e})}_mode(e){return!e||e.min==null&&e.max==null?"any":e.min!=null&&e.max!=null?"between":e.min!=null?"above":"below"}_onModeChange(e,r){let i=r?.min??0,s=r?.max??0;e==="any"?this._setElevation(null):e==="above"?this._setElevation({min:i}):e==="below"?this._setElevation({max:s}):this._setElevation({min:i,max:s})}_toggleSector(e,r,i){this._setSectors(i?[...e,r]:e.filter(s=>s!==r))}_renderSectors(e){return l`<div class="sectors">${Fl.map(r=>r===null?l`<span class="spacer"></span>`:l`<label>
            <input type="checkbox" .checked=${e.includes(r)}
              @change=${i=>this._toggleSector(e,r,i.target.checked)} />${r}
          </label>`)}</div>`}_renderElevation(e){let r=this._mode(e),i=["any","above","below","between"],s={any:d(this.hass,"ui.sun.any","Any"),above:d(this.hass,"ui.sun.above","Above"),below:d(this.hass,"ui.sun.below","Below"),between:d(this.hass,"ui.sun.between","Between")};return l`
      <div class="row">
        <select @change=${o=>this._onModeChange(o.target.value,e)}>
          ${i.map(o=>l`<option value=${o} ?selected=${o===r}>${s[o]}</option>`)}
        </select>
        ${r==="above"||r==="between"?l`<input type="number" class="min" .value=${String(e?.min??0)}
              @change=${o=>this._setElevation({...r==="between"?{max:e?.max??0}:{},min:Number(o.target.value)})} /><span class="deg">°</span>`:""}
        ${r==="below"||r==="between"?l`<input type="number" class="max" .value=${String(e?.max??0)}
              @change=${o=>this._setElevation({...r==="between"?{min:e?.min??0}:{},max:Number(o.target.value)})} /><span class="deg">°</span>`:""}
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
    `}};Re.styles=y`
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
  `,u([m({attribute:!1})],Re.prototype,"hass",2),u([m({attribute:!1})],Re.prototype,"value",2),Re=u([w("ambience-sun-predicate-input")],Re);function xt(t){return t?.states??{}}function Ur(t,n){let e=`${n}.`;return Object.keys(xt(t)).filter(r=>r.startsWith(e)).sort().map(r=>({id:r,name:J(t,r)}))}function Il(t){return t.replace(/_/g," ").replace(/\bid\b/g,"ID").replace(/\bip\b/g,"IP").replace(/\bmac\b/g,"MAC").replace(/\bgps\b/g,"GPS").replace(/^\w/,n=>n.toUpperCase())}function Ml(t,n,e){let r=t?.formatEntityAttributeName;if(r&&n){let i=r(n,e);if(i)return i}return Il(e)}var O=class extends b{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[];this._knownAttributeValues=[]}async updated(e){if(!e.has("value"))return;let r=e.get("value"),i=this.value.entity_id;if(i&&i!==r?.entity_id&&this.hass)try{this._knownStates=(await zi(this.hass,i)).states}catch{this._knownStates=[]}let s=this.value.attribute;if(i!==r?.entity_id||s!==r?.attribute)if(i&&s&&this.hass)try{this._knownAttributeValues=(await Wi(this.hass,i,s)).values}catch{this._knownAttributeValues=[]}else this._knownAttributeValues.length&&(this._knownAttributeValues=[])}_normalize(e){let r={...e};return r.attribute===""&&(r.attribute=null),r.for&&r.for.h===0&&r.for.m===0&&r.for.s===0&&(r.for=null),r}_emit(e){let r=this._normalize(e);this.value=r,A(this,r)}_autoFlipOp(e){let r=this._isNumericTargetFor(e),i=this._isNumericOp(e.kind);return r&&!i?{...e,kind:">"}:!r&&i?{...e,kind:"is"}:e}_setEntity(e){this._emit(this._autoFlipOp({...this.value,entity_id:e,states:[],attribute:null}))}_setAttribute(e){this._emit(this._autoFlipOp({...this.value,attribute:e}))}_setOp(e){this._emit({...this.value,kind:e})}_setStates(e){this._emit({...this.value,states:e})}_setValueAt(e,r){if(this._isNumericOp(this.value.kind)){this._setStates([r]);return}let i=this.value.states.slice();r===""?i.splice(e,1):i[e]=r,this._setStates(i)}_addValue(e){e&&this._setStates([...this.value.states,e])}_removeValueAt(e){let r=this.value.states.slice();r.splice(e,1),this._setStates(r)}_setForDuration(e){this._emit({...this.value,for:e})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(e){if(!e)return[];let r=xt(this.hass)[e]?.attributes;return r?Object.keys(r).sort():[]}_attributeSchema(){let e=this._knownAttributesFor(this.value.entity_id),r=xt(this.hass)[this.value.entity_id];return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:O._STATE_SENTINEL,label:O._STATE_SENTINEL},...e.map(i=>({value:i,label:Ml(this.hass,r,i)}))]}}}]}_attributeData(){let e=this.value.attribute;return e?{attribute:e}:{attribute:O._STATE_SENTINEL}}_setAttributeFromHaForm(e){e===O._STATE_SENTINEL?this._setAttribute(""):this._setAttribute(e)}_isNumericOp(e){return O._NUMERIC_OPS.includes(e)}_isNumericTargetFor(e){let r=xt(this.hass)[e.entity_id];if(!r)return!1;if(e.attribute)return typeof r.attributes?.[e.attribute]=="number";let i=r.state;return typeof i!="string"||i===""||i==="unknown"||i==="unavailable"?!1:Number.isFinite(Number(i))}_opSchema(){let e=this._isNumericTargetFor(this.value)?[...O._NUMERIC_OPS]:["is","is_not"];return e.includes(this.value.kind)||e.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:e.map(r=>({value:r,label:K(this.hass,r)}))}}}]}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let e;return this.value.attribute?e=this._knownAttributeValues:e=this._knownStates,[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:e.map(r=>({value:r,label:r}))}}}]}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let e=this.value.for??{h:0,m:0,s:0};return{duration:{hours:e.h,minutes:e.m,seconds:e.s}}}_setForFromHaForm(e){this._setForDuration({h:e?.hours??0,m:e?.minutes??0,s:e?.seconds??0})}_renderEntity(){return customElements.get("ha-form")?l`<ha-form
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
    </select>`}_renderValueRow(e,r){let i=r===-1,s=i?c=>this._addValue(c):c=>this._setValueAt(r,c),o=this._isNumericOp(this.value.kind),a=o?{value:e===""?void 0:Number(e)}:{value:e};return customElements.get("ha-form")?l`
        <div class="value-row" data-row=${r}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${a}
            .computeLabel=${()=>""}
            @value-changed=${c=>{c.stopPropagation();let h=c.detail.value.value;s(h==null?"":String(h))}}
          ></ha-form>
        </div>
      `:l`
      <div class="value-row" data-row=${r}>
        <input type=${o?"number":"text"} .value=${e}
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
    `}};O.styles=y`
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
  `,O._STATE_SENTINEL="State",O._NUMERIC_OPS=[">",">=","<","<="],u([m({attribute:!1})],O.prototype,"hass",2),u([m({attribute:!1})],O.prototype,"value",2),u([g()],O.prototype,"_knownStates",2),u([g()],O.prototype,"_knownAttributeValues",2),O=u([w("ambience-state-expr-atom")],O);function Br(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,r)=>e===n[r])}var G=class extends b{constructor(){super(...arguments);this.path=[];this._dragOver=!1;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(e,r={}){this.dispatchEvent(new CustomEvent(e,{detail:{path:this.path,...r},bubbles:!0,composed:!0}))}_atomIsComplete(e){return!!e.entity_id&&e.states.some(r=>r!=="")}_isErrorTarget(){return Br(this.path,this.errorPath)}_onDragStart(e){if(this.path.length===0){e.preventDefault();return}if(e.target?.closest("button, select, input, textarea, ha-form")){e.preventDefault();return}e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("application/x-ambience-path",JSON.stringify(this.path)))}_onDragOver(e){this.path.length!==0&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._dragOver=!0)}_onDragLeave(e){e.stopPropagation(),this._dragOver=!1}_onDrop(e){if(this.path.length===0||(e.preventDefault(),e.stopPropagation(),this._dragOver=!1,!e.dataTransfer))return;let r=e.dataTransfer.getData("application/x-ambience-path");if(!r)return;let i;try{i=JSON.parse(r)}catch{return}!Array.isArray(i)||i.every(s=>typeof s=="number")===!1||Br(i,this.path)||this.dispatchEvent(new CustomEvent("node-move",{detail:{from:i,to:this.path},bubbles:!0,composed:!0}))}_renderAtomCard(e,r){let i=this._atomIsComplete(e),s=Br(this.path,this.openPath),o=i?Cr(e,{hass:this.hass}):d(this.hass,"ui.state_new_condition","(new condition)");return l`
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
            @click=${a=>{a.stopPropagation(),this._emit("node-toggle-not")}}>${K(this.hass,"not")}</button>
          <span class="summary ${i?"":"placeholder"}">${o}</span>
          <button class="wrap"
            title=${d(this.hass,"ui.state_wrap","Wrap in group")}
            @click=${a=>{a.stopPropagation(),this._emit("node-wrap")}}>(…)</button>
          <button class="remove"
            title=${d(this.hass,"ui.remove","Remove")}
            @click=${a=>{a.stopPropagation(),this._emit("node-remove")}}>✕</button>
        </div>
        ${s?l`
          <div class="atom-body">
            <ambience-state-expr-atom
              .hass=${this.hass}
              .value=${e}
              @value-changed=${a=>{a.stopPropagation(),this._emit("node-change",{value:a.detail.value})}}
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
    `}};G.styles=y`
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
  `,u([m({attribute:!1})],G.prototype,"hass",2),u([m({attribute:!1})],G.prototype,"value",2),u([m({attribute:!1})],G.prototype,"path",2),u([g()],G.prototype,"_dragOver",2),u([m({attribute:!1})],G.prototype,"openPath",2),u([m({attribute:!1})],G.prototype,"errorPath",2),u([m({attribute:!1})],G.prototype,"errorMessage",2),G=u([w("ambience-state-expr-node")],G);function qr(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,r)=>e===n[r])}var ce=class extends b{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._onNodeMove=e=>{e.stopPropagation(),this._moveAt(e.detail.from,e.detail.to)};this._onNodeChange=e=>{if(e.stopPropagation(),this._isEmptyAtom(e.detail.value)){this._removeAt(e.detail.path);return}this._replaceAt(e.detail.path,e.detail.value)};this._onNodeRemove=e=>{e.stopPropagation(),this._removeAt(e.detail.path)};this._onNodeWrap=e=>{e.stopPropagation(),this._wrapAt(e.detail.path)};this._onNodeAddChild=e=>{e.stopPropagation(),this._addChildAt(e.detail.path,"is")};this._onNodeToggleNot=e=>{e.stopPropagation(),this._toggleNotAt(e.detail.path)};this._onNodeSetOp=e=>{e.stopPropagation(),this._setGroupOpAt(e.detail.path,e.detail.op)};this._onNodeUnwrap=e=>{e.stopPropagation(),this._unwrapAt(e.detail.path)};this._onNodeOpen=e=>{if(e.stopPropagation(),this._openPath!==null){let r=this._atomAt(this._openPath);if(r&&this._atomError(r)!==null){this._showError=!0;return}}this._openPath!==null&&qr(this._openPath,e.detail.path)?this._openPath=null:this._openPath=e.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-move",this._onNodeMove)}_emit(e){this.value=e,A(this,e)}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(e,r){let i=this._patch(this.value,e,()=>r);this._emit(i)}_removeAt(e){if(e.length===0){this._emit(null);return}let r=this._patch(this.value,e,()=>null);this._emit(r)}_wrapAt(e){let r=null;if(e.length>0){let o=this._nodeAt(e.slice(0,-1));o&&(o.kind==="and"||o.kind==="or")&&(r=o.kind)}let i=r==="and"?"or":"and",s=this._patch(this.value,e,o=>o&&{kind:i,items:[o]});this._emit(s)}_nodeAt(e){return this._walkNode(this.value,e)}_moveAt(e,r){if(this._isPrefix(e,r)||e.length===0||r.length===0)return;let i=this._nodeAt(e);if(!i)return;let s=this._rewriteForMove(this.value,[],e,r,i);this._emit(s)}_isPrefix(e,r){return e.length>r.length?!1:e.every((i,s)=>i===r[s])}_rewriteForMove(e,r,i,s,o){if(!e)return e;if(e.kind==="not"){let _=this._rewriteForMove(e.item,r,i,s,o);return _==null?null:{kind:"not",item:_}}if(e.kind!=="and"&&e.kind!=="or")return e;let a=i.slice(0,-1),c=s.slice(0,-1),h=qr(r,a),f=qr(r,c),p=[];if(e.items.forEach((_,v)=>{let x=[...r,v];if(h&&v===i[i.length-1])return;let k=this._rewriteForMove(_,x,i,s,o);k!==null&&p.push(k)}),f){let _=s[s.length-1];p.splice(_,0,o)}return p.length===0?null:{...e,items:p}}_walkNode(e,r){return e?e.kind==="not"?this._walkNode(e.item,r):r.length===0?e:e.kind==="and"||e.kind==="or"?this._walkNode(e.items[r[0]]??null,r.slice(1)):null:null}_addChildAt(e,r){let i=null,s=this._patch(this.value,e,o=>{if(o&&(o.kind==="and"||o.kind==="or")){let a=[...o.items,this._emptyAtom()];return i=[...e,a.length-1],{...o,items:a}}return o});i!==null&&(this._openPath=i),this._emit(s)}_toggleNotAt(e){let r=this._patch(this.value,e,i=>i&&(i.kind==="not"?i.item:{kind:"not",item:i}));this._emit(r)}_setGroupOpAt(e,r){let i=this._patch(this.value,e,s=>{if(!s)return s;let o=null;if(s.kind==="and"||s.kind==="or")o=s;else if(s.kind==="not"){let a=s.item;(a.kind==="and"||a.kind==="or")&&(o=a)}return o?{kind:r,items:o.items}:s});this._emit(i)}_patch(e,r,i){if(r.length===0)return i(e);if(e==null)return e;let[s,...o]=r;if(e.kind==="and"||e.kind==="or"){let a=e.items.length,c=e.items.slice(),h=this._patch(c[s],o,i);if(h===null?c.splice(s,1):c[s]=h,c.length<a){if(c.length===0)return null;if(c.length===1)return c[0]}return{...e,items:c}}if(e.kind==="not"){let a=this._patch(e.item,r,i);return a==null?null:{kind:"not",item:a}}return e}_isEmptyAtom(e){if(e.kind==="and"||e.kind==="or"||e.kind==="not")return!1;let r=e;return!r.entity_id&&!r.states.some(i=>i!=="")&&!r.attribute&&!r.for}_atomAt(e){return this._walk(this.value,e)}_walk(e,r){return e?e.kind==="not"?this._walk(e.item,r):r.length===0?e.kind==="and"||e.kind==="or"?null:e:e.kind==="and"||e.kind==="or"?this._walk(e.items[r[0]]??null,r.slice(1)):null:null}_atomError(e){if(!e.entity_id)return d(this.hass,"ui.state_err_entity","Entity is required");if(e.kind!=="is"&&e.kind!=="is_not"){let i=e.states[0];if(!i)return d(this.hass,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(i)))return d(this.hass,"ui.state_err_numeric","Value must be a number")}else if(!e.states.some(i=>i!==""))return d(this.hass,"ui.state_err_state","State is required");return null}_unwrapAt(e){if(e.length===0){let o=this.value;if(!o)return;let a=o.kind==="not"?o.item:o;(a.kind==="and"||a.kind==="or")&&(a.items.length===1?this._emit(a.items[0]):this._emit(null));return}let r=e.slice(0,-1),i=e[e.length-1],s=this._patch(this.value,r,o=>{if(!o||o.kind!=="and"&&o.kind!=="or")return o;let a=o.items.slice(),c=a[i],h=null;if(c.kind==="and"||c.kind==="or")h=c;else if(c.kind==="not"){let f=c.item;(f.kind==="and"||f.kind==="or")&&(h=f)}return h?(a.splice(i,1,...h.items),{...o,items:a}):o});this._emit(s)}willUpdate(e){if(e.has("value")){let r=this.value;if(r&&this._openPath===null&&r.kind!=="and"&&r.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let i=this._atomAt(this._openPath);(!i||this._atomError(i)===null)&&(this._showError=!1)}}}_addAtRoot(){let e=this.value;if(e==null){this._addFirstAtom();return}if(e.kind==="and"||e.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[e,this._emptyAtom()]})}_setOpen(e){this._openPath=e}render(){if(this.value==null)return l`
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
    `}};ce.styles=y`
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
  `,u([m({attribute:!1})],ce.prototype,"hass",2),u([m({attribute:!1})],ce.prototype,"value",2),u([g()],ce.prototype,"_openPath",2),u([g()],ce.prototype,"_showError",2),ce=u([w("ambience-state-predicate-input")],ce);var ss=["everybody","anybody","nobody","any","all","none"],os=new Set(["any","all","none"]),Kr={everybody:"everyone",anybody:"any",nobody:"nobody",any:"any",all:"everyone",none:"nobody"},Fe=class extends b{constructor(){super(...arguments);this.value=null;this._lastSelected=[]}_persons(){return Ur(this.hass,"person")}_zones(){return Ur(this.hass,"zone")}_cur(){return this.value??{}}_who(){return this.value?.who??[]}_hasWhoKey(){return this.value!=null&&Array.isArray(this.value.who)}_mode(){if(this._hasWhoKey())switch(this._cur().quant??"any"){case"any":return"any";case"everyone":return"all";case"nobody":return"none"}switch(this._cur().quant??"everyone"){case"nobody":return"nobody";case"any":return"anybody";default:return"everybody"}}_hasFor(e){return!!e&&(e.h!==0||e.m!==0||e.s!==0)}_isNegativeQuant(){return Kr[this._mode()]==="nobody"}_effectiveNegate(){return!this._isNegativeQuant()&&!!this._cur().negate}_emitMode(e){let r=this._cur(),i=r.where??"home",s={quant:Kr[e],where:i};r.negate&&Kr[e]!=="nobody"&&(s.negate=!0),os.has(e)&&(this._hasWhoKey()?s.who=[...this._who()]:this._lastSelected.length>0?s.who=[...this._lastSelected]:s.who=this._persons().map(o=>o.id)),this._hasFor(r.for)&&(s.for=r.for),this._emit(s)}_emit(e){this.value=e,A(this,e)}_setMode(e){this._emitMode(e)}_setWhere(e){let r=this._cur(),i={quant:r.quant??"everyone",where:e};this._effectiveNegate()&&(i.negate=!0),this._hasWhoKey()&&(i.who=[...this._who()]),this._hasFor(r.for)&&(i.for=r.for),this._emit(i)}_setNegate(e){let r=this._cur(),i={quant:r.quant??"everyone",where:r.where??"home"};e&&(i.negate=!0),this._hasWhoKey()&&(i.who=[...this._who()]),this._hasFor(r.for)&&(i.for=r.for),this._emit(i)}_togglePerson(e,r){let i=r?[...this._who(),e]:this._who().filter(a=>a!==e);i.length>0&&(this._lastSelected=[...i]);let s=this._cur(),o={quant:s.quant??"any",where:s.where??"home",who:i};this._effectiveNegate()&&(o.negate=!0),this._hasFor(s.for)&&(o.for=s.for),this._emit(o)}_setFor(e){let r=this._cur(),i={quant:r.quant??"everyone",where:r.where??"home"};this._effectiveNegate()&&(i.negate=!0),this._hasWhoKey()&&(i.who=[...this._who()]),this._hasFor(e)&&(i.for=e),this._emit(i)}_forSchema(){return[{name:"duration",selector:{duration:{enable_day:!1}}}]}_forData(){let e=this._cur().for??{h:0,m:0,s:0};return{duration:{hours:e.h,minutes:e.m,seconds:e.s}}}_setForFromHaForm(e){this._setFor({h:e?.hours??0,m:e?.minutes??0,s:e?.seconds??0})}_modeLabel(e){switch(e){case"everybody":return d(this.hass,"ui.people_mode_everybody","Everybody");case"anybody":return d(this.hass,"ui.people_mode_anybody","Anybody");case"nobody":return d(this.hass,"ui.people_mode_nobody","Nobody");case"any":return d(this.hass,"ui.people_mode_any","Any of:");case"all":return d(this.hass,"ui.people_mode_all","All of:");case"none":return d(this.hass,"ui.people_mode_none","None of:")}}_renderMode(e){if(customElements.get("ha-form")){let r=[{name:"mode",required:!0,selector:{select:{mode:"dropdown",options:ss.map(i=>({value:i,label:this._modeLabel(i)}))}}}];return l`<ha-form
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
      ${ss.map(r=>l`<option value=${r} ?selected=${r===e}>${this._modeLabel(r)}</option>`)}
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
        @value-changed=${o=>{o.stopPropagation(),o.detail.value.negate!=null&&i(o.detail.value.negate)}}
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
        @value-changed=${o=>{o.stopPropagation(),o.detail.value.where&&this._setWhere(o.detail.value.where)}}
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
    </div>`}render(){let r=this._cur().where??"home",i=this._mode(),s=!this._isNegativeQuant(),o=this._effectiveNegate();return l`
      <div class="row">${this._renderMode(i)}</div>
      ${os.has(i)?this._renderPeople():""}
      <div class="row">
        ${s?this._renderNegate(o):l`<span class="label negate-static">${d(this.hass,"ui.people_is_at_static","is at")}</span>`}
        ${this._renderWhere(r)}
      </div>
      <div class="row">
        <span class="label">${d(this.hass,"ui.people_for","for")}</span>
        ${this._renderFor()}
      </div>
    `}};Fe.styles=y`
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
  `,u([m({attribute:!1})],Fe.prototype,"hass",2),u([m({attribute:!1})],Fe.prototype,"value",2),Fe=u([w("ambience-people-predicate-input")],Fe);var jl=new Set(["1","true","yes","on","enable"]);function as(t){return t==null?!1:typeof t=="boolean"?t:typeof t=="number"?t!==0:typeof t=="string"?jl.has(t.toLowerCase().trim()):!1}function zl(t){if(t!==null&&typeof t=="object")try{return JSON.stringify(t)}catch{return String(t)}return String(t)}var $e=class extends b{constructor(){super(...arguments);this.value=null;this._preview=null;this._debounceMs=250;this._gen=0}_template(){return this.value&&typeof this.value=="object"?this.value.template:""}willUpdate(e){if(!e.has("value")&&!e.has("hass"))return;let r=this._template(),i=this.hass?.connection;r===this._activeTemplate&&i===this._activeConn||(this._activeTemplate=r,this._activeConn=i,this._scheduleRender())}disconnectedCallback(){super.disconnectedCallback(),this._teardown()}_teardown(){this._debounceTimer!=null&&(clearTimeout(this._debounceTimer),this._debounceTimer=void 0),this._unsub&&(this._unsub(),this._unsub=void 0)}_scheduleRender(){this._teardown();let e=this._template();if(!e.trim()||!this.hass?.connection?.subscribeMessage){this._setPreview(null);return}let r=++this._gen;this._debounceTimer=setTimeout(()=>this._subscribe(e,r),this._debounceMs)}async _subscribe(e,r){let i=this.hass?.connection;if(i?.subscribeMessage)try{let s=await i.subscribeMessage(o=>{r===this._gen&&this._setPreview(o.error!=null?{error:o.error}:{value:zl(o.result),truthy:as(o.result)})},{type:"render_template",template:e,report_errors:!0});if(r!==this._gen){s();return}this._unsub=s}catch(s){if(r!==this._gen)return;this._setPreview({error:s?.message??String(s)})}}_setPreview(e){this._preview=e,this._emitValidity(e!=null&&"error"in e?e.error:null)}_emitValidity(e){this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_onInput(e){let r=e.target.value,i=r.trim()===""?null:{template:r};this.value=i,A(this,i)}_renderPreview(){let e=this._preview;return e==null?"":"error"in e?l`<div class="preview error">
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
    `}};$e.styles=y`
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
  `,u([m({attribute:!1})],$e.prototype,"value",2),u([m({attribute:!1})],$e.prototype,"hass",2),u([g()],$e.prototype,"_preview",2),$e=u([w("ambience-template-predicate-input")],$e);var Q=class extends b{constructor(){super(...arguments);this.value=null}_emit(e){A(this,e)}_onText(e){let r=e.target.value;this._emit(r.trim()===""?null:r)}render(){return this.condition.input==="time_of_day"?l`
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
      `:l`
      <input
        type="text"
        placeholder=${d(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.condition.predicate_help}</div>
    `}};Q.styles=y`
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
  `,u([m({attribute:!1})],Q.prototype,"condition",2),u([m({attribute:!1})],Q.prototype,"value",2),u([m({attribute:!1})],Q.prototype,"periods",2),u([m({attribute:!1})],Q.prototype,"dayConfig",2),u([m({attribute:!1})],Q.prototype,"weatherConfig",2),u([m({attribute:!1})],Q.prototype,"hass",2),Q=u([w("ambience-condition-input")],Q);function Wl(t){return t!=null&&typeof t=="object"&&Array.isArray(t.who)&&t.who.length===0}function Ul(t){return t==="people"?{quant:"everyone",where:"home"}:null}function ls(t,n){return!!t&&!!n&&j(t)===j(n)}var E=class extends b{constructor(){super(...arguments);this.open=!1;this.scene=null;this.conditions=[];this.availableActions=[];this.categories=[];this.schemas={};this.scopes=[];this.takenNames=new Map;this._draft=null;this._open=null;this._showError=!1;this._serviceHasTarget=new Map;this._conditionError=new Map;this._onNameInput=e=>{this._setName(e.target.value)};this._onAddCondition=e=>{let r=e.target,i=r.value;r.value="",this._addCondition(i)};this._onAddConditionHaForm=e=>{e.stopPropagation();let r=e.detail.value.add;r!==E._ADD_CONDITION_PLACEHOLDER&&this._addCondition(r)};this._onAddAction=e=>{let r=e.target,i=r.value;r.value="",this._addActionSlot(i)};this._onAddActionHaForm=e=>{e.stopPropagation();let r=e.detail.value.add;r!==E._ADD_ACTION_PLACEHOLDER&&this._addActionSlot(r)}}_onConditionInvalid(e,r){r?this._conditionError.set(e,r):this._conditionError.delete(e)}connectedCallback(){super.connectedCallback(),me(this,this.hass)}willUpdate(e){e.has("open")&&this.open&&(this._draft=this.scene?JSON.parse(JSON.stringify(this.scene)):null,this._scope=this.scope,this._open=null,this._showError=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_setDestination(e){let r=this.scopes[e];if(!r||!this._draft||(this._scope=r.scope,!this.hass))return;let i=new Set(qt(this.hass,this._scope,[]));this._draft={...this._draft,actions:this._draft.actions.map(s=>({...s,entity_ids:s.entity_ids.filter(o=>i.has(o))}))}}_renderDestination(){return l`
      <div class="scope-menu" role="listbox">
        ${this.scopes.map((e,r)=>l`<button
            class="scope-option"
            role="option"
            aria-selected=${ls(e.scope,this._scope)}
            @click=${()=>{this._setDestination(r),this._open=null}}
          >
            <ha-icon class="scope-icon" icon=${ht(e.scope,this.hass)}></ha-icon>
            <span class="scope-name">${e.label}</span>
          </button>`)}
      </div>
    `}_renderDestinationSlot(){if(this.scopes.length===0)return"";if(this._isOpen({kind:"destination"}))return l`
        <div class="slot destination-slot expanded" data-slot-id="destination">
          ${this._renderDestination()}
        </div>
      `;let e=this.scopes.find(r=>ls(r.scope,this._scope))??this.scopes[0];return l`
      <div class="slot collapsed" data-slot-id="destination">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"destination"})}>
          <strong>${d(this.hass,"ui.scope","Scope")}:</strong>
          <ha-icon class="scope-icon" icon=${ht(e.scope,this.hass)}></ha-icon>
          <span class="scope-name">${e.label}</span>
        </div>
      </div>
    `}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"})){let s=this._showError?this._nameError():null;return l`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
          ${s?l`<div class="error">${s}</div>`:""}
        </div>
      `}let i=Kt(this._draft,d(this.hass,"ui.new_scene","New scene"));return l`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${i}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let r=pi();return r==="ha-input"?l`<ha-input label=${d(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:r==="ha-textfield"?l`<ha-textfield label=${d(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:l`<input type="text" .value=${e} @input=${this._onNameInput} />`}_setCategory(e){!this._draft||!e||e===this._draft.category||(this._draft={...ut(this._draft),category:e})}_renderCategorySlot(){if(this.categories.length===0)return"";let e=[...this.categories].sort((s,o)=>s.name.localeCompare(o.name)),r=this._effectiveCategoryId(),i=this.categories.find(s=>s.id===r)??e[0];return this._isOpen({kind:"category"})?l`
        <div class="slot category-slot expanded" data-slot-id="category">
          <div class="category-menu" role="listbox">
            ${e.map(s=>l`<button
                class="category-option"
                role="option"
                aria-selected=${s.id===r}
                @click=${()=>{this._setCategory(s.id),this._open=null}}
              >
                ${Ue(s.color,s.icon)}
                <span class="category-name">${s.name}</span>
              </button>`)}
          </div>
        </div>
      `:l`
      <div class="slot collapsed" data-slot-id="category">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"category"})}>
          <strong>${d(this.hass,"ui.category","Category")}:</strong>
          ${Ue(i.color,i.icon)}
          <span class="category-name">${i.name}</span>
        </div>
      </div>
    `}_isOpen(e){let r=this._open;return r===null||r.kind!==e.kind?!1:e.kind==="condition"&&r.kind==="condition"?e.id===r.id:e.kind==="action"&&r.kind==="action"?e.idx===r.idx:!0}_effectiveCategoryId(){return this._draft?.category?this._draft.category:[...this.categories].sort((r,i)=>r.name.localeCompare(i.name))[0]?.id??""}_nameError(){let e=this._draft?.name?.trim().toLowerCase();if(!e||!this._scope)return null;let r=Bt(this._scope,this._effectiveCategoryId());return this.takenNames.get(r)?.has(e)?d(this.hass,"ui.name_duplicate","A scene with this name already exists in this category."):null}_validationError(e){if(e===null||e.kind==="category"||e.kind==="destination")return null;if(e.kind==="name")return this._nameError();if(e.kind==="condition"){let s=this._draft?.when[e.id];return Wl(s)?d(this.hass,"ui.people_select_one","Select at least one person"):this._conditionError.has(e.id)?d(this.hass,"ui.condition_error","Fix the error in this condition before continuing"):null}let r=this._draft?.actions[e.idx];if(!r)return null;let i=this._serviceHasTarget.get(r.service);return r.entity_ids.length===0&&i===!0?d(this.hass,"ui.at_least_one_target","At least one target is required."):null}_tryCloseCurrent(){return this._open===null?!0:this._validationError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){if(this._validationError(e)!==null){this._showError=!0;return}this._open=null,this._showError=!1;return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let r of e.composedPath())if(r instanceof Element&&(r.classList.contains("slot")||r.classList.contains("actions-bar")||r.classList.contains("add-condition")||r.classList.contains("add-action")))return;this._tryCloseCurrent()}_setPredicate(e,r){if(!this._draft)return;let i={...this._draft.when};r==null?delete i[e]:i[e]=r,this._draft={...this._draft,when:i}}_renderConditionRow(e){let r=this._draft.when[e.name]??null,i=this._isOpen({kind:"condition",id:e.name}),s=ft(e.name,r,{hass:this.hass,periods:this.periods});return l`
      <div class="slot ${i?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"condition",id:e.name})}>
          <span class="summary-label"><strong>${q(this.hass,e.name)}:</strong> ${s}</span>
          <button
            class="remove"
            @click=${o=>{o.stopPropagation(),this._removeCondition(e.name)}}
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
              .dayConfig=${this.dayConfig}
              .weatherConfig=${this.weatherConfig}
              @value-changed=${o=>this._setPredicate(e.name,o.detail.value)}
              @render-invalid-changed=${o=>this._onConditionInvalid(e.name,o.detail.error)}
            ></ambience-condition-input>

            ${this._showError&&this._validationError({kind:"condition",id:e.name})?l`
              <div class="error">${this._validationError({kind:"condition",id:e.name})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_visibleConditions(){if(!this._draft)return[];let e=this._draft.when;return this.conditions.filter(r=>r.name in e&&e[r.name]!=null||this._open?.kind==="condition"&&this._open.id===r.name)}_unusedConditions(){let e=new Set(this._visibleConditions().map(r=>r.name));return this.conditions.filter(r=>!e.has(r.name)).sort((r,i)=>q(this.hass,r.name).localeCompare(q(this.hass,i.name)))}_addCondition(e){if(!e||this._open!==null&&!this._tryCloseCurrent())return;let r=Ul(e);r!=null&&this._draft&&!(e in this._draft.when)&&(this._draft={...this._draft,when:{...this._draft.when,[e]:r}}),this._open={kind:"condition",id:e},this._showError=!1}_removeCondition(e){if(!this._draft)return;let r={...this._draft.when};delete r[e],this._draft={...this._draft,when:r},this._conditionError.delete(e),this._open?.kind==="condition"&&this._open.id===e&&(this._open=null,this._showError=!1)}_conditionDisabled(e){return e==="weather"&&!this.weatherConfig?.entity}_renderAddCondition(){let e=this._unusedConditions();return e.length===0?"":customElements.get("ha-form")?this._renderAddConditionHaForm(e):l`
      <div class="add-condition">
        <select class="add-condition" @change=${this._onAddCondition}>
          <option value="">${d(this.hass,"ui.add_condition","+ Add condition\u2026")}</option>
          ${e.map(r=>l`<option value=${r.name} ?disabled=${this._conditionDisabled(r.name)}>${q(this.hass,r.name)}</option>`)}
        </select>
      </div>
    `}_renderAddConditionHaForm(e){let r=d(this.hass,"ui.add_condition","+ Add condition\u2026"),i=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:E._ADD_CONDITION_PLACEHOLDER,label:r},...e.map(s=>({value:s.name,label:q(this.hass,s.name),disabled:this._conditionDisabled(s.name)}))]}}}];return l`
      <div class="add-condition">
        <ha-form
          .hass=${this.hass}
          .schema=${i}
          .data=${{add:E._ADD_CONDITION_PLACEHOLDER}}
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
    `}_updateActionAt(e,r){if(!this._draft)return;let i=this._draft.actions.map((s,o)=>o===e?r(s):s);this._draft={...this._draft,actions:i}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((r,i)=>i!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,r){this._updateActionAt(e,i=>({...i,entity_ids:r}))}_setActionParams(e,r){this._updateActionAt(e,i=>({...i,params:r}))}_onTargetModeChanged(e,r){this._serviceHasTarget.get(e)!==r&&(this._serviceHasTarget=new Map(this._serviceHasTarget).set(e,r))}_setReapplyOverride(e,r){let i=cn(r);this._updateActionAt(e,s=>{if(i===null){let{reapply_seconds:o,...a}=s;return a}return{...s,reapply_seconds:i}})}_renderReapplyOverride(e,r,i){if(i<=0)return l``;let s="reapply_seconds"in e?String(e.reapply_seconds):"";return l`
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
          @input=${o=>{o.stopPropagation(),this._setReapplyOverride(r,o.target.value)}}
        />
        <span class="reapply-unit">${d(this.hass,"ui.reapply_seconds_unit","s")}</span>
      </div>
    `}_renderActionRow(e,r){let i=this.availableActions.find(f=>f.id===e.service),s=i?.reapply_seconds??0,o=this._isOpen({kind:"action",idx:r}),a=an(e,{hass:this.hass,exposedActions:this.availableActions,schemas:this.schemas}),c=un(e,s),h=s>0&&c>0;return l`
      <div class="slot ${o?"expanded":"collapsed"}" data-slot-id="action-${r}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:r})}>
          <span class="summary-label">${a}</span>
          ${h?l`<span class="reapply-badge" data-reapply-badge>↺ ${c}s</span>`:""}
          <button class="remove" @click=${f=>{f.stopPropagation(),this._deleteAction(r)}} title=${d(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${o?l`
          <div class="body">
            <ambience-action-slot
              .hass=${this.hass}
              .scope=${this._scope}
              .exposed=${i}
              .entityIds=${e.entity_ids}
              .excludeEntities=${Ji(this._draft?.actions??[],r)}
              .params=${e.params}
              @entity-ids-changed=${f=>{f.stopPropagation(),this._setActionTargets(r,f.detail.entityIds)}}
              @params-changed=${f=>{f.stopPropagation(),this._setActionParams(r,f.detail.params)}}
              @target-mode-changed=${f=>{f.stopPropagation(),this._onTargetModeChanged(e.service,f.detail.hasTarget)}}
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
          <button class="secondary" @click=${this._cancel}>${d(this.hass,"ui.cancel","Cancel")}</button>
          <button class="primary" @click=${this._save}>${d(this.hass,"ui.save_scene","Save scene")}</button>
        </div>
      </div>
    `}};E.styles=[Ut,y`
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
      display: flex; justify-content: flex-end; gap: 0.5rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      flex-shrink: 0;
    }
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
  `],E._ADD_CONDITION_PLACEHOLDER="__add_condition__",E._ADD_ACTION_PLACEHOLDER="__add_action__",u([m({type:Boolean,reflect:!0})],E.prototype,"open",2),u([m({attribute:!1})],E.prototype,"scene",2),u([m({attribute:!1})],E.prototype,"conditions",2),u([m({attribute:!1})],E.prototype,"periods",2),u([m({attribute:!1})],E.prototype,"dayConfig",2),u([m({attribute:!1})],E.prototype,"weatherConfig",2),u([m({attribute:!1})],E.prototype,"availableActions",2),u([m({attribute:!1})],E.prototype,"categories",2),u([m({attribute:!1})],E.prototype,"schemas",2),u([m({attribute:!1})],E.prototype,"hass",2),u([m({attribute:!1})],E.prototype,"scope",2),u([m({attribute:!1})],E.prototype,"scopes",2),u([m({attribute:!1})],E.prototype,"takenNames",2),u([g()],E.prototype,"_draft",2),u([g()],E.prototype,"_scope",2),u([g()],E.prototype,"_open",2),u([g()],E.prototype,"_showError",2),u([g()],E.prototype,"_serviceHasTarget",2),E=u([w("ambience-scene-editor")],E);function Bl(t,n,e){return n==="time_of_day"?oe(t,e,{}):n==="weather"?ze(t,e):e}var rr=y`
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
  .scenes { font-family: monospace; font-size: 0.8rem; line-height: 1.7; }
  .scene.won { color: var(--success-color, #4caf50); }
  .scene.skipped { opacity: 0.5; }
  .pred.pass { color: var(--success-color, #4caf50); }
  .pred.fail { color: var(--error-color, #e57373); }
  .pred .dim { color: var(--secondary-text-color, #888); }
  .action-block { font-family: monospace; font-size: 0.8rem; line-height: 1.6; margin-bottom: 0.3rem; }
  .action-head { color: var(--primary-text-color, #ddd); }
  .action-block .entity { padding-left: 1rem; color: var(--secondary-text-color, #aaa); }
`;function ql(t){return t.kind==="entity"?`${t.entity_id} ${t.old} \u2192 ${t.new}`:t.detail?`${fe(t.kind)} ${t.detail}`:fe(t.kind)}function Kl(t,n,e){let r=Object.entries(t.params??{}).filter(([,s])=>s!=null&&s!=="").map(([s,o])=>`${mt(s,t.service,e)}: ${ve(n,o)}`).join(", "),i=st(t.service);return r?`${i} \xB7 ${r}`:i}function Gl(t){return t.reduce((n,e)=>n+(e.entity_ids?.length??0),0)}function Yl(t,n){let e=t.index+1;return t.disabled?l`<div class="scene disabled">Scene #${e} ${t.name??"\u2014"}: disabled</div>`:t.evaluated?l`
    <div class="scene ${t.matched?"won":""}">Scene #${e} ${t.name??"\u2014"}: ${t.matched?"WON":"no"}</div>
    ${t.predicates.map(r=>l`
        <div class="pred ${r.passed?"pass":"fail"}" style="padding-left:1rem">
          ${r.passed?"\u2713":"\u2717"} ${q(n,r.condition_key)}${r.detail?l` <span class="dim">[${Bl(n,r.condition_key,r.detail)}]</span>`:S}
        </div>`)}
  `:l`<div class="scene skipped">Scene #${e} ${t.name??"\u2014"}: not evaluated</div>`}function ir(t,n,e,r,i){let s=t.actions.map(c=>st(c.service)).join(", "),o=Gl(t.actions),a=t.explanation!==null||t.actions.length>0;return l`
    <div class="eval">
      <div class="top">
        <span class="outcome ${t.outcome}">${t.outcome.replace(/_/g," ")}</span>
        <span class="cause">${ql(t.cause)}</span>
        <span class="ts">${t.timestamp?new Date(t.timestamp).toLocaleTimeString():""}</span>
      </div>
      ${t.winner_name?l`<div class="won">Won: <span class="name">${t.winner_name}</span></div>`:S}
      ${t.actions.length?l`<div class="action-summary">→ ${s}
            ${o?l`<span class="n">· ${o} ${o===1?"entity":"entities"}</span>`:S}</div>`:S}
      ${a?l`<button class="why-toggle" @click=${e}>
            ${n?"\u25BE Hide details":t.explanation?t.winner_name?`\u25B8 Why this scene won (${t.explanation.scenes.length} scenes)`:`\u25B8 Why nothing matched (${t.explanation.scenes.length} scenes)`:"\u25B8 Details"}
          </button>`:S}
      ${n?Vl(t,r,i):S}
    </div>
  `}function Vl(t,n,e){return l`
    <div class="why">
      ${t.explanation?l`<div class="section">
            <div class="section-title">Scene evaluation</div>
            <div class="scenes">${t.explanation.scenes.map(r=>Yl(r,n))}</div>
          </div>`:S}
      ${t.actions.length?l`<div class="section">
            <div class="section-title">Actions taken</div>
            ${t.actions.map(r=>l`<div class="action-block">
                <div class="action-head">${Kl(r,n,e)}</div>
                ${(r.entity_ids??[]).map(i=>l`<div class="entity">${on(n,i)}</div>`)}
              </div>`)}
          </div>`:S}
    </div>
  `}var M=class extends b{constructor(){super(...arguments);this.category="";this.categoryName=null;this.open=!1;this._records=[];this._schemas={};this._expanded=new Set;this._loading=!0;this._error="";this._hasNew=!1}connectedCallback(){super.connectedCallback(),this._poll=setInterval(()=>this._checkNew(),5e3)}disconnectedCallback(){super.disconnectedCallback(),this._poll&&clearInterval(this._poll)}updated(e){this.open&&(e.has("open")||e.has("category")||e.has("scope"))&&this._load()}_mine(e){return e.filter(r=>r.scope_kind===this.scope.scope_kind&&r.scope_id===this.scope.scope_id&&r.category===this.category)}async _load(){this._error="",this._loading=!0,this._hasNew=!1,this._expanded=new Set;try{let e=await vr(this.hass);if(!this.isConnected)return;this._records=this._mine(e),this._loading=!1,this._loadSchemas()}catch(e){this._error=e.message||String(e),this._loading=!1}}async _loadSchemas(){let e=[...new Set(this._records.flatMap(s=>s.actions.map(o=>o.service)))].filter(s=>!(s in this._schemas));if(e.length===0)return;let r=await Promise.all(e.map(async s=>{try{return[s,await _e(this.hass,s)]}catch{return null}}));if(!this.isConnected)return;let i={...this._schemas};for(let s of r)s&&(i[s[0]]=s[1]);this._schemas=i}async _checkNew(){if(!(!this.open||!this.isConnected||document.visibilityState!=="visible"))try{let r=this._mine(await vr(this.hass))[0]?.timestamp??null,i=this._records[0]?.timestamp??null;r&&(!i||r>i)&&(this._hasNew=!0)}catch{}}_toggle(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):r.add(e),this._expanded=r}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){if(!this.open)return S;let e=this.categoryName??this.category;return l`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>${e}</h3>
          <button class="refresh ${this._hasNew?"has-new":""}" @click=${()=>this._load()}>
            ${this._hasNew?"\u25CF New traces \u2014 refresh":"Refresh"}
          </button>
          <button class="close" @click=${this._onClose} aria-label="Close">✕</button>
        </div>
        <div class="body">
          ${this._error?l`<p class="error">${this._error}</p>`:this._loading?l`<p class="empty">Loading…</p>`:this._records.length===0?l`<p class="empty">No traces for this category yet.</p>`:l`<div class="list">${this._records.map((r,i)=>{let s=`${r.event_id??i}|${r.timestamp??""}`;return ir(r,this._expanded.has(s),()=>this._toggle(s),this.hass,this._schemas)})}</div>`}
        </div>
      </div>
    `}};M.styles=[rr,y`
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
    `],u([m({attribute:!1})],M.prototype,"hass",2),u([m({attribute:!1})],M.prototype,"scope",2),u([m()],M.prototype,"category",2),u([m()],M.prototype,"categoryName",2),u([m({type:Boolean,reflect:!0})],M.prototype,"open",2),u([g()],M.prototype,"_records",2),u([g()],M.prototype,"_schemas",2),u([g()],M.prototype,"_expanded",2),u([g()],M.prototype,"_loading",2),u([g()],M.prototype,"_error",2),u([g()],M.prototype,"_hasNew",2),M=u([w("ambience-traces-modal")],M);var Jl={not_home:"Away",home:"Home"};function ds(t){return Jl[t]??fe(t)}function cs(t){return{state:t.live_state??"",attributes:Object.fromEntries(t.attributes.map(n=>[n.name,n.live_value==null?"":String(n.live_value)])),for:{h:0,m:0,s:0}}}function nr(t){return String(t).padStart(2,"0")}function Ql(t){return`${t.getFullYear()}-${nr(t.getMonth()+1)}-${nr(t.getDate())}`}function Xl(t){return`${nr(t.getHours())}:${nr(t.getMinutes())}`}var P=class extends b{constructor(){super(...arguments);this.category="";this.categoryName=null;this.open=!1;this._knobs=[];this._hasTime=!1;this._loading=!0;this._error="";this._values={};this._verdicts={};this._date="";this._time="";this._result=null;this._expanded=!1}updated(e){this.open&&(e.has("open")||e.has("category")||e.has("scope"))&&this._load()}_vkey(e){return`${e.condition}:${e.key}`}async _load(){this._error="",this._loading=!0,this._result=null,this._expanded=!1;let e=new Date;this._date=Ql(e),this._time=Xl(e);try{let r=await Gi(this.hass,this.scope,this.category);if(!this.isConnected)return;this._knobs=r.knobs,this._hasTime=r.has_time;let i={},s={};for(let o of r.knobs)o.kind==="entity"?i[o.entity_id]=cs(o):s[this._vkey(o)]=o.live_value;this._values=i,this._verdicts=s,this._loading=!1}catch(r){this._error=r.message||String(r),this._loading=!1}}_setState(e,r){this._values={...this._values,[e]:{...this._values[e],state:r}}}_setAttr(e,r,i){let s=this._values[e];this._values={...this._values,[e]:{...s,attributes:{...s.attributes,[r]:i}}}}_setFor(e,r,i){let s=this._values[e],o=Number.isFinite(i)&&i>0?Math.trunc(i):0;this._values={...this._values,[e]:{...s,for:{...s.for,[r]:o}}}}_setVerdict(e,r){this._verdicts={...this._verdicts,[e]:r}}_resetEntity(e){this._values={...this._values,[e.entity_id]:cs(e)}}_resetVerdict(e){this._verdicts={...this._verdicts,[this._vkey(e)]:e.live_value}}_buildOverrides(){let e={};for(let r of this._knobs){if(r.kind!=="entity")continue;let i=this._values[r.entity_id];if(!i)continue;let s={};for(let a of r.attributes){let c=i.attributes[a.name];if(!(c===void 0||c===""))if(a.control==="number"){let h=Number(c);Number.isNaN(h)||(s[a.name]=h)}else s[a.name]=c}let o={attributes:s};i.state!==""&&(o.state=i.state),(i.for.h||i.for.m||i.for.s)&&(o.for=i.for),(o.state!==void 0||o.for!==void 0||Object.keys(s).length>0)&&(e[r.entity_id]=o)}return e}_buildVerdicts(){let e={};for(let r of this._knobs)r.kind==="verdict"&&(e[r.condition]||(e[r.condition]={}),e[r.condition][r.key]=this._verdicts[this._vkey(r)]??r.live_value);return e}async _run(){this._error="";let e=new Date(`${this._date}T${this._time}`).toISOString();try{this._result=await Yi(this.hass,this.scope,this.category,e,this._buildOverrides(),this._buildVerdicts()),this._expanded=!1}catch(r){this._error=r.message||String(r)}}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?l`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>Simulate · ${this.categoryName??this.category}</h3>
          <button class="close" @click=${this._onClose} aria-label="Close">✕</button>
        </div>
        <div class="body">
          ${this._error?l`<p class="error">${this._error}</p>`:S}
          ${this._loading?l`<p>Loading…</p>`:l`
            ${this._hasTime?l`
              <p class="sec-title">When</p>
              <div class="when">
                <input type="date" .value=${this._date}
                  @change=${e=>this._date=e.target.value} />
                <input type="time" .value=${this._time}
                  @change=${e=>this._time=e.target.value} />
                <span class="hint">drives sun, time-of-day, weekday &amp; workday</span>
              </div>`:S}
            ${this._knobs.length?l`
              <p class="sec-title">Inputs this category depends on</p>
              ${this._knobs.map(e=>e.kind==="entity"?this._renderEntity(e):this._renderVerdict(e))}`:S}
            <div class="run-row"><button class="runbtn" @click=${()=>void this._run()}>Simulate ▸</button></div>
            ${this._result?l`<div class="result">${ir(this._result,this._expanded,()=>this._expanded=!this._expanded)}</div>`:S}
          `}
        </div>
      </div>`:S}_renderEntity(e){let r=this._values[e.entity_id],i=e.attributes.length>0;return l`
      <div class="row ${i?"has-attrs":""}">
        ${$r(this.hass,e.entity_id)}
        <div class="row-text">
          <div class="row-title">${J(this.hass,e.entity_id)}</div>
          <div class="row-detail">${e.entity_id}</div>
        </div>
        <div class="row-ctrl">
          ${this._renderControl(e,r?.state??"")}
          ${this._renderFor(e,r?.for??{h:0,m:0,s:0})}
          <button class="reset" data-reset=${e.entity_id} title="Reset to live"
            @click=${()=>this._resetEntity(e)}>↺</button>
        </div>
      </div>
      ${e.attributes.map((s,o)=>l`
        <div class="row attr ${o===e.attributes.length-1?"last-attr":""}">
          <div class="row-text"><div class="row-title">${ds(s.name)}</div></div>
          <div class="row-ctrl">
            <input class=${s.control==="number"?"num":""}
              type=${s.control==="number"?"number":"text"}
              data-attr=${`${e.entity_id}:${s.name}`}
              .value=${r?.attributes[s.name]??""}
              @input=${a=>this._setAttr(e.entity_id,s.name,a.target.value)} />
            <button class="reset" title="Reset to live"
              @click=${()=>this._resetEntity(e)}>↺</button>
          </div>
        </div>`)}
    `}_renderControl(e,r){if(e.control==="select")return l`<select data-entity=${e.entity_id} .value=${r}
        @change=${s=>this._setState(e.entity_id,s.target.value)}>
        ${(e.options??[r]).map(s=>l`<option value=${s} ?selected=${s===r}>${ds(s)}</option>`)}
      </select>`;let i=e.control==="number"?"number":"text";return l`<input class=${e.control==="number"?"num":""} type=${i} data-entity=${e.entity_id}
      .value=${r}
      @input=${s=>this._setState(e.entity_id,s.target.value)} />`}_renderFor(e,r){let i=s=>l`<input class="for-num" type="number" min="0"
      data-for=${`${e.entity_id}:${s}`} .value=${String(r[s])}
      @change=${o=>this._setFor(e.entity_id,s,Number(o.target.value))} />`;return l`<span class="for-ctrl" title="How long it has held this state (h:m:s)">
      <span class="for-label">For</span>${i("h")}<span>:</span>${i("m")}<span>:</span>${i("s")}
    </span>`}_renderVerdict(e){let r=this._vkey(e),i=this._verdicts[r]??e.live_value,s=e.entity_id?J(this.hass,e.entity_id):e.label,o=e.entity_id?$r(this.hass,e.entity_id):l`<ha-icon class="row-icon" icon="mdi:code-braces"></ha-icon>`;return l`
      <div class="row">
        ${o}
        <div class="row-text">
          <div class="row-title">${s}</div>
          ${e.entity_id?l`<div class="row-detail">${e.entity_id}</div>`:S}
        </div>
        <div class="row-ctrl">
          <select data-verdict=${r} .value=${String(i)}
            @change=${a=>this._setVerdict(r,a.target.value==="true")}>
            <option value="true" ?selected=${i}>True</option>
            <option value="false" ?selected=${!i}>False</option>
          </select>
          <button class="reset" title="Reset to live" @click=${()=>this._resetVerdict(e)}>↺</button>
        </div>
      </div>`}};P.styles=[rr,Qi,y`
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
    `],u([m({attribute:!1})],P.prototype,"hass",2),u([m({attribute:!1})],P.prototype,"scope",2),u([m()],P.prototype,"category",2),u([m()],P.prototype,"categoryName",2),u([m({type:Boolean,reflect:!0})],P.prototype,"open",2),u([g()],P.prototype,"_knobs",2),u([g()],P.prototype,"_hasTime",2),u([g()],P.prototype,"_loading",2),u([g()],P.prototype,"_error",2),u([g()],P.prototype,"_values",2),u([g()],P.prototype,"_verdicts",2),u([g()],P.prototype,"_date",2),u([g()],P.prototype,"_time",2),u([g()],P.prototype,"_result",2),u([g()],P.prototype,"_expanded",2),P=u([w("ambience-simulator-modal")],P);function sr(t){return{scenes:t.scenes??[]}}var Gr=1024,us="ambience-conditions-hint-dismissed";function Zl(){try{return window.localStorage.getItem(us)==="1"}catch{return!1}}function ed(){try{window.localStorage.setItem(us,"1")}catch{}}function td(t,n,e){if(t!==void 0&&n!==void 0)return Math.floor((t+n)/2);let r=e.map(i=>i.priority??0);return t===void 0&&n===void 0?Gr:t===void 0?Math.max(...r)+Gr:Math.min(...r)-Gr}var T=class extends b{constructor(){super(...arguments);this._areas=[];this._floors=[];this._areaConfigs=new Map;this._floorConfigs=new Map;this._house={scenes:[]};this._switchEntityIds=new Map;this._conditions=[];this._actions=[];this._categories=[];this._schemas={};this._expanded=new Set;this._error="";this._staticLoaded=!1;this._conditionsHintDismissed=!1;this._editing=null;this._viewingTraces=null;this._viewingSimulator=null;this._filterCategory="";this._filterOpen=!1;this._onExposedActionsChanged=async()=>{try{let e=await at(this.hass);if(!this.isConnected)return;this._actions=e,await this._refreshSchemas(e)}catch{}};this._onCategoriesChanged=async()=>{try{let e=await ct(this.hass);if(!this.isConnected)return;this._categories=e}catch{}};this._onConditionsChanged=async()=>{try{let[e,r]=await Promise.all([lt(this.hass),dt(this.hass)]);if(!this.isConnected)return;this._dayConfig=e,this._weatherConfig=r}catch{}}}async _refreshSchemas(e){let r=await Promise.all(e.map(async s=>{try{let o=await _e(this.hass,s.id);return[s.id,o]}catch{return[s.id,null]}}));if(!this.isConnected)return;let i={};for(let[s,o]of r)o&&(i[s]=o);this._schemas=i}async connectedCallback(){super.connectedCallback(),this._conditionsHintDismissed=Zl(),window.addEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("ambience-conditions-changed",this._onConditionsChanged),await this._loadStatic(),await Promise.all([this._refreshAreas(),this._refreshFloors(),this._refreshHouse(),this._refreshSwitches()]),await this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("ambience-conditions-changed",this._onConditionsChanged),this._unsubArea?.(),this._unsubArea=void 0,this._unsubFloor?.(),this._unsubFloor=void 0}async _loadStatic(){try{let[e,r,i,s,o,a]=await Promise.all([jt(this.hass),at(this.hass),zt(this.hass),lt(this.hass),dt(this.hass),ct(this.hass)]);if(!this.isConnected)return;this._conditions=e,this._actions=r,this._periods=i,this._dayConfig=s,this._weatherConfig=o,this._categories=a,this._staticLoaded=!0,await this._refreshSchemas(r)}catch(e){this._error=e.message||String(e)}}async _refreshAreas(){try{let e=await Si(this.hass),r=this._areaConfigs,i=new Map;if(await Promise.all(e.map(async s=>{let o=r.get(s.area_id);if(o){i.set(s.area_id,o);return}i.set(s.area_id,sr(await Ei(this.hass,s.area_id)))})),!this.isConnected)return;this._areas=e,this._areaConfigs=i}catch(e){this._error=e.message||String(e)}}async _refreshFloors(){try{let e=(await Ti(this.hass)).slice().sort((s,o)=>s.name.localeCompare(o.name)),r=this._floorConfigs,i=new Map;if(await Promise.all(e.map(async s=>{let o=r.get(s.floor_id);if(o){i.set(s.floor_id,o);return}i.set(s.floor_id,sr(await Li(this.hass,s.floor_id)))})),!this.isConnected)return;this._floors=e,this._floorConfigs=i}catch(e){this._error=e.message||String(e)}}async _refreshHouse(){try{let e=sr(await Hi(this.hass));if(!this.isConnected)return;this._house=e}catch(e){this._error=e.message||String(e)}}async _refreshSwitches(){try{let e=await Bi(this.hass);if(!this.isConnected)return;this._switchEntityIds=new Map(e.map(r=>{let i=r.scope_kind==="house"?{kind:"house"}:{kind:r.scope_kind,id:r.scope_id};return[j(i),r.entity_id]}))}catch(e){this._error=e.message||String(e)}}async _subscribe(){let e=this.hass.connection.subscribeEvents(o=>{if(o.data.action==="remove"){let a=o.data.area_id,c=new Set(this._expanded);c.delete(`area:${a}`),this._expanded=c,this._editing?.scope.kind==="area"&&this._editing.scope.id===a&&(this._editing=null)}this._refreshAreas(),o.data.action!=="update"&&this._refreshSwitches()},"area_registry_updated"),r=this.hass.connection.subscribeEvents(o=>{if(o.data.action==="remove"){let a=o.data.floor_id,c=new Set(this._expanded);c.delete(`floor:${a}`),this._expanded=c,this._editing?.scope.kind==="floor"&&this._editing.scope.id===a&&(this._editing=null)}this._refreshFloors(),o.data.action!=="update"&&this._refreshSwitches()},"floor_registry_updated"),[i,s]=await Promise.all([e,r]);this.isConnected?(this._unsubArea=i,this._unsubFloor=s):(i(),s())}_getConfig(e){return e.kind==="house"?this._house:e.kind==="area"?this._areaConfigs.get(e.id):this._floorConfigs.get(e.id)}_setConfig(e,r){if(e.kind==="house")this._house=r;else if(e.kind==="area"){let i=new Map(this._areaConfigs);i.set(e.id,r),this._areaConfigs=i}else{let i=new Map(this._floorConfigs);i.set(e.id,r),this._floorConfigs=i}}async _mutate(e,r){let i=this._getConfig(e);this._setConfig(e,r),this._error="";try{let s;return e.kind==="house"?s=await Ni(this.hass,r):e.kind==="area"?s=await Ci(this.hass,e.id,r):s=await Ai(this.hass,e.id,r),this._setConfig(e,sr(s.config)),!0}catch(s){return i&&this._setConfig(e,i),this._error=s.message||String(s),!1}}_toggleExpand(e){let r=j(e),i=new Set(this._expanded);i.has(r)?i.delete(r):i.add(r),this._expanded=i}_addScene(e){let r=this._getConfig(e);r&&(this._editing={scope:e,index:r.scenes.length,isNew:!0})}_editScene(e,r){this._editing={scope:e,index:r.detail.index,isNew:!1}}_duplicateScene(e,r){let i=this._getConfig(e);if(!i)return;let s=i.scenes[r.detail.index];if(!s)return;let o=ut(JSON.parse(JSON.stringify(s)));this._editing={scope:e,index:i.scenes.length,isNew:!0,seed:o}}_deleteScene(e,r){let i=this._getConfig(e);if(!i)return;let s=i.scenes.filter((o,a)=>a!==r.detail.index);this._mutate(e,{...i,scenes:s})}_reorderScenes(e,r){let i=this._getConfig(e);if(!i)return;let{from:s,to:o}=r.detail,a=i.scenes[s];if(!a||i.scenes[o]?.category!==a.category)return;let c=[...i.scenes];c.splice(s,1),c.splice(o,0,a);let h=k=>c[k]&&c[k].category===a.category,f=o-1;for(;f>=0&&!h(f);)f--;let p=o+1;for(;p<c.length&&!h(p);)p++;let _=f>=0?c[f].priority:void 0,v=p<c.length?c[p].priority:void 0,x=td(_,v,i.scenes.filter(k=>k.category===a.category));c[o]={...a,priority:x,pinned:!0},this._mutate(e,{...i,scenes:c})}_unpinScene(e,r){let i=this._getConfig(e);if(!i)return;let s=i.scenes.map((o,a)=>a===r.detail.index?{...o,pinned:!1}:o);this._mutate(e,{...i,scenes:s})}_toggleSceneEnabled(e,r){let i=this._getConfig(e);if(!i)return;let s=i.scenes.map((o,a)=>{if(a!==r.detail.index)return o;if(r.detail.enabled){let c={...o};return delete c.enabled,c}return{...o,enabled:!1}});this._mutate(e,{...i,scenes:s})}async _saveScene(e){let r=this._editing;if(this._editing=null,!r)return;let{scene:i,scope:s}=e.detail;if(j(s)===j(r.scope)){let h=this._getConfig(s);if(!h)return;let f=[...h.scenes];r.isNew?f.push(i):f[r.index]=i,await this._mutate(s,{...h,scenes:f});return}let o=ut(i),a=this._getConfig(s);if(!a)return;if(await this._mutate(s,{...a,scenes:[...a.scenes,o]})&&!r.isNew){let h=this._getConfig(r.scope);if(h){let f=h.scenes.filter((p,_)=>_!==r.index);await this._mutate(r.scope,{...h,scenes:f})}}}async _callApi(e){this._error="";try{await e()}catch(r){this._error=r.message||String(r)}}_applyScenes(e,r){return this._callApi(()=>Ri(this.hass,e,r))}_runSceneActions(e,r){return this._callApi(()=>Fi(this.hass,e,r.detail.index))}_cancelScene(){this._editing=null}_onScopeMenu(e,r,i,s){s==="run"&&this._applyScenes(e)}_showTraces(e,r){let i=this._categories.find(s=>s.id===r);this._viewingTraces={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:r,categoryName:i?.name??null}}_showSimulator(e,r){let i=this._categories.find(s=>s.id===r);this._viewingSimulator={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:r,categoryName:i?.name??null}}_selectFilter(e){this._filterCategory=e,this._filterOpen=!1}_renderFilterEntry(e){return e===null?l`
        ${Ue(void 0,"mdi:filter-variant")}
        <span class="category-name"
          >${d(this.hass,"ui.all_categories","All categories")}</span
        >
      `:l`
      ${Ue(e.color,e.icon)}
      <span class="category-name">${e.name}</span>
    `}_renderFilter(){if(this._categories.length<=1)return"";let e=[...this._categories].sort((i,s)=>i.name.localeCompare(s.name)),r=this._categories.find(i=>i.id===this._filterCategory)??null;return l`
      <div class="category-filter-row">
        <span class="category-filter-label"
          >${d(this.hass,"ui.filter_by_category","Filter by category")}</span
        >
        <div class="category-filter">
          <button
            class="category-filter-trigger"
            aria-haspopup="listbox"
            aria-expanded=${this._filterOpen}
            @click=${()=>{this._filterOpen=!this._filterOpen}}
          >
            ${this._renderFilterEntry(r)}
            <ha-icon class="caret" icon="mdi:menu-down"></ha-icon>
          </button>
          ${this._filterOpen?l`
                <div
                  class="category-filter-backdrop"
                  @click=${()=>{this._filterOpen=!1}}
                ></div>
                <div class="category-filter-menu" role="listbox">
                  <button
                    class="category-filter-option"
                    role="option"
                    aria-selected=${this._filterCategory===""}
                    @click=${()=>this._selectFilter("")}
                  >
                    ${this._renderFilterEntry(null)}
                  </button>
                  ${e.map(i=>l`<button
                        class="category-filter-option"
                        role="option"
                        aria-selected=${this._filterCategory===i.id}
                        @click=${()=>this._selectFilter(i.id)}
                      >
                        ${this._renderFilterEntry(i)}
                      </button>`)}
                </div>
              `:""}
        </div>
      </div>
    `}_defaultCategoryId(){return this._filterCategory!==""?this._filterCategory:[...this._categories].sort((r,i)=>r.name.localeCompare(i.name))[0]?.id??""}get _editingScene(){return this._editing?this._editing.seed?this._editing.seed:this._editing.isNew?{when:{},actions:[],category:this._defaultCategoryId()}:this._getConfig(this._editing.scope)?.scenes[this._editing.index]??null:null}get _editorConditions(){return this._editing?this._conditions.slice().sort((e,r)=>r.priority-e.priority):[]}get _takenSceneNames(){let e=new Map,r=this._editing,i=(s,o)=>{if(!o)return;let a=!!r&&!r.isNew&&j(r.scope)===j(s);o.scenes.forEach((c,h)=>{if(a&&h===r.index)return;let f=c.name?.trim().toLowerCase();if(!f)return;let p=Bt(s,c.category),_=e.get(p);_||(_=new Set,e.set(p,_)),_.add(f)})};i({kind:"house"},this._house);for(let s of this._floors)i({kind:"floor",id:s.floor_id},this._floorConfigs.get(s.floor_id));for(let s of this._areas)i({kind:"area",id:s.area_id},this._areaConfigs.get(s.area_id));return e}get _scopeOptions(){let e=d(this.hass,"ui.scope_floor_prefix","Floor: "),r=d(this.hass,"ui.scope_area_prefix","Area: ");return[{scope:{kind:"house"},label:d(this.hass,"ui.scope_house","House")},...this._floors.map(i=>({scope:{kind:"floor",id:i.floor_id},label:`${e}${i.name}`})),...this._areas.map(i=>({scope:{kind:"area",id:i.area_id},label:`${r}${i.name}`}))]}_matchingSceneCount(e){return this._filterCategory===""?e.scenes.length:e.scenes.filter(r=>r.category===this._filterCategory).length}_summary(e){if(e.scenes.length===0)return d(this.hass,"ui.not_configured","not configured");let r=this._matchingSceneCount(e),i=r===1?d(this.hass,"ui.scene_singular","scene"):d(this.hass,"ui.scene_plural","scenes");return`${r} ${i}`}get _weatherUnconfigured(){return!this._weatherConfig||this._weatherConfig.entity==null}get _workdayUnconfigured(){let e=this._dayConfig;return!e||e.workday_sensor==null&&e.workday_calendar==null}get _conditionsUnconfigured(){return this._weatherUnconfigured||this._workdayUnconfigured}_conditionsHintText(){let e=this._weatherUnconfigured,r=this._workdayUnconfigured;return e&&r?{title:d(this.hass,"ui.conditions_hint_title","Optional: set up Workday & Weather"),body:d(this.hass,"ui.conditions_hint_body","Configure Workday and Weather in Conditions to use them in your scene conditions.")}:r?{title:d(this.hass,"ui.conditions_hint_title_workday","Optional: set up Workday"),body:d(this.hass,"ui.conditions_hint_body_workday","Configure Workday in Conditions to use it in your scene conditions.")}:{title:d(this.hass,"ui.conditions_hint_title_weather","Optional: set up Weather"),body:d(this.hass,"ui.conditions_hint_body_weather","Configure Weather in Conditions to use it in your scene conditions.")}}_openSettings(e){this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:e},bubbles:!0,composed:!0}))}_dismissConditionsHint(){this._conditionsHintDismissed=!0,ed()}_renderBanners(){if(!this._staticLoaded)return"";if(this._actions.length===0)return l`
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
      `}return""}_orderedScopeRows(e,r){let i=[{scope:{kind:"house"},name:d(this.hass,"ui.scope_house","House"),cfg:this._house,rowClass:"house"}];for(let a of this._floors){let c=this._floorConfigs.get(a.floor_id);c&&i.push({scope:{kind:"floor",id:a.floor_id},name:`${e}${a.name}`,cfg:c,rowClass:"floor"})}for(let a of this._areas){let c=this._areaConfigs.get(a.area_id);c&&i.push({scope:{kind:"area",id:a.area_id},name:`${r}${a.name}`,cfg:c,rowClass:"area"})}let s=[],o=[];for(let a of i)(this._isSwitchedOff(a.scope)?o:s).push(a);return[...s,...o]}_isSwitchedOff(e){let r=this._switchEntityIds.get(j(e));return r?this.hass.states?.[r]?.state==="off":!1}render(){let e=d(this.hass,"ui.scope_floor_prefix","Floor: "),r=d(this.hass,"ui.scope_area_prefix","Area: ");return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${this._renderBanners()}
      ${this._renderFilter()}
      <ul>
        ${ki(this._orderedScopeRows(e,r),i=>j(i.scope),i=>this._renderScopeRow(i.scope,i.name,i.cfg,i.rowClass))}
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
        .scene=${this._editingScene}
        .conditions=${this._editorConditions}
        .periods=${this._periods}
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
      <ambience-simulator-modal
        ?open=${this._viewingSimulator!==null}
        .hass=${this.hass}
        .scope=${this._viewingSimulator?.scope??{scope_kind:"house",scope_id:null}}
        .category=${this._viewingSimulator?.category??""}
        .categoryName=${this._viewingSimulator?.categoryName??null}
        @close=${()=>{this._viewingSimulator=null}}
      ></ambience-simulator-modal>
    `}_renderScopeRow(e,r,i,s){let o=this._expanded.has(j(e)),a=e.kind==="house"?"":e.id,c=this._isSwitchedOff(e)?"off":this._matchingSceneCount(i)===0?"empty":"";return l`
      <li class="scope-row ${s}" data-id=${a}>
        <div
          class="scope-header ${o?"open":""} ${c}"
          @click=${()=>this._toggleExpand(e)}
        >
          <span class="chevron ${o?"open":""}">▶</span>
          <ha-icon class="scope-icon" icon=${ht(e,this.hass)}></ha-icon>
          <span class="scope-name">${r}</span>
          <span class="scope-summary">${this._summary(i)}</span>
          ${this._renderScopeSwitch(e)}
          <ambience-kebab-menu
            data-test="scope-kebab"
            .hass=${this.hass}
            .items=${[{id:"run",label:d(this.hass,"ui.run","Run"),icon:"mdi:play"}]}
            @menu-action=${h=>this._onScopeMenu(e,r,i,h.detail.id)}
            @click=${h=>h.stopPropagation()}
          ></ambience-kebab-menu>
        </div>
        ${o?l`
              <div class="scope-body">
                <ambience-scenes-list
                  .scenes=${i.scenes}
                  .periods=${this._periods}
                  .weatherConfig=${this._weatherConfig}
                  .conditions=${this._conditions}
                  .availableActions=${this._actions}
                  .schemas=${this._schemas}
                  .categories=${this._categories}
                  .filterCategory=${this._filterCategory}
                  .hass=${this.hass}
                  @add-scene=${()=>this._addScene(e)}
                  @edit-scene=${h=>this._editScene(e,h)}
                  @duplicate-scene=${h=>this._duplicateScene(e,h)}
                  @delete-scene=${h=>this._deleteScene(e,h)}
                  @reorder-scenes=${h=>this._reorderScenes(e,h)}
                  @unpin-scene=${h=>this._unpinScene(e,h)}
                  @toggle-scene-enabled=${h=>this._toggleSceneEnabled(e,h)}
                  @run-scene-actions=${h=>this._runSceneActions(e,h)}
                  @apply-category=${h=>this._applyScenes(e,h.detail.categoryId)}
                  @show-traces=${h=>this._showTraces(e,h.detail.category)}
                  @show-simulator=${h=>this._showSimulator(e,h.detail.category)}
                ></ambience-scenes-list>
              </div>
            `:""}
      </li>
    `}_renderScopeSwitch(e){let r=this._switchEntityIds.get(j(e));if(!r)return"";let i=this.hass.states?.[r]?.state==="on",s=a=>a.stopPropagation(),o=a=>{a.stopPropagation(),this.hass.callService?.("switch",i?"turn_off":"turn_on",{entity_id:r})};return customElements.get("ha-switch")?l`<ha-switch
        class="scope-switch"
        data-test="scope-switch"
        .checked=${i}
        @click=${s}
        @change=${o}
      ></ha-switch>`:l`<input
      class="scope-switch"
      data-test="scope-switch"
      type="checkbox"
      .checked=${i}
      @click=${s}
      @change=${o}
    />`}};T.styles=[Ut,y`
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
      .scope-body {
        padding: 0.5rem 1rem 1rem 1rem;
        border-top: 1px solid var(--divider-color, #e0e0e0);
      }
      .category-filter-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 0 0 1.25rem 0;
      }
      .category-filter-label {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--secondary-text-color, #888);
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
      /* Transparent full-screen catcher so any outside click closes the menu. */
      .category-filter-backdrop {
        position: fixed;
        inset: 0;
        z-index: 10;
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
      .category-filter-option {
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
        color: var(--primary-text-color, #212121);
        cursor: pointer;
        font: inherit;
        font-size: 1rem;
        text-align: left;
      }
      .category-filter-option:hover {
        background: var(--secondary-background-color, #f5f5f5);
      }
      .category-filter-option[aria-selected="true"] {
        background: var(--secondary-background-color, #eee);
        font-weight: 600;
      }
      /* Swatch shell + sizing come from categorySwatchStyles (2rem default); it is
       always present so rows and the trigger keep a consistent height. */
      .category-name {
        flex: 1;
      }
    `],u([m({attribute:!1})],T.prototype,"hass",2),u([g()],T.prototype,"_areas",2),u([g()],T.prototype,"_floors",2),u([g()],T.prototype,"_areaConfigs",2),u([g()],T.prototype,"_floorConfigs",2),u([g()],T.prototype,"_house",2),u([g()],T.prototype,"_switchEntityIds",2),u([g()],T.prototype,"_conditions",2),u([g()],T.prototype,"_actions",2),u([g()],T.prototype,"_categories",2),u([g()],T.prototype,"_schemas",2),u([g()],T.prototype,"_periods",2),u([g()],T.prototype,"_dayConfig",2),u([g()],T.prototype,"_weatherConfig",2),u([g()],T.prototype,"_expanded",2),u([g()],T.prototype,"_error",2),u([g()],T.prototype,"_staticLoaded",2),u([g()],T.prototype,"_conditionsHintDismissed",2),u([g()],T.prototype,"_editing",2),u([g()],T.prototype,"_viewingTraces",2),u([g()],T.prototype,"_viewingSimulator",2),u([g()],T.prototype,"_filterCategory",2),u([g()],T.prototype,"_filterOpen",2),T=u([w("ambience-scopes-view")],T);var re=class extends b{constructor(){super(...arguments);this._categories=[];this._error="";this._editing=null;this._modalError=""}async connectedCallback(){super.connectedCallback();try{this._categories=await ct(this.hass)}catch(e){this._error=e.message||String(e)}}_sorted(){return[...this._categories].sort((e,r)=>e.name.localeCompare(r.name))}_validate(e){let r=e.name.trim();if(r==="")return d(this.hass,"ui.category_name_blank_error","Category names can't be empty.");let i=r.toLocaleLowerCase();return this._categories.some(o=>o.id!==e.id&&o.name.trim().toLocaleLowerCase()===i)?d(this.hass,"ui.category_name_duplicate_error","Two categories can't have the same name."):""}_openEditor(e){this._editing={...e},this._modalError=""}_addCategory(){let e=crypto.randomUUID().replace(/-/g,"");this._editing={id:e,name:""},this._modalError=""}_closeModal(){this._editing=null,this._modalError=""}_patchDraft(e){this._editing&&(this._editing={...this._editing,...e})}_onName(e){this._patchDraft({name:e.target.value})}_onIcon(e){this._patchDraft({icon:e||void 0})}_onColor(e){this._patchDraft({color:e})}_save(){if(!this._editing)return;let e=this._validate(this._editing);if(e){this._modalError=e;return}let r={...this._editing,name:this._editing.name.trim()},i=this._categories.some(s=>s.id===r.id);this._categories=i?this._categories.map(s=>s.id===r.id?r:s):[...this._categories,r],this._closeModal(),qi(this.hass,this._categories).then(()=>{window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(s=>{this._error=s.message||String(s)})}_deleteCategory(){if(!this._editing)return;let e=this._editing.id;if(this._categories.length<=1){this._modalError=d(this.hass,"ui.category_delete_blocked_last","You can't delete the last category.");return}let r=this._categories;this._categories=this._categories.filter(i=>i.id!==e),Ki(this.hass,e).then(()=>{this._closeModal(),window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(i=>{this._categories=r;let s=i.code;s==="category_in_use"?this._modalError=d(this.hass,"ui.category_delete_blocked_in_use","This category still has scenes \u2014 move or delete them first."):s==="category_last"?this._modalError=d(this.hass,"ui.category_delete_blocked_last","You can't delete the last category."):this._modalError=i.message||String(i)})}_renderIconField(){return customElements.get("ha-icon-picker")?l`<ha-icon-picker
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
        ${yr.map(r=>l`<button
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
        ${this._sorted().map(e=>{let r=br(e.color);return l`<button class="category-row" @click=${()=>this._openEditor(e)}>
            <span class="row-icon">${e.icon?l`<ha-icon icon=${e.icon}></ha-icon>`:""}</span>
            <span class="row-swatch ${r?"":"none"}" style=${r?`background: ${r}`:""}></span>
            <span class="row-name">${e.name}</span>
          </button>`})}
      </div>
      <button class="add" @click=${()=>this._addCategory()}>
        ${d(this.hass,"ui.category_add","+ Add category")}
      </button>
      ${this._renderModal()}
    `}};re.styles=y`
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
  `,u([m({attribute:!1})],re.prototype,"hass",2),u([g()],re.prototype,"_categories",2),u([g()],re.prototype,"_error",2),u([g()],re.prototype,"_editing",2),u([g()],re.prototype,"_modalError",2),re=u([w("ambience-categories-settings")],re);var xe=class extends b{constructor(){super(...arguments);this._defaults={name:"Ambience",auto_on_delay_seconds:7200};this._error=""}async connectedCallback(){super.connectedCallback();try{this._defaults=await Ui(this.hass)}catch(e){this._error=e.message||String(e)}}async _safeSave(e){try{await e(),this._error=""}catch(r){this._error=r.message||String(r)}}_onDefaultName(e){let r=e.target.value.trim();r&&(this._defaults={...this._defaults,name:r},this._safeSave(()=>_r(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds)))}_onDefaultDelay(e){let r=e.target.value;r===""||!Number.isFinite(Number(r))||Number(r)<0||(this._defaults={...this._defaults,auto_on_delay_seconds:Math.floor(Number(r))},this._safeSave(()=>_r(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds)))}render(){return l`
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
    `}};xe.styles=y`
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
  `,u([m({attribute:!1})],xe.prototype,"hass",2),u([g()],xe.prototype,"_defaults",2),u([g()],xe.prototype,"_error",2),xe=u([w("ambience-ambience-settings")],xe);var ue=class extends b{constructor(){super(...arguments);this.conditionName="";this.conditionDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let e=q(this.hass,this.conditionName);return l`
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
    `}};ue.styles=y`
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
  `,u([m({attribute:!1})],ue.prototype,"hass",2),u([m()],ue.prototype,"conditionName",2),u([m()],ue.prototype,"conditionDescription",2),u([g()],ue.prototype,"_expanded",2),ue=u([w("ambience-condition-card")],ue);function Je(t){return t.scope_kind==="house"?"House":t.scope_kind==="floor"?`Floor: ${t.scope_id??""}`:t.scope_id??""}var rd=/^[a-z][a-z0-9_]*$/;function id(t){return t.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var Y=class extends b{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this.takenIds=new Set;this._label="";this._def=this.initial;this._error=""}connectedCallback(){super.connectedCallback(),this._label=this.initial.label??"",this._def=this.initial}_onLabelInput(e){this._label=e.target.value}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_validate(e){if(!this.existingId){if(!this._label.trim())return d(this.hass,"ui.error_enter_name","Please enter a name.");if(!e)return d(this.hass,"ui.error_start_letter","Name must start with a letter.");if(!rd.test(e))return d(this.hass,"ui.error_start_letter","Name must start with a letter.");if(this.takenIds.has(e))return d(this.hass,"ui.error_name_exists","A period with this name already exists. Choose a different name.")}return""}_onSave(){let e=this.existingId??id(this._label),r=this._validate(e);if(r){this._error=r,this.performUpdate();return}let i={from:this._def.from,to:this._def.to,label:this._label.trim()||null};this.dispatchEvent(new CustomEvent("period-save",{detail:{id:e,definition:i},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("period-cancel",{bubbles:!0,composed:!0}))}render(){let e=this.existingId?d(this.hass,"ui.period_modal_edit_title",'Edit "{name}"').replace("{name}",this.initial?.label??this.existingId):d(this.hass,"ui.period_modal_add_title","Add custom period");return l`
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
    `}};Y.styles=y`
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
  `,u([m({attribute:!1})],Y.prototype,"hass",2),u([m({attribute:!1})],Y.prototype,"existingId",2),u([m({attribute:!1})],Y.prototype,"initial",2),u([m({attribute:!1})],Y.prototype,"takenIds",2),u([g()],Y.prototype,"_label",2),u([g()],Y.prototype,"_def",2),u([g()],Y.prototype,"_error",2),Y=u([w("ambience-period-edit-modal")],Y);function hs(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=Me(n,t.anchor);if(t.offset_min===0)return e;let r=Math.abs(t.offset_min),i=r%60===0?`${r/60}${d(n,"ui.unit_hour_abbr","h")}`:`${r}${d(n,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${i}`}function ps(t,n){return`${hs(t.from,n)} \u2192 ${hs(t.to,n)}`}var he=class extends b{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[]}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){this._view=await zt(this.hass)}async _saveState(e){let r=await Ii(this.hass,e,this._view.hidden);this._warnings=r.warnings,await this._reload()}_onEdit(e,r){this._modal={mode:"edit",id:e,initial:r}}async _onDelete(e){let r={...this._view.custom};delete r[e],await this._saveState(r)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:r,definition:i}=e.detail,s={...this._view.custom,[r]:i};this._modal={mode:"closed"},await this._saveState(s)}_onModalCancel(){this._modal={mode:"closed"}}_renderBuiltinRow(e,r,i){return l`
      <div class="row ${i?"overridden":""}">
        <span class="name">${oe(this.hass,e,{})}</span>
        <span class="def">${ps(r,this.hass)}</span>
        <span class="badge">${d(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${i?"":l`<button class="icon" title=${d(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(e,r)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(e,r){return l`
      <div class="row custom">
        <span class="name">${oe(this.hass,e,this._view.custom)}</span>
        <span class="def">${ps(r,this.hass)}</span>
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
            <strong>${d(this.hass,"ui.period_warning_prefix","Warning:")}</strong> ${d(this.hass,"ui.period_warning_text","some scenes now reference missing periods:")}
            <ul>
              ${this._warnings.map(r=>l`<li>${Je(r)} / "${r.scene_name}" → ${r.missing_period}</li>`)}
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
    `}};he.styles=y`
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
  `,u([m({attribute:!1})],he.prototype,"hass",2),u([g()],he.prototype,"_view",2),u([g()],he.prototype,"_modal",2),u([g()],he.prototype,"_warnings",2),he=u([w("ambience-time-of-day-config")],he);var ke=class extends b{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[]}async connectedCallback(){super.connectedCallback(),this._config=await lt(this.hass)}async _save(e){this._config=e;let r=await Mi(this.hass,e.workday_sensor,e.workday_calendar);this._warnings=r.warnings??[],window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=[{name:"workday_sensor",selector:{entity:{integration:"workday",domain:"binary_sensor"}}}],r=[{name:"workday_calendar",selector:{entity:{integration:"workday",domain:"calendar"}}}];return l`
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
            ${this._warnings.map(i=>l`<li>${Je(i)} / "${i.scene_name}" → ${i.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};ke.styles=y`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,u([m({attribute:!1})],ke.prototype,"hass",2),u([g()],ke.prototype,"_config",2),u([g()],ke.prototype,"_warnings",2),ke=u([w("ambience-day-config")],ke);var nd=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],pe=class extends b{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._warnings=[];this._expanded=new Set}async connectedCallback(){super.connectedCallback(),this._config=await dt(this.hass)}async _persist(){let e=await ji(this.hass,this._config.entity,this._config.groups);this._warnings=e.warnings??[],window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onEntityChange(e){this._config={...this._config,entity:e.detail.value||null},this._persist()}_nextGroupId(e){let r=new Set(e.map(i=>i.id));for(let i=1;i<=e.length+1;i++){let s=`group_${i}`;if(!r.has(s))return s}return`group_${e.length+1}`}_addGroup(){let e=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:e,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,e]),this._persist()}_toggleExpand(e){let r=new Set(this._expanded);r.has(e)?r.delete(e):r.add(e),this._expanded=r}_updateGroup(e,r){this._config={...this._config,groups:this._config.groups.map((i,s)=>s===e?{...i,...r}:i)},this._persist()}_removeGroup(e){let r=this._config.groups[e];if(this._config={...this._config,groups:this._config.groups.filter((i,s)=>s!==e)},r){let i=new Set(this._expanded);i.delete(r.id),this._expanded=i}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:nd.map(e=>({value:e,label:ze(this.hass,e)}))}}}]}_renderConditions(e,r){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:r.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation(),this._updateGroup(e,{conditions:s.detail.value.conditions??[]})}}
      ></ha-form>`;let i=r.conditions.map(s=>ze(this.hass,s));return l`<span class="conditions-list">${i.join(", ")}</span>`}_renderGroup(e,r){let i=this._expanded.has(r.id),s=r.conditions.map(o=>ze(this.hass,o)).join(", ");return l`
      <div class="group">
        <div class="group-header" @click=${()=>this._toggleExpand(r.id)}>
          <span class="chevron ${i?"open":""}">▶</span>
          <span class="label">${r.label}</span>
          <span class="codes">${s}</span>
          <button
            class="icon"
            title=${d(this.hass,"ui.title_delete","Delete")}
            @click=${o=>{o.stopPropagation(),this._removeGroup(e)}}
          >✕</button>
        </div>
        ${i?l`<div class="body" @click=${o=>o.stopPropagation()}>
              <input
                .value=${r.label}
                aria-label=${r.label}
                @change=${o=>this._updateGroup(e,{label:o.target.value})}
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
          <ul>${this._warnings.map(r=>l`<li>${Je(r)} / "${r.scene_name}" → ${r.reason}</li>`)}</ul>
        </div>
      `:""}
    `}};pe.styles=y`
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
  `,u([m({attribute:!1})],pe.prototype,"hass",2),u([g()],pe.prototype,"_config",2),u([g()],pe.prototype,"_warnings",2),u([g()],pe.prototype,"_expanded",2),pe=u([w("ambience-weather-config")],pe);var sd=new Set(["time_of_day","day","weather"]),Se=class extends b{constructor(){super(...arguments);this._conditions=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._conditions=await jt(this.hass)}catch(e){this._error=e.message||String(e)}}render(){let e=this._conditions.filter(r=>sd.has(r.name)).slice().sort((r,i)=>i.priority-r.priority);return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${e.map(r=>l`
        <ambience-condition-card .hass=${this.hass} .conditionName=${r.name} .conditionDescription=${r.description}>
          ${r.name==="time_of_day"?l`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`:r.name==="day"?l`<ambience-day-config .hass=${this.hass}></ambience-day-config>`:r.name==="weather"?l`<ambience-weather-config .hass=${this.hass}></ambience-weather-config>`:l``}
        </ambience-condition-card>
      `)}
    `}};Se.styles=y`
    :host { display: block; }
    .error { color: var(--error-color, #d32f2f); }
  `,u([m({attribute:!1})],Se.prototype,"hass",2),u([g()],Se.prototype,"_conditions",2),u([g()],Se.prototype,"_error",2),Se=u([w("ambience-conditions-settings")],Se);var H=class extends b{constructor(){super(...arguments);this._actions=[];this._services=[];this._schemas={};this._fieldSchemas={};this._addSchema=[];this._serviceById=new Map;this._availableServices=[];this._expanded=new Set;this._adding=!1;this._warnings=[];this._loadError=null;this._saveError=null;this._loaded=!1;this._editingDefault=null;this._editingOriginalValue=void 0;this._editingOriginalHad=!1;this._drag=new Be(this,(e,r)=>{let i=[...this._actions],[s]=i.splice(e,1);i.splice(r,0,s),this._actions=i,this._autoSave()});this._onDocPointerDown=e=>{let r=e.composedPath();this._collapseAddFormOnClickAway(r),this._cancelEditingDefaultOnClickAway(r)}}_collapseAddFormOnClickAway(e){if(!this._adding)return;let r=this.shadowRoot?.querySelector(".add-row"),i=!!r&&e.includes(r),s=e.some(o=>o instanceof Element&&H._OVERLAY_TAG_RE.test(o.localName));!i&&!s&&(this._adding=!1)}_cancelEditingDefaultOnClickAway(e){if(this._editingDefault===null)return;let r=this.shadowRoot?.querySelector(`.field-row-editor[data-editing-key="${this._editingDefault}"]`);(!r||!e.includes(r))&&this._cancelEditingDefault()}connectedCallback(){super.connectedCallback(),document.addEventListener("pointerdown",this._onDocPointerDown),customElements.get("ha-service-picker")||customElements.whenDefined("ha-service-picker").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._onDocPointerDown)}_startEditingDefault(e,r){let s=this._actions.find(o=>o.id===e)?.defaults??{};this._editingOriginalHad=r in s,this._editingOriginalValue=s[r],this._editingDefault=`${e}:${r}`}_saveEditingDefault(){this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1,this._autoSave()}_cancelEditingDefault(){let e=this._editingDefault;if(e){let r=e.indexOf(":"),i=e.slice(0,r),s=e.slice(r+1);this._actions=this._actions.map(o=>{if(o.id!==i)return o;let a={...o.defaults??{}};return this._editingOriginalHad?a[s]=this._editingOriginalValue:delete a[s],{...o,defaults:a}})}this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1}async firstUpdated(){await this._reload()}willUpdate(e){if(e.has("_actions")||e.has("_schemas")){let r={};for(let i of this._actions){let s=this._schemas[i.id];if(s)for(let[o,a]of Object.entries(s.fields))r[`${i.id}:${o}`]=[{name:o,selector:a.selector??{text:{}},required:!1}]}this._fieldSchemas=r}if(e.has("_services")&&(this._serviceById=new Map(this._services.map(r=>[r.id,r]))),e.has("_actions")||e.has("_services")){let r=new Set(this._actions.map(i=>i.id));this._availableServices=this._services.filter(i=>!r.has(i.id)),this._addSchema=[{name:"service",selector:{select:{options:this._availableServices.map(i=>({value:i.id,label:this._addOptionLabel(i.id)})),custom_value:!0,mode:"dropdown",sort:!0}}}]}}async _reload(){this._loadError=null;try{let[e,r]=await Promise.all([at(this.hass),Di(this.hass)]);this._actions=e,this._services=r}catch(e){this._loadError=e instanceof Error?e.message:String(e);return}await Promise.all(this._actions.map(e=>this._ensureSchema(e.id))),this._loaded=!0}async _ensureSchema(e){if(!(e in this._schemas))try{let r=await _e(this.hass,e);this._schemas={...this._schemas,[e]:r}}catch{this._schemas={...this._schemas,[e]:null}}}_setShowInEditor(e,r,i){this._actions=this._actions.map(s=>{if(s.id!==e)return s;let o=new Set(s.visible_fields??[]);return i?o.add(r):o.delete(r),{...s,visible_fields:[...o]}}),this._autoSave()}_setDefault(e,r,i){this._actions=this._actions.map(s=>s.id!==e?s:{...s,defaults:{...s.defaults??{},[r]:i}})}_clearDefault(e,r){this._actions=this._actions.map(i=>{if(i.id!==e)return i;let s={...i.defaults??{}};return delete s[r],{...i,defaults:s}})}_setLabel(e,r){this._actions=this._actions.map(i=>i.id===e?{...i,label:r}:i)}_setReapplyEnabled(e,r){this._actions=this._actions.map(i=>{if(i.id!==e)return i;if(!r){let{reapply_seconds:s,...o}=i;return o}return{...i,reapply_seconds:300}}),this._autoSave()}_setReapplySeconds(e,r){let i=dn(r);i!==null&&(this._actions=this._actions.map(s=>s.id!==e?s:{...s,reapply_seconds:i}),this._autoSave())}_toggleExpand(e){this._expanded.has(e)?this._expanded=new Set:(this._expanded=new Set([e]),this._ensureSchema(e))}async _addService(e){e&&this._services.some(r=>r.id===e)&&(this._actions.some(r=>r.id===e)||(await this._ensureSchema(e),this._actions=[...this._actions,{id:e,label:this._labelForService(e),visible_fields:[],defaults:{}}],this._expanded=new Set([e]),this._adding=!1,this._autoSave()))}_removeService(e){this._actions=this._actions.filter(i=>i.id!==e);let r=new Set(this._expanded);r.delete(e),this._expanded=r,this._autoSave()}async _autoSave(){this._saveError=null,this._warnings=[];try{let e=await Pi(this.hass,this._actions);this._warnings=e.warnings??[],window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"))}catch(e){this._saveError=e instanceof Error?e.message:String(e)}}render(){return this._loadError!==null?l`
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
        @dragover=${o=>this._drag.dragOver(o,r)}
        @drop=${()=>this._drag.drop(r)}
        @dragend=${()=>this._drag.end()}
      >
        <div
          class="card-header"
          data-toggle
          @click=${o=>{o.target.closest("ha-input, input, button.remove, .drag-handle")||this._toggleExpand(e.id)}}
        >
          <span
            class="drag-handle"
            data-drag-handle
            draggable="true"
            title=${d(this.hass,"ui.drag_to_reorder","Drag to reorder")}
            @dragstart=${o=>this._drag.start(r,o,o.currentTarget.closest(".card"))}
            @click=${o=>o.stopPropagation()}
          >⠿</span>
          <span class="toggle-arrow">${s?"\u25BE":"\u25B8"}</span>
          ${s?l`
                <strong>${e.id}</strong>
                <ha-input
                  class="header-label-input"
                  data-label-input
                  placeholder=${d(this.hass,"ui.action_label_placeholder","Label (optional)")}
                  .value=${e.label}
                  @input=${o=>{o.stopPropagation(),this._setLabel(e.id,o.target.value)}}
                  @blur=${()=>void this._autoSave()}
                  @click=${o=>o.stopPropagation()}
                ></ha-input>
              `:e.label?l`
                  <span class="header-label-display">${e.label}</span>
                  <span class="header-service-id">(${e.id})</span>
                `:l`<strong class="standalone">${e.id}</strong>`}
          <button
            class="remove"
            data-remove
            title=${d(this.hass,"ui.remove","Remove")}
            @click=${o=>{o.stopPropagation(),this._removeService(e.id)}}
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
      </p>`;if(r===void 0)return l`<p class="body-help">${d(this.hass,"ui.loading","Loading\u2026")}</p>`;let i=Object.entries(r.fields).slice().sort(([s],[o])=>s.localeCompare(o));return i.length===0?l`<p class="body-help">
        ${d(this.hass,"ui.service_has_no_fields","This service has no fields.")}
      </p>`:l`
      <p class="body-help">
        ${d(this.hass,"ui.actions_field_help","Tick a checkbox to make a field editable per scene. Set a default to pre-fill it.")}
      </p>
      ${i.map(([s,o])=>this._renderFieldRow(e,s,o))}
    `}_formatDefaultSummary(e){return e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}_defaultUnitSuffix(e,r){let i=this._schemas[e]?.fields?.[r];if(!i||typeof i!="object")return"";let s=Gt(i.selector);return s?` ${s}`:""}_renderFieldRow(e,r,i){let s=(e.visible_fields??[]).includes(r),o=r in(e.defaults??{}),a=`${e.id}:${r}`,c=this._editingDefault===a;return l`
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
            ${i.name||qe(r)}
            ${i.name?l` <small class="field-id">(${r})</small>`:""}
            ${i.description?l` <small>— ${i.description}</small>`:""}
          </span>
          <div class="summary-cell">
            ${c?l`<span class="summary-cell-editing">Editing…</span>`:o?l`<button
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
              data-editing-key=${a}
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
    `}_renderDefaultEditor(e,r,i){let s=e.defaults?.[r],o=this._fieldSchemas[`${e.id}:${r}`]??[];return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${o}
        .data=${{[r]:s??""}}
        .computeLabel=${()=>""}
        @value-changed=${a=>{a.stopPropagation(),this._setDefault(e.id,r,a.detail.value[r])}}
      ></ha-form>`:l`<input
      data-default-value=${r}
      .value=${s==null?"":String(s)}
      @input=${a=>this._setDefault(e.id,r,a.target.value)}
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
      </div>`}_labelForService(e){return this._serviceById.get(e)?.name?.trim()||st(e)}_addOptionLabel(e){return`${this._labelForService(e)} (${e})`}_renderAddPicker(){return customElements.get("ha-service-picker")?l`<ha-service-picker
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
    </ul>`}};H.styles=y`
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
    /* Primary "Add action" button — filled blue, matching the scenes list. */
    button.add {
      background: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
  `,H._OVERLAY_TAG_RE=/vaadin|combo-box|overlay|listbox|menu|mwc-|md-/i,u([m({attribute:!1})],H.prototype,"hass",2),u([g()],H.prototype,"_actions",2),u([g()],H.prototype,"_services",2),u([g()],H.prototype,"_schemas",2),u([g()],H.prototype,"_fieldSchemas",2),u([g()],H.prototype,"_addSchema",2),u([g()],H.prototype,"_expanded",2),u([g()],H.prototype,"_adding",2),u([g()],H.prototype,"_warnings",2),u([g()],H.prototype,"_loadError",2),u([g()],H.prototype,"_saveError",2),u([g()],H.prototype,"_loaded",2),u([g()],H.prototype,"_editingDefault",2),u([g()],H.prototype,"_editingOriginalValue",2),u([g()],H.prototype,"_editingOriginalHad",2),H=u([w("ambience-actions-settings")],H);var Ee=class extends b{constructor(){super(...arguments);this._tab="ambience"}willUpdate(e){e.has("initialTab")&&this.initialTab&&(this._tab=this.initialTab)}render(){return l`
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
    `}};Ee.styles=y`
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
  `,u([m({attribute:!1})],Ee.prototype,"hass",2),u([m({attribute:!1})],Ee.prototype,"initialTab",2),u([g()],Ee.prototype,"_tab",2),Ee=u([w("ambience-settings-view")],Ee);var Ce=class extends b{constructor(){super(...arguments);this.open=!1;this._onKeydown=e=>{this.open&&e.key==="Escape"&&this._close()};this._onBackdrop=()=>{this.open&&this._close()}}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeydown),this.addEventListener("click",this._onBackdrop)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKeydown),this.removeEventListener("click",this._onBackdrop)}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?l`
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
    `:S}};Ce.styles=y`
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
  `,u([m({attribute:!1})],Ce.prototype,"hass",2),u([m({type:Boolean,reflect:!0})],Ce.prototype,"open",2),u([m({attribute:!1})],Ce.prototype,"initialTab",2),Ce=u([w("ambience-settings-modal")],Ce);var Qe=class extends b{constructor(){super(...arguments);this._settingsOpen=!1;this._onOpenSettings=e=>{let r=e.detail?.tab;this._settingsTab=r,this._settingsOpen=!0}}static{this.styles=y`
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
      height: 3rem;
      width: auto;
    }
    .settings-btn {
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
  `}connectedCallback(){super.connectedCallback(),me(this),this.addEventListener("ambience-open-settings",this._onOpenSettings)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("ambience-open-settings",this._onOpenSettings)}render(){return l`
      <header>
        <h1>
          ${gi({dark:!!this.hass.themes?.darkMode,title:d(this.hass,"ui.panel_title","Ambience")})}
        </h1>
        <button
          class="settings-btn"
          @click=${()=>{this._settingsTab=void 0,this._settingsOpen=!0}}
          aria-label=${d(this.hass,"ui.tab_settings","Settings")}
          title=${d(this.hass,"ui.tab_settings","Settings")}
        ><ha-icon icon="mdi:cog"></ha-icon></button>
      </header>
      <ambience-scopes-view .hass=${this.hass}></ambience-scopes-view>
      <ambience-settings-modal
        .hass=${this.hass}
        .initialTab=${this._settingsTab}
        ?open=${this._settingsOpen}
        @close=${()=>{this._settingsOpen=!1}}
      ></ambience-settings-modal>
    `}};u([m({attribute:!1})],Qe.prototype,"hass",2),u([g()],Qe.prototype,"_settingsOpen",2),u([g()],Qe.prototype,"_settingsTab",2);hi("ambience-frontend",Qe);export{Qe as AmbienceFrontend};
