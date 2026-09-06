/* Ambience — bundled output. Do not edit by hand. */
var tl=Object.defineProperty;var il=Object.getOwnPropertyDescriptor;var c=(t,r,e,i)=>{for(var n=i>1?void 0:i?il(r,e):r,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(i?o(r,e,n):o(n))||n);return i&&n&&tl(r,e,n),n};var gi=globalThis,vi=gi.ShadowRoot&&(gi.ShadyCSS===void 0||gi.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pr=Symbol(),On=new WeakMap,It=class{constructor(r,e,i){if(this._$cssResult$=!0,i!==Pr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(vi&&r===void 0){let i=e!==void 0&&e.length===1;i&&(r=On.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),i&&On.set(e,r))}return r}toString(){return this.cssText}},Mn=t=>new It(typeof t=="string"?t:t+"",void 0,Pr),y=(t,...r)=>{let e=t.length===1?t[0]:r.reduce((i,n,s)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[s+1],t[0]);return new It(e,t,Pr)},Fn=(t,r)=>{if(vi)t.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let i=document.createElement("style"),n=gi.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=e.cssText,t.appendChild(i)}},Rr=vi?t=>t:t=>t instanceof CSSStyleSheet?(r=>{let e="";for(let i of r.cssRules)e+=i.cssText;return Mn(e)})(t):t;var{is:rl,defineProperty:nl,getOwnPropertyDescriptor:sl,getOwnPropertyNames:ol,getOwnPropertySymbols:al,getPrototypeOf:ll}=Object,yi=globalThis,jn=yi.trustedTypes,dl=jn?jn.emptyScript:"",cl=yi.reactiveElementPolyfillSupport,Nt=(t,r)=>t,Ot={toAttribute(t,r){switch(r){case Boolean:t=t?dl:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,r){let e=t;switch(r){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},bi=(t,r)=>!rl(t,r),zn={attribute:!0,type:String,converter:Ot,reflect:!1,useDefault:!1,hasChanged:bi};Symbol.metadata??=Symbol("metadata"),yi.litPropertyMetadata??=new WeakMap;var $e=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=zn){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let i=Symbol(),n=this.getPropertyDescriptor(r,i,e);n!==void 0&&nl(this.prototype,r,n)}}static getPropertyDescriptor(r,e,i){let{get:n,set:s}=sl(this.prototype,r)??{get(){return this[e]},set(o){this[e]=o}};return{get:n,set(o){let d=n?.call(this);s?.call(this,o),this.requestUpdate(r,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??zn}static _$Ei(){if(this.hasOwnProperty(Nt("elementProperties")))return;let r=ll(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(Nt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Nt("properties"))){let e=this.properties,i=[...ol(e),...al(e)];for(let n of i)this.createProperty(n,e[n])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[i,n]of e)this.elementProperties.set(i,n)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let n=this._$Eu(e,i);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let i=new Set(r.flat(1/0).reverse());for(let n of i)e.unshift(Rr(n))}else r!==void 0&&e.push(Rr(r));return e}static _$Eu(r,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(r.set(i,this[i]),delete this[i]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Fn(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,i){this._$AK(r,i)}_$ET(r,e){let i=this.constructor.elementProperties.get(r),n=this.constructor._$Eu(r,i);if(n!==void 0&&i.reflect===!0){let s=(i.converter?.toAttribute!==void 0?i.converter:Ot).toAttribute(e,i.type);this._$Em=r,s==null?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(r,e){let i=this.constructor,n=i._$Eh.get(r);if(n!==void 0&&this._$Em!==n){let s=i.getPropertyOptions(n),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Ot;this._$Em=n;let d=o.fromAttribute(e,s.type);this[n]=d??this._$Ej?.get(n)??d,this._$Em=null}}requestUpdate(r,e,i,n=!1,s){if(r!==void 0){let o=this.constructor;if(n===!1&&(s=this[r]),i??=o.getPropertyOptions(r),!((i.hasChanged??bi)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(r)&&!this.hasAttribute(o._$Eu(r,i))))return;this.C(r,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:i,reflect:n,wrapped:s},o){i&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,o??e??this[r]),s!==!0||o!==void 0)||(this._$AL.has(r)||(this.hasUpdated||i||(e=void 0),this._$AL.set(r,e)),n===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,s]of this._$Ep)this[n]=s;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[n,s]of i){let{wrapped:o}=s,d=this[n];o!==!0||this._$AL.has(n)||d===void 0||this.C(n,void 0,s,d)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw r=!1,this._$EM(),i}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};$e.elementStyles=[],$e.shadowRootOptions={mode:"open"},$e[Nt("elementProperties")]=new Map,$e[Nt("finalized")]=new Map,cl?.({ReactiveElement:$e}),(yi.reactiveElementVersions??=[]).push("2.1.2");var Hr=globalThis,qn=t=>t,wi=Hr.trustedTypes,Un=wi?wi.createPolicy("lit-html",{createHTML:t=>t}):void 0,Ir="$lit$",ke=`lit$${Math.random().toFixed(9).slice(2)}$`,Nr="?"+ke,ul=`<${Nr}>`,tt=document,Ft=()=>tt.createComment(""),jt=t=>t===null||typeof t!="object"&&typeof t!="function",Or=Array.isArray,Yn=t=>Or(t)||typeof t?.[Symbol.iterator]=="function",Dr=`[ 	
\f\r]`,Mt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Wn=/-->/g,Vn=/>/g,Ze=RegExp(`>|${Dr}(?:([^\\s"'>=/]+)(${Dr}*=${Dr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Bn=/'/g,Gn=/"/g,Qn=/^(?:script|style|textarea|title)$/i,Mr=t=>(r,...e)=>({_$litType$:t,strings:r,values:e}),l=Mr(1),Lp=Mr(2),Tp=Mr(3),J=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Kn=new WeakMap,et=tt.createTreeWalker(tt,129);function Jn(t,r){if(!Or(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Un!==void 0?Un.createHTML(r):r}var Xn=(t,r)=>{let e=t.length-1,i=[],n,s=r===2?"<svg>":r===3?"<math>":"",o=Mt;for(let d=0;d<e;d++){let u=t[d],p,h,_=-1,g=0;for(;g<u.length&&(o.lastIndex=g,h=o.exec(u),h!==null);)g=o.lastIndex,o===Mt?h[1]==="!--"?o=Wn:h[1]!==void 0?o=Vn:h[2]!==void 0?(Qn.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=Ze):h[3]!==void 0&&(o=Ze):o===Ze?h[0]===">"?(o=n??Mt,_=-1):h[1]===void 0?_=-2:(_=o.lastIndex-h[2].length,p=h[1],o=h[3]===void 0?Ze:h[3]==='"'?Gn:Bn):o===Gn||o===Bn?o=Ze:o===Wn||o===Vn?o=Mt:(o=Ze,n=void 0);let v=o===Ze&&t[d+1].startsWith("/>")?" ":"";s+=o===Mt?u+ul:_>=0?(i.push(p),u.slice(0,_)+Ir+u.slice(_)+ke+v):u+ke+(_===-2?d:v)}return[Jn(t,s+(t[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),i]},zt=class t{constructor({strings:r,_$litType$:e},i){let n;this.parts=[];let s=0,o=0,d=r.length-1,u=this.parts,[p,h]=Xn(r,e);if(this.el=t.createElement(p,i),et.currentNode=this.el.content,e===2||e===3){let _=this.el.content.firstChild;_.replaceWith(..._.childNodes)}for(;(n=et.nextNode())!==null&&u.length<d;){if(n.nodeType===1){if(n.hasAttributes())for(let _ of n.getAttributeNames())if(_.endsWith(Ir)){let g=h[o++],v=n.getAttribute(_).split(ke),x=/([.?@])?(.*)/.exec(g);u.push({type:1,index:s,name:x[2],strings:v,ctor:x[1]==="."?$i:x[1]==="?"?ki:x[1]==="@"?Ci:rt}),n.removeAttribute(_)}else _.startsWith(ke)&&(u.push({type:6,index:s}),n.removeAttribute(_));if(Qn.test(n.tagName)){let _=n.textContent.split(ke),g=_.length-1;if(g>0){n.textContent=wi?wi.emptyScript:"";for(let v=0;v<g;v++)n.append(_[v],Ft()),et.nextNode(),u.push({type:2,index:++s});n.append(_[g],Ft())}}}else if(n.nodeType===8)if(n.data===Nr)u.push({type:2,index:s});else{let _=-1;for(;(_=n.data.indexOf(ke,_+1))!==-1;)u.push({type:7,index:s}),_+=ke.length-1}s++}}static createElement(r,e){let i=tt.createElement("template");return i.innerHTML=r,i}};function it(t,r,e=t,i){if(r===J)return r;let n=i!==void 0?e._$Co?.[i]:e._$Cl,s=jt(r)?void 0:r._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),s===void 0?n=void 0:(n=new s(t),n._$AT(t,e,i)),i!==void 0?(e._$Co??=[])[i]=n:e._$Cl=n),n!==void 0&&(r=it(t,n._$AS(t,r.values),n,i)),r}var xi=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:i}=this._$AD,n=(r?.creationScope??tt).importNode(e,!0);et.currentNode=n;let s=et.nextNode(),o=0,d=0,u=i[0];for(;u!==void 0;){if(o===u.index){let p;u.type===2?p=new _t(s,s.nextSibling,this,r):u.type===1?p=new u.ctor(s,u.name,u.strings,this,r):u.type===6&&(p=new Si(s,this,r)),this._$AV.push(p),u=i[++d]}o!==u?.index&&(s=et.nextNode(),o++)}return et.currentNode=tt,n}p(r){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(r,i,e),e+=i.strings.length-2):i._$AI(r[e])),e++}},_t=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,i,n){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=it(this,r,e),jt(r)?r===$||r==null||r===""?(this._$AH!==$&&this._$AR(),this._$AH=$):r!==this._$AH&&r!==J&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Yn(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==$&&jt(this._$AH)?this._$AA.nextSibling.data=r:this.T(tt.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:i}=r,n=typeof i=="number"?this._$AC(r):(i.el===void 0&&(i.el=zt.createElement(Jn(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{let s=new xi(n,this),o=s.u(this.options);s.p(e),this.T(o),this._$AH=s}}_$AC(r){let e=Kn.get(r.strings);return e===void 0&&Kn.set(r.strings,e=new zt(r)),e}k(r){Or(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,n=0;for(let s of r)n===e.length?e.push(i=new t(this.O(Ft()),this.O(Ft()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let i=qn(r).nextSibling;qn(r).remove(),r=i}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},rt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,i,n,s){this.type=1,this._$AH=$,this._$AN=void 0,this.element=r,this.name=e,this._$AM=n,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=$}_$AI(r,e=this,i,n){let s=this.strings,o=!1;if(s===void 0)r=it(this,r,e,0),o=!jt(r)||r!==this._$AH&&r!==J,o&&(this._$AH=r);else{let d=r,u,p;for(r=s[0],u=0;u<s.length-1;u++)p=it(this,d[i+u],e,u),p===J&&(p=this._$AH[u]),o||=!jt(p)||p!==this._$AH[u],p===$?r=$:r!==$&&(r+=(p??"")+s[u+1]),this._$AH[u]=p}o&&!n&&this.j(r)}j(r){r===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},$i=class extends rt{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===$?void 0:r}},ki=class extends rt{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==$)}},Ci=class extends rt{constructor(r,e,i,n,s){super(r,e,i,n,s),this.type=5}_$AI(r,e=this){if((r=it(this,r,e,0)??$)===J)return;let i=this._$AH,n=r===$&&i!==$||r.capture!==i.capture||r.once!==i.once||r.passive!==i.passive,s=r!==$&&(i===$||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},Si=class{constructor(r,e,i){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(r){it(this,r)}},Zn={M:Ir,P:ke,A:Nr,C:1,L:Xn,R:xi,D:Yn,V:it,I:_t,H:rt,N:ki,U:Ci,B:$i,F:Si},pl=Hr.litHtmlPolyfillSupport;pl?.(zt,_t),(Hr.litHtmlVersions??=[]).push("3.3.2");var es=(t,r,e)=>{let i=e?.renderBefore??r,n=i._$litPart$;if(n===void 0){let s=e?.renderBefore??null;i._$litPart$=n=new _t(r.insertBefore(Ft(),s),s,void 0,e??{})}return n._$AI(t),n};var Fr=globalThis,b=class extends $e{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=es(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return J}};b._$litElement$=!0,b.finalized=!0,Fr.litElementHydrateSupport?.({LitElement:b});var hl=Fr.litElementPolyfillSupport;hl?.({LitElement:b});(Fr.litElementVersions??=[]).push("4.2.2");var w=t=>(r,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(t,r)}):customElements.define(t,r)};var ml={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:bi},_l=(t=ml,r,e)=>{let{kind:i,metadata:n}=e,s=globalThis.litPropertyMetadata.get(n);if(s===void 0&&globalThis.litPropertyMetadata.set(n,s=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(e.name,t),i==="accessor"){let{name:o}=e;return{set(d){let u=r.get.call(this);r.set.call(this,d),this.requestUpdate(o,u,t,!0,d)},init(d){return d!==void 0&&this.C(o,void 0,t,d),d}}}if(i==="setter"){let{name:o}=e;return function(d){let u=this[o];r.call(this,d),this.requestUpdate(o,u,t,!0,d)}}throw Error("Unsupported decorator location: "+i)};function m(t){return(r,e)=>typeof e=="object"?_l(t,r,e):((i,n,s)=>{let o=n.hasOwnProperty(s);return n.constructor.createProperty(s,i),o?Object.getOwnPropertyDescriptor(n,s):void 0})(t,r,e)}function f(t){return m({...t,state:!0,attribute:!1})}function Ai(t,r){try{customElements.define(t,r)}catch{}}var fl=["ha-input","ha-textfield","ha-form"],gl=["ha-input","ha-textfield"];function ts(){for(let t of gl)if(customElements.get(t))return t;return null}function ie(t){let r=new WeakRef(t);for(let e of fl)customElements.get(e)||customElements.whenDefined(e).then(()=>r.deref()?.requestUpdate())}var ft={en:{time_of_day_period:{dawn:"Dawn",morning:"Morning",afternoon:"Afternoon",evening:"Evening",nighttime:"Nighttime",daytime:"Daytime"},weekday:{mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",sun:"Sun"},day_item:{weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"},lux_range:{dark:"Dark",dim:"Dim",normal:"Normal",bright:"Bright",very_bright:"Very bright"},category_color:{red:"Red",pink:"Pink",purple:"Purple","deep-purple":"Deep purple",indigo:"Indigo",blue:"Blue","light-blue":"Light blue",cyan:"Cyan",teal:"Teal",green:"Green","light-green":"Light green",lime:"Lime",yellow:"Yellow",amber:"Amber",orange:"Orange","deep-orange":"Deep orange",brown:"Brown",grey:"Grey","blue-grey":"Blue grey"},condition:{time_of_day:"Time of day",state:"Entity state",script:"Script",sun:"Sun",template:"Template",lux:"Lux",unavailable:"Unavailable"},action:{},anchor:{dawn:"Dawn",sunrise:"Sunrise",noon:"Noon",sunset:"Sunset",dusk:"Dusk",midnight:"Midnight"},ui:{language_request:{message:"Your Home Assistant language is {language}, but {product} isn't translated into it yet.",action:"Request a translation \u2192",dismiss:"Dismiss"},panel_title:"Ambience",card_load_failed:"Ambience card failed to load \u2014 check the connection and refresh.",tab_settings:"Settings",settings_tab_ambience:"Advanced",settings_tab_conditions:"Conditions",settings_tab_actions:"Actions",settings_ambience_pause_card:"Scope-level pause switch",help_pause_switch:"Ambience creates a switch entity for every enabled area, floor, and house scope. Turning a scope's switch off pauses Ambience for that scope.",settings_tab_import:"AI",import_title:"Author & fix scenes with AI",import_beta:"Beta",import_mcp_title:"Author live with the MCP server",import_mcp_desc:"Install the MCP server for the fastest authoring and editing experience with Claude Code or Claude Desktop.",import_mcp_link:"Set up the MCP server",import_mcp_recommended:"Recommended",import_paste_title:"Alternatively, download and paste into any AI",import_help_link:"Install & usage guide",import_step1:"Install the skill or plugin once",import_step1_desc:"Add the Ambience AI pack to your AI to teach it about Ambience.",import_step2:"Download your AI bundle",import_step2_desc:"The bundle contains a snapshot of your areas, entities and exposed actions (location data redacted) for the AI to author against. Upload it to the AI with your request.",import_step3:"Upload the result",import_step3_desc:"Upload the YAML or JSON file the AI gives you. It will show you a preview before any changes are made, and you can always revert them with the Undo button.",import_download_bundle:"Download AI bundle",import_target:"Target",import_new_category:"New category to create",import_unknown_categories:"Unknown categories (create them first)",import_adds:"Add",import_updates:"Update",import_removes:"Remove",import_confirm:"Import",import_done:"Imported successfully.",import_feedback_title:"Can you do better than the AI?",import_feedback_body:"If the AI gives you bad advice, share its suggestion, your corrected version, and a short note on what was wrong \u2014 it's used to improve the cookbook the AI learns from.",import_feedback_link:"Report it on GitHub",settings_ambience_field_name:"Switch name",settings_ambience_field_pause:"Pause for",settings_reapply_enable_label:"Re-run all scenes after inactivity",settings_reapply_interval_label:"Re-run after",apply_on_every_match:"Apply on every match",help_apply_on_every_match:"When on, Ambience re-applies this scene's actions every time it wins its scope/category, not just the first time it becomes the active scene.",unit_minutes:"minutes",help:"Help",open_documentation:"Open documentation",read_documentation:"Read more",help_switch_name:"The name used for the per-scope pause switch entities.",help_pause_for:"When a scope's switch is turned off, auto-resume after this many minutes. 0 = stays paused until turned back on.",help_reapply_toggle:"Re-run the scenes for a scope/category after inactivity and re-apply the winning scene, in case any action had previously failed, such as a light not turning off.",help_reapply_after:"Re-run scenes that haven't been updated for this many minutes.",settings_expose_group:"Expose to voice assistants",settings_expose_assist:"Assist",settings_expose_google:"Google Assistant",settings_expose_alexa:"Alexa",help_expose:"Expose the per-scope pause switches to the selected voice assistants so you can pause/resume Ambience by voice. Google Assistant and Alexa require Home Assistant Cloud or a manual setup.",help_actions_tab:"Actions are the service calls a scene runs. Define them here so scenes can reuse them.",help_show_in_scene_editor:"Show this field in the scene editor so each scene can set it. Leave off to send a fixed default instead.",help_set_default:"A value sent automatically when the action runs. Scenes can override it if the field is also shown in the editor.",help_conditions_tab:"Conditions are the inputs scenes match on (time of day, presence, weather, \u2026). A scene wins when all its conditions pass.",help_categories_tab:"Categories let one scope have several independent winners at once \u2014 one scene wins per category.",no_areas:"No areas found in Home Assistant.",not_configured:"not configured",scene_singular:"scene",scene_plural:"scenes",all_categories:"All categories",add_category:"Add category\u2026",loading:"Loading\u2026",any_placeholder:"(any)",include:"Include",exclude:"Exclude",empty_all_days:"(empty \u2192 all days)",add_include_item:"+ Add include item",add_exclude_item:"+ Add exclude item",from:"from",to:"to",remove:"Remove",day_of_month_placeholder:"e.g. 1-10, 15",workday_sensor:"Workday sensor",workday_calendar:"Workday calendar",periods_heading:"Periods",badge_builtin:"builtin",badge_custom:"custom",add_custom_period:"+ Add custom period",lux_heading:"Lux ranges",add_custom_lux_range:"+ Add custom lux range",lux_modal_add_title:"Add custom lux range",lux_modal_edit_title:'Edit "{name}"',lux_min_label:"Min (lx)",lux_max_label:"Max (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"is",occupancy_is_not:"is not",lux_any:"Any of",lux_all:"All of",lux_is:"is",lux_is_not:"is not",title_edit:"Edit",title_delete:"Delete",new_scene:"New scene",new_scene_default:"New scene",name_optional:"Name (optional)",category:"Category",scope:"Scope",when_heading:"When",actions_heading:"Actions",target:"Target",remove_action:"Remove action",add_action:"+ Add action\u2026",remove_condition:"Remove condition",add_condition:"+ Add condition\u2026",add_description:"+ Add description",description:"Description",add_action_button:"Add action",cancel:"Cancel",save:"Save",save_scene:"Save scene",at_least_one_target:"At least one target is required.",condition_error:"Fix the error in this condition before continuing",no_scenes_yet:"No scenes yet.",add_scene:"+ Add scene",summary_any:"any",summary_any_paren:"(any)",summary_always:"Always",no_targets:"(no targets)",target_noun:"target",action_singular:"action",action_plural:"actions",scene_n:"Scene {n}",drag_to_reorder:"Drag to reorder",unpin:"Unpin (return to automatic order)",enable_scene:"Enable scene",disable_scene:"Disable scene",shadowed:"Never fires \u2014 shadowed by an earlier scene.",problem_missing:"Missing or disabled in Home Assistant:",problem_overlap:"Controlled by multiple groups:",problem_config:"Configuration problems:",problems_count:"{n} scene(s) have problems",badge_needs_workday_sensor:"needs a workday sensor",badge_needs_workday_calendar:"needs a workday calendar",badge_needs_weather_entity:"needs a weather entity",badge_missing_weather_group:"missing weather group {id}",badge_missing_period:"missing period {id}",badge_missing_lux_range:"missing lux range {id}",badge_unexposed_action:"action {id} not exposed",edit:"Edit",duplicate:"Duplicate",run_actions:"Run actions",run:"Run",auto_triggers_section:"Auto-triggers",auto_triggers_none:"No automatic triggers.",auto_triggers_opaque_note:"A script scene is opaque \u2014 some watches may be missing. Declare them in the scene's Triggers field.",auto_trigger_group_time:"Time",auto_trigger_group_sun:"Sun",auto_trigger_group_domain:"People list",auto_trigger_domain_membership:"{domains} added or removed",auto_trigger_date_rollover:"Local midnight (date rollover)",auto_trigger_periodic:"periodic re-check",more_actions:"More actions",scene_actions:"Scene actions",error_enter_name:"Please enter a name.",error_start_letter:"Name must start with a letter.",error_name_exists:"An entry with this name already exists. Choose a different name.",period_modal_add_title:"Add custom period",period_modal_edit_title:'Edit "{name}"',name:"Name",name_placeholder:"e.g. Wind down",lux_name_placeholder:"e.g. Gloomy",lux_error_need_bound:"Enter a min, a max, or both.",lux_error_negative:"Bounds must be 0 or greater.",lux_error_order:"Min must be less than max.",lux_error_not_integer:"Bounds must be whole numbers.",from_label:"From",to_label:"To",any_time:"Any time",custom_range:"Custom range",custom_suffix:" (custom)",add_time_range:"+ add another time range",endpoint_time:"Time",endpoint_sun:"Sun",offset_placeholder:"Offset",clamp_none:"\u2014",clamp_not_before:"not before",clamp_not_after:"not after",unit_hour:"hour",unit_hours:"hours",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"No matching entities in this area.",field_kind:"Kind",field_days_of_month:"Days of month",field_month:"Month",field_day:"Day",field_from_month:"From month",field_from_day:"From day",field_to_month:"To month",field_to_day:"To day",day_spec_error:"Use days 1\u201331 and ranges like 1-10, separated by commas",title_override:"Override",thresholds:"Thresholds",add_threshold:"+ Add threshold",weather_entity:"Weather entity",groups:"Groups",add_group:"+ Add group",sun:{elevation:"Elevation",azimuth:"Azimuth",any:"Any",above:"Above",below:"Below",between:"Between",custom_range:"Custom range"},arguments:"Arguments",form:"Form",script:"Script",yaml:"YAML",settings_tab_categories:"Categories",category_add:"+ Add category",category_name_placeholder:"Category name",category_icon:"Icon",category_color:"Colour",category_name_blank_error:"Category names can't be empty.",category_name_duplicate_error:"Two categories can't have the same name.",category_delete_blocked_last:"You can't delete the last category.",category_delete_blocked_in_use:"This category still has scenes \u2014 move or delete them first.",category_edit_title:"Edit category",category_add_title:"Add category",category_color_none:"No colour",category_save:"Save",view_traces:"View traces",pause_scope:"Pause this scope",resume_scope:"Resume now",close:"Close",pick_service:"Pick a service",retry:"Retry",action_label_placeholder:"Label (optional)",action_no_parameters:"This action has no configurable fields.",actions_field_help_show:"Tick a checkbox to make a field editable per scene.",actions_field_help_default:"Set a default to pre-fill it.",clear_default:"Clear default",set_default:"Set default",default_prefix:"Default: ",editing:"Editing\u2026",show_in_scene_editor:"Show in scene editor",extra_fields_prefix:"Extra fields:",extra_fields_hint:"These fields aren't currently exposed but will still be sent.",service_has_no_fields:"This service has no fields.",service_unavailable:"Service not available in this HA instance.",action_unavailable:"Action no longer available; configure it in Settings \u2192 Actions or remove this action.",raw_config_action:"Action",raw_config_targets:"Targets",raw_config_params:"Parameters",occupancy_any:"Any of",occupancy_all:"All of",occupancy_detected:"Detected",occupancy_clear:"Clear",occupancy_for:"for",day_pick_weekday:"Pick at least one day of the week.",state_sentinel:"State",invalid_datetime:"Enter a valid date and time.",simulate_title:"Simulate",simulate_when_hint:"drives sun, time-of-day, weekday & workday",simulate_sun_resolved:"\u2192 {time}",simulate_sun_undefined:"no {anchor} on this date",simulate_sun_unresolved:"This sun time can't be resolved for the selected date.",simulate_inputs_heading:"Inputs this category depends on",simulate_button:"Simulate",reset_to_now:"Reset to now",reset_to_live:"Reset to live",true_label:"True",false_label:"False",for_at_least:"at least",for_less_than:"less than",for_label:"For",duration_held_hint:"How long it has held this state (h:m:s)",away:"Away",home:"Home",refresh:"Refresh",new_traces_refresh:"New traces \u2014 refresh",clear_traces:"Clear",download_diagnostics:"Download diagnostics",no_traces_yet:"No traces for this category yet.",yaml_expect_object:"Expected an object",yaml_script_string:"`script` must be a 'script.<name>' string",yaml_args_object:"`args` must be an object if present",yaml_triggers_list:"`triggers` must be a list of entity_id strings if present",template_result:"Result",template_truthy:"true \u2014 matches",template_falsy:"false \u2014 no match",conditions_hint_body:"Configure Workday and Weather in Conditions to use them in your scene conditions.",conditions_hint_body_weather:"Configure Weather in Conditions to use it in your scene conditions.",conditions_hint_body_workday:"Configure Workday in Conditions to use it in your scene conditions.",conditions_hint_cta:"Configure conditions",conditions_hint_title:"Optional: set up Workday & Weather",conditions_hint_title_weather:"Optional: set up Weather",conditions_hint_title_workday:"Optional: set up Workday",dismiss:"Dismiss",fado_notice_title:"Recommended: install Fado Light Fader",fado_notice_body:"Fado adds smooth light fading for brightness, color, and color temperature \u2014 with automatic brightness restoration, UI autoconfiguration, and native transitions. It's a Home Assistant default HACS integration.",fado_notice_cta:"Install via HACS",for_prefix:"for",name_duplicate:"A scene with this name already exists in this category.",no_exposed_actions:"Add services in Settings \u2192 Actions.",people_for:"for",people_is_at:"Is at",people_is_at_static:"is at",people_is_not_at:"Is not at",people_mode_all:"All of:",people_mode_any:"Any of:",people_mode_anybody:"Anybody",people_mode_everybody:"Everybody",people_mode_nobody:"Nobody",people_mode_none:"None of:",people_none_tracked:"No people tracked",people_select_one:"Select at least one person",unavailable_select_one:"Select at least one entity",people_where_home:"Home",scope_house:"House",history_nothing_to_undo:"Nothing to undo",history_nothing_to_redo:"Nothing to redo",history_undo_tooltip:"Undo: {change}",history_redo_tooltip:"Redo: {change}",history_untitled:"Untitled",history_action_add:'Added scene "{scene}" in {scope}',history_action_edit:'Edited scene "{scene}" in {scope}',history_action_delete:'Deleted scene "{scene}" in {scope}',history_action_reorder:"Reordered scenes in {scope}",history_action_unpin:'Unpinned scene "{scene}" in {scope}',history_action_toggle:'Toggled scene "{scene}" in {scope}',history_conflict_body:"Another tab changed the scenes in this scope while you were editing.",history_conflict_overwrite:"Overwrite theirs",history_conflict_load:"Load theirs",script_triggers:"Triggers",script_triggers_help:"Re-evaluate this scene when these entities change. A script is opaque, so templated references may be missed \u2014 add any it depends on.",script_triggers_none:"No triggers",simulate:"Simulate",state_add_condition:"Add clause",state_add_first:"Add clause",state_add_value:"+ Add state",state_attribute_placeholder:"leave blank to compare state",state_entity:"Entity",state_err_entity:"Entity is required",state_err_incomplete:"This condition is incomplete",state_err_numeric:"Value must be a number",state_err_state:"State is required",state_err_value:"Value is required",state_for:"For (optional)",state_new_condition:"(new condition)",state_not_toggle:"Negate (NOT)",state_op_header:"Comparison",state_unwrap_group:"Remove these parens (promote children to parent)",state_value_label:"Value",state_where:"Where",state_wrap:"Wrap in group",state_wrap_group:"Wrap these clauses in parentheses",show_more_info:"Show more info",cause_has_time:"Periodic time check",cause_switch:"Switch turned on",cause_manual:"Manual apply",cause_startup:"Startup",cause_reloaded:"Reloaded",cause_simulated:"Simulation",cause_clock:"Time of day",cause_sun:"Sun position",cause_reapply:"Re-run",cause_duration_for:"for",outcome_label_acted:"applied",outcome_label_no_op:"blocked",outcome_label_debounced:"unchanged",outcome_label_no_match:"no match",outcome_label_skipped:"skipped",count_action_one:"{n} action",count_action_other:"{n} actions",count_entity_one:"{n} entity",count_entity_other:"{n} entities",winner_default:"The matching scene",outcome_summary_acted_all_skipped:"{winner} matched \u2014 {skipped_phrase} skipped (not exposed); nothing applied.",outcome_summary_acted_entities:"Applied {winner} \u2014 {acts} on {entities}.{tail}",outcome_summary_acted:"Applied {winner} \u2014 {acts}.{tail}",outcome_summary_skipped_tail:" ({skipped} skipped \u2014 not exposed)",outcome_summary_no_op:"{winner} matched but has no actions \u2014 it blocks lower scenes from applying. Nothing changed.",outcome_summary_debounced:"{winner} matched, but it's already applied \u2014 nothing was re-sent.",outcome_summary_no_match:"No scene matched \u2014 nothing applied.",outcome_summary_skipped_switch_off:"Skipped \u2014 the scope's pause switch is off.",outcome_summary_skipped_scope_disabled:"Skipped \u2014 the scope is disabled.",outcome_summary_skipped_unavailable:"Skipped \u2014 the triggering entity went unavailable; devices left as they are.",section_scene_evaluation:"Scene evaluation",section_actions_taken:"Actions taken",trigger_prefix:"Trigger: ",trace_won_prefix:"Won: ",skipped_not_exposed:" \u2014 skipped (not exposed)",trace_scene_prefix:"Scene #",trace_scene_disabled:"disabled",trace_scene_not_reached:"not reached",trace_scene_matched:"\u2713 matched",trace_scene_no_match:"\u2717 no match",scene_live:"Live now \u2014 this scene currently matches and is applied",scene_applied_stale:"Still applied \u2014 this scene's actions are in effect but it no longer matches",version_update:{message:"Ambience {version} has been installed \u2014 reload to update.",reload:"Reload"}},blocker_summary:{block:"Block",block_mid:"block",until:"until",while:"while",while_lead:"While",or:"or",and:"and",always:"always"},day_summary:{any:"any",any_day:"any day",except:"except",day_prefix:"day",last_day:"last day",workday:"workday",holiday:"holiday",first_workday:"first workday",last_workday:"last workday"},month:{1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"},weather_condition:{"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"},weather_attr:{temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"},state_op:{is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"},trace_reason:{day_workday_sensor_unconfigured:"workday sensor not configured",day_workday_calendar_unconfigured:"workday calendar not configured",lux_range_missing:"lux range {range} no longer exists",lux_sensor_not_numeric:"{name} ({value}) does not report a number",period_missing:"time-of-day period {period} no longer exists",sun_not_configured:"the sun integration is not set up",sun_anchor_undefined:"{anchor} is undefined at this location today",weather_entity_unconfigured:"weather entity not configured",weather_group_missing:"weather group {group} no longer exists"}},es:{time_of_day_period:{dawn:"Amanecer",morning:"Ma\xF1ana",afternoon:"Tarde",evening:"Atardecer",nighttime:"Noche",daytime:"D\xEDa"},weekday:{mon:"Lun",tue:"Mar",wed:"Mi\xE9",thu:"Jue",fri:"Vie",sat:"S\xE1b",sun:"Dom"},day_item:{weekday:"D\xEDa de la semana",day_of_month:"D\xEDa del mes",date:"Fecha (anual)",date_range:"Rango de fechas (anual)",last_day:"\xDAltimo d\xEDa del mes",workday:"D\xEDa laborable",holiday:"Festivo",first_workday:"Primer d\xEDa laborable del mes",last_workday:"\xDAltimo d\xEDa laborable del mes"},lux_range:{dark:"Oscuro",dim:"Tenue",normal:"Normal",bright:"Brillante",very_bright:"Muy brillante"},category_color:{red:"Rojo",pink:"Rosa",purple:"Morado","deep-purple":"Morado oscuro",indigo:"\xCDndigo",blue:"Azul","light-blue":"Azul claro",cyan:"Cian",teal:"Verde azulado",green:"Verde","light-green":"Verde claro",lime:"Lima",yellow:"Amarillo",amber:"\xC1mbar",orange:"Naranja","deep-orange":"Naranja oscuro",brown:"Marr\xF3n",grey:"Gris","blue-grey":"Gris azulado"},condition:{time_of_day:"Hora del d\xEDa",state:"Estado de entidad",script:"Script",sun:"Sol",template:"Plantilla",lux:"Lux",unavailable:"No disponible"},action:{},anchor:{dawn:"Amanecer",sunrise:"Salida del sol",noon:"Mediod\xEDa",sunset:"Puesta del sol",dusk:"Crep\xFAsculo",midnight:"Medianoche"},ui:{language_request:{message:"El idioma de tu Home Assistant es {language}, pero {product} a\xFAn no est\xE1 traducido a ese idioma.",action:"Solicitar una traducci\xF3n \u2192",dismiss:"Descartar"},panel_title:"Ambience",card_load_failed:"No se pudo cargar la tarjeta Ambience \u2014 comprueba la conexi\xF3n y actualiza.",tab_settings:"Ajustes",settings_tab_ambience:"Avanzado",settings_tab_conditions:"Condiciones",settings_tab_actions:"Acciones",settings_ambience_pause_card:"Interruptor de pausa por \xE1mbito",help_pause_switch:"Ambience crea una entidad de interruptor para cada \xE1mbito de \xE1rea, planta y casa habilitado. Apagar el interruptor de un \xE1mbito pausa Ambience para ese \xE1mbito.",settings_tab_import:"IA",import_title:"Crea y arregla escenas con IA",import_beta:"Beta",import_mcp_title:"Crea escenas en vivo con el servidor MCP",import_mcp_desc:"Instala el servidor MCP para la forma m\xE1s r\xE1pida de crear y editar escenas, con Claude Code o Claude Desktop.",import_mcp_link:"Configura el servidor MCP",import_mcp_recommended:"Recomendado",import_paste_title:"Como alternativa, descarga y pega en cualquier IA",import_help_link:"Gu\xEDa de instalaci\xF3n y uso",import_step1:"Instala la skill o el plugin una vez",import_step1_desc:"A\xF1ade el paquete de IA de Ambience a tu IA para ense\xF1arle sobre Ambience.",import_step2:"Descarga tu paquete de IA",import_step2_desc:"El paquete contiene una instant\xE1nea de tus \xE1reas, entidades y acciones expuestas (datos de ubicaci\xF3n redactados) para que la IA cree sobre ellos. S\xFAbelo a la IA junto con tu petici\xF3n.",import_step3:"Sube el resultado",import_step3_desc:"Sube el archivo YAML o JSON que te d\xE9 la IA. Te mostrar\xE1 una vista previa antes de hacer cambios, y siempre puedes revertirlos con el bot\xF3n Deshacer.",import_download_bundle:"Descargar paquete de IA",import_target:"Destino",import_new_category:"Nueva categor\xEDa a crear",import_unknown_categories:"Categor\xEDas desconocidas (cr\xE9alas primero)",import_adds:"A\xF1adir",import_updates:"Actualizar",import_removes:"Eliminar",import_confirm:"Importar",import_done:"Importado correctamente.",import_feedback_title:"\xBFPuedes hacerlo mejor que la IA?",import_feedback_body:"Si la IA te da malos consejos, comparte su sugerencia, tu versi\xF3n corregida y una nota breve sobre qu\xE9 estaba mal \u2014 se usa para mejorar el recetario del que aprende la IA.",import_feedback_link:"Rep\xF3rtalo en GitHub",settings_ambience_field_name:"Nombre del interruptor",settings_ambience_field_pause:"Pausar durante",settings_reapply_enable_label:"Volver a ejecutar todas las escenas tras inactividad",settings_reapply_interval_label:"Volver a ejecutar despu\xE9s de",apply_on_every_match:"Aplicar en cada coincidencia",help_apply_on_every_match:"Cuando est\xE1 activado, Ambience vuelve a aplicar las acciones de esta escena cada vez que gana su \xE1mbito/categor\xEDa, no solo la primera vez que se activa.",unit_minutes:"minutos",help:"Ayuda",open_documentation:"Abrir documentaci\xF3n",read_documentation:"M\xE1s informaci\xF3n",help_switch_name:"El nombre utilizado para las entidades de interruptor de pausa por \xE1mbito.",help_pause_for:"Cuando se apaga el interruptor de un \xE1mbito, se reanuda autom\xE1ticamente tras este n\xFAmero de minutos. 0 = permanece pausado hasta que se vuelva a encender.",help_reapply_toggle:"Vuelve a ejecutar las escenas de un \xE1mbito/categor\xEDa tras la inactividad y vuelve a aplicar la escena ganadora, por si alguna acci\xF3n hab\xEDa fallado anteriormente, como una luz que no se apag\xF3.",help_reapply_after:"Volver a ejecutar escenas que no se han actualizado durante este n\xFAmero de minutos.",settings_expose_group:"Exponer a asistentes de voz",settings_expose_assist:"Assist",settings_expose_google:"Google Assistant",settings_expose_alexa:"Alexa",help_expose:"Expone los interruptores de pausa por \xE1mbito a los asistentes de voz seleccionados para poder pausar/reanudar Ambience por voz. Google Assistant y Alexa requieren Home Assistant Cloud o una configuraci\xF3n manual.",help_actions_tab:"Las acciones son las llamadas de servicio que ejecuta una escena. Def\xEDnelas aqu\xED para que las escenas puedan reutilizarlas.",help_show_in_scene_editor:"Muestra este campo en el editor de escenas para que cada escena pueda configurarlo. Desact\xEDvalo para enviar un valor predeterminado fijo.",help_set_default:"Un valor enviado autom\xE1ticamente cuando se ejecuta la acci\xF3n. Las escenas pueden anularlo si el campo tambi\xE9n se muestra en el editor.",help_conditions_tab:"Las condiciones son las entradas con las que coinciden las escenas (hora del d\xEDa, presencia, tiempo, \u2026). Una escena gana cuando todas sus condiciones se cumplen.",help_categories_tab:"Las categor\xEDas permiten que un \xE1mbito tenga varios ganadores independientes a la vez: una escena gana por categor\xEDa.",no_areas:"No se encontraron \xE1reas en Home Assistant.",not_configured:"no configurado",scene_singular:"escena",scene_plural:"escenas",all_categories:"Todas las categor\xEDas",add_category:"A\xF1adir categor\xEDa\u2026",loading:"Cargando\u2026",any_placeholder:"(cualquiera)",include:"Incluir",exclude:"Excluir",empty_all_days:"(vac\xEDo \u2192 todos los d\xEDas)",add_include_item:"+ A\xF1adir elemento incluido",add_exclude_item:"+ A\xF1adir elemento excluido",from:"desde",to:"hasta",remove:"Eliminar",day_of_month_placeholder:"p. ej. 1-10, 15",workday_sensor:"Sensor de d\xEDas laborables",workday_calendar:"Calendario de d\xEDas laborables",periods_heading:"Per\xEDodos",badge_builtin:"integrado",badge_custom:"personalizado",add_custom_period:"+ A\xF1adir per\xEDodo personalizado",lux_heading:"Rangos de lux",add_custom_lux_range:"+ A\xF1adir rango de lux personalizado",lux_modal_add_title:"A\xF1adir rango de lux personalizado",lux_modal_edit_title:'Editar "{name}"',lux_min_label:"M\xEDn (lx)",lux_max_label:"M\xE1x (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"es",occupancy_is_not:"no es",lux_any:"Cualquiera de",lux_all:"Todos de",lux_is:"es",lux_is_not:"no es",title_edit:"Editar",title_delete:"Eliminar",new_scene:"Nueva escena",new_scene_default:"Nueva escena",name_optional:"Nombre (opcional)",category:"Categor\xEDa",scope:"\xC1mbito",when_heading:"Cu\xE1ndo",actions_heading:"Acciones",target:"Objetivo",remove_action:"Eliminar acci\xF3n",add_action:"+ A\xF1adir acci\xF3n\u2026",remove_condition:"Eliminar condici\xF3n",add_condition:"+ A\xF1adir condici\xF3n\u2026",add_description:"+ A\xF1adir descripci\xF3n",description:"Descripci\xF3n",add_action_button:"A\xF1adir acci\xF3n",cancel:"Cancelar",save:"Guardar",save_scene:"Guardar escena",at_least_one_target:"Se requiere al menos un objetivo.",condition_error:"Corrige el error en esta condici\xF3n antes de continuar",no_scenes_yet:"A\xFAn no hay escenas.",add_scene:"+ A\xF1adir escena",summary_any:"cualquiera",summary_any_paren:"(cualquiera)",summary_always:"Siempre",no_targets:"(sin objetivos)",target_noun:"objetivo",action_singular:"acci\xF3n",action_plural:"acciones",scene_n:"Escena {n}",drag_to_reorder:"Arrastrar para reordenar",unpin:"Desanclar (volver al orden autom\xE1tico)",enable_scene:"Activar escena",disable_scene:"Desactivar escena",shadowed:"Nunca se activa \u2014 eclipsada por una escena anterior.",problem_missing:"Faltante o deshabilitada en Home Assistant:",problem_overlap:"Controlado por varios grupos:",problem_config:"Problemas de configuraci\xF3n:",problems_count:"{n} escena(s) tienen problemas",badge_needs_workday_sensor:"necesita un sensor de d\xEDas laborables",badge_needs_workday_calendar:"necesita un calendario de d\xEDas laborables",badge_needs_weather_entity:"necesita una entidad meteorol\xF3gica",badge_missing_weather_group:"falta el grupo meteorol\xF3gico {id}",badge_missing_period:"falta el per\xEDodo {id}",badge_missing_lux_range:"falta el rango de lux {id}",badge_unexposed_action:"acci\xF3n {id} no expuesta",edit:"Editar",duplicate:"Duplicar",run_actions:"Ejecutar acciones",run:"Ejecutar",auto_triggers_section:"Disparadores autom\xE1ticos",auto_triggers_none:"Sin disparadores autom\xE1ticos.",auto_triggers_opaque_note:"Una escena de script es opaca \u2014 puede que falten algunas observaciones. Declara las que sean necesarias en el campo Disparadores de la escena.",auto_trigger_group_time:"Hora",auto_trigger_group_sun:"Sol",auto_trigger_group_domain:"Lista de personas",auto_trigger_domain_membership:"{domains} a\xF1adido o eliminado",auto_trigger_date_rollover:"Medianoche local (cambio de fecha)",auto_trigger_periodic:"revisi\xF3n peri\xF3dica",more_actions:"M\xE1s acciones",scene_actions:"Acciones de la escena",error_enter_name:"Por favor, introduce un nombre.",error_start_letter:"El nombre debe comenzar con una letra.",error_name_exists:"Ya existe una entrada con este nombre. Elige un nombre diferente.",period_modal_add_title:"A\xF1adir per\xEDodo personalizado",period_modal_edit_title:'Editar "{name}"',name:"Nombre",name_placeholder:"p. ej. Descanso nocturno",lux_name_placeholder:"p. ej. Sombr\xEDo",lux_error_need_bound:"Introduce un m\xEDnimo, un m\xE1ximo o ambos.",lux_error_negative:"Los l\xEDmites deben ser 0 o mayores.",lux_error_order:"El m\xEDnimo debe ser menor que el m\xE1ximo.",lux_error_not_integer:"Los l\xEDmites deben ser n\xFAmeros enteros.",from_label:"Desde",to_label:"Hasta",any_time:"Cualquier hora",custom_range:"Rango personalizado",custom_suffix:" (personalizado)",add_time_range:"+ a\xF1adir otro rango de tiempo",endpoint_time:"Hora",endpoint_sun:"Sol",offset_placeholder:"Desplazamiento",clamp_none:"\u2014",clamp_not_before:"no antes de",clamp_not_after:"no despu\xE9s de",unit_hour:"hora",unit_hours:"horas",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"No hay entidades coincidentes en esta \xE1rea.",field_kind:"Tipo",field_days_of_month:"D\xEDas del mes",field_month:"Mes",field_day:"D\xEDa",field_from_month:"Mes de inicio",field_from_day:"D\xEDa de inicio",field_to_month:"Mes de fin",field_to_day:"D\xEDa de fin",day_spec_error:"Usa d\xEDas del 1 al 31 y rangos como 1-10, separados por comas",title_override:"Anular",thresholds:"Umbrales",add_threshold:"+ A\xF1adir umbral",weather_entity:"Entidad meteorol\xF3gica",groups:"Grupos",add_group:"+ A\xF1adir grupo",sun:{elevation:"Elevaci\xF3n",azimuth:"Acimut",any:"Cualquiera",above:"Por encima",below:"Por debajo",between:"Entre",custom_range:"Rango personalizado"},arguments:"Argumentos",form:"Formulario",script:"Script",yaml:"YAML",settings_tab_categories:"Categor\xEDas",category_add:"+ A\xF1adir categor\xEDa",category_name_placeholder:"Nombre de categor\xEDa",category_icon:"Icono",category_color:"Color",category_name_blank_error:"Los nombres de categor\xEDa no pueden estar vac\xEDos.",category_name_duplicate_error:"Dos categor\xEDas no pueden tener el mismo nombre.",category_delete_blocked_last:"No puedes eliminar la \xFAltima categor\xEDa.",category_delete_blocked_in_use:"Esta categor\xEDa a\xFAn tiene escenas \u2014 mu\xE9velas o elim\xEDnalas primero.",category_edit_title:"Editar categor\xEDa",category_add_title:"A\xF1adir categor\xEDa",category_color_none:"Sin color",category_save:"Guardar",view_traces:"Ver trazas",pause_scope:"Pausar este \xE1mbito",resume_scope:"Reanudar ahora",close:"Cerrar",pick_service:"Seleccionar un servicio",retry:"Reintentar",action_label_placeholder:"Etiqueta (opcional)",action_no_parameters:"Esta acci\xF3n no tiene campos configurables.",actions_field_help_show:"Marca una casilla para hacer que un campo sea editable por escena.",actions_field_help_default:"Establece un valor predeterminado para rellenarlo previamente.",clear_default:"Borrar predeterminado",set_default:"Establecer predeterminado",default_prefix:"Predeterminado: ",editing:"Editando\u2026",show_in_scene_editor:"Mostrar en el editor de escenas",extra_fields_prefix:"Campos adicionales:",extra_fields_hint:"Estos campos no est\xE1n expuestos actualmente pero se enviar\xE1n igualmente.",service_has_no_fields:"Este servicio no tiene campos.",service_unavailable:"Servicio no disponible en esta instancia de HA.",action_unavailable:"La acci\xF3n ya no est\xE1 disponible; config\xFArala en Ajustes \u2192 Acciones o elimina esta acci\xF3n.",raw_config_action:"Acci\xF3n",raw_config_targets:"Objetivos",raw_config_params:"Par\xE1metros",occupancy_any:"Cualquiera de",occupancy_all:"Todos de",occupancy_detected:"Detectado",occupancy_clear:"Libre",occupancy_for:"durante",day_pick_weekday:"Selecciona al menos un d\xEDa de la semana.",state_sentinel:"Estado",invalid_datetime:"Introduce una fecha y hora v\xE1lidas.",simulate_title:"Simular",simulate_when_hint:"controla el sol, la hora del d\xEDa, el d\xEDa de la semana y los d\xEDas laborables",simulate_sun_resolved:"\u2192 {time}",simulate_sun_undefined:"sin {anchor} en esta fecha",simulate_sun_unresolved:"Esta hora solar no se puede resolver para la fecha seleccionada.",simulate_inputs_heading:"Entradas de las que depende esta categor\xEDa",simulate_button:"Simular",reset_to_now:"Restablecer a ahora",reset_to_live:"Restablecer a en vivo",true_label:"Verdadero",false_label:"Falso",for_at_least:"al menos",for_less_than:"menos de",for_label:"Durante",duration_held_hint:"Cu\xE1nto tiempo ha mantenido este estado (h:m:s)",away:"Fuera",home:"Casa",refresh:"Actualizar",new_traces_refresh:"Nuevas trazas \u2014 actualizar",clear_traces:"Borrar",download_diagnostics:"Descargar diagn\xF3sticos",no_traces_yet:"A\xFAn no hay trazas para esta categor\xEDa.",yaml_expect_object:"Se esperaba un objeto",yaml_script_string:"`script` debe ser una cadena 'script.<nombre>'",yaml_args_object:"`args` debe ser un objeto si est\xE1 presente",yaml_triggers_list:"`triggers` debe ser una lista de cadenas entity_id si est\xE1 presente",template_result:"Resultado",template_truthy:"verdadero \u2014 coincide",template_falsy:"falso \u2014 no coincide",conditions_hint_body:"Configura D\xEDas laborables y Tiempo en Condiciones para usarlos en las condiciones de tus escenas.",conditions_hint_body_weather:"Configura Tiempo en Condiciones para usarlo en las condiciones de tus escenas.",conditions_hint_body_workday:"Configura D\xEDas laborables en Condiciones para usarlos en las condiciones de tus escenas.",conditions_hint_cta:"Configurar condiciones",conditions_hint_title:"Opcional: configurar D\xEDas laborables y Tiempo",conditions_hint_title_weather:"Opcional: configurar Tiempo",conditions_hint_title_workday:"Opcional: configurar D\xEDas laborables",dismiss:"Descartar",fado_notice_title:"Recomendado: instalar Fado Light Fader",fado_notice_body:"Fado a\xF1ade atenuaci\xF3n suave de luces para brillo, color y temperatura de color, con restauraci\xF3n autom\xE1tica del brillo, autoconfiguraci\xF3n por interfaz y transiciones nativas. Es una integraci\xF3n HACS predeterminada de Home Assistant.",fado_notice_cta:"Instalar con HACS",for_prefix:"durante",name_duplicate:"Ya existe una escena con este nombre en esta categor\xEDa.",no_exposed_actions:"A\xF1ade servicios en Ajustes \u2192 Acciones.",people_for:"durante",people_is_at:"Est\xE1 en",people_is_at_static:"est\xE1 en",people_is_not_at:"No est\xE1 en",people_mode_all:"Todos:",people_mode_any:"Cualquiera de:",people_mode_anybody:"Cualquiera",people_mode_everybody:"Todos",people_mode_nobody:"Nadie",people_mode_none:"Ninguno de:",people_none_tracked:"No hay personas rastreadas",people_select_one:"Selecciona al menos una persona",unavailable_select_one:"Selecciona al menos una entidad",people_where_home:"Casa",scope_house:"Casa",history_nothing_to_undo:"Nada que deshacer",history_nothing_to_redo:"Nada que rehacer",history_undo_tooltip:"Deshacer: {change}",history_redo_tooltip:"Rehacer: {change}",history_untitled:"Sin t\xEDtulo",history_action_add:'Escena "{scene}" a\xF1adida en {scope}',history_action_edit:'Escena "{scene}" editada en {scope}',history_action_delete:'Escena "{scene}" eliminada en {scope}',history_action_reorder:"Escenas reordenadas en {scope}",history_action_unpin:'Escena "{scene}" desfijada en {scope}',history_action_toggle:'Escena "{scene}" activada/desactivada en {scope}',history_conflict_body:"Otra pesta\xF1a cambi\xF3 las escenas de este \xE1mbito mientras editabas.",history_conflict_overwrite:"Sobrescribir las suyas",history_conflict_load:"Cargar las suyas",script_triggers:"Disparadores",script_triggers_help:"Reeval\xFAa esta escena cuando cambien estas entidades. Un script es opaco, por lo que pueden perderse referencias en plantillas \u2014 a\xF1ade las que dependan de \xE9l.",script_triggers_none:"Sin disparadores",simulate:"Simular",state_add_condition:"A\xF1adir cl\xE1usula",state_add_first:"A\xF1adir cl\xE1usula",state_add_value:"+ A\xF1adir estado",state_attribute_placeholder:"dejar en blanco para comparar el estado",state_entity:"Entidad",state_err_entity:"La entidad es obligatoria",state_err_incomplete:"Esta condici\xF3n est\xE1 incompleta",state_err_numeric:"El valor debe ser un n\xFAmero",state_err_state:"El estado es obligatorio",state_err_value:"El valor es obligatorio",state_for:"Durante (opcional)",state_new_condition:"(nueva condici\xF3n)",state_not_toggle:"Negar (NO)",state_op_header:"Comparaci\xF3n",state_unwrap_group:"Eliminar estos par\xE9ntesis (promover hijos al padre)",state_value_label:"Valor",state_where:"Donde",state_wrap:"Envolver en grupo",state_wrap_group:"Envolver estas cl\xE1usulas entre par\xE9ntesis",show_more_info:"Mostrar m\xE1s informaci\xF3n",cause_has_time:"Comprobaci\xF3n peri\xF3dica de hora",cause_switch:"Interruptor activado",cause_manual:"Aplicaci\xF3n manual",cause_startup:"Inicio",cause_reloaded:"Recargado",cause_simulated:"Simulaci\xF3n",cause_clock:"Hora del d\xEDa",cause_sun:"Posici\xF3n del sol",cause_reapply:"Volver a ejecutar",cause_duration_for:"durante",outcome_label_acted:"aplicado",outcome_label_no_op:"bloqueado",outcome_label_debounced:"sin cambios",outcome_label_no_match:"sin coincidencia",outcome_label_skipped:"omitido",count_action_one:"{n} acci\xF3n",count_action_other:"{n} acciones",count_entity_one:"{n} entidad",count_entity_other:"{n} entidades",winner_default:"La escena coincidente",outcome_summary_acted_all_skipped:"{winner} coincidi\xF3 \u2014 {skipped_phrase} omitido (no expuesto); nada aplicado.",outcome_summary_acted_entities:"Aplicado {winner} \u2014 {acts} en {entities}.{tail}",outcome_summary_acted:"Aplicado {winner} \u2014 {acts}.{tail}",outcome_summary_skipped_tail:" ({skipped} omitidos \u2014 no expuestos)",outcome_summary_no_op:"{winner} coincidi\xF3 pero no tiene acciones \u2014 bloquea que se apliquen escenas inferiores. Nada cambi\xF3.",outcome_summary_debounced:"{winner} coincidi\xF3, pero ya est\xE1 aplicado \u2014 no se reenvi\xF3 nada.",outcome_summary_no_match:"Ninguna escena coincidi\xF3 \u2014 nada aplicado.",outcome_summary_skipped_switch_off:"Omitido \u2014 el interruptor de pausa del \xE1mbito est\xE1 apagado.",outcome_summary_skipped_scope_disabled:"Omitido \u2014 el \xE1mbito est\xE1 desactivado.",outcome_summary_skipped_unavailable:"Omitido \u2014 la entidad que dispar\xF3 qued\xF3 no disponible; los dispositivos se dejaron como estaban.",section_scene_evaluation:"Evaluaci\xF3n de escenas",section_actions_taken:"Acciones realizadas",trigger_prefix:"Disparador: ",trace_won_prefix:"Gan\xF3: ",skipped_not_exposed:" \u2014 omitido (no expuesto)",trace_scene_prefix:"Escena n.\xBA ",trace_scene_disabled:"desactivada",trace_scene_not_reached:"no alcanzada",trace_scene_matched:"\u2713 coincide",trace_scene_no_match:"\u2717 sin coincidencia",scene_live:"Activa ahora \u2014 esta escena coincide y est\xE1 aplicada",scene_applied_stale:"Sigue aplicada \u2014 las acciones de esta escena est\xE1n en efecto pero ya no coincide",version_update:{message:"Se ha instalado Ambience {version}: recarga para actualizar.",reload:"Recargar"}},blocker_summary:{block:"Bloquear",block_mid:"bloquear",until:"hasta",while:"mientras",while_lead:"Mientras",or:"o",and:"y",always:"siempre"},day_summary:{any:"cualquiera",any_day:"cualquier d\xEDa",except:"excepto",day_prefix:"d\xEDa",last_day:"\xFAltimo d\xEDa",workday:"d\xEDa laborable",holiday:"festivo",first_workday:"primer d\xEDa laborable",last_workday:"\xFAltimo d\xEDa laborable"},month:{1:"Enero",2:"Febrero",3:"Marzo",4:"Abril",5:"Mayo",6:"Junio",7:"Julio",8:"Agosto",9:"Septiembre",10:"Octubre",11:"Noviembre",12:"Diciembre"},weather_condition:{"clear-night":"Despejado (noche)",cloudy:"Nublado",fog:"Niebla",hail:"Granizo",lightning:"Tormenta el\xE9ctrica","lightning-rainy":"Tormenta con lluvia",partlycloudy:"Parcialmente nublado",pouring:"Lluvia intensa",rainy:"Lluvioso",snowy:"Nevado","snowy-rainy":"Nieve con lluvia",sunny:"Soleado",windy:"Ventoso","windy-variant":"Ventoso (variante)",exceptional:"Excepcional"},weather_attr:{temperature:"Temperatura",apparent_temperature:"Temperatura aparente",humidity:"Humedad",wind_speed:"Velocidad del viento",pressure:"Presi\xF3n"},state_op:{is:"es",is_not:"no es",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"Y",or:"O",and_not:"Y NO",or_not:"O NO",not:"NO"},trace_reason:{day_workday_sensor_unconfigured:"sensor de d\xEDa laborable no configurado",day_workday_calendar_unconfigured:"calendario de d\xEDas laborables no configurado",lux_range_missing:"el rango de lux {range} ya no existe",lux_sensor_not_numeric:"{name} ({value}) no informa un n\xFAmero",period_missing:"el periodo del d\xEDa {period} ya no existe",sun_not_configured:"la integraci\xF3n sun no est\xE1 configurada",sun_anchor_undefined:"{anchor} no est\xE1 definido hoy en esta ubicaci\xF3n",weather_entity_unconfigured:"entidad meteorol\xF3gica no configurada",weather_group_missing:"el grupo meteorol\xF3gico {group} ya no existe"}},pt:{time_of_day_period:{dawn:"Madrugada",morning:"Manh\xE3",afternoon:"Tarde",evening:"Fim de tarde",nighttime:"Noite",daytime:"Dia"},weekday:{mon:"Seg",tue:"Ter",wed:"Qua",thu:"Qui",fri:"Sex",sat:"S\xE1b",sun:"Dom"},day_item:{weekday:"Dia da semana",day_of_month:"Dia do m\xEAs",date:"Data (anual)",date_range:"Intervalo de datas (anual)",last_day:"\xDAltimo dia do m\xEAs",workday:"Dia \xFAtil",holiday:"Feriado",first_workday:"Primeiro dia \xFAtil do m\xEAs",last_workday:"\xDAltimo dia \xFAtil do m\xEAs"},lux_range:{dark:"Escuro",dim:"Pouca luz",normal:"Normal",bright:"Claro",very_bright:"Muito claro"},category_color:{red:"Vermelho",pink:"Rosa",purple:"Roxo","deep-purple":"Roxo escuro",indigo:"\xCDndigo",blue:"Azul","light-blue":"Azul claro",cyan:"Ciano",teal:"Verde-azulado",green:"Verde","light-green":"Verde claro",lime:"Lima",yellow:"Amarelo",amber:"\xC2mbar",orange:"Laranja","deep-orange":"Laranja escuro",brown:"Castanho",grey:"Cinzento","blue-grey":"Cinzento azulado"},condition:{time_of_day:"Hora do dia",state:"Estado da entidade",script:"Script",sun:"Sol",template:"Template",lux:"Lux",unavailable:"Indispon\xEDvel"},action:{},anchor:{dawn:"Madrugada",sunrise:"Nascer do sol",noon:"Meio-dia",sunset:"P\xF4r do sol",dusk:"Anoitecer",midnight:"Meia-noite"},ui:{language_request:{message:"O idioma do seu Home Assistant \xE9 {language}, mas o {product} ainda n\xE3o est\xE1 traduzido para esse idioma.",action:"Pedir uma tradu\xE7\xE3o \u2192",dismiss:"Dispensar"},panel_title:"Ambience",card_load_failed:"N\xE3o foi poss\xEDvel carregar o cart\xE3o do Ambience \u2014 verifique a liga\xE7\xE3o e atualize.",tab_settings:"Defini\xE7\xF5es",settings_tab_ambience:"Avan\xE7ado",settings_tab_conditions:"Condi\xE7\xF5es",settings_tab_actions:"A\xE7\xF5es",settings_ambience_pause_card:"Interruptor de pausa ao n\xEDvel do \xE2mbito",help_pause_switch:"O Ambience cria uma entidade de interruptor para cada \xE2mbito de \xE1rea, piso e casa ativado. Desligar o interruptor de um \xE2mbito pausa o Ambience para esse \xE2mbito.",settings_tab_import:"IA",import_title:"Criar e corrigir cenas com IA",import_beta:"Beta",import_mcp_title:"Criar cenas ao vivo com o servidor MCP",import_mcp_desc:"Instale o servidor MCP para a forma mais r\xE1pida de criar e editar cenas, com o Claude Code ou o Claude Desktop.",import_mcp_link:"Configurar o servidor MCP",import_mcp_recommended:"Recomendado",import_paste_title:"Em alternativa, descarregue e cole em qualquer IA",import_help_link:"Guia de instala\xE7\xE3o e utiliza\xE7\xE3o",import_step1:"Instale a skill ou plugin",import_step1_desc:"Adicione o pacote de IA do Ambience \xE0 sua IA \u2014 um plugin do Claude Code, uma skill do claude.ai, ou um guia para colar em qualquer IA.",import_step2:"Transfira o seu pacote de IA",import_step2_desc:"Um instant\xE2neo das suas \xE1reas, entidades e a\xE7\xF5es expostas (dados de localiza\xE7\xE3o ocultados) para a IA usar como base. Forne\xE7a-o \xE0 IA juntamente com o seu pedido.",import_step3:"Carregue o resultado",import_step3_desc:"Carregue o ficheiro YAML ou JSON que a IA lhe der. \xC9 pr\xE9-visualizado antes de algo ser guardado.",import_download_bundle:"Transferir pacote de IA",import_target:"Alvo",import_new_category:"Nova categoria a criar",import_unknown_categories:"Categorias desconhecidas (crie-as primeiro)",import_adds:"Adicionar",import_updates:"Atualizar",import_removes:"Remover",import_confirm:"Importar",import_done:"Importado com sucesso.",import_feedback_title:"Consegue fazer melhor do que a IA?",import_feedback_body:"Se a IA lhe der maus conselhos, partilhe a sugest\xE3o dela, a sua vers\xE3o corrigida, e uma breve nota sobre o que estava errado \u2014 \xE9 usado para melhorar o livro de receitas com que a IA aprende.",import_feedback_link:"Comunicar no GitHub",settings_ambience_field_name:"Nome do interruptor",settings_ambience_field_pause:"Pausar durante",settings_reapply_enable_label:"Reexecutar todas as cenas ap\xF3s inatividade",settings_reapply_interval_label:"Reexecutar ap\xF3s",apply_on_every_match:"Aplicar em cada correspond\xEAncia",help_apply_on_every_match:"Quando ativado, o Ambience reaplica as a\xE7\xF5es desta cena sempre que ela vence o seu \xE2mbito/categoria, e n\xE3o apenas na primeira vez que se torna a cena ativa.",unit_minutes:"minutos",help:"Ajuda",open_documentation:"Abrir documenta\xE7\xE3o",read_documentation:"Ler mais",help_switch_name:"O nome usado para as entidades de interruptor de pausa de cada \xE2mbito.",help_pause_for:"Quando o interruptor de um \xE2mbito \xE9 desligado, retomar automaticamente ap\xF3s este n\xFAmero de minutos. 0 = permanece em pausa at\xE9 ser ligado novamente.",help_reapply_toggle:"Reexecutar as cenas de um \xE2mbito/categoria ap\xF3s inatividade e reaplicar a cena vencedora, caso alguma a\xE7\xE3o tenha falhado anteriormente, como uma luz que n\xE3o se desligou.",help_reapply_after:"Reexecutar cenas que n\xE3o s\xE3o atualizadas h\xE1 este n\xFAmero de minutos.",settings_expose_group:"Expor a assistentes de voz",settings_expose_assist:"Assist",settings_expose_google:"Google Assistant",settings_expose_alexa:"Alexa",help_expose:"Expor os interruptores de pausa de cada \xE2mbito aos assistentes de voz selecionados para poder pausar/retomar o Ambience por voz. O Google Assistant e a Alexa requerem o Home Assistant Cloud ou uma configura\xE7\xE3o manual.",help_actions_tab:"As a\xE7\xF5es s\xE3o as chamadas de servi\xE7o que uma cena executa. Defina-as aqui para que as cenas as possam reutilizar.",help_show_in_scene_editor:"Mostrar este campo no editor de cenas para que cada cena o possa definir. Deixe desativado para enviar antes um valor predefinido fixo.",help_set_default:"Um valor enviado automaticamente quando a a\xE7\xE3o \xE9 executada. As cenas podem substitu\xED-lo se o campo tamb\xE9m for mostrado no editor.",help_conditions_tab:"As condi\xE7\xF5es s\xE3o os dados de entrada com que as cenas correspondem (hora do dia, presen\xE7a, meteorologia, \u2026). Uma cena vence quando todas as suas condi\xE7\xF5es s\xE3o satisfeitas.",help_categories_tab:"As categorias permitem que um \xE2mbito tenha v\xE1rios vencedores independentes em simult\xE2neo \u2014 uma cena vence por categoria.",no_areas:"N\xE3o foram encontradas \xE1reas no Home Assistant.",not_configured:"n\xE3o configurado",scene_singular:"cena",scene_plural:"cenas",all_categories:"Todas as categorias",add_category:"Adicionar categoria\u2026",loading:"A carregar\u2026",any_placeholder:"(qualquer)",include:"Incluir",exclude:"Excluir",empty_all_days:"(vazio \u2192 todos os dias)",add_include_item:"+ Adicionar item a incluir",add_exclude_item:"+ Adicionar item a excluir",from:"de",to:"a",remove:"Remover",day_of_month_placeholder:"ex.: 1-10, 15",workday_sensor:"Sensor de dia \xFAtil",workday_calendar:"Calend\xE1rio de dias \xFAteis",periods_heading:"Per\xEDodos",badge_builtin:"incorporado",badge_custom:"personalizado",add_custom_period:"+ Adicionar per\xEDodo personalizado",lux_heading:"Intervalos de lux",add_custom_lux_range:"+ Adicionar intervalo de lux personalizado",lux_modal_add_title:"Adicionar intervalo de lux personalizado",lux_modal_edit_title:'Editar "{name}"',lux_min_label:"M\xEDn. (lx)",lux_max_label:"M\xE1x. (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"\xE9",occupancy_is_not:"n\xE3o \xE9",lux_any:"Qualquer um de",lux_all:"Todos de",lux_is:"\xE9",lux_is_not:"n\xE3o \xE9",title_edit:"Editar",title_delete:"Eliminar",new_scene:"Nova cena",new_scene_default:"Nova cena",name_optional:"Nome (opcional)",category:"Categoria",scope:"\xC2mbito",when_heading:"Quando",actions_heading:"A\xE7\xF5es",target:"Alvo",remove_action:"Remover a\xE7\xE3o",add_action:"+ Adicionar a\xE7\xE3o\u2026",remove_condition:"Remover condi\xE7\xE3o",add_condition:"+ Adicionar condi\xE7\xE3o\u2026",add_description:"+ Adicionar descri\xE7\xE3o",description:"Descri\xE7\xE3o",add_action_button:"Adicionar a\xE7\xE3o",cancel:"Cancelar",save:"Guardar",save_scene:"Guardar cena",at_least_one_target:"\xC9 necess\xE1rio pelo menos um alvo.",condition_error:"Corrija o erro nesta condi\xE7\xE3o antes de continuar",no_scenes_yet:"Ainda n\xE3o h\xE1 cenas.",add_scene:"+ Adicionar cena",summary_any:"qualquer",summary_any_paren:"(qualquer)",summary_always:"Sempre",no_targets:"(sem alvos)",target_noun:"alvo",action_singular:"a\xE7\xE3o",action_plural:"a\xE7\xF5es",scene_n:"Cena {n}",drag_to_reorder:"Arraste para reordenar",unpin:"Desafixar (voltar \xE0 ordem autom\xE1tica)",enable_scene:"Ativar cena",disable_scene:"Desativar cena",shadowed:"Nunca dispara \u2014 encoberta por uma cena anterior.",problem_missing:"Em falta ou desativada no Home Assistant:",problem_overlap:"Controlada por v\xE1rios grupos:",problem_config:"Problemas de configura\xE7\xE3o:",problems_count:"{n} cena(s) com problemas",badge_needs_workday_sensor:"precisa de um sensor de dia \xFAtil",badge_needs_workday_calendar:"precisa de um calend\xE1rio de dias \xFAteis",badge_needs_weather_entity:"precisa de uma entidade meteorol\xF3gica",badge_missing_weather_group:"grupo meteorol\xF3gico {id} em falta",badge_missing_period:"per\xEDodo {id} em falta",badge_missing_lux_range:"intervalo de lux {id} em falta",badge_unexposed_action:"a\xE7\xE3o {id} n\xE3o exposta",edit:"Editar",duplicate:"Duplicar",run_actions:"Executar a\xE7\xF5es",run:"Executar",auto_triggers_section:"Acionadores autom\xE1ticos",auto_triggers_none:"Sem acionadores autom\xE1ticos.",auto_triggers_opaque_note:"Uma cena de script \xE9 opaca \u2014 alguns acompanhamentos podem estar em falta. Declare-os no campo Acionadores da cena.",auto_trigger_group_time:"Hora",auto_trigger_group_sun:"Sol",auto_trigger_group_domain:"Lista de pessoas",auto_trigger_domain_membership:"{domains} adicionado ou removido",auto_trigger_date_rollover:"Meia-noite local (mudan\xE7a de data)",auto_trigger_periodic:"reverifica\xE7\xE3o peri\xF3dica",more_actions:"Mais a\xE7\xF5es",scene_actions:"A\xE7\xF5es da cena",error_enter_name:"Introduza um nome.",error_start_letter:"O nome tem de come\xE7ar por uma letra.",error_name_exists:"J\xE1 existe uma entrada com este nome. Escolha um nome diferente.",period_modal_add_title:"Adicionar per\xEDodo personalizado",period_modal_edit_title:'Editar "{name}"',name:"Nome",name_placeholder:"ex.: Relaxar",lux_name_placeholder:"ex.: Sombrio",lux_error_need_bound:"Introduza um m\xEDnimo, um m\xE1ximo, ou ambos.",lux_error_negative:"Os limites t\xEAm de ser 0 ou superiores.",lux_error_order:"O m\xEDnimo tem de ser inferior ao m\xE1ximo.",lux_error_not_integer:"Os limites t\xEAm de ser n\xFAmeros inteiros.",from_label:"De",to_label:"At\xE9",any_time:"Qualquer hora",custom_range:"Intervalo personalizado",custom_suffix:" (personalizado)",add_time_range:"+ adicionar outro intervalo de tempo",endpoint_time:"Hora",endpoint_sun:"Sol",offset_placeholder:"Desvio",clamp_none:"\u2014",clamp_not_before:"n\xE3o antes de",clamp_not_after:"n\xE3o depois de",unit_hour:"hora",unit_hours:"horas",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"N\xE3o h\xE1 entidades correspondentes nesta \xE1rea.",field_kind:"Tipo",field_days_of_month:"Dias do m\xEAs",field_month:"M\xEAs",field_day:"Dia",field_from_month:"Do m\xEAs",field_from_day:"Do dia",field_to_month:"Ao m\xEAs",field_to_day:"Ao dia",day_spec_error:"Use dias 1\u201331 e intervalos como 1-10, separados por v\xEDrgulas",title_override:"Substituir",thresholds:"Limiares",add_threshold:"+ Adicionar limiar",weather_entity:"Entidade meteorol\xF3gica",groups:"Grupos",add_group:"+ Adicionar grupo",sun:{elevation:"Eleva\xE7\xE3o",azimuth:"Azimute",any:"Qualquer",above:"Acima",below:"Abaixo",between:"Entre",custom_range:"Intervalo personalizado"},arguments:"Argumentos",form:"Formul\xE1rio",script:"Script",yaml:"YAML",settings_tab_categories:"Categorias",category_add:"+ Adicionar categoria",category_name_placeholder:"Nome da categoria",category_icon:"\xCDcone",category_color:"Cor",category_name_blank_error:"Os nomes das categorias n\xE3o podem estar vazios.",category_name_duplicate_error:"Duas categorias n\xE3o podem ter o mesmo nome.",category_delete_blocked_last:"N\xE3o pode eliminar a \xFAltima categoria.",category_delete_blocked_in_use:"Esta categoria ainda tem cenas \u2014 mova-as ou elimine-as primeiro.",category_edit_title:"Editar categoria",category_add_title:"Adicionar categoria",category_color_none:"Sem cor",category_save:"Guardar",view_traces:"Ver rastreios",pause_scope:"Pausar este \xE2mbito",resume_scope:"Retomar agora",close:"Fechar",pick_service:"Escolher um servi\xE7o",retry:"Tentar novamente",action_label_placeholder:"R\xF3tulo (opcional)",action_no_parameters:"Esta a\xE7\xE3o n\xE3o tem campos configur\xE1veis.",actions_field_help_show:"Marque uma caixa para tornar um campo edit\xE1vel por cena.",actions_field_help_default:"Defina um valor predefinido para o preencher previamente.",clear_default:"Limpar predefini\xE7\xE3o",set_default:"Definir predefini\xE7\xE3o",default_prefix:"Predefini\xE7\xE3o: ",editing:"A editar\u2026",show_in_scene_editor:"Mostrar no editor de cenas",extra_fields_prefix:"Campos extra:",extra_fields_hint:"Estes campos n\xE3o est\xE3o atualmente expostos mas ser\xE3o enviados na mesma.",service_has_no_fields:"Este servi\xE7o n\xE3o tem campos.",service_unavailable:"Servi\xE7o n\xE3o dispon\xEDvel nesta inst\xE2ncia do HA.",action_unavailable:"A\xE7\xE3o j\xE1 n\xE3o dispon\xEDvel; configure-a em Defini\xE7\xF5es \u2192 A\xE7\xF5es ou remova esta a\xE7\xE3o.",raw_config_action:"A\xE7\xE3o",raw_config_targets:"Alvos",raw_config_params:"Par\xE2metros",occupancy_any:"Qualquer um de",occupancy_all:"Todos de",occupancy_detected:"Detetado",occupancy_clear:"Livre",occupancy_for:"durante",day_pick_weekday:"Escolha pelo menos um dia da semana.",state_sentinel:"Estado",invalid_datetime:"Introduza uma data e hora v\xE1lidas.",simulate_title:"Simular",simulate_when_hint:"controla o sol, a hora do dia, o dia da semana e o dia \xFAtil",simulate_sun_resolved:"\u2192 {time}",simulate_sun_undefined:"sem {anchor} nesta data",simulate_sun_unresolved:"N\xE3o \xE9 poss\xEDvel resolver esta hora solar para a data selecionada.",simulate_inputs_heading:"Entradas de que esta categoria depende",simulate_button:"Simular",reset_to_now:"Repor para agora",reset_to_live:"Repor para o estado atual",true_label:"Verdadeiro",false_label:"Falso",for_at_least:"pelo menos",for_less_than:"menos de",for_label:"Durante",duration_held_hint:"H\xE1 quanto tempo mant\xE9m este estado (h:m:s)",away:"Fora",home:"Casa",refresh:"Atualizar",new_traces_refresh:"Novos rastreios \u2014 atualizar",clear_traces:"Limpar",download_diagnostics:"Transferir diagn\xF3sticos",no_traces_yet:"Ainda n\xE3o h\xE1 rastreios para esta categoria.",yaml_expect_object:"Esperava-se um objeto",yaml_script_string:"`script` tem de ser uma cadeia 'script.<name>'",yaml_args_object:"`args` tem de ser um objeto, se presente",yaml_triggers_list:"`triggers` tem de ser uma lista de cadeias entity_id, se presente",template_result:"Resultado",template_truthy:"verdadeiro \u2014 corresponde",template_falsy:"falso \u2014 sem correspond\xEAncia",conditions_hint_body:"Configure Dia \xFAtil e Meteorologia em Condi\xE7\xF5es para os usar nas condi\xE7\xF5es das suas cenas.",conditions_hint_body_weather:"Configure Meteorologia em Condi\xE7\xF5es para a usar nas condi\xE7\xF5es das suas cenas.",conditions_hint_body_workday:"Configure Dia \xFAtil em Condi\xE7\xF5es para o usar nas condi\xE7\xF5es das suas cenas.",conditions_hint_cta:"Configurar condi\xE7\xF5es",conditions_hint_title:"Opcional: configurar Dia \xFAtil e Meteorologia",conditions_hint_title_weather:"Opcional: configurar Meteorologia",conditions_hint_title_workday:"Opcional: configurar Dia \xFAtil",dismiss:"Dispensar",fado_notice_title:"Recomendado: instalar o Fado Light Fader",fado_notice_body:"O Fado adiciona transi\xE7\xF5es suaves de luz para brilho, cor e temperatura de cor \u2014 com restauro autom\xE1tico de brilho, autoconfigura\xE7\xE3o da interface, e transi\xE7\xF5es nativas. \xC9 uma integra\xE7\xE3o HACS predefinida do Home Assistant.",fado_notice_cta:"Instalar via HACS",for_prefix:"durante",name_duplicate:"J\xE1 existe uma cena com este nome nesta categoria.",no_exposed_actions:"Adicione servi\xE7os em Defini\xE7\xF5es \u2192 A\xE7\xF5es.",people_for:"durante",people_is_at:"Est\xE1 em",people_is_at_static:"est\xE1 em",people_is_not_at:"N\xE3o est\xE1 em",people_mode_all:"Todos de:",people_mode_any:"Qualquer um de:",people_mode_anybody:"Qualquer pessoa",people_mode_everybody:"Todos",people_mode_nobody:"Ningu\xE9m",people_mode_none:"Nenhum de:",people_none_tracked:"N\xE3o h\xE1 pessoas monitorizadas",people_select_one:"Selecione pelo menos uma pessoa",unavailable_select_one:"Selecione pelo menos uma entidade",people_where_home:"Casa",scope_house:"Casa",history_nothing_to_undo:"Nada para anular",history_nothing_to_redo:"Nada para refazer",history_undo_tooltip:"Anular: {change}",history_redo_tooltip:"Refazer: {change}",history_untitled:"Sem t\xEDtulo",history_action_add:'Cena "{scene}" adicionada em {scope}',history_action_edit:'Cena "{scene}" editada em {scope}',history_action_delete:'Cena "{scene}" eliminada em {scope}',history_action_reorder:"Cenas reordenadas em {scope}",history_action_unpin:'Cena "{scene}" desafixada em {scope}',history_action_toggle:'Cena "{scene}" alternada em {scope}',history_conflict_body:"Outro separador alterou as cenas neste \xE2mbito enquanto estava a editar.",history_conflict_overwrite:"Substituir as deles",history_conflict_load:"Carregar as deles",script_triggers:"Acionadores",script_triggers_help:"Reavaliar esta cena quando estas entidades mudarem. Um script \xE9 opaco, pelo que refer\xEAncias em template podem passar despercebidas \u2014 adicione todas de que ele depende.",script_triggers_none:"Sem acionadores",simulate:"Simular",state_add_condition:"Adicionar cl\xE1usula",state_add_first:"Adicionar cl\xE1usula",state_add_value:"+ Adicionar estado",state_attribute_placeholder:"deixe em branco para comparar o estado",state_entity:"Entidade",state_err_entity:"A entidade \xE9 obrigat\xF3ria",state_err_incomplete:"Esta condi\xE7\xE3o est\xE1 incompleta",state_err_numeric:"O valor tem de ser um n\xFAmero",state_err_state:"O estado \xE9 obrigat\xF3rio",state_err_value:"O valor \xE9 obrigat\xF3rio",state_for:"Durante (opcional)",state_new_condition:"(nova condi\xE7\xE3o)",state_not_toggle:"Negar (N\xC3O)",state_op_header:"Compara\xE7\xE3o",state_unwrap_group:"Remover estes par\xEAnteses (promover os filhos ao n\xEDvel superior)",state_value_label:"Valor",state_where:"Onde",state_wrap:"Agrupar",state_wrap_group:"Envolver estas cl\xE1usulas em par\xEAnteses",show_more_info:"Mostrar mais informa\xE7\xE3o",cause_has_time:"Verifica\xE7\xE3o peri\xF3dica de tempo",cause_switch:"Interruptor ligado",cause_manual:"Aplica\xE7\xE3o manual",cause_startup:"Arranque",cause_reloaded:"Recarregado",cause_simulated:"Simula\xE7\xE3o",cause_clock:"Hora do dia",cause_sun:"Posi\xE7\xE3o do sol",cause_reapply:"Reexecu\xE7\xE3o",cause_duration_for:"durante",outcome_label_acted:"aplicada",outcome_label_no_op:"bloqueada",outcome_label_debounced:"inalterada",outcome_label_no_match:"sem correspond\xEAncia",outcome_label_skipped:"ignorada",count_action_one:"{n} a\xE7\xE3o",count_action_other:"{n} a\xE7\xF5es",count_entity_one:"{n} entidade",count_entity_other:"{n} entidades",winner_default:"A cena correspondente",outcome_summary_acted_all_skipped:"{winner} correspondeu \u2014 {skipped_phrase} ignorada(s) (n\xE3o expostas); nada foi aplicado.",outcome_summary_acted_entities:"{winner} aplicada \u2014 {acts} em {entities}.{tail}",outcome_summary_acted:"{winner} aplicada \u2014 {acts}.{tail}",outcome_summary_skipped_tail:" ({skipped} ignorada(s) \u2014 n\xE3o expostas)",outcome_summary_no_op:"{winner} correspondeu mas n\xE3o tem a\xE7\xF5es \u2014 impede a aplica\xE7\xE3o de cenas inferiores. Nada mudou.",outcome_summary_debounced:"{winner} correspondeu, mas j\xE1 est\xE1 aplicada \u2014 nada foi reenviado.",outcome_summary_no_match:"Nenhuma cena correspondeu \u2014 nada foi aplicado.",outcome_summary_skipped_switch_off:"Ignorado \u2014 o interruptor de pausa do \xE2mbito est\xE1 desligado.",outcome_summary_skipped_scope_disabled:"Ignorado \u2014 o \xE2mbito est\xE1 desativado.",outcome_summary_skipped_unavailable:"Ignorado \u2014 a entidade que acionou ficou indispon\xEDvel; os dispositivos foram deixados como est\xE3o.",section_scene_evaluation:"Avalia\xE7\xE3o da cena",section_actions_taken:"A\xE7\xF5es executadas",trigger_prefix:"Acionador: ",trace_won_prefix:"Vencedora: ",skipped_not_exposed:" \u2014 ignorada (n\xE3o exposta)",trace_scene_prefix:"Cena #",trace_scene_disabled:"desativada",trace_scene_not_reached:"n\xE3o alcan\xE7ada",trace_scene_matched:"\u2713 correspondeu",trace_scene_no_match:"\u2717 sem correspond\xEAncia",scene_live:"Ativa agora \u2014 esta cena corresponde atualmente e est\xE1 aplicada",scene_applied_stale:"Ainda aplicada \u2014 as a\xE7\xF5es desta cena est\xE3o em vigor mas j\xE1 n\xE3o corresponde",version_update:{message:"O Ambience {version} foi instalado \u2014 recarregue para atualizar.",reload:"Recarregar"}},blocker_summary:{block:"Bloquear",block_mid:"bloquear",until:"at\xE9",while:"enquanto",while_lead:"Enquanto",or:"ou",and:"e",always:"sempre"},day_summary:{any:"qualquer",any_day:"qualquer dia",except:"exceto",day_prefix:"dia",last_day:"\xFAltimo dia",workday:"dia \xFAtil",holiday:"feriado",first_workday:"primeiro dia \xFAtil",last_workday:"\xFAltimo dia \xFAtil"},month:{1:"Janeiro",2:"Fevereiro",3:"Mar\xE7o",4:"Abril",5:"Maio",6:"Junho",7:"Julho",8:"Agosto",9:"Setembro",10:"Outubro",11:"Novembro",12:"Dezembro"},weather_condition:{"clear-night":"C\xE9u limpo (noite)",cloudy:"Nublado",fog:"Nevoeiro",hail:"Granizo",lightning:"Trovoada","lightning-rainy":"Trovoada com chuva",partlycloudy:"Parcialmente nublado",pouring:"Chuva forte",rainy:"Chuvoso",snowy:"Neve","snowy-rainy":"Neve com chuva",sunny:"Sol",windy:"Vento","windy-variant":"Vento (variante)",exceptional:"Excecional"},weather_attr:{temperature:"Temperatura",apparent_temperature:"Temperatura aparente",humidity:"Humidade",wind_speed:"Velocidade do vento",pressure:"Press\xE3o"},state_op:{is:"\xE9",is_not:"n\xE3o \xE9",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"E",or:"OU",and_not:"E N\xC3O",or_not:"OU N\xC3O",not:"N\xC3O"},trace_reason:{day_workday_sensor_unconfigured:"sensor de dia \xFAtil n\xE3o configurado",day_workday_calendar_unconfigured:"calend\xE1rio de dias \xFAteis n\xE3o configurado",lux_range_missing:"o intervalo de lux {range} j\xE1 n\xE3o existe",lux_sensor_not_numeric:"{name} ({value}) n\xE3o reporta um n\xFAmero",period_missing:"o per\xEDodo do dia {period} j\xE1 n\xE3o existe",sun_not_configured:"a integra\xE7\xE3o sun n\xE3o est\xE1 configurada",sun_anchor_undefined:"{anchor} n\xE3o est\xE1 definido hoje nesta localiza\xE7\xE3o",weather_entity_unconfigured:"entidade meteorol\xF3gica n\xE3o configurada",weather_group_missing:"o grupo meteorol\xF3gico {group} j\xE1 n\xE3o existe"}},fr:{time_of_day_period:{dawn:"Aube",morning:"Matin",afternoon:"Apr\xE8s-midi",evening:"Soir",nighttime:"Nuit",daytime:"Journ\xE9e"},weekday:{mon:"Lun",tue:"Mar",wed:"Mer",thu:"Jeu",fri:"Ven",sat:"Sam",sun:"Dim"},day_item:{weekday:"Jour de la semaine",day_of_month:"Jour du mois",date:"Date (annuelle)",date_range:"Plage de dates (annuelle)",last_day:"Dernier jour du mois",workday:"Jour ouvr\xE9",holiday:"Jour f\xE9ri\xE9",first_workday:"Premier jour ouvr\xE9 du mois",last_workday:"Dernier jour ouvr\xE9 du mois"},lux_range:{dark:"Sombre",dim:"Faible",normal:"Normal",bright:"Lumineux",very_bright:"Tr\xE8s lumineux"},category_color:{red:"Rouge",pink:"Rose",purple:"Violet","deep-purple":"Violet fonc\xE9",indigo:"Indigo",blue:"Bleu","light-blue":"Bleu clair",cyan:"Cyan",teal:"Sarcelle",green:"Vert","light-green":"Vert clair",lime:"Citron vert",yellow:"Jaune",amber:"Ambre",orange:"Orange","deep-orange":"Orange fonc\xE9",brown:"Marron",grey:"Gris","blue-grey":"Gris bleut\xE9"},condition:{time_of_day:"Moment de la journ\xE9e",state:"\xC9tat de l'entit\xE9",script:"Script",sun:"Soleil",template:"Mod\xE8le",lux:"Lux",unavailable:"Indisponible"},action:{},anchor:{dawn:"Aube",sunrise:"Lever du soleil",noon:"Midi",sunset:"Coucher du soleil",dusk:"Cr\xE9puscule",midnight:"Minuit"},ui:{language_request:{message:"La langue de votre Home Assistant est {language}, mais {product} n'est pas encore traduit dans cette langue.",action:"Demander une traduction \u2192",dismiss:"Ignorer"},panel_title:"Ambience",card_load_failed:"Le chargement de la carte Ambience a \xE9chou\xE9 \u2014 v\xE9rifiez la connexion et actualisez.",tab_settings:"Param\xE8tres",settings_tab_ambience:"Avanc\xE9",settings_tab_conditions:"Conditions",settings_tab_actions:"Actions",settings_ambience_pause_card:"Interrupteur de pause au niveau de la port\xE9e",help_pause_switch:"Ambience cr\xE9e une entit\xE9 interrupteur pour chaque port\xE9e zone, \xE9tage et maison activ\xE9e. \xC9teindre l'interrupteur d'une port\xE9e met Ambience en pause pour cette port\xE9e.",settings_tab_import:"IA",import_title:"Cr\xE9er et corriger des sc\xE8nes avec l'IA",import_beta:"B\xEAta",import_mcp_title:"Cr\xE9er en direct avec le serveur MCP",import_mcp_desc:"Installez le serveur MCP pour l'exp\xE9rience de cr\xE9ation et d'\xE9dition la plus rapide avec Claude Code ou Claude Desktop.",import_mcp_link:"Configurer le serveur MCP",import_mcp_recommended:"Recommand\xE9",import_paste_title:"Ou t\xE9l\xE9chargez et collez dans n'importe quelle IA",import_help_link:"Guide d'installation et d'utilisation",import_step1:"Installez la comp\xE9tence ou le plugin une fois",import_step1_desc:"Ajoutez le pack IA Ambience \xE0 votre IA pour lui apprendre Ambience.",import_step2:"T\xE9l\xE9chargez votre lot IA",import_step2_desc:"Le lot contient un instantan\xE9 de vos zones, entit\xE9s et actions expos\xE9es (donn\xE9es de localisation masqu\xE9es) que l'IA utilisera pour cr\xE9er. Envoyez-le \xE0 l'IA avec votre demande.",import_step3:"Envoyez le r\xE9sultat",import_step3_desc:"Envoyez le fichier YAML ou JSON fourni par l'IA. Un aper\xE7u s'affiche avant toute modification, et vous pouvez toujours les annuler avec le bouton Annuler.",import_download_bundle:"T\xE9l\xE9charger le lot IA",import_target:"Cible",import_new_category:"Nouvelle cat\xE9gorie \xE0 cr\xE9er",import_unknown_categories:"Cat\xE9gories inconnues (cr\xE9ez-les d'abord)",import_adds:"Ajouter",import_updates:"Mettre \xE0 jour",import_removes:"Supprimer",import_confirm:"Importer",import_done:"Import\xE9 avec succ\xE8s.",import_feedback_title:"Pouvez-vous faire mieux que l'IA ?",import_feedback_body:"Si l'IA vous donne un mauvais conseil, partagez sa suggestion, votre version corrig\xE9e et une br\xE8ve note sur ce qui n'allait pas \u2014 c'est utilis\xE9 pour am\xE9liorer le recueil dont l'IA s'inspire.",import_feedback_link:"Signalez-le sur GitHub",settings_ambience_field_name:"Nom de l'interrupteur",settings_ambience_field_pause:"Mettre en pause pendant",settings_reapply_enable_label:"R\xE9-ex\xE9cuter toutes les sc\xE8nes apr\xE8s inactivit\xE9",settings_reapply_interval_label:"R\xE9-ex\xE9cuter apr\xE8s",apply_on_every_match:"Appliquer \xE0 chaque correspondance",help_apply_on_every_match:"Lorsque cette option est activ\xE9e, Ambience r\xE9applique les actions de cette sc\xE8ne chaque fois qu'elle l'emporte dans sa port\xE9e/cat\xE9gorie, et pas seulement la premi\xE8re fois qu'elle devient la sc\xE8ne active.",unit_minutes:"minutes",help:"Aide",open_documentation:"Ouvrir la documentation",read_documentation:"En savoir plus",help_switch_name:"Le nom utilis\xE9 pour les entit\xE9s interrupteur de pause par port\xE9e.",help_pause_for:"Lorsque l'interrupteur d'une port\xE9e est \xE9teint, reprendre automatiquement apr\xE8s ce nombre de minutes. 0 = reste en pause jusqu'\xE0 ce qu'il soit rallum\xE9.",help_reapply_toggle:"R\xE9-ex\xE9cuter les sc\xE8nes d'une port\xE9e/cat\xE9gorie apr\xE8s inactivit\xE9 et r\xE9appliquer la sc\xE8ne gagnante, au cas o\xF9 une action aurait pr\xE9c\xE9demment \xE9chou\xE9, comme une lumi\xE8re qui ne s'est pas \xE9teinte.",help_reapply_after:"R\xE9-ex\xE9cuter les sc\xE8nes qui n'ont pas \xE9t\xE9 mises \xE0 jour depuis ce nombre de minutes.",settings_expose_group:"Exposer aux assistants vocaux",settings_expose_assist:"Assist",settings_expose_google:"Google Assistant",settings_expose_alexa:"Alexa",help_expose:"Exposer les interrupteurs de pause par port\xE9e aux assistants vocaux s\xE9lectionn\xE9s pour pouvoir mettre Ambience en pause/reprendre par la voix. Google Assistant et Alexa n\xE9cessitent Home Assistant Cloud ou une configuration manuelle.",help_actions_tab:"Les actions sont les appels de service qu'une sc\xE8ne ex\xE9cute. D\xE9finissez-les ici pour que les sc\xE8nes puissent les r\xE9utiliser.",help_show_in_scene_editor:"Afficher ce champ dans l'\xE9diteur de sc\xE8ne pour que chaque sc\xE8ne puisse le d\xE9finir. Laissez d\xE9sactiv\xE9 pour envoyer une valeur par d\xE9faut fixe \xE0 la place.",help_set_default:"Une valeur envoy\xE9e automatiquement lorsque l'action s'ex\xE9cute. Les sc\xE8nes peuvent la remplacer si le champ est aussi affich\xE9 dans l'\xE9diteur.",help_conditions_tab:"Les conditions sont les entr\xE9es sur lesquelles les sc\xE8nes correspondent (moment de la journ\xE9e, pr\xE9sence, m\xE9t\xE9o, \u2026). Une sc\xE8ne l'emporte lorsque toutes ses conditions sont satisfaites.",help_categories_tab:"Les cat\xE9gories permettent \xE0 une port\xE9e d'avoir plusieurs gagnants ind\xE9pendants \xE0 la fois \u2014 une sc\xE8ne l'emporte par cat\xE9gorie.",no_areas:"Aucune zone trouv\xE9e dans Home Assistant.",not_configured:"non configur\xE9",scene_singular:"sc\xE8ne",scene_plural:"sc\xE8nes",all_categories:"Toutes les cat\xE9gories",add_category:"Ajouter une cat\xE9gorie\u2026",loading:"Chargement\u2026",any_placeholder:"(indiff\xE9rent)",include:"Inclure",exclude:"Exclure",empty_all_days:"(vide \u2192 tous les jours)",add_include_item:"+ Ajouter un \xE9l\xE9ment \xE0 inclure",add_exclude_item:"+ Ajouter un \xE9l\xE9ment \xE0 exclure",from:"de",to:"\xE0",remove:"Supprimer",day_of_month_placeholder:"ex. 1-10, 15",workday_sensor:"Capteur de jour ouvr\xE9",workday_calendar:"Calendrier de jours ouvr\xE9s",periods_heading:"P\xE9riodes",badge_builtin:"int\xE9gr\xE9",badge_custom:"personnalis\xE9",add_custom_period:"+ Ajouter une p\xE9riode personnalis\xE9e",lux_heading:"Plages de lux",add_custom_lux_range:"+ Ajouter une plage de lux personnalis\xE9e",lux_modal_add_title:"Ajouter une plage de lux personnalis\xE9e",lux_modal_edit_title:"Modifier \xAB {name} \xBB",lux_min_label:"Min (lx)",lux_max_label:"Max (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"est",occupancy_is_not:"n'est pas",lux_any:"L'un de",lux_all:"Tous parmi",lux_is:"est",lux_is_not:"n'est pas",title_edit:"Modifier",title_delete:"Supprimer",new_scene:"Nouvelle sc\xE8ne",new_scene_default:"Nouvelle sc\xE8ne",name_optional:"Nom (facultatif)",category:"Cat\xE9gorie",scope:"Port\xE9e",when_heading:"Quand",actions_heading:"Actions",target:"Cible",remove_action:"Supprimer l'action",add_action:"+ Ajouter une action\u2026",remove_condition:"Supprimer la condition",add_condition:"+ Ajouter une condition\u2026",add_description:"+ Ajouter une description",description:"Description",add_action_button:"Ajouter une action",cancel:"Annuler",save:"Enregistrer",save_scene:"Enregistrer la sc\xE8ne",at_least_one_target:"Au moins une cible est requise.",condition_error:"Corrigez l'erreur dans cette condition avant de continuer",no_scenes_yet:"Aucune sc\xE8ne pour l'instant.",add_scene:"+ Ajouter une sc\xE8ne",summary_any:"indiff\xE9rent",summary_any_paren:"(indiff\xE9rent)",summary_always:"Toujours",no_targets:"(aucune cible)",target_noun:"cible",action_singular:"action",action_plural:"actions",scene_n:"Sc\xE8ne {n}",drag_to_reorder:"Glisser pour r\xE9organiser",unpin:"D\xE9tacher (revenir \xE0 l'ordre automatique)",enable_scene:"Activer la sc\xE8ne",disable_scene:"D\xE9sactiver la sc\xE8ne",shadowed:"Ne se d\xE9clenche jamais \u2014 masqu\xE9e par une sc\xE8ne pr\xE9c\xE9dente.",problem_missing:"Manquante ou d\xE9sactiv\xE9e dans Home Assistant :",problem_overlap:"Contr\xF4l\xE9e par plusieurs groupes :",problem_config:"Probl\xE8mes de configuration :",problems_count:"{n} sc\xE8ne(s) pr\xE9sentent des probl\xE8mes",badge_needs_workday_sensor:"n\xE9cessite un capteur de jour ouvr\xE9",badge_needs_workday_calendar:"n\xE9cessite un calendrier de jours ouvr\xE9s",badge_needs_weather_entity:"n\xE9cessite une entit\xE9 m\xE9t\xE9o",badge_missing_weather_group:"groupe m\xE9t\xE9o {id} manquant",badge_missing_period:"p\xE9riode {id} manquante",badge_missing_lux_range:"plage de lux {id} manquante",badge_unexposed_action:"action {id} non expos\xE9e",edit:"Modifier",duplicate:"Dupliquer",run_actions:"Ex\xE9cuter les actions",run:"Ex\xE9cuter",auto_triggers_section:"D\xE9clencheurs automatiques",auto_triggers_none:"Aucun d\xE9clencheur automatique.",auto_triggers_opaque_note:"Une sc\xE8ne script est opaque \u2014 certaines surveillances peuvent manquer. D\xE9clarez-les dans le champ D\xE9clencheurs de la sc\xE8ne.",auto_trigger_group_time:"Heure",auto_trigger_group_sun:"Soleil",auto_trigger_group_domain:"Liste des personnes",auto_trigger_domain_membership:"{domains} ajout\xE9 ou supprim\xE9",auto_trigger_date_rollover:"Minuit local (changement de date)",auto_trigger_periodic:"re-v\xE9rification p\xE9riodique",more_actions:"Plus d'actions",scene_actions:"Actions de la sc\xE8ne",error_enter_name:"Veuillez saisir un nom.",error_start_letter:"Le nom doit commencer par une lettre.",error_name_exists:"Une entr\xE9e portant ce nom existe d\xE9j\xE0. Choisissez un autre nom.",period_modal_add_title:"Ajouter une p\xE9riode personnalis\xE9e",period_modal_edit_title:"Modifier \xAB {name} \xBB",name:"Nom",name_placeholder:"ex. D\xE9tente",lux_name_placeholder:"ex. Maussade",lux_error_need_bound:"Saisissez un min, un max, ou les deux.",lux_error_negative:"Les bornes doivent \xEAtre sup\xE9rieures ou \xE9gales \xE0 0.",lux_error_order:"Le min doit \xEAtre inf\xE9rieur au max.",lux_error_not_integer:"Les bornes doivent \xEAtre des nombres entiers.",from_label:"De",to_label:"\xC0",any_time:"N'importe quand",custom_range:"Plage personnalis\xE9e",custom_suffix:" (personnalis\xE9)",add_time_range:"+ ajouter une autre plage horaire",endpoint_time:"Heure",endpoint_sun:"Soleil",offset_placeholder:"D\xE9calage",clamp_none:"\u2014",clamp_not_before:"pas avant",clamp_not_after:"pas apr\xE8s",unit_hour:"heure",unit_hours:"heures",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"Aucune entit\xE9 correspondante dans cette zone.",field_kind:"Type",field_days_of_month:"Jours du mois",field_month:"Mois",field_day:"Jour",field_from_month:"Du mois",field_from_day:"Du jour",field_to_month:"Au mois",field_to_day:"Au jour",day_spec_error:"Utilisez les jours 1\u201331 et des plages comme 1-10, s\xE9par\xE9s par des virgules",title_override:"Remplacer",thresholds:"Seuils",add_threshold:"+ Ajouter un seuil",weather_entity:"Entit\xE9 m\xE9t\xE9o",groups:"Groupes",add_group:"+ Ajouter un groupe",sun:{elevation:"\xC9l\xE9vation",azimuth:"Azimut",any:"Indiff\xE9rent",above:"Au-dessus de",below:"En dessous de",between:"Entre",custom_range:"Plage personnalis\xE9e"},arguments:"Arguments",form:"Formulaire",script:"Script",yaml:"YAML",settings_tab_categories:"Cat\xE9gories",category_add:"+ Ajouter une cat\xE9gorie",category_name_placeholder:"Nom de la cat\xE9gorie",category_icon:"Ic\xF4ne",category_color:"Couleur",category_name_blank_error:"Les noms de cat\xE9gorie ne peuvent pas \xEAtre vides.",category_name_duplicate_error:"Deux cat\xE9gories ne peuvent pas avoir le m\xEAme nom.",category_delete_blocked_last:"Vous ne pouvez pas supprimer la derni\xE8re cat\xE9gorie.",category_delete_blocked_in_use:"Cette cat\xE9gorie contient encore des sc\xE8nes \u2014 d\xE9placez-les ou supprimez-les d'abord.",category_edit_title:"Modifier la cat\xE9gorie",category_add_title:"Ajouter une cat\xE9gorie",category_color_none:"Aucune couleur",category_save:"Enregistrer",view_traces:"Voir les traces",pause_scope:"Mettre cette port\xE9e en pause",resume_scope:"Reprendre maintenant",close:"Fermer",pick_service:"Choisir un service",retry:"R\xE9essayer",action_label_placeholder:"Libell\xE9 (facultatif)",action_no_parameters:"Cette action n'a aucun champ configurable.",actions_field_help_show:"Cochez une case pour rendre un champ modifiable par sc\xE8ne.",actions_field_help_default:"D\xE9finissez une valeur par d\xE9faut pour le pr\xE9remplir.",clear_default:"Effacer la valeur par d\xE9faut",set_default:"D\xE9finir la valeur par d\xE9faut",default_prefix:"Par d\xE9faut : ",editing:"Modification\u2026",show_in_scene_editor:"Afficher dans l'\xE9diteur de sc\xE8ne",extra_fields_prefix:"Champs suppl\xE9mentaires :",extra_fields_hint:"Ces champs ne sont pas expos\xE9s actuellement mais seront tout de m\xEAme envoy\xE9s.",service_has_no_fields:"Ce service n'a aucun champ.",service_unavailable:"Service non disponible dans cette instance HA.",action_unavailable:"Action non disponible ; configurez-la dans Param\xE8tres \u2192 Actions ou supprimez cette action.",raw_config_action:"Action",raw_config_targets:"Cibles",raw_config_params:"Param\xE8tres",occupancy_any:"L'un de",occupancy_all:"Tous parmi",occupancy_detected:"D\xE9tect\xE9",occupancy_clear:"Libre",occupancy_for:"pendant",day_pick_weekday:"Choisissez au moins un jour de la semaine.",state_sentinel:"\xC9tat",invalid_datetime:"Saisissez une date et une heure valides.",simulate_title:"Simuler",simulate_when_hint:"pilote le soleil, le moment de la journ\xE9e, le jour de la semaine et le jour ouvr\xE9",simulate_sun_resolved:"\u2192 {time}",simulate_sun_undefined:"pas de {anchor} \xE0 cette date",simulate_sun_unresolved:"Cette heure solaire ne peut pas \xEAtre r\xE9solue pour la date s\xE9lectionn\xE9e.",simulate_inputs_heading:"Entr\xE9es dont d\xE9pend cette cat\xE9gorie",simulate_button:"Simuler",reset_to_now:"R\xE9initialiser \xE0 maintenant",reset_to_live:"R\xE9initialiser au direct",true_label:"Vrai",false_label:"Faux",for_at_least:"au moins",for_less_than:"moins de",for_label:"Pendant",duration_held_hint:"Depuis combien de temps cet \xE9tat est maintenu (h:m:s)",away:"Absent",home:"\xC0 la maison",refresh:"Actualiser",new_traces_refresh:"Nouvelles traces \u2014 actualiser",clear_traces:"Effacer",download_diagnostics:"T\xE9l\xE9charger les diagnostics",no_traces_yet:"Aucune trace pour cette cat\xE9gorie pour l'instant.",yaml_expect_object:"Objet attendu",yaml_script_string:"`script` doit \xEAtre une cha\xEEne 'script.<name>'",yaml_args_object:"`args` doit \xEAtre un objet s'il est pr\xE9sent",yaml_triggers_list:"`triggers` doit \xEAtre une liste de cha\xEEnes entity_id s'il est pr\xE9sent",template_result:"R\xE9sultat",template_truthy:"true \u2014 correspond",template_falsy:"false \u2014 aucune correspondance",conditions_hint_body:"Configurez Jour ouvr\xE9 et M\xE9t\xE9o dans Conditions pour les utiliser dans les conditions de vos sc\xE8nes.",conditions_hint_body_weather:"Configurez M\xE9t\xE9o dans Conditions pour l'utiliser dans les conditions de vos sc\xE8nes.",conditions_hint_body_workday:"Configurez Jour ouvr\xE9 dans Conditions pour l'utiliser dans les conditions de vos sc\xE8nes.",conditions_hint_cta:"Configurer les conditions",conditions_hint_title:"Facultatif : configurer Jour ouvr\xE9 et M\xE9t\xE9o",conditions_hint_title_weather:"Facultatif : configurer M\xE9t\xE9o",conditions_hint_title_workday:"Facultatif : configurer Jour ouvr\xE9",dismiss:"Ignorer",fado_notice_title:"Recommand\xE9 : installer Fado Light Fader",fado_notice_body:"Fado ajoute un fondu de lumi\xE8re fluide pour la luminosit\xE9, la couleur et la temp\xE9rature de couleur \u2014 avec restauration automatique de la luminosit\xE9, autoconfiguration de l'interface et transitions natives. C'est une int\xE9gration HACS par d\xE9faut de Home Assistant.",fado_notice_cta:"Installer via HACS",for_prefix:"pendant",name_duplicate:"Une sc\xE8ne portant ce nom existe d\xE9j\xE0 dans cette cat\xE9gorie.",no_exposed_actions:"Ajoutez des services dans Param\xE8tres \u2192 Actions.",people_for:"pendant",people_is_at:"Est \xE0",people_is_at_static:"est \xE0",people_is_not_at:"N'est pas \xE0",people_mode_all:"Tous parmi :",people_mode_any:"L'un de :",people_mode_anybody:"N'importe qui",people_mode_everybody:"Tout le monde",people_mode_nobody:"Personne",people_mode_none:"Aucun parmi :",people_none_tracked:"Aucune personne suivie",people_select_one:"S\xE9lectionnez au moins une personne",unavailable_select_one:"S\xE9lectionnez au moins une entit\xE9",people_where_home:"\xC0 la maison",scope_house:"Maison",history_nothing_to_undo:"Rien \xE0 annuler",history_nothing_to_redo:"Rien \xE0 r\xE9tablir",history_undo_tooltip:"Annuler : {change}",history_redo_tooltip:"R\xE9tablir : {change}",history_untitled:"Sans titre",history_action_add:"Sc\xE8ne \xAB {scene} \xBB ajout\xE9e dans {scope}",history_action_edit:"Sc\xE8ne \xAB {scene} \xBB modifi\xE9e dans {scope}",history_action_delete:"Sc\xE8ne \xAB {scene} \xBB supprim\xE9e dans {scope}",history_action_reorder:"Sc\xE8nes r\xE9organis\xE9es dans {scope}",history_action_unpin:"Sc\xE8ne \xAB {scene} \xBB d\xE9tach\xE9e dans {scope}",history_action_toggle:"Sc\xE8ne \xAB {scene} \xBB bascul\xE9e dans {scope}",history_conflict_body:"Un autre onglet a modifi\xE9 les sc\xE8nes de cette port\xE9e pendant que vous \xE9ditiez.",history_conflict_overwrite:"\xC9craser les leurs",history_conflict_load:"Charger les leurs",script_triggers:"D\xE9clencheurs",script_triggers_help:"R\xE9\xE9valuer cette sc\xE8ne lorsque ces entit\xE9s changent. Un script est opaque, donc les r\xE9f\xE9rences par mod\xE8le peuvent \xEAtre manqu\xE9es \u2014 ajoutez celles dont il d\xE9pend.",script_triggers_none:"Aucun d\xE9clencheur",simulate:"Simuler",state_add_condition:"Ajouter une clause",state_add_first:"Ajouter une clause",state_add_value:"+ Ajouter un \xE9tat",state_attribute_placeholder:"laisser vide pour comparer l'\xE9tat",state_entity:"Entit\xE9",state_err_entity:"L'entit\xE9 est requise",state_err_incomplete:"Cette condition est incompl\xE8te",state_err_numeric:"La valeur doit \xEAtre un nombre",state_err_state:"L'\xE9tat est requis",state_err_value:"La valeur est requise",state_for:"Pendant (facultatif)",state_new_condition:"(nouvelle condition)",state_not_toggle:"N\xE9gation (NON)",state_op_header:"Comparaison",state_unwrap_group:"Supprimer ces parenth\xE8ses (remonter les enfants au parent)",state_value_label:"Valeur",state_where:"O\xF9",state_wrap:"Regrouper",state_wrap_group:"Entourer ces clauses de parenth\xE8ses",show_more_info:"Afficher plus d'infos",cause_has_time:"V\xE9rification p\xE9riodique de l'heure",cause_switch:"Interrupteur allum\xE9",cause_manual:"Application manuelle",cause_startup:"D\xE9marrage",cause_reloaded:"Recharg\xE9",cause_simulated:"Simulation",cause_clock:"Moment de la journ\xE9e",cause_sun:"Position du soleil",cause_reapply:"R\xE9-ex\xE9cution",cause_duration_for:"pendant",outcome_label_acted:"appliqu\xE9",outcome_label_no_op:"bloqu\xE9",outcome_label_debounced:"inchang\xE9",outcome_label_no_match:"aucune correspondance",outcome_label_skipped:"ignor\xE9",count_action_one:"{n} action",count_action_other:"{n} actions",count_entity_one:"{n} entit\xE9",count_entity_other:"{n} entit\xE9s",winner_default:"La sc\xE8ne correspondante",outcome_summary_acted_all_skipped:"{winner} a correspondu \u2014 {skipped_phrase} ignor\xE9e(s) (non expos\xE9e(s)) ; rien appliqu\xE9.",outcome_summary_acted_entities:"{winner} appliqu\xE9 \u2014 {acts} sur {entities}.{tail}",outcome_summary_acted:"{winner} appliqu\xE9 \u2014 {acts}.{tail}",outcome_summary_skipped_tail:" ({skipped} ignor\xE9e(s) \u2014 non expos\xE9e(s))",outcome_summary_no_op:"{winner} a correspondu mais n'a aucune action \u2014 elle emp\xEAche les sc\xE8nes inf\xE9rieures de s'appliquer. Rien n'a chang\xE9.",outcome_summary_debounced:"{winner} a correspondu, mais elle est d\xE9j\xE0 appliqu\xE9e \u2014 rien n'a \xE9t\xE9 renvoy\xE9.",outcome_summary_no_match:"Aucune sc\xE8ne n'a correspondu \u2014 rien appliqu\xE9.",outcome_summary_skipped_switch_off:"Ignor\xE9 \u2014 l'interrupteur de pause de la port\xE9e est \xE9teint.",outcome_summary_skipped_scope_disabled:"Ignor\xE9 \u2014 la port\xE9e est d\xE9sactiv\xE9e.",outcome_summary_skipped_unavailable:"Ignor\xE9 \u2014 l'entit\xE9 d\xE9clencheuse est devenue indisponible ; les appareils restent en l'\xE9tat.",section_scene_evaluation:"\xC9valuation des sc\xE8nes",section_actions_taken:"Actions effectu\xE9es",trigger_prefix:"D\xE9clencheur : ",trace_won_prefix:"Gagnante : ",skipped_not_exposed:" \u2014 ignor\xE9e (non expos\xE9e)",trace_scene_prefix:"Sc\xE8ne n\xBA",trace_scene_disabled:"d\xE9sactiv\xE9e",trace_scene_not_reached:"non atteinte",trace_scene_matched:"\u2713 correspond",trace_scene_no_match:"\u2717 aucune correspondance",scene_live:"En direct \u2014 cette sc\xE8ne correspond actuellement et est appliqu\xE9e",scene_applied_stale:"Toujours appliqu\xE9e \u2014 les actions de cette sc\xE8ne sont en vigueur mais elle ne correspond plus",version_update:{message:"Ambience {version} a \xE9t\xE9 install\xE9 \u2014 actualisez pour mettre \xE0 jour.",reload:"Actualiser"}},blocker_summary:{block:"Bloquer",block_mid:"bloque",until:"jusqu'\xE0",while:"tant que",while_lead:"Tant que",or:"ou",and:"et",always:"toujours"},day_summary:{any:"indiff\xE9rent",any_day:"tous les jours",except:"sauf",day_prefix:"jour",last_day:"dernier jour",workday:"jour ouvr\xE9",holiday:"jour f\xE9ri\xE9",first_workday:"premier jour ouvr\xE9",last_workday:"dernier jour ouvr\xE9"},month:{1:"Janvier",2:"F\xE9vrier",3:"Mars",4:"Avril",5:"Mai",6:"Juin",7:"Juillet",8:"Ao\xFBt",9:"Septembre",10:"Octobre",11:"Novembre",12:"D\xE9cembre"},weather_condition:{"clear-night":"D\xE9gag\xE9 (nuit)",cloudy:"Nuageux",fog:"Brouillard",hail:"Gr\xEAle",lightning:"Orage","lightning-rainy":"Orage pluvieux",partlycloudy:"Partiellement nuageux",pouring:"Pluie battante",rainy:"Pluvieux",snowy:"Neigeux","snowy-rainy":"Neige et pluie",sunny:"Ensoleill\xE9",windy:"Venteux","windy-variant":"Venteux (variante)",exceptional:"Exceptionnel"},weather_attr:{temperature:"Temp\xE9rature",apparent_temperature:"Temp\xE9rature ressentie",humidity:"Humidit\xE9",wind_speed:"Vitesse du vent",pressure:"Pression"},state_op:{is:"est",is_not:"n'est pas",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"ET",or:"OU",and_not:"ET NON",or_not:"OU NON",not:"NON"},trace_reason:{day_workday_sensor_unconfigured:"capteur de jour ouvr\xE9 non configur\xE9",day_workday_calendar_unconfigured:"calendrier des jours ouvr\xE9s non configur\xE9",lux_range_missing:"la plage de lux {range} n'existe plus",lux_sensor_not_numeric:"{name} ({value}) ne rapporte pas un nombre",period_missing:"la p\xE9riode de la journ\xE9e {period} n'existe plus",sun_not_configured:"l'int\xE9gration sun n'est pas configur\xE9e",sun_anchor_undefined:"{anchor} n'est pas d\xE9fini aujourd'hui \xE0 cet emplacement",weather_entity_unconfigured:"entit\xE9 m\xE9t\xE9o non configur\xE9e",weather_group_missing:"le groupe m\xE9t\xE9o {group} n'existe plus"}}};function vl(t){return t.toLowerCase().split(/[-_]/)[0]}function rs(t){let r=t.replace(/_/g,"-");return{code:r,base:vl(r)}}function yl(t){let r=t?.language,e=[];if(r){let{code:i,base:n}=rs(r);i in ft&&e.push(i),n!==i&&n in ft&&e.push(n)}return e.includes("en")||e.push("en"),e}var bl=new Set(["pt-BR"]);function ns(t){let r=t?.language;if(!r)return{available:!0,code:"",baseCode:""};let{code:e,base:i}=rs(r);return{available:e in ft||!bl.has(e)&&i in ft,code:e,baseCode:i}}function ss(t){if(!t)return t;try{let r=new Intl.DisplayNames([t],{type:"language"}).of(t);if(r&&r!==t)return r}catch{}try{let r=new Intl.DisplayNames(["en"],{type:"language"}).of(t);if(r&&r!==t)return r}catch{}return t}function is(t,r){return r?t.replace(/\{(\w+)\}/g,(e,i)=>i in r?r[i]:e):t}function wl(t,r){let e=t;for(let i of r){if(e===null||typeof e!="object")return;e=e[i]}return typeof e=="string"?e:void 0}function xl(t,r){let e="component.ambience.";if(!r.startsWith(e))return;let i=r.slice(e.length).split(".");for(let n of yl(t)){let s=ft[n];if(!s)continue;let o=wl(s,i);if(o!==void 0)return o}}function X(t,r,e,i){let n=i?Object.entries(i).flat():[],s=t?.localize?.(r,...n);if(s&&s!==r)return s;let o=xl(t,r);return is(o!==void 0?o:e,i)}function j(t){let r=t.replaceAll("_"," ").toLowerCase();return r.charAt(0).toUpperCase()+r.slice(1)}function jr(t){return j(t)}function Li(t){let r=t.indexOf("."),e=r===-1?"":t.slice(0,r),n=(r===-1?t:t.slice(r+1)).replaceAll("_"," ").trim().toLowerCase(),s=e.replaceAll("_"," ").trim().toLowerCase(),o=n?n.split(" "):[],d=s?s.split(" "):[],u=d.length>0&&d.every(h=>o.includes(h)),p=!s||u?n:`${n} ${s}`;return p.charAt(0).toUpperCase()+p.slice(1)}function gt(t,r,e){let i=r?.find(n=>n.id===t);return i?.label?.trim()?i.label:e()}function $l(t){return t.replace(/_/g," ").replace(/\bid\b/g,"ID").replace(/\bip\b/g,"IP").replace(/\bmac\b/g,"MAC").replace(/\bgps\b/g,"GPS").replace(/^\w/,r=>r.toUpperCase())}function Ti(t,r,e){let i=t?.formatEntityAttributeName;if(i&&r){let n=i(r,e);if(n)return n}return $l(e)}function Re(t,r,e,i){if(!r)return i;let n=t;if(e){let s=n?.formatEntityAttributeValue;if(s){let o=s(r,e,i);if(o)return o}}else{let s=n?.formatEntityState;if(s){let o=s(r,i);if(o)return o}}return i}function G(t,r){return X(t,`component.ambience.condition.${r}`,jr(r))}function Pi(t,r){return X(t,`component.ambience.action.${r}`,jr(r))}function re(t,r){return X(t,`component.ambience.anchor.${r}`,jr(r))}function pe(t,r,e){let i=e[r]?.label;return i||X(t,`component.ambience.time_of_day_period.${r}`,j(r))}function De(t,r,e){let i=e[r]?.label;return i||X(t,`component.ambience.lux_range.${r}`,j(r))}function os(t,r,e){return X(t,`component.ambience.category_color.${r}`,e)}function a(t,r,e,i){return X(t,`component.ambience.${r}`,e,i)}var kl=["mon","tue","wed","thu","fri","sat","sun"];function Ri(t,r){let e=kl[r];return X(t,`component.ambience.weekday.${e}`,e??String(r))}function Di(t,r){return X(t,`component.ambience.day_item.${r}`,j(r))}function vt(t,r){return X(t,`component.ambience.month.${r}`,String(r))}function yt(t,r){return X(t,`component.ambience.weather_condition.${r}`,j(r))}function qt(t,r){return X(t,`component.ambience.weather_attr.${r}`,j(r))}var Cl={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},Sl={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},El={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function zr(t,r,e){if(r==="humidity")return"%";let i=El[r];if(i){let o=e?.attributes?.[i];if(typeof o=="string"&&o)return o}let n=Sl[r],s=t?.config?.unit_system;return n&&s&&typeof s[n]=="string"?s[n]:Cl[r]??""}function S(t,r){let e=r,i=e?.translation_key;if(i){let n=e?.translation_placeholders??{},s=X(t,`component.ambience.exceptions.${i}`,"",n);if(s)return s}return e?.message?e.message:r instanceof Error?r.message:String(r)}function z(t,r){return X(t,`component.ambience.state_op.${r}`,r)}var Al=import.meta.url.slice(0,import.meta.url.lastIndexOf("/")+1);function as(t){return Al+t}function ls(t,r,e){let i=e.title??"Ambience",n=e.dark?`dark_${t}`:t,s=as(`${n}.png`),o=as(`${n}@2x.png`);return l`<img
    class=${r}
    src=${s}
    srcset="${s} 1x, ${o} 2x"
    alt=${i}
  />`}function ds(t={}){return ls("logo","ambience-logo",t)}function cs(t={}){return ls("icon","ambience-icon",t)}var us="ambience-filter-category",ps="ambience-expanded-scopes",hs="ambience-collapsed-categories",ms="ambience-conditions-hint-dismissed",_s="ambience-fado-notice-dismissed";function Hi(){try{return window.localStorage.getItem(us)??""}catch{return""}}function fs(t){try{window.localStorage.setItem(us,t)}catch{}}function qr(t){try{let r=window.localStorage.getItem(t);if(!r)return[];let e=JSON.parse(r);return Array.isArray(e)?e.filter(i=>typeof i=="string"):[]}catch{return[]}}function gs(){return qr(ps)}function vs(t){try{window.localStorage.setItem(ps,JSON.stringify(t))}catch{}}function ys(){return qr(hs)}function bs(t){try{window.localStorage.setItem(hs,JSON.stringify(t))}catch{}}function ws(t,r){if(!r)return!1;try{return window.localStorage.getItem(t)===r}catch{return!1}}function xs(t,r){if(r)try{window.localStorage.setItem(t,r)}catch{}}function $s(t){return ws(ms,t)}function ks(t){xs(ms,t)}function Cs(t){return ws(_s,t)}function Ss(t){xs(_s,t)}var Es="ambience-lang-request-dismissed";function As(){return qr(Es)}function Ls(t){return As().includes(t)}function Ts(t){try{let r=As();if(r.includes(t))return;window.localStorage.setItem(Es,JSON.stringify([...r,t]))}catch{}}async function Ps(t){return t.callWS({type:"ambience/areas/list"})}async function Ut(t,r){return t.callWS({type:"ambience/area/get",area_id:r})}function Ii(t){return{scenes:t.scenes??[]}}async function Ur(t,r,e,i,n){return t.callWS({type:"ambience/area/save",area_id:r,config:Ii(e),...i?{change:i}:{},...n?.minimisePins?{minimise_pins:!0}:{}})}async function Rs(t){return t.callWS({type:"ambience/floors/list"})}async function Wt(t,r){return t.callWS({type:"ambience/floor/get",floor_id:r})}async function Wr(t,r,e,i,n){return t.callWS({type:"ambience/floor/save",floor_id:r,config:Ii(e),...i?{change:i}:{},...n?.minimisePins?{minimise_pins:!0}:{}})}async function Vt(t){return t.callWS({type:"ambience/house/get"})}async function Vr(t,r,e,i){return t.callWS({type:"ambience/house/save",config:Ii(r),...e?{change:e}:{},...i?.minimisePins?{minimise_pins:!0}:{}})}async function Ni(t){return t.callWS({type:"ambience/conditions/list"})}async function Oi(t){return(await t.callWS({type:"ambience/install_id"})).install_id}async function Ds(t){return t.callWS({type:"ambience/frontend_version"})}async function Hs(t,r,e,i){let n={type:"ambience/auto_triggers/list",scope_kind:r};return e!=null&&(n.scope_id=e),i!=null&&(n.category=i),t.callWS(n)}async function Bt(t){return t.callWS({type:"ambience/exposed_actions/list"})}async function Is(t,r){return t.callWS({type:"ambience/exposed_actions/save",actions:r})}async function Ns(t){return t.callWS({type:"ambience/services/list"})}async function He(t,r){return t.callWS({type:"ambience/services/get_schema",service:r})}function Br(t){return t.kind==="area"?{area_id:t.id}:t.kind==="floor"?{floor_id:t.id}:{house:!0}}async function Os(t,r,e){let i={type:"ambience/apply",...Br(r)};return e!==void 0&&(i.category_id=e),t.callWS(i)}async function Ms(t,r,e){return t.callWS({type:"ambience/scene/run_actions",scene_index:e,...Br(r)})}async function Mi(t){return t.callWS({type:"ambience/time_of_day_periods/list"})}async function Fs(t,r,e){return t.callWS({type:"ambience/time_of_day_periods/save",custom:r,hidden:e})}async function Fi(t){return t.callWS({type:"ambience/lux_ranges/list"})}async function js(t,r,e){return t.callWS({type:"ambience/lux_ranges/save",custom:r,hidden:e})}async function Gt(t){return t.callWS({type:"ambience/conditions/day/config/list"})}async function zs(t,r,e){return t.callWS({type:"ambience/conditions/day/config/save",workday_sensor:r,workday_calendar:e})}async function Kt(t){return t.callWS({type:"ambience/conditions/weather/config/list"})}async function qs(t,r,e){return t.callWS({type:"ambience/conditions/weather/config/save",entity:r,groups:e})}async function Gr(t,r){return t.callWS({type:"ambience/state/known_states",entity_id:r})}async function Kr(t,r,e){return t.callWS({type:"ambience/state/known_attribute_values",entity_id:r,attribute:e})}async function Us(t){return t.callWS({type:"ambience/switch_defaults/list"})}async function Ws(t){return t.callWS({type:"ambience/switches/list"})}async function Vs(t,r,e){return t.callWS({type:"ambience/set_scope_enabled",...Br(r),enabled:e})}async function Bs(t,r,e){return t.callWS({type:"ambience/switch_defaults/save",name:r,auto_on_delay_seconds:e})}async function Gs(t){return t.callWS({type:"ambience/reapply/list"})}async function Ks(t,r,e){return t.callWS({type:"ambience/reapply/save",enabled:r,interval_seconds:e})}async function Ys(t){return t.callWS({type:"ambience/exposed_assistants/list"})}async function Qs(t,r,e,i){return t.callWS({type:"ambience/exposed_assistants/save",expose_assist:r,expose_google:e,expose_alexa:i})}async function Ce(t){return(await t.callWS({type:"ambience/categories/list"})).categories}async function ji(t,r){await t.callWS({type:"ambience/categories/save",categories:r})}async function Js(t,r){await t.callWS({type:"ambience/categories/delete",category_id:r})}async function Yr(t){return(await t.callWS({type:"ambience/traces/list"})).traces}async function Xs(t){await t.callWS({type:"ambience/traces/clear"})}async function Zs(t,r){let e=t.connection;if(!e.subscribeMessage)return()=>{};try{return await e.subscribeMessage(r,{type:"ambience/live/subscribe"})}catch{return()=>{}}}async function eo(t,r){let e=t.connection;if(!e.subscribeMessage)return()=>{};try{return await e.subscribeMessage(r,{type:"ambience/history/subscribe"})}catch{return()=>{}}}async function to(t){return t.callWS({type:"ambience/history/undo"})}async function io(t){return t.callWS({type:"ambience/history/redo"})}function ro(t,r){let e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),i=URL.createObjectURL(e),n=document.createElement("a");n.href=i,n.download=r,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(i),1e4)}function Ll(t){return t.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}async function no(t,r,e,i){let n=await t.callWS({type:"ambience/diagnostics/scope",scope_kind:r.scope_kind,scope_id:r.scope_id,category:e}),s=Ll(i??"")||e;ro(n,`ambience-${r.scope_kind}-${r.scope_id??"house"}-${s}.json`)}async function Tl(t){return t.callWS({type:"ambience/ai_bundle"})}async function so(t){ro(await Tl(t),"ambience-ai-bundle.json")}async function oo(t,r){await t.callWS({type:"ambience/validate",config:Ii(r)})}async function ao(t,r){return r.kind==="area"?Ut(t,r.id):r.kind==="floor"?Wt(t,r.id):Vt(t)}async function lo(t,r,e,i,n){return r.kind==="area"?Ur(t,r.id,e,i,n):r.kind==="floor"?Wr(t,r.id,e,i,n):Vr(t,e,i,n)}async function co(t,r,e){return t.callWS({type:"ambience/simulate/inputs",scope_kind:r.scope_kind,scope_id:r.scope_id,category:e})}async function uo(t,r){return(await t.callWS({type:"ambience/simulate/sun_anchors",date:r})).anchors}async function po(t,r,e,i,n,s,o){return t.callWS({type:"ambience/simulate",scope_kind:r.scope_kind,scope_id:r.scope_id,category:e,now:i,overrides:n,verdicts:s,prev_applied:o})}var Qr=[{id:"red",label:"Red",hex:"#f44336"},{id:"pink",label:"Pink",hex:"#e91e63"},{id:"purple",label:"Purple",hex:"#9c27b0"},{id:"deep-purple",label:"Deep purple",hex:"#673ab7"},{id:"indigo",label:"Indigo",hex:"#3f51b5"},{id:"blue",label:"Blue",hex:"#2196f3"},{id:"light-blue",label:"Light blue",hex:"#03a9f4"},{id:"cyan",label:"Cyan",hex:"#00bcd4"},{id:"teal",label:"Teal",hex:"#009688"},{id:"green",label:"Green",hex:"#4caf50"},{id:"light-green",label:"Light green",hex:"#8bc34a"},{id:"lime",label:"Lime",hex:"#cddc39"},{id:"yellow",label:"Yellow",hex:"#ffeb3b"},{id:"amber",label:"Amber",hex:"#ffc107"},{id:"orange",label:"Orange",hex:"#ff9800"},{id:"deep-orange",label:"Deep orange",hex:"#ff5722"},{id:"brown",label:"Brown",hex:"#795548"},{id:"grey",label:"Grey",hex:"#9e9e9e"},{id:"blue-grey",label:"Blue grey",hex:"#607d8b"}];function Jr(t){if(t)return Qr.find(r=>r.id===t)?.hex}function Pl(t){let r=t.replace("#",""),e=parseInt(r.slice(0,2),16)/255,i=parseInt(r.slice(2,4),16)/255,n=parseInt(r.slice(4,6),16)/255,s=d=>d<=.03928?d/12.92:((d+.055)/1.055)**2.4;return .2126*s(e)+.7152*s(i)+.0722*s(n)>.5?"#000000":"#ffffff"}function zi(t){let r=Jr(t);return r?`background:${r};color:${Pl(r)}`:""}var qi=y`
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
`;function bt(t,r){return l`<span class="category-swatch" style=${zi(t)}>
    ${r?l`<ha-icon icon=${r}></ha-icon>`:""}
  </span>`}var he=class extends b{constructor(){super(...arguments);this._categories=[];this._sortedCategories=[];this._filterCategory=Hi();this._open=!1;this._loaded=!1;this._onCategoriesChanged=async()=>{try{await this._fetchCategories()}catch{}};this._onDocClick=e=>{this._open&&!e.composedPath().includes(this)&&(this._open=!1)}}async _fetchCategories(){let e=await Ce(this.hass);this.isConnected&&(this._categories=e,this._filterCategory&&!e.some(i=>i.id===this._filterCategory)&&this._select(""))}async connectedCallback(){super.connectedCallback(),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("click",this._onDocClick);try{await this._fetchCategories()}catch{}finally{this.isConnected&&(this._loaded=!0)}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("click",this._onDocClick)}willUpdate(e){e.has("_categories")&&(this._sortedCategories=[...this._categories].sort((i,n)=>i.name.localeCompare(n.name)))}_select(e){this._filterCategory=e,fs(e),this._open=!1,this.dispatchEvent(new CustomEvent("ambience-filter-changed",{detail:{category:e},bubbles:!0,composed:!0}))}_openSettings(){this._open=!1,this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:"categories"},bubbles:!0,composed:!0}))}_renderEntry(e){return e===null?l`
        ${bt(void 0,"mdi:filter-variant")}
        <span class="category-name"
          >${a(this.hass,"ui.all_categories","All categories")}</span
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
          >${a(this.hass,"ui.add_category","Add category\u2026")}</span
        >
      </button>
    `}render(){if(!this._loaded)return l``;if(this._categories.length<=1)return this._renderAddCategory(!1);let e=this._sortedCategories,i=this._categories.find(n=>n.id===this._filterCategory)??null;return l`
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
                  ${e.map(n=>l`<button
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
    `}};he.styles=[qi,y`
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
    `],c([m({attribute:!1})],he.prototype,"hass",2),c([f()],he.prototype,"_categories",2),c([f()],he.prototype,"_filterCategory",2),c([f()],he.prototype,"_open",2),c([f()],he.prototype,"_loaded",2),he=c([w("ambience-category-filter")],he);var Se={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ui=t=>(...r)=>({_$litDirective$:t,values:r}),wt=class{constructor(r){}get _$AU(){return this._$AM._$AU}_$AT(r,e,i){this._$Ct=r,this._$AM=e,this._$Ci=i}_$AS(r,e){return this.update(r,e)}update(r,e){return this.render(...e)}};var{I:Rl}=Zn,ho=t=>t;var _o=t=>t.strings===void 0,mo=()=>document.createComment(""),xt=(t,r,e)=>{let i=t._$AA.parentNode,n=r===void 0?t._$AB:r._$AA;if(e===void 0){let s=i.insertBefore(mo(),n),o=i.insertBefore(mo(),n);e=new Rl(s,o,t,t.options)}else{let s=e._$AB.nextSibling,o=e._$AM,d=o!==t;if(d){let u;e._$AQ?.(t),e._$AM=t,e._$AP!==void 0&&(u=t._$AU)!==o._$AU&&e._$AP(u)}if(s!==n||d){let u=e._$AA;for(;u!==s;){let p=ho(u).nextSibling;ho(i).insertBefore(u,n),u=p}}}return e},Ie=(t,r,e=t)=>(t._$AI(r,e),t),Dl={},Wi=(t,r=Dl)=>t._$AH=r,fo=t=>t._$AH,Vi=t=>{t._$AR(),t._$AA.remove()};var go=(t,r,e)=>{let i=new Map;for(let n=r;n<=e;n++)i.set(t[n],n);return i},vo=Ui(class extends wt{constructor(t){if(super(t),t.type!==Se.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,r,e){let i;e===void 0?e=r:r!==void 0&&(i=r);let n=[],s=[],o=0;for(let d of t)n[o]=i?i(d,o):o,s[o]=e(d,o),o++;return{values:s,keys:n}}render(t,r,e){return this.dt(t,r,e).values}update(t,[r,e,i]){let n=fo(t),{values:s,keys:o}=this.dt(r,e,i);if(!Array.isArray(n))return this.ut=o,s;let d=this.ut??=[],u=[],p,h,_=0,g=n.length-1,v=0,x=s.length-1;for(;_<=g&&v<=x;)if(n[_]===null)_++;else if(n[g]===null)g--;else if(d[_]===o[v])u[v]=Ie(n[_],s[v]),_++,v++;else if(d[g]===o[x])u[x]=Ie(n[g],s[x]),g--,x--;else if(d[_]===o[x])u[x]=Ie(n[_],s[x]),xt(t,u[x+1],n[_]),_++,x--;else if(d[g]===o[v])u[v]=Ie(n[g],s[v]),xt(t,n[_],n[g]),g--,v++;else if(p===void 0&&(p=go(o,v,x),h=go(d,_,g)),p.has(d[_]))if(p.has(d[g])){let C=h.get(o[v]),P=C!==void 0?n[C]:null;if(P===null){let Q=xt(t,n[_]);Ie(Q,s[v]),u[v]=Q}else u[v]=Ie(P,s[v]),xt(t,n[_],P),n[C]=null;v++}else Vi(n[g]),g--;else Vi(n[_]),_++;for(;v<=x;){let C=xt(t,u[x+1]);Ie(C,s[v]),u[v++]=C}for(;_<=g;){let C=n[_++];C!==null&&Vi(C)}return this.ut=o,Wi(t,u),J}});function Bi(t,r){let e=t.entities?.[r];return e?e.area_id!=null?e.area_id:e.device_id?t.devices?.[e.device_id]?.area_id??null:null:null}function D(t){return t.kind==="house"?"house":`${t.kind}:${t.id}`}function Gi(t,r){return r==null?{kind:"house"}:{kind:t,id:r}}function yo(t,r){return`${D(t)}\0${r}`}function Ee(t,r){return yo(t,r)}function Ki(t,r){return yo(t,r)}function bo(t,r){if(!r||r.entity==null)return[...t];let e=Array.isArray(r.entity)?r.entity:[r.entity];if(e.length===0)return[...t];let i=new Set,n=!1;for(let s of e){if(!s||typeof s!="object")continue;let o=s.domain;if(o==null){n=!0;continue}if(Array.isArray(o))for(let d of o)typeof d=="string"&&i.add(d);else typeof o=="string"&&i.add(o)}return n||i.size===0?[...t]:t.filter(s=>{let o=s.indexOf(".");return o<0?!1:i.has(s.slice(0,o))})}function Yi(t,r,e=[]){let i=t;if(!i?.entities)return[];let n=i.entities,s=i.areas??{},o=r.kind==="area"?new Set([r.id]):r.kind==="floor"?new Set(Object.values(s).filter(u=>u.floor_id===r.id).map(u=>u.area_id)):null,d=u=>{let p=Bi(i,u.entity_id);return p==null?!1:o===null?!0:o.has(p)};return Object.values(n).filter(d).filter(u=>u.platform!=="ambience").filter(u=>e.length===0||e.includes(u.entity_id.split(".")[0])).map(u=>u.entity_id).sort()}var Xr=Ui(class extends wt{constructor(t){if(super(t),t.type!==Se.PROPERTY&&t.type!==Se.ATTRIBUTE&&t.type!==Se.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!_o(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[r]){if(r===J||r===$)return r;let e=t.element,i=t.name;if(t.type===Se.PROPERTY){if(r===e[i])return J}else if(t.type===Se.BOOLEAN_ATTRIBUTE){if(!!r===e.hasAttribute(i))return J}else if(t.type===Se.ATTRIBUTE&&e.getAttribute(i)===r+"")return J;return Wi(t),r}});function $t(t){let{checked:r,dataTest:e,onChange:i,className:n,onClick:s,disabled:o}=t;return customElements.get("ha-switch")?l`<ha-switch
      class=${n??$}
      data-test=${e}
      ?disabled=${o??!1}
      .checked=${Xr(r)}
      @click=${s}
      @change=${i}
    ></ha-switch>`:l`<input
    class=${n??$}
    data-test=${e}
    type="checkbox"
    ?disabled=${o??!1}
    .checked=${Xr(r)}
    @click=${s}
    @change=${i}
  />`}function Yt(t){let{priority:r,pinned:e,shadowed_by:i,...n}=t;return n}function wo(t,r){if(r<0||r>=t.length)return[];let e=new Set(t[r].entity_ids??[]),i=new Set;return t.forEach((n,s)=>{if(s!==r)for(let o of n.entity_ids??[])e.has(o)||i.add(o)}),[...i]}var Zr={house:"mdi:home",floor:"mdi:layers",area:"mdi:texture-box"};function Qt(t,r){return t.kind==="house"?Zr.house:t.kind==="floor"?r?.floors?.[t.id]?.icon||Zr.floor:r?.areas?.[t.id]?.icon||Zr.area}var xo=y`
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
    </button>`:$}render(){return l`
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
            ><ha-icon icon="mdi:close"></ha-icon></button>`:$}
      </div>
    `}};le.styles=[xo,y`
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
    `],c([m()],le.prototype,"icon",2),c([m()],le.prototype,"ctaLabel",2),c([m()],le.prototype,"ctaHref",2),c([m()],le.prototype,"dismissLabel",2),c([m({type:Boolean})],le.prototype,"hint",2),c([m({type:Boolean})],le.prototype,"dismissible",2),le=c([w("ambience-banner")],le);var en="https://github.com/clintongormley/ambience";function $o(t,r){let e=new URLSearchParams({labels:"translation",title:`Translation request: ${r} (${t})`,body:[`I'd like Ambience to be translated into: **${r}** (\`${t}\`).`,"","- [ ] I'm happy to review the translations"].join(`
`)});return`${en}/issues/new?${e.toString()}`}var Hl="Ambience",nt=class extends b{constructor(){super(...arguments);this._visible=!1;this._href="";this._message="";this._actionLabel="";this._dismissLabel="";this._code="";this._dismissedCodes=new Set}willUpdate(e){if(!e.has("hass"))return;let i=ns(this.hass);if(i.available||this._dismissedCodes.has(i.code)||Ls(i.code)){this._visible=!1;return}this._code=i.code;let n=ss(i.code);this._href=$o(i.code,n),this._message=this._buildMessage(n),this._actionLabel=a(this.hass,"ui.language_request.action","Request a translation \u2192"),this._dismissLabel=a(this.hass,"ui.language_request.dismiss","Dismiss"),this._visible=!0}_dismiss(){this._dismissedCodes.add(this._code),Ts(this._code),this._visible=!1}_buildMessage(e){let n=a(this.hass,"ui.language_request.message","Your Home Assistant language is {language}, but {product} isn't translated into it yet.").split(/\{(language|product)\}/).map((s,o)=>o%2===0?s:l`<strong>${s==="language"?e:Hl}</strong>`);return l`<span class="message">${n}</span>`}render(){return this._visible?l`
      <ambience-banner
        data-test="language-banner"
        icon="mdi:translate"
        hint
        .ctaLabel=${this._actionLabel}
        .ctaHref=${this._href}
        .dismissLabel=${this._dismissLabel}
        @banner-dismiss=${this._dismiss}
      >${this._message}</ambience-banner>
    `:$}};nt.styles=y`
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
  `,c([m({attribute:!1})],nt.prototype,"hass",2),c([f()],nt.prototype,"_visible",2),nt=c([w("ambience-language-banner")],nt);function Qi(t){if(t.enabled===!1)return{severity:null,missing:[],overlap:[],shadowed:!1,configIssues:[]};let r=t.missing_entities??[],e=t.overlap_entities??[],i=t.config_issues??[],n=t.shadowed_by!=null;return{severity:r.length>0||i.length>0?"error":e.length>0||n?"warning":null,missing:r,overlap:e,shadowed:n,configIssues:i}}function ko(t){let r=null;for(let e of t){let i=Qi(e).severity;if(i==="error")return"error";i==="warning"&&(r="warning")}return r}function Co(t){return t.filter(r=>Qi(r).severity!=null).length}var Il={missing_workday_sensor:["ui.badge_needs_workday_sensor","needs a workday sensor"],missing_workday_calendar:["ui.badge_needs_workday_calendar","needs a workday calendar"],missing_weather_entity:["ui.badge_needs_weather_entity","needs a weather entity"],missing_weather_group:["ui.badge_missing_weather_group","missing weather group {id}"],missing_period:["ui.badge_missing_period","missing period {id}"],missing_lux_range:["ui.badge_missing_lux_range","missing lux range {id}"],unexposed_action:["ui.badge_unexposed_action","action {id} not exposed"]};function So(t,r){let e=Il[r.kind];return(e?a(t,e[0],e[1]):r.kind).replace("{id}",r.ref)}var kt=null;function Ji(t,r){let e=ko(r);if(!e)return"";let i=Co(r),n=a(t,"ui.problems_count","{n} scene(s) have problems").replace("{n}",String(i));return l`<ambience-problem-flag
    .severity=${e}
    .details=${[n]}
    .summary=${n}
  ></ambience-problem-flag>`}var Ae=class extends b{constructor(){super(...arguments);this.severity="warning";this.details=[];this.summary="";this._open=!1;this._onDocClick=e=>{this._open&&!e.composedPath().includes(this)&&this._setOpen(!1)}}disconnectedCallback(){this._open&&this._setOpen(!1),super.disconnectedCallback()}_setOpen(e){e?(kt&&kt!==this&&kt._setOpen(!1),kt=this,document.addEventListener("click",this._onDocClick,!0)):(kt===this&&(kt=null),document.removeEventListener("click",this._onDocClick,!0)),this._open=e}_toggle(e){e.stopPropagation(),this._setOpen(!this._open)}render(){return l`
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
  `,c([m()],Ae.prototype,"severity",2),c([m({attribute:!1})],Ae.prototype,"details",2),c([m()],Ae.prototype,"summary",2),c([f()],Ae.prototype,"_open",2),Ae=c([w("ambience-problem-flag")],Ae);function de(t){return t.enabled===!1?{scenes:t.scenes??[],enabled:!1}:{scenes:t.scenes??[]}}function H(){return(t,r)=>{let e=Symbol(String(r));Object.defineProperty(t,r,{get(){return this[e]},set(i){Object.is(this[e],i)||(this[e]=i,this._host?.requestUpdate())},configurable:!0,enumerable:!0})}}var R=class{constructor(r){this._host=r;this.areas=[];this.floors=[];this.areaConfigs=new Map;this.floorConfigs=new Map;this.house={scenes:[]};this.switchEntityIds=new Map;this.live=new Map;this.areasLoaded=!1;this.conditions=[];this.actions=[];this.categories=[];this.schemas={};this.installId=null;this.staticLoaded=!1;this.error="";this.canUndo=!1;this.canRedo=!1;this.undoAction=null;this.redoAction=null;this.staleScopes=[];this._onExposedActionsChanged=async()=>{try{let r=await Bt(this._hass);if(!this._host.isConnected)return;this.actions=r,await this._refreshSchemas(r),await this.reloadConfigs()}catch{}};this._onConfigImported=async()=>{try{await this.reloadConfigs()}catch{}};this._onCategoriesChanged=async()=>{try{let r=await Ce(this._hass);if(!this._host.isConnected)return;this.categories=r}catch{}};this._onConditionsChanged=async()=>{try{let[r,e]=await Promise.all([Gt(this._hass),Kt(this._hass)]);if(!this._host.isConnected)return;this.dayConfig=r,this.weatherConfig=e}catch{}};r.addController(this)}get _hass(){return this._host.hass}hostConnected(){window.addEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("ambience-conditions-changed",this._onConditionsChanged),window.addEventListener("ambience-config-imported",this._onConfigImported),this._tick=setInterval(()=>{for(let r of this.switchEntityIds.values())if(this._hass.states?.[r]?.state==="off"){this._host.requestUpdate();return}},1e3)}hostDisconnected(){window.removeEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("ambience-conditions-changed",this._onConditionsChanged),window.removeEventListener("ambience-config-imported",this._onConfigImported),this._tick&&clearInterval(this._tick),this._tick=void 0,this._unsubArea?.(),this._unsubArea=void 0,this._unsubFloor?.(),this._unsubFloor=void 0,this._unsubEntity?.(),this._unsubEntity=void 0,this._unsubLive?.(),this._unsubLive=void 0,this._unsubHistory?.(),this._unsubHistory=void 0}async subscribe(r,e){this._isScopeLocked=e;let i=this._hass.connection.subscribeEvents(v=>{v.data.action==="remove"&&r({kind:"area",id:v.data.area_id}),this.refreshAreas(),v.data.action!=="update"&&this.refreshSwitches()},"area_registry_updated"),n=this._hass.connection.subscribeEvents(v=>{v.data.action==="remove"&&r({kind:"floor",id:v.data.floor_id}),this.refreshFloors(),v.data.action!=="update"&&this.refreshSwitches()},"floor_registry_updated"),s=this._hass.connection.subscribeEvents(v=>{v.data.action!=="update"&&v.data.entity_id.startsWith("switch.")&&this.refreshSwitches()},"entity_registry_updated"),o=Zs(this._hass,v=>this._onLive(v)),d=eo(this._hass,v=>this._onHistory(v)),[u,p,h,_,g]=await Promise.all([i,n,s,o,d]);this._host.isConnected?(this._unsubArea=u,this._unsubFloor=p,this._unsubEntity=h,this._unsubLive=_,this._unsubHistory=g):(u(),p(),h(),_(),g())}_onLive(r){let e=(i,n)=>{let s=Ee(Gi(n.scope_kind,n.scope_id),n.category);i.set(s,{matched:n.matched,applied:n.applied})};if(r.type==="snapshot"){let i=new Map;for(let n of r.units)e(i,n);this.live=i}else{let i=new Map(this.live);e(i,r),this.live=i}}async loadStatic(){try{let[r,e,i,n,s,o,d,u]=await Promise.all([Ni(this._hass),Bt(this._hass),Mi(this._hass),Fi(this._hass),Gt(this._hass),Kt(this._hass),Ce(this._hass),Oi(this._hass)]);if(!this._host.isConnected)return;this.installId=u,this.conditions=r,this.actions=e,this.periods=i,this.luxRanges=n,this.dayConfig=s,this.weatherConfig=o,this.categories=d,this.staticLoaded=!0,await this._refreshSchemas(e)}catch(r){this.error=S(this._hass,r)}}async _refreshSchemas(r){let e=await Promise.all(r.map(async n=>{try{let s=await He(this._hass,n.id);return[n.id,s]}catch{return[n.id,null]}}));if(!this._host.isConnected)return;let i={};for(let[n,s]of e)s&&(i[n]=s);this.schemas=i}async refreshAreas(){try{let r=await Ps(this._hass),e=this.areaConfigs,i=new Map;if(await Promise.all(r.map(async n=>{let s=e.get(n.area_id);if(s){i.set(n.area_id,s);return}i.set(n.area_id,de(await Ut(this._hass,n.area_id)))})),!this._host.isConnected)return;this.areas=r,this.areaConfigs=i}catch(r){this.error=S(this._hass,r)}finally{this._host.isConnected&&(this.areasLoaded=!0)}}async refreshFloors(){try{let r=(await Rs(this._hass)).slice().sort((n,s)=>n.name.localeCompare(s.name)),e=this.floorConfigs,i=new Map;if(await Promise.all(r.map(async n=>{let s=e.get(n.floor_id);if(s){i.set(n.floor_id,s);return}i.set(n.floor_id,de(await Wt(this._hass,n.floor_id)))})),!this._host.isConnected)return;this.floors=r,this.floorConfigs=i}catch(r){this.error=S(this._hass,r)}}async refreshHouse(){try{let r=de(await Vt(this._hass));if(!this._host.isConnected)return;this.house=r}catch(r){this.error=S(this._hass,r)}}async reloadConfigs(){let[r,e,i]=await Promise.all([Promise.all(this.areas.map(async n=>[n.area_id,de(await Ut(this._hass,n.area_id))])),Promise.all(this.floors.map(async n=>[n.floor_id,de(await Wt(this._hass,n.floor_id))])),Vt(this._hass)]);this._host.isConnected&&(this.areaConfigs=new Map(r),this.floorConfigs=new Map(e),this.house=de(i))}async refreshSwitches(){try{let r=await Ws(this._hass);if(!this._host.isConnected)return;this.switchEntityIds=new Map(r.map(e=>{let i=e.scope_kind==="house"?{kind:"house"}:{kind:e.scope_kind,id:e.scope_id};return[D(i),e.entity_id]}))}catch(r){this.error=S(this._hass,r)}}getConfig(r){return r.kind==="house"?this.house:r.kind==="area"?this.areaConfigs.get(r.id):this.floorConfigs.get(r.id)}setConfig(r,e){if(r.kind==="house")this.house=e;else if(r.kind==="area"){let i=new Map(this.areaConfigs);i.set(r.id,e),this.areaConfigs=i}else{let i=new Map(this.floorConfigs);i.set(r.id,e),this.floorConfigs=i}}async mutate(r,e,i){let n=this.getConfig(r);this.setConfig(r,e),this.error="";try{let s;return r.kind==="house"?s=await Vr(this._hass,e,i):r.kind==="area"?s=await Ur(this._hass,r.id,e,i):s=await Wr(this._hass,r.id,e,i),this.setConfig(r,de(s.config)),!0}catch(s){return n&&this.setConfig(r,n),this.error=S(this._hass,s),!1}}async reloadScope(r){try{let e;if(r.kind==="house"?e=de(await Vt(this._hass)):r.kind==="area"?e=de(await Ut(this._hass,r.id)):e=de(await Wt(this._hass,r.id)),!this._host.isConnected)return;this.setConfig(r,e)}catch(e){this.error=S(this._hass,e)}}_applyHistoryResult(r){!r.ok||!r.config||r.scope_kind===void 0||this.setConfig(Gi(r.scope_kind,r.scope_id??null),de(r.config))}async undo(){this.error="";try{this._applyHistoryResult(await to(this._hass))}catch(r){this.error=S(this._hass,r)}}async redo(){this.error="";try{this._applyHistoryResult(await io(this._hass))}catch(r){this.error=S(this._hass,r)}}_onHistory(r){if(this.canUndo=r.can_undo,this.canRedo=r.can_redo,this.undoAction=r.undo,this.redoAction=r.redo,!r.changed_scope)return;let e=Gi(r.changed_scope.scope_kind,r.changed_scope.scope_id);if(r.is_self){this.clearStale(e);return}this._isScopeLocked?.(e)?this._markStale(e):this.reloadScope(e)}isScopeStale(r){let e=D(r);return this.staleScopes.some(i=>D(i)===e)}_markStale(r){this.isScopeStale(r)||(this.staleScopes=[...this.staleScopes,r])}clearStale(r){if(!this.isScopeStale(r))return;let e=D(r);this.staleScopes=this.staleScopes.filter(i=>D(i)!==e)}async refreshStaleScope(r){this.clearStale(r),await this.reloadScope(r)}};c([H()],R.prototype,"areas",2),c([H()],R.prototype,"floors",2),c([H()],R.prototype,"areaConfigs",2),c([H()],R.prototype,"floorConfigs",2),c([H()],R.prototype,"house",2),c([H()],R.prototype,"switchEntityIds",2),c([H()],R.prototype,"live",2),c([H()],R.prototype,"areasLoaded",2),c([H()],R.prototype,"conditions",2),c([H()],R.prototype,"actions",2),c([H()],R.prototype,"categories",2),c([H()],R.prototype,"schemas",2),c([H()],R.prototype,"periods",2),c([H()],R.prototype,"luxRanges",2),c([H()],R.prototype,"dayConfig",2),c([H()],R.prototype,"weatherConfig",2),c([H()],R.prototype,"installId",2),c([H()],R.prototype,"staticLoaded",2),c([H()],R.prototype,"error",2),c([H()],R.prototype,"canUndo",2),c([H()],R.prototype,"canRedo",2),c([H()],R.prototype,"undoAction",2),c([H()],R.prototype,"redoAction",2),c([H()],R.prototype,"staleScopes",2);var Eo="https://clintongormley.github.io/ambience";function Ct(t){let r=t.replace(/^\/+|\/+$/g,"");return r?`${Eo}/${r}/`:`${Eo}/`}var Nl={day:"day",state:"entity-state",lux:"lux",occupancy:"occupancy",people:"people",script:"script",sun:"sun",template:"template",time_of_day:"time-of-day",unavailable:"unavailable",weather:"weather"};function Xi(t){let r=Nl[t];return r?`reference/conditions/${r}`:void 0}var Ao=l`<svg viewBox="0 0 24 24" aria-hidden="true">
  <path
    d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"
  ></path>
</svg>`,ce=class extends b{constructor(){super(...arguments);this.text="";this.multiline=!1;this.docPath="";this._open=!1;this._popStyle="";this._onDocClick=e=>{e.composedPath().includes(this)||this._close()};this._onKeydown=e=>{e.key==="Escape"&&this._close()};this._onViewportChange=()=>this._close()}_toggle(e){e.stopPropagation(),this._open?this._close():this._openPopover()}_positionPopover(){let e=this.renderRoot.querySelector(".trigger");if(!e)return;let i=e.getBoundingClientRect(),n=260,s=window.innerWidth||1024,o=window.innerHeight||768,d=Math.max(8,Math.min(i.left,s-n-8)),u=o-i.bottom,p=i.top,h=u<220&&p>u;this._popStyle=h?`top:${Math.round(i.top-6)}px;left:${Math.round(d)}px;transform:translateY(-100%);`:`top:${Math.round(i.bottom+6)}px;left:${Math.round(d)}px;`}_openPopover(){this._positionPopover(),this._open=!0,this._bindGlobals(!0)}_close(){this._open&&(this._open=!1,this._bindGlobals(!1),this.renderRoot.querySelector(".trigger")?.focus())}disconnectedCallback(){super.disconnectedCallback(),this._bindGlobals(!1)}_bindGlobals(e){e?(document.addEventListener("click",this._onDocClick,!0),document.addEventListener("keydown",this._onKeydown),window.addEventListener("scroll",this._onViewportChange,{capture:!0,passive:!0}),window.addEventListener("resize",this._onViewportChange)):(document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown),window.removeEventListener("scroll",this._onViewportChange,{capture:!0}),window.removeEventListener("resize",this._onViewportChange))}render(){if(!this.text&&!this.docPath)return $;if(!this.text){let i=a(this.hass,"ui.open_documentation","Open documentation");return l`
        <a
          class="trigger"
          data-test="help-doc-link"
          href=${Ct(this.docPath)}
          target="_blank"
          rel="noopener noreferrer"
          title=${i}
          aria-label=${i}
          @click=${n=>n.stopPropagation()}
        >${Ao}</a>
      `}let e=this.docPath?l`<a
          class="doc-link"
          data-test="help-doc-link"
          href=${Ct(this.docPath)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label=${a(this.hass,"ui.open_documentation","Open documentation")}
        >${a(this.hass,"ui.read_documentation","Read more")} →</a>`:"";return l`
      <button
        class="trigger"
        data-test="help-trigger"
        aria-label=${a(this.hass,"ui.help","Help")}
        aria-expanded=${this._open}
        @click=${i=>this._toggle(i)}
      >${Ao}</button>
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
  `,c([m({attribute:!1})],ce.prototype,"hass",2),c([m()],ce.prototype,"text",2),c([m({type:Boolean})],ce.prototype,"multiline",2),c([m()],ce.prototype,"docPath",2),c([f()],ce.prototype,"_open",2),c([f()],ce.prototype,"_popStyle",2),ce=c([w("ambience-help")],ce);var me=class extends b{constructor(){super(...arguments);this.items=[];this.muted=!1;this._open=!1;this._onKeydown=e=>{e.key==="Escape"&&this._open&&(this._open=!1)}}_triggerLabel(){return this.label??a(this.hass,"ui.more_actions","More actions")}_select(e,i){i.stopPropagation(),this._open=!1,this.dispatchEvent(new CustomEvent("menu-action",{detail:{id:e},bubbles:!0,composed:!0}))}_renderItems(){return this.items.map(e=>l`
        ${e.dividerBefore?l`<div class="kebab-divider" role="separator"></div>`:$}
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
          `:$}
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
  `,c([m({attribute:!1})],me.prototype,"items",2),c([m({attribute:!1})],me.prototype,"hass",2),c([m()],me.prototype,"label",2),c([m({type:Boolean,reflect:!0})],me.prototype,"muted",2),c([f()],me.prototype,"_open",2),me=c([w("ambience-kebab-menu")],me);var Ne=class extends b{constructor(){super(...arguments);this.kind="matched";this.label="";this._open=!1;this._onDocClick=e=>{e.composedPath().includes(this)||this._close()};this._onKeydown=e=>{e.key==="Escape"&&this._close()}}_toggle(e){e.stopPropagation(),this._open?this._close():this._openPopover()}_openPopover(){this._open=!0,document.addEventListener("click",this._onDocClick,!0),document.addEventListener("keydown",this._onKeydown)}_close(){this._open&&(this._open=!1,document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown)}render(){return l`
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
  `,c([m()],Ne.prototype,"kind",2),c([m()],Ne.prototype,"label",2),c([f()],Ne.prototype,"_open",2),Ne=c([w("ambience-live-dot")],Ne);function Ol(t){return t.style.pointerEvents="none",t.style.willChange="transform",()=>{t.style.pointerEvents="",t.style.willChange="",t.style.transform=""}}function Zi(t,r,e={}){let i=t.pointerId;try{t.target?.setPointerCapture?.(i)}catch{}let n=e.follow??null,s=t.clientX,o=t.clientY,d=n?Ol(n):null,u=g=>{g.pointerId===i&&(r.onMove(g.clientX,g.clientY),n&&(n.style.transform=`translate(${g.clientX-s}px, ${g.clientY-o}px)`))},p=g=>{g.pointerId===i&&(_(),r.onEnd(g.clientX,g.clientY))},h=g=>{g.pointerId===i&&(_(),r.onCancel())},_=()=>{window.removeEventListener("pointermove",u,!0),window.removeEventListener("pointerup",p,!0),window.removeEventListener("pointercancel",h,!0),d?.()};return window.addEventListener("pointermove",u,!0),window.addEventListener("pointerup",p,!0),window.addEventListener("pointercancel",h,!0),_}function er(t,r){let e=document.elementFromPoint?.(t,r)??null;if(!e)return null;for(;e.shadowRoot;){let i=e.shadowRoot.elementFromPoint?.(t,r);if(!i||i===e)break;e=i}return e}var St=class{constructor(r,e,i={}){this.host=r;this.onReorder=e;this.from=null;this.over=null;this.moved=!1;this._cancelDrag=null;this._locate=i.locate??((n,s)=>this._domLocate(n,s)),r.addController(this)}hostDisconnected(){this._reset()}start(r,e){if(!e.isPrimary||e.button>0)return;this._reset(),this.from=r,this.moved=!1,this.host.requestUpdate();let i=e.target?.closest("[data-drag-index]");this._cancelDrag=Zi(e,{onMove:(n,s)=>this._hover(this._locate(n,s)),onEnd:(n,s)=>this.drop(this._locate(n,s)),onCancel:()=>this.end()},{follow:i})}_hover(r){if(this.from===null)return;let e=r===null||r===this.from?null:r;e!==null&&(this.moved=!0),this.over!==e&&(this.over=e,this.host.requestUpdate())}drop(r){let e=this.from;this._reset(),!(e===null||r===null||e===r)&&this.onReorder(e,r)}end(){this._reset()}_domLocate(r,e){let i=this.host.renderRoot,s=(i?.elementFromPoint?i.elementFromPoint(r,e):er(r,e))?.closest?.("[data-drag-index]");if(!s)return null;let o=Number(s.getAttribute("data-drag-index"));return Number.isNaN(o)?null:o}_reset(){this._cancelDrag?.(),this._cancelDrag=null;let r=this.from!==null||this.over!==null;this.from=null,this.over=null,r&&this.host.requestUpdate()}};function Lo(t){return t.normalize("NFC").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean)}function Ml(t,r){let e=Lo(t),i=Lo(r);if(i.length===0)return!0;for(let n=0;n+i.length<=e.length;n++)if(i.every((s,o)=>e[n+o]===s))return!0;return!1}function st(t,r){let e=t?.states?.[r]?.attributes?.friendly_name;if(typeof e=="string"&&e)return e;let i=t?.entities?.[r];if(typeof i?.name=="string"&&i.name)return i.name;if(typeof i?.original_name=="string"&&i.original_name)return i.original_name;let n=i?.device_id?t?.devices?.[i.device_id]:void 0;return typeof n?.name_by_user=="string"&&n.name_by_user?n.name_by_user:typeof n?.name=="string"&&n.name?n.name:r}function To(t,r){let e=st(t,r);if(!t)return e;let i=Bi(t,r),n=i?t.areas?.[i]?.name??"":"";return!n||Ml(e,n)?e:`${n} \xB7 ${e}`}function A(t,r){t.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r},bubbles:!0,composed:!0}))}var Fl=[{name:"duration",selector:{duration:{enable_day:!1}}}];function Jt(t){return!!t&&(t.h!==0||t.m!==0||t.s!==0)}function Et(t,r){return Jt(t)&&r==="less_than"?"less_than":void 0}function Xt(t){return t==="less_than"?"<":"\u2265"}var Oe=class extends b{constructor(){super(...arguments);this.value=null;this.mode="at_least"}willUpdate(e){(e.has("hass")||this._modeSchema===void 0)&&(this._modeSchema=[{name:"for_mode",required:!0,selector:{select:{mode:"dropdown",options:this._modeOptions()}}}])}get _d(){return this.value??{h:0,m:0,s:0}}_emit(e,i){this.value=e,this.mode=i,A(this,{...e,mode:i})}_setDuration(e){this._emit(e,this.mode)}_setMode(e){this._emit(this._d,e)}_modeOptions(){return[{value:"at_least",label:a(this.hass,"ui.for_at_least","at least")},{value:"less_than",label:a(this.hass,"ui.for_less_than","less than")}]}_renderMode(){if(customElements.get("ha-form"))return l`<ha-form
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
    </select>`}render(){if(customElements.get("ha-form")){let n=this._d;return l`${this._renderMode()}<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${Fl}
        .data=${{duration:{hours:n.h,minutes:n.m,seconds:n.s}}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.duration;this._setDuration({h:o?.hours??0,m:o?.minutes??0,s:o?.seconds??0})}}
      ></ha-form>`}let e=this._d,i=n=>l`<input type="number" min="0" step="1"
      .value=${String(e[n])}
      @change=${s=>this._setDuration({...e,[n]:Math.max(0,Math.trunc(Number(s.target.value)||0))})} />`;return l`${this._renderMode()}<div class="for-row" data-field="for">
      ${i("h")}<span>:</span>${i("m")}<span>:</span>${i("s")}
    </div>`}};Oe.styles=y`
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
  `,c([m({attribute:!1})],Oe.prototype,"hass",2),c([m({attribute:!1})],Oe.prototype,"value",2),c([m({attribute:!1})],Oe.prototype,"mode",2),Oe=c([w("ambience-for-duration")],Oe);function ii(t,r,e){if(r&&e){let i=e[r]?.fields?.[t];if(i&&typeof i=="object"){let n=i.name;if(typeof n=="string"&&n)return n}}return j(t)}function sr(t,r,e){return t.name?.trim()?t.name:r??a(e,"ui.new_scene_default","New scene")}function Lt(t,r,e){return r==null?a(e.hass,"ui.summary_any_paren","(any)"):t==="time_of_day"?lr(r,e):t==="day"?Ul(r,e):t==="weather"?Gl(r,e):t==="sun"?Kl(r,e):t==="state"?dn(r,e):t==="script"?zl(r,e):t==="people"?ql(r,e):t==="occupancy"?Yl(r,e):t==="unavailable"?td(r,e):t==="lux"?id(r,e):t==="template"?jl(r,e):String(r)}function jl(t,r={}){return t===null?a(r.hass,"ui.summary_any_paren","(any)"):typeof t!="object"||typeof t.template!="string"?String(t):t.template}function zl(t,r={}){if(t===null)return a(r.hass,"ui.summary_any_paren","(any)");if(typeof t!="object"||typeof t.script!="string")return String(t);let e=ei(r,t.script),i=t.args??{},n=Object.keys(i).sort();if(n.length===0)return e;let s=n.map(o=>`${sn(r.hass,t.script,o)}: ${Me(r.hass,i[o])}`).join(", ");return`${e} (${s})`}function sn(t,r,e){let i=r.replace(/^script\./,""),s=t?.services?.script?.[i]?.fields?.[e]?.name;return typeof s=="string"&&s?s:j(e)}function ei(t,r){let i=t.hass?.states?.[r]?.attributes?.friendly_name;if(typeof i=="string"&&i)return i;let n=r.indexOf("."),s=n>=0?r.slice(n+1):r;return s.charAt(0).toUpperCase()+s.slice(1)}function Po(t,r){return t==="home"?a(r.hass,"people_summary.home","Home"):ei(r,t)}function ql(t,r={}){if(t==null)return a(r.hass,"ui.summary_any","any");let e=t.where??"home";if(Array.isArray(t.who)&&t.who.length===1){let o=ei(r,t.who[0]),u=t.quant==="nobody"!=!!t.negate?a(r.hass,"people_summary.is_not_at","is not at"):a(r.hass,"people_summary.is_at","is at"),p=`${o} ${u} ${Po(e,r)}`;return t.for&&ti(t.for)?`${p} ${a(r.hass,"ui.for_prefix","for")} ${Xt(t.for_mode)}${nr(t.for)}`:p}let i;if(Array.isArray(t.who)){let o=t.quant??"any",d=o==="any"?a(r.hass,"ui.people_mode_any","Any of:"):o==="everyone"?a(r.hass,"ui.people_mode_all","All of:"):a(r.hass,"ui.people_mode_none","None of:"),u=t.who.map(p=>ei(r,p)).join(", ");i=`${d} (${u})`}else{let o=t.quant??"any";i=o==="nobody"?a(r.hass,"ui.people_mode_nobody","Nobody"):o==="any"?a(r.hass,"ui.people_mode_anybody","Anybody"):a(r.hass,"ui.people_mode_everybody","Everybody")}let n=t.negate?a(r.hass,"people_summary.is_not_at","is not at"):a(r.hass,"people_summary.is_at","is at"),s=`${i} ${n} ${Po(e,r)}`;return t.for&&ti(t.for)?`${s} ${a(r.hass,"ui.for_prefix","for")} ${Xt(t.for_mode)}${nr(t.for)}`:s}function Ul(t,r={}){if(t===null)return a(r.hass,"day_summary.any","any");let e=t.include??[],i=t.exclude??[],n=e.length===0?a(r.hass,"day_summary.any_day","any day"):e.map(o=>Ro(o,r)).join(", ");if(i.length===0)return n;let s=a(r.hass,"day_summary.except","except");return`${n} (${s} ${i.map(o=>Ro(o,r)).join(", ")})`}function Ro(t,r){switch(t.kind){case"weekday":return t.days.map(e=>Ri(r.hass,e)).join("/");case"day_of_month":return`${a(r.hass,"day_summary.day_prefix","day")} ${t.days}`;case"date":return`${vt(r.hass,t.month)} ${t.day}`;case"date_range":return`${vt(r.hass,t.from.month)} ${t.from.day} \u2192 ${vt(r.hass,t.to.month)} ${t.to.day}`;case"last_day":return a(r.hass,"day_summary.last_day","last day");case"workday":return a(r.hass,"day_summary.workday","workday");case"holiday":return a(r.hass,"day_summary.holiday","holiday");case"first_workday":return a(r.hass,"day_summary.first_workday","first workday");case"last_workday":return a(r.hass,"day_summary.last_workday","last workday")}}function on(t){return typeof t=="string"?t:typeof t=="number"||typeof t=="boolean"?String(t):JSON.stringify(t)}var Wl=["entity_id","device_id","area_id","label_id","floor_id"],Do=2;function Vl(t){if(!t||typeof t!="object"||Array.isArray(t))return null;let r=t;if(!Object.keys(r).every(n=>Wl.includes(n)))return null;let e=r.entity_id,i=typeof e=="string"?[e]:Array.isArray(e)?e.filter(n=>typeof n=="string"):[];return i.length?i:null}function Me(t,r){let e=Vl(r);if(!e)return on(r);let i=e.slice(0,Do).map(o=>ei({hass:t},o)),n=e.length-Do;return`[${n>0?`${i.join(", ")} +${n} more`:i.join(", ")}]`}function or(t){if(!(!t||typeof t!="object")){for(let r of Object.values(t))if(r&&typeof r=="object"){let e=r.unit_of_measurement;if(typeof e=="string"&&e)return e}}}function Bl(t){return t.split(/[\s_-]+/).filter(r=>r!=="").map(r=>r.charAt(0).toUpperCase()+r.slice(1).toLowerCase()).join(" ")}function Gl(t,r={}){if(t===null)return a(r.hass,"ui.summary_any","any");let e=new Map((r.weatherGroups??[]).map(o=>[o.id,o.label])),i=(t.groups??[]).map(o=>e.get(o)??Bl(o)).join("/"),n=(t.thresholds??[]).map(o=>`${qt(r.hass,o.attribute)} ${z(r.hass,o.op)} ${o.value}`).join(", "),s=[i,n].filter(o=>o!=="");return s.length===0?a(r.hass,"ui.summary_any","any"):s.join(", ")}function Kl(t,r={}){if(t===null)return a(r.hass,"ui.summary_any","any");let e=[],i=t.elevation;i&&(i.min!=null&&i.max!=null?e.push(`${i.min}\xB0\u2013${i.max}\xB0`):i.min!=null?e.push(`\u2265${i.min}\xB0`):i.max!=null&&e.push(`\u2264${i.max}\xB0`));let n=t.azimuth;if(n){n.sectors?.length&&e.push(n.sectors.join("/"));for(let s of n.ranges??[])e.push(`${s.from}\xB0\u2013${s.to}\xB0`)}return e.length===0?a(r.hass,"ui.summary_any","any"):e.join(", ")}function ar(t,r){return To(t.hass,r)}function an(t,r,e,i,n={}){let s=n.negate?`${a(t.hass,`${r}.not`,"not")} `:"";if(e.length===1)return`${e[0]} ${a(t.hass,`${r}.is`,"is")} ${s}${i}`;let o=n.all===!0,d=o?a(t.hass,`${r}.all_of`,"All of"):a(t.hass,`${r}.any_of`,"Any of"),u=o?a(t.hass,`${r}.are`,"are"):a(t.hass,`${r}.is`,"is");return`${d} (${e.join(", ")}) ${u} ${s}${i}`}function Yl(t,r={}){if(t==null||!t.sensors?.length)return a(r.hass,"ui.summary_any","any");let e=t.sensors.map(s=>ar(r,s)),i=t.occupied===!1?a(r.hass,"occupancy_summary.clear","clear"):a(r.hass,"occupancy_summary.detected","detected"),n=an(r,"occupancy_summary",e,i,{all:t.quant==="all",negate:t.negate});return t.for&&ti(t.for)?`${n} ${a(r.hass,"ui.for_prefix","for")} ${Xt(t.for_mode)}${nr(t.for)}`:n}function Ql(t,r){if(r==null||typeof r!="object")return!1;if(t==="occupancy"||t==="lux")return!!r.negate;if(t==="people"){let e=r;return!!e.negate&&Array.isArray(e.who)&&e.who.length===1}return!1}function Jl(t){return{...t,negate:!1}}function tn(t){if(t.kind==="and"||t.kind==="or"){let r=t.items.map(tn);return r.length===1?r[0]:{...t,items:r}}return t.kind==="not"?{...t,item:tn(t.item)}:t}function Zt(t){if(t.kind==="is_not")return t.for&&ti(t.for)?null:{...t,kind:"is"};if(t.kind==="not"){let r=t.item.kind;return r==="is"||r===">"||r===">="||r==="<"||r==="<="||r==="and"||r==="or"?t.item:null}if(t.kind==="or"){let r=[];for(let e of t.items){let i=Zt(e);if(!i)return null;r.push(i)}return r.length===1?r[0]:{kind:"and",items:r}}return null}function Xl(t,r){let e=At("state",t,r);return(t.kind==="and"||t.kind==="or")&&t.items.length>1?`(${e})`:e}function tr(t,r,e){let i=[],n=[];for(let h of t.items){let _=Zt(h);_?n.push(_):i.push(h)}let s=` ${z(r.hass,"or")} `,o=i.map(h=>rn(h,r)).join(s),d="";if(n.length){let h=n.length===1?n[0]:{kind:"and",items:n};d=`${a(r.hass,"blocker_summary.until","until")} ${Xl(h,r)}`}let u=[o,d].filter(h=>h!=="").join(s),p=i.length+(n.length?1:0);return e&&p>1?`(${u})`:u}function ir(t,r){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<=")return rr(t,r,!1);if(t.kind==="and"){let e=` ${z(r.hass,"and")} `;return t.items.map(i=>rn(i,r)).join(e)}if(t.kind==="or")return tr(t,r,!1);if(t.kind==="not"){let e=t.item;return e.kind==="is"?rr(e,r,!0):`${z(r.hass,"not")} ${rn(e,r)}`}return""}function rn(t,r){return t.kind==="or"?tr(t,r,!0):t.kind==="and"?`(${ir(t,r)})`:ir(t,r)}function Zl(t,r,e){let i=tn(t);if(i.kind==="and"){let s=[],o=[];for(let p of i.items){let h=Zt(p);h?o.push(h):s.push(p)}let d=[];if(s.length>0){let p=s.length===1?s[0]:{kind:"and",items:s};d=[p.kind==="or"?tr(p,r,!e):ir(p,r)]}let u=o.map(p=>At("state",p,r));return{guards:d,releases:u}}if(i.kind==="or"){let s=Zt(i);return s?{guards:[],releases:[At("state",s,r)]}:{guards:[tr(i,r,!e)],releases:[]}}let n=Zt(i);return n?{guards:[],releases:[At("state",n,r)]}:{guards:[ir(i,r)],releases:[]}}var ed=new Set(["occupancy","people","state","lux","unavailable","script","template","day","time_of_day","weather"]);function At(t,r,e){let i=Lt(t,r,e);return ed.has(t)?i:`${G(e.hass,t)}: ${i}`}function No(t,r={}){let e=a(r.hass,"blocker_summary.block","Block"),i=Object.keys(t.when).filter(_=>t.when[_]!=null);if(r.priorities){let _=r.priorities;i=i.sort((g,v)=>{let x=_.get(g),C=_.get(v);return x===void 0&&C===void 0?0:(C??-1/0)-(x??-1/0)})}let n=[],s=[];for(let _ of i){let g=t.when[_];if(_==="state"){let v=Zl(g,r,i.length===1);s.push(...v.guards),n.push(...v.releases);continue}Ql(_,g)?n.push(At(_,Jl(g),r)):s.push(At(_,g,r))}let o=a(r.hass,"blocker_summary.until","until"),d=` ${a(r.hass,"blocker_summary.or","or")} `,u=` ${a(r.hass,"blocker_summary.and","and")} `,p=n.join(d),h=s.join(u);if(n.length&&s.length){let _=a(r.hass,"blocker_summary.while_lead","While"),g=a(r.hass,"blocker_summary.block_mid","block");return`${_} ${h}, ${g} ${o} ${p}`}if(n.length)return`${e} ${o} ${p}`;if(s.length){let _=a(r.hass,"blocker_summary.while","while");return`${e} ${_} ${h}`}return`${e} ${a(r.hass,"blocker_summary.always","always")}`}function td(t,r={}){if(t==null||!t.entities?.length)return a(r.hass,"ui.summary_any","any");let e=t.entities.map(n=>ar(r,n)),i=a(r.hass,"unavailable_summary.unavailable","unavailable");return an(r,"unavailable_summary",e,i)}function ln(t,r,e="any lux"){return t!=null&&r!=null?`${t}\u2013${r} lx`:r!=null?`<${r} lx`:t!=null?`\u2265${t} lx`:e}function id(t,r={}){if(t==null||!t.sensors?.length)return a(r.hass,"ui.summary_any","any");let e=t.sensors.map(n=>ar(r,n)),i=t.range!=null?De(r.hass,t.range,r.luxRanges?.custom??{}):ln(t.min,t.max);return an(r,"lux_summary",e,i,{all:t.quant==="all",negate:t.negate})}function dn(t,r={}){return t==null?a(r.hass,"ui.summary_any","any"):nn(t,r)}function rr(t,r,e){let i=z(r.hass,t.kind),n=ar(r,t.entity_id),s=r.hass?.states?.[t.entity_id],d=t.kind!=="is"&&t.kind!=="is_not"?t.states[0]??"":t.states.map(_=>Re(r.hass,s,t.attribute,_)).join("/"),u=t.attribute?`${n}.${Ti(r.hass,s,t.attribute)}`:n,p=e?`${z(r.hass,"not")} `:"",h=`${u} ${i} ${p}${d}`;return t.for&&ti(t.for)?`${h} ${a(r.hass,"ui.for_prefix","for")} ${Xt(t.for_mode)}${nr(t.for)}`:h}function nn(t,r){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<=")return rr(t,r,!1);if(t.kind==="and"||t.kind==="or"){let e=` ${z(r.hass,t.kind)} `;return t.items.map(i=>Ho(i,r)).join(e)}if(t.kind==="not"){let e=t.item;return e.kind==="is"?rr(e,r,!0):`${z(r.hass,"not")} ${Ho(e,r)}`}return""}function Ho(t,r){return t.kind==="and"||t.kind==="or"?`(${nn(t,r)})`:nn(t,r)}function ti(t){return t.h>0||t.m>0||t.s>0}function nr(t){let r=[];return t.h&&r.push(`${t.h}h`),t.m&&r.push(`${t.m}m`),t.s&&r.push(`${t.s}s`),r.length?r.join(" "):"0s"}function lr(t,r){if(t===null)return a(r.hass,"ui.summary_any","any");let e=Array.isArray(t)?t:[t],i=r.periods?.custom??{};return e.map(n=>"period"in n?pe(r.hass,n.period,i):`${Io(n.from,r)} \u2192 ${Io(n.to,r)}`).join(", ")}function Io(t,r){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=re(r.hass,t.anchor),i=e;if(t.offset_min!==0){let n=Math.abs(t.offset_min),s=n%60===0?`${n/60}${a(r.hass,"ui.unit_hour_abbr","h")}`:`${n}${a(r.hass,"ui.unit_min_abbr","m")}`;i=`${e}${t.offset_min<0?"-":"+"}${s}`}if(t.clamp){let n=t.clamp.dir==="not_before"?a(r.hass,"ui.clamp_not_before","not before"):a(r.hass,"ui.clamp_not_after","not after"),s=`${String(t.clamp.hh).padStart(2,"0")}:${String(t.clamp.mm).padStart(2,"0")}`;i=`${i} (${n} ${s})`}return i}function rd(t,r){return gt(t.service,r.exposedActions,()=>r.schemas?.[t.service]?.name?.trim()||Pi(r.hass,t.service))}function nd(t,r){let e=new Set;for(let i of t.entity_ids){let n=i.indexOf(".");n>0&&e.add(i.slice(0,n))}return e.size===1?[...e][0]:a(r.hass,"ui.target_noun","target")}function Oo(t,r){let e=rd(t,r),i=nd(t,r),n=t.entity_ids.length,s;n===0?s=a(r.hass,"ui.no_targets","(no targets)"):n===1?s=`1 ${i}`:s=`${n} ${i}s`;let o=Object.entries(t.params).filter(([,d])=>d!=null&&d!=="").map(([d,u])=>`${ii(d,t.service,r.schemas)}: ${Me(r.hass,u)}`).join(", ");return o?`${e}: ${s}, ${o}`:`${e}: ${s}`}var N=class extends b{constructor(){super(...arguments);this.scenes=[];this.availableActions=[];this.schemas={};this.categories=[];this.filterCategory="";this.collapsedCategories=[];this.liveSuppressed=!1;this._drag=new St(this,(e,i)=>this._emit("reorder-scenes",{from:e,to:i}));this._expanded=new Set}willUpdate(e){e.has("scenes")&&(this._expanded=new Set)}_renderSectionHeader(e,i,n){return l`<div
      class="category-section-header"
      style=${zi(e.color)}
      @click=${()=>this._emit("toggle-category-collapse",{categoryId:e.id})}
    >
      <span class="category-chevron ${i?"open":""}" aria-hidden="true">▶</span>
      ${e.icon?l`<ha-icon icon=${e.icon}></ha-icon>`:""}
      <span>${e.name}</span>
      ${Ji(this.hass,n.map(([,s])=>s))}
      <ambience-kebab-menu
        class="category-kebab"
        .hass=${this.hass}
        @click=${s=>s.stopPropagation()}
        .items=${[{id:"run",label:a(this.hass,"ui.run","Run"),icon:"mdi:play"},{id:"traces",label:a(this.hass,"ui.view_traces","View traces"),icon:"mdi:transit-connection-variant"},{id:"simulate",label:a(this.hass,"ui.simulate","Simulate"),icon:"mdi:flask-outline"},{id:"auto",label:a(this.hass,"ui.auto_triggers_section","Auto-triggers"),icon:"mdi:flash-auto"},{id:"download",label:a(this.hass,"ui.download_diagnostics","Download diagnostics"),icon:"mdi:download"}]}
        @menu-action=${s=>this._onCategoryMenu(e,s.detail.id)}
      ></ambience-kebab-menu>
    </div>`}_sections(){let e=this.scenes.map((n,s)=>[s,n]);if(this.filterCategory!=="")return[{category:this.categories.find(n=>n.id===this.filterCategory),rows:e.filter(([,n])=>n.category===this.filterCategory)}];let i=new Map;for(let[n,s]of e){let o=i.get(s.category)??[];o.push([n,s]),i.set(s.category,o)}return[...i.entries()].map(([n,s])=>({category:this.categories.find(o=>o.id===n),rows:s})).sort((n,s)=>(n.category?.name??"").localeCompare(s.category?.name??""))}_emit(e,i){this.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}_priorityMap(){let e=this.conditions;return(!this._priorityOfCache||this._priorityOfCache.src!==e)&&(this._priorityOfCache={src:e,map:new Map((e??[]).map(i=>[i.name,i.priority]))}),this._priorityOfCache.map}_whenKeys(e){let i=this._priorityMap();return Object.keys(e.when).filter(n=>e.when[n]!=null).sort((n,s)=>(i.get(s)??-1/0)-(i.get(n)??-1/0))}_whenSummary(e){let i=this._whenKeys(e);return i.length===0?a(this.hass,"ui.summary_always","Always"):i.map((n,s)=>{let o=G(this.hass,n),d=Lt(n,e.when[n],{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups});return l`${s===0?"":", "}<strong>${o}:</strong> ${d}`})}_blockerSummary(e){return No(e,{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups,priorities:this._priorityMap()})}_whenStacked(e){let i=this._whenKeys(e);return i.length===0?l`<div class="condition-line">
        ${a(this.hass,"ui.summary_always","Always")}
      </div>`:i.map(n=>{let s=G(this.hass,n),o=Lt(n,e.when[n],{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups});return l`<div class="condition-line">
        <strong>${s}:</strong> ${o}
      </div>`})}_actionCountLabel(e){let i=e.actions.length,n=i===1?a(this.hass,"ui.action_singular","action"):a(this.hass,"ui.action_plural","actions");return`${i} ${n}`}_toggleScene(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}_entityName(e){return st(this.hass,e)}_actionParamsString(e){return Object.entries(e.params).filter(([,i])=>i!=null&&i!=="").map(([i,n])=>`${ii(i,e.service,this.schemas)}: ${Me(this.hass,n)}`).join(", ")}_actionLabel(e){return gt(e.service,this.availableActions,()=>this.schemas[e.service]?.name?.trim()||Pi(this.hass,e.service))}_onCategoryMenu(e,i){i==="run"?this._emit("apply-category",{categoryId:e.id}):i==="traces"?this._emit("show-traces",{category:e.id}):i==="simulate"?this._emit("show-simulator",{category:e.id}):i==="auto"?this._emit("show-auto-triggers",{category:e.id}):i==="download"&&this._emit("download-diagnostics",{category:e.id})}_onSceneMenu(e,i){i==="edit"?this._emit("edit-scene",{index:e}):i==="duplicate"?this._emit("duplicate-scene",{index:e}):i==="run"?this._emit("run-scene-actions",{index:e}):i==="delete"&&this._emit("delete-scene",{index:e})}_liveDot(e,i){if(this.liveSuppressed||!this.scope||!this.live)return"";let n=this.live.get(Ee(this.scope,i.category));if(!n)return"";if(n.matched===e){let s=a(this.hass,"ui.scene_live","Live now \u2014 this scene currently matches and is applied");return l`<ambience-live-dot kind="matched" .label=${s}></ambience-live-dot>`}if(n.applied===e){let s=a(this.hass,"ui.scene_applied_stale","Still applied \u2014 this scene's actions are in effect but it no longer matches");return l`<ambience-live-dot kind="stale" .label=${s}></ambience-live-dot>`}return""}_problemFlag(e){let i=Qi(e);if(!i.severity)return"";let n=[];return i.shadowed&&n.push(a(this.hass,"ui.shadowed","Never fires \u2014 shadowed by an earlier scene.")),i.missing.length&&n.push(`${a(this.hass,"ui.problem_missing","Missing or disabled in Home Assistant:")} ${i.missing.join(", ")}`),i.overlap.length&&n.push(`${a(this.hass,"ui.problem_overlap","Controlled by multiple groups:")} ${i.overlap.join(", ")}`),i.configIssues.length&&n.push(`${a(this.hass,"ui.problem_config","Configuration problems:")} ${i.configIssues.map(s=>So(this.hass,s)).join(", ")}`),l`<ambience-problem-flag
      .severity=${i.severity}
      .details=${n}
      .summary=${n.join(`
`)}
    ></ambience-problem-flag>`}_renderRow(e,i,n){let s=a(this.hass,"ui.unpin","Unpin (return to automatic order)"),o=i.enabled===!1,d=o?a(this.hass,"ui.enable_scene","Enable scene"):a(this.hass,"ui.disable_scene","Disable scene"),u=!!i.description?.trim();return l`
      <li
        data-drag-index=${e}
        class="${this._drag.over===e?"drag-over ":""}${this._drag.from===e?"dragging ":""}${o?"disabled":""}"
      >
        <span class="lead">
          ${i.pinned?l`<button
                class="pin"
                title=${s}
                aria-label=${s}
                @pointerdown=${p=>this._drag.start(e,p)}
                @click=${p=>{if(p.stopPropagation(),this._drag.moved){this._drag.moved=!1;return}this._emit("unpin-scene",{index:e})}}
              >
                📌
              </button>`:l`<span
                class="handle"
                title=${a(this.hass,"ui.drag_to_reorder","Drag to reorder")}
                @pointerdown=${p=>this._drag.start(e,p)}
                >⠿</span
              >`}
        </span>
        <span class="idx">${n}</span>
        <span class="warn-slot">${this._problemFlag(i)||this._liveDot(e,i)}</span>
        <div class="body" @click=${()=>this._toggleScene(e)}>
          <div class="name">
            ${sr(i,a(this.hass,"ui.scene_n","Scene {n}").replace("{n}",String(n)))}
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
                            >${a(this.hass,"ui.apply_on_every_match","Apply on every match")}</span
                          >`:""}`}
          </div>
          ${this._expanded.has(e)?l`
                <div class="scene-detail">
                  ${u?l`<div class="scene-description">${i.description}</div>`:""}
                  ${this._whenStacked(i)}
                  ${i.actions.length===0?l`<div class="noop-detail">
                        ${this._blockerSummary(i)}
                      </div>`:l`<div class="actions-detail">
                        ${i.actions.map(p=>{let h=this._actionParamsString(p),_=this._actionLabel(p),g=h?`${_} \xB7 ${h}`:_;return l`
                            <div class="actions-detail-item">
                              <div class="action-header">${g}</div>
                              ${p.entity_ids.length===0?l`<div class="no-targets">
                                    ${a(this.hass,"ui.no_targets","(no targets)")}
                                  </div>`:l`<ul class="entity-list">
                                    ${p.entity_ids.map(v=>l`<li>${this._entityName(v)}</li>`)}
                                  </ul>`}
                            </div>
                          `})}
                      </div>
                      ${i.apply==="always"?l`<div class="apply-every-detail" data-test="apply-every-detail">
                            ${a(this.hass,"ui.apply_on_every_match","Apply on every match")}
                          </div>`:""}`}
                </div>
              `:""}
        </div>
        <button
          class="toggle"
          @click=${p=>{p.stopPropagation(),this._emit("toggle-scene-enabled",{index:e,enabled:o})}}
          title=${d}
          aria-label=${d}
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
          @menu-action=${p=>this._onSceneMenu(e,p.detail.id)}
        ></ambience-kebab-menu>
      </li>
    `}render(){let e=this._sections().filter(n=>n.rows.length>0);if(e.length===0){let n=this.filterCategory?{category:this.filterCategory}:{};return l`
        <p class="empty">
          ${a(this.hass,"ui.no_scenes_yet","No scenes yet.")}
        </p>
        <button class="add" @click=${()=>this._emit("add-scene",n)}>
          ${a(this.hass,"ui.add_scene","+ Add scene")}
        </button>
      `}let i=this.categories.length>0;return l`
      ${e.map(n=>{let s=!!n.category&&this.collapsedCategories.includes(n.category.id);return l`
          <div class="category-section">
            ${i&&n.category?this._renderSectionHeader(n.category,!s,n.rows):""}
            ${s?"":l`
                  <ul>
                    ${n.rows.map(([o,d],u)=>this._renderRow(o,d,u+1))}
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
  `,c([m({attribute:!1})],N.prototype,"scenes",2),c([m({attribute:!1})],N.prototype,"periods",2),c([m({attribute:!1})],N.prototype,"luxRanges",2),c([m({attribute:!1})],N.prototype,"weatherConfig",2),c([m({attribute:!1})],N.prototype,"hass",2),c([m({attribute:!1})],N.prototype,"conditions",2),c([m({attribute:!1})],N.prototype,"availableActions",2),c([m({attribute:!1})],N.prototype,"schemas",2),c([m({attribute:!1})],N.prototype,"categories",2),c([m({attribute:!1})],N.prototype,"filterCategory",2),c([m({attribute:!1})],N.prototype,"collapsedCategories",2),c([m({attribute:!1})],N.prototype,"scope",2),c([m({attribute:!1})],N.prototype,"live",2),c([m({attribute:!1})],N.prototype,"liveSuppressed",2),c([f()],N.prototype,"_expanded",2),N=c([w("ambience-scenes-list")],N);var _e=class extends b{constructor(){super(...arguments);this.entities=[];this.value=[];this.target=null;this.label=" "}_filteredEntities(){return bo(this.entities,this.target)}connectedCallback(){super.connectedCallback(),ie(this)}_emit(e){A(this,e)}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let i=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this._filteredEntities()}}}],n=this.label;return l`
      <ha-form
        .hass=${this.hass}
        .schema=${i}
        .data=${{entity_ids:this.value}}
        .computeLabel=${()=>n}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,i){let n=new Set(this.value);i?n.add(e):n.delete(e),this._emit(this._filteredEntities().filter(s=>n.has(s)))}_renderFallback(){let e=this._filteredEntities();return e.length===0?l`<p class="empty">${a(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:l`
      <div class="checkboxes">
        ${e.map(i=>l`
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
  `,c([m({attribute:!1})],_e.prototype,"hass",2),c([m({attribute:!1})],_e.prototype,"entities",2),c([m({attribute:!1})],_e.prototype,"value",2),c([m({attribute:!1})],_e.prototype,"target",2),c([m()],_e.prototype,"label",2),_e=c([w("ambience-target-picker")],_e);var q=class extends b{constructor(){super(...arguments);this.entityIds=[];this.params={};this.excludeEntities=[];this._schema=void 0;this._schemaError=null;this._exposedMissing=!1;this._formSchema=[];this._perFieldSchemas={};this._schemaServiceId=null;this._onTargetChanged=e=>{e.stopPropagation(),this._emit("entity-ids-changed",{entityIds:e.detail.value})};this._onFieldInput=e=>i=>{i.stopPropagation();let n=i.target,s={...this.params,[e]:n.value};this._emit("params-changed",{params:s})};this._onHaFormChanged=e=>{e.stopPropagation(),this._emit("params-changed",{params:{...this.params,...e.detail.value}})}}connectedCallback(){super.connectedCallback(),ie(this)}willUpdate(e){if((e.has("exposed")&&e.get("exposed")?.id!==this.exposed?.id||e.has("hass")&&this._schema===void 0&&this._schemaServiceId!==this.exposed?.id)&&this._loadSchema(),(e.has("exposed")||e.has("_schema"))&&(this._formSchema=this._buildFormSchema()),e.has("_formSchema")||e.has("_schema")||e.has("exposed")){let i={};for(let n of this._formSchema)i[n.name]=[n];this._perFieldSchemas=i}}async _loadSchema(){if(this.exposed===void 0&&this.hass){this._exposedMissing=!0,this._schema=null,this._schemaServiceId=null;return}let e=this.exposed?.id;if(!e||!this.hass){this._exposedMissing=!1,this._schema=void 0,this._schemaServiceId=null;return}this._exposedMissing=!1,this._schemaServiceId=e,this._schemaError=null,this._schema=void 0;try{let i=await He(this.hass,e);if(this._schemaServiceId!==e)return;this._schema=i}catch(i){if(this._schemaServiceId!==e)return;this._schema=null,this._schemaError=S(this.hass,i)}}_buildFormSchema(){let e=this._schema,i=this.exposed;if(!e||!i)return[];let n=new Set(i.visible_fields??[]),s=[];for(let[o,d]of Object.entries(e.fields))n.has(o)&&s.push({name:o,selector:d.selector??{text:{}},required:!!d.required,description:typeof d.description=="string"&&d.description?d.description:void 0});return s}updated(e){super.updated?.(e),e.has("_schema")&&this.dispatchEvent(new CustomEvent("target-mode-changed",{detail:{hasTarget:this.hasTarget()},bubbles:!0,composed:!0}))}_hasTarget(){let e=this._schema?.target??null;return!e||typeof e!="object"?!1:Object.keys(e).length>0}hasTarget(){return this._schema===void 0?!1:this._hasTarget()}_scopeEntities(){return!this.scope||!this.hass?[]:Yi(this.hass,this.scope,[])}_renderTargetPicker(){if(!this._hasTarget())return"";let e=new Set(this.excludeEntities),i=this._scopeEntities().filter(o=>!e.has(o)),n=this._schema?.target??null,s=a(this.hass,"ui.target","Target");return l`
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
    `}_humanizeFieldLabel(e){let i=this._schema?.fields[e];return i?.name?i.name:j(e)}_clearField(e){if(!(e in this.params))return;let i={...this.params};delete i[e],this._emit("params-changed",{params:i})}_extraParamKeys(){let e=new Set;for(let i of this._formSchema)e.add(i.name);for(let i of Object.keys(this.exposed?.defaults??{}))e.add(i);return Object.keys(this.params).filter(i=>!e.has(i))}_clearExtraParams(){let e=new Set(this._extraParamKeys());if(e.size===0)return;let i={};for(let[n,s]of Object.entries(this.params))e.has(n)||(i[n]=s);this._emit("params-changed",{params:i})}_fieldData(e){return e in this.params?{[e]:this.params[e]}:{}}_defaultHintSuffix(e){let i=this.exposed?.defaults??{};if(!(e.name in i))return"";let n=or(e.selector),s=Me(this.hass,i[e.name]);return` (${a(this.hass,"ui.default_prefix","Default: ")}${s}${n?` ${n}`:""})`}_hasUserOverride(e){return e in this.params}_renderExtraParamsNotice(){let e=this._extraParamKeys();if(e.length===0)return"";let i=e.join(", ");return l`
      <div class="extra-params-notice" data-extra-params>
        <span>
          ${a(this.hass,"ui.extra_fields_prefix","Extra fields:")} ${i}.
          ${a(this.hass,"ui.extra_fields_hint","These fields aren't currently exposed but will still be sent.")}
        </span>
        <button data-remove-extras @click=${()=>this._clearExtraParams()}>
          ${a(this.hass,"ui.remove","Remove")}
        </button>
      </div>
    `}_renderFieldsForm(){let e=this._formSchema,i=this._renderExtraParamsNotice();return e.length===0?i===""?"":l`<div class="fields-form">${i}</div>`:customElements.get("ha-form")?l`
        <div class="fields-form">
          ${e.map(n=>{let s=this._perFieldSchemas[n.name]??[n],o=this._fieldData(n.name),d=this._defaultHintSuffix(n);return l`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <span class="field-label">${this._humanizeFieldLabel(n.name)}${n.required?" *":""}</span>${d?l`<span class="field-default-hint">${d}</span>`:""}
                  </span>
                  ${this._hasUserOverride(n.name)?l`<button
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
      `:l`
      <div class="fields-form">
        ${e.map(n=>{let s=this._fieldData(n.name),o=n.name in s?String(s[n.name]??""):"",d=this._defaultHintSuffix(n);return l`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <label class="field-label">${this._humanizeFieldLabel(n.name)}${n.required?" *":""}</label>${d?l`<span class="field-default-hint">${d}</span>`:""}
                  </span>
                  ${this._hasUserOverride(n.name)?l`<button
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
    `}_emit(e,i){this.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}_renderRawConfig(){let e=this.service??this.exposed?.id;if(!e)return"";let i=Object.entries(this.params??{});return l`
      <dl class="raw-config" data-raw-config>
        <div class="raw-row">
          <dt>${a(this.hass,"ui.raw_config_action","Action")}:</dt>
          <dd>${e}</dd>
        </div>
        ${this.entityIds.length?l`<div class="raw-row">
                <dt>${a(this.hass,"ui.raw_config_targets","Targets")}:</dt>
                <dd>${this.entityIds.join(", ")}</dd>
              </div>`:""}
        ${i.length?l`<div class="raw-row">
                <dt>${a(this.hass,"ui.raw_config_params","Parameters")}:</dt>
                <dd>${i.map(([n,s])=>`${n}: ${s==null?"":on(s)}`).join(", ")}</dd>
              </div>`:""}
      </dl>
    `}render(){if(this._schema===null){let n=this._exposedMissing?a(this.hass,"ui.action_unavailable","Action no longer available; configure it in Settings \u2192 Actions or remove this action."):this._schemaError??a(this.hass,"ui.service_unavailable","Service not available in this HA instance.");return l`
        <div class="schema-error">${n}</div>
        ${this._renderRawConfig()}
      `}if(this._schema===void 0)return l`<div>${a(this.hass,"ui.loading","Loading\u2026")}</div>`;let e=this._renderTargetPicker(),i=this._renderFieldsForm();return e===""&&i===""?l`<div class="no-params">${a(this.hass,"ui.action_no_parameters","This action has no configurable fields.")}</div>`:l`${e}${i}`}};q.styles=y`
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
  `,c([m({attribute:!1})],q.prototype,"hass",2),c([m({attribute:!1})],q.prototype,"scope",2),c([m({attribute:!1})],q.prototype,"exposed",2),c([m({attribute:!1})],q.prototype,"service",2),c([m({attribute:!1})],q.prototype,"entityIds",2),c([m({attribute:!1})],q.prototype,"params",2),c([m({attribute:!1})],q.prototype,"excludeEntities",2),c([f()],q.prototype,"_schema",2),c([f()],q.prototype,"_schemaError",2),c([f()],q.prototype,"_exposedMissing",2),c([f()],q.prototype,"_formSchema",2),c([f()],q.prototype,"_perFieldSchemas",2),q=c([w("ambience-action-slot")],q);function Zo(t){return typeof t>"u"||t===null}function sd(t){return typeof t=="object"&&t!==null}function od(t){return Array.isArray(t)?t:Zo(t)?[]:[t]}function ad(t,r){var e,i,n,s;if(r)for(s=Object.keys(r),e=0,i=s.length;e<i;e+=1)n=s[e],t[n]=r[n];return t}function ld(t,r){var e="",i;for(i=0;i<r;i+=1)e+=t;return e}function dd(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var cd=Zo,ud=sd,pd=od,hd=ld,md=dd,_d=ad,M={isNothing:cd,isObject:ud,toArray:pd,repeat:hd,isNegativeZero:md,extend:_d};function ea(t,r){var e="",i=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(e+='in "'+t.mark.name+'" '),e+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!r&&t.mark.snippet&&(e+=`

`+t.mark.snippet),i+" "+e):i}function ni(t,r){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=r,this.message=ea(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}ni.prototype=Object.create(Error.prototype);ni.prototype.constructor=ni;ni.prototype.toString=function(r){return this.name+": "+ea(this,r)};var Z=ni;function cn(t,r,e,i,n){var s="",o="",d=Math.floor(n/2)-1;return i-r>d&&(s=" ... ",r=i-d+s.length),e-i>d&&(o=" ...",e=i+d-o.length),{str:s+t.slice(r,e).replace(/\t/g,"\u2192")+o,pos:i-r+s.length}}function un(t,r){return M.repeat(" ",r-t.length)+t}function fd(t,r){if(r=Object.create(r||null),!t.buffer)return null;r.maxLength||(r.maxLength=79),typeof r.indent!="number"&&(r.indent=1),typeof r.linesBefore!="number"&&(r.linesBefore=3),typeof r.linesAfter!="number"&&(r.linesAfter=2);for(var e=/\r?\n|\r|\0/g,i=[0],n=[],s,o=-1;s=e.exec(t.buffer);)n.push(s.index),i.push(s.index+s[0].length),t.position<=s.index&&o<0&&(o=i.length-2);o<0&&(o=i.length-1);var d="",u,p,h=Math.min(t.line+r.linesAfter,n.length).toString().length,_=r.maxLength-(r.indent+h+3);for(u=1;u<=r.linesBefore&&!(o-u<0);u++)p=cn(t.buffer,i[o-u],n[o-u],t.position-(i[o]-i[o-u]),_),d=M.repeat(" ",r.indent)+un((t.line-u+1).toString(),h)+" | "+p.str+`
`+d;for(p=cn(t.buffer,i[o],n[o],t.position,_),d+=M.repeat(" ",r.indent)+un((t.line+1).toString(),h)+" | "+p.str+`
`,d+=M.repeat("-",r.indent+h+3+p.pos)+`^
`,u=1;u<=r.linesAfter&&!(o+u>=n.length);u++)p=cn(t.buffer,i[o+u],n[o+u],t.position-(i[o]-i[o+u]),_),d+=M.repeat(" ",r.indent)+un((t.line+u+1).toString(),h)+" | "+p.str+`
`;return d.replace(/\n$/,"")}var gd=fd,vd=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],yd=["scalar","sequence","mapping"];function bd(t){var r={};return t!==null&&Object.keys(t).forEach(function(e){t[e].forEach(function(i){r[String(i)]=e})}),r}function wd(t,r){if(r=r||{},Object.keys(r).forEach(function(e){if(vd.indexOf(e)===-1)throw new Z('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.options=r,this.tag=t,this.kind=r.kind||null,this.resolve=r.resolve||function(){return!0},this.construct=r.construct||function(e){return e},this.instanceOf=r.instanceOf||null,this.predicate=r.predicate||null,this.represent=r.represent||null,this.representName=r.representName||null,this.defaultStyle=r.defaultStyle||null,this.multi=r.multi||!1,this.styleAliases=bd(r.styleAliases||null),yd.indexOf(this.kind)===-1)throw new Z('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var W=wd;function Mo(t,r){var e=[];return t[r].forEach(function(i){var n=e.length;e.forEach(function(s,o){s.tag===i.tag&&s.kind===i.kind&&s.multi===i.multi&&(n=o)}),e[n]=i}),e}function xd(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},r,e;function i(n){n.multi?(t.multi[n.kind].push(n),t.multi.fallback.push(n)):t[n.kind][n.tag]=t.fallback[n.tag]=n}for(r=0,e=arguments.length;r<e;r+=1)arguments[r].forEach(i);return t}function hn(t){return this.extend(t)}hn.prototype.extend=function(r){var e=[],i=[];if(r instanceof W)i.push(r);else if(Array.isArray(r))i=i.concat(r);else if(r&&(Array.isArray(r.implicit)||Array.isArray(r.explicit)))r.implicit&&(e=e.concat(r.implicit)),r.explicit&&(i=i.concat(r.explicit));else throw new Z("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.forEach(function(s){if(!(s instanceof W))throw new Z("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new Z("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new Z("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),i.forEach(function(s){if(!(s instanceof W))throw new Z("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var n=Object.create(hn.prototype);return n.implicit=(this.implicit||[]).concat(e),n.explicit=(this.explicit||[]).concat(i),n.compiledImplicit=Mo(n,"implicit"),n.compiledExplicit=Mo(n,"explicit"),n.compiledTypeMap=xd(n.compiledImplicit,n.compiledExplicit),n};var $d=hn,kd=new W("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),Cd=new W("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),Sd=new W("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),Ed=new $d({explicit:[kd,Cd,Sd]});function Ad(t){if(t===null)return!0;var r=t.length;return r===1&&t==="~"||r===4&&(t==="null"||t==="Null"||t==="NULL")}function Ld(){return null}function Td(t){return t===null}var Pd=new W("tag:yaml.org,2002:null",{kind:"scalar",resolve:Ad,construct:Ld,predicate:Td,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function Rd(t){if(t===null)return!1;var r=t.length;return r===4&&(t==="true"||t==="True"||t==="TRUE")||r===5&&(t==="false"||t==="False"||t==="FALSE")}function Dd(t){return t==="true"||t==="True"||t==="TRUE"}function Hd(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var Id=new W("tag:yaml.org,2002:bool",{kind:"scalar",resolve:Rd,construct:Dd,predicate:Hd,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function Nd(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function Od(t){return 48<=t&&t<=55}function Md(t){return 48<=t&&t<=57}function Fd(t){if(t===null)return!1;var r=t.length,e=0,i=!1,n;if(!r)return!1;if(n=t[e],(n==="-"||n==="+")&&(n=t[++e]),n==="0"){if(e+1===r)return!0;if(n=t[++e],n==="b"){for(e++;e<r;e++)if(n=t[e],n!=="_"){if(n!=="0"&&n!=="1")return!1;i=!0}return i&&n!=="_"}if(n==="x"){for(e++;e<r;e++)if(n=t[e],n!=="_"){if(!Nd(t.charCodeAt(e)))return!1;i=!0}return i&&n!=="_"}if(n==="o"){for(e++;e<r;e++)if(n=t[e],n!=="_"){if(!Od(t.charCodeAt(e)))return!1;i=!0}return i&&n!=="_"}}if(n==="_")return!1;for(;e<r;e++)if(n=t[e],n!=="_"){if(!Md(t.charCodeAt(e)))return!1;i=!0}return!(!i||n==="_")}function jd(t){var r=t,e=1,i;if(r.indexOf("_")!==-1&&(r=r.replace(/_/g,"")),i=r[0],(i==="-"||i==="+")&&(i==="-"&&(e=-1),r=r.slice(1),i=r[0]),r==="0")return 0;if(i==="0"){if(r[1]==="b")return e*parseInt(r.slice(2),2);if(r[1]==="x")return e*parseInt(r.slice(2),16);if(r[1]==="o")return e*parseInt(r.slice(2),8)}return e*parseInt(r,10)}function zd(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!M.isNegativeZero(t)}var qd=new W("tag:yaml.org,2002:int",{kind:"scalar",resolve:Fd,construct:jd,predicate:zd,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Ud=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Wd(t){return!(t===null||!Ud.test(t)||t[t.length-1]==="_")}function Vd(t){var r,e;return r=t.replace(/_/g,"").toLowerCase(),e=r[0]==="-"?-1:1,"+-".indexOf(r[0])>=0&&(r=r.slice(1)),r===".inf"?e===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:r===".nan"?NaN:e*parseFloat(r,10)}var Bd=/^[-+]?[0-9]+e/;function Gd(t,r){var e;if(isNaN(t))switch(r){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(r){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(r){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(M.isNegativeZero(t))return"-0.0";return e=t.toString(10),Bd.test(e)?e.replace("e",".e"):e}function Kd(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||M.isNegativeZero(t))}var Yd=new W("tag:yaml.org,2002:float",{kind:"scalar",resolve:Wd,construct:Vd,predicate:Kd,represent:Gd,defaultStyle:"lowercase"}),Qd=Ed.extend({implicit:[Pd,Id,qd,Yd]}),Jd=Qd,ta=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),ia=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Xd(t){return t===null?!1:ta.exec(t)!==null||ia.exec(t)!==null}function Zd(t){var r,e,i,n,s,o,d,u=0,p=null,h,_,g;if(r=ta.exec(t),r===null&&(r=ia.exec(t)),r===null)throw new Error("Date resolve error");if(e=+r[1],i=+r[2]-1,n=+r[3],!r[4])return new Date(Date.UTC(e,i,n));if(s=+r[4],o=+r[5],d=+r[6],r[7]){for(u=r[7].slice(0,3);u.length<3;)u+="0";u=+u}return r[9]&&(h=+r[10],_=+(r[11]||0),p=(h*60+_)*6e4,r[9]==="-"&&(p=-p)),g=new Date(Date.UTC(e,i,n,s,o,d,u)),p&&g.setTime(g.getTime()-p),g}function ec(t){return t.toISOString()}var tc=new W("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:Xd,construct:Zd,instanceOf:Date,represent:ec});function ic(t){return t==="<<"||t===null}var rc=new W("tag:yaml.org,2002:merge",{kind:"scalar",resolve:ic}),vn=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function nc(t){if(t===null)return!1;var r,e,i=0,n=t.length,s=vn;for(e=0;e<n;e++)if(r=s.indexOf(t.charAt(e)),!(r>64)){if(r<0)return!1;i+=6}return i%8===0}function sc(t){var r,e,i=t.replace(/[\r\n=]/g,""),n=i.length,s=vn,o=0,d=[];for(r=0;r<n;r++)r%4===0&&r&&(d.push(o>>16&255),d.push(o>>8&255),d.push(o&255)),o=o<<6|s.indexOf(i.charAt(r));return e=n%4*6,e===0?(d.push(o>>16&255),d.push(o>>8&255),d.push(o&255)):e===18?(d.push(o>>10&255),d.push(o>>2&255)):e===12&&d.push(o>>4&255),new Uint8Array(d)}function oc(t){var r="",e=0,i,n,s=t.length,o=vn;for(i=0;i<s;i++)i%3===0&&i&&(r+=o[e>>18&63],r+=o[e>>12&63],r+=o[e>>6&63],r+=o[e&63]),e=(e<<8)+t[i];return n=s%3,n===0?(r+=o[e>>18&63],r+=o[e>>12&63],r+=o[e>>6&63],r+=o[e&63]):n===2?(r+=o[e>>10&63],r+=o[e>>4&63],r+=o[e<<2&63],r+=o[64]):n===1&&(r+=o[e>>2&63],r+=o[e<<4&63],r+=o[64],r+=o[64]),r}function ac(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var lc=new W("tag:yaml.org,2002:binary",{kind:"scalar",resolve:nc,construct:sc,predicate:ac,represent:oc}),dc=Object.prototype.hasOwnProperty,cc=Object.prototype.toString;function uc(t){if(t===null)return!0;var r=[],e,i,n,s,o,d=t;for(e=0,i=d.length;e<i;e+=1){if(n=d[e],o=!1,cc.call(n)!=="[object Object]")return!1;for(s in n)if(dc.call(n,s))if(!o)o=!0;else return!1;if(!o)return!1;if(r.indexOf(s)===-1)r.push(s);else return!1}return!0}function pc(t){return t!==null?t:[]}var hc=new W("tag:yaml.org,2002:omap",{kind:"sequence",resolve:uc,construct:pc}),mc=Object.prototype.toString;function _c(t){if(t===null)return!0;var r,e,i,n,s,o=t;for(s=new Array(o.length),r=0,e=o.length;r<e;r+=1){if(i=o[r],mc.call(i)!=="[object Object]"||(n=Object.keys(i),n.length!==1))return!1;s[r]=[n[0],i[n[0]]]}return!0}function fc(t){if(t===null)return[];var r,e,i,n,s,o=t;for(s=new Array(o.length),r=0,e=o.length;r<e;r+=1)i=o[r],n=Object.keys(i),s[r]=[n[0],i[n[0]]];return s}var gc=new W("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:_c,construct:fc}),vc=Object.prototype.hasOwnProperty;function yc(t){if(t===null)return!0;var r,e=t;for(r in e)if(vc.call(e,r)&&e[r]!==null)return!1;return!0}function bc(t){return t!==null?t:{}}var wc=new W("tag:yaml.org,2002:set",{kind:"mapping",resolve:yc,construct:bc}),ra=Jd.extend({implicit:[tc,rc],explicit:[lc,hc,gc,wc]}),je=Object.prototype.hasOwnProperty,dr=1,na=2,sa=3,cr=4,pn=1,xc=2,Fo=3,$c=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,kc=/[\x85\u2028\u2029]/,Cc=/[,\[\]\{\}]/,oa=/^(?:!|!!|![a-z\-]+!)$/i,aa=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function jo(t){return Object.prototype.toString.call(t)}function fe(t){return t===10||t===13}function at(t){return t===9||t===32}function ee(t){return t===9||t===32||t===10||t===13}function Pt(t){return t===44||t===91||t===93||t===123||t===125}function Sc(t){var r;return 48<=t&&t<=57?t-48:(r=t|32,97<=r&&r<=102?r-97+10:-1)}function Ec(t){return t===120?2:t===117?4:t===85?8:0}function Ac(t){return 48<=t&&t<=57?t-48:-1}function zo(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"\x85":t===95?"\xA0":t===76?"\u2028":t===80?"\u2029":""}function Lc(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function la(t,r,e){r==="__proto__"?Object.defineProperty(t,r,{configurable:!0,enumerable:!0,writable:!0,value:e}):t[r]=e}var da=new Array(256),ca=new Array(256);for(ot=0;ot<256;ot++)da[ot]=zo(ot)?1:0,ca[ot]=zo(ot);var ot;function Tc(t,r){this.input=t,this.filename=r.filename||null,this.schema=r.schema||ra,this.onWarning=r.onWarning||null,this.legacy=r.legacy||!1,this.json=r.json||!1,this.listener=r.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function ua(t,r){var e={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return e.snippet=gd(e),new Z(r,e)}function k(t,r){throw ua(t,r)}function ur(t,r){t.onWarning&&t.onWarning.call(null,ua(t,r))}var qo={YAML:function(r,e,i){var n,s,o;r.version!==null&&k(r,"duplication of %YAML directive"),i.length!==1&&k(r,"YAML directive accepts exactly one argument"),n=/^([0-9]+)\.([0-9]+)$/.exec(i[0]),n===null&&k(r,"ill-formed argument of the YAML directive"),s=parseInt(n[1],10),o=parseInt(n[2],10),s!==1&&k(r,"unacceptable YAML version of the document"),r.version=i[0],r.checkLineBreaks=o<2,o!==1&&o!==2&&ur(r,"unsupported YAML version of the document")},TAG:function(r,e,i){var n,s;i.length!==2&&k(r,"TAG directive accepts exactly two arguments"),n=i[0],s=i[1],oa.test(n)||k(r,"ill-formed tag handle (first argument) of the TAG directive"),je.call(r.tagMap,n)&&k(r,'there is a previously declared suffix for "'+n+'" tag handle'),aa.test(s)||k(r,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{k(r,"tag prefix is malformed: "+s)}r.tagMap[n]=s}};function Fe(t,r,e,i){var n,s,o,d;if(r<e){if(d=t.input.slice(r,e),i)for(n=0,s=d.length;n<s;n+=1)o=d.charCodeAt(n),o===9||32<=o&&o<=1114111||k(t,"expected valid JSON character");else $c.test(d)&&k(t,"the stream contains non-printable characters");t.result+=d}}function Uo(t,r,e,i){var n,s,o,d;for(M.isObject(e)||k(t,"cannot merge mappings; the provided source object is unacceptable"),n=Object.keys(e),o=0,d=n.length;o<d;o+=1)s=n[o],je.call(r,s)||(la(r,s,e[s]),i[s]=!0)}function Rt(t,r,e,i,n,s,o,d,u){var p,h;if(Array.isArray(n))for(n=Array.prototype.slice.call(n),p=0,h=n.length;p<h;p+=1)Array.isArray(n[p])&&k(t,"nested arrays are not supported inside keys"),typeof n=="object"&&jo(n[p])==="[object Object]"&&(n[p]="[object Object]");if(typeof n=="object"&&jo(n)==="[object Object]"&&(n="[object Object]"),n=String(n),r===null&&(r={}),i==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(p=0,h=s.length;p<h;p+=1)Uo(t,r,s[p],e);else Uo(t,r,s,e);else!t.json&&!je.call(e,n)&&je.call(r,n)&&(t.line=o||t.line,t.lineStart=d||t.lineStart,t.position=u||t.position,k(t,"duplicated mapping key")),la(r,n,s),delete e[n];return r}function yn(t){var r;r=t.input.charCodeAt(t.position),r===10?t.position++:r===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):k(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function O(t,r,e){for(var i=0,n=t.input.charCodeAt(t.position);n!==0;){for(;at(n);)n===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),n=t.input.charCodeAt(++t.position);if(r&&n===35)do n=t.input.charCodeAt(++t.position);while(n!==10&&n!==13&&n!==0);if(fe(n))for(yn(t),n=t.input.charCodeAt(t.position),i++,t.lineIndent=0;n===32;)t.lineIndent++,n=t.input.charCodeAt(++t.position);else break}return e!==-1&&i!==0&&t.lineIndent<e&&ur(t,"deficient indentation"),i}function mr(t){var r=t.position,e;return e=t.input.charCodeAt(r),!!((e===45||e===46)&&e===t.input.charCodeAt(r+1)&&e===t.input.charCodeAt(r+2)&&(r+=3,e=t.input.charCodeAt(r),e===0||ee(e)))}function bn(t,r){r===1?t.result+=" ":r>1&&(t.result+=M.repeat(`
`,r-1))}function Pc(t,r,e){var i,n,s,o,d,u,p,h,_=t.kind,g=t.result,v;if(v=t.input.charCodeAt(t.position),ee(v)||Pt(v)||v===35||v===38||v===42||v===33||v===124||v===62||v===39||v===34||v===37||v===64||v===96||(v===63||v===45)&&(n=t.input.charCodeAt(t.position+1),ee(n)||e&&Pt(n)))return!1;for(t.kind="scalar",t.result="",s=o=t.position,d=!1;v!==0;){if(v===58){if(n=t.input.charCodeAt(t.position+1),ee(n)||e&&Pt(n))break}else if(v===35){if(i=t.input.charCodeAt(t.position-1),ee(i))break}else{if(t.position===t.lineStart&&mr(t)||e&&Pt(v))break;if(fe(v))if(u=t.line,p=t.lineStart,h=t.lineIndent,O(t,!1,-1),t.lineIndent>=r){d=!0,v=t.input.charCodeAt(t.position);continue}else{t.position=o,t.line=u,t.lineStart=p,t.lineIndent=h;break}}d&&(Fe(t,s,o,!1),bn(t,t.line-u),s=o=t.position,d=!1),at(v)||(o=t.position+1),v=t.input.charCodeAt(++t.position)}return Fe(t,s,o,!1),t.result?!0:(t.kind=_,t.result=g,!1)}function Rc(t,r){var e,i,n;if(e=t.input.charCodeAt(t.position),e!==39)return!1;for(t.kind="scalar",t.result="",t.position++,i=n=t.position;(e=t.input.charCodeAt(t.position))!==0;)if(e===39)if(Fe(t,i,t.position,!0),e=t.input.charCodeAt(++t.position),e===39)i=t.position,t.position++,n=t.position;else return!0;else fe(e)?(Fe(t,i,n,!0),bn(t,O(t,!1,r)),i=n=t.position):t.position===t.lineStart&&mr(t)?k(t,"unexpected end of the document within a single quoted scalar"):(t.position++,n=t.position);k(t,"unexpected end of the stream within a single quoted scalar")}function Dc(t,r){var e,i,n,s,o,d;if(d=t.input.charCodeAt(t.position),d!==34)return!1;for(t.kind="scalar",t.result="",t.position++,e=i=t.position;(d=t.input.charCodeAt(t.position))!==0;){if(d===34)return Fe(t,e,t.position,!0),t.position++,!0;if(d===92){if(Fe(t,e,t.position,!0),d=t.input.charCodeAt(++t.position),fe(d))O(t,!1,r);else if(d<256&&da[d])t.result+=ca[d],t.position++;else if((o=Ec(d))>0){for(n=o,s=0;n>0;n--)d=t.input.charCodeAt(++t.position),(o=Sc(d))>=0?s=(s<<4)+o:k(t,"expected hexadecimal character");t.result+=Lc(s),t.position++}else k(t,"unknown escape sequence");e=i=t.position}else fe(d)?(Fe(t,e,i,!0),bn(t,O(t,!1,r)),e=i=t.position):t.position===t.lineStart&&mr(t)?k(t,"unexpected end of the document within a double quoted scalar"):(t.position++,i=t.position)}k(t,"unexpected end of the stream within a double quoted scalar")}function Hc(t,r){var e=!0,i,n,s,o=t.tag,d,u=t.anchor,p,h,_,g,v,x=Object.create(null),C,P,Q,L;if(L=t.input.charCodeAt(t.position),L===91)h=93,v=!1,d=[];else if(L===123)h=125,v=!0,d={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=d),L=t.input.charCodeAt(++t.position);L!==0;){if(O(t,!0,r),L=t.input.charCodeAt(t.position),L===h)return t.position++,t.tag=o,t.anchor=u,t.kind=v?"mapping":"sequence",t.result=d,!0;e?L===44&&k(t,"expected the node content, but found ','"):k(t,"missed comma between flow collection entries"),P=C=Q=null,_=g=!1,L===63&&(p=t.input.charCodeAt(t.position+1),ee(p)&&(_=g=!0,t.position++,O(t,!0,r))),i=t.line,n=t.lineStart,s=t.position,Dt(t,r,dr,!1,!0),P=t.tag,C=t.result,O(t,!0,r),L=t.input.charCodeAt(t.position),(g||t.line===i)&&L===58&&(_=!0,L=t.input.charCodeAt(++t.position),O(t,!0,r),Dt(t,r,dr,!1,!0),Q=t.result),v?Rt(t,d,x,P,C,Q,i,n,s):_?d.push(Rt(t,null,x,P,C,Q,i,n,s)):d.push(C),O(t,!0,r),L=t.input.charCodeAt(t.position),L===44?(e=!0,L=t.input.charCodeAt(++t.position)):e=!1}k(t,"unexpected end of the stream within a flow collection")}function Ic(t,r){var e,i,n=pn,s=!1,o=!1,d=r,u=0,p=!1,h,_;if(_=t.input.charCodeAt(t.position),_===124)i=!1;else if(_===62)i=!0;else return!1;for(t.kind="scalar",t.result="";_!==0;)if(_=t.input.charCodeAt(++t.position),_===43||_===45)pn===n?n=_===43?Fo:xc:k(t,"repeat of a chomping mode identifier");else if((h=Ac(_))>=0)h===0?k(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):o?k(t,"repeat of an indentation width identifier"):(d=r+h-1,o=!0);else break;if(at(_)){do _=t.input.charCodeAt(++t.position);while(at(_));if(_===35)do _=t.input.charCodeAt(++t.position);while(!fe(_)&&_!==0)}for(;_!==0;){for(yn(t),t.lineIndent=0,_=t.input.charCodeAt(t.position);(!o||t.lineIndent<d)&&_===32;)t.lineIndent++,_=t.input.charCodeAt(++t.position);if(!o&&t.lineIndent>d&&(d=t.lineIndent),fe(_)){u++;continue}if(t.lineIndent<d){n===Fo?t.result+=M.repeat(`
`,s?1+u:u):n===pn&&s&&(t.result+=`
`);break}for(i?at(_)?(p=!0,t.result+=M.repeat(`
`,s?1+u:u)):p?(p=!1,t.result+=M.repeat(`
`,u+1)):u===0?s&&(t.result+=" "):t.result+=M.repeat(`
`,u):t.result+=M.repeat(`
`,s?1+u:u),s=!0,o=!0,u=0,e=t.position;!fe(_)&&_!==0;)_=t.input.charCodeAt(++t.position);Fe(t,e,t.position,!1)}return!0}function Wo(t,r){var e,i=t.tag,n=t.anchor,s=[],o,d=!1,u;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=s),u=t.input.charCodeAt(t.position);u!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,k(t,"tab characters must not be used in indentation")),!(u!==45||(o=t.input.charCodeAt(t.position+1),!ee(o))));){if(d=!0,t.position++,O(t,!0,-1)&&t.lineIndent<=r){s.push(null),u=t.input.charCodeAt(t.position);continue}if(e=t.line,Dt(t,r,sa,!1,!0),s.push(t.result),O(t,!0,-1),u=t.input.charCodeAt(t.position),(t.line===e||t.lineIndent>r)&&u!==0)k(t,"bad indentation of a sequence entry");else if(t.lineIndent<r)break}return d?(t.tag=i,t.anchor=n,t.kind="sequence",t.result=s,!0):!1}function Nc(t,r,e){var i,n,s,o,d,u,p=t.tag,h=t.anchor,_={},g=Object.create(null),v=null,x=null,C=null,P=!1,Q=!1,L;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=_),L=t.input.charCodeAt(t.position);L!==0;){if(!P&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,k(t,"tab characters must not be used in indentation")),i=t.input.charCodeAt(t.position+1),s=t.line,(L===63||L===58)&&ee(i))L===63?(P&&(Rt(t,_,g,v,x,null,o,d,u),v=x=C=null),Q=!0,P=!0,n=!0):P?(P=!1,n=!0):k(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,L=i;else{if(o=t.line,d=t.lineStart,u=t.position,!Dt(t,e,na,!1,!0))break;if(t.line===s){for(L=t.input.charCodeAt(t.position);at(L);)L=t.input.charCodeAt(++t.position);if(L===58)L=t.input.charCodeAt(++t.position),ee(L)||k(t,"a whitespace character is expected after the key-value separator within a block mapping"),P&&(Rt(t,_,g,v,x,null,o,d,u),v=x=C=null),Q=!0,P=!1,n=!1,v=t.tag,x=t.result;else if(Q)k(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=p,t.anchor=h,!0}else if(Q)k(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=p,t.anchor=h,!0}if((t.line===s||t.lineIndent>r)&&(P&&(o=t.line,d=t.lineStart,u=t.position),Dt(t,r,cr,!0,n)&&(P?x=t.result:C=t.result),P||(Rt(t,_,g,v,x,C,o,d,u),v=x=C=null),O(t,!0,-1),L=t.input.charCodeAt(t.position)),(t.line===s||t.lineIndent>r)&&L!==0)k(t,"bad indentation of a mapping entry");else if(t.lineIndent<r)break}return P&&Rt(t,_,g,v,x,null,o,d,u),Q&&(t.tag=p,t.anchor=h,t.kind="mapping",t.result=_),Q}function Oc(t){var r,e=!1,i=!1,n,s,o;if(o=t.input.charCodeAt(t.position),o!==33)return!1;if(t.tag!==null&&k(t,"duplication of a tag property"),o=t.input.charCodeAt(++t.position),o===60?(e=!0,o=t.input.charCodeAt(++t.position)):o===33?(i=!0,n="!!",o=t.input.charCodeAt(++t.position)):n="!",r=t.position,e){do o=t.input.charCodeAt(++t.position);while(o!==0&&o!==62);t.position<t.length?(s=t.input.slice(r,t.position),o=t.input.charCodeAt(++t.position)):k(t,"unexpected end of the stream within a verbatim tag")}else{for(;o!==0&&!ee(o);)o===33&&(i?k(t,"tag suffix cannot contain exclamation marks"):(n=t.input.slice(r-1,t.position+1),oa.test(n)||k(t,"named tag handle cannot contain such characters"),i=!0,r=t.position+1)),o=t.input.charCodeAt(++t.position);s=t.input.slice(r,t.position),Cc.test(s)&&k(t,"tag suffix cannot contain flow indicator characters")}s&&!aa.test(s)&&k(t,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{k(t,"tag name is malformed: "+s)}return e?t.tag=s:je.call(t.tagMap,n)?t.tag=t.tagMap[n]+s:n==="!"?t.tag="!"+s:n==="!!"?t.tag="tag:yaml.org,2002:"+s:k(t,'undeclared tag handle "'+n+'"'),!0}function Mc(t){var r,e;if(e=t.input.charCodeAt(t.position),e!==38)return!1;for(t.anchor!==null&&k(t,"duplication of an anchor property"),e=t.input.charCodeAt(++t.position),r=t.position;e!==0&&!ee(e)&&!Pt(e);)e=t.input.charCodeAt(++t.position);return t.position===r&&k(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(r,t.position),!0}function Fc(t){var r,e,i;if(i=t.input.charCodeAt(t.position),i!==42)return!1;for(i=t.input.charCodeAt(++t.position),r=t.position;i!==0&&!ee(i)&&!Pt(i);)i=t.input.charCodeAt(++t.position);return t.position===r&&k(t,"name of an alias node must contain at least one character"),e=t.input.slice(r,t.position),je.call(t.anchorMap,e)||k(t,'unidentified alias "'+e+'"'),t.result=t.anchorMap[e],O(t,!0,-1),!0}function Dt(t,r,e,i,n){var s,o,d,u=1,p=!1,h=!1,_,g,v,x,C,P;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,s=o=d=cr===e||sa===e,i&&O(t,!0,-1)&&(p=!0,t.lineIndent>r?u=1:t.lineIndent===r?u=0:t.lineIndent<r&&(u=-1)),u===1)for(;Oc(t)||Mc(t);)O(t,!0,-1)?(p=!0,d=s,t.lineIndent>r?u=1:t.lineIndent===r?u=0:t.lineIndent<r&&(u=-1)):d=!1;if(d&&(d=p||n),(u===1||cr===e)&&(dr===e||na===e?C=r:C=r+1,P=t.position-t.lineStart,u===1?d&&(Wo(t,P)||Nc(t,P,C))||Hc(t,C)?h=!0:(o&&Ic(t,C)||Rc(t,C)||Dc(t,C)?h=!0:Fc(t)?(h=!0,(t.tag!==null||t.anchor!==null)&&k(t,"alias node should not have any properties")):Pc(t,C,dr===e)&&(h=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):u===0&&(h=d&&Wo(t,P))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&k(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),_=0,g=t.implicitTypes.length;_<g;_+=1)if(x=t.implicitTypes[_],x.resolve(t.result)){t.result=x.construct(t.result),t.tag=x.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(je.call(t.typeMap[t.kind||"fallback"],t.tag))x=t.typeMap[t.kind||"fallback"][t.tag];else for(x=null,v=t.typeMap.multi[t.kind||"fallback"],_=0,g=v.length;_<g;_+=1)if(t.tag.slice(0,v[_].tag.length)===v[_].tag){x=v[_];break}x||k(t,"unknown tag !<"+t.tag+">"),t.result!==null&&x.kind!==t.kind&&k(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+x.kind+'", not "'+t.kind+'"'),x.resolve(t.result,t.tag)?(t.result=x.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):k(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||h}function jc(t){var r=t.position,e,i,n,s=!1,o;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(o=t.input.charCodeAt(t.position))!==0&&(O(t,!0,-1),o=t.input.charCodeAt(t.position),!(t.lineIndent>0||o!==37));){for(s=!0,o=t.input.charCodeAt(++t.position),e=t.position;o!==0&&!ee(o);)o=t.input.charCodeAt(++t.position);for(i=t.input.slice(e,t.position),n=[],i.length<1&&k(t,"directive name must not be less than one character in length");o!==0;){for(;at(o);)o=t.input.charCodeAt(++t.position);if(o===35){do o=t.input.charCodeAt(++t.position);while(o!==0&&!fe(o));break}if(fe(o))break;for(e=t.position;o!==0&&!ee(o);)o=t.input.charCodeAt(++t.position);n.push(t.input.slice(e,t.position))}o!==0&&yn(t),je.call(qo,i)?qo[i](t,i,n):ur(t,'unknown document directive "'+i+'"')}if(O(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,O(t,!0,-1)):s&&k(t,"directives end mark is expected"),Dt(t,t.lineIndent-1,cr,!1,!0),O(t,!0,-1),t.checkLineBreaks&&kc.test(t.input.slice(r,t.position))&&ur(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&mr(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,O(t,!0,-1));return}if(t.position<t.length-1)k(t,"end of the stream or a document separator is expected");else return}function pa(t,r){t=String(t),r=r||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var e=new Tc(t,r),i=t.indexOf("\0");for(i!==-1&&(e.position=i,k(e,"null byte is not allowed in input")),e.input+="\0";e.input.charCodeAt(e.position)===32;)e.lineIndent+=1,e.position+=1;for(;e.position<e.length-1;)jc(e);return e.documents}function zc(t,r,e){r!==null&&typeof r=="object"&&typeof e>"u"&&(e=r,r=null);var i=pa(t,e);if(typeof r!="function")return i;for(var n=0,s=i.length;n<s;n+=1)r(i[n])}function qc(t,r){var e=pa(t,r);if(e.length!==0){if(e.length===1)return e[0];throw new Z("expected a single document in the stream, but found more")}}var Uc=zc,Wc=qc,ha={loadAll:Uc,load:Wc},ma=Object.prototype.toString,_a=Object.prototype.hasOwnProperty,wn=65279,Vc=9,si=10,Bc=13,Gc=32,Kc=33,Yc=34,mn=35,Qc=37,Jc=38,Xc=39,Zc=42,fa=44,eu=45,pr=58,tu=61,iu=62,ru=63,nu=64,ga=91,va=93,su=96,ya=123,ou=124,ba=125,V={};V[0]="\\0";V[7]="\\a";V[8]="\\b";V[9]="\\t";V[10]="\\n";V[11]="\\v";V[12]="\\f";V[13]="\\r";V[27]="\\e";V[34]='\\"';V[92]="\\\\";V[133]="\\N";V[160]="\\_";V[8232]="\\L";V[8233]="\\P";var au=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],lu=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function du(t,r){var e,i,n,s,o,d,u;if(r===null)return{};for(e={},i=Object.keys(r),n=0,s=i.length;n<s;n+=1)o=i[n],d=String(r[o]),o.slice(0,2)==="!!"&&(o="tag:yaml.org,2002:"+o.slice(2)),u=t.compiledTypeMap.fallback[o],u&&_a.call(u.styleAliases,d)&&(d=u.styleAliases[d]),e[o]=d;return e}function cu(t){var r,e,i;if(r=t.toString(16).toUpperCase(),t<=255)e="x",i=2;else if(t<=65535)e="u",i=4;else if(t<=4294967295)e="U",i=8;else throw new Z("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+e+M.repeat("0",i-r.length)+r}var uu=1,oi=2;function pu(t){this.schema=t.schema||ra,this.indent=Math.max(1,t.indent||2),this.noArrayIndent=t.noArrayIndent||!1,this.skipInvalid=t.skipInvalid||!1,this.flowLevel=M.isNothing(t.flowLevel)?-1:t.flowLevel,this.styleMap=du(this.schema,t.styles||null),this.sortKeys=t.sortKeys||!1,this.lineWidth=t.lineWidth||80,this.noRefs=t.noRefs||!1,this.noCompatMode=t.noCompatMode||!1,this.condenseFlow=t.condenseFlow||!1,this.quotingType=t.quotingType==='"'?oi:uu,this.forceQuotes=t.forceQuotes||!1,this.replacer=typeof t.replacer=="function"?t.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Vo(t,r){for(var e=M.repeat(" ",r),i=0,n=-1,s="",o,d=t.length;i<d;)n=t.indexOf(`
`,i),n===-1?(o=t.slice(i),i=d):(o=t.slice(i,n+1),i=n+1),o.length&&o!==`
`&&(s+=e),s+=o;return s}function _n(t,r){return`
`+M.repeat(" ",t.indent*r)}function hu(t,r){var e,i,n;for(e=0,i=t.implicitTypes.length;e<i;e+=1)if(n=t.implicitTypes[e],n.resolve(r))return!0;return!1}function hr(t){return t===Gc||t===Vc}function ai(t){return 32<=t&&t<=126||161<=t&&t<=55295&&t!==8232&&t!==8233||57344<=t&&t<=65533&&t!==wn||65536<=t&&t<=1114111}function Bo(t){return ai(t)&&t!==wn&&t!==Bc&&t!==si}function Go(t,r,e){var i=Bo(t),n=i&&!hr(t);return(e?i:i&&t!==fa&&t!==ga&&t!==va&&t!==ya&&t!==ba)&&t!==mn&&!(r===pr&&!n)||Bo(r)&&!hr(r)&&t===mn||r===pr&&n}function mu(t){return ai(t)&&t!==wn&&!hr(t)&&t!==eu&&t!==ru&&t!==pr&&t!==fa&&t!==ga&&t!==va&&t!==ya&&t!==ba&&t!==mn&&t!==Jc&&t!==Zc&&t!==Kc&&t!==ou&&t!==tu&&t!==iu&&t!==Xc&&t!==Yc&&t!==Qc&&t!==nu&&t!==su}function _u(t){return!hr(t)&&t!==pr}function ri(t,r){var e=t.charCodeAt(r),i;return e>=55296&&e<=56319&&r+1<t.length&&(i=t.charCodeAt(r+1),i>=56320&&i<=57343)?(e-55296)*1024+i-56320+65536:e}function wa(t){var r=/^\n* /;return r.test(t)}var xa=1,fn=2,$a=3,ka=4,Tt=5;function fu(t,r,e,i,n,s,o,d){var u,p=0,h=null,_=!1,g=!1,v=i!==-1,x=-1,C=mu(ri(t,0))&&_u(ri(t,t.length-1));if(r||o)for(u=0;u<t.length;p>=65536?u+=2:u++){if(p=ri(t,u),!ai(p))return Tt;C=C&&Go(p,h,d),h=p}else{for(u=0;u<t.length;p>=65536?u+=2:u++){if(p=ri(t,u),p===si)_=!0,v&&(g=g||u-x-1>i&&t[x+1]!==" ",x=u);else if(!ai(p))return Tt;C=C&&Go(p,h,d),h=p}g=g||v&&u-x-1>i&&t[x+1]!==" "}return!_&&!g?C&&!o&&!n(t)?xa:s===oi?Tt:fn:e>9&&wa(t)?Tt:o?s===oi?Tt:fn:g?ka:$a}function gu(t,r,e,i,n){t.dump=(function(){if(r.length===0)return t.quotingType===oi?'""':"''";if(!t.noCompatMode&&(au.indexOf(r)!==-1||lu.test(r)))return t.quotingType===oi?'"'+r+'"':"'"+r+"'";var s=t.indent*Math.max(1,e),o=t.lineWidth===-1?-1:Math.max(Math.min(t.lineWidth,40),t.lineWidth-s),d=i||t.flowLevel>-1&&e>=t.flowLevel;function u(p){return hu(t,p)}switch(fu(r,d,t.indent,o,u,t.quotingType,t.forceQuotes&&!i,n)){case xa:return r;case fn:return"'"+r.replace(/'/g,"''")+"'";case $a:return"|"+Ko(r,t.indent)+Yo(Vo(r,s));case ka:return">"+Ko(r,t.indent)+Yo(Vo(vu(r,o),s));case Tt:return'"'+yu(r)+'"';default:throw new Z("impossible error: invalid scalar style")}})()}function Ko(t,r){var e=wa(t)?String(r):"",i=t[t.length-1]===`
`,n=i&&(t[t.length-2]===`
`||t===`
`),s=n?"+":i?"":"-";return e+s+`
`}function Yo(t){return t[t.length-1]===`
`?t.slice(0,-1):t}function vu(t,r){for(var e=/(\n+)([^\n]*)/g,i=(function(){var p=t.indexOf(`
`);return p=p!==-1?p:t.length,e.lastIndex=p,Qo(t.slice(0,p),r)})(),n=t[0]===`
`||t[0]===" ",s,o;o=e.exec(t);){var d=o[1],u=o[2];s=u[0]===" ",i+=d+(!n&&!s&&u!==""?`
`:"")+Qo(u,r),n=s}return i}function Qo(t,r){if(t===""||t[0]===" ")return t;for(var e=/ [^ ]/g,i,n=0,s,o=0,d=0,u="";i=e.exec(t);)d=i.index,d-n>r&&(s=o>n?o:d,u+=`
`+t.slice(n,s),n=s+1),o=d;return u+=`
`,t.length-n>r&&o>n?u+=t.slice(n,o)+`
`+t.slice(o+1):u+=t.slice(n),u.slice(1)}function yu(t){for(var r="",e=0,i,n=0;n<t.length;e>=65536?n+=2:n++)e=ri(t,n),i=V[e],!i&&ai(e)?(r+=t[n],e>=65536&&(r+=t[n+1])):r+=i||cu(e);return r}function bu(t,r,e){var i="",n=t.tag,s,o,d;for(s=0,o=e.length;s<o;s+=1)d=e[s],t.replacer&&(d=t.replacer.call(e,String(s),d)),(Le(t,r,d,!1,!1)||typeof d>"u"&&Le(t,r,null,!1,!1))&&(i!==""&&(i+=","+(t.condenseFlow?"":" ")),i+=t.dump);t.tag=n,t.dump="["+i+"]"}function Jo(t,r,e,i){var n="",s=t.tag,o,d,u;for(o=0,d=e.length;o<d;o+=1)u=e[o],t.replacer&&(u=t.replacer.call(e,String(o),u)),(Le(t,r+1,u,!0,!0,!1,!0)||typeof u>"u"&&Le(t,r+1,null,!0,!0,!1,!0))&&((!i||n!=="")&&(n+=_n(t,r)),t.dump&&si===t.dump.charCodeAt(0)?n+="-":n+="- ",n+=t.dump);t.tag=s,t.dump=n||"[]"}function wu(t,r,e){var i="",n=t.tag,s=Object.keys(e),o,d,u,p,h;for(o=0,d=s.length;o<d;o+=1)h="",i!==""&&(h+=", "),t.condenseFlow&&(h+='"'),u=s[o],p=e[u],t.replacer&&(p=t.replacer.call(e,u,p)),Le(t,r,u,!1,!1)&&(t.dump.length>1024&&(h+="? "),h+=t.dump+(t.condenseFlow?'"':"")+":"+(t.condenseFlow?"":" "),Le(t,r,p,!1,!1)&&(h+=t.dump,i+=h));t.tag=n,t.dump="{"+i+"}"}function xu(t,r,e,i){var n="",s=t.tag,o=Object.keys(e),d,u,p,h,_,g;if(t.sortKeys===!0)o.sort();else if(typeof t.sortKeys=="function")o.sort(t.sortKeys);else if(t.sortKeys)throw new Z("sortKeys must be a boolean or a function");for(d=0,u=o.length;d<u;d+=1)g="",(!i||n!=="")&&(g+=_n(t,r)),p=o[d],h=e[p],t.replacer&&(h=t.replacer.call(e,p,h)),Le(t,r+1,p,!0,!0,!0)&&(_=t.tag!==null&&t.tag!=="?"||t.dump&&t.dump.length>1024,_&&(t.dump&&si===t.dump.charCodeAt(0)?g+="?":g+="? "),g+=t.dump,_&&(g+=_n(t,r)),Le(t,r+1,h,!0,_)&&(t.dump&&si===t.dump.charCodeAt(0)?g+=":":g+=": ",g+=t.dump,n+=g));t.tag=s,t.dump=n||"{}"}function Xo(t,r,e){var i,n,s,o,d,u;for(n=e?t.explicitTypes:t.implicitTypes,s=0,o=n.length;s<o;s+=1)if(d=n[s],(d.instanceOf||d.predicate)&&(!d.instanceOf||typeof r=="object"&&r instanceof d.instanceOf)&&(!d.predicate||d.predicate(r))){if(e?d.multi&&d.representName?t.tag=d.representName(r):t.tag=d.tag:t.tag="?",d.represent){if(u=t.styleMap[d.tag]||d.defaultStyle,ma.call(d.represent)==="[object Function]")i=d.represent(r,u);else if(_a.call(d.represent,u))i=d.represent[u](r,u);else throw new Z("!<"+d.tag+'> tag resolver accepts not "'+u+'" style');t.dump=i}return!0}return!1}function Le(t,r,e,i,n,s,o){t.tag=null,t.dump=e,Xo(t,e,!1)||Xo(t,e,!0);var d=ma.call(t.dump),u=i,p;i&&(i=t.flowLevel<0||t.flowLevel>r);var h=d==="[object Object]"||d==="[object Array]",_,g;if(h&&(_=t.duplicates.indexOf(e),g=_!==-1),(t.tag!==null&&t.tag!=="?"||g||t.indent!==2&&r>0)&&(n=!1),g&&t.usedDuplicates[_])t.dump="*ref_"+_;else{if(h&&g&&!t.usedDuplicates[_]&&(t.usedDuplicates[_]=!0),d==="[object Object]")i&&Object.keys(t.dump).length!==0?(xu(t,r,t.dump,n),g&&(t.dump="&ref_"+_+t.dump)):(wu(t,r,t.dump),g&&(t.dump="&ref_"+_+" "+t.dump));else if(d==="[object Array]")i&&t.dump.length!==0?(t.noArrayIndent&&!o&&r>0?Jo(t,r-1,t.dump,n):Jo(t,r,t.dump,n),g&&(t.dump="&ref_"+_+t.dump)):(bu(t,r,t.dump),g&&(t.dump="&ref_"+_+" "+t.dump));else if(d==="[object String]")t.tag!=="?"&&gu(t,t.dump,r,s,u);else{if(d==="[object Undefined]")return!1;if(t.skipInvalid)return!1;throw new Z("unacceptable kind of an object to dump "+d)}t.tag!==null&&t.tag!=="?"&&(p=encodeURI(t.tag[0]==="!"?t.tag.slice(1):t.tag).replace(/!/g,"%21"),t.tag[0]==="!"?p="!"+p:p.slice(0,18)==="tag:yaml.org,2002:"?p="!!"+p.slice(18):p="!<"+p+">",t.dump=p+" "+t.dump)}return!0}function $u(t,r){var e=[],i=[],n,s;for(gn(t,e,i),n=0,s=i.length;n<s;n+=1)r.duplicates.push(e[i[n]]);r.usedDuplicates=new Array(s)}function gn(t,r,e){var i,n,s;if(t!==null&&typeof t=="object")if(n=r.indexOf(t),n!==-1)e.indexOf(n)===-1&&e.push(n);else if(r.push(t),Array.isArray(t))for(n=0,s=t.length;n<s;n+=1)gn(t[n],r,e);else for(i=Object.keys(t),n=0,s=i.length;n<s;n+=1)gn(t[i[n]],r,e)}function ku(t,r){r=r||{};var e=new pu(r);e.noRefs||$u(t,e);var i=t;return e.replacer&&(i=e.replacer.call({"":i},"",i)),Le(e,0,i,!0,!0)?e.dump+`
`:""}var Cu=ku,Su={dump:Cu};function xn(t,r){return function(){throw new Error("Function yaml."+t+" is removed in js-yaml 4. Use yaml."+r+" instead, which is now safe by default.")}}var _r=ha.load,K_=ha.loadAll,fr=Su.dump;var Y_=xn("safeLoad","load"),Q_=xn("safeLoadAll","loadAll"),J_=xn("safeDump","dump");var Eu={light:"mdi:lightbulb",switch:"mdi:toggle-switch-variant",binary_sensor:"mdi:motion-sensor",sensor:"mdi:eye",person:"mdi:account",device_tracker:"mdi:account",climate:"mdi:thermostat",cover:"mdi:window-shutter",media_player:"mdi:cast",lock:"mdi:lock",fan:"mdi:fan",weather:"mdi:weather-partly-cloudy",input_boolean:"mdi:toggle-switch",event:"mdi:eye-check",script:"mdi:script-text",template:"mdi:code-braces"},$n="mdi:eye";function ze(t,r){let e=t?.states?.[r]?.attributes?.friendly_name;return typeof e=="string"&&e?e:r}function Au(t,r){let e=t?.states?.[r]?.attributes?.icon;if(typeof e=="string"&&e)return e;let i=r.split(".")[0];return Eu[i]??$n}function li(t,r){let e=t?.states?.[r];return e&&customElements.get("ha-state-icon")?l`<ha-state-icon class="row-icon" .hass=${t} .stateObj=${e}></ha-state-icon>`:l`<ha-icon class="row-icon" icon=${Au(t,r)}></ha-icon>`}var Ca=y`
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
`;var ge=class extends b{constructor(){super(...arguments);this.value=null;this._mode="form";this._yamlText="";this._yamlError=null;this._computeFieldLabel=e=>sn(this.hass,this._picked??"",e.name);this._computeFieldHelper=e=>{let n=this._currentFields()?.[e.name]?.description;return typeof n=="string"?n:""}}willUpdate(e){super.willUpdate?.(e),e.has("value")&&this._mode==="form"&&(this._yamlText=fr(this.value??{}))}connectedCallback(){super.connectedCallback(),this._yamlText=fr(this.value??{})}_setMode(e){e==="form"&&this._yamlError!==null||(e==="yaml"&&(this._yamlText=fr(this.value??{})),this._mode=e)}_onYamlInput(e){this._yamlText=e;let i;try{i=_r(e)}catch(u){this._yamlError=u.message;return}if(i==null){this._yamlError=null,this._emit(null);return}if(typeof i!="object"||Array.isArray(i)){this._yamlError=a(this.hass,"ui.yaml_expect_object","Expected an object");return}let n=i,s=n.script;if(typeof s!="string"||!s.startsWith("script.")){this._yamlError=a(this.hass,"ui.yaml_script_string","`script` must be a 'script.<name>' string");return}let o=n.args;if(o!==void 0&&(typeof o!="object"||Array.isArray(o)||o===null)){this._yamlError=a(this.hass,"ui.yaml_args_object","`args` must be an object if present");return}let d=n.triggers;if(d!==void 0&&(!Array.isArray(d)||!d.every(u=>typeof u=="string"))){this._yamlError=a(this.hass,"ui.yaml_triggers_list","`triggers` must be a list of entity_id strings if present");return}this._yamlError=null,this._emit({script:s,args:o??{},triggers:d})}_emit(e){this.value=e,A(this,this.value)}_scriptIds(){let e=this.hass?.services;return Object.keys(e?.script??{}).sort().map(n=>`script.${n}`)}_label(e){return ze(this.hass,e)}_fieldsFor(e){if(!e)return;let i=e.replace(/^script\./,"");return this.hass?.services?.script?.[i]?.fields}get _picked(){return this.value&&typeof this.value=="object"?this.value.script:null}_currentFields(){return this._fieldsFor(this._picked)}_defaultArgs(e){let i=this._fieldsFor(e)??{},n={};for(let[s,o]of Object.entries(i))o&&Object.hasOwn(o,"default")&&(n[s]=o.default);return n}_pickerSchema(){return[{name:"script",selector:{select:{mode:"dropdown",options:this._scriptIds().map(e=>({value:e,label:this._label(e)}))}}}]}_pickScript(e){if(!e){this._emit(null);return}this._emit({script:e,args:this._defaultArgs(e)})}_argsSchema(){let e=this._currentFields();return e?Object.entries(e).map(([i,n])=>({name:i,required:n.required,selector:n.selector??{text:{}}})):[]}_updateArgs(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:e,triggers:this.value.triggers})}get _triggers(){return this.value&&typeof this.value=="object"&&this.value.triggers||[]}_setTriggers(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:this.value.args,triggers:e})}_removeTrigger(e){this._setTriggers(this._triggers.filter(i=>i!==e))}_addTrigger(e){this._triggers.includes(e)||this._setTriggers([...this._triggers,e])}render(){let e=this._picked,i=this._argsSchema(),n=(this.value&&typeof this.value=="object"?this.value.args:{})??{},s=i.length>0;return l`
      <div class="section">
        <h4>${a(this.hass,"ui.script","Script")}</h4>
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
          >${a(this.hass,"ui.form","Form")}</button>
          <button
            type="button"
            class=${this._mode==="yaml"?"active":""}
            @click=${()=>this._setMode("yaml")}
          >${a(this.hass,"ui.yaml","YAML")}</button>
        </div>
      `:""}
      ${e&&this._mode==="form"&&s?l`
        <div class="section args">
          <h4>${a(this.hass,"ui.arguments","Arguments")}</h4>
          ${this._renderArgs(i,n)}
        </div>
      `:""}
      ${e&&this._mode==="form"?this._renderTriggers():""}
      ${e&&this._mode==="yaml"?this._renderYaml():""}
    `}_renderTriggers(){let e=this._triggers;return l`
      <div class="section triggers">
        <h4>${a(this.hass,"ui.script_triggers","Triggers")}</h4>
        <p class="help">
          ${a(this.hass,"ui.script_triggers_help","Re-evaluate this scene when these entities change. A script is opaque, so templated references may be missed \u2014 add any it depends on.")}
        </p>
        ${this._renderTriggerPicker(e)}
      </div>
    `}_renderTriggerPicker(e){if(customElements.get("ha-form")){let i=[{name:"triggers",selector:{entity:{multiple:!0}}}];return l`<ha-form
        .hass=${this.hass}
        .schema=${i}
        .data=${{triggers:e}}
        .computeLabel=${()=>""}
        @value-changed=${n=>{n.stopPropagation(),this._setTriggers(n.detail.value.triggers??[])}}
      ></ha-form>`}return l`
      <div class="chips">
        ${e.length===0?l`<span class="muted">${a(this.hass,"ui.script_triggers_none","No triggers")}</span>`:e.map(i=>l`<span class="chip" data-test=${`trigger-${i}`}>
                ${i}
                <button type="button" class="x" title=${a(this.hass,"ui.remove","Remove")} @click=${()=>this._removeTrigger(i)}>×</button>
              </span>`)}
      </div>
      <input
        data-test="trigger-add-input"
        placeholder="entity_id"
        @change=${i=>{let n=i.target,s=n.value.trim();s&&this._addTrigger(s),n.value=""}}
      />
    `}_renderYaml(){let e=i=>{i.stopPropagation();let n=i.target.value??i.detail?.value??"";this._onYamlInput(n)};return customElements.get("ha-code-editor")?l`
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
        @value-changed=${n=>{n.stopPropagation(),this._updateArgs(n.detail.value)}}
      ></ha-form>`:l`${e.map(n=>{let s=i[n.name];return l`
        <label style="display:block;margin-bottom:0.4rem;">
          <span style="display:inline-block;min-width:8em;">${n.name}</span>
          <input
            .value=${s==null?"":String(s)}
            @change=${o=>{let d=o.target.value,u={...i,[n.name]:d};this._updateArgs(u)}}
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
    </select>`}};ge.styles=y`
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
  `,c([m({attribute:!1})],ge.prototype,"hass",2),c([m({attribute:!1})],ge.prototype,"value",2),c([f()],ge.prototype,"_mode",2),c([f()],ge.prototype,"_yamlText",2),c([f()],ge.prototype,"_yamlError",2),ge=c([w("ambience-script-predicate-input")],ge);var kn=["dawn","sunrise","noon","sunset","dusk","midnight"];function Cn(t){let r=t.trim(),e=r===""?0:parseInt(r,10);return Number.isNaN(e)?null:e}var lt=class extends b{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){A(this,e)}_onKindChange(e){let i=e.target.value;i!==this.value.kind&&(i==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let i=e.target.value,[n,s]=i.split(":").map(o=>parseInt(o,10));Number.isNaN(n)||Number.isNaN(s)||this._emit({kind:"time",hh:n,mm:s})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let i=e.target.value;this._emit({...this.value,anchor:i})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let i=Cn(e.target.value);i!==null&&this._emit({...this.value,offset_min:i})}_onClampDirChange(e){if(this.value.kind!=="sun")return;let i=e.target.value;if(i===""){this._emit({kind:"sun",anchor:this.value.anchor,offset_min:this.value.offset_min});return}let n=this.value.clamp??Lu();this._emit({...this.value,clamp:{dir:i,hh:n.hh,mm:n.mm}})}_onClampTimeChange(e){if(this.value.kind!=="sun"||!this.value.clamp)return;let i=e.target.value,[n,s]=i.split(":").map(o=>parseInt(o,10));Number.isNaN(n)||Number.isNaN(s)||this._emit({...this.value,clamp:{dir:this.value.clamp.dir,hh:n,mm:s}})}_renderTime(e){let i=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return l`<input type="time" .value=${i} @input=${this._onTimeChange} />`}_renderSun(e){let i=Sn(e.offset_min,this.hass),n=e.clamp?.dir??"",s=e.clamp?`${String(e.clamp.hh).padStart(2,"0")}:${String(e.clamp.mm).padStart(2,"0")}`:"";return l`
      <div class="sun">
        <div class="row">
          <select @change=${this._onAnchorChange}>
            ${kn.map(o=>l`<option value=${o} ?selected=${o===e.anchor}>${re(this.hass,o)}</option>`)}
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
          ${e.clamp?l`<input type="time" .value=${s} @input=${this._onClampTimeChange} />`:""}
        </div>
      </div>
    `}render(){return l`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind==="time"}>${a(this.hass,"ui.endpoint_time","Time")}</option>
        <option value="sun" ?selected=${this.value.kind==="sun"}>${a(this.hass,"ui.endpoint_sun","Sun")}</option>
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
  `,c([m({attribute:!1})],lt.prototype,"hass",2),c([m({attribute:!1})],lt.prototype,"value",2),lt=c([w("ambience-time-endpoint")],lt);function Lu(){let t=new Date;return{hh:t.getHours(),mm:t.getMinutes()}}function Sn(t,r){if(t===0)return"";let e=Math.abs(t),i=t<0?"\u2212":"+";if(e%60===0){let n=e/60,s=n===1?a(r,"ui.unit_hour","hour"):a(r,"ui.unit_hours","hours");return`${i}${n} ${s}`}return`${i}${e} ${a(r,"ui.unit_min","min")}`}function gr(t,r){if(!t)return[];let e=Object.keys(t.builtins??{}),i=r?e.slice().sort(r):e,n=new Set(t.hidden??[]),s=Object.keys(t.custom??{}).filter(o=>!(o in(t.builtins??{})));return[...i.filter(o=>!n.has(o)),...s]}var ve=class extends b{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._error=""}static{this.styles=y`
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
  `}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){try{this._view=await this._list(),this._error=""}catch(e){this._error=S(this.hass,e)}}async _saveState(e){try{await this._save(e,this._view.hidden),this._error=""}catch(i){return this._error=S(this.hass,i),!1}return await this._reload(),!0}_onEdit(e,i){this._modal={mode:"edit",id:e,initial:i}}async _onDelete(e){let i={...this._view.custom};delete i[e],await this._saveState(i)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:i,definition:n}=e.detail;await this._saveState({...this._view.custom,[i]:n})&&(this._modal={mode:"closed"})}_onModalCancel(){this._modal={mode:"closed"}}_takenIds(){return new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}_renderBuiltinRow(e,i,n){return l`
      <div class="row ${n?"overridden":""}">
        <span class="name">${this._label(e,{})}</span>
        <span class="def">${this._formatDef(i)}</span>
        <span class="badge">${a(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${n?"":l`<button class="icon" title=${a(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(e,i)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(e,i){return l`
      <div class="row custom">
        <span class="name">${this._label(e,this._view.custom)}</span>
        <span class="def">${this._formatDef(i)}</span>
        <span class="badge">${a(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${a(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e,i)}>✎</button>
          <button class="icon" title=${a(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e)}>✕</button>
        </span>
      </div>
    `}render(){let e=this._view.custom,[i,n]=this._headingKey(),[s,o]=this._addKey();return l`
      <header>
        <h2>${a(this.hass,i,n)}</h2>
      </header>
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${Object.entries(this._view.builtins).map(([d,u])=>{let p=e[d];return l`
          ${this._renderBuiltinRow(d,u,p!=null)}
          ${p!=null?this._renderCustomRow(d,p):""}
        `})}
      ${Object.entries(e).filter(([d])=>!(d in this._view.builtins)).map(([d,u])=>this._renderCustomRow(d,u))}
      <button class="add" @click=${this._onAdd}>${a(this.hass,s,o)}</button>
      ${this._renderModal()}
    `}};c([m({attribute:!1})],ve.prototype,"hass",2),c([f()],ve.prototype,"_view",2),c([f()],ve.prototype,"_modal",2),c([f()],ve.prototype,"_error",2);var di={kind:"any"},Sa={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},Ea=["daytime","dawn","morning","afternoon","evening","nighttime"];function Tu(t,r){let e=Ea.indexOf(t),i=Ea.indexOf(r);return e===-1&&i===-1?0:e===-1?1:i===-1?-1:e-i}var ye=class extends b{constructor(){super(...arguments);this.value=null;this._entries=[di];this._openIdx=0}willUpdate(e){e.has("value")&&this.value!==this._lastEmitted&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[di]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(i=>{let n=this._entries[this._openIdx];if(!n)return;let s=n.kind==="any"?"__any__":n.kind==="range"?"__custom__":n.period;i.value!==s&&(i.value=s)})}_predicateToEntries(e){return e===null?[di]:(Array.isArray(e)?e:[e]).map(n=>"period"in n?{kind:"period",period:n.period}:{kind:"range",from:n.from,to:n.to})}_emit(e){let i=e.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),n=i.length===0?null:i.length===1?i[0]:i;this._lastEmitted=n,this.value=n,A(this,n)}_effectiveIds(){return gr(this.periods,Tu)}_onSelectChange(e,i){let n=i.target.value,s=[...this._entries];n==="__any__"?s[e]=di:n==="__custom__"?s[e]={kind:"range",...Sa}:s[e]={kind:"period",period:n},this._entries=s,this._emit(s)}_onRangeChange(e,i,n){n.stopPropagation();let s=this._entries[e];if(s?.kind!=="range")return;let o=[...this._entries];o[e]={...s,[i]:n.detail.value},this._entries=o,this._emit(o)}_onRemove(e){let i=this._entries.filter((n,s)=>s!==e);this._entries=i.length===0?[di]:i,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...Sa}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,i){let n;return e.kind==="any"?n=a(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?n=lr({period:e.period},{hass:this.hass,periods:this.periods}):n=lr({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),l`
      <div class="summary-chip" @click=${()=>this._onChipClick(i)}>
        <span class="chip-label">${n}</span>
        ${this._entries.length>1?l`<button class="remove" @click=${s=>{s.stopPropagation(),this._onRemove(i)}} title=${a(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,i,n){let s=this._effectiveIds(),o=this.periods?.custom??{};return l`
      <div class="entry">
        <div class="entry-header">
          <select @change=${d=>this._onSelectChange(i,d)}>
            ${n?l`<option value="__any__">${a(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${a(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${s.map(d=>l`<option value=${d}>
                ${pe(this.hass,d,o)}${o[d]&&!this.periods?.builtins[d]?a(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?l`<button class="remove" @click=${()=>this._onRemove(i)} title=${a(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${e.kind==="range"?l`
              <div class="range-row">
                <label>${a(this.hass,"ui.from_label","From")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.from}
                  @value-changed=${d=>this._onRangeChange(i,"from",d)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${a(this.hass,"ui.to_label","To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${d=>this._onRangeChange(i,"to",d)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(n=>n.kind!=="any"),i=this._entries.length>1;return l`
      ${this._entries.map((n,s)=>i&&s!==this._openIdx?this._renderChip(n,s):this._renderEntry(n,s,s===0))}
      ${e?l`<button class="add-btn" @click=${this._onAdd}>${a(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
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
  `,c([m({attribute:!1})],ye.prototype,"value",2),c([m({attribute:!1})],ye.prototype,"periods",2),c([m({attribute:!1})],ye.prototype,"hass",2),c([f()],ye.prototype,"_entries",2),c([f()],ye.prototype,"_openIdx",2),ye=c([w("ambience-time-of-day-input")],ye);function ne(t,r,e,i,n){return customElements.get("ha-form")?l`<ha-form
      class=${r}
      .hass=${t}
      .schema=${[{name:r,required:!0,selector:{select:{mode:"dropdown",options:i}}}]}
      .data=${{[r]:e}}
      .computeLabel=${()=>""}
      @value-changed=${o=>{o.stopPropagation();let d=o.detail.value[r];d&&n(d)}}
    ></ha-form>`:l`<select
    class=${r}
    @change=${s=>n(s.target.value)}
  >
    ${i.map(s=>l`<option value=${s.value} ?selected=${s.value===e}>${s.label}</option>`)}
  </select>`}function Ht(t,r,e,i,n){return customElements.get("ha-form")?l`<ha-form
      class="field"
      data-field="sensors"
      .hass=${t}
      .schema=${r}
      .data=${{sensors:e}}
      .computeLabel=${()=>""}
      @value-changed=${s=>{s.stopPropagation(),n(s.detail.value.sensors??[])}}
    ></ha-form>`:l`<input
    class="field"
    data-field="sensors"
    type="text"
    placeholder=${i}
    .value=${e.join(", ")}
    @change=${s=>n(s.target.value.split(",").map(o=>o.trim()).filter(o=>o!==""))}
  />`}function ci(t,r,e,i,n,s){return customElements.get("ha-form")?l`<ha-form
      .hass=${t}
      .schema=${[{name:r,selector:i}]}
      .data=${{[r]:e??""}}
      .computeLabel=${()=>""}
      @value-changed=${d=>{d.stopPropagation(),s(d.detail.value[r]||null)}}
    ></ha-form>`:l`<input
    type="text"
    placeholder=${n}
    .value=${e??""}
    @change=${o=>s(o.target.value||null)}
  />`}function qe(t){return t?.states??{}}function vr(t){let r=t?.state;return typeof r=="string"&&r.trim()!==""&&Number.isFinite(Number(r))}function En(t,r){let e=`${r}.`;return Object.keys(qe(t)).filter(i=>i.startsWith(e)).sort().map(i=>({id:i,name:ze(t,i)}))}var An="__custom__";function Pu(t,r){return t.length===r.length&&t.every((e,i)=>e===r[i])}function Ln(t,r,e){return typeof t=="number"&&t<0||typeof r=="number"&&r<0?a(e,"ui.lux_error_negative","Bounds must be 0 or greater."):typeof t=="number"&&!Number.isInteger(t)||typeof r=="number"&&!Number.isInteger(r)?a(e,"ui.lux_error_not_integer","Bounds must be whole numbers."):typeof t=="number"&&typeof r=="number"&&t>=r?a(e,"ui.lux_error_order","Min must be less than max."):null}function Aa(t,r){if(t==null||typeof t!="object")return null;let e=t;return typeof e.range=="string"?null:Ln(e.min,e.max,r)}function Ru(t){let r=t?.attributes;return r?.device_class==="illuminance"||r?.unit_of_measurement==="lx"||r?.state_class==="measurement"?!0:vr(t)}var Ue=class extends b{constructor(){super(...arguments);this.value=null;this._candidatesOf=[];this._candidates=[];this._candidatesFresh=!1}_cur(){return this.value??{sensors:[],range:this._defaultRangeId()}}_sensors(){return this._cur().sensors??[]}_showQuant(){return this._sensors().length>1}_effectiveRangeIds(){return gr(this.luxRanges)}_defaultRangeId(){return this._effectiveRangeIds()[0]??"dark"}_isCustom(e){return e.range==null}_build(e){let i={...this._cur(),...e},n={sensors:i.sensors??[]};return this._isCustom(i)?(i.min!=null&&(n.min=i.min),i.max!=null&&(n.max=i.max)):n.range=i.range??this._defaultRangeId(),i.quant==="all"&&(n.quant="all"),i.negate===!0&&(n.negate=!0),n}_emit(e){this.value=e,A(this,e)}_setSensors(e){this._emit(e.length?this._build({sensors:e}):null)}_setQuant(e){this._emit(this._build({quant:e}))}_setNegate(e){this._emit(this._build({negate:e}))}_setBand(e){if(e===An){let i=this._cur();this._emit(this._build({range:void 0,min:i.min??0,max:i.max}))}else this._emit(this._build({range:e,min:void 0,max:void 0}))}_setMin(e){this._emit(this._build({min:e}))}_setMax(e){this._emit(this._build({max:e}))}_candidateIds(){let e=this.hass?.states,i=this._sensors();if(this._candidatesFresh&&this._candidatesFor===e&&Pu(this._candidatesOf,i))return this._candidates;let n=new Set(i);for(let s of Object.keys(e??{}))s.startsWith("sensor.")&&Ru(e?.[s])&&n.add(s);return this._candidatesFor=e,this._candidatesOf=[...i],this._candidates=[...n].sort(),this._candidatesFresh=!0,this._candidates}_sensorSchema(){let e=this._candidateIds(),i={domain:"sensor",multiple:!0};return e.length&&(i.include_entities=e),[{name:"sensors",selector:{entity:i}}]}_renderSensors(){return Ht(this.hass,this._sensorSchema(),this._sensors(),"sensor.a, sensor.b",e=>this._setSensors(e))}_renderBand(e){let i=this._isCustom(e),n=[...this._effectiveRangeIds().map(d=>({value:d,label:De(this.hass,d,this.luxRanges?.custom??{})})),{value:An,label:a(this.hass,"ui.custom_range","Custom range")}],s=ne(this.hass,"band",i?An:e.range??this._defaultRangeId(),n,d=>this._setBand(d));if(!i)return s;let o=d=>d==null?"":String(d);return l`${s}
      <span class="band-row" data-field="band-custom">
        <input
          type="number" min="0" step="1" data-field="min"
          placeholder=${a(this.hass,"ui.lux_min_placeholder","0")}
          .value=${o(e.min)}
          @change=${d=>{let u=d.target.value;this._setMin(u===""?void 0:Number(u))}}
        />
        <span>–</span>
        <input
          type="number" min="0" step="1" data-field="max"
          placeholder=${a(this.hass,"ui.lux_max_placeholder","\u221E")}
          .value=${o(e.max)}
          @change=${d=>{let u=d.target.value;this._setMax(u===""?void 0:Number(u))}}
        />
        <span class="label">lx</span>
      </span>`}_renderQuant(e){return ne(this.hass,"quant",e,[{value:"any",label:a(this.hass,"ui.lux_any","Any of")},{value:"all",label:a(this.hass,"ui.lux_all","All of")}],i=>this._setQuant(i))}_renderNegate(e){return ne(this.hass,"negate",e?"is_not":"is",[{value:"is",label:a(this.hass,"ui.lux_is","is")},{value:"is_not",label:a(this.hass,"ui.lux_is_not","is not")}],i=>this._setNegate(i==="is_not"))}render(){let e=this._cur(),i=e.quant==="all"?"all":"any",n=e.negate===!0;return l`
      ${this._showQuant()?l`<div class="row">${this._renderQuant(i)}</div>`:""}
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._renderNegate(n)}
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
  `,c([m({attribute:!1})],Ue.prototype,"hass",2),c([m({attribute:!1})],Ue.prototype,"value",2),c([m({attribute:!1})],Ue.prototype,"luxRanges",2),Ue=c([w("ambience-lux-input")],Ue);function Tn(t){if(typeof t!="string")return!1;let r=t.split(",").map(e=>e.trim()).filter(e=>e!=="");if(r.length===0)return!1;for(let e of r)if(e.includes("-")){let i=e.split("-").map(o=>o.trim());if(i.length!==2||!/^\d+$/.test(i[0])||!/^\d+$/.test(i[1]))return!1;let n=Number(i[0]),s=Number(i[1]);if(!(n>=1&&n<=s&&s<=31))return!1}else{if(!/^\d+$/.test(e))return!1;let i=Number(e);if(!(i>=1&&i<=31))return!1}return!0}var Pn=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Du=new Set(["workday","holiday"]),Hu=new Set(["first_workday","last_workday"]),Iu=[31,29,31,30,31,30,31,31,30,31,30,31];function ui(t){return Iu[t-1]??31}function Rn(t){switch(t){case"weekday":return{kind:t,days:[]};case"day_of_month":return{kind:t,days:""};case"date":return{kind:t,month:1,day:1};case"date_range":return{kind:t,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:t}}}function La(t,r){if(t==null||typeof t!="object")return null;let e=t;for(let i of[e.include,e.exclude])if(Array.isArray(i))for(let n of i){let s=n;if(s?.kind==="weekday"&&(!Array.isArray(s.days)||s.days.length===0))return a(r,"ui.day_pick_weekday","Pick at least one day of the week.");if(s?.kind==="day_of_month"&&(typeof s.days!="string"||!Tn(s.days)))return a(r,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}return null}var We=class extends b{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?a(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return a(this.hass,"ui.field_kind","Kind");case"days":return a(this.hass,"ui.field_days_of_month","Days of month");case"month":return a(this.hass,"ui.field_month","Month");case"day":return a(this.hass,"ui.field_day","Day");case"from_month":return a(this.hass,"ui.field_from_month","From month");case"from_day":return a(this.hass,"ui.field_from_day","From day");case"to_month":return a(this.hass,"ui.field_to_month","To month");case"to_day":return a(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let i=e.include.length===0&&e.exclude.length===0;this.value=i?null:e,A(this,this.value)}_addItem(e,i){let n=this._current();n[e]=[...n[e],Rn(i)],this._emit(n)}_removeItem(e,i){let n=this._current();n[e]=n[e].filter((s,o)=>o!==i),this._emit(n)}_updateItem(e,i,n){let s=this._current();s[e]=s[e].map((o,d)=>d===i?n:o),this._emit(s)}_kindDisabled(e){return!!(Du.has(e)&&!this.dayConfig.workday_sensor||Hu.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:Pn.map(e=>({value:e,label:Di(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:vt(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:ui(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,i){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(i.days??"")}:e}_setDatePart(e,i,n){let s=Number(n);if(!Number.isFinite(s)||s<1)return e;if(i.endsWith("month")&&(s=Math.min(s,12)),e.kind==="date"){let{month:o,day:d}=e;return i==="month"&&(o=s),i==="day"&&(d=s),{kind:"date",month:o,day:Math.min(d,ui(o))}}if(e.kind==="date_range"){let o={...e.from},d={...e.to};return i==="from_month"&&(o.month=s),i==="from_day"&&(o.day=s),i==="to_month"&&(d.month=s),i==="to_day"&&(d.day=s),o.day=Math.min(o.day,ui(o.month)),d.day=Math.min(d.day,ui(d.month)),{kind:"date_range",from:o,to:d}}return e}_onKindForm(e,i,n){let s=n.kind;if(!s){this._removeItem(e,i);return}if(this._kindDisabled(s))return;let o=this._current()[e][i];o&&o.kind===s||this._updateItem(e,i,Rn(s))}_dayOfMonthError(e){return e.trim()===""||Tn(e)?null:a(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(e,i,n,s){this._updateItem(e,i,this._bodyPatch(n,s))}_renderWeekday(e,i,n){return l`${[0,1,2,3,4,5,6].map(s=>l`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${n.days.includes(s)}
          @change=${o=>{let u=o.target.checked?[...n.days,s].sort((p,h)=>p-h):n.days.filter(p=>p!==s);this._updateItem(e,i,{kind:"weekday",days:u})}}
        />${Ri(this.hass,s)}
      </label>
    `)}`}_renderKindPicker(e,i,n){return customElements.get("ha-form")?l`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:n.kind}}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${s=>{s.stopPropagation(),this._onKindForm(e,i,s.detail.value)}}
      ></ha-form>`:l`
      <select
        class="kind"
        @change=${s=>{let o=s.target.value;this._kindDisabled(o)||o===n.kind||this._updateItem(e,i,Rn(o))}}
      >
        ${Pn.map(s=>l`<option value=${s} ?selected=${s===n.kind} ?disabled=${this._kindDisabled(s)}>${Di(this.hass,s)}</option>`)}
      </select>
    `}_renderItemBody(e,i,n){if(n.kind==="weekday")return this._renderWeekday(e,i,n);if(customElements.get("ha-form")){if(n.kind==="date")return this._renderDateRow(e,i,n,"month","day",n.month,n.day);if(n.kind==="date_range")return l`
          ${this._renderDateRow(e,i,n,"from_month","from_day",n.from.month,n.from.day)}
          ${this._renderDateRow(e,i,n,"to_month","to_day",n.to.month,n.to.day)}
        `;let s=this._bodySchema(n);if(!s)return l``;let o=n.kind==="day_of_month"?this._dayOfMonthError(n.days):null;return l`<ha-form
        .hass=${this.hass}
        .schema=${s}
        .data=${this._bodyData(n)}
        .error=${o?{days:o}:void 0}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${d=>{d.stopPropagation(),this._onBodyForm(e,i,n,d.detail.value)}}
      ></ha-form>`}return this._renderNativeBody(e,i,n)}_renderDateRow(e,i,n,s,o,d,u){let p=(h,_)=>{this._updateItem(e,i,this._setDatePart(n,h,_[h]))};return l`
      <div class="date-row">
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:s,required:!0,selector:this._monthSelector()}]}
          .data=${{[s]:String(d)}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${h=>{h.stopPropagation(),p(s,h.detail.value)}}
        ></ha-form>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:o,required:!0,selector:this._daySelector(d)}]}
          .data=${{[o]:u}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${h=>{h.stopPropagation(),p(o,h.detail.value)}}
        ></ha-form>
      </div>
    `}_renderNativeBody(e,i,n){if(n.kind==="day_of_month"){let d=this._dayOfMonthError(n.days);return l`<input
        type="text" placeholder=${a(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${n.days}
        @change=${u=>this._updateItem(e,i,this._bodyPatch(n,{days:u.target.value}))}
      />${d?l`<div class="field-error">${d}</div>`:""}`}let s=(d,u)=>l`
      <input type="number" min="1" max="12" .value=${String(u)}
        @change=${p=>this._updateItem(e,i,this._setDatePart(n,d,p.target.value))} />
    `,o=(d,u,p)=>l`
      <input type="number" min="1" max=${String(ui(u))} .value=${String(p)}
        @change=${h=>this._updateItem(e,i,this._setDatePart(n,d,h.target.value))} />
    `;return n.kind==="date"?l`${s("month",n.month)} / ${o("day",n.month,n.day)}`:n.kind==="date_range"?l`
        <span>${a(this.hass,"ui.from","from")}</span>
        ${s("from_month",n.from.month)} / ${o("from_day",n.from.month,n.from.day)}
        <span>${a(this.hass,"ui.to","to")}</span>
        ${s("to_month",n.to.month)} / ${o("to_day",n.to.month,n.to.day)}
      `:l``}_renderAddPicker(e){let i=e==="include"?a(this.hass,"ui.add_include_item","+ Add include item"):a(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let n=()=>i;return l`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${n}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.kind;o&&!this._kindDisabled(o)&&this._addItem(e,o)}}
      ></ha-form>`}return l`
      <select
        .value=${""}
        @change=${n=>{let s=n.target.value;s&&(this._addItem(e,s),n.target.value="")}}
      >
        <option value="">${i}</option>
        ${Pn.map(n=>l`<option value=${n} ?disabled=${this._kindDisabled(n)}>${Di(this.hass,n)}</option>`)}
      </select>
    `}_renderItem(e,i,n){return l`
      <div class="item">
        ${this._renderKindPicker(e,i,n)}
        <div class="body">${this._renderItemBody(e,i,n)}</div>
        <button class="remove" title=${a(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(e,i)}>✕</button>
      </div>
    `}_renderSection(e,i){return l`
      <div class="section">
        <h4>${e==="include"?a(this.hass,"ui.include","Include"):a(this.hass,"ui.exclude","Exclude")}</h4>
        ${i.length===0&&e==="include"?l`<div class="hint">${a(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${i.map((n,s)=>this._renderItem(e,s,n))}
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
  `,c([m({attribute:!1})],We.prototype,"hass",2),c([m({attribute:!1})],We.prototype,"value",2),c([m({attribute:!1})],We.prototype,"dayConfig",2),We=c([w("ambience-day-predicate-input")],We);var Ta=["temperature","apparent_temperature","humidity","wind_speed","pressure"],Pa=["<","<=",">",">="],Ra={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},Te=class extends b{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(e){let i=e.groups.length===0&&e.thresholds.length===0;this.value=i?null:e,A(this,this.value)}_setGroups(e){this._emit({...this._current(),groups:e})}_addThreshold(){let e=this._current();e.thresholds=[...e.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(e)}_updateThreshold(e,i){let n=this._current();n.thresholds=n.thresholds.map((s,o)=>o===e?i:s),this._emit(n)}_removeThreshold(e){let i=this._current();i.thresholds=i.thresholds.filter((n,s)=>s!==e),this._emit(i)}_attributeSchema(e){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:Ta.map(i=>({value:i,label:qt(this.hass,i)}))}}}]}_opSchema(e){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:Pa.map(i=>({value:i,label:Ra[i]}))}}}]}_entityState(){let e=this.weatherEntity;return e?this.hass?.states?.[e]:void 0}_valueSchema(e,i){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:zr(this.hass,i,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(e=>({value:e.id,label:e.label}))}}}]}_renderGroups(e){return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{groups:e}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),this._setGroups(i.detail.value.groups??[])}}
      ></ha-form>`:l`${this.groups.map(i=>l`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${e.includes(i.id)}
          @change=${n=>{let s=n.target.checked;this._setGroups(s?[...e,i.id]:e.filter(o=>o!==i.id))}} />${i.label}
      </label>`)}`}_renderAttributeSelect(e,i){return customElements.get("ha-form")?l`<ha-form
        class="attr-form"
        .hass=${this.hass}
        .schema=${this._attributeSchema(e)}
        .data=${{attribute:i.attribute}}
        .computeLabel=${()=>""}
        @value-changed=${n=>{n.stopPropagation();let s=n.detail.value.attribute;s&&this._updateThreshold(e,{...i,attribute:s})}}
      ></ha-form>`:l`<select
      @change=${n=>this._updateThreshold(e,{...i,attribute:n.target.value})}>
      ${Ta.map(n=>l`<option value=${n} ?selected=${n===i.attribute}>${qt(this.hass,n)}</option>`)}
    </select>`}_renderOpSelect(e,i){return customElements.get("ha-form")?l`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(e)}
        .data=${{op:i.op}}
        .computeLabel=${()=>""}
        @value-changed=${n=>{n.stopPropagation();let s=n.detail.value.op;s&&this._updateThreshold(e,{...i,op:s})}}
      ></ha-form>`:l`<select
      @change=${n=>this._updateThreshold(e,{...i,op:n.target.value})}>
      ${Pa.map(n=>l`<option value=${n} ?selected=${n===i.op}>${Ra[n]}</option>`)}
    </select>`}_renderValueInput(e,i){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(e,i.attribute)}
        .data=${{value:i.value}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.value;typeof o=="number"&&Number.isFinite(o)&&this._updateThreshold(e,{...i,value:o})}}
      ></ha-form>`;let n=zr(this.hass,i.attribute,this._entityState());return l`<span class="value-wrap">
      <input type="number" .value=${String(i.value)}
        @change=${s=>{let o=Number(s.target.value);Number.isFinite(o)&&this._updateThreshold(e,{...i,value:o})}} />
      <span class="unit">${n}</span>
    </span>`}_renderThreshold(e,i){return l`
      <div class="threshold">
        ${this._renderAttributeSelect(e,i)}
        ${this._renderOpSelect(e,i)}
        ${this._renderValueInput(e,i)}
        <button class="remove" title=${a(this.hass,"ui.remove","Remove")} @click=${()=>this._removeThreshold(e)}>✕</button>
      </div>
    `}render(){let{groups:e,thresholds:i}=this._current();return l`
      <div class="section">
        <h4>${a(this.hass,"ui.groups","Groups")}</h4>
        ${this._renderGroups(e)}
      </div>
      <div class="section">
        <h4>${a(this.hass,"ui.thresholds","Thresholds")}</h4>
        ${i.map((n,s)=>this._renderThreshold(s,n))}
        <button class="add" @click=${()=>this._addThreshold()}>${a(this.hass,"ui.add_threshold","+ Add threshold")}</button>
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
  `,c([m({attribute:!1})],Te.prototype,"hass",2),c([m({attribute:!1})],Te.prototype,"value",2),c([m({attribute:!1})],Te.prototype,"groups",2),c([m({attribute:!1})],Te.prototype,"weatherEntity",2),Te=c([w("ambience-weather-predicate-input")],Te);var Nu=["NW","N","NE","W",null,"E","SW","S","SE"],dt=class extends b{constructor(){super(...arguments);this.value=null}_current(){let e=this.value?.azimuth?.ranges??[];return{elevation:this.value?.elevation??null,sectors:[...this.value?.azimuth?.sectors??[]],range:e.length?{...e[0]}:null}}_emit(e){let i={};e.elevation&&(e.elevation.min!=null||e.elevation.max!=null)&&(i.elevation=e.elevation);let n={};e.sectors.length&&(n.sectors=e.sectors),e.range&&(n.ranges=[e.range]),(n.sectors||n.ranges)&&(i.azimuth=n),this.value=i.elevation||i.azimuth?i:null,A(this,this.value)}_setElevation(e){this._emit({...this._current(),elevation:e})}_setSectors(e){this._emit({...this._current(),sectors:e})}_setRange(e){this._emit({...this._current(),range:e})}_mode(e){return!e||e.min==null&&e.max==null?"any":e.min!=null&&e.max!=null?"between":e.min!=null?"above":"below"}_onModeChange(e,i){let n=i?.min??0,s=i?.max??0;e==="any"?this._setElevation(null):e==="above"?this._setElevation({min:n}):e==="below"?this._setElevation({max:s}):this._setElevation({min:n,max:s})}_toggleSector(e,i,n){this._setSectors(n?[...e,i]:e.filter(s=>s!==i))}_renderSectors(e){return l`<div class="sectors">${Nu.map(i=>i===null?l`<span class="spacer"></span>`:l`<label>
            <input type="checkbox" .checked=${e.includes(i)}
              @change=${n=>this._toggleSector(e,i,n.target.checked)} />${i}
          </label>`)}</div>`}_renderElevation(e){let i=this._mode(e),n=["any","above","below","between"],s={any:a(this.hass,"ui.sun.any","Any"),above:a(this.hass,"ui.sun.above","Above"),below:a(this.hass,"ui.sun.below","Below"),between:a(this.hass,"ui.sun.between","Between")};return l`
      <div class="row">
        <select @change=${o=>this._onModeChange(o.target.value,e)}>
          ${n.map(o=>l`<option value=${o} ?selected=${o===i}>${s[o]}</option>`)}
        </select>
        ${i==="above"||i==="between"?l`<input type="number" class="min" .value=${String(e?.min??0)}
              @change=${o=>this._setElevation({...i==="between"?{max:e?.max??0}:{},min:Number(o.target.value)})} /><span class="deg">°</span>`:""}
        ${i==="below"||i==="between"?l`<input type="number" class="max" .value=${String(e?.max??0)}
              @change=${o=>this._setElevation({...i==="between"?{min:e?.min??0}:{},max:Number(o.target.value)})} /><span class="deg">°</span>`:""}
      </div>
    `}_renderCustomRange(e){return l`
      <label class="custom-range">
        <input type="checkbox" class="custom-range-toggle" .checked=${e!==null}
          @change=${i=>this._setRange(i.target.checked?{from:0,to:0}:null)} />
        ${a(this.hass,"ui.sun.custom_range","Custom range")}
      </label>
      ${e===null?"":l`<div class="row range-row">
            <input type="number" class="from" .value=${String(e.from)}
              @change=${i=>this._setRange({...e,from:Number(i.target.value)})} />
            <span class="deg">°–</span>
            <input type="number" class="to" .value=${String(e.to)}
              @change=${i=>this._setRange({...e,to:Number(i.target.value)})} />
            <span class="deg">°</span>
          </div>`}
    `}render(){let{elevation:e,sectors:i,range:n}=this._current();return l`
      <div class="section">
        <h4>${a(this.hass,"ui.sun.elevation","Elevation")}</h4>
        ${this._renderElevation(e)}
      </div>
      <div class="section">
        <h4>${a(this.hass,"ui.sun.azimuth","Azimuth")}</h4>
        ${this._renderSectors(i)}
        ${this._renderCustomRange(n)}
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
  `,c([m({attribute:!1})],dt.prototype,"hass",2),c([m({attribute:!1})],dt.prototype,"value",2),dt=c([w("ambience-sun-predicate-input")],dt);var U=class extends b{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[];this._knownAttributeValues=[];this._entitySeq=0}willUpdate(e){if(!e.has("value"))return;let i=e.get("value"),{entity_id:n,attribute:s}=this.value;(n!==i?.entity_id||s!==i?.attribute)&&!(n&&s&&this.hass)&&this._knownAttributeValues.length&&(this._knownAttributeValues=[])}async updated(e){if(!e.has("value"))return;let i=e.get("value"),{entity_id:n,attribute:s}=this.value;if(n&&n!==i?.entity_id&&this.hass)try{let o=(await Gr(this.hass,n)).states;this.value.entity_id===n&&(this._knownStates=o)}catch{this.value.entity_id===n&&(this._knownStates=[])}if((n!==i?.entity_id||s!==i?.attribute)&&n&&s&&this.hass)try{let o=(await Kr(this.hass,n,s)).values;this.value.entity_id===n&&this.value.attribute===s&&(this._knownAttributeValues=o)}catch{this.value.entity_id===n&&this.value.attribute===s&&(this._knownAttributeValues=[])}}_normalize(e){let i={...e};return i.attribute===""&&(i.attribute=null),i.for&&i.for.h===0&&i.for.m===0&&i.for.s===0&&(i.for=null),Et(i.for,i.for_mode)||delete i.for_mode,i}_emit(e){let i=this._normalize(e);this.value=i,A(this,i)}_autoFlipOp(e){let i=this._isNumericTargetFor(e),n=this._isNumericOp(e.kind);return!i&&n?{...e,kind:"is"}:i&&!n&&!this._isNumericTargetFor(this.value)?{...e,kind:">"}:e}async _setEntity(e){let i=++this._entitySeq,n=this._entityHasAttribute(e,this.value.attribute)?this.value.attribute:null,s=await this._supportedValues(e,n,this.value.states);i===this._entitySeq&&this._emit(this._autoFlipOp({...this.value,entity_id:e,attribute:n,states:s}))}_entityHasAttribute(e,i){return i?this._knownAttributesFor(e).includes(i):!1}async _supportedValues(e,i,n){if(!e||n.length===0||!this.hass)return[];try{let s=new Set(i?(await Kr(this.hass,e,i)).values:(await Gr(this.hass,e)).states);return n.filter(o=>s.has(o))}catch{return[]}}_setAttribute(e){this._emit(this._autoFlipOp({...this.value,attribute:e}))}_setOp(e){let i=this._isNumericOp(e)===this._isNumericOp(this.value.kind)?this.value.states:[];this._emit({...this.value,kind:e,states:i})}_setStates(e){this._emit({...this.value,states:e})}_setValueAt(e,i){if(this._isNumericOp(this.value.kind)){this._setStates([i]);return}let n=this.value.states.slice();i===""?n.splice(e,1):n[e]=i,this._setStates(n)}_addValue(e){e&&this._setStates([...this.value.states,e])}_removeValueAt(e){let i=this.value.states.slice();i.splice(e,1),this._setStates(i)}_setForDuration(e){if(e===null){this._emit({...this.value,for:null,for_mode:null});return}let{mode:i,...n}=e;this._emit({...this.value,for:n,for_mode:i})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(e){if(!e)return[];let i=qe(this.hass)[e]?.attributes;return i?Object.keys(i).sort():[]}_attrLabelMaps(){let e=this._knownAttributesFor(this.value.entity_id),n=`${this.hass?.language??""}|${this.value.entity_id}|${e.join(",")}`;if(this._attrMapsCache?.key===n)return this._attrMapsCache.maps;let s=qe(this.hass)[this.value.entity_id],o=new Map,d=new Map;for(let p of e){let h=Ti(this.hass,s,p);o.set(p,h),d.set(h,p)}let u={keyToLabel:o,labelToKey:d};return this._attrMapsCache={key:n,maps:u},u}_attributeSchema(){let{keyToLabel:e}=this._attrLabelMaps();return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:U._STATE_SENTINEL,label:a(this.hass,"ui.state_sentinel","State")},...[...e.values()].map(i=>({value:i,label:i}))]}}}]}_attributeData(){let e=this.value.attribute;if(!e)return{attribute:U._STATE_SENTINEL};let{keyToLabel:i}=this._attrLabelMaps();return{attribute:i.get(e)??e}}_setAttributeFromHaForm(e){if(e===U._STATE_SENTINEL){this._setAttribute("");return}let{labelToKey:i}=this._attrLabelMaps();this._setAttribute(i.get(e)??e)}_isNumericOp(e){return U._NUMERIC_OPS.includes(e)}_isNumericTargetFor(e){let i=qe(this.hass)[e.entity_id];return i?e.attribute?typeof i.attributes?.[e.attribute]=="number":vr(i):!1}_opSchema(){let e=this._isNumericTargetFor(this.value)?[...U._NUMERIC_OPS,"is","is_not"]:["is","is_not"];return e.includes(this.value.kind)||e.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:e.map(i=>({value:i,label:z(this.hass,i)}))}}}]}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let{rawToLabel:e}=this._valueLabelMaps();return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:[...e.values()].map(i=>({value:i,label:i}))}}}]}_rawValueOptions(){return this.value.attribute?this._knownAttributeValues:this._knownStates}_valueLabelMaps(){let e=this.value.attribute,i=this._rawValueOptions(),s=`${this.hass?.language??""}|${this.value.entity_id}|${e??""}|${i.join(",")}`;if(this._valueMapsCache?.key===s)return this._valueMapsCache.maps;let o=qe(this.hass)[this.value.entity_id],d=new Map,u=new Map;for(let h of i){let _=Re(this.hass,o,e,h);d.set(h,_),u.set(_,h)}let p={rawToLabel:d,labelToRaw:u};return this._valueMapsCache={key:s,maps:p},p}_valueDisplay(e){return this._valueLabelMaps().rawToLabel.get(e)??e}_labelToRaw(e){return this._valueLabelMaps().labelToRaw.get(e)??e}_setValueFromHaForm(e,i){this._setValueAt(e,this._labelToRaw(i))}_addValueFromHaForm(e){this._addValue(this._labelToRaw(e))}_renderEntity(){return customElements.get("ha-form")?l`<ha-form
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
      placeholder=${a(this.hass,"ui.state_attribute_placeholder","leave blank to compare state")}
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
      <option value="is" ?selected=${this.value.kind==="is"}>${z(this.hass,"is")}</option>
      <option value="is_not" ?selected=${this.value.kind==="is_not"}>${z(this.hass,"is_not")}</option>
    </select>`}_renderValueRow(e,i){let n=i===-1,s=n?u=>this._addValue(u):u=>this._setValueAt(i,u),o=this._isNumericOp(this.value.kind),d=o?{value:e===""?void 0:Number(e)}:{value:this._valueDisplay(e)};return customElements.get("ha-form")?l`
        <div class="value-row" data-row=${i}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${d}
            .computeLabel=${()=>""}
            @value-changed=${u=>{u.stopPropagation();let p=u.detail.value.value,h=p==null?"":String(p);o?s(h):n?this._addValueFromHaForm(h):this._setValueFromHaForm(i,h)}}
          ></ha-form>
        </div>
      `:l`
      <div class="value-row" data-row=${i}>
        <input type=${o?"number":"text"} .value=${e}
          placeholder=${n?a(this.hass,"ui.state_add_value","+ Add state"):""}
          @change=${u=>s(u.target.value)} />
      </div>
    `}_renderForRow(){return l`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this.value.for??null}
      .mode=${this.value.for_mode??"at_least"}
      @value-changed=${e=>{e.stopPropagation(),this._setForDuration(e.detail.value)}}
    ></ambience-for-duration>`}render(){return l`
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
          ${this._isNumericOp(this.value.kind)?this._renderValueRow(this.value.states[0]??"",0):l`
                ${this.value.states.map((e,i)=>this._renderValueRow(e,i))}
                ${this._renderValueRow("",-1)}
              `}
        </div>
      </section>
      <section class="field">
        <label class="field-label">${a(this.hass,"ui.state_for","For (optional)")}</label>
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
  `,U._STATE_SENTINEL="State",U._NUMERIC_OPS=[">",">=","<","<="],c([m({attribute:!1})],U.prototype,"hass",2),c([m({attribute:!1})],U.prototype,"value",2),c([f()],U.prototype,"_knownStates",2),c([f()],U.prototype,"_knownAttributeValues",2),U=c([w("ambience-state-expr-atom")],U);function yr(t,r){return t===null||r===null||t.length!==r.length?!1:t.every((e,i)=>e===r[i])}var te=class extends b{constructor(){super(...arguments);this.path=[];this.dragOverPath=null;this.dragOverPos=null;this.dragFromPath=null;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(e,i={}){this.dispatchEvent(new CustomEvent(e,{detail:{path:this.path,...i},bubbles:!0,composed:!0}))}_atomIsComplete(e){return!!e.entity_id&&e.states.some(i=>i!=="")}_isErrorTarget(){return yr(this.path,this.errorPath)}_isDropTarget(){return yr(this.path,this.dragOverPath)}_dropPos(){return this._isDropTarget()?this.dragOverPos:null}_isDragging(){return yr(this.path,this.dragFromPath)}_onDragHandleDown(e){this.path.length!==0&&(!e.isPrimary||e.button>0||(e.stopPropagation(),this.dispatchEvent(new CustomEvent("node-drag-start",{detail:{path:this.path,pointer:e},bubbles:!0,composed:!0}))))}_dragHandle(){return this.path.length===0?"":l`<span
      class="drag-handle"
      title=${a(this.hass,"ui.drag_to_reorder","Drag to reorder")}
      @pointerdown=${this._onDragHandleDown}
      @click=${e=>e.stopPropagation()}
      >⠿</span
    >`}_notToggle(e){return l`<button class="not-toggle ${e?"on":""}"
      title=${a(this.hass,"ui.state_not_toggle","Negate (NOT)")}
      @click=${i=>{i.stopPropagation(),this._emit("node-toggle-not")}}>${z(this.hass,"not")}</button>`}_renderAtomCard(e,i){let n=this._atomIsComplete(e),s=yr(this.path,this.openPath),o=n?dn(e,{hass:this.hass}):a(this.hass,"ui.state_new_condition","(new condition)");return l`
      <div class="atom-card ${s?"expanded":"collapsed"} ${this._dropPos()==="into"?"drag-over":""} ${this._isDragging()?"dragging":""}">
        <div class="atom-header"
          @click=${()=>this._emit("node-open")}>
          ${this._dragHandle()}
          ${this._notToggle(i)}
          <span class="summary ${n?"":"placeholder"}">${o}</span>
          <button class="wrap"
            title=${a(this.hass,"ui.state_wrap","Wrap in group")}
            @click=${d=>{d.stopPropagation(),this._emit("node-wrap")}}>(…)</button>
          <button class="remove"
            title=${a(this.hass,"ui.remove","Remove")}
            @click=${d=>{d.stopPropagation(),this._emit("node-remove")}}>✕</button>
        </div>
        ${s?l`
          <div class="atom-body">
            <ambience-state-expr-atom
              .hass=${this.hass}
              .value=${e}
              @value-changed=${d=>{d.stopPropagation();let u=d.detail.value,p=i?{kind:"not",item:u}:u;this._emit("node-change",{value:p})}}
            ></ambience-state-expr-atom>
            ${this._isErrorTarget()&&this.errorMessage?l`<div class="atom-error">${this.errorMessage}</div>`:""}
          </div>
        `:""}
      </div>
    `}_renderChildRow(e,i){let n=[...this.path,i];return l`
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
    `}_renderGroup(e,i){return l`
      <div class="group ${this._dropPos()==="into"?"drag-over":""} ${this._isDragging()?"dragging":""}">
        <div class="group-header">
          ${this._dragHandle()}
          ${this._notToggle(i)}
          <select class="group-op"
            @change=${n=>this._emit("node-set-op",{op:n.target.value})}>
            <option value="and" ?selected=${e.kind==="and"}>${z(this.hass,"and")}</option>
            <option value="or"  ?selected=${e.kind==="or"} >${z(this.hass,"or")}</option>
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
    `}render(){let e=this.value.kind==="not",i=e?this.value.item:this.value,n=i.kind==="and"||i.kind==="or"?this._renderGroup(i,e):this._renderAtomCard(i,e),s=this._dropPos();return l`
      ${s==="before"?l`<div class="drop-line before"></div>`:""}
      ${n}
      ${s==="after"?l`<div class="drop-line after"></div>`:""}
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
  `,c([m({attribute:!1})],te.prototype,"hass",2),c([m({attribute:!1})],te.prototype,"value",2),c([m({attribute:!1})],te.prototype,"path",2),c([m({attribute:!1})],te.prototype,"dragOverPath",2),c([m({attribute:!1})],te.prototype,"dragOverPos",2),c([m({attribute:!1})],te.prototype,"dragFromPath",2),c([m({attribute:!1})],te.prototype,"openPath",2),c([m({attribute:!1})],te.prototype,"errorPath",2),c([m({attribute:!1})],te.prototype,"errorMessage",2),te=c([w("ambience-state-expr-node")],te);function pi(t,r){return t===null||r===null||t.length!==r.length?!1:t.every((e,i)=>e===r[i])}function hi(t){return t&&t.kind==="not"?t.item:t}var Ou=new Set(["is","is_not",">",">=","<","<=","and","or","not"]);function Da(t,r){if(!t.entity_id)return a(r,"ui.state_err_entity","Entity is required");let e=Array.isArray(t.states)?t.states:[];if(t.kind!=="is"&&t.kind!=="is_not"){let n=e[0];if(typeof n!="string"||!n.trim())return a(r,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(n)))return a(r,"ui.state_err_numeric","Value must be a number")}else if(!e.some(n=>n!==""))return a(r,"ui.state_err_state","State is required");return null}function br(t,r){if(!t||typeof t!="object")return null;if(t.kind==="not"){let e=t.item;return e?br(e,r):a(r,"ui.state_err_incomplete","This condition is incomplete")}if(t.kind==="and"||t.kind==="or"){let e=t.items;if(!Array.isArray(e)||e.length===0)return a(r,"ui.state_err_incomplete","This condition is incomplete");for(let i of e){let n=br(i,r);if(n!==null)return n}return null}return Da(t,r)}function Ha(t,r){if(t==null||typeof t!="object")return null;let e=t.kind;return typeof e!="string"||!Ou.has(e)?null:br(t,r)}var se=class extends b{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._dragFrom=null;this._dragOverPath=null;this._dragOverPos=null;this._cancelDrag=null;this._onNodeDragStart=e=>{e.stopPropagation(),this._startDrag(e.detail.path,e.detail.pointer)};this._onNodeChange=e=>{e.stopPropagation();let{path:i,value:n}=e.detail;if(this._isEmptyAtom(n)){let s=this._atomAt(i);if(s&&!this._isEmptyAtom(s)){this._openPath=null,this._removeAt(i);return}}this._replaceAt(i,n)};this._onNodeRemove=e=>{e.stopPropagation(),this._removeAt(e.detail.path)};this._onNodeWrap=e=>{e.stopPropagation(),this._wrapAt(e.detail.path)};this._onNodeAddChild=e=>{e.stopPropagation(),this._addChildAt(e.detail.path,"is")};this._onNodeToggleNot=e=>{e.stopPropagation(),this._toggleNotAt(e.detail.path)};this._onNodeSetOp=e=>{e.stopPropagation(),this._setGroupOpAt(e.detail.path,e.detail.op)};this._onNodeUnwrap=e=>{e.stopPropagation(),this._unwrapAt(e.detail.path)};this._onNodeOpen=e=>{if(e.stopPropagation(),this._openPath!==null){let i=this._atomAt(this._openPath);if(i&&this._atomError(i)!==null){this._showError=!0;return}}this._openPath!==null&&pi(this._openPath,e.detail.path)?this._openPath=null:this._openPath=e.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-drag-start",this._onNodeDragStart)}disconnectedCallback(){super.disconnectedCallback(),this._endDrag()}_emit(e){this.value=e,A(this,e)}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(e,i){let n=this._patch(this.value,e,()=>i);this._emit(n)}_removeAt(e){if(this._openPath=null,e.length===0){this._emit(null);return}let i=this._patch(this.value,e,()=>null);this._emit(i)}_wrapAt(e){let i=this._nodeAt(e),n="and";if(i&&(i.kind==="and"||i.kind==="or"))n=i.kind==="and"?"or":"and";else if(e.length>0){let o=this._nodeAt(e.slice(0,-1));o&&(o.kind==="and"||o.kind==="or")&&(n=o.kind==="and"?"or":"and")}let s=this._patch(this.value,e,o=>o&&{kind:n,items:[o]});this._emit(s)}_nodeAt(e){return this._walkNode(this.value,e)}_moveRelative(e,i){let n=this._resolveInsertion(e,i);n&&this._emit(this._rewriteInsert(this.value,[],e,n.destParent,n.insert,n.source))}_resolveInsertion(e,i){if(e.length===0||pi(e,i.path))return null;let n=this._nodeAt(e);if(!n)return null;if(i.pos==="into"){let o=hi(this._nodeAt(i.path));return!o||o.kind!=="and"&&o.kind!=="or"||this._isPrefix(e,i.path)?null:{destParent:i.path,insert:{kind:"into"},source:n}}if(i.path.length===0)return null;let s=i.path.slice(0,-1);return this._isPrefix(e,s)?null:{destParent:s,insert:{kind:i.pos,index:i.path[i.path.length-1]},source:n}}_isPrefix(e,i){return e.length>i.length?!1:e.every((n,s)=>n===i[s])}_rewriteInsert(e,i,n,s,o,d){if(!e)return e;if(e.kind==="not"){let g=this._rewriteInsert(e.item,i,n,s,o,d);return g==null?null:{kind:"not",item:g}}if(e.kind!=="and"&&e.kind!=="or")return e;let u=pi(i,n.slice(0,-1)),p=pi(i,s),h=[],_=-1;if(e.items.forEach((g,v)=>{if(u&&v===n[n.length-1])return;let x=this._rewriteInsert(g,[...i,v],n,s,o,d);x!==null&&(h.push(x),p&&o.kind!=="into"&&v===o.index&&(_=h.length-1))}),p){let g=o.kind==="into"||_<0?h.length:o.kind==="before"?_:_+1;h.splice(g,0,d)}return h.length===0?null:{...e,items:h}}_startDrag(e,i){this._endDrag(),this._dragFrom=e,this._dragOverPath=null,this._dragOverPos=null;let n=i.target?.closest(".atom-card, .group");this._cancelDrag=Zi(i,{onMove:(s,o)=>{let d=this._locateDropAt(s,o),u=d!==null&&this._resolveInsertion(e,d)!==null,p=u?d.path:null,h=u?d.pos:null;(!(pi(p,this._dragOverPath)||p===null&&this._dragOverPath===null)||h!==this._dragOverPos)&&(this._dragOverPath=p,this._dragOverPos=h)},onEnd:(s,o)=>{let d=this._locateDropAt(s,o);d&&this._moveRelative(e,d),this._endDrag()},onCancel:()=>this._endDrag()},{follow:n})}_endDrag(){this._cancelDrag?.(),this._cancelDrag=null,this._dragFrom=null,this._dragOverPath=null,this._dragOverPos=null}_nodeElementAt(e,i){let n=er(e,i);for(;n;){if(n instanceof Element&&n.localName==="ambience-state-expr-node")return n;let s=n.parentNode;s?n=s:n instanceof ShadowRoot?n=n.host:n=null}return null}_locateDropAt(e,i){let n=this._nodeElementAt(e,i),s=n?.path;if(!n||!s)return null;let o=this._nodeAt([...s]),d=hi(o),u=!!d&&(d.kind==="and"||d.kind==="or"),p=this._zoneFor(n.getBoundingClientRect(),i,{isGroup:u,isRoot:s.length===0});return p?{path:[...s],pos:p}:null}_zoneFor(e,i,n){if(n.isRoot)return n.isGroup?"into":null;if(n.isGroup){let s=Math.min(8,e.height/3);return i<e.top+s?"before":i>e.bottom-s?"after":"into"}return i<e.top+e.height/2?"before":"after"}_walkNode(e,i){return e?e.kind==="not"?this._walkNode(e.item,i):i.length===0?e:e.kind==="and"||e.kind==="or"?this._walkNode(e.items[i[0]]??null,i.slice(1)):null:null}_addChildAt(e,i){let n=null,s=this._patch(this.value,e,o=>{if(!o)return o;let d=o.kind==="not",u=hi(o);if(u.kind==="and"||u.kind==="or"){let p=[...u.items,this._emptyAtom()];n=[...e,p.length-1];let h={...u,items:p};return d?{kind:"not",item:h}:h}return o});n!==null&&(this._openPath=n),this._emit(s)}_toggleNotAt(e){let i=this._patch(this.value,e,n=>n&&(n.kind==="not"?n.item:{kind:"not",item:n}));this._emit(i)}_setGroupOpAt(e,i){let n=this._patch(this.value,e,s=>{if(!s)return s;let o=s.kind==="not",d=o?s.item:s;if(d.kind!=="and"&&d.kind!=="or")return s;let u={kind:i,items:d.items};return o?{kind:"not",item:u}:u});this._emit(n)}_patch(e,i,n){if(i.length===0)return n(e);if(e==null)return e;let[s,...o]=i;if(e.kind==="and"||e.kind==="or"){let d=e.items.length,u=e.items.slice(),p=this._patch(u[s],o,n);if(p===null?u.splice(s,1):u[s]=p,u.length<d){if(u.length===0)return null;if(u.length===1)return u[0]}return{...e,items:u}}if(e.kind==="not"){let d=this._patch(e.item,i,n);return d==null?null:{kind:"not",item:d}}return e}_isEmptyAtom(e){if(e.kind==="not")return this._isEmptyAtom(e.item);if(e.kind==="and"||e.kind==="or")return!1;let i=e;return!i.entity_id&&i.states.every(n=>n==="")&&!i.attribute&&!i.for}_atomAt(e){return this._walk(this.value,e)}_walk(e,i){return e?e.kind==="not"?this._walk(e.item,i):i.length===0?e.kind==="and"||e.kind==="or"?null:e:e.kind==="and"||e.kind==="or"?this._walk(e.items[i[0]]??null,i.slice(1)):null:null}_treeError(e=this.value){return br(e,this.hass)}_emitValidity(){let e=this._treeError();this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_atomError(e){return Da(e,this.hass)}_unwrapAt(e){if(this._openPath=null,e.length===0){let o=this.value;if(!o)return;let d=hi(o);(d.kind==="and"||d.kind==="or")&&(d.items.length===1?this._emit(d.items[0]):this._emit(null));return}let i=e.slice(0,-1),n=e[e.length-1],s=this._patch(this.value,i,o=>{if(!o||o.kind!=="and"&&o.kind!=="or")return o;let d=o.items.slice(),u=d[n],p=null;if(u.kind==="and"||u.kind==="or")p=u;else if(u.kind==="not"){let h=u.item;(h.kind==="and"||h.kind==="or")&&(p=h)}return p?(d.splice(n,1,...p.items),{...o,items:d}):o});this._emit(s)}willUpdate(e){if(e.has("value")){let i=this.value;if(i&&this._openPath===null&&i.kind!=="and"&&i.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let n=this._atomAt(this._openPath);(!n||this._atomError(n)===null)&&(this._showError=!1)}this._emitValidity()}}_addAtRoot(){let e=this.value;if(e==null){this._addFirstAtom();return}if(e.kind==="and"||e.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[e,this._emptyAtom()]})}_setOpen(e){this._openPath=e}render(){if(this.value==null)return l`
        <div class="empty">
          <button @click=${()=>this._addFirstAtom()}>
            + ${a(this.hass,"ui.state_add_first","Add clause")}
          </button>
        </div>
      `;let e=this._showError&&this._openPath!==null?(()=>{let s=this._atomAt(this._openPath);return s?this._atomError(s):null})():null,i=hi(this.value),n=i.kind!=="and"&&i.kind!=="or";return l`
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
      ${n?l`
        <button class="root-add" @click=${()=>this._addAtRoot()}>
          + ${a(this.hass,"ui.state_add_condition","Add clause")}
        </button>
      `:""}
    `}};se.styles=y`
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
  `,c([m({attribute:!1})],se.prototype,"hass",2),c([m({attribute:!1})],se.prototype,"value",2),c([f()],se.prototype,"_openPath",2),c([f()],se.prototype,"_showError",2),c([f()],se.prototype,"_dragFrom",2),c([f()],se.prototype,"_dragOverPath",2),c([f()],se.prototype,"_dragOverPos",2),se=c([w("ambience-state-predicate-input")],se);var Mu=["everybody","anybody","nobody","any","all","none"],Ia=new Set(["any","all","none"]),Dn={everybody:"everyone",anybody:"any",nobody:"nobody",any:"any",all:"everyone",none:"nobody"},ct=class extends b{constructor(){super(...arguments);this.value=null;this._lastSelected=[]}_persons(){return En(this.hass,"person")}_zones(){return En(this.hass,"zone")}_cur(){return this.value??{}}_who(){return this.value?.who??[]}_hasWhoKey(){return this.value!=null&&Array.isArray(this.value.who)}_defaultQuant(){return this.value==null?"everyone":"any"}_mode(){if(this._hasWhoKey())switch(this._cur().quant??"any"){case"any":return"any";case"everyone":return"all";case"nobody":return"none"}switch(this._cur().quant??this._defaultQuant()){case"nobody":return"nobody";case"any":return"anybody";default:return"everybody"}}_applyFor(e,i,n){if(Jt(i)){e.for=i;let s=Et(i,n);s&&(e.for_mode=s)}}_isNegativeQuant(){return Dn[this._mode()]==="nobody"}_effectiveNegate(){return!this._isNegativeQuant()&&!!this._cur().negate}_emitMode(e){let i=this._cur(),n=i.where??"home",s={quant:Dn[e],where:n};i.negate&&Dn[e]!=="nobody"&&(s.negate=!0),Ia.has(e)&&(this._hasWhoKey()?s.who=[...this._who()]:this._lastSelected.length>0?s.who=[...this._lastSelected]:s.who=this._persons().map(o=>o.id)),this._applyFor(s,i.for,i.for_mode),this._emit(s)}_emit(e){this.value=e,A(this,e)}_setMode(e){this._emitMode(e)}_setWhere(e){let i=this._cur(),n={quant:i.quant??this._defaultQuant(),where:e};this._effectiveNegate()&&(n.negate=!0),this._hasWhoKey()&&(n.who=[...this._who()]),this._applyFor(n,i.for,i.for_mode),this._emit(n)}_setNegate(e){let i=this._cur(),n={quant:i.quant??this._defaultQuant(),where:i.where??"home"};e&&(n.negate=!0),this._hasWhoKey()&&(n.who=[...this._who()]),this._applyFor(n,i.for,i.for_mode),this._emit(n)}_togglePerson(e,i){let n=i?[...this._who(),e]:this._who().filter(d=>d!==e);n.length>0&&(this._lastSelected=[...n]);let s=this._cur(),o={quant:s.quant??"any",where:s.where??"home",who:n};this._effectiveNegate()&&(o.negate=!0),this._applyFor(o,s.for,s.for_mode),this._emit(o)}_setFor(e){let{mode:i,...n}=e,s=this._cur(),o={quant:s.quant??this._defaultQuant(),where:s.where??"home"};this._effectiveNegate()&&(o.negate=!0),this._hasWhoKey()&&(o.who=[...this._who()]),this._applyFor(o,n,i??"at_least"),this._emit(o)}_modeLabel(e){switch(e){case"everybody":return a(this.hass,"ui.people_mode_everybody","Everybody");case"anybody":return a(this.hass,"ui.people_mode_anybody","Anybody");case"nobody":return a(this.hass,"ui.people_mode_nobody","Nobody");case"any":return a(this.hass,"ui.people_mode_any","Any of:");case"all":return a(this.hass,"ui.people_mode_all","All of:");case"none":return a(this.hass,"ui.people_mode_none","None of:")}}_renderMode(e){return ne(this.hass,"mode",e,Mu.map(i=>({value:i,label:this._modeLabel(i)})),i=>this._setMode(i))}_renderPeople(){let e=this._persons();if(e.length===0)return l`<div class="hint">${a(this.hass,"ui.people_none_tracked","No people tracked")}</div>`;let i=this._who();return l`<div class="people-list">
      ${e.map(n=>l`<label class="person-pill">
        <input
          type="checkbox"
          .checked=${i.includes(n.id)}
          @change=${s=>this._togglePerson(n.id,s.target.checked)}
        />${n.name}
      </label>`)}
    </div>
    <div class="field-error">${i.length===0?a(this.hass,"ui.people_select_one","Select at least one person"):""}</div>`}_renderNegate(e){return ne(this.hass,"negate",e?"true":"false",[{value:"false",label:a(this.hass,"ui.people_is_at","Is at")},{value:"true",label:a(this.hass,"ui.people_is_not_at","Is not at")}],i=>this._setNegate(i==="true"))}_renderWhere(e){let i=this._zones().filter(n=>n.id!=="zone.home");return ne(this.hass,"where",e,[{value:"home",label:a(this.hass,"ui.people_where_home","Home")},...i.map(n=>({value:n.id,label:n.name}))],n=>this._setWhere(n))}_renderFor(){return l`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this._cur().for??null}
      .mode=${this._cur().for_mode??"at_least"}
      @value-changed=${e=>{e.stopPropagation(),this._setFor(e.detail.value)}}
    ></ambience-for-duration>`}render(){let i=this._cur().where??"home",n=this._mode(),s=!this._isNegativeQuant(),o=this._effectiveNegate();return l`
      <div class="row">${this._renderMode(n)}</div>
      ${Ia.has(n)?this._renderPeople():""}
      <div class="row">
        ${s?this._renderNegate(o):l`<span class="label negate-static">${a(this.hass,"ui.people_is_at_static","is at")}</span>`}
        ${this._renderWhere(i)}
      </div>
      <div class="row">
        <span class="label">${a(this.hass,"ui.people_for","for")}</span>
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
  `,c([m({attribute:!1})],ct.prototype,"hass",2),c([m({attribute:!1})],ct.prototype,"value",2),ct=c([w("ambience-people-predicate-input")],ct);var ut=class extends b{constructor(){super(...arguments);this.value=null}_cur(){return this.value??{sensors:[]}}_sensors(){return this._cur().sensors??[]}_showQuant(){return this._sensors().length>1}_build(e){let i={...this._cur(),...e},n={sensors:i.sensors??[]};if(i.occupied===!1&&(n.occupied=!1),i.quant==="all"&&(n.quant="all"),Jt(i.for)){n.for=i.for;let s=Et(i.for,i.for_mode);s&&(n.for_mode=s)}return i.negate===!0&&(n.negate=!0),n}_emit(e){this.value=e,A(this,e)}_setSensors(e){this._emit(e.length?this._build({sensors:e}):null)}_setOccupied(e){this._emit(this._build({occupied:e}))}_setNegate(e){this._emit(this._build({negate:e}))}_setQuant(e){this._emit(this._build({quant:e}))}_setFor(e){let{mode:i,...n}=e;this._emit(this._build({for:n,for_mode:i??"at_least"}))}_sensorSchema(){return[{name:"sensors",selector:{entity:{domain:"binary_sensor",device_class:["occupancy","presence","motion"],multiple:!0}}}]}_renderSensors(){return Ht(this.hass,this._sensorSchema(),this._sensors(),"binary_sensor.a, binary_sensor.b",e=>this._setSensors(e))}_renderNegate(e){return ne(this.hass,"negate",e?"is_not":"is",[{value:"is",label:a(this.hass,"ui.occupancy_is","is")},{value:"is_not",label:a(this.hass,"ui.occupancy_is_not","is not")}],i=>this._setNegate(i==="is_not"))}_renderOccupied(e){return ne(this.hass,"state",e?"occupied":"vacant",[{value:"occupied",label:a(this.hass,"ui.occupancy_detected","Detected")},{value:"vacant",label:a(this.hass,"ui.occupancy_clear","Clear")}],i=>this._setOccupied(i==="occupied"))}_renderQuant(e){return ne(this.hass,"quant",e,[{value:"any",label:a(this.hass,"ui.occupancy_any","Any of")},{value:"all",label:a(this.hass,"ui.occupancy_all","All of")}],i=>this._setQuant(i))}_renderFor(){return l`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this._cur().for??null}
      .mode=${this._cur().for_mode??"at_least"}
      @value-changed=${e=>{e.stopPropagation(),this._setFor(e.detail.value)}}
    ></ambience-for-duration>`}render(){let e=this._cur(),i=e.occupied!==!1,n=e.negate===!0,s=e.quant==="all"?"all":"any";return l`
      ${this._showQuant()?l`<div class="row">${this._renderQuant(s)}</div>`:""}
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._renderNegate(n)}
        ${this._renderOccupied(i)}
      </div>
      <div class="row">
        <span class="label">${a(this.hass,"ui.occupancy_for","for")}</span>
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
  `,c([m({attribute:!1})],ut.prototype,"hass",2),c([m({attribute:!1})],ut.prototype,"value",2),ut=c([w("ambience-occupancy-predicate-input")],ut);function Na(t,r){if(t==null)return null;let e=t.entities;return!Array.isArray(e)||e.length===0?a(r,"ui.unavailable_select_one","Select at least one entity"):null}var Fu=[{name:"sensors",selector:{entity:{multiple:!0}}}],pt=class extends b{constructor(){super(...arguments);this.value=null}_entities(){return this.value?.entities??[]}_setEntities(e){let i=e.length?{entities:e}:null;this.value=i,A(this,i)}render(){return l`
      <div class="row">
        ${Ht(this.hass,Fu,this._entities(),"binary_sensor.a, light.b",e=>this._setEntities(e))}
      </div>
    `}};pt.styles=y`
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
  `,c([m({attribute:!1})],pt.prototype,"hass",2),c([m({attribute:!1})],pt.prototype,"value",2),pt=c([w("ambience-unavailable-predicate-input")],pt);var ju=new Set(["1","true","yes","on","enable"]);function Oa(t){return t==null?!1:typeof t=="boolean"?t:typeof t=="number"?t!==0:typeof t=="string"?ju.has(t.toLowerCase().trim()):!1}function zu(t){if(t!==null&&typeof t=="object")try{return JSON.stringify(t)}catch{return String(t)}return String(t)}var Ve=class extends b{constructor(){super(...arguments);this.value=null;this._preview=null;this._debounceMs=250;this._gen=0}_template(){return this.value&&typeof this.value=="object"?this.value.template:""}willUpdate(e){if(!e.has("value")&&!e.has("hass"))return;let i=this._template(),n=this.hass?.connection;i===this._activeTemplate&&n===this._activeConn||(this._activeTemplate=i,this._activeConn=n,this._scheduleRender())}disconnectedCallback(){super.disconnectedCallback(),this._teardown()}_teardown(){this._debounceTimer!=null&&(clearTimeout(this._debounceTimer),this._debounceTimer=void 0),this._unsub&&(this._unsub(),this._unsub=void 0)}_scheduleRender(){this._teardown();let e=this._template();if(!e.trim()||!this.hass?.connection?.subscribeMessage){this._setPreview(null);return}let i=++this._gen;this._debounceTimer=setTimeout(()=>this._subscribe(e,i),this._debounceMs)}async _subscribe(e,i){let n=this.hass?.connection;if(n?.subscribeMessage)try{let s=await n.subscribeMessage(o=>{i===this._gen&&this._setPreview(o.error!=null?{error:o.error}:{value:zu(o.result),truthy:Oa(o.result)})},{type:"render_template",template:e,report_errors:!0});if(i!==this._gen){s();return}this._unsub=s}catch(s){if(i!==this._gen)return;this._setPreview({error:s?.message??String(s)})}}_setPreview(e){this._preview=e,this._emitValidity(e!=null&&"error"in e?e.error:null)}_emitValidity(e){this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_onInput(e){let i=e.target.value,n=i.trim()===""?null:{template:i};this.value=n,A(this,n)}_renderPreview(){let e=this._preview;return e==null?"":"error"in e?l`<div class="preview error">
        <div class="body">
          <span class="label">${a(this.hass,"ui.template_result","Result")}</span><span class="value">${e.error}</span>
        </div>
      </div>`:l`<div class="preview">
      <div class="body">
        <span class="label">${a(this.hass,"ui.template_result","Result")}</span><span class="value">${e.value}</span>
      </div>
      <span class="bool ${e.truthy?"true":"false"}"
        >${e.truthy?a(this.hass,"ui.template_truthy","true \u2014 matches"):a(this.hass,"ui.template_falsy","false \u2014 no match")}</span
      >
    </div>`}render(){return l`
      <textarea
        spellcheck="false"
        .value=${this._template()}
        placeholder="{{ is_state('binary_sensor.guests','on') }}"
        @input=${this._onInput}
      ></textarea>
      ${this._renderPreview()}
    `}};Ve.styles=y`
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
  `,c([m({attribute:!1})],Ve.prototype,"value",2),c([m({attribute:!1})],Ve.prototype,"hass",2),c([f()],Ve.prototype,"_preview",2),Ve=c([w("ambience-template-predicate-input")],Ve);var oe=class extends b{constructor(){super(...arguments);this.value=null;this._onChild=e=>{e.stopPropagation(),this._emit(e.detail.value)}}_emit(e){A(this,e)}_onText(e){let i=e.target.value;this._emit(i.trim()===""?null:i)}render(){return this.condition.input==="time_of_day"?l`
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
        placeholder=${a(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.condition.predicate_help}</div>
    `}};oe.styles=y`
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
  `,c([m({attribute:!1})],oe.prototype,"condition",2),c([m({attribute:!1})],oe.prototype,"value",2),c([m({attribute:!1})],oe.prototype,"periods",2),c([m({attribute:!1})],oe.prototype,"luxRanges",2),c([m({attribute:!1})],oe.prototype,"dayConfig",2),c([m({attribute:!1})],oe.prototype,"weatherConfig",2),c([m({attribute:!1})],oe.prototype,"hass",2),oe=c([w("ambience-condition-input")],oe);function qu(t){return t!=null&&typeof t=="object"&&Array.isArray(t.who)&&t.who.length===0}function Uu(t){return t==="people"?{quant:"everyone",where:"home"}:null}function Ma(t,r){return!!t&&!!r&&D(t)===D(r)}var Wu={state:Ha,day:La,lux:Aa,unavailable:Na},E=class extends b{constructor(){super(...arguments);this.open=!1;this.scene=null;this.conditions=[];this.availableActions=[];this.categories=[];this.schemas={};this.scopes=[];this.takenNames=new Map;this.saveError="";this.scopeChangedElsewhere=!1;this._staleAcknowledged=!1;this._draft=null;this._open=null;this._showError=!1;this._addOrder=[];this._serviceHasTarget=new Map;this._conditionError=new Map;this._onNameInput=e=>{this._setName(e.target.value)};this._onDescriptionInput=e=>{this._setDescription(e.target.value)};this._onDescriptionHaForm=e=>{e.stopPropagation(),this._setDescription(e.detail.value.description??"")};this._descriptionLabel=()=>a(this.hass,"ui.description","Description");this._onAddCondition=e=>{let i=e.target,n=i.value;i.value="",this._addCondition(n)};this._onAddConditionHaForm=e=>{e.stopPropagation();let i=e.detail.value.add;i!==E._ADD_CONDITION_PLACEHOLDER&&this._addCondition(i)};this._onAddAction=e=>{let i=e.target,n=i.value;i.value="",this._addActionSlot(n)};this._onAddActionHaForm=e=>{e.stopPropagation();let i=e.detail.value.add;i!==E._ADD_ACTION_PLACEHOLDER&&this._addActionSlot(i)};this._onApplyToggle=e=>{if(!this._draft)return;let i={...this._draft};e.target.checked?i.apply="always":delete i.apply,this._draft=i}}_onConditionInvalid(e,i){i?this._conditionError.set(e,i):this._conditionError.delete(e)}connectedCallback(){super.connectedCallback(),ie(this)}willUpdate(e){e.has("open")&&this.open&&(this._draft=this.scene?JSON.parse(JSON.stringify(this.scene)):null,this._scope=this.scope,this._open=null,this._showError=!1,this._addOrder=[],this._conditionError=new Map,this._staleAcknowledged=!1),e.has("scopeChangedElsewhere")&&!this.scopeChangedElsewhere&&(this._staleAcknowledged=!1)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_setDestination(e){let i=this.scopes[e];if(!i||!this._draft||(this._scope=i.scope,!this.hass))return;let n=new Set(Yi(this.hass,this._scope,[]));this._draft={...this._draft,actions:this._draft.actions.map(s=>({...s,entity_ids:s.entity_ids.filter(o=>n.has(o))}))}}_renderDestination(){return l`
      <div class="scope-menu" role="listbox">
        ${this.scopes.map((e,i)=>l`<button
            class="scope-option"
            role="option"
            aria-selected=${Ma(e.scope,this._scope)}
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
      `;let e=this.scopes.find(i=>Ma(i.scope,this._scope))??this.scopes[0];return l`
      <div class="slot collapsed" data-slot-id="destination">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"destination"})}>
          <strong>${a(this.hass,"ui.scope","Scope")}:</strong>
          <ha-icon class="scope-icon" icon=${Qt(e.scope,this.hass)}></ha-icon>
          <span class="scope-name">${e.label}</span>
        </div>
      </div>
    `}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"})){let s=this._showError?this._nameError():null;return l`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
          ${s?l`<div class="error">${s}</div>`:""}
        </div>
      `}let n=sr(this._draft,a(this.hass,"ui.new_scene","New scene"));return l`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${n}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let i=ts();return i==="ha-input"?l`<ha-input label=${a(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:i==="ha-textfield"?l`<ha-textfield label=${a(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:l`<input type="text" .value=${e} @input=${this._onNameInput} />`}_setDescription(e){this._draft&&(this._draft={...this._draft,description:e.trim()?e:void 0})}_renderDescriptionHaForm(e){return l`
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
      placeholder=${a(this.hass,"ui.description","Description")}
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
          ${a(this.hass,"ui.add_description","+ Add description")}
        </button>
      </div>
    `}_setCategory(e){!this._draft||!e||e===this._draft.category||(this._draft={...Yt(this._draft),category:e})}_renderCategorySlot(){if(this.categories.length===0)return"";let e=[...this.categories].sort((s,o)=>s.name.localeCompare(o.name)),i=this._effectiveCategoryId(),n=this.categories.find(s=>s.id===i)??e[0];return this._isOpen({kind:"category"})?l`
        <div class="slot category-slot expanded" data-slot-id="category">
          <div class="category-menu" role="listbox">
            ${e.map(s=>l`<button
                class="category-option"
                role="option"
                aria-selected=${s.id===i}
                @click=${()=>{this._setCategory(s.id),this._open=null}}
              >
                ${bt(s.color,s.icon)}
                <span class="category-name">${s.name}</span>
              </button>`)}
          </div>
        </div>
      `:l`
      <div class="slot collapsed" data-slot-id="category">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"category"})}>
          <strong>${a(this.hass,"ui.category","Category")}:</strong>
          ${bt(n.color,n.icon)}
          <span class="category-name">${n.name}</span>
        </div>
      </div>
    `}_isOpen(e){let i=this._open;return i===null||i.kind!==e.kind?!1:e.kind==="condition"&&i.kind==="condition"?e.id===i.id:e.kind==="action"&&i.kind==="action"?e.idx===i.idx:!0}_effectiveCategoryId(){return this._draft?.category?this._draft.category:[...this.categories].sort((i,n)=>i.name.localeCompare(n.name))[0]?.id??""}_nameError(){let e=this._draft?.name?.trim().toLowerCase();if(!e||!this._scope)return null;let i=Ki(this._scope,this._effectiveCategoryId());return this.takenNames.get(i)?.has(e)?a(this.hass,"ui.name_duplicate","A scene with this name already exists in this category."):null}_validationError(e){if(e===null||e.kind==="category"||e.kind==="destination"||e.kind==="description")return null;if(e.kind==="name")return this._nameError();if(e.kind==="condition"){let s=this._draft?.when[e.id];if(qu(s))return a(this.hass,"ui.people_select_one","Select at least one person");let o=Wu[e.id]?.(s,this.hass);return o||(this._conditionError.has(e.id)?a(this.hass,"ui.condition_error","Fix the error in this condition before continuing"):null)}let i=this._draft?.actions[e.idx];if(!i)return null;let n=this._serviceHasTarget.get(i.service);return i.entity_ids.length===0&&n===!0?a(this.hass,"ui.at_least_one_target","At least one target is required."):null}_leaveBlockingError(e){return e?.kind==="name"?null:this._validationError(e)}_tryCloseCurrent(){return this._open===null?!0:this._leaveBlockingError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){if(this._leaveBlockingError(e)!==null){this._showError=!0;return}this._open=null,this._showError=!1;return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let i of e.composedPath())if(i instanceof Element&&(i.classList.contains("slot")||i.classList.contains("actions-bar")||i.classList.contains("add-condition")||i.classList.contains("add-action")||i.classList.contains("add-description")))return;this._tryCloseCurrent()}_setPredicate(e,i){if(!this._draft)return;let n={...this._draft.when};i==null?delete n[e]:n[e]=i,this._draft={...this._draft,when:n}}_renderConditionRow(e){let i=this._draft.when[e.name]??null,n=this._isOpen({kind:"condition",id:e.name}),s=Lt(e.name,i,{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges});return l`
      <div class="slot ${n?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"condition",id:e.name})}>
          <span class="summary-label"><strong>${G(this.hass,e.name)}:</strong> ${s}</span>
          <ambience-help .hass=${this.hass} .docPath=${Xi(e.name)??""}></ambience-help>
          <button
            class="remove"
            @click=${o=>{o.stopPropagation(),this._removeCondition(e.name)}}
            title=${a(this.hass,"ui.remove_condition","Remove condition")}
          >✕</button>
        </div>
        ${n?l`
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

            ${this._showError&&this._validationError({kind:"condition",id:e.name})?l`
              <div class="error">${this._validationError({kind:"condition",id:e.name})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_visibleConditions(){if(!this._draft)return[];let e=this._draft.when,i=this.conditions.filter(d=>d.name in e&&e[d.name]!=null||this._open?.kind==="condition"&&this._open.id===d.name),n=new Set(this._addOrder),s=i.filter(d=>!n.has(d.name)),o=this._addOrder.map(d=>i.find(u=>u.name===d)).filter(d=>d!=null);return[...s,...o]}_unusedConditions(){let e=new Set(this._visibleConditions().map(i=>i.name));return this.conditions.filter(i=>!e.has(i.name)).sort((i,n)=>G(this.hass,i.name).localeCompare(G(this.hass,n.name)))}_addCondition(e){if(!e||this._open!==null&&!this._tryCloseCurrent())return;let i=Uu(e);i!=null&&this._draft&&!(e in this._draft.when)&&(this._draft={...this._draft,when:{...this._draft.when,[e]:i}}),this._addOrder=[...this._addOrder.filter(n=>n!==e),e],this._open={kind:"condition",id:e},this._showError=!1}_removeCondition(e){if(!this._draft)return;let i={...this._draft.when};delete i[e],this._draft={...this._draft,when:i},this._conditionError.delete(e),this._open?.kind==="condition"&&this._open.id===e&&(this._open=null,this._showError=!1)}_conditionDisabled(e){return e==="weather"&&!this.weatherConfig?.entity}_renderAddCondition(){let e=this._unusedConditions();return e.length===0?"":customElements.get("ha-form")?this._renderAddConditionHaForm(e):l`
      <div class="add-condition">
        <select class="add-condition" @change=${this._onAddCondition}>
          <option value="">${a(this.hass,"ui.add_condition","+ Add condition\u2026")}</option>
          ${e.map(i=>l`<option value=${i.name} ?disabled=${this._conditionDisabled(i.name)}>${G(this.hass,i.name)}</option>`)}
        </select>
      </div>
    `}_renderAddConditionHaForm(e){let i=a(this.hass,"ui.add_condition","+ Add condition\u2026"),n=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:E._ADD_CONDITION_PLACEHOLDER,label:i},...e.map(s=>({value:s.name,label:G(this.hass,s.name),disabled:this._conditionDisabled(s.name)}))]}}}];return l`
      <div class="add-condition">
        <ha-form
          .hass=${this.hass}
          .schema=${n}
          .data=${{add:E._ADD_CONDITION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddConditionHaForm}
        ></ha-form>
      </div>
    `}_addActionSlot(e){if(!this._draft||!e||this._open!==null&&!this._tryCloseCurrent())return;let i={service:e,entity_ids:[],params:{}},n=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,i]},this._open={kind:"action",idx:n},this._showError=!1}_actionOptionLabel(e){return e.label?.trim()?e.label:this.schemas[e.id]?.name?.trim()||e.id}_renderAddAction(){return this.availableActions.length===0?l`
        <p class="add-action-empty">
          ${a(this.hass,"ui.no_exposed_actions","Add services in Settings \u2192 Actions.")}
        </p>
      `:customElements.get("ha-form")?this._renderAddActionHaForm():l`
      <div class="add-action">
        <select class="add-action" @change=${this._onAddAction}>
          <option value="">${a(this.hass,"ui.add_action","+ Add action\u2026")}</option>
          ${this.availableActions.map(e=>l`
            <option value=${e.id}>${this._actionOptionLabel(e)}</option>
          `)}
        </select>
      </div>
    `}_renderAddActionHaForm(){let e=a(this.hass,"ui.add_action","+ Add action\u2026"),i=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:E._ADD_ACTION_PLACEHOLDER,label:e},...this.availableActions.map(n=>({value:n.id,label:this._actionOptionLabel(n)}))]}}}];return l`
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
          ${a(this.hass,"ui.apply_on_every_match","Apply on every match")}
          <ambience-help
            .hass=${this.hass}
            .text=${a(this.hass,"ui.help_apply_on_every_match","When on, Ambience re-applies this scene's actions every time it wins its scope/category, not just the first time it becomes the active scene.")}
            .docPath=${"reference/actions/apply-on-every-match"}
          ></ambience-help>
        </label>
        ${$t({checked:this._draft.apply==="always",dataTest:"apply-on-every-match",onChange:this._onApplyToggle})}
      </div>
    `}_updateActionAt(e,i){if(!this._draft)return;let n=this._draft.actions.map((s,o)=>o===e?i(s):s);this._draft={...this._draft,actions:n}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((i,n)=>n!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,i){this._updateActionAt(e,n=>({...n,entity_ids:i}))}_setActionParams(e,i){this._updateActionAt(e,n=>({...n,params:i}))}_onTargetModeChanged(e,i){this._serviceHasTarget.get(e)!==i&&(this._serviceHasTarget=new Map(this._serviceHasTarget).set(e,i))}_renderActionRow(e,i){let n=this.availableActions.find(u=>u.id===e.service),s=this._isOpen({kind:"action",idx:i}),o=Oo(e,{hass:this.hass,exposedActions:this.availableActions,schemas:this.schemas}),d=n===void 0?a(this.hass,"ui.action_unavailable","Action no longer available; configure it in Settings \u2192 Actions or remove this action."):null;return l`
      <div class="slot ${s?"expanded":"collapsed"}" data-slot-id="action-${i}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:i})}>
          ${d?l`<ambience-problem-flag
                  .severity=${"error"}
                  .summary=${d}
                  .details=${[d]}
                ></ambience-problem-flag>`:""}
          <span class="summary-label">${o}</span>
          <button class="remove" @click=${u=>{u.stopPropagation(),this._deleteAction(i)}} title=${a(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${s?l`
          <div class="body">
            <ambience-action-slot
              .hass=${this.hass}
              .scope=${this._scope}
              .service=${e.service}
              .exposed=${n}
              .entityIds=${e.entity_ids}
              .excludeEntities=${wo(this._draft?.actions??[],i)}
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
    `}render(){if(!this._draft)return l``;let e=this._visibleConditions();return l`
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
          ${this.saveError?l`<div class="error save-error">${this.saveError}</div>`:""}
          <button class="secondary" @click=${this._cancel}>${a(this.hass,"ui.cancel","Cancel")}</button>
          <button class="primary" @click=${this._save}>${a(this.hass,"ui.save_scene","Save scene")}</button>
        </div>
        ${this._renderConflictDialog()}
      </div>
    `}};E.styles=[qi,y`
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
  `],E._DESCRIPTION_SCHEMA=[{name:"description",selector:{text:{multiline:!0}}}],E._ADD_CONDITION_PLACEHOLDER="__add_condition__",E._ADD_ACTION_PLACEHOLDER="__add_action__",c([m({type:Boolean,reflect:!0})],E.prototype,"open",2),c([m({attribute:!1})],E.prototype,"scene",2),c([m({attribute:!1})],E.prototype,"conditions",2),c([m({attribute:!1})],E.prototype,"periods",2),c([m({attribute:!1})],E.prototype,"luxRanges",2),c([m({attribute:!1})],E.prototype,"dayConfig",2),c([m({attribute:!1})],E.prototype,"weatherConfig",2),c([m({attribute:!1})],E.prototype,"availableActions",2),c([m({attribute:!1})],E.prototype,"categories",2),c([m({attribute:!1})],E.prototype,"schemas",2),c([m({attribute:!1})],E.prototype,"hass",2),c([m({attribute:!1})],E.prototype,"scope",2),c([m({attribute:!1})],E.prototype,"scopes",2),c([m({attribute:!1})],E.prototype,"takenNames",2),c([m({attribute:!1})],E.prototype,"saveError",2),c([m({attribute:!1})],E.prototype,"scopeChangedElsewhere",2),c([f()],E.prototype,"_staleAcknowledged",2),c([f()],E.prototype,"_draft",2),c([f()],E.prototype,"_scope",2),c([f()],E.prototype,"_open",2),c([f()],E.prototype,"_showError",2),c([f()],E.prototype,"_addOrder",2),c([f()],E.prototype,"_serviceHasTarget",2),E=c([w("ambience-scene-editor")],E);function Vu(t,r,e,i){return r==="time_of_day"?pe(t,e,i):r==="weather"?yt(t,e):e}var xr=y`
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
`;function Fa(t,r){t.stopPropagation(),t.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:r},bubbles:!0,composed:!0}))}function Hn(t,r,e){let i=n=>{(n.key==="Enter"||n.key===" ")&&!n.repeat&&(n.preventDefault(),Fa(n,r))};return l`<span
    class="entity-link"
    role="button"
    tabindex="0"
    title=${a(t,"ui.show_more_info","Show more info")}
    @click=${n=>Fa(n,r)}
    @keydown=${i}
    >${e}</span
  >`}function ja(t,r){return Hn(t,r,ze(t,r))}var Bu=new Set(["occupancy","people","lux","state"]);function Gu(t,r,e,i){if(!i?.length||!Bu.has(r))return e;let n=[],s=i.map(u=>({id:u,name:ze(t,u)})).sort((u,p)=>p.name.length-u.name.length);for(let{id:u,name:p}of s)for(let h=0;h<=e.length;){let _=e.indexOf(p,h);if(_===-1)break;let g=_+p.length;if(!n.some(v=>_<v.end&&v.start<g)){n.push({start:_,end:g,id:u,name:p});break}h=_+1}if(n.length===0)return e;n.sort((u,p)=>u.start-p.start);let o=[],d=0;for(let u of n)u.start>d&&o.push(e.slice(d,u.start)),o.push(Hn(t,u.id,u.name)),d=u.end;return d<e.length&&o.push(e.slice(d)),l`${o}`}var Ku={has_time:["ui.cause_has_time","Periodic time check"],switch:["ui.cause_switch","Switch turned on"],manual:["ui.cause_manual","Manual apply"],startup:["ui.cause_startup","Startup"],reloaded:["ui.cause_reloaded","Reloaded"],simulated:["ui.cause_simulated","Simulation"]},Yu={clock:["ui.cause_clock","Time of day"],sun:["ui.cause_sun","Sun position"],reapply:["ui.cause_reapply","Re-run"]};function be(t){return t??"?"}function za(t,r){if(r.kind==="entity")return`${r.entity_id} ${be(r.old)} \u2192 ${be(r.new)}`;if(r.kind==="duration"){let s=a(t,"ui.cause_duration_for","for");return r.entity_id?`${r.entity_id} ${be(r.new)} ${s} ${be(r.detail)}`:`${be(r.new)} ${s} ${be(r.detail)}`}let e=Ku[r.kind];if(e)return a(t,e[0],e[1]);let i=Yu[r.kind],n=i?a(t,i[0],i[1]):j(r.kind);return r.detail?`${n} ${r.detail}`:n}function Qu(t,r){if(!$r(r)||!r.entity_id)return l`${za(t,r)}`;let e=Hn(t,r.entity_id,r.entity_id);return r.kind==="duration"?l`${e} ${be(r.new)} ${a(t,"ui.cause_duration_for","for")} ${be(r.detail)}`:l`${e} ${be(r.old)} → ${be(r.new)}`}function $r(t){return t.kind==="entity"||t.kind==="duration"&&!!t.entity_id}function qa(t,r){let e=t.entity_id?r?.states?.[t.entity_id]:void 0,i=n=>n===null?"?":Re(r,e,null,n);return{old:i(t.old),new:i(t.new)}}function Ju(t,r){if(!$r(t))return za(r,t);let e=t.entity_id?ze(r,t.entity_id):"?",i=qa(t,r);return t.kind==="duration"?`${e}: ${i.new} ${a(r,"ui.cause_duration_for","for")} ${t.detail??"?"}`:`${e}: ${i.old} \u2192 ${i.new}`}function Xu(t,r){if(!$r(t)||!t.entity_id)return l`${Ju(t,r)}`;let e=ja(r,t.entity_id),i=qa(t,r);return t.kind==="duration"?l`${e}: ${i.new} ${a(r,"ui.cause_duration_for","for")} ${t.detail??"?"}`:l`${e}: ${i.old} → ${i.new}`}var Zu={acted:["ui.outcome_label_acted","applied"],no_op:["ui.outcome_label_no_op","blocked"],debounced:["ui.outcome_label_debounced","unchanged"],no_match:["ui.outcome_label_no_match","no match"],skipped_switch_off:["ui.outcome_label_skipped","skipped"],skipped_scope_disabled:["ui.outcome_label_skipped","skipped"],skipped_unavailable:["ui.outcome_label_skipped","skipped"]};function ep(t,r){let e=Zu[r];return e?a(t,e[0],e[1]):r.replace(/_/g," ")}function wr(t,r,e,i,n,s){return r===1?a(t,e,n,{n:String(r)}):a(t,i,s,{n:String(r)})}function Ua(t,r){let e=r.winner_name??a(t,"ui.winner_default","The matching scene");switch(r.outcome){case"acted":{let i=r.actions.filter(p=>!p.unexposed),n=r.actions.length-i.length;if(i.length===0&&n){let p=wr(t,n,"ui.count_action_one","ui.count_action_other","{n} action","{n} actions");return a(t,"ui.outcome_summary_acted_all_skipped","{winner} matched \u2014 {skipped_phrase} skipped (not exposed); nothing applied.",{winner:e,skipped_phrase:p})}let s=wr(t,i.length,"ui.count_action_one","ui.count_action_other","{n} action","{n} actions"),o=Va(i),d=n?a(t,"ui.outcome_summary_skipped_tail"," ({skipped} skipped \u2014 not exposed)",{skipped:String(n)}):"",u=wr(t,o,"ui.count_entity_one","ui.count_entity_other","{n} entity","{n} entities");return o?a(t,"ui.outcome_summary_acted_entities","Applied {winner} \u2014 {acts} on {entities}.{tail}",{winner:e,acts:s,entities:u,tail:d}):a(t,"ui.outcome_summary_acted","Applied {winner} \u2014 {acts}.{tail}",{winner:e,acts:s,tail:d})}case"no_op":return a(t,"ui.outcome_summary_no_op","{winner} matched but has no actions \u2014 it blocks lower scenes from applying. Nothing changed.",{winner:e});case"debounced":return a(t,"ui.outcome_summary_debounced","{winner} matched, but it's already applied \u2014 nothing was re-sent.",{winner:e});case"no_match":return a(t,"ui.outcome_summary_no_match","No scene matched \u2014 nothing applied.");case"skipped_switch_off":return a(t,"ui.outcome_summary_skipped_switch_off","Skipped \u2014 the scope's pause switch is off.");case"skipped_scope_disabled":return a(t,"ui.outcome_summary_skipped_scope_disabled","Skipped \u2014 the scope is disabled.");case"skipped_unavailable":return a(t,"ui.outcome_summary_skipped_unavailable","Skipped \u2014 the triggering entity went unavailable; devices left as they are.");default:return""}}function Wa(t,r,e){return gt(t,r,()=>e?.[t]?.name?.trim()||Li(t))}function tp(t,r,e,i){let n=Object.entries(t.params??{}).filter(([,o])=>o!=null&&o!=="").map(([o,d])=>`${ii(o,t.service,e)}: ${Me(r,d)}`).join(", "),s=Wa(t.service,i,e);return n?`${s} \xB7 ${n}`:s}function Va(t){return t.reduce((r,e)=>r+(e.entity_ids?.length??0),0)}function ip(t){return t==="skipped_switch_off"||t==="skipped_scope_disabled"||t==="skipped_unavailable"}function rp(t,r,e){let i=r.detail??"";return r.detail_key?a(t,`trace_reason.${r.detail_key}`,i,r.detail_placeholders??{}):Vu(t,r.condition_key,i,e)}function np(t,r,e){let i=t.index+1,n=a(r,"ui.trace_scene_prefix","Scene #");return t.disabled?l`<div class="scene disabled">${n}${i} ${t.name??"\u2014"}: ${a(r,"ui.trace_scene_disabled","disabled")}</div>`:t.evaluated?l`
    <div class="scene ${t.matched?"won":""}">${n}${i} ${t.name??"\u2014"}: ${t.matched?a(r,"ui.trace_scene_matched","\u2713 matched"):a(r,"ui.trace_scene_no_match","\u2717 no match")}</div>
    ${t.predicates.map(s=>l`
        <div class="pred ${s.passed?"pass":"fail"}" style="padding-left:1rem">
          ${s.passed?"\u2713":"\u2717"} ${G(r,s.condition_key)}${s.detail?l` <span class="dim">[${Gu(r,s.condition_key,rp(r,s,e),s.entity_ids)}]</span>`:$}
        </div>`)}
  `:l`<div class="scene skipped">${n}${i} ${t.name??"\u2014"}: ${a(r,"ui.trace_scene_not_reached","not reached")}</div>`}function kr(t,r,e,i,n,s={},o){let d=t.actions.filter(g=>!g.unexposed),u=d.map(g=>Wa(g.service,o,n)).join(", "),p=Va(d),h=t.explanation!==null||t.actions.length>0||ip(t.outcome),_=g=>{(g.key==="Enter"||g.key===" ")&&!g.repeat&&(g.preventDefault(),e())};return l`
    <div class="eval">
      <div
        class="outcome ${t.outcome}${h?" clickable":""}"
        role=${h?"button":$}
        tabindex=${h?"0":$}
        aria-expanded=${h?r:$}
        @click=${h?e:void 0}
        @keydown=${h?_:void 0}
      >
        <span class="label">${ep(i,t.outcome)}</span>
        <span class="ts">${t.timestamp?new Date(t.timestamp).toLocaleTimeString():""}</span>
      </div>
      <div class="eval-body">
        <div class="cause-line">${a(i,"ui.trigger_prefix","Trigger: ")}${Xu(t.cause,i)}</div>
        ${t.winner_name?l`<div class="won">${a(i,"ui.trace_won_prefix","Won: ")}<span class="name">${t.winner_name}</span></div>`:$}
        ${d.length?l`<div class="action-summary">→ ${u}
              ${p?l`<span class="n">· ${wr(i,p,"ui.count_entity_one","ui.count_entity_other","{n} entity","{n} entities")}</span>`:$}</div>`:r?$:l`<div class="action-summary">${Ua(i,t)}</div>`}
      </div>
      ${r?sp(t,i,n,s,o):$}
    </div>
  `}function sp(t,r,e,i,n){let s=Ua(r,t),o=$r(t.cause);return l`
    <div class="why">
      ${o?l`<div class="raw-trigger">${a(r,"ui.trigger_prefix","Trigger: ")}${Qu(r,t.cause)}</div>`:$}
      ${s?l`<div class="outcome-summary">${s}</div>`:$}
      ${t.explanation?l`<div class="section">
            <div class="section-title">${a(r,"ui.section_scene_evaluation","Scene evaluation")}</div>
            <div class="scenes">${t.explanation.scenes.map(d=>np(d,r,i))}</div>
          </div>`:$}
      ${t.actions.length?l`<div class="section">
            <div class="section-title">${a(r,"ui.section_actions_taken","Actions taken")}</div>
            ${t.actions.map(d=>l`<div class="action-block ${d.unexposed?"unexposed":""}">
                <div class="action-head">
                  ${tp(d,r,e,n)}${d.unexposed?l`<span class="skipped-tag">${a(r,"ui.skipped_not_exposed"," \u2014 skipped (not exposed)")}</span>`:$}
                </div>
                ${(d.entity_ids??[]).map(u=>l`<div class="entity">${ja(r,u)}</div>`)}
              </div>`)}
          </div>`:$}
    </div>
  `}var Be=class{constructor(r,e){this._onKeydown=r=>{this._host.open&&r.key==="Escape"&&this._close()};this._onBackdrop=()=>{this._host.open&&this._close()};this._host=r,this._close=e,r.addController(this)}hostConnected(){document.addEventListener("keydown",this._onKeydown),this._host.addEventListener("click",this._onBackdrop)}hostDisconnected(){document.removeEventListener("keydown",this._onKeydown),this._host.removeEventListener("click",this._onBackdrop)}};var F=class extends b{constructor(){super();this.exposedActions=[];this.category="";this.categoryName=null;this.open=!1;this._records=[];this._schemas={};this._expanded=new Set;this._loading=!0;this._error="";this._hasNew=!1;new Be(this,()=>this._onClose())}disconnectedCallback(){super.disconnectedCallback(),this._stopPoll()}_startPoll(){this._poll||(this._poll=setInterval(()=>this._checkNew(),5e3))}_stopPoll(){this._poll&&(clearInterval(this._poll),this._poll=void 0)}_reloadTriggered(e){return this.open&&(e.has("open")||e.has("category")||e.has("scope"))}willUpdate(e){this._reloadTriggered(e)&&this._beginLoad()}updated(e){e.has("open")&&(this.open?this._startPoll():this._stopPoll()),this._reloadTriggered(e)&&this._fetch()}_mine(e){return e.filter(i=>i.scope_kind===this.scope.scope_kind&&i.scope_id===this.scope.scope_id&&i.category===this.category)}_beginLoad(){this._error="",this._loading=!0,this._hasNew=!1,this._expanded=new Set}async _fetch(){try{let e=await Yr(this.hass);if(!this.isConnected)return;this._records=this._mine(e),this._loading=!1,this._loadSchemas()}catch(e){this._error=S(this.hass,e),this._loading=!1}}_load(){return this._beginLoad(),this._fetch()}async _loadSchemas(){let e=[...new Set(this._records.flatMap(s=>s.actions.map(o=>o.service)))].filter(s=>!(s in this._schemas));if(e.length===0)return;let i=await Promise.all(e.map(async s=>{try{return[s,await He(this.hass,s)]}catch{return null}}));if(!this.isConnected)return;let n={...this._schemas};for(let s of i)s&&(n[s[0]]=s[1]);this._schemas=n}async _checkNew(){if(!(!this.open||!this.isConnected||document.visibilityState!=="visible"))try{let i=this._mine(await Yr(this.hass))[0]?.timestamp??null,n=this._records[0]?.timestamp??null;i&&(!n||i>n)&&(this._hasNew=!0)}catch{}}_toggle(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}async _clear(){try{await Xs(this.hass),await this._load()}catch(e){this._error=S(this.hass,e)}}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){if(!this.open)return $;let e=this.categoryName??this.category;return l`
      <div class="modal" role="dialog" aria-modal="true" @click=${i=>i.stopPropagation()}>
        <div class="header">
          <h3>${e}</h3>
          <button class="refresh ${this._hasNew?"has-new":""}" @click=${()=>this._load()}>
            ${this._hasNew?`\u25CF ${a(this.hass,"ui.new_traces_refresh","New traces \u2014 refresh")}`:a(this.hass,"ui.refresh","Refresh")}
          </button>
          <button class="clear" @click=${this._clear}>
            ${a(this.hass,"ui.clear_traces","Clear")}
          </button>
          <button class="close" @click=${this._onClose} aria-label=${a(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          ${this._error?l`<p class="error">${this._error}</p>`:this._loading?l`<p class="empty">${a(this.hass,"ui.loading","Loading\u2026")}</p>`:this._records.length===0?l`<p class="empty">${a(this.hass,"ui.no_traces_yet","No traces for this category yet.")}</p>`:l`<div class="list">${this._records.map((i,n)=>{let s=`${i.event_id??n}|${i.timestamp??""}`;return kr(i,this._expanded.has(s),()=>this._toggle(s),this.hass,this._schemas,this.periods?.custom??{},this.exposedActions)})}</div>`}
        </div>
      </div>
    `}};F.styles=[xr,y`
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
    `],c([m({attribute:!1})],F.prototype,"hass",2),c([m({attribute:!1})],F.prototype,"periods",2),c([m({attribute:!1})],F.prototype,"exposedActions",2),c([m({attribute:!1})],F.prototype,"scope",2),c([m()],F.prototype,"category",2),c([m()],F.prototype,"categoryName",2),c([m({type:Boolean,reflect:!0})],F.prototype,"open",2),c([f()],F.prototype,"_records",2),c([f()],F.prototype,"_schemas",2),c([f()],F.prototype,"_expanded",2),c([f()],F.prototype,"_loading",2),c([f()],F.prototype,"_error",2),c([f()],F.prototype,"_hasNew",2),F=c([w("ambience-traces-modal")],F);var op={time:"mdi:clock-outline",sun:"mdi:weather-sunny",domain:"mdi:account-multiple-plus"},K=class extends b{constructor(){super(...arguments);this.categoryName="";this.scenes=[];this.open=!1;this._triggers=[];this._opaque=!1;this._loading=!1;this._error="";this._loadSeq=0}willUpdate(e){super.willUpdate?.(e);let i=e.has("open")||e.has("scope")||e.has("category");this.open&&(i||e.has("scenes"))&&(i&&(this._triggers=[],this._opaque=!1),this._load())}get _scopeId(){return this.scope.kind==="house"?null:this.scope.id}async _load(){let e=++this._loadSeq;this._loading=!0,this._error="";try{let i=await Hs(this.hass,this.scope.kind,this._scopeId,this.category);if(e!==this._loadSeq)return;this._triggers=i.triggers,this._opaque=i.opaque}catch(i){if(e!==this._loadSeq)return;this._error=S(this.hass,i)}finally{e===this._loadSeq&&(this._loading=!1)}}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_openMoreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_entityName(e){return st(this.hass,e)}get _sortedTriggers(){let e=s=>this._entityName(s.entity_id).toLowerCase(),i=this._triggers.filter(s=>s.kind==="entity").sort((s,o)=>e(s).localeCompare(e(o))),n=this._triggers.filter(s=>s.kind!=="entity");return[...i,...n]}_sunPart(e){let i=re(this.hass,e.anchor);if(e.offset===0)return i;let n=a(this.hass,"ui.unit_min","min");return`${i} ${e.offset>0?"+":""}${e.offset} ${n}`}_rowContent(e){switch(e.kind){case"entity":return{title:this._entityName(e.entity_id),detail:e.entity_id};case"time":{let i=e.clocks.map(n=>`${String(n.hour).padStart(2,"0")}:${String(n.minute).padStart(2,"0")}`);return e.date_rollover&&i.push(a(this.hass,"ui.auto_trigger_date_rollover","Local midnight (date rollover)")),e.has_time&&i.push(a(this.hass,"ui.auto_trigger_periodic","periodic re-check")),{title:a(this.hass,"ui.auto_trigger_group_time","Time"),detail:i.join(", ")}}case"sun":return{title:a(this.hass,"ui.auto_trigger_group_sun","Sun"),detail:e.suns.map(i=>this._sunPart(i)).join(", ")};case"domain":return{title:a(this.hass,"ui.auto_trigger_group_domain","People list"),detail:a(this.hass,"ui.auto_trigger_domain_membership","{domains} added or removed",{domains:e.domains.join(", ")})}}}_renderRowIcon(e){return e.kind==="entity"?li(this.hass,e.entity_id):l`<ha-icon
      class="row-icon"
      icon=${op[e.kind]??$n}
    ></ha-icon>`}_moreInfoEntity(e){return e.kind==="entity"?e.entity_id:e.kind==="sun"&&this.hass?.states?.["sun.sun"]?"sun.sun":null}_renderRow(e){let{title:i,detail:n}=this._rowContent(e),s=this._moreInfoEntity(e);return l`
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
          ${n?l`<div class="row-detail">${n}</div>`:""}
        </div>
      </li>
    `}render(){if(!this.open)return $;let e=a(this.hass,"ui.auto_triggers_section","Auto-triggers");return l`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>${e}${this.categoryName?` \u2014 ${this.categoryName}`:""}</h3>
          <button class="close" @click=${this._close} aria-label=${a(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">${this._renderBody()}</div>
      </div>
    `}_renderBody(){return this._error?l`<div class="error">${this._error}</div>`:this._loading&&this._triggers.length===0?l`<div class="empty">${a(this.hass,"ui.loading","Loading\u2026")}</div>`:l`
      ${this._opaque?l`<div class="note">
            ${a(this.hass,"ui.auto_triggers_opaque_note","A script scene is opaque \u2014 some watches may be missing. Declare them in the scene's Triggers field.")}
          </div>`:""}
      ${this._triggers.length===0?l`<div class="empty">
            ${a(this.hass,"ui.auto_triggers_none","No automatic triggers.")}
          </div>`:l`<ul>
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
  `,c([m({attribute:!1})],K.prototype,"hass",2),c([m({attribute:!1})],K.prototype,"scope",2),c([m()],K.prototype,"category",2),c([m()],K.prototype,"categoryName",2),c([m({attribute:!1})],K.prototype,"scenes",2),c([m({type:Boolean,reflect:!0})],K.prototype,"open",2),c([f()],K.prototype,"_triggers",2),c([f()],K.prototype,"_opaque",2),c([f()],K.prototype,"_loading",2),c([f()],K.prototype,"_error",2),K=c([w("ambience-auto-triggers-modal")],K);function Ba(t,r){return r==="not_home"?a(t,"ui.away","Away"):r==="home"?a(t,"ui.home","Home"):j(r)}function Ga(t){return{state:t.live_state??"",attributes:Object.fromEntries(t.attributes.map(r=>[r.name,r.live_value==null?"":String(r.live_value)])),for:{h:0,m:0,s:0}}}function Sr(t){return String(t).padStart(2,"0")}function Cr(t){return`${t.getFullYear()}-${Sr(t.getMonth()+1)}-${Sr(t.getDate())}`}function mi(t){return`${Sr(t.getHours())}:${Sr(t.getMinutes())}`}var T=class extends b{constructor(){super();this.exposedActions=[];this.category="";this.categoryName=null;this.open=!1;this._knobs=[];this._hasTime=!1;this._loading=!0;this._error="";this._values={};this._verdicts={};this._date="";this._time="";this._whenMode="time";this._anchor="sunset";this._offset=0;this._anchors=null;this._anchorsDate="";this._anchorsError="";this._results=[];this._appliedIndex=null;this._expanded=new Set;this._running=!1;this._runToken=0;new Be(this,()=>this._onClose())}_reloadTriggered(e){return this.open&&(e.has("open")||e.has("category")||e.has("scope"))}willUpdate(e){this._reloadTriggered(e)&&this._beginLoad()}updated(e){this._reloadTriggered(e)&&this._fetch()}_vkey(e){return`${e.condition}:${e.key}`}_beginLoad(){this._error="",this._loading=!0,this._resetResults();let e=new Date;this._date=Cr(e),this._time=mi(e),this._whenMode="time",this._anchor="sunset",this._offset=0,this._anchors=null,this._anchorsDate="",this._anchorsError=""}async _fetch(){try{let e=await co(this.hass,this.scope,this.category);if(!this.isConnected)return;this._knobs=e.knobs,this._hasTime=e.has_time;let i={},n={};for(let s of e.knobs)s.kind==="entity"?i[s.entity_id]=Ga(s):n[this._vkey(s)]=s.live_value;this._values=i,this._verdicts=n,this._loading=!1}catch(e){this._error=S(this.hass,e),this._loading=!1}}_setState(e,i){this._values={...this._values,[e]:{...this._values[e],state:i}}}_setAttr(e,i,n){let s=this._values[e];this._values={...this._values,[e]:{...s,attributes:{...s.attributes,[i]:n}}}}_setFor(e,i,n){let s=this._values[e],o=Number.isFinite(n)&&n>0?Math.trunc(n):0;this._values={...this._values,[e]:{...s,for:{...s.for,[i]:o}}}}_setVerdict(e,i){this._verdicts={...this._verdicts,[e]:i}}_resetWhen(){let e=new Date;this._date=Cr(e),this._time=mi(e),this._whenMode="time"}_setWhenMode(e){e!==this._whenMode&&(this._whenMode=e,e==="sun"&&this._fetchAnchors(this._date))}_setDate(e){this._date=e,this._whenMode==="sun"&&this._fetchAnchors(e)}_onOffsetInput(e){let i=Cn(e);i!==null&&(this._offset=i)}async _fetchAnchors(e){if(e&&!(this._anchorsDate===e&&this._anchors)){this._anchorsError="";try{let i=await uo(this.hass,e);if(!this.isConnected||this._date!==e)return;this._anchors=i,this._anchorsDate=e}catch(i){if(!this.isConnected||this._date!==e)return;this._anchors=null,this._anchorsError=S(this.hass,i)}}}_resolvedInstant(){if(this._anchorsDate!==this._date)return null;let e=this._anchors?.[this._anchor];return e?new Date(e).getTime()+this._offset*6e4:null}_renderSunReadout(){if(this._anchorsError)return l`<span class="hint err">${this._anchorsError}</span>`;if(!this._anchors||this._anchorsDate!==this._date)return $;if(this._anchors[this._anchor]===null)return l`<span class="hint">${a(this.hass,"ui.simulate_sun_undefined","no {anchor} on this date",{anchor:re(this.hass,this._anchor)})}</span>`;let e=this._resolvedInstant();if(e===null||Number.isNaN(new Date(e).getTime()))return $;let i=this._anchors[this._anchor],n=new Date(e),s=Cr(n)===this._date?mi(n):`${Cr(n)} ${mi(n)}`,o=Sn(this._offset,this.hass);return l`<span class="hint">${re(this.hass,this._anchor)} ${mi(new Date(i))}${o?l` ${o}`:""} ${a(this.hass,"ui.simulate_sun_resolved","\u2192 {time}",{time:s})}</span>`}_resetEntity(e){this._values={...this._values,[e.entity_id]:Ga(e)}}_resetVerdict(e){this._verdicts={...this._verdicts,[this._vkey(e)]:e.live_value}}_buildOverrides(){let e={};for(let i of this._knobs){if(i.kind!=="entity")continue;let n=this._values[i.entity_id];if(!n)continue;let s={};for(let d of i.attributes){let u=n.attributes[d.name];if(!(u===void 0||u===""))if(d.control==="number"){let p=Number(u);Number.isNaN(p)||(s[d.name]=p)}else s[d.name]=u}let o={attributes:s};n.state!==""&&(o.state=n.state),(n.for.h||n.for.m||n.for.s)&&(o.for=n.for),(o.state!==void 0||o.for!==void 0||Object.keys(s).length>0)&&(e[i.entity_id]=o)}return e}_buildVerdicts(){let e={};for(let i of this._knobs)i.kind==="verdict"&&(e[i.condition]||(e[i.condition]={}),e[i.condition][i.key]=this._verdicts[this._vkey(i)]??i.live_value);return e}_resolveNow(){if(this._whenMode==="sun"){let i=this._resolvedInstant();return i===null||Number.isNaN(new Date(i).getTime())?null:new Date(i).toISOString()}let e=new Date(`${this._date}T${this._time}`);return!this._date||!this._time||Number.isNaN(e.getTime())?null:e.toISOString()}async _run(){if(this._running)return;this._error="";let e=this._resolveNow();if(e===null){this._error=this._whenMode==="sun"?a(this.hass,"ui.simulate_sun_unresolved","This sun time can't be resolved for the selected date."):a(this.hass,"ui.invalid_datetime","Enter a valid date and time.");return}this._running=!0;let i=this._runToken;try{let n=await po(this.hass,this.scope,this.category,e,this._buildOverrides(),this._buildVerdicts(),this._appliedIndex);if(i!==this._runToken)return;this._results=[...this._results,n.result],this._appliedIndex=n.applied_index}catch(n){if(i!==this._runToken)return;this._error=S(this.hass,n)}finally{i===this._runToken&&(this._running=!1)}}_clearHistory(){this._resetResults()}_resetResults(){this._results=[],this._appliedIndex=null,this._expanded=new Set,this._runToken++,this._running=!1}_toggle(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?l`
      <div class="modal" role="dialog" aria-modal="true" @click=${e=>e.stopPropagation()}>
        <div class="header">
          <h3>${a(this.hass,"ui.simulate_title","Simulate")} · ${this.categoryName??this.category}</h3>
          ${this._results.length?l`<button class="clear" @click=${()=>this._clearHistory()}>${a(this.hass,"ui.clear_traces","Clear")}</button>`:$}
          <button class="close" @click=${this._onClose} aria-label=${a(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          ${this._error?l`<p class="error">${this._error}</p>`:$}
          ${this._loading?l`<p>${a(this.hass,"ui.loading","Loading\u2026")}</p>`:l`
            ${this._hasTime?l`
              <p class="sec-title">${a(this.hass,"ui.when_heading","When")}</p>
              <div class="when">
                <input type="date" .value=${this._date}
                  @change=${e=>this._setDate(e.target.value)} />
                <select class="whenmode" .value=${this._whenMode}
                  @change=${e=>this._setWhenMode(e.target.value)}>
                  <option value="time" ?selected=${this._whenMode==="time"}>${a(this.hass,"ui.endpoint_time","Time")}</option>
                  <option value="sun" ?selected=${this._whenMode==="sun"}>${a(this.hass,"ui.endpoint_sun","Sun")}</option>
                </select>
                ${this._whenMode==="time"?l`<input type="time" .value=${this._time}
                        @change=${e=>this._time=e.target.value} />`:l`
                      <select class="anchor"
                        @change=${e=>this._anchor=e.target.value}>
                        ${kn.map(e=>l`<option value=${e} ?selected=${e===this._anchor}>${re(this.hass,e)}</option>`)}
                      </select>
                      <input class="num" type="number" step="1"
                        placeholder=${a(this.hass,"ui.offset_placeholder","Offset")}
                        .value=${this._offset===0?"":String(this._offset)}
                        @input=${e=>this._onOffsetInput(e.target.value)} />`}
                <button class="reset" title=${a(this.hass,"ui.reset_to_now","Reset to now")} aria-label=${a(this.hass,"ui.reset_to_now","Reset to now")}
                  @click=${()=>this._resetWhen()}>↺</button>
                ${this._whenMode==="sun"?this._renderSunReadout():l`<span class="hint">${a(this.hass,"ui.simulate_when_hint","drives sun, time-of-day, weekday & workday")}</span>`}
              </div>`:$}
            ${this._knobs.length?l`
              <p class="sec-title">${a(this.hass,"ui.simulate_inputs_heading","Inputs this category depends on")}</p>
              ${this._knobs.map(e=>e.kind==="entity"?this._renderEntity(e):this._renderVerdict(e))}`:$}
            <div class="run-row"><button class="runbtn" ?disabled=${this._running} @click=${()=>void this._run()}>${a(this.hass,"ui.simulate_button","Simulate")} ▸</button></div>
            ${this._results.length?l`<div class="results">${this._results.map((e,i)=>({u:e,key:`sim-${i}`})).reverse().map(({u:e,key:i})=>l`<div class="result">${kr(e,this._expanded.has(i),()=>this._toggle(i),this.hass,void 0,this.periods?.custom??{},this.exposedActions)}</div>`)}</div>`:$}
          `}
        </div>
      </div>`:$}_entityName(e){return st(this.hass,e)}_renderEntity(e){let i=this._values[e.entity_id],n=e.attributes.length>0,s=this._entityName(e.entity_id);return l`
      <div class="row ${n?"has-attrs":""}">
        ${li(this.hass,e.entity_id)}
        <div class="row-text">
          <div class="row-title">${s}</div>
          <div class="row-detail">${e.entity_id}</div>
        </div>
        <div class="row-ctrl">
          ${this._renderControl(e,i?.state??"")}
          ${this._renderFor(e,i?.for??{h:0,m:0,s:0},s)}
          <button class="reset" data-reset=${e.entity_id} title=${a(this.hass,"ui.reset_to_live","Reset to live")}
            @click=${()=>this._resetEntity(e)}>↺</button>
        </div>
      </div>
      ${e.attributes.map((o,d)=>l`
        <div class="row attr ${d===e.attributes.length-1?"last-attr":""}">
          <div class="row-text"><div class="row-title">${Ba(this.hass,o.name)}</div></div>
          <div class="row-ctrl">
            ${this._renderAttrControl(e,o,i?.attributes[o.name]??"")}
            <button class="reset" title=${a(this.hass,"ui.reset_to_live","Reset to live")}
              @click=${()=>this._resetEntity(e)}>↺</button>
          </div>
        </div>`)}
    `}_renderAttrControl(e,i,n){let s=o=>this._setAttr(e.entity_id,i.name,o.target.value);if(i.control==="select"){let o=qe(this.hass)[e.entity_id];return l`<select data-attr=${`${e.entity_id}:${i.name}`} .value=${n} @change=${s}>
        ${(i.options??[n]).map(d=>l`<option value=${d} ?selected=${d===n}>${Re(this.hass,o,i.name,d)}</option>`)}
      </select>`}return l`<input class=${i.control==="number"?"num":""}
      type=${i.control==="number"?"number":"text"}
      data-attr=${`${e.entity_id}:${i.name}`}
      .value=${n}
      @input=${s} />`}_renderControl(e,i){if(e.control==="select")return l`<select data-entity=${e.entity_id} .value=${i}
        @change=${s=>this._setState(e.entity_id,s.target.value)}>
        ${(e.options??[i]).map(s=>l`<option value=${s} ?selected=${s===i}>${Ba(this.hass,s)}</option>`)}
      </select>`;let n=e.control==="number"?"number":"text";return l`<input class=${e.control==="number"?"num":""} type=${n} data-entity=${e.entity_id}
      .value=${i}
      @input=${s=>this._setState(e.entity_id,s.target.value)} />`}_renderFor(e,i,n){let s={h:"hours",m:"minutes",s:"seconds"},o=d=>l`<input class="for-num" type="number" min="0"
      aria-label=${`${n} \u2014 held for, ${s[d]}`}
      data-for=${`${e.entity_id}:${d}`} .value=${String(i[d])}
      @change=${u=>this._setFor(e.entity_id,d,Number(u.target.value))} />`;return l`<span class="for-ctrl" title=${a(this.hass,"ui.duration_held_hint","How long it has held this state (h:m:s)")}>
      <span class="for-label">${a(this.hass,"ui.for_label","For")}</span>${o("h")}<span>:</span>${o("m")}<span>:</span>${o("s")}
    </span>`}_renderVerdict(e){let i=this._vkey(e),n=this._verdicts[i]??e.live_value,s=e.entity_id?this._entityName(e.entity_id):e.label,o=e.entity_id?li(this.hass,e.entity_id):l`<ha-icon class="row-icon" icon="mdi:code-braces"></ha-icon>`;return l`
      <div class="row">
        ${o}
        <div class="row-text">
          <div class="row-title">${s}</div>
          ${e.entity_id?l`<div class="row-detail">${e.entity_id}</div>`:$}
        </div>
        <div class="row-ctrl">
          <select data-verdict=${i} .value=${String(n)}
            @change=${d=>this._setVerdict(i,d.target.value==="true")}>
            <option value="true" ?selected=${n}>${a(this.hass,"ui.true_label","True")}</option>
            <option value="false" ?selected=${!n}>${a(this.hass,"ui.false_label","False")}</option>
          </select>
          <button class="reset" title=${a(this.hass,"ui.reset_to_live","Reset to live")} @click=${()=>this._resetVerdict(e)}>↺</button>
        </div>
      </div>`}};T.styles=[xr,Ca,y`
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
    `],c([m({attribute:!1})],T.prototype,"hass",2),c([m({attribute:!1})],T.prototype,"periods",2),c([m({attribute:!1})],T.prototype,"exposedActions",2),c([m({attribute:!1})],T.prototype,"scope",2),c([m()],T.prototype,"category",2),c([m()],T.prototype,"categoryName",2),c([m({type:Boolean,reflect:!0})],T.prototype,"open",2),c([f()],T.prototype,"_knobs",2),c([f()],T.prototype,"_hasTime",2),c([f()],T.prototype,"_loading",2),c([f()],T.prototype,"_error",2),c([f()],T.prototype,"_values",2),c([f()],T.prototype,"_verdicts",2),c([f()],T.prototype,"_date",2),c([f()],T.prototype,"_time",2),c([f()],T.prototype,"_whenMode",2),c([f()],T.prototype,"_anchor",2),c([f()],T.prototype,"_offset",2),c([f()],T.prototype,"_anchors",2),c([f()],T.prototype,"_anchorsDate",2),c([f()],T.prototype,"_anchorsError",2),c([f()],T.prototype,"_results",2),c([f()],T.prototype,"_appliedIndex",2),c([f()],T.prototype,"_expanded",2),c([f()],T.prototype,"_running",2),T=c([w("ambience-simulator-modal")],T);function ap(t){let r=Math.floor(t/3600),e=Math.floor(t%3600/60),i=t%60,n=s=>String(s).padStart(2,"0");return r>0?`${r}:${n(e)}:${n(i)}`:`${e}:${n(i)}`}var In=1024;function lp(t,r,e){if(t!==void 0&&r!==void 0)return Math.floor((t+r)/2);let i=e.map(n=>n.priority??0);return t===void 0&&r===void 0?In:t===void 0?Math.max(...i)+In:Math.min(...i)-In}var Y=class extends b{constructor(){super(...arguments);this._store=new R(this);this._onKeyDown=e=>{if(this._editing!==null||this._viewingTraces!==null||this._viewingSimulator!==null||this._autoTriggers!==null)return;let n=(typeof e.composedPath=="function"?e.composedPath():[])[0]??e.target,s=n?.tagName?.toLowerCase();s==="input"||s==="textarea"||n?.isContentEditable||e.key.toLowerCase()!=="z"||!(e.ctrlKey||e.metaKey)||(e.preventDefault(),e.shiftKey?this._store.canRedo&&this._store.redo():this._store.canUndo&&this._store.undo())};this._expanded=new Set(gs());this._collapsedCategories=new Set(ys());this._conditionsHintDismissed=!1;this._editing=null;this._sceneEditorError="";this._savingScene=!1;this._viewingTraces=null;this._viewingSimulator=null;this._autoTriggers=null;this._autoTriggerScenesMemo=null;this.filterCategory="";this._scopeIsEditing=e=>this._editing!==null&&D(this._editing.scope)===D(e)}async connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeyDown),await this._store.loadStatic(),this._conditionsHintDismissed=$s(this._store.installId),await Promise.all([this._store.refreshAreas(),this._store.refreshFloors(),this._store.refreshHouse(),this._store.refreshSwitches()]),await this._store.subscribe(e=>this._onScopeRemoved(e),this._scopeIsEditing)}disconnectedCallback(){window.removeEventListener("keydown",this._onKeyDown),super.disconnectedCallback()}_onScopeRemoved(e){let i=D(e),n=new Set(this._expanded);n.delete(i),this._setExpanded(n);let s=Ee(e,"");this._setCollapsedCategories(new Set([...this._collapsedCategories].filter(o=>!o.startsWith(s)))),this._store.clearStale(e),this._editing&&D(this._editing.scope)===i&&(this._editing=null)}willUpdate(e){if(e.has("filterCategory")&&e.get("filterCategory")!==void 0&&this._onFilterCategoryChanged(),e.has("_editing")){let i=e.get("_editing");i!=null&&(this._editing===null||D(this._editing.scope)!==D(i.scope))&&this._store.isScopeStale(i.scope)&&this._store.refreshStaleScope(i.scope)}}_onFilterCategoryChanged(){let e=this.filterCategory;if(e==="")return;let i=new Set(this._expanded),n=new Set(this._collapsedCategories),s=!1,o=!1;for(let d of this._orderedScopeRows()){let u=D(d.scope);this._matchingSceneCount(d.cfg)===0&&i.delete(u)&&(s=!0),n.delete(Ee(d.scope,e))&&(o=!0)}s&&this._setExpanded(i),o&&this._setCollapsedCategories(n)}_setExpanded(e){this._expanded=e,vs([...e])}_toggleExpand(e){let i=D(e),n=new Set(this._expanded);n.has(i)?n.delete(i):n.add(i),this._setExpanded(n)}_setCollapsedCategories(e){this._collapsedCategories=e,bs([...e])}_toggleCategoryCollapse(e,i){let n=Ee(e,i.detail.categoryId),s=new Set(this._collapsedCategories);s.has(n)?s.delete(n):s.add(n),this._setCollapsedCategories(s)}_collapsedCategoriesFor(e){return this._store.categories.map(i=>i.id).filter(i=>this._collapsedCategories.has(Ee(e,i)))}_addScene(e,i){let n=this._store.getConfig(e);n&&(this._sceneEditorError="",this._editing={scope:e,index:n.scenes.length,isNew:!0,category:i})}_editScene(e,i){this._sceneEditorError="",this._editing={scope:e,index:i.detail.index,isNew:!1}}_duplicateScene(e,i){let n=this._store.getConfig(e);if(!n)return;let s=n.scenes[i.detail.index];if(!s)return;let o=Yt(JSON.parse(JSON.stringify(s)));this._sceneEditorError="",this._editing={scope:e,index:n.scenes.length,isNew:!0,seed:o}}_deleteScene(e,i){let n=this._store.getConfig(e);if(!n)return;let s=n.scenes.filter((o,d)=>d!==i.detail.index);this._store.mutate(e,{...n,scenes:s},{action:"delete",scene_name:n.scenes[i.detail.index]?.name??null})}_reorderScenes(e,i){let n=this._store.getConfig(e);if(!n)return;let{from:s,to:o}=i.detail,d=n.scenes[s];if(!d||n.scenes[o]?.category!==d.category)return;let u=[...n.scenes];u.splice(s,1),u.splice(o,0,d);let p=C=>u[C]&&u[C].category===d.category,h=o-1;for(;h>=0&&!p(h);)h--;let _=o+1;for(;_<u.length&&!p(_);)_++;let g=h>=0?u[h].priority:void 0,v=_<u.length?u[_].priority:void 0,x=lp(g,v,n.scenes.filter(C=>C.category===d.category));u[o]={...d,priority:x,pinned:!0},this._store.mutate(e,{...n,scenes:u},{action:"reorder",scene_name:d.name??null})}_unpinScene(e,i){let n=this._store.getConfig(e);if(!n)return;let s=n.scenes.map((o,d)=>d===i.detail.index?{...o,pinned:!1}:o);this._store.mutate(e,{...n,scenes:s},{action:"unpin",scene_name:n.scenes[i.detail.index]?.name??null})}_toggleSceneEnabled(e,i){let n=this._store.getConfig(e);if(!n)return;let s=n.scenes.map((o,d)=>{if(d!==i.detail.index)return o;if(i.detail.enabled){let u={...o};return delete u.enabled,u}return{...o,enabled:!1}});this._store.mutate(e,{...n,scenes:s},{action:"toggle",scene_name:n.scenes[i.detail.index]?.name??null})}async _saveScene(e){if(this._savingScene)return;let i=this._editing;if(!i)return;let{scene:n,scope:s}=e.detail;this._savingScene=!0,this._sceneEditorError="";try{if(D(s)===D(i.scope)){let p=this._store.getConfig(s);if(!p)return;let h=[...p.scenes];i.isNew?h.push(n):h[i.index]=n,await this._store.mutate(s,{...p,scenes:h},{action:i.isNew?"add":"edit",scene_name:n.name??null})?this._editing=null:this._sceneEditorError=this._takeError();return}let o=Yt(n),d=this._store.getConfig(s);if(!d)return;if(!await this._store.mutate(s,{...d,scenes:[...d.scenes,o]},{action:"add",scene_name:n.name??null})){this._sceneEditorError=this._takeError();return}if(this._editing=null,!i.isNew){let p=this._store.getConfig(i.scope);if(p){let h=p.scenes.filter((_,g)=>g!==i.index);await this._store.mutate(i.scope,{...p,scenes:h},{action:"delete",scene_name:n.name??null})}}}finally{this._savingScene=!1}}_takeError(){let e=this._store.error;return this._store.error="",e}async _callApi(e){this._store.error="";try{await e()}catch(i){this._store.error=S(this.hass,i)}}_applyScenes(e,i){return this._callApi(()=>Os(this.hass,e,i))}_runSceneActions(e,i){return this._callApi(()=>Ms(this.hass,e,i.detail.index))}_cancelScene(){this._sceneEditorError="",this._editing=null}_onScopeMenu(e,i){i==="run"&&this._applyScenes(e)}_showAutoTriggers(e,i){let n=this._store.categories.find(s=>s.id===i);this._autoTriggers={scope:e,category:i,categoryName:n?.name??null}}_autoTriggerScenes(){if(!this._autoTriggers)return[];let e=this._store.getConfig(this._autoTriggers.scope)?.scenes,{category:i}=this._autoTriggers,n=this._autoTriggerScenesMemo;if(n&&n.source===e&&n.category===i)return n.filtered;let s=(e??[]).filter(o=>o.category===i);return this._autoTriggerScenesMemo={source:e,category:i,filtered:s},s}_showTraces(e,i){let n=this._store.categories.find(s=>s.id===i);this._viewingTraces={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:i,categoryName:n?.name??null}}_downloadDiagnostics(e,i){let n={scope_kind:e.kind,scope_id:"id"in e?e.id:null},s=this._store.categories.find(o=>o.id===i)?.name;return this._callApi(()=>no(this.hass,n,i,s))}_showSimulator(e,i){let n=this._store.categories.find(s=>s.id===i);this._viewingSimulator={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:i,categoryName:n?.name??null}}_defaultCategoryId(){return this.filterCategory!==""?this.filterCategory:[...this._store.categories].sort((i,n)=>i.name.localeCompare(n.name))[0]?.id??""}get _editingScene(){return this._editing?this._editing.seed?this._editing.seed:this._editing.isNew?{when:{},actions:[],category:this._editing.category??this._defaultCategoryId()}:this._store.getConfig(this._editing.scope)?.scenes[this._editing.index]??null:null}get _editorConditions(){return this._editing?this._store.conditions.slice().sort((e,i)=>i.priority-e.priority):[]}get _takenSceneNames(){let e=new Map,i=this._editing,n=(s,o)=>{if(!o)return;let d=!!i&&!i.isNew&&D(i.scope)===D(s);o.scenes.forEach((u,p)=>{if(d&&p===i.index)return;let h=u.name?.trim().toLowerCase();if(!h)return;let _=Ki(s,u.category),g=e.get(_);g||(g=new Set,e.set(_,g)),g.add(h)})};n({kind:"house"},this._store.house);for(let s of this._store.floors)n({kind:"floor",id:s.floor_id},this._store.floorConfigs.get(s.floor_id));for(let s of this._store.areas)n({kind:"area",id:s.area_id},this._store.areaConfigs.get(s.area_id));return e}get _scopeOptions(){return[{scope:{kind:"house"},label:a(this.hass,"ui.scope_house","House")},...this._store.floors.map(e=>({scope:{kind:"floor",id:e.floor_id},label:e.name})),...this._store.areas.map(e=>({scope:{kind:"area",id:e.area_id},label:e.name}))]}_matchingSceneCount(e){return this.filterCategory===""?e.scenes.length:e.scenes.filter(i=>i.category===this.filterCategory).length}_summary(e){if(e.scenes.length===0)return a(this.hass,"ui.not_configured","not configured");let i=this._matchingSceneCount(e),n=i===1?a(this.hass,"ui.scene_singular","scene"):a(this.hass,"ui.scene_plural","scenes");return`${i} ${n}`}get _weatherUnconfigured(){return!this._store.weatherConfig||this._store.weatherConfig.entity==null}get _workdayUnconfigured(){let e=this._store.dayConfig;return!e||e.workday_sensor==null&&e.workday_calendar==null}get _conditionsUnconfigured(){return this._weatherUnconfigured||this._workdayUnconfigured}_conditionsHintText(){let e=this._weatherUnconfigured,i=this._workdayUnconfigured;return e&&i?{title:a(this.hass,"ui.conditions_hint_title","Optional: set up Workday & Weather"),body:a(this.hass,"ui.conditions_hint_body","Configure Workday and Weather in Conditions to use them in your scene conditions.")}:i?{title:a(this.hass,"ui.conditions_hint_title_workday","Optional: set up Workday"),body:a(this.hass,"ui.conditions_hint_body_workday","Configure Workday in Conditions to use it in your scene conditions.")}:{title:a(this.hass,"ui.conditions_hint_title_weather","Optional: set up Weather"),body:a(this.hass,"ui.conditions_hint_body_weather","Configure Weather in Conditions to use it in your scene conditions.")}}_openSettings(e){this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:e},bubbles:!0,composed:!0}))}_dismissConditionsHint(){this._conditionsHintDismissed=!0,ks(this._store.installId)}_renderBanners(){return this._store.staticLoaded?l`
      ${this._renderConditionsHint()}
      <ambience-language-banner .hass=${this.hass}></ambience-language-banner>
    `:""}_renderConditionsHint(){if(this._conditionsHintDismissed||!this._conditionsUnconfigured)return"";let{title:e,body:i}=this._conditionsHintText();return l`
      <ambience-banner
        data-test="conditions-hint-banner"
        icon="mdi:lightbulb-on-outline"
        hint
        .ctaLabel=${a(this.hass,"ui.conditions_hint_cta","Configure conditions")}
        .dismissLabel=${a(this.hass,"ui.dismiss","Dismiss")}
        @banner-cta=${()=>this._openSettings("conditions")}
        @banner-dismiss=${()=>this._dismissConditionsHint()}
      >
        <strong>${e}</strong>
        <span>${i}</span>
      </ambience-banner>
    `}_orderedScopeRows(){let e=[{scope:{kind:"house"},name:a(this.hass,"ui.scope_house","House"),cfg:this._store.house,rowClass:"house"}];for(let s of this._store.floors){let o=this._store.floorConfigs.get(s.floor_id);o&&e.push({scope:{kind:"floor",id:s.floor_id},name:s.name,cfg:o,rowClass:"floor"})}for(let s of this._store.areas){let o=this._store.areaConfigs.get(s.area_id);o&&e.push({scope:{kind:"area",id:s.area_id},name:s.name,cfg:o,rowClass:"area"})}let i=[],n=[];for(let s of e)(s.cfg.enabled===!1?n:i).push(s);return[...i,...n]}_isSwitchedOff(e){let i=this._store.switchEntityIds.get(D(e));return i?this.hass.states?.[i]?.state==="off":!1}_renderAreasPlaceholder(){return this._store.areasLoaded?!this._store.error&&this._store.areas.length===0?l`<li>
        <p class="empty">
          ${a(this.hass,"ui.no_areas","No areas found in Home Assistant.")}
        </p>
      </li>`:"":l`<li>
        <p class="empty" data-test="areas-loading">
          <span class="spinner" aria-hidden="true"></span>
          ${a(this.hass,"ui.loading","Loading\u2026")}
        </p>
      </li>`}_scopeName(e){return e.scope_kind==="house"?a(this.hass,"ui.scope_house","House"):e.scope_kind==="area"?this._store.areas.find(i=>i.area_id===e.scope_id)?.name??e.scope_id??"":this._store.floors.find(i=>i.floor_id===e.scope_id)?.name??e.scope_id??""}_historyLabel(e){if(!e)return"";let i=this._scopeName(e),n=e.scene_name?.trim()?e.scene_name:a(this.hass,"ui.history_untitled","Untitled");return a(this.hass,`ui.history_action_${e.action}`,e.action,{scene:n,scope:i})}_historyButtonLabel(e){let i=e==="undo",n=i?this._store.canUndo:this._store.canRedo,s=i?this._store.undoAction:this._store.redoAction;return n?a(this.hass,`ui.history_${e}_tooltip`,i?"Undo: {change}":"Redo: {change}",{change:this._historyLabel(s)}):a(this.hass,`ui.history_nothing_to_${e}`,i?"Nothing to undo":"Nothing to redo")}_renderHistoryButton(e){let i=e==="undo",n=i?this._store.canUndo:this._store.canRedo,s=this._historyButtonLabel(e);return l`
      <ha-icon-button
        .disabled=${!n}
        .label=${s}
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
        ${vo(this._orderedScopeRows(),i=>D(i.scope),i=>this._renderScopeRow(i.scope,i.name,i.cfg,i.rowClass))}
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
    `}_renderScopeRow(e,i,n,s){let o=this._expanded.has(D(e)),d=e.kind==="house"?"":e.id,u=this._isSwitchedOff(e)?"off":this._matchingSceneCount(n)===0?"empty":"",p=n.enabled===!1;return l`
      <li class="scope-row ${s} ${p?"scope-disabled":""}" data-id=${d}>
        <div
          class="scope-header ${o?"open":""} ${u}"
          @click=${()=>this._toggleExpand(e)}
        >
          <span class="chevron ${o?"open":""}">▶</span>
          <ha-icon class="scope-icon" icon=${Qt(e,this.hass)}></ha-icon>
          <span class="scope-name">${i}</span>
          ${Ji(this.hass,n.scenes)}
          <span class="scope-summary">${this._summary(n)}</span>
          ${this._renderPauseIcon(e,n)}
          ${this._renderScopeSwitch(e,n)}
          <ambience-kebab-menu
            data-test="scope-kebab"
            ?muted=${u==="off"||p}
            .hass=${this.hass}
            .items=${[{id:"run",label:a(this.hass,"ui.run","Run"),icon:"mdi:play"}]}
            @menu-action=${h=>this._onScopeMenu(e,h.detail.id)}
            @click=${h=>h.stopPropagation()}
          ></ambience-kebab-menu>
        </div>
        ${o?l`
              <div class="scope-body">
                <ambience-scenes-list
                  .scenes=${n.scenes}
                  .scope=${e}
                  .live=${this._store.live}
                  .liveSuppressed=${p||this._isSwitchedOff(e)}
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
                  @toggle-category-collapse=${h=>this._toggleCategoryCollapse(e,h)}
                  @add-scene=${h=>this._addScene(e,h.detail?.category)}
                  @edit-scene=${h=>this._editScene(e,h)}
                  @duplicate-scene=${h=>this._duplicateScene(e,h)}
                  @delete-scene=${h=>this._deleteScene(e,h)}
                  @reorder-scenes=${h=>this._reorderScenes(e,h)}
                  @unpin-scene=${h=>this._unpinScene(e,h)}
                  @toggle-scene-enabled=${h=>this._toggleSceneEnabled(e,h)}
                  @run-scene-actions=${h=>this._runSceneActions(e,h)}
                  @apply-category=${h=>this._applyScenes(e,h.detail.categoryId)}
                  @show-traces=${h=>this._showTraces(e,h.detail.category)}
                  @download-diagnostics=${h=>this._downloadDiagnostics(e,h.detail.category)}
                  @show-simulator=${h=>this._showSimulator(e,h.detail.category)}
                  @show-auto-triggers=${h=>this._showAutoTriggers(e,h.detail.category)}
                ></ambience-scenes-list>
              </div>
            `:""}
      </li>
    `}_pauseRemaining(e){let i=this.hass.states?.[e],n=i?.attributes?.off_at,s=Number(i?.attributes?.auto_on_delay_seconds??0);if(!n||!s)return 0;let o=(Date.now()-new Date(n).getTime())/1e3;return Math.max(0,Math.round(s-o))}_renderPauseIcon(e,i){if(i.enabled===!1)return"";let n=this._store.switchEntityIds.get(D(e));if(!n)return"";let s=this.hass.states?.[n]?.state==="off",o=u=>{u.stopPropagation(),this.hass.callService?.("switch",s?"turn_on":"turn_off",{entity_id:n})};if(!s)return l`<button
        class="scope-pause"
        data-test="scope-pause"
        title=${a(this.hass,"ui.pause_scope","Pause this scope")}
        @click=${o}
      >
        <ha-icon icon="mdi:timer-outline"></ha-icon>
      </button>`;let d=this._pauseRemaining(n);return l`<button
      class="scope-pause paused"
      data-test="scope-pause"
      title=${a(this.hass,"ui.resume_scope","Resume now")}
      @click=${o}
    >
      <ha-icon icon="mdi:timer"></ha-icon>
      <span class="countdown">${ap(d)}</span>
    </button>`}_renderScopeSwitch(e,i){let n=i.enabled!==!1;return $t({checked:n,dataTest:"scope-switch",onChange:async d=>{d.stopPropagation();try{await Vs(this.hass,e,!n),await Promise.all([this._store.reloadScope(e),this._store.refreshSwitches()])}catch(u){this._store.error=S(this.hass,u)}},className:"scope-switch",onClick:d=>d.stopPropagation()})}};Y.styles=[y`
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
    `],c([m({attribute:!1})],Y.prototype,"hass",2),c([f()],Y.prototype,"_expanded",2),c([f()],Y.prototype,"_collapsedCategories",2),c([f()],Y.prototype,"_conditionsHintDismissed",2),c([f()],Y.prototype,"_editing",2),c([f()],Y.prototype,"_sceneEditorError",2),c([f()],Y.prototype,"_viewingTraces",2),c([f()],Y.prototype,"_viewingSimulator",2),c([f()],Y.prototype,"_autoTriggers",2),c([m({attribute:!1})],Y.prototype,"filterCategory",2),Y=c([w("ambience-scopes-view")],Y);var dp=[{field:"expose_assist",labelKey:"ui.settings_expose_assist",label:"Assist",dataTest:"expose-assist"},{field:"expose_google",labelKey:"ui.settings_expose_google",label:"Google Assistant",dataTest:"expose-google"},{field:"expose_alexa",labelKey:"ui.settings_expose_alexa",label:"Alexa",dataTest:"expose-alexa"}],we=class extends b{constructor(){super(...arguments);this._defaults={name:"Ambience",auto_on_delay_seconds:0};this._reapply={enabled:!1,interval_seconds:3600};this._exposed={expose_assist:!0,expose_google:!1,expose_alexa:!1};this._error=""}async connectedCallback(){super.connectedCallback();try{this._defaults=await Us(this.hass),this._reapply=await Gs(this.hass),this._exposed=await Ys(this.hass)}catch(e){this._error=S(this.hass,e)}}async _safeSave(e){try{await e(),this._error=""}catch(i){this._error=S(this.hass,i)}}_saveDefaults(){this._safeSave(()=>Bs(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds))}_onDefaultName(e){let i=e.target,n=i.value.trim();if(!n){i.value=this._defaults.name;return}this._defaults={...this._defaults,name:n},this._saveDefaults()}_onPauseMinutes(e){let i=e.target,n=Math.floor(Number(i.value));if(i.value===""||!Number.isFinite(n)||n<0){i.value=String(Math.round(this._defaults.auto_on_delay_seconds/60));return}this._defaults={...this._defaults,auto_on_delay_seconds:n*60},this._saveDefaults()}_saveReapply(){this._safeSave(()=>Ks(this.hass,this._reapply.enabled,this._reapply.interval_seconds))}_onReapplyEnabled(e){this._reapply={...this._reapply,enabled:e.target.checked},this._saveReapply()}_onReapplyMinutes(e){let i=e.target,n=Math.floor(Number(i.value));if(i.value===""||!Number.isFinite(n)||n<1){i.value=String(Math.round(this._reapply.interval_seconds/60));return}this._reapply={...this._reapply,interval_seconds:n*60},this._saveReapply()}_saveExposed(){this._safeSave(()=>Qs(this.hass,this._exposed.expose_assist,this._exposed.expose_google,this._exposed.expose_alexa))}_onExpose(e,i){this._exposed={...this._exposed,[e]:i.target.checked},this._saveExposed()}_renderToggle(e,i,n,s=!1){return $t({checked:e,dataTest:i,onChange:n,disabled:s})}render(){return l`
      ${this._error?l`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:""}

      <div class="card">
        <!-- Reuses .toggle-row purely for its section-header styling (bold label
             + divider); this header has no toggle (switches are always created). -->
        <div class="row toggle-row">
          <label>
            ${a(this.hass,"ui.settings_ambience_pause_card","Scope-level pause switch")}
            <ambience-help
              .hass=${this.hass}
              .text=${a(this.hass,"ui.help_pause_switch","Ambience creates a switch entity for every enabled area, floor, and house scope. Turning a scope's switch off pauses Ambience for that scope.")}
              .docPath=${"getting-started/step-8-pausing-and-disabling-scopes"}
            ></ambience-help>
          </label>
        </div>
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
            ${dp.map(e=>l`
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
  `,c([m({attribute:!1})],we.prototype,"hass",2),c([f()],we.prototype,"_defaults",2),c([f()],we.prototype,"_reapply",2),c([f()],we.prototype,"_exposed",2),c([f()],we.prototype,"_error",2),we=c([w("ambience-ambience-settings")],we);function Ka(){let t=globalThis.crypto;if(t?.randomUUID)return t.randomUUID().replace(/-/g,"");if(t?.getRandomValues){let r=t.getRandomValues(new Uint8Array(16));return Array.from(r,e=>e.toString(16).padStart(2,"0")).join("")}return Array.from({length:4},()=>Math.floor(Math.random()*4294967296).toString(16).padStart(8,"0")).join("")}var xe=class extends b{constructor(){super(...arguments);this._categories=[];this._error="";this._editing=null;this._modalError=""}async connectedCallback(){super.connectedCallback();try{this._categories=await Ce(this.hass)}catch(e){this._error=S(this.hass,e)}}_sorted(){return[...this._categories].sort((e,i)=>e.name.localeCompare(i.name))}_validate(e){let i=e.name.trim();if(i==="")return a(this.hass,"ui.category_name_blank_error","Category names can't be empty.");let n=i.toLocaleLowerCase();return this._categories.some(o=>o.id!==e.id&&o.name.trim().toLocaleLowerCase()===n)?a(this.hass,"ui.category_name_duplicate_error","Two categories can't have the same name."):""}_openEditor(e){this._editing={...e},this._modalError=""}_addCategory(){let e=Ka();this._editing={id:e,name:""},this._modalError=""}_closeModal(){this._editing=null,this._modalError=""}_patchDraft(e){this._editing&&(this._editing={...this._editing,...e})}_onName(e){this._patchDraft({name:e.target.value})}_onIcon(e){this._patchDraft({icon:e||void 0})}_onColor(e){this._patchDraft({color:e})}_save(){if(!this._editing)return;let e=this._validate(this._editing);if(e){this._modalError=e;return}let i={...this._editing,name:this._editing.name.trim()},n=this._categories.some(o=>o.id===i.id),s=this._categories;this._categories=n?this._categories.map(o=>o.id===i.id?i:o):[...this._categories,i],this._closeModal(),ji(this.hass,this._categories).then(()=>{window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(o=>{this._categories=s,this._error=S(this.hass,o)})}_deleteCategory(){if(!this._editing)return;let e=this._editing.id;if(this._categories.length<=1){this._modalError=a(this.hass,"ui.category_delete_blocked_last","You can't delete the last category.");return}let i=this._categories;this._categories=this._categories.filter(n=>n.id!==e),Js(this.hass,e).then(()=>{this._closeModal(),window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(n=>{this._categories=i;let s=n.code;s==="category_in_use"?this._modalError=a(this.hass,"ui.category_delete_blocked_in_use","This category still has scenes \u2014 move or delete them first."):s==="category_last"?this._modalError=a(this.hass,"ui.category_delete_blocked_last","You can't delete the last category."):this._modalError=S(this.hass,n)})}_renderIconField(){return customElements.get("ha-icon-picker")?l`<ha-icon-picker
        .hass=${this.hass}
        .value=${this._editing.icon??""}
        @value-changed=${e=>{e.stopPropagation(),this._onIcon(e.detail.value)}}
      ></ha-icon-picker>`:l`<input
      class="icon-input"
      .value=${this._editing.icon??""}
      placeholder=${a(this.hass,"ui.category_icon","Icon")}
      @change=${e=>this._onIcon(e.target.value)}
    />`}_renderSwatches(){let e=this._editing.color;return l`
      <div class="swatches">
        ${Qr.map(i=>{let n=os(this.hass,i.id,i.label);return l`<button
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
    `}_renderModal(){if(!this._editing)return"";let e=this._categories.some(n=>n.id===this._editing.id),i=e?a(this.hass,"ui.category_edit_title","Edit category"):a(this.hass,"ui.category_add_title","Add category");return l`
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

            ${this._modalError?l`<p class="modal-error">${this._modalError}</p>`:""}
          </div>
          <div class="modal-footer">
            ${e?l`<button class="delete" @click=${()=>this._deleteCategory()}>
                  ${a(this.hass,"ui.title_delete","Delete")}
                </button>`:l`<span></span>`}
            <div class="right">
              <button class="primary" @click=${()=>this._save()}>
                ${a(this.hass,"ui.category_save","Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    `}render(){return l`
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      <div class="list">
        ${this._sorted().map(e=>{let i=Jr(e.color);return l`<button class="category-row" @click=${()=>this._openEditor(e)}>
            <span class="row-icon">${e.icon?l`<ha-icon icon=${e.icon}></ha-icon>`:""}</span>
            <span class="row-swatch ${i?"":"none"}" style=${i?`background: ${i}`:""}></span>
            <span class="row-name">${e.name}</span>
          </button>`})}
      </div>
      <div class="add-row">
        <button class="add" @click=${()=>this._addCategory()}>
          ${a(this.hass,"ui.category_add","+ Add category")}
        </button>
        <ambience-help .hass=${this.hass} .text=${a(this.hass,"ui.help_categories_tab","Categories let one scope have several independent winners at once \u2014 one scene wins per category.")} .docPath=${"getting-started/step-1-scopes-and-categories"}></ambience-help>
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
  `,c([m({attribute:!1})],xe.prototype,"hass",2),c([f()],xe.prototype,"_categories",2),c([f()],xe.prototype,"_error",2),c([f()],xe.prototype,"_editing",2),c([f()],xe.prototype,"_modalError",2),xe=c([w("ambience-categories-settings")],xe);var Pe=class extends b{constructor(){super(...arguments);this.conditionName="";this.conditionDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let e=G(this.hass,this.conditionName);return l`
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
  `,c([m({attribute:!1})],Pe.prototype,"hass",2),c([m()],Pe.prototype,"conditionName",2),c([m()],Pe.prototype,"conditionDescription",2),c([f()],Pe.prototype,"_expanded",2),Pe=c([w("ambience-condition-card")],Pe);var cp=/^[a-z][a-z0-9_]*$/;function up(t){return t.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var _i=y`
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
`,ue=class extends b{constructor(){super(...arguments);this.takenIds=new Set;this._label="";this._error=""}static{this.styles=_i}connectedCallback(){super.connectedCallback(),this._label=this._initialLabel()??""}_onLabelInput(e){this._label=e.target.value}_validateName(e){return this.existingId?"":this._label.trim()?!e||!cp.test(e)?a(this.hass,"ui.error_start_letter","Name must start with a letter."):this.takenIds.has(e)?a(this.hass,"ui.error_name_exists","An entry with this name already exists. Choose a different name."):"":a(this.hass,"ui.error_enter_name","Please enter a name.")}_onSave(){let e=this.existingId??up(this._label),i=this._validateName(e)||this._validateDef();if(i){this._error=i,this.performUpdate();return}this.dispatchEvent(new CustomEvent(this._saveEvent,{detail:{id:e,definition:this._buildDefinition()},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent(this._cancelEvent,{bubbles:!0,composed:!0}))}render(){let e=this.existingId?this._editTitleTemplate().replace("{name}",this._initialLabel()??this.existingId):this._addTitle();return l`
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
    `}};c([m({attribute:!1})],ue.prototype,"hass",2),c([m({attribute:!1})],ue.prototype,"existingId",2),c([m({attribute:!1})],ue.prototype,"takenIds",2),c([f()],ue.prototype,"_label",2),c([f()],ue.prototype,"_error",2);var ht=class extends ue{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this._def=this.initial}connectedCallback(){super.connectedCallback(),this._def=this.initial}get _saveEvent(){return"period-save"}get _cancelEvent(){return"period-cancel"}_addTitle(){return a(this.hass,"ui.period_modal_add_title","Add custom period")}_editTitleTemplate(){return a(this.hass,"ui.period_modal_edit_title",'Edit "{name}"')}_namePlaceholder(){return a(this.hass,"ui.name_placeholder","e.g. Wind down")}_initialLabel(){return this.initial.label??(this.existingId?pe(this.hass,this.existingId,{}):null)}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_renderFields(){return l`
      <div class="row">
        <label style="min-width: 3em;">${a(this.hass,"ui.from_label","From")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
      </div>
      <div class="row">
        <label style="min-width: 3em;">${a(this.hass,"ui.to_label","To")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
      </div>
    `}_validateDef(){return""}_buildDefinition(){return{from:this._def.from,to:this._def.to,label:this._label.trim()||null}}};ht.styles=[_i,y`
      .row { display: flex; align-items: center; gap: 0.5rem; }
    `],c([m({attribute:!1})],ht.prototype,"initial",2),c([f()],ht.prototype,"_def",2),ht=c([w("ambience-period-edit-modal")],ht);function Ya(t,r){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=re(r,t.anchor);if(t.offset_min===0)return e;let i=Math.abs(t.offset_min),n=i%60===0?`${i/60}${a(r,"ui.unit_hour_abbr","h")}`:`${i}${a(r,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${n}`}var Er=class extends ve{_list(){return Mi(this.hass)}async _save(r,e){await Fs(this.hass,r,e)}_label(r,e){return pe(this.hass,r,e)}_formatDef(r){return`${Ya(r.from,this.hass)} \u2192 ${Ya(r.to,this.hass)}`}_headingKey(){return["ui.periods_heading","Periods"]}_addKey(){return["ui.add_custom_period","+ Add custom period"]}_renderModal(){let r=this._modal;return r.mode==="edit"?l`<ambience-period-edit-modal
        .hass=${this.hass}
        .existingId=${r.id}
        .initial=${r.initial}
        .takenIds=${this._takenIds()}
        @period-save=${this._onModalSave}
        @period-cancel=${this._onModalCancel}
      ></ambience-period-edit-modal>`:r.mode==="add"?l`<ambience-period-edit-modal
        .hass=${this.hass}
        .takenIds=${this._takenIds()}
        @period-save=${this._onModalSave}
        @period-cancel=${this._onModalCancel}
      ></ambience-period-edit-modal>`:l``}};Er=c([w("ambience-time-of-day-config")],Er);var Ge=class extends ue{constructor(){super(...arguments);this.initial={min:0,max:100,label:null};this._min=null;this._max=null}connectedCallback(){super.connectedCallback(),this._min=this.initial.min??null,this._max=this.initial.max??null}get _saveEvent(){return"lux-range-save"}get _cancelEvent(){return"lux-range-cancel"}_addTitle(){return a(this.hass,"ui.lux_modal_add_title","Add custom lux range")}_editTitleTemplate(){return a(this.hass,"ui.lux_modal_edit_title",'Edit "{name}"')}_namePlaceholder(){return a(this.hass,"ui.lux_name_placeholder","e.g. Gloomy")}_initialLabel(){return this.initial.label??(this.existingId?De(this.hass,this.existingId,{}):null)}_onMinInput(e){let i=e.target.value;this._min=i===""?null:Number(i)}_onMaxInput(e){let i=e.target.value;this._max=i===""?null:Number(i)}_renderFields(){return l`
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
    `}_validateDef(){return this._min==null&&this._max==null?a(this.hass,"ui.lux_error_need_bound","Enter a min, a max, or both."):Ln(this._min,this._max,this.hass)??""}_buildDefinition(){let e={label:this._label.trim()||null};return this._min!=null&&(e.min=this._min),this._max!=null&&(e.max=this._max),e}};Ge.styles=[_i,y`
      .row { display: flex; gap: 1rem; }
      .row .field { flex: 1; }
    `],c([m({attribute:!1})],Ge.prototype,"initial",2),c([f()],Ge.prototype,"_min",2),c([f()],Ge.prototype,"_max",2),Ge=c([w("ambience-lux-edit-modal")],Ge);var Ar=class extends ve{_list(){return Fi(this.hass)}async _save(r,e){await js(this.hass,r,e)}_label(r,e){return De(this.hass,r,e)}_formatDef(r){return ln(r.min,r.max,"any")}_headingKey(){return["ui.lux_heading","Lux ranges"]}_addKey(){return["ui.add_custom_lux_range","+ Add custom lux range"]}_renderModal(){let r=this._modal;return r.mode==="edit"?l`<ambience-lux-edit-modal
        .hass=${this.hass}
        .existingId=${r.id}
        .initial=${r.initial}
        .takenIds=${this._takenIds()}
        @lux-range-save=${this._onModalSave}
        @lux-range-cancel=${this._onModalCancel}
      ></ambience-lux-edit-modal>`:r.mode==="add"?l`<ambience-lux-edit-modal
        .hass=${this.hass}
        .takenIds=${this._takenIds()}
        @lux-range-save=${this._onModalSave}
        @lux-range-cancel=${this._onModalCancel}
      ></ambience-lux-edit-modal>`:l``}};Ar=c([w("ambience-lux-config")],Ar);var Ke=class extends b{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._error=""}async connectedCallback(){super.connectedCallback(),ie(this);try{this._config=await Gt(this.hass)}catch(e){this._error=S(this.hass,e)}}async _save(e){this._config=e;try{await zs(this.hass,e.workday_sensor,e.workday_calendar),this._error=""}catch(i){this._error=S(this.hass,i);return}window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=this._error?l`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:"";return l`
      ${e}
      <div class="row">
        <label>${a(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        ${ci(this.hass,"workday_sensor",this._config.workday_sensor,{entity:{integration:"workday",domain:"binary_sensor"}},"binary_sensor.workday",i=>this._onSensorChange({detail:{value:i}}))}
      </div>
      <div class="row">
        <label>${a(this.hass,"ui.workday_calendar","Workday calendar")}</label>
        ${ci(this.hass,"workday_calendar",this._config.workday_calendar,{entity:{integration:"workday",domain:"calendar"}},"calendar.workday",i=>this._onCalendarChange({detail:{value:i}}))}
      </div>
    `}};Ke.styles=y`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
  `,c([m({attribute:!1})],Ke.prototype,"hass",2),c([f()],Ke.prototype,"_config",2),c([f()],Ke.prototype,"_error",2),Ke=c([w("ambience-day-config")],Ke);var pp=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],Ye=class extends b{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._expanded=new Set}async connectedCallback(){super.connectedCallback(),ie(this),this._config=await Kt(this.hass)}async _persist(){await qs(this.hass,this._config.entity,this._config.groups),window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onEntityChange(e){this._config={...this._config,entity:e.detail.value||null},this._persist()}_nextGroupId(e){let i=new Set(e.map(n=>n.id));for(let n=1;n<=e.length+1;n++){let s=`group_${n}`;if(!i.has(s))return s}return`group_${e.length+1}`}_addGroup(){let e=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:e,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,e]),this._persist()}_toggleExpand(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}_updateGroup(e,i){this._config={...this._config,groups:this._config.groups.map((n,s)=>s===e?{...n,...i}:n)},this._persist()}_removeGroup(e){let i=this._config.groups[e];if(this._config={...this._config,groups:this._config.groups.filter((n,s)=>s!==e)},i){let n=new Set(this._expanded);n.delete(i.id),this._expanded=n}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:pp.map(e=>({value:e,label:yt(this.hass,e)}))}}}]}_renderConditions(e,i){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:i.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation(),this._updateGroup(e,{conditions:s.detail.value.conditions??[]})}}
      ></ha-form>`;let n=i.conditions.map(s=>yt(this.hass,s));return l`<span class="conditions-list">${n.join(", ")}</span>`}_renderGroup(e,i){let n=this._expanded.has(i.id),s=i.conditions.map(o=>yt(this.hass,o)).join(", ");return l`
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
        ${n?l`<div class="body" @click=${o=>o.stopPropagation()}>
              <input
                .value=${i.label}
                aria-label=${i.label}
                @change=${o=>this._updateGroup(e,{label:o.target.value})}
              />
              ${this._renderConditions(e,i)}
            </div>`:""}
      </div>
    `}render(){return l`
      <div class="row">
        <label class="section">${a(this.hass,"ui.weather_entity","Weather entity")}</label>
        ${ci(this.hass,"entity",this._config.entity,{entity:{domain:"weather"}},"weather.home",e=>this._onEntityChange({detail:{value:e}}))}
      </div>

      <h4>${a(this.hass,"ui.groups","Groups")}</h4>
      ${this._config.groups.map((e,i)=>this._renderGroup(i,e))}
      <button class="add" @click=${()=>this._addGroup()}>
        ${a(this.hass,"ui.add_group","+ Add group")}
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
  `,c([m({attribute:!1})],Ye.prototype,"hass",2),c([f()],Ye.prototype,"_config",2),c([f()],Ye.prototype,"_expanded",2),Ye=c([w("ambience-weather-config")],Ye);var Qa={time_of_day:t=>l`<ambience-time-of-day-config .hass=${t}></ambience-time-of-day-config>`,lux:t=>l`<ambience-lux-config .hass=${t}></ambience-lux-config>`,day:t=>l`<ambience-day-config .hass=${t}></ambience-day-config>`,weather:t=>l`<ambience-weather-config .hass=${t}></ambience-weather-config>`},hp=new Set(Object.keys(Qa)),Qe=class extends b{constructor(){super(...arguments);this._conditions=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._conditions=await Ni(this.hass)}catch(e){this._error=S(this.hass,e)}}render(){let e=this._conditions.filter(i=>hp.has(i.name)).slice().sort((i,n)=>n.priority-i.priority);return l`
      <div class="tab-heading">
        <span>${a(this.hass,"ui.settings_tab_conditions","Conditions")}</span>
        <ambience-help .hass=${this.hass} .text=${a(this.hass,"ui.help_conditions_tab","Conditions are the inputs scenes match on (time of day, presence, weather, \u2026). A scene wins when all its conditions pass.")} .docPath=${"reference/conditions"}></ambience-help>
      </div>
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${e.map(i=>l`
        <ambience-condition-card .hass=${this.hass} .conditionName=${i.name} .conditionDescription=${i.description}>
          ${Qa[i.name]?.(this.hass)??l``}
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
  `,c([m({attribute:!1})],Qe.prototype,"hass",2),c([f()],Qe.prototype,"_conditions",2),c([f()],Qe.prototype,"_error",2),Qe=c([w("ambience-conditions-settings")],Qe);function Ja(t,r){let e=t?.config?.components;return Array.isArray(e)&&e.includes(r)}var mp="fado",_p="https://my.home-assistant.io/redirect/hacs_repository/?owner=clintongormley&repository=ha-fado",I=class extends b{constructor(){super(...arguments);this._actions=[];this._services=[];this._schemas={};this._fieldSchemas={};this._addSchema=[];this._serviceById=new Map;this._availableServices=[];this._expanded=new Set;this._adding=!1;this._loadError=null;this._saveError=null;this._loaded=!1;this._fadoNoticeDismissed=!1;this._installId=null;this._editingDefault=null;this._editingOriginalValue=void 0;this._editingOriginalHad=!1;this._drag=new St(this,(e,i)=>{let n=[...this._actions],[s]=n.splice(e,1);n.splice(i,0,s),this._actions=n,this._autoSave()});this._onDocPointerDown=e=>{if(!this._adding&&this._editingDefault===null)return;let i=e.composedPath(),n=i.some(s=>s instanceof Element&&I._OVERLAY_TAG_RE.test(s.localName));this._collapseAddFormOnClickAway(i,n),this._cancelEditingDefaultOnClickAway(i,n)}}_collapseAddFormOnClickAway(e,i){if(!this._adding)return;let n=this.shadowRoot?.querySelector(".add-row");!(!!n&&e.includes(n))&&!i&&(this._adding=!1)}_cancelEditingDefaultOnClickAway(e,i){if(this._editingDefault===null)return;let n=this.shadowRoot?.querySelector(`.field-row-editor[data-editing-key="${this._editingDefault}"]`);(!n||!e.includes(n))&&!i&&this._cancelEditingDefault()}connectedCallback(){super.connectedCallback(),document.addEventListener("pointerdown",this._onDocPointerDown),customElements.get("ha-service-picker")||customElements.whenDefined("ha-service-picker").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._onDocPointerDown)}_startEditingDefault(e,i){let s=this._actions.find(o=>o.id===e)?.defaults??{};this._editingOriginalHad=i in s,this._editingOriginalValue=s[i],this._editingDefault=`${e}:${i}`}_saveEditingDefault(){this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1,this._autoSave()}_cancelEditingDefault(){let e=this._editingDefault;if(e){let i=e.indexOf(":"),n=e.slice(0,i),s=e.slice(i+1);this._actions=this._actions.map(o=>{if(o.id!==n)return o;let d={...o.defaults??{}};return this._editingOriginalHad?d[s]=this._editingOriginalValue:delete d[s],{...o,defaults:d}})}this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1}async firstUpdated(){await this._reload()}willUpdate(e){if(e.has("_actions")||e.has("_schemas")){let i={};for(let n of this._actions){let s=this._schemas[n.id];if(s)for(let[o,d]of Object.entries(s.fields))i[`${n.id}:${o}`]=[{name:o,selector:d.selector??{text:{}},required:!1}]}this._fieldSchemas=i}if(e.has("_services")&&(this._serviceById=new Map(this._services.map(i=>[i.id,i]))),e.has("_actions")||e.has("_services")){let i=new Set(this._actions.map(n=>n.id));this._availableServices=this._services.filter(n=>!i.has(n.id)),this._addSchema=[{name:"service",selector:{select:{options:this._availableServices.map(n=>({value:n.id,label:this._addOptionLabel(n.id)})),custom_value:!0,mode:"dropdown",sort:!0}}}]}}async _reload(){this._loadError=null;try{let[e,i,n]=await Promise.all([Bt(this.hass),Ns(this.hass),Oi(this.hass)]);this._actions=e,this._services=i,this._installId=n,this._fadoNoticeDismissed=Cs(n)}catch(e){this._loadError=S(this.hass,e);return}await Promise.all(this._actions.map(e=>this._ensureSchema(e.id))),this._loaded=!0}async _ensureSchema(e){if(!(e in this._schemas))try{let i=await He(this.hass,e);this._schemas={...this._schemas,[e]:i}}catch{this._schemas={...this._schemas,[e]:null}}}_setShowInEditor(e,i,n){this._actions=this._actions.map(s=>{if(s.id!==e)return s;let o=new Set(s.visible_fields??[]);return n?o.add(i):o.delete(i),{...s,visible_fields:[...o]}}),this._autoSave()}_setDefault(e,i,n){this._actions=this._actions.map(s=>s.id!==e?s:{...s,defaults:{...s.defaults??{},[i]:n}})}_clearDefault(e,i){this._actions=this._actions.map(n=>{if(n.id!==e)return n;let s={...n.defaults??{}};return delete s[i],{...n,defaults:s}})}_setLabel(e,i){this._actions=this._actions.map(n=>n.id===e?{...n,label:i}:n)}_toggleExpand(e){this._expanded.has(e)?this._expanded=new Set:(this._expanded=new Set([e]),this._ensureSchema(e))}async _addService(e){if(e&&this._services.some(i=>i.id===e)){if(this._actions.some(i=>i.id===e)){this._expanded=new Set([e]),this._adding=!1;return}await this._ensureSchema(e),this._actions=[...this._actions,{id:e,label:this._labelForService(e),visible_fields:[],defaults:{}}],this._expanded=new Set([e]),this._adding=!1,this._autoSave()}}_removeService(e){this._actions=this._actions.filter(n=>n.id!==e);let i=new Set(this._expanded);i.delete(e),this._expanded=i,this._autoSave()}async _autoSave(){this._saveError=null;try{await Is(this.hass,this._actions),window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"))}catch(e){this._saveError=S(this.hass,e)}}render(){return this._loadError!==null?l`
        <div class="error">${this._loadError}</div>
        <button @click=${()=>this._reload()}>${a(this.hass,"ui.retry","Retry")}</button>
      `:this._loaded?l`
      <section>
        <div class="section-heading">
          <span>${a(this.hass,"ui.settings_tab_actions","Actions")}</span>
          <ambience-help .hass=${this.hass} .text=${a(this.hass,"ui.help_actions_tab","Actions are the service calls a scene runs. Define them here so scenes can reuse them.")} .docPath=${"reference/actions"}></ambience-help>
        </div>
        ${this._renderFadoNotice()}
        ${this._saveError?l`<div class="error">${this._saveError}</div>`:""}
        ${this._actions.map((e,i)=>this._renderCard(e,i))}
        ${this._renderAdd()}
      </section>
    `:l`<div>${a(this.hass,"ui.loading","Loading\u2026")}</div>`}_renderFadoNotice(){return this._fadoNoticeDismissed||Ja(this.hass,mp)?"":l`
      <ambience-banner
        data-test="fado-notice"
        icon="mdi:lightbulb-on-outline"
        hint
        .ctaLabel=${a(this.hass,"ui.fado_notice_cta","Install via HACS")}
        .ctaHref=${_p}
        .dismissLabel=${a(this.hass,"ui.dismiss","Dismiss")}
        @banner-dismiss=${()=>this._dismissFadoNotice()}
      >
        <strong>${a(this.hass,"ui.fado_notice_title","Recommended: install Fado Light Fader")}</strong>
        <span>${a(this.hass,"ui.fado_notice_body","Fado adds smooth light fading for brightness, color, and color temperature \u2014 with automatic brightness restoration, UI autoconfiguration, and native transitions. It's a Home Assistant default HACS integration.")}</span>
      </ambience-banner>
    `}_dismissFadoNotice(){this._fadoNoticeDismissed=!0,Ss(this._installId)}_renderCard(e,i){let n=this._schemas[e.id],s=this._expanded.has(e.id);return l`
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
          ${s?l`
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
              `:l`
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
    `}_renderBody(e,i){return l`
      <div class="body">
        ${this._renderFieldsSection(e,i)}
      </div>
    `}_renderFieldsSection(e,i){if(i===null)return l`<p class="body-help warning">
        ${a(this.hass,"ui.service_unavailable","Service not available in this HA instance.")}
      </p>`;if(i===void 0)return l`<p class="body-help">${a(this.hass,"ui.loading","Loading\u2026")}</p>`;let n=Object.entries(i.fields).slice().sort(([s],[o])=>s.localeCompare(o));return n.length===0?l`<p class="body-help">
        ${a(this.hass,"ui.service_has_no_fields","This service has no fields.")}
      </p>`:l`
      <p class="body-help">
        ${a(this.hass,"ui.actions_field_help_show","Tick a checkbox to make a field editable per scene.")}
        <ambience-help .hass=${this.hass} .text=${a(this.hass,"ui.help_show_in_scene_editor","Show this field in the scene editor so each scene can set it. Leave off to send a fixed default instead.")}></ambience-help>
        ${a(this.hass,"ui.actions_field_help_default","Set a default to pre-fill it.")}
        <ambience-help .hass=${this.hass} .text=${a(this.hass,"ui.help_set_default","A value sent automatically when the action runs. Scenes can override it if the field is also shown in the editor.")}></ambience-help>
      </p>
      ${n.map(([s,o])=>this._renderFieldRow(e,s,o))}
    `}_formatDefaultSummary(e){return e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}_defaultUnitSuffix(e,i){let n=this._schemas[e]?.fields?.[i];if(!n||typeof n!="object")return"";let s=or(n.selector);return s?` ${s}`:""}_renderFieldRow(e,i,n){let s=(e.visible_fields??[]).includes(i),o=i in(e.defaults??{}),d=`${e.id}:${i}`,u=this._editingDefault===d;return l`
      <div class="field-row">
        <!-- Row 1: [checkbox] [name] [default summary] -->
        <div class="field-row-main">
          <div class="checkbox-cell">
            <input
              type="checkbox"
              data-show-in-editor=${i}
              title=${a(this.hass,"ui.show_in_scene_editor","Show in scene editor")}
              .checked=${s}
              @change=${p=>this._setShowInEditor(e.id,i,p.target.checked)}
            />
          </div>
          <span class="name">
            ${n.name||j(i)}
            ${n.name?l` <small class="field-id">(${i})</small>`:""}
            ${n.description?l` <small>— ${n.description}</small>`:""}
          </span>
          <div class="summary-cell">
            ${u?l`<span class="summary-cell-editing">${a(this.hass,"ui.editing","Editing\u2026")}</span>`:o?l`<button
                    class="default-summary"
                    data-default-summary=${i}
                    @click=${p=>{p.stopPropagation(),this._startEditingDefault(e.id,i)}}
                  >${a(this.hass,"ui.default_prefix","Default: ")}${this._formatDefaultSummary(e.defaults?.[i])}${this._defaultUnitSuffix(e.id,i)}</button>`:l`<button
                    class="set-default-btn"
                    data-set-default=${i}
                    @click=${p=>{p.stopPropagation(),this._startEditingDefault(e.id,i)}}
                  >+ ${a(this.hass,"ui.set_default","Set default")}</button>`}
          </div>
        </div>
        <!-- Row 2: full editor (only when editing) -->
        ${u?l`<div
              class="field-row-editor"
              data-editing-key=${d}
            >
              <div class="editor-line">
                <div class="default-editor">${this._renderDefaultEditor(e,i,n)}</div>
                <button
                  class="clear-default"
                  data-clear-default=${i}
                  title=${a(this.hass,"ui.clear_default","Clear default")}
                  @click=${p=>{p.stopPropagation(),this._clearDefault(e.id,i),this._saveEditingDefault()}}
                >✕</button>
              </div>
              <div class="editor-actions">
                <button
                  class="cancel-default"
                  data-cancel-default=${i}
                  @click=${p=>{p.stopPropagation(),this._cancelEditingDefault()}}
                >${a(this.hass,"ui.cancel","Cancel")}</button>
                <button
                  class="save-default"
                  data-save-default=${i}
                  @click=${p=>{p.stopPropagation(),this._saveEditingDefault()}}
                >${a(this.hass,"ui.save","Save")}</button>
              </div>
            </div>`:""}
      </div>
    `}_renderDefaultEditor(e,i,n){let s=e.defaults?.[i],o=this._fieldSchemas[`${e.id}:${i}`]??[];return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${o}
        .data=${{[i]:s??""}}
        .computeLabel=${()=>""}
        @value-changed=${d=>{d.stopPropagation(),this._setDefault(e.id,i,d.detail.value[i])}}
      ></ha-form>`:l`<input
      data-default-value=${i}
      .value=${s==null?"":String(s)}
      @input=${d=>this._setDefault(e.id,i,d.target.value)}
    />`}_renderAdd(){return this._adding?l`<div class="add-row">
      ${this._renderAddPicker()}
      <button data-action="cancel-add" @click=${()=>{this._adding=!1}}>
        ${a(this.hass,"ui.cancel","Cancel")}
      </button>
    </div>`:l`<div class="add-row">
        <button class="add" data-action="add" @click=${()=>{this._adding=!0}}>
          + ${a(this.hass,"ui.add_action_button","Add action")}
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
        .computeLabel=${()=>a(this.hass,"ui.pick_service","Pick a service")}
        @value-changed=${e=>{e.stopPropagation();let i=e.detail.value.service;i&&this._addService(i)}}
      ></ha-form>`:l`<select
      data-add-service
      @change=${e=>this._addService(e.target.value)}
    >
      <option value="">— ${a(this.hass,"ui.pick_service","Pick a service")} —</option>
      ${this._availableServices.map(e=>l`<option value=${e.id}>${this._addOptionLabel(e.id)}</option>`)}
    </select>`}};I.styles=[y`
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
  `],I._OVERLAY_TAG_RE=/vaadin|combo-box|overlay|listbox|menu|mwc-|md-/i,c([m({attribute:!1})],I.prototype,"hass",2),c([f()],I.prototype,"_actions",2),c([f()],I.prototype,"_services",2),c([f()],I.prototype,"_schemas",2),c([f()],I.prototype,"_fieldSchemas",2),c([f()],I.prototype,"_addSchema",2),c([f()],I.prototype,"_expanded",2),c([f()],I.prototype,"_adding",2),c([f()],I.prototype,"_loadError",2),c([f()],I.prototype,"_saveError",2),c([f()],I.prototype,"_loaded",2),c([f()],I.prototype,"_fadoNoticeDismissed",2),c([f()],I.prototype,"_editingDefault",2),c([f()],I.prototype,"_editingOriginalValue",2),c([f()],I.prototype,"_editingOriginalHad",2),I=c([w("ambience-actions-settings")],I);var B=class extends Error{constructor(r){super(r),this.name="ImportError"}};function Tr(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function fp(t){if(!Tr(t))throw new B("`scope` must be an object with a `kind`.");let r=t.kind;if(r==="house")return{kind:"house"};if(r==="area"||r==="floor"){if(typeof t.id!="string"||t.id==="")throw new B(`A ${r} scope needs a non-empty \`id\`.`);return{kind:r,id:t.id}}throw new B("`scope.kind` must be one of: area, floor, house.")}function gp(t){if(!Array.isArray(t))throw new B("`scenes` must be a list.");return t.map((r,e)=>{if(!Tr(r))throw new B(`Scene ${e+1} must be an object.`);if(typeof r.category!="string"||r.category==="")throw new B(`Scene ${e+1} is missing a \`category\`.`);return r})}function vp(t){if(t!==void 0){if(!Tr(t)||typeof t.id!="string"||t.id==="")throw new B("`category` must be an object with a non-empty `id`.");return t}}function Xa(t){let r;try{r=_r(t)}catch(n){throw new B(`Could not parse YAML/JSON: ${n.message}`)}if(!Tr(r))throw new B("Import must be a YAML/JSON object (an `ambience_import` block).");let e=Number(r.ambience_import);if(r.ambience_import===void 0||!Number.isFinite(e)||e<1)throw new B("Missing or invalid `ambience_import` marker \u2014 is this an Ambience import block?");if(e>1)throw new B(`This is import format v${e}, but this Ambience only understands v1 \u2014 update Ambience.`);let i=r.mode??"merge";if(i!=="merge"&&i!=="replace")throw new B("`mode` must be `merge` or `replace`.");return{ambience_import:e,scope:fp(r.scope),category:vp(r.category),mode:i,scenes:gp(r.scenes)}}function Nn(t){return`${t.category}\0${(t.name??"").trim().toLowerCase()}`}function Lr(t){return t.name??"(unnamed)"}function Za(t,r,e){let i=new Set(e.map(v=>v.id)),n=t.category?.id,s=t.category&&!i.has(t.category.id)?t.category:null,o=new Set(i);n&&o.add(n);let d=[...new Set(t.scenes.map(v=>v.category).filter(v=>!o.has(v)))],u=r.scenes??[],p=[],h=[],_=[],g;if(t.mode==="replace"){let v=new Set(t.scenes.map(x=>x.category));for(let x of u)v.has(x.category)&&_.push(Lr(x));g=u.filter(x=>!v.has(x.category));for(let x of t.scenes)p.push(Lr(x)),g.push(x)}else{g=u.map(x=>({...x}));let v=new Map(g.map((x,C)=>[Nn(x),C]));for(let x of t.scenes){let P=(x.name??"").trim()!==""?v.get(Nn(x)):void 0;P!==void 0?(g[P]=x,h.push(Lr(x))):(v.set(Nn(x),g.length),g.push(x),p.push(Lr(x)))}}return{scope:t.scope,mode:t.mode,newCategory:s,unknownCategories:d,adds:p,updates:h,removes:_,resultConfig:{...r,scenes:g}}}var yp=Ct("reference/ai/mcp-server"),bp=Ct("reference/ai/download-and-paste"),wp=`${en}/issues/new`,ae=class extends b{constructor(){super(...arguments);this.text="";this.error=null;this.preview=null;this.categories=[];this.busy=!1;this.done=null}async _download(){try{await so(this.hass)}catch(e){this.error=S(this.hass,e)}}async _onFile(e){let i=e.target,n=i.files?.[0];if(i.value="",!!n){this.error=null,this.done=null,this.preview=null;try{this.text=await n.text()}catch(s){this.error=S(this.hass,s);return}await this._doPreview()}}async _doPreview(){this.done=null;try{let e=Xa(this.text),[i,n]=await Promise.all([ao(this.hass,e.scope),Ce(this.hass)]);this.categories=n,this.preview=Za(e,i,n),this.error=null}catch(e){this.preview=null,this.error=e instanceof B?e.message:S(this.hass,e)}}async _confirm(){let e=this.preview;if(!(!e||e.unknownCategories.length>0||this.busy)){this.busy=!0;try{await oo(this.hass,e.resultConfig),e.newCategory&&await ji(this.hass,[...this.categories,e.newCategory]),await lo(this.hass,e.scope,e.resultConfig,{action:"import",scene_name:null},{minimisePins:!0}),window.dispatchEvent(new CustomEvent("ambience-config-imported")),e.newCategory&&window.dispatchEvent(new CustomEvent("ambience-categories-changed")),this.done=a(this.hass,"ui.import_done","Imported successfully."),this.preview=null,this.text=""}catch(i){this.error=S(this.hass,i)}finally{this.busy=!1}}}_list(e,i){return i.length===0?$:l`<div>${e}<ul>${i.map(n=>l`<li>${n}</li>`)}</ul></div>`}_renderPreview(e){let i=e.scope.kind==="house"?e.scope.kind:`${e.scope.kind} ${e.scope.id}`;return l`
      <div class="preview-panel">
        <div class="target">${a(this.hass,"ui.import_target","Target")}: ${i} · ${e.mode}</div>
        ${e.newCategory?l`<div class="new-category">${a(this.hass,"ui.import_new_category","New category to create")}: ${e.newCategory.name}</div>`:$}
        ${e.unknownCategories.length>0?l`<div class="error unknown">${a(this.hass,"ui.import_unknown_categories","Unknown categories (create them first)")}: ${e.unknownCategories.join(", ")}</div>`:$}
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
    `}render(){return l`
      <div class="header">
        <span class="title">${a(this.hass,"ui.import_title","Author & fix scenes with AI")}</span>
        <span class="pill beta">${a(this.hass,"ui.import_beta","Beta")}</span>
      </div>
      <section class="path card">
        <div class="section-heading">
          <span>${a(this.hass,"ui.import_mcp_title","Author live with the MCP server")}</span>
          <span class="pill recommended"
            >${a(this.hass,"ui.import_mcp_recommended","Recommended")}</span
          >
        </div>
        <div class="section-body">
          <p>${a(this.hass,"ui.import_mcp_desc","Install the MCP server for the fastest authoring and editing experience with Claude Code or Claude Desktop.")}</p>
          <p>
            <a class="help-link" href=${yp} target="_blank" rel="noopener noreferrer"
              >${a(this.hass,"ui.import_mcp_link","Set up the MCP server")}</a
            >
          </p>
        </div>
      </section>
      <hr class="path-divider" />
      <section class="path">
        <div class="section-heading">${a(this.hass,"ui.import_paste_title","Alternatively, download and paste into any AI")}</div>
        <ol class="steps">
        <li>
          <div class="step-title">${a(this.hass,"ui.import_step1","Install the skill or plugin once")}</div>
          <div class="step-body">
            ${a(this.hass,"ui.import_step1_desc","Add the Ambience AI pack to your AI to teach it about Ambience.")}
            <a class="help-link" href=${bp} target="_blank" rel="noopener noreferrer"
              >${a(this.hass,"ui.import_help_link","Install & usage guide")}</a
            >
          </div>
        </li>
        <li>
          <div class="step-title">${a(this.hass,"ui.import_step2","Download your AI bundle")}</div>
          <div class="step-body">
            ${a(this.hass,"ui.import_step2_desc","The bundle contains a snapshot of your areas, entities and exposed actions (location data redacted) for the AI to author against. Upload it to the AI with your request.")}
          </div>
          <button class="download" @click=${()=>this._download()}>
            ${a(this.hass,"ui.import_download_bundle","Download AI bundle")}
          </button>
        </li>
        <li>
          <div class="step-title">${a(this.hass,"ui.import_step3","Upload the result")}</div>
          <div class="step-body">
            ${a(this.hass,"ui.import_step3_desc","Upload the YAML or JSON file the AI gives you. It will show you a preview before any changes are made, and you can always revert them with the Undo button.")}
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
      ${this.error?l`<div class="error">${this.error}</div>`:$}
      ${this.preview?this._renderPreview(this.preview):$}
      ${this.done?l`<div class="done">${this.done}</div>`:$}
      <div class="feedback card">
        <div class="fb-title">${a(this.hass,"ui.import_feedback_title","Can you do better than the AI?")}</div>
        <div class="fb-body">
          ${a(this.hass,"ui.import_feedback_body","If the AI gives you bad advice, share its suggestion, your corrected version, and a short note on what was wrong \u2014 it's used to improve the cookbook the AI learns from.")}
          <a class="fb-link" href=${wp} target="_blank" rel="noopener noreferrer"
            >${a(this.hass,"ui.import_feedback_link","Report it on GitHub")}</a
          >
        </div>
      </div>
    `}};ae.styles=y`
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
  `,c([m({attribute:!1})],ae.prototype,"hass",2),c([f()],ae.prototype,"text",2),c([f()],ae.prototype,"error",2),c([f()],ae.prototype,"preview",2),c([f()],ae.prototype,"categories",2),c([f()],ae.prototype,"busy",2),c([f()],ae.prototype,"done",2),ae=c([w("ambience-import-config")],ae);var Je=class extends b{constructor(){super(...arguments);this._tab="categories"}willUpdate(e){e.has("initialTab")&&this.initialTab&&(this._tab=this.initialTab)}render(){return l`
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
  `,c([m({attribute:!1})],Je.prototype,"hass",2),c([m({attribute:!1})],Je.prototype,"initialTab",2),c([f()],Je.prototype,"_tab",2),Je=c([w("ambience-settings-view")],Je);var Xe=class extends b{constructor(){super();this.open=!1;new Be(this,()=>this._close())}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?l`
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
    `:$}};Xe.styles=y`
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
  `,c([m({attribute:!1})],Xe.prototype,"hass",2),c([m({type:Boolean,reflect:!0})],Xe.prototype,"open",2),c([m({attribute:!1})],Xe.prototype,"initialTab",2),Xe=c([w("ambience-settings-modal")],Xe);function xp(t){let r=t.indexOf("?");return r===-1?"":new URLSearchParams(t.slice(r+1)).get("fe")??""}var el={runningFrontendHash(){return xp(import.meta.url)}};var $p={reload(){location.reload()}},fi=class extends b{constructor(){super(...arguments);this._serverVersion=null;this._checked=!1}static{this.styles=y`
    :host {
      display: block;
    }
    .message {
      font-size: 1rem;
      line-height: 1.4;
      color: var(--primary-text-color, #212121);
    }
  `}willUpdate(e){this._checked||!e.has("hass")||!this.hass||(this._checked=!0,this._check())}async _check(){let e=el.runningFrontendHash();if(!(!e||!this.hass))try{let{hash:i,version:n}=await Ds(this.hass);if(!i||i==="missing"||i===e)return;this._serverVersion=n}catch{}}render(){if(this._serverVersion===null)return $;let e=a(this.hass,"ui.version_update.message","Ambience {version} has been installed \u2014 reload to update.",{version:this._serverVersion}),i=a(this.hass,"ui.version_update.reload","Reload");return l`
      <ambience-banner
        data-test="version-banner"
        icon="mdi:update"
        hint
        .dismissible=${!1}
        .ctaLabel=${i}
        @banner-cta=${()=>$p.reload()}
      ><span class="message">${e}</span></ambience-banner>
    `}};c([m({attribute:!1})],fi.prototype,"hass",2),c([f()],fi.prototype,"_serverVersion",2);Ai("ambience-version-banner",fi);var mt=class extends b{constructor(){super(...arguments);this._settingsOpen=!1;this._filterCategory=Hi();this._onOpenSettings=e=>{let i=e.detail?.tab;this._settingsTab=i,this._settingsOpen=!0};this._onFilterChanged=e=>{this._filterCategory=e.detail?.category??"",e.stopPropagation()}}static{this.styles=y`
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
  `}connectedCallback(){super.connectedCallback(),ie(this),this.addEventListener("ambience-open-settings",this._onOpenSettings),this.addEventListener("ambience-filter-changed",this._onFilterChanged)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("ambience-open-settings",this._onOpenSettings),this.removeEventListener("ambience-filter-changed",this._onFilterChanged)}render(){let e={dark:!!this.hass.themes?.darkMode,title:a(this.hass,"ui.panel_title","Ambience")};return l`
      <ambience-version-banner .hass=${this.hass}></ambience-version-banner>
      <header>
        <div class="bar">
          <h1 class="brand">
            ${ds(e)}
            ${cs(e)}
          </h1>
          <ambience-category-filter .hass=${this.hass}></ambience-category-filter>
          <button
            class="settings-btn"
            @click=${()=>{this._settingsTab=void 0,this._settingsOpen=!0}}
            aria-label=${a(this.hass,"ui.tab_settings","Settings")}
            title=${a(this.hass,"ui.tab_settings","Settings")}
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
    `}};c([m({attribute:!1})],mt.prototype,"hass",2),c([f()],mt.prototype,"_settingsOpen",2),c([f()],mt.prototype,"_settingsTab",2),c([f()],mt.prototype,"_filterCategory",2);Ai("ambience-frontend",mt);export{mt as AmbienceFrontend};
