/* Ambience — bundled output. Do not edit by hand. */
var $o=Object.defineProperty;var ko=Object.getOwnPropertyDescriptor;var c=(t,n,e,i)=>{for(var r=i>1?void 0:i?ko(n,e):n,s=t.length-1,o;s>=0;s--)(o=t[s])&&(r=(i?o(n,e,r):o(r))||r);return i&&r&&$o(n,e,r),r};var qt=globalThis,Kt=qt.ShadowRoot&&(qt.ShadyCSS===void 0||qt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Bi=Symbol(),Fr=new WeakMap,yt=class{constructor(n,e,i){if(this._$cssResult$=!0,i!==Bi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(Kt&&n===void 0){let i=e!==void 0&&e.length===1;i&&(n=Fr.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&Fr.set(e,n))}return n}toString(){return this.cssText}},Mr=t=>new yt(typeof t=="string"?t:t+"",void 0,Bi),y=(t,...n)=>{let e=t.length===1?t[0]:n.reduce((i,r,s)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[s+1],t[0]);return new yt(e,t,Bi)},jr=(t,n)=>{if(Kt)t.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let i=document.createElement("style"),r=qt.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,t.appendChild(i)}},Vi=Kt?t=>t:t=>t instanceof CSSStyleSheet?(n=>{let e="";for(let i of n.cssRules)e+=i.cssText;return Mr(e)})(t):t;var{is:Eo,defineProperty:So,getOwnPropertyDescriptor:Co,getOwnPropertyNames:To,getOwnPropertySymbols:Lo,getPrototypeOf:Ro}=Object,Yt=globalThis,zr=Yt.trustedTypes,Po=zr?zr.emptyScript:"",Ao=Yt.reactiveElementPolyfillSupport,bt=(t,n)=>t,wt={toAttribute(t,n){switch(n){case Boolean:t=t?Po:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,n){let e=t;switch(n){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},Gt=(t,n)=>!Eo(t,n),Wr={attribute:!0,type:String,converter:wt,reflect:!1,useDefault:!1,hasChanged:Gt};Symbol.metadata??=Symbol("metadata"),Yt.litPropertyMetadata??=new WeakMap;var pe=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Wr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(n,i,e);r!==void 0&&So(this.prototype,n,r)}}static getPropertyDescriptor(n,e,i){let{get:r,set:s}=Co(this.prototype,n)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){let a=r?.call(this);s?.call(this,o),this.requestUpdate(n,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Wr}static _$Ei(){if(this.hasOwnProperty(bt("elementProperties")))return;let n=Ro(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(bt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(bt("properties"))){let e=this.properties,i=[...To(e),...Lo(e)];for(let r of i)this.createProperty(r,e[r])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let r of i)e.unshift(Vi(r))}else n!==void 0&&e.push(Vi(n));return e}static _$Eu(n,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return jr(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,i){this._$AK(n,i)}_$ET(n,e){let i=this.constructor.elementProperties.get(n),r=this.constructor._$Eu(n,i);if(r!==void 0&&i.reflect===!0){let s=(i.converter?.toAttribute!==void 0?i.converter:wt).toAttribute(e,i.type);this._$Em=n,s==null?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(n,e){let i=this.constructor,r=i._$Eh.get(n);if(r!==void 0&&this._$Em!==r){let s=i.getPropertyOptions(r),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:wt;this._$Em=r;let a=o.fromAttribute(e,s.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(n,e,i,r=!1,s){if(n!==void 0){let o=this.constructor;if(r===!1&&(s=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??Gt)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:i,reflect:r,wrapped:s},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??e??this[n]),s!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(e=void 0),this._$AL.set(n,e)),r===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,s]of this._$Ep)this[r]=s;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,s]of i){let{wrapped:o}=s,a=this[r];o!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,s,a)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};pe.elementStyles=[],pe.shadowRootOptions={mode:"open"},pe[bt("elementProperties")]=new Map,pe[bt("finalized")]=new Map,Ao?.({ReactiveElement:pe}),(Yt.reactiveElementVersions??=[]).push("2.1.2");var Ki=globalThis,Ur=t=>t,Qt=Ki.trustedTypes,Br=Qt?Qt.createPolicy("lit-html",{createHTML:t=>t}):void 0,Yi="$lit$",me=`lit$${Math.random().toFixed(9).slice(2)}$`,Gi="?"+me,Do=`<${Gi}>`,ze=document,$t=()=>ze.createComment(""),kt=t=>t===null||typeof t!="object"&&typeof t!="function",Qi=Array.isArray,Qr=t=>Qi(t)||typeof t?.[Symbol.iterator]=="function",qi=`[ 	
\f\r]`,xt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Vr=/-->/g,qr=/>/g,Me=RegExp(`>|${qi}(?:([^\\s"'>=/]+)(${qi}*=${qi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Kr=/'/g,Yr=/"/g,Xr=/^(?:script|style|textarea|title)$/i,Xi=t=>(n,...e)=>({_$litType$:t,strings:n,values:e}),l=Xi(1),xc=Xi(2),$c=Xi(3),q=Symbol.for("lit-noChange"),k=Symbol.for("lit-nothing"),Gr=new WeakMap,je=ze.createTreeWalker(ze,129);function Jr(t,n){if(!Qi(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Br!==void 0?Br.createHTML(n):n}var Zr=(t,n)=>{let e=t.length-1,i=[],r,s=n===2?"<svg>":n===3?"<math>":"",o=xt;for(let a=0;a<e;a++){let u=t[a],h,p,f=-1,_=0;for(;_<u.length&&(o.lastIndex=_,p=o.exec(u),p!==null);)_=o.lastIndex,o===xt?p[1]==="!--"?o=Vr:p[1]!==void 0?o=qr:p[2]!==void 0?(Xr.test(p[2])&&(r=RegExp("</"+p[2],"g")),o=Me):p[3]!==void 0&&(o=Me):o===Me?p[0]===">"?(o=r??xt,f=-1):p[1]===void 0?f=-2:(f=o.lastIndex-p[2].length,h=p[1],o=p[3]===void 0?Me:p[3]==='"'?Yr:Kr):o===Yr||o===Kr?o=Me:o===Vr||o===qr?o=xt:(o=Me,r=void 0);let v=o===Me&&t[a+1].startsWith("/>")?" ":"";s+=o===xt?u+Do:f>=0?(i.push(h),u.slice(0,f)+Yi+u.slice(f)+me+v):u+me+(f===-2?a:v)}return[Jr(t,s+(t[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},Et=class t{constructor({strings:n,_$litType$:e},i){let r;this.parts=[];let s=0,o=0,a=n.length-1,u=this.parts,[h,p]=Zr(n,e);if(this.el=t.createElement(h,i),je.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(r=je.nextNode())!==null&&u.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(let f of r.getAttributeNames())if(f.endsWith(Yi)){let _=p[o++],v=r.getAttribute(f).split(me),x=/([.?@])?(.*)/.exec(_);u.push({type:1,index:s,name:x[2],strings:v,ctor:x[1]==="."?Jt:x[1]==="?"?Zt:x[1]==="@"?ei:Ue}),r.removeAttribute(f)}else f.startsWith(me)&&(u.push({type:6,index:s}),r.removeAttribute(f));if(Xr.test(r.tagName)){let f=r.textContent.split(me),_=f.length-1;if(_>0){r.textContent=Qt?Qt.emptyScript:"";for(let v=0;v<_;v++)r.append(f[v],$t()),je.nextNode(),u.push({type:2,index:++s});r.append(f[_],$t())}}}else if(r.nodeType===8)if(r.data===Gi)u.push({type:2,index:s});else{let f=-1;for(;(f=r.data.indexOf(me,f+1))!==-1;)u.push({type:7,index:s}),f+=me.length-1}s++}}static createElement(n,e){let i=ze.createElement("template");return i.innerHTML=n,i}};function We(t,n,e=t,i){if(n===q)return n;let r=i!==void 0?e._$Co?.[i]:e._$Cl,s=kt(n)?void 0:n._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),s===void 0?r=void 0:(r=new s(t),r._$AT(t,e,i)),i!==void 0?(e._$Co??=[])[i]=r:e._$Cl=r),r!==void 0&&(n=We(t,r._$AS(t,n.values),r,i)),n}var Xt=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:i}=this._$AD,r=(n?.creationScope??ze).importNode(e,!0);je.currentNode=r;let s=je.nextNode(),o=0,a=0,u=i[0];for(;u!==void 0;){if(o===u.index){let h;u.type===2?h=new rt(s,s.nextSibling,this,n):u.type===1?h=new u.ctor(s,u.name,u.strings,this,n):u.type===6&&(h=new ti(s,this,n)),this._$AV.push(h),u=i[++a]}o!==u?.index&&(s=je.nextNode(),o++)}return je.currentNode=ze,r}p(n){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,e),e+=i.strings.length-2):i._$AI(n[e])),e++}},rt=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,i,r){this.type=2,this._$AH=k,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=We(this,n,e),kt(n)?n===k||n==null||n===""?(this._$AH!==k&&this._$AR(),this._$AH=k):n!==this._$AH&&n!==q&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Qr(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==k&&kt(this._$AH)?this._$AA.nextSibling.data=n:this.T(ze.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:i}=n,r=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=Et.createElement(Jr(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{let s=new Xt(r,this),o=s.u(this.options);s.p(e),this.T(o),this._$AH=s}}_$AC(n){let e=Gr.get(n.strings);return e===void 0&&Gr.set(n.strings,e=new Et(n)),e}k(n){Qi(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,r=0;for(let s of n)r===e.length?e.push(i=new t(this.O($t()),this.O($t()),this,this.options)):i=e[r],i._$AI(s),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let i=Ur(n).nextSibling;Ur(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Ue=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,i,r,s){this.type=1,this._$AH=k,this._$AN=void 0,this.element=n,this.name=e,this._$AM=r,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=k}_$AI(n,e=this,i,r){let s=this.strings,o=!1;if(s===void 0)n=We(this,n,e,0),o=!kt(n)||n!==this._$AH&&n!==q,o&&(this._$AH=n);else{let a=n,u,h;for(n=s[0],u=0;u<s.length-1;u++)h=We(this,a[i+u],e,u),h===q&&(h=this._$AH[u]),o||=!kt(h)||h!==this._$AH[u],h===k?n=k:n!==k&&(n+=(h??"")+s[u+1]),this._$AH[u]=h}o&&!r&&this.j(n)}j(n){n===k?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Jt=class extends Ue{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===k?void 0:n}},Zt=class extends Ue{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==k)}},ei=class extends Ue{constructor(n,e,i,r,s){super(n,e,i,r,s),this.type=5}_$AI(n,e=this){if((n=We(this,n,e,0)??k)===q)return;let i=this._$AH,r=n===k&&i!==k||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,s=n!==k&&(i===k||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},ti=class{constructor(n,e,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){We(this,n)}},en={M:Yi,P:me,A:Gi,C:1,L:Zr,R:Xt,D:Qr,V:We,I:rt,H:Ue,N:Zt,U:ei,B:Jt,F:ti},Ho=Ki.litHtmlPolyfillSupport;Ho?.(Et,rt),(Ki.litHtmlVersions??=[]).push("3.3.2");var tn=(t,n,e)=>{let i=e?.renderBefore??n,r=i._$litPart$;if(r===void 0){let s=e?.renderBefore??null;i._$litPart$=r=new rt(n.insertBefore($t(),s),s,void 0,e??{})}return r._$AI(t),r};var Ji=globalThis,b=class extends pe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=tn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};b._$litElement$=!0,b.finalized=!0,Ji.litElementHydrateSupport?.({LitElement:b});var Oo=Ji.litElementPolyfillSupport;Oo?.({LitElement:b});(Ji.litElementVersions??=[]).push("4.2.2");var w=t=>(n,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(t,n)}):customElements.define(t,n)};var No={attribute:!0,type:String,converter:wt,reflect:!1,hasChanged:Gt},Io=(t=No,n,e)=>{let{kind:i,metadata:r}=e,s=globalThis.litPropertyMetadata.get(r);if(s===void 0&&globalThis.litPropertyMetadata.set(r,s=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(e.name,t),i==="accessor"){let{name:o}=e;return{set(a){let u=n.get.call(this);n.set.call(this,a),this.requestUpdate(o,u,t,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,t,a),a}}}if(i==="setter"){let{name:o}=e;return function(a){let u=this[o];n.call(this,a),this.requestUpdate(o,u,t,!0,a)}}throw Error("Unsupported decorator location: "+i)};function m(t){return(n,e)=>typeof e=="object"?Io(t,n,e):((i,r,s)=>{let o=r.hasOwnProperty(s);return r.constructor.createProperty(s,i),o?Object.getOwnPropertyDescriptor(r,s):void 0})(t,n,e)}function g(t){return m({...t,state:!0,attribute:!1})}function rn(t,n){try{customElements.define(t,n)}catch{}}var Fo=["ha-input","ha-textfield","ha-form"],Mo=["ha-input","ha-textfield"];function nn(){for(let t of Mo)if(customElements.get(t))return t;return null}function ee(t){let n=new WeakRef(t);for(let e of Fo)customElements.get(e)||customElements.whenDefined(e).then(()=>n.deref()?.requestUpdate())}var sn={time_of_day_period:{morning:"Morning",afternoon:"Afternoon",evening:"Evening",nighttime:"Nighttime",daytime:"Daytime"},weekday:{mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",sun:"Sun"},day_item:{weekday:"Day of week",day_of_month:"Day of month",date:"Date (annual)",date_range:"Date range (annual)",last_day:"Last day of month",workday:"Workday",holiday:"Holiday",first_workday:"First workday of month",last_workday:"Last workday of month"},lux_range:{dark:"Dark",dim:"Dim",normal:"Normal",bright:"Bright",very_bright:"Very bright"},condition:{time_of_day:"Time of day",state:"Entity state",script:"Script",sun:"Sun",template:"Template",lux:"Lux"},action:{},anchor:{dawn:"Dawn",sunrise:"Sunrise",noon:"Noon",sunset:"Sunset",dusk:"Dusk",midnight:"Midnight"},ui:{panel_title:"Ambience",tab_settings:"Settings",settings_tab_ambience:"Advanced",settings_tab_conditions:"Conditions",settings_tab_actions:"Actions",settings_ambience_pause_card:"Scope-level pause switch",settings_ambience_field_name:"Switch name",settings_ambience_field_pause:"Pause for",settings_reapply_enable_label:"Re-apply scenes after inactivity",settings_reapply_interval_label:"Reapply after",unit_minutes:"minutes",help_pause_switch:"Create a switch entity per area/floor/house that pauses Ambience for that scope when turned off.",help_switch_name:"The name used for the per-scope pause switch entities.",help_pause_for:"When a scope's switch is turned off, auto-resume after this many minutes. 0 = stays paused until turned back on.",help_reapply_toggle:"After this much inactivity, re-assess and re-send a scope/category's scene commands \u2014 recovers commands that were dropped (e.g. a light that didn't turn off).",help_reapply_after:"Minutes of no dispatch to a scope/category before it is re-applied.",help_actions_tab:"Actions are the service calls a scene runs. Define them here so scenes can reuse them.",help_show_in_scene_editor:"Show this field in the scene editor so each scene can set it. Leave off to send a fixed default instead.",help_set_default:"A value sent automatically when the action runs. Scenes can override it if the field is also shown in the editor.",help_conditions_tab:"Conditions are the inputs scenes match on (time of day, presence, weather, \u2026). A scene wins when all its conditions pass.",help_categories_tab:"Categories let one scope have several independent winners at once \u2014 one scene wins per category.",no_areas:"No areas found in Home Assistant.",not_configured:"not configured",scene_singular:"scene",scene_plural:"scenes",all_categories:"All categories",add_category:"Add category\u2026",loading:"Loading\u2026",any_placeholder:"(any)",include:"Include",exclude:"Exclude",empty_all_days:"(empty \u2192 all days)",add_include_item:"+ Add include item",add_exclude_item:"+ Add exclude item",from:"from",to:"to",remove:"Remove",day_of_month_placeholder:"e.g. 1-10, 15",workday_sensor:"Workday sensor",workday_calendar:"Workday calendar",day_warning_prefix:"Warning:",day_warning_text:"scenes now reference unconfigured entities:",periods_heading:"Periods",badge_builtin:"builtin",badge_custom:"custom",period_warning_prefix:"Warning:",period_warning_text:"some scenes now reference missing periods:",add_custom_period:"+ Add custom period",lux_heading:"Lux ranges",lux_warning_text:"some scenes now reference missing lux ranges:",add_custom_lux_range:"+ Add custom lux range",lux_modal_add_title:"Add custom lux range",lux_modal_edit_title:'Edit "{name}"',lux_min_label:"Min (lx)",lux_max_label:"Max (lx)",lux_min_placeholder:"0",lux_max_placeholder:"\u221E",occupancy_is:"is",occupancy_is_not:"is not",lux_any:"Any of",lux_all:"All of",title_edit:"Edit",title_delete:"Delete",new_scene:"New scene",name_optional:"Name (optional)",category:"Category",scope:"Scope",when_heading:"When",actions_heading:"Actions",target:"Target",remove_action:"Remove action",add_action:"+ Add action\u2026",remove_condition:"Remove condition",add_condition:"+ Add condition\u2026",add_action_button:"Add action",cancel:"Cancel",save:"Save",save_scene:"Save scene",at_least_one_target:"At least one target is required.",condition_error:"Fix the error in this condition before continuing",no_scenes_yet:"No scenes yet.",add_scene:"+ Add scene",summary_any:"any",summary_any_paren:"(any)",no_targets:"(no targets)",target_noun:"target",action_singular:"action",action_plural:"actions",noop_prefix:"NOOP",scene_n:"Scene {n}",drag_to_reorder:"Drag to reorder",unpin:"Unpin (return to automatic order)",enable_scene:"Enable scene",disable_scene:"Disable scene",shadowed:"Never fires \u2014 shadowed by an earlier scene.",edit:"Edit",duplicate:"Duplicate",run_actions:"Run actions",run:"Run",auto_triggers_section:"Auto-triggers",auto_triggers_none:"No automatic triggers.",auto_triggers_opaque_note:"A script scene is opaque \u2014 some watches may be missing. Declare them in the scene's Triggers field.",auto_trigger_group_time:"Time",auto_trigger_group_sun:"Sun",auto_trigger_date_rollover:"Local midnight (date rollover)",auto_trigger_periodic:"periodic re-check",more_actions:"More actions",scene_actions:"Scene actions",error_enter_name:"Please enter a name.",error_start_letter:"Name must start with a letter.",error_name_exists:"An entry with this name already exists. Choose a different name.",period_modal_add_title:"Add custom period",period_modal_edit_title:'Edit "{name}"',name:"Name",name_placeholder:"e.g. Wind down",lux_name_placeholder:"e.g. Gloomy",lux_error_need_bound:"Enter a min, a max, or both.",lux_error_negative:"Bounds must be 0 or greater.",lux_error_order:"Min must be less than max.",from_label:"From",to_label:"To",any_time:"Any time",custom_range:"Custom range",custom_suffix:" (custom)",add_time_range:"+ add another time range",endpoint_time:"Time",endpoint_sun:"Sun",offset_placeholder:"Offset",clamp_none:"\u2014",clamp_not_before:"not before",clamp_not_after:"not after",unit_hour:"hour",unit_hours:"hours",unit_min:"min",unit_hour_abbr:"h",unit_min_abbr:"m",no_matching_entities:"No matching entities in this area.",field_kind:"Kind",field_days_of_month:"Days of month",field_month:"Month",field_day:"Day",field_from_month:"From month",field_from_day:"From day",field_to_month:"To month",field_to_day:"To day",day_spec_error:"Use days 1\u201331 and ranges like 1-10, separated by commas",title_override:"Override",thresholds:"Thresholds",add_threshold:"+ Add threshold",weather_entity:"Weather entity",weather_warning_text:"scenes now reference an unconfigured weather entity:",groups:"Groups",add_group:"+ Add group",sun:{elevation:"Elevation",azimuth:"Azimuth",any:"Any",above:"Above",below:"Below",between:"Between",custom_range:"Custom range"},arguments:"Arguments",form:"Form",script:"Script",yaml:"YAML",settings_tab_categories:"Categories",category_add:"+ Add category",category_name_placeholder:"Category name",category_icon:"Icon",category_color:"Colour",category_name_blank_error:"Category names can't be empty.",category_name_duplicate_error:"Two categories can't have the same name.",category_delete_blocked_last:"You can't delete the last category.",category_delete_blocked_in_use:"This category still has scenes \u2014 move or delete them first.",category_edit_title:"Edit category",category_add_title:"Add category",category_color_none:"No colour",category_save:"Save",view_traces:"View traces",pause_scope:"Pause this scope",resume_scope:"Resume now",close:"Close",pick_service:"Pick a service",retry:"Retry",action_label_placeholder:"Label (optional)",action_no_parameters:"This action has no configurable fields.",actions_field_help_show:"Tick a checkbox to make a field editable per scene.",actions_field_help_default:"Set a default to pre-fill it.",clear_default:"Clear default",set_default:"Set default",default_prefix:"Default: ",editing:"Editing\u2026",show_in_scene_editor:"Show in scene editor",extra_fields_prefix:"Extra fields:",extra_fields_hint:"These fields aren't currently exposed but will still be sent.",service_has_no_fields:"This service has no fields.",service_unavailable:"Service not available in this HA instance.",service_not_exposed:"Service no longer exposed; configure it in Settings \u2192 Actions or remove this action.",occupancy_any:"Any of",occupancy_all:"All of",occupancy_detected:"Detected",occupancy_clear:"Clear",occupancy_for:"for",day_pick_weekday:"Pick at least one day of the week.",state_sentinel:"State",invalid_datetime:"Enter a valid date and time.",simulate_title:"Simulate",simulate_when_hint:"drives sun, time-of-day, weekday & workday",simulate_inputs_heading:"Inputs this category depends on",simulate_button:"Simulate",reset_to_now:"Reset to now",reset_to_live:"Reset to live",true_label:"True",false_label:"False",for_label:"For",away:"Away",home:"Home",refresh:"Refresh",new_traces_refresh:"New traces \u2014 refresh",clear_traces:"Clear",download_diagnostics:"Download diagnostics",no_traces_yet:"No traces for this category yet.",yaml_expect_object:"Expected an object",yaml_script_string:"`script` must be a 'script.<name>' string",yaml_args_object:"`args` must be an object if present",yaml_triggers_list:"`triggers` must be a list of entity_id strings if present",template_result:"Result",template_truthy:"true \u2014 matches",template_falsy:"false \u2014 no match",conditions_hint_body:"Configure Workday and Weather in Conditions to use them in your scene conditions.",conditions_hint_body_weather:"Configure Weather in Conditions to use it in your scene conditions.",conditions_hint_body_workday:"Configure Workday in Conditions to use it in your scene conditions.",conditions_hint_cta:"Configure conditions",conditions_hint_title:"Optional: set up Workday & Weather",conditions_hint_title_weather:"Optional: set up Weather",conditions_hint_title_workday:"Optional: set up Workday",dismiss:"Dismiss",for_prefix:"for",name_duplicate:"A scene with this name already exists in this category.",no_actions_body:"Ambience can't apply anything until you expose at least one action \u2014 scenes need actions to run.",no_actions_cta:"Set up actions",no_actions_title:"Set up an action to get started",no_exposed_actions:"Add services in Settings \u2192 Actions.",people_for:"for",people_is_at:"Is at",people_is_at_static:"is at",people_is_not_at:"Is not at",people_mode_all:"All of:",people_mode_any:"Any of:",people_mode_anybody:"Anybody",people_mode_everybody:"Everybody",people_mode_nobody:"Nobody",people_mode_none:"None of:",people_none_tracked:"No people tracked",people_select_one:"Select at least one person",people_where_home:"Home",scope_house:"House",script_triggers:"Triggers",script_triggers_help:"Re-evaluate this scene when these entities change. A script is opaque, so templated references may be missed \u2014 add any it depends on.",script_triggers_none:"No triggers",simulate:"Simulate",state_add_condition:"Add condition",state_add_first:"Add condition",state_add_value:"+ Add state",state_attribute_placeholder:"leave blank to compare state",state_entity:"Entity",state_err_entity:"Entity is required",state_err_incomplete:"This condition is incomplete",state_err_numeric:"Value must be a number",state_err_state:"State is required",state_err_value:"Value is required",state_for:"For (optional)",state_new_condition:"(new condition)",state_not_toggle:"Negate (NOT)",state_op_header:"Comparison",state_unwrap_group:"Remove these parens (promote children to parent)",state_value_label:"Value",state_where:"Where",state_wrap:"Wrap in group"},day_summary:{any:"any",any_day:"any day",except:"except",day_prefix:"day",last_day:"last day",workday:"workday",holiday:"holiday",first_workday:"first workday",last_workday:"last workday"},month:{1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"},weather_condition:{"clear-night":"Clear (night)",cloudy:"Cloudy",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning-rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy-rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy (variant)",exceptional:"Exceptional"},weather_attr:{temperature:"Temperature",apparent_temperature:"Apparent temperature",humidity:"Humidity",wind_speed:"Wind speed",pressure:"Pressure"},state_op:{is:"is",is_not:"is not",">":">",">=":"\u2265","<":"<","<=":"\u2264",and:"AND",or:"OR",and_not:"AND NOT",or_not:"OR NOT",not:"NOT"}};function jo(t){let n="component.ambience.";if(!t.startsWith(n))return;let e=t.slice(n.length).split("."),i=sn;for(let r of e){if(i===null||typeof i!="object")return;i=i[r]}return typeof i=="string"?i:void 0}function te(t,n,e){let i=t?.localize?.(n);if(i&&i!==n)return i;let r=jo(n);return r!==void 0?r:e}function I(t){let n=t.replaceAll("_"," ").toLowerCase();return n.charAt(0).toUpperCase()+n.slice(1)}function Zi(t){return I(t)}function ri(t){let n=t.indexOf("."),e=n===-1?"":t.slice(0,n),r=(n===-1?t:t.slice(n+1)).replaceAll("_"," ").trim().toLowerCase(),s=e.replaceAll("_"," ").trim().toLowerCase(),o=r?r.split(" "):[],a=s?s.split(" "):[],u=a.length>0&&a.every(p=>o.includes(p)),h=!s||u?r:`${r} ${s}`;return h.charAt(0).toUpperCase()+h.slice(1)}function nt(t,n,e){let i=n?.find(r=>r.id===t);return i?.label?.trim()?i.label:e()}function zo(t){return t.replace(/_/g," ").replace(/\bid\b/g,"ID").replace(/\bip\b/g,"IP").replace(/\bmac\b/g,"MAC").replace(/\bgps\b/g,"GPS").replace(/^\w/,n=>n.toUpperCase())}function ni(t,n,e){let i=t?.formatEntityAttributeName;if(i&&n){let r=i(n,e);if(r)return r}return zo(e)}function st(t,n,e,i){if(!n)return i;let r=t;if(e){let s=r?.formatEntityAttributeValue;if(s){let o=s(n,e,i);if(o)return o}}else{let s=r?.formatEntityState;if(s){let o=s(n,i);if(o)return o}}return i}function X(t,n){return te(t,`component.ambience.condition.${n}`,Zi(n))}function si(t,n){return te(t,`component.ambience.action.${n}`,Zi(n))}function $e(t,n){return te(t,`component.ambience.anchor.${n}`,Zi(n))}function ke(t,n,e){let i=e[n]?.label;return i||te(t,`component.ambience.time_of_day_period.${n}`,I(n))}function ot(t,n,e){let i=e[n]?.label;return i||te(t,`component.ambience.lux_range.${n}`,I(n))}function d(t,n,e){return te(t,`component.ambience.${n}`,e)}var Wo=["mon","tue","wed","thu","fri","sat","sun"];function oi(t,n){let e=Wo[n];return te(t,`component.ambience.weekday.${e}`,e??String(n))}function ai(t,n){return te(t,`component.ambience.day_item.${n}`,I(n))}function at(t,n){return te(t,`component.ambience.month.${n}`,String(n))}function lt(t,n){return te(t,`component.ambience.weather_condition.${n}`,I(n))}function St(t,n){return te(t,`component.ambience.weather_attr.${n}`,I(n))}var Uo={temperature:"\xB0C",apparent_temperature:"\xB0C",humidity:"%",wind_speed:"m/s",pressure:"hPa"},Bo={temperature:"temperature",apparent_temperature:"temperature",wind_speed:"wind_speed",pressure:"pressure"},Vo={temperature:"temperature_unit",apparent_temperature:"temperature_unit",wind_speed:"wind_speed_unit",pressure:"pressure_unit"};function er(t,n,e){if(n==="humidity")return"%";let i=Vo[n];if(i){let o=e?.attributes?.[i];if(typeof o=="string"&&o)return o}let r=Bo[n],s=t?.config?.unit_system;return r&&s&&typeof s[r]=="string"?s[r]:Uo[n]??""}function J(t,n){return te(t,`component.ambience.state_op.${n}`,n)}var qo=import.meta.url.slice(0,import.meta.url.lastIndexOf("/")+1);function on(t){return qo+t}function an(t,n,e){let i=e.title??"Ambience",r=e.dark?`dark_${t}`:t,s=on(`${r}.png`),o=on(`${r}@2x.png`);return l`<img
    class=${n}
    src=${s}
    srcset="${s} 1x, ${o} 2x"
    alt=${i}
  />`}function ln(t={}){return an("logo","ambience-logo",t)}function dn(t={}){return an("icon","ambience-icon",t)}var cn="ambience-filter-category",un="ambience-expanded-scopes",hn="ambience-conditions-hint-dismissed";function li(){try{return window.localStorage.getItem(cn)??""}catch{return""}}function pn(t){try{window.localStorage.setItem(cn,t)}catch{}}function mn(){try{let t=window.localStorage.getItem(un);if(!t)return[];let n=JSON.parse(t);return Array.isArray(n)?n.filter(e=>typeof e=="string"):[]}catch{return[]}}function fn(t){try{window.localStorage.setItem(un,JSON.stringify(t))}catch{}}function gn(){try{return window.localStorage.getItem(hn)==="1"}catch{return!1}}function _n(){try{window.localStorage.setItem(hn,"1")}catch{}}async function vn(t){return t.callWS({type:"ambience/areas/list"})}async function tr(t,n){return t.callWS({type:"ambience/area/get",area_id:n})}async function yn(t,n,e){return t.callWS({type:"ambience/area/save",area_id:n,config:e})}async function bn(t){return t.callWS({type:"ambience/floors/list"})}async function ir(t,n){return t.callWS({type:"ambience/floor/get",floor_id:n})}async function wn(t,n,e){return t.callWS({type:"ambience/floor/save",floor_id:n,config:e})}async function rr(t){return t.callWS({type:"ambience/house/get"})}async function xn(t,n){return t.callWS({type:"ambience/house/save",config:n})}async function di(t){return t.callWS({type:"ambience/conditions/list"})}async function $n(t,n,e){let i={type:"ambience/auto_triggers/list",scope_kind:n};return e!=null&&(i.scope_id=e),t.callWS(i)}async function Ct(t){return t.callWS({type:"ambience/exposed_actions/list"})}async function kn(t,n){return t.callWS({type:"ambience/exposed_actions/save",actions:n})}async function En(t){return t.callWS({type:"ambience/services/list"})}async function Ee(t,n){return t.callWS({type:"ambience/services/get_schema",service:n})}function nr(t){return t.kind==="area"?{area_id:t.id}:t.kind==="floor"?{floor_id:t.id}:{house:!0}}async function Sn(t,n,e){let i={type:"ambience/apply",...nr(n)};return e!==void 0&&(i.category_id=e),t.callWS(i)}async function Cn(t,n,e){return t.callWS({type:"ambience/scene/run_actions",scene_index:e,...nr(n)})}async function ci(t){return t.callWS({type:"ambience/time_of_day_periods/list"})}async function Tn(t,n,e){return t.callWS({type:"ambience/time_of_day_periods/save",custom:n,hidden:e})}async function ui(t){return t.callWS({type:"ambience/lux_ranges/list"})}async function Ln(t,n,e){return t.callWS({type:"ambience/lux_ranges/save",custom:n,hidden:e})}async function Tt(t){return t.callWS({type:"ambience/conditions/day/config/list"})}async function Rn(t,n,e){return t.callWS({type:"ambience/conditions/day/config/save",workday_sensor:n,workday_calendar:e})}async function Lt(t){return t.callWS({type:"ambience/conditions/weather/config/list"})}async function Pn(t,n,e){return t.callWS({type:"ambience/conditions/weather/config/save",entity:n,groups:e})}async function sr(t,n){return t.callWS({type:"ambience/state/known_states",entity_id:n})}async function or(t,n,e){return t.callWS({type:"ambience/state/known_attribute_values",entity_id:n,attribute:e})}async function An(t){return t.callWS({type:"ambience/switch_defaults/list"})}async function Dn(t){return t.callWS({type:"ambience/switches/list"})}async function Hn(t,n,e){return t.callWS({type:"ambience/set_scope_enabled",...nr(n),enabled:e})}async function On(t,n,e,i){return t.callWS({type:"ambience/switch_defaults/save",name:n,auto_on_delay_seconds:e,create_switches:i})}async function Nn(t){return t.callWS({type:"ambience/reapply/list"})}async function In(t,n,e){return t.callWS({type:"ambience/reapply/save",enabled:n,interval_seconds:e})}async function Be(t){return(await t.callWS({type:"ambience/categories/list"})).categories}async function Fn(t,n){await t.callWS({type:"ambience/categories/save",categories:n})}async function Mn(t,n){await t.callWS({type:"ambience/categories/delete",category_id:n})}async function ar(t){return(await t.callWS({type:"ambience/traces/list"})).traces}async function jn(t){await t.callWS({type:"ambience/traces/clear"})}async function zn(t,n,e){let i=await t.callWS({type:"ambience/diagnostics/scope",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e}),r=`ambience-${n.scope_kind}-${n.scope_id??"house"}-${e}.json`,s=new Blob([JSON.stringify(i,null,2)],{type:"application/json"}),o=URL.createObjectURL(s),a=document.createElement("a");a.href=o,a.download=r,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(o),1e4)}async function Wn(t,n,e){return t.callWS({type:"ambience/simulate/inputs",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e})}async function Un(t,n,e,i,r,s){return(await t.callWS({type:"ambience/simulate",scope_kind:n.scope_kind,scope_id:n.scope_id,category:e,now:i,overrides:r,verdicts:s})).result}var lr=[{id:"red",label:"Red",hex:"#f44336"},{id:"pink",label:"Pink",hex:"#e91e63"},{id:"purple",label:"Purple",hex:"#9c27b0"},{id:"deep-purple",label:"Deep purple",hex:"#673ab7"},{id:"indigo",label:"Indigo",hex:"#3f51b5"},{id:"blue",label:"Blue",hex:"#2196f3"},{id:"light-blue",label:"Light blue",hex:"#03a9f4"},{id:"cyan",label:"Cyan",hex:"#00bcd4"},{id:"teal",label:"Teal",hex:"#009688"},{id:"green",label:"Green",hex:"#4caf50"},{id:"light-green",label:"Light green",hex:"#8bc34a"},{id:"lime",label:"Lime",hex:"#cddc39"},{id:"yellow",label:"Yellow",hex:"#ffeb3b"},{id:"amber",label:"Amber",hex:"#ffc107"},{id:"orange",label:"Orange",hex:"#ff9800"},{id:"deep-orange",label:"Deep orange",hex:"#ff5722"},{id:"brown",label:"Brown",hex:"#795548"},{id:"grey",label:"Grey",hex:"#9e9e9e"},{id:"blue-grey",label:"Blue grey",hex:"#607d8b"}];function dr(t){if(t)return lr.find(n=>n.id===t)?.hex}function Ko(t){let n=t.replace("#",""),e=parseInt(n.slice(0,2),16)/255,i=parseInt(n.slice(2,4),16)/255,r=parseInt(n.slice(4,6),16)/255,s=a=>a<=.03928?a/12.92:((a+.055)/1.055)**2.4;return .2126*s(e)+.7152*s(i)+.0722*s(r)>.5?"#000000":"#ffffff"}function hi(t){let n=dr(t);return n?`background:${n};color:${Ko(n)}`:""}var pi=y`
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
`;function dt(t,n){return l`<span class="category-swatch" style=${hi(t)}>
    ${n?l`<ha-icon icon=${n}></ha-icon>`:""}
  </span>`}var oe=class extends b{constructor(){super(...arguments);this._categories=[];this._sortedCategories=[];this._filterCategory=li();this._open=!1;this._loaded=!1;this._onCategoriesChanged=async()=>{try{await this._fetchCategories()}catch{}};this._onDocClick=e=>{this._open&&!e.composedPath().includes(this)&&(this._open=!1)}}async _fetchCategories(){let e=await Be(this.hass);this.isConnected&&(this._categories=e,this._filterCategory&&!e.some(i=>i.id===this._filterCategory)&&this._select(""))}async connectedCallback(){super.connectedCallback(),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("click",this._onDocClick);try{await this._fetchCategories()}catch{}finally{this.isConnected&&(this._loaded=!0)}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("click",this._onDocClick)}willUpdate(e){e.has("_categories")&&(this._sortedCategories=[...this._categories].sort((i,r)=>i.name.localeCompare(r.name)))}_select(e){this._filterCategory=e,pn(e),this._open=!1,this.dispatchEvent(new CustomEvent("ambience-filter-changed",{detail:{category:e},bubbles:!0,composed:!0}))}_openSettings(){this._open=!1,this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:"categories"},bubbles:!0,composed:!0}))}_renderEntry(e){return e===null?l`
        ${dt(void 0,"mdi:filter-variant")}
        <span class="category-name"
          >${d(this.hass,"ui.all_categories","All categories")}</span
        >
      `:l`
      ${dt(e.color,e.icon)}
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
    `}};oe.styles=[pi,y`
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
    `],c([m({attribute:!1})],oe.prototype,"hass",2),c([g()],oe.prototype,"_categories",2),c([g()],oe.prototype,"_filterCategory",2),c([g()],oe.prototype,"_open",2),c([g()],oe.prototype,"_loaded",2),oe=c([w("ambience-category-filter")],oe);var fe={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},mi=t=>(...n)=>({_$litDirective$:t,values:n}),ct=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,i){this._$Ct=n,this._$AM=e,this._$Ci=i}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var{I:Yo}=en,Bn=t=>t;var qn=t=>t.strings===void 0,Vn=()=>document.createComment(""),ut=(t,n,e)=>{let i=t._$AA.parentNode,r=n===void 0?t._$AB:n._$AA;if(e===void 0){let s=i.insertBefore(Vn(),r),o=i.insertBefore(Vn(),r);e=new Yo(s,o,t,t.options)}else{let s=e._$AB.nextSibling,o=e._$AM,a=o!==t;if(a){let u;e._$AQ?.(t),e._$AM=t,e._$AP!==void 0&&(u=t._$AU)!==o._$AU&&e._$AP(u)}if(s!==r||a){let u=e._$AA;for(;u!==s;){let h=Bn(u).nextSibling;Bn(i).insertBefore(u,r),u=h}}}return e},Se=(t,n,e=t)=>(t._$AI(n,e),t),Go={},fi=(t,n=Go)=>t._$AH=n,Kn=t=>t._$AH,gi=t=>{t._$AR(),t._$AA.remove()};var ht=mi(class extends ct{constructor(t){if(super(t),t.type!==fe.PROPERTY&&t.type!==fe.ATTRIBUTE&&t.type!==fe.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!qn(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[n]){if(n===q||n===k)return n;let e=t.element,i=t.name;if(t.type===fe.PROPERTY){if(n===e[i])return q}else if(t.type===fe.BOOLEAN_ATTRIBUTE){if(!!n===e.hasAttribute(i))return q}else if(t.type===fe.ATTRIBUTE&&e.getAttribute(i)===n+"")return q;return fi(t),n}});var Yn=(t,n,e)=>{let i=new Map;for(let r=n;r<=e;r++)i.set(t[r],r);return i},Gn=mi(class extends ct{constructor(t){if(super(t),t.type!==fe.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,n,e){let i;e===void 0?e=n:n!==void 0&&(i=n);let r=[],s=[],o=0;for(let a of t)r[o]=i?i(a,o):o,s[o]=e(a,o),o++;return{values:s,keys:r}}render(t,n,e){return this.dt(t,n,e).values}update(t,[n,e,i]){let r=Kn(t),{values:s,keys:o}=this.dt(n,e,i);if(!Array.isArray(r))return this.ut=o,s;let a=this.ut??=[],u=[],h,p,f=0,_=r.length-1,v=0,x=s.length-1;for(;f<=_&&v<=x;)if(r[f]===null)f++;else if(r[_]===null)_--;else if(a[f]===o[v])u[v]=Se(r[f],s[v]),f++,v++;else if(a[_]===o[x])u[x]=Se(r[_],s[x]),_--,x--;else if(a[f]===o[x])u[x]=Se(r[f],s[x]),ut(t,u[x+1],r[f]),f++,x--;else if(a[_]===o[v])u[v]=Se(r[_],s[v]),ut(t,r[f],r[_]),_--,v++;else if(h===void 0&&(h=Yn(o,v,x),p=Yn(a,f,_)),h.has(a[f]))if(h.has(a[_])){let E=p.get(o[v]),L=E!==void 0?r[E]:null;if(L===null){let V=ut(t,r[f]);Se(V,s[v]),u[v]=V}else u[v]=Se(L,s[v]),ut(t,r[f],L),r[E]=null;v++}else gi(r[_]),_--;else gi(r[f]),f++;for(;v<=x;){let E=ut(t,u[x+1]);Se(E,s[v]),u[v++]=E}for(;f<=_;){let E=r[f++];E!==null&&gi(E)}return this.ut=o,fi(t,u),q}});function O(t){return t.kind==="house"?"house":`${t.kind}:${t.id}`}function _i(t,n){return`${O(t)}\0${n}`}function Qn(t,n){if(!n||n.entity==null)return[...t];let e=Array.isArray(n.entity)?n.entity:[n.entity];if(e.length===0)return[...t];let i=new Set,r=!1;for(let s of e){if(!s||typeof s!="object")continue;let o=s.domain;if(o==null){r=!0;continue}if(Array.isArray(o))for(let a of o)typeof a=="string"&&i.add(a);else typeof o=="string"&&i.add(o)}return r||i.size===0?[...t]:t.filter(s=>{let o=s.indexOf(".");return o<0?!1:i.has(s.slice(0,o))})}function vi(t,n,e=[]){let i=t;if(!i?.entities)return[];let r=i.entities,s=i.devices??{},o=i.areas??{},a=n.kind==="area"?new Set([n.id]):n.kind==="floor"?new Set(Object.values(o).filter(h=>h.floor_id===n.id).map(h=>h.area_id)):null,u=h=>{let p=h.area_id??(h.device_id?s[h.device_id]?.area_id??null:null);return p==null?!1:a===null?!0:a.has(p)};return Object.values(r).filter(u).filter(h=>e.length===0||e.includes(h.entity_id.split(".")[0])).map(h=>h.entity_id).sort()}function Rt(t){let{priority:n,pinned:e,shadowed_by:i,...r}=t;return r}function Xn(t,n){if(n<0||n>=t.length)return[];let e=new Set(t[n].entity_ids??[]),i=new Set;return t.forEach((r,s)=>{if(s!==n)for(let o of r.entity_ids??[])e.has(o)||i.add(o)}),[...i]}var cr={house:"mdi:home",floor:"mdi:layers",area:"mdi:texture-box"};function Pt(t,n){return t.kind==="house"?cr.house:t.kind==="floor"?n?.floors?.[t.id]?.icon||cr.floor:n?.areas?.[t.id]?.icon||cr.area}function Ve(t){return t.enabled===!1?{scenes:t.scenes??[],enabled:!1}:{scenes:t.scenes??[]}}function F(){return(t,n)=>{let e=Symbol(String(n));Object.defineProperty(t,n,{get(){return this[e]},set(i){Object.is(this[e],i)||(this[e]=i,this._host?.requestUpdate())},configurable:!0,enumerable:!0})}}var A=class{constructor(n){this._host=n;this.areas=[];this.floors=[];this.areaConfigs=new Map;this.floorConfigs=new Map;this.house={scenes:[]};this.switchEntityIds=new Map;this.areasLoaded=!1;this.conditions=[];this.actions=[];this.categories=[];this.schemas={};this.staticLoaded=!1;this.error="";this._onExposedActionsChanged=async()=>{try{let n=await Ct(this._hass);if(!this._host.isConnected)return;this.actions=n,await this._refreshSchemas(n)}catch{}};this._onCategoriesChanged=async()=>{try{let n=await Be(this._hass);if(!this._host.isConnected)return;this.categories=n}catch{}};this._onConditionsChanged=async()=>{try{let[n,e]=await Promise.all([Tt(this._hass),Lt(this._hass)]);if(!this._host.isConnected)return;this.dayConfig=n,this.weatherConfig=e}catch{}};n.addController(this)}get _hass(){return this._host.hass}hostConnected(){window.addEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.addEventListener("ambience-categories-changed",this._onCategoriesChanged),window.addEventListener("ambience-conditions-changed",this._onConditionsChanged),this._tick=setInterval(()=>{for(let n of this.switchEntityIds.values())if(this._hass.states?.[n]?.state==="off"){this._host.requestUpdate();return}},1e3)}hostDisconnected(){window.removeEventListener("ambience-exposed-actions-changed",this._onExposedActionsChanged),window.removeEventListener("ambience-categories-changed",this._onCategoriesChanged),window.removeEventListener("ambience-conditions-changed",this._onConditionsChanged),this._tick&&clearInterval(this._tick),this._tick=void 0,this._unsubArea?.(),this._unsubArea=void 0,this._unsubFloor?.(),this._unsubFloor=void 0}async subscribe(n){let e=this._hass.connection.subscribeEvents(o=>{o.data.action==="remove"&&n({kind:"area",id:o.data.area_id}),this.refreshAreas(),o.data.action!=="update"&&this.refreshSwitches()},"area_registry_updated"),i=this._hass.connection.subscribeEvents(o=>{o.data.action==="remove"&&n({kind:"floor",id:o.data.floor_id}),this.refreshFloors(),o.data.action!=="update"&&this.refreshSwitches()},"floor_registry_updated"),[r,s]=await Promise.all([e,i]);this._host.isConnected?(this._unsubArea=r,this._unsubFloor=s):(r(),s())}async loadStatic(){try{let[n,e,i,r,s,o,a]=await Promise.all([di(this._hass),Ct(this._hass),ci(this._hass),ui(this._hass),Tt(this._hass),Lt(this._hass),Be(this._hass)]);if(!this._host.isConnected)return;this.conditions=n,this.actions=e,this.periods=i,this.luxRanges=r,this.dayConfig=s,this.weatherConfig=o,this.categories=a,this.staticLoaded=!0,await this._refreshSchemas(e)}catch(n){this.error=n.message||String(n)}}async _refreshSchemas(n){let e=await Promise.all(n.map(async r=>{try{let s=await Ee(this._hass,r.id);return[r.id,s]}catch{return[r.id,null]}}));if(!this._host.isConnected)return;let i={};for(let[r,s]of e)s&&(i[r]=s);this.schemas=i}async refreshAreas(){try{let n=await vn(this._hass),e=this.areaConfigs,i=new Map;if(await Promise.all(n.map(async r=>{let s=e.get(r.area_id);if(s){i.set(r.area_id,s);return}i.set(r.area_id,Ve(await tr(this._hass,r.area_id)))})),!this._host.isConnected)return;this.areas=n,this.areaConfigs=i}catch(n){this.error=n.message||String(n)}finally{this._host.isConnected&&(this.areasLoaded=!0)}}async refreshFloors(){try{let n=(await bn(this._hass)).slice().sort((r,s)=>r.name.localeCompare(s.name)),e=this.floorConfigs,i=new Map;if(await Promise.all(n.map(async r=>{let s=e.get(r.floor_id);if(s){i.set(r.floor_id,s);return}i.set(r.floor_id,Ve(await ir(this._hass,r.floor_id)))})),!this._host.isConnected)return;this.floors=n,this.floorConfigs=i}catch(n){this.error=n.message||String(n)}}async refreshHouse(){try{let n=Ve(await rr(this._hass));if(!this._host.isConnected)return;this.house=n}catch(n){this.error=n.message||String(n)}}async refreshSwitches(){try{let n=await Dn(this._hass);if(!this._host.isConnected)return;this.switchEntityIds=new Map(n.map(e=>{let i=e.scope_kind==="house"?{kind:"house"}:{kind:e.scope_kind,id:e.scope_id};return[O(i),e.entity_id]}))}catch(n){this.error=n.message||String(n)}}getConfig(n){return n.kind==="house"?this.house:n.kind==="area"?this.areaConfigs.get(n.id):this.floorConfigs.get(n.id)}setConfig(n,e){if(n.kind==="house")this.house=e;else if(n.kind==="area"){let i=new Map(this.areaConfigs);i.set(n.id,e),this.areaConfigs=i}else{let i=new Map(this.floorConfigs);i.set(n.id,e),this.floorConfigs=i}}async mutate(n,e){let i=this.getConfig(n);this.setConfig(n,e),this.error="";try{let r;return n.kind==="house"?r=await xn(this._hass,e):n.kind==="area"?r=await yn(this._hass,n.id,e):r=await wn(this._hass,n.id,e),this.setConfig(n,Ve(r.config)),!0}catch(r){return i&&this.setConfig(n,i),this.error=r.message||String(r),!1}}async reloadScope(n){try{let e;if(n.kind==="house"?e=Ve(await rr(this._hass)):n.kind==="area"?e=Ve(await tr(this._hass,n.id)):e=Ve(await ir(this._hass,n.id)),!this._host.isConnected)return;this.setConfig(n,e)}catch(e){this.error=e.message||String(e)}}};c([F()],A.prototype,"areas",2),c([F()],A.prototype,"floors",2),c([F()],A.prototype,"areaConfigs",2),c([F()],A.prototype,"floorConfigs",2),c([F()],A.prototype,"house",2),c([F()],A.prototype,"switchEntityIds",2),c([F()],A.prototype,"areasLoaded",2),c([F()],A.prototype,"conditions",2),c([F()],A.prototype,"actions",2),c([F()],A.prototype,"categories",2),c([F()],A.prototype,"schemas",2),c([F()],A.prototype,"periods",2),c([F()],A.prototype,"luxRanges",2),c([F()],A.prototype,"dayConfig",2),c([F()],A.prototype,"weatherConfig",2),c([F()],A.prototype,"staticLoaded",2),c([F()],A.prototype,"error",2);var ge=class extends b{constructor(){super(...arguments);this.items=[];this._open=!1;this._onKeydown=e=>{e.key==="Escape"&&this._open&&(this._open=!1)}}_triggerLabel(){return this.label??d(this.hass,"ui.more_actions","More actions")}_select(e,i){i.stopPropagation(),this._open=!1,this.dispatchEvent(new CustomEvent("menu-action",{detail:{id:e},bubbles:!0,composed:!0}))}_renderItems(){return this.items.map(e=>l`
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
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this._onKeydown)}disconnectedCallback(){this.removeEventListener("keydown",this._onKeydown),super.disconnectedCallback()}render(){return this._renderMenu()}};ge.styles=y`
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
  `,c([m({attribute:!1})],ge.prototype,"items",2),c([m({attribute:!1})],ge.prototype,"hass",2),c([m()],ge.prototype,"label",2),c([g()],ge.prototype,"_open",2),ge=c([w("ambience-kebab-menu")],ge);function Qo(t){return t.style.pointerEvents="none",t.style.willChange="transform",()=>{t.style.pointerEvents="",t.style.willChange="",t.style.transform=""}}function yi(t,n,e={}){let i=t.pointerId;try{t.target?.setPointerCapture?.(i)}catch{}let r=e.follow??null,s=t.clientX,o=t.clientY,a=r?Qo(r):null,u=_=>{_.pointerId===i&&(n.onMove(_.clientX,_.clientY),r&&(r.style.transform=`translate(${_.clientX-s}px, ${_.clientY-o}px)`))},h=_=>{_.pointerId===i&&(f(),n.onEnd(_.clientX,_.clientY))},p=_=>{_.pointerId===i&&(f(),n.onCancel())},f=()=>{window.removeEventListener("pointermove",u,!0),window.removeEventListener("pointerup",h,!0),window.removeEventListener("pointercancel",p,!0),a?.()};return window.addEventListener("pointermove",u,!0),window.addEventListener("pointerup",h,!0),window.addEventListener("pointercancel",p,!0),f}function bi(t,n){let e=document.elementFromPoint?.(t,n)??null;if(!e)return null;for(;e.shadowRoot;){let i=e.shadowRoot.elementFromPoint?.(t,n);if(!i||i===e)break;e=i}return e}var pt=class{constructor(n,e,i={}){this.host=n;this.onReorder=e;this.from=null;this.over=null;this.moved=!1;this._cancelDrag=null;this._locate=i.locate??((r,s)=>this._domLocate(r,s)),n.addController(this)}hostDisconnected(){this._reset()}start(n,e){if(!e.isPrimary||e.button>0)return;this._reset(),this.from=n,this.moved=!1,this.host.requestUpdate();let i=e.target?.closest("[data-drag-index]");this._cancelDrag=yi(e,{onMove:(r,s)=>this._hover(this._locate(r,s)),onEnd:(r,s)=>this.drop(this._locate(r,s)),onCancel:()=>this.end()},{follow:i})}_hover(n){if(this.from===null)return;let e=n===null||n===this.from?null:n;e!==null&&(this.moved=!0),this.over!==e&&(this.over=e,this.host.requestUpdate())}drop(n){let e=this.from;this._reset(),!(e===null||n===null||e===n)&&this.onReorder(e,n)}end(){this._reset()}_domLocate(n,e){let i=this.host.renderRoot,s=(i?.elementFromPoint?i.elementFromPoint(n,e):bi(n,e))?.closest?.("[data-drag-index]");if(!s)return null;let o=Number(s.getAttribute("data-drag-index"));return Number.isNaN(o)?null:o}_reset(){this._cancelDrag?.(),this._cancelDrag=null;let n=this.from!==null||this.over!==null;this.from=null,this.over=null,n&&this.host.requestUpdate()}};var Xo={light:"mdi:lightbulb",switch:"mdi:toggle-switch-variant",binary_sensor:"mdi:motion-sensor",sensor:"mdi:eye",person:"mdi:account",device_tracker:"mdi:account",climate:"mdi:thermostat",cover:"mdi:window-shutter",media_player:"mdi:cast",lock:"mdi:lock",fan:"mdi:fan",weather:"mdi:weather-partly-cloudy",input_boolean:"mdi:toggle-switch",event:"mdi:eye-check",script:"mdi:script-text",template:"mdi:code-braces"},ur="mdi:eye";function j(t,n){let e=t?.states?.[n]?.attributes?.friendly_name;return typeof e=="string"&&e?e:n}function Jo(t,n){let e=t?.states?.[n]?.attributes?.icon;if(typeof e=="string"&&e)return e;let i=n.split(".")[0];return Xo[i]??ur}function At(t,n){let e=t?.states?.[n];return e&&customElements.get("ha-state-icon")?l`<ha-state-icon class="row-icon" .hass=${t} .stateObj=${e}></ha-state-icon>`:l`<ha-icon class="row-icon" icon=${Jo(t,n)}></ha-icon>`}var Jn=y`
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
`;function Ht(t,n,e){if(n&&e){let i=e[n]?.fields?.[t];if(i&&typeof i=="object"){let r=i.name;if(typeof r=="string"&&r)return r}}return I(t)}function $i(t,n="New scene"){return t.name?.trim()?t.name:n}function Ot(t,n,e){return n==null?d(e.hass,"ui.summary_any_paren","(any)"):t==="time_of_day"?Si(n,e):t==="day"?ia(n,e):t==="weather"?aa(n,e):t==="sun"?la(n,e):t==="state"?fr(n,e):t==="script"?ea(n,e):t==="people"?ta(n,e):t==="occupancy"?da(n,e):t==="lux"?ca(n,e):t==="template"?Zo(n,e):String(n)}function Zo(t,n={}){return t===null?d(n.hass,"ui.summary_any_paren","(any)"):typeof t!="object"||typeof t.template!="string"?String(t):t.template}function ea(t,n={}){if(t===null)return d(n.hass,"ui.summary_any_paren","(any)");if(typeof t!="object"||typeof t.script!="string")return String(t);let e=Dt(n,t.script),i=t.args??{},r=Object.keys(i).sort();if(r.length===0)return e;let s=r.map(o=>`${pr(n.hass,t.script,o)}: ${Ce(n.hass,i[o])}`).join(", ");return`${e} (${s})`}function pr(t,n,e){let i=n.replace(/^script\./,""),s=t?.services?.script?.[i]?.fields?.[e]?.name;return typeof s=="string"&&s?s:I(e)}function Dt(t,n){let i=t.hass?.states?.[n]?.attributes?.friendly_name;if(typeof i=="string"&&i)return i;let r=n.indexOf("."),s=r>=0?n.slice(r+1):n;return s.charAt(0).toUpperCase()+s.slice(1)}function Zn(t,n){return t==="home"?d(n.hass,"people_summary.home","Home"):Dt(n,t)}function ta(t,n={}){if(t==null)return d(n.hass,"ui.summary_any","any");let e=t.where??"home";if(Array.isArray(t.who)&&t.who.length===1){let o=Dt(n,t.who[0]),u=t.quant==="nobody"!=!!t.negate?d(n.hass,"people_summary.is_not_at","is not at"):d(n.hass,"people_summary.is_at","is at"),h=`${o} ${u} ${Zn(e,n)}`;return t.for&&wi(t.for)?`${h} ${d(n.hass,"ui.for_prefix","for")} \u2265${xi(t.for)}`:h}let i;if(Array.isArray(t.who)){let o=t.quant??"any",a=o==="any"?d(n.hass,"ui.people_mode_any","Any of:"):o==="everyone"?d(n.hass,"ui.people_mode_all","All of:"):d(n.hass,"ui.people_mode_none","None of:"),u=t.who.map(h=>Dt(n,h)).join(", ");i=`${a} (${u})`}else{let o=t.quant??"everyone";i=o==="nobody"?d(n.hass,"ui.people_mode_nobody","Nobody"):o==="any"?d(n.hass,"ui.people_mode_anybody","Anybody"):d(n.hass,"ui.people_mode_everybody","Everybody")}let r=t.negate?d(n.hass,"people_summary.is_not_at","is not at"):d(n.hass,"people_summary.is_at","is at"),s=`${i} ${r} ${Zn(e,n)}`;return t.for&&wi(t.for)?`${s} ${d(n.hass,"ui.for_prefix","for")} \u2265${xi(t.for)}`:s}function ia(t,n={}){if(t===null)return d(n.hass,"day_summary.any","any");let e=t.include??[],i=t.exclude??[],r=e.length===0?d(n.hass,"day_summary.any_day","any day"):e.map(o=>es(o,n)).join(", ");if(i.length===0)return r;let s=d(n.hass,"day_summary.except","except");return`${r} (${s} ${i.map(o=>es(o,n)).join(", ")})`}function es(t,n){switch(t.kind){case"weekday":return t.days.map(e=>oi(n.hass,e)).join("/");case"day_of_month":return`${d(n.hass,"day_summary.day_prefix","Day")} ${t.days}`;case"date":return`${at(n.hass,t.month)} ${t.day}`;case"date_range":return`${at(n.hass,t.from.month)} ${t.from.day} \u2192 ${at(n.hass,t.to.month)} ${t.to.day}`;case"last_day":return d(n.hass,"day_summary.last_day","Last day");case"workday":return d(n.hass,"day_summary.workday","Workday");case"holiday":return d(n.hass,"day_summary.holiday","Holiday");case"first_workday":return d(n.hass,"day_summary.first_workday","First workday");case"last_workday":return d(n.hass,"day_summary.last_workday","Last workday")}}function ra(t){return typeof t=="string"?t:typeof t=="number"||typeof t=="boolean"?String(t):JSON.stringify(t)}var na=["entity_id","device_id","area_id","label_id","floor_id"],ts=2;function sa(t){if(!t||typeof t!="object"||Array.isArray(t))return null;let n=t;if(!Object.keys(n).every(r=>na.includes(r)))return null;let e=n.entity_id,i=typeof e=="string"?[e]:Array.isArray(e)?e.filter(r=>typeof r=="string"):[];return i.length?i:null}function Ce(t,n){let e=sa(n);if(!e)return ra(n);let i=e.slice(0,ts).map(o=>Dt({hass:t},o)),r=e.length-ts;return`[${r>0?`${i.join(", ")} +${r} more`:i.join(", ")}]`}function ki(t){if(!(!t||typeof t!="object")){for(let n of Object.values(t))if(n&&typeof n=="object"){let e=n.unit_of_measurement;if(typeof e=="string"&&e)return e}}}function oa(t){return t.split(/[\s_-]+/).filter(n=>n!=="").map(n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()).join(" ")}function aa(t,n={}){if(t===null)return d(n.hass,"ui.summary_any","any");let e=new Map((n.weatherGroups??[]).map(o=>[o.id,o.label])),i=(t.groups??[]).map(o=>e.get(o)??oa(o)).join("/"),r=(t.thresholds??[]).map(o=>`${St(n.hass,o.attribute)} ${J(n.hass,o.op)} ${o.value}`).join(", "),s=[i,r].filter(o=>o!=="");return s.length===0?d(n.hass,"ui.summary_any","any"):s.join(", ")}function la(t,n={}){if(t===null)return d(n.hass,"ui.summary_any","any");let e=[],i=t.elevation;i&&(i.min!=null&&i.max!=null?e.push(`${i.min}\xB0\u2013${i.max}\xB0`):i.min!=null?e.push(`\u2265${i.min}\xB0`):i.max!=null&&e.push(`\u2264${i.max}\xB0`));let r=t.azimuth;if(r){r.sectors?.length&&e.push(r.sectors.join("/"));for(let s of r.ranges??[])e.push(`${s.from}\xB0\u2013${s.to}\xB0`)}return e.length===0?d(n.hass,"ui.summary_any","any"):e.join(", ")}function ss(t,n){return j(t.hass,n)}function Ei(t,n){return ss({hass:t},n)}function da(t,n={}){if(t==null||!t.sensors?.length)return d(n.hass,"ui.summary_any","any");let e=t.sensors.map(o=>j(n.hass,o)),i=t.occupied===!1?d(n.hass,"occupancy_summary.clear","clear"):d(n.hass,"occupancy_summary.detected","detected"),r=t.negate?`${d(n.hass,"occupancy_summary.not","not")} `:"",s;return e.length===1?s=`${e[0]} is ${r}${i}`:s=`${t.quant==="all"?d(n.hass,"occupancy_summary.all_of","all of"):d(n.hass,"occupancy_summary.any_of","any of")} (${e.join(", ")}) ${r}${i}`,t.for&&wi(t.for)?`${s} ${d(n.hass,"ui.for_prefix","for")} \u2265${xi(t.for)}`:s}function mr(t,n,e="any lux"){return t!=null&&n!=null?`${t}\u2013${n} lx`:n!=null?`<${n} lx`:t!=null?`\u2265${t} lx`:e}function ca(t,n={}){if(t==null||!t.sensors?.length)return d(n.hass,"ui.summary_any","any");let e=t.sensors.map(s=>j(n.hass,s)),i=t.range!=null?ot(n.hass,t.range,n.luxRanges?.custom??{}):mr(t.min,t.max);return e.length===1?`${e[0]} ${i}`:`${t.quant==="all"?d(n.hass,"lux_summary.all_of","all of"):d(n.hass,"lux_summary.any_of","any of")} (${e.join(", ")}) ${i}`}function fr(t,n={}){return t==null?d(n.hass,"ui.summary_any","any"):hr(t,n)}function is(t,n,e){let i=J(n.hass,t.kind),r=ss(n,t.entity_id),s=n.hass?.states?.[t.entity_id],a=t.kind!=="is"&&t.kind!=="is_not"?t.states[0]??"":t.states.map(f=>st(n.hass,s,t.attribute,f)).join("/"),u=t.attribute?`${r}.${ni(n.hass,s,t.attribute)}`:r,h=e?`${J(n.hass,"not")} `:"",p=`${u} ${i} ${h}${a}`;return t.for&&wi(t.for)?`${p} ${d(n.hass,"ui.for_prefix","for")} \u2265${xi(t.for)}`:p}function hr(t,n){if(t.kind==="is"||t.kind==="is_not"||t.kind===">"||t.kind===">="||t.kind==="<"||t.kind==="<=")return is(t,n,!1);if(t.kind==="and"||t.kind==="or"){let e=` ${J(n.hass,t.kind)} `;return t.items.map(i=>rs(i,n)).join(e)}if(t.kind==="not"){let e=t.item;return e.kind==="is"?is(e,n,!0):`${J(n.hass,"not")} ${rs(e,n)}`}return""}function rs(t,n){return t.kind==="and"||t.kind==="or"?`(${hr(t,n)})`:hr(t,n)}function wi(t){return t.h>0||t.m>0||t.s>0}function xi(t){let n=[];return t.h&&n.push(`${t.h}h`),t.m&&n.push(`${t.m}m`),t.s&&n.push(`${t.s}s`),n.length?n.join(" "):"0s"}function Si(t,n){if(t===null)return d(n.hass,"ui.summary_any","any");let e=Array.isArray(t)?t:[t],i=n.periods?.custom??{};return e.map(r=>"period"in r?ke(n.hass,r.period,i):`${ns(r.from,n)} \u2192 ${ns(r.to,n)}`).join(", ")}function ns(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=$e(n.hass,t.anchor),i=e;if(t.offset_min!==0){let r=Math.abs(t.offset_min),s=r%60===0?`${r/60}${d(n.hass,"ui.unit_hour_abbr","h")}`:`${r}${d(n.hass,"ui.unit_min_abbr","m")}`;i=`${e}${t.offset_min<0?"-":"+"}${s}`}if(t.clamp){let r=t.clamp.dir==="not_before"?d(n.hass,"ui.clamp_not_before","not before"):d(n.hass,"ui.clamp_not_after","not after"),s=`${String(t.clamp.hh).padStart(2,"0")}:${String(t.clamp.mm).padStart(2,"0")}`;i=`${i} (${r} ${s})`}return i}function ua(t,n){return nt(t.service,n.exposedActions,()=>si(n.hass,t.service))}function ha(t,n){let e=new Set;for(let i of t.entity_ids){let r=i.indexOf(".");r>0&&e.add(i.slice(0,r))}return e.size===1?[...e][0]:d(n.hass,"ui.target_noun","target")}function os(t,n){let e=ua(t,n),i=ha(t,n),r=t.entity_ids.length,s;r===0?s=d(n.hass,"ui.no_targets","(no targets)"):r===1?s=`1 ${i}`:s=`${r} ${i}s`;let o=Object.entries(t.params).filter(([,a])=>a!=null&&a!=="").map(([a,u])=>`${Ht(a,t.service,n.schemas)}: ${Ce(n.hass,u)}`).join(", ");return o?`${e}: ${s}, ${o}`:`${e}: ${s}`}var z=class extends b{constructor(){super(...arguments);this.scenes=[];this.availableActions=[];this.schemas={};this.categories=[];this.filterCategory="";this._drag=new pt(this,(e,i)=>this._emit("reorder-scenes",{from:e,to:i}));this._expanded=new Set}willUpdate(e){e.has("scenes")&&(this._expanded=new Set)}_renderSectionHeader(e){return l`<div
      class="category-section-header"
      style=${hi(e.color)}
    >
      ${e.icon?l`<ha-icon icon=${e.icon}></ha-icon>`:""}
      <span>${e.name}</span>
      <ambience-kebab-menu
        class="category-kebab"
        .hass=${this.hass}
        .items=${[{id:"run",label:d(this.hass,"ui.run","Run"),icon:"mdi:play"},{id:"traces",label:d(this.hass,"ui.view_traces","View traces"),icon:"mdi:transit-connection-variant"},{id:"simulate",label:d(this.hass,"ui.simulate","Simulate"),icon:"mdi:flask-outline"}]}
        @menu-action=${i=>this._onCategoryMenu(e,i.detail.id)}
      ></ambience-kebab-menu>
    </div>`}_sections(){let e=this.scenes.map((r,s)=>[s,r]);if(this.filterCategory!=="")return[{category:this.categories.find(r=>r.id===this.filterCategory),rows:e.filter(([,r])=>r.category===this.filterCategory)}];let i=new Map;for(let[r,s]of e){let o=i.get(s.category)??[];o.push([r,s]),i.set(s.category,o)}return[...i.entries()].map(([r,s])=>({category:this.categories.find(o=>o.id===r),rows:s})).sort((r,s)=>(r.category?.name??"").localeCompare(s.category?.name??""))}_emit(e,i){this.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}_priorityMap(){let e=this.conditions;return(!this._priorityOfCache||this._priorityOfCache.src!==e)&&(this._priorityOfCache={src:e,map:new Map((e??[]).map(i=>[i.name,i.priority]))}),this._priorityOfCache.map}_whenKeys(e){let i=this._priorityMap();return Object.keys(e.when).filter(r=>e.when[r]!=null).sort((r,s)=>(i.get(s)??-1/0)-(i.get(r)??-1/0))}_whenSummary(e){let i=this._whenKeys(e);return i.length===0?d(this.hass,"ui.summary_any","any"):i.map((r,s)=>{let o=X(this.hass,r),a=Ot(r,e.when[r],{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups});return l`${s===0?"":", "}<strong>${o}:</strong> ${a}`})}_whenStacked(e){let i=this._whenKeys(e);return i.length===0?l`<div class="condition-line">
        ${d(this.hass,"ui.summary_any","any")}
      </div>`:i.map(r=>{let s=X(this.hass,r),o=Ot(r,e.when[r],{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges,weatherGroups:this.weatherConfig?.groups});return l`<div class="condition-line">
        <strong>${s}:</strong> ${o}
      </div>`})}_actionCountLabel(e){let i=e.actions.length,r=i===1?d(this.hass,"ui.action_singular","action"):d(this.hass,"ui.action_plural","actions"),s=`${i} ${r}`;return i===0?`${d(this.hass,"ui.noop_prefix","NOOP")} - ${s}`:s}_toggleScene(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}_entityName(e){return j(this.hass,e)}_actionParamsString(e){return Object.entries(e.params).filter(([,i])=>i!=null&&i!=="").map(([i,r])=>`${Ht(i,e.service,this.schemas)}: ${Ce(this.hass,r)}`).join(", ")}_actionLabel(e){return nt(e.service,this.availableActions,()=>si(this.hass,e.service))}_onCategoryMenu(e,i){i==="run"?this._emit("apply-category",{categoryId:e.id}):i==="traces"?this._emit("show-traces",{category:e.id}):i==="simulate"&&this._emit("show-simulator",{category:e.id})}_onSceneMenu(e,i){i==="edit"?this._emit("edit-scene",{index:e}):i==="duplicate"?this._emit("duplicate-scene",{index:e}):i==="run"?this._emit("run-scene-actions",{index:e}):i==="delete"&&this._emit("delete-scene",{index:e})}_renderRow(e,i,r){let s=d(this.hass,"ui.unpin","Unpin (return to automatic order)"),o=i.enabled===!1,a=o?d(this.hass,"ui.enable_scene","Enable scene"):d(this.hass,"ui.disable_scene","Disable scene");return l`
      <li
        data-drag-index=${e}
        class="${this._drag.over===e?"drag-over ":""}${this._drag.from===e?"dragging ":""}${o?"disabled":""}"
      >
        <span class="lead">
          ${i.pinned?l`<button
                class="pin"
                title=${s}
                aria-label=${s}
                @pointerdown=${u=>this._drag.start(e,u)}
                @click=${u=>{if(u.stopPropagation(),this._drag.moved){this._drag.moved=!1;return}this._emit("unpin-scene",{index:e})}}
              >
                📌
              </button>`:l`<span
                class="handle"
                title=${d(this.hass,"ui.drag_to_reorder","Drag to reorder")}
                @pointerdown=${u=>this._drag.start(e,u)}
                >⠿</span
              >`}
        </span>
        <span class="idx">${r}</span>
        <span class="warn-slot">
          ${i.shadowed_by!=null&&!o?l`<span
                class="shadow-warning"
                title=${d(this.hass,"ui.shadowed","Never fires \u2014 shadowed by an earlier scene.")}
                >⚠️</span
              >`:""}
        </span>
        <div class="body" @click=${()=>this._toggleScene(e)}>
          <div class="name">
            ${$i(i,d(this.hass,"ui.scene_n","Scene {n}").replace("{n}",String(r)))}
          </div>
          <div class="summary">
            ${this._expanded.has(e)?"":l`${this._whenSummary(i)} ·
                  <span class="action-count"
                    >${this._actionCountLabel(i)}</span
                  >`}
          </div>
          ${this._expanded.has(e)?l`
                <div class="scene-detail">
                  ${this._whenStacked(i)}
                  ${i.actions.length===0?l`<div class="noop-detail">
                        ${this._actionCountLabel(i)}
                      </div>`:l`<div class="actions-detail">
                        ${i.actions.map(u=>{let h=this._actionParamsString(u),p=this._actionLabel(u),f=h?`${p} \xB7 ${h}`:p;return l`
                            <div class="actions-detail-item">
                              <div class="action-header">${f}</div>
                              ${u.entity_ids.length===0?l`<div class="no-targets">
                                    ${d(this.hass,"ui.no_targets","(no targets)")}
                                  </div>`:l`<ul class="entity-list">
                                    ${u.entity_ids.map(_=>l`<li>${this._entityName(_)}</li>`)}
                                  </ul>`}
                            </div>
                          `})}
                      </div>`}
                </div>
              `:""}
        </div>
        <button
          class="toggle"
          @click=${u=>{u.stopPropagation(),this._emit("toggle-scene-enabled",{index:e,enabled:o})}}
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
          @menu-action=${u=>this._onSceneMenu(e,u.detail.id)}
        ></ambience-kebab-menu>
      </li>
    `}render(){let e=this._sections().filter(r=>r.rows.length>0);if(e.length===0){let r=this.filterCategory?{category:this.filterCategory}:{};return l`
        <p class="empty">
          ${d(this.hass,"ui.no_scenes_yet","No scenes yet.")}
        </p>
        <button class="add" @click=${()=>this._emit("add-scene",r)}>
          ${d(this.hass,"ui.add_scene","+ Add scene")}
        </button>
      `}let i=this.categories.length>0;return l`
      ${e.map(r=>l`
          <div class="category-section">
            ${i&&r.category?this._renderSectionHeader(r.category):""}
            <ul>
              ${r.rows.map(([s,o],a)=>this._renderRow(s,o,a+1))}
            </ul>
            <button
              class="add"
              @click=${()=>this._emit("add-scene",{category:r.category?.id})}
            >
              ${d(this.hass,"ui.add_scene","+ Add scene")}
            </button>
          </div>
        `)}
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
  `,c([m({attribute:!1})],z.prototype,"scenes",2),c([m({attribute:!1})],z.prototype,"periods",2),c([m({attribute:!1})],z.prototype,"luxRanges",2),c([m({attribute:!1})],z.prototype,"weatherConfig",2),c([m({attribute:!1})],z.prototype,"hass",2),c([m({attribute:!1})],z.prototype,"conditions",2),c([m({attribute:!1})],z.prototype,"availableActions",2),c([m({attribute:!1})],z.prototype,"schemas",2),c([m({attribute:!1})],z.prototype,"categories",2),c([m({attribute:!1})],z.prototype,"filterCategory",2),c([g()],z.prototype,"_expanded",2),z=c([w("ambience-scenes-list")],z);function T(t,n){t.dispatchEvent(new CustomEvent("value-changed",{detail:{value:n},bubbles:!0,composed:!0}))}var ae=class extends b{constructor(){super(...arguments);this.entities=[];this.value=[];this.target=null;this.label=" "}_filteredEntities(){return Qn(this.entities,this.target)}connectedCallback(){super.connectedCallback(),ee(this)}_emit(e){T(this,e)}_onHaFormChange(e){e.stopPropagation(),this._emit(e.detail.value.entity_ids??[])}_renderHaForm(){let i=[{name:"entity_ids",selector:{entity:{multiple:!0,include_entities:this._filteredEntities()}}}],r=this.label;return l`
      <ha-form
        .hass=${this.hass}
        .schema=${i}
        .data=${{entity_ids:this.value}}
        .computeLabel=${()=>r}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `}_toggle(e,i){let r=new Set(this.value);i?r.add(e):r.delete(e),this._emit(this._filteredEntities().filter(s=>r.has(s)))}_renderFallback(){let e=this._filteredEntities();return e.length===0?l`<p class="empty">${d(this.hass,"ui.no_matching_entities","No matching entities in this area.")}</p>`:l`
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
    `}render(){return customElements.get("ha-form")?this._renderHaForm():this._renderFallback()}};ae.styles=y`
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
  `,c([m({attribute:!1})],ae.prototype,"hass",2),c([m({attribute:!1})],ae.prototype,"entities",2),c([m({attribute:!1})],ae.prototype,"value",2),c([m({attribute:!1})],ae.prototype,"target",2),c([m()],ae.prototype,"label",2),ae=c([w("ambience-target-picker")],ae);var W=class extends b{constructor(){super(...arguments);this.entityIds=[];this.params={};this.excludeEntities=[];this._schema=void 0;this._schemaError=null;this._exposedMissing=!1;this._formSchema=[];this._perFieldSchemas={};this._schemaServiceId=null;this._onTargetChanged=e=>{e.stopPropagation(),this._emit("entity-ids-changed",{entityIds:e.detail.value})};this._onFieldInput=e=>i=>{i.stopPropagation();let r=i.target,s={...this.params,[e]:r.value};this._emit("params-changed",{params:s})};this._onHaFormChanged=e=>{e.stopPropagation(),this._emit("params-changed",{params:{...this.params,...e.detail.value}})}}connectedCallback(){super.connectedCallback(),ee(this)}willUpdate(e){if((e.has("exposed")&&e.get("exposed")?.id!==this.exposed?.id||e.has("hass")&&this._schema===void 0&&this._schemaServiceId!==this.exposed?.id)&&this._loadSchema(),(e.has("exposed")||e.has("_schema"))&&(this._formSchema=this._buildFormSchema()),e.has("_formSchema")||e.has("_schema")||e.has("exposed")){let i={};for(let r of this._formSchema)i[r.name]=[r];this._perFieldSchemas=i}}async _loadSchema(){if(this.exposed===void 0&&this.hass){this._exposedMissing=!0,this._schema=null,this._schemaServiceId=null;return}let e=this.exposed?.id;if(!e||!this.hass){this._exposedMissing=!1,this._schema=void 0,this._schemaServiceId=null;return}this._exposedMissing=!1,this._schemaServiceId=e,this._schemaError=null,this._schema=void 0;try{let i=await Ee(this.hass,e);if(this._schemaServiceId!==e)return;this._schema=i}catch(i){if(this._schemaServiceId!==e)return;this._schema=null,this._schemaError=i instanceof Error?i.message:String(i)}}_buildFormSchema(){let e=this._schema,i=this.exposed;if(!e||!i)return[];let r=new Set(i.visible_fields??[]),s=[];for(let[o,a]of Object.entries(e.fields))r.has(o)&&s.push({name:o,selector:a.selector??{text:{}},required:!!a.required,description:typeof a.description=="string"&&a.description?a.description:void 0});return s}updated(e){super.updated?.(e),e.has("_schema")&&this.dispatchEvent(new CustomEvent("target-mode-changed",{detail:{hasTarget:this.hasTarget()},bubbles:!0,composed:!0}))}_hasTarget(){let e=this._schema?.target??null;return!e||typeof e!="object"?!1:Object.keys(e).length>0}hasTarget(){return this._schema===void 0?!1:this._hasTarget()}_scopeEntities(){return!this.scope||!this.hass?[]:vi(this.hass,this.scope,[])}_renderTargetPicker(){if(!this._hasTarget())return"";let e=new Set(this.excludeEntities),i=this._scopeEntities().filter(o=>!e.has(o)),r=this._schema?.target??null,s=d(this.hass,"ui.target","Target");return l`
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
    `}_humanizeFieldLabel(e){let i=this._schema?.fields[e];return i?.name?i.name:I(e)}_clearField(e){if(!(e in this.params))return;let i={...this.params};delete i[e],this._emit("params-changed",{params:i})}_extraParamKeys(){let e=new Set;for(let i of this._formSchema)e.add(i.name);for(let i of Object.keys(this.exposed?.defaults??{}))e.add(i);return Object.keys(this.params).filter(i=>!e.has(i))}_clearExtraParams(){let e=new Set(this._extraParamKeys());if(e.size===0)return;let i={};for(let[r,s]of Object.entries(this.params))e.has(r)||(i[r]=s);this._emit("params-changed",{params:i})}_fieldData(e){return e in this.params?{[e]:this.params[e]}:{}}_defaultHintSuffix(e){let i=this.exposed?.defaults??{};if(!(e.name in i))return"";let r=ki(e.selector),s=Ce(this.hass,i[e.name]);return` (${d(this.hass,"ui.default_prefix","Default: ")}${s}${r?` ${r}`:""})`}_hasUserOverride(e){return e in this.params}_renderExtraParamsNotice(){let e=this._extraParamKeys();if(e.length===0)return"";let i=e.join(", ");return l`
      <div class="extra-params-notice" data-extra-params>
        <span>
          ${d(this.hass,"ui.extra_fields_prefix","Extra fields:")} ${i}.
          ${d(this.hass,"ui.extra_fields_hint","These fields aren't currently exposed but will still be sent.")}
        </span>
        <button data-remove-extras @click=${()=>this._clearExtraParams()}>
          ${d(this.hass,"ui.remove","Remove")}
        </button>
      </div>
    `}_renderFieldsForm(){let e=this._formSchema,i=this._renderExtraParamsNotice();return e.length===0?i===""?"":l`<div class="fields-form">${i}</div>`:customElements.get("ha-form")?l`
        <div class="fields-form">
          ${e.map(r=>{let s=this._perFieldSchemas[r.name]??[r],o=this._fieldData(r.name),a=this._defaultHintSuffix(r);return l`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <span class="field-label">${this._humanizeFieldLabel(r.name)}${r.required?" *":""}</span>${a?l`<span class="field-default-hint">${a}</span>`:""}
                  </span>
                  ${this._hasUserOverride(r.name)?l`<button
                        class="field-clear"
                        data-clear=${r.name}
                        @click=${()=>this._clearField(r.name)}
                        title=${d(this.hass,"ui.clear_default","Clear default")}
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
        ${e.map(r=>{let s=this._fieldData(r.name),o=r.name in s?String(s[r.name]??""):"",a=this._defaultHintSuffix(r);return l`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <label class="field-label">${this._humanizeFieldLabel(r.name)}${r.required?" *":""}</label>${a?l`<span class="field-default-hint">${a}</span>`:""}
                  </span>
                  ${this._hasUserOverride(r.name)?l`<button
                        class="field-clear"
                        data-clear=${r.name}
                        @click=${()=>this._clearField(r.name)}
                        title=${d(this.hass,"ui.clear_default","Clear default")}
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
    `}_emit(e,i){this.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}render(){if(this._schema===null)return this._exposedMissing?l`
          <div class="schema-error">
            ${d(this.hass,"ui.service_not_exposed","Service no longer exposed; configure it in Settings \u2192 Actions or remove this action.")}
          </div>
        `:l`
        <div class="schema-error">
          ${this._schemaError??d(this.hass,"ui.service_unavailable","Service not available in this HA instance.")}
        </div>
      `;if(this._schema===void 0)return l`<div>${d(this.hass,"ui.loading","Loading\u2026")}</div>`;let e=this._renderTargetPicker(),i=this._renderFieldsForm();return e===""&&i===""?l`<div class="no-params">${d(this.hass,"ui.action_no_parameters","This action has no configurable fields.")}</div>`:l`${e}${i}`}};W.styles=y`
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
  `,c([m({attribute:!1})],W.prototype,"hass",2),c([m({attribute:!1})],W.prototype,"scope",2),c([m({attribute:!1})],W.prototype,"exposed",2),c([m({attribute:!1})],W.prototype,"entityIds",2),c([m({attribute:!1})],W.prototype,"params",2),c([m({attribute:!1})],W.prototype,"excludeEntities",2),c([g()],W.prototype,"_schema",2),c([g()],W.prototype,"_schemaError",2),c([g()],W.prototype,"_exposedMissing",2),c([g()],W.prototype,"_formSchema",2),c([g()],W.prototype,"_perFieldSchemas",2),W=c([w("ambience-action-slot")],W);function xs(t){return typeof t>"u"||t===null}function pa(t){return typeof t=="object"&&t!==null}function ma(t){return Array.isArray(t)?t:xs(t)?[]:[t]}function fa(t,n){var e,i,r,s;if(n)for(s=Object.keys(n),e=0,i=s.length;e<i;e+=1)r=s[e],t[r]=n[r];return t}function ga(t,n){var e="",i;for(i=0;i<n;i+=1)e+=t;return e}function _a(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var va=xs,ya=pa,ba=ma,wa=ga,xa=_a,$a=fa,H={isNothing:va,isObject:ya,toArray:ba,repeat:wa,isNegativeZero:xa,extend:$a};function $s(t,n){var e="",i=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(e+='in "'+t.mark.name+'" '),e+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!n&&t.mark.snippet&&(e+=`

`+t.mark.snippet),i+" "+e):i}function It(t,n){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=n,this.message=$s(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}It.prototype=Object.create(Error.prototype);It.prototype.constructor=It;It.prototype.toString=function(n){return this.name+": "+$s(this,n)};var K=It;function gr(t,n,e,i,r){var s="",o="",a=Math.floor(r/2)-1;return i-n>a&&(s=" ... ",n=i-a+s.length),e-i>a&&(o=" ...",e=i+a-o.length),{str:s+t.slice(n,e).replace(/\t/g,"\u2192")+o,pos:i-n+s.length}}function _r(t,n){return H.repeat(" ",n-t.length)+t}function ka(t,n){if(n=Object.create(n||null),!t.buffer)return null;n.maxLength||(n.maxLength=79),typeof n.indent!="number"&&(n.indent=1),typeof n.linesBefore!="number"&&(n.linesBefore=3),typeof n.linesAfter!="number"&&(n.linesAfter=2);for(var e=/\r?\n|\r|\0/g,i=[0],r=[],s,o=-1;s=e.exec(t.buffer);)r.push(s.index),i.push(s.index+s[0].length),t.position<=s.index&&o<0&&(o=i.length-2);o<0&&(o=i.length-1);var a="",u,h,p=Math.min(t.line+n.linesAfter,r.length).toString().length,f=n.maxLength-(n.indent+p+3);for(u=1;u<=n.linesBefore&&!(o-u<0);u++)h=gr(t.buffer,i[o-u],r[o-u],t.position-(i[o]-i[o-u]),f),a=H.repeat(" ",n.indent)+_r((t.line-u+1).toString(),p)+" | "+h.str+`
`+a;for(h=gr(t.buffer,i[o],r[o],t.position,f),a+=H.repeat(" ",n.indent)+_r((t.line+1).toString(),p)+" | "+h.str+`
`,a+=H.repeat("-",n.indent+p+3+h.pos)+`^
`,u=1;u<=n.linesAfter&&!(o+u>=r.length);u++)h=gr(t.buffer,i[o+u],r[o+u],t.position-(i[o]-i[o+u]),f),a+=H.repeat(" ",n.indent)+_r((t.line+u+1).toString(),p)+" | "+h.str+`
`;return a.replace(/\n$/,"")}var Ea=ka,Sa=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Ca=["scalar","sequence","mapping"];function Ta(t){var n={};return t!==null&&Object.keys(t).forEach(function(e){t[e].forEach(function(i){n[String(i)]=e})}),n}function La(t,n){if(n=n||{},Object.keys(n).forEach(function(e){if(Sa.indexOf(e)===-1)throw new K('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.options=n,this.tag=t,this.kind=n.kind||null,this.resolve=n.resolve||function(){return!0},this.construct=n.construct||function(e){return e},this.instanceOf=n.instanceOf||null,this.predicate=n.predicate||null,this.represent=n.represent||null,this.representName=n.representName||null,this.defaultStyle=n.defaultStyle||null,this.multi=n.multi||!1,this.styleAliases=Ta(n.styleAliases||null),Ca.indexOf(this.kind)===-1)throw new K('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var U=La;function as(t,n){var e=[];return t[n].forEach(function(i){var r=e.length;e.forEach(function(s,o){s.tag===i.tag&&s.kind===i.kind&&s.multi===i.multi&&(r=o)}),e[r]=i}),e}function Ra(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},n,e;function i(r){r.multi?(t.multi[r.kind].push(r),t.multi.fallback.push(r)):t[r.kind][r.tag]=t.fallback[r.tag]=r}for(n=0,e=arguments.length;n<e;n+=1)arguments[n].forEach(i);return t}function yr(t){return this.extend(t)}yr.prototype.extend=function(n){var e=[],i=[];if(n instanceof U)i.push(n);else if(Array.isArray(n))i=i.concat(n);else if(n&&(Array.isArray(n.implicit)||Array.isArray(n.explicit)))n.implicit&&(e=e.concat(n.implicit)),n.explicit&&(i=i.concat(n.explicit));else throw new K("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.forEach(function(s){if(!(s instanceof U))throw new K("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new K("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new K("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),i.forEach(function(s){if(!(s instanceof U))throw new K("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var r=Object.create(yr.prototype);return r.implicit=(this.implicit||[]).concat(e),r.explicit=(this.explicit||[]).concat(i),r.compiledImplicit=as(r,"implicit"),r.compiledExplicit=as(r,"explicit"),r.compiledTypeMap=Ra(r.compiledImplicit,r.compiledExplicit),r};var Pa=yr,Aa=new U("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),Da=new U("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),Ha=new U("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),Oa=new Pa({explicit:[Aa,Da,Ha]});function Na(t){if(t===null)return!0;var n=t.length;return n===1&&t==="~"||n===4&&(t==="null"||t==="Null"||t==="NULL")}function Ia(){return null}function Fa(t){return t===null}var Ma=new U("tag:yaml.org,2002:null",{kind:"scalar",resolve:Na,construct:Ia,predicate:Fa,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function ja(t){if(t===null)return!1;var n=t.length;return n===4&&(t==="true"||t==="True"||t==="TRUE")||n===5&&(t==="false"||t==="False"||t==="FALSE")}function za(t){return t==="true"||t==="True"||t==="TRUE"}function Wa(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var Ua=new U("tag:yaml.org,2002:bool",{kind:"scalar",resolve:ja,construct:za,predicate:Wa,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function Ba(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function Va(t){return 48<=t&&t<=55}function qa(t){return 48<=t&&t<=57}function Ka(t){if(t===null)return!1;var n=t.length,e=0,i=!1,r;if(!n)return!1;if(r=t[e],(r==="-"||r==="+")&&(r=t[++e]),r==="0"){if(e+1===n)return!0;if(r=t[++e],r==="b"){for(e++;e<n;e++)if(r=t[e],r!=="_"){if(r!=="0"&&r!=="1")return!1;i=!0}return i&&r!=="_"}if(r==="x"){for(e++;e<n;e++)if(r=t[e],r!=="_"){if(!Ba(t.charCodeAt(e)))return!1;i=!0}return i&&r!=="_"}if(r==="o"){for(e++;e<n;e++)if(r=t[e],r!=="_"){if(!Va(t.charCodeAt(e)))return!1;i=!0}return i&&r!=="_"}}if(r==="_")return!1;for(;e<n;e++)if(r=t[e],r!=="_"){if(!qa(t.charCodeAt(e)))return!1;i=!0}return!(!i||r==="_")}function Ya(t){var n=t,e=1,i;if(n.indexOf("_")!==-1&&(n=n.replace(/_/g,"")),i=n[0],(i==="-"||i==="+")&&(i==="-"&&(e=-1),n=n.slice(1),i=n[0]),n==="0")return 0;if(i==="0"){if(n[1]==="b")return e*parseInt(n.slice(2),2);if(n[1]==="x")return e*parseInt(n.slice(2),16);if(n[1]==="o")return e*parseInt(n.slice(2),8)}return e*parseInt(n,10)}function Ga(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!H.isNegativeZero(t)}var Qa=new U("tag:yaml.org,2002:int",{kind:"scalar",resolve:Ka,construct:Ya,predicate:Ga,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Xa=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Ja(t){return!(t===null||!Xa.test(t)||t[t.length-1]==="_")}function Za(t){var n,e;return n=t.replace(/_/g,"").toLowerCase(),e=n[0]==="-"?-1:1,"+-".indexOf(n[0])>=0&&(n=n.slice(1)),n===".inf"?e===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:n===".nan"?NaN:e*parseFloat(n,10)}var el=/^[-+]?[0-9]+e/;function tl(t,n){var e;if(isNaN(t))switch(n){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(n){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(n){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(H.isNegativeZero(t))return"-0.0";return e=t.toString(10),el.test(e)?e.replace("e",".e"):e}function il(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||H.isNegativeZero(t))}var rl=new U("tag:yaml.org,2002:float",{kind:"scalar",resolve:Ja,construct:Za,predicate:il,represent:tl,defaultStyle:"lowercase"}),nl=Oa.extend({implicit:[Ma,Ua,Qa,rl]}),sl=nl,ks=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Es=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function ol(t){return t===null?!1:ks.exec(t)!==null||Es.exec(t)!==null}function al(t){var n,e,i,r,s,o,a,u=0,h=null,p,f,_;if(n=ks.exec(t),n===null&&(n=Es.exec(t)),n===null)throw new Error("Date resolve error");if(e=+n[1],i=+n[2]-1,r=+n[3],!n[4])return new Date(Date.UTC(e,i,r));if(s=+n[4],o=+n[5],a=+n[6],n[7]){for(u=n[7].slice(0,3);u.length<3;)u+="0";u=+u}return n[9]&&(p=+n[10],f=+(n[11]||0),h=(p*60+f)*6e4,n[9]==="-"&&(h=-h)),_=new Date(Date.UTC(e,i,r,s,o,a,u)),h&&_.setTime(_.getTime()-h),_}function ll(t){return t.toISOString()}var dl=new U("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:ol,construct:al,instanceOf:Date,represent:ll});function cl(t){return t==="<<"||t===null}var ul=new U("tag:yaml.org,2002:merge",{kind:"scalar",resolve:cl}),kr=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function hl(t){if(t===null)return!1;var n,e,i=0,r=t.length,s=kr;for(e=0;e<r;e++)if(n=s.indexOf(t.charAt(e)),!(n>64)){if(n<0)return!1;i+=6}return i%8===0}function pl(t){var n,e,i=t.replace(/[\r\n=]/g,""),r=i.length,s=kr,o=0,a=[];for(n=0;n<r;n++)n%4===0&&n&&(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)),o=o<<6|s.indexOf(i.charAt(n));return e=r%4*6,e===0?(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)):e===18?(a.push(o>>10&255),a.push(o>>2&255)):e===12&&a.push(o>>4&255),new Uint8Array(a)}function ml(t){var n="",e=0,i,r,s=t.length,o=kr;for(i=0;i<s;i++)i%3===0&&i&&(n+=o[e>>18&63],n+=o[e>>12&63],n+=o[e>>6&63],n+=o[e&63]),e=(e<<8)+t[i];return r=s%3,r===0?(n+=o[e>>18&63],n+=o[e>>12&63],n+=o[e>>6&63],n+=o[e&63]):r===2?(n+=o[e>>10&63],n+=o[e>>4&63],n+=o[e<<2&63],n+=o[64]):r===1&&(n+=o[e>>2&63],n+=o[e<<4&63],n+=o[64],n+=o[64]),n}function fl(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var gl=new U("tag:yaml.org,2002:binary",{kind:"scalar",resolve:hl,construct:pl,predicate:fl,represent:ml}),_l=Object.prototype.hasOwnProperty,vl=Object.prototype.toString;function yl(t){if(t===null)return!0;var n=[],e,i,r,s,o,a=t;for(e=0,i=a.length;e<i;e+=1){if(r=a[e],o=!1,vl.call(r)!=="[object Object]")return!1;for(s in r)if(_l.call(r,s))if(!o)o=!0;else return!1;if(!o)return!1;if(n.indexOf(s)===-1)n.push(s);else return!1}return!0}function bl(t){return t!==null?t:[]}var wl=new U("tag:yaml.org,2002:omap",{kind:"sequence",resolve:yl,construct:bl}),xl=Object.prototype.toString;function $l(t){if(t===null)return!0;var n,e,i,r,s,o=t;for(s=new Array(o.length),n=0,e=o.length;n<e;n+=1){if(i=o[n],xl.call(i)!=="[object Object]"||(r=Object.keys(i),r.length!==1))return!1;s[n]=[r[0],i[r[0]]]}return!0}function kl(t){if(t===null)return[];var n,e,i,r,s,o=t;for(s=new Array(o.length),n=0,e=o.length;n<e;n+=1)i=o[n],r=Object.keys(i),s[n]=[r[0],i[r[0]]];return s}var El=new U("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:$l,construct:kl}),Sl=Object.prototype.hasOwnProperty;function Cl(t){if(t===null)return!0;var n,e=t;for(n in e)if(Sl.call(e,n)&&e[n]!==null)return!1;return!0}function Tl(t){return t!==null?t:{}}var Ll=new U("tag:yaml.org,2002:set",{kind:"mapping",resolve:Cl,construct:Tl}),Ss=sl.extend({implicit:[dl,ul],explicit:[gl,wl,El,Ll]}),Le=Object.prototype.hasOwnProperty,Ci=1,Cs=2,Ts=3,Ti=4,vr=1,Rl=2,ls=3,Pl=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Al=/[\x85\u2028\u2029]/,Dl=/[,\[\]\{\}]/,Ls=/^(?:!|!!|![a-z\-]+!)$/i,Rs=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function ds(t){return Object.prototype.toString.call(t)}function le(t){return t===10||t===13}function Ke(t){return t===9||t===32}function Y(t){return t===9||t===32||t===10||t===13}function ft(t){return t===44||t===91||t===93||t===123||t===125}function Hl(t){var n;return 48<=t&&t<=57?t-48:(n=t|32,97<=n&&n<=102?n-97+10:-1)}function Ol(t){return t===120?2:t===117?4:t===85?8:0}function Nl(t){return 48<=t&&t<=57?t-48:-1}function cs(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"\x85":t===95?"\xA0":t===76?"\u2028":t===80?"\u2029":""}function Il(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function Ps(t,n,e){n==="__proto__"?Object.defineProperty(t,n,{configurable:!0,enumerable:!0,writable:!0,value:e}):t[n]=e}var As=new Array(256),Ds=new Array(256);for(qe=0;qe<256;qe++)As[qe]=cs(qe)?1:0,Ds[qe]=cs(qe);var qe;function Fl(t,n){this.input=t,this.filename=n.filename||null,this.schema=n.schema||Ss,this.onWarning=n.onWarning||null,this.legacy=n.legacy||!1,this.json=n.json||!1,this.listener=n.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Hs(t,n){var e={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return e.snippet=Ea(e),new K(n,e)}function $(t,n){throw Hs(t,n)}function Li(t,n){t.onWarning&&t.onWarning.call(null,Hs(t,n))}var us={YAML:function(n,e,i){var r,s,o;n.version!==null&&$(n,"duplication of %YAML directive"),i.length!==1&&$(n,"YAML directive accepts exactly one argument"),r=/^([0-9]+)\.([0-9]+)$/.exec(i[0]),r===null&&$(n,"ill-formed argument of the YAML directive"),s=parseInt(r[1],10),o=parseInt(r[2],10),s!==1&&$(n,"unacceptable YAML version of the document"),n.version=i[0],n.checkLineBreaks=o<2,o!==1&&o!==2&&Li(n,"unsupported YAML version of the document")},TAG:function(n,e,i){var r,s;i.length!==2&&$(n,"TAG directive accepts exactly two arguments"),r=i[0],s=i[1],Ls.test(r)||$(n,"ill-formed tag handle (first argument) of the TAG directive"),Le.call(n.tagMap,r)&&$(n,'there is a previously declared suffix for "'+r+'" tag handle'),Rs.test(s)||$(n,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{$(n,"tag prefix is malformed: "+s)}n.tagMap[r]=s}};function Te(t,n,e,i){var r,s,o,a;if(n<e){if(a=t.input.slice(n,e),i)for(r=0,s=a.length;r<s;r+=1)o=a.charCodeAt(r),o===9||32<=o&&o<=1114111||$(t,"expected valid JSON character");else Pl.test(a)&&$(t,"the stream contains non-printable characters");t.result+=a}}function hs(t,n,e,i){var r,s,o,a;for(H.isObject(e)||$(t,"cannot merge mappings; the provided source object is unacceptable"),r=Object.keys(e),o=0,a=r.length;o<a;o+=1)s=r[o],Le.call(n,s)||(Ps(n,s,e[s]),i[s]=!0)}function gt(t,n,e,i,r,s,o,a,u){var h,p;if(Array.isArray(r))for(r=Array.prototype.slice.call(r),h=0,p=r.length;h<p;h+=1)Array.isArray(r[h])&&$(t,"nested arrays are not supported inside keys"),typeof r=="object"&&ds(r[h])==="[object Object]"&&(r[h]="[object Object]");if(typeof r=="object"&&ds(r)==="[object Object]"&&(r="[object Object]"),r=String(r),n===null&&(n={}),i==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(h=0,p=s.length;h<p;h+=1)hs(t,n,s[h],e);else hs(t,n,s,e);else!t.json&&!Le.call(e,r)&&Le.call(n,r)&&(t.line=o||t.line,t.lineStart=a||t.lineStart,t.position=u||t.position,$(t,"duplicated mapping key")),Ps(n,r,s),delete e[r];return n}function Er(t){var n;n=t.input.charCodeAt(t.position),n===10?t.position++:n===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):$(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function D(t,n,e){for(var i=0,r=t.input.charCodeAt(t.position);r!==0;){for(;Ke(r);)r===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),r=t.input.charCodeAt(++t.position);if(n&&r===35)do r=t.input.charCodeAt(++t.position);while(r!==10&&r!==13&&r!==0);if(le(r))for(Er(t),r=t.input.charCodeAt(t.position),i++,t.lineIndent=0;r===32;)t.lineIndent++,r=t.input.charCodeAt(++t.position);else break}return e!==-1&&i!==0&&t.lineIndent<e&&Li(t,"deficient indentation"),i}function Ai(t){var n=t.position,e;return e=t.input.charCodeAt(n),!!((e===45||e===46)&&e===t.input.charCodeAt(n+1)&&e===t.input.charCodeAt(n+2)&&(n+=3,e=t.input.charCodeAt(n),e===0||Y(e)))}function Sr(t,n){n===1?t.result+=" ":n>1&&(t.result+=H.repeat(`
`,n-1))}function Ml(t,n,e){var i,r,s,o,a,u,h,p,f=t.kind,_=t.result,v;if(v=t.input.charCodeAt(t.position),Y(v)||ft(v)||v===35||v===38||v===42||v===33||v===124||v===62||v===39||v===34||v===37||v===64||v===96||(v===63||v===45)&&(r=t.input.charCodeAt(t.position+1),Y(r)||e&&ft(r)))return!1;for(t.kind="scalar",t.result="",s=o=t.position,a=!1;v!==0;){if(v===58){if(r=t.input.charCodeAt(t.position+1),Y(r)||e&&ft(r))break}else if(v===35){if(i=t.input.charCodeAt(t.position-1),Y(i))break}else{if(t.position===t.lineStart&&Ai(t)||e&&ft(v))break;if(le(v))if(u=t.line,h=t.lineStart,p=t.lineIndent,D(t,!1,-1),t.lineIndent>=n){a=!0,v=t.input.charCodeAt(t.position);continue}else{t.position=o,t.line=u,t.lineStart=h,t.lineIndent=p;break}}a&&(Te(t,s,o,!1),Sr(t,t.line-u),s=o=t.position,a=!1),Ke(v)||(o=t.position+1),v=t.input.charCodeAt(++t.position)}return Te(t,s,o,!1),t.result?!0:(t.kind=f,t.result=_,!1)}function jl(t,n){var e,i,r;if(e=t.input.charCodeAt(t.position),e!==39)return!1;for(t.kind="scalar",t.result="",t.position++,i=r=t.position;(e=t.input.charCodeAt(t.position))!==0;)if(e===39)if(Te(t,i,t.position,!0),e=t.input.charCodeAt(++t.position),e===39)i=t.position,t.position++,r=t.position;else return!0;else le(e)?(Te(t,i,r,!0),Sr(t,D(t,!1,n)),i=r=t.position):t.position===t.lineStart&&Ai(t)?$(t,"unexpected end of the document within a single quoted scalar"):(t.position++,r=t.position);$(t,"unexpected end of the stream within a single quoted scalar")}function zl(t,n){var e,i,r,s,o,a;if(a=t.input.charCodeAt(t.position),a!==34)return!1;for(t.kind="scalar",t.result="",t.position++,e=i=t.position;(a=t.input.charCodeAt(t.position))!==0;){if(a===34)return Te(t,e,t.position,!0),t.position++,!0;if(a===92){if(Te(t,e,t.position,!0),a=t.input.charCodeAt(++t.position),le(a))D(t,!1,n);else if(a<256&&As[a])t.result+=Ds[a],t.position++;else if((o=Ol(a))>0){for(r=o,s=0;r>0;r--)a=t.input.charCodeAt(++t.position),(o=Hl(a))>=0?s=(s<<4)+o:$(t,"expected hexadecimal character");t.result+=Il(s),t.position++}else $(t,"unknown escape sequence");e=i=t.position}else le(a)?(Te(t,e,i,!0),Sr(t,D(t,!1,n)),e=i=t.position):t.position===t.lineStart&&Ai(t)?$(t,"unexpected end of the document within a double quoted scalar"):(t.position++,i=t.position)}$(t,"unexpected end of the stream within a double quoted scalar")}function Wl(t,n){var e=!0,i,r,s,o=t.tag,a,u=t.anchor,h,p,f,_,v,x=Object.create(null),E,L,V,C;if(C=t.input.charCodeAt(t.position),C===91)p=93,v=!1,a=[];else if(C===123)p=125,v=!0,a={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=a),C=t.input.charCodeAt(++t.position);C!==0;){if(D(t,!0,n),C=t.input.charCodeAt(t.position),C===p)return t.position++,t.tag=o,t.anchor=u,t.kind=v?"mapping":"sequence",t.result=a,!0;e?C===44&&$(t,"expected the node content, but found ','"):$(t,"missed comma between flow collection entries"),L=E=V=null,f=_=!1,C===63&&(h=t.input.charCodeAt(t.position+1),Y(h)&&(f=_=!0,t.position++,D(t,!0,n))),i=t.line,r=t.lineStart,s=t.position,_t(t,n,Ci,!1,!0),L=t.tag,E=t.result,D(t,!0,n),C=t.input.charCodeAt(t.position),(_||t.line===i)&&C===58&&(f=!0,C=t.input.charCodeAt(++t.position),D(t,!0,n),_t(t,n,Ci,!1,!0),V=t.result),v?gt(t,a,x,L,E,V,i,r,s):f?a.push(gt(t,null,x,L,E,V,i,r,s)):a.push(E),D(t,!0,n),C=t.input.charCodeAt(t.position),C===44?(e=!0,C=t.input.charCodeAt(++t.position)):e=!1}$(t,"unexpected end of the stream within a flow collection")}function Ul(t,n){var e,i,r=vr,s=!1,o=!1,a=n,u=0,h=!1,p,f;if(f=t.input.charCodeAt(t.position),f===124)i=!1;else if(f===62)i=!0;else return!1;for(t.kind="scalar",t.result="";f!==0;)if(f=t.input.charCodeAt(++t.position),f===43||f===45)vr===r?r=f===43?ls:Rl:$(t,"repeat of a chomping mode identifier");else if((p=Nl(f))>=0)p===0?$(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):o?$(t,"repeat of an indentation width identifier"):(a=n+p-1,o=!0);else break;if(Ke(f)){do f=t.input.charCodeAt(++t.position);while(Ke(f));if(f===35)do f=t.input.charCodeAt(++t.position);while(!le(f)&&f!==0)}for(;f!==0;){for(Er(t),t.lineIndent=0,f=t.input.charCodeAt(t.position);(!o||t.lineIndent<a)&&f===32;)t.lineIndent++,f=t.input.charCodeAt(++t.position);if(!o&&t.lineIndent>a&&(a=t.lineIndent),le(f)){u++;continue}if(t.lineIndent<a){r===ls?t.result+=H.repeat(`
`,s?1+u:u):r===vr&&s&&(t.result+=`
`);break}for(i?Ke(f)?(h=!0,t.result+=H.repeat(`
`,s?1+u:u)):h?(h=!1,t.result+=H.repeat(`
`,u+1)):u===0?s&&(t.result+=" "):t.result+=H.repeat(`
`,u):t.result+=H.repeat(`
`,s?1+u:u),s=!0,o=!0,u=0,e=t.position;!le(f)&&f!==0;)f=t.input.charCodeAt(++t.position);Te(t,e,t.position,!1)}return!0}function ps(t,n){var e,i=t.tag,r=t.anchor,s=[],o,a=!1,u;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=s),u=t.input.charCodeAt(t.position);u!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,$(t,"tab characters must not be used in indentation")),!(u!==45||(o=t.input.charCodeAt(t.position+1),!Y(o))));){if(a=!0,t.position++,D(t,!0,-1)&&t.lineIndent<=n){s.push(null),u=t.input.charCodeAt(t.position);continue}if(e=t.line,_t(t,n,Ts,!1,!0),s.push(t.result),D(t,!0,-1),u=t.input.charCodeAt(t.position),(t.line===e||t.lineIndent>n)&&u!==0)$(t,"bad indentation of a sequence entry");else if(t.lineIndent<n)break}return a?(t.tag=i,t.anchor=r,t.kind="sequence",t.result=s,!0):!1}function Bl(t,n,e){var i,r,s,o,a,u,h=t.tag,p=t.anchor,f={},_=Object.create(null),v=null,x=null,E=null,L=!1,V=!1,C;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=f),C=t.input.charCodeAt(t.position);C!==0;){if(!L&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,$(t,"tab characters must not be used in indentation")),i=t.input.charCodeAt(t.position+1),s=t.line,(C===63||C===58)&&Y(i))C===63?(L&&(gt(t,f,_,v,x,null,o,a,u),v=x=E=null),V=!0,L=!0,r=!0):L?(L=!1,r=!0):$(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,C=i;else{if(o=t.line,a=t.lineStart,u=t.position,!_t(t,e,Cs,!1,!0))break;if(t.line===s){for(C=t.input.charCodeAt(t.position);Ke(C);)C=t.input.charCodeAt(++t.position);if(C===58)C=t.input.charCodeAt(++t.position),Y(C)||$(t,"a whitespace character is expected after the key-value separator within a block mapping"),L&&(gt(t,f,_,v,x,null,o,a,u),v=x=E=null),V=!0,L=!1,r=!1,v=t.tag,x=t.result;else if(V)$(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=h,t.anchor=p,!0}else if(V)$(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=h,t.anchor=p,!0}if((t.line===s||t.lineIndent>n)&&(L&&(o=t.line,a=t.lineStart,u=t.position),_t(t,n,Ti,!0,r)&&(L?x=t.result:E=t.result),L||(gt(t,f,_,v,x,E,o,a,u),v=x=E=null),D(t,!0,-1),C=t.input.charCodeAt(t.position)),(t.line===s||t.lineIndent>n)&&C!==0)$(t,"bad indentation of a mapping entry");else if(t.lineIndent<n)break}return L&&gt(t,f,_,v,x,null,o,a,u),V&&(t.tag=h,t.anchor=p,t.kind="mapping",t.result=f),V}function Vl(t){var n,e=!1,i=!1,r,s,o;if(o=t.input.charCodeAt(t.position),o!==33)return!1;if(t.tag!==null&&$(t,"duplication of a tag property"),o=t.input.charCodeAt(++t.position),o===60?(e=!0,o=t.input.charCodeAt(++t.position)):o===33?(i=!0,r="!!",o=t.input.charCodeAt(++t.position)):r="!",n=t.position,e){do o=t.input.charCodeAt(++t.position);while(o!==0&&o!==62);t.position<t.length?(s=t.input.slice(n,t.position),o=t.input.charCodeAt(++t.position)):$(t,"unexpected end of the stream within a verbatim tag")}else{for(;o!==0&&!Y(o);)o===33&&(i?$(t,"tag suffix cannot contain exclamation marks"):(r=t.input.slice(n-1,t.position+1),Ls.test(r)||$(t,"named tag handle cannot contain such characters"),i=!0,n=t.position+1)),o=t.input.charCodeAt(++t.position);s=t.input.slice(n,t.position),Dl.test(s)&&$(t,"tag suffix cannot contain flow indicator characters")}s&&!Rs.test(s)&&$(t,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{$(t,"tag name is malformed: "+s)}return e?t.tag=s:Le.call(t.tagMap,r)?t.tag=t.tagMap[r]+s:r==="!"?t.tag="!"+s:r==="!!"?t.tag="tag:yaml.org,2002:"+s:$(t,'undeclared tag handle "'+r+'"'),!0}function ql(t){var n,e;if(e=t.input.charCodeAt(t.position),e!==38)return!1;for(t.anchor!==null&&$(t,"duplication of an anchor property"),e=t.input.charCodeAt(++t.position),n=t.position;e!==0&&!Y(e)&&!ft(e);)e=t.input.charCodeAt(++t.position);return t.position===n&&$(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(n,t.position),!0}function Kl(t){var n,e,i;if(i=t.input.charCodeAt(t.position),i!==42)return!1;for(i=t.input.charCodeAt(++t.position),n=t.position;i!==0&&!Y(i)&&!ft(i);)i=t.input.charCodeAt(++t.position);return t.position===n&&$(t,"name of an alias node must contain at least one character"),e=t.input.slice(n,t.position),Le.call(t.anchorMap,e)||$(t,'unidentified alias "'+e+'"'),t.result=t.anchorMap[e],D(t,!0,-1),!0}function _t(t,n,e,i,r){var s,o,a,u=1,h=!1,p=!1,f,_,v,x,E,L;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,s=o=a=Ti===e||Ts===e,i&&D(t,!0,-1)&&(h=!0,t.lineIndent>n?u=1:t.lineIndent===n?u=0:t.lineIndent<n&&(u=-1)),u===1)for(;Vl(t)||ql(t);)D(t,!0,-1)?(h=!0,a=s,t.lineIndent>n?u=1:t.lineIndent===n?u=0:t.lineIndent<n&&(u=-1)):a=!1;if(a&&(a=h||r),(u===1||Ti===e)&&(Ci===e||Cs===e?E=n:E=n+1,L=t.position-t.lineStart,u===1?a&&(ps(t,L)||Bl(t,L,E))||Wl(t,E)?p=!0:(o&&Ul(t,E)||jl(t,E)||zl(t,E)?p=!0:Kl(t)?(p=!0,(t.tag!==null||t.anchor!==null)&&$(t,"alias node should not have any properties")):Ml(t,E,Ci===e)&&(p=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):u===0&&(p=a&&ps(t,L))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&$(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),f=0,_=t.implicitTypes.length;f<_;f+=1)if(x=t.implicitTypes[f],x.resolve(t.result)){t.result=x.construct(t.result),t.tag=x.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(Le.call(t.typeMap[t.kind||"fallback"],t.tag))x=t.typeMap[t.kind||"fallback"][t.tag];else for(x=null,v=t.typeMap.multi[t.kind||"fallback"],f=0,_=v.length;f<_;f+=1)if(t.tag.slice(0,v[f].tag.length)===v[f].tag){x=v[f];break}x||$(t,"unknown tag !<"+t.tag+">"),t.result!==null&&x.kind!==t.kind&&$(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+x.kind+'", not "'+t.kind+'"'),x.resolve(t.result,t.tag)?(t.result=x.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):$(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||p}function Yl(t){var n=t.position,e,i,r,s=!1,o;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(o=t.input.charCodeAt(t.position))!==0&&(D(t,!0,-1),o=t.input.charCodeAt(t.position),!(t.lineIndent>0||o!==37));){for(s=!0,o=t.input.charCodeAt(++t.position),e=t.position;o!==0&&!Y(o);)o=t.input.charCodeAt(++t.position);for(i=t.input.slice(e,t.position),r=[],i.length<1&&$(t,"directive name must not be less than one character in length");o!==0;){for(;Ke(o);)o=t.input.charCodeAt(++t.position);if(o===35){do o=t.input.charCodeAt(++t.position);while(o!==0&&!le(o));break}if(le(o))break;for(e=t.position;o!==0&&!Y(o);)o=t.input.charCodeAt(++t.position);r.push(t.input.slice(e,t.position))}o!==0&&Er(t),Le.call(us,i)?us[i](t,i,r):Li(t,'unknown document directive "'+i+'"')}if(D(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,D(t,!0,-1)):s&&$(t,"directives end mark is expected"),_t(t,t.lineIndent-1,Ti,!1,!0),D(t,!0,-1),t.checkLineBreaks&&Al.test(t.input.slice(n,t.position))&&Li(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&Ai(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,D(t,!0,-1));return}if(t.position<t.length-1)$(t,"end of the stream or a document separator is expected");else return}function Os(t,n){t=String(t),n=n||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var e=new Fl(t,n),i=t.indexOf("\0");for(i!==-1&&(e.position=i,$(e,"null byte is not allowed in input")),e.input+="\0";e.input.charCodeAt(e.position)===32;)e.lineIndent+=1,e.position+=1;for(;e.position<e.length-1;)Yl(e);return e.documents}function Gl(t,n,e){n!==null&&typeof n=="object"&&typeof e>"u"&&(e=n,n=null);var i=Os(t,e);if(typeof n!="function")return i;for(var r=0,s=i.length;r<s;r+=1)n(i[r])}function Ql(t,n){var e=Os(t,n);if(e.length!==0){if(e.length===1)return e[0];throw new K("expected a single document in the stream, but found more")}}var Xl=Gl,Jl=Ql,Ns={loadAll:Xl,load:Jl},Is=Object.prototype.toString,Fs=Object.prototype.hasOwnProperty,Cr=65279,Zl=9,Ft=10,ed=13,td=32,id=33,rd=34,br=35,nd=37,sd=38,od=39,ad=42,Ms=44,ld=45,Ri=58,dd=61,cd=62,ud=63,hd=64,js=91,zs=93,pd=96,Ws=123,md=124,Us=125,B={};B[0]="\\0";B[7]="\\a";B[8]="\\b";B[9]="\\t";B[10]="\\n";B[11]="\\v";B[12]="\\f";B[13]="\\r";B[27]="\\e";B[34]='\\"';B[92]="\\\\";B[133]="\\N";B[160]="\\_";B[8232]="\\L";B[8233]="\\P";var fd=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],gd=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function _d(t,n){var e,i,r,s,o,a,u;if(n===null)return{};for(e={},i=Object.keys(n),r=0,s=i.length;r<s;r+=1)o=i[r],a=String(n[o]),o.slice(0,2)==="!!"&&(o="tag:yaml.org,2002:"+o.slice(2)),u=t.compiledTypeMap.fallback[o],u&&Fs.call(u.styleAliases,a)&&(a=u.styleAliases[a]),e[o]=a;return e}function vd(t){var n,e,i;if(n=t.toString(16).toUpperCase(),t<=255)e="x",i=2;else if(t<=65535)e="u",i=4;else if(t<=4294967295)e="U",i=8;else throw new K("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+e+H.repeat("0",i-n.length)+n}var yd=1,Mt=2;function bd(t){this.schema=t.schema||Ss,this.indent=Math.max(1,t.indent||2),this.noArrayIndent=t.noArrayIndent||!1,this.skipInvalid=t.skipInvalid||!1,this.flowLevel=H.isNothing(t.flowLevel)?-1:t.flowLevel,this.styleMap=_d(this.schema,t.styles||null),this.sortKeys=t.sortKeys||!1,this.lineWidth=t.lineWidth||80,this.noRefs=t.noRefs||!1,this.noCompatMode=t.noCompatMode||!1,this.condenseFlow=t.condenseFlow||!1,this.quotingType=t.quotingType==='"'?Mt:yd,this.forceQuotes=t.forceQuotes||!1,this.replacer=typeof t.replacer=="function"?t.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function ms(t,n){for(var e=H.repeat(" ",n),i=0,r=-1,s="",o,a=t.length;i<a;)r=t.indexOf(`
`,i),r===-1?(o=t.slice(i),i=a):(o=t.slice(i,r+1),i=r+1),o.length&&o!==`
`&&(s+=e),s+=o;return s}function wr(t,n){return`
`+H.repeat(" ",t.indent*n)}function wd(t,n){var e,i,r;for(e=0,i=t.implicitTypes.length;e<i;e+=1)if(r=t.implicitTypes[e],r.resolve(n))return!0;return!1}function Pi(t){return t===td||t===Zl}function jt(t){return 32<=t&&t<=126||161<=t&&t<=55295&&t!==8232&&t!==8233||57344<=t&&t<=65533&&t!==Cr||65536<=t&&t<=1114111}function fs(t){return jt(t)&&t!==Cr&&t!==ed&&t!==Ft}function gs(t,n,e){var i=fs(t),r=i&&!Pi(t);return(e?i:i&&t!==Ms&&t!==js&&t!==zs&&t!==Ws&&t!==Us)&&t!==br&&!(n===Ri&&!r)||fs(n)&&!Pi(n)&&t===br||n===Ri&&r}function xd(t){return jt(t)&&t!==Cr&&!Pi(t)&&t!==ld&&t!==ud&&t!==Ri&&t!==Ms&&t!==js&&t!==zs&&t!==Ws&&t!==Us&&t!==br&&t!==sd&&t!==ad&&t!==id&&t!==md&&t!==dd&&t!==cd&&t!==od&&t!==rd&&t!==nd&&t!==hd&&t!==pd}function $d(t){return!Pi(t)&&t!==Ri}function Nt(t,n){var e=t.charCodeAt(n),i;return e>=55296&&e<=56319&&n+1<t.length&&(i=t.charCodeAt(n+1),i>=56320&&i<=57343)?(e-55296)*1024+i-56320+65536:e}function Bs(t){var n=/^\n* /;return n.test(t)}var Vs=1,xr=2,qs=3,Ks=4,mt=5;function kd(t,n,e,i,r,s,o,a){var u,h=0,p=null,f=!1,_=!1,v=i!==-1,x=-1,E=xd(Nt(t,0))&&$d(Nt(t,t.length-1));if(n||o)for(u=0;u<t.length;h>=65536?u+=2:u++){if(h=Nt(t,u),!jt(h))return mt;E=E&&gs(h,p,a),p=h}else{for(u=0;u<t.length;h>=65536?u+=2:u++){if(h=Nt(t,u),h===Ft)f=!0,v&&(_=_||u-x-1>i&&t[x+1]!==" ",x=u);else if(!jt(h))return mt;E=E&&gs(h,p,a),p=h}_=_||v&&u-x-1>i&&t[x+1]!==" "}return!f&&!_?E&&!o&&!r(t)?Vs:s===Mt?mt:xr:e>9&&Bs(t)?mt:o?s===Mt?mt:xr:_?Ks:qs}function Ed(t,n,e,i,r){t.dump=(function(){if(n.length===0)return t.quotingType===Mt?'""':"''";if(!t.noCompatMode&&(fd.indexOf(n)!==-1||gd.test(n)))return t.quotingType===Mt?'"'+n+'"':"'"+n+"'";var s=t.indent*Math.max(1,e),o=t.lineWidth===-1?-1:Math.max(Math.min(t.lineWidth,40),t.lineWidth-s),a=i||t.flowLevel>-1&&e>=t.flowLevel;function u(h){return wd(t,h)}switch(kd(n,a,t.indent,o,u,t.quotingType,t.forceQuotes&&!i,r)){case Vs:return n;case xr:return"'"+n.replace(/'/g,"''")+"'";case qs:return"|"+_s(n,t.indent)+vs(ms(n,s));case Ks:return">"+_s(n,t.indent)+vs(ms(Sd(n,o),s));case mt:return'"'+Cd(n)+'"';default:throw new K("impossible error: invalid scalar style")}})()}function _s(t,n){var e=Bs(t)?String(n):"",i=t[t.length-1]===`
`,r=i&&(t[t.length-2]===`
`||t===`
`),s=r?"+":i?"":"-";return e+s+`
`}function vs(t){return t[t.length-1]===`
`?t.slice(0,-1):t}function Sd(t,n){for(var e=/(\n+)([^\n]*)/g,i=(function(){var h=t.indexOf(`
`);return h=h!==-1?h:t.length,e.lastIndex=h,ys(t.slice(0,h),n)})(),r=t[0]===`
`||t[0]===" ",s,o;o=e.exec(t);){var a=o[1],u=o[2];s=u[0]===" ",i+=a+(!r&&!s&&u!==""?`
`:"")+ys(u,n),r=s}return i}function ys(t,n){if(t===""||t[0]===" ")return t;for(var e=/ [^ ]/g,i,r=0,s,o=0,a=0,u="";i=e.exec(t);)a=i.index,a-r>n&&(s=o>r?o:a,u+=`
`+t.slice(r,s),r=s+1),o=a;return u+=`
`,t.length-r>n&&o>r?u+=t.slice(r,o)+`
`+t.slice(o+1):u+=t.slice(r),u.slice(1)}function Cd(t){for(var n="",e=0,i,r=0;r<t.length;e>=65536?r+=2:r++)e=Nt(t,r),i=B[e],!i&&jt(e)?(n+=t[r],e>=65536&&(n+=t[r+1])):n+=i||vd(e);return n}function Td(t,n,e){var i="",r=t.tag,s,o,a;for(s=0,o=e.length;s<o;s+=1)a=e[s],t.replacer&&(a=t.replacer.call(e,String(s),a)),(_e(t,n,a,!1,!1)||typeof a>"u"&&_e(t,n,null,!1,!1))&&(i!==""&&(i+=","+(t.condenseFlow?"":" ")),i+=t.dump);t.tag=r,t.dump="["+i+"]"}function bs(t,n,e,i){var r="",s=t.tag,o,a,u;for(o=0,a=e.length;o<a;o+=1)u=e[o],t.replacer&&(u=t.replacer.call(e,String(o),u)),(_e(t,n+1,u,!0,!0,!1,!0)||typeof u>"u"&&_e(t,n+1,null,!0,!0,!1,!0))&&((!i||r!=="")&&(r+=wr(t,n)),t.dump&&Ft===t.dump.charCodeAt(0)?r+="-":r+="- ",r+=t.dump);t.tag=s,t.dump=r||"[]"}function Ld(t,n,e){var i="",r=t.tag,s=Object.keys(e),o,a,u,h,p;for(o=0,a=s.length;o<a;o+=1)p="",i!==""&&(p+=", "),t.condenseFlow&&(p+='"'),u=s[o],h=e[u],t.replacer&&(h=t.replacer.call(e,u,h)),_e(t,n,u,!1,!1)&&(t.dump.length>1024&&(p+="? "),p+=t.dump+(t.condenseFlow?'"':"")+":"+(t.condenseFlow?"":" "),_e(t,n,h,!1,!1)&&(p+=t.dump,i+=p));t.tag=r,t.dump="{"+i+"}"}function Rd(t,n,e,i){var r="",s=t.tag,o=Object.keys(e),a,u,h,p,f,_;if(t.sortKeys===!0)o.sort();else if(typeof t.sortKeys=="function")o.sort(t.sortKeys);else if(t.sortKeys)throw new K("sortKeys must be a boolean or a function");for(a=0,u=o.length;a<u;a+=1)_="",(!i||r!=="")&&(_+=wr(t,n)),h=o[a],p=e[h],t.replacer&&(p=t.replacer.call(e,h,p)),_e(t,n+1,h,!0,!0,!0)&&(f=t.tag!==null&&t.tag!=="?"||t.dump&&t.dump.length>1024,f&&(t.dump&&Ft===t.dump.charCodeAt(0)?_+="?":_+="? "),_+=t.dump,f&&(_+=wr(t,n)),_e(t,n+1,p,!0,f)&&(t.dump&&Ft===t.dump.charCodeAt(0)?_+=":":_+=": ",_+=t.dump,r+=_));t.tag=s,t.dump=r||"{}"}function ws(t,n,e){var i,r,s,o,a,u;for(r=e?t.explicitTypes:t.implicitTypes,s=0,o=r.length;s<o;s+=1)if(a=r[s],(a.instanceOf||a.predicate)&&(!a.instanceOf||typeof n=="object"&&n instanceof a.instanceOf)&&(!a.predicate||a.predicate(n))){if(e?a.multi&&a.representName?t.tag=a.representName(n):t.tag=a.tag:t.tag="?",a.represent){if(u=t.styleMap[a.tag]||a.defaultStyle,Is.call(a.represent)==="[object Function]")i=a.represent(n,u);else if(Fs.call(a.represent,u))i=a.represent[u](n,u);else throw new K("!<"+a.tag+'> tag resolver accepts not "'+u+'" style');t.dump=i}return!0}return!1}function _e(t,n,e,i,r,s,o){t.tag=null,t.dump=e,ws(t,e,!1)||ws(t,e,!0);var a=Is.call(t.dump),u=i,h;i&&(i=t.flowLevel<0||t.flowLevel>n);var p=a==="[object Object]"||a==="[object Array]",f,_;if(p&&(f=t.duplicates.indexOf(e),_=f!==-1),(t.tag!==null&&t.tag!=="?"||_||t.indent!==2&&n>0)&&(r=!1),_&&t.usedDuplicates[f])t.dump="*ref_"+f;else{if(p&&_&&!t.usedDuplicates[f]&&(t.usedDuplicates[f]=!0),a==="[object Object]")i&&Object.keys(t.dump).length!==0?(Rd(t,n,t.dump,r),_&&(t.dump="&ref_"+f+t.dump)):(Ld(t,n,t.dump),_&&(t.dump="&ref_"+f+" "+t.dump));else if(a==="[object Array]")i&&t.dump.length!==0?(t.noArrayIndent&&!o&&n>0?bs(t,n-1,t.dump,r):bs(t,n,t.dump,r),_&&(t.dump="&ref_"+f+t.dump)):(Td(t,n,t.dump),_&&(t.dump="&ref_"+f+" "+t.dump));else if(a==="[object String]")t.tag!=="?"&&Ed(t,t.dump,n,s,u);else{if(a==="[object Undefined]")return!1;if(t.skipInvalid)return!1;throw new K("unacceptable kind of an object to dump "+a)}t.tag!==null&&t.tag!=="?"&&(h=encodeURI(t.tag[0]==="!"?t.tag.slice(1):t.tag).replace(/!/g,"%21"),t.tag[0]==="!"?h="!"+h:h.slice(0,18)==="tag:yaml.org,2002:"?h="!!"+h.slice(18):h="!<"+h+">",t.dump=h+" "+t.dump)}return!0}function Pd(t,n){var e=[],i=[],r,s;for($r(t,e,i),r=0,s=i.length;r<s;r+=1)n.duplicates.push(e[i[r]]);n.usedDuplicates=new Array(s)}function $r(t,n,e){var i,r,s;if(t!==null&&typeof t=="object")if(r=n.indexOf(t),r!==-1)e.indexOf(r)===-1&&e.push(r);else if(n.push(t),Array.isArray(t))for(r=0,s=t.length;r<s;r+=1)$r(t[r],n,e);else for(i=Object.keys(t),r=0,s=i.length;r<s;r+=1)$r(t[i[r]],n,e)}function Ad(t,n){n=n||{};var e=new bd(n);e.noRefs||Pd(t,e);var i=t;return e.replacer&&(i=e.replacer.call({"":i},"",i)),_e(e,0,i,!0,!0)?e.dump+`
`:""}var Dd=Ad,Hd={dump:Dd};function Tr(t,n){return function(){throw new Error("Function yaml."+t+" is removed in js-yaml 4. Use yaml."+n+" instead, which is now safe by default.")}}var Ys=Ns.load,Wh=Ns.loadAll,Di=Hd.dump;var Uh=Tr("safeLoad","load"),Bh=Tr("safeLoadAll","loadAll"),Vh=Tr("safeDump","dump");var de=class extends b{constructor(){super(...arguments);this.value=null;this._mode="form";this._yamlText="";this._yamlError=null;this._computeFieldLabel=e=>pr(this.hass,this._picked??"",e.name);this._computeFieldHelper=e=>{let r=this._currentFields()?.[e.name]?.description;return typeof r=="string"?r:""}}willUpdate(e){super.willUpdate?.(e),e.has("value")&&this._mode==="form"&&(this._yamlText=Di(this.value??{}))}connectedCallback(){super.connectedCallback(),this._yamlText=Di(this.value??{})}_setMode(e){e==="form"&&this._yamlError!==null||(e==="yaml"&&(this._yamlText=Di(this.value??{})),this._mode=e)}_onYamlInput(e){this._yamlText=e;let i;try{i=Ys(e)}catch(u){this._yamlError=u.message;return}if(i==null){this._yamlError=null,this._emit(null);return}if(typeof i!="object"||Array.isArray(i)){this._yamlError=d(this.hass,"ui.yaml_expect_object","Expected an object");return}let r=i,s=r.script;if(typeof s!="string"||!s.startsWith("script.")){this._yamlError=d(this.hass,"ui.yaml_script_string","`script` must be a 'script.<name>' string");return}let o=r.args;if(o!==void 0&&(typeof o!="object"||Array.isArray(o)||o===null)){this._yamlError=d(this.hass,"ui.yaml_args_object","`args` must be an object if present");return}let a=r.triggers;if(a!==void 0&&(!Array.isArray(a)||!a.every(u=>typeof u=="string"))){this._yamlError=d(this.hass,"ui.yaml_triggers_list","`triggers` must be a list of entity_id strings if present");return}this._yamlError=null,this._emit({script:s,args:o??{},triggers:a})}_emit(e){this.value=e,T(this,this.value)}_scriptIds(){let e=this.hass?.services;return Object.keys(e?.script??{}).sort().map(r=>`script.${r}`)}_label(e){return j(this.hass,e)}_fieldsFor(e){if(!e)return;let i=e.replace(/^script\./,"");return this.hass?.services?.script?.[i]?.fields}get _picked(){return this.value&&typeof this.value=="object"?this.value.script:null}_currentFields(){return this._fieldsFor(this._picked)}_defaultArgs(e){let i=this._fieldsFor(e)??{},r={};for(let[s,o]of Object.entries(i))o&&Object.hasOwn(o,"default")&&(r[s]=o.default);return r}_pickerSchema(){return[{name:"script",selector:{select:{mode:"dropdown",options:this._scriptIds().map(e=>({value:e,label:this._label(e)}))}}}]}_pickScript(e){if(!e){this._emit(null);return}this._emit({script:e,args:this._defaultArgs(e)})}_argsSchema(){let e=this._currentFields();return e?Object.entries(e).map(([i,r])=>({name:i,required:r.required,selector:r.selector??{text:{}}})):[]}_updateArgs(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:e,triggers:this.value.triggers})}get _triggers(){return this.value&&typeof this.value=="object"&&this.value.triggers||[]}_setTriggers(e){!this.value||typeof this.value!="object"||this._emit({script:this.value.script,args:this.value.args,triggers:e})}_removeTrigger(e){this._setTriggers(this._triggers.filter(i=>i!==e))}_addTrigger(e){this._triggers.includes(e)||this._setTriggers([...this._triggers,e])}render(){let e=this._picked,i=this._argsSchema(),r=(this.value&&typeof this.value=="object"?this.value.args:{})??{},s=i.length>0;return l`
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
          ${this._renderArgs(i,r)}
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
    `}_renderTriggerPicker(e){if(customElements.get("ha-form")){let i=[{name:"triggers",selector:{entity:{multiple:!0}}}];return l`<ha-form
        .hass=${this.hass}
        .schema=${i}
        .data=${{triggers:e}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),this._setTriggers(r.detail.value.triggers??[])}}
      ></ha-form>`}return l`
      <div class="chips">
        ${e.length===0?l`<span class="muted">${d(this.hass,"ui.script_triggers_none","No triggers")}</span>`:e.map(i=>l`<span class="chip" data-test=${`trigger-${i}`}>
                ${i}
                <button type="button" class="x" title=${d(this.hass,"ui.remove","Remove")} @click=${()=>this._removeTrigger(i)}>×</button>
              </span>`)}
      </div>
      <input
        data-test="trigger-add-input"
        placeholder="entity_id"
        @change=${i=>{let r=i.target,s=r.value.trim();s&&this._addTrigger(s),r.value=""}}
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
      ></ha-form>`:l`${e.map(r=>{let s=i[r.name];return l`
        <label style="display:block;margin-bottom:0.4rem;">
          <span style="display:inline-block;min-width:8em;">${r.name}</span>
          <input
            .value=${s==null?"":String(s)}
            @change=${o=>{let a=o.target.value,u={...i,[r.name]:a};this._updateArgs(u)}}
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
    </select>`}};de.styles=y`
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
  `,c([m({attribute:!1})],de.prototype,"hass",2),c([m({attribute:!1})],de.prototype,"value",2),c([g()],de.prototype,"_mode",2),c([g()],de.prototype,"_yamlText",2),c([g()],de.prototype,"_yamlError",2),de=c([w("ambience-script-predicate-input")],de);var Od=["dawn","sunrise","noon","sunset","dusk","midnight"],Ye=class extends b{constructor(){super(...arguments);this.value={kind:"time",hh:12,mm:0}}_emit(e){T(this,e)}_onKindChange(e){let i=e.target.value;i!==this.value.kind&&(i==="time"?this._emit({kind:"time",hh:12,mm:0}):this._emit({kind:"sun",anchor:"sunset",offset_min:0}))}_onTimeChange(e){if(this.value.kind!=="time")return;let i=e.target.value,[r,s]=i.split(":").map(o=>parseInt(o,10));Number.isNaN(r)||Number.isNaN(s)||this._emit({kind:"time",hh:r,mm:s})}_onAnchorChange(e){if(this.value.kind!=="sun")return;let i=e.target.value;this._emit({...this.value,anchor:i})}_onOffsetChange(e){if(this.value.kind!=="sun")return;let i=e.target.value.trim(),r=i===""?0:parseInt(i,10);Number.isNaN(r)||this._emit({...this.value,offset_min:r})}_onClampDirChange(e){if(this.value.kind!=="sun")return;let i=e.target.value;if(i===""){this._emit({kind:"sun",anchor:this.value.anchor,offset_min:this.value.offset_min});return}let r=this.value.clamp??Nd();this._emit({...this.value,clamp:{dir:i,hh:r.hh,mm:r.mm}})}_onClampTimeChange(e){if(this.value.kind!=="sun"||!this.value.clamp)return;let i=e.target.value,[r,s]=i.split(":").map(o=>parseInt(o,10));Number.isNaN(r)||Number.isNaN(s)||this._emit({...this.value,clamp:{dir:this.value.clamp.dir,hh:r,mm:s}})}_renderTime(e){let i=`${String(e.hh).padStart(2,"0")}:${String(e.mm).padStart(2,"0")}`;return l`<input type="time" .value=${i} @input=${this._onTimeChange} />`}_renderSun(e){let i=Id(e.offset_min,this.hass),r=e.clamp?.dir??"",s=e.clamp?`${String(e.clamp.hh).padStart(2,"0")}:${String(e.clamp.mm).padStart(2,"0")}`:"";return l`
      <div class="sun">
        <div class="row">
          <select @change=${this._onAnchorChange}>
            ${Od.map(o=>l`<option value=${o} ?selected=${o===e.anchor}>${$e(this.hass,o)}</option>`)}
          </select>
          <input
            type="number"
            step="1"
            placeholder=${d(this.hass,"ui.offset_placeholder","Offset")}
            .value=${e.offset_min===0?"":String(e.offset_min)}
            @input=${this._onOffsetChange}
          />
          <span class="offset-hint">${i}</span>
        </div>
        <div class="row">
          <select @change=${this._onClampDirChange}>
            <option value="" ?selected=${r===""}>${d(this.hass,"ui.clamp_none","\u2014")}</option>
            <option value="not_before" ?selected=${r==="not_before"}>${d(this.hass,"ui.clamp_not_before","not before")}</option>
            <option value="not_after" ?selected=${r==="not_after"}>${d(this.hass,"ui.clamp_not_after","not after")}</option>
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
    `}};Ye.styles=y`
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
  `,c([m({attribute:!1})],Ye.prototype,"hass",2),c([m({attribute:!1})],Ye.prototype,"value",2),Ye=c([w("ambience-time-endpoint")],Ye);function Nd(){let t=new Date;return{hh:t.getHours(),mm:t.getMinutes()}}function Id(t,n){if(t===0)return"";let e=Math.abs(t),i=t<0?"\u2212":"+";if(e%60===0){let r=e/60,s=r===1?d(n,"ui.unit_hour","hour"):d(n,"ui.unit_hours","hours");return`${i}${r} ${s}`}return`${i}${e} ${d(n,"ui.unit_min","min")}`}function Re(t){return t.scope_kind==="house"?"House":t.scope_kind==="floor"?`Floor: ${t.scope_id??""}`:t.scope_id??""}function Hi(t,n){if(!t)return[];let e=Object.keys(t.builtins??{}),i=n?e.slice().sort(n):e,r=new Set(t.hidden??[]),s=Object.keys(t.custom??{}).filter(o=>!(o in(t.builtins??{})));return[...i.filter(o=>!r.has(o)),...s]}var re=class extends b{constructor(){super(...arguments);this._view={builtins:{},custom:{},hidden:[]};this._modal={mode:"closed"};this._warnings=[];this._error=""}static{this.styles=y`
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
    .error { color: var(--error-color, #d32f2f); margin-bottom: 1rem; }
  `}async connectedCallback(){super.connectedCallback(),await this._reload()}async _reload(){try{this._view=await this._list(),this._error=""}catch(e){this._error=e.message||String(e)}}async _saveState(e){try{let i=await this._save(e,this._view.hidden);this._warnings=i.warnings,this._error=""}catch(i){return this._error=i.message||String(i),!1}return await this._reload(),!0}_onEdit(e,i){this._modal={mode:"edit",id:e,initial:i}}async _onDelete(e){let i={...this._view.custom};delete i[e],await this._saveState(i)}_onAdd(){this._modal={mode:"add"}}async _onModalSave(e){e.stopPropagation();let{id:i,definition:r}=e.detail;await this._saveState({...this._view.custom,[i]:r})&&(this._modal={mode:"closed"})}_onModalCancel(){this._modal={mode:"closed"}}_takenIds(){return new Set([...Object.keys(this._view.builtins),...Object.keys(this._view.custom)])}_renderBuiltinRow(e,i,r){return l`
      <div class="row ${r?"overridden":""}">
        <span class="name">${this._label(e,{})}</span>
        <span class="def">${this._formatDef(i)}</span>
        <span class="badge">${d(this.hass,"ui.badge_builtin","builtin")}</span>
        <span class="actions">
          ${r?"":l`<button class="icon" title=${d(this.hass,"ui.title_override","Override")} @click=${()=>this._onEdit(e,i)}>✎</button>`}
        </span>
      </div>
    `}_renderCustomRow(e,i){return l`
      <div class="row custom">
        <span class="name">${this._label(e,this._view.custom)}</span>
        <span class="def">${this._formatDef(i)}</span>
        <span class="badge">${d(this.hass,"ui.badge_custom","custom")}</span>
        <span class="actions">
          <button class="icon" title=${d(this.hass,"ui.title_edit","Edit")} @click=${()=>this._onEdit(e,i)}>✎</button>
          <button class="icon" title=${d(this.hass,"ui.title_delete","Delete")} @click=${()=>this._onDelete(e)}>✕</button>
        </span>
      </div>
    `}render(){let e=this._view.custom,[i,r]=this._headingKey(),[s,o]=this._addKey(),[a,u]=this._warningTextKey();return l`
      <header>
        <h2>${d(this.hass,i,r)}</h2>
      </header>
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${this._warnings.length?l`<div class="warnings">
            <strong>${d(this.hass,"ui.period_warning_prefix","Warning:")}</strong> ${d(this.hass,a,u)}
            <ul>
              ${this._warnings.map(h=>l`<li>${Re(h)} / "${h.scene_name}" → ${h.missing_id}</li>`)}
            </ul>
          </div>`:""}
      ${Object.entries(this._view.builtins).map(([h,p])=>{let f=e[h];return l`
          ${this._renderBuiltinRow(h,p,f!=null)}
          ${f!=null?this._renderCustomRow(h,f):""}
        `})}
      ${Object.entries(e).filter(([h])=>!(h in this._view.builtins)).map(([h,p])=>this._renderCustomRow(h,p))}
      <button class="add" @click=${this._onAdd}>${d(this.hass,s,o)}</button>
      ${this._renderModal()}
    `}};c([m({attribute:!1})],re.prototype,"hass",2),c([g()],re.prototype,"_view",2),c([g()],re.prototype,"_modal",2),c([g()],re.prototype,"_warnings",2),c([g()],re.prototype,"_error",2);var zt={kind:"any"},Gs={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0}},Qs=["daytime","morning","afternoon","evening","nighttime"];function Fd(t,n){let e=Qs.indexOf(t),i=Qs.indexOf(n);return e===-1&&i===-1?0:e===-1?1:i===-1?-1:e-i}var ce=class extends b{constructor(){super(...arguments);this.value=null;this._entries=[zt];this._openIdx=0}willUpdate(e){e.has("value")&&this.value!==this._lastEmitted&&(this._entries=this._predicateToEntries(this.value),this._entries.length===0&&(this._entries=[zt]),this._openIdx=Math.max(0,this._entries.length-1)),this._openIdx>=this._entries.length&&(this._openIdx=Math.max(0,this._entries.length-1))}updated(){this.shadowRoot?.querySelectorAll(".entry select")?.forEach(i=>{let r=this._entries[this._openIdx];if(!r)return;let s=r.kind==="any"?"__any__":r.kind==="range"?"__custom__":r.period;i.value!==s&&(i.value=s)})}_predicateToEntries(e){return e===null?[zt]:(Array.isArray(e)?e:[e]).map(r=>"period"in r?{kind:"period",period:r.period}:{kind:"range",from:r.from,to:r.to})}_emit(e){let i=e.filter(s=>s.kind!=="any").map(s=>s.kind==="period"?{period:s.period}:{from:s.from,to:s.to}),r=i.length===0?null:i.length===1?i[0]:i;this._lastEmitted=r,this.value=r,T(this,r)}_effectiveIds(){return Hi(this.periods,Fd)}_onSelectChange(e,i){let r=i.target.value,s=[...this._entries];r==="__any__"?s[e]=zt:r==="__custom__"?s[e]={kind:"range",...Gs}:s[e]={kind:"period",period:r},this._entries=s,this._emit(s)}_onRangeChange(e,i,r){r.stopPropagation();let s=this._entries[e];if(s?.kind!=="range")return;let o=[...this._entries];o[e]={...s,[i]:r.detail.value},this._entries=o,this._emit(o)}_onRemove(e){let i=this._entries.filter((r,s)=>s!==e);this._entries=i.length===0?[zt]:i,this._openIdx>=this._entries.length?this._openIdx=Math.max(0,this._entries.length-1):e<this._openIdx&&(this._openIdx-=1),this._emit(this._entries)}_onAdd(){let e=[...this._entries,{kind:"range",...Gs}];this._entries=e,this._openIdx=e.length-1,this._emit(e)}_onChipClick(e){this._openIdx=e}_renderChip(e,i){let r;return e.kind==="any"?r=d(this.hass,"ui.any_placeholder","(any)"):e.kind==="period"?r=Si({period:e.period},{hass:this.hass,periods:this.periods}):r=Si({from:e.from,to:e.to},{hass:this.hass,periods:this.periods}),l`
      <div class="summary-chip" @click=${()=>this._onChipClick(i)}>
        <span class="chip-label">${r}</span>
        ${this._entries.length>1?l`<button class="remove" @click=${s=>{s.stopPropagation(),this._onRemove(i)}} title=${d(this.hass,"ui.remove","Remove")}>✕</button>`:""}
      </div>
    `}_renderEntry(e,i,r){let s=this._effectiveIds(),o=this.periods?.custom??{};return l`
      <div class="entry">
        <div class="entry-header">
          <select @change=${a=>this._onSelectChange(i,a)}>
            ${r?l`<option value="__any__">${d(this.hass,"ui.any_time","Any time")}</option>`:""}
            <option value="__custom__">${d(this.hass,"ui.custom_range","Custom range")}</option>
            <option disabled>──────</option>
            ${s.map(a=>l`<option value=${a}>
                ${ke(this.hass,a,o)}${o[a]&&!this.periods?.builtins[a]?d(this.hass,"ui.custom_suffix"," (custom)"):""}
              </option>`)}
          </select>
          ${this._entries.length>1?l`<button class="remove" @click=${()=>this._onRemove(i)} title=${d(this.hass,"ui.remove","Remove")}>✕</button>`:""}
        </div>
        ${e.kind==="range"?l`
              <div class="range-row">
                <label>${d(this.hass,"ui.from_label","From")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.from}
                  @value-changed=${a=>this._onRangeChange(i,"from",a)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${d(this.hass,"ui.to_label","To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${e.to}
                  @value-changed=${a=>this._onRangeChange(i,"to",a)}
                ></ambience-time-endpoint>
              </div>`:""}
      </div>
    `}render(){let e=this._entries.some(r=>r.kind!=="any"),i=this._entries.length>1;return l`
      ${this._entries.map((r,s)=>i&&s!==this._openIdx?this._renderChip(r,s):this._renderEntry(r,s,s===0))}
      ${e?l`<button class="add-btn" @click=${this._onAdd}>${d(this.hass,"ui.add_time_range","+ add another time range")}</button>`:""}
    `}};ce.styles=y`
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
  `,c([m({attribute:!1})],ce.prototype,"value",2),c([m({attribute:!1})],ce.prototype,"periods",2),c([m({attribute:!1})],ce.prototype,"hass",2),c([g()],ce.prototype,"_entries",2),c([g()],ce.prototype,"_openIdx",2),ce=c([w("ambience-time-of-day-input")],ce);function Ge(t,n,e,i,r,s){return customElements.get("ha-form")?l`<ha-form
      class=${n}
      .hass=${t}
      .schema=${[{name:e,required:!0,selector:{select:{mode:"dropdown",options:r}}}]}
      .data=${{[e]:i}}
      .computeLabel=${()=>""}
      @value-changed=${a=>{a.stopPropagation();let u=a.detail.value[e];u&&s(u)}}
    ></ha-form>`:l`<select
    class=${n}
    @change=${o=>s(o.target.value)}
  >
    ${r.map(o=>l`<option value=${o.value} ?selected=${o.value===i}>${o.label}</option>`)}
  </select>`}function Oi(t,n,e,i,r){return customElements.get("ha-form")?l`<ha-form
      class="field"
      data-field="sensors"
      .hass=${t}
      .schema=${n}
      .data=${{sensors:e}}
      .computeLabel=${()=>""}
      @value-changed=${s=>{s.stopPropagation(),r(s.detail.value.sensors??[])}}
    ></ha-form>`:l`<input
    class="field"
    data-field="sensors"
    type="text"
    placeholder=${i}
    .value=${e.join(", ")}
    @change=${s=>r(s.target.value.split(",").map(o=>o.trim()).filter(o=>o!==""))}
  />`}function Wt(t,n,e,i,r,s){return customElements.get("ha-form")?l`<ha-form
      .hass=${t}
      .schema=${[{name:n,selector:i}]}
      .data=${{[n]:e??""}}
      .computeLabel=${()=>""}
      @value-changed=${a=>{a.stopPropagation(),s(a.detail.value[n]||null)}}
    ></ha-form>`:l`<input
    type="text"
    placeholder=${r}
    .value=${e??""}
    @change=${o=>s(o.target.value||null)}
  />`}var Lr="__custom__";function Xs(t,n){if(t==null||typeof t!="object")return null;let e=t;if(typeof e.range=="string")return null;let{min:i,max:r}=e;return typeof i=="number"&&i<0||typeof r=="number"&&r<0?d(n,"ui.lux_error_negative","Bounds must be 0 or greater."):typeof i=="number"&&typeof r=="number"&&i>=r?d(n,"ui.lux_error_order","Min must be less than max."):null}var Pe=class extends b{constructor(){super(...arguments);this.value=null}_cur(){return this.value??{sensors:[],range:this._defaultRangeId()}}_sensors(){return this._cur().sensors??[]}_showQuant(){return this._sensors().length>1}_effectiveRangeIds(){return Hi(this.luxRanges)}_defaultRangeId(){return this._effectiveRangeIds()[0]??"dark"}_isCustom(e){return e.range==null}_build(e){let i={...this._cur(),...e},r={sensors:i.sensors??[]};return this._isCustom(i)?(i.min!=null&&(r.min=i.min),i.max!=null&&(r.max=i.max)):r.range=i.range??this._defaultRangeId(),i.quant==="all"&&(r.quant="all"),r}_emit(e){this.value=e,T(this,e)}_setSensors(e){this._emit(this._build({sensors:e}))}_setQuant(e){this._emit(this._build({quant:e}))}_setBand(e){if(e===Lr){let i=this._cur();this._emit(this._build({range:void 0,min:i.min??0,max:i.max}))}else this._emit(this._build({range:e,min:void 0,max:void 0}))}_setMin(e){this._emit(this._build({min:e}))}_setMax(e){this._emit(this._build({max:e}))}_sensorSchema(){return[{name:"sensors",selector:{entity:{domain:"sensor",device_class:["illuminance"],multiple:!0}}}]}_renderSensors(){return Oi(this.hass,this._sensorSchema(),this._sensors(),"sensor.a, sensor.b",e=>this._setSensors(e))}_renderBand(e){let i=this._isCustom(e),r=[...this._effectiveRangeIds().map(a=>({value:a,label:ot(this.hass,a,this.luxRanges?.custom??{})})),{value:Lr,label:d(this.hass,"ui.custom_range","Custom range")}],s=Ge(this.hass,"band","band",i?Lr:e.range??this._defaultRangeId(),r,a=>this._setBand(a));if(!i)return s;let o=a=>a==null?"":String(a);return l`${s}
      <span class="band-row" data-field="band-custom">
        <input
          type="number" min="0" step="1" data-field="min"
          placeholder=${d(this.hass,"ui.lux_min_placeholder","0")}
          .value=${o(e.min)}
          @change=${a=>{let u=a.target.value;this._setMin(u===""?void 0:Number(u))}}
        />
        <span>–</span>
        <input
          type="number" min="0" step="1" data-field="max"
          placeholder=${d(this.hass,"ui.lux_max_placeholder","\u221E")}
          .value=${o(e.max)}
          @change=${a=>{let u=a.target.value;this._setMax(u===""?void 0:Number(u))}}
        />
        <span class="label">lx</span>
      </span>`}_renderQuant(e){return Ge(this.hass,"quant","quant",e,[{value:"any",label:d(this.hass,"ui.lux_any","Any of")},{value:"all",label:d(this.hass,"ui.lux_all","All of")}],i=>this._setQuant(i))}render(){let e=this._cur(),i=e.quant==="all"?"all":"any";return l`
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._showQuant()?this._renderQuant(i):""}
        ${this._renderBand(e)}
      </div>
    `}};Pe.styles=y`
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
  `,c([m({attribute:!1})],Pe.prototype,"hass",2),c([m({attribute:!1})],Pe.prototype,"value",2),c([m({attribute:!1})],Pe.prototype,"luxRanges",2),Pe=c([w("ambience-lux-input")],Pe);function Rr(t){if(typeof t!="string")return!1;let n=t.split(",").map(e=>e.trim()).filter(e=>e!=="");if(n.length===0)return!1;for(let e of n)if(e.includes("-")){let i=e.split("-").map(o=>o.trim());if(i.length!==2||!/^\d+$/.test(i[0])||!/^\d+$/.test(i[1]))return!1;let r=Number(i[0]),s=Number(i[1]);if(!(r>=1&&r<=s&&s<=31))return!1}else{if(!/^\d+$/.test(e))return!1;let i=Number(e);if(!(i>=1&&i<=31))return!1}return!0}var Pr=["weekday","day_of_month","date","date_range","last_day","workday","holiday","first_workday","last_workday"],Md=new Set(["workday","holiday"]),jd=new Set(["first_workday","last_workday"]),zd=[31,29,31,30,31,30,31,31,30,31,30,31];function Ut(t){return zd[t-1]??31}function Ar(t){switch(t){case"weekday":return{kind:t,days:[]};case"day_of_month":return{kind:t,days:""};case"date":return{kind:t,month:1,day:1};case"date_range":return{kind:t,from:{month:1,day:1},to:{month:12,day:31}};default:return{kind:t}}}function Js(t,n){if(t==null||typeof t!="object")return null;let e=t;for(let i of[e.include,e.exclude])if(Array.isArray(i))for(let r of i){let s=r;if(s?.kind==="weekday"&&(!Array.isArray(s.days)||s.days.length===0))return d(n,"ui.day_pick_weekday","Pick at least one day of the week.");if(s?.kind==="day_of_month"&&(typeof s.days!="string"||!Rr(s.days)))return d(n,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}return null}var Ae=class extends b{constructor(){super(...arguments);this.value=null;this.dayConfig={workday_sensor:null,workday_calendar:null};this._computeFieldHelper=e=>e.name==="days"?d(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15"):"";this._computeFieldLabel=e=>{switch(e.name){case"kind":return d(this.hass,"ui.field_kind","Kind");case"days":return d(this.hass,"ui.field_days_of_month","Days of month");case"month":return d(this.hass,"ui.field_month","Month");case"day":return d(this.hass,"ui.field_day","Day");case"from_month":return d(this.hass,"ui.field_from_month","From month");case"from_day":return d(this.hass,"ui.field_from_day","From day");case"to_month":return d(this.hass,"ui.field_to_month","To month");case"to_day":return d(this.hass,"ui.field_to_day","To day");default:return e.name}}}_current(){return this.value===null?{include:[],exclude:[]}:{include:[...this.value.include],exclude:[...this.value.exclude]}}_emit(e){let i=e.include.length===0&&e.exclude.length===0;this.value=i?null:e,T(this,this.value)}_addItem(e,i){let r=this._current();r[e]=[...r[e],Ar(i)],this._emit(r)}_removeItem(e,i){let r=this._current();r[e]=r[e].filter((s,o)=>o!==i),this._emit(r)}_updateItem(e,i,r){let s=this._current();s[e]=s[e].map((o,a)=>a===i?r:o),this._emit(s)}_kindDisabled(e){return!!(Md.has(e)&&!this.dayConfig.workday_sensor||jd.has(e)&&!this.dayConfig.workday_calendar)}_kindSchema(){return[{name:"kind",selector:{select:{mode:"dropdown",options:Pr.map(e=>({value:e,label:ai(this.hass,e),disabled:this._kindDisabled(e)}))}}}]}_monthSelector(){return{select:{mode:"dropdown",options:[1,2,3,4,5,6,7,8,9,10,11,12].map(e=>({value:String(e),label:at(this.hass,e)}))}}}_daySelector(e){return{number:{min:1,max:Ut(e),mode:"box"}}}_bodySchema(e){return e.kind==="day_of_month"?[{name:"days",selector:{text:{}}}]:null}_bodyData(e){return e.kind==="day_of_month"?{days:e.days}:{}}_bodyPatch(e,i){return e.kind==="day_of_month"?{kind:"day_of_month",days:String(i.days??"")}:e}_setDatePart(e,i,r){let s=Number(r);if(!Number.isFinite(s)||s<1)return e;if(i.endsWith("month")&&(s=Math.min(s,12)),e.kind==="date"){let{month:o,day:a}=e;return i==="month"&&(o=s),i==="day"&&(a=s),{kind:"date",month:o,day:Math.min(a,Ut(o))}}if(e.kind==="date_range"){let o={...e.from},a={...e.to};return i==="from_month"&&(o.month=s),i==="from_day"&&(o.day=s),i==="to_month"&&(a.month=s),i==="to_day"&&(a.day=s),o.day=Math.min(o.day,Ut(o.month)),a.day=Math.min(a.day,Ut(a.month)),{kind:"date_range",from:o,to:a}}return e}_onKindForm(e,i,r){let s=r.kind;if(!s){this._removeItem(e,i);return}if(this._kindDisabled(s))return;let o=this._current()[e][i];o&&o.kind===s||this._updateItem(e,i,Ar(s))}_dayOfMonthError(e){return e.trim()===""||Rr(e)?null:d(this.hass,"ui.day_spec_error","Use days 1\u201331 and ranges like 1-10, separated by commas")}_onBodyForm(e,i,r,s){this._updateItem(e,i,this._bodyPatch(r,s))}_renderWeekday(e,i,r){return l`${[0,1,2,3,4,5,6].map(s=>l`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${r.days.includes(s)}
          @change=${o=>{let u=o.target.checked?[...r.days,s].sort((h,p)=>h-p):r.days.filter(h=>h!==s);this._updateItem(e,i,{kind:"weekday",days:u})}}
        />${oi(this.hass,s)}
      </label>
    `)}`}_renderKindPicker(e,i,r){return customElements.get("ha-form")?l`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:r.kind}}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${s=>{s.stopPropagation(),this._onKindForm(e,i,s.detail.value)}}
      ></ha-form>`:l`
      <select
        class="kind"
        @change=${s=>{let o=s.target.value;this._kindDisabled(o)||o===r.kind||this._updateItem(e,i,Ar(o))}}
      >
        ${Pr.map(s=>l`<option value=${s} ?selected=${s===r.kind} ?disabled=${this._kindDisabled(s)}>${ai(this.hass,s)}</option>`)}
      </select>
    `}_renderItemBody(e,i,r){if(r.kind==="weekday")return this._renderWeekday(e,i,r);if(customElements.get("ha-form")){if(r.kind==="date")return this._renderDateRow(e,i,r,"month","day",r.month,r.day);if(r.kind==="date_range")return l`
          ${this._renderDateRow(e,i,r,"from_month","from_day",r.from.month,r.from.day)}
          ${this._renderDateRow(e,i,r,"to_month","to_day",r.to.month,r.to.day)}
        `;let s=this._bodySchema(r);if(!s)return l``;let o=r.kind==="day_of_month"?this._dayOfMonthError(r.days):null;return l`<ha-form
        .hass=${this.hass}
        .schema=${s}
        .data=${this._bodyData(r)}
        .error=${o?{days:o}:void 0}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${a=>{a.stopPropagation(),this._onBodyForm(e,i,r,a.detail.value)}}
      ></ha-form>`}return this._renderNativeBody(e,i,r)}_renderDateRow(e,i,r,s,o,a,u){let h=(p,f)=>{this._updateItem(e,i,this._setDatePart(r,p,f[p]))};return l`
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
          .data=${{[o]:u}}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${p=>{p.stopPropagation(),h(o,p.detail.value)}}
        ></ha-form>
      </div>
    `}_renderNativeBody(e,i,r){if(r.kind==="day_of_month"){let a=this._dayOfMonthError(r.days);return l`<input
        type="text" placeholder=${d(this.hass,"ui.day_of_month_placeholder","e.g. 1-10, 15")}
        .value=${r.days}
        @change=${u=>this._updateItem(e,i,this._bodyPatch(r,{days:u.target.value}))}
      />${a?l`<div class="field-error">${a}</div>`:""}`}let s=(a,u)=>l`
      <input type="number" min="1" max="12" .value=${String(u)}
        @change=${h=>this._updateItem(e,i,this._setDatePart(r,a,h.target.value))} />
    `,o=(a,u,h)=>l`
      <input type="number" min="1" max=${String(Ut(u))} .value=${String(h)}
        @change=${p=>this._updateItem(e,i,this._setDatePart(r,a,p.target.value))} />
    `;return r.kind==="date"?l`${s("month",r.month)} / ${o("day",r.month,r.day)}`:r.kind==="date_range"?l`
        <span>${d(this.hass,"ui.from","from")}</span>
        ${s("from_month",r.from.month)} / ${o("from_day",r.from.month,r.from.day)}
        <span>${d(this.hass,"ui.to","to")}</span>
        ${s("to_month",r.to.month)} / ${o("to_day",r.to.month,r.to.day)}
      `:l``}_renderAddPicker(e){let i=e==="include"?d(this.hass,"ui.add_include_item","+ Add include item"):d(this.hass,"ui.add_exclude_item","+ Add exclude item");if(customElements.get("ha-form")){let r=()=>i;return l`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{kind:""}}
        .computeLabel=${r}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.kind;o&&!this._kindDisabled(o)&&this._addItem(e,o)}}
      ></ha-form>`}return l`
      <select
        .value=${""}
        @change=${r=>{let s=r.target.value;s&&(this._addItem(e,s),r.target.value="")}}
      >
        <option value="">${i}</option>
        ${Pr.map(r=>l`<option value=${r} ?disabled=${this._kindDisabled(r)}>${ai(this.hass,r)}</option>`)}
      </select>
    `}_renderItem(e,i,r){return l`
      <div class="item">
        ${this._renderKindPicker(e,i,r)}
        <div class="body">${this._renderItemBody(e,i,r)}</div>
        <button class="remove" title=${d(this.hass,"ui.remove","Remove")} @click=${()=>this._removeItem(e,i)}>✕</button>
      </div>
    `}_renderSection(e,i){return l`
      <div class="section">
        <h4>${e==="include"?d(this.hass,"ui.include","Include"):d(this.hass,"ui.exclude","Exclude")}</h4>
        ${i.length===0&&e==="include"?l`<div class="hint">${d(this.hass,"ui.empty_all_days","(empty \u2192 all days)")}</div>`:""}
        ${i.map((r,s)=>this._renderItem(e,s,r))}
        ${this._renderAddPicker(e)}
      </div>
    `}render(){let{include:e,exclude:i}=this._current();return l`
      ${this._renderSection("include",e)}
      ${this._renderSection("exclude",i)}
    `}};Ae.styles=y`
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
  `,c([m({attribute:!1})],Ae.prototype,"hass",2),c([m({attribute:!1})],Ae.prototype,"value",2),c([m({attribute:!1})],Ae.prototype,"dayConfig",2),Ae=c([w("ambience-day-predicate-input")],Ae);var Zs=["temperature","apparent_temperature","humidity","wind_speed","pressure"],eo=["<","<=",">",">="],to={"<":"<","<=":"\u2264",">":">",">=":"\u2265"},ve=class extends b{constructor(){super(...arguments);this.value=null;this.groups=[]}_current(){return this.value===null?{groups:[],thresholds:[]}:{groups:[...this.value.groups],thresholds:[...this.value.thresholds]}}_emit(e){let i=e.groups.length===0&&e.thresholds.length===0;this.value=i?null:e,T(this,this.value)}_setGroups(e){this._emit({...this._current(),groups:e})}_addThreshold(){let e=this._current();e.thresholds=[...e.thresholds,{attribute:"temperature",op:"<",value:0}],this._emit(e)}_updateThreshold(e,i){let r=this._current();r.thresholds=r.thresholds.map((s,o)=>o===e?i:s),this._emit(r)}_removeThreshold(e){let i=this._current();i.thresholds=i.thresholds.filter((r,s)=>s!==e),this._emit(i)}_attributeSchema(e){return[{name:"attribute",required:!0,selector:{select:{mode:"dropdown",options:Zs.map(i=>({value:i,label:St(this.hass,i)}))}}}]}_opSchema(e){return[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:eo.map(i=>({value:i,label:to[i]}))}}}]}_entityState(){let e=this.weatherEntity;return e?this.hass?.states?.[e]:void 0}_valueSchema(e,i){return[{name:"value",required:!0,selector:{number:{mode:"box",unit_of_measurement:er(this.hass,i,this._entityState())}}}]}_groupsSchema(){return[{name:"groups",selector:{select:{multiple:!0,mode:"list",options:this.groups.map(e=>({value:e.id,label:e.label}))}}}]}_renderGroups(e){return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{groups:e}}
        .computeLabel=${()=>""}
        @value-changed=${i=>{i.stopPropagation(),this._setGroups(i.detail.value.groups??[])}}
      ></ha-form>`:l`${this.groups.map(i=>l`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${e.includes(i.id)}
          @change=${r=>{let s=r.target.checked;this._setGroups(s?[...e,i.id]:e.filter(o=>o!==i.id))}} />${i.label}
      </label>`)}`}_renderAttributeSelect(e,i){return customElements.get("ha-form")?l`<ha-form
        class="attr-form"
        .hass=${this.hass}
        .schema=${this._attributeSchema(e)}
        .data=${{attribute:i.attribute}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation();let s=r.detail.value.attribute;s&&this._updateThreshold(e,{...i,attribute:s})}}
      ></ha-form>`:l`<select
      @change=${r=>this._updateThreshold(e,{...i,attribute:r.target.value})}>
      ${Zs.map(r=>l`<option value=${r} ?selected=${r===i.attribute}>${St(this.hass,r)}</option>`)}
    </select>`}_renderOpSelect(e,i){return customElements.get("ha-form")?l`<ha-form
        class="op-form"
        .hass=${this.hass}
        .schema=${this._opSchema(e)}
        .data=${{op:i.op}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation();let s=r.detail.value.op;s&&this._updateThreshold(e,{...i,op:s})}}
      ></ha-form>`:l`<select
      @change=${r=>this._updateThreshold(e,{...i,op:r.target.value})}>
      ${eo.map(r=>l`<option value=${r} ?selected=${r===i.op}>${to[r]}</option>`)}
    </select>`}_renderValueInput(e,i){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._valueSchema(e,i.attribute)}
        .data=${{value:i.value}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.value;typeof o=="number"&&Number.isFinite(o)&&this._updateThreshold(e,{...i,value:o})}}
      ></ha-form>`;let r=er(this.hass,i.attribute,this._entityState());return l`<span class="value-wrap">
      <input type="number" .value=${String(i.value)}
        @change=${s=>{let o=Number(s.target.value);Number.isFinite(o)&&this._updateThreshold(e,{...i,value:o})}} />
      <span class="unit">${r}</span>
    </span>`}_renderThreshold(e,i){return l`
      <div class="threshold">
        ${this._renderAttributeSelect(e,i)}
        ${this._renderOpSelect(e,i)}
        ${this._renderValueInput(e,i)}
        <button class="remove" title=${d(this.hass,"ui.remove","Remove")} @click=${()=>this._removeThreshold(e)}>✕</button>
      </div>
    `}render(){let{groups:e,thresholds:i}=this._current();return l`
      <div class="section">
        <h4>${d(this.hass,"ui.groups","Groups")}</h4>
        ${this._renderGroups(e)}
      </div>
      <div class="section">
        <h4>${d(this.hass,"ui.thresholds","Thresholds")}</h4>
        ${i.map((r,s)=>this._renderThreshold(s,r))}
        <button class="add" @click=${()=>this._addThreshold()}>${d(this.hass,"ui.add_threshold","+ Add threshold")}</button>
      </div>
    `}};ve.styles=y`
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
  `,c([m({attribute:!1})],ve.prototype,"hass",2),c([m({attribute:!1})],ve.prototype,"value",2),c([m({attribute:!1})],ve.prototype,"groups",2),c([m({attribute:!1})],ve.prototype,"weatherEntity",2),ve=c([w("ambience-weather-predicate-input")],ve);var Wd=["NW","N","NE","W",null,"E","SW","S","SE"],Qe=class extends b{constructor(){super(...arguments);this.value=null}_current(){let e=this.value?.azimuth?.ranges??[];return{elevation:this.value?.elevation??null,sectors:[...this.value?.azimuth?.sectors??[]],range:e.length?{...e[0]}:null}}_emit(e){let i={};e.elevation&&(e.elevation.min!=null||e.elevation.max!=null)&&(i.elevation=e.elevation);let r={};e.sectors.length&&(r.sectors=e.sectors),e.range&&(r.ranges=[e.range]),(r.sectors||r.ranges)&&(i.azimuth=r),this.value=i.elevation||i.azimuth?i:null,T(this,this.value)}_setElevation(e){this._emit({...this._current(),elevation:e})}_setSectors(e){this._emit({...this._current(),sectors:e})}_setRange(e){this._emit({...this._current(),range:e})}_mode(e){return!e||e.min==null&&e.max==null?"any":e.min!=null&&e.max!=null?"between":e.min!=null?"above":"below"}_onModeChange(e,i){let r=i?.min??0,s=i?.max??0;e==="any"?this._setElevation(null):e==="above"?this._setElevation({min:r}):e==="below"?this._setElevation({max:s}):this._setElevation({min:r,max:s})}_toggleSector(e,i,r){this._setSectors(r?[...e,i]:e.filter(s=>s!==i))}_renderSectors(e){return l`<div class="sectors">${Wd.map(i=>i===null?l`<span class="spacer"></span>`:l`<label>
            <input type="checkbox" .checked=${e.includes(i)}
              @change=${r=>this._toggleSector(e,i,r.target.checked)} />${i}
          </label>`)}</div>`}_renderElevation(e){let i=this._mode(e),r=["any","above","below","between"],s={any:d(this.hass,"ui.sun.any","Any"),above:d(this.hass,"ui.sun.above","Above"),below:d(this.hass,"ui.sun.below","Below"),between:d(this.hass,"ui.sun.between","Between")};return l`
      <div class="row">
        <select @change=${o=>this._onModeChange(o.target.value,e)}>
          ${r.map(o=>l`<option value=${o} ?selected=${o===i}>${s[o]}</option>`)}
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
        ${d(this.hass,"ui.sun.custom_range","Custom range")}
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
        <h4>${d(this.hass,"ui.sun.elevation","Elevation")}</h4>
        ${this._renderElevation(e)}
      </div>
      <div class="section">
        <h4>${d(this.hass,"ui.sun.azimuth","Azimuth")}</h4>
        ${this._renderSectors(i)}
        ${this._renderCustomRange(r)}
      </div>
    `}};Qe.styles=y`
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
  `,c([m({attribute:!1})],Qe.prototype,"hass",2),c([m({attribute:!1})],Qe.prototype,"value",2),Qe=c([w("ambience-sun-predicate-input")],Qe);var Ud=[{name:"duration",selector:{duration:{enable_day:!1}}}],Xe=class extends b{constructor(){super(...arguments);this.value=null}get _d(){return this.value??{h:0,m:0,s:0}}_set(e){this.value=e,T(this,e)}render(){if(customElements.get("ha-form")){let r=this._d;return l`<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${Ud}
        .data=${{duration:{hours:r.h,minutes:r.m,seconds:r.s}}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation();let o=s.detail.value.duration;this._set({h:o?.hours??0,m:o?.minutes??0,s:o?.seconds??0})}}
      ></ha-form>`}let e=this._d,i=r=>l`<input type="number" min="0" step="1"
      .value=${String(e[r])}
      @change=${s=>this._set({...e,[r]:Math.max(0,Math.trunc(Number(s.target.value)||0))})} />`;return l`<div class="for-row" data-field="for">
      ${i("h")}<span>:</span>${i("m")}<span>:</span>${i("s")}
    </div>`}};Xe.styles=y`
    :host { display: inline-block; }
    .for-row { display: flex; gap: 0.25rem; align-items: center; }
    .for-row input[type='number'] { width: 3.5rem; }
  `,c([m({attribute:!1})],Xe.prototype,"hass",2),c([m({attribute:!1})],Xe.prototype,"value",2),Xe=c([w("ambience-for-duration")],Xe);function vt(t){return t?.states??{}}function Dr(t,n){let e=`${n}.`;return Object.keys(vt(t)).filter(i=>i.startsWith(e)).sort().map(i=>({id:i,name:j(t,i)}))}var M=class extends b{constructor(){super(...arguments);this.value={kind:"is",entity_id:"",states:[]};this._knownStates=[];this._knownAttributeValues=[];this._entitySeq=0}async updated(e){if(!e.has("value"))return;let i=e.get("value"),{entity_id:r,attribute:s}=this.value;if(r&&r!==i?.entity_id&&this.hass)try{let o=(await sr(this.hass,r)).states;this.value.entity_id===r&&(this._knownStates=o)}catch{this.value.entity_id===r&&(this._knownStates=[])}if(r!==i?.entity_id||s!==i?.attribute)if(r&&s&&this.hass)try{let o=(await or(this.hass,r,s)).values;this.value.entity_id===r&&this.value.attribute===s&&(this._knownAttributeValues=o)}catch{this.value.entity_id===r&&this.value.attribute===s&&(this._knownAttributeValues=[])}else this._knownAttributeValues.length&&(this._knownAttributeValues=[])}_normalize(e){let i={...e};return i.attribute===""&&(i.attribute=null),i.for&&i.for.h===0&&i.for.m===0&&i.for.s===0&&(i.for=null),i}_emit(e){let i=this._normalize(e);this.value=i,T(this,i)}_autoFlipOp(e){let i=this._isNumericTargetFor(e),r=this._isNumericOp(e.kind);return!i&&r?{...e,kind:"is"}:i&&!r&&!this._isNumericTargetFor(this.value)?{...e,kind:">"}:e}async _setEntity(e){let i=++this._entitySeq,r=this._entityHasAttribute(e,this.value.attribute)?this.value.attribute:null,s=await this._supportedValues(e,r,this.value.states);i===this._entitySeq&&this._emit(this._autoFlipOp({...this.value,entity_id:e,attribute:r,states:s}))}_entityHasAttribute(e,i){return i?this._knownAttributesFor(e).includes(i):!1}async _supportedValues(e,i,r){if(!e||r.length===0||!this.hass)return[];try{let s=new Set(i?(await or(this.hass,e,i)).values:(await sr(this.hass,e)).states);return r.filter(o=>s.has(o))}catch{return[]}}_setAttribute(e){this._emit(this._autoFlipOp({...this.value,attribute:e}))}_setOp(e){let i=this._isNumericOp(e)===this._isNumericOp(this.value.kind)?this.value.states:[];this._emit({...this.value,kind:e,states:i})}_setStates(e){this._emit({...this.value,states:e})}_setValueAt(e,i){if(this._isNumericOp(this.value.kind)){this._setStates([i]);return}let r=this.value.states.slice();i===""?r.splice(e,1):r[e]=i,this._setStates(r)}_addValue(e){e&&this._setStates([...this.value.states,e])}_removeValueAt(e){let i=this.value.states.slice();i.splice(e,1),this._setStates(i)}_setForDuration(e){this._emit({...this.value,for:e})}_entitySchema(){return[{name:"entity_id",required:!0,selector:{entity:{}}}]}_knownAttributesFor(e){if(!e)return[];let i=vt(this.hass)[e]?.attributes;return i?Object.keys(i).sort():[]}_attrLabelMaps(){let e=this._knownAttributesFor(this.value.entity_id),r=`${this.hass?.language??""}|${this.value.entity_id}|${e.join(",")}`;if(this._attrMapsCache?.key===r)return this._attrMapsCache.maps;let s=vt(this.hass)[this.value.entity_id],o=new Map,a=new Map;for(let h of e){let p=ni(this.hass,s,h);o.set(h,p),a.set(p,h)}let u={keyToLabel:o,labelToKey:a};return this._attrMapsCache={key:r,maps:u},u}_attributeSchema(){let{keyToLabel:e}=this._attrLabelMaps();return[{name:"attribute",selector:{select:{mode:"dropdown",custom_value:!0,options:[{value:M._STATE_SENTINEL,label:d(this.hass,"ui.state_sentinel","State")},...[...e.values()].map(i=>({value:i,label:i}))]}}}]}_attributeData(){let e=this.value.attribute;if(!e)return{attribute:M._STATE_SENTINEL};let{keyToLabel:i}=this._attrLabelMaps();return{attribute:i.get(e)??e}}_setAttributeFromHaForm(e){if(e===M._STATE_SENTINEL){this._setAttribute("");return}let{labelToKey:i}=this._attrLabelMaps();this._setAttribute(i.get(e)??e)}_isNumericOp(e){return M._NUMERIC_OPS.includes(e)}_isNumericTargetFor(e){let i=vt(this.hass)[e.entity_id];if(!i)return!1;if(e.attribute)return typeof i.attributes?.[e.attribute]=="number";let r=i.state;return typeof r!="string"||r===""||r==="unknown"||r==="unavailable"?!1:Number.isFinite(Number(r))}_opSchema(){let e=this._isNumericTargetFor(this.value)?[...M._NUMERIC_OPS,"is","is_not"]:["is","is_not"];return e.includes(this.value.kind)||e.push(this.value.kind),[{name:"op",required:!0,selector:{select:{mode:"dropdown",options:e.map(i=>({value:i,label:J(this.hass,i)}))}}}]}_valueSchema(){if(this._isNumericOp(this.value.kind))return[{name:"value",selector:{number:{mode:"box",step:"any"}}}];let{rawToLabel:e}=this._valueLabelMaps();return[{name:"value",selector:{select:{mode:"dropdown",custom_value:!0,options:[...e.values()].map(i=>({value:i,label:i}))}}}]}_rawValueOptions(){return this.value.attribute?this._knownAttributeValues:this._knownStates}_valueLabelMaps(){let e=this.value.attribute,i=this._rawValueOptions(),s=`${this.hass?.language??""}|${this.value.entity_id}|${e??""}|${i.join(",")}`;if(this._valueMapsCache?.key===s)return this._valueMapsCache.maps;let o=vt(this.hass)[this.value.entity_id],a=new Map,u=new Map;for(let p of i){let f=st(this.hass,o,e,p);a.set(p,f),u.set(f,p)}let h={rawToLabel:a,labelToRaw:u};return this._valueMapsCache={key:s,maps:h},h}_valueDisplay(e){return this._valueLabelMaps().rawToLabel.get(e)??e}_labelToRaw(e){return this._valueLabelMaps().labelToRaw.get(e)??e}_setValueFromHaForm(e,i){this._setValueAt(e,this._labelToRaw(i))}_addValueFromHaForm(e){this._addValue(this._labelToRaw(e))}_renderEntity(){return customElements.get("ha-form")?l`<ha-form
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
      placeholder=${d(this.hass,"ui.state_attribute_placeholder","leave blank to compare state")}
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
      <option value="is" ?selected=${this.value.kind==="is"}>is</option>
      <option value="is_not" ?selected=${this.value.kind==="is_not"}>is not</option>
    </select>`}_renderValueRow(e,i){let r=i===-1,s=r?u=>this._addValue(u):u=>this._setValueAt(i,u),o=this._isNumericOp(this.value.kind),a=o?{value:e===""?void 0:Number(e)}:{value:this._valueDisplay(e)};return customElements.get("ha-form")?l`
        <div class="value-row" data-row=${i}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${a}
            .computeLabel=${()=>""}
            @value-changed=${u=>{u.stopPropagation();let h=u.detail.value.value,p=h==null?"":String(h);o?s(p):r?this._addValueFromHaForm(p):this._setValueFromHaForm(i,p)}}
          ></ha-form>
        </div>
      `:l`
      <div class="value-row" data-row=${i}>
        <input type=${o?"number":"text"} .value=${e}
          placeholder=${r?d(this.hass,"ui.state_add_value","+ Add state"):""}
          @change=${u=>s(u.target.value)} />
      </div>
    `}_renderForRow(){return l`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this.value.for??null}
      @value-changed=${e=>{e.stopPropagation(),this._setForDuration(e.detail.value)}}
    ></ambience-for-duration>`}render(){return l`
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
                ${this.value.states.map((e,i)=>this._renderValueRow(e,i))}
                ${this._renderValueRow("",-1)}
              `}
        </div>
      </section>
      <section class="field">
        <label class="field-label">${d(this.hass,"ui.state_for","For (optional)")}</label>
        ${this._renderForRow()}
      </section>
    `}};M.styles=y`
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
  `,M._STATE_SENTINEL="State",M._NUMERIC_OPS=[">",">=","<","<="],c([m({attribute:!1})],M.prototype,"hass",2),c([m({attribute:!1})],M.prototype,"value",2),c([g()],M.prototype,"_knownStates",2),c([g()],M.prototype,"_knownAttributeValues",2),M=c([w("ambience-state-expr-atom")],M);function Ni(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,i)=>e===n[i])}var Z=class extends b{constructor(){super(...arguments);this.path=[];this.dragOverPath=null;this.dragFromPath=null;this.openPath=null;this.errorPath=null;this.errorMessage=null}_emit(e,i={}){this.dispatchEvent(new CustomEvent(e,{detail:{path:this.path,...i},bubbles:!0,composed:!0}))}_atomIsComplete(e){return!!e.entity_id&&e.states.some(i=>i!=="")}_isErrorTarget(){return Ni(this.path,this.errorPath)}_isDropTarget(){return Ni(this.path,this.dragOverPath)}_isDragging(){return Ni(this.path,this.dragFromPath)}_onDragHandleDown(e){this.path.length!==0&&(!e.isPrimary||e.button>0||(e.stopPropagation(),this.dispatchEvent(new CustomEvent("node-drag-start",{detail:{path:this.path,pointer:e},bubbles:!0,composed:!0}))))}_dragHandle(){return this.path.length===0?"":l`<span
      class="drag-handle"
      title=${d(this.hass,"ui.drag_to_reorder","Drag to reorder")}
      @pointerdown=${this._onDragHandleDown}
      @click=${e=>e.stopPropagation()}
      >⠿</span
    >`}_renderAtomCard(e,i){let r=this._atomIsComplete(e),s=Ni(this.path,this.openPath),o=r?fr(e,{hass:this.hass}):d(this.hass,"ui.state_new_condition","(new condition)");return l`
      <div class="atom-card ${s?"expanded":"collapsed"} ${this._isDropTarget()?"drag-over":""} ${this._isDragging()?"dragging":""}">
        <div class="atom-header"
          @click=${()=>this._emit("node-open")}>
          ${this._dragHandle()}
          <button class="not-toggle ${i?"on":""}"
            title=${d(this.hass,"ui.state_not_toggle","Negate (NOT)")}
            @click=${a=>{a.stopPropagation(),this._emit("node-toggle-not")}}>${J(this.hass,"not")}</button>
          <span class="summary ${r?"":"placeholder"}">${o}</span>
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
              @value-changed=${a=>{a.stopPropagation();let u=a.detail.value,h=i?{kind:"not",item:u}:u;this._emit("node-change",{value:h})}}
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
        .dragFromPath=${this.dragFromPath}
        .errorPath=${this.errorPath}
        .errorMessage=${this.errorMessage}
      ></ambience-state-expr-node>
    `}_renderGroup(e){return l`
      <div class="group ${this._isDropTarget()?"drag-over":""} ${this._isDragging()?"dragging":""}">
        <div class="group-header">
          ${this._dragHandle()}
          <select class="group-op"
            @change=${i=>this._emit("node-set-op",{op:i.target.value})}>
            <option value="and" ?selected=${e.kind==="and"}>${J(this.hass,"and")}</option>
            <option value="or"  ?selected=${e.kind==="or"} >${J(this.hass,"or")}</option>
          </select>
          <button class="unwrap"
            title=${d(this.hass,"ui.state_unwrap_group","Remove these parens (promote children to parent)")}
            @click=${()=>this._emit("node-unwrap")}>✕</button>
        </div>
        <div class="group-children">
          ${e.items.map((i,r)=>this._renderChildRow(i,r))}
        </div>
        <div class="actions">
          <button @click=${()=>this._emit("node-add-child")}>
            + ${d(this.hass,"ui.state_add_condition","Add condition")}
          </button>
        </div>
      </div>
    `}render(){let e=this.value.kind==="not",i=e?this.value.item:this.value;return i.kind==="and"||i.kind==="or"?this._renderGroupWithExternalNot(i,e):this._renderAtomCard(i,e)}_renderGroupWithExternalNot(e,i){let r=this.path.length===0;return l`
      <div class="group-wrap">
        ${r?"":l`<button class="not-toggle external ${i?"on":""}"
          title=${d(this.hass,"ui.state_not_toggle","Negate (NOT)")}
          @click=${()=>this._emit("node-toggle-not")}>${J(this.hass,"not")}</button>`}
        ${this._renderGroup(e)}
      </div>
    `}};Z.styles=y`
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
  `,c([m({attribute:!1})],Z.prototype,"hass",2),c([m({attribute:!1})],Z.prototype,"value",2),c([m({attribute:!1})],Z.prototype,"path",2),c([m({attribute:!1})],Z.prototype,"dragOverPath",2),c([m({attribute:!1})],Z.prototype,"dragFromPath",2),c([m({attribute:!1})],Z.prototype,"openPath",2),c([m({attribute:!1})],Z.prototype,"errorPath",2),c([m({attribute:!1})],Z.prototype,"errorMessage",2),Z=c([w("ambience-state-expr-node")],Z);function Bt(t,n){return t===null||n===null||t.length!==n.length?!1:t.every((e,i)=>e===n[i])}var Bd=new Set(["is","is_not",">",">=","<","<=","and","or","not"]);function io(t,n){if(!t.entity_id)return d(n,"ui.state_err_entity","Entity is required");let e=Array.isArray(t.states)?t.states:[];if(t.kind!=="is"&&t.kind!=="is_not"){let r=e[0];if(typeof r!="string"||!r.trim())return d(n,"ui.state_err_value","Value is required");if(!Number.isFinite(Number(r)))return d(n,"ui.state_err_numeric","Value must be a number")}else if(!e.some(r=>r!==""))return d(n,"ui.state_err_state","State is required");return null}function Ii(t,n){if(!t||typeof t!="object")return null;if(t.kind==="not"){let e=t.item;return e?Ii(e,n):d(n,"ui.state_err_incomplete","This condition is incomplete")}if(t.kind==="and"||t.kind==="or"){let e=t.items;if(!Array.isArray(e)||e.length===0)return d(n,"ui.state_err_incomplete","This condition is incomplete");for(let i of e){let r=Ii(i,n);if(r!==null)return r}return null}return io(t,n)}function ro(t,n){if(t==null||typeof t!="object")return null;let e=t.kind;return typeof e!="string"||!Bd.has(e)?null:Ii(t,n)}var ne=class extends b{constructor(){super(...arguments);this.value=null;this._openPath=null;this._showError=!1;this._dragFrom=null;this._dragOverPath=null;this._cancelDrag=null;this._onNodeDragStart=e=>{e.stopPropagation(),this._startDrag(e.detail.path,e.detail.pointer)};this._onNodeChange=e=>{e.stopPropagation();let{path:i,value:r}=e.detail;if(this._isEmptyAtom(r)){let s=this._atomAt(i);if(s&&!this._isEmptyAtom(s)){this._openPath=null,this._removeAt(i);return}}this._replaceAt(i,r)};this._onNodeRemove=e=>{e.stopPropagation(),this._removeAt(e.detail.path)};this._onNodeWrap=e=>{e.stopPropagation(),this._wrapAt(e.detail.path)};this._onNodeAddChild=e=>{e.stopPropagation(),this._addChildAt(e.detail.path,"is")};this._onNodeToggleNot=e=>{e.stopPropagation(),this._toggleNotAt(e.detail.path)};this._onNodeSetOp=e=>{e.stopPropagation(),this._setGroupOpAt(e.detail.path,e.detail.op)};this._onNodeUnwrap=e=>{e.stopPropagation(),this._unwrapAt(e.detail.path)};this._onNodeOpen=e=>{if(e.stopPropagation(),this._openPath!==null){let i=this._atomAt(this._openPath);if(i&&this._atomError(i)!==null){this._showError=!0;return}}this._openPath!==null&&Bt(this._openPath,e.detail.path)?this._openPath=null:this._openPath=e.detail.path,this._showError=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("node-change",this._onNodeChange),this.addEventListener("node-remove",this._onNodeRemove),this.addEventListener("node-wrap",this._onNodeWrap),this.addEventListener("node-add-child",this._onNodeAddChild),this.addEventListener("node-toggle-not",this._onNodeToggleNot),this.addEventListener("node-set-op",this._onNodeSetOp),this.addEventListener("node-open",this._onNodeOpen),this.addEventListener("node-unwrap",this._onNodeUnwrap),this.addEventListener("node-drag-start",this._onNodeDragStart)}disconnectedCallback(){super.disconnectedCallback(),this._endDrag()}_emit(e){this.value=e,T(this,e)}_emptyAtom(){return{kind:"is",entity_id:"",states:[]}}_addFirstAtom(){this._openPath=[],this._emit(this._emptyAtom())}_replaceAt(e,i){let r=this._patch(this.value,e,()=>i);this._emit(r)}_removeAt(e){if(this._openPath=null,e.length===0){this._emit(null);return}let i=this._patch(this.value,e,()=>null);this._emit(i)}_wrapAt(e){let i=null;if(e.length>0){let o=this._nodeAt(e.slice(0,-1));o&&(o.kind==="and"||o.kind==="or")&&(i=o.kind)}let r=i==="and"?"or":"and",s=this._patch(this.value,e,o=>o&&{kind:r,items:[o]});this._emit(s)}_nodeAt(e){return this._walkNode(this.value,e)}_moveAt(e,i){if(this._isPrefix(e,i)||e.length===0||i.length===0)return;let r=this._nodeAt(e);if(!r)return;let s=this._rewriteForMove(this.value,[],e,i,r);this._emit(s)}_isPrefix(e,i){return e.length>i.length?!1:e.every((r,s)=>r===i[s])}_rewriteForMove(e,i,r,s,o){if(!e)return e;if(e.kind==="not"){let _=this._rewriteForMove(e.item,i,r,s,o);return _==null?null:{kind:"not",item:_}}if(e.kind!=="and"&&e.kind!=="or")return e;let a=r.slice(0,-1),u=s.slice(0,-1),h=Bt(i,a),p=Bt(i,u),f=[];if(e.items.forEach((_,v)=>{let x=[...i,v];if(h&&v===r[r.length-1])return;let E=this._rewriteForMove(_,x,r,s,o);E!==null&&f.push(E)}),p){let _=s[s.length-1];f.splice(_,0,o)}return f.length===0?null:{...e,items:f}}_startDrag(e,i){this._endDrag(),this._dragFrom=e,this._dragOverPath=null;let r=i.target?.closest(".atom-card, .group");this._cancelDrag=yi(i,{onMove:(s,o)=>{let a=this._locatePathAt(s,o),u=this._isDroppable(e,a)?a:null;(u===null?this._dragOverPath!==null:!Bt(u,this._dragOverPath))&&(this._dragOverPath=u)},onEnd:(s,o)=>{let a=this._locatePathAt(s,o);this._isDroppable(e,a)&&this._moveAt(e,a),this._endDrag()},onCancel:()=>this._endDrag()},{follow:r})}_endDrag(){this._cancelDrag?.(),this._cancelDrag=null,this._dragFrom=null,this._dragOverPath=null}_isDroppable(e,i){return i!==null&&i.length>0&&!Bt(e,i)&&!this._isPrefix(e,i)}_locatePathAt(e,i){let r=bi(e,i);for(;r;){if(r instanceof Element&&r.localName==="ambience-state-expr-node"){let o=r.path;return o?[...o]:null}let s=r.parentNode;s?r=s:r instanceof ShadowRoot?r=r.host:r=null}return null}_walkNode(e,i){return e?e.kind==="not"?this._walkNode(e.item,i):i.length===0?e:e.kind==="and"||e.kind==="or"?this._walkNode(e.items[i[0]]??null,i.slice(1)):null:null}_addChildAt(e,i){let r=null,s=this._patch(this.value,e,o=>{if(o&&(o.kind==="and"||o.kind==="or")){let a=[...o.items,this._emptyAtom()];return r=[...e,a.length-1],{...o,items:a}}return o});r!==null&&(this._openPath=r),this._emit(s)}_toggleNotAt(e){let i=this._patch(this.value,e,r=>r&&(r.kind==="not"?r.item:{kind:"not",item:r}));this._emit(i)}_setGroupOpAt(e,i){let r=this._patch(this.value,e,s=>{if(!s)return s;let o=null;if(s.kind==="and"||s.kind==="or")o=s;else if(s.kind==="not"){let a=s.item;(a.kind==="and"||a.kind==="or")&&(o=a)}return o?{kind:i,items:o.items}:s});this._emit(r)}_patch(e,i,r){if(i.length===0)return r(e);if(e==null)return e;let[s,...o]=i;if(e.kind==="and"||e.kind==="or"){let a=e.items.length,u=e.items.slice(),h=this._patch(u[s],o,r);if(h===null?u.splice(s,1):u[s]=h,u.length<a){if(u.length===0)return null;if(u.length===1)return u[0]}return{...e,items:u}}if(e.kind==="not"){let a=this._patch(e.item,i,r);return a==null?null:{kind:"not",item:a}}return e}_isEmptyAtom(e){if(e.kind==="not")return this._isEmptyAtom(e.item);if(e.kind==="and"||e.kind==="or")return!1;let i=e;return!i.entity_id&&i.states.every(r=>r==="")&&!i.attribute&&!i.for}_atomAt(e){return this._walk(this.value,e)}_walk(e,i){return e?e.kind==="not"?this._walk(e.item,i):i.length===0?e.kind==="and"||e.kind==="or"?null:e:e.kind==="and"||e.kind==="or"?this._walk(e.items[i[0]]??null,i.slice(1)):null:null}_treeError(e=this.value){return Ii(e,this.hass)}_emitValidity(){let e=this._treeError();this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_atomError(e){return io(e,this.hass)}_unwrapAt(e){if(this._openPath=null,e.length===0){let o=this.value;if(!o)return;let a=o.kind==="not"?o.item:o;(a.kind==="and"||a.kind==="or")&&(a.items.length===1?this._emit(a.items[0]):this._emit(null));return}let i=e.slice(0,-1),r=e[e.length-1],s=this._patch(this.value,i,o=>{if(!o||o.kind!=="and"&&o.kind!=="or")return o;let a=o.items.slice(),u=a[r],h=null;if(u.kind==="and"||u.kind==="or")h=u;else if(u.kind==="not"){let p=u.item;(p.kind==="and"||p.kind==="or")&&(h=p)}return h?(a.splice(r,1,...h.items),{...o,items:a}):o});this._emit(s)}willUpdate(e){if(e.has("value")){let i=this.value;if(i&&this._openPath===null&&i.kind!=="and"&&i.kind!=="or"&&(this._openPath=[]),this._showError&&this._openPath!==null){let r=this._atomAt(this._openPath);(!r||this._atomError(r)===null)&&(this._showError=!1)}this._emitValidity()}}_addAtRoot(){let e=this.value;if(e==null){this._addFirstAtom();return}if(e.kind==="and"||e.kind==="or"){this._addChildAt([],"is");return}this._openPath=[1],this._emit({kind:"and",items:[e,this._emptyAtom()]})}_setOpen(e){this._openPath=e}render(){if(this.value==null)return l`
        <div class="empty">
          <button @click=${()=>this._addFirstAtom()}>
            + ${d(this.hass,"ui.state_add_first","Add condition")}
          </button>
        </div>
      `;let e=this._showError&&this._openPath!==null?(()=>{let s=this._atomAt(this._openPath);return s?this._atomError(s):null})():null,i=this.value.kind==="not"?this.value.item:this.value,r=i.kind!=="and"&&i.kind!=="or";return l`
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
      ${r?l`
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
  `,c([m({attribute:!1})],ne.prototype,"hass",2),c([m({attribute:!1})],ne.prototype,"value",2),c([g()],ne.prototype,"_openPath",2),c([g()],ne.prototype,"_showError",2),c([g()],ne.prototype,"_dragFrom",2),c([g()],ne.prototype,"_dragOverPath",2),ne=c([w("ambience-state-predicate-input")],ne);var no=["everybody","anybody","nobody","any","all","none"],so=new Set(["any","all","none"]),Hr={everybody:"everyone",anybody:"any",nobody:"nobody",any:"any",all:"everyone",none:"nobody"},Je=class extends b{constructor(){super(...arguments);this.value=null;this._lastSelected=[]}_persons(){return Dr(this.hass,"person")}_zones(){return Dr(this.hass,"zone")}_cur(){return this.value??{}}_who(){return this.value?.who??[]}_hasWhoKey(){return this.value!=null&&Array.isArray(this.value.who)}_mode(){if(this._hasWhoKey())switch(this._cur().quant??"any"){case"any":return"any";case"everyone":return"all";case"nobody":return"none"}switch(this._cur().quant??"everyone"){case"nobody":return"nobody";case"any":return"anybody";default:return"everybody"}}_hasFor(e){return!!e&&(e.h!==0||e.m!==0||e.s!==0)}_isNegativeQuant(){return Hr[this._mode()]==="nobody"}_effectiveNegate(){return!this._isNegativeQuant()&&!!this._cur().negate}_emitMode(e){let i=this._cur(),r=i.where??"home",s={quant:Hr[e],where:r};i.negate&&Hr[e]!=="nobody"&&(s.negate=!0),so.has(e)&&(this._hasWhoKey()?s.who=[...this._who()]:this._lastSelected.length>0?s.who=[...this._lastSelected]:s.who=this._persons().map(o=>o.id)),this._hasFor(i.for)&&(s.for=i.for),this._emit(s)}_emit(e){this.value=e,T(this,e)}_setMode(e){this._emitMode(e)}_setWhere(e){let i=this._cur(),r={quant:i.quant??"everyone",where:e};this._effectiveNegate()&&(r.negate=!0),this._hasWhoKey()&&(r.who=[...this._who()]),this._hasFor(i.for)&&(r.for=i.for),this._emit(r)}_setNegate(e){let i=this._cur(),r={quant:i.quant??"everyone",where:i.where??"home"};e&&(r.negate=!0),this._hasWhoKey()&&(r.who=[...this._who()]),this._hasFor(i.for)&&(r.for=i.for),this._emit(r)}_togglePerson(e,i){let r=i?[...this._who(),e]:this._who().filter(a=>a!==e);r.length>0&&(this._lastSelected=[...r]);let s=this._cur(),o={quant:s.quant??"any",where:s.where??"home",who:r};this._effectiveNegate()&&(o.negate=!0),this._hasFor(s.for)&&(o.for=s.for),this._emit(o)}_setFor(e){let i=this._cur(),r={quant:i.quant??"everyone",where:i.where??"home"};this._effectiveNegate()&&(r.negate=!0),this._hasWhoKey()&&(r.who=[...this._who()]),this._hasFor(e)&&(r.for=e),this._emit(r)}_modeLabel(e){switch(e){case"everybody":return d(this.hass,"ui.people_mode_everybody","Everybody");case"anybody":return d(this.hass,"ui.people_mode_anybody","Anybody");case"nobody":return d(this.hass,"ui.people_mode_nobody","Nobody");case"any":return d(this.hass,"ui.people_mode_any","Any of:");case"all":return d(this.hass,"ui.people_mode_all","All of:");case"none":return d(this.hass,"ui.people_mode_none","None of:")}}_renderMode(e){if(customElements.get("ha-form")){let i=[{name:"mode",required:!0,selector:{select:{mode:"dropdown",options:no.map(r=>({value:r,label:this._modeLabel(r)}))}}}];return l`<ha-form
        class="mode"
        .hass=${this.hass}
        .schema=${i}
        .data=${{mode:e}}
        .computeLabel=${()=>""}
        @value-changed=${r=>{r.stopPropagation(),r.detail.value.mode&&this._setMode(r.detail.value.mode)}}
      ></ha-form>`}return l`<select
      class="mode"
      @change=${i=>this._setMode(i.target.value)}
    >
      ${no.map(i=>l`<option value=${i} ?selected=${i===e}>${this._modeLabel(i)}</option>`)}
    </select>`}_renderPeople(){let e=this._persons();if(e.length===0)return l`<div class="hint">${d(this.hass,"ui.people_none_tracked","No people tracked")}</div>`;let i=this._who();return l`<div class="people-list">
      ${e.map(r=>l`<label class="person-pill">
        <input
          type="checkbox"
          .checked=${i.includes(r.id)}
          @change=${s=>this._togglePerson(r.id,s.target.checked)}
        />${r.name}
      </label>`)}
    </div>
    <div class="field-error">${i.length===0?d(this.hass,"ui.people_select_one","Select at least one person"):""}</div>`}_renderNegate(e){let i=[{value:"false",label:d(this.hass,"ui.people_is_at","Is at")},{value:"true",label:d(this.hass,"ui.people_is_not_at","Is not at")}],r=s=>this._setNegate(s==="true");if(customElements.get("ha-form")){let s=[{name:"negate",required:!0,selector:{select:{mode:"dropdown",options:i}}}];return l`<ha-form
        class="negate"
        .hass=${this.hass}
        .schema=${s}
        .data=${{negate:e?"true":"false"}}
        .computeLabel=${()=>""}
        @value-changed=${o=>{o.stopPropagation(),o.detail.value.negate!=null&&r(o.detail.value.negate)}}
      ></ha-form>`}return l`<select
      class="negate"
      @change=${s=>r(s.target.value)}
    >
      ${i.map(s=>l`<option value=${s.value} ?selected=${s.value===(e?"true":"false")}>${s.label}</option>`)}
    </select>`}_renderWhere(e){let i=this._zones().filter(s=>s.id!=="zone.home"),r=[{value:"home",label:d(this.hass,"ui.people_where_home","Home")},...i.map(s=>({value:s.id,label:s.name}))];if(customElements.get("ha-form")){let s=[{name:"where",required:!0,selector:{select:{mode:"dropdown",options:r}}}];return l`<ha-form
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
      ${r.map(s=>l`<option value=${s.value} ?selected=${s.value===e}>${s.label}</option>`)}
    </select>`}_renderFor(){return l`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this._cur().for??null}
      @value-changed=${e=>{e.stopPropagation(),this._setFor(e.detail.value)}}
    ></ambience-for-duration>`}render(){let i=this._cur().where??"home",r=this._mode(),s=!this._isNegativeQuant(),o=this._effectiveNegate();return l`
      <div class="row">${this._renderMode(r)}</div>
      ${so.has(r)?this._renderPeople():""}
      <div class="row">
        ${s?this._renderNegate(o):l`<span class="label negate-static">${d(this.hass,"ui.people_is_at_static","is at")}</span>`}
        ${this._renderWhere(i)}
      </div>
      <div class="row">
        <span class="label">${d(this.hass,"ui.people_for","for")}</span>
        ${this._renderFor()}
      </div>
    `}};Je.styles=y`
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
  `,c([m({attribute:!1})],Je.prototype,"hass",2),c([m({attribute:!1})],Je.prototype,"value",2),Je=c([w("ambience-people-predicate-input")],Je);var Ze=class extends b{constructor(){super(...arguments);this.value=null}_cur(){return this.value??{sensors:[]}}_sensors(){return this._cur().sensors??[]}_showQuant(){return this._sensors().length>1}_hasFor(e){return!!e&&(e.h!==0||e.m!==0||e.s!==0)}_build(e){let i={...this._cur(),...e},r={sensors:i.sensors??[]};return i.occupied===!1&&(r.occupied=!1),i.quant==="all"&&(r.quant="all"),this._hasFor(i.for)&&(r.for=i.for),i.negate===!0&&(r.negate=!0),r}_emit(e){this.value=e,T(this,e)}_setSensors(e){this._emit(this._build({sensors:e}))}_setOccupied(e){this._emit(this._build({occupied:e}))}_setNegate(e){this._emit(this._build({negate:e}))}_setQuant(e){this._emit(this._build({quant:e}))}_setFor(e){this._emit(this._build({for:e}))}_sensorSchema(){return[{name:"sensors",selector:{entity:{domain:"binary_sensor",device_class:["occupancy","presence","motion"],multiple:!0}}}]}_renderSensors(){return Oi(this.hass,this._sensorSchema(),this._sensors(),"binary_sensor.a, binary_sensor.b",e=>this._setSensors(e))}_renderNegate(e){return Ge(this.hass,"negate","negate",e?"is_not":"is",[{value:"is",label:d(this.hass,"ui.occupancy_is","is")},{value:"is_not",label:d(this.hass,"ui.occupancy_is_not","is not")}],i=>this._setNegate(i==="is_not"))}_renderOccupied(e){return Ge(this.hass,"state","state",e?"occupied":"vacant",[{value:"occupied",label:d(this.hass,"ui.occupancy_detected","Detected")},{value:"vacant",label:d(this.hass,"ui.occupancy_clear","Clear")}],i=>this._setOccupied(i==="occupied"))}_renderQuant(e){return Ge(this.hass,"quant","quant",e,[{value:"any",label:d(this.hass,"ui.occupancy_any","Any of")},{value:"all",label:d(this.hass,"ui.occupancy_all","All of")}],i=>this._setQuant(i))}_renderFor(){return l`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this._cur().for??null}
      @value-changed=${e=>{e.stopPropagation(),this._setFor(e.detail.value)}}
    ></ambience-for-duration>`}render(){let e=this._cur(),i=e.occupied!==!1,r=e.negate===!0,s=e.quant==="all"?"all":"any";return l`
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._renderNegate(r)}
        ${this._renderOccupied(i)}
        ${this._showQuant()?this._renderQuant(s):""}
      </div>
      <div class="row">
        <span class="label">${d(this.hass,"ui.occupancy_for","for")}</span>
        ${this._renderFor()}
      </div>
    `}};Ze.styles=y`
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
  `,c([m({attribute:!1})],Ze.prototype,"hass",2),c([m({attribute:!1})],Ze.prototype,"value",2),Ze=c([w("ambience-occupancy-predicate-input")],Ze);var Vd=new Set(["1","true","yes","on","enable"]);function oo(t){return t==null?!1:typeof t=="boolean"?t:typeof t=="number"?t!==0:typeof t=="string"?Vd.has(t.toLowerCase().trim()):!1}function qd(t){if(t!==null&&typeof t=="object")try{return JSON.stringify(t)}catch{return String(t)}return String(t)}var De=class extends b{constructor(){super(...arguments);this.value=null;this._preview=null;this._debounceMs=250;this._gen=0}_template(){return this.value&&typeof this.value=="object"?this.value.template:""}willUpdate(e){if(!e.has("value")&&!e.has("hass"))return;let i=this._template(),r=this.hass?.connection;i===this._activeTemplate&&r===this._activeConn||(this._activeTemplate=i,this._activeConn=r,this._scheduleRender())}disconnectedCallback(){super.disconnectedCallback(),this._teardown()}_teardown(){this._debounceTimer!=null&&(clearTimeout(this._debounceTimer),this._debounceTimer=void 0),this._unsub&&(this._unsub(),this._unsub=void 0)}_scheduleRender(){this._teardown();let e=this._template();if(!e.trim()||!this.hass?.connection?.subscribeMessage){this._setPreview(null);return}let i=++this._gen;this._debounceTimer=setTimeout(()=>this._subscribe(e,i),this._debounceMs)}async _subscribe(e,i){let r=this.hass?.connection;if(r?.subscribeMessage)try{let s=await r.subscribeMessage(o=>{i===this._gen&&this._setPreview(o.error!=null?{error:o.error}:{value:qd(o.result),truthy:oo(o.result)})},{type:"render_template",template:e,report_errors:!0});if(i!==this._gen){s();return}this._unsub=s}catch(s){if(i!==this._gen)return;this._setPreview({error:s?.message??String(s)})}}_setPreview(e){this._preview=e,this._emitValidity(e!=null&&"error"in e?e.error:null)}_emitValidity(e){this._lastValidity!==e&&(this._lastValidity=e,this.dispatchEvent(new CustomEvent("render-invalid-changed",{detail:{error:e},bubbles:!0,composed:!0})))}_onInput(e){let i=e.target.value,r=i.trim()===""?null:{template:i};this.value=r,T(this,r)}_renderPreview(){let e=this._preview;return e==null?"":"error"in e?l`<div class="preview error">
        <div class="body">
          <span class="label">${d(this.hass,"ui.template_result","Result")}</span><span class="value">${e.error}</span>
        </div>
      </div>`:l`<div class="preview">
      <div class="body">
        <span class="label">${d(this.hass,"ui.template_result","Result")}</span><span class="value">${e.value}</span>
      </div>
      <span class="bool ${e.truthy?"true":"false"}"
        >${e.truthy?d(this.hass,"ui.template_truthy","true \u2014 matches"):d(this.hass,"ui.template_falsy","false \u2014 no match")}</span
      >
    </div>`}render(){return l`
      <textarea
        spellcheck="false"
        .value=${this._template()}
        placeholder="{{ is_state('binary_sensor.guests','on') }}"
        @input=${this._onInput}
      ></textarea>
      ${this._renderPreview()}
    `}};De.styles=y`
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
  `,c([m({attribute:!1})],De.prototype,"value",2),c([m({attribute:!1})],De.prototype,"hass",2),c([g()],De.prototype,"_preview",2),De=c([w("ambience-template-predicate-input")],De);var ie=class extends b{constructor(){super(...arguments);this.value=null;this._onChild=e=>{e.stopPropagation(),this._emit(e.detail.value)}}_emit(e){T(this,e)}_onText(e){let i=e.target.value;this._emit(i.trim()===""?null:i)}render(){return this.condition.input==="time_of_day"?l`
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
      `:l`
      <input
        type="text"
        placeholder=${d(this.hass,"ui.any_placeholder","(any)")}
        .value=${this.value==null?"":String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.condition.predicate_help}</div>
    `}};ie.styles=y`
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
  `,c([m({attribute:!1})],ie.prototype,"condition",2),c([m({attribute:!1})],ie.prototype,"value",2),c([m({attribute:!1})],ie.prototype,"periods",2),c([m({attribute:!1})],ie.prototype,"luxRanges",2),c([m({attribute:!1})],ie.prototype,"dayConfig",2),c([m({attribute:!1})],ie.prototype,"weatherConfig",2),c([m({attribute:!1})],ie.prototype,"hass",2),ie=c([w("ambience-condition-input")],ie);function Kd(t){return t!=null&&typeof t=="object"&&Array.isArray(t.who)&&t.who.length===0}function Yd(t){return t==="people"?{quant:"everyone",where:"home"}:null}function ao(t,n){return!!t&&!!n&&O(t)===O(n)}var Gd={state:ro,day:Js,lux:Xs},S=class extends b{constructor(){super(...arguments);this.open=!1;this.scene=null;this.conditions=[];this.availableActions=[];this.categories=[];this.schemas={};this.scopes=[];this.takenNames=new Map;this.saveError="";this._draft=null;this._open=null;this._showError=!1;this._addOrder=[];this._serviceHasTarget=new Map;this._conditionError=new Map;this._onNameInput=e=>{this._setName(e.target.value)};this._onAddCondition=e=>{let i=e.target,r=i.value;i.value="",this._addCondition(r)};this._onAddConditionHaForm=e=>{e.stopPropagation();let i=e.detail.value.add;i!==S._ADD_CONDITION_PLACEHOLDER&&this._addCondition(i)};this._onAddAction=e=>{let i=e.target,r=i.value;i.value="",this._addActionSlot(r)};this._onAddActionHaForm=e=>{e.stopPropagation();let i=e.detail.value.add;i!==S._ADD_ACTION_PLACEHOLDER&&this._addActionSlot(i)}}_onConditionInvalid(e,i){i?this._conditionError.set(e,i):this._conditionError.delete(e)}connectedCallback(){super.connectedCallback(),ee(this)}willUpdate(e){e.has("open")&&this.open&&(this._draft=this.scene?JSON.parse(JSON.stringify(this.scene)):null,this._scope=this.scope,this._open=null,this._showError=!1,this._addOrder=[],this._conditionError=new Map)}_setName(e){this._draft&&(this._draft={...this._draft,name:e||void 0})}_setDestination(e){let i=this.scopes[e];if(!i||!this._draft||(this._scope=i.scope,!this.hass))return;let r=new Set(vi(this.hass,this._scope,[]));this._draft={...this._draft,actions:this._draft.actions.map(s=>({...s,entity_ids:s.entity_ids.filter(o=>r.has(o))}))}}_renderDestination(){return l`
      <div class="scope-menu" role="listbox">
        ${this.scopes.map((e,i)=>l`<button
            class="scope-option"
            role="option"
            aria-selected=${ao(e.scope,this._scope)}
            @click=${()=>{this._setDestination(i),this._open=null}}
          >
            <ha-icon class="scope-icon" icon=${Pt(e.scope,this.hass)}></ha-icon>
            <span class="scope-name">${e.label}</span>
          </button>`)}
      </div>
    `}_renderDestinationSlot(){if(this.scopes.length===0)return"";if(this._isOpen({kind:"destination"}))return l`
        <div class="slot destination-slot expanded" data-slot-id="destination">
          ${this._renderDestination()}
        </div>
      `;let e=this.scopes.find(i=>ao(i.scope,this._scope))??this.scopes[0];return l`
      <div class="slot collapsed" data-slot-id="destination">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"destination"})}>
          <strong>${d(this.hass,"ui.scope","Scope")}:</strong>
          <ha-icon class="scope-icon" icon=${Pt(e.scope,this.hass)}></ha-icon>
          <span class="scope-name">${e.label}</span>
        </div>
      </div>
    `}_renderNameSlot(){let e=this._draft.name??"";if(this._isOpen({kind:"name"})){let s=this._showError?this._nameError():null;return l`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(e)}
          ${s?l`<div class="error">${s}</div>`:""}
        </div>
      `}let r=$i(this._draft,d(this.hass,"ui.new_scene","New scene"));return l`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"name"})}>
          <span class="summary-label"><strong>${r}</strong></span>
        </div>
      </div>
    `}_renderNameInputControl(e){let i=nn();return i==="ha-input"?l`<ha-input label=${d(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-input>`:i==="ha-textfield"?l`<ha-textfield label=${d(this.hass,"ui.name_optional","Name (optional)")} .value=${e} @input=${this._onNameInput}></ha-textfield>`:l`<input type="text" .value=${e} @input=${this._onNameInput} />`}_setCategory(e){!this._draft||!e||e===this._draft.category||(this._draft={...Rt(this._draft),category:e})}_renderCategorySlot(){if(this.categories.length===0)return"";let e=[...this.categories].sort((s,o)=>s.name.localeCompare(o.name)),i=this._effectiveCategoryId(),r=this.categories.find(s=>s.id===i)??e[0];return this._isOpen({kind:"category"})?l`
        <div class="slot category-slot expanded" data-slot-id="category">
          <div class="category-menu" role="listbox">
            ${e.map(s=>l`<button
                class="category-option"
                role="option"
                aria-selected=${s.id===i}
                @click=${()=>{this._setCategory(s.id),this._open=null}}
              >
                ${dt(s.color,s.icon)}
                <span class="category-name">${s.name}</span>
              </button>`)}
          </div>
        </div>
      `:l`
      <div class="slot collapsed" data-slot-id="category">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"category"})}>
          <strong>${d(this.hass,"ui.category","Category")}:</strong>
          ${dt(r.color,r.icon)}
          <span class="category-name">${r.name}</span>
        </div>
      </div>
    `}_isOpen(e){let i=this._open;return i===null||i.kind!==e.kind?!1:e.kind==="condition"&&i.kind==="condition"?e.id===i.id:e.kind==="action"&&i.kind==="action"?e.idx===i.idx:!0}_effectiveCategoryId(){return this._draft?.category?this._draft.category:[...this.categories].sort((i,r)=>i.name.localeCompare(r.name))[0]?.id??""}_nameError(){let e=this._draft?.name?.trim().toLowerCase();if(!e||!this._scope)return null;let i=_i(this._scope,this._effectiveCategoryId());return this.takenNames.get(i)?.has(e)?d(this.hass,"ui.name_duplicate","A scene with this name already exists in this category."):null}_validationError(e){if(e===null||e.kind==="category"||e.kind==="destination")return null;if(e.kind==="name")return this._nameError();if(e.kind==="condition"){let s=this._draft?.when[e.id];if(Kd(s))return d(this.hass,"ui.people_select_one","Select at least one person");let o=Gd[e.id]?.(s,this.hass);return o||(this._conditionError.has(e.id)?d(this.hass,"ui.condition_error","Fix the error in this condition before continuing"):null)}let i=this._draft?.actions[e.idx];if(!i)return null;let r=this._serviceHasTarget.get(i.service);return i.entity_ids.length===0&&r===!0?d(this.hass,"ui.at_least_one_target","At least one target is required."):null}_leaveBlockingError(e){return e?.kind==="name"?null:this._validationError(e)}_tryCloseCurrent(){return this._open===null?!0:this._leaveBlockingError(this._open)!==null?(this._showError=!0,!1):(this._open=null,this._showError=!1,!0)}_toggleSlot(e){if(this._isOpen(e)){if(this._leaveBlockingError(e)!==null){this._showError=!0;return}this._open=null,this._showError=!1;return}this._open!==null&&!this._tryCloseCurrent()||(this._open=e,this._showError=!1)}_onModalClick(e){for(let i of e.composedPath())if(i instanceof Element&&(i.classList.contains("slot")||i.classList.contains("actions-bar")||i.classList.contains("add-condition")||i.classList.contains("add-action")))return;this._tryCloseCurrent()}_setPredicate(e,i){if(!this._draft)return;let r={...this._draft.when};i==null?delete r[e]:r[e]=i,this._draft={...this._draft,when:r}}_renderConditionRow(e){let i=this._draft.when[e.name]??null,r=this._isOpen({kind:"condition",id:e.name}),s=Ot(e.name,i,{hass:this.hass,periods:this.periods,luxRanges:this.luxRanges});return l`
      <div class="slot ${r?"expanded":"collapsed"}" data-slot-id=${e.name}>
        <div class="summary" @click=${()=>this._toggleSlot({kind:"condition",id:e.name})}>
          <span class="summary-label"><strong>${X(this.hass,e.name)}:</strong> ${s}</span>
          <button
            class="remove"
            @click=${o=>{o.stopPropagation(),this._removeCondition(e.name)}}
            title=${d(this.hass,"ui.remove_condition","Remove condition")}
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
              @value-changed=${o=>this._setPredicate(e.name,o.detail.value)}
              @render-invalid-changed=${o=>this._onConditionInvalid(e.name,o.detail.error)}
            ></ambience-condition-input>

            ${this._showError&&this._validationError({kind:"condition",id:e.name})?l`
              <div class="error">${this._validationError({kind:"condition",id:e.name})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_visibleConditions(){if(!this._draft)return[];let e=this._draft.when,i=this.conditions.filter(a=>a.name in e&&e[a.name]!=null||this._open?.kind==="condition"&&this._open.id===a.name),r=new Set(this._addOrder),s=i.filter(a=>!r.has(a.name)),o=this._addOrder.map(a=>i.find(u=>u.name===a)).filter(a=>a!=null);return[...s,...o]}_unusedConditions(){let e=new Set(this._visibleConditions().map(i=>i.name));return this.conditions.filter(i=>!e.has(i.name)).sort((i,r)=>X(this.hass,i.name).localeCompare(X(this.hass,r.name)))}_addCondition(e){if(!e||this._open!==null&&!this._tryCloseCurrent())return;let i=Yd(e);i!=null&&this._draft&&!(e in this._draft.when)&&(this._draft={...this._draft,when:{...this._draft.when,[e]:i}}),this._addOrder=[...this._addOrder.filter(r=>r!==e),e],this._open={kind:"condition",id:e},this._showError=!1}_removeCondition(e){if(!this._draft)return;let i={...this._draft.when};delete i[e],this._draft={...this._draft,when:i},this._conditionError.delete(e),this._open?.kind==="condition"&&this._open.id===e&&(this._open=null,this._showError=!1)}_conditionDisabled(e){return e==="weather"&&!this.weatherConfig?.entity}_renderAddCondition(){let e=this._unusedConditions();return e.length===0?"":customElements.get("ha-form")?this._renderAddConditionHaForm(e):l`
      <div class="add-condition">
        <select class="add-condition" @change=${this._onAddCondition}>
          <option value="">${d(this.hass,"ui.add_condition","+ Add condition\u2026")}</option>
          ${e.map(i=>l`<option value=${i.name} ?disabled=${this._conditionDisabled(i.name)}>${X(this.hass,i.name)}</option>`)}
        </select>
      </div>
    `}_renderAddConditionHaForm(e){let i=d(this.hass,"ui.add_condition","+ Add condition\u2026"),r=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_CONDITION_PLACEHOLDER,label:i},...e.map(s=>({value:s.name,label:X(this.hass,s.name),disabled:this._conditionDisabled(s.name)}))]}}}];return l`
      <div class="add-condition">
        <ha-form
          .hass=${this.hass}
          .schema=${r}
          .data=${{add:S._ADD_CONDITION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddConditionHaForm}
        ></ha-form>
      </div>
    `}_addActionSlot(e){if(!this._draft||!e||this._open!==null&&!this._tryCloseCurrent())return;let i={service:e,entity_ids:[],params:{}},r=this._draft.actions.length;this._draft={...this._draft,actions:[...this._draft.actions,i]},this._open={kind:"action",idx:r},this._showError=!1}_actionOptionLabel(e){return e.label?.trim()?e.label:e.id}_renderAddAction(){return this.availableActions.length===0?l`
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
    `}_renderAddActionHaForm(){let e=d(this.hass,"ui.add_action","+ Add action\u2026"),i=[{name:"add",selector:{select:{mode:"dropdown",options:[{value:S._ADD_ACTION_PLACEHOLDER,label:e},...this.availableActions.map(r=>({value:r.id,label:this._actionOptionLabel(r)}))]}}}];return l`
      <div class="add-action">
        <ha-form
          .hass=${this.hass}
          .schema=${i}
          .data=${{add:S._ADD_ACTION_PLACEHOLDER}}
          .computeLabel=${()=>""}
          @value-changed=${this._onAddActionHaForm}
        ></ha-form>
      </div>
    `}_updateActionAt(e,i){if(!this._draft)return;let r=this._draft.actions.map((s,o)=>o===e?i(s):s);this._draft={...this._draft,actions:r}}_deleteAction(e){this._draft&&(this._draft={...this._draft,actions:this._draft.actions.filter((i,r)=>r!==e)},this._open?.kind==="action"&&this._open.idx===e&&(this._open=null))}_setActionTargets(e,i){this._updateActionAt(e,r=>({...r,entity_ids:i}))}_setActionParams(e,i){this._updateActionAt(e,r=>({...r,params:i}))}_onTargetModeChanged(e,i){this._serviceHasTarget.get(e)!==i&&(this._serviceHasTarget=new Map(this._serviceHasTarget).set(e,i))}_renderActionRow(e,i){let r=this.availableActions.find(a=>a.id===e.service),s=this._isOpen({kind:"action",idx:i}),o=os(e,{hass:this.hass,exposedActions:this.availableActions,schemas:this.schemas});return l`
      <div class="slot ${s?"expanded":"collapsed"}" data-slot-id="action-${i}">
        <div class="summary" @click=${()=>this._toggleSlot({kind:"action",idx:i})}>
          <span class="summary-label">${o}</span>
          <button class="remove" @click=${a=>{a.stopPropagation(),this._deleteAction(i)}} title=${d(this.hass,"ui.remove_action","Remove action")}>✕</button>
        </div>
        ${s?l`
          <div class="body">
            <ambience-action-slot
              .hass=${this.hass}
              .scope=${this._scope}
              .exposed=${r}
              .entityIds=${e.entity_ids}
              .excludeEntities=${Xn(this._draft?.actions??[],i)}
              .params=${e.params}
              @entity-ids-changed=${a=>{a.stopPropagation(),this._setActionTargets(i,a.detail.entityIds)}}
              @params-changed=${a=>{a.stopPropagation(),this._setActionParams(i,a.detail.params)}}
              @target-mode-changed=${a=>{a.stopPropagation(),this._onTargetModeChanged(e.service,a.detail.hasTarget)}}
            ></ambience-action-slot>

            ${this._showError&&this._validationError({kind:"action",idx:i})?l`
              <div class="error">${this._validationError({kind:"action",idx:i})}</div>
            `:""}
          </div>
        `:""}
      </div>
    `}_save(){if(!this._draft)return;if(this._nameError()!==null){this._showError=!0,this._open={kind:"name"};return}for(let i of Object.keys(this._draft.when))if(this._draft.when[i]!=null&&this._validationError({kind:"condition",id:i})!==null){this._showError=!0,this._open={kind:"condition",id:i};return}for(let i=0;i<this._draft.actions.length;i++)if(this._validationError({kind:"action",idx:i})!==null){this._showError=!0,this._open={kind:"action",idx:i};return}let e=Object.fromEntries(Object.entries(this._draft.when).filter(([,i])=>i!=null));this.dispatchEvent(new CustomEvent("save-scene",{detail:{scene:{...this._draft,when:e},scope:this._scope},bubbles:!0,composed:!0}))}_cancel(){this.dispatchEvent(new CustomEvent("cancel-scene",{bubbles:!0,composed:!0}))}render(){if(!this._draft)return l``;let e=this._visibleConditions();return l`
      <div class="modal" @click=${this._onModalClick}>
        <div class="content">
          ${this._renderNameSlot()}
          ${this._renderCategorySlot()}
          ${this._renderDestinationSlot()}

          <h3>${d(this.hass,"ui.when_heading","When")}</h3>
          ${e.map(i=>this._renderConditionRow(i))}
          ${this._renderAddCondition()}

          <h3>${d(this.hass,"ui.actions_heading","Actions")}</h3>
          ${this._draft.actions.map((i,r)=>this._renderActionRow(i,r))}
          ${this._renderAddAction()}
        </div>

        <div class="actions-bar">
          ${this.saveError?l`<div class="error save-error">${this.saveError}</div>`:""}
          <button class="secondary" @click=${this._cancel}>${d(this.hass,"ui.cancel","Cancel")}</button>
          <button class="primary" @click=${this._save}>${d(this.hass,"ui.save_scene","Save scene")}</button>
        </div>
      </div>
    `}};S.styles=[pi,y`
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
  `],S._ADD_CONDITION_PLACEHOLDER="__add_condition__",S._ADD_ACTION_PLACEHOLDER="__add_action__",c([m({type:Boolean,reflect:!0})],S.prototype,"open",2),c([m({attribute:!1})],S.prototype,"scene",2),c([m({attribute:!1})],S.prototype,"conditions",2),c([m({attribute:!1})],S.prototype,"periods",2),c([m({attribute:!1})],S.prototype,"luxRanges",2),c([m({attribute:!1})],S.prototype,"dayConfig",2),c([m({attribute:!1})],S.prototype,"weatherConfig",2),c([m({attribute:!1})],S.prototype,"availableActions",2),c([m({attribute:!1})],S.prototype,"categories",2),c([m({attribute:!1})],S.prototype,"schemas",2),c([m({attribute:!1})],S.prototype,"hass",2),c([m({attribute:!1})],S.prototype,"scope",2),c([m({attribute:!1})],S.prototype,"scopes",2),c([m({attribute:!1})],S.prototype,"takenNames",2),c([m({attribute:!1})],S.prototype,"saveError",2),c([g()],S.prototype,"_draft",2),c([g()],S.prototype,"_scope",2),c([g()],S.prototype,"_open",2),c([g()],S.prototype,"_showError",2),c([g()],S.prototype,"_addOrder",2),c([g()],S.prototype,"_serviceHasTarget",2),S=c([w("ambience-scene-editor")],S);function Qd(t,n,e,i){return n==="time_of_day"?ke(t,e,i):n==="weather"?lt(t,e):e}var Fi=y`
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
  .action-head { color: var(--primary-text-color, #ddd); }
  .action-block .entity { padding-left: 1rem; color: var(--secondary-text-color, #aaa); }
  .entity-link { cursor: pointer; color: var(--primary-color, #03a9f4); }
  .entity-link:hover { text-decoration: underline; }
  .entity-link:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
`;function lo(t,n){t.stopPropagation(),t.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:n},bubbles:!0,composed:!0}))}function Nr(t,n){return l`<span
    class="entity-link"
    role="button"
    tabindex="0"
    title="Show more info"
    @click=${i=>lo(i,t)}
    @keydown=${i=>{(i.key==="Enter"||i.key===" ")&&!i.repeat&&(i.preventDefault(),lo(i,t))}}
    >${n}</span
  >`}function co(t,n){return Nr(n,Ei(t,n))}var Xd=new Set(["occupancy","people","lux","state"]);function Jd(t,n,e,i,r){let s=Qd(t,n,e,i);if(!r?.length||!Xd.has(n))return s;let o=[],a=r.map(p=>({id:p,name:Ei(t,p)})).sort((p,f)=>f.name.length-p.name.length);for(let{id:p,name:f}of a)for(let _=0;_<=s.length;){let v=s.indexOf(f,_);if(v===-1)break;let x=v+f.length;if(!o.some(E=>v<E.end&&E.start<x)){o.push({start:v,end:x,id:p,name:f});break}_=v+1}if(o.length===0)return s;o.sort((p,f)=>p.start-f.start);let u=[],h=0;for(let p of o)p.start>h&&u.push(s.slice(h,p.start)),u.push(Nr(p.id,p.name)),h=p.end;return h<s.length&&u.push(s.slice(h)),l`${u}`}var Zd={has_time:"Periodic time check",switch:"Switch turned on",manual:"Manual apply",startup:"Startup",reloaded:"Reloaded",simulated:"Simulation"},ec={clock:"Time of day",sun:"Sun position",reapply:"Re-apply"};function ue(t){return t??"?"}function uo(t){if(t.kind==="entity")return`${t.entity_id} ${ue(t.old)} \u2192 ${ue(t.new)}`;if(t.kind==="duration")return t.entity_id?`${t.entity_id} ${ue(t.new)} for ${ue(t.detail)}`:`${ue(t.new)} for ${ue(t.detail)}`;let n=Zd[t.kind];if(n)return n;let e=ec[t.kind]??I(t.kind);return t.detail?`${e} ${t.detail}`:e}function tc(t){if(!Mi(t)||!t.entity_id)return l`${uo(t)}`;let n=Nr(t.entity_id,t.entity_id);return t.kind==="duration"?l`${n} ${ue(t.new)} for ${ue(t.detail)}`:l`${n} ${ue(t.old)} → ${ue(t.new)}`}function Mi(t){return t.kind==="entity"||t.kind==="duration"&&!!t.entity_id}function ho(t,n){let e=t.entity_id?n?.states?.[t.entity_id]:void 0,i=r=>r===null?"?":st(n,e,null,r);return{old:i(t.old),new:i(t.new)}}function ic(t,n){if(!Mi(t))return uo(t);let e=t.entity_id?Ei(n,t.entity_id):"?",i=ho(t,n);return t.kind==="duration"?`${e}: ${i.new} for ${t.detail??"?"}`:`${e}: ${i.old} \u2192 ${i.new}`}function rc(t,n){if(!Mi(t)||!t.entity_id)return l`${ic(t,n)}`;let e=co(n,t.entity_id),i=ho(t,n);return t.kind==="duration"?l`${e}: ${i.new} for ${t.detail??"?"}`:l`${e}: ${i.old} → ${i.new}`}var nc={acted:"applied",no_op:"blocked",debounced:"unchanged",no_match:"no match",skipped_switch_off:"skipped",skipped_scope_disabled:"skipped"};function sc(t){return nc[t]??t.replace(/_/g," ")}function po(t){let n=t.winner_name??"The matching scene";switch(t.outcome){case"acted":{let e=Or(t.actions.length,"action","actions"),i=fo(t.actions);return i?`Applied ${n} \u2014 ${e} on ${Or(i,"entity","entities")}.`:`Applied ${n} \u2014 ${e}.`}case"no_op":return`${n} matched but has no actions \u2014 it blocks lower scenes from applying. Nothing changed.`;case"debounced":return`${n} matched, but it's already applied \u2014 nothing was re-sent.`;case"no_match":return"No scene matched \u2014 nothing applied.";case"skipped_switch_off":return"Skipped \u2014 the category switch is off.";case"skipped_scope_disabled":return"Skipped \u2014 the scope is disabled.";default:return""}}function mo(t,n){return nt(t,n,()=>ri(t))}function oc(t,n,e,i){let r=Object.entries(t.params??{}).filter(([,o])=>o!=null&&o!=="").map(([o,a])=>`${Ht(o,t.service,e)}: ${Ce(n,a)}`).join(", "),s=mo(t.service,i);return r?`${s} \xB7 ${r}`:s}function fo(t){return t.reduce((n,e)=>n+(e.entity_ids?.length??0),0)}function Or(t,n,e){return`${t} ${t===1?n:e}`}function ac(t){return t==="skipped_switch_off"||t==="skipped_scope_disabled"}function lc(t,n,e){let i=t.index+1;return t.disabled?l`<div class="scene disabled">Scene #${i} ${t.name??"\u2014"}: disabled</div>`:t.evaluated?l`
    <div class="scene ${t.matched?"won":""}">Scene #${i} ${t.name??"\u2014"}: ${t.matched?"\u2713 matched":"\u2717 no match"}</div>
    ${t.predicates.map(r=>l`
        <div class="pred ${r.passed?"pass":"fail"}" style="padding-left:1rem">
          ${r.passed?"\u2713":"\u2717"} ${X(n,r.condition_key)}${r.detail?l` <span class="dim">[${Jd(n,r.condition_key,r.detail,e,r.entity_ids)}]</span>`:k}
        </div>`)}
  `:l`<div class="scene skipped">Scene #${i} ${t.name??"\u2014"}: not reached</div>`}function ji(t,n,e,i,r,s={},o){let a=t.actions.map(f=>mo(f.service,o)).join(", "),u=fo(t.actions),h=t.explanation!==null||t.actions.length>0||ac(t.outcome),p=f=>{(f.key==="Enter"||f.key===" ")&&!f.repeat&&(f.preventDefault(),e())};return l`
    <div class="eval">
      <div
        class="outcome ${t.outcome}${h?" clickable":""}"
        role=${h?"button":k}
        tabindex=${h?"0":k}
        aria-expanded=${h?n:k}
        @click=${h?e:void 0}
        @keydown=${h?p:void 0}
      >
        <span class="label">${sc(t.outcome)}</span>
        <span class="ts">${t.timestamp?new Date(t.timestamp).toLocaleTimeString():""}</span>
      </div>
      <div class="eval-body">
        <div class="cause-line">Trigger: ${rc(t.cause,i)}</div>
        ${t.winner_name?l`<div class="won">Won: <span class="name">${t.winner_name}</span></div>`:k}
        ${t.actions.length?l`<div class="action-summary">→ ${a}
              ${u?l`<span class="n">· ${Or(u,"entity","entities")}</span>`:k}</div>`:n?k:l`<div class="action-summary">${po(t)}</div>`}
      </div>
      ${n?dc(t,i,r,s,o):k}
    </div>
  `}function dc(t,n,e,i,r){let s=po(t),o=Mi(t.cause);return l`
    <div class="why">
      ${o?l`<div class="raw-trigger">Trigger: ${tc(t.cause)}</div>`:k}
      ${s?l`<div class="outcome-summary">${s}</div>`:k}
      ${t.explanation?l`<div class="section">
            <div class="section-title">Scene evaluation</div>
            <div class="scenes">${t.explanation.scenes.map(a=>lc(a,n,i))}</div>
          </div>`:k}
      ${t.actions.length?l`<div class="section">
            <div class="section-title">Actions taken</div>
            ${t.actions.map(a=>l`<div class="action-block">
                <div class="action-head">${oc(a,n,e,r)}</div>
                ${(a.entity_ids??[]).map(u=>l`<div class="entity">${co(n,u)}</div>`)}
              </div>`)}
          </div>`:k}
    </div>
  `}var He=class{constructor(n,e){this._onKeydown=n=>{this._host.open&&n.key==="Escape"&&this._close()};this._onBackdrop=()=>{this._host.open&&this._close()};this._host=n,this._close=e,n.addController(this)}hostConnected(){document.addEventListener("keydown",this._onKeydown),this._host.addEventListener("click",this._onBackdrop)}hostDisconnected(){document.removeEventListener("keydown",this._onKeydown),this._host.removeEventListener("click",this._onBackdrop)}};var N=class extends b{constructor(){super();this.exposedActions=[];this.category="";this.categoryName=null;this.open=!1;this._records=[];this._schemas={};this._expanded=new Set;this._loading=!0;this._error="";this._hasNew=!1;new He(this,()=>this._onClose())}disconnectedCallback(){super.disconnectedCallback(),this._stopPoll()}_startPoll(){this._poll||(this._poll=setInterval(()=>this._checkNew(),5e3))}_stopPoll(){this._poll&&(clearInterval(this._poll),this._poll=void 0)}updated(e){e.has("open")&&(this.open?this._startPoll():this._stopPoll()),this.open&&(e.has("open")||e.has("category")||e.has("scope"))&&this._load()}_mine(e){return e.filter(i=>i.scope_kind===this.scope.scope_kind&&i.scope_id===this.scope.scope_id&&i.category===this.category)}async _load(){this._error="",this._loading=!0,this._hasNew=!1,this._expanded=new Set;try{let e=await ar(this.hass);if(!this.isConnected)return;this._records=this._mine(e),this._loading=!1,this._loadSchemas()}catch(e){this._error=e.message||String(e),this._loading=!1}}async _loadSchemas(){let e=[...new Set(this._records.flatMap(s=>s.actions.map(o=>o.service)))].filter(s=>!(s in this._schemas));if(e.length===0)return;let i=await Promise.all(e.map(async s=>{try{return[s,await Ee(this.hass,s)]}catch{return null}}));if(!this.isConnected)return;let r={...this._schemas};for(let s of i)s&&(r[s[0]]=s[1]);this._schemas=r}async _checkNew(){if(!(!this.open||!this.isConnected||document.visibilityState!=="visible"))try{let i=this._mine(await ar(this.hass))[0]?.timestamp??null,r=this._records[0]?.timestamp??null;i&&(!r||i>r)&&(this._hasNew=!0)}catch{}}_toggle(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}async _download(){try{await zn(this.hass,this.scope,this.category)}catch(e){this._error=e.message||String(e)}}async _clear(){try{await jn(this.hass),await this._load()}catch(e){this._error=e.message||String(e)}}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){if(!this.open)return k;let e=this.categoryName??this.category;return l`
      <div class="modal" role="dialog" aria-modal="true" @click=${i=>i.stopPropagation()}>
        <div class="header">
          <h3>${e}</h3>
          <button class="refresh ${this._hasNew?"has-new":""}" @click=${()=>this._load()}>
            ${this._hasNew?`\u25CF ${d(this.hass,"ui.new_traces_refresh","New traces \u2014 refresh")}`:d(this.hass,"ui.refresh","Refresh")}
          </button>
          <button class="clear" @click=${this._clear}>
            ${d(this.hass,"ui.clear_traces","Clear")}
          </button>
          <button class="download" @click=${this._download}>
            ${d(this.hass,"ui.download_diagnostics","Download diagnostics")}
          </button>
          <button class="close" @click=${this._onClose} aria-label=${d(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          ${this._error?l`<p class="error">${this._error}</p>`:this._loading?l`<p class="empty">${d(this.hass,"ui.loading","Loading\u2026")}</p>`:this._records.length===0?l`<p class="empty">${d(this.hass,"ui.no_traces_yet","No traces for this category yet.")}</p>`:l`<div class="list">${this._records.map((i,r)=>{let s=`${i.event_id??r}|${i.timestamp??""}`;return ji(i,this._expanded.has(s),()=>this._toggle(s),this.hass,this._schemas,this.periods?.custom??{},this.exposedActions)})}</div>`}
        </div>
      </div>
    `}};N.styles=[Fi,y`
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
    `],c([m({attribute:!1})],N.prototype,"hass",2),c([m({attribute:!1})],N.prototype,"periods",2),c([m({attribute:!1})],N.prototype,"exposedActions",2),c([m({attribute:!1})],N.prototype,"scope",2),c([m()],N.prototype,"category",2),c([m()],N.prototype,"categoryName",2),c([m({type:Boolean,reflect:!0})],N.prototype,"open",2),c([g()],N.prototype,"_records",2),c([g()],N.prototype,"_schemas",2),c([g()],N.prototype,"_expanded",2),c([g()],N.prototype,"_loading",2),c([g()],N.prototype,"_error",2),c([g()],N.prototype,"_hasNew",2),N=c([w("ambience-traces-modal")],N);var cc={time:"mdi:clock-outline",sun:"mdi:weather-sunny"},G=class extends b{constructor(){super(...arguments);this.scopeName="";this.scenes=[];this.open=!1;this._triggers=[];this._opaque=!1;this._loading=!1;this._error="";this._loadSeq=0}willUpdate(e){super.willUpdate?.(e),this.open&&(e.has("open")||e.has("scenes")||e.has("scope"))&&((e.has("open")||e.has("scope"))&&(this._triggers=[],this._opaque=!1),this._load())}get _scopeId(){return this.scope.kind==="house"?null:this.scope.id}async _load(){let e=++this._loadSeq;this._loading=!0,this._error="";try{let i=await $n(this.hass,this.scope.kind,this._scopeId);if(e!==this._loadSeq)return;this._triggers=i.triggers,this._opaque=i.opaque}catch(i){if(e!==this._loadSeq)return;this._error=i.message||String(i)}finally{e===this._loadSeq&&(this._loading=!1)}}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_openMoreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_entityName(e){return j(this.hass,e)}get _sortedTriggers(){let e=s=>this._entityName(s.entity_id).toLowerCase(),i=this._triggers.filter(s=>s.kind==="entity").sort((s,o)=>e(s).localeCompare(e(o))),r=this._triggers.filter(s=>s.kind!=="entity");return[...i,...r]}_sunPart(e){let i=$e(this.hass,e.anchor);if(e.offset===0)return i;let r=d(this.hass,"ui.unit_min","min");return`${i} ${e.offset>0?"+":""}${e.offset} ${r}`}_rowContent(e){switch(e.kind){case"entity":return{title:this._entityName(e.entity_id),detail:e.entity_id};case"time":{let i=e.clocks.map(r=>`${String(r.hour).padStart(2,"0")}:${String(r.minute).padStart(2,"0")}`);return e.date_rollover&&i.push(d(this.hass,"ui.auto_trigger_date_rollover","Local midnight (date rollover)")),e.has_time&&i.push(d(this.hass,"ui.auto_trigger_periodic","periodic re-check")),{title:d(this.hass,"ui.auto_trigger_group_time","Time"),detail:i.join(", ")}}case"sun":return{title:d(this.hass,"ui.auto_trigger_group_sun","Sun"),detail:e.suns.map(i=>this._sunPart(i)).join(", ")}}}_renderRowIcon(e){return e.kind==="entity"?At(this.hass,e.entity_id):l`<ha-icon
      class="row-icon"
      icon=${cc[e.kind]??ur}
    ></ha-icon>`}_moreInfoEntity(e){return e.kind==="entity"?e.entity_id:e.kind==="sun"&&this.hass?.states?.["sun.sun"]?"sun.sun":null}_renderRow(e){let{title:i,detail:r}=this._rowContent(e),s=this._moreInfoEntity(e);return l`
      <li
        data-test=${`trigger-ro-${e.key}`}
        class=${s?"clickable":""}
        role=${s?"button":k}
        tabindex=${s?"0":k}
        @click=${s?()=>this._openMoreInfo(s):k}
        @keydown=${s?o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),this._openMoreInfo(s))}:k}
      >
        ${this._renderRowIcon(e)}
        <div class="row-text">
          <div class="row-title">${i}</div>
          ${r?l`<div class="row-detail">${r}</div>`:""}
        </div>
      </li>
    `}render(){if(!this.open)return k;let e=d(this.hass,"ui.auto_triggers_section","Auto-triggers");return l`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>${e}${this.scopeName?` \u2014 ${this.scopeName}`:""}</h3>
          <button class="close" @click=${this._close} aria-label=${d(this.hass,"ui.close","Close")}>✕</button>
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
    `}};G.styles=y`
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
  `,c([m({attribute:!1})],G.prototype,"hass",2),c([m({attribute:!1})],G.prototype,"scope",2),c([m()],G.prototype,"scopeName",2),c([m({attribute:!1})],G.prototype,"scenes",2),c([m({type:Boolean,reflect:!0})],G.prototype,"open",2),c([g()],G.prototype,"_triggers",2),c([g()],G.prototype,"_opaque",2),c([g()],G.prototype,"_loading",2),c([g()],G.prototype,"_error",2),G=c([w("ambience-auto-triggers-modal")],G);function go(t,n){return n==="not_home"?d(t,"ui.away","Away"):n==="home"?d(t,"ui.home","Home"):I(n)}function _o(t){return{state:t.live_state??"",attributes:Object.fromEntries(t.attributes.map(n=>[n.name,n.live_value==null?"":String(n.live_value)])),for:{h:0,m:0,s:0}}}function zi(t){return String(t).padStart(2,"0")}function vo(t){return`${t.getFullYear()}-${zi(t.getMonth()+1)}-${zi(t.getDate())}`}function yo(t){return`${zi(t.getHours())}:${zi(t.getMinutes())}`}var P=class extends b{constructor(){super();this.exposedActions=[];this.category="";this.categoryName=null;this.open=!1;this._knobs=[];this._hasTime=!1;this._loading=!0;this._error="";this._values={};this._verdicts={};this._date="";this._time="";this._result=null;this._expanded=!1;new He(this,()=>this._onClose())}updated(e){this.open&&(e.has("open")||e.has("category")||e.has("scope"))&&this._load()}_vkey(e){return`${e.condition}:${e.key}`}async _load(){this._error="",this._loading=!0,this._result=null,this._expanded=!1;let e=new Date;this._date=vo(e),this._time=yo(e);try{let i=await Wn(this.hass,this.scope,this.category);if(!this.isConnected)return;this._knobs=i.knobs,this._hasTime=i.has_time;let r={},s={};for(let o of i.knobs)o.kind==="entity"?r[o.entity_id]=_o(o):s[this._vkey(o)]=o.live_value;this._values=r,this._verdicts=s,this._loading=!1}catch(i){this._error=i.message||String(i),this._loading=!1}}_setState(e,i){this._values={...this._values,[e]:{...this._values[e],state:i}}}_setAttr(e,i,r){let s=this._values[e];this._values={...this._values,[e]:{...s,attributes:{...s.attributes,[i]:r}}}}_setFor(e,i,r){let s=this._values[e],o=Number.isFinite(r)&&r>0?Math.trunc(r):0;this._values={...this._values,[e]:{...s,for:{...s.for,[i]:o}}}}_setVerdict(e,i){this._verdicts={...this._verdicts,[e]:i}}_resetWhen(){let e=new Date;this._date=vo(e),this._time=yo(e)}_resetEntity(e){this._values={...this._values,[e.entity_id]:_o(e)}}_resetVerdict(e){this._verdicts={...this._verdicts,[this._vkey(e)]:e.live_value}}_buildOverrides(){let e={};for(let i of this._knobs){if(i.kind!=="entity")continue;let r=this._values[i.entity_id];if(!r)continue;let s={};for(let a of i.attributes){let u=r.attributes[a.name];if(!(u===void 0||u===""))if(a.control==="number"){let h=Number(u);Number.isNaN(h)||(s[a.name]=h)}else s[a.name]=u}let o={attributes:s};r.state!==""&&(o.state=r.state),(r.for.h||r.for.m||r.for.s)&&(o.for=r.for),(o.state!==void 0||o.for!==void 0||Object.keys(s).length>0)&&(e[i.entity_id]=o)}return e}_buildVerdicts(){let e={};for(let i of this._knobs)i.kind==="verdict"&&(e[i.condition]||(e[i.condition]={}),e[i.condition][i.key]=this._verdicts[this._vkey(i)]??i.live_value);return e}async _run(){this._error="";let e=new Date(`${this._date}T${this._time}`);if(!this._date||!this._time||Number.isNaN(e.getTime())){this._error=d(this.hass,"ui.invalid_datetime","Enter a valid date and time.");return}let i=e.toISOString();try{this._result=await Un(this.hass,this.scope,this.category,i,this._buildOverrides(),this._buildVerdicts()),this._expanded=!1}catch(r){this._error=r.message||String(r)}}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?l`
      <div class="modal" role="dialog" aria-modal="true" @click=${e=>e.stopPropagation()}>
        <div class="header">
          <h3>${d(this.hass,"ui.simulate_title","Simulate")} · ${this.categoryName??this.category}</h3>
          <button class="close" @click=${this._onClose} aria-label=${d(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          ${this._error?l`<p class="error">${this._error}</p>`:k}
          ${this._loading?l`<p>${d(this.hass,"ui.loading","Loading\u2026")}</p>`:l`
            ${this._hasTime?l`
              <p class="sec-title">${d(this.hass,"ui.when_heading","When")}</p>
              <div class="when">
                <input type="date" .value=${this._date}
                  @change=${e=>this._date=e.target.value} />
                <input type="time" .value=${this._time}
                  @change=${e=>this._time=e.target.value} />
                <button class="reset" title=${d(this.hass,"ui.reset_to_now","Reset to now")} aria-label=${d(this.hass,"ui.reset_to_now","Reset to now")}
                  @click=${()=>this._resetWhen()}>↺</button>
                <span class="hint">${d(this.hass,"ui.simulate_when_hint","drives sun, time-of-day, weekday & workday")}</span>
              </div>`:k}
            ${this._knobs.length?l`
              <p class="sec-title">${d(this.hass,"ui.simulate_inputs_heading","Inputs this category depends on")}</p>
              ${this._knobs.map(e=>e.kind==="entity"?this._renderEntity(e):this._renderVerdict(e))}`:k}
            <div class="run-row"><button class="runbtn" @click=${()=>void this._run()}>${d(this.hass,"ui.simulate_button","Simulate")} ▸</button></div>
            ${this._result?l`<div class="result">${ji(this._result,this._expanded,()=>this._expanded=!this._expanded,this.hass,void 0,this.periods?.custom??{},this.exposedActions)}</div>`:k}
          `}
        </div>
      </div>`:k}_renderEntity(e){let i=this._values[e.entity_id],r=e.attributes.length>0;return l`
      <div class="row ${r?"has-attrs":""}">
        ${At(this.hass,e.entity_id)}
        <div class="row-text">
          <div class="row-title">${j(this.hass,e.entity_id)}</div>
          <div class="row-detail">${e.entity_id}</div>
        </div>
        <div class="row-ctrl">
          ${this._renderControl(e,i?.state??"")}
          ${this._renderFor(e,i?.for??{h:0,m:0,s:0})}
          <button class="reset" data-reset=${e.entity_id} title=${d(this.hass,"ui.reset_to_live","Reset to live")}
            @click=${()=>this._resetEntity(e)}>↺</button>
        </div>
      </div>
      ${e.attributes.map((s,o)=>l`
        <div class="row attr ${o===e.attributes.length-1?"last-attr":""}">
          <div class="row-text"><div class="row-title">${go(this.hass,s.name)}</div></div>
          <div class="row-ctrl">
            <input class=${s.control==="number"?"num":""}
              type=${s.control==="number"?"number":"text"}
              data-attr=${`${e.entity_id}:${s.name}`}
              .value=${i?.attributes[s.name]??""}
              @input=${a=>this._setAttr(e.entity_id,s.name,a.target.value)} />
            <button class="reset" title=${d(this.hass,"ui.reset_to_live","Reset to live")}
              @click=${()=>this._resetEntity(e)}>↺</button>
          </div>
        </div>`)}
    `}_renderControl(e,i){if(e.control==="select")return l`<select data-entity=${e.entity_id} .value=${i}
        @change=${s=>this._setState(e.entity_id,s.target.value)}>
        ${(e.options??[i]).map(s=>l`<option value=${s} ?selected=${s===i}>${go(this.hass,s)}</option>`)}
      </select>`;let r=e.control==="number"?"number":"text";return l`<input class=${e.control==="number"?"num":""} type=${r} data-entity=${e.entity_id}
      .value=${i}
      @input=${s=>this._setState(e.entity_id,s.target.value)} />`}_renderFor(e,i){let r={h:"hours",m:"minutes",s:"seconds"},s=j(this.hass,e.entity_id),o=a=>l`<input class="for-num" type="number" min="0"
      aria-label=${`${s} \u2014 held for, ${r[a]}`}
      data-for=${`${e.entity_id}:${a}`} .value=${String(i[a])}
      @change=${u=>this._setFor(e.entity_id,a,Number(u.target.value))} />`;return l`<span class="for-ctrl" title="How long it has held this state (h:m:s)">
      <span class="for-label">${d(this.hass,"ui.for_label","For")}</span>${o("h")}<span>:</span>${o("m")}<span>:</span>${o("s")}
    </span>`}_renderVerdict(e){let i=this._vkey(e),r=this._verdicts[i]??e.live_value,s=e.entity_id?j(this.hass,e.entity_id):e.label,o=e.entity_id?At(this.hass,e.entity_id):l`<ha-icon class="row-icon" icon="mdi:code-braces"></ha-icon>`;return l`
      <div class="row">
        ${o}
        <div class="row-text">
          <div class="row-title">${s}</div>
          ${e.entity_id?l`<div class="row-detail">${e.entity_id}</div>`:k}
        </div>
        <div class="row-ctrl">
          <select data-verdict=${i} .value=${String(r)}
            @change=${a=>this._setVerdict(i,a.target.value==="true")}>
            <option value="true" ?selected=${r}>${d(this.hass,"ui.true_label","True")}</option>
            <option value="false" ?selected=${!r}>${d(this.hass,"ui.false_label","False")}</option>
          </select>
          <button class="reset" title=${d(this.hass,"ui.reset_to_live","Reset to live")} @click=${()=>this._resetVerdict(e)}>↺</button>
        </div>
      </div>`}};P.styles=[Fi,Jn,y`
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
    `],c([m({attribute:!1})],P.prototype,"hass",2),c([m({attribute:!1})],P.prototype,"periods",2),c([m({attribute:!1})],P.prototype,"exposedActions",2),c([m({attribute:!1})],P.prototype,"scope",2),c([m()],P.prototype,"category",2),c([m()],P.prototype,"categoryName",2),c([m({type:Boolean,reflect:!0})],P.prototype,"open",2),c([g()],P.prototype,"_knobs",2),c([g()],P.prototype,"_hasTime",2),c([g()],P.prototype,"_loading",2),c([g()],P.prototype,"_error",2),c([g()],P.prototype,"_values",2),c([g()],P.prototype,"_verdicts",2),c([g()],P.prototype,"_date",2),c([g()],P.prototype,"_time",2),c([g()],P.prototype,"_result",2),c([g()],P.prototype,"_expanded",2),P=c([w("ambience-simulator-modal")],P);function uc(t){let n=Math.floor(t/3600),e=Math.floor(t%3600/60),i=t%60,r=s=>String(s).padStart(2,"0");return n>0?`${n}:${r(e)}:${r(i)}`:`${e}:${r(i)}`}var Ir=1024;function hc(t,n,e){if(t!==void 0&&n!==void 0)return Math.floor((t+n)/2);let i=e.map(r=>r.priority??0);return t===void 0&&n===void 0?Ir:t===void 0?Math.max(...i)+Ir:Math.min(...i)-Ir}var Q=class extends b{constructor(){super(...arguments);this._store=new A(this);this._expanded=new Set(mn());this._conditionsHintDismissed=!1;this._editing=null;this._sceneEditorError="";this._savingScene=!1;this._viewingTraces=null;this._viewingSimulator=null;this._autoTriggers=null;this.filterCategory=""}async connectedCallback(){super.connectedCallback(),this._conditionsHintDismissed=gn(),await this._store.loadStatic(),await Promise.all([this._store.refreshAreas(),this._store.refreshFloors(),this._store.refreshHouse(),this._store.refreshSwitches()]),await this._store.subscribe(e=>this._onScopeRemoved(e))}_onScopeRemoved(e){let i=O(e),r=new Set(this._expanded);r.delete(i),this._setExpanded(r),this._editing&&O(this._editing.scope)===i&&(this._editing=null)}_setExpanded(e){this._expanded=e,fn([...e])}_toggleExpand(e){let i=O(e),r=new Set(this._expanded);r.has(i)?r.delete(i):r.add(i),this._setExpanded(r)}_addScene(e,i){let r=this._store.getConfig(e);r&&(this._sceneEditorError="",this._editing={scope:e,index:r.scenes.length,isNew:!0,category:i})}_editScene(e,i){this._sceneEditorError="",this._editing={scope:e,index:i.detail.index,isNew:!1}}_duplicateScene(e,i){let r=this._store.getConfig(e);if(!r)return;let s=r.scenes[i.detail.index];if(!s)return;let o=Rt(JSON.parse(JSON.stringify(s)));this._sceneEditorError="",this._editing={scope:e,index:r.scenes.length,isNew:!0,seed:o}}_deleteScene(e,i){let r=this._store.getConfig(e);if(!r)return;let s=r.scenes.filter((o,a)=>a!==i.detail.index);this._store.mutate(e,{...r,scenes:s})}_reorderScenes(e,i){let r=this._store.getConfig(e);if(!r)return;let{from:s,to:o}=i.detail,a=r.scenes[s];if(!a||r.scenes[o]?.category!==a.category)return;let u=[...r.scenes];u.splice(s,1),u.splice(o,0,a);let h=E=>u[E]&&u[E].category===a.category,p=o-1;for(;p>=0&&!h(p);)p--;let f=o+1;for(;f<u.length&&!h(f);)f++;let _=p>=0?u[p].priority:void 0,v=f<u.length?u[f].priority:void 0,x=hc(_,v,r.scenes.filter(E=>E.category===a.category));u[o]={...a,priority:x,pinned:!0},this._store.mutate(e,{...r,scenes:u})}_unpinScene(e,i){let r=this._store.getConfig(e);if(!r)return;let s=r.scenes.map((o,a)=>a===i.detail.index?{...o,pinned:!1}:o);this._store.mutate(e,{...r,scenes:s})}_toggleSceneEnabled(e,i){let r=this._store.getConfig(e);if(!r)return;let s=r.scenes.map((o,a)=>{if(a!==i.detail.index)return o;if(i.detail.enabled){let u={...o};return delete u.enabled,u}return{...o,enabled:!1}});this._store.mutate(e,{...r,scenes:s})}async _saveScene(e){if(this._savingScene)return;let i=this._editing;if(!i)return;let{scene:r,scope:s}=e.detail;this._savingScene=!0,this._sceneEditorError="";try{if(O(s)===O(i.scope)){let h=this._store.getConfig(s);if(!h)return;let p=[...h.scenes];i.isNew?p.push(r):p[i.index]=r,await this._store.mutate(s,{...h,scenes:p})?this._editing=null:this._sceneEditorError=this._takeError();return}let o=Rt(r),a=this._store.getConfig(s);if(!a)return;if(!await this._store.mutate(s,{...a,scenes:[...a.scenes,o]})){this._sceneEditorError=this._takeError();return}if(this._editing=null,!i.isNew){let h=this._store.getConfig(i.scope);if(h){let p=h.scenes.filter((f,_)=>_!==i.index);await this._store.mutate(i.scope,{...h,scenes:p})}}}finally{this._savingScene=!1}}_takeError(){let e=this._store.error;return this._store.error="",e}async _callApi(e){this._store.error="";try{await e()}catch(i){this._store.error=i.message||String(i)}}_applyScenes(e,i){return this._callApi(()=>Sn(this.hass,e,i))}_runSceneActions(e,i){return this._callApi(()=>Cn(this.hass,e,i.detail.index))}_cancelScene(){this._sceneEditorError="",this._editing=null}_onScopeMenu(e,i,r,s){s==="run"?this._applyScenes(e):s==="auto"&&(this._autoTriggers={scope:e,name:i})}_showTraces(e,i){let r=this._store.categories.find(s=>s.id===i);this._viewingTraces={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:i,categoryName:r?.name??null}}_showSimulator(e,i){let r=this._store.categories.find(s=>s.id===i);this._viewingSimulator={scope:{scope_kind:e.kind,scope_id:"id"in e?e.id:null},category:i,categoryName:r?.name??null}}_defaultCategoryId(){return this.filterCategory!==""?this.filterCategory:[...this._store.categories].sort((i,r)=>i.name.localeCompare(r.name))[0]?.id??""}get _editingScene(){return this._editing?this._editing.seed?this._editing.seed:this._editing.isNew?{when:{},actions:[],category:this._editing.category??this._defaultCategoryId()}:this._store.getConfig(this._editing.scope)?.scenes[this._editing.index]??null:null}get _editorConditions(){return this._editing?this._store.conditions.slice().sort((e,i)=>i.priority-e.priority):[]}get _takenSceneNames(){let e=new Map,i=this._editing,r=(s,o)=>{if(!o)return;let a=!!i&&!i.isNew&&O(i.scope)===O(s);o.scenes.forEach((u,h)=>{if(a&&h===i.index)return;let p=u.name?.trim().toLowerCase();if(!p)return;let f=_i(s,u.category),_=e.get(f);_||(_=new Set,e.set(f,_)),_.add(p)})};r({kind:"house"},this._store.house);for(let s of this._store.floors)r({kind:"floor",id:s.floor_id},this._store.floorConfigs.get(s.floor_id));for(let s of this._store.areas)r({kind:"area",id:s.area_id},this._store.areaConfigs.get(s.area_id));return e}get _scopeOptions(){return[{scope:{kind:"house"},label:d(this.hass,"ui.scope_house","House")},...this._store.floors.map(e=>({scope:{kind:"floor",id:e.floor_id},label:e.name})),...this._store.areas.map(e=>({scope:{kind:"area",id:e.area_id},label:e.name}))]}_matchingSceneCount(e){return this.filterCategory===""?e.scenes.length:e.scenes.filter(i=>i.category===this.filterCategory).length}_summary(e){if(e.scenes.length===0)return d(this.hass,"ui.not_configured","not configured");let i=this._matchingSceneCount(e),r=i===1?d(this.hass,"ui.scene_singular","scene"):d(this.hass,"ui.scene_plural","scenes");return`${i} ${r}`}get _weatherUnconfigured(){return!this._store.weatherConfig||this._store.weatherConfig.entity==null}get _workdayUnconfigured(){let e=this._store.dayConfig;return!e||e.workday_sensor==null&&e.workday_calendar==null}get _conditionsUnconfigured(){return this._weatherUnconfigured||this._workdayUnconfigured}_conditionsHintText(){let e=this._weatherUnconfigured,i=this._workdayUnconfigured;return e&&i?{title:d(this.hass,"ui.conditions_hint_title","Optional: set up Workday & Weather"),body:d(this.hass,"ui.conditions_hint_body","Configure Workday and Weather in Conditions to use them in your scene conditions.")}:i?{title:d(this.hass,"ui.conditions_hint_title_workday","Optional: set up Workday"),body:d(this.hass,"ui.conditions_hint_body_workday","Configure Workday in Conditions to use it in your scene conditions.")}:{title:d(this.hass,"ui.conditions_hint_title_weather","Optional: set up Weather"),body:d(this.hass,"ui.conditions_hint_body_weather","Configure Weather in Conditions to use it in your scene conditions.")}}_openSettings(e){this.dispatchEvent(new CustomEvent("ambience-open-settings",{detail:{tab:e},bubbles:!0,composed:!0}))}_dismissConditionsHint(){this._conditionsHintDismissed=!0,_n()}_renderBanners(){if(!this._store.staticLoaded)return"";if(this._store.actions.length===0)return l`
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
      `;if(!this._conditionsHintDismissed&&this._conditionsUnconfigured){let{title:e,body:i}=this._conditionsHintText();return l`
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
      `}return""}_orderedScopeRows(){let e=[{scope:{kind:"house"},name:d(this.hass,"ui.scope_house","House"),cfg:this._store.house,rowClass:"house"}];for(let s of this._store.floors){let o=this._store.floorConfigs.get(s.floor_id);o&&e.push({scope:{kind:"floor",id:s.floor_id},name:s.name,cfg:o,rowClass:"floor"})}for(let s of this._store.areas){let o=this._store.areaConfigs.get(s.area_id);o&&e.push({scope:{kind:"area",id:s.area_id},name:s.name,cfg:o,rowClass:"area"})}let i=[],r=[];for(let s of e)(s.cfg.enabled===!1?r:i).push(s);return[...i,...r]}_isSwitchedOff(e){let i=this._store.switchEntityIds.get(O(e));return i?this.hass.states?.[i]?.state==="off":!1}_renderAreasPlaceholder(){return this._store.areasLoaded?!this._store.error&&this._store.areas.length===0?l`<li>
        <p class="empty">
          ${d(this.hass,"ui.no_areas","No areas found in Home Assistant.")}
        </p>
      </li>`:"":l`<li>
        <p class="empty" data-test="areas-loading">
          <span class="spinner" aria-hidden="true"></span>
          ${d(this.hass,"ui.loading","Loading\u2026")}
        </p>
      </li>`}render(){return l`
      ${this._store.error?l`<p class="error">${this._store.error}</p>`:""}
      ${this._renderBanners()}
      <ul>
        ${Gn(this._orderedScopeRows(),e=>O(e.scope),e=>this._renderScopeRow(e.scope,e.name,e.cfg,e.rowClass))}
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
        .scopeName=${this._autoTriggers?.name??""}
        .scenes=${this._autoTriggers?this._store.getConfig(this._autoTriggers.scope)?.scenes??[]:[]}
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
    `}_renderScopeRow(e,i,r,s){let o=this._expanded.has(O(e)),a=e.kind==="house"?"":e.id,u=this._isSwitchedOff(e)?"off":this._matchingSceneCount(r)===0?"empty":"",h=r.enabled===!1;return l`
      <li class="scope-row ${s} ${h?"scope-disabled":""}" data-id=${a}>
        <div
          class="scope-header ${o?"open":""} ${u}"
          @click=${()=>this._toggleExpand(e)}
        >
          <span class="chevron ${o?"open":""}">▶</span>
          <ha-icon class="scope-icon" icon=${Pt(e,this.hass)}></ha-icon>
          <span class="scope-name">${i}</span>
          <span class="scope-summary">${this._summary(r)}</span>
          ${this._renderPauseIcon(e,r)}
          ${this._renderScopeSwitch(e,r)}
          <ambience-kebab-menu
            data-test="scope-kebab"
            .hass=${this.hass}
            .items=${[{id:"run",label:d(this.hass,"ui.run","Run"),icon:"mdi:play"},{id:"auto",label:d(this.hass,"ui.auto_triggers_section","Auto-triggers"),icon:"mdi:flash-auto"}]}
            @menu-action=${p=>this._onScopeMenu(e,i,r,p.detail.id)}
            @click=${p=>p.stopPropagation()}
          ></ambience-kebab-menu>
        </div>
        ${o?l`
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
    `}_pauseRemaining(e){let i=this.hass.states?.[e],r=i?.attributes?.off_at,s=Number(i?.attributes?.auto_on_delay_seconds??0);if(!r||!s)return 0;let o=(Date.now()-new Date(r).getTime())/1e3;return Math.max(0,Math.round(s-o))}_renderPauseIcon(e,i){if(i.enabled===!1)return"";let r=this._store.switchEntityIds.get(O(e));if(!r)return"";let s=this.hass.states?.[r]?.state==="off",o=u=>{u.stopPropagation(),this.hass.callService?.("switch",s?"turn_on":"turn_off",{entity_id:r})};if(!s)return l`<button
        class="scope-pause"
        data-test="scope-pause"
        title=${d(this.hass,"ui.pause_scope","Pause this scope")}
        @click=${o}
      >
        <ha-icon icon="mdi:timer-outline"></ha-icon>
      </button>`;let a=this._pauseRemaining(r);return l`<button
      class="scope-pause paused"
      data-test="scope-pause"
      title=${d(this.hass,"ui.resume_scope","Resume now")}
      @click=${o}
    >
      <ha-icon icon="mdi:timer"></ha-icon>
      <span class="countdown">${uc(a)}</span>
    </button>`}_renderScopeSwitch(e,i){let r=i.enabled!==!1,s=a=>a.stopPropagation(),o=async a=>{a.stopPropagation();try{await Hn(this.hass,e,!r),await Promise.all([this._store.reloadScope(e),this._store.refreshSwitches()])}catch(u){this._store.error=u.message||String(u)}};return customElements.get("ha-switch")?l`<ha-switch
        class="scope-switch"
        data-test="scope-switch"
        .checked=${ht(r)}
        @click=${s}
        @change=${o}
      ></ha-switch>`:l`<input
      class="scope-switch"
      data-test="scope-switch"
      type="checkbox"
      .checked=${ht(r)}
      @click=${s}
      @change=${o}
    />`}};Q.styles=[y`
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
    `],c([m({attribute:!1})],Q.prototype,"hass",2),c([g()],Q.prototype,"_expanded",2),c([g()],Q.prototype,"_conditionsHintDismissed",2),c([g()],Q.prototype,"_editing",2),c([g()],Q.prototype,"_sceneEditorError",2),c([g()],Q.prototype,"_viewingTraces",2),c([g()],Q.prototype,"_viewingSimulator",2),c([g()],Q.prototype,"_autoTriggers",2),c([m({attribute:!1})],Q.prototype,"filterCategory",2),Q=c([w("ambience-scopes-view")],Q);var et=class extends b{constructor(){super(...arguments);this.text="";this._open=!1;this._onDocClick=e=>{e.composedPath().includes(this)||this._close()};this._onKeydown=e=>{e.key==="Escape"&&this._close()}}_toggle(e){e.stopPropagation(),this._open?this._close():this._openPopover()}_openPopover(){this._open=!0,document.addEventListener("click",this._onDocClick,!0),document.addEventListener("keydown",this._onKeydown)}_close(){this._open&&(this._open=!1,document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown),this.renderRoot.querySelector(".trigger")?.focus())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onKeydown)}render(){return l`
      <button
        class="trigger"
        data-test="help-trigger"
        aria-label="Help"
        aria-expanded=${this._open}
        @click=${e=>this._toggle(e)}
      >
        ?
      </button>
      ${this._open?l`<div class="popover" role="dialog" data-test="help-popover">
            <slot>${this.text}</slot>
          </div>`:""}
    `}};et.styles=y`
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
  `,c([m()],et.prototype,"text",2),c([g()],et.prototype,"_open",2),et=c([w("ambience-help")],et);var ye=class extends b{constructor(){super(...arguments);this._defaults={name:"Ambience",auto_on_delay_seconds:0,create_switches:!1};this._reapply={enabled:!1,interval_seconds:3600};this._error=""}async connectedCallback(){super.connectedCallback();try{this._defaults=await An(this.hass),this._reapply=await Nn(this.hass)}catch(e){this._error=e.message||String(e)}}async _safeSave(e){try{await e(),this._error=""}catch(i){this._error=i.message||String(i)}}_saveDefaults(){this._safeSave(()=>On(this.hass,this._defaults.name,this._defaults.auto_on_delay_seconds,this._defaults.create_switches))}_onCreateSwitches(e){this._defaults={...this._defaults,create_switches:e.target.checked},this._saveDefaults()}_onDefaultName(e){let i=e.target,r=i.value.trim();if(!r){i.value=this._defaults.name;return}this._defaults={...this._defaults,name:r},this._saveDefaults()}_onPauseMinutes(e){let i=e.target,r=Math.floor(Number(i.value));if(i.value===""||!Number.isFinite(r)||r<0){i.value=String(Math.round(this._defaults.auto_on_delay_seconds/60));return}this._defaults={...this._defaults,auto_on_delay_seconds:r*60},this._saveDefaults()}_saveReapply(){this._safeSave(()=>In(this.hass,this._reapply.enabled,this._reapply.interval_seconds))}_onReapplyEnabled(e){this._reapply={...this._reapply,enabled:e.target.checked},this._saveReapply()}_onReapplyMinutes(e){let i=e.target,r=Math.floor(Number(i.value));if(i.value===""||!Number.isFinite(r)||r<1){i.value=String(Math.round(this._reapply.interval_seconds/60));return}this._reapply={...this._reapply,interval_seconds:r*60},this._saveReapply()}_renderToggle(e,i,r){return customElements.get("ha-switch")?l`<ha-switch
        data-test=${i}
        .checked=${ht(e)}
        @change=${r}
      ></ha-switch>`:l`<input
      data-test=${i}
      type="checkbox"
      .checked=${ht(e)}
      @change=${r}
    />`}render(){return l`
      ${this._error?l`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:""}

      <div class="card">
        <div class="row toggle-row">
          <label>
            ${d(this.hass,"ui.settings_ambience_pause_card","Scope-level pause switch")}
            <ambience-help
              .text=${d(this.hass,"ui.help_pause_switch","Create a switch entity per area/floor/house that pauses Ambience for that scope when turned off.")}
            ></ambience-help>
          </label>
          ${this._renderToggle(this._defaults.create_switches,"pause-switch-enabled",e=>this._onCreateSwitches(e))}
        </div>
        <div class="row">
          <label>
            ${d(this.hass,"ui.settings_ambience_field_name","Switch name")}
            <ambience-help
              .text=${d(this.hass,"ui.help_switch_name","The name used for the per-scope pause switch entities.")}
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
            ${d(this.hass,"ui.settings_ambience_field_pause","Pause for")}
            <ambience-help
              .text=${d(this.hass,"ui.help_pause_for","When a scope's switch is turned off, auto-resume after this many minutes. 0 = stays paused until turned back on.")}
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
            >${d(this.hass,"ui.unit_minutes","minutes")}</span
          >
        </div>
      </div>

      <div class="card">
        <div class="row toggle-row">
          <label>
            ${d(this.hass,"ui.settings_reapply_enable_label","Re-apply scenes after inactivity")}
            <ambience-help
              .text=${d(this.hass,"ui.help_reapply_toggle","After this much inactivity, re-assess and re-send a scope/category's scene commands \u2014 recovers commands that were dropped (e.g. a light that didn't turn off).")}
            ></ambience-help>
          </label>
          ${this._renderToggle(this._reapply.enabled,"reapply-enabled",e=>this._onReapplyEnabled(e))}
        </div>
        <div class="row">
          <label>
            ${d(this.hass,"ui.settings_reapply_interval_label","Reapply after")}
            <ambience-help
              .text=${d(this.hass,"ui.help_reapply_after","Minutes of no dispatch to a scope/category before it is re-applied.")}
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
            >${d(this.hass,"ui.unit_minutes","minutes")}</span
          >
        </div>
      </div>
    `}};ye.styles=y`
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
  `,c([m({attribute:!1})],ye.prototype,"hass",2),c([g()],ye.prototype,"_defaults",2),c([g()],ye.prototype,"_reapply",2),c([g()],ye.prototype,"_error",2),ye=c([w("ambience-ambience-settings")],ye);function bo(){let t=globalThis.crypto;if(t?.randomUUID)return t.randomUUID().replace(/-/g,"");if(t?.getRandomValues){let n=t.getRandomValues(new Uint8Array(16));return Array.from(n,e=>e.toString(16).padStart(2,"0")).join("")}return Array.from({length:4},()=>Math.floor(Math.random()*4294967296).toString(16).padStart(8,"0")).join("")}var he=class extends b{constructor(){super(...arguments);this._categories=[];this._error="";this._editing=null;this._modalError=""}async connectedCallback(){super.connectedCallback();try{this._categories=await Be(this.hass)}catch(e){this._error=e.message||String(e)}}_sorted(){return[...this._categories].sort((e,i)=>e.name.localeCompare(i.name))}_validate(e){let i=e.name.trim();if(i==="")return d(this.hass,"ui.category_name_blank_error","Category names can't be empty.");let r=i.toLocaleLowerCase();return this._categories.some(o=>o.id!==e.id&&o.name.trim().toLocaleLowerCase()===r)?d(this.hass,"ui.category_name_duplicate_error","Two categories can't have the same name."):""}_openEditor(e){this._editing={...e},this._modalError=""}_addCategory(){let e=bo();this._editing={id:e,name:""},this._modalError=""}_closeModal(){this._editing=null,this._modalError=""}_patchDraft(e){this._editing&&(this._editing={...this._editing,...e})}_onName(e){this._patchDraft({name:e.target.value})}_onIcon(e){this._patchDraft({icon:e||void 0})}_onColor(e){this._patchDraft({color:e})}_save(){if(!this._editing)return;let e=this._validate(this._editing);if(e){this._modalError=e;return}let i={...this._editing,name:this._editing.name.trim()},r=this._categories.some(s=>s.id===i.id);this._categories=r?this._categories.map(s=>s.id===i.id?i:s):[...this._categories,i],this._closeModal(),Fn(this.hass,this._categories).then(()=>{window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(s=>{this._error=s.message||String(s)})}_deleteCategory(){if(!this._editing)return;let e=this._editing.id;if(this._categories.length<=1){this._modalError=d(this.hass,"ui.category_delete_blocked_last","You can't delete the last category.");return}let i=this._categories;this._categories=this._categories.filter(r=>r.id!==e),Mn(this.hass,e).then(()=>{this._closeModal(),window.dispatchEvent(new CustomEvent("ambience-categories-changed"))}).catch(r=>{this._categories=i;let s=r.code;s==="category_in_use"?this._modalError=d(this.hass,"ui.category_delete_blocked_in_use","This category still has scenes \u2014 move or delete them first."):s==="category_last"?this._modalError=d(this.hass,"ui.category_delete_blocked_last","You can't delete the last category."):this._modalError=r.message||String(r)})}_renderIconField(){return customElements.get("ha-icon-picker")?l`<ha-icon-picker
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
        ${lr.map(i=>l`<button
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
          title=${d(this.hass,"ui.category_color_none","No colour")}
          aria-label=${d(this.hass,"ui.category_color_none","No colour")}
          aria-pressed=${e==null}
          @click=${()=>this._onColor(void 0)}
        >✕</button>
      </div>
    `}_renderModal(){if(!this._editing)return"";let e=this._categories.some(r=>r.id===this._editing.id),i=e?d(this.hass,"ui.category_edit_title","Edit category"):d(this.hass,"ui.category_add_title","Add category");return l`
      <div
        class="overlay"
        @click=${r=>{r.target.classList.contains("overlay")&&this._closeModal()}}
      >
        <div class="modal">
          <div class="modal-header">
            <h3>${i}</h3>
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
        ${this._sorted().map(e=>{let i=dr(e.color);return l`<button class="category-row" @click=${()=>this._openEditor(e)}>
            <span class="row-icon">${e.icon?l`<ha-icon icon=${e.icon}></ha-icon>`:""}</span>
            <span class="row-swatch ${i?"":"none"}" style=${i?`background: ${i}`:""}></span>
            <span class="row-name">${e.name}</span>
          </button>`})}
      </div>
      <div class="add-row">
        <button class="add" @click=${()=>this._addCategory()}>
          ${d(this.hass,"ui.category_add","+ Add category")}
        </button>
        <ambience-help .text=${d(this.hass,"ui.help_categories_tab","Categories let one scope have several independent winners at once \u2014 one scene wins per category.")}></ambience-help>
      </div>
      ${this._renderModal()}
    `}};he.styles=y`
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
  `,c([m({attribute:!1})],he.prototype,"hass",2),c([g()],he.prototype,"_categories",2),c([g()],he.prototype,"_error",2),c([g()],he.prototype,"_editing",2),c([g()],he.prototype,"_modalError",2),he=c([w("ambience-categories-settings")],he);var be=class extends b{constructor(){super(...arguments);this.conditionName="";this.conditionDescription="";this._expanded=!1}_toggleExpand(){this._expanded=!this._expanded}render(){let e=X(this.hass,this.conditionName);return l`
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
    `}};be.styles=y`
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
  `,c([m({attribute:!1})],be.prototype,"hass",2),c([m()],be.prototype,"conditionName",2),c([m()],be.prototype,"conditionDescription",2),c([g()],be.prototype,"_expanded",2),be=c([w("ambience-condition-card")],be);var pc=/^[a-z][a-z0-9_]*$/;function mc(t){return t.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}var Vt=y`
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
`,se=class extends b{constructor(){super(...arguments);this.takenIds=new Set;this._label="";this._error=""}static{this.styles=Vt}connectedCallback(){super.connectedCallback(),this._label=this._initialLabel()??""}_onLabelInput(e){this._label=e.target.value}_validateName(e){return this.existingId?"":this._label.trim()?!e||!pc.test(e)?d(this.hass,"ui.error_start_letter","Name must start with a letter."):this.takenIds.has(e)?d(this.hass,"ui.error_name_exists","An entry with this name already exists. Choose a different name."):"":d(this.hass,"ui.error_enter_name","Please enter a name.")}_onSave(){let e=this.existingId??mc(this._label),i=this._validateName(e)||this._validateDef();if(i){this._error=i,this.performUpdate();return}this.dispatchEvent(new CustomEvent(this._saveEvent,{detail:{id:e,definition:this._buildDefinition()},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent(this._cancelEvent,{bubbles:!0,composed:!0}))}render(){let e=this.existingId?this._editTitleTemplate().replace("{name}",this._initialLabel()??this.existingId):this._addTitle();return l`
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
    `}};c([m({attribute:!1})],se.prototype,"hass",2),c([m({attribute:!1})],se.prototype,"existingId",2),c([m({attribute:!1})],se.prototype,"takenIds",2),c([g()],se.prototype,"_label",2),c([g()],se.prototype,"_error",2);var tt=class extends se{constructor(){super(...arguments);this.initial={from:{kind:"time",hh:9,mm:0},to:{kind:"time",hh:17,mm:0},label:null};this._def=this.initial}connectedCallback(){super.connectedCallback(),this._def=this.initial}get _saveEvent(){return"period-save"}get _cancelEvent(){return"period-cancel"}_addTitle(){return d(this.hass,"ui.period_modal_add_title","Add custom period")}_editTitleTemplate(){return d(this.hass,"ui.period_modal_edit_title",'Edit "{name}"')}_namePlaceholder(){return d(this.hass,"ui.name_placeholder","e.g. Wind down")}_initialLabel(){return this.initial.label}_onFromChange(e){e.stopPropagation(),this._def={...this._def,from:e.detail.value}}_onToChange(e){e.stopPropagation(),this._def={...this._def,to:e.detail.value}}_renderFields(){return l`
      <div class="row">
        <label style="min-width: 3em;">${d(this.hass,"ui.from_label","From")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
      </div>
      <div class="row">
        <label style="min-width: 3em;">${d(this.hass,"ui.to_label","To")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
      </div>
    `}_validateDef(){return""}_buildDefinition(){return{from:this._def.from,to:this._def.to,label:this._label.trim()||null}}};tt.styles=[Vt,y`
      .row { display: flex; align-items: center; gap: 0.5rem; }
    `],c([m({attribute:!1})],tt.prototype,"initial",2),c([g()],tt.prototype,"_def",2),tt=c([w("ambience-period-edit-modal")],tt);function wo(t,n){if(t.kind==="time")return`${String(t.hh).padStart(2,"0")}:${String(t.mm).padStart(2,"0")}`;let e=$e(n,t.anchor);if(t.offset_min===0)return e;let i=Math.abs(t.offset_min),r=i%60===0?`${i/60}${d(n,"ui.unit_hour_abbr","h")}`:`${i}${d(n,"ui.unit_min_abbr","m")}`;return`${e}${t.offset_min<0?"-":"+"}${r}`}var Wi=class extends re{_list(){return ci(this.hass)}_save(n,e){return Tn(this.hass,n,e)}_label(n,e){return ke(this.hass,n,e)}_formatDef(n){return`${wo(n.from,this.hass)} \u2192 ${wo(n.to,this.hass)}`}_headingKey(){return["ui.periods_heading","Periods"]}_addKey(){return["ui.add_custom_period","+ Add custom period"]}_warningTextKey(){return["ui.period_warning_text","some scenes now reference missing periods:"]}_renderModal(){let n=this._modal;return n.mode==="edit"?l`<ambience-period-edit-modal
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
      ></ambience-period-edit-modal>`:l``}};Wi=c([w("ambience-time-of-day-config")],Wi);var Oe=class extends se{constructor(){super(...arguments);this.initial={min:0,max:100,label:null};this._min=null;this._max=null}connectedCallback(){super.connectedCallback(),this._min=this.initial.min??null,this._max=this.initial.max??null}get _saveEvent(){return"lux-range-save"}get _cancelEvent(){return"lux-range-cancel"}_addTitle(){return d(this.hass,"ui.lux_modal_add_title","Add custom lux range")}_editTitleTemplate(){return d(this.hass,"ui.lux_modal_edit_title",'Edit "{name}"')}_namePlaceholder(){return d(this.hass,"ui.lux_name_placeholder","e.g. Gloomy")}_initialLabel(){return this.initial.label}_onMinInput(e){let i=e.target.value;this._min=i===""?null:Number(i)}_onMaxInput(e){let i=e.target.value;this._max=i===""?null:Number(i)}_renderFields(){return l`
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
    `}_validateDef(){return this._min==null&&this._max==null?d(this.hass,"ui.lux_error_need_bound","Enter a min, a max, or both."):this._min!=null&&this._min<0||this._max!=null&&this._max<0?d(this.hass,"ui.lux_error_negative","Bounds must be 0 or greater."):this._min!=null&&this._max!=null&&this._min>=this._max?d(this.hass,"ui.lux_error_order","Min must be less than max."):""}_buildDefinition(){let e={label:this._label.trim()||null};return this._min!=null&&(e.min=this._min),this._max!=null&&(e.max=this._max),e}};Oe.styles=[Vt,y`
      .row { display: flex; gap: 1rem; }
      .row .field { flex: 1; }
    `],c([m({attribute:!1})],Oe.prototype,"initial",2),c([g()],Oe.prototype,"_min",2),c([g()],Oe.prototype,"_max",2),Oe=c([w("ambience-lux-edit-modal")],Oe);var Ui=class extends re{_list(){return ui(this.hass)}_save(n,e){return Ln(this.hass,n,e)}_label(n,e){return ot(this.hass,n,e)}_formatDef(n){return mr(n.min,n.max,"any")}_headingKey(){return["ui.lux_heading","Lux ranges"]}_addKey(){return["ui.add_custom_lux_range","+ Add custom lux range"]}_warningTextKey(){return["ui.lux_warning_text","some scenes now reference missing lux ranges:"]}_renderModal(){let n=this._modal;return n.mode==="edit"?l`<ambience-lux-edit-modal
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
      ></ambience-lux-edit-modal>`:l``}};Ui=c([w("ambience-lux-config")],Ui);var we=class extends b{constructor(){super(...arguments);this._config={workday_sensor:null,workday_calendar:null};this._warnings=[];this._error=""}async connectedCallback(){super.connectedCallback(),ee(this);try{this._config=await Tt(this.hass)}catch(e){this._error=e.message||String(e)}}async _save(e){this._config=e;try{let i=await Rn(this.hass,e.workday_sensor,e.workday_calendar);this._warnings=i.warnings??[],this._error=""}catch(i){this._error=i.message||String(i);return}window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onSensorChange(e){this._save({...this._config,workday_sensor:e.detail.value||null})}_onCalendarChange(e){this._save({...this._config,workday_calendar:e.detail.value||null})}render(){let e=this._error?l`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`:"";return l`
      ${e}
      <div class="row">
        <label>${d(this.hass,"ui.workday_sensor","Workday sensor")}</label>
        ${Wt(this.hass,"workday_sensor",this._config.workday_sensor,{entity:{integration:"workday",domain:"binary_sensor"}},"binary_sensor.workday",i=>this._onSensorChange({detail:{value:i}}))}
      </div>
      <div class="row">
        <label>${d(this.hass,"ui.workday_calendar","Workday calendar")}</label>
        ${Wt(this.hass,"workday_calendar",this._config.workday_calendar,{entity:{integration:"workday",domain:"calendar"}},"calendar.workday",i=>this._onCalendarChange({detail:{value:i}}))}
      </div>
      ${this._warnings.length?l`
        <div class="warnings">
          <strong>${d(this.hass,"ui.day_warning_prefix","Warning:")}</strong> ${d(this.hass,"ui.day_warning_text","scenes now reference unconfigured entities:")}
          <ul>
            ${this._warnings.map(i=>l`<li>${Re(i)} / "${i.scene_name}" → ${i.reason}</li>`)}
          </ul>
        </div>
      `:""}
    `}};we.styles=y`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `,c([m({attribute:!1})],we.prototype,"hass",2),c([g()],we.prototype,"_config",2),c([g()],we.prototype,"_warnings",2),c([g()],we.prototype,"_error",2),we=c([w("ambience-day-config")],we);var fc=["clear-night","cloudy","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant","exceptional"],xe=class extends b{constructor(){super(...arguments);this._config={entity:null,groups:[]};this._warnings=[];this._expanded=new Set}async connectedCallback(){super.connectedCallback(),ee(this),this._config=await Lt(this.hass)}async _persist(){let e=await Pn(this.hass,this._config.entity,this._config.groups);this._warnings=e.warnings??[],window.dispatchEvent(new CustomEvent("ambience-conditions-changed"))}_onEntityChange(e){this._config={...this._config,entity:e.detail.value||null},this._persist()}_nextGroupId(e){let i=new Set(e.map(r=>r.id));for(let r=1;r<=e.length+1;r++){let s=`group_${r}`;if(!i.has(s))return s}return`group_${e.length+1}`}_addGroup(){let e=this._nextGroupId(this._config.groups);this._config={...this._config,groups:[...this._config.groups,{id:e,label:"",conditions:[]}]},this._expanded=new Set([...this._expanded,e]),this._persist()}_toggleExpand(e){let i=new Set(this._expanded);i.has(e)?i.delete(e):i.add(e),this._expanded=i}_updateGroup(e,i){this._config={...this._config,groups:this._config.groups.map((r,s)=>s===e?{...r,...i}:r)},this._persist()}_removeGroup(e){let i=this._config.groups[e];if(this._config={...this._config,groups:this._config.groups.filter((r,s)=>s!==e)},i){let r=new Set(this._expanded);r.delete(i.id),this._expanded=r}this._persist()}_conditionsSchema(){return[{name:"conditions",selector:{select:{multiple:!0,mode:"dropdown",options:fc.map(e=>({value:e,label:lt(this.hass,e)}))}}}]}_renderConditions(e,i){if(customElements.get("ha-form"))return l`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{conditions:i.conditions}}
        .computeLabel=${()=>""}
        @value-changed=${s=>{s.stopPropagation(),this._updateGroup(e,{conditions:s.detail.value.conditions??[]})}}
      ></ha-form>`;let r=i.conditions.map(s=>lt(this.hass,s));return l`<span class="conditions-list">${r.join(", ")}</span>`}_renderGroup(e,i){let r=this._expanded.has(i.id),s=i.conditions.map(o=>lt(this.hass,o)).join(", ");return l`
      <div class="group">
        <div class="group-header" @click=${()=>this._toggleExpand(i.id)}>
          <span class="chevron ${r?"open":""}">▶</span>
          <span class="label">${i.label}</span>
          <span class="codes">${s}</span>
          <button
            class="icon"
            title=${d(this.hass,"ui.title_delete","Delete")}
            @click=${o=>{o.stopPropagation(),this._removeGroup(e)}}
          >✕</button>
        </div>
        ${r?l`<div class="body" @click=${o=>o.stopPropagation()}>
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
        <label class="section">${d(this.hass,"ui.weather_entity","Weather entity")}</label>
        ${Wt(this.hass,"entity",this._config.entity,{entity:{domain:"weather"}},"weather.home",e=>this._onEntityChange({detail:{value:e}}))}
      </div>

      <h4>${d(this.hass,"ui.groups","Groups")}</h4>
      ${this._config.groups.map((e,i)=>this._renderGroup(i,e))}
      <button class="add" @click=${()=>this._addGroup()}>
        ${d(this.hass,"ui.add_group","+ Add group")}
      </button>

      ${this._warnings.length?l`
        <div class="warnings">
          <strong>${d(this.hass,"ui.day_warning_prefix","Warning:")}</strong>
          ${d(this.hass,"ui.weather_warning_text","scenes now reference an unconfigured weather entity:")}
          <ul>${this._warnings.map(e=>l`<li>${Re(e)} / "${e.scene_name}" → ${e.reason}</li>`)}</ul>
        </div>
      `:""}
    `}};xe.styles=y`
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
  `,c([m({attribute:!1})],xe.prototype,"hass",2),c([g()],xe.prototype,"_config",2),c([g()],xe.prototype,"_warnings",2),c([g()],xe.prototype,"_expanded",2),xe=c([w("ambience-weather-config")],xe);var xo={time_of_day:t=>l`<ambience-time-of-day-config .hass=${t}></ambience-time-of-day-config>`,lux:t=>l`<ambience-lux-config .hass=${t}></ambience-lux-config>`,day:t=>l`<ambience-day-config .hass=${t}></ambience-day-config>`,weather:t=>l`<ambience-weather-config .hass=${t}></ambience-weather-config>`},gc=new Set(Object.keys(xo)),Ne=class extends b{constructor(){super(...arguments);this._conditions=[];this._error=""}async connectedCallback(){super.connectedCallback();try{this._conditions=await di(this.hass)}catch(e){this._error=e.message||String(e)}}render(){let e=this._conditions.filter(i=>gc.has(i.name)).slice().sort((i,r)=>r.priority-i.priority);return l`
      <div class="tab-heading">
        <span>${d(this.hass,"ui.settings_tab_conditions","Conditions")}</span>
        <ambience-help .text=${d(this.hass,"ui.help_conditions_tab","Conditions are the inputs scenes match on (time of day, presence, weather, \u2026). A scene wins when all its conditions pass.")}></ambience-help>
      </div>
      ${this._error?l`<p class="error">${this._error}</p>`:""}
      ${e.map(i=>l`
        <ambience-condition-card .hass=${this.hass} .conditionName=${i.name} .conditionDescription=${i.description}>
          ${xo[i.name]?.(this.hass)??l``}
        </ambience-condition-card>
      `)}
    `}};Ne.styles=y`
    :host { display: block; }
    .error { color: var(--error-color, #d32f2f); }
    .tab-heading {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }
  `,c([m({attribute:!1})],Ne.prototype,"hass",2),c([g()],Ne.prototype,"_conditions",2),c([g()],Ne.prototype,"_error",2),Ne=c([w("ambience-conditions-settings")],Ne);var R=class extends b{constructor(){super(...arguments);this._actions=[];this._services=[];this._schemas={};this._fieldSchemas={};this._addSchema=[];this._serviceById=new Map;this._availableServices=[];this._expanded=new Set;this._adding=!1;this._warnings=[];this._loadError=null;this._saveError=null;this._loaded=!1;this._editingDefault=null;this._editingOriginalValue=void 0;this._editingOriginalHad=!1;this._drag=new pt(this,(e,i)=>{let r=[...this._actions],[s]=r.splice(e,1);r.splice(i,0,s),this._actions=r,this._autoSave()});this._onDocPointerDown=e=>{if(!this._adding&&this._editingDefault===null)return;let i=e.composedPath(),r=i.some(s=>s instanceof Element&&R._OVERLAY_TAG_RE.test(s.localName));this._collapseAddFormOnClickAway(i,r),this._cancelEditingDefaultOnClickAway(i,r)}}_collapseAddFormOnClickAway(e,i){if(!this._adding)return;let r=this.shadowRoot?.querySelector(".add-row");!(!!r&&e.includes(r))&&!i&&(this._adding=!1)}_cancelEditingDefaultOnClickAway(e,i){if(this._editingDefault===null)return;let r=this.shadowRoot?.querySelector(`.field-row-editor[data-editing-key="${this._editingDefault}"]`);(!r||!e.includes(r))&&!i&&this._cancelEditingDefault()}connectedCallback(){super.connectedCallback(),document.addEventListener("pointerdown",this._onDocPointerDown),customElements.get("ha-service-picker")||customElements.whenDefined("ha-service-picker").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._onDocPointerDown)}_startEditingDefault(e,i){let s=this._actions.find(o=>o.id===e)?.defaults??{};this._editingOriginalHad=i in s,this._editingOriginalValue=s[i],this._editingDefault=`${e}:${i}`}_saveEditingDefault(){this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1,this._autoSave()}_cancelEditingDefault(){let e=this._editingDefault;if(e){let i=e.indexOf(":"),r=e.slice(0,i),s=e.slice(i+1);this._actions=this._actions.map(o=>{if(o.id!==r)return o;let a={...o.defaults??{}};return this._editingOriginalHad?a[s]=this._editingOriginalValue:delete a[s],{...o,defaults:a}})}this._editingDefault=null,this._editingOriginalValue=void 0,this._editingOriginalHad=!1}async firstUpdated(){await this._reload()}willUpdate(e){if(e.has("_actions")||e.has("_schemas")){let i={};for(let r of this._actions){let s=this._schemas[r.id];if(s)for(let[o,a]of Object.entries(s.fields))i[`${r.id}:${o}`]=[{name:o,selector:a.selector??{text:{}},required:!1}]}this._fieldSchemas=i}if(e.has("_services")&&(this._serviceById=new Map(this._services.map(i=>[i.id,i]))),e.has("_actions")||e.has("_services")){let i=new Set(this._actions.map(r=>r.id));this._availableServices=this._services.filter(r=>!i.has(r.id)),this._addSchema=[{name:"service",selector:{select:{options:this._availableServices.map(r=>({value:r.id,label:this._addOptionLabel(r.id)})),custom_value:!0,mode:"dropdown",sort:!0}}}]}}async _reload(){this._loadError=null;try{let[e,i]=await Promise.all([Ct(this.hass),En(this.hass)]);this._actions=e,this._services=i}catch(e){this._loadError=e instanceof Error?e.message:String(e);return}await Promise.all(this._actions.map(e=>this._ensureSchema(e.id))),this._loaded=!0}async _ensureSchema(e){if(!(e in this._schemas))try{let i=await Ee(this.hass,e);this._schemas={...this._schemas,[e]:i}}catch{this._schemas={...this._schemas,[e]:null}}}_setShowInEditor(e,i,r){this._actions=this._actions.map(s=>{if(s.id!==e)return s;let o=new Set(s.visible_fields??[]);return r?o.add(i):o.delete(i),{...s,visible_fields:[...o]}}),this._autoSave()}_setDefault(e,i,r){this._actions=this._actions.map(s=>s.id!==e?s:{...s,defaults:{...s.defaults??{},[i]:r}})}_clearDefault(e,i){this._actions=this._actions.map(r=>{if(r.id!==e)return r;let s={...r.defaults??{}};return delete s[i],{...r,defaults:s}})}_setLabel(e,i){this._actions=this._actions.map(r=>r.id===e?{...r,label:i}:r)}_toggleExpand(e){this._expanded.has(e)?this._expanded=new Set:(this._expanded=new Set([e]),this._ensureSchema(e))}async _addService(e){if(e&&this._services.some(i=>i.id===e)){if(this._actions.some(i=>i.id===e)){this._expanded=new Set([e]),this._adding=!1;return}await this._ensureSchema(e),this._actions=[...this._actions,{id:e,label:this._labelForService(e),visible_fields:[],defaults:{}}],this._expanded=new Set([e]),this._adding=!1,this._autoSave()}}_removeService(e){this._actions=this._actions.filter(r=>r.id!==e);let i=new Set(this._expanded);i.delete(e),this._expanded=i,this._autoSave()}async _autoSave(){this._saveError=null,this._warnings=[];try{let e=await kn(this.hass,this._actions);this._warnings=e.warnings??[],window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"))}catch(e){this._saveError=e instanceof Error?e.message:String(e)}}render(){return this._loadError!==null?l`
        <div class="error">${this._loadError}</div>
        <button @click=${()=>this._reload()}>${d(this.hass,"ui.retry","Retry")}</button>
      `:this._loaded?l`
      <section>
        <div class="section-heading">
          <span>${d(this.hass,"ui.settings_tab_actions","Actions")}</span>
          <ambience-help .text=${d(this.hass,"ui.help_actions_tab","Actions are the service calls a scene runs. Define them here so scenes can reuse them.")}></ambience-help>
        </div>
        ${this._renderWarnings()}
        ${this._saveError?l`<div class="error">${this._saveError}</div>`:""}
        ${this._actions.map((e,i)=>this._renderCard(e,i))}
        ${this._renderAdd()}
      </section>
    `:l`<div>${d(this.hass,"ui.loading","Loading\u2026")}</div>`}_renderCard(e,i){let r=this._schemas[e.id],s=this._expanded.has(e.id);return l`
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
            title=${d(this.hass,"ui.drag_to_reorder","Drag to reorder")}
            @pointerdown=${o=>this._drag.start(i,o)}
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
        ${s?this._renderBody(e,r):""}
      </div>
    `}_renderBody(e,i){return l`
      <div class="body">
        ${this._renderFieldsSection(e,i)}
      </div>
    `}_renderFieldsSection(e,i){if(i===null)return l`<p class="body-help warning">
        ${d(this.hass,"ui.service_unavailable","Service not available in this HA instance.")}
      </p>`;if(i===void 0)return l`<p class="body-help">${d(this.hass,"ui.loading","Loading\u2026")}</p>`;let r=Object.entries(i.fields).slice().sort(([s],[o])=>s.localeCompare(o));return r.length===0?l`<p class="body-help">
        ${d(this.hass,"ui.service_has_no_fields","This service has no fields.")}
      </p>`:l`
      <p class="body-help">
        ${d(this.hass,"ui.actions_field_help_show","Tick a checkbox to make a field editable per scene.")}
        <ambience-help .text=${d(this.hass,"ui.help_show_in_scene_editor","Show this field in the scene editor so each scene can set it. Leave off to send a fixed default instead.")}></ambience-help>
        ${d(this.hass,"ui.actions_field_help_default","Set a default to pre-fill it.")}
        <ambience-help .text=${d(this.hass,"ui.help_set_default","A value sent automatically when the action runs. Scenes can override it if the field is also shown in the editor.")}></ambience-help>
      </p>
      ${r.map(([s,o])=>this._renderFieldRow(e,s,o))}
    `}_formatDefaultSummary(e){return e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}_defaultUnitSuffix(e,i){let r=this._schemas[e]?.fields?.[i];if(!r||typeof r!="object")return"";let s=ki(r.selector);return s?` ${s}`:""}_renderFieldRow(e,i,r){let s=(e.visible_fields??[]).includes(i),o=i in(e.defaults??{}),a=`${e.id}:${i}`,u=this._editingDefault===a;return l`
      <div class="field-row">
        <!-- Row 1: [checkbox] [name] [default summary] -->
        <div class="field-row-main">
          <div class="checkbox-cell">
            <input
              type="checkbox"
              data-show-in-editor=${i}
              title=${d(this.hass,"ui.show_in_scene_editor","Show in scene editor")}
              .checked=${s}
              @change=${h=>this._setShowInEditor(e.id,i,h.target.checked)}
            />
          </div>
          <span class="name">
            ${r.name||I(i)}
            ${r.name?l` <small class="field-id">(${i})</small>`:""}
            ${r.description?l` <small>— ${r.description}</small>`:""}
          </span>
          <div class="summary-cell">
            ${u?l`<span class="summary-cell-editing">${d(this.hass,"ui.editing","Editing\u2026")}</span>`:o?l`<button
                    class="default-summary"
                    data-default-summary=${i}
                    @click=${h=>{h.stopPropagation(),this._startEditingDefault(e.id,i)}}
                  >${d(this.hass,"ui.default_prefix","Default: ")}${this._formatDefaultSummary(e.defaults?.[i])}${this._defaultUnitSuffix(e.id,i)}</button>`:l`<button
                    class="set-default-btn"
                    data-set-default=${i}
                    @click=${h=>{h.stopPropagation(),this._startEditingDefault(e.id,i)}}
                  >+ ${d(this.hass,"ui.set_default","Set default")}</button>`}
          </div>
        </div>
        <!-- Row 2: full editor (only when editing) -->
        ${u?l`<div
              class="field-row-editor"
              data-editing-key=${a}
            >
              <div class="editor-line">
                <div class="default-editor">${this._renderDefaultEditor(e,i,r)}</div>
                <button
                  class="clear-default"
                  data-clear-default=${i}
                  title=${d(this.hass,"ui.clear_default","Clear default")}
                  @click=${h=>{h.stopPropagation(),this._clearDefault(e.id,i),this._saveEditingDefault()}}
                >✕</button>
              </div>
              <div class="editor-actions">
                <button
                  class="cancel-default"
                  data-cancel-default=${i}
                  @click=${h=>{h.stopPropagation(),this._cancelEditingDefault()}}
                >${d(this.hass,"ui.cancel","Cancel")}</button>
                <button
                  class="save-default"
                  data-save-default=${i}
                  @click=${h=>{h.stopPropagation(),this._saveEditingDefault()}}
                >${d(this.hass,"ui.save","Save")}</button>
              </div>
            </div>`:""}
      </div>
    `}_renderDefaultEditor(e,i,r){let s=e.defaults?.[i],o=this._fieldSchemas[`${e.id}:${i}`]??[];return customElements.get("ha-form")?l`<ha-form
        .hass=${this.hass}
        .schema=${o}
        .data=${{[i]:s??""}}
        .computeLabel=${()=>""}
        @value-changed=${a=>{a.stopPropagation(),this._setDefault(e.id,i,a.detail.value[i])}}
      ></ha-form>`:l`<input
      data-default-value=${i}
      .value=${s==null?"":String(s)}
      @input=${a=>this._setDefault(e.id,i,a.target.value)}
    />`}_renderAdd(){return this._adding?l`<div class="add-row">
      ${this._renderAddPicker()}
      <button data-action="cancel-add" @click=${()=>{this._adding=!1}}>
        ${d(this.hass,"ui.cancel","Cancel")}
      </button>
    </div>`:l`<div class="add-row">
        <button class="add" data-action="add" @click=${()=>{this._adding=!0}}>
          + ${d(this.hass,"ui.add_action_button","Add action")}
        </button>
      </div>`}_labelForService(e){return this._serviceById.get(e)?.name?.trim()||ri(e)}_addOptionLabel(e){return`${this._labelForService(e)} (${e})`}_renderAddPicker(){return customElements.get("ha-service-picker")?l`<ha-service-picker
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
        .computeLabel=${()=>d(this.hass,"ui.pick_service","Pick a service")}
        @value-changed=${e=>{e.stopPropagation();let i=e.detail.value.service;i&&this._addService(i)}}
      ></ha-form>`:l`<select
      data-add-service
      @change=${e=>this._addService(e.target.value)}
    >
      <option value="">— ${d(this.hass,"ui.pick_service","Pick a service")} —</option>
      ${this._availableServices.map(e=>l`<option value=${e.id}>${this._addOptionLabel(e.id)}</option>`)}
    </select>`}_renderWarnings(){return this._warnings.length===0?"":l`<ul class="warning">
      ${this._warnings.map(e=>l`<li>
          ${Re(e)}${e.scene_name?l` — <em>${e.scene_name}</em>`:""}: ${e.reason}
        </li>`)}
    </ul>`}};R.styles=y`
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
    .section-heading {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }
  `,R._OVERLAY_TAG_RE=/vaadin|combo-box|overlay|listbox|menu|mwc-|md-/i,c([m({attribute:!1})],R.prototype,"hass",2),c([g()],R.prototype,"_actions",2),c([g()],R.prototype,"_services",2),c([g()],R.prototype,"_schemas",2),c([g()],R.prototype,"_fieldSchemas",2),c([g()],R.prototype,"_addSchema",2),c([g()],R.prototype,"_expanded",2),c([g()],R.prototype,"_adding",2),c([g()],R.prototype,"_warnings",2),c([g()],R.prototype,"_loadError",2),c([g()],R.prototype,"_saveError",2),c([g()],R.prototype,"_loaded",2),c([g()],R.prototype,"_editingDefault",2),c([g()],R.prototype,"_editingOriginalValue",2),c([g()],R.prototype,"_editingOriginalHad",2),R=c([w("ambience-actions-settings")],R);var Ie=class extends b{constructor(){super(...arguments);this._tab="categories"}willUpdate(e){e.has("initialTab")&&this.initialTab&&(this._tab=this.initialTab)}render(){return l`
      <nav>
        <button class=${this._tab==="categories"?"active":""} @click=${()=>{this._tab="categories"}}>
          <ha-icon icon="mdi:shape-outline"></ha-icon>${d(this.hass,"ui.settings_tab_categories","Categories")}
        </button>
        <button class=${this._tab==="conditions"?"active":""} @click=${()=>{this._tab="conditions"}}>
          <ha-icon icon="mdi:filter-variant"></ha-icon>${d(this.hass,"ui.settings_tab_conditions","Conditions")}
        </button>
        <button class=${this._tab==="actions"?"active":""} @click=${()=>{this._tab="actions"}}>
          <ha-icon icon="mdi:flash"></ha-icon>${d(this.hass,"ui.settings_tab_actions","Actions")}
        </button>
        <button class=${this._tab==="ambience"?"active":""} @click=${()=>{this._tab="ambience"}}>
          <ha-icon icon="mdi:home-lightbulb"></ha-icon>${d(this.hass,"ui.settings_tab_ambience","Advanced")}
        </button>
      </nav>
      <div class="content">
        ${this._tab==="categories"?l`<ambience-categories-settings .hass=${this.hass}></ambience-categories-settings>`:this._tab==="conditions"?l`<ambience-conditions-settings .hass=${this.hass}></ambience-conditions-settings>`:this._tab==="actions"?l`<ambience-actions-settings .hass=${this.hass}></ambience-actions-settings>`:l`<ambience-ambience-settings .hass=${this.hass}></ambience-ambience-settings>`}
      </div>
    `}};Ie.styles=y`
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
  `,c([m({attribute:!1})],Ie.prototype,"hass",2),c([m({attribute:!1})],Ie.prototype,"initialTab",2),c([g()],Ie.prototype,"_tab",2),Ie=c([w("ambience-settings-view")],Ie);var Fe=class extends b{constructor(){super();this.open=!1;new He(this,()=>this._close())}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.open?l`
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        @click=${e=>e.stopPropagation()}
      >
        <div class="header">
          <h3>${d(this.hass,"ui.tab_settings","Settings")}</h3>
          <button class="close" @click=${this._close} aria-label=${d(this.hass,"ui.close","Close")}>✕</button>
        </div>
        <div class="body">
          <ambience-settings-view
            .hass=${this.hass}
            .initialTab=${this.initialTab}
          ></ambience-settings-view>
        </div>
      </div>
    `:k}};Fe.styles=y`
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
  `,c([m({attribute:!1})],Fe.prototype,"hass",2),c([m({type:Boolean,reflect:!0})],Fe.prototype,"open",2),c([m({attribute:!1})],Fe.prototype,"initialTab",2),Fe=c([w("ambience-settings-modal")],Fe);var it=class extends b{constructor(){super(...arguments);this._settingsOpen=!1;this._filterCategory=li();this._onOpenSettings=e=>{let i=e.detail?.tab;this._settingsTab=i,this._settingsOpen=!0};this._onFilterChanged=e=>{this._filterCategory=e.detail?.category??"",e.stopPropagation()}}static{this.styles=y`
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
  `}connectedCallback(){super.connectedCallback(),ee(this),this.addEventListener("ambience-open-settings",this._onOpenSettings),this.addEventListener("ambience-filter-changed",this._onFilterChanged)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("ambience-open-settings",this._onOpenSettings),this.removeEventListener("ambience-filter-changed",this._onFilterChanged)}render(){let e={dark:!!this.hass.themes?.darkMode,title:d(this.hass,"ui.panel_title","Ambience")};return l`
      <header>
        <div class="bar">
          <h1 class="brand">
            ${ln(e)}
            ${dn(e)}
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
    `}};c([m({attribute:!1})],it.prototype,"hass",2),c([g()],it.prototype,"_settingsOpen",2),c([g()],it.prototype,"_settingsTab",2),c([g()],it.prototype,"_filterCategory",2);rn("ambience-frontend",it);export{it as AmbienceFrontend};
